# L0-bus 07 实施计划 Step 6: 阶段任务、编写顺序与提交边界

> 本文件是 `projects/L0-bus/07-实施计划.md` 的 Step 6 中间产物。
> 本步把 PH-01~PH-08 拆成阶段任务、代码实现批次和 commit boundary。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 6 |
| 主题 | 拆分阶段任务、编写顺序与提交边界 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §6 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_05_phases_dependencies.md` | 已确认 | 继承 PH-01~PH-08 阶段顺序和阶段门禁 |
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 继承交付物、非交付物和跨仓依赖边界 |
| `03-详细设计.md` §4~§15 | 已完成 | 提取实现契约、处理流、状态机、事务、幂等和脚本契约 |
| `05-测试方案.md` §4~§14 | 已完成 | 提取每阶段测试切口、用例族、artifact 和 report 证据 |
| `06-验收标准.md` §5~§14 | 已完成 | 提取每阶段验收门禁、VETO 和证据完整性要求 |
| `standards/document/实施计划书写规范.md` | 已完成 | 约束代码批次、提交时机、commit message 和分批规模 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 每个阶段内有哪些实施动作 | 每个阶段拆为契约 / 测试切口、领域或服务实现、adapter / entry wiring、证据门禁四类动作。 |
| 2. 每个任务的输入、输出和完成判定是什么 | 任务表逐项列出输入、输出和可验证完成判定,不使用“完善相关代码”。 |
| 3. 阶段内代码应该按什么顺序写,为什么 | 先锁定协议和测试切口,再写 domain / application,再接 infra / entry,最后跑 gate 和证据。 |
| 4. 是否先锁定外部契约和测试切口,再填内部实现 | 是。Command / Event / Job / Query DTO、fixture 和失败用例先落骨架,防止内部实现漂移。 |
| 5. 哪些任务必须同提交,哪些任务必须分开提交 | 同一可验证纵切内的 DTO、domain、service、fake adapter 和测试可同提交;不同阶段、不同状态链和 release evidence 不混提交。 |
| 6. 哪些时机可以 commit,哪些时机不能 commit | 一个 commit boundary 对应的代码批次和门禁全部通过后可以 commit;未编译、未测试、缺证据或混入无关功能时不能 commit。 |
| 7. 哪些测试必须在提交前执行 | 至少执行本阶段批次声明的 fmt / check / unit / service / integration / API / consumer / job / redaction / report check。 |
| 8. 是否存在提交边界过大或过小的问题 | 有。按文件或单 struct 提交过小;把 PH-02~PH-06 混成一笔过大。本文按功能纵切和验证门禁拆分。 |
| 9. 是否存在把无关修改混入同一提交的风险 | 有。scripts/report 模板容易混入业务阶段;生产 adapter 容易混入 P0 fake 阶段。本文明确“不包含内容”。 |
| 10. 每个提交边界能否用一句话描述 | 必须能。一句话说不清的 boundary 需要拆分或重排。 |
| 11. 每个提交边界是否可以独立 review、独立验证、必要时独立回退 | 必须可以。每个 boundary 都绑定门禁和不包含内容。 |
| 12. 本阶段是否存在单批代码预计超过 300 行或 500 行的实现动作 | PH-02~PH-07 都可能超过 300 行,因此拆成多个 100~300 行批次;预计超过 500 行的阶段不得单批实现。 |
| 13. 哪些实现动作必须拆成多个代码批次 | 状态机、事务 / UoW、幂等、consumer ack、recovery、projection、redaction、report generation 必须拆批次。 |
| 14. 哪些高风险逻辑必须单独批次实现 | 状态机、事务、并发、幂等、安全 / redaction、审计、错误恢复、跨仓事件同步均单独批次或单独门禁。 |
| 15. 每个代码批次完成后应该执行哪些门禁 | 每批至少执行 fmt / check / 相关 unit 或 integration;阶段边界执行对应 gate script 和 evidence check。 |
| 16. 每个代码批次与提交边界是什么关系 | 一个 commit boundary 可包含一个或少数几个强相关批次;批次通过后再判断是否达到 commit boundary。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| Step 5 只有阶段级顺序 | 没有阶段内任务、批次和提交边界 | 实施者仍可能按文件或对象随意提交 | 本步为每个 PH 定义任务、批次、boundary |
| 高风险逻辑容易混在大提交中 | 状态机、幂等、事务、recovery、projection 均跨模块 | review 和回退成本过高 | 高风险逻辑单独批次,并绑定测试 |
| scripts / reports 容易散落提交 | 证据骨架和业务实现都需要脚本支持 | 提交边界混乱 | PH-01 建骨架,PH-08 做最终报告收口 |
| 生产 adapter 容易混入 P0 | fake / in-memory 与 production adapter 都在 infra 位置 | 范围膨胀 | 每个 boundary 明确不包含 production adapter |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 阶段任务 | 只有 PH-01~PH-08 名称 | 每阶段有 IMPL 任务表 | 实施动作可执行 |
| 编写顺序 | 只有阶段依赖 | 每阶段按 contract/test -> domain/service -> adapter/entry -> gate 编排 | 降低返工 |
| 代码批次 | 未定义 | 每阶段有 BATCH 表和规模判断 | 防止超大批次 |
| 提交边界 | 未定义 | 每阶段有 commit boundary、时机、包含和不包含 | 方便 review 和回退 |
| 提交粒度 | 未判断 | 每个 boundary 判断是否适中 | 防止过细或过粗 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 一个阶段一笔提交 | 简单 | PH-02~PH-07 过大,风险集中 | 不采用 |
| 一个文件一笔提交 | 容易局部 review | 无法表达功能闭环,提交过碎 | 不采用 |
| 一个可验证纵切一笔提交 | 能独立验证和回退 | 需要明确批次与门禁 | 采用 |
| 测试最后统一提交 | 编码阶段快 | 不符合实施计划和验收要求 | 不采用 |
| 测试与功能同 boundary | 保证每笔提交可验证 | body 需要按子功能分组 | 采用 |

---

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

### PH-01 仓初始化与证据骨架

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-01-01 | 1 | 创建目标仓和 workspace skeleton | `03` §4、Step 3 | `/home/aris/Projects/quantalithos-bus`、root `Cargo.toml`、`crates/*` | workspace 可执行 `cargo check` |
| IMPL-01-02 | 2 | 接入 `core-contracts` path dependency | `03` §3 / §4 | Cargo path dependency | compile 能解析 `core_contracts` |
| IMPL-01-03 | 3 | 创建基础 config fixture 和 runtime builder skeleton | `04` §3~§9 | config fixtures、`RuntimeConfig` skeleton | config smoke test skeleton 可运行 |
| IMPL-01-04 | 4 | 创建 gate / report / check scripts 骨架 | `03` §15、`05` §13 | `scripts/gates`、`scripts/reports`、`scripts/checks` | scripts 支持 required args |
| IMPL-01-05 | 5 | 创建 artifact / report 目录和路径检查 | `05` §13、`06` AC-FUNC-010 | `artifacts/test/<run_id>`、`reports/` README skeleton | check 不出现 `<project>` 层级或正式 `latest` |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-01-01 | 形成可编译 workspace 和 core dependency | `03` §4、Step 3 | Cargo workspace、empty crate lib / bin、path dependency | 100~300 行 | `cargo check` | 归入 commit-01-a |
| BATCH-01-02 | 形成脚本和证据路径骨架 | `03` §15、`05` §13 | gate / report / check script skeleton、artifact / report README | 100~300 行 | script `--help`、path grep | 归入 commit-01-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-01-a | workspace、crate skeleton 和 `core-contracts` dependency 可编译后 | root workspace、`crates/*` skeleton、Cargo dependency | 业务 DTO、domain 状态、API route | `cargo check`、命名检查 |
| commit-01-b | scripts 和 evidence roots 可检查后 | gate/report/check script skeleton、artifact/report 目录规则 | 业务测试实现、release gate 完整报告 | script `--help`、artifact/report path check |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-01-a | 适中 | 是 | 是 | 保留 |
| commit-01-b | 适中 | 是 | 是 | 保留 |

### PH-02 Publication acceptance 最小写路径

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-02-01 | 1 | 定义 publication command / receipt DTO 和测试 fixture | `03` §7、`05` TS-BUS-001 | `AcceptPublicationCommand`、receipt、negative fixtures | DTO roundtrip 和 validation tests 通过 |
| IMPL-02-02 | 2 | 实现 publication domain 状态与 payload boundary policy | `03` §5 / §9、`06` AC-RED-002 | `PublicationAcceptance`、status、policy | accepted / rejected / forbidden body tests 通过 |
| IMPL-02-03 | 3 | 实现最小 repository、UoW、idempotency 和 audit 写路径 | `03` §10 / §12 / §14 | in-memory repository、UoW、audit entry | transaction / idempotency tests 通过 |
| IMPL-02-04 | 4 | 接入 minimal API handler 和 service flow | `03` §8、`06` AC-IF-001 | handler、service、error mapping | `TC-BUS-PUB-001`~`004` 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-02-01 | 锁定 publication 协议和 fixture | `03` §7、`05` TS-BUS-001 | DTO、receipt、fixture、contract tests | 100~300 行 | DTO roundtrip / validation | 归入 commit-02-a |
| BATCH-02-02 | 实现 publication domain 和 boundary policy | `03` §5 / §9、`06` AC-RED-002 | domain object、status、policy、unit tests | 100~300 行 | domain unit + redaction unit | 归入 commit-02-a |
| BATCH-02-03 | 实现写事务、idempotency、audit 和 handler | `03` §8 / §10 / §12 / §14 | service、repo/UoW fake、handler、service tests | 需拆分;每批不超过 300 行 | `TC-BUS-PUB-*` | 归入 commit-02-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-02-a | publication DTO、domain 和 boundary policy 均通过单测后 | command / receipt DTO、publication domain、boundary policy、fixtures | repository、API handler、delivery | cargo fmt/check、DTO/domain tests |
| commit-02-b | publication 最小写路径和 API service tests 通过后 | repository / UoW fake、idempotency、audit、service、minimal handler | delivery、outbox relay、production store | `TC-BUS-PUB-*`、redaction check |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-02-a | 适中 | 是 | 是 | 保留 |
| commit-02-b | 适中 | 是 | 是 | 保留 |

### PH-03 Transport semantic 与 delivery 默认路径

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-03-01 | 1 | 定义 semantic / delivery DTO、job input 和 backend capability fixture | `03` §7、`05` TS-BUS-002 / 003 / 008 | semantic DTO、delivery view、job input、backend fixture | contract / fixture tests 通过 |
| IMPL-03-02 | 2 | 实现 semantic policy 和 delivery 状态机 | `03` §9、`06` AC-FUNC-002 / 003 | transport semantic、delivery status、history rule | state transition tests 通过 |
| IMPL-03-03 | 3 | 实现 fake backend、delivery repository 和 delivery progression service | `03` §8 / §10 / §13 | in-memory backend、repo、service | dispatch success / failure tests 通过 |
| IMPL-03-04 | 4 | 接入 delivery progression job runner | `03` §8、`06` AC-IF-005 | job runner、summary、partial success | `TC-BUS-DLV-*`、`TC-BUS-BND-*` 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-03-01 | 锁定 semantic / delivery 协议和 backend fixture | `03` §7、`05` TS-BUS-002 / 003 | DTO、job input、fixture、contract tests | 100~300 行 | contract tests | 归入 commit-03-a |
| BATCH-03-02 | 实现 semantic policy 和 delivery state machine | `03` §9、`06` AC-STATE-002 | domain state、history、policy、unit tests | 100~300 行 | state tests | 归入 commit-03-a |
| BATCH-03-03 | 实现 fake backend 与 delivery progression 编排 | `03` §8 / §10 / §13 | service、repo、backend fake、job runner | 需拆分;每批不超过 300 行 | `TC-BUS-DLV-*`、`TC-BUS-BND-*` | 归入 commit-03-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-03-a | semantic 和 delivery domain 单测通过后 | semantic DTO、delivery domain、state machine、backend fixture | job runner、feedback、outbox relay | fmt/check、semantic / delivery unit tests |
| commit-03-b | delivery 默认路径和 fake backend job tests 通过后 | delivery service、fake backend、repository、job runner、summary | feedback、retry、production backend | `TC-BUS-SEM-*`、`TC-BUS-DLV-*`、`TC-BUS-BND-*` |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-03-a | 适中 | 是 | 是 | 保留 |
| commit-03-b | 适中 | 是 | 是 | 保留 |

### PH-04 Outbox relay 与 inbound source 幂等

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-04-01 | 1 | 定义 committed outbox fact input 和 fixture source | `03` §7 / §13、L0-core contracts | inbound event DTO、source fixture | fixture parse / duplicate tests 通过 |
| IMPL-04-02 | 2 | 实现 `OutboxFactSourcePort`、source ack 语义和 source idempotency | `03` §7 / §10 / §12 | source port、ack after commit rule、idempotency key | ack failure replay tests 通过 |
| IMPL-04-03 | 3 | 接入 outbox relay consumer / job 到 publication acceptance service | `03` §8、`06` AC-FUNC-007 | consumer、job runner、publication creation from fact | `TC-BUS-OBX-*` 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-04-01 | 锁定 outbox fact fixture 和 source port | `03` §7 / §13 | inbound DTO、fixture source、port trait | 100~300 行 | fixture / contract tests | 归入 commit-04-a |
| BATCH-04-02 | 实现 source idempotency 和 ack-after-commit 语义 | `03` §10 / §12、`06` AC-TX-002 | source idempotency、ack state、tests | 100~300 行 | duplicate / ack failure tests | 归入 commit-04-a |
| BATCH-04-03 | 实现 relay consumer / job 到 publication acceptance | `03` §8、`06` AC-FUNC-007 | consumer、job runner、service wiring | 100~300 行 | `TC-BUS-OBX-*` | 归入 commit-04-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-04-a | source fixture、source port、ack / duplicate tests 通过后 | inbound source DTO、fixture source、source idempotency、ack rule | relay consumer wiring、feedback | `TC-BUS-OBX-001` fixture / duplicate subset |
| commit-04-b | relay consumer / job 能生成 publication acceptance 且幂等通过后 | outbox relay consumer、job runner、publication service wiring | delivery feedback、production source | `TC-BUS-OBX-*`、AC-FUNC-007 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-04-a | 适中 | 是 | 是 | 保留 |
| commit-04-b | 适中 | 是 | 是 | 保留 |

### PH-05 Feedback / timeout / idempotency 闭环

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-05-01 | 1 | 定义 feedback command、backend signal、timeout signal 和 negative fixtures | `03` §7、`05` TS-BUS-004 | DTO、event input、fixtures | validation / schema tests 通过 |
| IMPL-05-02 | 2 | 实现 feedback result、history append 和 duplicate policy | `03` §9 / §12 | feedback domain、idempotency rules | same key same digest / conflict tests 通过 |
| IMPL-05-03 | 3 | 实现 feedback service、backend signal consumer、timeout consumer | `03` §8 / §10 / §12 | services、consumers、repository updates | ack / fail / timeout tests 通过 |
| IMPL-05-04 | 4 | 实现并发冲突和 late / unknown feedback 处理 | `03` §11 / §12、`06` AC-CONC-002 | conflict errors、stable rejection、audit | concurrency / late feedback tests 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-05-01 | 锁定 feedback / signal / timeout 协议 | `03` §7、`05` TS-BUS-004 | DTO、fixtures、contract tests | 100~300 行 | protocol tests | 归入 commit-05-a |
| BATCH-05-02 | 实现 feedback domain 和 idempotency policy | `03` §9 / §12 | feedback result、history rule、idempotency tests | 100~300 行 | idempotency unit tests | 归入 commit-05-a |
| BATCH-05-03 | 实现 feedback service 和 consumer wiring | `03` §8 / §10 | service、backend signal consumer、timeout consumer | 需拆分;每批不超过 300 行 | `TC-BUS-FDB-*` | 归入 commit-05-b |
| BATCH-05-04 | 实现并发、late feedback 和 audit evidence | `03` §11 / §12 / §14 | conflict mapping、access audit、tests | 100~300 行 | AC-IDEM / AC-CONC tests | 归入 commit-05-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-05-a | feedback 协议、domain 和幂等 policy 单测通过后 | DTO、fixtures、feedback result、history/idempotency policy | service consumer wiring、recovery | fmt/check、protocol + idempotency tests |
| commit-05-b | feedback command、backend signal、timeout 和并发场景通过后 | service、consumers、repository update、conflict mapping、audit | retry/DLQ/replay | `TC-BUS-FDB-*`、AC-IDEM-001、AC-CONC-002 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-05-a | 适中 | 是 | 是 | 保留 |
| commit-05-b | 适中 | 是 | 是 | 保留 |

### PH-06 Retry / DLQ / replay preparation 恢复链

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-06-01 | 1 | 定义 retry、DLQ、replay command 和 evidence fixture | `03` §7、`05` TS-BUS-005 | recovery DTO、fixtures | validation / schema tests 通过 |
| IMPL-06-02 | 2 | 实现 retry eligibility、DLQ eligibility 和 replay preparation policy | `03` §9 / §11、`06` AC-RED-007 | recovery domain、guard policy | missing material / invalid state tests 通过 |
| IMPL-06-03 | 3 | 实现 recovery orchestration service 和 job runner | `03` §8 / §10 | retry service、DLQ service、replay service、job runner | retry / DLQ / replay tests 通过 |
| IMPL-06-04 | 4 | 实现 approval ref、audit chain guard 和 manual action evidence | `03` §11 / §14、`06` AC-FUNC-005 | stable rejected result、audit evidence | replay rejected / ready tests 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-06-01 | 锁定 recovery 协议和 fixture | `03` §7、`05` TS-BUS-005 | retry / DLQ / replay DTO、fixtures | 100~300 行 | contract tests | 归入 commit-06-a |
| BATCH-06-02 | 实现 recovery domain policy 和 guard | `03` §9 / §11、`06` AC-RED-007 | retry plan、dead letter、replay preparation domain | 100~300 行 | recovery unit tests | 归入 commit-06-a |
| BATCH-06-03 | 实现 recovery services、job runner 和 audit evidence | `03` §8 / §10 / §14 | services、job runner、audit evidence、tests | 需拆分;每批不超过 300 行 | `TC-BUS-REC-*` | 归入 commit-06-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-06-a | recovery DTO、fixtures、policy guard 单测通过后 | retry / DLQ / replay DTO、domain policy、guard tests | service/job wiring、projection | fmt/check、recovery unit tests |
| commit-06-b | retry、DLQ、replay preparation 主链通过后 | recovery services、job runner、approval/audit guard、manual action evidence | query projection、governance decision body | `TC-BUS-REC-*`、AC-FUNC-005、AC-RED-007 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-06-a | 适中 | 是 | 是 | 保留 |
| commit-06-b | 适中 | 是 | 是 | 保留 |

### PH-07 Read output / audit / tap / outbound events

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-07-01 | 1 | 定义 query DTO、view DTO、outbound event payload 和 tap fixture | `03` §7、`05` TS-BUS-006 | query / view / event DTO、fixtures | schema / redaction tests 通过 |
| IMPL-07-02 | 2 | 实现 projection store、freshness marker 和 Query no-write guard | `03` §8 / §10、`06` AC-RED-005 | projection model、stale / missing marker、read-only guard | Query 不写 truth tests 通过 |
| IMPL-07-03 | 3 | 实现 audit trail、failure material、tap output 和 publisher sink | `03` §14、`06` AC-FUNC-006 | audit material、tap output、fake sink | forbidden body absent tests 通过 |
| IMPL-07-04 | 4 | 接入 Query API 和 outbound event publish flow | `03` §8、`06` AC-IF-002 / 004 / 009 | query handlers、event publisher service | `TC-BUS-OUT-*` 通过 |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-07-01 | 锁定 Query / View / Event 协议和 redaction fixtures | `03` §7、`05` TS-BUS-006 | query/view/event DTO、tap fixtures | 100~300 行 | schema / redaction fixture tests | 归入 commit-07-a |
| BATCH-07-02 | 实现 read projection 和 Query no-write guard | `03` §8 / §10、`06` AC-RED-005 | projection store、freshness marker、query service | 100~300 行 | Query no-write tests | 归入 commit-07-a |
| BATCH-07-03 | 实现 audit / tap / publisher sink 和 outbound event flow | `03` §14、`06` AC-IF-004 | audit material、tap output、sink、publish tests | 需拆分;每批不超过 300 行 | `TC-BUS-OUT-*`、redaction check | 归入 commit-07-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-07-a | Query / projection read-only 边界通过后 | query/view DTO、projection store、freshness marker、Query no-write guard | outbound publisher、acceptance report | `TC-BUS-OUT-001`~`002`、AC-RED-005 |
| commit-07-b | audit、tap、outbound event 和 redaction checks 通过后 | audit material、tap output、publisher sink、outbound event payload flow | real downstream SDK / observability / governance | `TC-BUS-OUT-*`、redaction check、AC-IF-004 |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-07-a | 适中 | 是 | 是 | 保留 |
| commit-07-b | 适中 | 是 | 是 | 保留 |

### PH-08 Release gate / reports / acceptance handoff

#### 阶段任务表

| 任务编号 | 编写顺序 | 实施动作 | 输入 | 输出 | 完成判定 |
|---|---:|---|---|---|---|
| IMPL-08-01 | 1 | 完成 release gate 脚本并串联 P0 / P0-min suites | `05` §9 / §12 | `run_release_gate.sh`、suite runner | release gate 可生成固定 run artifacts |
| IMPL-08-02 | 2 | 完成 report generation 和 evidence index | `05` §13、`06` AC-FUNC-010 | `reports/runs/<run_id>`、evidence index | report links 和 artifact index checks 通过 |
| IMPL-08-03 | 3 | 完成 acceptance handoff、veto checklist 和 risk acceptance 文件 | `06` §10~§14 | `reports/acceptance/*` | VETO、open issue、risk acceptance 可审查 |
| IMPL-08-04 | 4 | 执行最终 redaction、path 和 no-latest 检查 | `06` AC-EVID / VETO | final check report | 无 forbidden body、无 `<project>` 层级、无正式 `latest` |

#### 代码实现批次

| 批次编号 | 目标 | 输入 | 输出 | 预计规模 | 验证门禁 | 提交关系 |
|---|---|---|---|---|---|---|
| BATCH-08-01 | 完成 release gate 和 suite aggregation | `05` §9 / §12 | release gate script、suite aggregation、run context | 100~300 行 | release gate dry run | 归入 commit-08-a |
| BATCH-08-02 | 完成 reports 和 evidence index generation | `05` §13 | report generator、evidence index、artifact index | 100~300 行 | report links / artifact checks | 归入 commit-08-a |
| BATCH-08-03 | 完成 acceptance handoff 与 VETO / risk 文件 | `06` §10~§14 | handoff、veto checklist、risk acceptance、open issues | 100~300 行 | acceptance handoff review | 归入 commit-08-b |

#### 提交边界

| 提交边界 | commit 时机 | 包含内容 | 不包含内容 | 提交前门禁 |
|---|---|---|---|---|
| commit-08-a | release gate、report generator、evidence index 可生成固定 run 输出后 | release gate script、report generator、evidence / artifact index | 新业务能力、production adapter | release gate dry run、report link check |
| commit-08-b | acceptance handoff、VETO、risk acceptance 和 final checks 完成后 | `reports/acceptance` 生成逻辑、veto checklist、risk acceptance、final redaction/path checks | 修改已通过业务语义 | full release gate、redaction、no-latest、VETO checks |

#### 提交粒度判断

| 提交边界 | 粒度判断 | 是否可一句话描述 | 是否可独立验证 | 调整结论 |
|---|---|---|---|---|
| commit-08-a | 适中 | 是 | 是 | 保留 |
| commit-08-b | 适中 | 是 | 是 | 保留 |

### 7.10 全局提交粒度判断表

| 提交边界 | 一句话描述 | 粒度判断 | 独立验证方式 |
|---|---|---|---|
| commit-01-a | 建立可编译 bus workspace 与 core dependency | 适中 | workspace check |
| commit-01-b | 建立脚本和证据目录骨架 | 适中 | script help + path check |
| commit-02-a | 锁定 publication 协议、domain 和 payload boundary | 适中 | DTO/domain/redaction unit tests |
| commit-02-b | 打通 publication acceptance 最小写路径 | 适中 | `TC-BUS-PUB-*` |
| commit-03-a | 锁定 semantic 与 delivery 状态基础 | 适中 | semantic / delivery unit tests |
| commit-03-b | 打通 delivery 默认路径和 fake backend | 适中 | `TC-BUS-SEM-*` / `TC-BUS-DLV-*` / `TC-BUS-BND-*` |
| commit-04-a | 建立 outbox source fixture、port 和 ack / duplicate 语义 | 适中 | source duplicate / ack failure tests |
| commit-04-b | 打通 outbox relay consumer / job 到 publication acceptance | 适中 | `TC-BUS-OBX-*` |
| commit-05-a | 锁定 feedback 协议、domain 和幂等 policy | 适中 | protocol + idempotency tests |
| commit-05-b | 打通 feedback、backend signal、timeout 和并发冲突 | 适中 | `TC-BUS-FDB-*` / AC-CONC |
| commit-06-a | 锁定 recovery 协议和 guard policy | 适中 | recovery unit tests |
| commit-06-b | 打通 retry、DLQ 和 replay preparation 主链 | 适中 | `TC-BUS-REC-*` |
| commit-07-a | 打通 Query / projection read-only 边界 | 适中 | query no-write / stale marker tests |
| commit-07-b | 打通 audit、tap、outbound event 和 redaction | 适中 | `TC-BUS-OUT-*` / redaction check |
| commit-08-a | 完成 release gate、reports 和 evidence index | 适中 | release gate dry run / report link check |
| commit-08-b | 完成 acceptance handoff、VETO 和最终检查 | 适中 | full release gate / VETO checks |

### 7.11 提交前检查清单

| 检查项 | 要求 |
|---|---|
| 范围 | 当前 diff 只覆盖一个 commit boundary,不混入其他阶段 |
| 编译 | `cargo check` 或阶段声明的等价命令通过 |
| 格式 | `cargo fmt` 或目标仓等价格式化通过 |
| Lint | Clippy 或目标仓等价 lint 不出现阻断问题 |
| 测试 | 当前 boundary 声明的 unit / service / integration / API / consumer / job / report check 已执行 |
| 证据 | 相关 artifact 写入固定 `<run_id>` 路径,不使用正式 `latest` |
| Redaction | 不泄漏 payload body、raw secret、backend private body、governance decision body |
| 提交信息 | 英文 commit message,格式 `type(scope): subject`,body 按子功能分组 |
| Footer | `Co-Authored-By: Codex <noreply@openai.com>` 前有空行 |
| 回退 | 这笔提交可以独立 revert,不会破坏其他已完成 boundary 的语义 |

---

## 8. 回填草稿

Step 13 整理正式 `07-实施计划.md` §6 时,从本文件摘录以下内容:

- `7.1 全局编写顺序规则`
- `PH-01`~`PH-08` 下的阶段任务表、代码实现批次、提交边界和提交粒度判断
- `7.10 全局提交粒度判断表`
- `7.11 提交前检查清单`

正式文档不需要在回填草稿中重复粘贴这些表格。整理时应保持本文件的 commit boundary 编号、批次编号和阶段编号不变。

```markdown
## 6. 阶段任务拆分、编写顺序与提交边界

> 校准来源：
> - `design-calibration/07_implementation_plan_step_06_tasks_commits.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“全局编写顺序规则”“PH-01~PH-08 阶段任务表”“代码实现批次”“提交边界”“全局提交粒度判断表”和“提交前检查清单”小节，了解每个阶段如何从可验证功能增量继续拆为代码批次和 commit boundary。

本章按 PH-01~PH-08 展开阶段任务、代码实现批次、提交边界和提交前门禁。阶段任务以可验证功能增量为单位,不按对象、文件、单个函数或当天工作量拆分。每个 commit boundary 必须能一句话描述、独立 review、独立验证并在必要时独立回退。

正式内容从 `design-calibration/07_implementation_plan_step_06_tasks_commits.md` §7.1~§7.11 摘录。
```

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| 每个 PH 是否都需要两笔提交 | 大多数阶段两笔提交较合适,PH-01 / PH-08 也保持两笔 | 保证 review 和回退粒度 | 接受当前 16 个 commit boundary |
| PH-03 和 PH-04 是否可合并 | 可形成更大主链,但会混淆 delivery 和 outbox source 风险 | 提交过大且回退困难 | 不合并 |
| report scripts 是否应提前到 PH-01 完成 | PH-01 只做骨架,PH-08 完成完整逻辑 | 避免早期报告脚本依赖尚不存在的 suite | 保持当前拆分 |
| production adapter 是否可挂在 infra boundary | 当前非 P0 | 混入会导致 boundary 过大 | 禁止混入;后续专项 |

建议方案: 接受当前 16 个 commit boundary。原因是每个 boundary 都能对应一个可验证增量,粒度比按文件提交更聚合,又比阶段级大提交更容易 review 和回退。

---

## 10. 进入下一步条件

- 每个阶段都有任务表、代码实现批次、提交边界和提交粒度判断。
- 每个代码批次都有目标、输入、输出、预计规模、验证门禁和提交关系。
- 每个提交边界都有 commit 时机、包含内容、不包含内容和提交前门禁。
- 高风险逻辑已单独批次或单独门禁处理。
- 可以进入 Step 7,继续嵌入测试与验收门禁。
