import yaml from 'js-yaml';

const parsers = (content, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(content);
    case 'yml':
    case 'yaml':
      return yaml.load(content);
    default:
      return {};
  }
};

export default parsers;
