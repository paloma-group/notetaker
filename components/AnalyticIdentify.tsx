'use client';

import { identify } from '@/utils/analytics/mixpanel';
import { useEffect } from 'react';

export const AnalyticIdentify = ({
  referer,
  userId,
}: {
  referer: string | null;
  userId: string;
}) => {
  'use client';

  if (!referer?.includes('/login')) {
    return null;
  }

  useEffect(() => {
    identify(userId);
  }, []);
  return null;
};
