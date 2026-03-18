#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');

program
  .name('site-cli')
  .description('Pull, build and deploy course websites')
  .version('1.0.0');

program
  .command('pull <slug>')
  .description('Pull a website by slug from the backend')
  .option('-o, --output <dir>', 'Output directory', '.')
  .option('--api <url>', 'Backend API URL', 'http://localhost:5000/api')
  .action(async (slug, options) => {
    const { pull } = require('../commands/pull');
    await pull(slug, options);
  });

program
  .command('build')
  .description('Build static HTML from pulled site folder')
  .option('-d, --dir <dir>', 'Site directory to build', '.')
  .action(async (options) => {
    const { build } = require('../commands/build');
    await build(options);
  });

program
  .command('deploy')
  .description('Deploy instructions for your built site')
  .option('-d, --dir <dir>', 'Site directory', '.')
  .action(async (options) => {
    const { deploy } = require('../commands/deploy');
    await deploy(options);
  });

program.parse(process.argv);