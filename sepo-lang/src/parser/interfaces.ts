import { CstNode, IToken } from "chevrotain";

export interface ASTNode {
  type: string;
}

export type Type = StringLiteral | NumberLiteral | Id | FunctionCall;

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
  expressions: Expression[];
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
  outer: Type;
}
export interface SignExpression extends ASTNode {
  type: "signExpression";
  inner: Expression[];
  outer: Type;
}

export interface ProgramCST extends CstNode {
  participants: ParticipantsCST;
  knowledgeList: KnowledgeListCST;
  keyRelationList: KeyRelationListCST;
  functionsDef: FunctionsDefCST;
  equation: EquationCST;
  format: FormatCST;
  protocol: ProtocolCST;
  icons: IconsCST;
}

export interface TypeCST extends CstNode {
  [key: string]: any;
  Id?: IToken[];
  StringLiteral?: IToken[];
  NumberLiteral?: IToken[];
  function: CstNode;
}

export interface FunctionCallCST extends CstNode {
  Id: IToken[];
  type: TypeCST[];
}

export interface ParticipantsCST extends CstNode {
  participant: ParticipantCST[];
}

export interface ParticipantCST extends CstNode {
  Id: IToken[];
}

export interface KnowledgeListCST extends CstNode {
  knowledge: KnowledgeCST[];
}

export interface KnowledgeCST extends CstNode {
  Id: IToken[];
  type: TypeCST[];
}

export interface KeyRelationListCST extends CstNode {
  keyRelation: KeyRelationCST[];
}

export interface KeyRelationCST extends CstNode {
  secretKeyRelation: SecretKeyRelationCST;
  publicKeyRelation: PublicKeyRelationCST;
}

export interface SecretKeyRelationCST extends CstNode {
  Id: IToken[];
}

export interface PublicKeyRelationCST extends CstNode {
  Id: IToken[];
}

export interface FunctionsDefCST extends CstNode {
  functionItem: FunctionItemCST[];
}

export interface FunctionItemCST extends CstNode {
  Id: IToken[];
  NumberLiteral: IToken[];
}

export interface EquationCST extends CstNode {
  equationElement: EquationElementCST[];
}

export interface EquationElementCST extends CstNode {
  function: FunctionCallCST[];
}

export interface FormatCST extends CstNode {
  formatElement: FormatElementCST[];
}

export interface FormatElementCST extends CstNode {
  function: FunctionCallCST;
  StringLiteral: IToken[];
  latex: LatexCST;
}

export interface LatexCST extends CstNode {
  latexLiteral: IToken[];
}

export interface ProtocolCST extends CstNode {
  statement: StatementCST[];
}

export interface StatementCST extends CstNode {
  //  [key: string]: any;
  clear: ClearCST;
  participantStatement: ParticipantStatementCST;
  Id: IToken[];
  match: MatchCST;
  messageSend: MessageSendCST;
  [key: string]: any;
}

export interface ClearCST extends CstNode {
  Id: IToken[];
}

export interface ParticipantStatementCST extends CstNode {
  Id: IToken[];
  new: NewCST;
  set: SetCST;
  [key: string]: any;
}

export interface NewCST extends CstNode {
  Id: IToken[];
}

export interface SetCST extends CstNode {
  Id: IToken[];
  type: TypeCST;
}

export interface MatchCST extends CstNode {
  matchCase: MatchCaseCST[];
}

export interface MatchCaseCST extends CstNode {
  Type: TypeCST;
  statement: StatementCST[];
}

export interface MessageSendCST extends CstNode {
  expression: ExpressionCST[];
}

export interface ExpressionCST extends CstNode {
  type: TypeCST;
  encrypt: EncryptCST;
  sign: SignCST;
}

export interface EncryptCST extends CstNode {
  type: TypeCST;
  expression: ExpressionCST[];
}

export interface SignCST extends CstNode {
  type: TypeCST;
  expression: ExpressionCST[];
}

export interface IconsCST extends CstNode {
  iconSet: IconSetCST[];
}

export interface IconSetCST extends CstNode {
  StringLiteral: IToken[];
  Id: IToken[];
}
