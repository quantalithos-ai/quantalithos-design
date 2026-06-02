# Step 9. 定义配置加载、校验与生效机制

> 本文件是 `projects/L1-conversation/04-配置设计.md` 的 Step 9 中间产物。
> 本步定义配置如何加载、解析、校验、装配和生效。
> 本步不新增公开 Rust loader API,不新增 `RuntimeConfig` 字段,不改变 `03-详细设计.md` 的 runtime builder、adapter、trait、error 或函数流契约。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 9
- 回填章节: `projects/L1-conversation/04-配置设计.md` §9 配置加载、校验与生效机制

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_07_config_items.md` | P0 配置项清单、模块级 JSON demo 和完整 JSONC demo | 固定加载和校验对象 |
| `04_config_step_08_sensitive_secrets.md` | sensitive-ref、raw secret 明文禁止和输出防泄露规则 | 固定 secret boundary 校验 |
| `04_config_step_05_sources_priority_conflicts.md` | `code defaults < JSON config file < environment variables`,entry args 只作局部输入 | 固定来源合并顺序 |
| `04_config_step_06_profiles_matrix.md` | local-dev、ci-test、integration-like、operations-replay 为 P0 | 固定 profile 下加载时机和支持范围 |
| `03-详细设计.md` §13 | `ConfigLoader`、`ConfigValidator`、runtime builder 和模块读取边界 | 固定装配入口和不直接读取配置的模块 |

已确认结论:

```text
P0 配置在 api / worker / jobs / operations job 启动时加载。
P0 不支持 reload / hot update。
配置必须先完成 source merge、parse、type validate、sensitive boundary validate 和 cross-field validate,再进入 ConversationRuntimeBuilder。
domain、contracts 和 application 不直接读取 JSON、env、secret provider 或 entry args。
```

## 3. SOP 问题回答

### 3.1 配置在什么时机加载?

配置在以下时机加载:

| 入口 | 加载时机 | 说明 |
|---|---|---|
| api | api process 启动 | 构造 command / query intake 和 runtime handle |
| worker | worker process 启动 | 构造 inbound consumer、outbox relay 和 runtime handle |
| jobs | job action 启动 | 构造 job runner、run id、scope、reports output 和 runtime handle |
| operations-replay | replay job 启动 | 加载 replay input、report root 和 job-local 参数 |

### 3.2 配置如何 parse 和 type validate?

`ConfigLoader` 按普通来源优先级合并 defaults、JSON config file 和 env。指定 JSON 文件必须可读、可解析、无重复 key。解析后进入类型校验:

- enum 必须属于已定义值。
- bool 必须是 boolean。
- positive integer 必须大于 0,并满足范围约束。
- path 必须可规范化,按作用域检查可读 / 可写。
- ref 必须符合 `CredentialRef` / `SecretRef` / endpoint ref 格式。
- unknown key、重复 key、等价别名、非法 env 和 unsupported profile 均 fail-fast。

### 3.3 哪些配置需要 cross-field validate?

需要交叉校验的配置包括:

- configured publisher / resolver / handoff 必须有 credential ref。
- fake adapter 必须保留 fake marker,不能标记 production success。
- reports root 和 artifacts root 不得额外加入项目名层级。
- batch limit、retry policy、timeout 和 projection rebuild batch 必须相互兼容。
- retention cursor TTL 与 projection cursor 使用关系必须一致。
- `security.redaction_policy` 必须为 `strict`。
- operations job 必须有 run id。
- P0 profile 不得启用 config center、admin override、hot reload 或 raw secret。

### 3.4 哪些配置 startup / reload / hot / build-time / static?

| 类别 | 配置 | 生效口径 |
|---|---|---|
| startup | runtime、storage、api、worker、outbox、resolver、handoff、retention、projection、security | process 启动读取 |
| job-startup | jobs、reports、operations-replay scope | job run 开始读取 |
| entry-local | config path、runtime profile selector、job run id、dry-run / diagnostic flag | 只影响当前入口 |
| build-time | Cargo path dependency 和 crate feature | 不由配置文件替代 |
| static | forbidden boundary、truth ownership、state machine、idempotency、redaction lower bound | 不是普通配置 |
| unsupported in P0 | reload、hot update、remote config、admin override | 请求即拒绝 |

### 3.5 校验失败后如何处理?

parse、type validate、sensitive boundary validate、cross-field validate、unsupported profile 和 forbidden boundary validate 失败必须 fail-fast 或 fail-closed,不得静默回退低优先级配置。

运行期外部依赖不可用时,按 adapter / domain 语义进入 unresolved、retry pending、failed、stale 或 diagnostic marker,不得伪装成功,也不得回滚已提交 truth。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 7 配置项清单 | 已给字段和失败策略,但未统一加载 / 校验顺序 | 实现者可能在 adapter 内分散读取配置 |
| Step 8 敏感配置 | 已定义 ref 和禁止输出 | 需要进入加载校验链 |
| `03-详细设计.md` §13 | 已给 config / runtime builder 边界 | 需要由 `04` 补齐 parse、type validate、cross-field validate 和生效方式 |
| 当前旧 `05/06` | 未按新版 loader / validator 行为设计测试验收 | 后续必须重校准 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 加载时机 | 只知道配置进入 runtime builder | 明确 api / worker / jobs / replay 启动时加载 | 保持 domain / application 不读配置 |
| 校验层次 | 字段失败策略分散 | 拆成 source merge、parse、type、sensitive、cross-field、builder assemble | 便于实现和测试 |
| entry args | 容易被当作全局最高优先级 | 限定为 source selector 或 entry-local 参数 | 避免绕过安全和普通来源 |
| 热更新 | 未在本步集中说明 | P0 reload / hot update 一律 unsupported | 避免虚构在线配置系统 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 在 04 定义正式 Rust loader 函数签名 | 实施直接 | 会改变详细设计代码契约 | 不采用 |
| 方案 B: 在 04 定义加载行为、校验阶段和失败策略,函数名留给实施 | 保持文档边界,可指导测试 | 具体内部函数名由实现决定 | 采用 |
| 方案 C: 允许 reload / hot update | 运维灵活 | 需要审计、回滚、last-known-good 和并发机制 | 不采用 |
| 方案 D: 高优先级非法值回退低优先级 | 可用性高 | 掩盖错误配置,破坏验收可判定性 | 不采用 |

推荐方案 B。

原因:

- `03` 已确认 config loader / validator / runtime builder 主路径,`04` 只应定义行为和校验门禁。
- L1-conversation P0 是启动 / job 级配置,不是在线配置中心。
- fail-fast / fail-closed 能让测试、验收和实施形成一致门禁。

## 7. 结构化中间产物

### 7.1 配置加载流程图

#### 配置加载流程图: L1-conversation 配置加载与校验

```text
[code defaults]
  + [JSON config file]
  + [environment variables]
        |
        v
[merge ordinary sources by priority]
        |
        v
[parse external JSON keys]
        |
        v
[type validate]
        |
        v
[sensitive boundary validate]
        |
        v
[cross-field validate]
        |
        v
[assemble ConversationRuntimeConfig]
        |
        v
[ConfigValidator -> validated runtime config]
        |
        v
[ConversationRuntimeBuilder]
        |
        v
[ConversationRuntime for api / worker / jobs]

entry local args
  +-- may select config path / profile / run id
  +-- may pass operation-local parameters
  +-- must not override forbidden boundaries
```

关键说明:

- 本图表达 P0 启动 / job 启动配置链,不表达在线 reload 或 hot update。
- 高优先级配置非法时 fail-fast,不得回退低优先级配置。
- entry local args 不进入 ordinary source priority chain。
- secret material 不进入配置加载链;配置中只能出现 sensitive reference。

### 7.2 配置加载校验表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| ordinary source merge | api / worker / job 启动 | defaults、JSON、env 顺序;重复 key、未知 key、非法 env 检查 | startup / job-startup | fail-fast |
| entry local args | 入口启动 | 只允许 config path、profile selector、run id、scope、dry-run / diagnostic | entry-local | 非法 fail-fast |
| `runtime` | process 启动 | profile enum、config version | startup | unsupported fail-fast |
| `storage` | process 启动 | store kind、durable ref、root 隔离 | startup | fail-fast |
| `api` | api 启动 | enabled bool、metadata policy strict | startup | fail-fast |
| `worker` | worker 启动 | event source profile、outbox relay enabled、fake marker | startup | fail-fast |
| `outbox` | process 启动 | publisher kind、credential ref、timeout、retry profile | startup | invalid ref fail-closed;unsupported fail-fast |
| `resolver` | process / job 启动 | resolver kind、credential ref、source body exclusion | startup / job-startup | invalid ref fail-closed;source unavailable unresolved |
| `handoff` | process / job 启动 | handoff kind、credential ref、redaction required | startup / job-startup | invalid ref fail-closed;handoff failure retry / failed |
| `jobs` | job 启动 | batch、retry、timeout、run id | job-startup | fail-fast |
| `retention` | process 启动 | idempotency、trace、cursor retention range | startup | fail-fast |
| `projection` | process / job 启动 | read model、search、rebuild batch、read-only boundary | startup / job-startup | fail-fast;运行失败 stale / failed |
| `reports` | job / gate 启动 | artifacts root、output root、run id source、path writable | job-startup | fail-fast |
| `security` | process 启动 | redaction policy strict、raw secret / forbidden body rejection | startup / static guard | fail-fast |
| reload / hot update | 任意时刻 | P0 不支持 reload / hot | unsupported | reject-new-value,保留当前 runtime |
| static forbidden boundaries | 设计和启动校验 | truth ownership、visibility、state machine、idempotency、audit chain 不可配置 | static | fail-fast + 设计变更流程 |

### 7.3 cross-field validate 清单

| 校验项 | 规则 | 失败处理 |
|---|---|---|
| configured adapter credential | configured publisher / resolver / handoff 必须提供 credential ref | fail-fast |
| fake adapter marker | fake adapter 结果必须保留 fake marker,不能标记 production success | fail-fast |
| storage 与 profile | local-dev / ci-test 默认 in-memory;durable-like 需要 explicit configured ref | fail-fast |
| report / artifact 层级 | `reports.output_root` 不加项目名层级;artifact run 输出为 `artifacts/test/<run_id>` | fail-fast |
| job run identity | operations job 必须携带 run id 或由 job source 生成 run id | fail-fast |
| batch / rebuild 关系 | `projection.rebuild_batch_size` 不得超过 `jobs.batch_limits.max_batch_size` | fail-fast |
| retention / cursor 关系 | cursor cleanup 不得短于正在运行的 replay / report window | fail-fast |
| redaction lower bound | `security.redaction_policy` 必须为 `strict`;handoff `redaction_required` 必须为 true | fail-fast |
| secret boundary | 普通来源和 entry args 不得包含 raw secret / raw token | fail-fast |
| forbidden capability | config center、admin override、hot reload、auto repair truth 不得在 P0 启用 | unsupported / fail-fast |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 定义 P0 配置在 api / worker / jobs / replay 启动时加载 | 否 | 配置设计行为规则 | 无 | 无回写 |
| 不定义公开 Rust loader 函数签名 | 否 | 避免新增代码契约 | 无 | 无回写 |
| P0 reload / hot update 请求按 unsupported 拒绝 | 否 | 范围裁剪 | 无 | 无回写 |
| cross-field validate 只约束既有配置组和字段级 JSON key | 否 | 配置校验规则 | 无 | 无回写 |

说明:

```text
本步没有新增 `RuntimeConfig` 字段、adapter constructor 参数、trait 方法、错误枚举或函数流。
如果后续需要公开 loader API 或新增 reload / hot update 机制,必须回到 `03-详细设计.md` 重新校准。
```

## 9. 回填草稿

正式 `04-配置设计.md` §9 建议采用以下结构:

```text
9. 配置加载、校验与生效机制
  9.1 配置加载流程图
  9.2 配置加载校验表
  9.3 cross-field validate 清单
  9.4 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §9.1 | `design-calibration/04_config_step_09_load_validate_apply.md` §7.1 |
| §9.2 | `design-calibration/04_config_step_09_load_validate_apply.md` §7.2 |
| §9.3 | `design-calibration/04_config_step_09_load_validate_apply.md` §7.3 |
| §9.4 | `design-calibration/04_config_step_09_load_validate_apply.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 10 的待确认事项。

后续 Step 必须继续收口:

- Step 10 定义配置变更、评审、审计和回滚。
- Step 11 定义配置缺失、错误、依赖不可达和 forbidden boundary 命中的失败模式。
- `05/06` 后续需要按本步 loader / validator 行为设计配置测试和验收门禁。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置加载流程图已形成 | 通过 | §7.1 |
| 配置加载校验表已形成 | 通过 | §7.2 |
| cross-field validate 清单已形成 | 通过 | §7.3 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 10 | 通过 | 下一步定义配置变更、审计与回滚 |
