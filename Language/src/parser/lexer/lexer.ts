import gelex from "gelex";
import { Lexer } from "./Interfaces";

const def = gelex.definition();
export enum LexTypes {
  id = "id",
  topLevel = "toplevel",
  string = "string",
  newline = "newline",
  number = "number",
  delimiter = "delimiter",
}
/*def.define("attribute", "[a-zA-Z-]*=", function (value: string) {
  return value.substring(0, value.length - 1);
});*/
const idRegex = "[a-zA-Z_][a-zA-Z0-9_]*";
def.define(LexTypes.topLevel, idRegex + ":", function (value: string) {
  return value.substring(0, value.length - 1);
});
def.define(LexTypes.id, idRegex);
def.define(LexTypes.number, "[0-9]+");
def.defineText(LexTypes.string, '"', '"');
def.define(LexTypes.newline, "\n");
def.define(LexTypes.delimiter, ["{", "}", "(", ")", ";", ","]);

def.defineComment("//");
def.defineComment("/*", "*/");

export function getLexer(data: any): Lexer {
  return def.lexer(data);
}
