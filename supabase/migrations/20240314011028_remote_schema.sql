alter table "public"."notes" add column "fts_query" tsvector generated always as (to_tsvector('english'::regconfig, ((transcript || ' '::text) || title))) stored;

CREATE INDEX notes_fts_query ON public.notes USING gin (fts_query);


