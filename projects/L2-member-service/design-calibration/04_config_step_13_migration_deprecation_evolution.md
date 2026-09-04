# Step 13：定义配置迁移、废弃与演进

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 13
> 回填章节：未来正式 `04-配置设计.md` §13“配置迁移、废弃与演进”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_13_migration_deprecation_evolution.md`
> 执行模式：full-restart；本文件只定义版本治理规则，不生成迁移脚本、发布记录或执行证据

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 13 配置迁移、废弃与演进 |
| 当前模块 | `migration_deprecation_evolution` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 7 配置项、Step 8 敏感规则、Step 9 activation、Step 10 rollback、Step 11 failure、Step 12 downstream handoff |
| 正式 `04` 写入 | `false`；只允许 Step 15 装配 |
| 实现 / 测试 / 证据 | `false`；本文不声称存在迁移工具、兼容窗口、旧 key 使用量或 release evidence |
| commit | `false` |

### 1.1 Step 内计划

- [x] 判断当前是否有已发布配置可迁移，并区分历史材料与正式契约。
- [x] 定义新增、重命名、废弃、强制迁移和移除的状态及 loader 行为。
- [x] 规定兼容窗口、warning/error、rollback 和下游同步要求。
- [x] 将安全红线和 P0 unsupported 能力排除在“兼容成功”之外。
- [x] 建立 future profile/provider/config-center/hot-reload 演进队列及 `03` 回写触发器。
- [x] 完成迁移停审、跨演进审计、§13 回填草稿和 `03` 影响判定。

## 2. 本步目标与边界

本 Step 约束配置 schema 的生命周期，使新增或变更不会绕过配置真相源、详细设计契约、敏感输出边界和下游承接。它只管理本仓配置项的版本语义，不负责部署迁移、数据迁移、发布排期或运维工具。

本 Step 不定义：

- 具体版本号、release train、迁移脚本、命令、工单或自动化产品；
- 数据库 schema、消息协议、容器镜像或外部服务迁移；
- 真实 secret provider、config center、online LKG、hot reload 或动态 adapter replacement 的实现；
- sibling 项目的 protocol、manifest、policy、credential 或 endpoint truth；
- 任何实际迁移、warning、报告、artifact、测试结果或 readiness。

当前首版正式 `04-配置设计.md` 尚未发布，因此旧 `README.md`、旧 `05/06` 中的环境文字、旧技术参数和历史 key 均不构成迁移基线。

## 3. 本步输入

| 输入 | 用途 | 状态 |
|---|---|---|
| `04_config_step_07_config_items.md` | 当前 P0 配置项和 future 候选 | completed |
| `04_config_step_08_sensitive_secrets.md` | opaque ref、secret/body 禁止和轮换边界 | completed |
| `04_config_step_09_loading_validation_activation.md` | strict JSON、unsupported reload/hot、activation kind | completed |
| `04_config_step_10_change_audit_rollback.md` | 变更审计、previous validated rollback 和敏感 ref 规则 | completed |
| `04_config_step_11_failure_degradation.md` | reject、fail-fast、fail-closed、drift/expiry 规则 | completed |
| `04_config_step_12_downstream_handoff.md` | `05/06/07/09` 同步和 evidence 承接 | completed |
| `配置设计书写规范.md` §5.13 | 迁移/废弃表和兼容窗口要求 | 已读取 |

## 4. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 是否存在旧配置需要迁移？ | 当前没有已发布正式 `04` 或已发布 runtime config schema，因此 P0 无迁移项。旧正式 `05/06` 和 README 仅是 historical_material，不能被当成旧版本 key 或兼容对象。 |
| 新配置如何引入？ | 先在 `04` 补齐名称、类型、默认、必填、来源、作用域、生效、敏感级别、失败策略、变更审计、下游承接；若改变 runtime config、builder、adapter constructor、Port、error、flow 或 DTO，必须先回写 `03`，再进入实施。 |
| 旧配置如何废弃？ | 已发布 key 不得静默删除；须标记 `deprecated`，指定替代 key、兼容窗口、warning/error 升级、rollback 目标和移除条件。敏感 ref 只能以 digest / category 留痕。 |
| 是否需要兼容窗口？ | 当前首版无迁移窗口。未来重命名或替换已发布 key 时必须显式定义窗口；raw secret、static boundary override、P0 hot/reload、remote/admin source 等安全或不支持项不提供兼容成功窗口，直接 reject。 |
| 何时允许移除？ | 兼容窗口结束、旧 key 使用证据清零、`05/06/07/09` 已同步、previous validated rollback 不再依赖旧 key、迁移和安全扫描完成后，才可将其标为 `removed` 并拒绝旧 key。 |
| 未来能力如何进入？ | staging/production-like、durable store、真实 Bus、secret provider、config center、admin override、online LKG、hot reload 等仅进入 future queue；达到范围门槛后重开相关 `03/04` Step，不作为 P0 隐藏 key。 |

## 5. 当前材料诊断

| 位置 | 改动前问题 | 本 Step 修正 |
|---|---|---|
| 正式 `04` | 尚未发布，没有明确迁移基线 | 明确“当前无迁移项”并记录判断依据 |
| 旧 `README` / `05` / `06` | 可能含旧环境、产品、参数或 key 描述 | 降级为 historical_material，不作为兼容输入 |
| Step 5~11 | future config center/provider/hot reload 分散出现 | 统一进入 future evolution queue，P0 直接 reject |
| Step 12 | 下游只定义了承接，未说明迁移同步 | 规定迁移/废弃必须同步更新测试、验收、实施和运维输入 |
| 实施入口 | 容易先加 key 后补文档 | 固定“先设计闭合，再实施，再证据”的顺序 |

## 6. 改动前后对比

| 项目 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 迁移基线 | 未说明旧材料是否有效 | 只有未来发布的正式 `04` key 才能成为基线 | 避免历史污染 |
| 新增配置 | 可由实施侧临时添加 | 必须先闭合 `04` schema 和必要 `03` 回写 | 保持真相源闭环 |
| 废弃行为 | 无统一规则 | `active → deprecated → rejected/removed` | 防止静默删除或 fallback |
| 兼容窗口 | 未定义 | 未来重命名必须显式记录窗口和 evidence | 可审计、可回滚 |
| 安全/unsupported | 可能被误当成兼容 alias | 永远 reject，不提供成功兼容 | 不让安全红线被绕过 |
| future 能力 | 各 Step 零散待确认 | 进入演进队列，触发前先回写 `03` | 隔离 P0 与未来产品化 |

## 7. 设计取舍

| 议题 | 备选 | 采用结论 |
|---|---|---|
| 旧草案是否保留 alias | 将旧文字当兼容 key / 不作为迁移对象 | 不作为迁移对象；旧材料无正式发布效力 |
| 新配置先实施还是先设计 | 实施先加 key / 先完成 `04` 闭环 | 先完成 `04`，必要时先回写 `03` |
| 废弃期是否静默 fallback | 静默映射 / 明确 warning、窗口和最终 reject | 明确 warning/issue 和窗口，禁止静默 |
| unsupported 能力是否留兼容 key | 接受并忽略 / 直接 reject | 直接 reject；避免看似支持 |
| 敏感 ref 迁移是否保存 old/new 原文 | 原文 / category + redacted digest | category + digest；不保存 full ref/body |
| 迁移 evidence 是否等于 readiness | 等同 / 仅证明迁移动作 | 仅证明迁移动作，readiness 仍由正式验收决定 |

## 8. 结构化中间产物

### 8.1 当前配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无已发布配置 | 无 | 当前无迁移项 | 不适用 | 首版 `04` 尚未发布；旧 README/`05/06` 不构成 schema 基线 | 不适用 |

### 8.2 配置生命周期状态

| 状态 | 含义 | loader 行为 | 审计 / 下游要求 |
|---|---|---|---|
| `active` | 当前正式配置项 | 正常 parse/type/cross-field validation | 正常测试、验收和运维承接 |
| `introduced` | 新增但尚未成为默认能力 | 仅显式允许的 profile/feature 可用；默认不启用 | 补 schema、测试、验收、实施和运维输入 |
| `deprecated` | 已有替代项，处兼容窗口 | 可按明确映射处理并生成 redacted warning/issue；不得覆盖更高优先级新 key | 记录窗口、使用 evidence 和 rollback |
| `rejected` | P0 明确不支持或不安全 | validation reject | negative test / acceptance veto |
| `removed` | 兼容窗口结束 | unknown/removed field reject | migration/removal evidence 和 release note |
| `design-change-required` | 会改变 `03` 代码契约或安全边界 | 不进入当前 runtime schema | 先重开 `03/04` 设计 |

### 8.3 新配置引入闭环

| 阶段 | 必须回答 | 未满足时 |
|---|---|---|
| 1. 动机 | 需求、架构、详细设计、测试、验收或运维问题来源 | 记入风险，不得实施 |
| 2. 边界 | 是否属于允许配置化行为，是否触及 static invariant | 触及 invariant 则 design-change-required |
| 3. 代码影响 | 是否新增 runtime field、builder binding、constructor、Port、DTO、error 或 flow | 有影响先回写 `03` |
| 4. schema | 名称、类型、默认、必填、来源、作用域、生效、敏感、失败策略 | 不完整则不进入实施 |
| 5. source / profile | defaults/file/env/entry/job 是否参与，profile 是否允许 | 不明确则 reject design |
| 6. validation | parse/type/range/cross-field/ref/body/static boundary | 未闭合不得启用 |
| 7. change / rollback | 风险、评审、审计、previous validated rollback | 无 rollback 不得启用 |
| 8. downstream | `05/06/07/09` 测试、门禁、任务和运维输入 | 未同步不得 release |
| 9. evidence | 需要什么报告、digest、扫描或迁移映射 | 不得以口头确认替代 |

### 8.4 废弃、迁移与移除规则

| 阶段 | 配置状态 | loader 行为 | 下游同步 | 退出条件 |
|---|---|---|---|---|
| 宣告废弃 | `deprecated` | old key 可接受但生成 redacted warning/issue；新 key 优先且冲突可判定 | `05` 加负例和 warning；`06` 加迁移门禁；`07/09` 补操作输入 | 映射、窗口、rollback 已记录 |
| 兼容窗口 | `deprecated` | 只允许明确 old→new 映射；禁止 silent fallback 和 raw value 输出 | 所有 P0 profile 的迁移测试与运维提示齐全 | 使用 evidence 表明旧 key 不再使用 |
| 强制迁移 | `rejected` | old key validation reject；只接受 new key | `05/06` negative gate，`07/09` 更新实施/运维 | 所有 profile artifact 已迁移 |
| 移除 | `removed` | old key 作为 unknown/removed field reject | release note、evidence index、rollback review | rollback 不再依赖旧 key |

### 8.5 未来演进候选

| 能力 | 当前状态 | 进入条件 | 必须补充的设计 |
|---|---|---|---|
| `staging-like` profile | P1 direction | 真实依赖 dry-run 成为范围 | approved store/bus/secret refs、profile gates、运维步骤 |
| `production-like` profile | P1/P2 direction | 生产运行成为目标 | 禁止 fake/fixture、真实依赖、发布和验收门禁 |
| durable store | P1/P2 | 产品选型和恢复责任明确 | store ref、backup/restore、availability、secret 与 rollback |
| real Bus/topic binding | P1/P2 | transport 合同闭合 | route/envelope/receipt、credential、DLQ 和测试 |
| secret provider / KMS | P1/P2 | provider 与 rotation owner 明确 | provider ref、health、rotation、adapter constructor、redaction |
| remote config center | design-change-required | 需要远程 source 且具备 audit/rollback | source priority、availability、LKG、admin boundary、`03` 回写 |
| admin override | design-change-required | 有审批、actor、scope 和审计模型 | override conflict、authorization、error、`03` 回写 |
| runtime hot reload | design-change-required | 需要零停机变更 | reload lifecycle、adapter swap、partial failure、rollback、`03` 回写 |
| online last-known-good | design-change-required | reload/config center 已进入范围 | LKG store、activation、digest、audit、failure contract |
| product alert thresholds | P1/P2 | SLO 与责任方确定 | threshold schema、routing、runbook、evidence |

### 8.6 不提供兼容窗口的安全 / 静态项

| 配置或行为 | 处理 | 原因 |
|---|---|---|
| raw secret、credential body、external body、manifest | 永远 reject | 安全和正文排除红线 |
| redaction deny list 删除核心禁止类 | reject / design-change-required | 可能造成敏感输出 |
| `body-free` 放宽、Query write repair | reject | 破坏 safe read / no-write |
| truth owner、ProjectMember 主语、state、generation、UoW、幂等 override | reject / design change | 破坏领域不变量 |
| P0 remote config、admin override、hot/reload、online LKG | reject | 当前没有 source/lifecycle/rollback contract |
| production-like fake/test fixture | reject | profile 隔离和 readiness 诚实性 |
| outbox payload current-truth rebuild switch | reject | 破坏 immutable snapshot truth source |

### 8.7 迁移 evidence 语义

| Evidence 类型 | 何时需要 | 必须证明 | 当前状态 |
|---|---|---|---|
| mapping report | old→new 迁移 | 映射完整、无 silent fallback | planned；未生成 |
| deprecation warning report | 兼容窗口 | warning 脱敏、窗口有效 | planned；未生成 |
| removed-key negative report | 强制移除 | old key 被拒绝 | planned；未生成 |
| profile artifact scan | 窗口结束 | 各 profile 不再使用 old key | planned；未生成 |
| rollback compatibility report | 移除前 | previous validated rollback 不依赖 old key | planned；未生成 |
| downstream sync report | 迁移完成 | `05/06/07/09` 已同步 | planned；未生成 |
| sensitive redaction report | sensitive ref 迁移 | 只有 digest/category，无原文 | planned；未生成 |

### 8.8 迁移停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 当前是否存在旧配置迁移项 | 无 | 正式 `04` 尚未发布，旧材料不构成基线 |
| 新配置引入规则是否完整 | 通过 | §8.3 覆盖 schema、03、validation、rollback、下游 |
| 废弃与移除规则是否完整 | 通过 | §8.4 覆盖窗口、warning/reject、evidence |
| unsupported / 安全项是否避免兼容成功 | 通过 | §8.6 永久 reject |
| future 能力是否与 P0 隔离 | 通过 | §8.5 标记 future / design-change-required |
| evidence 是否被误写成已存在 | 通过 | §8.7 全部 planned / 未生成 |

### 8.9 跨迁移 / 演进审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 历史 README/旧 `05/06` 是否被当正式迁移基线 | 否 | 仅 historical_material |
| 是否允许实施侧先添加 key | 不允许 | 先完成 `04`，必要时回写 `03` |
| 是否允许 silent fallback 或无窗口删除 | 不允许 | deprecated → rejected/removed 有显式门禁 |
| sensitive ref 是否保存原文 | 不允许 | category + redacted digest |
| unsupported P0 能力是否保留兼容 alias | 不允许 | remote/admin/hot/LKG 直接 reject |
| 下游是否需要同步 | 是 | `05/06/07/09` 必须承接，当前尚未重写 |
| 当前是否存在 P0 `待回写` | 否 | future conditional 未触发 |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前无已发布旧配置迁移项 | 否 | 配置版本治理 | 不适用 | 无回写 |
| 新配置必须先完成 `04` schema / validation / downstream 闭环 | 否 | 设计治理规则 | 不适用 | 无回写 |
| 旧 key 废弃 / 移除不改变当前 P0 runtime contract | 否 | loader 兼容规则 | 不适用 | 无回写 |
| unsupported 安全 / static 项直接 reject | 否 | 承接既有 redline | `03` §13~§15 已有 | 无回写 |
| future config center、admin override、hot reload、online LKG、secret provider health 或新 adapter constructor | 是 | loader / builder / Port / error / lifecycle 新契约 | `03` §13~§15 或对应 Step | future design-change-required；当前不进入 P0 |

当前没有 P0 `待回写` 或 `阻塞待确认` 的详细设计影响项。`MSVC-UP-001~008` 等跨项目合同仍是 open/pending/blocker，只能继续用 placeholder/blocked/unknown 语义承接。

## 10. 回填草稿：正式 `04-配置设计.md` §13

> 校准来源：
> - `design-calibration/04_config_step_13_migration_deprecation_evolution.md`
>
> 延伸阅读：
> - 建议阅读“当前配置迁移与废弃表”“配置生命周期状态”“新配置引入闭环”“废弃、迁移与移除规则”“未来演进候选”“不提供兼容窗口的安全 / 静态项”“迁移 evidence 语义”和“跨迁移 / 演进审计表”。

正式 §13 应明确当前无迁移项、未来配置生命周期状态、新增与废弃闭环、兼容窗口、移除条件、P0 安全 / unsupported 永久拒绝规则及 future evolution queue。正文不得写迁移脚本、旧 key 使用量、已生成 evidence 或具体产品选型。

## 11. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| 首版正式 `04` 的发布版本 / 基线标识 | 影响未来 migration baseline | Step 15 装配时形成文档基线；当前不虚构版本号 |
| future staging/production-like 是否进入路线 | 影响 profile 演进 | 仅保留候选，不进入 P0 |
| future provider/config center/hot reload | 影响 `03/04/07/09` | 先走设计变更，不创建兼容 key |
| 迁移自动化工具和 evidence 载体 | 影响实施/运维 | 当前只保留语义，工具留后续文档 |

## 12. 自检与停审结论

| 检查项 | 结果 | 说明 |
|---|---|---|
| 当前迁移基线判断清楚 | pass | 无已发布正式配置；旧材料不构成基线 |
| 新增、废弃、移除规则闭合 | pass | §8.2~§8.4 |
| 兼容窗口和 rollback 条件明确 | pass | future published key 必须定义 |
| 安全 / static / unsupported 项不提供兼容成功 | pass | §8.6 |
| future 能力与 P0 隔离 | pass | §8.5 |
| evidence 未伪造 | pass | planned / 未生成 |
| 上游 blocker 未伪装 ready | pass_with_upstream_blockers | `MSVC-UP-001~008` 持续 pending / blocked |
| `03` 影响已判定 | pass | 当前 P0 无回写，future 先回写 |
| 正式正文未提前创建 | pass | 仅生成 Step 13 中间产物 |
| 进入下一步条件 | pass_with_upstream_blockers | 允许进入 Step 14 |

```text
step_13_status = completed / pass_with_upstream_blockers
step_13_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
next_allowed_action = enter_step_14_risks_open_questions
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```
