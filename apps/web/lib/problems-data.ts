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
  category: "Arrays & Hashing" | "Two Pointers" | "Sliding Window" | "Stack" | "Binary Search" | "Dynamic Programming" | "Trees & Graphs" | "Intervals" | "AI & Machine Learning" | "Web Engineering" | "System Design";
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
  },
  // ── AI & MACHINE LEARNING ──
  {
    "id": "cosine-similarity",
    "slug": "cosine-similarity",
    "title": "Vector Cosine Similarity (RAG & Embeddings)",
    "difficulty": "Easy",
    "category": "AI & Machine Learning",
    "acceptance": "64.8%",
    "description": "Given two numeric vectors `vecA` and `vecB` of identical length, compute their Cosine Similarity rounded to 4 decimal places:\n\n$$\\text{similarity} = \\frac{\\vec{a} \\cdot \\vec{b}}{\\|\\vec{a}\\| \\|\\vec{b}\\|}$$\n\nIf either vector norm is 0, return `0.0`.",
    "realWorldContext": "Used in Retrieval-Augmented Generation (RAG) and Pinecone/Qdrant vector stores to calculate semantic similarity between user queries and stored chunk embeddings.",
    "examples": [
      {
        "input": "vecA = [1, 2, 3], vecB = [1, 2, 3]",
        "output": "1.0",
        "explanation": "Identical vectors have an angle of 0 degrees and cosine similarity of 1.0."
      },
      {
        "input": "vecA = [1, 0], vecB = [0, 1]",
        "output": "0.0",
        "explanation": "Orthogonal vectors have a dot product of 0."
      }
    ],
    "constraints": [
      "1 <= vecA.length == vecB.length <= 10^4",
      "-1000 <= vecA[i], vecB[i] <= 1000"
    ],
    "hints": [
      "First compute dot product sum(a[i] * b[i]).",
      "Compute Euclidean norm sqrt(sum(a[i]^2)) and sqrt(sum(b[i]^2)).",
      "Divide dot product by norm product, handling division by zero."
    ],
    "starterCodeJs": "/**\n * @param {number[]} vecA\n * @param {number[]} vecB\n * @return {number}\n */\nfunction cosineSimilarity(vecA, vecB) {\n  // Compute vector cosine similarity\n  \n}",
    "starterCodeTs": "function cosineSimilarity(vecA: number[], vecB: number[]): number {\n  // Compute vector cosine similarity\n  \n}",
    "starterCodePy": "import math\n\nclass Solution:\n    def cosineSimilarity(self, vecA: list[float], vecB: list[float]) -> float:\n        # Compute vector cosine similarity\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <cmath>\nusing namespace std;\n\nclass Solution {\npublic:\n    double cosineSimilarity(vector<double>& vecA, vector<double>& vecB) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public double cosineSimilarity(double[] vecA, double[] vecB) {\n        return 0.0;\n    }\n}",
    "testCases": [
      {
        "name": "Identical Vectors",
        "inputArgs": [[1, 2, 3], [1, 2, 3]],
        "expected": 1.0
      },
      {
        "name": "Orthogonal Vectors",
        "inputArgs": [[1, 0], [0, 1]],
        "expected": 0.0
      },
      {
        "name": "Scaled Parallel Vectors",
        "inputArgs": [[1, 2, 3], [2, 4, 6]],
        "expected": 1.0
      }
    ],
    "editorial": "### Vector Math\n\nCompute dot product and norms in a single pass:\n\n```python\ndot = sum(a * b for a, b in zip(vecA, vecB))\nnormA = math.sqrt(sum(a * a for a in vecA))\nnormB = math.sqrt(sum(b * b for b in vecB))\nreturn round(dot / (normA * normB), 4) if normA and normB else 0.0\n```",
    "badgeName": "AI Architect: Vector Math"
  },
  {
    "id": "softmax-layer",
    "slug": "softmax-layer",
    "title": "Stable Softmax & Temperature (LLM Sampling)",
    "difficulty": "Medium",
    "category": "AI & Machine Learning",
    "acceptance": "58.1%",
    "description": "Given a 1D array of float `logits` and a positive `temperature`, compute the numerically stable Softmax probability distribution. Each element should be rounded to 4 decimal places:\n\n$$P(i) = \\frac{\\exp((\\text{logits}[i] - \\max(\\text{logits})) / T)}{\\sum_j \\exp((\\text{logits}[j] - \\max(\\text{logits})) / T)}$$",
    "realWorldContext": "Directly implements the final token sampling layer of ChatGPT and Llama-3, translating raw transformer unnormalized log-probabilities into categorical next-token predictions.",
    "examples": [
      {
        "input": "logits = [10.0, 10.0], temperature = 1.0",
        "output": "[0.5, 0.5]",
        "explanation": "Equal logits yield uniform probability distribution."
      }
    ],
    "constraints": [
      "1 <= logits.length <= 1000",
      "-1000.0 <= logits[i] <= 1000.0",
      "0.1 <= temperature <= 5.0"
    ],
    "hints": [
      "Subtract max(logits) before exponentiation to prevent 64-bit float overflow.",
      "Divide scaled exponents by temperature T before exp()."
    ],
    "starterCodeJs": "/**\n * @param {number[]} logits\n * @param {number} temperature\n * @return {number[]}\n */\nfunction softmax(logits, temperature) {\n  \n}",
    "starterCodeTs": "function softmax(logits: number[], temperature: number): number[] {\n  \n}",
    "starterCodePy": "import math\n\nclass Solution:\n    def softmax(self, logits: list[float], temperature: float) -> list[float]:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <cmath>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<double> softmax(vector<double>& logits, double temperature) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public double[] softmax(double[] logits, double temperature) {\n        return new double[]{};\n    }\n}",
    "testCases": [
      {
        "name": "Uniform Distribution",
        "inputArgs": [[10.0, 10.0], 1.0],
        "expected": [0.5, 0.5]
      },
      {
        "name": "Extreme Logits (Numerical Stability Check)",
        "inputArgs": [[1000.0, 1000.0], 1.0],
        "expected": [0.5, 0.5]
      }
    ],
    "editorial": "Subtract `max(logits)` to guard against floating-point overflow during `exp()`.",
    "badgeName": "GenAI Pioneer: Token Sampling"
  },
  {
    "id": "bpe-tokenizer-freq",
    "slug": "bpe-tokenizer-freq",
    "title": "BPE Token Pair Frequency (Tokenizer Engine)",
    "difficulty": "Medium",
    "category": "AI & Machine Learning",
    "acceptance": "61.3%",
    "description": "In Byte-Pair Encoding (BPE), tokenizers repeatedly merge the most frequent adjacent character pair. Given an array of space-separated token strings `words` and a target 2-element pair `[char1, char2]`, count how many times this exact adjacent pair appears across all words.",
    "realWorldContext": "Core subword vocabulary generation step used by OpenAI's tiktoken and Hugging Face tokenizers.",
    "examples": [
      {
        "input": "words = [\"l o w\", \"l o w e r\"], pair = [\"l\", \"o\"]",
        "output": "2",
        "explanation": "'l o' appears once in 'l o w' and once in 'l o w e r'."
      }
    ],
    "constraints": [
      "1 <= words.length <= 1000",
      "pair.length == 2"
    ],
    "hints": [
      "Split each word by space to get individual tokens.",
      "Scan tokens with adjacent indices `tokens[i]` and `tokens[i+1]`."
    ],
    "starterCodeJs": "/**\n * @param {string[]} words\n * @param {string[]} pair\n * @return {number}\n */\nfunction countPairFrequency(words, pair) {\n  \n}",
    "starterCodeTs": "function countPairFrequency(words: string[], pair: string[]): number {\n  \n}",
    "starterCodePy": "class Solution:\n    def countPairFrequency(self, words: list[str], pair: list[str]) -> int:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int countPairFrequency(vector<string>& words, vector<string>& pair) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int countPairFrequency(String[] words, String[] pair) {\n        return 0;\n    }\n}",
    "testCases": [
      {
        "name": "Standard Pair Count",
        "inputArgs": [["l o w", "l o w e r"], ["l", "o"]],
        "expected": 2
      },
      {
        "name": "Repeated Adjacent Pairs",
        "inputArgs": [["a b a b", "a b c"], ["a", "b"]],
        "expected": 3
      }
    ],
    "editorial": "Iterate tokens and check `tokens[i] == pair[0] and tokens[i+1] == pair[1]`.",
    "badgeName": "NLP Specialist: Tokenizer Engine"
  },
  // ── WEB ENGINEERING ──
  {
    "id": "flatten-nested-array",
    "slug": "flatten-nested-array",
    "title": "Flatten Multi-Dimensional Array (DOM & AST Engine)",
    "difficulty": "Easy",
    "category": "Web Engineering",
    "acceptance": "72.4%",
    "description": "Given a deeply nested multi-dimensional array with arbitrary nesting depth, return a flattened 1-dimensional array preserving original element order without using native `.flat(Infinity)`.",
    "realWorldContext": "Used in React virtual DOM reconciliation, AST compilers (Babel), and CSS-in-JS rule unrolling.",
    "examples": [
      {
        "input": "arr = [1, [2, [3, [4]], 5]]",
        "output": "[1, 2, 3, 4, 5]"
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^4",
      "Total nested elements <= 10^5"
    ],
    "hints": [
      "Use recursion or an iterative stack to traverse nested arrays."
    ],
    "starterCodeJs": "/**\n * @param {any[]} arr\n * @return {any[]}\n */\nfunction flattenArray(arr) {\n  \n}",
    "starterCodeTs": "function flattenArray(arr: any[]): any[] {\n  \n}",
    "starterCodePy": "class Solution:\n    def flattenArray(self, arr: list) -> list:\n        pass",
    "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> flattenArray(vector<int>& arr) {\n        \n    }\n};",
    "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public List<Object> flattenArray(List<Object> arr) {\n        return new ArrayList<>();\n    }\n}",
    "testCases": [
      {
        "name": "Deeply Nested",
        "inputArgs": [[1, [2, [3, [4]], 5]]],
        "expected": [1, 2, 3, 4, 5]
      },
      {
        "name": "Shallow Mixed",
        "inputArgs": [[[1, 2], [3, 4], [5]]],
        "expected": [1, 2, 3, 4, 5]
      }
    ],
    "editorial": "Recursively check `Array.isArray()` and push items to the accumulator.",
    "badgeName": "Frontend Architect: Tree Traversal"
  },
  {
    "id": "deep-clone-object",
    "slug": "deep-clone-object",
    "title": "Structured Deep Clone (State Immutability)",
    "difficulty": "Medium",
    "category": "Web Engineering",
    "acceptance": "59.3%",
    "description": "Given a JSON-compatible nested dictionary/object `obj`, implement a deep clone that produces an independent copy. Mutating the clone must never affect the original.",
    "realWorldContext": "Essential for predictable React Redux/Zustand state immutability, undo-redo histories, and form drafts.",
    "examples": [
      {
        "input": "obj = {\"a\": 1, \"b\": [2, 3]}",
        "output": "{\"a\": 1, \"b\": [2, 3]}"
      }
    ],
    "constraints": [
      "Object contains only primitive types, lists, and dicts."
    ],
    "hints": [
      "Check types: if dictionary, recursively clone values; if list, recursively clone items."
    ],
    "starterCodeJs": "/**\n * @param {any} obj\n * @return {any}\n */\nfunction deepClone(obj) {\n  \n}",
    "starterCodeTs": "function deepClone(obj: any): any {\n  \n}",
    "starterCodePy": "class Solution:\n    def deepClone(self, obj):\n        pass",
    "starterCodeCpp": "class Solution {\npublic:\n    // C++ clone demonstration\n};",
    "starterCodeJava": "class Solution {\n    public Object deepClone(Object obj) {\n        return obj;\n    }\n}",
    "testCases": [
      {
        "name": "Nested Dict and List",
        "inputArgs": [{"a": 1, "b": [2, 3]}],
        "expected": {"a": 1, "b": [2, 3]}
      },
      {
        "name": "Deep User Profile",
        "inputArgs": [{"user": {"name": "Alex", "roles": ["admin"]}}],
        "expected": {"user": {"name": "Alex", "roles": ["admin"]}}
      }
    ],
    "editorial": "Recursively construct new dictionaries and lists without object references.",
    "badgeName": "Full-Stack Engineer: Immutability"
  },
  // ── SYSTEM DESIGN & DISTRIBUTED SYSTEMS ──
  {
    "id": "token-bucket-rate-limiter",
    "slug": "token-bucket-rate-limiter",
    "title": "Token Bucket Rate Limiter (API Gateway)",
    "difficulty": "Medium",
    "category": "System Design",
    "acceptance": "54.2%",
    "description": "Simulate an API Gateway Token Bucket rate limiter. Given `capacity`, `refillRate` (tokens per second), and an ascending list of arrival timestamps `timestamps` (seconds), return an array of booleans indicating if each request was accepted (`true`) or throttled (`false`). Bucket starts at full capacity.",
    "realWorldContext": "Deployed in Cloudflare WAF and Stripe API Gateways to prevent DDoS and API quota exhaustion.",
    "examples": [
      {
        "input": "capacity = 2, refillRate = 1.0, timestamps = [0.0, 0.1, 0.2, 1.5]",
        "output": "[true, true, false, true]",
        "explanation": "At t=0.0: token consumed (1 left). At t=0.1: token consumed (0 left). At t=0.2: bucket empty -> rejected (false). At t=1.5: 1.3 tokens refilled (capped at 2) -> accepted (true)."
      }
    ],
    "constraints": [
      "1 <= capacity <= 1000",
      "0.1 <= refillRate <= 100.0",
      "timestamps are in non-decreasing order."
    ],
    "hints": [
      "Track `tokens` and `lastTimestamp`. For each arrival, tokens = min(capacity, tokens + (now - last) * refillRate).",
      "If tokens >= 1.0, decrement by 1 and accept. Else reject."
    ],
    "starterCodeJs": "/**\n * @param {number} capacity\n * @param {number} refillRate\n * @param {number[]} timestamps\n * @return {boolean[]}\n */\nfunction rateLimiter(capacity, refillRate, timestamps) {\n  \n}",
    "starterCodeTs": "function rateLimiter(capacity: number, refillRate: number, timestamps: number[]): boolean[] {\n  \n}",
    "starterCodePy": "class Solution:\n    def rateLimiter(self, capacity: int, refillRate: float, timestamps: list[float]) -> list[bool]:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<bool> rateLimiter(int capacity, double refillRate, vector<double>& timestamps) {\n        \n    }\n};",
    "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public List<Boolean> rateLimiter(int capacity, double refillRate, double[] timestamps) {\n        return new ArrayList<>();\n    }\n}",
    "testCases": [
      {
        "name": "Standard Burst and Refill",
        "inputArgs": [2, 1.0, [0.0, 0.1, 0.2, 1.5]],
        "expected": [true, true, false, true]
      },
      {
        "name": "Instant Exhaustion",
        "inputArgs": [1, 0.5, [0.0, 0.05]],
        "expected": [true, false]
      }
    ],
    "editorial": "Lazy refill calculation: `tokens = min(capacity, current_tokens + delta_t * rate)`.",
    "badgeName": "Gateway Architect: Traffic Control"
  },
  {
    "id": "consistent-hashing-lookup",
    "slug": "consistent-hashing-lookup",
    "title": "Consistent Hashing Ring Lookup (Distributed Sharding)",
    "difficulty": "Medium",
    "category": "System Design",
    "acceptance": "56.7%",
    "description": "In a distributed cache cluster with server nodes placed on a 360-degree hash ring `nodes` (e.g. `[30, 90, 180, 270]`), given a key hash `keyHash` (0 <= keyHash < 360), return the server node that owns the key (the first node with position >= keyHash, or node 0 if keyHash exceeds all nodes due to clockwise circular ring wrap-around).",
    "realWorldContext": "Used by Discord, DynamoDB, and Memcached to distribute billions of cache keys across server nodes with minimal cache invalidation when nodes are added or removed.",
    "examples": [
      {
        "input": "nodes = [30, 90, 180, 270], keyHash = 50",
        "output": "90"
      },
      {
        "input": "nodes = [30, 90, 180, 270], keyHash = 300",
        "output": "30",
        "explanation": "Key wraps around the 360 ring to the first server at 30."
      }
    ],
    "constraints": [
      "1 <= nodes.length <= 1000",
      "nodes is sorted in strictly ascending order.",
      "0 <= nodes[i], keyHash < 360"
    ],
    "hints": [
      "Use Binary Search (bisect) to find the first node >= keyHash in O(log N) time.",
      "If no node is >= keyHash, return nodes[0]."
    ],
    "starterCodeJs": "/**\n * @param {number[]} nodes\n * @param {number} keyHash\n * @return {number}\n */\nfunction routeKeyToNode(nodes, keyHash) {\n  \n}",
    "starterCodeTs": "function routeKeyToNode(nodes: number[], keyHash: number): number {\n  \n}",
    "starterCodePy": "import bisect\n\nclass Solution:\n    def routeKeyToNode(self, nodes: list[int], keyHash: int) -> int:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int routeKeyToNode(vector<int>& nodes, int keyHash) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int routeKeyToNode(int[] nodes, int keyHash) {\n        return 0;\n    }\n}",
    "testCases": [
      {
        "name": "Mid Ring Route",
        "inputArgs": [[30, 90, 180, 270], 50],
        "expected": 90
      },
      {
        "name": "Wrap Around Ring",
        "inputArgs": [[30, 90, 180, 270], 300],
        "expected": 30
      },
      {
        "name": "Exact Node Match",
        "inputArgs": [[30, 90, 180, 270], 90],
        "expected": 90
      }
    ],
    "editorial": "Use binary search `bisect_left(nodes, keyHash)` and return `nodes[idx % len(nodes)]`.",
    "badgeName": "Distributed Systems: Consistent Hashing"
  },
  {
    "id": "product-of-array-except-self",
    "slug": "product-of-array-except-self",
    "title": "Product of Array Except Self",
    "difficulty": "Medium",
    "category": "Arrays & Hashing",
    "acceptance": "65.4%",
    "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe algorithm must run in O(n) time without using the division operation.",
    "realWorldContext": "Critical in portfolio risk analytics and stock volatility recalculation where removing one asset's variance must be calculated without recomputing full matrix products.",
    "examples": [
      {
        "input": "nums = [1, 2, 3, 4]",
        "output": "[24, 12, 8, 6]"
      },
      {
        "input": "nums = [-1, 1, 0, -3, 3]",
        "output": "[0, 0, 9, 0]"
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix of nums fits in a 32-bit integer."
    ],
    "hints": [
      "Can you calculate the prefix products for each element?",
      "Can you calculate suffix products from right to left?",
      "Multiply prefix[i] * suffix[i] to get the answer in O(n) without division."
    ],
    "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction productExceptSelf(nums) {\n  // Write your O(n) prefix/suffix solution here\n  \n}",
    "starterCodeTs": "function productExceptSelf(nums: number[]): number[] {\n  // Write your O(n) prefix/suffix solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def productExceptSelf(self, nums: list[int]) -> list[int]:\n        pass",
    "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        return new int[]{};\n    }\n}",
    "testCases": [
      {
        "name": "Standard 4 Elements",
        "inputArgs": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": [
          24,
          12,
          8,
          6
        ]
      },
      {
        "name": "With Zero Element",
        "inputArgs": [
          [
            -1,
            1,
            0,
            -3,
            3
          ]
        ],
        "expected": [
          0,
          0,
          9,
          0
        ]
      },
      {
        "name": "Two Elements",
        "inputArgs": [
          [
            2,
            3
          ]
        ],
        "expected": [
          3,
          2
        ]
      },
      {
        "name": "Multiple Negatives",
        "inputArgs": [
          [
            -2,
            -2,
            -2
          ]
        ],
        "expected": [
          4,
          4,
          4
        ],
        "isHidden": true
      }
    ],
    "editorial": "Compute running prefix products from left-to-right, then traverse right-to-left accumulating suffix products into the output array.",
    "badgeName": "Product Array Prodigy"
  },
  {
    "id": "top-k-frequent-elements",
    "slug": "top-k-frequent-elements",
    "title": "Top K Frequent Elements: Trending Analytics",
    "difficulty": "Medium",
    "category": "Arrays & Hashing",
    "acceptance": "62.8%",
    "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements in descending order of frequency. If frequencies match, return any valid order.",
    "realWorldContext": "Powers real-time trending hashtags on Twitter/X, popular product counters on Amazon, and hot cache identification at Cloudflare.",
    "examples": [
      {
        "input": "nums = [1, 1, 1, 2, 2, 3], k = 2",
        "output": "[1, 2]"
      },
      {
        "input": "nums = [1], k = 1",
        "output": "[1]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "k is in the range [1, the number of unique elements in the array]."
    ],
    "hints": [
      "Count the frequencies of each element with a Hash Map in O(n).",
      "Use bucket sort where index represents frequency count for O(n) overall time."
    ],
    "starterCodeJs": "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction topKFrequent(nums, k) {\n  // Write your O(n) solution here\n  \n}",
    "starterCodeTs": "function topKFrequent(nums: number[], k: number): number[] {\n  // Write your O(n) solution here\n  \n}",
    "starterCodePy": "from collections import Counter\n\nclass Solution:\n    def topKFrequent(self, nums: list[int], k: int) -> list[int]:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        return new int[]{};\n    }\n}",
    "testCases": [
      {
        "name": "Two Frequencies",
        "inputArgs": [
          [
            1,
            1,
            1,
            2,
            2,
            3
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "name": "Single Element",
        "inputArgs": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      },
      {
        "name": "Negative Elements",
        "inputArgs": [
          [
            4,
            1,
            -1,
            2,
            -1,
            2,
            3
          ],
          2
        ],
        "expected": [
          -1,
          2
        ],
        "isHidden": true
      }
    ],
    "editorial": "Build a frequency map, then use Bucket Sort with an array of lists indexed by frequency from 0 to N.",
    "badgeName": "Top-K Trending Architect"
  },
  {
    "id": "longest-consecutive-sequence",
    "slug": "longest-consecutive-sequence",
    "title": "Longest Consecutive Sequence: O(n) Streak Tracker",
    "difficulty": "Medium",
    "category": "Arrays & Hashing",
    "acceptance": "47.5%",
    "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. The algorithm must run in O(n) time.",
    "realWorldContext": "Used by gaming servers and Habit Tracker platforms like Duolingo to detect longest uninterrupted daily activity streaks without sorting.",
    "examples": [
      {
        "input": "nums = [100, 4, 200, 1, 3, 2]",
        "output": "4",
        "explanation": "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4."
      },
      {
        "input": "nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]",
        "output": "9"
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "hints": [
      "Insert all numbers into a HashSet for O(1) membership lookups.",
      "Only start counting a sequence if (num - 1) is NOT in the set (i.e. num is the start of a streak)."
    ],
    "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction longestConsecutive(nums) {\n  // Write your O(n) HashSet solution here\n  \n}",
    "starterCodeTs": "function longestConsecutive(nums: number[]): number {\n  // Write your O(n) HashSet solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def longestConsecutive(self, nums: list[int]) -> int:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int longestConsecutive(int[] nums) {\n        return 0;\n    }\n}",
    "testCases": [
      {
        "name": "Standard Array",
        "inputArgs": [
          [
            100,
            4,
            200,
            1,
            3,
            2
          ]
        ],
        "expected": 4
      },
      {
        "name": "Ten Elements Streak",
        "inputArgs": [
          [
            0,
            3,
            7,
            2,
            5,
            8,
            4,
            6,
            0,
            1
          ]
        ],
        "expected": 9
      },
      {
        "name": "Empty Array",
        "inputArgs": [
          []
        ],
        "expected": 0
      }
    ],
    "editorial": "Use a HashSet to look up sequence starts in O(1). Only expand from `x` when `x - 1` is absent, guaranteeing each number is visited at most twice.",
    "badgeName": "Unbroken Sequence Master"
  },
  {
    "id": "valid-palindrome",
    "slug": "valid-palindrome",
    "title": "Valid Palindrome: Clean String Symmetry",
    "difficulty": "Easy",
    "category": "Two Pointers",
    "acceptance": "46.3%",
    "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nReturn `true` if it is a palindrome, or `false` otherwise.",
    "realWorldContext": "DNA bioinformatics palindrome sequence matching and search query sanitization in Elasticsearch.",
    "examples": [
      {
        "input": "s = \"A man, a plan, a canal: Panama\"",
        "output": "true"
      },
      {
        "input": "s = \"race a car\"",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters."
    ],
    "hints": [
      "Use two pointers (left at 0, right at length - 1).",
      "Skip non-alphanumeric characters on both sides before comparing."
    ],
    "starterCodeJs": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isPalindrome(s) {\n  // Write your Two Pointer solution here\n  \n}",
    "starterCodeTs": "function isPalindrome(s: string): boolean {\n  // Write your Two Pointer solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        pass",
    "starterCodeCpp": "#include <string>\n#include <cctype>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public boolean isPalindrome(String s) {\n        return true;\n    }\n}",
    "testCases": [
      {
        "name": "Classic Panama Palindrome",
        "inputArgs": [
          "A man, a plan, a canal: Panama"
        ],
        "expected": true
      },
      {
        "name": "Not a Palindrome",
        "inputArgs": [
          "race a car"
        ],
        "expected": false
      },
      {
        "name": "Empty / Space String",
        "inputArgs": [
          "   "
        ],
        "expected": true
      }
    ],
    "editorial": "Normalize with alphanumeric regex or two pointers with `isalnum()` checks to achieve O(n) time and O(1) auxiliary space.",
    "badgeName": "Palindrome Purist"
  },
  {
    "id": "container-with-most-water",
    "slug": "container-with-most-water",
    "title": "Container With Most Water: Maximum Area",
    "difficulty": "Medium",
    "category": "Two Pointers",
    "acceptance": "55.3%",
    "description": "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    "realWorldContext": "Resource allocation in cloud server auto-scaling bandwidth envelopes and histogram capacity planning.",
    "examples": [
      {
        "input": "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
        "output": "49"
      },
      {
        "input": "height = [1, 1]",
        "output": "1"
      }
    ],
    "constraints": [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    "hints": [
      "Start with the widest container: left = 0, right = n - 1.",
      "The area is limited by the shorter line: min(height[left], height[right]) * (right - left).",
      "Always move the pointer with the shorter height inward to search for a taller wall."
    ],
    "starterCodeJs": "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction maxArea(height) {\n  // Write your Two Pointer solution here\n  \n}",
    "starterCodeTs": "function maxArea(height: number[]): number {\n  // Write your Two Pointer solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}",
    "testCases": [
      {
        "name": "Standard 9 Heights",
        "inputArgs": [
          [
            1,
            8,
            6,
            2,
            5,
            4,
            8,
            3,
            7
          ]
        ],
        "expected": 49
      },
      {
        "name": "Two Unit Walls",
        "inputArgs": [
          [
            1,
            1
          ]
        ],
        "expected": 1
      },
      {
        "name": "Equal Symmetric Heights",
        "inputArgs": [
          [
            4,
            3,
            2,
            1,
            4
          ]
        ],
        "expected": 16
      }
    ],
    "editorial": "Initialize left=0 and right=len-1. Calculate current area, then greedily advance whichever pointer points to the shorter bar.",
    "badgeName": "Reservoir Architect"
  },
  {
    "id": "longest-substring-without-repeating-characters",
    "slug": "longest-substring-without-repeating-characters",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "Medium",
    "category": "Sliding Window",
    "acceptance": "34.8%",
    "description": "Given a string `s`, find the length of the longest substring without duplicate characters.",
    "realWorldContext": "High-throughput token sliding window parsing in streaming network packets and cryptographic nonces.",
    "examples": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3",
        "explanation": "The answer is \"abc\", with the length of 3."
      },
      {
        "input": "s = \"bbbbb\"",
        "output": "1"
      },
      {
        "input": "s = \"pwwkew\"",
        "output": "3"
      }
    ],
    "constraints": [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    "hints": [
      "Use a sliding window with two pointers: left and right.",
      "Store the last seen index of each character in a Hash Map to jump `left` forward directly."
    ],
    "starterCodeJs": "/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n  // Write your sliding window solution here\n  \n}",
    "starterCodeTs": "function lengthOfLongestSubstring(s: string): number {\n  // Write your sliding window solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass",
    "starterCodeCpp": "#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}",
    "testCases": [
      {
        "name": "Repeated Chars In Window",
        "inputArgs": [
          "abcabcbb"
        ],
        "expected": 3
      },
      {
        "name": "All Identical Chars",
        "inputArgs": [
          "bbbbb"
        ],
        "expected": 1
      },
      {
        "name": "Subsequence Jump",
        "inputArgs": [
          "pwwkew"
        ],
        "expected": 3
      },
      {
        "name": "Empty String",
        "inputArgs": [
          ""
        ],
        "expected": 0
      }
    ],
    "editorial": "Track character indices in a map. When a repeated character is encountered, advance `left = max(left, map[char] + 1)` in O(n) time.",
    "badgeName": "Sliding Window Sage"
  },
  {
    "id": "climbing-stairs",
    "slug": "climbing-stairs",
    "title": "Climbing Stairs: Dynamic Step Combinations",
    "difficulty": "Easy",
    "category": "Dynamic Programming",
    "acceptance": "52.8%",
    "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps.\n\nIn how many distinct ways can you climb to the top?",
    "realWorldContext": "Fibonacci state transition modeling in CPU instruction pipeline scheduling and branch predictor warm-up cycles.",
    "examples": [
      {
        "input": "n = 2",
        "output": "2",
        "explanation": "There are two ways: 1 step + 1 step, or 2 steps."
      },
      {
        "input": "n = 3",
        "output": "3",
        "explanation": "1+1+1, 1+2, 2+1."
      }
    ],
    "constraints": [
      "1 <= n <= 45"
    ],
    "hints": [
      "To reach step n, you can either come from step (n - 1) or step (n - 2).",
      "dp[n] = dp[n - 1] + dp[n - 2].",
      "You only need two variables to store previous values in O(1) space."
    ],
    "starterCodeJs": "/**\n * @param {number} n\n * @return {number}\n */\nfunction climbStairs(n) {\n  // Write your O(n) DP solution here\n  \n}",
    "starterCodeTs": "function climbStairs(n: number): number {\n  // Write your O(n) DP solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass",
    "starterCodeCpp": "class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}",
    "testCases": [
      {
        "name": "Two Steps",
        "inputArgs": [
          2
        ],
        "expected": 2
      },
      {
        "name": "Three Steps",
        "inputArgs": [
          3
        ],
        "expected": 3
      },
      {
        "name": "Five Steps",
        "inputArgs": [
          5
        ],
        "expected": 8
      },
      {
        "name": "One Step",
        "inputArgs": [
          1
        ],
        "expected": 1
      }
    ],
    "editorial": "Classic DP transition `f(n) = f(n-1) + f(n-2)`. Compute bottom-up using two variables `a` and `b` in O(1) space.",
    "badgeName": "Stairway Strategist"
  },
  {
    "id": "house-robber",
    "slug": "house-robber",
    "title": "House Robber: Non-Adjacent Maximization",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "acceptance": "50.4%",
    "description": "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected that will automatically alert the police if two adjacent houses are broken into on the same night.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
    "realWorldContext": "Energy harvesting schedules in IoT mesh nodes and CPU cache slot conflict resolution without adjacent bank collisions.",
    "examples": [
      {
        "input": "nums = [1, 2, 3, 1]",
        "output": "4",
        "explanation": "Rob house 1 (money = 1) and house 3 (money = 3). Total = 4."
      },
      {
        "input": "nums = [2, 7, 9, 3, 1]",
        "output": "12",
        "explanation": "Rob house 1 (2) + house 3 (9) + house 5 (1) = 12."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    "hints": [
      "For each house i, you either rob it (nums[i] + rob(i-2)) or skip it (rob(i-1)).",
      "current = max(prev1, prev2 + nums[i])."
    ],
    "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction rob(nums) {\n  // Write your O(n) DP solution here\n  \n}",
    "starterCodeTs": "function rob(nums: number[]): number {\n  // Write your O(n) DP solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int rob(vector<int>& nums) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int rob(int[] nums) {\n        return 0;\n    }\n}",
    "testCases": [
      {
        "name": "Four Houses",
        "inputArgs": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      },
      {
        "name": "Five Houses High Value",
        "inputArgs": [
          [
            2,
            7,
            9,
            3,
            1
          ]
        ],
        "expected": 12
      },
      {
        "name": "Single House",
        "inputArgs": [
          [
            99
          ]
        ],
        "expected": 99
      }
    ],
    "editorial": "Maintain two running variables `prev1` and `prev2`. At each step, `current = max(prev1, prev2 + nums[i])` in O(n) time and O(1) space.",
    "badgeName": "Stealth Optimizer"
  },
  {
    "id": "coin-change",
    "slug": "coin-change",
    "title": "Coin Change: Minimum Denomination DP",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "acceptance": "43.7%",
    "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.",
    "realWorldContext": "Micro-transaction change-making algorithms in Stripe/Cashfree billing gateways and optimal network MTU packet fragmentation.",
    "examples": [
      {
        "input": "coins = [1, 2, 5], amount = 11",
        "output": "3",
        "explanation": "11 = 5 + 5 + 1"
      },
      {
        "input": "coins = [2], amount = 3",
        "output": "-1"
      },
      {
        "input": "coins = [1], amount = 0",
        "output": "0"
      }
    ],
    "constraints": [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    "hints": [
      "Create a DP array of size (amount + 1) initialized to Infinity, with dp[0] = 0.",
      "For each coin c, dp[i] = min(dp[i], dp[i - c] + 1)."
    ],
    "starterCodeJs": "/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nfunction coinChange(coins, amount) {\n  // Write your bottom-up DP solution here\n  \n}",
    "starterCodeTs": "function coinChange(coins: number[], amount: number): number {\n  // Write your bottom-up DP solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}",
    "testCases": [
      {
        "name": "Standard Denominations 11",
        "inputArgs": [
          [
            1,
            2,
            5
          ],
          11
        ],
        "expected": 3
      },
      {
        "name": "Impossible Target",
        "inputArgs": [
          [
            2
          ],
          3
        ],
        "expected": -1
      },
      {
        "name": "Zero Amount",
        "inputArgs": [
          [
            1
          ],
          0
        ],
        "expected": 0
      }
    ],
    "editorial": "Bottom-up 1D DP where `dp[i]` is the minimum coins needed for amount `i`. Iterate through all amounts from 1 to `amount` updating via `dp[i - coin] + 1`.",
    "badgeName": "Currency Alchemist"
  },
  {
    "id": "search-a-2d-matrix",
    "slug": "search-a-2d-matrix",
    "title": "Search a 2D Matrix: Row-Column Binary Search",
    "difficulty": "Medium",
    "category": "Binary Search",
    "acceptance": "49.6%",
    "description": "You are given an `m x n` integer matrix `matrix` with the following two properties:\n1. Each row is sorted in non-decreasing order.\n2. The first integer of each row is greater than the last integer of the previous row.\n\nGiven an integer `target`, return `true` if `target` is in `matrix` or `false` otherwise in O(log(m * n)) time.",
    "realWorldContext": "B-Tree index leaf page traversal in PostgreSQL and SQLite disk storage engines.",
    "examples": [
      {
        "input": "matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target = 3",
        "output": "true"
      },
      {
        "input": "matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target = 13",
        "output": "false"
      }
    ],
    "constraints": [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 100",
      "-10^4 <= matrix[i][j], target <= 10^4"
    ],
    "hints": [
      "Treat the entire 2D matrix as a virtual 1D array of length m * n.",
      "Coordinate mapping: row = Math.floor(mid / n), col = mid % n."
    ],
    "starterCodeJs": "/**\n * @param {number[][]} matrix\n * @param {number} target\n * @return {boolean}\n */\nfunction searchMatrix(matrix, target) {\n  // Write your O(log(m*n)) binary search here\n  \n}",
    "starterCodeTs": "function searchMatrix(matrix: number[][], target: number): boolean {\n  // Write your O(log(m*n)) binary search here\n  \n}",
    "starterCodePy": "class Solution:\n    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:\n        pass",
    "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool searchMatrix(vector<vector<int>>& matrix, int target) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        return false;\n    }\n}",
    "testCases": [
      {
        "name": "Target Exists In First Row",
        "inputArgs": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          3
        ],
        "expected": true
      },
      {
        "name": "Target Not In Matrix",
        "inputArgs": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          13
        ],
        "expected": false
      },
      {
        "name": "Single Cell True",
        "inputArgs": [
          [
            [
              5
            ]
          ],
          5
        ],
        "expected": true
      }
    ],
    "editorial": "Map indices `low=0` to `high=m*n-1`. At midpoint `mid`, element is at `matrix[Math.floor(mid/n)][mid%n]`. Standard binary search executes in O(log(m*n)).",
    "badgeName": "Matrix Navigator"
  },
  {
    "id": "find-minimum-in-rotated-sorted-array",
    "slug": "find-minimum-in-rotated-sorted-array",
    "title": "Find Minimum in Rotated Sorted Array",
    "difficulty": "Medium",
    "category": "Binary Search",
    "acceptance": "50.1%",
    "description": "Suppose an array of length `n` sorted in ascending order is rotated between 1 and `n` times.\n\nGiven the sorted rotated array `nums` of unique elements, return the minimum element of this array in O(log n) time.",
    "realWorldContext": "Locating clock-skew synchronization offsets in distributed consensus nodes (Raft / Paxos) across UTC boundaries.",
    "examples": [
      {
        "input": "nums = [3, 4, 5, 1, 2]",
        "output": "1"
      },
      {
        "input": "nums = [4, 5, 6, 7, 0, 1, 2]",
        "output": "0"
      },
      {
        "input": "nums = [11, 13, 15, 17]",
        "output": "11"
      }
    ],
    "constraints": [
      "n == nums.length",
      "1 <= n <= 5000",
      "-5000 <= nums[i] <= 5000",
      "All integers of nums are unique."
    ],
    "hints": [
      "Compare nums[mid] with nums[right].",
      "If nums[mid] > nums[right], the minimum must be in the right half: left = mid + 1.",
      "Else the minimum is in the left half or at mid: right = mid."
    ],
    "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findMin(nums) {\n  // Write your O(log n) binary search here\n  \n}",
    "starterCodeTs": "function findMin(nums: number[]): number {\n  // Write your O(log n) binary search here\n  \n}",
    "starterCodePy": "class Solution:\n    def findMin(self, nums: list[int]) -> int:\n        pass",
    "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int findMin(int[] nums) {\n        return 0;\n    }\n}",
    "testCases": [
      {
        "name": "Rotated at Index 3",
        "inputArgs": [
          [
            3,
            4,
            5,
            1,
            2
          ]
        ],
        "expected": 1
      },
      {
        "name": "Rotated with Zero",
        "inputArgs": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ]
        ],
        "expected": 0
      },
      {
        "name": "Unrotated Ascending",
        "inputArgs": [
          [
            11,
            13,
            15,
            17
          ]
        ],
        "expected": 11
      }
    ],
    "editorial": "If `nums[mid] > nums[right]`, the inflection point is to the right (`left = mid + 1`). Otherwise `right = mid`. Stop when `left == right`.",
    "badgeName": "Rotation Pivot Finder"
  },
  {
    "id": "number-of-islands",
    "slug": "number-of-islands",
    "title": "Number of Islands: 2D Grid BFS/DFS",
    "difficulty": "Medium",
    "category": "Trees & Graphs",
    "acceptance": "58.9%",
    "description": "Given an `m x n` 2D binary grid `grid` which represents a map of \"1\"s (land) and \"0\"s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    "realWorldContext": "Computer vision connected-component labeling in satellite imaging, autonomous driving road segment detection, and medical tumor segmentation.",
    "examples": [
      {
        "input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "output": "1"
      },
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3"
      }
    ],
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is \"0\" or \"1\"."
    ],
    "hints": [
      "Iterate over every cell. When you find a '1', increment the island count.",
      "Launch a DFS or BFS to sink the entire island by setting connected '1's to '0'."
    ],
    "starterCodeJs": "/**\n * @param {string[][]} grid\n * @return {number}\n */\nfunction numIslands(grid) {\n  // Write your BFS/DFS connected components solution here\n  \n}",
    "starterCodeTs": "function numIslands(grid: string[][]): number {\n  // Write your BFS/DFS connected components solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        pass",
    "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}",
    "testCases": [
      {
        "name": "Single Big Island",
        "inputArgs": [
          [
            [
              "1",
              "1",
              "1",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "0",
              "0"
            ]
          ]
        ],
        "expected": 1
      },
      {
        "name": "Three Disconnected Islands",
        "inputArgs": [
          [
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "1",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "1",
              "1"
            ]
          ]
        ],
        "expected": 3
      }
    ],
    "editorial": "Iterate across the grid. On encountering '1', increment island counter and invoke recursive DFS marking all 4-directional neighbors as '0' to avoid double-counting.",
    "badgeName": "Archipelago Cartographer"
  },
  {
    "id": "scaled-dot-product-attention",
    "slug": "scaled-dot-product-attention",
    "title": "Scaled Dot-Product Attention (Transformer Engine)",
    "difficulty": "Hard",
    "category": "AI & Machine Learning",
    "acceptance": "42.1%",
    "description": "In Transformer neural networks (GPT-4, Gemini, Claude), given query vector `Q`, key vector `K`, value vector `V`, and dimension `dk`, compute the 1D scaled dot-product attention score `softmax(Q · K / sqrt(dk)) * V`.\n\nFor 1D single-token pairs, return the scalar result rounded to 4 decimal places.",
    "realWorldContext": "The foundational core equation of modern Generative AI driving language generation, image synthesis, and multimodal reasoning.",
    "examples": [
      {
        "input": "q = [1, 0], k = [1, 0], v = [10], dk = 2",
        "output": "10"
      }
    ],
    "constraints": [
      "q.length == k.length",
      "1 <= dk <= 1024"
    ],
    "hints": [
      "Dot product = sum(q[i] * k[i]).",
      "Scale by dividing by Math.sqrt(dk)."
    ],
    "starterCodeJs": "/**\n * @param {number[]} q\n * @param {number[]} k\n * @param {number[]} v\n * @param {number} dk\n * @return {number}\n */\nfunction scaledDotProductAttention(q, k, v, dk) {\n  // Write your Transformer attention calculation here\n  \n}",
    "starterCodeTs": "function scaledDotProductAttention(q: number[], k: number[], v: number[], dk: number): number {\n  // Write your Transformer attention calculation here\n  \n}",
    "starterCodePy": "import math\n\nclass Solution:\n    def scaledDotProductAttention(self, q: list[float], k: list[float], v: list[float], dk: int) -> float:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <cmath>\nusing namespace std;\n\nclass Solution {\npublic:\n    double scaledDotProductAttention(vector<double>& q, vector<double>& k, vector<double>& v, int dk) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public double scaledDotProductAttention(double[] q, double[] k, double[] v, int dk) {\n        return 0.0;\n    }\n}",
    "testCases": [
      {
        "name": "Identical Q and K",
        "inputArgs": [
          [
            1,
            0
          ],
          [
            1,
            0
          ],
          [
            10
          ],
          2
        ],
        "expected": 10
      },
      {
        "name": "Orthogonal Q and K",
        "inputArgs": [
          [
            1,
            0
          ],
          [
            0,
            1
          ],
          [
            5
          ],
          2
        ],
        "expected": 5
      }
    ],
    "editorial": "Compute `dot = sum(q[i]*k[i])`, scale by `1/sqrt(dk)`, and multiply with values array.",
    "badgeName": "Attention Is All You Need"
  },
  {
    "id": "three-sum",
    "slug": "three-sum",
    "title": "3Sum: Triplet Zero Sum Balance",
    "difficulty": "Medium",
    "category": "Two Pointers",
    "acceptance": "34.1%",
    "description": "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    "realWorldContext": "Used in financial accounting ledger reconciliation to discover 3-party zero-balance offset loops, and in computational geometry for 3-point collinearity detection.",
    "examples": [
      {
        "input": "nums = [-1, 0, 1, 2, -1, -4]",
        "output": "[[-1, -1, 2], [-1, 0, 1]]"
      },
      {
        "input": "nums = [0, 1, 1]",
        "output": "[]"
      },
      {
        "input": "nums = [0, 0, 0]",
        "output": "[[0, 0, 0]]"
      }
    ],
    "constraints": [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    "hints": [
      "Sort the array first in O(n log n).",
      "Fix one number nums[i], then use two pointers (left and right) to find two numbers that sum to -nums[i].",
      "Skip duplicate adjacent elements to avoid duplicate triplets."
    ],
    "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction threeSum(nums) {\n  // Write your Two Pointer solution here\n  \n}",
    "starterCodeTs": "function threeSum(nums: number[]): number[][] {\n  // Write your Two Pointer solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}",
    "testCases": [
      {
        "name": "Standard 6 Elements",
        "inputArgs": [
          [
            -1,
            0,
            1,
            2,
            -1,
            -4
          ]
        ],
        "expected": [
          [
            -1,
            -1,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ]
      },
      {
        "name": "Triple Zeroes",
        "inputArgs": [
          [
            0,
            0,
            0
          ]
        ],
        "expected": [
          [
            0,
            0,
            0
          ]
        ]
      },
      {
        "name": "No Valid Triplet",
        "inputArgs": [
          [
            0,
            1,
            1
          ]
        ],
        "expected": []
      }
    ],
    "editorial": "Sort array ascending. For each index `i`, run Two Pointers `left = i + 1` and `right = len - 1`. Skip duplicate adjacent values to maintain uniqueness.",
    "badgeName": "3-Way Equilibrium"
  },
  {
    "id": "daily-temperatures",
    "slug": "daily-temperatures",
    "title": "Daily Temperatures: Monotonic Stack",
    "difficulty": "Medium",
    "category": "Stack",
    "acceptance": "66.2%",
    "description": "Given an array of integers `temperatures` representing daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0`.",
    "realWorldContext": "Stock ticker breakout prediction and next-higher price signal lookahead in algorithmic trading engines.",
    "examples": [
      {
        "input": "temperatures = [73, 74, 75, 71, 69, 72, 76, 73]",
        "output": "[1, 1, 4, 2, 1, 1, 0, 0]"
      },
      {
        "input": "temperatures = [30, 40, 50, 60]",
        "output": "[1, 1, 1, 0]"
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5",
      "30 <= temperatures[i] <= 100"
    ],
    "hints": [
      "Use a Monotonic Decreasing Stack storing indices.",
      "When encountering a temperature greater than the top of stack, pop and compute the difference in indices."
    ],
    "starterCodeJs": "/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures(temperatures) {\n  // Write your monotonic stack solution here\n  \n}",
    "starterCodeTs": "function dailyTemperatures(temperatures: number[]): number[] {\n  // Write your monotonic stack solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        return new int[]{};\n    }\n}",
    "testCases": [
      {
        "name": "Standard Weather Forecast",
        "inputArgs": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      },
      {
        "name": "Strictly Increasing",
        "inputArgs": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      },
      {
        "name": "Strictly Decreasing",
        "inputArgs": [
          [
            30,
            60,
            90
          ]
        ],
        "expected": [
          1,
          1,
          0
        ]
      }
    ],
    "editorial": "Push index onto stack. While current temp exceeds stack top, pop `prevIndex` and assign `res[prevIndex] = currIndex - prevIndex` in O(n) total time.",
    "badgeName": "Monotonic Horizon Hunter"
  },
  {
    "id": "generate-parentheses",
    "slug": "generate-parentheses",
    "title": "Generate Parentheses: Backtracking Tree",
    "difficulty": "Medium",
    "category": "Stack",
    "acceptance": "74.8%",
    "description": "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    "realWorldContext": "AST parser generation, mathematical formula validation, and compiler grammar tree construction.",
    "examples": [
      {
        "input": "n = 3",
        "output": "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]"
      },
      {
        "input": "n = 1",
        "output": "[\"()\"]"
      }
    ],
    "constraints": [
      "1 <= n <= 8"
    ],
    "hints": [
      "Use backtracking with recursion.",
      "You can add '(' if openCount < n.",
      "You can add ')' if closeCount < openCount."
    ],
    "starterCodeJs": "/**\n * @param {number} n\n * @return {string[]}\n */\nfunction generateParenthesis(n) {\n  // Write your backtracking solution here\n  \n}",
    "starterCodeTs": "function generateParenthesis(n: number): string[] {\n  // Write your backtracking solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def generateParenthesis(self, n: int) -> list[str]:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<string> generateParenthesis(int n) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public List<String> generateParenthesis(int n) {\n        return new ArrayList<>();\n    }\n}",
    "testCases": [
      {
        "name": "3 Pairs",
        "inputArgs": [
          3
        ],
        "expected": [
          "((()))",
          "(()())",
          "(())()",
          "()(())",
          "()()()"
        ]
      },
      {
        "name": "1 Pair",
        "inputArgs": [
          1
        ],
        "expected": [
          "()"
        ]
      },
      {
        "name": "2 Pairs",
        "inputArgs": [
          2
        ],
        "expected": [
          "(())",
          "()()"
        ],
        "isHidden": true
      }
    ],
    "editorial": "Backtrack tracking `open` and `close` counts. Append '(' if `open < n`, and ')' if `close < open`. Base case reached when `current.length == 2 * n`.",
    "badgeName": "Syntax Weaver"
  },
  {
    "id": "insert-interval",
    "slug": "insert-interval",
    "title": "Insert Interval: Calendar Merging",
    "difficulty": "Medium",
    "category": "Intervals",
    "acceptance": "41.8%",
    "description": "You are given an array of non-overlapping intervals `intervals` where `intervals[i] = [start_i, end_i]` sorted in ascending order by `start_i`.\n\nYou are also given an interval `newInterval = [start, end]`. Insert `newInterval` into `intervals` such that `intervals` is still sorted and contains no overlapping intervals (merge if necessary).",
    "realWorldContext": "Conflict-free meeting room booking in Google Calendar, schedule compaction in airline reservations, and memory chunk defragmentation.",
    "examples": [
      {
        "input": "intervals = [[1, 3], [6, 9]], newInterval = [2, 5]",
        "output": "[[1, 5], [6, 9]]"
      },
      {
        "input": "intervals = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval = [4, 8]",
        "output": "[[1, 2], [3, 10], [12, 16]]"
      }
    ],
    "constraints": [
      "0 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "newInterval.length == 2"
    ],
    "hints": [
      "Add all intervals ending before newInterval starts.",
      "Merge all overlapping intervals with newInterval by updating its start and end.",
      "Add all remaining intervals starting after newInterval ends."
    ],
    "starterCodeJs": "/**\n * @param {number[][]} intervals\n * @param {number[]} newInterval\n * @return {number[][]}\n */\nfunction insert(intervals, newInterval) {\n  // Write your O(n) interval insertion here\n  \n}",
    "starterCodeTs": "function insert(intervals: number[][], newInterval: number[]): number[][] {\n  // Write your O(n) interval insertion here\n  \n}",
    "starterCodePy": "class Solution:\n    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int[][] insert(int[][] intervals, int[] newInterval) {\n        return new int[][]{};\n    }\n}",
    "testCases": [
      {
        "name": "Standard Merge Overlap",
        "inputArgs": [
          [
            [
              1,
              3
            ],
            [
              6,
              9
            ]
          ],
          [
            2,
            5
          ]
        ],
        "expected": [
          [
            1,
            5
          ],
          [
            6,
            9
          ]
        ]
      },
      {
        "name": "Multi-Interval Span Merge",
        "inputArgs": [
          [
            [
              1,
              2
            ],
            [
              3,
              5
            ],
            [
              6,
              7
            ],
            [
              8,
              10
            ],
            [
              12,
              16
            ]
          ],
          [
            4,
            8
          ]
        ],
        "expected": [
          [
            1,
            2
          ],
          [
            3,
            10
          ],
          [
            12,
            16
          ]
        ]
      },
      {
        "name": "Insert into Empty Calendar",
        "inputArgs": [
          [],
          [
            5,
            7
          ]
        ],
        "expected": [
          [
            5,
            7
          ]
        ]
      }
    ],
    "editorial": "Three linear passes in one traversal: (1) push intervals before overlap, (2) merge all overlapping spans into `[min(start), max(end)]`, (3) push remaining trailing intervals in O(n) time.",
    "badgeName": "Chronos Scheduler"
  },
  {
    "id": "reverse-array-in-place",
    "slug": "reverse-array-in-place",
    "title": "Reverse Array In-Place: O(1) Memory Inversion",
    "difficulty": "Easy",
    "category": "Two Pointers",
    "acceptance": "84.5%",
    "description": "Given an array `arr`, reverse the elements in-place and return the mutated array without allocating another array of length n.",
    "realWorldContext": "Undo stack history inversion, GPU vertex winding order reversal, and audio sample time-reversal DSP processing.",
    "examples": [
      {
        "input": "arr = [1, 2, 3, 4, 5]",
        "output": "[5, 4, 3, 2, 1]"
      },
      {
        "input": "arr = [1, 2]",
        "output": "[2, 1]"
      }
    ],
    "constraints": [
      "0 <= arr.length <= 10^5"
    ],
    "hints": [
      "Use two pointers: left = 0, right = arr.length - 1.",
      "Swap elements and advance pointers until left >= right."
    ],
    "starterCodeJs": "/**\n * @param {any[]} arr\n * @return {any[]}\n */\nfunction reverseArray(arr) {\n  // Write your in-place two pointer solution here\n  \n}",
    "starterCodeTs": "function reverseArray(arr: any[]): any[] {\n  // Write your in-place two pointer solution here\n  \n}",
    "starterCodePy": "class Solution:\n    def reverseArray(self, arr: list) -> list:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> reverseArray(vector<int>& arr) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public int[] reverseArray(int[] arr) {\n        return arr;\n    }\n}",
    "testCases": [
      {
        "name": "Odd Length Array",
        "inputArgs": [
          [
            1,
            2,
            3,
            4,
            5
          ]
        ],
        "expected": [
          5,
          4,
          3,
          2,
          1
        ]
      },
      {
        "name": "Even Length Array",
        "inputArgs": [
          [
            10,
            20
          ]
        ],
        "expected": [
          20,
          10
        ]
      },
      {
        "name": "Single Element Array",
        "inputArgs": [
          [
            42
          ]
        ],
        "expected": [
          42
        ]
      }
    ],
    "editorial": "Two-pointer symmetric swap from edges inward achieves O(n) time and strict O(1) space complexity.",
    "badgeName": "Symmetry Inverter"
  },
  {
    "id": "binary-cross-entropy",
    "slug": "binary-cross-entropy",
    "title": "Binary Cross-Entropy Loss (ML Classifier)",
    "difficulty": "Medium",
    "category": "AI & Machine Learning",
    "acceptance": "58.4%",
    "description": "Given true labels `yTrue` (0 or 1) and predicted probabilities `yPred` (between 0 and 1 exclusive), compute the mean Binary Cross-Entropy (BCE) loss across all samples: `-1/N * sum(y * log(p) + (1 - y) * log(1 - p))` rounded to 4 decimal places.",
    "realWorldContext": "Standard loss objective function for logistic regression, binary classification, and transformer reward models in RLHF (Reinforcement Learning from Human Feedback).",
    "examples": [
      {
        "input": "yTrue = [1, 0], yPred = [0.9, 0.1]",
        "output": "0.1054"
      }
    ],
    "constraints": [
      "yTrue.length == yPred.length",
      "1 <= yTrue.length <= 10^4",
      "0.0001 <= yPred[i] <= 0.9999"
    ],
    "hints": [
      "Accumulate loss = y * Math.log(p) + (1 - y) * Math.log(1 - p).",
      "Divide by -N and use Number(loss.toFixed(4))."
    ],
    "starterCodeJs": "/**\n * @param {number[]} yTrue\n * @param {number[]} yPred\n * @return {number}\n */\nfunction binaryCrossEntropy(yTrue, yPred) {\n  // Write your BCE Loss computation here\n  \n}",
    "starterCodeTs": "function binaryCrossEntropy(yTrue: number[], yPred: number[]): number {\n  // Write your BCE Loss computation here\n  \n}",
    "starterCodePy": "import math\n\nclass Solution:\n    def binaryCrossEntropy(self, yTrue: list[int], yPred: list[float]) -> float:\n        pass",
    "starterCodeCpp": "#include <vector>\n#include <cmath>\nusing namespace std;\n\nclass Solution {\npublic:\n    double binaryCrossEntropy(vector<int>& yTrue, vector<double>& yPred) {\n        \n    }\n};",
    "starterCodeJava": "class Solution {\n    public double binaryCrossEntropy(int[] yTrue, double[] yPred) {\n        return 0.0;\n    }\n}",
    "testCases": [
      {
        "name": "Confident Accurate Predictions",
        "inputArgs": [
          [
            1,
            0
          ],
          [
            0.9,
            0.1
          ]
        ],
        "expected": 0.1054
      },
      {
        "name": "50-50 Uncertain Predictions",
        "inputArgs": [
          [
            1,
            0
          ],
          [
            0.5,
            0.5
          ]
        ],
        "expected": 0.6931
      }
    ],
    "editorial": "Iterate over predictions summing `-y*ln(p) - (1-y)*ln(1-p)`. Return average rounded to 4 decimal places.",
    "badgeName": "Loss Function Alchemist"
  }
];
