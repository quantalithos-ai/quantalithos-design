# Step 13. 定义风险接受与遗留项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 13  
> 回填章节：`06-验收标准.md` §13 风险接受与遗留项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 风险接受与遗留项 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | 正式 03 §17、04 §14、05 §14；06 Step 9、11、12 |
| 输出文件 | `design-calibration/06_acceptance_step_13_risk_acceptance.md` |
| 当前风险接受实例 | 0；`reports/acceptance/risk-acceptance.md` 不存在 |
| 下一动作 | 只允许进入 Step 14 |

## 2. 本步计划与事实边界

本步先区分“可成为有条件通过依据的 residual candidate”“必须保持 blocked 的未送验前置”和“绝对不可接受红线”，再为每个 Console residual 固定影响、候选接受理由、解锁动作、责任角色、接受角色与截止/触发条件，最后审计其是否可能覆盖 P0、VETO、S 或证据真实性。

本步不接受任何真实风险、不填写姓名/日期/issue ID、不创建实施计划或运维记录。表中角色与路径是 future contract；只有实际 fixed-run 证据、正式 follow-up ref 和具名接受人齐全后，单项记录才能由 `candidate` 变为 `accepted`。当前实际验收仍为 `not_entered / blocked_by_missing_baseline`。

## 3. 本步输入

| 输入 | 本步用途 |
|---|---|
| `03-详细设计.md` §17 | `CON-Q-034～047` 的精确阻塞范围与安全姿态 |
| `04-配置设计.md` §14 | empty/pending/false/disabled/session-volatile 的配置边界 |
| `05-测试方案.md` §14 | selected/future residual、全量回归触发和不可接受项 |
| Step 9 | 无 authority 的量化、compatibility 与 production diagnostic 不形成 verdict |
| Step 11 | `VETO-CON-001～007` 永不允许风险接受 |
| Step 12 | S/A/B/R、严格 A 接受条件和放行边界 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些风险可以支持有条件通过？ | 仅本轮 baseline 明确排除或保持 disabled/read-only/partial/blocked 的 positive facet、P1/P2 selected matrix、无正式数字 authority 的 sample、configured durability、production diagnostic binding、外围 link 和长期 retention 等 residual；且所有适用 P0 safety 已由合格证据证明。 |
| 哪些风险不能接受？ | 七项 VETO、任一 S、适用 P0 failed/blocked、访问/Policy/Gate 绕过、第二 truth/Query write、伪完成/replay、forbidden material、客户端推导 verdict/readiness、核心 a11y 失败、partition 误导、配置 silent fallback，以及证据造假/缺 pair/digest/run mismatch/伪 signoff。 |
| 每个风险的接受人是谁？ | 本文只固定接受角色；实际姓名必须在 `reports/acceptance/risk-acceptance.md` 逐项填写并签署。角色或姓名缺失均不能支持有条件通过。 |
| 后续动作和截止时间是什么？ | 每项必须有明确 action、owner、不可空的 absolute date 或可判定 trigger，以及升级/重开 03～06、07 实施项或运维/问题记录的真实 follow-up ref。 |
| 是否同步实施计划或问题记录？ | 是。实现/集成/测试事项应转未来正式 07 与实施台账，运行/保留事项转未来运维标准，外围合同转双方项目记录；这些文件/条目未创建前不得伪造 ref，也不得把 candidate 标成 accepted。 |

## 5. 当前文档问题诊断

| 旧问题 | 本步处理 |
|---|---|
| 旧 06 使用泛化风险描述且无接受人/证据/截止 | 建立稳定 `RES-CON-*` candidate 和完整字段合同；避免与 01 的架构 `RISK-CON-*` 语义碰撞 |
| “blocked positive”可能被理解为已接受缺口 | 区分 honest posture、candidate residual 与不可接受 enabled gap |
| 实现仓不存在可能被风险接受绕过 | 固定为送验前置 blocker，不是可接受 residual |
| 无数字 authority 容易回流旧 P95/SLA | 只允许记录 sample/residual，不写旧阈值或 pass |
| future 07/09/issue 尚不存在却要求 follow-up | 规定实际接受前必须创建真实 ref；当前保留 `not_created` |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| 风险集合 | 泛化开放项 | stable candidate ID + scope + posture + trigger |
| 接受 | “可后续处理” | evidence + owner + acceptor + deadline/trigger + follow-up ref |
| blocked facet | 容易被算作 pass | 只证明诚实安全姿态，不证明 positive capability |
| 不可接受项 | 分散 | VETO/S/P0/evidence integrity 集中禁用 |
| 当前状态 | 容易暗示已接受 | 统一 `candidate / not_accepted`，instance=0 |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| exact positive 合同缺失能否接受 | 只有 baseline 排除该 positive facet 且系统保持安全 disabled/read-only/partial/blocked 时，缺失本身才可作为 residual candidate；若声明 enabled，则不得接受，必须补合同与 positive evidence |
| 具体 browser/AT 未选能否通过核心 a11y | 可以把 selected compatibility 留为 residual，但 C1～C6 语义等价是 P0，失败不可接受 |
| 无硬阈值的 sample 超过旧数字是否失败 | 不据旧数字裁决；记录 sample 与 authority 缺口。正式 authority 一旦进入 baseline，按其阈值重验 |
| implementation repo/runner 不存在能否有条件通过 | 不能；它阻断进入验收，不能用 risk acceptance 把 `not_entered` 提升为 verdict |
| role placeholder 能否视为接受 | 不能；必须具名/可问责接受人、签署、日期与真实 follow-up ref |

## 8. 结构化中间产物

### 8.1 风险资格分层

| 分层 | 条件 | 能否支持有条件通过 |
|---|---|---|
| acceptable candidate | 不影响适用 P0 safety/truth/evidence；baseline 明确 excluded/conditional；安全姿态和影响有合格 evidence；字段完整并实际签署 | 可以，逐项 |
| baseline blocker | implementation/delivery/environment/fixed run 缺失，或 required facet 无 authority/contract/evidence | 不可以；保持 `not_entered` 或暂停 |
| non-acceptable | VETO/S/适用 P0 failure/evidence fraud 或任何越权/泄露/伪结论 | 不可以；必须修复并复验 |
| obsolete/closed | authority 到达并完成设计回写、实现、测试和验收复核 | 不再作为 residual；保留历史记录 |

### 8.2 Console residual candidate 登记表

以下均为 future candidate，不是当前接受记录；`当前状态` 一律 `candidate / not_accepted`。

| ID / 风险与遗留项 | 影响与候选接受理由 | 后续动作 | 责任角色 | 接受角色 | 截止 / 触发 | 当前状态 |
|---|---|---|---|---|---|---|
| `RES-CON-001` · `CON-Q-034` exact owner/SDK Query/Command/Result/Ref/activation | positive adapter、submit、active 无法证明；仅当相应 facet 未 enabled、P0 no-call/fail-closed 已证明时可候选接受 | 正式合同到达后重开 03/05/06，实施 adapter 并跑 owner-contract + full P0 | owner + SDK + Console 实施负责人 | 验收负责人 + 架构负责人 | facet 首次 enabled 前 | candidate / not_accepted |
| `RES-CON-002` · `CON-Q-035～037` scope/visibility/qualification/safe-field | positive disclosure/action/view 不完整；只在 minimum disclosure/restricted/blocked 且 protected call/body 为零时可候选接受 | authority 到达后回写映射，跑 contract/security/access suites | Identity、Policy/Gate、相应 owner | 安全/合规负责人 + 验收负责人 | 任一受保护 facet enabled 前 | candidate / not_accepted |
| `RES-CON-003` · `CON-Q-038` reconciliation/idempotency/dispatch | positive command/reconcile blocked；只有不 submit 或 formal contract 已排除该路径时可候选接受；enabled unknown replay 不可接受 | owner/SDK 固定 operation/key/result/reconcile boundary，回写 03/05/06 并跑 intent/consistency/full P0 | command owner + SDK | 架构负责人 + 验收负责人 | 首次启用 owner command 前 | candidate / not_accepted |
| `RES-CON-004` · `CON-Q-039～043` owner-specific seams | 八主题的部分 positive read/action/activation 不完整；per-owner pending/read-only/partial 可保真但不等 feature ready | 各 owner 合同停审后逐分区回写并跑 selected owner-contract；需要时全量 P0 | 对应 owner + SDK + Console | 产品负责人 + 验收负责人 | 对应 topic 声明 enabled 前 | candidate / not_accepted |
| `RES-CON-005` · invalidation envelope/order/dedup | observed/apply 正向无法证明；consumer 保持 disabled/zero-write 时不影响当前 safety | SDK 正式发布 envelope/order/dedup 后回写 03/04/05/06 并跑 concurrency/full P0 | SDK + Console | 架构负责人 + 验收负责人 | conditional consumer 首次启用前 | candidate / not_accepted |
| `RES-CON-006` · `CON-Q-044` state medium/TTL/migration/cross-session | 只保证 session-volatile，不能承诺 durable/cross-session；当前产品范围若接受 session-only 可保留 | 产品决定后先回写 03/04，再实现 migration/consistency 并复验 | 产品 + 架构 + 配置负责人 | 产品负责人 + 验收负责人 | 任何 durable/cross-session 声明前 | candidate / not_accepted |
| `RES-CON-007` · `CON-Q-045` quantitative authority | 无 latency/load/availability 数字 verdict；结构性 boundedness 与 sample 不等 SLO | 固定场景、数据量、环境、窗口、阈值、责任人并重新 baseline/测试 | 产品 + 架构 + 测试 + 运维 | 产品负责人 + 运维负责人 | 数字指标成为 release 条件前 | candidate / not_accepted |
| `RES-CON-008` · `CON-Q-046` selected browser/AT matrix | 已要求核心 semantic a11y，但未证明具体组合兼容；只有本轮未把 matrix 升级 required 时可候选接受 | 选定 matrix/environment，执行 `console-selected-browser-at` 并归档 EV | 产品 + 测试/a11y | 产品负责人 + 验收负责人 | 支持矩阵发布或对外承诺前 | candidate / not_accepted |
| `RES-CON-009` · `CON-Q-046` production diagnostic envelope/sink | disabled/body-free facade 不证明 production telemetry binding；不影响业务 truth | Observability/运维固定 envelope/sink/redaction 后回写配置并跑 selected/redaction | Observability + 运维 + Console | 安全/运维负责人 + 验收负责人 | production diagnostic enabled 前 | candidate / not_accepted |
| `RES-CON-010` · `CON-Q-047` 未停审 L5/L6 link/ref | peripheral deep-link 正向未覆盖；禁用且不进入主链时可候选接受 | 双方正式合同停审后回写 navigation/route，并跑相应 flow/a11y/security | 相邻项目维护者 + Console | 产品负责人 + 验收负责人 | link/deep-link 首次启用前 | candidate / not_accepted |
| `RES-CON-011` · evidence retention period/medium 未固定 | 当前只能要求保存至验收、复验和缺陷关闭；不能宣称长期合规保留 | 由运维/Archive/合规 authority 定义期限、介质、legal hold 与销毁规则并写入运维标准 | 运维 + Archive + 合规 | 合规负责人 + 验收负责人 | 首次正式送验前固定本轮最短期；production release 前固定长期规则 | candidate / not_accepted |

### 8.3 不可作为风险接受的 blocker / 红线

| 项 | 处理 |
|---|---|
| implementation repo、delivery ref、environment、config/data manifest、fixed run 不存在 | `not_entered / blocked_by_missing_baseline`；不能有条件通过 |
| baseline 声明 enabled/required 的 owner/SDK/browser/diagnostic/quantitative facet 缺合同或 positive evidence | 补齐或改回经 authority 批准的 disabled/excluded baseline；不能靠风险接受冒充 pass |
| `VETO-CON-001～007` 或任一 S | 总体不通过；修复、新 run、全量 P0；不可接受 |
| private boundary、第二 truth、Query write、Policy/Gate 绕过 | 必须修复；architecture/dependency/security 全量复验 |
| receipt/toast/cache/diagnostic 伪完成，unknown replay | 必须修复；intent/state/consistency 全量复验 |
| forbidden material 泄露或 minimum disclosure 失败 | 必须修复；redaction/security 全量复验 |
| UI/flag/固定数字/partial result 推导 approval、compliance、audit、capability、archive/runtime/readiness | 必须修复；不得通过措辞降级 |
| 核心 semantic a11y 失败、partition failure 扩散或被掩盖 | 必须修复；a11y/composition/recovery 全量复验 |
| config silent fallback/partial protected runtime/profile 冒充 ready | 必须修复；config/release 全量复验 |
| static evidence、run mismatch、缺 artifact/report pair/digest、删除失败 run、伪 signoff | 送验无效/S；重建证据链并复验 |

### 8.4 风险接受记录字段合同

固定入口为 `reports/acceptance/risk-acceptance.md`。每条记录必须包含：

| 字段 | 必填 | 规则 |
|---|---|---|
| `risk_id` / `review_version` | 是 | 稳定 ID 与本轮审查版本；不得复用覆盖旧结论 |
| `baseline_ref` / `scope` / `facet_posture` | 是 | 明确 included/excluded/conditional 与 enabled/disabled/read-only/partial/blocked |
| `impact` / `acceptance_reason` | 是 | 说明影响及为何不破坏适用 P0；禁止“后续再说” |
| `evidence_refs` | 是 | fixed-run EV/report/defect refs，证明 safety posture 与影响上限 |
| `owner` / `acceptor` | 是 | 具名或组织内唯一可问责标识；仅角色占位不够 |
| `follow_up_action` / `follow_up_ref` | 是 | 真实 issue、未来正式 07/implementation ledger 或运维/双方项目记录；不存在则不能接受 |
| `deadline_or_trigger` | 是 | 绝对日期或可机器/人工判定触发；不得只写“未来” |
| `status` / `decision_date` | 是 | `candidate/accepted/rejected/expired/closed`；当前无实例 |
| `signatures` | 是 | 接受人及验收负责人逐项确认；不由总体 signoff 自动推导 |

风险过期、baseline/scope/facet 变化、deadline/trigger 到达、关联 evidence/defect 失效或新信息触发 VETO/S 时，接受立即失效并回到 `decision_pending` 或“不通过”。

### 8.5 后续同步规则

| 风险类型 | Future 同步入口 | 当前事实 |
|---|---|---|
| 实现/adapter/state/tooling | 正式 `07-实施计划.md` + implementation ledger/boundary | 07 尚未授权/创建，不伪造 ref |
| 运行、diagnostic、retention、量化 | future 运维标准/runbook/issue | 尚无本项目正式运维 ref |
| owner/SDK 合同 | 相应上游正式文档/变更记录 | `CON-Q-034～043` 等仍 pending |
| 相邻 L5/L6 link | 双方正式文档与 issue | 未停审内容仍只作 pending |
| 缺陷 | future defect tracker + Step 12 closing evidence | 当前 defect instance=0 |

### 8.6 风险接受停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 candidate 是否有影响、理由、动作、角色和 trigger | pass | 11/11 candidate 已固定；均未接受 |
| enabled/required positive 缺口能否被接受 | no | 明确禁止 |
| VETO/S/P0/evidence integrity 是否可被覆盖 | no | §8.3 完整禁止 |
| role placeholder 是否被误写为真实接受人 | no | actual identity/signature 必需 |
| missing implementation baseline 是否被当 residual | no | baseline blocker，不是 conditional pass |
| follow-up 是否伪造 07/09/issue | no | 当前记录为 not_created，不填假 ref |
| 当前 acceptance instance | 0 | 全部 `candidate / not_accepted` |

## 9. 回填草稿

正式 §13 应写入风险资格分层、11 个 `RES-CON-*` candidate、不可接受清单、`risk-acceptance.md` 字段合同和失效/同步规则。正文必须明确：candidate 不是 accepted；当前没有具名接受人、fixed-run evidence 或 follow-up ref，不能形成有条件通过；implementation/baseline 缺失阻断进入验收，不能被风险接受绕过。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 实际 risk owner/acceptor identity | 有条件通过 | 正式送验逐项填写；当前不造姓名 |
| actual deadline 与 follow-up ref | 风险可执行性 | 未创建前保持 candidate |
| retention 期限/介质 | 长期复验与合规 | `RES-CON-011`；不发明数字 |
| selected facets 的本轮 required 集合 | 风险资格 | 必须由 Step 3 baseline manifest 固定 |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 所有已知 residual 有 candidate 或 blocker 口径 | pass |
| 不可接受边界完整且不覆盖 VETO/S | pass |
| 接受字段、失效和同步规则可判定 | pass |
| 当前无伪造 risk acceptance | pass；instance=0 |
| 允许进入 Step 14 | yes |
| 允许修改正式 06 | no |
