import React from 'react';

interface PythonHighlightProps {
  code: string;
}

type TokenType = 'keyword' | 'builtin' | 'string' | 'comment' | 'number' | 'decorator' | 'operator' | 'plain';

interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
  'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
  'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
  'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
  'try', 'while', 'with', 'yield',
]);

const BUILTINS = new Set([
  'print', 'len', 'range', 'int', 'str', 'float', 'list', 'dict',
  'set', 'tuple', 'bool', 'type', 'isinstance', 'open', 'input',
  'enumerate', 'zip', 'map', 'filter', 'sorted', 'reversed',
  'sum', 'min', 'max', 'abs', 'round', 'super', 'self',
]);

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // Comment
    if (line[i] === '#') {
      tokens.push({ type: 'comment', value: line.slice(i) });
      break;
    }

    // String (single or double quote)
    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      let j = i + 1;
      // Triple quote
      if (line.slice(i, i + 3) === quote.repeat(3)) {
        j = i + 3;
        while (j < line.length && line.slice(j, j + 3) !== quote.repeat(3)) j++;
        j += 3;
      } else {
        while (j < line.length && line[j] !== quote) {
          if (line[j] === '\\') j++;
          j++;
        }
        j++;
      }
      tokens.push({ type: 'string', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Number
    if (/[0-9]/.test(line[i]) || (line[i] === '-' && /[0-9]/.test(line[i + 1] || ''))) {
      let j = i;
      if (line[j] === '-') j++;
      while (j < line.length && /[0-9._xXbBoO]/.test(line[j])) j++;
      tokens.push({ type: 'number', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Decorator
    if (line[i] === '@') {
      let j = i + 1;
      while (j < line.length && /[\w.]/.test(line[j])) j++;
      tokens.push({ type: 'decorator', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Word (keyword, builtin, or identifier)
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[\w]/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (BUILTINS.has(word)) {
        tokens.push({ type: 'builtin', value: word });
      } else {
        tokens.push({ type: 'plain', value: word });
      }
      i = j;
      continue;
    }

    // Operator / punctuation
    if (/[+\-*/%=<>!&|^~:,.()\[\]{}]/.test(line[i])) {
      tokens.push({ type: 'operator', value: line[i] });
      i++;
      continue;
    }

    // Whitespace and other
    tokens.push({ type: 'plain', value: line[i] });
    i++;
  }

  return tokens;
}

const TOKEN_CLASSES: Record<TokenType, string> = {
  keyword: 'text-code-keyword font-semibold',
  builtin: 'text-code-builtin',
  string: 'text-code-string',
  comment: 'text-code-comment italic',
  number: 'text-code-number',
  decorator: 'text-code-decorator',
  operator: 'text-muted-foreground',
  plain: 'text-foreground',
};

const PythonHighlight: React.FC<PythonHighlightProps> = ({ code }) => {
  const lines = code.split('\n');

  return (
    <div className="code-block p-4 overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, lineIdx) => {
            const tokens = tokenizeLine(line);
            return (
              <tr key={lineIdx} className="group">
                <td className="select-none pr-4 text-right text-code-comment w-8 text-xs leading-7 align-top">
                  {lineIdx + 1}
                </td>
                <td className="font-mono text-sm leading-7 whitespace-pre">
                  {tokens.length === 0 ? (
                    <span>&nbsp;</span>
                  ) : (
                    tokens.map((token, tokenIdx) => (
                      <span key={tokenIdx} className={TOKEN_CLASSES[token.type]}>
                        {token.value}
                      </span>
                    ))
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PythonHighlight;
