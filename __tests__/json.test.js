import { describe, test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { genDiff, getFileData } from '../src/gendiff.js';
import parsers from '../src/parsers.js';

describe('test gendiff', () => {
  const need = {
    '- follow': false,
    '  host': 'hexlet.io',
    '- proxy': '123.234.53.22',
    '- timeout': 50,
    '+ timeout': 20,
    '+ verbose': true,
  };

  const getFilePath = (filename) => path.resolve(process.cwd(), '__fixtures__', filename);
  test('json', () => {
    const file1 = getFilePath('file1.json');
    const file2 = getFilePath('file2.json');
    const result = genDiff(file1, file2);
    expect(result).toEqual(need);
    expect(result).not.toEqual({});
  });
  test('yaml', () => {
    const file1 = getFilePath('file1.yaml');
    const file2 = getFilePath('file2.yml');
    const result = genDiff(file1, file2);
    expect(result).toEqual(need);
    expect(result).not.toEqual({});
  });
  test('tmp', () => {
    const file1 = getFilePath('file1.yaml');
    const file2 = getFilePath('file2.tmp');
    const result = genDiff(file1, file2);
    expect(result).not.toEqual(need);
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
    expect(parsers(content, 'json')).toEqual(JSON.parse(content));
  });
  test('fake', () => {
    expect(() => {
      getFileData(getFilePath('./fake.tmp'));
    }).toThrow();
  });
});
