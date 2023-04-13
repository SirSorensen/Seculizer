import { SepoParser } from "./parser.js";
import { throwSimpleParseError } from "./ParseError";
import {
  ClearCST,
  ClearStatement,
  EncryptCST,
  EncryptExpression,
  Equation,
  EquationCST,
  EquationElementCST,
  Equations,
  Expression,
  ExpressionCST,
  Format,
  FormatCST,
  FormatElementCST,
  FormatItem,
  FunctionCall,
  FunctionCallCST,
  FunctionDefItem,
  FunctionItemCST,
  FunctionsDef,
  FunctionsDefCST,
  Icons,
  IconsCST,
  IconSetCST,
  Id,
  KeyRelation,
  KeyRelationCST,
  KeyRelationListCST,
  KeyRelations,
  Knowledge,
  KnowledgeCST,
  KnowledgeItem,
  KnowledgeItemCST,
  KnowledgeListCST,
  LatexCST,
  LatexLiteral,
  MatchCase,
  MatchCaseCST,
  MatchCST,
  MatchStatement,
  MessageSendCST,
  MessageSendStatement,
  NewCST,
  NewStatement,
  ParticipantCST,
  ParticipantItem,
  ParticipantItemCST,
  Participants,
  ParticipantsCST,
  ParticipantStatement,
  ParticipantStatementCST,
  ProgramCST,
  Protocol,
  ProtocolCST,
  PublicKeyRelationCST,
  SecretKeyRelationCST,
  SendStatement,
  SendStatementNode,
  SetCST,
  SetStatement,
  SignCST,
  SignExpression,
  Statement,
  StatementCST,
  StmtCommentCST,
  Type,
  TypeCST,
} from "./interfaces.js";
import { IToken } from "chevrotain";
import { StmtComment, Participant } from './interfaces';
const parserInstance = new SepoParser();

const BaseSepoVisitor = parserInstance.getBaseCstVisitorConstructor();

export class SepoToAstVisitor extends BaseSepoVisitor {
  template: string;
  constructor(template: string) {
    super();
    this.template = template;
    this.validateVisitor();
  }

  program(ctx: ProgramCST) {
    const participants = this.visit(ctx.participants);
    const knowledge = this.visit(ctx.knowledgeList);
    const keyRelations = this.visit(ctx.keyRelationList);
    const functions = this.visit(ctx.functionsDef);
    const equations = this.visit(ctx.equation);
    const format = this.visit(ctx.format);
    const icon = this.visit(ctx.icons);
    const protocol = this.visit(ctx.protocol);

    return {
      type: "program",
      participants: participants,
      knowledge: knowledge,
      keyRelations: keyRelations,
      functions: functions,
      equations: equations,
      format: format,
      icons: icon,
      protocol: protocol,
    };
  }

  type(ctx: TypeCST): Type {
    const functionChild = this.visit(ctx.function);
    if (functionChild) {
      return functionChild;
    }
    const idChild = ctx.Id;
    if (idChild && idChild.length > 0) {
      return {
        type: "id",
        value: idChild[0].image,
      };
    }
    const numberChild = ctx.NumberLiteral;
    if (numberChild && numberChild.length > 0) {
      return {
        type: "number",
        value: parseInt(numberChild[0].image),
      };
    }
    const stringChild = ctx.StringLiteral;
    if (stringChild && stringChild.length > 0) {
      return {
        type: "string",
        value: stringChild[0].image,
      };
    }

    return throwSimpleParseError("Unknown type", ctx[Object.keys(ctx)[0]][0], this.template);
  }

  knowledgeList(ctx: KnowledgeListCST): Knowledge {
    const knowledge: KnowledgeItem[] = ctx.knowledge.map((k: KnowledgeCST) => this.visit(k));
    return {
      type: "knowledge",
      knowledge: knowledge,
    };
  }

  knowledge(ctx: KnowledgeCST): KnowledgeItem {    
    const id: string = ctx.Id[0].image;
    const children = ctx.knowledgeItem.map((k: KnowledgeItemCST) => this.visit(k));
    return {
      type: "knowledgeItem",
      id: {
        type: "id",
        value: id,
      },
      children: children,
    };
  }

  knowledgeItem(ctx:KnowledgeItemCST):{value: Type, comment?: StmtComment}{
    const type:Type = this.visit(ctx.type);
    const comment:(StmtComment | undefined) = ctx.stmtComment ? this.visit(ctx.stmtComment) : undefined;
    return {
      value: type,
      comment: comment,
    };
  }

  keyRelationList(ctx: KeyRelationListCST): KeyRelations {
    const keyRelations = ctx.keyRelation.map((k: KeyRelationCST) => this.visit(k));
    return {
      type: "keyRelations",
      keyRelations: keyRelations,
    };
  }

  keyRelation(ctx: KeyRelationCST): KeyRelation {
    const sk = this.visit(ctx.secretKeyRelation);
    const pk = this.visit(ctx.publicKeyRelation);
    return {
      type: "keyRelation",
      sk: sk,
      pk: pk,
    };
  }

  secretKeyRelation(ctx: SecretKeyRelationCST): Id {
    const id: string = ctx.Id[0].image;
    return {
      type: "id",
      value: id,
    };
  }

  publicKeyRelation(ctx: PublicKeyRelationCST): Id {
    const id: string = ctx.Id[0].image;
    return {
      type: "id",
      value: id,
    };
  }

  function(ctx: FunctionCallCST): FunctionCall {
    const id: string = ctx.Id[0].image;
    const params = ctx.type.map((p: TypeCST) => this.visit(p));
    return {
      type: "function",
      id: id,
      params: params,
    };
  }

  participants(ctx: ParticipantsCST): Participants {
    const participants = ctx.participantItem.map((p: ParticipantItemCST) => this.visit(p));

    return {
      type: "participants",
      participants: participants,
    };
  }

  participantItem(ctx: ParticipantItemCST): ParticipantItem {
    const participant: Participant = this.visit(ctx.participant);
    const comment: StmtComment | undefined = ctx.stmtComment ? this.visit(ctx.stmtComment) : undefined;
    return {
      type: "participantItem",
      id: participant.id,
      comment: comment,
    };
  }

  participant(ctx: ParticipantCST): Participant {
    const id: string = ctx.Id[0].image;
    return {
      type: "participant",
      id: {
        type: "id",
        value: id,
      },
    };
  }

  functionsDef(ctx: FunctionsDefCST): FunctionsDef {
    const functions = ctx.functionItem.map((f: FunctionItemCST) => this.visit(f));
    return {
      type: "functionsDef",
      functions: functions,
    };
  }

  functionItem(ctx: FunctionItemCST): FunctionDefItem {
    const id: string = ctx.Id[0].image;
    const params = parseInt(ctx.NumberLiteral[0].image);
    return {
      type: "functionDef",
      id: {
        type: "id",
        value: id,
      },
      params: params,
    };
  }

  equation(ctx: EquationCST): Equations {
    const equations = ctx.equationElement.map((e: EquationElementCST) => this.visit(e));
    return {
      type: "equations",
      equations: equations,
    };
  }

  equationElement(ctx: EquationElementCST): Equation {
    const leftFunction = this.visit(ctx.function[0]);
    const rightFunction = this.visit(ctx.function[1]);
    return {
      type: "equation",
      left: leftFunction,
      right: rightFunction,
    };
  }

  format(ctx: FormatCST): Format {
    const formats = ctx.formatElement.map((f: FormatElementCST) => this.visit(f));
    return {
      type: "format",
      formats: formats,
    };
  }

  formatElement(ctx: FormatElementCST): FormatItem {
    const id = this.visit(ctx.type);
    const string = ctx.StringLiteral;
    if (string && string.length > 0) {
      return {
        type: "formatItem",
        id: id,
        format: { type: "string", value: string[0].image.slice(1, -1) },
      };
    }
    const latex = this.visit(ctx.latex);
    return {
      type: "formatItem",
      id: id,
      format: latex,
    };
  }

  latex(ctx: LatexCST): LatexLiteral {
    let latex = ctx.latexLiteral[0].image;
    return {
      type: "latex",
      value: latex,
    };
  }

  protocol(ctx: ProtocolCST): Protocol {
    const statements = ctx.statement.map((s: StatementCST) => this.visit(s));
    return {
      type: "protocol",
      statements: statements,
    };
  }

  icons(ctx: IconsCST): Icons {
    let map = new Map<string, string>();

    ctx.iconSet.forEach((icon: IconSetCST) => {
      let set = this.visit(icon);
      set.ids.forEach((id: Id) => {
        map.set(id.value, set.emoji);
      });
    });

    return {
      type: "icons",
      icons: map,
    };
  }

  iconSet(ctx: IconSetCST): { emoji: string; ids: Id[] } {
    const emoji = ctx.StringLiteral[0].image.slice(1, -1);
    let ids: Id[] = ctx.Id.map((id: IToken) => ({ type: "id", value: id.image }));
    return { emoji: emoji, ids: ids };
  }

  statement(ctx: StatementCST): Statement {
    const comment = this.visit(ctx.stmtComment);
    const clear = this.visit(ctx.clear);
    if (clear) {
      return {
        type: "statement",
        child: clear,
        comment: comment,
      };
    }
    const participantStatement = this.visit(ctx.participantStatement);
    if (participantStatement) {
      return {
        type: "statement",
        child: participantStatement,
        comment: comment,
      };
    }
    if (ctx.Id && ctx.Id.length >= 2) {
      const leftId: string = ctx.Id[0].image;
      const rightId: string = ctx.Id[1].image;
      const match = this.visit(ctx.match);
      if (match) {
        let send: SendStatement = {
          type: "sendStatement",
          leftId: {
            type: "id",
            value: leftId,
          },
          rightId: {
            type: "id",
            value: rightId,
          },
          child: match,
        };
        return {
          type: "statement",
          child: send,
          comment: comment,
        };
      }
      const messageSend = this.visit(ctx.messageSend);
      if (messageSend) {
        let send: SendStatement = {
          type: "sendStatement",
          leftId: {
            type: "id",
            value: leftId,
          },
          rightId: {
            type: "id",
            value: rightId,
          },
          child: messageSend,
        };
        return {
          type: "statement",
          child: send,
          comment: comment,
        };
      }
    }
    return throwSimpleParseError("Uknown statement", ctx[Object.keys(ctx)[0]][0], this.template);
  }

  stmtComment(ctx: StmtCommentCST): StmtComment {
    const latexComment = this.visit(ctx.latex);
    if (latexComment) {
      return {
        type: "stmtComment",
        value: latexComment,
      };
    }
    const stringComment = ctx.StringLiteral[0].image;
    return {
      type: "stmtComment",
      value: { type: "string", value: stringComment.slice(1, -1) },
    };
  }

  clear(ctx: ClearCST): ClearStatement {
    const id: string = ctx.Id[0].image;
    return {
      type: "clearStatement",
      id: {
        type: "id",
        value: id,
      },
    };
  }

  participantStatement(ctx: ParticipantStatementCST): ParticipantStatement {
    const id: string = ctx.Id[0].image;
    const newStatement: NewStatement = this.visit(ctx.new);
    if (newStatement) {
      return {
        type: "participantStatement",
        id: {
          type: "id",
          value: id,
        },
        child: newStatement,
      };
    }
    const setStatement: SetStatement = this.visit(ctx.set);
    if (setStatement) {
      return {
        type: "participantStatement",
        id: {
          type: "id",
          value: id,
        },
        child: setStatement,
      };
    }
    //TODO THROW ERROR HERE and remove possibility of null
    return throwSimpleParseError("Uknown participant statement", ctx[Object.keys(ctx)[0]][0], this.template);
  }

  new(ctx: NewCST): NewStatement {
    const id: string = ctx.Id[0].image;
    const comment = ctx.stmtComment ? this.visit(ctx.stmtComment) : undefined;
    return {
      type: "newStatement",
      id: {
        type: "id",
        value: id,
      },
      comment: comment,
    };
  }

  set(ctx: SetCST): SetStatement {
    const id: string = ctx.Id[0].image;
    const type = this.visit(ctx.type);
    return {
      type: "setStatement",
      id: {
        type: "id",
        value: id,
      },
      value: type,
    };
  }

  match(ctx: MatchCST): MatchStatement {
    const cases: MatchCase[] = ctx.matchCase.map((c: MatchCaseCST) => this.visit(c));
    return {
      type: "matchStatement",
      cases: cases,
    };
  }

  matchCase(ctx: MatchCaseCST): MatchCase {
    const type: Type = this.visit(ctx.type);
    const statements: Statement[] = ctx.statement ? ctx.statement.map((s: StatementCST) => this.visit(s)) : [];
    return {
      type: "matchCase",
      case: type,
      children: statements,
    };
  }

  messageSend(ctx: MessageSendCST): MessageSendStatement {
    const elements = ctx.expression.map((e: ExpressionCST) => this.visit(e));
    return {
      type: "messageSendStatement",
      expressions: elements,
    };
  }

  expression(ctx: ExpressionCST): Expression {
    const type: Type = this.visit(ctx.type);
    if (type) {
      return {
        type: "expression",
        child: type,
      };
    }
    const encrypt = this.visit(ctx.encrypt);
    if (encrypt) {
      return {
        type: "expression",
        child: encrypt,
      };
    }
    const sign = this.visit(ctx.sign);
    if (sign) {
      return {
        type: "expression",
        child: sign,
      };
    }

    throw new Error("Expression not found");
  }

  encrypt(ctx: EncryptCST): EncryptExpression {
    const type: Type = this.visit(ctx.type);
    const expressions: Expression[] = ctx.expression.map((e: ExpressionCST) => this.visit(e));
    return {
      type: "encryptExpression",
      inner: expressions,
      outer: type,
    };
  }

  sign(ctx: SignCST): SignExpression {
    const type: Type = this.visit(ctx.type);
    const expressions: Expression[] = ctx.expression.map((e: ExpressionCST) => this.visit(e));
    return {
      type: "signExpression",
      inner: expressions,
      outer: type,
    };
  }
}
