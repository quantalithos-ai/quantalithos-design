# L2-member-images 04 配置设计 Step 13：配置迁移、废弃与演进

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 13
>
> 回填章节：正式 `04-配置设计.md` §13 配置迁移、废弃与演进
>
> 本 Step 只处理配置 schema 的版本演进、兼容窗口和移除门禁，不创建正式
> `04-配置设计.md`，不新增当前 P0 key，也不把 future owner contract 写成可用能力。

## 1. Step 状态、目标与执行计划

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 13：定义配置迁移、废弃与演进 |
| 当前状态 | `completed`；等待进入 Step 14 |
| 当前模式 | `full-restart`；旧 README、旧 05/06 和历史配置文字仅作差异审计输入 |
| 输入基线 | Step 7 P0 配置项；Step 8 敏感边界；Step 9 加载/校验/生效；Step 10 变更/审计/回退；Step 11 失效策略；Step 12 下游承接 |
| 输出文件 | `projects/L2-member-images/design-calibration/04_config_step_13_migration_deprecation_evolution.md` |
| 回填目标 | 正式 `04-配置设计.md` §13；正式文档仍须等 Step 15 |
| gate_status | `pass_with_explicit_blockers` |
| gate_reason | 首版无已发布配置迁移项；新增、废弃、移除和 future design-change-required 规则已收口；持续 blocker 未被关闭或伪造为 ready |
| next_allowed_action | 更新 flow 与项目台账后，严格创建并完成 Step 14 |

### 1.1 Step / 模块级门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|---|---|---|
| `migration_baseline` | done | done | done | done | done | done | pass | 进入兼容规则模块 |
| `introduction_compatibility` | done | done | done | done | done | done | pass | 进入废弃/移除模块 |
| `deprecation_removal` | done | done | done | done | done | done | pass | 进入演进队列模块 |
| `evolution_queue` | done | done | done | done | done | done | pass | 进入跨迁移审计 |
| `cross_migration_audit` | done | done | done | done | done | done | pass_with_explicit_blockers | 更新 flow/ledger，创建 Step 14 |

### 1.2 Step 内计划

- [x] 读取 Step 7~12、正式 03 配置依赖与风险、配置 SOP/书写规范及 L1-governance Step 13 粒度参考。
- [x] 回答当前旧配置、引入、废弃、兼容窗口和移除条件问题。
- [x] 审计旧材料中可能被误当成迁移源的配置文字。
- [x] 比较“保留 alias / 立即改名”“静默兼容 / 显式迁移”“future 能力进入 P0 / 保持设计重开”方案。
- [x] 形成迁移状态、引入门禁、废弃生命周期、future 演进队列和 evidence 语义。
- [x] 判断是否改变 `03-详细设计.md` 代码契约；当前 P0 无需回写。
- [x] 形成正式 §13 回填草稿，完成跨迁移审计和下一步门禁。

## 2. 本步输入与边界

| 输入 | 状态 | 本 Step 的限定用法 | 不可从中推导的内容 |
|---|---|---|---|
| `04_config_step_07_config_items.md` | completed | 继承五个配置域、21 个 P0 key、`null` safe absence、严格 JSON 和 startup-only 语义。 | 不新增 schema version key、默认成功结果、产品字段或旧 alias。 |
| `04_config_step_08_sensitive_secrets.md` | completed | 继承 `internal`/`sensitive`/`secret` 分层、opaque selector、raw secret 禁止和新 selector + restart 轮换规则。 | 不定义真实 secret provider、KMS/Vault、credential body 或 rotation 命令。 |
| `04_config_step_09_loading_validation_activation.md` | completed | 继承 strict parse、unknown/duplicate reject、cross-field 校验、startup freeze、无 reload/LKG/partial apply。 | 不引入在线迁移、热替换或动态 adapter lifecycle。 |
| `04_config_step_10_change_audit_rollback.md` | completed | 继承 high-risk change review、safe audit ref、prior validated body-free input 和显式 restart 回退。 | 不把外部 review ref 当 approval/signoff，不声明回退已执行。 |
| `04_config_step_11_failure_degradation.md` | completed | 继承 migration candidate 无法验证时的 fail-fast/fail-closed、`Blocked`/`Gap`/`Unknown` marker。 | 不以 cache、fake、LKG、retry 或在线 repair 继续。 |
| `04_config_step_12_downstream_handoff.md` | completed | 继承未来 `05/06/07/09` 的迁移测试、验收、实施和运维承接输入。 | 不创建/重写下游正文，不伪造 report、digest、verdict、signoff 或 readiness。 |
| `03-详细设计.md` 与 `03_ddd_step_14_config_dependencies.md` | current formal / completed | 检查新配置是否会改变 `ImageRuntimeConfigRef`、builder、port、error、flow、state 或 adapter boundary。 | 不新增 runtime config 字段、constructor、port、DTO、event 或 product adapter。 |
| 旧 README、旧 `05-测试方案.md`、旧 `06-验收标准.md` | historical material | 仅辨识旧环境描述、旧 key 或产品化文字污染。 | 不把历史文字视为已发布 schema、迁移对象、使用量或 rollback target。 |
| `L1-governance` Step 13 | 粒度/格式参考 | 参考“当前无迁移项 → 状态定义 → 引入规则 → 废弃/移除 → future 队列 → 审计”。 | 不继承 governance outbox、publisher、topic、GRC、报告或成功合同。 |

### 2.1 当前配置基线判定

| 判定项 | 当前结论 | 依据 |
|---|---|---|
| 已发布正式 `04-配置设计.md` | 不存在 | 当前正式目标尚未创建，Step 15 才装配。 |
| 已发布 runtime config schema | 不存在 | Step 7 的 21 个 key 是本轮待定稿 P0，不是历史发布版本。 |
| 旧 README/05/06 中的配置片段 | 非正式、不可迁移 | 只作 historical pollution audit，不具备 owner、版本、兼容窗口或 rollback authority。 |
| 首版 P0 迁移对象 | 无 | 没有可验证的旧 key → 新 key 映射，也没有已发布使用基线。 |
| 首版是否提供自动迁移 | 不提供 | strict JSON 和 startup validation 不允许隐式重写输入。 |

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 是否存在旧配置需要迁移？ | 当前无已发布正式 `04`、无已发布 runtime config schema，因此当前 P0 没有迁移项。旧 05/06 的环境文字、旧 README 片段和历史草案不作为迁移对象。 |
| 新配置如何引入？ | 先在 04 完成动机、key、类型、默认/安全缺省、必填性、来源优先级、作用域、生效方式、敏感级别、失败策略、变更审计、回退和下游承接；若改变 03 的 builder/port/error/flow/DTO 等代码契约，必须先回写 03。实施只能承接已闭合的配置设计。 |
| 旧配置如何废弃？ | 任何已发布 key 必须经历 `active → deprecated → rejected/removed` 的显式状态；兼容窗口内只能按文档规定映射或给出 redacted warning，不能 silent fallback。当前没有已发布 key，因此当前不创建 alias。 |
| 是否需要兼容窗口？ | 当前首版无兼容窗口。未来重命名、结构替换或语义迁移时，必须明确起止条件、旧/新 key 冲突、warning/error、下游测试验收、回退依赖和移除条件。安全红线和 P0 明确 unsupported 能力不提供“接受但忽略”的兼容窗口。 |
| 何时允许移除旧配置？ | 只有在旧 key 已标记 deprecated、兼容窗口结束、所有受影响 profile artifact 已迁移、05/06/07/09 已承接、回退输入不再依赖旧 key、且有安全的发布/变更记录后，才可将其标记 removed；随后旧 key 作为 unknown/removed field 被拒绝。 |
| 如何迁移敏感 selector？ | 只迁移 opaque identity，不迁移或记录 raw secret、credential、endpoint、provider body 或完整敏感 ref。新 selector 必须重新严格校验并显式 restart；审计只允许 safe category、issue/ref 或受控 redacted identity。 |
| 如何处理旧/新 key 同时出现？ | 未来若启用兼容窗口，冲突处理必须在 04 schema 中显式定义；未定义的旧/新并存、同源重复或跨来源歧义均 reject。不能以来源优先级偷偷掩盖同一语义的 key 冲突。 |

## 4. 当前材料问题诊断

| 位置/现象 | 风险 | 本 Step 处置 |
|---|---|---|
| 正式 `04-配置设计.md` 尚不存在 | 可能误把旧草案当作首版基线 | 明确当前无已发布迁移项，首版以 Step 7~12 收口的 21 个 P0 为候选基线。 |
| 旧 `05/06` 可能包含环境名、存储/外部服务描述 | 可能产生虚假的旧 key、产品迁移或使用量事实 | 只作 historical input；不创建 alias、不声明 adoption、不生成 migration report。 |
| Step 7~12 已有 future provider/config center/hot reload/LKG 讨论 | 可能把 future capability 当作兼容 key | 归入 future evolution queue；P0 遇到对应 key/source/operation 直接 reject 或触发设计重开。 |
| strict JSON + unknown field reject | 可能与“无说明兼容旧 key”冲突 | 首版不做隐式兼容；未来兼容必须先把旧 key 纳入明确 schema 和状态表。 |
| sensitive ref 轮换 | 可能把 full old/new ref 写入 audit 或 rollback | 只保留 slot/category、safe issue ref 和受控 redacted identity；重新校验、restart 后才生效。 |
| owner/policy blocker 未闭合 | 可能让迁移表看起来关闭了外部合同 | 迁移表只记录配置状态，不关闭 `MI-UP-*`、`Q-MI-*`、`DDD-*` 或 `PF-*`。 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前迁移基线 | 未声明，旧材料容易被误读为旧版本 | 明确“当前无已发布迁移项” | 首版必须有可审计的基线判定。 |
| 新配置引入 | 规则分散在 Step 7~12 | 收口为 04 schema → 03 影响判定 → 校验/生效 → 下游承接的门禁链 | 防止实施侧直接增加 key。 |
| 兼容行为 | 可能被理解为 alias 或 silent fallback | 只有未来显式 deprecated 状态才能兼容；未定义冲突一律 reject | 保持 strict JSON 和 fail-closed。 |
| 废弃/移除 | 没有生命周期与移除条件 | 固定 `active → deprecated → rejected/removed` 和下游/回退门禁 | 防止无说明删除已发布配置。 |
| future 能力 | provider、config center、hot reload 等散落在风险段 | 统一进入 future evolution queue，必要时 `design-change-required` | 不让 P0 schema 被未闭合产品污染。 |
| 敏感迁移 | 旧/新 selector 的输出边界未集中 | 只迁移 opaque selector，禁止 raw material/full ref 输出 | 降低凭据与运营边界泄露风险。 |
| evidence 语义 | 可能把计划产物当成结果 | 只定义 future/planned evidence 类别，不声明 report/run/digest/signoff | 保持证据真相源闭环。 |

## 6. 配置设计取舍

| 议题 | 采用方案 | 未采用方案 | 取舍理由 |
|---|---|---|---|
| 首版是否保留旧草案 alias | 首版不保留 alias，旧草案不属于发布基线 | 把旧 05/06/README 文字当作兼容 key | 没有可验证发布版本、owner 或使用量，保留 alias 会伪造迁移事实。 |
| 新 key 是否可由实施先加 | 必须先闭合 04；改变代码契约时先回写 03 | 先改实现/Cargo/环境，再补文档 | 维护 03→04→05/06/07 真相源闭环。 |
| 兼容窗口是否默认接受旧值 | 只有显式 `deprecated` schema 才可接受；未声明则 reject | 接受未知旧 key、忽略 warning 或静默 fallback | strict parser 要求可判定的输入，避免配置漂移。 |
| 旧/新 key 冲突处理 | 未在 schema 中定义的并存/冲突一律 reject | 让 env、文件或 alias 以隐式优先级覆盖 | 来源优先级不能替代迁移映射。 |
| unsupported 能力是否提供兼容 key | `config center`、`admin override`、`hot/reload`、online LKG 等 P0 key 直接 reject | 接受但忽略、标记 disabled 后继续 | 这些能力会改变 runtime/source/audit/rollback 契约。 |
| 敏感 selector 如何迁移 | 新 opaque selector + fresh validation + restart；审计只留 redacted identity | 记录 full old/new selector 或 raw secret | 与 Step 8~11 的 no-output 和 startup-only 一致。 |
| Future owner gap 如何推进 | 保留 pending/gap/blocked/unknown，owner 闭合后重开受影响 Step | 用 fake、tag、ACK 或 cache 伪造迁移完成 | 外部 truth 不归本仓所有。 |

## 7. 结构化中间产物

### 7.1 当前配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | 无 | 当前无迁移项 | 不适用 | 正式 `04` 尚未发布；Step 7 的 21 个 P0 是首版候选基线；旧 README/05/06 不作为迁移对象 | 不适用 |

### 7.2 迁移状态定义

| 状态 | 含义 | strict loader 行为 | 下游/审计要求 |
|---|---|---|---|
| `active` | 当前正式 schema 中可用的 key | 正常 parse、type/cross-field validate 和 startup assembly | 05/06/07/09 按当前契约承接；审计使用 safe identity。 |
| `introduced` | 已设计但尚未成为所有 profile 的默认能力，需显式 opt-in | 仅在已声明 profile/scope 可接受；缺失不得变成成功默认 | 补充 profile、negative/positive boundary 测试和下游输入；不得伪造外部 readiness。 |
| `deprecated` | 有明确替代 key，仍在兼容窗口 | 只按已记录 mapping 接受；输出 redacted warning/issue；冲突或非法旧值 reject | 05 增加旧 key warning/冲突测试；06 定义迁移门禁；09 给出运维提示。 |
| `rejected` | 设计中明确不支持或已结束兼容的 key/来源 | validation reject；不 fallback 到低优先级来源 | 负向测试与验收 veto；不得写成 disabled success。 |
| `removed` | 兼容窗口结束且 key 不再存在 | 作为 unknown/removed field reject | 发布说明、迁移/回退兼容检查和下游同步记录。 |
| `design-change-required` | 会改变 03 代码契约、安全边界或运行时生命周期 | 不进入当前 runtime schema；先暂停受影响 lane | 先回写 03、重新跑相关 04 Step，再交给 05/06/07/09。 |

### 7.3 新配置引入门禁

| 阶段 | 必须完成的内容 | 未满足时处理 |
|---|---|---|
| 1. 动机与范围 | 指向需求、架构、详细设计或下游承接问题，说明 P0/P1/P2 级别 | 记录 Step 14 风险，不进入实施。 |
| 2. 代码契约影响 | 检查 runtime config、builder、adapter constructor、port、error、DTO、flow、state、observability 是否改变 | 影响 03 时先回写并重开相关 03/04 Step。 |
| 3. schema 完整性 | 类型、默认/安全缺省、必填、作用域、来源、优先级、敏感级别、生效和失败策略齐全 | 缺字段时不进入正式配置契约。 |
| 4. 交叉与静态边界 | profile/mode/harness、owner/kind/mutable、static/live、scope、collection 和 redaction floor 校验明确 | 受影响输入 reject 或 `Blocked`；不得用 `enabled=false` 绕过。 |
| 5. 变更与回退 | high-risk change 有外部 change/reason/review 关联；prior validated body-free input 可重新校验 | 无可验证回退输入则 fail-closed，不自动回退。 |
| 6. 下游承接 | 05/06/07/09 收到测试、验收、实施、运维输入；planned evidence 与实际结果分开 | 下游未承接时不得 release；不写 readiness。 |
| 7. owner/policy 闭合 | external selector、Artifact、consumer、builder、evidence 等 owner contract 已正式确认 | 未闭合则只能 marker/gap/blocked/unknown，不能进入 positive lane。 |

### 7.4 废弃、兼容与移除生命周期

| 阶段 | 配置状态 | loader 行为 | 必须同步的下游内容 | 退出条件 |
|---|---|---|---|---|
| 宣告废弃 | `deprecated` | 仍接受已明确 mapping；输出 redacted deprecation issue；禁止 silent fallback | 05 增加旧 key、warning、冲突和敏感 no-output 测试；09 记录迁移提示 | 新/旧 key 的 schema、冲突和回退语义已固定。 |
| 兼容窗口 | `deprecated` | 旧 key 只能映射到新 key；新 key 与旧 key 冲突时按显式规则，否则 reject | 06 定义迁移门禁；07 承接 mapping/phase；09 承接 profile artifact 更新 | 所有受影响 profile 已切换，安全的使用/迁移证据可核验。 |
| 强制迁移 | `deprecated` → `rejected` | 旧 key validation reject；不使用 LKG/cache/fake 兜底 | 05/06 增加 negative gate；07/09 更新实施和运维承接 | 兼容窗口结束且回退输入不依赖旧 key。 |
| 移除 | `removed` | 旧 key 作为 unknown/removed field reject | 记录 release/change 关联；保留可核验的 prior input 语义 | 无有效 profile artifact、rollback target 或下游输入仍引用旧 key。 |

### 7.5 Future 演进队列

| 候选能力 | 当前状态 | 进入条件 | 必须补充/重开的设计 |
|---|---|---|---|
| `staging-like` profile | P1 direction only | 真实受控依赖和 profile 目标获确认 | profile matrix、opaque refs、secret 接线、验证门禁、05/06/09 承接。 |
| `production-like` profile | P1/P2 direction only | 生产运行目标、真实 owner/policy 和无 fake 约束获确认 | provider/adapter、真实 store/bus/handoff、evidence gate、rollback 和运维 runbook。 |
| Member component / supervisor / RoleExtra release pin | owner pending | `MI-UP-002` 及相关 release/compatibility 合同闭合 | 重开 static ref schema、resolver/guard 影响、测试和下游交接；不复制 release body。 |
| Role-to-image-variant mapping | owner pending | `MI-UP-003` 的 RoleDefinition/mapping ref 合同闭合 | 重开 mapping shape、owner/kind、revision/coverage 语义；不 hardcode mapping。 |
| Policy/memory/workspace/role-extra seed | owner pending | `MI-UP-006` 明确 template owner、placement 和 static-safe contract | 重开 seed schema/placement 与 static/live 审计；不把 seed 变成 live state。 |
| Hardened base / Sandbox boundary | owner pending | `MI-UP-008` 与 Sandbox/scope owner 确认 pinned base 语义 | 必要时回退 00~03，重开 base/builder/scope；不声明 sandbox readiness。 |
| Builder/registry product binding | `Q-MI-003` pending | builder、registry、store、credential 和 digest policy 获确认 | 重开 external adapter、secret、result/error、evidence 和 implementation boundary。 |
| Qualification/Artifact handoff | `MI-UP-007`/`Q-MI-004` pending | Artifact consumable ref、lineage、gate/evidence policy 正式闭合 | 重开 qualification/Artifact selector、acceptance 和 downstream evidence；不 mint Artifact。 |
| Member Service consumer supply | `MI-UP-001` pending | manifest/variant/ref/qualification/confirmation 与 host/container 边界闭合 | 重开 supply selector、consumer handoff 和 service-side confirmation；不声明 launch/health。 |
| Remote config center | `design-change-required` | 明确 source authority、availability、audit 和 rollback | 回写 03 loader/source/adapter/error/flow，并重开 04 Step 5/9/10/11/13。 |
| Admin override | `design-change-required` | actor、scope、审批和审计模型获安全确认 | 回写 03 public/application boundary、error、audit 和 conflict policy。 |
| Secret provider / KMS / Vault | `design-change-required` / P1 | provider、ref schema、rotation 和 health contract 获确认 | 回写 03 builder/adapter/health/error；重开 Step 8~11/13。 |
| Runtime hot reload / online LKG | `design-change-required` | zero-downtime lifecycle、adapter replacement、rollback 和 partial failure 获确认 | 回写 03 lifecycle/state/port/error；重开 Step 9~11/13。 |
| Inbound build event source | `MI-UP-005` pending | event authority、family/schema、identity、dedup、receipt 和 transport 闭合 | 重开 event/config activation 与 worker boundary；不得把 event key 写成当前 source。 |
| Outbound release event | `MI-UP-009` pending / `NoneAuthorized` | outbound authority、consumer、schema、delivery failure 和 owner 确认 | 从 03/04 Step 3~5 起重开；不得用 disabled config 伪造 publisher。 |
| Digest/evidence/BOM/scanner/signature policy | `Q-MI-004` pending | 安全/治理/Artifact owner 明确 evidence kind、优先级和安全输出 | 重开 Step 7/10/12/13，并由 05/06 定义实际测试/验收；当前只保留语义。 |
| Retry/backoff/alert/retention numeric policy | future operations | 真实运行参数、owner 和运维目标获确认 | 先判定是否改变 03 flow/state，再重开 04/05/09；当前不新增数字配置。 |

### 7.6 禁止作为迁移兼容的配置或行为

| 配置/行为 | 处理 | 原因 |
|---|---|---|
| raw secret、password、private key、certificate、raw DSN、credential/body | 永远 reject，不提供兼容窗口 | `secret` 材料不属于 P0 ordinary config，且不能进入输出面。 |
| full endpoint、provider response、manifest、Artifact body | reject | 外部正文和 owner truth 不由本仓保存或迁移。 |
| `latest`、mutable ref、未验证 tag 或由 tag/ACK 推导 digest | reject / `Blocked` | 破坏 immutable pin 和 provenance 边界。 |
| static boundary override、template→live state、seed→memory/checkpoint/workspace | reject | 不能以迁移绕过 static/live 与数据所有权红线。 |
| `config center`、`admin override`、`reload`、`hot`、online LKG、partial apply 的 P0 key | reject / design-change-required | 需要新的 source、lifecycle、audit、rollback 和 03 代码契约。 |
| Production-like fake、fixture、replay 或 debug downgrade | reject | 只允许 `ci-test + explicit TestOnly` 的测试 seam。 |
| 以配置开启 Query repair、UoW/recovery、outbox/publisher、inbound accepted write | reject | 配置不得改变 `DDD-*`、`PF-*`、`ImageOutboundEventInventory::NoneAuthorized` 或 Query no-write。 |
| 以 empty/null 迁移旧值关闭 required slot | reject / `Blocked` | `null` 只表示 safe absence，不能变成成功默认。 |

### 7.7 Future migration evidence 语义

| 计划产物类别 | 未来需要证明 | 当前不应证明 |
|---|---|---|
| migration mapping report | 旧 key→新 key 映射、冲突和无 silent fallback | 当前没有旧 key、mapping report 或迁移结果。 |
| deprecation warning report | warning 为 redacted、profile 覆盖完整、未泄露敏感值 | 不证明 owner approval、consumer readiness 或发布成功。 |
| removed-key negative report | 旧 key 在 strict loader 中被拒绝 | 不证明任何实际环境已执行迁移。 |
| profile artifact scan | 兼容窗口结束后 profile 输入不再使用旧 key | 不伪造 artifact digest、run_id 或扫描结果。 |
| rollback compatibility report | prior validated body-free input 不依赖被移除 key | 不证明 host/container rollback 已执行。 |
| downstream update report | 05/06/07/09 已承接同一迁移契约 | 当前下游仍未重写，不生成 report 或 signoff。 |
| sensitive redaction report | old/new selector 仅以安全摘要或受控 redacted identity 关联 | 不输出 full ref、secret、endpoint、body 或 provider response。 |

所有上表产物均是 future/planned evidence category；本 Step 不生成 report、artifact、digest、run、verdict、signoff 或 readiness。

### 7.8 配置迁移停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 当前是否有旧配置迁移项 | 无 | 正式 `04` 和 runtime config schema 尚未发布；旧 05/06/README 非迁移对象。 |
| 是否显式说明“当前无迁移项” | 通过 | 见 §7.1。 |
| 新配置引入规则是否闭合 | 通过 | 见 §7.3；未完成不得进入实施。 |
| 废弃/兼容/移除生命周期是否闭合 | 通过 | 见 §7.4；不允许无说明删除。 |
| 安全红线是否拒绝兼容 | 通过 | 见 §7.6；raw material、mutable pin、live override 等不提供兼容窗口。 |
| future P1/P2 与当前 P0 是否分离 | 通过 | 见 §7.5；future 不进入当前 21 项 schema。 |
| evidence 是否与实际结果分离 | 通过 | 见 §7.7；当前无任何 report/run/digest/verdict。 |

### 7.9 跨迁移演进审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否把旧草案当作已发布配置基线 | 不允许 | 旧 README/05/06 仅 historical input。 |
| 是否可以由实施侧直接增加 key 或 alias | 不允许 | 必须先回 04；改变 03 契约时先回写 03。 |
| 是否存在 silent fallback 或无说明 alias | 不允许 | 未定义旧/新冲突、unknown field、source ambiguity 均 reject。 |
| 是否允许 unsupported P0 能力以 disabled key 兼容 | 不允许 | config center/admin override/hot/reload/LKG 直接 reject 或 design-change-required。 |
| 敏感迁移是否禁止 raw/full ref 输出 | 通过 | 只保留 redacted identity、safe issue/ref 和 slot/category。 |
| static/live、pin、Query no-write、outbound zero 是否被迁移绕过 | 不允许 | 迁移不得改变既有 03 不变量或 `NoneAuthorized`。 |
| owner/policy blocker 是否保持开放 | 通过 | `MI-UP-001/002/003/006/007/008`、`Q-MI-003/004` 等仍为 pending。 |
| future event/config/product 是否误写成当前 readiness | 未发现 | 统一标为 future/pending/planned；不生成 positive result。 |

## 8. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03（当前 P0） | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前无已发布旧配置迁移项 | 否 | 配置版本基线说明 | 不适用 | 无回写 |
| 新 key 必须先完成 04 schema、validation、sensitive、failure 和下游承接 | 否 | 配置治理门禁 | 不适用 | 无回写 |
| 当前不保留旧草案 alias，不提供隐式兼容或自动迁移 | 否 | strict loader 语义收口 | 不适用；承接 03 §13/§14 | 无回写 |
| 当前 P0 不接受 config center/admin override/hot/reload/online LKG/真实 secret provider API | 否 | unsupported boundary | 不适用；沿用既有 builder/source 边界 | 无回写 |
| Future 若新增 runtime config 字段、adapter constructor、port、error、DTO、flow、state、source authority 或 lifecycle | 否（当前未触发；future 条件为是） | 未来代码契约变更触发器 | 触发时回写 03 §4~§15 及对应 calibration Step | 无回写；未进入当前 P0 |

> 判定说明：最后一行描述的是未来重新打开条件，不是当前 P0 配置结论。未来一旦转为可实施能力，必须把“当前未触发”改为明确的 `待回写` 或 `阻塞待确认`，完成 03 回写并重新执行受影响的 04 Step；不能以本文件的“无回写”作为未来实现授权。

## 9. 正式 §13 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_13_migration_deprecation_evolution.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“当前配置迁移与废弃表”“迁移状态定义”“新配置引入门禁”“废弃、兼容与移除生命周期”“Future 演进队列”“禁止作为迁移兼容的配置或行为”“Future migration evidence 语义”“配置迁移停审记录”和“跨迁移演进审计表”。

正式 §13 只回填以下结论：

1. 当前没有已发布旧配置和迁移项；旧 README/05/06 不是迁移基线。
2. 新配置必须先完成 04 schema、来源/优先级、校验、生效、变更/回退、敏感边界和下游承接；改变 03 契约时先回写 03。
3. Future 配置采用 `active`、`introduced`、`deprecated`、`rejected`、`removed`、`design-change-required` 状态；严格 loader 不接受未声明 alias、冲突或 unknown field。
4. 已发布配置未来废弃时必须有兼容窗口、redacted warning、迁移测试/验收/实施/运维承接和回退兼容检查；窗口结束后才可 rejected/removed。
5. raw secret、provider body、mutable/`latest`、static/live override、P0 hot/reload/config center/LKG、production fake 和绕过既有 blocker 的开关永远不能作为迁移兼容。
6. builder/registry、Artifact/qualification、Member Service、member component、Role mapping、seed/base、真实 secret provider、event、production profile 等仍是 pending/future；不得写成当前 digest、Artifact、consumer confirmation、发布或 readiness。
7. 迁移 evidence 只作为未来 planned category；本项目当前不生成 report、run、digest、verdict、signoff 或实际迁移结果。

正式文档不得加入未在本 Step 或前序已确认产物出现的 schema version key、旧 alias、迁移脚本、产品、endpoint、secret、digest 算法、实际使用量或发布结论。

## 10. 待确认事项与持续 blocker

| 事项 | 当前影响 | 需要确认方 | 未确认前处理 |
|---|---|---|---|
| 正式 `04` 首版版本号、日期和发布基线 | 影响未来 migration baseline | 配置设计维护者/项目负责人 | Step 15 再确定文档元信息；当前不虚构版本或发布时间。 |
| 未来 `staging-like` / `production-like` 是否进入路线 | 影响 profile、secret、owner 和证据迁移 | 产品、架构、运维、测试负责人 | 只记录 future direction，不加入当前 P0 schema。 |
| 真实 secret provider、remote config center、admin override、hot reload/LKG | 影响 03 loader/builder/adapter/source/audit/rollback | 架构、安全、运行时、运维负责人 | P0 继续 reject/unsupported；需求进入时先回写 03/04。 |
| Deprecated warning 是否进入 public protocol/DTO/error | 可能改变 03 public surface | 架构与实施负责人 | 当前只保留 redacted issue/log；public surface 变化先回写 03。 |
| 迁移自动化工具与 release process | 影响未来 07/09 操作 | 实施与 release 负责人 | 当前只定义状态和门禁，不定义脚本、命令或执行结果。 |
| digest canonicalization 与 redacted identity 具体算法 | 影响 future evidence/drift/rollback 对比 | 实施与测试负责人 | 04 只定义安全语义；具体算法待 05/07/owner policy，当前不生成 digest。 |
| `MI-UP-001/002/003/006/007/008`、`Q-MI-003/004` | 影响 external/static/consumer 正向解释 | 相应 owner 与 policy authority | 维持 opaque ref、`Blocked`/`Gap`/`Unknown`/`ConsumerHandoffGap`；不造正向结果。 |
| `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` | 影响 write/replay/history/recovery lane | 详细设计 owner | 配置迁移不得增加 UoW、lease、TTL、retry、repair 或 state transition；按原 blocker 处理。 |

## 11. 自检与 Step 13 门禁

| 自检项 | 结论 | 依据 |
|---|---|---|
| 是否明确当前无迁移项 | 通过 | §2.1、§7.1。 |
| 是否定义新增、重命名、废弃、移除和兼容窗口 | 通过 | §3、§7.2~§7.4。 |
| 是否禁止无说明删除已发布配置 | 通过 | deprecated → rejected/removed 生命周期和退出条件。 |
| 是否把 strict JSON、unknown field、source conflict 与迁移规则统一 | 通过 | 未声明 alias/冲突/unknown field 一律 reject。 |
| 是否区分 opaque selector 与 raw secret/body | 通过 | §3、§7.6、§10。 |
| 是否把 future/provider/owner/policy gap 写成当前 P0 | 否 | §7.5、§7.9；均标 future/pending/design-change-required。 |
| 是否以迁移绕过 static/live、pin、Query no-write、outbound zero 或 DDD/PF blocker | 不允许 | §7.6 和 §10。 |
| 是否伪造 migration report、digest、run、verdict、signoff 或 readiness | 否 | §7.7 和正式回填约束。 |
| 是否有当前 P0 `待回写` 或 `阻塞待确认` 的 03 影响项 | 无 | 当前 future 触发器未进入 P0；§8 明确无回写。 |
| 是否可以进入 Step 14 | 通过 | 迁移 baseline、生命周期、future queue、审计和 03 影响判定已完成；持续 blocker 已显式保留。 |

```text
step_13 = completed
gate_status = pass_with_explicit_blockers
current_module = cross_migration_audit (closed)
next_allowed_action = update_flow_and_ledger_then_create_step_14_risks_open_questions
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false
planned_boundary_skeleton_allowed = false
commit_required = false
```

**停审结论：** Step 13 已完成。当前 P0 无迁移对象；未来配置演进必须按本 Step 的状态、兼容窗口和 03 回写触发器执行。下一动作只能更新 04 flow/项目台账并创建 Step 14；不得提前装配正式 04，也不得进入 05~07、实现、测试执行、证据或 commit。
