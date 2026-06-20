#!/usr/bin/env node
/**
 * build.js — converts articles/*.md (from Decap CMS) into:
 *   articles/<slug>.json   (full article data)
 *   articles/index.json    (list for the homepage)
 *
 * Run: node build.js
 * Requires: Node.js (no npm packages needed)
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
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Booleans
    if (val === 'true') val = true;
    if (val === 'false') val = false;
    meta[key] = val;
  });

  return { meta, body: match[2].trim() };
}

function slugify(filename) {
  return path.basename(filename, '.md');
}

if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

const mdFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
const index = [];

for (const file of mdFiles) {
  const raw = fs.readFileSync(path.join(articlesDir, file), 'utf8');
  const { meta, body } = parseFrontmatter(raw);

  // Skip drafts
  if (meta.published === false) continue;

  const slug = slugify(file);
  const article = {
    slug,
    title: meta.title || 'Untitled',
    category: meta.category || 'Commentary',
    date: meta.date || '',
    excerpt: meta.excerpt || '',
    body,
  };

  // Write individual article JSON
  fs.writeFileSync(
    path.join(articlesDir, `${slug}.json`),
    JSON.stringify(article, null, 2)
  );

  index.push({
    slug: article.slug,
    title: article.title,
    category: article.category,
    date: article.date,
    excerpt: article.excerpt,
  });
}

// Sort newest first
index.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(
  path.join(articlesDir, 'index.json'),
  JSON.stringify(index, null, 2)
);

console.log(`✓ Built ${index.length} article(s).`);
