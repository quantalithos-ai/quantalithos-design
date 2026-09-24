# Step 14. 定义最终结论与签署口径

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 14  
> 回填章节：`06-验收标准.md` §14 最终结论与签署  
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与事实边界

| 项 | 当前值 |
|---|---|
| current_document | `06-验收标准.md` |
| current_step | Step 14 |
| current_module | `final_decision_signoff:lifecycle_three_value_tier_roles_archive` |
| gate_status | `pass_for_step_15` |
| acceptance_lifecycle | `not_entered / blocked_by_missing_baseline` |
| allowed_verdict_values | `通过 / 有条件通过 / 不通过` |
| actual_verdict | `none` |
| actual_signatures | 0 |
| formal_06_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建 Step 15，并 full-restart 装配正式 06 |

本文只固定未来如何决定与签署。`not_entered`、`entered`、`decision_pending`、`suspended` 是生命周期状态，不是第四种 verdict；当前没有 baseline、run、evidence、risk acceptance 或 signer，因此不得填写三值中的任何一项。

## 2. 输入、目标与非目标

| 输入 | 用途 |
|---|---|
| Step 2～4 | target tier、范围、baseline、entry/exit 和 lifecycle |
| Step 5～10 | AC、横切门禁和证据完整性实际分母 |
| Step 11～13 | VETO、缺陷/复验、风险接受 eligibility |
| 书写规范 §4.2/§5.14 | 三值结论、角色签署与归档结构 |

目标是固定 verdict 判定矩阵、target-tier 上限、下一阶段/发布准备含义、签署角色与版本一致性。非目标是指定实际姓名、日期、组织、生产上线窗口或 readiness，也不授权任何角色替其他 owner 签署 truth。

## 3. SOP 问题回答

| 问题 | 收口答案 |
|---|---|
| 结论只能有哪些取值？ | `通过 / 有条件通过 / 不通过`。不能使用“基本通过/原则上通过/暂缓通过/设计通过”。未进入或材料不足保留 lifecycle/blocker，不强造 verdict。 |
| 何时允许进入下一阶段？ | 验收合法进入并完成；target-tier required P0/VETO/evidence/defect/risk/signoff 满足对应三值条件；下游只在结论明示允许的 scope/tier 内推进。 |
| 何时允许发布准备？ | 只有 target tier 至少为相应 release/acceptance baseline 且 T4 required 条件成立、签署完整时；T1/T2/T3 通过不自动授权发布准备。 |
| 哪些角色签署？ | 最小角色类别为 acceptance authority、product/scope、architecture/security、test/evidence、operations/release；dependency/owner role 按 baseline 适用。具体角色名和人数由 GRC authority 确认。 |
| 签署是否代表风险接受？ | 否。风险接受是 Step 13 的逐项授权决定；最终签署只确认其已合法存在、scope 一致且被纳入 verdict，不会自动接受未列风险。 |

## 4. 生命周期与 verdict 分离

| Lifecycle | 含义 | 是否允许 verdict |
|---|---|---|
| `not_entered` | baseline/entry 未满足；当前状态 | 否；记录 blocker，不得填“不通过”冒充已验收 |
| `entered` | baseline、fixed run、交接与执行已合法建立 | 否；等待门禁和证据完成 |
| `decision_pending` | required item 已有实际状态，正在 review/风险/签署 | 否；不能用 pending 当条件通过 |
| `suspended` | 新 VETO/S、证据争议、baseline invalid 或安全处置暂停 | 已有 verdict 必须标失效/重开；新 verdict 暂停 |
| `decided` | 同一 decision package 完成三值裁决与 required signoff | 是；只允许三值之一 |

### 4.1 Decision package identity

最终结论必须绑定：`decision_version`、target tier、scope/baseline ref、fixed run + evidence index digest、gate/VETO/defect/risk/handoff/review versions、required signer set 和 decision time。任一 source 被 supersede/invalidated 时，旧 verdict 不自动延续。

## 5. 三值 verdict 判定矩阵

| 判定维度 | `通过` | `有条件通过` | `不通过` |
|---|---|---|---|
| target-tier required AC/NFR/protocol/state gates | 全部 passed | P0 主线全部 passed；仅 eligible residual 不改写 raw status | 任一 required failed，或 required blocked/not_run/incomplete 且已进入裁决 |
| VETO | 12/12 真实 clear | 12/12 真实 clear | 任一 hit；或 required check 后仍 disputed/not clear |
| 缺陷 | S=0，A=0；B/R 已透明登记 | S=0；仅合法 accepted A/B/R，且 A 不触 P0/VETO | 开放 S；未接受 A；修复未复验；争议阻断 |
| evidence/report | fixed-run pair/check/index/detail/handoff/review 完整 | 同“通过”，风险记录同版本完整 | 静态/跨 run/缺 pair、check failed/unavailable、未审查/造假 |
| 风险 | 无影响放行的未接受 residual | 每项 eligibility、owner、acceptor、deadline/trigger、action、evidence 完整 | VETO/S/P0 被接受；缺 acceptor/期限/权限；记录失效 |
| signoff | required set 全部同意当前 decision package | required set 全部同意当前 package 与条件 | required signer 拒绝、缺失、scope/version 不一致；或 VETO 使签署无权覆盖 |
| 后续权限 | 仅允许 decision 明示 tier/scope 的下一阶段；不自动 production-ready | 仅允许附带条件和暂停 trigger 的范围；过期即失效 | 不得进入被阻断阶段；修复后新 run/decision |

## 6. Target-tier 裁决上限

| Target tier | 最多可声称 | 必需边界 | 禁止升级 |
|---|---|---|---|
| `T1-SEMANTIC-P0` | Runner-owned semantic safety 在选定代码/合同范围内 | semantic suites/checks/EV、所有安全零副作用 | 不代表真实 owner integration、产品体验、release 或 production readiness |
| `T2-CONTROLLED-INTEGRATION` | baseline enabled slot 的受控真实集成 | 正式 public contract、真实 owner/platform environment、正负/Unknown/cleanup evidence | 未启用或 fake slot 不贡献 positive；单 slot 不代表全链 |
| `T3-PRODUCT-REHEARSAL` | 选定平台/产品式环境 rehearsal | T1/T2 + approved environment、selected platform、主链/cleanup/redaction/UX（若 required） | profile 名、PID/port、局部成功不等 product/release ready |
| `T4-RELEASE/ACCEPTANCE` | 对固定 release candidate 的验收 verdict | T1～T3适用项、release evidence、VETO、risk、GRC signoff、authority-defined SLO | verdict 仍只授权明示下一阶段；不自动等于生产上线 |

当前因 `RUN-DDD-*`、`RUN-UP-*`、`RUN-OPS-*` 和缺 baseline/fixed run，任何 tier 的实际 verdict 都未进入；文档完成不会改变这一事实。

## 7. 签署角色、责任与权限边界

| Role category | 签署确认 | 不代表/不得覆盖 | 适用性 |
|---|---|---|---|
| Acceptance authority | decision package 完整、三值符合门禁、允许的下一阶段明确 | 不自行创造 evidence 或代替 risk acceptor | 所有 final decision required |
| Product/scope authority | scope、用户影响、P1/P2 与 accepted residual 的业务边界 | 不覆盖安全、owner truth 或技术 evidence | T3/T4 required；其他按 baseline |
| Architecture/security authority | dependency/truth/redaction/config/recovery/VETO 清除 | 不能接受 VETO/S 或替 owner truth 签字 | 所有有安全/架构影响的 tier required |
| Test/evidence authority | fixed run、TC/suite/EV/check/report 分母和 review 完整 | 不把 blocked/failed 改 pass，不决定业务风险 | 所有 tier required |
| Operations/release authority | environment、monitoring、rollback/stop trigger、release/GRC 条件 | 不把 T1/T2 变 production-ready | T3/T4 或 baseline required |
| Dependency/owner authority | 正式 contract/version/owner result 或 residual scope | Runner 不得代签 Artifact/Governance/Sandbox/Runtime/Observability truth | baseline 启用相关 slot 时 required |

签署记录未来至少包含 role、signer identity、authority ref、decision（approve/reject）、scope/tier、decision package digest/version、time、comments/conditions ref。当前这些字段全部不得填写虚构值。

## 8. 签署与风险接受关系

1. 风险 record 先逐项满足 Step 13 并由有权 acceptor 决定；final signer 只核对引用与 scope。
2. final `approve` 不会隐式接受未列风险；风险表新增/变更会使 package version 变化，需重新签署。
3. signer 的 `reject`、权限不明、scope 不一致或签署缺失使 decision pending/不通过，不能用多数票替代 required role。
4. VETO/S 不受任何签署或风险接受覆盖；试图覆盖视为 `VETO-RUN-012` 候选。
5. 签署不反写 RunnerRun、Release、Governance、Sandbox、Observability 或测试 raw truth。

## 9. 决策、归档与重开

| 事件 | 处理 |
|---|---|
| evidence/run/baseline superseded 或 invalidated | 旧 verdict 标失效，不修改旧 package；建立新 decision version |
| accepted risk 过期/撤销/trigger 命中 | 暂停条件通过权限，lifecycle 转 suspended/重开 |
| 新 S/VETO、安全 incident、owner revoke | 立即停止依赖 verdict 的推进，保留 package 并重新验收 |
| scope/tier/platform/release candidate 改变 | 不能沿用旧签署；重建 baseline、required denominator 和 signer set |
| 仅修正文档排版且语义/source digest 不变 | 可形成文档修订记录；不得借此更改 verdict |
| decision package 完成 | 归档 handoff、VETO、risk、open issues、review、signoff refs；retention 由正式 authority 决定 |

## 10. 当前签署模板状态

正式文档可定义字段模板，但不能放置看似真实的空签字行或虚构 identity。当前状态表只表达“未进入”。

| 维度 | 当前状态 | 原因 |
|---|---|---|
| lifecycle | `not_entered / blocked_by_missing_baseline` | 无实现、baseline、fixed run、evidence package |
| target tier | `not_fixed_for_actual_acceptance` | 四 tier 只是 future contract |
| verdict | `none` | 不满足 decided 前提 |
| risk acceptance | `none` | 候选 blocker 均未接受 |
| required signer set | `unresolved_pending_GRC_baseline` | `RUN-OPS-002` |
| signatures | `0` | 禁止伪造姓名、日期或 signoff |
| readiness | `not_asserted` | verdict/文档/profile 均不等 readiness |

## 11. 最终结论与签署跨审计

| 审计项 | 结论 | 处理 |
|---|---|---|
| lifecycle 是否被当 verdict | no | 当前 not_entered，无第四种 verdict |
| 三值是否穷尽且无模糊词 | pass | 只允许通过/有条件通过/不通过 |
| tier 是否可能无证据升级 | no | §6 固定各层上限和 required positive |
| 有条件通过是否可覆盖 VETO/P0 | no | Step 11/13 与矩阵双重禁止 |
| signoff 是否自动接受风险 | no | 逐项 risk decision 在先，package version 一致 |
| 多数票是否可绕 required role | no | required signer set 全部需有效决策 |
| verdict 是否等 production readiness | no | 只授权明示 scope/tier/next stage |
| 当前是否伪造 verdict/signoff | pass | verdict none、signature 0、readiness not_asserted |

## 12. 回填草稿、blocker 与下一步

正式 §14 应保留 lifecycle/verdict 分离、decision identity、三值矩阵、tier 上限、角色与风险分离、归档重开和当前未进入状态。不得填写 signer 名称、日期、decision digest、三值结论或 readiness。

| blocker | 对最终决定的影响 |
|---|---|
| `RUN-UP-001~008` | T2～T4 enabled integration 与 owner signoff/refs 未闭合 |
| `RUN-DDD-001~003` | 无实际交付、测试、fixed run 或 evidence |
| `RUN-OPS-001~002` | SLO/GRC/environment/signer authority 未闭合 |
| `RUN-DOC-002~003` | 正式 06/07 尚待按序完成；文档完成也不生成 verdict |

- [x] 三值 verdict、lifecycle 与 target tier 已明确分离。
- [x] 通过/有条件通过/不通过条件均可判定。
- [x] required signer role、权限、风险接受和 owner truth 边界清楚。
- [x] 决策包身份、失效、归档与重开规则完整。
- [x] 当前 verdict/signature/readiness 均未伪造。
- [x] 允许进入 Step 15 正式装配。
