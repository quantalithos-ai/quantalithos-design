## Step 14. 整理正式概要设计文档

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 14
- 回填章节：`projects/L0-bus/02-概要设计.md` 全文

### 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 1 ~ Step 13 | 已确认的上游边界、范围、约束、代码主体框架、主要组成部分、关键对象、接口、处理流、状态机、异常、配置影响、详细设计承接和风险 |
| 书写规范 | `standards/document/概要设计书写规范.md` 14 章正式主链 |
| 讨论 SOP | `standards/document/概要设计讨论流程_SOP.md` Step 14 |
| 旧正式文档 | `projects/L0-bus/02-概要设计.md` v0.1.0，只作为替换前诊断材料 |

### 3. SOP 问题回答

1. 哪些已确认结论应分别回填到哪些正式章节？

   回答：Step 1 回填 §1，Step 2 回填 §2，Step 3 回填 §3，Step 4 回填 §4，Step 5 回填 §5，Step 6 回填 §6，Step 7 回填 §7，Step 8 回填 §8，Step 9 回填 §9，Step 10 回填 §10，Step 11 回填 §11，Step 12 回填 §12，Step 13 回填 §13，参考材料回填 §14。

2. 哪些结论需要拆分吸收到多个章节，而不是机械复制？

   回答：`L0-core` 契约边界同时影响 §1、§3、§5、§6 和 §10；read-only output 不反写同时影响 §3、§5、§7、§8、§9、§10 和 §11；配置影响既在 §11 独立收口，也在 §12 交付给详细设计继续展开。

3. 哪些术语、编号或交叉引用需要统一？

   回答：正式文档统一使用 `publication acceptance`、`delivery`、`feedback`、`recovery`、`read-only output`、`backend capability`、`bus truth`、`projection`、`audit / history` 等主语，不再沿用旧文档中以 envelope / topic / callback schema 为核心的主语。

4. 哪些内容仍应继续保留为设计风险或待确认，而不能润色成定论？

   回答：late ack、projection missing 自动 rebuild、backend capability 变化是否重调度、`RequestRetry` 是否改变 delivery 状态、`PrepareReplay` 是否一步到 ready、是否定义 `BackendCapabilityStatus`、`PublicationRejectedEvent` 是否传播、`GetPublicationAcceptance` 是否保留独立 Query 等保留在 §13。

5. 哪些细节仍应留给详细设计，而不应在整理阶段被补进来？

   回答：Rust crate / module / file tree、完整 struct / enum / trait、完整 DTO / schema、HTTP path、topic、数据库表、索引、事务实现、错误码全集、adapter SDK 调用、配置 JSON 示例、测试矩阵和实施计划都不在 Step 14 新增。

6. 当前概要设计实际依赖了哪些参考材料，每份材料用途是什么？

   回答：实际依赖 `00-需求文档.md`、`01-架构设计.md`、`L0-core` 已收稳文档、概要设计书写规范、概要设计讨论 SOP、中间产物规范、全局依赖裁剪规则、子项目目录与代码组织规范，以及 L0-core / L3-method-library 的已收稳样例。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | Step 14 处理 |
|---|---|---|
| 旧 `02-概要设计.md` | 仍按旧版主链组织，重复背景、上下文和旧 envelope 主语 | 删除旧文件后按新版 14 章主链重建 |
| 旧 §1~§4 | 重复需求与架构内容 | 改成上游关系、目标范围、约束和代码主体框架 |
| 旧 §5~§9 | 未按最新 Step 5~9 的对象、接口、流程、状态机粒度展开 | 直接承接已确认中间产物 |
| 旧全文 | 无校准来源入口 | 每个正式章节开头补 `校准来源` 和 `延伸阅读` |
| 旧全文 | 未包含配置影响轮廓和详细设计承接清单 | 新增 §11 和 §12 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 文档结构 | 旧版概要设计结构 | 新版 14 章主链 | 对齐当前书写规范和 SOP |
| 主语体系 | envelope / command / callback / topic | publication / delivery / feedback / recovery / read-only output | 对齐新版需求和架构 |
| 追溯方式 | 只引用上游文档 | 每章引用具体 `design-calibration` 中间产物 | 方便后续读者复核讨论来源 |
| 详细设计输入 | 分散且不稳定 | §12 集中列出承接清单和回退规则 | 支撑 03 详细设计一比一展开 |
| 风险处理 | 分散或未列 | §13 集中列风险与待确认事项 | 防止未确认项被写成稳定结论 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：在旧文档上局部修补 | 改动小 | 旧结构会继续限制新版主链，旧主语容易残留 | 不采用 |
| 方案 B：删除旧文档并按新文件标准重建 | 边界干净，可完整承接 Step 1~13 | 改动较大，需要分批写入和校验 | 采用 |
| 方案 C：只写摘要，所有细节跳转中间产物 | 正式文档短 | 正式概要设计本身不足以承接详细设计 | 不采用 |

### 7. 结构化中间产物

#### 7.1 正式章节回填表

| 正式章节 | 校准来源 | 回填内容 |
|---|---|---|
| §1 与上游文档的关系声明 | `02_hld_step_01_upstream_boundary.md` | 上游关系、本文不再回答、本文必须回答 |
| §2 本次设计目标与范围 | `02_hld_step_02_scope.md` | 设计目标、非范围、设计深度口径 |
| §3 约束条件 | `02_hld_step_03_constraints.md` | 结构性约束和对后续章节影响 |
| §4 代码主体框架总览 | `02_hld_step_04_code_subject_framework.md` | 代码主体映射图、实现分层图、关键判断 |
| §5 主要组成部分、职责与边界 | `02_hld_step_05_components_boundary.md` | 六个主要组成部分、对象发现线索、交互图和边界 |
| §6 关键对象轮廓 | `02_hld_step_06_key_objects.md` | 对象候选池、关键对象独立小节、对象反查 |
| §7 API / 接口骨架 | `02_hld_step_07_api_interface_skeleton.md` | Command / Query / Consumer / Event / Job / Port 边界 |
| §8 关键处理流 / 重要函数数据流 | `02_hld_step_08_processing_flows.md` | 独立处理流、Query 通用读路径、Outbound Event 通用发布路径 |
| §9 状态定义与状态流转 | `02_hld_step_09_state_machine.md` | 状态所有权、状态定义、迁移图、允许 / 禁止迁移 |
| §10 异常与边界场景轮廓 | `02_hld_step_10_exceptions_boundaries.md` | 异常场景、异常影响图、边界红线 |
| §11 配置影响轮廓 | `02_hld_step_11_configuration_impact.md` | 配置影响、禁止配置化边界、详细设计承接 |
| §12 详细设计承接清单 | `02_hld_step_12_detail_design_handoff.md` | 稳定输入、继续展开方向、回退规则 |
| §13 设计风险与待确认事项 | `02_hld_step_13_risks_open_questions.md` | 设计风险、待确认事项、不列为风险的事项 |
| §14 参考 | Step 1~13 实际引用材料 | 参考材料和用途 |

#### 7.2 术语统一结论

- 用 `L0-bus` 作为事件传递主干仓，不称其为共享 envelope 契约仓。
- 用 `L0-core` 承接 Event、Error、TraceContext、Metadata、ActorRef、CloudEvents schema 等共享契约。
- 用 `bus truth` 表达 publication acceptance、delivery、feedback、retry、DLQ、replay preparation、audit / history 等本仓真相。
- 用 `projection / read-only output` 表达派生视图，不允许其反写 truth。
- 用 `BackendCapabilityRef` / `BackendCapabilityPolicy` 表达后端能力边界，不把具体 MQ 产品状态写成平台状态。

#### 7.3 参考材料表

| 参考材料 | 用途 |
|---|---|
| `projects/L0-bus/00-需求文档.md` | 提供本仓定位、功能需求、业务规则、数据归属、验收和风险 |
| `projects/L0-bus/01-架构设计.md` | 提供职责边界、限界上下文、容器、依赖方向、数据所有权和技术选择 |
| `projects/L0-core/00~07` | 提供上游共享契约、事件包络、metadata、outbox 和实现口径 |
| `standards/document/概要设计书写规范.md` | 约束正式概要设计章节和图表格式 |
| `standards/document/概要设计讨论流程_SOP.md` | 约束 Step 1~14 的讨论和回填流程 |
| `standards/document/设计文档讨论中间产物规范.md` | 约束中间产物结构和逐 Step 纪律 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 约束总依赖关系在本仓的裁剪方式 |
| `standards/document/子项目目录与代码文件组织规范.md` | 作为后续详细设计和实施计划的代码组织输入 |
| `projects/L0-core/02-概要设计.md` | 参考同层级底座仓正式概要设计组织方式 |
| `projects/L3-method-library/02-概要设计.md` | 参考已校准仓的对象、接口、流程和状态机表达粒度 |

### 8. 回填草稿

正式 `projects/L0-bus/02-概要设计.md` 应删除旧文档后重建为 14 章主链。

本 Step 不再重复粘贴正式文档全文；正式文档已在 Step 14 执行中分批写入。

### 9. 待确认事项

- 无阻塞完成正式 `02-概要设计.md` 的待确认事项。
- §13 保留的待确认项不能在 Step 14 中伪装成稳定结论。

### 10. 进入下一步条件

- 正式 `02-概要设计.md` 已按 14 章主链重建。
- 每章已标注具体校准来源和延伸阅读。
- Step 1~13 的稳定结论已正确落位。
- 风险和待确认事项仍保留在 §13。
- 已通过基本格式校验。
