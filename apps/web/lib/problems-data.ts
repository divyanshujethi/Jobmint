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
  companies?: string[];
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
    "badgeName": "Arrays Master: Two Sum",
    "companies": ["Google","Amazon","Microsoft","Swiggy","Uber"]
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
    "badgeName": "Stack Architect: Parentheses",
    "companies": ["Amazon","Microsoft","Google","Bloomberg"]
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
    "badgeName": "HFT Quant: Stock Arbitrage",
    "companies": ["Amazon","Google","Swiggy","Goldman Sachs"]
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
    "badgeName": "DP Vanguard: Kadane",
    "companies": ["Google","Amazon","Microsoft"]
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
    "badgeName": "Hash Master: Deduplication",
    "companies": ["Amazon","Apple","Adobe","Swiggy"]
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
    "badgeName": "Frequency Specialist: Anagram",
    "companies": ["Uber","Google","Amazon"]
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
    "badgeName": "Calendar Maven: Intervals",
    "companies": ["Google","Uber","Microsoft","Swiggy"]
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
    "badgeName": "Algorithmist: Binary Search",
    "companies": ["Microsoft","Google","Amazon","Uber"]
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
    "badgeName": "AI Architect: Vector Math",
    "companies": ["Google","Amazon","Microsoft","Swiggy","Uber"]
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
    "badgeName": "GenAI Pioneer: Token Sampling",
    "companies": ["Google","Amazon","Microsoft","Swiggy"]
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
    "badgeName": "NLP Specialist: Tokenizer Engine",
    "companies": ["Google","Amazon","Microsoft"]
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
    "badgeName": "Frontend Architect: Tree Traversal",
    "companies": ["Google","Amazon","Microsoft","Swiggy","Uber"]
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
    "badgeName": "Full-Stack Engineer: Immutability",
    "companies": ["Google","Amazon","Microsoft","Swiggy","Uber"]
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
    "badgeName": "Gateway Architect: Traffic Control",
    "companies": ["Uber","Swiggy","Amazon","Google"]
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
    "badgeName": "Distributed Systems: Consistent Hashing",
    "companies": ["Google","Amazon","Microsoft","Swiggy"]
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
    "badgeName": "Product Array Prodigy",
    "companies": ["Amazon","Microsoft","Apple","Uber"]
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
    "badgeName": "Top-K Trending Architect",
    "companies": ["Google","Amazon","Microsoft","Swiggy","Uber"]
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
    "badgeName": "Unbroken Sequence Master",
    "companies": ["Google","Amazon","Microsoft","Swiggy"]
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
    "badgeName": "Palindrome Purist",
    "companies": ["Google","Amazon","Microsoft","Swiggy"]
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
    "badgeName": "Reservoir Architect",
    "companies": ["Google","Amazon","Microsoft","Swiggy"]
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
    "badgeName": "Sliding Window Sage",
    "companies": ["Amazon","Microsoft","Google","Swiggy"]
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
    "badgeName": "Stairway Strategist",
    "companies": ["Amazon","Google","Uber"]
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
    "badgeName": "Stealth Optimizer",
    "companies": ["Google","Amazon","Microsoft"]
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
    "badgeName": "Currency Alchemist",
    "companies": ["Amazon","Microsoft","Swiggy","Uber"]
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
    "badgeName": "Matrix Navigator",
    "companies": ["Google","Amazon","Microsoft"]
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
    "badgeName": "Rotation Pivot Finder",
    "companies": ["Google","Amazon","Microsoft"]
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
    "badgeName": "Archipelago Cartographer",
    "companies": ["Amazon","Google","Microsoft","Uber"]
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
    "badgeName": "Attention Is All You Need",
    "companies": ["Google","Amazon","Microsoft","Swiggy"]
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
    "badgeName": "3-Way Equilibrium",
    "companies": ["Google","Amazon","Microsoft"]
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
    "badgeName": "Monotonic Horizon Hunter",
    "companies": ["Google","Amazon","Microsoft"]
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
    "badgeName": "Syntax Weaver",
    "companies": ["Google","Amazon","Microsoft","Swiggy","Uber"]
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
    "badgeName": "Chronos Scheduler",
    "companies": ["Google","Amazon","Microsoft"]
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
    "badgeName": "Symmetry Inverter",
    "companies": ["Google","Amazon","Microsoft","Swiggy"]
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
    "badgeName": "Loss Function Alchemist",
    "companies": ["Google","Amazon","Microsoft","Swiggy","Uber"]
  },
{
  "id": "trapping-rain-water",
  "slug": "trapping-rain-water",
  "title": "Trapping Rain Water: Monotonic Elevation Trap",
  "difficulty": "Hard",
  "category": "Two Pointers",
  "acceptance": "61.2%",
  "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.\n\nWater can only be trapped between two higher boundaries. The trapped water at any index is `min(maxLeft, maxRight) - height[i]`.",
  "realWorldContext": "Applied in GIS topographical hydrology modelling and reservoir watershed simulations at Google Maps and Earth Engine to calculate surface water runoff retention.",
  "examples": [
    {
      "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
      "output": "6",
      "explanation": "The elevation map [0,1,0,2,1,0,1,3,2,1,2,1] traps 6 units of rain water."
    },
    {
      "input": "height = [4,2,0,3,2,5]",
      "output": "9",
      "explanation": "Traps 9 units of rain water between boundary elevations."
    }
  ],
  "constraints": [
    "n == height.length",
    "1 <= n <= 2 * 10^4",
    "0 <= height[i] <= 10^5"
  ],
  "hints": [
    "Consider what determines the water level at any index: the minimum of the highest bar to its left and right.",
    "Can you maintain two pointers from left and right, tracking maxLeft and maxRight in O(1) auxiliary space?",
    "Move the pointer pointing to the smaller maximum boundary inward."
  ],
  "starterCodeJs": "/**\n * @param {number[]} height\n * @return {number}\n */\nfunction trap(height) {\n  // Write your O(n) two-pointer solution here\n  \n}",
  "starterCodeTs": "function trap(height: number[]): number {\n  // Write your O(n) two-pointer solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def trap(self, height: list[int]) -> int:\n        # Write your O(n) two-pointer solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your O(n) solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public int trap(int[] height) {\n        // Write your O(n) solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Ridge",
      "inputArgs": [
        [
          0,
          1,
          0,
          2,
          1,
          0,
          1,
          3,
          2,
          1,
          2,
          1
        ]
      ],
      "expected": 6
    },
    {
      "name": "Deep Basin",
      "inputArgs": [
        [
          4,
          2,
          0,
          3,
          2,
          5
        ]
      ],
      "expected": 9
    },
    {
      "name": "Flat Ground",
      "inputArgs": [
        [
          3,
          3,
          3,
          3
        ]
      ],
      "expected": 0
    },
    {
      "name": "V Shaped Valley",
      "inputArgs": [
        [
          5,
          0,
          5
        ]
      ],
      "expected": 5,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Two Pointers (O(n) Time, O(1) Space)\n\nInstead of precomputing prefix and suffix arrays in O(n) memory, maintain `left` and `right` pointers with `maxLeft` and `maxRight` running maximums.\n\nAt each step, if `maxLeft < maxRight`, the bottleneck for `left` is guaranteed to be `maxLeft` regardless of future values. We accumulate `maxLeft - height[left]` and advance `left++`. Otherwise, we advance `right--`.\n\nTime Complexity: O(n)\nSpace Complexity: O(1)",
  "badgeName": "Hydraulic Master",
  "companies": [
    "Google",
    "Amazon",
    "Microsoft"
  ]
},
{
  "id": "median-of-two-sorted-arrays",
  "slug": "median-of-two-sorted-arrays",
  "title": "Median of Two Sorted Arrays: Logarithmic Partition",
  "difficulty": "Hard",
  "category": "Binary Search",
  "acceptance": "39.8%",
  "description": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity must be `O(log (m+n))`.",
  "realWorldContext": "Used in real-time distributed telemetry streams (Kafka / ClickHouse) at Uber and Amazon to compute median latency SLAs across partitioned edge logs without merging them.",
  "examples": [
    {
      "input": "nums1 = [1,3], nums2 = [2]",
      "output": "2",
      "explanation": "Merged array = [1,2,3] and median is 2."
    },
    {
      "input": "nums1 = [1,2], nums2 = [3,4]",
      "output": "2.5",
      "explanation": "Merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
    }
  ],
  "constraints": [
    "nums1.length == m",
    "nums2.length == n",
    "0 <= m <= 1000",
    "0 <= n <= 1000",
    "1 <= m + n <= 2000",
    "-10^6 <= nums1[i], nums2[i] <= 10^6"
  ],
  "hints": [
    "Binary search on the partition index of the smaller array so the search range is O(log(min(m, n))).",
    "Partition both arrays into Left and Right halves such that len(Left) == len(Right) and all elements in Left <= all elements in Right.",
    "Check boundary values: max(leftA, leftB) <= min(rightA, rightB)."
  ],
  "starterCodeJs": "/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nfunction findMedianSortedArrays(nums1, nums2) {\n  // Write your O(log(min(m, n))) binary search here\n  \n}",
  "starterCodeTs": "function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n  // Write your O(log(min(m, n))) binary search here\n  \n}",
  "starterCodePy": "class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        # Write your O(log(min(m, n))) solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <algorithm>\n#include <climits>\nusing namespace std;\n\nclass Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n}",
  "testCases": [
    {
      "name": "Odd Total Length",
      "inputArgs": [
        [
          1,
          3
        ],
        [
          2
        ]
      ],
      "expected": 2
    },
    {
      "name": "Even Total Length",
      "inputArgs": [
        [
          1,
          2
        ],
        [
          3,
          4
        ]
      ],
      "expected": 2.5
    },
    {
      "name": "Disjoint Ranges",
      "inputArgs": [
        [
          1,
          2
        ],
        [
          5,
          6,
          7
        ]
      ],
      "expected": 5
    },
    {
      "name": "Empty First Array",
      "inputArgs": [
        [],
        [
          1
        ]
      ],
      "expected": 1,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Binary Search on Partitioning\n\nEnsure `nums1` is the shorter array. Run binary search on partition point `i` of `nums1` in range `[0, m]`. Compute `j = (m + n + 1) / 2 - i` for `nums2`.\n\nBoundary check:\n- `nums1[i-1] <= nums2[j]` and `nums2[j-1] <= nums1[i]`.\nIf condition holds, the median is either `max(left)` (if total odd) or `(max(left) + min(right)) / 2.0` (if total even).\n\nTime Complexity: O(log(min(m, n)))\nSpace Complexity: O(1)",
  "badgeName": "Logarithmic Partition Prodigy",
  "companies": [
    "Google",
    "Microsoft",
    "Amazon"
  ]
},
{
  "id": "merge-k-sorted-lists",
  "slug": "merge-k-sorted-lists",
  "title": "Merge k Sorted Lists: Min-Heap Multiplexer",
  "difficulty": "Hard",
  "category": "Trees & Graphs",
  "acceptance": "51.4%",
  "description": "You are given an array of `k` sorted integer arrays `lists`. Merge all the sorted arrays into one single sorted array and return it.\n\nAnalyze and describe its complexity.",
  "realWorldContext": "Core to distributed log aggregation systems (Loki, Elasticsearch, Kafka) at Swiggy and Uber, where time-sorted log shards from k microservices are multiplexed in real-time.",
  "examples": [
    {
      "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
      "output": "[1,1,2,3,4,4,5,6]",
      "explanation": "The arrays are merged into a single sorted stream."
    },
    {
      "input": "lists = []",
      "output": "[]",
      "explanation": "Empty input yields empty array."
    }
  ],
  "constraints": [
    "k == lists.length",
    "0 <= k <= 10^4",
    "0 <= lists[i].length <= 500",
    "-10^4 <= lists[i][j] <= 10^4",
    "lists[i] is sorted in ascending order.",
    "The sum of lists[i].length will not exceed 10^4."
  ],
  "hints": [
    "A divide-and-conquer merge pairs lists two-by-two, halving k at each round in O(N log k) time.",
    "Alternatively, use a Min-Heap (priority queue) storing the current front element of each of the k lists.",
    "Compare the heap approach vs divide and conquer."
  ],
  "starterCodeJs": "/**\n * @param {number[][]} lists\n * @return {number[]}\n */\nfunction mergeKLists(lists) {\n  // Write your O(N log k) solution here\n  \n}",
  "starterCodeTs": "function mergeKLists(lists: number[][]): number[] {\n  // Write your O(N log k) solution here\n  \n}",
  "starterCodePy": "import heapq\n\nclass Solution:\n    def mergeKLists(self, lists: list[list[int]]) -> list[int]:\n        # Write your O(N log k) solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> mergeKLists(vector<vector<int>>& lists) {\n        // Write your solution here\n        return {};\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int[] mergeKLists(int[][] lists) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "testCases": [
    {
      "name": "Three Streams",
      "inputArgs": [
        [
          [
            1,
            4,
            5
          ],
          [
            1,
            3,
            4
          ],
          [
            2,
            6
          ]
        ]
      ],
      "expected": [
        1,
        1,
        2,
        3,
        4,
        4,
        5,
        6
      ]
    },
    {
      "name": "Empty List",
      "inputArgs": [
        []
      ],
      "expected": []
    },
    {
      "name": "Single Stream",
      "inputArgs": [
        [
          [
            2,
            3,
            7
          ]
        ]
      ],
      "expected": [
        2,
        3,
        7
      ]
    },
    {
      "name": "Disjoint Ranges",
      "inputArgs": [
        [
          [
            1,
            2
          ],
          [
            3,
            4
          ],
          [
            5,
            6
          ]
        ]
      ],
      "expected": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Divide & Conquer or Min-Heap (O(N log k))\n\nPair up k lists and merge each pair in O(len) using standard two-pointer merging. After the first pass, k/2 lists remain; after the second, k/4, until 1 list remains in log k passes.\n\nTotal operations: N * log k where N is the total number of elements across all lists.\n\nTime Complexity: O(N log k)\nSpace Complexity: O(N) for output",
  "badgeName": "Stream Multiplex Master",
  "companies": [
    "Amazon",
    "Google",
    "Uber"
  ]
},
{
  "id": "sliding-window-maximum",
  "slug": "sliding-window-maximum",
  "title": "Sliding Window Maximum: Monotonic Deque",
  "difficulty": "Hard",
  "category": "Sliding Window",
  "acceptance": "46.5%",
  "description": "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window array.",
  "realWorldContext": "Used in High-Frequency Trading order book volatility monitors and streaming audio/video loudness peak meters at Spotify and Amazon.",
  "examples": [
    {
      "input": "nums = [1,3,-1,-3,5,3,6,7], k = 3",
      "output": "[3,3,5,5,6,7]",
      "explanation": "Window shifts from [1,3,-1] -> 3, [3,-1,-3] -> 3, [-1,-3,5] -> 5, etc."
    },
    {
      "input": "nums = [1], k = 1",
      "output": "[1]",
      "explanation": "Single element window returns [1]."
    }
  ],
  "constraints": [
    "1 <= nums.length <= 10^5",
    "-10^4 <= nums[i] <= 10^4",
    "1 <= k <= nums.length"
  ],
  "hints": [
    "A brute force checks all k elements in each window in O(n*k) time, which will TLE.",
    "Can you maintain a double-ended queue (deque) containing indices of elements in descending order of value?",
    "Before pushing index i, pop smaller elements from the back of the deque."
  ],
  "starterCodeJs": "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction maxSlidingWindow(nums, k) {\n  // Write your O(n) Monotonic Deque solution here\n  \n}",
  "starterCodeTs": "function maxSlidingWindow(nums: number[], k: number): number[] {\n  // Write your O(n) Monotonic Deque solution here\n  \n}",
  "starterCodePy": "from collections import deque\n\nclass Solution:\n    def maxSlidingWindow(self, nums: list[int], k: number) -> list[int]:\n        # Write your O(n) solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <deque>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        // Write your solution here\n        return {};\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  "testCases": [
    {
      "name": "Standard Array",
      "inputArgs": [
        [
          1,
          3,
          -1,
          -3,
          5,
          3,
          6,
          7
        ],
        3
      ],
      "expected": [
        3,
        3,
        5,
        5,
        6,
        7
      ]
    },
    {
      "name": "Unit Window",
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
      "name": "Strictly Decreasing",
      "inputArgs": [
        [
          9,
          8,
          7,
          6,
          5
        ],
        3
      ],
      "expected": [
        9,
        8,
        7
      ]
    },
    {
      "name": "Strictly Increasing",
      "inputArgs": [
        [
          1,
          2,
          3,
          4,
          5
        ],
        2
      ],
      "expected": [
        2,
        3,
        4,
        5
      ],
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Monotonic Decreasing Deque (O(n) Time, O(k) Space)\n\nMaintain indices in a deque such that `nums[deque[i]]` is strictly decreasing.\n1. Discard indices outside the current window: `deque.front <= i - k`.\n2. Discard elements smaller than `nums[i]` from `deque.back` (they can never be the maximum again).\n3. Push `i` to back.\n4. If `i >= k - 1`, record `nums[deque.front]` into the result.\n\nTime Complexity: O(n) since each element enters and leaves the deque at most once.\nSpace Complexity: O(k)",
  "badgeName": "Monotonic Window Ace",
  "companies": [
    "Google",
    "Amazon",
    "Swiggy"
  ]
},
{
  "id": "longest-valid-parentheses",
  "slug": "longest-valid-parentheses",
  "title": "Longest Valid Parentheses: Stack Boundary DP",
  "difficulty": "Hard",
  "category": "Stack",
  "acceptance": "34.1%",
  "description": "Given a string containing just the characters `'('` and `')'`, return the length of the longest valid (well-formed) parentheses substring.",
  "realWorldContext": "Used in compiler frontends (LLVM, V8) and code formatters (Prettier) to locate well-balanced syntactic blocks and isolate bracket parsing errors.",
  "examples": [
    {
      "input": "s = '(()'",
      "output": "2",
      "explanation": "The longest valid parentheses substring is '()'."
    },
    {
      "input": "s = ')()())'",
      "output": "4",
      "explanation": "The longest valid parentheses substring is '()()'."
    },
    {
      "input": "s = ''",
      "output": "0",
      "explanation": "Empty string yields 0."
    }
  ],
  "constraints": [
    "0 <= s.length <= 3 * 10^4",
    "s[i] is '(' or ')'."
  ],
  "hints": [
    "Can you push indices onto a stack to keep track of the boundaries of valid substrings?",
    "Initialize the stack with `-1` to serve as the baseline index before any character.",
    "When encountering `')'`, pop from the stack. If the stack is empty, push current index as new baseline; otherwise calculate `i - stack.top()`."
  ],
  "starterCodeJs": "/**\n * @param {string} s\n * @return {number}\n */\nfunction longestValidParentheses(s) {\n  // Write your O(n) Stack or DP solution here\n  \n}",
  "starterCodeTs": "function longestValidParentheses(s: string): number {\n  // Write your O(n) Stack or DP solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def longestValidParentheses(self, s: str) -> int:\n        # Write your O(n) solution here\n        pass",
  "starterCodeCpp": "#include <string>\n#include <stack>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int longestValidParentheses(string s) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int longestValidParentheses(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Prefix Invalid",
      "inputArgs": [
        "(()"
      ],
      "expected": 2
    },
    {
      "name": "Split Sequence",
      "inputArgs": [
        ")()())"
      ],
      "expected": 4
    },
    {
      "name": "Empty String",
      "inputArgs": [
        ""
      ],
      "expected": 0
    },
    {
      "name": "Nested and Adjacent",
      "inputArgs": [
        "()((()))"
      ],
      "expected": 8,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Index Stack (O(n) Time, O(n) Space)\n\nInitialize a stack with `-1` representing the index prior to the start of the valid substring.\n- For `'('`, push index `i`.\n- For `')'`, pop the top.\n  - If the stack becomes empty, push `i` as the new base index boundary.\n  - Otherwise, update `maxLen = max(maxLen, i - stack.top())`.\n\nTime Complexity: O(n)\nSpace Complexity: O(n)",
  "badgeName": "Syntax Scope Guardian",
  "companies": [
    "Microsoft",
    "Google",
    "Amazon"
  ]
},
{
  "id": "edit-distance",
  "slug": "edit-distance",
  "title": "Edit Distance: Levenshtein Matrix DP",
  "difficulty": "Hard",
  "category": "Dynamic Programming",
  "acceptance": "56.2%",
  "description": "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n1. Insert a character\n2. Delete a character\n3. Replace a character",
  "realWorldContext": "Underpins fuzzy search and query autocorrect in Google Search, spellcheckers, and DNA sequence genome alignment algorithms.",
  "examples": [
    {
      "input": "word1 = 'horse', word2 = 'ros'",
      "output": "3",
      "explanation": "horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e')."
    },
    {
      "input": "word1 = 'intention', word2 = 'execution'",
      "output": "5",
      "explanation": "intention -> inention -> enention -> exention -> exection -> execution."
    }
  ],
  "constraints": [
    "0 <= word1.length, word2.length <= 500",
    "word1 and word2 consist of lowercase English letters."
  ],
  "hints": [
    "Define `dp[i][j]` as the min edit distance between prefix `word1[0..i-1]` and `word2[0..j-1]`.",
    "If `word1[i-1] === word2[j-1]`, no operation is needed: `dp[i][j] = dp[i-1][j-1]`.",
    "Otherwise, `dp[i][j] = 1 + min(insert, delete, replace)`."
  ],
  "starterCodeJs": "/**\n * @param {string} word1\n * @param {string} word2\n * @return {number}\n */\nfunction minDistance(word1, word2) {\n  // Write your O(m*n) Dynamic Programming solution here\n  \n}",
  "starterCodeTs": "function minDistance(word1: string, word2: string): number {\n  // Write your O(m*n) Dynamic Programming solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        # Write your O(m*n) solution here\n        pass",
  "starterCodeCpp": "#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public int minDistance(String word1, String word2) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Words",
      "inputArgs": [
        "horse",
        "ros"
      ],
      "expected": 3
    },
    {
      "name": "Polysyllabic Words",
      "inputArgs": [
        "intention",
        "execution"
      ],
      "expected": 5
    },
    {
      "name": "Identical Strings",
      "inputArgs": [
        "same",
        "same"
      ],
      "expected": 0
    },
    {
      "name": "One Empty String",
      "inputArgs": [
        "",
        "abc"
      ],
      "expected": 3,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: 2D Dynamic Programming (O(m*n))\n\nLet `dp[i][j]` be the minimum operations to transform `word1[0..i-1]` into `word2[0..j-1]`.\nBase cases: `dp[i][0] = i` (deletions), `dp[0][j] = j` (insertions).\nTransitions:\n- If `word1[i-1] == word2[j-1]`: `dp[i][j] = dp[i-1][j-1]`\n- Else: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`\n\nCan be space-optimized to O(min(m, n)) using rolling 1D buffers.\n\nTime Complexity: O(m * n)\nSpace Complexity: O(m * n) or O(min(m, n))",
  "badgeName": "Levenshtein Virtuoso",
  "companies": [
    "Google",
    "Uber",
    "Amazon"
  ]
},
{
  "id": "largest-rectangle-in-histogram",
  "slug": "largest-rectangle-in-histogram",
  "title": "Largest Rectangle in Histogram: Monotonic Bar Stack",
  "difficulty": "Hard",
  "category": "Stack",
  "acceptance": "44.7%",
  "description": "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is `1`, return the area of the largest rectangle in the histogram.",
  "realWorldContext": "Used in computer vision (optical character recognition, bounding box segmentation) and database query planning for maximal contiguous memory block allocators.",
  "examples": [
    {
      "input": "heights = [2,1,5,6,2,3]",
      "output": "10",
      "explanation": "The largest rectangle is formed by bars [5, 6] with area = 2 * 5 = 10."
    },
    {
      "input": "heights = [2,4]",
      "output": "4",
      "explanation": "The largest rectangle has area 4 (either bar 2 with width 2 or bar 4 with width 1)."
    }
  ],
  "constraints": [
    "1 <= heights.length <= 10^5",
    "0 <= heights[i] <= 10^4"
  ],
  "hints": [
    "For each bar of height h, what is the maximum width it can span? The span extends left and right until a bar with height < h is encountered.",
    "Use a monotonic increasing stack of bar indices.",
    "When a shorter bar arrives, pop from the stack and compute width using current index and previous stack top."
  ],
  "starterCodeJs": "/**\n * @param {number[]} heights\n * @return {number}\n */\nfunction largestRectangleArea(heights) {\n  // Write your O(n) Monotonic Stack solution here\n  \n}",
  "starterCodeTs": "function largestRectangleArea(heights: number[]): number {\n  // Write your O(n) Monotonic Stack solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def largestRectangleArea(self, heights: list[int]) -> int:\n        # Write your O(n) solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <stack>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int largestRectangleArea(vector<int>& heights) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int largestRectangleArea(int[] heights) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Histogram",
      "inputArgs": [
        [
          2,
          1,
          5,
          6,
          2,
          3
        ]
      ],
      "expected": 10
    },
    {
      "name": "Two Bars",
      "inputArgs": [
        [
          2,
          4
        ]
      ],
      "expected": 4
    },
    {
      "name": "Uniform Plateau",
      "inputArgs": [
        [
          3,
          3,
          3,
          3
        ]
      ],
      "expected": 12
    },
    {
      "name": "Strictly Increasing",
      "inputArgs": [
        [
          1,
          2,
          3,
          4,
          5
        ]
      ],
      "expected": 9,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Monotonic Increasing Stack (O(n) Time, O(n) Space)\n\nMaintain indices of bars in strictly increasing height order on a stack.\nWhen current height `h < heights[stack.top()]`, pop index `idx`. The popped bar's height is `heights[idx]`.\nIts width is:\n- If stack is empty: `i`\n- Else: `i - stack.top() - 1`\nCalculate area and track maximum. Append a dummy bar of height 0 at the end to flush all remaining stack entries.\n\nTime Complexity: O(n)\nSpace Complexity: O(n)",
  "badgeName": "Geometric Bounds Grandmaster",
  "companies": [
    "Google",
    "Amazon",
    "Microsoft"
  ]
},
{
  "id": "minimum-window-substring",
  "slug": "minimum-window-substring",
  "title": "Minimum Window Substring: Frequency Constrained Window",
  "difficulty": "Hard",
  "category": "Sliding Window",
  "acceptance": "42.8%",
  "description": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.\n\nThe testcases will be generated such that the answer is unique.",
  "realWorldContext": "Used in streaming network packet sniffers (Wireshark) and security SIEM log parsers (Splunk) to detect intrusion exploit signatures within payload streams.",
  "examples": [
    {
      "input": "s = 'ADOBECODEBANC', t = 'ABC'",
      "output": "'BANC'",
      "explanation": "The minimum window substring 'BANC' includes 'A', 'B', and 'C' from string t."
    },
    {
      "input": "s = 'a', t = 'a'",
      "output": "'a'",
      "explanation": "The entire string s is the minimum window."
    },
    {
      "input": "s = 'a', t = 'aa'",
      "output": "''",
      "explanation": "Both 'a's from t must be included in the window, so no valid substring exists."
    }
  ],
  "constraints": [
    "m == s.length",
    "n == t.length",
    "1 <= m, n <= 10^5",
    "s and t consist of uppercase and lowercase English letters."
  ],
  "hints": [
    "Use two pointers (left and right) to expand and contract a sliding window.",
    "Count character frequencies of t in a hash map. Track `have` matches vs `need` total distinct characters.",
    "Expand `right` until all characters of t are satisfied, then contract `left` to minimize window length."
  ],
  "starterCodeJs": "/**\n * @param {string} s\n * @param {string} t\n * @return {string}\n */\nfunction minWindow(s, t) {\n  // Write your O(m + n) sliding window solution here\n  \n}",
  "starterCodeTs": "function minWindow(s: string, t: string): string {\n  // Write your O(m + n) sliding window solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        # Write your O(m + n) solution here\n        pass",
  "starterCodeCpp": "#include <string>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    string minWindow(string s, string t) {\n        // Write your solution here\n        return \"\";\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public String minWindow(String s, String t) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "testCases": [
    {
      "name": "Standard Target Window",
      "inputArgs": [
        "ADOBECODEBANC",
        "ABC"
      ],
      "expected": "BANC"
    },
    {
      "name": "Single Character Match",
      "inputArgs": [
        "a",
        "a"
      ],
      "expected": "a"
    },
    {
      "name": "Duplicate Requirement Unsatisfied",
      "inputArgs": [
        "a",
        "aa"
      ],
      "expected": ""
    },
    {
      "name": "Full Match Required",
      "inputArgs": [
        "ab",
        "b"
      ],
      "expected": "b",
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Two Pointers Sliding Window (O(m + n))\n\n1. Build target frequency map `countT` for all characters in `t`. Total distinct chars needed = `required`.\n2. Expand right pointer `r`. Maintain `window` frequency map. If `window[s[r]] === countT[s[r]]`, increment `formed++`.\n3. While `formed === required`, update `minLen` and shrink from `l++`.\n\nTime Complexity: O(m + n)\nSpace Complexity: O(distinct characters) <= O(128) = O(1)",
  "badgeName": "Window Substring Specialist",
  "companies": [
    "Google",
    "Amazon",
    "Microsoft"
  ]
},
{
  "id": "word-ladder",
  "slug": "word-ladder",
  "title": "Word Ladder: BFS Shortest Transform Sequence",
  "difficulty": "Hard",
  "category": "Trees & Graphs",
  "acceptance": "39.1%",
  "description": "A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:\n- Every adjacent pair of words differs by exactly one letter.\n- Every `si` for `1 <= i <= k` is in `wordList` (`beginWord` does not need to be in `wordList`).\n- `sk == endWord`.\n\nGiven two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence, or `0` if no such sequence exists.",
  "realWorldContext": "Powers shortest path state machine transitions, mutation evolutionary trees in bioinformatics, and game-solving graph search engines.",
  "examples": [
    {
      "input": "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']",
      "output": "5",
      "explanation": "One shortest transformation sequence is 'hit' -> 'hot' -> 'dot' -> 'dog' -> 'cog', which is 5 words long."
    },
    {
      "input": "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log']",
      "output": "0",
      "explanation": "The endWord 'cog' is not in wordList, therefore there is no valid transformation sequence."
    }
  ],
  "constraints": [
    "1 <= beginWord.length <= 10",
    "endWord.length == beginWord.length",
    "1 <= wordList.length <= 5000",
    "wordList[i].length == beginWord.length",
    "beginWord, endWord, and wordList[i] consist of lowercase English letters.",
    "beginWord != endWord",
    "All words in wordList are unique."
  ],
  "hints": [
    "Since every edge between two single-character mutating words has unit weight, Breadth-First Search (BFS) guarantees finding the shortest transformation path.",
    "Put wordList into a HashSet for O(1) lookup.",
    "For each word, generate all 26 possible mutations for each character position."
  ],
  "starterCodeJs": "/**\n * @param {string} beginWord\n * @param {string} endWord\n * @param {string[]} wordList\n * @return {number}\n */\nfunction ladderLength(beginWord, endWord, wordList) {\n  // Write your O(M^2 * N) BFS solution here\n  \n}",
  "starterCodeTs": "function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {\n  // Write your O(M^2 * N) BFS solution here\n  \n}",
  "starterCodePy": "from collections import deque\n\nclass Solution:\n    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:\n        # Write your BFS solution here\n        pass",
  "starterCodeCpp": "#include <string>\n#include <vector>\n#include <unordered_set>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Transform Path",
      "inputArgs": [
        "hit",
        "cog",
        [
          "hot",
          "dot",
          "dog",
          "lot",
          "log",
          "cog"
        ]
      ],
      "expected": 5
    },
    {
      "name": "Unreachable Target Word",
      "inputArgs": [
        "hit",
        "cog",
        [
          "hot",
          "dot",
          "dog",
          "lot",
          "log"
        ]
      ],
      "expected": 0
    },
    {
      "name": "One Step Mutation",
      "inputArgs": [
        "a",
        "c",
        [
          "a",
          "b",
          "c"
        ]
      ],
      "expected": 2
    },
    {
      "name": "Dead End Path",
      "inputArgs": [
        "cat",
        "dog",
        [
          "cot",
          "cog"
        ]
      ],
      "expected": 0,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Breadth-First Search (BFS)\n\nTreat each word as a graph node. An undirected edge exists between any two words differing by 1 character.\nStore `wordList` in a set `dictSet`. If `endWord` is not present, return 0.\nInitialize BFS queue with `[beginWord, 1]`. For each word popped:\n- Try changing each of its `L` positions through `'a'..'z'`.\n- If a mutated word is in `dictSet`, delete it from `dictSet` (to avoid cycles) and enqueue with `level + 1`.\n\nTime Complexity: O(M^2 * N) where M is word length and N is dictionary size.\nSpace Complexity: O(M * N)",
  "badgeName": "Lexical Graph Navigator",
  "companies": [
    "Amazon",
    "Google",
    "Microsoft"
  ]
},
{
  "id": "regular-expression-matching",
  "slug": "regular-expression-matching",
  "title": "Regular Expression Matching: Recursive Wildcard DP",
  "difficulty": "Hard",
  "category": "Dynamic Programming",
  "acceptance": "28.5%",
  "description": "Given an input string `s` and a pattern `p`, implement regular expression matching with support for `'.'` and `'*'` where:\n- `'.'` Matches any single character.\n- `'*'` Matches zero or more of the preceding element.\n\nThe matching should cover the entire input string (not partial).",
  "realWorldContext": "Foundation of regex parser engines in web browsers (V8 JavaScript RegExp engine, WebKit) and lexer tokenizers in compilers.",
  "examples": [
    {
      "input": "s = 'aa', p = 'a'",
      "output": "false",
      "explanation": "'a' does not match the entire string 'aa'."
    },
    {
      "input": "s = 'aa', p = 'a*'",
      "output": "true",
      "explanation": "'*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes 'aa'."
    },
    {
      "input": "s = 'ab', p = '.*'",
      "output": "true",
      "explanation": "'.*' means 'zero or more (*) of any character (.)'."
    }
  ],
  "constraints": [
    "1 <= s.length <= 20",
    "1 <= p.length <= 20",
    "s contains only lowercase English letters.",
    "p contains only lowercase English letters, '.', and '*'.",
    "It is guaranteed for each appearance of the character '*', there will be a previous valid character to match."
  ],
  "hints": [
    "Notice that '*' always binds to the character preceding it.",
    "Use 2D DP: `dp[i][j]` is true if `s[i..]` matches `p[j..]`.",
    "When `p[j+1] === '*'`: Either skip `x*` completely (`dp[i][j+2]`), or match first char if it matches and advance s (`firstMatch && dp[i+1][j]`)."
  ],
  "starterCodeJs": "/**\n * @param {string} s\n * @param {string} p\n * @return {boolean}\n */\nfunction isMatch(s, p) {\n  // Write your O(m*n) Dynamic Programming solution here\n  \n}",
  "starterCodeTs": "function isMatch(s: string, p: string): boolean {\n  // Write your O(m*n) Dynamic Programming solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def isMatch(self, s: str, p: str) -> bool:\n        # Write your DP solution here\n        pass",
  "starterCodeCpp": "#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isMatch(string s, string p) {\n        // Write your solution here\n        return false;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public boolean isMatch(String s, String p) {\n        // Write your solution here\n        return false;\n    }\n}",
  "testCases": [
    {
      "name": "Single Star Match",
      "inputArgs": [
        "aa",
        "a*"
      ],
      "expected": true
    },
    {
      "name": "Dot Star Match",
      "inputArgs": [
        "ab",
        ".*"
      ],
      "expected": true
    },
    {
      "name": "Pattern Mismatch",
      "inputArgs": [
        "mississippi",
        "mis*is*p*."
      ],
      "expected": false
    },
    {
      "name": "Zero Star Repetitions",
      "inputArgs": [
        "aab",
        "c*a*b"
      ],
      "expected": true,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: 2D Dynamic Programming (O(m*n))\n\nLet `dp[i][j]` represent if `s[i..m]` matches `p[j..n]`.\nWhen analyzing `p[j]`, if `p[j+1] === '*'`, we have two branching choices:\n1. Treat `p[j..j+1]` as matching 0 occurrences: `dp[i][j+2]`.\n2. If `first_match = (i < m and (p[j] == s[i] or p[j] == '.'))`, match 1 occurrence: `first_match and dp[i+1][j]`.\n\nOtherwise, if no star, `first_match and dp[i+1][j+1]`.\n\nTime Complexity: O(m * n)\nSpace Complexity: O(m * n)",
  "badgeName": "Regular Grammar Architect",
  "companies": [
    "Google",
    "Microsoft",
    "Uber"
  ]
},
{
  "id": "subarray-sum-equals-k",
  "slug": "subarray-sum-equals-k",
  "title": "Subarray Sum Equals K: Prefix Sum Hash Frequency",
  "difficulty": "Medium",
  "category": "Arrays & Hashing",
  "acceptance": "43.5%",
  "description": "Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals to `k`.",
  "realWorldContext": "Critical in financial audit reconciliations at Stripe and Razorpay to detect exact matched billing transaction sequences in ledger histories.",
  "examples": [
    {
      "input": "nums = [1,1,1], k = 2",
      "output": "2",
      "explanation": "Subarrays [1, 1] at indices [0, 1] and [1, 2] both sum to 2."
    },
    {
      "input": "nums = [1,2,3], k = 3",
      "output": "2",
      "explanation": "Subarrays [1, 2] and [3] sum to 3."
    }
  ],
  "constraints": [
    "1 <= nums.length <= 2 * 10^4",
    "-1000 <= nums[i] <= 1000",
    "-10^7 <= k <= 10^7"
  ],
  "hints": [
    "Notice that array elements can be negative, so two pointers / sliding window does not work monotonically.",
    "If prefixSum[j] - prefixSum[i] = k, then the subarray between i and j sums to k.",
    "Store prefix sum frequencies in a hash map."
  ],
  "starterCodeJs": "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nfunction subarraySum(nums, k) {\n  // Write your O(n) prefix sum solution here\n  \n}",
  "starterCodeTs": "function subarraySum(nums: number[], k: number): number {\n  // Write your O(n) prefix sum solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def subarraySum(self, nums: list[int], k: int) -> int:\n        # Write your O(n) solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int subarraySum(int[] nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Identical Elements",
      "inputArgs": [
        [
          1,
          1,
          1
        ],
        2
      ],
      "expected": 2
    },
    {
      "name": "Mixed Elements",
      "inputArgs": [
        [
          1,
          2,
          3
        ],
        3
      ],
      "expected": 2
    },
    {
      "name": "Zero Sum Cancellation",
      "inputArgs": [
        [
          1,
          -1,
          0
        ],
        0
      ],
      "expected": 3
    },
    {
      "name": "Single Exact Match",
      "inputArgs": [
        [
          3
        ],
        3
      ],
      "expected": 1,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Prefix Sum with Hash Map (O(n) Time, O(n) Space)\n\nMaintain running prefix sum `currSum`.\nAt each index, check if `currSum - k` exists in hash map `prefixMap`.\nIf it does, add its frequency to `count`.\nIncrement frequency of `currSum` in `prefixMap`.\nInitialize map with `{0: 1}` to handle subarrays starting at index 0.\n\nTime Complexity: O(n)\nSpace Complexity: O(n)",
  "badgeName": "Prefix Sum Analyst",
  "companies": [
    "Google",
    "Meta",
    "Swiggy"
  ]
},
{
  "id": "search-in-rotated-sorted-array",
  "slug": "search-in-rotated-sorted-array",
  "title": "Search in Rotated Sorted Array: Displaced Binary Search",
  "difficulty": "Medium",
  "category": "Binary Search",
  "acceptance": "40.9%",
  "description": "There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k`.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
  "realWorldContext": "Used in ring buffer circular queues, distributed DHT offset lookups, and chronological log partitions.",
  "examples": [
    {
      "input": "nums = [4,5,6,7,0,1,2], target = 0",
      "output": "4",
      "explanation": "Target 0 is found at index 4."
    },
    {
      "input": "nums = [4,5,6,7,0,1,2], target = 3",
      "output": "-1",
      "explanation": "Target 3 is not present in the array."
    }
  ],
  "constraints": [
    "1 <= nums.length <= 5000",
    "-10^4 <= nums[i] <= 10^4",
    "All values of nums are unique.",
    "nums is an ascending array that is possibly rotated.",
    "-10^4 <= target <= 10^4"
  ],
  "hints": [
    "At least one half of the array (left or right of mid) is always normally sorted.",
    "Check if nums[left] <= nums[mid]. If true, left half is sorted. Check if target lies within nums[left]..nums[mid].",
    "Otherwise, right half is sorted. Adjust pointers accordingly."
  ],
  "starterCodeJs": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n  // Write your O(log n) binary search here\n  \n}",
  "starterCodeTs": "function search(nums: number[], target: number): number {\n  // Write your O(log n) binary search here\n  \n}",
  "starterCodePy": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your O(log n) solution here\n        pass",
  "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your solution here\n        return -1;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your solution here\n        return -1;\n    }\n}",
  "testCases": [
    {
      "name": "Rotated Match",
      "inputArgs": [
        [
          4,
          5,
          6,
          7,
          0,
          1,
          2
        ],
        0
      ],
      "expected": 4
    },
    {
      "name": "Target Absent",
      "inputArgs": [
        [
          4,
          5,
          6,
          7,
          0,
          1,
          2
        ],
        3
      ],
      "expected": -1
    },
    {
      "name": "Single Element Found",
      "inputArgs": [
        [
          1
        ],
        1
      ],
      "expected": 0
    },
    {
      "name": "Pivot at Mid",
      "inputArgs": [
        [
          5,
          1,
          3
        ],
        5
      ],
      "expected": 0,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Modified Binary Search (O(log n))\n\nIn any rotated sorted array, the midpoint divides the array into one normally sorted half and one rotated half.\n1. Calculate `mid = left + (right - left) / 2`.\n2. If `nums[mid] === target`, return `mid`.\n3. If `nums[left] <= nums[mid]` (left half sorted):\n   - If `nums[left] <= target < nums[mid]`, search left (`right = mid - 1`), else search right (`left = mid + 1`).\n4. Else (right half sorted):\n   - If `nums[mid] < target <= nums[right]`, search right (`left = mid + 1`), else search left (`right = mid - 1`).\n\nTime Complexity: O(log n)\nSpace Complexity: O(1)",
  "badgeName": "Pivot Binary Seeker",
  "companies": [
    "Google",
    "Amazon",
    "Microsoft"
  ]
},
{
  "id": "rotting-oranges",
  "slug": "rotting-oranges",
  "title": "Rotting Oranges: Multi-Source Grid Wavefront BFS",
  "difficulty": "Medium",
  "category": "Trees & Graphs",
  "acceptance": "54.1%",
  "description": "You are given an `m x n` grid where each cell can have one of three values:\n- `0` representing an empty cell,\n- `1` representing a fresh orange, or\n- `2` representing a rotten orange.\n\nEvery minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.\n\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return `-1`.",
  "realWorldContext": "Used in epidemiology contagion spread models, wildfire propagation simulators, and cascading node failure alerts in AWS data center clusters.",
  "examples": [
    {
      "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
      "output": "4",
      "explanation": "All fresh oranges rot in 4 minutes."
    },
    {
      "input": "grid = [[2,1,1],[0,1,1],[1,0,1]]",
      "output": "-1",
      "explanation": "The orange in bottom left corner is isolated and never rots."
    }
  ],
  "constraints": [
    "m == grid.length",
    "n == grid[i].length",
    "1 <= m, n <= 10",
    "grid[i][j] is 0, 1, or 2."
  ],
  "hints": [
    "This is a multi-source shortest path problem on an unweighted grid.",
    "Enqueue ALL initial rotten oranges (cells with value 2) at minute 0 into a BFS queue.",
    "Count total fresh oranges initially. Decrement count as BFS infects adjacent cells."
  ],
  "starterCodeJs": "/**\n * @param {number[][]} grid\n * @return {number}\n */\nfunction orangesRotting(grid) {\n  // Write your Multi-Source BFS solution here\n  \n}",
  "starterCodeTs": "function orangesRotting(grid: number[][]): number {\n  // Write your Multi-Source BFS solution here\n  \n}",
  "starterCodePy": "from collections import deque\n\nclass Solution:\n    def orangesRotting(self, grid: list[list[int]]) -> int:\n        # Write your BFS solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int orangesRotting(vector<vector<int>>& grid) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int orangesRotting(int[][] grid) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Grid Cascade",
      "inputArgs": [
        [
          [
            2,
            1,
            1
          ],
          [
            1,
            1,
            0
          ],
          [
            0,
            1,
            1
          ]
        ]
      ],
      "expected": 4
    },
    {
      "name": "Isolated Cell",
      "inputArgs": [
        [
          [
            2,
            1,
            1
          ],
          [
            0,
            1,
            1
          ],
          [
            1,
            0,
            1
          ]
        ]
      ],
      "expected": -1
    },
    {
      "name": "No Fresh Oranges",
      "inputArgs": [
        [
          [
            0,
            2
          ]
        ]
      ],
      "expected": 0
    },
    {
      "name": "Corner Rotten",
      "inputArgs": [
        [
          [
            1,
            2
          ]
        ]
      ],
      "expected": 1,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Multi-source BFS (O(m * n))\n\n1. Scan grid: count `fresh` oranges and enqueue all `(r, c)` rotten cells.\n2. If `fresh === 0`, return 0.\n3. Process queue level by level (each level represents 1 minute).\n4. For each cell popped, examine 4 neighbors. If neighbor has fresh orange, change to rotten `2`, decrement `fresh--`, and enqueue.\n5. If `fresh === 0` after BFS, return `minutes`; else return `-1`.\n\nTime Complexity: O(m * n)\nSpace Complexity: O(m * n)",
  "badgeName": "Contagion Wavefront Solver",
  "companies": [
    "Amazon",
    "Uber",
    "Swiggy"
  ]
},
{
  "id": "course-schedule",
  "slug": "course-schedule",
  "title": "Course Schedule: Topological Cycle Detector",
  "difficulty": "Medium",
  "category": "Trees & Graphs",
  "acceptance": "47.2%",
  "description": "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.",
  "realWorldContext": "Fundamental to package dependency resolvers (npm, cargo, pip), Terraform execution DAGs, and build systems like Bazel.",
  "examples": [
    {
      "input": "numCourses = 2, prerequisites = [[1,0]]",
      "output": "true",
      "explanation": "To take course 1 you should take course 0 first. Feasible."
    },
    {
      "input": "numCourses = 2, prerequisites = [[1,0],[0,1]]",
      "output": "false",
      "explanation": "Cycle detected between course 0 and course 1."
    }
  ],
  "constraints": [
    "1 <= numCourses <= 2000",
    "0 <= prerequisites.length <= 5000",
    "prerequisites[i].length == 2",
    "0 <= ai, bi < numCourses",
    "All the pairs prerequisites[i] are unique."
  ],
  "hints": [
    "This problem is equivalent to detecting whether a directed graph contains a cycle.",
    "Kahn's Algorithm (BFS): Track the in-degree of all nodes.",
    "Enqueue nodes with in-degree 0. As nodes are processed, decrement in-degrees of neighbors."
  ],
  "starterCodeJs": "/**\n * @param {number} numCourses\n * @param {number[][]} prerequisites\n * @return {boolean}\n */\nfunction canFinish(numCourses, prerequisites) {\n  // Write your Topological Sort / Cycle Detection solution here\n  \n}",
  "starterCodeTs": "function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n  // Write your Topological Sort / Cycle Detection solution here\n  \n}",
  "starterCodePy": "from collections import deque, defaultdict\n\nclass Solution:\n    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:\n        # Write your topological sort solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        // Write your solution here\n        return true;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Write your solution here\n        return true;\n    }\n}",
  "testCases": [
    {
      "name": "Valid Linear Prerequisite",
      "inputArgs": [
        2,
        [
          [
            1,
            0
          ]
        ]
      ],
      "expected": true
    },
    {
      "name": "Direct Mutual Dependency Cycle",
      "inputArgs": [
        2,
        [
          [
            1,
            0
          ],
          [
            0,
            1
          ]
        ]
      ],
      "expected": false
    },
    {
      "name": "Diamond DAG",
      "inputArgs": [
        3,
        [
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            1,
            2
          ]
        ]
      ],
      "expected": true
    },
    {
      "name": "Disconnected Forest",
      "inputArgs": [
        4,
        [
          [
            1,
            0
          ],
          [
            2,
            3
          ]
        ]
      ],
      "expected": true,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Kahn's Algorithm (Topological Sort BFS)\n\n1. Build adjacency list `graph` and `inDegree` array of length `numCourses`.\n2. Push all nodes with `inDegree[i] === 0` into a queue.\n3. While queue is non-empty:\n   - Pop node `u`, increment `visitedCount++`.\n   - For every neighbor `v` of `u`, decrement `inDegree[v]--`.\n   - If `inDegree[v] === 0`, push `v`.\n4. Return `visitedCount === numCourses`.\n\nTime Complexity: O(V + E)\nSpace Complexity: O(V + E)",
  "badgeName": "DAG Dependency Architect",
  "companies": [
    "Google",
    "Amazon",
    "Uber"
  ]
},
{
  "id": "kth-largest-element-in-an-array",
  "slug": "kth-largest-element-in-an-array",
  "title": "Kth Largest Element in an Array: QuickSelect Order",
  "difficulty": "Medium",
  "category": "Arrays & Hashing",
  "acceptance": "66.7%",
  "description": "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nNote that it is the `k`th largest element in the sorted order, not the `k`th distinct element.\n\nCan you solve it without sorting in `O(n)` average time?",
  "realWorldContext": "Used in real-time quantile monitoring, top-k leaderboard rank slicing, and database order limit offset execution.",
  "examples": [
    {
      "input": "nums = [3,2,1,5,6,4], k = 2",
      "output": "5",
      "explanation": "Sorted order is [1,2,3,4,5,6], second largest is 5."
    },
    {
      "input": "nums = [3,2,3,1,2,4,5,5,6], k = 4",
      "output": "4",
      "explanation": "4th largest element is 4."
    }
  ],
  "constraints": [
    "1 <= k <= nums.length <= 10^5",
    "-10^4 <= nums[i] <= 10^4"
  ],
  "hints": [
    "Sorting takes O(n log n). Can we do better with QuickSelect or Min-Heap?",
    "A Min-Heap of size k keeps the k largest elements seen so far at top.",
    "QuickSelect achieves average O(n) time by partitioning like QuickSort."
  ],
  "starterCodeJs": "/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nfunction findKthLargest(nums, k) {\n  // Write your O(n) QuickSelect or Min-Heap solution here\n  \n}",
  "starterCodeTs": "function findKthLargest(nums: number[], k: number): number {\n  // Write your O(n) QuickSelect or Min-Heap solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def findKthLargest(self, nums: list[int], k: int) -> int:\n        # Write your solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int findKthLargest(int[] nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Unsorted",
      "inputArgs": [
        [
          3,
          2,
          1,
          5,
          6,
          4
        ],
        2
      ],
      "expected": 5
    },
    {
      "name": "Duplicates Heavy",
      "inputArgs": [
        [
          3,
          2,
          3,
          1,
          2,
          4,
          5,
          5,
          6
        ],
        4
      ],
      "expected": 4
    },
    {
      "name": "Single Element",
      "inputArgs": [
        [
          1
        ],
        1
      ],
      "expected": 1
    },
    {
      "name": "Negative Numbers",
      "inputArgs": [
        [
          -1,
          -2,
          0,
          5,
          3
        ],
        1
      ],
      "expected": 5,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: QuickSelect (Average O(n))\n\nThe k-th largest element is equivalent to index `nums.length - k` in zero-indexed ascending order.\nPartition array around pivot:\n- If `pivotIndex === targetIndex`, return `nums[pivotIndex]`.\n- If `pivotIndex < targetIndex`, recurse on right subarray.\n- Else recurse on left subarray.\n\nTime Complexity: O(n) average, O(n^2) worst case (randomized pivot mitigates worst case).\nSpace Complexity: O(1)",
  "badgeName": "QuickSelect Quantile Virtuoso",
  "companies": [
    "Meta",
    "Amazon",
    "Microsoft"
  ]
},
{
  "id": "pacific-atlantic-water-flow",
  "slug": "pacific-atlantic-water-flow",
  "title": "Pacific Atlantic Water Flow: Continental Dual DFS",
  "difficulty": "Medium",
  "category": "Trees & Graphs",
  "acceptance": "54.9%",
  "description": "There is an `m x n` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific touches the island's top and left edges, and the Atlantic touches the bottom and right edges.\n\nThe island is partitioned into a grid of square cells with heights. Rain water can flow to neighboring cells (up, down, left, right) if the neighboring cell's height is **less than or equal to** the current cell's height.\n\nReturn a 2D list of grid coordinates `[r, c]` from which water can flow to **both** the Pacific and Atlantic oceans.",
  "realWorldContext": "Used in hydrology drainage basin topology, satellite terrain elevation models, and high-water runoff risk assessments.",
  "examples": [
    {
      "input": "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
      "output": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
      "explanation": "Water from these cells can reach both oceans."
    },
    {
      "input": "heights = [[1]]",
      "output": "[[0,0]]",
      "explanation": "A single island cell borders both oceans."
    }
  ],
  "constraints": [
    "m == heights.length",
    "n == heights[r].length",
    "1 <= m, n <= 200",
    "0 <= heights[r][c] <= 10^5"
  ],
  "hints": [
    "Instead of checking if water can flow DOWN from every cell to the ocean, search UPWARDS from ocean boundaries into the island!",
    "Run DFS from Pacific borders (top row, left col) visiting uphill neighbors.",
    "Run another DFS from Atlantic borders (bottom row, right col). Take the intersection."
  ],
  "starterCodeJs": "/**\n * @param {number[][]} heights\n * @return {number[][]}\n */\nfunction pacificAtlantic(heights) {\n  // Write your Dual DFS/BFS solution here\n  \n}",
  "starterCodeTs": "function pacificAtlantic(heights: number[][]): number[][] {\n  // Write your Dual DFS/BFS solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def pacificAtlantic(self, heights: list[list[int]]) -> list[list[int]]:\n        # Write your solution here\n        pass",
  "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {\n        // Write your solution here\n        return {};\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> pacificAtlantic(int[][] heights) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "testCases": [
    {
      "name": "Standard Ridge Grid",
      "inputArgs": [
        [
          [
            1,
            2,
            2,
            3,
            5
          ],
          [
            3,
            2,
            3,
            4,
            4
          ],
          [
            2,
            4,
            5,
            3,
            1
          ],
          [
            6,
            7,
            1,
            4,
            5
          ],
          [
            5,
            1,
            1,
            2,
            4
          ]
        ]
      ],
      "expected": [
        [
          0,
          4
        ],
        [
          1,
          3
        ],
        [
          1,
          4
        ],
        [
          2,
          2
        ],
        [
          3,
          0
        ],
        [
          3,
          1
        ],
        [
          4,
          0
        ]
      ]
    },
    {
      "name": "Unit Island",
      "inputArgs": [
        [
          [
            1
          ]
        ]
      ],
      "expected": [
        [
          0,
          0
        ]
      ]
    },
    {
      "name": "Monotonic Decline",
      "inputArgs": [
        [
          [
            2,
            1
          ],
          [
            1,
            2
          ]
        ]
      ],
      "expected": [
        [
          0,
          0
        ],
        [
          0,
          1
        ],
        [
          1,
          0
        ],
        [
          1,
          1
        ]
      ],
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Reverse Flood DFS (O(m * n))\n\nRather than simulating downhill flow from each of the m*n cells, flow uphill from the coasts:\n1. Maintain boolean matrices `pacific` and `atlantic`.\n2. DFS from Pacific borders (row 0 and col 0), only moving to neighbors where `heights[nr][nc] >= heights[r][c]`.\n3. DFS from Atlantic borders (row m-1 and col n-1) with the same uphill condition.\n4. Result is all cells `(r, c)` where `pacific[r][c] && atlantic[r][c]`.\n\nTime Complexity: O(m * n)\nSpace Complexity: O(m * n)",
  "badgeName": "Oceanic Ridge Cartographer",
  "companies": [
    "Google",
    "Amazon"
  ]
},
{
  "id": "network-delay-time",
  "slug": "network-delay-time",
  "title": "Network Delay Time: Dijkstra Shortest Path Delay",
  "difficulty": "Medium",
  "category": "Trees & Graphs",
  "acceptance": "53.6%",
  "description": "You are given a network of `n` nodes, labeled from `1` to `n`. You are also given `times`, a list of travel times as directed edges `times[i] = (ui, vi, wi)`, where `ui` is the source node, `vi` is the target node, and `wi` is the time it takes for a signal to travel from source to target.\n\nWe will send a signal from a given node `k`. Return the **minimum time** it takes for all the `n` nodes to receive the signal. If it is impossible for all the `n` nodes to receive the signal, return `-1`.",
  "realWorldContext": "Core to network packet routing (OSPF protocol), latency SLA analysis across AWS microservices, and Uber ETA calculation algorithms.",
  "examples": [
    {
      "input": "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
      "output": "2",
      "explanation": "Signal travels from 2 to 1 (cost 1), 2 to 3 (cost 1), and 3 to 4 (cost 1). Max time to reach all nodes is 2."
    },
    {
      "input": "times = [[1,2,1]], n = 2, k = 1",
      "output": "1",
      "explanation": "Takes 1 time unit to reach node 2."
    },
    {
      "input": "times = [[1,2,1]], n = 2, k = 2",
      "output": "-1",
      "explanation": "Node 1 cannot be reached from node 2."
    }
  ],
  "constraints": [
    "1 <= k <= n <= 100",
    "1 <= times.length <= 6000",
    "times[i].length == 3",
    "1 <= ui, vi <= n",
    "ui != vi",
    "0 <= wi <= 100",
    "All the pairs (ui, vi) are unique."
  ],
  "hints": [
    "This is single-source shortest path on a directed weighted graph with non-negative edge weights.",
    "Use Dijkstra's Algorithm with a Min-Priority Queue.",
    "The answer is the maximum shortest distance to any node from k. If any node is unreachable, return -1."
  ],
  "starterCodeJs": "/**\n * @param {number[][]} times\n * @param {number} n\n * @param {number} k\n * @return {number}\n */\nfunction networkDelayTime(times, n, k) {\n  // Write your Dijkstra shortest path solution here\n  \n}",
  "starterCodeTs": "function networkDelayTime(times: number[][], n: number, k: number): number {\n  // Write your Dijkstra shortest path solution here\n  \n}",
  "starterCodePy": "import heapq\n\nclass Solution:\n    def networkDelayTime(self, times: list[list[int]], n: int, k: int) -> int:\n        # Write your Dijkstra solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int networkDelayTime(vector<vector<int>>& times, int n, int k) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int networkDelayTime(int[][] times, int n, int k) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Cascade Tree",
      "inputArgs": [
        [
          [
            2,
            1,
            1
          ],
          [
            2,
            3,
            1
          ],
          [
            3,
            4,
            1
          ]
        ],
        4,
        2
      ],
      "expected": 2
    },
    {
      "name": "Direct Pair",
      "inputArgs": [
        [
          [
            1,
            2,
            1
          ]
        ],
        2,
        1
      ],
      "expected": 1
    },
    {
      "name": "Unreachable Source",
      "inputArgs": [
        [
          [
            1,
            2,
            1
          ]
        ],
        2,
        2
      ],
      "expected": -1
    },
    {
      "name": "Dense Multi-Hop",
      "inputArgs": [
        [
          [
            1,
            2,
            1
          ],
          [
            2,
            3,
            2
          ],
          [
            1,
            3,
            4
          ]
        ],
        3,
        1
      ],
      "expected": 3,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Dijkstra's Algorithm (O((V + E) log V))\n\n1. Represent graph as adjacency list `adj[u] = [[v, w], ...]`. Initialize distance map with `dist[k] = 0` and infinity for all other nodes.\n2. Use Min-Heap storing `(d, u)`.\n3. While heap is non-empty:\n   - Pop min distance `(d, u)`. If `d > dist[u]`, continue.\n   - For each edge `(v, weight)` from `u`, relax edge: if `d + weight < dist[v]`, update `dist[v]` and push to heap.\n4. If `len(visited) < n`, return -1; else return `max(dist.values())`.\n\nTime Complexity: O(E log V)\nSpace Complexity: O(V + E)",
  "badgeName": "Dijkstra Routing Captain",
  "companies": [
    "Uber",
    "Google",
    "Amazon"
  ]
},
{
  "id": "decode-ways",
  "slug": "decode-ways",
  "title": "Decode Ways: Numerical Cipher DP",
  "difficulty": "Medium",
  "category": "Dynamic Programming",
  "acceptance": "34.5%",
  "description": "A message containing letters from `A-Z` can be encoded into numbers using the mapping:\n'A' -> '1', 'B' -> '2', ..., 'Z' -> '26'.\n\nTo decode an encoded message, all the digits must be grouped then mapped back into letters. Given a string `s` containing only digits, return the number of ways to decode it.\n\nNote that `'06'` cannot be decoded into `'F'` because `'06'` is not a valid 2-digit number.",
  "realWorldContext": "Used in variable-length prefix code decoders (Huffman coding), telecommunication binary framing, and cryptographic protocol ciphers.",
  "examples": [
    {
      "input": "s = '12'",
      "output": "2",
      "explanation": "'12' could be decoded as 'AB' (1 2) or 'L' (12)."
    },
    {
      "input": "s = '226'",
      "output": "3",
      "explanation": "'226' could be decoded as 'BZ' (2 26), 'VF' (22 6), or 'BBF' (2 2 6)."
    },
    {
      "input": "s = '06'",
      "output": "0",
      "explanation": "'0' is not mapped to any letter."
    }
  ],
  "constraints": [
    "1 <= s.length <= 100",
    "s contains only digits and may contain leading zero(s)."
  ],
  "hints": [
    "Let dp[i] be the number of ways to decode prefix s[0..i].",
    "If s[i-1] is not '0', it can stand alone as a single character: dp[i] += dp[i-1].",
    "If the two digits s[i-2..i-1] form a number between 10 and 26, dp[i] += dp[i-2]."
  ],
  "starterCodeJs": "/**\n * @param {string} s\n * @return {number}\n */\nfunction numDecodings(s) {\n  // Write your O(n) Dynamic Programming solution here\n  \n}",
  "starterCodeTs": "function numDecodings(s: string): number {\n  // Write your O(n) Dynamic Programming solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def numDecodings(self, s: str) -> int:\n        # Write your DP solution here\n        pass",
  "starterCodeCpp": "#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numDecodings(string s) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public int numDecodings(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Two Valid Interpretations",
      "inputArgs": [
        "12"
      ],
      "expected": 2
    },
    {
      "name": "Three Valid Interpretations",
      "inputArgs": [
        "226"
      ],
      "expected": 3
    },
    {
      "name": "Leading Zero Invalid",
      "inputArgs": [
        "06"
      ],
      "expected": 0
    },
    {
      "name": "Internal Zero Valid",
      "inputArgs": [
        "10"
      ],
      "expected": 1,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: 1D Dynamic Programming (O(n) Time, O(1) Space)\n\nInitialize `dp1 = 1` (ways for empty string), `dp2 = s[0] != '0' ? 1 : 0`.\nFor each character `i` from 2 to `n`:\n- Single digit `s[i-1]`: if `'1' <= s[i-1] <= '9'`, add `dp2`.\n- Two digits `s[i-2..i-1]`: if `'10' <= s[i-2..i-1] <= '26'`, add `dp1`.\n- Slide state: `dp1 = dp2; dp2 = curr`.\n\nTime Complexity: O(n)\nSpace Complexity: O(1)",
  "badgeName": "Cipher Decoder Maestro",
  "companies": [
    "Amazon",
    "Microsoft",
    "Google"
  ]
},
{
  "id": "jump-game-ii",
  "slug": "jump-game-ii",
  "title": "Jump Game II: Minimum Leaps Greedy BFS",
  "difficulty": "Medium",
  "category": "Dynamic Programming",
  "acceptance": "45.0%",
  "description": "You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at `nums[0]`.\n\nEach element `nums[i]` represents the maximum length of a forward jump from index `i`. Return the minimum number of jumps to reach `nums[n - 1]`. You can assume that you can always reach the last index.",
  "realWorldContext": "Used in network packet hop minimization, wireless mesh relay optimization, and game engine character navigation pathfinding.",
  "examples": [
    {
      "input": "nums = [2,3,1,1,4]",
      "output": "2",
      "explanation": "The minimum number of jumps to reach the last index is 2. Jump 1 step from index 0 to 1, then 3 steps to the last index."
    },
    {
      "input": "nums = [2,3,0,1,4]",
      "output": "2",
      "explanation": "Jump 1 step from index 0 to 1, then 3 steps to index 4."
    }
  ],
  "constraints": [
    "1 <= nums.length <= 10^4",
    "0 <= nums[i] <= 1000",
    "It's guaranteed that you can reach nums[n - 1]."
  ],
  "hints": [
    "Think of this as BFS where each jump level is the range of indices reachable with that jump count.",
    "Track `currentEnd` (furthest index reachable with current jumps) and `farthest` (furthest index reachable with 1 more jump).",
    "When index i reaches currentEnd, increment jumps and update currentEnd = farthest."
  ],
  "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction jump(nums) {\n  // Write your O(n) Greedy solution here\n  \n}",
  "starterCodeTs": "function jump(nums: number[]): number {\n  // Write your O(n) Greedy solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def jump(self, nums: list[int]) -> int:\n        # Write your O(n) solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int jump(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public int jump(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Leap",
      "inputArgs": [
        [
          2,
          3,
          1,
          1,
          4
        ]
      ],
      "expected": 2
    },
    {
      "name": "Zero Obstacle Avoidance",
      "inputArgs": [
        [
          2,
          3,
          0,
          1,
          4
        ]
      ],
      "expected": 2
    },
    {
      "name": "Single Element Zero Jumps",
      "inputArgs": [
        [
          0
        ]
      ],
      "expected": 0
    },
    {
      "name": "Linear Chain",
      "inputArgs": [
        [
          1,
          1,
          1,
          1
        ]
      ],
      "expected": 3,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Greedy BFS Range (O(n) Time, O(1) Space)\n\nMaintain:\n- `jumps = 0`: number of jumps taken\n- `currentEnd = 0`: the boundary of the current jump level\n- `farthest = 0`: the maximal reach possible from any node in the current jump level\n\nIterate `i` from `0` to `n - 2`:\n- `farthest = max(farthest, i + nums[i])`\n- When `i === currentEnd`:\n  - `jumps++`\n  - `currentEnd = farthest`\n\nTime Complexity: O(n)\nSpace Complexity: O(1)",
  "badgeName": "Optimal Leap Strategist",
  "companies": [
    "Amazon",
    "Google"
  ]
},
{
  "id": "combination-sum",
  "slug": "combination-sum",
  "title": "Combination Sum: Backtracking Target Explorer",
  "difficulty": "Medium",
  "category": "Arrays & Hashing",
  "acceptance": "71.2%",
  "description": "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.\n\nThe same number may be chosen from `candidates` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.",
  "realWorldContext": "Used in ATM currency cash disbursement algorithms, shopping cart promotional coupon optimizers, and cloud server resource bin-packing.",
  "examples": [
    {
      "input": "candidates = [2,3,6,7], target = 7",
      "output": "[[2,2,3],[7]]",
      "explanation": "2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times."
    },
    {
      "input": "candidates = [2,3,5], target = 8",
      "output": "[[2,2,2,2],[2,3,3],[3,5]]",
      "explanation": "8 can be made by 2+2+2+2, 2+3+3, or 3+5."
    }
  ],
  "constraints": [
    "1 <= candidates.length <= 30",
    "2 <= candidates[i] <= 40",
    "All elements of candidates are distinct.",
    "1 <= target <= 40"
  ],
  "hints": [
    "Use Depth-First Search (Backtracking).",
    "Sort candidates so that you can prune branches as soon as candidate exceeds remaining target.",
    "To avoid duplicate combinations, pass the current index start to the recursive call so candidates can only be chosen in non-decreasing order."
  ],
  "starterCodeJs": "/**\n * @param {number[]} candidates\n * @param {number} target\n * @return {number[][]}\n */\nfunction combinationSum(candidates, target) {\n  // Write your Backtracking solution here\n  \n}",
  "starterCodeTs": "function combinationSum(candidates: number[], target: number): number[][] {\n  // Write your Backtracking solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:\n        # Write your backtracking solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        // Write your solution here\n        return {};\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "testCases": [
    {
      "name": "Single Exact and Combination",
      "inputArgs": [
        [
          2,
          3,
          6,
          7
        ],
        7
      ],
      "expected": [
        [
          2,
          2,
          3
        ],
        [
          7
        ]
      ]
    },
    {
      "name": "Multiple Repeated Element Sums",
      "inputArgs": [
        [
          2,
          3,
          5
        ],
        8
      ],
      "expected": [
        [
          2,
          2,
          2,
          2
        ],
        [
          2,
          3,
          3
        ],
        [
          3,
          5
        ]
      ]
    },
    {
      "name": "Target Impossible",
      "inputArgs": [
        [
          2
        ],
        1
      ],
      "expected": []
    },
    {
      "name": "Single Exact Value",
      "inputArgs": [
        [
          1
        ],
        2
      ],
      "expected": [
        [
          1,
          1
        ]
      ],
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Backtracking with Pruning\n\nSort `candidates`. Define recursive backtrack `dfs(remain, start, path)`:\n- If `remain === 0`, push copy of `path` to `result`.\n- For `i` from `start` to `candidates.length - 1`:\n  - If `candidates[i] > remain`, break (pruning).\n  - `path.push(candidates[i])`\n  - `dfs(remain - candidates[i], i, path)` (pass `i`, not `i + 1`, allowing reuse).\n  - `path.pop()`.\n\nTime Complexity: O(N^(T/M)) where T is target, M is min candidate.\nSpace Complexity: O(T/M) for recursion stack.",
  "badgeName": "State Space Explorer",
  "companies": [
    "Amazon",
    "Google",
    "Microsoft"
  ]
},
{
  "id": "word-break",
  "slug": "word-break",
  "title": "Word Break: Dictionary Segmentability DP",
  "difficulty": "Medium",
  "category": "Dynamic Programming",
  "acceptance": "46.2%",
  "description": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.",
  "realWorldContext": "Used in NLP tokenization (Chinese/Japanese text segmentation without spaces), search query keyword splitting, and URL slug parser segmenters.",
  "examples": [
    {
      "input": "s = 'leetcode', wordDict = ['leet','code']",
      "output": "true",
      "explanation": "Return true because 'leetcode' can be segmented as 'leet code'."
    },
    {
      "input": "s = 'applepenapple', wordDict = ['apple','pen']",
      "output": "true",
      "explanation": "Can be segmented as 'apple pen apple' (reusing 'apple')."
    },
    {
      "input": "s = 'catsandog', wordDict = ['cats','dog','sand','and','cat']",
      "output": "false",
      "explanation": "No valid segmentation exists."
    }
  ],
  "constraints": [
    "1 <= s.length <= 300",
    "1 <= wordDict.length <= 1000",
    "1 <= wordDict[i].length <= 20",
    "s and wordDict[i] consist of only lowercase English letters.",
    "All the strings of wordDict are unique."
  ],
  "hints": [
    "Define `dp[i]` as whether prefix `s[0..i]` can be segmented.",
    "For each `i`, look backwards for a split point `j` such that `dp[j] === true` and `s[j..i]` is in wordDict.",
    "Store wordDict in a HashSet for O(1) string lookup."
  ],
  "starterCodeJs": "/**\n * @param {string} s\n * @param {string[]} wordDict\n * @return {boolean}\n */\nfunction wordBreak(s, wordDict) {\n  // Write your O(n^2) Dynamic Programming solution here\n  \n}",
  "starterCodeTs": "function wordBreak(s: string, wordDict: string[]): boolean {\n  // Write your O(n^2) Dynamic Programming solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def wordBreak(self, s: str, wordDict: list[str]) -> bool:\n        # Write your DP solution here\n        pass",
  "starterCodeCpp": "#include <string>\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        // Write your solution here\n        return false;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        // Write your solution here\n        return false;\n    }\n}",
  "testCases": [
    {
      "name": "Exact Two Word Split",
      "inputArgs": [
        "leetcode",
        [
          "leet",
          "code"
        ]
      ],
      "expected": true
    },
    {
      "name": "Reused Word Split",
      "inputArgs": [
        "applepenapple",
        [
          "apple",
          "pen"
        ]
      ],
      "expected": true
    },
    {
      "name": "Unsegmented Suffix",
      "inputArgs": [
        "catsandog",
        [
          "cats",
          "dog",
          "sand",
          "and",
          "cat"
        ]
      ],
      "expected": false
    },
    {
      "name": "Single Letter Chain",
      "inputArgs": [
        "aaaaaaa",
        [
          "aaaa",
          "aaa"
        ]
      ],
      "expected": true,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: 1D Dynamic Programming (O(n * L^2))\n\nLet `dp[i]` be true if prefix `s[0..i]` can be formed with dictionary words.\nBase case: `dp[0] = true`.\nFor `i` from 1 to `s.length`:\n- For each word `w` in `wordDict`:\n  - If `i >= w.length` and `dp[i - w.length]` is true and `s.slice(i - w.length, i) === w`:\n    - `dp[i] = true; break`.\nReturn `dp[s.length]`.\n\nTime Complexity: O(n * L^2) where L is max word length.\nSpace Complexity: O(n)",
  "badgeName": "Lexical Segmentation Engineer",
  "companies": [
    "Amazon",
    "Google",
    "Meta"
  ]
},
{
  "id": "longest-increasing-subsequence",
  "slug": "longest-increasing-subsequence",
  "title": "Longest Increasing Subsequence: Patience Sort",
  "difficulty": "Medium",
  "category": "Dynamic Programming",
  "acceptance": "54.6%",
  "description": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\nA subsequence is an array that can be derived by deleting some or no elements without changing the order of the remaining elements.\n\nCan you achieve `O(n log n)` time complexity?",
  "realWorldContext": "Used in version control delta diff algorithms (Git patience diff), genomic evolutionary sequence alignments, and stock trend momentum indicators.",
  "examples": [
    {
      "input": "nums = [10,9,2,5,3,7,101,18]",
      "output": "4",
      "explanation": "The longest increasing subsequence is [2,3,7,101], therefore the length is 4."
    },
    {
      "input": "nums = [0,1,0,3,2,3]",
      "output": "4",
      "explanation": "LIS is [0,1,2,3]."
    },
    {
      "input": "nums = [7,7,7,7,7,7,7]",
      "output": "1",
      "explanation": "Strictly increasing means duplicate elements cannot be included."
    }
  ],
  "constraints": [
    "1 <= nums.length <= 2500",
    "-10^4 <= nums[i] <= 10^4"
  ],
  "hints": [
    "O(n^2) DP is simple: dp[i] = 1 + max(dp[j]) for j < i where nums[j] < nums[i].",
    "For O(n log n), maintain array `tails` where `tails[i]` is the smallest tail of all increasing subsequences of length `i+1`.",
    "Use Binary Search (bisect_left) on `tails` for each number."
  ],
  "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction lengthOfLIS(nums) {\n  // Write your O(n log n) Patience Sorting solution here\n  \n}",
  "starterCodeTs": "function lengthOfLIS(nums: number[]): number {\n  // Write your O(n log n) Patience Sorting solution here\n  \n}",
  "starterCodePy": "import bisect\n\nclass Solution:\n    def lengthOfLIS(self, nums: list[int]) -> int:\n        # Write your O(n log n) solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int lengthOfLIS(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Disordered Array",
      "inputArgs": [
        [
          10,
          9,
          2,
          5,
          3,
          7,
          101,
          18
        ]
      ],
      "expected": 4
    },
    {
      "name": "Alternating Values",
      "inputArgs": [
        [
          0,
          1,
          0,
          3,
          2,
          3
        ]
      ],
      "expected": 4
    },
    {
      "name": "Identical Elements",
      "inputArgs": [
        [
          7,
          7,
          7,
          7,
          7,
          7,
          7
        ]
      ],
      "expected": 1
    },
    {
      "name": "Strictly Decreasing",
      "inputArgs": [
        [
          5,
          4,
          3,
          2,
          1
        ]
      ],
      "expected": 1,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Patience Sorting / Binary Search (O(n log n))\n\nMaintain an array `tails` where `tails[len]` stores the minimum ending value of an increasing subsequence of length `len+1`.\nFor each `x` in `nums`:\n- Binary search for the insertion position of `x` in `tails`.\n- If `x` is larger than all elements in `tails`, append `x` to `tails`.\n- Otherwise, update `tails[idx] = x`.\nThe length of `tails` at the end is the length of the LIS.\n\nTime Complexity: O(n log n)\nSpace Complexity: O(n)",
  "badgeName": "Patience Sort Grandmaster",
  "companies": [
    "Google",
    "Microsoft",
    "Amazon"
  ]
},
{
  "id": "unique-paths",
  "slug": "unique-paths",
  "title": "Unique Paths: Grid Combinatorics DP",
  "difficulty": "Medium",
  "category": "Dynamic Programming",
  "acceptance": "64.1%",
  "description": "There is a robot on an `m x n` grid. The robot is initially located at the top-left corner (`grid[0][0]`). The robot tries to move to the bottom-right corner (`grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time.\n\nGiven the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
  "realWorldContext": "Used in routing layout ASIC chip physical design, Manhattan distance path routing, and combinatorics probability distributions.",
  "examples": [
    {
      "input": "m = 3, n = 7",
      "output": "28",
      "explanation": "There are 28 unique paths from top-left to bottom-right."
    },
    {
      "input": "m = 3, n = 2",
      "output": "3",
      "explanation": "Paths: Right->Down->Down, Down->Down->Right, Down->Right->Down."
    }
  ],
  "constraints": [
    "1 <= m, n <= 100"
  ],
  "hints": [
    "Dynamic programming recurrence: dp[r][c] = dp[r-1][c] + dp[r][c-1].",
    "Can be solved in O(n) space using a 1D row array.",
    "Can also be solved in O(min(m, n)) via combinations: Choose (m-1) downs from (m+n-2) total moves."
  ],
  "starterCodeJs": "/**\n * @param {number} m\n * @param {number} n\n * @return {number}\n */\nfunction uniquePaths(m, n) {\n  // Write your O(m*n) DP or Combinatorics solution here\n  \n}",
  "starterCodeTs": "function uniquePaths(m: number, n: number): number {\n  // Write your O(m*n) DP or Combinatorics solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        # Write your solution here\n        pass",
  "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public int uniquePaths(int m, int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Grid",
      "inputArgs": [
        3,
        7
      ],
      "expected": 28
    },
    {
      "name": "Narrow Grid",
      "inputArgs": [
        3,
        2
      ],
      "expected": 3
    },
    {
      "name": "Single Cell",
      "inputArgs": [
        1,
        1
      ],
      "expected": 1
    },
    {
      "name": "Square Matrix",
      "inputArgs": [
        3,
        3
      ],
      "expected": 6,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: 1D Dynamic Programming (O(m * n) Time, O(n) Space)\n\nInitialize 1D array `row` of size `n` with all 1s (representing row 0).\nFor each row from 1 to `m - 1`:\n- For each col from 1 to `n - 1`:\n  - `row[c] = row[c] + row[c - 1]`\nReturn `row[n - 1]`.\n\nTime Complexity: O(m * n)\nSpace Complexity: O(n)",
  "badgeName": "Grid Permutation Prodigy",
  "companies": [
    "Amazon",
    "Google",
    "Swiggy"
  ]
},
{
  "id": "permutations",
  "slug": "permutations",
  "title": "Permutations: Full State Space Exploration",
  "difficulty": "Medium",
  "category": "Arrays & Hashing",
  "acceptance": "77.4%",
  "description": "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
  "realWorldContext": "Used in traveling salesperson route planners, brute-force security keyspace evaluation, and combinatorial scheduling.",
  "examples": [
    {
      "input": "nums = [1,2,3]",
      "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
      "explanation": "All 6 unique permutations of 3 distinct numbers."
    },
    {
      "input": "nums = [0,1]",
      "output": "[[0,1],[1,0]]",
      "explanation": "2 permutations of 2 numbers."
    }
  ],
  "constraints": [
    "1 <= nums.length <= 6",
    "-10 <= nums[i] <= 10",
    "All the integers of nums are unique."
  ],
  "hints": [
    "Use backtracking: at each recursive level, choose an unused number from nums.",
    "Track used elements with a boolean visited array or a set.",
    "Total number of leaves in the recursion tree is n!."
  ],
  "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction permute(nums) {\n  // Write your O(n * n!) backtracking solution here\n  \n}",
  "starterCodeTs": "function permute(nums: number[]): number[][] {\n  // Write your O(n * n!) backtracking solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def permute(self, nums: list[int]) -> list[list[int]]:\n        # Write your backtracking solution here\n        pass",
  "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        // Write your solution here\n        return {};\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "testCases": [
    {
      "name": "Three Elements",
      "inputArgs": [
        [
          1,
          2,
          3
        ]
      ],
      "expected": [
        [
          1,
          2,
          3
        ],
        [
          1,
          3,
          2
        ],
        [
          2,
          1,
          3
        ],
        [
          2,
          3,
          1
        ],
        [
          3,
          1,
          2
        ],
        [
          3,
          2,
          1
        ]
      ]
    },
    {
      "name": "Two Elements",
      "inputArgs": [
        [
          0,
          1
        ]
      ],
      "expected": [
        [
          0,
          1
        ],
        [
          1,
          0
        ]
      ]
    },
    {
      "name": "Single Element",
      "inputArgs": [
        [
          1
        ]
      ],
      "expected": [
        [
          1
        ]
      ]
    }
  ],
  "editorial": "### Optimal Approach: Backtracking (O(n * n!))\n\nMaintain `current` list and `used` boolean array.\nIn recursive step `backtrack()`:\n- If `current.length === nums.length`, push copy of `current` to `result`.\n- Loop through `i = 0..nums.length-1`:\n  - If `!used[i]`: mark `used[i] = true`, push `nums[i]`, recurse, unmark, pop.\n\nTime Complexity: O(n * n!)\nSpace Complexity: O(n) call stack",
  "badgeName": "Permutation Architect",
  "companies": [
    "Google",
    "Amazon",
    "Microsoft"
  ]
},
{
  "id": "letter-combinations-of-a-phone-number",
  "slug": "letter-combinations-of-a-phone-number",
  "title": "Letter Combinations of a Phone Number: T9 Keyboard",
  "difficulty": "Medium",
  "category": "Arrays & Hashing",
  "acceptance": "60.4%",
  "description": "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.\n\nA mapping of digits to letters (just like on telephone buttons):\n- 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz'.",
  "realWorldContext": "Used in T9 predictive keyboard typing, vanity phone number generators (e.g. 1-800-FLOWERS), and mnemonic encoding systems.",
  "examples": [
    {
      "input": "digits = '23'",
      "output": "['ad','ae','af','bd','be','bf','cd','ce','cf']",
      "explanation": "9 combinations for digits 2 and 3."
    },
    {
      "input": "digits = ''",
      "output": "[]",
      "explanation": "Empty input returns empty array."
    }
  ],
  "constraints": [
    "0 <= digits.length <= 4",
    "digits[i] is a digit in the range ['2', '9']."
  ],
  "hints": [
    "Use depth-first search or breadth-first search.",
    "Base case: if current combination length equals digits.length, add to result.",
    "For each character mapped to digits[index], recurse with index + 1."
  ],
  "starterCodeJs": "/**\n * @param {string} digits\n * @return {string[]}\n */\nfunction letterCombinations(digits) {\n  // Write your solution here\n  \n}",
  "starterCodeTs": "function letterCombinations(digits: string): string[] {\n  // Write your solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def letterCombinations(self, digits: str) -> list[str]:\n        # Write your solution here\n        pass",
  "starterCodeCpp": "#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<string> letterCombinations(string digits) {\n        // Write your solution here\n        return {};\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public List<String> letterCombinations(String digits) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "testCases": [
    {
      "name": "Standard Digits",
      "inputArgs": [
        "23"
      ],
      "expected": [
        "ad",
        "ae",
        "af",
        "bd",
        "be",
        "bf",
        "cd",
        "ce",
        "cf"
      ]
    },
    {
      "name": "Empty Input",
      "inputArgs": [
        ""
      ],
      "expected": []
    },
    {
      "name": "Single Digit",
      "inputArgs": [
        "2"
      ],
      "expected": [
        "a",
        "b",
        "c"
      ]
    }
  ],
  "editorial": "### Optimal Approach: DFS Backtracking (O(4^N * N))\n\nDefine mapping `const map = { '2': 'abc', '3': 'def', ... }`.\nIf `digits` is empty, return `[]`.\nRecursive function `dfs(idx, currentStr)`:\n- If `idx === digits.length`: push `currentStr`.\n- Loop through chars of `map[digits[idx]]`: recurse with `dfs(idx + 1, currentStr + char)`.\n\nTime Complexity: O(4^N * N)\nSpace Complexity: O(N) call stack",
  "badgeName": "T9 Combinatorics Expert",
  "companies": [
    "Amazon",
    "Microsoft",
    "Uber"
  ]
},
{
  "id": "min-cost-climbing-stairs",
  "slug": "min-cost-climbing-stairs",
  "title": "Min Cost Climbing Stairs: Dual Step Optimization",
  "difficulty": "Easy",
  "category": "Dynamic Programming",
  "acceptance": "65.8%",
  "description": "You are given an integer array `cost` where `cost[i]` is the cost of `i`th step on a staircase. Once you pay the cost, you can either climb one or two steps.\n\nYou can either start from the step with index `0`, or the step with index `1`.\n\nReturn the minimum cost to reach the top of the floor (past index `n - 1`).",
  "realWorldContext": "Underpins energy minimization routes in robotic leg kinematics and network hop battery consumption budgeting.",
  "examples": [
    {
      "input": "cost = [10,15,20]",
      "output": "15",
      "explanation": "Start at index 1, pay 15 and climb two steps to reach the top."
    },
    {
      "input": "cost = [1,100,1,1,1,100,1,1,100,1]",
      "output": "6",
      "explanation": "Climb steps 0, 2, 3, 4, 6, 7, 9 to reach top with minimal cost."
    }
  ],
  "constraints": [
    "2 <= cost.length <= 1000",
    "0 <= cost[i] <= 999"
  ],
  "hints": [
    "Notice that minCost(i) = cost[i] + min(minCost(i+1), minCost(i+2)).",
    "Can be solved bottom-up in O(1) space by tracking only the last two step costs.",
    "Work backwards from the top of the stairs."
  ],
  "starterCodeJs": "/**\n * @param {number[]} cost\n * @return {number}\n */\nfunction minCostClimbingStairs(cost) {\n  // Write your O(n) DP solution here\n  \n}",
  "starterCodeTs": "function minCostClimbingStairs(cost: number[]): number {\n  // Write your O(n) DP solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def minCostClimbingStairs(self, cost: list[int]) -> int:\n        # Write your DP solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minCostClimbingStairs(vector<int>& cost) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public int minCostClimbingStairs(int[] cost) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Three Steps",
      "inputArgs": [
        [
          10,
          15,
          20
        ]
      ],
      "expected": 15
    },
    {
      "name": "Alternating Pitfalls",
      "inputArgs": [
        [
          1,
          100,
          1,
          1,
          1,
          100,
          1,
          1,
          100,
          1
        ]
      ],
      "expected": 6
    },
    {
      "name": "Two Steps Minimal",
      "inputArgs": [
        [
          0,
          0
        ]
      ],
      "expected": 0
    }
  ],
  "editorial": "### Optimal Approach: Bottom-up DP (O(n) Time, O(1) Space)\n\nInitialize `downOne = cost[1]`, `downTwo = cost[0]`.\nFor `i` from 2 to `n - 1`:\n- `curr = cost[i] + min(downOne, downTwo)`\n- `downTwo = downOne; downOne = curr`.\nReturn `min(downOne, downTwo)`.\n\nTime Complexity: O(n)\nSpace Complexity: O(1)",
  "badgeName": "Step Cost Minimizer",
  "companies": [
    "Amazon",
    "Microsoft"
  ]
},
{
  "id": "find-peak-element",
  "slug": "find-peak-element",
  "title": "Find Peak Element: Logarithmic Slope Search",
  "difficulty": "Medium",
  "category": "Binary Search",
  "acceptance": "45.8%",
  "description": "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array `nums`, find a peak element, and return its index. If the array contains multiple peaks, return the index to **any of the peaks**.\n\nYou may imagine that `nums[-1] = nums[n] = -inf`.\n\nYou must write an algorithm that runs in `O(log n)` time.",
  "realWorldContext": "Used in digital audio signal peak detection, seismic activity epicenter localization, and gradient ascent local optima finders.",
  "examples": [
    {
      "input": "nums = [1,2,3,1]",
      "output": "2",
      "explanation": "3 is a peak element and your function should return the index number 2."
    },
    {
      "input": "nums = [1,2,1,3,5,6,4]",
      "output": "5",
      "explanation": "Index 5 (value 6) or index 1 (value 2) are valid peak elements."
    }
  ],
  "constraints": [
    "1 <= nums.length <= 1000",
    "-2^31 <= nums[i] <= 2^31 - 1",
    "nums[i] != nums[i + 1] for all valid i."
  ],
  "hints": [
    "Consider mid and mid + 1.",
    "If nums[mid] < nums[mid + 1], you are on an ascending slope, so a peak MUST exist to the right.",
    "If nums[mid] > nums[mid + 1], you are on a descending slope, so a peak must exist at mid or to the left."
  ],
  "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findPeakElement(nums) {\n  // Write your O(log n) Binary Search here\n  \n}",
  "starterCodeTs": "function findPeakElement(nums: number[]): number {\n  // Write your O(log n) Binary Search here\n  \n}",
  "starterCodePy": "class Solution:\n    def findPeakElement(self, nums: list[int]) -> int:\n        # Write your O(log n) solution here\n        pass",
  "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findPeakElement(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public int findPeakElement(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Single Mountain",
      "inputArgs": [
        [
          1,
          2,
          3,
          1
        ]
      ],
      "expected": 2
    },
    {
      "name": "Multiple Mountain Peaks",
      "inputArgs": [
        [
          1,
          2,
          1,
          3,
          5,
          6,
          4
        ]
      ],
      "expected": 5
    },
    {
      "name": "Monotonic Increasing",
      "inputArgs": [
        [
          1,
          2,
          3
        ]
      ],
      "expected": 2
    },
    {
      "name": "Single Element",
      "inputArgs": [
        [
          1
        ]
      ],
      "expected": 0,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Binary Search on Slope (O(log n))\n\nRun binary search with `left = 0, right = nums.length - 1`:\n- While `left < right`:\n  - `mid = Math.floor((left + right) / 2)`\n  - If `nums[mid] < nums[mid + 1]`: move right (`left = mid + 1`)\n  - Else: move left (`right = mid`)\nReturn `left`.\n\nTime Complexity: O(log n)\nSpace Complexity: O(1)",
  "badgeName": "Logarithmic Crest Finder",
  "companies": [
    "Google",
    "Meta",
    "Amazon"
  ]
},
{
  "id": "capacity-to-ship-packages",
  "slug": "capacity-to-ship-packages",
  "title": "Capacity To Ship Packages Within D Days: Binary Search Answer",
  "difficulty": "Medium",
  "category": "Binary Search",
  "acceptance": "69.5%",
  "description": "A conveyor belt has packages that must be shipped from one port to another within `days` days.\n\nThe `i`th package on the conveyor belt has a weight of `weights[i]`. Each day, we load the ship with packages on the conveyor belt (in the order given by `weights`). We may not load more weight than the maximum weight capacity of the ship.\n\nReturn the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within `days` days.",
  "realWorldContext": "Directly powers logistics batch truck dispatching at Amazon and Delhivery to minimize fleet fuel capacity overhead.",
  "examples": [
    {
      "input": "weights = [1,2,3,4,5,6,7,8,9,10], days = 5",
      "output": "15",
      "explanation": "A ship capacity of 15 is the minimum to ship all packages in 5 days."
    },
    {
      "input": "weights = [3,2,2,4,1,4], days = 3",
      "output": "6",
      "explanation": "A ship capacity of 6 is the minimum."
    }
  ],
  "constraints": [
    "1 <= days <= weights.length <= 5 * 10^4",
    "1 <= weights[i] <= 500"
  ],
  "hints": [
    "What is the minimum possible capacity? max(weights).",
    "What is the maximum possible capacity? sum(weights).",
    "Binary search between min and max. For candidate capacity C, greedily count days needed in O(n)."
  ],
  "starterCodeJs": "/**\n * @param {number[]} weights\n * @param {number} days\n * @return {number}\n */\nfunction shipWithinDays(weights, days) {\n  // Write your O(n log(sum)) Binary Search here\n  \n}",
  "starterCodeTs": "function shipWithinDays(weights: number[], days: number): number {\n  // Write your O(n log(sum)) Binary Search here\n  \n}",
  "starterCodePy": "class Solution:\n    def shipWithinDays(self, weights: list[int], days: int) -> int:\n        # Write your binary search solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int shipWithinDays(vector<int>& weights, int days) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int shipWithinDays(int[] weights, int days) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Ten Packages Five Days",
      "inputArgs": [
        [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10
        ],
        5
      ],
      "expected": 15
    },
    {
      "name": "Uneven Weights Three Days",
      "inputArgs": [
        [
          3,
          2,
          2,
          4,
          1,
          4
        ],
        3
      ],
      "expected": 6
    },
    {
      "name": "Single Day Shipment",
      "inputArgs": [
        [
          1,
          2,
          3,
          1,
          1
        ],
        1
      ],
      "expected": 8
    }
  ],
  "editorial": "### Optimal Approach: Binary Search on Monotonic Answer (O(N log(Sum)))\n\nThe feasibility function `canShip(cap)` checks if packages can be grouped into <= `days` sub-arrays where each sub-array sum <= `cap`.\n- `left = max(weights)` (capacity must accommodate heaviest single package).\n- `right = sum(weights)` (capacity can ship all packages in 1 day).\n- Binary search for minimal `cap` where `canShip(cap)` is true.\n\nTime Complexity: O(N * log(sum - max))\nSpace Complexity: O(1)",
  "badgeName": "Logistics Capacity Optimizer",
  "companies": [
    "Google",
    "Amazon",
    "Swiggy"
  ]
},
{
  "id": "maximum-product-subarray",
  "slug": "maximum-product-subarray",
  "title": "Maximum Product Subarray: Dual Running Extremes",
  "difficulty": "Medium",
  "category": "Dynamic Programming",
  "acceptance": "35.1%",
  "description": "Given an integer array `nums`, find a subarray that has the largest product, and return the product.\n\nThe test cases are generated so that the answer will fit in a 32-bit integer.",
  "realWorldContext": "Used in economic compounding yield modeling and signal amplifier cumulative gain chain optimizers.",
  "examples": [
    {
      "input": "nums = [2,3,-2,4]",
      "output": "6",
      "explanation": "[2,3] has the largest product 6."
    },
    {
      "input": "nums = [-2,0,-1]",
      "output": "0",
      "explanation": "The result cannot be 2, because [-2,-1] is not a contiguous subarray."
    }
  ],
  "constraints": [
    "1 <= nums.length <= 2 * 10^4",
    "-10 <= nums[i] <= 10"
  ],
  "hints": [
    "Notice that multiplying two negative numbers creates a positive product.",
    "Therefore, a very small negative running product can suddenly become the largest positive product if multiplied by a negative number.",
    "Maintain BOTH maxProduct and minProduct ending at current position."
  ],
  "starterCodeJs": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxProduct(nums) {\n  // Write your O(n) DP solution here\n  \n}",
  "starterCodeTs": "function maxProduct(nums: number[]): number {\n  // Write your O(n) DP solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def maxProduct(self, nums: list[int]) -> int:\n        # Write your DP solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProduct(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public int maxProduct(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Array with Negative Split",
      "inputArgs": [
        [
          2,
          3,
          -2,
          4
        ]
      ],
      "expected": 6
    },
    {
      "name": "Zero Partitioned",
      "inputArgs": [
        [
          -2,
          0,
          -1
        ]
      ],
      "expected": 0
    },
    {
      "name": "Double Negative Flip",
      "inputArgs": [
        [
          -2,
          3,
          -4
        ]
      ],
      "expected": 24
    },
    {
      "name": "Single Negative Element",
      "inputArgs": [
        [
          -2
        ]
      ],
      "expected": -2,
      "isHidden": true
    }
  ],
  "editorial": "### Optimal Approach: Dual Kadane's Tracking (O(n) Time, O(1) Space)\n\nMaintain `maxSoFar`, `minSoFar`, and global `result` initialized to `nums[0]`.\nFor each `x` from index 1 to `n - 1`:\n- If `x < 0`, swap `maxSoFar` and `minSoFar`.\n- `maxSoFar = max(x, maxSoFar * x)`\n- `minSoFar = min(x, minSoFar * x)`\n- `result = max(result, maxSoFar)`\n\nTime Complexity: O(n)\nSpace Complexity: O(1)",
  "badgeName": "Dual Kadane Master",
  "companies": [
    "Amazon",
    "Google",
    "Microsoft"
  ]
},
{
  "id": "gas-station",
  "slug": "gas-station",
  "title": "Gas Station: Circular Circuit Greedy Balance",
  "difficulty": "Medium",
  "category": "Dynamic Programming",
  "acceptance": "45.7%",
  "description": "There are `n` gas stations along a circular route, where the amount of gas at the `i`th station is `gas[i]`.\n\nYou have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `i`th station to its next `(i + 1)`th station. You begin the journey with an empty tank at one of the gas stations.\n\nGiven two integer arrays `gas` and `cost`, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return `-1`. If there exists a solution, it is guaranteed to be unique.",
  "realWorldContext": "Used in electric vehicle fleet charging waypoint routing, spacecraft orbital propellant burn planning, and circular token transfer networks.",
  "examples": [
    {
      "input": "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
      "output": "3",
      "explanation": "Start at station 3 (index 3). Fill with 4 unit of gas. Tank = 4. Cost to next = 1. Tank = 3. Successfully complete circle."
    },
    {
      "input": "gas = [2,3,4], cost = [3,4,3]",
      "output": "-1",
      "explanation": "Total gas = 9, total cost = 10. Impossible to travel around the circuit."
    }
  ],
  "constraints": [
    "n == gas.length == cost.length",
    "1 <= n <= 10^5",
    "0 <= gas[i], cost[i] <= 10^4"
  ],
  "hints": [
    "If sum(gas) < sum(cost), it is mathematically impossible to complete the circuit, return -1.",
    "If you start at station A and run out of gas before station B, NO station between A and B can reach B either!",
    "Reset start station to B + 1 and reset current tank to 0."
  ],
  "starterCodeJs": "/**\n * @param {number[]} gas\n * @param {number[]} cost\n * @return {number}\n */\nfunction canCompleteCircuit(gas, cost) {\n  // Write your O(n) Greedy solution here\n  \n}",
  "starterCodeTs": "function canCompleteCircuit(gas: number[], cost: number[]): number {\n  // Write your O(n) Greedy solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:\n        # Write your greedy solution here\n        pass",
  "starterCodeCpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n        // Write your solution here\n        return -1;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        // Write your solution here\n        return -1;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Circuit",
      "inputArgs": [
        [
          1,
          2,
          3,
          4,
          5
        ],
        [
          3,
          4,
          5,
          1,
          2
        ]
      ],
      "expected": 3
    },
    {
      "name": "Deficit Fuel Net",
      "inputArgs": [
        [
          2,
          3,
          4
        ],
        [
          3,
          4,
          3
        ]
      ],
      "expected": -1
    },
    {
      "name": "Single Station Sufficient",
      "inputArgs": [
        [
          5
        ],
        [
          4
        ]
      ],
      "expected": 0
    }
  ],
  "editorial": "### Optimal Approach: One-Pass Greedy (O(n) Time, O(1) Space)\n\nTrack `totalTank` and `currTank`.\nLoop `i` from 0 to `n - 1`:\n- `gain = gas[i] - cost[i]`\n- `totalTank += gain`\n- `currTank += gain`\n- If `currTank < 0`:\n  - Cannot reach `i + 1` from `start`.\n  - `start = i + 1; currTank = 0`.\nIf `totalTank < 0`, return `-1`; otherwise return `start`.\n\nTime Complexity: O(n)\nSpace Complexity: O(1)",
  "badgeName": "Circuit Fuel Navigator",
  "companies": [
    "Amazon",
    "Google"
  ]
},
{
  "id": "partition-labels",
  "slug": "partition-labels",
  "title": "Partition Labels: Greedy Last Occurrence Chunks",
  "difficulty": "Medium",
  "category": "Two Pointers",
  "acceptance": "80.1%",
  "description": "You are given a string `s`. We want to partition the string into as many parts as possible so that each letter appears in at most one part.\n\nNote that the partition is done so that after concatenating all the parts in order, the resultant string should be `s`.\n\nReturn a list of integers representing the size of these parts.",
  "realWorldContext": "Used in microservice distributed transaction boundary chunking and video stream keyframe chunk segmentation.",
  "examples": [
    {
      "input": "s = 'ababcbacadefegdehijhklij'",
      "output": "[9,7,8]",
      "explanation": "Partitions: 'ababcbaca' (9), 'defegde' (7), 'hijhklij' (8)."
    },
    {
      "input": "s = 'eccbbbbdec'",
      "output": "[10]",
      "explanation": "Entire string forms one partition."
    }
  ],
  "constraints": [
    "1 <= s.length <= 500",
    "s consists of lowercase English letters."
  ],
  "hints": [
    "Record the LAST occurrence index of each character in s.",
    "Iterate through s, updating the current partition's end boundary to max(end, last[char]).",
    "When the loop index reaches end, a chunk is complete. Record its length."
  ],
  "starterCodeJs": "/**\n * @param {string} s\n * @return {number[]}\n */\nfunction partitionLabels(s) {\n  // Write your O(n) Greedy solution here\n  \n}",
  "starterCodeTs": "function partitionLabels(s: string): number[] {\n  // Write your O(n) Greedy solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def partitionLabels(self, s: str) -> list[int]:\n        # Write your greedy solution here\n        pass",
  "starterCodeCpp": "#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> partitionLabels(string s) {\n        // Write your solution here\n        return {};\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public List<Integer> partitionLabels(String s) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "testCases": [
    {
      "name": "Three Disjoint Partitions",
      "inputArgs": [
        "ababcbacadefegdehijhklij"
      ],
      "expected": [
        9,
        7,
        8
      ]
    },
    {
      "name": "Single Consolidated Partition",
      "inputArgs": [
        "eccbbbbdec"
      ],
      "expected": [
        10
      ]
    },
    {
      "name": "All Unique Letters",
      "inputArgs": [
        "abc"
      ],
      "expected": [
        1,
        1,
        1
      ]
    }
  ],
  "editorial": "### Optimal Approach: Greedy Interval Extension (O(n) Time, O(1) Space)\n\n1. Scan `s` and record `lastIndex[c]` for each character.\n2. Iterate `i` from 0 to `s.length - 1`:\n   - `end = max(end, lastIndex[s[i]])`\n   - If `i === end`: partition found! Push `end - start + 1` to results, and set `start = i + 1`.\n\nTime Complexity: O(n)\nSpace Complexity: O(1) (26 characters)",
  "badgeName": "Disjoint Chunk Master",
  "companies": [
    "Amazon",
    "Google"
  ]
},
{
  "id": "koko-eating-bananas",
  "slug": "koko-eating-bananas",
  "title": "Koko Eating Bananas: Monotonic Speed Binary Search",
  "difficulty": "Medium",
  "category": "Binary Search",
  "acceptance": "50.1%",
  "description": "Koko loves to eat bananas. There are `n` piles of bananas, the `i`th pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.\n\nKoko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour.\n\nReturn the minimum integer `k` such that she can eat all the bananas within `h` hours.",
  "realWorldContext": "Used in network streaming buffer throughput tuning and batch consumer rate-limiting throttlers.",
  "examples": [
    {
      "input": "piles = [3,6,7,11], h = 8",
      "output": "4",
      "explanation": "With speed 4, Koko finishes in 1 + 2 + 2 + 3 = 8 hours."
    },
    {
      "input": "piles = [30,11,23,4,20], h = 5",
      "output": "30",
      "explanation": "With speed 30, Koko finishes each pile in 1 hour (total 5 hours)."
    }
  ],
  "constraints": [
    "1 <= piles.length <= 10^4",
    "piles.length <= h <= 10^9",
    "1 <= piles[i] <= 10^9"
  ],
  "hints": [
    "The eating speed k lies between 1 and max(piles).",
    "For a given speed k, the total hours needed is sum(ceil(pile / k)).",
    "Binary search for the smallest k such that total hours <= h."
  ],
  "starterCodeJs": "/**\n * @param {number[]} piles\n * @param {number} h\n * @return {number}\n */\nfunction minEatingSpeed(piles, h) {\n  // Write your O(n log(max)) Binary Search here\n  \n}",
  "starterCodeTs": "function minEatingSpeed(piles: number[], h: number): number {\n  // Write your O(n log(max)) Binary Search here\n  \n}",
  "starterCodePy": "import math\n\nclass Solution:\n    def minEatingSpeed(self, piles: list[int], h: int) -> int:\n        # Write your binary search solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minEatingSpeed(vector<int>& piles, int h) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public int minEatingSpeed(int[] piles, int h) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Piles",
      "inputArgs": [
        [
          3,
          6,
          7,
          11
        ],
        8
      ],
      "expected": 4
    },
    {
      "name": "Exact Hour Match",
      "inputArgs": [
        [
          30,
          11,
          23,
          4,
          20
        ],
        5
      ],
      "expected": 30
    },
    {
      "name": "Generous Time Window",
      "inputArgs": [
        [
          30,
          11,
          23,
          4,
          20
        ],
        6
      ],
      "expected": 23
    }
  ],
  "editorial": "### Optimal Approach: Binary Search on Monotonic Answer (O(n log(max)))\n\nRange: `left = 1, right = max(piles)`.\nFor candidate speed `k`:\n`hours = sum(Math.ceil(p / k))`\n- If `hours <= h`: speed is valid, try smaller (`right = k`)\n- Else: speed is too slow (`left = k + 1`)\nReturn `left`.\n\nTime Complexity: O(n log(max(piles)))\nSpace Complexity: O(1)",
  "badgeName": "Monotonic Rate Tuner",
  "companies": [
    "Google",
    "Amazon",
    "Uber"
  ]
},
{
  "id": "palindromic-substrings",
  "slug": "palindromic-substrings",
  "title": "Palindromic Substrings: Center Expansion Counter",
  "difficulty": "Medium",
  "category": "Two Pointers",
  "acceptance": "68.9%",
  "description": "Given a string `s`, return the number of palindromic substrings in it.\n\nA string is a palindrome when it reads the same backward as forward. A substring is a contiguous sequence of characters within the string.",
  "realWorldContext": "Used in bioinformatic palindrome hairpin loop RNA folding analysis and data compression algorithms.",
  "examples": [
    {
      "input": "s = 'abc'",
      "output": "3",
      "explanation": "Three palindromic substrings: 'a', 'b', 'c'."
    },
    {
      "input": "s = 'aaa'",
      "output": "6",
      "explanation": "Six palindromic substrings: 'a', 'a', 'a', 'aa', 'aa', 'aaa'."
    }
  ],
  "constraints": [
    "1 <= s.length <= 1000",
    "s consists of lowercase English letters."
  ],
  "hints": [
    "Every palindrome has a center: either a single character (odd length) or two characters (even length).",
    "There are 2n - 1 potential centers in a string of length n.",
    "Expand outwards from each center while characters match."
  ],
  "starterCodeJs": "/**\n * @param {string} s\n * @return {number}\n */\nfunction countSubstrings(s) {\n  // Write your O(n^2) Center Expansion solution here\n  \n}",
  "starterCodeTs": "function countSubstrings(s: string): number {\n  // Write your O(n^2) Center Expansion solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def countSubstrings(self, s: str) -> int:\n        # Write your solution here\n        pass",
  "starterCodeCpp": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int countSubstrings(string s) {\n        // Write your solution here\n        return 0;\n    }\n};",
  "starterCodeJava": "class Solution {\n    public int countSubstrings(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
  "testCases": [
    {
      "name": "All Unique Letters",
      "inputArgs": [
        "abc"
      ],
      "expected": 3
    },
    {
      "name": "Identical Letters",
      "inputArgs": [
        "aaa"
      ],
      "expected": 6
    },
    {
      "name": "Single Character",
      "inputArgs": [
        "a"
      ],
      "expected": 1
    }
  ],
  "editorial": "### Optimal Approach: Expand Around Centers (O(n^2) Time, O(1) Space)\n\nFor each index `i` from 0 to `s.length - 1`:\n- Count palindromes with odd center `expand(i, i)`\n- Count palindromes with even center `expand(i, i + 1)`\nAccumulate counts.\n\nTime Complexity: O(n^2)\nSpace Complexity: O(1)",
  "badgeName": "Symmetry Center Explorer",
  "companies": [
    "Google",
    "Microsoft",
    "Meta"
  ]
},
{
  "id": "find-all-anagrams-in-a-string",
  "slug": "find-all-anagrams-in-a-string",
  "title": "Find All Anagrams in a String: Fixed Frequency Window",
  "difficulty": "Medium",
  "category": "Sliding Window",
  "acceptance": "50.8%",
  "description": "Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`. You may return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
  "realWorldContext": "Used in cryptographic frequency analysis attacks, gene sequence motif matching, and plagiarism phrase detectors.",
  "examples": [
    {
      "input": "s = 'cbaebabacd', p = 'abc'",
      "output": "[0,6]",
      "explanation": "The substring with start index = 0 is 'cba', which is an anagram of 'abc'.\nThe substring with start index = 6 is 'bac', which is an anagram of 'abc'."
    },
    {
      "input": "s = 'abab', p = 'ab'",
      "output": "[0,1,2]",
      "explanation": "The substrings with start index = 0, 1, and 2 are 'ab', 'ba', and 'ab', which are all anagrams of 'ab'."
    }
  ],
  "constraints": [
    "1 <= s.length, p.length <= 3 * 10^4",
    "s and p consist of lowercase English letters."
  ],
  "hints": [
    "Use a fixed-size sliding window of length p.length.",
    "Maintain a 26-element character frequency array for p and the current window in s.",
    "Compare the two frequency arrays in O(1) time at each step."
  ],
  "starterCodeJs": "/**\n * @param {string} s\n * @param {string} p\n * @return {number[]}\n */\nfunction findAnagrams(s, p) {\n  // Write your O(n) Fixed Sliding Window solution here\n  \n}",
  "starterCodeTs": "function findAnagrams(s: string, p: string): number[] {\n  // Write your O(n) Fixed Sliding Window solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def findAnagrams(self, s: str, p: str) -> list[int]:\n        # Write your solution here\n        pass",
  "starterCodeCpp": "#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> findAnagrams(string s, string p) {\n        // Write your solution here\n        return {};\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public List<Integer> findAnagrams(String s, String p) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}",
  "testCases": [
    {
      "name": "Standard Target Window",
      "inputArgs": [
        "cbaebabacd",
        "abc"
      ],
      "expected": [
        0,
        6
      ]
    },
    {
      "name": "Overlapping Anagrams",
      "inputArgs": [
        "abab",
        "ab"
      ],
      "expected": [
        0,
        1,
        2
      ]
    },
    {
      "name": "Target Longer Than String",
      "inputArgs": [
        "a",
        "ab"
      ],
      "expected": []
    }
  ],
  "editorial": "### Optimal Approach: Sliding Window with Frequency Vector (O(N))\n\n1. If `s.length < p.length`, return `[]`.\n2. Count frequency of `p` and initial `p.length` slice of `s` in two length-26 arrays.\n3. Slide window across `s`:\n   - Check if frequency arrays match. If yes, add `i - p.length` to results.\n   - Slide: increment `s[i]`, decrement `s[i - p.length]`.\n\nTime Complexity: O(N * 26) = O(N)\nSpace Complexity: O(1) (size 26 arrays)",
  "badgeName": "Anagram Window Tracker",
  "companies": [
    "Amazon",
    "Google",
    "Microsoft"
  ]
},
{
  "id": "longest-palindromic-substring",
  "slug": "longest-palindromic-substring",
  "title": "Longest Palindromic Substring: Dynamic Symmetry Expansion",
  "difficulty": "Medium",
  "category": "Two Pointers",
  "acceptance": "33.9%",
  "description": "Given a string `s`, return the longest palindromic substring in `s`.",
  "realWorldContext": "Used in genomic palindrome sequence identification, DNA restriction enzyme recognition sites, and reversible pattern compression.",
  "examples": [
    {
      "input": "s = 'babad'",
      "output": "'bab'",
      "explanation": "'aba' is also a valid answer."
    },
    {
      "input": "s = 'cbbd'",
      "output": "'bb'",
      "explanation": "'bb' is the longest palindromic substring."
    }
  ],
  "constraints": [
    "1 <= s.length <= 1000",
    "s consist of only digits and English letters."
  ],
  "hints": [
    "Expand around 2n - 1 centers (both single character and between characters).",
    "Track the start and end indices of the maximum length palindrome seen.",
    "Can also be solved with Manacher's algorithm in O(n) or Dynamic Programming in O(n^2)."
  ],
  "starterCodeJs": "/**\n * @param {string} s\n * @return {string}\n */\nfunction longestPalindrome(s) {\n  // Write your O(n^2) solution here\n  \n}",
  "starterCodeTs": "function longestPalindrome(s: string): string {\n  // Write your O(n^2) solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        # Write your solution here\n        pass",
  "starterCodeCpp": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string longestPalindrome(string s) {\n        // Write your solution here\n        return \"\";\n    }\n};",
  "starterCodeJava": "class Solution {\n    public String longestPalindrome(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
  "testCases": [
    {
      "name": "Odd Palindrome",
      "inputArgs": [
        "babad"
      ],
      "expected": "bab"
    },
    {
      "name": "Even Palindrome",
      "inputArgs": [
        "cbbd"
      ],
      "expected": "bb"
    },
    {
      "name": "Single Character",
      "inputArgs": [
        "a"
      ],
      "expected": "a"
    }
  ],
  "editorial": "### Optimal Approach: Expand Around Center (O(n^2) Time, O(1) Space)\n\nAt each center `i` from 0 to `n - 1`:\n- Expand for odd palindrome `(i, i)`\n- Expand for even palindrome `(i, i + 1)`\nUpdate `start` and `maxLen` whenever a longer palindrome is found.\nReturn `s.substring(start, start + maxLen)`.\n\nTime Complexity: O(n^2)\nSpace Complexity: O(1)",
  "badgeName": "Palindromic Symmetry Sovereign",
  "companies": [
    "Amazon",
    "Microsoft",
    "Google"
  ]
},
{
  "id": "valid-sudoku",
  "slug": "valid-sudoku",
  "title": "Valid Sudoku: 9x9 Bitmask / Hash Validation",
  "difficulty": "Medium",
  "category": "Arrays & Hashing",
  "acceptance": "59.2%",
  "description": "Determine if a `9 x 9` Sudoku board is valid. Only the filled cells need to be validated according to the following rules:\n1. Each row must contain the digits `1-9` without repetition.\n2. Each column must contain the digits `1-9` without repetition.\n3. Each of the nine `3 x 3` sub-boxes of the grid must contain the digits `1-9` without repetition.\n\nNote: A Sudoku board (partially filled) could be valid but is not necessarily solvable. Only the filled cells need to be validated.",
  "realWorldContext": "Used in constraint satisfaction solvers (SMT solvers, Z3), puzzle verification engines, and bitmask matrix validations.",
  "examples": [
    {
      "input": "board = [['5','3','.','.','7','.','.','.','.'],['6','.','.','1','9','5','.','.','.'],['.','9','8','.','.','.','.','6','.'],['8','.','.','.','6','.','.','.','3'],['4','.','.','8','.','3','.','.','1'],['7','.','.','.','2','.','.','.','6'],['.','6','.','.','.','.','2','8','.'],['.','.','.','4','1','9','.','.','5'],['.','.','.','.','8','.','.','7','9']]",
      "output": "true",
      "explanation": "The board complies with all 3 Sudoku validation rules."
    }
  ],
  "constraints": [
    "board.length == 9",
    "board[i].length == 9",
    "board[i][j] is a digit '1'-'9' or '.'."
  ],
  "hints": [
    "Use hash sets or bitmasks for each row (9 rows), column (9 columns), and 3x3 block (9 blocks).",
    "The box index for cell (r, c) can be calculated as Math.floor(r / 3) * 3 + Math.floor(c / 3).",
    "If a number has already been seen in the corresponding row, column, or box, return false."
  ],
  "starterCodeJs": "/**\n * @param {string[][]} board\n * @return {boolean}\n */\nfunction isValidSudoku(board) {\n  // Write your O(1) / O(81) solution here\n  \n}",
  "starterCodeTs": "function isValidSudoku(board: string[][]): boolean {\n  // Write your O(1) / O(81) solution here\n  \n}",
  "starterCodePy": "class Solution:\n    def isValidSudoku(self, board: list[list[str]]) -> bool:\n        # Write your solution here\n        pass",
  "starterCodeCpp": "#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValidSudoku(vector<vector<char>>& board) {\n        // Write your solution here\n        return true;\n    }\n};",
  "starterCodeJava": "import java.util.*;\n\nclass Solution {\n    public boolean isValidSudoku(char[][] board) {\n        // Write your solution here\n        return true;\n    }\n}",
  "testCases": [
    {
      "name": "Standard Valid Board",
      "inputArgs": [
        [
          [
            "5",
            "3",
            ".",
            ".",
            "7",
            ".",
            ".",
            ".",
            "."
          ],
          [
            "6",
            ".",
            ".",
            "1",
            "9",
            "5",
            ".",
            ".",
            "."
          ],
          [
            ".",
            "9",
            "8",
            ".",
            ".",
            ".",
            ".",
            "6",
            "."
          ],
          [
            "8",
            ".",
            ".",
            ".",
            "6",
            ".",
            ".",
            ".",
            "3"
          ],
          [
            "4",
            ".",
            ".",
            "8",
            ".",
            "3",
            ".",
            ".",
            "1"
          ],
          [
            "7",
            ".",
            ".",
            ".",
            "2",
            ".",
            ".",
            ".",
            "6"
          ],
          [
            ".",
            "6",
            ".",
            ".",
            ".",
            ".",
            "2",
            "8",
            "."
          ],
          [
            ".",
            ".",
            ".",
            "4",
            "1",
            "9",
            ".",
            ".",
            "5"
          ],
          [
            ".",
            ".",
            ".",
            ".",
            "8",
            ".",
            ".",
            "7",
            "9"
          ]
        ]
      ],
      "expected": true
    },
    {
      "name": "Invalid Duplicate in Box",
      "inputArgs": [
        [
          [
            "8",
            "3",
            ".",
            ".",
            "7",
            ".",
            ".",
            ".",
            "."
          ],
          [
            "6",
            ".",
            ".",
            "1",
            "9",
            "5",
            ".",
            ".",
            "."
          ],
          [
            ".",
            "9",
            "8",
            ".",
            ".",
            ".",
            ".",
            "6",
            "."
          ],
          [
            "8",
            ".",
            ".",
            ".",
            "6",
            ".",
            ".",
            ".",
            "3"
          ],
          [
            "4",
            ".",
            ".",
            "8",
            ".",
            "3",
            ".",
            ".",
            "1"
          ],
          [
            "7",
            ".",
            ".",
            ".",
            "2",
            ".",
            ".",
            ".",
            "6"
          ],
          [
            ".",
            "6",
            ".",
            ".",
            ".",
            ".",
            "2",
            "8",
            "."
          ],
          [
            ".",
            ".",
            ".",
            "4",
            "1",
            "9",
            ".",
            ".",
            "5"
          ],
          [
            ".",
            ".",
            ".",
            ".",
            "8",
            ".",
            ".",
            "7",
            "9"
          ]
        ]
      ],
      "expected": false
    }
  ],
  "editorial": "### Optimal Approach: Bitmask / HashSet (O(1) Constant Time 81 cells)\n\nMaintain 9 row sets, 9 column sets, and 9 box sets.\nLoop `r` from 0 to 8 and `c` from 0 to 8:\n- If `val !== '.'`:\n  - `boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3)`\n  - If `val` in `rows[r]` or `cols[c]` or `boxes[boxIdx]`, return `false`.\n  - Add `val` to all three sets.\nReturn `true`.\n\nTime Complexity: O(1) (exact 81 cells)\nSpace Complexity: O(1)",
  "badgeName": "Sudoku Constraint Verifier",
  "companies": [
    "Amazon",
    "Microsoft",
    "Uber"
  ]
}
];
