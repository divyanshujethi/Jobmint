import { TestCase } from "./problems-data";

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

const WORKER_CODE = `
self.onmessage = function(e) {
  const { code, testCases } = e.data;
  const logs = [];

  const safeSerialize = (val) => {
    try {
      if (typeof val === "undefined") return "undefined";
      if (val === null) return "null";
      if (typeof val === "object") return JSON.stringify(val);
      return String(val);
    } catch (e) {
      return String(val);
    }
  };

  const customConsole = {
    log: function(...args) {
      logs.push(args.map(safeSerialize).join(" "));
    },
    info: function(...args) {
      logs.push(args.map(safeSerialize).join(" "));
    },
    warn: function(...args) {
      logs.push("[WARN] " + args.map(safeSerialize).join(" "));
    },
    error: function(...args) {
      logs.push("[ERR] " + args.map(safeSerialize).join(" "));
    }
  };

  function deepEqual(a, b) {
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
    const funcMatch = code.match(/function\\s+([a-zA-Z0-9_$]+)\\s*\\(/) ||
                      code.match(/(?:const|let|var)\\s+([a-zA-Z0-9_$]+)\\s*=\\s*(?:function|\\([^)]*\\)\\s*=>)/);
    const fnName = funcMatch ? funcMatch[1] : null;

    const wrapper = new Function(
      "console",
      code + "\\n" +
      "let target = null;\\n" +
      (fnName ? "if (typeof " + fnName + " === \"function\") target = " + fnName + ";\\n" : "") +
      "if (!target && typeof solution === \"function\") target = solution;\\n" +
      "if (!target && typeof twoSum === \"function\") target = twoSum;\\n" +
      "if (!target && typeof isValid === \"function\") target = isValid;\\n" +
      "if (!target && typeof maxProfit === \"function\") target = maxProfit;\\n" +
      "if (!target && typeof maxSubArray === \"function\") target = maxSubArray;\\n" +
      "if (!target && typeof containsDuplicate === \"function\") target = containsDuplicate;\\n" +
      "if (!target && typeof isAnagram === \"function\") target = isAnagram;\\n" +
      "if (!target && typeof merge === \"function\") target = merge;\\n" +
      "if (!target && typeof search === \"function\") target = search;\\n" +
      "return target;"
    );

    const userFn = wrapper(customConsole);

    if (typeof userFn !== "function") {
      self.postMessage({
        type: "ERROR",
        error: "No executable solution function found. Ensure you declare a function such as function twoSum(...) or function isValid(...).",
        logs
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
        if (!passed && Array.isArray(actual) && Array.isArray(tc.expected) && actual.length === 2 && tc.expected.length === 2) {
          const sortedActual = [...actual].sort((x, y) => x - y);
          const sortedExpected = [...tc.expected].sort((x, y) => x - y);
          if (deepEqual(sortedActual, sortedExpected)) {
            passed = true;
          }
        }
      } catch (testErr) {
        err = testErr.message || String(testErr);
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
        isHidden: !!tc.isHidden
      });
    }

    self.postMessage({
      type: "SUCCESS",
      results,
      logs
    });
  } catch (err) {
    self.postMessage({
      type: "COMPILE_ERROR",
      error: err.message || String(err),
      logs
    });
  }
};
`;

export function executeCodeInSandbox(
  code: string,
  testCases: TestCase[],
  timeoutMs = 2500
): Promise<ExecutionReport> {
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
      const blob = new Blob([WORKER_CODE], { type: "application/javascript" });
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
          results: testCases.map((tc) => ({
            name: tc.name,
            inputArgs: tc.inputArgs,
            expected: tc.expected,
            actual: undefined,
            passed: false,
            error: `Time Limit Exceeded (TLE): Code execution exceeded ${timeoutMs}ms. Sandboxed thread terminated.`,
            durationMs: timeoutMs,
            isHidden: !!tc.isHidden,
          })),
          logs: ["Execution terminated: Time limit exceeded."],
          compilationError: null,
          runtimeError: `Time Limit Exceeded (TLE): Execution exceeded ${timeoutMs}ms. Check for infinite loops or non-terminating recursion.`,
        });
      }, timeoutMs);

      worker.onmessage = (event) => {
        if (isSettled) return;
        isSettled = true;
        cleanup();

        const data = event.data;
        if (data.type === "SUCCESS") {
          const results: TestResult[] = data.results || [];
          const passedCount = results.filter((r) => r.passed).length;
          const allPassed = results.length > 0 && passedCount === results.length;

          resolve({
            passed: allPassed,
            allPassed,
            totalTests: results.length,
            passedTests: passedCount,
            results,
            logs: data.logs || [],
            compilationError: null,
            runtimeError: null,
          });
        } else if (data.type === "COMPILE_ERROR") {
          resolve({
            passed: false,
            allPassed: false,
            totalTests: testCases.length,
            passedTests: 0,
            results: [],
            logs: data.logs || [],
            compilationError: data.error || "Syntax / Compilation Error",
            runtimeError: null,
          });
        } else {
          resolve({
            passed: false,
            allPassed: false,
            totalTests: testCases.length,
            passedTests: 0,
            results: [],
            logs: data.logs || [],
            compilationError: null,
            runtimeError: data.error || "Execution Error",
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
          runtimeError: err.message || "Uncaught Web Worker error",
        });
      };

      worker.postMessage({ code, testCases });
    } catch (e: any) {
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
        compilationError: e?.message || "Failed to initialize Web Worker sandbox",
        runtimeError: null,
      });
    }
  });
}
