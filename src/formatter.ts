import { format, type SqlLanguage } from 'sql-formatter';
import { detectDialect } from './detect';

export type CaseOption = 'upper' | 'lower' | 'preserve';

export interface FormatOptions {
  language?: string;
  indent?: string;
  uppercase?: boolean;
  keywordCase?: CaseOption;
  dataTypeCase?: CaseOption;
  functionCase?: CaseOption;
  identifierCase?: CaseOption;
}

export function formatSql(sql: string, options: FormatOptions = {}): string {
  const language: SqlLanguage = options.language
    ? (options.language as SqlLanguage)
    : detectDialect(sql);
  return format(sql, {
    language,
    tabWidth: Number(options.indent) || 2,
    keywordCase: options.keywordCase ?? 'upper',
    dataTypeCase: options.dataTypeCase ?? 'upper',
    functionCase: options.functionCase ?? 'upper',
    identifierCase: options.identifierCase ?? 'upper',
  });
}
