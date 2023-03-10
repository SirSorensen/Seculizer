import { IToken } from "chevrotain";

interface IError {
  refCode: string;
  message: (token: IToken) => string;
}

const getIndent = (token: IToken): number =>
  token ? token.startColumn ?? -1 : -1;

export const throwParseError = (
  errorMsg: IError,
  token: IToken,
  template: string
) => {
  const error = new Error(
    `${errorMsg.refCode}: ${errorMsg.message(token)} ${token ? 'Line: ' + token.startLine + ":"+ getIndent(token) : ""}`
  );
  error.name = "ParserError";
  if (token) {
    error.stack =
      template.split("\n")[(token.startLine ?? 0) - 1] +
      "\n" +
      " ".repeat(getIndent(token) - 1) +
      "^\n" +
      error.stack;
  }

  throw error;
};

export const throwSimpleParseError = (
  errorMsg: String,
  token: IToken,
  template: string
) => {
  const error = new Error(
    `${errorMsg} ${token ? 'Line: ' + token.startLine + ":"+ getIndent(token) : ""}`
  );
  error.name = "ParserError";
  if (token) {
    error.stack =
      template.split("\n")[(token.startLine ?? 0)-1] +
      "\n" +
      " ".repeat(getIndent(token) - 1) +
      "^\n" +
      error.stack;
  }

  throw error;
};

export const ParseError = {
  unknown_type: () => ({
    refCode: "unknown_type",
    message: (token: IToken) =>
      `Unknown type: ${token.tokenType.name}:${token.image}`,
  }),
  unexpected_type: (expectedType: string) => ({
    refCode: "unexpected_type",
    message: (token: IToken) =>
      `Unexpected type ${token.tokenType.name}:${token.image}! Expected a ${expectedType}`,
  }),
  unexpected_value: (expectedValue: string) => ({
    refCode: "unexpected_value",
    message: (token: IToken) =>
      `Unexpected value ${token.image}! Expected a ${expectedValue}`,
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
