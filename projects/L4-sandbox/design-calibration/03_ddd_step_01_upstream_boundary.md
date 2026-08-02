# Step 1. 确认概要设计输入边界

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 1
> 回填章节: `03-详细设计.md` §1 与上游文档的关系声明
> 生成日期: 2026-07-08
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 只确认 `03-详细设计.md` 可承接哪些上游结论、哪些问题已经不再重答、哪些内容必须在详细设计继续闭口,不展开文件布局、对象字段、port 签名、DTO、事务、状态矩阵或测试切口。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 `03` | 是。用户已明确确认正式 `02-概要设计.md`,允许启动 `03-详细设计.md` full-restart。 |
| 项目级台账是否允许进入 `03` | 是。正式 `02` 已完成并获用户确认,当前可进入 `03` Step 1。 |
| 文档级 flow 是否已创建 | 是。已创建 `03_ddd_calibration_flow.md`,并记录当前停在 Step 1 审查点。 |
| 是否已读取详细设计 SOP Step 1 | 是。Step 1 只确认概要设计输入边界,不提前进入 Step 2 范围收敛或 Step 4 以后实现契约。 |
| 是否已读取详细设计书写规范 §一~§三 | 是。正式 `03` 必须采用 18 章结构,且以模块实现契约为主轴。 |
| 是否发现阻塞 Step 1 的上游 blocker | 否。`04-配置设计.md` 和 `07-实施计划.md` 缺失属于下游文档缺口;旧 `03` 污染风险已被隔离为 historical material。 |

---

## 2. 本步目标

确认当前详细设计可以直接承接哪些需求、架构和概要设计结论,并把“`03` 不能再重发明什么”“`03` 必须继续回答什么”“旧 `03` 哪些内容不能沿用”写清。

本步不做以下事情:

- 不确定本轮详细设计范围和非范围,那是 Step 2。
- 不收实现单元与文件布局,那是 Step 4。
- 不写对象字段、函数签名、DTO、port、事务、一致性或状态矩阵,那是 Step 6~11。
- 不写配置手册、测试方案、验收门禁、实施排期或 commit boundary。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | 当前正式需求基线 | 提供 execution isolation truth ownership、C-SBX-1~5、FR / BR / AC / VF、数据归属、依赖边界、NFR 和零容忍红线。 |
| `projects/L4-sandbox/01-架构设计.md` | 当前正式架构基线 | 提供独立 truth center、核心 / 支撑子域、运行承载、依赖方向、数据所有权、一致性、通信分层和配置不可越界边界。 |
| `projects/L4-sandbox/02-概要设计.md` | 当前正式概要基线 | 提供代码主体框架、4 个运行单元口径、6 个主要组成部分、关键对象轮廓、6 类接口骨架、关键处理流、6 组并行状态机、异常边界和详细设计承接清单。 |
| `projects/L4-sandbox/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 已完成 | 解释哪些主语已经由概要设计钉死,详细设计只能继续展开。 |
| `projects/L4-sandbox/design-calibration/02_hld_step_13_risks_open_questions.md` | 已完成 | 识别 handoff ack、material retention、failure taxonomy、backend profile 等仍未闭口项。 |
| `projects/L4-sandbox/03-详细设计.md` | historical_material | 仅用于诊断旧五部分主线、旧对象词、旧目录和旧 bridge / persistence 假设。 |
| `standards/document/详细设计讨论流程_SOP.md` | 已读取 Step 1 | 约束本步输出上游关系映射表、本文不再回答、本文必须回答和输入不足风险。 |
| `standards/document/详细设计书写规范.md` | 已读取 §一~§三 | 约束正式 `03` 的 18 章结构、模块主轴和校准来源写法。 |
| `standards/document/设计文档编写通则.md` | 已读取 | 约束正式正文只承载收口结论,过程材料保留在 calibration。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读取 | 约束三层台账、逐 Step、先中间产物后正式文档和写入前门禁。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读取 | 约束后续对象 / 协议 / flow / state / persistence / test 必须形成 1:1 可落码闭环。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 确认 `L0-core` 是唯一编译期依赖,其余 sibling / backend 只能以运行期、事件、ref、snapshot、summary、handoff 协作。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取项目级台账、详细设计 SOP / 书写规范和正式 `00/01/02`。 | done | 确认 `03` 已具备启动条件。 |
| 2 | 读取 `02_hld_step_12_detailed_design_handoff.md`、`02_hld_step_13_risks_open_questions.md` 和旧 `03-详细设计.md`。 | done | 区分稳定输入、风险挂起项和旧材料污染点。 |
| 3 | 回答 Step 1 核心问题。 | done | 形成 `03` 可承接 / 不可重定义 / 必须继续展开的边界。 |
| 4 | 输出上游关系映射表、本文不再回答、本文必须回答和输入不足风险。 | done | 满足正式 `03` §1 回填要求。 |
| 5 | 创建 `03_ddd_calibration_flow.md` 并同步项目级台账、`02` flow 状态。 | done | 把正式 `02` 的用户确认和 `03` Step 1 恢复点写实到台账。 |
| 6 | 自检未触碰正式 `03-详细设计.md`,未提前写 Step 2~19 内容。 | done | 当前进入用户审查点。 |

---

## 5. SOP 问题回答

### 5.1 当前详细设计直接承接概要设计中的哪些结论?

当前 `03-详细设计.md` 必须直接承接以下概要设计结论:

- 代码主体框架双轴:
  4 个运行单元口径 + `Inbound / Operations`、`Application Services`、`Domain Model`、`Ports / Persistence / Projection / Handoff` 实现分层。
- 6 个正式主要组成部分:
  `Controlled execution intake and identity`、`Boundary establishment and enforcement`、`Policy execution decision`、`Execution capture and material handoff`、`Failure control and safety closure`、`Local reference, projection and derived support`。
- 已点名的关键对象族:
  `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`CoherentBoundary`、`PolicyExecutionDecision`、`ControlledExecutionRun`、`CaptureFact`、`HandoffFact`、`FailureClassification`、`CleanupGuard`、`RedlineContainment`、`SandboxReadProjection`、`SandboxReconciliationReport` 等。
- 6 类接口骨架:
  Command、Query、Inbound Event Consumer、Outbound Event、Operations Job、External / Infrastructure Port。
- 已点名接口家族:
  `OpenControlledExecutionContext`、`EstablishExecutionBoundary`、`EvaluatePolicyExecution`、`StartControlledExecutionRun`、`RecordCaptureResult`、`OpenMaterialHandoff`、`SubmitSandboxControl`、`ClassifySandboxFailure`、`EvaluateCleanupReadiness`、`RecordRedlineContainment` 及对应 Query / Consumer / Job / Port 主语。
- flow family:
  intake、boundary、policy、run / capture / handoff、failure / control / lease / orphan / cleanup / reaper / redline、projection / derived / relay / reconciliation。
- 6 组并行状态机:
  Intake / Identity、Boundary / Capability、Policy / High-Risk、Run / Capture / Handoff、Failure / Control / Cleanup / Redline、Reference / Projection / Relay / Read Surface。
- 异常边界和配置红线:
  coherent boundary 不得 silent degrade、policy 必须 fail-closed、handoff failure 不回滚 capture truth、cleanup 不得先删证据、redline 必须 containment、Query / Consumer / Job 不得成为隐藏写源。

`00-需求文档.md` 与 `01-架构设计.md` 继续作为边界和约束上游存在,但不再在详细设计里重写仓定位、子域划分、架构取舍或需求验收。

### 5.2 概要设计中的代码主体框架是否已经足够稳定?

足够稳定。

当前 `02-概要设计.md` 已经把 `L4-sandbox` 的详细设计入口固定为:

- 4 个运行单元口径:
  `Sandbox Sync Entry`、`Sandbox async control and handoff consumption unit`、`Sandbox controlled execution fulfillment unit`、`Sandbox backend maintenance and cleanup unit`。
- 实现分层:
  入口 / 运行触发、应用编排、领域对象 / guard、外部接缝 / 持久化 / read model / handoff。
- 业务主语:
  6 个主要组成部分对应正式职责边界和“不承担什么”。

因此 `03` 可以继续把这些主语落成 crate / package / module / file / builder / service / trait / adapter,但不能改写谁拥有 truth、谁只消费 summary / ref、谁只做 read / derived、谁只能作为 handoff / relay / maintenance support。

### 5.3 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开?

足够进入详细设计。

概要设计已经完成以下闭环:

- 关键对象轮廓已经从 6 个主要组成部分中筛出正式对象、guard、view 和 derived / relay / reconciliation 主语。
- 接口骨架已经区分 Command / Query / Consumer / Event / Job / Port,并点名主要接口族。
- 关键处理流已经把 intake、boundary、policy、run、capture、handoff、failure、cleanup、redline、projection、derived、relay、reconciliation 串成主路径。
- 状态机已经明确 6 组并行状态主语、允许 / 禁止迁移和关键传播关系。
- 配置影响已经明确哪些只影响承载、节奏、enablement 和 degraded surface,哪些绝对不能配置化。

这意味着 `03` 无需重新发明对象名称、流程家族和状态主题,可以直接下沉到字段、函数、DTO、trait、transaction 和 persistence 契约。

### 5.4 哪些内容仍停留在概要设计轮廓,进入详细设计前必须补清?

以下内容必须由 `03` 继续补清:

- Rust workspace / crate / package / module / file layout,以及运行单元与实现单元映射。
- 每个模块的对象字段、typed ref、factory、member method、enum variant、Rustdoc 注释和 invariants。
- repository / port / adapter / resolver / gateway / publisher trait 的完整签名、读取面和写入面。
- Command / Query / Event / Job 的 request / response DTO、receipt、result、public page / cursor、metadata 和 idempotency carrier。
- application service 编排顺序、transaction boundary、save order、relay / handoff / stale marker 顺序和副作用。
- persistence shape、consistency 分层、projection rebuild、relay persistence、cleanup guard persistence 和 reconciliation state。
- error taxonomy、恢复口径、并发冲突、重入保护、duplicate / blocked / degraded / unavailable / retryable / dead-letter surface。
- config owner、validator、binding point、external dependency wiring、observability / audit hook 字段和测试切口。

这些都属于详细设计必须完成的内容,但不阻塞当前进入 Step 2。

### 5.5 哪些需求或架构结论会影响详细设计,但不能在详细设计中重新定义?

以下结论只能承接,不得在 `03` 中改写:

- `L4-sandbox` 只拥有 execution isolation truth,不拥有 tools semantic execution、runtime execution truth、member lifecycle、identity / work truth、artifact truth、observability store 或 policy definition truth。
- `L0-core` 是唯一编译期依赖;其余 sibling 仓和 isolation backend 只能通过运行期、事件、ref、snapshot、safe summary、handoff 或基础设施接缝协作。
- coherent boundary 必须整体成立;任一 resource / filesystem / network / process / workspace / mount 限制不可落实时不得 silent degrade。
- sandbox 只执行给定 policy / authorization 摘要并 fail-closed,不得生成 allowlist、approval、policy DSL 或 capability truth。
- capture fact、candidate material、observability material、handoff fact 和下游 formal truth 必须严格分层。
- failure classification、control fact、lease / orphan、cleanup guard、reaper 和 redline containment 是一等正式语义,不能降格为 best-effort 运维补丁。
- Query no-write、Consumer 不写核心 success、Job 不修核心 truth、derived / trend / inspect / reconciliation 不反写核心 truth。
- 配置不得改写 truth ownership、boundary、fail-closed、cleanup guard、redline semantics 或依赖裁剪。

### 5.6 哪些概要结论会直接影响后续模块 / 文件 / 对象 / 接口 / 流程 / 状态机设计?

| 概要已收稳结论 | 会直接影响的详细设计输出 |
|---|---|
| 4 个运行单元口径 | Step 4 文件布局、runtime builder、entry / consumer / job runner 模块划分 |
| 6 个主要组成部分 | Step 5 模块实现契约主轴和模块边界命名 |
| 关键对象族 | Step 6 对象契约、字段来源、factory、状态字段和 invariants |
| 6 类接口骨架与已点名接口家族 | Step 7 trait / port / adapter 契约与 Step 8 协议契约 |
| flow family | Step 9 函数级处理流、service 编排和副作用顺序 |
| 6 组并行状态机 | Step 10 状态矩阵和 Step 11 transaction / consistency 规则 |
| 异常边界 | Step 12 错误模型、恢复口径和 Step 16 负向测试 |
| 配置影响轮廓 | Step 14 config binding / validator 和外部依赖绑定 |

### 5.7 哪些内容虽然相关,但当前仍不足以写成已定输入?

以下内容只能保留为风险或待确认事项,不能在 Step 1 写成已定输入:

- 具体 isolation backend 组合、测试承载边界和 stronger isolation profile。
- policy / authorization 来源矩阵、high-risk action taxonomy、network allowlist、mount / process / seccomp / AppArmor / cap-drop profile。
- material class、partial capture、retention、safe summary、cleanup release 口径。
- handoff receipt / failed / retryable / dead-letter / reconciliation 协议细节和 investigation 回链确认方式。
- failure taxonomy、control conflict、containment release、operator control scope、人工恢复边界。
- DB / object store / bus / observability / investigation 等物理产品和具体 SLO / threshold 数字。

---

## 6. 当前文档问题诊断

| 旧材料内容 | 当前问题 | 本轮处理 |
|---|---|---|
| 旧 `03-详细设计.md` 顶部仍引用旧 `02-概要设计.md v0.1.0` 和“15 节结构”口径 | 与当前详细设计 18 章结构和新版 `02` 不一致。 | 不继承为当前 `03` 基线。 |
| 旧 `03` 以“写 03 前先采集内容”为主线 | 更像采集提示或 brainstorming,不是正式实现契约。 | 只保留为历史过程样本,不进入正式 `03`。 |
| 旧“五组对象”:会话 / 执行、隔离、动作、输出、控制 | 与当前 6 个主要组成部分、truth / capture / handoff / cleanup / derived 分层不一致。 | 不直接继承对象分组;后续 Step 5~6 从正式 `02` 重建模块和对象。 |
| 旧目录树 `src/api/application/domain/infra/projection/types/config` | 是旧实现设想,尚未经过当前 Step 4 文件布局讨论。 | 只能作为历史线索;不可提前写成当前文件布局事实。 |
| 旧 `command / tool / provider bridge` 主线 | 把 tools semantic execution、capability truth 和 backend 细节拉进 sandbox 主语。 | 后续只允许通过 policy summary、backend capability 和 isolation backend port 承接。 |
| 旧 `artifact / conversation / observability / operators` 混层输出口径 | 与当前 capture / handoff 分层、下游 truth ownership 和 investigation 边界冲突。 | 只作为污染风险记录,不作为正式接口 / flow 来源。 |
| 旧 `retry / replay / inspect / cleanup` 主线 | 容易把 runtime recover、调查生命周期和 read-side 增强写成 sandbox 核心真相。 | 当前只保留 failure / cleanup / redline 正式语义;其余后移到 derived / handoff / downstream 协作。 |

---

## 7. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 详细设计输入 | 旧 `03` 容易直接继承旧对象词、旧目录和旧 bridge 主线。 | 当前只承接正式 `00/01/02` 和 `02` calibration 解释性输入。 |
| 旧 `03` 地位 | 可能被误当为当前详细设计草案。 | 只作为 historical material / 问题诊断输入。 |
| `03` 的起点 | 容易从文件布局或对象细节直接开写。 | Step 1 先钉死上游边界,Step 2 再谈范围,Step 4 以后才进入实现契约。 |
| 需要继续展开的内容 | 旧文档把内容采集、目录、对象、流程和控制混写。 | 当前显式拆为文件布局、模块契约、对象契约、port 契约、协议、flow、状态、持久化、错误、幂等、配置、观测、测试和实施承接。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 沿用旧 `03-详细设计.md` 局部修补 | 改动少。 | 旧对象分组、旧目录、旧 bridge / persistence 假设会持续污染当前真相源。 | 不采用。 |
| 直接重写正式 `03-详细设计.md` | 看起来推进快。 | 跳过 Step 1~18 中间产物,正式章节缺少校准来源和停审记录。 | 不采用。 |
| 先做 Step 1 上游边界校准,再逐 Step 重建 | 可追溯、可停审,符合详细设计 SOP。 | 需要持续维护 flow、台账和 Step 文件。 | 采用。 |
| 在 Step 1 直接决定文件布局或对象字段 | 似乎更接近落码。 | 越过 Step 2~6,会让范围、模块和对象边界失去正式来源。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L4-sandbox/00-需求文档.md` | 仓定位、C-SBX-1~5、FR / BR / AC / VF、数据归属、依赖边界、NFR 和零容忍红线 | 对象不变量、协议校验、错误面、测试切口和 implementation handoff 的需求基线 |
| `projects/L4-sandbox/01-架构设计.md` | 独立 truth center、依赖裁剪、数据所有权、一致性分层、运行承载、同步 / 异步 / 后台分离、fail-closed、capture / handoff 分层、cleanup / redline 约束 | crate / module / trait / adapter / transaction / projection / binding 规则 |
| `projects/L4-sandbox/02-概要设计.md` | 代码主体框架、4 个运行单元、6 个主要组成部分、关键对象轮廓、接口骨架、flow family、状态组、异常边界、配置影响和详细设计承接清单 | 文件布局、模块契约、对象契约、trait / port / adapter、协议、函数流、状态矩阵、持久化、一致性、错误、幂等、配置绑定、观测、测试和实施承接 |
| `projects/L4-sandbox/design-calibration/02_hld_step_12_detailed_design_handoff.md` | 概要设计对 `03` 的继续展开方向和回退规则 | 作为 `03` 各 Step 是否允许继续下沉的解释性依据 |
| `projects/L4-sandbox/design-calibration/02_hld_step_13_risks_open_questions.md` | backend / policy / handoff / cleanup / failure / profile / SLO 等未闭口项 | 作为后续 Step 14~18 的风险输入,不提前写成已定契约 |
| 旧 `projects/L4-sandbox/03-详细设计.md` | 旧结构、旧对象词、旧目录、旧 bridge / output / control 主线 | 只用于诊断哪些内容不能默认继承 |

### 9.2 本文不再回答

- `L4-sandbox` 是否是独立 execution isolation truth center。
- sandbox 是否拥有 tools semantic execution、runtime execution truth、member lifecycle、identity / work truth、artifact truth、observability store 或 policy definition truth。
- `L0-core` 是否为唯一编译期依赖。
- coherent boundary、policy fail-closed、capture / handoff 分层、cleanup guard、redline containment、Query no-write 是否是长期红线。
- 4 个运行单元口径、6 个主要组成部分、关键对象族、6 类接口骨架、flow family 和 6 组状态机是否已成为 `03` 直接输入。
- 旧 `03` 的五部分主线、五组对象和旧目录树能否直接继承。答案都是不能直接继承。

### 9.3 本文必须回答

- Rust workspace / crate / package / module / file layout。
- 模块实现契约主轴和每个模块的职责、归属、依赖方向。
- 对象字段、typed ref、factory、member function、状态 enum 和 invariants。
- trait / port / adapter / repository / resolver / publisher / gateway 契约。
- Command / Query / Event / Job 的协议契约、metadata、idempotency 和 public surface。
- 函数级处理流、事务边界、save order、handoff / relay / rebuild / cleanup 顺序。
- 状态机与转换矩阵、非法转换、传播关系和 persistence shape。
- 持久化、一致性、错误模型、恢复口径、并发、幂等与重入保护。
- 配置引用与外部依赖绑定、observability / audit hooks、测试切口与最小验证清单。
- 详细设计到实施计划的承接清单。

### 9.4 输入不足风险

| 风险 | 是否阻塞 Step 2 | 处理口径 |
|---|---|---|
| 旧 `03` 与正式 `02` 大范围冲突 | 不阻塞 | 旧 `03` 只作问题诊断输入,不得作为实现契约来源。 |
| 正式 `04-配置设计.md` 缺失 | 不阻塞 Step 2,影响 Step 14 | Step 14 只定义 config owner、validator、binding point 和越界保护;正式配置手册留给 04。 |
| 旧 `05-测试方案.md` / `06-验收标准.md` 尚未按新版 `03` 同步 | 不阻塞 Step 2,影响 Step 16~17 | Step 16 先输出测试切口,后续 05 / 06 再正式重建。 |
| backend profile、policy 来源矩阵、handoff ack、failure taxonomy 等仍未闭口 | 不阻塞 Step 2 | 后续相关 Step 只能定义 port / DTO / error / config 接缝,不得擅自发明上游 truth。 |
| 具体物理产品和阈值数字未定 | 不阻塞 Step 2 | 当前保持产品中立与结构性预算;产品 / 参数进入 04 / 05 / 06 / 07 或 ADR。 |

---

## 10. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_01_upstream_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“输入不足风险”小节,了解当前详细设计如何承接正式 `00/01/02`,以及旧 `03` 为什么只能作为问题诊断输入。

#### 1. 与上游文档的关系声明

`03-详细设计.md` 直接承接正式 `00-需求文档.md`、`01-架构设计.md` 和 `02-概要设计.md`。本文继续把概要设计中已经收稳的代码主体框架、4 个运行单元口径、6 个主要组成部分、关键对象轮廓、6 类接口骨架、关键处理流、6 组并行状态机、异常边界和配置影响展开为可以 1:1 实现的代码契约。

现有旧版 `03-详细设计.md` 只作为问题诊断输入,不得作为新版详细设计真相源。旧文档中仍适用的事实,必须通过正式 `00/01/02` 或本轮 `03_ddd_step_*` 中间产物重新进入正式文档。

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | execution isolation truth ownership、业务规则、验收红线、禁止行为 | 对象不变量、协议校验、错误面、测试切口和实施承接 |
| `01-架构设计.md` | 依赖方向、数据所有权、一致性分层、运行承载、通信分离、fail-closed、capture / handoff、cleanup / redline 约束 | crate / module / trait / adapter / transaction / projection / binding 规则 |
| `02-概要设计.md` | 代码主体框架、4 个运行单元、6 个主要组成部分、关键对象、接口骨架、flow family、状态组、异常边界和配置影响 | 文件布局、模块契约、对象契约、trait / port / adapter、协议、flow、状态矩阵、持久化、一致性、错误、幂等、配置绑定、观测、测试和实施承接 |

本文不再回答 sandbox 是否是 execution isolation truth center、是否拥有外部 truth、是否允许非 `L0-core` 编译期依赖、coherent boundary / fail-closed / capture / handoff / cleanup / redline / no-write 红线是否成立,也不再回答旧 `03` 的五部分主线或旧目录能否默认继承。

本文必须回答实现单元与文件布局、模块实现契约、对象契约、trait / port / adapter 契约、协议契约、函数级处理流、状态机、持久化、一致性、错误、幂等、配置绑定、观测审计、测试切口和实施承接清单。

---

## 11. 待确认事项

- 当前无阻塞 Step 2 的待确认事项。
- Step 14 需要显式承接 `04-配置设计.md` 仍缺失的问题。
- Step 16~17 需要把旧 `05-测试方案.md` / `06-验收标准.md` 与新版 `03` 的同步需求写清。
- backend profile、policy 来源矩阵、handoff ack、failure taxonomy、profile 和阈值数字继续保持为风险或待确认,不得在 Step 1 写成已定契约。

---

## 12. 进入下一步条件

- 已明确 `03` 直接承接正式 `00/01/02`,且 `02` 已通过用户审查。
- 已明确旧 `03` 只作为 historical material / 问题诊断输入。
- 已列出本文不再回答和必须回答的内容。
- 已识别输入不足风险,且当前没有阻塞 Step 2 的缺口。
