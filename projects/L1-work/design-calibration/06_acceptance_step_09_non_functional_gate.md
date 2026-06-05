# Step 9. 定义非功能验收门禁

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 9 中间产物。
> 本步把性能、安全、可用性、兼容性、容量、恢复和幂等一致性专项转成可裁决门禁。
> 本步不发明新的 SLA、容量模型、生产依赖或性能阈值。

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 9
- 回填章节: `projects/L1-work/06-验收标准.md` §9 非功能验收门禁
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §14 | `AC-WORK-024`~`029` 非功能验收项 | 非功能裁决来源 |
| `04-配置设计.md` §7 / §9 / §11 | timeout、page、body、batch、retry、sensitive、fail-fast / fail-closed | 有来源阈值和失败口径 |
| `05-测试方案.md` §8 | P0 环境矩阵、依赖类型、配置矩阵、环境不可用处理 | 非功能执行环境和协作方式 |
| `05-测试方案.md` §9 / §10 | 自动化 suite、专项测试矩阵、性能观察、安全红线 | 证据和阻断级别来源 |
| `05-测试方案.md` §11 / §14 | 缺陷分级、风险接受、回归触发、残余风险 | 未覆盖专项和风险处理来源 |
| Step 6~8 中间产物 | 数据红线、接口同步、状态 / 事务 / 幂等一致性 | 本步红线承接 |

已确认结论:

```text
旧 `CreateWorkItem P95 < 100ms` 和 `GetProjectBoard P95 < 300ms` 只作观察候选,不是 P0 release 硬阈值。
P0 硬阈值只能来自 `04-配置设计.md` 的正式配置项和 `05-测试方案.md` 的 release / redline 条件。
真实 DB、MQ、secret provider、production endpoint、staging-like 全量验证和 production-like 运维不进入当前 P0 非功能硬门禁。
```

## 3. SOP 问题回答

### 3.1 哪些非功能指标是 P0?

P0 非功能只覆盖已由需求、配置和测试方案收稳的门禁。

| P0 维度 | 对应 AC | P0 裁决对象 |
|---|---|---|
| 性能观察与运行边界性能 | `AC-WORK-024` | 核心 command / query / job 有 duration 报告;正式 timeout / page / body / batch / retry 阈值生效 |
| 可用性 / 降级 | `AC-WORK-025` | 外部依赖不可用时不造 truth,返回 unavailable / unresolved / failed / stale marker |
| 安全 / 授权 / 正文边界 | `AC-WORK-026` | unauthorized 不泄露 truth;raw secret / token / payload / source body 零命中 |
| 审计 / 可追溯 | `AC-WORK-027` | accepted / rejected / maintenance 能解释,但详细证据门禁留 Step 10 |
| 幂等 / 一致性 | `AC-WORK-028` | duplicate、conflict、version conflict、commit unknown 不产生重复 truth |
| 可观测性 | `AC-WORK-029` | safe log、metric、trace / audit / outbox / job report 可发现,详细字段留 Step 10 |
| 配置兼容与环境 profile | `AC-WORK-025/026/029` | `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile 规则成立 |
| 可恢复性 | `AC-WORK-025/028/029` | publish / projection / reference / handoff / replay failure 有 marker、report 和 rerun 口径 |

### 3.2 阈值来自需求、设计还是运行基线?

阈值只接受三类来源:

| 来源 | 可作为硬阈值 | 示例 |
|---|---|---|
| `04-配置设计.md` 正式配置项 | 是 | `boundary.query_read_timeout = 2s`;`store.transaction_timeout = 5s`;`jobs.job_timeout = 300s`;`boundary.max_page_limit = 100`;`boundary.max_command_body_bytes = 1048576`;`jobs.default_batch_size = 100`;`jobs.retry_limit = 3`;`outbox.publish_batch_size = 100`;`outbox.publish_retry = {max_attempts:3,base_delay:1s,max_delay:30s}` |
| `05-测试方案.md` release / redline 条件 | 是 | raw secret / payload / body 零命中;report path 不得使用 `latest`;configured adapter 不得 fallback fake success |
| `00-需求文档.md` 旧候选目标 | 否,仅观察 | `CreateWorkItem P95 < 100ms`;`GetProjectBoard P95 < 300ms` |

没有来源的性能、容量、错误率、SLA、并发量或可用性百分比不得进入本轮 P0 硬门禁。

### 3.3 哪些专项未覆盖,是否影响验收?

| 未覆盖专项 | 当前影响 | 处理口径 |
|---|---|---|
| production-like durable store / MQ / endpoint 产品绑定 | 不阻塞 P0 | Step 13 风险接受候选;生产化前补详细设计、配置、测试和运维 |
| secret provider / KMS / Vault | 不阻塞 P0 | 当前只验 ref-only sensitive 和 redaction;真实 provider 后续专项 |
| config center / admin override / hot reload | 不阻塞 P0 | 当前 unsupported fail-fast;不得作为 P0 成功能力 |
| 旧 `100ms / 300ms` SLA 硬化 | 不阻塞 P0 | 只保留样本观察;若硬化需回写需求 / 测试 / 验收 |
| nightly extended stress | 不作为默认 P0 退出硬条件 | 失败进入缺陷 / 风险;release selected 可阻断 |
| staging-like 全量跨仓实测 | 不阻塞 P0 | P1/P2 专项;P0 只验接缝、fake / configured marker 和 replay |

### 3.4 哪些非功能失败会阻断发布?

| 失败类型 | 阻断口径 |
|---|---|
| raw secret / raw token / raw payload / source body 命中 | 阻断 release;Step 11 一票否决候选 |
| unauthorized 返回 visible truth 或写入 truth | 阻断 release |
| 配置关闭 truth / metadata / idempotency / visibility / audit / outbox / redaction / external body exclusion / query no-write | 阻断 release |
| configured adapter 缺 ref 或 provider unavailable 时 fallback fake success | 阻断 release |
| 正式 timeout / page / body / batch / retry 阈值非法但 runtime build 或 job run 成功 | 阻断对应 gate |
| duplicate / conflict / version conflict / commit unknown 产生重复 truth | 阻断 release;Step 11 一票否决候选 |
| publish / projection / reference / handoff failure silent success 或 rerun 非幂等 | 阻断对应 OPS / release selected gate |
| evidence / report path 使用 `latest` 或错误 root | 阻断 release evidence pack |

### 3.5 证据来自哪里?

| 维度 | 证据 |
|---|---|
| 性能观察 | `EV-WORK-NFR-001`;`reports/runs/<run_id>/nfr-*.md` |
| 运行边界性能 | `EV-WORK-CFG-005`~`009`;`EV-WORK-NFR-001` |
| 可用性 / 降级 / 可恢复性 | `EV-WORK-NFR-002`;`EV-WORK-OPS-*` |
| 安全 / 授权 / redaction | `EV-WORK-NFR-003`;`EV-WORK-CFG-010`~`012`;redaction report |
| 幂等 / 一致性 | `EV-WORK-NFR-004`;`EV-WORK-CORE-004`;`EV-WORK-PROMOTE-005` |
| 可观测性 / 审计 | `EV-WORK-NFR-005`;`EV-WORK-CORE-*`;`EV-WORK-DEP-*`;`EV-WORK-OPS-*` |
| release redline | `release-config-redline`;`release-evidence-pack`;`reports/runs/<run_id>/gate-results.md` |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` | 旧性能数字可能被当作硬门槛 | 缺固定环境、容量模型和来源 | 降级为观察候选 |
| 旧 `06-验收标准.md` | 安全、证据、红线和非功能混写 | 无法区分 Step 9 / 10 / 11 | 本步只写 NFR 裁决,证据细节和一票否决后续收口 |
| `04-配置设计.md` | 已有正式 timeout / limit / retry 默认值和校验 | 可作为硬阈值来源 | 本步引用 |
| `05-测试方案.md` | 已有专项测试矩阵和 suite | 可作为 NFR evidence 来源 | 本步引用 |
| Step 8 | 幂等 / 一致性已收口 | Step 9 只承接 NFR 维度,不重复状态矩阵 | 避免重复 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 性能 | 旧 P95 数字可能硬化 | 旧数字只观察;正式配置阈值才硬门禁 | 阈值必须有来源 |
| 可用性 | 泛化“服务可用” | 外部不可用不得造 truth,必须 marker / failed / stale | 对齐数据边界 |
| 安全 | 泛化“权限正确” | unauthorized、raw secret / payload / body、fake fallback、配置越界逐项阻断 | 可检查 |
| 兼容性 | 未明确 | P0 只验 profile / adapter seam / core-contracts;production-like 后续 | 防止范围膨胀 |
| 容量 | 未明确 | page / body / batch / retry 按配置阈值;无业务容量 SLA | 避免无来源指标 |
| 可恢复性 | 只写可重试 | 明确 failed marker、rerun、last good snapshot、no truth repair | 支撑 OPS |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 继承旧性能数字做硬门禁 | 看起来明确 | 无固定环境和容量模型,会产生无来源阈值 | 不采用 |
| 方案 B: 性能做观察,配置阈值和红线做硬门禁 | 来源清晰,可复核 | 不能声称生产性能 SLA 已满足 | 采用 |
| 方案 C: 把 production-like、real DB、real MQ、secret provider 全纳入 P0 | 接近真实生产 | 超出当前设计和测试范围,阻塞 P0 | 不采用 |

推荐方案 B。

原因:

- 当前 P0 的目标是证明核心 Work truth 闭环和边界安全,不是承诺生产 SLA。
- 所有硬阈值都必须有 `04` 配置或 `05` redline 来源。
- 未覆盖的生产化专项必须进入风险接受,不能伪装为已验收。

## 7. 结构化中间产物

### 7.1 非功能验收表

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| `NF-WORK-PERF-001` | 性能观察 | 核心 command / query / job 报告必须包含 duration、样本、P50 / P95、fixture 规模和 profile | 不以旧 `100ms / 300ms` 作 P0 fail 条件 | `EV-WORK-NFR-001`;`reports/runs/<run_id>/nfr-*.md` | 缺报告为 A/B 缺陷;旧候选未达不直接阻断 |
| `NF-WORK-PERF-002` | 运行边界性能 | query timeout、transaction timeout、job timeout 生效 | `boundary.query_read_timeout = 2s`;`store.transaction_timeout = 5s`;`jobs.job_timeout = 300s` | `EV-WORK-CFG-005`~`009`;`EV-WORK-NFR-001` | 非法值未 fail-fast 或超时 surface 不成立则阻断 |
| `NF-WORK-CAP-001` | 容量 / limit | command body、page、job batch、outbox batch、retry limit 生效 | `boundary.max_command_body_bytes = 1048576`;`boundary.max_page_limit = 100`;`jobs.default_batch_size = 100`;`jobs.retry_limit = 3`;`outbox.publish_batch_size = 100` | `EV-WORK-CFG-005`~`009`;job reports | 阈值非法未 fail-fast 或绕过限制则阻断 |
| `NF-WORK-AVAIL-001` | 可用性 / 降级 | 外部 resolver / publisher / handoff unavailable 不破坏 core truth closure | explicit unavailable / unresolved / failed / stale marker | `EV-WORK-NFR-002`;`EV-WORK-OPS-*` | 造外部 truth、silent success 或 core truth rollback 则阻断 |
| `NF-WORK-SEC-001` | 授权 | unauthorized command / query 不返回 visible truth,不写 truth | unauthorized -> `NotVisible` / reject | `EV-WORK-QUERY-001`;`EV-WORK-NFR-003` | 泄露 truth 或写入 truth 则阻断 |
| `NF-WORK-SEC-002` | 正文 / 敏感输出 | raw secret、raw token、raw payload、source body、runtime progress body、ImplementationPlan body 零命中 | 任一正式 artifact / report / log / audit / DTO / event dump 均零命中 | `EV-WORK-CFG-010`~`012`;`EV-WORK-NFR-003`;redaction report | 任一命中阻断,Step 11 一票否决候选 |
| `NF-WORK-SEC-003` | 配置安全边界 | 配置不得关闭 truth、metadata、idempotency、visibility、audit / outbox、redaction、external body exclusion、query no-write | 任何表达关闭核心边界的配置必须 startup fail-fast | `EV-WORK-CFG-017`;`release-config-redline` | runtime build 成功或 silent ignore 则阻断 |
| `NF-WORK-COMPAT-001` | profile / adapter 兼容 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` P0 profile 可区分 fake / configured / replay | fake success 不得标记 production success;configured ref 缺失 fail-fast / fail-closed | `EV-WORK-CFG-001`~`004`;`EV-WORK-CFG-013`~`016`;`integration-like-seam` selected | fallback fake success 或 profile 不可区分则阻断 |
| `NF-WORK-COMPAT-002` | 跨仓依赖兼容 | 唯一编译期依赖仍为 `core-contracts`;其他仓经 runtime / event / handoff seam | 非 core sibling 不得进入 path dependency | dependency report;`EV-WORK-NFR-003`;Step 7 evidence | 非 core compile dependency 阻断,Step 11 一票否决候选 |
| `NF-WORK-REC-001` | 可恢复性 | publish / projection / reference / handoff failure 有 failed marker / report,rerun 幂等,last good snapshot preserved | failed marker 可见;retry 按正式状态推进;reconciliation read-only | `EV-WORK-OPS-001`~`006`;`EV-WORK-NFR-002` | silent success、rerun 非幂等或 truth repair 则阻断 |
| `NF-WORK-IDEM-001` | 幂等 / 一致性 | duplicate、conflict、version conflict、commit unknown 不产生重复 truth | duplicate stored result;conflict reject;single-winner;no blind retry | `EV-WORK-NFR-004`;`EV-WORK-CORE-004`;`EV-WORK-PROMOTE-005` | 重复 truth / outbox 或盲重试则阻断 |
| `NF-WORK-OBS-001` | 可观测性 | 核心变化、边界越界、依赖延迟和维护状态可发现 | safe fields 存在;metric label low-cardinality;无 raw body / secret | `EV-WORK-NFR-005`;observability / audit report | 缺关键发现面为 A 缺陷;raw 泄露则阻断 |
| `NF-WORK-AUDIT-001` | 审计 / 可追溯 | accepted / rejected / maintenance 可解释 | accepted truth change 有 trace / audit / outbox 或 report | `EV-WORK-CORE-*`;`EV-WORK-DEP-*`;`EV-WORK-NFR-005` | 关键变化不可追溯阻断,Step 11 一票否决候选 |
| `NF-WORK-EVID-001` | report / artifact 路径 | 正式证据必须固定 `<run_id>` | 不得使用 `latest`;路径为 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` | `release-evidence-pack`;path check | `latest` 或错误 root 阻断 |

### 7.2 阈值来源表

| 阈值 | 来源 | 是否 P0 硬门禁 | 说明 |
|---|---|---|---|
| `CreateWorkItem P95 < 100ms` | `00-需求文档.md` 旧候选目标 / `05` §10.2 | 否 | 仅观察,不作为 release fail 条件 |
| `GetProjectBoard P95 < 300ms` | `00-需求文档.md` 旧候选目标 / `05` §10.2 | 否 | 仅观察,不作为 release fail 条件 |
| `boundary.query_read_timeout = 2s` | `04-配置设计.md` §7 | 是 | 验 timeout 生效和非法值 fail-fast |
| `store.transaction_timeout = 5s` | `04-配置设计.md` §7 | 是 | 验配置解析和非正数 fail-fast |
| `jobs.job_timeout = 300s` | `04-配置设计.md` §7 | 是 | 验 job-run-start 参数和非法值处理 |
| `boundary.max_page_limit = 100` | `04-配置设计.md` §7 | 是 | 验 page limit |
| `boundary.max_command_body_bytes = 1048576` | `04-配置设计.md` §7 | 是 | 验 body limit |
| `jobs.default_batch_size = 100` | `04-配置设计.md` §7 | 是 | 验 batch 范围 |
| `jobs.retry_limit = 3` | `04-配置设计.md` §7 | 是 | 验 retry 范围 |
| `outbox.publish_batch_size = 100` | `04-配置设计.md` §7 | 是 | 验 outbox publish batch |
| `outbox.publish_retry = {max_attempts:3,base_delay:1s,max_delay:30s}` | `04-配置设计.md` §7 | 是 | 验 retry policy 交叉校验 |

### 7.3 未覆盖专项与风险承接表

| 专项 | 当前 P0 结论 | 后续承接 |
|---|---|---|
| production-like durable store / event bus / endpoint | 未进入 P0 硬门禁 | Step 13 风险接受;P1/P2 生产化详细设计、配置、部署和 staging evidence |
| secret provider / KMS / Vault | 未进入 P0 硬门禁 | 安全运维专项补 provider、轮换、审计、failure tests |
| config center / admin override / hot reload | 当前 unsupported fail-fast | 后续补权限、审计、reload、回滚、一致性和测试门禁 |
| old P95 SLA 硬化 | 当前只观察 | 若升级,先回写 `00 / 05 / 06` 并补性能专项 |
| nightly extended stress | 默认不阻断 P0 退出 | 失败建缺陷;release selected 可阻断 |
| staging-like 全量跨仓实测 | 不阻塞 P0 | P1/P2 专项 |

### 7.4 非功能裁决图

#### 非功能裁决图: Threshold / Evidence / Risk

```text
NFR gate
  |
  +-- hard thresholds
  |     -> 04 config values
  |     -> redline conditions
  |
  +-- observation only
  |     -> old P95 candidates
  |     -> samples / P50 / P95 report
  |
  +-- unsupported / deferred
        -> production-like dependencies
        -> secret provider / config center / hot reload
        -> Step 13 risk acceptance
```

关键说明:

- 无来源阈值不得成为 P0 硬门禁。
- 观察项缺报告可形成缺陷,但旧候选数字未达不直接阻断。
- redaction、authorization、fake fallback、配置越界、重复 truth 和 `latest` 路径属于阻断候选。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认旧 `100ms / 300ms` 不作为 P0 release 硬阈值 | 否 | 性能观察口径承接 | 无 | 无回写 |
| 确认 P0 硬阈值只来自 `04` 配置项和 `05` redline | 否 | 阈值来源门禁 | 无 | 无回写 |
| 确认可用性、安全、恢复、幂等一致性和路径红线进入非功能门禁 | 否 | NFR 门禁承接 | 无 | 无回写 |
| 确认 production-like、secret provider、config center、hot reload 等未覆盖专项进入风险承接 | 否 | 范围裁剪 | Step 13 | 待后续 Step |

说明:

```text
本步没有新增 NFR 阈值、配置项、测试用例或生产依赖。
本步只把已确认的非功能需求、配置阈值和测试证据转成可裁决门禁。
```

## 9. 回填草稿

正式 `06-验收标准.md` §9 建议采用以下结构:

```text
9. 非功能验收门禁
  9.1 性能观察与运行边界性能
  9.2 可用性、降级与可恢复性
  9.3 安全、授权与正文边界
  9.4 兼容性、profile 与跨仓依赖
  9.5 容量、limit 与 retry
  9.6 未覆盖专项与风险承接
```

正文草稿:

```text
本章用于裁决 `L1-work` 的非功能条件是否达到 P0 送验要求。性能门禁只要求核心 command / query / job 形成带样本、P50 / P95、fixture 规模和 profile 的观察报告;旧 `100ms / 300ms` 数字不作为本轮 release 硬阈值。

本章硬门禁只使用正式配置阈值和 redline 条件。query timeout、transaction timeout、job timeout、page limit、command body limit、batch、retry 和 outbox retry 必须按 `04-配置设计.md` 校验。raw secret / token / payload / source body、unauthorized truth leak、configured adapter fallback fake success、重复 truth、`latest` 证据路径和核心边界配置越界均阻断 release。
```

## 10. 待确认事项

无阻塞进入 Step 10 的待确认事项。

后续 Step 必须继续收口:

- Step 10 将 safe log、metric、trace、audit、evidence index、redaction report 和 acceptance handoff 转成证据门禁。
- Step 11 将 redaction 命中、unauthorized truth leak、配置越界、重复 truth 和 `latest` 证据路径正式纳入一票否决裁决。
- Step 13 将 production-like、secret provider、config center、hot reload 和 old P95 SLA 硬化等未覆盖专项转成风险接受或拒绝。

## 11. 进入下一步条件

- [x] P0 非功能维度已经列明。
- [x] 每个硬阈值均有来源。
- [x] 未覆盖专项及其验收影响已经列明。
- [x] 非功能失败的阻断口径已经列明。
- [x] 证据来源已经列明。
- [x] 用户审核并确认本 Step。
