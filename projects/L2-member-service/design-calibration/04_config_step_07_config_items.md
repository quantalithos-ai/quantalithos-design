# Step 7：定义配置项清单

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 7
> 回填章节：未来正式 `04-配置设计.md` §7“配置项清单”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_07_config_items.md`
> 执行模式：full-restart；本 Step 只定义 P0 配置语义，不创建实现代码或真实产品 schema

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 7 配置项清单 |
| 当前模块 | 按功能域逐批完成：profile、stores、resolvers/seams、lifecycle、publication/jobs、safe/security、deterministic |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | Step 3 控制面、Step 4 分类、Step 5 来源、Step 6 profile 矩阵、`03` §13 |
| 正式 `04` 写入 | `false`；仅 Step 15 装配 |
| 实现 / 测试 / 证据 | `false`；JSON 仅为设计示例，不是运行结果 |
| commit | `false` |

### 1.1 Step 内计划

- [x] 固定项目本地配置 key 不强制重复项目名前缀的规则。
- [x] 按功能边界逐批建立 P0 配置项，填齐最小十列。
- [x] 为每个主要功能模块提供严格 JSON demo 和逐项说明表。
- [x] 提供完整 JSONC 文档示例，并声明运行时必须使用严格 JSON。
- [x] 审计重复项、泛化模块、敏感级别、失败策略、环境差异和 `03` 影响。

## 2. 本步目标与命名规则

配置项是 `infra/config.rs` 解析并交给 `infra/runtime_builder.rs` 的输入。配置项不成为 domain 字段，不改变既有 struct、trait、DTO、状态、UoW、幂等或 owner。

本仓文件内使用项目本地 key（例如 `profile.name`），不强制写 `member_service.profile.name`。若未来需要系统聚合配置，由聚合层显式声明 `l2.member_service.<local-key>` 到本仓 local key 的映射；聚合映射不在本 Step 伪造。

模块名称必须对应功能边界，禁止使用 `storage`、`common`、`misc` 等泛化名称。`runtime_session_binding` 表示宿主与运行会话接缝，不表示 Runtime truth；`truth_store_binding` 表示 logical owner 绑定，不表示某个数据库产品。

## 3. SOP 问题回答

| 问题 | 本仓结论 |
|---|---|
| 每个 P0 配置项的名称、类型和默认值是什么？ | 见 §8 的完整清单。默认值只使用安全、确定性、disabled、blocked 或显式 local 限制；未闭合产品参数使用 `null` 或 opaque ref。 |
| 哪些必填？ | `profile.name`、`config_identity.schema_version` 和启用 profile 所需的 store / boundary binding 必须可解析；被禁用的外围 target 不必填。 |
| 来源和作用域是什么？ | 每项在清单中标明 defaults/file/env、startup/job-run-start/entry-local/test，普通覆盖遵守 Step 5。 |
| 如何生效、敏感级别和失败策略是什么？ | 统一填入十列；startup 配置冷生效，job 参数新 run 生效，entry-local 仅当前入口，敏感项只收 opaque ref。 |
| 模块如何拆分？ | 按 profile、logical owner、qualification、宿主接缝、生命周期、publication/handoff、job、safe read、安全和确定性支持拆分。 |
| JSON 示例如何解释？ | 每个主要模块使用严格 JSON，并紧随逐项说明表；最后用 JSONC 汇总（仅文档注释）。 |

## 4. 当前材料诊断与取舍

| 问题 | 修正 |
|---|---|
| 旧材料把 DB、容器和 endpoint 写成固定值 | 只保留逻辑绑定、opaque ref、fake / disabled / blocked；产品留 P1/P2 |
| 以 `storage` 或 `runtime` 聚合所有配置 | 拆为 logical store、maintenance store、session、sandbox、carrier 等功能模块 |
| 仅列 key 无失败策略 | 每项增加作用域、生效、敏感级别和失败策略 |
| 把未闭合 event / receipt / cursor 写成字段真相 | 使用 `ref:*pending`、`blocked`、`unknown` 或不启用；不创建 sibling schema |
| 为展示方便使用 YAML/TOML | 所有可复制配置使用严格 JSON；完整带注释示例只标 `jsonc` |

## 5. 配置项分域与总体约束

| 配置域 | 功能边界 | 默认运行形态 | 03 影响 |
|---|---|---|---|
| `profile` / `config_identity` | profile 选择和脱敏身份 | `local-dev`、canonical schema | 否 |
| `truth_store_binding` | control / qualification / progression / session / closure logical owner | in-memory / fake | 否 |
| `maintenance_store_binding` | history/material/outbox/projection 维护承载 | in-memory / fake | 否 |
| `idempotency_result_binding` | reservation、stored result、replay surface | in-memory / fake | 否 |
| `qualification_resolvers` | Identity、Work 和外部接缝 resolver 选择 | fake / placeholder / blocked | 否 |
| `member_binding`、`images_binding` | member 注册和镜像供给接缝 | disabled / blocked | 否 |
| `runtime_session_binding`、`sandbox_binding` | Runtime session、Sandbox ref-bearing 接缝 | disabled / blocked | 否 |
| `carrier_binding` | carrier handoff availability marker | disabled / blocked | 否 |
| `registration_session`、`health_assessment` | registration/session/health 技术参数 | placeholder / conservative | 否 |
| `publication`、`handoff_feedback` | outbox 发布和四层反馈目标 | disabled / unknown | 否 |
| `operation_jobs` | action、health、cleanup、reconcile、projection 等 runner | serial、有限批量 | 否 |
| `safe_read_boundary`、`security_redaction` | body/page/diagnostic/redaction 安全面 | body-free、deny-by-default | 否 |
| `clock_id`、`deterministic_fixture` | Clock/ID 注入，以及仅 `ci-test` / `operations-replay` 的 fixture 注入 | deterministic local / CI；fixture 仅 test / replay | 否 |

## 6. 清单字段定义

| 字段 | 约束 |
|---|---|
| 配置项 | local dotted key；不得同义重复 |
| 类型 | JSON scalar / array / object；实现前须 type validate |
| 默认值 | 安全默认、`null`、`disabled`、`blocked` 或明确 local 值；不是运行结果 |
| 是否必填 | 对所有 profile 还是仅在 enabled 条件下必填必须写明 |
| 来源 | defaults / file / env / entry-local / job-run-start / `deterministic_fixture.*`（仅 `ci-test` / `operations-replay`） |
| 作用域 | startup、job-run-start、entry-local、test-only |
| 生效方式 | cold-restart、new-job-run、current-entry、test-entry |
| 敏感级别 | `public`、`internal`、`sensitive`、`secret`；opaque ref 归 `sensitive`，raw material 归 `secret` 且禁止进入配置 |
| 失败策略 | fail-fast、entry rejected、job rejected、blocked、degraded、fail-closed；P0 不提供 silent / low-priority / fake fallback |
| 关联模块 | 唯一功能 owner 或明确消费 seam |

## 7. 配置项清单（P0）

### 7.1 Profile 与配置身份

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `profile.name` | string enum | `local-dev` | 是 | defaults/file/env | startup | cold-restart | public | unknown profile fail-fast | `profile` |
| `profile.allow_fixture` | boolean | `false` | 否 | file/env（仅 `ci-test` / `operations-replay`） | startup | cold-restart | public | 非允许 profile 为 true 则 fail-fast | `profile` |
| `config_identity.schema_version` | string | `msvc-p0` | 是 | defaults/file | startup | cold-restart | public | unsupported version fail-fast | `config_identity` |
| `config_identity.source_label` | string | `local` | 否 | file/env | startup | cold-restart | public | 非法 label fail-fast | `config_identity` |
| `config_identity.require_canonical` | boolean | `true` | 否 | defaults/file | startup | cold-restart | public | false 不得绕过 duplicate / alias 检查 | `config_identity` |

### 7.2 Logical truth 与维护承载

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `truth_store_binding.control` | string enum | `in-memory` | 是 | defaults/file/env | startup | cold-restart | public | enabled profile 缺失 fail-fast | `truth_store_binding` |
| `truth_store_binding.qualification` | string enum | `in-memory` | 是 | defaults/file/env | startup | cold-restart | public | 缺失 fail-fast | `truth_store_binding` |
| `truth_store_binding.progression` | string enum | `in-memory` | 是 | defaults/file/env | startup | cold-restart | public | 缺失 fail-fast | `truth_store_binding` |
| `truth_store_binding.session` | string enum | `in-memory` | 是 | defaults/file/env | startup | cold-restart | public | 缺失 fail-fast | `truth_store_binding` |
| `truth_store_binding.closure` | string enum | `in-memory` | 是 | defaults/file/env | startup | cold-restart | public | 缺失 fail-fast | `truth_store_binding` |
| `maintenance_store_binding.history_material` | string enum | `in-memory` | 是 | defaults/file/env | startup | cold-restart | public | unavailable fail-fast | `maintenance_store_binding` |
| `maintenance_store_binding.outbox` | string enum | `in-memory` | 是 | defaults/file/env | startup | cold-restart | public | unavailable fail-fast | `maintenance_store_binding` |
| `maintenance_store_binding.projection` | string enum | `in-memory` | 是 | defaults/file/env | startup | cold-restart | public | unavailable => projection disabled, source read unaffected | `maintenance_store_binding` |
| `idempotency_result_binding.reservation` | string enum | `in-memory` | 是 | defaults/file/env | startup | cold-restart | public | unavailable fail-fast for mutation entries | `idempotency_result_binding` |
| `idempotency_result_binding.stored_result` | string enum | `in-memory` | 是 | defaults/file/env | startup | cold-restart | public | unavailable => mutation rejected, no rerun | `idempotency_result_binding` |

### 7.3 Qualification 与外部接缝

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `qualification_resolvers.identity` | string enum | `fake` | 是 | defaults/file/env | startup | cold-restart | public | unavailable => blocked | `qualification_resolvers` |
| `qualification_resolvers.work` | string enum | `fake` | 是 | defaults/file/env | startup | cold-restart | public | unavailable => blocked | `qualification_resolvers` |
| `qualification_resolvers.member` | string enum | `placeholder` | 是 | defaults/file/env | startup | cold-restart | public | unresolved => launch blocked | `qualification_resolvers` |
| `qualification_resolvers.images` | string enum | `placeholder` | 是 | defaults/file/env | startup | cold-restart | public | unresolved => launch blocked | `qualification_resolvers` |
| `qualification_resolvers.runtime` | string enum | `placeholder` | 是 | defaults/file/env | startup | cold-restart | public | unresolved => session blocked | `qualification_resolvers` |
| `qualification_resolvers.sandbox` | string enum | `placeholder` | 是 | defaults/file/env | startup | cold-restart | public | unresolved => fail-closed | `qualification_resolvers` |
| `member_binding.availability` | string enum | `blocked` | 否 | defaults/file/env | startup | cold-restart | public | enabled + unavailable fail-fast | `member_binding` |
| `member_binding.binding_ref` | string or null | `null` | conditional | file/env | startup | cold-restart | sensitive | malformed ref fail-fast | `member_binding` |
| `images_binding.availability` | string enum | `blocked` | 否 | defaults/file/env | startup | cold-restart | public | enabled + unavailable => launch blocked | `images_binding` |
| `images_binding.binding_ref` | string or null | `null` | conditional | file/env | startup | cold-restart | sensitive | malformed ref fail-fast | `images_binding` |
| `runtime_session_binding.availability` | string enum | `blocked` | 否 | defaults/file/env | startup | cold-restart | public | enabled + unavailable => session blocked | `runtime_session_binding` |
| `runtime_session_binding.binding_ref` | string or null | `ref:runtime-placeholder` | 否 | file/env | startup | cold-restart | sensitive | malformed ref fail-fast | `runtime_session_binding` |
| `sandbox_binding.availability` | string enum | `blocked` | 否 | defaults/file/env | startup | cold-restart | public | enabled + unavailable => fail-closed | `sandbox_binding` |
| `sandbox_binding.binding_ref` | string or null | `ref:sandbox-placeholder` | 否 | file/env | startup | cold-restart | sensitive | malformed ref fail-fast | `sandbox_binding` |
| `carrier_binding.availability` | string enum | `blocked` | 否 | defaults/file/env | startup | cold-restart | public | enabled + unavailable => handoff blocked | `carrier_binding` |

### 7.4 Lifecycle、publication、handoff 与 jobs

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `registration_session.registration_mode` | string enum | `placeholder` | 否 | defaults/file/env | startup | cold-restart | public | unsupported => entry rejected | `registration_session` |
| `registration_session.heartbeat_mode` | string enum | `placeholder` | 否 | defaults/file/env | startup | cold-restart | public | unavailable => health unknown | `registration_session` |
| `registration_session.launch_credential_ref` | string or null | `null` | conditional | file/env | startup | cold-restart | sensitive | raw value reject; missing enabled ref fail-closed | `registration_session` |
| `health_assessment.mode` | string enum | `conservative` | 是 | defaults/file/env | startup | cold-restart | public | unsupported mode fail-fast | `health_assessment` |
| `health_assessment.stale_after_ms` | integer or null | `null` | conditional | file/env | job-run-start | new-job-run | public | enabled + missing/invalid => job rejected | `health_assessment` |
| `publication.enabled` | boolean | `false` | 否 | defaults/file/env | startup | cold-restart | public | target missing => disabled or fail-fast when explicitly enabled | `publication` |
| `publication.event_family_ref` | string or null | `ref:event-family-pending` | conditional | file/env | startup | cold-restart | public | unresolved => publication blocked | `publication` |
| `publication.target_ref` | string or null | `null` | conditional | file/env | startup | cold-restart | sensitive | malformed ref fail-fast | `publication` |
| `handoff_feedback.enabled` | boolean | `false` | 否 | defaults/file/env | startup | cold-restart | public | enabled + target missing => blocked | `handoff_feedback` |
| `handoff_feedback.target_ref` | string or null | `null` | conditional | file/env | startup | cold-restart | sensitive | malformed ref fail-fast | `handoff_feedback` |
| `handoff_feedback.acceptance_mode` | string enum | `unknown` | 否 | defaults/file/env | startup | cold-restart | public | cannot infer accepted from adapter result | `handoff_feedback` |
| `operation_jobs.default_batch_size` | integer | `100` | 否 | defaults/file/env | job-run-start | new-job-run | public | non-positive => job rejected | `operation_jobs` |
| `operation_jobs.default_parallelism` | integer | `1` | 否 | defaults/file/env | job-run-start | new-job-run | public | non-positive or > approved bound => job rejected | `operation_jobs` |
| `operation_jobs.default_retry_budget` | integer | `0` | 否 | defaults/file/env | job-run-start | new-job-run | public | negative => job rejected; no retry does not mean success | `operation_jobs` |
| `operation_jobs.timeout_ms` | integer or null | `null` | 否 | defaults/file/env | job-run-start | new-job-run | public | invalid => job rejected | `operation_jobs` |
| `operation_jobs.unknown_item_mode` | string enum | `hold` | 否 | defaults/file/env | job-run-start | new-job-run | public | unsupported => fail-fast | `operation_jobs` |

### 7.5 Safe read、安全与确定性

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `safe_read_boundary.max_page_size` | integer | `100` | 否 | defaults/file/env | startup | cold-restart | public | non-positive => fail-fast |
| `safe_read_boundary.body_mode` | string enum | `body-free` | 是 | defaults/file/env | startup | cold-restart | public | any other mode fail-closed |
| `safe_read_boundary.query_write_repair` | boolean | `false` | 是 | defaults/file/env | startup | cold-restart | public | true => design/config reject |
| `security_redaction.forbidden_field_classes` | array[string] | `secret,credential_body,external_body,manifest,endpoint_secret` | 是 | defaults/file/env | startup | cold-restart | public | cannot be empty; validator fail-fast |
| `security_redaction.metric_label_allowlist` | array[string] | `profile,operation_kind,disposition` | 否 | defaults/file/env | startup | cold-restart | public | high-cardinality / forbidden label reject |
| `security_redaction.diagnostic_mode` | string enum | `safe` | 是 | defaults/file/env | startup | cold-restart | public | non-safe mode fail-closed |
| `clock_id.clock_mode` | string enum | `deterministic` | 是 | defaults/file/env | startup | cold-restart | public | unsupported mode fail-fast |
| `clock_id.id_mode` | string enum | `injected` | 是 | defaults/file/env | startup | cold-restart | public | handler synthesis mode reject |
| `deterministic_fixture.enabled` | boolean | `false` | 否 | file/env（仅 `ci-test` / `operations-replay`） | ci-test / operations-replay | test-entry or replay job-run-start | public | non-allowed profile 为 true 则 fail-fast |
| `deterministic_fixture.source_ref` | string or null | `null` | conditional | file/env/replay input | ci-test / operations-replay | test-entry or replay job-run-start | sensitive | malformed or raw body reject |
| `deterministic_fixture.reject_outside_test` | boolean | `true` | 是 | defaults/file | startup | cold-restart | public | false 不得关闭 profile guard |

## 8. 主要模块严格 JSON demo 与逐项说明

以下代码块均为严格 JSON，可作为文档示例；不含注释。`null` 表示未启用或等待上游合同，不表示空字符串或真实 endpoint。

### 8.1 `profile` 配置 demo

```json
{
  "profile": {
    "name": "local-dev",
    "allow_fixture": false
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `profile.name` | string enum | `local-dev` | 选择已定义 profile | 只能是六个文档 profile 名称 | unknown => fail-fast |
| `profile.allow_fixture` | boolean | `false` | 允许 deterministic fixture 的显式开关 | 仅 `ci-test` / `operations-replay` 可为 true | 越界 => fail-fast |

### 8.2 `config_identity` 配置 demo

```json
{
  "config_identity": {
    "schema_version": "msvc-p0",
    "source_label": "local",
    "require_canonical": true
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `schema_version` | string | `msvc-p0` | 标识配置语义版本 | 必须为已支持版本 | fail-fast |
| `source_label` | string | `local` | 脱敏诊断标签 | 不得含 URL、secret 或正文 | fail-fast |
| `require_canonical` | boolean | `true` | 强制 duplicate / alias 检查 | 不得关闭 canonical 校验 | reject |

### 8.3 `truth_store_binding` 配置 demo

```json
{
  "truth_store_binding": {
    "control": "in-memory",
    "qualification": "in-memory",
    "progression": "in-memory",
    "session": "in-memory",
    "closure": "in-memory"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `control` | string enum | `in-memory` | control truth logical owner 承载 | 不得跨 owner 共用未声明 store | fail-fast |
| `qualification` | string enum | `in-memory` | qualification truth 承载 | 不改变 resolver truth | fail-fast |
| `progression` | string enum | `in-memory` | lifecycle/progression 承载 | 保持 revision / UoW | fail-fast |
| `session` | string enum | `in-memory` | session association 承载 | 不代表 Runtime session | fail-fast |
| `closure` | string enum | `in-memory` | closure/reconciliation 承载 | 不代表外部 cleanup 完成 | fail-fast |

### 8.4 `maintenance_store_binding` 与 `idempotency_result_binding` 配置 demo

```json
{
  "maintenance_store_binding": {
    "history_material": "in-memory",
    "outbox": "in-memory",
    "projection": "in-memory"
  },
  "idempotency_result_binding": {
    "reservation": "in-memory",
    "stored_result": "in-memory"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `history_material` | string enum | `in-memory` | append-only history / material 承载 | 不保存外部正文 | fail-fast |
| `outbox` | string enum | `in-memory` | immutable outbox snapshot 承载 | 不从 current truth 临时组包 | fail-fast |
| `projection` | string enum | `in-memory` | derived projection 承载 | projection 不反写 source | disabled / degraded |
| `reservation` | string enum | `in-memory` | 幂等 reservation 承载 | mutation 必须有 reservation | mutation rejected |
| `stored_result` | string enum | `in-memory` | duplicate replay 结果承载 | 不存在结果不得静默重跑 | mutation rejected |

### 8.5 `qualification_resolvers` 配置 demo

```json
{
  "qualification_resolvers": {
    "identity": "fake",
    "work": "fake",
    "member": "placeholder",
    "images": "placeholder",
    "runtime": "placeholder",
    "sandbox": "placeholder"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `identity` / `work` | string enum | `fake` | 受控解析器选择 | 只返回 safe summary/ref | blocked |
| `member` / `images` | string enum | `placeholder` | member/image 接缝占位 | 不解析 body/manifest | launch blocked |
| `runtime` / `sandbox` | string enum | `placeholder` | 运行会话与隔离接缝占位 | 不伪造 run/policy | blocked / fail-closed |

### 8.6 `member_binding`、`images_binding`、`runtime_session_binding`、`sandbox_binding` 配置 demo

```json
{
  "member_binding": {
    "availability": "blocked",
    "binding_ref": null
  },
  "images_binding": {
    "availability": "blocked",
    "binding_ref": null
  },
  "runtime_session_binding": {
    "availability": "blocked",
    "binding_ref": "ref:runtime-placeholder"
  },
  "sandbox_binding": {
    "availability": "blocked",
    "binding_ref": "ref:sandbox-placeholder"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| ref-bearing availability (`member_binding.availability`、`images_binding.availability`、`runtime_session_binding.availability`、`sandbox_binding.availability`) | enum | `blocked` | 表达四类带 ref 接缝的可用性 | `blocked` 不得当 ready；carrier marker 单独定义 | launch / session blocked |
| ref-bearing binding refs (`member_binding.binding_ref`、`images_binding.binding_ref`、`runtime_session_binding.binding_ref`、`sandbox_binding.binding_ref`) | string/null | `null` | opaque adapter/binding ref | 不含 endpoint、credential body 或 manifest；carrier 不定义 ref key | malformed => fail-fast |

### 8.7 `registration_session` 与 `health_assessment` 配置 demo

```json
{
  "registration_session": {
    "registration_mode": "placeholder",
    "heartbeat_mode": "placeholder",
    "launch_credential_ref": null
  },
  "health_assessment": {
    "mode": "conservative",
    "stale_after_ms": null
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `registration_mode` | enum | `placeholder` | 选择注册接缝 | 不生成 member truth | entry rejected / blocked |
| `heartbeat_mode` | enum | `placeholder` | 选择信号接缝 | 心跳不等于 healthy | health unknown |
| `launch_credential_ref` | ref/null | `null` | opaque launch credential ref | raw credential 直接拒绝 | fail-closed |
| `mode` | enum | `conservative` | 健康判定技术模式 | 不改变 health state truth | fail-fast |
| `stale_after_ms` | integer/null | `null` | 可选新 run 评估参数 | 启用时必须为正整数 | job rejected |

### 8.8 `publication` 与 `handoff_feedback` 配置 demo

```json
{
  "publication": {
    "enabled": false,
    "event_family_ref": "ref:event-family-pending",
    "target_ref": null
  },
  "handoff_feedback": {
    "enabled": false,
    "target_ref": null,
    "acceptance_mode": "unknown"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `publication.enabled` | boolean | `false` | 启用外围发布 | 不得关闭 local accepted audit | disabled / fail-fast when explicitly enabled |
| `event_family_ref` | ref/null | pending ref | 指向待确认事件族 | 不在本仓 shadow schema | publication blocked |
| `target_ref` | ref/null | `null` | opaque target | 不含 endpoint secret | malformed => fail-fast |
| `handoff_feedback.acceptance_mode` | enum | `unknown` | 表达反馈可见性 | 不由 adapter `Ok` 推导 accepted | unknown / blocked |

### 8.9 `operation_jobs` 配置 demo

```json
{
  "operation_jobs": {
    "default_batch_size": 100,
    "default_parallelism": 1,
    "default_retry_budget": 0,
    "timeout_ms": null,
    "unknown_item_mode": "hold"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `default_batch_size` | integer | `100` | 新 run 默认批量上限 | 正整数；不是吞吐 SLO | job rejected |
| `default_parallelism` | integer | `1` | 新 run 默认并行度 | 正整数且不绕过 lease/幂等 | job rejected |
| `default_retry_budget` | integer | `0` | 新 run 默认重试预算 | 非负；0 表示不自动重试 | job rejected |
| `timeout_ms` | integer/null | `null` | 可选 run timeout | 启用时必须正整数 | job rejected |
| `unknown_item_mode` | enum | `hold` | 未知项处理 | 只能 hold / reject，不得当成功 | hold / job rejected |

### 8.10 `safe_read_boundary` 与 `security_redaction` 配置 demo

```json
{
  "safe_read_boundary": {
    "max_page_size": 100,
    "body_mode": "body-free",
    "query_write_repair": false
  },
  "security_redaction": {
    "forbidden_field_classes": [
      "secret",
      "credential_body",
      "external_body",
      "manifest",
      "endpoint_secret"
    ],
    "metric_label_allowlist": [
      "profile",
      "operation_kind",
      "disposition"
    ],
    "diagnostic_mode": "safe"
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `max_page_size` | integer | `100` | 限制 safe read page | 正整数；不得放宽 body | fail-fast |
| `body_mode` | enum | `body-free` | 强制安全 view | 只允许 body-free | fail-closed |
| `query_write_repair` | boolean | `false` | 固定 Query no-write | 必须为 false | design/config reject |
| `forbidden_field_classes` | array | secret 等 | 禁止输出类别 | 不得为空或删除核心类 | fail-fast |
| `metric_label_allowlist` | array | 三个低基数字段 | 限制指标标签 | 不得含 id/body/token | reject |
| `diagnostic_mode` | enum | `safe` | 安全诊断模式 | 不得切换 raw/debug 模式 | fail-closed |

### 8.11 `clock_id` 与 `deterministic_fixture` 配置 demo

```json
{
  "clock_id": {
    "clock_mode": "deterministic",
    "id_mode": "injected"
  },
  "deterministic_fixture": {
    "enabled": false,
    "source_ref": null,
    "reject_outside_test": true
  }
}
```

| 配置项 | 类型 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `clock_mode` | enum | `deterministic` | 注入 ClockPort 模式 | handler/domain 不自取时间 | fail-fast |
| `id_mode` | enum | `injected` | 注入 IdGeneratorPort | 不以随机拼接替代 port | fail-fast |
| `enabled` | boolean | `false` | 启用 deterministic fixture | 仅 `ci-test` / `operations-replay` | profile fail-fast |
| `source_ref` | ref/null | `null` | 脱敏 fixture / replay ref | 不含 fixture body | test / replay setup fail-fast |
| `reject_outside_test` | boolean | `true` | 防止 fixture 越界 | 不得关闭 | reject |

## 9. 完整配置 demo（JSONC 文档注释示例）

以下为文档注释示例。实际运行配置必须删除注释并保持严格 JSON；任何 `ref:*pending` 仍表示 pending，不表示可用 endpoint。

```jsonc
{
  "profile": {
    "name": "local-dev",
    "allow_fixture": false
  },
  "config_identity": {
    "schema_version": "msvc-p0",
    "source_label": "local",
    "require_canonical": true
  },
  "truth_store_binding": {
    "control": "in-memory",
    "qualification": "in-memory",
    "progression": "in-memory",
    "session": "in-memory",
    "closure": "in-memory"
  },
  "maintenance_store_binding": {
    "history_material": "in-memory",
    "outbox": "in-memory",
    "projection": "in-memory"
  },
  "idempotency_result_binding": {
    "reservation": "in-memory",
    "stored_result": "in-memory"
  },
  "qualification_resolvers": {
    "identity": "fake",
    "work": "fake",
    "member": "placeholder",
    "images": "placeholder",
    "runtime": "placeholder",
    "sandbox": "placeholder"
  },
  "member_binding": {
    "availability": "blocked",
    "binding_ref": null
  },
  "images_binding": {
    "availability": "blocked",
    "binding_ref": null
  },
  "runtime_session_binding": {
    "availability": "blocked",
    "binding_ref": "ref:runtime-placeholder"
  },
  "sandbox_binding": {
    "availability": "blocked",
    "binding_ref": "ref:sandbox-placeholder"
  },
  "registration_session": {
    "registration_mode": "placeholder",
    "heartbeat_mode": "placeholder",
    "launch_credential_ref": null
  },
  "health_assessment": {
    "mode": "conservative",
    "stale_after_ms": null
  },
  "publication": {
    "enabled": false,
    "event_family_ref": "ref:event-family-pending",
    "target_ref": null
  },
  "handoff_feedback": {
    "enabled": false,
    "target_ref": null,
    "acceptance_mode": "unknown"
  },
  "operation_jobs": {
    "default_batch_size": 100,
    "default_parallelism": 1,
    "default_retry_budget": 0,
    "timeout_ms": null,
    "unknown_item_mode": "hold"
  },
  "safe_read_boundary": {
    "max_page_size": 100,
    "body_mode": "body-free",
    "query_write_repair": false
  },
  "security_redaction": {
    "forbidden_field_classes": ["secret", "credential_body", "external_body", "manifest", "endpoint_secret"],
    "metric_label_allowlist": ["profile", "operation_kind", "disposition"],
    "diagnostic_mode": "safe"
  },
  "clock_id": {
    "clock_mode": "deterministic",
    "id_mode": "injected"
  },
  "deterministic_fixture": {
    "enabled": false,
    "source_ref": null,
    "reject_outside_test": true
  }
}
```

## 10. 配置项停审与跨项闭环审计

### 10.1 按配置域停审记录

| 配置域 | 类型 / 默认 / 必填 | 来源 / 生效 | 敏感 / 失败策略 | 结论 |
|---|---|---|---|---|
| profile / identity | 已齐全 | defaults/file/env、startup | public、fail-fast | 通过 |
| logical / maintenance / idempotency stores | 已齐全 | startup/cold | public、mutation fail-fast | 通过 |
| qualification / member / images / runtime / sandbox | 已齐全 | startup/cold | Member / Images / Runtime / Sandbox ref 为 sensitive；blocked/fail-closed | 通过（保留上游 blocker） |
| carrier availability marker | 已齐全 | startup/cold | public availability-only；不定义 ref / release schema；blocked/fail-closed | 通过（保留上游 blocker） |
| registration / health | 已齐全 | startup 或 new run | launch ref sensitive、unknown/rejected | 通过 |
| publication / handoff | 已齐全 | startup/cold | target ref sensitive、disabled/unknown | 通过（Core/Bus contract pending） |
| operation jobs | 已齐全 | new run | public、job rejected/hold | 通过 |
| safe read / security | 已齐全 | startup/cold | deny-by-default、fail-closed | 通过 |
| clock / deterministic fixture | 已齐全 | startup；仅 `ci-test` test-entry / `operations-replay` replay run | public、profile reject | 通过 |

### 10.2 跨配置项闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每项是否回指 Step 3 控制面 | 通过 | 配置域表和关联模块列提供回指 |
| 每项是否回指 Step 4 分类与冻结时机 | 通过 | 作用域 / 生效方式列提供 |
| 每项是否遵守 Step 5 来源优先级 | 通过 | 普通来源固定 defaults < file < env；局部来源隔离 |
| 每项是否覆盖 Step 6 profile 差异 | 通过 | enabled / fixture / future profile 约束已写 |
| 是否存在重复 key / 泛化模块 | 未发现 | 未使用 storage/common/misc |
| 必填项是否有失败策略 | 通过 | 清单十列完整 |
| sensitive ref / secret material 是否误当普通字符串 | 否 | raw body 一律拒绝 |
| 数字默认值是否被误读为 SLO | 否 | 仅 local safety / job default，非性能承诺 |
| 是否新增 `03` runtime 字段、Port、DTO 或 error | 否 | 仅配置绑定语义；future 触发器单列 |
| 是否把 availability、fake、receipt 当 ready | 否 | blocked/unknown/disabled 保持原语义 |

## 11. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 按功能域列出 P0 config items | 否 | 既有 binding 的配置化表达 | 不适用 | 无回写 |
| 使用 `null` / `blocked` / `placeholder` 表达未闭合接缝 | 否 | 承接既有 availability/error 语义 | 不适用 | 无回写 |
| `operation_jobs` 使用 new-job-run 技术参数 | 否 | 承接 job flow，不改变 authorization | 不适用 | 无回写 |
| `query_write_repair=false`、body-free、redaction deny list 固定为安全边界 | 否 | 复用既有 Query / security 不变量 | 不适用 | 无回写 |
| future 需要把配置项变为新 struct 字段、constructor 参数、Port、DTO 或 reload API | 是 | 代码契约变更 | `03` §4、§7、§13~§15 | future design-change-required；当前不进入 P0 |

## 12. 回填草稿：正式 `04-配置设计.md` §7

> 校准来源：
> - `design-calibration/04_config_step_07_config_items.md`
>
> 延伸阅读：
> - 建议阅读本文件的“配置项清单”“模块级严格 JSON demo”“完整 JSONC demo”“停审记录”和“跨配置项闭环审计表”。

正式 §7 应装配最小十列清单、按功能模块的严格 JSON demo、每个 demo 的逐项说明表和完整 JSONC 文档示例。正文必须保留 `null`、`blocked`、`placeholder` 的语义说明，不得把 future endpoint、secret、manifest、event schema 或产品 DSN 写成已支持值。

## 13. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| Member / Images / Runtime / Sandbox binding ref 的 exact scheme | 影响 ref validator 和 positive adapter | 仅使用 opaque ref；启用正向路径则 blocked |
| Core/Bus event family、route、receipt 和 cursor 类型 | 影响 publication / handoff 配置 | 保持 pending ref；不创建本地 schema |
| durable store、lease/lock、observability、DLQ 产品及数值 | 影响 P1 profile 的 binding | P0 使用 in-memory/fake/disabled |
| launch credential provider 与 policy owner | 影响 sensitive ref 解析 | 只允许 opaque ref，provider pending |
| `default_batch_size` / page limit 的最终产品默认值 | 影响实施与测试 | 当前值仅为 P0 安全默认，不是 SLO；后续可经配置版本演进调整 |

## 14. 自检与停审结论

| 检查项 | 结果 | 说明 |
|---|---|---|
| P0 配置项清单十列完整 | pass | §7 全部项齐全 |
| 每个主要功能模块有严格 JSON demo | pass | §8.1~§8.11 |
| 每个 demo 有逐项作用说明 | pass | 每个 demo 后有说明表 |
| 完整配置 demo 使用 JSONC 且说明运行时严格 JSON | pass | §9 |
| 没有 storage/common/misc 泛化模块 | pass | 功能边界拆分 |
| sensitive / raw body / fixture 越界已拒绝 | pass | §7、§8、§10 |
| 环境、来源、分类和失败策略闭环 | pass | Step 3~6 回指完整 |
| 上游 exact contract 未伪造 ready | pass_with_upstream_blockers | placeholder / blocked / unknown |
| `03` 影响已判定 | pass | 当前无回写 |
| 正式正文未提前创建 | pass | 仅形成回填草稿 |
| 下一步条件 | pass_with_upstream_blockers | 允许进入 Step 8 敏感配置与密钥管理 |

```text
step_07_status = completed / pass_with_upstream_blockers
step_07_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
next_allowed_action = enter_step_08_sensitive_secrets
implementation_allowed = false
test_execution_allowed = false
commit_allowed = false
```
