# Step 14. 定义最终结论与签署口径

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 14  
> 回填章节：`06-验收标准.md` §14 最终结论与签署

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 14 最终结论与签署口径 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | Step 3～13；`standards/document/验收标准书写规范.md` 三值规则 |
| 输出文件 | `design-calibration/06_acceptance_step_14_final_decision_signoff.md` |
| 当前验收结论 / 签署 | 均不存在；生命周期为 `not_entered / blocked_by_missing_baseline` |
| 下一动作 | 只允许进入 Step 15 装配与总审计 |

## 2. 本步计划与事实边界

本步先把验收生命周期与三值 verdict 分离，再定义功能、非功能、发布准备、总体结论和下一阶段五个裁决维度；随后固定三值判定矩阵、逐角色签署责任、风险接受与签署的边界，以及既有决定的失效规则。

本步只设计 future decision/signoff contract，不填写真实姓名、日期、结论、签名或 readiness。文档校准完成后的 `formal_stop_review` 不是验收 verdict；当前缺少实现/交付/运行/证据基线，只能保持 `not_entered`，不能为了填表写“不通过”。

## 3. 本步输入

| 输入 | 本步用途 |
|---|---|
| Step 3 | design/delivery/environment/config/facet/run/review baseline |
| Step 4 | `not_entered / entered / decision_pending / decided` 与进出条件 |
| Step 5～9 | 功能、红线、接口、状态和 NFR 门禁 |
| Step 10 | 八 EV family、报告/handoff 与证据资格 |
| Step 11 | 七项 VETO；任一命中总体不通过 |
| Step 12 | S/A/B/R、复验、关闭和放行条件 |
| Step 13 | risk candidate、接受字段和失效条件 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 结论只能有哪些取值？ | 验收进入并可裁决后只允许“通过 / 有条件通过 / 不通过”；禁止“基本通过 / 原则上通过 / 大体没问题 / 后补”。进入前使用生命周期状态，不滥用 verdict。 |
| 何时允许进入下一阶段？ | “通过”可进入；“有条件通过”仅按逐项已接受风险及 deadline/trigger 有条件进入；“不通过”不可进入。当前 `not_entered` 也不可进入实现后发布流程，但不阻止文档链按用户授权进入未来 07 设计。 |
| 何时允许发布准备？ | 只有 fixed baseline 下全部适用 P0 通过、VETO 未命中、S=0、证据/缺陷/风险/签署完整，且发布准备本身处于本轮 scope 时，才可为“通过”或受严格条件约束的“有条件通过”。这仍不等于 production readiness 或部署批准。 |
| 哪些角色必须签署？ | 产品/业务验收负责人、Console 架构负责人、测试/证据负责人、实施/交付负责人、安全/合规负责人、运维/发布负责人，以及最终验收裁决负责人；可由同一具名人兼任多个角色，但每个责任栏必须独立确认。 |
| 签署是否代表风险接受？ | 否。风险必须在 `risk-acceptance.md` 逐项由 acceptor 签署；总体签署只确认其清单、证据和裁决一致，不自动接受遗漏或未知风险。 |

## 5. 当前文档问题诊断

| 旧问题 | 本步处理 |
|---|---|
| 旧 06 的空签署表可能被误当作待填通过 | 明确 lifecycle、instance、review version 与禁止预填 |
| “发布准备”可能被理解成 production readiness | 只作为本轮验收维度，明确不等部署/生产批准 |
| 签署与风险接受混同 | 风险逐项接受，总体签署只核对清单 |
| evidence release report 可能自动生成 verdict | 明确 `EV-RELEASE-001` 只证明证据链，不写 verdict/signoff |
| 当前缺 baseline 时被迫三选一 | 使用 `not_entered`，三值只在 entered 且可裁决后适用 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 当前状态 | 易混入“待验收/待评审”结论 | 生命周期与 verdict 分离 |
| 结论 | 可能模糊或自动生成 | 五维三值、人工/Agent review 后正式裁决 |
| 签署 | 泛化角色 | 七项责任、逐栏确认、可兼任但不可省略 |
| 风险 | 总体签名隐含接受 | 单项 acceptor 签署 + 总体清单一致性 |
| readiness | 易由 release/profile 推导 | 明确不自动推导 production readiness |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| `not_entered` 是否第四种 verdict | 否；它是生命周期状态，三值 verdict 尚未产生 |
| 是否允许某一维度通过而总体有条件通过 | 可以，但全部适用 P0 仍必须通过；只有已接受 residual 可使总体为有条件通过 |
| 功能通过可否抵消 NFR/VETO 失败 | 不可；各维度不可相互抵消，任一适用 P0/VETO/S 失败使总体不通过 |
| 同一人能否兼任签署角色 | 可以，但每项责任、结论和日期必须独立可审计；不得用一个签名抹平职责 |
| 自动报告能否写 signoff | 不可；脚本只能生成 draft/facts，最终裁决必须由授权角色审查确认 |

## 8. 结构化中间产物

### 8.1 生命周期到裁决门禁

| 生命周期 | 可填写 verdict | 所需动作 |
|---|---|---|
| `not_entered` | 否 | 补齐 Step 3/4 baseline 与 entry conditions |
| `entered` | 否 | 执行/审查门禁、缺陷、VETO、风险和证据 |
| `decision_pending` | 否 | 完成五维结论草案、风险接受与必需签署 |
| `decided` | 是，且只能三值 | 固定 acceptance instance/review version、verdict、签署和 refs |

当前实际行：`not_entered / blocked_by_missing_baseline`。因此下列表格是 future 判定合同，不包含本轮实际 verdict。

### 8.2 五维最终结论表合同

| 维度 | 允许值 | “通过”条件 | “有条件通过”条件 | “不通过”条件 |
|---|---|---|---|---|
| 功能验收 | 三值 | 全部适用 `AC-CON`/`AC-FR`、接口/状态/红线 P0 通过；enabled positive 有 contract-derived evidence | P0 全过，仅有逐项接受的非 P0/A-limited/B/R residual | 任一适用 P0 fail/blocked、VETO 或 S |
| 非功能验收 | 三值 | `AC-NFR-001～007` 适用 required 项通过；selected 未要求或已通过 | semantic/structural P0 全过，仅 selected/量化/production residual 已接受 | 任一适用 P0 NFR、核心 a11y/security/evidence integrity 失败 |
| 发布准备 | 三值 | release-required suites/checks/evidence/handoff/defect/risk 完整，scope authority 明确 | 全部硬门禁通过，仅不影响发布安全的 residual 已接受 | delivery/run/report 缺失，release gate/证据/配置/依赖失败，或 scope 未固定 |
| 总体结论 | 三值 | 前三维通过；VETO 未命中；S/A=0；风险/签署完整 | 全部适用 P0 通过；VETO/S=0；只有逐项 accepted residual | 任一维度不通过、VETO/S、未接受 A、证据不可裁决 |
| 是否允许进入下一阶段 | `是 / 有条件 / 否` | 总体通过 | 总体有条件通过，且动作/trigger 未禁止进入 | 总体不通过或尚未 `decided` |

### 8.3 总体三值判定矩阵

| 条件 | 通过 | 有条件通过 | 不通过 |
|---|---|---|---|
| 验收生命周期 | `decided` | `decided` | `decided`；若未进入则尚无 verdict |
| 适用 P0 AC/gates | 全部 passed | 全部 passed | 任一 failed/blocked/无资格证据 |
| `VETO-CON-001～007` | 7/7 真实检查未命中 | 7/7 真实检查未命中 | 任一命中 |
| S | 0 | 0 | >0 |
| A | 0 | 仅严格限定且逐项 accepted | 未接受或触碰 P0/truth/safety/evidence |
| B/R | 0，或已关闭且不影响 | 逐项 accepted，字段/签署/trigger 完整 | 影响结论但未接受/过期 |
| evidence integrity | fixed-run pair/digest/review 完整 | 同左 | 缺失、伪造、mismatch、static pass |
| enabled conditional facets | positive evidence 完整 | positive evidence 完整；其他 excluded residual 可接受 | 缺 exact contract/evidence 或被 fake 冒充 |
| signoff | 全部 required 角色一致签署 | 全部 required 角色一致签署且引用 accepted risks | 缺签、冲突、过期或伪签 |

### 8.4 签署责任表

固定入口：`reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` 与 future final-decision/signoff record。姓名、结论和日期均在实际验收填写。

| 角色 | 必须确认的责任 | 不表示 |
|---|---|---|
| 产品 / 业务验收负责人 | 范围、enabled/excluded facets、管理者主线与业务 residual | 不授予权限、不替 owner 认定 truth |
| Console 架构负责人 | SDK-only、ownership、5+16+1/0/0、依赖/状态/配置红线和 VETO | 不证明测试已执行 |
| 测试 / 证据负责人 | P0 manifest、96 TC 适用集、suite/check、EV、pair/digest、缺陷与复验 | 不自动给出业务 verdict |
| 实施 / 交付负责人 | implementation/delivery refs、实现范围、配置与依赖基线一致 | 不声明 deployment/production ready |
| 安全 / 合规负责人 | access/minimum disclosure、redaction、证据完整性、核心 a11y 与合规 residual | 不接受未列风险 |
| 运维 / 发布负责人 | environment/profile、release gate、diagnostic/retention residual 与 handoff 可执行性 | 不把 `production-pending` 当 readiness |
| 最终验收裁决负责人 | 五维结论、VETO、defect、risk review version 与全部签署一致 | 不覆盖任何角色异议或缺失证据 |

实际记录至少包含：`acceptance_instance_id`、`review_version`、`baseline_ref`、`run_id`、五维结论、理由、evidence/handoff/VETO/risk/defect refs、每个角色的唯一身份/结论/日期/签名，以及决定失效条件。一个人可兼任，但不能省略责任栏。

### 8.5 签署、风险接受与 readiness 边界

| 对象 | 表示 | 不表示 |
|---|---|---|
| “通过”签署 | 本轮固定范围内 P0 与证据满足进入下一阶段条件 | P1/P2/future、未启用 owner positive 或 production readiness 已完成 |
| “有条件通过”签署 | P0 全部成立，明确 residual 已逐项接受并受 trigger/deadline 约束 | VETO/S/required positive 缺口可被接受 |
| “不通过”签署 | 已进入验收且存在可定位阻断，需要修复后新 run 复验 | 项目终止或永久否定 |
| risk acceptance 签署 | 指定 residual 的影响、理由和后续动作被指定 acceptor 接受 | 接受未列/未知风险或总体通过 |
| release report / `EV-RELEASE-001` | release evidence chain 完整性与对应 gate 事实 | verdict、signoff、deployment approval、production readiness |
| 文档 `formal_stop_review` | 06 的设计合同已完成停审 | 当前交付已进入或通过验收 |

### 8.6 决定失效与重开规则

以下任一发生时，既有结论不得静默沿用：design/delivery/config/dependency/facet baseline 变化；新 VETO/S；accepted risk 过期或 trigger 到达；evidence digest/pairing/review 失效；关键 owner/SDK contract 改变；签署撤回或角色冲突。必须创建新 review version，按影响决定新 run/复验，并重新进入 `entered` 或 `decision_pending`；旧决定和失败证据保留。

### 8.7 最终结论停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| lifecycle 是否与 verdict 分离 | pass | `not_entered` 不是第四值 |
| 是否只允许三值且禁止模糊措辞 | pass | 五维矩阵均闭合 |
| P0/VETO/S/evidence 是否可被条件通过覆盖 | no | 明确禁止 |
| 签署角色是否覆盖产品/架构/测试/实施/安全/运维/裁决 | pass | 7 个责任栏，可兼任不可省略 |
| signoff 是否自动接受风险 | no | risk acceptance 逐项独立 |
| release/readiness 是否混同 | no | release evidence 与 production readiness 分离 |
| 当前是否伪造 verdict/signoff | no | 均不存在；实际 `not_entered` |

## 9. 回填草稿

正式 §14 应先声明当前生命周期与无实际 verdict，再给出五维结论合同、总体三值矩阵、七角色责任表、签署/风险/readiness 边界和决定失效规则。不得预填“通过”“不通过”、姓名、日期或 signoff；不得把文档停审、profile、release report 或 EV 解释为 readiness。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| actual acceptance instance/review version | 决定归档 | 送验时创建，不伪造 |
| 真实签署人及角色兼任关系 | signoff 完整性 | 实际验收填写，每项责任独立 |
| 是否需要额外外部监管签署 | 合规 release | authority 到达后追加，但不删除本表责任 |
| production readiness / deployment approval authority | 发布后续 | 不属于 06 自动结论，未来正式运维/发布边界确认 |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 三值结论和五维判定完整 | pass |
| 签署责任、风险与 readiness 边界完整 | pass |
| 当前事实诚实且无预填结论 | pass |
| 允许进入 Step 15 总审计与装配 | yes |
| 当前 verdict / signoff | none / none |
| 允许立即写正式 06 | no；须先完成 Step 15 assembly 中间产物和跨门禁总审计 |
