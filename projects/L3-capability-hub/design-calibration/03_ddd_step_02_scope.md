# L3-capability-hub 03 详细设计 Step 2: 明确本轮实现范围和非范围

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 2
> 回填章节: `projects/L3-capability-hub/03-详细设计.md` §2 本次详细设计目标与范围
> 创建日期: 2026-07-09
> 当前模式: full-restart
> 状态: completed_wait_user_review
> 本轮口径: 只定义本轮 `03-详细设计.md` 应覆盖的实现契约范围、非范围、后续 Step 分派和实现者可获得的设计输入;不修改正式 `03-详细设计.md`,不写代码、目录树、字段全集、DTO schema、trait 签名、配置 key、测试结果、run_id、evidence alias、验收签署、implementation ledger 或 planned boundary skeleton。

---

## 0. Step 开工确认

| 项目 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 2 `明确本轮实现范围和非范围` |
| 用户确认 | 用户已回复“同意”,允许从 Step 1 进入 Step 2 |
| 正式文档写入 | 本 Step 不修改正式 `03-详细设计.md`;正式装配留到 Step 19 |
| 上游基线 | `03_ddd_step_01_upstream_boundary.md`;新版 `00-需求文档.md`;新版 `01-架构设计.md`;新版 `02-概要设计.md`;`02_hld_step_12_detailed_design_handoff.md`;`02_hld_step_13_risks_open_questions.md` |
| 旧材料处理 | 旧 `03-详细设计.md` 和旧 provider / decision / cost / KMS / QueryCapabilities / policy refresh / execution gateway 口径只作 historical material / pollution audit |

---

## 1. 本步输入

| 输入 | 当前状态 | 本 Step 用途 |
|---|---|---|
| `design-calibration/03_ddd_step_01_upstream_boundary.md` | completed | 提供 `03` 的上游输入边界、旧 `03` 禁入主线、本文不再回答 / 必须回答和输入不足风险。 |
| `projects/L3-capability-hub/00-需求文档.md` | active formal baseline | 提供仓定位、目标 / 非目标、业务规则、数据归属、接口依赖和验收红线;本步不重写需求。 |
| `projects/L3-capability-hub/01-架构设计.md` | active formal baseline | 提供 capability access truth owner、职责边界、依赖方向、数据所有权、一致性和交互分层;本步不重写架构。 |
| `projects/L3-capability-hub/02-概要设计.md` | active formal baseline | 提供本轮范围直接来源:代码主体框架、8 个主要组成部分、43 个关键对象、接口骨架、处理流、状态、异常、配置影响和详细设计承接清单。 |
| `design-calibration/02_hld_step_12_detailed_design_handoff.md` | completed | 提供 `03` 必须继续展开的对象、接口、flow、状态、异常、持久化、配置和测试方向,以及概要回退规则。 |
| `design-calibration/02_hld_step_13_risks_open_questions.md` | completed | 提供本轮范围中需要保持为风险 / 待确认 / 后续文档归属的事项。 |
| `projects/L1-governance/design-calibration/03_ddd_step_02_scope.md` | framework_reference | 参考 Step 2 的问题回答、范围表、非范围表、实现者代码范围和门禁深度;不复制 governance 主语。 |
| `projects/L1-artifact/design-calibration/03_ddd_step_02_scope.md` | framework_reference | 参考 Step 2 的单文件粒度、下游文档分工和可落码范围表达;不复制 artifact 主语。 |

---

## 2. SOP 问题回答

### 2.1 本轮详细设计必须覆盖哪些模块?

本轮 `03-详细设计.md` 必须覆盖 Capability Hub 的核心可落码闭环和必要接缝。模块主轴直接承接新版 `02-概要设计.md` 的 8 个业务主要组成部分,并在后续 Step 4~5 落到实现单元、module、file、service、domain、repository、projection、port、adapter、job 和 test cut。

必须覆盖的业务模块范围包括:

- 能力身份与接入语境:建立 capability identity、external source ref、access review fact 和 identity change 语义。
- 注册目录与生命周期:维护 registry entry、lifecycle、visibility basis、registry change record 和 reconciliation report 关系。
- 接入描述与风险摘要:维护 adapter descriptor、risk / constraint summary、secret ref、secret safe summary 和 descriptor boundary policy。
- 治理与方法关系:维护 governance seam relation、governance result / policy result ref、capability-method body-free relation、method asset ref 和 relation boundary policy。
- 正式暴露与受控消费:维护 formal exposure boundary、formal visibility / applicability、controlled consumer view 和 freshness policy。
- 追溯、变化与影响:维护 access traceability、change impact fact、downstream impact summary、handoff marker 和 trace / audit seam。
- 派生维护与只读输出:维护 consumer view refresh、directory search / browse projection、audit friendly export summary、read-only ecosystem discovery summary 和 reconciliation report。
- 外部引用与安全摘要支撑:维护 reference resolution state、reference resolution policy、external document ref、runtime / tools consumer ref、SDK exposure consumer ref、observability audit ref 和 event collaboration port。

实现分层范围必须覆盖 Inbound / Operations、Application Services、Domain Model and Policies、Ports、Persistence、Projection / Material、Collaboration / External Adapters,但 Step 2 只定义覆盖范围,不提前写文件布局或 trait 签名。

### 2.2 本轮必须定义哪些对象、接口、事件、job 和状态机?

本轮必须把概要设计已经点名的正式主语继续展开为 1:1 可落码契约:

- 43 个关键对象:包括 `CapabilityIdentity`、`CapabilityRegistryEntry`、`AdapterDescriptor`、`GovernanceSeamRelation`、`CapabilityMethodBodyFreeRelation`、`FormalExposureBoundary`、`ControlledConsumerView`、`CapabilityAccessTraceabilityRecord`、`CapabilityChangeImpactFact`、`ReferenceResolutionState` 等对象及其配套 policy、change record、projection、safe summary 和 typed ref。
- Command API:包括建立 / 更正 / 退役 identity、注册 registry、建立 / 替换 descriptor、记录 risk / secret safe summary、挂接 governance seam、挂接 method relation、建立 / 更新 / suspend / retire formal exposure、记录 impact / trace / reference state 等写入口。
- Query API:包括 identity、registry、descriptor、risk / secret safe summary、governance seam、method relation、formal exposure、consumer view、directory search / browse、trace / impact、audit handoff、reference resolution 和 consumer ref 读取面。
- Inbound Event Consumer:包括 governance result ref changed、method asset ref changed、downstream consumption impact reported、external source ref changed、audit material ref changed、external document ref changed 等 body-free 接收面。
- Outbound Event:包括 identity / registry / descriptor / seam / method relation / exposure / consumer view / impact / derived material / reference resolution changed 等 event candidate。
- Operations Job:包括 registry reconciliation、controlled consumer view refresh、directory projection rebuild、audit export preparation、ecosystem discovery rebuild、derived material reconciliation、external reference refresh、event collaboration repair。
- External Port Skeleton:包括 external capability source、governance result、method asset、capability consumer、observability audit handoff、capability access event collaboration 等 port contract。
- 多状态族:identity / review、registry lifecycle、descriptor / risk / secret、governance seam、method relation、formal exposure / visibility、consumer view freshness、trace / impact、derived material、reference resolution、event collaboration。

上述主语必须在 Step 6~16 逐步闭合字段、函数、DTO、trait、flow、state matrix、持久化、错误、幂等、配置和测试切口。Step 2 不得新增主语;如发现必须新增、删除、合并或改 owner,按 Step 1 的回退规则返回 `02` 对应 Step。

### 2.3 哪些能力属于后续阶段或外围增强,不应在本轮展开为核心实现契约?

本轮只覆盖核心可落码闭环和必要接缝,不把外围增强升格为核心前置。以下内容只允许保留为边界、只读候选、port / handoff surface、风险或后续文档入口:

- marketplace listing、transaction、pricing、fulfillment 或 marketplace ranking / recommendation。
- console UI、管理页面、可视化看板、人工运营流程和复杂搜索体验。
- runtime execution、tools execution、provider runtime、LLM routing、quota、route、failover、retry policy、provider health probing。
- governance approval、Policy truth、shared_rules truth、自动审批编排、治理规则引擎或 policy simulation。
- method body、method lifecycle、method definition source truth、method version body 和 method package 发布。
- SDK client、SDK package、language binding、client cache、client-side retry / fallback。
- secret / KMS / Vault 平台、secret rotation workflow、secret value、token、API key 管理。
- cost / billing ledger、finance report、provider raw billing source。
- observability / audit store 正文、raw log、metric store、trace backend、真实 evidence alias。
- external document body、完整 protocol document repository 和外部系统 truth。
- 高级 ecosystem discovery、推荐、score、listing、完整 read-only marketplace browse 能力。

这些内容如果需要接入,只能通过 ref、safe summary、controlled view、handoff、external port、配置绑定或后续版本设计进入,不得在本轮 `03` 写成本仓 truth。

### 2.4 哪些内容属于测试方案、实施计划、配置设计或运维手册?

详细设计只定义代码实现契约和最小测试切口,不替代下游文档:

- `04-配置设计.md`:完整配置项清单、profile、默认值、环境变量、secret 名称、配置文件路径、adapter 产品参数、job 调度数字、外部 endpoint、配置示例和迁移说明。
- `05-测试方案.md`:完整测试矩阵、测试数据、fixture、mock / fake 策略、自动化执行计划、报告产物、证据组织、回归策略和覆盖率计划。
- `06-验收标准.md`:验收基线、准入准出、验收证据、发布门禁、失败判定、签署和最终放行口径。
- `07-实施计划.md`:phase / commit boundary、任务拆分、提交顺序、实现前阅读矩阵、回退计划、implementation ledger 和 planned boundary skeleton。
- 运维 / 部署文档:部署拓扑、容量规划、生产告警、on-call runbook、故障处置和环境管理。
- ADR:DB、message bus、cache、search、object storage、audit / observability、API gateway、secret platform、adapter 产品或 provider gateway 的最终技术选型。

### 2.5 实现者拿到本文后,应能完成哪些代码范围?

实现者拿到正式 `03-详细设计.md` 后,应能直接在目标实现仓完成以下代码范围,而不需要自行补真相源:

- Rust workspace / crate / package / module / file skeleton。
- `contracts` 层 typed ref、DTO、view、event candidate、job input / report、receipt、error surface、metadata、idempotency 和 pagination / freshness carrier。
- `domain` 层 aggregate / relation / value object / policy / state transition / change record / report / projection marker。
- `application` 层 command / query / consumer / job service、函数级编排、stored result、transaction / UoW、trace / event candidate / projection stale side effect。
- `ports` 层 repository、projection store、reference resolver、safe summary adapter、event publisher、handoff adapter、clock、id generator、config、UoW 和 fake parity。
- `infra` 层 fake repository、fake adapter、config loader、job runner shell 和 publisher / handoff fake。
- projection / material / report / consumer view rebuild、external reference refresh、event collaboration repair 和 reconciliation 的最小实现面。
- audit / trace / handoff marker、diagnostic surface 和 evidence schema 输入。
- unit / contract / service / integration 的最小测试切口。

实现者不应再自行决定 truth owner、对象字段、接口分类、状态集合、Command / Query 名称、DTO schema、metadata authority、idempotency digest、result ref、projection rebuild source、reference resolver source、event candidate source identity、config owner、evidence schema 或 implementation boundary。

---

## 3. 当前文档问题诊断

| 位置 / 材料 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 `03-详细设计.md` §1~§4 | 旧范围围绕 MCP / A2A registry、ProviderContract、CapabilityDecision、CostRecord、QueryCapabilities、KMS / Vault、policy refresh 和 cost / audit 展开。 | 本轮范围只承接新版 `00/01/02` 与 Step 1;旧范围降级为 historical material。 |
| 旧 `03-详细设计.md` 目录树 | 旧目录包含 `provider_service.rs`、`access_service.rs`、`accounting_service.rs`、`contract / decision / accounting` domain。 | Step 4 才重新定义文件布局;Step 2 不继承旧目录。 |
| 正式 `02` §12 | 已给出 `03` 承接方向,但尚未转成详细设计自身的目标 / 范围表。 | 本步将承接方向转写为设计目标表、覆盖范围表和非范围表。 |
| 正式 `02` §13 | 混合风险、产品未定事项、下游文档缺口和实现前阻塞项。 | 本步明确哪些留在 `03` scope,哪些后移 `04~07` / ADR / 运维 / 相邻仓。 |
| `04/05/06/07` 尚未按新版主线重建 | 容易让 `03` 越界写完整配置、测试、验收或实施边界。 | 本步把这些内容明确列为非范围和下游归属。 |

---

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 范围来源 | 旧 `03`、README、旧 `02` 和新版 `02` 容易混用。 | 只承接新版 `00/01/02`、Step 1 和 `02_hld_step_12/13`。 | 防止旧对象、旧流程和旧越界职责回流。 |
| 详细设计目标 | 容易被写成“把概要写细”或功能需求复述。 | 定义为模块、对象、协议、flow、状态、事务、错误、幂等、配置绑定、审计和测试切口实现契约。 | 对齐详细设计书写规范。 |
| 非范围 | 未在 `03` 校准中固定。 | 明确配置、测试、验收、实施、运维、ADR、相邻仓正文和外围增强归属。 | 防止详细设计替代下游文档或相邻仓。 |
| 实现者预期 | 仍可能需要实现侧猜字段、猜状态、猜 port、猜 config owner。 | 明确实现者应能完成 contracts、domain、application、ports、infra fake、projection / job / handoff 和 tests。 | 支撑 Step 5 以后可落码粒度。 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 只覆盖 identity / registry / descriptor / exposure 写路径 | 文档量较小,推进快。 | governance seam、method relation、consumer view、trace / impact、derived material、reference support、query、consumer、job、handoff 和 tests 会缺 exact 契约。 | 不采用。 |
| B. 覆盖新版 `02` 已收稳的核心闭环和必要接缝 | 能直接支撑后续实现和 `07` 实施计划,减少实现侧自行补 schema / port / state 的风险。 | 后续 Step 工作量较大,需要严格逐步推进。 | 采用。 |
| C. 同时把配置手册、测试方案、验收和实施 boundary 写入 `03` | 看似一次完整。 | 混淆文档职责,会提前锁定产品、证据、排期和 boundary,并违反 `07` 才创建 implementation ledger / skeleton 的规则。 | 不采用。 |

---

## 6. 结构化中间产物

### 6.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳实现组织边界 | 将 8 个业务主要组成部分和实现分层转成正式实现组织主轴。 | workspace / crate / package / module / file layout 的设计输入。 |
| 收稳模块契约 | 明确每个模块的职责、非职责、owned object、service、repository、projection、port、job 和 test cut。 | 实现者可建立 module skeleton 和跨模块依赖。 |
| 收稳对象契约 | 将 43 个关键对象展开为 aggregate / relation / value object / enum / typed ref / policy / projection / report / change record 的字段、函数、状态和不变量。 | `domain` / `contracts` 类型可按文档实现。 |
| 收稳协议契约 | 将 Command / Query / Consumer / Outbound Event / Job / External Port 骨架展开为 request、response、envelope、receipt、report、metadata、idempotency、visibility、freshness 和 error surface。 | API / worker / job entry 和 `contracts` public surface 可按文档实现。 |
| 收稳函数级处理流 | 将写、读、consumer、job、event candidate、reference refresh、projection rebuild、handoff repair 等流展开为 service 编排、repository / port 调用、transaction、stored result 和副作用顺序。 | `application` service 和 fake infra 可按文档实现。 |
| 收稳状态矩阵 | 将多状态族落成正式 enum、初始态、终态、允许 / 禁止迁移、guard、状态传播和 serialization / migration 规则。 | domain transition、状态 guard 和状态测试可按文档实现。 |
| 收稳持久化与一致性 | 明确 truth、relation、history、trace、safe summary、reference state、projection、report、stored result、event candidate 和 handoff 的 repository / UoW / consistency contract。 | repository trait、fake adapter、transaction boundary 和 replay 规则可按文档实现。 |
| 收稳错误 / 并发 / 幂等 | 定义 error taxonomy、response mapping、request digest、dedup、duplicate replay、conflict、expected version、retry / quarantine / dead-letter 和 recovery cut。 | 服务层 guard、idempotency store 和 negative tests 可按文档实现。 |
| 收稳配置与外部绑定 | 定义 runtime builder、ConfigValidator、adapter / job / read / consumer / publisher / handoff config owner 和禁止配置化边界。 | `04-配置设计.md` 可在不改业务 truth 的前提下继续展开完整配置手册。 |
| 收稳审计 / 观测 / handoff 切口 | 明确 trace、audit hook、handoff marker、event collaboration outcome、safe diagnostic 和 evidence schema 输入。 | observability / audit seam 和 `05/06` evidence 规则可承接。 |
| 收稳测试与实施承接输入 | 给出每个模块、协议、状态、事务、幂等、配置和边界的最小测试切口与实施前阅读输入。 | `05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 可承接。 |

### 6.2 本轮覆盖范围表

| 范围 | 必须覆盖的设计内容 | 后续 Step |
|---|---|---|
| 实现约束与仓级规则 | Rust 语言 / runtime、编码规范、仓库约束、本地 sibling 依赖裁剪、禁止越界依赖。 | Step 3 |
| 实现单元与文件布局 | workspace、crate / package、module、file、binary / library、目录映射和 builder / entry 分布。 | Step 4 |
| 模块实现契约 | 8 个主要组成部分到模块 owner、service、domain、repository、projection、port、job 和 test cut 的映射。 | Step 5 |
| 对象实现契约 | identity、registry、descriptor、governance seam、method relation、formal exposure、trace / impact、derived material、reference support 对象字段、函数、状态和不变量。 | Step 6 |
| Trait / Port / Adapter 契约 | truth / relation repository、projection store、reference resolver、safe summary adapter、consumer ref adapter、event publisher、handoff adapter、clock、id、UoW、config 和 fake parity。 | Step 7 |
| API / Command / Query / Event / Job 协议契约 | Command / Query / Consumer / Outbound Event / Job / External Port DTO、envelope、result、receipt、report、metadata、idempotency、error mapping。 | Step 8 |
| 逐接口函数级处理流 | P0 Command、复杂 Query、Inbound Consumer、Operations Job、event candidate、reference refresh、projection rebuild、handoff repair 的调用链和副作用。 | Step 9 |
| 状态机与转换矩阵 | identity / review、registry、descriptor / risk / secret、governance seam、method relation、formal exposure、consumer view、trace / impact、derived material、reference、event collaboration 状态矩阵。 | Step 10 |
| 持久化、事务与一致性 | repository contract、versioned save / load、stored result、history / trace、event candidate、projection stale、reference state、report、handoff marker、UoW 和最终一致路径。 | Step 11 |
| 错误模型、异常分支与恢复 | domain / application / protocol / infra error、not visible、stale、partial、unavailable、forbidden、conflict、duplicate、retry / quarantine / dead-letter。 | Step 12 |
| 并发、幂等与重入保护 | idempotency key、request digest、dedup key、expected version、result ref、stored result replay、job duplicate report、consumer duplicate receipt 和 conflict 行为。 | Step 13 |
| 配置引用与外部依赖绑定 | runtime builder、ConfigValidator、AdapterConfig、JobConfig、Query / ReadConfig、Consumer / EventConfig、Publisher / HandoffConfig、forbidden config gate。 | Step 14 |
| 可观测性与审计埋点 | audit / trace / diagnostic / handoff / event collaboration marker、metric / log hook、evidence schema 输入和 forbidden body redaction。 | Step 15 |
| 测试切口与最小验证 | unit、contract、service、integration、state matrix、query no-write、consumer / job no-write、forbidden body、config negative、handoff no-rollback。 | Step 16 |
| 实施计划承接 | 实现前阅读矩阵、闭环复核输入、`07` phase / boundary 需要承接的设计材料和未闭合事项。 | Step 17 |
| 风险与待确认事项 | Step 1~17 中仍未闭口但不应被实现侧私补的事项。 | Step 18 |
| 正式文档装配 | 将 Step 1~18 装配成正式 `03-详细设计.md`,并标注校准来源。 | Step 19 |

### 6.3 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、功能需求、业务规则、数据归属和验收目标重写。 | `00-需求文档.md` |
| 系统上下文、限界上下文、依赖方向、数据所有权、一致性策略、运行承载和架构取舍重写。 | `01-架构设计.md` |
| 新增 / 删除 / 合并 / 重命名 8 个主要组成部分、43 个关键对象、主接口、处理流族或状态族。 | 回退 `02-概要设计.md` 对应 Step |
| 完整配置 profile、默认值、JSON / YAML / TOML 示例、环境变量、secret 名称、配置文件路径、部署挂载、retry 数字、cron、worker 并发、产品参数。 | `04-配置设计.md` |
| 完整测试矩阵、测试数据、fixture、mock / fake 数据、自动化脚本、报告产物、证据路径、回归策略和覆盖率计划。 | `05-测试方案.md` |
| 验收基线、准入准出、验收证据、发布门禁、最终失败条件、签署和放行判定。 | `06-验收标准.md` |
| phase / commit boundary、任务拆分、提交顺序、回退计划、implementation ledger、planned boundary skeleton 和实施报告。 | `07-实施计划.md` |
| 部署拓扑、生产告警、容量规划、on-call runbook、故障处置和环境运维流程。 | 运维 / 部署文档 |
| 具体 DB、message bus、cache、search、object storage、API gateway、secret platform、observability / audit、adapter 产品或 provider gateway 最终选型。 | ADR / `04-配置设计.md` / `07-实施计划.md` |
| runtime execution、tools execution、provider runtime、LLM routing、quota、route、failover、provider health probing 和 execution payload。 | runtime / tools / provider 相关相邻仓或后续架构设计 |
| governance approval、Policy truth、shared_rules truth、自动审批编排、policy simulation 和治理规则引擎。 | `L1-governance` |
| method body、method lifecycle、method definition source truth、method version body 和 method package 发布。 | `L3-method-library` |
| SDK client、SDK package、language binding、client cache 和 client-side retry / fallback。 | `L0-sdk` |
| marketplace listing、transaction、pricing、fulfillment、ranking、recommendation 和商品化运营。 | marketplace / product / future design |
| secret / KMS / Vault 平台、secret value、token、API key、secret rotation workflow。 | 安全 / secret 平台和 `04-配置设计.md` 的引用边界 |
| cost / billing ledger、finance report、provider raw billing source。 | finance / billing 相关系统 |
| observability / audit store 正文、raw log、metric backend、trace backend、真实 evidence alias。 | observability / audit 系统与 `05/06` |
| external document body、完整 protocol document repository 和外部系统 truth。 | external system / document owner |
| 高级 ecosystem discovery、复杂搜索体验、推荐、score、console 可视化和运营看板。 | 后续版本 / 产品增强 / ADR |

### 6.4 实现者拿到正式 `03` 后应能完成的代码范围

| 代码范围 | 应具备的设计输入 |
|---|---|
| workspace / crate / module / file skeleton | Step 3 / Step 4 |
| `contracts` typed ref / DTO / view / event candidate / job report / receipt / error surface | Step 6 / Step 8 / Step 12 |
| `domain` aggregate / relation / value object / policy / state transition / change record | Step 6 / Step 10 |
| `application` command / query / consumer / job service | Step 7 / Step 8 / Step 9 / Step 13 |
| `ports` repository / projection / resolver / safe summary / publisher / handoff / clock / id / UoW / config trait | Step 7 / Step 11 / Step 14 |
| `infra` fake repository / fake adapter / config loader / publisher fake / handoff fake | Step 7 / Step 11 / Step 14 |
| controlled consumer view / directory projection / audit export / ecosystem discovery / reconciliation report rebuild | Step 6 / Step 9 / Step 11 |
| external reference refresh / body-free consumer handling / event collaboration repair | Step 7 / Step 8 / Step 9 / Step 11 |
| trace / audit / event candidate / handoff marker / diagnostic hook | Step 9 / Step 11 / Step 15 |
| unit / contract / service / integration test shell | Step 16 |

---

## 7. 回填草稿

> 注意: 本节只是 Step 19 装配正式 `03-详细设计.md` 时的回填草稿,当前不直接修改正式文档。

```md
## 2. 本次详细设计目标与范围

> 校准来源:
> - `design-calibration/03_ddd_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“设计目标表”“本轮覆盖范围表”“非范围表”和“实现者拿到正式 `03` 后应能完成的代码范围”小节,了解本轮详细设计覆盖范围、非范围和下游文档边界。

本轮详细设计目标是把新版 `02-概要设计.md` 已收稳的 Capability Hub 代码主体框架、8 个主要组成部分、43 个关键对象、六类接口骨架、关键处理流、多状态族、异常边界和配置影响轮廓,展开为目标实现仓可以 1:1 落码的实现契约。

### 2.1 设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 收稳实现组织边界 | 将 8 个业务主要组成部分和实现分层转成正式实现组织主轴。 | workspace / crate / package / module / file layout 的设计输入。 |
| 收稳模块契约 | 明确每个模块的职责、非职责、owned object、service、repository、projection、port、job 和 test cut。 | module skeleton 和跨模块依赖。 |
| 收稳对象契约 | 将 43 个关键对象展开为 aggregate / relation / value object / enum / typed ref / policy / projection / report / change record 的字段、函数、状态和不变量。 | `domain` / `contracts` 类型。 |
| 收稳协议契约 | 将 Command / Query / Consumer / Outbound Event / Job / External Port 骨架展开为 request、response、envelope、receipt、report、metadata、idempotency、visibility、freshness 和 error surface。 | API / worker / job entry 与 public `contracts` surface。 |
| 收稳函数级处理流 | 将写、读、consumer、job、event candidate、reference refresh、projection rebuild、handoff repair 等流展开为 service 编排、repository / port 调用、transaction、stored result 和副作用顺序。 | `application` service 与 fake infra。 |
| 收稳状态矩阵 | 将多状态族落成正式 enum、初始态、终态、允许 / 禁止迁移、guard、状态传播和 serialization / migration 规则。 | domain transition、state guard 和状态测试。 |
| 收稳持久化与一致性 | 明确 truth、relation、history、trace、safe summary、reference state、projection、report、stored result、event candidate 和 handoff 的 repository / UoW / consistency contract。 | repository trait、fake adapter、transaction boundary 和 replay 规则。 |
| 收稳错误 / 并发 / 幂等 | 定义 error taxonomy、response mapping、request digest、dedup、duplicate replay、conflict、expected version、retry / quarantine / dead-letter 和 recovery cut。 | service guard、idempotency store 和 negative tests。 |
| 收稳配置与外部绑定 | 定义 runtime builder、ConfigValidator、adapter / job / read / consumer / publisher / handoff config owner 和禁止配置化边界。 | `04-配置设计.md` 可继续展开完整配置手册。 |
| 收稳审计 / 观测 / handoff 切口 | 明确 trace、audit hook、handoff marker、event collaboration outcome、safe diagnostic 和 evidence schema 输入。 | observability / audit seam 和 `05/06` evidence 规则输入。 |
| 收稳测试与实施承接输入 | 给出每个模块、协议、状态、事务、幂等、配置和边界的最小测试切口与实施前阅读输入。 | `05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 可承接。 |

### 2.2 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 需求目标、用户故事、功能需求、业务规则、数据归属和验收目标重写。 | `00-需求文档.md` |
| 系统上下文、限界上下文、依赖方向、数据所有权、一致性策略、运行承载和架构取舍重写。 | `01-架构设计.md` |
| 新增 / 删除 / 合并 / 重命名 8 个主要组成部分、43 个关键对象、主接口、处理流族或状态族。 | 回退 `02-概要设计.md` 对应 Step |
| 完整配置 profile、默认值、环境变量、secret、产品参数和部署挂载。 | `04-配置设计.md` |
| 完整测试矩阵、测试数据、自动化脚本、报告产物、证据路径和回归策略。 | `05-测试方案.md` |
| 验收基线、准入准出、验收证据、发布门禁、签署和放行判定。 | `06-验收标准.md` |
| phase / commit boundary、任务拆分、提交顺序、回退计划、implementation ledger 和 planned boundary skeleton。 | `07-实施计划.md` |
| 部署拓扑、生产告警、容量规划、on-call runbook 和故障处置。 | 运维 / 部署文档 |
| 具体 DB、message bus、cache、search、object storage、API gateway、secret platform、observability / audit、adapter 产品或 provider gateway 最终选型。 | ADR / `04-配置设计.md` / `07-实施计划.md` |
| runtime execution、tools execution、governance approval、Policy truth、shared_rules truth、method body、SDK client、marketplace listing、secret / KMS 平台、cost ledger、provider runtime、observability / audit store 或 external document 正文。 | 对应相邻仓、外部系统或后续设计 |
| 高级 ecosystem discovery、复杂搜索体验、推荐、score、console 可视化和运营看板。 | 后续版本 / 产品增强 / ADR |
```

---

## 8. 待确认事项

| 待确认事项 | 是否阻塞 Step 3 | 后续落点 |
|---|---|---|
| `03` 采用单 crate 模块分层还是 workspace 多 crate。 | 不阻塞 Step 3。 | Step 3 / Step 4。 |
| Rust runtime、框架、storage、message、search、config、observability 抽象是否已有仓级规范或本地代码约束。 | 不阻塞 Step 3。 | Step 3 / Step 4 / Step 11 / Step 14 / Step 15。 |
| `L0-core` 可复用的 typed ref、metadata、idempotency、error base、trace context 和 pagination 类型。 | 不阻塞 Step 3。 | Step 3 / Step 6 / Step 8 / Step 13。 |
| Governance result ref、method asset ref、runtime/tools consumer ref、SDK exposure consumer ref、observability audit ref、external document ref 的最小字段和上游契约。 | 不阻塞 Step 3。 | Step 6 / Step 7 / Step 8 / Step 14。 |
| `04/05/06/07` 需要后续按新版 `03` 同步重建。 | 不阻塞 Step 3。 | Step 14 / Step 16 / Step 17 / Step 18 和后续 `04~07`。 |

---

## 9. 自检与停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否承接 Step 1 的上游输入边界 | pass | 本 Step 只以新版 `00/01/02`、Step 1 和 `02_hld_step_12/13` 为范围来源。 |
| 是否明确本轮必须覆盖的模块、对象、接口、事件、job 和状态机 | pass | 已列出 8 个主要组成部分、43 个对象族、六类接口、operations job、external port 和状态族范围。 |
| 是否明确非范围和归属文档 | pass | 已将配置、测试、验收、实施、运维、ADR、相邻仓正文和外围增强分别归属。 |
| 是否写实现排期、任务拆分或 commit boundary | no | 这些留给 `07-实施计划.md`。 |
| 是否创建 implementation ledger 或 boundary skeleton | no | 这些只允许在 `07` 完成时创建。 |
| 是否修改正式 `03-详细设计.md` | no | 本 Step 只创建中间产物。 |
| 是否提前写文件布局、对象字段、DTO schema、trait、DDL 或配置 key | no | 这些留给 Step 4~14。 |
| 是否伪造测试结果、evidence alias、run_id、验收签署或 commit | no | 未生成此类内容。 |

---

## 10. 进入下一步条件

- 已明确本轮详细设计覆盖核心可落码闭环和必要接缝。
- 已明确 `03` 不重写需求、架构、概要主语,如需改主语必须回退对应 `02` Step。
- 已明确配置、测试、验收、实施、运维、ADR、相邻仓正文和外围增强不属于本轮 `03` 正文范围。
- 已明确实现者拿到正式 `03` 后应能完成的代码范围。
- 用户审查确认后才允许进入 Step 3 `收稳编码规范、语言 / runtime、仓库约束`。

当前 next_allowed_action:

```text
wait_user_review_to_03_step_03
```
