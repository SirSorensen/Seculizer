/*import gelex from "gelex";
import { Lexer } from "./Interfaces";

const def = gelex.definition();

/*def.define("attribute", "[a-zA-Z-]*=", function (value: string) {
  return value.substring(0, value.length - 1);
});*/
/*
const idRegex = "[a-zA-Z_][a-zA-Z0-9_]*";
def.define(LexTypes.topLevel, idRegex + ":", function (value: string) {
  return value.substring(0, value.length - 1);
});
def.define(LexTypes.id, idRegex);
def.define(LexTypes.number, "[0-9][0-9]*");
def.defineText(LexTypes.string, '"', '"');
def.define(LexTypes.newline, "\n");
def.define(LexTypes.delimiter, ["{", "}", "(", ")", ";", ",", "/"]);

import * as chevrotain from "@chevrotain/types";
import { createToken } from "chevrotain";

/*
export function getLexer(data: any): Lexer {
  return def.lexer(data);
}
*/
export enum LexTypes {
  id = "id",
  topLevel = "toplevel",
  string = "string",
  newline = "newline",
  number = "number",
  delimiter = "delimiter",
  latex = "latex",
}
const id = createToken({ name: LexTypes.id, pattern: /[a-zA-Z_][a-zA-Z0-9_]*/ })

const topLevel = createToken({
  name: LexTypes.topLevel,
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*:/,
  longer_alt: id, //Means that it will first also check id
})

const string = createToken({
  name: LexTypes.string,
  pattern: /"[^"]*"/,
})

const newLine = createToken({
  name: LexTypes.newline,
  pattern: /\n/,
  line_breaks: true,
})

const whiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: chevrotain.Lexer.SKIPPED
})

const number = createToken({
  name: LexTypes.number,
  pattern: /[0-9][0-9]*/,
})

const delimiter = createToken({
  name: LexTypes.delimiter,
  pattern: /[{()};,\/$=]/,
})

const latex = createToken({
  name: LexTypes.latex,
  pattern: /\$[^$]*\$/,
})
