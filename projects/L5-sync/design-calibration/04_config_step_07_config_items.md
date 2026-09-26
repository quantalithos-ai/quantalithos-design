# Step 7. 定义配置项清单

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 7。
> 回填章节：未来正式 `04-配置设计.md` §7「配置项清单」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04。
> 重要声明：本文只把正式 `03-详细设计.md` 已存在的 42 个 code-level leaf 映射为候选 raw JSON key。本文中的 ref、数值和 profile 值均是 `documentation candidate`，不是已创建的实例、默认运行值、SLO、测试数据或能力证明。

## 1. Step 状态与门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `7 / config_items` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1～6 均 `pass_with_upstream_blockers`，且 Step 6 已停审 |
| 正式 04 写入 | `false`；Step 15 前不得创建 `04-配置设计.md` |
| 允许的下一动作 | `enter_step_08_sensitive_secrets` |
| 实现 / 测试 / commit | `false / false / false` |
| 当前上游 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样继承 |

本 Step 的通过只表示 42 个既有 leaf 已有可审查的 raw mapping、类型、必填/nullable、来源、作用域、生效和失败口径；不表示任何 SDK、Artifact/Workspace source、权限、Review handoff、`.qs-sync` physical backend、Git/filesystem tool 或 operations slot 已经实现、健康、授权、`bound`、accepted 或 ready。

## 2. 本步目标、输入与明确不做的事

### 2.1 目标

本 Step 交付：

1. 42 个 P0 code-level leaf 的十列表（配置项、类型、默认值、是否必填、来源、作用域、生效方式、敏感级别、失败策略、关联模块）。
2. 按配置域组织的批次表，并逐项回指 Step 3 控制面、Step 4 分类、Step 5 来源规则、Step 6 profile 差异和 03 影响判定。
3. 按功能边界拆分的严格 JSON module demo；不使用 `runtime`、`common`、`misc`、`storage` 等泛化大杂烩模块。
4. 一份完整 JSONC 文档示例，并明确运行时必须删除注释、使用严格 JSON。
5. 每个配置域停审记录、跨配置项闭环审计、03 回填草稿与下一 Step 门禁。

### 2.2 输入基线

| 输入 | 本 Step 承接内容 |
|---|---|
| `04_config_step_03_control_plane.md` | 唯一 loader/composition 边界、八个既有 family、配置域与控制面归属 |
| `04_config_step_04_categories_boundaries.md` | `startup_cold_runtime`、`job_run_start_pinned`、`entry_local_request`、`sensitive_opaque_ref`、`diagnostic_redaction`、`test_deterministic_only`、`peripheral_registration_intent` 及禁止配置化边界 |
| `04_config_step_05_sources_priority_conflicts.md` | `approved default < selected strict JSON < allowlisted environment` 的普通来源顺序、重复/alias/unknown/非法值处理 |
| `04_config_step_06_environment_profiles_matrix.md` | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 四个 P0 语义 profile；未来 profile 不进入当前 schema |
| `03-详细设计.md` §13、`03_ddd_step_14_config_dependencies.md` | `ValidatedSyncRuntimeConfig` 八个 family、42 个 leaf、capability snapshot、ref-only 和 cold composition 语义 |
| `standards/document/配置设计讨论流程_SOP.md`、`配置设计书写规范.md` | 十列表、域批次、module JSON、完整 JSONC、停审和跨项审计要求 |
| `projects/L1-governance` Step 7 | 仅参考粒度和表格框架，不继承 Governance 的字段、数字、topic 或业务 truth |

### 2.3 本 Step 不定义

- secret provider 的真实产品、读取协议、轮换操作和审计细节（Step 8）。
- loader/parser/validator 的实现函数、error enum、cross-field algorithm 和 activation 流程（Step 9）。
- 变更审批、审计载体、回滚实施与失效降级登记（Step 10～11）。
- 具体 Node/package manager/package/bin、Git library、SDK version、部署挂载、真实 endpoint、数据库或 CI 实例。
- 新 runtime type、Port、DTO、state、error、topic、schedule、daemon、source authority 或 comparator。
- 正式 `04-配置设计.md`；必须等 Step 15。

## 3. 命名、raw mapping 与默认值纪律

### 3.1 raw section 到 code-level family 的唯一映射

| 当前 raw section（候选） | 03 code-level family / leaf | 说明 |
|---|---|---|
| `identity` | `configRef`、`profileRef` | raw 文件避免重复 `sync`/项目名前缀；validator 产出 `ValidatedSyncRuntimeConfig.configRef/profileRef` |
| `boundary` | `SyncBoundaryLimits` 五项 | 所有值为有限、安全、正整数；单位写在类型/约束中 |
| `execution` | `SyncExecutionBudgets` 八项 | 原始整数表示毫秒；不表示 SLO，不启用 generic retry |
| `jobs` | `SyncJobBudgets` 两项 | startup 校验后在每个显式 job run 开始时 pin；不创建 schedule/scope/key |
| `metadata` | `SyncMetadataBindings` 三项 | 只保存 opaque adapter refs；不选择 `.qs-sync` physical schema/backend |
| `sdk` | `SyncSdkBindings` 七项 | profile、credential/provider、owner/source/handoff/decision/probe 分槽；不保存 DTO/body |
| `localTools` | `SyncLocalToolBindings` 五项 | Git/fs/root-policy typed refs；不允许任意 argv、shell、remote 或 merge strategy |
| `support` | `SyncSupportBindings` 六项 | diagnostics/redaction/Clock/ID/Digest refs；不产生 evidence/readiness |
| `operations` | `SyncOperationsBindings` 四个 nullable slot | 只表示既有 conditional registration intent；`null` 不等于 disabled、healthy 或 ready |

这些 section 是本文的文档级 canonical candidate 形状，不表示已经存在文件、环境变量、registry 或实现 loader。项目本地配置不强制重复 `l5-sync` 前缀；未来系统级聚合文件若获授权，必须另行定义映射和冲突规则，不能凭聚合前缀新增字段。

### 3.2 来源、默认值和敏感级别记号

- 普通值来源统一遵守 Step 5：`approved code-declared default < selected strict JSON candidate < allowlisted environment override`。本 Step 只有明确标为 `default_allowed` 的项才有默认。
- 本 Step 的 38 个非-nullable leaf 均标为“无默认；required”；缺失或高优先级非法值不得回退低优先级。
- 四个 `operations` slot 允许 `null`，并可由 approved code-declared default 归一为 `null`；`null` 只表示未注册/未提供 slot，受影响能力仍是 `blocked`、`unsupported` 或 `unknown`，不是成功。
- `identity.configRef` 必须由候选显式提供并通过 canonical identity 校验；不从环境或路径静默生成另一个身份。`identity.profileRef` 必须显式提供，entry-local profile selector 只能选择当前入口并与候选冲突时拒绝。
- `documentation candidate` 是文档示例值，不是默认值。完整 JSONC 中的所有数字和字符串均带有这一限制。
- `non-sensitive` 表示该 leaf 本身不应承载秘密；`opaque-ref` 表示仅允许不透明引用；`sensitive-ref` 表示引用解析可能触及凭据、端点或路径策略，raw 材料仍永久禁止进入配置。

### 3.3 统一失败策略词汇

| 词汇 | 本 Step 的精确定义 |
|---|---|
| `startup fail-fast` | 候选不产生 `ValidatedSyncRuntimeConfig`，不创建新 composition/snapshot |
| `current job rejected` | 已有 composition 可保留，但当前显式 job 不启动、不扩大 scope、不生成新副作用 key |
| `current entry rejected` | 只拒绝当前 command/query/entry，不猜 default/latest，不修改全局配置 |
| `capability blocked/unknown` | ref 语法合法但合同、依赖或探测未闭合；snapshot 保留真实姿态，相关 route 不得 fake fallback |
| `registration remains null/blocked` | 可选 operations slot 不注册；不因 ref 存在创建 consumer、scheduler 或 positive capability |

## 4. P0 配置项十列表（42 个 leaf）

> “默认值”列中的 `无（required）` 是刻意的设计结论，不是遗漏。`示例`只出现在各 module demo 和完整 JSONC 中，并全部标注为 documentation candidate。

### 4.1 Identity（2）

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `identity.configRef` → `configRef` | opaque `SyncRuntimeConfigRef` | 无（`required`） | 是 | selected strict JSON；不允许普通 env 覆盖；canonical identity 校验 | startup/cold composition | 校验通过后固定到 composition 与 snapshot | redacted-identity | 缺失、格式非法或 canonical mismatch → startup fail-fast | `src/config`、`src/composition`、snapshot factory |
| `identity.profileRef` → `profileRef` | opaque `SyncRuntimeProfileRef` | 无（`required`） | 是 | selected strict JSON；allowlisted profile selector/entry-local selector 仅选择当前入口，冲突即拒绝 | startup/cold；entry-local selector 仅当前入口 | 新 composition 固定；在途对象不换 snapshot | non-sensitive identity | 缺失/未知/selector 冲突 → startup 或 current entry rejected | `src/config`、`src/composition`、entry boundary |

### 4.2 Boundary（5）

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `boundary.maxRequestBytes` → `boundary.maxRequestBytes` | positive safe integer (bytes) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | 新 composition 冻结；入口解码前使用 | non-sensitive | 缺失、非正整数、越界或 overflow → startup fail-fast；超限 entry rejected | entry decoder、consumer/job envelope |
| `boundary.maxPageItems` → `boundary.maxPageItems` | positive safe integer (items) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | 新 composition 冻结；query mapper 使用 | non-sensitive | 缺失/非法或请求超限 → startup fail-fast/current entry rejected；不得 silent clamp | query mapper、read repositories |
| `boundary.maxPathScopeItems` → `boundary.maxPathScopeItems` | positive safe integer (paths) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | 新 composition 冻结；clone/pull/status/push-review/resolve entry 校验 | non-sensitive | 缺失/非法或 scope 超限 → startup fail-fast/current entry rejected；不得截断后宣称成功 | command entry、path-scope validator |
| `boundary.maxTargetScopeItems` → `boundary.maxTargetScopeItems` | positive safe integer (targets) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | 新 composition 冻结；job/input validator 使用 | non-sensitive | 缺失/非法、job scope 超限或与 `jobs.maxBatchItems` 关系非法 → startup fail-fast/current job rejected | job boundary、target-scope validator |
| `boundary.maxDiagnosticItems` → `boundary.maxDiagnosticItems` | positive safe integer (records) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | 新 composition 冻结；safe diagnostic presenter 使用 | non-sensitive | 缺失/非法或诊断超限 → startup fail-fast；输出必须 bounded/degraded，不伪造 complete | diagnostics presenter、support adapters |

### 4.3 Execution（8）

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `execution.localReadTimeout` → `localReadTimeout` | positive safe integer (ms) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | 绑定 metadata read wrapper | non-sensitive | 缺失/非法 → startup fail-fast；调用超时按 03 映射 unavailable/unknown | metadata read wrapper |
| `execution.localCommitTimeout` → `localCommitTimeout` | positive safe integer (ms) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | 绑定 local UoW commit wrapper | non-sensitive | 缺失/非法 → startup fail-fast；commit timeout 为 `commit_status_unknown`，不当作未发生 | UoW adapter、mutation facade |
| `execution.metadataLockAcquireTimeout` → `metadataLockAcquireTimeout` | positive safe integer (ms) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | 绑定 target-lock acquire wrapper | non-sensitive | 缺失/非法 → startup fail-fast；超时不视为已持锁，affected route blocked | lock adapter、mutation preflight |
| `execution.sdkReadTimeout` → `sdkReadTimeout` | positive safe integer (ms) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | 绑定 owner/source/decision read wrapper | non-sensitive | 缺失/非法 → startup fail-fast；read timeout unavailable/unknown，不能本地 allow | SDK adapters、access/source reads |
| `execution.externalEffectTimeout` → `externalEffectTimeout` | positive safe integer (ms) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | 绑定 handoff/probe effect wrapper | non-sensitive | 缺失/非法 → startup fail-fast；ambiguous effect 为 `outcome_unknown`，不盲重试 | handoff/probe adapters |
| `execution.localToolEffectTimeout` → `localToolEffectTimeout` | positive safe integer (ms) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | 绑定 Git/filesystem apply wrapper | non-sensitive | 缺失/非法 → startup fail-fast；partial/unknown 保留，不自动重放 | local-tool adapters、recovery |
| `execution.shutdownTimeout` → `shutdownTimeout` | positive safe integer (ms) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | entry/job shutdown coordinator 固定 | non-sensitive | 缺失/非法 → startup fail-fast；停止接收新入口，保留在途 unknown/needs-action | CLI/job entry coordinator |
| `execution.maxConcurrentMutations` → `maxConcurrentMutations` | positive safe integer (operations) | 无（`required`） | 是 | strict JSON + allowlisted env | startup/cold | composition 建立 bounded semaphore；不替代 lock/version | non-sensitive | 缺失/非法/超过实现上限 → startup fail-fast；不能靠并发预算绕过 target lock | composition、mutation scheduler |

### 4.4 Jobs（2）

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `jobs.maxBatchItems` → `maxBatchItems` | positive safe integer (items) | 无（`required`） | 是 | strict JSON + allowlisted env；job request 只能在既有 run-local 边界内提供显式值 | startup 校验 + job-run-start pin | 每个显式 job run 固定；在途 run 不变 | non-sensitive | 缺失/非法或大于 `boundary.maxTargetScopeItems` → startup fail-fast/current job rejected | explicit job runners |
| `jobs.maxParallelItems` → `maxParallelItems` | positive safe integer (items) | 无（`required`） | 是 | strict JSON + allowlisted env；run-start 只 pin 已验证值 | startup 校验 + job-run-start pin | 每个显式 job run 固定；不改变 per-item UoW/version | non-sensitive | 缺失/非法、超过 composition concurrency ceiling 或无法安全判定 → startup fail-fast/current job rejected | explicit job runners、bounded scheduler |

### 4.5 Metadata bindings（3）

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `metadata.storeAdapterRef` → `storeAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；test ref 仅 test composition | startup/cold | metadata factory 静态校验并写入 snapshot binding | opaque-ref；durable target 可能为 sensitive-ref | 缺失/格式非法 → startup fail-fast；contract 未闭合 → capability blocked/unknown，mutation 不构造 | metadata store adapter、repositories |
| `metadata.unitOfWorkAdapterRef` → `unitOfWorkAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；test ref 仅 test composition | startup/cold | UoW factory 静态校验并固定 | opaque-ref | 缺失/非法 → startup fail-fast；无 atomic visibility/unknown commit 证明 → mutation blocked | UoW adapter、composition |
| `metadata.lockAdapterRef` → `lockAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；test ref 仅 test composition | startup/cold | target lock factory 静态校验并固定 | opaque-ref | 缺失/非法 → startup fail-fast；lock contract 未闭合 → affected local effect blocked | lock adapter、local effect guard |

### 4.6 SDK bindings（7）

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `sdk.sdkProfileRef` → `sdkProfileRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref | startup/cold | SDK composition 固定 profile ref；不选择 Project/version/source/target | sensitive-ref | 缺失/非法 → startup fail-fast；SDK surface/version 未闭合 → affected capability blocked/unknown | SDK composition、profile adapter |
| `sdk.credentialProviderRef` → `credentialProviderRef` | opaque `CredentialProviderRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；只提供 ref | startup/cold | provider resolver 在 composition/preflight 分层解析；raw material 不进入 config/snapshot | sensitive-ref | 缺失/非法 → startup fail-fast；resolver unavailable → blocked/unknown；不得 fallback/cache/fake | credential resolver、SDK adapters |
| `sdk.ownerAccessAdapterRef` → `ownerAccessAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref | startup/cold | owner access adapter 绑定并分类 | sensitive-ref | 缺失/非法 → startup fail-fast；permission/posture contract 未闭合 → route fail-closed/blocked | owner access adapter |
| `sdk.materialSourceAdapterRef` → `materialSourceAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref | startup/cold | Artifact/Workspace source adapter 绑定并分类 | sensitive-ref | 缺失/非法 → startup fail-fast；authority/comparator/gap 未闭合 → pull/cursor route blocked | material source adapter |
| `sdk.reviewHandoffAdapterRef` → `reviewHandoffAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref | startup/cold | review handoff adapter 绑定并分类 | sensitive-ref | 缺失/非法 → startup fail-fast；ACK/probe/decision contract 未闭合 → handoff blocked/unknown | review handoff adapter |
| `sdk.reviewDecisionReadAdapterRef` → `reviewDecisionReadAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref | startup/cold | decision read adapter 绑定并分类 | sensitive-ref | 缺失/非法 → startup fail-fast；read unavailable/unknown → route fail-closed，不创建 Decision | decision read adapter |
| `sdk.recoveryProbeAdapterRef` → `recoveryProbeAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref | startup/cold | formal recovery probe adapter 绑定并分类 | sensitive-ref | 缺失/非法 → startup fail-fast；probe contract 未闭合 → outcome unknown/manual，不重放 effect | recovery/probe adapter |

### 4.7 Local tools（5）

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `localTools.gitObservationAdapterRef` → `gitObservationAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；test ref 仅 test composition | startup/cold | Git observation adapter 绑定并分类 | opaque-ref | 缺失/非法 → startup fail-fast；tool/version contract unknown → observation blocked/unknown，不当 clean | Git observation adapter |
| `localTools.gitWorktreeAdapterRef` → `gitWorktreeAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；test ref 仅 test composition | startup/cold | local worktree apply adapter 绑定并分类 | opaque-ref | 缺失/非法 → startup fail-fast；dirty/path/partial/unknown contract 未闭合 → apply blocked | Git worktree adapter |
| `localTools.filesystemInspectionAdapterRef` → `filesystemInspectionAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；test ref 仅 test composition | startup/cold | filesystem inspection adapter 绑定并分类 | opaque-ref | 缺失/非法 → startup fail-fast；symlink/root/path safety unknown → route blocked | filesystem inspection adapter |
| `localTools.filesystemApplyAdapterRef` → `filesystemApplyAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；test ref 仅 test composition | startup/cold | filesystem apply adapter 绑定并分类 | opaque-ref | 缺失/非法 → startup fail-fast；non-overwrite/partial/unknown 不满足 → apply blocked | filesystem apply adapter |
| `localTools.allowedTargetRootPolicyRef` → `allowedTargetRootPolicyRef` | opaque `AllowedTargetRootPolicyRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；不保存 raw path | startup/cold | root policy 在 composition 固定；entry path 仍显式校验 | sensitive-ref（path policy） | 缺失/非法/不可安全解析 → startup fail-fast；root/symlink 不明 → current entry rejected | filesystem safety guard |

### 4.8 Support（6）

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `support.diagnosticsAdapterRef` → `diagnosticsAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；test ref 仅 test composition | startup/cold | diagnostics sink 绑定并固定 | opaque-ref | 缺失/非法 → startup fail-fast；sink unavailable 只隔离 diagnostics，不改变业务结果 | diagnostics adapter |
| `support.redactionPolicyRef` → `redactionPolicyRef` | opaque `RedactionPolicyRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；不得通过 env 放宽 deny rules | startup/cold | redaction policy 在 snapshot 中固定 | security-critical opaque-ref | 缺失/非法/无法证明 forbidden-field deny → startup fail-fast；禁止启动可写 graph | redaction/presenter |
| `support.clockAdapterRef` → `clockAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；deterministic ref 仅 test composition | startup/cold | Clock provider 固定到 composition/snapshot | non-sensitive opaque-ref | 缺失/非法 → startup fail-fast；不能用隐式 system time 替代 required ref | Clock adapter |
| `support.idAdapterRef` → `idAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；deterministic ref 仅 test composition | startup/cold | ID provider 固定到 composition/snapshot | non-sensitive opaque-ref | 缺失/非法 → startup fail-fast；不得用 Git commit、时间或随机 fallback 冒充 ID | ID adapter |
| `support.digestAdapterRef` → `digestAdapterRef` | opaque `SyncAdapterBindingRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref；deterministic ref 仅 test composition | startup/cold | digest provider 固定到 composition/snapshot | non-sensitive opaque-ref | 缺失/非法 → startup fail-fast；不得以日志、Git ref 或 body hash 猜替代 | digest adapter |
| `support.digestAlgorithmRef` → `digestAlgorithmRef` | opaque `DigestAlgorithmRef` | 无（`required`） | 是 | strict JSON + allowlisted env ref | startup/cold | algorithm ref 与 digest adapter 一起固定 | non-sensitive opaque-ref | 缺失/非法/与 adapter 不兼容 → startup fail-fast；不得隐式切换算法 | digest adapter、idempotency |

### 4.9 Operations（4，可选/null）

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `operations.accessOrPostureConsumerRef` → `accessOrPostureConsumerRef` | `Optional<SyncAdapterBindingRef>` | `null`（`default_allowed`） | 否；nullable | strict JSON `null`/opaque ref；allowlisted env 仅可提供合法 ref，不接受空字符串伪 null | startup/cold registration intent | 新 composition 按正式 contract/capability 决定是否注册 | opaque-ref | null → 未注册；非法 → startup fail-fast；合同未闭合 → blocked，不报 bound | conditional consumer composition |
| `operations.materialSourceConsumerRef` → `materialSourceConsumerRef` | `Optional<SyncAdapterBindingRef>` | `null`（`default_allowed`） | 否；nullable | strict JSON `null`/opaque ref；allowlisted env ref | startup/cold registration intent | 新 composition 按 source event contract 决定是否注册 | opaque-ref | null → 未注册；非法 → startup fail-fast；source contract 未闭合 → blocked | conditional consumer composition |
| `operations.reviewDecisionConsumerRef` → `reviewDecisionConsumerRef` | `Optional<SyncAdapterBindingRef>` | `null`（`default_allowed`） | 否；nullable | strict JSON `null`/opaque ref；allowlisted env ref | startup/cold registration intent | 新 composition 按 decision event contract 决定是否注册 | opaque-ref | null → 未注册；非法 → startup fail-fast；Decision contract 未闭合 → blocked | conditional consumer composition |
| `operations.jobRunnerRef` → `jobRunnerRef` | `Optional<SyncAdapterBindingRef>` | `null`（`default_allowed`） | 否；nullable | strict JSON `null`/opaque ref；allowlisted env ref | startup/cold registration intent；显式 job entry | 新 composition 暴露显式 runner seam；不启动 daemon/schedule | opaque-ref | null → 无 runner；非法 → startup fail-fast；runner contract 未闭合 → current job rejected/blocked | explicit job entry |

## 5. 按配置域组织的配置项批次表

| 配置域 / 批次 | Step 3 控制面 | Step 4 分类 | Step 5 来源规则 | Step 6 profile 差异 | 03 影响判定 |
|---|---|---|---|---|---|
| `identity`（2） | candidate identity & profile | startup/cold；profile 的 entry-local selector 仅限显式选择 | `configRef` 只接受 selected JSON 并做 canonical 校验；`profileRef` 可有 allowlisted selector，冲突 reject | 四个 P0 profile 必须显式 ref；profile 不隐式选业务对象 | 无回写；承接 `configRef/profileRef` |
| `boundary`（5） | boundary & execution budget | startup/cold；请求本身仍是 entry-local | strict JSON + allowlisted env；无默认，非法高优先级不回退 | 全部 P0 profile 共用安全上限语义；replay 也不得扩大 scope | 无回写；承接 `SyncBoundaryLimits` |
| `execution`（8） | boundary & execution budget | startup/cold | strict JSON + allowlisted env；无 generic retry/default infinity | 全部 profile 共用 timeout/result mapping；replay 不自动重放 | 无回写；承接 `SyncExecutionBudgets` |
| `jobs`（2） | job budget & explicit operations | startup 校验 + `job_run_start_pinned` | strict JSON/env；run-local 只能 pin 显式 bounded 值 | `ci-test` deterministic；`operations-replay` 需 bounded replay input；不创建 scheduler | 无回写；承接 `SyncJobBudgets` |
| `metadata`（3） | local metadata & runtime binding | startup/cold + sensitive opaque ref + test-only ref | strict JSON/env opaque ref；无 durable backend 默认 | local/CI 可 test/in-memory composition；integration/replay positive atomicity 仍受 `SYNC-UP-006` | 无回写；承接 `SyncMetadataBindings` |
| `sdk`（7） | platform SDK / owner/source/review | startup/cold + sensitive opaque ref + test-only negative double | strict JSON/env ref；credential resolver 不参加 raw precedence | local/CI fake/blocked；integration-like controlled；source/handoff/permission blockers 保留 | 无回写；承接 `SyncSdkBindings` |
| `localTools`（5） | local Git/filesystem | startup/cold + sensitive opaque ref + test-only ref | strict JSON/env typed ref；不提供命令/remote/merge 字段 | local/CI controlled observation；Git/LFS/shallow/GUI/dirty safety positive 仍 blocked/waiting | 无回写；承接 `SyncLocalToolBindings` |
| `support`（6） | support/safety providers | startup/cold + diagnostic/redaction + test-only deterministic | strict JSON/env ref；redaction 只能收紧 | 全 profile 必须保留 safe output；CI 可 deterministic provider，不产生 evidence | 无回写；承接 `SyncSupportBindings` |
| `operations`（4） | job budget & explicit operations | peripheral registration intent；nullable | default `null`，合法 ref 仅 registration intent | local/CI 可 null；integration/replay 需显式 bounded runner；未来 profile 不自动注册 | 无回写；承接 `SyncOperationsBindings` |

批次之间不得互相 fallback：metadata ref 不替代 SDK ref，profile 不替代 source/target，job budget 不替代 execution budget，support ref 不替代 capability。任何 ref 的存在都必须在 03 的 capability validation 中重新分类为 `bound | blocked | unsupported | unknown`。

## 6. 严格 JSON module demos 与逐模块说明

> 以下每个代码块都是严格 JSON（无注释），仅展示 candidate shape。示例值是 `documentation candidate`，不是实际 ref、实例、默认或测试结果。

### 6.1 `identity`

```json
{
  "identity": {
    "configRef": "doc-candidate:sync-config",
    "profileRef": "doc-candidate:profile-local-dev"
  }
}
```

| 配置项 | 类型 | 示例值（documentation candidate） | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `identity.configRef` | opaque config ref | `doc-candidate:sync-config` | 标识候选身份 | 不得包含 raw document、secret、endpoint 或 body；须与 canonical candidate 一致 | 缺失/不一致 → startup fail-fast |
| `identity.profileRef` | opaque profile ref | `doc-candidate:profile-local-dev` | 选择 Step 6 语义 profile | 必须映射到 `local-dev`/`ci-test`/`integration-like`/`operations-replay` 之一；不得隐式选择 project/version/source/target | unknown/selector 冲突 → reject |

### 6.2 `boundary`

```json
{
  "boundary": {
    "maxRequestBytes": 1048576,
    "maxPageItems": 100,
    "maxPathScopeItems": 1000,
    "maxTargetScopeItems": 100,
    "maxDiagnosticItems": 200
  }
}
```

| 配置项 | 类型 | 示例值（documentation candidate） | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `boundary.maxRequestBytes` | positive bytes | `1048576` | 请求解码上限 | finite safe integer `>0`；不允许无限/零/overflow | invalid → startup fail-fast；请求超限 → entry rejected |
| `boundary.maxPageItems` | positive items | `100` | 查询分页上限 | 不 silent clamp；超限请求必须显式拒绝或按 03 bounded result | invalid → startup fail-fast |
| `boundary.maxPathScopeItems` | positive paths | `1000` | path scope 上限 | 不截断后宣称完整 clone/pull/status/push-review | invalid/超限 → fail-closed |
| `boundary.maxTargetScopeItems` | positive targets | `100` | job target scope 上限 | `jobs.maxBatchItems` 不得大于此值 | invalid/关系非法 → startup/job reject |
| `boundary.maxDiagnosticItems` | positive records | `200` | safe diagnostic 数量上限 | 输出始终 bounded；不生成 evidence/report | invalid/超限 → startup fail-fast 或 degraded output |

### 6.3 `execution`

```json
{
  "execution": {
    "localReadTimeout": 5000,
    "localCommitTimeout": 10000,
    "metadataLockAcquireTimeout": 3000,
    "sdkReadTimeout": 8000,
    "externalEffectTimeout": 15000,
    "localToolEffectTimeout": 15000,
    "shutdownTimeout": 5000,
    "maxConcurrentMutations": 1
  }
}
```

| 配置项 | 类型 | 示例值（documentation candidate） | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `execution.localReadTimeout` | positive ms | `5000` | local metadata read budget | >0；timeout 映射由 03 决定 | invalid → startup fail-fast；调用 timeout → unavailable/unknown |
| `execution.localCommitTimeout` | positive ms | `10000` | UoW commit budget | >0；不能将 timeout 改成 success/absent | invalid → startup fail-fast；commit unknown 保留 |
| `execution.metadataLockAcquireTimeout` | positive ms | `3000` | target lock acquire budget | >0；不表示已持锁 | invalid → startup fail-fast；lock unknown → blocked |
| `execution.sdkReadTimeout` | positive ms | `8000` | owner/source/decision read budget | >0；不本地 allow | invalid → startup fail-fast；read unavailable/unknown |
| `execution.externalEffectTimeout` | positive ms | `15000` | handoff/probe effect budget | >0；无 blind retry | invalid → startup fail-fast；outcome unknown |
| `execution.localToolEffectTimeout` | positive ms | `15000` | Git/fs apply budget | >0；partial/unknown 不重放 | invalid → startup fail-fast；affected route blocked |
| `execution.shutdownTimeout` | positive ms | `5000` | bounded shutdown budget | >0；不取消并伪造 terminal result | invalid → startup fail-fast；在途保留 unknown |
| `execution.maxConcurrentMutations` | positive items | `1` | mutation concurrency ceiling | >0；不替代 lock/version；不得超过实现/环境 ceiling | invalid → startup fail-fast |

### 6.4 `jobs`

```json
{
  "jobs": {
    "maxBatchItems": 50,
    "maxParallelItems": 1
  }
}
```

| 配置项 | 类型 | 示例值（documentation candidate） | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `jobs.maxBatchItems` | positive items | `50` | 单次显式 job 的批量上限 | `<= boundary.maxTargetScopeItems`；run 内 immutable | invalid/关系非法 → startup 或 current job rejected |
| `jobs.maxParallelItems` | positive items | `1` | 单次显式 job 的并行上限 | 不得超过 composition concurrency ceiling；每 item 独立 UoW/version | invalid/无法安全判定 → reject |

### 6.5 `metadata`

```json
{
  "metadata": {
    "storeAdapterRef": "doc-candidate:metadata-store",
    "unitOfWorkAdapterRef": "doc-candidate:metadata-uow",
    "lockAdapterRef": "doc-candidate:metadata-lock"
  }
}
```

| 配置项 | 类型 | 示例值（documentation candidate） | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `metadata.storeAdapterRef` | opaque adapter ref | `doc-candidate:metadata-store` | 选择 logical `.qs-sync` store adapter | 不锁 physical schema；需逐项验证 typed stores/version/append/replay | malformed → startup fail-fast；contract 未闭合 → blocked/unknown |
| `metadata.unitOfWorkAdapterRef` | opaque adapter ref | `doc-candidate:metadata-uow` | 选择 local UoW | 必须能表达 atomic visibility 与 commit unknown | malformed → startup fail-fast；mutation blocked |
| `metadata.lockAdapterRef` | opaque adapter ref | `doc-candidate:metadata-lock` | 选择 target lock adapter | 不以 ref 代替 lease/expiry/unknown contract | malformed → startup fail-fast；local effect blocked |

### 6.6 `sdk`

```json
{
  "sdk": {
    "sdkProfileRef": "doc-candidate:sdk-profile",
    "credentialProviderRef": "doc-candidate:credential-provider",
    "ownerAccessAdapterRef": "doc-candidate:owner-access",
    "materialSourceAdapterRef": "doc-candidate:material-source",
    "reviewHandoffAdapterRef": "doc-candidate:review-handoff",
    "reviewDecisionReadAdapterRef": "doc-candidate:review-decision-read",
    "recoveryProbeAdapterRef": "doc-candidate:recovery-probe"
  }
}
```

| 配置项 | 类型 | 示例值（documentation candidate） | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `sdk.sdkProfileRef` | opaque adapter ref | `doc-candidate:sdk-profile` | 选择 SDK 语境 | 不隐式选业务对象；精确 surface/version 留 `SYNC-UP-001` | malformed → fail-fast；surface blocked → capability blocked |
| `sdk.credentialProviderRef` | opaque credential ref | `doc-candidate:credential-provider` | 选择凭据解析入口 | 只存 ref；raw token/cert/provider body 禁止 | malformed → fail-fast；resolver unavailable → blocked/unknown |
| `sdk.ownerAccessAdapterRef` | opaque adapter ref | `doc-candidate:owner-access` | 读取 owner 权限/posture | 不本地生成 allow/deny | malformed → fail-fast；权限未知 → fail-closed |
| `sdk.materialSourceAdapterRef` | opaque adapter ref | `doc-candidate:material-source` | 读取 Artifact/Workspace material source | 不定义 source authority/comparator/gap fallback | malformed → fail-fast；source route blocked |
| `sdk.reviewHandoffAdapterRef` | opaque adapter ref | `doc-candidate:review-handoff` | review handoff seam | ACK 不等于 accepted；不自动重试 | malformed → fail-fast；effect unknown/blocked |
| `sdk.reviewDecisionReadAdapterRef` | opaque adapter ref | `doc-candidate:review-decision-read` | 读取外部 Decision | 不创建或覆盖 Decision | malformed → fail-fast；unavailable/unknown fail-closed |
| `sdk.recoveryProbeAdapterRef` | opaque adapter ref | `doc-candidate:recovery-probe` | formal recovery probe seam | 不用 probe 结果伪造 effect 或 accepted | malformed → fail-fast；probe 未闭合 → manual/unknown |

### 6.7 `localTools`

```json
{
  "localTools": {
    "gitObservationAdapterRef": "doc-candidate:git-observation",
    "gitWorktreeAdapterRef": "doc-candidate:git-worktree",
    "filesystemInspectionAdapterRef": "doc-candidate:filesystem-inspection",
    "filesystemApplyAdapterRef": "doc-candidate:filesystem-apply",
    "allowedTargetRootPolicyRef": "doc-candidate:allowed-target-root-policy"
  }
}
```

| 配置项 | 类型 | 示例值（documentation candidate） | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `localTools.gitObservationAdapterRef` | opaque adapter ref | `doc-candidate:git-observation` | Git status/observation seam | 不启用 remote/LFS/shallow/GUI 推断 | malformed/tool unknown → blocked/unknown |
| `localTools.gitWorktreeAdapterRef` | opaque adapter ref | `doc-candidate:git-worktree` | local typed apply seam | 不提供 merge/rebase/push/stash/shell | malformed/unsafe → apply blocked |
| `localTools.filesystemInspectionAdapterRef` | opaque adapter ref | `doc-candidate:filesystem-inspection` | path/symlink/dirty inspection seam | unknown root/path 不得继续 | malformed/unknown → entry blocked |
| `localTools.filesystemApplyAdapterRef` | opaque adapter ref | `doc-candidate:filesystem-apply` | non-overwrite filesystem apply seam | 必须保留 user changes 与 partial/unknown | malformed/contract missing → apply blocked |
| `localTools.allowedTargetRootPolicyRef` | opaque path-policy ref | `doc-candidate:allowed-target-root-policy` | 允许目标根策略引用 | raw path 不入 config；不能扩大 scope | malformed/unsafe → entry rejected |

### 6.8 `support`

```json
{
  "support": {
    "diagnosticsAdapterRef": "doc-candidate:diagnostics",
    "redactionPolicyRef": "doc-candidate:redaction-policy",
    "clockAdapterRef": "doc-candidate:clock",
    "idAdapterRef": "doc-candidate:id",
    "digestAdapterRef": "doc-candidate:digest",
    "digestAlgorithmRef": "doc-candidate:digest-algorithm"
  }
}
```

| 配置项 | 类型 | 示例值（documentation candidate） | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `support.diagnosticsAdapterRef` | opaque adapter ref | `doc-candidate:diagnostics` | safe diagnostic sink | sink 不得生成 evidence/readiness | malformed → startup fail-fast；sink failure 隔离 |
| `support.redactionPolicyRef` | opaque redaction ref | `doc-candidate:redaction-policy` | forbidden-field deny policy | 只能收紧；必须覆盖 secret/body/path/output 禁止项 | missing/unsafe → startup fail-fast；不构造可写 graph |
| `support.clockAdapterRef` | opaque adapter ref | `doc-candidate:clock` | Clock provider | test deterministic 只在 test composition | malformed → startup fail-fast |
| `support.idAdapterRef` | opaque adapter ref | `doc-candidate:id` | ID provider | 不以时间/Git commit替代 | malformed → startup fail-fast |
| `support.digestAdapterRef` | opaque adapter ref | `doc-candidate:digest` | digest provider | 必须与 algorithm/ref 语义一致 | malformed → startup fail-fast |
| `support.digestAlgorithmRef` | opaque algorithm ref | `doc-candidate:digest-algorithm` | digest algorithm identity | 不得隐式切换或把 digest 当 Artifact/Baseline | invalid/incompatible → startup fail-fast |

### 6.9 `operations`

```json
{
  "operations": {
    "accessOrPostureConsumerRef": null,
    "materialSourceConsumerRef": null,
    "reviewDecisionConsumerRef": null,
    "jobRunnerRef": null
  }
}
```

| 配置项 | 类型 | 示例值（documentation candidate） | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `operations.accessOrPostureConsumerRef` | nullable opaque ref | `null` | access/posture consumer registration intent | 不定义 topic/schema/daemon；ref 不等于 bound | null → 未注册；非法 → fail-fast；合同未闭合 → blocked |
| `operations.materialSourceConsumerRef` | nullable opaque ref | `null` | material source consumer registration intent | 不定义 source truth/cursor | null → 未注册；非法/合同缺失 → reject/blocked |
| `operations.reviewDecisionConsumerRef` | nullable opaque ref | `null` | review decision consumer registration intent | 不把 event/ACK 当 accepted | null → 未注册；非法/合同缺失 → reject/blocked |
| `operations.jobRunnerRef` | nullable opaque ref | `null` | explicit job runner registration intent | 不启动 schedule/daemon，不生成 actor/scope/key | null → 无 runner；非法 → fail-fast；未闭合 → current job rejected |

## 7. 完整配置 demo（JSONC 文档示例）

下面的代码块故意使用 `jsonc` 仅作文档说明。实际运行配置必须删除所有注释并使用严格 JSON；解析器不得因为“文档示例有注释”而放宽 strict JSON。所有值都只是 `documentation candidate`，不能解释为已存在的实例、默认值、SLO、测试结果、artifact、report、evidence、review verdict、signoff 或 readiness。

```jsonc
{
  // documentation candidate only; raw runtime must use strict JSON.
  "identity": {
    "configRef": "doc-candidate:sync-config", // opaque identity, not raw config
    "profileRef": "doc-candidate:profile-local-dev" // semantic profile, not deployment
  },
  "boundary": {
    "maxRequestBytes": 1048576, // documentation candidate; not an operational default
    "maxPageItems": 100,
    "maxPathScopeItems": 1000,
    "maxTargetScopeItems": 100,
    "maxDiagnosticItems": 200
  },
  "execution": {
    "localReadTimeout": 5000, // milliseconds; candidate only
    "localCommitTimeout": 10000,
    "metadataLockAcquireTimeout": 3000,
    "sdkReadTimeout": 8000,
    "externalEffectTimeout": 15000,
    "localToolEffectTimeout": 15000,
    "shutdownTimeout": 5000,
    "maxConcurrentMutations": 1
  },
  "jobs": {
    "maxBatchItems": 50,
    "maxParallelItems": 1
  },
  "metadata": {
    "storeAdapterRef": "doc-candidate:metadata-store",
    "unitOfWorkAdapterRef": "doc-candidate:metadata-uow",
    "lockAdapterRef": "doc-candidate:metadata-lock"
  },
  "sdk": {
    "sdkProfileRef": "doc-candidate:sdk-profile",
    "credentialProviderRef": "doc-candidate:credential-provider",
    "ownerAccessAdapterRef": "doc-candidate:owner-access",
    "materialSourceAdapterRef": "doc-candidate:material-source",
    "reviewHandoffAdapterRef": "doc-candidate:review-handoff",
    "reviewDecisionReadAdapterRef": "doc-candidate:review-decision-read",
    "recoveryProbeAdapterRef": "doc-candidate:recovery-probe"
  },
  "localTools": {
    "gitObservationAdapterRef": "doc-candidate:git-observation",
    "gitWorktreeAdapterRef": "doc-candidate:git-worktree",
    "filesystemInspectionAdapterRef": "doc-candidate:filesystem-inspection",
    "filesystemApplyAdapterRef": "doc-candidate:filesystem-apply",
    "allowedTargetRootPolicyRef": "doc-candidate:allowed-target-root-policy"
  },
  "support": {
    "diagnosticsAdapterRef": "doc-candidate:diagnostics",
    "redactionPolicyRef": "doc-candidate:redaction-policy",
    "clockAdapterRef": "doc-candidate:clock",
    "idAdapterRef": "doc-candidate:id",
    "digestAdapterRef": "doc-candidate:digest",
    "digestAlgorithmRef": "doc-candidate:digest-algorithm"
  },
  "operations": {
    "accessOrPostureConsumerRef": null,
    "materialSourceConsumerRef": null,
    "reviewDecisionConsumerRef": null,
    "jobRunnerRef": null
  }
}
```

完整 demo 的 raw leaf 计数为：`identity 2 + boundary 5 + execution 8 + jobs 2 + metadata 3 + sdk 7 + localTools 5 + support 6 + operations 4 = 42`。任何额外顶层 section、未知 key、alias key、重复 key、注释残留或 forbidden field 都不属于本 schema，应按 Step 5 whole-candidate reject 处理。

## 8. 每个配置域停审记录

| 配置域 | 42-leaf 覆盖 | 来源/默认/失败策略 | profile 差异 | 03 影响 | 停审结论 |
|---|---:|---|---|---|---|
| `identity` | 2/2 | configRef/profileRef required；无隐式 default；selector conflict reject | 四个 P0 profile 必须显式选择；不隐式选业务对象 | 只承接既有 refs | 通过（带上游 blocker） |
| `boundary` | 5/5 | 全部 required、无默认；strict JSON/env；超限 fail-closed | 全 profile 共用安全边界，replay 不扩大 | 只承接 `SyncBoundaryLimits` | 通过（带上游 blocker） |
| `execution` | 8/8 | 全部 required、无默认；timeout 不改变 result layer | 全 profile 共用 known/unknown 语义 | 只承接 `SyncExecutionBudgets` | 通过（带上游 blocker） |
| `jobs` | 2/2 | required；run-start pin；关系非法 reject | CI/replay 需 deterministic/bounded；不创建 scheduler | 只承接 `SyncJobBudgets` | 通过（带上游 blocker） |
| `metadata` | 3/3 | required opaque refs；contract 未闭合保留 blocked/unknown | local/CI 可 test composition；positive atomicity 受 `SYNC-UP-006` | 无新增 physical schema | 通过（`SYNC-UP-006`） |
| `sdk` | 7/7 | required opaque refs；credential ref-only；高优先级非法不回退 | local/CI fake/blocked；integration-like controlled；不升级 owner truth | 无新增 SDK surface | 通过（`SYNC-UP-001~005/008`） |
| `localTools` | 5/5 | required opaque refs；不提供命令/remote/merge | local/CI controlled；LFS/shallow/GUI 和 unsafe apply 不进入正向 | 无新增 Git/fs API | 通过（`SYNC-UP-007/009/010`、`SYNC-LOCAL-*`） |
| `support` | 6/6 | required opaque refs；redaction 不能放宽；无 raw output | 全 profile safe；test 可 deterministic，不产出 evidence | 无新增 telemetry truth | 通过（带上游 blocker） |
| `operations` | 4/4 | nullable default `null`；ref 只 registration intent | local/CI 可 null；无 daemon/隐式 job | 无新增 consumer/topic/scheduler contract | 通过（带上游 blocker） |

逐域停审结论：所有 leaf 均能回指既有 family、类别、source 和失败边界；没有把 ref 存在当成 `bound`，也没有用 profile/fake/ACK/log 关闭上游 blocker。允许进入 Step 8。

## 9. 跨配置项闭环审计

| 审计项 | 结论 | 证据 / 修正 |
|---|---|---|
| 是否完整覆盖 03 的 42 个 leaf | 通过 | §4 十列表、§6 demos、§7 完整 JSON 均计数 42；无新增 code-level leaf |
| 是否出现重复项、同义 alias 或重复 raw path | 无 | 每个 canonical path 仅出现一次；`identity` 是文档分组，不改变 code property 名 |
| 是否把不同功能揉入泛化 `runtime/common/misc/storage` | 无 | 使用 `identity/boundary/execution/jobs/metadata/sdk/localTools/support/operations` 九个功能 section |
| required leaf 是否都有失败策略 | 通过 | 38 个 non-nullable leaf 全部写明 startup/current-entry/job fail-fast；四个 optional 也写明 null/invalid/blocked |
| sensitive/ref-only 分类是否遗漏 | 无 | credential、owner/source/handoff/decision/probe、root policy、metadata durable ref、redaction ref 均明确 opaque/sensitive-ref；raw material 永久拒绝 |
| profile 差异是否遗漏 | 通过 | §5 与每域停审回指 Step 6 四个 P0 profile；future profile 不进入 schema |
| 普通来源优先级是否漂移 | 无 | 全部继承 `approved default < selected strict JSON < allowlisted env`；configRef 例外为 identity 校验，operations 允许 null |
| 高优先级非法值是否 silent fallback | 无 | 存在即 fail-fast/current-entry reject；不回退低优先级 |
| entry-local 是否覆盖全局配置、actor、scope、state 或 owner truth | 不允许 | profile selector 只选当前入口；request 仍走 03 DTO/权限/dirty/path/idempotency guard |
| ref 是否被误读成 `bound`、健康、授权或 readiness | 不允许 | 每个 binding failure 和 §5 末尾均保留四态 capability；snapshot 只记录分类事实 |
| 数值示例是否被误读为默认/SLO/测试结果 | 无 | 每个 demo 和本文件开头明确 `documentation candidate`；表格 default 明确“无” |
| operations null 是否被误读成 disabled/ready | 无 | null 只表示未注册；受影响 route 仍 blocked/unsupported/unknown |
| metadata leaf 是否偷渡 `.qs-sync` physical schema/retention | 无 | 仅 logical adapter refs；`SYNC-UP-006` 保持 blocker |
| SDK/source leaf 是否偷渡 endpoint/method/DTO/source authority | 无 | 仅 opaque refs；`SYNC-UP-001/002/004/005/008` 保持 blocker |
| Git/fs leaf 是否偷渡 auto merge/rebase/push、LFS/shallow/GUI | 无 | only typed adapter/root-policy refs；历史选择不进 schema |
| support leaf 是否允许关闭 redaction 或生成 evidence | 不允许 | redaction policy 只能收紧；diagnostics sink 与 business result 隔离 |
| 是否需要回写 03 | 当前不需要 | 只细化 raw candidate/default/source 语义；没有新增 type/Port/DTO/error/state/flow。若未来需要 hot reload、remote source、generic retry 或新 slot，必须先回流 03 |

## 10. 对详细设计的影响判定与回填草稿

### 10.1 影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 处理状态 |
|---|---|---|---|
| raw section 只映射既有 42 个 leaf | 否 | 03 code shape 的 raw representation 细化 | `无回写` |
| 38 个 leaf 无默认，四个 operations slot 仅 default `null` | 否 | 既有“无隐式默认”和 Optional carrier 的配置展开 | `无回写` |
| 普通 source 继承 Step 5；configRef 额外做 canonical identity 校验 | 否 | loader/validator 细节，不新增 public API | `无回写` |
| job budgets 在 run start pin，旧 operation/plan/candidate/attempt 继续用旧 snapshot | 否 | 承接既有 immutable context 规则 | `无回写` |
| ref 语法合法但合同未闭合时保留 blocked/unknown | 否 | 承接四态 capability 与 blocker 纪律 | `无回写` |
| 若未来要求 remote/config-center source、hot reload、dynamic adapter replacement、generic retry、topic/schema/scheduler leaf | 是（未来触发） | 会改变 loader/composition/lifecycle/operations contract | 必须先回流 03 §4/§13 及相应 Step，再重开 04 |

当前计数：`待回写=0`；`阻塞待确认=0`（外部 blocker 不等于本 Step 的 03 回写项）。

### 10.2 正式 §7 回填草稿

正式 `04-配置设计.md` §7 应按下列顺序装配本产物：

1. 42 个 leaf 十列表（保留“无默认；required”与四个 nullable `null` 例外）。
2. 九个功能 section 的 raw mapping 与 module demo；项目本地配置不重复项目名前缀。
3. 严格 JSON module demo 与完整 JSONC 文档示例，明确实际运行 JSON 不得含注释。
4. 每域停审、跨项审计、profile/source/03 回指和上游 blocker 声明。

正式正文不得把 documentation candidate 数字/ref 写成已部署 profile、operational default、SLO、测试结果、artifact、report、evidence、review accepted、signoff 或 readiness。

## 11. 待确认事项（不阻塞本 Step）

| 事项 | 对后续 Step 的影响 | 当前处理 |
|---|---|---|
| `configRef` 是否由外部 caller 产生还是由未来 loader 生成 canonical identity | Step 9 identity validation、Step 10 audit | 本 Step 固定“候选显式提供并校验”；若改为生成，须回流 03/04 重新定 raw shape，不静默改变 |
| `profileRef` 最终 raw encoding / registry | Step 9 profile validation | 仅固定四个语义 profile；opaque encoding 为 documentation candidate |
| exact numeric ceilings、单位上限和 environment allowlist | Step 9 cross-field/source validation；Step 11 failure register | 本 Step 只要求 positive safe integer 与已知关系；未确认处不写生产数值/SLO |
| `.qs-sync` physical schema、atomic/crash/retention | Step 8/9/13/07 | 只保留 logical refs；`SYNC-UP-006` 持续 blocker |
| SDK/source/permission/handoff/probe exact surface | Step 8/9/11 | ref-only；`SYNC-UP-001~005/008` 持续 blocker |
| Git executable/library、LFS/shallow/GUI support matrix | Step 8/9/07 | typed adapter refs；`SYNC-UP-007/009/010` 与 `SYNC-LOCAL-*` 持续 blocker |
| operations consumer/job formal contract | Step 12/13 | nullable intent；不自动注册、不创建 scheduler |

这些事项不会把示例升级为实例，也不会阻塞 Step 7 停审；任何新 code shape 或 positive capability 必须先回流对应详细设计。

## 12. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| 42 个既有 code-level leaf 全部列入十列表 | pass |
| 每个 required leaf 有默认口径、来源、作用域、生效方式、敏感级别、失败策略和关联模块 | pass |
| 四个 nullable operations slot 明确 `null` 语义和失败策略 | pass |
| 批次表逐项回指 Step 3/4/5/6 与 03 影响 | pass |
| module demo 按功能边界拆分，无泛化 `runtime/common/misc/storage` | pass |
| module demo 为严格 JSON；完整示例明确 JSONC 仅作文档、运行时必须去注释 | pass |
| 所有数字/ref/profile 值标为 documentation candidate，不伪造实例/默认/SLO/测试结果 | pass |
| 高优先级非法值、重复/alias/unknown/forbidden key、ref unresolved 策略可判定 | pass |
| sensitive/raw body/path/credential/output/evidence 边界无遗漏 | pass |
| profile 差异、test double ceiling、operations null 和 capability 四态无误读 | pass |
| 03 影响判定无待回写、无阻塞待确认 | pass |
| 未创建正式 04、未创建 Step 8 文件、未实现/测试/提交 | pass |

### Step 7 结论

`gate_status = pass_with_upstream_blockers`；`Step status = completed / stop_review`。允许进入 `04_config_step_08_sensitive_secrets.md`。正式 `04-配置设计.md` 仍不存在，且本轮不进入 Step 8，直到用户/流程允许继续。
