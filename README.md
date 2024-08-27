# sse-stringify
Marshalling Javascript data into Server-Sent Events (sse) text/event-stream format

## Installing

```
npm install sse-stringify
```

## Basic usage

```ts
import { sseStringify } from 'sse-stringify';

sseStringify({
  id: '0',
  data: JSON.stringify({}),
  event: 'my-event',
});
// 'id: 0\nevent: my-event\ndata: {}\n\n'

sseStringify({ retry: 1000 });
// 'retry: 1000\n\n'

sseStringify({ comment: 'OK' });
// ': OK\n\n'
```

### Data can be a multiline string

It can be useful to send some lines of csv or ndjson within the same event/message.

```ts
const prettyJSON = JSON.stringify({ a: 1, o: { nested: [] } }, null, 2);
sseStringify({ data: prettyJSON });
/*
'data: {\n' +
'data:   "a": 1,\n' +
'data:   "o": {\n' +
'data:     "nested": []\n' +
'data:   }\n' +
'data: }\n' +
'\n'
*/
```

### Using with iterables and streams

We can pass `false` as the second parameter to disable the newline at the end and thus
call the function several times but send only 1 event with the result.

This allows better mapping between the JS data structure and the text/event-stream format or
use this function with iterables and streams.

```ts
let event = '';

const arr = [
  { event: 'my-event' },
  { data: 'csv or ndjson line' },
  { data: 'csv or ndjson line' },
  { id: '0' },
];

arr.forEach((value, index, array) => {
  if (index === array.length - 1) {
    // last item should have a newline at the end
    event += sseStringify(value);
  } else {
    event += sseStringify(value, false);
  }
});

/* or

arr.forEach((value, index, array) => {
  event += sseStringify(value, false);
});

event += '\n';
*/

console.log(event);
// 'event: my-event\ndata: csv or ndjson line\ndata: csv or ndjson line\nid: 0\n\n'
```

### License

[MIT licensed](./LICENSE).
