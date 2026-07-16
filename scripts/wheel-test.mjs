import { chromium } from "playwright";

const HIGHLIGHT = "bg-[#b5ad8e]/30";

function log(name, pass, detail = "") {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) process.exitCode = 1;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
await page.waitForSelector("tbody tr");

const activeIdx = () =>
  page.$$eval("tbody tr", (rows, h) => rows.findIndex((r) => r.className.includes(h)), HIGHLIGHT);

const rowCount = await page.$$eval("tbody tr", (rows) => rows.length);
console.log(`rows: ${rowCount}, initial active: ${await activeIdx()}`);

// 1. Single mouse notch over the LEFT (hero) panel advances exactly one
await page.mouse.move(400, 450);
await page.mouse.wheel(0, 120);
await page.waitForTimeout(1100);
log("one notch (left panel) -> idx 1", (await activeIdx()) === 1, `idx=${await activeIdx()}`);

// 2. Single notch over the RIGHT panel also advances one
await page.mouse.move(1200, 450);
await page.mouse.wheel(0, 120);
await page.waitForTimeout(1100);
log("one notch (right panel) -> idx 2", (await activeIdx()) === 2, `idx=${await activeIdx()}`);

// 3. A large fast flick only advances ONE step (clamped)
await page.mouse.wheel(0, 900);
await page.waitForTimeout(1100);
log("large flick clamped -> idx 3", (await activeIdx()) === 3, `idx=${await activeIdx()}`);

// 4. Scroll up works
await page.mouse.wheel(0, -120);
await page.waitForTimeout(1100);
log("notch up -> idx 2", (await activeIdx()) === 2, `idx=${await activeIdx()}`);

// 5. Hover a row, then wheel — wheel wins immediately
const row0 = page.locator("tbody tr").first();
await row0.hover();
await page.waitForTimeout(300);
const hoverIdx = await activeIdx();
await page.mouse.wheel(0, 120);
await page.waitForTimeout(1100);
const afterWheel = await activeIdx();
log(
  "hover then wheel -> wheel index wins",
  hoverIdx === 0 && afterWheel === 3,
  `hover=${hoverIdx}, after=${afterWheel}`,
);

// 6. Arrow keys still step
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(1100);
log("ArrowDown -> idx 4", (await activeIdx()) === 4, `idx=${await activeIdx()}`);
await page.keyboard.press("ArrowUp");
await page.waitForTimeout(1100);
log("ArrowUp -> idx 3", (await activeIdx()) === 3, `idx=${await activeIdx()}`);

await browser.close();
