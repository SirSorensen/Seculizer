import { createToken, CstParser, Lexer } from "chevrotain";

export const Id = createToken({ name: "Id", pattern: /[a-zA-Z_][a-zA-Z0-9_]*/ });
export const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?[0-9]+/,
});
export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"([^\\"]|\\")*"/,
});
export const Participants = createToken({
  name: "Participants",
  pattern: /Participants:/,
});
export const latexLiteral = createToken({
  name: "latexLiteral",
  pattern: /\$([^$])*\$/,
});
export const Knowledge = createToken({ name: "Knowledge", pattern: /Knowledge:/ });
export const KeyRelations = createToken({
  name: "KeyRelations",
  pattern: /KeyRelations:/,
});
export const Icons = createToken({ name: "Icons", pattern: /Icons:/ });
export const Functions = createToken({ name: "Functions", pattern: /Functions:/ });
export const Equations = createToken({ name: "Equations", pattern: /Equations:/ });
export const Format = createToken({ name: "Format", pattern: /Format:/ });
export const Protocol = createToken({ name: "Protocol", pattern: /Protocol:/ });
export const secretKey = createToken({ name: "secretKey", pattern: /sk/ });
export const publicKey = createToken({ name: "publicKey", pattern: /pk/ });
export const Clear = createToken({ name: "Clear", pattern: /clear/ });
export const New = createToken({ name: "New", pattern: /new/ });
export const Match = createToken({ name: "Match", pattern: /match/ });
export const LeftBrace = createToken({ name: "LeftBrace", pattern: /{/ });
export const RightBrace = createToken({ name: "RightBrace", pattern: /}/ });
export const LeftParen = createToken({ name: "LeftParen", pattern: /\(/ });
export const RightParen = createToken({ name: "RightParen", pattern: /\)/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const Arrow = createToken({ name: "Arrow", pattern: /->/ });
export const Equal = createToken({ name: "Equal", pattern: /=/ });
export const Set = createToken({ name: "Set", pattern: /:=/ });
export const Slash = createToken({ name: "Slash", pattern: /\// });
export const Pipe = createToken({ name: "Pipe", pattern: /\|/ });
export const Dollar = createToken({ name: "Dollar", pattern: /\$/ });
export const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
export const End = createToken({ name: "End", pattern: /eof/ });

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

//Sequence = Precedence
export const allTokens = [
  WhiteSpace,
  NumberLiteral,
  StringLiteral,
  latexLiteral,
  Participants,
  Knowledge,
  KeyRelations,
  Icons,
  Functions,
  Equations,
  Format,
  Protocol,
  secretKey,
  publicKey,
  Clear,
  New,
  Set,
  Match,
  LeftBrace,
  RightBrace,
  LeftParen,
  RightParen,
  Comma,
  Colon,
  Arrow,
  Semicolon,
  End,
  Slash,
  Equal,
  Pipe,
  Dollar,
  Id,
];
// Define the lexer
export const SepoLexer = new Lexer(allTokens);
