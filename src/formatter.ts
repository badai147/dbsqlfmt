import { format, type SqlLanguage } from 'sql-formatter';

export interface FormatOptions {
  language?: string;
  indent?: string;
  uppercase?: boolean;
}

export function formatSql(sql: string, options: FormatOptions = {}): string {
  return format(sql, {
    language: (options.language || 'sql') as SqlLanguage,
    tabWidth: Number(options.indent) || 2,
    keywordCase: options.uppercase ? 'upper' : 'preserve',
  });
}
