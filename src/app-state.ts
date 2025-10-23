import { getNatoPayloadDetails, type NatoPayloadDetails } from './nato';

export type AppState = {
  input: string;
  output: NatoPayloadDetails | null;
};

/** Query param to read/write. */
export const paramInput = 'input';

/** Get the value of {@link paramInput}. */
export function getCurrentParamValue() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(paramInput);
  return value;
}

declare global {
  interface History {
    pushState(data: AppState, unused: string, url?: string | URL | null): void;
    replaceState(data: AppState, unused: string, url?: string | URL | null): void;
  }
}

export function pushAppState(state: AppState) {
  const url = new URL(location.href);
  url.searchParams.set(paramInput, state.input);
  history.pushState(state, '', url);
}

export function replaceAppState(state: AppState) {
  const url = new URL(location.href);
  url.searchParams.set(paramInput, state.input);
  history.replaceState(state, '', url);
}

export function getAppState(): AppState | null {
  return history.state as AppState | null;
}

export function initAppStateFromHistoryState() {
  return getAppState();
}

export function initAppStateFromQueryParam() {
  const input = getCurrentParamValue();
  if (!input) return null;
  return { input, output: getNatoPayloadDetails(input) };
}

export function initAppState(): AppState | null {
  const fromAppState = initAppStateFromHistoryState();
  if (fromAppState) return fromAppState;

  const fromQueryParams = initAppStateFromQueryParam();
  if (fromQueryParams) {
    replaceAppState(fromQueryParams);
    return fromQueryParams;
  }

  return null;
}
