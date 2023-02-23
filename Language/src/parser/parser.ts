import LineCalc from "../Utils/LineCalc.js";
import { Lexer, Token } from "./lexer/Interfaces";
import { getLexer, LexTypes } from "./lexer/lexer.js";

export class Parser {
  private readonly lexer: Lexer;
  private readonly template: string;
  private readonly line = {
    number: 1,
    startIndex: 0,
  };
  constructor(template: string) {
    this.lexer = getLexer(template);
    this.template = template;
    let token: Token;
    while ((token = this.lexer.next()) !== null) {
      //if(token.type === "function") console.log(token);
      const type = token.type;
      switch (type) {
        case LexTypes.newline: {
          this.newline(token);
          break;
        }
        case LexTypes.topLevel: {
          this.parseTopLevel(token);
          break;
        }
        default: {
          this.throwError(`Unknown type: ${type}:${token.value}`, token);
        }
      }
    }
  }

  parseTopLevel = (token: Token): void => {
    switch (token.value) {
      case "Protocol": {
        this.parseProtocol(token);
        break;
      }
      case "Participants": {
        this.parseParticipants();
        break;
      }
      case "Format": {
        this.parseFormat(token);
        break;
      }
      case "Knowledge": {
        this.parseKnowledge(token);
        break;
      }
      case "Functions": {
        this.parseFunctions();
        break;
      }
      case "Equations": {
        this.parseEquations(token);
        break;
      }
      default: {
        this.throwError(`Unknown top level token: ${token.value}`, token);
        break;
      }
    }
  };

  //Participants: Alice, bob
  parseParticipants = (): void => {
    let token = this.lexer.next();
    if (token === null) {
        this.throwError(`Unexpected end of file`, token);
        return;
    }
    if(token.type !== LexTypes.id) {
        this.throwError(`Expected an id but got ${token.type}:${token.value}`, token);
        return;
    }
    //DO STUFF WITH NEW PARTICIPANT
    let participant = token.value;
    console.log("NEW PARTICIPANT: " + participant);
    token = this.lexer.next();
    if(token === null) {
        this.throwError(`Unexpected end of file`, token);
        return;
    }
    if(token.type !== LexTypes.delimiter) {
        this.throwError(`Unexpected type ${token.type}:${token.value}`, token);
        return;
    }
    if(token.value === ",") {
        return this.parseParticipants();
    }
    if(token.value === ";") {
        return;
    }
    this.throwError(`Unexpected delimiter ${token.value}`, token);
  };

  parseProtocol = (token: Token): void => {};

  parseFormat = (token: Token): void => {};

  parseKnowledge = (token: Token): void => {};

  parseFunctions = (): void => {
    let token = this.lexer.next();
    if (token === null) {
      this.throwError(`Unexpected end of file`, token);
      return;
    }
    if (token.type !== LexTypes.id) {
      this.throwError(`Expected an id but got ${token.type}:${token.value}`, token);
      return;
    }
    let functionName = token.value;
    token = this.lexer.next();
    if (token === null) {
      this.throwError(`Unexpected end of file`, token);
      return;
    }
    if (token.type !== LexTypes.delimiter || token.value !== "/") {
      this.throwError(`Expected a / but got ${token.type}:${token.value}`, token);
      return;
    }
    token = this.lexer.next();
    if (token === null) {
      this.throwError(`Unexpected end of file`, token);
      return;
    }
    if (token.type !== LexTypes.number) {
      this.throwError(`Expected a number but got ${token.type}:${token.value}`, token);
      return;
    }
    let numArgs = parseInt(token.value);
    console.log("NEW FUNCTION: " + functionName + " with " + numArgs + " args");

    token = this.lexer.next();
    if(token === null) {
        this.throwError(`Unexpected end of file`, token);
        return;
    }
    if(token.type !== LexTypes.delimiter) {
        this.throwError(`Unexpected type ${token.type}:${token.value}`, token);
        return;
    }
    if(token.value === ",") {
        return this.parseFunctions();
    }
    if(token.value === ";") {
        return;
    }
    this.throwError(`Unexpected delimiter ${token.value}`, token);
  };

  parseEquations = (token: Token): void => {};

  /**
   * A util method to get the next token until a specific type is found
   * @param type the lexer type we are looking for (ex: "delimiter")
   * @param value the value of the token we are looking for (ex: "}")
   * @returns token or null if not found
   */
  nextUntil = (type: string, value: string | null = null): Token | null => {
    let token = this.lexer.next();
    while (token !== null) {
      if (token.type === type && (value == null || value === token.value))
        return token;
      token = this.lexer.next();
    }
    return null;
  };

  checkNull(token: Token){
    if(token === null) {
        return this.throwError(`Unexpected end of file`, token);
    }
  }

  checkTokenType(token: Token, type: string){
    if(token.type !== type) {
        return this.throwError(`Unexpected type ${token.type}:${token.value}! Expected a ${type}`, token);
    }
  }

  newline(token: Token) {
    this.line.number =  LineCalc(this.template, token.end),
    this.line.startIndex = token.end + 1
  }

  private readonly calculateIndent = (token: Token): number =>
    token.begin - this.line.startIndex;

  private readonly throwError = (message: string, token: Token) => {
    const error = new Error(
      `${message} Line: ${this.line.number}:${this.calculateIndent(token)}`
    );
    error.name = "ParserError";
    error.stack = this.template.split("\n")[this.line.number - 1] + "\n" + (" ".repeat(this.calculateIndent(token))) + "^\n" + error.stack;
    throw error;
  };
}
