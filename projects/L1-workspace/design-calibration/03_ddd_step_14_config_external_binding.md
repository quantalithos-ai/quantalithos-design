# Step 14. 配置引用与外部依赖绑定

> SOP Step14；书写规范§5.13；回填正式03 §13。

## 1. Step 状态

completed / pass_with_external_slots。局部配置类型与注入点补审完成；driver/transport选择仍blocked，进入Step15。

## 2. 本步输入

[Step3](03_ddd_step_03_constraints.md)、[Step4](03_ddd_step_04_file_layout.md)、[Step6-C](03_ddd_step_06c_support_services_entries.md) infra组、[Step7](03_ddd_step_07_trait_port_adapter_contracts.md)、[Step11](03_ddd_step_11_persistence_transaction_consistency.md)、[Step13](03_ddd_step_13_concurrency_idempotency.md)；governance Step14配置绑定与注入粒度，书写规范§5.13。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 谁读配置？ | infra加载，入口只用校验后的局部限额；domain不读环境变量，application只接正式ports。 |
| 类型/默认值？ | §7.1给完整局部参数类型；数值必显式传入，不定义未经04确认的默认值。 |
| 外部如何注入？ | §7.3按既有port构造adapter；缺owner schema只阻塞受影响能力。 |
| 超时/重试？ | 一次有界调用；首版不做隐式写重试。unknown先lookup；查询超时不导致refresh。 |
| 哪些留04？ | 文件格式、环境变量、profile、secret来源、endpoint、数值策略、driver-specific schema。 |
| Cargo如何引入？ | 仅Core最小子集可在未来manifest用实际sibling path；其余为runtime/event/ref。 |
| 缺仓/合同？ | 正向接入blocked；fake限局部机制/负向，不能伪造owner allow。 |

## 4. 当前文档问题诊断

首批列store.resource_limits而无字段，runtime.observation又容易被用户配置为Bound；缺slot便禁用全部Query也不符合Transient和按能力裁剪。现固定参数shape，Observation只能由builder观测生成，缺Attention不影响不选Inbox的可用读取。

## 5. 改动前后对比

| 初稿 | 修订后 |
|---|---|
| 任意string binding | 注入既有具名port；driver-specific selector待04，不能解析任意模块名 |
| resources一个名字 | 字节、行数、页、batch、并发与时限逐字段 |
| 所有slot缺一不可 | §7.4按服务/分支声明所需能力 |
| 假设Core path未知 | 实际路径已由Step6-A核验；未创建manifest与未核验类型区分 |

## 6. 设计取舍

本步新增的配置对象只属于infra/config.rs与runtime_builder.rs，是Step6-C明确后置的技术绑定，不新增业务域或公开协议。RuntimeBuilder原有record/validate_bindings不改成业务启动器。全配置loader及具体driver构造留04；不能用空RuntimeConfig或任意Map宣称生产配置已闭合。无新图，配置→代码映射表足够。

## 7. 结构化中间产物

### 7.1 局部限额对象与代码读取点

位置infra/config.rs。以下字段全必填且private；数字使用std::num::NonZeroU32或NonZeroUsize，超时使用std::time::Duration且大于0。没有隐式Default。

| WorkspaceLimits字段 | 类型 | 读取位置 / 行为 | 默认 / 04承接 |
|---|---|---|---|
| max_request_bytes | NonZeroUsize | entry反序列化前限长；非法输入InvalidInput | 必填；边界限额 |
| max_page_items | NonZeroU32 | API页请求验证，不静默clamp | 必填；查询配置 |
| max_page_token_bytes | NonZeroUsize | cursor decode前限长 | 必填；分页安全 |
| max_snapshot_rows | NonZeroUsize | read adapter coherent snapshot装配上限 | 必填；本地存储 |
| max_snapshot_bytes | NonZeroUsize | read adapter解码/内存上限 | 必填；本地存储 |
| max_commit_rows | NonZeroUsize | atomic adapter tentative写集合校验 | 必填；存储事务 |
| max_commit_bytes | NonZeroUsize | atomic adapter提交前验证；不能拆原子集合 | 必填；存储事务 |
| max_recovery_items | NonZeroU32 | RecoverySourcePort wrapper验证budget | 必填；恢复 |
| max_invalidation_targets | NonZeroU32 | affected_targets wrapper验证limit | 必填；失效 |
| max_in_flight | NonZeroUsize | worker/infra有界并发，不改变业务CAS | 必填；运行资源 |
| owner_read_timeout | Duration | owner/scope/visibility/attention/recovery wrappers | 必填；依赖时限 |
| store_read_timeout | Duration | read/resolve_commit调用时限 | 必填；存储时限 |
| store_commit_timeout | Duration | 原子adapter；超时不能自动NotCommitted | 必填；存储时限 |
| shutdown_timeout | Duration | entry只停接收、等待在途；未知保留 | 必填；受控退出 |

构造：`WorkspaceLimits::try_new(max_request_bytes: NonZeroUsize, max_page_items: NonZeroU32, max_page_token_bytes: NonZeroUsize, max_snapshot_rows: NonZeroUsize, max_snapshot_bytes: NonZeroUsize, max_commit_rows: NonZeroUsize, max_commit_bytes: NonZeroUsize, max_recovery_items: NonZeroU32, max_invalidation_targets: NonZeroU32, max_in_flight: NonZeroUsize, owner_read_timeout: Duration, store_read_timeout: Duration, store_commit_timeout: Duration, shutdown_timeout: Duration) -> Result<Self, ContractError>`；作用是存下校验配置，不启动I/O。

`validate(&self) -> Result<(), ContractError>`检查非零时限、max_page_items<=max_snapshot_rows、max_recovery_items<=max_commit_rows；实际batch包含附属record，仍按最终rows/bytes再检查。getter均为`pub fn <field>(&self) -> <字段类型>`（数值/Duration Copy），仅infra和entry使用。Rustdoc要求各字段说明限制对象、单位与“不可截断成功”；该表即源码注释语义，英文源码遵Step3。

超限调用前发现→InvalidInput；已合法请求但完整装配超预算→StorageUnavailable或SourceUnavailable，安全输出Unavailable。不得截断集合后标Complete；一次写集合超限拒绝，只有Recovery正式continuation可分后续显式批次。

### 7.2 Cursor密钥与无写封装

技术实现位于infra/store_adapter.rs；不改变Step7 WorkspaceCursorCodec签名。选定本地token封装v1：AES-256-GCM，96-bit随机nonce，128-bit tag；key为32 bytes，key_id为16 bytes非零局部标识；密钥重复id拒绝，CSPRNG失败返回SourceUnavailable，不降级明文。具体crypto crate/version待WS-LOCAL-003。

Runtime cursor material字段：active_key_id: [u8;16]，keys: Vec<CursorKeyMaterial>；CursorKeyMaterial字段key_id: [u8;16]、secret: [u8;32]，私有，不实现Debug/Serialize/Clone。工厂`CursorKeyMaterial::try_new(key_id: [u8;16], secret: [u8;32]) -> Result<Self, ContractError>`与`CursorKeyRing::try_new(active_key_id: [u8;16], keys: Vec<CursorKeyMaterial>) -> Result<Self, ContractError>`检查唯一id/非空/active存在；无public secret getter。生命周期结束清理secret内存的具体库交04/07验证。

Wire token = base64url无padding(header + nonce + ciphertext + tag)。header为ASCII WSCP、1-byte version=1、16-byte key_id；header作为AAD整体认证。plaintext是Step6-B WorkspacePageCursor全部字段的唯一typed codec；local整数/集合编码沿Step8，owner visibility/query/source位置codec仍001/003/005/006 blocked。没有codec不得emit token。不能把外部字段改成JSON或String来完成加密。

key移除或不识别version统一CursorInvalid；轮换保留旧key才能解旧token。无TTL字段，不宣称过期时间契约已设计；分页失效依现时actor/scope/generation/view/local/query/visibility轴，token永远不是授权。encode随机nonce不写持久映射，Query保持no-write。密钥持久来源/轮换流程由04，Query不能生成并写回密钥。

### 7.3 外部绑定与跨仓依赖

| 依赖 | 类型 / 精确位置 | 绑定接口 | 不可用处理 |
|---|---|---|---|
| L0-core | compile候选；/home/aris/Projects/quantalithos-core/crates/contracts | core_contracts::actor与metadata已核验子集 | 缺包/导出不符阻塞相关构建 |
| L0-bus | event；infra/bus_subscription.rs | SourceEventPort验证与正式transport wrapper | 缺event schema ContractBlocked，技术故障Unavailable |
| L1-identity / L1-work | runtime/ref/event；scope_adapter.rs | ScopeResolverPort | ScopeUnavailable；无字符串scope推导 |
| 六L1 owner | runtime/ref/event；owner_source_adapter.rs | OwnerReadPort | 逐source ContractBlocked/SourceUnavailable |
| owning visibility chain | runtime/ref；visibility_adapter.rs | VisibilityPort | 缺效力/撤销合同fail-closed |
| attention owning chain | runtime/ref；owner_source_adapter.rs相关适配 | AttentionResolverPort | 004 blocked；不猜read状态 |
| baseline与接续 | runtime/event；recovery_source_adapter.rs | RecoverySourcePort | 001/002 blocked，不取旧projection作基线 |
| local durable store | adapter；store_adapter.rs | WorkspaceReadPort / WorkspaceAtomicStore | WS-LOCAL-001；不得退化分步save |
| SDK/product/sync/archive | 下游runtime/ref | six Query的read/export边界 | 006待定，不建client/cache/handoff |
| L2五项目 | 文档参考 | 无运行绑定 | 不扩展runtime/tools/seed truth |
| fake | member-local tests/support | 已定义port的局部机制与拒绝模拟 | 不进入生产fallback，不输出真实proof |

未来目标根Cargo workspace.dependencies可声明`core-contracts = { path = "../quantalithos-core/crates/contracts" }`，member用`core-contracts.workspace = true`。这是已核验子集的计划示例，不是manifest/commit事实；workspace专用schema007未关闭。其他仓不得成为Cargo path；中期private git tag/rev在实际核验后替换，不预填hash。

### 7.4 入口装配与能力隔离

| 服务 / 分支 | 必需能力 | 额外分支 |
|---|---|---|
| ScopeService | Scope | 正式委托/项目成员关系按owner决定 |
| PartitionService | Scope, Store, Ids | 不初始化local或generation |
| SourceReadService | OwnerRead, Visibility | no-write |
| ProjectionApplyService | Scope, OwnerRead, Visibility, Event, Store, Ids | attention输入正式验证受004 |
| LocalAttentionService | Scope, Store, Ids | 选attention变体需Attention；subject变体需Visibility |
| RecoveryService | Scope, Recovery, Visibility, Store, Ids | source失效另需Event |
| WorkspaceQueryService | Scope, Visibility及read-only store面 | Transient需OwnerRead；Inbox需Attention；发/解token需Cursor |
| api/worker/jobs | 相应service | 只装配被授权的入口，不直接拿写store |

Builder先验证局部限额/密钥，再构造正式driver适配、只读与原子能力面，再组装已有七service与entry。记录AdapterObservation由代码观察产生，不允许配置直接写Bound。Bound只表示接线，依赖调用仍可失败，不能作为readiness或allow。缺分支slot用正式ContractBlocked适配；不能以fake positive初始化未闭合owner返回。各service new签名继续Step6-C，限额通过infra wrappers/entry校验使用，不将infra config注入domain。

## 8. 回填草稿

正式§13保留typed限额、密钥规则、依赖分类、Core计划path与按能力装配；详细参数文件交04。Step6-C的配置后置点由本步承接；无需新增实现文件。

## 9. 待确认事项

WS-LOCAL-002：04需闭合文件/profile/env/secret/endpoint与durable/transport配置schema；WS-LOCAL-003：第三方版本、crypto/UUID/CSPRNG库与MSRV验证未进行。WS-UP原九项不因配置对象闭合而消除。

## 10. 进入下一步条件

参数类型、读取点、无默认值策略、port绑定、超时失败、Cursor无写及依赖类型均已明确。局部设计可进入Step15；真实adapter和完整配置仍阻塞实施。
