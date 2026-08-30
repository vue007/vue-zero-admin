# 核心 E2E 测试

本目录验证前端必须稳定的业务链路，而不是逐页复制实现细节：

- `auth.spec.ts`：表单校验、登录请求契约、令牌持久化和登录后跳转。
- `navigation.spec.ts`：服务端授权菜单、隐藏菜单、激活状态、面包屑和折叠菜单。
- `config-crud.spec.ts`：分页查询、筛选、新增、编辑、行内保存、删除和刷新缓存。
- `appearance.spec.ts`：主题、深浅模式、组件尺寸的持久化，以及跟随系统主题。

`support/mock-api.ts` 提供有状态的 API 模拟器。它保留真实的 Vue、Router、Pinia、Axios 和页面交互，只隔离验证码、数据库、Redis 等外部依赖，使核心测试可以重复运行。

```bash
pnpm test:e2e
```

Playwright 会按 `playwright.config.ts` 自动启动或复用 `127.0.0.1:3001` 的前端服务。首次运行需安装浏览器：

```bash
pnpm exec playwright install chromium
```

新增页面用例时，先把该页面使用的接口加入 `support/mock-api.ts`；测试结束应断言 `state.unhandled` 为空，避免未模拟接口被静默忽略。真实前后端联调和权限隔离测试应作为另一套集成测试运行，不与这里的确定性前端测试混用。
