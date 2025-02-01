# AI Agent for Tailwind CSS Documentation

This project implements an AI agent that utilizes Retrieval-Augmented Generation (RAG) to access the full documentation of Tailwind CSS version 3. The agent can efficiently retrieve and provide information from the documentation based on user queries.

## Overview

The AI agent is designed to read and process the Tailwind CSS documentation, allowing users to ask questions and receive accurate responses based on the official documentation. The project leverages embeddings to enhance the retrieval process, ensuring that the agent can quickly access relevant information.

## Features

- **RAG Implementation**: Combines retrieval and generation techniques to provide accurate responses.
- **Embeddings**: Each URL from the Tailwind CSS documentation is stored as a resource in the database, with corresponding embeddings for efficient retrieval.
- **API Endpoint**: A GET endpoint that reads `urls.md`, which contains all URLs for the Tailwind CSS documentation.

## Getting Started

### Prerequisites

- Node.js (version >= v18.17.0)
- npm or yarn
- A database (e.g., PostgreSQL) for storing resources and embeddings

### Environment Variables

To run the application, you need to create a `.env` file in the root directory of the project with the following environment variables:

```plaintext
DATABASE_URL=<your_postgresql_database_url>
OPENAI_API_KEY=<your_openai_api_key>
FIRECRAWL_API_KEY=<your_firecrawl_api_key>
```

- **`DATABASE_URL`**: The connection string for your PostgreSQL database.
- **`OPENAI_API_KEY`**: Your API key for accessing OpenAI services for chat and embeddings.
- **`FIRECRAWL_API_KEY`**: The API key for the Firecrawl service used for web scraping.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Saraceni/TailwindCSSAiAgent.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   yarn install
   ```

3. Set up your database and configure the connection settings in your environment variables.

### Usage

1. **Run the Application**:
   ```bash
   pnpm run dev
   # or
   yarn dev
   ```

2. **Access the web scrapping API**:
   - The webscrapping API is available at `http://localhost:3000/api/tailwind`.
   - The GET endpoint reads `urls.md` and creates embeddings for each page.

### API Endpoint

- **GET /api/tailwind**
  - Reads `urls.md`, which contains all URLs for the Tailwind CSS documentation.
  - Creates embeddings for each resource in the database.

### Database Schema

Each resource in the database represents a URL from the Tailwind CSS documentation. The schema includes:

- **Resource ID**: Unique identifier for each resource.
- **URL**: The URL of the Tailwind CSS documentation.
- **Embeddings**: Vector representations of the resource for efficient retrieval.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for their excellent documentation.
- [OpenAI](https://openai.com/) for the inspiration behind the RAG approach.


# This project was bootsrapped with the Vercel AI SDK RAG Guide Starter Project

This is the starter project for the Vercel AI SDK [Retrieval-Augmented Generation (RAG) guide](https://sdk.vercel.ai/docs/guides/rag-chatbot).

In this project, you will build a chatbot that will only respond with information that it has within its knowledge base. The chatbot will be able to both store and retrieve information. This project has many interesting use cases from customer support through to building your own second brain!

This project will use the following stack:

- [Next.js](https://nextjs.org) 14 (App Router)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [OpenAI](https://openai.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Postgres](https://www.postgresql.org/) with [ pgvector ](https://github.com/pgvector/pgvector)
- [shadcn-ui](https://ui.shadcn.com) and [TailwindCSS](https://tailwindcss.com) for styling
