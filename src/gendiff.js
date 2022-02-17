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

const analyze = (obj1 = {}, obj2 = {}) => {
  const lines = [];
  const keys = _.uniq([].concat(Object.keys(obj1), Object.keys(obj2))).sort();
  keys.forEach((key) => {
    const data1 = _.get(obj1, key);
    const data2 = _.get(obj2, key);
    if (_.isUndefined(data2)) {
      const prefix = '-';
      let value = data1.toString();
      if (_.isObject(data1)) {
        value = analyze(data1, data1);
      }
      lines.push({ prefix, key, value });
    } else if (_.isUndefined(data1)) {
      const prefix = '+';
      let value = data2;
      if (_.isObject(data2)) {
        value = analyze(data2, data2);
      }
      lines.push({ prefix, key, value });
    } else {
      const prefix = ' ';
      if (_.isObject(data1) && _.isObject(data2)) {
        lines.push({
          prefix,
          key,
          value: analyze(data1, data2),
        });
      } else if (data1 === data2) {
        lines.push({
          prefix: ' ',
          key,
          value: data1,
        });
      } else {
        lines.push({
          prefix: '-',
          key,
          value: _.isObject(data1) ? analyze(data1, data1) : data1,
        });
        lines.push({
          prefix: '+',
          key,
          value: _.isObject(data2) ? analyze(data2, data2) : data2,
        });
      }
    }
  });
  return lines;
};

const genDiff = (filepath1, filepath2) => {
  const data1 = getFileData(filepath1);
  const data2 = getFileData(filepath2);
  return analyze(data1, data2);
};

export { genDiff, getFileData, analyze };
