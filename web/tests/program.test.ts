import { Program } from "$lib/models/program.js";
import { assert, expect, test } from "vitest";
import { readFileSync } from "fs";
import parse from "$lang/index.js";
import type { Id } from "$lang/types/parser/interfaces"
import type { Participant } from "$lib/models/Participant";
import type { Frame } from "$lib/models/Frame";
import * as fs from "fs";

import { beforeEach } from "vitest";

let program : Program;
let str : string;

beforeEach(() => {
  if (typeof str == "string" && str == "") throw new Error("No test file given! (str == \"\"")

  // let lexerBeforeEach = async (): Promise<void> => { 
  //   await fs.readFile("tests/sepo/" + str + ".sepo", (err: NodeJS.ErrnoException | null, data: any) => {
  //     if (err !== null) {
  //       console.error(err);
  //       return;
  //     }
  //     const { ast, cst } = parse(data.toString(), true);
  //     program = new Program(ast, false);
  //   });  
  // }

  // await lexerBeforeEach;
  
  let fileStr = readFileSync("tests/sepo/" + str + ".sepo");
  let json = parse(fileStr, false);
  program = new Program(json, true);
});


str = "simple"
test("web/program with simple.sepo", () => {
  expect(program).toBeTruthy();

  expect(program.keyRelations).toBeDefined();
  expect(Object.keys(program.keyRelations).length).toBeGreaterThan(0);

  expect(program.functions).toBeDefined();
  expect(Object.keys(program.functions).length).toBeGreaterThan(0);

  expect(program.formats).toBeDefined();
  expect(Object.keys(program.formats).length).toBeGreaterThan(0);

  expect(Object.keys(program.equations).length).toBeGreaterThan(0);

  expect((program.icons).keys.length).toBeGreaterThan(0);
  
  expect(Object.keys(program.icons).length).toBeGreaterThan(0);
  
});

str = "TPM"
test(("web/program with TPM.sepo"), () => {
  expect(program).toBeTruthy();
});

str = "key-relation"
test("web/program with key-relation.sepo", () => {
  expect(program).toBeTruthy();
});

str = "send"
test("web/program with send.sepo", () => {
  expect(program).toBeTruthy();
});

str = "send-with-enc"
test("web/program with send-with-enc.sepo", () => {
  expect(program).toBeTruthy();
});


str = "send-and-clear";
test("web/program with send-and-clear.sepo", () => {
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
  let fileStr = readFileSync("tests/sepo/icon-test.sepo");
  let json = parse(fileStr, false);
  let program = new Program(json, true);
  console.log(" ");
  expect(program).toBeTruthy();
  expect(program.icons).toBeTruthy();
  expect(program.icons.size).toBe(5);
  const id: Id = { type: "id", value: "Alice" };
  const icon = program.icons.get(id.value);
  expect(icon).toBeTruthy();
  expect(icon).toBe("woman");
});
