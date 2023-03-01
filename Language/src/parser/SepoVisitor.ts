import { SepoParser, SepoLexer } from "./parser_2.js";
const parserInstance = new SepoParser();

const BaseSepoVisitor = parserInstance.getBaseCstVisitorConstructor();

export class SepoToAstVisitor extends BaseSepoVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  program(ctx: any) {
    const participants = this.visit(ctx.participants);
    const functions = this.visit(ctx.functionsDef);
    const equations = this.visit(ctx.equation);
    const format = this.visit(ctx.format);
    const knowledge = this.visit(ctx.knowledgeList);
    const protocol = this.visit(ctx.protocol);

    return {
      type: "program",
      participants: participants,
      functions: functions,
      equations: equations,
      format: format,
      knowledge: knowledge,
      protocol: protocol,
    };
  }

  type(ctx: any):Type {
    const functionChild = this.visit(ctx.function);
    if (functionChild) {
        return {
            type: "type",
            value: functionChild,
        }
    }
    const idChild = ctx.Id;
    if (idChild && idChild.length > 0) {
        return {
            type: "type",
            value: {
                type: "id",
                id: idChild[0].image,
            }
        }
    }
    const numberChild = ctx.Number;
    if (numberChild && numberChild.length > 0) {
        return {
            type: "type",
            value: {
                type: "number",
                value: numberChild[0].image,
            }
        }
    }
    const stringChild = ctx.String;
    if (stringChild && stringChild.length > 0) {
        return {
            type: "type",
            value: {
                type: "string",
                value: stringChild[0].image,
            }
        }
    }

    //TODO throw error if unknown
    return {
        type: "type",
        value: null
    }
  }

  function(ctx: any): FunctionCall {
    const id = ctx.Id[0].image;
    const functionChild = this.visit(ctx.function);
    if (functionChild) {
      return {
        type: "function",
        id: id,
        child: functionChild,
      };
    }
    const idChild = ctx.Id[1].image;
    return {
      type: "function",
      id: id,
      child: {
        type: "id",
        id: idChild,
      },
    };
  }

  participants(ctx: any): Participants {
    const participants = ctx.participant.map((p: any) => this.visit(p));

    return {
      type: "participants",
      participants: participants,
    };
  }

  participant(ctx: any): Participant {
    const id = ctx.Id[0].image;
    return {
      type: "participant",
      id: id,
    };
  }

  functionsDef(ctx: any): FunctionsDef {
    const functions = ctx.functionItem.map((f: any) => this.visit(f));
    return {
      type: "functionsDef",
      functions: functions,
    };
  }

  functionItem(ctx: any): FunctionDefItem {
    const id = ctx.Id[0].image;
    const args = ctx.NumberLiteral[0].image;
    return {
      type: "functionDef",
      id: id,
      args: args,
    };
  }

  equation(ctx: any): Equations {
    const equations = ctx.equationElement.map((e: any) => this.visit(e));
    return {
      type: "equations",
      equations: equations,
    };
  }

  equationElement(ctx: any): Equation {
    const leftFunction = this.visit(ctx.function[0]);
    const rightFunction = this.visit(ctx.function[0]);
    return {
      type: "equation",
      left: leftFunction,
      right: rightFunction,
    };
  }

  format(ctx: any): Format {
    const formats = ctx.formatElement.map((f: any) => this.visit(f));
    return {
      type: "format",
      formats: formats,
    };
  }

  formatElement(ctx: any): FormatItem {
    const functionCall = this.visit(ctx.function);
    const string = ctx.StringLiteral;
    if (string && string.length > 0) {
      return {
        type: "formatItem",
        function: functionCall,
        format: { type: "string", value: string[0].image },
      };
    }
    const latex = this.visit(ctx.latex);
    return {
      type: "formatItem",
      function: functionCall,
      format: latex,
    };
  }

  knowledgeList(ctx: any): Knowledge {
    const knowledge = ctx.knowledge.map((k: any) => this.visit(k));
    return {
      type: "knowledge",
      knowledge: knowledge,
    };
  }

  knowledge(ctx: any): KnowledgeItem {

    const id = ctx.Id[0].image;
    const functions:FunctionCall[] = ctx.function ? ctx.function.map((f: any):FunctionCall => this.visit(f)) : [];
    const ids:Id[] = 
            ctx.Id
            .slice(1)
            .map(
                (i: any):Id => {
                    return {
                        type: "id",
                        id: i.image
                    }
                }
                );
    return {
        type: "knowledgeItem",
        id: id,
        children: {
            functions: functions,
            ids: ids
        }
    }
  }

  latex(ctx: any):LatexLiteral {
    let latex = ctx.latexLiteral[0].image;
    return { type: "latex", value: latex };
  }

  protocol(ctx: any):Protocol {
    const statements = ctx.statement.map((s: any) => this.visit(s));
    return {
        type: "protocol",
        statements: statements
    }
  }

  statement(ctx: any):Statement {
    const clear = this.visit(ctx.clear);
    if (clear) {
        return {
            type: "statement",
            child: clear
        }
    }
    const participantStatement = this.visit(ctx.participantStatement);
    if(participantStatement) {
        return {
            type: "statement",
            child: participantStatement
        }
    }
    if(ctx.Id && ctx.Id.length >= 2){
        const leftId = ctx.Id[0].image;
        const rightId = ctx.Id[1].image;
        const match = this.visit(ctx.match);
        if(match) {
            return {
                type: "statement",
                child: {
                    type: "sendStatement",
                    leftId: leftId,
                    rightId: rightId,
                    child: match
                }
            }
        }
        const messageSend = this.visit(ctx.messageSend);
        if(messageSend) {
            return {
                type: "statement",
                child: {
                    type: "sendStatement",
                    leftId: leftId,
                    rightId: rightId,
                    child: messageSend
                }
            }
        }
    }
    //TODO THROW ERROR HERE and remove possibility of null
    return {
        type: "statement",
        child: null
    }
  }

  clear(ctx: any):ClearStatement {
    const id = ctx.Id[0].image;
    return {
        type: "clearStatement",
        id: id
    }
  }

  participantStatement(ctx: any):ParticipantStatement {
    const id = ctx.Id[0].image;
    const newStatement = this.visit(ctx.new);
    if (newStatement) {
        return {
            type: "participantStatement",
            id: id,
            child: newStatement
        }
    }
    const setStatement = this.visit(ctx.set);
    if (setStatement) {
        return {
            type: "participantStatement",
            id: id,
            child: setStatement
        }
    }
    //TODO THROW ERROR HERE and remove possibility of null
    return {
        type: "participantStatement",
        id: id,
        child: null
    };
  }

  new(ctx: any):NewStatement {
    const id = ctx.Id[0].image;
    return {
        type: "newStatement",
        id: id
    }
  }

  set(ctx: any):SetStatement {
    const id = ctx.Id[0].image;
    const type = this.visit(ctx.type);
    return {
        type: "setStatement",
        id: id,
        value: type
    }
  }

  match(ctx: any):MatchStatement {
    const cases = ctx.matchCase.map((c: any) => this.visit(c));
    return {
        type: "matchStatement",
        cases: cases
    }
  }

  matchCase(ctx: any):MatchCase {
    const type:Type = this.visit(ctx.Type);
    const statements:Statement[] = ctx.statement.map((s: any) => this.visit(s));
    return {
        type: "matchCase",
        case: type,
        children: statements
    };
  }

  messageSend(ctx: any):MessageSendStatement {
    const elements = ctx.messageSendElement.map((m: any) => this.visit(m));
    return {
        type: "messageSendStatement",
        ids: elements
    }
  }

  messageSendElement(ctx: any):MessageSendElement {
    const expression = this.visit(ctx.expression);
    const alias = ctx.Id && ctx.Id[0] ? ctx.Id[0].image : null;
    return {
        type: "messageSendElement",
        expression: expression,
        alias: alias
    }
  }

  expression(ctx: any):Expression {

    const type:Type = this.visit(ctx.type);
    if(type) {
        return {
            type: "expression",
            child: type
        }
    }
    const encrypt = this.visit(ctx.encrypt);
    if(encrypt) {
        return {
            type: "expression",
            child: encrypt
        }
    }
    const sign = this.visit(ctx.sign);
    if(sign) {
        return {
            type: "expression",
            child: sign
        }
    }
    
    
    throw new Error("Expression not found");
  }

  encrypt(ctx: any):EncryptExpression {
    const expressions:Expression[] = ctx.expression.map((e: any) => this.visit(e));
    const [last, ...rest] = expressions;
    return {
        type: "encryptExpression",
        inner: rest,
        outer: last
    }
  }

  sign(ctx: any):SignExpression {
    const expressions:Expression[] = ctx.expression.map((e: any) => this.visit(e));
    const [last, ...rest] = expressions;
    return {
        type: "signExpression",
        inner: rest,
        outer: last
    }
  }
}