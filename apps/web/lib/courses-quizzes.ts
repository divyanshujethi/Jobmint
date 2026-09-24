export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const COURSE_QUIZZES: Record<string, QuizQuestion[]> = {
  "karpathy-nn": [
    {
      id: 1,
      question: "In Micrograd, what must be done to node.grad before running the backward pass through a computational graph?",
      options: [
        "Initialize the root node's grad to 1.0 and child node grads to 0.0",
        "Set all weights and biases to 1.0",
        "Normalize the output vector using softmax",
        "Compute the numerical finite difference limit"
      ],
      correctIndex: 0,
      explanation: "Reverse-mode autodiff starts by setting the output scalar's derivative with respect to itself (dOut/dOut) to 1.0, accumulating gradients into children initialized at 0."
    },
    {
      id: 2,
      question: "Why is the Query-Key dot product in Transformer Self-Attention scaled by 1/sqrt(d_k)?",
      options: [
        "To speed up GPU tensor parallelization",
        "To prevent large dot-product magnitudes from pushing the Softmax into regions with near-zero gradients",
        "To convert logits directly into probability percentages",
        "To enforce orthogonal rotary embeddings"
      ],
      correctIndex: 1,
      explanation: "As embedding dimension d_k grows, dot products grow large in variance, pushing softmax outputs toward 0 or 1 where gradients vanish."
    },
    {
      id: 3,
      question: "What is the primary architectural purpose of Residual Connections in deep Transformer architectures?",
      options: [
        "To halve the model parameter size",
        "To allow gradients to flow directly unimpeded back to early layers during backpropagation",
        "To eliminate the need for LayerNorm",
        "To convert autoregressive generation into non-autoregressive decoding"
      ],
      correctIndex: 1,
      explanation: "Residual (skip) connections add the input directly to the layer output, providing a clean gradient highway that prevents vanishing gradients."
    },
    {
      id: 4,
      question: "In Byte-Pair Encoding (BPE) tokenization, what happens during the vocabulary training phase?",
      options: [
        "Words are split randomly into 3-character n-grams",
        "The most frequently occurring adjacent pair of bytes or tokens is iteratively merged into a new token",
        "Every unique English word is assigned a dictionary index",
        "Tokens are compressed using gzip"
      ],
      correctIndex: 1,
      explanation: "BPE iteratively finds the most frequent byte or character pair in the corpus and merges them into a single token until target vocab size is reached."
    },
    {
      id: 5,
      question: "When calculating Cross-Entropy Loss for language modeling, what mathematical identity prevents numerical overflow when computing softmax?",
      options: [
        "Subtracting the maximum logit before computing exponents: exp(z_i - max(z))",
        "Multiplying all logits by the learning rate",
        "Applying L2 regularization to the output layer",
        "Clipping weights between -1 and 1"
      ],
      correctIndex: 0,
      explanation: "The log-sum-exp trick subtracts the maximum logit value so exponents remain <= 1, preventing floating-point overflow."
    }
  ],

  "krish-genai": [
    {
      id: 1,
      question: "What is the role of the Vector Embedding model in a Retrieval-Augmented Generation (RAG) pipeline?",
      options: [
        "To generate the final human-readable response",
        "To convert text chunks into dense mathematical vectors capturing semantic meaning for similarity search",
        "To fine-tune the LLM weights on proprietary documents",
        "To tokenize text into prompt tokens"
      ],
      correctIndex: 1,
      explanation: "Embedding models map textual semantics into high-dimensional vector space so cosine or L2 similarity queries find relevant chunks."
    },
    {
      id: 2,
      question: "Why is chunk overlap (e.g. 50-100 tokens) recommended when using RecursiveCharacterTextSplitter in LangChain?",
      options: [
        "To reduce vector database storage costs",
        "To preserve contextual meaning across sentence and paragraph boundaries that would otherwise be sliced in half",
        "To force the LLM to hallucinate less",
        "To eliminate duplicate chunks"
      ],
      correctIndex: 1,
      explanation: "Chunk overlap ensures that sentences or context split at the end of chunk N are continued into chunk N+1, preventing broken context."
    },
    {
      id: 3,
      question: "What does the temperature parameter control in LLM inference?",
      options: [
        "GPU operating temperature",
        "The degree of randomness in probability distribution sampling when selecting next tokens",
        "The maximum context window size in tokens",
        "The quantization bit depth (e.g. 4-bit vs 8-bit)"
      ],
      correctIndex: 1,
      explanation: "Lower temperature (e.g. 0.0) yields deterministic greedy decoding, while higher temperature flattens the distribution for creative diversity."
    },
    {
      id: 4,
      question: "What is the key difference between Zero-Shot and Few-Shot prompting?",
      options: [
        "Zero-shot uses zero tokens while few-shot uses thousands",
        "Few-shot provides explicit input/output demonstration examples in the prompt to guide the model's pattern matching",
        "Zero-shot is only supported on proprietary models",
        "Few-shot updates the underlying neural network weights permanently"
      ],
      correctIndex: 1,
      explanation: "Few-shot in-context learning supplies several concrete examples of desired input-output behavior directly within the prompt."
    },
    {
      id: 5,
      question: "In LangChain Agents, what does the ReAct framework stand for?",
      options: [
        "React.js Component Architecture",
        "Reasoning and Acting (Thought, Action, Observation loop)",
        "Realtime Asynchronous Cluster Tracking",
        "Recursive Attention Context Truncation"
      ],
      correctIndex: 1,
      explanation: "ReAct prompts the model to generate a Thought (Reasoning), take an Action (Call a Tool), and process the Observation iteratively."
    }
  ],

  "hitesh-chai-fullstack": [
    {
      id: 1,
      question: "In Next.js 15 App Router, what is the default behavior of components inside the app directory?",
      options: [
        "They are React Server Components (RSC) rendered on the server",
        "They are Client Components executing only in the browser",
        "They require the 'use server' directive at the top of the file",
        "They are rendered statically as raw HTML files at build time only"
      ],
      correctIndex: 0,
      explanation: "In Next.js App Router, all components are Server Components by default unless marked with 'use client'."
    },
    {
      id: 2,
      question: "Where should the 'use server' directive be placed in Next.js 15?",
      options: [
        "At the top of server-only files or inside async functions to declare Server Actions",
        "In the layout.tsx head tag",
        "In next.config.js to enable server mode",
        "Inside useState hooks"
      ],
      correctIndex: 0,
      explanation: "The 'use server' directive marks asynchronous functions as Server Actions callable from both server and client components."
    },
    {
      id: 3,
      question: "What is the primary security advantage of storing authentication session tokens in httpOnly cookies instead of localStorage?",
      options: [
        "httpOnly cookies have faster read latency",
        "httpOnly cookies cannot be accessed or stolen via clientside JavaScript Cross-Site Scripting (XSS) attacks",
        "httpOnly cookies automatically encrypt database rows",
        "httpOnly cookies work offline without internet"
      ],
      correctIndex: 1,
      explanation: "httpOnly cookies are inaccessible to document.cookie in JS, mitigating credential theft if an XSS vulnerability exists."
    },
    {
      id: 4,
      question: "In PostgreSQL and Drizzle ORM, what does ON DELETE CASCADE enforce on a foreign key?",
      options: [
        "It prevents the parent record from ever being deleted",
        "When the referenced parent row is deleted, all dependent child rows referencing it are automatically deleted",
        "It archives the deleted row into an S3 bucket",
        "It cascades an email notification to the user"
      ],
      correctIndex: 1,
      explanation: "ON DELETE CASCADE maintains referential integrity by automatically cleaning up child rows when the parent entity is removed."
    },
    {
      id: 5,
      question: "What HTTP method does a Next.js Server Action invocation use under the hood?",
      options: [
        "GET with query parameters",
        "POST with multipart or serialized payload and Next-Action header",
        "PUT with JSON body",
        "WebSocket binary frames"
      ],
      correctIndex: 1,
      explanation: "Server Actions are invoked via POST requests with the Next-Action hash identifier and form/JSON payload."
    }
  ],

  "striver-a2z-dsa": [
    {
      id: 1,
      question: "What is the time complexity of Floyd's Tortoise and Hare algorithm for detecting a cycle in a Linked List?",
      options: [
        "O(N) Time and O(1) Auxiliary Space",
        "O(N^2) Time and O(N) Space",
        "O(log N) Time and O(1) Space",
        "O(N log N) Time and O(N) Space"
      ],
      correctIndex: 0,
      explanation: "Fast moves 2 steps and slow moves 1 step. If a cycle exists, they meet within at most the cycle's length, taking O(N) time with zero extra heap allocation."
    },
    {
      id: 2,
      question: "In the Sliding Window algorithmic pattern, what is the maximum number of times the left pointer can advance across an array of length N?",
      options: [
        "N times, guaranteeing an overall O(N) time complexity even with a nested loop",
        "N^2 times",
        "log N times",
        "2^N times"
      ],
      correctIndex: 0,
      explanation: "Because both right and left pointers only move forward monotonically from 0 to N, each element is visited at most twice (O(2N) = O(N))."
    },
    {
      id: 3,
      question: "What two properties must a problem satisfy to be optimally solvable via Dynamic Programming?",
      options: [
        "Fast Fourier Transform and Matrix Multiplication",
        "Overlapping Subproblems and Optimal Substructure",
        "Greedy Choice Property and Balanced Trees",
        "Hash Colissions and Depth-First Search"
      ],
      correctIndex: 1,
      explanation: "DP applies when an optimal solution can be constructed from optimal subproblems, and the same subproblems are solved repeatedly."
    },
    {
      id: 4,
      question: "What is the worst-case time complexity of standard Binary Search on a sorted array of size N?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      correctIndex: 1,
      explanation: "Binary Search halves the search space at each iteration: N, N/2, N/4 ... 1, resulting in log2(N) steps."
    },
    {
      id: 5,
      question: "Why is a Min-Heap (Priority Queue) preferred over a simple linear array in Dijkstra's Shortest Path algorithm?",
      options: [
        "It reduces the time complexity to extract the minimum distance node from O(V) to O(log V)",
        "It automatically detects negative weight cycles",
        "It eliminates graph vertices",
        "It allows parallel processing across threads"
      ],
      correctIndex: 0,
      explanation: "Extract-Min on a binary heap takes O(log V) time, yielding total Dijkstra runtime of O((V + E) log V) instead of O(V^2)."
    }
  ]
};

// Generic quiz fallback for other curricula
export function getQuizForCourse(courseId: string): QuizQuestion[] {
  if (COURSE_QUIZZES[courseId]) {
    return COURSE_QUIZZES[courseId];
  }

  return [
    {
      id: 1,
      question: "What is the core principle of reproducible software engineering demonstrated in this curriculum?",
      options: [
        "Version controlling code with Git and writing automated tests for critical invariants",
        "Writing monolithic files without modular functions",
        "Hardcoding configuration parameters into source files",
        "Skipping peer reviews to maximize delivery speed"
      ],
      correctIndex: 0,
      explanation: "Clean version control, modular abstractions, and regression testing ensure reproducible, production-ready engineering."
    },
    {
      id: 2,
      question: "When deploying a modern application container with Docker, what is the best practice for production image sizing?",
      options: [
        "Use multi-stage builds and minimal base images (like Alpine or distroless) to reduce attack surface and download latency",
        "Include all development build tools and compilers in the final container image",
        "Store root passwords in the Dockerfile ENV variables",
        "Run the container process as the root user"
      ],
      correctIndex: 0,
      explanation: "Multi-stage builds compile artifacts in a builder image and copy only the compiled binary to a minimal runtime container."
    },
    {
      id: 3,
      question: "Why should API secrets and database passwords never be committed to a public Git repository?",
      options: [
        "They can be scraped by automated bots within seconds, compromising backend databases and cloud quotas",
        "Git file compression algorithms corrupt encrypted keys",
        "Public repositories only allow 100 characters per file",
        "It prevents other team members from pulling the repository"
      ],
      correctIndex: 0,
      explanation: "Public secret leakage exposes sensitive systems to credential stuffing and immediate exploitation."
    },
    {
      id: 4,
      question: "What does horizontal scaling refer to in distributed systems architecture?",
      options: [
        "Adding more computing instances or nodes behind a load balancer",
        "Purchasing a larger CPU for a single server",
        "Rotating a database table 90 degrees",
        "Decreasing network bandwidth"
      ],
      correctIndex: 0,
      explanation: "Horizontal scaling (scale-out) distributes workload across multiple replicated nodes for high availability and fault tolerance."
    },
    {
      id: 5,
      question: "Under the Indian DPDP Act 2023, what is the fundamental obligation of a Data Fiduciary regarding user data?",
      options: [
        "Process data strictly for specified purposes with explicit consent, implement security safeguards, and respect right to erasure",
        "Sell user phone numbers to third-party marketing firms",
        "Retain personal data indefinitely without user permission",
        "Disclose candidate resumes publicly without authentication"
      ],
      correctIndex: 0,
      explanation: "The DPDP Act mandates purpose limitation, explicit consent, technical security safeguards, and strict data erasure rights."
    }
  ];
}
