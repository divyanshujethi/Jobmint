import { execFile } from "child_process";
import { promisify } from "util";
import crypto from "crypto";

const execFileAsync = promisify(execFile);

/**
 * Docker image that contains g++ and a JDK, e.g. built from deploy/sandbox/Dockerfile.
 * When unset, the server-side runner is DISABLED (fail closed). Untrusted code must
 * never be compiled or executed directly on the application host.
 */
export function getSandboxImage(): string {
  return (process.env.ARENA_SANDBOX_IMAGE || "").trim();
}

export function isSandboxConfigured(): boolean {
  return getSandboxImage().length > 0;
}

export interface SandboxRunOptions {
  /** Host directory holding the sources; mounted at /work inside the container. */
  workDir: string;
  /** argv executed inside the container (no shell). */
  command: string[];
  timeoutMs: number;
  memoryMb?: number;
}

/**
 * Runs one command inside a locked-down, throwaway container:
 * no network, no capabilities, read-only root FS, non-root user, memory/CPU/PID caps,
 * and NO environment variables from the app (secrets never reach user code).
 * Rejects with the same shape as child_process.exec (stdout / stderr / message).
 */
export async function runInSandbox(opts: SandboxRunOptions): Promise<{ stdout: string; stderr: string }> {
  const image = getSandboxImage();
  if (!image) {
    throw new Error("Server-side code runner is not configured.");
  }

  const memory = `${opts.memoryMb ?? 256}m`;
  const name = `arena_${crypto.randomBytes(8).toString("hex")}`;

  const args = [
    "run",
    "--rm",
    "--name", name,
    "--network", "none",
    "--memory", memory,
    "--memory-swap", memory,
    "--cpus", "1",
    "--pids-limit", "64",
    "--ulimit", "fsize=10485760",
    "--ulimit", "nofile=64",
    "--read-only",
    "--tmpfs", "/tmp:rw,noexec,nosuid,size=16m",
    "--cap-drop", "ALL",
    "--security-opt", "no-new-privileges",
    "--user", "65534:65534",
    "-v", `${opts.workDir}:/work:rw`,
    "-w", "/work",
    image,
    ...opts.command,
  ];

  try {
    // Minimal env for the docker CLI itself; the app's environment is NOT forwarded.
    return await execFileAsync("docker", args, {
      timeout: opts.timeoutMs,
      maxBuffer: 1024 * 1024,
      env: { PATH: process.env.PATH || "/usr/bin:/bin" } as any,
    });
  } catch (err) {
    // Make sure a runaway container does not outlive a timed-out docker client.
    execFile("docker", ["kill", name], { env: { PATH: process.env.PATH || "/usr/bin:/bin" } as any }, () => {});
    throw err;
  }
}
