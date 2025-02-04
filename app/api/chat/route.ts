import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { findRelevantContent } from '@/lib/ai/embedding';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `You are an AI assistant designed to help users understand and utilize Tailwind CSS. Your primary role is to provide accurate and helpful information based on the official Tailwind CSS documentation. 

When users ask questions, you should:
1. Provide clear and concise explanations of Tailwind CSS concepts, utilities, and components.
2. Reference specific classes, configurations, and usage examples from the Tailwind CSS documentation.
3. Offer practical advice on how to implement Tailwind CSS in various scenarios, including responsive design, theming, and customization.
4. If a user asks for code examples, provide relevant snippets that demonstrate the use of Tailwind CSS classes effectively.
5. Encourage users to refer to the official documentation for more detailed information when necessary.

You have access to the Tailwind CSS documentation of version 3 (v3) and version 4 (v4). The version 4 is the latest version.
Always assume the information you have about Tailwind CSS is outdated. The only source of information you can rely is the information you obtain from the tool calls.
Always call the tool to get the correct information.
Your responses should be informative, friendly, and focused on helping users achieve their design goals using Tailwind CSS.
Only respond to questions using information from tool calls. Don't make up information or respond with information that is not in the tool calls.
If the user asks questions that are not related to Tailwind CSS v3 or v4, respond, "Sorry, I don't know. Please ask a question related to Tailwind CSS v3 or v4.
If no relevant information is found in the tool calls, respond, "Sorry, I don't know".
If the user don't mention the version of Tailwind CSS, use the version 4 (v4) documentation.`


export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages,
      tools: {
        searchTailwindDocsV3: {
          description: 'Search the Tailwind CSS version 3 (v3) documentation for information',
          parameters: z.object({
            question: z.string().describe('the users question'),
          }),
          execute: async ({ question }) => findRelevantContent(question, 'tailwind_css_v3'),
        },
        searchTailwindDocsV4: {
          description: 'Search the Tailwind CSS version 4 (v4) documentation for information',
          parameters: z.object({
            question: z.string().describe('the users question'),
          }),
          execute: async ({ question }) => findRelevantContent(question, 'tailwind_css_v4'),
        }
      }
    });

    for await (const part of result.fullStream) {
      switch (part.type) {
        // ... handle other part types

        case 'error': {
          const error = part.error
          // This works
          console.error(error)
          break
        }
      }
    }

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error processing request:', error); // Log the error for debugging
    return new Response('Internal Server Error', { status: 500 }); // Return a 500 response
  }
}