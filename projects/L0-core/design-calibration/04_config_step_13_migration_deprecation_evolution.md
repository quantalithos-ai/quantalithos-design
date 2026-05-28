# Step 13. 定义配置迁移、废弃与演进

> 本文件是 `projects/L0-core/04-配置设计.md` 的 Step 13 中间产物。
> 本步定义配置新增、重命名、废弃、迁移和移除策略。
> 本步不新增配置项、不定义配置 schema version 字段、不改变 `03-详细设计.md` 中的 `CoreRuntimeConfig`、adapter、trait、error 或 job 契约。

---

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 13
- 回填章节：`projects/L0-core/04-配置设计.md` §13 配置迁移、废弃与演进

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 7 配置项清单 | 7 个正式 P0 配置项,全部映射到既有 `CoreRuntimeConfig` 字段 | 判断当前是否存在迁移项 |
| Step 5 来源优先级 | defaults / file / env / CLI flags 和冲突处理 | 定义旧 key / 新 key 并存时的处理规则 |
| Step 8 敏感配置 | P0 无 secret 正式项,P1/P2 只有 secret ref 边界 | 定义 future sensitive ref 的演进门禁 |
| Step 12 下游承接 | 05/06/07/09 必须承接配置契约,不得重复定义 | 定义配置演进时下游同步要求 |
| `03-详细设计.md` §13 | 现有 runtime config 字段只有 7 个 | 防止 04 静默新增代码契约 |
| 当前文档状态 | 正式 `04-配置设计.md` 尚未生成 | 判断本轮无旧版正式配置需要迁移 |

已确认结论:

```text
本轮是 L0-core 首版正式配置设计,当前无已发布旧配置需要迁移。
7 个 P0 配置项作为首版 active 配置项进入正式 04。
未来新增、重命名或移除配置项时,不得只改 04;如果影响 CoreRuntimeConfig、adapter constructor、trait、error、DTO 或函数流,必须先回写 03。
runtime_profile、publisher mode、toolchain runner mode、secret provider 等仍是 future candidate,不是当前 active 配置项。
```

---

## 3. SOP 问题回答

1. 是否存在旧配置需要迁移?

   回答：当前不存在已发布旧配置需要迁移。原因是正式 `projects/L0-core/04-配置设计.md` 尚未生成,本轮 Step 7 也是首次把 P0 配置项收敛为 7 个正式外部 key。旧 `05/06` 中的内容属于旧口径下游文档,不是已发布配置契约。因此本步必须明确“当前无迁移项”,不能虚构旧配置兼容表。

2. 新配置如何引入?

   回答：新配置引入必须先判断它是纯配置语义扩展,还是代码契约变化。如果只是补充默认值说明、profile 使用范围、失败策略或下游证据要求,可以在 04 中演进。如果会新增 `CoreRuntimeConfig` 字段、runtime builder 参数、adapter constructor 参数、trait、error enum、DTO、job receipt 或事件字段,必须先回写 `03-详细设计.md`,再更新 04、05、06、07 和必要的 09。新配置必须同时定义名称、类型、默认值、来源、作用域、生效方式、敏感级别、失败策略、关联模块、测试切口和验收门禁。

3. 旧配置如何废弃?

   回答：旧配置废弃不能直接删除。必须先标记为 deprecated,说明替代配置、废弃原因、兼容窗口、迁移方式、告警或提示方式、测试覆盖和移除条件。deprecated 配置不得继续作为推荐写法出现在示例中。若旧配置涉及 secret ref 或高风险 root,废弃说明必须额外包含安全影响和回滚方式。

4. 是否需要兼容窗口?

   回答：已发布配置重命名或语义变更时需要兼容窗口。推荐兼容窗口至少覆盖一个正式 release / implementation cycle;如果尚未发布或仅在 design-calibration 阶段,可以不设兼容窗口,但必须在正式 04 前清理干净。高风险配置不建议长期双写或双读,因为 root、audit、outbox、idempotency 和 resolver 混用会放大一致性风险。

5. 何时允许移除旧配置?

   回答：只有满足以下条件才允许移除旧配置: 兼容窗口结束;05 测试方案已覆盖旧配置拒绝或迁移路径;06 验收标准已更新门禁;07 实施计划或 release note 已说明迁移动作;09 运维手册已移除旧环境变量或部署参数;所有下游配置文件、CI、job、文档示例不再引用旧 key;如影响代码契约,03 已完成回写并确认。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `04-配置设计.md` §13 | 尚未存在迁移、废弃与演进章节 | 未来改配置时容易直接删除或重命名,造成下游漂移 |
| Step 7 配置项清单 | 已定义首版 7 个 active 配置项 | 需要明确它们不是迁移后的新旧并存项 |
| Step 7 暂不列为正式 P0 配置项的控制面 | 已列出 runtime_profile、publisher mode、secret provider 等候选项 | 需要说明候选项不能绕过 03 直接进入 04 |
| Step 12 下游承接 | 已定义 05/06/07/09 承接关系 | 配置演进时必须同步这些下游文档 |
| 当前 `05/06` | 仍是旧口径 | 不能把旧口径误认为旧配置契约 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前迁移状态 | 未说明是否有旧配置 | 明确当前无已发布旧配置需要迁移 | 防止虚构兼容负担 |
| 7 个 P0 配置项 | 只知道是正式清单 | 明确作为首版 active 配置项进入 04 | 让后续演进有基线 |
| 新配置引入 | 未定义门禁 | 必须判断是否影响 03,并补齐配置项全字段 | 防止 04 静默新增代码契约 |
| 旧配置废弃 | 未定义流程 | deprecated -> compatibility window -> removal | 防止无说明删除已发布配置 |
| 下游同步 | 只在 Step 12 讲承接 | 演进时必须同步 05/06/07/09 | 防止测试、验收、实施和运维漂移 |
| 03 回写 | 未判断 | 本步不新增配置项,无回写 | 保持当前设计边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：首版就引入 `config_schema_version` 作为正式配置项 | 未来迁移更自动化 | 会新增 runtime config 或解析契约,当前 03 未定义 | 不采用 |
| 方案 B：当前只定义文档级演进规则,不新增配置项 | 不改变代码契约,足以指导首版 | 后续自动迁移能力需要另行设计 | 采用 |
| 方案 C：允许旧 key 和新 key 长期并存 | 兼容性强 | 容易造成来源优先级和审计歧义 | 不采用 |
| 方案 D：已发布配置可直接删除 | 简单 | 会破坏下游 CI、实施和运维 | 不采用 |

---

## 7. 结构化中间产物

#### 配置演进流程图: L0-core 配置新增、废弃与移除

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
[release with active or deprecated status]
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
| 无 | 7 个首版 P0 配置项 | active | 不适用 | 当前是首版正式配置设计,无旧 key 需要迁移 | 不适用 |

说明:

- 当前不存在旧配置到新配置的迁移映射。
- 7 个 P0 配置项包括 `contract_source.root`、`release_snapshot.root`、`projection_index.root`、`audit.root`、`outbox.root`、`idempotency.root`、`reference_resolver.config`。

### 7.2 配置状态定义表

| 状态 | 含义 | 允许行为 |
|---|---|---|
| candidate | 候选配置,尚未进入正式 P0 配置项 | 可讨论,不得在正式配置文件中要求使用 |
| active | 当前正式支持配置项 | 可在 file / env / CLI flags 中使用,必须测试和验收 |
| deprecated | 已废弃但仍在兼容窗口内 | 可被读取或迁移,必须提示并给出替代项 |
| removed | 已移除配置项 | 不得继续接受;出现时 fail fast 或按未知配置处理 |
| rejected | 明确不允许配置化 | 出现时 fail fast,进入设计变更流程 |

### 7.3 新配置引入门禁表

| 门禁 | 必须满足 |
|---|---|
| 上游一致 | 需求、架构、概要和详细设计允许该配置存在 |
| 03 影响判定 | 如影响 `CoreRuntimeConfig`、adapter、trait、error、DTO、job receipt 或事件,先回写 03 |
| 配置项完整 | 名称、类型、默认值、必填性、来源、作用域、生效方式、敏感级别、失败策略、关联模块完整 |
| 安全边界 | 不引入 raw secret;如为 sensitive ref,必须定义脱敏和审计 |
| 失败策略 | 定义 fail fast / fail closed / pending / stale / job failed 等行为 |
| 测试承接 | 05 增加正向、负向、来源优先级和失效场景 |
| 验收承接 | 06 增加通过条件、失败条件和必要的一票否决 |
| 实施承接 | 07 增加实现顺序、提交边界、回退点 |
| 运维承接 | 09 增加真实环境准备、权限、轮换或恢复步骤 |

### 7.4 候选配置演进表

| 候选控制面 | 当前状态 | 若要进入正式配置项 |
|---|---|---|
| `runtime_profile` | candidate | 先回写 03,定义 enum / field / builder 使用方式,再更新 04 |
| publisher mode / real bus binding | candidate | 先回写 03,定义 publisher config 或 adapter constructor |
| toolchain runner mode / command args / timeout | candidate | 先回写 03 或在实施计划中定义真实 runner contract |
| gate / blob adapter mode | candidate | 先回写 03,定义 adapter config 与 fail closed 行为 |
| log level / diagnostic mode | candidate | 判断是否只是实施 / 观测配置;若进入 runtime config 则回写 03 |
| secret provider / KMS / Vault config | candidate(P1/P2) | 先回写 03,再由 04 定义 secret ref,由 09 承接真实运维步骤 |
| config center / admin override | rejected for P0;candidate for P2 | 需要单独设计在线配置、审计、回滚、权限和 last-known-good |

### 7.5 废弃与移除规则表

| 阶段 | 必须动作 | 禁止事项 |
|---|---|---|
| 标记 deprecated | 写明替代项、原因、兼容窗口、迁移步骤和失败策略 | 只在正文中口头说“不推荐” |
| 兼容窗口 | 保留读取或迁移支持,输出脱敏 warning 或迁移提示 | 新示例继续推荐旧 key |
| 下游同步 | 更新 05/06/07/09 和示例配置 | 只改 04 不改测试验收实施运维 |
| 移除前检查 | 确认下游引用清零、测试覆盖旧 key 拒绝、03 如需已回写 | 尚有 CI / job / 文档示例引用时移除 |
| 移除 | 将旧 key 标为 removed,出现时 fail fast 或未知配置处理 | silent ignore 高风险旧 key |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前无旧配置迁移项,7 个 P0 配置项作为首版 active 配置 | 否 | 配置设计基线说明 | 无 | 无回写 |
| 不新增 `config_schema_version` 正式配置项 | 否 | 避免新增 runtime config 字段 | 无 | 无回写 |
| 配置演进规则要求代码契约变化先回写 03 | 否 | 文档门禁规则 | 无 | 无回写 |
| 若未来新增 runtime_profile、publisher mode、secret provider 等正式配置项 | 是 | runtime config / adapter / sensitive binding 变化 | `03-详细设计.md` §13 或相关对象 / adapter 契约章节 | 待回写 |

说明:

- 本步没有新增 `CoreRuntimeConfig` 字段、配置解析 API、迁移器、错误枚举或审计事件。
- 本步只定义配置契约未来如何演进,不改变当前可实现代码契约。

---

## 9. 回填草稿

以下内容用于后续 Step 15 组装正式 `04-配置设计.md` §13。

````md
## 13. 配置迁移、废弃与演进

> 校准来源：
> - `design-calibration/04_config_step_13_migration_deprecation_evolution.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“当前配置迁移与废弃表”“配置状态定义表”“新配置引入门禁表”“候选配置演进表”和“对详细设计的影响判定”小节，了解本章配置演进规则如何收敛。

本轮是 L0-core 首版正式配置设计,当前不存在已发布旧配置需要迁移。7 个 P0 配置项作为首版 `active` 配置项进入正式配置设计。

配置新增、重命名、废弃或移除时,必须先判断是否影响代码契约。如果会新增或改变 `CoreRuntimeConfig` 字段、runtime builder 参数、adapter constructor 参数、trait、error enum、DTO、job receipt 或事件字段,必须先回写 `03-详细设计.md`,再更新 04、05、06、07 和必要的 09。

已发布配置不得无说明删除。旧配置废弃必须经过 `deprecated` 状态,说明替代项、原因、兼容窗口、迁移步骤和移除条件。兼容窗口结束、下游引用清零、测试验收实施运维文档完成同步后,才允许进入 `removed` 状态。

`runtime_profile`、publisher mode、toolchain runner mode、gate / blob adapter mode、secret provider / KMS / Vault config、config center / admin override 仍不是本轮 active 配置项。若后续需要配置化,必须按新配置引入门禁处理。
````

---

## 10. 待确认事项

- 是否接受当前无旧配置迁移项。
- 是否接受首版 7 个 P0 配置项作为 active 配置基线。
- 是否接受不在 P0 新增 `config_schema_version` 配置项。
- 是否接受未来代码契约变化必须先回写 `03-详细设计.md`。
- 是否接受本步无需回写 `03-详细设计.md`。

---

## 11. 进入下一步条件

- [x] 用户确认当前配置迁移与废弃表。
- [x] 用户确认配置状态定义表。
- [x] 用户确认新配置引入门禁和候选配置演进表。
- [x] 用户确认本步无需回写 `03-详细设计.md`。
- [x] Step 13 状态从 `[~]` 更新为 `[x]`。
