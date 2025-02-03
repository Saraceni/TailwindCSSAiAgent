import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';

const embeddingModel = openai.embedding('text-embedding-ada-002');
export const DEFAULT_CHUNK_SIZE = 4500;
export const DEFAULT_OVERLAP = 800;

export const generateChunks = (text: string, chunkSize: number = DEFAULT_CHUNK_SIZE, overlap: number = DEFAULT_OVERLAP): string[] => {
    const chunks = [];
    let start = 0;
    const textLength = text.length;

    while (start < textLength) {
        // Calculate end position
        let end = start + chunkSize;

        // If we're at the end of the text, just take what's left
        if (end >= textLength) {
            chunks.push(text.slice(start).trim());
            break;
        }

        // Try to find a code block boundary first (```)
        let chunk = text.slice(start, end);
        const codeBlock = chunk.lastIndexOf('```');
        if (codeBlock !== -1 && codeBlock > chunkSize * 0.3) {
            end = start + codeBlock;
        }
        // If no code block, try to break at a paragraph
        else if (chunk.includes('\n\n')) {
            // Find the last paragraph break
            const lastBreak = chunk.lastIndexOf('\n\n');
            if (lastBreak > chunkSize * 0.3) {  // Only break if we're past 30% of chunkSize
                end = start + lastBreak;
            }
        }
        // If no paragraph break, try to break at a sentence
        else if (chunk.includes('. ')) {
            // Find the last sentence break
            const lastPeriod = chunk.lastIndexOf('. ');
            if (lastPeriod > chunkSize * 0.3) {  // Only break if we're past 30% of chunkSize
                end = start + lastPeriod + 1; // +1 to include the period
            }
        }

        // Extract chunk and clean it up
        chunk = text.slice(start, end).trim();
        if (chunk) {
            chunks.push(chunk);
        }

        // Move start position for next chunk
        start = Math.max(start + 1, end);
    }

    return chunks;
};

export const generateEmbeddings = async (
    value: string,
    chunkSize: number = DEFAULT_CHUNK_SIZE,
    overlap: number = DEFAULT_OVERLAP,
): Promise<Array<{ embedding: number[]; content: string, chunkSize: number, overlap: number }>> => {

    const chunks = generateChunks(value, chunkSize, overlap);
    var embeddingsGenerated: Array<{ embedding: number[]; content: string }> = [];

    for (const chunk of chunks) {
        console.log(`Embedding chunk: ${chunk.length} tokens`);
        const { embedding } = await embed({
            model: embeddingModel,
            value: chunk,
        });
        embeddingsGenerated.push({ embedding, content: chunk });
    }

    return embeddingsGenerated.map((e, i) => ({ content: chunks[i], embedding: e.embedding, chunkSize, overlap }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
    const input = value.replaceAll('\\n', ' ');
    const { embedding } = await embed({
        model: embeddingModel,
        value: input,
    });
    return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
    const userQueryEmbedded = await generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(
        embeddings.embedding,
        userQueryEmbedded,
    )})`;
    const similarGuides = await db
        .select({ name: embeddings.content, similarity })
        .from(embeddings)
        .where(gt(similarity, 0.7))
        .orderBy(t => desc(t.similarity))
        .limit(3);
    return similarGuides;
};
