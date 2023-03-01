interface ASTNode {
  type: string;
}

interface Program extends ASTNode {
  type: "program";
  participants: Participants;
  functions: FunctionsDef;
  equations: Equations;
  format: Format;
  knowledge: Knowledge;
  //protocol: Protocol;
}

interface Participants extends ASTNode {
  type: "participants";
  participants: Participant[];
}

interface Participant extends ASTNode {
  type: "participant";
  id: Id;
}

interface FunctionsDef extends ASTNode {
  type: "functionsDef";
  functions: FunctionDefItem[];
}

interface FunctionDefItem extends ASTNode {
  type: "functionDef";
  id: Id;
  args: Number;
}

interface Equations extends ASTNode {
  type: "equations";
  equations: Equation[];
}

interface Equation extends ASTNode {
  type: "equation";
  left: Function;
  right: Function;
}

interface FunctionCall extends ASTNode {
  type: "function";
  id: string;
  child: FunctionCall | Id;
}

interface Id extends ASTNode {
  type: "id";
  id: string;
}

interface Format extends ASTNode {
  type: "format";
  formats: FormatItem[];
}

interface FormatItem extends ASTNode {
  type: "formatItem";
  function: Function;
  format: StringLiteral | LatexLiteral;
}

interface StringLiteral extends ASTNode {
  type: "string";
  value: string;
}

interface LatexLiteral extends ASTNode {
  type: "latex";
  value: string;
}

interface Knowledge extends ASTNode {
  type: "knowledge";
  knowledge: KnowledgeItem[];
}

interface KnowledgeItem extends ASTNode {
  type: "knowledgeItem";
  id: Id;
  children: {
    functions: FunctionCall[];
    ids: Id[];
  };
}

interface Protocol extends ASTNode {
  type: "protocol";
  statements: Statement[];
}

interface Statement extends ASTNode {
  type: "statement";
  child: ClearStatement | ParticipantStatement | SendStatement | null;
}

interface ClearStatement extends ASTNode {
  type: "clearStatement";
  id: Id;
}

interface ParticipantStatement extends ASTNode {
  type: "participantStatement";
  id: Id;
  child: NewStatement | SetStatement | null;
}

interface NewStatement extends ASTNode {
  type: "newStatement";
  id: Id;
}

interface SetStatement extends ASTNode {
  type: "setStatement";
  id: Id;
  value: Type;
}

interface SendStatement extends ASTNode {
  type: "sendStatement";
  leftId: Id;
  rightId: Id;
  child: MessageSendStatement | MatchStatement | null;
}

interface MessageSendStatement extends ASTNode {
  type: "messageSendStatement";
  ids: MessageSendElement[];
}

interface MessageSendElement extends ASTNode {
  type: "messageSendElement";
  expression: Expression;
  alias: Id | null;
}

interface MatchStatement extends ASTNode {
  type: "matchStatement";
  cases: MatchCase[];
}

interface MatchCase extends ASTNode {
  type: "matchCase";
  case: Type;
  children: Statement[];
}

interface Type extends ASTNode {
  type: "type";
  value: StringLiteral | NumberLiteral | Id | FunctionCall | null;
}

interface NumberLiteral extends ASTNode {
  type: "number";
  value: number;
}

interface Expression extends ASTNode {
    type: "expression";
    child: Type | EncryptExpression | SignExpression;
}

interface EncryptExpression extends ASTNode {
    type: "encryptExpression";
    inner: Expression[];
    outer: Expression;
} 
interface SignExpression extends ASTNode {
    type: "signExpression";
    inner: Expression[];
    outer: Expression;
} 