# L0-bus 05 测试方案 Step 8: 测试环境与配置矩阵

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 8 中间产物。
> 本步定义测试环境、依赖服务、配置 profile、测试协作方式和环境不可用处理。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 8 |
| 主题 | 设计测试环境与配置矩阵 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §8 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 已确认 | 提取用例矩阵、自动化候选和 P0 / P0-min 覆盖范围 |
| `05_test_plan_step_07_test_data.md` | 已确认 | 提取测试数据、fixture、run_id、fake / stub / real-like 策略 |
| `03-详细设计.md` §13 | 已完成 | 提取配置绑定点、外部依赖绑定和禁止配置化边界 |
| `04-配置设计.md` §6 | 已完成 | 提取 local-dev、ci-test、integration-test、operations-recovery、staging-like、production-like profile |
| `04-配置设计.md` §7~§12 | 已完成 | 提取配置项、敏感配置、加载校验、失效模式和下游测试承接 |

---

## 3. SOP 问题回答

### 3.1 local / CI / integration / staging 分别测什么?

| 环境 / profile | 当前测试定位 | 是否 P0 阻断 |
|---|---|---|
| local-dev | 本地开发 smoke、单测、少量 service / API 手动验证 | 否,用于开发反馈 |
| ci-test | unit、service、contract、config unit、redaction smoke、in-memory integration | 是,阻断 PR |
| integration-test | repository / adapter / worker / job / runtime graph 的跨模块集成 | 是,阻断 PR 或 main CI |
| operations-recovery | retry、DLQ、replay preparation、projection rebuild、backend capability job | 是,阻断 main CI / release |
| staging-like | 后续 real-like adapter 和 durable store 演练 | 否,当前 P1 专项 |
| production-like | 后续生产部署验证和运维演练 | 否,当前不进入 P0 测试 |

### 3.2 每个环境依赖哪些服务?

| 环境 / profile | 依赖服务 | 当前实现方式 |
|---|---|---|
| local-dev | L0-core contracts、in-memory store/backend/publisher、fixture source | path dependency + in-memory / fixture |
| ci-test | L0-core contracts、fake source、fake backend、fake publisher、fake secret provider | path dependency + fake adapters |
| integration-test | fake L0-core outbox source、in-memory constrained store、fake backend、in-memory sink | fake runtime graph |
| operations-recovery | in-memory recovery store、fake audit chain、fake approval ref、fake backend capability | fake recovery runtime |
| staging-like | durable store、MQ backend、secret provider、real-like publisher | P1,后续专项 |
| production-like | production MQ / DB / KMS / observability | P1/P2,不进入当前测试 |

### 3.3 哪些 feature flag / config 影响测试结果?

本项目配置设计不以 feature flag 为主,而是以严格 JSON config 和 profile 控制测试路径。

| 配置组 | 影响的测试 | P0 测试要求 |
|---|---|---|
| `store.kind` | repository、UoW、一致性 | P0 使用 `in_memory`,验证 unique / expected version |
| `outbox_source.kind` | outbox relay | P0 使用 `in_memory_fixture`,验证 committed fact / duplicate |
| `transport_backend.kind` | delivery / backend boundary | P0 使用 `in_memory`,验证 unavailable / unsupported |
| `publisher.kind` | outbound event / evidence | P0 使用 `in_memory_sink`,可注入 retryable failure |
| `api.enabled` | API / contract tests | API suite 使用 `true`,纯 service suite 可不启动 |
| `worker.enabled` | worker consumer tests | worker suite 显式开启 |
| `jobs.batch_size` / `jobs.cursor_profile` | job runner / recovery | operations suite 使用可复现 cursor |
| `projection.kind` / `projection.consistency_marker` | read-only output | P0 使用 in-memory projection 且 marker required |
| `recovery_policy.*` | retry / DLQ / replay | P0 固定 explicit DLQ、audit chain required |
| `security_boundary.*` | payload / secret / projection truth / redaction | P0 必须固定 reject / ref_only / required |
| `clock.kind` / `id_generator.kind` | 数据可重复性 | test profile 可用 fixed / deterministic |

### 3.4 哪些依赖需要 mock 或 fake?

| 依赖 | 测试替身 | 原因 |
|---|---|---|
| L0-core committed outbox source | fake fixture source | 只测 committed fact 接缝,不测业务仓 |
| transport backend / MQ | fake / in-memory backend | P0 只验证 port 语义和失败注入 |
| outbound event bus / publisher | in-memory sink | 验证 schema、receipt、retryable failure evidence |
| bus durable store | in-memory constrained store | 验证 repository 约束,不依赖外部 DB |
| secret / connection provider | fake provider | 验证 ref-only、unavailable 和 fail-closed |
| observability / governance / SDK | fake consumer / snapshot | 只测只读输出接缝 |

### 3.5 环境不可用时如何处理?

| 环境 / 依赖 | 不可用处理 | 是否允许跳过 |
|---|---|---|
| L0-core path dependency | 编译失败,阻断 PR | 否 |
| ci-test fake runtime | 测试失败,阻断 PR | 否 |
| integration-test fake backend / source | 测试失败,阻断 PR / main CI | 否 |
| operations-recovery profile | 测试失败,阻断 release | 否 |
| staging-like real-like adapter | 标记 P1 环境不可用,进入残余风险 | 是,当前 P0 可跳过 |
| production-like services | 不运行当前测试 | 是,不属于 P0 |

### 3.6 哪些依赖是编译期依赖,可用 path dependency?

| 依赖 | 类型 | 当前策略 |
|---|---|---|
| `L0-core` shared contracts | `[compile]` | 使用 `/home/aris/Projects/quantalithos-core` 的本地 path dependency |
| bus 内部 crate | `[compile]` | workspace 内 `contracts / domain / application / infra / api / worker / jobs` 相互引用 |
| test helper / fixture crate | `[compile]` | 当前仓内部测试辅助模块或 dev-dependency |

### 3.7 哪些依赖是运行期依赖或事件协作依赖?

| 依赖 | 类型 | 当前策略 |
|---|---|---|
| committed outbox source | `[event]` | fake fixture source 或 event replay |
| transport backend | `[runtime]` | in-memory / fake backend |
| outbound event publisher | `[event]` | in-memory sink + failure injector |
| store / UnitOfWork | `[runtime]` | in-memory constrained store |
| secret / connection provider | `[runtime]` | fake provider |
| observability / governance / SDK consumers | `[event]` / `[runtime]` | snapshot / fake consumer,不启动下游完整服务 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `05` 未区分环境 | 只说测试环境,未说明 local / CI / integration / recovery | 自动化门禁无法稳定落地 | 本步建立环境矩阵 |
| 编译期和运行期依赖混淆 | 容易把所有依赖都写成 path dependency | 运行期事件协作无法测试 | 本步区分 `[compile]`、`[runtime]`、`[event]` |
| 配置 profile 未映射到用例 | `04` 已定义 profile,测试方案未承接 | 用例无法确定使用哪份配置 | 本步建立配置矩阵 |
| P1 staging-like 边界不清 | 容易把真实 MQ / DB 拉入 P0 | P0 测试不稳定 | 本步把 staging-like 标为 P1 专项 |
| 环境不可用处理缺失 | 依赖失败时不知道跳过还是阻断 | CI 结果不可裁决 | 本步定义 fail / skip 策略 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 环境 | 只有笼统测试环境 | local-dev / ci-test / integration-test / operations-recovery / staging-like / production-like | 可执行 |
| 依赖 | 未分类 | `[compile]` / `[runtime]` / `[event]` | 避免 path dependency 滥用 |
| 配置 | 未与用例绑定 | profile 与 suite / 用例 / 配置组对应 | 可定位 |
| fake 策略 | 分散在数据设计 | 环境层统一说明 fake / fixture / replay | 可复用 |
| 不可用处理 | 不清晰 | P0 阻断,P1/P2 可跳过并记录风险 | 可裁决 |

---

## 6. 测试设计取舍

### 6.1 是否在 P0 使用真实 MQ / DB 环境

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. P0 使用真实 MQ / DB | 更接近生产 | 不稳定,超出当前 P0 | 不采用 |
| B. P0 使用 in-memory / fake,后续 staging-like 做 P1 专项 | 可复现,符合配置设计 | 不证明真实产品行为 | 采用 |
| C. 全部 mock service 返回值 | 快 | 无法验证 repository / adapter / worker 接缝 | 不采用 |

### 6.2 是否所有跨仓依赖都用 path dependency

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 所有依赖都 path dependency | 配置简单 | 运行期 / 事件协作被误建模 | 不采用 |
| B. 只有编译期契约用 path dependency,运行期和事件协作用 fake / replay | 边界准确 | 需要维护测试替身 | 采用 |
| C. 不使用 path dependency | 隔离强 | L0-core 契约无法编译期对齐 | 不采用 |

### 6.3 是否把 staging-like 写入当前阻断门禁

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. staging-like 阻断当前 release | 提前暴露生产化问题 | 把 P1 拉入 P0 | 不采用 |
| B. staging-like 作为 P1 专项,当前只记录风险 | 保持 P0 稳定 | 生产化风险后置 | 采用 |
| C. 完全不提 staging-like | 文档更短 | 后续扩展入口不清 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 环境拓扑图: L0-bus P0 测试环境

```text
+-----------------------------+
| L0-bus test process         |
| unit/service/api/worker/job |
+--------------+--------------+
               |
               +-- [compile] --> L0-core shared contracts
               |
               +-- [runtime] --> in-memory constrained store
               |
               +-- [runtime] --> fake transport backend
               |
               +-- [runtime] --> fake secret provider
               |
               +-- [event] ----> fake outbox source / event replay
               |
               +-- [event] ----> in-memory outbound publisher sink
               |
               +-- [event] ----> fake SDK / observability / governance consumer
               |
               v
+--------------+--------------+
| artifacts/test/<run_id>     |
| reports/runs/<run_id>       |
+-----------------------------+
```

图后说明：

- 只有 `L0-core shared contracts` 是 `[compile]` 依赖,可使用本地 path dependency。
- store、backend、secret provider 是 `[runtime]` 依赖,当前 P0 使用 fake / in-memory。
- outbox source、outbound publisher 和下游消费者是 `[event]` 协作,当前 P0 使用 fixture、event replay 或 in-memory sink。
- artifacts 和 reports 只按 `run_id` 分目录,不额外加项目名层级。

### 7.2 环境矩阵

| 环境 | 用途 | 依赖服务 | 全局依赖类型 | 测试协作方式 | 关键配置 / feature flag | 数据策略 | 风险 |
|---|---|---|---|---|---|---|---|
| local-dev | 本地 smoke、unit、service 快速反馈 | L0-core contracts、in-memory runtime | `[compile]` + `[runtime]` | path dependency + in-memory | local-dev profile, api 可开, worker 默认关 | 小型 fixture,可清理 | 不作为验收证据 |
| ci-test | PR gate 的 unit / service / contract / config / redaction smoke | L0-core contracts、fake store/backend/source/publisher | `[compile]` + `[runtime]` + `[event]` | path dependency + fake adapters | ci-test profile, fixed clock, deterministic id | `run_id` 隔离,自动清理 | P0 失败阻断 PR |
| integration-test | repository、adapter、worker、job、runtime graph | fake source、fake backend、in-memory store、in-memory sink | `[runtime]` + `[event]` | fake runtime graph + event replay | integration-test profile, worker 可开 | 完整 fixture,失败 dump artifact | P0 失败阻断 main CI |
| operations-recovery | retry、DLQ、replay preparation、projection rebuild、backend capability job | fake audit chain、fake approval ref、fake backend capability | `[runtime]` + `[event]` | operations job + fixture recovery data | operations-recovery profile, job local args | recovery fixture,release 保留 evidence | 失败阻断 release |
| staging-like | P1 real-like adapter 演练 | durable store、MQ、secret provider | `[runtime]` + `[event]` | real-like service,非 P0 | staging-like profile | 另建 staging fixture | 当前可跳过,记录风险 |
| production-like | 后续生产部署验证 | production MQ / DB / KMS / observability | `[runtime]` + `[event]` | 运维 / 部署文档承接 | production-like profile | 不在当前测试方案执行 | 不进入当前 P0 |

### 7.3 配置矩阵

| 配置组 | local-dev | ci-test | integration-test | operations-recovery | staging-like / production-like |
|---|---|---|---|---|---|
| `store.kind` | `in_memory` | `in_memory` | `in_memory` | `in_memory` | `external` |
| `outbox_source.kind` | `in_memory_fixture` | `in_memory_fixture` | `in_memory_fixture` / replay | `in_memory_fixture` | `core_outbox` |
| `transport_backend.kind` | `in_memory` | `in_memory` | `in_memory` with failure injection | `in_memory` | `external` |
| `publisher.kind` | `in_memory_sink` | `in_memory_sink` | `in_memory_sink` with failure injection | `in_memory_sink` | `external` |
| `api.enabled` | `true` | suite-specific | `true` for API suite | optional | deployment-specific |
| `worker.enabled` | `false` by default | suite-specific | `true` for worker suite | optional | deployment-specific |
| `jobs.batch_size` | small safe default | deterministic | deterministic | recovery-specific | deployment-specific |
| `projection.kind` | `in_memory` | `in_memory` | `in_memory` | `in_memory` | `external_read_store` |
| `recovery_policy.*` | conservative local | conservative local | conservative local | recovery fixture policy | deployment-specific |
| `security_boundary.*` | reject / ref_only / required | reject / ref_only / required | reject / ref_only / required | reject / ref_only / required | must remain reject / ref_only / required |
| `clock.kind` | `system` or `fixed` | `fixed` | `fixed` | `fixed` | `system` |
| `id_generator.kind` | `uuid_v7` or deterministic | deterministic | deterministic | deterministic | `uuid_v7` |

### 7.4 测试依赖类型与协作方式判定表

| 依赖 | 依赖类型 | P0 协作方式 | 不可用处理 | 后续演进 |
|---|---|---|---|---|
| L0-core shared contracts | `[compile]` | local path dependency | 编译失败,阻断 | 后续可替换为内部 registry |
| L0-core outbox source | `[event]` | fake fixture / event replay | P0 fake 不可用则阻断 | P1 接 core outbox |
| bus store | `[runtime]` | in-memory constrained store | 阻断 | P1 durable store adapter |
| transport backend | `[runtime]` | fake / in-memory backend | 阻断 | P1 MQ adapter |
| outbound publisher | `[event]` | in-memory sink | 阻断 | P1 event bus adapter |
| secret provider | `[runtime]` | fake provider | 阻断 config suite | P1 KMS / Vault |
| observability / governance / SDK | `[event]` / `[runtime]` | fake consumer / snapshot | 不启动下游,只测输出 | 下游仓自测完整行为 |

### 7.5 环境不可用处理表

| 场景 | 处理 |
|---|---|
| P0 compile dependency missing | 立即失败,不允许跳过 |
| P0 fake adapter 初始化失败 | 立即失败,记录 runtime config summary |
| P0 fixture 数据生成失败 | 立即失败,不进入用例执行 |
| P0 redaction / report 目录不可写 | release gate 失败 |
| staging-like 不可用 | 标记 P1 unavailable,不阻断当前 P0 |
| production-like 不可用 | 当前不执行,由后续运维文档处理 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_08_environment_config.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“环境矩阵”“配置矩阵”“测试依赖类型与协作方式判定表”和“环境拓扑图”小节，了解本章测试环境如何承接配置设计和外部依赖边界。

本测试方案使用 local-dev、ci-test、integration-test、operations-recovery、staging-like 和 production-like 六类环境 / profile。P0 只要求 local-dev、ci-test、integration-test 和 operations-recovery 可验证;staging-like 和 production-like 属于后续 P1 / P2 或运维文档范围,不阻塞当前 P0。

测试依赖必须区分 `[compile]`、`[runtime]` 和 `[event]`。`L0-core` shared contracts 是编译期依赖,可使用 `/home/aris/Projects/quantalithos-core` 的本地 path dependency;committed outbox source、transport backend、outbound publisher、secret provider、observability / governance / SDK 等运行期或事件协作依赖,当前 P0 使用 fake、fixture、in-memory sink 或 event replay。

---

## 9. 待确认事项

当前没有阻塞进入 Step 9 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否把 staging-like 作为当前阻断环境 | A. 阻断;B. P1 专项不阻断;C. 不写 | 采用 B | 当前 P0 目标是默认可验证路径,不是生产化 adapter |
| 是否所有跨仓依赖都用 path dependency | A. 是;B. 仅编译期契约使用;C. 都不用 | 采用 B | 运行期和事件协作应使用 fake / replay,否则建模错误 |
| redaction / report 目录不可写是否阻断 | A. 阻断 release;B. warning;C. 忽略 | 采用 A | 无证据不能进入验收 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| local / CI / integration / recovery / staging / production-like 测试定位已明确 | 已满足 |
| 每个环境依赖服务已明确 | 已满足 |
| 关键配置和 profile 已映射到测试环境 | 已满足 |
| fake / fixture / event replay 策略已明确 | 已满足 |
| 编译期、运行期和事件协作依赖已区分 | 已满足 |
| 环境不可用处理已明确 | 已满足 |

结论: 可以进入 Step 9,设计自动化与 CI/CD 门禁。
