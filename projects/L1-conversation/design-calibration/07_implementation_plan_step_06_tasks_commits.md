# L1-conversation 07 实施计划 Step 6: 阶段任务、编写顺序与提交边界

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` §6 阶段任务拆分、编写顺序与提交边界
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 6 |
| 主题 | 拆分阶段任务、编写顺序与提交边界 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_06_tasks_commits.md` |

本步把 PH-01~PH-08 拆成阶段任务、代码实现批次和 commit boundary。本步不创建正式 `07-实施计划.md`，不执行实现仓代码修改。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-08 阶段顺序和阶段门禁 |
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 继承交付物、非交付物和跨仓依赖边界 |
| `03-详细设计.md` §4~§16 | 已完成 | 提取实现契约、处理流、状态机、事务、幂等、配置和测试切口 |
| `05-测试方案.md` §4~§14 | 已完成 | 提取每阶段测试切口、用例族、artifact 和 report 证据 |
| `06-验收标准.md` §5~§14 | 已完成 | 提取每阶段验收门禁、VETO 和证据完整性要求 |
| `standards/document/实施计划书写规范.md` | 已完成 | 约束代码批次、提交时机、commit message 和分批规模 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 每个阶段内有哪些实施动作 | 每个阶段拆为契约 / 测试切口、domain / application、infra / entry wiring、证据门禁四类动作。 |
| 2. 每个任务的输入、输出和完成判定是什么 | 阶段任务表逐项列出输入、输出和可验证完成判定，不使用“完善相关代码”。 |
| 3. 阶段内代码应该按什么顺序写，为什么 | 先锁定协议和测试切口，再写 domain / application，再接 infra / entry，最后跑 gate 和证据。 |
| 4. 是否先锁定外部契约和测试切口，再填内部实现 | 是。DTO、fixture、negative case、expected evidence 先落骨架，防止内部实现漂移。 |
| 5. 哪些任务必须同提交，哪些任务必须分开提交 | 同一可验证纵切内的 DTO、domain、service、adapter 和测试可同提交；不同阶段、不同状态链和 final reports 不混提交。 |
| 6. 哪些时机可以 commit，哪些时机不能 commit | 一个 commit boundary 对应的批次和门禁全部通过后可以 commit；未编译、未测试、缺证据或混入无关功能时不能 commit。 |
| 7. 哪些测试必须在提交前执行 | 至少执行本 boundary 声明的 fmt / check / unit / contract / service / query / worker / job / redaction / report check。 |
| 8. 是否存在提交边界过大或过小的问题 | 有。按文件或单 struct 提交过小；把 PH-02~PH-07 混成一笔过大。本文按功能纵切和风险隔离点拆分。 |
| 9. 是否存在把无关修改混入同一提交的风险 | 有。scripts / reports 容易混入业务阶段，production adapter 容易混入 P0 fake 阶段。本文明确“不包含内容”。 |
| 10. 每个提交边界能否用一句话描述 | 必须能。一句话说不清的 boundary 需要拆分或重排。 |
| 11. 每个提交边界是否可以独立 review、独立验证、必要时独立回退 | 必须可以。每个 boundary 都绑定门禁和不包含内容。 |
| 12. 本阶段是否存在单批代码预计超过 300 行或 500 行的实现动作 | PH-02~PH-07 都可能超过 300 行，因此拆成多个 100~300 行批次；预计超过 500 行的动作不得单批实现。 |
| 13. 哪些实现动作必须拆成多个代码批次 | 状态机、事务 / UoW、幂等、consumer quarantine、handoff、projection、redaction、report generation 必须拆批次。 |
| 14. 哪些高风险逻辑必须单独批次实现 | 状态机、事务、并发、幂等、安全 / redaction、审计、错误恢复、跨仓事件同步均单独批次或单独门禁。 |
| 15. 每个代码批次完成后应该执行哪些门禁 | 每批至少执行 fmt / check / 相关 unit 或 integration；阶段边界执行对应 gate script 和 evidence check。 |
| 16. 每个代码批次与提交边界是什么关系 | 一个 commit boundary 可包含一个或少数几个强相关批次；批次通过后再判断是否达到 commit boundary。 |
| 17. 每个 phase / commit boundary 开工前需要复核哪些字段、DTO、状态、证据和 phase boundary | 见 §8 的开工前设计闭环复核矩阵。 |
| 18. 发现详细设计、测试方案、验收标准之间冲突时如何处理 | 暂停当前 boundary，记录 blocker，回写 design repo；不得自行选边继续实现。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| Step 5 只有阶段级顺序 | 没有阶段内任务、批次和提交边界 | 实施者仍可能按文件或对象随意提交 | 本步为每个 PH 定义任务、批次、boundary |
| 高风险逻辑容易混在大提交中 | 状态机、幂等、事务、consumer、handoff、projection 均跨模块 | review 和回退成本过高 | 高风险逻辑单独批次，并绑定测试 |
| scripts / reports 容易散落提交 | 证据骨架和最终 handoff 都需要脚本支持 | 提交边界混乱 | PH-01 建骨架，PH-08 做最终报告收口 |
| production adapter 容易混入 P0 | fake / in-memory 与 production adapter 都在 infra 位置 | 范围膨胀 | 每个 boundary 明确不包含 production adapter |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 阶段任务 | 只有 PH-01~PH-08 名称 | 每阶段有 IMPL 任务表 | 实施动作可执行 |
| 编写顺序 | 只有阶段依赖 | 每阶段按 contract/test -> domain/service -> adapter/entry -> gate 编排 | 降低返工 |
| 代码批次 | 未定义 | 每阶段有 BATCH 表和规模判断 | 防止超大批次 |
| 提交边界 | 未定义 | 每阶段有 commit boundary、时机、包含和不包含 | 方便 review 和回退 |
| 设计复核 | 未落到 boundary | 每个 boundary 都要求字段、DTO、状态、证据和 phase boundary 复核 | 防止 1:1 实现时自行补设 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 一个阶段一笔提交 | 简单 | PH-02~PH-07 过大，风险集中 | 不采用 |
| 一个文件一笔提交 | 容易局部 review | 无法表达功能闭环，提交过碎 | 不采用 |
| 一个可验证纵切一笔提交 | 能独立验证和回退 | 需要明确批次与门禁 | 采用 |
| 测试最后统一提交 | 编码阶段快 | 不符合实施计划和验收要求 | 不采用 |
| 测试与功能同 boundary | 保证每笔提交可验证 | body 需要按子功能分组 | 采用 |

## 7. 结构化中间产物

### 7.1 全局编写顺序规则

| 顺序 | 动作 | 原因 |
|---:|---|---|
| 1 | 阅读本阶段正式章节和对应 `design-calibration` | 确认本阶段输入边界 |
| 2 | 先写或更新测试切口、fixture、DTO / protocol skeleton | 先锁定外部行为和失败场景 |
| 3 | 写 domain 状态 / policy / value object | 保证不变量独立可测 |
| 4 | 写 application service、port、UoW / idempotency 编排 | 把事务、幂等和副作用集中在 application |
| 5 | 写 infra fake / in-memory adapter 和 entry wiring | 支撑 P0 可验证路径 |
| 6 | 跑本批次门禁并生成 artifact | 确认批次可验证 |
| 7 | 达到 commit boundary 后提交 | 只提交已验证的可 review 增量 |

### 7.2 PH-01 仓初始化与证据骨架

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-01-01 | 1 | 创建目标仓和 Rust workspace skeleton | `03` §4、Step 3 | `/home/aris/Projects/quantalithos-conversation`、root `Cargo.toml`、`crates/*` | workspace 可执行 `cargo check` |
| IMPL-01-02 | 2 | 接入 `core-contracts` path dependency | `03` §3 / §4 | Cargo path dependency | compile 能解析 `core_contracts` |
| IMPL-01-03 | 3 | 创建基础 JSON config、runtime builder skeleton 和 fixture root | `04` §3~§9 | config fixtures、`ConversationRuntimeConfig` skeleton | config smoke skeleton 可运行 |
| IMPL-01-04 | 4 | 创建 gate / report / check scripts 与 evidence root | `03` §15、`05` §13 | `scripts/*`、`artifacts/test/<run_id>`、`reports/` | scripts 支持 required args |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-01-01 | 形成可编译 workspace 和 core dependency | `03` §4、Step 3 | Cargo workspace、empty crate lib / bin、path dependency | 100~300 行 | `cargo check`、命名检查 | commit-01-a |
| BATCH-01-02 | 形成脚本和证据路径骨架 | `03` §15、`05` §13 | gate / report / check script skeleton、artifact / report README | 100~300 行 | script `--help`、path grep | commit-01-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-01-a | workspace、crate skeleton 和 `core-contracts` dependency 可编译后 | root workspace、`crates/*` skeleton、Cargo dependency | 业务 DTO、domain 状态、API route | `cargo check`、命名检查 |
| commit-01-b | scripts 和 evidence roots 可检查后 | gate / report / check script skeleton、artifact / report 目录规则、config skeleton | 业务测试实现、release gate 完整报告 | script `--help`、artifact / report path check |

### 7.3 PH-02 Space / scope truth 最小纵切

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-02-01 | 1 | 定义 space / scope command DTO、receipt 和 fixtures | `03` §7、`05` `TC-CONV-SPACE-*` | `CreateConversationSpace`、scope commands、fixtures | DTO roundtrip 和 validation tests 通过 |
| IMPL-02-02 | 2 | 实现 space、participant scope、visibility scope 状态与 policy | `03` §6 / §9、`06` AC-FUNC-001 | space / scope domain、visibility guard | state transition / sealed visibility tests 通过 |
| IMPL-02-03 | 3 | 实现最小 repository、UoW、idempotency 和 audit 写路径 | `03` §10~§14 | in-memory repository、UoW、idempotency record、audit entry | transaction / idempotency tests 通过 |
| IMPL-02-04 | 4 | 接入 minimal API handler 和 service flow | `03` §8、`06` AC-SYNC-001 | handler、service、error mapping | `TC-CONV-SPACE-*`、`TC-CONV-SCOPE-*` 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-02-01 | 锁定 space / scope 协议和 fixture | `03` §7、`05` cases | DTO、receipt、fixture、contract tests | 100~300 行 | DTO roundtrip / validation | commit-02-a |
| BATCH-02-02 | 实现 space / scope domain 和 visibility policy | `03` §6 / §9、`06` AC-RED-004 | domain object、status、policy、unit tests | 100~300 行 | domain unit + visibility tests | commit-02-a |
| BATCH-02-03 | 实现写事务、idempotency、audit 和 handler | `03` §8 / §10~§14 | service、repo / UoW fake、handler、service tests | 需拆分；每批不超过 300 行 | `TC-CONV-SPACE-*`、`TC-CONV-SCOPE-*` | commit-02-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-02-a | space / scope DTO、domain 和 visibility policy 单测通过后 | command DTO、space / scope domain、visibility guard、fixtures | repository、API handler、fact append | cargo fmt / check、DTO / domain tests |
| commit-02-b | space / scope 最小写路径和 API service tests 通过后 | repository / UoW fake、idempotency、audit、service、minimal handler | fact append、query、production store | `TC-CONV-SPACE-*`、`TC-CONV-SCOPE-*` |

### 7.4 PH-03 Fact append / transaction / idempotency 写路径

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-03-01 | 1 | 定义 append / retract command、fact receipt、outbox intent DTO 和 fixtures | `03` §7、`05` `TC-CONV-FACT-*` | DTO、fixtures、contract tests | validation / roundtrip tests 通过 |
| IMPL-03-02 | 2 | 实现 fact lifecycle、append-only policy 和 forbidden body guard | `03` §6 / §9、`06` AC-FUNC-002 / AC-RED-002 | fact domain、payload ref policy、state tests | append / retract / forbidden body tests 通过 |
| IMPL-03-03 | 3 | 实现 fact service、trace / receipt、UoW rollback、idempotency conflict | `03` §8 / §10~§13 | service、receipt、trace ref、idempotency result | duplicate / conflict / rollback tests 通过 |
| IMPL-03-04 | 4 | 生成 fact outbox intent 和 audit entry | `03` §11 / §14 | pending outbox record、audit material | outbox enqueue failure rollback tests 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-03-01 | 锁定 fact 协议、receipt 和 redaction fixture | `03` §7、`05` cases | DTO、fixtures、contract tests | 100~300 行 | contract tests | commit-03-a |
| BATCH-03-02 | 实现 fact lifecycle 和 forbidden body policy | `03` §6 / §9、`06` AC-RED-002 | domain state、policy、unit tests | 100~300 行 | `TC-CONV-FACT-004` unit | commit-03-a |
| BATCH-03-03 | 实现 transaction、idempotency、receipt、trace 和 outbox enqueue | `03` §8 / §10~§13 | service、repo / UoW、idempotency、tests | 需拆分；每批不超过 300 行 | `TC-CONV-FACT-*`、`TC-CONV-TX-001` | commit-03-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-03-a | fact DTO、domain lifecycle 和 forbidden body tests 通过后 | append / retract DTO、fact domain、payload ref guard、fixtures | UoW transaction、query、manifestation | contract / domain / redaction unit tests |
| commit-03-b | fact write path、idempotency、rollback 和 outbox intent tests 通过后 | fact service、receipt、trace, idempotency, UoW, pending outbox, audit | query, outbox publish job, production store | `TC-CONV-FACT-*`、`TC-CONV-TX-001` |

### 7.5 PH-04 Authorized query / projection / cursor 消费闭环

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-04-01 | 1 | 定义 query DTO、read model、search refs、cursor fixtures | `03` §7、`05` `TC-CONV-QUERY-*` | query DTO、fixtures、contract tests | query validation tests 通过 |
| IMPL-04-02 | 2 | 实现 authorized read model、projection freshness 和 query no-write policy | `03` §6 / §9 / §11 | read model、projection state、policy | authorization / stale marker tests 通过 |
| IMPL-04-03 | 3 | 实现 search refs projection、change cursor 和 poll changes | `03` §8 / §10 / §13 | search refs、cursor state、poll service | refs-only / cursor monotonic tests 通过 |
| IMPL-04-04 | 4 | 接入 query handler 和 evidence | `03` §7 / §8、`06` AC-FUNC-003 | query handler、error mapping、auth evidence | `TC-CONV-QUERY-*`、`TC-CONV-SEARCH-001` 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-04-01 | 锁定 query / read model 协议和 fixtures | `03` §7、`05` cases | query DTO、fixtures、contract tests | 100~300 行 | query contract tests | commit-04-a |
| BATCH-04-02 | 实现 authorized read model 和 projection freshness | `03` §6 / §9 / §11 | read store、projection state、auth tests | 100~300 行 | `TC-CONV-QUERY-001~003` | commit-04-a |
| BATCH-04-03 | 实现 search refs、cursor、poll changes 和 handlers | `03` §8 / §10 / §13 | search refs、cursor service、query handlers | 需拆分；每批不超过 300 行 | `TC-CONV-SEARCH-001`、`TC-CONV-CURSOR-001` | commit-04-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-04-a | query DTO、read model 和 projection freshness tests 通过后 | query DTO、read model store、projection freshness、authorization policy | search refs, cursor maintenance job, manifestation | query contract + auth / stale tests |
| commit-04-b | search refs、cursor、poll changes 和 query handler tests 通过后 | search refs projection、cursor state、poll changes、query handlers | inbound consumer, operations jobs, production search | `TC-CONV-QUERY-*`、`TC-CONV-SEARCH-001`、`TC-CONV-CURSOR-001` |

### 7.6 PH-05 Manifestation / inbound consumer 跨域事实显化

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-05-01 | 1 | 定义 manifestation command、inbound event envelope、safe snapshot 和 quarantine fixtures | `03` §7、`05` `TC-CONV-MAN-*` / `TC-CONV-CONSUMER-*` | command / event DTO、resolver fixtures、quarantine fixtures | DTO roundtrip、invalid envelope tests 通过 |
| IMPL-05-02 | 2 | 实现 manifestation、external snapshot、reference projection 和 source truth isolation policy | `03` §6 / §9、`06` AC-FUNC-004 / AC-RED-005 | manifestation domain、resolution state、digest mismatch marker | manifested / unresolved / mismatch tests 通过 |
| IMPL-05-03 | 3 | 实现 resolver port、manifestation service、event idempotency 和 consumer quarantine | `03` §8 / §10~§13 | service、resolver fake、consumer service、quarantine store | duplicate / invalid / forbidden body tests 通过 |
| IMPL-05-04 | 4 | 接入 6 个 inbound consumer skeleton 和 ref-only outbox intent | `03` §7 / §8、`06` AC-SYNC-003 | worker consumers、consumer receipts、outbox records | `TC-CONV-CONSUMER-*`、redaction scan 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-05-01 | 锁定 manifestation / inbound DTO、fixtures 和 negative cases | `03` §7、`05` cases | DTO、fixtures、contract tests | 100~300 行 | DTO / envelope contract tests | commit-05-a |
| BATCH-05-02 | 实现 manifestation domain、safe snapshot、source isolation 和 digest marker | `03` §6 / §9、`06` AC-RED-005 | domain state、policy、unit tests | 100~300 行 | `TC-CONV-MAN-*` domain tests | commit-05-a |
| BATCH-05-03 | 实现 resolver / consumer / quarantine / event idempotency | `03` §8 / §10~§13 | resolver fake、consumer service、quarantine store、tests | 需拆分；每批不超过 300 行 | `TC-CONV-CONSUMER-*`、redaction tests | commit-05-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-05-a | manifestation 协议、domain 和 source isolation tests 通过后 | command / event DTO、safe snapshot、manifestation domain、resolver fixture | worker wiring、outbox publish、真实来源仓 adapter | `TC-CONV-MAN-*`、source isolation unit / contract tests |
| commit-05-b | consumer、quarantine、event idempotency 和 ref-only outbox tests 通过后 | 6 个 inbound consumer、quarantine、event idempotency、resolver fake、consumer evidence | production source adapter、真实跨仓 E2E | `TC-CONV-CONSUMER-*`、`EV-CONV-CONSUMER-001`、redaction scan |

### 7.7 PH-06 Trace / review / handoff 追溯交接

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-06-01 | 1 | 定义 review anchor、trace handoff、archive handoff command 和 fixtures | `03` §7、`05` `TC-CONV-TRACE-001` / `TC-CONV-HANDOFF-*` | command DTO、handoff fixtures、redaction fixtures | contract / validation tests 通过 |
| IMPL-06-02 | 2 | 实现 review anchor、trace context、handoff record 和 ref-only handoff policy | `03` §6 / §9、`06` AC-FUNC-005 | trace domain、handoff state、policy tests | pending / failed / archived state tests 通过 |
| IMPL-06-03 | 3 | 实现 handoff command service、handoff fake adapter 和 failure-safe job seed | `03` §8 / §10~§13 | service、adapter fake、handoff repository、job seed | handoff failure 不回滚 fact tests 通过 |
| IMPL-06-04 | 4 | 生成 handoff evidence、safe diagnostic 和 audit | `03` §14 / §15、`06` AC-SYNC-009 | evidence page、audit rows、redaction report | `EV-CONV-HANDOFF-001` 可生成 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-06-01 | 锁定 trace / handoff 协议、fixtures 和 redaction negative cases | `03` §7、`05` cases | DTO、fixtures、contract tests | 100~300 行 | command contract tests | commit-06-a |
| BATCH-06-02 | 实现 review anchor、trace context 和 handoff state machine | `03` §6 / §9、`06` AC-STATE-004 | domain state、policy、unit tests | 100~300 行 | `TC-CONV-TRACE-001`、state tests | commit-06-a |
| BATCH-06-03 | 实现 handoff service、fake adapters、handoff delivery seed 和 audit | `03` §8 / §10~§14 | application service、fake adapter、job seed、evidence | 需拆分；每批不超过 300 行 | `TC-CONV-HANDOFF-*`、redaction tests | commit-06-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-06-a | trace / handoff DTO、review anchor 和 handoff state tests 通过后 | review anchor、trace context、handoff commands、handoff domain | external handoff adapter、operations jobs | `TC-CONV-TRACE-001`、handoff state unit tests |
| commit-06-b | handoff service、fake adapter、retry / failed 和 evidence tests 通过后 | trace / archive handoff services、fake adapters、job seed、audit / evidence |真实 observability / archive integration | `TC-CONV-HANDOFF-*`、`EV-CONV-HANDOFF-001`、redaction scan |

### 7.8 PH-07 Outbox publish / operations jobs / maintenance

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-07-01 | 1 | 定义 outbox publish、projection rebuild、cursor maintenance、snapshot refresh 和 consistency job inputs | `03` §7、`05` `TC-CONV-OUTBOX-*` / `TC-CONV-DERIVED-*` | job DTO、outbox event DTO、fixtures | job contract tests 通过 |
| IMPL-07-02 | 2 | 实现 outbox publication state、stable event id 和 publisher fake | `03` §6 / §9 / §13 | outbox publisher service、fake publisher、publication evidence | publish / retry / rerun tests 通过 |
| IMPL-07-03 | 3 | 实现 projection rebuild、search rebuild、cursor maintenance 和 snapshot refresh jobs | `03` §8 / §10~§13 | job services、projection stores、cursor state、snapshot marker | stale / failed / monotonic tests 通过 |
| IMPL-07-04 | 4 | 实现 consistency validation、cleanup 和 operations reports | `03` §8 / §15、`06` AC-SYNC-005 | report ref、issue marker、job receipt、operations evidence | consistency 只报告不修复 tests 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-07-01 | 锁定 outbox / job DTO、fixtures 和 event schema | `03` §7、`05` cases | job / event DTO、fixtures、contract tests | 100~300 行 | job / event contract tests | commit-07-a |
| BATCH-07-02 | 实现 outbox publish、retry、failed、stable event id 和 fake publisher | `03` §8~§13、`06` AC-FUNC-008 | outbox service、publisher fake、tests | 需拆分；每批不超过 300 行 | `TC-CONV-OUTBOX-*` | commit-07-a |
| BATCH-07-03 | 实现 projection / search / cursor / snapshot jobs | `03` §8~§13、`06` AC-FUNC-006 / 007 | job services、projection stores、cursor tests | 需拆分；每批不超过 300 行 | `TC-CONV-DERIVED-*`、`TC-CONV-CURSOR-001` | commit-07-b |
| BATCH-07-04 | 实现 consistency validation、cleanup、operations evidence 和 no-auto-repair checks | `03` §15、`06` AC-CONS-002 | reports、job receipts、issue markers | 100~300 行 | `TC-CONV-CONSISTENCY-001` | commit-07-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-07-a | outbox publish / retry / rerun 和 event schema tests 通过后 | outbox relay、publisher fake、stable event id、publication state tests | projection rebuild、production broker | `TC-CONV-OUTBOX-*`、`EV-CONV-OUTBOX-001` |
| commit-07-b | projection、search、cursor、snapshot、consistency 和 cleanup job tests 通过后 | operations jobs、projection / cursor stores、consistency reports、job receipts | auto repair truth、production search service | `TC-CONV-DERIVED-*`、`TC-CONV-CURSOR-001`、`TC-CONV-CONSISTENCY-001` |

### 7.9 PH-08 Release gate / reports / acceptance handoff

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-08-01 | 1 | 固定 release gate suite、run id、artifact root 和 report root | `05` §13、`06` §3 / §4 | gate config、`artifacts/test/<run_id>`、`reports/runs/<run_id>` | 无 `<project>` / `latest` path tests 通过 |
| IMPL-08-02 | 2 | 生成最小 evidence index 壳、gate results 和 redaction report | `05` §14、`06` AC-EVID-* | minimal `evidence-index.md`、redaction-check、gate-results | path / link / redaction script tests 通过,不生成最终 EV 页面 |
| IMPL-08-03 | 3 | 生成最终 EV pages 和完整 evidence index | `05` EV table、`06` AC-EVID-* | evidence pages、完整 evidence-index | EV 页面齐全且被 index 引用 |
| IMPL-08-04 | 4 | 生成 acceptance handoff、veto checklist、risk acceptance 和 open issues | `06` §4 / §11~§14 | `reports/acceptance/*` | VETO 覆盖，风险分级清楚 |
| IMPL-08-05 | 5 | 执行最终 release gate 并固定送验提交说明 | `06` §3 / §15 | fixed implementation commit、run summary、handoff package | gate 非 0 时保留 failure summary |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-08-01 | 完成 gate / report / redaction scripts 的正式参数、path checks 和最小 evidence-index 壳渲染 | `03` §15、`05` scripts、`06` AC-NFR-010 | script implementation、path check tests、minimal `evidence-index.md` | 100~300 行 | `TC-CONV-REPORT-001` | commit-08-a |
| BATCH-08-02 | 完成 EV pages、完整 evidence index 和 acceptance handoff 生成 | `05` EV table、`06` AC-EVID-* | report generator、acceptance files、tests | 需拆分；每批不超过 300 行 | `EV-CONV-GATE-001`、`EV-CONV-ACCEPT-001` | commit-08-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-08-a | release gate、report、redaction path scripts 可独立运行后 | final scripts、path checks、redaction checker、script tests、最小 `evidence-index.md` 壳 | acceptance conclusion、最终 EV 明细页、acceptance handoff / veto / risk 结论 | `TC-CONV-REPORT-001`、`TC-CONV-REDACTION-001` |
| commit-08-b | 所有 P0 / P0-supporting EV、gate results、acceptance handoff 和 veto checklist 齐全后 | final reports、完整 evidence index、EV 明细页、acceptance handoff、risk / open issues | 新业务代码、生产 adapter、未审查通过结论 | full release gate、`EV-CONV-GATE-001`、`EV-CONV-ACCEPT-001` |

## 8. 开工前设计闭环复核矩阵

每个 commit boundary 开工前，实施 agent 必须先复核字段、DTO、状态、测试证据和 phase boundary。任一项无法闭合时，暂停当前 boundary，记录 blocker，回到 design repo 修正文档后再继续。

| 提交边界 | 字段 / DTO 复核 | 状态 / 事务复核 | 证据 / phase boundary 复核 | 失败处理 |
|---|---|---|---|---|
| commit-01-a | crate / package 名、`core-contracts` path、workspace 成员 | 无业务状态 | 目标仓不存在时新建；不得引入非 P0 dependency | 暂停并回写目录 / dependency 冲突 |
| commit-01-b | config / script 参数、artifact / report path | 无业务状态 | `artifacts/test/<run_id>`、`reports/`；无 `<project>` / `latest` | 暂停并修正 path 规则 |
| commit-02-a | space / scope command 字段能构造 domain | space / scope / visibility 状态名一致 | 不引用 fact / query / consumer 后续对象 | 暂停并回写字段或状态冲突 |
| commit-02-b | API request、idempotency、audit、outbox intent 字段闭合 | UnitOfWork 与 idempotency 同事务 | 只交付 space / scope 写路径 | 暂停并回写 phase boundary 冲突 |
| commit-03-a | append / retract DTO、receipt、payload ref 字段闭合 | fact lifecycle 和 forbidden body policy 一致 | 不引入 query / manifestation | 暂停并回写 fact schema 冲突 |
| commit-03-b | trace、receipt、outbox record、idempotency result 字段闭合 | rollback、duplicate、conflict 和 outbox enqueue 一致 | `TC-CONV-TX-001` 可验证 | 暂停并回写事务 / 幂等冲突 |
| commit-04-a | query DTO、consumer context、projection state 字段闭合 | query no-write，fresh / stale / failed 状态一致 | 不依赖 manifestation 输入 | 暂停并回写 query / projection 冲突 |
| commit-04-b | search refs、cursor、poll changes 字段闭合 | cursor monotonic 和 stale marker 一致 | 不引入 inbound consumer | 暂停并回写 cursor / search 冲突 |
| commit-05-a | manifestation DTO、safe snapshot、resolver result 字段闭合 | manifested / unresolved / mismatch 状态一致 | 不消费真实来源仓正文 | 暂停并回写 source truth isolation 冲突 |
| commit-05-b | inbound envelope、event id、source ref、quarantine 字段闭合 | consumer idempotency 与 UnitOfWork 一致 | 6 个 consumer 不要求真实跨仓 E2E | 暂停并回写 consumer schema 冲突 |
| commit-06-a | review anchor、handoff command、trace ref 字段闭合 | handoff pending / terminal 状态一致 | 不交付外部 adapter 成功真实性 | 暂停并回写 handoff 状态冲突 |
| commit-06-b | handoff adapter input、safe diagnostic、audit ref 字段闭合 | failure 不回滚 fact / trace truth | fake handoff 必须有 controlled seam marker | 暂停并回写 handoff recovery 冲突 |
| commit-07-a | outbox event、publisher input、stable event id 字段闭合 | publish retry / failed 不回滚 truth | 不引入 production broker | 暂停并回写 outbox event 冲突 |
| commit-07-b | job input、projection state、cursor position、report ref 字段闭合 | rebuild / cursor / consistency 不修写真相 | operations job 覆盖 PH-02~PH-06 truth | 暂停并回写 job / projection 冲突 |
| commit-08-a | gate / report / redaction script 参数闭合 | 无新业务状态 | path shape、redaction、failure summary 和最小 evidence-index 壳可验证 | 暂停并修正 evidence path 冲突 |
| commit-08-b | EV page、完整 index、handoff、veto、risk / issue 字段闭合 | 不新增业务状态 | 所有 P0 evidence 可追溯到 fixed commit / run id | 暂停并补证据或回写验收冲突 |

## 9. 提交粒度判断表

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-01-a | 适中 | 是 | 是 | 保留 |
| commit-01-b | 适中 | 是 | 是 | 保留 |
| commit-02-a | 适中 | 是 | 是 | 保留 |
| commit-02-b | 适中 | 是 | 是 | 保留 |
| commit-03-a | 适中 | 是 | 是 | 保留 |
| commit-03-b | 偏大但可拆批 | 是 | 是 | 保留；实现时按 BATCH 拆写 |
| commit-04-a | 适中 | 是 | 是 | 保留 |
| commit-04-b | 偏大但可拆批 | 是 | 是 | 保留；实现时按 BATCH 拆写 |
| commit-05-a | 适中 | 是 | 是 | 保留 |
| commit-05-b | 偏大但可拆批 | 是 | 是 | 保留；实现时按 consumer / quarantine / outbox 分批写 |
| commit-06-a | 适中 | 是 | 是 | 保留 |
| commit-06-b | 偏大但可拆批 | 是 | 是 | 保留；实现时按 service / adapter / evidence 分批写 |
| commit-07-a | 偏大但可拆批 | 是 | 是 | 保留；实现时按 event / publisher / retry 分批写 |
| commit-07-b | 偏大但可拆批 | 是 | 是 | 保留；实现时按 job family 分批写 |
| commit-08-a | 适中 | 是 | 是 | 保留 |
| commit-08-b | 适中 | 是 | 是 | 保留 |

## 10. 提交前检查清单

| 检查项 | 要求 |
|---|---|
| boundary | 当前 diff 必须只覆盖一个 `commit-xx-*` boundary |
| design baseline | 已读本 boundary 的正式章节和对应 `design-calibration` 文件 |
| field closure | DTO 输入能构造目标 domain / service 对象 |
| state closure | enum / state transition 使用正式名称，不使用口语别名 |
| phase boundary | 不依赖后续 phase 的对象、port、证据或状态 |
| code language | 实现仓代码注释、rustdoc、测试名和 commit message 使用英文 |
| tests | 当前 boundary 声明的 fmt / check / unit / integration / gate 已执行 |
| evidence | artifact / report 输出路径正确，且无 `<project>` / `latest` |
| redaction | forbidden body、raw secret、raw payload 未进入 truth / event / log / report |
| commit message | 一笔提交对应一个 boundary，英文 `type(scope): subject`，body 按子功能分组，保留 `Co-Authored-By: Codex <noreply@openai.com>` |

## 11. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §6。因本 Step 的阶段任务、代码批次、提交边界和复核矩阵已经在 §7~§10 完整展开，正式文档生成时不得在本节重复改写口径，应从本文件摘录并压缩为正式 §6。

````markdown
## 6. 阶段任务拆分、编写顺序与提交边界

> 校准来源：
> - `design-calibration/07_implementation_plan_step_06_tasks_commits.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“开工前设计闭环复核矩阵”“提交粒度判断表”和“提交前检查清单”小节，了解每个 phase / commit boundary 的实施动作、批次规模、验证门禁和暂停条件。

正式 §6 应从 `07_implementation_plan_step_06_tasks_commits.md` 摘录以下内容：

1. §7.1 全局编写顺序规则。
2. §7.2~§7.9 的 PH-01~PH-08 阶段任务表、代码实现批次和提交边界。
3. §8 开工前设计闭环复核矩阵。
4. §9 提交粒度判断表。
5. §10 提交前检查清单。

正式 §6 不得新增未在上述中间产物出现的 phase、batch、commit boundary 或 gate。若 Step 13 发现 §6 与 `03/05/06` 冲突，必须回到本 Step 修正中间产物后再生成正式文档。
````

## 12. 待确认事项

| 事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| PH-05 的 6 个 consumer 是否拆成 6 笔提交 | A: 每个 consumer 一笔；B: 一个 consumer boundary 内分批写 | 推荐 B | 6 个 consumer 共享 envelope、quarantine、idempotency 和 redaction 规则，拆成 6 笔会过碎；但实现时必须分批写和分组测试 |
| PH-07 operations jobs 是否拆成更多 commit | A: outbox 一笔、projection / operations 一笔；B: 每个 job 一笔 | 推荐 A | job 之间共享 job envelope、receipt、report ref 和 no-auto-repair 规则；按 job 单独提交会弱化整体 operations gate |
| PH-08 是否可以只提交 reports | A: 只提交 reports；B: scripts / gates 先提交，最终 reports 单独提交 | 推荐 B | scripts 是可复用能力，final reports 是送验证据，分开更利于 review 和回退 |

建议接受上述推荐。它们保持“一个可验证纵切一笔提交”的原则，同时要求高风险代码按批次分写，避免按文件或单对象形成过碎提交。

## 13. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 每个阶段都有任务表、编写顺序和提交边界 | 已满足 |
| 每个阶段都有代码实现批次表，且批次规模、验证门禁和提交关系清楚 | 已满足 |
| 每个阶段或 commit boundary 都有字段、DTO、状态和 phase boundary 开工前复核口径 | 已满足 |
| 每个提交边界都有提交前门禁 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

Step 6 可以进入 Step 7。Step 7 应继续严格单 Step 执行，专门把 `05-测试方案.md` 和 `06-验收标准.md` 嵌入 PH-01~PH-08 的阶段门禁，不在 Step 7 重排提交边界。
