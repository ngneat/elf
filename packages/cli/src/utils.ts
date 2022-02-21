import { Options } from './types';

export function has(options: Options, feature: Options['features'][0]) {
  return options.features.includes(feature);
}

export function coerceArray<T>(value: T[] | T): T[] {
  return Array.isArray(value) ? value : [value];
}

export function resolveStoreVariableName(
  template: Options['template'],
  { propertyName }: ReturnType<typeof names>,
  inlineStoreInClass: boolean = false
) {
  return template === 'functions'
    ? `${propertyName}Store`
    : `${inlineStoreInClass ? 'this.' : ''}store`;
}

/**
 * Util function to generate different strings based off the provided name.
 *
 * Examples:
 *
 * ```typescript
 * names("my-name") // {name: 'my-name', className: 'MyName', propertyName: 'myName', constantName: 'MY_NAME', fileName: 'my-name'}
 * ```
 * @param name
 */
export function names(name: string): {
  name: string;
  className: string;
  propertyName: string;
  constantName: string;
  fileName: string;
} {
  return {
    name,
    className: toClassName(name),
    propertyName: toPropertyName(name),
    constantName: toConstantName(name),
    fileName: toFileName(name),
  };
}

/**
 * Hyphenated to UpperCamelCase
 */
function toClassName(str: string): string {
  return toCapitalCase(toPropertyName(str));
}

/**
 * Hyphenated to lowerCamelCase
 */
function toPropertyName(s: string): string {
  return s
    .replace(/(-|_|\.|\s)+(.)?/g, (_, __, chr) =>
      chr ? chr.toUpperCase() : ''
    )
    .replace(/[^a-zA-Z\d]/g, '')
    .replace(/^([A-Z])/, (m) => m.toLowerCase());
}

/**
 * Hyphenated to CONSTANT_CASE
 */
function toConstantName(s: string): string {
  return s.replace(/(-|_|\.|\s)/g, '_').toUpperCase();
}

/**
 * Upper camelCase to lowercase, hyphenated
 */
function toFileName(s: string): string {
  return s
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[ _]/g, '-');
}

/**
 * Capitalizes the first letter of a string
 */
function toCapitalCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.substr(1);
}
