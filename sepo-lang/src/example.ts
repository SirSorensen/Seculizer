import * as fs from "fs";
import parse from "./index.js";
const lexerTest = async (): Promise<void> => {
  await fs.readFile("./examples/test.sepo", (err: NodeJS.ErrnoException | null, data: any) => {
    if (err !== null) {
      console.error(err);
      return;
    }
    const { ast, cst } = parse(data.toString(), true);

    console.log(ast);
    fs.writeFile("./examples/test.ast.json", JSON.stringify(ast), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Data written to file", "./examples/test.ast.json");
    });
    fs.writeFile("./examples/test.cst.json", JSON.stringify(cst), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Data written to file", "./examples/test.cst.json");
    });
  });
};
await lexerTest();
