# Step 13. 定义配置迁移、废弃与演进

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 13。
> 回填章节：未来正式 `projects/L5-sync/04-配置设计.md` §13「配置迁移、废弃与演进」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04。
> 事实边界：本文只定义 L5-sync 配置首版的迁移基线、重命名/废弃规则、兼容窗口、敏感 ref 迁移边界和未来演进触发；不创建实现、迁移脚本、运行实例、artifact、report、evidence、review verdict、signoff 或 readiness。

## 1. Step 状态与开工确认

| 项目 | 状态 |
|---|---|
| 当前 Step | `13 / migration_deprecation_evolution` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1～12 均 `completed / stop_review`；Step 12 已停审 |
| 输出文件 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` |
| 回填位置 | 未来正式 `04-配置设计.md` §13 |
| 正式 04 写入 | `false`；只能在 Step 15 装配 |
| Step 14～15 文件 | 未创建；不得在本 Step 预创建 |
| 实现 / 测试 / commit | `false / false / false` |
| 当前持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样继承 |
| 下一允许动作 | 更新 flow/ledger 后进入 Step 14；不创建正式 04 |

### 1.1 Step 内计划与执行纪律

| 计划项 | 状态 | 产物 / 判定 |
|---|---|---|
| 读取输入与前序结论 | done | Step 7～12、正式 03 配置/错误/观测章节、配置 SOP/规范、中间产物规范均已复核 |
| SOP 问题回答 | done | §3 逐项回答当前迁移、引入、废弃、兼容窗口和移除条件 |
| 当前材料 / 历史材料诊断 | done | §4 明确正式 04 尚未发布；旧 README、旧 05/06 和 draft 不构成迁移基线 |
| 设计取舍 | done | §5 固定首版无 alias 迁移、无 silent fallback、敏感 ref 仅 redacted digest、future 能力隔离 |
| 结构化中间产物 | done | §6 给出迁移表、状态定义、引入/废弃规则、metadata 边界、演进候选和证据上限 |
| 复杂度判断 | done | 以规则表和候选队列收口；不写版本号、release train、脚本或产品选型 |
| 回填草稿 | done | §8 可直接映射到未来正式 §13 |
| 自检与下一步门禁 | done | §9～§11 完成；当前无 03 回写项，但保留未来触发条件 |

本 Step 的通过只表示“配置如何演进”已有可审查规则，不表示已经存在旧配置、迁移报告、兼容运行、废弃告警、移除发布或任何验收结论。

## 2. 本步目标、输入与非范围

### 2.1 目标

本 Step 必须回答并闭合：

1. 当前是否有已发布旧配置需要迁移；
2. 新配置如何进入 42-leaf schema、ValidatedSyncRuntimeConfig 和下游承接；
3. 配置重命名、deprecated、rejected、removed 的状态和兼容窗口如何表达；
4. 敏感 opaque ref 如何迁移而不泄露旧/新 ref 或材料；
5. `.qs-sync` metadata migration 与 raw config schema migration 的边界；
6. future config center、secret provider、hot reload、online LKG、production-like profile 等能力如何进入演进队列，而不借兼容 key 渗入 P0；
7. 哪些迁移材料未来可以作为 planned evidence input，哪些当前绝不能宣称已生成。

### 2.2 权威输入

| 输入 | 用途 |
|---|---|
| `04_config_step_07_config_items.md` | 42 个 canonical leaf、九个 raw section、38 required 与 4 nullable operations slot |
| `04_config_step_08_sensitive_secrets.md` | opaque ref、adapter-private resolution、rotation、redaction 和零泄露边界 |
| `04_config_step_09_loading_validation_activation.md` | strict JSON、source precedence、whole-candidate reject、cold composition、snapshot pinning、P0 hot/reload reject |
| `04_config_step_10_change_audit_rollback.md` | safe audit、redacted digest、previous validated candidate + cold restart、外部 effect 不可回滚 |
| `04_config_step_11_failure_degradation.md` | fail-fast/fail-closed/degraded/delayed/unknown 和 drift/expiry 处置 |
| `04_config_step_12_downstream_handoff.md` | 05/06/07/09 的迁移承接、禁止重复定义和 planned evidence 上限 |
| `projects/L5-sync/03-详细设计.md` §10～§15 | local truth ownership、snapshot/commit unknown、配置绑定、观测与 redaction |
| `standards/document/配置设计讨论流程_SOP.md` Step 13、`配置设计书写规范.md` §5.13/§13 | 本 Step 的问题、表结构和回填约束 |
| `projects/L1-governance/design-calibration/04_config_step_13_migration_deprecation_evolution.md` | 仅参考粒度、状态表、证据边界与停审框架，不继承其业务 truth |

旧 `README.md`、旧 `05/06`、旧 draft、其他项目配置和历史 Git/LFS/浅克隆/GUI 选择均为 `historical_material` 或框架参考，不是当前配置版本基线。

### 2.3 明确不定义

- 正式 `04-配置设计.md` 的首版版本号、发布时间、release train 或发布状态；这些留给 Step 15/后续治理。
- 具体迁移脚本、命令、CLI flag、parser/package、数据库/文件表、driver、retention 或 crash recovery 实现。
- `.qs-sync` physical schema、物理 migration、保留期、清理和 crash semantics；这些受 `SYNC-UP-006` 阻塞。
- config center、admin override、secret provider、hot reload、online LKG、自动 retry/rollback 的实现方案。
- 任何真实配置文件、环境变量实例、secret、endpoint、Git 输出、provider response、测试 run、report、evidence、verdict、signoff 或 readiness。

## 3. SOP 问题回答

| 问题 | L5-sync 回答 |
|---|---|
| 当前是否存在旧配置需要迁移？ | 当前没有已发布正式 `04-配置设计.md`，也没有已发布的 L5-sync runtime config schema；因此当前 P0 明确为“当前无迁移项”。旧 `05/06`、README 和 draft 中的环境/配置文字不是已发布契约，不作为旧配置、兼容 alias 或迁移输入。 |
| 新配置如何引入？ | 任何新 leaf、重命名目标或新 profile 必须先补齐 raw schema、类型/required/nullable、来源优先级、作用域、生效、敏感性、校验、失败、审计、回退和 05/06/07/09 承接；若改变 runtime config、builder、adapter constructor、Port、DTO、error、state、flow 或 durable carrier，必须先回写 03。设计未闭合前不得进入实施计划或兼容解析。 |
| 旧配置如何废弃？ | 已发布配置不得无说明删除。必须经历 `active → deprecated → rejected → removed` 的明确状态（或明确说明不提供兼容窗口而直接 reject），记录迁移目标、兼容窗口、warning/error 升级、审计和移除条件；不得用低优先级默认、旧 snapshot 或 cache 静默掩盖废弃 key。 |
| 是否需要兼容窗口？ | 当前首版无迁移项，故没有当前兼容窗口。未来任何已发布 key 的重命名/替换，发布前必须声明窗口的开始、结束、接受范围和升级为 reject 的条件；安全红线、raw material、P0 hot/reload、owner/review/provenance override 等不提供成功兼容窗口，出现即 reject 或回流设计。窗口的具体时长不在本 Step 猜定。 |
| 何时允许移除旧配置？ | 只有在 deprecated 窗口结束、所有允许 profile/载体已迁移、05/06/07/09 已同步、旧 key 的 validated rollback target 不再依赖、redacted migration material 可追溯且不会破坏 03 契约时，才可转为 removed；移除后按 unknown/removed field reject，不 silent ignore。 |

## 4. 当前材料与历史材料诊断

| 材料 / 位置 | 诊断 | 本 Step 处置 |
|---|---|---|
| 正式 `projects/L5-sync/04-配置设计.md` | 文件尚未创建，故不存在已发布 schema/version | 当前迁移表写明“当前无迁移项” |
| 旧 `projects/L5-sync/05-测试方案.md`、`06-验收标准.md` | 使用旧对象、旧环境词和旧配置叙述，未经过本轮 04 校准 | 不作为 old key、alias 或 rollback target；仅供后续重写识别污染 |
| `README.md` 与 `draft/` | 含 Rust/Tauri、固定 metadata、LFS/浅克隆/GUI 等历史选择 | 只登记为 historical；不得通过兼容 key 重新启用 |
| Step 7～12 | 已固定 42 leaf、ref-only、冷生效、无 hot/LKG 和下游边界 | 作为未来迁移唯一当前配置输入；不擅自增加第 43 个 leaf |
| `.qs-sync` metadata | 03 仅定义 logical namespace/typed relation，physical schema/migration 未闭合 | 与 config schema migration 分离；受 `SYNC-UP-006` 控制 |
| 上游 SDK/source/access/review/Git 合同 | exact surface、comparator、probe、tool matrix 尚未闭合 | 未来演进只记为 `blocked/waiting/design-change-required`，不伪造正向迁移 |

诊断结论：当前不存在可迁移的正式旧配置；本 Step 的核心产物是“未来如何新增/重命名/废弃而不破坏 truth boundary”的规则，而不是编造一张历史迁移清单。

## 5. 设计取舍

| 议题 | 采用方案 | 不采用方案 | 取舍理由 |
|---|---|---|---|
| 旧草案是否保留 alias | 不把旧 README/05/06/draft 当作迁移对象 | 为旧草案提供兼容 alias | 草案没有发布基线；alias 会把历史污染伪装成正式兼容 |
| 新 key 的引入顺序 | 先闭合 04；如改变 03 再回写 03；之后才进入 05/06/07/09 和实施 | 先改 parser/代码再补文档 | 保持设计真相源和可落码闭环 |
| deprecated 期间的行为 | 明确 warning/issue、映射和窗口；不 silent fallback | 接受旧 key 后静默使用 default/cache/旧 snapshot | 防止配置漂移和误判生效 |
| unsupported P0 能力的兼容 | `config center`、`admin override`、`hot/reload`、online LKG 等直接 reject | 接受并忽略 key，或用 alias 隐式启用 | P0 没有相应 lifecycle、audit、rollback 和 owner contract |
| 敏感 ref 迁移记录 | 只保存 approved redacted canonical digest / marker | 记录 full old/new ref、raw secret 或 hash 原文 | 兼顾关联性与零泄露；hash 不是默认脱敏手段 |
| `.qs-sync` 与 config migration | 两条独立 migration 轨道，显式建立交叉依赖 | 把配置版本变化当作 metadata 自动迁移 | metadata 拥有 cursor/mapping/provenance 等 durable local truth，不能隐式改写 |
| Git LFS/浅克隆/GUI 等历史选择 | 作为待核验工具能力，不作为配置兼容项 | 通过 `git.*` alias 或 profile flag 默认启用 | 当前上游支持矩阵、dirty safety 和工具依赖未闭合 |

## 6. 结构化中间产物

### 6.1 当前配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | 无 | 当前无迁移项 | 不适用 | 正式 04 尚未发布，当前没有已发布 runtime config schema；旧 README/05/06/draft 不作为迁移对象 | 不适用 |

这张表是当前基线结论，不是遗漏。未来第一条正式迁移记录必须在旧 key 已发布且新 key 已完成 §6.3 的引入闭环后加入，不得把文档示例值或历史文字填入“旧配置”。

### 6.2 未来迁移状态定义

| 状态 | 含义 | Loader / activation 行为 | 必须同步的下游输入 |
|---|---|---|---|
| `active` | 当前正式配置项 | 按 strict schema 正常解析、校验和 cold activation | 05 正向/负向场景、06 门禁、07 task family、09 运行说明 |
| `introduced` | 已设计但只在明确 profile/feature 进入时使用 | 默认不隐式启用；必须显式 opt-in 且通过全套校验 | 新增配置切口、profile ceiling、未来 evidence 计划 |
| `deprecated` | 已有替代 key，仍在兼容窗口 | 可按已批准映射接受，产生 redacted warning/issue；不得 silent fallback 或覆盖更高优先级新 key | 迁移测试、warning 门禁、运维提示和回退检查 |
| `rejected` | 已声明不再接受，或 P0 明确不支持 | whole-candidate/entry/job reject；不得忽略未知 key | negative test、VETO 输入、移除说明 |
| `removed` | 兼容窗口结束且旧 key 已移除 | 作为 unknown/removed field reject；不重建旧 schema | release/migration 记录、rollback 兼容检查 |
| `design-change-required` | 会改变 03 或 ownership/security/lifecycle contract | 不进入当前 runtime schema；先回写 03、上游 owner 和受影响 Step | 设计回写、风险和下游重新校准 |

状态是设计层治理标签，不是已运行实例、版本发布事实或 readiness 标志。

### 6.3 新配置与重命名的引入规则

任何新 leaf、新 section、新 profile selector、旧 key 的新名称或新兼容映射，都必须按下列顺序闭合：

| 顺序 | 必须完成的判定 | 未满足时 |
|---:|---|---|
| 1 | 说明需求动机和 owner 边界，确认不是把 Project/Artifact/Baseline/Review Gate/Workspace/Archive/Git remote truth 配置化 | 记入风险；不得进入 schema |
| 2 | 检查是否改变 `ValidatedSyncRuntimeConfig`、builder、adapter constructor、Port、DTO、error、state、flow、durable carrier 或 snapshot lifecycle | 影响 03 时先回写 03；当前 04 停止该变更 |
| 3 | 在 04 补 canonical key、section、类型、required/nullable、默认允许性、单位/范围、source precedence、scope 和 activation | 信息不完整则不得实施 |
| 4 | 补 sensitive/ref-only/no-output、redaction 和 raw material reject 规则 | 未标注不得启用；raw secret/body/path/command 直接 reject |
| 5 | 补 cross-field、profile ceiling、capability posture 和 failure strategy | 不得把合法 ref 当 `bound`，不得 silent fallback |
| 6 | 补 change/audit/rollback；明确 cold composition、job-run-start、entry-local 或 test harness 的生效面 | 不得用 hot/LKG/原地 snapshot mutate 代替 |
| 7 | 补 05/06/07/09 的承接和 planned evidence 边界 | 下游未承接不得 release；不得预填结果 |
| 8 | 重新执行受影响 Step 的逐域停审和跨文档审计 | 发现冲突先回到相应 Step，不得由实施侧自行修补 |
| 9 | 只有在前述规则通过后，07 才能把它拆成 planned task/phase；正式实现仍需另外授权 | 不创建代码、implementation ledger、boundary skeleton 或 commit |

重命名不得通过大小写、别名、归一化路径或 section alias 绕过 strict duplicate/alias/unknown 检查。新旧 key 同时出现时，若映射规则未明确且可安全审计，whole-candidate reject；不得用“最后一次覆盖”。

### 6.4 兼容窗口、废弃与移除规则

| 阶段 | 配置状态 | 允许行为 | 禁止行为 | 进入下一阶段的条件 |
|---|---|---|---|---|
| 引入 | `introduced` | 只在明确 profile/feature opt-in；新 key 走完整 strict validation | 旧草案 alias、隐式 profile、silent default、fake promotion | schema/03 影响/下游承接已闭合 |
| 宣告废弃 | `deprecated` | 旧 key 按明确映射产生 redacted warning/issue；新 key 优先级和冲突规则固定 | 旧 key 静默接受、覆盖新 key、把 warning 当 accepted/readiness | 新旧 key 均有 planned 测试/门禁/运维输入 |
| 兼容窗口 | `deprecated` | 允许窗口内的受控映射；每次使用可关联但不泄露 raw value | 无期限兼容、旧 key fallback 到默认/cache/旧 snapshot、自动改写用户文件 | 所有允许 profile/载体不再依赖旧 key，且 rollback target 已检查 |
| 强制迁移 | `deprecated → rejected` | 旧 key 明确 validation reject，给出 safe issue/ref | 继续 warning 后运行、忽略旧 key、自动改写/删除输入文件 | 05/06/09 已承接 reject 和运维处置 |
| 移除 | `removed` | old key 作为 unknown/removed field reject；新 key 是唯一 canonical path | 保留隐式 alias、恢复旧 schema、删除 protected metadata/provenance | 迁移材料和设计审计闭合；不改变 03 truth |

兼容窗口的具体时长、发布号和环境清单留给未来 release/运维 owner；本 Step 只规定“必须显式声明，不能无限或静默”。

### 6.5 敏感 opaque ref 迁移与 redacted digest 规则

1. `sdk.*`、`metadata.*`、`localTools.*`、`support.*` 和身份相关 ref 仍然是 opaque ref；迁移材料不包含 raw secret、credential、endpoint/body、绝对路径、Git stdout/stderr、provider response 或完整 sensitive ref。
2. old/new ref 仅可在已批准的安全审计载体中以 `section/slot`、状态、profile class、validation/activation disposition 和 **approved redacted canonical digest/marker** 关联。该 digest 是关联标记，不是 Artifact、Baseline、evidence 或 readiness。
3. redacted digest 必须在 canonicalization 后生成，遵守现有 digest/ref contract；当前不锁定算法、编码、长度或具体库。若 digest contract 尚未闭合，迁移保持 `blocked/waiting`，不得自行对 raw ref 做普通 hash 并输出。
4. raw secret/material、完整 old/new ref、provider payload 和任何 digest 输入原文不得进入 config、snapshot、`.qs-sync`、log、metric、span、diagnostic、report、provenance 或迁移报告。
5. ref rotation 是新 opaque ref + 新 cold composition/restart（或新显式 job run pin）；旧 operation/plan/candidate/attempt 继续其原 `runtimeBindingSnapshotRef`。不得原地修改旧 snapshot，也不得因 rotation 换 key 盲重提 unknown handoff/apply。
6. 如果 ref 重命名同时改变 adapter constructor、capability、route、error、lifecycle 或 durable carrier，则这不是单纯配置迁移，必须先回写 03，再重开受影响的 04 Step。

### 6.6 `.qs-sync` metadata migration 与配置 schema migration 的边界

| 轨道 | 所属真相 | 本 Step 允许定义 | 当前不允许定义 |
|---|---|---|---|
| raw config schema migration | `src/config/*` 读取的 42-leaf candidate、`ValidatedSyncRuntimeConfig` 和 composition 输入 | key/section 重命名、required/nullable 变化、source/validation/activation 和下游承接规则 | parser/package、具体文件路径、部署载体或实现脚本 |
| `.qs-sync` metadata migration | L5-sync local sync truth：snapshot、selection、working-copy、cursor、mapping、conflict、checkpoint、attempt、provenance 等 | 只规定它必须与 config 迁移显式关联，保留 protected history、unknown 和 no-delete 纪律 | physical 文件/表/schema version、driver、migration order、retention、crash recovery、自动 repair/delete |
| runtime binding snapshot migration | 03 的 immutable binding context | 新 composition 可产生新 snapshot；在途对象继续旧 ref | 旧 snapshot 原地重写、把 new config 自动回填旧 operation、用当前 config 重建历史 truth |

配置 key 的 deprecated/removed 状态不会自动触发 `.qs-sync` 物理迁移；反之，metadata schema 变化也不能借用 config alias 静默完成。若未来两条轨道有依赖，必须在 03/04/07/09 中共同登记：受影响 carrier、版本关系、保护/回滚边界、未知结果处置和 planned evidence。`SYNC-UP-006` 未关闭前，不锁定任何 physical migration 事实。

### 6.7 未来演进候选队列

| 候选能力 | 当前姿态 | 进入条件 | 必须补充或回写 | P0 当前处理 |
|---|---|---|---|---|
| remote config center | `design-change-required / P1-P2 candidate` | 明确远程 source authority、可用性、优先级、审计和回退 | 03 loader/source/lifecycle、04 source precedence、07 task、09 runbook；若有 LKG 还需新的 durable carrier | 任何 remote source/key 直接 `unsupported/reject`，不 fallback local cache |
| admin override | `design-change-required` | actor/permission、审批、scope、冲突、审计和撤销闭合 | 00/03 ownership、error、audit、flow、06 VETO | 不接受 override key，不把 caller 当本地授权 |
| secret provider / KMS / Vault | `P1-P2 candidate / blocked` | provider/API、ref grammar、adapter-private lifecycle、rotation、outage 和 owner audit 闭合 | 03 adapter constructor/lifecycle/error，04 sensitive rules，07/09 operations | P0 只接 opaque ref；resolver 未闭合则 blocked/unknown/fail-closed |
| runtime hot reload | `design-change-required` | zero-downtime 目标、reload lifecycle、in-flight snapshot、partial failure、rollback 和 observability 闭合 | 03 composition/state/error/audit、04 activation、05/06/07/09 | reload/hot activation whole-request reject；无半热切换 |
| online last-known-good | `design-change-required` | 可信 durable carrier、digest/validation、staleness、选择/回退、权限和审计闭合 | 03 durable carrier/lifecycle、04 source/rollback、07/09 | 不保存或使用 online LKG；previous validated candidate 只通过显式 cold restart |
| `staging-like` profile | `P1 direction / waiting` | 真实依赖与 dry-run/安全边界定义 | 04 profile matrix、03 capability、05/06/09 gates | 不把环境名当 profile；不创建实例 |
| `production-like` profile | `P1/P2 direction / blocked` | approved provider、真实 store/source/handoff/Git/fs/tool/owner contract 和 release gates | 03 adapter/capability、04 profile/secret、05/06/07/09 | fake/deterministic/replay ref 直接 reject；不声明 readiness |
| Git LFS / shallow clone / GUI/Tauri | `historical choice / pending revalidation` | 当前上游 Git/filesystem support matrix、用户修改保护、性能/安全证据和本地工具依赖闭合 | 03 local-tool boundary、04 localTools schema（若确需）、07 implementation、09 ops | 不提供兼容 alias、开关或默认；继续 `SYNC-UP-007/009/010`、`SYNC-LOCAL-*` |
| configurable retry/backoff | `future / design-change-required` | command/consumer/job ownership、idempotency、unknown effect 和 policy contract 闭合 | 03 error/recovery/concurrency、04 schema、05/06/07 | 不新增 `RetryPolicyConfig`，不以迁移 key 开启自动 retry |

候选队列只表示未来入口和回写触发，不表示任何产品、provider、profile、工具、schema、部署或 readiness 已存在。

### 6.8 禁止作为迁移兼容的配置或行为

| 配置 / 行为 | 当前处理 | 原因 |
|---|---|---|
| raw secret、token、credential、private key、certificate/body、provider response | 永远 reject，无兼容成功窗口 | Step 8 零泄露红线 |
| endpoint/body、文件正文、Git stdout/stderr、任意 shell/argv/remote/refspec | reject；不做 alias | 保护敏感与本地安全边界 |
| static ownership/truth override、Project/Artifact/Baseline/Review Gate/Workspace/Archive/Git remote 选择 | reject 或回流正式设计 | Sync 不拥有这些 truth |
| Query repair/write、hidden refresh/probe | reject | Query zero-write |
| dirty-worktree overwrite、auto merge/rebase/push/stash | reject | 用户修改和 Git remote 不得被 Sync 私自改变 |
| hot/reload、online LKG、config center/admin override in P0 | reject | P0 没有相应 lifecycle/audit/rollback contract |
| fake/test/replay ref 进入 production-like | reject | profile isolation 与 capability ceiling |
| `.qs-sync` silent migrate/repair/delete、删除 protected provenance | reject/blocked | metadata physical contract 未闭合且 local truth 不得伪造 |
| ACK、local Git commit、log/metric、job report 充当 accepted/Artifact/Baseline/evidence/readiness | reject any such interpretation | truth/evidence boundary |

### 6.9 迁移与废弃的 planned evidence 边界（当前不生成）

| 未来材料 | 必须证明 | 允许的当前表述 | 当前禁止表述 |
|---|---|---|---|
| migration mapping material | old key→new key 映射唯一、source/priority 不漂移、无 silent fallback | `planned input` | “迁移报告已生成/已通过” |
| deprecation warning material | warning/issue 可关联且不含 raw value/full ref | `future planned` | “兼容窗口已运行” |
| removed-key negative material | old key 被明确 rejected，而非忽略 | `需在 05/06 承接` | “旧 key 已移除并验证” |
| profile/载体 scan | 兼容窗口结束后无允许载体继续使用 old key | `future scan boundary` | “所有环境已迁移” |
| rollback compatibility material | previous validated candidate 不依赖 removed key；cold restart 仍可审查 | `planned gate input` | “rollback 已执行/已成功” |
| sensitive redaction material | old/new ref 只以 approved redacted digest/marker 关联，raw material 不出面 | `planned redaction check` | “无泄露事实已证明” |
| metadata/config cross-migration material | 配置变化没有静默改写 `.qs-sync` cursor/mapping/provenance，任何依赖有显式 carrier | `blocked until SYNC-UP-006` | “metadata migration 已完成” |
| downstream synchronization material | 05/06/07/09 已同步新旧 key、失败和运维边界 | `planned downstream input` | “下游已签署/ready” |

以上均不是当前 evidence、report、verdict、signoff 或 readiness；真实材料必须由获授权的 05/06/07/09 流程产生并保留来源、run context、脱敏检查和停审链。

### 6.10 配置迁移逐域停审记录

| 配置域 | 当前迁移状态 | 未来重命名/废弃边界 | `.qs-sync` / snapshot 关系 | 03 影响 | 停审结论 |
|---|---|---|---|---|---|
| `identity`（2） | 当前无旧 key | canonical identity/profile 不能由路径、Project/version 或 alias 推断；重命名需显式窗口 | 新 composition 才采用新 identity；旧 operation 保留旧 snapshot | 当前无；若改 identity carrier 需回写 | 通过（带 blocker） |
| `boundary`（5） | 当前无旧 key | 数值 key 重命名须保留单位/范围/高优先级 no-fallback；不得用 clamp 兼容 | 不自动改写 local metadata；新 snapshot 只在 cold 生效 | 当前无 | 通过（带 blocker） |
| `execution`（8） | 当前无旧 key | timeout/concurrency key 的迁移不得变成 generic retry 或 unknown-as-failure | 在途 run/attempt 使用旧 snapshot/budget | 当前无 | 通过（带 blocker） |
| `jobs`（2） | 当前无旧 key | run budget 迁移不得改写旧 run、scope、actor、key 或 report | 新 run 才 pin 新预算；旧 run immutable | 当前无 | 通过（带 blocker） |
| `metadata`（3） | 当前无旧 key | adapter ref 重命名只迁移 logical binding；不得顺带宣称 physical schema migration | `.qs-sync` 物理迁移受 `SYNC-UP-006`；protected history 不删 | 当前无；physical change 需回写 | 通过（带 blocker） |
| `sdk`（7） | 当前无旧 key | provider/owner/source/handoff/Decision/probe ref 变更须保留四态和 ACK≠accepted | 新 composition 使用新 ref；旧 attempt 不重提 | 当前无；新 adapter/lifecycle 需回写 | 通过（带 blocker） |
| `localTools`（5） | 当前无旧 key | Git/fs/root-policy key 不可借 alias 启用 LFS/shallow/GUI/merge/rebase/push | 不覆盖 dirty worktree，不改 local history/remote truth | 当前无；工具支持矩阵闭合后再审 | 通过（带 blocker） |
| `support`（6） | 当前无旧 key | redaction 只能收紧；digest/ID 语义变化不得重算旧 truth | old snapshot/ID/digest 不重写；safe marker only | 当前无；新 carrier 需回写 | 通过（带 blocker） |
| `operations`（4 nullable） | 当前无旧 key | `null`↔ref 仍需 formal contract/capability；不以 alias 创建 topic/daemon/schedule | 新 cold registration / new job；旧 registration 不热换 | 当前无；新 Consumer/Job contract 需回写 | 通过（带 blocker） |

逐域结论：当前 42 个 leaf 都处于首版待发布基线，不存在历史迁移项；未来每个域的迁移都必须保留 source、activation、snapshot、local safety、truth ownership 和 evidence ceiling。

### 6.11 跨迁移与演进审计表

| 审计项 | 结论 | 依据 / 修正 |
|---|---|---|
| 是否明确当前无迁移项 | 是 | §6.1；正式 04 尚未发布，旧文档不是基线 |
| 是否把旧 README/05/06/draft 当 old config | 否 | §4；全部登记为 historical material |
| 新 key 是否必须先闭合 04/必要时 03 | 是 | §6.3；实施不得先加 key |
| 重命名是否允许 silent alias/last-write-wins | 否 | strict duplicate/alias/unknown reject；§6.3/§6.4 |
| 是否定义 deprecated、rejected、removed 和兼容窗口 | 是 | §6.2/§6.4；具体时长留 future owner |
| raw secret/full ref 是否进入迁移材料 | 否 | §6.5；只允许 approved redacted digest/marker |
| `.qs-sync` physical migration 是否被误锁定 | 否 | §6.6；`SYNC-UP-006` 持续 blocker |
| future config center/secret provider/hot/LKG 是否被当作 P0 | 否 | §6.7；均为 future/design-change-required |
| LFS/浅克隆/GUI 是否被旧选择自动继承 | 否 | §5、§6.7；当前上游重新核验前不进入 schema |
| 迁移回滚是否会撤销外部 effect | 否 | 配置只重新 cold compose；SDK/Git/fs/Review effect 仍按 03 unknown/probe/manual |
| 迁移材料是否被写成 evidence/verdict/readiness | 否 | §6.9；全部是 planned boundary |
| 是否需要当前回写 03 | 否 | 目前只有配置治理规则；未来改变 runtime/builder/adapter/error/state/flow/carrier 才回写 |

## 7. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前没有已发布旧配置迁移项 | 否 | 配置版本/发布基线说明 | 不适用 | 无回写 |
| 新配置必须先完成 04 schema、校验、敏感、失败和下游承接 | 否 | 配置治理规则 | 不适用 | 无回写 |
| 重命名不得以 alias、last-write-wins 或 silent fallback 绕过 strict loader | 否 | 既有 loader/validator 规则细化 | 不适用 | 无回写 |
| 敏感 ref 只用 approved redacted digest/marker 关联，rotation 通过新 cold composition | 否 | 承接既有 redaction/snapshot/activation | 不适用 | 无回写 |
| `.qs-sync` metadata migration 与 config schema migration 分离 | 否（当前） | 承接 logical metadata ownership 与 `SYNC-UP-006` blocker | 不适用 | 无回写 |
| LFS/浅克隆/GUI 等历史选择需上游重新核验 | 否（当前） | 保持 localTools blocker，不新增 schema | 不适用 | pending / blocker 保留 |
| 若未来引入 config center/admin override/hot reload/online LKG/具体 secret provider/新的 retry policy/Consumer/Job contract | 是（未来触发） | 会改变 loader、builder、adapter lifecycle、error/recovery、audit、durable carrier 或 operations flow | `03` §10～§15 及受影响校准 Step；并回到 04 受影响 Step | `design-change-required / blocked`，当前不进入正式 04 |

当前计数：`待回写=0`；`当前阻塞待确认=0`。最后一行是未来变更触发器，不是当前配置结论；外部 blocker 仍保持原编号和状态。

## 8. 回填草稿（未来正式 `04-配置设计.md` §13）

> 校准来源：
> - `design-calibration/04_config_step_13_migration_deprecation_evolution.md`
>
> 延伸阅读：建议继续阅读本文件的“当前配置迁移与废弃表”“未来迁移状态定义”“新配置与重命名的引入规则”“兼容窗口、废弃与移除规则”“敏感 opaque ref 迁移与 redacted digest 规则”“`.qs-sync` metadata migration 与配置 schema migration 的边界”“未来演进候选队列”“禁止作为迁移兼容的配置或行为”“迁移与废弃的 planned evidence 边界”“配置迁移逐域停审记录”和“跨迁移与演进审计表”。

正式 `04-配置设计.md` §13 应按以下顺序回填：

1. 明确当前“无迁移项”，并说明正式 04 尚未发布、旧材料不构成基线。
2. 回填未来状态定义：`active`、`introduced`、`deprecated`、`rejected`、`removed`、`design-change-required`。
3. 回填新配置/重命名的九步引入规则，特别保留 03 回写触发和下游承接门禁。
4. 回填兼容窗口、warning/issue、强制迁移和移除条件；不写未确认的窗口时长。
5. 回填敏感 ref 的 approved redacted digest/marker、cold rotation、旧 snapshot pinning 和 no-output 边界。
6. 回填 `.qs-sync` metadata 与 config schema 的双轨边界，保留 `SYNC-UP-006`，不锁 physical migration。
7. 回填 future config center、secret provider、hot reload、online LKG、profile 和 Git 工具选择的演进队列；不得将其写成 P0 能力。
8. 回填禁止兼容项、planned evidence 边界、逐域停审和 03 影响判定。

正式正文不得新增本中间产物、上游正式文档或用户确认之外的 key、状态、版本、产品、命令、迁移脚本或运行事实。

## 9. 待确认事项与 blocker 传播

| 待确认事项 | 影响 | 未确认前处理 | 状态 |
|---|---|---|---|
| 正式 04 首版版本号/发布时间 | 未来迁移基线 | Step 15 装配时确定；当前不写版本事实 | waiting |
| 兼容窗口的具体时长和发布载体 | deprecated→rejected 时间线 | 只要求显式声明；不猜 duration/环境 | waiting |
| 未来 secret provider/API/rotation | adapter lifecycle、03 error/audit | opaque ref；positive resolution blocked/unknown | `SYNC-UP-001/003/005` + future |
| remote config center/admin override/hot/LKG 是否进入范围 | source/lifecycle/rollback/carrier | P0 reject；若采纳先回写 03/04 | design-change-required |
| `.qs-sync` physical schema/migration/retention/crash semantics | metadata cross-migration | 只保留 logical relation；不锁物理方案 | `SYNC-UP-006` |
| SDK/source/permission/handoff/probe exact contracts | positive route migration | 不迁移为 bound；保留 blocked/unknown | `SYNC-UP-001~005/008` |
| Git LFS/浅克隆/GUI 支持矩阵与本地工具链 | localTools future keys/adapter | 不提供 alias/flag/default；等待核验 | `SYNC-UP-007/009/010`、`SYNC-LOCAL-001~005` |
| 未来 Consumer/Job formal contract | operations slot migration | `null`/blocked；不创建 topic/daemon/schedule | `SYNC-UP-005/008` |
| migration mapping/deprecation/redaction 的实际报告载体 | 05/06/07/09 planned evidence | 仅定义字段边界；不创建报告或索引 | future downstream |

这些事项不阻塞本 Step 的规则闭合，但在未确认前不得把候选能力、工具支持、迁移报告或下游签署写成正式事实。

## 10. Step 自检与进入下一步门禁

| 检查项 | 结果 | 依据 |
|---|---|---|
| 已回答 SOP Step 13 五个问题 | pass | §3：当前迁移、新配置、废弃、窗口和移除 |
| 明确“当前无迁移项”且没有把旧材料当 baseline | pass | §4、§6.1 |
| 新配置/重命名规则包含 03 影响和下游承接门禁 | pass | §6.3 |
| deprecated/rejected/removed、兼容窗口和移除条件闭合 | pass | §6.2、§6.4 |
| raw secret/full ref/endpoint/body/path/Git 输出不会进入迁移材料 | pass | §6.5、§6.9 |
| redacted digest 不是默认 hash，算法未被伪造锁定 | pass | §6.5 |
| `.qs-sync` metadata migration 与 config schema migration 边界清楚 | pass | §6.6；`SYNC-UP-006` 未关闭 |
| future config center/secret provider/hot/LKG/profile 与 P0 隔离 | pass | §6.7、§6.8 |
| Git LFS/浅克隆/GUI 等旧选择已标为待核验，不被兼容继承 | pass | §5、§6.7、§6.10 |
| planned evidence 与真实 evidence/report/verdict/signoff/readiness 分离 | pass | §6.9 |
| 42 leaf 分域、operations null、snapshot pinning、truth ownership 红线无漂移 | pass | §6.10、§6.11 |
| 当前无需要回写 03 的配置结论；未来触发器已列明 | pass | §7 |
| 未创建正式 04、Step 14/15 文件；未实现/测试/提交 | pass | 文件与台账纪律 |

## 11. 进入下一步条件与停审记录

| 条件 | 状态 | 说明 |
|---|---|---|
| 当前迁移基线明确 | 通过 | 当前无已发布旧配置迁移项 |
| 新配置引入规则明确 | 通过 | 先 04，必要时先回 03，再进入下游/实施 |
| 重命名、废弃、兼容窗口、移除规则明确 | 通过 | 不 silent fallback；窗口必须显式声明 |
| 敏感 ref 迁移和 redacted digest 边界明确 | 通过 | raw/full ref 不出任何 carrier |
| `.qs-sync` 与 config migration 边界明确 | 通过 | physical migration 继续受 `SYNC-UP-006` 阻塞 |
| future 演进与 P0 切开 | 通过 | config center/secret provider/hot/LKG/production-like 等均非当前能力 |
| planned evidence 上限明确 | 通过 | 当前没有 report/evidence/verdict/signoff/readiness |
| 03 影响判定已记录 | 通过 | 当前 `待回写=0`；未来 contract 变化先回写 |
| 可进入 Step 14 | 通过（带上游 blocker） | 下一动作是更新 flow/ledger 后进入 Step 14；本 Step 停审 |

### Step 13 结论

`Step status = completed / stop_review`；`gate_status = pass_with_upstream_blockers`。

本 Step 已完成配置首版迁移基线、重命名/废弃/兼容窗口、敏感 ref 迁移、`.qs-sync` 双轨边界和未来演进触发规则。正式 `04-配置设计.md` 仍不得创建；不得进入 Step 15。下一动作仅是更新 04 flow 与项目台账后，进入 Step 14 风险与待确认校准。
