#!/usr/bin/env node
import { Command } from 'commander';
import { formatFile } from './index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

const program = new Command();

program
  .name('dbsqlfmt')
  .description('SQL formatter CLI tool (auto-detect mysql / postgresql)')
  .version(pkg.version);

program
  .command('format <file>')
  .description('Format a SQL file')
  .option('-l, --language <lang>', 'SQL dialect (mysql, postgresql)')
  .option('-i, --indent <size>', 'Indent size', '2')
  .option('-u, --uppercase', 'Shortcut for --keyword-case upper')
  .option('--keyword-case <style>', 'Keyword case: upper, lower, preserve')
  .option('--data-type-case <style>', 'Data type case: upper, lower, preserve')
  .option('--function-case <style>', 'Function name case: upper, lower, preserve')
  .option('--identifier-case <style>', 'Identifier case: upper, lower, preserve (experimental)')
  .option('--dry-run', 'Print formatted SQL to stdout without overwriting')
  .action((file: string, options: Record<string, unknown>) => {
    try {
      formatFile(file, options);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  });

program.addHelpText('after', `
Format Options:
  -l, --language <lang>          SQL dialect (mysql, postgresql)  [default: auto-detect]
  -i, --indent <size>            Indent size                      [default: 2]
  -u, --uppercase                Shortcut for --keyword-case upper
  --keyword-case <style>         Keyword case: upper, lower, preserve  [default: upper]
  --data-type-case <style>       Data type case: upper, lower, preserve  [default: upper]
  --function-case <style>        Function name case: upper, lower, preserve  [default: upper]
  --identifier-case <style>      Identifier case: upper, lower, preserve  [default: upper]
  --dry-run                      Print formatted SQL to stdout without overwriting

Examples:
  dbsqlfmt format query.sql                      Default (all upper)
  dbsqlfmt format query.sql -l postgresql        PostgreSQL dialect
  dbsqlfmt format query.sql --keyword-case lower  Lowercase keywords
  dbsqlfmt format query.sql --dry-run            Preview without modifying
`);

program.parse(process.argv);
