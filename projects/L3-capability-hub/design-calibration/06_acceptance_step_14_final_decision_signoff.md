# L3-capability-hub 06 验收标准 Step 14：最终结论与签署口径

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 14
> 书写规范：`standards/document/验收标准书写规范.md` §5.14
> 上游：`06_acceptance_step_03_baseline.md` 至 `06_acceptance_step_13_risk_acceptance.md`
> 目标回填：`projects/L3-capability-hub/06-验收标准.md` §14
> 参考粒度：`projects/L1-governance/design-calibration/06_acceptance_step_14_final_decision_signoff.md`、`projects/L1-artifact/design-calibration/06_acceptance_step_14_final_decision_signoff.md`
> Step 状态：`accepted-design / not-executed`
> 日期：2026-07-26

## 1. Step 状态与边界

| 项目 | 状态 | 说明 |
|---|---|---|
| 当前 Step | Step 14：定义最终结论与签署口径 | 固定最终裁决值、阶段准入、发布准备和签署责任 |
| 输入 | Steps 1~13 | 已闭合验收输入、范围、基线、门禁、VETO、缺陷、风险接受和证据合同 |
| 真实结论 | `not_entered` | 没有 implementation、run、artifact、report、review、risk decision 或 signoff 实例 |
| 正式文档 | 未回填 | 正式 `06-验收标准.md` 仍保持 historical material，Step 15 才整体重建 |
| 下一步 | Step 15 | 由 Step 15 装配正式 15 章文档并执行跨门禁总审计 |

本步不创建真实验收结论、签署人、时间、签名、release status、risk acceptance 或 evidence alias。`<run_id>`、`<commit>`、`<review_ref>` 等只作为未来字段合同，不是当前事实。

## 2. 本步目标与必须回答的问题

本步把前 13 个 Step 的局部门禁收敛为一个可审计的最终裁决合同：

1. 最终结论允许哪些值，哪些模糊表达禁止使用。
2. 什么条件允许进入下一阶段，什么条件只允许停留在暂停/不可裁决。
3. 何时可以进入 release preparation，何时只能保持 blocked。
4. 哪些角色必须签署哪些事实，签署不承担哪些越界责任。
5. 风险接受、测试通过、发布准备和最终验收之间如何互相隔离。
6. handoff、VETO checklist、risk acceptance、open issues 和 review provenance 缺失时如何裁决。

## 3. 权威输入与裁决顺序

| 输入 | 裁决用途 | 不得推断 |
|---|---|---|
| `06_acceptance_step_03_baseline.md` | 固定真实结论必须绑定 source/delivery/config/data/run/evidence baseline | 当前存在任何版本、run 或 report |
| `06_acceptance_step_04_entry_exit.md` | 规定 entry、exit、blocked、invalid、not-decided 语义 | 设计期 `pass-designed` 等于产品通过 |
| `06_acceptance_step_05_function_gate.md` 至 Step 9 | 提供 P0 功能、边界、接口、状态、事务和 NFR 门禁 | 任一门禁已执行或已通过 |
| `06_acceptance_step_10_observability_evidence.md` | 提供 raw/report/EV/review/handoff 链 | `EV-CH-*` 合同等于 run-scoped instance |
| `06_acceptance_step_11_veto.md` | 提供 `VETO-CH-001..013` 与过程 VETO | VETO 可由 risk acceptance 覆盖 |
| `06_acceptance_step_12_defects_retest_release.md` | 提供 S/A/B/R、复验和 release 影响 | retry pass 可以覆盖旧失败 |
| `06_acceptance_step_13_risk_acceptance.md` | 提供 residual eligibility、接受字段和 reopen 规则 | 当前已有 accepted residual |
| `05-测试方案.md` | 提供 189/638 分母、10 suites、5 gates、9 checks、4 builders 和固定路径 | 测试脚本、环境或报告已存在 |

权威裁决链固定为：

```text
immutable baseline + applicable scope
  -> P0 AC/gate results and evidence integrity
  -> VETO / S / current P0-A review
  -> eligible residual and authorized risk decision
  -> phase/release eligibility
  -> final conclusion and role signoff
```

## 4. SOP 问题回答

| 问题 | 本项目回答 | 依据 |
|---|---|---|
| 结论只能有哪些取值？ | 最终总体结论只允许 `通过`、`有条件通过`、`不通过`。内部流程可暂记 `not_entered`、`paused`、`not_decided`，但这些不是最终结论。 | 书写规范 §4.2、SOP Step 14 |
| 何时允许进入下一阶段？ | P0 semantic gates 全部可裁决且通过，VETO 未命中，S=0，当前 P0 A=0，evidence/report/provenance 完整；若存在合格 residual，还必须逐项完成 Step 13 的真实接受。 | Steps 4、11、12、13 |
| 何时允许发布准备？ | 除上述 P0 条件外，必须有兼容的 R2 main refs；release-required selected scope 已完成 R3；R4 release checks、report、handoff 和 open-issue review 完整。R4 本身不产生验收 verdict。 | `05` §12/§14、Step 12 |
| 哪些角色必须签署？ | Owner/业务、架构、测试、实施、运维/安全/合规、验收负责人按职责签署；实际组织可合并角色，但不能省略责任域。 | 书写规范 §5.14、项目边界 |
| 签署是否代表风险接受？ | 不代表。风险接受必须单独存在于 `reports/acceptance/risk-acceptance.md`，由授权 acceptor 逐项确认；最终签署只确认结论与已接受风险清单一致。 | Step 13、Step 10 |

## 5. 当前文档问题诊断

| 材料 | 冲突或缺口 | 处置 |
|---|---|---|
| 旧正式 `06-验收标准.md` | 使用旧对象、旧拓扑、旧阈值和空签署占位，不能证明当前能力边界 | 只作 historical material；Step 15 整体替换 |
| Step 10 evidence 规则 | handoff/review 入口已固定，但最终结论对缺证据的落点未统一 | 本步明确缺失/invalid evidence 只能暂停或不通过 |
| Step 11 VETO | VETO 触发影响已定义，但未汇总到最终结论 | 本步固定 VETO 只能不通过/暂停修复，不能有条件通过 |
| Step 12 缺陷 | S/A/B/R 对 P0、selected、release 的影响分散 | 本步建立统一判定矩阵 |
| Step 13 风险接受 | residual 字段完整，但尚未接入总体结论 | 本步要求有条件通过引用真实 risk acceptance |
| README / 上游旧材料 | 可能把 runtime、approval、method body、marketplace 或 provider cost 拉回 Hub | final review 维持 active formal 00~05 优先级 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 总体结论 | 历史文档中的空白/模糊占位 | 三值最终结论，内部暂停状态单独表达 | 避免把缺证据当作结论 |
| 有条件通过 | 没有资格和证据约束 | 仅限 P0 完整、无 VETO/S/P0-A、逐项接受 residual | 防止风险接受越权 |
| release preparation | 与验收混在一起 | 独立的 R3/R4/handoff 准入层 | release smoke 不能自行验收 |
| 签署 | 泛化角色和空日期 | 责任域、必核材料、表示/不表示边界 | 便于交接和审计 |
| 当前事实 | 容易误读为已验收 | 明确 `not_entered`，所有实例为空 | 不伪造验收结果 |

## 7. 验收裁决取舍

| 议题 | 候选 | 选择与理由 |
|---|---|---|
| 是否允许“基本通过/原则上通过” | 允许 / 禁止 | 选择禁止；只有三值结论可进入正式报告 |
| 缺 baseline 或 run 是否可人工通过 | 可以 / 不可以 | 选择不可以；缺 immutable provenance 时只能暂停或不可裁决 |
| VETO/S 是否可有条件通过 | 可以 / 不可以 | 选择不可以；Step 11/13 已将其列为不可接受 |
| P1 selected unavailable 是否必然否定 P0 | 是 / 视 manifest | 选择视 manifest；不属于当前 required claim 时保持 residual，required 时阻断 selected/release |
| R4 release 是否自动形成 acceptance | 是 / 否 | 选择否；R4 只形成 release evidence readiness |
| 最终签署是否批量接受风险 | 是 / 否 | 选择否；每条 residual 必须有独立 risk record 和 acceptor |

## 8. 结构化中间产物

### 8.1 最终结论定义

| 结论 | 全部必要条件 | 禁止条件 | 后续动作 |
|---|---|---|---|
| `通过` | 全部适用 P0 AC/gates 通过；10 suites、189 TC/DS/EV、638 pairs 和 9 checks 的 required evidence 完整；VETO=0、S=0、current P0 A=0；redaction/dependency/report audit clean；无未接受 P0 residual | 任一 P0 failure、VETO/S/P0-A、invalid evidence、baseline drift、required cell 缺失 | 允许进入下一阶段；release preparation 仍需独立 R3/R4 条件 |
| `有条件通过` | `通过` 的全部 P0 条件成立；存在的 residual 全部是 Step 13 eligible 且已真实接受；每条有 owner、acceptor、deadline/trigger、follow-up 和 p0 contamination check | 任一 VETO/S/P0-A、evidence hard failure、责任/安全/配置红线、缺 risk acceptance 字段 | 允许进入明确限定的下一阶段；按期限/触发条件跟踪，不能扩大 scope |
| `不通过` | 任一 P0 gate 失败、VETO 命中、S 未关闭、current P0 A 未关闭、evidence integrity 失败、redaction/dependency/config hard gate 失败或未接受 residual 影响当前结论 | 无 | 修复/回开/复验；重新建立 distinct run 和结论包 |
| `paused/not_decided`（内部状态） | 缺 baseline、scope、run、raw/report、设计 oracle、review provenance 或发现 source drift/影响不明 | 不得映射为通过或有条件通过 | 暂停 affected scope，补齐输入或回开 owning Step；完成后重新裁决 |

### 8.2 分层准入矩阵

| 层级 | 必要输入 | 允许状态 | 不足时 |
|---|---|---|---|
| P0 semantic exit | immutable source/delivery/config/data baseline；189 canonical TC/DS/EV；638 pairs；10 primary suites；9 checks；同 run raw/report/digest/pairing/redaction/no-static；S/A/VETO closure | `eligible_for_decision` | blocked/not_decided；不能写最终通过 |
| selected integration | P0 semantic exit；selected immutable product/config/TLS/source/route/observer manifest；R3 exact subset；typed unavailable/failure；safe cleanup | `selected_ready` 或 `blocked_dependency` | selected claim blocked；不改写 P0 |
| release requalification | compatible R2 refs；required R3 refs；R4 smoke/check/report/evidence/handoff；open issue review；release manifest | `release_ready` 或 blocked | 不得进入 release preparation |
| acceptance handoff | P0/selected/release status；`handoff.md`、`veto-checklist.md`、`open-issues.md`；必要时完整 `risk-acceptance.md`；human/Agent review provenance | `handoff_ready` | `not_decided`；不得签署 |
| final decision | handoff ready；各角色材料确认；risk records 与结论一致 | 三值之一 | 保持内部 `paused/not_decided` |

### 8.3 结论判定矩阵

| 条件 | 通过 | 有条件通过 | 不通过/暂停 |
|---|---|---|---|
| P0 functional/data/interface/state/NFR gates | 全部适用通过 | 全部适用通过 | 任一失败或缺结果 |
| `VETO-CH-001..013` 与过程 VETO | 全部未命中 | 全部未命中 | 任一命中 |
| open S | `0` | `0` | `>0` |
| open current P0 A | `0` | `0` | `>0` |
| B/R residual | 无，或不影响当前 claim | 每项真实接受且有完整字段 | 未记录、未接受或影响不明 |
| evidence integrity | same-run、完整、audit clean | same-run、完整、audit clean | missing/orphan/static/cross-run/digest mismatch |
| redaction/dependency/responsibility | clean | clean | 任一 failed |
| P0 config/profile/entry | available、strict、无 silent fallback | available、strict、无 silent fallback | unavailable but passed、partial activation或forbidden override |
| selected unavailable | 不适用或 manifest 排除 | 记录为 eligible residual | manifest required 但 unavailable |
| release/handoff | 只在另行满足时允许 | 只在另行满足时允许 | 缺 required refs/check/report/review |

### 8.4 维度结论表

正式验收报告可以分别记录维度结论，但总体结论必须服从最严格的 P0/VETO/evidence 结果：

| 维度 | 允许值 | 最低依据 |
|---|---|---|
| 功能/边界/一致性 | `通过 / 有条件通过 / 不通过` | 对应 AC、TC/DS/EV、P0 gate、VETO 和 defect closure |
| 非功能结构门禁 | `通过 / 有条件通过 / 不通过` | 20 NFR structural contracts、configuration/redaction/trace checks；无阈值 numeric 保持 `not_evaluated` |
| selected integration | `通过 / 有条件通过 / 不通过` | immutable selected manifest、R3 raw/report、typed unavailable/cleanup |
| release preparation | `通过 / 有条件通过 / 不通过` | R2/R3 lower refs、R4 checks/report/handoff；不代表 acceptance |
| 总体结论 | `通过 / 有条件通过 / 不通过` | 本步 §8.1~§8.3 的全局裁决 |

## 9. 最终验收包与固定入口

| 材料 | 固定路径 | 必须证明 | 缺失时 |
|---|---|---|---|
| run summary | `reports/runs/<run_id>/summary.md` | scope、baseline、overall raw-derived status | P0 不可裁决 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | EV、TC/DS、raw/report、AC/VF consumer pairing | P0 不可裁决 |
| gate results | `reports/runs/<run_id>/gate-results.md` | five gate aggregation、required cells、non-pass | 不得人工补 pass |
| report audit | `reports/runs/<run_id>/report-audit.md` | same-run provenance、digest、denominator、no static | evidence invalid |
| redaction check | `reports/runs/<run_id>/redaction-check.md` | forbidden body/secret/sensitive finding 未泄漏 | 直接阻断 |
| acceptance handoff | `reports/acceptance/handoff.md` | baseline、explicit run IDs、scope、未覆盖/失败/blocked 和 review refs | handoff 未完成，不能签署 |
| VETO checklist | `reports/acceptance/veto-checklist.md` | 13 VF 和过程 VETO 逐项状态与证据方向 | VETO 裁决不可用 |
| open issues | `reports/acceptance/open-issues.md` | defect、retest、blocked、dispute、residual、reopen | 不得隐藏 blocker |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 只列 eligible residual，含真实 acceptor/期限/后续动作 | 有条件通过不可用 |
| reviewer notes | `reports/review/reviewer-notes.md` | 人类审查范围、引用、争议和结论建议 | 不能伪造 review |
| agent review | `reports/review/agent-review.md` | 自动一致性审计和未决项，不代替人签署 | 只能作为辅助 |

所有路径必须引用显式 run ID；禁止 `latest`、隐式 current run、跨 run 拼接、静态 evidence 或手写 status 覆盖 raw-derived status。

## 10. 签署角色与责任合同

组织可以由同一人承担多个角色，但每个责任域必须被明确确认。实际姓名、时间、结论和签名在真实验收时填写，当前全部为空。

| 角色 | 必须确认 | 不得代表 |
|---|---|---|
| Owner / 产品或业务负责人 | 目标、范围、P0/P1/P2 业务影响、已接受 residual 与下一阶段影响 | 技术证据真实性、架构边界或他人风险接受 |
| 架构负责人 | capability identity/registry/descriptor/seam/relation/exposure 边界、truth ownership、依赖裁剪、VETO | runtime/tools execution、governance approval truth 或 provider cost 的所有权 |
| 测试负责人 | 189 TC/DS/EV、10 suites、638 pairs、checks、raw/report pairing、缺陷/复验和 evidence audit | 产品实现修复或最终风险接受 |
| 实施负责人 | 送验 source/build/config、实现范围、已知技术风险、follow-up 和 rollback/pause 事实 | 测试通过、架构批准或业务风险接受 |
| 运维/安全/合规负责人 | profile/entry、redaction、dependency、evidence access/retention policy、handoff 和运维 residual | 修改 Hub truth、替代治理 approval 或代替业务签署 |
| 验收负责人 | scope、baseline、P0/VETO、risk-acceptance、open issues、review refs 与最终结论一致 | 单独创造 evidence、替代专业签署或批量接受未列风险 |

### 10.1 Signoff record fields

| 字段 | 必填 | 约束 |
|---|---:|---|
| `role` | 是 | 受控角色值；不能只写姓名 |
| `person_or_account` | 是 | 实际授权主体；设计阶段为空 |
| `scope_confirmed` | 是 | 该角色核对的章节、gate、report 或 risk set |
| `baseline_refs` | 是 | source/delivery/config/data/run/report refs；必须显式 |
| `decision_value` | 是 | 维度或总体的三值结论；不能使用模糊词 |
| `open_issue_refs` | 是 | 明列未关闭或 `none` 的真实依据；不能空白默认无问题 |
| `risk_refs` | 是 | 已接受 residual 的 exact IDs，或 `none`；不能批量隐含接受 |
| `review_ref` | 是 | `reports/review/*` 或授权审查记录 |
| `signed_at` | 是 | 实际签署时间；设计阶段为空 |
| `signature_or_attestation` | 是 | 实际签署/认证；设计阶段为空 |

## 11. 签署含义与风险接受分离

| 签署类型 | 表示 | 不表示 |
|---|---|---|
| `通过` 签署 | P0 门禁、证据、VETO/S 检查满足阶段准入条件 | P1/P2/future 能力已完成，或 release 已自动通过 |
| `有条件通过` 签署 | P0 主线成立，列出的 residual 已逐项接受并有期限/后续动作 | VETO/S/P0-A、证据失败、责任泄漏可以被接受 |
| `不通过` 签署 | 本轮存在阻断或不可裁决证据，需要修复/复验 | 项目永久终止 |
| `risk acceptance` 签署 | 接受指定 residual 的影响、期限、owner 和 follow-up | 未列风险、VETO、S、P0-A 或其他 hard redline |
| 专业 review | 确认所审材料与引用一致，记录争议 | 修改 raw、升级 status、替代最终签署 |

风险接受签署必须与最终结论引用的 `risk_id` 集合完全一致；集合不一致时最终结论不可裁决。

## 12. 结论与签署真实性审计

| 审计项 | 设计结论 | 真实执行要求 |
|---|---|---|
| 结论值是否受控 | `3` 个最终值 | 报告解析器拒绝模糊词、空值伪 pass 和未知值 |
| P0/VETO/S/A 影响是否闭合 | `pass-designed` | 从 gate/evidence/defect/risk refs 反向校验，不接受手写汇总 |
| handoff 是否可追溯 | `pass-designed` | handoff 列出显式 run IDs、baseline、scope、缺口和 review refs |
| risk acceptance 是否逐项 | `pass-designed` | risk IDs、acceptor、期限、follow-up 与结论完全配对 |
| 签署是否真实 | `none claimed` | 必须有授权主体、时间、review ref 和签署 provenance |
| release 是否独立 | `pass-designed` | R4 只提供 release readiness，不自生 acceptance verdict |
| 旧材料是否回流 | `0` active mapping | source/static/report/config audit 发现旧对象/阈值/ID即阻断 |
| 当前项目事实 | `not_entered` | 不生成 commit、run、artifact、report、review、risk、verdict 或 signature |

## 13. 回填草稿：formal `06-验收标准.md` §14

> 校准来源：
> - `design-calibration/06_acceptance_step_14_final_decision_signoff.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“最终结论定义”“分层准入矩阵”“最终验收包与固定入口”“签署角色与责任合同”“签署含义与风险接受分离”和“结论与签署真实性审计”小节，了解正式 §14 的结论、阶段准入和签署字段来源。

正式 §14 只承载以下结论：

1. 最终总体结论只允许“通过”“有条件通过”“不通过”；缺 baseline、run、raw/report、evidence、review provenance 或设计 oracle 时，内部状态为暂停/不可裁决，不能映射为通过。
2. “通过”要求全部适用 P0 门禁、189 evidence contract instance、638 state pairs、required checks、VETO/S/P0-A 和 evidence/redaction/dependency/report audit 均满足；“有条件通过”还要求所有 residual 已由 Step 13 逐项真实接受；VETO、S、当前 P0 A、evidence hard failure 不得进入有条件通过。
3. Release preparation 必须另行满足 R2、required R3、R4 checks/report/handoff 和 review 条件；R4 不能自行生成 acceptance verdict。
4. `reports/acceptance/handoff.md`、`veto-checklist.md`、`open-issues.md`、必要时 `risk-acceptance.md` 与 `reports/review/*` 是固定交接入口；缺失或 provenance 不完整时不得签署。
5. 签署角色至少覆盖 Owner/业务、架构、测试、实施、运维/安全/合规和验收负责人；签署只确认责任域和结论一致性，不自动接受未列风险或越界职责。

## 14. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实签署人及授权账户 | 影响最终签署有效性 | 真实验收时填写；当前为空 |
| 组织是否合并运维、安全、合规角色 | 影响责任映射 | 可合并主体，但三类责任必须覆盖 |
| 某次 release 是否把 selected product 设为 required | 影响 R3/R4 和 release conclusion | 由 immutable release manifest 决定；当前不猜测 |
| review 系统和签名介质 | 影响 provenance | formal 07/operations preflight；不伪造工具或签名 |
| 是否存在 eligible residual | 影响是否生成 risk-acceptance report | 当前 `accepted=0`；只有真实 evidence 后才生成实例 |

## 15. Step 14 完成门禁与 Step 15 入口

| 进入下一步条件 | 结果 |
|---|---|
| 三值最终结论及禁止模糊词已固定 | `通过` |
| P0/VETO/S/P0-A/evidence 对结论的影响可判定 | `通过` |
| P0、selected、release、handoff 层级分离 | `通过` |
| 签署责任域、字段和表示/不表示边界完整 | `通过` |
| 风险接受不被最终签署批量覆盖 | `通过` |
| 固定 evidence/handoff/review 入口和真实性门禁完整 | `通过` |
| 当前真实 verdict、review、signoff、risk decision | `均不存在；未伪造` |
| unresolved upstream blocker | `0` |
| 下一步 | `enter_06_step_15_formal_document_assembly` |

Step 14 的 `accepted-design` 只表示最终结论和签署合同已经可执行，不表示当前项目已有验收结论、release readiness 或签署。
