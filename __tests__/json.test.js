import { describe, test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { genDiff, getFileData, analyze } from '../src/gendiff.js';
import parsers from '../src/parsers.js';
import formatter from '../src/formatter.js';

describe('test gendiff', () => {
  const getFilePath = (filename) => path.resolve(process.cwd(), '__fixtures__', filename);
  const need = [
    { key: 'cache', prefix: '+', value: [{ key: 'time', prefix: ' ', value: '1' }] },
    {
      key: 'fix',
      prefix: ' ',
      value: [
        { key: 'time', prefix: '-', value: '1' },
        { key: 'time', prefix: '+', value: '2' },
      ],
    },
    { key: 'result', prefix: '-', value: '1' },
    { key: 'result', prefix: '+', value: [{ key: 'tmp', prefix: ' ', value: '2' }] },
    { key: 'tresult', prefix: '-', value: [{ key: 'tmp', prefix: ' ', value: '2' }] },
    { key: 'tresult', prefix: '+', value: '1' },
    { key: 'value', prefix: '-', value: '2' },
    { key: 'value', prefix: '+', value: 'Hello' },
    { key: 'zend', prefix: '+', value: '1' },
  ];
  const needTmp1 = [
    { prefix: '-', key: 'fix', value: [{ prefix: ' ', key: 'time', value: '1' }] },
    { prefix: '-', key: 'result', value: '1' },
    { prefix: '-', key: 'tresult', value: [{ prefix: ' ', key: 'tmp', value: '2' }] },
    { prefix: '-', key: 'value', value: '2' },
  ];
  test('json', () => {
    expect(genDiff(getFilePath('tmp1.json'), getFilePath('tmp2.json'))).toEqual(need);
  });
  test('yaml', () => {
    expect(genDiff(getFilePath('tmp1.yml'), getFilePath('tmp2.yml'))).toEqual(need);
  });
  test('tmp', () => {
    expect(genDiff(getFilePath('tmp1.json'), getFilePath('file2.tmp'))).toEqual(needTmp1);
  });
  test('empty ext', () => {
    const file1 = getFilePath('tmp1.json');
    const file2 = getFilePath('file');
    const result = genDiff(file1, file2);
    expect(result).toEqual(needTmp1);
  });
  test('parser', () => {
    const file = getFilePath('tmp1.json');
    const content = fs.readFileSync(file, {
      encoding: 'utf8',
      flag: 'r',
    });
    expect(parsers(content, 'json')).toEqual(parsers(JSON.stringify({
      result: 1,
      tresult: {
        tmp: 2,
      },
      value: 2,
      fix: { time: 1 },
    }), 'json'));
  });
  test('analyze', () => {
    const exp1 = { test1: '1' };
    const exp2 = { test1: { test2: '2' } };
    const result = [
      {
        key: 'test1',
        value: '1',
        prefix: '-',
      },
      {
        key: 'test1',
        prefix: '+',
        value: [
          {
            key: 'test2',
            value: '2',
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
        value: '1',
      },
      {
        key: 'test2',
        prefix: ' ',
        value: [
          {
            key: 'test3',
            value: '1',
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
