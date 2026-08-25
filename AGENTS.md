# 项目协作指南

## 仓库边界与事实来源

- 本仓库是前端 `vue-zero-admin`；相邻的 `../vue-zero-admin-api` 是后端服务，涉及接口、权限、菜单或数据库的改动通常需要同步检查两个仓库。
- `Thesis.pdf` 记录项目的业务目标、设计思路和早期实现，可用于理解背景，但不是当前代码规范。发生冲突时依次以当前源码/配置、后端 `config/init.sql`、论文为准。
- 论文中的 Undertow、Sa-Token、JWT、Caffeine 等描述已经过时；当前后端已升级为 Spring Boot 4、Tomcat、Apache Shiro 与 Redis 会话。不要按论文中的旧代码实现新功能。

## 产品与业务边界

- 项目定位是可扩展的多租户企业后台模板，核心领域为租户/租户套餐、用户、部门、岗位、菜单、角色、数据字典、个人资料与认证。
- 权限模型是 RBAC：用户通过角色获得菜单和按钮权限；角色还带数据范围，后端负责最终授权与租户隔离，前端只负责按授权菜单组织导航和页面入口。
- 论文强调的长期体验目标仍有效：响应式布局、深浅/跟随系统主题、简中/繁中/英文、组件化与 Hooks 化 CRUD。
- 当前实际页面位于 `src/pages/`，已覆盖登录、仪表盘、用户、部门、菜单、角色、字典、租户及部分个人资料。后端和初始化菜单还包含岗位、租户套餐、参数、公告、日志、OSS 等能力，但本仓库未必已有对应页面；开发前先以文件和接口实际存在情况为准。

## 技术栈与目录

- Vue 3.5 + TypeScript 6 + Vite Plus/Vite 8 + Vue Router 5 + Pinia 4。
- UI 使用 Element Plus；样式使用 Sass 与 UnoCSS Wind4；工具优先复用 VueUse 和 es-toolkit。
- `src/api/`：接口函数及请求/响应类型；`src/hooks/`：`useApi`、`useTable`、`useForm`、`usePagination` 等组合逻辑；`src/components/`：`Ze*` 通用表单、表格、弹窗组件。
- `src/pages/**/_views/` 和 `src/pages/**/components/` 是页面内部组件，不会生成路由；跨页面复用组件放 `src/components/`。
- `src/auto-imports.d.ts`、`src/components.d.ts` 与 `eslintrc-auto-import.json` 由 Vite 插件生成，优先修改 `vite/plugins/` 中的生成配置，不手工维护生成内容。

## 路由、菜单与权限

- `vite-plugin-pages` 从 `src/pages/**/*.vue` 自动生成路由，默认元信息是 `{ auth: true, layout: 'base' }`。公开页必须像 `src/pages/login/index.vue` 一样显式覆盖为 `auth: false` 和 `layout: 'blank'`。
- `/` 固定重定向到 `/dashboard`。布局由 `App.vue` 根据 `route.meta.layout` 在 `BaseLayout`/`BlankLayout` 间切换。
- 登录后 `src/stores/base.module.ts` 请求 `/system/menu/getRouters`，以服务端菜单构建侧栏，并删除未授权的自动路由。新增受保护页面时必须同时核对：
  - 页面文件生成的 URL；
  - 后端 `sys_menu.path/component` 转换后的 URL；
  - 控制器的权限串（惯例为 `system:<resource>:<action>`）；
  - 角色与菜单关联种子/迁移。
- 不要把前端路由裁剪当作安全边界；按钮级和数据级权限仍必须由后端校验。
- `route.meta.isTab` 会影响页面缓存 key 与菜单激活逻辑；改动标签页路由时同时检查 `BaseLayout.vue`、`VTabPage.vue` 和面包屑生成。

## 前后端接口约定

- 开发服务运行在 `3001`，Vite 将 `/api` 去前缀后代理到 `http://localhost:8080/`。生产和测试环境同样以 `/api` 为基础路径，实际反代由部署环境提供。
- 普通响应统一为 `{ code, msg, data }`，成功业务码为 `200`；分页响应的 `data` 为 `{ rows, total }`，前端拦截器补回请求使用的 `pageNo/pageSize`。
- 接口函数放入对应的 `src/api/<domain>.api.ts`，请求/响应类型放相邻 `*.type.ts`/`*.types.ts`，并按需从 `src/api/_index.ts` 暴露。不要在页面内直接创建新的 Axios 实例。
- 登录请求必须包含 `tenantId`、`clientId`、`grantType`、验证码 `code/uuid` 及具体认证字段。`VITE_APP_CLIENT_ID` 必须与后端 `sys_client.client_id` 一致。
- access token 存在 localStorage 的 `Admin-Token`，受保护请求使用 `Authorization: Bearer <token>`；请求还携带 `clientid` 和当前语言 `lang`。401 会清空本地存储并跳转登录页。
- 后端全局接口加密配置当前开启，但登录控制器上的 `@ApiEncrypt` 已注释，前端的 `encrypt-key` 常量也未形成完整加密链路。不要在未同时验证前后端协议的情况下单方面启用加密。

## 页面与 CRUD 实现约定

- 优先沿用现有组合：`useForm` 构造表单数据/规则，`useTable` 处理分页列表，`useApi` 处理 loading、提示和回调，`useModal` 管理弹窗。
- 列表页优先复用 `ZeTable`、`ZeTableColumn`、`ZePagination`、`ZeActions`；表单优先复用 `ZeForm`、`ZeFormItem`、`ZeInput`。新增抽象前先确认现有组件无法表达需求。
- 使用 `<script setup lang="ts">`；仅在 TSX 能显著简化内部渲染片段或复杂组件时使用 `lang="tsx"`。
- Vue、Router、Pinia、Element Plus API 大量由自动导入提供。判断是否需要显式 import 前先查看 `vite/plugins/auto-import.ts` 和已有同类文件。
- 公共文案放 `src/i18n/`；页面局部文案可使用 SFC `<i18n>`。新增用户可见文本时至少考虑 `zh-CN` 和英文，不要继续扩散已有的硬编码文案。
- 深浅配色通过 `data-scheme`、`data-size` 与 `src/styles/theme/` 工作；响应式断点来自 `vite/config/breakpoints.ts`。优先沿用这些变量和 UnoCSS 规则。

## 数据语义速查

- 默认租户号为 `000000`；常见状态 `0` 表示正常/显示/存在，`1` 表示停用/隐藏/删除，具体仍以字段类型和后端枚举为准。
- 菜单类型：`M` 目录、`C` 页面菜单、`F` 按钮权限；`perms` 与后端 Shiro `@RequiresPermissions` 字符串对应。
- 角色数据范围：`1` 全部、`2` 自定义部门、`3` 本部门、`4` 本部门及以下、`5` 仅本人。前端只负责配置和展示，不复制后端的数据过滤逻辑。
- 部门是树结构（`parentId`/`ancestors`），菜单也是树结构（`parentId`）；删除和停用操作必须保留现有的子节点/关联对象校验与确认交互。

## 本地开发与验证

```bash
pnpm install
pnpm dev
pnpm type-check
pnpm build:dev
pnpm build:prod
pnpm test:e2e
```

- 包管理器以 `package.json` 声明的 pnpm 11 为准，并使用 Node.js 22.13 或更高版本；不混用 npm/yarn 修改锁文件。
- `pnpm lint` 带 `--fix`，会直接改文件；只想检查差异时先运行 `pnpm type-check`，并在 lint 后复查 `git diff`。
- E2E 使用 Playwright，要求前端 `127.0.0.1:3001`、后端 `8080`、PostgreSQL 和 Redis 均已就绪。当前登录用例会从 stdin 人工读取验证码，不适合作为无人值守 CI 用例，修改时优先为测试环境提供可重复的验证码策略。
- 修改接口类型或页面逻辑：至少运行 `pnpm type-check`；修改构建、路由、自动导入、样式：再运行相应模式的 `pnpm build:*`；修改关键用户流程：补充/运行 Playwright 用例。

## 安全与提交卫生

- 不在源码、测试、日志或 `AGENTS.md` 中新增真实密码、私钥、访问令牌。现有环境文件中的客户端 ID 不是用户凭据，但必须与后端种子数据同步；第三方 token 应迁移到本地忽略文件或部署密钥。
- 不提交 `dist/`、Playwright 运行产物、日志、IDE 文件或临时 PDF 解析产物。
- 跨仓库改动应在交付说明中明确列出前端、后端、SQL 三处是否需要同步部署或初始化。
