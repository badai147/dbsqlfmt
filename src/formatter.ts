import { format, type SqlLanguage } from 'sql-formatter';
import { detectDialect } from './detect';

export interface FormatOptions {
  language?: string;
  indent?: string;
  uppercase?: boolean;
}

export function formatSql(sql: string, options: FormatOptions = {}): string {
  const language: SqlLanguage = options.language
    ? (options.language as SqlLanguage)
    : detectDialect(sql);
  return format(sql, {
    language,
    tabWidth: Number(options.indent) || 2,
    keywordCase: options.uppercase ? 'upper' : 'preserve',
  });
}
