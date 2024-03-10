# Dictaphone AI

Record voice notes & transcribe, summarize, get tasks and much more.

## Demo

Fully working demo at [https://dictaphone-ai.vercel.app/](https://dictaphone-ai.vercel.app/).

## Built with

- [Next.js](https://nextjs.org) Supabase template
- supabase-ssr - a package to configure Supabase Auth to use cookies
- Styled with [Tailwind CSS](https://tailwindcss.com)

## Clone and run locally

1. Pull down the repo

   ```bash
   git clone https://github.com/paloma-group/dictaphone
   ```

2. Use `cd` to change into the app's directory

   ```bash
   cd dictaphone
   ```

3. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   OPENAI_API_KEY=[INSERT OPENAI API KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

4. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The app should now be running on [localhost:3000](http://localhost:3000/).
