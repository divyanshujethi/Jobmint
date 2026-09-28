export interface BootcampDayLesson {
  dayNumber: number;
  trackId: string;
  subdomain: string;
  title: string;
  estimatedHours: number;
  overview: string;
  lectureNotes: string[];
  pdfMaterial: {
    title: string;
    downloadFilename: string;
    topics: string[];
    pages: number;
  };
  codingProblem: {
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    description: string;
    inputFormat: string;
    outputFormat: string;
    sampleInput: string;
    sampleOutput: string;
    starterCode: {
      python: string;
      javascript: string;
      java: string;
    };
    testCases: { input: string; expectedOutput: string }[];
  };
  dailyAssignment: {
    title: string;
    taskDescription: string;
    stepsToComplete: string[];
    repoDeliverable: string;
    suggestedCommitMessage: string;
  };
}

// 1. AI & Machine Learning Engineering (Detailed 28-day breakdown)
export const AIML_CURRICULUM_DAYS: BootcampDayLesson[] = [
  {
    dayNumber: 1,
    trackId: "ai-ml",
    subdomain: "Python Foundations & Vector Math",
    title: "High-Performance Python & Vector Math Foundations",
    estimatedHours: 6,
    overview:
      "Deep dive into modern Python 3.12 memory model, vectorization over loops, NumPy array internal memory layouts (strides, contiguous memory), and implementing vector dot products from first principles.",
    lectureNotes: [
      "CPython memory allocator (PyMalloc) vs NumPy C-contiguous memory buffers.",
      "The cost of Python dynamic dispatch and GIL limitations in scientific workflows.",
      "Vector dot product, matrix transposition, and broadcasting mechanics.",
      "Optimizing cosine similarity calculations using vectorized SIMD primitives.",
    ],
    pdfMaterial: {
      title: "Module 1: Vector Math & Python Performance Engineering Guide",
      downloadFilename: "AI_ML_Day01_Vector_Math.pdf",
      topics: ["C-Contiguous Memory", "NumPy Strides", "SIMD Vectorization", "Cosine Distance"],
      pages: 18,
    },
    codingProblem: {
      title: "Vector Cosine Similarity Engine",
      difficulty: "EASY",
      description:
        "Implement a function `cosine_similarity(vec_a, vec_b)` that calculates the cosine similarity between two 1D vectors without importing third-party libraries. Return value rounded to 4 decimals.",
      inputFormat: "Two comma-separated float lists, e.g. '1.0, 2.0, 3.0' and '4.0, 5.0, 6.0'",
      outputFormat: "A float string rounded to 4 decimals, e.g. '0.9746'",
      sampleInput: "1.0, 2.0, 3.0 | 4.0, 5.0, 6.0",
      sampleOutput: "0.9746",
      starterCode: {
        python: `import math

def solution(input_str: str) -> str:
    # Format: "1.0, 2.0, 3.0 | 4.0, 5.0, 6.0"
    part1, part2 = input_str.split("|")
    a = [float(x.strip()) for x in part1.split(",") if x.strip()]
    b = [float(x.strip()) for x in part2.split(",") if x.strip()]
    
    # Calculate dot product and norms
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    
    if norm_a == 0 or norm_b == 0:
        return "0.0000"
    
    sim = dot / (norm_a * norm_b)
    return f"{sim:.4f}"
`,
        javascript: `function solution(inputStr) {
  const [part1, part2] = inputStr.split("|");
  const a = part1.split(",").map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
  const b = part2.split(",").map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
  
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return "0.0000";
  const sim = dot / (Math.sqrt(normA) * Math.sqrt(normB));
  return sim.toFixed(4);
}
`,
        java: `public class Solution {
    public static String solve(String inputStr) {
        String[] parts = inputStr.split("\\\\|");
        String[] sA = parts[0].trim().split(",");
        String[] sB = parts[1].trim().split(",");
        double dot = 0, nA = 0, nB = 0;
        for (int i = 0; i < sA.length; i++) {
            double a = Double.parseDouble(sA[i].trim());
            double b = Double.parseDouble(sB[i].trim());
            dot += a * b;
            nA += a * a;
            nB += b * b;
        }
        if (nA == 0 || nB == 0) return "0.0000";
        return String.format("%.4f", dot / (Math.sqrt(nA) * Math.sqrt(nB)));
    }
}
`,
      },
      testCases: [
        { input: "1.0, 2.0, 3.0 | 4.0, 5.0, 6.0", expectedOutput: "0.9746" },
        { input: "1.0, 0.0 | 0.0, 1.0", expectedOutput: "0.0000" },
        { input: "3.0, 4.0 | 3.0, 4.0", expectedOutput: "1.0000" },
      ],
    },
    dailyAssignment: {
      title: "Build Pure NumPy Vector Embedding Indexer",
      taskDescription:
        "Initialize a new repository on your GitHub account named `rolenest-aiml-internship`. Create directory `day-01/`. Implement a pure NumPy cosine index that loads 1,000 synthetic 128-dimensional vectors and benchmarks search latency using vectorized operations vs naive Python for-loops.",
      stepsToComplete: [
        "Create GitHub repo `rolenest-aiml-internship` (or your existing portfolio repo).",
        "Create `day-01/vector_index.py` with matrix multiplication benchmark.",
        "Add a `README.md` in `day-01/` explaining your timing results (e.g. 50x speedup).",
        "Commit, push to GitHub, and submit your commit URL below.",
      ],
      repoDeliverable: "day-01/vector_index.py and benchmark output log",
      suggestedCommitMessage: "feat(day-01): pure numpy vector cosine benchmark engine",
    },
  },
  {
    dayNumber: 2,
    trackId: "ai-ml",
    subdomain: "NumPy & Data Manipulation",
    title: "Tensor Manipulations, Strides & Matrix Factorization",
    estimatedHours: 6,
    overview:
      "Deep understanding of n-dimensional array tensor shapes, reshaping, broadcasting rules, SVD (Singular Value Decomposition), and PCA dimensionality reduction.",
    lectureNotes: [
      "NumPy broadcasting rules: aligning dimensions from right to left.",
      "Singular Value Decomposition: decomposing A into U, Sigma, and V^T.",
      "Eigenvalues and eigenvectors for latent semantic analysis.",
      "Preventing out-of-memory errors with chunked NumPy memmap buffers.",
    ],
    pdfMaterial: {
      title: "Module 2: Dimensionality Reduction & Matrix Decomposition",
      downloadFilename: "AI_ML_Day02_Matrix_Decomposition.pdf",
      topics: ["Broadcasting Rules", "SVD", "PCA", "Memory Mapped Tensors"],
      pages: 22,
    },
    codingProblem: {
      title: "2D Matrix Normalization & Mean Centering",
      difficulty: "EASY",
      description:
        "Given a comma-separated list representing rows of a 2D matrix (rows separated by ';'), normalize each column by subtracting its column mean. Return rounded to 2 decimals.",
      inputFormat: "Row-separated floats: '1.0, 2.0; 3.0, 4.0'",
      outputFormat: "Normalized rows separated by ';': '-1.00, -1.00; 1.00, 1.00'",
      sampleInput: "1.0, 2.0; 3.0, 4.0",
      sampleOutput: "-1.00, -1.00; 1.00, 1.00",
      starterCode: {
        python: `def solution(input_str: str) -> str:
    rows = [list(map(float, r.split(","))) for r in input_str.split(";")]
    n_rows = len(rows)
    n_cols = len(rows[0])
    
    col_means = [sum(rows[r][c] for r in range(n_rows)) / n_rows for c in range(n_cols)]
    
    out_rows = []
    for r in range(n_rows):
        normalized = [f"{rows[r][c] - col_means[c]:.2f}" for c in range(n_cols)]
        out_rows.append(", ".join(normalized))
        
    return "; ".join(out_rows)
`,
        javascript: `function solution(inputStr) {
  const rows = inputStr.split(";").map(r => r.split(",").map(Number));
  const nRows = rows.length;
  const nCols = rows[0].length;
  const colMeans = Array(nCols).fill(0);
  for (let c = 0; c < nCols; c++) {
    for (let r = 0; r < nRows; r++) colMeans[c] += rows[r][c];
    colMeans[c] /= nRows;
  }
  return rows.map(r => r.map((val, c) => (val - colMeans[c]).toFixed(2)).join(", ")).join("; ");
}
`,
        java: `public class Solution {
    public static String solve(String inputStr) {
        String[] rStrs = inputStr.split(";");
        int nRows = rStrs.length;
        String[] firstCols = rStrs[0].split(",");
        int nCols = firstCols.length;
        double[][] m = new double[nRows][nCols];
        double[] means = new double[nCols];
        for (int r = 0; r < nRows; r++) {
            String[] cols = rStrs[r].split(",");
            for (int c = 0; c < nCols; c++) {
                m[r][c] = Double.parseDouble(cols[c].trim());
                means[c] += m[r][c];
            }
        }
        for (int c = 0; c < nCols; c++) means[c] /= nRows;
        StringBuilder sb = new StringBuilder();
        for (int r = 0; r < nRows; r++) {
            for (int c = 0; c < nCols; c++) {
                sb.append(String.format("%.2f", m[r][c] - means[c]));
                if (c < nCols - 1) sb.append(", ");
            }
            if (r < nRows - 1) sb.append("; ");
        }
        return sb.toString();
    }
}
`,
      },
      testCases: [
        { input: "1.0, 2.0; 3.0, 4.0", expectedOutput: "-1.00, -1.00; 1.00, 1.00" },
        { input: "10.0; 20.0; 30.0", expectedOutput: "-10.00; 0.00; 10.00" },
      ],
    },
    dailyAssignment: {
      title: "Implement PCA Compression from Scratch",
      taskDescription:
        "Inside `day-02/`, write a script `pca_compressor.py` that loads high-dimensional vector embeddings, computes the covariance matrix, extracts top 16 principal components using eigenvalue decomposition, and projects the vectors into compressed latent space.",
      stepsToComplete: [
        "Create `day-02/pca_compressor.py`.",
        "Implement covariance computation and top-k projection.",
        "Write unit tests verifying reconstruction error under 5%.",
        "Commit and push to GitHub.",
      ],
      repoDeliverable: "day-02/pca_compressor.py with test report",
      suggestedCommitMessage: "feat(day-02): standalone PCA vector dimensionality compressor",
    },
  },
  {
    dayNumber: 3,
    trackId: "ai-ml",
    subdomain: "Neural Networks & Autograd",
    title: "Reverse-Mode Automatic Differentiation & Backprop",
    estimatedHours: 6,
    overview:
      "Understand computational DAGs (Directed Acyclic Graphs), gradients, chain rule, and building an autograd scalar engine inspired by Andrej Karpathy's Micrograd.",
    lectureNotes: [
      "Forward pass vs backward pass in computational graphs.",
      "Chain rule accumulation (`grad += out.grad * local_derivative`).",
      "Topological sort of graph nodes before backpropagation.",
      "Common activation derivatives: ReLU, Sigmoid, GELU, and Tanh.",
    ],
    pdfMaterial: {
      title: "Module 3: Reverse-Mode Autograd Engine Architecture",
      downloadFilename: "AI_ML_Day03_Autograd_Engine.pdf",
      topics: ["DAG Computation Graph", "Topological Sort", "Chain Rule", "Activation Functions"],
      pages: 26,
    },
    codingProblem: {
      title: "Sigmoid & Derivative Evaluator",
      difficulty: "EASY",
      description:
        "Given an input float `x`, return the sigmoid value `σ(x) = 1 / (1 + e^-x)` and its gradient `d/dx σ(x) = σ(x) * (1 - σ(x))`, separated by '|', formatted to 4 decimals.",
      inputFormat: "Float string, e.g. '0.0'",
      outputFormat: "'0.5000 | 0.2500'",
      sampleInput: "0.0",
      sampleOutput: "0.5000 | 0.2500",
      starterCode: {
        python: `import math

def solution(input_str: str) -> str:
    x = float(input_str.strip())
    sig = 1.0 / (1.0 + math.exp(-x))
    grad = sig * (1.0 - sig)
    return f"{sig:.4f} | {grad:.4f}"
`,
        javascript: `function solution(inputStr) {
  const x = parseFloat(inputStr.trim());
  const sig = 1 / (1 + Math.exp(-x));
  const grad = sig * (1 - sig);
  return sig.toFixed(4) + " | " + grad.toFixed(4);
}
`,
        java: `public class Solution {
    public static String solve(String inputStr) {
        double x = Double.parseDouble(inputStr.trim());
        double sig = 1.0 / (1.0 + Math.exp(-x));
        double grad = sig * (1.0 - sig);
        return String.format("%.4f | %.4f", sig, grad);
    }
}
`,
      },
      testCases: [
        { input: "0.0", expectedOutput: "0.5000 | 0.2500" },
        { input: "2.0", expectedOutput: "0.8808 | 0.1050" },
      ],
    },
    dailyAssignment: {
      title: "Build Micro-Autograd Scalar Engine",
      taskDescription:
        "Create `day-03/engine.py` defining a `Value` class with `data`, `grad`, and backpropagation hooks for `+`, `*`, `relu()`, and `pow()`. Train a 2-layer MLP on XOR dataset for 100 epochs.",
      stepsToComplete: [
        "Implement `Value` node class with topological backward traversal.",
        "Construct 2-input XOR dataset.",
        "Demonstrate loss decreasing from 0.25 to < 0.01.",
        "Commit `day-03/` and push to GitHub.",
      ],
      repoDeliverable: "day-03/engine.py and xor_demo.py",
      suggestedCommitMessage: "feat(day-03): pure python autograd engine and XOR training",
    },
  },
  {
    dayNumber: 4,
    trackId: "ai-ml",
    subdomain: "PyTorch Deep Learning",
    title: "PyTorch Tensor Internals, DataLoader & CUDA Acceleration",
    estimatedHours: 6,
    overview:
      "Transition from scratch autograd to production PyTorch. Understand GPU tensors, memory pinned buffers, multi-threaded `torch.utils.data.DataLoader`, and writing clean `nn.Module` classes.",
    lectureNotes: [
      "`torch.Tensor` strides, views, and storage offsets.",
      "Non-blocking GPU copies with `pin_memory=True` and `non_blocking=True`.",
      "Subclassing `torch.nn.Module`: parameters, buffers, and hooks.",
      "AdamW optimizer mechanics: weight decay vs L2 regularization.",
    ],
    pdfMaterial: {
      title: "Module 4: Production PyTorch Deep Learning Pipelines",
      downloadFilename: "AI_ML_Day04_PyTorch_Deep_Learning.pdf",
      topics: ["PyTorch Stride Offsets", "DataLoader Pinning", "AdamW", "Loss Functions"],
      pages: 24,
    },
    codingProblem: {
      title: "Cross-Entropy Loss Calculator",
      difficulty: "MEDIUM",
      description:
        "Given predicted logits comma-separated and the ground-truth target index (0-indexed), separated by '|', calculate the Softmax probabilities and the negative log-likelihood Cross-Entropy loss. Return rounded to 4 decimals.",
      inputFormat: "Logits | TargetIndex, e.g. '2.0, 1.0, 0.1 | 0'",
      outputFormat: "Loss float formatted to 4 decimals, e.g. '0.4076'",
      sampleInput: "2.0, 1.0, 0.1 | 0",
      sampleOutput: "0.4076",
      starterCode: {
        python: `import math

def solution(input_str: str) -> str:
    logits_str, target_str = input_str.split("|")
    logits = [float(x.strip()) for x in logits_str.split(",")]
    target_idx = int(target_str.strip())
    
    # Stable softmax: subtract max logit
    max_logit = max(logits)
    exp_logits = [math.exp(x - max_logit) for x in logits]
    sum_exp = sum(exp_logits)
    
    prob_target = exp_logits[target_idx] / sum_exp
    loss = -math.log(prob_target)
    return f"{loss:.4f}"
`,
        javascript: `function solution(inputStr) {
  const [logitsStr, targetStr] = inputStr.split("|");
  const logits = logitsStr.split(",").map(Number);
  const targetIdx = parseInt(targetStr.trim(), 10);
  
  const maxLogit = Math.max(...logits);
  const expLogits = logits.map(x => Math.exp(x - maxLogit));
  const sumExp = expLogits.reduce((a, b) => a + b, 0);
  const prob = expLogits[targetIdx] / sumExp;
  const loss = -Math.log(prob);
  return loss.toFixed(4);
}
`,
        java: `public class Solution {
    public static String solve(String inputStr) {
        String[] parts = inputStr.split("\\\\|");
        String[] lStrs = parts[0].split(",");
        int targetIdx = Integer.parseInt(parts[1].trim());
        double[] logits = new double[lStrs.length];
        double maxL = -Double.MAX_VALUE;
        for (int i = 0; i < logits.length; i++) {
            logits[i] = Double.parseDouble(lStrs[i].trim());
            if (logits[i] > maxL) maxL = logits[i];
        }
        double sumExp = 0;
        double[] exps = new double[logits.length];
        for (int i = 0; i < logits.length; i++) {
            exps[i] = Math.exp(logits[i] - maxL);
            sumExp += exps[i];
        }
        double loss = -Math.log(exps[targetIdx] / sumExp);
        return String.format("%.4f", loss);
    }
}
`,
      },
      testCases: [
        { input: "2.0, 1.0, 0.1 | 0", expectedOutput: "0.4076" },
        { input: "0.5, 2.5 | 1", expectedOutput: "0.1269" },
      ],
    },
    dailyAssignment: {
      title: "PyTorch Custom Dataset & Training Pipeline",
      taskDescription:
        "Build a robust PyTorch classifier in `day-04/model.py` with custom `Dataset` class, learning rate scheduler (CosineAnnealingLR), checkpoint saving/restoration, and validation accuracy metrics.",
      stepsToComplete: [
        "Implement `CustomDataset` handling image/tabular arrays.",
        "Implement training loop with gradient clipping.",
        "Export model weights to `checkpoints/best_model.pt`.",
        "Push commit to GitHub and record commit hash.",
      ],
      repoDeliverable: "day-04/model.py with training metrics log",
      suggestedCommitMessage: "feat(day-04): PyTorch training loop with checkpointing",
    },
  },
  {
    dayNumber: 5,
    trackId: "ai-ml",
    subdomain: "Transformers & Attention Mechanism",
    title: "Scaled Dot-Product Self-Attention & Multi-Head Projections",
    estimatedHours: 6,
    overview:
      "Master the Transformer architecture: Query, Key, Value projections, scaled dot-product attention equation, causal masking, and positional embeddings.",
    lectureNotes: [
      "Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V formula breakdown.",
      "Why scale by sqrt(d_k)? Mitigating vanishing gradients in Softmax.",
      "Multi-head attention: projecting representations into subspaces.",
      "Rotary Positional Embeddings (RoPE) vs sinusoidal embeddings.",
    ],
    pdfMaterial: {
      title: "Module 5: Transformer Attention Mathematics & PyTorch Code",
      downloadFilename: "AI_ML_Day05_Transformers_Attention.pdf",
      topics: ["Self-Attention", "Multi-Head Attention", "RoPE", "Causal Masking"],
      pages: 28,
    },
    codingProblem: {
      title: "Scaled Dot-Product Attention Weights",
      difficulty: "MEDIUM",
      description:
        "Given Q and K (both 1x2 vectors) and dimension d_k=2, calculate the attention score matrix: `score = (Q * K^T) / sqrt(d_k)`. Return score formatted to 4 decimals.",
      inputFormat: "Q vector | K vector, e.g. '1.0, 2.0 | 3.0, 4.0'",
      outputFormat: "Float string, e.g. '7.7782'",
      sampleInput: "1.0, 2.0 | 3.0, 4.0",
      sampleOutput: "7.7782",
      starterCode: {
        python: `import math

def solution(input_str: str) -> str:
    q_str, k_str = input_str.split("|")
    q = [float(x.strip()) for x in q_str.split(",")]
    k = [float(x.strip()) for x in k_str.split(",")]
    
    dot = sum(a * b for a, b in zip(q, k))
    d_k = len(q)
    scaled = dot / math.sqrt(d_k)
    return f"{scaled:.4f}"
`,
        javascript: `function solution(inputStr) {
  const [qStr, kStr] = inputStr.split("|");
  const q = qStr.split(",").map(Number);
  const k = kStr.split(",").map(Number);
  const dot = q.reduce((acc, val, i) => acc + val * k[i], 0);
  const scaled = dot / Math.sqrt(q.length);
  return scaled.toFixed(4);
}
`,
        java: `public class Solution {
    public static String solve(String inputStr) {
        String[] parts = inputStr.split("\\\\|");
        String[] qS = parts[0].split(",");
        String[] kS = parts[1].split(",");
        double dot = 0;
        for (int i = 0; i < qS.length; i++) {
            dot += Double.parseDouble(qS[i].trim()) * Double.parseDouble(kS[i].trim());
        }
        double scaled = dot / Math.sqrt(qS.length);
        return String.format("%.4f", scaled);
    }
}
`,
      },
      testCases: [
        { input: "1.0, 2.0 | 3.0, 4.0", expectedOutput: "7.7782" },
        { input: "1.0, 0.0 | 0.0, 1.0", expectedOutput: "0.0000" },
      ],
    },
    dailyAssignment: {
      title: "Implement Multi-Head Attention Module",
      taskDescription:
        "In `day-05/attention.py`, implement an `nn.Module` for `MultiHeadAttention(d_model=256, num_heads=8)` including QKV projection matrices, scaled dot-product attention with causal mask, and projection dropout.",
      stepsToComplete: [
        "Create `day-05/attention.py`.",
        "Implement forward pass with causal triangular mask.",
        "Verify output shape matches input tensor shape `(B, T, C)`.",
        "Push commit to GitHub.",
      ],
      repoDeliverable: "day-05/attention.py with unit test verification",
      suggestedCommitMessage: "feat(day-05): multi-head causal attention module in PyTorch",
    },
  },
  {
    dayNumber: 6,
    trackId: "ai-ml",
    subdomain: "Vector Databases & Embeddings",
    title: "Semantic Embeddings & Approximate Nearest Neighbors (HNSW)",
    estimatedHours: 6,
    overview:
      "Understand high-dimensional vector spaces, text embedding generation via SentenceTransformers, vector indexing algorithms (Flat, IVF-PQ, HNSW), and trade-offs between recall and latency.",
    lectureNotes: [
      "How dense vector embeddings encode semantic similarity.",
      "Hierarchical Navigable Small World (HNSW) graphs: skip-list inspired search.",
      "Inverted File with Product Quantization (IVF-PQ) for compressing vectors.",
      "Connecting to vector stores: ChromaDB, Pinecone, and pgvector in PostgreSQL.",
    ],
    pdfMaterial: {
      title: "Module 6: Vector Database Architecture & HNSW Indexing",
      downloadFilename: "AI_ML_Day06_Vector_Databases_HNSW.pdf",
      topics: ["Dense Embeddings", "HNSW Graphs", "Product Quantization", "pgvector"],
      pages: 25,
    },
    codingProblem: {
      title: "Top-K Euclidean Nearest Neighbor Selector",
      difficulty: "MEDIUM",
      description:
        "Given a query vector and a list of candidate vectors separated by ';', find the index (0-indexed) of the closest candidate vector using Euclidean distance. Input format: 'query | c1; c2; c3'.",
      inputFormat: "Query vector | Candidate vectors, e.g. '1.0, 1.0 | 5.0, 5.0; 1.2, 0.9; 10.0, 10.0'",
      outputFormat: "Integer index string, e.g. '1'",
      sampleInput: "1.0, 1.0 | 5.0, 5.0; 1.2, 0.9; 10.0, 10.0",
      sampleOutput: "1",
      starterCode: {
        python: `import math

def solution(input_str: str) -> str:
    query_str, cands_str = input_str.split("|")
    q = [float(x.strip()) for x in query_str.split(",")]
    candidates = [[float(x.strip()) for x in cand.split(",")] for cand in cands_str.split(";")]
    
    best_idx = -1
    best_dist = float("inf")
    for i, c in enumerate(candidates):
        dist = math.sqrt(sum((a - b) ** 2 for a, b in zip(q, c)))
        if dist < best_dist:
            best_dist = dist
            best_idx = i
            
    return str(best_idx)
`,
        javascript: `function solution(inputStr) {
  const [qStr, cStr] = inputStr.split("|");
  const q = qStr.split(",").map(Number);
  const candidates = cStr.split(";").map(row => row.split(",").map(Number));
  
  let bestIdx = -1, bestDist = Infinity;
  candidates.forEach((c, idx) => {
    const dist = Math.sqrt(q.reduce((acc, val, i) => acc + Math.pow(val - c[i], 2), 0));
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = idx;
    }
  });
  return String(bestIdx);
}
`,
        java: `public class Solution {
    public static String solve(String inputStr) {
        String[] parts = inputStr.split("\\\\|");
        String[] qS = parts[0].split(",");
        double[] q = new double[qS.length];
        for (int i = 0; i < q.length; i++) q[i] = Double.parseDouble(qS[i].trim());
        
        String[] candRows = parts[1].split(";");
        int bestIdx = -1;
        double bestDist = Double.MAX_VALUE;
        for (int i = 0; i < candRows.length; i++) {
            String[] cS = candRows[i].split(",");
            double distSq = 0;
            for (int j = 0; j < q.length; j++) {
                double diff = q[j] - Double.parseDouble(cS[j].trim());
                distSq += diff * diff;
            }
            if (distSq < bestDist) {
                bestDist = distSq;
                bestIdx = i;
            }
        }
        return String.valueOf(bestIdx);
    }
}
`,
      },
      testCases: [
        { input: "1.0, 1.0 | 5.0, 5.0; 1.2, 0.9; 10.0, 10.0", expectedOutput: "1" },
        { input: "0.0, 0.0 | 3.0, 4.0; 1.0, 1.0", expectedOutput: "1" },
      ],
    },
    dailyAssignment: {
      title: "Spin Up Local Vector Store with ChromaDB / pgvector",
      taskDescription:
        "Create `day-06/vector_store.py` that ingests 50 technical documentation markdown files, creates embeddings using an open-weights HuggingFace model, persists to ChromaDB or SQLite/pgvector, and performs top-3 semantic search queries.",
      stepsToComplete: [
        "Implement document chunking with overlap (512 tokens, 50 token overlap).",
        "Generate embeddings and store vector metadata.",
        "Perform top-3 retrieval with cosine similarity scoring.",
        "Commit and push to your GitHub repo.",
      ],
      repoDeliverable: "day-06/vector_store.py with test query transcript",
      suggestedCommitMessage: "feat(day-06): local vector store with semantic retrieval",
    },
  },
  {
    dayNumber: 7,
    trackId: "ai-ml",
    subdomain: "RAG & Information Retrieval",
    title: "Retrieval-Augmented Generation (RAG) Architecture",
    estimatedHours: 6,
    overview:
      "Build a complete enterprise RAG pipeline: document ingestion, token-aware chunking, hybrid keyword (BM25) + dense vector search, and synthesizing grounded responses.",
    lectureNotes: [
      "Naive RAG vs Advanced RAG: query rewriting, routing, and re-ranking.",
      "Hybrid Search: Combining BM25 sparse lexical search with dense vector similarity.",
      "Cross-encoder re-ranking (Cohere / BGE Reranker) for precision filtering.",
      "Hallucination detection and ground truth citation injection.",
    ],
    pdfMaterial: {
      title: "Module 7: Enterprise RAG Systems Design & Re-Ranking Guide",
      downloadFilename: "AI_ML_Day07_Enterprise_RAG_Design.pdf",
      topics: ["Hybrid Search", "BM25", "Cross-Encoder Re-Ranking", "Context Window Management"],
      pages: 27,
    },
    codingProblem: {
      title: "Context Window Token Budget Truncator",
      difficulty: "EASY",
      description:
        "Given maximum token limit N and a list of retrieved chunk strings separated by '###', include as many whole chunks as fit within N words (whitespace-separated). Return combined string separated by ' '.",
      inputFormat: "MaxWords | Chunk1###Chunk2###Chunk3, e.g. '5 | Hello world###this is an AI course###test'",
      outputFormat: "Selected combined text, e.g. 'Hello world'",
      sampleInput: "5 | Hello world###this is an AI course###test",
      sampleOutput: "Hello world",
      starterCode: {
        python: `def solution(input_str: str) -> str:
    limit_str, chunks_str = input_str.split("|")
    limit = int(limit_str.strip())
    chunks = [c.strip() for c in chunks_str.split("###")]
    
    selected = []
    current_words = 0
    for chunk in chunks:
        words = chunk.split()
        if current_words + len(words) <= limit:
            selected.append(chunk)
            current_words += len(words)
        else:
            break
            
    return " ".join(selected)
`,
        javascript: `function solution(inputStr) {
  const [limitStr, chunksStr] = inputStr.split("|");
  const limit = parseInt(limitStr.trim(), 10);
  const chunks = chunksStr.split("###").map(c => c.trim());
  
  let currentWords = 0;
  const selected = [];
  for (const chunk of chunks) {
    const words = chunk.split(/\\s+/).filter(Boolean);
    if (currentWords + words.length <= limit) {
      selected.push(chunk);
      currentWords += words.length;
    } else {
      break;
    }
  }
  return selected.join(" ");
}
`,
        java: `public class Solution {
    public static String solve(String inputStr) {
        String[] parts = inputStr.split("\\\\|");
        int limit = Integer.parseInt(parts[0].trim());
        String[] chunks = parts[1].split("###");
        
        int currentWords = 0;
        StringBuilder sb = new StringBuilder();
        for (String c : chunks) {
            String chunk = c.trim();
            String[] words = chunk.split("\\\\s+");
            if (currentWords + words.length <= limit) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(chunk);
                currentWords += words.length;
            } else {
                break;
            }
        }
        return sb.toString();
    }
}
`,
      },
      testCases: [
        { input: "5 | Hello world###this is an AI course###test", expectedOutput: "Hello world" },
        { input: "8 | Alpha beta gamma###delta epsilon zeta", expectedOutput: "Alpha beta gamma delta epsilon zeta" },
      ],
    },
    dailyAssignment: {
      title: "End-to-End RAG Q&A Engine with Source Citations",
      taskDescription:
        "In `day-07/rag_engine.py`, build an end-to-end RAG script that accepts user queries, searches your vector store from Day 6, passes top 3 chunks to an LLM prompt, and returns answers with file name and line number citations.",
      stepsToComplete: [
        "Format prompt with grounded context brackets.",
        "Call LLM inference (Ollama, Gemini API, or mock response generator).",
        "Print generated response along with source chunk filenames.",
        "Commit `day-07/` and push to GitHub.",
      ],
      repoDeliverable: "day-07/rag_engine.py with sample output transcript",
      suggestedCommitMessage: "feat(day-07): end-to-end RAG engine with source citations",
    },
  },
  {
    dayNumber: 8,
    trackId: "ai-ml",
    subdomain: "Agentic AI & Tool Calling",
    title: "Autonomous Agent Loops & Structured Tool Calling",
    estimatedHours: 6,
    overview:
      "Understand the ReAct (Reason + Act) agent architecture. Define JSON schema tool signatures, parse tool arguments, invoke local APIs (calculators, web scrapers, database queries), and feed outputs back into agent context.",
    lectureNotes: [
      "ReAct framework: Thought -> Action -> Action Input -> Observation -> Thought.",
      "OpenAI / Gemini function calling protocol: JSON schema parameters.",
      "Handling tool execution errors gracefully without breaking agent loop.",
      "Preventing infinite loops with maximum iteration limits and timeout monitors.",
    ],
    pdfMaterial: {
      title: "Module 8: Agentic AI Engineering & Function Calling Protocols",
      downloadFilename: "AI_ML_Day08_Agentic_AI_Tool_Calling.pdf",
      topics: ["ReAct Loop", "JSON Schema Tools", "State Machines", "Error Handling"],
      pages: 23,
    },
    codingProblem: {
      title: "JSON Tool Call Parser & Router",
      difficulty: "MEDIUM",
      description:
        "Parse an agent response string containing a JSON tool invocation `{\"name\": \"tool_name\", \"args\": {\"x\": 1, \"y\": 2}}`. If tool name is 'add', return the sum of x and y as a string. If 'multiply', return the product. If unknown, return 'UNKNOWN_TOOL'.",
      inputFormat: "JSON string, e.g. '{\"name\": \"add\", \"args\": {\"x\": 10, \"y\": 25}}'",
      outputFormat: "Result string, e.g. '35'",
      sampleInput: '{"name": "add", "args": {"x": 10, "y": 25}}',
      sampleOutput: "35",
      starterCode: {
        python: `import json

def solution(input_str: str) -> str:
    try:
        data = json.loads(input_str.strip())
        name = data.get("name")
        args = data.get("args", {})
        x = args.get("x", 0)
        y = args.get("y", 0)
        
        if name == "add":
            return str(x + y)
        elif name == "multiply":
            return str(x * y)
        else:
            return "UNKNOWN_TOOL"
    except:
        return "UNKNOWN_TOOL"
`,
        javascript: `function solution(inputStr) {
  try {
    const data = JSON.parse(inputStr.trim());
    const name = data.name;
    const args = data.args || {};
    const x = args.x || 0;
    const y = args.y || 0;
    if (name === "add") return String(x + y);
    if (name === "multiply") return String(x * y);
    return "UNKNOWN_TOOL";
  } catch (e) {
    return "UNKNOWN_TOOL";
  }
}
`,
        java: `public class Solution {
    public static String solve(String inputStr) {
        String s = inputStr.trim();
        if (s.contains("\"name\": \"add\"")) {
            // Extract x and y
            int x = extractInt(s, "\"x\":");
            int y = extractInt(s, "\"y\":");
            return String.valueOf(x + y);
        } else if (s.contains("\"name\": \"multiply\"")) {
            int x = extractInt(s, "\"x\":");
            int y = extractInt(s, "\"y\":");
            return String.valueOf(x * y);
        }
        return "UNKNOWN_TOOL";
    }
    private static int extractInt(String s, String key) {
        int idx = s.indexOf(key);
        if (idx == -1) return 0;
        int start = idx + key.length();
        int end = start;
        while (end < s.length() && (Character.isDigit(s.charAt(end)) || s.charAt(end) == ' ' || s.charAt(end) == '-')) end++;
        return Integer.parseInt(s.substring(start, end).trim());
    }
}
`,
      },
      testCases: [
        { input: '{"name": "add", "args": {"x": 10, "y": 25}}', expectedOutput: "35" },
        { input: '{"name": "multiply", "args": {"x": 4, "y": 6}}', expectedOutput: "24" },
      ],
    },
    dailyAssignment: {
      title: "Build Multi-Step Autonomous ReAct Agent",
      taskDescription:
        "In `day-08/agent.py`, construct an autonomous agent equipped with 3 tools: `calculator(expression)`, `weather_lookup(city)`, and `wikipedia_summary(topic)`. Implement the step-by-step reasoning loop that terminates with a final answer.",
      stepsToComplete: [
        "Define tool schemas with docstrings and type annotations.",
        "Implement execution dispatcher.",
        "Run an agent multi-hop evaluation query.",
        "Push commit to GitHub.",
      ],
      repoDeliverable: "day-08/agent.py with agent reasoning execution logs",
      suggestedCommitMessage: "feat(day-08): ReAct autonomous agent with multi-tool calling",
    },
  },
  {
    dayNumber: 9,
    trackId: "ai-ml",
    subdomain: "Model Serving & FastAPI",
    title: "Production Async FastAPI Microservice & Streaming",
    estimatedHours: 6,
    overview:
      "Package your ML models into high-concurrency microservices with FastAPI, Pydantic v2 data validation, Server-Sent Events (SSE) streaming responses, and async batching.",
    lectureNotes: [
      "Why FastAPI over Flask: asyncio event loop, uvloop, and OpenAPI generation.",
      "Pydantic v2 schemas: strict typing and input sanitization.",
      "Server-Sent Events (`text/event-stream`) for token-by-token streaming.",
      "Handling GPU batch inference with dynamic worker queues.",
    ],
    pdfMaterial: {
      title: "Module 9: High-Throughput ML Serving with FastAPI & Asyncio",
      downloadFilename: "AI_ML_Day09_FastAPI_ML_Serving.pdf",
      topics: ["FastAPI Asyncio", "Pydantic v2", "SSE Streaming", "Dynamic Batching"],
      pages: 21,
    },
    codingProblem: {
      title: "SSE Stream Formatter",
      difficulty: "EASY",
      description:
        "Format a token string into an official Server-Sent Events line: `data: {\"token\": \"<token>\"}\\n\\n`. Return the formatted string.",
      inputFormat: "Token string, e.g. 'hello'",
      outputFormat: "'data: {\"token\": \"hello\"}\\n\\n'",
      sampleInput: "hello",
      sampleOutput: 'data: {"token": "hello"}\n\n',
      starterCode: {
        python: `def solution(input_str: str) -> str:
    token = input_str.strip()
    return f'data: {{"token": "{token}"}}\\n\\n'
`,
        javascript: `function solution(inputStr) {
  const token = inputStr.trim();
  return 'data: {"token": "' + token + '"}\\n\\n';
}
`,
        java: `public class Solution {
    public static String solve(String inputStr) {
        String token = inputStr.trim();
        return "data: {\\\"token\\\": \\\"" + token + "\\\"}\\n\\n";
    }
}
`,
      },
      testCases: [
        { input: "hello", expectedOutput: 'data: {"token": "hello"}\n\n' },
        { input: "world", expectedOutput: 'data: {"token": "world"}\n\n' },
      ],
    },
    dailyAssignment: {
      title: "Deploy Production FastAPI Inference API",
      taskDescription:
        "Create `day-09/server.py` with endpoints `POST /v1/chat/completions` (supporting streaming) and `GET /health`. Write a complete `test_server.py` using `httpx.AsyncClient` verifying 100 concurrent requests.",
      stepsToComplete: [
        "Create FastAPI app with CORS middleware and Pydantic validation.",
        "Implement streaming generator endpoint.",
        "Write pytest asynchronous test suite.",
        "Push commit to GitHub.",
      ],
      repoDeliverable: "day-09/server.py and test_server.py",
      suggestedCommitMessage: "feat(day-09): asynchronous FastAPI inference microservice",
    },
  },
  {
    dayNumber: 10,
    trackId: "ai-ml",
    subdomain: "Open Source Industrial Contribution",
    title: "Open Source Contribution: RitualDev-Lab/DevShelf",
    estimatedHours: 6,
    overview:
      "Mandatory industrial collaboration milestone: fork the official engineering repository `https://github.com/RitualDev-Lab/DevShelf`, contribute a verified tool, guide, or algorithmic implementation, and submit your Pull Request for review.",
    lectureNotes: [
      "Open source workflow: Forking, upstream remotes, and branch isolation.",
      "Writing conventional commits and clear Pull Request descriptions.",
      "Adhering to code formatting, ESLint/Prettier, and CI/CD test standards.",
      "The value of public open-source contributions in tech recruitment.",
    ],
    pdfMaterial: {
      title: "Module 10: Open Source Contribution & Git Collaboration Playbook",
      downloadFilename: "AI_ML_Day10_Open_Source_DevShelf.pdf",
      topics: ["Fork & Rebase", "Pull Request Etiquette", "Git Hooks", "DevShelf Architecture"],
      pages: 16,
    },
    codingProblem: {
      title: "Conventional Commit Header Validator",
      difficulty: "EASY",
      description:
        "Given a commit message string, return 'VALID' if it follows the format `<type>(<scope>): <description>` where type is one of `feat`, `fix`, `docs`, `test`, `refactor`. Otherwise return 'INVALID'.",
      inputFormat: "Commit string, e.g. 'feat(day-10): add devshelf documentation'",
      outputFormat: "'VALID' or 'INVALID'",
      sampleInput: "feat(day-10): add devshelf documentation",
      sampleOutput: "VALID",
      starterCode: {
        python: `import re

def solution(input_str: str) -> str:
    pattern = r'^(feat|fix|docs|test|refactor)\([a-zA-Z0-9_-]+\):\s.+$'
    if re.match(pattern, input_str.strip()):
        return "VALID"
    return "INVALID"
`,
        javascript: `function solution(inputStr) {
  const pattern = /^(feat|fix|docs|test|refactor)\([a-zA-Z0-9_-]+\):\s.+$/;
  return pattern.test(inputStr.trim()) ? "VALID" : "INVALID";
}
`,
        java: `public class Solution {
    public static String solve(String inputStr) {
        String pattern = "^(feat|fix|docs|test|refactor)\\\\([a-zA-Z0-9_-]+\\\\):\\\\s.+$";
        return inputStr.trim().matches(pattern) ? "VALID" : "INVALID";
    }
}
`,
      },
      testCases: [
        { input: "feat(day-10): add devshelf documentation", expectedOutput: "VALID" },
        { input: "bad commit message", expectedOutput: "INVALID" },
      ],
    },
    dailyAssignment: {
      title: "Fork and Submit PR to RitualDev-Lab/DevShelf",
      taskDescription:
        "Fork `https://github.com/RitualDev-Lab/DevShelf` to your personal GitHub account. Add an AI/ML developer guide, cheat sheet, or tool recommendation inside `content/` or appropriate folder. Open a Pull Request back to upstream and submit your Fork and PR URLs in the portal.",
      stepsToComplete: [
        "Fork https://github.com/RitualDev-Lab/DevShelf to your GitHub.",
        "Clone locally, create branch `contrib/your-name-addition`.",
        "Add meaningful technical content or code improvement.",
        "Open Pull Request against RitualDev-Lab/DevShelf and paste the link below.",
      ],
      repoDeliverable: "Pull Request on https://github.com/RitualDev-Lab/DevShelf",
      suggestedCommitMessage: "docs(curriculum): add machine learning engineering playbook to DevShelf",
    },
  },
];

// Helper to get curriculum lessons for any track
export function getCurriculumDaysForTrack(trackId: string): BootcampDayLesson[] {
  if (trackId === "ai-ml") {
    return AIML_CURRICULUM_DAYS;
  }

  // Generate systematic 28-day structured curriculum for any other track dynamically
  const titles = [
    { title: "Environment Setup, Architecture & Core Foundations", subdomain: "Foundations & Setup" },
    { title: "Data Structures, Internal Memory Models & Algorithms", subdomain: "Core Structures" },
    { title: "Object-Oriented & Functional Design Patterns", subdomain: "Software Design" },
    { title: "Asynchronous Concurrency & Event Loops", subdomain: "Concurrency" },
    { title: "Database Modeling, Indexing & Query Optimization", subdomain: "Data Storage" },
    { title: "REST & RPC API Design with Schema Validation", subdomain: "API Engineering" },
    { title: "Security Protocols, Auth & OWASP Hardening", subdomain: "Security" },
    { title: "Distributed Caching, Redis & Performance Tuning", subdomain: "High Performance" },
    { title: "Docker Containerization & Multi-Stage Builds", subdomain: "DevOps & Cloud" },
    { title: "Open Source Milestone: RitualDev-Lab/DevShelf Contribution", subdomain: "Open Source" },
  ];

  return titles.map((t, idx) => ({
    dayNumber: idx + 1,
    trackId,
    subdomain: t.subdomain,
    title: `Day ${idx + 1}: ${t.title}`,
    estimatedHours: 6,
    overview: `Hands-on day ${idx + 1} engineering tasks focusing on ${t.title} for the ${trackId} engineering track.`,
    lectureNotes: [
      `Deep architectural breakdown of ${t.subdomain}.`,
      "Production-grade best practices and anti-patterns to avoid.",
      "Unit testing and automated verification strategy.",
      "GitHub repository tracking requirements.",
    ],
    pdfMaterial: {
      title: `${t.title} Reference Guide`,
      downloadFilename: `${trackId}_Day${idx + 1}_Guide.pdf`,
      topics: [t.subdomain, "Best Practices", "System Design", "Unit Testing"],
      pages: 15 + idx * 2,
    },
    codingProblem: AIML_CURRICULUM_DAYS[0].codingProblem,
    dailyAssignment: {
      title: "Day " + (idx + 1) + " Industrial Task: " + t.title,
      taskDescription: "Implement the day " + (idx + 1) + " laboratory milestone in your repository under day-" + String(idx + 1).padStart(2, "0") + "/.",
      stepsToComplete: [
        "Create directory day-" + String(idx + 1).padStart(2, "0") + "/ in your repo.",
        "Write clean, modular code with accompanying unit tests.",
        "Push commit to GitHub.",
        "Submit your commit URL below for verification.",
      ],
      repoDeliverable: "day-" + String(idx + 1).padStart(2, "0") + "/ with test execution logs",
      suggestedCommitMessage: "feat(day-" + String(idx + 1).padStart(2, "0") + "): complete " + t.title,
    },
  }));
}
