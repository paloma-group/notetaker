import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const req = await request.json();
  const supabase = createClient();
  const { noteId } = req;
  const { data } = await supabase.from("notes").select().eq("id", noteId).limit(1).single();

  const audioFilePath = data?.audio_file_path;

  if (!audioFilePath) return NextResponse.json({ data: { error: 'an error occurred while fetching the audio file path.' } });

  const { data: urlData } = await supabase.storage
    .from("voice-notes")
    .createSignedUrl(audioFilePath, 60 * 5);

  if (!urlData?.signedUrl) return NextResponse.json({ data: { error: 'an error occurred while generateing the signed url note.' } });

  const mp3 = await fetch(urlData.signedUrl);
  const arrayBuffer = await mp3.arrayBuffer();

  const outputFilePath = "transcript.mp3";
  const mp3Buffer = Buffer.from(arrayBuffer);

  fs.writeFileSync(outputFilePath, mp3Buffer);

  const file = fs.createReadStream(outputFilePath);

  const response = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  // delete temp file
  fs.unlink(outputFilePath, () => {});

  if (!response?.text) return NextResponse.json({ data: { error: 'an error occurred while transcribing note.' } });

  const { data: updatedNoteData, error } = await supabase
    .from("notes")
    .update({ transcript: response.text })
    .eq("id", noteId)
    .select()
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (!updatedNoteData) return NextResponse.json({ data: { error: 'an error occurred while updating note.' } });

  return NextResponse.json({ data: updatedNoteData });
}
