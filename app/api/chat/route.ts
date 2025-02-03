import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { findRelevantContent } from '@/lib/ai/embedding';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `You are an AI assistant designed to help users understand and utilize Tailwind CSS v3. Your primary role is to provide accurate and helpful information based on the official Tailwind CSS documentation. 

When users ask questions, you should:
1. Provide clear and concise explanations of Tailwind CSS concepts, utilities, and components.
2. Reference specific classes, configurations, and usage examples from the Tailwind CSS v3 documentation.
3. Offer practical advice on how to implement Tailwind CSS in various scenarios, including responsive design, theming, and customization.
4. If a user asks for code examples, provide relevant snippets that demonstrate the use of Tailwind CSS classes effectively.
5. Encourage users to refer to the official documentation for more detailed information when necessary.

Your responses should be informative, friendly, and focused on helping users achieve their design goals using Tailwind CSS v3.
Only respond to questions using information from tool calls.
If the user asks questions that are not related to Tailwind CSS v3, respond, "Sorry, I don't know. Please ask a question related to Tailwind CSS v3.
If no relevant information is found in the tool calls, respond, "Sorry, I don't know.`



export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages,
      tools: {
        searchTailwindDocs: {
          description: 'Search the Tailwind CSS v3 documentation for information',
          parameters: z.object({
            question: z.string().describe('the users question'),
          }),
          execute: async ({ question }) => findRelevantContent(question),
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