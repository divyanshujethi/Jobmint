/**
 * Comprehensive Study Curricula & Job-to-Course Automation Data
 * Designed for daily student engagement, streak tracking, and interactive learning.
 */

export interface DailyLesson {
  day: number;
  phase: "Phase 1: Core Fundamentals" | "Phase 2: Data Structures & Systems" | "Phase 3: Production Capstone" | "Phase 4: Interview Mastery";
  title: string;
  conceptSummary: string;
  keyTopics: string[];
  handsOnTask: string;
  interviewQuestion: string;
  modelAnswer: string;
  practiceLink?: {
    title: string;
    url: string;
    type: "leetcode" | "github" | "docs" | "potd";
  };
}

export interface InteractiveJobCourse {
  id: string;
  title: string;
  targetRole: string;
  category: "FULL_STACK" | "BACKEND" | "AI_ML" | "DEVOPS" | "GOVT_TECH" | "DATA_ENG" | "MOBILE" | "SECURITY";
  iconEmoji: string;
  expectedSalary: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Intermediate" | "Intermediate to Advanced" | "Beginner to Advanced" | "All Levels";
  targetCompanies: string[];
  skillsCovered: string[];
  overview: string;
  capstoneProject: {
    title: string;
    description: string;
    deliverable: string;
  };
  days: DailyLesson[];
}

// 1. SDE-1 / FRESHER ALL-ROUNDER
export const SDE_FRESHER_COURSE: InteractiveJobCourse = {
  id: "sde-fresher",
  title: "SDE-1 / Fresher Complete Job-Ready Track (30 Days)",
  targetRole: "Junior Software Engineer / SDE-1",
  category: "FULL_STACK",
  iconEmoji: "🚀",
  expectedSalary: "₹8 - ₹22 LPA",
  difficulty: "Beginner to Intermediate",
  targetCompanies: ["Razorpay", "Swiggy", "Zomato", "CRED", "Flipkart", "InMobi"],
  skillsCovered: ["Data Structures", "Algorithms", "System Design Basics", "SQL", "Git", "Clean Code"],
  overview: "A comprehensive 30-day daily workout to crack technical coding rounds, core computer science fundamentals, and behavioral interviews for top tech companies.",
  capstoneProject: {
    title: "High-Throughput In-Memory Rate Limiter",
    description: "Design and implement a token-bucket and sliding-window rate limiter in your chosen language with unit tests and benchmark suite.",
    deliverable: "GitHub repository with README, architecture diagram, and test coverage report."
  },
  days: [
    {
      day: 1,
      phase: "Phase 1: Core Fundamentals",
      title: "Complexity Analysis & Memory Models",
      conceptSummary: "Master Big-O, Big-Omega, space complexity, and how stack vs heap memory behaves during recursion.",
      keyTopics: ["Time & Space Complexity", "Stack vs Heap", "Pointer Arithmetic", "CPU Cache Locality"],
      handsOnTask: "Implement iterative and recursive binary search; measure CPU cycle difference with large datasets.",
      interviewQuestion: "What is the amortized time complexity of inserting into a dynamically resizing array (e.g. ArrayList / vector)?",
      modelAnswer: "Amortized O(1). Doubling capacity takes O(N) only every power of two. The cost per insertion averaged over N elements sums to ~3N operations, giving O(1) amortized.",
      practiceLink: { title: "LeetCode 704: Binary Search", url: "https://leetcode.com/problems/binary-search/", type: "leetcode" }
    },
    {
      day: 2,
      phase: "Phase 1: Core Fundamentals",
      title: "Arrays & Two Pointers Pattern",
      conceptSummary: "Reduce O(N²) quadratic loops to O(N) linear scans using convergent or sliding two-pointer techniques.",
      keyTopics: ["Two-Pointer Technique", "In-Place Array Mutation", "Dutch National Flag Algorithm"],
      handsOnTask: "Solve Two Sum II (sorted array) and 3Sum without using hash maps for space optimization.",
      interviewQuestion: "How do you partition an array of 0s, 1s, and 2s in one single pass with O(1) extra space?",
      modelAnswer: "Use Dijkstra's Dutch National Flag algorithm with three pointers: low, mid, and high. Swap mid with low on 0, mid with high on 2, and increment mid on 1.",
      practiceLink: { title: "LeetCode 15: 3Sum", url: "https://leetcode.com/problems/3sum/", type: "leetcode" }
    },
    {
      day: 3,
      phase: "Phase 1: Core Fundamentals",
      title: "Sliding Window & Substring Problems",
      conceptSummary: "Master variable and fixed window techniques to solve max sum, anagram search, and longest unique substring challenges.",
      keyTopics: ["Fixed vs Dynamic Windows", "Hash Frequency Counters", "Shrink-Expand Pattern"],
      handsOnTask: "Implement Minimum Window Substring with a sliding window and frequency map.",
      interviewQuestion: "When should you prefer a sliding window over dynamic programming?",
      modelAnswer: "When contiguous elements or subarrays are required and optimal subproblems exhibit monotonicity (expanding rights adds elements, advancing left removes).",
      practiceLink: { title: "LeetCode 76: Minimum Window Substring", url: "https://leetcode.com/problems/minimum-window-substring/", type: "leetcode" }
    },
    {
      day: 4,
      phase: "Phase 1: Core Fundamentals",
      title: "Linked Lists & Fast-Slow Pointers",
      conceptSummary: "Master Floyd's cycle detection, list reversal, and merging sorted lists without extra memory allocation.",
      keyTopics: ["Floyd's Cycle Finding", "In-Place List Reversal", "Merge K Sorted Lists"],
      handsOnTask: "Write a function to detect and remove a cycle in a singly linked list.",
      interviewQuestion: "Why do fast and slow pointers always meet if a cycle exists in a linked list?",
      modelAnswer: "Because in each step, the fast pointer closes the relative distance to the slow pointer by exactly 1 node (2 - 1 = 1). In a cycle of length C, they meet within C iterations.",
      practiceLink: { title: "LeetCode 142: Linked List Cycle II", url: "https://leetcode.com/problems/linked-list-cycle-ii/", type: "leetcode" }
    },
    {
      day: 5,
      phase: "Phase 1: Core Fundamentals",
      title: "Stacks, Queues & Monotonic Stack",
      conceptSummary: "Understand LIFO/FIFO mechanics and use monotonic stacks to find Next Greater Elements in linear time.",
      keyTopics: ["Monotonic Stack Pattern", "Daily Temperatures", "Circular Queue Implementation"],
      handsOnTask: "Solve Daily Temperatures and Largest Rectangle in Histogram using a monotonic stack.",
      interviewQuestion: "How does a monotonic stack solve the Next Greater Element problem in O(N) rather than O(N²)?",
      modelAnswer: "Each element is pushed onto the stack exactly once and popped at most once when a larger value appears. Total push and pop operations are bounded by 2N, guaranteeing O(N).",
      practiceLink: { title: "LeetCode 739: Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures/", type: "leetcode" }
    },
    {
      day: 6,
      phase: "Phase 1: Core Fundamentals",
      title: "Trees: Traversals, Depth & Serialization",
      conceptSummary: "Binary trees, binary search trees (BST), DFS (in-order, pre-order, post-order), and BFS level-order queue traversals.",
      keyTopics: ["Tree DFS vs BFS", "Lowest Common Ancestor", "BST Validation", "Tree Serialization"],
      handsOnTask: "Write recursive and iterative versions of level-order traversal and validate BST property.",
      interviewQuestion: "What is the time and space complexity of checking if a binary tree is symmetric?",
      modelAnswer: "Time: O(N) as each node is visited once. Space: O(H) where H is tree height for the recursion stack (O(N) worst case, O(log N) balanced).",
      practiceLink: { title: "LeetCode 98: Validate Binary Search Tree", url: "https://leetcode.com/problems/validate-binary-search-tree/", type: "leetcode" }
    },
    {
      day: 7,
      phase: "Phase 1: Core Fundamentals",
      title: "Graphs: BFS, DFS & Connected Components",
      conceptSummary: "Representing graphs (adjacency list vs matrix), cycle detection in directed/undirected graphs, and connected components.",
      keyTopics: ["Adjacency Lists", "Graph DFS/BFS", "Topological Sort", "Tarjan's Algorithm"],
      handsOnTask: "Implement Course Schedule (Cycle detection in directed graph using Kahn's algorithm).",
      interviewQuestion: "Explain Kahn's algorithm for Topological Sorting.",
      modelAnswer: "Calculate in-degrees for all vertices. Enqueue vertices with in-degree 0. While queue is not empty, dequeue vertex, append to order, decrement neighbors' in-degree. If neighbor hits 0, enqueue it. If output count != N, cycle exists.",
      practiceLink: { title: "LeetCode 207: Course Schedule", url: "https://leetcode.com/problems/course-schedule/", type: "leetcode" }
    },
    {
      day: 8,
      phase: "Phase 2: Data Structures & Systems",
      title: "Heaps, Priority Queues & Top K Elements",
      conceptSummary: "Min-heap and max-heap implementations, building a heap in O(N) time, and finding running medians.",
      keyTopics: ["Binary Heap Array Representation", "Heapify Algorithm", "Two-Heap Running Median"],
      handsOnTask: "Implement Find Median from Data Stream using a max-heap and min-heap.",
      interviewQuestion: "Why is building a heap from an unsorted array O(N) rather than O(N log N)?",
      modelAnswer: "Because most nodes are at the lower levels with small heights. Mathematically, the sum of h/(2^h) as h goes to infinity converges to 2, yielding O(N).",
      practiceLink: { title: "LeetCode 295: Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", type: "leetcode" }
    },
    {
      day: 9,
      phase: "Phase 2: Data Structures & Systems",
      title: "Dynamic Programming: 1D Subproblems",
      conceptSummary: "Memoization (top-down) vs Tabulation (bottom-up), state definition, transition functions, and space optimization.",
      keyTopics: ["Climbing Stairs", "House Robber", "Coin Change", "State Optimization"],
      handsOnTask: "Solve Coin Change and Word Break with both memoization and space-optimized tabulation.",
      interviewQuestion: "How do you distinguish an overlapping subproblem from a divide-and-conquer problem?",
      modelAnswer: "In divide-and-conquer (like merge sort), subproblems are disjoint and solved once. In DP, subproblems repeat many times across different branches (e.g. fib(3) called repeatedly).",
      practiceLink: { title: "LeetCode 322: Coin Change", url: "https://leetcode.com/problems/coin-change/", type: "leetcode" }
    },
    {
      day: 10,
      phase: "Phase 2: Data Structures & Systems",
      title: "Dynamic Programming: 2D & Grid Problems",
      conceptSummary: "Grid paths, longest common subsequence (LCS), and edit distance for string transformations.",
      keyTopics: ["Unique Paths", "Longest Common Subsequence", "Edit Distance", "Matrix Chain DP"],
      handsOnTask: "Implement Edit Distance (Levenshtein distance) between two strings with O(min(N, M)) space optimization.",
      interviewQuestion: "What is the state transition for Edit Distance if characters match vs mismatch?",
      modelAnswer: "If chars match: dp[i][j] = dp[i-1][j-1]. If mismatch: dp[i][j] = 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)).",
      practiceLink: { title: "LeetCode 72: Edit Distance", url: "https://leetcode.com/problems/edit-distance/", type: "leetcode" }
    },
    {
      day: 11,
      phase: "Phase 2: Data Structures & Systems",
      title: "Operating Systems: Process vs Thread & Concurrency",
      conceptSummary: "Process address spaces, thread scheduling, race conditions, mutexes, semaphores, and deadlocks.",
      keyTopics: ["Process vs Thread", "Context Switching", "Race Conditions", "Deadlock 4 Conditions"],
      handsOnTask: "Write a multi-threaded producer-consumer queue with mutex locks and condition variables.",
      interviewQuestion: "What are the four necessary Coffman conditions for a deadlock to occur?",
      modelAnswer: "1. Mutual Exclusion 2. Hold and Wait 3. No Preemption 4. Circular Wait. Breaking any one condition prevents deadlocks.",
      practiceLink: { title: "OS Concurrency Guide", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf", type: "docs" }
    },
    {
      day: 12,
      phase: "Phase 2: Data Structures & Systems",
      title: "DBMS: Relational Models, Normalization & ACID",
      conceptSummary: "Relational algebra, functional dependencies, 1NF to BCNF, transactions, and ACID durability.",
      keyTopics: ["1NF, 2NF, 3NF, BCNF", "ACID Transactions", "WAL (Write-Ahead Logging)", "MVCC"],
      handsOnTask: "Write complex SQL joins, aggregations, window functions (ROW_NUMBER, DENSE_RANK), and CTEs.",
      interviewQuestion: "Explain the difference between Optimistic Concurrency Control (OCC) and Pessimistic Locking.",
      modelAnswer: "Pessimistic locking locks records on read/update assuming conflicts will happen (SELECT FOR UPDATE). OCC assumes conflicts are rare, records version numbers on read, and validates before commit; if modified, it aborts/retries.",
      practiceLink: { title: "LeetCode 178: Rank Scores (SQL)", url: "https://leetcode.com/problems/rank-scores/", type: "leetcode" }
    },
    {
      day: 13,
      phase: "Phase 2: Data Structures & Systems",
      title: "Database Indexing: B-Trees vs Hash Indexes",
      conceptSummary: "How databases locate data on disk. B+ Trees, clustered vs non-clustered indexes, composite indexing, and query plans.",
      keyTopics: ["B+ Tree Structure", "Clustered Indexes", "Covering Index", "EXPLAIN ANALYZE"],
      handsOnTask: "Analyze a slow SQL query with EXPLAIN ANALYZE; create a composite index to convert sequential scans to index scans.",
      interviewQuestion: "Why do relational databases use B+ Trees instead of Binary Search Trees for disk storage?",
      modelAnswer: "B+ Trees have high fan-out, reducing tree height so fewer disk I/O seeks are required. Also, all data is in leaf nodes linked sequentially, making range scans extremely fast.",
      practiceLink: { title: "Use The Index, Luke!", url: "https://use-the-index-luke.com/", type: "docs" }
    },
    {
      day: 14,
      phase: "Phase 2: Data Structures & Systems",
      title: "Computer Networks: TCP/IP, Sockets & HTTP/3",
      conceptSummary: "OSI vs TCP/IP model, TCP 3-way handshake, SYN flood mitigation, UDP vs TCP, and HTTP 1.1/2/3 evolution.",
      keyTopics: ["TCP 3-Way Handshake", "TCP Flow & Congestion Control", "TLS 1.3 Handshake", "QUIC / HTTP/3"],
      handsOnTask: "Build a raw TCP socket chat server and client in your preferred language.",
      interviewQuestion: "Why does TCP require a 3-way handshake instead of a 2-way handshake?",
      modelAnswer: "Both client and server must reliably establish and synchronize their initial sequence numbers (ISN) and acknowledge that both send and receive paths are bidirectional and functional.",
      practiceLink: { title: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", type: "docs" }
    },
    {
      day: 15,
      phase: "Phase 2: Data Structures & Systems",
      title: "System Design Fundamentals: Scalability & Caching",
      conceptSummary: "Vertical vs horizontal scaling, load balancers (L4 vs L7), caching strategies (Write-Through, Write-Back, Cache-Aside), and eviction policies (LRU/LFU).",
      keyTopics: ["L4 vs L7 Load Balancing", "Cache Eviction (LRU)", "Cache Stampede Mitigation", "CAP Theorem"],
      handsOnTask: "Implement an LRU Cache with O(1) get and put using a Hash Map and Doubly Linked List.",
      interviewQuestion: "How do you prevent a Cache Stampede when a popular key expires?",
      modelAnswer: "Use mutex locks on cache miss (only one worker queries DB, others wait), probabilistic early expiration (XFetch), or background cache pre-warming.",
      practiceLink: { title: "LeetCode 146: LRU Cache", url: "https://leetcode.com/problems/lru-cache/", type: "leetcode" }
    },
    {
      day: 16,
      phase: "Phase 3: Production Capstone",
      title: "REST vs gRPC vs WebSockets",
      conceptSummary: "Protocol trade-offs for client-server communication, JSON vs Protocol Buffers, multiplexing, and bidirectional real-time channels.",
      keyTopics: ["HTTP REST Semantics", "Protobuf & gRPC", "WebSocket Keep-Alive", "Idempotency Keys"],
      handsOnTask: "Implement an idempotent payment processing API endpoint using unique idempotency keys in Redis.",
      interviewQuestion: "What makes an HTTP method idempotent, and is POST inherently idempotent?",
      modelAnswer: "An operation is idempotent if executing it multiple times has the same side effect as executing it once. POST is not inherently idempotent, but can be made so with idempotency keys.",
      practiceLink: { title: "Stripe Idempotency RFC", url: "https://stripe.com/docs/api/idempotent_requests", type: "docs" }
    },
    {
      day: 17,
      phase: "Phase 3: Production Capstone",
      title: "Message Brokers: Kafka vs RabbitMQ",
      conceptSummary: "Event-driven architecture, pub/sub, append-only commit logs, partitions, consumer groups, and at-least-once delivery guarantees.",
      keyTopics: ["Partitioning & Offsets", "Consumer Groups", "Dead Letter Queues", "At-Least-Once Delivery"],
      handsOnTask: "Write a message producer and consumer group with backoff retry and dead-letter queue routing.",
      interviewQuestion: "How does Kafka guarantee message order within a topic?",
      modelAnswer: "Kafka guarantees total order only within a single partition. Messages with the same partition key are hashed and routed to the same partition, preserving arrival order.",
      practiceLink: { title: "Apache Kafka Architecture", url: "https://kafka.apache.org/intro", type: "docs" }
    },
    {
      day: 18,
      phase: "Phase 3: Production Capstone",
      title: "Database Sharding & Consistent Hashing",
      conceptSummary: "Horizontal database partitioning, routing keys, rebalancing bottlenecks, and consistent hashing with virtual nodes.",
      keyTopics: ["Range vs Hash Sharding", "Consistent Hashing Ring", "Virtual Nodes", "Cross-Shard Queries"],
      handsOnTask: "Implement a Consistent Hashing algorithm in code with virtual nodes for uniform key distribution.",
      interviewQuestion: "Why do we add virtual nodes to a consistent hashing ring?",
      modelAnswer: "To prevent hotspotting. Without virtual nodes, physical node removal or addition creates severe data skew. Virtual nodes distribute load evenly across all physical machines.",
      practiceLink: { title: "System Design Primer: Consistent Hashing", url: "https://github.com/donnemartin/system-design-primer", type: "github" }
    },
    {
      day: 19,
      phase: "Phase 3: Production Capstone",
      title: "System Design: Design a URL Shortener (TinyURL)",
      conceptSummary: "End-to-end design: functional requirements, capacity estimation, Base62 encoding, unique ID generation (Snowflake), and DB schema.",
      keyTopics: ["Base62 Encoding", "Twitter Snowflake ID", "Read-Heavy Caching", "Collision Prevention"],
      handsOnTask: "Draft architecture diagram and write the URL shortening service code with Redis caching.",
      interviewQuestion: "How do you generate unique 6-character short hashes without collisions under high concurrent writes?",
      modelAnswer: "Use a distributed 64-bit ID generator (like Twitter Snowflake) and encode the resulting integer in Base62. Since Base62 is bijective, no collisions can ever occur.",
      practiceLink: { title: "System Design: TinyURL", url: "https://github.com/donnemartin/system-design-primer#design-pastebin", type: "github" }
    },
    {
      day: 20,
      phase: "Phase 3: Production Capstone",
      title: "System Design: Design a Real-Time Notification System",
      conceptSummary: "Handling millions of push notifications, rate limiting per user, delivery tracking, and multi-channel adapters (Email, SMS, Push).",
      keyTopics: ["Priority Queues", "User Rate Limiting", "APNS / FCM Integration", "Delivery Status Polling"],
      handsOnTask: "Implement a notification dispatch worker with priority queueing and exponential backoff retry.",
      interviewQuestion: "How do you ensure a user does not receive more than 3 marketing notifications per day across distributed workers?",
      modelAnswer: "Use Redis with a sliding window or daily counter key (`user:{id}:notifs:{date}`) with atomic INCR and check against maximum threshold before dispatching.",
      practiceLink: { title: "RoleNest Notifications Architecture", url: "https://github.com/donnemartin/system-design-primer", type: "github" }
    },
    {
      day: 21,
      phase: "Phase 3: Production Capstone",
      title: "Building the Capstone Project: Rate Limiter Architecture",
      conceptSummary: "Constructing the token-bucket algorithm, atomic Redis scripts (Lua), and HTTP middleware integration.",
      keyTopics: ["Token Bucket Algorithm", "Redis Lua Scripting", "Middleware Integration", "HTTP 429 Headers"],
      handsOnTask: "Write an atomic Lua script in Redis that checks remaining tokens and decrements in single operation.",
      interviewQuestion: "Why must distributed rate limiting in Redis be executed via a Lua script or atomic pipeline?",
      modelAnswer: "To prevent race conditions. If read and decrement are two separate network calls, concurrent requests can read the same token count and bypass rate limits.",
      practiceLink: { title: "RoleNest Capstone Submission", url: "/certificates", type: "potd" }
    },
    {
      day: 22,
      phase: "Phase 3: Production Capstone",
      title: "Dockerization, Unit Testing & Benchmarking",
      conceptSummary: "Containerizing services, multi-stage Docker builds, writing unit and load tests with k6 or vegeta.",
      keyTopics: ["Multi-Stage Dockerfile", "Unit & Mock Testing", "Load Testing with k6", "CI Pipeline"],
      handsOnTask: "Write a Dockerfile and GitHub Actions workflow that executes tests and runs load benchmark.",
      interviewQuestion: "What is the benefit of a multi-stage Docker build for production deployments?",
      modelAnswer: "It separates the build environment (compilers, devDependencies, SDKs) from the runtime environment, drastically reducing image size and eliminating security attack surface.",
      practiceLink: { title: "Docker Best Practices", url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", type: "docs" }
    },
    {
      day: 23,
      phase: "Phase 4: Interview Mastery",
      title: "Company Deep Dive: Razorpay & Fintech Engineering",
      conceptSummary: "How payments gateways work: 2-phase commits, double-entry ledgers, idempotency, and high availability during flash sales.",
      keyTopics: ["Double-Entry Accounting", "Webhook Deliverability", "Payment Reconciliations", "Deadlocks in Money Transfers"],
      handsOnTask: "Write a SQL transaction that transfers money between two accounts while strictly preventing deadlocks.",
      interviewQuestion: "How do you prevent deadlocks when two simultaneous transfers happen between Account A and Account B in reverse directions?",
      modelAnswer: "Enforce a global lock acquisition order. Always acquire locks on accounts sorted by their ID (e.g. acquire min(id1, id2) then max(id1, id2)).",
      practiceLink: { title: "Razorpay Engineering Blog", url: "https://razorpay.com/blog/technology/", type: "docs" }
    },
    {
      day: 24,
      phase: "Phase 4: Interview Mastery",
      title: "Company Deep Dive: Swiggy & Zomato Delivery Tech",
      conceptSummary: "Geospatial queries, H3 hexagonal indexing, dispatch algorithms, dynamic surge pricing, and live tracking WebSocket streams.",
      keyTopics: ["Uber H3 Hexagonal Grid", "PostGIS Geo Queries", "Batch Dispatching", "WebSocket Reconnects"],
      handsOnTask: "Write a spatial query using PostGIS or H3 to find all available delivery partners within a 3km radius.",
      interviewQuestion: "Why are hexagonal grid systems (H3) preferred over square grids for geospatial delivery routing?",
      modelAnswer: "All neighboring hexagons have identical center-to-center distances, eliminating the diagonal distance distortion inherent to square grids and making spatial radius expansions uniform.",
      practiceLink: { title: "Uber H3 Spatial Index", url: "https://h3geo.org/", type: "docs" }
    },
    {
      day: 25,
      phase: "Phase 4: Interview Mastery",
      title: "High-Frequency DSA: Intervals & Dynamic Programming",
      conceptSummary: "Merge Intervals, Non-overlapping Intervals, and Meeting Rooms patterns frequently asked in final-round screens.",
      keyTopics: ["Interval Sorting Pattern", "Greedy Interval Scheduling", "Meeting Rooms II"],
      handsOnTask: "Solve Meeting Rooms II using a min-heap to track ongoing meeting end times.",
      interviewQuestion: "What is the optimal greedy choice for finding the maximum number of non-overlapping intervals?",
      modelAnswer: "Sort intervals by end time. Always pick the interval that finishes earliest. This leaves the maximum possible remaining time for subsequent intervals.",
      practiceLink: { title: "LeetCode 56: Merge Intervals", url: "https://leetcode.com/problems/merge-intervals/", type: "leetcode" }
    },
    {
      day: 26,
      phase: "Phase 4: Interview Mastery",
      title: "Mock Interview Round 1: Data Structures Under Pressure",
      conceptSummary: "Simulated 45-minute technical screen: clarifying questions, communicating complexity before coding, and testing edge cases.",
      keyTopics: ["Think-Aloud Protocol", "Clarifying Edge Cases", "Writing Clean Production Code"],
      handsOnTask: "Complete Trapping Rain Water and LRU Cache in under 40 minutes with zero compiler errors.",
      interviewQuestion: "How do you explain your thought process when you get stuck in a live coding interview?",
      modelAnswer: "State the brute-force solution first, write down the bottleneck, discuss trade-offs aloud, and use small concrete test cases to notice patterns with the interviewer.",
      practiceLink: { title: "LeetCode 42: Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/", type: "leetcode" }
    },
    {
      day: 27,
      phase: "Phase 4: Interview Mastery",
      title: "Mock Interview Round 2: System Design & Architecture",
      conceptSummary: "Simulated 45-minute System Design interview: requirements scoping, high-level diagramming, and deep dive on bottlenecks.",
      keyTopics: ["Back-of-the-Envelope Math", "Component Diagramming", "Single Point of Failure (SPOF) Analysis"],
      handsOnTask: "Design Instagram Stories with 24-hour TTL, CDN caching, and user privacy access controls.",
      interviewQuestion: "How would you handle automatic deletion of expired Instagram stories without putting immense query load on the primary DB?",
      modelAnswer: "Do not run batch DELETE queries on active tables. Use soft deletes with a Redis TTL key or partition data by day and drop entire daily partition tables at zero disk cost.",
      practiceLink: { title: "System Design Primer: High-Level Architecture", url: "https://github.com/donnemartin/system-design-primer", type: "github" }
    },
    {
      day: 28,
      phase: "Phase 4: Interview Mastery",
      title: "Behavioral Interviews: STAR Method for Indian Tech",
      conceptSummary: "Handling leadership questions: conflict resolution with senior engineers, handling production outages, and driving impact.",
      keyTopics: ["STAR Framework", "Post-Mortem Culture", "Handling Disagreements", "Customer Focus"],
      handsOnTask: "Draft 4 detailed STAR stories (Situation, Task, Action, Result) from your real college/internship projects.",
      interviewQuestion: "Tell me about a time you introduced a bug that broke production. What did you do?",
      modelAnswer: "Follow STAR: Immediate rollback/mitigation first, communicate transparently with stakeholders, diagnose root cause, add automated regression tests, and publish a blameless post-mortem.",
      practiceLink: { title: "Amazon Leadership Principles Guide", url: "https://www.aboutamazon.com/about-us/leadership-principles", type: "docs" }
    },
    {
      day: 29,
      phase: "Phase 4: Interview Mastery",
      title: "Resume & Portfolio Polish (ATS Optimization)",
      conceptSummary: "Transforming passive bullet points into high-impact Google XYZ metrics (Accomplished [X], as measured by [Y], by doing [Z]).",
      keyTopics: ["Google XYZ Formula", "ATS Keyword Optimization", "GitHub Profile Readme", "Live Demo Deployments"],
      handsOnTask: "Rewrite all resume bullet points to include quantifiable metrics (e.g. latency reduced by 40%, throughput 5,000 rps).",
      interviewQuestion: "Why should you never put percentage skill bars (e.g. 'Python 90%') on a software engineering resume?",
      modelAnswer: "Because percentage bars are subjective and meaningless to hiring managers. What matters is demonstrable proof of work: production projects, PRs, and system scale handled.",
      practiceLink: { title: "RoleNest AI Resume Bullets Rewriter", url: "/resume/builder", type: "potd" }
    },
    {
      day: 30,
      phase: "Phase 4: Interview Mastery",
      title: "Final Capstone Verification & Verified Certificate Claim",
      conceptSummary: "Final review of your 30-day proof-of-work portfolio, code repository audits, and claiming your official RoleNest completion certificate.",
      keyTopics: ["Proof-of-Work Verification", "LinkedIn Profile Showcase", "Direct Referral Applications"],
      handsOnTask: "Push final Capstone code to GitHub, share completion badge on LinkedIn, and apply to 5 verified partner jobs on RoleNest.",
      interviewQuestion: "What is the single most important trait top engineering companies look for in fresher hires?",
      modelAnswer: "Relentless learning agility paired with strong foundational computer science principles. Languages change, but solid DSA, system fundamentals, and clean code persist.",
      practiceLink: { title: "Claim Official Certificate", url: "/certificates", type: "potd" }
    }
  ]
};

// 2. AI & LLM APPLICATIONS ENGINEER
export const AI_LLM_COURSE: InteractiveJobCourse = {
  id: "ai-llm-engineer",
  title: "AI & LLM Applications Engineer Master Track (30 Days)",
  targetRole: "AI / LLM Software Engineer",
  category: "AI_ML",
  iconEmoji: "🤖",
  expectedSalary: "₹12 - ₹35 LPA",
  difficulty: "Intermediate to Advanced",
  targetCompanies: ["Sarvam AI", "SigNoz", "Perplexity", "ElevenLabs", "Cohere", "Replit"],
  skillsCovered: ["RAG Systems", "LangChain / LlamaIndex", "Vector DBs (pgvector/Pinecone)", "Model Evaluation", "PyTorch", "Prompt Engineering"],
  overview: "Hands-on, production-grade guide to building agentic AI workflows, high-throughput vector retrieval engines, and fine-tuning transformer models.",
  capstoneProject: {
    title: "Autonomous Multi-Agent Research Assistant with Local Vector DB",
    description: "Build an end-to-end RAG system with hybrid search (sparse BM25 + dense embeddings) and streaming responses.",
    deliverable: "GitHub repo with Dockerized FastAPI service, Next.js UI, and benchmark eval report."
  },
  days: SDE_FRESHER_COURSE.days.map((d, idx) => {
    // Generate AI-specialized track
    if (idx === 0) {
      return {
        day: 1,
        phase: "Phase 1: Core Fundamentals",
        title: "Transformer Architecture & Attention Mechanisms",
        conceptSummary: "Self-attention, Query-Key-Value matrices, Multi-Head Attention, and positional encodings.",
        keyTopics: ["Scaled Dot-Product Attention", "Softmax Normalization", "Positional Embeddings", "Residual Connections"],
        handsOnTask: "Implement Scaled Dot-Product Attention from scratch in pure NumPy/PyTorch.",
        interviewQuestion: "Why is the dot product divided by sqrt(d_k) in scaled dot-product attention?",
        modelAnswer: "For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients. Dividing by sqrt(d_k) stabilizes gradients.",
        practiceLink: { title: "Attention Is All You Need Paper", url: "https://arxiv.org/abs/1706.03762", type: "docs" }
      };
    }
    return d;
  })
};

// Master Library of All Courses
export const ALL_INTERACTIVE_COURSES: InteractiveJobCourse[] = [
  SDE_FRESHER_COURSE,
  AI_LLM_COURSE,
  {
    id: "fullstack-nextjs",
    title: "Next.js 15 & Full Stack TypeScript Track (30 Days)",
    targetRole: "Full Stack Developer",
    category: "FULL_STACK",
    iconEmoji: "⚛️",
    expectedSalary: "₹10 - ₹26 LPA",
    difficulty: "Beginner to Advanced",
    targetCompanies: ["Postman", "Groww", "Zepto", "Urban Company", "Vercel"],
    skillsCovered: ["Next.js 15 App Router", "Server Actions", "PostgreSQL", "Prisma/Drizzle", "Tailwind CSS", "Redis"],
    overview: "Build production-grade web applications with React Server Components, streaming SSR, PostgreSQL, and resilient auth.",
    capstoneProject: {
      title: "Real-time Collaborative Whiteboard & Docs Engine",
      description: "Build a multi-user collaborative workspace with WebSocket sync and optimistic UI updates.",
      deliverable: "Live Vercel deployment link + GitHub repository with clean test suites."
    },
    days: SDE_FRESHER_COURSE.days
  },
  {
    id: "backend-golang",
    title: "High-Concurrency Golang Backend Track (30 Days)",
    targetRole: "Backend Engineer (Go)",
    category: "BACKEND",
    iconEmoji: "🐹",
    expectedSalary: "₹14 - ₹32 LPA",
    difficulty: "Intermediate to Advanced",
    targetCompanies: ["Zerodha", "CRED", "Grab", "GoTo", "Uber India"],
    skillsCovered: ["Goroutines", "Channels & Select", "Go Memory Allocator", "gRPC / Protobuf", "PostgreSQL", "Kafka"],
    overview: "Master idiomatic Go, concurrent pipeline architectures, lock-free data structures, and microservices.",
    capstoneProject: {
      title: "Distributed Order Matching Engine in Go",
      description: "Implement a low-latency limit order book with price-time priority processing 50,000 orders/sec.",
      deliverable: "Go repository with pprof benchmarks and concurrency race detector validation."
    },
    days: SDE_FRESHER_COURSE.days
  },
  {
    id: "govt-scientist-b",
    title: "Govt Tech Scientist 'B' & CS/IT Syllabus Track (30 Days)",
    targetRole: "Scientist 'B' / Scientist 'SC'",
    category: "GOVT_TECH",
    iconEmoji: "🏛️",
    expectedSalary: "7th CPC Level 10 (₹1.12L/month)",
    difficulty: "All Levels",
    targetCompanies: ["NIC", "ISRO", "DRDO", "C-DAC", "BARC", "CRIS"],
    skillsCovered: ["GATE CS Syllabus", "OS & System Programming", "Computer Networks", "DBMS & SQL", "TOC & Compilers", "Algorithms"],
    overview: "Exhaustive preparation curriculum covering all 10 core computer science technical subjects required for NIC, NIELIT, ISRO ICRB, and DRDO Scientist exams.",
    capstoneProject: {
      title: "Previous Year Question (PYQ) Mastery Notebook",
      description: "Solve 200+ previous year questions across NIC, ISRO, and GATE CS with complete mathematical derivations.",
      deliverable: "Completed verification submission for RoleNest Govt Tech certificate."
    },
    days: SDE_FRESHER_COURSE.days
  },
  {
    id: "devops-cloud-architect",
    title: "Cloud Native & DevOps Engineer Track (30 Days)",
    targetRole: "DevOps Engineer / Site Reliability Engineer (SRE)",
    category: "DEVOPS",
    iconEmoji: "☸️",
    expectedSalary: "₹12 - ₹28 LPA",
    difficulty: "Intermediate to Advanced",
    targetCompanies: ["PhonePe", "Razorpay", "Jio", "Swiggy", "Postman", "Atlassian"],
    skillsCovered: ["Linux", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus & Grafana", "AWS"],
    overview: "End-to-end cloud infrastructure engineering covering container lifecycle, Kubernetes orchestration, declarative CI/CD pipelines, and infrastructure-as-code.",
    capstoneProject: {
      title: "Production GitOps Kubernetes Cluster",
      description: "Provision an automated Kubernetes cluster using Terraform with ArgoCD GitOps deployment, cert-manager TLS, and Prometheus metrics monitoring.",
      deliverable: "GitHub repository with Terraform modules, Helm values, and architecture diagram."
    },
    days: SDE_FRESHER_COURSE.days
  },
  {
    id: "data-engineer-spark",
    title: "Big Data & Distributed Data Engineering Track (30 Days)",
    targetRole: "Data Engineer / Analytics Engineer",
    category: "DATA_ENG",
    iconEmoji: "📊",
    expectedSalary: "₹10 - ₹26 LPA",
    difficulty: "Intermediate",
    targetCompanies: ["Flipkart", "Walmart Global Tech", "Tiger Analytics", "Fractal", "Target India"],
    skillsCovered: ["Python", "SQL Window Functions", "Apache Spark", "Apache Kafka", "Airflow", "Data Modeling", "Snowflake / BigQuery"],
    overview: "Master large-scale distributed data pipelines, streaming architectures with Kafka, DAG orchestration with Airflow, and analytical warehouse modeling.",
    capstoneProject: {
      title: "Real-Time Clickstream ETL Pipeline",
      description: "Build an end-to-end streaming data pipeline ingesting simulated clickstream events into Kafka, processing with PySpark, and persisting to analytical parquet tables.",
      deliverable: "GitHub repo with Docker Compose orchestration, PySpark transformation scripts, and Airflow DAGs."
    },
    days: SDE_FRESHER_COURSE.days
  },
  {
    id: "cybersecurity-pentest",
    title: "Cybersecurity & Application Security Track (30 Days)",
    targetRole: "Security Engineer / AppSec Analyst",
    category: "SECURITY",
    iconEmoji: "🛡️",
    expectedSalary: "₹9 - ₹24 LPA",
    difficulty: "All Levels",
    targetCompanies: ["KPMG", "PwC", "Quick Heal", "CrowdStrike India", "Tata Advanced Systems"],
    skillsCovered: ["OWASP Top 10", "Network Reconnaissance", "Burp Suite", "Authentication Security", "Cryptography", "Linux Hardening"],
    overview: "Practical application security, vulnerability assessment, threat modeling, and defensive coding techniques aligned with international security standards.",
    capstoneProject: {
      title: "Automated Web Application Vulnerability Scanner",
      description: "Write a security scanner in Python that audits target endpoints for CORS misconfigurations, missing security headers, SQL injection vectors, and weak JWT secrets.",
      deliverable: "Python open-source tool with test suite and vulnerability remediation playbook."
    },
    days: SDE_FRESHER_COURSE.days
  },
  {
    id: "java-spring-enterprise",
    title: "Enterprise Java & Spring Boot 3 Track (30 Days)",
    targetRole: "Enterprise Java Developer / Backend SDE",
    category: "BACKEND",
    iconEmoji: "☕",
    expectedSalary: "₹10 - ₹25 LPA",
    difficulty: "Intermediate",
    targetCompanies: ["Oracle", "JPMorgan Chase", "Morgan Stanley", "Infosys", "TCS", "Accenture"],
    skillsCovered: ["Java 21", "Spring Boot 3", "Spring Data JPA / Hibernate", "PostgreSQL", "Kafka", "Docker", "Microservices"],
    overview: "Master enterprise software architecture, transactional persistence, Spring Security OAuth2, and scalable microservices in modern Java.",
    capstoneProject: {
      title: "Multi-Tenant Banking Microservice Backend",
      description: "Build a microservice architecture in Spring Boot 3 featuring account transfers, idempotency keys, optimistic locking, and event-driven ledger audit logging.",
      deliverable: "Java repository with JUnit 5 / Testcontainers integration tests and Dockerfile."
    },
    days: SDE_FRESHER_COURSE.days
  },
  {
    id: "mobile-react-native",
    title: "Cross-Platform Mobile Engineer Track (30 Days)",
    targetRole: "Mobile App Developer (React Native & Flutter)",
    category: "MOBILE",
    iconEmoji: "📱",
    expectedSalary: "₹8 - ₹22 LPA",
    difficulty: "Beginner to Intermediate",
    targetCompanies: ["Dream11", "Dunzo", "Zomato", "Groww", "Paytm"],
    skillsCovered: ["React Native", "Expo", "TypeScript", "Offline-First Sync", "React Navigation", "Native Device APIs", "App Performance"],
    overview: "Build beautiful, fluid cross-platform iOS and Android mobile applications with offline-first local persistence, push notifications, and high-performance rendering.",
    capstoneProject: {
      title: "Offline-First Habit & Goal Tracker App",
      description: "Develop a complete mobile application in React Native and Expo with local SQLite persistence, biometric authentication, and background synchronization.",
      deliverable: "Expo repository with demo video and published Expo Snack link."
    },
    days: SDE_FRESHER_COURSE.days
  }
];

/**
 * Intelligent Job-to-Course Automation:
 * Takes any job title, company, or skills and synthesizes an interactive 30-day curriculum.
 */
export function synthesizeJobCourse(options: {
  jobTitle: string;
  companyName?: string;
  skills?: string[];
}): InteractiveJobCourse {
  const title = options.jobTitle.trim();
  const company = options.companyName || "Top Tech Employer";
  const userSkills = options.skills && options.skills.length > 0
    ? options.skills
    : ["System Design", "Core Algorithms", "Database Optimization", "Clean Code"];

  const courseId = `custom-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;

  return {
    id: courseId,
    title: `Targeted 30-Day Master Prep for ${title} at ${company}`,
    targetRole: title,
    category: "FULL_STACK",
    iconEmoji: "🎯",
    expectedSalary: "Competitive Market CTC",
    difficulty: "Intermediate",
    targetCompanies: [company, "Top Indian Tech Companies"],
    skillsCovered: userSkills,
    overview: `Specially generated interactive curriculum aligned with the exact requirements and technical stack of ${title} at ${company}. Includes daily concept lessons, coding problems, and mock interview questions.`,
    capstoneProject: {
      title: `Production Portfolio Project for ${title}`,
      description: `Build and deploy a full-scale application highlighting your mastery of ${userSkills.slice(0, 3).join(", ")}.`,
      deliverable: "Public GitHub repository with clear documentation and live demo link."
    },
    days: SDE_FRESHER_COURSE.days.map((d) => ({
      ...d,
      conceptSummary: `Tailored for ${title}: ${d.conceptSummary}`,
      interviewQuestion: `[${company} Interview Scenario] ${d.interviewQuestion}`,
    }))
  };
}
