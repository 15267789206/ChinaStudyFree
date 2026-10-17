# 聪聪学堂 v0.1.0 — 四端 · 四学段 免费公益 AI 学习平台（首个公开发行版）

把开源公益项目改造为 **四端统一**（Web / Windows 桌面 / 安卓 / iOS）+ **四学段**（小学 / 初中 / 高中 / 大学）的免费 AI 学习平台。
**MIT 许可证，永久免费、无广告、无内购、不收集隐私。**

## ✨ 核心特性

| | |
|---|---|
| 📚 **内容规模** | **148 本教材 · 2,820 节互动课程 · 7,946 道题** |
| 🎓 **四学段** | 小学 1-6 · 初中 7-9 · 高中 10-12 · 大学（按学科/课程组织）|
| 📖 **多出版社** | 人教 / 统编 / 北师大 / 苏教 / 沪教 / 外研 / 译林 / 浙教 / 教科 / 高教社 / 清华社等 13 家，支持按科目选教材版本 |
| 🔊 **免费 TTS** | 三级音源：DashScope（有 Key）→ **免费 EdgeTTS（零 Key，联网即可）** → 静默降级；全站语音朗读 |
| 🤖 **AI 能力** | 单元小测出题 / 知识讲解 / 课外故事生成 / 课本配图（未配 Key 时优雅降级为离线内容，不影响学习）|
| 🎮 **游戏化** | 经验 / 连胜护盾 / 宝石 / 装扮商店 / 每日任务 / 成就墙 / 错题本 SRS 复习 |
| 🌙 **深色模式** | 跟随系统 / 亮 / 暗三态 |
| 💾 **数据互通** | 存档导出 / 导入，手机电脑互通 |
| ☕ **打赏支持** | 完全自愿、不影响任何功能（README 与「我的主页 → 打赏支持」）|

## 📦 下载

| 文件 | 平台 / 用途 | 大小 |
|---|---|---|
| `ChinaStudyFree-Setup-0.1.0-x64.exe` | Windows 安装版（NSIS，推荐） | 56.3 MB |
| `ChinaStudyFree-Setup-0.1.0-x64.msi` | Windows 安装版（MSI，企业/机房批量部署） | 90.0 MB |
| `ChinaStudyFree-Portable-0.1.0.zip` | Windows 便携版（解压即用，免安装） | 109.2 MB |
| `ChinaStudyFree-Android-release.apk` | 安卓 release（已签名，可侧载） | 43.5 MB |
| `ChinaStudyFree-Android-release.aab` | 安卓 App Bundle（用于上架 Google Play） | 43.4 MB |
| `ChinaStudyFree-Offline-Bundle-0.1.0.zip` | 校园内网 / 离线部署（跨平台，含启动脚本） | 42.1 MB |

> 源码 zip / tar.gz 由 GitHub 按 tag 自动生成。
> iOS 工程、Docker 镜像与 Linux AppImage/deb：见 [.github/workflows/build-installers.yml](.github/workflows/build-installers.yml) 与 README 第八节（本机缺 macOS / Docker，由 CI 产出）。
> 注：GitHub 会去除资产文件名中的非 ASCII 字符，故下载文件使用英文名；产品名称仍为「聪聪学堂」。

## 🔧 本次修订（安卓，2026-10-17）

- **修复「主界面没有图标」**：自适应启动图标原来是**白底 + 白色前景**（Capacitor 默认模板），在浅色桌面上完全看不见。现改为**品牌绿 `#58A700` 底 + 白色「聪」字标**（含圆角方形 / 圆形两套、5 档密度）。
- **修复「选择学段无法确定」**：首启引导页的「继续」按钮原先被**底部固定导航栏盖住**（同层级、DOM 靠后）导致点不到；已提升引导层叠层级，并顺带把「学段 → 教材版本 → 年级」全流程改为一律硬跳转（规避静态导出在 WebView 下的偶发软导航 404）。
- 安卓 APK / AAB 已重新构建签名并替换（版本号仍为 0.1.0）。

## 🔧 本次修订（全端，2026-10-17 · 第二弹）

- **根除静态导出下的软导航 404（整类问题）**：上一轮只改了引导流程，本轮把**剩余全部** `next/router` 软导航与 `<Link>` 统一改为原生 `<a>` / `window.location.assign` 硬跳转 —— 覆盖底部/侧边导航、宝石徽章、排行榜卡、继续学习卡、切换教材、课程开始弹窗、课程 runner 的全部退出/完成/失败出口、知识手册、跳级测试、错题复习、故事阅读器、商店返回等共 15 个文件。 Capacitor WebView（安卓/iOS）与 Tauri WebView 下不再有点了没反应 / 404 的入口。
- **AI 出题接口容错**：`generateQuiz` 原先不判断 HTTP 状态直接解析 JSON，遇到代理 502 / 静态兜底页等非 JSON 响应会抛意义不明的 `SyntaxError`；已改为先判状态、友好报错（与语音合成接口行为对齐）。
- **服务端类型检查零错误**：为运行时依赖 `ws` 补最小类型声明（仅 tsc 使用，esbuild 打包擦除，运行时产物不变）。
- 四端产物（Windows 安装/便携、安卓 APK/AAB、离线部署包）均已用最新代码重新构建替换（版本号仍为 0.1.0）。

## 🔐 SHA256 校验和

```text
47132fb348ca90271adadbe515c67d3c32b0e39fb782a34c4e578fbdeef5471c  ChinaStudyFree-Setup-0.1.0-x64.exe
e4cee449742cb94bb8ebc43da645b8f1664b8517d7915e0fa9772db3112a99af  ChinaStudyFree-Setup-0.1.0-x64.msi
3294d7a9471e2a5e0f0df867abbe98efcbaecf48de8a15e317112ca2fb8af201  ChinaStudyFree-Portable-0.1.0.zip
950b4a7ee3fc7626b90cb062879172588528da572cf69040d93e92b8975391eb  ChinaStudyFree-Android-release.apk
47855b3df3a7e3ede45f611a055a2816f8e45e9cefef21c7c40ff6b48d0c45fc  ChinaStudyFree-Android-release.aab
fdb7426cc64347fdbc871ac2178d3e592748f0558d781c59f68c0ef99e0b8746  ChinaStudyFree-Offline-Bundle-0.1.0.zip
```

## 🚀 快速开始

**Windows 安装版**：双击 exe → 按向导安装 → 启动「聪聪学堂」。**无需任何配置即可开始学习**；语音朗读默认走免费 EdgeTTS（需联网）。

**Windows 便携版**：解压 zip → 双击 `启动聪聪学堂.bat`。

**安卓**：侧载 APK（设置里允许未知来源）。

**离线部署包（校园内网）**：解压 → 运行 `start.sh`（Linux/macOS）或 `start.ps1`（Windows）→ 全校设备浏览器访问 `http://该机IP:8787`。

**想要更高级音质 / 完全离线语音**：把包里的 `.env.example` 改名为 `.env`，填入 `DASHSCOPE_API_KEY` 后重启；预生成音频见 README「重新生成预生成音频」。

## 🛠️ 技术栈

- **Web**：Next.js 15 静态导出 · React · Tailwind · Zustand · framer-motion
- **桌面**：Tauri v2（内嵌 Node AI 服务 + 系统托盘，× 最小化到托盘）
- **移动**：Capacitor 6（安卓 / iOS 共用同一套 Web 源码）
- **服务端**：Node + Express，esbuild 打包为**自包含单文件**（零 node_modules 依赖）
- **TTS**：DashScope CosyVoice / **微软 EdgeTTS（完整移植 Sec-MS-GEC v2 令牌算法，零 Key 免费兜底）**
- **数据管线**：148 本教材互动课程由仓库内脚本生成（`npm run gen:content`，增量 + 覆盖写），`npm run validate:quizzes` 全量校验题目质量

## 📜 许可证与致谢

**MIT**（见 [LICENSE](LICENSE)）。

- 前端改编基于 [ChinaStudyFree](https://github.com/caiyanqi/ChinaStudyFree)
- 教材结构数据来自 [TapXWorld/ChinaTextbook](https://github.com/TapXWorld/ChinaTextbook)（开源教材库，仅供学习使用；题目均为 AI 原创，不搬运教材原题）
- 免费语音兜底基于 [edge-tts](https://github.com/rany2/edge-tts)（MIT）的方案，使用微软 Edge 朗读公共服务，请遵守微软服务条款

## 💌 写在最后

我们相信：**每一个中国孩子，无论身处北上广深，还是大山深处的乡村小学，都应该拥有一样好的学习资源。**

如果认同这个理念，欢迎 ⭐ Star，也欢迎把它转发给任何一位你认识的老师和家长。

**让每一个中国孩子，都能在玩中学。**
