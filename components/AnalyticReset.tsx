'use client';

import { reset, identify } from '@/utils/analytics/mixpanel';
import { useEffect } from 'react';

export const AnalyticReset = () => {
  'use client';

  useEffect(() => {
    reset();
  }, []);
  return null;
};
