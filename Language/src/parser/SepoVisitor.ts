import { CstNode } from 'chevrotain';
import { SepoParser, SepoLexer } from './parser_2.js';
import { latex } from './lexer/lexer';

const parserInstance = new SepoParser()

const BaseSepoVisitor = parserInstance.getBaseCstVisitorConstructor()

export class SepoToAstVisitor extends BaseSepoVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    program(ctx: any) {
        // const select = this.visit(ctx.selectClause)

        //  "this.visit" can work on either a CstNode or an Array of CstNodes.
        //  If an array is passed (ctx.fromClause is an array) it is equivalent
        //  to passing the first element of that array
        // const from = this.visit(ctx.fromClause)

        // "whereClause" is optional, "this.visit" will ignore empty arrays (optional)
        // const where = this.visit(ctx.whereClause)

        console.log("SepoVisitor:");
        //console.log(ctx);
        return ctx;
    }


    type(ctx: any) {
        return ctx;
    }

    function(ctx: any) {
        return ctx;
    }

    participants(ctx: any) {
        return ctx;
    }

    participant(ctx: any) { 
        return ctx;
    }

    knowledgeList(ctx: any) {
        return ctx;
    }

    knowledge(ctx: any) {
        return ctx;
    }

    functionsDef(ctx: any) {
        return ctx;
    }

    functionItem(ctx: any) {
        return ctx;
    }

    equation(ctx: any) {
        return ctx;
    }

    equationElement(ctx: any) {
        return ctx;
    }

    format(ctx: any) {
        return ctx;
    }

    formatElement(ctx: any) {
        return ctx;
    }

    latex(ctx: any) {
        return ctx;
    }

    protocol(ctx: any) {
        return ctx;
    }

    statement(ctx: any) {
        return ctx;
    }

    clear(ctx: any) {
        return ctx;
    }

    participantStatement(ctx: any) {
        return ctx;
    }

    name(ctx: any) {
        return ctx;
    }

    new(ctx: any) {
        return ctx;
    }
    
    set(ctx: any) {
        return ctx;
    }

    match(ctx: any) {
        return ctx;
    }

    matchCase(ctx: any) {
        return ctx;
    }

    messageSend(ctx: any) {
        return ctx;
    }

    messageSendElement(ctx: any) {
        return ctx;
    }

    expression(ctx: any) {
        return ctx;
    }

    encrypt(ctx: any) {
        return ctx;
    }

    sign(ctx: any) {
        return ctx;
    }

    expressionList(ctx: any) {
        return ctx;
    }
}