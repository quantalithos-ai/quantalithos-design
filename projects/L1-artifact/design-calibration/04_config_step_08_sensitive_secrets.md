# Step 8. 定义敏感配置与密钥管理

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 8
> 回填章节: `04-配置设计.md` §8 敏感配置与密钥管理

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 定义敏感配置与密钥管理 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 来源优先级;Step 6 profile 矩阵;Step 7 配置项清单;详细设计 Step 14/15/16 |
| 输出文件 | `projects/L1-artifact/design-calibration/04_config_step_08_sensitive_secrets.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 9 |

## 2. 本步目标

本 Step 单独收稳 `L1-artifact` 配置里的敏感配置、真实 secret 禁入边界、opaque ref 读取口径、轮换与审计边界。

本 Step 只回答:

- Step 7 的哪些配置项属于 `internal`、`sensitive` 或未来 `secret`。
- 哪些真实秘密材料绝不能进入本地 JSON、env、entry-local 参数、job request、report、log、audit、trace、outbox 或 artifact。
- P0 为什么只能保存 opaque ref,不能保存 raw credential、raw endpoint、raw topic、raw body。
- `local-dev`、`ci-test`、`integration-like`、`operations-replay` 四个 P0 profile 下,敏感配置分别怎样存储、读取、生效和失败。
- Step 9 加载校验、Step 10 变更审计、Step 11 fail-fast / degraded 如何承接本 Step。

本 Step 不定义:

- 具体 Vault / KMS / cloud secret manager 产品。
- 具体 endpoint URL、DSN、token、password、private key、certificate body、transport credential、archive package body、observability body、sync private body、external payload body。
- 部署挂载、权限申请、值班流程、生产轮换 runbook。
- hot reload。P0 敏感配置变更仍通过 restart 或 new job run 生效。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已完成 | 提供 `defaults < file < env` 覆盖链和 ordinary source 不承载 raw secret 的规则 |
| `04_config_step_06_environment_profiles_matrix.md` | 已完成 | 提供四个 P0 profile 和 profile / adapter mode 分离规则 |
| `04_config_step_07_config_items.md` | 已完成 | 提供字段级配置项、敏感级别标签和失败策略 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 store / resolver / publisher / handoff / replay 的 config binding 和 body-free 红线 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供 log / metric / audit / trace 的 redaction 和 forbidden field 边界 |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 提供 redaction / forbidden body / config validation 的测试承接要求 |
| `02_hld_step_11_configuration_impact.md` | 已完成 | 提供配置不可改变 truth ownership、consumer / query / job 边界的概要前提 |
| `projects/L1-governance/design-calibration/04_config_step_08_sensitive_secrets.md` | 已参考 | 提供 Step 8 粒度框架,本文件按 Artifact 语义重写 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置是 sensitive 或 secret? | `stores.*.configRef`、`sourceResolvers.adapterRef`、`relay.publisherAdapterRef`、`relay.transportTopicBindings`、`handoff.*Targets`、`testFixtures.replayArtifactRootRef` 属于 `sensitive`;`redaction.denyFieldRefs`、`redaction.allowHighCardinalityLabels` 属于 `internal` 且安全关键。真实 password、token、private key、cert body、DSN、raw endpoint、raw topic credential、raw payload body 属于 `secret`,但当前 P0 配置项中不允许出现。 |
| 普通配置是否允许明文 secret? | 不允许。本地 JSON、env、CLI selector、job request、report、trace、audit、diagnostic、log、metric label 都只能保存 opaque ref、safe digest 或 low-cardinality kind,不得保存 raw secret 或 raw body。 |
| 敏感配置如何轮换? | P0 不支持热更新。startup 敏感 ref 通过新配置 + restart 生效;job-run-start 敏感 ref 通过 new job run 生效;`operations-replay` 的 replay root ref 按每次 run 独立提供。 |
| 读取和变更是否需要审计? | 需要。读取面只记录 config section、adapter slot、profile、validation issue ref、redacted digest;变更面必须记录 actor、scope、old/new redacted digest、reason、validation result 和生效方式。 |
| 哪些输出面必须禁止泄露? | log、error、audit、trace、metric、job report、handoff marker、relay payload snapshot、generated artifacts 都不得输出 raw secret、raw endpoint、raw topic credential、raw request / event / response body、archive package body、observability body 或 sync private body。 |
| 是否需要立即引入 secret provider? | 不需要。当前 `03` 没有定义 secret provider port / runtime contract。P0 先收稳 opaque ref 边界;未来若要引入 provider、reload 或 admin override,必须回写 `03`。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项总表 | 已有 `ref-sensitive`、`security-critical` 等工程标签,但未归一成正式敏感级别 | 本 Step 统一映射到 `public` / `internal` / `sensitive` / `secret` |
| Step 5 来源规则 | 已规定 raw secret 不进 ordinary source,但未分配置族说明 | 本 Step 按 store / resolver / relay / handoff / replay / redaction 拆分 |
| Step 6 profile 矩阵 | 已定义四个 P0 profile,但未说明各 profile 的敏感项处理差异 | 本 Step 增补 profile 级敏感配置矩阵 |
| Step 14 binding | 已说明 target / route / store ref 是 body-free binding,但未定义轮换和审计口径 | 本 Step 补充读取 / 轮换 / 审计承接表 |
| Step 15 observability | 已给 redaction 红线,但未回指到具体配置项 | 本 Step 把禁止输出规则逐项映射到 Step 7 配置项 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 敏感级别 | Step 7 只有工程标签 | 统一为正式敏感级别和处理要求 | 便于 Step 9~11 和正式 `04` 复用 |
| secret 禁入边界 | 只写了“只允许 ref” | 明确 ordinary config、env、entry-local、job request、report、log、audit、trace 全部禁入 raw secret / raw body | 防止实现侧误把 secret 当字符串配置 |
| profile 差异 | 只在 Step 6 提到 fake / replay 倾向 | 为四个 P0 profile 明确允许表示、禁止项和失败策略 | 支撑 loader、validator、test 和验收 |
| 轮换与审计 | 尚未单独定义 | 固定为 restart / new run 生效,并把 redacted digest 审计接到 Step 10 | P0 无 hot reload |
| redaction config | 只在 Step 7 作为字段出现 | 明确其为 `internal` 且安全关键,变更需要强审计 | 防止放空 deny list 或放宽高基数标签 |

## 7. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| P0 是否引入具体 secret provider | A. 直接定产品;B. 只收稳 opaque ref 和禁止明文边界 | 采用 B。当前 `03` 未定义 provider contract |
| env 是否允许直接放 token / password | A. 允许;B. 只能放 opaque ref | 采用 B。与 Step 5 ordinary source 规则一致 |
| route / target ref 是否算敏感 | A. 视作普通配置;B. 统一按 `sensitive` 处理 | 采用 B。真实 route / target 暴露外部拓扑与审计目标 |
| replay artifact root 是否普通路径 | A. 普通路径;B. 视作敏感 ref | 采用 B。它关联历史证据包与去标识化边界 |
| redaction deny list 是否算 secret | A. 当成 secret;B. 当成 `internal` 安全关键项 | 采用 B。它不是秘密材料,但放宽会直接破坏观测红线 |
| 敏感配置变更是否热生效 | A. hot reload;B. restart 或 new run | 采用 B。当前 P0 没有 reload contract |

## 8. 结构化中间产物

### 8.1 敏感级别归一规则

| 级别 | 含义 | Step 7 标签映射 | 处理要求 |
|---|---|---|---|
| `public` | 可公开、无安全语义的开关和通用标识 | `non-sensitive` 中的普通标量 | 可出现在文档示例和普通诊断 |
| `internal` | 内部运行调节项和安全关键但非秘密的字段 | `non-sensitive`、`security-critical` | 可存配置,但变更可能需要审计 |
| `sensitive` | 暴露会泄露拓扑、目标、历史证据位置或 credential 入口的 opaque ref | `ref-sensitive`、route / target / replay refs | 只能保存 opaque ref,不得输出 full value |
| `secret` | 真实秘密材料或原始敏感正文 | Step 7 中禁止出现 | 不得进入配置、日志、报告、审计或 trace |

### 8.2 敏感配置读取链图

#### 敏感配置读取图: opaque refs 到 runtime assembly

```text
[defaults / file / env / entry-local selectors]
  -> [opaque refs only]
  -> [infra::config parse / validate]
  -> [redacted config identity + validation issue refs]
  -> [runtime builder / adapter registry]
  -> [application ports]

[future secret provider]
  -> [adapter-internal credential resolution only]
  -> [never exposed to contracts / domain / application]
```

关键说明:

- ordinary source 只允许提供 opaque ref,不允许提供 raw secret 或 raw body。
- `infra::config` 只能产出 validated ref、safe digest 和 validation issue ref。
- `application`、`domain`、`contracts` 不直接读取 secret provider 或 raw credential。
- 若未来引入 provider,也只能在 infra adapter 内部解析,不得落到 truth、report、trace 或 outbox。

### 8.3 敏感配置表

| 配置项 | 级别 | 存储方式 | 明文规则 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| `stores.truth.configRef` | `sensitive` | 只保存 `store:*` opaque ref | 不得保存 DSN / credential / URL body | 新 ref + restart | 记录 slot、profile、redacted digest |
| `stores.projection.configRef` | `sensitive` | 只保存 store ref | 不得保存 DSN / credential | 新 ref + restart | 记录 slot 和 redacted digest |
| `stores.reference.configRef` | `sensitive` | 只保存 store ref | 不得保存 external endpoint / credential | 新 ref + restart | 记录 slot 和 redacted digest |
| `stores.relay.configRef` | `sensitive` | 只保存 store ref | 不得保存 queue / bus credential | 新 ref + restart | 记录 slot 和 redacted digest |
| `stores.idempotency.configRef` | `sensitive` | 只保存 store ref | 不得保存 DSN / credential | 新 ref + restart | 记录 slot、retention compatibility |
| `sourceResolvers.adapterRef` | `sensitive` | 只保存 resolver adapter ref | 不得保存 raw endpoint / token / external body | 新 adapter ref + restart | 记录 adapter slot、availability、redacted digest |
| `relay.publisherAdapterRef` | `sensitive` | 只保存 publisher adapter ref | 不得保存 bus credential / publish response body | 新 adapter ref + restart | 记录 adapter slot、validation result |
| `relay.transportTopicBindings` | `sensitive` | topic-neutral key -> route ref map | 不得保存 raw topic secret / credential | 新 route refs + restart | 记录 changed keys、redacted route digest |
| `handoff.archiveTargets` | `sensitive` | target ref list | 不得保存 archive credential / package body | 新 target refs + restart 或 new run | 记录 target digest、job run id |
| `handoff.observabilityTargets` | `sensitive` | target ref list | 不得保存 observability credential / span body | 新 target refs + restart 或 new run | 记录 target digest、job run id |
| `handoff.syncTargets` | `sensitive` | target ref list | 不得保存 sync credential / private copy body | 新 target refs + restart 或 new run | 记录 target digest、job run id |
| `testFixtures.replayArtifactRootRef` | `sensitive` | replay root opaque ref | 不得保存 raw historical body 或未脱敏路径 | 每次 run 单独提供 | 记录 run id、artifact root digest |
| `redaction.denyFieldRefs` | `internal` | forbidden field ref list | 可保存 field ref,不得保存匹配到的 raw value | 新配置 + restart | 记录 added/removed refs、actor、reason |
| `redaction.safeDiagnosticRefPrefix` | `internal` | prefix string | 可明文保存 prefix,不得承载 secret/body | 新配置 + restart | 记录 prefix digest 和 collision 校验 |
| `redaction.allowHighCardinalityLabels` | `internal` 安全关键 | bool | P0 只能为 `false` | 不允许在 P0 放宽 | 放宽尝试必须被 reject 并留 issue ref |
| future raw secret material | `secret` | 不进入普通配置 | 不可明文 | provider-side only | 只记录 provider ref digest,不记录 material |

### 8.4 P0 profile 敏感配置处理矩阵

| Profile | 允许表示 | 禁止项 | 失败策略 |
|---|---|---|---|
| `local-dev` | fake store / resolver / publisher / target refs | raw secret、real credential、raw body | 缺必填 ref fail-fast |
| `ci-test` | deterministic fixture refs、fake target refs、固定 clock/id refs | raw credential、production endpoint、raw fixture body | fixture 缺失 test fail-fast |
| `integration-like` | controlled durable store refs、controlled adapter refs、controlled route/target refs | raw credential、external body、fake fallback 覆盖 controlled mode | unavailable -> fail-fast、reject 或 degraded,按角色区分 |
| `operations-replay` | de-identified replay root ref、fake 或 controlled target refs | raw historical body、raw secret、raw external payload | replay root 缺失 reject 当前 run |

补充:

- `staging-like` / `production-like` 不是当前 Step 6 的 P0 profile,本 Step 不把它们写成当前可落地能力。
- 若未来要新增这些 profile,必须在 Step 13 / Step 14 和 `03` 回写中重新定义 provider、rotation 和 audit contract。

### 8.5 禁止输出与持久化边界表

| 输出面 | 允许输出 | 禁止输出 |
|---|---|---|
| structured log | operation、profile、adapter slot、safe diagnostic ref、validation issue ref | full sensitive ref、secret、raw endpoint、raw topic、raw request / event / response body |
| error / rejection | stable error code、safe message、issue ref | token、password、credential、route ref 全值、target ref 全值 |
| audit record | actor、scope、old/new redacted digest、reason、validation result | raw config、raw secret、full sensitive ref、external body |
| trace / span | trace context ref、operation、adapter slot、safe diagnostic ref | secret、credential、archive body、observability body、sync private body |
| metric labels | low-cardinality kind / state / result | request id、actor id、subject id、target ref、route ref、secret |
| job report / handoff marker | marker refs、failure refs、safe counts、redacted target digest | archive package body、observability body、sync payload body、credential |
| relay payload snapshot | body-free payload refs / states | raw config、raw secret、external response body |
| generated artifacts | safe indexes、redacted evidence、report refs | secret dump、provider response、raw replay body |

### 8.6 读取 / 轮换 / 审计承接表

| 敏感配置族 | Step 7 回指 | Step 9 承接 | Step 10 承接 | Step 11 承接 |
|---|---|---|---|---|
| durable store refs | `stores.*.configRef` | ref shape / slot completeness 校验 | startup 高风险变更审计 | required slot 缺失 fail-fast |
| resolver adapter refs | `sourceResolvers.adapterRef` | adapter kind / mode / profile compatibility 校验 | adapter binding 变更审计 | unavailable -> degraded / reject / fail-fast |
| publisher + route refs | `relay.publisherAdapterRef`, `relay.transportTopicBindings` | enabled event key completeness 校验 | topic binding 变更审计 | 缺 binding fail-fast |
| handoff target refs | `handoff.*Targets` | target enabled / target kind 校验 | target set 变更审计 | target missing -> reject job / failed marker |
| replay root refs | `testFixtures.replayArtifactRootRef` | 去标识化和 path class 校验 | run-level evidence 审计 | 缺失或不脱敏 -> reject run |
| redaction safety config | `redaction.*` | deny list / label policy 校验 | 安全关键配置变更审计 | 放宽策略 -> fail-fast / reject |

### 8.7 错误模式与处理表

| 场景 | 正式处理 | 不允许的处理 |
|---|---|---|
| ordinary config 含 raw secret material | validation reject | 当普通字符串继续运行 |
| env 覆盖为 malformed sensitive ref | fail-fast | 静默回退低优先级值 |
| replay root 指向 raw historical body | reject 当前 run | 直接读取原始历史正文 |
| enabled route binding 缺失 | startup fail-fast | publish 时临时拼 topic |
| job request 夹带 raw target credential | reject 当前 job | 写入 report 给 adapter 读取 |
| redaction deny list 为空 | startup fail-fast | 允许所有字段输出 |
| P0 尝试把 `allowHighCardinalityLabels=true` | validation reject | 允许上线后再看 |
| adapter 返回 raw error body | 映射为 redacted issue ref | 持久化 adapter error body |

### 8.8 敏感配置停审记录

| 配置族 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `stores.*.configRef` | 是否只保存 opaque ref | 通过 | durable 产品细节留后续 |
| `sourceResolvers.adapterRef` | 是否排除 raw endpoint / token / external body | 通过 | controlled integration 仍只暴露 adapter ref |
| `relay.publisherAdapterRef` + `transportTopicBindings` | 是否排除 raw topic / bus credential | 通过 | topic-neutral key 不变 |
| `handoff.*Targets` | 是否排除 target credential 和下游 body | 通过 | failure 只暴露 marker / reason refs |
| `testFixtures.replayArtifactRootRef` | 是否要求去标识化 | 通过 | 具体脱敏证明格式留 Step 12 |
| `redaction.*` | 是否保持安全默认值 | 通过 | Step 10 继续定义审批和审计深度 |

### 8.9 跨敏感配置泄露风险审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 文档示例是否含实际 secret | 未发现 | 仅使用 opaque ref 示例 |
| 普通配置是否可能承载 raw secret | 不允许 | validator 必须拒绝 |
| env / CLI 是否可能直接注入 credential | 不允许 | 只能传 ref 或 selector |
| route / target / replay root 是否被误归类为 public | 已修正 | 统一归到 `sensitive` |
| log / metric / audit / trace 是否可能泄露 sensitive 值 | 已收口 | 只允许 redacted digest / issue ref |
| redaction 配置是否可能被放空或放宽 | 不允许 | empty / unsafe 直接 fail-fast |
| 是否需要立即回写 `03` | 当前不需要 | provider / reload / admin override 进入未来回写项 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 7 敏感标签归一为 `public` / `internal` / `sensitive` / `secret` | 否 | 配置文档术语收敛 | 不适用 | 无回写 |
| ordinary source 只能保存 opaque sensitive refs,不能保存 raw secret / raw body | 否 | 承接 Step 5 与 Step 14 body-free 边界 | 不适用 | 无回写 |
| P0 敏感配置通过 restart / new run 生效 | 否 | 承接当前无 hot reload 合同 | 不适用 | 无回写 |
| 若未来引入 secret provider、hot reload、admin override 或 provider-backed audit schema | 是 | runtime config / builder / adapter constructor / audit contract 变更 | `03` Step 14 / Step 15 / 相关 flow | 阻塞待确认 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/04_config_step_08_sensitive_secrets.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“敏感级别归一规则”“敏感配置读取链图”“敏感配置表”“P0 profile 敏感配置处理矩阵”“禁止输出与持久化边界表”“读取 / 轮换 / 审计承接表”和“跨敏感配置泄露风险审计表”小节。

正式 `04-配置设计.md` §8 应回填:

- 敏感级别归一规则。
- 敏感配置读取链图。
- 敏感配置表。
- P0 profile 敏感配置处理矩阵。
- 禁止输出与持久化边界表。
- 读取 / 轮换 / 审计承接表。
- 错误模式与处理表。
- 敏感配置停审记录。
- 跨敏感配置泄露风险审计表。
- 对详细设计的影响判定。

回填要求:

- 正式正文不得出现实际 secret material。
- 不得把 route / target / replay root 写成普通公开字符串。
- 不得把 future secret provider 写成当前 P0 已实现能力。
- 正式文档仍需等 Step 15 装配,本 Step 只生成中间产物。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| future secret provider 是否进入 P1/P2 | 影响 `03` builder / adapter / audit contract | 记录到 Step 13 / Step 14 |
| route / target digest 的具体 redaction 算法 | 影响 Step 10 审计字段格式 | 当前只要求 redacted digest,不锁算法 |
| replay root 去标识化证明格式 | 影响 Step 12 测试 / 验收 evidence | 当前先要求 opaque ref + reject raw body |
| redaction 配置变更审批层级 | 影响 Step 10 变更审计 | 后续在 Step 10 收口 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 敏感配置项已识别 | 通过 | 见 §8.3 |
| secret / sensitive / internal 级别已归一 | 通过 | 见 §8.1 |
| ordinary source 明文禁止已明确 | 通过 | raw secret / raw body forbidden |
| profile 级处理差异已明确 | 通过 | 见 §8.4 |
| 读取 / 轮换 / 审计承接已明确 | 通过 | 见 §8.6 |
| 禁止输出边界已明确 | 通过 | 见 §8.5 |
| 跨敏感配置泄露审计完成 | 通过 | 见 §8.9 |
| 对 `03` 的影响判定已记录 | 通过 | 当前无回写 |
| 可进入 Step 9 | 通过 | 下一步定义配置加载、校验与生效机制 |
