# Step 13. 定义配置迁移、废弃与演进

> 本文件是 `projects/L1-work/04-配置设计.md` 的 Step 13 中间产物。
> 本步定义配置新增、重命名、废弃、迁移和移除策略。
> 本步不新增 `WorkRuntimeConfig` 字段,不引入兼容 alias,不为尚未发布的配置虚构迁移项。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 13
- 回填章节: `projects/L1-work/04-配置设计.md` §13 配置迁移、废弃与演进

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_07_config_items.md` | P0 9 个 section / 28 个配置项、默认值、条件必填和 JSON 映射 | 判断当前是否存在旧配置迁移项 |
| `04_config_step_05_sources_priority_conflicts.md` | 来源优先级、非法高优先级 fail-fast、config center / admin override 不进 P0 | 固定新增来源和 alias 的准入规则 |
| `04_config_step_08_sensitive_secrets.md` | ref-only sensitive 和 raw material 禁止 | 固定敏感配置演进边界 |
| `04_config_step_10_change_audit_rollback.md` | 配置变更、审计和回滚规则 | 固定迁移期间的审计和回滚方式 |
| `04_config_step_11_failure_modes.md` | fail-fast / fail-closed / marker 策略 | 固定旧配置、冲突配置和过期配置的失败口径 |
| `04_config_step_12_downstream_handoff.md` | 下游不得重复定义配置契约 | 固定迁移和废弃只能由 04 作为事实源 |

已确认结论:

```text
当前 L1-work 尚未发布正式 04 配置设计,也没有已发布运行配置 schema。
因此当前没有需要兼容的旧配置项、旧 key、旧来源优先级或旧 profile。
Step 13 只定义未来配置演进规则和当前无迁移项的正式口径。
任何新增 / 重命名 / 废弃 / 移除配置,都必须先判断是否改变 03 详细设计中的代码契约。
```

## 3. SOP 问题回答

### 3.1 是否存在旧配置需要迁移?

当前不存在旧配置迁移项。

原因:

- 本 Step 撰写时 `projects/L1-work/04-配置设计.md` 尚未创建;当前已由 Step 15 生成正式文档。
- Step 7 定义的 28 个 P0 配置项是本轮首次正式收敛的配置清单。
- 本 Step 撰写时旧版 `05-测试方案.md` / `06-验收标准.md` 只作为下游参考;当前已生成正式 `05/06`。
- 当前没有已发布的 JSON config schema、environment key 规范、config center schema 或部署手册配置项。

因此正式 04 §13 必须明确:

```text
当前无已发布旧配置需要迁移。
当前不提供旧 key alias。
当前不支持 legacy config source。
```

### 3.2 新配置如何引入?

新增配置必须先分类,再决定回写路径。

| 新配置类型 | 准入路径 | 处理方式 |
|---|---|---|
| 只改变默认值、profile 示例、来源说明或失败策略 | 04 配置设计变更 | 更新配置项清单、测试承接和验收门禁 |
| 新增 `WorkRuntimeConfig` 字段或 section | 03 详细设计回写后再更新 04 | 先定义 struct 字段、类型、validation、builder 绑定和测试切口 |
| 新增 adapter constructor 参数 | 03 详细设计回写后再更新 04 | 先定义 adapter trait / constructor / fake fixture 口径 |
| 新增 config source,如 config center / admin override | P1/P2 专项设计 | 必须补权限、审计、reload、冲突、回滚和 last-known-good 专项 |
| 新增 secret provider / KMS / Vault 字段 | P1/P2 安全和运维专项 | 仍不得让 raw material 进入普通配置 |
| 新增 production-like durable DB / MQ / endpoint 字段全集 | P1/P2 部署和运维专项 | 先闭合真实产品绑定和失败策略,不得混入 P0 |
| 新增 advanced search backend 配置 | 03 / 04 / 05 / 06 联动 | 先闭合 search contract、backend、query route 和验收门禁 |

新增配置必须同时补齐:

- 配置项名称、类型、默认值、是否必填。
- 来源、优先级、作用域、生效方式。
- 敏感级别和 redaction 规则。
- typed validation / cross-field validation。
- fail-fast / fail-closed / marker 口径。
- 测试方案切口和验收门禁。
- 是否影响实施计划 phase / commit boundary。

### 3.3 旧配置如何废弃?

未来若出现旧配置,废弃必须显式声明,不得直接删除。

废弃流程:

1. 在 04 §13 记录旧配置、新配置、状态、兼容窗口、迁移策略和移除条件。
2. 在配置加载阶段对 deprecated key 输出 sanitized warning 或 validation evidence。
3. 若旧配置和新配置同时出现,必须按明确冲突规则处理,不得让 loader 自行猜测。
4. 若旧配置涉及 secret / credential / endpoint ref,warning 和 audit 只能记录 redacted ref。
5. 下游 05 / 06 / 07 / 09 只能引用 04 的废弃表,不得另设 alias 或兼容窗口。

默认冲突规则:

| 场景 | 处理 |
|---|---|
| 旧 key 单独出现且仍在兼容窗口 | 可按迁移规则映射到新 key,并产生 deprecated evidence |
| 旧 key 和新 key 同时出现且值一致 | 接受新 key,记录旧 key deprecated evidence |
| 旧 key 和新 key 同时出现且值不一致 | fail-fast,不得选择其一 |
| 旧 key 已过兼容窗口 | fail-fast,提示使用新 key |
| legacy source 在 P0 出现 | unsupported fail-fast |

### 3.4 是否需要兼容窗口?

当前没有旧配置,所以当前无兼容窗口。

未来兼容窗口按发布状态决定:

| 阶段 | 是否需要兼容窗口 | 规则 |
|---|---|---|
| 04 正式文档定稿前 | 不需要 | 配置还未发布,直接更新中间产物和正式草稿 |
| 实现仓开工但未发布 | 视影响决定 | 若已有代码 / fixture / tests 使用旧 key,至少保留到当前 commit boundary 完成 |
| 已发布给 CI / integration-like 使用 | 需要 | 至少保留一个受控迁移窗口,并在测试和验收中覆盖旧 key 行为 |
| 已进入 staging-like / production-like | 需要专项 | 兼容窗口由部署与运维手册、发布计划和风险评审定义 |
| 涉及 secret / credential ref | 需要专项 | 必须覆盖轮换、撤销、redaction 和审计 |

兼容窗口内必须保持:

- 旧 key 不产生第二真相。
- 新 key 是正式目标。
- 旧 key 映射必须可审计。
- 旧 key 不得绕过新的 validation 或 sensitive rules。

### 3.5 何时允许移除旧配置?

旧配置同时满足以下条件后才允许移除:

| 移除条件 | 判定方式 |
|---|---|
| 04 §13 已记录废弃和兼容窗口 | 正式配置设计可追溯 |
| 05 已覆盖旧 key、冲突 key、过期 key 的测试切口 | 测试方案和证据可引用 |
| 06 已把过期旧 key 作为验收失败口径 | 验收门禁可裁决 |
| 07 已安排 loader / validation / alias 移除的实施 boundary | 实施计划可执行 |
| 09 已完成真实环境配置迁移说明 | 涉及真实部署时必须满足 |
| 运行证据证明旧 key 不再被使用 | CI / integration / deployment evidence |
| 移除不会改变 03 代码契约,或相关 03 回写已完成 | 详细设计影响闭合 |

禁止行为:

- 无说明删除已发布 key。
- 保留旧 key alias 但不写兼容窗口。
- 旧 key 和新 key 冲突时 silent choose。
- 用下游测试或部署手册临时定义迁移规则。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `04-配置设计.md` | 本 Step 撰写时尚未存在 §13;当前已回填正式 §13 | 本步提供“当前无迁移项”和未来演进规则 |
| Step 7 配置项清单 | 28 个 P0 配置项是首次收敛,没有旧 key 状态 | 本步确认无需 alias / compatibility |
| Step 12 下游承接 | 已要求下游不得重复定义配置契约 | 本步补迁移和废弃也必须由 04 定义 |
| P1/P2 能力 | config center、secret provider、production-like durable adapters、advanced search backend 只有演进方向 | 本步明确这些不是当前迁移项,未来新增需专项 |
| 当前旧 `05/06` | 本 Step 撰写时可能含旧草案语义;当前已生成正式 `05/06` | 历史风险已关闭,不需要迁移兼容 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 旧配置迁移 | 未说明是否存在 | 明确当前无已发布旧配置迁移项 | 防止虚构 legacy key |
| 新配置准入 | 只有“不得静默新增代码契约”原则 | 按配置-only、runtime field、adapter、source、secret provider、production-like、search 分类 | 防止 P1/P2 混入 P0 |
| 废弃策略 | 未定义 | 明确 deprecated key、冲突 key、过期 key 的处理 | 防止 silent choose |
| 兼容窗口 | 未定义 | 按文档定稿前、实现未发布、CI / integration、staging / production、secret ref 分层 | 支撑后续发布 |
| 移除条件 | 未定义 | 定义文档、测试、验收、实施、运维和证据门禁 | 防止无说明删除配置 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 当前无迁移项,只定义未来演进规则 | 不虚构 legacy schema,事实源清晰 | 需要未来变更时重新走流程 | 采用 |
| 方案 B: 为旧 `05/06` 草案保留兼容配置 | 看似稳妥 | 旧 `05/06` 不是配置事实源,会制造第二真相 | 不采用 |
| 方案 C: 允许 loader 长期兼容任意旧 key | 对使用者宽容 | validation 复杂,容易掩盖错误配置 | 不采用 |
| 方案 D: 新增配置无需回写 03,只在 04 写 JSON key | 编写快 | 会静默改变代码契约,实现 agent 无法 1:1 落码 | 不采用 |

推荐方案 A。

原因:

- L1-work 当前还没有发布正式配置 schema,不应制造不存在的旧 key。
- 当前最重要的是防止未来新增 config center、secret provider、production-like adapter、advanced search 等能力时绕过 03 / 04。
- 废弃和兼容需要证据闭环,不能靠实现层临时 alias。

## 7. 结构化中间产物

### 7.1 配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无已发布旧配置 | Step 7 定义的 P0 28 项配置清单 | 当前无迁移项 | 不适用 | 不提供 legacy alias;以本轮 04 正式配置设计为首次配置事实源 | 不适用 |

说明:

- 当前不需要迁移旧 JSON key。
- 当前不需要迁移旧 env key。
- 当前不需要迁移旧 profile 名。
- 当前不需要迁移旧 config source。
- 当前不需要兼容旧 secret / credential ref 形态。

### 7.2 新配置准入表

| 未来配置变更 | 准入条件 | 是否先回写 03 | 是否更新 04 | 下游承接 |
|---|---|---|---|---|
| 修改默认值 | 不改变类型、字段、builder 和失败语义 | 否 | 是 | 05 / 06 更新测试和门禁 |
| 修改 source priority | 改变覆盖链或冲突处理 | 视是否改变 loader 契约 | 是 | 05 / 06 / 07 更新 |
| 新增 `WorkRuntimeConfig` 字段 | 字段、类型、validation、builder 绑定已定义 | 是 | 是 | 05 / 06 / 07 更新 |
| 新增 adapter ref 字段 | adapter constructor 和 fake / configured 口径已闭合 | 是 | 是 | 05 / 06 / 07 / 09 更新 |
| 新增 config center / admin override | 权限、审计、reload、回滚、一致性、last-known-good 专项已完成 | 是 | 是 | 07 / 09 必须专项承接 |
| 新增 secret provider / KMS / Vault | 安全归属、轮换、redaction、fail-closed 和运维流程已闭合 | 是 | 是 | 06 / 09 必须专项承接 |
| 新增 production-like durable adapter | 产品绑定、endpoint ref、credential ref、transaction / retry / timeout 已闭合 | 是 | 是 | 05 / 06 / 07 / 09 更新 |
| 启用 advanced search backend | search contract、backend、query route、projection / index 更新已闭合 | 是 | 是 | 05 / 06 / 07 更新 |
| 新增 clock / id generator 配置 | runtime builder 装配和 deterministic fixture 规则已闭合 | 是 | 是 | 05 / 07 更新 |
| 新增 reports root / artifacts root 配置 | 证据路径、redaction、报告生成规范已闭合 | 视是否改变 runtime config | 是 | 05 / 06 / 07 / 09 更新 |

### 7.3 废弃状态定义表

| 状态 | 含义 | loader 行为 | 文档要求 |
|---|---|---|---|
| `current` | 当前正式配置 | 正常加载和校验 | 04 §7 记录 |
| `deprecated` | 旧配置仍在兼容窗口内 | 可映射到新配置,产生 deprecated evidence | 04 §13 记录窗口和迁移策略 |
| `conflicting` | 旧配置和新配置同时出现且值不一致 | fail-fast | 05 / 06 覆盖 |
| `expired` | 旧配置已过兼容窗口 | fail-fast | 04 §13 记录移除条件 |
| `removed` | 旧配置已从 loader 移除 | unknown key 或 unsupported fail-fast | 07 记录实施 boundary |

### 7.4 兼容窗口规则表

| 使用范围 | 默认兼容窗口 | 例外 |
|---|---|---|
| 文档定稿前 | 无兼容窗口 | 直接更新中间产物和正式草稿 |
| 实现仓未发布 | 到当前 commit boundary 或 phase 结束 | 如果测试 fixture 已广泛使用,需显式覆盖迁移 |
| CI / integration-like 已使用 | 至少一个受控迁移窗口 | 安全漏洞或泄露风险可立即 fail-fast |
| operations-replay 已使用 | 保留到 replay baseline 更新完成 | 若旧配置会污染 replay evidence,立即 fail-fast |
| staging-like / production-like 已使用 | 由部署与运维专项决定 | 重大安全风险可走紧急废弃 |
| secret / credential ref | 至少覆盖轮换和撤销流程 | raw material 泄露风险立即禁用 |

### 7.5 旧新配置冲突处理表

| 输入形态 | 处理结果 | 证据 |
|---|---|---|
| 只出现新 key | accepted | validation outcome |
| 只出现 deprecated old key | accepted with deprecated evidence,仅在兼容窗口内 | old key、mapped new key、redacted value category |
| old key + new key,值一致 | accepted new key,old key deprecated evidence | conflict check outcome |
| old key + new key,值不一致 | fail-fast | sanitized conflict error |
| expired old key | fail-fast | expired key error |
| unknown key | fail-fast | unknown key error |
| legacy source / config center 在 P0 出现 | unsupported fail-fast | unsupported source evidence |

### 7.6 演进候选项清单

| 演进候选项 | 当前状态 | 进入条件 |
|---|---|---|
| config center / admin override | P1/P2,不进入 P0 | 远程配置权限、审计、reload、回滚、一致性专项完成 |
| last-known-good 自动恢复 | P1/P2,不进入 P0 | config center / reload / runtime state / 审计闭合 |
| secret provider / KMS / Vault | P1/P2,不进入 P0 字段全集 | 安全归属、provider API、轮换、redaction、fail-closed 和 09 运维流程闭合 |
| production-like durable store / MQ / endpoint | P1/P2,不进入 P0 | 真实产品绑定、transaction / retry / timeout、credential ref 和部署手册闭合 |
| advanced search backend | 当前默认 disabled | search contract、index projection、query route 和验收门禁闭合 |
| clock / id generator config | 当前由 runtime builder 装配,不新增 config 字段 | 需要显式配置时先回写 03 |
| reports / artifacts root config | 当前由测试 / 报告规范承接,不新增 runtime section | 若成为 runtime config,先回写 03 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前无已发布旧配置迁移项,不提供 legacy alias | 否 | 配置版本口径,无代码契约变化 | 无 | 无回写 |
| 未来新增 `WorkRuntimeConfig` 字段、adapter constructor 参数、config source 或 hot reload 能力必须先回写 03 | 否 | 回写规则,本步不新增字段 | 无 | 无回写 |
| 未来旧 key 和新 key 冲突默认 fail-fast,不得 silent choose | 否 | 配置演进策略,当前不新增 loader alias | 无 | 无回写 |
| config center、secret provider、production-like durable adapter、advanced search 等保持 P1/P2 或条件能力 | 否 | 范围裁剪,不新增当前 P0 契约 | 无 | 无回写 |

说明:

```text
本步没有新增配置字段、旧 key alias、schema_version 字段、migration loader、ConfigError enum 或 runtime reload API。
若未来需要在 loader 中支持 deprecated key alias、schema_version 或 migration report,必须先判断是否改变 03 详细设计中的 config loader / DTO / error 契约。
```

## 9. 回填草稿

正式 `04-配置设计.md` §13 建议采用以下结构:

```text
13. 配置迁移、废弃与演进
  13.1 当前迁移状态
  13.2 配置迁移与废弃表
  13.3 新配置准入规则
  13.4 废弃状态与兼容窗口
  13.5 旧新配置冲突处理
  13.6 演进候选项
  13.7 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §13.1 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §3.1 |
| §13.2 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §7.1 |
| §13.3 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §7.2 |
| §13.4 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §7.3 / §7.4 |
| §13.5 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §7.5 |
| §13.6 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §7.6 |
| §13.7 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 14 的待确认事项。

后续 Step 必须继续收口:

- Step 14 汇总 P1/P2 演进候选项的风险,尤其是 config center、secret provider、production-like durable adapter、advanced search、last-known-good、clock / id generator 和 reports root。
- Step 14 汇总“下游重写配置契约”风险。
- Step 15 生成正式 `04-配置设计.md` 时,不得把演进候选项写成 P0 已支持配置。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 是否存在旧配置迁移项已明确 | 通过 | §3.1 / §7.1 当前无 |
| 新配置引入规则已明确 | 通过 | §3.2 / §7.2 |
| 旧配置废弃规则已明确 | 通过 | §3.3 / §7.3 |
| 兼容窗口规则已明确 | 通过 | §3.4 / §7.4 |
| 旧配置移除条件已明确 | 通过 | §3.5 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 14 | 通过 | 下一步定义风险与待确认事项 |
