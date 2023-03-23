import { Program } from "$lib/models/program.js";
import { afterEach, assert, expect, test } from "vitest";
import { readFileSync } from "fs";
import parse from "$lang/index.js";
import type { Id } from "$lang/types/parser/interfaces"
import type { Participant } from "$lib/models/Participant";
import type { Frame } from "$lib/models/Frame";
import * as fs from "fs";

import { beforeEach } from "vitest";

let program : Program;

function startFunction(str : string){
  if (typeof str == "string" && str == "") throw new Error("No test file given! (str == \"\"")
  
  let fileStr = readFileSync("tests/sepo/" + str + ".sepo");
  let json = parse(fileStr, false);
  program = new Program(json, true);
};

let undefinedProgram: Program;
afterEach(() => {
  program = undefinedProgram;
});



test("web/program with simple.sepo", () => {
  startFunction("simple")
  expect(program).toBeDefined();

  expect(program.keyRelations).toBeDefined();
  expect(Object.keys(program.keyRelations).length).toBeGreaterThan(0);

  expect(program.functions).toBeDefined();
  expect(Object.keys(program.functions).length).toBeGreaterThan(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats).length).toBeGreaterThan(0);

  expect(Object.keys(program.equations).length).toBeGreaterThan(0);
  
  //expect(Object.keys(program.icons).length).toBeGreaterThan(0);
  
});


test(("web/program with TPM.sepo"), () => { 
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
