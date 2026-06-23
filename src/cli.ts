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
  .option('-u, --uppercase', 'Uppercase keywords')
  .option('--dry-run', 'Print formatted SQL to stdout without overwriting')
  .action((file: string, options: Record<string, unknown>) => {
    formatFile(file, options);
  });

program.addHelpText('after', `
Format Options:
  -l, --language <lang>  SQL dialect (mysql, postgresql)  [default: auto-detect]
  -i, --indent <size>    Indent size                      [default: 2]
  -u, --uppercase        Uppercase keywords
  --dry-run              Print formatted SQL to stdout without overwriting

Examples:
  dbsqlfmt format query.sql                   Default mysql dialect
  dbsqlfmt format query.sql -l postgresql -u  PostgreSQL + uppercase
  dbsqlfmt format query.sql --dry-run         Preview without modifying
`);

program.parse(process.argv);
