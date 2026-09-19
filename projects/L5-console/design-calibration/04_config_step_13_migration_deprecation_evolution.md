# Step 13. 定义配置迁移、废弃与演进

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 13
> 回填章节：`04-配置设计.md` §13
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_13_migration_deprecation_evolution.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标与当前迁移判定

正式 `04-配置设计.md` 当前不存在，目标实现仓也不存在，没有已发布 Console runtime config schema、artifact、baseline或用户数据。因此当前 P0 没有旧配置迁移项。README、旧正式 `05/06` 中的 workspace/panel/provider/RBAC/store/threshold 表达是历史污染，不是可兼容的已发布配置合同。

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 是否有旧配置要迁移？ | 无。没有正式旧04、实现仓或发布schema。历史文字不得升级为legacy key。 |
| 新配置如何引入？ | 先说明需求/authority→判定是否影响03→更新04 schema/source/sensitive/validation/change/failure/downstream→更新05/06/07/09→实现。 |
| 如何废弃？ | 正式发布后才能进入deprecated；须给替代项、兼容窗口、warning/negative test和removal gate。当前没有可废弃项。 |
| 是否需兼容窗口？ | 当前不需要。未来已发布key才需按release authority定义，不能由本文发明版本/天数。 |
| 何时移除？ | 所有消费者迁移、05/06覆盖、09发布计划和当前authority批准后；removed key必须strict reject，不silent alias。 |

## 3. 当前迁移表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | 当前四域schema | initial | N/A | 首个正式配置合同，无runtime迁移 | N/A |
| README `Provider Contract`/RBAC/旧技术框架表达 | 无 | rejected historical material | 无 | 不映射为key/profile/binding | 永久不作为配置兼容输入 |
| 旧05/06 workspace store/panel/action history/fixed threshold | 无 | rejected historical material | 无 | 未来05/06 full-restart，不迁移 | 永久不进入配置schema |

## 4. 未来配置状态

| 状态 | 含义 | loader行为 | 设计/测试要求 |
|---|---|---|---|
| `active` | 当前正式项 | 正常strict parse/validate | 04/05/06/07/09一致 |
| `introduced` | 已设计、受profile/authority条件限制的新项 | 未满足前default disabled或明确reject | 必须有03影响判定和下游覆盖 |
| `deprecated` | 已发布且有替代项 | 兼容窗口内接受并安全warning；不得silent alias | migration tests/ops notice/rollback |
| `rejected` | 从未支持或违反边界 | strict reject | negative test + acceptance veto |
| `removed` | 兼容窗口结束 | unknown/removed reject | removal evidence（未来） |
| `design-change-required` | 会改变03/架构/安全/runtime lifecycle | 不进入runtime schema | 先回写设计再重新执行04 |

## 5. 新配置引入规则

| 顺序 | 必须回答 | 未满足处理 |
|---|---|---|
| 1 authority | 哪份正式需求/owner/host合同要求此项 | 不得引入 |
| 2 03影响 | 是否改config object、builder、Port/adapter、error、flow/state/lifecycle | 是则先回写03 |
| 3 控制面/分类 | 属于哪个功能域，是否startup/hot/sensitive | 无归属不得进入 |
| 4 schema | key/type/default/required/source/scope/effect/sensitivity/failure | 缺列不得实施 |
| 5 profile/cross-field | 哪些profile允许，与哪些slot/合同绑定 | 未闭合则disabled/reject |
| 6 sensitive/no-output | 是否引入endpoint/secret/ref/body风险 | 未闭合不得启用 |
| 7 change/rollback | 谁评审、如何audit/rollback | 高风险无rollback不得发布 |
| 8 downstream | 05/06/07/09如何承接 | 未承接不得release |

## 6. 废弃与移除规则

- 项目本地配置不支持未声明 alias；旧新key同时出现必须reject ambiguity。
- deprecated warning只能包含safe key class/version ref，不能回显value/ref/body。
- 兼容转换不得把raw secret/body、unknown owner、URL、route或SDK private shape包装成新值。
- 移除前必须证明下游消费者、test/acceptance/deployment docs均已迁移；本轮无此类证据。
- removed/rejected key一律strict reject，不能fallback default隐藏旧artifact。

## 7. 未来演进候选

| 候选 | 当前状态 | 进入条件 | 必须补的设计 |
|---|---|---|---|
| positive integration/production bindings | P1 blocked | exact owner/SDK slot/owner mapping与safe contracts闭合 | 03 adapter/protocol + 04 bindings/profile/validation |
| SDK invalidation true | P1 blocked | envelope/id/version/order/dedup正式合同 | 03 Step7/8/9/13 + 04 Step7/9/11 |
| production diagnostics true | P1 blocked | body-free envelope/sink/vocabulary/privacy合同 | 03 Step7/14/15 + 04 Step7～11 |
| configured state medium | design-change-required | medium/lifecycle/serialization/quota/TTL/migration/concurrency authority | 03 state Port/flow/error + 04全链 |
| host route/a11y config | design-change-required | framework/host/browser/a11y matrix闭合 | 03 object/Port/builder + 04 schema |
| secret/endpoint provider ref | design-change-required | formal security/host ownership与no-output合同 | 03 adapter constructor/error + 04 source/sensitive/failure |
| remote config/admin override | design-change-required | actor/capability/audit/priority/rollback模型 | 03 lifecycle/Port + 04 Step5/9/10/11 |
| hot reload/online LKG | design-change-required | adapter swap/state/concurrency/rollback语义 | 03 builder/flow/concurrency + 04全链 |
| quantitative thresholds | P2/authority-required | 产品/测试/运维正式场景/窗口/owner | 04 schema + 05/06/09，不作为readiness真相 |
| new runtime profile enum | design-change-required | 环境行为不能由现有三值表达 | 03 type/config/builder + 04/05/06 |

## 8. 禁止作为迁移兼容的内容

raw secret/credential/body；Provider Contract旧语义；owner private schema；RBAC/Policy/Gate复制；URL/DOM/browser storage config；implicit local-fake；fake进入production-pending；config-as-permission/readiness；state configured durability伪声明；query-write switch；command replay；invalidation direct bus/cursor；diagnostic audit/evidence；固定控制项数量、指标阈值或技术框架。

## 9. 迁移审计与03影响

| 审计项 | 结论 |
|---|---|
| 当前是否有已发布schema | no |
| 历史材料是否被误认legacy config | no |
| 新增/废弃/移除流程是否可判定 | pass |
| design-change-required是否先回03 | yes |
| alias/silent fallback是否允许 | no |
| 是否伪造兼容窗口/evidence | no |

| 配置结论 | 是否影响03 | 类型 | 回写位置 | 状态 |
|---|---|---|---|---|
| 当前initial schema无迁移 | 否 | 初始发布语义 | N/A | 无回写 |
| 历史材料全部rejected，不作alias | 否 | 污染隔离 | N/A | 无回写 |
| 表内design-change候选 | 是（仅未来触发） | 字段/Port/builder/flow/lifecycle | 对应03 Step | 当前不进入正式schema |

## 10. 回填、待确认与门禁

正式§13应明确当前无迁移项、历史材料非legacy schema，并给future状态/引入规则/演进候选；不能写虚构版本号或期限。

| 待确认 | 当前处理 |
|---|---|
| 首个实现/发布版本策略 | 等07/09/目标仓；当前不伪造 |
| future兼容窗口 | 等真实已发布schema与release authority |

| 进入Step14条件 | 结论 |
|---|---|
| 当前迁移状态明确 | pass（无迁移项） |
| future引入/废弃/移除规则明确 | pass |
| 历史污染隔离 | pass |
| 无当前03待回写 | pass |

Step 13 `done / pass / self_reviewed`；允许串行进入 Step 14。
