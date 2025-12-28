# How to Deploy to Vercel

## Prerequisites
- You have a [Vercel account](https://vercel.com/signup).
- You have pushed your code to GitHub (which we just did!).

## Step-by-Step Guide

1.  **Log in to Vercel**
    - Go to [vercel.com](https://vercel.com) and log in.

2.  **Import Project**
    - On your dashboard, click the **"Add New..."** button (usually top right) and select **"Project"**.
    - You should see a list of your GitHub repositories.
    - Find `tic-tac-toe-with-Alith` and click the **"Import"** button next to it.

3.  **Configure Project**
    - You will see a "Configure Project" screen.
    - **Project Name**: You can leave this as is.
    - **Framework Preset**: Vercel should automatically detect "Vite". If not, select it.
    - **Root Directory**: Leave as `./` (default).

4.  **Add Environment Variables (CRITICAL)**
    - Click to expand the **"Environment Variables"** section.
    - You need to add your Grok API key here so the app can talk to the AI.
    - **Key**: `VITE_GROK_API_KEY`
    - **Value**: (Paste your actual API key here. It starts with `xai-...`)
    - Click **"Add"**.

5.  **Deploy**
    - Click the **"Deploy"** button.
    - Vercel will now build your project. This usually takes about a minute.

6.  **Success!**
    - Once finished, you will see a "Congratulations!" screen.
    - Click the screenshot of your app to visit your live URL (e.g., `https://tic-tac-toe-with-alith.vercel.app`).

## Troubleshooting
-   **Build Failed?** Check the logs. If it complains about missing types, ensure `npm run build` works locally.
-   **AI Not Working?** Double-check that you added the `VITE_GROK_API_KEY` correctly in Step 4.
