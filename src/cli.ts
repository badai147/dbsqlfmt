#!/usr/bin/env node
import { Command } from 'commander';
import { formatFile } from './index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

const program = new Command();

program
  .name('dbsqlfmt')
  .description('SQL formatter CLI tool')
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

program.parse(process.argv);
