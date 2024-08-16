export interface EventStream {
  event?: string;
  data?: string;
  id?: string;
  retry?: number;
  comment?: string;
}

function isString(key: string, value: unknown) {
  if (typeof value !== 'string') {
    throw new TypeError(
      `${key} value must be an string but received ${typeof value}`,
    );
  }
}

function isInt(key: string, value: unknown) {
  if (
    typeof value !== 'number' ||
    Number.isNaN(value) ||
    value === parseInt(value.toString(10), 10)
  ) {
    throw new TypeError(`${key} value must be an integer`);
  }
}

export function sseStringify(value: EventStream): string {
  let buffer = '';

  if (value === null || typeof value !== 'object') {
    throw new TypeError('marshal argument must be an object');
  }

  if ('event' in value) {
    isString('event', value.event);
    buffer += `event: ${value.event}\n`;
  }
  if ('data' in value) {
    isString('data', value.data);
    buffer += `data: ${value.data}\n`;
  }
  if ('id' in value) {
    isString('id', value.id);
    buffer += `id: ${value.id}\n`;
  }
  if ('retry' in value) {
    isInt('retry', value.retry);
    buffer += `retry: ${value.retry}\n`;
  }
  if ('comment' in value) {
    isString('comment', value.comment);
    buffer += `: ${value.comment}\n`;
  }
  buffer += '\n';
  return buffer;
}
