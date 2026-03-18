const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function build(options) {
  const siteDir = path.resolve(options.dir || '.');
  const layoutFile = path.join(siteDir, 'templates', 'layout.json');
  const courseFile = path.join(siteDir, 'config', 'course.json');
  const siteFile = path.join(siteDir, 'site.json');
  const distDir = path.join(siteDir, 'dist');

  console.log(chalk.cyan(`\n🔨 Building site in: ${siteDir}\n`));

  if (!await fs.pathExists(layoutFile)) {
    console.error(chalk.red('✗ templates/layout.json not found. Run "site-cli pull <slug>" first.'));
    process.exit(1);
  }

  const layout = await fs.readJson(layoutFile);
  const course = await fs.pathExists(courseFile) ? await fs.readJson(courseFile) : {};
  const site = await fs.pathExists(siteFile) ? await fs.readJson(siteFile) : {};
  const title = course.title || site.name || 'Course Site';

  const html = generateHTML(layout, course, title);

  await fs.ensureDir(distDir);
  await fs.writeFile(path.join(distDir, 'index.html'), html);

  const cssSource = path.join(siteDir, 'assets', 'styles.css');
  if (await fs.pathExists(cssSource)) {
    await fs.copy(cssSource, path.join(distDir, 'styles.css'));
    console.log(chalk.green('  ✓ styles.css'));
  }

  console.log(chalk.green('  ✓ index.html'));
  console.log(chalk.cyan(`\n✅ Built successfully to: ${chalk.bold(distDir)}`));
  console.log(chalk.gray(`\nOpen: ${chalk.white(`open ${path.join(distDir, 'index.html')}`)}\n`));
}

// ─── Inject course variables ───────────────────────────────────────────────────
function inject(str, course) {
  if (!course || !str) return str || '';
  return String(str)
    .replace(/\{\{course\.title\}\}/g, course.title || '')
    .replace(/\{\{course\.description\}\}/g, course.description || '')
    .replace(/\{\{course\.instructor\}\}/g, course.instructor || '')
    .replace(/\{\{course\.thumbnail\}\}/g, course.thumbnail || '')
    .replace(/\{\{course\.price\}\}/g, course.price?.toString() || '')
    .replace(/\{\{course\.duration\}\}/g, course.duration || '')
    .replace(/\{\{course\.level\}\}/g, course.level || '');
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Node Renderer ─────────────────────────────────────────────────────────────
function renderNode(node, course) {
  if (!node) return '';
  const { type, props, children = [] } = node;
  const ch = children.map(c => renderNode(c, course)).join('\n');
  const p = props || {};

  switch (type) {
    case 'page':
      return ch;

    case 'navbar':
      return `
<nav style="background:${p.bgColor||'#ffffff'};border-bottom:1px solid #e5e7eb;padding:0 40px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;">
  <div style="font-weight:700;font-size:18px;color:#fff;">${esc(inject(p.logo||'', course))}</div>
  <div style="display:flex;gap:24px;">
    ${(p.links||[]).map(l => `<a href="#" style="color:#aaa;font-size:14px;font-weight:500;text-decoration:none;">${esc(l)}</a>`).join('')}
  </div>
</nav>`;

    case 'hero':
      return `
<div style="background:${p.bgColor||'#1a1a2e'};${p.bgImage?`background-image:url(${p.bgImage});background-size:cover;background-position:center;`:''}padding:100px 40px;text-align:center;color:#fff;">
  <h1 style="font-size:3rem;font-weight:800;margin:0 0 16px;line-height:1.2;">${esc(inject(p.title||'', course))}</h1>
  <p style="font-size:1.2rem;color:#aac;max-width:600px;margin:0 auto 32px;">${esc(inject(p.subtitle||'', course))}</p>
  ${p.buttonText ? `<a href="${p.buttonHref||'#'}" style="display:inline-block;background:#6c63ff;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">${esc(p.buttonText)}</a>` : ''}
</div>`;

    case 'section':
      return `<section style="padding:${p.padding||'60px 40px'};background:${p.bgColor||'transparent'};${p.textAlign?`text-align:${p.textAlign};`:''}">
${ch}
</section>`;

    case 'container':
      return `<div style="max-width:${p.maxWidth||'1100px'};margin:0 auto;padding:${p.padding||'0 20px'};">
${ch}
</div>`;

    case 'grid':
      return `<div style="display:grid;grid-template-columns:repeat(${p.columns||3},1fr);gap:${p.gap||'24px'};">
${ch}
</div>`;

    case 'columns':
      return `<div style="display:flex;gap:${p.gap||'24px'};flex-wrap:wrap;align-items:flex-start;">
${children.map(c => `<div style="flex:1;min-width:200px;">${renderNode(c, course)}</div>`).join('\n')}
</div>`;

    case 'heading': {
      const align = p.alignment || 'left';
      return `<h2 style="font-size:${p.fontSize||'2rem'};text-align:${align};color:${p.color||'#111'};margin:0 0 16px;font-weight:700;line-height:1.3;">${esc(inject(p.text||'', course))}</h2>`;
    }

    case 'text': {
      const align = p.alignment || 'left';
      return `<p style="font-size:${p.fontSize||'1rem'};color:${p.color||'#444'};text-align:${align};margin:0 0 16px;line-height:1.7;">${esc(inject(p.text||'', course))}</p>`;
    }

    case 'button': {
      const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
      const justify = justifyMap[p.alignment] || 'flex-start';
      const bg = p.variant === 'outline' ? 'transparent' : (p.bgColor || '#6c63ff');
      const border = p.variant === 'outline' ? `border:2px solid ${p.bgColor||'#6c63ff'};` : '';
      return `<div style="display:flex;justify-content:${justify};margin-bottom:16px;">
  <a href="${p.href||'#'}" style="display:inline-block;background:${bg};${border}color:${p.color||'#fff'};padding:${p.padding||'12px 28px'};border-radius:${p.borderRadius||'8px'};text-decoration:none;font-weight:600;font-size:${p.fontSize||'14px'};">${esc(p.label||'Click Me')}</a>
</div>`;
    }

    case 'image': {
      const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
      const justify = justifyMap[p.alignment] || 'flex-start';
      return `<div style="display:flex;justify-content:${justify};margin-bottom:16px;">
  <img src="${inject(p.src||'', course)}" alt="${esc(p.alt||'')}" style="width:${p.width||'100%'};height:auto;border-radius:${p.borderRadius||'0px'};display:block;" />
</div>`;
    }

    case 'divider':
      return `<hr style="border:none;border-top:${p.thickness||'1px'} solid ${p.color||'#e5e7eb'};margin:${p.margin||'16px 0'};" />`;

    case 'spacer':
      return `<div style="height:${p.height||'40px'};"></div>`;

    case 'badge':
      return `<span style="display:inline-block;background:${p.bgColor||'#6c63ff22'};color:${p.color||'#6c63ff'};padding:4px 12px;border-radius:${p.borderRadius||'20px'};font-size:12px;font-weight:600;margin-bottom:12px;">${esc(p.text||'Badge')}</span>`;

    case 'testimonial':
      return `
<div style="background:${p.bgColor||'#f9f9f9'};border-radius:12px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
  <p style="font-size:1.1rem;color:#333;font-style:italic;line-height:1.7;margin:0 0 20px;">"${esc(p.quote||'')}"</p>
  <div style="display:flex;align-items:center;gap:12px;">
    ${p.avatar ? `<img src="${p.avatar}" alt="${esc(p.author||'')}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />` : ''}
    <div>
      <div style="font-weight:700;font-size:14px;color:#111;">${esc(p.author||'')}</div>
      <div style="font-size:12px;color:#888;">${esc(p.role||'')}</div>
    </div>
  </div>
</div>`;

    case 'pricing': {
      const highlighted = p.highlighted === true || p.highlighted === 'true';
      const bg = highlighted ? '#6c63ff' : '#ffffff';
      const textColor = highlighted ? '#fff' : '#111';
      const subColor = highlighted ? '#ffffffaa' : '#888';
      const shadow = highlighted ? '0 8px 32px rgba(108,99,255,0.3)' : '0 2px 12px rgba(0,0,0,0.08)';
      const border = highlighted ? 'none' : '1px solid #e5e7eb';
      const btnBg = highlighted ? '#fff' : '#6c63ff';
      const btnColor = highlighted ? '#6c63ff' : '#fff';
      const features = Array.isArray(p.features) ? p.features : [];
      return `
<div style="background:${bg};border-radius:16px;padding:40px 32px;box-shadow:${shadow};border:${border};text-align:center;">
  <h3 style="font-size:1.2rem;font-weight:700;color:${textColor};margin:0 0 16px;">${esc(p.title||'Plan')}</h3>
  <div style="font-size:3rem;font-weight:800;color:${highlighted?'#fff':'#6c63ff'};margin:0 0 4px;">${esc(inject(p.price||'', course))}</div>
  <div style="font-size:14px;color:${subColor};margin:0 0 24px;">${esc(p.period||'')}</div>
  <ul style="list-style:none;padding:0;margin:0 0 32px;text-align:left;">
    ${features.map(f => `<li style="padding:8px 0;color:${highlighted?'#fff':'#444'};font-size:14px;border-bottom:1px solid ${highlighted?'#ffffff22':'#f0f0f0'};">✓ ${esc(f)}</li>`).join('')}
  </ul>
  <a href="#" style="display:block;background:${btnBg};color:${btnColor};padding:14px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">${esc(p.buttonText||'Get Started')}</a>
</div>`;
    }

    case 'faq':
      return `
<div style="border-bottom:1px solid #e5e7eb;padding:20px 0;">
  <h4 style="font-size:16px;font-weight:700;color:#111;margin:0 0 10px;">${esc(p.question||'')}</h4>
  <p style="font-size:14px;color:#555;margin:0;line-height:1.7;">${esc(p.answer||'')}</p>
</div>`;

    case 'progress':
      return `
<div style="margin-bottom:16px;">
  <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
    <span style="font-size:13px;font-weight:600;color:#333;">${esc(p.label||'')}</span>
    <span style="font-size:13px;font-weight:600;color:${p.color||'#6c63ff'};">${p.value||0}%</span>
  </div>
  <div style="background:${p.bgColor||'#e5e7eb'};border-radius:99px;height:8px;overflow:hidden;">
    <div style="background:${p.color||'#6c63ff'};width:${p.value||0}%;height:100%;border-radius:99px;"></div>
  </div>
</div>`;

    case 'icontext':
      return `
<div style="display:flex;gap:16px;align-items:flex-start;padding:16px 0;">
  <div style="width:48px;height:48px;background:#6c63ff22;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">${p.icon||'⚡'}</div>
  <div>
    <h4 style="font-size:16px;font-weight:700;color:#111;margin:0 0 6px;">${esc(inject(p.title||'', course))}</h4>
    <p style="font-size:14px;color:#555;margin:0;line-height:1.6;">${esc(inject(p.text||'', course))}</p>
  </div>
</div>`;

    case 'codeblock':
      return `
<div style="background:#1e1e2e;border-radius:8px;overflow:hidden;margin-bottom:16px;">
  <div style="padding:8px 16px;background:#252538;">
    <span style="font-size:11px;color:#888;font-weight:600;">${esc(p.language||'javascript')}</span>
  </div>
  <pre style="margin:0;padding:16px;font-size:13px;color:#cdd6f4;font-family:monospace;overflow-x:auto;line-height:1.6;">${esc(p.code||'')}</pre>
</div>`;

    case 'footer':
      return `<footer style="background:${p.bgColor||'#111'};color:${p.color||'#fff'};padding:40px;text-align:${p.alignment||'center'};font-size:14px;">
  ${esc(inject(p.text||'', course))}
</footer>`;

    default:
      return ch;
  }
}

// ─── Full HTML ─────────────────────────────────────────────────────────────────
function generateHTML(layout, course, title) {
  const body = renderNode(layout, course);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(course.description||'')}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: 'Inter', -apple-system, sans-serif; }
    a { text-decoration: none; }
    img { max-width: 100%; }
    @media (max-width: 768px) {
      div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
      div[style*="display:flex"] { flex-direction: column; }
      h1 { font-size: 2rem !important; }
      h2 { font-size: 1.5rem !important; }
      nav { padding: 0 16px !important; }
      section { padding: 40px 20px !important; }
    }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

module.exports = { build };