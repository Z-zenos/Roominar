import type { Settings } from './appSettings';
import { DEFAULT_SETTINGS } from './appSettings';

// override default options with query parameters if any
const urlSearchParams = new URLSearchParams(window.location.search);

for (const param of Object.keys(DEFAULT_SETTINGS)) {
  if (urlSearchParams.has(param)) {
    try {
      const value = JSON.parse(urlSearchParams.get(param) ?? 'true');
      DEFAULT_SETTINGS[param as keyof Settings] = Boolean(value);
    } catch (error) {
      console.warn(`Unable to parse query parameter "${param}"`);
    }
  }
}

if (DEFAULT_SETTINGS.disableBeforeInput) {
  delete window.InputEvent.prototype.getTargetRanges;
}
