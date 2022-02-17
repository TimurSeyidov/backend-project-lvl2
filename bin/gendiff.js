#!/usr/bin/env node
import { Command } from 'commander';
import genDiff from '../index.js';
import formatter from '../src/formatter.js';

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
    console.log(formatter(data, format));
  })
  .option('-f, --format <type>', 'output format (support stylish)', 'stylish');
program.parse(process.argv);
