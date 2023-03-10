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
def.define(LexTypes.delimiter, ["{", "}", "(", ")", ";", ",", "/", "$", "="]);
def.define(LexTypes.latex, "$[^$]*$");
*/
//def.defineComment("//");
//def.defineComment("/*", "*/");

import { createToken, Lexer } from "chevrotain"

export enum LexTypes {
  id = "id",
  topLevel = "toplevel",
  string = "string",
  number = "number",
  delimiter = "delimiter",
  latex = "latex",
  functionCall = "functionCall",
}
export const id = createToken({ 
  name: LexTypes.id, 
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/ 
})

export const topLevel = createToken({
  name: LexTypes.topLevel,
  pattern: /((Protocol)|(Participants)|(Functions)|(Format)|(Knowledge)|(Equations)):/,
})

export const functionCall = createToken({
  name: LexTypes.functionCall,
  pattern: /([a-zA-Z_][a-zA-Z0-9_]*)\(/
})

  

export const string = createToken({
  name: LexTypes.string,
  pattern: /"[^"]*"/,
})

export const whiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
})

export const number = createToken({
  name: LexTypes.number,
  pattern: /[0-9][0-9]*/,
})

export const delimiter = createToken({
  name: LexTypes.delimiter,
  pattern: /[{()};,\/=:|]|(->)/,
})

export const LBrace = createToken({
  name: "LBrace",
  pattern: /{/,
})

export const RBrace = createToken({
  name: "RBrace",
  pattern: /}/,
})

export const LPar = createToken({
  name: "LPar",
  pattern: /\(/,
})

export const RPar = createToken({
  name: "RPar",
  pattern: /\)/,
})

export const Semicolon = createToken({
  name: "Semicolon",
  pattern: /;/,
})

export const Comma = createToken({
  name: "Comma",
  pattern: /,/,
})

export const Slash = createToken({
  name: "Slash",
  pattern: /\//,
})

export const Dollar = createToken({
  name: "Dollar",
  pattern: /\$/,
})

export const Colon = createToken({
  name: "Colon",
  pattern: /:/,
})

export const Equals = createToken({
  name: "Equals",
  pattern: /=/,
})

export const Arrow = createToken({
  name: "Arrow",
  pattern: /->/,
})

export const Pipe = createToken({
  name: "Pipe",
  pattern: /\|/,
})


export const latex = createToken({
  name: LexTypes.latex,
  pattern: /\$[^$]*\$/,
})

export const allTokens = [
  whiteSpace,
  topLevel,
  functionCall,
  id,
  string,
  number,
  delimiter,
  latex,
]
let lexer = new Lexer(allTokens)

export function getLexer(input: any) {
  return lexer.tokenize(input)
}