import * as fs from "fs";
import { getLexer } from "./lexer/lexer.js";
const print = false;
const lexerTest = async (): Promise<void> => {
  await fs.readFile(
    "./examples/test.st",
    (err: NodeJS.ErrnoException | null, data: any) => {
      if (err !== null) {
        console.error(err);
        return;
      }
      const lexer = getLexer(data.toString());
      // parser.printStack();
      console.log(lexer);
      
    }
  );
};
await lexerTest();