import { describe, test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { genDiff, getFileData, analyze } from '../src/gendiff.js';
import parsers from '../src/parsers.js';
import formatter from '../src/formatter.js';

describe('test gendiff', () => {
  const need = [
    {
      prefix: ' ',
      key: 'common',
      value: [
        {
          prefix: '+',
          key: 'follow',
          value: false,
        },
        {
          prefix: ' ',
          key: 'setting1',
          value: 'Value 1',
        },
        {
          prefix: '-',
          key: 'setting2',
          value: '200',
        },
        {
          prefix: '-',
          key: 'setting3',
          value: true,
        },
        {
          prefix: '+',
          key: 'setting3',
          value: null,
        },
        {
          prefix: '+',
          key: 'setting4',
          value: 'blah blah',
        },
        {
          prefix: '+',
          key: 'setting5',
          value: [
            {
              prefix: ' ',
              key: 'key5',
              value: 'value5',
            },
          ],
        },
        {
          prefix: ' ',
          key: 'setting6',
          value: [
            {
              prefix: ' ',
              key: 'doge',
              value: [
                {
                  prefix: '-',
                  key: 'wow',
                  value: '',
                },
                {
                  prefix: '+',
                  key: 'wow',
                  value: 'so much',
                },
              ],
            },
            {
              prefix: ' ',
              key: 'key',
              value: 'value',
            },
            {
              prefix: '+',
              key: 'ops',
              value: 'vops',
            },
          ],
        },
      ],
    },
    {
      prefix: ' ',
      key: 'group1',
      value: [
        {
          prefix: '-',
          key: 'baz',
          value: 'bas',
        },
        {
          prefix: '+',
          key: 'baz',
          value: 'bars',
        },
        {
          prefix: ' ',
          key: 'foo',
          value: 'bar',
        },
        {
          prefix: '-',
          key: 'nest',
          value: [
            {
              prefix: ' ',
              key: 'key',
              value: 'value',
            },
          ],
        },
        {
          prefix: '+',
          key: 'nest',
          value: 'str',
        },
      ],
    },
    {
      prefix: '-',
      key: 'group2',
      value: [
        {
          prefix: ' ',
          key: 'abc',
          value: 12345,
        },
        {
          prefix: ' ',
          key: 'deep',
          value: [
            {
              prefix: ' ',
              key: 'id',
              value: 45,
            },
          ],
        },
      ],
    },
    {
      prefix: '+',
      key: 'group3',
      value: [
        {
          prefix: ' ',
          key: 'deep',
          value: [
            {
              prefix: ' ',
              key: 'id',
              value: [
                {
                  prefix: ' ',
                  key: 'number',
                  value: 45,
                },
              ],
            },
          ],
        },
        {
          prefix: ' ',
          key: 'fee',
          value: 100500,
        },
      ],
    },
  ];
  const tmp_result = [
    {
      prefix: '-',
      key: 'common',
      value: [
        {
          prefix: ' ',
          key: 'setting1',
          value: 'Value 1',
        },
        {
          prefix: ' ',
          key: 'setting2',
          value: 200,
        },
        {
          prefix: ' ',
          key: 'setting3',
          value: true,
        },
        {
          prefix: ' ',
          key: 'setting6',
          value: [
            {
              prefix: ' ',
              key: 'doge',
              value: [
                {
                  prefix: ' ',
                  key: 'wow',
                  value: '',
                },
              ],
            },
            {
              prefix: ' ',
              key: 'key',
              value: 'value',
            },
          ],
        },
      ],
    },
    {
      prefix: '-',
      key: 'group1',
      value: [
        {
          prefix: ' ',
          key: 'baz',
          value: 'bas',
        },
        {
          prefix: ' ',
          key: 'foo',
          value: 'bar',
        },
        {
          prefix: ' ',
          key: 'nest',
          value: [
            {
              prefix: ' ',
              key: 'key',
              value: 'value',
            },
          ],
        },
      ],
    },
    {
      prefix: '-',
      key: 'group2',
      value: [
        {
          prefix: ' ',
          key: 'abc',
          value: 12345,
        },
        {
          prefix: ' ',
          key: 'deep',
          value: [
            {
              prefix: ' ',
              key: 'id',
              value: 45,
            },
          ],
        },
      ],
    },
  ];

  const getFilePath = (filename) => path.resolve(process.cwd(), '__fixtures__', filename);
  test('json', () => {
    expect(genDiff(getFilePath('file1.json'), getFilePath('file2.json')))
      .toEqual(need);
  });
  test('yaml', () => {
    expect(genDiff(getFilePath('file1.yaml'), getFilePath('file2.yml')))
      .toEqual(need);
  });
  test('tmp', () => {
    const file1 = getFilePath('file1.json');
    const file2 = getFilePath('file2.tmp');
    expect(genDiff(file1, file2)).toEqual(tmp_result);
  });
  test('empty ext', () => {
    const file1 = getFilePath('file');
    const file2 = getFilePath('file2.tmp');
    const result = genDiff(file1, file2);
    expect(result).not.toEqual(need);
  });
  test('parser', () => {
    const file = getFilePath('file1.json');
    const content = fs.readFileSync(file, {
      encoding: 'utf8',
      flag: 'r',
    });
    expect(parsers(content)).toEqual(parsers(need));
  });
  test('analyze', () => {
    const exp1 = { test1: 1 };
    const exp2 = { test1: { test2: 2 } };
    const result = [
      {
        key: 'test1',
        value: 1,
        prefix: '-',
      },
      {
        key: 'test1',
        prefix: '+',
        value: [
          {
            key: 'test2',
            value: 2,
            prefix: ' ',
          },
        ],
      },
    ];
    expect(analyze(exp1, exp2)).toEqual(result);
  });
  test('fake', () => {
    expect(() => {
      getFileData(getFilePath('./fake.tmp'));
    }).toThrow();
  });
  test('formatter', () => {
    const data = [
      {
        key: 'test',
        prefix: ' ',
        value: 1,
      },
      {
        key: 'test2',
        prefix: ' ',
        value: [
          {
            key: 'test3',
            value: 1,
            prefix: '+',
          },
        ],
      },
    ];
    const json = ['{', '    test: 1', '    test2: {', '      + test3: 1', '    }', '}'].join('\n');
    expect(formatter(data)).toBe(json);
    expect(formatter(data, 'plain')).toBe('');
  });
});
