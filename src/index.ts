import { formatSql } from './formatter';
import { mergeConfig, Config } from './config';
import { readFile, writeFile, print } from './utils';

export function formatFile(filePath: string, cliOptions: Config): void {
  try {
    const options = mergeConfig(cliOptions);
    const sql = readFile(filePath);
    const formatted = formatSql(sql, options);
    if (options.dryRun) {
      print(formatted);
    } else {
      writeFile(filePath, formatted);
      print(`Formatted: ${filePath}\n`);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}
