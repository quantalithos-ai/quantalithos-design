# Step 12. 定义缺陷分级、复验与放行规则

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 12
> 回填章节: `06-验收标准.md` §12 缺陷分级、复验与放行规则
> 参考粒度: `projects/L1-governance/design-calibration/06_acceptance_step_12_defects_retest_release.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 12 定义缺陷分级、复验与放行规则 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | `05-测试方案.md` §11 / §12 / §14;Step 10 证据门禁;Step 11 VETO |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_12_defects_retest_release.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 13 |

## 2. 本步目标

定义缺陷如何影响验收结论、修复后如何复验、哪些缺陷可以进入放行或风险接受。

本 Step 只回答:

- S/A/B/R 缺陷如何定义,以及它们与 `VETO-ART-*`、P0/P1/P2 范围的关系。
- 每级缺陷对通过、有条件通过、不通过和暂停验收的影响。
- 修复后必须复跑哪些原用例、同 family 用例、blocking suite、redaction / dependency / report audit 和 release smoke。
- 缺陷关闭证据必须包含哪些 run、artifact、report、复验说明和接受记录。
- 哪些问题不得通过风险接受、residual risk 或人工口头确认放行。

本 Step 不绑定具体缺陷系统,不填写真实缺陷状态,不宣告当前缺陷为 0,不替代 Step 13 的风险接受与 Step 14 的最终签署。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `05-测试方案.md` §11 | 已完成 | 提供 S/A/B/R 分级、S 级阻断、suite/check 到缺陷级别、复验范围和关闭证据 |
| `05-测试方案.md` §12 | 已完成 | 提供进入 / 退出 / 暂停阻断准则 |
| `05-测试方案.md` §14 | 已完成 | 提供回归触发、全量 P0 回归集、residual risk 和不可风险接受项 |
| `06_acceptance_step_04_entry_exit.md` | 已完成 | 提供验收进入 / 退出中对 S/A/B/R、VETO、evidence 和 risk acceptance 的前置约束 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已完成 | 提供 query no-write、job no-truth-repair、duplicate replay、commit unknown 和 UoW 缺陷影响 |
| `06_acceptance_step_09_nonfunctional.md` | 已完成 | 提供 redaction、dependency、config、recovery、observability 和 evidence integrity 硬门禁 |
| `06_acceptance_step_10_observability_evidence.md` | 已完成 | 提供 `EV-CAND-ART-*`、artifact/report pairing、no-static-evidence 和 `reports/acceptance/*` 规则 |
| `06_acceptance_step_11_veto.md` | 已完成 | 提供 `VETO-ART-001~009` 不可风险接受规则 |
| `projects/L1-governance/design-calibration/06_acceptance_step_12_defects_retest_release.md` | 已读取 | 仅作为结构和粒度参考,不复用 governance 专属语义 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| S/A/B/R 缺陷如何定义? | S 为任一 VETO、P0 truth / boundary / security / evidence 红线;A 为 P0 blocking suite 或主链证明失败但未命中 VETO;B 为非 P0、P1 selected-run unavailable、报告可读性或非阻断维护问题;R 为 future / out-of-scope residual。 |
| 每级缺陷对验收结论有什么影响? | S 未关闭时只能不通过或暂停验收;A 未关闭且未正式接受时不得通过;B/R 可在记录、接受人和后续触发条件完整时不阻断 P0,但可能导致有条件通过。 |
| 哪些缺陷不可风险接受? | `VETO-ART-001~009`、`VF-ART-001~004`、query no-write 失败、public job / relay truth repair、redaction leak、non-core sibling compile dependency、report integrity failure、invalid P0 config silent fallback 和 P0 profile unavailable but passed 均不可接受。 |
| 修复后如何复验? | 必须至少复跑原失败 `TC-ART-*`、同 family 代表用例、相关 suite/check 和必要的 redaction / dependency / report audit;S 级和触及 release 主链的 A 级修复必须触发全量或近全量 P0 regression。 |
| 缺陷关闭证据必须包含什么? | defect ref、分级理由、失败前 `run_id`、失败 artifact/report、修复说明、复验 `run_id`、复验 suite/check report、关联 `EV-CAND-ART-*`、report audit 和必要时 risk acceptance / signoff。 |
| 缺陷修复是否可只靠人工确认? | 不可以。人工审查只能补充说明,不能替代 raw artifact、suite report、evidence index、redaction/dependency/report audit 和 VETO checklist。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 缺陷分级偏旧主线,未绑定 `VETO-ART-*`、`EV-CAND-ART-*`、P0 suite/check 和 report audit | 重建为 Artifact 当前 S/A/B/R + VETO + evidence-driven 复验规则 |
| Step 4 | 进入 / 退出条件已要求 S=0、A 已修复或接受,但缺具体分级和放行细则 | 本 Step 固定每级缺陷对最终裁决的影响 |
| Step 10 | evidence 缺失 / 静态造证据已是硬门禁,但未映射到缺陷分级 | 本 Step 将 report integrity failure 明确列为 S |
| Step 11 | VETO 已固定但缺陷规则尚未承接 | 本 Step 固定 VETO = S,不可降级为 A/B/R 或 residual |
| `05-测试方案.md` §11 / §14 | 测试层已有缺陷和回归规则,但验收层还未收口放行口径 | 本 Step 把测试复验升级为验收放行前置 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 缺陷等级 | 泛化严重性或旧 S/A/B | S/A/B/R 与 VETO、P0/P1/P2、truth/boundary/evidence 绑定 | 可直接裁决 |
| S 级 | 只描述严重失败 | 明确 `VETO-ART-001~009`、redaction、dependency、config、report integrity、query/job/relay truth repair 都是 S | 防止硬红线被降级 |
| 复验 | 手工确认或单 case 重跑 | 原 TC + same family + related suite/check + audit + release smoke 条件 | 防止局部修复破坏主链 |
| 放行 | 视情况 | S/VETO 不可放行;A 严格条件;B/R 进入 risk acceptance | 防止风险接受越权 |
| 关闭证据 | 缺陷状态即可 | defect + run_id + artifact + report + EV + retest explanation + acceptance ref | 可复查 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| A 级是否允许有条件通过 | A. 永不允许;B. 严格条件下允许 | 采用 B。只有不命中 VETO/S、不影响 P0 truth、证据完整且有正式接受人时才能进入有条件通过。 |
| B/R 是否阻断 P0 | A. 阻断;B. 不阻断但必须记录 | 采用 B。B/R 不能伪装成 P0 已验证,但可以进入 residual / risk acceptance。 |
| evidence integrity failure 是否 S | A. 否;B. 是 | 采用 B。证据不真实时验收裁决本身不成立。 |
| P1 selected-run unavailable 是否算 A | A. 默认 A;B. 默认 B/R | 采用 B。除非本次验收基线正式把 selected-run 升级为进入条件。 |
| 性能 sample 异常是否 S | A. 是;B. 否 | 采用 B。当前无硬 P95 / SLA 阈值,只记录 sample/trend 和 residual。 |

## 8. 结构化中间产物

### 8.1 缺陷分级表

| 缺陷级别 | 定义 | Artifact 典型触发 | 对结论的影响 | 复验要求 |
|---|---|---|---|---|
| S | 命中一票否决、P0 truth / boundary / security / evidence 红线 | `VETO-ART-001~009`;`VF-ART-001~004`;query no-write 失败;job / relay truth repair;redaction leak;dependency boundary failed;report 静态造证据;duplicate replay 二写 truth | 未关闭时只能“不通过”或暂停验收;不可风险接受 | 原失败 case + same family + affected blocking suite + related audit;触及 P0 红线或 release 主链时全量 P0 regression |
| A | P0 blocking suite 或主链证明失败,但未直接命中 VETO/S | command / query / consumer 主线失败;core config profile 失败但未 silent fallback;release smoke 断裂但 truth 未污染;脚本问题导致 P0 无法证明 | 未关闭且未批准接受时不得“通过”;通常阻断 release,可导致“有条件通过”或暂停 | 原失败 case + primary suite + report pairing;若接受,必须有接受人、截止时间和补验计划 |
| B | 非 P0、不影响当前主证据链或报告可读性 / selected-run 问题 | P1 selected-run unavailable;报告措辞不清;性能 sample 异常但无硬阈值;非阻断 fake 维护性问题 | 不阻断 P0;可进入有条件通过的风险清单 | 视影响复跑 selected suite 或补 report review,不得计入 P0 passed |
| R | 当前范围外或未来能力 residual | real-like provider 深层行为;production-like capacity;future SLA;长期 evidence retention;真实 downstream target 特性 | 不阻断 P0;必须进入 Step 13 风险接受或后续跟踪 | 后续升级为 P0/P1 时重新固定基线并测试 |

### 8.2 S 级阻断判定表

| 触发条件 | 对应来源 | 必须处理 |
|---|---|---|
| `VETO-ART-001~009` 任一命中 | Step 11 | 修复并复验;不得风险接受 |
| 五个核心能力节点任一无法成立 | `VF-ART-001`;`EV-CAND-ART-CORE-*` | 修复核心主链,复跑 release-main-smoke 与受影响 suites |
| 外部正文、消费副本、preview/report/outbox/handoff body 进入正式 truth 或正式输出面 | `VF-ART-002`;Step 6 / Step 10 | 修复 body-free/redaction,复跑 redaction-boundary 与相关 suite |
| version / lineage / baseline 无法稳定形成、追溯、冻结或历史被静默覆盖 | `VF-ART-003`;Step 8 | 修复状态 / 事务 / 历史语义,复跑 contract-domain-fast、service-flow-fast、idempotency suites |
| 下游 / query / consumer / job / handoff / replay 可以反写 Artifact truth | `VF-ART-004`;Step 6 / Step 8 | 修复 no-write / no-truth-repair,复跑 service-flow-fast、entry-worker-job、operations-replay-core |
| accepted truth 缺 trace / audit / outbox / stored result 或 duplicate / commit unknown 触发第二次 truth write | Step 8 / Step 9 | 修复 UoW / idempotency,复跑 infra-runtime-fake、operations-replay-core、release-main-smoke |
| redaction scan 检出 raw body、external response、secret、token 或 full sensitive ref | Step 9 / Step 10 | 修复泄露面,复跑 redaction-boundary 和 release redaction check |
| 非 `L0-core` / `core-contracts` sibling 成为 compile-time dependency | Step 6 / Step 9 | 移除越界依赖,复跑 dependency-boundary |
| evidence index、VETO checklist、report 或 acceptance handoff 静态伪造 passed | Step 10 | 修复 report generation,复跑 report-generation-audit,重新生成 acceptance materials |
| invalid P0 config silent fallback、partial facade、forbidden override 或 P0 profile unavailable but marked passed | Step 9 / Step 10 | 修复 config/runtime builder,复跑 config-redline 与 gate summary |

### 8.3 修复后复验规则

| 缺陷触发面 | 必跑用例 / suite | 必跑 check | 关闭证据 |
|---|---|---|---|
| contracts / typed ref / DTO / metadata | 原失败 `TC-ART-*` + `contract-domain-fast` | report pairing | suite report + case artifact + schema / compatibility 说明 |
| domain / state / policy | 原失败 case + same state family + `contract-domain-fast` | 若输出面变化则 redaction | domain/state suite report + invariant 说明 |
| command / UoW / outbox / stored result | 原失败 command family + `service-flow-fast`;相关 `TC-ART-IDEMP-*` | report pairing;redaction if output changed | UoW / outbox / stored-result assertion artifact + suite report |
| query no-write / read surface / degraded | 原失败 query + representative query no-write cases + `service-flow-fast` | write audit;redaction | write-audit artifact + query suite report |
| consumer / worker | 原失败 consumer + duplicate / unsupported / delayed representative cases + `entry-worker-job` | redaction | worker suite report + receipt/report assertion |
| outbox / publisher / relay facade | 原 outbox / relay case + `entry-worker-job` + `operations-replay-core` | report pairing;redaction | publication marker/report + no truth repair evidence |
| public operations job / handoff / export | 原 job case + duplicate/no truth repair cases + `operations-replay-core` | redaction;report pairing | job report + marker artifact + handoff safe material assertion |
| config / runtime builder | 原 config case + `config-redline`;必要时 `infra-runtime-fake` | report pairing | config validation report + profile/gate summary |
| redaction leak | leak fixture + `redaction-boundary` | `check_redaction.sh` | `reports/runs/<run_id>/redaction-check.md` |
| dependency boundary | dependency case + `dependency-boundary` | `check_dependency_boundary.sh` | `reports/runs/<run_id>/dependency-boundary.md` |
| evidence / report integrity | `report-generation-audit`;受影响 suite sample | no static evidence;artifact pairing | `reports/runs/<run_id>/report-audit.md` + regenerated evidence index |
| release smoke closure | original scenario + `release-main-smoke` + affected lower suite | release checks | release suite report + `gate-summary.md` |

### 8.4 放行规则

| 条件 | 是否可放行 | 说明 |
|---|---|---|
| 存在未关闭 S 级缺陷 | 否 | 只能不通过或暂停验收;不得有条件通过 |
| 存在任一 VETO 命中 | 否 | `VETO-ART-*` 不允许风险接受 |
| 存在未关闭 A 级缺陷 | 通常否 | 只有不影响 P0 truth、不命中 VETO/S、证据完整且有正式接受人时,才可进入有条件通过 |
| 仅存在 B/R residual | 可有条件通过 | 必须进入 Step 13 risk acceptance,并记录接受人、影响、后续动作和触发条件 |
| P1 selected-run unavailable | 可记录 residual | 不得计入 P0 passed evidence;若本次 release 升级为进入条件,需重开 Step 3/4/9/13 |
| 性能 sample / trend 异常但无正式阈值 | 可记录风险 | 当前不构成 S/A;若未来硬化阈值需重新基线 |
| evidence/report 缺失、orphan EV、static pass、缺 raw artifact | 否 | 证据不可裁决,通常按 S 处理 |
| A 级被接受但缺截止时间或责任人 | 否 | risk acceptance 不完整,不能支撑有条件通过 |

### 8.5 缺陷关闭证据清单

| 证据项 | S 级 | A 级 | B/R 级 |
|---|---|---|---|
| defect ref、影响面、分级理由 | 必需 | 必需 | 必需 |
| 失败前 `run_id` | 必需 | 必需 | 有则附 |
| 失败前 raw artifact / suite report / gate summary | 必需 | 必需 | 有则附 |
| 修复说明与影响范围 | 必需 | 必需 | 建议 |
| 复验 `run_id` | 必需 | 必需 | 有则附 |
| 复验 suite/check 报告 | 必需 | 必需 | 视情况 |
| 关联 `EV-CAND-ART-*` 和 report path | 必需 | 必需 | 视情况 |
| redaction / dependency / report audit | 相关即必需 | 相关即必需 | 可选 |
| 是否新增防回归测试说明 | 必需 | 必需 | 可选 |
| 风险接受人 / residual 说明 | 不允许用于放行 | 若接受则必需 | 必需 |

### 8.6 缺陷 / 复验停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| S/A/B/R 分级是否可判定 | 通过 | 与 `05` §11 一致,并补齐验收结论影响 |
| VETO 是否不可降级 | 通过 | VETO = S,不可风险接受 |
| 复验 suite/check 是否固定 | 通过 | 见 §8.3 |
| 关闭证据是否固定 | 通过 | 必须有 run_id、artifact、report、EV 和复验说明 |
| B/R residual 是否进入风险接受 | 通过 | Step 13 继续收口 |
| P1/P2 是否污染 P0 | 未污染 | P1 selected-run / production-like / capacity 不计 P0 passed |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_12_defects_retest_release.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“缺陷分级表”“S 级阻断判定表”“修复后复验规则”“放行规则”“缺陷关闭证据清单”和“缺陷 / 复验停审记录”小节,了解缺陷如何影响验收结论、复验和放行。

正式 `06-验收标准.md` §12 应回填:

- 缺陷分级固定为 S/A/B/R。
- S 级和 `VETO-ART-*` 不允许风险接受;未关闭时最终结论不得为通过或有条件通过。
- A 级原则上阻断通过;只有在不影响 P0 truth、不命中 VETO/S、证据完整且有接受人、截止时间和补验计划时,才可进入有条件通过。
- B/R 可进入风险接受,但不得伪装成 P0 已验证,也不得补足 P0 evidence。
- 修复后必须复跑原 `TC-ART-*`、相关 suite/check 和 report audit;关闭证据必须包含 run_id、artifact、report、`EV-CAND-ART-*` 和复验说明。
- evidence/report 缺失、静态造证据、orphan EV、P0 profile unavailable but passed、redaction / dependency / report audit failed 都不得放行。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 具体缺陷系统字段和 defect ref 格式 | 影响执行记录 | 不在 `06` 固定;只要求可回指 defect ref、run_id、artifact 和 report |
| A 级临时接受审批人 | 影响有条件通过 | Step 13 / Step 14 固定接受人与签署角色 |
| P1 selected-run 是否在某 release 升级为进入条件 | 影响 B/R 分类和放行规则 | 当前不升级;若升级需重审 Step 3/4/9/13 |
| 长期 evidence retention 周期 | 影响缺陷关闭后长期审计 | 当前只要求覆盖验收与复验关闭周期;Step 13 记录 residual |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 缺陷对结论的影响可判定 | 通过 | 见 §8.1 / §8.4 |
| 缺陷规则与一票否决项一致 | 通过 | VETO = S,不可接受 |
| 复验范围和关闭证据已固定 | 通过 | 见 §8.3 / §8.5 |
| B/R residual 已交给风险接受 Step | 通过 | Step 13 继续定义风险接受与遗留项 |
| 可进入 Step 13 | 通过 | 下一步定义风险接受与遗留项;进入前等待用户审查 |
