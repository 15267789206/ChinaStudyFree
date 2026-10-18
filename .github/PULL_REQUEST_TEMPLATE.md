## 变更说明
<!-- 这个 PR 做了什么、为什么做。 -->

## 关联 Issue
<!-- 例如 Closes #123 -->

## 涉及范围
- [ ] 核心算法 / 经济数值（已同步 `packages/core/spec/golden-vectors.json` 并跑双端 golden-vector 测试）
- [ ] 静态导出导航改动（已遵守硬跳转规则，未引入 `<Link>` / `router.push`）
- [ ] 数据 / 题目生成器（已跑 `npm run validate:quizzes`）
- [ ] UI / 组件
- [ ] 服务端 / 原生封装
- [ ] 文档

## 自检
- [ ] `npm run type-check` 通过
- [ ] `npm run lint --workspace=china-study-free` 通过
- [ ] `npm run test --workspace=@cstf/core` 通过（如涉及核心）
- [ ] 已在本地验证功能（注明端 / 系统）

## 风险 / 注意
<!-- 已知风险、向后兼容、需要 reviewer 重点关注的点。 -->
