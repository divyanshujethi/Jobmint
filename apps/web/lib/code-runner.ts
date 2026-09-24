import { TestCase } from "./problems-data";

export type SupportedLanguage = "javascript" | "typescript" | "python" | "cpp" | "java";

export interface LanguageOption {
  id: SupportedLanguage;
  name: string;
  monacoLang: string;
  version: string;
  badge: string;
  isExecutable: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    id: "javascript",
    name: "JavaScript",
    monacoLang: "javascript",
    version: "ES2024 (V8 Sandbox)",
    badge: "Instant Sandbox",
    isExecutable: true,
  },
  {
    id: "typescript",
    name: "TypeScript",
    monacoLang: "typescript",
    version: "TS 5.4 (Client Sandbox)",
    badge: "Instant Sandbox",
    isExecutable: true,
  },
  {
    id: "python",
    name: "Python 3",
    monacoLang: "python",
    version: "Python 3.12 (Pyodide WASM)",
    badge: "Client WASM",
    isExecutable: true,
  },
  {
    id: "cpp",
    name: "C++",
    monacoLang: "cpp",
    version: "C++20 (GCC 13)",
    badge: "Editor Ready",
    isExecutable: false,
  },
  {
    id: "java",
    name: "Java",
    monacoLang: "java",
    version: "OpenJDK 21",
    badge: "Editor Ready",
    isExecutable: false,
  },
];

export interface TestResult {
  name: string;
  inputArgs: any[];
  expected: any;
  actual: any;
  passed: boolean;
  error: string | null;
  durationMs: number;
  isHidden?: boolean;
}

export interface ExecutionReport {
  passed: boolean;
  allPassed: boolean;
  totalTests: number;
  passedTests: number;
  results: TestResult[];
  logs: string[];
  compilationError: string | null;
  runtimeError: string | null;
}

/**
 * Strips TypeScript types, interfaces, generics, and return annotations
 * so the resulting JavaScript can run directly inside the V8 worker sandbox.
 */
export function stripTypeScript(tsCode: string): string {
  let js = tsCode;
  // Remove interfaces
  js = js.replace(/interface\s+[\s\S]*?\{[\s\S]*?\}/g, "");
  // Remove type aliases
  js = js.replace(/type\s+[A-Za-z0-9_$]+(\s*<[^>]+>)?\s*=[\s\S]*?;/g, "");
  // Remove type assertions: 'as unknown as ...'
  js = js.replace(/\s+as\s+[A-Za-z0-9_$<>\[\]|,\s]+/g, " ");
  // Remove return types: ): Type {
  js = js.replace(/\)\s*:\s*[A-Za-z0-9_$<>\[\]|,\s]+\s*\{/g, ") {");
  // Remove variable types: const x: Type =
  js = js.replace(/(const|let|var)\s+([A-Za-z0-9_$]+)\s*:\s*[A-Za-z0-9_$<>\[\]|,\s]+?\s*=/g, (_m: any, kw: string, name: string) => `${kw} ${name} =`);
  // Remove generic type parameters on function calls / instances: new Map<k, v>()
  js = js.replace(/<[A-Za-z0-9_$<>\[\]|,\s]+>\s*\(/g, "(");
  // Remove non-null assertion !
  js = js.replace(/([A-Za-z0-9_$\)\]])!/g, (_m: any, char: string) => char);
  // Remove function argument types: (a: number, b: string) -> (a, b)
  js = js.replace(/function\s*([a-zA-Z0-9_$]*)\s*\(([^)]*)\)/g, (_m: any, fnName: string, args: string) => {
    const cleanArgs = args.split(",").map((a: string) => a.split(":")[0].trim()).join(", ");
    return `function ${fnName}(${cleanArgs})`;
  });
  return js;
}

/**
 * Worker Function executed in isolated Web Worker context.
 * Serialized via toString() to guarantee valid JS syntax with no regex template string escaping bugs.
 */
function workerFunction() {
  self.onmessage = function (e: any) {
    const { code, testCases } = e.data;
    const logs: string[] = [];

    const safeSerialize = (val: any): string => {
      try {
        if (typeof val === "undefined") return "undefined";
        if (val === null) return "null";
        if (typeof val === "object") return JSON.stringify(val);
        return String(val);
      } catch (err) {
        return String(val);
      }
    };

    const customConsole = {
      log: (...args: any[]) => logs.push(args.map(safeSerialize).join(" ")),
      info: (...args: any[]) => logs.push(args.map(safeSerialize).join(" ")),
      warn: (...args: any[]) => logs.push("[WARN] " + args.map(safeSerialize).join(" ")),
      error: (...args: any[]) => logs.push("[ERR] " + args.map(safeSerialize).join(" ")),
    };

    function deepEqual(a: any, b: any): boolean {
      if (a === b) return true;
      if (typeof a !== typeof b) return false;
      if (a && b && typeof a === "object") {
        if (Array.isArray(a) !== Array.isArray(b)) return false;
        if (Array.isArray(a)) {
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
          }
          return true;
        }
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (const k of keysA) {
          if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
          if (!deepEqual(a[k], b[k])) return false;
        }
        return true;
      }
      return false;
    }

    try {
      const funcMatch =
        code.match(/function\s+([a-zA-Z0-9_$]+)\s*\(/) ||
        code.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:function|\([^)]*\)\s*=>)/);
      const fnName = funcMatch ? funcMatch[1] : null;

      const wrapperBody = [
        code,
        "let target = null;",
        fnName ? `if (typeof ${fnName} === 'function') target = ${fnName};` : "",
        "if (!target && typeof solution === 'function') target = solution;",
        "if (!target && typeof twoSum === 'function') target = twoSum;",
        "if (!target && typeof isValid === 'function') target = isValid;",
        "if (!target && typeof maxProfit === 'function') target = maxProfit;",
        "if (!target && typeof maxSubArray === 'function') target = maxSubArray;",
        "if (!target && typeof containsDuplicate === 'function') target = containsDuplicate;",
        "if (!target && typeof isAnagram === 'function') target = isAnagram;",
        "if (!target && typeof merge === 'function') target = merge;",
        "if (!target && typeof search === 'function') target = search;",
        "return target;",
      ].join("\n");

      // Compile function with custom sandboxed console
      const wrapper = new Function("console", wrapperBody);
      const userFn = wrapper(customConsole);

      if (typeof userFn !== "function") {
        self.postMessage({
          type: "ERROR",
          error:
            "No executable solution function found. Ensure you declare a function such as function twoSum(...) or function isValid(...).",
          logs,
        });
        return;
      }

      const results = [];
      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const start = performance.now();
        let actual = undefined;
        let passed = false;
        let err = null;

        try {
          const clonedArgs = JSON.parse(JSON.stringify(tc.inputArgs));
          actual = userFn(...clonedArgs);
          passed = deepEqual(actual, tc.expected);

          // For problems where order does not matter (like Two Sum or interval sets)
          if (
            !passed &&
            Array.isArray(actual) &&
            Array.isArray(tc.expected) &&
            actual.length === 2 &&
            tc.expected.length === 2
          ) {
            const sortedActual = [...actual].sort((x: any, y: any) => x - y);
            const sortedExpected = [...tc.expected].sort((x: any, y: any) => x - y);
            if (deepEqual(sortedActual, sortedExpected)) {
              passed = true;
            }
          }
        } catch (testErr: any) {
          err = testErr?.message || String(testErr);
        }

        const durationMs = Math.max(1, Math.round((performance.now() - start) * 100) / 100);
        results.push({
          name: tc.name,
          inputArgs: tc.inputArgs,
          expected: tc.expected,
          actual,
          passed,
          error: err,
          durationMs,
          isHidden: !!tc.isHidden,
        });
      }

      self.postMessage({
        type: "SUCCESS",
        results,
        logs,
      });
    } catch (err: any) {
      self.postMessage({
        type: "COMPILE_ERROR",
        error: err?.message || String(err),
        logs,
      });
    }
  };
}

/**
 * Execute Python code in browser via Pyodide WebAssembly
 */
declare global {
  interface Window {
    loadPyodide?: any;
    __pyodideInstance?: any;
  }
}

async function runPythonViaPyodide(
  code: string,
  testCases: TestCase[]
): Promise<ExecutionReport> {
  try {
    if (!window.loadPyodide && !window.__pyodideInstance) {
      await new Promise<void>((resolve, reject) => {
        const existing = document.getElementById("pyodide-script");
        if (existing) {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () => reject(new Error("Failed to load Pyodide script")));
          return;
        }
        const script = document.createElement("script");
        script.id = "pyodide-script";
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Could not download Pyodide WASM runtime from CDN. Check your internet connection or use JavaScript / TypeScript for offline execution."));
        document.head.appendChild(script);
      });
    }

    if (!window.__pyodideInstance) {
      window.__pyodideInstance = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
      });
    }

    const pyodide = window.__pyodideInstance;

    const runnerPy = `
import json
import time

user_code = ${JSON.stringify(code)}
test_cases_json = ${JSON.stringify(testCases)}

scope = {}
logs = []

class CustomStdout:
    def write(self, s):
        if s.strip():
            logs.append(s.strip())
    def flush(self):
        pass

import sys
old_stdout = sys.stdout
sys.stdout = CustomStdout()

try:
    exec(user_code, scope)
finally:
    sys.stdout = old_stdout

sol_instance = None
if 'Solution' in scope and isinstance(scope['Solution'], type):
    try:
        sol_instance = scope['Solution']()
    except Exception:
        pass

results = []
for tc in test_cases_json:
    t0 = time.perf_counter()
    args = tc.get('inputArgs', [])
    expected = tc.get('expected')
    passed = False
    actual = None
    err = None
    
    try:
        fn = None
        if sol_instance:
            for attr in dir(sol_instance):
                if not attr.startswith('_') and callable(getattr(sol_instance, attr)):
                    fn = getattr(sol_instance, attr)
                    break
        if not fn:
            for k, v in scope.items():
                if not k.startswith('_') and callable(v):
                    fn = v
                    break
                    
        if not fn:
            raise Exception("No executable function or Solution method found in Python code")
            
        actual = fn(*args)
        
        # Deep equality comparison
        passed = (actual == expected)
        if not passed and isinstance(actual, (list, tuple)) and isinstance(expected, (list, tuple)) and len(actual) == 2 and len(expected) == 2:
            if sorted(list(actual)) == sorted(list(expected)):
                passed = True
    except Exception as e:
        err = str(e)
        
    duration_ms = max(1.0, round((time.perf_counter() - t0) * 1000, 2))
    results.append({
        "name": tc.get("name", "Test"),
        "inputArgs": args,
        "expected": expected,
        "actual": actual,
        "passed": passed,
        "error": err,
        "durationMs": duration_ms,
        "isHidden": bool(tc.get("isHidden", False))
    })

json.dumps({"results": results, "logs": logs})
`;

    const rawOutput = await pyodide.runPythonAsync(runnerPy);
    const parsed = JSON.parse(rawOutput);

    const passedTests = parsed.results.filter((r: TestResult) => r.passed).length;
    const allPassed = passedTests === testCases.length;

    return {
      passed: allPassed,
      allPassed,
      totalTests: testCases.length,
      passedTests,
      results: parsed.results,
      logs: parsed.logs || [],
      compilationError: null,
      runtimeError: null,
    };
  } catch (err: any) {
    return {
      passed: false,
      allPassed: false,
      totalTests: testCases.length,
      passedTests: 0,
      results: [],
      logs: [],
      compilationError: err?.message || String(err),
      runtimeError: null,
    };
  }
}

/**
 * Execute User Code in Isolated Client-Side Sandbox
 * Supports JavaScript, TypeScript, Python 3 (Pyodide), C++, and Java.
 */
export function executeCodeInSandbox(
  code: string,
  testCases: TestCase[],
  language: SupportedLanguage = "javascript",
  timeoutMs = 4000
): Promise<ExecutionReport> {
  // C++ and Java - graceful guidance
  if (language === "cpp" || language === "java") {
    const langName = language === "cpp" ? "C++" : "Java";
    return Promise.resolve({
      passed: false,
      allPassed: false,
      totalTests: testCases.length,
      passedTests: 0,
      results: [],
      logs: [
        `[INFO] ${langName} syntax editing is fully active with Monaco syntax highlighting and code completion.`,
        `[SANDBOX] In-browser instant test runner currently supports JavaScript, TypeScript, and Python 3 (WASM).`,
        `[TIP] Switch the language dropdown to JavaScript, TypeScript, or Python 3 to run live test cases!`,
      ],
      compilationError: `${langName} compilation requires server-side isolated Linux containers (Judge0). Select JavaScript, TypeScript, or Python 3 for live in-browser test evaluation.`,
      runtimeError: null,
    });
  }

  // Python execution
  if (language === "python") {
    return runPythonViaPyodide(code, testCases);
  }

  // JS or TS via Web Worker
  const executableCode = language === "typescript" ? stripTypeScript(code) : code;

  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof Worker === "undefined") {
      resolve({
        passed: false,
        allPassed: false,
        totalTests: testCases.length,
        passedTests: 0,
        results: [],
        logs: [],
        compilationError: "Web Workers not supported in this runtime environment.",
        runtimeError: null,
      });
      return;
    }

    let blobUrl: string | null = null;
    let worker: Worker | null = null;
    let timer: any = null;
    let isSettled = false;

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      if (worker) {
        worker.terminate();
        worker = null;
      }
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        blobUrl = null;
      }
    };

    try {
      const workerCode = `(${workerFunction.toString()})();`;
      const blob = new Blob([workerCode], { type: "application/javascript" });
      blobUrl = URL.createObjectURL(blob);
      worker = new Worker(blobUrl);

      timer = setTimeout(() => {
        if (isSettled) return;
        isSettled = true;
        cleanup();
        resolve({
          passed: false,
          allPassed: false,
          totalTests: testCases.length,
          passedTests: 0,
          results: [],
          logs: ["Execution timed out after " + timeoutMs + "ms."],
          compilationError: null,
          runtimeError: `Time Limit Exceeded (${timeoutMs}ms). Check for infinite loops or high complexity.`,
        });
      }, timeoutMs);

      worker.onmessage = (event) => {
        if (isSettled) return;
        isSettled = true;
        cleanup();

        const data = event.data;
        if (data.type === "COMPILE_ERROR") {
          resolve({
            passed: false,
            allPassed: false,
            totalTests: testCases.length,
            passedTests: 0,
            results: [],
            logs: data.logs || [],
            compilationError: data.error,
            runtimeError: null,
          });
        } else if (data.type === "ERROR") {
          resolve({
            passed: false,
            allPassed: false,
            totalTests: testCases.length,
            passedTests: 0,
            results: [],
            logs: data.logs || [],
            compilationError: null,
            runtimeError: data.error,
          });
        } else if (data.type === "SUCCESS") {
          const results: TestResult[] = data.results || [];
          const passedTests = results.filter((r) => r.passed).length;
          const allPassed = passedTests === testCases.length;

          resolve({
            passed: allPassed,
            allPassed,
            totalTests: testCases.length,
            passedTests,
            results,
            logs: data.logs || [],
            compilationError: null,
            runtimeError: null,
          });
        }
      };

      worker.onerror = (err) => {
        if (isSettled) return;
        isSettled = true;
        cleanup();
        resolve({
          passed: false,
          allPassed: false,
          totalTests: testCases.length,
          passedTests: 0,
          results: [],
          logs: [],
          compilationError: null,
          runtimeError: `Runtime / Sandbox Error: ${err.message || "Failed executing script"}`,
        });
      };

      worker.postMessage({
        code: executableCode,
        testCases,
      });
    } catch (e: any) {
      cleanup();
      resolve({
        passed: false,
        allPassed: false,
        totalTests: testCases.length,
        passedTests: 0,
        results: [],
        logs: [],
        compilationError: e?.message || String(e),
        runtimeError: null,
      });
    }
  });
}
