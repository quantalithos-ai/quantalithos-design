# L0-bus 04 配置设计 Step 9: 配置加载、校验与生效机制

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 Step 9 中间产物。
> 本步定义配置如何加载、解析、类型校验、交叉字段校验、装配和生效。
> 本步不创建正式 `04-配置设计.md`,不改变 `ConfigLoader`、`ConfigValidator`、`RuntimeBuilder` 的详细设计签名。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 9 |
| 主题 | 定义配置加载、校验与生效机制 |
| 状态 | 已确认 |
| 正式回填位置 | `04-配置设计.md` §9 |
| 是否修改正式 `04-配置设计.md` | 否 |
| 是否必须判定对 `03-详细设计.md` 的影响 | 是 |

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `04_config_step_03_control_plane_overview.md` | 主路径为 `ConfigLoader -> ConfigValidator -> RuntimeBuilder -> RuntimeGraph` | 固定加载和装配主流程 |
| `04_config_step_05_sources_priority_conflicts.md` | 普通来源优先级为 defaults、JSON、env;CLI 只作为局部入口参数 | 固定 source merge 和冲突处理 |
| `04_config_step_07_config_items.md` | 已定义配置项清单、模块 JSON demo 和失败策略 | 确定 type validate / range validate / cross-field validate |
| `04_config_step_08_sensitive_secrets.md` | 敏感配置只保存引用,P0 不热更新 | 确定 secret / connection 校验和生效边界 |
| `03_ddd_step_14_config_dependencies.md` | 已定义 `ConfigLoader::load`、`ConfigValidator::validate`、`RuntimeBuilder::build` | 避免改变详细设计函数签名 |

---

## 3. SOP 问题回答

### 3.1 配置在什么时机加载?

P0 配置加载时机分为三类:

| 场景 | 加载时机 | 说明 |
|---|---|---|
| API 入口 | 进程启动时 | 加载 defaults、JSON、env,校验后构造 API runtime graph |
| Worker 入口 | 进程启动时 | 加载同一配置链,校验后构造 worker runtime graph |
| Operations job | job 进程或 job invocation 启动时 | 加载 defaults、JSON、env,再叠加 job local args 的局部输入 |

P0 不支持运行中 reload 或 hot update。配置变化需要重启对应入口或重新发起 job。

### 3.2 配置如何 parse 和 type validate?

parse 与 type validate 分离:

```text
JSON file / defaults / env values
  -> ConfigLoader parses into raw typed config
  -> ConfigLoader merges ordinary sources
  -> RuntimeConfig
  -> ConfigValidator performs type/range/cross-field checks
  -> ValidatedRuntimeConfig
```

规则:

- JSON 文件必须是严格 JSON,不支持注释。
- env override 只覆盖允许的普通配置项,并在进入 `RuntimeConfig` 前完成字符串到目标类型的 parse。
- enum 必须匹配受支持值。
- integer 必须通过范围校验。
- ref 字段只校验引用形态,不解析真实 material。
- 指定配置文件不可读或 JSON 解析失败时,直接 fail-fast。

### 3.3 哪些配置需要 cross-field validate?

至少需要以下交叉字段校验:

| 规则 | 校验逻辑 | 失败策略 |
|---|---|---|
| `store.kind=in_memory` 时 `store.connection_ref` 必须为空 | 避免 in-memory profile 误带外部连接引用 | fail-fast |
| `store.kind=external` 时 `store.connection_ref` 必须存在且为 ref | 外部 store 不能无连接引用启动 | fail-fast |
| `transport_backend.kind=in_memory` 时 `transport_backend.secret_ref` 必须为空 | 避免本地 profile 误带 secret 引用 | fail-fast |
| `transport_backend.kind=external` 时 `secret_ref` 与 `capability_profile_ref` 必须存在 | 外部 backend 需要凭证和能力 profile | fail-fast |
| `publisher.kind=in_memory_sink` 时 `publisher.secret_ref` 必须为空 | 避免本地 sink 误带 secret 引用 | fail-fast |
| `publisher.kind=external` 时 `publisher.secret_ref` 必须存在 | 外部 publisher 需要凭证引用 | fail-fast |
| `worker.enabled=true` 时 `outbox_source.batch_size` 和 `worker.batch_size` 均必须有效 | worker 必须有可执行的 source 读取参数 | fail-fast |
| `projection.rebuild_mode` 不得为 query 自动 rebuild | query 不允许隐藏写副作用 | fail-closed |
| `security_boundary.*` 必须保持固定安全 policy | 防止通过配置放宽安全红线 | fail-closed |
| `clock.kind=fixed` 或 `id_generator.kind=deterministic` 只能用于 local / test / controlled job | 防止生产类 profile 使用测试 fixture | fail-fast |

### 3.4 哪些配置 startup / reload / hot / build-time / static?

| 生效类型 | 本项目 P0 口径 | 配置组 |
|---|---|---|
| startup | 进程启动时加载、校验、装配 | `api`、`worker`、`store`、`outbox_source`、`transport_backend`、`publisher`、`projection`、`recovery_policy`、`security_boundary`、`clock`、`id_generator` |
| job startup | job invocation 启动时加载、校验、装配 | `jobs` 及 job local args |
| reload | P0 不支持 | 无 |
| hot update | P0 不支持;如收到 reload 请求应拒绝新值,保留旧 runtime graph | 无 |
| build-time | 仅编译 feature 或 crate layout,不作为运行配置 | 不进入 `04` 配置项清单 |
| static | 领域不变量和禁止配置化边界 | payload body 禁止、projection truth write 禁止、redaction required 等 |

### 3.5 校验失败后如何处理?

校验失败统一不构造 `RuntimeGraph`:

- parse/type/range 失败: fail-fast,入口启动失败。
- cross-field 失败: fail-fast 或 fail-closed,入口启动失败。
- 固定安全 policy 被放宽: fail-closed,入口启动失败。
- job local args 非法: 该 job invocation 失败,不影响已运行的其他入口。
- P0 收到 reload/hot update 请求: 拒绝请求,保留旧 runtime graph;记录审计或诊断事件。
- 不允许高优先级非法值回退到低优先级旧值。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| Step 7 已有配置项,但加载和校验阶段未拆开 | 容易把 JSON parse、类型校验、cross-field 校验混在一起 | 实现缺少清晰测试切口 | 本步定义加载流程和校验分层 |
| 热更新口径需要明确拒绝 | Step 4 / Step 8 已说 P0 冷更新,但 Step 9 需说明收到 reload 时怎么处理 | 实施者可能补一个半成品 reload | 本步明确 P0 reload/hot update 均拒绝新值并保留旧图 |
| job local args 与全局配置关系需要落地 | Step 5 已说 CLI 不作全局最高优先级 | job 实现可能绕开 validator | 本步明确 job local args 只进入 job invocation 局部校验 |
| cross-field validate 缺少集中清单 | 散落在 Step 7 表格 | 测试方案难以覆盖 | 本步汇总必须校验的组合规则 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 加载路径 | 只有控制面总图 | 有 source、parse、merge、validate、build、expose 的具体顺序 | 实施者可以按阶段写测试 |
| 校验层次 | 配置项表内说明 | 分为 parse、type、range、cross-field、forbidden boundary | 失败原因更稳定 |
| 生效机制 | 只知道冷更新 | 明确 startup / job startup / reload / hot / static 的处理 | 防止 P0 范围膨胀 |
| 失败策略 | 分散在 Step 5 / 7 / 8 | 汇总为不构造 runtime graph、不回退旧低优先级值 | 行为可验收 |

---

## 6. 配置设计取舍

### 6.1 是否支持 P0 reload

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. P0 不支持 reload | 简单,与 runtime graph 构造一致 | 配置变更需要重启 | 采用 |
| B. P0 支持全量 reload | 用户体验好 | 需要 adapter 切换、事务、审计、回滚和并发保护 | 不采用 |
| C. P0 只支持部分参数 reload | 折中 | 规则复杂,容易形成局部不一致 | 不采用 |

结论: P0 不支持 reload。收到 reload/hot update 请求时拒绝新值,保留旧 runtime graph。

### 6.2 env 非法值是否回退文件值

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 非法高优先级值 fail-fast | 行为显式,便于排错 | 对配置错误更敏感 | 采用 |
| B. 回退低优先级值 | 可用性看似更好 | 容易掩盖错误,导致实际运行配置不可预测 | 不采用 |
| C. 仅 local 回退 | 本地方便 | 环境差异扩大 | 不采用 |

结论: 高优先级非法值不回退,一律 fail-fast。

### 6.3 validator 是否解析真实 secret material

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. validator 只校验 ref 形态和 policy | 最小持有,职责清晰 | provider 可用性需在 adapter 构造阶段校验 | 采用 |
| B. validator 解析 material | 可提前发现 provider 错误 | 扩大敏感信息流经范围 | 不采用 |
| C. loader 解析 material | 实现直观 | 破坏 Step 8 边界 | 不采用 |

结论: validator 不解析真实 material。provider 可用性和 adapter 构造失败由 `RuntimeBuilder` / adapter constructor 报告。

---

## 7. 结构化中间产物

### 7.1 配置加载流程图: L0-bus 配置加载与校验

```text
code defaults
  -> JSON config file
  -> environment overrides
  -> job local args, job entry only
  -> ConfigLoader.parse_and_merge
  -> RuntimeConfig
  -> ConfigValidator.type_validate
  -> ConfigValidator.range_validate
  -> ConfigValidator.cross_field_validate
  -> ConfigValidator.forbidden_boundary_validate
  -> ValidatedRuntimeConfig
  -> RuntimeBuilder.build_policy_set
  -> RuntimeBuilder.build
  -> RuntimeGraph
  -> api / worker / jobs entries
```

图后说明:

- `job local args` 只影响 job invocation,不覆盖全局 runtime 配置。
- `ConfigLoader` 输出 `RuntimeConfig`,不把未校验配置传给 entry。
- `ConfigValidator` 输出 `ValidatedRuntimeConfig`,失败时不构造 `RuntimeGraph`。
- `RuntimeBuilder` 只接收已校验配置,并构造 adapter、port、policy、service、handler 和 job runner。

### 7.2 配置加载校验表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| `RuntimeConfig` root | entry / job 启动 | 必须包含所有 root 子配置组,缺失则由 defaults 补齐或报错 | 生成 `ValidatedRuntimeConfig` | 不完整且无默认值 fail-fast |
| `store` | entry 启动 | enum、ref shape、`kind` 与 `connection_ref` 交叉校验 | `RuntimeBuilder` 构造 repository / UnitOfWork | 非法 fail-fast |
| `outbox_source` | worker / job 启动 | enum、cursor ref、batch range | 构造 source adapter | 非法 fail-fast |
| `transport_backend` | entry / worker / job 启动 | enum、capability ref、secret ref、timeout ref、kind/ref 交叉校验 | 构造 backend adapter | 非法 fail-fast;安全违规 fail-closed |
| `publisher` | entry / worker / job 启动 | enum、secret ref、timeout ref、kind/ref 交叉校验 | 构造 publisher adapter | 非法 fail-fast;安全违规 fail-closed |
| `api` | API 入口启动 | enabled、bind profile、timeout range | 启动 API handlers | 非法 fail-fast |
| `worker` | worker 入口启动 | enabled、poll interval、batch range、timeout ref | 启动 worker loop | 非法 fail-fast |
| `jobs` | job invocation 启动 | batch range、cursor ref、retry ref、job local args 局部校验 | 启动 job runner | 非法则该 job 失败 |
| `projection` | entry / job 启动 | enum、rebuild mode、consistency marker | 构造 projection repository / query dependency | 自动 rebuild 或 truth write 相关值 fail-closed |
| `recovery_policy` | entry / job 启动 | retry ref、DLQ policy、replay audit chain policy | 构造 recovery policy set | 绕过 audit / DLQ fail-closed |
| `security_boundary` | entry / job 启动 | 固定 policy 校验 | 构造 payload guard、redaction guard、privileged operation guard | 任一 policy 被放宽 fail-closed |
| `clock` | entry / job 启动 | enum、profile 兼容性 | 构造 clock adapter | prod-like 使用 fixed fail-fast |
| `id_generator` | entry / job 启动 | enum、profile 兼容性 | 构造 id generator adapter | prod-like 使用 deterministic fail-fast |

### 7.3 校验阶段拆分表

| 阶段 | 输入 | 输出 | 主要错误 |
|---|---|---|---|
| source selection | config path、defaults、env、job local args | source list | config file not found, unsupported source |
| parse | JSON bytes、env strings | raw key/value values | invalid JSON, invalid env value syntax |
| merge | parsed sources | merged raw config | duplicate alias, unsupported override |
| type validate | merged raw config | typed `RuntimeConfig` | wrong type, unsupported enum |
| range validate | typed `RuntimeConfig` | range-checked config | timeout <= 0, batch out of range |
| ref validate | typed `RuntimeConfig` | ref-shape-checked config | invalid secret / connection ref shape |
| cross-field validate | typed config with refs | coherent config | kind/ref mismatch, profile incompatible |
| forbidden boundary validate | coherent config | `ValidatedRuntimeConfig` | fixed policy changed, forbidden behavior enabled |
| runtime build | `ValidatedRuntimeConfig` | `RuntimeGraph` | adapter constructor failure, provider unavailable |

### 7.4 reload / hot update 拒绝规则

| 请求类型 | P0 行为 | 旧配置 | 新配置 | 审计 / 诊断 |
|---|---|---|---|---|
| runtime reload | 拒绝 | 保留旧 `RuntimeGraph` | 不应用 | 记录 unsupported reload |
| hot update single key | 拒绝 | 保留旧 `RuntimeGraph` | 不应用 | 记录 unsupported hot update |
| job local args change | 仅影响本次 job invocation | 不改变全局配置 | 本次 job 校验后使用 | 记录 job config summary |
| file update on disk | 不自动感知 | 运行中不变 | 下次重启读取 | 不需要实时审计 |

---

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 主路径仍为 `ConfigLoader -> ConfigValidator -> RuntimeBuilder -> RuntimeGraph` | 否 | 沿用 `03` §13 / Step 14 | 无 | 无回写 |
| `ConfigLoader::load(ConfigSource)`、`ConfigValidator::validate(RuntimeConfig)`、`RuntimeBuilder::build(ValidatedRuntimeConfig)` 签名不变 | 否 | 无函数签名变化 | 无 | 无回写 |
| P0 不支持 reload / hot update,拒绝新值并保留旧 graph | 否 | 配置生效策略细化 | 无 | 无回写 |
| job local args 只作用于 job invocation | 否 | 来源优先级细化 | 无 | 无回写 |
| 如后续要求 P0 支持 reload 或局部 hot update | 是 | runtime graph reload / adapter swap / rollback 机制 | `03-详细设计.md` §13 / §14 / §17 | 当前不采用 |

本步判定:

```text
Step 9 不要求回写 03-详细设计.md。

理由:
- 本步只细化加载、校验、生效与失败策略。
- 没有新增 RuntimeConfig root 子配置组。
- 没有改变 loader / validator / builder 的函数签名。
- reload / hot update 被明确拒绝,没有引入新的 runtime 机制。
```

---

## 9. 回填草稿

正式 `04-配置设计.md` §9 应从本文件摘录,不在回填草稿中重复完整表格。

建议回填结构:

```text
## 9. 配置加载、校验与生效机制

> 校准来源:
> - `design-calibration/04_config_step_09_load_validate_apply.md`
>
> 延伸阅读:
> - 建议继续阅读 Step 9 §7.1~§7.4,获取配置加载流程图、加载校验表、校验阶段拆分和 reload 拒绝规则。

### 9.1 配置加载流程图

摘录 `04_config_step_09_load_validate_apply.md` §7.1。

### 9.2 配置加载校验表

摘录 `04_config_step_09_load_validate_apply.md` §7.2。

### 9.3 校验阶段拆分

摘录 `04_config_step_09_load_validate_apply.md` §7.3。

### 9.4 reload / hot update 拒绝规则

摘录 `04_config_step_09_load_validate_apply.md` §7.4。
```

回填时必须保留以下说明:

- P0 不支持 reload / hot update。
- 高优先级非法值不得回退到低优先级旧值。
- job local args 只影响本次 job invocation。
- `ValidatedRuntimeConfig` 是 entry / runtime builder 的唯一配置输入。

---

## 10. 待确认事项

| 待确认项 | 可选方案 | 推荐方案 | 原因 | 当前处理 |
|---|---|---|---|---|
| P0 是否支持 reload | A. 不支持;B. 全量支持;C. 局部支持 | 推荐 A | reload 会引入 adapter swap、并发、审计和回滚复杂度 | 按 A 写入本步 |
| env 非法值是否回退文件值 | A. 不回退,fail-fast;B. 回退;C. local 回退 | 推荐 A | 避免隐藏配置错误 | 按 A 写入本步 |
| job local args 是否覆盖全局配置 | A. 只局部覆盖 job invocation;B. 覆盖全局配置;C. 不允许任何 job args | 推荐 A | 符合 Step 5 CLI 局部输入边界 | 按 A 写入本步 |
| validator 是否解析真实 secret material | A. 不解析;B. 解析;C. loader 解析 | 推荐 A | 最小持有原则,符合 Step 8 | 按 A 写入本步 |

本步没有阻塞项。上述待确认项均已选择推荐方案作为当前配置设计口径。

---

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置加载流程图已明确 | 已满足 | §7.1 覆盖 source、parse、validate、build、expose |
| 类型校验、范围校验、交叉字段校验已明确 | 已满足 | §7.2 与 §7.3 覆盖 |
| 生效方式已明确 | 已满足 | startup / job startup / reload / hot / static 均已定义 |
| reload / hot update 拒绝或回滚方式已明确 | 已满足 | P0 拒绝新值并保留旧 graph |
| 已判定对 `03-详细设计.md` 的影响 | 已满足 | §8 判定无回写 |

结论: Step 9 可以标记为已确认,并进入 Step 10“定义配置变更、审计与回滚”。
