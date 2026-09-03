# L2-member-images 04 配置设计 Step 6：环境、部署 profile 与配置矩阵

> 创建日期：2026-09-01  
> 完成日期：2026-09-01  
> 当前状态：`completed`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 6  
> 回填位置：正式 `04-配置设计.md` 第 6 章“环境、部署 profile 与配置矩阵”  
> 前置输入：`04_config_step_05_sources_priority_conflicts.md` 已完成；本 Step 不定义具体 endpoint、secret value、产品或部署命令。

## 1. Step 状态与目标

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 6：环境、部署 profile 与配置矩阵 |
| 当前状态 | `completed`；profile 差异、外部依赖、敏感配置处理和下游承接已收稳 |
| 本步目标 | 将 Step 5 的来源优先级映射到可审查的 local、CI、integration-like、staging-like、production-like profile。 |
| 本步边界 | 只描述配置语义与依赖类别，不描述真实服务、产品、网络、容量、凭据或运行结果。 |
| 进入下一步 | 可创建并完成 Step 7；Step 7 才定义模块、key、类型、默认值和严格 JSON demo。 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | completed | 提供 `safe absence < project JSON < allowlisted environment selector`、非法高优先级拒绝及 TestOnly fixture 边界。 |
| `04_config_step_03_control_plane.md`、`04_config_step_04_categories_boundaries.md` | completed | 提供 composition、local store、static ref、external slot、redaction 的配置域和 cold/startup 生效边界。 |
| `03-详细设计.md` §13~§16 | current formal | 提供 `ImageRuntimeConfigRef`、`ImageAdapterSlot`、`ImageAdapterAvailabilityMarker`、`ImageRuntimeAssemblyState`、`ImageFakeMode` 与 port 注入方向。 |
| `03_ddd_step_14_config_dependencies.md` | completed | 提供 slot kind、依赖分类、owner gap、marker-only inbound、zero outbound 和 production fake 禁止项。 |
| `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | current formal | 提供 static/live、pinned、产品中立、依赖裁剪、fail-closed 与下游承接边界。 |
| `L1-governance` Step 6 成品与中间产物 | 粒度参考 | 借鉴 profile 表、外部依赖矩阵、来源矩阵、测试/验收承接和跨 profile 审计格式；不继承其 outbox、publisher、topic、GRC 或运行结论。 |
| `L2-member`、`L2-member-service` 及其他 owner 台账 | pending input | 只标记组件引用、消费者交接和 owner 需要闭合的 slot，不把它们写成可用依赖。 |

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| local / CI / test / staging / prod 分别是否适用？ | 采用五个 profile：`local-dev`、`ci-test`、`integration-like`、`staging-like`、`production-like`。`local-dev` 与 `ci-test` 是当前 P0；`integration-like` 是受控接缝验证；后两者仅是 P1/P2 方向，当前不能作为必须通过的生产能力。 |
| 每个环境配置来源是什么？ | 所有 profile 服从 Step 5 普通来源链。`local-dev` 可使用安全缺省和项目 JSON；`ci-test` 使用测试 JSON、CI 允许的 selector 和显式 TestOnly harness；`integration-like` 使用项目 JSON 与 allowlisted selector；`staging-like` / `production-like` 使用经部署/运维批准的 JSON 与 opaque selector，但具体分发方式留给 09。 |
| 每个环境依赖哪些外部服务？ | `local-dev` 只要求本地 store、resolver 和 blocked seam；`ci-test` 可由 harness 显式注入 deterministic TestOnly fake；`integration-like` 可接 controlled/real-like adapter，但不增加 sibling Cargo 依赖；`staging-like` / `production-like` 才允许在 owner 合同闭合后接真实 builder、registry、qualification/Artifact、Member Service 或其他外部 adapter。当前所有未闭合正向 lane 保持 `Blocked`/`Unknown`/`Gap`。 |
| 敏感配置在不同环境如何处理？ | 所有 profile 禁止 raw secret、credential、endpoint 或 provider body。`local-dev` 只允许 safe absence 或 opaque local implementation ref；`ci-test` 只允许由 harness 显式选择的 TestOnly fake/fixture opaque ref；integration/staging/production 只能携带 opaque reference selector，实际 secret provider 与轮换策略留 Step 8/09。 |
| 哪些环境差异影响测试和验收？ | CI 负责 deterministic、fake isolation、strict JSON、redaction 和 fail-closed 契约；integration-like 负责 controlled adapter unavailable、unknown、consumer/Artifact gap 和无 fake fallback；staging/production 只在 owner 与 policy 闭合后承接真实依赖验收，当前不能生成 readiness 或通过事实。 |

## 4. 当前材料诊断

| 材料 / 风险 | 改动前问题 | 本 Step 处置 |
|---|---|---|
| 旧 README 与旧 `05/06` | 使用旧环境名、产品或固定镜像清单的可能性较高。 | 只抽取“需要环境差异”的方向，不继承名称、值、产品或验收结果。 |
| `03` 配置边界 | 有 carrier 与 slot，但没有 profile 组合。 | 以现有 carrier 为绑定目标，新增 profile 语义，不新增 Rust enum、DTO 或入口。 |
| sibling 并行窗口 | 容易把 member-service 拉取或 member 组件发布写成可用外部服务。 | 在 integration/staging/production 矩阵中写为 pending owner slot；不产生 confirmation、manifest 或 readiness。 |
| 本仓 live-state 禁止项 | 可能误加 replay、checkpoint 或运行态 profile。 | 明确本项目不拥有 live memory、checkpoint、container 或 recovery profile；相关配置不进入本矩阵。 |

## 5. 改动前后与设计取舍

| 议题 | 改动前 | 改动后 | 取舍理由 |
|---|---|---|---|
| profile 命名 | 只有 local/test/staging 方向，无法引用统一矩阵。 | 固定 `local-dev`、`ci-test`、`integration-like`、`staging-like`、`production-like`。 | 与治理项目的粒度兼容，同时保留本仓产品中立边界。 |
| production-like 地位 | 容易被理解成已经具备生产适配器。 | 仅 P1/P2 方向；没有 owner-approved ref 时必须 blocked。 | 防止把设计目标写成发布或 readiness 事实。 |
| fake 使用 | 可能把 fake 当默认外部成功。 | 仅 `ImageFakeMode::TestOnly` + explicit test harness；Production 发现 `FakeOnly` 即 blocked。 | 保持 03 的 fake 隔离不变量。 |
| integration-like 依赖 | 可能要求真实 sibling repo 或源码依赖。 | 允许 controlled/real-like adapter seam，通过 ref/adapter；active sibling Cargo dependency 仍为零。 | 遵守全局依赖裁剪规则。 |
| replay / live state | 旧材料可能混入 replay、checkpoint 或容器状态。 | 不建立 operations-replay profile；任何重放/恢复仍受 03 blocker 约束并由相应 owner 定义。 | 镜像层只处理运行前静态资产。 |

## 6. 结构化中间产物

### 6.1 环境 / profile 总表

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|
| `local-dev` | 本地检查配置结构、构造 local composition、查看 blocked/gap 分支 | safe absence + 可选项目 JSON + allowlisted env selector | 本地 local-store implementation；mapping/component/seed、build/registry、qualification/Artifact、Member Service slot 可为 blocked/unknown；不要求真实服务 | 无 raw secret；仅 absent 或 opaque local implementation ref；TestOnly fake 不属于此 profile | 可用于开发 smoke；`Assembled` 只表示 local composition，不表示镜像可发布或可实例化。 |
| `ci-test` | deterministic contract、config、redaction、fake parity 与负向组合测试 | 测试项目 JSON + CI-safe selector + 显式 TestOnly fixture | isolated local-store implementation、deterministic fake resolver/adapter；禁止外部生产 endpoint | fixture/opaque ref only；raw secret 与真实 credential 禁止 | `ImageFakeMode::TestOnly` 必须由 harness 显式选择；测试结果不代表生产成功。 |
| `integration-like` | 验证跨模块接缝、adapter unavailable/unknown、owner gap 和 no-fake-fallback | 项目 JSON + allowlisted env selector + entry-local profile selector | controlled/real-like adapter seam；不因交互关系增加 sibling Cargo；未闭合 owner slot 保持 blocked/gap | credential、destination、endpoint 只以 opaque ref selector 出现；raw material 由后续安全设施处理 | 只验证边界与失败映射；不得生成 build、digest、Artifact、consumer 或 readiness 事实。 |
| `staging-like` | P1 dry-run / pre-production 组合方向 | 经批准的部署配置 + allowlisted selector；具体分发留 09 | owner 合同闭合后才可使用真实 builder/registry、Artifact qualification、Member Service supply 或其他外部 adapter | 仅 secret-provider/credential/endpoint opaque refs；不在 04 写 provider 或值 | 当前为 pending / blocked 方向，不是 P0 must-pass。 |
| `production-like` | P1/P2 生产运行语境与发布前配置边界 | 经批准的运维配置 + 受限 selector；不允许 entry-local 绕过 | 仅在 owner/policy/产品均闭合后使用批准的真实 adapter；当前所有正向外部 lane 仍 pending | 只能引用批准的 secret provider ref；禁止 raw secret、raw endpoint、provider body | `prod-like` 仅为非规范口语别名，不能另造第二套 schema；当前不声明 ready、发布或回滚成功。 |

### 6.2 Profile 外部依赖矩阵

| Profile | `LocalStore` | Mapping / Component / Seed resolver | Build / Registry | Qualification / Artifact | Member Service supply | inbound / outbound |
|---|---|---|---|---|---|---|
| `local-dev` | local implementation；缺失则 blocked | static-ref seam；缺 authority 为 unknown/gap | conservative blocked/controlled seam | blocked/gap；不产生 gate/Artifact result | `ConsumerHandoffGap` 或未装配 | inbound marker-only；outbound 严格 `NoneAuthorized` |
| `ci-test` | isolated deterministic implementation | TestOnly fake，必须 explicit | TestOnly fake 仅做协议/失败映射 parity | TestOnly fake 不能产生 `Passed`/`Accepted` | TestOnly handoff fake 不能产生 confirmation | 无 active event consumer；无 publisher |
| `integration-like` | local 或 controlled test implementation | controlled/real-like resolver；缺 owner ref 仍 gap | controlled adapter 或 blocked | controlled safe conclusion；未闭合时 blocked/unknown | controlled seam；无 consumer confirmation | 事件只保留 marker seam；outbound 无配置面 |
| `staging-like` | future approved durable/local binding | future approved ref | future approved builder/registry | future approved qualification/Artifact boundary | future consumer ref/receipt，需 owner 闭合 | event/publisher 仍需独立 authority |
| `production-like` | future approved binding | future approved static refs | future approved adapter | future approved gate/Artifact handoff | future pinned entry consumer | 不由 profile 开启 event 或 outbound |

### 6.3 Profile 配置来源矩阵

| Profile | safe absence | Project JSON | Allowlisted env selector | Test fixture / entry-local | Secret/reference selector |
|---|---|---|---|---|---|
| `local-dev` | 允许，仅产生缺失语义 | 可选；推荐用于可复现本地 composition | 仅 allowlisted profile/ref selector | 不在普通 Production composition 使用；TestOnly fake 需切换到 `ci-test` 并由 harness 显式选择 | absent 或 opaque local implementation ref |
| `ci-test` | 允许但 required item 缺失即 fail-fast | 测试配置为输入基线 | 仅 CI-safe selector；非法值拒绝且不回退 | 必须显式 TestOnly；fixture 不可覆盖 Production | fake/fixture opaque ref；无 raw secret |
| `integration-like` | optional seam 缺失为 blocked/unknown/gap | 必需用于场景组合 | 允许 profile 与 opaque ref selector | 仅 controlled scenario；不能切换成 fake success | opaque credential/destination ref；不含 body |
| `staging-like` | 只用于未提供 optional future seam | 必需，经部署边界批准 | 受限 profile/ref selector | 禁止 TestOnly fixture | secret-provider/endpoint opaque ref，具体 provider pending |
| `production-like` | 不产生 positive default；required 缺失即 blocked | 必需，经运维批准 | 受限 selector；不允许绕过 JSON 校验 | 禁止 fixture、fake、replay 或 debug override | 仅批准的 opaque secret/reference ref |

### 6.4 Profile 测试 / 验收承接矩阵

| Profile | 05 测试方案承接 | 06 验收标准承接 | 不得误用 |
|---|---|---|---|
| `local-dev` | 配置解析 smoke、local assembly blocked/assembled 语义、redaction 负向检查 | 只能作为开发辅助输入 | 不得作为 Artifact、发布、consumer 或 production readiness 证据 |
| `ci-test` | strict JSON、来源优先级、类型/交叉校验、Production/FakeOnly 拒绝、TestOnly 隔离和无副作用切口 | P0 配置安全门禁的计划输入 | fake 结果不得证明 real adapter、digest、gate 或 consumer success |
| `integration-like` | unavailable/unknown/gap、controlled adapter、无 sibling Cargo、no-fake-fallback 和 marker-only event seam | 接缝安全与 fail-closed 门禁输入 | 不要求真实生产 endpoint，不把 controlled ACK 当候选或可用镜像 |
| `staging-like` | owner 合同闭合后的 P1 dry-run、真实适配器和 handoff 测试方向 | P1 方向，当前不作通过事实 | 不得阻塞 P0，不得在本 Step 伪造 evidence/report |
| `production-like` | 未来生产配置与发布前验证方向 | P1/P2 方向，须另有 policy/owner gate | 不得声明 production-ready、发布完成、回滚完成或 consumer 已确认 |

### 6.5 Profile 停审记录

| Profile | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `local-dev` | 是否可本地构造而不偷渡真实产品；Assembled 是否仍为 local-only | 通过 | 具体 local binding key 留 Step 7。 |
| `ci-test` | 是否 explicit TestOnly、deterministic、隔离且不泄露 raw material | 通过 | fixture schema 与测试承接留 Step 7/12。 |
| `integration-like` | 是否通过 adapter seam 验证失败映射且不增加 sibling Cargo | 通过 | controlled ref 形态与 owner 合同仍 pending。 |
| `staging-like` | 是否明确为 P1/P2 方向而非 P0 成功路径 | 通过 | 真实产品、secret provider、发布门禁留 future owner/ADR。 |
| `production-like` | 是否拒绝 fake、fixture、replay 和 implicit success | 通过 | 真实依赖和运维流程不在 04 中定稿。 |

### 6.6 跨 profile 审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 是否覆盖本地、CI 与受控接缝 | 通过 | `local-dev`、`ci-test`、`integration-like` 已覆盖。 |
| staging/production 是否被误写成 P0 must-pass | 否 | 仅保留 P1/P2 方向与 blocked 条件。 |
| fake 是否可能代表生产成功 | 否 | 只有 TestOnly harness；Production + FakeOnly 必须 blocked。 |
| profile 是否改变 static/live、pin、state、UoW、owner 或依赖分类 | 否 | 这些是不变量，不配置化。 |
| 是否引入 sibling Cargo dependency | 否 | 当前 active sibling Cargo dependency 为零；使用 ref/adapter seam。 |
| 是否出现 raw secret、endpoint、provider body 或 debug override | 否 | 仅 opaque selector；Step 8 继续收紧。 |
| 是否建立 replay/live-state profile | 否 | 本仓不拥有 live memory/checkpoint/recovery；相关事项保持 blocker。 |
| inbound/outbound 是否因 profile 获得激活 | 否 | inbound marker-only，outbound `NoneAuthorized`。 |

## 7. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 固定五个 profile 名称与 P0/P1/P2 地位 | 否 | 配置矩阵分类，不新增 runtime enum | 不适用 | 无回写 |
| `ci-test` 仅通过 explicit TestOnly harness 使用 fake | 否 | 承接既有 `ImageFakeMode` 边界 | 不适用 | 无回写 |
| `integration-like` 使用 controlled/real-like seam 且 sibling Cargo 仍为零 | 否 | 依赖分类与 adapter 注入方向保持不变 | 不适用 | 无回写 |
| staging/production 正向 lane 依赖 owner/policy closure | 否 | future scope / blocked 语义 | 不适用 | 无回写 |
| 若未来把 profile 变成新的 Rust enum、constructor 参数、动态替换或运行时 lifecycle | 是（future trigger） | carrier/builder/port/error/flow 变化 | `03` §13 与对应 03 calibration Step | 当前未触发，保持 pending |

## 8. 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_06_profiles_matrix.md`
>
> 延伸阅读：
> - 建议继续阅读本中间产物的“环境 / profile 总表”“Profile 外部依赖矩阵”“Profile 配置来源矩阵”“Profile 测试 / 验收承接矩阵”“Profile 停审记录”和“跨 profile 审计表”。

正式 `04-配置设计.md` §6 应回填五个 profile 的用途、来源、外部 slot、敏感表示、P0/P1/P2 差异和测试/验收承接。正文必须说明 `Assembled` 仅是 local composition，`staging-like` / `production-like` 不是当前 must-pass，fake 只存在于显式 TestOnly harness，inbound/outbound 方向不由 profile 激活。

## 9. 待确认事项

| 事项 | 影响 | 未确认前处理 |
|---|---|---|
| controlled/real-like adapter 的具体 opaque ref 形态 | 影响 Step 7 item 与 Step 9 校验 | 只使用 generic typed selector；未知即 blocked/unknown。 |
| local store、projection、idempotency 的实际物理绑定 | 影响 Step 7 private binding 与实施承接 | 保持 product-neutral；不写 DSN、产品或 schema。 |
| `L2-member-service` consumer manifest/variant/ref 合同 | 影响 production-like supply slot | `ConsumerHandoffGap`；不写 confirmation、launch 或 health。 |
| `L1-artifact` image handoff 条件 | 影响 qualification/Artifact slot | 仅引用 owner-approved typed ref；`MI-UP-007` 未关前 blocked。 |
| 真实 secret provider 与 rotation | 影响 Step 8/09/10 | 仅记录 opaque selector；不解析 raw material。 |
| 旧 `05/06` 是否按本矩阵重建 | 影响后续文档 | Step 12 只提供承接输入，不把旧文档当 authority。 |

## 10. 自检与进入下一步条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| 至少覆盖 local、CI、staging、production/prod-like | 通过 | §6.1。 |
| 每个 profile 有来源、依赖、敏感处理和差异 | 通过 | §6.1~§6.3。 |
| 测试与验收可定位 profile 差异 | 通过 | §6.4。 |
| 未锁定真实产品、endpoint、secret、部署结果或 readiness | 通过 | §2、§4、§6。 |
| fake、event、live-state、sibling dependency 边界保持 | 通过 | §6.2、§6.6。 |
| 03 影响已判定且无当前待回写项 | 通过 | §7。 |
| 可创建 Step 7 | 通过 | P0 profile 差异可直接承接配置项清单。 |

```text
step_06 = completed
gate_status = pass_with_explicit_blockers
next_allowed_action = create_and_complete_step_07_config_items
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
