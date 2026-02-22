import * as path from 'path';
import { loadChapters } from './chapters';
import { buildHtml } from './template';
import { generatePdf } from './pdf';

async function main(): Promise<void> {
  const srcDir = path.join(__dirname, '..', 'src');
  const outputPath = path.join(__dirname, '..', 'output', 'beyond-building.pdf');

  console.log('Loading chapters from src/...');
  const chapters = loadChapters(srcDir);
  console.log(`  ${chapters.length} chapters found.`);

  console.log('Building HTML...');
  const html = buildHtml(chapters);

  console.log('Generating PDF (this may take a moment)...');
  await generatePdf(html, outputPath);

  console.log(`\nDone. PDF written to: ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
