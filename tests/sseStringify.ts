import test from 'tape';
import { sseStringify, EventStream } from '../src';

test('it should throw when receive a wrong type argument', (t) => {
  //@ts-expect-error
  t.throws(() => sseStringify());
  //@ts-expect-error
  t.throws(() => sseStringify(null));
  //@ts-expect-error
  t.throws(() => sseStringify(1));
  //@ts-expect-error
  t.throws(() => sseStringify(''));
  //@ts-expect-error
  t.throws(() => sseStringify([]));
  //@ts-expect-error
  t.throws(() => sseStringify(new Map()));
  //@ts-expect-error
  t.throws(() => sseStringify(new Date()));
  //@ts-expect-error
  t.throws(() => sseStringify(new Set()));
  t.end();
});

test('it should return an empty new line when empty object is passed', (t) => {
  t.equal(sseStringify({}), '\n');
  t.end();
});

test('it should validate input properties types', (t) => {
  //@ts-expect-error
  t.throws(() => sseStringify({ id: 0 }));
  //@ts-expect-error
  t.throws(() => sseStringify({ data: 0 }));
  //@ts-expect-error
  t.throws(() => sseStringify({ event: 0 }));
  //@ts-expect-error
  t.throws(() => sseStringify({ retry: '1000' }));
  //@ts-expect-error
  t.throws(() => sseStringify({ comment: 0 }));
  t.end();
});

test('it should not accept strings with breaklines for id, event and comment fields', (t) => {
  t.throws(() => sseStringify({ id: '\naa' }));
  t.throws(() => sseStringify({ id: 'aa\n' }));
  t.throws(() => sseStringify({ event: 'aa\r\naa' }));
  t.throws(() => sseStringify({ comment: 'aa \n aa' }));
  t.end();
});

test('it should return the expected result', (t) => {
  const input: EventStream = {
    id: '0',
    data: '{}',
    event: 'e',
    retry: 1000,
    comment: 'test',
  };
  t.equal(
    sseStringify(input),
    'id: 0\nevent: e\ndata: {}\nretry: 1000\n: test\n\n',
  );
  t.end();
});

test('it should not return a newline at the end when newline parameter is false', (t) => {
  t.equal(sseStringify({}, false), '');

  const input: EventStream = {
    id: '0',
    data: '{}',
    event: 'e',
    retry: 1000,
    comment: 'test',
  };
  t.equal(
    sseStringify(input, false),
    'id: 0\nevent: e\ndata: {}\nretry: 1000\n: test\n',
  );
  t.end();
});
