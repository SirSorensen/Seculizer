import type {
  Participant as ParticipantAST,
  Statement,
  ParticipantStatement,
  SendStatement,
  MatchStatement,
  KnowledgeItem,
  Type,
  FunctionDefItem,
  FormatItem,
  Expression,
  MatchCase,
  KeyRelation,
  ClearStatement,
  Program as ProgramAST,
  Id,
  NewStatement,
  SetStatement,
  MessageSendStatement,
  EncryptExpression,
  SignExpression,
} from "$lang/types/parser/interfaces";

import { Frame } from "./utils/Frame";
import { Participant } from "./utils/Participant";
import { ParticipantMap } from "./utils/ParticipantMap";

type _format = {
  //Function
  id: string;
  params: Type[];

  //Latex
  latex: string;
};

export class Program {
  init_participants: ParticipantMap = new ParticipantMap();

  first: Frame | null = null;

  keyRelations: { [id: string]: string } = {};
  functions: { [id: string]: Number } = {};
  formats: { [id: string]: _format } = {};
  equations: { [id: string]: string } = {};
  icons: Map<Id, string> = new Map();
  log: boolean = false;

  constructor(json: ProgramAST, log: boolean = false) {
    this.log = log;
    if (this.log) console.log("Program started!");

    // Check if json is valid
    if (json.type != "program") {
      throw new Error("Invalid json");
    }

    // Participants:
    // Create participants
    if (json.participants) {
      console.log(json.participants.participants);

      json.participants.participants.forEach((participant: ParticipantAST) => {
        this.init_participants.addParticipant(participant.id.value);
      });
      if (this.log) console.log("Participants created", this.init_participants);
    } else if (this.log) console.log("No participants found");

    // Add shared knowledge
    this.init_participants.addParticipant("Shared");

    if (this.log) console.log("Participants", this.init_participants);

    // Knowledge:
    // Add knowledge to participants
    if (json.knowledge) {
      json.knowledge.knowledge.forEach((knowledge: KnowledgeItem) => {
        knowledge.children.forEach((child: Type) => {
          this.init_participants.setKnowledgeOfParticipant(knowledge.id.value, child, false);
        });
      });
      if (this.log) console.log("Knowledge added to participants", this.init_participants);
    } else if (this.log) console.log("No knowledge found");

    // KeyRelations:
    if (json.keyRelations) {
      json.keyRelations.keyRelations.forEach((keyRelation: KeyRelation) => {
        let sk = keyRelation.sk.value;
        let pk = keyRelation.pk.value;
        this.keyRelations[pk] = sk;
      });
      if (this.log) console.log("KeyRelations created", this.keyRelations);
    } else if (this.log) console.log("No keyRelations found");

    // Functions:
    if (json.functions) {
      json.functions.functions.forEach((func: FunctionDefItem) => (this.functions[func.id.value] = func.params));
      if (this.log) console.log("Functions created", this.functions);
    } else if (this.log) console.log("No functions found");

    // Equations:
    //GIANT TODO HERE hehe

    // Format:
    // Add format to functions
    if (json.format) {
      json.format.formats.forEach((format: FormatItem) => {
        let tmp_format: _format = {
          id: format.function.id,
          params: [],
          latex: format.format.value,
        };

        format.function.params.forEach((param: Type) => {
          tmp_format.params.push(param);
        });

        this.formats[format.function.id] = tmp_format;
      });

      if (this.log) console.log("Formats created", this.formats);
    } else if (this.log) console.log("No formats found");

    // Icons:
    if (json.icons) {
      this.icons = json.icons.icons;
      if (this.log) console.log("Icons created", this.icons);
    } else if (this.log) console.log("No icons found");

    //Setup first frame
    this.first = new Frame(null, null, this.init_participants);
    if (this.log) console.log("First frame created", this.first);
    if (this.first == null) throw new Error("Invalid json: no first frame created! First frame not properly initialized");

    // Protocol:
    if (json.protocol.statements) {
      this.parseProtocol(json.protocol.statements, this.first);
      if (this.log) console.log("Protocol created", this.first);
    } else if (this.log) console.log("No protocol found");

    console.log("Program created");
  }

  parseProtocol(statements: Statement[] | Statement, last: Frame) {
    if (statements instanceof Array && statements.length > 0) {
      this.parseStmntList(statements, last);
    } else if (!(statements instanceof Array)) {
      this.parseStmnt(statements, last);
    }
  }

  parseStmntList(stmntList: Statement[], last: Frame) {
    const stmnt = stmntList.shift();
    if (stmnt == undefined) throw new Error("Invalid json: stmnt is undefined! Check if statements array is empty (parseProtocol)");

    this.parseProtocol(stmnt, last);
    if (last.isNextNull()) throw new Error("Invalid json: next frame not properly initialized! (parseProtocol)");
    if (stmntList.length > 0) this.parseProtocol(stmntList, last.getNext() as Frame);
  }

  parseStmnt(stmnt: Statement, last: Frame) {
    if (this.isMatchStatement(stmnt)) {
      last.setNext({});
      const sendStatement: SendStatement = stmnt.child as SendStatement;
      const matchStatement: MatchStatement = sendStatement.child as MatchStatement;
      for (const caseIndex in matchStatement.cases) {
        const matchCase: MatchCase = matchStatement.cases[caseIndex];

        last.createNewMatchCase(caseIndex);

        this.parseProtocol(matchCase.children, last.getNextFrame(caseIndex));
      }
    } else {
      last.setNext(Frame.newFrame(stmnt, last.getParticipants(), last));
      this.pipeStmnt(stmnt, last.getNext() as Frame);
    }
  }

  isMatchStatement(stmnt: Statement): boolean {
    if (stmnt.child.type !== "sendStatement") return false;
    const send = stmnt.child as SendStatement;
    return send.child.type == "matchStatement";
  }

  pipeStmnt(stmnt: Statement, last: Frame) {
    if (this.log) console.log("Piping statement", stmnt);

    switch (stmnt.child.type) {
      case "clearStatement":
        const clearStmt = stmnt.child as ClearStatement;
        this.clearStmnt(clearStmt.id, last);
        break;
      case "participantStatement":
        const participantStmt = stmnt.child as ParticipantStatement;
        this.participantStmnt(participantStmt, last);
        break;
      case "sendStatement":
        const sendStmt = stmnt.child as SendStatement;
        this.sendStmnt(sendStmt, last);
        break;
      default:
        throw new Error("Invalid json: stmnt type not found!");
    }
  }

  clearStmnt(knowledge: Type, last: Frame) {
    last.clearKnowledgeElement(knowledge);
  }

  participantStmnt(stmnt: ParticipantStatement, last: Frame) {
    // Pipe ParticipantStatement
    if (stmnt.child.type == "newStatement") {
      const newStmnt = stmnt.child as NewStatement;
      this.newStmnt(stmnt.id.value, newStmnt.id, last);
    } else if (stmnt.child.type == "setStatement") {
      const sendStmnt = stmnt.child as SetStatement;
      this.setStmnt(stmnt.id.value, sendStmnt.id, String(sendStmnt.value), last);
    } else {
      throw new Error("Invalid json: stmnt child type not implemented");
    }
  }

  // New Statement
  newStmnt(participant: string, newKnowledge: Type, last: Frame) {
    last.setKnowledge(participant, newKnowledge, false);
  }

  // Set Statement
  setStmnt(participant: string, knowledge: Type, value: string, last: Frame) {
    last.setKnowledge(participant, knowledge, false, value);
  }

  // Pipe SendStatement to messageSendStatement, or matchStatement
  sendStmnt(stmnt: SendStatement, last: Frame) {
    if (stmnt.child.type == "messageSendStatement") {
      const messageSendStmnt = stmnt.child as MessageSendStatement;
      this.messageSendStmnt(stmnt.leftId.value, stmnt.rightId.value, messageSendStmnt.expressions, last);
    } else if (stmnt.child.type == "matchStatement") {
      const matchStmnt = stmnt.child as MatchStatement;
      return this.matchStmnt(matchStmnt, last);
    } else {
      throw new Error("Invalid json: stmnt child type not implemented");
    }
  }

  // Pipe MessageSendStatement to encryptExpression, signExpression, or setStatement
  messageSendStmnt(senderId: string, receiverId: string, knowledge: Expression[], last: Frame, encrypted: boolean = false) {
    knowledge.forEach((expression) => {
      if (expression.child.type == "encryptExpression") {
        const encryptedExpression = expression.child as EncryptExpression;
        this.encryptExpr(senderId, receiverId, encryptedExpression.inner, encryptedExpression.outer, last, encrypted);
      } else if (expression.child.type == "signExpression") {
        const signExpression = expression.child as SignExpression;
        this.messageSendStmnt(senderId, receiverId, signExpression.inner, last, encrypted);
      } else {
        const type = expression.child as Type;
        last.transferKnowledge(senderId, receiverId, type, encrypted);
      }
    });
  }

  // TODO : implement matchStmnt
  matchStmnt(stmnt: MatchStatement, last: Frame) {}

  // Acoomodate encryption of knowledge in messages
  encryptExpr(senderId: string, receiverId: string, inner: Expression[], outer: Type, last: Frame, encrypted: boolean) {
    // if receiver was unable to decrypt an outer expression earlier, it cannot be decrypted now
    if (!encrypted) {
      // decryptable = true if receiver knows the key, it is therefore not encrypted
      let decryptable = last.getParticipants().checkKeyKnowledge(receiverId, this.checkKeyRelation(outer));
      encrypted = !decryptable;
    }

    this.messageSendStmnt(senderId, receiverId, inner, last, encrypted);
  }

  checkKeyRelation(key: Type): Type {
    if (key.type == "id") {
      let tmp_key = this.keyRelations[key.value];
      if (tmp_key) key.value = tmp_key;
    }
    return key;
  }
}
