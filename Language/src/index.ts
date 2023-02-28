import * as fs from "fs";
import { SepoParser, SepoLexer } from './parser/parser_2.js';
//import { Parser } from './parser/parser.js';
const print = false;
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
      const cst = parser.program();
      console.log(cst);
      
    }
  );
};
await lexerTest();