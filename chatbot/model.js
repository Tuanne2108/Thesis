import { OpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const model = new OpenAI({
        temperature: 0.9,
        openAIApiKey: process.env.OPENAI_API_KEY, 
    });

    const res = await model.call("Who is the president of the USA?");
    console.log(res);
}

main().catch(err => console.error(err));
