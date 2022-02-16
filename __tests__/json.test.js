import { describe, test, expect } from '@jest/globals';
import path from 'path';
import { genDiff, getFileData } from '../src/gendiff.js';

describe('test gendiff', () => {
  const file1 = path.resolve(process.cwd(), '__fixtures__', 'file1.json');
  const need = {
    '- follow': false,
    '  host': 'hexlet.io',
    '- proxy': '123.234.53.22',
    '- timeout': 50,
    '+ timeout': 20,
    '+ verbose': true,
  };

  const getFilePath = (filename) => path.resolve(process.cwd(), '__fixtures__', filename);
  const testF = (file) => {
    const result = genDiff(file1, file);
    expect(result).toEqual(need);
    expect(result).not.toEqual({});
  };
  test('json', () => {
    const file2 = getFilePath('file2.json');
    testF(file2);
  });
  test('yaml', () => {
    const file2 = getFilePath('file2.yml');
    testF(file2);
  });
  test('tmp', () => {
    const file2 = getFilePath('file2.tmp');
    const result = genDiff(file1, file2);
    expect(result).not.toEqual(need);
  });
  test('fake', () => {
    expect(() => {
      getFileData(getFilePath('./fake.tmp'));
    }).toThrow();
  });
});
