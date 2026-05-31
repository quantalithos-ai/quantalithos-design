## Step 1. 确认概要设计输入边界

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 1
- 回填章节：`projects/L0-sdk/03-详细设计.md` §1 与上游文档的关系声明 / §17 风险与待确认事项

### 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计书写规范.md` | 新版详细设计 18 章主链、模块实现契约主轴、Rustdoc 注释和图表规则 | 作为正式文档结构与输出约束 |
| `standards/document/详细设计讨论流程_SOP.md` | Step 1~19 讨论流程和门禁 | 作为本轮详细设计校准流程 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 中间产物结构、逐 Step 纪律、正式文档追溯要求 | 作为本文件结构约束 |
| `projects/L0-sdk/00-需求文档.md` v0.2.0 | 本仓需求基线 | 确认详细设计不能重新定义的需求边界 |
| `projects/L0-sdk/01-架构设计.md` v0.2.0 | 本仓架构基线 | 确认详细设计不能重新定义的系统边界、依赖方向和技术取舍 |
| `projects/L0-sdk/02-概要设计.md` v0.2.0 | 代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态机、配置影响和承接清单 | 作为详细设计直接输入 |
| `projects/L0-sdk/03-详细设计.md` v0.1.0 | 旧版详细设计草案 | 作为需要重写的旧口径诊断对象 |
| `standards/coding/rust.md` | Rust 编码规范 | Step 3 继续承接,本步只登记为后续输入 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全局依赖方向和本仓依赖裁剪口径 | Step 3 / Step 4 / Step 14 继续承接 |
| `standards/document/子项目目录与代码文件组织规范.md` | 子项目目录、crate / package、binary 和文件组织规则 | Step 4 继续承接 |

已确认结论：

```text
新版 `02-概要设计.md` 已经足以作为详细设计输入。
旧版 `03-详细设计.md` 基于旧 binding / wrapper / subscription / release 口径,不能继续作为正式详细设计主线。
详细设计应从 `02-概要设计.md` §12 的承接清单开始,按新版详细设计 SOP 逐 Step 展开。
```

依赖的前序 Step：

```text
无。Step 1 是本轮详细设计校准的起点。
```

### 3. SOP 问题回答

1. 当前详细设计直接承接概要设计中的哪些结论？

   回答：当前详细设计直接承接新版 `02-概要设计.md` 中已经收稳的代码主体框架、七个主要组成部分、21 个关键对象、Command / Query / Event / Job 接口骨架、关键处理流、状态定义与状态流转、异常边界、配置影响轮廓和详细设计承接清单。详细设计不重新定义这些主语，只把它们展开为模块、文件、struct / enum / trait、DTO、函数签名、事务、错误、配置、审计和测试切口。

2. 概要设计中的代码主体框架是否已经足够稳定？

   回答：足够稳定。`02-概要设计.md` §4 已把 `L0-sdk` 收敛为 Inbound / Operations、Application Services、Domain Model / Policies、Ports / Projection / Artifact / Adapter 分层；§5 已收稳官方客户端语义核心、上游契约消费与派生视图、平台能力访问与正式边界适配、事件客户端视图、横切默认行为、package candidate 与验证证据、文档兼容与演进七个主要组成部分。

3. 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开？

   回答：足够进入详细设计，但每一类都仍处于“概要骨架”深度。Step 6 需要补完整对象实现契约；Step 8 需要补 DTO / schema；Step 9 需要补逐接口函数级处理流；Step 10 需要补状态转换矩阵；Step 11~15 需要补持久化、事务、错误、幂等、配置、审计；Step 16~17 需要补测试切口和实施承接。

4. 哪些内容仍停留在概要设计轮廓，进入详细设计前必须补清？

   回答：文件布局、crate / package / module 组织、Rust struct / enum / value object、trait / port / adapter、Command / Query / Event / Job DTO、函数签名、返回类型、错误类型、transaction / unit of work、idempotency、projection consistency、config contract、observability / audit 和测试切口都仍停留在轮廓层。这些不是概要设计缺口，而是本轮详细设计必须展开的实现契约。

5. 哪些需求或架构结论会影响详细设计，但不能在详细设计中重新定义？

   回答：需求中的本仓定位、P0 核心闭环、F-001~F-010、BR-001~BR-014、数据归属和非功能约束不能在详细设计中重新定义；架构中的职责边界、依赖方向、数据所有权、formal API / fake boundary、event client view、candidate 验证和横切默认也不能重新定义。详细设计只能把这些结论翻译成代码契约。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` 文档头部 | 仍引用旧概要设计 v0.1.0 和旧 15 节结构 | 与新版详细设计 18 章主链和新版概要设计不一致 |
| 旧版 §1 | 把 SDK 描述为 proto-ref、generated binding、wrapper、subscription helper 和 release orchestration 真相 | 与新版 official client access layer、semantic baseline、derived view、candidate / evidence 主线冲突 |
| 旧版 §2 | 内容采集流程仍围绕 codegen、wrapper、subscription、release | 无法承接新版 `SdkSemanticBaseline`、`DerivedBindingView`、`ServiceClientView`、`BusEventClientView` 等对象 |
| 旧版 §3 | 主要部分仍按 binding 生成、三语言 wrapper、横切、事件订阅、文档发版五组组织 | 与新版七个主要组成部分不一致 |
| 当前正式 `02-概要设计.md` | 已收稳详细设计承接清单,但旧 `03` 未同步 | 需要按 SOP 重写详细设计,不是局部修补 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 详细设计输入 | 旧 `02` v0.1.0 和旧 binding / wrapper / release 口径 | 新 `00/01/02` v0.2.0 | 上游已经重建并收稳 |
| 主组织轴 | 按旧功能块和粗略目录组织 | 按模块实现契约组织 | 对齐新版详细设计书写规范 |
| Step 产物 | 无详细设计工作台 | 新建 `03_ddd_calibration_flow.md` 和 Step 中间产物 | 保持可追溯和可 review |
| 正式 `03` 写入方式 | 直接扩写旧文档 | Step 1~18 逐步收敛,Step 19 统一重写 | 避免新旧口径混合 |
| 未决项处理 | 散落或隐含 | 输入不足风险和待确认事项显式收纳 | 防止实现阶段脑补 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：在旧版 `03` 上局部修补 | 改动少 | 旧主线已经偏离新版 `02`,容易残留 binding / wrapper / release 旧口径 | 不采用 |
| 方案 B：按新版详细设计 SOP 建工作台,逐 Step 生成中间产物,最后统一重写正式 `03` | 可追溯、可 review、能防止主语漂移 | 需要更多步骤 | 采用 |
| 方案 C：直接一次性重写正式 `03` | 看似快 | 长文档容易遗漏、风格不一致,且违反中间产物门禁 | 不采用 |

### 7. 结构化中间产物

#### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` §2 / §7 / §9 | `L0-sdk` 是 Rust / Python / TypeScript 官方客户端接入层,核心闭环包括三语言一致、最小可验证接入、event client、横切默认、candidate 和 compatibility | 模块边界、API、对象、处理流和测试切口必须覆盖 P0 核心闭环 |
| `00-需求文档.md` §10 / §11 | BR-001~BR-014、SDK truth / snapshot / reference / forbidden body 数据归属 | guard、policy、repository、evidence、config validation 和 negative tests |
| `00-需求文档.md` §12 / §13 | 接口依赖、非功能要求、安全与可观测性 | Command / Query / Event / Job DTO、port / adapter、trace、redaction、credential protection |
| `01-架构设计.md` §4 / §6 | 职责边界、限界上下文和官方客户端接入层定位 | 模块布局和对象归属不能重新切分 |
| `01-架构设计.md` §8 / §9 | `L0-core` / `L0-bus` 是编译期上游,formal API / fake endpoint 是运行期边界,SDK 有本地 truth 与派生视图 | crate dependency、path dependency、adapter、repository、projection 和 event boundary |
| `01-架构设计.md` §10 / §11 / §13 | 关键交互、技术机制、横切关注点 | handler、consumer、job、port / adapter、policy、config 和 observability 契约 |
| `02-概要设计.md` §4 | 代码主体框架和实现分层 | 实现单元、文件布局和模块依赖图 |
| `02-概要设计.md` §5 | 七个主要组成部分及职责边界 | 模块实现契约主轴 |
| `02-概要设计.md` §6 | 关键对象轮廓 | 完整 Rust struct / enum / value object 契约 |
| `02-概要设计.md` §7 | API / 接口骨架 | 协议 schema、DTO、handler、错误映射 |
| `02-概要设计.md` §8 | 关键处理流 | 函数级调用链、事务边界、port 调用和失败分支 |
| `02-概要设计.md` §9 | 状态定义与状态流转 | 状态转换矩阵、状态守卫函数和非法迁移错误 |
| `02-概要设计.md` §10 | 异常与边界场景 | error enum、错误映射、恢复口径和 negative tests |
| `02-概要设计.md` §11 | 配置影响轮廓 | runtime config、loader、validator、builder 和 adapter / job config |
| `02-概要设计.md` §12 | 详细设计承接清单 | 本轮详细设计的直接执行门禁 |
| `02-概要设计.md` §13 | 设计风险与待确认事项 | Step 18 集中收纳,不得在前序 Step 写死 |

#### 7.2 本文不再回答

- 不重新回答 `L0-sdk` 为什么单独成仓。
- 不重新定义需求目标、用户故事、功能需求、业务规则、验收标准和追溯矩阵。
- 不重新定义系统上下文、限界上下文、依赖方向、数据所有权、通信方式和技术选型。
- 不重新定义 `L0-core` 的 proto / DTO、ErrorCode、TraceContext、Metadata、CloudEvents schema 或 envelope。
- 不重新定义 `L0-bus` 的 publication、delivery、retry、DLQ、replay、tap truth。
- 不把 formal API / fake boundary 写成 SDK 拥有的服务端业务 truth。
- 不把 public registry 发布、release rollback、完整 MCP、REST / GraphQL gateway、REPL / playground、本地缓存 / 离线状态写入当前 P0 实现契约。
- 不在详细设计中改变概要设计已经收稳的对象、接口、处理流和状态机主语。

#### 7.3 本文必须回答

- `L0-sdk` 目标仓的实现单元、crate / module / file 布局如何组织。
- 每个模块包含哪些对象、trait、adapter、repository、error 和测试切口。
- §6 中的关键对象如何落成 Rust struct / enum / value object,字段、函数和注释如何定义。
- §7 中的 Command / Query / Consumer / Event / Job 如何落成 DTO、handler、schema 和错误映射。
- §8 中的每个关键处理流如何落成函数级调用链、事务边界、repository / port 调用和失败分支。
- §9 中的状态机如何落成转换矩阵、状态守卫函数和非法转换错误。
- SDK local truth、derived view、candidate、evidence、compatibility、deprecated、outbox、projection 如何持久化并保持一致。
- runtime config、adapter config、job config、policy config 和禁止配置化边界如何实现。
- 可观测性、审计埋点、测试切口和实施计划承接清单如何定义。

#### 7.4 输入不足风险清单

| 缺失项 / 未定项 | 影响 | 当前处理 |
|---|---|---|
| `VerificationEvidence` 是否拆成 `EvidenceResult` 与 `EvidenceRedactionStatus` | 影响对象契约、状态矩阵和测试切口 | 不阻塞 Step 1;Step 6 / Step 10 / Step 18 保守收口 |
| `RequiresMigration` 进入 `Stable` 的完整门禁 | 影响 candidate stable 和 compatibility 状态转换 | 不阻塞 Step 1;Step 10 / Step 12 细化门禁 |
| `RuntimeConfig` 拆分方式和 JSON 顶层结构 | 影响 Step 14 配置绑定和 04-配置说明 | 不阻塞 Step 1;Step 14 再决定实现契约,JSON 示例留给 04 |
| P0 最小验证目标是真实服务还是 fake / fixture | 影响 smoke、boundary verification、验收证据 | 不阻塞 Step 1;Step 16 和测试方案继续承接 |
| 旧 `03-详细设计.md` 与新版 `02` 不一致 | 直接影响正式详细设计可信度 | Step 19 删除旧文件并重建 |

### 8. 回填草稿

正式 `03-详细设计.md` §1 “与上游文档的关系声明”应摘录并整理：

- 本文件 `7.1` 上游关系映射表
- 本文件 `7.2` 本文不再回答
- 本文件 `7.3` 本文必须回答

正式 `03-详细设计.md` §17 “风险与待确认事项”应在 Step 18 汇总本文件 `7.4` 的输入不足风险，不在 Step 1 直接写成最终风险章。

### 9. 待确认事项

- 无阻塞进入 Step 2 的待确认事项。
- `VerificationEvidence` 类型拆分、`RequiresMigration` stable 门禁、`RuntimeConfig` 拆分、P0 验证目标和 public registry 后续阶段继续作为后续 Step 输入,不得在 Step 1 写成稳定实现契约。

### 10. 进入下一步条件

- [x] 已明确详细设计承接哪些需求、架构和概要设计结论。
- [x] 已确认新版概要设计足以作为详细设计输入。
- [x] 已明确旧 `03-详细设计.md` 只作为问题诊断材料。
- [x] 已识别不阻塞 Step 2 但需要后续收口的输入不足风险。
- [x] 已足以进入 Step 2 “明确本轮实现范围和非范围”。
