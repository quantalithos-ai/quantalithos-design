# L3-capability-hub 03 详细设计 Step 1: 确认概要设计输入边界

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 1
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §1 与上游文档的关系声明;§17 风险与待确认事项
> 创建日期: 2026-07-09
> 当前模式: full-restart
> 状态: completed_wait_user_review
> 本轮口径: 只确认 `03-详细设计.md` 的上游输入、旧材料隔离、回答边界和进入 Step 2 的门禁;不修改正式 `03-详细设计.md`,不生成 implementation ledger / boundary skeleton,不写实现代码、测试结果、run_id、evidence alias 或验收签署。

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 1 `确认概要设计输入边界` |
| 用户确认 | 用户已回复“同意”,允许从 `02-概要设计.md` Step 14 停审点进入 `03` Step 1 |
| 正式文档写入 | 本 Step 不修改正式 `03-详细设计.md`;正式装配留到 Step 19 |
| 上游基线 | 新版 `00-需求文档.md`;新版 `01-架构设计.md`;新版 `02-概要设计.md`;`02_hld_step_12_detailed_design_handoff.md` |
| 旧材料处理 | 旧 `03-详细设计.md`、README、旧 `05/06` 和旧实现口径只作 historical material / pollution audit |

---

## 1. 必读文档

### 1.1 已读取标准

| 文档 | 读取目的 | 本 Step 使用结论 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` | 确认 `03` Step 1~19 顺序、Step 6+ 小循环、正式文档后置、三层恢复门禁。 | Step 1 只确认上游输入边界;正式 `03` 不能跳步写入。 |
| `standards/document/详细设计书写规范.md` | 确认正式 `03` 18 章结构和模块实现契约主轴。 | Step 1 回填草稿只对应 §1 和 §17,不提前写 §2 以后。 |
| `standards/document/设计文档讨论中间产物规范.md` | 确认 Step 中间产物结构、旧材料后置差异审计、先思考后写入和停审规则。 | 本文件必须包含 SOP 问题回答、诊断、对比、取舍、结构化产物、回填草稿和进入下一步条件。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 确认后续字段、DTO、port、state、projection、config、evidence schema 闭环红线。 | Step 1 只列入后续执行约束,不在本步补造 schema。 |
| `standards/document/设计文档编写通则.md` | 确认正式文档写作原则、图表和引用边界。 | 本步保留可追溯、少口号、少重复的讨论产物结构。 |

### 1.2 已读取上游输入

| 文档 | 读取目的 | 当前判断 |
|---|---|---|
| `projects/L3-capability-hub/00-需求文档.md` | 复核仓定位、目标 / 非目标、使用方、依赖、功能需求、业务规则、数据归属、接口依赖、NFR、验收红线。 | 已完成 full-restart,可作为需求基线;`03` 不重答需求。 |
| `projects/L3-capability-hub/01-架构设计.md` | 复核职责边界、系统上下文、限界上下文、依赖方向、数据所有权、一致性、交互方式、技术机制和风险。 | 已完成 full-restart,可作为架构基线;`03` 不重画架构。 |
| `projects/L3-capability-hub/02-概要设计.md` | 读取 `03` 直接输入:代码主体、8 个组成部分、43 个对象、接口、flow、状态、异常、配置影响和 handoff。 | 已完成 full-restart,是 `03` 第一设计输入。 |
| `projects/L3-capability-hub/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 读取详细设计承接清单、回退规则和旧材料隔离。 | `03` 的对象、接口、flow、state、异常、配置和测试承接方向已明确。 |
| `projects/L3-capability-hub/design-calibration/02_hld_step_13_risks_open_questions.md` | 读取概要层风险和待确认事项。 | 后续 Step 18 需要承接;不阻塞 Step 2。 |
| `projects/L3-capability-hub/design-calibration/02_hld_step_14_formal_document_assembly.md` | 确认正式 `02` 已按 Step 1~14 装配。 | `02` 可作为 `03` 输入;旧 `02/03` 不再是正式基线。 |

### 1.3 已读取参考和历史材料

| 文档 | 使用目的 | 使用边界 |
|---|---|---|
| `projects/L1-governance/design-calibration/03_ddd_calibration_flow.md` | 参考 03 flow 的权威输入、Step 状态表、执行纪律和旧材料隔离。 | 只参考结构,不复制 governance 主语。 |
| `projects/L1-governance/design-calibration/03_ddd_step_01_upstream_boundary.md` | 参考 Step 1 的问题回答、旧版诊断、结构化产物、回填草稿和进入下一步条件。 | 只参考粒度,不复制 governance 内容。 |
| `projects/L3-method-library/design-calibration/03_ddd_step_01_input_boundary.md` | 参考 full-restart 下 Step 1 的输入基线、历史材料处理和模块化写入深度。 | 只参考过程密度,不复制 method-library 主语。 |
| `projects/L3-capability-hub/03-详细设计.md` | 旧版详细设计问题诊断。 | historical material,不得作为新版 `03` truth source。 |

---

## 2. SOP 问题回答

### 2.1 当前详细设计直接承接概要设计中的哪些结论?

直接承接新版 `02-概要设计.md` 的以下结论:

- 代码主体框架: capability access truth owner 独立,由 capability identity、registry、adapter descriptor、governance seam、method relation、formal exposure / consumer view、trace / impact、derived material 和 external reference support 组成。
- 8 个主要组成部分:能力身份与接入语境、注册目录与生命周期、接入描述与风险摘要、治理与方法关系、正式暴露与受控消费、追溯 / 变化与影响、派生维护与只读输出、外部引用与安全摘要支撑。
- 43 个关键对象:覆盖 identity、registry、descriptor、governance seam、method body-free relation、formal exposure、controlled consumer view、trace / impact、derived material、reference resolution 和外部 ref。
- 六类接口骨架:Command API、Query API、Inbound Event Consumer、Outbound Event、Operations Job、External Port Skeleton。
- 关键处理流:通用 Command 写路径、Query 读路径、Inbound Event Consumer 路径、Operations Job 路径、Outbound Event Candidate 路径,以及 P0 Command、复杂 Query、body-free Consumer、Job、event collaboration 重点流。
- 多状态族:identity / review、registry lifecycle、descriptor / risk / secret safe summary、governance seam、method relation、formal exposure / visibility、consumer view freshness、trace / impact、derived material、reference resolution、event collaboration。
- 异常边界:Command invalid / forbidden / unresolved、Query degraded no-write、Consumer duplicate / unsupported / forbidden body、Job failed no truth repair、event collaboration failure no rollback。
- 配置影响轮廓:entry、consumer、job、adapter、publisher、handoff 和 external port 可受配置影响;domain object、policy、核心状态机、truth owner 和 forbidden body 边界不能配置化。
- 详细设计承接清单:对象、协议、函数级 flow、状态矩阵、持久化事务、错误恢复、幂等、配置绑定、审计埋点、测试切口和 `07` 承接输入。

`00-需求文档.md` 和 `01-架构设计.md` 只作为需求边界、依赖方向、数据归属、通信方式和技术机制边界的上游约束,不在详细设计中重新定义。

### 2.2 概要设计中的代码主体框架是否已经足够稳定?

足够进入详细设计。新版 `02` 已经把业务主要组成部分和实现分层分开:

- 业务主语由 capability access truth、relation truth、safe summary、controlled consumer view、derived material、reference state 和 event collaboration / handoff 分层表达。
- 实现分层为 Inbound / Operations、Application Services、Domain Model and Policies、Ports、Persistence、Projection / Material、Collaboration / External Adapters。
- 旧 `ProviderContract`、`CapabilityDecision`、`CostRecord`、KMS / Vault、`QueryCapabilities`、policy refresh、execution gateway、provider route / quota / cost / failover 没有进入新版代码主体。

详细设计可以继续将这些主体落到 crate / package / module / file、service、domain object、repository、projection、port、adapter、job runner 和 test cut,但不得改变业务 owner 或重启概要设计主线。

### 2.3 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开?

足够进入 Step 2。当前已经具备详细设计继续展开的最小闭环:

- 对象层:Step 6 已固定 43 个关键对象和所属组成部分,并说明哪些名称不进入关键对象。
- 接口层:Step 7 已按 Command / Query / Consumer / Outbound Event / Job / Port 分类,并给出读写性质和主要输入输出骨架。
- Flow 层:Step 8 已定义通用路径和重点独立处理流,并明确 Query no-write、Consumer no direct core truth write、Job no core truth repair、event collaboration failure no rollback。
- State 层:Step 9 已定义多状态族、可进入正常主线的状态、状态传播和禁止迁移口径。
- Exception / Config 层:Step 10 / 11 已收稳异常落点和配置影响边界,为后续错误模型、恢复、配置绑定和测试提供输入。

这些内容仍是概要粒度,因此 Step 4~17 必须继续补完整文件布局、对象字段、函数签名、trait / port、DTO schema、状态矩阵、事务一致性和测试切口。

### 2.4 哪些内容仍停留在概要设计轮廓,进入详细设计后必须补清?

后续 `03` 必须补清:

- workspace / crate / package / module / file layout,以及每个文件的 owner、输入、输出和测试归属。
- 每个 aggregate / entity / value object / enum / typed ref / policy / change record / projection / report 的字段、函数、状态、不变量和 Rustdoc 风格中文注释。
- 每个 Command / Query / Consumer / Outbound Event / Job / Port 的 request / response、envelope、result、receipt、error surface、actor context、trace context、idempotency、expected version、visibility 和 freshness schema。
- application service 函数级处理流、repository / projection / port trait、unit-of-work、transaction boundary、save order、stored result、change record、trace link、event candidate 和 fallback surface。
- 状态机转换矩阵、非法转换、guard、expected version、并发冲突、重复 replay、migration / serialization 和状态传播规则。
- persistence / projection / material / handoff 的 store / repository / index / consistency / rebuild source / no-write / no-repair contract。
- error taxonomy、error-to-response mapping、retry / delayed / quarantine / dead-letter、recovery cut 和 negative tests。
- runtime builder、config owner、ConfigValidator、AdapterConfig、JobConfig、Query / ReadConfig、Consumer / EventConfig、Publisher / HandoffConfig 的实现契约。
- observability / audit 埋点、trace / audit handoff、evidence schema 输入、测试切口和 `07` implementation boundary 承接清单。

### 2.5 哪些需求或架构结论会影响详细设计,但不能在详细设计中重新定义?

以下结论只能承接,不得在 `03` 中改写:

- Capability Hub 是能力注册 / 外部 MCP / A2A / API 集成中心,只拥有 capability access truth。
- 本仓不拥有 runtime execution、tools execution、governance approval / Policy truth / shared_rules truth、method body / method lifecycle、SDK client / package / cache、marketplace listing / transaction、secret / KMS 平台、cost / billing ledger、provider runtime、observability / audit store 正文。
- `L0-core` 是唯一允许的 sibling 编译期依赖;其他 sibling 通过 ref、snapshot、summary、event、port、handoff 或 controlled view 协作。
- truth / snapshot / ref / relation / derived view 必须分层;派生材料不得成为第二 truth。
- governance seam 不得变成 governance truth;method relation 必须 body-free;secret 只能保存 ref / safe summary。
- formal exposure 是服务端 truth;controlled consumer view 是 projection / snapshot;SDK exposure 只到服务端边界,不实现 SDK client。
- Query no-write、Consumer no direct core truth write、Job no core truth repair、event collaboration failure no truth rollback。
- 配置不得改变 truth ownership、formal boundary、sync / async / background 分层、ref / safe summary / body-free relation、forbidden body 和派生不反写。

---

## 3. 旧版 `03-详细设计.md` 问题诊断

| 位置 / 旧内容 | 当前问题 | 影响 | 本轮处理 |
|---|---|---|---|
| 文档元信息 | 关联旧 `02-概要设计.md v0.1.0`,作者 / 日期 / 结构均为旧版。 | 与新版 `02` Step 1~14 不一致,不能作为当前 `03` 基线。 | 降级为 historical material。 |
| §1 模块职责描述 | 写成持有 MCP Registry / A2A Directory / `ProviderContract` / `CapabilityDecision` / `CostRecord` / secret reference / audit event 真相。 | 把 provider contract、access decision、cost、secret、audit store 和 capability access truth 混为一体。 | 不继承;改由 identity / registry / descriptor / seam / relation / exposure / trace / derived / ref 分层。 |
| §2 内容采集提示 | 把 `QueryCapabilities`、policy refresh、KMS / Vault、provider key、CostRecord、deny event 写成 `03` 主线。 | 与新版概要边界冲突,会把 runtime enforcement、governance policy、secret platform、billing 和 audit body 拉回本仓。 | 仅作污染样本。 |
| §3 目录树 | 使用 `registry_service.rs`、`provider_service.rs`、`access_service.rs`、`accounting_service.rs`、`metadata_service.rs` 和 `contract / decision / accounting` domain 分层。 | 建立在旧 ProviderContract / CapabilityDecision / CostRecord 主线上。 | 后续 Step 4 重新定义文件布局。 |
| 旧核心对象 | `MCPServer`、`A2ANode`、`ProviderContract`、`ProviderQuota`、`SecretEnvelopeRef`、`ProviderRouteRule`、`CapabilityDecision`、`SharedRuleSnapshot`、`AllowDenyEntry`、`CostRecord`、`DeniedInvocationAudit`。 | 多数对象越过新版边界或命名不再符合 capability access truth 分层。 | 只在后续差异审计中判定是否有 ref / safe summary 线索可重建,不得原名继承。 |
| 旧流程 | registry / contract register -> active、governance policy update -> QueryCapabilities refresh、external capability used / denied -> cost / audit append。 | 把注册、provider 合同、治理策略、runtime 调用、cost / audit 作为统一执行链。 | 不继承;后续按新版 Command / Query / Consumer / Job / Event candidate 展开。 |
| 旧异常 | 未白名单仍被查询、匿名 A2A、明文 key、policy 30s refresh、CostRecord 未落库、runtime 绕过 hub。 | 仍围绕 allowlist、policy refresh、secret platform、cost ledger 和 execution audit。 | 只作 historical_material;新版异常以后续 Step 12 重新收口。 |
| 旧测试输入 | deny-by-default、secret envelope encryption、policy refresh、cost audit 主链。 | 与当前测试红线不一致,且含 secret / policy / cost 越界项。 | 不作为当前测试基线。 |

---

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| `03` 启动方式 | 可能直接修补旧正式 `03`。 | 先创建 `03_ddd_calibration_flow.md` 和 Step 1 中间产物,正式 `03` 留到 Step 19。 | 符合详细设计 SOP 和中间产物规范。 |
| 权威输入 | 旧 `03` + 旧 `02` + README 线索。 | 新版 `00/01/02` + `02_hld_step_12~14` 解释性输入。 | 保持需求、架构、概要、详细的真相源顺序。 |
| 旧 `03` 地位 | 可能作为可继承草稿。 | historical material / pollution audit。 | 旧主线与新版边界冲突。 |
| 核心主语 | Provider contract、decision、cost、KMS、QueryCapabilities、policy refresh。 | capability identity、registry、adapter descriptor、governance seam、method relation、formal exposure、consumer view、trace / impact、derived material、external reference support。 | 对齐新版概要设计和用户重点边界。 |
| 正式文档写入 | Step 1 后立即改正式 `03`。 | Step 19 才装配正式 `03`。 | 正式章节必须追溯到具体 `03_ddd_step_*`。 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 在旧 `03` 上局部修补 | 文件改动小。 | 旧对象、旧 flow、旧章节结构和旧越界职责残留风险高。 | 不采用。 |
| B. 直接重写正式 `03` | 能快速产出完整正文。 | 跳过 Step 1~18 中间产物,缺少校准来源和停审记录。 | 不采用。 |
| C. 按详细设计 SOP 先生成 flow 与逐 Step 中间产物,最后由 Step 19 装配正式 `03` | 可追溯、可停审、可在 Step 5 以后达到可落码粒度。 | 文档推进较慢。 | 采用。 |

---

## 6. 结构化中间产物

### 6.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | Capability Hub 仓定位、目标 / 非目标、角色、功能需求、业务规则、数据归属、接口依赖、NFR、验收红线。 | 对象不变量、协议校验、权限 / visibility、错误分支、测试切口和不可越界红线。 |
| `01-架构设计.md` | 独立 capability access truth、系统边界、子域、依赖方向、数据所有权、一致性、交互方式、机制级约束和风险。 | crate / module 依赖、port / adapter、event / handoff、repository / projection、transaction、配置绑定和 no-write / no-repair 实现规则。 |
| `02-概要设计.md` | 代码主体框架、8 个组成部分、43 个对象、接口骨架、处理流、状态、异常、配置影响、详细设计承接清单。 | 文件布局、模块契约、对象契约、trait / port / adapter、DTO schema、函数级 flow、状态矩阵、持久化事务、错误恢复、并发幂等、配置绑定、审计埋点、测试切口。 |
| `design-calibration/02_hld_step_12_detailed_design_handoff.md` | `03` 应承接的稳定输入、继续展开方向、概要回退规则和旧材料隔离。 | 作为 Step 2~18 的范围边界和回退依据。 |
| `design-calibration/02_hld_step_13_risks_open_questions.md` | 概要层风险和待确认事项。 | 后续 Step 18 继续收敛,不在 Step 1 伪装成已闭口。 |
| `design-calibration/02_hld_step_14_formal_document_assembly.md` | 正式 `02` 装配来源、术语统一、旧材料排除。 | 作为 `03` 读取正式 `02` 的校准入口。 |
| 旧 `03-详细设计.md` | 旧主线、旧对象、旧流程和旧章节结构的问题样本。 | 仅用于污染审计;不得作为新版契约来源。 |

### 6.2 本文不再回答

本文不再回答:

- Capability Hub 是否应该独立拥有 capability access truth。
- runtime execution、tools execution、provider runtime、LLM routing、quota、failover、cost、billing、observability / audit store 是否属于本仓。
- governance approval、Policy truth、shared_rules truth 是否属于本仓。
- method body、method lifecycle、method definition source truth 是否属于本仓。
- SDK client、SDK package、client cache、marketplace listing / transaction / pricing / fulfillment 是否属于本仓。
- secret / KMS / Vault 平台和 secret 正文是否属于本仓。
- capability identity、registry、adapter descriptor、governance seam relation、method body-free relation、formal exposure、controlled consumer view、trace / impact、derived material 和 reference support 为什么要分层。
- Query、Consumer、Job、projection、derived material、handoff 和 event collaboration 是否可以反写真相。
- 是否允许非 `L0-core` sibling 编译期依赖。
- 配置是否可以改变 truth owner、formal boundary、forbidden body、状态红线或派生不反写。

### 6.3 本文必须回答

正式 `03-详细设计.md` 必须回答:

- 当前仓的 Rust workspace / crate / package / module / file layout。
- 每个模块的职责、文件、对象、service、policy、repository、projection、port、adapter、job、error 和 test cut。
- 每个 struct / enum / value object / typed ref / policy / report / projection 的字段、函数、状态、不变量和 Rustdoc 风格中文注释。
- 每个 Command / Query / Consumer / Outbound Event / Operations Job / External Port 的 DTO schema、result / receipt、metadata、actor / trace context、idempotency、expected version、visibility、freshness 和 error surface。
- 每个接口的函数级调用链、transaction / UoW、repository / port 调用、stored result、change record、trace / audit、event candidate、projection refresh 和 fallback surface。
- 每个状态族的正式 enum、初始态、终态、允许 / 禁止迁移矩阵、状态传播、expected version、并发冲突、重复 replay、serialization / migration。
- 持久化、索引、事务、一致性、projection rebuild source、reference snapshot refresh、handoff / event collaboration state 和 no-write / no-repair guard。
- 错误模型、异常分支、恢复口径、retry / delayed / quarantine / dead-letter、negative tests。
- 并发、幂等、request digest、stored result、duplicate / conflict 行为。
- 配置引用与外部依赖绑定、runtime builder、ConfigValidator、adapter / job / read / event / publisher / handoff config owner。
- 可观测性、审计埋点、traceability、audit handoff 和 evidence schema 输入。
- 测试切口、最小验证清单和详细设计到 `07-实施计划.md` 的承接清单。

### 6.4 输入不足风险

| 风险 | 是否阻塞 Step 2 | 处理口径 |
|---|---|---|
| 旧 `03` 与新版 `02` 大范围冲突。 | 不阻塞。 | 旧 `03` 只作为 historical material;后续 Step 4~17 逐步重建。 |
| `04-配置设计.md` 尚未按新版 capability-hub 主线重建。 | 不阻塞 Step 2;影响 Step 14。 | Step 14 只定义详细设计需要读取的配置引用和绑定点;正式配置手册后续单独写。 |
| `05-测试方案.md` / `06-验收标准.md` 仍是旧口径。 | 不阻塞 Step 2;影响 Step 16~18 和后续 `05/06`。 | Step 16 先按新版详细设计生成测试切口;后续 `05/06` full-restart 时承接。 |
| 相邻仓具体 contract 字段可能尚未全部稳定。 | 不阻塞 Step 2;影响 Step 6~8 / Step 14。 | 到对象、port、protocol Step 时逐项对齐;不能自行发明 governance truth、method body、SDK client 或 runtime execution 字段。 |
| 具体 DB、cache、message bus、search、audit / observability、secret 平台、API gateway 产品未确定。 | 不阻塞 Step 2;影响 Step 3 / Step 11 / Step 14 / Step 15。 | 详细设计先定义抽象 trait、repository、port、config owner 和 failure surface;产品选型后移 ADR / `04` / `07`。 |
| `implementation ledger` 和 planned boundary skeleton 尚未创建。 | 不阻塞 `03`;属于 `07` 完成门禁。 | 不得提前创建;在 `07-实施计划.md` 完成时同步创建。 |

### 6.5 详细设计回退规则

| 详细设计发现的问题 | 回退位置 | 说明 |
|---|---|---|
| 需要改变代码主体框架、实现分层、业务主线或运行承载分层。 | `02` Step 4 | 代码主体框架必须先在概要层重审。 |
| 需要新增、删除、合并或重命名主要组成部分。 | `02` Step 5 | 主要组成部分是对象、接口、flow、状态的来源轴。 |
| 需要新增关键对象、删除对象、改变对象 owner 或恢复旧对象名。 | `02` Step 6 | 对象主语必须先进入关键对象轮廓。 |
| 需要新增 Command / Query / Consumer / Event / Job / Port 或改变读写性质。 | `02` Step 7 | 接口分类和读写边界必须先收稳。 |
| 需要改变处理流族、处理顺序、事务成立口径或 Query / Consumer / Job 红线。 | `02` Step 8 | 处理流变更会影响状态、异常和详细事务。 |
| 需要新增状态族、合并为单一状态机、改变允许 / 禁止迁移或状态传播。 | `02` Step 9 | 状态主线不能在详细设计暗改。 |
| 需要改变异常边界、forbidden body、degraded surface、event failure no-rollback 口径。 | `02` Step 10 | 异常边界关系到测试和验收否决线。 |
| 需要改变配置影响、禁止配置化边界或让配置绕过 domain invariant。 | `02` Step 11 | 配置不能改变 truth owner 和状态红线。 |
| 需要改变 capability access truth owner、数据归属、依赖裁剪、非目标或上游依赖边界。 | `00` / `01` / `02` Step 1~3 | 已超出详细设计局部修正范围。 |

---

## 7. 回填草稿

> 注意: 本节只是 Step 19 装配正式 `03-详细设计.md` 时的回填草稿,当前不直接修改正式文档。

```md
## 1. 与上游文档的关系声明

> 校准来源:
> - `design-calibration/03_ddd_step_01_upstream_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“旧版 `03-详细设计.md` 问题诊断”“回填草稿”和“输入不足风险”小节,了解详细设计如何从新版需求、架构和概要设计承接,以及旧 `03` 为什么只能作为 historical material。

`03-详细设计.md` 直接承接新版 `00-需求文档.md`、`01-架构设计.md` 和 `02-概要设计.md`。本文继续把概要设计中已经收稳的 capability access truth 代码主体框架、8 个主要组成部分、43 个关键对象、接口骨架、处理流、状态集合、异常边界和配置影响轮廓展开为可以 1:1 实现的代码契约。

现有旧版 `03-详细设计.md` 只作为问题诊断输入,不得作为新版详细设计真相源。旧文档中仍适用的事实必须通过新版 `00/01/02` 或本轮 `03_ddd_step_*` 中间产物重新进入正式文档。

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | 仓定位、功能需求、业务规则、数据归属、接口依赖、NFR、验收红线 | 对象不变量、协议校验、权限 / visibility、错误分支和测试切口 |
| `01-架构设计.md` | 独立 capability access truth、职责边界、依赖方向、数据所有权、一致性和通信方式 | crate / module 依赖、port / adapter、event / handoff、transaction、projection 和 no-write / no-repair 规则 |
| `02-概要设计.md` | 代码主体框架、8 个组成部分、43 个对象、接口骨架、处理流、状态、异常、配置影响、详细设计承接清单 | 文件布局、模块契约、对象契约、trait / adapter 契约、DTO schema、函数级 flow、状态矩阵、持久化事务、错误恢复、幂等、配置绑定、审计埋点和测试切口 |

本文不再回答 capability-hub 是否拥有 runtime execution、tools execution、governance approval、Policy truth、shared_rules truth、method body、SDK client、marketplace listing、secret / KMS 平台、cost ledger、provider runtime 或 observability / audit store 正文;也不再重答 capability identity、registry、adapter descriptor、governance seam、method body-free relation、formal exposure、controlled consumer view、trace / impact、derived material 和 external reference support 为什么要分层。

本文必须回答实现单元与文件布局、模块实现契约、对象契约、trait / port / adapter 契约、协议契约、函数级处理流、状态转换矩阵、持久化事务、一致性、错误恢复、并发幂等、配置绑定、审计埋点、测试切口和实施承接清单。
```

```md
## 17. 风险与待确认事项

> 校准来源:
> - `design-calibration/03_ddd_step_01_upstream_boundary.md`
> - `design-calibration/03_ddd_step_18_risks_open_questions.md`

Step 1 已识别的输入风险包括:旧 `03` 与新版 `02` 大范围冲突、`04/05/06` 尚未按新版主线同步、相邻仓具体 contract 字段可能影响对象 / port / protocol 细节、具体基础设施产品选型尚未确定,以及 implementation ledger / planned boundary skeleton 仅能在 `07` 完成时创建。这些事项不阻塞 Step 2,但必须在后续对应 Step 中显式收敛或保守挂起。
```

---

## 8. 待确认事项

| 待确认事项 | 是否阻塞 Step 2 | 后续落点 |
|---|---|---|
| `03` 是否继续采用单 crate 模块分层,还是 workspace 多 crate。 | 不阻塞 Step 2。 | Step 3 / Step 4。 |
| Rust runtime、框架、storage、message、search、config、observability 抽象是否已有仓级规范或本地代码约束。 | 不阻塞 Step 2。 | Step 3 / Step 4 / Step 11 / Step 14 / Step 15。 |
| `L0-core` 具体 typed ref、metadata、idempotency、error base 类型是否可直接复用。 | 不阻塞 Step 2。 | Step 3 / Step 6 / Step 8 / Step 13。 |
| Governance result ref、method asset ref、SDK exposure consumer ref、runtime/tools consumer ref、observability audit ref 的最小字段是否已有上游契约。 | 不阻塞 Step 2。 | Step 6 / Step 7 / Step 8 / Step 14。 |
| `04/05/06` 旧口径需要在后续文档 full-restart 中同步。 | 不阻塞 Step 2。 | Step 14 / Step 16 / Step 18,以及后续 `04~06`。 |

---

## 9. 自检与停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否已确认 `03` 直接承接新版 `00/01/02` | pass | 已在权威输入和 SOP 问题回答中固定。 |
| 是否已明确旧 `03` 只作为 historical material | pass | 已完成旧版问题诊断和禁入主线说明。 |
| 是否列出本文不再回答 / 必须回答 | pass | 已在结构化中间产物 §6.2 / §6.3 收敛。 |
| 是否识别输入不足风险且判断不阻塞 Step 2 | pass | 已在 §6.4 和 §8 列出。 |
| 是否修改正式 `03-详细设计.md` | no | 本 Step 未修改正式 `03`。 |
| 是否提前写文件布局、对象字段、DTO schema、trait、DDL 或配置 key | no | 仅列后续必须回答内容和回填草稿。 |
| 是否伪造实现 commit、run_id、测试结果、evidence alias 或验收签署 | no | 未生成此类内容。 |
| 是否创建 implementation ledger 或 boundary skeleton | no | 这些只允许在 `07` 完成时创建。 |

---

## 10. 进入下一步条件

- 已明确详细设计直接承接新版 `00/01/02`。
- 已明确正式 `02` 是 `03` 的第一设计输入。
- 已明确旧 `03`、README、旧 `05/06` 和旧 provider / decision / cost / KMS / QueryCapabilities / policy refresh / execution gateway 口径只作 historical material。
- 已列出本文不再回答和必须回答的内容。
- 已识别输入不足风险,且无阻塞 Step 2 的上游 blocker。
- 已更新 `03_ddd_calibration_flow.md` 和 `project_execution_ledger.md` 到 Step 1 停审点。

用户审查确认后才允许进入 Step 2 `明确本轮实现范围和非范围`。

当前 next_allowed_action:

```text
wait_user_review_to_03_step_02
```
