export interface KnowledgeGraphNode {
  id: string;
  label: string;
  category: "AI & ML" | "Frontend" | "Backend" | "Systems & Cloud" | "Databases";
  x: number;
  y: number;
  importance: number; // 1 to 3
  summary: string;
  mentalModel: string;
  interactiveQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  codeSnippet?: string;
  matchingSkill: string;
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  relationship: string;
}

export const KNOWLEDGE_GRAPH_EDGES: KnowledgeGraphEdge[] = [
  // AI & ML Cluster
  { source: "vector-embeddings", target: "cosine-similarity", relationship: "measured by" },
  { source: "vector-embeddings", target: "hnsw-indexing", relationship: "indexed via" },
  { source: "hnsw-indexing", target: "rag-systems", relationship: "powers fast retrieval for" },
  { source: "rag-systems", target: "autonomous-agents", relationship: "supplies memory & context to" },
  { source: "autonomous-agents", target: "langgraph", relationship: "orchestrated with" },
  { source: "autonomous-agents", target: "mcp-protocol", relationship: "invokes tools via" },
  { source: "transformers", target: "attention-mechanism", relationship: "core breakthrough is" },
  { source: "transformers", target: "lora-qlora", relationship: "efficiently fine-tuned using" },
  { source: "lora-qlora", target: "vllm-serving", relationship: "deployed & served via" },
  { source: "vllm-serving", target: "paged-attention", relationship: "eliminates KV cache waste with" },
  { source: "rag-systems", target: "llm-guardrails", relationship: "evaluated & secured by" },

  // Cross Links: AI to Backend / Data
  { source: "rag-systems", target: "postgresql-pgvector", relationship: "stores vectors in" },
  { source: "postgresql-pgvector", target: "acid-transactions", relationship: "guarantees data integrity via" },
  { source: "postgresql-pgvector", target: "drizzle-orm", relationship: "accessed via type-safe" },

  // Full-Stack & Frontend Cluster
  { source: "react-19", target: "virtual-dom-fiber", relationship: "reconciles updates using" },
  { source: "react-19", target: "server-components", relationship: "renders on server with" },
  { source: "server-components", target: "nextjs-15", relationship: "natively integrated in" },
  { source: "nextjs-15", target: "server-actions", relationship: "mutates backend data via" },
  { source: "server-actions", target: "drizzle-orm", relationship: "queries database with" },
  { source: "nextjs-15", target: "edge-middleware", relationship: "routes & auths requests at" },
  { source: "typescript-strict", target: "react-19", relationship: "enforces type safety across" },
  { source: "typescript-strict", target: "nextjs-15", relationship: "types server & client boundaries" },

  // Backend, Data & Systems Cluster
  { source: "drizzle-orm", target: "postgresql-pgvector", relationship: "generates SQL migrations for" },
  { source: "postgresql-pgvector", target: "b-tree-indexes", relationship: "accelerates relational lookups using" },
  { source: "nextjs-15", target: "redis-caching", relationship: "caches hot data in" },
  { source: "redis-caching", target: "rate-limiting", relationship: "implements sliding-window" },
  { source: "redis-caching", target: "message-queues", relationship: "coordinates asynchronous" },

  // Cloud & DevOps Cluster
  { source: "nextjs-15", target: "docker-containers", relationship: "packaged into multi-stage" },
  { source: "docker-containers", target: "kubernetes", relationship: "orchestrated in clusters via" },
  { source: "kubernetes", target: "ingress-networking", relationship: "routes public traffic through" },
  { source: "docker-containers", target: "github-actions-cicd", relationship: "built & tested automatically in" },
  { source: "github-actions-cicd", target: "cloud-vms", relationship: "deploys zero-downtime containers to" },
];

export const KNOWLEDGE_GRAPH_NODES: KnowledgeGraphNode[] = [
  // ── AI & Machine Learning ──
  {
    id: "transformers",
    label: "Transformers Architecture",
    category: "AI & ML",
    x: 180,
    y: 120,
    importance: 3,
    summary: "The foundational sequence-to-sequence neural network architecture introduced in 'Attention Is All You Need' that replaced recurrent RNNs with parallelized self-attention.",
    mentalModel: "Think of it like a roundtable conference where every word can instantaneously look at, question, and weigh every other word in the sentence simultaneously.",
    interactiveQuiz: {
      question: "Why do Transformers train significantly faster than Recurrent Neural Networks (RNNs)?",
      options: [
        "Because RNNs require higher GPU memory bandwidth",
        "Because Transformers process all tokens in parallel rather than sequentially",
        "Because Transformers do not use matrix multiplications",
        "Because Transformers only work on English text"
      ],
      correctIndex: 1,
      explanation: "Transformers process whole sequences in parallel using matrix multiplications (Q, K, V), eliminating the sequential bottleneck of RNN hidden-state recurrence."
    },
    codeSnippet: "# Scaled Dot-Product Attention in PyTorch\nscores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)\nweights = torch.softmax(scores + mask, dim=-1)\noutput = torch.matmul(weights, V)",
    matchingSkill: "Transformers"
  },
  {
    id: "attention-mechanism",
    label: "Self-Attention & RoPE",
    category: "AI & ML",
    x: 80,
    y: 260,
    importance: 2,
    summary: "Calculates dynamic affinity weights between tokens and injects positional context using Rotary Position Embeddings (RoPE).",
    mentalModel: "RoPE rotates 2D pairs of embedding vectors in complex space based on token index, preserving relative distance regardless of absolute position.",
    interactiveQuiz: {
      question: "What does RoPE (Rotary Position Embedding) accomplish compared to absolute sinusoidal embeddings?",
      options: [
        "It eliminates the need for any matrix multiplication",
        "It naturally decays attention for distant tokens and generalizes to longer context windows",
        "It converts float32 weights into 4-bit integers",
        "It prevents hallucinations completely"
      ],
      correctIndex: 1,
      explanation: "RoPE encodes relative position as vector rotations, allowing modern LLMs (like Llama 3) to extrapolate across 128k+ token contexts gracefully."
    },
    codeSnippet: "# RoPE rotation formulation:\ndef apply_rope(x, freqs_cos, freqs_sin):\n    x_rot = rotate_half(x)\n    return (x * freqs_cos) + (x_rot * freqs_sin)",
    matchingSkill: "PyTorch"
  },
  {
    id: "vector-embeddings",
    label: "Vector Embeddings",
    category: "AI & ML",
    x: 360,
    y: 130,
    importance: 3,
    summary: "High-dimensional dense vectors where semantic meaning is captured geometrically: similar concepts lie closer in vector space.",
    mentalModel: "A 1,536-dimensional coordinate map where 'king' - 'man' + 'woman' equals 'queen', and 'Python developer' lands near 'Django' and 'FastAPI'.",
    interactiveQuiz: {
      question: "Which metric is most commonly used to measure semantic similarity between two normalized text embeddings?",
      options: [
        "Manhattan distance (L1)",
        "Cosine similarity / Dot product",
        "Levenshtein edit distance",
        "Hamming distance"
      ],
      correctIndex: 1,
      explanation: "For unit-normalized embeddings, the cosine similarity equals the dot product (A · B), measuring the angle between semantic direction vectors."
    },
    codeSnippet: "# Cosine similarity in NumPy\ndef cosine_sim(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))",
    matchingSkill: "Vector Embeddings"
  },
  {
    id: "cosine-similarity",
    label: "Cosine Similarity",
    category: "AI & ML",
    x: 480,
    y: 60,
    importance: 1,
    summary: "The cosine of the angle between two multi-dimensional vectors, ranging from -1 to 1 regardless of vector magnitude.",
    mentalModel: "Points two flashlights in high-dimensional space: if they shine in the same direction, similarity is 1.0; if perpendicular, 0.0.",
    interactiveQuiz: {
      question: "If two embedding vectors have identical direction but one has twice the length of the other, what is their cosine similarity?",
      options: ["0.5", "1.0", "2.0", "0.0"],
      correctIndex: 1,
      explanation: "Cosine similarity measures only the angle between vectors, normalizing away length differences. Identical direction always yields 1.0."
    },
    codeSnippet: "similarity = (vec_a @ vec_b) / (norm(vec_a) * norm(vec_b))",
    matchingSkill: "Linear Algebra"
  },
  {
    id: "hnsw-indexing",
    label: "HNSW Vector Indexing",
    category: "AI & ML",
    x: 520,
    y: 200,
    importance: 2,
    summary: "Hierarchical Navigable Small World graphs: the state-of-the-art algorithm enabling approximate nearest neighbor (ANN) search in sub-5ms across millions of vectors.",
    mentalModel: "Like the express subway system: upper layers make long hops across city districts; lower layers zoom into the exact street address.",
    interactiveQuiz: {
      question: "What trade-off does HNSW make compared to brute-force flat vector search?",
      options: [
        "Slightly lower accuracy (<1% recall loss) in exchange for 100x faster query latency",
        "Zero memory usage with slower latency",
        "Guaranteed 100% mathematical precision at O(N) cost",
        "Works only on integer values"
      ],
      correctIndex: 0,
      explanation: "HNSW trades ~0.5% recall precision for logarithmic O(log N) search speed, enabling real-time search across billions of vectors."
    },
    codeSnippet: "# Qdrant / HNSW indexing configuration\nclient.create_collection(\n    collection_name='docs',\n    vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE),\n    hnsw_config=models.HnswConfigDiff(m=16, ef_construct=100)\n)",
    matchingSkill: "Qdrant"
  },
  {
    id: "rag-systems",
    label: "Production RAG Systems",
    category: "AI & ML",
    x: 680,
    y: 140,
    importance: 3,
    summary: "Retrieval-Augmented Generation combines external vector retrieval with LLM reasoning to ground answers in verified enterprise documents without hallucinations.",
    mentalModel: "An open-book exam: instead of relying on the model's memorized training data, it looks up the exact handbook page before generating the response.",
    interactiveQuiz: {
      question: "What is 'Hybrid Search' in modern RAG architectures?",
      options: [
        "Searching images and audio at the same time",
        "Combining dense vector semantic search with BM25 sparse keyword matching",
        "Querying two different vector databases simultaneously",
        "Using GPU and CPU search in alternating turns"
      ],
      correctIndex: 1,
      explanation: "Hybrid search merges semantic vector search (for conceptual understanding) with BM25 keyword search (for exact product IDs, acronyms, and error codes)."
    },
    codeSnippet: "# Reciprocal Rank Fusion (RRF) for Hybrid RAG\ndef rrf(vector_hits, keyword_hits, k=60):\n    scores = {}\n    for rank, doc in enumerate(vector_hits):\n        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank)\n    for rank, doc in enumerate(keyword_hits):\n        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank)\n    return sorted(scores.items(), key=lambda x: x[1], reverse=True)",
    matchingSkill: "RAG"
  },
  {
    id: "autonomous-agents",
    label: "Autonomous Agents & ReAct",
    category: "AI & ML",
    x: 880,
    y: 110,
    importance: 3,
    summary: "AI systems capable of reasoning, breaking complex goals into multi-step action plans, executing tools (SQL, bash, APIs), and self-correcting mistakes.",
    mentalModel: "An autonomous software intern: reads a ticket, checks out code, runs tests, reads error traces, patches bugs, and submits a PR.",
    interactiveQuiz: {
      question: "In the ReAct (Reasoning + Acting) loop, what is the purpose of the 'Thought' step before 'Action'?",
      options: [
        "To sleep and save API tokens",
        "To allow the model to verbalize reasoning, decompose dependencies, and pick the correct tool call",
        "To compile the Python bytecode",
        "To authenticate with the server"
      ],
      correctIndex: 1,
      explanation: "Verbalizing thoughts allows chain-of-thought planning, reducing tool hallucination and enabling backtracking if an action returns an unexpected error."
    },
    codeSnippet: "# ReAct Agent Step Loop\nwhile not done:\n    thought = llm.generate(f'History: {history}\\nThought:')\n    action = extract_tool_call(thought)\n    observation = execute_tool(action)\n    history.append((thought, action, observation))",
    matchingSkill: "LangGraph"
  },
  {
    id: "langgraph",
    label: "LangGraph Multi-Agent Workflows",
    category: "AI & ML",
    x: 1040,
    y: 60,
    importance: 2,
    summary: "A framework for building cyclical, stateful multi-agent systems with branching, human-in-the-loop approvals, and checkpoint persistence.",
    mentalModel: "A finite state machine for AI agents: passing a shared clipboard of state between specialized agents (Planner, Coder, Reviewer).",
    interactiveQuiz: {
      question: "Why does LangGraph use cyclic graphs rather than simple Directed Acyclic Graphs (DAGs)?",
      options: [
        "Because cyclic graphs are faster to compute",
        "To enable iterative feedback loops where agents can review, retry, and correct errors until conditions are met",
        "Because Python doesn't support DAGs",
        "To prevent infinite loops automatically"
      ],
      correctIndex: 1,
      explanation: "Real reasoning requires loops: Write Code -> Run Test -> Fails -> Loop back to Coder -> Passes -> Move to Done."
    },
    codeSnippet: "graph = StateGraph(State)\ngraph.add_node('developer', dev_node)\ngraph.add_node('tester', test_node)\ngraph.add_conditional_edges('tester', check_pass, {'pass': END, 'fail': 'developer'})",
    matchingSkill: "LangGraph"
  },
  {
    id: "mcp-protocol",
    label: "Model Context Protocol (MCP)",
    category: "AI & ML",
    x: 1080,
    y: 170,
    importance: 2,
    summary: "Anthropic's open standard for connecting AI assistants and agents to external data sources, developer tools, and environments securely.",
    mentalModel: "The USB-C cable for AI: a single standard protocol connecting any AI model to any database, Git repo, or CLI tool seamlessly.",
    interactiveQuiz: {
      question: "What core problem does the Model Context Protocol (MCP) solve for AI developers?",
      options: [
        "It eliminates custom ad-hoc API integrations by providing a standard client-server tool specification",
        "It replaces GPU hardware with CPU clusters",
        "It trains models from scratch without data",
        "It translates Python into Rust"
      ],
      correctIndex: 0,
      explanation: "Instead of writing fragmented custom connectors for every model and tool, MCP standardizes how tools, resources, and prompts are exposed to agents."
    },
    codeSnippet: "# MCP Server Tool Definition\n@server.list_tools()\nasync def handle_list_tools() -> list[types.Tool]:\n    return [types.Tool(name='query_db', description='Execute read-only SQL')]",
    matchingSkill: "MCP"
  },
  {
    id: "lora-qlora",
    label: "LoRA & QLoRA Fine-Tuning",
    category: "AI & ML",
    x: 260,
    y: 280,
    importance: 2,
    summary: "Parameter-Efficient Fine-Tuning (PEFT) that freezes base model weights and trains low-rank decomposition matrices, with 4-bit NormalFloat quantization (QLoRA).",
    mentalModel: "Post-it notes in an encyclopedia: instead of rewriting the entire 70-billion-word encyclopedia, you stick specialized post-it notes on key pages.",
    interactiveQuiz: {
      question: "How does LoRA achieve a 90%+ reduction in VRAM training requirements?",
      options: [
        "By deleting half the layers of the model",
        "By freezing the original weights W and training low-rank factor matrices (A * B) with rank r << d",
        "By using integer arithmetic for all forward passes",
        "By skipping backpropagation"
      ],
      correctIndex: 1,
      explanation: "LoRA represents the weight update delta as delta_W = B * A, where B is (d x r) and A is (r x d). With r=16, this requires training only ~0.1% of parameters."
    },
    codeSnippet: "from peft import LoraConfig, get_peft_model\nconfig = LoraConfig(r=16, lora_alpha=32, target_modules=['q_proj', 'v_proj'])\nmodel = get_peft_model(base_model, config)",
    matchingSkill: "LoRA"
  },
  {
    id: "vllm-serving",
    label: "vLLM High-Throughput Serving",
    category: "AI & ML",
    x: 440,
    y: 330,
    importance: 2,
    summary: "High-performance open-source LLM inference and serving engine powered by PagedAttention and continuous iteration-level batching.",
    mentalModel: "Operating system virtual memory for LLMs: splits the KV cache into non-contiguous memory pages, eliminating 96% of memory fragmentation.",
    interactiveQuiz: {
      question: "What is the primary bottleneck during LLM inference that vLLM solves with PagedAttention?",
      options: [
        "CPU disk read speeds",
        "GPU Key-Value (KV) cache memory fragmentation and waste",
        "Network latency of JSON parsing",
        "Database connection pools"
      ],
      correctIndex: 1,
      explanation: "In standard serving, dynamic sequence lengths cause up to 80% KV cache memory fragmentation. PagedAttention pages KV cache memory, achieving 2-4x higher concurrency."
    },
    codeSnippet: "from vllm import LLM, SamplingParams\nllm = LLM(model='meta-llama/Llama-3.2-3B', tensor_parallel_size=1)\noutputs = llm.generate(['Explain quantum computing:'], SamplingParams(max_tokens=100))",
    matchingSkill: "vLLM"
  },
  {
    id: "paged-attention",
    label: "PagedAttention & KV Cache",
    category: "AI & ML",
    x: 620,
    y: 380,
    importance: 1,
    summary: "The memory management algorithm inspired by OS virtual memory pages that allows KV tensors to be stored in non-contiguous physical memory blocks.",
    mentalModel: "Like allocating RAM in 4KB pages rather than requiring one massive unbroken contiguous block of memory for every program.",
    interactiveQuiz: {
      question: "Why does autoregressive text generation require a Key-Value (KV) cache?",
      options: [
        "To remember past user accounts",
        "To avoid recomputing Keys and Values for preceding tokens at every new generation step",
        "To speed up disk writing",
        "To encrypt token transfers"
      ],
      correctIndex: 1,
      explanation: "Because previous tokens do not change, caching their K and V projections turns quadratic O(N^2) token generation into linear O(N) step increments."
    },
    codeSnippet: "# Physical block table maps logical token blocks to physical GPU RAM pages\nblock_table = [physical_page_4, physical_page_12, physical_page_99]",
    matchingSkill: "CUDA"
  },
  {
    id: "llm-guardrails",
    label: "LLM Guardrails & Ragas",
    category: "AI & ML",
    x: 820,
    y: 270,
    importance: 2,
    summary: "Automated evaluation of hallucination rates (Faithfulness, Relevance) with Ragas and defense against Prompt Injection attacks.",
    mentalModel: "The airport security checkpoint for generative AI: inspects incoming prompts for malicious attacks and audits outgoing responses for hallucinations.",
    interactiveQuiz: {
      question: "In the RAG Triad evaluation metrics (Ragas), what does 'Faithfulness' measure?",
      options: [
        "Whether the user is polite to the bot",
        "Whether the generated answer is mathematically grounded solely in the retrieved context",
        "Whether the model responds within 50ms",
        "Whether the answer rhymes"
      ],
      correctIndex: 1,
      explanation: "Faithfulness evaluates if every claim in the generated answer can be directly inferred from the retrieved chunks, catching hallucinations."
    },
    codeSnippet: "from ragas.metrics import faithfulness\nscore = evaluate(dataset, metrics=[faithfulness])",
    matchingSkill: "Ragas"
  },

  // ── Full-Stack & Frontend ──
  {
    id: "react-19",
    label: "React 19 Core & Hooks",
    category: "Frontend",
    x: 180,
    y: 520,
    importance: 3,
    summary: "The UI component model powering modern web applications with Concurrent Mode, useActionState, useOptimistic, and React Compiler memoization.",
    mentalModel: "A pure mathematical function of state: UI = f(state). When state changes, React recalculates the delta and updates the DOM with minimal reflows.",
    interactiveQuiz: {
      question: "What does the React 19 `useOptimistic` hook allow developers to do?",
      options: [
        "Cache database queries forever",
        "Render the expected successful state immediately in the UI before a server mutation finishes",
        "Prevent network timeouts completely",
        "Automatically bundle CSS"
      ],
      correctIndex: 1,
      explanation: "useOptimistic provides immediate visual feedback to users (e.g. liking a post or sending a message) while the background server action completes."
    },
    codeSnippet: "const [optimisticCount, setOptimisticCount] = useOptimistic(\n  count,\n  (state, delta: number) => state + delta\n);",
    matchingSkill: "React"
  },
  {
    id: "virtual-dom-fiber",
    label: "Fiber & Reconciliation",
    category: "Frontend",
    x: 80,
    y: 640,
    importance: 2,
    summary: "React's incremental tree reconciliation engine capable of pausing, aborting, or prioritizing render work to maintain 60fps responsiveness.",
    mentalModel: "A cooperative scheduler that slices rendering work into micro-chunks so typing in an input is never blocked by a massive list render.",
    interactiveQuiz: {
      question: "What is a 'Fiber' in React's reconciliation engine?",
      options: [
        "A physical glass cable connecting the browser",
        "A JavaScript object that represents a unit of work with priority and component state",
        "A CSS styling utility",
        "A Web Worker thread"
      ],
      correctIndex: 1,
      explanation: "A Fiber node is a lightweight unit of work. React's Fiber reconciler walks the fiber tree incrementally, yielding control back to the browser between frames."
    },
    codeSnippet: "// Fiber work loop snippet\nwhile (workInProgress !== null && !shouldYield()) {\n  performUnitOfWork(workInProgress);\n}",
    matchingSkill: "JavaScript"
  },
  {
    id: "server-components",
    label: "React Server Components (RSC)",
    category: "Frontend",
    x: 360,
    y: 530,
    importance: 3,
    summary: "Components that execute strictly on the server, generating zero client JavaScript bundle size while streaming rendered virtual DOM trees to the client.",
    mentalModel: "The best of both worlds: access databases and backend file systems directly like PHP, while maintaining interactive client state like React.",
    interactiveQuiz: {
      question: "Which of the following can a React Server Component (RSC) do directly?",
      options: [
        "Attach an onClick listener or use useState()",
        "Query a PostgreSQL database directly using async/await without creating an API route",
        "Access browser localStorage",
        "Run Web Audio APIs"
      ],
      correctIndex: 1,
      explanation: "RSCs run only on the server, so they can directly `await db.query(...)` with zero client bundle impact, but cannot use browser hooks like useState or onClick."
    },
    codeSnippet: "// React Server Component (zero client bundle)\nexport default async function ProductPage({ params }) {\n  const product = await db.query.products.findFirst({ where: eq(id, params.id) });\n  return <h1>{product.name}</h1>;\n}",
    matchingSkill: "Next.js"
  },
  {
    id: "nextjs-15",
    label: "Next.js 15 App Router",
    category: "Frontend",
    x: 540,
    y: 540,
    importance: 3,
    summary: "The full-stack React framework featuring nested layouts, Streaming SSR, dynamic server caching, Server Actions, and Turbopack.",
    mentalModel: "The production nervous system for modern web: handles routing, SEO metadata, image optimization, edge CDN caching, and full-stack API boundaries.",
    interactiveQuiz: {
      question: "What triggers route revalidation in Next.js App Router after a database mutation?",
      options: [
        "revalidatePath('/jobs') or revalidateTag('jobs')",
        "window.location.reload()",
        "document.cookie.clear()",
        "Next.js auto-refreshes every 2 seconds"
      ],
      correctIndex: 0,
      explanation: "revalidatePath and revalidateTag purge stale server cache entries on-demand, causing the next request to stream fresh data."
    },
    codeSnippet: "'use server';\nimport { revalidatePath } from 'next/cache';\nexport async function updateTitle(id: string, title: string) {\n  await db.update(jobs).set({ title }).where(eq(jobs.id, id));\n  revalidatePath('/jobs');\n}",
    matchingSkill: "Next.js"
  },
  {
    id: "server-actions",
    label: "Server Actions & Mutations",
    category: "Frontend",
    x: 720,
    y: 470,
    importance: 2,
    summary: "Asynchronous functions declared with 'use server' that can be called from client forms or event handlers with automatic POST endpoint wiring and CSRF protection.",
    mentalModel: "Calling a server function as easily as calling a client function, without ever writing manual fetch('/api/...') boilerplate.",
    interactiveQuiz: {
      question: "How do Server Actions provide enhanced security compared to manual API routes?",
      options: [
        "They encrypt the entire database",
        "They include cryptographic action IDs, CSRF tokens, and allow progressive enhancement when JS is disabled",
        "They block all foreign IP addresses",
        "They run inside hardware enclaves"
      ],
      correctIndex: 1,
      explanation: "Server actions automatically verify incoming request headers, origin tokens, and integrate with native HTML forms for progressive enhancement."
    },
    codeSnippet: "<form action={createJobAction}>\n  <input name=\"title\" required />\n  <button type=\"submit\">Post Job</button>\n</form>",
    matchingSkill: "TypeScript"
  },
  {
    id: "edge-middleware",
    label: "Edge Middleware & Auth",
    category: "Frontend",
    x: 640,
    y: 650,
    importance: 2,
    summary: "Lightweight V8 isolates running in Cloudflare / CDN edge PoPs that intercept requests in under 5ms for authentication, routing, and bot mitigation.",
    mentalModel: "The security guard standing at the front door of the edge CDN, checking session tokens before requests ever reach the origin server.",
    interactiveQuiz: {
      question: "Why cannot Edge Middleware execute arbitrary Node.js native C++ modules (like raw fs or sqlite3)?",
      options: [
        "Because Edge runtimes use lightweight V8 sandboxes (Web Standards APIs) rather than full Node.js processes",
        "Because Edge servers don't have internet access",
        "Because Cloudflare prohibits TypeScript",
        "Because JavaScript is single-threaded"
      ],
      correctIndex: 0,
      explanation: "Edge workers run on stripped-down V8 isolates adhering to Web Standard APIs (Fetch, Request, Response, SubtleCrypto) for sub-millisecond cold starts."
    },
    codeSnippet: "export function middleware(request: NextRequest) {\n  const token = request.cookies.get('session');\n  if (!token && request.nextUrl.pathname.startsWith('/admin')) {\n    return NextResponse.redirect(new URL('/login', request.url));\n  }\n}",
    matchingSkill: "Cloudflare"
  },
  {
    id: "typescript-strict",
    label: "TypeScript Strict & Zod",
    category: "Frontend",
    x: 260,
    y: 410,
    importance: 2,
    summary: "Zero-any compile-time type safety paired with Zod runtime schema validation to eliminate null pointer bugs across network boundaries.",
    mentalModel: "Dual-layer armor: TypeScript checks your code while you write it; Zod checks unknown API JSON payload shapes when the code runs.",
    interactiveQuiz: {
      question: "What is the difference between TypeScript types and Zod schemas?",
      options: [
        "TypeScript types are erased at compile-time; Zod schemas validate actual data shapes at runtime in the browser/server",
        "Zod is only for CSS styling",
        "TypeScript cannot validate objects",
        "There is no difference"
      ],
      correctIndex: 0,
      explanation: "TypeScript types vanish when compiled to JavaScript. Zod runs real JavaScript validations against external API inputs to prevent runtime crashes."
    },
    codeSnippet: "import { z } from 'zod';\nexport const JobSchema = z.object({\n  title: z.string().min(3),\n  salary: z.number().positive(),\n});\ntype Job = z.infer<typeof JobSchema>;",
    matchingSkill: "TypeScript"
  },

  // ── Backend & Databases ──
  {
    id: "postgresql-pgvector",
    label: "PostgreSQL & pgvector",
    category: "Databases",
    x: 880,
    y: 530,
    importance: 3,
    summary: "The world's most advanced relational database extended with the pgvector extension for unified ACID relational data and vector similarity search.",
    mentalModel: "One single database engine for all your users, payments, and AI semantic vector embeddings—no separate sync pipelines needed.",
    interactiveQuiz: {
      question: "What is the primary advantage of storing vector embeddings in PostgreSQL (via pgvector) vs a standalone vector-only database?",
      options: [
        "PostgreSQL uses less RAM than any vector DB",
        "Atomic ACID transactions joining relational user/permission tables with vector queries in a single SQL statement",
        "pgvector is 10x faster than GPU clusters",
        "pgvector does not require SQL"
      ],
      correctIndex: 1,
      explanation: "With pgvector, you can filter by `WHERE organization_id = $1 AND is_public = true` in the exact same query that computes vector distances with zero data drift."
    },
    codeSnippet: "SELECT id, title, 1 - (embedding <=> $1) AS similarity\nFROM jobs\nWHERE is_active = true\nORDER BY embedding <=> $1\nLIMIT 10;",
    matchingSkill: "PostgreSQL"
  },
  {
    id: "drizzle-orm",
    label: "Drizzle ORM & Migrations",
    category: "Databases",
    x: 780,
    y: 630,
    importance: 2,
    summary: "TypeScript-first ORM with zero overhead, automatic schema migrations, and SQL-like composability without hidden N+1 query surprises.",
    mentalModel: "If SQL and TypeScript had a child: you write what looks like typed SQL, and get 100% autocompletion with zero bloat.",
    interactiveQuiz: {
      question: "Why does Drizzle ORM have significantly lower latency and smaller bundle size than Prisma?",
      options: [
        "Drizzle compiles to pure SQL strings without running an external C++ / Rust query engine binary process",
        "Drizzle stores everything in memory",
        "Drizzle does not support PostgreSQL",
        "Drizzle requires Node.js v24"
      ],
      correctIndex: 0,
      explanation: "Drizzle is a thin, zero-overhead TypeScript query builder with no heavy runtime engine, making it ideal for serverless and edge environments."
    },
    codeSnippet: "export const jobs = pgTable('jobs', {\n  id: uuid('id').defaultRandom().primaryKey(),\n  title: text('title').notNull(),\n  createdAt: timestamp('created_at').defaultNow().notNull()\n});",
    matchingSkill: "Drizzle ORM"
  },
  {
    id: "acid-transactions",
    label: "ACID Transactions & Locking",
    category: "Databases",
    x: 1040,
    y: 530,
    importance: 2,
    summary: "Atomicity, Consistency, Isolation, and Durability guarantees with row-level locks (FOR UPDATE) to prevent race conditions in financial and booking operations.",
    mentalModel: "The bank teller vault: all ledger updates either happen together completely, or roll back to the exact initial state if any error occurs.",
    interactiveQuiz: {
      question: "Which SQL clause prevents two simultaneous requests from debiting the same account balance concurrently?",
      options: [
        "SELECT * FROM accounts WHERE id = 1 FOR UPDATE",
        "SELECT * FROM accounts WHERE id = 1 WITH NO WAIT",
        "ORDER BY balance DESC",
        "GROUP BY id"
      ],
      correctIndex: 0,
      explanation: "`SELECT ... FOR UPDATE` acquires an exclusive row-level lock. Concurrent transactions attempting to read/update the same row must wait until the first commits."
    },
    codeSnippet: "await db.transaction(async (tx) => {\n  const [acc] = await tx.select().from(accounts).where(eq(accounts.id, id)).for('update');\n  if (acc.balance < amount) throw new Error('Insufficient funds');\n  await tx.update(accounts).set({ balance: acc.balance - amount }).where(eq(accounts.id, id));\n});",
    matchingSkill: "SQL"
  },
  {
    id: "b-tree-indexes",
    label: "B-Tree Indexes & Query Tuning",
    category: "Databases",
    x: 960,
    y: 640,
    importance: 2,
    summary: "Balanced tree indexing structure enabling logarithmic O(log N) lookups, range scans, and index-only scans, inspected via EXPLAIN ANALYZE.",
    mentalModel: "The alphabetized index at the back of a 1,000-page book: jump straight to 'Database' in 3 page turns instead of reading every page from page 1.",
    interactiveQuiz: {
      question: "What does a 'Seq Scan' in a PostgreSQL `EXPLAIN ANALYZE` output indicate?",
      options: [
        "The fastest possible query execution",
        "PostgreSQL had to scan every single row on disk because no suitable index was available",
        "A sequence generator was incremented",
        "The query used an SSL connection"
      ],
      correctIndex: 1,
      explanation: "A Sequential Scan reads every row from disk. On large tables, adding an index turns a slow 2000ms Seq Scan into a 2ms Index Scan."
    },
    codeSnippet: "-- Create composite index for user applications lookup\nCREATE INDEX idx_apps_candidate_status ON applications (candidate_id, status);",
    matchingSkill: "Database Design"
  },
  {
    id: "redis-caching",
    label: "Redis Caching & Data Structures",
    category: "Databases",
    x: 740,
    y: 750,
    importance: 2,
    summary: "In-memory key-value data store providing sub-millisecond lookups, TTL expirations, distributed locks (Redlock), and Pub/Sub messaging.",
    mentalModel: "Your desk sticky pad: keep the 5 documents you are actively working on right on your desk rather than walking to the basement filing cabinet every second.",
    interactiveQuiz: {
      question: "What is a 'Cache Stampede' (or thundering herd) and how can it be prevented?",
      options: [
        "When Redis runs out of memory and crashes",
        "When an expired high-traffic key causes hundreds of concurrent requests to hit the database simultaneously; prevented via distributed locks or probabilistic early recomputation",
        "When too many Redis servers are online",
        "When keys are named with emojis"
      ],
      correctIndex: 1,
      explanation: "When a popular cached key expires, concurrent requests all miss the cache and overwhelm the SQL database. Distributed locks ensure only one request recomputes."
    },
    codeSnippet: "// Cache-aside pattern in Node.js\nconst cached = await redis.get(cacheKey);\nif (cached) return JSON.parse(cached);\nconst data = await db.query(...);\nawait redis.set(cacheKey, JSON.stringify(data), 'EX', 300);",
    matchingSkill: "Redis"
  },
  {
    id: "rate-limiting",
    label: "Sliding-Window Rate Limiting",
    category: "Databases",
    x: 920,
    y: 780,
    importance: 1,
    summary: "Protecting public endpoints against DDoS, scrapers, and credential stuffing using Redis sorted sets (ZADD) to track request timestamps within sliding windows.",
    mentalModel: "A nightclub bouncer with a stopwatch: only lets 10 people in during any rolling 60-second window, regardless of whether they arrive at the start or end.",
    interactiveQuiz: {
      question: "Why is a Sliding Window Log superior to a Fixed Window Counter for rate limiting?",
      options: [
        "It uses zero memory",
        "It prevents traffic bursts from double-dipping at the boundary between two adjacent fixed windows (e.g. 59s and 61s)",
        "It works without Redis",
        "It only counts failed requests"
      ],
      correctIndex: 1,
      explanation: "In a fixed 1-minute window, a user could send 100 requests at 00:59 and 100 at 01:01 (200 in 2 seconds). Sliding windows evaluate timestamps continuously."
    },
    codeSnippet: "// Redis sliding window rate limiter\nconst now = Date.now();\nconst windowStart = now - 60000;\nawait redis.zremrangebyscore(key, 0, windowStart);\nconst count = await redis.zcard(key);\nif (count >= limit) throw new Error('Too many requests');\nawait redis.zadd(key, now, `${now}-${Math.random()}`);",
    matchingSkill: "Security"
  },
  {
    id: "message-queues",
    label: "Message Queues & Background Workers",
    category: "Databases",
    x: 560,
    y: 780,
    importance: 2,
    summary: "Decoupling slow transactional tasks (PDF resume parsing, automated emails, AI embeddings) from synchronous HTTP request/response loops using BullMQ or Kafka.",
    mentalModel: "The restaurant order ticket: the waiter places your order ticket on the kitchen carousel immediately and gives you your water, while chefs cook food in the background.",
    interactiveQuiz: {
      question: "Why should PDF resume text extraction and embedding generation be moved to a background worker queue?",
      options: [
        "Because browsers do not support PDFs",
        "To prevent HTTP request timeouts, ensure automatic retries on failure, and avoid blocking the web server's main event loop",
        "Because background jobs are free of CPU cost",
        "To hide the candidate's resume"
      ],
      correctIndex: 1,
      explanation: "AI inference and PDF parsing can take 5-15 seconds. Background queues return an immediate 202 Accepted and notify the client when processing completes."
    },
    codeSnippet: "const queue = new Queue('resume-parser');\nawait queue.add('parse', { resumeId, fileUrl }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });",
    matchingSkill: "Kafka"
  },

  // ── Systems, Cloud & DevOps ──
  {
    id: "docker-containers",
    label: "Docker & Multi-Stage Builds",
    category: "Systems & Cloud",
    x: 360,
    y: 750,
    importance: 3,
    summary: "Packaging applications into isolated Linux containers with multi-stage Dockerfiles that strip build toolchains (compilers, npm cache) from production images.",
    mentalModel: "Standardized shipping containers: it doesn't matter what is inside or what ship carries it; it always docks and runs identically everywhere.",
    interactiveQuiz: {
      question: "Why are Multi-Stage Docker builds standard practice in production software engineering?",
      options: [
        "They make containers look cooler",
        "They drastically reduce final image size and attack surface by leaving build tools and dev dependencies out of the runtime container",
        "They allow running Windows apps on Linux",
        "They eliminate the need for Linux"
      ],
      correctIndex: 1,
      explanation: "A builder stage installs compilers and runs `pnpm build`. The runner stage copies only the static `.next/standalone` output, reducing image size from 1.5GB to 80MB."
    },
    codeSnippet: "FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY . .\nRUN pnpm build\n\nFROM node:20-alpine AS runner\nCOPY --from=builder /app/.next/standalone ./\nCMD [\"node\", \"server.js\"]",
    matchingSkill: "Docker"
  },
  {
    id: "kubernetes",
    label: "Kubernetes & Pod Orchestration",
    category: "Systems & Cloud",
    x: 180,
    y: 820,
    importance: 3,
    summary: "Automated container deployment, horizontal scaling, self-healing restarts, and service discovery across fleets of bare-metal or cloud VMs.",
    mentalModel: "The ship captain with an automated fleet: if one ship engine fails, it launches a replacement ship instantly and steers traffic away smoothly.",
    interactiveQuiz: {
      question: "What is the role of the Kubernetes Kubelet?",
      options: [
        "It acts as the primary web browser",
        "An agent that runs on each node in the cluster, ensuring that containers described in PodSpecs are running and healthy",
        "It stores the database backups on S3",
        "It compiles the source code"
      ],
      correctIndex: 1,
      explanation: "The Kubelet runs on every worker node. It registers the node with the API server and continually checks container health and restart policies."
    },
    codeSnippet: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api-service\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n      - name: api\n        image: registry/api:v1.2",
    matchingSkill: "Kubernetes"
  },
  {
    id: "ingress-networking",
    label: "Ingress & Reverse Proxies",
    category: "Systems & Cloud",
    x: 80,
    y: 930,
    importance: 2,
    summary: "Managing inbound HTTP/HTTPS routing, SSL/TLS termination, and path-based routing into internal cluster services via Nginx or Envoy.",
    mentalModel: "The airport switchboard and reception desk directing each passenger to terminal A, B, or C based on their ticket destination.",
    interactiveQuiz: {
      question: "What is the primary difference between a ClusterIP service and an Ingress in Kubernetes?",
      options: [
        "ClusterIP is only reachable internally inside the cluster; Ingress exposes HTTP/HTTPS routes from outside the cluster to internal services",
        "Ingress can only route database connections",
        "ClusterIP is deprecated",
        "Ingress requires hardware cables"
      ],
      correctIndex: 0,
      explanation: "ClusterIP isolates pods behind a private internal virtual IP. Ingress provides the external HTTP proxy, SSL termination, and host/path routing."
    },
    codeSnippet: "apiVersion: networking.k8s.io/v1\nkind: Ingress\nspec:\n  rules:\n  - host: rolenest.in\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: web-service\n            port:\n              number: 3000",
    matchingSkill: "Nginx"
  },
  {
    id: "github-actions-cicd",
    label: "GitHub Actions CI/CD",
    category: "Systems & Cloud",
    x: 360,
    y: 920,
    importance: 2,
    summary: "Automated Continuous Integration and Continuous Deployment pipelines that run linting, unit/E2E test suites, Docker builds, and zero-downtime SSH deployments.",
    mentalModel: "The automated factory assembly line: every pull request is automatically tested, benchmarked, scanned for vulnerabilities, and shipped to production on merge.",
    interactiveQuiz: {
      question: "In a production GitHub Actions CI pipeline, why should dependencies be installed with `pnpm install --frozen-lockfile`?",
      options: [
        "To save electricity",
        "To ensure identical dependency versions and fail the build if `pnpm-lock.yaml` is out of sync with `package.json`",
        "To install packages on Windows only",
        "To bypass package tests"
      ],
      correctIndex: 1,
      explanation: "`--frozen-lockfile` guarantees that the CI environment installs the exact verified dependency tree as the developer, preventing sneaky upstream bug injection."
    },
    codeSnippet: "name: Deploy Production\non:\n  push:\n    branches: [master]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n    - run: ssh user@server 'cd /opt/app && git pull && pnpm build && pm2 restart app'",
    matchingSkill: "CI/CD"
  },
  {
    id: "cloud-vms",
    label: "Cloud Architecture & Zero-Cost Tier",
    category: "Systems & Cloud",
    x: 540,
    y: 920,
    importance: 2,
    summary: "Architecting reliable production systems on Oracle Cloud Always Free ARM Ampere instances (4 cores, 24GB RAM) with Cloudflare CDN fronting.",
    mentalModel: "Operating a high-performance sports car with zero fuel cost by understanding and leveraging generous enterprise cloud tier limits strategically.",
    interactiveQuiz: {
      question: "What security layer should always front a public Cloud VM running web services?",
      options: [
        "No security layer is needed",
        "A Cloudflare / reverse proxy layer with strict firewall ingress rules limiting origin access to verified proxy IPs and SSH key auth",
        "Allowing all ports (0-65535) open to the internet",
        "Disabling passwords and SSH keys"
      ],
      correctIndex: 1,
      explanation: "Restricting origin firewall rules to CDN proxy IPs prevents direct origin IP scanning, DDoS attacks, and unauthorized port exploitation."
    },
    codeSnippet: "# Ingress Security List:\n# Allow TCP 22 from bastion IP\n# Allow TCP 80/443 from Cloudflare IP ranges\n# Drop all other inbound traffic",
    matchingSkill: "Cloud Architecture"
  }
];
