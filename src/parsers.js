import yaml from 'js-yaml';
import _ from 'lodash';

const parsers = (content, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(content);
    case 'yml':
    case 'yaml':
      return _.flattenDeep(yaml.load(content)).reduce((prev, curr) => {
        _.forIn(curr, (value, key) => (
          _.set(prev, key, value)
        ));
        return prev;
      }, {});
    default:
      return {};
  }
};

export default parsers;
