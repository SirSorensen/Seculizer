export interface ASTNode {
  type: string;
}

export type Type = StringLiteral | NumberLiteral | Id | FunctionCall

export interface StringLiteral extends ASTNode {
  type: "string";
  value: string;
}

export interface NumberLiteral extends ASTNode {
  type: "number";
  value: number;
}

export interface Id extends ASTNode {
  type: "id";
  value: string;
}

export interface FunctionCall extends ASTNode {
  type: "function";
  id: string;
  params: Type[];
}

export interface Program extends ASTNode {
  type: "program";
  participants: Participants;
  functions: FunctionsDef;
  equations: Equations;
  format: Format;
  knowledge: Knowledge;
  icons: Icons;
  protocol: Protocol;
}

export interface Participants extends ASTNode {
  type: "participants";
  participants: Participant[];
}

export interface Participant extends ASTNode {
  type: "participant";
  id: Id;
}

export interface KeyRelations extends ASTNode {
  type: "keyRelations";
  keyRelations: KeyRelation[];
}

export interface KeyRelation extends ASTNode {
  type: "keyRelation";
  sk: Id;
  pk: Id;
}


export interface FunctionsDef extends ASTNode {
  type: "functionsDef";
  functions: FunctionDefItem[];
}

export interface FunctionDefItem extends ASTNode {
  type: "functionDef";
  id: Id;
  params: Number;
}

export interface Equations extends ASTNode {
  type: "equations";
  equations: Equation[];
}

export interface Equation extends ASTNode {
  type: "equation";
  left: FunctionCall;
  right: FunctionCall;
}

export interface Format extends ASTNode {
  type: "format";
  formats: FormatItem[];
}

export interface FormatItem extends ASTNode {
  type: "formatItem";
  function: FunctionCall;
  format: StringLiteral | LatexLiteral;
}

export interface Icons extends ASTNode {
  type: "icons";
  icons: Map<Id, String>;
}

export interface LatexLiteral extends ASTNode {
  type: "latex";
  value: string;
}

export interface Knowledge extends ASTNode {
  type: "knowledge";
  knowledge: KnowledgeItem[];
}

export interface KnowledgeItem extends ASTNode {
  type: "knowledgeItem";
  id: Id;
  children: Type[];
}

export interface Protocol extends ASTNode {
  type: "protocol";
  statements: Statement[];
}

export interface Statement extends ASTNode {
  type: "statement";
  child: ClearStatement | ParticipantStatement | SendStatement;
}

export interface ClearStatement extends ASTNode {
  type: "clearStatement";
  id: Id;
}

export interface ParticipantStatement extends ASTNode {
  type: "participantStatement";
  id: Id;
  child: NewStatement | SetStatement;
}

export interface NewStatement extends ASTNode {
  type: "newStatement";
  id: Id;
}

export interface SetStatement extends ASTNode {
  type: "setStatement";
  id: Id;
  value: Type;
}

export interface SendStatement extends ASTNode {
  type: "sendStatement";
  leftId: Id;
  rightId: Id;
  child: MessageSendStatement | MatchStatement;
}

export interface MessageSendStatement extends ASTNode {
  type: "messageSendStatement";
  ids: MessageSendElement[];
}

export interface MessageSendElement extends ASTNode {
  type: "messageSendElement";
  expression: Expression;
  alias: Id | null;
}

export interface MatchStatement extends ASTNode {
  type: "matchStatement";
  cases: MatchCase[];
}

export interface MatchCase extends ASTNode {
  type: "matchCase";
  case: Type;
  children: Statement[];
}



export interface Expression extends ASTNode {
    type: "expression";
    child: Type | EncryptExpression | SignExpression;
}

export interface EncryptExpression extends ASTNode {
    type: "encryptExpression";
    inner: Expression[];
    outer: Expression;
} 
export interface SignExpression extends ASTNode {
    type: "signExpression";
    inner: Expression[];
    outer: Expression;
} 