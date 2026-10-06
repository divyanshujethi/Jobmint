import * as fs from "fs";
import * as path from "path";

const PROBLEMS_PATH = path.resolve(__dirname, "../apps/web/lib/problems-data.ts");

const BATCH_TWO = [
  {
    id: "three-sum",
    slug: "three-sum",
    title: "3Sum: Triplet Zero Sum Balance",
    difficulty: "Medium",
    category: "Two Pointers",
    acceptance: "34.1%",
    description: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    realWorldContext: "Used in financial accounting ledger reconciliation to discover 3-party zero-balance offset loops, and in computational geometry for 3-point collinearity detection.",
    examples: [
      {
        input: "nums = [-1, 0, 1, 2, -1, -4]",
        output: "[[-1, -1, 2], [-1, 0, 1]]",
      },
      {
        input: "nums = [0, 1, 1]",
        output: "[]",
      },
      {
        input: "nums = [0, 0, 0]",
        output: "[[0, 0, 0]]",
      },
    ],
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5",
    ],
    hints: [
      "Sort the array first in O(n log n).",
      "Fix one number nums[i], then use two pointers (left and right) to find two numbers that sum to -nums[i].",
      "Skip duplicate adjacent elements to avoid duplicate triplets.",
    ],
    starterCodeJs: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // Write your Two Pointer solution here
  
}`,
    starterCodeTs: `function threeSum(nums: number[]): number[][] {
  // Write your Two Pointer solution here
  
}`,
    starterCodePy: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        pass`,
    starterCodeCpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        
    }
};`,
    starterCodeJava: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        return new ArrayList<>();
    }
}`,
    testCases: [
      {
        name: "Standard 6 Elements",
        inputArgs: [[-1, 0, 1, 2, -1, -4]],
        expected: [[-1, -1, 2], [-1, 0, 1]],
      },
      {
        name: "Triple Zeroes",
        inputArgs: [[0, 0, 0]],
        expected: [[0, 0, 0]],
      },
      {
        name: "No Valid Triplet",
        inputArgs: [[0, 1, 1]],
        expected: [],
      },
    ],
    editorial: "Sort array ascending. For each index `i`, run Two Pointers `left = i + 1` and `right = len - 1`. Skip duplicate adjacent values to maintain uniqueness.",
    badgeName: "3-Way Equilibrium",
  },
  {
    id: "daily-temperatures",
    slug: "daily-temperatures",
    title: "Daily Temperatures: Monotonic Stack",
    difficulty: "Medium",
    category: "Stack",
    acceptance: "66.2%",
    description: "Given an array of integers `temperatures` representing daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0`.",
    realWorldContext: "Stock ticker breakout prediction and next-higher price signal lookahead in algorithmic trading engines.",
    examples: [
      {
        input: "temperatures = [73, 74, 75, 71, 69, 72, 76, 73]",
        output: "[1, 1, 4, 2, 1, 1, 0, 0]",
      },
      {
        input: "temperatures = [30, 40, 50, 60]",
        output: "[1, 1, 1, 0]",
      },
    ],
    constraints: [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100",
    ],
    hints: [
      "Use a Monotonic Decreasing Stack storing indices.",
      "When encountering a temperature greater than the top of stack, pop and compute the difference in indices.",
    ],
    starterCodeJs: `/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
function dailyTemperatures(temperatures) {
  // Write your monotonic stack solution here
  
}`,
    starterCodeTs: `function dailyTemperatures(temperatures: number[]): number[] {
  // Write your monotonic stack solution here
  
}`,
    starterCodePy: `class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        pass`,
    starterCodeCpp: `#include <vector>
#include <stack>
using namespace std;

class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        
    }
};`,
    starterCodeJava: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        return new int[]{};
    }
}`,
    testCases: [
      {
        name: "Standard Weather Forecast",
        inputArgs: [[73, 74, 75, 71, 69, 72, 76, 73]],
        expected: [1, 1, 4, 2, 1, 1, 0, 0],
      },
      {
        name: "Strictly Increasing",
        inputArgs: [[30, 40, 50, 60]],
        expected: [1, 1, 1, 0],
      },
      {
        name: "Strictly Decreasing",
        inputArgs: [[30, 60, 90]],
        expected: [1, 1, 0],
      },
    ],
    editorial: "Push index onto stack. While current temp exceeds stack top, pop `prevIndex` and assign `res[prevIndex] = currIndex - prevIndex` in O(n) total time.",
    badgeName: "Monotonic Horizon Hunter",
  },
  {
    id: "generate-parentheses",
    slug: "generate-parentheses",
    title: "Generate Parentheses: Backtracking Tree",
    difficulty: "Medium",
    category: "Stack",
    acceptance: "74.8%",
    description: "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    realWorldContext: "AST parser generation, mathematical formula validation, and compiler grammar tree construction.",
    examples: [
      {
        input: "n = 3",
        output: '["((()))","(()())","(())()","()(())","()()()"]',
      },
      {
        input: "n = 1",
        output: '["()"]',
      },
    ],
    constraints: [
      "1 <= n <= 8",
    ],
    hints: [
      "Use backtracking with recursion.",
      "You can add '(' if openCount < n.",
      "You can add ')' if closeCount < openCount.",
    ],
    starterCodeJs: `/**
 * @param {number} n
 * @return {string[]}
 */
function generateParenthesis(n) {
  // Write your backtracking solution here
  
}`,
    starterCodeTs: `function generateParenthesis(n: number): string[] {
  // Write your backtracking solution here
  
}`,
    starterCodePy: `class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        pass`,
    starterCodeCpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    vector<string> generateParenthesis(int n) {
        
    }
};`,
    starterCodeJava: `class Solution {
    public List<String> generateParenthesis(int n) {
        return new ArrayList<>();
    }
}`,
    testCases: [
      {
        name: "3 Pairs",
        inputArgs: [3],
        expected: ["((()))", "(()())", "(())()", "()(())", "()()()"],
      },
      {
        name: "1 Pair",
        inputArgs: [1],
        expected: ["()"],
      },
      {
        name: "2 Pairs",
        inputArgs: [2],
        expected: ["(())", "()()"],
        isHidden: true,
      },
    ],
    editorial: "Backtrack tracking `open` and `close` counts. Append '(' if `open < n`, and ')' if `close < open`. Base case reached when `current.length == 2 * n`.",
    badgeName: "Syntax Weaver",
  },
  {
    id: "insert-interval",
    slug: "insert-interval",
    title: "Insert Interval: Calendar Merging",
    difficulty: "Medium",
    category: "Intervals",
    acceptance: "41.8%",
    description: "You are given an array of non-overlapping intervals `intervals` where `intervals[i] = [start_i, end_i]` sorted in ascending order by `start_i`.\n\nYou are also given an interval `newInterval = [start, end]`. Insert `newInterval` into `intervals` such that `intervals` is still sorted and contains no overlapping intervals (merge if necessary).",
    realWorldContext: "Conflict-free meeting room booking in Google Calendar, schedule compaction in airline reservations, and memory chunk defragmentation.",
    examples: [
      {
        input: "intervals = [[1, 3], [6, 9]], newInterval = [2, 5]",
        output: "[[1, 5], [6, 9]]",
      },
      {
        input: "intervals = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval = [4, 8]",
        output: "[[1, 2], [3, 10], [12, 16]]",
      },
    ],
    constraints: [
      "0 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "newInterval.length == 2",
    ],
    hints: [
      "Add all intervals ending before newInterval starts.",
      "Merge all overlapping intervals with newInterval by updating its start and end.",
      "Add all remaining intervals starting after newInterval ends.",
    ],
    starterCodeJs: `/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
function insert(intervals, newInterval) {
  // Write your O(n) interval insertion here
  
}`,
    starterCodeTs: `function insert(intervals: number[][], newInterval: number[]): number[][] {
  // Write your O(n) interval insertion here
  
}`,
    starterCodePy: `class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        pass`,
    starterCodeCpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        
    }
};`,
    starterCodeJava: `class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        return new int[][]{};
    }
}`,
    testCases: [
      {
        name: "Standard Merge Overlap",
        inputArgs: [[[1, 3], [6, 9]], [2, 5]],
        expected: [[1, 5], [6, 9]],
      },
      {
        name: "Multi-Interval Span Merge",
        inputArgs: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]],
        expected: [[1, 2], [3, 10], [12, 16]],
      },
      {
        name: "Insert into Empty Calendar",
        inputArgs: [[], [5, 7]],
        expected: [[5, 7]],
      },
    ],
    editorial: "Three linear passes in one traversal: (1) push intervals before overlap, (2) merge all overlapping spans into `[min(start), max(end)]`, (3) push remaining trailing intervals in O(n) time.",
    badgeName: "Chronos Scheduler",
  },
  {
    id: "reverse-array-in-place",
    slug: "reverse-array-in-place",
    title: "Reverse Array In-Place: O(1) Memory Inversion",
    difficulty: "Easy",
    category: "Two Pointers",
    acceptance: "84.5%",
    description: "Given an array `arr`, reverse the elements in-place and return the mutated array without allocating another array of length n.",
    realWorldContext: "Undo stack history inversion, GPU vertex winding order reversal, and audio sample time-reversal DSP processing.",
    examples: [
      {
        input: "arr = [1, 2, 3, 4, 5]",
        output: "[5, 4, 3, 2, 1]",
      },
      {
        input: "arr = [1, 2]",
        output: "[2, 1]",
      },
    ],
    constraints: [
      "0 <= arr.length <= 10^5",
    ],
    hints: [
      "Use two pointers: left = 0, right = arr.length - 1.",
      "Swap elements and advance pointers until left >= right.",
    ],
    starterCodeJs: `/**
 * @param {any[]} arr
 * @return {any[]}
 */
function reverseArray(arr) {
  // Write your in-place two pointer solution here
  
}`,
    starterCodeTs: `function reverseArray(arr: any[]): any[] {
  // Write your in-place two pointer solution here
  
}`,
    starterCodePy: `class Solution:
    def reverseArray(self, arr: list) -> list:
        pass`,
    starterCodeCpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> reverseArray(vector<int>& arr) {
        
    }
};`,
    starterCodeJava: `class Solution {
    public int[] reverseArray(int[] arr) {
        return arr;
    }
}`,
    testCases: [
      {
        name: "Odd Length Array",
        inputArgs: [[1, 2, 3, 4, 5]],
        expected: [5, 4, 3, 2, 1],
      },
      {
        name: "Even Length Array",
        inputArgs: [[10, 20]],
        expected: [20, 10],
      },
      {
        name: "Single Element Array",
        inputArgs: [[42]],
        expected: [42],
      },
    ],
    editorial: "Two-pointer symmetric swap from edges inward achieves O(n) time and strict O(1) space complexity.",
    badgeName: "Symmetry Inverter",
  },
  {
    id: "binary-cross-entropy",
    slug: "binary-cross-entropy",
    title: "Binary Cross-Entropy Loss (ML Classifier)",
    difficulty: "Medium",
    category: "AI & Machine Learning",
    acceptance: "58.4%",
    description: "Given true labels `yTrue` (0 or 1) and predicted probabilities `yPred` (between 0 and 1 exclusive), compute the mean Binary Cross-Entropy (BCE) loss across all samples: `-1/N * sum(y * log(p) + (1 - y) * log(1 - p))` rounded to 4 decimal places.",
    realWorldContext: "Standard loss objective function for logistic regression, binary classification, and transformer reward models in RLHF (Reinforcement Learning from Human Feedback).",
    examples: [
      {
        input: "yTrue = [1, 0], yPred = [0.9, 0.1]",
        output: "0.1054",
      },
    ],
    constraints: [
      "yTrue.length == yPred.length",
      "1 <= yTrue.length <= 10^4",
      "0.0001 <= yPred[i] <= 0.9999",
    ],
    hints: [
      "Accumulate loss = y * Math.log(p) + (1 - y) * Math.log(1 - p).",
      "Divide by -N and use Number(loss.toFixed(4)).",
    ],
    starterCodeJs: `/**
 * @param {number[]} yTrue
 * @param {number[]} yPred
 * @return {number}
 */
function binaryCrossEntropy(yTrue, yPred) {
  // Write your BCE Loss computation here
  
}`,
    starterCodeTs: `function binaryCrossEntropy(yTrue: number[], yPred: number[]): number {
  // Write your BCE Loss computation here
  
}`,
    starterCodePy: `import math

class Solution:
    def binaryCrossEntropy(self, yTrue: list[int], yPred: list[float]) -> float:
        pass`,
    starterCodeCpp: `#include <vector>
#include <cmath>
using namespace std;

class Solution {
public:
    double binaryCrossEntropy(vector<int>& yTrue, vector<double>& yPred) {
        
    }
};`,
    starterCodeJava: `class Solution {
    public double binaryCrossEntropy(int[] yTrue, double[] yPred) {
        return 0.0;
    }
}`,
    testCases: [
      {
        name: "Confident Accurate Predictions",
        inputArgs: [[1, 0], [0.9, 0.1]],
        expected: 0.1054,
      },
      {
        name: "50-50 Uncertain Predictions",
        inputArgs: [[1, 0], [0.5, 0.5]],
        expected: 0.6931,
      },
    ],
    editorial: "Iterate over predictions summing `-y*ln(p) - (1-y)*ln(1-p)`. Return average rounded to 4 decimal places.",
    badgeName: "Loss Function Alchemist",
  },
];

async function main() {
  const currentContent = fs.readFileSync(PROBLEMS_PATH, "utf-8");
  
  const existingSlugs = new Set<string>();
  const matches = currentContent.matchAll(/"slug":\s*"([^"]+)"/g);
  for (const m of matches) {
    existingSlugs.add(m[1]);
  }

  const toAdd = BATCH_TWO.filter((p) => !existingSlugs.has(p.slug));
  console.log(`Adding ${toAdd.length} more challenges...`);

  if (toAdd.length === 0) {
    console.log("No new problems to add.");
    return;
  }

  const lastBracketIndex = currentContent.lastIndexOf("];");
  if (lastBracketIndex === -1) {
    console.error("Could not find closing bracket in problems-data.ts");
    process.exit(1);
  }

  const serialized = toAdd
    .map((p) => "  " + JSON.stringify(p, null, 2).replace(/\n/g, "\n  "))
    .join(",\n");

  const newContent =
    currentContent.substring(0, lastBracketIndex).trimEnd() +
    ",\n" +
    serialized +
    "\n];\n";

  fs.writeFileSync(PROBLEMS_PATH, newContent, "utf-8");
  console.log(`✅ Total problems updated to ${existingSlugs.size + toAdd.length}!`);
}

main().catch(console.error);
