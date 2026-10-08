export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// 30 Core Technical Questions covering modern software architecture & engineering
export const GENERAL_TECHNICAL_30_POOL: QuizQuestion[] = [
  {
    id: 1,
    question: "Which Git command enables rewriting local branch commit history, squashing commits, and rewording commit messages?",
    options: [
      "git clone --bare",
      "git push --force-with-lease without local commits",
      "git rebase -i HEAD~N (Interactive Rebase)",
      "git checkout -b main"
    ],
    correctIndex: 2,
    explanation: "Interactive rebase (git rebase -i) allows rearranging, squashing, editing, and rewording commits before pushing to upstream."
  },
  {
    id: 2,
    question: "What is the primary architectural purpose of a Cache-Aside pattern using Redis?",
    options: [
      "Directly overwrite the database whenever cache expires",
      "Read from cache first; if cache miss, query database, populate cache, and return data",
      "Prevent the server from logging errors",
      "Store passwords unencrypted in memory"
    ],
    correctIndex: 1,
    explanation: "Cache-Aside queries memory first, falling back to durable storage only on cache misses, dramatically reducing database load."
  },
  {
    id: 3,
    question: "Why are multi-stage Docker builds recommended in production web engineering?",
    options: [
      "They make the Docker image larger for faster caching",
      "They disable HTTPS encryption on containers",
      "They bypass Linux kernel security namespaces",
      "They separate build dependencies from runtime environments, producing minimal, secure production images"
    ],
    correctIndex: 3,
    explanation: "Multi-stage builds leave compilers, devDependencies, and build caches behind, resulting in lightweight, secure container images."
  },
  {
    id: 4,
    question: "In Clean Architecture, which direction should source code dependencies always point?",
    options: [
      "Inward, toward high-level domain business entities and policies",
      "Outward, toward UI frameworks and database drivers",
      "Circularly between all classes",
      "Directly to third-party vendor APIs"
    ],
    correctIndex: 0,
    explanation: "The Dependency Rule states that dependencies must always point inward toward high-level business rules, isolating core logic from frameworks."
  },
  {
    id: 5,
    question: "What cryptographic primitive does RoleNest use to ensure public certificate and credential immutability?",
    options: [
      "Base64 encoded plain-text files",
      "Cryptographic SHA-256 ledger hashes timestamped and publicly verifiable",
      "Client-side cookies with no signature",
      "Temporary session storage in the browser"
    ],
    correctIndex: 1,
    explanation: "SHA-256 cryptographic hashes link the recipient identity, course ID, issue date, and score to a tamper-proof public verification ledger."
  },
  {
    id: 6,
    question: "How does the Node.js event loop handle asynchronous I/O operations without multi-threading JavaScript code?",
    options: [
      "By creating a new V8 JavaScript runtime process per HTTP request",
      "By pausing CPU instruction execution until disk reads complete",
      "By offloading asynchronous OS system calls to the libuv C thread pool and triggering callbacks in the poll phase",
      "By compiling JavaScript into synchronous machine assembly"
    ],
    correctIndex: 2,
    explanation: "Node.js utilizes libuv to execute non-blocking operations via OS kernel mechanisms (epoll/kqueue) and thread pools, notifying the V8 engine via callback queues."
  },
  {
    id: 7,
    question: "What is the primary benefit of creating a composite B-Tree database index on (tenant_id, created_at)?",
    options: [
      "It automatically encrypts the tenant_id column",
      "It eliminates the need for foreign keys",
      "It converts relational tables into NoSQL document stores",
      "It enables rapid index seeks filtering by tenant and ordering by timestamp without sequential table scans"
    ],
    correctIndex: 3,
    explanation: "Composite indexes matching WHERE tenant_id = ? ORDER BY created_at allow the database planner to satisfy both filtering and sorting in a single index traversal."
  },
  {
    id: 8,
    question: "Which HTTP header is mandatory for preventing Cross-Site Scripting (XSS) attacks by restricting script execution origins?",
    options: [
      "Content-Security-Policy (CSP)",
      "Access-Control-Allow-Origin: *",
      "X-Powered-By: Express",
      "Transfer-Encoding: chunked"
    ],
    correctIndex: 0,
    explanation: "Content-Security-Policy instructs browsers to only execute scripts from whitelisted sources and nonces, blocking inline injection attacks."
  },
  {
    id: 9,
    question: "In distributed system architecture, what does the CAP theorem state regarding network partitions?",
    options: [
      "Systems can guarantee Consistency, Availability, and Partition Tolerance simultaneously",
      "Network partitions never occur in cloud data centers",
      "During a network partition, a system must choose between Consistency (CP) or Availability (AP)",
      "Partition tolerance can be disabled by increasing network bandwidth"
    ],
    correctIndex: 2,
    explanation: "When network communication fails between partitions, a distributed system must either reject writes to preserve consistency or accept writes and sacrifice immediate consistency."
  },
  {
    id: 10,
    question: "What is the primary operational advantage of storing JWT session tokens in HttpOnly SameSite=Lax cookies rather than browser localStorage?",
    options: [
      "Cookies allow storing unlimited gigabytes of relational data",
      "HttpOnly cookies cannot be read or stolen by malicious JavaScript code running in the browser",
      "Cookies automatically encrypt database records on the server",
      "LocalStorage requires server restarts upon user logout"
    ],
    correctIndex: 1,
    explanation: "HttpOnly cookies are inaccessible to document.cookie, immunizing session credentials from token-stealing XSS scripts."
  },
  {
    id: 11,
    question: "Why should database transactions involving money transfers utilize pessimistic row-level locking (SELECT ... FOR UPDATE)?",
    options: [
      "To prevent concurrent transactions from reading and modifying the balance simultaneously, avoiding double-spend race conditions",
      "To convert SQL queries into NoSQL key-value pairs",
      "To bypass database connection pool limits",
      "To delete accounts that have zero balances"
    ],
    correctIndex: 0,
    explanation: "SELECT ... FOR UPDATE places exclusive locks on the selected account rows, forcing concurrent requests to wait until the current transaction commits or rolls back."
  },
  {
    id: 12,
    question: "What is the main reason Next.js 15 React Server Components (RSC) improve initial page load performance?",
    options: [
      "They disable client-side JavaScript completely",
      "They convert CSS styles into inline SVG elements",
      "They compile client HTML into WebAssembly binaries",
      "They execute data fetching on the server, eliminating client waterfall requests and keeping heavy dependencies off the client bundle"
    ],
    correctIndex: 3,
    explanation: "Server Components run exclusively on the server, streaming pre-rendered HTML without sending component JavaScript libraries (like date-fns or markdown parsers) to the client."
  },
  {
    id: 13,
    question: "In Apache Kafka, what guarantees that messages for a particular customer account are consumed in strict chronological order?",
    options: [
      "Setting replication factor to 1",
      "Compressing payloads with zstd",
      "Publishing all events for that account with the same Partition Key",
      "Using auto-commit offsets on consumer groups"
    ],
    correctIndex: 2,
    explanation: "Kafka guarantees strict order only within a single partition. Messages sharing the same Partition Key are consistently hashed to the same partition."
  },
  {
    id: 14,
    question: "What is the primary function of a reverse proxy like Nginx or Cloudflare in front of Node.js / Go backend services?",
    options: [
      "Generating frontend React components dynamically",
      "Terminating TLS/SSL, load balancing traffic, rate limiting, and buffering slow clients",
      "Executing database migrations on production instances",
      "Compiling TypeScript files on the fly"
    ],
    correctIndex: 1,
    explanation: "Reverse proxies shield application servers from slow client connections, terminate SSL certificates, distribute incoming load, and cache static assets."
  },
  {
    id: 15,
    question: "What does the Idempotency-Key HTTP header ensure when communicating with payment and banking APIs?",
    options: [
      "It forces the payment gateway to process the charge twice",
      "It encrypts the customer's credit card CVV code",
      "It bypasses multi-factor SMS authentication",
      "It prevents duplicate charges if the client retries the request following a network timeout"
    ],
    correctIndex: 3,
    explanation: "Idempotent payment endpoints check if a request with the given Idempotency-Key has already been processed and safely return the cached response without charging again."
  },
  {
    id: 16,
    question: "Which algorithmic time complexity describes searching for an element in a balanced Binary Search Tree (BST)?",
    options: [
      "O(log N)",
      "O(N^2)",
      "O(N log N)",
      "O(1)"
    ],
    correctIndex: 0,
    explanation: "Each comparison in a balanced BST discards half of the remaining search space, yielding logarithmic O(log N) search time."
  },
  {
    id: 17,
    question: "What is the primary mechanism of Backpressure in Node.js streaming architectures?",
    options: [
      "Crashing the server process when RAM reaches 90%",
      "Discarding incoming network packets when the buffer fills",
      "Pausing the readable stream when the writable stream's buffer exceeds its highWaterMark threshold",
      "Encrypting file streams with AES-256"
    ],
    correctIndex: 2,
    explanation: "Backpressure signals the data producer to pause reading from disk or network until the consumer finishes flushing its internal write buffer, preventing out-of-memory crashes."
  },
  {
    id: 18,
    question: "Why should cryptographic passwords never be stored using fast hashing algorithms like MD5 or SHA-256?",
    options: [
      "Because SHA-256 produces variable length output strings",
      "Because modern GPUs can compute billions of SHA-256 hashes per second, making brute-force and rainbow table attacks trivial",
      "Because MD5 requires a paid enterprise license",
      "Because modern browsers block SHA-256 in web forms"
    ],
    correctIndex: 1,
    explanation: "Password hashing requires computationally intensive, salted key-derivation functions (Argon2id, bcrypt, PBKDF2) designed with memory and CPU cost factors to resist GPU/ASIC cracking."
  },
  {
    id: 19,
    question: "In relational databases, what does the Multi-Version Concurrency Control (MVCC) mechanism achieve?",
    options: [
      "It forces all users to read from a single shared memory cache",
      "It converts SQL tables into git commit logs",
      "It prevents transactions from modifying database schemas",
      "It allows readers to query snapshots of data without blocking writers, and writers to modify rows without blocking readers"
    ],
    correctIndex: 3,
    explanation: "MVCC maintains multiple physical versions of rows with visibility tags, enabling non-blocking reads of consistent snapshots concurrently with ongoing modifications."
  },
  {
    id: 20,
    question: "In Transformer neural networks, why is Scaled Dot-Product Attention scaled by the factor 1 / sqrt(d_k)?",
    options: [
      "To prevent large dot product magnitudes from pushing the Softmax activation into regions with vanishing gradients",
      "To convert floating point numbers into integers for faster GPU computation",
      "To reduce the number of parameters in the model",
      "To enforce rotary positional embeddings"
    ],
    correctIndex: 0,
    explanation: "As vector dimension d_k increases, the dot products grow large in variance, pushing softmax outputs to extreme 0 or 1 values where gradients become near-zero."
  },
  {
    id: 21,
    question: "What is the primary role of a Dead Letter Queue (DLQ) in message broker architectures?",
    options: [
      "To delete all consumer logs at midnight",
      "To automatically reboot failing Kubernetes worker pods",
      "To capture and isolate messages that repeatedly fail processing after maximum retry attempts for inspection without halting the pipeline",
      "To store unencrypted passwords in plaintext"
    ],
    correctIndex: 2,
    explanation: "A DLQ captures poison-pill messages that cause consumer crashes, preventing pipeline deadlock while preserving bad records for debugging."
  },
  {
    id: 22,
    question: "What does the 'Two-Pointer' algorithm technique optimize in array manipulation problems?",
    options: [
      "It doubles the memory allocation of the array",
      "It reduces time complexity from O(N^2) nested loops to linear O(N) by traversing sorted arrays from opposing ends",
      "It converts array elements into double-precision floats",
      "It enables multi-threaded sorting on single-core CPUs"
    ],
    correctIndex: 1,
    explanation: "By maintaining left and right pointers moving inward on sorted data, problems like Pair Sum or Water Container can be solved in a single O(N) pass."
  },
  {
    id: 23,
    question: "Why should application health checks distinguish between 'Liveness' and 'Readiness' probes in Kubernetes?",
    options: [
      "Because liveness probes monitor disk space while readiness probes check CPU clock frequency",
      "Because readiness probes cost cloud hosting money while liveness probes are free",
      "Because Kubernetes only allows one type of probe per cluster",
      "Because liveness indicates whether the process is alive (restarting if dead), while readiness indicates whether the container is ready to accept incoming user traffic"
    ],
    correctIndex: 3,
    explanation: "Liveness probes restart hung containers; readiness probes temporarily remove containers from load balancer routing while warming caches or establishing database pools."
  },
  {
    id: 24,
    question: "What is the primary architectural advantage of the Transactional Outbox Pattern in microservices?",
    options: [
      "It guarantees atomicity between saving database entities and publishing event messages to a broker without two-phase distributed locks",
      "It eliminates the need for message brokers like Kafka or RabbitMQ",
      "It automatically encrypts outgoing email communications",
      "It compiles SQL tables directly into frontend TypeScript types"
    ],
    correctIndex: 0,
    explanation: "The Outbox pattern writes domain data and outgoing events into the same relational database in a single ACID transaction, with a separate relay worker streaming events to the broker."
  },
  {
    id: 25,
    question: "What does Core Web Vitals metric 'Interaction to Next Paint' (INP) measure in modern browser performance?",
    options: [
      "The time taken to download the HTML document from the server",
      "The total compressed byte size of all CSS stylesheets",
      "Overall page responsiveness to user clicks, taps, and keyboard inputs across the entire user session",
      "The duration of the initial video stream playback"
    ],
    correctIndex: 2,
    explanation: "INP observes the latency of all discrete user interactions and reports the worst or near-worst delay until visual UI feedback is painted on the screen."
  },
  {
    id: 26,
    question: "How does Low-Rank Adaptation (LoRA) reduce GPU memory requirements during Large Language Model (LLM) fine-tuning?",
    options: [
      "By quantizing all prompt text into 8-bit ASCII characters",
      "By freezing original model weights and learning two low-rank decomposed matrices (A and B) representing weight updates: dW = B x A",
      "By deleting half of the Transformer attention layers",
      "By running backpropagation on CPU instead of GPU"
    ],
    correctIndex: 1,
    explanation: "LoRA freezes the billion-parameter base model and optimizes low-rank factor matrices (e.g. rank 8 or 16), reducing trainable parameters and optimizer states by over 95%."
  },
  {
    id: 27,
    question: "What is the primary purpose of Database Partition Pruning during SQL query execution?",
    options: [
      "Dropping tables that are older than 30 days",
      "Truncating table indexes to reclaim disk storage",
      "Converting relational tables into CSV files",
      "Enabling the query planner to analyze WHERE filter clauses and completely skip reading irrelevant partition tables from disk"
    ],
    correctIndex: 3,
    explanation: "When querying partitioned data (e.g. WHERE created_at >= '2026-01-01'), partition pruning skips all non-matching partitions, avoiding hundreds of gigabytes of disk I/O."
  },
  {
    id: 28,
    question: "What does the principle of Least Privilege dictate in production cloud IAM permissions?",
    options: [
      "Every user, service account, and role should be granted only the minimum permissions strictly necessary to perform its intended task",
      "All developers should have root AdministratorAccess on production clusters",
      "Permissions should be granted globally to the public Internet",
      "Service account keys should never be rotated"
    ],
    correctIndex: 0,
    explanation: "Least Privilege minimizes blast radius: if an application or service account is compromised, attackers cannot access unneeded databases, storage, or cloud infrastructure."
  },
  {
    id: 29,
    question: "What is the primary function of a Circuit Breaker pattern (e.g. in Netflix Hystrix or resilient HTTP clients)?",
    options: [
      "To shut down the entire cloud data center when electricity costs rise",
      "To automatically format source code with Prettier before building",
      "To stop invoking a failing downstream dependency after a threshold of errors, returning fallbacks immediately and preventing cascading service failures",
      "To encrypt network traffic across VPC subnets"
    ],
    correctIndex: 2,
    explanation: "Circuit breakers trip to an 'Open' state when downstream services fail, short-circuiting calls and preventing thread starvation across the calling application."
  },
  {
    id: 30,
    question: "Under the Indian Digital Personal Data Protection (DPDP) Act 2023, what is the mandatory requirement for organizations processing citizen data?",
    options: [
      "Publishing raw citizen phone numbers on public leaderboards",
      "Obtaining verifiable consent, processing data only for specified legitimate purposes, deploying technical safeguards, and honoring deletion requests",
      "Storing all user passwords in reversible base64 format",
      "Selling resume data to third-party telemarketers without disclosure"
    ],
    correctIndex: 1,
    explanation: "The DPDP Act establishes strict obligations for Data Fiduciaries including purpose limitation, clear consent notices, data security measures, and the citizen's right to erasure."
  }
];

export function getQuizForCourse(courseId: string): QuizQuestion[] {
  // Always returns the comprehensive, balanced 30-question engineering competency pool
  return GENERAL_TECHNICAL_30_POOL;
}
