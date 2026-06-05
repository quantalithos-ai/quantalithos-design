# Step 8. 设计测试环境与配置矩阵

> 本步定义 `05-测试方案.md` §8 的测试环境、依赖类型、协作方式、配置矩阵和环境不可用处理。本步只承接 `03-详细设计.md` 与 `04-配置设计.md` 已有结论,不新增运行配置字段、不定义部署命令、不把非 core sibling 仓改成 Cargo path dependency。

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| Step | 8 |
| 状态 | 已完成 |
| 回填章节 | `projects/L1-work/05-测试方案.md` §8 测试环境与配置矩阵 |
| 生成日期 | 2026-06-04 |

## 2. 本步输入

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_06_cases_matrix.md` | 确认各用例族需要哪些自动化、人工、接缝和恢复环境 |
| `05_test_plan_step_07_test_data.md` | 将测试数据集映射到环境,固定 run-scoped seed、fake adapter outcome 和 cleanup 规则 |
| `03-详细设计.md` §2 / §13 / §15 | 固定 Rust workspace 依赖方向、唯一编译期 sibling dependency、runtime builder、fake / in-memory P0 测试边界 |
| `04-配置设计.md` §6~§12 | 固定 profile、配置来源、配置项、敏感边界、加载校验、失败模式和下游承接 |
| `04_config_step_06_profiles_matrix.md` | 提供 local-dev、ci-test、integration-like、operations-replay、staging-like、production-like profile 口径 |
| `04_config_step_12_downstream_handoff.md` | 提供 profile matrix、strict JSON、env override、adapter refs、no hot update、replay 等测试承接清单 |
| `测试方案讨论流程_SOP.md` Step 8 | 本步问题、期望表格和执行约束 |

## 3. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| local / CI / integration / staging 分别测什么? | `local-dev` 测默认可验证路径和人工 smoke;`ci-test` 测 P0 自动化门禁;`integration-like` 测 controlled adapter 接缝和配置失败;`operations-replay` 测恢复、重放、outbox / projection / reference / handoff;`staging-like` 与 `production-like` 只作为 P1/P2 后续专项。 |
| 每个环境依赖哪些服务? | P0 默认依赖本地进程、in-memory store、deterministic fake、temp dir、controlled configured adapter 或 replay bundle;不依赖真实生产 DB、MQ、event bus、secret provider 或 sibling runtime。 |
| 哪些 feature flag / config 影响测试结果? | `store.*`、`boundary.*`、`idempotency.*`、`projection.*`、`jobs.*`、`external.*`、`outbox.*`、`handoff.*`、`features.*` 会影响测试分支;本步只引用 04 既有配置项,不新增字段。 |
| 哪些依赖需要 mock 或 fake? | P0 的 identity、method、source work、conversation、runtime、process、governance、artifact、bus publisher、trace handoff、archive handoff 均通过 fake / controlled adapter / event replay 协作;只有 `core-contracts` 是编译期 path dependency。 |
| 环境不可用时如何处理? | P0 `local-dev` / `ci-test` 不允许依赖真实服务不可用;`integration-like` configured adapter 不可用时 explicit unavailable / fail-fast / fail-closed;`operations-replay` bundle 或 baseline 不匹配时 fail-fast;P1/P2 staging / production 不阻塞 P0。 |
| 哪些依赖是编译期依赖,可用 path dependency? | 只有 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。其他 sibling repo 不得进入 Cargo dependency。 |
| 哪些依赖是运行期依赖或事件协作依赖? | L1-identity、L1-conversation、L3-method-library、L1-process、L1-governance、L1-artifact、L2-runtime、L0-bus、L4-observability、L4-archive 均是 runtime / event collaboration,必须通过 port、fake、controlled adapter、real-like dry-run 或 event replay 表达。 |

## 4. 当前文档问题诊断

| 文档 / 位置 | 当前问题 | 本步处理 |
|---|---|---|
| Step 7 测试数据 | 已有数据集和 fake seed,但没有说明在哪些环境执行 | 本步把数据集映射到 local-dev、ci-test、integration-like 和 operations-replay |
| `03-详细设计.md` §2 | 已说明唯一编译期 sibling dependency,但测试方案尚未区分 compile / runtime / event | 本步显式给出依赖类型与协作方式判定表 |
| `04-配置设计.md` §6~§12 | 已有 profile 与配置项,但尚未转成测试环境矩阵 | 本步定义环境矩阵、配置矩阵和不可用处理 |
| 旧 `05-测试方案.md` | 未按新版 profile、fake / configured adapter 和 operations-replay 重校准 | 本步提供正式 §8 回填草稿 |

## 5. 改动前后对比

| 维度 | Step 7 后 | Step 8 收敛后 |
|---|---|---|
| 环境定位 | 只有数据集和 fake seed | 每个 P0 profile 有用途、依赖、协作方式、配置、数据和风险 |
| 依赖类型 | 外部依赖使用 fake 的原则已出现 | 明确 compile / runtime / event 三类,只有 `core-contracts` 可 path dependency |
| 配置影响 | 数据集中有 config fixture | 配置矩阵映射到 `store.*`、`external.*`、`outbox.*`、`features.*` 等正式 section |
| 环境不可用 | 尚未集中定义 | 明确 unavailable、fail-fast、fail-closed、explicit marker 和 P1/P2 不阻塞 P0 |
| 上游影响 | 无 | 无;本步不新增 domain、DTO、trait、config 或部署字段 |

## 6. 测试设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只写 local / CI / staging / prod 四类通用环境 | 简短通用 | 无法表达 operations-replay、configured adapter 接缝和 fake marker 风险 | 不采用 |
| 方案 B: P0 按 local-dev / ci-test / integration-like / operations-replay 定位,P1/P2 保留 staging-like / production-like 边界 | 与 04 profile 一致,能覆盖自动化、人工、接缝和恢复 | 表格较多,需要明确非 core sibling 不可 path dependency | 采用 |
| 方案 C: P0 直接要求真实 DB / MQ / sibling repo 联调 | 更接近生产 | 预支 P1/P2 产品绑定,会阻塞当前默认可验证路径 | 不采用 |
| 方案 D: 把 fake adapter 成功作为集成验收成功 | 成本低 | 会把 fake success 误认为 production success | 不采用 |

采用方案 B。

原因:

- `04-配置设计.md` 已把 P0 profile 收敛为 local-dev、ci-test、integration-like 和 operations-replay。
- L1-work 的 P0 目标是默认可验证路径和设计契约闭环,不是生产化产品绑定。
- 详细设计已明确非 core sibling repo 只能通过 port、adapter、event、snapshot、handoff、query 或 fake 测试边界表达。

## 7. 结构化中间产物

### 7.1 环境矩阵

| 环境 | 用途 | 依赖服务 | 全局依赖类型 | 测试协作方式 | 关键配置 / feature flag | 数据策略 | 风险 |
|---|---|---|---|---|---|---|---|
| `local-dev` | 本地人工 API / worker / job smoke,验证默认可运行路径和最小主链 | 本地进程、in-memory store、fake resolver、fake publisher、fake handoff、deterministic clock / id、local reports | `[compile] core-contracts`;`[runtime] fake / in-memory`;`[event] fake publisher` | 只对 `core-contracts` 使用 path dependency;其他依赖用 fake adapter | defaults + optional JSON + optional env + entry args;`features.derived_views_enabled=true`;`features.advanced_search_enabled=false` | `DS-WORK-RUN-BASE`、`DS-WORK-PROJECT-BASE`、最小 `CORE` / `FORMAL` / `QUERY` / `OPS` smoke | fake success 不代表验收;必须标记 fake evidence |
| `ci-test` | 自动化 P0 门禁,覆盖 deterministic fixture、反向用例、红线和配置错误 | temp dir、in-memory stores、deterministic fake adapters、captured logs / reports、no-op / fake publisher | `[compile] core-contracts`;`[runtime] fake / temp`;`[event] fake / replay` | unit / service / API-worker contract / integration fake;不接真实生产 endpoint | defaults + test JSON + CI env + job args;strict JSON、env override、redaction gate、no hot update | 全部 P0 `DS-WORK-*` 数据集,每用例 run-scoped cleanup | 并行执行隔离和 env override 泄漏;需 run id / temp dir / env cleanup |
| `integration-like` | 验证跨入口、runtime builder、configured adapter ref、external unavailable 和 fake marker 区分 | controlled local / configured resolver、publisher、handoff、store refs;不连接真实生产 endpoint | `[compile] core-contracts`;`[runtime] controlled configured adapters`;`[event] controlled fake / replay` | configured adapter dry-run、fake marker 区分、event replay;不可 silent fallback | JSON + env + entry args;`external.*`、`outbox.publisher`、`handoff.*` 条件必填 | `DS-WORK-CONFIG-PROFILE`、`DS-WORK-CONFIG-INVALID`、`DS-WORK-OPS-RECOVERY`、外部 unavailable seed | configured adapter 不可用必须 explicit marker 或 fail-fast;不得自动 fake success |
| `operations-replay` | 验证 outbox、projection、reference refresh、handoff、reconciliation、cleanup 和 replay 幂等 | 脱敏历史状态、outbox / projection / reference / handoff snapshot、本地 report root、replay job args | `[runtime] replay store / local temp`;`[event] event replay`;`[runtime] jobs` | 脱敏 replay bundle、event / job replay、fake handoff / publisher outcome | replay JSON + env + job args;baseline digest、report root、retry / batch / retention 配置 | `DS-WORK-OPS-RECOVERY`、`DS-WORK-RECONCILIATION`、`DS-WORK-OUTBOX`、`DS-WORK-PROJECTION-REBUILD`、`DS-WORK-REFERENCE-STATES` | 历史 raw secret / body 禁止;baseline mismatch fail-fast,不得修 truth |
| `staging-like` | P1 跨仓集成、真实依赖 dry-run、部署配置验证 | real-like DB、event bus、resolver、handoff、secret provider | `[runtime] real-like`;`[event] real-like` | 后续 controlled real-like / dry-run;不进入 P0 blocking gate | 部署材料定义,仍遵守 ref-only sensitive 和 fail-fast | 后续专项数据,不使用 P0 默认 seed 替代生产验证 | 不得把未定义生产字段写成 P0 已完成 |
| `production-like` | P1/P2 生产运行、运维变更、secret provider、runbook 和审计 | real durable store、event bus、source adapters、observability / archive handoff、secret provider | `[runtime] real`;`[event] real` | 后续部署与运维手册承接;本步只保留测试边界 | 真实值由 09 / 运维材料定义;raw secret 不进 04 / 05 | 后续生产化专项,不作为当前 P0 证据 | 不能预支 DB / MQ / KMS / endpoint 字段全集 |

### 7.2 依赖类型与测试协作方式判定表

| 依赖 / 协作对象 | 类型 | 是否允许 path dependency | P0 测试协作方式 | 说明 |
|---|---|---|---|---|
| `core-contracts` | `[compile]` | 是 | `../quantalithos-core/crates/contracts` path dependency | 唯一允许的编译期 sibling dependency |
| L1-identity | `[runtime]` / `[event]` | 否 | fake member resolver、controlled adapter、identity event replay | 成员能力、actor / member ref 只通过 port / event |
| L1-conversation | `[runtime]` / `[event]` | 否 | fake source resolver、conversation source ref、event replay | 不读取 conversation 仓内部对象 |
| L3-method-library | `[runtime]` / `[event]` | 否 | fake method definition resolver、method event replay | MethodDefinition 通过 ref / snapshot 表达 |
| L1-process | `[runtime]` / `[event]` | 否 | fake timebox resolver、process event replay | Iteration 只消费 timebox ref / event |
| L1-governance | `[runtime]` / `[event]` | 否 | fake evidence resolver、governance event replay | evidence / decision 只通过 ref / event |
| L1-artifact | `[runtime]` / `[event]` | 否 | fake artifact evidence resolver、artifact event replay | 禁止读取 raw artifact body |
| L2-runtime | `[runtime]` / `[event]` | 否 | fake runtime result resolver、runtime event replay | promote / runtime source 只承接 ref / digest |
| L0-bus | `[event]` | 否 | fake publisher、event envelope fixture、event replay | P0 不要求真实 bus |
| L4-observability | `[runtime]` | 否 | fake trace handoff adapter、controlled handoff ref | trace handoff 只交 sanitized payload ref |
| L4-archive | `[runtime]` | 否 | fake archive handoff adapter、controlled archive ref | archive handoff 不写 raw body |
| Work store / projection / idempotency / outbox | `[runtime]` | 不适用 | in-memory store、temp dir、controlled failure injection | 当前只锁定逻辑契约,不锁定 DB 产品 |
| clock / id generator | `[runtime]` | 不适用 | deterministic fake | P0 断言必须可重复 |

### 7.3 配置矩阵

| 配置 section | 影响的测试结果 | local-dev | ci-test | integration-like | operations-replay | staging / production |
|---|---|---|---|---|---|---|
| `store.*` | truth / projection / idempotency / outbox 持久化、rollback、version conflict | `in_memory` | `in_memory` + isolated temp | controlled local / configured store refs | replay local store / snapshot | P1/P2 durable store |
| `boundary.*` | command body limit、query timeout、page limit、entry guard | defaults | strict boundary + invalid config cases | configured boundary dry-run | replay job input boundary | 部署材料定义 |
| `idempotency.*` | duplicate / conflict / in-flight / retention | defaults | deterministic key / digest matrix | configured retention validation | replay idempotency window | P1/P2 policy hardening |
| `projection.*` | stale / failed / rebuild / page | derived views default enabled | rebuild failure injection | configured projection adapter refs | projection rebuild / reconciliation | production projection backend |
| `jobs.*` | batch、retry、timeout、manual job args | small batch local run | deterministic job fixtures | controlled job dry-run | replay / cleanup / reconciliation | runbook / scheduler |
| `external.*` | identity、method、source、evidence、timebox resolution | fake adapters | fake success / unresolved / unavailable / body-leak | configured refs 条件必填,不可 fake fallback | historical / fake refs | real source adapters |
| `outbox.*` | publish success / failed marker / retry | fake publisher | fake publisher + failure injection | configured publisher ref dry-run | outbox replay / rerun | real event bus publisher |
| `handoff.*` | trace / archive handoff success、failed、redaction | fake handoff | fake handoff + failure injection | configured target ref dry-run | handoff replay / failed report | observability / archive provider |
| `features.*` | derived views、advanced search、truth path 不可关闭 | `derived_views_enabled=true`;advanced search default false | feature parse / unsupported enable fail-fast | controlled feature dry-run | feature baseline must match replay | P1/P2 feature rollout |

说明:

```text
- 本表只引用 04 中已有配置 section 和配置项。
- 如果后续测试需要新增 clock / id generator 显式配置、production search backend 或 durable adapter 字段,必须先回写 03 / 04。
- `features.*` 不能关闭 truth path、metadata / idempotency、visibility、audit / outbox 或 query no-write 边界。
```

### 7.4 环境拓扑图

图类型: 测试环境依赖拓扑图

图标题: L1-work P0 测试环境依赖类型

```text
L1-work test runtime
  |
  +--[compile] core-contracts path dependency
  |
  +--[runtime] in-memory store / projection / idempotency / outbox
  |
  +--[runtime] fake or controlled resolver ports
  |     +-- identity / method / source work / process / evidence / runtime
  |
  +--[event] inbound event replay / fake event envelopes
  |
  +--[event] fake outbox publisher / controlled bus seam
  |
  +--[runtime] fake trace / archive handoff adapters
  |
  +--[runtime] operations replay bundle / sanitized report root
```

关键说明:

- 只有 `core-contracts` 是 `[compile]` 依赖。
- 非 core sibling 仓一律通过 `[runtime]` port、adapter、snapshot、handoff 或 `[event]` replay 协作。
- P0 不要求真实 DB、MQ、event bus、secret provider 或 production endpoint。
- fake / configured / replay 的证据必须可区分,不得把 fake success 写成 production success。

### 7.5 环境不可用处理表

| 环境 / 依赖 | 不可用场景 | 处理口径 | 是否阻塞 P0 | 证据要求 |
|---|---|---|---|---|
| local-dev fake adapter | fake seed 缺失或 fake marker 缺失 | startup / test fail-fast | 是 | sanitized error,指出缺失 seed / marker |
| ci-test temp dir / isolated store | temp dir 创建失败、env override 泄漏 | 当前测试 fail-fast,不得复用上一 run | 是 | run id、temp root、cleanup result |
| ci-test external fake | resolver outcome 未注册 | explicit unresolved / test failure,按用例预期区分 | 是 | fake call capture 和 sanitized reason |
| integration-like configured adapter | endpoint / credential ref / target ref 缺失 | startup fail-fast 或 fail-closed,不得 fallback 到 fake success | 是 | config source summary 和 missing ref |
| integration-like controlled external | provider unavailable | flow 产生 explicit unavailable / failed marker 或配置 fail-fast | 是,限 integration-like 用例 | sanitized adapter outcome |
| operations-replay bundle | replay bundle 缺失、baseline digest mismatch | replay job fail-fast,不得修 truth | 是,限 replay 用例 | baseline ref、digest mismatch reason |
| operations-replay historical sensitive | bundle 含 raw secret / raw source body | fail-fast,不得写报告 | 是 | redaction scan failure |
| staging-like | real-like 服务不可用 | 不阻塞 P0;记录为 P1 环境风险 | 否 | P1 risk item |
| production-like | real 服务 / secret provider 不可用 | 不属于当前 P0 测试执行 | 否 | 留给 09 / 生产化专项 |

### 7.6 数据集到环境映射

| 环境 | 必跑数据集 | 可选 / 专项数据集 | 说明 |
|---|---|---|---|
| `local-dev` | `DS-WORK-RUN-BASE`、`DS-WORK-PROJECT-BASE`、`DS-WORK-MEMBER-CAPABILITY`、`DS-WORK-BACKLOG-WORK`、`DS-WORK-QUERY-VIEWS`、`DS-WORK-OUTBOX` | 少量 `DS-WORK-CONFIG-PROFILE`、`DS-WORK-SENSITIVE-OUTPUT` smoke | 面向人工调试和默认路径,不替代 CI P0 |
| `ci-test` | 全部 `DS-WORK-*` P0 数据集 | 无 | 自动化 P0 主环境;所有 run-scoped cleanup 必须通过 |
| `integration-like` | `DS-WORK-CONFIG-PROFILE`、`DS-WORK-CONFIG-INVALID`、`DS-WORK-REFERENCE-STATES`、`DS-WORK-OUTBOX`、`DS-WORK-TRACE-HANDOFF`、`DS-WORK-NFR-OBS` | controlled configured adapter dry-run seed | 验证 configured 接缝和不可用处理 |
| `operations-replay` | `DS-WORK-OPS-RECOVERY`、`DS-WORK-RECONCILIATION`、`DS-WORK-OUTBOX`、`DS-WORK-PROJECTION-REBUILD`、`DS-WORK-REFERENCE-STATES`、`DS-WORK-TRACE-HANDOFF` | sanitized historical replay bundle | 验证恢复、重跑、partial failure 和 diagnostic |
| `staging-like` | 后续专项定义 | real-like dry-run dataset | P1,不阻塞当前 P0 |
| `production-like` | 后续专项定义 | production validation / runbook evidence | P1/P2,不进入当前测试数据事实源 |

### 7.7 不提前写入的环境范围

| 不提前写入项 | 原因 | 后续承接 |
|---|---|---|
| 真实 durable DB / MQ / event bus 产品绑定 | P1/P2,03 / 04 未定义字段全集 | 生产化详细设计、配置设计和 09 |
| KMS / Vault / secret provider 真实 material | 04 只允许 ref-only sensitive | 09 部署与运维手册 |
| 非 core sibling repo Cargo path dependency | 违反 03 依赖裁剪 | 07 实施计划阅读 / 提交门禁 |
| staging / production 测试命令 | 当前只定义测试方案环境边界 | 09 和 P1/P2 专项 |
| CI job name / pipeline 语法 | Step 9 职责 | Step 9 自动化与 CI/CD 门禁 |
| 测试报告归档路径全集 | Step 13 职责 | Step 13 报告与证据归档 |

## 8. 对上游设计的影响判定

| 测试结论 | 是否影响上游设计 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 测试环境可由 local-dev、ci-test、integration-like、operations-replay 覆盖 | 否 | 承接 04 profile,无设计契约变化 | 无 | 无回写 |
| 只有 `core-contracts` 是编译期 path dependency | 否 | 承接 03 依赖裁剪 | 无 | 无回写 |
| 非 core sibling repo 通过 runtime / event 协作,使用 fake / controlled adapter / replay | 否 | 测试协作方式,无新增 port | 无 | 无回写 |
| staging-like / production-like 不阻塞 P0,不写真实字段全集 | 否 | 范围裁剪,承接 04 | 无 | 无回写 |
| 环境不可用处理使用 fail-fast / fail-closed / explicit marker / replay mismatch | 否 | 承接 04 失败语义 | 无 | 无回写 |

说明:

```text
本步没有发现必须回写 `00/01/02/03/04` 的设计冲突。
如果后续 Step 9 为 CI 引入新的配置字段、真实服务依赖或非 core path dependency,必须先回写对应上游设计。
```

## 9. 回填草稿

正式 `05-测试方案.md` §8 建议采用以下结构:

```text
8. 测试环境与配置矩阵
  8.1 环境矩阵
  8.2 依赖类型与测试协作方式判定表
  8.3 配置矩阵
  8.4 环境拓扑图
  8.5 环境不可用处理
  8.6 数据集到环境映射
  8.7 不提前写入的环境范围
  8.8 对上游设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §8.1 | `design-calibration/05_test_plan_step_08_environment_config.md` §7.1 |
| §8.2 | `design-calibration/05_test_plan_step_08_environment_config.md` §7.2 |
| §8.3 | `design-calibration/05_test_plan_step_08_environment_config.md` §7.3 |
| §8.4 | `design-calibration/05_test_plan_step_08_environment_config.md` §7.4 |
| §8.5 | `design-calibration/05_test_plan_step_08_environment_config.md` §7.5 |
| §8.6 | `design-calibration/05_test_plan_step_08_environment_config.md` §7.6 |
| §8.7 | `design-calibration/05_test_plan_step_08_environment_config.md` §7.7 |
| §8.8 | `design-calibration/05_test_plan_step_08_environment_config.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 9 的设计待确认事项。

人工审核时建议重点确认:

| 审核点 | 期望 |
|---|---|
| P0 profile | 是否接受 local-dev、ci-test、integration-like、operations-replay 作为 P0 环境全集 |
| staging / production | 是否接受只作为 P1/P2 边界,不阻塞当前 P0 |
| 依赖类型 | 是否接受只有 `core-contracts` 可 path dependency,其他 sibling 均 runtime / event 协作 |
| 配置矩阵 | 是否确认不新增 `WorkRuntimeConfig` 字段 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 自动化环境可定位 | 通过 | `ci-test` 环境矩阵、配置矩阵和数据映射已定义 |
| P0 人工测试环境可定位 | 通过 | `local-dev` 环境矩阵已定义 |
| integration-like 接缝环境可定位 | 通过 | controlled adapter / configured ref / no production endpoint 已定义 |
| operations-replay 恢复环境可定位 | 通过 | replay bundle、baseline digest、report root 和不可用处理已定义 |
| compile / runtime / event 依赖类型已区分 | 通过 | §7.2 和 §7.4 |
| 对上游设计影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 9 | 通过 | 下一步定义自动化套件、CI/CD 门禁和失败阻断规则 |
