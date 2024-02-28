import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Note from "@/components/Note";

export const dynamic = 'force-dynamic';

export default async function Recording({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: note } = await supabase
    .from("notes")
    .select(
      `id, transcript, highlights, created_at, user_id, transcript_transformations ( transformed_text, transcript_transformation_inputs ( type ) )`,
    )
    .eq("id", id)
    .limit(1)
    .single();

  const { data: inputs } = await supabase
    .from("transcript_transformation_inputs")
    .select(`id, input, type`);

  return (
    <Header>
      {note && inputs ? <Note note={note} inputs={inputs} /> : null}
    </Header>
  );
}
