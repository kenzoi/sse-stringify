export interface EventStream {
  event?: string;
  data?: string;
  id?: string;
  retry?: number;
  comment?: string;
}

function isString(value: unknown) {
  if (typeof value !== 'string') {
    return false;
  }
  return true;
}

function isInt(value: unknown) {
  if (
    typeof value !== 'number' ||
    Number.isNaN(value) ||
    value !== parseInt(value.toString(10), 10)
  ) {
    return false;
  }
  return true;
}

// TODO: add option to remove whitespace for performance needed scenarios
export function sseStringify(value: EventStream): string {
  let buffer = '';

  if (value === null || typeof value !== 'object') {
    throw new TypeError('sseStringify argument must be an object');
  }

  if ('event' in value) {
    if (!isString(value.event))
      throw new TypeError(
        `event value must be an string but received ${typeof value}`,
      );
    buffer += `event: ${value.event}\n`;
  }
  if ('data' in value) {
    if (!isString(value.data))
      throw new TypeError(
        `data value must be an string but received ${typeof value}`,
      );
    buffer += `data: ${value.data}\n`;
  }
  if ('id' in value) {
    if (!isString(value.id))
      throw new TypeError(
        `id value must be an string but received ${typeof value}`,
      );
    buffer += `id: ${value.id}\n`;
  }
  if ('retry' in value) {
    if (!isInt(value.retry))
      throw new TypeError(`retry value must be an integer`);
    buffer += `retry: ${value.retry}\n`;
  }
  if ('comment' in value) {
    if (!isString(value.comment))
      throw new TypeError(
        `comment value must be an string but received ${typeof value}`,
      );
    buffer += `: ${value.comment}\n`;
  }
  buffer += '\n';
  return buffer;
}
