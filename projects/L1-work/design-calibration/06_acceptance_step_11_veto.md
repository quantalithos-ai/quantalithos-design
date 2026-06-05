# Step 11. 定义一票否决项

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 11 中间产物。
> 本步把需求一票否决项、架构红线、非功能红线和证据红线收敛为不可风险接受的验收否决清单。
> 本步不定义缺陷分级、不批准风险接受、不生成最终验收结论。

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 11
- 回填章节: `projects/L1-work/06-验收标准.md` §11 一票否决项
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §14 | `VF-WORK-001`~`008` 一票否决项 | 否决项主来源 |
| `design-calibration/06_acceptance_step_06_data_architecture_redline.md` | Work truth ownership、外部正文禁止入仓、query / projection / report no-write、唯一编译期依赖 | 架构与数据红线来源 |
| `design-calibration/06_acceptance_step_08_state_transaction_consistency.md` | duplicate、conflict、commit unknown、UoW、no side effect | 幂等和一致性否决候选来源 |
| `design-calibration/06_acceptance_step_09_non_functional_gate.md` | redaction、unauthorized、fake fallback、配置越界、`latest` 路径 | release redline 来源 |
| `design-calibration/06_acceptance_step_10_observability_evidence.md` | evidence index、gate results、redaction check、veto checklist、risk acceptance | 证据否决来源 |
| `05-测试方案.md` §10.3 / §11 / §13 / §14 | 安全红线、S 级缺陷、风险接受边界、退出阻断项 | 检查方式和风险不可接受来源 |

已确认结论:

```text
一票否决项不得被风险接受覆盖。
否决项必须能通过 `reports/acceptance/veto-checklist.md`、`reports/runs/<run_id>/gate-results.md`、`reports/runs/<run_id>/evidence-index.md`、`reports/runs/<run_id>/redaction-check.md` 和对应 `EV-WORK-*` 复查。
Step 11 只裁决“出现即不通过”的问题;一般 A / B / C 缺陷分级留给 Step 12。
```

## 3. SOP 问题回答

### 3.1 哪些失败会直接导致不通过?

直接不通过的失败分三类:

| 类别 | 直接不通过条件 |
|---|---|
| 需求否决项 | 触发 `VF-WORK-001`~`008` 任一项 |
| release / safety redline | raw secret / token / payload / source body 泄露、unauthorized truth leak、配置关闭核心边界、configured adapter fallback fake success |
| evidence redline | P0 证据不可复核、缺 P0 EV、缺 release gate result、redaction failed、正式证据路径使用 `latest`、缺 veto checklist |

### 3.2 否决项来自哪个需求或设计红线?

`VF-WORK-001`~`008` 是主否决源。Step 6~10 的红线只在两种情况下进入 Step 11:

1. 它们直接命中 `VF-WORK-*`。
2. 它们导致 release evidence pack 不可复核或安全边界失效。

不把所有 P0 失败都升级为一票否决。普通 P0 gate 失败、状态迁移失败、单个 command happy path 失败等,若未触发本步否决项,由 Step 12 按 S / A / B / C 处理。

### 3.3 否决项如何检查?

检查入口必须固定,不得用口头确认替代:

| 检查入口 | 作用 |
|---|---|
| `reports/acceptance/veto-checklist.md` | 每个 veto 的结论、证据、缺陷和 reviewer status |
| `reports/runs/<run_id>/gate-results.md` | release gate、redline gate 和 selected suite 的 pass / fail |
| `reports/runs/<run_id>/evidence-index.md` | `EV-WORK-*` 到 `TC / AC / artifact / design` 的映射 |
| `reports/runs/<run_id>/redaction-check.md` | raw secret / token / payload / source body / forbidden body 扫描结论 |
| `reports/acceptance/handoff.md` | 送验范围、固定基线、开放问题和风险入口 |
| `reports/acceptance/risk-acceptance.md` | 用于证明没有把 veto / S 级问题风险接受 |

### 3.4 否决项是否允许风险接受?

不允许。

以下内容不得进入 `risk-acceptance.md` 后被声明为有条件通过:

- `VF-WORK-001`~`008`
- raw secret / token / payload / source body / external body 泄露
- Work truth 被外部正文、runtime step、query、projection、report、job 或相邻仓反写
- duplicate / commit unknown / event dedup 产生重复 truth
- 非 core sibling 编译期依赖
- 配置关闭核心边界或 fake fallback production success
- P0 evidence 不可复核、缺 veto checklist、`latest` 出现在正式证据路径

### 3.5 否决项是否覆盖所有 P0 红线?

覆盖。

Step 11 覆盖需求红线、数据归属红线、架构依赖红线、安全 / redaction 红线、幂等重复 truth 红线、证据可复核红线。状态机、事务、接口、性能观察等未命中这些红线的失败,不在本步扩大为 veto,交由 Step 12 分级裁决。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` | 一票否决项未完整承接新版 `VF-WORK-*` | 无法裁决 Work truth 边界失败 | 重建 veto 表 |
| Step 6 | 红线候选已列出,但尚未正式判定哪些为一票否决 | 红线与 veto 边界不清 | 本步归并 |
| Step 8 | 重复 truth、commit unknown 盲重试等只是阻断候选 | 需要明确是否 veto | 本步只把“产生重复 truth”列为 veto |
| Step 9 | redaction、unauthorized、fake fallback、配置越界、`latest` 已是 release 阻断候选 | 需要进入不可风险接受清单 | 本步收口 |
| Step 10 | 缺 EV、缺 gate、缺 redaction、缺 veto checklist 已定义证据影响 | 需要明确哪些导致不得通过 / 有条件通过 | 本步收口 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 需求否决项 | `VF-WORK-*` 只在需求文档中 | 进入验收 veto 主表 | 让 `06` 可裁决 |
| release redline | 分散在 Step 9 / 10 | 收敛到不可风险接受清单 | 防止红线被降级 |
| evidence failure | 只说明证据门禁失败 | 明确不可通过 / 不可有条件通过 | 支撑最终结论 |
| 普通 P0 缺陷 | 容易被全部写成 veto | 只保留命中红线者 | 避免扩大验收范围 |
| 风险接受 | 未与 veto 绑定 | veto / S 级 / evidence redline 不得风险接受 | 对齐 `05` 风险边界 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只采用 `VF-WORK-001`~`008` | 简洁,贴近需求 | redaction、evidence、fake fallback、`latest` 等 release 红线会散落 | 不采用 |
| 方案 B: `VF-WORK-*` 加 release / evidence redline,但不把所有 P0 失败升级为 veto | 覆盖关键红线,边界清楚 | 需要 Step 12 继续处理非 veto 缺陷 | 采用 |
| 方案 C: 所有 P0 gate failed 都是一票否决 | 严格 | 会让缺陷分级和风险接受失去作用 | 不采用 |

推荐方案 B。

原因:

- 一票否决只处理交付物不能被接受的根本性失败。
- release / evidence redline 已在 `05` 和 Step 9 / 10 被定义为不可绕过。
- 普通 P0 缺陷仍应通过 Step 12 复验和放行规则处理。

## 7. 结构化中间产物

### 7.1 一票否决项表

| 否决项 ID | 否决项 | 来源 | 原因 | 证据 / 检查方式 |
|---|---|---|---|---|
| `VETO-WORK-001` | C-1~C-5 任一核心闭环节点无法成立 | `VF-WORK-001`;`AC-WORK-001`~`005` | Work 仓失去项目工作事实真相仓定位 | `EV-WORK-CORE-*`;`EV-WORK-FORMAL-*`;`EV-WORK-ITER-*`;`reports/runs/<run_id>/gate-results.md` |
| `VETO-WORK-002` | Backlog、WorkItem 或 child WorkItem 混入个人执行步骤、conversation suggestion、runtime plan item 或 ImplementationPlan body | `VF-WORK-002`;`VF-WORK-005`;Step 6 `RL-WORK-ARCH-002` | 正式工作全集被污染 | `EV-WORK-FORMAL-*`;`EV-WORK-PROMOTE-*`;forbidden body scan;`veto-checklist.md` |
| `VETO-WORK-003` | ProjectMember 接管 GlobalMember、Role、Actor 生命周期或身份正文 | `VF-WORK-003`;Step 6 `RL-WORK-ARCH-001` | identity / Work 边界被打穿 | `EV-WORK-MEMBER-*`;authorization / body scan;dependency review |
| `VETO-WORK-004` | Work 保存相邻仓正文、external body、source body、runtime progress body、raw payload、raw secret 或 raw token | `VF-WORK-004`;`VF-WORK-005`;Step 6 `RL-WORK-DATA-002`;Step 9 `NF-WORK-SEC-002`;Step 10 `EVG-WORK-REDACTION-001` | 数据归属和安全边界失效 | `reports/runs/<run_id>/redaction-check.md`;`EV-WORK-CFG-010`~`012`;`EV-WORK-NFR-003` |
| `VETO-WORK-005` | process planning、governance、artifact、workspace、query、projection、reconciliation、report 或 maintenance job 隐式创建 / 修改 Work truth | `VF-WORK-006`;Step 6 `RL-WORK-ARCH-003`~`006` | 相邻仓或消费面反写真相 | `EV-WORK-QUERY-*`;`EV-WORK-OPS-004`;no-write assertions;repository snapshot diff |
| `VETO-WORK-006` | Project、ProjectMember、WorkItem、child WorkItem、Iteration、promote、完成依据等关键变化不可追溯 | `VF-WORK-007`;Step 9 `NF-WORK-AUDIT-001`;Step 10 `EVG-WORK-AUDIT-001` | 审计和消费解释能力失效 | `WorkTraceRecord`;`WorkAuditTrail`;`WorkOutboxRecord`;`EV-WORK-NFR-005`;evidence index |
| `VETO-WORK-007` | Work 的唯一编译期上游不再限定为 `L0-core` / `core-contracts` | `VF-WORK-008`;Step 6 `RL-WORK-ARCH-007`;Step 9 `NF-WORK-COMPAT-002` | 全局依赖裁剪规则被破坏 | dependency report;build metadata;implementation review |
| `VETO-WORK-008` | unauthorized command / query 返回 visible truth 或写入 truth | Step 9 `NF-WORK-SEC-001`;`05` §10.3 | 授权边界失效,可能泄露 Work truth | `EV-WORK-QUERY-001`;`EV-WORK-NFR-003`;negative authorization report |
| `VETO-WORK-009` | duplicate、event dedup、version conflict 或 commit unknown 产生重复 Work truth / trace / outbox | Step 8 `ST-WORK-IDEM-*`;Step 9 `NF-WORK-IDEM-001`;`05` §11.1 | 幂等和一致性红线失效 | `EV-WORK-NFR-004`;`EV-WORK-CORE-004`;`EV-WORK-PROMOTE-005`;idempotency / dedup report |
| `VETO-WORK-010` | 配置能关闭 truth、metadata、idempotency、visibility、audit / outbox、redaction、external body exclusion 或 query no-write | Step 6 `RL-WORK-CONFIG-001`;Step 9 `NF-WORK-SEC-003`;`05` §10.3 | 核心边界可被配置绕过 | `EV-WORK-CFG-017`;`release-config-redline`;config-fast report |
| `VETO-WORK-011` | configured adapter 缺 ref、provider unavailable 或 profile 不匹配时 fallback fake success | Step 9 `NF-WORK-COMPAT-001`;`05` §10.3 | fake 成功会伪造外部协作事实 | `EV-WORK-CFG-013`~`016`;integration-like selected report |
| `VETO-WORK-012` | P0 evidence pack 不可复核: 缺 P0 EV、缺 gate result、缺 redaction report、缺 veto checklist、正式证据路径使用 `latest` 或错误 root | Step 10 `EVG-WORK-INDEX-001` / `GATE-001` / `REDACTION-001` / `REPORT-001` / `VETO-001`;`05` §13 / §14 | 验收结论无法审计,不得通过或有条件通过 | `reports/runs/<run_id>/evidence-index.md`;`gate-results.md`;`redaction-check.md`;`reports/acceptance/veto-checklist.md`;path check |

### 7.2 `VF-WORK-*` 到 `VETO-WORK-*` 映射

| 需求否决项 | 验收否决项 |
|---|---|
| `VF-WORK-001` | `VETO-WORK-001` |
| `VF-WORK-002` | `VETO-WORK-002` |
| `VF-WORK-003` | `VETO-WORK-003` |
| `VF-WORK-004` | `VETO-WORK-004` |
| `VF-WORK-005` | `VETO-WORK-002`;`VETO-WORK-004` |
| `VF-WORK-006` | `VETO-WORK-005` |
| `VF-WORK-007` | `VETO-WORK-006` |
| `VF-WORK-008` | `VETO-WORK-007` |

### 7.3 Release / evidence redline 到否决项映射

| Redline | 验收否决项 | 检查入口 |
|---|---|---|
| raw secret / token / payload / source body 命中 | `VETO-WORK-004` | `redaction-check.md`;`EV-WORK-CFG-010`~`012` |
| unauthorized truth leak / unauthorized write | `VETO-WORK-008` | `EV-WORK-QUERY-001`;`EV-WORK-NFR-003` |
| duplicate / commit unknown 产生重复 truth | `VETO-WORK-009` | `EV-WORK-NFR-004`;idempotency report |
| 核心边界配置可关闭 | `VETO-WORK-010` | `EV-WORK-CFG-017`;`release-config-redline` |
| configured adapter fallback fake success | `VETO-WORK-011` | `EV-WORK-CFG-013`~`016` |
| `latest` 或错误 report / artifact root | `VETO-WORK-012` | path check;`release-evidence-pack` |
| 缺 P0 EV / gate / redaction / veto checklist | `VETO-WORK-012` | evidence index;gate results;redaction check;veto checklist |

### 7.4 Veto checklist 最小字段

| 字段 | 必填 | 说明 |
|---|---|---|
| `veto_id` | 是 | `VETO-WORK-001` 等稳定 ID |
| `source_refs` | 是 | `VF-WORK-*`、Step 红线、测试方案章节或 AC |
| `status` | 是 | `passed` / `failed` / `not_applicable` |
| `evidence_refs` | 是 | `EV-WORK-*`、report 或 artifact ref |
| `defect_refs` | 失败时必填 | 指向 S 级或对应缺陷 |
| `reviewer_status` | 是 | 人 / Agent 已复核 |
| `risk_acceptance_allowed` | 是 | 固定为 `false` |
| `notes` | 否 | 只写补充事实,不得替代证据 |

### 7.5 一票否决裁决图

#### 一票否决裁决图: Veto Before Risk

```text
Acceptance candidate
  -> veto checklist
        |
        +-- any VETO failed
        |     -> final result cannot be pass
        |     -> final result cannot be conditional pass
        |     -> risk acceptance not allowed
        |
        +-- all VETO passed
              -> Step 12 defect grading
              -> Step 13 risk acceptance
              -> Step 14 final conclusion
```

关键说明:

- 一票否决优先于缺陷分级和风险接受。
- `risk-acceptance.md` 不能覆盖 veto failed。
- 缺 veto checklist 时,不得进入通过 / 有条件通过裁决。
- Step 12 只处理未命中 veto 的缺陷分级和复验。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认 `VF-WORK-001`~`008` 全部进入正式 veto 主表 | 否 | 一票否决承接 | 无 | 无回写 |
| 确认 redaction、unauthorized、fake fallback、配置越界、重复 truth、`latest` 和证据不可复核进入 veto | 否 | release / evidence redline 承接 | 无 | 无回写 |
| 确认一票否决不得被风险接受覆盖 | 否 | 风险接受边界承接 | Step 13 | 待后续 Step |
| 确认普通 P0 gate 失败不自动升级为 veto | 否 | 缺陷分级边界 | Step 12 | 待后续 Step |

说明:

```text
本步没有新增需求、设计、测试用例、证据字段或 release gate。
本步只把已确认的一票否决项和红线候选收敛成正式验收裁决清单。
```

## 9. 回填草稿

正式 `06-验收标准.md` §11 建议采用以下结构:

```text
11. 一票否决项
  11.1 裁决原则
  11.2 一票否决项表
  11.3 `VF-WORK-*` 映射
  11.4 Release / evidence redline 映射
  11.5 Veto checklist 与风险接受边界
```

正文草稿:

```text
本章用于裁决 `L1-work` 是否出现任何不可接受失败。一票否决项优先于缺陷分级、风险接受和最终签署。任一 `VETO-WORK-*` 失败时,本轮验收不得结论为通过或有条件通过,也不得通过 `reports/acceptance/risk-acceptance.md` 接受该风险。

一票否决项以 `VF-WORK-001`~`008` 为主来源,并承接 release redline、redaction、证据可复核、配置边界、幂等重复 truth 和编译期依赖裁剪红线。所有否决项必须在 `reports/acceptance/veto-checklist.md` 中有结论、证据引用、缺陷引用和 reviewer status。缺 veto checklist、缺 P0 evidence、缺 release gate result、redaction failed 或正式证据路径使用 `latest` 时,不得进入通过 / 有条件通过裁决。
```

## 10. 待确认事项

无阻塞进入 Step 12 的待确认事项。

后续 Step 必须继续收口:

- Step 12 将未命中 veto 的 S / A / B / C 缺陷、复验和放行规则转成正式裁决。
- Step 13 将风险接受边界具体化,并再次声明 veto / S 级 / evidence redline 不得风险接受。
- Step 14 在最终结论中先检查 veto checklist,再判断通过 / 有条件通过 / 不通过。

## 11. 进入下一步条件

- [x] 直接导致不通过的失败已经列明。
- [x] 否决项来源已经回指需求、红线和证据门禁。
- [x] 否决项检查入口已经固定。
- [x] 否决项不得风险接受的规则已经明确。
- [x] 所有 P0 红线已有 veto 或 Step 12 承接口径。
- [x] 用户审核并确认本 Step。
