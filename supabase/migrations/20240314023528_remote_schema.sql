create table "public"."ai_integration" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "type" text,
    "api_key" text,
    "user_id" uuid
);


alter table "public"."ai_integration" enable row level security;

CREATE UNIQUE INDEX ai_integration_pkey ON public.ai_integration USING btree (id);

alter table "public"."ai_integration" add constraint "ai_integration_pkey" PRIMARY KEY using index "ai_integration_pkey";

alter table "public"."ai_integration" add constraint "public_ai_integration_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."ai_integration" validate constraint "public_ai_integration_user_id_fkey";

grant delete on table "public"."ai_integration" to "anon";

grant insert on table "public"."ai_integration" to "anon";

grant references on table "public"."ai_integration" to "anon";

grant select on table "public"."ai_integration" to "anon";

grant trigger on table "public"."ai_integration" to "anon";

grant truncate on table "public"."ai_integration" to "anon";

grant update on table "public"."ai_integration" to "anon";

grant delete on table "public"."ai_integration" to "authenticated";

grant insert on table "public"."ai_integration" to "authenticated";

grant references on table "public"."ai_integration" to "authenticated";

grant select on table "public"."ai_integration" to "authenticated";

grant trigger on table "public"."ai_integration" to "authenticated";

grant truncate on table "public"."ai_integration" to "authenticated";

grant update on table "public"."ai_integration" to "authenticated";

grant delete on table "public"."ai_integration" to "service_role";

grant insert on table "public"."ai_integration" to "service_role";

grant references on table "public"."ai_integration" to "service_role";

grant select on table "public"."ai_integration" to "service_role";

grant trigger on table "public"."ai_integration" to "service_role";

grant truncate on table "public"."ai_integration" to "service_role";

grant update on table "public"."ai_integration" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."ai_integration"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for users based on user_id"
on "public"."ai_integration"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update for users based on user_id"
on "public"."ai_integration"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


