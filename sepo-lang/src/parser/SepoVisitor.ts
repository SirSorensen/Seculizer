import { SepoParser } from "./parser.js";
import { throwSimpleParseError } from './ParseError';
import { ClearStatement, EncryptExpression, Equation, Equations, Expression, Format, FormatItem, FunctionCall, FunctionDefItem, FunctionsDef, Icons, Id, KeyRelation, KeyRelations, Knowledge, KnowledgeItem, LatexLiteral, MatchCase, MatchStatement, MessageSendStatement, NewStatement, Participant, Participants, ParticipantStatement, Protocol, SetStatement, SignExpression, Statement, Type } from "./interfaces.js";
const parserInstance = new SepoParser();

const BaseSepoVisitor = parserInstance.getBaseCstVisitorConstructor();

export class SepoToAstVisitor extends BaseSepoVisitor {
  template: string;
  constructor(template:string) {
    super();
    this.template = template;
    this.validateVisitor();
  }

  program(ctx: any) {
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

  type(ctx: any):Type {
    const functionChild = this.visit(ctx.function);
    if (functionChild) {
        return functionChild
    }
    const idChild = ctx.Id;
    if (idChild && idChild.length > 0) {
        return {
          type: "id",
          value: idChild[0].image,
      }
    }
    const numberChild = ctx.NumberLiteral;
    if (numberChild && numberChild.length > 0) {
        return {
          type: "number",
          value: numberChild[0].image,
      }
    }
    const stringChild = ctx.StringLiteral;
    if (stringChild && stringChild.length > 0) {
        return {
          type: "string",
          value: stringChild[0].image,
      }
    }
    
    return throwSimpleParseError("Unknown type", ctx[Object.keys(ctx)[0]][0], this.template)
  }

  knowledgeList(ctx: any): Knowledge {
    const knowledge : KnowledgeItem[] = ctx.knowledge.map((k: any) => this.visit(k));
    return {
      type: "knowledge",
      knowledge: knowledge,
    };
  }

  knowledge(ctx: any): KnowledgeItem {

    const id:string = ctx.Id[0].image;
    const children = ctx.type.map((t: any) => this.visit(t));
    return {
        type: "knowledgeItem",
        id: {
              type: "id",
              value: id,
            },
        children: children
    }
  }

  keyRelationList(ctx: any): KeyRelations {
    const keyRelations = ctx.keyRelation.map((k: any) => this.visit(k));
    return {
      type: "keyRelations",
      keyRelations: keyRelations,
    };
  }

  keyRelation(ctx: any): KeyRelation {
    const sk = this.visit(ctx.secretKeyRelation);
    const pk = this.visit(ctx.publicKeyRelation);
    return {
      type: "keyRelation",
      sk: sk,
      pk: pk,
    };
  }

  secretKeyRelation(ctx: any): Id {
    const id:string = ctx.Id[0].image;
    return  {
              type: "id",
              value: id,
            };
  }

  publicKeyRelation(ctx: any): Id {
    const id:string = ctx.Id[0].image;
    return {
        type: "id",
        value: id,
      };
  }

  function(ctx: any): FunctionCall {
    const id:string = ctx.Id[0].image;
    const params = ctx.type.map((p: any) => this.visit(p));
    return  {
              type: "function",
              id: id,
              params: params,
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
    const id:string = ctx.Id[0].image;
    return {
      type: "participant",
      id: {
        type: "id",
        value: id,
      },
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
    const id:string = ctx.Id[0].image;
    const params = ctx.NumberLiteral[0].image;
    return {
      type: "functionDef",
      id: {
            type: "id",
            value: id,
          },
      params: params,
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

  latex(ctx: any):LatexLiteral {
    let latex = ctx.latexLiteral[0].image;
    return { 
      type: "latex", 
      value: latex 
    };
  }

  protocol(ctx: any):Protocol {
    const statements = ctx.statement.map((s: any) => this.visit(s));
    return {
        type: "protocol",
        statements: statements
    }
  }

  icons(ctx: any): Icons {
    let map = new Map<Id, string>();
    
    ctx.iconSet.forEach((icon: any) => {
      let set = this.visit(icon)
      set.ids.forEach((id: Id) => {
        map.set(id, set.emoji);
      });
    });
      
    return {
      type: "icons",
      icons: map,
    };
  }

  iconSet(ctx: any) {
    const emoji = ctx.StringLiteral[0].image;
    let ids = ctx.Id.map((id:any) => {
      return id.image;
    });
    return {emoji: emoji, ids: ids};
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
        const leftId: string = ctx.Id[0].image;
        const rightId: string = ctx.Id[1].image;
        const match = this.visit(ctx.match);
        if(match) {
            return {
                type: "statement",
                child: {
                    type: "sendStatement",
                    leftId: {
                      type: "id",
                      value: leftId,
                    },
                    rightId: {
                      type: "id",
                      value: rightId,
                    },
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
                    leftId: {
                      type: "id",
                      value: leftId,
                    },
                    rightId: {
                      type: "id",
                      value: rightId,
                    },
                    child: messageSend
                }
            }
        }
    }
    //TODO THROW ERROR HERE and remove possibility of null
    return throwSimpleParseError("Uknown statement", ctx[Object.keys(ctx)[0]][0], this.template)
  }

  clear(ctx: any):ClearStatement {
    const id:string = ctx.Id[0].image;
    return {
        type: "clearStatement",
        id: {
              type: "id",
              value: id,
            }
    }
  }

  participantStatement(ctx: any):ParticipantStatement {
    const id:string = ctx.Id[0].image;
    const newStatement = this.visit(ctx.new);
    if (newStatement) {
        return {
            type: "participantStatement",
            id: {
                  type: "id",
                  value: id,
                },
            child: newStatement
        }
    }
    const setStatement = this.visit(ctx.set);
    if (setStatement) {
        return {
            type: "participantStatement",
            id: {
                  type: "id",
                  value: id,
                },
            child: setStatement
        }
    }
    //TODO THROW ERROR HERE and remove possibility of null
    return throwSimpleParseError("Uknown participant statement", ctx[Object.keys(ctx)[0]][0], this.template)
  }

  new(ctx: any):NewStatement {
    const id:string = ctx.Id[0].image;
    return {
        type: "newStatement",
        id: {
              type: "id",
              value: id,
            }
    }
  }

  set(ctx: any):SetStatement {
    const id:string = ctx.Id[0].image;
    const type = this.visit(ctx.type);
    return {
        type: "setStatement",
        id: {
              type: "id",
              value: id,
            },
        value: type
    }
  }

  match(ctx: any):MatchStatement {
    const cases : MatchCase[] = ctx.matchCase.map((c: any) => this.visit(c));
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
    const elements = ctx.expression.map((e: any) => this.visit(e));
    return {
        type: "messageSendStatement",
        expressions: elements
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
    const type:Type = this.visit(ctx.type);
    const expressions:Expression[] = ctx.expression.map((e: any) => this.visit(e));
    return {
        type: "encryptExpression",
        inner: expressions,
        outer: type
    }
  }

  sign(ctx: any):SignExpression {
    const type:Type = this.visit(ctx.type);
    const expressions:Expression[] = ctx.expression.map((e: any) => this.visit(e));
    return {
        type: "signExpression",
        inner: expressions,
        outer: type
    }
  }
}
