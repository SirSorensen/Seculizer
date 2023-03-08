import { json, type RequestHandler } from '@sveltejs/kit';
import { parse } from '../../../../../Language/dist/index.js'

export const POST: RequestHandler = async ({ request }) => {
    const {content} = await request.json();
    //TODO ADD ERROR HANDLING
    let ast = parse(content, false);
    return json(ast);
};