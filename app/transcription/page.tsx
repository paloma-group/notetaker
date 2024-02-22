import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Transcript from "@/components/Transcript";

export default async function Transcription() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <Header>
    <Transcript/>
  </Header>;
}
