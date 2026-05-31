## Step 12. 详细设计承接清单

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 12
- 回填章节：`projects/L0-sdk/02-概要设计.md` §12 详细设计承接清单

### 2. 本步输入

- `02_hld_step_04_code_subject_framework.md`
- `02_hld_step_05_components_boundary.md`
- `02_hld_step_06_key_objects.md`
- `02_hld_step_07_api_interface_skeleton.md`
- `02_hld_step_08_processing_flows.md`
- `02_hld_step_09_state_machine.md`
- `02_hld_step_10_exceptions_boundaries.md`
- `02_hld_step_11_configuration_impact.md`

已确认结论：

```text
Step 12 只做概要设计到详细设计的交付清单。
不新增对象、接口、处理流、状态、配置项或实施任务。
```

### 3. SOP 问题回答

1. 哪些代码主体框架已经由概要设计收稳，详细设计不能重新发明？

   回答：详细设计必须承接官方客户端语义核心、上游契约消费与派生视图、平台能力访问与正式边界适配、事件客户端视图、横切默认行为、package candidate 与验证证据、文档兼容与演进这七个主要组成部分；同时承接 Inbound / Operations、Application Services、Domain Model / Policies、Ports / Projection / Artifact / Adapter 的实现分层视图。详细设计可以决定 crate、package、module 和 file layout，但不能用语言目录、binding wrapper 或 public release 流程重新切分业务主线。

2. 哪些对象、接口、处理流和状态机已经成为详细设计输入？

   回答：对象以 Step 6 的 21 个关键对象为输入；接口以 Step 7 的 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job、port / repository / adapter 边界为输入；处理流以 Step 8 的独立处理流和通用读 / 发布路径为输入；状态机以 Step 9 的状态主语、状态定义、允许迁移、禁止迁移和状态传播关系为输入；异常和配置分别以 Step 10、Step 11 的边界结论为输入。

3. 详细设计应继续展开哪些字段、协议、函数、事务、异常和测试内容？

   回答：详细设计继续展开 Rust / Python / TypeScript 的代码组织、Rust struct / enum / value object、字段全集、枚举值注释、成员函数签名、工厂函数签名、application service 签名、repository / port / adapter trait、DTO schema、event schema、transaction / unit of work、idempotency、error enum、config implementation contract、测试切口和集成边界。详细设计不得暗改概要设计已经收稳的主语、状态集合或接口分类。

4. 如果详细设计发现主语需要变更，应回退到哪里修正？

   回答：对象问题回退 Step 6，接口问题回退 Step 7，处理流问题回退 Step 8，状态机问题回退 Step 9，异常红线问题回退 Step 10，配置影响问题回退 Step 11。若变化会影响七个主要组成部分或代码主体框架，则回退 Step 4 / Step 5。不能在 03-详细设计中直接改名、删减或新增主语。

5. 哪些配置影响需要交给详细设计收口为实现契约？

   回答：`RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、`AdapterConfig`、`JobConfig`、`LanguageProfileConfig`、`BoundaryPolicyConfig`、`CredentialProviderRef`、runtime builder 注入关系、adapter / port / runner constructor 和 `ConfigError` 分类交给 03-详细设计收口。04-配置说明再继续展开 JSON 示例、默认值、环境变量、secret 引用和模块级配置 demo。

6. 哪些未闭环内容不能写入承接清单，而应进入风险与待确认事项？

   回答：仍有方案选择性质的内容不能作为详细设计硬输入，包括 `VerificationEvidence` 是否拆出独立 `EvidenceRedactionStatus`、`RequiresMigration` 进入 `Stable` 的完整门禁条件、`RuntimeConfig` 是否按 language / adapter / job / policy 拆分、JSON 顶层结构如何组织、P0 最小验证目标采用真实服务还是 fake / fixture。这些内容进入 Step 13。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` | 缺少详细设计承接清单 | 03 可能重新发明对象、接口、处理流和状态机 |
| Step 4~11 | 结论分散在多个中间产物 | 后续编写正式 03 时难以判断哪些是稳定输入 |
| Step 9~11 | 有少量待确认项 | 如果混入承接清单，会被误认为已稳定 |
| 代码实现边界 | 概要设计尚未展开完整 Rust 类型、DTO、error 和 config | 需要明确这些是 03 的工作，而不是 02 的遗漏 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 详细设计输入 | 分散在 Step 4~11 | 集中形成可引用承接清单 | 支撑 03 一比一展开 |
| 主语变更规则 | 未集中说明 | 明确详细设计发现主语变化必须回退概要设计 | 防止 03 暗改 02 |
| 未闭环内容 | 容易夹在承接清单中 | 进入 Step 13 风险与待确认事项 | 保持承接清单只含稳定结论 |
| 配置承接 | 只在 Step 11 说明影响轮廓 | 明确交给 03 的配置实现契约方向 | 让 03 与 04 有清晰分工 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：不写承接清单，直接进入详细设计 | 少一个章节 | 详细设计容易漂移或重复决策 | 不采用 |
| 方案 B：把 Step 4~11 全量复制到承接清单 | 信息完整 | 正式文档冗长且重复中间产物 | 不采用 |
| 方案 C：按主题列稳定输入和详细设计继续展开方向，方案性问题进入 Step 13 | 清晰、可审查、可承接 | 需要 Step 13 继续收口风险 | 采用 |

### 7. 结构化中间产物

#### 7.1 详细设计承接清单表

| 已由概要设计收稳 | 详细设计继续展开 |
|---|---|
| 七个主要组成部分：官方客户端语义核心、上游契约消费与派生视图、平台能力访问与正式边界适配、事件客户端视图、横切默认行为、package candidate 与验证证据、文档兼容与演进 | 03 继续定义 crate / package / module 组织、每个组成部分的 application service、domain、port、projection 和 adapter 落点 |
| 实现分层：Inbound / Operations、Application Services、Domain Model / Policies、Ports / Projection / Artifact / Adapter | 03 继续定义 Rust module、trait、struct、constructor 注入和依赖方向 |
| 官方客户端语义核心对象：`SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap` | 03 继续定义字段全集、成员函数、工厂函数、repository、语义一致性校验和跨语言映射测试 |
| 上游契约消费对象：`DerivedBindingView`、`LanguageBindingView`、`UpstreamVersionRef`、`SnapshotFreshnessState` | 03 继续定义 snapshot source port、derived view builder、freshness repository、stale / unsupported / unknown error 和刷新事务 |
| 平台能力访问对象：`ServiceClientView`、`ServiceCapabilityRef` | 03 继续定义 formal API / fake boundary adapter trait、runtime call DTO、result mapper、capability support 判断和 trace / redaction 注入 |
| 事件客户端视图对象：`BusEventClientView`、`EventSemanticMapping` | 03 继续定义 bus publish / subscribe adapter、event client DTO、event semantic mapping 校验和 bus boundary error |
| 横切默认对象：`ErrorMappingPolicy`、`TracePropagationPolicy`、`RedactionPolicy`、`CredentialProtectionPolicy`、`BoundaryGuard` | 03 继续定义 policy struct / enum、policy factory、guard error、credential reference 和敏感信息负向测试 |
| candidate 与证据对象：`PackageCandidate`、`VerificationEvidence` | 03 继续定义 candidate aggregate、status transition、evidence schema、artifact ref、runner result 和 verification gate |
| 文档兼容演进对象：`CompatibilityDecision`、`DeprecatedApiRecord`、`MigrationGuideRef` | 03 继续定义 compatibility decision enum、deprecated lifecycle、migration ref validation、docs example linkage 和 removal gate |
| Command API：`UpdateSdkSemanticBaseline`、`RefreshDerivedBindingView`、`InvokeServiceCapability`、`PublishBusEvent`、`RecordCompatibilityDecision`、`DeprecateSdkApi` | 03 继续定义 command DTO、handler、application service signature、idempotency、error mapping、repository / outbox 保存顺序 |
| Query API：能力、上游版本、freshness、service view、event view、runtime read、subscription、candidate、evidence、compatibility、deprecated、migration ref 查询 | 03 继续定义 query DTO、view DTO、pagination / filter、projection consistency marker、not-found / stale behavior 和只读权限约束 |
| Inbound Event Consumer：core / bus / formal API changed、validation run finished | 03 继续定义 event envelope、source ref、event id、idempotency key、consumer transaction 和重复事件处理 |
| Outbound Event：semantic baseline changed、snapshot freshness changed、candidate generated、evidence recorded、compatibility decision recorded、deprecated API recorded | 03 继续定义 event schema、outbox publisher contract、routing / topic mapping、payload redaction 和发布失败处理 |
| Operations Job：freshness check、candidate generation、language package build、cross-language smoke、docs validation、compatibility check、boundary policy verification、projection rebuild | 03 继续定义 job runner、cursor / checkpoint、runner port、artifact / report ref、lock / concurrency 和 job error |
| Step 8 独立处理流 | 03 继续定义完整 service call graph、transaction scope、error branch、idempotency conflict 和 integration tests |
| 通用只读路径和通用 outbound event 发布路径 | 03 继续定义 read repository、projection rebuild、outbox table / store contract、publisher retry 和 event status |
| 状态主语：`SnapshotFreshnessState`、`CapabilitySupportState`、`PackageCandidateStatus`、`VerificationEvidence` result / marker、`CompatibilityDecision`、`DeprecatedApiRecord` | 03 继续定义 Rust enum、枚举值注释、transition guard、forbidden transition error、持久化表示和状态迁移测试 |
| 禁止迁移清单 | 03 继续定义 negative test、error type 和 service guard，证明 stale / fake / skipped / breaking / query mutation 等路径被阻断 |
| 异常与边界场景 | 03 继续定义 error enum、adapter exception mapping、runtime boundary failure、unredacted evidence、fake success 和 deprecated silent removal 的错误分支 |
| 配置影响轮廓 | 03 继续定义 `RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、`AdapterConfig`、`JobConfig`、policy config、builder 注入和 `ConfigError` |
| 禁止配置化边界 | 03 继续定义 config validation rule 和 builder restriction；04 配置说明继续定义配置填写和示例 |

#### 7.2 详细设计继续展开方向说明

| 展开方向 | 详细设计应补充 | 不应在详细设计中做什么 |
|---|---|---|
| 代码组织 | workspace / crate / package、module path、语言包目录、公共 API surface | 不按目录重新定义主要组成部分 |
| 数据结构 | Rust struct / enum / value object、字段类型、字段注释、枚举值注释 | 不改 Step 6 已收稳的对象主语 |
| 函数与服务 | domain method、factory、application service、repository trait、adapter trait 的正式签名 | 不新增绕过 Step 8 处理流的新入口 |
| 协议与 DTO | command / query / event / job DTO、request / response、event schema、view schema | 不改变 Step 7 接口分类和写入归属 |
| 事务与一致性 | `UnitOfWork`、repository 保存顺序、idempotency、outbox、projection 和 evidence 保存关系 | 不让 query、projection rebuild 或 adapter 反写真相 |
| 状态机 | enum、transition guard、forbidden transition error、状态迁移测试 | 不新增 Step 9 未定义的状态集合 |
| 异常处理 | error enum、error mapping、adapter exception、boundary failure、config error 和 runner error | 不用错误码反向改变概要边界 |
| 配置契约 | runtime config、loader、validator、adapter / job / policy config、builder 注入 | 不让领域对象直接读取 raw config |
| 测试输入 | 单元测试、集成测试、contract test、negative transition test、configuration validation test | 不在详细设计中替代完整测试方案 |

#### 7.3 概要设计回退规则说明

```text
如果详细设计发现上述主语需要变更，说明概要设计尚未真正收稳，应先回到概要设计修正，而不是在详细设计中暗改。
```

| 详细设计发现的问题 | 回退位置 |
|---|---|
| 需要新增 / 删除 / 改名代码主体框架或主要组成部分 | 回到 Step 4 / Step 5 |
| 需要新增 / 删除 / 改名关键对象 | 回到 Step 6 |
| 需要新增 / 删除 / 改名正式 API / Event / Job | 回到 Step 7 |
| 需要改变关键处理流顺序、责任归属或写入边界 | 回到 Step 8 |
| 需要新增状态集合或改变允许 / 禁止迁移 | 回到 Step 9 |
| 需要改变异常红线、失败归属或边界场景 | 回到 Step 10 |
| 需要改变配置影响或禁止配置化边界 | 回到 Step 11 |
| 仍是方案选择、风险判断或未闭环问题 | 进入 Step 13 |

#### 7.4 不进入承接清单的待确认项

| 待确认项 | 当前处理 |
|---|---|
| `VerificationEvidence` 是否拆成 `EvidenceResult` 与 `EvidenceRedactionStatus` 两个 enum | 进入 Step 13，03 可提出但不能直接暗改概要状态主语 |
| `RequiresMigration` 进入 `Stable` 的完整门禁条件 | 进入 Step 13，当前只保留“有 migration ref 且门禁满足”的概要口径 |
| `RuntimeConfig` 是否按 language / adapter / job / policy 拆分 | 进入 Step 13，03 再结合代码组织选择 |
| JSON 顶层是否按模块拆分、是否保留 common 段 | 进入 Step 13 或 04-配置说明，不作为 02 硬结论 |
| P0 最小验证目标使用真实服务 endpoint 还是 fake / fixture target | 进入测试方案和验收标准，不作为 03 类型主语 |
| public registry 发布、release rollback 和完整生态增强 | 不进入当前 P0 承接清单，后续重新裁剪 |

### 8. 回填草稿

本步回填 `02-概要设计.md` §12 时建议使用以下结构：

```text
## 12. 详细设计承接清单
### 12.1 详细设计承接清单表
### 12.2 详细设计继续展开方向说明
### 12.3 概要设计回退规则说明
### 12.4 不进入承接清单的待确认项
```

回填时可引用本文件 `7.1` ~ `7.4` 的结构化中间产物，不需要重复保留 SOP 问题回答、问题诊断和设计取舍。

### 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| Step 12 是否纳入待确认项 | A：纳入承接清单；B：单列为不进入承接清单并交给 Step 13 | 建议 B | 承接清单必须只包含稳定输入 |
| 是否在本步列开发任务 | A：列；B：不列，留给实施计划 | 建议 B | 概要设计承接清单不是实施计划 |
| 是否在本步画图 | A：画；B：不画 | 建议 B | 本步是交付清单，表格比图更清楚 |

以上待确认项不阻塞进入 Step 13。除非后续讨论明确改变，否则后续 Step 按“建议方案”继续展开。

### 10. 进入下一步条件

- [x] 已明确概要设计向详细设计交付哪些稳定输入。
- [x] 已明确详细设计继续展开哪些字段、协议、函数、事务、异常、配置和测试内容。
- [x] 已明确发现主语变更时必须回退到概要设计对应 Step。
- [x] 已明确仍未闭环的内容不进入承接清单，而进入 Step 13。
- [x] 已避免新增对象、接口、流程、状态、开发任务、排期、测试用例全集和实施指令。
