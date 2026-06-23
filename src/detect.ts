export type Dialect = 'mysql' | 'postgresql';

// 权重含义: 5=极强信号, 4=强信号, 3=中等信号, 2=弱信号, 1=微弱信号
const mysqlPatterns: [RegExp, number][] = [
  [ /`\w+`/, 5 ],
  [ /\bAUTO_INCREMENT\b/, 5 ],
  [ /\bON\s+DUPLICATE\s+KEY\s+UPDATE\b/, 5 ],
  [ /\bENGINE\s*=\s*\w+/, 5 ],
  [ /\bREPLACE\s+INTO\b/, 5 ],
  [ /(?:^|[;\s])#/m, 3 ],
  [ /\bINT\s*\(\s*\d+\s*\)/, 3 ],
  [ /\bUNSIGNED\b/, 3 ],
  [ /\bCHARACTER\s+SET\b/, 3 ],
  [ /\bCHARSET\b/, 3 ],
  [ /\bFULLTEXT\b/, 3 ],
  [ /\bSPATIAL\b/, 3 ],
  [ /\bROW_FORMAT\b/, 3 ],
  [ /\bLOCK\s+TABLES\b/, 3 ],
  [ /\bUNLOCK\s+TABLES\b/, 3 ],
  [ /\bSTRAIGHT_JOIN\b/, 3 ],
  [ /\bSQL_CALC_FOUND_ROWS\b/, 3 ],
  [ /\bSHOW\s+(?:DATABASES|TABLES|COLUMNS|INDEX|CREATE|PROCEDURE|FUNCTION|VARIABLES|STATUS|PROCESSLIST|GRANTS|WARNINGS|ERRORS)\b/i, 3 ],
  [ /\bDESCRIBE\b/, 3 ],
  [ /\bDELAYED\b/, 2 ],
  [ /\bTINYINT\b/, 1 ],
  [ /\bMEDIUMINT\b/, 1 ],
  [ /\bSMALLINT\b/, 1 ],
  [ /\bBIGINT\b/, 1 ],
];

// 权重含义同 mysqlPatterns
const postgresPatterns: [RegExp, number][] = [
  [ /::\w+(?:\([^)]*\))?/, 5 ],
  [ /\bILIKE\b/i, 5 ],
  [ /\bSERIAL\b(?!\s*IZABLE)/, 5 ],
  [ /\bBIGSERIAL\b/, 5 ],
  [ /\bSMALLSERIAL\b/, 5 ],
  [ /\bRETURNING\b/, 5 ],
  [ /\bARRAY\s*\[/, 5 ],
  [ /\$\$/, 5 ],
  [ /\bON\s+CONFLICT\b/, 4 ],
  [ /\bDISTINCT\s+ON\b/, 4 ],
  [ /\bTABLESPACE\b/, 3 ],
  [ /\bCONCURRENTLY\b/, 3 ],
  [ /\bNOWAIT\b/, 3 ],
  [ /\bSKIP\s+LOCKED\b/, 3 ],
  [ /\bEXCLUDE\s+USING\b/, 3 ],
  [ /\bGENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY\b/, 4 ],
  [ /\bCITEXT\b/i, 3 ],
  [ /\bJSONB\b/i, 3 ],
  [ /\bXML\b/i, 2 ],
  [ /\bBOOLEAN\b/i, 2 ],
];

function scoreDialect(sql: string, patterns: [RegExp, number][]): number {
  return patterns.reduce((sum, [re, weight]) => {
    re.lastIndex = 0; // 重置 lastIndex，防止全局正则的 .test() 产生交替结果
    return sum + (re.test(sql) ? weight : 0);
  }, 0);
}

/** 自动检测 SQL 方言，仅当调用方未显式指定 language 时使用 */
export function detectDialect(sql: string): Dialect {
  const mysqlScore = scoreDialect(sql, mysqlPatterns);
  const pgScore = scoreDialect(sql, postgresPatterns);

  if (mysqlScore > pgScore) return 'mysql';
  if (pgScore > mysqlScore) return 'postgresql';
  return 'mysql';
}
