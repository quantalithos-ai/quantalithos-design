# 04 配置设计 Step 13 · 定义配置迁移、废弃与演进

> 子项目: `L1-identity`
> 目标文档: `04-配置设计.md`
> SOP Step: Step 13 定义配置迁移、废弃与演进
> 状态: 已写入;等待用户审核

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 13 定义配置迁移、废弃与演进 |
| 当前状态 | 已写入;等待用户审核 |
| 输入基线 | Step 7 config items;Step 8 sensitive secrets;Step 9 loading / validation / activation;Step 10 change / audit / rollback;Step 11 failure / degradation;Step 12 downstream handoff;旧 `04/05/06/07` 诊断输入 |
| 输出文件 | `projects/L1-identity/design-calibration/04_config_step_13_migration_deprecation_evolution.md` |
| 停审方式 | 本 Step 完成后暂停,审核通过后进入 Step 14 risks / open questions |

本 Step 定义 `L1-identity` 配置新增、重命名、废弃、迁移、移除和未来演进策略。

本 Step 只回答:

- 当前是否存在已发布 runtime config 需要迁移。
- 旧文档中的 `dev/test/staging`、mock/stub、旧 P0 环境和旧外部依赖口径如何迁移到新版 profile / adapter mode 语言。
- 新配置如何引入,需要走哪些设计闭环。
- 旧配置如何废弃,是否需要兼容窗口。
- 何时允许移除旧配置或旧口径。
- P1/P2 能力如何进入演进队列,而不是被当作 P0 默认能力。

本 Step 不定义:

- runtime 兼容代码、迁移脚本、release train、CI job、配置文件路径或自动化工具。
- 已发布实现仓 config key 的兼容读取方案;若实现仓存在旧 key,由 `07-实施计划.md` 在开工前审计。
- 具体 DB / bus / secret provider / config center / endpoint / alert 产品。
- `03` 未定义的 runtime config schema、loader API、adapter constructor、state、port、error、DTO 或 flow。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_07_config_items.md` | 已审核通过 | 提供当前 P0 配置项清单和 `profile/store/.../fixture` 十二个配置域 |
| `04_config_step_08_sensitive_secrets.md` | 已审核通过 | 提供 future secret provider、sensitive ref 轮换和 raw secret/body 禁止边界 |
| `04_config_step_09_loading_validation_activation.md` | 已审核通过 | 提供 strict JSON、unsupported reload/hot/config center/admin override 和 future reload 回写点 |
| `04_config_step_10_change_audit_rollback.md` | 已审核通过 | 提供 high-risk change review、rollback、previous validated digest 和 future config center/hot reload 回写点 |
| `04_config_step_11_failure_degradation.md` | 已审核通过 | 提供 fail-fast、fail-closed、explicit-disabled、future secret provider/config center failure 口径 |
| `04_config_step_12_downstream_handoff.md` | 已审核通过 | 提供 `05/06/07/09` 下游同步和 evidence 要求 |
| 旧 `04-配置设计.md` | 历史诊断输入 | 只用于识别旧配置口径;不是新版已发布 runtime schema |
| 旧 `05-测试方案.md` / `06-验收标准.md` / `07-实施计划.md` | 历史诊断输入 | 识别旧环境、旧 mock/stub、旧测试/验收/实施口径 |
| 配置 SOP / 书写规范 §5.13 | 当前标准 | 提供迁移与废弃表结构和“暂无迁移也必须说明”要求 |
| `L1-governance` Step 13 calibration | 参考样式 | 只参考迁移状态、演进候选和 evidence 粒度,不复用 governance 配置项 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 是否存在旧配置需要迁移? | 当前没有已发布正式 `04-配置设计.md` 或已发布 `L1-identity` runtime config schema,因此没有需要提供 runtime 兼容窗口的正式旧配置项。存在旧文档口径迁移:旧 `dev/test/staging`、mock/stub、旧 staging 真实依赖、旧 replay/recovery 口径必须映射到新版 profile / adapter mode 语言。 |
| 新配置如何引入? | 新配置必须先回到 `04` 修改配置项清单、类型、默认、必填、来源、作用域、生效方式、敏感级别、失败策略、变更审计、失效策略和下游承接。若改变 runtime builder、adapter constructor、port、error、flow、state 或 DTO,必须同步回写 `03`。 |
| 旧配置如何废弃? | 已发布配置不得无说明删除。废弃必须标记状态、兼容窗口、validation warning/error 升级路径、迁移目标、审计和移除条件。当前旧文档口径不作为 runtime 兼容对象,只在下游文档复核时替换。 |
| 是否需要兼容窗口? | 当前 P0 首版无已发布 runtime config,因此无 runtime 兼容窗口。未来已发布配置重命名/替换时必须定义兼容窗口。安全红线、raw secret/body、static boundary override、hot/reload/config center/admin override 这类不提供成功兼容窗口,只能 reject 或正式设计变更。 |
| 何时允许移除旧配置? | 只有在旧配置被标记 deprecated、兼容窗口结束、测试/验收/运维承接完成、release evidence 证明无使用、rollback target 不依赖旧 key,且删除不会改变 `03` 契约时,才允许移除。旧文档口径可在 `05/06/07` 按新版复核后移除。 |

## 4. 当前文档问题诊断

| 位置 / 旧口径 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 正式 `04` | 尚未装配,没有已发布配置版本 | 明确当前无 runtime 迁移项 |
| 旧 `04` | 早于新版正式 `03`,可能含旧 profile / source / secret 口径 | 降级为历史诊断输入,不作为兼容对象 |
| 旧 `05` | 使用旧 dev/test/staging、旧 command/job 和 mock/stub 测试口径 | 记录为下游文档口径迁移对象 |
| 旧 `06` | 使用旧验收环境、旧对象和旧 evidence 口径 | 记录为下游文档口径迁移对象 |
| 旧 `07` | 使用旧 phase、旧 DB/bus/mock/stub 和旧实现路径 | 后续需按新版 `03/04/05/06` 重新做 boundary 审计 |
| Step 5~11 | 多处记录 future secret provider/config center/hot reload | 本 Step 收为未来演进项,不进入 P0 schema |

## 5. 改动前后对比

| 项 | 改动前 | 本步后 | 原因 |
|---|---|---|---|
| runtime 配置迁移 | 未声明 | 当前无已发布 runtime 配置迁移项 | SOP 要求暂无迁移也必须说明 |
| 旧文档口径 | dev/test/staging、mock/stub、staging 真实依赖 | 映射为新版 profile / adapter mode / P1/P2 方向 | 防止旧口径回流 |
| 新配置引入 | 各 Step 待确认中散落 | 固定新增配置设计闭合流程 | 防止实现侧直接加 config key |
| 废弃规则 | 未定义 | 定义 deprecated、兼容窗口、warning/error、移除条件 | 防止无说明删除配置 |
| P1/P2 演进 | 分散在 profile、secret、failure、handoff | 汇总为 future evolution queue | 防止 P0 被未来能力污染 |
| 下游同步 | Step 12 已承接 | 要求迁移/废弃也同步 `05/06/07/09` evidence | 防止 `04` 与下游分叉 |

## 6. 配置设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否把旧草案配置当已发布 runtime schema | A. 作为兼容对象;B. 只作为历史诊断输入 | 采用 B。当前没有已发布正式 `04` 或 runtime config schema |
| 是否保留旧 dev/test/staging 为正式 profile alias | A. 保留 alias;B. 不保留,只做文档迁移说明 | 采用 B。避免 profile 语义分裂 |
| mock/stub 是否继续作为 profile | A. 保留;B. 改为 adapter mode | 采用 B。承接 Step 6 |
| 新配置是否可由实施先加 | A. 实施先加再回文档;B. 先设计闭合再实施 | 采用 B。保持真相源闭环 |
| unsupported 能力是否保留兼容 key | A. 接受但忽略;B. reject unsupported | 采用 B。config center/hot reload/admin override 在 P0 出现即 fail-fast |
| 废弃期是否允许 silent fallback | A. 允许;B. 明确 warning/error 并要求迁移 | 采用 B。避免隐式兼容掩盖配置漂移 |
| 敏感配置迁移是否记录 full old/new ref | A. 记录完整 ref;B. 记录 redacted digest | 采用 B。承接 Step 8 / Step 10 |

## 7. 结构化中间产物

### 7.1 当前正式配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无已发布 runtime config | 无 | 当前无正式迁移项 | 不适用 | 尚未发布正式 `04` / runtime config schema;旧文档文字不作为 runtime 兼容对象 | 不适用 |

### 7.2 旧文档口径迁移表

| 旧配置 / 旧口径 | 新配置 / 新口径 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| `dev` environment/profile | `profile.name=local-dev` | 废弃旧文档口径 | 无 runtime 兼容窗口 | `05/06/07` 回写;local guide 使用 `local-dev` | 下游文档不再使用 `dev` 作为正式 profile |
| `test` environment/profile | `profile.name=ci-test` | 废弃旧文档口径 | 无 runtime 兼容窗口 | CI 配置与测试矩阵改名 | CI evidence 使用 `ci-test` |
| `staging` as P0 profile | P0 `integration-like` + P1 `staging-like` | 拆分旧口径 | 无 runtime 兼容窗口 | controlled seam 进 P0;真实依赖进 P1/P2 | 下游不再把 staging 当 P0 must-pass |
| mock / stub profile | adapter mode:`fake` / `controlled` / `disabled` | 废弃 profile 口径 | 无 | 配置项改为 `*.mode`;profile 只描述运行语境 | 无 mock/stub profile 文件名或验收口径 |
| replay/recovery ad hoc | `profile.name=operations-replay` | 新增正式 profile | 不适用 | operations job / report 使用 replay profile | `05/06/07` 承接 replay evidence |
| raw DSN/env credential material | `*_ref` + future secret provider refs | 禁止旧写法 | 无 | raw material validation reject | config examples 无 raw secret/body |
| staging real endpoint in P0 | P1 `staging-like` / P2 `production-like` | 迁出 P0 | 无 | P0 使用 controlled seam;真实 endpoint 留运维/ADR | P0 gates 不要求真实 endpoint |
| optional audit off | `audit.compensation_enabled=true` | 禁止旧写法 | 无 | false fail-fast | redline tests 覆盖 |
| projection live fallback | `projection.query.not_ready_strategy=return-not-ready` | 禁止旧写法 | 无 | query 不实时拼外部正文 | query tests 覆盖 not-ready/degraded no-write |

### 7.3 未来迁移状态定义

| 状态 | 含义 | Loader 行为 | 审计 / 测试要求 |
|---|---|---|---|
| `active` | 当前正式配置项 | 正常 parse/validate | 正常测试和验收 |
| `introduced` | 新增但仅在未来 profile / feature 中使用 | 默认 disabled 或 explicit opt-in;必须 validation | 新增配置测试和下游承接 |
| `deprecated` | 已有替代项,仍处兼容窗口 | 可接受但输出 redacted warning/issue;不得 silent fallback | 迁移测试、warning evidence、运维提示 |
| `rejected` | 曾考虑但 P0 明确不支持 | validation reject | negative test and acceptance veto |
| `removed` | 兼容窗口结束,配置项不可再使用 | unknown/removed field reject | removal evidence and release note |
| `design-change-required` | 会改变 `03` 或安全边界 | 不进入 runtime schema | 必须先回设计 |

### 7.4 新配置引入规则

| 步骤 | 要求 | 不满足时处理 |
|---|---|---|
| 1. 明确配置动机 | 指向需求、架构、详细设计、测试/验收/实施/运维承接问题 | 记入 Step 14 风险,不得实施 |
| 2. 判定是否改变 `03` | 检查 runtime config、builder、adapter constructor、port、DTO、error、flow、state/persistence | 影响 `03` 时先回写详细设计 |
| 3. 补 `04` 配置项 | 写入配置项、类型、默认、必填、来源、作用域、生效、敏感、失败策略 | 未补齐则不进入实施计划 |
| 4. 补 source / priority | 明确 defaults/file/env/job/entry/fixture 是否参与 | 不明确则 fail design review |
| 5. 补 sensitive / no-output | 标注 public/internal/sensitive/secret 和 redaction | 未标注不得启用 |
| 6. 补 validation / activation | parse/type/range/cross-field/sensitive/static-boundary validation 和生效方式 | 未闭合不得实现 |
| 7. 补 change / rollback | high-risk 需评审、审计、rollback | 无 rollback 不得启用 |
| 8. 补 failure strategy | fail-fast/fail-closed/reject/degraded/delayed/failed marker | 不得 silent fallback |
| 9. 补 downstream handoff | `05/06/07/09` 输入和 evidence | 下游未承接则不得 release |

### 7.5 废弃与移除规则

| 阶段 | 配置状态 | Loader 行为 | 下游要求 | 退出条件 |
|---|---|---|---|---|
| 宣告废弃 | `deprecated` | 接受旧 key,生成 redacted deprecation issue/warning | `05` 增加旧 key warning 测试;`09` 写运维提示 | 新旧 key 同时有测试 |
| 兼容窗口 | `deprecated` | old key 可映射到 new key,但不得覆盖更高优先级 new key | `06` 验收迁移 warning;release evidence 记录使用量 | evidence 显示旧 key 不再使用 |
| 强制迁移 | `deprecated` -> `rejected` | old key 变 validation reject | `05/06` negative gate;`09` 更新 runbook | 所有 profile artifact 已迁移 |
| 移除 | `removed` | old key 作为 unknown/removed field reject | release note / evidence index | 无 rollback target 依赖旧 key |

### 7.6 未来演进候选表

| 候选能力 | 当前状态 | 进入条件 | 必须补充的设计 |
|---|---|---|---|
| `staging-like` profile | P1 direction only | 真实依赖 dry-run 进入范围 | product-neutral durable refs、secret provider refs、validation gates、ops runbook |
| `production-like` profile | P1/P2 direction only | 生产运行成为目标 | no fake/test fixture、approved secret provider、real store/bus/handoff refs、release gates |
| durable store product refs | P1/P2 | 产品选型完成 | store config ref schema、availability、backup/restore、rollback、secret handling |
| real bus/topic binding | P1/P2 | bus binding 成为发布目标 | transport route schema、credential refs、topic validation、dead-letter ops |
| secret provider / KMS / Vault | P1/P2 | 安全运维产品确定 | provider ref schema、adapter constructor、rotation、health failure、redaction audit |
| remote config center | P1/P2 / design-change-required | 需要远程配置且有回滚/审计 | source priority、availability、rollback、last-known-good、admin override boundary |
| admin override | design-change-required | 必须有审批/审计和安全模型 | actor/capability/audit、override scope、conflict handling |
| runtime hot reload | design-change-required | 需要 zero-downtime config update | reload lifecycle、last-known-good、rollback、adapter swap、partial failure semantics |
| online last-known-good | design-change-required | reload/config center 进入范围 | LKG storage、validation、digest、activation、audit、query/worker impact |
| product alert thresholds | P1/P2 operations | 真实运行 SLO 确定 | threshold config schema、alert routing、runbook、evidence |
| retry policy body | P1/P2 | runner/backoff 策略需配置化 | policy schema、range validation、job/worker semantics |
| formal config evidence schema | conditional | 验收自动化要求稳定 schema | `03/05/06` evidence object or test plan schema |

### 7.7 禁止作为迁移兼容的配置

| 配置 / 行为 | 处理 | 原因 |
|---|---|---|
| raw secret / raw body | 永远 reject,不提供成功兼容窗口 | 安全红线 |
| static boundary override | 永远 reject,不提供成功兼容窗口 | 破坏 truth/query/outbox/idempotency 不变量 |
| hot/reload key in P0 | reject | P0 无 reload contract |
| config center/admin override in P0 | reject | P0 无 remote config source |
| production-like fake/test fixture | reject | profile isolation |
| query repair/write switch | reject | query no-write |
| outbox payload current-truth rebuild switch | reject | outbox snapshot truth source |
| audit compensation off | reject | audit redline |
| idempotency/stored replay off | reject | duplicate replay redline |

### 7.8 迁移 evidence 要求

| Evidence | 何时需要 | 必须证明 |
|---|---|---|
| migration mapping report | old key -> new key 迁移 | 映射明确,无 silent fallback |
| deprecation warning report | deprecated key 兼容窗口 | warning redacted,不含 raw value |
| removed-key negative report | old key removed/rejected | old key fails validation |
| profile artifact scan | 兼容窗口结束前 | 所有 profile config 不再使用旧 key |
| rollback compatibility report | 移除前 | previous validated rollback target 不依赖旧 key |
| downstream update report | `05/06/07/09` 承接后 | 测试、验收、实施、运维已同步 |
| redaction report | sensitive config 迁移 | old/new sensitive refs 只以 digest 输出 |

### 7.9 配置迁移停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 当前是否有已发布 runtime 配置迁移项 | 无 | 尚未发布正式 `04` / runtime config schema |
| 是否说明无迁移项 | 通过 | 见 §7.1 |
| 旧文档口径迁移是否明确 | 通过 | 见 §7.2 |
| 新配置引入规则是否闭合 | 通过 | 见 §7.4 |
| 废弃/移除规则是否闭合 | 通过 | 见 §7.5 |
| future P1/P2 演进是否与 P0 切开 | 通过 | 见 §7.6 |
| 安全红线是否禁止兼容 | 通过 | 见 §7.7 |
| evidence 是否明确 | 通过 | 见 §7.8 |

### 7.10 跨迁移演进审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否无说明删除已发布配置 | 不允许 | 必须走 deprecated -> rejected/removed |
| 是否把旧草案配置当正式兼容对象 | 不作为 | 旧 `04/05/06/07` 非正式新版配置契约 |
| 是否允许实现侧先新增 config key | 不允许 | 必须先回 `04` / 必要时 `03` |
| 是否给 unsupported P0 能力兼容成功窗口 | 不允许 | config center/hot reload/admin override P0 reject |
| 是否覆盖敏感迁移 redaction | 覆盖 | only redacted digest |
| 是否需要回写 `03` | 当前无 | future config center/hot reload/secret provider/formal evidence schema 等需回写 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前无已发布 runtime 配置迁移项 | 否 | 配置版本状态 | 不适用 | 无回写 |
| 旧文档口径迁移到新版 profile / adapter mode | 否 | 下游文档复核 | 不适用 | 无回写 |
| 新配置必须先完成 `04` item / validation / sensitive / failure / downstream 闭合 | 否 | 配置治理规则 | 不适用 | 无回写 |
| 若新配置改变 runtime builder、adapter constructor、port、DTO、error、state 或 flow,必须先回写 `03` | 否 | 设计闭环规则 | 不适用 | 无回写 |
| unsupported P0 能力不提供兼容成功窗口 | 否 | 承接 Step 5/9/11 | 不适用 | 无回写 |
| future config center、admin override、hot reload、online LKG、secret provider health contract、formal config evidence schema | 是 | runtime loader / builder / adapter / error / audit / evidence contract | `03` §13~§15 或对应校准 Step | 阻塞待确认 |

## 9. 回填草稿

正式 `04-配置设计.md` §13 可回填:

```md
## 13. 配置迁移、废弃与演进

> 校准来源:
> - `design-calibration/04_config_step_13_migration_deprecation_evolution.md`

当前没有已发布正式 `04-配置设计.md` 或已发布 `L1-identity` runtime config schema,因此没有需要提供 runtime 兼容窗口的正式旧配置项。旧 `dev/test/staging`、mock/stub、staging 真实依赖和 replay/recovery 只作为历史文档口径,分别迁移为 `local-dev`、`ci-test`、`integration-like`、P1 `staging-like`、adapter mode `fake/controlled/disabled` 和 `operations-replay`。

新配置项必须先进入配置项清单,并补齐来源优先级、敏感级别、加载校验、生效机制、变更审计、回滚、失效策略和下游承接。若新配置改变 runtime builder、adapter constructor、port、DTO、error、state 或 flow,必须先回写 `03-详细设计.md`。

已发布配置不得无说明删除。未来废弃配置必须经历 deprecated、兼容窗口、强制迁移和 removed/rejected 阶段,并提供 migration mapping、deprecation warning、removed-key negative、profile artifact scan、rollback compatibility、downstream update 和 redaction evidence。raw secret/body、static boundary override、hot/reload/config center/admin override、production-like fake、query repair、outbox payload current-truth rebuild、audit compensation off、idempotency/stored replay off 不提供成功兼容窗口。
```

回填要求:

- 必须明确“当前无已发布 runtime 配置迁移项”。
- 必须明确旧文档口径迁移不是 runtime 兼容窗口。
- 不允许无说明地删除已发布配置。
- 新增 / 废弃配置必须说明兼容窗口。
- P0 unsupported 能力不得通过兼容 key 静默启用。
- 涉及 `03` 契约变化的配置演进必须先回写详细设计。
- 不得提前创建正式 `04-配置设计.md`;正式文档只能在 Step 15 装配。

## 10. 待确认事项

| 编号 | 待确认事项 | 影响 | 当前处理 |
|---|---|---|---|
| ID-CONFIG-Q60 | 正式 `04` 首版版本号和发布时间 | 影响后续迁移基线 | Step 15 装配时确定 |
| ID-CONFIG-Q61 | `05/06/07` 回写旧 profile / adapter 口径的排期 | 影响下游一致性 | Step 14 汇总风险 |
| ID-CONFIG-Q62 | 实现仓若已存在旧 config 文件,是否需要兼容读取 | 影响实施计划 | 交给 `07` 开工前 boundary 审计 |
| ID-CONFIG-Q63 | future production-like/staging-like 是否进入 P1/P2 | 影响 profile migration and operations | 当前只记录候选 |
| ID-CONFIG-Q64 | future secret provider/config center/hot reload 是否进入设计 | 影响 `03/04/07/09` | Step 14 风险/待确认 |
| ID-CONFIG-Q65 | deprecated warning 是否进入 runtime public surface | 影响 error/protocol surface | 当前只要求 redacted issue/log;若 public surface 变化需回 `03` |

## 11. 进入下一步条件

- 配置演进策略明确。
- 当前正式配置迁移项状态已说明。
- 旧文档口径迁移表已完成。
- 新配置引入规则已定义。
- 废弃与移除规则已定义。
- 禁止兼容的安全/静态边界已定义。
- 迁移 evidence 已定义。
- 迁移停审完成。
- 跨迁移演进审计没有 unresolved 冲突。
- 对 `03-详细设计.md` 的影响判定已记录,当前无必须回写项。
- 未提前定义 runtime 兼容代码、迁移脚本、release train、CI job、配置文件路径、secret provider 产品或实施 boundary。

下一步进入 Step 14:定义风险与待确认事项。
