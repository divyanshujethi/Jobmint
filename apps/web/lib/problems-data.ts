export interface TestCase {
  name: string;
  inputArgs: any[];
  expected: any;
  isHidden?: boolean;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Arrays & Hashing" | "Two Pointers" | "Sliding Window" | "Stack" | "Binary Search" | "Dynamic Programming" | "Trees & Graphs" | "Intervals";
  acceptance: string;
  description: string;
  realWorldContext: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  hints: string[];
  starterCodeJs: string;
  starterCodeTs: string;
  starterCodePy: string;
  starterCodeCpp: string;
  starterCodeJava: string;
  testCases: TestCase[];
  editorial: string;
  badgeName: string;
}

export const LEETCODE_PROBLEMS: Problem[] = [
  {
    "id": "two-sum",
    "slug": "two-sum",
    "title": "Two Sum: Target Pair Indexer",
    "difficulty": "Easy",
    "category": "Arrays & Hashing",
    "acceptance": "53.2%",
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. Return the answer in any order.",
    "realWorldContext": "Used in financial order book matching at Zerodha and Razorpay to instantaneously pair matching buy and sell prices with O(n) hash map lookups.",
    "examples": [
      {
        "input": "nums = [2, 7, 11, 15], target = 9",
        "output": "[0, 1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        "input": "nums = [3, 2, 4], target = 6",
        "output": "[1, 2]",
        "explanation": "nums[1] + nums[2] == 6, so return [1, 2]."
      },
      {
        "input": "nums = [3, 3], target = 6",
        "output": "[0, 1]"
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    "hints": [
      "A brute force approach checks every pair with nested loops in O(n^2) time.",
      "Can you use a Hash Map (dictionary) to remember numbers you've seen so far in O(n) time?",
      "For each number x, look up whether (target - x) already exists in your map."
    ],
    "starterCodeJs": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Write your O(n) solution here\n  \n}",
    "starterCodeTs": "function twoSum(nums: number[], target: number): number[] {\n  // Write your O(n) solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your O(n) solution here\n        pass",
    "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your O(n) solution here\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your O(n) solution here\n        return new int[]{};\n    }\n}",
    "testCases": [
      {
        "name": "Basic Pair",
        "inputArgs": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "name": "Unsorted Array",
        "inputArgs": [
          [
            3,
            2,
            4
          ],
          6
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "name": "Duplicate Elements",
        "inputArgs": [
          [
            3,
            3
          ],
          6
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "name": "Negative Values",
        "inputArgs": [
          [
            -1,
            -2,
            -3,
            -4,
            -5
          ],
          -8
        ],
        "expected": [
          2,
          4
        ],
        "isHidden": true
      }
    ],
    "editorial": "### Optimal Approach: Hash Map (One-Pass)\n\nInstead of checking every pair with nested loops in $O(n^2)$, we can trade space for time using a Hash Map.\n\n1. Iterate through `nums` with index `i`.\n2. For each number, compute `diff = target - nums[i]`.\n3. If `diff` exists in our map, we have found our pair: return `[map.get(diff), i]`.\n4. Otherwise, store `map.set(nums[i], i)` and continue.\n\n- **Time Complexity:** $O(n)$\n- **Space Complexity:** $O(n)$",
    "badgeName": "Arrays Master: Two Sum"
  },
  {
    "id": "valid-parentheses",
    "slug": "valid-parentheses",
    "title": "Valid Parentheses: Syntax Tree Validator",
    "difficulty": "Easy",
    "category": "Stack",
    "acceptance": "41.1%",
    "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    "realWorldContext": "Directly used in compilers and AST parsers (such as Babel, SWC, and TypeScript compiler) to validate code syntax before compilation.",
    "examples": [
      {
        "input": "s = \"()\"",
        "output": "true"
      },
      {
        "input": "s = \"()[]{}\"",
        "output": "true"
      },
      {
        "input": "s = \"(]\"",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    "hints": [
      "Use a Last-In, First-Out (LIFO) Stack data structure.",
      "Whenever you see an opening bracket, push it onto the stack.",
      "When you see a closing bracket, check if the stack top matches."
    ],
    "starterCodeJs": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n  // Write your O(n) stack solution here\n  \n}",
    "starterCodeTs": "function isValid(s: string): boolean {\n  // Write your O(n) stack solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your O(n) stack solution here\n        pass",
    "starterCodeCpp": "#include <string>\n#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your O(n) stack solution here\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public boolean isValid(String s) {\n        // Write your O(n) stack solution here\n        return false;\n    }\n}",
    "testCases": [
      {
        "name": "Simple Pair",
        "inputArgs": [
          "()"
        ],
        "expected": true
      },
      {
        "name": "Multiple Types",
        "inputArgs": [
          "()[]{}"
        ],
        "expected": true
      },
      {
        "name": "Mismatch Types",
        "inputArgs": [
          "(]"
        ],
        "expected": false
      },
      {
        "name": "Nested Brackets",
        "inputArgs": [
          "{[]}"
        ],
        "expected": true
      },
      {
        "name": "Unmatched Open",
        "inputArgs": [
          "["
        ],
        "expected": false,
        "isHidden": true
      }
    ],
    "editorial": "### Optimal Approach: Stack\n\n1. Initialize an empty stack.\n2. Map closing brackets to opening brackets: `')': '(', '}': '{', ']': '['`.\n3. Traverse `s`. If character is an open bracket, push to stack.\n4. If closing bracket, pop from stack and verify match.\n5. Valid if stack is completely empty at the end.\n\n- **Time Complexity:** $O(n)$\n- **Space Complexity:** $O(n)$",
    "badgeName": "Stack Architect: Parentheses"
  },
  {
    "id": "best-time-to-buy-and-sell-stock",
    "slug": "best-time-to-buy-and-sell-stock",
    "title": "Best Time to Buy & Sell Stock: Volatility Profit Tracker",
    "difficulty": "Easy",
    "category": "Arrays & Hashing",
    "acceptance": "54.6%",
    "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    "realWorldContext": "Algorithmic trading engines at Jane Street and Citadel analyze historical asset windows to execute high-frequency arbitrage trades.",
    "examples": [
      {
        "input": "prices = [7, 1, 5, 3, 6, 4]",
        "output": "5",
        "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5."
      },
      {
        "input": "prices = [7, 6, 4, 3, 1]",
        "output": "0",
        "explanation": "In this case, no transactions are done and the max profit = 0."
      }
    ],
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "hints": [
      "Keep track of the minimum buy price seen so far as you iterate through the list.",
      "Calculate current profit = price - minPrice at each day.",
      "Update maxProfit if current profit is greater."
    ],
    "starterCodeJs": "/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n  // Write your O(n) greedy solution here\n  \n}",
    "starterCodeTs": "function maxProfit(prices: number[]): number {\n  // Write your O(n) greedy solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def maxProfit(self, prices: list[int]) -> int:\n        # Write your O(n) greedy solution here\n        pass",
    "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your O(n) greedy solution here\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your O(n) greedy solution here\n        return 0;\n    }\n}",
    "testCases": [
      {
        "name": "Standard Peak",
        "inputArgs": [
          [
            7,
            1,
            5,
            3,
            6,
            4
          ]
        ],
        "expected": 5
      },
      {
        "name": "Monotonically Decreasing",
        "inputArgs": [
          [
            7,
            6,
            4,
            3,
            1
          ]
        ],
        "expected": 0
      },
      {
        "name": "Two Days Only",
        "inputArgs": [
          [
            2,
            4
          ]
        ],
        "expected": 2
      },
      {
        "name": "Flat Prices",
        "inputArgs": [
          [
            3,
            3,
            3,
            3
          ]
        ],
        "expected": 0,
        "isHidden": true
      }
    ],
    "editorial": "### Optimal Approach: Single-Pass Greedy\n\nTrack the lowest price encountered so far (`minPrice`) and check the profit if sold today:\n\n```js\nlet minPrice = Infinity;\nlet maxProfit = 0;\nfor (const p of prices) {\n  if (p < minPrice) minPrice = p;\n  else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n}\nreturn maxProfit;\n```\n\n- **Time Complexity:** $O(n)$\n- **Space Complexity:** $O(1)$",
    "badgeName": "HFT Quant: Stock Arbitrage"
  },
  {
    "id": "max-subarray",
    "slug": "max-subarray",
    "title": "Maximum Subarray: Kadane's Algorithm",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "acceptance": "50.4%",
    "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "realWorldContext": "Used in computer vision (finding highest-contrast regions in an image) and genomic sequence alignment to locate protein coding regions.",
    "examples": [
      {
        "input": "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        "output": "6",
        "explanation": "The subarray [4, -1, 2, 1] has the largest sum 6."
      },
      {
        "input": "nums = [1]",
        "output": "1"
      },
      {
        "input": "nums = [5, 4, -1, 7, 8]",
        "output": "23"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "hints": [
      "If the current accumulated sum becomes negative, it can never contribute positively to any subsequent subarray.",
      "Reset current sum to 0 whenever it drops below zero (Kadane's Algorithm)."
    ],
    "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxSubArray(nums) {\n  // Write Kadane's Algorithm in O(n) time\n  \n}",
    "starterCodeTs": "function maxSubArray(nums: number[]): number {\n  // Write Kadane's Algorithm in O(n) time\n  \n}",
    "starterCodePy": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        # Write Kadane's Algorithm in O(n) time\n        pass",
    "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write Kadane's Algorithm in O(n) time\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write Kadane's Algorithm in O(n) time\n        return 0;\n    }\n}",
    "testCases": [
      {
        "name": "Mixed Negative/Positive",
        "inputArgs": [
          [
            -2,
            1,
            -3,
            4,
            -1,
            2,
            1,
            -5,
            4
          ]
        ],
        "expected": 6
      },
      {
        "name": "Single Element",
        "inputArgs": [
          [
            1
          ]
        ],
        "expected": 1
      },
      {
        "name": "All Positive",
        "inputArgs": [
          [
            5,
            4,
            -1,
            7,
            8
          ]
        ],
        "expected": 23
      },
      {
        "name": "All Negative",
        "inputArgs": [
          [
            -3,
            -2,
            -1,
            -4
          ]
        ],
        "expected": -1,
        "isHidden": true
      }
    ],
    "editorial": "### Optimal Approach: Kadane's Algorithm\n\n```js\nlet maxSum = nums[0];\nlet curr = 0;\nfor (const n of nums) {\n  curr = Math.max(n, curr + n);\n  maxSum = Math.max(maxSum, curr);\n}\nreturn maxSum;\n```\n\n- **Time Complexity:** $O(n)$\n- **Space Complexity:** $O(1)$",
    "badgeName": "DP Vanguard: Kadane"
  },
  {
    "id": "contains-duplicate",
    "slug": "contains-duplicate",
    "title": "Contains Duplicate: Set Collision Detector",
    "difficulty": "Easy",
    "category": "Arrays & Hashing",
    "acceptance": "61.3%",
    "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    "realWorldContext": "Primary deduplication routine in distributed message queues (Kafka, AWS SQS) and unique user identifier validations in PostgreSQL.",
    "examples": [
      {
        "input": "nums = [1, 2, 3, 1]",
        "output": "true"
      },
      {
        "input": "nums = [1, 2, 3, 4]",
        "output": "false"
      },
      {
        "input": "nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]",
        "output": "true"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "hints": [
      "A Hash Set stores unique elements and has O(1) average lookup and insertion.",
      "Compare the size of a Set constructed from `nums` to `nums.length`."
    ],
    "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {boolean}\n */\nfunction containsDuplicate(nums) {\n  // Write your O(n) set solution here\n  \n}",
    "starterCodeTs": "function containsDuplicate(nums: number[]): boolean {\n  // Write your O(n) set solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def containsDuplicate(self, nums: list[int]) -> bool:\n        # Write your O(n) set solution here\n        pass",
    "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // Write your O(n) set solution here\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your O(n) set solution here\n        return false;\n    }\n}",
    "testCases": [
      {
        "name": "Contains Duplicate",
        "inputArgs": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": true
      },
      {
        "name": "All Distinct",
        "inputArgs": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": false
      },
      {
        "name": "Multiple Repetitions",
        "inputArgs": [
          [
            1,
            1,
            1,
            3,
            3,
            4,
            3,
            2,
            4,
            2
          ]
        ],
        "expected": true
      }
    ],
    "editorial": "### Optimal Approach: Hash Set\n\n```js\nreturn new Set(nums).size < nums.length;\n```\n\n- **Time Complexity:** $O(n)$\n- **Space Complexity:** $O(n)$",
    "badgeName": "Hash Master: Deduplication"
  },
  {
    "id": "valid-anagram",
    "slug": "valid-anagram",
    "title": "Valid Anagram: Frequency Counter",
    "difficulty": "Easy",
    "category": "Arrays & Hashing",
    "acceptance": "63.2%",
    "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "realWorldContext": "Employed in spell checkers, text comparison tools, and linguistic cryptanalysis engines.",
    "examples": [
      {
        "input": "s = \"anagram\", t = \"nagaram\"",
        "output": "true"
      },
      {
        "input": "s = \"rat\", t = \"car\"",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    "hints": [
      "If lengths differ, they cannot be anagrams.",
      "Count character frequencies of s and decrement for t."
    ],
    "starterCodeJs": "/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nfunction isAnagram(s, t) {\n  // Write your O(n) frequency counting solution here\n  \n}",
    "starterCodeTs": "function isAnagram(s: string, t: string): boolean {\n  // Write your O(n) frequency counting solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your O(n) frequency counting solution here\n        pass",
    "starterCodeCpp": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Write your O(n) frequency counting solution here\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your O(n) frequency counting solution here\n        return false;\n    }\n}",
    "testCases": [
      {
        "name": "Standard Anagram",
        "inputArgs": [
          "anagram",
          "nagaram"
        ],
        "expected": true
      },
      {
        "name": "Mismatch Characters",
        "inputArgs": [
          "rat",
          "car"
        ],
        "expected": false
      },
      {
        "name": "Length Difference",
        "inputArgs": [
          "a",
          "ab"
        ],
        "expected": false
      }
    ],
    "editorial": "### Optimal Approach: Frequency Array\n\n```js\nif (s.length !== t.length) return false;\nconst count = {};\nfor (const c of s) count[c] = (count[c] || 0) + 1;\nfor (const c of t) {\n  if (!count[c]) return false;\n  count[c]--;\n}\nreturn true;\n```\n\n- **Time Complexity:** $O(n)$\n- **Space Complexity:** $O(1)$",
    "badgeName": "Frequency Specialist: Anagram"
  },
  {
    "id": "merge-intervals",
    "slug": "merge-intervals",
    "title": "Merge Intervals: Calendar Optimizer",
    "difficulty": "Medium",
    "category": "Intervals",
    "acceptance": "47.1%",
    "description": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "realWorldContext": "Google Calendar and Outlook meeting scheduler algorithms collapse free/busy slot blocks to identify overlapping availability across teams.",
    "examples": [
      {
        "input": "intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]",
        "output": "[[1, 6], [8, 10], [15, 18]]",
        "explanation": "Since intervals [1, 3] and [2, 6] overlap, merge them into [1, 6]."
      },
      {
        "input": "intervals = [[1, 4], [4, 5]]",
        "output": "[[1, 5]]",
        "explanation": "Intervals [1, 4] and [4, 5] are considered overlapping."
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    "hints": [
      "Sort intervals by start time first.",
      "If current start <= previous end, merge them: previous.end = max(previous.end, current.end)."
    ],
    "starterCodeJs": "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction merge(intervals) {\n  // Write your O(n log n) intervals sorting & merge solution here\n  \n}",
    "starterCodeTs": "function merge(intervals: number[][]): number[][] {\n  // Write your O(n log n) intervals sorting & merge solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        # Write your O(n log n) intervals sorting & merge solution here\n        pass",
    "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your O(n log n) intervals sorting & merge solution here\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your O(n log n) intervals sorting & merge solution here\n        return new int[][]{};\n    }\n}",
    "testCases": [
      {
        "name": "Standard Overlap",
        "inputArgs": [
          [
            [
              1,
              3
            ],
            [
              2,
              6
            ],
            [
              8,
              10
            ],
            [
              15,
              18
            ]
          ]
        ],
        "expected": [
          [
            1,
            6
          ],
          [
            8,
            10
          ],
          [
            15,
            18
          ]
        ]
      },
      {
        "name": "Touching Boundary",
        "inputArgs": [
          [
            [
              1,
              4
            ],
            [
              4,
              5
            ]
          ]
        ],
        "expected": [
          [
            1,
            5
          ]
        ]
      },
      {
        "name": "Fully Contained",
        "inputArgs": [
          [
            [
              1,
              10
            ],
            [
              2,
              6
            ]
          ]
        ],
        "expected": [
          [
            1,
            10
          ]
        ]
      }
    ],
    "editorial": "### Optimal Approach: Sort + Single Scan\n\n```js\nif (intervals.length <= 1) return intervals;\nintervals.sort((a, b) => a[0] - b[0]);\nconst merged = [intervals[0]];\nfor (let i = 1; i < intervals.length; i++) {\n  const prev = merged[merged.length - 1];\n  const curr = intervals[i];\n  if (curr[0] <= prev[1]) {\n    prev[1] = Math.max(prev[1], curr[1]);\n  } else {\n    merged.push(curr);\n  }\n}\nreturn merged;\n```\n\n- **Time Complexity:** $O(n \\log n)$\n- **Space Complexity:** $O(n)$",
    "badgeName": "Calendar Maven: Intervals"
  },
  {
    "id": "binary-search",
    "slug": "binary-search",
    "title": "Binary Search: O(log n) Halving Engine",
    "difficulty": "Easy",
    "category": "Binary Search",
    "acceptance": "57.8%",
    "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    "realWorldContext": "Foundational primitive behind B-Trees, database indexing in Postgres/MySQL, and Git Bisect bug isolation.",
    "examples": [
      {
        "input": "nums = [-1, 0, 3, 5, 9, 12], target = 9",
        "output": "4",
        "explanation": "9 exists in nums and its index is 4."
      },
      {
        "input": "nums = [-1, 0, 3, 5, 9, 12], target = 2",
        "output": "-1",
        "explanation": "2 does not exist in nums so return -1."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    "hints": [
      "Maintain two pointers: left = 0, right = nums.length - 1.",
      "Calculate mid = Math.floor((left + right) / 2).",
      "Compare nums[mid] with target and discard half the search space."
    ],
    "starterCodeJs": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n  // Write your O(log n) binary search here\n  \n}",
    "starterCodeTs": "function search(nums: number[], target: number): number {\n  // Write your O(log n) binary search here\n  \n}",
    "starterCodePy": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your O(log n) binary search here\n        pass",
    "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your O(log n) binary search here\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your O(log n) binary search here\n        return -1;\n    }\n}",
    "testCases": [
      {
        "name": "Target Present",
        "inputArgs": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          9
        ],
        "expected": 4
      },
      {
        "name": "Target Absent",
        "inputArgs": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          2
        ],
        "expected": -1
      },
      {
        "name": "Single Element Match",
        "inputArgs": [
          [
            5
          ],
          5
        ],
        "expected": 0
      },
      {
        "name": "Single Element Mismatch",
        "inputArgs": [
          [
            5
          ],
          1
        ],
        "expected": -1,
        "isHidden": true
      }
    ],
    "editorial": "### Optimal Approach: Classical Binary Search\n\n```js\nlet left = 0;\nlet right = nums.length - 1;\nwhile (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  if (nums[mid] === target) return mid;\n  if (nums[mid] < target) left = mid + 1;\n  else right = mid - 1;\n}\nreturn -1;\n```\n\n- **Time Complexity:** $O(\\log n)$\n- **Space Complexity:** $O(1)$",
    "badgeName": "Algorithmist: Binary Search"
  }
];
