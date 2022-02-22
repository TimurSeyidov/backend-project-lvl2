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
  let lines = [];
  const keys = _.uniq([].concat(Object.keys(obj1), Object.keys(obj2))).sort();
  keys.forEach((key) => {
    const data1 = _.get(obj1, key);
    const data2 = _.get(obj2, key);
    let ins = [];
    if (_.isUndefined(data2)) {
      ins = [{ key, prefix: '-', value: !_.isObject(data1) ? data1.toString() : analyze(data1, data1) }];
    } else if (_.isUndefined(data1)) {
      ins = [{ key, prefix: '+', value: !_.isObject(data2) ? data2.toString() : analyze(data2, data2) }];
    } else if (_.isObject(data1) && _.isObject(data2)) {
      ins = [{ key, prefix: ' ', value: analyze(data1, data2) }];
    } else if (data1 === data2) {
      ins = [{ key, prefix: ' ', value: data1 }];
    } else {
      ins = [
        { prefix: '-', key, value: _.isObject(data1) ? analyze(data1, data1) : data1 },
        { prefix: '+', key, value: _.isObject(data2) ? analyze(data2, data2) : data2 },
      ];
    }
    lines = [].concat(lines, ins);
  });
  return lines;
};

const genDiff = (filepath1, filepath2) => {
  const data1 = getFileData(filepath1);
  const data2 = getFileData(filepath2);
  return analyze(data1, data2);
};

export { genDiff, getFileData, analyze };
