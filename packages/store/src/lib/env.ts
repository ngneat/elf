export let __DEV__ = true;

export function enableElfProdMode() {
  __DEV__ = false;
}

// @internal
export function isDev() {
  return __DEV__;
}
