import * as fs from "fs";
import { throwSimpleParseError } from "./parser/ParseError.js";
import { SepoParser, SepoLexer } from './parser/parser_2.js';
import { SepoToAstVisitor } from "./parser/SepoVisitor.js";
//import { Parser } from './parser/parser.js';
const lexerTest = async (): Promise<void> => {
  await fs.readFile(
    "./examples/test.st",
    (err: NodeJS.ErrnoException | null, data: any) => {
      if (err !== null) {
        console.error(err);
        return;
      }
      //new Parser(data.toString());
      const lexResult = SepoLexer.tokenize(data.toString() + "eof");
      const parser = new SepoParser();
      parser.input = lexResult.tokens;
      //console.log(parser);

      const cst = parser.program();
      
      if (parser.errors.length > 0) {
        let error = parser.errors[0];
        throwSimpleParseError(error.message, error.token, data.toString() + "eof");
      }


      const ast = new SepoToAstVisitor().visit(cst);

      console.log(ast);
      fs.writeFile('./examples/test.ast.json', JSON.stringify(ast), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Data written to file', './examples/test.ast.json');
      });
      fs.writeFile('./examples/test.cst.json', JSON.stringify(cst), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Data written to file', './examples/test.cst.json');
      });
      
    }
  );
};
await lexerTest();