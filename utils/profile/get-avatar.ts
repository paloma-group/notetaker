import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

export async function getAvatar(path?: string) {
  if (!path) {
    return;
  }

  const { data, error } = await supabase.storage.from('avatars').download(path);
  if (!data) {
    return;
  }
  return URL.createObjectURL(data);
}
