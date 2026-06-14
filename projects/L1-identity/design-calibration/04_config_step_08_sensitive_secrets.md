# 04 配置设计 Step 8 · 定义敏感配置与密钥管理

> 子项目: `L1-identity`
> 目标文档: `04-配置设计.md`
> SOP Step: Step 8 定义敏感配置与密钥管理
> 状态: 已写入;等待用户审核

---

## 1. Step 状态

| 项 | 状态 |
|---|---|
| 当前 Step | Step 8 定义敏感配置与密钥管理 |
| 当前状态 | 已写入;等待用户审核 |
| 输入基线 | Step 5 sources / priority / conflicts;Step 6 profiles / matrix;Step 7 config items;新版正式 `03-详细设计.md` §13~§15 |
| 输出文件 | `projects/L1-identity/design-calibration/04_config_step_08_sensitive_secrets.md` |
| 停审方式 | 本 Step 完成后暂停,审核通过后进入 Step 9 loading / validation / activation |

本 Step 单独收稳 `L1-identity` 配置中的 sensitive ref、secret raw material、endpoint / route / target ref、operations replay ref、fixture ref、redaction guard 和 forbidden output 边界。

本 Step 只回答:

- 哪些 Step 7 配置项属于 `sensitive`、`internal safety-critical`、`test-internal` 或真正 `secret`。
- 普通 config file、environment variables、entry-local parameters、test fixture、job input 和 report 中允许保存什么 ref,禁止保存什么 raw material。
- sensitive ref 如何读取、轮换、审计、脱敏输出和失效。
- 不同 profile 中 sensitive ref、fixture ref、endpoint ref 和 future secret provider ref 如何处理。
- 每个敏感配置是否改变 `03-详细设计.md` 的 runtime config、builder、adapter constructor、port、error、DTO 或 flow 契约。

本 Step 不定义:

- 具体 secret provider、KMS、Vault、cloud secret manager、配置中心或 admin override 产品。
- 具体 env var 名、CLI flag、secret path、DSN、endpoint URL、token、password、private key、certificate body 或账号。
- 具体部署挂载、证书安装、权限申请、值班流程、production rotation runbook 或 hot reload 机制。
- `IdentityRuntimeConfig` Rust struct、secret resolver port、adapter constructor signature 或新的 public error / DTO。

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 已审核通过 | 提供 `defaults < file < env`、ordinary source 只承载 refs、raw secret forbidden 和 P0 no config center |
| `04_config_step_06_environment_profiles_matrix.md` | 已审核通过 | 提供 `local-dev`、`ci-test`、`integration-like`、`operations-replay`、P1/P2 staging/production-like 的敏感配置处理 |
| `04_config_step_07_config_items.md` | 已审核通过 | 提供字段级配置项、敏感级别标签、profile-derived 默认和失败策略 |
| `03-详细设计.md` §13 | 已完成 | 提供 raw config ownership、runtime builder order、adapter binding、body-free / secret-free config boundary |
| `03-详细设计.md` §14 | 已完成 | 提供 log、metric、audit、trace、report、handoff marker 和 fake/private material redaction 红线 |
| `03-详细设计.md` §15 | 已完成 | 提供 config/runtime/adapter/redaction 最小测试切口 |
| 旧 `04_config_step_08_sensitive_secrets.md` | 历史诊断输入 | 只用于识别旧粒度和旧字段漂移;本 Step 按新版 Step 7 重写 |
| `L1-governance` Step 8 calibration | 参考样式 | 只参考敏感级别、读取图、输出禁止和停审矩阵粒度,不复用 governance 业务字段 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些配置是 sensitive 或 secret? | `store.dsn_ref`、`bus.endpoint_ref`、`external_refs.*.endpoint_ref`、`audit.sink_ref` 是 `sensitive ref`。`role_catalog.snapshot_ref`、`bus.topic_map_ref`、`external_refs.trace_handoff.target_ref`、`operations.replay.report_root_ref`、`operations.replay.input_root_ref` 是 `ref-sensitive` 或 `sensitive-adjacent`。`audit.redaction_profile` 和 `redline.*` 是 `internal safety-critical`。`role_catalog.fixture_ref`、`fixture.seed_ref` 是 `test-internal` 且不得含 raw body / secret。真实 password、token、private key、cert body、raw DSN、raw endpoint credential、raw bus credential、raw archive package、raw memory body、raw artifact body、raw historical replay body 是 `secret` 或 forbidden body,不得作为配置项出现。 |
| 敏感配置如何存储,是否允许明文? | 普通 JSON config、env、entry-local、job input 和 test fixture 只能保存 opaque ref 或 safe selector。不得保存 raw secret、credential、endpoint credential、RoleDefinition / CapabilityDefinition body、Project / WorkItem / ProjectMember body、memory body、archive package、artifact body、broker payload body、adapter raw response 或 historical raw replay body。 |
| 敏感配置如何轮换? | P0 无 hot rotation。startup sensitive ref 通过新 ref 或 ref target 更新后 restart 生效。job-run-start refs 通过 new job run 生效,并在该 run 的 report / stored replay surface 中固化为 redacted digest。future provider-side rotation 不改变 identity truth;若需要 runtime hot reload / zero-downtime rotation,必须回写 `03`。 |
| 读取和变更是否需要审计? | 需要。读取只能记录 key path、source kind、profile、adapter slot、redacted ref digest、validation issue ref、resolve status 和 run id。变更需记录 actor/operator ref、change request ref、old/new redacted digest、scope/profile、reason ref、validation result 和生效方式。Step 10 继续细化变更审计和 rollback。 |
| 日志、错误返回、审计、报告和 evidence 中如何避免泄露? | 只允许输出 safe error code、failure class、operation kind、adapter slot、profile、run id、redacted digest、safe diagnostic ref 和 validation issue ref。禁止输出 full sensitive ref、secret material、endpoint、route、target credential、raw config value、external body、adapter response、fake private fixture map 或 high-cardinality raw label。 |
| 每个敏感配置是否回指 Step 7 配置项、来源规则和加载 / 变更机制? | 是。§7.3 逐项回指 Step 7 key。来源规则承接 Step 5;profile 差异承接 Step 6;加载校验由 Step 9 承接;变更审计和 rollback 由 Step 10 承接;失效 / fail-fast / degraded 由 Step 11 承接。 |
| 每个敏感配置完成后是否通过停审? | 已通过。§7.8 按配置族记录存储方式、明文禁止、轮换、审计、输出禁止和缺口。 |
| 所有敏感配置完成后是否存在 raw secret 入文档、普通配置误归类、日志泄露或轮换审计缺口? | 已审计。本文只写 ref / null / 类别名,不写真实 secret。P0 不支持 secret provider product、hot reload、admin override 或 remote config center。任何 future secret provider / hot rotation / product endpoint schema 都是 `03` 回写点。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 7 配置项清单 | 已标注 `sensitive-ref`、`ref-sensitive`、`security-critical` 和 internal refs,但未统一到敏感级别和密钥处理规则 | 本 Step 归一为 `public`、`internal`、`internal safety-critical`、`test-internal`、`sensitive`、`secret` |
| Step 5 来源规则 | 已定义 ordinary source 只承载 refs,但未逐项说明读取、轮换、审计和禁止输出 | 本 Step 为每类 sensitive ref 建表 |
| Step 6 profile 矩阵 | 已定义 fake refs、credential refs、secret provider refs 的 profile 差异,但未给统一敏感处理矩阵 | 本 Step 定义 profile sensitive handling 表 |
| `03` §13 | 已定义 config ownership、builder order 和 secret-free boundary,但不定义完整 secret management | 本 Step 只在 `04` 层定义 ref-only 密钥管理语义 |
| `03` §14 | 已定义 observability redaction,但未映射到 Step 7 配置 key | 本 Step 把 config、adapter、fixture、report、job run 和 evidence 输出面统一纳入禁止输出规则 |
| 旧 Step 8 | 使用旧输入和较粗粒度,且引用了旧 `02/05/06` 方向 | 本 Step 按新版 Step 5~7 和新版正式 `03` 全量替换 |

## 5. 改动前后对比

| 项 | 改动前 | 本步后 | 原因 |
|---|---|---|---|
| 敏感级别 | `sensitive-ref` / `ref-sensitive` / `security-critical` 混用 | 统一为规范级别,并保留 identity-specific safety-critical / test-internal 说明 | 便于正式 `04`、测试和验收引用 |
| raw secret | Step 5/7 只说禁止 | 扩展到 config、env、entry-local、fixture、log、audit、trace、outbox、projection、dead-letter、report、evidence 全链路 | 防止实现侧把 secret 当字符串 |
| operations replay refs | 只标为 ref-sensitive | 明确为 sensitive-adjacent,不得含 raw historical body | operations-replay 最容易把历史正文带入 evidence |
| fixture refs | 只作为 local/CI 输入 | 定义为 test-internal,不得进入 production-like,不得含 raw body / secret | 防止 fake private material 泄露 |
| route / target refs | 分散在 bus / handoff / audit | 若指向 real transport / endpoint / protected registry,按 sensitive 处理 | route / target 可暴露拓扑和交付目标 |
| 轮换 | 未集中说明 | P0 restart / new job run;no hot rotation | 当前 `03` 没有 runtime reload contract |
| 详细设计影响 | 旧稿可能暗示 secret facility | 本 Step 不新增 secret provider port / runtime struct / adapter constructor | 避免 `04` 静默补代码契约 |

## 6. 配置设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| ordinary env 是否可保存 raw DSN / token | A. 可保存;B. 只能保存 opaque ref | 采用 B。承接 Step 5 raw secret forbidden |
| 是否在 P0 指定 secret provider 产品 | A. 指定;B. product-neutral ref-only | 采用 B。`03` 未定义 provider port 或产品 schema |
| 是否把所有 `*_ref` 都当 secret | A. 全部 secret;B. 按泄露风险分级 | 采用 B。`fixture_ref`、`snapshot_ref`、`topic_map_ref` 需要按 target profile 和 backing store 判定 |
| operations replay root 是否 internal | A. internal;B. sensitive-adjacent | 采用 B。它可能暴露历史数据范围、artifact topology 或报告位置 |
| redline guards 是否 secret | A. secret;B. internal safety-critical | 采用 B。guard 值本身不是秘密,但变更高风险,必须审计 |
| fixture ref 是否可输出完整值 | A. 可输出;B. 只在 test evidence 中输出 safe ref / digest | 采用 B。fixture ref 可能暴露 private fake map 结构 |
| secret rotation 是否 hot 生效 | A. hot reload;B. restart / new job run | 采用 B。P0 无 reload / rollback / audit contract |
| adapter failure 是否可输出 raw provider error | A. 可输出;B. 映射为 safe failure class / issue ref | 采用 B。adapter response 可能含 credential、endpoint 或 body |

## 7. 结构化中间产物

### 7.1 敏感级别归一规则

| 规范级别 | L1-identity 含义 | Step 7 标签 / 示例 | 处理要求 |
|---|---|---|---|
| `public` | 可公开、低风险、无拓扑或数据泄露含义的枚举值 | `profile.name` 的 profile kind、adapter mode label 的公开部分 | 可进入普通配置和文档示例;仍需类型校验 |
| `internal` | 内部运行配置、阈值、batch、retry、store / projection logical name | `outbox.publish.batch_size`、`projection.checkpoint_name`、`operations.run_id_required` | 可进入普通配置;日志可输出 key 和 safe value 类别,避免高基数 label |
| `internal safety-critical` | 不是秘密,但能放宽红线或影响审计 / redaction | `audit.redaction_profile`、`redline.*` | 不允许放宽;变更必须审计;unsafe value fail-fast |
| `test-internal` | 只可在 local-dev / ci-test 使用的 fixture / deterministic refs | `role_catalog.fixture_ref`、`fixture.seed_ref` | 不得进入 integration-like / staging-like / production-like;不得含 raw body / secret |
| `sensitive` | 暴露后会泄露 credential pointer、route、target、topology、store location、report root 或 endpoint-backed resolver | `store.dsn_ref`、`bus.endpoint_ref`、`external_refs.*.endpoint_ref`、`audit.sink_ref`、real `topic_map_ref`、`trace_handoff.target_ref` | 普通配置只能保存 opaque ref;输出只允许 redacted digest / issue ref |
| `sensitive-adjacent` | 不是 credential,但可暴露历史数据范围、artifact/report topology 或 protected source identity | `operations.replay.report_root_ref`、`operations.replay.input_root_ref`、protected `role_catalog.snapshot_ref` | 按 sensitive 输出规则处理;job-run-start 冻结并写 redacted digest |
| `secret` | 真实秘密材料或 forbidden body | password、token、private key、cert body、raw DSN、raw endpoint credential、RoleDefinition body、memory body、artifact body、archive package、raw broker payload | 不得写入 ordinary config、env、fixture、log、audit、trace、outbox、projection、report、evidence |

### 7.2 敏感配置读取图

#### 敏感配置读取图: L1-identity opaque refs 到 adapter 内存边界

```text
[ordinary config sources]
  -> [opaque refs / safe selectors only]
  -> [infra config parse and validation]
  -> [redacted config source summary]
  -> [runtime builder]
  -> [adapter registry / store registry / report writer]
  -> [application facade receives ports and typed parameters]

[future secret provider]
  -> [adapter-local credential resolution]
  -> [raw material stays inside adapter memory boundary]
  -> [safe outcome / issue ref returned]
```

关键说明:

- 普通 config file、env、entry-local、job input 和 test fixture 只能提供 ref 或 safe selector。
- `identity-infra` 的 config loader / runtime builder 可以解析和校验 ref,但不得把 raw secret 交给 `identity-domain`、`identity-contracts` 或 application service。
- Application 只接收 injected ports、application facade、typed job parameter、safe marker 或 validated config-bound summary。
- Future secret provider 只在 adapter-local 边界解析 credential;解析结果不得写入 truth、trace、audit、outbox、projection、dead-letter、report 或 evidence。
- Secret provider 不可用、ref malformed 或 profile / adapter mode 不兼容时,必须 fail-fast、reject job 或返回正式 failed / unavailable surface,不得 fallback fake success。

### 7.3 敏感配置表

| 配置项 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 |
|---|---|---|---|---|---|
| `store.dsn_ref` | sensitive | ordinary config / env 只保存 durable store ref | 不可保存 raw DSN、SQL、credential、URL body | 新 ref 或 ref target 更新后 restart | 记录 key、source kind、profile、redacted ref digest、validation result |
| `role_catalog.snapshot_ref` | internal 或 sensitive-adjacent | 保存 role/capability source snapshot ref | 不可保存 RoleDefinition / CapabilityDefinition body;protected registry ref 不明文输出 | startup ref restart;job/reconcile 只读 redacted digest | 记录 source mode、fingerprint status、ref digest |
| `role_catalog.fixture_ref` | test-internal | local-dev / ci-test fixture ref | 不可保存 role body、capability body、secret | test startup 重新读取 | 记录 fixture digest;不得进入 non-test profile |
| `bus.endpoint_ref` | sensitive | 保存 publisher endpoint / credential ref | 不可保存 bus credential、broker URL credential、publish response body | restart 后重新解析 | 记录 publisher mode、adapter slot、ref digest、resolve status |
| `bus.topic_map_ref` | internal 或 sensitive | 保存 topic-neutral map ref;real transport registry 时 sensitive | 不可保存 raw topic secret、credential 或 payload body | restart 后校验 enabled event coverage | 记录 topic map digest、known event kind coverage |
| `operations.replay.report_root_ref` | sensitive-adjacent | replay config / job input 保存 report root ref | 不可保存 raw report secret、absolute credential path 或 raw report body | new job run 读取并冻结 | 记录 job run id、report root digest、de-identification marker |
| `operations.replay.input_root_ref` | sensitive-adjacent | replay config / job input 保存 input root ref | 不可保存 raw historical payload、raw log、raw external body | new job run 读取并冻结 | 记录 job run id、input root digest、redaction status |
| `external_refs.artifact_evidence.endpoint_ref` | sensitive | endpoint mode only;ordinary source 保存 endpoint ref | 不可保存 artifact credential、artifact body、evidence body | restart/profile update 后生效 | 记录 adapter mode、ref digest、disabled / resolved state |
| `external_refs.memory_archive.endpoint_ref` | sensitive | endpoint mode only;ordinary source 保存 endpoint ref | 不可保存 memory text、embedding、archive package、credential | restart/profile update 后生效 | 记录 adapter mode、ref digest、unavailable / resolved state |
| `external_refs.governance_basis.endpoint_ref` | sensitive | endpoint mode only;ordinary source 保存 endpoint ref | 不可保存 governance policy body、credential、decision body | restart/profile update 后生效 | 记录 adapter mode、ref digest、fail-closed reason |
| `external_refs.trace_handoff.target_ref` | sensitive | config / job input 保存 handoff target ref | 不可保存 target credential、observability ledger body、handoff package body | restart 或 new `DeliverTraceHandoff` run | 记录 target digest、job run id、handoff marker refs |
| `audit.sink_ref` | sensitive | endpoint sink mode 保存 audit / trace sink ref | 不可保存 sink credential、raw log target credential、adapter error body | restart 后重新解析 | 记录 sink mode、ref digest、compensation status |
| `audit.redaction_profile` | internal safety-critical | 保存 redaction profile name | 可保存 profile name;不可保存 raw deny value 或 allow raw body | restart;future change requires review | 记录 old/new profile、reason、validation result |
| `redline.no_auth_in_identity` | internal safety-critical | fixed true guard | 可保存 bool;false 不允许 | 不可放宽;false fail-fast | 记录 rejected attempt 和 source kind |
| `redline.ref_only_guard` | internal safety-critical | fixed true guard | 可保存 bool;false 不允许 | 不可放宽;false fail-fast | 记录 rejected attempt 和 forbidden material class |
| `redline.projection_no_write_guard` | internal safety-critical | fixed true guard | 可保存 bool;false 不允许 | 不可放宽;false fail-fast | 记录 rejected attempt |
| `redline.outbox_no_event_creation_guard` | internal safety-critical | fixed true guard | 可保存 bool;false 不允许 | 不可放宽;false fail-fast | 记录 rejected attempt |
| `redline.stored_replay_guard` | internal safety-critical | fixed true guard | 可保存 bool;false 不允许 | 不可放宽;false fail-fast | 记录 rejected attempt |
| `fixture.seed_ref` | test-internal | test config / fixture registry 保存 seed ref | 不可保存 raw seed body、secret、external body | test startup 读取 | 记录 fixture digest;仅 local-dev / ci-test |
| future raw secret material | secret | 不得进入 ordinary config;future 仅由 approved provider 承载 | 不可明文 | provider-side rotation + restart 或 future reload contract | 只记录 provider ref digest;不得记录 material |

### 7.4 Profile 敏感配置处理表

| Profile | 允许的敏感表示 | 禁止项 | 不可用策略 |
|---|---|---|---|
| `local-dev` | fake refs、in-memory refs、local fixture refs、absent optional endpoint refs | raw secret、real endpoint credential、production target、raw external body | invalid ref fail-fast;optional endpoint missing allowed only when adapter disabled |
| `ci-test` | deterministic fixture refs、CI-safe fake refs、fixed clock/id refs、captured audit sink refs | production secret、real target credential、raw fixture body in config | fixture missing test fail-fast;secret scan failure fails test |
| `integration-like` | controlled / real-like adapter refs、credential refs、endpoint refs、target refs | raw credential material、fixture fake success after controlled adapter selected、sibling body | unavailable -> degraded / delayed / rejected / failed marker according to formal flow |
| `operations-replay` | de-identified report/input root refs、historical safe refs、fake or controlled target refs | raw historical body、raw log with secrets、raw external payload、truth repair input | missing replay ref rejected;failed target enters job report |
| `staging-like` | future secret provider refs、durable store refs、transport route refs | raw secret in JSON/env、test fixture override、fake fallback | provider unavailable fail-fast or job rejected |
| `production-like` | future approved secret provider refs only | ordinary raw secret、fake override、test fixture、raw endpoint/body | provider unavailable fail-fast;no fake fallback |

### 7.5 禁止输出规则

| 输出面 | 允许输出 | 禁止输出 |
|---|---|---|
| config parse / validation error | key path、source kind、type/range/cross-field failure、profile、validation issue ref | raw value、raw secret、raw DSN、full sensitive ref、endpoint credential |
| config source summary | config section、source kind、profile、redacted digest、adapter slot、run id | full ref target、credential、secret material、external body |
| structured log | operation kind、adapter slot、profile、safe error code、failure class、correlation id、safe diagnostic ref | full sensitive ref、secret、endpoint、route、target credential、adapter raw response、fake private fixture map |
| public error response | public error code、safe message、validation issue ref、failure class | secret、full target ref、raw config value、external body、adapter error body |
| audit / trace | actor ref、operation ref、change request ref、redacted old/new digest、result class、safe metadata | raw secret、raw endpoint credential、RoleDefinition body、ProjectMember truth、memory body、artifact body |
| metric labels | low-cardinality operation、profile、adapter mode、failure class、result kind | full ref、endpoint、actor id、member id、trace id、request digest、raw error message、secret |
| outbox payload | accepted public event material and body-free marker | config secret refs outside public payload、credential、adapter route、broker payload body |
| projection row | query-safe summary、state kind、safe refs | secret、external body、Project / WorkItem / ProjectMember body、memory/archive body |
| dead-letter / quarantine | envelope marker、safe failure class、payload marker or hash when allowed | raw invalid payload if body-bearing or secret-bearing、adapter raw response |
| operations job report | run id、counts、safe item refs、redacted digests、failure class | raw historical input、raw report body、secret、target credential |
| evidence index / artifacts | artifact/report path ref、digest、status、safe failure reason | raw config file with secrets、secret provider response、raw logs containing secrets |

### 7.6 读取 / 轮换 / 审计承接表

| 敏感配置族 | Step 7 回指 | Step 5 来源规则 | Step 9 加载机制承接 | Step 10 变更审计承接 |
|---|---|---|---|---|
| durable store refs | `store.dsn_ref` | ordinary sources only carry refs | validate ref shape,profile compatibility,required durable ref,fail-fast on missing | high-risk startup config change;old/new redacted digest |
| role / capability refs | `role_catalog.snapshot_ref`,`role_catalog.fixture_ref` | protected refs only;fixture only test | validate source mode,fingerprint required,fixture profile guard | source binding change audit;fixture use stays test-scoped |
| publisher / topic refs | `bus.endpoint_ref`,`bus.topic_map_ref` | refs only;topic completeness required | validate enabled event keys,publisher mode/profile compatibility | publisher/topic binding change audit |
| operations replay refs | `operations.replay.report_root_ref`,`operations.replay.input_root_ref` | replay config / job input only | operations-replay requires de-identified refs;freeze at job-run-start | replay run audit with root digests |
| external resolver refs | `external_refs.*.endpoint_ref` | default disabled;endpoint requires refs | validate adapter mode,endpoint ref required,disabled/fail-closed semantics | adapter binding change audit per resolver family |
| handoff target refs | `external_refs.trace_handoff.target_ref` | config ref or job input ref | validate target before job;reject missing enabled target | target change and per-run target use audit |
| audit sink / redaction | `audit.sink_ref`,`audit.redaction_profile` | refs/profile only;raw sink credential forbidden | validate sink mode,redaction profile,compensation true | critical audit;unsafe relax rejected |
| redline guards | `redline.*` | defaults only or stricter file;false forbidden | validate all guards true before runtime assembly | rejected relax attempt audit |
| fixture refs | `fixture.seed_ref` | test fixture only | validate local-dev / ci-test only;fail test startup on missing seed | test evidence only,not production audit |
| future secret provider refs | no raw Step 7 item;future extension only | ordinary source may carry provider ref,not material | requires future `03` contract or adapter-local resolution | provider rotation audit without material |

### 7.7 错误模式与处理表

| 场景 | 正式处理 | 不允许的处理 |
|---|---|---|
| ordinary config includes raw secret material | config validation reject | parse as string and continue |
| env contains malformed sensitive ref | fail-fast,do not fallback to lower priority | silently ignore env and use file/default |
| endpoint mode enabled but `*_endpoint_ref` missing | startup fail-fast | silently disable adapter |
| production-like selects fake resolver/publisher/fixture | profile validation reject | fallback fake success |
| operations-replay root contains raw historical body | reject job / validation issue | replay raw body and rely on report redaction |
| topic map missing enabled event key | startup fail-fast | drop event or invent ad hoc topic |
| redline guard set to false | startup fail-fast | allow weakened runtime |
| audit redaction profile unknown | startup fail-fast | use permissive default |
| job input contains raw target credential | job rejected | store credential in job report for adapter |
| adapter returns raw external error body | map to safe failure class / issue ref | persist adapter error body |
| future secret provider unavailable | fail-fast / rejected / failed marker by profile and adapter role | fallback to test fixture in production-like |

### 7.8 敏感配置停审记录

| 配置项 / 配置族 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `store.dsn_ref` | raw DSN / credential 是否排除;restart rotation 是否明确 | 通过 | durable 产品留 P1/P2 |
| `role_catalog.snapshot_ref` / `fixture_ref` | RoleDefinition / CapabilityDefinition body 是否排除;fixture 是否 test-only | 通过 | protected snapshot 按 sensitive-adjacent |
| `bus.endpoint_ref` / `topic_map_ref` | bus credential、raw topic、publish response 是否排除 | 通过 | real transport topic map 按 sensitive |
| `operations.replay.*_ref` | raw historical body、raw log、raw report 是否排除 | 通过 | Step 12 继续承接 evidence / report root |
| `external_refs.*.endpoint_ref` | artifact/memory/governance body 和 endpoint credential 是否排除 | 通过 | default disabled / fail-closed |
| `external_refs.trace_handoff.target_ref` | target credential、handoff package body 是否排除 | 通过 | job-run-start target freeze |
| `audit.sink_ref` / `audit.redaction_profile` | audit sink secret 不进 audit;redaction profile 不放宽 | 通过 | Step 10 细化变更审计 |
| `redline.*` | guards 是否不可关闭 | 通过 | false fail-fast |
| `fixture.seed_ref` | raw fixture body / secret 是否排除 | 通过 | local-dev / ci-test only |
| raw secret material | 是否进入 ordinary config | 通过 | 明确 forbidden |
| log/error/audit/report/evidence | 是否禁止输出 sensitive / secret | 通过 | 只允许 redacted digest / issue ref |

### 7.9 跨敏感配置泄露风险审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 文档是否包含实际 secret material | 未发现 | 仅使用类别名、ref 名和 null |
| ordinary file/env 是否可保存 raw secret | 不可 | validation reject |
| entry-local / job input 是否可传 raw credential | 不可 | entry/job rejected |
| test fixture 是否可进入 production-like | 不可 | profile validation reject |
| sensitive ref 是否会进入日志 / 错误 / audit | 不应 | 只允许 redacted digest / issue ref |
| route / target / report root 是否误判 public | 已修正 | endpoint-backed / real target / replay root 按 sensitive 或 sensitive-adjacent |
| redline guard 是否可能被放宽 | 不可 | false fail-fast |
| future secret provider 是否新增 `03` 契约 | 是,若进入 P0/P1 implementation | 当前记录为未来回写点 |
| hot rotation 是否未定义却被允许 | 未允许 | P0 restart / new job run |
| external body 是否可能通过 config 入仓 | 不可 | forbidden body validation reject |
| fake private material 是否可能输出 | 不可 | fake fixture map 禁止输出 |
| 是否需要回写 `03` | 当前无 | secret provider / hot reload / product schema 需要未来回写 |

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| Step 7 标签归一为 `public` / `internal` / `internal safety-critical` / `test-internal` / `sensitive` / `secret` | 否 | 配置文档术语收敛 | 不适用 | 无回写 |
| ordinary config / env / entry-local / job input 只能保存 opaque refs,不能保存 raw secret or forbidden body | 否 | 承接 Step 5 和 `03` secret-free / body-free boundary | 不适用 | 无回写 |
| raw secret material 只允许 future provider / adapter-local 内存边界,不得进入 domain / contracts / application service | 否 | 承接 `03` config ownership 和 adapter binding | 不适用 | 无回写 |
| P0 secret / target / replay ref 轮换通过 restart 或 new job run 生效 | 否 | 承接 P0 no hot update | 不适用 | 无回写 |
| log、error、audit、trace、report、evidence 只输出 redacted digest / issue ref / safe failure class | 否 | 承接 `03` observability / redaction | 不适用 | 无回写 |
| 若后续要求 secret provider trait、hot secret rotation、runtime reload、admin override、product endpoint schema 或 credential refresh error | 是 | runtime config / builder / adapter constructor / error / audit rollback contract | `03` §13~§15 或对应 object-port-flow Step | 阻塞待确认 |

## 9. 回填草稿

正式 `04-配置设计.md` §8 可回填:

```md
## 8. 敏感配置与密钥管理

> 校准来源:
> - `design-calibration/04_config_step_08_sensitive_secrets.md`

`L1-identity` 的普通 JSON config、environment variables、entry-local parameters、job input 和 test fixture 只能保存 opaque refs 或 safe selectors,不得保存 raw DSN、password、token、private key、cert body、raw endpoint credential、RoleDefinition / CapabilityDefinition body、Project / WorkItem / ProjectMember body、memory body、archive package、artifact body、broker payload body、adapter raw response 或 historical raw replay body。

敏感配置按 `public`、`internal`、`internal safety-critical`、`test-internal`、`sensitive`、`sensitive-adjacent`、`secret` 分级。`store.dsn_ref`、endpoint-backed adapter refs、real topic / target refs 和 audit sink refs 按 sensitive 处理;operations replay report/input roots 按 sensitive-adjacent 处理;redline guards 和 redaction profile 按 internal safety-critical 处理;fixture refs 只能用于 `local-dev` / `ci-test`。

P0 不支持 hot secret rotation、config center 或 admin override。startup sensitive refs 通过更新 ref / ref target 后 restart 生效;job-run-start refs 通过 new job run 生效。日志、错误、审计、trace、report 和 evidence 只允许输出 key path、source kind、profile、adapter slot、run id、safe failure class、redacted digest 或 validation issue ref。
```

## 10. 待确认事项

| 编号 | 待确认事项 | 影响 | 当前处理 |
|---|---|---|---|
| ID-CONFIG-Q31 | future secret provider 产品和 ref scheme 是否统一 | 影响 P1/P2 deployment / operations | P0 product-neutral,Step 13 / 14 记录演进 |
| ID-CONFIG-Q32 | 是否需要正式 `SecretResolverPort`、config secret provider trait 或 adapter credential refresh error | 影响 `03` port / runtime builder / error | 当前不新增;未来启用需回写 `03` |
| ID-CONFIG-Q33 | operations replay report/input root 的脱敏证明格式 | 影响 `05/06/07` evidence、report 和 run artifact | Step 12 下游承接,不在 Step 8 定义测试编号 |
| ID-CONFIG-Q34 | redaction profile / redline guard 变更是否需要审批等级 | 影响 Step 10 change audit / rollback | Step 10 定义 |
| ID-CONFIG-Q35 | route / target / fixture ref 的 redacted digest 算法是否需要固定 | 影响 Step 9 validation 和 Step 10 audit | Step 9/10 定义语义;若要代码算法,需回写 `03` |
| ID-CONFIG-Q36 | hot secret rotation 是否进入后续路线 | 影响 runtime reload、rollback、audit 和 adapter state | P0 不支持;未来需 ADR / `03` 回写 |

## 11. 进入下一步条件

- 敏感配置项已覆盖 Step 7 的 sensitive、ref-sensitive、security-critical 和 test fixture 配置项。
- secret / sensitive / internal safety-critical / test-internal 级别已归一。
- 存储方式、明文禁止、读取边界、轮换方式和审计要求已定义。
- 禁止输出规则已覆盖 config parse error、log、error、audit、trace、metric、outbox、projection、dead-letter、operations report 和 evidence。
- profile sensitive handling 已覆盖 `local-dev`、`ci-test`、`integration-like`、`operations-replay`、`staging-like`、`production-like`。
- 敏感配置停审和跨敏感配置泄露风险审计没有 unresolved 冲突。
- 对 `03-详细设计.md` 的影响判定已记录,当前无必须回写项。
- 未提前定义 secret provider API、env var 名、真实 endpoint、credential、runtime reload、port、DTO、error、测试编号、evidence 路径或实施 boundary。

下一步进入 Step 9:定义配置加载、校验与生效机制。
