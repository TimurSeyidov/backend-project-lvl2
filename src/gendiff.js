import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parsers from './parsers.js';

const getFileData = (file) => {
  const filename = path.normalize(file);
  const ext = path.extname(filename);
  const content = fs.readFileSync(filename, {
    encoding: 'utf8',
    flag: 'r',
  });
  return parsers(content, ext.substring(1) || '');
};

const genDiff = (filepath1, filepath2) => {
  const output = {};
  const data1 = getFileData(filepath1);
  const data2 = getFileData(filepath2);
  const unfound = [];
  _(data1).keys().sort().each((key) => {
    unfound.push(key);
    if (_.isUndefined(data2[key])) {
      _.set(output, `- ${key}`, data1[key]);
    } else if (data1[key] === data2[key]) {
      _.set(output, `  ${key}`, data1[key]);
    } else {
      _.set(output, `- ${key}`, data1[key]);
      _.set(output, `+ ${key}`, data2[key]);
    }
  });
  _(data2).keys().filter((key) => !unfound.includes(key)).sort()
    .forEach((key) => _.set(output, `+ ${key}`, data2[key]));
  return output;
};

export { genDiff, getFileData };
