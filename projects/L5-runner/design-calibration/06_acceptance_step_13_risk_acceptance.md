# Step 13. 定义风险接受与遗留项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 13  
> 回填章节：`06-验收标准.md` §13 风险接受与遗留项  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` |
| current_step | Step 13 |
| current_module | `risk_acceptance:eligibility_record_roles_expiry_reopen` |
| gate_status | `pass_for_step_14` |
| actual_risk_acceptance_records | 0 |
| actual_acceptors / signatures | 0 / 0 |
| candidate_residuals | `RUN-UP-001~008`、`RUN-DDD-001~003`、`RUN-DOC-002~003`、`RUN-OPS-001~002`（均未接受） |
| actual_verdict | `none` |
| formal_06_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 Step 14 |

本步定义“什么结构才可能支持有条件通过”，不执行风险接受。持续 blocker 只是候选遗留输入；没有实际验收范围、evidence、责任人、具有权限的 acceptor、期限和签署时，不能标记 `accepted`，也不能用设计文档作者代替风险接受人。

## 2. 输入、目标与非目标

| 输入 | 用途 |
|---|---|
| 05 §14 与 Step 14 | residual register、不可接受项与回归 trigger |
| 06 Step 3～4 | target tier、baseline、entry/exit 与 blocked 语义 |
| 06 Step 9～12 | NFR residual、evidence gap、VETO、S/A/B/R 与放行边界 |
| 项目 blocker 台账 | 候选风险来源与 future owner，不代表已接受 |

目标是固定风险资格、完整字段、责任/接受角色分离、期限/触发、补偿/撤销和重开规则。非目标是指定个人、日期、工单、预算或实际签字；也不把 upstream blocker 本身改写为 Runner 可控制的缺陷。

## 3. SOP 问题回答

| 问题 | 收口答案 |
|---|---|
| 哪些风险可支持有条件通过？ | P0 主线已由 target-tier 合格证据证明后，非 VETO 的受控 A（极窄）、B、R residual；其影响范围、时间窗口和补偿必须有限且可跟踪。 |
| 哪些不能接受？ | 12 项 VETO、开放 S、P0 truth/security/redaction/dependency/config fail-closed/evidence integrity、required positive blocked、未知影响、无证据/无 owner/无期限风险。 |
| 接受人是谁？ | 必须是对受影响业务/产品/安全/运维/验收范围有明确授权的实际角色；责任 owner 负责处置但不能默认自我接受。当前具体角色/person authority 未确认。 |
| 后续动作和截止时间是什么？ | 每项实际记录必须有可验证 action、owner、absolute deadline 或明确 external trigger、复核频率、停止/撤销条件与 closure evidence；“以后处理”无效。 |
| 是否同步到 07/问题记录？ | 是。未关闭 residual 需进入正式 07 的风险/依赖/phase gate，并在未来问题记录中追踪；同步不等接受，也不改变 raw gate status。 |

## 4. 风险资格与不可接受边界

### 4.1 Eligibility gate

风险接受候选必须同时满足：

1. 当前验收已合法进入并固定 target tier、baseline、fixed run 与 evidence；
2. 所有 `VETO-RUN-*` 为真实 `clear`，无开放 S；
3. target-tier P0 主线成立，候选不覆盖 required positive、truth/security/evidence gate；
4. 影响范围、概率/严重度、用户/平台/版本边界和最坏后果可说明；
5. mitigation/compensation 可执行，failure/stop trigger 可观测；
6. disposition owner 与有权 acceptor 不缺失，期限不是空值或“待定”；
7. source evidence、缺陷/blocker、review 与后续验证入口可追踪。

任一条件不满足，状态只能为 `open / blocked / ineligible`，不能作为 `有条件通过` 依据。

### 4.2 永不可接受项

| 类别 | 例子 | 强制处理 |
|---|---|---|
| VETO / S | `latest`、authority/integrity bypass、truth write、Unknown replay、危险清理、泄露、私有依赖、证据/signoff 造假 | 修复、新 run、全量 P0；不得接受 |
| required P0 未证明 | target-tier positive blocked/not_run/incomplete、VETO unknown/disputed、缺 raw/report/check | 保持 blocked；补环境/证据，不得接受成 pass |
| 无界或未知影响 | 无明确版本/platform/user scope、可能跨 owner truth、无法检测恶化 | 先调查并缩小；不可签署 |
| 无处置能力 | 无 owner、无补偿、无 rollback/stop trigger、无 deadline | 不具备接受资格 |
| 权限不成立 | 开发者/文档作者自签跨安全/产品/运维风险 | 取得正式授权角色，否则 open |

## 5. 风险记录结构与状态

### 5.1 最小记录字段

| 字段组 | 必需内容 |
|---|---|
| identity | stable risk/residual ref、状态、类别 `A/B/R`、target tier、版本/platform/environment scope |
| source | blocker/defect/AC/gate/NFR/TC/EV/run/report/review refs+digests |
| analysis | scenario、原因、impact、likelihood/severity 口径、最坏后果、受影响/不受影响边界 |
| safeguards | current controls、mitigation/compensation、monitoring signal、stop/revoke/escalation trigger |
| disposition | 后续 action、责任 owner、依赖 owner、absolute deadline 或 external trigger、复核 cadence |
| acceptance | 有权 acceptor 角色/identity、权限依据、acceptance scope、decision/time、理由 |
| closure | closure criteria、required evidence、reopen conditions、07/problem-record refs |

禁止字段值：`TBD` 作为已接受记录、模糊“后续修复”、不存在的姓名/日期/工单/run_id、空 evidence、只写“业务已知晓”。

### 5.2 状态机

```text
Candidate
  -> Analyzed
  -> Eligible | Ineligible | Blocked
  -> Acceptance Pending
  -> Accepted | Rejected
  -> Mitigating
  -> Closed | Expired | Revoked | Reopened
```

| 状态 | 裁决含义 |
|---|---|
| `Candidate/Analyzed/Blocked/Pending` | 未接受，不能支撑有条件通过 |
| `Ineligible/Rejected` | 不能作为放行依据；required item 仍阻断 |
| `Accepted` | 仅在 scope/期限内支持有条件通过；不把 failed/blocked raw status 改成 passed |
| `Expired/Revoked/Reopened` | 原有条件通过依据失效；必须暂停/重开裁决并按 trigger 行动 |
| `Closed` | closure evidence 经 review；不是简单到期或删除记录 |

## 6. 角色与签署分离

| 角色 | 责任 | 不得做 |
|---|---|---|
| Risk/disposition owner | 执行 mitigation、follow-up、监测与 closure evidence | 不能因负责修复就默认有权接受全部影响 |
| Dependency owner | 闭合 upstream/环境/authority trigger，提供正式 contract/ref | 不能由 Runner 代签 owner truth |
| Test/evidence reviewer | 核对 source run、gap、checks 与 raw status | 不能把 blocked/failed 改成 pass |
| Security/architecture role | 对相应安全/边界影响给出必要 review | 不能接受 VETO/S |
| Product/business role | 接受明确用户/范围/时间影响（若有权限） | 不能覆盖技术安全或 formal owner authority |
| Operations/release role | 接受运维窗口/监测/回退影响（若有权限） | 不能把 readiness 缺失变 production-ready |
| Acceptance authority | 确认风险结构可支撑最终 `有条件通过` | 不能取代其他 required signoff 或伪造证据 |

具体角色名称、人员和权限来源必须由未来 baseline/GRC 确认；本文不填人名或签署。

## 7. 当前候选遗留登记（未接受）

| 候选组 | 影响 | 当前状态 | 进入实际接受前缺什么 | 07 承接 |
|---|---|---|---|---|
| `RUN-UP-001~008` owner/SDK/platform seams | T2～T4 positive integration、authority、owner readback、cleanup/handoff blocked | `blocked / not_accepted` | 正式 public contract/version、owner、环境、真实 positive evidence、target-tier baseline | per-adapter planned boundary、依赖关闭 gate |
| `RUN-DDD-001~003` 实现仓/技术/store | 无 runner、代码、durable semantics 或测试执行 | `blocked / not_accepted` | repo/technology/store authority、implementation evidence、test run | implementation phases、ledger、planned skeleton |
| `RUN-DOC-002` 新版正式 06 | 当前直到 Step 15 仍缺正式裁决文档 | `open / not_accepted` | Step 15 formal assembly + audit | Step 15 关闭“新版 06 缺失”部分 |
| `RUN-DOC-003` 正式 07/ledger/skeleton | 无实施任务边界或 readiness | `blocked / not_accepted` | 07 calibration/formal assembly 与 planned artifacts | 本轮 07 完成时创建 |
| `RUN-OPS-001` SLO/capacity/retention authority | 无 hard performance/SLO/retention verdict | `blocked / not_accepted` | workload/platform/window/threshold/owner/measurement evidence | measurement/authority-triggered planned work |
| `RUN-OPS-002` integration/GRC environment | T2～T4 无真实运行/审查场所 | `blocked / not_accepted` | environment identity、GRC roles/process、positive run/evidence | environment/GRC dependency gate |

这些 blocker 不能整体打包接受；未来必须按具体 target tier、版本、平台、环境和影响拆成独立 risk record。尤其 `RUN-DDD-*` 与 required target-tier positive 缺失不能用风险签字替代实现和测试。

## 8. 接受、失效与重开规则

| 事件 | 必须动作 |
|---|---|
| deadline/trigger 到达但未关闭 | `Expired`，原有条件通过依据失效，暂停相关推进并重新裁决 |
| scope/version/platform/environment 改变 | 旧接受不自动适用；重做 impact/evidence/authority review |
| 新 VETO/S、影响扩大或 control 失效 | 立即 `Revoked/Reopened`，总体不能继续条件通过 |
| upstream contract/authority 到位 | 先回写受影响设计与 baseline，执行 required positive/full regression；不能直接关闭 risk |
| 新 run 与原假设冲突 | 保留旧记录，标 disputed/reopened，按新证据裁决 |
| mitigation/closure 完成 | 绑定真实 evidence/review 后 `Closed`；不删除历史接受记录 |
| acceptor/authority 失效 | 重新确认有权角色；旧签署不能无限继承 |

## 9. 风险接受报告与审查门禁

`reports/acceptance/risk-acceptance.md` 必须从 fixed-run handoff、open issues、defect/residual source 生成初稿，并由独立 review 补充实际 acceptance；不得由生成脚本自动填 `Accepted`。每项必须与 `reports/review/*`、source digest 和最终 verdict version 一致。

| 检查 | 通过条件 | 失败影响 |
|---|---|---|
| completeness | §5.1 全字段非空、scope/期限/trigger 精确 | 不得有条件通过 |
| eligibility | 无 VETO/S/P0 required bypass；P0 主线已证明 | 记录 `ineligible`，总体按原 gate 裁决 |
| authority | acceptor identity/role/authority ref 可验证 | 接受无效 |
| traceability | source run/defect/gate/evidence/review 同版本可回指 | 接受无效，evidence gate failed |
| non-mutation | raw failed/blocked 与 owner truth 未被改写 | 违反则命中 VETO 候选 |
| expiry/reopen | deadline、trigger、revocation/closure 明确可执行 | 不得有条件通过 |

## 10. 跨风险审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| VETO/S 是否可能被接受 | no | eligibility 第一门禁即排除 |
| required positive blocked 是否可签掉 | no | 必须补 contract/environment/evidence 或降低 target tier 并重建 baseline；不得事后降级 |
| owner 与 acceptor 是否混同 | no | 角色职责分离；实际 authority 后置确认 |
| blocker 是否被伪装成已接受 | no | 当前候选全部 `not_accepted` |
| 风险接受是否改写 raw status | no | failed/blocked 保真，仅影响最终 verdict 条件 |
| 接受是否永久有效 | no | scope/version/deadline/trigger/authority 变化均重开 |
| 是否可打包模糊风险 | no | future record 必须按具体影响拆分 |
| 当前是否伪造接受/签字 | pass | record/acceptor/signature 均为 0 |

## 11. 回填草稿、blocker 与下一步

正式 §13 应保留 eligibility、不可接受边界、最小字段、状态机、角色分离、候选遗留表、失效/重开和 report review gate。正文必须明确所有当前 blocker 均未接受，不得填写人名、日期、签署或声称支持有条件通过。

- [x] 可接受与不可接受范围可判定，VETO/S/P0 required 不可绕过。
- [x] 风险记录具有 source、scope、impact、control、owner、acceptor、期限、trigger、closure 全字段。
- [x] owner、reviewer 与 acceptor 权限分离。
- [x] 当前 blocker 仅为候选遗留，全部 `not_accepted`。
- [x] 失效、撤销、重开和 07 承接规则完整。
- [x] 允许进入 Step 14；正式 06 仍禁止写入。
