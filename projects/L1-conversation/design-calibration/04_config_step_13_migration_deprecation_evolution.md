# Step 13. 定义配置迁移、废弃与演进

> 本文件是 `projects/L1-conversation/04-配置设计.md` 的 Step 13 中间产物。
> 本步定义配置新增、重命名、废弃、迁移和移除策略。
> 本步不新增配置项、不改变 `03-详细设计.md` 中的 runtime config、adapter、trait、error 或 job 契约。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 13
- 回填章节: `projects/L1-conversation/04-配置设计.md` §13 配置迁移、废弃与演进

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_07_config_items.md` | 12 个顶层配置模块、字段级配置项、`runtime.config_version = v1` | 判断当前是否存在迁移项 |
| `04_config_step_05_sources_priority_conflicts.md` | 来源优先级和冲突处理 | 定义旧 key / 新 key 并存时的处理规则 |
| `04_config_step_08_sensitive_secrets.md` | sensitive ref 和 raw secret 禁止 | 定义未来 sensitive 配置演进门禁 |
| `04_config_step_12_downstream_handoff.md` | 下游不得重复定义配置契约 | 定义配置演进时下游同步要求 |
| `03-详细设计.md` §13 | 现有配置绑定点和外部依赖绑定 | 防止 04 静默新增代码契约 |

已确认结论:

```text
本轮是 L1-conversation 首版正式配置设计,当前无已发布旧配置需要迁移。
Step 7 定义的 12 个顶层模块和字段级配置项作为 v1 active 配置契约。
未来新增、重命名或移除配置项时,不得只改 04;如果影响 ConversationRuntimeConfig、runtime builder、adapter constructor、trait、error、DTO、job receipt 或 event,必须先回写 03。
```

## 3. SOP 问题回答

### 3.1 是否存在旧配置需要迁移?

当前不存在已发布旧配置需要迁移。原因是正式 `04-配置设计.md` 尚未创建,本轮 Step 7 是首次把 P0 配置项收敛成 v1 配置契约。旧 `05/06` 是旧口径下游草案,不是已发布配置契约。

### 3.2 新配置如何引入?

新配置必须先判断是否影响代码契约:

- 只补充默认值、profile 适用范围、失败策略或下游证据要求: 可在 04 演进。
- 新增 config 字段、runtime builder 参数、adapter constructor 参数、trait、error、DTO、job receipt、event 或 audit output: 必须先回写 03。
- 新配置必须同时补齐名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略、关联模块、测试切口和验收门禁。

### 3.3 旧配置如何废弃?

旧配置不得直接删除。必须先标记 deprecated,说明替代项、废弃原因、兼容窗口、迁移方式、提示方式、测试覆盖和移除条件。deprecated 配置不得继续出现在推荐 demo 中。

### 3.4 是否需要兼容窗口?

已发布配置重命名或语义变更时需要兼容窗口。推荐至少覆盖一个正式 release / implementation cycle。尚未发布、仅处于 design-calibration 的配置可以在正式 04 前清理,但必须在 Step 14 汇总风险中说明。

### 3.5 何时允许移除旧配置?

只有满足以下条件才允许移除:

- 兼容窗口结束。
- `05` 已覆盖旧配置拒绝或迁移路径。
- `06` 已更新验收门禁。
- `07` 或 release note 已说明迁移动作。
- 运维文档已移除旧环境变量、路径或部署参数。
- 所有下游配置文件、CI、job、报告脚本和文档示例不再引用旧 key。
- 如影响代码契约,`03` 已完成回写。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` | 尚无迁移、废弃与演进章节 | 未来配置变更可能无说明删除或重命名 |
| Step 7 配置项清单 | 已形成 v1 active 配置契约 | 需要明确当前不是新旧并存状态 |
| Step 12 下游承接 | 已定义下游不得重复定义配置契约 | 演进时必须同步 05/06/07/运维 |
| 当前旧 `05/06` | 仍是旧口径 | 不能把旧口径误认为旧配置契约 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前迁移状态 | 未说明是否有旧配置 | 明确当前无已发布旧配置需要迁移 | 防止虚构兼容负担 |
| v1 配置项 | 只知道是 Step 7 清单 | 明确作为首版 active 配置契约 | 让后续演进有基线 |
| 新配置引入 | 未定义门禁 | 必须判断是否影响 03,并补齐配置项全字段 | 防止 04 静默新增代码契约 |
| 旧配置废弃 | 未定义流程 | deprecated -> compatibility window -> removal | 防止无说明删除已发布配置 |
| 下游同步 | 只在 Step 12 讲承接 | 演进时必须同步 05/06/07/运维 | 防止测试、验收、实施和运维漂移 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 当前虚构 legacy 迁移表 | 看似完整 | 会制造不存在的兼容负担 | 不采用 |
| 方案 B: 当前明确无迁移项,只定义未来演进门禁 | 不改变代码契约,符合首版状态 | 后续自动迁移能力需另行设计 | 采用 |
| 方案 C: 允许旧 key 和新 key 长期并存 | 兼容性强 | 来源优先级、审计和测试会变复杂 | 不采用 |
| 方案 D: 已发布配置可直接删除 | 简单 | 破坏下游 CI、实施和运维 | 不采用 |

推荐方案 B。

原因:

- 当前还没有正式 `04-配置设计.md`,不能虚构旧配置。
- 配置演进需要保护 03 代码契约、05 测试、06 验收、07 实施和运维材料的一致性。

## 7. 结构化中间产物

### 7.1 当前配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | v1 active 配置契约: `runtime`、`storage`、`api`、`worker`、`outbox`、`resolver`、`handoff`、`jobs`、`retention`、`projection`、`reports`、`security` | active | 不适用 | 当前是首版正式配置设计,无旧 key 需要迁移 | 不适用 |

### 7.2 配置状态定义表

| 状态 | 含义 | 允许行为 |
|---|---|---|
| candidate | 候选配置,尚未进入正式 P0 配置项 | 可讨论,不得在正式配置文件中要求使用 |
| active | 当前正式支持配置项 | 可在 JSON / env / entry args 允许范围内使用,必须测试和验收 |
| deprecated | 已废弃但仍在兼容窗口内 | 可被读取或迁移,必须提示并给出替代项 |
| removed | 已移除配置项 | 不得继续接受;出现时 fail-fast 或 unknown key |
| rejected | 明确不允许配置化 | 出现时 fail-fast,进入设计变更流程 |

### 7.3 新配置引入门禁表

| 门禁 | 必须满足 |
|---|---|
| 上游一致 | 需求、架构、概要和详细设计允许该配置存在 |
| 03 影响判定 | 如影响 runtime config、adapter、trait、error、DTO、job receipt 或 event,先回写 03 |
| 配置项完整 | 名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略、关联模块完整 |
| 安全边界 | 不引入 raw secret;如为 sensitive ref,必须定义脱敏和审计 |
| 失败策略 | 定义 fail-fast / fail-closed / unresolved / retry / stale / failed 等行为 |
| 测试承接 | 05 增加正向、负向、来源优先级和失效场景 |
| 验收承接 | 06 增加通过条件、失败条件和必要一票否决 |
| 实施承接 | 07 增加实现顺序、提交边界和回退点 |
| 运维承接 | 运维文档增加真实环境准备、权限、轮换或恢复步骤 |

### 7.4 候选配置演进表

| 候选控制面 | 当前状态 | 若要进入正式配置项 |
|---|---|---|
| durable store 产品字段全集 | candidate(P1) | 先确认 adapter contract 和运维边界,必要时回写 03 |
| real event bus endpoint matrix | candidate(P1) | 先确认 publisher / consumer adapter 契约和测试验收 |
| real identity / work / governance / artifact / runtime / bridge adapter 参数 | candidate(P1) | 先对齐相邻仓契约,必要时回写 03 |
| observability / archive production handoff 字段 | candidate(P1) | 先确认 handoff payload ref、credential ref 和 redaction 规则 |
| secret provider / KMS / Vault config | candidate(P1/P2) | 先设计 provider binding、轮换、审计和运维步骤 |
| config center / admin override / hot reload | rejected for P0;candidate(P2) | 需要单独设计 reload、last-known-good、审计、回滚和权限 |
| consistency auto repair | rejected 当前 | 必须回退需求 / 概要 / 详细设计,当前只允许 diagnostic |

### 7.5 废弃与移除规则表

| 阶段 | 必须动作 | 禁止事项 |
|---|---|---|
| 标记 deprecated | 写明替代项、原因、兼容窗口、迁移步骤和失败策略 | 只口头说“不推荐” |
| 兼容窗口 | 保留读取或迁移支持,输出脱敏 warning 或迁移提示 | 新 demo 继续推荐旧 key |
| 下游同步 | 更新 05/06/07/运维和示例配置 | 只改 04 不改测试验收实施运维 |
| 移除前检查 | 确认下游引用清零、测试覆盖旧 key 拒绝、03 如需已回写 | 尚有 CI / job / 文档示例引用时移除 |
| 移除 | 将旧 key 标为 removed,出现时 fail-fast 或 unknown key | silent ignore 高风险旧 key |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前无旧配置迁移项,v1 配置契约作为首版 active 配置 | 否 | 配置设计基线说明 | 无 | 无回写 |
| 不新增自动迁移器、compat reader 或 runtime reload 机制 | 否 | 避免新增代码契约 | 无 | 无回写 |
| 配置演进规则要求代码契约变化先回写 03 | 否 | 文档门禁规则 | 无 | 无回写 |
| P1/P2 候选配置不得绕过 03 直接进入正式配置项 | 否 | 演进约束 | 无 | 无回写 |

## 9. 回填草稿

正式 `04-配置设计.md` §13 建议采用以下结构:

```text
13. 配置迁移、废弃与演进
  13.1 当前配置迁移与废弃表
  13.2 配置状态定义表
  13.3 新配置引入门禁表
  13.4 候选配置演进表
  13.5 废弃与移除规则表
  13.6 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §13.1 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §7.1 |
| §13.2 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §7.2 |
| §13.3 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §7.3 |
| §13.4 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §7.4 |
| §13.5 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §7.5 |
| §13.6 | `design-calibration/04_config_step_13_migration_deprecation_evolution.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 14 的待确认事项。

后续 Step 必须继续收口:

- Step 14 汇总 P1/P2 候选配置、当前不回写 03 的原因和风险。
- Step 15 组装正式文档时必须明确“当前无迁移项”。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 当前无迁移项已明确 | 通过 | §7.1 |
| 配置状态定义已明确 | 通过 | §7.2 |
| 新配置引入门禁已明确 | 通过 | §7.3 |
| 废弃与移除规则已明确 | 通过 | §7.5 |
| 可以进入 Step 14 | 通过 | 下一步定义风险与待确认事项 |
