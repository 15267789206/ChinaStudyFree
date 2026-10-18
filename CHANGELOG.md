# 变更记录 · CHANGELOG

本项目遵循 [Keep a Changelog](https://keepachangelog.com/) 的精神，版本号采用语义化版本（[SemVer](https://semver.org/lang/zh-CN/)）。

## [0.1.0] — 2026-10-18

首个可分发版本。在开源上游 [ChinaStudyFree](https://github.com/caiyanqi/ChinaStudyFree)（小学公益 AI 学习平台）基础上改造为**四端统一 + 四学段**版本。

### 新增
- **四端统一架构**：单一 Next.js 静态导出源码 → Web / Tauri 桌面 / Capacitor 安卓+iOS / Docker，共用 `apps/server` AI 后端。
- **学段框架**：小学（1-6）/ 初中（7-9）/ 高中（10-12）/ 大学（13，按学科课程组织）。
- **12 个学科**：数学 / 语文 / 英语 / 科学 / 道德与法治 / 物理 / 化学 / 生物 / 历史 / 地理 / 思想政治 / 信息技术。
- **多出版社教材体系**：`publishers.ts` 出版社注册表 + publisher-aware bookId，20 本多版本互动课程，教材中心可按版本筛选。
- **教材中心**：接入 [TapXWorld/ChinaTextbook](https://github.com/TapXWorld/ChinaTextbook) 真实目录（1886 本）。
- **互动课程数据生成**：`scripts/gen-*-content.mjs`（含概念题人工编写 + 计算题程序生成，答案由程序保证正确）。
- **桌面系统托盘**：左键唤出 / 关闭最小化到托盘 / 退出回收 AI 子进程 / 子进程静默启动（无黑窗）。
- **TTS 只用项目自己的音源**：预生成 opus + 项目 TTS API（DashScope / 免费 EdgeTTS），移除浏览器 `speechSynthesis`。
- **离线优先**：音视频 / 课本页 / 故事图随包分发；离线部署包 `scripts/package-offline.sh`。
- **双端黄金向量测试**：`packages/core/spec/golden-vectors.json` 为 Web（vitest）与 iOS（XCTest）共享的单一事实源。

### 工程化 / 质量
- `ci.yml`：PR / main 常驻质量门禁（core 测试 + 全 workspace 类型检查 + Web Lint + 数据生成冒烟 + 密钥扫描）。
- `dependabot.yml`：每周自动升级 npm / GitHub Actions / Docker 基础镜像。
- ESLint / Prettier 配置；CONTRIBUTING / SECURITY / CODE_OF_CONDUCT / CHANGELOG / Issue·PR 模板。
- 前端 React 错误边界；服务端结构化日志与安全响应头（X-Content-Type-Options / X-Frame-Options / Referrer-Policy / Permissions-Policy）。

### 修复
- 安卓 WebView 白屏（原生端不注册 Service Worker + 启动清 legacy）。
- 历史阅读进度双端失配（统一 `reading:{kind}:{rawId}` 规范 key 空间）。
- 备份导入「导出→导入」可重复领宝石 / 补心（claimedQuests / lastReviewHeartDate / 今日 XP 从 xpHistory 复原）。

> 数据规模（本版）：**148 本教材 / 2820 节课程 / 7946 道题**。

[0.1.0]: https://github.com/tanle-mtr/ChinaStudyFree/releases/tag/v0.1.0
