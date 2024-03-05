import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import NotesTable from "@/components/NotesTable";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: notes } = await supabase
    .from("notes")
    .select("id, title, note_tags ( tags ( name ) )")
    .order("created_at", { ascending: false });

  return (
    <Header>
      <div className="h-dvh flex flex-col items-center justify-center -mt-36">
        <div className="">
          <Link
            href="/record"
            className="flex items-center px-6 py-4 border border-gray-300 hover:border-orange-500 rounded-full"
          >
            <span className="block rounded-full bg-orange-500 mr-2">
              <span className="block w-3 h-3 m-3 rounded-full bg-white"></span>
            </span>
            <span className="text-2xl">Record a note</span>
          </Link>
        </div>
      </div>
      <NotesTable notes={notes} />
    </Header>
  );
}
