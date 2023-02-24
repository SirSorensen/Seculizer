import { ILexingResult, IToken } from "chevrotain";
import { getLexer, LexTypes } from "./lexer/lexer.js";

export class Parser {
  private readonly lexer: ILexingResult;
  private readonly template: string;
  private readonly tokens;
  private current:number | null = null;
  constructor(template: string) {
    this.lexer = getLexer(template);
    this.template = template;
    this.tokens = this.lexer.tokens;
    let token;
    while ((token = this.next()) !== null) {
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
    if (this.current === null) this.current = 0;
    return this.tokens[this.current];
  }
  private next = (): IToken => {
    if (this.current === null) this.current = 0;
    else this.current++;
    return this.getCurrent();
  }

  private peek = (): IToken => {
    if (this.current === null) this.current = 0;
    return this.tokens[this.current+1];
  }


  parseTopLevel = (token: IToken): void => {
    switch (token.image) {
      case "Protocol:": {
        this.parseProtocol(token);
        break;
      }
      case "Participants:": {
        this.parseParticipants();
        break;
      }
      case "Format:": {
        this.parseFormat();
        break;
      }
      case "Knowledge:": {
        this.parseKnowledge();
        break;
      }
      case "Functions:": {
        this.parseFunctions();
        break;
      }
      case "Equations:": {
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
    let token = this.nextCheckType(LexTypes.id);
    //DO STUFF WITH NEW PARTICIPANT
    let participant = token.image;
    console.log("NEW PARTICIPANT: " + participant);

    token = this.nextCheckType(LexTypes.delimiter);

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
    let format: Array<string> = [];

    let token = this.nextCheckType(LexTypes.id);
    let tokenHead = token.image;

    token = this.nextCheckToken(LexTypes.delimiter, "(");
    token = this.nextCheckNull();
    while(token.image !== ")") {
        this.checkType(LexTypes.id);
        format.push(token.image);

        token = this.nextCheckType(LexTypes.delimiter);
        if (token.image === ")") break;
        this.checkValue(",");

        token = this.nextCheckNull();
    }

    token = this.nextCheckToken(LexTypes.delimiter, "=");
    
    token = this.nextCheckType(LexTypes.latex);
    let latex = token.image;

    token = this.nextCheckType(LexTypes.delimiter);

    console.log("NEW FORMAT: " + tokenHead + "(" + format.join(", ") + ") = $" + latex + "$");

    if(token.image === ",") {
      this.parseFormat();
      return;
    }
    this.checkValue(";");

    
  };

  parseKnowledge = (): void => {
    let knowledge = [];

    let token = this.nextCheckToken(LexTypes.delimiter, "{");
    
    token = this.next();
    this.checkNull(token);
    while(token.tokenType.name !== LexTypes.delimiter || token.image !== "}") {
      this.checkType(LexTypes.id);
      let tokenHead = token.image;
      token = this.nextCheckToken(LexTypes.delimiter, ":");
      
      let headerKnowledge = [];
      
      token = this.nextCheckNull();
      while(token.image !== ";") {
          this.checkType(LexTypes.id);
          headerKnowledge.push(token.image);

          token = this.nextCheckType(LexTypes.delimiter);
          if (token.image === ";") break;
          this.checkValue(",");
          
          token = this.nextCheckNull();
      }
      knowledge.push([tokenHead, headerKnowledge]);
      token = this.nextCheckNull();
    }

    token = this.nextCheckToken(LexTypes.delimiter, ";");

    console.log("NEW KNOWLEDGE: " + JSON.stringify(knowledge));
  };

  parseFunctions = (): void => {
    let token = this.next();
    this.checkNull(token);
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

  parseEquations = (token: IToken): void => {
    let equations = new Map<string, string[]>();

    /*
    while(token.tokenType.name !== LexTypes.delimiter || token.image !== "}") {
        this.checkType(LexTypes.id);
        let tokenHead = token.image;
        token = this.next();
        this.checkNull();
        this.checkTypeValue(LexTypes.delimiter, "(");
        token = this.next();
        this.checkNull();
        let args = [];
        while(token.image !== ")") {
            this.checkType(LexTypes.id);
            args.push(token.image);
            token = this.next();
            this.checkNull();
            if(token.image === ")") break;
            this.checkTypeValue(LexTypes.delimiter, ",");
            token = this.next();
            this.checkNull();
        }
        token = this.next();
        this.checkNull();
        this.checkTypeValue(LexTypes.delimiter, "=");
        token = this.next();
        this.checkNull();
        this.checkType(LexTypes.latex);
        let latex = token.image;
        token = this.next();
        this.checkNull();
        this.checkTypeValue(LexTypes.delimiter, ";");
        equations.push({tokenHead, args, latex});
        token = this.next();
        this.checkNull(token);
    }
    */
  };

  parseSingleFunction = (): string => {
    let s = "";
    let token = this.nextCheckType(LexTypes.id);
    s += token.image;

    token = this.nextCheckToken(LexTypes.delimiter, "(");
    s += token.image;
    
    if (token.image !== "(") {
      this.throwError(`Expected a ( but got ${token.tokenType.name}:${token.image}`, token);
      return "";
    }

    return s
  }

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

  checkNull(token: IToken = this.getCurrent()){
    if(token === null) {
        return this.throwError(`Unexpected end of file`, token);
    }
  }

  checkType(type: string, token: IToken = this.getCurrent() ){
    if(token.tokenType.name !== type) {
        return this.throwError(`Unexpected type ${token.tokenType.name}:${token.image}! Expected a ${type}`, token);
    }
  }

  checkValue(value: string, token: IToken = this.getCurrent()){
    if (token.image !== value) {
      return this.throwError(`Expected a ${value} but got ${token.tokenType.name}:${token.image}`, token);
    }
  }

  checkTypeValue(type: string, value: string, token: IToken = this.getCurrent()){
    this.checkType(type, token);
    this.checkValue(value, token);
  }
  
  checkTokenType(type: string, token: IToken = this.getCurrent()){
    this.checkNull(token);
    this.checkType(type, token);
  }

  checkTokenValue(value: string, token: IToken = this.getCurrent()){
    this.checkNull(token);
    this.checkValue(value, token);
  }

  checkToken(type: string, value: string, token: IToken = this.getCurrent()){
    this.checkNull(token);
    this.checkTypeValue(type, value, token);
  }

  nextCheckNull(){
    let token = this.next();
    this.checkNull(token);
    return token;
  }

  nextCheckType(type: string){
    let token = this.next();
    this.checkTokenType(type)
    return token;
  }

  nextCheckValue(value: string){
    let token = this.next();
    this.checkTokenValue(value)
    return token;
  }

  nextCheckToken(type: string, value: string){
    let token = this.next();
    this.checkToken(type, value)
    return token;
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
