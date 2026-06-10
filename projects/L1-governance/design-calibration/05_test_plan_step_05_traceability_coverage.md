# Step 5. 建立需求追溯与覆盖矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填章节: `05-测试方案.md` §5 需求追溯与覆盖矩阵

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 建立需求追溯与覆盖矩阵 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 2 测试范围;Step 3 测试对象与测试切口;Step 4 测试策略与分层;`00/03/04` 正式输入 |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_05_traceability_coverage.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 6 |

## 2. 本步目标

建立从需求、业务规则、验收方向、设计契约和配置门禁到测试切口的双向追溯。

本 Step 只回答:

- 每个 P0 核心闭环、功能需求、业务规则、验收方向和一票否决项由哪些测试切口覆盖。
- 每个 P0 测试切口反向证明哪些需求、规则或设计契约。
- 哪些覆盖项必须自动化,哪些只能保留为 P1/P2 或残余风险。
- 是否存在 P0 孤儿需求、孤儿设计契约、孤儿测试切口或覆盖空洞。

本 Step 不展开具体测试步骤、fixture、精确 TC 编号全集、artifact 路径、执行脚本或正式 evidence 编号。用例矩阵由 Step 6 细化,证据归档由 Step 13 固定。本 Step 只预留用例候选族和证据候选族,避免提前定义执行报告格式。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` §7 / §9 / §10 / §13 / §14 | 正式输入 | 提供 C-GOV、FR-GOV、BR-GOV、AC-GOV、VF-GOV 和非功能要求 |
| `03-详细设计.md` §5~§16 | 正式输入 | 提供模块、对象、协议、flow、状态、事务、错误、幂等、配置、观测和最小测试切口 |
| `03_ddd_step_16_test_cuts.md` | 直接输入 | 提供 Command / Query / Consumer / Outbound / Job / state / consistency / config / observability 切口 |
| `04-配置设计.md` §12 | 直接输入 | 提供配置测试主题、验收门禁和 evidence 方向 |
| `05_test_plan_step_02_scope.md` | 已完成 | 固定 P0 / P1 / P2、非范围和 VF-GOV 关联 |
| `05_test_plan_step_03_test_objects_cuts.md` | 已完成 | 固定测试对象、切口和负向风险入口 |
| `05_test_plan_step_04_strategy_layers.md` | 已完成 | 固定每个切口的主发现层级和 release gate 边界 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 需求对应哪些设计章节? | C-GOV-1~5 和 FR-GOV-001~010 均回指 `00` 需求、`03` §5~§16 和 `04` §12。核心 truth 能力主要回指 `03` §5~§12;配置、外部依赖和观测边界回指 `03` §13~§15 与 `04` §12。 |
| 每个 P0 需求至少有哪些测试场景? | 每个 P0 需求至少映射到协议 roundtrip、domain invariant/state、application flow、consistency/idempotency、query/consumer/outbox/job 或 config/redaction 切口之一。核心闭环需求还必须有正向主线和负向边界候选。 |
| 哪些场景必须自动化? | P0 public protocol、domain state、command/query/consumer/job orchestration、duplicate replay、query no-write、job no truth repair、config validation、redaction scan 和 dependency boundary 必须自动化或形成可重复脚本 gate。P1 real-like 和 P2 capacity 不作为当前 P0 自动化前置。 |
| 每个场景的证据如何编号? | 本 Step 只预留证据候选族,例如 `EV-GOV-CORE-*`、`EV-GOV-CMD-*`、`EV-GOV-STATE-*`、`EV-GOV-CONFIG-*`。正式 evidence ID、artifact 路径和报告索引由 Step 13 固定。 |
| 哪些需求暂未覆盖,原因是什么? | 当前 P0 未发现未覆盖项。FR-GOV-E01~E06、真实产品、生产容量、高级 DSL、复杂 Gate、自动草拟和 external GRC 深度集成属于 P1/P2 或外围增强,不计为 P0 空洞。 |
| 每个 Step 3 测试切口是否映射到需求 / 规则 / 设计契约? | 是。见 §8.5 反向覆盖矩阵。少数技术切口,如 `operation_namespace_isolation` 或 `rollback_failure_surfaces_manual_intervention`,主要映射到 BR-GOV-039~040、AC-GOV-030~031 和 `03` Step 11~13。 |
| 每个 P0 需求 / 规则是否至少有一个测试切口、用例候选和证据候选? | 是。见 §8.1~§8.4。具体用例 ID 在 Step 6 生成,具体 evidence ID 在 Step 13 固定。 |
| 覆盖矩阵完成后是否通过停审? | 通过。当前无 unresolved P0 覆盖空洞;P1/P2 和旧 `05/06` 方向均已标记为非 P0 或后续承接。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧覆盖矩阵围绕旧 GovernanceRequest / Decision 主线,无法覆盖新版 C-GOV / FR-GOV / BR-GOV / VF-GOV | 不继承旧矩阵,按新版 `00/03/04` 重建追溯 |
| Step 3 / Step 4 | 已有切口和分层,但还未和需求 ID / 验收方向闭合 | 本 Step 建立双向矩阵 |
| `03_ddd_step_16_test_cuts.md` | 详细设计只给最小测试入口,不负责需求覆盖裁决 | 本 Step 将最小入口映射到 C/FR/BR/AC/VF |
| `04` §12 | 配置门禁已有方向,但未进入测试需求追溯 | 本 Step 将配置门禁映射到 BR / AC / VF 和测试切口 |
| 旧 `06-验收标准.md` | 旧 evidence / veto 不适用于新版 P0 | 本 Step 只预留证据候选族,正式 `06` 后续重建 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 覆盖方向 | 只有测试切口,未映射需求 | C-GOV / FR-GOV / BR-GOV / AC-GOV / VF-GOV 全部映射到测试切口 | 验收可反查测试依据 |
| 证据口径 | 旧 evidence 方向不可直接使用 | 只预留 evidence family,正式证据留 Step 13 | 避免提前造 report / artifact 口径 |
| 自动化判断 | 未区分 P0 自动化和 P1/P2 selected-run | P0 可重复自动化优先;P1/P2 不伪装 P0 pass | 对齐 Step 2/4 |
| 配置覆盖 | 配置测试与需求矩阵分离 | 配置 gate 映射到 BR / AC / VF | 配置错误可能触发验收红线 |
| 反向追溯 | 测试切口不能直接反查需求 | 建立切口 -> 需求 / 规则 / 设计契约矩阵 | 防止孤儿测试和孤儿设计契约 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否逐条列 BR-GOV-001~040 的完整用例 | A. 本 Step 全量展开;B. 本 Step 按规则组映射,Step 6 再拆用例 | 采用 B。Step 5 是覆盖矩阵,不是用例全集 |
| 是否现在固定 EV 编号 | A. 现在固定;B. 只预留证据族 | 采用 B。正式 evidence ID 依赖 Step 9 自动化和 Step 13 归档 |
| 是否把 P1/P2 纳入 coverage pass | A. 纳入;B. 标记为 future / residual | 采用 B。P0 只证明 Governance truth center 和 VF-GOV 红线 |
| 技术切口是否必须映射业务需求 | A. 必须映射单个 FR;B. 可映射 BR / AC / VF / 设计契约 | 采用 B。幂等、回滚、redaction 和 dependency boundary 多数是横切规则 |

## 8. 结构化中间产物

### 8.1 C-GOV 核心闭环覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景候选 | 用例候选族 | 自动化 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| C-GOV-1 治理语境与适用对象能够被确定 | `00` §7/§9;`03` §5~§8;Step 16 command/query cuts | 创建 context、提交 input、外部引用 unresolved/degraded、正文禁止入仓、query no-write | `TC-GOV-CTX-*`;`TC-GOV-INPUT-*`;`TC-GOV-BOUNDARY-*` | 是 | `EV-GOV-CORE-*`;`EV-GOV-CMD-*` | 覆盖 |
| C-GOV-2 关键节点治理裁决能够形成正式结论 | `00` §7/§9;`03` §6~§12;Step 16 command/state cuts | open gate、record/supersede decision、approval responsibility/vote/delegate、非法终态拒绝、相邻状态不能替代 | `TC-GOV-GATE-*`;`TC-GOV-DECISION-*`;`TC-GOV-APPROVAL-*` | 是 | `EV-GOV-CORE-*`;`EV-GOV-STATE-*` | 覆盖 |
| C-GOV-3 治理策略与控制适用约束能够成立 | `00` §7/§9;`03` §6~§13;Step 16 policy/control cuts | activate/update policy、shared rule set、policy conflict、control applicability/review、method definition unavailable | `TC-GOV-POLICY-*`;`TC-GOV-CONTROL-*` | 是 | `EV-GOV-POLICY-*`;`EV-GOV-CONTROL-*` | 覆盖 |
| C-GOV-4 影响评估、适用性声明与不符合纠正能够形成治理闭环 | `00` §7/§9;`03` §6~§12;Step 16 compliance/nonconformity cuts | submit/approve AIIA/SoA、raise/confirm/plan/complete/verify nonconformity、artifact/evidence body-free | `TC-GOV-COMPLIANCE-*`;`TC-GOV-NC-*` | 是 | `EV-GOV-COMPLIANCE-*`;`EV-GOV-NC-*` | 覆盖 |
| C-GOV-5 治理事实能够被相邻仓消费并被持续追溯 | `00` §7/§9;`03` §7~§16;`04` §12 | query/trace/dashboard/reconciliation、inbound consumer、outbound publish、projection rebuild、refresh、handoff/archive/export job | `TC-GOV-QUERY-*`;`TC-GOV-CONSUMER-*`;`TC-GOV-OUTBOX-*`;`TC-GOV-JOB-*` | 是 | `EV-GOV-TRACE-*`;`EV-GOV-JOB-*` | 覆盖 |

### 8.2 FR-GOV 功能需求覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景候选 | 用例候选族 | 自动化 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| FR-GOV-001 治理语境与适用对象确定 | `03` context object / CreateGovernanceContext / queries | context 建立、scope/subject refs、boundary refs-only、missing/invalid ref reject | `TC-GOV-CTX-*` | 是 | `EV-GOV-CORE-*` | 覆盖 |
| FR-GOV-002 治理输入收束与可裁决语境形成 | `03` GovernanceInput / Submit/Update input flows | input accepted/rejected/pending evidence、automation trigger body-free、unresolved source degraded | `TC-GOV-INPUT-*` | 是 | `EV-GOV-CMD-*` | 覆盖 |
| FR-GOV-003 关键节点正式治理裁决 | `03` Gate / Decision / Approval flows and state matrix | gate open、decision finalize/supersede、approval vote/delegate、terminal guard | `TC-GOV-GATE-*`;`TC-GOV-DECISION-*` | 是 | `EV-GOV-STATE-*` | 覆盖 |
| FR-GOV-004 自动化治理边界表达 | `03` Policy / Gate automation boundary;BR-GOV-019/036 | unauthorized automation reject、runtime/capability summary only、high impact requires formal responsibility | `TC-GOV-AUTO-*`;`TC-GOV-POLICY-*` | 是 | `EV-GOV-POLICY-*` | 覆盖 |
| FR-GOV-005 Policy 生效与授权约束 | `03` PolicyEffectiveFact / SharedRuleSet / PolicyConflict | policy activation/update、shared rule priority、conflict resolve/waive、method unavailable | `TC-GOV-POLICY-*` | 是 | `EV-GOV-POLICY-*` | 覆盖 |
| FR-GOV-006 Control 适用与复核责任 | `03` ControlApplicability / ControlReview | applicability assess、review pass/fail/waive、control definition body-free | `TC-GOV-CONTROL-*` | 是 | `EV-GOV-CONTROL-*` | 覆盖 |
| FR-GOV-007 AIIA / SoA 治理评审结论 | `03` ComplianceConclusion flows and state matrix | AIIA/SoA submit/approve/reject/revoke、coverage missing、artifact body rejected | `TC-GOV-COMPLIANCE-*` | 是 | `EV-GOV-COMPLIANCE-*` | 覆盖 |
| FR-GOV-008 Nonconformity 纠正闭环 | `03` Nonconformity / CorrectiveAction / Verification | raise/cause/plan/complete/verify、failed verification keeps open、bug/work alert cannot close | `TC-GOV-NC-*` | 是 | `EV-GOV-NC-*` | 覆盖 |
| FR-GOV-009 治理事实消费与追溯 | `03` query / consumer / outbound / trace flows | all queries no-write、consumer snapshot/receipt、outbound stored snapshot、trace/audit refs-only | `TC-GOV-QUERY-*`;`TC-GOV-CONSUMER-*`;`TC-GOV-OUTBOX-*` | 是 | `EV-GOV-TRACE-*` | 覆盖 |
| FR-GOV-010 治理事实维护、对账、报告和归档准备 | `03` job flows;`04` failure/degraded gates | publish/rebuild/refresh/reconcile/handoff/archive/export、duplicate report replay、no truth repair | `TC-GOV-JOB-*`;`TC-GOV-HANDOFF-*` | 是 | `EV-GOV-JOB-*` | 覆盖 |

### 8.3 BR-GOV / AC-GOV 规则覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景候选 | 用例候选族 | 自动化 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| BR-GOV-001~011 不变量 | `03` object contracts / state matrix / read model rules | truth object factory、不变量 reject、read/report/job 不成业务 truth | `TC-GOV-DOMAIN-*`;`TC-GOV-READ-*`;`TC-GOV-JOB-*` | 是 | `EV-GOV-STATE-*` | 覆盖 |
| BR-GOV-012~020 禁止行为 | `01` truth boundary;`03` flow/error/config/observability | sibling state cannot write truth、external body rejected、query/job no-write、automation no bypass | `TC-GOV-BOUNDARY-*`;`TC-GOV-NEG-*` | 是 | `EV-GOV-BOUNDARY-*` | 覆盖 |
| BR-GOV-021~027 显式变化 | `03` command flows / history / trace / outbox | context/input/gate/decision/policy/control/compliance/nonconformity changes require command and trace/history | `TC-GOV-CMD-*`;`TC-GOV-TRACE-*` | 是 | `EV-GOV-CMD-*` | 覆盖 |
| BR-GOV-028~035 边界约束 | `01` dependencies;`03` source resolver / snapshot / redaction | process/work/artifact/conversation/identity/method/runtime/observability refs-only and body-free | `TC-GOV-SEAM-*`;`TC-GOV-REDACTION-*` | 是 | `EV-GOV-BOUNDARY-*`;`EV-GOV-REDACTION-*` | 覆盖 |
| BR-GOV-036~038 治理约束 | `03` Gate / Policy / Control / Nonconformity policies | high impact decision responsibility、shared rules review、high severity NC formal closure | `TC-GOV-POLICY-*`;`TC-GOV-NC-*` | 是 | `EV-GOV-POLICY-*` | 覆盖 |
| BR-GOV-039~040 审计约束 | `03` trace/audit/outbox/job/report/handoff;`04` config audit | accepted mutation trace/audit、publish/consumer/report/handoff source/result explainability | `TC-GOV-TRACE-*`;`TC-GOV-JOB-*`;`TC-GOV-CONFIG-*` | 是 | `EV-GOV-TRACE-*`;`EV-GOV-CONFIG-*` | 覆盖 |
| AC-GOV-001~005 核心能力闭环验收 | `00` C-GOV;`03` Step 16 | C-GOV-1~5 正向闭环 + 关键负向边界 | `TC-GOV-CORE-*` | 是 | `EV-GOV-CORE-*` | 覆盖 |
| AC-GOV-006~015 功能能力验收 | `00` FR-GOV;`03` protocol/flow/state | FR-GOV-001~010 每项至少一组 protocol/service/state/query/job tests | `TC-GOV-FR-*` | 是 | `EV-GOV-FR-*` | 覆盖 |
| AC-GOV-016~021 规则 / 边界验收 | `00` BR-GOV;`01` boundary;`03` error/state | invariant、forbidden、explicit change、boundary、governance constraint、audit constraint | `TC-GOV-BR-*`;`TC-GOV-NEG-*` | 是 | `EV-GOV-BR-*` | 覆盖 |
| AC-GOV-022~025 数据归属验收 | `01` data ownership;`03` persistence/redaction;`04` no-output | Governance truth ownership、external snapshot non-truth、refs-only、external body absent | `TC-GOV-OWNERSHIP-*`;`TC-GOV-REDACTION-*` | 是 | `EV-GOV-OWNERSHIP-*` | 覆盖 |
| AC-GOV-026~031 非功能验收 | `00` NFR;`03` consistency/observability;`04` profile/failure | performance candidate only、availability/degraded、security/redaction、audit/idempotency/observability | `TC-GOV-NFR-*`;`TC-GOV-CONFIG-*` | 部分 | `EV-GOV-NFR-*` | 覆盖;硬性能阈值不在 P0 |

### 8.4 VF-GOV 与配置门禁覆盖矩阵

| 需求 / 规则 ID | 设计依据 | 测试场景候选 | 用例候选族 | 自动化 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| VF-GOV-001 核心闭环断裂 | `00` C-GOV-1~5;`03` Step 16 | release main smoke + C/FR core suites;任一核心链断裂 fail | `TC-GOV-CORE-*` | 是 | `EV-GOV-CORE-*` | 覆盖 |
| VF-GOV-002 相邻状态替代 Decision truth | `01` boundary;`03` command/consumer/state | process/work/conversation/runtime 只能 refs/snapshot/consumer,不能写 Decision | `TC-GOV-BOUNDARY-*` | 是 | `EV-GOV-BOUNDARY-*` | 覆盖 |
| VF-GOV-003 外部正文入仓 | `01` body exclusion;`03` redaction;`04` sensitive/no-output | artifact/evidence/method/runtime/observability/external GRC body rejected and scan clean | `TC-GOV-REDACTION-*` | 是 | `EV-GOV-REDACTION-*` | 覆盖 |
| VF-GOV-004 Policy truth 被反向定义 | `03` PolicyEffectiveFact / method/runtime boundary | method/runtime/capability only summary/ref;Policy effective fact owns truth | `TC-GOV-POLICY-*`;`TC-GOV-SEAM-*` | 是 | `EV-GOV-POLICY-*` | 覆盖 |
| VF-GOV-005 shared rules 被低 scope 覆盖 | `03` shared rule set / conflict policy | lower scope override rejected or conflict created;organization hard constraints preserved | `TC-GOV-POLICY-*` | 是 | `EV-GOV-POLICY-*` | 覆盖 |
| VF-GOV-006 Decision 原地改写 | `03` decision state/history | finalized decision supersede creates new fact/history,not in-place update | `TC-GOV-DECISION-*`;`TC-GOV-STATE-*` | 是 | `EV-GOV-STATE-*` | 覆盖 |
| VF-GOV-007 AIIA / SoA body boundary | `03` compliance conclusion;`04` redaction | conclusion refs artifact/evidence;no second body;artifact unresolved degraded/reject branch | `TC-GOV-COMPLIANCE-*`;`TC-GOV-REDACTION-*` | 是 | `EV-GOV-COMPLIANCE-*` | 覆盖 |
| VF-GOV-008 Nonconformity 退化 | `03` nonconformity policy/state | bug/work blocker/alert cannot close;formal cause/action/verification required | `TC-GOV-NC-*` | 是 | `EV-GOV-NC-*` | 覆盖 |
| VF-GOV-009 读/维护面反写真相 | `03` query/job templates;Step 16 | query no-write、projection/reconcile/handoff/export no truth repair、stored report replay | `TC-GOV-QUERY-*`;`TC-GOV-JOB-*` | 是 | `EV-GOV-JOB-*` | 覆盖 |
| VF-GOV-010 sibling compile dependency | `01` dependency boundary;`03` module contracts;`04` profile | dependency scan only allows `L0-core` compile-time upstream;adapter refs instead of package dependency | `TC-GOV-ARCH-*` | 是 | `EV-GOV-ARCH-*` | 覆盖 |
| Config schema / no silent fallback / runtime builder gates | `04` §12 | strict JSON、source priority、invalid config fail-fast、no partial facade | `TC-GOV-CONFIG-*` | 是 | `EV-GOV-CONFIG-*` | 覆盖 |
| Profile / topic / publication / external GRC gates | `04` §12;`03` outbox/job flows | P0 profiles assemble;topic completeness;publisher failure marker;external GRC disabled no core truth impact | `TC-GOV-CONFIG-*`;`TC-GOV-OUTBOX-*`;`TC-GOV-JOB-*` | 是 | `EV-GOV-CONFIG-*`;`EV-GOV-JOB-*` | 覆盖 |

### 8.5 测试切口反向覆盖矩阵

| 测试切口 | 需求 / 规则 ID | 设计契约 | 场景 | 用例候选 | 证据候选族 | 覆盖状态 |
|---|---|---|---|---|---|---|
| `contracts_protocol_roundtrip`;`contracts_metadata_validation`;`contracts_operation_digest_profile` | FR-GOV-001~010;AC-GOV-006~015;AC-GOV-030 | `03` §7;Step 8 / 13 / 16 | DTO roundtrip、required metadata、digest conflict | `TC-GOV-CONTRACT-*` | `EV-GOV-CONTRACT-*` | 覆盖 |
| `domain_object_invariants`;`domain_policy_accept_reject`;`domain_state_matrix_transitions` | BR-GOV-001~011;BR-GOV-036~038;AC-GOV-016/020/030 | `03` §6 / §9;Step 6 / 10 / 16 | factory invariant、policy reject、legal/illegal state transition | `TC-GOV-DOMAIN-*`;`TC-GOV-STATE-*` | `EV-GOV-STATE-*` | 覆盖 |
| `application_command_orchestration` and 23 command cuts | C-GOV-1~4;FR-GOV-001~008;BR-GOV-021~027 | `03` §8.1;Step 9 / 11 / 13 / 16 | accepted/rejected/duplicate/version conflict/UoW order | `TC-GOV-CMD-*` | `EV-GOV-CMD-*` | 覆盖 |
| `application_query_no_write` and 14 query cuts | FR-GOV-009~010;BR-GOV-011/020;VF-GOV-009 | `03` §7.2 / §8.2 / §10;Step 9 / 16 | hit/missing/not-visible/degraded/stale/failed/no-write | `TC-GOV-QUERY-*` | `EV-GOV-QUERY-*` | 覆盖 |
| `application_consumer_orchestration` and 9 consumer cuts | FR-GOV-009;BR-GOV-028~035;VF-GOV-002~004 | `03` §7.3 / §8.3 / §12~13;Step 16 | accepted/duplicate/unsupported/delayed/body-free snapshot | `TC-GOV-CONSUMER-*` | `EV-GOV-CONSUMER-*` | 覆盖 |
| outbound event schema cuts and publisher cuts | FR-GOV-009~010;BR-GOV-039~040;VF-GOV-003/009 | `03` §7.3 / §8.4 / §11~13;Step 16 | stored payload snapshot、topic map、publish failure marker、no body | `TC-GOV-OUTBOX-*` | `EV-GOV-OUTBOX-*` | 覆盖 |
| operations job cuts | FR-GOV-010;BR-GOV-011/020/040;VF-GOV-009 | `03` §7.4 / §8.4 / §11~13;Step 16 | duplicate report replay、partial failure、no truth repair、handoff/export marker | `TC-GOV-JOB-*` | `EV-GOV-JOB-*` | 覆盖 |
| consistency / idempotency cuts | AC-GOV-030;BR-GOV-003/039~040;VF-GOV-006/009 | `03` §10~§12;Step 11~13 / 16 | same key replay、different digest conflict、commit unknown、rollback, race guard | `TC-GOV-IDEMP-*` | `EV-GOV-IDEMP-*` | 覆盖 |
| config test cuts | AC-GOV-026~031;VF-GOV-003/009/010 | `04` §6 / §9 / §11 / §12;`03` §13 | profile matrix、strict JSON、source priority、runtime builder、topic completeness | `TC-GOV-CONFIG-*` | `EV-GOV-CONFIG-*` | 覆盖 |
| redaction / observability cuts | BR-GOV-014/030/035/039~040;AC-GOV-025/028/031;VF-GOV-003/007 | `03` §14;`04` §8 / §12 | log/metric/audit/trace/report/outbox no raw body/secret/full sensitive ref | `TC-GOV-REDACTION-*` | `EV-GOV-REDACTION-*` | 覆盖 |
| dependency boundary cut | VF-GOV-010;AC-GOV-019 | `01` dependency boundary;`03` module contracts | no non-core sibling compile dependency | `TC-GOV-ARCH-*` | `EV-GOV-ARCH-*` | 覆盖 |

### 8.6 未覆盖项清单

| 项 | 状态 | 原因 | 后续处理 |
|---|---|---|---|
| P0 C-GOV / FR-GOV / BR-GOV / AC-GOV / VF-GOV | 无未覆盖项 | 均已映射到测试切口和层级 | Step 6 拆具体用例 |
| FR-GOV-E01 高级治理看板与报表 | 非 P0 | 外围增强 | Step 14 残余风险 / future selected-run |
| FR-GOV-E02 Policy DSL 与模拟评估 | 非 P0 | 高级 DSL 未进入核心闭环 | Step 14 残余风险 |
| FR-GOV-E03 复杂 Gate 编排与升级路径 | 非 P0 | 当前只证明基础正式裁决 | Step 14 残余风险 |
| FR-GOV-E04 AIIA / SoA 自动草拟和周期重评建议 | 非 P0 | 自动建议不得替代正式结论 | Step 14 残余风险 |
| FR-GOV-E05 外部 GRC / 审计工具集成 | 非 P0 | P0 只测 disabled/fake/controlled export boundary | Step 14 / P1 |
| FR-GOV-E06 容量、延迟、策略传播和报告健康度分析 | 非 P0 | 硬性能阈值和负载模型未锁定 | Step 10 / Step 14 标记候选和风险 |

### 8.7 覆盖矩阵停审记录

| 覆盖项 / 测试切口 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| C-GOV-1~5 | 每个核心闭环是否至少有正向主线、负向边界和证据候选族 | 通过 | 见 §8.1 |
| FR-GOV-001~010 | 每个功能需求是否映射设计契约和测试切口 | 通过 | 见 §8.2 |
| BR-GOV-001~040 | 不变量、禁止行为、显式变化、边界、治理约束、审计约束是否成组覆盖 | 通过 | 见 §8.3 |
| AC-GOV-001~031 | 验收方向是否都有测试证据候选 | 通过 | 性能硬阈值不作为 P0 pass;Step 10/14 再说明 |
| VF-GOV-001~010 | 一票否决是否均有自动化或脚本 gate 候选 | 通过 | VF-GOV-010 依赖 dependency check;Step 9 固定执行方式 |
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
| 是否把 P1/P2 写成 P0 pass | 通过 | FR-GOV-E01~E06 和真实产品 / 容量均已标记非 P0 |
| 是否有测试切口越过设计真相源 | 通过 | 当前矩阵只引用 `00/03/04` 和 Step 2~4 结论 |
| 是否提前装配正式 `05-测试方案.md` | 通过 | 正式文档仍留 Step 15 |

## 9. 对上游设计的影响判定

| 覆盖结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| P0 覆盖矩阵无空洞 | 否 | 测试方案追溯 | 无需回写 |
| 用例 ID 和 evidence ID 仅预留候选族 | 否 | SOP 分工 | Step 6 / Step 13 承接 |
| VF-GOV-010 需要 dependency check | 否 | 自动化门禁需求 | Step 9 固定脚本或 gate |
| 性能硬阈值不作为 P0 pass | 否 | 范围边界 | Step 10 / Step 14 记录 |
| 若 Step 6 发现某需求无法构造用例 | 是 | 可验证性缺口 | 回写 `03` / `04` 或记录阻塞 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_05_traceability_coverage.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“C-GOV 核心闭环覆盖矩阵”“FR-GOV 功能需求覆盖矩阵”“VF-GOV 与配置门禁覆盖矩阵”“测试切口反向覆盖矩阵”和“跨覆盖项审计表”小节,了解需求和测试切口如何双向追溯。

正式 `05-测试方案.md` §5 应回填:

- 覆盖矩阵必须从 C-GOV、FR-GOV、BR-GOV、AC-GOV、VF-GOV 追溯到正式设计契约和 Step 3 测试切口。
- C-GOV-1~5 和 FR-GOV-001~010 均为 P0 覆盖项,必须至少有用例候选族、自动化候选和证据候选族。
- BR-GOV-001~040 可按不变量、禁止行为、显式变化、边界约束、治理约束和审计约束成组覆盖,但 Step 6 必须拆到关键正向 / 负向场景。
- VF-GOV-001~010 均必须有可重复测试或脚本 gate 候选;任何命中都不能被 release gate 汇总伪装为通过。
- FR-GOV-E01~E06、真实产品、生产容量和高级集成属于 P1/P2 或残余风险,不得算作 P0 覆盖空洞。
- 正式 evidence ID、artifact 路径和报告归档规则由 Step 13 固定;本章只预留证据候选族。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 6 用例矩阵规模较大 | 需要按测试切口分批写入 | 后续按 core command、policy/control、compliance/NC、query/consumer/outbox/job、state/consistency/config 分批 |
| VF-GOV-010 dependency check 采用脚本还是人工 gate | 影响 Step 9 / Step 13 evidence | Step 9 固定 |
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
| 可进入 Step 6 | 通过 | 下一步设计测试场景与用例矩阵;进入前等待用户审查 |
