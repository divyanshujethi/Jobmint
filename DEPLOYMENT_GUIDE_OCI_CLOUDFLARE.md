# 🚀 JobMint Production Deployment Guide: Oracle Cloud (OCI) + Cloudflare ($0.00 Architecture)

This document provides a **complete, step-by-step blueprint** to launch **JobMint** into production at **$0.00 total cloud cost**, utilizing the combined strengths of **Oracle Cloud Infrastructure (Always Free)** and **Cloudflare (Free Tier)**.

---

## 🗺️ System Architecture Overview

```
                                      ┌──────────────────────────────────────────────┐
                                      │              USERS & CANDIDATES              │
                                      │         (Web Browsers & Mobile App)          │
                                      └──────────────────────┬───────────────────────┘
                                                             │
                                                             ▼
                                      ┌──────────────────────────────────────────────┐
                                      │            CLOUDFLARE (Free Tier)            │
                                      │  • Global Edge CDN & Anycast DNS             │
                                      │  • Free SSL/TLS Encryption & DDoS Protection │
                                      │  • Cloudflare Pages: Next.js Frontend Host   │
                                      │  • Workers AI: Edge Llama 3.2 3B Inference   │
                                      └──────────────────────┬───────────────────────┘
                                                             │
                                   Secure API & DB Tunnel    │ (HTTPS / Reverse Proxy)
                                                             ▼
                                      ┌──────────────────────────────────────────────┐
                                      │     ORACLE CLOUD INFRASTRUCTURE (OCI)        │
                                      │           Always Free ARM VM                 │
                                      │  (4 OCPU Ampere A1, 24 GB RAM, 200 GB SSD)   │
                                      ├──────────────────────────────────────────────┤
                                      │  📦 Docker Container Stack:                  │
                                      │     • PostgreSQL 16 (Relational DB)          │
                                      │     • Redis 7 (Cache, Queue, Rate Limits)    │
                                      │     • Ollama (Meta Llama 3.2 3B Inference)   │
                                      │                                              │
                                      │  📁 200 GB NVMe Storage Engine:              │
                                      │     • /data/resumes (SHA-256 Deduplicated)   │
                                      │     • HMAC-SHA256 Token Streamer             │
                                      │                                              │
                                      │  🐊 Autonomous Dual Alligators:              │
                                      │     • Job Alligator (Free ATS Crawlers)      │
                                      │     • Study Alligator (Canvas Knowledge Map) │
                                      └──────────────────────────────────────────────┘
```

---

## 📋 PART 1: Oracle Cloud Infrastructure (OCI) Full Setup

### 1.1 Create Your Oracle Cloud Account
1. Visit **[cloud.oracle.com](https://cloud.oracle.com)** and sign up for an **Always Free** account.
2. Select your **Home Region** carefully (e.g., `ap-mumbai-1` or `ap-hyderabad-1` for Indian candidates, or `us-ashburn-1` / `eu-frankfurt-1` for global remote latency).
3. Complete account registration. *(Oracle validates identity via a temporary $1 authorization, which is immediately refunded).*

---

### 1.2 Provision the "Always Free" Ampere A1 Compute Instance
1. In the OCI Console, navigate to **Compute** $\to$ **Instances** $\to$ **Create Instance**.
2. **Name**: `jobmint-core-vm`
3. **Placement & Image**:
   - Image: **Ubuntu 22.04 LTS (AArch64 / ARM)** or **Oracle Linux 9 (aarch64)**.
4. **Shape**:
   - Select **Ampere (Arm-based Processor)**.
   - Choose **VM.Standard.A1.Flex**.
   - Configure:
     - **OCPUs**: `4` *(Maximum Always Free entitlement)*
     - **Memory (RAM)**: `24 GB` *(Maximum Always Free entitlement)*
5. **Networking (VCN)**:
   - Select **Create new Virtual Cloud Network (VCN)**.
   - Select **Assign a public IPv4 address**.
6. **Add SSH Keys**:
   - Select **Generate a key pair for me** and click **Save Private Key** (`id_rsa`) to your local PC.
   - Or paste your existing public SSH key (`~/.ssh/id_rsa.pub`).
7. **Boot Volume Configuration**:
   - Check **Specify a custom boot volume size**.
   - Set Boot Volume Size: **`200 GB`** *(Oracle provides up to 200 GB persistent block storage for free across your tenancy)*.
8. Click **Create** and wait 60 seconds until the instance status turns **RUNNING** (Green). Note down your **Public IP Address** (e.g., `129.154.xxx.xxx`).

---

### 1.3 Configure VCN Security List (Firewall Rules)
To allow Cloudflare and your app services to communicate with the OCI VM:
1. In the Instance details page, click on your **Virtual Cloud Network** under **Primary VNIC**.
2. Click on **Security Lists** $\to$ **Default Security List for...**.
3. Under **Ingress Rules**, click **Add Ingress Rules**:

| Source CIDR | IP Protocol | Destination Port Range | Description |
|---|---|---|---|
| `0.0.0.0/0` | TCP | `22` | SSH Remote Access |
| `0.0.0.0/0` | TCP | `80, 443` | HTTP/HTTPS Web & API Traffic |
| `0.0.0.0/0` | TCP | `5432` | PostgreSQL Relational Database |
| `0.0.0.0/0` | TCP | `6379` | Redis Cache & Queue |
| `0.0.0.0/0` | TCP | `11434` | Ollama Llama 3.2 AI Inference Engine |

*(Tip: In production, you can restrict ports 5432, 6379, and 11434 strictly to Cloudflare IP ranges or an encrypted Cloudflare Tunnel for absolute security).*

---

### 1.4 Connect to VM & Update OS Firewall (iptables/ufw)
1. Open PowerShell or Terminal on your PC and connect:
   ```bash
   ssh -i /path/to/your/private_key.pem ubuntu@YOUR_OCI_PUBLIC_IP
   ```
2. By default, Oracle Cloud Ubuntu images include strict internal `iptables` rules. Run these commands to open the ports locally:
   ```bash
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5432 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 6379 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 11434 -j ACCEPT
   sudo netfilter-persistent save
   ```

---

### 1.5 Run the 1-Click JobMint Backend Setup
Our repository includes a complete bootstrap script in `deploy/oci/`:
1. Clone the JobMint repository onto the OCI VM:
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/jobapp.git /opt/jobmint
   cd /opt/jobmint
   ```
2. Execute the automated installer:
   ```bash
   chmod +x deploy/oci/setup.sh
   bash deploy/oci/setup.sh
   ```
   **What this script automatically executes:**
   - Installs Docker Engine & Docker Compose on ARM64.
   - Initializes `/data/postgres`, `/data/redis`, `/data/ollama`, and `/data/resumes` on the 200 GB NVMe volume.
   - Launches PostgreSQL 16, Redis 7, and Ollama background containers.
   - Downloads and verifies **Meta Llama 3.2 3B** (`llama3.2:3b`) on the 4-core Ampere CPU.
   - Runs a test inference to verify sub-50ms execution.

3. Verify all 3 containers are healthy:
   ```bash
   docker ps
   ```
   You should see `jobmint-postgres`, `jobmint-redis`, and `jobmint-ollama` running with `(healthy)` status.

---

### 1.6 Run Database Migrations
On the OCI VM (or locally connected to the OCI Postgres IP):
```bash
cd /opt/jobmint
pnpm install
pnpm --filter @repo/database db:push
```
This initializes all 7 production tables (`users`, `companies`, `jobs`, `applications`, `resumes`, `skills`, and verification audit logs).

---

## 🌐 PART 2: Cloudflare Full Setup

### 2.1 Add Domain to Cloudflare (Free DNS & SSL)
1. Sign up or log into **[dash.cloudflare.com](https://dash.cloudflare.com)**.
2. Click **Add a Domain** and enter your registered domain (e.g., `jobmint.com`).
3. Select the **Free Plan** ($0/month).
4. Update the nameservers at your domain registrar (Namecheap, GoDaddy, Cloudflare Registrar, etc.) to the assigned Cloudflare nameservers (e.g., `ada.ns.cloudflare.com`).
5. Under **SSL/TLS** $\to$ **Overview**, set the encryption mode to **Full (strict)**.

---

### 2.2 Configure DNS Records
In your Cloudflare dashboard under **DNS** $\to$ **Records**, create:

| Type | Name | Content / IPv4 | Proxy Status | Description |
|---|---|---|---|---|
| `A` | `@` | `YOUR_OCI_PUBLIC_IP` (or Pages CNAME) | **Proxied (Orange Cloud)** | Root Domain |
| `A` | `api` | `YOUR_OCI_PUBLIC_IP` | **Proxied (Orange Cloud)** | API & Storage Backend |
| `CNAME` | `www` | `@` | **Proxied (Orange Cloud)** | Web Alias |

*(With the Orange Cloud enabled, Cloudflare conceals your real OCI IP, absorbs DDoS attacks, and provides free TLS 1.3 caching).*

---

### 2.3 Setup Cloudflare Pages (Frontend Hosting)
1. In Cloudflare Dashboard, navigate to **Compute (Workers & Pages)** $\to$ **Create Application** $\to$ **Pages** $\to$ **Connect to Git**.
2. Authorize GitHub and select your `jobapp` repository.
3. Configure the build settings:
   - **Project Name**: `jobmint`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `/`
   - **Build Command**: `pnpm --filter web build`
   - **Build Output Directory**: `apps/web/.next`
   - **Node.js Version**: In Environment Variables, add `NODE_VERSION` = `20.18.0`.
4. Click **Save and Deploy**.

---

### 2.4 Setup Cloudflare Workers AI (Tier 2 AI Inference)
1. In Cloudflare Dashboard, go to **AI** $\to$ **Workers AI**.
2. Note your **Account ID** displayed on the right sidebar.
3. Click on **Manage API Tokens** $\to$ **Create Token** $\to$ choose template **Workers AI Read and Write**.
4. Copy the generated token. This gives you **10,000 free AI neurons per day** for Meta Llama 3.2 3B inference directly at Cloudflare edge locations worldwide.

---

## 🔑 PART 3: Production Environment Variables Checklist

Add these environment variables into your Cloudflare Pages dashboard (**Settings** $\to$ **Environment Variables**) and inside `/opt/jobmint/.env.production` on the OCI VM:

```ini
# ==============================================================================
# 1. CORE APPLICATION & AUTHENTICATION
# ==============================================================================
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://jobmint.com"
AUTH_URL="https://jobmint.com"
# Generate via: openssl rand -base64 32
NEXTAUTH_SECRET="your_secure_32_character_nextauth_secret"

# ==============================================================================
# 2. DATABASE & CACHE (OCI VM)
# ==============================================================================
DATABASE_URL="postgresql://jobmint:JobMintSecurePass2026!@YOUR_OCI_PUBLIC_IP:5432/jobmint_prod"
REDIS_URL="redis://:JobMintRedisPass2026!@YOUR_OCI_PUBLIC_IP:6379"

# ==============================================================================
# 3. OCI 200 GB PERSISTENT RESUME STORAGE
# ==============================================================================
STORAGE_DRIVER="local"
STORAGE_LOCAL_DIR="/data/resumes"
# Generate via: openssl rand -hex 32
STORAGE_SECRET="your_secure_hmac_sha256_storage_secret"

# ==============================================================================
# 4. 4-TIER LLAMA 3.2 AI CASCADE (All Free Tier Keys)
# ==============================================================================
# Tier 0: Client WebGPU (Runs 100% free inside candidate browsers via ONNX / Transformers.js)

# Tier 1: Groq Cloud API (Llama 3.3 70B @ 300+ tok/sec, 14,400 req/day free)
# Get from: https://console.groq.com
GROQ_API_KEY="gsk_your_groq_api_key_here"

# Tier 2: Cloudflare Workers AI (Llama 3.2 3B @ 120+ tok/sec, 10,000 neurons/day free)
# Get from: https://dash.cloudflare.com
CLOUDFLARE_ACCOUNT_ID="your_cloudflare_account_id"
CLOUDFLARE_API_TOKEN="your_cloudflare_workers_ai_token"

# Tier 3: OCI Always Free Self-Hosted Ollama (Llama 3.2 3B, $0.00, Unlimited)
OLLAMA_BASE_URL="http://YOUR_OCI_PUBLIC_IP:11434"
OLLAMA_MODEL="llama3.2:3b"

# Tier 4: Google Gemini Flash (Safety Net, 15 req/min free)
# Get from: https://aistudio.google.com
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# ==============================================================================
# 5. ALLIGATOR CRON & AUTOMATION
# ==============================================================================
ALLIGATOR_SECRET="your_random_alligator_cron_authorization_token"
```

---

## 🐊 PART 4: Automating the Two Alligators on OCI

To run the **Job Alligator** and **Study Alligator** automatically on your OCI server every 12 hours:

1. Open crontab on the OCI VM:
   ```bash
   crontab -e
   ```
2. Add these automated schedule entries:
   ```cron
   # Trigger Job Alligator crawl every 12 hours (Midnight and Noon)
   0 0,12 * * * curl -s -X POST https://jobmint.com/api/alligators/jobs/crawl -H "x-alligator-key: your_random_alligator_cron_authorization_token" >> /var/log/alligator-jobs.log 2>&1

   # Sync Study Alligator free canvas courses daily at 02:00 AM
   0 2 * * * curl -s -X POST https://jobmint.com/api/alligators/study/sync -H "x-alligator-key: your_random_alligator_cron_authorization_token" >> /var/log/alligator-study.log 2>&1
   ```

---

## ✅ PART 5: Post-Deployment Verification Checklist

Once deployed, perform this 3-minute smoke test:

1. **Visit Job Feed**: Go to `https://jobmint.com/jobs` $\to$ Verify jobs load cleanly with transparent salary and ghosting badges.
2. **Visit Study Canvas**: Go to `https://jobmint.com/canvas` $\to$ Interact with the node-based graph, test zoom/pan, and toggle a skill to "Mastered".
3. **Verify Alligator Intelligence**: Go to `https://jobmint.com/admin/alligators` $\to$ Click **"Run Job Alligator"** and **"Sync Study Canvas"** $\to$ Confirm live counter updates.
4. **Test Resume Vault (OCI 200 GB Storage)**: Go to `https://jobmint.com/profile/resume` $\to$ Upload a sample PDF resume $\to$ Verify SHA-256 deduplication and private HMAC streaming token generation.
5. **Test AI Resume Assistant**: Go to `https://jobmint.com/resume/assistant` $\to$ Click "Enhance Resume Bullet" $\to$ Verify response from Tier 1 Groq / Tier 2 Cloudflare / Tier 3 OCI Ollama.
6. **Company Registration**: Go to `https://jobmint.com/register` $\to$ Select "Employer" $\to$ Verify company domain detection and Verified Blue Shield logic.

---

### Cost Verification Summary:
- **Oracle Cloud (4 OCPU, 24 GB RAM, 200 GB SSD, 10 TB Egress)**: **$0.00 / month**
- **Cloudflare (DNS, CDN, SSL, Pages, Workers AI)**: **$0.00 / month**
- **Groq API Free Tier (14,400 daily requests)**: **$0.00 / month**
- **Google Gemini API Free Tier (1,500 daily requests)**: **$0.00 / month**
- **Total Operational Cost**: **$0.00 / forever**