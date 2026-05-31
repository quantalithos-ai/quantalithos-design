# Step 13. 定义配置迁移、废弃与演进

> 本文件是 `projects/L0-sdk/04-配置设计.md` 的 Step 13 中间产物。
> 本步定义配置新增、重命名、废弃、迁移和移除策略。
> 当前 L0-sdk 尚未发布正式 `04-配置设计.md`,因此当前无已发布配置迁移项。

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 13
- 回填章节：`projects/L0-sdk/04-配置设计.md` §13 配置迁移、废弃与演进

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 7 配置项清单 | 11 个既有 `SdkRuntimeConfig` 配置组内的字段级 JSON key | 作为首版 active 配置基线 |
| Step 8 敏感配置 | P0 无 secret material;future credential / registry / secret provider 只保留引用边界 | 定义敏感配置演进门禁 |
| Step 9 加载校验 | P0 无 reload / hot update;unsupported 配置必须拒绝 | 定义迁移时 loader / validator 行为边界 |
| Step 12 下游承接 | 05/06/07/09 不得重复定义配置契约 | 定义配置演进时下游同步要求 |
| `03-详细设计.md` §13 / §15 / §17 | 已定义 11 个 config 组、脚本 / 产物最小契约和风险 | 防止 04 静默新增代码契约 |
| 当前文档状态 | 正式 `04-配置设计.md` 尚未创建;当前 `05/06` 仍是旧口径 | 判断本轮无旧版正式配置需要迁移 |

已确认结论:

```text
本轮是 L0-sdk 首版正式配置设计,当前不存在已发布旧配置需要迁移。
Step 7 中 11 个既有配置组和字段级 JSON key 作为首版 active 配置基线。
历史草稿、旧 05/06 的环境表述、未发布中间产物中的名称不构成已发布配置契约。
未来新增、重命名、废弃或移除配置时,必须先判断是否影响 03 代码契约。
凡是会改变 SdkRuntimeConfig、builder、adapter constructor、trait、error、DTO、event、job receipt 或 function flow 的配置演进,必须先回写 03。
```

## 3. SOP 问题回答

1. 是否存在旧配置需要迁移?

   回答：当前不存在已发布旧配置需要迁移。原因是正式 `projects/L0-sdk/04-配置设计.md` 尚未创建,本轮 Step 7 是第一次把 P0 配置项按 11 个 `SdkRuntimeConfig` 配置组和字段级 JSON key 收敛为可实现清单。旧 `05-测试方案.md` / `06-验收标准.md` 中的 dev / test / staging 表述不是配置事实源,不应反向制造迁移项。草稿中出现过的 `sdk` 前缀、root `profile`、remote config、public registry token 等也不是已发布配置。

2. 新配置如何引入?

   回答：新配置引入必须先分类。若只是补充说明、默认值解释、profile 适用范围、失败策略或下游证据要求,可以在 04 对应章节演进。若会新增 root 配置组、`SdkRuntimeConfig` 字段、公开 loader API、runtime builder 参数、adapter constructor 参数、trait、error enum、DTO、event、job receipt 或函数流,必须先回写 `03-详细设计.md`,再更新 04、05、06、07 和必要的 09。新增配置必须同时定义名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略、关联模块、测试切口和验收门禁。

3. 旧配置如何废弃?

   回答：已发布配置不得直接删除。旧配置必须先进入 deprecated 状态,说明替代配置、废弃原因、兼容窗口、迁移方式、冲突处理、测试覆盖、验收门禁和移除条件。deprecated 配置不得继续作为推荐写法出现在 JSON demo、测试 fixture、实施计划或运维手册中。涉及 secret、credential、endpoint、boundary、policy、artifact root、outbox root、projection root 或 runner 的废弃项必须额外说明安全影响和回滚方式。

4. 是否需要兼容窗口?

   回答：已发布配置重命名或语义变化需要兼容窗口。普通字段重命名可以短期双读,但旧 key 必须产生 deprecation warning / report,且旧 key 与新 key 同时出现时必须 fail-fast。安全红线配置不提供放宽兼容窗口,例如关闭 redaction、允许 raw secret、关闭 fake marker、关闭 compatibility gate 或禁用 run id 的旧值必须立即拒绝。当前本轮尚未发布正式 04,所以无兼容窗口。

5. 何时允许移除旧配置?

   回答：只有同时满足以下条件才允许移除旧配置: 兼容窗口结束;05 已覆盖旧 key 拒绝或迁移测试;06 已更新移除门禁;07 已安排删除兼容路径和提交边界;09 或等价运维文档已移除旧 env / 部署参数;JSON demo、fixture、CI、job、README、reports 示例均不再引用旧 key;如涉及代码契约,03 已完成回写并确认。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| `04-配置设计.md` §13 | 尚未存在迁移、废弃与演进章节 | 未来配置改名或删除时没有基线 | 明确当前无迁移项并建立首版 active 基线 |
| Step 7 配置项清单 | 已定义 11 个配置组和字段级 key | 需要说明这些是首版 active,不是迁移后的新旧并存项 | 作为当前配置基线 |
| Step 7 暂不列为 P0 的控制面 | `SdkRuntimeConfig.profile`、remote config、public registry token、production endpoint matrix 等已后移 | 未来可能绕过 03 直接塞入 04 或实施计划 | 列入候选 / rejected 演进表 |
| Step 12 下游承接 | 已规定下游不得重新定义配置契约 | 配置演进时必须同步下游 | 纳入新增、废弃和移除门禁 |
| 当前 `05/06` | 仍是旧口径 | 不能把旧口径误认为旧配置契约 | 明确不构成迁移来源 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前迁移状态 | 未说明是否有旧配置 | 明确当前无已发布旧配置迁移项 | 满足 SOP,避免虚构兼容负担 |
| 首版配置基线 | 只有 Step 7 配置项清单 | 明确 11 个配置组和字段级 key 是首版 active | 为未来演进提供基线 |
| 新配置引入 | 只有零散回写提醒 | 建立 03 影响判定和下游同步门禁 | 防止 04 静默改变代码契约 |
| 旧配置废弃 | 未定义状态和流程 | 定义 active / deprecated / retired / removed / rejected | 防止无说明删除已发布配置 |
| 兼容窗口 | 未定义 | 普通字段可短期双读,安全红线不兼容放宽 | 平衡兼容与安全 |
| 03 回写 | 未判断 | 本步不新增配置项,无需回写 03 | 保持当前设计边界 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：把草稿名、旧 05/06 环境名都写成迁移项 | 看似严谨 | 会把非事实源内容变成兼容负担 | 不采用 |
| 方案 B：当前明确无迁移项,以 Step 7 作为首版 active 基线 | 简洁,符合事实源边界 | 需要后续正式 04 发布后再维护迁移表 | 采用 |
| 方案 C：首版新增 `config_schema_version` 正式字段 | 未来自动迁移更方便 | 会新增 `SdkRuntimeConfig` 或 loader 契约,03 未定义 | 不采用 |
| 方案 D：允许已发布旧 key 永久双读 | 兼容性强 | 技术债长期存在,来源优先级和审计变复杂 | 不采用 |
| 方案 E：已发布配置可直接删除 | 实现简单 | 破坏下游 CI、运维和用户配置 | 不采用 |

推荐方案 B。

原因:

- 当前没有正式 04,也没有已发布 SDK 配置 schema,不应制造不存在的迁移历史。
- 11 个既有 `SdkRuntimeConfig` 配置组已经足以作为首版 active 配置基线。
- 未来配置演进必须服从 03 -> 04 -> 05/06/07/09 的链路,不能由实施计划或代码直接扩展。

## 7. 结构化中间产物

#### 配置演进流程图: L0-sdk 配置新增、废弃与移除

```text
[propose config change]
        |
        v
[classify semantic vs code-contract impact]
        |
        +--> [code-contract impact]
        |          |
        |          v
        |      [update 03 first]
        |
        v
[update 04 config contract]
        |
        v
[update 05 / 06 / 07 / 09 handoff]
        |
        v
[release active or deprecated config]
        |
        v
[observe compatibility window]
        |
        v
[remove only after downstream refs are gone]
```

关键说明:

- 本图表达配置演进门禁,不表达运行时自动迁移器。
- 任何代码契约变化必须先回写 03,再改 04。
- 已发布配置不得无说明删除。
- 下游引用清零是移除旧配置的必要条件。

### 7.1 当前配置迁移与废弃表

| 旧配置 | 新配置 | 状态 | 兼容窗口 | 迁移策略 | 移除条件 |
|---|---|---|---|---|---|
| 无 | 11 个 `SdkRuntimeConfig` 配置组内的首版字段级 JSON key | active | 不适用 | 当前是首版正式配置设计,无旧 key 需要迁移 | 不适用 |

说明:

- 当前不存在旧配置到新配置的迁移映射。
- 首版 active 配置组为 `store`、`sources`、`boundaries`、`runners`、`artifacts`、`outbox`、`projections`、`language_packages`、`policies`、`cli`、`jobs`。
- `sdk` / `l0_sdk` 包裹前缀、root `profile`、remote config、admin override、public registry token、raw secret 不属于当前 active 配置。

### 7.2 配置状态定义表

| 状态 | 含义 | 允许行为 |
|---|---|---|
| candidate | 候选配置,尚未进入正式 P0 配置项 | 可讨论和记录,不得要求实施者在正式配置中使用 |
| active | 当前正式支持配置项 | 可在 JSON / env / CLI selector / job-local 参数中使用,必须测试和验收 |
| deprecated | 已废弃但仍在兼容窗口内 | loader 可短期接受,validator / report 必须提示迁移 |
| retired | 不再推荐且准备移除 | 只允许按迁移路径使用,验收必须跟踪移除计划 |
| removed | 已移除配置项 | 不得继续接受;出现时 fail-fast 或按未知配置处理 |
| rejected | 明确不允许配置化 | 出现时 fail-fast,只能通过设计变更流程重新讨论 |

### 7.3 新配置引入门禁表

| 门禁 | 必须满足 |
|---|---|
| 上游一致 | 需求、架构、概要和详细设计允许该配置存在 |
| 03 影响判定 | 如影响 `SdkRuntimeConfig`、builder、adapter、trait、error、DTO、event、job receipt 或 function flow,先回写 03 |
| 配置项完整 | 名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略、关联模块完整 |
| 安全边界 | 不引入 raw secret;如为 sensitive ref,必须定义脱敏、审计和 fail-closed |
| 失败策略 | 定义 fail-fast、fail-closed、pending、failed、stale、skipped 或 Dependency 行为 |
| JSON demo | 模块级 demo 使用严格 JSON;完整说明示例可用 JSONC,但实际运行配置必须是严格 JSON |
| 测试承接 | 05 增加正向、负向、来源优先级、cross-field 和失效场景 |
| 验收承接 | 06 增加通过条件、失败条件和一票否决项 |
| 实施承接 | 07 增加实现顺序、commit boundary、回退点和报告产物 |
| 运维承接 | 09 增加真实环境路径、变量注入、provider、轮换或恢复步骤 |

### 7.4 候选配置演进表

| 候选控制面 | 当前状态 | 若要进入正式配置项 |
|---|---|---|
| `SdkRuntimeConfig.profile` 或 root `profile` | candidate;当前只是 Step 6 矩阵分类 | 先回写 03,定义字段 / enum / builder 使用方式,再更新 04 |
| remote config / config center | candidate for P2;P0 rejected | 先设计 reload、审计、回滚、不可用策略和 last-known-good |
| admin override | rejected for P0 | 需要权限、审计、回滚和安全边界专项 |
| reload / hot update | rejected for P0 | 先回写 03,定义生命周期、状态、一致性和回滚机制 |
| public registry publish token | candidate for release / operations | 先设计 secret provider / credential ref,再由 09 承接真实注入 |
| registry credential ref | candidate for P1/P2 | 先回写 03 或发布专项,定义 adapter contract 和 redaction 规则 |
| production endpoint matrix | candidate for production-like | 先定义 endpoint ref、credential ref、profile 和运维绑定 |
| remote runner / toolchain runner args / timeout | candidate | 先回写 03 或在 07 中定义真实 runner contract,再进入 04 |
| config fingerprint API / config report DTO | candidate | 若进入正式 API / DTO / job receipt,必须先回写 03 |
| raw secret / raw token / credential value | rejected | 永远不作为配置项;出现时 fail-fast |
| fake marker disable switch | rejected | 不允许配置化关闭;出现时 fail-fast |
| compatibility gate bypass | rejected | 不允许配置化绕过;出现时 fail-fast |

### 7.5 废弃与移除规则表

| 阶段 | loader 行为 | validator / report 行为 | 下游要求 |
|---|---|---|---|
| active | 接受正式 key | 正常校验和摘要 | 05 / 06 / 07 / 09 正常承接 |
| deprecated | 可短期接受旧 key;新旧 key 同时出现时 fail-fast | 输出 deprecation warning / report,提示替代项 | 05 覆盖 warning 和冲突;06 跟踪移除条件 |
| retired | 只允许按迁移路径使用旧 key | warning 升级为 gate 或 error | 07 安排删除兼容路径;09 清理部署参数 |
| removed | 拒绝旧 key | unknown / unsupported config key,fail-fast | 05 覆盖旧 key 拒绝;06 更新门禁 |
| rejected | 拒绝该配置能力 | fail-fast / forbidden config | 下游不得使用或重新定义 |

### 7.6 移除前检查清单

| 检查项 | 必须结果 |
|---|---|
| 正式 04 | 已标记 deprecated / retired,并说明替代项和移除条件 |
| 03 回写 | 如涉及代码契约,已完成回写并确认 |
| 05 测试方案 | 已覆盖旧 key warning、冲突或拒绝场景 |
| 06 验收标准 | 已更新一票否决或移除门禁 |
| 07 实施计划 | 已安排删除兼容路径、提交边界和回退点 |
| 09 运维文档 | 已移除旧 env、旧配置文件和旧部署参数 |
| 示例与 fixture | JSON demo、fixture、CI、job、README、reports 示例不再引用旧 key |
| 发布说明 | 已说明迁移动作、影响范围和回滚方式 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前无已发布配置迁移项,11 个配置组作为首版 active 基线 | 否 | 配置设计基线说明 | 无 | 无回写 |
| 不新增 `config_schema_version`、root `profile` 或迁移器 API | 否 | 避免新增 runtime config / loader 字段 | 无 | 无回写 |
| 配置演进规则要求代码契约变化先回写 03 | 否 | 文档门禁规则 | 无 | 无回写 |
| 若未来新增 remote config、reload、registry credential、production endpoint matrix 或 config report API | 是 | runtime config / adapter / DTO / lifecycle 变化 | `03-详细设计.md` §13 / §14 / §15 或相关对象 / adapter 契约章节 | 待回写 |

说明:

- 本步没有新增 `SdkRuntimeConfig` 字段、配置解析 API、迁移器、错误枚举、事件或审计结构。
- 本步只定义配置契约未来如何演进,不改变当前可实现代码契约。

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §13。

````md
## 13. 配置迁移、废弃与演进

> 校准来源：
> - `design-calibration/04_config_step_13_migration_deprecation_evolution.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“当前配置迁移与废弃表”“配置状态定义表”“新配置引入门禁表”“候选配置演进表”“废弃与移除规则表”和“对详细设计的影响判定”小节。

本轮是 L0-sdk 首版正式配置设计,当前不存在已发布旧配置需要迁移。`store`、`sources`、`boundaries`、`runners`、`artifacts`、`outbox`、`projections`、`language_packages`、`policies`、`cli`、`jobs` 作为首版 active 配置组进入正式配置设计。

配置新增、重命名、废弃或移除时,必须先判断是否影响代码契约。如果会新增或改变 `SdkRuntimeConfig` 字段、runtime builder 参数、adapter constructor 参数、trait、error enum、DTO、event、job receipt 或函数流,必须先回写 `03-详细设计.md`,再更新 04、05、06、07 和必要的 09。

已发布配置不得无说明删除。旧配置废弃必须经过 deprecated / retired 状态,说明替代项、原因、兼容窗口、迁移步骤和移除条件。兼容窗口结束、下游引用清零、测试验收实施运维文档完成同步后,才允许进入 removed 状态。

`SdkRuntimeConfig.profile`、remote config / config center、admin override、reload / hot update、public registry publish token、registry credential ref、production endpoint matrix、remote runner 和 config report API 仍不是本轮 active 配置项。若后续需要配置化,必须按新配置引入门禁处理。
````

## 10. 待确认事项

- 是否接受当前无已发布旧配置迁移项。
- 是否接受 11 个既有 `SdkRuntimeConfig` 配置组作为首版 active 配置基线。
- 是否接受本轮不新增 `config_schema_version`、root `profile` 或迁移器 API。
- 是否接受普通字段重命名可短期双读并 warning,但安全红线旧值不提供放宽兼容。
- 是否接受本步无需回写 `03-详细设计.md`。

## 11. 进入下一步条件

- [x] 当前迁移状态已说明:无已发布旧配置迁移项。
- [x] 首版 active 配置基线已明确。
- [x] 新配置引入门禁已明确。
- [x] 废弃、兼容窗口和移除条件已明确。
- [x] 本步无需回写 `03-详细设计.md`。
- [x] Step 13 状态从 `[~]` 更新为 `[x]`。
