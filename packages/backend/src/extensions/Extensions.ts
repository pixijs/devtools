import type { ExtensionType } from '@pixi/devtools';

/**
 * The metadata for an extension.
 * @memberof extensions
 * @ignore
 */
interface ExtensionMetadataDetails {
  /** The extension type, can be multiple types */
  type: ExtensionType | ExtensionType[];
  /** Optional. Some plugins provide an API name/property, to make them more easily accessible */
  name?: string;
  /** Optional, used for sorting the plugins in a particular order */
  priority?: number;
}

/**
 * The metadata for an extension.
 * @memberof extensions
 */
type ExtensionMetadata = ExtensionType | ExtensionMetadataDetails;

/**
 * Format when registering an extension. Generally, the extension
 * should have these values as `extension` static property,
 * but you can override name or type by providing an object.
 * @memberof extensions
 */
interface ExtensionFormat {
  /** The extension type, can be multiple types */
  type: ExtensionType | ExtensionType[];
  /** Optional. Some plugins provide an API name/property, such as Renderer plugins */
  name: string;
  /** Optional, used for sorting the plugins in a particular order */
  priority?: number;
  /** Reference to the plugin object/class */
  ref: any;
}

/**
 * Extension format that is used internally for registrations.
 * @memberof extensions
 * @ignore
 */
interface StrictExtensionFormat extends ExtensionFormat {
  /** The extension type, always expressed as multiple, even if a single */
  type: ExtensionType[];
}

type ExtensionHandler = (extension: StrictExtensionFormat) => void;

/**
 * Convert input into extension format data.
 * @ignore
 */
const normalizeExtension = (ext: ExtensionFormat | any): StrictExtensionFormat => {
  // Class/Object submission, use extension object
  if (typeof ext === 'function' || (typeof ext === 'object' && ext.extension)) {
    // #if _DEBUG
    if (!ext.extension) {
      throw new Error('Extension class must have an extension object');
    }
    // #endif
    const metadata: ExtensionMetadataDetails =
      typeof ext.extension !== 'object' ? { type: ext.extension } : ext.extension;

    ext = { ...metadata, ref: ext };
  }
  if (typeof ext === 'object') {
    ext = { ...ext };
  } else {
    throw new Error('Invalid extension type');
  }

  if (typeof ext.type === 'string') {
    ext.type = [ext.type];
  }

  return ext;
};

/**
 * Get the priority for an extension.
 * @ignore
 * @param ext - Any extension
 * @param defaultPriority - Fallback priority if none is defined.
 * @returns The priority for the extension.
 */
export const normalizeExtensionPriority = (ext: ExtensionFormat | any, defaultPriority: number): number =>
  normalizeExtension(ext).priority ?? defaultPriority;

/**
 * Global registration of all PixiJS extensions. One-stop-shop for extensibility.
 *
 * Import the `extensions` object and use it to register new functionality via the described methods below.
 * ```js
 * // register a new extension
 * extensions.add(myExtension);
 * ```
 * @property {Function} remove - Remove extensions from PixiJS.
 * @property {Function} add - Register new extensions with PixiJS.
 * @property {Function} handle - Internal method to handle extensions by name.
 * @property {Function} handleByMap - Handle a type, but using a map by `name` property.
 * @property {Function} handleByNamedList - Handle a type, but using a list of extensions with a `name` property.
 * @property {Function} handleByList - Handle a type, but using a list of extensions.
 * @memberof extensions
 */
const extensions = {
  /** @ignore */
  _addHandlers: {} as Partial<Record<ExtensionType, ExtensionHandler>>,

  /** @ignore */
  _removeHandlers: {} as Partial<Record<ExtensionType, ExtensionHandler>>,

  /** @ignore */
  _queue: {} as Partial<Record<ExtensionType, StrictExtensionFormat[]>>,

  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed.
   * @returns {extensions} For chaining.
   */
  remove(...extensions: Array<ExtensionFormat | any>) {
    extensions.map(normalizeExtension).forEach((ext) => {
      ext.type.forEach((type) => this._removeHandlers[type]?.(ext));
    });

    return this;
  },

  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {extensions} For chaining.
   */
  add(...extensions: Array<ExtensionFormat | any>) {
    // Handle any extensions either passed as class w/ data or as data
    extensions.map(normalizeExtension).forEach((ext) => {
      ext.type.forEach((type) => {
        const handlers = this._addHandlers;
        const queue = this._queue;

        if (!handlers[type]) {
          queue[type] = queue[type] || [];
          queue[type]?.push(ext);
        } else {
          handlers[type]?.(ext);
        }
      });
    });

    return this;
  },

  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
   * @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
   * @returns {extensions} For chaining.
   */
  handle(type: ExtensionType, onAdd: ExtensionHandler, onRemove: ExtensionHandler) {
    const addHandlers = this._addHandlers;
    const removeHandlers = this._removeHandlers;

    // #if _DEBUG
    if (addHandlers[type] || removeHandlers[type]) {
      throw new Error(`Extension type ${type} already has a handler`);
    }
    // #endif

    addHandlers[type] = onAdd;
    removeHandlers[type] = onRemove;

    // Process the queue
    const queue = this._queue;

    // Process any plugins that have been registered before the handler
    if (queue[type]) {
      queue[type]?.forEach((ext) => onAdd(ext));
      delete queue[type];
    }

    return this;
  },

  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {extensions} For chaining.
   */
  handleByMap(type: ExtensionType, map: Record<string, any>) {
    return this.handle(
      type,
      (extension) => {
        if (extension.name) {
          map[extension.name] = extension.ref;
        }
      },
      (extension) => {
        if (extension.name) {
          delete map[extension.name];
        }
      },
    );
  },

  /**
   * Handle a type, but using a list of extensions with a `name` property.
   * @param type - Type of extension to handle.
   * @param map - The array of named extensions.
   * @param defaultPriority - Fallback priority if none is defined.
   * @returns {extensions} For chaining.
   */
  handleByNamedList(type: ExtensionType, map: { name: string; value: any }[], defaultPriority = 0) {
    return this.handle(
      type,
      (extension) => {
        const index = map.findIndex((item) => item.name === extension.name);

        if (index >= 0) return;

        map.push({ name: extension.name, value: extension.ref });
        map.sort(
          (a, b) =>
            normalizeExtensionPriority(b.value, defaultPriority) - normalizeExtensionPriority(a.value, defaultPriority),
        );
      },
      (extension) => {
        const index = map.findIndex((item) => item.name === extension.name);

        if (index !== -1) {
          map.splice(index, 1);
        }
      },
    );
  },

  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns {extensions} For chaining.
   */
  handleByList(type: ExtensionType, list: any[], defaultPriority = 0) {
    return this.handle(
      type,
      (extension) => {
        if (list.includes(extension.ref)) {
          return;
        }

        list.push(extension.ref);
        list.sort(
          (a, b) => normalizeExtensionPriority(b, defaultPriority) - normalizeExtensionPriority(a, defaultPriority),
        );
      },
      (extension) => {
        const index = list.indexOf(extension.ref);

        if (index !== -1) {
          list.splice(index, 1);
        }
      },
    );
  },
};

export { extensions, ExtensionType };
export type {
  StrictExtensionFormat as ExtensionFormat,
  ExtensionFormat as ExtensionFormatLoose,
  ExtensionHandler,
  ExtensionMetadata,
};
