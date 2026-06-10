# Step 11. 配置影响轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 11
> 回填章节: `02-概要设计.md` §11 配置影响轮廓
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

在主要组成部分、接口骨架、处理流、状态机和异常边界已收稳的前提下,识别 `L1-governance` 哪些概要层结构会受配置影响,哪些边界禁止配置化,以及哪些配置实现契约应交给 `03-详细设计.md` 继续展开。

本步不定义配置项清单、默认值、JSON 示例、环境变量名、密钥名称、`RuntimeConfig` 字段全集、`ConfigError` 枚举全集、adapter constructor 参数或配置加载实现。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供配置不可越界、协议与产品中立、失败显式约束 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供 Inbound、Application、Domain、Ports、Persistence、Projection、Outbox、Operations 分层 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供 10 个主要组成部分和职责边界 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供 Command、Query、Consumer、Outbound Event、Operations Job 入口分类 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供配置会影响的处理流、publisher、consumer、maintenance、handoff 边界 |
| `02_hld_step_09_state_machine.md` | 已完成 | 提供禁止配置化的状态机红线 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成 | 提供配置不能吞掉的异常和降级 surface |
| `01-架构设计.md` §13 / §14 / §15 | 已完成 | 提供配置与变更控制、演进路线和风险挂起项 |

---

## 3. SOP 问题回答

### 3.1 哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受到配置影响?

会受到配置影响的结构主要集中在运行承载和外围接缝:

- Inbound / Operations 入口:command intake、query intake、event consumer、job runner、handoff / export trigger。
- Ports / adapters:identity、process、work、artifact、method、runtime、conversation、bus、observability、archive、external GRC 接缝。
- Projection / snapshot / reconciliation:rebuild、refresh、reconciliation、dashboard / report / search 只读派生维护。
- Outbox / handoff:publish、retry、dead-letter、trace handoff、archive handoff、external GRC export。
- Query consumption:分页、consistency hint、stale / degraded / unavailable 暴露和 read model 选择。

### 3.2 哪些模块只能间接受配置影响,不能直接读取配置?

Domain Model、Domain Policy 和核心状态机只能通过 application service 注入的已验证输入、snapshot、summary、policy basis 或 command intent 间接受配置影响。它们不得直接读取 runtime config,也不得让配置改变不变量、状态迁移、truth 归属或审计链。

### 3.3 哪些领域规则、状态机、审计链、事务一致性或安全门禁禁止配置化?

禁止配置化的边界包括:

- Governance truth 归属和外部正文排除。
- Gate / Decision 正式性、Decision 不可原地改写、Supersede / Revoke 历史保留。
- Approval responsibility、shared rules、Policy scope / priority / conflict 和低 scope 不得覆盖组织硬约束。
- Control applicability、AIIA / SoA conclusion、Nonconformity verification closure。
- Query no-write、Consumer 不写核心 truth、Job 不修复核心 truth。
- truth、trace、audit、outbox、stored result 同一成立边界。
- Derived / report / dashboard / reconciliation / external GRC export 不反写真相。
- 依赖裁剪和唯一编译期依赖边界。

### 3.4 哪些配置影响需要在详细设计中继续定义配置实现契约?

详细设计需要定义配置读取、校验和注入关系,包括:

- Runtime / adapter / job / consumer / publisher / projection / handoff 的配置 owner。
- Config loader、validator、runtime builder 和 application service 注入边界。
- Config error 如何阻断启动、降级入口或禁用外围 adapter。
- 配置变更如何被审计、如何影响 job schedule / batch / retry / degraded surface。
- 哪些配置只允许在运维层改变,哪些需要 Governance 变更控制或正式裁决。

### 3.5 哪些配置细节属于 `04-配置说明`,不能在概要设计中提前展开?

配置 key、默认值、环境变量、文件格式、密钥名称、部署挂载、产品参数、限流数字、批量大小、retry 间隔、retention 天数、SLO 数字、具体 DB / queue / cache / search / object store / GRC 产品参数都应进入 `04-配置说明`、测试方案、验收标准或实施计划,不得在本概要 Step 固化。

---

## 4. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| `Governance truth core` | 间接受影响 | truth repository adapter、outbox publisher adapter、trace / audit store 承载选择 | 配置只能选择承载和接缝,不得改变 truth 成立、不变量或同一提交边界 |
| `Governance context and input management` | 间接受影响 | source resolver 接缝、pending reference 降级策略、允许的外部 source adapter 启停 | 定义 resolver config 注入和 unavailable / unresolved surface,不得跳过 `Ready` 前置条件 |
| `Gate and decision management` | 禁止直接受配置影响 | 无法用配置改变正式裁决状态机或 outcome 语义 | 只允许配置显化、通知、adapter 或下游传播,不得配置化 approval / reject / waive 语义 |
| `Approval and responsibility management` | 间接受影响 | identity capability adapter、责任队列查询分页、提醒 / 显化接缝 | actor capability 来源可配置,但责任满足和 delegation guard 不可配置化削弱 |
| `Policy and shared rules management` | 严格受控影响 | method policy snapshot adapter、policy consumer / runtime export adapter、冲突检测任务触发 | 配置可影响 adapter 和刷新节奏,不得改变 shared rules 优先级或低 scope 覆盖红线 |
| `Control and compliance conclusion management` | 间接受影响 | artifact / evidence / method control adapter、archive / external GRC export target | 配置可影响证据来源接缝和导出目标,不得保存正文或绕过 evidence / coverage guard |
| `Nonconformity corrective loop` | 间接受影响 | work collaboration adapter、observability alert consumer、notification / handoff | 配置可影响线索来源和提醒,不得让 alert / bug / corrective completion 自动关闭不符合 |
| `Governance consumption and traceability` | 受配置影响 | authorized query read model 选择、trace handoff target、archive / observability adapter 启停 | 定义 query degraded / redaction / handoff config,不得改变可见性和追溯真实性 |
| `Derived maintenance and reconciliation` | 受配置影响 | rebuild scope、refresh schedule、batch shape、reconciliation scope、report retention | 定义 job config、cursor、report surface 和失败 marker,不得允许 job 修复 truth |
| `External context mirror support` | 受配置影响 | external source adapter、snapshot refresh cadence、reference scope、stale threshold | 定义 reference refresh / snapshot config 和 invalid / unavailable surface,不得拥有外部 truth |
| Command intake | 受配置影响 | endpoint enablement、request size / timeout、idempotency store adapter | 定义 intake config validation,不得关闭 actor / metadata / idempotency 必填门禁 |
| Query intake | 受配置影响 | page limits、consistency hint policy、fallback / degraded response strategy | 定义 read config,不得允许 query 写状态或绕过 visibility |
| Inbound Event Consumer | 受配置影响 | subscribed source、schema version allowlist、dedup store、quarantine / delayed handling | 定义 consumer config 和 version validation,不得猜 schema 或写核心 truth |
| Outbound Event / Bus adapter | 受配置影响 | topic / routing / publish adapter / retry class | 定义 publisher config 和 failure surface,不得让 publish failure 回滚 truth |
| Operations Job runner | 受配置影响 | schedule、batch、cursor、retry、parallelism、operator actor | 定义 job config 和 idempotency,不得把 job 变成业务 command |
| Observability / archive / external GRC handoff | 受配置影响 | target adapter、export scope、receipt handling、delivery mode | 定义 handoff config 和 failed marker,不得把外部 receipt 当 Governance truth |

---

## 5. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| Governance truth 归属 | 这是本仓存在理由,不能由部署或开关改变 | 需求 / 架构重新评审 |
| 外部正文排除 | 防止 process、work、artifact、method、runtime、observability、archive 正文污染治理 truth | 需求数据归属和架构数据所有权 |
| `L0-core` 之外的编译期依赖裁剪 | 防止相邻仓源码进入核心语义 | 架构依赖关系和全局裁剪规则 |
| Gate / Decision 只能由 Governance 正式形成 | 防止 process waiting、conversation card、runtime cache、report row 替代裁决 | 需求业务规则和状态机 |
| Decision 不可原地改写 | 保留审计和追溯完整性 | 状态机 / 详细设计对象契约 |
| Approval responsibility 和 delegation guard | 防止配置绕过审批责任和 risk owner | 业务规则 / shared rules / 详细设计 policy |
| Shared rules 高于低 scope policy / config | 保护组织级硬约束 | 需求 / 架构 / policy 详细设计 |
| Policy conflict 必须显式处理 | 防止配置静默选择或忽略冲突 | 详细设计 conflict flow |
| Control applicability / exclusion 必须有依据 | 防止配置绕过控制覆盖和证据 | Control / compliance 详细设计 |
| AIIA / SoA conclusion 不保存正文且必须正式评审 | 正文归 artifact / archive,结论归 Governance | 数据归属 / compliance 详细设计 |
| Nonconformity closure 必须基于 passed verification | 防止 corrective action completed 自动关闭 | 状态机 / nonconformity 详细设计 |
| Query no-write | 防止读取路径刷新、修复或生成事实 | 架构通信方式 / query 详细设计 |
| Consumer 不写核心 truth | 防止外部事件绕过 actor、policy 和 command | event consumer 详细设计 |
| Job 不修复核心 truth | 防止维护路径成为隐式业务写源 | operations / reconciliation 详细设计 |
| truth、trace、audit、outbox、result 同一成立边界 | 防止半成立事实和补造审计 | 一致性 / 持久化详细设计 |
| Projection / report / dashboard / external GRC 不反写 | 防止派生消费成为第二 truth | 派生 / handoff 详细设计 |
| outbox publish failure 不回滚 truth | 防止下游可用性改变已成立治理事实 | outbox / bus 详细设计 |
| visibility / read authorization 门禁 | 防止配置泄露治理事实、依据或审计内容 | 安全 / query 详细设计 |

---

## 6. 配置影响轮廓图

```text
+====================================================================+
|                    Governance Configuration Impact                 |
+====================================================================+
| Runtime configuration                                               |
|   |                                                                 |
|   +--> Inbound / Consumer / Job / Adapter builders                  |
|   |       | validates config and injects allowed dependencies        |
|   |       v                                                         |
|   |   Application services                                          |
|   |       | receive validated ports, limits, schedules, targets      |
|   |       v                                                         |
|   |   Domain model and policies                                     |
|   |       | no direct config read; invariants remain fixed            |
|   |       v                                                         |
|   |   Truth / trace / outbox / projection / handoff stores          |
|   |                                                                 |
|   +--> Operations controls                                          |
|           | rebuild / refresh / publish / handoff cadence           |
|           v                                                         |
|       Derived / reference / publication / report states             |
+====================================================================+
```

关键说明:

- 配置只进入 adapter builder、runtime builder、inbound、consumer、job、projection、handoff 和 external seam,不进入 Domain 直接读取。
- Application service 只能接收已校验配置产生的 ports、limits、schedule、targets 或 policy basis,不能让配置改写 domain invariant。
- 图不表达配置加载实现、JSON 示例、环境变量、密钥系统、部署挂载或具体产品参数。
- Operations 配置只能影响派生、刷新、发布、对账和交接节奏,不能改变核心 truth。

---

## 7. 配置实现契约交给详细设计的方向

| 契约方向 | 详细设计需要回答 | 不在概要设计展开 |
|---|---|---|
| Config ownership | 哪个 runtime / adapter / job owner 读取并校验配置 | 具体文件、key、env var、默认值 |
| Config validation | 启动时阻断、运行时降级、adapter 禁用和 warning 的规则 | 完整 `ConfigError` enum 和错误码 |
| Dependency injection | application service 如何接收 ports、publisher、repositories、job runner 和 handoff adapters | 完整 constructor 签名 |
| Adapter config | external source、bus、observability、archive、external GRC adapter 如何配置 | 产品参数、密钥名、URL、topic |
| Job config | rebuild / refresh / reconcile / publish / handoff 的 batch、cursor、retry、schedule 如何表达 | retry 数字、cron、批量大小 |
| Query config | page limit、fallback、degraded response、projection freshness hint 如何表达 | 具体分页默认值和响应字段 |
| Consumer config | schema version、source allowlist、dedup、quarantine / delayed / dead-letter 如何表达 | topic、payload schema、DLQ 名称 |
| Change control | 高风险配置变更如何审计、是否需要正式 Governance decision 或 operator approval | 具体审批流程和 UI |
| Config evidence | 配置快照如何进入运行报告、验收证据或 trace context | 证据路径、报告格式、hash 算法 |

---

## 8. 配置细节留给 `04-配置说明`

| 配置细节 | 留给后续文档的原因 |
|---|---|
| 配置 key / env var / JSON / TOML / YAML 结构 | 属于配置说明和实现约定 |
| 默认值、上限、下限、单位 | 需要详细设计、测试和容量验证支撑 |
| 具体 DB、queue、cache、search、object store、GRC 产品参数 | 当前概要保持产品中立 |
| retry 间隔、backoff、DLQ、quarantine、retention 天数 | 需要运维和测试方案闭合 |
| 密钥、token、证书、endpoint、network policy | 属于部署、安全和密钥管理 |
| SLO、P95、吞吐、batch size、并发数 | 需要负载模型和验收证据 |
| feature flag 名称和 rollout 策略 | 属于配置说明 / 实施计划 |

---

## 9. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧性能数字、PostgreSQL、Policy engine、external GRC 线索容易变成默认基线 | 会让产品或配置反向塑造核心架构 | 本步保持产品中立,只点名配置影响轮廓 |
| 配置边界未明确 | 后续可能用配置绕过 shared rules、正式裁决、正文排除或派生不反写 | 本步列出禁止配置化边界 |
| Job、Consumer、Projection、Handoff 的配置影响混在流程中 | 详细设计可能自行决定配置 owner 和注入边界 | 本步给出配置实现契约方向 |
| Domain 是否可直接读配置未说明 | 容易把 domain invariant 做成运行开关 | 本步规定 domain / policy 不直接读取配置 |
| 外部接缝启停和 Governance truth 成立关系不清 | 可能让 adapter 不可用改变已成立事实 | 本步明确外围配置和失败不改变核心 truth |

---

## 10. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 配置影响范围 | 隐含在架构横切关注点中 | 明确到主要组成部分、入口、adapter、job、handoff |
| 禁止配置化 | 只有结构性约束 | 独立列出 domain invariant、状态机、审计链、一致性和安全门禁 |
| Domain 与配置关系 | 未直接说明 | Domain / policy 只能间接受已验证输入影响,不直接读配置 |
| 详细设计承接 | 泛化为后续细化 | 明确 RuntimeConfig、ConfigLoader、ConfigValidator、AdapterConfig、JobConfig 等契约方向 |
| 配置说明边界 | 未分开 | key、默认值、JSON、环境变量、产品参数后移 `04-配置说明` |

---

## 11. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否在概要层列完整配置项 | 不列 | 配置项清单属于详细设计和配置说明 |
| 是否允许 Domain 直接读取配置 | 不允许 | 防止运行配置改变不变量和状态机红线 |
| 是否配置化 shared rules / decision / closure 规则 | 不允许 | 这些是 Governance truth 主线和审计红线 |
| 是否配置化 adapter / job / projection / handoff | 允许,但受控 | 这些是运行承载和外围接缝,需要部署和运维弹性 |
| 是否锁定 DB / queue / cache / GRC 产品 | 不锁定 | 概要层保持产品中立,产品选择后续由配置 / 实施 / ADR 闭合 |

---

## 12. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §11 引用本文件 §4 的配置影响轮廓表。
- §11 摘录本文件 §5 的禁止配置化边界表。
- §11 摘录本文件 §6 的配置影响轮廓图和关键说明。
- §11 引用本文件 §7 的详细设计配置实现契约方向。
- §11 明确配置 key、默认值、JSON 示例、环境变量、密钥、产品参数和容量数字进入 `04-配置说明`、测试方案、验收标准或实施计划。

---

## 13. 待确认事项

本步不新增阻塞 Step 12 的待确认事项。详细设计阶段需要继续闭合:

- Runtime / adapter / job / consumer / publisher / projection / handoff 的配置 owner 和注入边界。
- Config validation 失败时是启动阻断、adapter disabled、degraded 还是 delayed。
- 哪些高风险配置变更需要 Governance decision、operator approval 或审计 evidence。
- Job schedule、batch、retry、cursor、retention、dead-letter 和 replay 的正式配置 surface。
- External GRC、archive、observability、bus、search、storage 产品是否进入配置和实施基线。

这些属于 `03-详细设计.md` 和 `04-配置说明.md` 的契约闭口,不阻塞概要设计进入详细设计承接清单 Step。

---

## 14. 进入下一步条件

- 已明确哪些主要组成部分、入口、adapter、job、worker 和外部接缝受配置影响。
- 已明确 Domain Model / Domain Policy / 核心状态机只能间接受配置影响,不能直接读取配置。
- 已显式列出禁止配置化边界。
- 已说明配置实现契约交给 `03-详细设计.md` 继续展开。
- 未写入配置 key、默认值、JSON 示例、环境变量名、密钥、产品参数或实现级配置类型定义。
- 可以进入 Step 12 “详细设计承接清单”。
