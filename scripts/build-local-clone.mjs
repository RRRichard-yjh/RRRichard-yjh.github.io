import { copyFile, readFile, writeFile } from "node:fs/promises";

const sourceHtmlPath = new URL("../reference-index.html", import.meta.url);
const sourceCssPath = new URL("../reference-style.css", import.meta.url);
const outputHtmlPath = new URL("../index.html", import.meta.url);
const outputCssPath = new URL("../style.css", import.meta.url);
const remoteRoot = "https://tianxingchen.github.io/";

let html = await readFile(sourceHtmlPath, "utf8");

const wechatButtonPattern =
  /\s*<a class="social-btn" href="\.\/assets\/files\/my_wechat\.png" target="_blank">\s*<img src="assets\/files\/icon\/wechat\.png" alt="WeChat" \/> WeChat\s*<\/a>/;

if (!wechatButtonPattern.test(html)) {
  throw new Error("Expected WeChat QR button was not found in the reference HTML.");
}

html = html.replace(wechatButtonPattern, "");

html = html.replace(
  /\b(src|data-src|poster|href)=(["'])(\.\/)?assets\//g,
  (_match, attribute, quote) =>
    `${attribute}=${quote}${remoteRoot}assets/`,
);

await writeFile(outputHtmlPath, html, "utf8");
await copyFile(sourceCssPath, outputCssPath);

console.log("Created index.html and style.css.");
