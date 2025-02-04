import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { resources, ResourceType } from '@/lib/db/schema/resources';
import fs from 'fs';
import path from 'path';
import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';
import { createResource } from '@/lib/actions/resources';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

const getV3Docs = async (currentDirectory: string) => {
    const filePath = path.join(currentDirectory, 'urls_v3.md');
    // There is file: in the path, I need to remove it
    const filePathWithoutFile = filePath.replace('file:', '');

    // Can I turn this into async promise?
    const data = await fs.promises.readFile(filePathWithoutFile, 'utf8');
    const urlsArray = data.split('\n');

    scrapUrlList(urlsArray, "tailwind_css_v3");
}

const getV4Docs = async (currentDirectory: string) => {
    const filePath = path.join(currentDirectory, 'urls_v4.md');
    // There is file: in the path, I need to remove it
    const filePathWithoutFile = filePath.replace('file:', '');

    // Can I turn this into async promise?
    const data = await fs.promises.readFile(filePathWithoutFile, 'utf8');
    const urlsArray = data.split('\n');

    scrapUrlList(urlsArray, "tailwind_css_v4");
}

const scrapUrlList = async (urlsArray: string[], source: string) => {
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
                        source,
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
}

export async function GET(req: Request) {
    // Get a parameter on the url
    const url = new URL(req.url);
    const version = url.searchParams.get('version');

    // I need to read the content of urls.md
    // I need to get the path of the current file
    const currentFilePath = import.meta.url;
    const currentDirectory = path.dirname(currentFilePath);

    console.log("Version: ", version);
    
    if(version === "v3"){
        console.log("Getting v3 docs");
        getV3Docs(currentDirectory);

        return new Response("Web scrapping Tailwind CSS v3 docs", {
            status: 200,
        })
    } else if(version === "v4"){
        //console.log("Getting v4 docs");
        getV4Docs(currentDirectory);

        return new Response("Web scrapping Tailwind CSS v4 docs", {
            status: 200,
        })
    }

    return new Response("Invalid version", {
        status: 400,
    })
}