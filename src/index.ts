import { formatSql } from './formatter';
import { mergeConfig, Config } from './config';
import { readFile, writeFile, print } from './utils';

export function formatFile(filePath: string, cliOptions: Config): void {
  const options = mergeConfig(cliOptions);
  const sql = readFile(filePath);
  const formatted = formatSql(sql, options);
  if (options.dryRun) {
    print(formatted + '\n');
  } else {
    writeFile(filePath, formatted);
    print(`Formatted: ${filePath}\n`);
  }
}
