# FishingBucket Website

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/FishingBucket/FishingBucketWebsite)
![GitHub contributors](https://img.shields.io/github/contributors/FishingBucket/FishingBucketWebsite)
![GitHub License](https://img.shields.io/github/license/FishingBucket/FishingBucketWebsite)
![GitHub repo size](https://img.shields.io/github/repo-size/FishingBucket/FishingBucketWebsite)

![Fluxer](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fapi.fluxer.app%2Fv1%2Finvites%2Ffishingbucket&query=%24.presence_count&suffix=%20online&logo=Fluxer&label=Fluxer&logoColor=4641D9&labelColor=white&color)
![Discord](https://img.shields.io/discord/1478257699274621120?label=Discord&logo=discord&labelColor=white)

FishingBucket is the next-generation of proxy services.

The website and dashboard to interact with FishingBucket, a Fluxer and Discord bot to forward messages into faux-profiles called "proxies", akin to Tupperbox and PluralKit.

# Self-Hosting

To self-host the website, ensure that you have [Node.js](https://nodejs.org) installed. Furthermore, obtain either [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/) for dependency management.

## Obtaining Source Code

To fetch the source code, execute the command in the parent directory of where you want to store your copy of FishingBucketWebsite:

1. Clone the repository into the subdirectory `FishingBucketWebsite/`
    ```shell
    git clone --recurse-submodules https://github.com/FishingBucket/FishingBucketWebsite
    ```
2. Change current working directory into project root
    ```shell
    cd FishingBucketWebsite
    ```

Now, you should be able to move onto setting up your instance.

## Setup

To continue with setting up, install the dependencies of the project at the root:

- With `npm`:
    ```shell
    npm install
    ```
- With `pnpm`:
    ```shell
    pnpm install
    ```

Then, create a file in the project root called `config_public.json`. Follow the schema defined in [`config_public.schema.json`](./config_public.schema.json) and the example defined in [`config_public.example.json`](./config_public.example.json) to write the configuration file.

Make sure the API URL matches up your FishingBucket's configured API server.

## Run in Dev Mode

To test your configuration, run the project in development mode:

- With `npm`:
    ```shell
    npm run dev
    ```
- With `pnpm`:
    ```shell
    pnpm dev
    ```

After vite is ready, visit [http://localhost:5173/](http://localhost:5173/).

## Run in Production

Before running the production FishingBucket website, you would have to make the pages for Terms of Service, Privacy Policy, Copyright, and Contact. To do this, make the directories `terms`, `privacy`, `copyright`, and `contact`, respectively, under `src/routes/`. Then, in each directory, make a `+page.svelte` file.

FishingBucket website uses [Svelte](https://svelte.dev/), but for those pages, you can just write plain HTML body.

Currently, FishingBucket website's deployment is only tested with Cloudflare Workers.

### Deploy with Cloudflare Workers

First, make sure that there are no errors by testing a build locally:

- With `npm`:
    ```shell
    npm run build
    ```
- With `pnpm`:
    ```shell
    pnpm build
    ```

Once the build finishes, you should be able to deploy to Cloudflare Workers.

#### 1. Create Wrangler Config

Create a file named `wrangler.jsonc` in the root of the project. This file tells Cloudflare how to further configure the deployment.

You can reference the file [`wrangler.example.jsonc`](./wrangler.example.jsonc) to configure Wrangler. Cloudflare's documentation on Wrangler can be found [here](https://developers.cloudflare.com/workers/wrangler/configuration/).

#### 2. Push Changes

Create a GitHub or GitLab repository (can be private) for your Cloudflare deployment, then, add it as a remote called `deploy`:

```shell
git remote add deploy <repository URL>
```

Then, commit your brand and configuration changes and push them to the repository:

```shell
git add -A
git commit -m "brand and configuration changes"
git push deploy master
```

The `config_public.json` file is safe to publish.

#### 3. Deploy to Cloudflare Worker

Sign into your Cloudflare account, then under Compute > Workers & Pages, click on `Create application`. Create your worker by connecting with your repository's GitHub or GitLab (you might need to authorize Cloudflare for this).

After selecting the repository, double check and make sure that the build command is:

- With `npm`:
    ```shell
    npm run build
    ```
- With `pnpm`:
    ```shell
    pnpm build
    ```

And `npx wrangler deploy` as the deploy command.

After the configuration, click the `Deploy` button. You should then be able to visit the deployed site at the websites shown in the Cloudflare Worker dashboard.

### Updating Code

To update the source code for FishingBucket Website, run the following command in the project root:

```shell
git pull origin master --recurse-submodules
```

If you have a Cloudflare Worker deployment, update it by running:

```shell
git push deploy master
```

This will automatically trigger Cloudflare to rebuild your website.
