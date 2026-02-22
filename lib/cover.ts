import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

const COVER_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 1600px;
    height: 2560px;
    overflow: hidden;
  }
  body {
    background: #0d1117;
    font-family: Georgia, 'Times New Roman', serif;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  /* Subtle background texture via radial gradient */
  body::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 120% 80% at 50% 0%, #1a2744 0%, transparent 60%),
      radial-gradient(ellipse 80% 60% at 50% 100%, #0a0a1a 0%, transparent 70%);
  }

  .cover {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 160px;
    width: 100%;
    height: 100%;
  }

  .ornament {
    width: 80px;
    height: 1px;
    background: rgba(255,255,255,0.25);
    margin: 0 auto 80px;
  }

  .title {
    font-size: 108px;
    font-weight: normal;
    color: #ffffff;
    letter-spacing: 0.04em;
    line-height: 1.1;
    margin-bottom: 48px;
  }

  .subtitle {
    font-size: 38px;
    font-style: italic;
    color: rgba(255,255,255,0.6);
    line-height: 1.45;
    max-width: 1000px;
    margin-bottom: 100px;
  }

  .rule {
    width: 60px;
    height: 1px;
    background: rgba(255,255,255,0.3);
    margin: 0 auto 80px;
  }

  .author {
    font-size: 30px;
    color: rgba(255,255,255,0.75);
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .border {
    position: absolute;
    inset: 48px;
    border: 1px solid rgba(255,255,255,0.08);
    pointer-events: none;
  }
</style>
</head>
<body>
  <div class="cover">
    <div class="border"></div>
    <div class="ornament"></div>
    <div class="title">Beyond<br>Building</div>
    <div class="subtitle">Purpose When Work Ends</div>
    <div class="rule"></div>
    <div class="author">Charlie Greenman</div>
  </div>
</body>
</html>`;

export async function generateCover(outputPath: string): Promise<void> {
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 2560, deviceScaleFactor: 1 });
    await page.setContent(COVER_HTML, { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: outputPath as `${string}.jpg`,
      type: 'jpeg',
      quality: 95,
      clip: { x: 0, y: 0, width: 1600, height: 2560 },
    });
  } finally {
    await browser.close();
  }
}
