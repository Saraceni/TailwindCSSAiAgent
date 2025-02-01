import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { resources, ResourceType } from '@/lib/db/schema/resources';
import fs from 'fs';
import path from 'path';
import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';
import { createResource } from '@/lib/actions/resources';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

export async function GET(req: Request) {

    // I need to read the content of urls.md
    // I need to get the path of the current file
    const currentFilePath = import.meta.url;
    const currentDirectory = path.dirname(currentFilePath);
    const filePath = path.join(currentDirectory, 'urls.md');
    // There is file: in the path, I need to remove it
    const filePathWithoutFile = filePath.replace('file:', '');

    // Can I turn this into async promise?
    const data = await fs.promises.readFile(filePathWithoutFile, 'utf8');
    const urlsArray = data.split('\n');


    for (var url of urlsArray) {
        // I need to check if there is a resource on the db with the same url
        const resource = await db.select().from(resources).where(eq(resources.url, url));
        if (resource.length === 0) {
            const scrapeResult = await app.scrapeUrl(url, { formats: ['markdown', 'html'] }) as ScrapeResponse;

            if (!scrapeResult.success) {
                throw new Error(`Failed to crawl: ${scrapeResult.error}`)
            }


            if (scrapeResult.markdown) {

                // Use the createResource function
                const title = scrapeResult.title || scrapeResult.metadata?.title || '';
                const description = scrapeResult.description || scrapeResult.metadata?.description || '';

                try {
                    await createResource({
                        url: url,
                        type: ResourceType.URL,
                        content: scrapeResult.markdown,
                        title: title,
                        description: description,
                    });

                    console.log("Resource created: ", title, description);
                } catch (error) {
                    console.error("Error creating resource: ", title, error);
                    break;
                }

                // I need to wait some random time between 0.7 and 1.5 seconds
                const waitTime = Math.floor(Math.random() * 800) + 700;
                await new Promise(resolve => setTimeout(resolve, waitTime));

            }


        }
    }

    return new Response("Web scraping finished", {
        status: 200,
    })
}