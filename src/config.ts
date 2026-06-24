import fs from 'fs';
import path from 'path';

export interface Config {
  language?: string;
  indent?: string;
  uppercase?: boolean;
  dryRun?: boolean;
}

const ALLOWED_KEYS: readonly (keyof Config)[] = [
  'language', 'indent', 'uppercase', 'dryRun',
];
const MAX_CONFIG_SIZE = 1024 * 1024;

function loadConfig(cwd: string): Config {
  const rcPath = path.join(cwd, '.dbsqlfmtrc');
  if (fs.existsSync(rcPath)) {
    const stat = fs.statSync(rcPath);
    if (stat.size > MAX_CONFIG_SIZE) {
      throw new Error(`Config file too large (${stat.size} bytes): ${rcPath}`);
    }
    try {
      const raw = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
      if (typeof raw !== 'object' || raw === null) return {};
      const filtered: Config = {};
      for (const key of ALLOWED_KEYS) {
        if (key in raw) (filtered as Record<string, unknown>)[key] = raw[key];
      }
      return filtered;
    } catch {
      return {};
    }
  }
  return {};
}

export function mergeConfig(cliOptions: Config): Config {
  const fileConfig = loadConfig(process.cwd());
  const cleanCli = Object.fromEntries(
    Object.entries(cliOptions).filter(([_, v]) => v !== undefined)
  );
  return { ...fileConfig, ...cleanCli };
}
