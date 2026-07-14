import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

const root = path.resolve('.');
const chromiumTemp = '/tmp/sdlc-book-chromium';
await fs.mkdir(chromiumTemp, { recursive: true });
process.env.TMPDIR = chromiumTemp;
const realGetuid = process.getuid;
process.getuid = () => 1000;
const { default: chromium } = await import('@sparticuz/chromium');
const markdownPath = path.resolve(process.argv[2] ?? 'The-New-SDLC.md');
const outputPdf = path.resolve(process.argv[3] ?? 'The-New-SDLC.pdf');
const outputHtml = outputPdf.replace(/\.pdf$/i, '.html');
const source = await fs.readFile(markdownPath, 'utf8');
const renderer = new marked.Renderer();
let chapterNumber = 0;
renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const id = depth === 1 ? `chapter-${String(++chapterNumber).padStart(2, '0')}` : undefined;
  return `<h${depth}${id ? ` id="${id}"` : ''}>${text}</h${depth}>\n`;
};
const body = await marked.parse(source.replace(/^---[\s\S]*?---\s*/, ''), { gfm: true, renderer });

const fontBase = pathToFileURL(path.join(root, 'node_modules/@fontsource/noto-sans-myanmar/files')).href;
const html = `<!doctype html>
<html lang="my">
<head>
<meta charset="utf-8">
<title>The New SDLC</title>
<style>
@font-face { font-family: NotoMyanmar; src: url('${fontBase}/noto-sans-myanmar-myanmar-400-normal.woff2') format('woff2'); font-weight: 400; }
@font-face { font-family: NotoMyanmar; src: url('${fontBase}/noto-sans-myanmar-myanmar-700-normal.woff2') format('woff2'); font-weight: 700; }
@font-face { font-family: NotoMyanmar; src: url('${fontBase}/noto-sans-myanmar-latin-400-normal.woff2') format('woff2'); font-weight: 400; }
@font-face { font-family: NotoMyanmar; src: url('${fontBase}/noto-sans-myanmar-latin-700-normal.woff2') format('woff2'); font-weight: 700; }
@page { size: Letter; margin: 0.72in 0.72in 0.68in; @bottom-center { content: counter(page); font: 8pt Arial; color: #777; } }
@page:first { margin: 0; @bottom-center { content: none; } }
* { box-sizing: border-box; }
html { font-size: 10.4pt; }
body { margin: 0; color: #24272b; font-family: NotoMyanmar, Arial, sans-serif; line-height: 1.72; }
h1, h2, h3 { color: #174ea6; line-height: 1.38; break-inside: avoid; break-after: avoid-page; page-break-after: avoid; }
h1 { font-size: 25pt; margin: 0 0 20pt; padding-top: 8pt; break-before: page; }
h2 { font-size: 17pt; margin: 22pt 0 8pt; }
h3 { font-size: 13pt; margin: 18pt 0 6pt; }
p { margin: 0 0 10pt; widows: 3; orphans: 3; }
ul, ol { padding-left: 24pt; margin: 6pt 0 12pt; }
li { margin: 0 0 5pt; }
strong { font-weight: 700; }
blockquote { margin: 16pt 0; padding: 12pt 15pt; border-left: 4pt solid #f9ab00; background: #fff7df; break-inside: avoid; }
blockquote p { margin: 0; }
code { font-family: 'DejaVu Sans Mono', monospace; font-size: 8.7pt; background: #f1f3f4; padding: 1pt 3pt; border-radius: 2pt; }
pre { padding: 13pt; background: #202124; color: #f8f9fa; border-radius: 5pt; white-space: pre-wrap; break-inside: avoid; }
pre code { background: transparent; padding: 0; color: inherit; }
table { width: 100%; border-collapse: collapse; font-size: 7.8pt; line-height: 1.45; margin: 12pt 0 18pt; break-inside: avoid; }
th { background: #174ea6; color: white; }
th, td { border: 0.5pt solid #b7c4d8; padding: 6pt; vertical-align: top; }
tr:nth-child(even) td { background: #f4f7fb; }
figure { margin: 18pt auto 20pt; text-align: center; break-inside: avoid; }
figure img { display: block; max-width: 100%; max-height: 7.1in; margin: auto; object-fit: contain; }
figcaption { margin-top: 6pt; color: #5f6368; font-size: 8.2pt; }
a { color: #174ea6; text-decoration: none; overflow-wrap: anywhere; }
.cover { position: relative; width: 8.5in; height: 11in; margin: 0; padding: 0.82in 0.78in; color: white; overflow: hidden; break-after: page; background: linear-gradient(145deg, #07152f 0%, #0b2d5d 54%, #075d73 100%); }
.cover::before { content: ''; position: absolute; width: 7.2in; height: 7.2in; right: -2.7in; top: 1.8in; border: 1.2pt solid rgba(93, 224, 232, .46); border-radius: 50%; box-shadow: 0 0 0 .38in rgba(35, 164, 195, .10), 0 0 0 .82in rgba(35, 164, 195, .065), 0 0 0 1.3in rgba(35, 164, 195, .04); }
.cover::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(112,225,232,.12) 1px, transparent 1px), linear-gradient(rgba(112,225,232,.10) 1px, transparent 1px); background-size: .46in .46in; mask-image: linear-gradient(to bottom right, transparent 15%, rgba(0,0,0,.65), transparent 82%); }
.cover-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; }
.cover .eyebrow { margin: .05in 0 0; font: 700 10pt/1.2 Arial, sans-serif; letter-spacing: 2.2pt; color: #70e1e8; text-transform: uppercase; }
.cover h1 { position: relative; z-index: 1; color: white; font: 700 53pt/.94 Arial, sans-serif; margin: 1.42in 0 0; break-before: auto; letter-spacing: 1.2pt; }
.cover h1 span { color: #70e1e8; }
.cover-rule { position: relative; z-index: 1; width: 1.05in; height: 6pt; margin: .48in 0 .34in; background: #f6b84a; }
.cover p { position: relative; z-index: 1; max-width: 5.7in; }
.cover .subtitle { font: 700 19pt/1.35 Arial, NotoMyanmar, sans-serif; letter-spacing: .25pt; color: #effcff; }
.cover .description { margin-top: .22in; max-width: 5.2in; font-size: 11.5pt; line-height: 1.75; color: #c9e3ea; }
.cover .flow { margin-top: auto; display: flex; align-items: center; gap: 9pt; font: 700 9pt/1 Arial, sans-serif; letter-spacing: .7pt; color: #dff8fa; }
.cover .flow span { padding: 8pt 11pt; border: 1px solid rgba(112,225,232,.55); background: rgba(7,21,47,.42); border-radius: 20pt; }
.cover .flow b { color: #f6b84a; font-size: 14pt; }
.heading-keep { display: flow-root; break-inside: avoid; page-break-inside: avoid; }
.heading-keep > h2:first-child, .heading-keep > h3:first-child { margin-top: 0; padding-top: 22pt; }
.toc a { display: block; padding: 3pt 0; }
.toc li::marker { color: #174ea6; font-weight: 700; }
.cover + h2 { break-before: page; }
body > h1:first-of-type { break-before: page; }
</style>
</head><body>${body}<script>
for (const heading of document.querySelectorAll('h2, h3')) {
  if (heading.closest('.cover') || heading.textContent.trim() === 'မာတိကာ') continue;
  const next = heading.nextElementSibling;
  if (!next) continue;
  const keep = document.createElement('div');
  keep.className = 'heading-keep';
  heading.before(keep);
  keep.append(heading, next);
}
</script></body></html>`;

await fs.writeFile(outputHtml, html);
const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  headless: true,
  args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(outputHtml).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: outputPdf, format: 'Letter', printBackground: true, preferCSSPageSize: true });
await browser.close();
process.getuid = realGetuid;
console.log(`Wrote ${outputHtml}`);
console.log(`Wrote ${outputPdf}`);
