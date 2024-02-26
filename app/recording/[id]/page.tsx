import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Note from "@/components/Note";

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
    .select()
    .eq("id", id)
    .limit(1)
    .single();

  const { data: inputs } = await supabase
    .from("transcript_transformation_inputs")
    .select();

  return (
    <Header>
      <Note note={note} inputs={inputs} />
    </Header>
  );
}
