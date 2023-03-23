import { throwSimpleParseError } from "./parser/ParseError.js";
import { SepoToAstVisitor } from "./parser/SepoVisitor.js";
import { SepoLexer } from "./parser/lexer.js";
import { SepoParser } from "./parser/parser.js";

export * from "./parser/lexer.js";
export function parse(input: string, includeCST: boolean) {
  //return {ast: null, cst: null};
  const lexResult = SepoLexer.tokenize(input.toString() + "eof");
  const parser = new SepoParser();
  parser.input = lexResult.tokens;
  const cst = parser.program();

  if (parser.errors.length > 0) {
    let error = parser.errors[0];
    throwSimpleParseError(error.message, error.token, input.toString() + "eof");
  }
  if (includeCST) return { ast: new SepoToAstVisitor(input.toString() + "eof").visit(cst), cst: cst };
  else return new SepoToAstVisitor(input.toString() + "eof").visit(cst);
}
