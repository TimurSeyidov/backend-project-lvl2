import _ from 'lodash';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const genDiff = (filepath1, filepath2) => {
  const output = {};
  const getFileData = (file) => {
    const filename = path.normalize(file);
    const ext = path.extname(filename);
    try {
      const content = fs.readFileSync(filename, {
        encoding: 'utf8',
        flag: 'r',
      });
      switch (ext) {
        case '.json':
          return JSON.parse(content);
        case '.yml':
          return _.flattenDeep(yaml.load(content)).reduce((prev, curr) => {
            _.forIn(curr, (value, key) => (
              _.set(prev, key, value)
            ));
            return prev;
          }, {});
        default:
          return {};
      }
    } catch (e) {
      return {};
    }
  };
  try {
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
  } catch (e) {
    return {};
  }
};

export default genDiff;
