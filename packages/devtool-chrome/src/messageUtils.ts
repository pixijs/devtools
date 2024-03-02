import { DevtoolMessage } from '@devtool/frontend/types';

export enum MessageType {
  Inactive = 'inactive',
  Active = 'active',
  PopupOpened = 'popup-opened',
  PixiDetected = 'pixi-detected',

  InjectSettingsChanged = 'inject-settings-changed',

  StateUpdate = 'pixi-state-update',
}

/**
 * Standard message format
 * @param method - The message type
 * @param data - The message data
 * @returns
 */
export function convertPostMessage(method: DevtoolMessage, data: unknown) {
  return { method, data: JSON.stringify(data) };
}

/**
 * Convert the message data to a standard format
 * @param a - The original message
 */
export function convertPostMessageData(a: ReturnType<typeof convertPostMessage>) {
  let data: string | object = a.data;

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (error) {
      data = {};
    }
  }
  return {
    method: a.method,
    data,
  };
}
