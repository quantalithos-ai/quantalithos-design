# L2-tools 04 配置设计 Step 9：配置加载、校验与生效机制

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 9
> 对应书写规范：`standards/document/配置设计书写规范.md` §5.9
> 回填目标：`projects/L2-tools/04-配置设计.md` §9
> 状态：`completed / pass; continuous authorization`
> 模式：`full-restart / single-agent-serial`

## 1. Step 状态与 Step 内计划

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 9 定义 source load、strict parse、typed/cross-section validation、runtime assembly 与 activation。 |
| 前序门禁 | Step 7/8 已闭合 54 items、ref-only 敏感处理和 no-output。 |
| 本步状态 | `completed / pass; continuous authorization` |
| 正式文档写入 | 关闭；本文件只形成正式 §9 回填草稿。 |
| blocker | 无新增；外部 positive seam 继续由 `L2T-UP-001~009` 阻塞，合法配置只能装配 blocked-aware adapter。 |
| 下一动作 | 按连续授权进入 Step 10 变更、审计与回滚。 |
| 提交 | 不需要。 |

### 1.1 Step 内计划

- [x] 读取 SOP Step 9、书写规范 §5.9、Step 5/7/8 和 `03` §13.2~§13.9。
- [x] 固定 raw source owner、strict JSON、来源 merge 与 source attribution。
- [x] 定义 structural/type/section/cross-section/capability/redline validation 顺序。
- [x] 按 21 配置域定义 parse、type、cross-field、assemble target 和失败策略。
- [x] 定义 builder stage、entry/job snapshot、failure atomicity 和 activation barrier。
- [x] 完成逐域停审、跨加载校验审计和 `03` 影响判定。

## 2. 本步目标与边界

本 Step 把 `03` 中的 planned loader/builder 顺序落实为可实现的配置算法，但不新增 public DTO、Rust error variant、adapter constructor、secret resolver、deployment command 或 backend。唯一 raw reader 是 `infra/config.rs`；唯一全局 graph builder 是 `infra/runtime_builder.rs`。

P0 只有四类生效语义：`static` 安全不变量、`startup` 全局冻结、`entry-local` 当前入口 selector、`job-startup` 当前 Job snapshot。没有 reload、hot、config center、admin override、watcher 或 online last-known-good。

## 3. 本步输入

| 输入 | 已确认结论 | 本步用途 |
|---|---|---|
| Step 5 | 普通来源 `D < F < E`；非法高优先级来源不回退；R/X/L 独立。 | 固定 merge 与 conflict 阶段。 |
| Step 7 | 十 root、21 domain、54 canonical items、default/required/scope/failure。 | 逐域定义 validation/assembly。 |
| Step 8 | ref-only、no material、new assembly rotation、fixed safe output。 | 敏感校验与 issue surface。 |
| `03` §13.2 | Candidate/runtime types与八类 typed config error。 | 不新增错误模型。 |
| `03` §13.3 | loader/builder 固定顺序。 | 细化 phase 与 activation barrier。 |
| `03` §13.4~§13.8 | Store/UoW/sidecar/Port/fallback/timeout/redline。 | cross-section/capability predicates。 |
| `03` §15.8 | `L2T-CFG-001~007`。 | 下游测试切口和 gate。 |

## 4. SOP 问题逐项回答

### 4.1 何时加载？

全局配置在 runtime assembly 开始前加载一次并冻结。API/worker entry 只能选择已验证的完整 profile/config snapshot；Job 在 run 开始前冻结 scope/target/bounds snapshot。运行中不重读 file/env/ref，不把一次 entry/job selector 写回全局配置。

### 4.2 如何 parse 和 type validate？

严格 JSON parser 必须拒绝 comment、trailing comma、duplicate key、unknown root/field、未登记 alias、null 替代必填、类型 coercion、非有界值、raw secret/forbidden body。allowlisted env 逐 canonical leaf 解码；值存在但非法即失败，不能回退 file/default。解析错误只映射 stable issue kind/ref，不输出原文或原值。

### 4.3 哪些需要 cross-field validate？

至少覆盖：profile/fixture/Clock-ID、七 Store/UoW/pair capability、idempotency/retention/replay、projection/job registration、Job kind/scope/bounds、adapter mode/ref/blocker、feature/adapter/target、handoff one-call/unknown fence、body/redaction floor、schema version、source/profile selector。完整矩阵见 §8.4。

### 4.4 如何生效？

- `startup`：完整 candidate 通过所有校验并构建全 graph 后一次暴露；中途无 partial exposure。
- `entry-local`：从已验证集合中选择完整 snapshot；非法只拒绝当前 entry。
- `job-startup`：Job 开始前从已验证 global config 派生 bounded snapshot；非法只拒绝当前 Job。
- `static`：安全/事实红线不是值；任何试图配置的 key/source 均 `UnsafeOverrideAttempt`。
- `reload/hot`：P0 unsupported；出现请求或字段即拒绝。

### 4.5 校验失败如何处理？

parse/type/required/cross-section/capability/redline 任一失败都不产生 `ToolsRuntimeConfig`，builder 不启动或丢弃 partial graph，不暴露 entry bundle。entry/job selector 失败只拒绝当前作用域。合法 blocked-aware adapter 是可装配的保守结果，但不能升级外部正向能力；这与 config-invalid 不同。

### 4.6 是否影响 `03`？

不影响。本 Step 只细化既有 loader、validator、builder、typed error 和 lifecycle；未新增成功分支或 callable。若实现需要新的 candidate field/error/Port/constructor/hot lifecycle，必须先回写 `03`。

## 5. 当前材料诊断与改动前后对比

| 项 | 本步前 | 本步后 |
|---|---|---|
| strict parse | 有 no-body/secret 与 typed error | 明确 duplicate/unknown/comment/trailing/null/coercion/alias 拒绝和 value-free issue。 |
| validation | 有 section/cross-section 总顺序 | 形成 V0~V8 和 21 域可执行矩阵。 |
| builder | 有组件顺序 | 形成 B0~B8、partial disposal 和 entry exposure barrier。 |
| scope | 有 startup/entry/job 标签 | 明确 entry/job 只能选 snapshot，不参与 global merge。 |
| external blocked | 可能与 invalid config 混淆 | config-valid blocked-aware 与 invalid/ref-missing 明确分开。 |

## 6. 设计取舍

| 议题 | 选择 | 原因 |
|---|---|---|
| parser 是否宽容 JSONC/alias/coercion | 不宽容 | 文档 JSONC 不能变 runtime format；避免隐式迁移和漂移。 |
| 是否聚合多个 issue | 可以聚合 deterministic safe issue refs | 提高诊断性，但不得携带 raw value或依赖构造结果。 |
| required external blocker 是否阻止整个 local graph | 合法 blocked-aware slot 可装配 | 保持 local/negative surface；正向 flow fail-closed。 |
| builder 是否边建边暴露 | 否 | 防止 partial runtime 接受请求。 |
| entry/job 是否覆盖 global item | 否 | selector/snapshot 保持配置 identity 和 graph 一致。 |
| feature disabled 是否跳过安全校验 | 否 | 只跳过外围 registration，核心/红线校验始终运行。 |

## 7. 配置加载流程图

#### 配置加载流程图：L2-tools 配置加载、校验与原子激活

```text
[safe code defaults]
          |
[one selected strict JSON source]
          |
[allowlisted env leaves]
          |
          v
[source merge + ConfigSourceRef]
          |
          v
[V0 structural strict parse]
          |
[V1 primitive/type/bounds]
          |
[V2 section requiredness]
          |
[V3 profile/source/fixture]
          |
[V4 cross-section invariants]
          |
[V5 Store/UoW/replay capability]
          |
[V6 adapter/target/blocker contract]
          |
[V7 sensitive/redline/forbidden override]
          |
[V8 total completeness + config identity]
          |
          v
[immutable ToolsRuntimeConfig]
          |
          v
[B0..B8 runtime graph construction]
          |
     +----+----+
     |         |
 [failure]  [complete]
     |         |
[dispose;   [expose one runtime bundle]
 no entry]      |
          +-----+-----+
          |     |     |
         API  worker jobs
```

关键说明：

- 来源覆盖只发生在 canonical candidate leaf；R/X/L 不成为普通第四覆盖层。
- `ToolsRuntimeConfig` 产生前不得构造 Store/Port；全 graph 完成前不得暴露入口。
- 合法 `Blocked/Unavailable/Unverifiable` adapter 状态不等于配置校验成功后获得 readiness。
- 图不表达部署挂载、进程管理、具体 adapter 产品或真实 activation 结果。

## 8. 结构化中间产物

### 8.1 来源加载与 merge 契约

| 顺序 | 输入 | 处理 | 失败 |
|---:|---|---|---|
| 1 | safe code defaults | 仅填可默认的 bounded non-sensitive item | required ref/truth 不得生成默认。 |
| 2 | selected strict JSON | exact roots/fields decode；保留 duplicate detection | unreadable/malformed/unknown/duplicate/forbidden -> fail-fast。 |
| 3 | allowlisted env | exact canonical leaf 覆盖 file/default | present-invalid/ambiguous mapping -> fail-fast，不回退。 |
| 4 | R ref lane | 只形成 typed opaque ref | raw material/kind mismatch -> fail-fast。 |
| 5 | X fixture lane | 只在 explicit Local/CI profile 合并 | profile mismatch -> fail-fast。 |
| 6 | L selector | 选择完整 validated snapshot 或 Job input | 逐字段 global override -> entry/job reject。 |
| 7 | source attribution | 生成 `ConfigSourceRef` 与 safe source-class map | 不保存 raw source/value。 |

### 8.2 V0~V8 校验顺序

| Phase | 校验内容 | 成功产物 | 失败映射 |
|---|---|---|---|
| V0 structural | document bound、UTF-8/JSON shape、duplicate/unknown/alias/comment/trailing/null/forbidden key | closed raw shape | `InvalidTypedValue` / `UnsafeOverrideAttempt` + safe issue ref。 |
| V1 typed | bool、closed enum/list、opaque ref grammar、bounded policy ref | typed leaves | `InvalidTypedValue`。 |
| V2 section | 十 root、required/conditional field、non-empty/unique list | section candidates | `MissingRequiredSection` / `InvalidTypedValue`。 |
| V3 profile/source | profile exists、source allowed、X only Local/CI、production inactive、Clock/ID match | profile-bound candidate | `CrossSectionConflict` / `UnsafeOverrideAttempt`。 |
| V4 semantic cross-section | feature/target/job/projection/handoff/body/redaction组合 | invariant-safe candidate | `CrossSectionConflict` / `UnsafeOverrideAttempt`。 |
| V5 local capability | seven Store、one UoW、pair/CAS/page/watermark/replay/resolve | local-capable refs | `UnsupportedCapability` / `MissingUnitOfWorkCapability` / `MissingReplaySurface`。 |
| V6 external binding | slot/mode/ref/family/operation/version/blocked category/target separation | blocked-aware adapter plan | `BlockedExternalContract` or config error；不得伪造 Available。 |
| V7 sensitive/redline | raw material/body sweep、safe floor、`NC-L2T-001~025` override sweep | body-free plan | `UnsafeOverrideAttempt` / `InvalidTypedValue`。 |
| V8 completeness | all required slots、enabled registrations、total event key/target set、safe config identity | immutable `ToolsRuntimeConfig` | corresponding typed error；零 runtime exposure。 |

校验顺序不可通过 profile/feature 跳过。V5/V6 可能需要读取 adapter registry 的静态 capability metadata，但不得发起 provider call、external readiness probe 或业务查询。

### 8.3 配置组加载、校验与生效总表

| 配置组 | 加载时机 | 关键校验 | 生效目标 | 失败策略 |
|---|---|---|---|---|
| profile/config identity | startup；selector entry-local | known profile、source lane、redacted-generated | config loader/builder identity | fail-fast / entry-reject。 |
| boundary command/query | startup；bounded selector entry-local | schema list、policy bound、no metadata/visibility override | API/Query validated bundle | fail-fast / entry-reject。 |
| boundary consumer/job | startup；Job bound job-startup | envelope version/bound、closed Job kind/scope | worker/Job registry | fail-fast / job-reject。 |
| seven Stores + UoW | startup | required ref、CAS/key/pair/page/watermark、one authority | Store registry/UoW | fail-fast；no partial graph。 |
| idempotency/replay | startup | claim/result/receipt/report capability、retention floor | sidecar/replay surfaces | fail-fast。 |
| projection | startup；batch job-startup | freshness enum、Job enabled/capability、no Query write | Query projection mapper/Jobs | fail-fast / job-reject / runtime degraded read。 |
| jobs | startup；bounds job-startup | known kind、bounded scope/batch/parallelism、retry category | four bounded runners | fail-fast / job-reject。 |
| external adapters | startup | mode/ref/profile/operation/version/body policy | blocked-aware Port registry | invalid fail-fast；open contract remains blocked。 |
| handoff | startup；target snapshot job-startup | bounded target、one-call phase、side-effect timeout/manual retry | target registry/continuation | fail-fast / job-reject / ineligible。 |
| Clock/ID | startup | independent refs、deterministic mode only Local/CI | ClockPort/IdGeneratorPort | fail-fast。 |
| features | startup | enabled dependency completeness、peripheral-only | registrations | fail-fast/blocked；core semantics remain on。 |
| redaction/diagnostics | startup/static | equal-or-stricter floor、body-free/low-cardinality | validator/diagnostic hooks | fail-closed。 |

### 8.4 按 21 配置域组织的 parse / type / cross-field / assemble 矩阵

| 配置域 | Parse / type | Cross-field predicate | Assemble target | 失败策略 |
|---|---|---|---|---|
| `profile.selection` | closed profile enum | source/profile compatible；P1/P2 inactive | `ToolsProfileRef` | fail-fast。 |
| `config.identity` | only `redacted-generated` | source attribution complete；no raw dump | `ToolsConfigRef` | fail-fast。 |
| `boundary.command` | bound ref + non-empty versions | versions supported；no metadata/identity override | Command guard bundle | startup fail-fast / entry-reject。 |
| `boundary.query` | bound ref + freshness enum | page within policy；no live refresh/write | Query guard/mapper | entry-reject。 |
| `boundary.consumer` | bound ref + versions | envelope versions supported；body-free guard active | worker decoder guard | fail-fast / runtime quarantine。 |
| `boundary.job` | Job enum + bound ref | allowedKinds contains enabledKinds；scope bounded/non-empty when required | Job request guard | fail-fast / job-reject。 |
| `stores.logical` | seven typed refs | exactly seven; each required capability matches surface | logical Store registry | fail-fast。 |
| `stores.uow` | one typed capability ref | one authority covers all owning multi-write flows and outcome/audit pair | `ToolsUnitOfWorkManager` | `MissingUnitOfWorkCapability`。 |
| `idempotency.command_consumer` | sidecar ref + retention class | claim/replay/result/receipt capability；retention meets replay floor | IdempotencyStore surface | `MissingReplaySurface` / fail-fast。 |
| `idempotency.continuation_job` | sidecar ref + retention class | continuation receipt/JobReport stored replay；unknown fence | continuation/job replay | fail-fast。 |
| `projection.read_rebuild` | enums/bool/bound ref | rebuild enabled => ProjectionStore and Job enabled；status refresh matches feature | Query mapper/runners | fail-fast / job-reject。 |
| `jobs.bounded_runner` | closed list + policy refs | enabled subset of boundary kinds；no unbounded retry/scan；report retention valid | four runner registry | fail-fast / job-reject。 |
| `adapters.compile_runtime` | mode/ref | Core candidate blocked unless formal schema；Hub mode keeps source owner | Port registry | blocked-aware / fail-fast for malformed ref。 |
| `adapters.authorization_sandbox` | closed blocked-aware mode | authorization gap fail-closed；Sandbox no host fallback；source mapping required for outcome | Port registry | blocked/unverifiable。 |
| `adapters.collaboration_visibility` | mode/ref | collaboration no route claim；visibility no default-visible | Port registry | route-blocked / Query unavailable。 |
| `handoff.target_set` | bounded unique ref list | feature/Job enabled => eligible target or explicit no-target behavior；adapter separate | target registry | fail-fast / job-reject / ineligible。 |
| `handoff.phase_policy` | typed policy refs | exactly one-call；side-effect timeout；manual resolution after unknown | continuation policy | `UnsafeOverrideAttempt`。 |
| `clock_id.binding` | two refs + bool | both independent；deterministic iff Local/CI X profile | Clock/ID ports | fail-fast。 |
| `features.peripheral` | bools | enablement requires matching Store/Port/target/Job; disabling cannot disable core | registration plan | fail-fast/blocked。 |
| `safety.redaction` | policy ref | floor >= strict；body policy active；no raw/high-cardinality | validator/output guard | fail-closed。 |
| `safety.telemetry` | diagnostic enum | body-free-low-cardinality only；no Observability store/route truth | safe diagnostic mapper | fail-fast。 |

### 8.5 Cross-field gate 总表

| Gate ID | 输入 | 必须成立 | 失败 |
|---|---|---|---|
| `CFG-X-01` | profile + source lanes + Clock/ID | X/deterministic 仅 local-dev/ci-test；integration-like 不隐式 fake | `CrossSectionConflict`。 |
| `CFG-X-02` | seven Store refs + UoW | 每个 surface capability匹配；同一 UoW 支撑 pair/owning flow | `UnsupportedCapability` / `MissingUnitOfWorkCapability`。 |
| `CFG-X-03` | Idempotency refs + retention + flow families | result/receipt/report exact replay 可保存；retention 不低于 obligation | `MissingReplaySurface`。 |
| `CFG-X-04` | boundary.job + jobs.enabledKinds | enabledKinds 是 allowedKinds 子集；未知/重复/空错误 | `CrossSectionConflict`。 |
| `CFG-X-05` | projection flags + jobs/features | rebuild/status registration 只在依赖完整时启用 | fail-fast / explicit blocked。 |
| `CFG-X-06` | adapter mode/ref + profile | ref kind/mode/profile 相容；fake 只 Local/CI；blocked 不伪装 Available | `BlockedExternalContract` / `UnsafeOverrideAttempt`。 |
| `CFG-X-07` | auth/sandbox/source modes | required authorization gap fail-closed；Sandbox-required 无 host path；source gap 无 outcome | blocked-aware plan。 |
| `CFG-X-08` | collaboration/target/features | outbound enabled 时 adapter/target completeness；target != route/delivery | fail-fast/route-blocked。 |
| `CFG-X-09` | handoff phase/timeout/retry | Prepared -> one call -> phase-2；unknown -> manual resolution | `UnsafeOverrideAttempt`。 |
| `CFG-X-10` | redaction/body/diagnostic | equal-or-stricter；no raw body/secret/high cardinality | fail-closed。 |
| `CFG-X-11` | any key/source | 不出现 `NC-L2T-001~025` override、hot/reload/admin/remote/LKG | `UnsafeOverrideAttempt`。 |
| `CFG-X-12` | all enabled slots | required graph total；disabled 只取消外围 registration | fail-fast before exposure。 |

### 8.6 B0~B8 runtime builder 阶段

| Stage | 构造内容 | 前置 gate | 失败原子性 |
|---:|---|---|---|
| B0 | immutable `ToolsRuntimeConfig`、config/profile refs | V0~V8 无 issue | 未产生 runtime object。 |
| B1 | seven logical Store adapters | surface ref/capability complete | 关闭/丢弃已建 adapter；无 entry。 |
| B2 | one UoW + Idempotency/replay sidecars | pair/CAS/claim/replay/resolve capability | 丢弃 B1~B2；不暴露半事务面。 |
| B3 | ClockPort、IdGeneratorPort、visibility resolver | independent/profile-compatible refs | 丢弃 prefix；无 facade。 |
| B4 | Core/Hub/Auth/Sandbox/source Ports | exact slots；open contracts use blocked-aware adapter | 不替换 null/fake；丢弃 prefix。 |
| B5 | collaboration Port、handoff target registry | target/adapter separation、one-call policy | 无外围 registration。 |
| B6 | domain/application facades from owned traits | all owned seams available/blocked as designed | 无 public/worker/job entry。 |
| B7 | API/worker/jobs bundles and peripheral registrations | boundary/jobs/features total | 不启动部分 entry。 |
| B8 | final forbidden-boundary/total-event-key audit | `NC-L2T-001~025` and enabled keys pass | audit failure disposes whole graph。 |
| activate | one runtime bundle exposed | B0~B8 complete | activation 才可接受 entry；不声明真实 readiness test。 |

Builder 构造成功是配置层的 `assembly complete`，不是实现存在、进程 ready、外部 provider ready、测试通过或验收签署。本文件不声明实际 B0~B8 已运行。

### 8.7 生效方式与冻结规则

| 生效方式 | P0 适用 | 冻结点 | 失败范围 | 不允许 |
|---|---|---|---|---|
| `static` | `NC-L2T-*`、body/redaction minimum、phase fences | design/version | entire config rejected | override/emergency/debug bypass。 |
| `startup` | profile、Stores/UoW、sidecars、adapters、features、global bounds | `ToolsRuntimeConfig` before B0 | no runtime bundle | partial activation、old/default fallback。 |
| `entry-local` | complete profile/source selector、bounded query/command selector | entry decode before application call | current entry rejected | leaf override、global mutation、secret read。 |
| `job-startup` | scope、target snapshot、batch/timeout/retry category within global bounds | Job admission before claim/mutation | current Job rejected | mid-run reread、whole-scan expansion、unknown retry。 |
| `reload/hot` | none | not applicable | request/key rejected | live swap、online LKG、watcher。 |

### 8.8 Config validation issue 安全面

| 允许 | 禁止 |
|---|---|
| existing error kind、config source ref、section refs、adapter slot、capability code、blocked category、validation issue ref、diagnostic ref | raw parser message、JSON excerpt、env value、full ref、secret、endpoint/body、backend error、stack trace |

Issue 可按 deterministic ordering 聚合，但同一 candidate 的 issue set 不构成测试证据或 acceptance artifact。具体 report schema 留给 `05`。

### 8.9 加载校验逐域停审记录

| 域组 | required/type | cross-field | assemble/activation | failure/03 | 结论 |
|---|---|---|---|---|---|
| profile/config/boundary | 完整 | source/profile/schema/bounds | config + entry guards | fail-fast/reject；无回写 | 通过 |
| Stores/UoW | 完整 | seven + one authority + pair | B1~B2 | no partial；无回写 | 通过 |
| idempotency/replay | 完整 | replay/retention/unknown | B2 | missing replay fail-fast；无回写 | 通过 |
| projection/jobs | 完整 | registration/scope/bounds | B7 + Job snapshot | fail-fast/job-reject；无回写 | 通过 |
| external adapters | 完整 | mode/ref/profile/blocker | B4 | blocked-aware != ready；无回写 | 通过 |
| collaboration/handoff | 完整 | target/route/one-call | B5/B7 | route-blocked/manual unknown；无回写 | 通过 |
| Clock/ID | 完整 | independent/profile fence | B3 | fail-fast；无回写 | 通过 |
| features/safety | 完整 | dependency/redline | B7/B8 | fail-closed；无回写 | 通过 |

### 8.10 跨加载校验审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| required item 是否未校验 | 通过 | 54 items 均归入 §8.3/§8.4。 |
| parse 是否接受宽松格式/alias | 通过 | comment/trailing/duplicate/unknown/alias/null/coercion 均拒绝。 |
| invalid high source 是否回退 | 通过 | present-invalid fail-fast。 |
| cross-field 是否覆盖 core composition | 通过 | Store/UoW/replay/profile/feature/target/phase/redline 已覆盖。 |
| builder 是否 partial expose | 通过 | B0~B8 barrier；失败 dispose whole prefix。 |
| blocked external 是否被当 config invalid 或 ready | 通过 | 合法 blocked-aware 可装配；正向仍 blocked。 |
| entry/job 是否覆盖 global | 通过 | 只选择 validated snapshot。 |
| hot/reload 是否有无回滚路径 | 不适用/通过 | P0 reject，因此不存在半定义 hot path。 |
| error 是否需要 03 新 variant | 通过 | 仅使用既有八类 error；无回写。 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| V0~V8 是既有 loader/validator 顺序的细化 | 否 | validation detail | 03 §13.2~§13.3 | 无回写 |
| B0~B8 是既有 builder 顺序的分阶段表达 | 否 | assembly detail | 03 §13.3 | 无回写 |
| entry/job selector 只选 validated snapshot | 否 | existing scope rule | 03 §13.1~§13.3 | 无回写 |
| blocked-aware valid config 与 external readiness 分离 | 否 | existing Port availability | 03 §13.5~§13.6 | 无回写 |
| future new error/field/Port/constructor/reload/hot | 是 | code/lifecycle contract | 先回写 03 §4~§15 | future trigger，当前未触发 |

## 10. 正式 04 §9 回填草稿

正式 §9 应装配加载图、V0~V8、配置组总表、21 域矩阵、cross-field gates、B0~B8、生效冻结表和安全 issue surface。正式章不写真实启动命令、env key 名、实现状态、构造耗时、test run 或 readiness。

## 11. 待确认事项

| 事项 | 影响 | 待确认方 | 未确认前处理 |
|---|---|---|---|
| strict JSON 最大 byte / list bound 的 exact 数值 | `05/07/09` | 测试/实施/运维 | 使用 typed bounded policy ref；无界值拒绝。 |
| adapter registry capability metadata 的实现表示 | implementation | 实施负责人 | 保持既有 `UnsupportedCapability`；不新增 public schema。 |
| entry-local selector 的 transport 编码 | `03/07/09` future detail | API/worker owner | 只定义完整 snapshot selector 语义，不新增 DTO。 |

以上不阻塞当前配置契约，也不触发 `03` 回写。

## 12. Step 9 review gate

| 门禁 | 状态 | 说明 |
|---|---|---|
| strict parse/source merge | 通过 | ordinary/R/X/L 分离，高优先级非法不回退。 |
| type/required/cross-field | 通过 | V0~V8、21 域、12 cross gates 完整。 |
| builder/activation 可实现 | 通过 | B0~B8 + whole-graph exposure barrier。 |
| scope/lifecycle 清楚 | 通过 | static/startup/entry/job；hot/reload reject。 |
| 逐域停审与跨审计 | 通过 | 无 unresolved validation gap。 |
| 03 影响判定 | 通过 | 当前无回写。 |
| 下一动作 | 允许 | 连续授权下进入 Step 10。 |
