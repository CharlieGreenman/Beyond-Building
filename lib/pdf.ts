import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

export async function generatePdf(html: string, outputPath: string): Promise<void> {
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: outputPath,
      width: '6in',
      height: '9in',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="
          width: 100%;
          text-align: center;
          font-family: Georgia, serif;
          font-size: 9pt;
          color: #666;
          padding-bottom: 0.3in;
        ">
          <span class="pageNumber"></span>
        </div>
      `,
      margin: {
        top: '0.875in',
        right: '0.75in',
        bottom: '1in',
        left: '0.875in',
      },
    });
  } finally {
    await browser.close();
  }
}
