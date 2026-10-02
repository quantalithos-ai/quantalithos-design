# 03 Step 14：配置引用与外部依赖绑定

## 1. Step状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review（文档）。已读SOP Step14、规范5.13、闭环2.12及Step13；只定义代码绑定，不开始04配置设计，不启动服务/安装依赖/实现。

### Step内计划

| 项 | 状态 | 位置 |
|---|---|---|
| 输入/问题/诊断/取舍 | done | §2～6 |
| config与entry单元 | done | §7.1～7.2 |
| adapter/path/builder单元 | done | §7.3～7.5 |
| 草稿/自检/同步 | done | §8/10 |

## 2. 本步输入

[Step13](03_ddd_step_13_concurrency_idempotency.md)问题/finite codec取舍/待确认，[Step3技术](03_ddd_step_03_coding_constraints.md)、[Step4布局](03_ddd_step_04_units_file_layout.md)、[Step5模块](03_ddd_step_05_module_contracts.md)、[Step6 RuntimeConfig/AdapterBinding](03_ddd_step_06_runtime_helpers.md)、[Step7ports](03_ddd_step_07_typed_ports.md)、[Step11](03_ddd_step_11_persistence_transactions.md)、[Step12](03_ddd_step_12_errors_recovery.md)、正式02§11。真实Core/SDK manifests与Core actor导出只读复核；genericSDK存在不证明exactoperation。

## 3. SOP问题回答

1. 哪些读配置？infra runtime_config/runtime_builder、API/Worker启动、Web有限public API binding/locale。contracts/domain/application不读raw文件/env/secret；application只接ports及已经验证的资源值。
2. 类型/default/位置？沿RuntimeConfig现有七字段；default_locale=En，其余listener/profile/batch/lease需明确validated值，无编数值默认；生产非0.0.0.0:9090。完整数值/环境/schema/secretref矩阵留04。
3. 外部adapter？八kind Source/Publisher/Material/Governance/Scope/Receiver/Notice/Observation；PG local store/UoW/Clock/ID同runtime composition；没有Billing/Archive/Bus slot。
4. timeout/retry/degrade？profile资源预算由04给，read可以有界retry，dispatch单intent单次调用，Unknown只有probe；缺配置/接口资格fail closed。Bound不是审批/ready，正式资格需consumercontract+SDK exact mapping。
5. 留04？raw schema/profile merge/默认数值/secret管理/TLS/CORS/listener/environment与reload流程；本步输出引用与不可变规则。不让future04覆盖状态/ownership/readonly/幂等。
6. Rust path？root workspace从目标repo取../quantalithos-core/crates/contracts、../quantalithos-sdk/crates/client及必要contracts。真实member已见；不从member路径直接复写root相对引用。
7. runtime/event怎么表达？owner只SDK port/fake，0activeevent/Archive lane；不引Bus依赖或ownerCargo。
8. 仓缺失？marketplace目标不存在、不造package/build；Core/SDK requiredexport缺则停受影响编译，不造同名替身；fake仅测试。真实external资格缺时production对应路径Blocked，不能fallbackfake。

## 4. 当前文档问题诊断

RuntimeConfig字段与AdapterBinding已存在，Step5 builder仅文件职责，需固定验证/注入顺序与startup失败。配置disposition不能由文件自称Bound；owner contract candidate或endpoint非空不证明qualification。worker无CLI执行Job的设计，不能临时增加--scope/--job入口；只常驻调度器typed内部dispatch。

## 5. 改动前后对比

| 项 | 前 | 后 | 原因 |
|---|---|---|---|
| config | 七字段形状 | 逐字段读取/缺省/失败与下游04约束 | 防隐式生产默认 |
| external | qualification表 | eight slots注入/blocked/timeout矩阵 | 不以endpoint证明contract |
| builder | 文件名 | validated assembly函数/失败清理/共享Tx | 防entry拿DB/ownerhandle |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 环境变量直达domain开关 | 易调 | 绕approved/visibility/key | 拒绝 |
| validated refs集中infra装配 | 依赖清楚 | 配置细节必须04闭口 | 采用 |
| production fallback fake | 易展示 | 伪owner/成功truth | 拒绝 |
| required port确定性Blocked adapter | 可诊断、fail closed | 正向路径暂不可用 | 采用 |

## 7. 结构化中间产物

### 7.1 配置引用单元

本单元依据§3.1～3.2/§4 implicit default诊断。采用既有RuntimeConfig validated引用，不提供业务bypass。以下默认是代码契约，非已经生效环境。

| 配置项（RuntimeConfig字段） | 类型 | 读取模块 / 验证 | 默认 / 缺失 | 04承接位置 |
|---|---|---|---|---|
| api_bind | SocketAddr | API启动；literal可解析，部署binding受控 | 无生产默认；API缺则拒启动；Worker不启HTTP listener | listener/TLS/allowlist profile |
| postgres_config_ref | String | infra；非空opaque ref，解析正式PG连接/预算/extension权限 | 无；无法读取/连接/codec版本不符拒绝存储装配 | store与secrets引用，不入domain |
| sdk_profile_ref | String | infra；正式SDKprofile与exactoperation映射，非raw token/URL | 无；缺则对应SDK依赖不装配positive | owner consumer与SDKprofile |
| owner_bindings | Vec<AdapterBinding> | infra；八kind各恰一个，不允许duplicate/unknown；configuration_ref引用必要配置，disposition由validator重新计算 | 缺slot为明确Blocked，不fake；Scope缺则所有read/write fail closed | eight slots/credentialref与qualification表 |
| worker_batch_limit | u32 | infra→FlowSupport.bounded_window/Worker，>0且04profile上限内 | 无编造数值；缺/0拒启动Worker维护 | batch/concurrency/容量profile |
| lease_millis | u64 | infra→claim，>0、checked time add、防溢出；租约不证明remote notcommit | 无编造数值；缺/0拒启动Worker | claim/heartbeat/等待预算 |
| default_locale | DisplayLocale | Web国际化默认展示；只能En/Zh | En；不能影响enum/ref/key/fingerprint | i18n/public web config |

配置ref只提供必要部署输入；PGprofile须包含connect/pool/lock/statement budgets，SDK/ownerprofile须包含read/effect/probe budgets与retry上限；这些是04待闭口数值，不在RuntimeConfig或domain追加raw secrets/URLs。Validated资源参数进入对应adapter或FlowSupport构造，domain只消费typed合法输入。检索extension不可用不能悄悄改变分页/文本语义；可在正式profile明确关闭index辅助、保留相同literal/FTS语义与有界失败，否则Unavailable。

禁止键：auto_approve、skip_scan、trust_publisher_label、ignore_visibility、disable_idempotency、force_installed、force_notice_delivered、payment_success、rebuild_repairs_truth、enable_archive_lane、enable_billing。unknown config keys fail closed，不把它们当无害扩展。

### 7.2 入口本地参数与Web

这是代码绑定面，不是完整04 schema；后续04须沿用key或受控回修。

| binary / surface | 参数 / 环境变量 | 默认 / 缺失 | 不允许 |
|---|---|---|---|
| marketplace-api / marketplace-worker | `--config <path>` / `MARKETPLACE_CONFIG_PATH` | 无默认；二者同时给且不同拒绝，相同只一次加载 | 自动搜HOME、secret argv、以env直覆盖业务规则 |
| marketplace-worker | 无`--job/--scope/--run-id/--retry-all` public参数 | 常驻，typed work/plan/Core actor由可信运行边界和正式profile；不存在对话临时actor | 字符串scope任意执行内部Jobs |
| Web build/runtime公共配置 | `VITE_MARKETPLACE_API_BASE` | 明确配置；URL必须allowlist/origin受控，无相邻owner端点 | 凭证/SDKprofiles/DBref进入浏览器bundle |
| Web locale | vue-i18n locale资源En/Zh | 首次En；用户选择可仅本地display preference | locale重发已accepted命令或改fingerprint/key |

API可信actor/Coremetadata由正式外部auth边界取得，不从任意HTTP businessbody自填；人类auth owner缺时当前路线blocked，不设计本地登录fake。CORS/cookie/token策略由正式auth/TLS合同与04 profile，不能默认开放认证。原型0.0.0.0:9090仅demo，当前不改其文件或server。

config单元停审：七字段读取与缺失、入口参数、Webpublic值、非法bypass、未来04数值责任已闭口。下一adapter单元不得补人类认证/交易owner。

### 7.3 Adapter单元开工与绑定矩阵

问题：所有业务runtime依赖能否只从正式SDK注入，且没有exact支持时仍能给明确负向面。诊断：ServiceClient generic read/call或Bound标签不是operation资格；八slot不是八已部署服务。取舍：每slot必须逐operation/export/字段/consumer资格验证，生产只正式/Blocked实现；fake仅test composition、与同ports等价，不隐式fallback。

| 依赖 | 绑定位置 / 接口 | timeout / retry | 降级与资格 |
|---|---|---|---|
| Source owner：Method/Hub/Images/Artifact | infra/sdk/source_owner → SourceOwnerPort三methods | read bounded；source/ref/version/digest/visibility exact | MP-UP-001与affected来源；body-free，缺formal export ContractBlocked |
| Publisher/human组织authority | infra/sdk/publisher_authority → 六methods | read bounded，不自行认证 | MP-UP-003；Identity AI不是human owner；无formalbasis positive关闭 |
| Material authority | infra/sdk/material_authority → resolve_materials | read bounded | MP-UP-004；材料适用kind/ref/版本非scan自产 |
| Governance | infra/sdk/governance → read/dispatch/probe/consumer | read/probe bounded；dispatch不通用retry | MP-UP-002/SRC010；fullapplication basis/currentapproved不凭summary/ACK补 |
| Scope/current disclosure | infra/sdk/scope_resolver → resolve | read bounded，每入口/replay重新核 | 无scope全体failclosed；不“内部用户默认可见” |
| Receiver | infra/sdk/receiver → qualify/dispatch/probe/consumer | effect单intent；Unknown原probe | MP-UP-005；每资产type exact材料化/接收scope；无installed/paid truth |
| Notice/Disposition | infra/sdk/notice_channel → 五methods | effect单noticeintent；probe-only未知 | MP-UP-007；未formal channel Blocked，不承诺送达/阅读/卸载 |
| Observation | infra/sdk/observation → 三methods | effect原operation/auditset；probe-only | MP-UP-008/affectedproducer；local audit仍独立，不fake admitted |
| PG local stores/UoW | infra/postgres → 九本地ports（含Clock/ID按runtime注入） | 同Tx/帧/codec/CAS；knownrollback才有限重进 | 无持久库不能accepted；commitunknown原key解析 |

八kind的AdapterBinding.disposition：Bound要求config齐备、正式consumer contract与exact SDK operation+schema mapping均验证；仍须每次current authority有效；Blocked必须failure_ref，缺资格的scope/positive closed；Disabled是明确不提供该slot，不能发effect/假success。disposition不新建状态机；文件里填Bound不能绕validator。Artifact/Method/Hub/Images等分source slot的qualifiedowner kind由正式mapping，不把UI展示五类当canonical owner enum。

### 7.4 跨仓编译依赖

相对path以planned目标实现仓**根**Cargo.toml为基准，member全部`.workspace=true`。只读reality：真实Core/SDK路径已存在、manifest export已见；本表不是编译通过记录。

| 依赖仓库 | 全局类型 | 本地路径 / package | Cargo引用（root） | 使用位置 | 不可用处理 |
|---|---|---|---|---|---|
| quantalithos-core | compile | /home/aris/Projects/quantalithos-core/crates/contracts；core-contracts | `path="../quantalithos-core/crates/contracts"` | shared metadata/actor/contracts | required export缺则暂停编译，不复制ActorContext |
| quantalithos-sdk | compile | /home/aris/Projects/quantalithos-sdk/crates/client；sdk-client | `path="../quantalithos-sdk/crates/client"` | infra/sdk | 缺export暂停；generic client不能证明operation |
| quantalithos-sdk | compile（实际adapter直接需要时） | crates/contracts；sdk-contracts | `path="../quantalithos-sdk/crates/contracts"` | SDKtyped request/response | 当前无需者不加，不能造wrapper当owner输出 |
| 九owner与receiver/channel/auth authority | runtime | 当前正式合同路径见Step1/7 | 无Cargo path；正式SDK adapter/fake conformance | eight slots | affected positiveblocked |
| Bus/Billing/Archive主动writer | 非active | not_applicable | 不注册dependency/slot | future重开 | 不能靠配置打开 |

中期private git tag/rev只能正式release/兼容核验后替换，不捏造URL/pin；当前不要求public crates/npm registry。sha2/RFC8785库是第三方compile planned依赖，不是ownertruth；版本兼容与锁文件待实施授权，原算法语义不变。

### 7.5 Runtime assembly与失败清理

读取顺序：entry必要configpath→04将闭口的loader/schema/profile→infra validate→PG连接/schema/extension→Core/SDK兼容/exactbinding→构建实现MarketPorts的具体adapter集合→纯assemble→entry仅获得MarketplaceApplication facade。API与Worker是两个进程各自装配，没有跨进程内存Tx共享；访问同PG本地truth/CAS/帧规则。

```rust
/// Validates runtime references and resource bounds without changing business invariants.
/// # Errors
/// Rejects malformed configuration, duplicate slots, and unqualified positive bindings.
pub fn validate_runtime_config(config: &RuntimeConfig) -> Result<(), MarketError>;

/// Assembles the typed facade after concrete adapters have passed validation.
/// # Errors
/// Rejects invalid configuration; it never replaces a missing adapter with a fake.
pub fn assemble_runtime<P: MarketPorts>(
    config: RuntimeConfig,
    ports: P,
) -> Result<RuntimeAssembly<P>, MarketError>;
```

函数归infra/runtime_config与runtime_builder；RuntimeAssembly<P>/RuntimeConfig已在Step6完整定义。assemble只`validate_runtime_config(&config)`→`MarketplaceApplication::new(ports)`→RuntimeAssembly；具体P构造必须兑现Step7全部associatedtype/accessor和sameTx，不能dyn async、同port不同连接authority、entry拿pool/SDKhandle。P是本仓具体组合实现，不发明上游Rust类型名称。Blocked adapter仍实现同finite Port，返回明确ContractBlocked，不生成contractref/proof/outcome。

validation失败整个entry装配拒绝；已打开pool/SDKclient关闭/drop，无监听/claim/effect。外部binding不足可显式Blocked但必须Scope安全门仍failclosed；PG缺或config非法不能以只读fake“启动成功”。服务已启动后依赖失效按Step12逐入口/Job姿态，不动态换owner/body schema；reload若需改变validator/key算法/ownership，须受控回开，而非热开bypass。

Worker停机：停止取新work，已A/permission职责留durable；不能把inflight timeout当notcommit并重发。API/Web的transport取消不等CancelDistribution业务命令。domain/application不可读环境/configpath或装配SDKendpoint。

跨单元自检：七字段/八slot/三compile候选与Step3/4/7一致；0Billing/Archive/Bus/extraJob入口；没有04profile数字/密钥值/fixture身份被写成已qualified。下一观测步骤只安全埋点，不关闭上游qualification。

## 8. 回填草稿

正式§13采用7.1配置引用、7.2entry参数、7.3external绑定与8slot有限姿态、7.4真实compile路径、7.5validated assembly及失败清理；每项都指向existing planned文件，完整04 schema/数值不在03私造。

## 9. 待确认事项

04未授权；Q-MP-01预算数值、retention/legal deletion权限未闭合。所有MP-UP/SRC/affectedconsumer保留。exactpackage pin/JSONC/profiles不在本Step私造。

## 10. 进入下一步条件

七字段/八slot/三compile候选/entry有限参数/validated assembly/失败清理与红线逐项文档自检完成。允许读SOP Step15、规范5.14、accepted side-effect inventory和Obs当前producer/资格入口；不装配真实runtime、不执行构建、不关闭MP-UP/affected或Q-MP-01。
