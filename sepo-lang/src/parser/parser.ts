import { CstParser } from "chevrotain";
import {
  Arrow,
  Clear,
  Colon,
  Comma,
  End,
  ArrowEqual,
  Equal,
  Equations,
  Format,
  Functions,
  Icons,
  Id,
  KeyRelations,
  Knowledge,
  LeftBrace,
  LeftParen,
  Match,
  New,
  NumberLiteral,
  Participants,
  Pipe,
  Protocol,
  RightBrace,
  RightParen,
  Semicolon,
  Slash,
  StringLiteral,
  allTokens,
  TexLiteral,
  publicKey,
  secretKey,
  Set,
  QuestionMark,
} from "./lexer.js";
//Lexical Tokens

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
      this.CONSUME(Knowledge);
      this.SUBRULE(this.knowledgeList);
    });
    this.OPTION1(() => {
      this.CONSUME(KeyRelations);
      this.SUBRULE(this.keyRelationList);
    });
    this.OPTION2(() => {
      this.CONSUME(Functions);
      this.SUBRULE(this.functionsDef);
    });
    this.OPTION3(() => {
      this.CONSUME(Equations);
      this.SUBRULE(this.equation);
    });
    this.OPTION4(() => {
      this.CONSUME(Format);
      this.SUBRULE(this.format);
    });
    this.OPTION5(() => {
      this.CONSUME(Icons);
      this.SUBRULE(this.icons);
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
      DEF: () => this.SUBRULE(this.knowledgeItem),
    });
    this.CONSUME(Semicolon);
  });
  private knowledgeItem = this.RULE("knowledgeItem", () => {
    this.SUBRULE(this.type);
    this.OPTION(() => this.SUBRULE(this.stmtComment));
  });

  private keyRelationList = this.RULE("keyRelationList", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.keyRelation),
    });
    this.CONSUME(Semicolon);
  });

  private keyRelation = this.RULE("keyRelation", () => {
    this.CONSUME(LeftParen);
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.secretKeyRelation);
          this.CONSUME(Comma);
          this.SUBRULE(this.publicKeyRelation);
        },
      },
      {
        ALT: () => {
          this.SUBRULE1(this.publicKeyRelation);
          this.CONSUME1(Comma);
          this.SUBRULE1(this.secretKeyRelation);
        },
      },
    ]);
    this.CONSUME(RightParen);
  });

  private secretKeyRelation = this.RULE("secretKeyRelation", () => {
    this.CONSUME(secretKey);
    this.CONSUME(Colon);
    this.CONSUME(Id);
  });

  private publicKeyRelation = this.RULE("publicKeyRelation", () => {
    this.CONSUME(publicKey);
    this.CONSUME(Colon);
    this.CONSUME(Id);
  });

  private function = this.RULE("function", () => {
    this.CONSUME(Id);
    this.CONSUME(LeftParen);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.type),
    });
    this.CONSUME(RightParen);
  });

  private participants = this.RULE("participants", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.participantItem),
    });
    this.CONSUME(Semicolon);
  });

  private participantItem = this.RULE("participantItem", () => {
    this.SUBRULE(this.participant);
    this.OPTION(() => this.SUBRULE(this.stmtComment));
  });

  private participant = this.RULE("participant", () => {
    this.CONSUME(Id);
  });

  private functionsDef = this.RULE("functionsDef", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.CONSUME(Id),
    });
    this.CONSUME(Semicolon);
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
    this.CONSUME(ArrowEqual);
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
    this.SUBRULE(this.type);
    this.CONSUME(Equal);
    this.OR([{ ALT: () => this.CONSUME(StringLiteral) }, { ALT: () => this.SUBRULE(this.Tex) }]);
  });

  private icons = this.RULE("icons", () => {
    this.CONSUME(LeftBrace);
    this.MANY(() => {
      this.SUBRULE(this.iconSet);
    });
    this.CONSUME(RightBrace);
    this.CONSUME1(Semicolon);
  });

  private iconSet = this.RULE("iconSet", () => {
    this.CONSUME(StringLiteral);
    this.CONSUME(Colon);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.CONSUME(Id),
    });
    this.CONSUME(Semicolon);
  });

  private Tex = this.RULE("Tex", () => {
    this.CONSUME(TexLiteral);
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
      {
        ALT: () => {
          this.CONSUME(Id);
          this.CONSUME(Arrow);
          this.CONSUME1(Id);
          this.CONSUME(Colon);
          this.OR1([{ ALT: () => this.SUBRULE(this.match) }, { ALT: () => this.SUBRULE(this.messageSend) }]);
        },
      },
    ]);
    this.CONSUME(Semicolon);
    this.OPTION(() => this.SUBRULE(this.stmtComment));
  });

  private stmtComment = this.RULE("stmtComment", () => {
    this.CONSUME(QuestionMark);
    this.OR([{ ALT: () => this.CONSUME(StringLiteral) }, { ALT: () => this.SUBRULE(this.Tex) }]);
  });

  private clear = this.RULE("clear", () => {
    this.CONSUME(Clear);
    this.CONSUME(Colon);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.CONSUME1(Id),
    });
  });

  private participantStatement = this.RULE("participantStatement", () => {
    this.CONSUME(Id);
    this.CONSUME(Colon);
    this.OR([{ ALT: () => this.SUBRULE(this.new) }, { ALT: () => this.SUBRULE(this.set) }]);
  });

  private new = this.RULE("new", () => {
    this.CONSUME(New);
    this.OR([{ ALT: () => this.SUBRULE(this.function) }, { ALT: () => this.CONSUME(Id) }]);
    this.OPTION(() => {
      this.SUBRULE(this.stmtComment);
    });
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
    this.MANY(() => this.SUBRULE(this.statement));
    this.CONSUME(RightBrace);
    this.CONSUME2(Semicolon);
  });

  private messageSend = this.RULE("messageSend", () => {
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.expression),
    });
  });

  private expression = this.RULE("expression", () => {
    this.OR([{ ALT: () => this.SUBRULE(this.type) }, { ALT: () => this.SUBRULE(this.encrypt) }, { ALT: () => this.SUBRULE(this.sign) }]);
  });

  private encrypt = this.RULE("encrypt", () => {
    this.CONSUME(LeftBrace);
    this.MANY_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.expression),
    });
    this.CONSUME(RightBrace);
    this.SUBRULE(this.type);
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
    this.SUBRULE(this.type);
  });
}
