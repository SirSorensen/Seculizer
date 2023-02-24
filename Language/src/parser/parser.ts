import { ILexingResult, IToken } from "chevrotain";
import { getLexer, LexTypes } from "./lexer/lexer.js";

export class Parser {
  private readonly lexer: ILexingResult;
  private readonly template: string;
  private readonly tokens;
  private current:number | undefined;
  constructor(template: string) {
    this.lexer = getLexer(template);
    this.template = template;
    //console.log(this.lexer);
    //console.log(this.lexer.errors);
    console.log(this.lexer.tokens);
    //console.log(this.lexer.groups);
    this.tokens = this.lexer.tokens;
    let token;
    while ((token = this.next()) !== null) {
      //if(token.tokenType.name === "function") console.log(token);
      const type = token.tokenType.name;
      switch (type) {
        case LexTypes.topLevel: {
          this.parseTopLevel(token);
          break;
        }
        default: {
          this.throwError(`Unknown type: ${type}:${token.image}`, token);
        }
      }
    }
  }

  private getCurrent = (): IToken => {
    if (!this.current) {
        this.current = 0;
    }
    return this.tokens[this.current];
  }
  private next = (): IToken => {
    if (!this.current) this.current = 0;
    else this.current++;
    return this.getCurrent();
  }


  parseTopLevel = (token: IToken): void => {
    switch (token.image) {
      case "Protocol": {
        this.parseProtocol(token);
        break;
      }
      case "Participants": {
        this.parseParticipants();
        break;
      }
      case "Format": {
        this.parseFormat();
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
        this.throwError(`Unknown top level token: ${token.image}`, token);
        break;
      }
    }
  };

  //Participants: Alice, bob
  parseParticipants = (): void => {
    let token = this.next();
    this.checkNull(token);
    this.checkType(token, LexTypes.id);
    //DO STUFF WITH NEW PARTICIPANT
    let participant = token.image;
    console.log("NEW PARTICIPANT: " + participant);

    token = this.next();
    this.checkNull(token);
    this.checkType(token, LexTypes.delimiter);
    if(token.image === ",") {
        return this.parseParticipants();
    }
    if(token.image === ";") {
        return;
    }

    this.throwError(`Unexpected delimiter ${token.image}`, token);
  };

  parseProtocol = (token: IToken): void => {};

  parseFormat = (): void => {
    let token = this.next();
    this.checkNull(token);
    this.checkType(token, LexTypes.id);
    let tokenHead = token.image;

    token = this.next();
    this.checkNull(token);
    this.checkTypeValue(token, LexTypes.delimiter, "(");

    token = this.next();
    this.checkNull(token);
    let format: Array<string> = [];
    while(token.image !== ")") {
        this.checkType(token, LexTypes.id);
        format.push(token.image);
        token = this.next();
        this.checkNull(token);
        if(token.image === ")") break;
        this.checkTypeValue(token, LexTypes.delimiter, ",");
        token = this.next();
        this.checkNull(token);
    }

    token = this.next();
    this.checkNull(token);
    this.checkTypeValue(token, LexTypes.delimiter, "=");

    token = this.next();
    this.checkNull(token);
    this.checkTypeValue(token, LexTypes.delimiter, "$");
    
    token = this.next();
    this.checkNull(token);
    this.checkType(token, LexTypes.latex);
    let latex = token.image;

    token = this.next();
    this.checkNull(token);
    this.checkTypeValue(token, LexTypes.delimiter, "$");

    token = this.next();
    this.checkNull(token);
    this.checkTypeValue(token, LexTypes.delimiter, ";");

    console.log("NEW FORMAT: " + tokenHead + "(" + format.join(", ") + ") = $" + latex + "$");
  };

  parseKnowledge = (token: IToken): void => {};

  parseFunctions = (): void => {
    let token = this.next();
    if (token === null) {
      this.throwError(`Unexpected end of file`, token);
      return;
    }
    if (token.tokenType.name !== LexTypes.id) {
      this.throwError(`Expected an id but got ${token.tokenType.name}:${token.image}`, token);
      return;
    }
    let functionName = token.image;
    token = this.next();
    if (token === null) {
      this.throwError(`Unexpected end of file`, token);
      return;
    }
    if (token.tokenType.name !== LexTypes.delimiter || token.image !== "/") {
      this.throwError(`Expected a / but got ${token.tokenType.name}:${token.image}`, token);
      return;
    }
    token = this.next();
    if (token === null) {
      this.throwError(`Unexpected end of file`, token);
      return;
    }
    if (token.tokenType.name !== LexTypes.number) {
      this.throwError(`Expected a number but got ${token.tokenType.name}:${token.image}`, token);
      return;
    }
    let numArgs = parseInt(token.image);
    console.log("NEW FUNCTION: " + functionName + " with " + numArgs + " args");

    token = this.next();
    if(token === null) {
        this.throwError(`Unexpected end of file`, token);
        return;
    }
    if(token.tokenType.name !== LexTypes.delimiter) {
        this.throwError(`Unexpected type ${token.tokenType.name}:${token.image}`, token);
        return;
    }
    if(token.image === ",") {
        return this.parseFunctions();
    }
    if(token.image === ";") {
        return;
    }
    this.throwError(`Unexpected delimiter ${token.image}`, token);
  };

  parseEquations = (token: IToken): void => {};

  /**
   * A util method to get the next token until a specific type is found
   * @param type the lexer type we are looking for (ex: "delimiter")
   * @param value the value of the token we are looking for (ex: "}")
   * @returns token or null if not found
   */
  nextUntil = (type: string, value: string | null = null): IToken | null => {
    let token = this.next();
    while (token !== null) {
      if (token.tokenType.name === type && (value == null || value === token.image))
        return token;
      token = this.next();
    }
    return null;
  };

  checkNull(token: IToken){
    if(token === null) {
        return this.throwError(`Unexpected end of file`, token);
    }
  }

  checkType(token: IToken, type: string){
    if(token.tokenType.name !== type) {
        return this.throwError(`Unexpected type ${token.tokenType.name}:${token.image}! Expected a ${type}`, token);
    }
  }

  checkTypeValue(token: IToken, type: string, value: string){
    if (token.tokenType.name !== type || token.image !== value) {
      return this.throwError(`Expected a ${value} but got ${token.tokenType.name}:${token.image}`, token);
    }
  }

  private readonly getIndent = (token: IToken): number =>
    (token.startColumn ?? -1);

  private readonly throwError = (message: string, token: IToken) => {
    const error = new Error(
      `${message} Line: ${token.startLine}:${this.getIndent(token)}`
    );
    error.name = "ParserError";
    error.stack = this.template.split("\n")[(token.startLine ?? 0)-1] + "\n" + (" ".repeat(this.getIndent(token)-1)) + "^\n" + error.stack;
    throw error;
  };
  
}
