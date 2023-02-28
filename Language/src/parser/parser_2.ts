import { createToken, CstParser, Lexer } from "chevrotain";
const Id = createToken({ name: "Id", pattern: /[a-zA-Z_][a-zA-Z0-9_]*/ });
const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?[0-9]+/,
});
const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"([^\\"]|\\")*"/,
});
const StringIdLiteral = createToken({
  name: "StringIdLiteral",
  pattern: /'([^\\']|\\')*'/,
});
const Function = createToken({ name: "Function", pattern: /function/ });
const Participants = createToken({
  name: "Participants",
  pattern: /Participants:/,
});
const Knowledge = createToken({ name: "Knowledge", pattern: /Knowledge:/ });
const Functions = createToken({ name: "Functions", pattern: /Functions:/ });
const Equations = createToken({ name: "Equations", pattern: /Equations:/ });
const Format = createToken({ name: "Format", pattern: /Format:/ });
const Protocol = createToken({ name: "Protocol", pattern: /Protocol:/ });
const Clear = createToken({ name: "Clear", pattern: /clear/ });
const New = createToken({ name: "New", pattern: /new/ });
const Set = createToken({ name: "Set", pattern: /:=/ });
const Match = createToken({ name: "Match", pattern: /match/ });
const LeftBrace = createToken({ name: "LeftBrace", pattern: /{/ });
const RightBrace = createToken({ name: "RightBrace", pattern: /}/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const Arrow = createToken({ name: "Arrow", pattern: /->/ });
const Slash = createToken({ name: "Slash", pattern: /\// });
const As = createToken({ name: "As", pattern: /as/ });
const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
const Eof = createToken({ name: "Eof", pattern: /eof/ });

const allTokens = [
  Id,
  NumberLiteral,
  StringLiteral,
  StringIdLiteral,
  Function,
  Participants,
  Knowledge,
  Functions,
  Equations,
  Format,
  Protocol,
  Clear,
  New,
  Set,
  Match,
  LeftBrace,
  RightBrace,
  Comma,
  Colon,
  Arrow,
  As,
  Semicolon,
  Eof,
  Slash,
];
// Define the lexer
const lexer = new Lexer(allTokens);

class SepoParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }
  private type = this.RULE("type", () => {
    this.OR([
      { ALT: () => this.CONSUME(Id) },
      { ALT: () => this.CONSUME(Number) },
      { ALT: () => this.CONSUME(String) },
      { ALT: () => this.SUBRULE(this.function) },
    ]);
  });
  private function = this.RULE("function", () => {
    this.CONSUME(Id);
    this.CONSUME(Slash);
    this.CONSUME(Number);
  });

  private participants = this.RULE("participants", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.participant),
    });
  });

  private participant = this.RULE("participant", () => {
    this.CONSUME(Id);
  });

  private knowledge = this.RULE("knowledge", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.knowledgeItem),
    });
  });

  private knowledgeItem = this.RULE("knowledgeItem", () => {
    this.CONSUME(Id);
    this.CONSUME(Colon);
    this.SUBRULE(this.type);
  });
}
