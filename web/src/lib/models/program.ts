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
  Participants,
  Knowledge,
  KeyRelations,
  FunctionsDef,
  Format,
  Icons,
  Protocol,
  Equations,
  Equation,
} from "$lang/types/parser/interfaces";
import { getStringFromType } from "$lib/utils/stringUtil";
import { EquationMap } from "./EquationMap";

import { Frame } from "./Frame";
import { LatexMap } from "./LatexMap";
import { ParticipantMap } from "./ParticipantMap";
import { z } from "zod";

export class Program {
  init_participants: ParticipantMap = new ParticipantMap();

  first: Frame | null = null;

  keyRelations: { [id: string]: string } = {};
  functions: { [id: string]: Number } = {};
  formats: LatexMap = new LatexMap();
  equations: EquationMap = new EquationMap();
  icons: Map<string, string> = new Map();
  log: boolean = false;

  constructor(json: ProgramAST, log: boolean = false) {
    this.log = log;
    if (this.log) console.log("Program started!");

    // Check if json is valid
    if (json.type != "program") {
      throw new Error("Invalid json");
    }

    // Participants:
    this.constructParticipants(json.participants);
    if (this.log) console.log("Participants", this.init_participants);

    // Knowledge:
    this.constructKnowledge(json.knowledge);

    // KeyRelations:
    this.constructKeyRelations(json.keyRelations);

    // Functions:
    this.constructFunctions(json.functions);

    // Equations:
    this.constructEquations(json.equations);

    // Format:
    // Add format to functions
    this.constructFormat(json.format);

    // Icons:
    this.constructIcons(json.icons);

    // Protocol & Frames:
    this.constructProtocol(json.protocol);

    if (this.log) console.log("Program created");
  }

  // Construct Participants
  constructParticipants(participants: Participants) {
    // Add given participants
    if (participants) {
      if (this.log) console.log(participants.participants);

      participants.participants.forEach((participant: ParticipantAST) => {
        this.init_participants.addParticipant(participant.id.value);
      });
      if (this.log) console.log("Participants created", this.init_participants);
    } else if (this.log) console.log("No participants found");

    // Add shared knowledge
    this.init_participants.addParticipant("Shared");
  }

  // Construct Knowledge
  constructKnowledge(knowledge: Knowledge) {
    //Add given knowledge to participants
    if (knowledge) {
      knowledge.knowledge.forEach((knowledge: KnowledgeItem) => {
        knowledge.children.forEach((child: Type) => {
          this.init_participants.setKnowledgeOfParticipant(knowledge.id.value, child, false);
        });
      });
      if (this.log) console.log("Knowledge added to participants", this.init_participants);
    } else if (this.log) console.log("No knowledge found");
  }

  // Construct KeyRelations
  constructKeyRelations(keyRelations: KeyRelations) {
    if (keyRelations) {
      keyRelations.keyRelations.forEach((keyRelation: KeyRelation) => {
        let sk = keyRelation.sk.value;
        let pk = keyRelation.pk.value;
        this.keyRelations[pk] = sk;
      });
      if (this.log) console.log("KeyRelations created", this.keyRelations);
    } else if (this.log) console.log("No keyRelations found");
  }

  constructFunctions(functions: FunctionsDef) {
    if (functions) {
      functions.functions.forEach((func: FunctionDefItem) => (this.functions[func.id.value] = func.params));
      if (this.log) console.log("Functions created", this.functions);
    } else if (this.log) console.log("No functions found");
  }

  constructEquations(equations: Equations) {
    if (equations) {
      equations.equations.forEach((eq: Equation) => this.equations.addEquation(eq.left, eq.right));
      if (this.log) console.log("Equations created", this.functions);
    } else if (this.log) console.log("No Equations found");
  }

  constructFormat(format: Format) {
    if (format) {
      format.formats.forEach((format: FormatItem) => {
        this.formats.addLatex(format.id, format.format.value);
      });

      if (this.log) console.log("Formats created", this.formats);
    } else if (this.log) console.log("No formats found");
  }

  constructIcons(icons: Icons) {
    if (icons) {
      this.icons = icons.icons;
      if (this.log) console.log("Icons created", this.icons);
    } else if (this.log) console.log("No icons found");
  }

  constructProtocol(protocol: Protocol) {
    //Setup first frame
    this.first = new Frame(null, null, this.init_participants);
    if (this.log) console.log("First frame created", this.first);
    if (this.first == null) throw new Error("Invalid json: no first frame created! First frame not properly initialized");

    if (protocol.statements) {
      this.parseStatements(protocol.statements, this.first);
      if (this.log) console.log("Protocol created", this.first);
    } else if (this.log) console.log("No protocol found");
  }

  // Check whether a statement is a match statement or not, and call the correct parse function (parseMatchStmnt/parseStmnt)
  parseStatements(stmntList: Statement[], last: Frame) {
    //Get next statement
    const stmnt = stmntList.shift();
    if (stmnt == undefined) throw new Error("Invalid json: stmnt is undefined! Check if statements array is empty (parseProtocol)");

    //Check if statement is a match statement
    if (this.isMatchStatement(stmnt)) {
      this.parseMatchStmnt(stmnt, stmntList, last);
    } else {
      this.parseStmnt(stmnt, stmntList, last);
    }
  }

  // Parse a match statement and add it to the last frame, then call parseStatements on the remaining statements in stmntList
  parseMatchStmnt(stmnt: Statement, stmntList: Statement[], last: Frame) {
    last.setNext({});
    const sendStatement: SendStatement = stmnt.child as SendStatement;
    const matchStatement: MatchStatement = sendStatement.child as MatchStatement;
    let matchFrame = Frame.newFrame(stmnt, last.getParticipantMap(), last);

    last.setNext(matchFrame);
    for (const caseIndex in matchStatement.cases) {
      const matchCase: MatchCase = matchStatement.cases[caseIndex];
      let identifier = getStringFromType(matchCase.case);
      matchFrame.createNewMatchCase(identifier);
      //Branch out for each case and concat the remaining statements on the case children
      this.parseStatements(matchCase.children.concat(stmntList), matchFrame.getNextFrame(identifier));
    }
  }

  // Parse a statement and add it to the last frame, then call parseStatements on the remaining statements in stmntList
  parseStmnt(stmnt: Statement, stmntList: Statement[], last: Frame) {
    last.setNext(Frame.newFrame(stmnt, last.getParticipantMap(), last));
    this.pipeStmnt(stmnt, last.getNext() as Frame);

    if (last.isNextNull()) throw new Error("Invalid json: next frame not properly initialized! (parseProtocol)");
    if (stmntList.length > 0) {
      const next = z.instanceof(Frame).safeParse(last.getNext());
      if (next.success) {
        this.parseStatements(stmntList, next.data);
      } else {
        throw new Error("Invalid json: next frame not properly initialized! (parseProtocol)");
      }
    }
  }

  // Return true if the statement is a match statement, false otherwise
  isMatchStatement(stmnt: Statement): boolean {
    if (stmnt.child.type !== "sendStatement") return false;
    const send = stmnt.child as SendStatement;
    return send.child.type == "matchStatement";
  }

  // Check what the type of the given statement is and calls the correct function to add it to the last frame
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
    last.getParticipantMap().clearKnowledgeElement(knowledge);
  }

  // Check what the type of the given participant statement is and calls the correct function
  participantStmnt(stmnt: ParticipantStatement, last: Frame) {
    // Pipe ParticipantStatement
    if (stmnt.child.type == "newStatement") {
      const newStmnt = stmnt.child as NewStatement;
      this.newStmnt(stmnt.id.value, newStmnt.id, last);
    } else if (stmnt.child.type == "setStatement") {
      const sendStmnt = stmnt.child as SetStatement;
      this.setStmnt(stmnt.id.value, sendStmnt.id, getStringFromType(sendStmnt.value), last);
    } else {
      throw new Error("Invalid json: stmnt child type not implemented");
    }
  }

  // New Statement
  newStmnt(participant: string, newKnowledge: Type, last: Frame) {
    last.getParticipantMap().setKnowledgeOfParticipant(participant, newKnowledge, false);
  }

  // Set Statement
  setStmnt(participant: string, knowledge: Type, value: string, last: Frame) {
    last.getParticipantMap().setKnowledgeOfParticipant(participant, knowledge, false, value);
  }

  // Pipe SendStatement to messageSendStatement, or matchStatement
  sendStmnt(stmnt: SendStatement, last: Frame) {
    if (stmnt.child.type == "messageSendStatement") {
      const messageSendStmnt = stmnt.child as MessageSendStatement;
      this.messageSendStmnt(stmnt.leftId.value, stmnt.rightId.value, messageSendStmnt.expressions, last);
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
        last.getParticipantMap().transferKnowledge(senderId, receiverId, type, encrypted);
      }
    });
  }

  // Acoomodate encryption of knowledge in messages
  encryptExpr(senderId: string, receiverId: string, inner: Expression[], outer: Type, last: Frame, encrypted: boolean) {
    // if receiver was unable to decrypt an outer expression earlier, it cannot be decrypted now
    if (!encrypted) {
      // decryptable = true if receiver knows the key, it is therefore not encrypted
      let decryptable = last.getParticipantMap().checkKeyKnowledge(receiverId, this.checkKeyRelation(outer));
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

  getIcon(id: string) {
    return this.icons.get(id) || "red-question-mark";
  }

  getFormats() {
    return this.formats;
  }
}
