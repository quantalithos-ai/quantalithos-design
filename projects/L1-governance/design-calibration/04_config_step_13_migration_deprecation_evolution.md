# Step 13. 定义配置迁移、废弃与演进

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 13
> 回填章节: `04-配置设计.md` §13 配置迁移、废弃与演进

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 13 定义配置迁移、废弃与演进 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 7 配置项清单;Step 8 敏感配置;Step 9 加载校验;Step 10 变更回滚;Step 11 失效模式;Step 12 下游承接;配置设计书写规范 §5.13 |
| 输出文件 | `projects/L1-governance/design-calibration/04_config_step_13_migration_deprecation_evolution.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 14 |

## 2. 本步目标

本 Step 定义 `L1-governance` 配置新增、重命名、废弃、迁移和移除的规则,并明确当前 P0 是否存在已发布旧配置需要迁移。

本 Step 只回答:

- 当前是否存在旧配置迁移项。
- 新配置如何引入,需要满足哪些设计闭环和下游承接条件。
- 旧配置如何废弃,是否需要兼容窗口。
- 何时允许移除旧配置。
- 未来 P1/P2 能力,例如 secret provider、config center、hot reload、production-like 产品配置,如何进入演进队列而不是被当作 P0 默认能力。

本 Step 不定义:

- 具体配置版本号发布计划、release train、迁移脚本路径或自动化工具。
- 具体产品型 DB / bus / secret provider / config center / endpoint / alert 产品。
- 已经被 Step 5~11 判定为 P0 unsupported 的能力的实现方案。
- 正式 `04-配置设计.md` 的版本号;正式文档装配仍在 Step 15。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_07_config_items.md` | 已完成 | 提供当前 P0 配置项清单和 future P1/P2 提示 |
| `04_config_step_08_sensitive_secrets.md` | 已完成 | 提供 future secret provider、sensitive ref 轮换和 raw secret 禁止边界 |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供 strict JSON、unsupported reload/hot、future reload 回写点 |
| `04_config_step_10_change_audit_rollback.md` | 已完成 | 提供 high-risk change review、rollback 和 future config center/hot reload 回写点 |
| `04_config_step_11_failure_degradation.md` | 已完成 | 提供 future config center / secret provider / online LKG 的风险和 failure 方向 |
| `04_config_step_12_downstream_handoff.md` | 已完成 | 提供下游测试、验收、实施、运维承接要求 |
| `配置设计书写规范.md` §5.13 | 已检查 | 提供迁移与废弃表结构和“新增/废弃必须说明兼容窗口”要求 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 是否存在旧配置需要迁移? | 当前无已发布正式 `04-配置设计.md`,也没有已发布 governance runtime config schema。因此 P0 当前无旧配置迁移项。旧 `05/06` 中的 dev/test/staging 配置描述是旧草案输入,不是已发布配置契约,不作为迁移对象。 |
| 新配置如何引入? | 新配置必须先回到 `04` 修改配置项 schema、默认值、来源、作用域、生效方式、敏感级别、失败策略、变更审计、失效策略和下游承接;若改变 runtime builder、adapter constructor、port、error、flow 或 DTO,必须同步回写 `03`。实施计划只能在设计闭合后拆 commit。 |
| 旧配置如何废弃? | 已发布配置不得无说明删除。废弃必须标记状态、兼容窗口、validation warning/error 升级路径、迁移目标、审计和移除条件。敏感配置废弃还必须确认 old ref 不会泄露到 log/audit/report。 |
| 是否需要兼容窗口? | 当前 P0 首版无兼容窗口需求。未来已发布配置重命名/替换时必须定义兼容窗口。安全关键配置、raw secret 禁止项、static boundary override、hot/reload unsupported 这类不提供兼容成功窗口,只能 reject 或正式设计变更。 |
| 何时允许移除旧配置? | 只有在旧配置被标记 deprecated、兼容窗口结束、测试/验收/运维承接完成、release evidence 证明无使用、rollback 策略不依赖旧 key、且删除不会改变 `03` 契约时,才允许移除。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 正式 `04` | 尚未创建,没有已发布配置版本 | 明确当前无迁移项 |
| 旧 `05/06` | 有旧配置环境描述,但不是新版配置契约 | 不作为迁移对象,只作为后续重写输入 |
| Step 5~11 | 多处记录 future secret provider/config center/hot reload | 本 Step 收为未来演进项,不进入 P0 schema |
| Step 12 | 下游承接尚未实际重写 | 本 Step 要求未来迁移必须同步更新 `05/06/07/09` |
| 未来配置变更 | 可能被实施侧直接添加 key | 本 Step 固定新增配置必须先设计闭合 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 旧配置迁移 | 未声明 | 当前无迁移项 | SOP 要求暂无迁移也必须说明 |
| 新配置引入 | 只在各 Step 待确认中散落 | 固定新增配置设计闭合流程 | 防止实现侧直接加 config key |
| 废弃规则 | 未定义 | 定义 deprecated、兼容窗口、warning/error、移除条件 | 防止无说明删除配置 |
| P1/P2 演进 | 分散在 profile、secret、failure、handoff | 汇总为 future evolution queue | 防止 P0 被未来能力污染 |
| 下游同步 | Step 12 已承接 | 本 Step 要求迁移/废弃也同步下游 evidence | 防止 `04` 与 `05/06/07/09` 分叉 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 首版是否保留旧草案 config alias | A. 保留 alias;B. 不作为迁移对象 | 采用 B。旧 `05/06` 草案不是正式配置契约 |
| 新配置是否可由实施先加 | A. 实施先加再回文档;B. 先设计闭合再实施 | 采用 B。保持真相源闭环 |
| unsupported 能力是否保留兼容 key | A. 接受但忽略;B. reject unsupported | 采用 B。config center/hot reload/admin override 在 P0 出现即 fail-fast |
| 废弃期是否允许 silent fallback | A. 允许;B. 明确 warning/error 并要求迁移 | 采用 B。避免隐式兼容掩盖配置漂移 |
| 敏感配置迁移是否记录 full old/new ref | A. 记录完整 ref;B. 记录 redacted digest | 采用 B。承接 Step 8 / Step 10 |

## 8. 结构化中间产物

### 8.1 当前配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | 无 | 当前无迁移项 | 不适用 | 当前尚未发布正式 `04` / runtime config schema;旧 `05/06` 配置文字不作为迁移对象 | 不适用 |

### 8.2 未来迁移状态定义

| 状态 | 含义 | Loader 行为 | 审计 / 测试要求 |
|---|---|---|---|
| `active` | 当前正式配置项 | 正常 parse/validate | 正常测试和验收 |
| `introduced` | 新增但仅在未来 profile / feature 中使用 | 默认 disabled 或 explicit opt-in;必须 validation | 新增配置测试和下游承接 |
| `deprecated` | 已有替代项,仍处兼容窗口 | 可接受但输出 redacted warning/issue;不得 silent fallback | 迁移测试、warning evidence、运维提示 |
| `rejected` | 曾考虑但 P0 明确不支持 | validation reject | negative test and acceptance veto |
| `removed` | 兼容窗口结束,配置项不可再使用 | unknown/removed field reject | removal evidence and release note |
| `design-change-required` | 会改变 `03` 或安全边界 | 不进入 runtime schema | 必须先回设计 |

### 8.3 新配置引入规则

| 步骤 | 要求 | 不满足时处理 |
|---|---|---|
| 1. 明确配置动机 | 指向需求、架构、详细设计或运维承接问题 | 记入 Step 14 风险,不得实施 |
| 2. 判定是否改变 `03` | 检查 runtime config、builder、adapter constructor、port、DTO、error、flow、state/persistence | 影响 `03` 时先回写详细设计 |
| 3. 补 `04` schema | 写入配置项、类型、默认、必填、来源、作用域、生效、敏感、失败策略 | 未补齐则不进入实施计划 |
| 4. 补 source / priority | 明确 defaults/file/env/job/entry 是否参与 | 不明确则 fail design review |
| 5. 补 sensitive / no-output | 标注 public/internal/sensitive/secret 和 redaction | 未标注不得启用 |
| 6. 补 validation / activation | parse/type/range/cross-field/sensitive/static-boundary validation 和生效方式 | 未闭合不得实现 |
| 7. 补 change / rollback | high-risk 需评审、审计、rollback | 无 rollback 不得启用 |
| 8. 补 failure strategy | fail-fast/fail-closed/degraded/delayed/failed marker | 不得 silent fallback |
| 9. 补 downstream handoff | `05/06/07/09` 输入和 evidence | 下游未承接则不得 release |

### 8.4 废弃与移除规则

| 阶段 | 配置状态 | Loader 行为 | 下游要求 | 退出条件 |
|---|---|---|---|---|
| 宣告废弃 | `deprecated` | 接受旧 key,生成 redacted deprecation issue/warning | `05` 增加旧 key warning 测试;`09` 写运维提示 | 新旧 key 同时有测试 |
| 兼容窗口 | `deprecated` | old key 可映射到 new key,但不得覆盖更高优先级 new key | `06` 验收迁移 warning;release evidence 记录使用量 | evidence 显示旧 key 不再使用 |
| 强制迁移 | `deprecated` -> `rejected` | old key 变 validation reject | `05/06` negative gate;`09` 更新 runbook | 所有 profile artifact 已迁移 |
| 移除 | `removed` | old key 作为 unknown/removed field reject | release note / evidence index | 无 rollback target 依赖旧 key |

### 8.5 未来演进候选表

| 候选能力 | 当前状态 | 进入条件 | 必须补充的设计 |
|---|---|---|---|
| `staging-like` profile | P1 direction only | 真实依赖 dry-run 进入范围 | product-neutral durable refs、secret provider refs、validation gates、ops runbook |
| `production-like` profile | P1/P2 direction only | 生产运行成为目标 | no fake/test fixture,approved secret provider,real store/bus/handoff/GRC refs,release gates |
| durable store product refs | P1/P2 | 产品选型完成 | store config ref schema,availability,backup/restore,rollback,secret handling |
| real bus/topic binding | P1/P2 | bus binding 成为发布目标 | transport route schema,credential refs,topic validation,dead-letter ops |
| secret provider / KMS / Vault | P1/P2 | 安全运维产品确定 | provider ref schema,adapter constructor,rotation,health failure,redaction audit |
| remote config center | P1/P2 / design-change-required | 需要远程配置且有回滚/审计 | source priority,availability,rollback,last-known-good,admin override boundary |
| admin override | design-change-required | 必须有审批/审计和安全模型 | actor/capability/audit,override scope,conflict handling |
| runtime hot reload | design-change-required | 需要 zero-downtime config update | reload lifecycle,last-known-good,rollback,adapter swap,partial failure semantics |
| online last-known-good | design-change-required | reload/config center 进入范围 | LKG storage,validation,digest,activation,audit,query/worker impact |
| product alert thresholds | P1/P2 operations | 真实运行 SLO 确定 | threshold config schema,alert routing,runbook,evidence |
| retry policy body | P1/P2 | runner/backoff 策略需配置化 | policy schema,range validation,job/worker semantics |

### 8.6 禁止作为迁移兼容的配置

| 配置 / 行为 | 处理 | 原因 |
|---|---|---|
| raw secret / raw body | 永远 reject,不提供兼容窗口 | 安全红线 |
| static boundary override | 永远 reject,不提供兼容窗口 | 破坏 truth/query/outbox/idempotency 不变量 |
| hot/reload key in P0 | reject | P0 无 reload contract |
| config center/admin override in P0 | reject | P0 无 remote config source |
| production-like fake/test fixture | reject | profile isolation |
| high-cardinality metrics enabled in P0 | reject | observability safety |
| query repair/write switch | reject | query no-write |
| outbox payload current-truth rebuild switch | reject | outbox snapshot truth source |

### 8.7 迁移 evidence 要求

| Evidence | 何时需要 | 必须证明 |
|---|---|---|
| migration mapping report | old key -> new key 迁移 | 映射明确,无 silent fallback |
| deprecation warning report | deprecated key 兼容窗口 | warning redacted,不含 raw value |
| removed-key negative report | old key removed/rejected | old key fails validation |
| profile artifact scan | 兼容窗口结束前 | 所有 profile config 不再使用旧 key |
| rollback compatibility report | 移除前 | previous validated rollback target 不依赖旧 key |
| downstream update report | `05/06/07/09` 承接后 | 测试、验收、实施、运维已同步 |
| redaction report | sensitive config 迁移 | old/new sensitive refs 只以 digest 输出 |

### 8.8 配置迁移停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 当前是否有旧配置迁移项 | 无 | 尚未发布正式 `04` |
| 是否说明无迁移项 | 通过 | 见 §8.1 |
| 新配置引入规则是否闭合 | 通过 | 见 §8.3 |
| 废弃/移除规则是否闭合 | 通过 | 见 §8.4 |
| future P1/P2 演进是否与 P0 切开 | 通过 | 见 §8.5 |
| 安全红线是否禁止兼容 | 通过 | 见 §8.6 |
| evidence 是否明确 | 通过 | 见 §8.7 |

### 8.9 跨迁移演进审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否无说明删除已发布配置 | 不允许 | 必须走 deprecated -> rejected/removed |
| 是否把旧草案配置当正式兼容对象 | 不作为 | 旧 `05/06` 非正式配置契约 |
| 是否允许实现侧先新增 config key | 不允许 | 必须先回 `04` / 必要时 `03` |
| 是否给 unsupported P0 能力兼容成功窗口 | 不允许 | config center/hot reload/admin override P0 reject |
| 是否覆盖敏感迁移 redaction | 覆盖 | only redacted digest |
| 是否需要回写 `03` | 当前无 | future config center/hot reload/secret provider 等需回写 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前无已发布旧配置迁移项 | 否 | 配置版本状态 | 不适用 | 无回写 |
| 新配置必须先完成 `04` schema / validation / sensitive / failure / downstream 闭合 | 否 | 配置治理规则 | 不适用 | 无回写 |
| 若新配置改变 runtime builder、adapter constructor、port、DTO、error 或 flow,必须先回写 `03` | 否 | 设计闭环规则 | 不适用 | 无回写 |
| unsupported P0 能力不提供兼容成功窗口 | 否 | 承接 Step 5/9/11 | 不适用 | 无回写 |
| future config center、admin override、hot reload、online LKG、secret provider health contract | 是 | runtime loader / builder / adapter / error / audit contract | `03` §13 / §14 / §15 或对应校准 Step | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_13_migration_deprecation_evolution.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“当前配置迁移与废弃表”“未来迁移状态定义”“新配置引入规则”“废弃与移除规则”“未来演进候选表”“禁止作为迁移兼容的配置”“迁移 evidence 要求”“配置迁移停审记录”和“跨迁移演进审计表”小节,了解配置版本如何演进。

正式 `04-配置设计.md` §13 应回填:

- 当前配置迁移与废弃表。
- 未来迁移状态定义。
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
- 涉及 `03` 契约变化的配置演进必须先回写详细设计。
- 不得提前创建正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 正式 `04` 首版版本号和发布时间 | 影响后续迁移基线 | Step 15 装配时确定 |
| future production-like/staging-like 是否进入 P1/P2 | 影响 profile migration | 当前只记录候选 |
| future secret provider/config center/hot reload 是否进入设计 | 影响 `03/04/07/09` | Step 14 风险/待确认 |
| 迁移自动化工具是否需要 | 影响实施计划 | 当前不定义 |
| deprecated warning 是否进入 runtime public surface | 影响 error/protocol surface | 当前只要求 redacted issue/log;若 public surface 变化需回 `03` |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置演进策略明确 | 通过 | 见 §8.2~§8.5 |
| 当前迁移项状态已说明 | 通过 | 当前无迁移项 |
| 新配置引入规则已定义 | 通过 | 见 §8.3 |
| 废弃与移除规则已定义 | 通过 | 见 §8.4 |
| 禁止兼容的安全/静态边界已定义 | 通过 | 见 §8.6 |
| 迁移 evidence 已定义 | 通过 | 见 §8.7 |
| 迁移停审完成 | 通过 | 见 §8.8 |
| 跨迁移演进审计没有 unresolved 冲突 | 通过 | 见 §8.9 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 14 | 通过 | 下一步定义风险与待确认事项 |
