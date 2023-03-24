import { Program } from "$lib/models/program.js";
import { afterEach, assert, expect, test } from "vitest";
import { readFileSync } from "fs";
import parse from "$lang/index.js";
import type { Id, Type, FunctionCall } from "$lang/types/parser/interfaces";
import type { Frame } from "$lib/models/Frame";
import path from "path";
import { Latex } from "../src/lib/models/Latex";
import { fileURLToPath } from "url";
import { LatexMap } from "$lib/models/LatexMap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const examplesFolder = path.resolve(__dirname, "../../specification/Examples");
let program: Program;

function startFunction(str: string) {
  if (typeof str == "string" && str == "") throw new Error('No test file given! (str == ""');

  let relativePath = path.resolve(examplesFolder, str + ".sepo");
  let fileStr = readFileSync(relativePath);
  let json = parse(fileStr, false);

  program = new Program(json, false);
}

let undefinedProgram: Program;
afterEach(() => {
  program = undefinedProgram;
});

test("web/program with simple.sepo", () => {
  startFunction("simple");
  expect(program).toBeDefined();

  expect(program.keyRelations).toBeDefined();
  expect(Object.keys(program.keyRelations).length).toBeGreaterThan(0);

  expect(program.functions).toBeDefined();
  expect(Object.keys(program.functions).length).toBeGreaterThan(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats).length).toBeGreaterThan(0);

  expect(Object.keys(program.equations).length).toBeGreaterThan(0);

  expect(Object.keys(program.icons).length).toBe(0);
});

test("web/program with TPM.sepo", () => {
  startFunction("TPM");
  expect(program).toBeDefined();
});

test("web/program with key-relation.sepo", () => {
  startFunction("key-relation");
  expect(program).toBeTruthy();
});

test("web/program with send.sepo", () => {
  startFunction("send");
  expect(program).toBeTruthy();
});

test("web/program with send-with-enc.sepo", () => {
  startFunction("send-with-enc");
  expect(program).toBeTruthy();
});

test("web/program with send-and-clear.sepo", () => {
  startFunction("send-and-clear");
  expect(program).toBeTruthy();
  let last = program.first?.getLast();
  expect(last).toBeTruthy();
  expect(last).toBeDefined();
  last = last as Frame;

  expect(last.getParticipantMap().getParticipants()).toBeDefined();

  let amountOfParticipants = last.getParticipantMap().getParticipantAmount();
  expect(amountOfParticipants).toBe(3);

  let alice = last.getParticipantMap().getParticipant("Alice");
  expect(alice).toBeDefined();

  expect(alice?.getKnowledgeList().length).toBe(0);
});

test("web/Program with icon-test.sepo", () => {
  startFunction("icon-test");
  expect(program).toBeTruthy();
  expect(program.icons).toBeTruthy();
  expect(program.icons.size).toBe(5);
  const id: Id = { type: "id", value: "Alice" };
  const icon = program.icons.get(id.value);
  expect(icon).toBeTruthy();
  expect(icon).toBe("woman");
});

test("web/Program with clear.sepo", () => {
  startFunction("clear");
  expect(program).toBeTruthy();
  const first = program.first;
  expect(first).toBeTruthy();
  const firstParticipants = first?.getParticipantMap().getParticipants();
  expect(Object.keys(firstParticipants || {}).length).toBe(3);

  for (const key of Object.keys(firstParticipants || {})) {
    if (key === "Shared") continue;
    if (!firstParticipants) throw new Error("firstParticipants is undefined");
    const participant = firstParticipants[key];

    expect(participant).toBeTruthy();
    expect(participant?.getKnowledgeList().length).toBe(1);
  }
  const last = first?.getLast();
  expect(last).toBeTruthy();
  const participants = last?.getParticipantMap().getParticipants();
  expect(participants).toBeTruthy();
  expect(Object.keys(participants || {}).length).toBe(3);
  for (const participant of Object.values(participants || {})) {
    expect(participant.getKnowledgeList().length).toBe(0);
  }
});

test("Construct Latex class & constructLatex method test", () => {
  let init_param1: Type = { type: "id", value: "x" };
  let init_param2: Type = { type: "id", value: "y" };
  let init_func: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] };

  let latex = new Latex("$Hash(x||y||x)$", init_func);

  let param1: Type = { type: "id", value: "z" };
  let param2: Type = { type: "number", value: 5 };
  let func: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] };

  let result = latex.constructLatex(func);

  expect(result).toBe("$Hash(z||5||z)$");
});


test("Make LatexMap and call a function with embedded function", () => {
    let init_param1: Type = { type: "id", value: "x" };
    let init_param2: Type = { type: "id", value: "y" };
    let init_func1: FunctionCall = { type: "function", id: "Hash", params: [init_param1, init_param2] };
    let init_func2: FunctionCall = { type: "function", id: "Base", params: [init_param1, init_param2] };

    let latexMap = new LatexMap();
    latexMap.addLatex("$Hash(x||y||x)$", init_func1);
    latexMap.addLatex("$Based_{XXX}(y&&x)$", init_func2);

    let param1: Type = { type: "id", value: "z" };
    let param2: Type = { type: "number", value: 5 };
    let param3: Type = { type: "string", value: "Jesus" };
    let func1: FunctionCall = { type: "function", id: "Hash", params: [param1, param2] };
    let func2: FunctionCall = { type: "function", id: "Base", params: [param3, func1] };


    let result = latexMap.getConstructedLatex(func2);

    expect(result).toBe("$Based_{XXX}(Hash(z||5||z)&&Jesus)$");

})
