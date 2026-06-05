# Step 9. 定义配置加载、校验与生效机制

> 本文件是 `projects/L1-work/04-配置设计.md` 的 Step 9 中间产物。
> 本步定义 L1-work 配置如何加载、解析、校验、装配和生效。
> 本步不新增 `WorkRuntimeConfig` 字段,不引入热更新,不创建正式 `04-配置设计.md`。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 9
- 回填章节: `projects/L1-work/04-配置设计.md` §9 配置加载、校验与生效机制

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `04_config_step_07_config_items.md` | P0 28 个配置项、默认值、来源、作用域、生效方式和失败策略 | 固定加载校验表的配置项范围 |
| `04_config_step_08_sensitive_secrets.md` | ref-only sensitive、raw secret 禁止项、敏感输出边界 | 固定敏感配置校验和失败策略 |
| `04_config_step_05_sources_priority_conflicts.md` | `code defaults < JSON config file < environment variables` 与非法高优先级 fail-fast | 固定来源覆盖链和冲突处理 |
| `04_config_step_04_classification_boundaries.md` | P0 核心配置冷更新 / 启动读取、job-run-start 和禁止配置化边界 | 固定生效方式和 hot reload 拒绝口径 |
| `03_ddd_step_14_config_external_binding.md` | `WorkRuntimeConfig::load_and_validate(...)`、`WorkRuntimeBuilder` 绑定顺序和模块读取边界 | 固定 loader / builder / adapter 装配路径 |

已确认结论:

```text
L1-work P0 配置由 entry 选择 profile / config path 后交给 infra::config 加载。
普通配置来源覆盖顺序为 code defaults < JSON config file < environment variables。
配置必须先完成 parse、type validation、cross-field validation 和 forbidden boundary validation,再交给 WorkRuntimeBuilder。
P0 不支持核心 runtime graph 热更新或 reload;运行中配置变化必须通过冷重启或下一次 job-run-start 生效。
```

## 3. SOP 问题回答

### 3.1 配置在什么时机加载?

加载时机分为三类:

| 时机 | 适用范围 | 说明 |
|---|---|---|
| process startup | `store`、`boundary`、`idempotency`、`projection.adapter_kind`、`projection.stale_threshold`、`external`、`outbox.publisher`、`handoff`、`features` | entry 读取 config path / profile,调用 `WorkRuntimeConfig::load_and_validate(...)`,再交给 `WorkRuntimeBuilder` 装配 runtime |
| job-run-start | `projection.replace_scope`、`jobs.*`、`outbox.publish_batch_size`、`outbox.publish_retry`、job 局部参数 | job run 开始时读取已校验 runtime config 和 entry local args,run 内保持稳定 |
| static design invariant | 禁止配置化边界、truth ownership、external body exclusion、metadata / idempotency、query no-write、projection no-write | 不从配置读取;如配置试图表达这些开关,loader 必须 reject |

P0 不定义 runtime reload、远程 config center 或 admin override。配置文件、env 或 entry args 改变后,核心 runtime graph 只通过冷重启生效。

### 3.2 配置如何 parse 和 type validate?

解析和类型校验按固定顺序执行:

```text
1. 读取 code defaults。
2. 如 entry 指定 JSON config file,读取并严格解析 JSON。
3. 应用 environment overrides。
4. 将 merged raw config parse 为 typed WorkRuntimeConfig。
5. 执行 type / range / enum / ref-shape validation。
6. 执行 cross-field validation。
7. 执行 forbidden boundary 和 sensitive boundary validation。
8. 交给 WorkRuntimeBuilder。
```

校验口径:

- JSON config file 是严格 JSON;文档中的 JSONC 只用于说明,不能作为实际配置文件。
- 未指定 JSON config file 时使用 code defaults。
- 指定 JSON config file 不存在、不可读或解析失败时 fail-fast。
- env override 存在但类型错误、枚举值不支持或违反范围时 fail-fast,不得回退 file / defaults。
- duration、byte size、batch size、page limit、retry policy、bool、enum string、adapter config 和 ref-only sensitive 字段必须进入 typed validation。
- 同一 JSON 文件重复 key 或等价别名 key 视为歧义配置,fail-fast。

### 3.3 哪些配置需要 cross-field validate?

| 交叉校验项 | 规则 | 失败策略 |
|---|---|---|
| idempotency retention | `reserved_record_max_age <= command_retention`;command retention 必须覆盖客户端 retry window;event dedup retention 必须覆盖 event redelivery window | startup fail-fast |
| retry policy | `max_attempts >= 1`;`base_delay > 0`;`max_delay >= base_delay`;retry window 不得超过相关 timeout / retention 的可接受范围 | startup 或 job-run-start fail-fast |
| batch / page limit | `jobs.default_batch_size`、`outbox.publish_batch_size`、`boundary.max_page_limit` 必须大于 0 且不超过实现上限 | startup 或 job-run-start fail-fast |
| timeout | `store.transaction_timeout`、`boundary.query_read_timeout`、`jobs.job_timeout`、projection / handoff 相关 timeout 必须为正 | startup 或 job-run-start fail-fast |
| adapter kind 与 ref | fake adapter 不要求 endpoint / credential ref;configured adapter 必须提供需要的 endpoint / credential / target ref;不得自动降级 fake | startup fail-fast |
| ref-only sensitive | sensitive 字段只能出现 `CredentialRef`、`SecretRef`、`EndpointRef`、`TargetRef` 等引用形态,不得出现 raw secret / raw token / raw payload | startup fail-fast |
| features | `advanced_search_enabled=true` 只有在 P0 search contract / backend 已存在且已装配时允许;`derived_views_enabled=false` 不得关闭 truth path | startup fail-fast |
| projection replace scope | `projection.replace_scope` 只能影响 projection rebuild job,不得让 query 或 projection adapter 反写真相 | job-run-start fail-fast |
| forbidden boundary | 配置不得关闭 metadata、idempotency、visibility、audit / outbox、redaction、external body exclusion 或 query no-write | startup fail-fast |

### 3.4 哪些配置 startup / reload / hot / build-time / static?

| 生效类别 | 配置范围 | P0 口径 |
|---|---|---|
| startup | runtime graph、store、boundary、idempotency、projection adapter、external resolver、publisher、handoff、features | 启动读取,冷更新 |
| job-run-start | job batch、parallelism、retry、timeout、projection replace scope、outbox publish batch / retry、entry job scope | job run 开始读取,run 内不变 |
| reload | 无 | P0 不支持 |
| hot | 无核心配置 | P0 不支持核心热更新;local / test 诊断变化不得关闭安全门禁 |
| build-time | 无 | P0 不把配置项变成编译期开关 |
| static invariant | 禁止配置化边界、truth ownership、dependency discipline | 不读取配置;命中即 reject |

### 3.5 校验失败后如何处理?

| 失败类型 | 处理 |
|---|---|
| config file 缺失且未指定 | 使用 code defaults,继续校验 |
| 指定 config file 不存在 / 不可读 / parse 失败 | startup fail-fast |
| env override 非法 | startup fail-fast,不得回退低优先级 |
| required configured adapter ref 缺失 | startup fail-fast |
| ref provider 不可用 | adapter 启动阶段 fail-closed;resolver 调用阶段按 flow 写 unresolved / failed marker |
| raw secret / raw token / raw payload 出现在普通配置 | startup fail-fast,并只输出 sanitized error |
| unsupported profile / config center / admin override | startup fail-fast |
| job-run-start 参数非法 | 当前 job fail-fast,不影响已运行 runtime |
| reload / hot update 请求 | P0 unsupported,拒绝请求;保留当前 runtime config |
| forbidden boundary 命中 | startup fail-fast,并进入设计变更流程,不得作为普通配置调整 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `04_config_step_07_config_items.md` | 已给每项生效方式和失败策略,但未统一成加载 / 校验流程 | 本步汇总为 loader 流程和校验表 |
| `04_config_step_08_sensitive_secrets.md` | 已定义 ref-only sensitive,但未明确 loader 如何拒绝 raw secret | 本步把 ref-shape 和 forbidden raw value 放入 validation |
| `03_ddd_step_14_config_external_binding.md` | 已有 `load_and_validate` 和 builder 顺序,但不展开 parse / env / cross-field | 本步补配置设计层执行规则 |
| 正式 `04-配置设计.md` | 本 Step 撰写时尚未存在 §9;当前已回填正式 §9 | 本步提供回填来源 |
| 后续测试 / 验收 | 本 Step 撰写时尚未有非法 env、重复 key、unsupported hot reload、raw secret 命中测试矩阵;当前已由正式 `05/06` 承接 | 历史风险已关闭 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 加载流程 | 只在详细设计中写 builder 绑定顺序 | 明确 source -> parse -> type validate -> cross-field validate -> assemble -> expose | 支撑实现和测试 |
| JSON / env 解析 | 来源优先级已定义,未给 loader 操作顺序 | 固定 defaults、file、env 的合并和非法值 fail-fast | 避免实现者自行决定 |
| 生效方式 | 每项分散标注 startup / job-run-start | 统一为 startup、job-run-start、static invariant;P0 无 reload / hot / build-time | 防止热更新歧义 |
| 交叉校验 | 分散在 idempotency、retry、adapter、features 说明 | 汇总为 cross-field validation 表 | 让校验失败面可测试 |
| 敏感校验 | 已禁止 raw secret | 明确 loader 拒绝 raw secret / raw token / raw payload | 防止 secret 进入普通配置 |

## 6. 配置设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: P0 只支持启动加载和 job-run-start 生效 | 行为稳定,实现可验证,不会运行中替换 runtime graph | 运维灵活性较低 | 采用 |
| 方案 B: 支持核心配置 reload / hot update | 运维灵活 | 需要一致性、回滚、审计和 adapter 生命周期专项 | 不采用 |
| 方案 C: 高优先级非法值回退低优先级 | 可用性看似更好 | 隐藏错误,破坏验收可判定 | 不采用 |
| 方案 D: JSONC 作为实际配置文件格式 | 文档示例和实际文件一致 | 需要额外 parser,容易把注释误当正式配置 | 不采用 |

推荐方案 A。

原因:

- L1-work P0 的目标是默认可验证路径,不是远程动态配置系统。
- 冷更新和 job-run-start 能保持 truth、projection、outbox、handoff 和 report run 的配置版本稳定。
- fail-fast 能让错误配置在启动或 job run 开始阶段暴露,不污染业务 truth。

## 7. 结构化中间产物

### 7.1 配置加载流程图

#### 配置加载流程图: L1-work 配置加载与校验

```text
[entry: api / worker / jobs]
  -> [select profile and optional config file path]
  -> [code defaults]
  -> [strict JSON config file parse]
  -> [environment overrides]
  -> [merge ordinary config values]
  -> [type / range / enum / ref-shape validate]
  -> [cross-field validate]
  -> [forbidden boundary and sensitive boundary validate]
  -> [WorkRuntimeConfig]
  -> [WorkRuntimeBuilder]
  -> [store / projection / idempotency adapters]
  -> [resolver / publisher / handoff adapters]
  -> [api handlers / worker consumers / job runners]
```

关键说明:

- `application`、`domain`、`contracts` 不读取配置。
- entry local args 只选择 config source 或提供当前 job/run 局部参数。
- `WorkRuntimeConfig` 只保存 ref-only sensitive 引用,不保存 secret material。
- 所有核心 runtime graph 配置只在 startup 生效;job 参数只在 job-run-start 生效。
- P0 reload / hot update 请求必须被拒绝,不得半更新 runtime。

### 7.2 配置加载校验表

| 配置项 / 配置组 | 加载时机 | 校验方式 | 生效方式 | 失败策略 |
|---|---|---|---|---|
| `store.*` | startup | adapter enum、positive timeout、owner uniqueness enum | 冷更新,重启后生效 | unsupported adapter / timeout 非法 fail-fast |
| `boundary.*` | startup | byte size、page limit、query timeout 正数和实现上限 | 冷更新,handler 参数重建后生效 | 非法值 fail-fast |
| `idempotency.*` | startup | duration 正数、retention 覆盖 retry / redelivery window、reserved age 不超过 command retention | 冷更新,adapter policy 重建后生效 | 非法值 fail-fast |
| `projection.adapter_kind` / `projection.stale_threshold` | startup | adapter enum、stale threshold 正数、query no-write invariant | 冷更新,projection adapter / query marker 重建后生效 | 非法值 fail-fast |
| `projection.replace_scope` | job-run-start | enum 值、不得反写真相 | 当前 projection rebuild job 生效 | 当前 job fail-fast |
| `jobs.*` | job-run-start | batch / parallelism / retry / timeout 范围、retry policy 交叉校验 | 当前 job run 生效,run 内不变 | 当前 job fail-fast |
| `external.*` | startup | adapter enum、configured ref 条件必填、ref-shape、raw secret 禁止 | 冷更新,resolver adapter 重建后生效 | 配置不完整 fail-fast;调用失败按 flow unresolved / failed |
| `outbox.publish_batch_size` / `outbox.publish_retry` | job-run-start | batch / retry policy 范围、retry delay 交叉校验 | 当前 publisher loop / job run 生效 | 当前 publisher run fail-fast |
| `outbox.publisher` | startup | adapter enum、configured ref 条件必填、raw secret 禁止 | 冷更新,publisher adapter 重建后生效 | 配置不完整 fail-fast;publish failure 只标记 failed |
| `handoff.*` | startup | target adapter enum、target / credential ref 条件必填、raw secret 禁止 | 冷更新,handoff adapter 重建后生效 | 配置不完整 fail-fast;handoff failure 写 marker |
| `features.derived_views_enabled` | startup | bool;不得关闭 truth path | 冷更新,service / route 装配后生效 | 非 bool 或越界语义 fail-fast |
| `features.advanced_search_enabled` | startup | bool;启用时必须存在 P0 search contract / backend | 冷更新,query route / service 装配后生效 | 条件不满足 fail-fast |
| ref-only sensitive 字段 | startup 或 job-run-start | 只允许 ref 形态,禁止 raw secret / token / payload | 随所属配置项生效 | sanitized fail-fast |
| entry local args | entry / job-run-start | config path / profile / run id / job scope 类型和范围 | 只对当前入口或当前 job 生效 | 当前入口 / job fail-fast |
| forbidden boundary | startup | 禁止配置化项检测 | 不生效;必须拒绝 | fail-fast,进入设计变更流程 |
| reload / hot update request | runtime | P0 unsupported 检测 | 不生效;保留当前 config | reject / unsupported |

### 7.3 加载阶段职责表

| 阶段 | 责任 | 不允许做的事 |
|---|---|---|
| entry | 读取 profile、config path、job local args | 不直接装配 adapter,不覆盖全局禁止项 |
| `infra::config` | 加载 defaults / file / env,输出 typed `WorkRuntimeConfig` | 不读取 secret material,不静默回退非法高优先级值 |
| validator | type / range / cross-field / forbidden boundary 校验 | 不把非法配置修正成默认值 |
| `WorkRuntimeBuilder` | 按已校验 config 装配 adapter 和 service | 不把 config object 传入 domain,不半装配 runtime |
| adapter | 解析 ref、执行外部调用、记录 sanitized outcome | 不记录 material,不伪装 fake 为 configured success |
| application / domain / contracts | 消费已装配 port 和 typed input | 不读取 config file / env / raw config |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 明确配置加载链为 defaults -> JSON file -> env -> typed validation -> builder | 否 | 配置设计规则,不改变 `load_and_validate` 签名 | 无 | 无回写 |
| P0 不支持核心 reload / hot update,运行中请求拒绝并保留当前 config | 否 | 生效策略,与 Step 4 冷更新口径一致 | 无 | 无回写 |
| 增加 idempotency / retry / adapter / features / ref-only sensitive cross-field validation 表 | 否 | 配置校验规则,未新增字段或 error enum | 无 | 无回写 |
| raw secret / raw token / raw payload 命中 loader fail-fast | 否 | 敏感配置规则,与 Step 8 一致 | 无 | 无回写 |

说明:

```text
本步没有新增 WorkRuntimeConfig 字段、ConfigError enum、adapter constructor 参数、trait 方法或函数流。
如后续实现发现 ConfigError 缺少正式 variant,应回到 03 详细设计补错误模型,不能由实现者自行添加。
```

## 9. 回填草稿

正式 `04-配置设计.md` §9 建议采用以下结构:

```text
9. 配置加载、校验与生效机制
  9.1 配置加载流程图
  9.2 加载、解析和覆盖顺序
  9.3 类型校验、范围校验和交叉字段校验
  9.4 启动、生效、job-run-start 和 unsupported hot reload
  9.5 校验失败处理
  9.6 对 03-详细设计的影响判定
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §9.1 | `design-calibration/04_config_step_09_load_validate_apply.md` §7.1 |
| §9.2 | `design-calibration/04_config_step_09_load_validate_apply.md` §3.2 |
| §9.3 | `design-calibration/04_config_step_09_load_validate_apply.md` §3.3 / §7.2 |
| §9.4 | `design-calibration/04_config_step_09_load_validate_apply.md` §3.4 |
| §9.5 | `design-calibration/04_config_step_09_load_validate_apply.md` §3.5 |
| §9.6 | `design-calibration/04_config_step_09_load_validate_apply.md` §8 |

## 10. 待确认事项

无阻塞进入 Step 10 的待确认事项。

后续 Step 必须继续收口:

- Step 10 定义配置变更、审计和回滚,尤其是冷更新、job-run-start 和 rejected hot update 的审计记录。
- Step 11 定义缺配置、错配置、敏感 ref 不可解析、adapter 不可用、配置漂移和 unsupported profile 的 fail-fast / degraded 测试切口。
- Step 12 把 loader、validator、cross-field、raw secret 和 unsupported hot reload 场景承接到测试、验收和实施计划。

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 配置加载流程图已形成 | 通过 | §7.1 |
| 配置加载校验表已形成 | 通过 | §7.2 |
| 类型 / 范围 / 交叉字段校验已覆盖 | 通过 | §3.2 / §3.3 |
| startup / job-run-start / reload / hot / build-time / static 口径已形成 | 通过 | §3.4 |
| 校验失败策略已形成 | 通过 | §3.5 |
| 对 03 影响已有判定 | 通过 | §8 当前无回写 |
| 可以进入 Step 10 | 通过 | 下一步定义配置变更、审计与回滚 |
