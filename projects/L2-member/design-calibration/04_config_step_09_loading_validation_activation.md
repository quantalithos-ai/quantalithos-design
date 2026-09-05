# Step 9. 定义配置加载、校验与生效机制

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 9
> 回填章节：`04-配置设计.md` §9 配置加载、校验与生效机制
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_09_loading_validation_activation.md`
> 状态：`completed / pass_with_upstream_and_design_blockers / stop_review`
> 日期：2026-09-03

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 9：定义配置加载、校验与生效机制 |
| 输入 | Step 7 配置项、Step 8 敏感规则、Step 4 生效分类、`03 §13` config loader / builder 入口 |
| 输出 | 配置加载流程图、parse / type / cross-field 校验表、assemble / expose 责任、按域生效矩阵、停审与跨加载审计 |
| 当前状态 | 已完成；允许进入 Step 10 |
| P0 生效 | composition / Store / technical / registry / redaction 为 startup；Job posture 为 job-run-start；entry boundary 为 current entry 的 typed snapshot |
| reload / hot | P0 不支持；任何未来 reload / hot 需求必须先回开 Step 4、03、Step 10/11 |
| 持续 blocker | 所有 `L2M-UP-*`、`L2M-DDD-*`、`scope_supersede_gap` 保持开放；缺失 external slot 只装配 blocked / unavailable |

## 2. 本步目标与执行边界

本 Step 规定配置从 source 到 module 的确定性路径，保证无效配置不会部分进入 runtime，且配置不会绕过 application / domain 的契约。流程必须区分 parse、类型校验、范围校验、交叉字段校验、敏感 ref 校验、builder assembly 和 expose。

本 Step 不实现 loader、validator、builder 或 secret provider，不定义具体错误 struct / enum，不选择 JSON 库、配置中心、热更新框架或部署命令。所有错误只以既有 safe / redacted issue surface 表达。

## 3. SOP 问题回答

| 问题 | L2-member 结论 |
|---|---|
| 配置何时加载？ | startup 读取普通 sources 并生成 immutable validated snapshot；job-run-start 读取该 snapshot 中允许的 job posture / target ref 并形成 invocation snapshot；entry-local 只接收已校验 typed boundary，不重新读 file / env。 |
| 如何 parse 和 type validate？ | strict JSON parse 后按模块 schema 解析；枚举、bool、opaque ref、bounded-class 和 nullability 必须逐项校验；未知 key、重复 key、alias 冲突直接拒绝。 |
| 哪些需要 cross-field validate？ | profile 与 fixture、required Store / replay / technical slot、projection activation 与 projection ref、resolver owner 与 scope、handoff ref 与对应 operation、redaction mode 与 label mode、job retry 与 unknown fence 等必须成组校验。 |
| 生效方式有哪些？ | 仅允许 startup、job-run-start、entry-local、test-fixture-deterministic 和 static-invariant；P0 没有 hot / 自动 reload。 |
| 校验失败怎么处理？ | required local lane fail-fast 且不暴露可写 facade；optional external lane 注入 `BlockedSeamState` / `NotAvailable`；unsafe redaction、raw secret、第三 subject 或 publication config 直接 reject。 |
| builder 如何暴露？ | `infra::runtime_builder.rs` 将 validated refs 装配为 Store / UoW / technical Port、owner resolver / handoff slot、logical registry 和 safe diagnostics；application 只接收 Port / typed parameter，其他层不持有 raw config。 |
| 是否影响 03？ | 当前不影响；仅定义加载 / 校验 / 生效语义。若实现需要新增 config carrier、builder 参数、Port、error、DTO 或 flow，必须先回写 03。 |

## 4. 配置加载与校验流程图

#### 配置加载流程图：L2-member 配置加载与校验

```text
[code defaults]
      +
[strict JSON file]
      +
[allowlisted env selectors / bounded scalars / opaque refs]
      +
[controlled secret-ref lookup boundary]
      |
      v
[parse strict JSON / detect duplicate keys]
      |
      v
[type + nullability + enum validation]
      |
      v
[range / bounded-class validation]
      |
      v
[cross-field + profile + owner/scope validation]
      |
      v
[redact issues + freeze validated snapshot]
      |
      v
[infra::runtime_builder.rs]
      |
      +--> [local Store / UoW / idempotency / typed-result]
      +--> [Clock / ID / digest]
      +--> [resolver / handoff / logical registry]
      +--> [blocked / unavailable / test-only seams]
      |
      v
[application Port / typed boundary / named service]
      |
      +--> [api / worker / jobs]
```

关键说明：

- 来源合并和校验必须在 `infra::config.rs` 完成；builder 不重新解释 raw JSON。
- 任一阶段失败都不暴露 partial runtime；只产生 safe validation issue 或按域进入 blocked posture。
- secret provider 只在受控 adapter boundary 读取材料；raw secret 不进入 snapshot、domain、contracts 或 diagnostics。
- `MemberRuntimeBuildState::Ready` 只表示允许的 local composition 已装配，不表示 host、Runtime、Bus、image、owner 或 downstream ready。

## 5. 校验层次与失败原则

| 校验层 | 检查内容 | 失败结果 | 是否允许回退 |
|---|---|---|---:|
| source merge | 来源名称、allowlist、profile namespace、优先级 | reject source / fail-fast | 否 |
| syntax parse | 严格 JSON、重复 key、非法编码 | fail-fast | 否 |
| type / nullability | enum、bool、opaque ref、bounded class、null | fail-fast 或 optional blocked | 否 |
| range / bounded | bounded-class 是否属于有限集合、禁止负值 / 未知类别 | fail-fast / reject invocation | 否 |
| profile compatibility | profile 与 fixture、external adapter、secret posture | fail-fast 或 slot blocked | 否 |
| owner / scope | ref owner kind、project scope、双锚要求、source family | reject / blocked / unknown | 否 |
| cross-field invariant | required Store/replay/technical、projection activation、redaction safety、job retry fence | fail-fast / operation blocked | 否 |
| secret material | ref 可解析、权限、有效期、provider boundary | critical fail-fast；外围 blocked | 不得 raw fallback |
| builder assembly | slot 可装配、Port/registry 对应关系、无 partial object | no-write / blocked | 不得返回 partial Ready |
| expose | 只暴露 typed Port / boundary / safe issue | reject unsafe exposure | 否 |

## 6. 配置组加载 / 校验 / 生效表

| 配置项 / 配置组 | 加载时机 | parse / type 校验 | cross-field 校验 | assemble / expose 目标 | 生效方式 | 失败策略 |
|---|---|---|---|---|---|---|
| `composition.*` | startup | profile enum、bool、provenance enum | profile 是否允许 fixture / external posture | builder state、redacted provenance | startup | fail-fast |
| `stores.truth_ref` | startup | opaque ref / owner / scope | mutation lane 与 UoW / CAS carrier | CP01～CP05 Store、UoW | startup | no-write / fail-fast |
| `stores.support_ref` | startup | opaque ref / null | CP06 source / snapshot pairing | support Store 或 blocked seam | startup | blocked / not-available |
| `stores.projection_ref` | startup | opaque ref / null | activation posture、watermark source | CP07 projection Store | startup | stale / not-ready |
| `stores.continuation_ref` | startup | opaque ref / null | attempt / gap consumer compatibility | continuation Store | startup | gap / blocked |
| `stores.idempotency_ref` + `result_ref` | startup | opaque ref | reservation、typed replay、retention compatibility | idempotency / result adapters | startup | fail-fast / replay blocked |
| `technical.*_ref` | startup | opaque ref / selector enum | Clock、ID、digest 三者可用性 | technical Ports | startup | fail-fast；不构造 partial object |
| `command_boundary.*` | startup；entry 可带 typed override | bounded enum | metadata / actor / body-free guard 不可关闭 | API command boundary | startup / entry-local | reject entry |
| `query_boundary.*` | startup；entry 可带 typed page | bounded / enum | no-write、visibility、freshness semantics | API query / read surface | startup / entry-local | fail-closed read |
| `consumer.*` | startup；新 envelope 使用 snapshot | enum / ref / bounded | source owner、dedup 与 receipt carrier | worker Consumer gate | startup / entry-local | blocked / reject envelope |
| `projection.*` | startup；rebuild 新 job | enum / ref / null | projection ref、committed watermark、Query no-write | projection service / Job | startup / job-run-start | stale / job blocked |
| `jobs.*` | startup；每次 invocation snapshot | enum / bounded | retry 与 unknown / conflict fence；parallelism 与 profile | five Job runners | startup / job-run-start | reject invocation / report blocked |
| `resolvers.*` | startup | opaque ref / null | owner kind、scope、source contract | owner-specific resolver Port | startup | blocked / waiting / unknown |
| `handoff.*` | startup；新 handoff job | opaque ref / null | operation kind、attempt / gap carrier、external contract gate | handoff Port / blocked seam | startup / job-run-start | local attempt / gap |
| `registry.*` | startup | enum | logical entry ↔ named service mapping | logical registry state | startup | logical entry unavailable |
| `diagnostics.*` | startup | strict enum | redaction mode、label mode、provenance visibility | safe diagnostics hooks | startup | reject unsafe config / redact more |
| `fixtures.*` | test assembly only | bool / enum | profile must be local-dev / ci-test; no production | deterministic fake builder | test-fixture-deterministic | test setup fail |
| `publication_blocked` | never loaded as user config | empty object only | `L2M-UP-005` static blocker | blocked marker / safe metric | static-invariant | reject any non-empty value |

## 7. 交叉字段校验矩阵

| 组合 | 必须成立的条件 | 不成立时 |
|---|---|---|
| `composition.profile` + `fixtures.enabled` | fixture 只允许 test builder / local-dev / ci-test；production-like 一律 false | fail-fast |
| `stores.truth_ref` + `stores.idempotency_ref` + `stores.result_ref` | mutation lane 三者均可用且在同一 logical UoW 语义下配对 | 不暴露可写 facade |
| `stores.projection_ref` + `projection.activation_posture` | 只有 committed source / watermark 可证明时才可启用；默认 disabled | stale / not-ready |
| `technical.clock_ref` + `id_generator_ref` + `digest_ref` | 三个 slot 同一 profile、可用且不由 domain 自建 | fail-fast |
| `resolvers.<owner>_ref` + owner scope | ref owner kind、project scope、purpose 与调用 Port 匹配 | reject / blocked |
| `handoff.*_ref` + operation | handoff 只对应既有 attempt / gap flow；不能创造 event contract | local attempt / gap |
| `jobs.retry_class` + outcome | unknown、commit-unknown、version conflict 不得进入盲重试类别 | reject invocation / report |
| `diagnostics.redaction_mode` + `metric_label_mode` | 必须是 strict + low-cardinality；禁止 debug bypass | reject config |
| `consumer.dedup_posture` + result ref | exact replay 所需 receipt carrier 可读；缺失不允许消费 mutation | blocked / fail-closed |
| `publication_blocked` + any source | object 必须为空；任何 publisher / topic / route key 都非法 | fail-fast |

## 8. 暴露边界与生效快照

| 调用方 | 可得到 | 不可得到 | 快照边界 |
|---|---|---|---|
| `application` | typed boundary、Store / UoW / resolver / handoff / technical Port、safe posture | raw config、secret、endpoint、topic、provider response | startup snapshot；Job / entry 局部参数显式传入 |
| `api` | command / query boundary、named facade methods、safe error mapping | config file、env、Store、resolver、UoW | current entry |
| `worker` | Consumer posture、named Consumer service、receipt mapping | Bus client、raw event body、config source | envelope / current entry |
| `jobs` | Job runner posture、new invocation snapshot、report assembly | scheduler、raw config、direct Store / adapter | one job-run |
| `domain` | explicit typed values、local/support truth | config、Clock、Port、secret、foreign body | no config snapshot |
| `contracts` | public typed carrier definitions | secret、endpoint、route、config source | static design contract |

## 9. 生效时机表

| 生效方式 | 适用项 | 触发 | 运行中行为 | 回滚 / 拒绝 |
|---|---|---|---|---|
| `startup` | composition、Store、technical、resolver、handoff、registry、diagnostics、projection posture | process startup / restart | 当前 runtime 保持 immutable snapshot | validation fail-fast；未启用 hot |
| `job-run-start` | jobs batch / retry / timeout / parallelism、rebuild target、external export / handoff target | 新 Job invocation 前 | 已开始 Job 使用其 invocation snapshot | 新值非法则拒绝 invocation；不改旧 run |
| `entry-local` | command / query / consumer bounded boundary | 当前已授权 entry 建立时 | 只影响当前 entry；不覆盖 composition | invalid value reject entry；不得写全局 config |
| `sensitive-ref` | Store / resolver / handoff / target refs | startup 或新 job-run | provider material 不暴露给上层 | ref / provider 失败按 criticality fail-fast / blocked |
| `test-fixture-deterministic` | fixture、fixed Clock / ID、fake seam | test builder | 仅 test assembly | production detection reject |
| `static-invariant` | 双锚、owner、state、Query no-write、redaction、24 candidate block | design version | 永不动态改变 | 只能走正式设计回开 |

## 10. 加载校验停审记录

| 配置域 | parse / type | cross-field | assemble / expose | 生效 | 03 影响 | 结论 |
|---|---|---|---|---|---|---|
| composition / stores | 通过 | 通过 | 通过；无 partial Ready | startup | 无 | 通过 |
| technical / boundaries | 通过 | 通过 | 通过；Port 注入 | startup / entry-local | 无 | 通过 |
| consumer / projection | 通过 | 通过 | 通过；blocked / stale 可表达 | startup / entry-local / job | 无 | 通过 |
| jobs | 通过 | 通过 | 通过；invocation snapshot | startup / job-run-start | 无 | 通过 |
| resolvers / handoff | 通过 | 通过 | 通过；owner-specific blocked seam | startup / job-run-start | 无 | 通过 |
| registry / diagnostics | 通过 | 通过 | 通过；logical / safe only | startup | 无 | 通过 |
| fixtures / publication_blocked | 通过 | 通过 | 通过；test-only / empty object | test-only / static | 无 | 通过 |

## 11. 跨加载校验审计表

| 审计项 | 结果 | 缺口 / 修正 |
|---|---|---|
| 必填项是否都有 parse、type、cross-field 校验 | 通过 | mutation lane、technical、profile、redaction 均覆盖 |
| 高优先级非法值是否回退 | 通过 | 不回退；直接 fail-fast / reject |
| raw secret 是否进入 snapshot | 通过 | provider material 仅 adapter 内部使用 |
| partial runtime 是否可能被暴露 | 通过 | builder 只暴露完整 local composition 或明确 blocked / unavailable |
| job / entry 局部值是否污染全局 snapshot | 通过 | invocation / entry-local 快照隔离 |
| Query 是否因配置触发 write / refresh / rebuild | 通过 | no-write static invariant |
| external `Ready` 是否被配置伪造 | 通过 | Ready 仅 local composition；external slot 需 owner feedback |
| 24 candidate 是否被 loader 接受为 publisher 配置 | 通过 | `publication_blocked` 只允许空对象 |
| 错误是否泄露 raw config / secret | 通过 | redacted issue ref / safe error only |
| 是否新增 03 carrier / Port / error / flow | 未发现 | 当前仅定义加载和生效规则，无回写 |

## 12. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---:|---|---|---|
| 统一 `infra/config.rs` load / validate / redact，`runtime_builder.rs` assemble | 否 | 承接既有 §13 | `03 §13` 已有 | 无回写 |
| startup / job-run-start / entry-local 三种 P0 生效边界 | 否 | 配置生命周期语义 | 不改变现有 flow | 无回写 |
| cross-field 校验保护双锚、replay、no-write、blocked seam | 否 | 不变量校验 | `03 §3、§8～§13` 已有 | 无回写 |
| provider / sensitive ref 只在 adapter boundary 解析 | 否 | 安全边界细化 | `03 §13/§14` 已有 | 无回写 |
| 未来 hot/reload 需要新 builder snapshot、Port、error 或 flow | 是 | 代码契约变化 | `03 §4～§14` 与 owning Step | 已回写（03 已有回开规则；未来触发器当前未触发） |

当前不存在实际“待回写”或“阻塞待确认”项；未来触发器不作为已支持的生效方式。

## 13. 回填草稿：正式 `04-配置设计.md` §9

> 校准来源：
> - `design-calibration/04_config_step_09_loading_validation_activation.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“配置加载与校验流程图”“校验层次与失败原则”“配置组加载 / 校验 / 生效表”“交叉字段校验矩阵”和“生效时机表”。

正式 §9 应收口为：

1. 配置统一经过 source merge、strict JSON parse、type / nullability、bounded-class、profile / owner / scope、cross-field validate，再由 `infra::runtime_builder.rs` 装配；任一失败不得暴露 partial runtime。
2. `application` 只接收 Port、typed boundary 和 safe posture；`api`、`worker`、`jobs` 不重新读文件 / env；`domain`、`contracts` 不接收 config 或 secret。
3. composition / Store / technical / resolver / handoff / registry / diagnostics 为 startup；Job posture 和 Job target 为 job-run-start；entry boundary 为 current entry 的 typed snapshot；P0 不支持 hot / 自动 reload。
4. required mutation lane 缺少 truth、idempotency、typed-result 或 technical slot 时 fail-fast / no-write；optional external slot 进入 `Blocked` / `Waiting` / `Unknown` / `NotAvailable`；projection 未达 watermark 进入 stale / not-ready。
5. `publication_blocked` 只接受空对象；任何 event / publisher / outbox / topic / route / retry / DLQ 输入均被拒绝。

## 14. 待确认事项与 blocker

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| secret provider lookup API（`L2M-UP-001/006`） | provider 读取、权限、expiry 校验 | 只保留 ref；critical fail-fast / peripheral blocked |
| owner / scope exact contract（`L2M-UP-002~008`） | cross-field owner validation | blocked / waiting / unknown；不默认 Completed |
| physical Store / UoW realization | assemble target 与 durability | profile-default / deterministic fake；不声明 durable |
| future reload / hot request | snapshot、rollback、audit、03 impact | P0 reject；提出后重新走 Step 4、9、10、11 |
| bounded-class 数值 authority | type validator 最终 numeric mapping | 继续使用结构性类别，不设性能目标 |

## 15. 进入 Step 10 的条件与停审结论

| 门禁 | 结果 | 依据 |
|---|---|---|
| load / parse / type / range / cross-field / assemble / expose 链条完整 | 通过 | §4、§5 |
| 每个配置域的加载、生效和失败策略明确 | 通过 | §6、§9 |
| partial runtime、raw secret、unsafe exposure 被禁止 | 通过 | §5、§8、§11 |
| startup / job-run-start / entry-local 边界明确 | 通过 | §9 |
| hot / reload 当前不支持且有回开路径 | 通过 | §1、§9 |
| 跨加载校验审计完成 | 通过 | §10、§11 |
| 对 03 的影响已判定，无当前回写项 | 通过 | §12 |
| 正式 `04` 未提前创建 | 通过 | 遵守 Step 15 后置装配纪律 |

Step 9 完成。下一步允许创建 `04_config_step_10_change_audit_rollback.md`，定义配置变更权限、评审、审计记录、生效、失败和回滚边界。

```text
step_09 = completed
gate_status = pass_with_upstream_and_design_blockers / stop_review
next_allowed_action = create_step_10_change_audit_rollback
formal_04_write_allowed = false_until_step_15
implementation_repo_write_allowed = false
test_execution_allowed = false
commit_required = false
```
