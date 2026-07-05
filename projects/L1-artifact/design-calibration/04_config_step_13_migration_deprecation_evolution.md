# Step 13. 定义配置迁移、废弃与演进

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 13
> 回填章节: `04-配置设计.md` §13 配置迁移、废弃与演进

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 定义配置迁移、废弃与演进 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 7 配置项清单;Step 8 敏感配置;Step 9 加载校验;Step 10 变更审计与回滚;Step 11 失效模式;Step 12 下游承接;旧 `05/06` 历史材料;配置设计书写规范 §5.13 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_13_migration_deprecation_evolution.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 14 |

## 2. 本步目标

本 Step 定义 `L1-artifact` 配置的新增、重命名、废弃、迁移和移除规则,并明确当前 P0 首版是否存在需要迁移的旧配置契约。

本 Step 只回答:

- 当前是否存在旧配置需要迁移。
- 新配置如何引入,需要满足哪些设计闭环和下游同步条件。
- 旧配置如何废弃,是否需要兼容窗口。
- 何时允许移除旧配置。
- future P1/P2 能力,如 `staging-like` / `production-like`、secret provider、config center、hot reload,如何进入演进队列而不是被当成 P0 默认能力。

本 Step 不定义:

- 具体版本号、release train、迁移脚本路径或自动化工具。
- 具体产品型 DB / bus / secret provider / config center / endpoint 参数。
- 已被 Step 5~11 判定为 P0 unsupported 能力的实现方案。
- 正式 `04-配置设计.md` 的版本号;正式装配仍在 Step 15。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_07_config_items.md` | 已完成 | 提供当前 P0 config schema 和 future watchpoint |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供 sensitive migration、redaction 和 raw secret 禁止边界 |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供 strict JSON、unsupported reload/hot 和 future activation 回写点 |
| `04_config_step_10_change_audit_rollback.md` | 已完成 | 提供 high-risk change review、rollback target 和 config center/hot reload watchpoint |
| `04_config_step_11_failure_degradation.md` | 已完成 | 提供 future config center / secret provider / online LKG 的 failure watchpoint |
| `04_config_step_12_downstream_handoff.md` | 已完成 | 提供 `05/06/07/09` 的同步承接要求 |
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供 `staging-like` / `production-like` 只作为 P1/P2 方向的约束 |
| `projects/L1-artifact/05-测试方案.md` | 旧正式草案 / 历史材料 | 用于确认旧 `dev/test/staging` 文字不是当前正式配置契约 |
| `projects/L1-artifact/06-验收标准.md` | 旧正式草案 / 历史材料 | 用于确认旧环境 / gate 文字不是当前正式配置契约 |
| `standards/document/配置设计书写规范.md` §5.13 | 已检查 | 提供迁移 / 废弃表结构和兼容窗口要求 |
| `projects/L1-governance/design-calibration/04_config_step_13_migration_deprecation_evolution.md` | 已参考 | 提供 Step 13 粒度框架,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 是否存在旧配置需要迁移? | 当前无。正式 `04-配置设计.md` 尚未装配发布,也没有已发布的 `ArtifactRuntimeConfig` 首版 schema。旧 `05/06` 中的 `dev/test/staging` 只是历史文案,不是正式配置契约,不作为迁移对象。 |
| 新配置如何引入? | 新配置必须先回到 `04` 完成 schema、默认值、来源、作用域、生效、敏感级别、失败策略、变更审计、失效策略和下游承接的闭合。若改变 runtime builder、adapter constructor、port、DTO、error、flow,必须同步回写 `03` 后才能进入实施计划。 |
| 旧配置如何废弃? | 已发布配置不得无说明删除。废弃必须标明 `deprecated` 状态、兼容窗口、warning/error 升级路径、迁移目标、evidence 和移除条件。敏感配置废弃仍只能输出 redacted digest,不得暴露 old/new full ref。 |
| 是否需要兼容窗口? | 当前 P0 首版无兼容窗口需求。未来一旦存在已发布 key rename/replace/remove,必须定义兼容窗口。安全红线项,如 raw secret、boundary override、P0 hot/reload、config center key,不提供兼容成功窗口,只能 reject。 |
| 何时允许移除旧配置? | 只有在旧配置已正式 `deprecated`、兼容窗口结束、测试/验收/实施/运维承接完成、release evidence 证明不再使用、rollback 目标不依赖旧 key 且删除不改变 `03` 契约时,才允许移除。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 正式 `04` | 尚未装配,没有首版已发布 schema | 明确当前无迁移项 |
| 旧 `05/06` | 仍含旧 `dev/test/staging` 语义,但不属于配置真相源 | 明确它们不是迁移兼容对象,只作为后续 full-restart 输入 |
| Step 6 | `staging-like` / `production-like` 只是 future direction | 本 Step 把它们列入 future evolution queue |
| Step 8~11 | secret provider、config center、hot reload、online LKG 多处被标记为 future | 本 Step 统一收束为 design-change-required / P1/P2 candidate |
| 后续实施 | 实现侧可能直接新增 key | 本 Step 固定新增配置必须先设计闭合 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前迁移状态 | 未声明 | 明确“当前无迁移项” | SOP 要求暂无迁移也必须说明 |
| 新配置引入 | 分散在各 Step watchpoint | 固定新增配置的闭合流程 | 防止实现侧直接加 key |
| 废弃规则 | 未集中定义 | 增加 deprecated / rejected / removed 规则 | 防止无说明删除配置 |
| future 能力 | 分散在 Step 6 / 8 / 9 / 10 / 11 | 汇总成 evolution queue | 防止 P0 被 future 能力污染 |
| 历史材料定位 | 旧 `05/06` 可能被误当兼容来源 | 明确只作历史材料和差异审计 | 保持真相源单一 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 首版是否保留旧环境 alias | A. 保留旧 `dev/test/staging` alias;B. 不作为迁移对象 | 采用 B。旧 `05/06` 不是正式配置契约 |
| 新配置是否可由实现先加 | A. 先加实现再补文档;B. 先设计闭合再实施 | 采用 B。保持设计真相源闭环 |
| unsupported 能力是否接受兼容 key | A. 接受但忽略;B. 直接 reject | 采用 B。P0 不允许 silent compatibility |
| 废弃期是否允许 silent fallback | A. 允许;B. 要求 warning / error 升级 | 采用 B。避免漂移被掩盖 |
| sensitive migration evidence 是否记录 full refs | A. 记录 full ref;B. 只记录 redacted digest | 采用 B。承接 Step 8 / Step 10 |

## 8. 结构化中间产物

### 8.1 当前配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | 无 | 当前无迁移项 | 不适用 | 正式 `04` 尚未发布;旧 `05/06` 历史文案不作为迁移对象 | 不适用 |

### 8.2 配置演进状态定义

| 状态 | 含义 | Loader 行为 | 审计 / 测试要求 |
|---|---|---|---|
| `active` | 当前正式配置项 | 正常 parse / validate / activate | 正常测试与验收 |
| `introduced` | 新增,但仅在 future profile / feature 中使用 | explicit opt-in;必须完整 validation | 新增配置测试和下游承接 |
| `deprecated` | 已有替代项,仍处兼容窗口 | 可接受 old key,产出 redacted deprecation issue / warning | migration tests + warning evidence |
| `rejected` | 当前明确不支持 | validation reject | negative tests + acceptance veto |
| `removed` | 兼容窗口结束,配置项不可再用 | removed/unknown field reject | removal evidence + release note |
| `design-change-required` | 会改变 `03` 契约 | 不进入 runtime schema | 必须先回 `03/04` |

### 8.3 新配置引入规则

| 步骤 | 要求 | 不满足时处理 |
|---|---|---|
| 1. 明确动机 | 必须指向需求、架构、详细设计或运维承接缺口 | 记入 Step 14 风险,不得实施 |
| 2. 判定是否影响 `03` | 检查 runtime builder、adapter constructor、port、DTO、error、flow、state/persistence | 影响 `03` 时先回写详细设计 |
| 3. 补 `04` schema | 写类型、默认、必填、来源、作用域、生效、敏感、失败策略 | 未补齐不得进入实施 |
| 4. 补 source / priority | 明确 defaults/file/env/entry/job 是否参与 | 不明确则 fail design review |
| 5. 补 sensitive / no-output | 标注 `public/internal/sensitive/secret` 和 redaction | 未标注不得启用 |
| 6. 补 validation / activation | parse/type/range/cross-field/sensitive/static-boundary 和 activation | 未闭合不得实现 |
| 7. 补 change / rollback | high-risk 需评审、审计、rollback | 无 rollback 不得 release |
| 8. 补 failure strategy | fail-fast/fail-closed/degraded/delayed/failed marker | 不得 silent fallback |
| 9. 补 downstream handoff | 更新 `05/06/07/09` 输入和 evidence | 下游未承接则不得 release |

### 8.4 废弃与移除规则

| 阶段 | 配置状态 | Loader 行为 | 下游要求 | 退出条件 |
|---|---|---|---|---|
| 宣告废弃 | `deprecated` | 接受旧 key,生成 redacted warning/issue | `05` 增加 warning test;`09` 增加运维提示 | 新旧 key 同时覆盖 |
| 兼容窗口 | `deprecated` | old key 可映射到 new key,但不得覆盖显式 new key | `06` 验收 warning;release evidence 记录使用量 | evidence 显示旧 key 不再使用 |
| 强制迁移 | `deprecated` -> `rejected` | old key 变 validation reject | `05/06` 增加 negative gate | 所有 profile artifact 已迁移 |
| 移除 | `removed` | old key 作为 removed/unknown field reject | release note / evidence index | rollback 目标不再依赖旧 key |

### 8.5 未来演进候选表

| 候选能力 | 当前状态 | 进入条件 | 必须补充的设计 |
|---|---|---|---|
| `staging-like` profile | P1 direction only | 真实依赖 dry-run 进入范围 | durable refs、provider-facing refs、validation gates、ops handoff |
| `production-like` profile | P1/P2 direction only | 生产运行成为范围 | no fake/test fixture、approved provider refs、real store/bus/handoff config |
| durable store product refs | P1/P2 | 产品选型完成 | store ref schema、availability、backup/restore、rollback |
| real bus/topic binding | P1/P2 | bus binding 成为目标 | transport route schema、credential refs、dead-letter ops |
| secret provider / KMS / Vault | P1/P2 | 安全运维产品确定 | provider ref schema、rotation、health failure、redaction audit |
| remote config center | `design-change-required` | 需要远程配置且有回滚/审计 | source priority、availability、rollback、LKG、admin override boundary |
| admin override | `design-change-required` | 必须有审批/审计和安全模型 | actor/capability/audit、override scope、conflict handling |
| runtime hot reload | `design-change-required` | 需要 zero-downtime config update | reload lifecycle、rollback、adapter swap、partial failure semantics |
| online last-known-good | `design-change-required` | reload/config center 进入范围 | LKG storage、validation、digest、activation、audit |
| retry policy body | P1/P2 | backoff 策略需配置化 | policy schema、range validation、job/worker semantics |

### 8.6 禁止作为迁移兼容的配置

| 配置 / 行为 | 处理 | 原因 |
|---|---|---|
| raw secret / raw body | 永远 reject,不提供兼容窗口 | 安全红线 |
| static boundary override | 永远 reject | 破坏 truth/query/idempotency 不变量 |
| P0 hot / reload key | reject | P0 无 reload contract |
| config center / admin override key in P0 | reject | P0 无 remote config source |
| production-like fake/test fixture | reject | profile isolation |
| `allowHighCardinalityLabels=true` in P0 | reject | observability safety |
| query repair/write switch | reject | query no-write |
| outbox payload current-truth rebuild switch | reject | payload snapshot truth source 不可改变 |

### 8.7 迁移 evidence 要求

| Evidence | 何时需要 | 必须证明 |
|---|---|---|
| migration mapping report | old key -> new key 迁移 | 映射明确,无 silent fallback |
| deprecation warning report | `deprecated` 兼容窗口 | warning redacted,不含 raw value |
| removed-key negative report | old key removed/rejected | old key fails validation |
| profile artifact scan | 兼容窗口结束前 | 所有 profile config 不再使用旧 key |
| rollback compatibility report | 移除前 | previous validated rollback target 不依赖旧 key |
| downstream update report | `05/06/07/09` 同步后 | 下游文档和 evidence 已同步 |
| redaction report | sensitive migration | old/new refs 只以 digest 输出 |

### 8.8 配置迁移停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 当前是否有旧配置迁移项 | 无 | 首版正式 `04` 尚未发布 |
| 是否说明无迁移项 | 通过 | 见 §8.1 |
| 新配置引入规则是否闭合 | 通过 | 见 §8.3 |
| 废弃/移除规则是否闭合 | 通过 | 见 §8.4 |
| future P1/P2 演进是否与 P0 切开 | 通过 | 见 §8.5 |
| 安全红线是否禁止兼容 | 通过 | 见 §8.6 |
| migration evidence 是否明确 | 通过 | 见 §8.7 |

### 8.9 跨迁移演进审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否无说明删除已发布配置 | 不允许 | 必须走 `deprecated` -> `rejected/removed` |
| 是否把旧 `05/06` 当正式兼容对象 | 不作为 | 旧文档不是配置真相源 |
| 是否允许实现侧先新增 config key | 不允许 | 必须先回 `04`,必要时回 `03` |
| 是否给 unsupported P0 能力兼容成功窗口 | 不允许 | config center/hot reload/admin override P0 reject |
| 是否覆盖 sensitive migration redaction | 覆盖 | only redacted digest |
| 是否需要回写 `03` | 当前无 | future config center / hot reload / provider contract 需回写 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前无已发布旧配置迁移项 | 否 | 配置版本状态 | 不适用 | 无回写 |
| 新配置必须先完成 `04` schema / validation / sensitive / failure / downstream 闭合 | 否 | 配置治理规则 | 不适用 | 无回写 |
| 若新配置改变 runtime builder、adapter constructor、port、DTO、error 或 flow,必须先回写 `03` | 否 | 设计闭环规则 | 不适用 | 无回写 |
| unsupported P0 能力不提供兼容成功窗口 | 否 | 承接 Step 5 / 9 / 11 | 不适用 | 无回写 |
| future config center、admin override、hot reload、online LKG、secret provider health contract | 是 | runtime loader / builder / adapter / error / audit contract | `03` Step 12 / Step 14 / Step 15 | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_13_migration_deprecation_evolution.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“当前配置迁移与废弃表”“配置演进状态定义”“新配置引入规则”“废弃与移除规则”“未来演进候选表”“禁止作为迁移兼容的配置”“迁移 evidence 要求”和“跨迁移演进审计表”小节。

正式 `04-配置设计.md` §13 应回填:

- 当前配置迁移与废弃表。
- 配置演进状态定义。
- 新配置引入规则。
- 废弃与移除规则。
- 未来演进候选表。
- 禁止作为迁移兼容的配置。
- 迁移 evidence 要求。
- 配置迁移停审记录。
- 跨迁移演进审计表。
- 对详细设计的影响判定。

回填要求:

- 必须明确“当前无迁移项”。
- 不允许无说明地删除已发布配置。
- 新增 / 废弃配置必须说明兼容窗口。
- P0 unsupported 能力不得通过兼容 key 静默启用。
- 涉及 `03` 契约变化的演进必须先回写详细设计。
- 正式 `04-配置设计.md` 仍需等 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 正式 `04` 首版版本号和发布时间 | 影响后续迁移基线 | Step 15 装配时确定 |
| `staging-like` / `production-like` 是否进入 P1/P2 | 影响 future profile migration | 当前只记录候选 |
| future secret provider / config center / hot reload 是否进入设计 | 影响 `03/04/07/09` | Step 14 风险项继续收口 |
| 是否需要迁移自动化工具 | 影响实施计划 | 当前不定义 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置演进策略明确 | 通过 | 见 §8.2 ~ §8.5 |
| 当前迁移项状态已说明 | 通过 | 当前无迁移项 |
| 新配置引入规则已定义 | 通过 | 见 §8.3 |
| 废弃与移除规则已定义 | 通过 | 见 §8.4 |
| 禁止兼容的安全/静态边界已定义 | 通过 | 见 §8.6 |
| migration evidence 已定义 | 通过 | 见 §8.7 |
| 迁移停审完成 | 通过 | 见 §8.8 |
| 跨迁移演进审计无 unresolved 冲突 | 通过 | 见 §8.9 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 14 | 通过 | 下一步定义风险与待确认事项 |
