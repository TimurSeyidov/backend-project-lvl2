import _ from 'lodash';

const formatStylish = (_data) => {
  const text = ['{'];
  const recurse = (data, level = 0) => {
    data.forEach((item) => {
      const before = ' '.repeat(level * 4 + 2);
      let line = before;
      const { prefix = '', key, value } = item;
      line += `${prefix} ${key}:`;
      if (!_.isArray(value)) {
        line += ` ${value}`;
        text.push(line);
      } else if (value.length) {
        line = [line, '{'].join(' ');
        text.push(line);
        recurse(value, level + 1);
        text.push([before, '}'].join('  '));
      }
    });
  };
  recurse(_data);
  text.push('}');
  return text;
};

const formatter = (data, type = 'stylish') => {
  let text = [];
  switch (type) {
    case 'stylish':
      text = formatStylish(data);
      break;
    default:
      text = [];
      break;
  }
  return text.join('\n');
};

export default formatter;
