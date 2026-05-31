## Step 11. 配置影响轮廓

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 11
- 回填章节：`projects/L0-sdk/02-概要设计.md` §11 配置影响轮廓

### 2. 本步输入

- `02_hld_step_04_code_subject_framework.md`
- `02_hld_step_05_components_boundary.md`
- `02_hld_step_07_api_interface_skeleton.md`
- `02_hld_step_08_processing_flows.md`
- `02_hld_step_09_state_machine.md`
- `02_hld_step_10_exceptions_boundaries.md`
- `00-需求文档.md` 中三语言一致、trace、error mapping、redaction、credential protection 和禁止保存正文要求
- `01-架构设计.md` 中配置不得绕开语义基线、redaction、trace、错误映射、兼容治理和上游 truth 引用的横切约束

### 3. SOP 问题回答

1. 哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受到配置影响？

   回答：受配置影响的是 SDK runtime entry、service client entry、event client entry、formal API boundary adapter、fake boundary adapter、bus boundary adapter、上游契约 source port、language binding generator、package builder、smoke / docs / compatibility / boundary validation job，以及横切默认策略的注入入口。配置可以影响目标端点、运行 profile、语言目标、runner 目标、artifact / report 引用、transport profile 和 policy profile，但不能改写领域真相、状态机红线或安全下限。

2. 哪些模块只能间接受配置影响，不能直接读取配置？

   回答：`SdkSemanticBaseline`、`ClientCapabilityModel`、`DerivedBindingView`、`SnapshotFreshnessState`、`ServiceClientView`、`BusEventClientView`、`PackageCandidate`、`VerificationEvidence`、`CompatibilityDecision`、`DeprecatedApiRecord` 等领域对象、状态对象和本地 truth 对象不能直接读取配置。它们只能接收 application service、factory、policy 或 adapter 注入的已校验 typed value。

3. 哪些领域规则、状态机、审计链、事务一致性或安全门禁禁止配置化？

   回答：禁止配置化的边界包括上游 truth 引用、SDK 本地 truth 状态机、query 只读约束、redaction 和 credential protection 下限、fake success 禁止伪装生产成功、failed / skipped / unredacted evidence 不支撑 stable、stale / unsupported / unknown 视图不支撑 verified candidate、breaking / rejected compatibility 不支撑 stable，以及 SDK 不成为 auth provider、gateway、bus runtime 或 public release manager 的职责边界。

4. 哪些配置影响需要在 03-详细设计中继续定义实现契约？

   回答：`RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、`AdapterConfig`、`JobConfig`、`LanguageProfileConfig`、`BoundaryPolicyConfig`、`CredentialProviderRef`、runtime builder 注入关系、port constructor 依赖和 `ConfigError` 分类应由 03-详细设计定义。概要设计只给出影响范围和禁止边界，不定义字段全集、默认值或加载算法。

5. 哪些配置细节属于 04-配置说明，不能在概要设计中提前展开？

   回答：JSON 配置示例、环境变量名、secret 挂载方式、默认值、部署路径、runner 命令参数、report 目录、artifact 目录、endpoint 具体值、不同语言 package manager 细节和模块级完整配置说明属于 04-配置说明，不在本步展开。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` | 未系统说明配置会影响哪些概要层结构 | 详细设计可能把配置散落在 adapter、job 和语言入口中 |
| 旧配置口径 | 容易把 endpoint、runner、fake target 等配置能力理解为可以改变语义 | 可能绕开 SDK 共同语义、fake 边界和验证门禁 |
| Step 8 / Step 10 | 已点名 redaction、credential、fake success 等底线，但未说明它们不能被配置关闭 | 后续实现可能把安全默认做成可选开关 |
| Step 9 | 已定义状态红线，但未声明状态机不能由配置直接改写 | 可能出现把 stale 配成 fresh、把 failed 配成 passed 的错误 |
| 04-配置说明边界 | 未显式划分概要设计、详细设计和配置说明的内容边界 | 容易在概要设计中提前写 JSON、默认值和部署细节 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置影响范围 | 分散在运行目标、fake boundary、验证和横切默认里 | 按主要组成部分、入口、adapter、job 和外部接缝统一列出 | 让详细设计能稳定展开配置注入关系 |
| 配置与领域对象关系 | 未区分直接读取和间接受影响 | 明确领域对象、状态机和 truth 对象不能直接读取配置 | 保持领域纯度和状态机可信 |
| 安全策略 | redaction / credential 只是横切默认 | 明确只能收紧或选择已批准策略,不得关闭最低保护 | 防止敏感信息泄露 |
| fake / verification | fake target 可用于验证 | 明确配置不能把 fake success 标成生产成功 | 防止 package candidate 证据失真 |
| 配置文档边界 | 概要、详细、配置说明可能混写 | 概要写影响轮廓,详细写实现契约,配置说明写 JSON 和部署值 | 避免章节越界 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：概要设计不写配置影响 | 文档更短 | 详细设计容易把配置做成任意开关,破坏状态机和安全边界 | 不采用 |
| 方案 B：概要设计直接写完整 JSON 配置和默认值 | 看起来可实现 | 过早进入 04-配置说明,且会和详细设计的类型契约重复 | 不采用 |
| 方案 C：概要层只写配置影响范围、禁止配置化边界和详细设计承接方向 | 能保护设计红线,又不提前固化实现字段 | 需要后续 03 / 04 严格承接 | 采用 |

### 7. 结构化中间产物

#### 7.1 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 不能配置成什么 | 交给详细设计展开 |
|---|---|---|---|---|
| 官方客户端语义核心 | 间接受影响 | language profile、能力显示 profile、语义检查入口 | 不能按语言分裂平台语义,不能绕开 `SdkSemanticBaseline` | `LanguageProfileConfig`、runtime builder 注入、semantic validator |
| 上游契约消费与派生视图 | 是 | source port、snapshot ref provider、refresh runner profile | 不能把本地配置当成上游 truth,不能把 stale / unknown 配成 fresh | `ConfigLoader`、source port config、freshness check config |
| 派生 binding / language view | 是 | generator profile、语言目标、输出目标引用 | 不能改变平台概念含义,不能生成未被基线批准的能力 | generator config、language binding builder |
| 平台能力访问与正式边界适配 | 是 | formal API endpoint、transport profile、timeout / retry profile、fake target profile | 不能成为 server gateway,不能拥有服务端 truth,不能用 fake 伪装生产能力 | `AdapterConfig`、formal / fake boundary builder、call context 注入 |
| 事件客户端视图 | 是 | bus endpoint、subscription profile、publish / subscribe transport profile | 不能重定义 `L0-bus` 语义、delivery、retry、replay truth | bus client adapter config、event boundary builder |
| 横切默认行为 | 是,但只允许受控选择或收紧 | error mapping、trace propagation、redaction、credential protection policy profile | 不能关闭 redaction / credential 下限,不能输出 raw secret、payload body 或生产 request / response body | `BoundaryPolicyConfig`、`ConfigValidator`、policy factory |
| package candidate 与验证证据 | 是 | package build profile、smoke target、docs runner target、evidence artifact / report ref | 不能把 failed / skipped / fake / unredacted evidence 配成 passed 或 stable | `JobConfig`、runner config、evidence storage config |
| 文档、兼容与演进 | 是 | docs example target、compatibility check profile、migration guide ref source | 不能绕开 compatibility gate,不能静默移除 deprecated API | docs validation config、compatibility job config |
| Query / projection read boundary | 有限受影响 | read model source、pagination profile、projection rebuild runner profile | Query 不能触发状态迁移,projection rebuild 不能改写 truth | read adapter config、projection rebuild job config |
| Outbound event / report boundary | 是 | event sink profile、report sink profile、notification target ref | 不能携带业务正文、事件 payload、请求响应正文或 credential 正文 | outbound port config、report publisher config |

#### 7.2 只能间接受配置影响的主体

| 主体 | 可接受的配置影响形式 | 禁止形式 |
|---|---|---|
| 领域对象和 value object | 接收已校验的 typed value、policy 或 ref | 直接读取 raw config、环境变量或部署文件 |
| 状态机对象 | 由 command、consumer、job result 和领域函数触发迁移 | 配置直接指定状态或跳过迁移条件 |
| 本地 truth aggregate | 通过 application service 注入 validated dependency | adapter / config loader 直接改写 truth |
| policy object | 由 `ConfigValidator` 选择已批准策略或更严格策略 | 允许关闭最低 redaction、credential、trace 或 error mapping 约束 |
| query / projection | 读取已构建的 read model 和安全 view | 通过 query 配置触发 command、副作用或 truth rewrite |

#### 7.3 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| `L0-core` / `L0-bus` / formal API truth 引用 | SDK 只消费上游 truth,不能用配置替代上游事实 | 需求 / 架构 / 对应上游仓设计 |
| `SdkSemanticBaseline` 的共同语义不变量 | 三语言可以 idiomatic,但不能语义分裂 | 概要 Step 5 / Step 6 / Step 9,再进入详细设计 |
| `SnapshotFreshnessState` 可用性判断 | stale / unsupported / unknown 不能被配置伪装为 fresh | 状态机和上游消费设计 |
| `CapabilitySupportState` fake / unsupported 判断 | fake / fixture 不能证明生产可用 | formal API / fake boundary 设计和测试方案 |
| `PackageCandidateStatus` verified / stable 门禁 | stable 必须由 freshness、evidence 和 compatibility 共同支撑 | candidate / evidence / compatibility 设计 |
| `VerificationEvidence` result 与 redaction marker | redaction 不等于 passed,failed / skipped 不支撑 stable | evidence 设计和测试方案 |
| `CompatibilityDecision` breaking / rejected 阻断 | 兼容治理不能被运行配置关闭 | 兼容治理设计和 ADR |
| redaction 和 credential protection 最低保护 | 敏感信息泄露是一票否决 | 安全需求、架构横切关注点、测试方案 |
| Query 只读和 projection rebuild 只重建 | 防止读路径改写真相 | 详细设计的 handler / repository 权限约束 |
| SDK 职责边界 | SDK 不能配置成 auth provider、gateway、bus runtime 或 public release manager | 需求范围和架构边界 |

#### 7.4 配置影响轮廓图

```text
[RuntimeConfig / Profile]
  | validate
  v
[ConfigValidator]
  | inject typed config
  v
[Entries / Adapters / Jobs]
  | call with context
  v
[Formal API / L0-bus / Runner / Source Ports]

[Domain Truth / State Machines / Safety Gates]
  ^ receive typed value or policy only
  |
[Application Services / Policy Factories]
  ^ no raw config bypass
  |
[ConfigValidator]
```

关键说明：

- 配置只能通过 validator、builder、adapter、job 和 policy factory 影响概要层结构。
- 领域 truth、状态机和安全门禁不能直接读取 raw config。
- formal API、`L0-bus`、runner 和 source port 可以受配置影响,但配置不拥有它们的 truth。
- 图不表达 JSON 字段、默认值、环境变量、密钥系统或部署挂载方式。

#### 7.5 交给 03-详细设计和 04-配置说明的边界

| 后续文档 | 应展开内容 | 不应承接为可变语义 |
|---|---|---|
| `03-详细设计.md` | `RuntimeConfig` / `ConfigLoader` / `ConfigValidator` 类型契约、adapter / job / policy factory 注入关系、config error 分类、constructor 参数方向 | 不允许把禁止配置化边界变成字段开关 |
| `04-配置说明.md` | JSON 示例、模块级配置 demo、配置项作用、默认值、部署方式、secret 引用和完整示例 | 不重新定义领域状态机、上游 truth、compatibility 规则或 redaction 下限 |
| `05-测试方案.md` | 配置校验、无效配置、安全下限、fake boundary 和 candidate gate 的测试切口 | 不用测试配置绕过设计不变量 |
| `06-验收标准.md` | 配置不能绕开安全、状态机、candidate 和兼容门禁的验收证据 | 不把环境差异当成降低验收标准的理由 |

### 8. 回填草稿

本步回填 `02-概要设计.md` §11 时建议使用以下结构：

```text
## 11. 配置影响轮廓
### 11.1 配置影响轮廓表
### 11.2 只能间接受配置影响的主体
### 11.3 禁止配置化边界
### 11.4 配置影响轮廓图
### 11.5 详细设计与配置说明承接边界
```

回填时可引用本文件 `7.1` ~ `7.5` 的结构化中间产物，不需要重复保留 SOP 问题回答、问题诊断和设计取舍。

### 9. 待确认事项

- 具体 `RuntimeConfig` 是否按 language、adapter、job、policy 四类拆分,留给 03-详细设计结合代码组织决定。
- 具体 JSON 顶层是否按模块拆分、是否保留全局 common 段,留给 04-配置说明结合本仓运行形态决定。
- SDK P0 是否需要真实服务 endpoint 作为默认验证目标,还是继续允许 fake / fixture target,留给测试方案和验收标准确认。

### 10. 进入下一步条件

- [x] 已明确哪些概要层结构受配置影响。
- [x] 已明确哪些领域对象、状态机和 truth 主体只能间接受配置影响。
- [x] 已明确禁止配置化边界。
- [x] 已说明哪些配置实现契约交给 03-详细设计。
- [x] 未写入 JSON 配置项清单、默认值、环境变量或实现级加载算法。
