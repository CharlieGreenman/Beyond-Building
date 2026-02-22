import * as path from 'path';
import { loadChapters } from './chapters';
import { buildHtml } from './template';
import { generatePdf } from './pdf';
import { generateCover } from './cover';
import { generateEpub } from './kindle';

const args = process.argv.slice(2);
const wantPdf    = args.includes('--pdf')    || args.includes('--all') || args.length === 0;
const wantKindle = args.includes('--kindle') || args.includes('--all') || args.length === 0;

const srcDir     = path.join(__dirname, '..', 'src');
const outputDir  = path.join(__dirname, '..', 'output');
const coverPath  = path.join(outputDir, 'cover.jpg');
const epubPath   = path.join(outputDir, 'beyond-building.epub');
const pdfPath    = path.join(outputDir, 'beyond-building.pdf');

async function main(): Promise<void> {
  console.log('Loading chapters from src/...');
  const chapters = loadChapters(srcDir);
  console.log(`  ${chapters.length} chapters found.\n`);

  if (wantKindle) {
    console.log('Generating cover image...');
    await generateCover(coverPath);
    console.log(`  Cover written to: ${coverPath}`);

    console.log('Generating EPUB (Kindle)...');
    await generateEpub(chapters, coverPath, epubPath);
    console.log(`  EPUB written to:  ${epubPath}\n`);
  }

  if (wantPdf) {
    console.log('Building PDF HTML...');
    const html = buildHtml(chapters);

    console.log('Generating PDF...');
    await generatePdf(html, pdfPath);
    console.log(`  PDF written to:   ${pdfPath}\n`);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
