import type { DevtoolMessage } from '@devtool/frontend/types';

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
