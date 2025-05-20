# Protocoding AI Sanity Page Builder

```shell
bun install
```

run the nextjs app

```shell
bun run dev
```

Do initialize a fresh website, go in cusor and reference @block.md found in /scripts/block.md

- It will then ask you a series of questions about your brand
- It will suggest blocks to create, and when you say Yes, will make them
- It will generate /scripts/block-definitions configuration files
- It will import each of these into an index.ts file making them accessible

After all blocks are created, it will prompt you to run the script.
(If it doesn't do this, say: "lets run the script now") and it will work.

Once this is done open the custom page builder running locally in your browser on [http://localhost:3000/create](http://localhost:3000/create). and start selecting blocks.

When done, type in the page: example "/about" and press publish and it will redirect you to this page
after it is done building and sending the blog requests to Sanity.

---

Sanity Studio

Open the Studio running locally in your browser on [http://localhost:3000](http://localhost:3000). Use the same service (Google, GitHub, or email)

These are the enviroment variables needed. Navigate to [https://www.sanity.io/manage](https://www.sanity.io/manage) to get project ID, dataset, read, and write tokens

```shell
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
NEXT_PUBLIC_SANITY_STUDIO_URL=/studio
SANITY_STUDIO_PRESENTATION_URL=http://localhost:3000
SANITY_STUDIO_TITLE="My Studio"
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=
```
