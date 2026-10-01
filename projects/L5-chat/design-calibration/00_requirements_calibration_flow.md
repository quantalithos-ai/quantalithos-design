# L5-chat 00 需求文档校准流程

> 文档类型：`00-需求文档.md`  
> 当前模式：`full-restart + single-agent-serial`  
> 规范来源：`standards/document/需求文档讨论流程_SOP.md`、`standards/document/需求文档书写规范.md`、`standards/document/设计文档讨论中间产物规范.md`  
> 当前状态：正式 `00` §1～§16 逐章修复与 Step 1～17 校准完成；当前 stopped，不进入 01。  
> 重要约束：只修改 `projects/L5-chat/`；不实现代码、不改 SDK 项目、不提交 commit。

## 1. 执行状态台账

| Step | 必读文档 | 输出文件 | 模块骨架 | 当前模块 | 思考记录 | 写入记录 | 自检状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Step 1 与上游文档的关系声明 | 全局规范；指定上游 `00~07`；原型停审记录；历史 Chat 文档；本项目台账 | `00_req_step_01_upstream_relation.md` | done | `upstream-source-map` | done | done | done | pass | 已吸收项目详情、项目流程、群聊绑定、公司成员目录和 BPMN 并行结构；来源层级与历史隔离明确 | 进入 Step 2（等待新授权） | `CHAT-UP-001~007` 不阻塞来源声明 |
| Step 2 本仓定位与边界 | Step 1；全局依赖规则；上游 owner 边界；原型停审记录 | `00_req_step_02_position_boundary.md` | done | `chat-product-boundary` | done | done | done | pass | 已复核项目、流程、群聊、成员目录新增边界 | 进入 Step 3 | `CHAT-UP-001~007` |
| Step 3 背景与问题定义 | Step 2；产品与历史问题材料 | `00_req_step_03_problem_context.md` | done | `product-entry-problem` | done | done | done | pass | 已区分业务、技术、安全、可靠性问题，未固化旧数字或技术方案 | 进入 Step 4 | pending |
| Step 4 目标与非目标 | Step 2~3；用户当前定位取舍 | `00_req_step_04_goals_non_goals.md` | done | `goals-and-scope` | done | done | done | pass | 目标可验证、非目标明确，未伪造指标或实现事实 | 进入 Step 5 | pending |
| Step 5 用户与角色 | Step 2、4；产品角色线索 | `00_req_step_05_users_roles.md` | done | `roles-and-contact-scenarios` | done | done | done | pass | 人类角色、系统角色和 owner 授权已分离 | 进入 Step 6 | pending |
| Step 6 使用方与依赖 | Step 1~5；全局依赖裁剪规则；SDK / owner 合同 | `00_req_step_06_consumers_dependencies.md` | done | `consumers-and-dependency-crop` | done | done | done | pass | Chat 相关依赖已按 compile / runtime / event / ref / adapter / fake 裁剪，SDK gaps 已登记 | 进入 Step 7 | `CHAT-UP-001~007` |
| Step 7 核心能力闭环 | Step 2、4、6；产品主入口目标；前置 draft/01~03 | `00_req_step_07_core_capability_loop.md` | done | `core-capability-loop` | done | done | done | pass | 四个核心能力节点、逻辑依赖、外围/边界外能力和停审条件已收敛 | 进入 Step 8 | `CHAT-UP-001~007` 影响后续精确 surface，不阻塞能力级边界 |
| Step 8 用户故事 | Step 7；角色结论 | `00_req_step_08_user_stories.md` | done | `user-stories-by-capability` | done | done | done | pass | N1～N4 核心故事、外围故事、边界外审计和跨能力审计已完成 | 进入 Step 9 | `CHAT-UP-001~007` 影响后续 exact story context |
| Step 9 功能需求 | Step 7~8；各 owner 正式能力类别 | `00_req_step_09_functional_requirements.md` | done | `functional-requirements-by-capability` | done | done | done | pass | 17 项核心功能、4 项外围增强、输入输出失败语义和故事承接已完成 | 进入 Step 10 | `CHAT-UP-001~007` |
| Step 10 业务规则与边界约束 | Step 2、4、7~9；owner 红线 | `00_req_step_10_rules_boundary_constraints.md` | done | `rules-and-boundary-constraints-by-capability` | done | done | done | pass | 28 条核心规则、4 条外围规则、功能映射和跨能力审计已完成 | 进入 Step 11 | `CHAT-UP-001~007` |
| Step 11 数据需求与数据归属 | Step 2、7、9~10；真相源闭环标准 | `00_req_step_11_data_requirements_ownership.md` | done | `data-requirements-and-ownership-by-capability` | done | done | done | pass | Chat-owned truth、safe snapshot、external ref、禁止正文和生命周期口径已完成 | 进入 Step 12 | `CHAT-UP-001~007` |
| Step 12 接口与依赖 | Step 6、9~11；L0-sdk surface | `00_req_step_12_interfaces_dependencies.md` | done | `interfaces-and-dependencies-by-capability` | done | done | done | pass | 已按 N1～N4 收敛 Chat 的 query/command/event/ref/platform seam 与 SDK 唯一接入边界，完成协议层泄漏和跨能力重复审计 | 进入 Step 13 | `CHAT-UP-001~007` |
| Step 13 非功能需求 | Step 7、9~12；端侧产品质量约束 | `00_req_step_13_non_functional_requirements.md` | done | `non-functional-requirements-by-capability` | done | done | done | pass | 六类默认非功能要求、可访问性专项、能力/全仓映射、历史阈值审计、证据边界和跨能力审计已完成 | 进入 Step 14 | `CHAT-UP-001~007`、`WS-UP-001~008` |
| Step 14 验收标准 | Step 7~13；不伪造证据规则 | `00_req_step_14_acceptance_criteria.md` | done | `acceptance-criteria-by-capability` | done | done | done | pass | 五类验收、N1～N4 停审、核心/外围功能承接、规则/数据/NFR 追溯、一票否决和证据边界已完成 | 进入 Step 15 | `CHAT-UP-001~007`、`WS-UP-001~008`、`CHAT-NF-Q-001~005` |
| Step 15 风险与待确认事项 | Step 1~14；所有 open blocker | `00_req_step_15_risks_open_questions.md` | done | `risks-and-open-questions` | done | done | done | pass | 风险与待确认两表、影响范围、当前处理口径、挂起状态和跨能力审计已完成 | 进入 Step 16 | `CHAT-UP-001~007`、`WS-UP-001~008`、`CHAT-NF-Q-001~005`、`CHAT-AC-Q-001~004` |
| Step 16 需求追溯矩阵 | Step 7~15；正式书写规范 §4.16 | `00_req_step_16_traceability_matrix.md` | done | `traceability-matrix-by-functional-requirement` | done | done | done | pass | 主矩阵、N1～N4 小循环覆盖、接口/NFR 审计、孤儿检查、重复/串线审计和不新增项检查已完成 | 进入 Step 17 | `CHAT-UP-001~007`、`WS-UP-001~008`、`CHAT-NF-Q-001~005`、`CHAT-AC-Q-001~004` |
| Step 17 正式文档装配与停审 | Step 1~16；原型逐章差异审计 | `00_req_step_17_formal_document_assembly.md` | done | `formal-document-chapter-repair` | done | done | done | stopped | 逐章回写、章节引用、核心功能定位和来源追溯修复完成 | 停止；不进入 01 | 上游合同仍 pending |

## 2. 总流程计划

需求 SOP 顺序固定为：

```text
Step 1 来源声明
  -> Step 2 定位边界
  -> Step 3 问题定义
  -> Step 4 目标非目标
  -> Step 5 用户角色
  -> Step 6 使用方依赖
  -> Step 7 核心能力闭环
  -> Step 8 用户故事
  -> Step 9 功能需求
  -> Step 10 业务规则与边界
  -> Step 11 数据归属
  -> Step 12 接口依赖
  -> Step 13 非功能
  -> Step 14 验收
  -> Step 15 风险与待确认
  -> Step 16 追溯矩阵
  -> Step 17 正式装配与停审
```

每个 Step 必须依次完成：

```text
读取输入
  -> SOP 问题回答
  -> 历史材料 / 旧文档诊断
  -> 设计取舍
  -> 结构化中间产物
  -> 复杂度判断
  -> 回填草稿
  -> 自检与门禁
```

Step 7 以后采用核心能力小循环：先固定 Chat 的能力节点，再围绕单个节点推进故事、功能、规则、数据、接口、质量和验收，最后执行跨能力追溯。不得一次性生成全仓功能大表。

## 3. 全局执行边界

| 项目 | 当前裁决 |
|---|---|
| 产品形态 | `L5-chat` 是 Web / Desktop / Mobile 的跨平台协作客户端产品，包含 UI、页面、导航、交互状态和展示层。 |
| SDK 关系 | Chat 通过 `L0-sdk` 访问各 owner 的正式能力；Chat 不重新实现通用 SDK，不直接连内部 bus 或各服务私有 API。 |
| Chat 自有真相 | 页面导航、view model、客户端 store、草稿、选择 / 展开 / 焦点、optimistic / confirmed / failed 状态、本地展示缓存和多端体验。 |
| 外部真相 | Conversation、Turn、Participant、Project、Member、Gate / Decision、Artifact、Workspace、Runtime、Observability 真相分别归正式 owner。 |
| SDK 改进登记 | 只记录 typed owner adapter、event resume / cursor、命令 receipt / idempotency、safe view、错误分类、离线 / 缓存元数据等 required capability 和 gap。 |
| 禁止行为 | 不在客户端私造业务对象、不把按钮点击当审批成功、不把 websocket / AG-UI ACK 当业务提交、不直订内部 bus、不吸收 Bridges / Runtime / Tools / Observability backend。 |
| 实施姿态 | Step 5 起写到可落码的应用、页面、路由、组件、view model、store、adapter、reducer、状态、重连、配置、测试切口和证据边界；本阶段不实现。 |

## 4. 旧材料处理计划

旧 Chat README 与 `00~06` 仅在 Step 17 进行后置差异审计，重点检查：

- 把 `AG-UI 17`、旧 SSE / WebSocket、React / Svelte / Tauri / React Native、性能数字直接当成当前合同；
- 把 `ChatThread`、`ChatReplyState`、`VisibleMemberCard` 等体验对象写成服务端业务真相；
- 把 GateCard 点击、transport ACK、stream receipt 写成治理提交成功；
- 把 workspace、runtime、artifact、observability backend 或 Bridges 能力吸收到 Chat；
- 旧文档对 `04`、`07` 文件链的顺序错误和未建立 calibration flow 的问题。

差异审计不反向修改已停审上游，也不把历史候选升级为当前需求。

## 5. 当前 Step 许可

当前只允许修改：

```text
projects/L5-chat/design-calibration/project_execution_ledger.md
projects/L5-chat/design-calibration/00_requirements_calibration_flow.md
projects/L5-chat/design-calibration/00_req_step_01_upstream_relation.md
projects/L5-chat/design-calibration/00_req_step_02_position_boundary.md
projects/L5-chat/design-calibration/00_req_step_03_problem_context.md
projects/L5-chat/design-calibration/00_req_step_04_goals_non_goals.md
projects/L5-chat/design-calibration/00_req_step_05_users_roles.md
projects/L5-chat/design-calibration/00_req_step_06_consumers_dependencies.md
projects/L5-chat/design-calibration/00_req_step_07_core_capability_loop.md
projects/L5-chat/design-calibration/00_req_step_08_user_stories.md
projects/L5-chat/design-calibration/00_req_step_09_functional_requirements.md
projects/L5-chat/design-calibration/00_req_step_10_rules_boundary_constraints.md
projects/L5-chat/design-calibration/00_req_step_11_data_requirements_ownership.md
projects/L5-chat/design-calibration/00_req_step_12_interfaces_dependencies.md
projects/L5-chat/design-calibration/00_req_step_13_non_functional_requirements.md
projects/L5-chat/design-calibration/00_req_step_14_acceptance_criteria.md
projects/L5-chat/design-calibration/00_req_step_15_risks_open_questions.md
projects/L5-chat/design-calibration/00_req_step_16_traceability_matrix.md
projects/L5-chat/draft/01_项目作用与交互对象.md
projects/L5-chat/draft/02_功能推演.md
projects/L5-chat/draft/03_模块划分与分层.md
```

本轮按用户要求逐章修复现有正式 00；Step 17 已完成，正式 00 停审。表内 Step 1～16 下一动作仅保留为本轮历史路径，当前不再授权推进。不得创建下一份正式文档或进入 01。
