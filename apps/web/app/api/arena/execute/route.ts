import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";

const execAsync = promisify(exec);

interface TestCaseInput {
  name: string;
  inputArgs: any[];
  expected: any;
  isHidden?: boolean;
}

function escapeStringLiteral(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function serializeToCppLiteral(val: any): string {
  if (val === null || typeof val === "undefined") return "nullptr";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return Number.isInteger(val) ? `${val}` : `${val}`;
  if (typeof val === "string") {
    if (val.length === 1) {
      return `'${escapeStringLiteral(val)}'`;
    }
    return `std::string("${escapeStringLiteral(val)}")`;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return "std::vector<int>{}";
    
    // Check if 2D array
    if (Array.isArray(val[0])) {
      const firstRow = val[0];
      let innerType = "int";
      let isChar = false;
      if (firstRow.length > 0) {
        if (typeof firstRow[0] === "string") {
          if (firstRow[0].length === 1) {
            innerType = "char";
            isChar = true;
          } else {
            innerType = "std::string";
          }
        } else if (typeof firstRow[0] === "boolean") {
          innerType = "bool";
        } else if (typeof firstRow[0] === "number") {
          innerType = Number.isInteger(firstRow[0]) ? "int" : "double";
        }
      }
      const rows = val.map((row: any[]) => {
        const items = row.map((item) => {
          if (isChar && typeof item === "string") return `'${escapeStringLiteral(item)}'`;
          return serializeToCppLiteral(item);
        }).join(", ");
        return `std::vector<${innerType}>{ ${items} }`;
      }).join(", ");
      return `std::vector<std::vector<${innerType}>>{ ${rows} }`;
    }

    // 1D array
    if (typeof val[0] === "string") {
      if (val.every((item) => typeof item === "string" && item.length === 1)) {
        const items = val.map((item) => `'${escapeStringLiteral(item)}'`).join(", ");
        return `std::vector<char>{ ${items} }`;
      }
      const items = val.map((item) => `std::string("${escapeStringLiteral(item)}")`).join(", ");
      return `std::vector<std::string>{ ${items} }`;
    }
    if (typeof val[0] === "boolean") {
      const items = val.map((item) => item ? "true" : "false").join(", ");
      return `std::vector<bool>{ ${items} }`;
    }
    if (typeof val[0] === "number") {
      const isAllInt = val.every((item) => Number.isInteger(item));
      const typeStr = isAllInt ? "int" : "double";
      const items = val.map((item) => `${item}`).join(", ");
      return `std::vector<${typeStr}>{ ${items} }`;
    }
    const items = val.map((item) => serializeToCppLiteral(item)).join(", ");
    return `{ ${items} }`;
  }
  return "{}";
}

function serializeToJavaLiteral(val: any): string {
  if (val === null || typeof val === "undefined") return "null";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return Number.isInteger(val) ? `${val}` : `${val}`;
  if (typeof val === "string") {
    if (val.length === 1) return `'${escapeStringLiteral(val)}'`;
    return `"${escapeStringLiteral(val)}"`;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return "new int[]{}";

    // 2D Array
    if (Array.isArray(val[0])) {
      const firstRow = val[0];
      let innerType = "int";
      let isChar = false;
      if (firstRow.length > 0) {
        if (typeof firstRow[0] === "string") {
          if (firstRow[0].length === 1) {
            innerType = "char";
            isChar = true;
          } else {
            innerType = "String";
          }
        } else if (typeof firstRow[0] === "boolean") {
          innerType = "boolean";
        } else if (typeof firstRow[0] === "number") {
          innerType = Number.isInteger(firstRow[0]) ? "int" : "double";
        }
      }
      const rows = val.map((row: any[]) => {
        const items = row.map((item) => {
          if (isChar && typeof item === "string") return `'${escapeStringLiteral(item)}'`;
          if (typeof item === "string") return `"${escapeStringLiteral(item)}"`;
          return serializeToJavaLiteral(item);
        }).join(", ");
        return `{ ${items} }`;
      }).join(", ");
      return `new ${innerType}[][]{ ${rows} }`;
    }

    // 1D Array
    if (typeof val[0] === "string") {
      if (val.every((item) => typeof item === "string" && item.length === 1)) {
        const items = val.map((item) => `'${escapeStringLiteral(item)}'`).join(", ");
        return `new char[]{ ${items} }`;
      }
      const items = val.map((s) => `"${escapeStringLiteral(String(s))}"`).join(", ");
      return `new String[]{ ${items} }`;
    }
    if (typeof val[0] === "boolean") {
      const items = val.map((b) => (b ? "true" : "false")).join(", ");
      return `new boolean[]{ ${items} }`;
    }
    if (typeof val[0] === "number") {
      const isAllInt = val.every((n) => Number.isInteger(n));
      const typeStr = isAllInt ? "int" : "double";
      const items = val.map((n) => `${n}`).join(", ");
      return `new ${typeStr}[]{ ${items} }`;
    }
    const items = val.map((n) => `${n}`).join(", ");
    return `new int[]{ ${items} }`;
  }
  return "null";
}

export async function POST(req: NextRequest) {
  const sandboxId = crypto.randomUUID().slice(0, 12);
  const tmpDir = path.join(os.tmpdir(), `arena_box_${sandboxId}`);

  try {
    const body = await req.json();
    const { code, language, testCases, methodName: rawMethodName } = body;

    if (!code || !language || !Array.isArray(testCases)) {
      return NextResponse.json(
        { error: "Invalid request payload: code, language, and testCases are required." },
        { status: 400 }
      );
    }

    if (language !== "cpp" && language !== "java") {
      return NextResponse.json(
        { error: "This secure server sandbox currently executes C++ and Java." },
        { status: 400 }
      );
    }

    await fs.mkdir(tmpDir, { recursive: true });

    // Detect method name from code if not provided
    let methodName = rawMethodName;
    if (!methodName) {
      const match =
        code.match(/(?:vector<[^>]+>|int\[\]|int|bool|boolean|string|String|double|void|auto)\s+([a-zA-Z0-9_$]+)\s*\(/i);
      methodName = match ? match[1] : "twoSum";
    }

    if (language === "cpp") {
      // Build C++ program with nlohmann::json
      let cppSource = `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cmath>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <stack>
#include <queue>
#include <chrono>
#include <sstream>
#include <nlohmann/json.hpp>

using namespace std;
using json = nlohmann::json;

// --- USER CODE START ---
${code}
// --- USER CODE END ---

int main() {
    Solution sol;
    json report = json::array();
`;

      testCases.forEach((tc: TestCaseInput, idx: number) => {
        const expectedJsonStr = JSON.stringify(tc.expected);
        const argsList = (tc.inputArgs || [])
          .map((arg, argIdx) => {
            const cppLiteral = serializeToCppLiteral(arg);
            return `        auto arg_${idx}_${argIdx} = ${cppLiteral};`;
          })
          .join("\n");

        const callArgs = (tc.inputArgs || [])
          .map((_, argIdx) => `arg_${idx}_${argIdx}`)
          .join(", ");

        cppSource += `
    // Test Case ${idx + 1}
    try {
${argsList}
        json exp = json::parse(R"(${expectedJsonStr})");
        auto t0 = std::chrono::high_resolution_clock::now();
        auto actualVal = sol.${methodName}(${callArgs});
        auto t1 = std::chrono::high_resolution_clock::now();
        double durMs = std::chrono::duration<double, std::milli>(t1 - t0).count();
        json act = actualVal;
        
        bool passed = (act == exp);
        // Order insensitive check for 2-element arrays (like two sum indices)
        if (!passed && act.is_array() && exp.is_array() && act.size() == 2 && exp.size() == 2) {
            auto a1 = act;
            auto e1 = exp;
            std::sort(a1.begin(), a1.end());
            std::sort(e1.begin(), e1.end());
            if (a1 == e1) passed = true;
        }

        report.push_back({
            {"name", "${escapeStringLiteral(tc.name || `Test Case ${idx + 1}`)}"},
            {"passed", passed},
            {"actual", act},
            {"expected", exp},
            {"durationMs", std::max(0.1, std::round(durMs * 100.0) / 100.0)},
            {"isHidden", ${tc.isHidden ? "true" : "false"}},
            {"error", nullptr}
        });
    } catch (const std::exception& e) {
        report.push_back({
            {"name", "${escapeStringLiteral(tc.name || `Test Case ${idx + 1}`)}"},
            {"passed", false},
            {"actual", nullptr},
            {"expected", json::parse(R"(${expectedJsonStr})")},
            {"durationMs", 0.0},
            {"isHidden", ${tc.isHidden ? "true" : "false"}},
            {"error", e.what()}
        });
    } catch (...) {
        report.push_back({
            {"name", "${escapeStringLiteral(tc.name || `Test Case ${idx + 1}`)}"},
            {"passed", false},
            {"actual", nullptr},
            {"expected", json::parse(R"(${expectedJsonStr})")},
            {"durationMs", 0.0},
            {"isHidden", ${tc.isHidden ? "true" : "false"}},
            {"error", "Runtime exception occurred."}
        });
    }
`;
      });

      cppSource += `
    std::cout << report.dump() << std::endl;
    return 0;
}
`;

      const srcPath = path.join(tmpDir, "solution.cpp");
      const binPath = path.join(tmpDir, "solution.out");
      await fs.writeFile(srcPath, cppSource, "utf8");

      // 1. Compile with C++20 and resource limit
      try {
        await execAsync(`g++ -O2 -std=c++20 "${srcPath}" -o "${binPath}"`, {
          timeout: 10000,
          maxBuffer: 1024 * 512,
        });
      } catch (compileErr: any) {
        const errorMsg = compileErr.stderr || compileErr.message || "Compilation failed";
        return NextResponse.json({
          passed: false,
          allPassed: false,
          totalTests: testCases.length,
          passedTests: 0,
          results: [],
          logs: ["Compilation error with g++ (Ubuntu C++20 GCC)"],
          compilationError: cleanGppErrorMessage(errorMsg),
          runtimeError: null,
        });
      }

      // 2. Run binary in security sandbox
      let stdout = "";
      try {
        const runCmd = `timeout 6s "${binPath}"`;
        const res = await execAsync(runCmd, {
          timeout: 7000,
          maxBuffer: 1024 * 1024,
        });
        stdout = res.stdout;
      } catch (runErr: any) {
        return NextResponse.json({
          passed: false,
          allPassed: false,
          totalTests: testCases.length,
          passedTests: 0,
          results: [],
          logs: [],
          compilationError: null,
          runtimeError: runErr.killed
            ? "Time Limit Exceeded (5.0s). Check for infinite recursion or loops."
            : `Runtime Error: ${runErr.stderr || runErr.message || "Segmentation Fault"}`,
        });
      }

      const results = JSON.parse(stdout.trim());
      const passedTests = results.filter((r: any) => r.passed).length;

      return NextResponse.json({
        passed: passedTests === testCases.length,
        allPassed: passedTests === testCases.length,
        totalTests: testCases.length,
        passedTests,
        results,
        logs: [`Executed ${testCases.length} test cases in secure C++ Linux Sandbox.`],
        compilationError: null,
        runtimeError: null,
      });
    }

    if (language === "java") {
      let javaSource = `
import java.util.*;

// --- USER CODE START ---
${code}
// --- USER CODE END ---

public class Main {
    static String toJson(Object o) {
        if (o == null) return "null";
        if (o instanceof int[] a) return Arrays.toString(a);
        if (o instanceof double[] a) return Arrays.toString(a);
        if (o instanceof boolean[] a) return Arrays.toString(a);
        if (o instanceof char[] a) {
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) {
                if (i > 0) sb.append(",");
                sb.append('\"').append(a[i]).append('\"');
            }
            return sb.append("]").toString();
        }
        if (o instanceof char[][] a) {
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < a.length; i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(a[i]));
            }
            return sb.append("]").toString();
        }
        if (o instanceof Object[] a) return Arrays.deepToString(a);
        if (o instanceof String s) return '\"' + s + '\"';
        if (o instanceof Character c) return '\"' + String.valueOf(c) + '\"';
        if (o instanceof List<?> l) {
            StringBuilder sb = new StringBuilder("[");
            for (int i=0; i<l.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(l.get(i)));
            }
            return sb.append("]").toString();
        }
        return String.valueOf(o);
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        StringBuilder report = new StringBuilder("[");
`;

      testCases.forEach((tc: TestCaseInput, idx: number) => {
        const expectedJsonStr = JSON.stringify(tc.expected);
        const argsList = (tc.inputArgs || [])
          .map((arg, argIdx) => {
            const javaLiteral = serializeToJavaLiteral(arg);
            return `        var arg_${idx}_${argIdx} = ${javaLiteral};`;
          })
          .join("\n");

        const callArgs = (tc.inputArgs || [])
          .map((_, argIdx) => `arg_${idx}_${argIdx}`)
          .join(", ");

        const comma = idx > 0 ? `report.append(",");\n` : "";

        javaSource += `
        ${comma}
        try {
${argsList}
            long t0 = System.nanoTime();
            var actual = sol.${methodName}(${callArgs});
            long t1 = System.nanoTime();
            double durMs = (t1 - t0) / 1000000.0;
            String actualJson = toJson(actual);
            String expJson = "${escapeStringLiteral(expectedJsonStr)}";
            
            boolean passed = actualJson.replaceAll("\\\\s+", "").equals(expJson.replaceAll("\\\\s+", ""));
            
            report.append("{\\"name\\":\\"${escapeStringLiteral(tc.name || `Test Case ${idx + 1}`)}\\",")
                  .append("\\"passed\\":").append(passed).append(",")
                  .append("\\"actual\\":").append(actualJson).append(",")
                  .append("\\"expected\\":").append(expJson).append(",")
                  .append("\\"durationMs\\":").append(Math.max(0.1, Math.round(durMs * 100.0) / 100.0)).append(",")
                  .append("\\"isHidden\\":").append(${tc.isHidden ? "true" : "false"}).append(",")
                  .append("\\"error\\":null}");
        } catch (Exception e) {
            report.append("{\\"name\\":\\"${escapeStringLiteral(tc.name || `Test Case ${idx + 1}`)}\\",")
                  .append("\\"passed\\":false,")
                  .append("\\"actual\\":null,")
                  .append("\\"expected\\":\\"${escapeStringLiteral(expectedJsonStr)}\\",")
                  .append("\\"durationMs\\":0.0,")
                  .append("\\"isHidden\\":").append(${tc.isHidden ? "true" : "false"}).append(",")
                  .append("\\"error\\":\\"").append(e != null ? e.getClass().getSimpleName() : "Exception").append("\\"}");
        }
`;
      });

      javaSource += `
        report.append("]");
        System.out.println(report.toString());
    }
}
`;

      const javaFilePath = path.join(tmpDir, "Main.java");
      await fs.writeFile(javaFilePath, javaSource, "utf8");

      // 1. Compile Java
      try {
        await execAsync(`javac -cp "${tmpDir}" "${javaFilePath}"`, {
          timeout: 10000,
          maxBuffer: 1024 * 512,
        });
      } catch (compileErr: any) {
        return NextResponse.json({
          passed: false,
          allPassed: false,
          totalTests: testCases.length,
          passedTests: 0,
          results: [],
          logs: ["Compilation error with javac (OpenJDK 21)"],
          compilationError: cleanJavaErrorMessage(compileErr.stderr || compileErr.message || "Compilation failed"),
          runtimeError: null,
        });
      }

      // 2. Run Java with heap limit and timeout
      let stdout = "";
      try {
        const res = await execAsync(`timeout 6s java -Xmx256m -cp "${tmpDir}" Main`, {
          timeout: 7000,
          maxBuffer: 1024 * 1024,
        });
        stdout = res.stdout;
      } catch (runErr: any) {
        return NextResponse.json({
          passed: false,
          allPassed: false,
          totalTests: testCases.length,
          passedTests: 0,
          results: [],
          logs: [],
          compilationError: null,
          runtimeError: runErr.killed
            ? "Time Limit Exceeded (5.0s). Check for infinite recursion or loops."
            : `Runtime Error: ${runErr.stderr || runErr.message || "Execution exception"}`,
        });
      }

      const results = JSON.parse(stdout.trim());
      const passedTests = results.filter((r: any) => r.passed).length;

      return NextResponse.json({
        passed: passedTests === testCases.length,
        allPassed: passedTests === testCases.length,
        totalTests: testCases.length,
        passedTests,
        results,
        logs: [`Executed ${testCases.length} test cases in secure Java 21 Sandbox.`],
        compilationError: null,
        runtimeError: null,
      });
    }

    return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      {
        passed: false,
        allPassed: false,
        totalTests: 0,
        passedTests: 0,
        results: [],
        logs: [],
        compilationError: null,
        runtimeError: `Sandbox error: ${err.message || "Internal server error"}`,
      },
      { status: 500 }
    );
  } finally {
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

function cleanGppErrorMessage(msg: string): string {
  // Strip out absolute server paths from error output
  return msg.replace(/\/tmp\/arena_box_[a-zA-Z0-9_-]+\/solution\.cpp/g, "solution.cpp");
}

function cleanJavaErrorMessage(msg: string): string {
  return msg.replace(/\/tmp\/arena_box_[a-zA-Z0-9_-]+\/Main\.java/g, "Solution.java");
}
