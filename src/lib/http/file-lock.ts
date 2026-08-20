import { promises as fs } from "fs";
import path from "path";

export class FileLockError extends Error {
  constructor(file: string) {
    super(`locked:${file}`);
    this.name = "FileLockError";
  }
}

async function acquireLock(file: string, staleMs: number): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  try {
    await fs.writeFile(
      file,
      JSON.stringify({ at: Date.now(), pid: process.pid }) + "\n",
      { flag: "wx" },
    );
  } catch {
    try {
      const st = await fs.stat(file);
      if (Date.now() - st.mtimeMs >= staleMs) {
        await fs.unlink(file);
      }
    } catch {
      /* gone */
    }
    throw new FileLockError(file);
  }
}

async function releaseLock(file: string): Promise<void> {
  try {
    await fs.unlink(file);
  } catch {
    /* ignore */
  }
}

export async function withFileLock<T>(
  lockFile: string,
  fn: () => Promise<T>,
  options?: { staleMs?: number; retries?: number; delayMs?: number },
): Promise<T> {
  const staleMs = options?.staleMs ?? 20_000;
  const retries = options?.retries ?? 25;
  const delayMs = options?.delayMs ?? 80;
  let lastErr: unknown;
  for (let i = 0; i < retries; i += 1) {
    try {
      await acquireLock(lockFile, staleMs);
      try {
        return await fn();
      } finally {
        await releaseLock(lockFile);
      }
    } catch (err) {
      lastErr = err;
      if (!(err instanceof FileLockError)) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr instanceof Error ? lastErr : new FileLockError(lockFile);
}
