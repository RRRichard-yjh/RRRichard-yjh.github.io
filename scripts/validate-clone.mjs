import { readFile } from "node:fs/promises";

const reference = await readFile(
  new URL("../reference-index.html", import.meta.url),
  "utf8",
);
const clone = await readFile(new URL("../index.html", import.meta.url), "utf8");
const referenceCss = await readFile(
  new URL("../reference-style.css", import.meta.url),
  "utf8",
);
const cloneCss = await readFile(new URL("../style.css", import.meta.url), "utf8");

const wechatButtonPattern =
  /\s*<a class="social-btn" href="\.\/assets\/files\/my_wechat\.png" target="_blank">\s*<img src="assets\/files\/icon\/wechat\.png" alt="WeChat" \/> WeChat\s*<\/a>/;
const expectedClone = reference
  .replace(wechatButtonPattern, "")
  .replace(
    /\b(src|data-src|poster|href)=(["'])(\.\/)?assets\//g,
    (_match, attribute, quote) =>
      `${attribute}=${quote}https://tianxingchen.github.io/assets/`,
  );

const getLinks = (html) =>
  [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

const expectedLinks = getLinks(reference).filter(
  (href) => !href.includes("my_wechat.png"),
);
const cloneLinks = getLinks(clone);
const remainingRelativeAssets = [
  ...clone.matchAll(/(?:src|data-src|poster|href)="([^"]+)"/g),
]
  .map((match) => match[1])
  .filter(
    (value) => value.startsWith("assets/") || value.startsWith("./assets/"),
  );

const report = {
  referenceLinksAfterWechatRemoval: expectedLinks.length,
  cloneLinks: cloneLinks.length,
  linksPreserved: JSON.stringify(expectedLinks) === JSON.stringify(cloneLinks),
  remainingRelativeAssets: remainingRelativeAssets.length,
  wechatQrRemoved: !clone.includes("my_wechat.png"),
  wechatButtonRemoved: !clone.includes('alt="WeChat"'),
  exactHtmlTransformation: clone === expectedClone,
  stylesheetIdentical: cloneCss === referenceCss,
};

console.log(JSON.stringify(report, null, 2));

if (
  !report.linksPreserved ||
  report.remainingRelativeAssets !== 0 ||
  !report.wechatQrRemoved ||
  !report.wechatButtonRemoved ||
  !report.exactHtmlTransformation ||
  !report.stylesheetIdentical
) {
  process.exitCode = 1;
}
