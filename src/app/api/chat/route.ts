import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { db } from '../../../../db/db';

export const maxDuration = 30;

const guardRails = (query: string) => {

  const trimmedQuery = query.trim().toLowerCase();

  const forbiddenKeywords = [
    'drop',
    'delete',
    'update',
    'insert',
    'alter',
    'truncate',
    'rename',
  ];

  const hasForbiddenKeywords = forbiddenKeywords.some(keywords => trimmedQuery.includes(keywords));

  if (hasForbiddenKeywords) {
    return {
      isValid: false,
      errorMessage: `The user input contains info that might trigger database change`,
      fixSuggestion: `Please fix your input to avoid any database changes.`,
    };
  }

  return {
    isValid: true,
    errorMessage: '',
    fixSuggestion: '',
  };
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural language.

  CONTEXT:
  - The current date and time is ${new Date().toLocaleString('sv-SE')}.
  - The database type is SQLite.
  - The database tables are products and sales

  ACCESS CAPABILITIES:
  You have access to following tools:
  1. schema tool call this tool to get the database schema which will help you to write sql query.
  2. db tool call this tool to query the database.
  
  Rules:
  1. Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)
  2. Always use the schema provided by the schema tool
  3. Return valid SQLite syntax
  4. Always respond in a helpful, conversational tone while being technically accurate.

  SAFETY GUIDELINES:
  - Never execute queries that could return sensitive data without user confirmation
  - Always validate that table and column names exist in the schema
  - If unsure about a query, ask for clarification before executing
  - If a query fails, explain the error and suggest corrections

  RESPONSE STYLE:
  - Be conversational and helpful
  - Explain what you're doing and why
  - Provide context about the data you're retrieving
  - If results are large, summarize key insights
  - Always confirm the query before executing it
  `

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages: convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(5),
    tools: {
      schema: tool({
        description: "Call this tool to get the database schema information",
        inputSchema: z.object({}),
        execute: async () => {
          return `CREATE TABLE products (
          id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          name text NOT NULL,
          category text NOT NULL,
          price real NOT NULL,
          stock integer DEFAULT 0 NOT NULL,
          created_at text DEFAULT CURRENT_TIMESTAMP
          );
          CREATE TABLE sales (
          id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          product_id integer NOT NULL,
          quantity integer NOT NULL,
          total_amount real NOT NULL,
          sale_date text DEFAULT CURRENT_TIMESTAMP,
          customer_name text NOT NULL,
          region text NOT NULL,
          FOREIGN KEY (product_id) REFERENCES products (id) ON UPDATE no action ON DELETE no action
          );`;
        },
      }),
      db: tool({
        description: 'Call this tool to query the database.',
        inputSchema: z.object({
          query: z.string().describe('The SQL query to be executed on the database.'),
        }),
        execute: async ({ query }) => {
          console.log(query);
          //Important: make sure you sanitise or validate the query before executing it on the database. ( Guardrails )
          const { isValid, errorMessage, fixSuggestion } = guardRails(query);
          if (!isValid) {
            return {
              result: errorMessage,
              fixSuggestion: fixSuggestion,
            };
          }
          await db.run(query);
          return {
            result: 'Query executed successfully.',
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}