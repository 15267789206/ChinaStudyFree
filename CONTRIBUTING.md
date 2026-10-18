# 参与贡献 · CONTRIBUTING

感谢你愿意为「聪聪学堂 / ChinaStudyFree」这个**免费、公益、无广告**的儿童学习项目出力。本文档说明如何搭建开发环境、需要遵守的代码规约，以及提交 PR 的要求。

---

## 一、开发环境

要求 **Node.js 22**（与 CI 一致）、npm 9+。

```bash
git clone <你的 fork>
npm install

# 生成前端数据（output/ → public/data）
npm run build:data

# 抓取教材目录（可选，首次需要）
npm run sync:textbooks

# 本地前端开发
npm run dev:web                 # http://localhost:3000

# 本地 AI 后端（可选，需要 Key 才有真实生成能力）
cp .env.example apps/server/.env
npm run dev:server              # http://localhost:8787
```

其余构建 / 四端打包命令见 [README.md](README.md) 第五节与 [CHANGELOG.md](CHANGELOG.md)。

---

## 二、仓库结构速览

| 路径 | 职责 |
| --- | --- |
| `packages/core` | 跨端纯 TS 核心：判分 / 经济 / 学段 / 阅读 / SRS / 联赛 / 备份；`spec/golden-vectors.json` 是 **Web 与 iOS 双端共享的黄金向量** |
| `apps/web` | Next.js 前端（静态导出），单一源码，四端共用 |
| `apps/server` | Express AI 后端（LLM / TTS / 配图），四端共用，自包含单文件部署 |
| `apps/desktop` | Tauri v2 桌面封装（内嵌 Node AI 服务） |
| `apps/mobile` | Capacitor 6 安卓 / iOS 封装 |
| `scripts` | 数据生成 / 教材目录抓取 / 离线包 / 图标生成 |

---

## 三、必须守住的代码规约

这些规约来自踩过的坑，违反会导致**静默的双端失配或真机白屏**，请务必遵守：

1. **双端黄金向量一致性（最重要）**
   `packages/core/src/{league,quests,reading,week,srs,backup,economy,chestLogic,grade}.ts` 是确定性经济/算法的**单一事实源**。iOS `upstream/apps/mobile/ChinaTextbookStudy/Domain/*.swift` 必须**逐字镜像**（名池同序、常量同值、取模偏移同值、算法同构）。
   - 任何数值改动必须同步到 `packages/core/spec/golden-vectors.json`。
   - **两端都必须有测试**：core 有 `vitest`（`packages/core` → `npm run test`），iOS 有 `GoldenVectorTests.swift`（读取同一份 JSON）。改了核心算法后，双端测试必须都过。

2. **静态导出下的导航（规则 #18）**
   原生端（Tauri / Capacitor WebView）下，`next/link` 与 `router.push` 偶发 404。组件内用 `window.location.assign`、服务端组件用 `<a href>` 做硬跳转。**新增导航一律硬跳转**，禁止引入 `<Link>` / `router.push`。

3. **bookId 禁非 ASCII**
   中文 bookId 进 URL / 文件路径会导致静态导出时路由拿到未解码的 `%E7%...` 而 ENOENT。大学课程用 `COLLEGE_SLUGS` 映射英文 slug；非默认出版社插 ASCII 短标识。

4. **题目三定律**（`scripts/validate-quizzes.mjs` 固化，CI 会跑）
   - choice 的 `answer` 必须严格等于某 `option`；
   - `options` 不得重复；
   - true_false 的 `answer` 只能是「对 / 错」。
   写生成器后务必先 `node --check` 再 `npm run validate:quizzes`。

5. **上游题库 id 可重复**
   同一段内 `unit_test` / `exam` 两段 id 各自从 1 编号。按 id 改题必须用 `filter` 出全部再按内容识别，**绝不能用 `find`**（会静默漏改第二条）。

6. **题目 / 数据生成器是「增量 + 覆盖写」**
   **禁止通配删除 `output/`**（会丢小学原始题库副本）。

7. **风格**：TS 用 TypeScript strict；前端用 Prettier（`.prettierrc.json`）+ ESLint（`next lint`）。提交前请保证 `npm run type-check` 与 `npm run lint` 干净。

---

## 四、提交与 PR 流程

- 从 `main` 切出功能分支（`feat/...`、`fix/...`）。
- 提交信息中文即可，说明「为什么改」而非「改了什么」。
- **PR 必须通过 CI**（`ci.yml`：core 单元测试 + 全 workspace 类型检查 + Web Lint + 数据生成冒烟 + 密钥扫描）。
- 涉及核心算法 / 经济数值的改动，必须在 PR 描述里说明 golden-vectors.json 的同步与双端测试结论。
- 发版走 `build-installers.yml`（推送 `v*` tag 或手动 `workflow_dispatch`），产物见 [Releases](https://github.com/tanle-mtr/ChinaStudyFree/releases)。

---

## 五、遇到问题

- 功能 / Bug：提 Issue（见模板）。
- 安全 / 隐私：请走 [SECURITY.md](SECURITY.md) 的私有渠道，**不要公开提 Issue**。
