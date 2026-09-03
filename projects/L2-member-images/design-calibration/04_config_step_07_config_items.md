# L2-member-images 04 配置设计 Step 7：配置项清单与严格 JSON 示例

> 创建日期：2026-09-01  
> 完成日期：2026-09-01  
> 当前状态：`completed`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 7  
> 回填位置：正式 `04-配置设计.md` 第 7 章“配置项清单”  
> 前置输入：Step 3 控制面、Step 4 分类边界、Step 5 来源优先级、Step 6 profile 矩阵均已完成。

## 1. Step 状态、目标与执行计划

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 7：定义配置项清单 |
| 当前状态 | `completed`；五个功能域、模块级/完整严格 JSON、域级停审和跨项审计已完成 |
| 本步目标 | 将已批准的配置控制面落成可实现、可校验、可测试的项目本地配置项；每项均回指 Step 3~6。 |
| 本步边界 | 配置只生成 body-free binding intent；不生成 Role/mapping/body、digest、gate、Artifact、consumer、运行态或 readiness。 |
| 执行顺序 | `composition` → `local_persistence` → `static_references` → `external_boundaries` → `diagnostics` → 跨项审计 |
| 进入下一步 | Step 8 可在本 Step 完成后定义敏感配置处理；本文件中的 raw secret / provider body 永不补写。 |

### 1.1 Step / 模块级门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| `composition` | done | done | done | done | done | pass | pass | 进入 `local_persistence` |
| `local_persistence` | done | done | done | done | done | pass | pass | 进入 `static_references` |
| `static_references` | done | done | done | done | done | pass | pass | 进入 `external_boundaries` |
| `external_boundaries` | done | done | done | done | done | pass | pass | 进入 `diagnostics` |
| `diagnostics` | done | done | done | done | done | pass | pass | 进行跨配置项审计 |
| cross-item audit | done | done | done | done | done | pass | pass | 创建 Step 8 |

## 2. 本步输入与 SOP 问题回答

### 2.1 本步输入

| 输入 | 状态 | 本步用途 |
|---|---|---|
| `04_config_step_03_control_plane.md` | completed | 约束六个配置域、唯一 raw-reader 和 builder 注入边界。 |
| `04_config_step_04_categories_boundaries.md` | completed | 约束 cold/startup、TestOnly、static/live、pin、state/UoW 和 event/outbound 禁止项。 |
| `04_config_step_05_sources_priority_conflicts.md` | completed | 提供 `safe absence < project JSON < allowlisted env selector`、非法高优先级拒绝和 opaque ref 规则。 |
| `04_config_step_06_profiles_matrix.md` | completed | 提供五个 profile 的来源、依赖、敏感处理和测试/验收差异。 |
| `03-详细设计.md` §13~§16 | current formal | 提供已有 carrier、slot、fake mode、错误和测试切口；不在本步新增代码契约。 |
| `03_ddd_step_06_object_contracts.md`、`03_ddd_step_14_config_dependencies.md` | completed calibration | 提供字段语义、slot kind、`Assembled/Blocked` 和 no-readiness 约束。 |

### 2.2 SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 每个 P0 配置项的名称、类型、默认值是什么？ | 项目本地 key 按功能域拆分，使用严格 JSON；默认值只允许安全缺省 `null` 或 schema 固定的非成功语义。任何 ref 值均为 opaque selector，不是 endpoint、secret、body 或事实结果。 |
| 哪些配置项必填？ | `composition.profile`、`composition.mode`、`composition.config_ref` 以及 local-store 三个 binding 在需要 local composition 时为必填；静态引用和外部 seam selector 可缺省，但缺省只能形成 blocked/unknown/gap，不产生正向 lane。 |
| 每项从哪里来、作用域是什么？ | 普通来源遵循 Step 5；作用域均为 startup composition。TestOnly fixture 只在 `ci-test` harness 中覆盖允许的 opaque selector；无 hot reload、online override 或 entry 对业务真相的覆盖。 |
| 每项如何生效、是否敏感、失败策略是什么？ | `infra/config.rs` 完成 strict parse、类型与字段校验、redaction；`infra/runtime_builder.rs` 做跨域校验和 slot 装配。非法、unknown、owner/kind 不匹配或 Production + FakeOnly 均拒绝并保持 `Blocked`。 |
| 每项关联哪些模块？ | profile/mode/config ref 关联 `infra/config.rs` 与 `infra/runtime_builder.rs`；local refs 关联 local store adapters；static refs 关联 source adapters；external refs 关联 conservative adapters；redaction ref 关联 config/builder 的安全诊断边界。 |
| 模块如何拆分？ | 按功能边界拆为 `composition`、`local_persistence`、`static_references`、`external_boundaries`、`diagnostics`；其中 `composition` 同时承接 Step 3 的 identity 与 mode 两个控制面；不使用 `runtime`、`storage`、`common`、`misc` 等泛化模块。 |
| 完整 JSON demo 是否严格？ | 所有可复制 demo 使用严格 JSON；不使用注释、trailing comma 或未知字段。本文不需要 JSONC 注释示例，完整 demo 仍以严格 JSON 给出。 |
| 配置是否改变 03 代码契约？ | 当前不改变。没有新增 struct/enum/trait/function/DTO/constructor 参数；所有 item 仅绑定已有 carrier/slot。未来若要求动态替换、真实 provider 或 public profile DTO，必须回写 03。 |

## 3. 当前材料诊断、改动前后与设计取舍

### 3.1 当前材料诊断

| 材料 / 风险 | 诊断 | 本 Step 处置 |
|---|---|---|
| 旧 README / 旧 `05/06` | 可能把固定 Role、CI 平台、真实 registry 或阈值写成配置项。 | 不继承旧 key、值、产品或结果；只用 current `00~03` 与已完成 Step。 |
| 03 carrier | 只定义 `ImageRuntimeConfigRef`、slot、marker、assembly、fake mode 的语义。 | 配置项只作为这些既有对象的输入，不把 carrier 扩展为 public raw config。 |
| profile 与 source | Step 5 已有来源优先级，Step 6 已有 profile 差异。 | 每项写明 source、scope、activation 和 profile 影响；高优先级非法不回退。 |
| static/live 混淆 | seed、component、base ref 容易被写成 live state 或正文。 | 只允许 opaque immutable selector；memory/checkpoint/workspace live state 与 body 永不入配置。 |
| external pending | build、qualification、Artifact、Member Service 合同未闭合。 | ref 可作为保守 slot selector；缺失/unknown 为 gap，禁止 candidate、digest、confirmation。 |

### 3.2 改动前后与取舍

| 议题 | 改动前 / 风险 | 本 Step 结论 | 取舍理由 |
|---|---|---|---|
| 模块组织 | 可能把所有字段塞进 `runtime` 或 `storage`。 | 使用五个功能域；`composition` 负责 identity/mode，local 与 external 分开。 | 便于 05/06 按边界测试和验收，避免泛化模块隐藏副作用。 |
| 默认值 | 用 fake、`latest` 或 provider 默认值补齐缺项。 | 默认只表示 safe absence；缺失不产生 `Bound`、`Available` 或 positive result。 | 保持 fail-closed 与 ADR-0005 pin/no-`latest`。 |
| external selector | 将 endpoint、credential、provider body 写入普通 config。 | 只允许 opaque reference selector；owner/kind 校验失败即 blocked。 | 不越过 owner、secret、Artifact 和 consumer 边界。 |
| local binding | 用 `enabled` 开关绕过 required slot。 | 不提供 disable-required 开关；slot 集合由设计不变量固定，binding 缺失即 blocked。 | 避免配置成为 consistency、UoW 或 write gate 的旁路。 |
| sensitive policy | 用 debug bool 放宽输出。 | 仅可选择不低于固定 redaction floor 的 opaque policy ref；不能降低 floor。 | 安全与审计红线不可配置化。 |

## 4. 配置项总表（按功能域）

说明：`safe absence` 统一记为 `null`；它不是成功默认。`opaque-ref:*` 仅用于文档中的符号示例，不代表真实 endpoint、产品、凭据、digest 或已存在资源。

### 4.1 `composition` 配置域

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `composition.profile` | enum string | `null`（safe absence） | 是 | JSON；allowlisted env selector | startup composition | parse 后校验 profile，再冻结 | internal | 缺失/unknown/与 mode 冲突 -> reject，assembly `Blocked` | `infra/config.rs`; `infra/runtime_builder.rs` |
| `composition.mode` | enum string：`production` / `test_only` | `null`（safe absence） | 是 | JSON；allowlisted env selector；TestOnly harness 仅显式提供 `test_only` | startup composition | 显式注入 `ImageFakeMode`；不得从环境名隐式推断 | internal | 缺失、非法或 Production + FakeOnly -> reject，禁止 fallback | `infra/config.rs`; `infra/runtime_builder.rs`; `fakes.rs` |
| `composition.config_ref` | opaque reference selector | `null`（safe absence） | 是（要形成 `Bound` 时） | JSON；allowlisted env selector | startup composition | 校验为 body-free `ImageRuntimeConfigRef` 后交给 builder | sensitive | 缺失、owner/kind 不匹配或含 body -> `ImageRuntimeConfigRef::Blocked` | `infra/config.rs`; `runtime_builder.rs` |

#### `composition` 配置 demo

```json
{
  "composition": {
    "profile": "ci-test",
    "mode": "test_only",
    "config_ref": "opaque-ref:ci-composition"
  }
}
```

| 配置项 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|
| `composition.profile` | `ci-test` | 选择已定义 profile 语义 | 只能是 Step 6 的 profile 名称；不得新增隐式 profile | unknown -> reject |
| `composition.mode` | `test_only` | 显式区分 Production 与 TestOnly | `test_only` 只能由 test harness 选择；不得作为 Production 默认 | conflict -> blocked |
| `composition.config_ref` | `opaque-ref:ci-composition` | 标识配置 authority，不携带正文 | non-empty、opaque、owner/kind 可判定；不得是 endpoint/body | invalid -> `Blocked` |

#### `composition` 域停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| key 是否按功能边界命名 | 通过 | 未使用 `runtime` 泛化域。 |
| profile/mode 是否可隐式切换 | 不允许 | mode 必须显式；profile unknown 拒绝。 |
| 默认值是否制造成功 | 不会 | 全部 safe absence；缺失为 blocked。 |
| 03 carrier 是否被扩展 | 否 | 只消费既有 `ImageRuntimeConfigRef` / `ImageFakeMode`。 |

### 4.2 `local_persistence` 配置域

local persistence 只选择 private implementation binding；不配置数据库产品、schema、UoW、version、append-only、recovery、lease、TTL 或 retry。三个 selector 在需要形成 local composition 时均需提供；当前 Command/Job 仍受 03 blocker 约束，不因 selector 存在而开放写路径。

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `local_persistence.truth_store_ref` | opaque reference selector | `null` | 是（local composition） | JSON；allowlisted env selector；TestOnly fixture | startup composition | builder 注入 local truth/history implementation | sensitive | 缺失/unknown/owner mismatch -> required LocalStore slot `Blocked` | `repositories.rs`; `runtime_builder.rs` |
| `local_persistence.projection_store_ref` | opaque reference selector | `null` | 是（local composition） | JSON；allowlisted env selector；TestOnly fixture | startup composition | builder 注入 projection implementation | sensitive | 缺失/unknown -> slot `Blocked`；不得 query-time repair | `projection_store.rs`; `runtime_builder.rs` |
| `local_persistence.idempotency_store_ref` | opaque reference selector | `null` | 是（local composition） | JSON；allowlisted env selector；TestOnly fixture | startup composition | builder 注入 idempotency implementation | sensitive | 缺失/unknown -> slot `Blocked`；不得由配置添加 lease/TTL | `idempotency_store.rs`; `runtime_builder.rs` |

#### `local_persistence` 配置 demo

```json
{
  "local_persistence": {
    "truth_store_ref": "opaque-ref:ci-truth-store",
    "projection_store_ref": "opaque-ref:ci-projection-store",
    "idempotency_store_ref": "opaque-ref:ci-idempotency-store"
  }
}
```

| 配置项 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|
| `truth_store_ref` | `opaque-ref:ci-truth-store` | 选择 local truth/history binding | 只接收 opaque ref；不含 schema/product/body | missing -> required slot blocked |
| `projection_store_ref` | `opaque-ref:ci-projection-store` | 选择从 committed local truth 派生的 projection binding | 不得改变 projection source direction 或 freshness semantics | invalid -> blocked |
| `idempotency_store_ref` | `opaque-ref:ci-idempotency-store` | 选择 technical idempotency binding | 不得创建 global raw-key index、lease、TTL 或 replay policy | invalid -> blocked |

#### `local_persistence` 域停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否拆开 truth、projection、idempotency | 通过 | 三项不混入 `storage`。 |
| 是否配置物理产品或 schema | 不允许 | 仅 opaque binding selector。 |
| 缺失是否可被 `enabled=false` 绕过 | 不允许 | 无 disable-required key；缺失为 blocked。 |
| 是否改变 03 的写入/恢复规则 | 否 | DDD/PF blocker 仍原样有效。 |

### 4.3 `static_references` 配置域

该域只承接静态装配所需的 body-free opaque reference selector。`mapping_ref` 指向
`L3-method-library` 的 Role-to-variant mapping source；component ref 只表示
Runtime、Tools、Member、Supervisor 或受控 role-extra 的不可变 release identity；seed ref
只表示 policy、memory、workspace 或 role-extra 的静态模板 identity；`base_ref` 只表示
Sandbox/base-image 边界的 immutable identity。配置不携带 RoleDefinition、mapping、组件、模板、
文件系统、mount、memory、checkpoint、workspace 或 runtime extras 正文。

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `static_references.mapping_ref` | opaque reference selector | `null` | 是（需要定义/映射输入时） | JSON；allowlisted env selector；TestOnly fixture | startup composition | 校验 `owner=MethodLibrary`、`kind=RoleVariantMapping` 后交给 mapping resolver | sensitive | 缺失、wrong owner/kind、mutable selector 或未知 -> mapping lane `Blocked`/`Unknown`，不创建 snapshot/baseline | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.runtime_component_ref` | opaque reference selector | `null` | 是（required Runtime slot） | JSON；allowlisted env selector；TestOnly fixture | startup composition | 校验 `owner=Runtime`、`kind=ComponentRelease`，注入 `ComponentSlotKind::Runtime` | sensitive | 缺失/不匹配/不可验证 -> required component slot `Blocked`；不得用 `latest` 或 fake 代替 Production pin | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.tools_component_ref` | opaque reference selector | `null` | 是（required Tools slot） | JSON；allowlisted env selector；TestOnly fixture | startup composition | 校验 `owner=Tools`、`kind=ComponentRelease`，注入 `ComponentSlotKind::Tools` | sensitive | 缺失/不匹配/不可验证 -> required component slot `Blocked`；不打开 tool execution | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.member_component_ref` | opaque reference selector | `null` | 是（scope 要求 Member slot 时） | JSON；allowlisted env selector；TestOnly fixture | startup composition | 校验 `owner=Member`、`kind=ComponentRelease`，注入 `ComponentSlotKind::Member` | sensitive | `MI-UP-002` 未闭合或 ref 不可验证 -> `Blocked`/`Gap`；不产生 member release readiness | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.supervisor_component_ref` | opaque reference selector | `null` | 是（scope 要求 Supervisor slot 时） | JSON；allowlisted env selector；TestOnly fixture | startup composition | 校验 `owner=Supervisor`、`kind=ComponentRelease`，注入 `ComponentSlotKind::Supervisor` | sensitive | exact owner contract 缺失、unknown 或不匹配 -> `Blocked`/`Gap`；不发明 supervisor schema | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.role_extra_component_refs` | ordered opaque reference selector collection | `null` | 条件必填（scope 要求 role-extra slot 时） | JSON；allowlisted env selector；TestOnly fixture | startup composition | 按 canonical opaque identity 排序去重，全部校验 `kind=ComponentRelease` 后注入受控 `RoleExtra` slot 集合 | sensitive | `null`、重复、mutable、owner 未闭合或数量与 scope 不符 -> `Blocked`/`Gap`；不得以空集合关闭 required slot | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.policy_seed_ref` | opaque reference selector | `null` | 条件必填（policy seed 在 scope 中时） | JSON；allowlisted env selector；TestOnly fixture | startup composition | 校验 `owner=SeedAuthority`、`kind=SeedTemplate`，绑定固定 `PolicyTemplate`/`PolicyLayer` | sensitive | 缺失/unknown/owner mismatch -> seed lane `Blocked`/`Gap`；不读 governance policy body | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.memory_seed_ref` | opaque reference selector | `null` | 条件必填（memory seed 在 scope 中时） | JSON；allowlisted env selector；TestOnly fixture | startup composition | 校验 `kind=SeedTemplate`，绑定固定 `MemoryTemplate`/`MemoryLayer` | sensitive | 缺失/unknown -> `Blocked`/`Gap`；不承接 live memory、checkpoint 或 replay state | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.workspace_seed_ref` | opaque reference selector | `null` | 条件必填（workspace seed 在 scope 中时） | JSON；allowlisted env selector；TestOnly fixture | startup composition | 校验 `kind=SeedTemplate`，绑定固定 `WorkspaceTemplate`/`WorkspaceSeedLayer` | sensitive | 缺失/unknown -> `Blocked`/`Gap`；不挂载 live workspace、volume 或 path | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.role_extra_seed_refs` | ordered opaque reference selector collection | `null` | 条件必填（role-extra seed 在 scope 中时） | JSON；allowlisted env selector；TestOnly fixture | startup composition | 按 canonical identity 排序去重，绑定 `RoleExtraTemplate`/`RoleExtraLayer` | sensitive | 集合缺失、重复、wrong kind 或 owner pending -> `Blocked`/`Gap`；不生成 role-extra body | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.base_ref` | opaque reference selector | `null` | 是（需要 base input 时） | JSON；allowlisted env selector；TestOnly fixture | startup composition | 校验 `kind=BaseImage`，只作为 baseline/build-input 的 body-free binding | sensitive | `MI-UP-008` 未闭合、缺失、mutable 或 unknown -> `Blocked`/`Gap`；不装配 hardened base 或 sandbox backend | `source_adapters.rs`; `runtime_builder.rs` |

`role_extra_component_refs` 与 `role_extra_seed_refs` 是受控集合，而不是任意 map。集合元素只允许
opaque ref；role 名称、RoleDefinition、映射正文、组件 manifest、模板正文和运行时注入参数均不在
配置 schema 中。集合排序、去重、required-slot 数量和 owner/kind 检查属于 builder 的跨字段校验，
不能由配置值放宽。

#### `static_references` 配置 demo

```json
{
  "static_references": {
    "mapping_ref": "opaque-ref:method-library-role-variant-map",
    "runtime_component_ref": "opaque-ref:runtime-release",
    "tools_component_ref": "opaque-ref:tools-release",
    "member_component_ref": "opaque-ref:member-release-pending",
    "supervisor_component_ref": "opaque-ref:supervisor-release-pending",
    "role_extra_component_refs": [
      "opaque-ref:role-extra-release-a"
    ],
    "policy_seed_ref": "opaque-ref:policy-template",
    "memory_seed_ref": "opaque-ref:memory-template",
    "workspace_seed_ref": "opaque-ref:workspace-template",
    "role_extra_seed_refs": [
      "opaque-ref:role-extra-template-a"
    ],
    "base_ref": "opaque-ref:base-image-pending"
  }
}
```

| 配置项 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|
| `mapping_ref` | `opaque-ref:method-library-role-variant-map` | 选择 mapping source identity | exact owner/kind；immutable；不带 mapping body | invalid -> mapping `Blocked`/`Unknown` |
| `runtime_component_ref` | `opaque-ref:runtime-release` | 选择 Runtime release pin | owner Runtime、kind ComponentRelease；拒绝 `latest`/mutable | invalid -> component slot blocked |
| `tools_component_ref` | `opaque-ref:tools-release` | 选择 Tools release pin | owner Tools；不含 tool registry/execution body | invalid -> component slot blocked |
| `member_component_ref` | `opaque-ref:member-release-pending` | 预留 Member release pin | `MI-UP-002` 关闭前只能 pending/gap | unresolved -> blocked/gap |
| `supervisor_component_ref` | `opaque-ref:supervisor-release-pending` | 预留 Supervisor release pin | exact supervisor contract pending；不猜 schema | unresolved -> blocked/gap |
| `role_extra_component_refs` | `["opaque-ref:role-extra-release-a"]` | 选择受控 role-extra release 集合 | ordered/deduplicated；不得用空集绕过 required slot | duplicate/missing -> blocked |
| `policy_seed_ref` | `opaque-ref:policy-template` | 选择静态 policy 模板 | SeedTemplate only；不含 governance body | invalid -> seed gap |
| `memory_seed_ref` | `opaque-ref:memory-template` | 选择静态 memory 模板 | 不是 live memory/checkpoint | invalid -> seed gap |
| `workspace_seed_ref` | `opaque-ref:workspace-template` | 选择静态 workspace seed | 不是 mount/path/live workspace | invalid -> seed gap |
| `role_extra_seed_refs` | `["opaque-ref:role-extra-template-a"]` | 选择 role-extra 静态模板集合 | `RoleExtraTemplate`/`RoleExtraLayer`；不含 runtime extras | invalid -> seed gap |
| `base_ref` | `opaque-ref:base-image-pending` | 选择 immutable base identity | BaseImage kind；不等 digest、hardened policy 或 registry result | unresolved -> base gap |

#### `static_references` 域停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| mapping、component、seed、base 是否都为明确 item | 通过 | 采用显式 ref 与受控集合；不使用泛化 `static_refs` map。 |
| ref 是否 body-free、immutable、owner/kind 可校验 | 通过 | 非 opaque、mutable、wrong owner/kind 一律拒绝。 |
| runtime/tools/member/supervisor/role-extra 是否能绕过 required slot | 不允许 | required slot 集合由 scope/guard 固定；`null` 不代表关闭。 |
| seed 是否与 live memory/checkpoint/workspace 分离 | 通过 | 只承接 static template/placement，live state 永不进入。 |
| RoleDefinition / mapping body 是否被配置拥有 | 不允许 | `L3-method-library` 保持 owner；本仓只消费 ref/conclusion/gap。 |
| base ref 是否制造 hardened base 或 sandbox readiness | 不允许 | `MI-UP-008` 保持 pending；只保留 body-free binding。 |
| 对 03 是否新增 carrier 或 resolver 方法 | 否 | 仅消费既有 typed refs、slot 与 `ImageAssemblyReferenceResolverPort`。 |

### 4.4 `external_boundaries` 配置域

该域只声明 build/registry、qualification/Artifact 和 Member Service supply 的保守边界
selector。selector 用于让 `infra/runtime_builder.rs` 选择一个已批准的 adapter seam，不能直接
调用对端、读取 provider body 或把 slot marker 升格为业务结果。当前 sibling 和上游合同仍处于
并行或 pending 状态，因此这些引用的缺失、未知、owner/kind 不匹配或不可验证，都只能产生
`Blocked`、`Unknown`、`Unavailable` 或 `Gap`。

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `external_boundaries.build_registry_ref` | opaque typed boundary selector | `null` | 条件必填（profile/scope 声明 build/registry seam 时） | JSON；allowlisted env selector；TestOnly deterministic fixture | startup composition | 校验允许的 Builder/Registry owner 与已定义 boundary kind 后注入 `BuildAndRegistry` slot | sensitive | 缺失/unknown/owner/kind 不符或 owner 合同未闭合 -> `Blocked`/`Unknown`；不形成 candidate、digest、registry presence 或 release | `build_adapters.rs`; `runtime_builder.rs` |
| `external_boundaries.qualification_artifact_ref` | opaque typed boundary selector | `null` | 条件必填（profile/scope 声明 qualification/Artifact seam 时） | JSON；allowlisted env selector；TestOnly deterministic fixture | startup composition | 校验 Governance/Artifact boundary ref 后注入 `QualificationAndArtifact` slot | sensitive | `Q-MI-004` 或 `MI-UP-007` 未闭合、缺失或 unknown -> `Blocked`/`Gap`；不返回 gate pass、eligibility 或 Artifact acceptance | `qualification_adapters.rs`; `runtime_builder.rs` |
| `external_boundaries.member_service_supply_ref` | opaque typed boundary selector | `null` | 条件必填（profile/scope 声明 consumer seam 时） | JSON；allowlisted env selector；TestOnly deterministic fixture | startup composition | 校验 `owner=MemberService` 的 consumer contract selector 后注入 `MemberServiceSupply` slot | sensitive | `MI-UP-001` 未闭合、缺失或 unknown -> `ConsumerHandoffGap`/`Unavailable`/`ReopenRequired`；不返回 manifest、confirmation、launch 或 health | `supply_adapters.rs`; `runtime_builder.rs` |

允许的 boundary kind 只来自 03 已定义的 opaque reference vocabulary：Builder/Registry 侧可
使用 `BuildHandoff`、`BuildExecution` 或 `ImmutableImage` 的窄用途 selector；qualification 侧
可使用 `GateAuthority`、`ApplicableGateSet`、`EvidenceConclusion` 或 `ArtifactConsumable`；
Member Service 侧可使用 `ConsumerContract`。配置本身不创建这些对象，亦不接受
`ConsumerConfirmation`、任意 URL、transport address、credential、manifest、gate inventory、
digest 或 provider response。`ImmutableImage` / `ArtifactConsumable` selector 即使格式合法，
也只表示待校验的外部 identity，不表示本仓已经获得 candidate 或 Artifact accepted。

#### `external_boundaries` 配置 demo

```json
{
  "external_boundaries": {
    "build_registry_ref": "opaque-ref:builder-registry-seam",
    "qualification_artifact_ref": "opaque-ref:qualification-artifact-seam",
    "member_service_supply_ref": "opaque-ref:member-service-consumer-contract"
  }
}
```

| 配置项 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|
| `build_registry_ref` | `opaque-ref:builder-registry-seam` | 选择受控 build/registry seam | 只允许 boundary ref；不含 endpoint、request、digest、tag 或 log | unresolved -> `BuildAndRegistry` blocked/unknown |
| `qualification_artifact_ref` | `opaque-ref:qualification-artifact-seam` | 选择 qualification/Artifact boundary | 不复制 gate/evidence inventory；Artifact ref 必须由 owner 正式提供 | unresolved -> qualification gap；不 default-pass/accept |
| `member_service_supply_ref` | `opaque-ref:member-service-consumer-contract` | 选择 Member Service consumer contract seam | 只表示 contract identity；不接受 consumer confirmation 或 runtime status | unresolved -> `ConsumerHandoffGap` |

#### `external_boundaries` 域停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 三个 external seam 是否按 owner/用途拆开 | 通过 | build/registry、qualification/Artifact、Member Service 各自独立；不使用 `external.enabled`。 |
| selector 是否 body-free 且不暴露 endpoint/secret | 通过 | 仅 opaque typed boundary selector；非法或含 body 直接拒绝。 |
| slot 是否能产生 candidate、digest、gate、Artifact 或 consumer confirmation | 不允许 | slot 只用于保守 adapter wiring；所有正向结果仍受 owner contract 与 03 blocker 约束。 |
| 缺失与 unknown 是否有明确负向分支 | 通过 | 分别映射 `Blocked`/`Unknown`/`Unavailable`/`Gap`/`ConsumerHandoffGap`。 |
| TestOnly fake 是否可能成为 Production fallback | 不允许 | fixture 只能在 explicit TestOnly harness；Production + FakeOnly 仍 blocked。 |
| 是否改变 03 port/error/flow 契约 | 否 | 仅注入既有 conservative ports 与 `ImageAdapterSlotKind`。 |

### 4.5 `diagnostics` 配置域

诊断域只允许选择不低于固定 redaction floor 的策略引用。它控制校验失败时可使用的安全
reason category 和脱敏级别，不控制日志后端、保留期、告警路由、采样率、endpoint 或 debug
输出。缺省值 `null` 表示使用代码内置的最小脱敏 floor，而不是“关闭脱敏”或“允许原文”。

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `diagnostics.redaction_policy_ref` | opaque restrictive policy selector | `null`（固定 redaction floor） | 否；若提供则必须可验证 | JSON；仅允许更严格的 project selector；禁止 env 降级 | startup composition | `infra/config.rs` 校验 policy identity 与 floor，向 builder/安全诊断边界传递 opaque ref | sensitive | 缺失使用固定 floor；非法、未知或试图降低 floor -> reject 并保持安全诊断，不输出 raw value | `config.rs`; `runtime_builder.rs`; observability boundary |

该引用不能承载 `raw config`、secret、credential、endpoint、provider error、stack trace、
Role/mapping/component/seed body、manifest、digest、gate/evidence、Artifact 或 consumer body。
safe reason 只保留有限的 kind/state/disposition/error category；不得由该项开启 debug raw mode。

#### `diagnostics` 配置 demo

```json
{
  "diagnostics": {
    "redaction_policy_ref": "opaque-ref:strict-redaction"
  }
}
```

| 配置项 | 示例值 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|
| `redaction_policy_ref` | `opaque-ref:strict-redaction` | 选择不低于固定 floor 的诊断策略 | opaque、不可逆降低；不带 level map、sink、endpoint 或 raw field allowlist | absent -> fixed floor；invalid/weaker -> reject，继续安全失败 |

#### `diagnostics` 域停审

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否只有一个明确的诊断配置项 | 通过 | 不拆成 `debug`、`log_level`、`raw_output` 等旁路开关。 |
| 缺省是否保持 redaction floor | 通过 | `null` 使用固定最小脱敏；任何 weaker selector 拒绝。 |
| 是否泄漏 raw config、secret、endpoint 或 provider body | 不允许 | 仅 opaque policy ref 和 safe reason category。 |
| 是否把诊断策略当作 observability backend 配置 | 不允许 | backend、retention、alert 和 sampling 留后续 owner/09。 |
| 是否改变 03 error/observability carrier | 否 | 只消费既有 safe reason/redaction boundary。 |

## 5. 全部 P0 配置项总表与域间矩阵

### 5.1 P0 配置项总表

下表是本 Step 的完整 P0 schema 索引。`null` 一律表示 safe absence；它不会自动生成
`Bound`、`Available`、`Assembled`、candidate、gate、Artifact 或 consumer 结果。`sensitive`
表示 opaque selector 可能暴露部署或运营边界，不能进入日志；真实 secret 材料不属于本表。

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `composition.profile` | enum string | `null` | 是 | JSON / allowlisted env selector | startup | parse 后冻结 profile | internal | missing/unknown/conflict -> reject + `Blocked` | `config.rs`; `runtime_builder.rs` |
| `composition.mode` | `production` / `test_only` | `null` | 是 | JSON / allowlisted env selector / explicit fixture | startup | 显式映射 `ImageFakeMode` | internal | illegal 或 Production + fake -> reject | `config.rs`; `runtime_builder.rs` |
| `composition.config_ref` | opaque ref selector | `null` | 是（Bound composition） | JSON / allowlisted env selector | startup | 形成 body-free `ImageRuntimeConfigRef` | sensitive | invalid/absent -> config `Blocked` | `config.rs`; `runtime_builder.rs` |
| `local_persistence.truth_store_ref` | opaque ref selector | `null` | 是（local composition） | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 truth/history slot | sensitive | missing/unknown -> slot `Blocked` | `repositories.rs`; `runtime_builder.rs` |
| `local_persistence.projection_store_ref` | opaque ref selector | `null` | 是（local composition） | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 projection slot | sensitive | missing/unknown -> slot `Blocked`；Query 不 repair | `projection_store.rs`; `runtime_builder.rs` |
| `local_persistence.idempotency_store_ref` | opaque ref selector | `null` | 是（local composition） | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 idempotency slot | sensitive | missing/unknown -> slot `Blocked`；不加 lease/TTL | `idempotency_store.rs`; `runtime_builder.rs` |
| `static_references.mapping_ref` | opaque ref selector | `null` | 条件必填 | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 mapping resolver | sensitive | wrong owner/kind/unknown -> mapping `Blocked`/`Unknown` | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.runtime_component_ref` | opaque ref selector | `null` | 是（Runtime slot） | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 Runtime component pin slot | sensitive | invalid/mutable -> slot `Blocked` | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.tools_component_ref` | opaque ref selector | `null` | 是（Tools slot） | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 Tools component pin slot | sensitive | invalid/mutable -> slot `Blocked` | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.member_component_ref` | opaque ref selector | `null` | 条件必填 | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 Member component pin slot | sensitive | `MI-UP-002`/unknown -> `Blocked`/`Gap` | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.supervisor_component_ref` | opaque ref selector | `null` | 条件必填 | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 Supervisor component pin slot | sensitive | contract pending/unknown -> `Blocked`/`Gap` | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.role_extra_component_refs` | ordered opaque ref collection | `null` | 条件必填 | JSON / allowlisted env selector / TestOnly fixture | startup | 排序去重后注入 RoleExtra slots | sensitive | duplicate/missing/scope mismatch -> `Blocked`/`Gap` | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.policy_seed_ref` | opaque ref selector | `null` | 条件必填 | JSON / allowlisted env selector / TestOnly fixture | startup | 固定 PolicyTemplate/PolicyLayer binding | sensitive | missing/unknown -> seed `Blocked`/`Gap` | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.memory_seed_ref` | opaque ref selector | `null` | 条件必填 | JSON / allowlisted env selector / TestOnly fixture | startup | 固定 MemoryTemplate/MemoryLayer binding | sensitive | missing/unknown -> seed `Blocked`/`Gap` | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.workspace_seed_ref` | opaque ref selector | `null` | 条件必填 | JSON / allowlisted env selector / TestOnly fixture | startup | 固定 WorkspaceTemplate/WorkspaceSeedLayer binding | sensitive | missing/unknown -> seed `Blocked`/`Gap` | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.role_extra_seed_refs` | ordered opaque ref collection | `null` | 条件必填 | JSON / allowlisted env selector / TestOnly fixture | startup | 固定 RoleExtraTemplate/RoleExtraLayer binding | sensitive | duplicate/wrong kind -> `Blocked`/`Gap` | `source_adapters.rs`; `runtime_builder.rs` |
| `static_references.base_ref` | opaque ref selector | `null` | 是（base input） | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 BaseImage static binding | sensitive | `MI-UP-008`/unknown -> base `Blocked`/`Gap` | `source_adapters.rs`; `runtime_builder.rs` |
| `external_boundaries.build_registry_ref` | opaque typed boundary selector | `null` | 条件必填 | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 `BuildAndRegistry` slot | sensitive | unresolved -> `Blocked`/`Unknown`；不形成 candidate/digest | `build_adapters.rs`; `runtime_builder.rs` |
| `external_boundaries.qualification_artifact_ref` | opaque typed boundary selector | `null` | 条件必填 | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 `QualificationAndArtifact` slot | sensitive | `Q-MI-004`/`MI-UP-007` -> `Blocked`/`Gap` | `qualification_adapters.rs`; `runtime_builder.rs` |
| `external_boundaries.member_service_supply_ref` | opaque typed boundary selector | `null` | 条件必填 | JSON / allowlisted env selector / TestOnly fixture | startup | 注入 `MemberServiceSupply` slot | sensitive | `MI-UP-001` -> `ConsumerHandoffGap`/`Unavailable` | `supply_adapters.rs`; `runtime_builder.rs` |
| `diagnostics.redaction_policy_ref` | opaque restrictive policy selector | `null`（fixed floor） | 否 | JSON；仅更严格 selector | startup | 配置安全诊断策略引用 | sensitive | absent -> fixed floor；weaker/invalid -> reject | `config.rs`; `runtime_builder.rs` |

### 5.2 按域的控制面、分类、profile 和 03 承接矩阵

| 配置域 | 配置项范围 | Step 3 控制面 | Step 4 分类 | Step 5 来源规则 | Step 6 profile 差异 | 03 影响判定 |
|---|---|---|---|---|---|---|
| `composition` | profile、mode、config_ref | configuration intake + composition builder | startup-composition + explicit test isolation | absence < JSON < allowlisted env；fixture 仅 TestOnly | CI 必须显式 `test_only`；Production 不接 fake | 无回写；只消费既有 config ref/fake mode |
| `local_persistence` | truth/projection/idempotency refs | local technical composition | local-binding-policy + test isolation | JSON/env selector；无物理产品或 schema | local/CI 可 isolated；其他 profile 缺失为 blocked | 无回写；不改变 UoW/version/recovery |
| `static_references` | mapping、component、seed、base refs | static reference composition | local-binding-policy + sensitive | JSON/env opaque ref；fixture 仅 TestOnly | `integration-like` 可 controlled seam；owner pending 仍 gap | 无回写；不扩展 resolver/guard 契约 |
| `external_boundaries` | build/registry、qualification/Artifact、Member Service refs | conservative external boundary composition | local-binding-policy + sensitive + test isolation | JSON/env opaque typed selector；无 online override | staging/production 仅 future direction；当前不产生 positive lane | 无回写；不新增 provider/result/DTO |
| `diagnostics` | redaction policy ref | diagnostics/redaction | diagnostic-redaction | fixed floor；JSON 只能加强 | 所有 profile 同一 floor；禁止 debug downgrade | 无回写；只消费 safe reason boundary |

### 5.3 项目本地 key 与系统级聚合映射

本项目配置文件使用项目本地 key，不重复强制 `l2_member_images` 前缀。当前没有系统聚合配置
authority；若未来由系统聚合器承载，映射只能是下表形式的外部包装，不得改变本项目 schema、
优先级或 owner：

| 项目本地 key | 可选系统聚合映射 | 映射约束 |
|---|---|---|
| `composition.*` | `member_images.composition.*` | 只转发同名 selector；不增加 lifecycle 开关。 |
| `local_persistence.*` | `member_images.local_persistence.*` | 只转发 opaque store ref；不注入 DSN/schema/UoW policy。 |
| `static_references.*` | `member_images.static_references.*` | 只转发 body-free refs/collections；不搬运 Role 或模板正文。 |
| `external_boundaries.*` | `member_images.external_boundaries.*` | 只转发 typed boundary selector；不承载 endpoint/credential/body。 |
| `diagnostics.*` | `member_images.diagnostics.*` | 只能保持或加强 redaction floor；不得启用 raw output。 |

### 5.4 完整严格 JSON demo

下面示例仅用于校验 schema 形状和跨域组合；所有 `opaque-ref:*` 都是文档符号，不代表真实
资源、凭据、endpoint、digest、Artifact、consumer confirmation 或已存在的 provider。

```json
{
  "composition": {
    "profile": "ci-test",
    "mode": "test_only",
    "config_ref": "opaque-ref:ci-composition"
  },
  "local_persistence": {
    "truth_store_ref": "opaque-ref:ci-truth-store",
    "projection_store_ref": "opaque-ref:ci-projection-store",
    "idempotency_store_ref": "opaque-ref:ci-idempotency-store"
  },
  "static_references": {
    "mapping_ref": "opaque-ref:method-library-role-variant-map",
    "runtime_component_ref": "opaque-ref:runtime-release",
    "tools_component_ref": "opaque-ref:tools-release",
    "member_component_ref": "opaque-ref:member-release-pending",
    "supervisor_component_ref": "opaque-ref:supervisor-release-pending",
    "role_extra_component_refs": [
      "opaque-ref:role-extra-release-a"
    ],
    "policy_seed_ref": "opaque-ref:policy-template",
    "memory_seed_ref": "opaque-ref:memory-template",
    "workspace_seed_ref": "opaque-ref:workspace-template",
    "role_extra_seed_refs": [
      "opaque-ref:role-extra-template-a"
    ],
    "base_ref": "opaque-ref:base-image-pending"
  },
  "external_boundaries": {
    "build_registry_ref": "opaque-ref:builder-registry-seam",
    "qualification_artifact_ref": "opaque-ref:qualification-artifact-seam",
    "member_service_supply_ref": "opaque-ref:member-service-consumer-contract"
  },
  "diagnostics": {
    "redaction_policy_ref": "opaque-ref:strict-redaction"
  }
}
```

完整 demo 的 `ci-test + test_only` 组合只表示可供 deterministic harness 进行配置与负向分支
验证。即使所有 selector 在字符串层面存在，`ImageRuntimeAssemblyState::Assembled` 也只
表示本地 composition 通过；sibling、Artifact、builder、registry、gate、consumer、runtime
或 container readiness 仍不能从该示例推导。

## 6. 配置项停审与跨配置项闭环审计

### 6.1 配置项停审记录

| 配置域 / 配置项 | 类型 / 默认 / 必填性 | 来源与生效 | 敏感与失败策略 | 停审结论 |
|---|---|---|---|---|
| `composition.*` | enum、opaque ref；默认 `null`；profile/mode/config ref 对应组合时必填 | JSON < allowlisted env；startup；mode 必须显式 | internal/sensitive；非法、冲突或 Production + FakeOnly -> reject/`Blocked` | 通过；没有 implicit TestOnly 或成功默认。 |
| `local_persistence.*` | 三个 opaque ref；默认 `null`；local composition 必填 | JSON < env < TestOnly fixture；startup 注入 LocalStore slots | sensitive；missing/unknown -> slot `Blocked`，不改 UoW/recovery | 通过；未配置 DB、schema、lease、TTL、retry。 |
| `static_references.mapping_ref` | opaque ref；默认 `null`；需映射输入时必填 | JSON < env < TestOnly fixture；startup resolver binding | sensitive；owner/kind/mutable/unknown -> blocked/unknown | 通过；不拥有 mapping body。 |
| `static_references.*_component_ref` | opaque ref；默认 `null`；required slot 按 scope | JSON < env < TestOnly fixture；startup pin binding | sensitive；缺失、mutable、owner mismatch -> slot blocked/gap | 通过；不能减少 required slots 或开启 execution。 |
| `static_references.*_seed_ref` | opaque ref；默认 `null`；seed scope 条件必填 | JSON < env < TestOnly fixture；固定 seed kind/placement | sensitive；缺失/unknown -> seed blocked/gap | 通过；static template 与 live state 分离。 |
| `static_references.base_ref` | opaque ref；默认 `null`；需要 base input 时必填 | JSON < env < TestOnly fixture；startup base binding | sensitive；`MI-UP-008`/unknown -> blocked/gap | 通过；不声称 hardened base 或 sandbox readiness。 |
| `external_boundaries.build_registry_ref` | opaque typed selector；默认 `null`；seam 条件必填 | JSON < env < TestOnly fixture；startup conservative slot | sensitive；unresolved -> blocked/unknown | 通过；不形成 candidate、digest 或发布结果。 |
| `external_boundaries.qualification_artifact_ref` | opaque typed selector；默认 `null`；seam 条件必填 | JSON < env < TestOnly fixture；startup conservative slot | sensitive；`Q-MI-004`/`MI-UP-007` -> blocked/gap | 通过；不形成 gate pass/Artifact acceptance。 |
| `external_boundaries.member_service_supply_ref` | opaque typed selector；默认 `null`；consumer seam 条件必填 | JSON < env < TestOnly fixture；startup supply slot | sensitive；`MI-UP-001` -> consumer gap/unavailable/reopen | 通过；不形成 manifest/confirmation/launch/health。 |
| `diagnostics.redaction_policy_ref` | opaque restrictive ref；默认 `null`（fixed floor）；可选 | JSON 仅可加强 floor；startup validation | sensitive；invalid/weaker -> reject，仍安全输出 | 通过；无 debug/raw 旁路。 |

### 6.2 跨配置项闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否所有 P0 item 都有稳定功能域归属 | 通过 | 21 个 item 归入五个功能域；`composition` 明确承接 identity 与 mode。 |
| 是否存在重复 key 或同一行为多处配置 | 未发现 | slot availability、required-slot 集合和 redaction floor 只有 builder/schema 一个权威来源。 |
| 是否使用泛化 `runtime`、`storage`、`common`、`misc` 模块 | 否 | 采用 `composition`、`local_persistence`、`static_references`、`external_boundaries`、`diagnostics`。 |
| 是否所有 item 都有类型、默认、必填、来源、作用域、生效、敏感、失败、模块 | 通过 | §4 各域表与 §5.1 总表逐项覆盖。 |
| safe absence 是否被误作成功默认 | 否 | 所有 `null` 都只生成 blocked/unknown/gap 或 fixed redaction floor。 |
| 来源优先级是否统一 | 通过 | `safe absence < project JSON < allowlisted env selector`；非法高优先级拒绝，不回退。 |
| TestOnly fixture 是否能覆盖 Production | 不允许 | 仅 explicit `ci-test`/TestOnly harness；Production + FakeOnly -> `Blocked`。 |
| sensitive selector 是否可能变成 raw secret、endpoint 或 body | 不允许 | 只允许 opaque identity；raw secret/provider body 永不进入普通配置。 |
| static template 是否可能变成 live memory/checkpoint/workspace | 不允许 | seed kind/placement 固定，禁止 live state、mount、path、volume。 |
| local persistence item 是否改变 UoW、version、recovery、lease、TTL、retry | 不允许 | 三个 ref 仅选择 private implementation；03 不变量保持。 |
| external item 是否产生 candidate、digest、provenance、gate、Artifact、consumer confirmation | 不允许 | 只装配 conservative slot；owner pending 保持 blocked/gap。 |
| profile 是否激活 inbound/outbound 或 sibling Cargo dependency | 否 | inbound marker-only、outbound `NoneAuthorized`、active sibling Cargo dependency 为零。 |
| diagnostics 是否能降低 redaction floor或配置 observability backend | 不允许 | fixed floor 不可降低；backend/retention/alert 留后续 owner/09。 |
| item 是否可交给 05/06/07/09 而不伪造结果 | 通过 | 可承接 negative/blocked seams；不得写测试结果、验收 verdict、实现或 readiness。 |

### 6.3 跨项组合不变量

以下组合校验由 `infra/config.rs` 与 `infra/runtime_builder.rs` 在 startup 执行，仍只产生
local composition 状态：

| 组合 | 允许结果 | 禁止结果 |
|---|---|---|
| `composition.profile=ci-test` + `composition.mode=test_only` | 可建立 deterministic TestOnly harness | 不得推导 real adapter、production readiness 或 external success。 |
| `composition.profile=production-like` + `composition.mode=test_only` | 直接拒绝，assembly `Blocked` | 不得 silently fallback 到 Production 或 fake success。 |
| required LocalStore ref 任一缺失 + 其他 ref 完整 | local assembly `Blocked` | 不得由 `enabled=false`、cache、LKG 或 fake 绕过。 |
| required static ref 缺失 + external refs 完整 | affected definition/build lane blocked/gap | 不得用 Role/mapping/body、`latest` 或猜测 pin 补齐。 |
| external selector 缺失 + local refs 完整 | local composition 可记录 slot blocked；positive external lane 不开放 | 不得把 `Assembled` 写成 build/gate/consumer ready。 |
| redaction selector 缺失 | 使用固定 redaction floor | 不得降低到 debug/raw。 |
| high-priority env selector 非法 + JSON 合法 | whole effective config reject | 不得回落 JSON 或 safe absence。 |

这些组合约束不改变 domain 状态机、UoW、error 或 port 签名；它们只是配置输入的 startup
校验与 slot 装配门禁。

## 7. 对 03 详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| `composition` 将 profile、mode、config ref 收敛为 startup item | 否 | 仅细化来源、优先级和 profile 语义 | 不适用；承接 03 §13 的 `ImageRuntimeConfigRef`/`ImageFakeMode` | 无回写 |
| local truth、projection、idempotency 各自使用 opaque binding ref | 否 | 仅选择既有 LocalStore slot implementation | 不适用；不改变 repository/UoW/idempotency port | 无回写 |
| mapping、component、seed、base refs 使用 typed owner/kind 校验 | 否 | 仅绑定既有 `ImageAssemblyReferenceResolverPort` 与 static carrier | 不适用；不新增 resolver 方法或字段 | 无回写 |
| runtime/tools/member/supervisor/role-extra 组件 ref 采用显式项/受控集合 | 否 | 仅细化 pin input 的配置形状 | 不适用；`ComponentPinSet`、required slots 与 guard 不变 | 无回写 |
| policy/memory/workspace/role-extra seed ref 只绑定固定 static placement | 否 | 仅承接 `SeedPlacementBinding` 的 body-free input | 不适用；不引入 live state 或 mount contract | 无回写 |
| base ref 在 `MI-UP-008` 未闭合前保持 blocked/gap | 否 | pending owner 输入的保守配置表示 | 不适用；不新增 sandbox/backend 契约 | 无回写 |
| build/registry、qualification/Artifact、Member Service selector 只注入 conservative slots | 否 | 仅承接既有 external ports 与 pending owner boundary | 不适用；不新增 provider DTO、positive result 或 error | 无回写 |
| `diagnostics.redaction_policy_ref` 只允许加强 fixed floor | 否 | 仅约束 safe reason/redaction 选择 | 不适用；不改变 03 §14 observability carrier | 无回写 |
| 全部 P0 item 均 cold/startup、无 hot reload/online override | 否 | 生效与失效语义细化 | 不适用；无 runtime lifecycle 变更 | 无回写 |
| future 增加 dynamic reload、new constructor/port、provider health、public profile DTO、raw secret resolution 或 event activation | 是（future trigger） | 可能改变 config carrier、builder、port、error、flow 或状态 | 触发时回写 03 §5/§6/§8/§13/§14 及对应 calibration Step | 无回写（当前未触发） |

本 Step 没有 `待回写` 或 `阻塞待确认` 的当前项，因而满足正式 04 定稿所需的 03 影响门禁；
future trigger 仅作为重新打开条件，不应被误写为已发生变更。

## 8. 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_07_config_items.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“全部 P0 配置项总表与域间矩阵”“配置项停审与跨配置项闭环审计”“对 03 详细设计的影响判定”和“待确认事项”。

正式 `04-配置设计.md` §7 应回填以下收口结论：

1. 项目本地 JSON 按 `composition`、`local_persistence`、`static_references`、
   `external_boundaries`、`diagnostics` 五个功能域组织；`composition` 同时承接 identity 与 mode。
2. P0 item 只有本 Step §5.1 所列 21 项。每项均为 enum、opaque ref 或受控 opaque ref 集合；
   所有默认 `null` 都是 safe absence，不是成功默认。
3. 普通来源唯一优先级为 `safe absence < project JSON < allowlisted environment selector`；
   非法高优先级值拒绝整份 effective config，不静默回落。
4. local store、static reference 和 external boundary 只在 startup 注入既有 slot/port；
   不能写入 Role/mapping/component/seed body、live state、digest、gate、Artifact 或 consumer 结果。
5. `ci-test` 的 fake 只能由显式 `test_only` harness 使用；Production 与 FakeOnly 冲突必须
   `Blocked`。`Assembled` 只表示本地 composition validation。
6. 所有 selector 均禁止 raw secret、endpoint、credential、provider body、manifest 和日志原文；
   `diagnostics.redaction_policy_ref` 只能保持或加强固定 redaction floor。
7. 未闭合的 `MI-UP-001/002/003/006/007/008`、`Q-MI-003/004` 继续以 blocked/gap/unknown
   处理；本节不产生外部 ready、发布、回滚或 consumer confirmation 事实。

正式章节不得新增本 Step 未列出的 key、默认值、profile、secret 策略或 positive external
contract；若后续发现需要新增代码契约，必须先回写 03 并重开相关 Step。

## 9. 待确认事项与持续 blocker

| 事项 | 当前状态 | 影响的配置项 / lane | 确认方或来源 | 未确认前处理 |
|---|---|---|---|---|
| `MI-UP-001` Member Service consumer manifest/variant/ref/qualification/confirmation | pending | `external_boundaries.member_service_supply_ref`；consumer handoff | `L2-member-service` 正式文档与双方校准 | 仅 `ConsumerHandoffGap` / `Unavailable` / `ReopenRequired`；不写 manifest 或 confirmation。 |
| `MI-UP-002` member component release/compatibility | pending | `static_references.member_component_ref` | `L2-member` 与 Runtime owner | opaque pending ref 或 blocked；不声明 release readiness。 |
| `MI-UP-003` Role-to-variant mapping schema/authority | pending | `static_references.mapping_ref` | `L3-method-library` | owner/kind 校验失败或 unknown；不 hardcode mapping/body。 |
| `MI-UP-006` policy/memory/workspace/role-extra seed owner | pending | `static_references.*_seed_ref` | seed/template owner | 只保留 body-free ref/gap；live state 永不进入。 |
| `MI-UP-007` Artifact consumable handoff / lineage condition | pending | `external_boundaries.qualification_artifact_ref` | `L1-artifact` | 不 mint Artifact ref、acceptance 或 lineage result。 |
| `MI-UP-008` hardened base / Sandbox boundary | pending | `static_references.base_ref` | `L4-sandbox` / scope owner | blocked/gap；不装配 hardened base、policy 或 backend。 |
| `Q-MI-003` builder/registry product and qualification policy | pending | `external_boundaries.build_registry_ref` | owner/policy authority | conservative slot only；不产生 candidate/digest/release。 |
| `Q-MI-004` evidence/BOM/scanner/signature policy | pending | `external_boundaries.qualification_artifact_ref` | qualification/policy owner | gate/eligibility 保持 pending/blocked/unknown。 |
| secret provider、rotation、access control 的真实机制 | deferred to Step 8/9/10 | 所有 sensitive opaque refs | 安全与运维 owner | 本 Step 只接受 opaque selector；不读取 raw material。 |
| 组件/seed 集合 cardinality 与确切 role-extra scope | pending | `role_extra_component_refs`、`role_extra_seed_refs` | scope/owner formal contract | 按 required-slot guard；不能以空集合关闭 scope。 |

以上事项不是本 Step 的配置项缺口；它们是 owner contract 或后续 Step 的输入 blocker。任何
selector 字符串示例都不改变其 pending 状态。

## 10. 自检与 Step 7 门禁

| 自检项 | 结论 | 依据 |
|---|---|---|
| 每个 P0 item 是否具备名称、类型、默认、必填、来源、作用域、生效、敏感、失败策略和模块 | 通过 | §4.1~§4.5、§5.1。 |
| 是否按功能域逐个完成并停审 | 通过 | `composition`、`local_persistence`、`static_references`、`external_boundaries`、`diagnostics` 各有域级停审。 |
| 模块级 demo 是否均为严格 JSON | 通过 | §4.1~§4.5 的五个 JSON demo 无注释、trailing comma 或未知字段。 |
| 是否提供完整严格 JSON demo | 通过 | §5.4。 |
| 是否存在泛化模块、重复 key 或项目名前缀污染 | 未发现 | §5.2、§5.3。 |
| 来源优先级与非法高优先级处理是否闭合 | 通过 | Step 5 规则与 §6.2/§6.3。 |
| sensitive selector 是否与 raw secret、endpoint、body 分离 | 通过 | §4.3~§4.5、§6.2；raw material 留 Step 8。 |
| static/live、pin/no-`latest`、state/UoW/recovery 是否保持不可配置 | 通过 | §4.3、§6.2、§6.3。 |
| external slot 是否未伪造 candidate/digest/gate/Artifact/consumer 结果 | 通过 | §4.4、§6.2；owner blocker 显式保留。 |
| fake、inbound、outbound、sibling Cargo 边界是否保持 | 通过 | §6.2；TestOnly explicit、marker-only、`NoneAuthorized`、active sibling Cargo dependency 为零。 |
| 03 影响是否存在待回写或阻塞待确认项 | 通过 | §7 当前全部为“无回写”；future trigger 不构成当前回写。 |
| 05/06/07 是否被提前创建或执行 | 通过 | 仅提供承接方向；不创建 implementation ledger、planned skeleton、测试结果或证据。 |

```text
step_07 = completed
gate_status = pass_with_explicit_blockers
current_module = cross-item audit (closed)
next_allowed_action = update_flow_and_ledger_then_create_step_08_sensitive_secrets
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false
planned_boundary_skeleton_allowed = false
commit_required = false
```
