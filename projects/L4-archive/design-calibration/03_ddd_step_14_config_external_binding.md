# L4-archive 03 Step 14：配置引用与外部依赖绑定

> 执行日期：2026-09-12。对应 `详细设计讨论流程_SOP.md` Step 14、`详细设计书写规范.md` §5.13；正式回填位置为 `03-详细设计.md` §13。
> 状态：`completed / pass_with_local_pending_and_upstream_blockers / continue_authorized`。本文件只定义代码绑定点，不替代尚未创建的正式 `04-配置设计.md`，也不证明任何 provider、仓库或外部合同 ready。

## 1. Step 状态、输入与完成上限

| 项 | 结论 |
|---|---|
| 用户授权 | “现在完成全部 03”；允许逐 Step 连续推进至 Step 19 和正式 03 装配，不包含 04 |
| 直接基线 | 正式 00/01/02，Step 03/04/05/06/07/11/12/13，详细设计 SOP Step 14 与书写规范 §5.13 |
| 粒度参考 | `L1-governance` Step 14 的 binding / builder 粒度；`L1-workspace` Step 14 的 fail-closed 与按能力裁剪方式；不继承其领域主语或 fake 默认 |
| 本步输出 | 配置读取边界、typed reference 表、外部依赖绑定表、跨仓关系表、required-slot registry、runtime assembly 顺序与失败口径 |
| 不在本步 | config 文件格式、环境变量名、endpoint、credential/secret/KMS material、provider/driver、算法、数值默认值、部署模板、告警阈值 |
| 完成上限 | 实现者知道代码在哪读取和绑定配置；受 pending/blocker 影响的 production 正向构造仍 fail-closed |

本步按“输入与问题回答 → 配置 owner → slot/binding → 外部关系 → assembly/failure → 静态审计”串行完成。旧 README、旧正式 03/05/06 和 draft 只作污染审计，不提供配置事实。

## 2. SOP 问题回答与当前诊断

### 2.1 SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些模块读取配置？ | 只有 planned `crates/infra/src/config.rs` 读取并校验 raw config，`crates/infra/src/runtime_builder.rs` 消费 validated refs、构造 typed handles 并冻结 assembly。api/worker composition root 只接收对应 surface 的 validated assembly/facade，不读取 raw config。contracts/domain/application 不读环境、文件或 provider config。 |
| 配置项类型、默认值和读取位置是什么？ | 本步只固定 typed ref / validated parameter 的代码位置和 authority；所有具体值、合法范围、来源优先级与默认值留正式 04。没有正式来源的项目均为 required-without-default 或 blocked，不能用零值、常量、fake 值补齐。 |
| 哪些外部依赖经 adapter 注入？ | local store/context、current authority/visibility、八类 source export、integrity、compatibility、governance decision、archive storage、per-owner restore receiver、五类 inbound mapping，全部经 Step 07 已定义 port/factory；不增加第二套接口。 |
| 超时、重试和降级如何处理？ | 数值与策略由未来 04 绑定；当前每次调用遵循 Step 09/11/12/13 的 bounded attempt、intent-before-effect、commit probe 和具名 reconcile。`Degraded` 不允许正向 effect；缺 budget 不能开启自动重试。 |
| 哪些细节留给 04？ | 文件/schema/profile、env key、secret reference 来源、endpoint、driver/provider、codec/hash/crypto library、page/batch/lease/retry/timeout/retention 数值、轮换和部署注入。 |
| 哪些是 Rust 编译期依赖？ | 唯一已核验 sibling compile candidate 是 `/home/aris/Projects/quantalithos-core/crates/contracts`，workspace dependency 写法固定为 `core-contracts = { path = "../quantalithos-core/crates/contracts" }`。 |
| 哪些只能是 runtime/event/ref/adapter/fake？ | L0-bus、全部 L1、L1-workspace、L1-artifact、L4-observability、SDK、storage、KMS/signature、receiver 与其他 provider；不得伪装 Cargo dependency。 |
| 依赖不存在或合同未闭合怎么办？ | compile path/symbol 不成立则停止受影响构建；runtime/event/ref/adapter 合同不成立则该 exact slot `Blocked`。fake 只可用于 test support 的确定性正负路径，不进入 production factory，不生成 authority/evidence/readiness。 |

### 2.2 问题诊断与取舍

| 发现 | 风险 | 本步裁定 |
|---|---|---|
| Step 06 已有 runtime binding/marker/assembly，但配置读取 owner 未完全闭口 | application、api 或 worker 可能直接读取环境并绕过验证 | raw config 仅 `infra/config.rs`；构造仅 `infra/runtime_builder.rs`；入口只拿 validated assembly |
| operation digest 已与 Bundle digest 分开，但 codec/hash 尚未选择 | store 与 fake 可能各自编码，same-input 判定漂移 | 只登记 operation codec/digest binding ref；未闭合时 production reserve blocked，fake 也不得私定算法 |
| public cursor 与 repository cursor 已隔离，mapping/codec 未选 | continuation 可能泄露 private cursor 或混 snapshot | 只登记 cursor codec/mapping binding；缺 binding 时 continuation fail-closed，不退回第一页 |
| required slot 规则分散在 service/flow 描述 | builder 可能在失败后缩短 required set | 按 exposed surface 生成并冻结 required set；assembly begin 后不得削减/替换 |
| 示例项目允许 local fake 默认 | fake 可能被误当本仓可运行 production profile | L4-archive 不继承正向 fake 默认；fake 仅 test support，production 缺 provider/合同即 Blocked |
| provider 与 secret authority 均未指定 | config 可能被写成真实 endpoint/key inventing | runtime bindings 只保存 body-free typed refs；04 未闭合前不列 endpoint、secret 名或 provider body |
| retry/page/batch/lease/retention 都缺权威数值 | 隐式默认会改变一致性和恢复窗口 | 本步只列引用、consumer 和 owner；不定义任何数值默认 |
| outbound candidates 仍 blocked | 配置 topic/publisher 会偷渡未批准事件能力 | `AR-HLD-Q-001` 关闭前不存在 outbound slot、outbox、publisher 或 topic config |

设计取舍是复用 Step 06/07 的 `ArchiveRuntimeBindings`、`AdapterAvailabilityMarker`、`ArchiveRuntimeAssembly`、`ArchiveBindingVerifier` 与 `ArchiveAdapterFactory`，不再创造 service locator 或动态字符串 registry。配置使既有契约可被装配，但不能改变 source authority、domain invariant、状态机、成功口径或写权限。

## 3. 配置所有权与代码读取边界

| 文件 / 模块 | 可读取内容 | 可输出内容 | 禁止 |
|---|---|---|---|
| `crates/infra/src/config.rs` | raw deployment input、profile selection、secret/provider 的 opaque reference | `ArchiveRuntimeProfileRef`、`ArchiveInfraConfigRef`、validated binding/parameter refs、redacted `InfraIssueRef` | 输出 endpoint、credential、secret/key material、provider response；构造 application service |
| `crates/infra/src/runtime_builder.rs` | validated refs、required/optional slot registry | `ArchiveRuntimeBindings`、constructed typed adapters、markers、`ArchiveRuntimeAssembly`、surface facade | 重读 raw env/file；把 marker 当 handle；失败后缩减 required set |
| `crates/infra/src/*_adapter.rs` | factory 传入的 exact binding与validated call parameter | Step 07 port handle、typed result/error | 自己查全局 config、从字符串猜 owner/provider、回退 fake positive |
| `crates/api/src/*` | 已装配 command/query facade、validated boundary limit value | transport-neutral handler result | 读取 raw config/secret；直接持有 store/external adapter；Query 获得 write capability |
| `crates/worker/src/*` | 已装配 consumer/job facade、validated runner budget value | bounded runner/receipt/report | 读取 raw config/secret；绕过 claim/fence；自建 retry 默认 |
| `crates/application/src/*` | 构造器注入的 Step 07 ports 与 typed value | orchestration result | 依赖 infra config type、环境变量、provider client或全局 registry |
| `crates/domain` / `crates/contracts` | 显式业务参数与公共 DTO | pure invariant / protocol result | 任何 config I/O、adapter handle、provider/secret 类型 |

`ArchiveRuntimeBindings` 继续只保存 profile/config/store/context 与 exact adapter binding identities。limits、codec、retry 与 retention 等 validated parameter 可以由 builder 注入对应 entry/wrapper/control，但不扩充 public contracts，也不进入 Archive 26 个正式业务对象分母。

## 4. 配置引用表

> “默认值”列的 `无` 表示必须由正式 04/owning authority 明确绑定；它不是零值。`Blocked` 表示在该引用未闭合时不得构造受影响的 production capability。

| 配置引用 / 逻辑组 | 类型上限 | 唯一读取 / 使用位置 | 默认值 | owner / 正式 04 承接 |
|---|---|---|---|---|
| runtime profile | `ArchiveRuntimeProfileRef` | `infra/config.rs` → `runtime_builder.rs` | 无 | Archive 配置 owner；profile identity/选择规则 |
| validated config identity | `ArchiveInfraConfigRef` | `infra/config.rs` → `ArchiveRuntimeBindings` | 无 | Archive 配置 owner；schema/version/source precedence |
| local store binding | `ArchiveStoreBindingRef` | builder → `build_store` / `store_adapter.rs` | Blocked | infrastructure/storage owner；backend、transaction capability、secret ref |
| context source binding | `ArchiveAdapterBindingRef` | builder → `build_context` / `context_adapter.rs` | Blocked | Archive runtime owner；ID/clock source、failure mapping |
| authority binding | exact slot `Authority` 的 `ArchiveAdapterBindingRef` | builder → `authority_adapter.rs` | Blocked | formal authority owner；admission/dispatch contract |
| visibility binding | exact slot `Visibility` 的 `ArchiveAdapterBindingRef` | builder → `visibility_adapter.rs` | Blocked | current disclosure owner；revocation/hidden contract |
| per-source export bindings | `SourceExport(SourceClass)` → exact binding ref | builder → `source_export_adapters.rs` | 每个 required source Blocked | 各 truth owner；snapshot/export/version/fence/coverage |
| integrity binding | slot `Integrity` → exact binding ref | builder → `integrity_adapter.rs` | Blocked | `AR-UP-004` authority；algorithm/key/signature capability |
| compatibility binding | slot `Compatibility` → exact binding ref | builder → `compatibility_adapter.rs` | Blocked | schema evolution / target authority |
| governance decision binding | slot `GovernanceDecision` → exact binding ref | builder → `governance_adapter.rs` | Blocked | governance/明确 owner；decision applicability，不是 policy body |
| archive storage binding | slot `ArchiveStorage` → exact binding ref | builder → `archive_storage_adapter.rs` | Blocked | `AR-UP-005` owner；place/retrieve/lifecycle/probe |
| per-owner receiver bindings | `RestoreReceiver(RestoreOwnerRef)` → exact binding ref | builder → `restore_receiver_adapters.rs` | 每个 selected owner Blocked | `AR-UP-009` owner；resolve/import/handoff/probe/compensation |
| inbound mapping bindings | `InboundConsumer(ArchiveInboundFamily)` → exact binding ref | builder → `consumer_adapters.rs` | 未暴露 consumer 可省；暴露即 Blocked | bus + producer contract owner；source/schema/trust/ACK mapping |
| operation key codec binding | body-free local codec binding ref | `config.rs` → idempotency wrapper/store adapter | Blocked | Archive config/security review；结构化 key stable codec |
| operation input digest binding | body-free local digest binding ref | `config.rs` → idempotency wrapper | Blocked | Archive config/security review；与 Bundle digest 完全分离 |
| public cursor codec binding | body-free cursor binding ref | `config.rs` → query boundary/codec adapter | Blocked for continuation | Archive config/security review；不可暴露 repository cursor |
| repository cursor mapping binding | stateless authenticated codec ref或durable mapping ref，二选一待定 | builder → `store_adapter.rs` / query facade | Blocked for continuation | Archive design + formal 04；mapping owner与key/retention |
| request/body/page limits | validated positive typed values，具体类型由 04 固定 | api boundary；repository wrapper | 无 | workload/security authority；`AR-HLD-Q-002` |
| manifest/source/restore batch budgets | validated positive typed values | application wrapper/worker runner，不进 domain object | 无 | workload/environment authority；不得截断后标 Complete |
| worker concurrency/lease/renew budgets | validated values，lease time由 store clock执行 | worker control / `WorkerLeasePort` adapter | 无 | workload/store authority；lease 不替代 CAS/fence |
| dependency timeout/retry/probe budgets | per capability validated refs/values | exact adapter wrapper / job runner | 无 | owning capability + operations authority；无 blind retry |
| operation result/idempotency retention binding | formal retention decision/ref | cleanup coordinator/store adapter | Blocked for cleanup | governance/records owner；不得早于 replay/reconcile/history义务 |
| Archive lifecycle execution schedule binding | schedule ref，非决定 | worker registration only | Disabled/Blocked | governance决定+operations owner；schedule 不授权动作 |
| observability/audit handoff binding | optional external handoff ref，尚无业务 slot | Step 15 定义的 safe sink seam，若未来合同允许 | DisabledByConfig only if formally optional | `L4-observability` contract owner；不建立后端 truth |

本步没有选定任何 codec、hash、encryption、signature、compression、schema evolution、store、object storage、KMS、secret manager 或 receiver provider。表中 ref 也不证明其指向的配置或能力存在。

## 5. `ArchiveAdapterSlot` required / optional registry

### 5.1 固定 slot 枚举承接

沿用 Step 06，不增删 variant：`Store`、`ContextSource`、`Authority`、`Visibility`、`SourceExport(SourceClass)`、`Integrity`、`Compatibility`、`GovernanceDecision`、`ArchiveStorage`、`RestoreReceiver(RestoreOwnerRef)`、`InboundConsumer(ArchiveInboundFamily)`。

| 暴露 surface | required slots | 可以正式 optional 的 slots | 缺失/非 Enabled 处理 |
|---|---|---|---|
| 任何 Archive facade | `Store`、`ContextSource` | 无 | 整个该 assembly Failed，不暴露 facade |
| Command C01 RequestArchive | 基础 + `Authority` | 未被请求范围选择的 source/receiver | C01 surface 不暴露；不得用 config allow |
| Command C02 RequestRestore | 基础 + `Authority`、`Visibility`、`Integrity`、`Compatibility` | receiver 在 admission 时不 required；J13/J15 按 frozen owner set要求 | 不能接受可恢复结论；不提前解析 receiver |
| Command C03 RequestLifecycleExecution | 基础 + `Authority`、`GovernanceDecision`、`ArchiveStorage` | 无 | surface blocked；配置/schedule不能授权 |
| Query Q01～Q05 | 基础 + `Visibility`；continuation 另需 cursor binding | 某 Query 明确不读取的外部 effect slot | 缺 visibility 不暴露；cursor 缺失只允许无 continuation 的明确能力面，不伪造 token |
| Consumer E01 | 基础 + `InboundConsumer(ArchiveTrigger)`、`Authority` | 无 | 不订阅/不 ACK success |
| Consumer E02～E05 | 基础 + exact inbound family；处理 flow 要求的 exact target slot | 与该 family 无关的其他 inbound family | exact family blocked；不将 transport receipt 当业务 result |
| J01 | 基础 | 无外部 slot | store/context blocked则不运行 |
| J02～J04 | 基础 + frozen `SourceExport(source_class)` | 非目标 source slots | 每个 target独立 blocked；J02 bind unknown无probe仍Blocked |
| J05～J06 | 基础 + all frozen required source slots；J06另需`Integrity` | auxiliary source只有在 scope正式 optional时optional | 不缩短 closure、不因 optional config补 canonical gap |
| J07～J08 | 基础 + `Integrity` / `Compatibility` | 无 | assessment保持Blocked/Unknown/Unsupported |
| J09～J12 | 基础 + `ArchiveStorage`；J11另需`GovernanceDecision`与`Authority` | 无 | 不派发/不盲重试；unknown只exact reconcile |
| J13～J17 | 基础 + `Authority`、`Integrity`、`Compatibility`、`ArchiveStorage`、frozen owner对应 `SourceExport` 与 `RestoreReceiver` | 未在 plan owner set 中的其他 receiver | per-owner blocked/partial；不把一个 owner success推成全局 restored |

required set 在 `ArchiveRuntimeAssembly::begin` 时从“明确暴露的 surface + frozen source/owner target”计算并保存，之后不能因构造失败而移除 slot。`DisabledByConfig` 只接受 validated registry 已声明为 optional 的 exact slot；required slot 的 disabled 必须成为 `Blocked/Failed`。`Degraded` 只允许显式安全诊断或已定义只读 degraded surface，不满足任何正向 capture/verify/place/lifecycle/handoff effect。

## 6. 外部依赖绑定表

| 依赖 | 绑定位置 | 使用接口 / 关系 | timeout / retry 上限 | 降级 / 不可用姿态 |
|---|---|---|---|---|
| Archive local durable store | `infra/store_adapter.rs` | `ArchiveStorePort + WorkerLeasePort` / adapter | 值待 04；commit timeout仍是 Unknown | 无原子 UoW/CAS/read-set/probe 则 production Blocked；不退化分步 save |
| ID / observation clock | `infra/context_adapter.rs` | `ArchiveIdSource + ArchiveClock` / adapter | 不自动重试生成不同 ID | 不可用即受影响入口 Blocked/Unavailable；不 inline random/time |
| formal authority | `infra/authority_adapter.rs` | `ArchiveAuthorityPort` / runtime-ref-adapter | 值待 04；fresh proof由 owner合同 | Denied/Unavailable/Unknown保持区别；无 allow fallback |
| current visibility | `infra/visibility_adapter.rs` | `ArchiveVisibilityPort` / runtime-ref-adapter | 值待 04；Query timeout不触发 refresh/write | 返回 NotAvailable/Unknown；不泄露 existence或旧 result |
| L1 identity/conversation/work/process/governance | `infra/source_export_adapters.rs` | `SourceExportPort` / runtime-ref-adapter | per owner budget待 04；unknown用对应 probe，仅合同支持时 | exact source Blocked/partial/stale/conflicting；不复制 canonical truth |
| L1-artifact | same | artifact material/body/lineage ref / runtime-ref-adapter | 合同待 `AR-UP-006` | 只接 owner-approved material/ref；ref set不等正文闭包 |
| L1-workspace | same | read-only projection material / runtime-ref-adapter | 合同待 `AR-UP-008` | 永远 Auxiliary；不能填任何 canonical gap |
| L4-observability source | same + future safe audit adapter | redacted audit/evidence material / runtime-ref-adapter | 合同待 `AR-UP-007` | 只存获准 material/ref；不建 audit backend或完整链结论 |
| integrity/signature capability | `infra/integrity_adapter.rs` | `IntegrityCapabilityPort` / adapter | 未选；unknown只formal probe | `AR-UP-004` 未闭合前 Blocked/Unknown；不造 digest/signature/key |
| compatibility/schema capability | `infra/compatibility_adapter.rs` | `CompatibilityCapabilityPort` / adapter | 未选；新 target/schema须新 assessment | Unknown/Unsupported/Conflicting；不本地迁移 owner truth |
| governance decision owner | `infra/governance_adapter.rs` | `GovernanceDecisionPort` / runtime-ref-adapter | dispatch前 current recheck；值待 04 | 缺/冲突/hold即 Blocked；不解释 policy或期限 |
| object/archive storage | `infra/archive_storage_adapter.rs` | `ArchiveStoragePort` / adapter | intent后 bounded call；unknown交J12 | 无 commit/probe不声称 durable/retrievable；不选供应商 |
| per-owner restore receiver | `infra/restore_receiver_adapters.rs` | `RestoreReceiverPort` / runtime-ref-adapter | dispatch后 unknown交J16；值待 04 | per-owner Blocked/Unknown；不得直写上游 DB |
| L0-bus inbound transport | `infra/consumer_adapters.rs` + worker | trusted envelope mapping / event-adapter | redelivery由dedup处理；数值待 04 | 无正式 schema/source trust则不订阅或 quarantine；ACK不等业务 commit |
| outbound bus seam | 不存在 | blocked candidate only / event | 不适用 | `AR-HLD-Q-001` 关闭前不得配置 publisher/topic/outbox |
| fake adapters | `application/tests/support/fakes.rs` | fake / test-only | deterministic scripted outcomes | 不进 production builder，不关闭 blocker，不生成真实 proof |

## 7. 跨仓依赖关系与 Cargo 绑定

| 依赖仓 / 能力 | 全局关系类型 | 本地路径 / identity | Cargo 引用方式或协作方式 | 使用位置 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-core/crates/contracts` | compile | `/home/aris/Projects/quantalithos-core/crates/contracts` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }`；member 使用 workspace dependency | contracts及确需共享 actor/metadata/ref/value 的下游 crates | path/package/export/语义任一不符即停止受影响 compile；不复制 shadow type |
| `L0-bus` | event/adapter | `/home/aris/Projects/quantalithos-bus` | 不进 Cargo；trusted inbound envelope/consumer adapter | worker/infra | 正式 event contract缺失即Blocked/quarantine |
| `L1-identity`、`L1-conversation`、`L1-work`、`L1-process`、`L1-governance` | runtime/ref/adapter/event | 对应 sibling project/repo identity | 不进 Cargo；`SourceExportPort`、authority/decision/receiver ports与typed boundary DTO | infra/application edge | owner-by-owner Blocked；不造统一 snapshot schema |
| `L1-artifact` | runtime/ref/adapter | sibling identity | 不进 Cargo；material/ref/lineage boundary | source/restore adapter | `AR-UP-006`；不复制 Artifact body model |
| `L1-workspace` | runtime/ref/adapter | sibling identity | 不进 Cargo；read-only projection export seam | source adapter | `AR-UP-008`；只能 Auxiliary |
| `L4-observability` | runtime/ref/adapter | sibling identity | 不进 Cargo；redacted evidence/audit material seam | source adapter、Step15 sink候选 | `AR-UP-007`；Archive不拥有后端 |
| `L0-sdk` | downstream / unresolved direction | `/home/aris/Projects/quantalithos-sdk` | Archive 服务端不依赖；SDK未来消费public boundary | 无 server-side use | `AR-ARCH-001` 关闭前保持禁止 |
| object storage、KMS/signature、compression/schema、secret provider、restore receivers | adapter/runtime | deployment-specific typed refs | 不进 Cargo；仅 Step07 ports与future provider adapter | infra edge | owner/provider未闭合即exact slot Blocked |

任何 sibling 仓“目录存在”都不构成 compile 依赖或 capability ready。实现仓当前不存在，因此上表只是 planned binding，不是 Cargo manifest、baseline 或构建事实。

## 8. Runtime builder 装配顺序与失败语义

```text
ArchiveConfigLoader.load(selected profile)
  -> validate schema and produce body-free typed refs
  -> build ArchiveRuntimeBindings for the exact profile/config
  -> derive exposed surfaces and freeze required/optional exact slots
  -> ArchiveRuntimeAssembly::begin(bindings, required_slots)
  -> inspect every declared slot with ArchiveBindingVerifier
  -> build each exact typed handle with ArchiveAdapterFactory
  -> pair each real handle with its exact AdapterAvailabilityMarker
  -> reject missing, mismatched, Degraded, or required DisabledByConfig slots
  -> inject validated limits/codecs/budgets only into owning wrappers
  -> construct eight application services from restricted port handles
  -> construct command/query facades and worker consumer/job facades
  -> mark_ready only after complete required coverage
  -> expose only the facade belonging to that frozen assembly
```

| 阶段 | 失败 | 对外结果 / 恢复 |
|---|---|---|
| raw load/schema validation | missing/invalid/secret exposure risk | `ArchiveBuildError::InvalidBinding` 或 redacted config error；无 assembly |
| exact binding lookup | missing required binding | `MissingBinding`，assembly Failed；不创建 synthetic ref |
| contract/capability inspect | upstream contract尚未闭合 | `ContractBlocked` + safe issue ref；等待 owner正式合同 |
| handle construction | provider/client/store无法构造 | `ConstructionFailed`；marker-only success禁止 |
| marker coverage | missing、mismatch、Degraded、required Disabled | Failed；不得削减 required set或暴露 facade |
| service construction | restricted wrapper/trait bounds不满足 | Failed；不向 application 注入全能 service locator |
| runtime later degrades | exact binding capability lost | replacement marker Degraded/Blocked；停止正向 effect，in-flight按Step12/13协调 |
| config changes | new validated config/profile | 构造全新 assembly；旧 intent仍引用原 binding，不能用 current config重建 |

`ArchiveRuntimeAssembly::Ready` 仅表示该 exact local assembly 的 required handle 已构造，不代表上游业务事实正确、真实 Bundle已生成、storage/receiver commit、测试通过或产品 readiness。

## 9. 禁止配置化边界

| 禁止配置化事项 | 原因 / fail-closed 口径 |
|---|---|
| source-authority matrix、Required/Conditional/Auxiliary 分类 | truth ownership不是部署选项；workspace projection永不 canonical |
| identity/conversation/work/process/governance/artifact/workspace/observability truth | Archive无反写权；adapter只能读取/交接正式边界 |
| project archived/dissolved/restored 状态 | 只由正式 owning domain决定；Archive result不得推导 |
| RetentionPolicy、legal hold、delete authority、risk acceptance | 配置不能产生治理决定；缺失/冲突即Blocked |
| manifest closure、revision immutability、source coverage | batch/limit不能截断后标Complete或Sealed |
| integrity/compatibility结果 | provider/algorithm/key未知不得配成Verified/Supported |
| operation key equality、result replay、intent-before-effect | retry/config不能允许异digest覆盖、blind retry或先effect后intent |
| local UoW/CAS/read-set/fence | backend配置不能降级成部分提交或last-write-wins |
| current visibility与Query no-write | cache/profile不能复用旧权限、泄露existence或触发repair |
| per-owner restore write boundary | registry/endpoint不授予跨域写权；Bundle不是import authority |
| fake/evidence/readiness | fake成功不是真实digest/commit/evidence/signoff/readiness |
| outbound events | feature flag不能越过`AR-HLD-Q-001`创建publisher/outbox |
| SDK dependency direction | profile不能绕过`AR-ARCH-001`把SDK引入服务端compile graph |

## 10. 测试切口与跨 Step 审计

| ID | 测试切口 | 核心断言 |
|---|---|---|
| TC-AR-CFG-001 | raw config reader ownership | contracts/domain/application/api/worker均不能直接读取raw env/file/secret |
| TC-AR-CFG-002 | required slot missing | assembly Failed且无facade；required set未缩短 |
| TC-AR-CFG-003 | optional disabled | 仅registry正式optional exact slot可DisabledByConfig |
| TC-AR-CFG-004 | Degraded capability | 正向capture/place/lifecycle/handoff均拒绝；只允许明确safe read/diagnostic |
| TC-AR-CFG-005 | marker without handle | builder不能mark Ready |
| TC-AR-CFG-006 | source/receiver exact slot | unknown source/owner不fallback到第一个adapter |
| TC-AR-CFG-007 | operation codec absent | production reserve blocked；fake不能选择私有codec/hash |
| TC-AR-CFG-008 | cursor binding absent | continuation fail-closed且repository cursor不出站 |
| TC-AR-CFG-009 | config rollover with old intent | 旧effect继续引用原binding/input或Blocked，不按新config重构 |
| TC-AR-CFG-010 | sibling dependency lint | 除core-contracts外无L0/L1/L4/SDK/provider path dependency |
| TC-AR-CFG-011 | secret/body redaction | RuntimeBindings、BuildError、logs/result中无endpoint/credential/secret/provider body |
| TC-AR-CFG-012 | fake registration | test fake无法进入production factory或将marker置Enabled |

| 跨 Step 审计项 | 结论 |
|---|---|
| Step03/04 compile与文件 owner | pass：唯一 sibling compile candidate和`config.rs/runtime_builder.rs`路径一致 |
| Step06 runtime对象 | pass：复用三对象和固定slot枚举，不新增业务对象/状态分母 |
| Step07 port/factory | pass：所有binding只构造既有port；marker与handle配对 |
| Step08/09 protocol/flow | pass：按surface/target required slot；Query无写，consumer不把ACK当commit |
| Step11 consistency | pass：store必须保留atomic UoW/CAS/probe；old intent不从current config重构 |
| Step12 error/recovery | pass：Blocked/Unavailable/Conflict/CommitUnknown分开；无blind retry |
| Step13 concurrency/idempotency | pass_with_local_pending：codec/digest/retention/budget只登记引用，未设算法/默认值 |
| external blockers | pass_with_upstream_blockers：`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 全保留 |

以上测试切口只是 Step16输入，不是已执行测试或 evidence。

## 11. 正式回填草稿、待确认与门禁

正式 §13 应保留：配置读取 owner 表、引用表、required/optional slot矩阵、外部binding表、cross-repo关系表、builder顺序、禁止配置化边界；不得把未选 provider、算法、key、endpoint或数值写成事实。

| 待确认 | owner / blocker | 未确认前处理 |
|---|---|---|
| operation key codec与operation input digest实现绑定 | Archive配置/security review；本地 pending | production non-Query reserve Blocked；不借Bundle digest算法 |
| public/repository cursor codec或durable mapping | Archive配置/security/store owner；本地 pending | continuation Blocked；不暴露private cursor |
| store/backend与transaction capability | infrastructure owner / `AR-UP-005`相关但local store另需正式选择 | production assembly Blocked；fake仅测试 |
| page/batch/lease/timeout/retry/probe/result-retention数值 | workload/environment/governance owner；`AR-HLD-Q-002` | 无默认；不启动隐式retry/cleanup |
| per-owner source/export与receiver contract | `AR-UP-001/006/007/008/009` | exact slot Blocked/partial/unsupported |
| integrity/storage/governance provider contracts | `AR-UP-003/004/005` | 不构造positive handle，不声称Verified/Committed |
| outbound publisher/topic config | `AR-HLD-Q-001` | 不存在该配置组和runtime slot |

| 完成门禁 | 结果 |
|---|---|
| SOP问题与取舍 | pass |
| 配置读取模块与代码位置 | pass |
| typed refs / 默认值边界 | pass_with_local_pending |
| external adapter绑定 | pass_with_upstream_blockers |
| cross-repo关系分类 | pass |
| required slots / assembly fail-closed | pass |
| 正式03写入 | not allowed until Step19 |
| 下一动作 | 按连续授权进入 Step15 |

本 Step 未创建正式 04、未实现代码、未构造目标仓、未执行测试、未生成真实 config/secret/digest/bundle/report/evidence/verdict/readiness，也未提交 commit。
