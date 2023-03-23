import parse from "../dist/index.js";
import fs from "fs";
import { expect, it } from "vitest";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caseFolder = path.resolve(__dirname, "../../specification/Examples");
console.log("caseFolder: " + caseFolder);

fs.readdirSync(caseFolder).forEach(function (file) {
  it("should parse " + file, function () {
    const input = fs.readFileSync(caseFolder + "/" + file, "utf8").replace(/\r/g, ""); // Windows be like: nEwLIne iS \r\n

    if (!input) throw new Error("No input file found");
    const ast = parse(input, false);
    expect(ast).toBeTruthy();
    expect(ast).toMatchSnapshot();
  });
});
