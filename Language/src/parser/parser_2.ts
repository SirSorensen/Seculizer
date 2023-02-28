import { createToken, CstParser, Lexer } from "chevrotain";

//Lexical Tokens
const Id = createToken({ name: "Id", pattern: /[a-zA-Z_][a-zA-Z0-9_]*/ });
const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?[0-9]+/,
});
const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"([^\\"]|\\")*"/,
});
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
const Match = createToken({ name: "Match", pattern: /match/ });
const LeftBrace = createToken({ name: "LeftBrace", pattern: /{/ });
const RightBrace = createToken({ name: "RightBrace", pattern: /}/ });
const LeftParen = createToken({ name: "LeftParen", pattern: /\(/ });
const RightParen = createToken({ name: "RightParen", pattern: /\)/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const Arrow = createToken({ name: "Arrow", pattern: /->/ });
const Equal = createToken({ name: "Equal", pattern: /=/ });
const Set = createToken({ name: "Set", pattern: /:=/ });
const Slash = createToken({ name: "Slash", pattern: /\// });
const As = createToken({ name: "As", pattern: /as/ });
const Pipe = createToken({ name: "Pipe", pattern: /\|/ });
const Dollar = createToken({ name: "Dollar", pattern: /\$/ });
const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
const End = createToken({ name: "End", pattern: /eof/ });
//Sequence = Precedence
const allTokens = [
  NumberLiteral,
  StringLiteral,
  Participants,
  Knowledge,
  Functions,
  Equations,
  Format,
  Protocol,
  Clear,
  New,
  Match,
  LeftBrace,
  RightBrace,
  LeftParen,
  RightParen,
  Comma,
  Colon,
  Arrow,
  As,
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


//Parser
export class SepoParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  program = this.RULE("program", () => {
    this.CONSUME(Participants);
    this.SUBRULE(this.participants);
    this.OPTION(() => {
      this.CONSUME(Functions);
      this.SUBRULE(this.functionsDef);
    });
    this.OPTION1(() => {
      this.CONSUME(Equations);
      this.SUBRULE(this.equation);
    });
    this.OPTION2(() => {
      this.CONSUME(Format);
      this.SUBRULE(this.format);
    });
    this.OPTION3(() => {
      this.CONSUME(Knowledge);
      this.SUBRULE(this.knowledgeList);
    });
    this.CONSUME(Protocol);
    this.SUBRULE(this.protocol);
    this.CONSUME(End);
  });

  private type = this.RULE("type", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.function) },
      { ALT: () => this.CONSUME(Id) },
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(StringLiteral) },
    ]);
  });

  private function = this.RULE("function", () => {
    this.CONSUME(Id);
    this.CONSUME(LeftParen);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () =>
        this.OR([
          { ALT: () => this.SUBRULE(this.function) },
          { ALT: () => this.CONSUME1(Id) },
        ]),
    });
    this.CONSUME(RightParen);
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

  private knowledgeList = this.RULE("knowledgeList", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.knowledgeItem),
    });
  });

  private knowledgeItem = this.RULE("knowledgeItem", () => {
    this.CONSUME(Id);
    this.CONSUME(Colon);
    this.SUBRULE(this.knowledge);
  });

  private knowledge = this.RULE("knowledge", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.function) },
      { ALT: () => this.CONSUME(Id) },
    ]);
  });

  private functionsDef = this.RULE("functionsDef", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.functionItem),
    });
  });

  private functionItem = this.RULE("functionItem", () => {
    this.CONSUME(Id);
    this.CONSUME(Slash);
    this.CONSUME(NumberLiteral);
  });

  private equation = this.RULE("equation", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.equationElement),
    });
  });

  private equationElement = this.RULE("equationElement", () => {
    this.SUBRULE(this.function);
    this.CONSUME(Equal);
    this.SUBRULE1(this.function);
  });

  private format = this.RULE("format", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.formatElement),
    });
  });

  private formatElement = this.RULE("formatElement", () => {
    this.SUBRULE(this.function);
    this.CONSUME(Equal);
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.SUBRULE(this.latex) },
    ]);
  });

  private latex = this.RULE("latex", () => {
    this.CONSUME(Dollar);
    this.CONSUME(StringLiteral);
    this.CONSUME1(Dollar);
  });

  private protocol = this.RULE("protocol", () => {
    this.MANY(() => this.SUBRULE(this.statement));
  });

  private statement = this.RULE("statement", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.clear) },
      { ALT: () => this.SUBRULE(this.participantStatement) },
      { ALT: () => {
        this.CONSUME(Id);
        this.CONSUME(Arrow);
        this.CONSUME1(Id);
        this.CONSUME(Colon);
        this.OR1([
          { ALT: () => this.SUBRULE(this.match) },
          { ALT: () => this.SUBRULE(this.messageSend) },
        ])
      }},
    ]);
  });

  private clear = this.RULE("clear", () => {
    this.CONSUME(Clear);
    this.CONSUME(Id);
    this.CONSUME(Semicolon);
  });

  private participantStatement = this.RULE("participantStatement", () => {
    this.CONSUME(Id);
    this.CONSUME(Colon);
    this.OR([
      { ALT: () => this.SUBRULE(this.new) },
      { ALT: () => this.SUBRULE(this.set) },
    ]);
    this.CONSUME(Semicolon);
  });

  private new = this.RULE("new", () => {
    this.CONSUME(New);
    this.CONSUME(Id);
    this.CONSUME(Semicolon);
  });

  private set = this.RULE("set", () => {
    this.CONSUME(Id);
    this.CONSUME(Set);
    this.SUBRULE(this.type);
    this.CONSUME(Semicolon);
  });

  private match = this.RULE("match", () => {
    this.CONSUME(Match);
    this.CONSUME(LeftBrace);
    this.MANY(() => this.SUBRULE(this.matchCase));
    this.CONSUME(RightBrace);
  });

  private matchCase = this.RULE("matchCase", () => {
    this.SUBRULE(this.type);
    this.CONSUME(Colon);
    this.SUBRULE(this.statement);
  });

  private messageSend = this.RULE("messageSend", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.messageSendElement),
    });
    this.CONSUME(Semicolon);
  });

  private messageSendElement = this.RULE("messageSendElement", () => {
    this.SUBRULE(this.expression);
    this.OPTION(() => {
      this.CONSUME(As);
      this.CONSUME(Id);
    });
  });

  private expression = this.RULE("expression", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.type) },
      { ALT: () => this.SUBRULE(this.encrypt) },
      { ALT: () => this.SUBRULE(this.sign) },
    ]);
  });

  private encrypt = this.RULE("encrypt", () => {
    this.CONSUME(LeftBrace);
    this.SUBRULE(this.expessionList);
    this.CONSUME(RightBrace);
  });

  private sign = this.RULE("sign", () => {
    this.CONSUME(LeftBrace);
    this.CONSUME(Pipe);
    this.SUBRULE(this.expessionList);
    this.CONSUME1(Pipe);
    this.CONSUME(RightBrace);
  });

  private expessionList = this.RULE("expessionList", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.expression),
    });
  });
}
