export interface EventStream {
  event?: string;
  data?: string;
  id?: string;
  retry?: number;
  comment?: string;
}

function isString(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  return true;
}

function isInt(value: unknown): value is number {
  if (
    typeof value !== 'number' ||
    Number.isNaN(value) ||
    value !== parseInt(value.toString(10), 10)
  ) {
    return false;
  }
  return true;
}

function hasNewline(str: string) {
  if (str.indexOf('\n') > -1 || str.indexOf('\r') > -1) return true;
  return false;
}

export function sseStringify(
  value: EventStream,
  newline: boolean = true,
): string {
  let buffer = '';

  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    value instanceof Date ||
    value instanceof Set ||
    value instanceof Map
  ) {
    throw new TypeError('sseStringify argument must be an object');
  }

  if (Object.hasOwn(value, 'id')) {
    if (!isString(value.id))
      throw new TypeError(
        `id value must be an string but received ${typeof value}`,
      );
    if (hasNewline(value.id))
      throw new Error('id value cannot contain newline escape sequence');
    buffer += `id: ${value.id}\n`;
  }
  if (Object.hasOwn(value, 'event')) {
    if (!isString(value.event))
      throw new TypeError(
        `event value must be an string but received ${typeof value}`,
      );
    if (hasNewline(value.event))
      throw new Error('event value cannot contain newline escape sequence');
    buffer += `event: ${value.event}\n`;
  }
  if (Object.hasOwn(value, 'data')) {
    if (!isString(value.data))
      throw new TypeError(
        `data value must be an string but received ${typeof value}`,
      );
    buffer += `data: ${value.data}\n`;
  }
  if (Object.hasOwn(value, 'retry')) {
    if (!isInt(value.retry))
      throw new TypeError(`retry value must be an integer`);
    buffer += `retry: ${value.retry}\n`;
  }
  if (Object.hasOwn(value, 'comment')) {
    if (!isString(value.comment))
      throw new TypeError(
        `comment value must be an string but received ${typeof value}`,
      );
    if (hasNewline(value.comment))
      throw new Error('comment value cannot contain newline escape sequence');
    buffer += `: ${value.comment}\n`;
  }
  if (newline) {
    buffer += '\n';
  }
  return buffer;
}
