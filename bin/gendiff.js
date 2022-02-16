#!/usr/bin/env node
import { Command } from 'commander';
import _ from 'lodash';
import genDiff from '../index.js';

const program = new Command();
program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filename1, filename2) => {
    const data = genDiff(filename1, filename2);
    const { format } = program.opts();
    switch (format) {
      case 'yaml':
      case 'yml':
        _.forIn(data, (value, key) => (
          console.log(`${key}: ${value}`)
        ));
        break;
      default:
        console.log('{');
        _.forIn(data, (value, key) => (
          console.log(`  ${key}: ${value}`)
        ));
        console.log('}');
    }
  })
  .option('-f, --format <type>', 'output format (support json | yaml)');
program.parse(process.argv);
