import { ILexingResult, IToken } from "chevrotain";
import { getLexer, LexTypes } from "./lexer/lexer.js";

export class Parser {
  private readonly lexer: ILexingResult;
  private readonly template: string;
  private readonly tokens;
  private current: number | null = null;
  constructor(template: string) {
    this.lexer = getLexer(template);
    this.template = template;
    this.tokens = this.lexer.tokens;
    let token;
    while ((token = this.next(false)) !== null && token) {
      
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
  };
  private next = (checkNull = true): IToken => {
    if (this.current === null) this.current = 0;
    else this.current++;
    if (checkNull) this.checkNull();
    return this.getCurrent();
  };

  private peek = (): IToken => {
    if (this.current === null) this.current = 0;
    return this.tokens[this.current + 1];
  };

  parseTopLevel = (token: IToken): void => {
    switch (token.image) {
      case "Protocol:": {
        this.parseProtocol();
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
        this.parseEquations();
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
    this.checkType(LexTypes.id);

    //DO STUFF WITH NEW PARTICIPANT
    let participant = token.image;
    console.log("NEW PARTICIPANT: " + participant);

    token = this.next();
    this.checkType(LexTypes.delimiter);

    if (token.image === ",") {
      return this.parseParticipants();
    }
    if (token.image === ";") {
      return;
    }

    this.throwError(`Unexpected delimiter ${token.image}`, token);
  };

  parseFormat = (): void => {
    let s = this.parseFunctionCall();

    let token = this.next();
    this.checkTypeValue(LexTypes.delimiter, "=");

    token = this.next();
    this.checkType(LexTypes.latex);
    let latex = token.image;

    token = this.next();
    this.checkType(LexTypes.delimiter);

    console.log("NEW FORMAT: " + s + " = $" + latex + "$");

    if (token.image === ",") {
      this.parseFormat();
      return;
    }
    this.checkValue(";");
  };

  parseKnowledge = (): void => {
    let knowledge = [];

    let token = this.next();
    this.checkTypeValue(LexTypes.delimiter, "{");

    token = this.next();
    this.checkNull(token);
    while (token.tokenType.name !== LexTypes.delimiter || token.image !== "}") {
      this.checkType(LexTypes.id);
      let tokenHead = token.image;
      token = this.next();
      this.checkTypeValue(LexTypes.delimiter, ":");

      let headerKnowledge = [];

      token = this.next();
      while (token.image !== ";") {
        this.checkType(LexTypes.id);
        headerKnowledge.push(token.image);

        token = this.next();
        this.checkType(LexTypes.delimiter);
        if (token.image === ";") break;
        this.checkValue(",");

        token = this.next();
      }
      knowledge.push([tokenHead, headerKnowledge]);
      token = this.next();
    }

    token = this.next();
    this.checkTypeValue(LexTypes.delimiter, ";");

    console.log("NEW KNOWLEDGE: " + JSON.stringify(knowledge));
  };

  parseFunctions = (): void => {
    let token = this.next();
    this.checkNull(token);
    if (token.tokenType.name !== LexTypes.id) {
      this.throwError(
        `Expected an id but got ${token.tokenType.name}:${token.image}`,
        token
      );
      return;
    }
    let functionName = token.image;
    token = this.next();
    if (token === null) {
      this.throwError(`Unexpected end of file`, token);
      return;
    }
    if (token.tokenType.name !== LexTypes.delimiter || token.image !== "/") {
      this.throwError(
        `Expected a / but got ${token.tokenType.name}:${token.image}`,
        token
      );
      return;
    }
    token = this.next();
    if (token === null) {
      this.throwError(`Unexpected end of file`, token);
      return;
    }
    if (token.tokenType.name !== LexTypes.number) {
      this.throwError(
        `Expected a number but got ${token.tokenType.name}:${token.image}`,
        token
      );
      return;
    }
    let numArgs = parseInt(token.image);
    console.log("NEW FUNCTION: " + functionName + " with " + numArgs + " args");

    token = this.next();
    if (token === null) {
      this.throwError(`Unexpected end of file`, token);
      return;
    }
    if (token.tokenType.name !== LexTypes.delimiter) {
      this.throwError(
        `Unexpected type ${token.tokenType.name}:${token.image}`,
        token
      );
      return;
    }
    if (token.image === ",") {
      return this.parseFunctions();
    }
    if (token.image === ";") {
      return;
    }
    this.throwError(`Unexpected delimiter ${token.image}`, token);
  };

  parseEquations = (): void => {
    let eq1 = this.parseFunctionCall();

    let token = this.next();
    this.checkTypeValue(LexTypes.delimiter, "=");

    let eq2 = this.parseFunctionCall();

    token = this.next();
    this.checkType(LexTypes.delimiter);
    if (token.image == ",") {
      this.parseEquations();
      return;
    } else if (token.image === ";") {
      return;
    }
    this.throwError(`Unexpected delimiter ${token.image}`, token);
  };

  parseFunctionCall = (): string => {
    let token = this.next();
    this.checkType(LexTypes.functionCall);
    let s = token.image;

    while (token.image !== ")") {
      if (this.peek().tokenType.name === LexTypes.functionCall) {
        this.parseFunctionCall();
      } else if (this.peek().tokenType.name === LexTypes.id) {
        token = this.next();
        s += token.image;
      }

      token = this.next();
      this.checkType(LexTypes.delimiter);
      s += token.image;
    }
    return s;
  };

  parseProtocol = (): void => {
    let token = this.next();
    this.checkTypeValue(LexTypes.delimiter, "{");
    while (this.peek().image !== "}") {
      this.parseMsgSend();
    }
    token = this.next();
    this.checkTypeValue(LexTypes.delimiter, "}");
    token = this.next();
    this.checkTypeValue(LexTypes.delimiter, ";");
  };

  parseMsgSend = (): void => {
    let token = this.next();
    this.checkType(LexTypes.id);
    let sender = token.image;
    token = this.next();
    this.checkTypeValue(LexTypes.delimiter, "->");
    token = this.next();
    this.checkType(LexTypes.id);
    let receiver = token.image;
    token = this.next();
    this.checkTypeValue(LexTypes.delimiter, ":");

    this.parseExpression();

    token = this.next();
    this.checkType(LexTypes.delimiter);

    while (token.image === ",") {
      this.parseExpression();
      token = this.next();
      this.checkType(LexTypes.delimiter);
    }

    this.checkValue(";");

    console.log(sender + " -> " + receiver);
  };

  parseExpression = (): void => {
    let token = this.peek();
    switch (token.tokenType.name) {
      case LexTypes.functionCall: {
        console.log(
          "NEW EXPRESSION: " +
            this.parseFunctionCall() +
            " it has type functionCall!"
        );
        break;
      }
      case LexTypes.id: {
        console.log("NEW EXPRESSION: " + token.image + " it has type id!");
        token = this.next();
        break;
      }
      case LexTypes.number: {
        console.log("NEW EXPRESSION: " + token.image + " it has type number!");
        token = this.next();
        break;
      }
      case LexTypes.string: {
        console.log("NEW EXPRESSION: " + token.image + " it has type string!");
        token = this.next();
        break;
      }
      case LexTypes.delimiter: {
        token = this.next();
        this.checkValue("{");
        token = this.peek();
        if (token.image === "|") {
          //SIGN
          token = this.next();
          this.parseExpression()
          token = this.next();
          this.checkValue("|");
        } else {
          this.parseExpression()
        }
        token = this.next();
        this.checkValue("}");
        this.parseExpression();
        break;
      }
      default: {
        token = this.next();
        this.throwError(
          `Unexpected type ${token.tokenType.name}:${token.image}`,
          token
        );
        break;
      }
    }
  };

  /**
   * A util method to get the next token until a specific type is found
   * @param type the lexer type we are looking for (ex: "delimiter")
   * @param value the value of the token we are looking for (ex: "}")
   * @returns token or null if not found
   */
  nextUntil = (type: string, value: string | null = null): IToken | null => {
    let token = this.next();
    while (token !== null) {
      if (
        token.tokenType.name === type &&
        (value == null || value === token.image)
      )
        return token;
      token = this.next();
    }
    return null;
  };

  checkNull(token: IToken = this.getCurrent()) {
    if (token === null) {
      return this.throwError(`Unexpected end of file`, token);
    }
  }

  checkType(type: string, token: IToken = this.getCurrent()) {
    if (token.tokenType.name !== type) {
      return this.throwError(
        `Unexpected type ${token.tokenType.name}:${token.image}! Expected a ${type}`,
        token
      );
    }
  }

  checkValue(value: string, token: IToken = this.getCurrent()) {
    if (token.image !== value) {
      return this.throwError(
        `Expected a ${value} but got ${token.tokenType.name}:${token.image}`,
        token
      );
    }
  }

  checkTypeValue(
    type: string,
    value: string,
    token: IToken = this.getCurrent()
  ) {
    this.checkType(type, token);
    this.checkValue(value, token);
  }

  private readonly getIndent = (token: IToken): number =>
    token.startColumn ?? -1;

  private readonly throwError = (message: string, token: IToken) => {
    const error = new Error(
      `${message} Line: ${token.startLine}:${this.getIndent(token)}`
    );
    error.name = "ParserError";
    error.stack =
      this.template.split("\n")[(token.startLine ?? 0) - 1] +
      "\n" +
      " ".repeat(this.getIndent(token) - 1) +
      "^\n" +
      error.stack;
    throw error;
  };
}
