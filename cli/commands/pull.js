const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function pull(slug, options) {
  const apiUrl = options.api || 'http://localhost:5000/api';
  const outputDir = path.resolve(options.output || '.', slug);

  console.log(chalk.cyan(`\n⬇  Pulling "${slug}" from ${apiUrl}...\n`));

  try {
    // Fetch website by slug
    const { data: website } = await axios.get(`${apiUrl}/websites/slug/${slug}`);

    // Create folder structure
    await fs.ensureDir(outputDir);
    await fs.ensureDir(path.join(outputDir, 'templates'));
    await fs.ensureDir(path.join(outputDir, 'config'));
    await fs.ensureDir(path.join(outputDir, 'assets'));
    await fs.ensureDir(path.join(outputDir, 'dist'));

    // Save site metadata
    const siteMeta = {
      id: website.id,
      slug: website.slug,
      name: website.name,
      status: website.status,
      pulledAt: new Date().toISOString(),
      apiUrl,
    };
    await fs.writeJson(path.join(outputDir, 'site.json'), siteMeta, { spaces: 2 });
    console.log(chalk.green('  ✓ site.json'));

    // Save layout template
    await fs.writeJson(
      path.join(outputDir, 'templates', 'layout.json'),
      website.mergedLayout || website.template?.layout || {},
      { spaces: 2 }
    );
    console.log(chalk.green('  ✓ templates/layout.json'));

    // Save course data
    if (website.course) {
      await fs.writeJson(
        path.join(outputDir, 'config', 'course.json'),
        website.course,
        { spaces: 2 }
      );
      console.log(chalk.green('  ✓ config/course.json'));

      // Save lessons separately
      if (website.course.lessons?.length > 0) {
        await fs.writeJson(
          path.join(outputDir, 'config', 'lessons.json'),
          website.course.lessons,
          { spaces: 2 }
        );
        console.log(chalk.green(`  ✓ config/lessons.json (${website.course.lessons.length} lessons)`));
      }
    }

    // Save basic CSS
    const css = generateCSS();
    await fs.writeFile(path.join(outputDir, 'assets', 'styles.css'), css);
    console.log(chalk.green('  ✓ assets/styles.css'));

    console.log(chalk.cyan(`\n✅ Pulled successfully to: ${chalk.bold(outputDir)}`));
    console.log(chalk.gray(`\nNext step: ${chalk.white(`site-cli build -d ./${slug}`)}\n`));

  } catch (err) {
    if (err.response?.status === 404) {
      console.error(chalk.red(`\n✗ No website found with slug "${slug}"`));
    } else {
      console.error(chalk.red(`\n✗ Error: ${err.message}`));
      console.error(chalk.gray('  Make sure backend is running at ' + apiUrl));
    }
    process.exit(1);
  }
}

function generateCSS() {
  return `
*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; height: auto; }
h1, h2, h3, h4, h5, h6 { margin: 0 0 16px; line-height: 1.3; }
p { margin: 0 0 16px; line-height: 1.7; }
`.trim();
}

module.exports = { pull };