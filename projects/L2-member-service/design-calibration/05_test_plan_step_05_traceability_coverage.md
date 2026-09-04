# Step 5. 建立需求追溯与覆盖矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填章节：`05-测试方案.md` §5

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 需求追溯与覆盖矩阵 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 覆盖原则 | 需求 / 规则 ↔ 设计契约 ↔ 测试切口 ↔ TC 候选 ↔ EV 族双向可查 |
| 停审结论 | P0 核心需求和 VF 无空洞；P1/P2 明确保留风险 |

## 2. 覆盖追溯原则

| 原则 | 规则 |
|---|---|
| P0 需求可反查 | 每个 C-MS、FR-MS-001~012、关键 BR/NFR、AC-MS-001~039、VF-MS-001~009 至少有设计依据和测试切口 |
| 切口可反查 | 每个 P0 切口必须能回到需求、规则、AC/VF 或正式详细设计契约 |
| EV 只预留族 | 本步只定义 EV 族和候选，不填写运行结果、run_id 或 verdict |
| 缺口不由测试补设计 | 缺字段、状态、version、source、cursor、evidence source 时记入 blocker / 回写设计 |

## 3. 核心能力覆盖矩阵

| 需求 | 设计依据 | 主要场景候选 | TC 候选族 | EV 候选族 | 状态 |
|---|---|---|---|---|---|
| C-MS-1 意图与决定 | `00` C-MS-1；`03` control flows / state | 双锚受理、非项目拒绝、重复 / 冲突稳定决定 | `TC-INTENT-*`、`TC-DECISION-*` | `EV-CORE-*`、`EV-CMD-*` | 已覆盖 |
| C-MS-2 装配与就绪 | `00` C-MS-2；`03` qualification / assembly | required item、partial、unknown、no fallback | `TC-QUAL-*`、`TC-ASSEMBLY-*` | `EV-ASSEMBLY-*` | 已覆盖；正向 external pending |
| C-MS-3 注册与会话 | `00` C-MS-3；`03` registration/session | register、replace、stale、old generation | `TC-REG-*`、`TC-SESSION-*` | `EV-SESSION-*` | 已覆盖；Member/Runtime contract pending |
| C-MS-4 健康与恢复 | `00` C-MS-4；`03` health/recovery | signal、unknown、recovery decision、restart generation | `TC-HEALTH-*`、`TC-RECOVERY-*` | `EV-HEALTH-*` | 已覆盖；positive seam pending |
| C-MS-5 清理与交接 | `00` C-MS-5；`03` closure/material/handoff | cleanup attempt、residual、outbox、four layers | `TC-CLOSURE-*`、`TC-HANDOFF-*` | `EV-CLOSURE-*`、`EV-HANDOFF-*` | 已覆盖；target feedback pending |

## 4. FR / BR / NFR 分组覆盖

| 需求组 | 设计依据 | 测试切口 / 用例族 | 覆盖状态 |
|---|---|---|---|
| FR-MS-001~002 | control object / command / idempotency | `intent`、`decision`、`invalid_subject`、`duplicate_conflict` | P0 已覆盖 |
| FR-MS-003~005 | qualification / assembly / readiness | `qualification`、`assembly`、`state_axis_non_transitive`、`required_seam_no_bypass` | P0 已覆盖；Images/Sandbox positive blocked |
| FR-MS-006~007 | registration / endpoint / session | `registration`、`session`、`credential_replay`、`old_generation` | P0 已覆盖；Member/Runtime fields waiting |
| FR-MS-008~009 | health / failure / recovery | `health_signal`、`health_assessment`、`recovery_decision`、`unknown_fence` | P0 已覆盖 |
| FR-MS-010~012 | closure / reconciliation / handoff | `cleanup`、`residual`、`material_outbox`、`handoff_layers` | P0 已覆盖；exact feedback pending |
| BR-MS-001~017 | subject / assembly redlines | boundary + readiness negative suites | P0 已覆盖 |
| BR-MS-018~026 | registration / session redlines | registration replay / session no-runtime-truth | P0 已覆盖 |
| BR-MS-027~036 | health / recovery redlines | signal classification / generation / unknown | P0 已覆盖 |
| BR-MS-037~045 | cleanup / handoff redlines | cleanup layering / late feedback / no external completion | P0 已覆盖 |
| BR-MS-046~050 | cross-node / enhancement boundaries | pending fail-closed / derived no-write | P0 已覆盖 |
| NFR-MS-001~020 | performance, availability, security, audit, consistency, observability | §10专项、§12门禁、§13 evidence、§14 risk | 结构性 P0；量化候选 P1/P2 |

## 5. AC / VF 覆盖矩阵

| AC / VF 范围 | 主要测试切口 | 证据族候选 | 状态 |
|---|---|---|---|
| AC-MS-001~005 核心闭环 | core smoke + each CMP cut | `EV-CORE-*` | 已纳入 |
| AC-MS-006~017 功能闭环 | command/query/consumer/job families | `EV-CMD-*`、`EV-QUERY-*`、`EV-SESSION-*`、`EV-CLOSURE-*` | 已纳入 |
| AC-MS-018~021 外围增强 | safe suggestion/preheat/forensic/view boundary | `EV-BOUNDARY-*` | P1/P2，不阻断 P0 |
| AC-MS-022~027 规则 / 边界 | forbidden body、no fallback、dependency、handoff | `EV-BOUNDARY-*`、`EV-REDACTION-*`、`EV-ARCH-*` | 已纳入 |
| AC-MS-028~033 数据归属 | owner/ref/snapshot/body-free | `EV-DATA-*`、`EV-REDACTION-*` | 已纳入 |
| AC-MS-034~039 NFR | availability、audit、idempotency、observability、evidence honesty | `EV-NFR-*`、`EV-REPORT-*` | 结构性已纳入；硬数值 pending |
| VF-MS-001~009 | release negative / architecture / redaction / report gates | `EV-VETO-*`、对应族 | 全部有入口 |

## 6. 反向覆盖矩阵

| 测试切口 | 反向需求 / 规则 | 关键断言 |
|---|---|---|
| contracts / domain / state | BR-MS-001~017、018~045；AC-MS-022~033 | 双锚、body-free、正交状态、非法迁移 |
| command orchestration | FR-MS-001~012；NFR-MS-013~016 | accepted 写集、duplicate、revision、rollback |
| query no-write | FR-MS-007/012；BR-MS-041/050；VF-MS-009 | visible/degraded 不修复、不反写 |
| consumer orchestration | FR-MS-003/006/008/010/012；BR-MS-019/030/044 | version、source、generation、receipt、late/gap |
| material/outbox | FR-MS-012；BR-MS-043；VF-MS-007 | immutable snapshot、四层独立、source 不重算 |
| jobs | FR-MS-009~011；BR-MS-041/050；VF-MS-009 | 只推进已提交 work，不创建授权/决定 |
| consistency/idempotency | FR-MS-002/006/007/010/012；NFR-MS-013~016 | key/digest、unknown、single-active、history 保留 |
| config/redaction/dependency | NFR-MS-005/008/020；VF-MS-003~005/008~009 | fail-fast、no-output、分类正确、证据诚实 |

## 7. 未覆盖项与跨覆盖审计

| 项 | 当前处理 | 后续承接 |
|---|---|---|
| Runtime entry / execution positive | blocked | `MSVC-UP-001` 闭合后重开对应 case / environment |
| Member IPC / credential positive | waiting | `MSVC-UP-002/006` 闭合后补 exact contract |
| Images manifest / verification positive | blocked | `MSVC-UP-003` 闭合后补 qualification case |
| Sandbox binding / release positive | blocked | `MSVC-UP-004` 闭合后补 integration case |
| Core/Bus route / receipt | pending | `MSVC-UP-007` 闭合后补 protocol / evidence source |
| SDK target / self-test | pending | `MSVC-UP-008` 闭合后补 compile gate |
| 性能硬阈值 / capacity | candidate_without_authority | 后续 workload / authority 形成后转 P1/P2 |

跨审计结论：未发现 P0 需求、规则或测试切口孤儿；未闭合项均显式进入 blocker / residual，不静默消失。

## 8. 回填草稿与进入条件

正式 §5 应提供核心能力、功能 / 规则 / NFR、AC/VF 和测试切口反向矩阵；证据只写候选族，避免在本章提前写真实 EV 实例或通过结论。

- [x] 双向追溯可查。
- [x] P0 空洞已进入风险或 blocker。
- [x] 可进入 Step 6。
