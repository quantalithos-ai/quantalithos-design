# Step 13. 定义配置迁移、废弃与演进

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 13
> 正式回填：`04-配置设计.md` §13
> 状态：`completed / pass_with_upstream_blockers / stop_review`（连续授权下进入 Step 14）

## 1. Step 状态、输入与边界

| 项 | 结论 |
|---|---|
| 当前 Step | Step 13：配置迁移、废弃与演进 |
| 输入 | Step 7 配置清单、Step 8～11 安全/加载/变更/失效规则、Step 12 下游承接、03 的 version/compatibility/pinned identity 契约 |
| 输出 | 当前迁移结论、版本轴、引入/废弃/移除规则、兼容矩阵、future evolution gate 和跨迁移审计 |
| 当前发布事实 | 尚无当前标准下已发布的正式 L4-archive runtime 配置 schema 或部署基线；旧 README/05/06/draft 不构成迁移来源 |
| 版本分离 | `schema_revision` 定义可解析形状；`config_revision` 定义 candidate/assembly identity；binding/provider/owner/schema/Bundle/record version 各自独立，不可互换 |
| 本步不做 | 不固定版本号格式、release train、迁移工具、脚本路径、provider、算法、数据库迁移或 compatibility 成功 |
| 下一动作 | 同步 flow/台账后进入 Step 14 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 是否存在旧配置需要迁移？ | 当前无。尚未发布当前标准下的正式 04/runtime config schema；历史 README、旧 05/06 和 draft 只是 historical material，禁止为其保留 alias 或隐式兼容。 |
| 新配置如何引入？ | 先确认需求/owner 与禁止配置化边界，再补 type/default/required/source/scope/activation/sensitivity/failure/change/downstream 全链；若改变 runtime config、builder、adapter constructor、port、error、DTO、state 或 flow，先回写 03。设计未闭合不得进入 07 或实现。 |
| 旧配置如何废弃？ | 已发布 key 必须经过 `active → deprecated → rejected/removed` 的显式路径；兼容窗口内旧 key 的映射和冲突必须可判定，不能 silent fallback。敏感 ref 只记录 redacted revision/category。 |
| 是否需要兼容窗口？ | 首版当前无窗口。未来已发布 key 的重命名/替换必须给版本/时间或发布边界、loader 行为、审计、测试、回滚和移除条件；安全红线、raw secret、未知 key、P0 unsupported source/activation 不提供成功兼容窗口。 |
| 何时允许移除旧配置？ | 只有 window 已结束、所有受支持 profile 迁移、正式 05/06 证据与门禁通过、07/09 更新、rollback target 不依赖旧 key、旧 work 的 pinned identity 仍可解释且不要求 current loader 重建时才可移除。 |

## 3. 当前材料问题诊断与取舍

| 发现 | 风险 | 本步裁定 |
|---|---|---|
| 历史文档含 provider、7 年、旧状态/key 语义 | 若做 alias 会让污染永久进入 schema | 不建立历史 alias；旧材料不是已发布配置 |
| `schema_revision`、`config_revision` 与多种业务 version 并存 | 实现者可能用一个“version”解决所有兼容性 | 建立版本轴矩阵，禁止跨轴比较、迁移或替代 |
| operation/cursor/Bundle digest codec 尚未闭合 | schema 演进可能重算持久 key/游标/摘要 | 旧 work 使用 pinned identity；没有正式 decoder/mapping 时保持 blocked，不重算 |
| profile/adapter 新能力可能需要新代码合同 | 只改 JSON 会静默新增 builder/port | future capability 必须走 03/04 重校准门禁 |
| remote/hot/admin/LKG 看似可用“兼容 key”预留 | parser 接受即形成未设计 runtime 行为 | P0 遇到这些 key 直接 reject，不预留 ignored key |

## 4. 配置版本轴与兼容职责

| 版本/identity 轴 | Owner / 来源 | 用途 | 兼容规则 | 禁止替代 |
|---|---|---|---|---|
| `profile.schema_revision` | L4-archive 配置 schema | 决定 raw document 可否 parse/validate | loader 只接受明确支持集合；unknown→fail-fast | 不等 config revision、owner schema 或 Bundle schema |
| `profile.config_revision` | 受控 candidate | 标识一次 validated candidate/assembly | 每次变更新 identity；old work 保留 pinned ref | 不等审批、readiness、commit 或内容 digest |
| binding/registry revision | 相应 adapter/registry owner | 标识 exact slot/target/family mapping | 新 assembly/job 固化；旧 mapping 不被 current registry 重建 | 不等 source version、receiver commit |
| operation codec/input digest binding | Archive security/protocol owner（pending） | durable duplicate identity | 必须有明确 decoder/compatibility；未闭合时 reserve blocked | 不借 Bundle integrity digest |
| public/repository cursor mapping | Archive query/store owner（pending） | continuation binding | 与 selector/snapshot/order/store identity 一起兼容 | 不回传 private cursor或临时 base64 |
| owner/export/schema version | 各 L1 truth owner | source/receiver material 解释 | owner-specific、opaque、按 exact target 校验 | 不用 Archive config revision 比较 |
| Bundle manifest/assessment revision | Archive domain truth | 固定 Bundle/closure/assessment basis | immutable revision；新配置不得重写旧 revision | 不等配置迁移或 owner version |
| local record/CAS/fence | Archive store | 并发/事务保护 | current versioned read/fence only | 不替代 owner fence、storage/receiver commit |

## 5. 当前配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | 无 | 当前无迁移项 | 不适用 | 当前标准下尚未发布正式 runtime config schema；旧 README/05/06/draft 不进入 alias/compatibility registry | 不适用 |

这项“无迁移”不表示未来可以无版本演进；它只说明本正式 04 是首个当前标准基线，不能伪造旧部署或使用量证据。

## 6. 新配置引入规则

| 阶段 | 必须完成 | 不满足时处理 |
|---|---|---|
| 1. authority/scope | 指向正式需求、owner 合同或当前配置控制面；确认不在 Forbidden | 拒绝提案；不能以运维便利加入 |
| 2. 03 影响判定 | 检查 runtime type/builder/constructor/port/error/DTO/state/flow/persistence | 有影响先回写 03 并重审受影响 Step |
| 3. 04 schema 闭环 | name/type/default/required/source/scope/activation/sensitivity/failure/module | 任一缺失不得进入 candidate |
| 4. 来源/冲突 | 纳入 `DECL < JSON < ENV` 或正式新增来源设计；重复/alias/非法 winner 可判定 | 不允许 silent fallback |
| 5. 安全/生效 | secret/ref/redaction、cross-field、new assembly/job pinning | 未闭合 fail-closed；不得 hot apply |
| 6. 变更/回滚 | risk、review、safe audit、rollback compatibility | high/critical 无评审/回滚不得激活 |
| 7. 下游承接 | 05 TC/EV、06 AC/VETO、07 boundary、09 runbook/config baseline | 未承接不得发布或移除旧项 |
| 8. blocker 证明 | exact owner/provider/codec/driver 的正式 closure proof | 只允许 negative/blocked seam，不宣称 positive |

## 7. 废弃、兼容窗口与移除状态

| 状态 | Loader 行为 | 冲突/优先级 | 审计与下游要求 | 退出条件 |
|---|---|---|---|---|
| `active` | 按当前 schema parse/validate | 只服从正式来源链 | 常规 test/acceptance/ops | 替代方案正式确认 |
| `deprecated` | 仅在声明的 window 接受；生成安全 deprecation issue | old+new 同时出现不得 first-wins；按明确迁移规则拒绝冲突 | 05 覆盖 warning/conflict；06/09 标明迁移 gate | 支持 profile 已迁移且 rollback 不依赖 old |
| `rejected` | 旧 key/值明确校验失败 | 不映射、不 fallback | 05 negative gate、06 VETO 方向、09 操作提示 | removal release boundary 达成 |
| `removed` | 作为 unknown/removed key fail-fast | 无兼容 | release/迁移记录可追溯 | 不再支持，但 old work 仍靠 stored identity解释 |
| `design-change-required` | 不进入 runtime schema | 无 | 先重开 03/04 及下游 | 新正式设计停审 |

兼容窗口必须以明确 schema/release 边界表达；不得写“长期兼容”“暂时保留”或无 owner 的日期。当前没有已发布基线，因此不填写虚构窗口。

## 8. 旧作业、持久引用与迁移红线

| 对象 | 配置演进时允许 | 禁止 | 不兼容姿态 |
|---|---|---|---|
| 已完成 operation/result | 用 stored key/input/config identity 回放完整结果 | current codec 重算、删除 result、重跑 effect | consistency defect/blocked |
| Reserved/CommitUnknown operation | 使用 pinned binding 并执行正式 local probe | 迁移到新 key后盲重试 | Unknown/ReconcileRequired |
| external intent/effect | 保留 fixed input/effect key/binding identity | current storage/receiver config 重构 intent | CommitUnknown/Blocked |
| public cursor | 仅由兼容 decoder+exact stored mapping继续；否则拒绝 | 映射为 current repository cursor或泄露 private token | Stale/NotAvailable |
| Bundle/manifest/assessment | 保持 immutable revision及原 capability/basis | 因 config migration 重签、重算或升级 Verified | Unsupported/Unknown/Conflicting |
| restore plan/item/handoff | 旧 plan 保留 owner set/receiver mapping；新 mapping需新 plan revision | 原地换 receiver 或把 partial 改 complete | Partial/Blocked/CommitUnknown |
| governance/storage history | 保存原 decision/target/action lineage | current policy 重写旧 retention/delete/commit | Blocked/Unknown |

配置迁移只迁移配置解释与 future candidate，不迁移 owner truth、Archive business state、Bundle revision、external commit 或 observability evidence。

## 9. Future evolution 候选与重开门禁

| 候选 | 当前状态 | 进入条件 | 必须重开/补齐 |
|---|---|---|---|
| `staging-like`/`production-like` positive profile | P1/P2 direction | 正式 provider/owner/secret/workload 目标获批 | 03 binding/adapter影响审计；04 items/profile/failure；05/06/07/09 |
| durable store/UoW driver | local pending | 选型且证明 UoW/CAS/read-set/probe/fence | 04 binding + 05/06 failure/concurrency + 07 boundary |
| operation/cursor codec | local pending | security/protocol/store authority 给出 stable codec/mapping | 03/04 兼容合同 + 05 restart/parity + 07 migration |
| integrity/signature/encryption/compression/schema | `AR-UP-004` blocked | exact algorithm/version/key/capability authority | owner合同、03 adapter/outcome、04 refs、05/06 evidence |
| object storage/receiver/observability provider | external blocked | exact target contract/commit/probe/security | 相应 owner + 03/04/05/06/07/09 |
| secret provider/rotation callback | design change candidate | provider、安全与 rotation contract批准 | 03 adapter/port/error/flow + 04 source/sensitive/change/failure |
| remote config center/admin override | P2/design change candidate | 明确 authority、source priority、audit、failure、rollback | 03 loader/builder/audit + 04 全链；当前 P0 key reject |
| reload/hot/online LKG/dynamic replacement | P2/design change candidate | 生命周期、并发、atomic switch、rollback和old-work规则闭合 | 03 runtime/state/error/flow + 04 load/change/failure/migration |
| outbound publisher/topic/outbox | `AR-HLD-Q-001` blocked | event family/owner/UoW/delivery合同正式关闭 | 至少回退 02 和 03 Step 06～16，再重做 04 相关域 |
| budget/RTO/RPO/capacity 数值 | `AR-HLD-Q-002` blocked | 可追溯 workload/environment/measurement authority | 04 value/profile + 05 NFR + 06 threshold + 07/09 |

## 10. 禁止兼容与禁止静默迁移清单

- raw secret、credential、DSN、private key、provider response 或正文进入普通 config：永远 reject，无兼容窗口。
- 通过 alias/ignored key 接受 remote center、admin/CLI override、hot/reload/LKG、dynamic adapter replacement：P0 reject。
- 将 workspace projection、Artifact ref 或 observability material 升格 canonical：永远禁止，不是迁移项。
- 用新 config revision 重写旧 operation/effect/plan、Bundle revision、owner decision 或 restore outcome：永远禁止。
- 把 required slot 迁移为 optional/Disabled，或把 production binding 迁移到 fake：永远禁止。
- 迁移时用一个 generic version/digest/cursor 替代多个 authority 轴：永远禁止。
- 因旧 key unsupported 而默默取 code default/低优先级值：永远禁止。

## 11. 迁移验证与下游证明要求

| 证明主题 | 未来由谁定义/生成 | 必须证明 | 当前状态 |
|---|---|---|---|
| old→new mapping | 05/07 实现边界 | 映射/冲突唯一、无 silent fallback | planned only；无迁移项 |
| deprecation issue/redaction | 05 | warning 不含 raw/sensitive value | planned only |
| profile inventory | 05/09 | 所有受支持 profile 不再使用 old key | 未生成 |
| rollback compatibility | 05/07/09 | 前一安全 candidate 不依赖 removed key | 未生成 |
| pinned old-work replay | 05 operations-replay | 不按 current config 重建 key/cursor/effect/plan | planned only |
| acceptance gate | 06 | TC/EV/report 完整且无 VETO | 未定义/未裁决 |
| release/ops handoff | 07/09 | schema/config revision、runbook、回滚路径一致 | 未创建 |

本表只定义未来证明要求，不创建 evidence alias、报告路径内容、run_id、verdict 或 signoff。

## 12. 配置迁移停审与跨演进审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 当前迁移项是否明确 | 当前无 | 历史材料不作为已发布配置 |
| schema/config/binding/owner/Bundle/store version 是否分离 | 是 | 建立版本轴矩阵，禁止互换 |
| 新配置引入是否需完整设计与下游闭环 | 是 | 有代码契约影响先回写 03 |
| 已发布 key 是否可无说明删除 | 否 | 必须 deprecated→rejected/removed + window/gates |
| 安全/架构红线是否提供兼容成功窗口 | 否 | 永远 reject/fail-closed |
| old work 是否因 current config 漂移 | 否 | pinned identity；不兼容时 blocked，不重建 |
| P1/P2 是否污染当前 P0 schema | 否 | 仅候选；当前 unsupported key reject |
| 是否伪造迁移使用量/evidence/readiness | 否 | 所有证明标 planned/未生成 |

## 13. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前无已发布旧配置迁移项，历史材料不建立 alias | 否 | 配置基线判定 | 不适用 | 无回写 |
| schema/config/binding 与业务/owner version 分离；old work pinned | 否 | 承接既有 version/consistency contract | 不适用 | 无回写 |
| 新增/废弃必须完成 04 与下游闭环 | 否 | 配置治理规则 | 不适用 | 无回写 |
| future provider/reload/hot/LKG/admin/secret/codec 若改变代码合同 | 是（未来触发） | runtime/builder/port/error/state/flow | 03 对应 Step/章节 | 无回写（触发前暂停） |

## 14. 回填草稿与进入下一步条件

正式 §13 应回填版本轴、当前无迁移项、新配置引入、废弃/移除状态、old-work 红线、future evolution gate、禁止兼容清单和证明要求。不得写虚构版本号、日期、使用量、迁移脚本、provider 或 evidence。

| 条件 | 状态 |
|---|---|
| 当前迁移项与历史材料边界明确 | 通过 |
| 新增/废弃/兼容窗口/移除规则可判定 | 通过 |
| old-work pinned 与版本轴不混淆 | 通过 |
| future capability 都有重开门禁 | 通过 |
| 当前无 03 待回写或阻塞待确认项 | 通过；future code contract 为触发器 |
| 跨迁移演进审计无 unresolved 冲突 | 通过 |
| 可进入 Step 14 | 通过 |
