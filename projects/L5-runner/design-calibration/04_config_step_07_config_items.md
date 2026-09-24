# Step 7. 定义配置项清单

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 7
> 回填章节：`04-配置设计.md` §7
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_07_config_items.md`
> 输入：Step 3～6、03 Step 6/7/9/13/14/15
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态、输入与关键判断

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 7 |
| current_module | `items:inventory_and_json_demos` |
| gate_status | `pass_for_step_08` |
| gate_reason | 七域 P0 配置项、严格 JSON module/full demos、逐项失败策略、profile/03 映射和跨项审计均已闭合；无 03 待回写。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_08_sensitive_secrets.md` |

| 输入 | 本步使用上限 |
|---|---|
| 03 `RunnerRuntimeConfig` / slots / builder | 只序列化已有 profile、store、adapter、archive、presentation 和 typed policy seam；不新增 owner truth 或 adapter method |
| 03 `RunnerEmbeddedCollectionBounds` | 十个字段逐项配置；值非零、受 static hard cap；具体 production 数值需 authority |
| 03 Step 14 | 承接 page/body/batch、idempotency window、job timeout/parallelism/retry posture、clock/id/digest 与 feature marker |
| Step 5～6 | 单文档、无叶子 override、四 profile、fake/product 隔离 |

关键判断：项目本地配置使用 `runtime`、`stores`、`bindings`、`limits`、`observability`、`determinism`、`features` 七个顶层模块，不重复 `l5-runner` 前缀。`config_ref`、availability/readiness marker、issue ref 和 resolved secret material 均为加载/装配结果，不是用户配置项。

## 2. SOP 问题回答、诊断与取舍

| 问题 | 收口回答 |
|---|---|
| P0 名称、类型、默认、必填？ | 本步 §3 逐项列出。只有 `bindings.adapterBindings=[]`、optional ref=`null`、feature request=`false` 使用安全默认；profile、schema、core store、limits、redaction 和 determinism refs 无默认且 required。 |
| 来源、作用域、生效、敏感与失败？ | 均来自单一 strict JSON 或 safe default；startup snapshot 为主，Job policy 在 run start 冻结；ref 分 `internal_ref` / `sensitive_ref`；缺失、非法、冲突均 fail-fast/reject/blocked。 |
| 模块是否泛化？ | 七模块一一对应 Step 3 控制面；`runtime` 只放 schema/profile，`stores` 不混 external adapter，`bindings` 不重复 observability/determinism/feature-owned refs。 |
| 数值如何处理？ | 当前无 workload authority，因此无 production default。字段 required；demo 的 `1` 只是 JSON parser/type fixture，不是推荐值、SLO、容量或验收阈值。 |
| JSON 是否带注释？ | 模块 demo 与完整 demo 都是严格 JSON。解释位于代码块外；运行配置不得含注释、trailing comma、unknown/alias/duplicate key。 |
| aggregate config？ | P0 不需要。未来系统聚合可将本地路径只读映射为 `runner.<local-path>`；聚合层不能逐叶覆盖、展开 secret 或改语义。 |

| 议题 | 放弃方案 | 当前取舍 | 原因 |
|---|---|---|---|
| `configRef` | 让用户填写 | loader 从 canonical source snapshot 生成 | 防止伪造已验证配置身份 |
| binding 组织 | URL/client/SDK method 大对象 | closed slot + opaque `bindingRef` 数组 | 技术中立、SDK-first、避免私有实现 |
| requiredness | 每项带 `required=true` 可配置 | requiredness 固化在 static schema/profile rule | 不允许配置关闭安全依赖 |
| limits | 继承旧 README 数字 | required positive finite，authority pending | 不伪造 workload/SLO |
| retry | 通用 `maxRetries` | safe typed `retryPolicyRef`；ambiguous effect/no-replay 不可覆盖 | 防止自动重复副作用 |
| feature | flag=true 直接启用 | 只表达 request；binding/contract/readiness 仍独立 | configured/enabled/ready 分层 |

## 3. 配置项总表

### 3.1 `runtime`、`stores` 与 `bindings`

| 配置项 | 类型 | 默认 | 必填 | 作用域/生效 | 敏感级别 | 失败策略 | 03 映射 |
|---|---|---|---|---|---|---|---|
| `runtime.schemaVersion` | literal string | 无 | 是 | document / startup | internal | 非 `runner-config/v1` → unsupported/reject | strict loader schema；不进入 domain |
| `runtime.profile` | closed enum string | 无 | 是 | assembly / startup | internal | 缺失/未知/profile mismatch → fail-fast | `RunnerRuntimeProfileRef` |
| `stores.stateStoreRef` | non-empty opaque ref | 无 | 是 | assembly / startup | internal_ref | unresolved/guarantee不足 → builder blocked | `state_store_ref` / `StateStore` |
| `stores.projectionStoreRef` | non-empty opaque ref | 无 | 是 | assembly / startup | internal_ref | unresolved/identity/version不足 → builder blocked | `projection_store_ref` / `ProjectionStore` |
| `stores.resultStoreRef` | non-empty opaque ref | 无 | 是 | assembly / startup | internal_ref | stored-result/idempotency不足 → mutation blocked | `result_store_ref` / `ResultStore` |
| `stores.operationStoreRef` | non-empty opaque ref | 无 | 是 | assembly / startup | internal_ref | claim/checkpoint/recovery不足 → Jobs blocked | `operation_store_ref` |
| `stores.materialCacheRef` | non-empty opaque ref | 无 | 是 | assembly / startup | sensitive_ref | quarantine/promotion/protection不足 → acquisition/run blocked | `MaterialCache` adapter ref |
| `bindings.adapterBindings` | array of `{slot,bindingRef}` | `[]` | 否；profile/capability 条件必填 | registry / startup | sensitive_ref | duplicate/unknown/forbidden/unresolved → reject或slot Blocked | `adapter_refs` + `RunnerInfraAdapterSlot` |

`bindings.adapterBindings[].slot` 只允许：`context-read`、`release-authority-read`、`material-source`、`integrity-verifier`、`sandbox-run`、`runtime-status`、`platform-resource`。Store/cache、diagnostic/redaction/handoff、clock/id/digest、Archive 和 presentation 由各自功能模块拥有，禁止重复配置。同一 slot 最多一项；`bindingRef` 不得是 URL、path、SDK method、credential 或正文。

### 3.2 `limits`

| 配置项 | 类型 | 默认 | 必填 | 作用域/生效 | 敏感级别 | 失败策略 | 03 映射 |
|---|---|---|---|---|---|---|---|
| `limits.maxProtocolBodyBytes` | positive integer | 无 | 是 | entry / startup | internal | missing/zero/overflow/超 static cap → fail-fast | Step 14 body bound |
| `limits.maxPageItems` | positive integer | 无 | 是 | entry/query/job / startup cap | internal | invalid → fail-fast；request 超 cap → reject | `RunnerPageRequest` → repository page gate |
| `limits.embeddedCollections.controlIntents` | positive integer | 无 | 是 | query composition / startup | internal | invalid/超 cap → fail-fast | `RunnerEmbeddedCollectionBounds.control_intents` |
| `limits.embeddedCollections.resourceObservations` | positive integer | 无 | 是 | query composition / startup | internal | 同上 | `.resource_observations` |
| `limits.embeddedCollections.recoveryLinks` | positive integer | 无 | 是 | query composition / startup | internal | 同上 | `.recovery_links` |
| `limits.embeddedCollections.recoverySubjects` | positive integer | 无 | 是 | query/recovery / startup | internal | 同上 | `.recovery_subjects` |
| `limits.embeddedCollections.resolutionRefs` | positive integer | 无 | 是 | recovery view / startup | internal | 同上 | `.resolution_refs` |
| `limits.embeddedCollections.diagnosticSubjects` | positive integer | 无 | 是 | preview/diagnosis / startup | internal | 同上 | `.diagnostic_subjects` |
| `limits.embeddedCollections.outputSourceRefs` | positive integer | 无 | 是 | preview / startup | internal | 同上 | `.output_source_refs` |
| `limits.embeddedCollections.sourceFailureRefs` | positive integer | 无 | 是 | diagnosis / startup | internal | 同上 | `.source_failure_refs` |
| `limits.embeddedCollections.safeHandoffMaterialRefs` | positive integer | 无 | 是 | handoff / startup | internal | 同上 | `.safe_handoff_material_refs` |
| `limits.embeddedCollections.sourceAttributions` | positive integer | 无 | 是 | all safe views / startup | internal | 同上 | `.source_attributions` |
| `limits.jobs.maxBatchItems` | positive integer | 无 | 是 | Job / job-run-start frozen | internal | invalid/超 cap → reject Job | Step 14 bounded batch policy |
| `limits.jobs.maxParallelism` | positive integer | 无 | 是 | worker/operations / job-run-start | internal | invalid/claim/store不支持 → reject/blocked | Step 14 parallelism policy |
| `limits.jobs.timeoutMilliseconds` | positive integer | 无 | 是 | Job / job-run-start | internal | invalid → reject；timeout after possible effect → Unknown | Step 12 timeout semantics |
| `limits.jobs.retryPolicyRef` | opaque typed ref | 无 | 是 | Job / job-run-start | internal_ref | unresolved/允许 ambiguous replay → reject | Step 14 retry policy seam |
| `limits.idempotency.commandWindowMilliseconds` | positive integer | 无 | 是 | result store / startup | internal | 小于 safe replay/commit-unknown requirement → fail-fast | command idempotency retention |
| `limits.idempotency.consumerWindowMilliseconds` | positive integer | 无 | 是 | planned Consumer / startup | internal | 小于 formal redelivery horizon或authority未知 → Consumer Blocked | receipt/dedup retention |
| `limits.idempotency.jobWindowMilliseconds` | positive integer | 无 | 是 | Job result / startup | internal | 小于 claim/report/recovery horizon → Jobs blocked | Job stored-result retention |

数值字段都必须同时满足 `> 0`、表示范围可承载、static hard safety cap 和 profile/workload authority。当前 authority 未闭合，因此真实 integration/product 文档保持 `authority-pending`，不得把 demo 数字当默认；若未能解析正式值，受影响能力不得 Ready。

### 3.3 `observability`、`determinism` 与 `features`

| 配置项 | 类型 | 默认 | 必填 | 作用域/生效 | 敏感级别 | 失败策略 | 03 映射 |
|---|---|---|---|---|---|---|---|
| `observability.redactionBindingRef` | opaque ref | 无 | 是 | assembly / startup | sensitive_ref | unresolved/unsupported → visible output/handoff fail-closed | `Redaction` slot |
| `observability.redactionPolicyRef` | opaque policy ref | 无 | 是 | preview/diagnosis/handoff / startup | sensitive_ref | invalid/missing → no visible content | `RedactionRequest.required_policy_ref` |
| `observability.diagnosticReadBindingRef` | nullable opaque ref | `null` | feature 条件必填 | assembly / startup | sensitive_ref | requested且缺失/blocked → diagnostic unavailable | `DiagnosticRead` slot |
| `observability.observabilityHandoffBindingRef` | nullable opaque ref | `null` | feature 条件必填 | assembly / startup | sensitive_ref | requested且缺失/blocked → handoff Blocked | `ObservabilityHandoff` slot |
| `observability.telemetryBindingRef` | nullable opaque ref | `null` | 否 | infra / startup | sensitive_ref | unavailable 只降级 telemetry；不得改变业务 truth | Step 15 safe telemetry seam |
| `determinism.clockConnectivityBindingRef` | opaque ref | 无 | 是 | assembly / startup | internal_ref | missing → mutation/expiry/freshness判断 blocked | `ClockConnectivityPort` |
| `determinism.idGeneratorBindingRef` | opaque ref | 无 | 是 | assembly / startup | internal_ref | missing → new local identity mutation blocked | `RunnerIdGeneratorPort` |
| `determinism.canonicalDigestProfileRef` | opaque policy ref | 无 | 是 | assembly / startup | internal_ref | missing/unstable/不兼容 → idempotent mutation blocked | `RunnerCanonicalDigestPort` |
| `determinism.fixtureSetRef` | nullable opaque ref | `null` | test profile 条件必填 | test harness / test-startup | sensitive_ref | test missing → test assembly fail-fast；non-test non-null → reject | Step 16 deterministic fakes |
| `features.presentationCapabilityRef` | nullable opaque ref | `null` | 否 | entry/presentation / startup | internal_ref | unresolved → minimal/restricted presentation | `presentation_capability_ref` |
| `features.diagnosticPreviewRequested` | boolean | `false` | 否 | peripheral path / startup | internal | true 前置不全 → reject/Blocked；false → disabled | preview/diagnosis ports |
| `features.observabilityHandoffRequested` | boolean | `false` | 否 | handoff / startup | internal | true 前置不全 → reject/Blocked | handoff port |
| `features.archiveReferenceRequested` | boolean | `false` | 否 | peripheral archive ref / startup | internal | true 前置不全 → reject/Blocked；不影响 core success | `archive_enabled()` semantics |
| `features.archiveReferenceBindingRef` | nullable opaque ref | `null` | archive request 条件必填 | assembly / startup | sensitive_ref | missing/unresolved → Archive path Blocked | `archive_adapter_ref` |

Feature request 永远不能启用 planned Consumer positive path、outbound event、owner mutation、Sandbox/Runtime success、authority bypass、raw diagnostics 或 evidence generation。

## 4. 按配置域组织的配置项批次与停审

| 配置域 | 配置项组 | 控制面/分类 | 来源/profile 差异 | 失败与 03 影响 | 域停审 |
|---|---|---|---|---|---|
| runtime | schema/profile | startup assembly | 单文档；四 profile 显式；无 default | unsupported/unknown fail-fast；无 03 回写 | pass |
| stores | 4 store refs + material cache ref | startup/sensitive ref | test 可 fake；integration/product formal capability pending | core guarantee不足 blocked；映射既有 refs/slot | pass with `RUN-DDD-003` |
| bindings | 7 external/platform slot refs | startup/sensitive ref | test fake；integration/product per-slot formal | configured≠ready；映射 existing slot set | pass with `RUN-UP-*` |
| limits | body/page/10 embedded/Job/idempotency | startup + job-run policy | test fixture可给值；product需 authority | required/pending，invalid reject；映射既有 typed policy seam | pass pending numeric authority |
| observability | redaction/policy/diagnostic/handoff/telemetry refs | mandatory safety + peripheral refs | test fake parity；real seam pending | redaction fail-closed；无 evidence | pass with `RUN-UP-005/008` |
| determinism | clock/id/digest/fixture refs | startup + test-only | fake只允许 test | provider缺失阻断 mutation；既有 ports | pass pending provider authority |
| features | presentation + 3 requests + archive ref | peripheral feature request | all default false/null；product formal prerequisite | requested≠enabled/ready；无新 capability | pass |

## 5. 模块级严格 JSON demo 与作用说明

下列数值 `1` 仅用于展示 positive-integer JSON 类型并支撑未来 parser fixture。它们不是默认值、推荐值、容量、性能目标、timeout 决策、retention 决策或验收 oracle；真实文档必须由 workload/security/platform authority 提供非占位值，否则对应能力保持 blocked。

### 5.1 `runtime` 配置 demo

```json
{
  "runtime": {
    "schemaVersion": "runner-config/v1",
    "profile": "test-deterministic"
  }
}
```

| 配置项 | 示例 | 作用 | 约束/失败 |
|---|---|---|---|
| `schemaVersion` | `runner-config/v1` | 选择 closed schema | 必填 exact literal；unknown reject |
| `profile` | `test-deterministic` | 选择受控装配姿态 | 必填四值之一；不表示 readiness |

### 5.2 `stores` 配置 demo

```json
{
  "stores": {
    "stateStoreRef": "store:state:test",
    "projectionStoreRef": "store:projection:test",
    "resultStoreRef": "store:result:test",
    "operationStoreRef": "store:operation:test",
    "materialCacheRef": "cache:material:test"
  }
}
```

| 配置项组 | 作用 | 约束/失败 |
|---|---|---|
| four store refs | 注入 local truth/projection/result/operations logical capability | non-empty opaque ref；test family 只在 test profile；能力不满足则对应 assembly blocked |
| `materialCacheRef` | 注入 quarantine/cache capability | 不得是 path/backend；必须证明 quarantine/promotion/protection parity |

### 5.3 `bindings` 配置 demo

```json
{
  "bindings": {
    "adapterBindings": [
      {
        "slot": "release-authority-read",
        "bindingRef": "adapter:release-authority:test"
      },
      {
        "slot": "sandbox-run",
        "bindingRef": "adapter:sandbox:test"
      }
    ]
  }
}
```

| 配置项 | 作用 | 约束/失败 |
|---|---|---|
| `adapterBindings` | 将 closed semantic slot 关联到 opaque config ref | unique slot；只允许七值；ref 禁 URL/path/secret/method/body；配置不生成 Ready |

### 5.4 `limits` 配置 demo

```json
{
  "limits": {
    "maxProtocolBodyBytes": 1,
    "maxPageItems": 1,
    "embeddedCollections": {
      "controlIntents": 1,
      "resourceObservations": 1,
      "recoveryLinks": 1,
      "recoverySubjects": 1,
      "resolutionRefs": 1,
      "diagnosticSubjects": 1,
      "outputSourceRefs": 1,
      "sourceFailureRefs": 1,
      "safeHandoffMaterialRefs": 1,
      "sourceAttributions": 1
    },
    "jobs": {
      "maxBatchItems": 1,
      "maxParallelism": 1,
      "timeoutMilliseconds": 1,
      "retryPolicyRef": "policy:retry:test-safe"
    },
    "idempotency": {
      "commandWindowMilliseconds": 1,
      "consumerWindowMilliseconds": 1,
      "jobWindowMilliseconds": 1
    }
  }
}
```

| 配置项组 | 作用 | 约束/失败 |
|---|---|---|
| body/page | entry 和分页 hard gate | positive finite + static cap；请求只可更严格 |
| embeddedCollections | 非分页 view 内嵌集合有界化 | 十项 1:1 映射 `RunnerEmbeddedCollectionBounds`；超出标 Partial/error，不伪装 Complete |
| jobs | 冻结本次 Job 的 batch/parallelism/timeout/retry policy | authority required；timeout/unknown 不允许自动 replay |
| idempotency | 保留 duplicate/commit-unknown 所需记录 | 必须覆盖正式 horizon；不得删除 unresolved record |

### 5.5 `observability` 配置 demo

```json
{
  "observability": {
    "redactionBindingRef": "adapter:redaction:test",
    "redactionPolicyRef": "policy:redaction:test",
    "diagnosticReadBindingRef": "adapter:diagnostic-read:test",
    "observabilityHandoffBindingRef": null,
    "telemetryBindingRef": null
  }
}
```

| 配置项组 | 作用 | 约束/失败 |
|---|---|---|
| redaction binding/policy | mandatory safe output gate | required；失败不得输出 raw/best-effort content |
| diagnostic/handoff/telemetry refs | 请求安全读取、交接或低基数 telemetry seam | nullable；feature request=true 时对应 ref必填；receipt/log 不升级 evidence |

### 5.6 `determinism` 配置 demo

```json
{
  "determinism": {
    "clockConnectivityBindingRef": "adapter:clock:test",
    "idGeneratorBindingRef": "adapter:id:test",
    "canonicalDigestProfileRef": "policy:digest:test",
    "fixtureSetRef": "fixture:runner:test"
  }
}
```

| 配置项组 | 作用 | 约束/失败 |
|---|---|---|
| clock/id/digest refs | 注入 typed ports，保证时间、身份、canonical digest 来源唯一 | required；不能从 timestamp/path/PID/port/body 临时生成 |
| fixture ref | 解析 test-only deterministic behavior | 仅 `test-deterministic`；其它 profile 非 null 即 reject |

### 5.7 `features` 配置 demo

```json
{
  "features": {
    "presentationCapabilityRef": null,
    "diagnosticPreviewRequested": true,
    "observabilityHandoffRequested": false,
    "archiveReferenceRequested": false,
    "archiveReferenceBindingRef": null
  }
}
```

| 配置项组 | 作用 | 约束/失败 |
|---|---|---|
| presentation ref | 选择安全展示 capability | nullable；缺失时 minimal/restricted，不改 command semantics |
| request flags | 请求外围已有 path | default false；true 仍需 profile/contract/binding/readiness；不得开 reserved path |
| archive ref | archive request 的条件 binding | flag=false 时须 null/ignored-as-absent；flag=true 时 required，但不进入 core success |

## 6. 完整严格 JSON demo

```json
{
  "runtime": {
    "schemaVersion": "runner-config/v1",
    "profile": "test-deterministic"
  },
  "stores": {
    "stateStoreRef": "store:state:test",
    "projectionStoreRef": "store:projection:test",
    "resultStoreRef": "store:result:test",
    "operationStoreRef": "store:operation:test",
    "materialCacheRef": "cache:material:test"
  },
  "bindings": {
    "adapterBindings": [
      {
        "slot": "context-read",
        "bindingRef": "adapter:context:test"
      },
      {
        "slot": "release-authority-read",
        "bindingRef": "adapter:release-authority:test"
      },
      {
        "slot": "material-source",
        "bindingRef": "adapter:material-source:test"
      },
      {
        "slot": "integrity-verifier",
        "bindingRef": "adapter:integrity:test"
      },
      {
        "slot": "sandbox-run",
        "bindingRef": "adapter:sandbox:test"
      },
      {
        "slot": "runtime-status",
        "bindingRef": "adapter:runtime-status:test"
      },
      {
        "slot": "platform-resource",
        "bindingRef": "adapter:platform:test"
      }
    ]
  },
  "limits": {
    "maxProtocolBodyBytes": 1,
    "maxPageItems": 1,
    "embeddedCollections": {
      "controlIntents": 1,
      "resourceObservations": 1,
      "recoveryLinks": 1,
      "recoverySubjects": 1,
      "resolutionRefs": 1,
      "diagnosticSubjects": 1,
      "outputSourceRefs": 1,
      "sourceFailureRefs": 1,
      "safeHandoffMaterialRefs": 1,
      "sourceAttributions": 1
    },
    "jobs": {
      "maxBatchItems": 1,
      "maxParallelism": 1,
      "timeoutMilliseconds": 1,
      "retryPolicyRef": "policy:retry:test-safe"
    },
    "idempotency": {
      "commandWindowMilliseconds": 1,
      "consumerWindowMilliseconds": 1,
      "jobWindowMilliseconds": 1
    }
  },
  "observability": {
    "redactionBindingRef": "adapter:redaction:test",
    "redactionPolicyRef": "policy:redaction:test",
    "diagnosticReadBindingRef": "adapter:diagnostic-read:test",
    "observabilityHandoffBindingRef": null,
    "telemetryBindingRef": null
  },
  "determinism": {
    "clockConnectivityBindingRef": "adapter:clock:test",
    "idGeneratorBindingRef": "adapter:id:test",
    "canonicalDigestProfileRef": "policy:digest:test",
    "fixtureSetRef": "fixture:runner:test"
  },
  "features": {
    "presentationCapabilityRef": null,
    "diagnosticPreviewRequested": true,
    "observabilityHandoffRequested": false,
    "archiveReferenceRequested": false,
    "archiveReferenceBindingRef": null
  }
}
```

该 demo 是可解析的 `test-deterministic` schema 示例，不代表文件、fixture、store、adapter、SDK client、Sandbox、Runtime、测试或 readiness 已存在。所有数值 `1` 仅为类型 fixture；不得复制到 integration/product 文档。

## 7. Cross-field 校验摘要

| 规则 | 失败处理 |
|---|---|
| 顶层恰为七个 closed modules；unknown/alias/duplicate 禁止 | whole-document reject |
| profile=test 才允许 `fixtureSetRef` 和 `*:test` provider family；integration/product 禁 fake | reject |
| core stores、redaction、clock/id/digest required；refs non-empty/non-URL/non-path/non-body | reject/assembly blocked |
| adapter slot unique、closed；不得与 observability/determinism/store-owned slot 重复 | reject |
| feature request=true 必须有相应 ref、profile allowance 和 formal prerequisite；false 不产生 adapter readiness | reject或explicit Blocked |
| archive request=false 时 binding ref必须 null；true时非空仍不等 ready | reject/Blocked |
| limits positive finite、≤ static cap；embedded fields全齐 | reject |
| idempotency windows 必须覆盖对应 retry/redelivery/claim/report/commit-unknown horizon | unresolved/too small → affected capability blocked |
| retry policy 不得自动重放 possible-effect/Unknown/commit-unknown | reject policy |
| `config_ref`、issue/readiness markers不得出现在文档 | unknown-field reject |

## 8. 跨配置项闭环审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 每项有类型/默认/必填/来源/作用域/生效/敏感/失败/模块 | pass | §3 全覆盖 |
| 七域是否按功能边界拆分 | pass | 无 common/misc 泛化桶 |
| 是否重复项目名前缀 | no | 本地 root 即 runner config |
| strict JSON demo 是否闭合 schema | pass by static review | 本轮不运行 parser/测试 |
| 数值是否被伪造为默认/SLO | no | required + authority-pending；`1` 明示为 fixture |
| raw secret/endpoint/path/backend/method/body | no | only opaque refs；Step 8 深审 |
| fake 是否污染 product | no | profile/ref family cross-field reject |
| feature 是否打开 reserved path | no | request-only + prerequisites |
| configured/enabled/ready 是否混淆 | no | config 只建立 configured input |
| 是否遗漏 03 `RunnerRuntimeConfig` 字段 | no | profile、四 stores、adapter set、archive、presentation 均有映射；config_ref/issue_refs是派生结果 |
| 是否遗漏 03 limit/provider seam | no | body/page/embedded/job/idempotency/clock/id/digest 已覆盖 |
| 是否新增 03 contract | no | JSON serialization + policy values，不增加 struct/port/function/error |

## 9. 详细设计影响、回填与门禁

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 状态 |
|---|---|---|---|---|
| 七 JSON modules 映射既有 runtime config/ports/policies | 否 | serialization/config semantics | N/A | 无回写 |
| `config_ref`/marker/issue refs 为派生值而非输入 | 否 | loader invariant | N/A | 无回写 |
| numeric required/authority-pending | 否 | value authority | N/A | 无回写 |
| 若未来需要额外 adapter slot、limit carrier、hot reload 或 secret body | 是 | object/port/builder/error contract | 03 Step 6/7/9/12/14 | 当前禁止；未来重开 |

未来正式 §7 应保留三张配置总表、七个模块级严格 JSON demo、完整 demo、fixture 数字警示和 cross-field 表；不得把过程诊断或“pass”写成实现/测试事实。

| 待确认事项 | 当前处理 |
|---|---|
| production 数值与 hard cap exact 值 | authority pending；对应 capability blocked |
| exact binding ref grammar/registry/provider | physical implementation pending；只规定 non-empty opaque/typed family |
| actual document delivery and config identity algorithm | Step 9/07 承接语义；不选算法/路径 |
| system aggregate config | 非 P0；未来只读 `runner.*` 映射 |

| 进入 Step 8 条件 | 结论 |
|---|---|
| P0 配置项逐域完整并停审 | pass with explicit blockers |
| strict JSON demos、完整 demo 与作用表齐全 | pass by document review |
| cross-field/失败/03 映射可判定 | pass |
| 跨项无重复、secret、fake、默认数字或 03 待回写冲突 | pass |

Step 7 完成，允许进入 Step 8；正式 04 仍不可写，未运行 parser 或测试。
