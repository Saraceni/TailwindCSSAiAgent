'use server';

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from '@/lib/db/schema/resources';
import { db } from '../db';
import { DEFAULT_CHUNK_SIZE, DEFAULT_OVERLAP, generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';

export const createResource = async (input: NewResourceParams) => {
  const { title, content, description, type, url } = insertResourceSchema.parse(input);

  const [resource] = await db
    .insert(resources)
    .values({ title, content, description, type, url })
    .returning();

  const embeddings = await generateEmbeddings(content);
  await db.insert(embeddingsTable).values(
    embeddings.map(embedding => ({
      resourceId: resource.id,
      ...embedding,
      chunkSize: DEFAULT_CHUNK_SIZE,
      overlap: DEFAULT_OVERLAP,
    })),
  );

  return 'Resource successfully created and embedded.';
};