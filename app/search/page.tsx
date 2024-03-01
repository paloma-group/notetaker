import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import NotesTable from "@/components/NotesTable";

export default async function Search({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const q = searchParams.q;

  const { data: notes, error } = await supabase
    .from("notes")
    .select(
      `
      id,
      title,
      note_tags!inner(tags!inner(name))
    `,
    )
    .textSearch(`note_tags.tags.name`, `${q}`, {
      type: "websearch",
      config: "english",
    });

  return (
    <Header>
      <div className="mt-32">
        <NotesTable notes={notes} />
      </div>
    </Header>
  );
}
