# Step 5. 定义功能验收门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 5
> 回填章节: `06-验收标准.md` §5 功能验收门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 定义功能验收门禁 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 2 验收范围;Step 4 进入 / 退出条件;`00-需求文档.md` AC-GOV-001~015;`03-详细设计.md` §5~§8;`05-测试方案.md` §5 / §6 / §13 |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_05_function_gate.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 6 |

## 2. 本步目标

把 P0 核心能力和功能需求转成可裁决的验收门禁。

本 Step 只回答:

- AC-GOV-001~005 核心闭环如何判定通过 / 失败。
- AC-GOV-006~015 功能能力如何判定通过 / 失败。
- 每个功能验收项引用哪些正式设计契约、`TC-GOV-*` 用例、`EV-GOV-*` 证据和 report path。
- 哪些 P1/P2 功能只作为后置边界或 residual,不污染 P0 功能验收。
- 每个功能验收项是否完成停审,跨功能门禁是否存在冲突。

本 Step 不裁决 AC-GOV-016~031。规则 / 数据边界、接口同步、状态事务一致性、非功能、证据真实性和一票否决分别由 Step 6~11 收口。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_02_scope.md` | 已完成 | 提供 P0/P1/P2 范围和只验接缝口径 |
| `06_acceptance_step_04_entry_exit.md` | 已完成 | 提供正式验收准入、准出和不可裁决条件 |
| `00-需求文档.md` §14.1 | 已完成 | 提供 AC-GOV-001~015 核心 / 功能验收项 |
| `00-需求文档.md` §16.1 | 已完成 | 提供 FR-GOV-001~010 到 AC / VF 的追溯 |
| `03-详细设计.md` §5~§8 | 已完成 | 提供 truth object、public protocol、Command / Query / Consumer / Event / Job 和函数级 flow |
| `05-测试方案.md` §5 | 已完成 | 提供 C-GOV / FR-GOV / AC-GOV 覆盖矩阵 |
| `05-测试方案.md` §6 | 已完成 | 提供 `TC-GOV-CMD-*`、`TC-GOV-QUERY-*`、`TC-GOV-CONSUMER-*`、`TC-GOV-OUTBOX-*`、`TC-GOV-JOB-*` 用例族 |
| `05-测试方案.md` §13 | 已完成 | 提供正式 `EV-GOV-*` 证据 ID 和 report / artifact 路径 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 功能的通过条件是什么? | 每个 AC-GOV-001~015 必须由正式设计契约、至少一个对应 `TC-GOV-*` 用例族、正式 `EV-GOV-*` 证据 ID、`reports/runs/<run_id>/...` report path 和 raw artifact pairing 同时支撑。 |
| 每个 P0 功能的失败条件是什么? | 只要核心 truth 不能形成、功能主线缺 accepted / rejected / degraded / duplicate 等必需分支、相邻仓状态替代 Governance truth、query / job 反写真相、或证据无法回指 raw artifact,对应验收项失败。 |
| 证据来自哪些测试用例或报告? | 功能门禁主要引用 `release-main-smoke`、`contract-domain-fast`、`service-flow-fast`、`entry-worker-job` 和 `operations-replay-core` 的 report;证据 ID 使用 `EV-GOV-CORE-001`、`EV-GOV-CONTRACT-001`、`EV-GOV-CMD-001`、`EV-GOV-QUERY-001`、`EV-GOV-CONSUMER-001`、`EV-GOV-OUTBOX-001`、`EV-GOV-JOB-001`。 |
| 哪些 P1 功能只做后置边界验收? | real-like resolver / durable store / real bus / staging-like / external GRC deep integration / capacity / advanced Policy DSL / complex Gate / dashboard analytics 只作为 selected-run、residual 或 future,不得作为 P0 功能通过证据。 |
| 哪些功能失败会导致总体不通过? | AC-GOV-001~015 任一 P0 功能失败均导致不能“通过”。若失败触发 VF-GOV-001~009,则不得风险接受;若只是 P1 unavailable,进入 residual / risk acceptance。 |
| 每个功能验收项能否回指需求 / 设计契约、测试用例、证据 ID 和 report path? | 可以。见 §8.2 功能验收闭环矩阵。 |
| 每个功能验收项完成后是否通过停审? | 已按设计来源、测试来源、证据来源、通过 / 失败可判定性和 P1 污染风险逐项停审。见 §8.4。 |
| 所有功能验收项完成后是否存在 P0 功能缺门禁、证据重复或裁决影响冲突? | 未发现 unresolved 冲突。重复证据属于 suite 复用,已要求 evidence index 按 AC / TC / EV 反查,不得用单条 smoke 泛化替代详细用例。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` §4~§7 | 旧功能门禁围绕 GovernanceRequest / Gate / Decision / RiskAcceptance,无法覆盖新版 AC-GOV-001~015 | 改为围绕 C-GOV-1~5 和 FR-GOV-001~010 定义功能验收 |
| 旧 `06-验收标准.md` | 通过条件多为“接口可用 / 数据正确”式描述 | 改为每项必须写通过条件、失败条件、测试用例、证据 ID 和 report path |
| `05-测试方案.md` §5 | 覆盖矩阵仍包含候选证据族 | 本 Step 只引用 §13 已固定的正式证据 ID |
| Step 2 | P1/P2 已定义为 residual / future | 本 Step 明确 P1/P2 不作为 P0 功能通过条件 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 功能验收对象 | 旧请求 / 审批主线 | Governance truth center 的 C-GOV-1~5 和 FR-GOV-001~010 | 承接新版 `00`~`05` |
| 通过条件 | 功能可用、接口返回成功 | 正式 truth / protocol / flow / state / evidence 同时成立 | 验收必须可裁决 |
| 失败条件 | 泛化异常或缺陷 | 明确 truth 缺失、边界被打穿、query/job 反写、证据不可追溯 | 支撑不通过和 VETO |
| 证据 | API / DB / audit entry | `EV-GOV-*` + `reports/runs/<run_id>` + `artifacts/test/<run_id>` | 防止静态造证据 |
| P1/P2 | 容易混入功能通过 | selected-run / residual / future | 防止真实产品不可用污染 P0 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否把 AC-GOV-001~015 全部写成独立验收项 | A. 合并成 5 个核心项;B. 保留 15 个稳定 AC | 采用 B。稳定 AC 便于后续 evidence index 和缺陷定位 |
| 是否允许 `release-main-smoke` 单独证明全部功能 | A. 允许;B. 不允许 | 采用 B。smoke 只证明代表性主链,详细功能仍需 `TC-GOV-*` 用例族支撑 |
| 是否把 AC-GOV-016~031 混入本 Step | A. 混入;B. 留给后续 Step | 采用 B。数据边界、接口、一致性、非功能和证据审计需要独立裁决 |
| 是否允许 P1 real-like selected-run 补 P0 功能证据 | A. 允许;B. 不允许 | 采用 B。P0 必须由 fake / controlled / disabled seam 下的正式语义证明 |

## 8. 结构化中间产物

### 8.1 功能验收门禁表

| 验收项 ID | 功能 / 场景 | 优先级 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|
| AC-GOV-001 | 治理语境与适用对象成立 | P0 | actor、scope、subject、purpose、responsibility context 能形成正式 GovernanceContext / GovernanceInput,且外部对象只以 ref / safe summary 进入 | context/input 缺正式 truth;相邻仓状态或正文隐式创造治理语境;unresolved 外部引用无 degraded / rejected surface | `TC-GOV-CMD-001~003`;`TC-GOV-QUERY-001~002`;`EV-GOV-CORE-001`;`EV-GOV-CMD-001`;`EV-GOV-QUERY-001` |
| AC-GOV-002 | 关键节点治理裁决成立 | P0 | Gate / Decision / Approval responsibility 能按正式命令形成、投票、委派、终结和 supersede,并被相邻仓消费 | process/work/conversation/runtime 状态替代 Decision truth;finalized decision 原地改写;责任 actor 校验缺失 | `TC-GOV-CMD-004~009`;`TC-GOV-STATE-*`;`EV-GOV-CORE-001`;`EV-GOV-CMD-001`;`EV-GOV-STATE-001` |
| AC-GOV-003 | 治理策略与控制适用成立 | P0 | PolicyEffectiveFact、SharedRuleSet、PolicyConflict、ControlApplicability 和 ControlReview 作为 Governance truth 成立 | runtime / method 反定义 Policy truth;低 scope 静默覆盖组织硬约束;control definition 正文入仓 | `TC-GOV-CMD-010~015`;`TC-GOV-DOMAIN-*`;`EV-GOV-CORE-001`;`EV-GOV-CMD-001`;`EV-GOV-STATE-001` |
| AC-GOV-004 | 合规 / 纠正治理闭环成立 | P0 | AIIA、SoA、Nonconformity、CorrectiveAction、Verification 形成正式评审、原因、纠正、复验和关闭链路,且 body-free | artifact / evidence 正文入仓;bug/work alert 替代 Nonconformity;failed verification 仍关闭 | `TC-GOV-CMD-016~023`;`TC-GOV-REDACTION-*`;`EV-GOV-CORE-001`;`EV-GOV-CMD-001`;`EV-GOV-REDACTION-001` |
| AC-GOV-005 | 治理事实消费与追溯成立 | P0 | Query、consumer、outbox、trace、dashboard、reconciliation 和 job 能授权消费 / 追溯 Governance truth,且不反写真相 | query / report / job 修复或改写业务 truth;outbound payload 发布时从 current truth ad hoc 重算;trace 无来源 | `TC-GOV-QUERY-001~016`;`TC-GOV-CONSUMER-001~012`;`TC-GOV-OUTBOX-001~015`;`TC-GOV-JOB-001~010`;`EV-GOV-QUERY-001`;`EV-GOV-CONSUMER-001`;`EV-GOV-OUTBOX-001`;`EV-GOV-JOB-001` |
| AC-GOV-006 | 治理语境与适用对象确定能力 | P0 | FR-GOV-001 的建立 / 调整能力由 CreateGovernanceContext、context query 和 reference degraded / missing surface 证明 | context factory / DTO / query view 任一无法按正式契约构造;相邻仓正文被保存 | `TC-GOV-CONTRACT-001~004`;`TC-GOV-CMD-001`;`TC-GOV-QUERY-001`;`EV-GOV-CONTRACT-001`;`EV-GOV-CMD-001`;`EV-GOV-QUERY-001` |
| AC-GOV-007 | 治理输入收束与可裁决语境形成能力 | P0 | FR-GOV-002 的 input submit/update、trigger summary、pending evidence 和 automation no-bypass 成立 | 自动化直接产生治理结论;input 状态缺 accepted / rejected / degraded 分支;外部 body 进入 input | `TC-GOV-CMD-002~003`;`TC-GOV-CMD-030`;`EV-GOV-CMD-001`;`EV-GOV-REDACTION-001` |
| AC-GOV-008 | 关键节点正式治理裁决能力 | P0 | FR-GOV-003 的 Gate open、Decision record / supersede、Approval responsibility / vote / delegate 主线和非法终态拒绝成立 | 决策无正式 basis / responsibility;supersede 未产生新事实;终态仍可原地修改 | `TC-GOV-CMD-004~009`;`TC-GOV-STATE-*`;`EV-GOV-CMD-001`;`EV-GOV-STATE-001` |
| AC-GOV-009 | 自动化治理边界表达能力 | P0 | FR-GOV-004 能表达 AI member / automation 授权边界、高影响升级和停止自动推进,且 runtime 只作 summary/ref | runtime/capability/tool result 反向创造治理结论;高影响场景缺责任 actor;automation bypass command | `TC-GOV-CMD-004~013`;`TC-GOV-CONSUMER-007`;`EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001` |
| AC-GOV-010 | Policy 生效与授权约束能力 | P0 | FR-GOV-005 的 policy activation/update、shared rule priority、conflict resolve / waive、method unavailable degraded 成立 | method definition/runtime cache 替代 PolicyEffectiveFact;shared rule priority 错误;conflict 被静默吞掉 | `TC-GOV-CMD-010~013`;`TC-GOV-CONSUMER-005`;`TC-GOV-JOB-003~004`;`EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001`;`EV-GOV-JOB-001` |
| AC-GOV-011 | Control 适用与复核责任能力 | P0 | FR-GOV-006 的 control applicability assess、review pass/fail/waive、责任与整改关联成立 | control definition 正文入仓;review 失败无 marker;waive 缺正式 reason / responsibility | `TC-GOV-CMD-014~015`;`TC-GOV-CONSUMER-006`;`EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001` |
| AC-GOV-012 | AIIA / SoA 治理评审结论能力 | P0 | FR-GOV-007 的 AIIA / SoA submit、approve/reject/revoke、coverage ref 和 artifact/evidence refs-only 成立;submit save 前通过 `resolve_artifact_ref(...)` 判定 artifact resolution | 保存 AIIA / SoA 第二份正文;coverage 缺失仍通过;artifact unresolved / stale / unavailable / invalid / digest mismatch 未被 save-before rejected;query artifact degraded surface 缺失 | `TC-GOV-CMD-016~018`;`TC-GOV-CONSUMER-004`;`TC-GOV-REDACTION-*`;`EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001`;`EV-GOV-REDACTION-001` |
| AC-GOV-013 | Nonconformity 纠正闭环能力 | P0 | FR-GOV-008 的 raise、cause、plan、complete、verify、failed verification keeps open 和 formal closure 成立 | 普通 bug/work blocker/alert 替代 NC;未确认原因或未复验即可关闭;failed verification 仍关闭 | `TC-GOV-CMD-019~023`;`TC-GOV-QUERY-010`;`EV-GOV-CMD-001`;`EV-GOV-QUERY-001` |
| AC-GOV-014 | 治理事实消费与追溯能力 | P0 | FR-GOV-009 的 14 个 Query、9 个 Consumer、12 个 Outbound Event、trace/audit refs-only 和 visibility/degraded surface 成立 | query 写入 truth/projection/reference;consumer 保存外部正文;outbound payload 非 stored snapshot | `TC-GOV-QUERY-001~016`;`TC-GOV-CONSUMER-001~012`;`TC-GOV-OUTBOX-001~015`;`EV-GOV-QUERY-001`;`EV-GOV-CONSUMER-001`;`EV-GOV-OUTBOX-001` |
| AC-GOV-015 | 治理事实维护、对账、报告和归档准备能力 | P0 | FR-GOV-010 的 publish / rebuild / refresh / reconcile / handoff / archive / export job report、partial failure 和 duplicate replay 成立 | job 修复业务 truth;duplicate 重新运行 mutation;handoff/export 失败无 report/marker;external GRC disabled 阻断核心 truth | `TC-GOV-JOB-001~010`;`TC-GOV-IDEMP-*`;`EV-GOV-JOB-001`;`EV-GOV-IDEMP-001`;`EV-GOV-OUTBOX-001` |

### 8.2 功能验收闭环矩阵

| 验收项 ID | 设计契约 | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|
| AC-GOV-001 | `03` §6.1 context/input objects;§7.1 Command;§8.1 accepted transaction;§8.2 Query | `TC-GOV-CMD-001~003`;`TC-GOV-QUERY-001~002` | `EV-GOV-CORE-001`;`EV-GOV-CMD-001`;`EV-GOV-QUERY-001` | `reports/runs/<run_id>/suites/release-main-smoke.md`;`reports/runs/<run_id>/suites/service-flow-fast.md` | 失败则不通过;若正文入仓触发 VF-GOV-003 |
| AC-GOV-002 | `03` §6.1 Gate / Decision / Approval;§7.1 Command;§8.1;§10 state matrix | `TC-GOV-CMD-004~009`;`TC-GOV-STATE-*` | `EV-GOV-CORE-001`;`EV-GOV-CMD-001`;`EV-GOV-STATE-001` | `reports/runs/<run_id>/suites/release-main-smoke.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/service-flow-fast.md` | 失败则不通过;可能触发 VF-GOV-002 / 006 |
| AC-GOV-003 | `03` §6.1 Policy / SharedRule / Control objects;§8.1;§10 state matrix | `TC-GOV-CMD-010~015`;`TC-GOV-DOMAIN-*` | `EV-GOV-CORE-001`;`EV-GOV-CMD-001`;`EV-GOV-STATE-001` | `reports/runs/<run_id>/suites/release-main-smoke.md`;`reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | 失败则不通过;可能触发 VF-GOV-004 / 005 |
| AC-GOV-004 | `03` §6.1 compliance / NC objects;§7.1;§8.1;redaction boundary | `TC-GOV-CMD-016~023`;`TC-GOV-REDACTION-*` | `EV-GOV-CORE-001`;`EV-GOV-CMD-001`;`EV-GOV-REDACTION-001` | `reports/runs/<run_id>/suites/release-main-smoke.md`;`reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/redaction-check.md` | 失败则不通过;可能触发 VF-GOV-003 / 007 / 008 |
| AC-GOV-005 | `03` §7.2 Query;§7.3 Event;§7.4 Job;§8.2~§8.4 | `TC-GOV-QUERY-001~016`;`TC-GOV-CONSUMER-001~012`;`TC-GOV-OUTBOX-001~015`;`TC-GOV-JOB-001~010` | `EV-GOV-QUERY-001`;`EV-GOV-CONSUMER-001`;`EV-GOV-OUTBOX-001`;`EV-GOV-JOB-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 失败则不通过;可能触发 VF-GOV-009 |
| AC-GOV-006 | `03` §7.1 CreateGovernanceContext;§7.2 GetGovernanceContext | `TC-GOV-CONTRACT-001~004`;`TC-GOV-CMD-001`;`TC-GOV-QUERY-001` | `EV-GOV-CONTRACT-001`;`EV-GOV-CMD-001`;`EV-GOV-QUERY-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/service-flow-fast.md` | 失败则不通过 |
| AC-GOV-007 | `03` §7.1 Submit / UpdateGovernanceInput;§8.1;redaction boundary | `TC-GOV-CMD-002~003`;`TC-GOV-CMD-030` | `EV-GOV-CMD-001`;`EV-GOV-REDACTION-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/redaction-check.md` | 失败则不通过;automation bypass 可触发 VF-GOV-001 |
| AC-GOV-008 | `03` §7.1 Gate / Decision / Approval commands;§10 state matrix | `TC-GOV-CMD-004~009`;`TC-GOV-STATE-*` | `EV-GOV-CMD-001`;`EV-GOV-STATE-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | 失败则不通过;可能触发 VF-GOV-002 / 006 |
| AC-GOV-009 | `03` §6.1 policy guards;§7.3 runtime signal consumer;§8.3 consumer template | `TC-GOV-CMD-004~013`;`TC-GOV-CONSUMER-007` | `EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 失败则不通过;runtime truth pollution 可触发 VF-GOV-004 |
| AC-GOV-010 | `03` §6.1 PolicyEffectiveFact / SharedRuleSet / PolicyConflict;§7.3 method consumer | `TC-GOV-CMD-010~013`;`TC-GOV-CONSUMER-005`;`TC-GOV-JOB-003~004` | `EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001`;`EV-GOV-JOB-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 失败则不通过;可能触发 VF-GOV-004 / 005 |
| AC-GOV-011 | `03` §6.1 ControlApplicability / ControlReview;§7.1 control commands | `TC-GOV-CMD-014~015`;`TC-GOV-CONSUMER-006` | `EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 失败则不通过 |
| AC-GOV-012 | `03` §6.1 AIIAConclusion / SoAConclusion;§7.1 compliance commands;redaction boundary | `TC-GOV-CMD-016~018`;`TC-GOV-CONSUMER-004`;`TC-GOV-REDACTION-*` | `EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001`;`EV-GOV-REDACTION-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/redaction-check.md` | 失败则不通过;可能触发 VF-GOV-003 / 007 |
| AC-GOV-013 | `03` §6.1 Nonconformity / CorrectiveAction / VerificationResult;§7.1 NC commands | `TC-GOV-CMD-019~023`;`TC-GOV-QUERY-010` | `EV-GOV-CMD-001`;`EV-GOV-QUERY-001` | `reports/runs/<run_id>/suites/service-flow-fast.md` | 失败则不通过;可能触发 VF-GOV-008 |
| AC-GOV-014 | `03` §7.2 Query;§7.3 Event;§8.2 Query;§8.3 Consumer | `TC-GOV-QUERY-001~016`;`TC-GOV-CONSUMER-001~012`;`TC-GOV-OUTBOX-001~015` | `EV-GOV-QUERY-001`;`EV-GOV-CONSUMER-001`;`EV-GOV-OUTBOX-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 失败则不通过;可能触发 VF-GOV-009 |
| AC-GOV-015 | `03` §7.4 Operations Job;§8.4 job / outbox / handoff template;§13 idempotency | `TC-GOV-JOB-001~010`;`TC-GOV-IDEMP-*`;`TC-GOV-OUTBOX-013~015` | `EV-GOV-JOB-001`;`EV-GOV-IDEMP-001`;`EV-GOV-OUTBOX-001` | `reports/runs/<run_id>/suites/operations-replay-core.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | 失败则不通过;job 反写真相触发 VF-GOV-009 |

### 8.3 P1 / P2 功能后置边界

| 功能 | 当前裁决 | 后续承接 |
|---|---|---|
| real-like resolver / durable store / real bus | 不作为 P0 功能通过前置 | Step 13 residual / selected-run;若升级为 P0 需补基线和 evidence |
| staging-like / production-like runtime | 不作为 P0 功能通过前置 | Step 13 / Step 14 记录条件或 future |
| advanced Policy DSL / simulation | 不作为 AC-GOV-010 通过条件 | future enhancement;不得替代 PolicyEffectiveFact |
| complex Gate orchestration | 不作为 AC-GOV-008 通过条件 | future enhancement;不得替代基础 Gate / Decision truth |
| automatic AIIA / SoA drafting | 不作为 AC-GOV-012 通过条件 | future enhancement;自动草拟只能作为 input |
| external GRC deep integration | 不作为 AC-GOV-015 通过条件 | P0 只验 disabled / fake / controlled export boundary |
| dashboard analytics / capacity / SLO | 不作为本 Step 功能门禁 | Step 9 / Step 13 处理非功能和 residual |

### 8.4 功能验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| AC-GOV-001~005 | 核心闭环均回指 C-GOV-1~5、详细设计 truth / protocol / flow 和正式 EV | 通过 | 需要正式验收时由 `EV-GOV-CORE-001` 证明 release smoke 是场景级闭环,不是通用测试计数 |
| AC-GOV-006~013 | FR-GOV-001~008 均回指 Command / domain / state / redaction 用例族 | 通过 | redaction 细节在 Step 10 继续审计,但功能项可引用 `EV-GOV-REDACTION-001` |
| AC-GOV-014 | Query / Consumer / Outbox 的消费追溯功能有正式设计契约和证据入口 | 通过 | query no-write 和 outbox stored snapshot 的一致性细节由 Step 8 / Step 10 加严 |
| AC-GOV-015 | Operations Job 的 report、partial failure、duplicate replay 和 no truth repair 有证据入口 | 通过 | job no truth repair 属于 Step 8 / Step 11 的红线,本 Step 只作为功能失败条件引用 |
| 全部 AC-GOV-001~015 | 通过 / 失败条件可判定 | 通过 | 不填真实 pass/fail;正式裁决等实际 `run_id` 和 evidence index |
| 全部 AC-GOV-001~015 | 未误用 P1/P2 结果 | 通过 | P1/P2 已放入 §8.3 后置边界 |

### 8.5 跨功能门禁裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 功能是否缺门禁 | 未发现缺口 | AC-GOV-001~015 均有通过 / 失败 / evidence |
| 是否存在孤儿功能 AC | 未发现缺口 | 每项均回指 C-GOV 或 FR-GOV |
| 是否存在孤儿 P0 用例族 | 未在本 Step 发现 | Step 7~10 继续覆盖接口、一致性、证据和非功能用例 |
| 是否用单条 smoke 代替全部功能证据 | 未采用 | `EV-GOV-CORE-001` 只证明代表主链;详细项继续引用 service / domain / job suites |
| 是否存在 P1 污染 P0 | 未发现 | P1/P2 明确进入 selected-run / residual / future |
| 是否存在证据路径断裂 | 未发现设计层断裂 | 正式验收时仍必须由 Step 3/4 固定 `run_id` 和 artifact/report pairing |
| 是否存在裁决影响冲突 | 未发现 | 任一 P0 功能失败均不能通过;VETO 触发由 Step 11 最终裁决 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_05_function_gate.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“功能验收门禁表”“功能验收闭环矩阵”“P1 / P2 功能后置边界”“功能验收项停审记录”和“跨功能门禁裁决审计表”小节,了解功能验收门禁如何从 AC-GOV、FR-GOV、详细设计和测试证据收敛。

正式 `06-验收标准.md` §5 应回填:

- 功能验收门禁覆盖 AC-GOV-001~015,其中 AC-GOV-001~005 裁决 C-GOV-1~5 核心闭环,AC-GOV-006~015 裁决 FR-GOV-001~010 功能能力。
- 每个 P0 功能验收项必须同时具备正式设计契约、`TC-GOV-*` 用例、`EV-GOV-*` 证据 ID、`reports/runs/<run_id>/...` report path 和 raw artifact pairing。
- `release-main-smoke` 只能证明代表性治理业务闭环,不能单独替代 service / domain / query / consumer / outbox / job 详细证据。
- 任一 AC-GOV-001~015 失败时,正式结论不得为“通过”。若失败同时命中 VF-GOV-001~009,不得风险接受。
- P1/P2 功能只能进入 selected-run、residual、future 或 Step 13 风险接受,不得作为 P0 功能通过证据。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| `EV-GOV-CORE-001` 的 release smoke 是否由实现仓证明为场景级闭环 | 影响 AC-GOV-001~005 的核心闭环证据强度 | 本 Step 要求正式验收时必须证明,否则不能作为核心功能通过证据 |
| P1 selected-run 是否在某个 release candidate 强制 | 影响 AC-GOV-014 / 015 的外部接缝 confidence | 当前不作为 P0 前置;Step 13 / Step 14 处理 |
| 是否需要为 Policy / Control / Compliance / NC 单独拆正式 EV 编号 | 影响 evidence index 粒度 | 当前复用 §13 已固定 `EV-GOV-CMD-001` / `EV-GOV-STATE-001`;若后续测试方案新增正式 EV,Step 15 可引用 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 功能都有可裁决门禁 | 通过 | AC-GOV-001~015 均已定义通过 / 失败条件 |
| 每项均有设计契约、测试用例、证据 ID、report path | 通过 | 见 §8.2 |
| 功能验收项已停审 | 通过 | 见 §8.4 |
| 跨功能门禁审计无 unresolved 冲突 | 通过 | 见 §8.5 |
| 可进入 Step 6 | 通过 | 下一步定义数据边界与架构红线验收;进入前等待用户审查 |
