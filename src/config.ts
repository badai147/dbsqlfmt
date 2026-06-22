import fs from 'fs';
import path from 'path';

export interface Config {
  [key: string]: any;
}

function loadConfig(cwd: string): Config {
  const rcPath = path.join(cwd, '.dbsqlfmtrc');
  if (fs.existsSync(rcPath)) {
    try {
      return JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
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
