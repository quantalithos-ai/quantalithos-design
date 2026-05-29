# Step 11. 配置影响轮廓

## 1. Step 状态

- 状态：[x] 已创建
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 11
- 回填章节：`projects/L0-bus/02-概要设计.md` §11 配置影响轮廓

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 4 代码主体框架 | 已确认 Inbound / Operations、Application Services、Domain Model / Policies、Ports / Persistence / Projection / Adapters 分层 |
| Step 5 主要组成部分 | 发布接入、delivery 推进、反馈幂等、失败恢复、审计只读输出、存储引用与后端适配边界 |
| Step 7 API / 接口骨架 | Command、Query、Inbound Event Consumer、Outbound Event、Operations Job、Port / Repository 边界 |
| Step 8 处理流 | 已明确 outbox relay、delivery worker、retry worker、projection worker、backend capability check 等受运行参数影响的路径 |
| Step 9 状态机 | 已明确状态迁移红线和 projection 不反写 truth |
| Step 10 异常边界 | 已明确 payload body、raw backend response、raw secret、audit chain、read-only output 等红线 |
| 架构横切关注点 | backend、store、retry、DLQ、read output、授权引用、运行限额应集中配置，不散落到 adapter 或 worker 私有逻辑 |

已确认结论：

```text
本步只识别配置影响轮廓。
不定义 JSON 示例、配置项清单、默认值、环境变量名、RuntimeConfig 字段全集或 ConfigError 枚举全集。
```

---

## 3. SOP 问题回答

### 3.1 哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受到配置影响？

回答：

受配置影响的主要是运行装配和外部接缝：store profile、outbox source、transport backend profile、secret reference、worker batch / timeout / retry category、projection rebuild policy、backend capability source、outbound publisher profile、read projection profile。它们影响入口、worker、adapter、repository 和 runtime builder 的装配方式，不改变领域对象的不变量。

### 3.2 哪些模块只能间接受配置影响，不能直接读取配置？

回答：

`PublicationAcceptance`、`DeliveryRecord`、`FeedbackResult`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`BusAuditEntry`、`DeliveryHistoryEntry` 等领域对象不能直接读取配置。`PayloadBoundaryGuard`、`DeliveryLifecycle`、`RecoveryEligibilityPolicy`、`ReadOnlyOutputPolicy`、`BackendCapabilityPolicy` 可以由 application / runtime 通过策略引用构造，但 policy 本身不读取配置文件。

### 3.3 哪些领域规则、状态机、审计链、事务一致性或安全门禁禁止配置化？

回答：

禁止配置化的边界包括：bus 不保存 payload body、不保存后端私有响应正文、不让 projection 反写 truth、不允许 replay 绕过 DLQ / history / audit chain、不允许关闭关键状态审计、不允许 backend raw status 直接落入 `DeliveryStatus`、不允许 raw secret 进入状态或文档产物、不允许配置开关绕过 privileged operation 授权边界。

### 3.4 哪些配置影响需要在 03-详细设计中继续定义实现契约？

回答：

详细设计需要定义 `RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、`AdapterConfig`、`JobConfig`、`StoreConfig`、`ProjectionConfig`、`PublisherConfig`、`ConfigError` 和 runtime builder 注入关系。详细设计还要说明配置如何注入 repository、port、worker、application service 和 policy factory，但不能让 domain object 直接读取配置。

### 3.5 哪些配置细节属于 04-配置说明，不能在概要设计中提前展开？

回答：

配置文件格式、JSON 示例、配置路径、字段名、默认值、环境变量、secret 管理方式、部署挂载、热更新策略、具体 batch size、timeout、retry interval、backend endpoint 和 store connection 细节属于 04-配置说明或详细设计，不在概要设计 Step 11 展开。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` | 没有独立配置影响章节 | backend、store、retry、projection 配置容易散落到 worker 或 adapter 描述中 |
| 架构横切关注点 | 已点名配置集中管理，但未转译为概要设计的配置影响轮廓 | 详细设计缺少配置实现契约输入 |
| Step 8 / Step 10 | worker、adapter、projection、capability 均受配置影响 | 如果不收束，会让配置影响被误写进处理流或异常处理细节 |
| Step 9 | 状态机红线已固定 | 需要明确这些红线不能被配置开关改变 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 配置位置 | 散落在横切关注、worker、adapter 和异常边界描述中 | 单独形成配置影响轮廓 | 支撑 03 / 04 承接 |
| 配置粒度 | 可能提前写具体配置项 | 只写影响类别和详细设计承接方向 | 保持概要层边界 |
| domain 与配置关系 | 未明确 | domain object 不直接读取配置，policy 由外部构造 | 防止领域模型依赖 runtime |
| 禁止配置化 | 仅作为异常红线出现 | 单独列禁止配置化边界 | 防止实现阶段用配置绕过红线 |
| 后续承接 | 不清楚由谁继续展开 | 交给 03 定义配置实现契约，04 说明配置填写和校验 | 保持文档链路清晰 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：概要设计不提配置 | 文档短 | 详细设计会重新判断配置边界，worker / adapter 易散落配置 | 不采用 |
| 方案 B：概要设计直接写完整配置 schema | 实现者最直观 | 过早进入 04 配置说明和详细设计层 | 不采用 |
| 方案 C：概要设计只写配置影响轮廓、禁止配置化边界和 03 承接方向 | 粒度合适，边界稳定 | 仍需后续补具体配置 schema | 采用 |

---

## 7. 结构化中间产物

### 7.1 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| 发布材料接入与传递语义形成 | 间接受影响 | feature policy、backend capability profile、contract compatibility policy | `RuntimeConfig` 注入 service / policy factory，`ConfigValidator` 校验策略引用 |
| `BusCommandApi` | 间接受影响 | profile、timeout、request boundary category | API adapter constructor 和 runtime builder 注入关系 |
| `OutboxRelayTrigger` / `ConsumeCommittedOutboxFact` | 是 | source profile、cursor store、batch size、retry category | `JobConfig`、outbox source adapter config、checkpoint 注入 |
| 订阅 delivery 推进 | 间接受影响 | backend profile、worker profile、timeout、batch size | `DeliveryWorker` config、`TransportBackendPort` adapter config |
| `TransportBackendPort` | 是 | backend profile、external endpoint、secret ref、timeout | `AdapterConfig`、secret reference resolution、adapter constructor |
| 结果反馈与幂等留痕 | 间接受影响 | idempotency store profile、feedback timeout category | repository config、feedback API adapter config |
| 失败恢复与重放准备 | 是 | retry policy、DLQ policy、replay approval ref policy | `JobConfig`、`RecoveryPolicyConfigRef`、policy factory |
| `RunRetryCycle` | 是 | retry、batch size、worker profile | retry worker config 和 recovery repository cursor |
| 审计、历史与只读输出 | 是 | projection profile、store profile、rebuild mode、read consistency policy | `ProjectionConfig`、read repository config、projection builder 注入 |
| `RunReadOutputProjection` / `RebuildReadProjection` | 是 | batch size、cursor、rebuild policy、projection store profile | projection worker config、rebuild job config |
| `BusQueryApi` | 间接受影响 | read profile、consistency marker policy | query adapter config、read service config 注入 |
| Outbound Event / `OutboxPublisherPort` | 是 | publisher profile、external endpoint、retry category | `PublisherConfig`、outbox publisher adapter config |
| 存储、引用与后端适配边界 | 是 | store profile、connection ref、clock profile、id generator profile | `StoreConfig`、repository constructor、`UnitOfWork` factory |
| `CheckBackendCapability` | 是 | capability source、backend profile、secret ref | backend capability job config、capability adapter config |
| Domain objects | 否 | 不适用 | 不定义直接配置读取，详细设计保持纯领域对象 |
| Domain policies | 间接受影响 | policy ref、profile | 由 application / runtime 构造，不直接读取配置 |

### 7.2 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| 允许 bus 保存 payload body | 破坏 bus 只保存引用的边界 | 需求文档、架构设计和概要设计 Step 10 |
| 允许保存后端私有响应正文 | 破坏后端语义归一化和信息边界 | 架构设计、概要设计 Step 5 / Step 10 |
| 关闭关键状态审计 / history | 破坏可追溯性和 replay trusted chain | 需求文档、架构横切关注点、概要设计 Step 9 |
| 允许 projection 反写 bus truth | 破坏 read-only output 边界 | 架构数据所有权、概要设计 Step 8 / Step 9 |
| 允许 replay 绕过 DLQ / history / audit chain | 破坏恢复和重放审计边界 | 概要设计 Step 9 / Step 10 |
| 允许 backend raw status 直接写 `DeliveryStatus` | 破坏 transport semantic 和 backend adapter 隔离 | 架构交互方式、概要设计 Step 8 / Step 9 |
| 允许 `CheckBackendCapability` 自动改写 delivery truth | 破坏 capability check 与 delivery truth 边界 | 概要设计 Step 9 / Step 10 |
| 允许 raw secret 写入配置正文、状态或审计 | 破坏安全边界 | 配置设计、安全设计、实施计划 |
| 允许关闭 privileged operation 授权边界 | tap、DLQ、replay、failure material 等能力必须受控 | 需求文档、架构横切关注点 |
| 允许业务幂等替代 bus 幂等 | bus 只处理 delivery / feedback 幂等，不接管业务副作用 | 需求文档、概要设计 Step 5 / Step 6 |

### 7.3 只能间接受配置影响的模块

| 模块 / 对象 | 间接方式 | 禁止事项 |
|---|---|---|
| `PublicationAcceptance` | 由 service 传入已校验材料和策略结果 | 不读取配置文件，不判断 backend profile |
| `DeliveryRecord` | 由 service / policy 传入状态迁移判断结果 | 不读取 worker config，不直接调用 backend |
| `FeedbackResult` | 由 feedback service 根据 command / signal 构造 | 不读取 timeout 配置，不判断业务补偿 |
| `RetryPlan` | 由 `RecoveryEligibilityPolicy` 和 policy ref 生成 | 不保存完整 retry 算法参数 |
| `DeadLetterEntry` | 由 recovery service 和 trusted chain 构造 | 不读取 DLQ retention 配置 |
| `ReplayPreparation` | 由 replay service 传入 approval / audit chain | 不直接访问 authorization / governance 配置 |
| `BusAuditEntry` | 由 application service 创建 | 不由配置决定是否必须写入 |
| `TransportViewProjection` / `FailureSummaryProjection` | 由 read output service 根据 projection config 调度构建 | 不反写 truth，不读取配置文件 |

### 7.4 配置影响轮廓图

```text
Runtime / deployment configuration
  |
  v
ConfigLoader / ConfigValidator
  |
  v
Runtime builder
  |
  +-- Inbound adapters
  |     - BusCommandApi / BusQueryApi / DeliveryFeedbackApi
  |
  +-- Operations jobs
  |     - OutboxRelay / DeliveryWorker / RetryWorker / ProjectionWorker
  |
  +-- Ports and adapters
  |     - BusStorePort / TransportBackendPort / OutboxPublisherPort
  |
  +-- Policy factories
        - PayloadBoundaryGuard / RecoveryEligibilityPolicy
        - ReadOnlyOutputPolicy / BackendCapabilityPolicy
```

关键说明：

- 该图只表达配置如何影响概要层入口、job、adapter 和 policy factory。
- 领域对象不直接读取配置，配置通过 runtime builder 和 application service 注入。
- 图不表达 JSON 示例、配置路径、默认值、环境变量、密钥系统细节或部署挂载。
- 禁止配置化边界不能通过 runtime builder 被绕过。

### 7.5 交给详细设计展开的配置实现契约

```text
本章只识别配置影响轮廓，不定义配置项清单、JSON 示例、RuntimeConfig 字段、ConfigError 枚举或 adapter constructor 参数。
上述配置影响应在 03-详细设计中收口为配置实现契约，并由 04-配置说明继续说明如何填写、校验和使用。
```

详细设计至少需要继续定义：

- `RuntimeConfig` 如何聚合 store、backend、job、projection、publisher、policy 和 secret reference。
- `ConfigLoader` / `ConfigValidator` 如何保证禁止配置化边界不能被配置绕过。
- `AdapterConfig` 如何注入 `TransportBackendPort`、`OutboxPublisherPort` 和 store adapter。
- `JobConfig` 如何注入 outbox relay、delivery worker、retry worker、projection worker 和 backend capability job。
- `runtime builder` 如何把配置传入 adapter、repository、application service 和 policy factory，而不是传入 domain object。
- `ConfigError` 如何表达配置缺失、不兼容、禁止配置项和 secret reference 错误。

---

## 8. 回填草稿

正式 `projects/L0-bus/02-概要设计.md` §11 “配置影响轮廓”应从本文件摘录并整理以下内容：

- §11.1 “配置影响轮廓表”
- §11.2 “禁止配置化边界表”
- §11.3 “只能间接受配置影响的模块”
- §11.4 “配置影响轮廓图”
- §11.5 “交给详细设计展开的配置实现契约”

不在本 Step 重复粘贴正式文档完整正文。Step 14 生成正式文档时，应按本文件摘录并补充校准来源、延伸阅读、正式文档语气和章节衔接。

---

## 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| Step 11 是否写具体 JSON 配置示例 | A：写；B：不写，留给 04-配置说明 | 建议 B | 概要设计只识别配置影响，JSON 示例会下沉到配置说明 |
| domain policy 是否允许直接读取配置 | A：允许；B：不允许，由 runtime / application 构造 policy | 建议 B | 保持 domain model 纯净，避免配置散落 |
| backend capability 变化是否允许通过配置自动重调度 delivery | A：允许；B：不允许，只更新能力视图和审计 | 建议 B | 已确认 capability check 不改 delivery truth |

以上待确认项不阻塞进入 Step 12。除非后续讨论明确改变，否则后续 Step 按“建议方案”继续展开。

---

## 10. 进入下一步条件

- 已明确哪些主要组成部分、入口、adapter、job、worker 或外部接缝受配置影响。
- 已明确哪些模块只能间接受配置影响，不能直接读取配置。
- 已列出禁止配置化边界。
- 已明确哪些配置实现契约交给 03-详细设计展开。
- 已避免写配置项清单、JSON 示例、默认值、环境变量名、RuntimeConfig 字段全集和实现代码。
