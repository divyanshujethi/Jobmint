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
  starterCodeTs?: string;
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
    "starterCodeJs": "function twoSum(nums, target) {\n  // Write your O(n) solution here\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) {\n      return [map.get(diff), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
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
        ]
      },
      {
        "name": "Hidden Large Test",
        "inputArgs": [
          [
            1000,
            2000,
            3000,
            4000,
            5000
          ],
          7000
        ],
        "expected": [
          1,
          4
        ],
        "isHidden": true
      }
    ],
    "editorial": "### Optimal Approach: One-Pass Hash Map\nBy maintaining a lookup table mapping each visited number to its index, we can check for the complement (target - current) in O(1) average time per element.\n\n- **Time Complexity**: O(n)\n- **Space Complexity**: O(n)",
    "badgeName": "Hash Map Pioneer"
  },
  {
    "id": "valid-parentheses",
    "slug": "valid-parentheses",
    "title": "Valid Parentheses: Syntax Tree Validator",
    "difficulty": "Easy",
    "category": "Stack",
    "acceptance": "44.6%",
    "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    "realWorldContext": "The foundational grammar parser used inside TypeScript and Babel compiler lexers to validate JSON payloads and AST tree balance.",
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
      },
      {
        "input": "s = \"([)]\"",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    "hints": [
      "Think about Last-In First-Out (LIFO). Which data structure handles this?",
      "Push opening brackets onto a stack. When a closing bracket arrives, verify it matches the top of the stack."
    ],
    "starterCodeJs": "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  \n  for (const char of s) {\n    if (char === '(' || char === '{' || char === '[') {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
    "testCases": [
      {
        "name": "Simple Pair",
        "inputArgs": [
          "()"
        ],
        "expected": true
      },
      {
        "name": "Multiple Sets",
        "inputArgs": [
          "()[]{}"
        ],
        "expected": true
      },
      {
        "name": "Mismatched Brackets",
        "inputArgs": [
          "(]"
        ],
        "expected": false
      },
      {
        "name": "Nested Valid",
        "inputArgs": [
          "{[]}"
        ],
        "expected": true
      },
      {
        "name": "Unbalanced Open",
        "inputArgs": [
          "((("
        ],
        "expected": false
      },
      {
        "name": "Interleaved Invalid",
        "inputArgs": [
          "([)]"
        ],
        "expected": false,
        "isHidden": true
      }
    ],
    "editorial": "### Optimal Approach: Stack Verification\n- Push opening brackets onto the stack.\n- Pop and match corresponding closing brackets.\n- If stack is empty at the end, the string is valid.\n\n- **Time**: O(n)\n- **Space**: O(n)",
    "badgeName": "Stack Architect"
  },
  {
    "id": "best-time-to-buy-and-sell-stock",
    "slug": "best-time-to-buy-and-sell-stock",
    "title": "Best Time to Buy and Sell Stock",
    "difficulty": "Easy",
    "category": "Sliding Window",
    "acceptance": "54.1%",
    "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    "realWorldContext": "Algorithmic trading engines track minimum historical cost baselines to identify high-probability breakout sell triggers.",
    "examples": [
      {
        "input": "prices = [7, 1, 5, 3, 6, 4]",
        "output": "5",
        "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5."
      },
      {
        "input": "prices = [7, 6, 4, 3, 1]",
        "output": "0",
        "explanation": "In this case, no transactions are done and max profit = 0."
      }
    ],
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "hints": [
      "Keep track of the minimum price seen so far as you iterate through the list.",
      "Calculate the potential profit if sold on the current day, and update maximum profit."
    ],
    "starterCodeJs": "function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  \n  for (const price of prices) {\n    if (price < minPrice) {\n      minPrice = price;\n    } else if (price - minPrice > maxProfit) {\n      maxProfit = price - minPrice;\n    }\n  }\n  return maxProfit;\n}",
    "testCases": [
      {
        "name": "Standard Profit",
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
        "name": "Two Days",
        "inputArgs": [
          [
            1,
            2
          ]
        ],
        "expected": 1
      },
      {
        "name": "High Volatility",
        "inputArgs": [
          [
            2,
            4,
            1
          ]
        ],
        "expected": 2
      },
      {
        "name": "Hidden Long Horizon",
        "inputArgs": [
          [
            3,
            2,
            6,
            5,
            0,
            3
          ]
        ],
        "expected": 4,
        "isHidden": true
      }
    ],
    "editorial": "### Optimal Approach: One-Pass Dynamic Min Tracker\nTrack the minimum price seen so far and compare each day's price against it.\n\n- **Time**: O(n)\n- **Space**: O(1)",
    "badgeName": "Market Arbitrageur"
  },
  {
    "id": "max-subarray",
    "slug": "max-subarray",
    "title": "Maximum Subarray: Kadane's Algorithm",
    "difficulty": "Medium",
    "category": "Dynamic Programming",
    "acceptance": "51.1%",
    "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "realWorldContext": "Kadane's Algorithm is widely deployed in quantitative trading and genomic sequence analysis to identify maximum contiguous return periods.",
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
      "Can you keep track of the current subarray sum and reset whenever it drops below 0?",
      "This is known as Kadane's Algorithm."
    ],
    "starterCodeJs": "function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let curr = 0;\n  for (const n of nums) {\n    curr = Math.max(n, curr + n);\n    maxSum = Math.max(maxSum, curr);\n  }\n  return maxSum;\n}",
    "testCases": [
      {
        "name": "Standard Mixed",
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
            -5,
            -3,
            -1,
            -4
          ]
        ],
        "expected": -1
      }
    ],
    "editorial": "### Optimal Approach: Kadane's Algorithm\nAt each index, decide whether to append to the existing sum or start fresh with the current number.\n\n- **Time**: O(n)\n- **Space**: O(1)",
    "badgeName": "Kadane Master"
  },
  {
    "id": "contains-duplicate",
    "slug": "contains-duplicate",
    "title": "Contains Duplicate: Set Collision Detector",
    "difficulty": "Easy",
    "category": "Arrays & Hashing",
    "acceptance": "61.8%",
    "description": "Given an integer array `nums`, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    "realWorldContext": "Used in database write pipelines to enforce uniqueness constraints before inserting rows.",
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
      "Can a Set data structure help detect duplicate elements in O(n) time?",
      "If the size of a Set constructed from the array is less than the array length, duplicates exist."
    ],
    "starterCodeJs": "function containsDuplicate(nums) {\n  return new Set(nums).size < nums.length;\n}",
    "testCases": [
      {
        "name": "Has Duplicate",
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
        "name": "All Unique",
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
        "name": "Multiple Duplicates",
        "inputArgs": [
          [
            1,
            1,
            1,
            3,
            3,
            4
          ]
        ],
        "expected": true
      },
      {
        "name": "Single Element",
        "inputArgs": [
          [
            99
          ]
        ],
        "expected": false
      }
    ],
    "editorial": "### Optimal Approach: Hash Set\nCompare new Set(nums).size with nums.length.\n\n- **Time**: O(n)\n- **Space**: O(n)",
    "badgeName": "Set Theory Specialist"
  },
  {
    "id": "valid-anagram",
    "slug": "valid-anagram",
    "title": "Valid Anagram: Frequency Counter",
    "difficulty": "Easy",
    "category": "Arrays & Hashing",
    "acceptance": "64.1%",
    "description": "Given two strings `s` and `t`, return true if `t` is an anagram of `s`, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "realWorldContext": "Used in search query auto-correct engines and cryptographic permutation verification.",
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
      "Count character frequencies with an array of size 26 or a hash map."
    ],
    "starterCodeJs": "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}",
    "testCases": [
      {
        "name": "Valid Anagram",
        "inputArgs": [
          "anagram",
          "nagaram"
        ],
        "expected": true
      },
      {
        "name": "Different Words",
        "inputArgs": [
          "rat",
          "car"
        ],
        "expected": false
      },
      {
        "name": "Length Mismatch",
        "inputArgs": [
          "a",
          "ab"
        ],
        "expected": false
      },
      {
        "name": "Single Character Match",
        "inputArgs": [
          "z",
          "z"
        ],
        "expected": true
      }
    ],
    "editorial": "### Optimal Approach: Character Frequency Table\nUse a frequency hash map or fixed-size 26-element array.\n\n- **Time**: O(n)\n- **Space**: O(1) since English alphabet is 26 characters",
    "badgeName": "Lexical Analyzer"
  },
  {
    "id": "merge-intervals",
    "slug": "merge-intervals",
    "title": "Merge Intervals: Calendar Optimizer",
    "difficulty": "Medium",
    "category": "Intervals",
    "acceptance": "47.2%",
    "description": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "realWorldContext": "Google Calendar and Zoom use interval merging to determine real meeting conflicts and suggest free meeting windows.",
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
      "Sort the intervals by their start time first.",
      "Iterate through sorted intervals: if current interval overlaps with the previous merged one, extend previous end time."
    ],
    "starterCodeJs": "function merge(intervals) {\n  if (intervals.length <= 1) return intervals;\n  intervals.sort((a, b) => a[0] - b[0]);\n  \n  const merged = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const prev = merged[merged.length - 1];\n    const curr = intervals[i];\n    \n    if (curr[0] <= prev[1]) {\n      prev[1] = Math.max(prev[1], curr[1]);\n    } else {\n      merged.push(curr);\n    }\n  }\n  return merged;\n}",
    "testCases": [
      {
        "name": "Overlapping Set",
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
        "name": "Adjacent Touch",
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
        "name": "Fully Enclosed",
        "inputArgs": [
          [
            [
              1,
              10
            ],
            [
              2,
              5
            ]
          ]
        ],
        "expected": [
          [
            1,
            10
          ]
        ]
      },
      {
        "name": "Single Interval",
        "inputArgs": [
          [
            [
              1,
              4
            ]
          ]
        ],
        "expected": [
          [
            1,
            4
          ]
        ]
      }
    ],
    "editorial": "### Optimal Approach: Sort & Linear Merge\nSorting by start time ensures intervals that can merge are strictly adjacent.\n\n- **Time**: O(n log n)\n- **Space**: O(n)",
    "badgeName": "Chronos Optimizer"
  },
  {
    "id": "binary-search",
    "slug": "binary-search",
    "title": "Binary Search: O(log n) Halving Engine",
    "difficulty": "Easy",
    "category": "Binary Search",
    "acceptance": "57.8%",
    "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`.\n\nIf `target` exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    "realWorldContext": "B-Tree database indexes in PostgreSQL and MySQL rely on binary search on each disk block to retrieve rows in sub-millisecond time.",
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
      "Maintain low and high pointers.",
      "Calculate mid as Math.floor((low + high) / 2) to prevent potential integer overflow."
    ],
    "starterCodeJs": "function search(nums, target) {\n  let left = 0;\n  let right = nums.length - 1;\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  return -1;\n}",
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
        "name": "Target Missing",
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
        "name": "Single Element Found",
        "inputArgs": [
          [
            5
          ],
          5
        ],
        "expected": 0
      },
      {
        "name": "Single Element Missing",
        "inputArgs": [
          [
            5
          ],
          -5
        ],
        "expected": -1
      }
    ],
    "editorial": "### Optimal Approach: Classical Binary Search\nRepeatedly halve the search window based on comparing target to mid.\n\n- **Time**: O(log n)\n- **Space**: O(1)",
    "badgeName": "Logarithmic Navigator"
  }
];
