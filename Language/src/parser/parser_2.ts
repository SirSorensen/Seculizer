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
const latexLiteral = createToken({
  name: "latexLiteral",
  pattern: /\$([^$])*\$/,
})
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

const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
})

//Sequence = Precedence
const allTokens = [
  WhiteSpace,
  NumberLiteral,
  StringLiteral,
  latexLiteral,
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
    this.CONSUME(Semicolon);
  });

  private participant = this.RULE("participant", () => {
    this.CONSUME(Id);
  });

  private knowledgeList = this.RULE("knowledgeList", () => {
    this.CONSUME(LeftBrace);
    this.MANY({
      DEF: () => this.SUBRULE(this.knowledge),
    });
    this.CONSUME(RightBrace);
    this.CONSUME(Semicolon);
  });

  private knowledge = this.RULE("knowledge", () => {
    this.CONSUME(Id);
    this.CONSUME(Colon);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.OR([
        { ALT: () => this.SUBRULE(this.function) },
        { ALT: () => this.CONSUME1(Id) },
      ]),
    });
    this.CONSUME(Semicolon);
  });

  private functionsDef = this.RULE("functionsDef", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.functionItem),
    });
    this.CONSUME(Semicolon);
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
    this.CONSUME(Semicolon);
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
    this.CONSUME(Semicolon);
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
    this.CONSUME(latexLiteral);
  });

  private protocol = this.RULE("protocol", () => {
    this.CONSUME(LeftBrace);
    this.MANY(() => this.SUBRULE(this.statement));
    this.CONSUME(RightBrace);
    this.CONSUME(Semicolon);
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
    this.CONSUME(Semicolon);
  });

  private clear = this.RULE("clear", () => {
    this.CONSUME(Clear);
    this.CONSUME(Id);
  });

  private participantStatement = this.RULE("participantStatement", () => {
    this.CONSUME(Id);
    this.CONSUME(Colon);
    this.OR([
      { ALT: () => this.SUBRULE(this.new) },
      { ALT: () => this.SUBRULE(this.set) },
    ]);
  });

  private new = this.RULE("new", () => {
    this.CONSUME(New);
    this.CONSUME(Id);
  });

  private set = this.RULE("set", () => {
    this.CONSUME(Id);
    this.CONSUME(Set);
    this.SUBRULE(this.type);
  });

  private match = this.RULE("match", () => {
    this.CONSUME(Match);
    this.CONSUME(LeftBrace);
    this.MANY(() => this.SUBRULE(this.matchCase));
    this.CONSUME(RightBrace);
  });

  private matchCase = this.RULE("matchCase", () => {
    this.SUBRULE(this.type);
    this.CONSUME2(Colon);
    this.CONSUME(LeftBrace);
    this.MANY(this.statement);
    this.CONSUME(RightBrace);
    this.CONSUME2(Semicolon);
  });

  private messageSend = this.RULE("messageSend", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.messageSendElement),
    });
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
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.expression),
    });
    this.CONSUME(RightBrace);
    this.SUBRULE1(this.expression);
  });

  private sign = this.RULE("sign", () => {
    this.CONSUME(LeftBrace);
    this.CONSUME(Pipe);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.expression),
    });
    this.CONSUME1(Pipe);
    this.CONSUME(RightBrace);
    this.SUBRULE1(this.expression);
  });

}
