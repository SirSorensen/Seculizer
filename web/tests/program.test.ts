import { Program } from "$lib/models/program.js";
import { afterEach, assert, expect, test } from "vitest";
import { readFileSync } from "fs";
import parse from "$lang/index.js";
import type { Id } from "$lang/types/parser/interfaces";
import type { Frame } from "$lib/models/Frame";
import path from "path";
import { fileURLToPath } from "url";
import { Participant } from '../src/lib/models/Participant';

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
  console.log("firstParticipants", firstParticipants,);
  
  for (const key of Object.keys(firstParticipants || {})) {
    if(key === "Shared") continue;
    if(!firstParticipants) throw new Error("firstParticipants is undefined");
    const participant = firstParticipants[key];
    console.log(participant);
    
    expect(participant).toBeTruthy();
    expect(participant?.getKnowledgeList().length).toBe(1);
  }
  const last = first?.getLast();
  expect(last).toBeTruthy();
  console.log(last);
  const participants = last?.getParticipantMap().getParticipants();
  expect(participants).toBeTruthy();
  expect(Object.keys(participants || {}).length).toBe(3);
  for (const participant of Object.values(participants || {})) {
    expect(participant.getKnowledgeList().length).toBe(0);
  }
});
