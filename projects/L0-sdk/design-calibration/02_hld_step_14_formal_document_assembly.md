## Step 14. 整理正式概要设计文档

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 14
- 回填章节：`projects/L0-sdk/02-概要设计.md` 全文

### 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 1 ~ Step 13 | 已确认的上游边界、范围、约束、代码主体框架、主要组成部分、关键对象、接口、处理流、状态机、异常、配置影响、详细设计承接和风险 |
| 书写规范 | `standards/document/概要设计书写规范.md` 14 章正式主链 |
| 讨论 SOP | `standards/document/概要设计讨论流程_SOP.md` Step 14 |
| 旧正式文档 | `projects/L0-sdk/02-概要设计.md` v0.1.0，只作为替换前诊断材料 |

已确认结论：

```text
正式 02-概要设计.md 应删除旧版草案后按新版 14 章主链重建。
Step 14 只重组和润色已确认结论，不新增未经讨论的新设计。
```

### 3. SOP 问题回答

1. 哪些已确认结论应分别回填到哪些正式章节？

   回答：Step 1 回填 §1，Step 2 回填 §2，Step 3 回填 §3，Step 4 回填 §4，Step 5 回填 §5，Step 6 回填 §6，Step 7 回填 §7，Step 8 回填 §8，Step 9 回填 §9，Step 10 回填 §10，Step 11 回填 §11，Step 12 回填 §12，Step 13 回填 §13，参考材料回填 §14。

2. 哪些结论需要拆分吸收到多个章节，而不是机械复制？

   回答：`L0-core` / `L0-bus` truth 边界同时影响 §1、§3、§5、§7、§8 和 §10；三语言语义一致同时影响 §4、§5、§6、§8、§9 和 §13；redaction / credential / trace / error mapping 同时影响 §3、§5、§6、§7、§8、§10 和 §11；package candidate 与验证证据同时影响 §5、§6、§7、§8、§9、§10、§12 和 §13。

3. 哪些术语、编号或交叉引用需要统一？

   回答：正式文档统一使用 `L0-sdk`、`official client access layer`、`SdkSemanticBaseline`、`DerivedBindingView`、`ServiceClientView`、`BusEventClientView`、`BoundaryGuard`、`PackageCandidate`、`VerificationEvidence`、`CompatibilityDecision`、`DeprecatedApiRecord`、`SnapshotFreshnessState`、`CapabilitySupportState` 和 `PackageCandidateStatus` 等主语。不再沿用旧草案的 binding-only、wrapper-first、public registry P0、subscription truth 或 release 主线。

4. 哪些内容仍应继续保留为设计风险或待确认，而不能润色成定论？

   回答：`VerificationEvidence` 是否拆成 `EvidenceResult` 与 `EvidenceRedactionStatus`、`RequiresMigration` 进入 `Stable` 的完整门禁、`CompatibilityPolicy` 是否独立成节、`RuntimeConfig` 拆分方式、JSON 顶层结构、P0 验证目标真实服务或 fake / fixture、`OpenEventSubscription` 是否拆 stream API、上游变化 Consumer 是否拆三条具体流程，均保留在 §13。

5. 哪些细节仍应留给详细设计，而不应在整理阶段被补进来？

   回答：crate / package / module / file tree、完整 Rust / Python / TypeScript 类型、完整函数签名、完整 DTO / event schema、HTTP path、stream callback、repository trait、transaction 实现、error enum、config JSON 示例、测试矩阵、runner 命令、artifact / report 目录、commit boundary 和公共发包操作都不在 Step 14 新增。

6. 当前概要设计实际依赖了哪些参考材料，每份材料用途是什么？

   回答：实际依赖 `00-需求文档.md`、`01-架构设计.md`、`L0-core` 与 `L0-bus` 已收稳文档、概要设计书写规范、概要设计讨论 SOP、中间产物规范、全局依赖裁剪规则、子项目目录与代码文件组织规范，以及 `L0-core` / `L0-bus` / `L3-method-library` 已收稳样例。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | Step 14 处理 |
|---|---|---|
| 旧 `02-概要设计.md` | 仍是 2026-05-17 旧草案，按背景、问题、上下文、binding / wrapper / release 组织 | 删除旧文件后按新版 14 章主链重建 |
| 旧 §1~§4 | 重复需求、架构、指标和旧约束 | 改成上游关系、目标范围、结构性约束和代码主体框架 |
| 旧 §5 以后 | 以全局上下文和开发者接入说明为主 | 改为主要组成部分、关键对象、接口、处理流、状态机和配置影响 |
| 旧全文 | 无逐章校准来源 | 每个正式章节开头补 `校准来源` 和 `延伸阅读` |
| 旧全文 | 缺少详细设计承接清单 | 新增 §12 作为进入 03 的门禁 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 文档结构 | 旧版概要设计结构 | 新版 14 章主链 | 对齐当前书写规范和 SOP |
| 主语体系 | binding / wrapper / client / subscription / release | semantic baseline / derived view / service view / event view / candidate / evidence / compatibility | 对齐新版需求和架构 |
| 追溯方式 | 只引用上游文档 | 每章引用具体 `design-calibration` 中间产物 | 方便后续读者复核讨论来源 |
| 详细设计输入 | 分散且不稳定 | §12 集中列出承接清单和回退规则 | 支撑 03 详细设计一比一展开 |
| 风险处理 | 分散或未列 | §13 集中列风险与待确认事项 | 防止未确认项被写成稳定结论 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：在旧文档上局部修补 | 改动小 | 旧结构和旧主语会继续残留 | 不采用 |
| 方案 B：删除旧文档并按新文件标准重建 | 边界干净，可完整承接 Step 1~13 | 改动较大，需要分批写入和校验 | 采用 |
| 方案 C：只写摘要，所有细节跳转中间产物 | 正式文档短 | 正式概要设计本身不足以承接详细设计 | 不采用 |

### 7. 结构化中间产物

#### 7.1 正式章节回填表

| 正式章节 | 校准来源 | 回填内容 |
|---|---|---|
| §1 与上游文档的关系声明 | `02_hld_step_01_upstream_boundary.md` | 上游关系、本文不再回答、本文必须回答 |
| §2 本次设计目标与范围 | `02_hld_step_02_scope.md` | 设计目标、范围、非范围、设计深度口径 |
| §3 约束条件 | `02_hld_step_03_constraints.md` | 结构性约束、不进入本章的泛化约束、后续章节影响 |
| §4 代码主体框架总览 | `02_hld_step_04_code_subject_framework.md` | 架构模块到代码主体映射、实现分层、关键判断 |
| §5 主要组成部分、职责与边界 | `02_hld_step_05_components_boundary.md` | 七个主要组成部分、职责、对象发现和交互图 |
| §6 关键对象轮廓 | `02_hld_step_06_key_objects.md` | 对象筛选、关键对象分布、对象轮廓摘要 |
| §7 API / 接口骨架 | `02_hld_step_07_api_interface_skeleton.md` | Command / Query / Consumer / Event / Job / Port 边界 |
| §8 关键处理流 / 重要函数数据流 | `02_hld_step_08_processing_flows.md` | 独立处理流、通用只读路径、通用发布路径 |
| §9 状态定义与状态流转 | `02_hld_step_09_state_machine.md` | 状态主语、状态定义、允许 / 禁止迁移和传播 |
| §10 异常与边界场景轮廓 | `02_hld_step_10_exceptions_boundaries.md` | 异常场景、影响图、边界禁止事项 |
| §11 配置影响轮廓 | `02_hld_step_11_configuration_impact.md` | 配置影响、禁止配置化边界、03 / 04 分工 |
| §12 详细设计承接清单 | `02_hld_step_12_detail_design_handoff.md` | 稳定输入、继续展开方向、回退规则 |
| §13 设计风险与待确认事项 | `02_hld_step_13_risks_open_questions.md` | 设计风险、待确认事项、不列为风险的事项 |
| §14 参考 | Step 1~13 实际引用材料 | 参考材料和用途 |

#### 7.2 术语统一结论

- 用 `official client access layer` 表达本仓身份，不回到 binding-only 或 wrapper-only。
- 用 `SDK local truth` 表达 SDK 自己拥有的语义基线、派生视图、candidate、evidence、compatibility 和 deprecated 记录。
- 用 `formal API / fake boundary` 表达服务能力运行期接入，不把 SDK 写成 server gateway。
- 用 `bus event client view` 表达事件客户端视图，不把 SDK 写成 `L0-bus` runtime。
- 用 `PackageCandidateStatus=Stable` 表达本地稳定基线，不表达公共 registry 发布。

#### 7.3 参考材料表

| 参考材料 | 用途 |
|---|---|
| `projects/L0-sdk/00-需求文档.md` | 提供本仓定位、目标、功能需求、业务规则、数据归属、接口依赖、验收和风险 |
| `projects/L0-sdk/01-架构设计.md` | 提供职责边界、限界上下文、容器、依赖方向、数据所有权、交互方式和技术机制 |
| `projects/L0-core/00~07` | 提供共享契约、错误、trace、metadata、CloudEvents、配置和测试证据口径 |
| `projects/L0-bus/00~07` | 提供事件发布、订阅、delivery、feedback、retry、DLQ、replay、tap 和 reports 口径 |
| `standards/document/概要设计书写规范.md` | 约束正式概要设计章节、表格、ASCII 图和校准来源写法 |
| `standards/document/概要设计讨论流程_SOP.md` | 约束 Step 1~14 的讨论、确认和回填流程 |
| `standards/document/设计文档讨论中间产物规范.md` | 约束中间产物结构和逐 Step 纪律 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 约束总依赖关系在本仓的裁剪方式 |
| `standards/document/子项目目录与代码文件组织规范.md` | 作为后续详细设计和实施计划的代码组织输入 |
| `projects/L0-core/02-概要设计.md` | 参考同层级底座仓正式概要设计组织方式 |
| `projects/L0-bus/02-概要设计.md` | 参考 L0 协作仓正式概要设计组织方式 |
| `projects/L3-method-library/02-概要设计.md` | 参考已校准仓的对象、接口、流程和状态机表达粒度 |

### 8. 回填草稿

正式 `projects/L0-sdk/02-概要设计.md` 应删除旧文档后重建为 14 章主链。

本 Step 不再重复粘贴正式文档全文；正式文档在 Step 14 执行中分批写入。

### 9. 待确认事项

- 无阻塞完成正式 `02-概要设计.md` 的待确认事项。
- §13 保留的待确认项不能在 Step 14 中伪装成稳定结论。

### 10. 进入下一步条件

- [x] 正式 `02-概要设计.md` 已按 14 章主链重建。
- [x] 每章已标注具体校准来源和延伸阅读。
- [x] Step 1~13 的稳定结论已正确落位。
- [x] 风险和待确认事项仍保留在 §13。
- [x] 已通过基本格式校验。
