# Step 2. 明确验收目标与范围

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 2
> 回填章节: `06-验收标准.md` §2 验收目标与范围
> 创建日期: 2026-06-28
> 当前模式: full-restart / step2-scope
> 当前状态: completed
> 当前模块: `R2.2 scope:再写入`
> 当前门禁: `R2.2` completed_wait_user_confirm_to_R3.1;等待确认进入 Step 3 `R3.1 baseline:先思考`

---

## R2.1 scope:先思考

### 1. 当前模块目标

`R2.1` 只思考新版 `06-验收标准.md` 的验收目标、P0/P1/P2 范围、非范围、下游接缝边界、潜在 VETO 来源和 R2.2 写入边界。

当前模块不修改正式 `06-验收标准.md`,不生成最终验收范围表,不定义具体 AC 编号,不固定真实 run_id,不填写真实测试结果,不进入 Step 3 基线固定。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R2.2 |
| 用户确认 | 已确认从 Step 1 completed 推进到 Step 2 `R2.1 scope:先思考`。 |
| 当前允许 | 思考验收目标、范围 / 非范围、P0/P1/P2 划分、下游接缝和 R2.2 写入策略。 |
| 当前禁止 | 修改正式 `06`;写最终 AC;固定基线;伪造 evidence;进入 Step 3。 |

### 2. 本模块输入承接

| 输入 | R2.1 关注点 | 禁止外推 |
|---|---|---|
| Step 1 输入映射 | `06` 只承接当前正式 `00`~`05`,旧 `06/07` 只作污染诊断。 | 从旧 `MethodContent` / publish / snapshot / outbox 主线恢复范围。 |
| `00-需求文档.md` §14 | 需求层验收类别、核心能力闭环、功能能力、规则边界、数据归属、接口依赖、非功能和一票否决项。 | 在 `06` 中新增需求目标或扩大核心资产类型。 |
| `05-测试方案.md` §2 | P0 core、P1 selected-run、P2 future 和非范围。 | 把 selected-run / future 写成 P0 pass 前置。 |
| `05-测试方案.md` §14 | residual、不可风险接受和转入 `06` 的事项。 | 用 residual 覆盖 VETO 或用未生成证据替代验收裁决。 |
| `03-详细设计.md` | 正式对象、状态、接口、flow、transaction、error、observability 和 test cut 名称来源。 | 在范围阶段补字段、port、state、artifact schema 或 report schema。 |
| `04-配置设计.md` | profile、dependency、redaction、adapter availability 和 config redline 范围。 | 把真实产品 SLA / 容量 / 部署认证写成当前 P0。 |

### 3. SOP Step 2 问题思考

| SOP 问题 | R2.1 初判 | R2.2 写入提醒 |
|---|---|---|
| 本轮验收的核心裁决目标是什么? | 判断 L3-method-library 的方法资产定义、正式化、版本、受控消费、分发、追溯、一致性、证据线索和边界安全是否在当前设计 / 测试基线下可被验收裁决。 | 写成裁决目标,不是项目愿景或测试目标复述。 |
| P0/P1/P2 验收范围如何划分? | P0 为 core controlled suite 能证明的核心闭环和红线;P1 为 selected-run / real-like / staging-like;P2 为 capacity、multi-region、tenant、dashboard、marketplace/package 等 future。 | 范围表必须显式区分 pass 前置、residual 和 future。 |
| 哪些下游能力只验接缝? | process、identity、runtime、member-images 等下游只验受控消费、引用、safe shell、handoff 和不可反写真相;governance / external provider 只验摘要、引用或条件型依赖接缝。 | 不把相邻仓运行 truth、治理执行、流程实例、成员状态或 UI 状态纳入本仓验收。 |
| 哪些非范围会影响最终结论? | 真实 provider SLA、真实容量、部署产品认证、真实执行 verdict、缺陷状态、生产 runbook 和 P1/P2 selected-run 不属于 P0,但可能进入 residual / risk acceptance。 | 后续 Step 13 处理风险接受,Step 14 处理最终结论影响。 |
| 哪些范围项可能成为一票否决? | truth owner、formal version silent overwrite、downstream replacing truth、unstable formal consumption、adjacent runtime truth ingress、source-missing patch、query/job/observability write truth、raw body/secret leakage、artifact/report pairing missing 等。 | R2.2 只标“潜在 VETO 来源”,正式 VETO 在 Step 11 裁决。 |
| 哪些验收范围必须使用详细设计正式字段、状态或接口名? | 方法资产 identity/catalog/formalization/version/consumption/distribution/traceability/job/report/config/redaction/observability 等 P0 范围必须回指 `03` 的正式契约。 | 不用口语化“功能正常”替代正式对象、状态、port、protocol 或 flow 名。 |

### 4. 范围候选抽取思考

#### 4.1 P0 core 候选

| 候选范围 | 来源 | R2.1 裁剪判断 |
|---|---|---|
| 方法资产统一定义与识别 | `00` §14.1;`05` §2.2 | P0。必须证明定义 truth 归属本仓,identity / catalog 可稳定识别,且不依赖消费仓私有模型。 |
| 方法资产正式化与版本稳定 | `00` §14.1;`05` §2.2 | P0。正式 / 非正式语境、formal version、显式变化和 state guard 是验收核心。 |
| 正式方法资产受控消费 | `00` §14.1;`05` §2.2 | P0。下游只能按引用、safe shell、snapshot/index/handoff 边界消费,不得拥有或修改定义 truth。 |
| 方法资产消费语境分发 | `00` §14.1;`05` §2.2 | P0。只验正式分发 / handoff / availability seam,不验真实外部产品 SLA。 |
| 追溯与消费一致性保护 | `00` §14.1;`05` §2.2 | P0。formalization、version semantic change、impact、lineage、audit 和 replay 需可追溯。 |
| 证据线索承接 | `00` §14.1;`05` §13 | P0。`EV-ML-*` 必须能支撑后续 `06` 裁决,但真实 run 由 Step 3/10 固定。 |
| 维护作业与报告 | `05` §2.2;`05` suite family | P0。只验 job 不反写真相、report 可审计、artifact/report 成对。 |
| 横切安全边界 | `00` §14.1;`05` §2.2/§14.3 | P0。redaction、dependency、config、observability、safe diagnostics 和 marker source 属核心红线。 |

#### 4.2 P1 selected-run 候选

| 候选范围 | 来源 | R2.1 裁剪判断 |
|---|---|---|
| durable / real-like adapter | `05` §2.2;§14.2 | P1。可作为 selected-run 或 residual,不可替代 P0 fake / controlled seam。 |
| 真实外部服务 | `05` §2.2;§14.2 | P1。只在产品、环境和数据基线锁定后验收。 |
| staging-like profile | `05` §2.2 | P1。不可作为 P0 profile available 的替代证据。 |
| selected-run 报告 | `05` §13;§14.2 | P1。可进入 risk / residual,不能覆盖 P0 blocking suite 缺口。 |

#### 4.3 P2 future 候选

| 候选范围 | 来源 | R2.1 裁剪判断 |
|---|---|---|
| production-like capacity / long-run | `05` §2.2;§14.2 | P2。当前无容量模型、负载模型和部署基线,只能保留 sample/trend 或 future。 |
| multi-region / tenant profile | `05` §2.2 | P2。当前不作为 P0 pass 前置。 |
| 高级 dashboard | `05` §2.2;`00` 风险待确认 | P2。只作外围增强,不得阻塞核心闭环。 |
| 复杂 marketplace / package 体验 | `05` §2.2;`00` 风险待确认 | P2。peripheral / future,不得反向扩大核心方法资产范围。 |

### 5. 下游接缝和非范围思考

| 对象 | R2.1 验收边界 | 非范围 / 风险 |
|---|---|---|
| process / identity / runtime / member-images | 验受控消费、正式引用、safe shell、handoff 和不可反写真相。 | 不验流程实例、成员状态、运行时执行真相或下游 UI 状态。 |
| governance | 验条件型治理结论引用 / 摘要边界,不迁入治理执行。 | 不验 Gate 流程、policy enforce 结果或治理仓状态机。 |
| capability-hub / marketplace / UI | 只验不打穿本仓 truth boundary,高级体验作为 P2/future。 | 不验交易、安装、履约、dashboard 产品体验。 |
| external provider / artifact/archive | 只验引用、摘要、redaction、正文不入库和 source-missing stop。 | 不验 provider SLA、artifact 正文生命周期或归档系统。 |

### 6. 旧正式 06 污染思考

| 旧范围口径 | R2.1 判断 | R2.2 处理 |
|---|---|---|
| P0 MethodContent 七类资产 | 与当前方法资产闭环不一致。 | 不进入新版范围表。 |
| publish / snapshot / outbox / fingerprint | 旧详细设计和旧测试主线。 | 只作为污染项,不得成为 AC 或 EV 来源。 |
| PostgreSQL / object storage / fake bus / gateway | 旧环境和产品假设。 | 不作为当前 P0 环境范围。 |
| P95 / SLO 硬阈值 | 当前 `05` 只承认 sample/trend。 | Step 9 再判断是否可硬化,Step 2 不继承。 |

### 7. R2.2 写入策略思考

R2.2 应写入 Step 2 的完整中间产物,但仍不修改正式 `06-验收标准.md`。

| 写入范围 | 目的 |
|---|---|
| 验收目标 | 明确本轮裁决的是 P0 core 是否可通过验收,不是产品发布或生产认证。 |
| 范围 / 非范围表 | 按 P0/P1/P2 和 seam-only / non-scope 划清 pass 前置、residual 和 future。 |
| 潜在 VETO 来源 | 将需求和测试中的不可风险接受项转成 Step 11 候选输入。 |
| 详细设计名称使用规则 | 规定 P0 范围后续 AC 必须回指正式对象、状态、port、protocol、flow、artifact/report path。 |
| 回填草稿 | 提供未来 `06` §2 草稿,不写正式文档。 |
| 进入 Step 3 条件 | 用户确认 R2.2 后才允许进入基线固定。 |

### 8. R2.2 写入边界思考

`R2.2 scope:再写入` 可以写入:

1. `06_acceptance_step_02_scope.md` 的 SOP 问题回答、范围候选裁剪、范围 / 非范围表、潜在 VETO 输入和回填草稿。
2. `06_acceptance_calibration_flow.md` 推进到 Step 2 completed_wait_user_confirm_to_R3.1。
3. `project_execution_ledger.md` 推进到 `06` Step 2 completed_wait_user_confirm_to_R3.1。

`R2.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. Step 3 验收基线、真实 run_id、真实 evidence、真实 defect status 或最终 verdict。
3. 具体 AC 编号全集、VETO 正式清单、risk acceptance 正式结论。
4. 新需求、设计字段、port、state、config key、artifact schema、report schema、CI YAML 或 implementation boundary。

### 9. R2.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 2 R2.1 | pass |
| 是否承接 `00` §14 和 `05` §2 / §14 | pass |
| 是否区分 P0/P1/P2 与非范围 | pass |
| 是否识别潜在 VETO 但未正式裁决 VETO | pass |
| 是否未修改正式 `06-验收标准.md` | pass |
| 是否形成 R2.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 2 `R2.2 scope:再写入`;只允许写入 Step 2 的 SOP 问题回答、验收目标、范围 / 非范围表、潜在 VETO 输入、详细设计名称使用规则、回填草稿、待确认事项和进入 Step 3 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R2.2 scope:再写入

### 1. 当前模块目标

`R2.2` 根据用户确认,完成 Step 2 的正式中间产物:把验收目标、P0/P1/P2 范围、非范围、下游接缝、潜在 VETO 来源和后续 AC 命名约束写成可回填到新版 `06-验收标准.md` §2 的草稿。

当前模块不修改正式 `06-验收标准.md`,不固定验收基线,不生成正式 AC 编号全集,不填写真实 run_id、真实测试结果、缺陷状态、风险接受结论或最终 verdict。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R3.1 |
| 用户确认 | 已确认从 R2.1 推进到 R2.2。 |
| 当前允许 | 写入 Step 2 的 SOP 问题回答、验收目标、范围 / 非范围表、潜在 VETO 输入、回填草稿和进入 Step 3 条件。 |
| 当前禁止 | 修改正式 `06`;固定 baseline;写真实 evidence;写最终 AC/VETO/风险接受结论;进入 Step 3。 |

### 2. 本步目标

本 Step 定义新版 `06-验收标准.md` 本轮裁决什么、不裁决什么,并明确 P0/P1/P2 在最终验收结论中的地位。

本 Step 只回答:

- 本轮验收的核心裁决目标。
- 哪些能力属于 P0 必须裁决范围。
- 哪些能力只验下游或外部接缝。
- 哪些能力属于 P1 selected-run、P2 future 或 residual,不作为当前 P0 通过前置。
- 哪些范围项可能在 Step 11 成为一票否决项。
- 后续 P0 验收项必须使用哪些正式设计名称来源。

本 Step 不回答:

- 本轮按哪一个送验 commit、run_id、profile、config digest 或 artifact root 验收。
- 每条正式 AC 的编号、通过条件、失败条件和 evidence path。
- 最终验收结论、缺陷关闭结论、风险接受签署或 release sign-off。

### 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | completed | 提供验收输入边界、旧 `06/07` 处理口径和后续基线待固定项。 |
| `00-需求文档.md` §14 | formal completed | 提供核心能力闭环、功能能力、规则 / 边界、数据归属、接口依赖、非功能和一票否决项。 |
| `00-需求文档.md` §15 | formal completed | 提供 peripheral / future、待确认事项和不得恢复旧主线的风险。 |
| `03-详细设计.md` | formal completed | 提供对象、port、protocol、flow、state、transaction、error、observability 和 test cut 的正式名称来源。 |
| `04-配置设计.md` | formal completed | 提供 profile、config validation、dependency、redaction、adapter availability 和 degradation 边界。 |
| `05-测试方案.md` §2 | formal completed | 提供 P0 core、P1 selected-run、P2 future 和非范围。 |
| `05-测试方案.md` §13~§14 | formal completed | 提供 `EV-ML-*` 证据方向、report / artifact 根、residual 和不可风险接受项。 |
| L1-governance Step 2 | framework_reference | 只参考中间产物粒度、范围表结构和停审方式,不得复制 governance 领域事实。 |

### 4. SOP 问题回答

| SOP 问题 | 回答 |
|---|---|
| 本轮验收的核心裁决目标是什么? | 裁决 `L3-method-library` 是否作为方法资产定义、正式化、版本、受控消费、分发、追溯、一致性保护、证据线索和边界安全的事实真相仓成立,并能否在当前设计 / 测试基线下阻断核心红线。 |
| P0/P1/P2 验收范围如何划分? | P0 裁决 method asset truth、identity/catalog、formalization/version、controlled consumption、distribution/handoff、traceability/impact/evidence、maintenance job/report、config/dependency/redaction/observability。P1 裁决 durable / real-like adapter、真实外部服务、staging-like profile 和 selected-run,但不作为 P0 pass 前置。P2 记录 production-like capacity、multi-region、tenant profile、高级 dashboard、复杂 marketplace / package 等 future。 |
| 哪些下游能力只验接缝? | process、identity、runtime、member-images、governance、capability-hub、marketplace、UI/console、external provider 和 artifact/archive 只验 typed ref、safe shell、summary、handoff、adapter availability、redaction 和不可反写真相,不验对方内部 truth。 |
| 哪些非范围会影响最终结论? | P1/P2 unavailable 不导致 P0 不通过,但如果缺 residual 记录、误标为 P0 passed、或用 P1/P2 证据覆盖 P0 blocking suite 缺口,会影响有条件通过和送验交接。P0 红线和不可风险接受项不得用 residual 覆盖。 |
| 哪些范围项可能成为一票否决? | truth 不归属本仓、下游替代定义、正式版本语义静默覆盖、未正式化资产被正式消费、相邻仓 runtime truth 进入本仓、source-missing stop 被私补、query/job/observability 反写真相、raw body/secret 泄露、non-core sibling compile dependency、artifact/report pairing 缺失、`latest` 正式引用、static evidence 伪 pass、P0 profile unavailable 却标记 passed。 |
| 哪些验收范围必须使用详细设计正式字段、状态或接口名? | P0 的 method asset identity/catalog/formalization/version/consumption/distribution/traceability/impact/evidence/job/report/config/redaction/observability 范围,后续 AC 必须回指 `03` 的正式对象、状态、port、protocol、flow、error、marker source 和 `05` 的 `TC-ML-*` / `EV-ML-*`。 |

### 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 范围仍围绕旧 P0 MethodContent / publish / snapshot / fingerprint / outbox。 | 新版范围只承接当前 `00`~`05` 的 method asset truth、formalization、consumption、traceability、evidence 和 boundary 主线。 |
| 旧 `06-验收标准.md` | 将 PostgreSQL、object storage、fake bus、gateway 等产品假设写入验收范围。 | 本 Step 改为 P0 controlled seam;真实产品只进入 P1/P2。 |
| 旧 `06-验收标准.md` | 使用旧 EV-001 / TC-CMD / GATE-T 等编号。 | 后续验收只能使用当前 `TC-ML-*`、`EV-ML-*`、suite family 和 fixed report path。 |
| 旧 `06-验收标准.md` | 继承 P95 / SLO 硬阈值。 | 当前只保留 sample/trend;是否硬化交给 Step 9。 |
| 当前 `05-测试方案.md` | 已给 P0/P1/P2 测试范围,但 `06` 需要转成裁决范围。 | 本 Step 将测试范围转换为验收范围和非范围。 |

### 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 核心裁决 | 旧方法内容发布同步闭环。 | L3-method-library 方法资产事实真相仓和受控消费闭环是否成立。 | 承接当前 full-restart 后的 `00`~`05`。 |
| P0 范围 | 旧 MethodContent、publish、snapshot、outbox、环境假设混写。 | definition、catalog、formalization、version、consumption、distribution、traceability、evidence、job/report、config/redaction/dependency/observability。 | 防止旧主线污染新版验收。 |
| P1/P2 | 与 P0 环境和产品假设混写。 | P1 selected-run 和 P2 future 明确不作为 P0 pass 前置。 | 防止真实外部产品不可用阻断 P0 或被伪造成 P0 证据。 |
| 下游能力 | 容易被写成 E2E 或相邻仓状态验收。 | 只验接缝和不可反写真相。 | 保持仓级事实真相边界。 |
| VETO 输入 | 旧文档缺少当前 `05` 的 evidence integrity 红线。 | 将不可风险接受项纳入 Step 11 候选输入。 | 保持测试证据和验收裁决闭环。 |

### 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否沿用旧 `06` 的范围主语 | A. 沿用;B. 按当前 `00`~`05` 重建。 | 采用 B。旧主语与当前方法资产闭环、测试编号和证据方向冲突。 |
| 是否把 P1 real-like selected-run 作为通过前置 | A. 是;B. 否。 | 采用 B。P0 使用 controlled seam 证明正式语义;P1 只能作为 selected-run / residual。 |
| 是否把 production-like capacity 纳入当前 P0 | A. 纳入;B. 记录为 P2/future。 | 采用 B。当前没有正式容量模型、负载模型和部署基线。 |
| 是否验下游仓内部 truth | A. 验;B. 只验接缝。 | 采用 B。相邻仓内部 truth 由相邻仓验收,本仓只验引用 / 摘要 / handoff / boundary。 |
| 是否在 Step 2 固定正式 AC 编号 | A. 固定;B. 暂不固定。 | 采用 B。Step 5~11 才逐项闭环 AC、evidence 和裁决影响。 |

### 8. 结构化中间产物

#### 8.1 验收目标

| 验收目标 | 来源 | 裁决口径 |
|---|---|---|
| 证明方法资产定义真相归属本仓 | `00` §14.1;`01` truth boundary;`03` object / flow | 方法资产定义、身份目录、正式化版本、关系、分发、追溯和证据线索不得被消费仓或运行仓替代。 |
| 证明正式化与版本稳定成立 | `00` FR-ML-003~004;`03` state / version / change flow | 正式版本语义稳定,正式 / 非正式语境可区分,变化必须显式并可追溯。 |
| 证明受控消费与分发成立 | `00` FR-ML-005~006;`03` protocol / handoff;`05` suite | 下游只能通过正式引用、safe shell、summary、handoff 或受控消费边界使用方法资产语义。 |
| 证明追溯、一致性和证据线索成立 | `00` FR-ML-007~009;`03` trace / audit / impact / job;`05` EV | formalization、version semantic change、impact、lineage、audit、evidence 和 report 可回指源。 |
| 证明配置、安全、依赖和可观测边界成立 | `04`;`05` redline / dependency / redaction / observability | P0 profile、config fail-fast、dependency boundary、redaction、safe diagnostic 和 metric / trace / report body-free 成立。 |

#### 8.2 验收范围表

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---|---|---|
| 方法资产定义 truth 与 Definition vs Use | core truth | P0 | 方法资产定义由本仓拥有,消费仓不得创建、修改、替代定义 truth。 | 不验相邻仓内部对象生命周期。 |
| 方法资产 identity / catalog / boundary | core truth | P0 | typed ref、catalog、适用语境和 boundary 能稳定识别方法资产。 | 不要求 UI catalog 体验或 marketplace 搜索。 |
| 正式化、正式版本和显式变化 | lifecycle / version | P0 | formalization、formal version、state guard 和 semantic change 必须显式且可追溯。 | 不继承旧 publish / fingerprint 语义。 |
| 受控消费和安全 public shell | consumption | P0 | 下游只能按正式消费边界、safe shell、summary 或 snapshot/index 使用。 | 不验 process / identity / runtime 的内部执行。 |
| 方法资产分发、handoff 和 availability | distribution seam | P0 | 分发 / handoff / unavailable / degraded 语义可裁决,不得手工同步作为唯一口径。 | 不要求真实 message bus 或外部产品 SLA。 |
| 关系、引用、外部摘要和正文隔离 | relation / reference | P0 | external summary / reference / sidecar 不形成第二真相源,raw body 不进入本仓。 | 不验外部 provider 正文质量。 |
| 追溯、audit、lineage 和 impact protection | traceability | P0 | version、change basis、consumer impact、lineage 和 audit refs-only 可追溯。 | 不把观测材料替代 truth。 |
| 证据线索和 report integrity | evidence | P0 | `EV-ML-*` 可回指 `TC-ML-*`、suite、artifact、report 和后续 AC/VETO。 | 不填写真实 run 结果。 |
| 维护作业、replay 和 no truth repair | operations job | P0 | job/report/replay 可审计,query/job/observability 不隐式修复或反写真相。 | 不作为业务修改入口。 |
| 配置 profile、adapter availability 和 config redline | config | P0 | P0 profile 可装配,invalid config fail-fast,forbidden boundary 不可配置化绕过。 | `staging-like` / `production-like` 不作为 P0 必过。 |
| dependency boundary 和 non-core sibling 隔离 | dependency | P0 | 非核心 sibling 不得形成 compile-time business dependency。 | 不禁止受控 runtime/event/ref 协作。 |
| redaction、safe diagnostic 和 observability boundary | security / observability | P0 | raw body、secret、provider response、敏感正文不得进入 log、metric、trace、audit、report。 | 不验外部观测产品物理存储。 |
| durable / real-like adapter selected-run | product seam | P1 | 真实或类真实 adapter 可作为 selected-run 验 seam 和 failure mapping。 | 不覆盖 P0 controlled suite 缺口。 |
| 真实外部服务和 staging-like profile | product seam | P1 | 产品、环境和数据锁定后可作为补充验收。 | 不作为当前 P0 pass 前置。 |
| production-like capacity / multi-region / tenant profile | operations future | P2 | 后续基于容量模型、负载模型、部署基线另行验收。 | 当前仅作为 residual / future。 |
| advanced dashboard / marketplace / package 体验 | peripheral enhancement | P2 | 后续验证不破坏核心 truth boundary。 | 不阻塞核心闭环验收。 |

#### 8.3 只验接缝的下游 / 外部能力

| 下游 / 外部能力 | 本轮验收内容 | 不裁决内容 | 裁决影响 |
|---|---|---|---|
| `L1-process` | 方法资产引用、消费边界、safe shell 和不可反写真相。 | 流程实例、活动执行、运行状态和流程 UI。 | 接缝失败可阻断相关 P0;内部生命周期留给 process。 |
| `L1-identity` | typed actor / member ref、权限上下文引用和边界消费。 | 成员状态、身份生命周期、认证鉴权实现。 | 身份正文入仓或反写真相触发红线。 |
| `L2-runtime` / runtime consumers | method ref、runtime consumption shell、no runtime truth ingress。 | 执行循环、调度、工具调用、运行状态。 | runtime truth 进入本仓触发 VETO 候选。 |
| `L4-member-images` | 方法资产语义引用和输出消费边界。 | image 生成、成员画像生命周期、UI 表达。 | 只验消费边界,不验生成质量。 |
| `L1-governance` | governance conclusion / summary ref 条件型引用。 | Gate 执行、policy enforce、治理状态机。 | 治理执行迁入本仓触发红线。 |
| capability-hub / marketplace / package | 外围增强不得拥有方法资产 truth。 | 交易、安装、履约、复杂 marketplace 体验。 | 作为 P2/future,不得阻断 P0。 |
| UI / console | display shell 和安全引用。 | UI 状态、dashboard 体验、交互细节。 | UI 不得成为 truth source。 |
| external provider / artifact/archive | external summary / reference / sidecar、source-missing stop、redaction。 | provider SLA、外部正文生命周期、archive restore。 | raw body / provider response 泄漏触发 VETO 候选。 |

#### 8.4 P0 / P1 / P2 裁决口径

| 优先级 | 验收裁决地位 | 证据要求 | 不得误用 |
|---|---|---|---|
| P0 | 必须可得出通过 / 失败 / VETO 影响;缺关键证据时不得通过。 | 必须闭环到 `TC-ML-*`、`EV-ML-*`、suite artifact、report path 和正式设计契约。 | 不得用 static evidence、`latest`、P1 selected-run 或口头说明替代。 |
| P1 | 可作为 selected-run、residual 或增强验收;不作为当前 P0 通过前置。 | 可进入 evidence index 或 risk report,但必须标明 non-P0 / residual。 | 不得覆盖 P0 suite 缺口或被标记为 P0 passed。 |
| P2 | 仅作为 future risk / operations readiness / product enhancement 输入。 | 可记录 owner、触发条件和后续验收方向。 | 不得进入当前 pass/fail 结论。 |

#### 8.5 范围项到一票否决候选

| 候选否决方向 | 对应范围项 | 触发含义 |
|---|---|---|
| truth 不归属本仓 | definition truth、catalog、formalization、version | 方法资产定义真相不能明确由本仓拥有。 |
| 下游替代定义 | controlled consumption、handoff、runtime seam | 消费仓可以创建、修改或替代方法资产定义 truth。 |
| 正式版本语义静默覆盖 | formal version、semantic change、state guard | 已正式使用语义被无显式变化覆盖。 |
| 未正式化资产被正式消费 | formalization、consumption shell | 不稳定或未正式化方法资产进入正式消费依据。 |
| 相邻仓 runtime truth 进入本仓 | process / identity / runtime / UI seam | 相邻仓正文、状态或执行结果成为本仓 truth。 |
| source-missing stop 被私补 | external summary / reference / sidecar | source missing / unavailable 被默认值、字符串或 fake 私补。 |
| query/job/observability 反写真相 | query、operations job、observability | 读面、维护作业或观测材料隐式创建、修改、批准或修复 truth。 |
| raw body / secret 泄露 | redaction、report、outbox、diagnostic | 原文、secret、provider response 或敏感正文进入可观察输出。 |
| non-core sibling compile dependency | dependency boundary | 非核心 sibling 形成 compile-time business dependency。 |
| artifact/report pairing 缺失 | evidence / report integrity | raw artifact 和 human report 无法成对追溯。 |
| `latest` 或 static evidence | baseline / evidence | 正式证据引用不固定或静态伪 pass。 |
| P0 profile unavailable marked passed | config profile | P0 profile 不可用却被标为通过。 |

#### 8.6 详细设计名称使用规则

| 后续范围 | 必须使用的正式来源 | 禁止写法 |
|---|---|---|
| P0 功能验收项 | `03` 对象、port、protocol、flow、state、error、test cut;`05` TC / EV。 | “功能正常”“基本可用”“流程跑通”。 |
| P0 边界红线 | `00` BR / NFR / VETO;`01` truth boundary;`04` config/dependency/redaction;`05`不可风险接受。 | “边界清楚”“安全通过”。 |
| P0 证据门禁 | `05` artifact root、report root、EV family、suite family。 | “证据见报告”“最新报告”。 |
| P1/P2 residual | `05` residual / selected-run;`00`风险待确认。 | 将 residual 写成 P0 passed。 |

### 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“验收目标”“验收范围表”“只验接缝的下游 / 外部能力”“P0 / P1 / P2 裁决口径”“范围项到一票否决候选”和“详细设计名称使用规则”小节,了解本章范围如何收敛。

正式 `06-验收标准.md` §2 应回填:

本轮验收目标是裁决 `L3-method-library` 是否作为方法资产定义、正式化、版本、受控消费、分发、追溯、一致性保护、证据线索和边界安全的事实真相仓成立。验收范围以当前 `00`~`05` 为基线,不继承旧 `MethodContent` / publish / snapshot / outbox / PostgreSQL / gateway / P95 主线。

P0 范围包括方法资产 definition truth、identity/catalog、formalization/version、controlled consumption、distribution/handoff、external summary/reference、traceability/impact/evidence、operations job/report、config profile、dependency boundary、redaction 和 observability boundary。P0 验收项后续必须能回指正式设计契约、`TC-ML-*`、`EV-ML-*`、suite artifact 和 report path。

P1 范围包括 durable / real-like adapter、真实外部服务、staging-like profile 和 selected-run。P1 可作为 residual 或增强验收,不得替代 P0 controlled suite。P2 范围包括 production-like capacity、multi-region、tenant profile、高级 dashboard、复杂 marketplace / package 等 future 能力,不参与当前 pass/fail 前置。

process、identity、runtime、member-images、governance、capability-hub、marketplace、UI/console、external provider 和 artifact/archive 只验 typed ref、safe shell、summary、handoff、adapter availability、redaction 和不可反写真相,不验对方内部 truth 或产品体验。

凡涉及 truth 不归属本仓、下游替代定义、正式版本语义静默覆盖、未正式化资产正式消费、相邻仓 truth 进入本仓、source-missing stop 被私补、query/job/observability 反写真相、raw body/secret 泄露、non-core sibling compile dependency、artifact/report pairing 缺失、`latest` 正式引用、static evidence 伪 pass 或 P0 profile unavailable marked passed 的范围项,均进入 Step 11 一票否决候选。

### 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| P1 selected-run 是否在某个 release candidate 中强制 | 影响 Step 13 风险接受和 Step 14 最终结论。 | 当前不作为 P0 前置;后续由风险接受 / release sign-off 裁决。 |
| performance hard threshold 是否硬化 | 影响 Step 9 非功能门禁。 | 当前只保留 sample/trend;没有正式环境、负载和阈值时不得裁决 pass/fail。 |
| evidence retention period 是否由 `06` 固定 | 影响 Step 10 证据门禁和 Step 13 风险接受。 | 当前列为后续基线 / 运维归档待固定项。 |
| external provider / durable product certification 是否升级 | 影响 P1/P2 范围。 | 当前作为 selected-run / future,不得进入 P0 pass 前置。 |

### 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收目标可裁决 | pass | 已聚焦 L3-method-library 方法资产事实真相仓和核心闭环。 |
| P0/P1/P2 边界明确 | pass | P1/P2 不作为当前 P0 通过前置。 |
| 只验接缝的下游 / 外部能力已列出 | pass | 已明确不验相邻仓内部 truth。 |
| 潜在 VETO 来源已形成 Step 11 输入 | pass | 已与 P0 范围和 `05` 不可风险接受项对齐。 |
| 可进入 Step 3 | pass | 下一步固定验收基线;进入前等待用户确认。 |

### 12. R2.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按 R2.1 写入边界执行 | pass |
| 是否参考 L1-governance 的 Step 2 框架但未复制领域事实 | pass |
| 是否完成 SOP Step 2 问题回答 | pass |
| 是否形成范围 / 非范围表 | pass |
| 是否显式区分 P0/P1/P2 | pass |
| 是否识别只验接缝的下游 / 外部能力 | pass |
| 是否只形成潜在 VETO 输入,未正式裁决 VETO | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 3 `R3.1 baseline:先思考`;只允许思考验收基线、source refs、implementation commit、profile、config digest、run_id、artifact/report root、acceptance handoff 和禁止 `latest` 的基线规则;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
