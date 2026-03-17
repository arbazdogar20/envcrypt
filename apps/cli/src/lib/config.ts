import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const CONFIG_DIR = path.join(os.homedir(), ".envcrypt");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

interface Config {
  token?: string;
  apiUrl?: string;
}

export function getConfig(): Config {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return {};
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function setConfig(data: Partial<Config>): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  const current = getConfig();
  const updated = { ...current, ...data };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2));
}

export function clearConfig(): void {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
  }
}

export function getToken(): string | null {
  return getConfig().token ?? null;
}

export function getApiUrl(): string {
  return getConfig().apiUrl ?? "http://localhost:3000";
}
