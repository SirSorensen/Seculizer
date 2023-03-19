import { Program} from "$lib/program.js"
import { assert, expect, test } from "vitest"
import { readFileSync } from 'fs';
import parse from "$lang/index.js"


test('Program with simple.st', () => {
    let fileStr = readFileSync("tests/sepo/simple.sepo");
    let json = parse(fileStr, false)
    let program = new Program(json, true)
    console.log(" ")
    expect(program).toBeTruthy()
})

test('Program with simple.st', () => {
    let fileStr = readFileSync("tests/sepo/TPM.sepo");
    let json = parse(fileStr, false)
    let program = new Program(json, true)
    console.log(" ")
    expect(program).toBeTruthy()
})