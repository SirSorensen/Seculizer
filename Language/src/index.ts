import * as fs from "fs";
import { Parser } from './parser/parser.js';
const print = false;
const lexerTest = async (): Promise<void> => {
  await fs.readFile(
    "./examples/test.st",
    (err: NodeJS.ErrnoException | null, data: any) => {
      if (err !== null) {
        console.error(err);
        return;
      }
      new Parser(data.toString());
    }
  );
};
await lexerTest();