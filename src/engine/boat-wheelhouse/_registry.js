// Live-getter registry for the rare reference from an earlier part to a binding declared in a later part.
export const __R = {};
export const __defR = (k, get) => Object.defineProperty(__R, k, { get, enumerable: true, configurable: true });
