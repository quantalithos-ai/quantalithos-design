# Step 13. 定义配置迁移、废弃与演进

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 13
> 回填章节：`04-配置设计.md` §13
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_13_migration_deprecation_evolution.md`
> 输入：Step 7～12、配置 SOP/书写规范
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与当前迁移判定

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 13 |
| current_module | `evolution:migration_deprecation_and_versioning` |
| gate_status | `pass_for_step_14` |
| gate_reason | 当前无已发布 schema/迁移项；schema/version、新增/废弃/移除/兼容/演进和历史污染拒绝规则已闭合；无 03 待回写。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_14_risks_open_questions.md` |

正式 04 尚未创建，目标实现仓不存在，也没有已发布 Runner config artifact/schema/baseline/用户配置。因此当前没有旧配置迁移项。README、旧正式文档与 draft 的 Tauri/Rust/Docker、固定数字、旧 `RunnerRun`/queue 等内容均不是 legacy config contract，不得为其保留 alias/兼容窗口。

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 是否有旧配置迁移？ | 无。当前 `runner-config/v1` 只是设计中的 initial schema literal，未声明已发布/实现/baseline。 |
| 新配置如何引入？ | 先有正式 authority/需求→判定 03 影响→回到 04 七域/来源/profile/items/sensitive/load/change/failure/downstream全链→更新05/06/07/09→再实施。 |
| 旧配置如何废弃？ | 只有真实已发布项才可 deprecated；须有替代项、明确兼容窗口 authority、redacted warning、迁移/rollback/downstream tests。 |
| 是否需要兼容窗口？ | 当前不需要。未来窗口必须由真实 release/consumer事实决定，不发明版本或天数。安全/VETO/unsupported control不提供成功兼容窗口，直接reject或design change。 |
| 何时允许移除？ | 所有正式消费者/环境artifact迁移，05/06负向门禁和09操作完成，rollback目标不再依赖旧key，authority批准后；removed key strict reject。 |

## 3. 当前迁移与状态定义

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | `runner-config/v1` 七域设计 schema | initial/unreleased | N/A | 首个正式配置合同；无runtime migration | N/A |
| README/draft 中技术、路径、env、数字、旧对象叙事 | 无 | rejected historical material | none | 不映射为key/profile/default/alias | 永久不得作为兼容输入 |
| 旧 `05/06` 配置方向 | 无 | historical only | none | 未来按新版04 full-restart承接 | 不进入loader schema |

| 状态 | 含义 | loader 行为 | 设计/测试要求 |
|---|---|---|---|
| `active` | 当前正式已发布项 | normal strict parse/validate | 04/05/06/07/09一致 |
| `introduced` | 已设计但受feature/profile/authority限制 | 显式optional/disabled或prerequisite reject | 03影响和下游覆盖完成 |
| `deprecated` | 已发布且有替代项，处兼容窗口 | 仅按正式mapping接受并产生redacted warning；不silent alias | migration/warning/rollback/ops evidence |
| `rejected` | 从未支持或违反安全/VETO | strict reject | negative test/acceptance veto |
| `removed` | 兼容窗口结束 | removed/unknown reject | removal/downstream/rollback closure |
| `design-change-required` | 会改变03/架构/安全/lifecycle | 不进入runtime schema | 先回03/04完整SOP |

## 4. 新配置引入、废弃与移除规则

| 顺序 | 新配置必须闭合 | 未闭合处理 |
|---:|---|---|
| 1 | formal requirement/authority/owner | 不引入 |
| 2 | 是否改变 runtime config/builder/port/DTO/error/flow/state/persistence | 是则先回写 03；不得由04静默新增 |
| 3 | 七域归属、分类、source/profile | 无归属/冲突则拒绝设计 |
| 4 | key/type/default/required/scope/effect/sensitivity/failure | 缺任一列不得进入07 |
| 5 | strict JSON demo与cross-field/VETO | 不可判定则不实施 |
| 6 | material/no-output/change/rollback | sensitive/high-risk未闭合不得发布 |
| 7 | fail-fast/degraded/recovery/no-replay | 不得silent fallback |
| 8 | 05/06/07/09承接及证据成熟度 | 未承接不得release |

| 阶段 | loader 行为 | 下游要求 | 退出条件 |
|---|---|---|---|
| announce deprecation | old key仅在正式mapping存在时接受，产生safe warning | 05 warning/mapping tests；09 migration notice | new key active且rollback plan完成 |
| compatibility window | old/new不能歧义并存；new明确优先规则需正式设计 | 06 migration gate；artifact inventory | formal usage evidence显示旧key清零 |
| rejection | old key变removed/rejected error | 05/06 negative gate；09 rollback target更新 | 所有approved documents已迁移 |
| removal | code/schema不再承认旧key；strict parser仍给safe removed issue | release notes/evidence index | 无consumer/rollback dependency |

规则：

- 当前 schema 不支持任何未声明 alias；正式 key 与 alias/旧 key并存视为歧义并 reject。
- deprecation warning只含 schema/key class/version/issue ref，不含 value、full ref、secret或body。
- 兼容转换不能把 URL/path/raw secret/private SDK body包装成 opaque ref，也不能将历史数字变默认。
- 已发布项不能无说明删除；本轮没有发布事实，因此也不伪造 migration evidence。

## 5. 演进候选与进入条件

| 候选 | 当前状态 | 进入条件 | 必须重开的设计 |
|---|---|---|---|
| real local-safe product provider | blocked | repo/language/shell/store/platform authority | 03 Step 3/4/7/11/14 + 04 profiles/items/load |
| integration/product positive bindings | blocked | RUN-UP-001~008 exact public seams闭合 | 03 adapters/protocol/flows + 04 binding/profile/validation |
| workload numeric policies/hard caps | authority-required | workload/security/platform/05/06 authority | 04 limits/validation + 05/06/09；不改owner truth |
| secret/provider/OS key store | design-change-candidate | security ownership、constructor/error/lifecycle闭合 | 03 builder/adapter/error/observability + 04 Step5/7～11 |
| remote config center/admin override | design-change-required | actor/authority/priority/audit/availability/rollback | 03 loader/port/lifecycle/concurrency + 04全链 |
| hot reload/online LKG | design-change-required | adapter/store swap、old/new snapshot、in-flight Job、rollback semantics | 03 builder/flow/concurrency/recovery + 04全链 |
| new runtime profile | design-change-candidate | 当前四值无法表达正式 posture | 03 config type/builder + 04/05/06/09 |
| platform-specific support profile | discouraged/design review | formal need无法由binding/readiness表达 | 架构/03/04；不可选择Sandbox private backend |
| planned Consumer positive path | blocked, not feature evolution | owner event envelope/order/dedup/readiness闭合 | 00～03 + 04；flag不能启用 |
| outbound event | out-of-scope/design change | formal requirement/owner/schema/transaction出现 | 00～03全链；不能由topic config产生 |
| formal Observability evidence/audit | owner-boundary change | L4 contract明确Runner角色 | 架构/03/04/05/06；local log仍非evidence |

## 6. 永久不兼容的内容

| 内容 | 演进处理 | 原因 |
|---|---|---|
| `latest/default/newest/tag/branch` mutable selection | reject | 破坏显式immutable version |
| local approval/baseline/revoke/expiry override | reject | 侵占Governance/Artifact truth |
| integrity/platform/signature bypass | reject | 安全VETO |
| state-axis合并、ACK=Running、Confirmed=Cleaned | reject | 破坏03状态语义 |
| Query write/refresh/reconcile switch | reject | no-write VETO |
| Unknown/commit-unknown auto replay | reject | duplicate side-effect risk |
| raw secret/body/path/PID/port/URL/private backend | reject | 安全/所有权/技术边界 |
| fake/in-memory product fallback | reject | 事实不诚实 |
| local log/report→evidence/verdict/signoff | reject | Observability truth边界 |
| private sibling DB/bus/package/backend | reject | SDK/public API与依赖裁剪红线 |

## 7. 演进审计、03 影响与门禁

| 审计项 | 结论 |
|---|---|
| 当前是否存在已发布schema/migration | no |
| initial schema是否被写成已实现/发布 | no |
| historical material是否成为legacy alias/default | no |
| introduce/deprecate/remove流程是否可判定 | pass |
| 兼容窗口是否被伪造 | no |
| security/VETO是否有成功兼容窗口 | no |
| future 03影响是否先回03 | yes |
| 是否要求同步05/06/07/09 | yes |

| 结论 | 是否影响 03 | 状态 |
|---|---|---|
| 当前initial/unreleased schema无迁移 | 否 | 无回写 |
| historical keys全部rejected | 否 | 无回写 |
| 表内future候选 | 未来触发时可能是 | 当前不进入schema，不构成`待回写`/`阻塞待确认` |

未来正式 §13 应明确当前无迁移项、initial schema未发布、历史材料非legacy，并保留状态/引入/废弃/演进/VETO表。

| 待确认事项 | 当前处理 |
|---|---|
| 首次真实schema/release/version authority | 等目标实现仓/07/09/正式release流程；不伪造版本/baseline |
| future兼容窗口与usage evidence | 等真实发布/consumer事实；当前N/A |

| 进入 Step 14 条件 | 结论 |
|---|---|
| 当前迁移判定和演进策略完整 | pass |
| 历史污染与永久VETO隔离 | pass |
| future候选不污染P0/current 03 | pass |
| 无当前 `待回写`/`阻塞待确认` 03 影响 | pass |

Step 13 完成，允许进入 Step 14；正式 04 仍不可写。
