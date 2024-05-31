function throwIfNoExtension<T>(ext: T | undefined, shouldThrow = true): Required<T> {
  if (!ext && shouldThrow) throw new Error(`[PixiDevtools] Extension not found.`);
  return ext as Required<T>;
}

/**
 * Returns an array of extensions where the callback function returns true.
 * @param list - The list of extensions.
 * @param cb - The callback function to execute on each extension.
 * @returns An array of extensions where the callback function returns true.
 */
export function getExtensions<T>(list: T[], cb: (ext: T) => boolean): Required<T>[] {
  return list.filter(cb) as Required<T>[];
}

/**
 * Returns an array of extensions where the specified property is not undefined.
 * @param list - The list of extensions.
 * @param key - The property to check.
 * @returns An array of extensions where the specified property is not undefined.
 */
export function getExtensionsProp<T>(list: T[], key: keyof T): Required<T>[] {
  return list.filter((ext) => ext[key] !== undefined) as Required<T>[];
}

/**
 * Returns an array of extensions where all the specified properties are not undefined.
 * @param list - The list of extensions.
 * @param keys - The properties to check.
 * @returns An array of extensions where all the specified properties are not undefined.
 */
export function getExtensionsProps<T>(list: T[], keys: (keyof T)[]): Required<T>[] {
  return list.filter((ext) => keys.every((key) => ext[key] !== undefined)) as Required<T>[];
}

/**
 * Returns the first extension where the callback function returns true.
 * @param list - The list of extensions.
 * @param cb - The callback function to execute on each extension.
 * @returns The first extension where the callback function returns true.
 */
export function getExtension<T>(list: T[], cb: (ext: T) => boolean, shouldThrow = true): Required<T> {
  return throwIfNoExtension(list.find(cb), shouldThrow);
}

/**
 * Returns the first extension where the specified property is not undefined.
 * @param list - The list of extensions.
 * @param key - The property to check.
 * @returns The first extension where the specified property is not undefined.
 */
export function getExtensionProp<T>(list: T[], key: keyof T, shouldThrow = true): Required<T> {
  return throwIfNoExtension(
    list.find((ext) => ext[key] !== undefined),
    shouldThrow,
  );
}

/**
 * Returns the first extension where all the specified properties are not undefined.
 * @param list - The list of extensions.
 * @param keys - The properties to check.
 * @returns The first extension where all the specified properties are not undefined.
 */
export function getExtensionProps<T>(list: T[], keys: (keyof T)[], shouldThrow = true): Required<T> {
  return throwIfNoExtension(
    list.find((ext) => keys.every((key) => ext[key] !== undefined)),
    shouldThrow,
  );
}
