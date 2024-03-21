drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

create policy "Enable delete for users based on user_id"
on "public"."note_tags"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM notes n
  WHERE ((n.id = note_tags.note_id) AND (n.user_id = auth.uid())))));


create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to authenticated
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = id));



