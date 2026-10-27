#!/usr/bin/env node
/**
 * fix-android-asset-paths.cjs
 *
 * 修复「Next.js 静态导出 + Capacitor 安卓/iOS」的动态路由方括号 chunk 404 问题。
 *
 * 背景：
 *   动态路由（[grade] / [book] / [story] / [lesson] / [passage] / [unit] …）的页面
 *   chunk 默认被输出到**含方括号**的目录，例如
 *     out/_next/static/chunks/app/grade/[grade]/page-*.js
 *   HTML 里引用的是百分号编码后的路由路径 %5Bgrade%5D。
 *   安卓/iOS 的 WebViewAssetLoader 通过 Uri.getPath() 取路径，**不会解码** %5B/%5D，
 *   于是该 chunk 在真机 404 → ChunkLoadError → 年级 / 教材 / 绘本等动态页白屏。
 *   （静态路由没有方括号，所以首页等正常 —— 这也正是「首页能用、年级页白屏」的根因。）
 *
 * 做法（与平台无关，Web / Desktop / iOS / Android 全部受益）：
 *   1. 把 _next 下所有「含方括号的目录」改名为去方括号名（[grade] -> grade …）；
 *   2. 把所有产物文件（.html/.js/.json/.css/…）里的引用
 *        %5B<seg>%5D  与  [<seg>]
 *      统一改写成 <seg>，使磁盘文件、HTML 引用、webpack 运行时 chunk 映射三者一致。
 *
 * 该脚本在 `next build` 之后运行（见 package.json 的 build 脚本）。
 */
const fs = require("fs");
const path = require("path");

const OUT = path.resolve(__dirname, "..", "out");
const CHUNKS = path.join(OUT, "_next", "static", "chunks");

// 只重写文本类文件，避免破坏图片/字体/音频等二进制。
const TEXT_EXT = new Set([
  ".html", ".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx",
  ".json", ".css", ".txt", ".map", ".webmanifest", ".svg", ".xml",
]);

const renamedSegments = new Set();

/** 递归重命名所有含方括号的目录：[seg] -> seg，并收集 seg 名称。 */
function renameBracketDirs(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (!e.isDirectory()) continue;
    const m = e.name.match(/^\[(.*)\]$/);
    if (m) {
      const safe = m[1];
      renamedSegments.add(safe);
      const target = path.join(dir, safe);
      if (full !== target && !fs.existsSync(target)) {
        fs.renameSync(full, target);
        console.log(`  [rename] ${path.relative(OUT, full)}  ->  ${safe}`);
        renameBracketDirs(target);
      } else {
        // 目标已存在（理论上不会），递归原目录继续处理其子项。
        renameBracketDirs(full);
      }
    } else {
      renameBracketDirs(full);
    }
  }
}

/** 递归重写所有文本文件里的方括号引用为去方括号名。 */
function rewriteFiles(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      rewriteFiles(full);
      continue;
    }
    const ext = path.extname(e.name).toLowerCase();
    if (!TEXT_EXT.has(ext)) continue;
    let content;
    try {
      content = fs.readFileSync(full, "utf8");
    } catch {
      continue;
    }
    let outc = content;
    let changed = false;
    for (const seg of renamedSegments) {
      const enc = `%5B${seg}%5D`; // 百分号编码形式（HTML / 部分运行时）
      const dec = `[${seg}]`; // 解码形式（webpack 运行时 chunk 映射）
      if (outc.includes(enc)) {
        outc = outc.split(enc).join(seg);
        changed = true;
      }
      if (outc.includes(dec)) {
        outc = outc.split(dec).join(seg);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(full, outc, "utf8");
    }
  }
}

console.log("== fix-android-asset-paths: 开始处理 out/ ==");
if (fs.existsSync(CHUNKS)) renameBracketDirs(CHUNKS);
// 任何 _next 下的方括号目录（如 app/book/[book]）一并处理。
renameBracketDirs(path.join(OUT, "_next"));
rewriteFiles(OUT);
console.log(
  `== 完成。重命名的动态段：${renamedSegments.size ? [...renamedSegments].join(", ") : "(无)"} ==`,
);
