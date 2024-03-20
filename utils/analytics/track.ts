import { Mixpanel } from 'mixpanel-browser';

export function track(event: string) {
  if ((window as any).mixpanel) {
    const mixpanel: Mixpanel = (window as any).mixpanel;
    mixpanel.track(event);
  }
}
