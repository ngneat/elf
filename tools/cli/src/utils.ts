import { Options } from './types';

export function camelize(str: string) {
  return str
    .replace(/^\w|[A-Z]|\b\w/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function dash(val: string) {
  return camelize(val).replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
}

export function has(options: Options, feature: Options['features'][0]) {
  return options.features.includes(feature);
}
