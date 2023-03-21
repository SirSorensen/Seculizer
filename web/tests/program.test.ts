import { Program } from "$lib/program.js"
import { assert, expect, test } from "vitest"
import { readFileSync } from "fs"
import parse from "$lang/index.js"

test("Program with simple.sepo", () => {
  let fileStr = readFileSync("tests/sepo/simple.sepo")
  let json = parse(fileStr, false)
  let program = new Program(json, true)
  console.log(" ")
  expect(program).toBeTruthy()
})

test("Program with TPM.sepo", () => {
  let fileStr = readFileSync("tests/sepo/TPM.sepo")
  let json = parse(fileStr, false)
  let program = new Program(json, true)
  console.log(" ")
  expect(program).toBeTruthy()
})

test("Program with key-relation.sepo", () => {
  let fileStr = readFileSync("tests/sepo/key-relation.sepo")
  let json = parse(fileStr, false)
  let program = new Program(json, true)
  console.log(" ")
  expect(program).toBeTruthy()
})

test("Program with send.sepo", () => {
  let fileStr = readFileSync("tests/sepo/send.sepo")
  let json = parse(fileStr, false)
  let program = new Program(json, true)
  console.log(" ")
  expect(program).toBeTruthy()
})

test("Program with send-with-enc.sepo", () => {
  let fileStr = readFileSync("tests/sepo/send-with-enc.sepo")
  let json = parse(fileStr, false)
  let program = new Program(json, true)
  console.log(" ")
  expect(program).toBeTruthy()
})
