import { json, type RequestHandler } from '@sveltejs/kit';
import parse from '$lang'

export async function POST({ request }: { request: Request}) {
    const {content} = await request.json();
    //TODO ADD ERROR HANDLING
    let ast; 
    try {
        ast = parse(content, false);
    } catch (error:any) {
        return json({error: error.message});
    }
    return json(ast);
};