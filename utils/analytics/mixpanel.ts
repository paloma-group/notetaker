import { Mixpanel } from 'mixpanel-browser';

function mixpanel() {
  if ((window as any).mixpanel) {
    return (window as any).mixpanel as Mixpanel;
  }
}

export function track(...args: Parameters<Mixpanel['track']>) {
  mixpanel()?.track(...args);
}

export function identify(...args: Parameters<Mixpanel['identify']>) {
  mixpanel()?.identify(...args);
}

export function reset(...args: Parameters<Mixpanel['reset']>) {
  mixpanel()?.reset(...args);
}
