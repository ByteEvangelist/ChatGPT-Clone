# ChatGPT-Clone
[Official Instance](https://chatgpt-clone-e5f.pages.dev/)
- frontend client made with react and vite, meant to be hosted as a standalone static site. (official instance hosted on cloudflare pages)
- OpenAI proxy server, made with nodejs and express, can be ran on a dedicated server or a virtual enviroment however it will not run on the edge.
- OpenAI proxy edge function will not run on dedicated server or non-cloudflare runtimes.
- Local llms hosted with HuggingFaces [text-generation-inference](https://github.com/huggingface/text-generation-inference)
- Local llm proxy edge function will not run on dedicated server or non-cloudflare runtimes.

# Hosting Your Own Instance
All components can be self hosted or you can selfhost certain components and use the official instances of other components. All neccasary components and their official Instance are listed below.
  - Static site frontend [Official Instance](https://chatgpt-clone-e5f.pages.dev/)
  - A CloudFlare Worker to proxy request to either the official OpenAI api or a HF text-generation-inference instance
    - OpenAI CloudFlare Worker [Official Instance](https://edge.encyclopedia-buddy.workers.dev/)
    - HuggingFace CloudFlare Worker [Official Instance](https://huggingfaceedge.encyclopedia-buddy.workers.dev/)
  - (optional) HuggingFace text-generation inference [Official Instance](https://test.blueridgegrizzly.com/)
# Hosting Static Site Frontend
The static site frontend was made with react, if you don't want to make any changes to it you can find a built version in `Root/Client/Dist/` which can be uploaded to a static site host like CloudFlare pages, GitHub Pages etc.

If you would like to make changes to the frontend you can `git clone` the `Root/Client` folder and make changes as needed. To run the dev preview run `npm run dev` and to build run `npm run build` which will build the React project to static files in the `Dist` folder

# Hosting OpenAI API Proxy Worker
1. Follow the instuctions above to host a Static Site Frontend
2. Make a CloudFlare account [Here](https://www.cloudflare.com/)
3. Make an OpenAI account [Here](https://platform.openai.com/)
4. `git clone` the `Root/Client/Edge` directory from this repo
5. Install cloudflare wrangler in the cmd
6. Make a secret value labled `OPENAI_API_KEY` with the value of your OpenAI API key found [Here](https://platform.openai.com/account/api-keys)
7. Run `wrangler publish` to publish the worker to the web
8. Copy the link to your worker and change the values in `.env.production` and `.env.development` to the link to your worker
9. Test the frontend to make sure everything is working with `npm run dev`
10. Build the frontend with `npm run build`
