#!/usr/bin/env node

import fs from 'node:fs';

const [input, output, titleArg] = process.argv.slice(2);
if (!input || !output) {
  console.error('Usage: node tools/render_markdown_html.mjs INPUT.md OUTPUT.html [TITLE]');
  process.exit(2);
}

const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const inline = (s) => escape(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
const lines = fs.readFileSync(input, 'utf8').split(/\r?\n/);
const body = [];
let paragraph = [];
let list = false;
let code = false;
let codeLines = [];

const flushParagraph = () => {
  if (paragraph.length) body.push(`<p>${inline(paragraph.join(' '))}</p>`);
  paragraph = [];
};
const closeList = () => {
  if (list) body.push('</ul>');
  list = false;
};

for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  if (line.startsWith('```')) {
    flushParagraph(); closeList();
    if (code) {
      body.push(`<pre><code>${escape(codeLines.join('\n'))}</code></pre>`);
      codeLines = [];
    }
    code = !code;
    continue;
  }
  if (code) { codeLines.push(line); continue; }
  if (/^\|.*\|$/.test(line) && i + 1 < lines.length && /^\|(?:\s*:?-+:?\s*\|)+$/.test(lines[i + 1])) {
    flushParagraph(); closeList();
    const tableLines = [line];
    i += 2;
    while (i < lines.length && /^\|.*\|$/.test(lines[i])) { tableLines.push(lines[i]); i += 1; }
    i -= 1;
    const cells = (row) => row.slice(1, -1).split('|').map((c) => c.trim());
    body.push('<table><thead><tr>' + cells(tableLines[0]).map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>');
    for (const row of tableLines.slice(1)) body.push('<tr>' + cells(row).map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>');
    body.push('</tbody></table>');
    continue;
  }
  const heading = line.match(/^(#{1,6})\s+(.+)$/);
  if (heading) {
    flushParagraph(); closeList();
    const level = heading[1].length;
    body.push(`<h${level}>${inline(heading[2])}</h${level}>`);
    continue;
  }
  if (/^---+$/.test(line.trim())) { flushParagraph(); closeList(); body.push('<hr>'); continue; }
  const item = line.match(/^[-*]\s+(.+)$/);
  if (item) {
    flushParagraph();
    if (!list) { body.push('<ul>'); list = true; }
    body.push(`<li>${inline(item[1])}</li>`);
    continue;
  }
  if (!line.trim()) { flushParagraph(); closeList(); continue; }
  paragraph.push(line.trim());
}
flushParagraph(); closeList();
if (codeLines.length) body.push(`<pre><code>${escape(codeLines.join('\n'))}</code></pre>`);

const title = titleArg || lines.find((line) => line.startsWith('# '))?.slice(2) || input;
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${escape(title)}</title>
<style>
@page { size: A4; margin: 16mm 13mm; }
body { color:#172033; font: 10.5pt -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height:1.45; max-width: 100%; }
h1 { color:#143b66; border-bottom:2px solid #356a9a; padding-bottom:6px; font-size:22pt; }
h2 { color:#194f7d; border-bottom:1px solid #c7d4df; padding-bottom:3px; font-size:16pt; break-after:avoid; }
h3 { font-size:13pt; break-after:avoid; }
p, li { orphans:3; widows:3; }
table { border-collapse:collapse; width:100%; margin:8px 0 14px; font-size:8.3pt; break-inside:auto; }
tr { break-inside:avoid; }
th, td { border:1px solid #9aa9b5; padding:4px 5px; vertical-align:top; overflow-wrap:anywhere; }
th { background:#eaf1f7; text-align:left; }
code { background:#eef2f5; padding:1px 3px; border-radius:3px; font-family:ui-monospace, monospace; }
pre { white-space:pre-wrap; overflow-wrap:anywhere; background:#f4f6f8; border:1px solid #d6dde3; padding:8px; font-size:8.5pt; }
a { color:#145ea8; }
</style></head><body>${body.join('\n')}</body></html>\n`;
fs.writeFileSync(output, html);
