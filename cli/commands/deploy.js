const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function deploy(options) {
  const siteDir = path.resolve(options.dir || '.');
  const distDir = path.join(siteDir, 'dist');
  const indexFile = path.join(distDir, 'index.html');

  console.log(chalk.cyan('\n🚀 Deploy Instructions\n'));

  if (!await fs.pathExists(indexFile)) {
    console.error(chalk.red('✗ dist/index.html not found. Run "site-cli build" first.'));
    process.exit(1);
  }

  const site = await fs.pathExists(path.join(siteDir, 'site.json'))
    ? await fs.readJson(path.join(siteDir, 'site.json'))
    : {};

  console.log(chalk.white(`Site: ${chalk.bold(site.name || siteDir)}`));
  console.log(chalk.white(`Slug: ${chalk.bold(site.slug || 'unknown')}\n`));

  console.log(chalk.yellow('── Option 1: Netlify (Recommended) ──────────────────'));
  console.log(chalk.gray('  1. Go to https://netlify.com'));
  console.log(chalk.gray('  2. Drag & drop the') + chalk.white(` dist/ `) + chalk.gray('folder onto the Netlify dashboard'));
  console.log(chalk.gray('  3. Your site is live instantly!\n'));

  console.log(chalk.yellow('── Option 2: Netlify CLI ─────────────────────────────'));
  console.log(chalk.white(`  npm install -g netlify-cli`));
  console.log(chalk.white(`  netlify deploy --dir ${distDir} --prod\n`));

  console.log(chalk.yellow('── Option 3: Vercel ──────────────────────────────────'));
  console.log(chalk.white(`  npm install -g vercel`));
  console.log(chalk.white(`  cd ${distDir} && vercel\n`));

  console.log(chalk.yellow('── Option 4: GitHub Pages ────────────────────────────'));
  console.log(chalk.white(`  npm install -g gh-pages`));
  console.log(chalk.white(`  gh-pages -d ${distDir}\n`));

  console.log(chalk.yellow('── Option 5: Preview locally ─────────────────────────'));
  console.log(chalk.white(`  open ${indexFile}\n`));

  console.log(chalk.green('✅ Your static site is ready to deploy!\n'));
}

module.exports = { deploy };