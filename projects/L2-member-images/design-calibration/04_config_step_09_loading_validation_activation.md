# L2-member-images 04 配置设计 Step 9：配置加载、校验与生效机制

> 创建日期：2026-09-01  
> 完成日期：2026-09-01  
> 当前状态：`completed_stop_review`；等待用户审查  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 9  
> 回填位置：正式 `04-配置设计.md` 第 9 章“配置加载、校验与生效机制”  
> 前置输入：`04_config_step_07_config_items.md`、`04_config_step_08_sensitive_secrets.md`、`03-详细设计.md` §13~§16。

## 1. Step 状态、目标与执行纪律

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 9：定义配置加载、校验与生效机制 |
| 当前状态 | `completed_stop_review`；已完成 source collection、严格 JSON parse、allowlisted env merge、类型/枚举/ref-shape/sensitive 校验、cross-field 校验、runtime builder 装配、模块暴露、startup-only 生效、失败策略和跨加载审计。 |
| 本步目标 | 说明 Step 7 的 21 个 P0 配置项如何从允许来源合并为 effective configuration，如何在不读取 raw secret、不调用未闭合外部正向能力的前提下形成 validated binding，并如何决定 `ImageRuntimeAssemblyState`。 |
| 本步边界 | 只定义配置控制面加载和本地 composition；不定义 provider 产品、endpoint、credential、secret value、构建 candidate/digest、gate/evidence、Artifact、consumer confirmation、process/container 生命周期或运行时 live state。 |
| 执行顺序 | source collection → strict project JSON parse → schema/unknown-field 检查 → allowlisted env precheck/merge → type/enum/ref-shape/sensitive 检查 → cross-field 检查 → validated binding → runtime builder slot assembly → module exposure → startup-only activation。 |
| 停审方式 | 本 Step 完成后立即停审；未经用户再次确认，不创建或进入 Step 10。 |

### 1.1 Step / 模块级门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| source collection / env merge | done | done | done | done | done | pass | pass | 进入 strict parse |
| strict parse 与 schema | done | done | done | done | done | pass | pass | 进入 type/ref/sensitive validate |
| type、ref-shape 与 sensitive validate | done | done | done | done | done | pass | pass | 进入 cross-field validate |
| cross-field validate | done | done | done | done | done | pass | pass | 进入 builder assembly |
| runtime builder assembly / module exposure | done | done | done | done | done | pass | pass | 进入 startup activation / failure audit |
| startup-only activation、失败策略与 03 影响 | done | done | done | done | done | pass | pass_with_explicit_blockers | 停审并等待用户确认 Step 10 |

## 2. 本步输入与 SOP 问题回答

### 2.1 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_07_config_items.md` | completed | 提供五个配置域和完整 21 项 P0 key、类型、默认 `null`/safe absence、必填条件、模块与失败口径。 |
| `04_config_step_08_sensitive_secrets.md` | completed | 提供 `internal` / `sensitive` / `secret` 归一、opaque selector、raw secret 拒绝、固定 redaction floor、轮换和禁止输出规则。 |
| `04_config_step_05_sources_priority_conflicts.md` | completed | 提供 `safe absence < project JSON < allowlisted environment selector` 的唯一普通来源优先级、高优先级非法值拒绝和无回退规则。 |
| `04_config_step_06_profiles_matrix.md` | completed | 提供五个 profile 的组合限制、TestOnly harness 边界、controlled seam 和 staging/production pending 口径。 |
| `03-详细设计.md` §13~§16 | current formal | 提供唯一 raw configuration reader、`ImageRuntimeConfigRef`、`ImageFakeMode`、slot/marker、`ImageRuntimeAssemblyState`、端口暴露和错误/测试边界。 |
| `03_ddd_step_14_config_dependencies.md` | completed calibration | 提供 planned `infra/config.rs` → `infra/runtime_builder.rs` 绑定顺序、跨仓分类、local/external slot 与 no-readiness 规则。 |
| `L1-governance` `04_config_step_09_loading_validation_activation.md` | 粒度参考 | 借鉴加载流程图、逐域加载校验表、cross-field 矩阵、builder target、issue surface 和停审审计结构；不继承治理项目的 stores/outbox/jobs/GRC/topic/retention 配置。 |

### 2.2 SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 配置在什么时机加载？ | 所有 P0 配置在 runtime builder 组装前一次加载并冻结；没有 P0 reload、hot、online admin override 或 query-time 读取。测试 harness 可在构造 TestOnly runtime 前提供 fixture selector，但不改变生产启动语义。 |
| 配置如何 parse 和 type validate？ | 只接受一个严格 JSON 对象；拒绝 JSONC 注释、trailing comma、重复 key、未知 key、错误对象层级和多文档。env 只解析 allowlisted selector 字符串，再按同一 schema 校验；profile、mode、opaque ref、受控 ref collection 均进行严格类型/枚举/形状校验。 |
| 哪些配置需要 cross-field validate？ | profile↔mode↔TestOnly harness、`config_ref` 与 local store 完整性、scope 所需 static slot、owner/kind 与 collection 唯一性、external seam 与 profile、redaction floor、`null`/required 关系以及禁止 invariant override 均需交叉校验。 |
| 哪些配置 startup/static，是否支持 reload/hot？ | 21 个 P0 全部是 startup composition 输入；static reference 的语义仍由 owner 和 03 contract 决定。出现 reload/hot/online override key 或请求直接拒绝；不引入 LKG、半应用或静默回退。 |
| 校验失败如何处理？ | 在配置/组合层形成安全 issue ref 和 `Blocked`/`Unknown`/`Gap` 等 marker；不把失败写入 domain truth，不开始 UoW，不生成 result/trace/event/Artifact/consumer confirmation，不暴露可执行业务 facade。高优先级非法 source 不回退低优先级 source。 |
| 每个配置项/域是否与 Step 7 一致？ | 是。五个域均逐域覆盖 parse、type/ref-shape、cross-field、builder target、模块暴露和失败策略；Step 8 的 raw secret 拒绝与 redaction 约束在所有域共享。 |
| 每个配置域是否完成停审？ | 是。`composition`、`local_persistence`、`static_references`、`external_boundaries`、`diagnostics` 均完成域级停审；未闭合 owner/policy 仍保持受影响 lane 的 blocked/gap，不被本 Step 解除。 |
| 是否存在未校验必填、cross-field、builder 或热更新缺口？ | 当前未发现本 Step 的结构缺口。`MI-UP-001/002/003/006/007/008`、`Q-MI-003/004`、`DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` 仍是上游/详细设计 blocker，不被配置加载伪造为已闭合。 |

## 3. 当前材料诊断、改动前后与设计取舍

### 3.1 当前材料诊断

| 材料 / 风险 | 诊断 | 本 Step 处置 |
|---|---|---|
| Step 7 只有配置项清单 | 有 key、类型和失败方向，但若缺少统一加载顺序，实施可能让模块各自读取配置。 | 固定唯一链路和唯一 raw reader；所有域通过 `infra/config.rs` 进入 validated binding。 |
| Step 8 只规定 opaque/raw 边界 | 尚未明确 raw secret 检测发生在哪一阶段，也未明确 issue surface。 | 在 parse 后、type/ref-shape 前后均执行 sensitive/forbidden-body 检查；issue 只携带安全类别和 issue ref。 |
| 03 只给出 planned builder | 容易把 builder 误当作外部 build、registry 或 runtime 启动器。 | 明确 builder 只做 local composition 和 slot wiring；不发起外部正向操作，不启动 process/scheduler/container。 |
| external ref 未闭合 | 可能被误处理为在线探测成功或默认可用。 | 只校验 selector 形状和已知 owner/kind 约束；unknown/unavailable 为 slot marker，绝不升级为 candidate/digest/gate/Artifact/consumer 结果。 |
| profile 与 fake 边界分散 | 可能让 local-dev 或 production-like 隐式选择 fake。 | cross-field 校验要求 `test_only` 只能由显式 `ci-test + TestOnly harness` 选择；其他 profile 拒绝 TestOnly fixture/fake。 |
| 配置失败与领域失败混淆 | 可能把配置错误写入 history、trace、projection 或结果。 | 失败仅停留在 composition 层；在进入 application/domain/UoW 前 fail-closed。 |

### 3.2 改动前后对比

| 议题 | 改动前 / 风险 | Step 9 结论 | 取舍理由 |
|---|---|---|---|
| 来源处理 | 各模块可自行读 JSON/env，优先级不一致。 | 单一 source merge，优先级固定为 safe absence < JSON < allowlisted env；高优先级非法值拒绝整份 effective config。 | 避免 shadow config 和跨模块漂移。 |
| 解析格式 | 旧材料可能允许注释或宽松 JSON。 | 运行时只接受严格 JSON；无 JSONC、未知字段、重复 key 或隐式字段。 | 让 05 能测试确定的 schema，并防止隐藏配置。 |
| 校验层次 | 只做字段存在检查，owner/kind/profile 关系不明确。 | schema/type/ref-shape/sensitive/cross-field 分层校验，先于 builder assembly。 | 让缺失、非法、unknown 和 scope 冲突可定位且不越界。 |
| builder 生效 | 可能把组装成功理解为 runtime/build ready。 | `ImageRuntimeAssemblyState::Assembled` 仅表示本地 composition validation；任何外部正向 lane 仍须独立 owner/guard。 | 保持 03 的 local-only 语义。 |
| reload / hot | 可能留下无回滚的在线替换路径。 | P0 明确 unsupported，相关 key/请求拒绝；轮换仍采用新 selector + restart。 | 没有未定义 LKG、并发替换或 partial apply。 |
| 失败可见性 | 可能记录 raw value 或把错误写入 domain trace。 | 只输出 safe code、slot/类别、issue ref 和必要的 redacted context；不产生 domain mutation 或 outbound。 | 与 Step 8 redaction 和 03 observability 一致。 |

### 3.3 配置设计取舍

| 议题 | 备选 | 本 Step 取舍 |
|---|---|---|
| 是否允许模块直接读取配置 | 每个 adapter 自读 env/JSON；或集中读取后传 typed binding | 采用集中读取。只有 `infra/config.rs` 读取 raw configuration，builder 和 adapter 只接收已验证 binding。 |
| unknown external ref 是否在线探测 | 启动时调用 provider 以证明可用；或保持保守 marker | 采用保守 marker。Step 9 不定义 provider I/O、timeout、retry 或 availability success。 |
| optional external slot 未解析时是否让 local assembly 失败 | 一律失败；或区分 mandatory local 与 optional boundary | 采用区分。mandatory local/当前 scope 所需 slot 缺失会 `Blocked`；optional external 未解析可保留 local composition，但受影响 lane 必须为 `Unknown`/`Gap`/`Unavailable`，不得正向运行。 |
| 是否保留上一份配置 | LKG/cache 回退；或无回退 | 不保留 LKG。startup 失败即 blocked；运行中不支持 reload，因此不存在在线覆盖。 |
| 是否为配置校验引入新 public error DTO | 暴露完整 validator error；或使用既有安全 error boundary | 采用既有安全错误边界和 opaque issue ref；若实施需要新增 public/error contract，必须先回写 03。 |

## 4. 结构化中间产物

### 4.1 配置加载流程图：L2-member-images 配置加载与校验

```text
[project JSON] ----------> [strict JSON parse]
                                      |
                                      v
              [unknown-field / duplicate-key / shape check]
                                      |
[safe absence] -----------+           +-------- [allowlisted env selector]
                                      |                    |
                                      |       [allowlist / empty / raw-body precheck]
                                      |                    |
                                      v                    v
                         [schema-known source merge: JSON < env]
                                      |
                                      v
             [type + enum + opaque-ref + collection validation]
                                      |
                                      v
                  [sensitive/raw-secret/body rejection]
                                      |
                                      v
                      [cross-field / profile / scope check]
                                      |
                              valid binding
                                      |
                                      v
                    [infra::runtime_builder assembly]
             +----------------------+----------------------+
             |                      |                      |
       local store slots      static reference slots   boundary slots
             |                      |                      |
             +----------------------+----------------------+
                                      v
                    [module exposure: typed ports only]
                                      |
                                      v
              [ImageRuntimeAssemblyState: Unassembled /
                         Assembled / Blocked]
                                      |
                                      v
                 [startup-only activation; no reload/hot]
                                      |
                                      v
       [no domain mutation / UoW / result / event / Artifact /
                         consumer confirmation]
```

关键说明：

1. `safe absence` 是有效的缺省表示，不是成功值；required slot 缺失会在 cross-field 或 assembly 阶段 `Blocked`。
2. 运行时不是“先启动再修复”。在 builder 组装完成前，不向 `application`、`api`、`worker` 或 `jobs` 暴露可执行业务入口。
3. optional external selector 的 unknown/unavailable 只形成 slot marker；若当前 scope 将其列为 mandatory，则整体 assembly `Blocked`。
4. 流程不产生 image/build digest、candidate、gate、Artifact、consumer confirmation、launch、health 或 readiness；配置 source 的 provenance 也不等同于 image provenance。

### 4.2 Source merge 与 effective configuration 规则

| 阶段 | 输入 | 规则 | 输出 / 失败 |
|---|---|---|---|
| safe absence | 未提供的已知 nullable key | 仅对 Step 7 允许 `null` 的 ref/collection 生效；不补成功默认，不创建隐式 slot。 | known absence；required 关系留给后续校验。 |
| project JSON | 一个项目级严格 JSON 文档 | 作为普通配置基线；重复 key、未知 key、注释、trailing comma、错误层级或非对象根拒绝。 | parsed project object 或 `ParseFailed`/`UnknownField`。 |
| allowlisted env selector | 允许覆盖的 canonical leaf selector | 只能覆盖现有 key 的 selector/enum 值；不得增加新 section、传 raw body、改变 schema 或写入 secret。 | 合并后的 effective object；非法/空/不合形状值拒绝整份配置，不回退 JSON。 |
| 未授权来源 | CLI flag、config center、runtime admin、任意 provider body、secret file/body | 当前 P0 不属于来源链。出现即 `UnsupportedSource`/`ForbiddenSecretMaterial`。 | reject；不形成 validated binding。 |
| merge 冲突 | 同一 key 在 JSON 与 env 同时存在 | env 仅在其值合法且 allowlisted 时覆盖 JSON；JSON duplicate key 在 parse 阶段已拒绝。无“按字段拼接”或隐式合并。 | 单一 effective value；高优先级错误不降级。 |

来源合并不生成配置版本、发布版本或 image digest。若后续要把配置版本、签名或 provenance 纳入外部发布链，必须由相应 owner 先定义并重开 03/04，不得在本 Step 伪造。

### 4.3 Strict parse、type、ref-shape 与 sensitive 校验表

| 校验层 | 覆盖对象 | 必须通过的规则 | 失败 issue / 状态 | 禁止副作用 |
|---|---|---|---|---|
| root/schema parse | 五个 section 与固定 key 集 | 根为 object；section 为 object；无注释、trailing comma、多文档、重复 key、未知 key、错误层级。 | `ParseFailed` / `UnknownField` / `InvalidShape`；composition `Blocked`。 | 不创建 slot、UoW、trace 或业务 facade。 |
| enum/type | `composition.profile`、`composition.mode` | profile 只能是五个已定义值；mode 只能是 `production` 或 `test_only`；不得从环境名隐式推断 mode。 | `MissingRequired` / `InvalidType` / `InvalidEnum`；`Blocked`。 | 不自动切换 profile、mode 或 fake。 |
| opaque ref scalar | `config_ref`、store/component/seed/base/boundary/redaction refs | 非空字符串、body-free、不可把 URL/DSN/credential/provider body 当 selector；expected owner/kind/mutable 约束可判定时必须通过。 | `InvalidRefShape` / `ForbiddenSecretMaterial` / `OwnerKindMismatch`；受影响 slot `Blocked`/`Unknown`/`Gap`。 | 不解析正文、不调用 provider、不复制 owner body。 |
| opaque ref collection | `role_extra_component_refs`、`role_extra_seed_refs` | 只能是受控 string array；元素非空、canonical identity 可比较、无重复；顺序按设计规则稳定化；`null` 不等于关闭 required scope。 | `InvalidShape` / `DuplicateRef` / `CollectionScopeConflict`；受影响 lane `Blocked`/`Gap`。 | 不猜 role 名称、数量、manifest 或运行时 extras。 |
| nullable semantics | 所有允许 `null` 的 key | `null` 只表示 safe absence；profile/mode/config_ref 或当前 scope 的 required slot 缺失不能以 `null` 伪装成功。 | `MissingRequired` / `ScopeConflict`；`Blocked`/`Gap`。 | 不使用 cache、LKG、fake 或 `enabled=false` 绕过。 |
| sensitive/body scan | 所有 JSON/env 输入，尤其 19 个 sensitive refs | 检测 raw password/token/private key/certificate/DSN/credential/endpoint/provider body、manifest、gate/Artifact/consumer body；检测只产生安全类别，不回显匹配值。 | `ForbiddenSecretMaterial`；composition `Blocked`。 | 不把 raw 值转译成 selector，不写 log/error/audit/trace/metric/artifact。 |
| invariant key scan | 任意额外 key 或 hidden override | 拒绝 truth/state/UoW/version/recovery、candidate/eligibility/availability、event/outbound、scheduler/timeout/retry/TTL/retention、live state 或 debug raw override。 | `ForbiddenInvariantOverride`；`Blocked`。 | 不改变 03 状态机、事务、幂等或边界。 |

### 4.4 按配置域组织的加载 / 校验 / 生效表

| 配置域 | 配置项 / 配置组 | parse | type / ref-shape validate | cross-field validate | assemble target / 暴露 | 生效与失败 |
|---|---|---|---|---|---|---|
| `composition` | `profile`、`mode`、`config_ref` | 固定 object；无未知 key | profile/mode enum；config ref body-free opaque | mode 与 profile/harness；config ref 与 local composition 必填关系 | 形成 validated `ImageRuntimeConfigRef` 和显式 `ImageFakeMode`，供 builder 私有消费 | startup freeze；缺失、冲突、Production + fake/TestOnly -> reject，`Blocked`；不暴露业务 facade。 |
| `local_persistence` | `truth_store_ref`、`projection_store_ref`、`idempotency_store_ref` | 固定 object；只接受三项 | scalar opaque ref；expected local slot kind/owner 可判定时校验 | 三个 local binding 在 local composition 中必须完整；不得合并成一个 store 或以 `enabled=false` 绕过 | builder 注入既有 local store/repository/UoW/idempotency slots；application 仅见既有 ports | startup freeze；任一缺失/unknown/mismatch -> required slot `Blocked`；不 begin UoW、不 query-time repair。 |
| `static_references` | mapping、Runtime/Tools/Member/Supervisor/RoleExtra component、policy/memory/workspace/RoleExtra seed、base 共 11 项 | 固定 object；collection 仅 array | opaque ref、owner/kind/mutable、collection duplicate/order | 当前 scope 所需 slot 必须存在；component/seed placement 不得混淆；`latest`、body、live state 拒绝 | builder 绑定 `ImageAssemblyReferenceResolverPort`、`ComponentSlotKind`、`SeedPlacementBinding` 等既有 slot/carrier | startup freeze；required static ref 缺失/unknown -> affected lane `Blocked`/`Gap`；不生成 mapping/body、baseline、hardened base 或 live state。 |
| `external_boundaries` | `build_registry_ref`、`qualification_artifact_ref`、`member_service_supply_ref` | 固定 object；可 `null` | typed boundary selector；owner/kind 及 profile/fake compatibility | declared seam 是否为当前 scope mandatory；Production-like 禁 TestOnly；pending owner 不能被 selector 覆盖 | builder 仅注入 `BuildAndRegistry`、`QualificationAndArtifact`、`MemberServiceSupply` conservative slots | startup freeze；optional unknown 可保留 slot marker，mandatory 或不兼容则整体 `Blocked`；不调用 provider、不形成 candidate/digest/gate/Artifact/confirmation。 |
| `diagnostics` | `redaction_policy_ref` | 固定 object；可 `null` | opaque restrictive selector；不得携带 policy body、sink、endpoint 或 raw allowlist | selector 只能保持/加强固定 floor；不能开启 debug/raw 或降低脱敏 | builder/安全诊断边界使用固定 floor 或更严格 selector | startup freeze；缺省使用固定 floor；unknown/weaker/非法 -> reject，继续安全失败，不回显原值。 |

### 4.5 Cross-field validation matrix

| 规则编号 | 参与字段 / 条件 | 校验规则 | 失败处理 |
|---|---|---|---|
| CF-01 profile/mode | `composition.profile`、`composition.mode`、TestOnly harness context | `mode=test_only` 只能与 `profile=ci-test` 且显式 TestOnly harness 同时成立；`local-dev`、`integration-like`、`staging-like`、`production-like` 拒绝 TestOnly fixture/fake；production mode 不得装配 FakeOnly。 | `CrossFieldConflict`；整份 effective config reject，assembly `Blocked`。 |
| CF-02 composition/local completeness | `config_ref` 与三项 local store ref | 要形成 local composition 时，`config_ref`、truth、projection、idempotency 必须均为合法 binding；任一 `null`/unknown 不得以缓存、LKG 或关闭开关绕过。 | `MissingRequired`/`ScopeConflict`；required slot `Blocked`，不开始 UoW。 |
| CF-03 static scope | 11 项 static refs 与当前 scope/required slot guard | 只要 scope 要求某 component/seed/mapping/base slot，就必须有相应 ref 且 owner/kind/placement 通过；未闭合 scope 不得猜 cardinality。 | affected definition/build lane `Blocked`/`Gap`；不生成 snapshot/baseline/ready。 |
| CF-04 collection integrity | 两个 role-extra ref collection | array 元素 canonical identity 唯一、稳定排序；重复、空元素、scope 数量不符或 `null` 关闭 required slot 均拒绝。 | `DuplicateRef`/`CollectionScopeConflict`；受影响 slot `Blocked`/`Gap`。 |
| CF-05 owner/kind/mutability | mapping/component/seed/base/boundary selector | selector 的 declared owner/kind 与 slot 期望相符；mutable/`latest`/无法判定的 selector 不得作为 immutable pin。 | `OwnerKindMismatch`/`InvalidRefShape`；slot `Unknown`/`Gap`/`Blocked`。 |
| CF-06 external profile/fake | external boundary refs、profile、mode | `production-like` 不接受 fake/fixture；`ci-test` fake 必须显式 TestOnly；pending sibling/owner ref 不能因存在字符串而视作可用。 | `CrossFieldConflict` 或 conservative marker；不产生外部正向结果。 |
| CF-07 redaction floor | `diagnostics.redaction_policy_ref` 与所有 issue/output surface | provided selector 必须不弱于固定 floor；不得清空禁止字段、设置 raw/debug 或把 sensitive ref 变成日志标签。 | `InvalidPolicy`；reject selector，使用安全失败；不得输出 raw value。 |
| CF-08 null semantics | 任一 nullable ref、required scope | `null` 只表达 absence；不会生成 `Bound`、`Available`、`Assembled`、candidate、gate、Artifact 或 consumer result。 | affected slot `Blocked`/`Unknown`/`Gap`；必要时整体 `Blocked`。 |
| CF-09 source precedence | JSON 与 allowlisted env 同 key | env 只在 allowlisted 且合法时覆盖 JSON；高优先级非法、空或 raw body 直接拒绝，不回退 JSON/safe absence。 | `UnsupportedSource`/`InvalidType`/`ForbiddenSecretMaterial`；整份 reject。 |
| CF-10 invariant protection | 任意未知/额外 key | 不得用配置覆盖 state/UoW/version/recovery、event/outbound、scheduler、retry/TTL/retention、live state、provider body 或 readiness。 | `ForbiddenInvariantOverride`；不组装。 |

### 4.6 Runtime builder assemble target 与模块暴露

| Validated 配置组 | builder 组装目标 | 可暴露给 | 不得暴露给 | 组装失败时 |
|---|---|---|---|---|
| `composition.*` | private validated `ImageRuntimeConfigRef`、显式 `ImageFakeMode`、profile context | `infra::runtime_builder`、既有 composition guard | `domain`、public config DTO、raw application input | `Blocked`；不推断 profile/mode。 |
| `local_persistence.*` | local truth/projection/idempotency adapter slots、既有 UoW/repository implementations | `application` 既有 repository/UoW ports | raw DSN、credential、store product、schema | required slot `Blocked`；不 begin write UoW。 |
| `static_references.*` | static reference resolver、component/seed/base slot bindings | `application` 既有 source/assembly ports | Role/mapping/component/seed/base body、live memory/checkpoint/workspace、sandbox backend | affected slot marker；scope required 时整体 `Blocked`。 |
| `external_boundaries.*` | conservative build/qualification/supply adapter slots | application-owned boundary ports，或保守 availability assessment | provider SDK/body、manifest、gate/evidence、Artifact、consumer confirmation、launch/health | `Unknown`/`Unavailable`/`Gap`/`ReopenRequired`；不发起正向操作。 |
| `diagnostics.*` | fixed-or-stricter redaction policy selection、safe issue generator | infra/api/worker/jobs 的既有安全诊断钩子 | raw matched value、debug bypass、observability backend | 使用固定 floor 安全失败；不放宽输出。 |

模块暴露的共同规则：

- `contracts`、`domain`、`application`、`api`、`worker`、`jobs` 不读取 JSON、env 或 secret；它们只接收既有 typed carrier、port 或安全 disposition。
- builder 不因为 selector 字符串存在而调用 provider、创建 candidate、计算 image digest、写 Artifact、发送事件或确认 Member Service consumer。
- `ImageRuntimeAssemblyState::Assembled` 只表示 mandatory local composition validation 已通过；外部 slot 的正向可用性、运行时 loop、工具执行、容器生命周期和 readiness 仍在各自 owner/guard 边界。

### 4.7 生效方式与 assembly 生命周期

| 阶段 / 状态 | 进入条件 | 允许动作 | 禁止动作 |
|---|---|---|---|
| `Unassembled` | 进程启动，尚未完成有效配置绑定 | 读取 source、解析、校验；保留安全 issue ref | 暴露业务 facade、启动 worker/scheduler/container、开始 UoW 或调用外部正向 adapter。 |
| `Assembled` | source、schema、type/ref/sensitive/cross-field 通过；mandatory local slots 已绑定；scope 所需 static slots 满足；允许的 optional boundary marker 已冻结 | 暴露既有 typed application ports/facade；按 03 既有 guard 执行 local/query 或受限 marker 语义 | 不把 Assembled 升级为 build/gate/Artifact/consumer/runtime/container readiness；不改变 state/UoW/recovery。 |
| `Blocked` | 任一必填、类型、敏感、交叉、owner/kind、scope 或 mandatory slot 失败；或 profile/mode 不相容 | 输出安全错误类别/issue ref；保持 fail-closed；必要时仅保留诊断 marker | 不 partial apply、不 LKG、不 cache、不 fake fallback、不写 domain、trace、event、Artifact 或 consumer confirmation。 |

P0 生效规则：

1. 所有 21 项在 startup composition 时冻结；轮换使用新 selector、重新加载校验和 restart。
2. P0 不支持 reload/hot/online override；相关 key 或请求必须拒绝。没有“旧配置继续承担新配置”的 LKG 语义。
3. job/entry-local 参数不能覆盖 startup invariant、slot ownership、profile/mode、redaction floor 或 static/live 边界。
4. builder 组装仅是本地内存中的 wiring；不产生镜像构建产物、provenance、Artifact、gate、consumer confirmation 或发布结果。

### 4.8 配置校验 issue surface

| Issue class | 产生阶段 | 允许携带 | 禁止携带 |
|---|---|---|---|
| `ParseFailed` | strict JSON/source parser | source kind、脱敏 location category、opaque issue ref | raw file/body、匹配片段、secret |
| `UnknownField` / `InvalidShape` | schema validator | section/key category、expected shape、issue ref | 未知字段 value、provider body |
| `MissingRequired` | required/scope validator | section/key category、required slot kind、issue ref | raw config、credential |
| `InvalidType` / `InvalidEnum` | type validator | section/key category、expected type/enum class、issue ref | sensitive raw value |
| `InvalidRefShape` / `OwnerKindMismatch` | opaque ref validator | slot kind、expected owner/kind class、issue ref | full ref、owner response body |
| `DuplicateRef` / `CollectionScopeConflict` | collection/cross-field validator | collection category、safe count class、issue ref | elements全文、role/body |
| `ForbiddenSecretMaterial` | sensitive scanner | forbidden material category、issue ref | detected material、endpoint、credential |
| `CrossFieldConflict` | cross-field validator | rule id、involved section/key categories、issue ref | raw values，尤其 sensitive value |
| `ForbiddenInvariantOverride` | static boundary validator | forbidden invariant class、issue ref | attempted payload/body |
| `UnsupportedSource` / `UnsupportedReload` | source/activation validator | source/activation class、profile class、issue ref | source body、admin identity、旧配置全文 |

Issue surface 可以用于 structured log 或安全诊断，但不等同于 domain trace、audit event、result、report 或 evidence。任何 redacted digest 若未来由 Step 10 定义，只能作为安全审计字段；本 Step 不计算 image/build digest，也不把配置 issue ref 当作 Artifact provenance。

### 4.9 配置加载失败与不可用处理表

| 场景 | 正式处理 | 允许的可见结果 | 明确禁止 |
|---|---|---|---|
| JSON 语法、重复 key、未知字段或 section shape 错误 | reject effective config；assembly `Blocked` | safe issue ref、`ParseFailed`/`UnknownField` | 忽略未知字段、猜测 key、继续启动业务 facade |
| env selector 空、非法或携带 raw material | reject whole effective config；不回退 JSON | safe category、`InvalidType`/`ForbiddenSecretMaterial` | 静默忽略 env、回退低优先级、把 raw 值转 selector |
| profile/mode/harness 冲突 | reject；`Blocked` | profile/mode category、issue ref | 隐式切换到 local/production/fake、报告 fake success |
| required local store 或 config ref 缺失 | required slot `Blocked`；不组装 write-capable composition | `MissingRequired`、local blocked marker | `enabled=false`、cache、LKG、fake、query-time repair |
| static ref unknown、mutable、wrong owner/kind | affected slot `Unknown`/`Gap`/`Blocked` | slot kind、safe owner/kind class、issue ref | 接受 `latest`、复制 owner body、猜 pin 或 role mapping |
| optional external boundary unknown/unavailable | 保留 conservative marker；若 scope mandatory 则整体 `Blocked` | `Unknown`/`Unavailable`/`Gap`/`ReopenRequired` | provider probe shortcut、candidate/digest/gate/Artifact/consumer result |
| redaction selector weaker/unknown | reject selector；继续固定 floor 安全失败 | safe `InvalidPolicy` issue ref | debug/raw bypass、输出匹配原值 |
| runtime builder 内部 slot assembly 失败 | `Unassembled` → `Blocked`；不暴露可执行 facade | `ContractViolation`/`Unavailable` safe error | partial slot apply、半可用 facade、自动重试或降级 fake |
| reload/hot/online override 出现 | operation rejected；当前 P0 无在线变更 | `UnsupportedReload` issue ref | 热替换、回滚到 LKG、半应用、修改 live state |

### 4.10 五个配置域加载校验停审记录

| 配置域 / 配置组 | parse / type / cross-field | builder / 生效 | 失败与敏感审计 | 停审结论 |
|---|---|---|---|---|
| `composition` | 固定 object；profile/mode enum；config ref opaque；profile↔mode↔harness 通过 | 形成 `ImageRuntimeConfigRef`/`ImageFakeMode`；startup freeze | 缺失、冲突、FakeOnly 或 raw body reject；不回退 | 通过；无隐式 profile/mode。 |
| `local_persistence` | 三个 selector 均为 local opaque ref；完整性与 slot kind 通过 | 注入既有 local store/UoW/repository slots | 任一 required 缺失/unknown -> `Blocked`；不改变 UoW/recovery | 通过；无 DSN、产品、schema、lease/TTL/retry。 |
| `static_references` | 11 项 scalar/collection shape、owner/kind/mutable、scope/placement 通过 | 注入 resolver/component/seed/base slots | unknown/mutable/owner mismatch -> blocked/gap；不读 body/live state | 通过；`MI-UP-003/006/008` 仍显式 pending。 |
| `external_boundaries` | typed boundary shape、profile/fake compatibility、mandatory scope 通过 | 注入 conservative boundary slots，不在线调用 provider | unknown/unavailable -> marker；mandatory -> blocked；不产生正向结果 | 通过；`MI-UP-001/007`、`Q-MI-003/004` 保持 pending。 |
| `diagnostics` | restrictive ref shape；floor cross-field 通过 | 固定 floor 或更严格 selector 在启动时冻结 | absent 使用 floor；weaker/unknown reject；不输出原值 | 通过；无 observability backend 或 raw/debug 开关。 |

### 4.11 跨加载校验审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 未校验的 P0 必填项 | 未发现 | Step 7 的 required local/config/scope 关系在 §4.4~§4.5 覆盖。 |
| 类型、枚举、ref-shape、collection 校验缺口 | 未发现 | 五域 21 项均有 scalar/array/enum/opaque 规则。 |
| raw secret、endpoint、provider body 是否可能进入 effective config | 不允许 | sensitive scan 在 builder 前拒绝；不转译、不回退。 |
| owner/kind/mutable 与 `latest` 检查 | 已覆盖 | static/external selector 以 expected slot class 校验；unknown 只产生保守 marker。 |
| cross-field profile/mode/fake 关系 | 已覆盖 | CF-01、CF-06；`ci-test + explicit TestOnly harness` 是唯一 fake lane。 |
| required local store 与 config ref 完整性 | 已覆盖 | CF-02；缺失不由 `enabled=false`、cache、LKG 或 query repair 绕过。 |
| collection duplicate/order/scope | 已覆盖 | CF-04；不猜 role/cardinality，pending scope 保持 gap。 |
| redaction floor 是否可能被放宽 | 不允许 | CF-07；provided selector 只能更严格，缺省使用固定 floor。 |
| 高优先级非法 env 是否回退 | 不允许 | CF-09；整份 effective config reject。 |
| reload/hot 是否存在无回滚路径 | 不适用 | P0 明确 unsupported；相关 key/请求 reject，无 LKG。 |
| builder 是否在 `Assembled` 前暴露 facade | 不允许 | Unassembled/Blocked 不暴露可执行业务入口；只保留安全 issue/marker。 |
| builder 是否产生业务/外部正向事实 | 不允许 | 无 domain mutation、UoW、result、trace、event、candidate、digest、gate、Artifact 或 consumer confirmation。 |
| job/entry-local 是否能覆盖 startup invariant | 不允许 | 只能承接未来 run-local 输入；不得覆盖 profile、slot、redaction、state/UoW。 |
| 03 runtime config/builder/adapter constructor 是否需新增契约 | 当前无 | 若未来要求 secret provider、reload、health、product-specific constructor，必须先回写 03 并重开。 |

## 5. 对 03 详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 统一 source collection → strict parse/schema → allowlisted env merge → type/ref/sensitive → cross-field → builder assembly 顺序 | 否 | 细化既有 planned `infra/config.rs` / `runtime_builder.rs` 使用顺序 | 不适用 | 无回写；承接 03 §13。 |
| strict JSON、unknown-field reject、无 JSONC/duplicate key | 否 | 配置格式与校验规则 | 不适用 | 无回写；不新增 carrier。 |
| 21 个 P0 全部 startup-only，reload/hot/online override reject | 否 | 生效/轮换语义细化 | 不适用 | 无回写；承接 03 cold composition 边界。 |
| profile/mode/fake cross-field 只允许 `ci-test + explicit TestOnly harness` | 否 | 承接既有 `ImageFakeMode` 使用边界 | 不适用 | 无回写；不增加 enum 或 fake adapter。 |
| mandatory local slot 缺失使 assembly `Blocked`；optional external unknown 仅 marker | 否 | 细化既有 slot/assembly state | 不适用 | 无回写；不改变 `ImageRuntimeAssemblyState` 变体。 |
| sensitive/raw-secret/body 在 config layer reject，issue surface 只 safe/opaque | 否 | 承接 03 §14 redaction 和 forbidden-body | 不适用 | 无回写；不引入 secret provider。 |
| builder 不产生 candidate/digest/gate/Artifact/consumer/readiness | 否 | 承接 03 no-readiness / owner boundary | 不适用 | 无回写；pending blocker 继续。 |
| 若未来新增动态 reload、LKG、secret provider resolver、provider health、public validation DTO、new constructor/port 或在线 admin override | 是（future trigger） | 可能改变 runtime config carrier、builder、adapter constructor、error、flow、state 或 audit | 03 §5/§6/§8/§11/§13/§14 与对应 calibration Step | 当前未触发；必须重开，不得在 04 静默加入。 |

本 Step 没有当前“待回写”项。`MI-UP-001/002/003/006/007/008`、`Q-MI-003/004`、`DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02` 和 `PF-UNAVAILABLE-RECOVERY` 仍是明确 blocker；加载校验只能保持 fail-closed，不能把它们转换为 ready 或 success。

## 6. 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_09_loading_validation_activation.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“配置加载流程图”“Source merge 与 effective configuration 规则”“Strict parse、type、ref-shape 与 sensitive 校验表”“Cross-field validation matrix”“Runtime builder assemble target 与模块暴露”“生效方式与 assembly 生命周期”“配置校验 issue surface”“五个配置域加载校验停审记录”和“跨加载校验审计表”小节，了解正式第 9 章的每一条加载、生效和失败结论如何收敛。

正式 `04-配置设计.md` §9 应回填以下收口结论：

1. 配置加载链固定为 `project JSON strict parse/schema + safe absence + allowlisted env precheck → schema-known merge → type/ref/sensitive validation → cross-field validation → runtime builder assembly → typed module exposure`。
2. 运行时只接受严格 JSON；拒绝 JSONC、trailing comma、重复 key、未知字段、错误层级和未授权 source。高优先级 env 非法时拒绝整份 effective config，不回退 JSON 或 safe absence。
3. Step 7 五个配置域的 21 个 P0 项均在 startup composition 时冻结；不存在 P0 reload/hot/online override。轮换使用新 selector、重新校验和 restart。
4. `infra/config.rs` 是唯一 raw configuration read/validation 入口；`infra/runtime_builder.rs` 只接收 validated binding 并注入既有 local/static/external slot。`contracts`、`domain`、`application`、`api`、`worker`、`jobs` 不读取 raw config。
5. profile/mode/fake 必须通过 cross-field 校验：只有 `ci-test + explicit TestOnly harness` 可以使用 TestOnly fake；local-dev、integration-like、staging-like、production-like 或 Production + FakeOnly 均不得 fallback。
6. mandatory local/config/static scope 缺失、类型/ref-shape/owner/kind/mutable/raw-secret/cross-field 错误均 fail-closed；optional external unknown 只形成 conservative marker。`ImageRuntimeAssemblyState::Assembled` 仅表示 local composition validation，不代表镜像、runtime、build、gate、Artifact、consumer 或 readiness 成功。
7. 配置加载失败不得产生 domain truth、mutation、UoW、result、trace、event、candidate、image digest、Artifact、consumer confirmation、launch、health 或 readiness；issue surface 只携带安全类别和 opaque issue ref。

正式章节不得新增 loader source、secret provider、timeout/retry/TTL/retention、reload/LKG、provider health、产品/endpoint/credential、事件 topic、外部正向结果或新的 03 代码契约。任何此类需求必须先进入 03/04 重开流程。

## 7. 待确认事项与持续 blocker

| 事项 | 当前状态 | 影响的配置域 / lane | 未确认前处理 |
|---|---|---|---|
| `MI-UP-001` Member Service consumer manifest/variant/ref/qualification/confirmation | pending | `external_boundaries.member_service_supply_ref` | 只保留 `ConsumerHandoffGap`/`Unavailable`/`ReopenRequired`；不验证或生成 manifest/confirmation。 |
| `MI-UP-002` member component release/compatibility | pending | `static_references.member_component_ref` | 只允许 opaque pending ref 或 blocked/gap；不声明 release readiness。 |
| `MI-UP-003` Role-to-variant mapping authority/schema | pending | `static_references.mapping_ref` | owner/kind 无法确认即 unknown/gap；不 hardcode mapping/body。 |
| `MI-UP-006` policy/memory/workspace/role-extra seed ownership/placement | pending | `static_references.*_seed_ref` | 只保留 body-free ref；live memory/checkpoint/workspace 永不进入 loader。 |
| `MI-UP-007` Artifact consumable handoff / lineage | pending | `external_boundaries.qualification_artifact_ref` | 不 mint Artifact ref、acceptance 或 lineage result。 |
| `MI-UP-008` hardened base / Sandbox boundary | pending | `static_references.base_ref` | unknown/gap/blocked；不装配 hardened base、policy 或 backend。 |
| `Q-MI-003` builder/registry product and boundary policy | pending | `external_boundaries.build_registry_ref` | 仅 conservative slot；不调用 provider、不生成 candidate/digest/release。 |
| `Q-MI-004` BOM/scanner/signature/evidence policy | pending | `external_boundaries.qualification_artifact_ref` | gate/evidence/eligibility 保持 pending/blocked/unknown。 |
| `DDD-S9-B01/B02` write-flow 与 job blocker | open | builder 生效后的 application entry | 配置不得打开 Command/Job；继续在既有 guard 停止。 |
| `DDD-S11-B03` unavailable recovery | open | local persistence / optional boundary unavailable | 不在 loader 添加 retry、repair、cache、LKG 或 recovery policy。 |
| `DDD-S13-OPEN-01/02` concurrency/namespace | open | all startup composition | 配置不定义 lease、TTL、namespace 或 idempotency identity。 |
| `PF-UNAVAILABLE-RECOVERY` | open | local/external unavailable lane | 只返回既有安全 disposition；不得由配置宣称可恢复。 |
| secret provider/rotation/access-control 的真实机制 | deferred | all sensitive selectors | 本 Step 只校验 opaque selector；具体 provider/权限留后续 owner/Step 10。 |

以上事项不构成 Step 9 的流程缺口；它们是上游 owner 或后续 Step 的输入 blocker。它们关闭前，任何 selector 字符串都不能被解释成 external availability、image digest、Artifact、consumer confirmation 或 readiness。

## 8. 自检与 Step 9 停审门禁

### 8.1 自检表

| 自检项 | 结论 | 依据 |
|---|---|---|
| 是否覆盖 source merge、strict parse、type/ref-shape、sensitive、cross-field、assembly、exposure、activation | 通过 | §4.1~§4.7。 |
| 是否逐域覆盖五个配置域 | 通过 | §4.4、§4.10。 |
| 21 个 P0 是否均回指 Step 7 并纳入校验链 | 通过 | `composition` 3 项、`local_persistence` 3 项、`static_references` 11 项、`external_boundaries` 3 项、`diagnostics` 1 项。 |
| raw secret、endpoint、credential、provider body 是否在 builder 前拒绝 | 通过 | §4.3、§4.8、§4.9。 |
| 高优先级非法 env 是否不回退 | 通过 | §4.2、CF-09。 |
| profile/fake/TestOnly 是否无隐式 fallback | 通过 | CF-01、CF-06、§4.10。 |
| required local/static 缺失是否 fail-closed | 通过 | CF-02、CF-03、§4.7、§4.9。 |
| optional external unknown 是否不产生正向事实 | 通过 | §4.4、§4.6、§4.9；只保留 marker。 |
| reload/hot 是否拒绝且无 LKG/partial apply | 通过 | §4.7、§4.9、§4.11。 |
| builder 是否误暴露 raw config 或 readiness | 通过 | §4.6、§4.11。 |
| 配置失败是否产生 domain mutation/UoW/result/trace/event/Artifact/consumer confirmation | 不允许 | §4.1、§4.7、§4.9。 |
| 是否新增 03 未定义的 struct/enum/trait/function/DTO/constructor | 未发现 | §5；future trigger 仅记录重开条件。 |
| 是否将 sibling pending 或 owner blocker 写成已闭合合同 | 未发现 | §7；所有事项保持 pending/blocker。 |

### 8.2 Step 9 停审记录

| 门禁项 | 结论 |
|---|---|
| 配置加载、解析、类型/ref-shape/sensitive 校验已可按文档实施 | 通过（设计层面；未执行代码/测试）。 |
| 交叉字段校验覆盖 profile/mode、required、scope、owner/kind、collection、redaction、source precedence 和 invariant | 通过。 |
| 每配置域均有 parse、type、cross-field、assemble target、expose 和 failure 口径 | 通过。 |
| startup-only、reload/hot reject、无 LKG/partial apply 口径已闭合 | 通过。 |
| `ImageRuntimeAssemblyState` 与 03 一致且不被升级为 readiness | 通过。 |
| 配置错误不会进入 domain truth、UoW、result、trace、event、Artifact 或 consumer confirmation | 通过。 |
| 上游/sibling blocker 是否解除 | 否；按 §7 持续开放，配置不能解除。 |
| 当前是否存在需回写 03 的项 | 否；future trigger 需重开。 |

```text
step_09 = completed_stop_review
gate_status = pass_with_explicit_blockers
current_module = loading_validation_activation (closed)
next_allowed_action = wait_for_user_confirmation_before_creating_step_10
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false
planned_boundary_skeleton_allowed = false
commit_required = false
```
