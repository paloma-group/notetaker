import { Mixpanel } from 'mixpanel-browser';

export function track(...args: Parameters<Mixpanel['track']>) {
  if ((window as any).mixpanel) {
    const mixpanel: Mixpanel = (window as any).mixpanel;
    mixpanel.track(...args);
  }
}
