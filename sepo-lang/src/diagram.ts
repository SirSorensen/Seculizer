import * as path from "path"
import * as fs from "fs"
import * as chevrotain from "chevrotain"
import { SepoParser } from "./parser/parser.js"

// extract the serialized grammar.
const parserInstance = new SepoParser()
const serializedGrammar = parserInstance.getSerializedGastProductions()

// create the HTML Text
const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar)

// Write the HTML file to disk

fs.writeFileSync("./diagrams/generated_diagrams.html", htmlText)