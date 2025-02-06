import { openai } from '@ai-sdk/openai';
import { InvalidToolArgumentsError, NoSuchToolError, streamText, ToolExecutionError } from 'ai';
import { findRelevantContent, returnUpgradeGuide } from '@/lib/ai/embedding';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `You are an AI assistant designed to help users understand and utilize Tailwind CSS. Your primary role is to provide accurate and helpful information based on the official Tailwind CSS documentation. 

When users ask questions, you should:
1. Provide clear and concise explanations of Tailwind CSS concepts, utilities, and components using the information from the documentation of the specific version.
2. Reference specific classes, configurations, and usage examples from the Tailwind CSS documentation accessed by the documentation of the specific version.
3. Offer practical advice on how to implement Tailwind CSS in various scenarios, including responsive design, theming, and customization once you get the information from the documentation.
4. If a user asks for code examples, provide relevant snippets that demonstrate the use of Tailwind CSS classes effectively according to the information from the documentation.
5. Encourage users to refer to the official documentation for more detailed information when necessary.

You have access to the Tailwind CSS documentation of version 3 (v3) and version 4 (v4). The version 4 is the latest version.
Always assume the information you have about Tailwind CSS, not retrieved from the documentation, is outdated. The only source of information you can rely is the information you obtain from the documentation.
Always call the right tool to get the correct information for the specific version.
Your responses should be informative, friendly, and focused on helping users achieve their design goals using Tailwind CSS.
Only respond to questions using information from tool calls. Don't make up information or respond with information that is not in the tool calls.
If the user asks questions that are not related to Tailwind CSS, respond, "Sorry, I don't know. Please ask a question related to Tailwind CSS v3 or v4".
If no relevant information is found in the tool calls, respond, "Sorry, I couldn't find an answer on the documentation. Can you please elaborate your question in a different way?".
If the user don't mention the version of Tailwind CSS, use the version 4 (v4) documentation.
When answering questions about tailwind version 4, you should use theme variables instead of tailwind.config.js file. If your original answer for a Tailwind CSS version 4 contains a mention to tailwind.config.js, review it to use instead of the css theme variables of version 4.
When answering questions about the latest version (v4) of Tailwind CSS, always confront your answer with the upgrade guide from Tailwind CSS to verify your information is correct.
`

// These are some questions that I know are not very well answered by the tool calls
// how do i add default line height to my text-sm
// set it default for the text-sm utility class
// how do I add a default value to line height on my text-sm class?



export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      topP: 0.1,
      messages,
      tools: {
        searchTailwindDocsV3: {
          description: 'Search the Tailwind CSS version 3 (v3) documentation for information',
          parameters: z.object({
            question: z.string().describe('the users question'),
          }),
          execute: async ({ question }) => {
            return findRelevantContent(question, 'tailwind_css_v3')
          },
        },
        searchTailwindDocsV4: {
          description: 'Search the Tailwind CSS version 4 (v4) documentation for information',
          parameters: z.object({
            question: z.string().describe('the users question'),
          }),
          execute: async ({ question }) => {
            return findRelevantContent(question, 'tailwind_css_v4')
          },
        },
        searchUpgradeGuide: {
          description: 'Check the upgrade guide from Tailwind CSS to verify your information is correct',
          parameters: z.object({}),
          execute: async () => {
            return returnUpgradeGuide()
          },
        }
      },
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

    return result.toDataStreamResponse({
      getErrorMessage: error => {
        if (NoSuchToolError.isInstance(error)) {
          console.log('The model tried to call a unknown tool.', error)
          return 'The model tried to call a unknown tool.';
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          console.log('The model called a tool with invalid arguments.', error)
          return 'The model called a tool with invalid arguments.';
        } else if (ToolExecutionError.isInstance(error)) {
          console.log('An error occurred during tool execution.', error)
          return 'An error occurred during tool execution.';
        } else {
          console.log('An unknown error occurred.', error)
          return 'An unknown error occurred.';
        }
      },
    });
  } catch (error) {
    console.error('Error processing request:', error); // Log the error for debugging
    return new Response('Internal Server Error', { status: 500 }); // Return a 500 response
  }
}