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
  keyRelations: KeyRelations;
  icons: Icons;
  protocol: Protocol;
}

export interface Participants extends ASTNode {
  type: "participants";
  participants: ParticipantItem[];
}

export interface ParticipantItem extends ASTNode {
  type: "participantItem";
  id: Id;
  comment?: StmtComment;
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
  functions: Id[];
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
  id: Type;
  format: StringLiteral | TexLiteral;
}

export interface Icons extends ASTNode {
  type: "icons";
  icons: Map<string, string>;
}

export interface TexLiteral extends ASTNode {
  type: "Tex";
  value: string;
}

export interface Knowledge extends ASTNode {
  type: "knowledge";
  knowledge: KnowledgeItem[];
}

export interface KnowledgeItem extends ASTNode {
  type: "knowledgeItem";
  id: Id;
  children: { value: Type; comment?: StmtComment }[];
}

export interface Protocol extends ASTNode {
  type: "protocol";
  statements: Statement[];
}

export interface Statement extends ASTNode {
  type: "statement";
  child: StatementNode;
  comment?: StmtComment;
}

export interface StmtComment extends ASTNode {
  type: "stmtComment";
  value: TexLiteral | StringLiteral;
}

export interface StatementNode extends ASTNode {}

export interface ClearStatement extends StatementNode {
  type: "clearStatement";
  id: Id;
}

export interface ParticipantStatement extends StatementNode {
  type: "participantStatement";
  id: Id;
  child: ParticipantStatementNode;
}

export interface ParticipantStatementNode extends ASTNode {}

export interface NewStatement extends ParticipantStatementNode {
  type: "newStatement";
  value: Id | FunctionCall;
  comment?: StmtComment;
}

export interface SetStatement extends ParticipantStatementNode {
  type: "setStatement";
  id: Id;
  value: Type;
}

export interface SendStatement extends StatementNode {
  type: "sendStatement";
  leftId: Id;
  rightId: Id;
  child: SendStatementNode;
}

export interface SendStatementNode extends ASTNode {}

export interface MessageSendStatement extends SendStatementNode {
  type: "messageSendStatement";
  expressions: Expression[];
}

export interface MatchStatement extends SendStatementNode {
  type: "matchStatement";
  cases: MatchCase[];
}

export interface MatchCase extends ASTNode {
  type: "matchCase";
  case: Type;
  children: Statement[];
}

export interface ExpressionNode extends ASTNode {}

export interface Expression extends ExpressionNode {
  type: "expression";
  child: ExpressionNode | Type;
}

export interface EncryptExpression extends ExpressionNode {
  type: "encryptExpression";
  inner: Expression[];
  outer: Type;
}
export interface SignExpression extends ExpressionNode {
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
  participantItem: ParticipantItemCST[];
}

export interface ParticipantItemCST extends CstNode {
  participant: ParticipantCST;
  stmtComment?: StmtCommentCST;
}
export interface ParticipantCST extends CstNode {
  Id: IToken[];
}

export interface KnowledgeListCST extends CstNode {
  knowledge: KnowledgeCST[];
}

export interface KnowledgeCST extends CstNode {
  Id: IToken[];
  knowledgeItem: KnowledgeItemCST[];
}

export interface KnowledgeItemCST extends CstNode {
  type: TypeCST[];
  stmtComment?: StmtCommentCST;
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
  Id: IToken[];
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
  type: TypeCST;
  StringLiteral: IToken[];
  Tex: TexCST;
}

export interface TexCST extends CstNode {
  TexLiteral: IToken[];
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
  stmtComment: StmtCommentCST;
  [key: string]: any;
}

export interface StmtCommentCST extends CstNode {
  StringLiteral: IToken[];
  Tex: TexCST;
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
  Id?: IToken[];
  function?: FunctionCallCST;
  stmtComment?: StmtCommentCST;
  [key: string]: any;
}

export interface SetCST extends CstNode {
  Id: IToken[];
  type: TypeCST;
}

export interface MatchCST extends CstNode {
  matchCase: MatchCaseCST[];
}

export interface MatchCaseCST extends CstNode {
  type: TypeCST;
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
