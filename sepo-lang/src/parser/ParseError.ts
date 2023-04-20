import { IToken } from "chevrotain";

interface IError {
  refCode: string;
  message: (token: IToken) => string;
}

export class ParseError extends Error {
  location: { line: number; column: number; start: number; end: number; indent: number };
  msg: string;
  constructor(msg: string, token: IToken, location: { line: number; column: number; start: number; end: number; indent: number }) {
    super(`${msg} ${token ? "Line: " + token.startLine + ":" + getIndent(token) : ""}`);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ParseError.prototype);
    this.location = location;
    this.name = "ParserError";
    this.msg = msg;
  }
}

const getIndent = (token: IToken): number => (token ? token.startColumn ?? -1 : -1);

export const throwParseError = (errorMsg: IError, token: IToken, template: string) => {
  const error = new ParseError(`${errorMsg.refCode}: ${errorMsg.message(token)}`, token, {
    line: token.startLine ?? -1,
    column: token.startColumn ?? -1,
    start: token.startOffset,
    end: token.endOffset || -1,
    indent: getIndent(token),
  });
  if (token) {
    error.stack = template.split("\n")[(token.startLine ?? 0) - 1] + "\n" + " ".repeat(getIndent(token) - 1) + "^\n" + error.stack;
  }

  throw error;
};

export const throwSimpleParseError = (errorMsg: string, token: IToken, template: string) => {
  const error = new ParseError(errorMsg, token, {
    line: token.startLine ?? -1,
    column: token.startColumn ?? -1,
    start: token.startOffset,
    end: token.endOffset || -1,
    indent: getIndent(token),
  });
  error.name = "ParserError";
  if (token) {
    error.stack = template.split("\n")[(token.startLine ?? 0) - 1] + "\n" + " ".repeat(getIndent(token) - 1) + "^\n" + error.stack;
  }

  throw error;
};

export const ParseErrorTypes = {
  unknown_type: () => ({
    refCode: "unknown_type",
    message: (token: IToken) => `Unknown type: ${token.tokenType.name}:${token.image}`,
  }),
  unexpected_type: (expectedType: string) => ({
    refCode: "unexpected_type",
    message: (token: IToken) => `Unexpected type ${token.tokenType.name}:${token.image}! Expected a ${expectedType}`,
  }),
  unexpected_value: (expectedValue: string) => ({
    refCode: "unexpected_value",
    message: (token: IToken) => `Unexpected value ${token.image}! Expected a ${expectedValue}`,
  }),
  unexpected_EOF: () => ({
    refCode: "unexpected_EOF",
    message: (_: IToken) => `Unexpected end of file!`,
  }),
  unexpected_delimiter: () => ({
    refCode: "unexpected_delimiter",
    message: (token: IToken) => `Unexpected delimiter ${token.image}!`,
  }),
  unexpected_top_level: () => ({
    refCode: "unexpected_top_level",
    message: (token: IToken) => `Unexpected top level token ${token.image}!`,
  }),
};
