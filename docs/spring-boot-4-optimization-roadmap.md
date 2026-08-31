# Spring Boot 4 后端优化路线图

> 状态：待规划，暂不实施  
> 记录日期：2026-08-31  
> 适用仓库：前端 `vue-zero-admin`、后端 `../vue-zero-admin-api`

## 1. 背景与目标

当前后端已经升级到 Java 26、Spring Boot 4.1.1、Spring MVC/Tomcat、Apache Shiro 3、PostgreSQL 18、MyBatis-Plus、Redis/Redisson，并接入 Spring Boot Admin、SnailJob、SSE 等能力。

后续优化不以继续追逐框架版本为主要目标，而应优先提高：

- 生产配置和接口安全性；
- 多租户与数据权限的可验证性；
- 数据库迁移、查询性能和缓存一致性；
- 指标、日志和链路追踪能力；
- 自动化测试、交付和容器运行质量。

本文仅沉淀待办和验收口径。正式实施前，应重新检查当时源码、依赖版本和生产环境现状。

## 2. 当前已确认的关键现状

- 父 POM 使用 Spring Boot 4.1.1、Java 26，且 `skipTests` 默认为 `true`。
- `application.yml` 暴露全部 Actuator 端点，健康详情设置为 `ALWAYS`。
- `application-prod.yml` 中 p6spy 仍开启，并存在数据库、Redis 默认账号密码。
- API 加密配置处于开启状态，但前端与登录接口尚未形成完整、可验证的加密协议。
- 全局异常处理会把部分 `Exception#getMessage()` 直接返回客户端。
- Caffeine + Redis 二级缓存缺少明确的跨实例本地缓存失效机制。
- 数据库主要依赖 `init.sql` 和手工迁移文件，尚未引入 Flyway/Liquibase。
- 后端约有 25 个 Controller、21 个 Service 实现，但当前测试文件较少。
- Docker 镜像使用完整 JDK，容器默认用户、`privileged` 和 host network 仍可收紧。

## 3. 优化任务清单

### P0：生产安全与稳定性

#### SB4-001 收紧 Actuator、OpenAPI 和 Scalar

- 生产环境仅暴露必要端点，建议限定为 `health`、`info`、`prometheus`。
- 健康详情改为 `when-authorized`。
- 管理端点使用独立端口、内网或反向代理访问控制。
- 生产环境按需关闭 OpenAPI/Scalar，或增加管理员认证。

验收标准：匿名公网请求无法读取环境、配置、Bean、日志和详细健康信息。

#### SB4-002 外置生产凭据和密钥

- PostgreSQL、Redis、监控、SnailJob、OSS 和第三方登录凭据全部改为环境变量或部署 secrets。
- 生产必填变量不提供弱口令默认值，缺失时启动失败。
- 移除源码中的示例私钥，制定密钥轮换方式。

验收标准：被跟踪文件中不存在生产密码、私钥或可直接启用的弱口令。

#### SB4-003 关闭生产 p6spy

- 仅在本地或诊断 profile 开启 p6spy。
- 生产慢 SQL 使用 PostgreSQL、Micrometer 或可观测平台分析。

验收标准：prod profile 中 p6spy 关闭，正常 SQL 不再输出敏感参数。

#### SB4-004 统一安全异常响应

- 业务异常、参数异常、认证异常和系统异常分层处理。
- 未知异常仅返回稳定错误码、通用文案和 request/trace ID。
- 完整异常只记录于服务端，并对敏感字段脱敏。
- 保持现有 `{ code, msg, data }` 响应契约，避免前端破坏性变更。

验收标准：数据库、Redis 或程序内部异常不会向客户端暴露 SQL、路径、类名和堆栈细节。

#### SB4-005 明确 API 加密方案

- 若 HTTPS 已满足需求，暂时关闭不完整的自定义 API 加密。
- 若业务要求保留，则完成密钥外置、轮换、登录兼容、前端解密和自动化测试。

验收标准：配置状态与实际协议一致，不存在“看似开启但部分接口未参与”的状态。

### P1：数据库与多租户治理

#### SB4-101 引入 Flyway

- 为现有数据库建立 baseline。
- 后续表结构、索引、菜单、权限、字典和客户端种子均使用版本迁移。
- `config/init.sql` 只用于空库初始化，不作为已有环境升级脚本。
- CI 验证迁移可从空库执行，并记录生产迁移与回滚步骤。

验收标准：任意支持版本的数据库可按版本顺序升级，迁移历史可审计。

#### SB4-102 查询和索引专项治理

- 采集慢 SQL 与高频 SQL。
- 重点检查 `tenant_id`、`del_flag`、`status`、关系表外键列、`parent_id`、日志时间字段的组合索引。
- 使用 `EXPLAIN (ANALYZE, BUFFERS)` 验证，不凭字段直觉添加索引。
- 检查分页深翻页、树查询、批量导入和 N+1 查询。

验收标准：核心接口建立性能基线，优化前后有可复现的执行计划和耗时数据。

#### SB4-103 数据库连接池容量规划

- 采集 Hikari active、idle、pending、获取连接耗时和事务耗时。
- 根据 PostgreSQL 最大连接数、应用实例数和后台任务共同分配连接预算。
- 虚拟线程压测必须包含连接池饱和场景。

验收标准：峰值负载下无持续等待连接，且不会耗尽数据库总连接数。

#### SB4-104 多租户和数据范围安全测试

- 覆盖列表、详情、导出、修改、删除和关系绑定的跨租户访问。
- 覆盖超级管理员、租户管理员、普通用户及五种角色数据范围。
- 对租户排除表和 `DataPermissionHelper.ignore` 建立专项审查。

验收标准：仅修改请求中的 `tenantId`、业务 ID 或关联 ID 无法越权访问其他租户数据。

### P1：缓存一致性

#### SB4-201 修复 Caffeine + Redis 跨实例失效

- 明确一级缓存的 TTL、容量和适用数据类型。
- 修复 `clear()`、`invalidate()` 未清理对应本地缓存的问题。
- 使用 Redis Topic/事件广播各实例清理 Caffeine，或对权限类数据取消一级缓存。
- 缓存 key 明确包含租户维度。
- 增加命中率、加载耗时、失效次数和脏读风险监控。

验收标准：任意实例修改权限、菜单、字典或参数后，其他实例在约定时间内读取到新值。

### P1：可观测性

#### SB4-301 建立指标、日志和追踪体系

- 接入 Micrometer Prometheus registry。
- 采集 HTTP、Tomcat、JVM、Hikari、Redis、任务和关键业务指标。
- 使用 Micrometer Tracing/OpenTelemetry 打通 HTTP、数据库、Redis、OSS 等调用链。
- 日志统一携带 traceId、spanId、requestId，敏感信息脱敏。
- 为登录、动态菜单、用户分页等关键流程定义 SLO。
- 避免将 userId、tenantId 等高基数字段直接作为 Prometheus 标签。

验收标准：一次失败请求可从告警定位到指标、链路和对应日志。

### P2：线程、测试与部署

#### SB4-401 评估虚拟线程

- 对比平台线程与 `spring.threads.virtual.enabled=true` 的吞吐、延迟和资源占用。
- 检查 JDBC、Redis、Shiro、Excel、OSS SDK 的阻塞与 pinning 情况。
- 验证登录态、租户和数据权限 ThreadLocal 的传播及清理。
- 重要异步任务使用 SnailJob 或持久化事件，避免只依赖进程内 `@Async`。
- 异步异常使用结构化日志和指标处理，不使用 `printStackTrace()`。

验收标准：依据压测数据决定是否启用，不因线程数增加压垮数据库或 Redis。

#### SB4-402 建立可信测试基线

- CI 显式使用 `-DskipTests=false`，逐步取消父 POM 默认跳过测试。
- 使用 Testcontainers 覆盖 PostgreSQL 和 Redis 集成测试。
- 为认证、RBAC、租户、数据权限、缓存失效和统一异常响应补测试。
- 使用 MockMvc 做接口测试，按需引入 ArchUnit 约束模块依赖。
- 增加 OpenAPI 契约检查，避免前后端类型漂移。

验收标准：关键安全与登录流程可无人值守重复执行，CI 失败会阻止发布。

#### SB4-403 容器与运行时加固

- 使用 JRE 或 `jlink` 运行时，评估 Spring Boot 分层 Jar。
- 使用非 root 用户运行应用。
- 添加 readiness、liveness 和优雅停机配置。
- 移除不必要的 `privileged` 和 host network。
- 配置资源限制，将应用日志输出到 stdout。
- PostgreSQL、Redis 和应用通过容器服务名通信。

验收标准：容器以非 root 身份运行，能够优雅下线，并通过健康检查参与流量调度。

## 4. 建议实施批次

### 第一批：低风险高收益

- SB4-001 Actuator/OpenAPI 收紧
- SB4-002 凭据外置
- SB4-003 生产关闭 p6spy
- SB4-004 异常响应安全化
- SB4-005 明确 API 加密状态

### 第二批：数据可靠性

- SB4-101 Flyway
- SB4-104 多租户安全测试
- SB4-201 缓存一致性
- SB4-402 测试基线

### 第三批：性能与运维

- SB4-102 SQL/索引治理
- SB4-103 连接池规划
- SB4-301 可观测性
- SB4-403 容器加固

### 第四批：实验性优化

- SB4-401 虚拟线程评估

## 5. 暂不建议优先投入

- GraalVM Native Image：当前 MyBatis XML、Shiro、Redisson、EasyExcel、动态数据源及反射生态会带来较高 AOT 维护成本。
- 为追求“新技术”将 Spring MVC 整体改为 WebFlux：现有 JDBC/MyBatis 技术栈仍是阻塞式，整体迁移收益有限。
- 单纯提高 Tomcat 线程数或 Hikari 连接数：缺少指标和压测前容易转移或放大瓶颈。
- 大规模替换现有统一响应模型：应优先保持前后端接口兼容。

## 6. 正式启动前的检查清单

- [ ] 重新确认 Spring Boot、Java、Shiro、MyBatis-Plus、Redisson 当前版本。
- [ ] 读取最新生产配置，但不把凭据写入任务或日志。
- [ ] 记录关键接口性能和错误率基线。
- [ ] 确认前端、后端、SQL、部署配置的影响范围。
- [ ] 每项优化单独建立任务、迁移步骤、验收标准和回滚方案。
- [ ] 涉及权限、租户、菜单或客户端配置时安排前后端联调。

