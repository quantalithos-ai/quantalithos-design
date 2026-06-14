# Step 5. 建立需求追溯与覆盖矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填章节: `05-测试方案.md` §5 需求追溯与覆盖矩阵

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 建立需求追溯与覆盖矩阵 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | Step 2 测试范围;Step 3 测试对象与测试切口;Step 4 测试策略与分层;新版 `00/03/04` 正式输入 |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_05_traceability_coverage.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 6 |

## 2. 本步目标

建立从 identity 需求、业务规则、非功能要求、验收方向和一票否决项到测试切口的双向追溯。

本 Step 只回答:

- 每个 P0 C-ID、FR-ID、BR-ID、NFR-ID、AC-ID 和 VETO-ID 由哪些测试切口覆盖。
- 每个 Step 3 P0 测试切口反向证明哪些需求、规则或设计契约。
- 哪些场景必须自动化,哪些只保留为 P1/P2 或残余风险。
- 是否存在 P0 孤儿需求、孤儿设计契约、孤儿测试切口或覆盖空洞。

本 Step 不展开具体测试步骤、fixture、正式 TC 编号全集、artifact 路径、执行脚本或正式 evidence 编号。用例矩阵由 Step 6 细化,证据归档由 Step 13 固定。本 Step 只预留用例候选族和证据候选族,避免提前定义执行报告格式。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` §7 / §9 / §10 / §13 / §14 | 正式输入 | 提供 C-ID、FR-ID、BR-ID、NFR-ID、AC-ID 和 VETO-ID |
| `03-详细设计.md` §5~§16 | 正式输入 | 提供模块、对象、协议、flow、状态、事务、错误、幂等、配置、观测和最小测试切口 |
| `03_ddd_step_16_test_cuts.md` | 直接输入 | 提供 Command / Query / Inbound / Callback / Outbound / Job / state / consistency / config / observability 切口 |
| `04-配置设计.md` §12 | 直接输入 | 提供配置测试主题、profile、fail-fast、redaction、adapter failure 和 runtime builder 门禁方向 |
| `05_test_plan_step_02_scope.md` | 已审核通过 | 固定 P0 / P1 / P2、非范围和 VETO-ID 关联 |
| `05_test_plan_step_03_test_objects_cuts.md` | 已审核通过 | 固定测试对象、切口、负向入口和设计来源审计 |
| `05_test_plan_step_04_strategy_layers.md` | 已审核通过 | 固定每个切口的主发现层级和 release gate 边界 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 需求对应哪些设计章节? | C-ID-1~5、FR-ID-001~014、BR-ID-001~015、NFR-ID-001~009、AC-ID-001~015 和 VETO-ID-001~006 均回指 `00` 需求、`03` §5~§16 和 `04` §12。核心 truth 能力主要回指 `03` object / protocol / flow / state / persistence 契约;配置、外部依赖和观测边界回指 `03` 配置 / observability 与 `04` 配置门禁。 |
| 每个 P0 需求至少有哪些测试场景? | 每个 P0 需求至少映射到协议 roundtrip、domain invariant/state、application flow、consistency/idempotency、query/consumer/outbound/job、config/redaction 或 dependency boundary 切口之一。核心闭环需求还必须有正向主线和负向边界候选。 |
| 哪些场景必须自动化? | P0 public protocol、domain state、command/query/consumer/callback/job orchestration、duplicate replay、query no-write、job no truth repair、config validation、redaction scan、dependency boundary 和 stored surface replay 必须自动化或形成可重复脚本 gate。P1 real-like 和 P2 capacity 不作为当前 P0 自动化前置。 |
| 每个场景的证据如何编号? | 本 Step 只预留证据候选族,例如 `EV-ID-CORE-*`、`EV-ID-ANCHOR-*`、`EV-ID-LIFECYCLE-*`、`EV-ID-ROLE-*`、`EV-ID-CAREER-*`、`EV-ID-MEMORY-*`、`EV-ID-CONSUME-*`、`EV-ID-JOB-*`、`EV-ID-CONFIG-*`、`EV-ID-REDACTION-*` 和 `EV-ID-ARCH-*`。正式 evidence ID、artifact 路径和报告索引由 Step 13 固定。 |
| 哪些需求暂未覆盖,原因是什么? | 当前 P0 未发现未覆盖项。真实 DB / bus / archive / metric / secret provider、production-like profile、容量模型、硬 SLO、外部 HR / IdP、复杂组织结构、高级员工主页和 full event-sourcing-first 属于 P1/P2 或外围增强,不计为 P0 空洞。 |
| 每个 Step 3 测试切口是否至少映射到一个需求 / 规则 / 设计契约或明确说明只做设计风险覆盖? | 是。见 §8.5 反向覆盖矩阵。少数技术切口,如 `infra_runtime_fake_parity`、`job_entry_dispatch_only` 或 `config_non_core_dependency_guard`,主要映射到 BR-ID、NFR-ID、AC-ID、VETO-ID 和 `03` / `04` 设计契约。 |
| 每个 P0 需求 / 规则是否至少有一个测试切口、用例候选和证据 ID? | 是。见 §8.1~§8.4。具体用例 ID 在 Step 6 生成,具体 evidence ID 在 Step 13 固定。 |
| 覆盖矩阵完成后是否通过停审? | 通过。当前无 unresolved P0 覆盖空洞;P1/P2 和旧 `05/06` 方向均已标记为非 P0 或后续承接。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧覆盖矩阵围绕历史主链、旧命令、旧投影和旧环境组织,无法覆盖新版 C-ID / FR-ID / BR-ID / VETO-ID | 不继承旧矩阵,按新版 `00/03/04` 重建追溯 |
| Step 3 / Step 4 | 已有切口和分层,但还未和需求 ID / 验收方向闭合 | 本 Step 建立双向矩阵 |
| `03_ddd_step_16_test_cuts.md` | 详细设计只给最小测试入口,不负责需求覆盖裁决 | 本 Step 将最小入口映射到 C / FR / BR / NFR / AC / VETO |
| `04` §12 | 配置门禁已有方向,但未进入测试需求追溯 | 本 Step 将配置门禁映射到 NFR / AC / VETO 和测试切口 |
| 旧 `06-验收标准.md` | 旧 evidence / veto 不适用于新版 P0 | 本 Step 只预留证据候选族,正式 `06` 后续重建 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 覆盖方向 | 只有测试切口,未映射需求 | C-ID / FR-ID / BR-ID / NFR-ID / AC-ID / VETO-ID 全部映射到测试切口 | 验收可反查测试依据 |
| 证据口径 | 旧 evidence 方向不可直接使用 | 只预留 evidence family,正式证据留 Step 13 | 避免提前造 report / artifact 口径 |
| 自动化判断 | 未区分 P0 自动化和 P1/P2 selected-run | P0 可重复自动化优先;P1/P2 不伪装 P0 pass | 对齐 Step 2/4 |
| 配置覆盖 | 配置测试与需求矩阵分离 | 配置 gate 映射到 NFR / AC / VETO | 配置错误可能触发验收红线 |
| 反向追溯 | 测试切口不能直接反查需求 | 建立切口 -> 需求 / 规则 / 设计契约矩阵 | 防止孤儿测试和孤儿设计契约 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否逐条列 BR-ID-001~015 和 NFR-ID-001~009 的完整用例 | A. 本 Step 全量展开;B. 本 Step 按规则组映射,Step 6 再拆用例 | 采用 B。Step 5 是覆盖矩阵,不是用例全集 |
| 是否现在固定 EV 编号 | A. 现在固定;B. 只预留证据族 | 采用 B。正式 evidence ID 依赖 Step 9 自动化和 Step 13 归档 |
| 是否把 P1/P2 纳入 coverage pass | A. 纳入;B. 标记为 future / residual | 采用 B。P0 只证明 identity truth center 和 VETO-ID 红线 |
| 技术切口是否必须映射单个 FR | A. 必须映射单个 FR;B. 可映射 BR / NFR / AC / VETO / 设计契约 | 采用 B。幂等、回滚、redaction 和 dependency boundary 多数是横切规则 |

## 8. 结构化中间产物

### 8.1 C-ID 核心闭环覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景候选 | 用例候选族 | 自动化 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| C-ID-1 Identity Anchor | `00` §7/§9;`03` member anchor objects / `EstablishGlobalMember` / member queries;Step 16 command/query cuts | establish member、stable ref、anchor read、requested ref reuse reject、query no implicit create、auth/runtime not truth | `TC-ID-ANCHOR-*`;`TC-ID-CONTRACT-*`;`TC-ID-QUERY-*` | 是 | `EV-ID-CORE-*`;`EV-ID-ANCHOR-*` | 覆盖 |
| C-ID-2 Lifecycle Availability | `00` §7/§9;`03` lifecycle objects / `UpdateGlobalLifecycleState` / state matrix;Step 16 state cuts | valid lifecycle transition、illegal transition reject、high-risk basis required、lifecycle read、basis unavailable/rejected branch | `TC-ID-LIFECYCLE-*`;`TC-ID-STATE-*` | 是 | `EV-ID-LIFECYCLE-*`;`EV-ID-STATE-*` | 覆盖 |
| C-ID-3 Role Capability Summary | `00` §7/§9;`03` role summary / source snapshot / role source event;Step 16 role cuts | maintain role/capability summary、source evidence required、source unavailable/unrecognized、forbidden RoleDefinition / CapabilityDefinition body rejected | `TC-ID-ROLE-*`;`TC-ID-SOURCE-*`;`TC-ID-REDACTION-*` | 是 | `EV-ID-ROLE-*`;`EV-ID-REDACTION-*` | 覆盖 |
| C-ID-4 Career Memory References | `00` §7/§9;`03` career / memory / archive / handoff flows;Step 16 career/memory/callback cuts | append career record、duplicate source no duplicate、memory ref update、archive callback、trace handoff pending/delivered marker、external body rejected | `TC-ID-CAREER-*`;`TC-ID-MEMORY-*`;`TC-ID-HANDOFF-*` | 是 | `EV-ID-CAREER-*`;`EV-ID-MEMORY-*`;`EV-ID-ARCH-*` | 覆盖 |
| C-ID-5 Consumption Traceability | `00` §7/§9;`03` query / trace / outbox / job / reconciliation flows;`04` gates | formal query consumption、trace/audit read、outbound material accepted-only、projection/reconciliation/report-only、consumer receipt replay、dependency boundary | `TC-ID-CONSUME-*`;`TC-ID-TRACE-*`;`TC-ID-OUTBOX-*`;`TC-ID-JOB-*` | 是 | `EV-ID-CONSUME-*`;`EV-ID-JOB-*`;`EV-ID-ARCH-*` | 覆盖 |

### 8.2 FR-ID 功能需求覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景候选 | 用例候选族 | 自动化 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| FR-ID-001 建立身份主语 | `03` `EstablishGlobalMemberFlow`;Step 16 command cuts | accepted create、invalid actor/source/key reject、requested ref reuse conflict、stored result replay | `TC-ID-ANCHOR-*`;`TC-ID-CMD-*` | 是 | `EV-ID-ANCHOR-*` | 覆盖 |
| FR-ID-002 读取身份摘要 | `03` member query / summary view;Step 16 query cuts | visible hit、missing/not visible/degraded、query no-write、no implicit create | `TC-ID-QUERY-*`;`TC-ID-SUMMARY-*` | 是 | `EV-ID-CONSUME-*` | 覆盖 |
| FR-ID-003 身份引用稳定 | `03` identity anchor state / unique constraints / state matrix | ref stable across lifecycle、reuse rejected、duplicate replay does not allocate new ref | `TC-ID-ANCHOR-*`;`TC-ID-IDEMP-*` | 是 | `EV-ID-CORE-*` | 覆盖 |
| FR-ID-004 生命周期可用性 | `03` lifecycle flow/state/query | valid transition、availability read、reason required、illegal transition rejected | `TC-ID-LIFECYCLE-*`;`TC-ID-STATE-*` | 是 | `EV-ID-LIFECYCLE-*` | 覆盖 |
| FR-ID-005 高风险处置依据 | `03` high-risk lifecycle guard / governance basis resolver | missing/invalid/unavailable basis rejected or degraded per formal surface、trace retains safe basis refs | `TC-ID-LIFECYCLE-*`;`TC-ID-SEAM-*` | 是 | `EV-ID-LIFECYCLE-*` | 覆盖 |
| FR-ID-006 角色摘要 | `03` role summary command/query/source snapshot | source resolved、safe summary saved、source version tracked、definition body rejected | `TC-ID-ROLE-*` | 是 | `EV-ID-ROLE-*` | 覆盖 |
| FR-ID-007 能力画像摘要 | `03` capability summary / evidence refs / redaction | evidence/source required、no auto performance scoring body、query visible/degraded | `TC-ID-ROLE-*`;`TC-ID-REDACTION-*` | 是 | `EV-ID-ROLE-*` | 覆盖 |
| FR-ID-008 来源变化响应 | `03` role source changed event / reference refresh | source changed accepted/delayed/quarantined、unrecognized source does not silently pollute summary、duplicate receipt replay | `TC-ID-SOURCE-*`;`TC-ID-CONSUMER-*` | 是 | `EV-ID-ROLE-*`;`EV-ID-CONSUME-*` | 覆盖 |
| FR-ID-009 生涯追加 | `03` career append flow / work participation event | trusted source append、correction append、duplicate source noop、ProjectMember body rejected | `TC-ID-CAREER-*`;`TC-ID-CONSUMER-*` | 是 | `EV-ID-CAREER-*` | 覆盖 |
| FR-ID-010 memory refs | `03` memory reference command/query/state | ref create/update、pending/available/unavailable state、memory text/vector rejected、query no resolver call | `TC-ID-MEMORY-*`;`TC-ID-QUERY-*` | 是 | `EV-ID-MEMORY-*` | 覆盖 |
| FR-ID-011 记忆迁移 / 冷存协作 | `03` archive callback / handoff state / memory relation | archive result callback、handoff marker update、failed/cancelled issue marker、archive package body rejected | `TC-ID-MEMORY-*`;`TC-ID-HANDOFF-*` | 是 | `EV-ID-ARCH-*` | 覆盖 |
| FR-ID-012 身份事实消费 | `03` outbound material / query surface / consumer boundary | formal views/events only、payload marker body-free、not visible/degraded surfaces、downstream cannot write truth | `TC-ID-CONSUME-*`;`TC-ID-OUTBOX-*` | 是 | `EV-ID-CONSUME-*` | 覆盖 |
| FR-ID-013 身份变化追溯 | `03` trace/audit flows;Step 16 trace/query cuts | accepted changes append trace/audit、read trace visible/not visible、no raw audit log or body | `TC-ID-TRACE-*`;`TC-ID-REDACTION-*` | 是 | `EV-ID-CONSUME-*`;`EV-ID-REDACTION-*` | 覆盖 |
| FR-ID-014 投影 / 引用对账 | `03` projection/reference/reconciliation jobs;`04` operations profiles | rebuild/refresh/reconcile report-only、duplicate report replay、no adjacent truth repair、failed item issue refs | `TC-ID-JOB-*`;`TC-ID-RECON-*` | 是 | `EV-ID-JOB-*` | 覆盖 |

### 8.3 BR-ID / NFR-ID / AC-ID 规则覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景候选 | 用例候选族 | 自动化 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| BR-ID-001~003 身份锚定与边界 | `00` rules;`01` truth boundary;`03` anchor/query/auth separation | ref stable/no reuse、read no create、auth/runtime not `GlobalMember` truth | `TC-ID-ANCHOR-*`;`TC-ID-BOUNDARY-*` | 是 | `EV-ID-CORE-*` | 覆盖 |
| BR-ID-004~006 生命周期规则 | `03` lifecycle flow/state/high-risk guard | explicit actor/reason、basis required、project/runtime state cannot replace lifecycle | `TC-ID-LIFECYCLE-*`;`TC-ID-SEAM-*` | 是 | `EV-ID-LIFECYCLE-*` | 覆盖 |
| BR-ID-007~009 角色能力边界 | `03` role summary/source/evidence/redaction | no RoleDefinition / CapabilityDefinition body、source/evidence required、no auto evaluation/performance body | `TC-ID-ROLE-*`;`TC-ID-REDACTION-*` | 是 | `EV-ID-ROLE-*` | 覆盖 |
| BR-ID-010~012 生涯记忆边界 | `03` career/memory/archive flows and state | career append-only、project truth not repaired、memory/artifact/archive body rejected | `TC-ID-CAREER-*`;`TC-ID-MEMORY-*`;`TC-ID-REDACTION-*` | 是 | `EV-ID-CAREER-*`;`EV-ID-MEMORY-*` | 覆盖 |
| BR-ID-013~015 消费追溯对账边界 | `03` query/outbox/trace/reconciliation jobs | formal consumption only、trace safe reason/source、reconciliation report-only/no adjacent truth repair | `TC-ID-CONSUME-*`;`TC-ID-TRACE-*`;`TC-ID-JOB-*` | 是 | `EV-ID-CONSUME-*`;`EV-ID-JOB-*` | 覆盖 |
| NFR-ID-001 性能 baseline/sample | `00` NFR;Step 4 release boundary | summary read/write sample instrumentation、no old hard threshold pass claim | `TC-ID-NFR-*` | 部分 | `EV-ID-NFR-*` | 覆盖;硬阈值留 Step 10/14 |
| NFR-ID-002 可用性 | `03` query degraded surface;`04` adapter modes | anchor/lifecycle reads survive peripheral unavailable、role/memory degrade without corrupting truth | `TC-ID-QUERY-*`;`TC-ID-SEAM-*` | 是 | `EV-ID-CONSUME-*` | 覆盖 |
| NFR-ID-003 安全授权边界 | `03` metadata/actor/command guards | no trusted actor/context rejects、query/job cannot bypass write boundary | `TC-ID-CONTRACT-*`;`TC-ID-CMD-*` | 是 | `EV-ID-CORE-*` | 覆盖 |
| NFR-ID-004 forbidden material | `01` body exclusion;`03` redaction;`04` sensitive/no-output | no external body/credential/token/raw secret in truth/outbox/audit/report/log/artifact | `TC-ID-REDACTION-*` | 是 | `EV-ID-REDACTION-*` | 覆盖 |
| NFR-ID-005~009 traceability/consistency/observability | `03` trace/audit/idempotency/job/report/observability | all accepted changes traceable、duplicate no duplicate truth、append-only, safe drift summaries | `TC-ID-IDEMP-*`;`TC-ID-TRACE-*`;`TC-ID-JOB-*` | 是 | `EV-ID-CONSUME-*`;`EV-ID-JOB-*` | 覆盖 |
| AC-ID-001~005 核心闭环验收 | `00` C-ID;`03` Step 16 | C-ID-1~5 正向闭环 + 关键负向边界 | `TC-ID-CORE-*` | 是 | `EV-ID-CORE-*` | 覆盖 |
| AC-ID-006~010 功能能力验收 | `00` FR-ID;`03` protocol/flow/state | create/read separation、lifecycle rejection、source pollution guard、career duplicate、memory refs only | `TC-ID-FR-*`;`TC-ID-NEG-*` | 是 | `EV-ID-CORE-*` | 覆盖 |
| AC-ID-011~014 规则 / 数据 / 零容忍验收 | `00` BR/NFR;`01` ownership;`03` redaction/persistence | auth not truth、external bodies not truth、ownership split、body/secret/query-write/ref-reuse zero tolerance | `TC-ID-BOUNDARY-*`;`TC-ID-REDACTION-*`;`TC-ID-ARCH-*` | 是 | `EV-ID-REDACTION-*`;`EV-ID-ARCH-*` | 覆盖 |
| AC-ID-015 非功能验收 | `00` NFR;Step 4/10 planned | performance/availability/observability baseline or review口径,不继承旧数字 | `TC-ID-NFR-*`;`TC-ID-CONFIG-*` | 部分 | `EV-ID-NFR-*` | 覆盖;Step 10/13 细化 |

### 8.4 VETO-ID 与配置门禁覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景候选 | 用例候选族 | 自动化 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| VETO-ID-001 ref reused | `00` BR-ID-001;`03` anchor repository unique / duplicate replay | requested ref reuse rejected、lifecycle terminal state does not release ref、duplicate does not allocate new member | `TC-ID-ANCHOR-*`;`TC-ID-IDEMP-*` | 是 | `EV-ID-CORE-*` | 覆盖 |
| VETO-ID-002 query/consumer implicitly creates identity | `00` BR-ID-002;`03` query/consumer/job no-write | query missing returns missing/not visible、consumer/callback missing member delayed/quarantined/noop per formal branch、job no create | `TC-ID-QUERY-*`;`TC-ID-CONSUMER-*`;`TC-ID-JOB-*` | 是 | `EV-ID-CONSUME-*` | 覆盖 |
| VETO-ID-003 identity stores external bodies | `00` BR-ID-007/011/012;`01` body exclusion;`03` redaction | RoleDefinition/ProjectMember/memory/artifact/conversation/runtime/archive body rejected;all outputs scan clean | `TC-ID-REDACTION-*`;`TC-ID-BOUNDARY-*` | 是 | `EV-ID-REDACTION-*` | 覆盖 |
| VETO-ID-004 high-risk lifecycle without basis | `00` BR-ID-005;`03` high-risk guard | missing/invalid/unavailable governance or authorization basis cannot return accepted lifecycle change | `TC-ID-LIFECYCLE-*` | 是 | `EV-ID-LIFECYCLE-*` | 覆盖 |
| VETO-ID-005 reconciliation repairs adjacent truth | `00` BR-ID-015;`03` reconciliation job discipline | reconciliation emits report/finding/issue only;no write to work/governance/memory or identity business truth outside formal maintenance surface | `TC-ID-JOB-*`;`TC-ID-RECON-*` | 是 | `EV-ID-JOB-*` | 覆盖 |
| VETO-ID-006 business repo dependency loop/truth mixing | `01` dependency boundary;`03` crate contracts;`04` profile | no non-core sibling business compile dependency;runtime/event collaboration via ports/refs only | `TC-ID-ARCH-*`;`TC-ID-CONFIG-*` | 是 | `EV-ID-ARCH-*` | 覆盖 |
| Config profile / strict JSON / no silent fallback | `04` §6 / §9 / §12 | `local-dev` / `ci-test` / `integration-like` / `operations-replay` validate;invalid config fail-fast;disabled adapter not default success | `TC-ID-CONFIG-*` | 是 | `EV-ID-CONFIG-*` | 覆盖 |
| Runtime builder / adapter failure / redaction gates | `04` §8 / §11 / §12 | no partial facade, adapter unavailable/degraded uses formal outcome, config/report/log no raw secret/body | `TC-ID-CONFIG-*`;`TC-ID-SEAM-*`;`TC-ID-REDACTION-*` | 是 | `EV-ID-CONFIG-*`;`EV-ID-REDACTION-*` | 覆盖 |

### 8.5 测试切口反向覆盖矩阵

| 测试切口 | 需求 / 规则 ID | 设计契约 | 场景 | 用例候选 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| `contracts_protocol_surface_roundtrip`;`contracts_metadata_validation`;`contracts_body_free_command_schema` | FR-ID-001~014;NFR-ID-003~004;AC-ID-006~014 | `03` protocol DTO / metadata / body-free schema | DTO roundtrip、required metadata、schema version、body-free command/result | `TC-ID-CONTRACT-*` | `EV-ID-CORE-*` | 覆盖 |
| `domain_truth_factory_invariants`;`domain_policy_accept_reject`;`domain_state_transition_guards` | C-ID-1~4;BR-ID-001/004/008/010/012;AC-ID-001~004 | `03` object contracts / state matrix | factory invariant、policy reject、legal/illegal state transition、terminal guard | `TC-ID-DOMAIN-*`;`TC-ID-STATE-*` | `EV-ID-STATE-*` | 覆盖 |
| command cut family and 6 Command cuts | FR-ID-001/004/006/009/010/013;BR-ID-001/004/005/008/010/012/014 | `03` command flows / UoW / stored result | accepted/rejected/duplicate/conflict, trace/audit/outbound/stale/stored result | `TC-ID-CMD-*` | `EV-ID-CORE-*` | 覆盖 |
| query cut family and 14 Query cuts | FR-ID-002/012/013/014;BR-ID-002/013/014/015;NFR-ID-002 | `03` query no-write / read visibility / query surface | visible hit、missing、not visible、degraded/stale、no write/no repair | `TC-ID-QUERY-*` | `EV-ID-CONSUME-*` | 覆盖 |
| inbound / callback cut family | FR-ID-008/009/011/012;BR-ID-007/011/012/013 | `03` inbound envelope / typed receipt / callback flows | accepted、duplicate receipt replay、unsupported/delayed/quarantined、body-free payload | `TC-ID-CONSUMER-*` | `EV-ID-CONSUME-*` | 覆盖 |
| outbound material cut family | FR-ID-012/013;BR-ID-013/014;NFR-ID-004 | `03` outbound material / payload marker / publish discipline | accepted-only material、saved marker snapshot、topic binding、no current truth reconstruction | `TC-ID-OUTBOX-*` | `EV-ID-CONSUME-*` | 覆盖 |
| operations job cuts | FR-ID-014;BR-ID-015;NFR-ID-006/008/009;VETO-ID-005 | `03` jobs / stored report / no truth repair | rebuild/refresh/reconcile/publish/deliver/retry, partial report, duplicate replay | `TC-ID-JOB-*` | `EV-ID-JOB-*` | 覆盖 |
| consistency / idempotency cuts | FR-ID-001/008/009/014;NFR-ID-006~007;AC-ID-009/014 | `03` UoW / idempotency / stored surface / version | same digest replay、different digest conflict、commit unknown、rollback, append-only no duplicate | `TC-ID-IDEMP-*` | `EV-ID-CORE-*` | 覆盖 |
| config test cuts | NFR-ID-002/004/008~009;AC-ID-015;VETO-ID-006 | `04` profile / strict JSON / runtime builder / adapter modes | profile matrix、invalid config fail-fast、source priority、disabled adapter no success | `TC-ID-CONFIG-*` | `EV-ID-CONFIG-*` | 覆盖 |
| redaction / observability cuts | NFR-ID-004/005/008;AC-ID-012~014;VETO-ID-003 | `03` observability/redaction;`04` sensitive/no-output | log/metric/audit/trace/report/outbox no raw body/secret/full sensitive ref | `TC-ID-REDACTION-*` | `EV-ID-REDACTION-*` | 覆盖 |
| dependency boundary cut | VETO-ID-006;AC-ID-011~013 | `01` dependency boundary;`03` module contracts | no non-core sibling business compile dependency;ports/refs-only collaboration | `TC-ID-ARCH-*` | `EV-ID-ARCH-*` | 覆盖 |

### 8.6 未覆盖项清单

| 项 | 状态 | 原因 | 后续处理 |
|---|---|---|---|
| P0 C-ID / FR-ID / BR-ID / NFR-ID / AC-ID / VETO-ID | 无未覆盖项 | 均已映射到测试切口和层级 | Step 6 拆具体用例 |
| 真实 DB / bus / archive / metric / secret provider 产品 | 非 P0 | 产品未锁定;P0 只证明 controlled seam | Step 14 残余风险 / P1 selected-run |
| production-like profile、容量模型、硬 SLO | 非 P0 | 当前不继承旧固定阈值 | Step 10 / Step 14 标记 baseline/sample/风险 |
| 外部 HR / IdP、复杂组织结构、高级员工主页 | 非 P0 | 外围增强,不影响 identity truth center P0 | Step 14 残余风险 |
| full event-sourcing-first | 非 P0 | 架构演进方向,不是当前测试方案前置 | Step 14 残余风险 |

### 8.7 覆盖矩阵停审记录

| 覆盖项 / 测试切口 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| C-ID-1~5 | 每个核心闭环是否至少有正向主线、负向边界和证据候选族 | 通过 | 见 §8.1 |
| FR-ID-001~014 | 每个功能需求是否映射设计契约和测试切口 | 通过 | 见 §8.2 |
| BR-ID-001~015 | 不变量、禁止行为、显式变化、边界约束、治理约束、审计约束是否覆盖 | 通过 | 见 §8.3 |
| NFR-ID-001~009 | 性能、可用性、安全、追溯、幂等和可观测性是否有验证口径 | 通过 | 性能硬阈值不作为 P0 pass;Step 10/14 再说明 |
| AC-ID-001~015 | 验收方向是否都有测试证据候选 | 通过 | 正式 evidence ID 留 Step 13 |
| VETO-ID-001~006 | 一票否决是否均有自动化或脚本 gate 候选 | 通过 | VETO-ID-006 依赖 dependency check;Step 9 固定执行方式 |
| Step 3 全部 P0 测试切口 | 是否能反查需求 / 规则 / 设计契约 | 通过 | 见 §8.5 |
| 配置门禁 | 是否承接 `04` §12 | 通过 | Step 9/13 固定 artifact/report |
| 证据编号 | 是否提前固定导致 Step 13 冲突 | 通过 | 当前只预留候选族 |

### 8.8 跨覆盖项审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在 P0 孤儿需求 | 通过 | 当前未发现 |
| 是否存在 P0 孤儿设计契约 | 通过 | Step 3 / Step 16 切口均已反查 |
| 是否存在 P0 孤儿测试切口 | 通过 | 见 §8.5 |
| 是否存在重复证据 ID | 通过 | 本 Step 未固定正式 EV 编号,无冲突 |
| 是否存在 P0 自动化缺口 | 通过 | 需要 Step 9 固定脚本 / suite,但自动化候选已明确 |
| 是否把 P1/P2 写成 P0 pass | 通过 | 真实产品、production-like、容量和外围增强均已标记非 P0 |
| 是否有测试切口越过设计真相源 | 通过 | 当前矩阵只引用 `00/03/04` 和 Step 2~4 结论 |
| 是否提前装配正式 `05-测试方案.md` | 通过 | 正式文档仍留 Step 15 |

## 9. 对上游设计的影响判定

| 覆盖结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 覆盖矩阵无空洞 | 否 | 测试方案追溯 | 无需回写 |
| 用例 ID 和 evidence ID 仅预留候选族 | 否 | SOP 分工 | Step 6 / Step 13 承接 |
| VETO-ID-006 需要 dependency check | 否 | 自动化门禁需求 | Step 9 固定脚本或 gate |
| 性能硬阈值不作为 P0 pass | 否 | 范围边界 | Step 10 / Step 14 记录 |
| 若 Step 6 发现某需求无法构造用例 | 是 | 可验证性缺口 | 回写 `03` / `04` 或记录阻塞 |
| 若 Step 13 发现 evidence 无正式产面 | 是 | 验收闭环缺口 | 回写测试方案自动化 / evidence 设计或记录阻塞 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_05_traceability_coverage.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“C-ID 核心闭环覆盖矩阵”“FR-ID 功能需求覆盖矩阵”“VETO-ID 与配置门禁覆盖矩阵”“测试切口反向覆盖矩阵”和“跨覆盖项审计表”小节,了解需求和测试切口如何双向追溯。

正式 `05-测试方案.md` §5 应回填:

- 覆盖矩阵必须从 C-ID、FR-ID、BR-ID、NFR-ID、AC-ID 和 VETO-ID 追溯到正式设计契约和 Step 3 测试切口。
- C-ID-1~5 和 FR-ID-001~014 均为 P0 覆盖项,必须至少有用例候选族、自动化候选和证据候选族。
- BR-ID-001~015 可按身份锚定、生命周期、角色能力、生涯记忆、消费追溯对账成组覆盖,但 Step 6 必须拆到关键正向 / 负向场景。
- VETO-ID-001~006 均必须有可重复测试或脚本 gate 候选;任何命中都不能被 release gate 汇总伪装为通过。
- 真实 DB / bus / archive / metric / secret provider、production-like profile、容量模型、硬 SLO、外部 HR / IdP、复杂组织结构、高级员工主页和 full event-sourcing-first 属于 P1/P2 或残余风险,不得算作 P0 覆盖空洞。
- 正式 evidence ID、artifact 路径和报告归档规则由 Step 13 固定;本章只预留证据候选族。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 6 用例矩阵规模较大 | 需要按测试切口分批写入 | 后续按 anchor/lifecycle、role/source、career/memory、query/consumer/outbound/job、state/consistency/config 分批 |
| VETO-ID-006 dependency check 采用脚本还是人工 gate | 影响 Step 9 / Step 13 evidence | Step 9 固定 |
| performance candidate 是否需要 P0 smoke 指标 | 影响 Step 10 非功能测试 | 当前不设硬阈值,Step 10 说明 |
| evidence family 是否满足验收方命名偏好 | 影响 Step 13 编号 | Step 13 前仍可调整 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 覆盖矩阵无空洞,或空洞已进入风险 | 通过 | 当前 P0 无未覆盖项 |
| 覆盖矩阵可从需求 / 规则查测试切口 | 通过 | 见 §8.1~§8.4 |
| 覆盖矩阵可从测试切口反查需求 / 规则 / 设计契约 | 通过 | 见 §8.5 |
| 覆盖矩阵已停审 | 通过 | 见 §8.7 |
| 跨覆盖项审计无 unresolved 冲突 | 通过 | 见 §8.8 |
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 6 | 待用户确认 | 用户审核通过后进入 Step 6: 设计测试场景与用例矩阵 |
