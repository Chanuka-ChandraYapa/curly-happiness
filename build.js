#!/usr/bin/env node
/**
 * build.js — generates articles/index.json from markdown frontmatter
 * This lightweight index is used by the homepage to list articles.
 * Full markdown is loaded directly in the browser and rendered with marked.js
 */

const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'articles');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':');
    if (colon === -1) return;
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val === 'true') val = true;
    if (val === 'false') val = false;
    meta[key] = val;
  });

  return { meta, body: match[2].trim() };
}

if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

const mdFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
const index = [];

for (const file of mdFiles) {
  const raw = fs.readFileSync(path.join(articlesDir, file), 'utf8');
  const { meta } = parseFrontmatter(raw);

  // Skip drafts
  if (meta.published === false) continue;

  const slug = path.basename(file, '.md');
  const article = {
    slug,
    title: meta.title || 'Untitled',
    category: meta.category || 'Commentary',
    date: meta.date || '',
    excerpt: meta.excerpt || '',
  };

  index.push(article);
}

// Sort newest first
index.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(
  path.join(articlesDir, 'index.json'),
  JSON.stringify(index, null, 2)
);

console.log(`✓ Built index for ${index.length} article(s).`);
