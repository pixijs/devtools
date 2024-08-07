/**
 * Collection of valid extension types.
 */
export type ExtensionType = 'overlay' | 'stats' | 'sceneTree' | 'sceneProperties';

export enum ExtensionPriority {
  Low = -1,
  Normal = 0,
  High = 1,
}

/**
 * The metadata for an extension.
 * @ignore
 */
export interface ExtensionMetadataDetails {
  /** The extension type, can be multiple types */
  type: ExtensionType | ExtensionType[];
  /** Optional. Some extensions provide an API name/property, to make them more easily accessible */
  name?: string;
  /** Optional, used for sorting the extensions in a particular order */
  priority?: number;
}

/**
 * The metadata for an extension.
 */
export type ExtensionMetadata = ExtensionType | ExtensionMetadataDetails;
