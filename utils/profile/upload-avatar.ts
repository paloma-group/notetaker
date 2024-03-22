import { createClient } from '@/utils/supabase/client';
import { v4 } from 'uuid';

const supabase = createClient();

export const uploadAvatar = async (profileId: number, avatar: File) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const file = avatar;
  const fileExt = file.name.split('.').pop();
  const filePath = `/${user?.id}/${v4()}/avatar.${fileExt}`;

  const uploadResult = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  const result = await supabase
    .from('profiles')
    .upsert({ id: profileId, user_id: user?.id, avatar_url: filePath })
    .select('avatar_url')
    .limit(1)
    .single();

  return { data: result.data, error: uploadResult.error || result.error };
};
