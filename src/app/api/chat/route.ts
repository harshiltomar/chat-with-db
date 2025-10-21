import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert QE assistant that helps users to query their database using natural language.
  You have access to following tools:
  1. schema tool call this tool to get the database schema which will help you to write sql query.
  2. db tool call this tool to query the database.
  
  Rules:
  1. Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)
  2. Always use the schema provided by the schema tool
  3. Return valid SQLite syntax
  4. Always respond in a helpful, conversational tone while being technically accurate.`

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    tools: {
      weather: tool({
        description: 'Call this tool to query the database.',
        inputSchema: z.object({
          query: z.string().describe('The SQL query to be executed on the database.'),
        }),
        execute: async ({ query }) => {
          console.log(query);
          return {
            result: 'Query executed successfully.',
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}