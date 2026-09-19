# L5-console 02 概要设计校准流程

> 对应正式文档：`projects/L5-console/02-概要设计.md`  
> 对应流程：`standards/document/概要设计讨论流程_SOP.md`（Step 1～14）  
> 模式：`full-restart + single-agent-serial`  
> 授权：用户已明确授权完成全部 `02`。  
> 当前状态：Step 14 `formal_stop_review`；对象独立定义和台账一致性复核已完成，未进入 `03`。

## 1. 执行边界

- 只修改 `projects/L5-console/` 下正式文档、`design-calibration/` 中间产物和项目级设计台账。
- 不实现代码、不运行项目测试、不生成真实 baseline、commit、run、artifact、report、evidence、verdict、signoff 或 readiness，不提交 commit。
- 旧 `README.md`、旧正式 `02/03/05/06`、`draft/` 与历史 ADR 仅作 `historical_material` 和污染审计输入；不直接继承。
- `00-需求文档.md` 与 `01-架构设计.md` 是当前正式上游；上游 owner 的 exact query/command/result/ref、scope、visibility、safe-field、reconciliation、activation、量化 authority 和外围产品合同未闭口时，保持 `pending/blocked/read-only/partial`。
- Console 只拥有客户端交互 truth：会话壳、导航、筛选/布局、草稿、请求经历、错误/恢复、可访问性呈现和有限偏好；不得拥有或重定义成员、项目、流程、治理、制品、workspace、方法、能力、观测、归档或 sandbox truth。

## 2. 三层门禁与写入纪律

每个 Step 均按以下顺序落盘：读取台账和输入 → 问题回答 → 当前材料诊断 → 设计取舍 → 结构化中间产物 → 回填草稿 → 待确认事项 → 自检与门禁。Step 5～9 另按主要组成部分逐项停审，再做跨部分审计。

| 门禁层 | 允许状态 | 本项目要求 |
|---|---|---|
| 项目级 | `in_progress` / `blocked` / `formal_stop_review` | `project_execution_ledger.md` 当前恢复点必须指向本 flow 和当前 Step。 |
| 文档级 | `pending` / `in_progress` / `formal_stop_review` | 当前 Step 完成前不得进入下一 Step；Step 14 后立即停审。 |
| Step / 模块级 | `in_progress` / `blocked` / `pass` | 思考记录、自检完成后才允许写回填草稿；正式正文只在 Step 14。 |

单次 patch 以可审查批次为准，不把 100～300 行误写成文件长度上限。未来 Step 文件不得提前创建；只有当前 Step 真正启动时才创建或改写。

## 3. 总流程计划与状态台账

| Step | 主题 | 输入 | 输出文件 | 状态 | 当前模块 | gate_status | 下一动作 |
|---|---|---|---|---|---|---|---|
| 1 | 确认上游输入边界 | 正式 00/01、专项上游当前正式文档/台账、旧 02 污染审计 | `02_hld_step_01_upstream_boundary.md` | `done` | `self_reviewed` | `pass` | 进入 Step 2，明确设计目标与当前范围 |
| 2 | 本仓设计目标与当前范围 | Step 1、00 §4/7/9、01 §2/6/14 | `02_hld_step_02_scope.md` | `done` | `self_reviewed` | `pass` | 进入 Step 3，收稳结构性约束 |
| 3 | 收稳约束条件 | Step 2、00 §10/11/12/13、01 §3/8/9/10/13 | `02_hld_step_03_constraints.md` | `done` | `self_reviewed` | `pass` | 进入 Step 4，映射代码主体框架 |
| 4 | 代码主体框架映射 | Step 3、01 §6～§11 | `02_hld_step_04_code_subject_framework.md` | `done` | `self_reviewed` | `pass` | 进入 Step 5，逐主要组成部分收敛职责与边界 |
| 5 | 主要组成部分、职责与边界 | Step 4、00 §7/9、01 §6/9/10 | `02_hld_step_05_components_boundary.md` | `done` | `self_reviewed` | `pass` | 进入 Step 6，逐部分正式化关键对象 |
| 6 | 关键对象轮廓 | Step 5 对象候选池、闭环标准 | `02_hld_step_06_key_objects.md` + 当前需要的对象附录 | `done` | `self_reviewed` | `pass` | 进入 Step 7，按组成部分收敛 Command/Query/Event/Job |
| 7 | API / 接口骨架 | Step 6、Step 5 接缝、01 §10 | `02_hld_step_07_api_interface_skeleton.md` | `done` | `self_reviewed` | `pass` | 进入 Step 8，按主要组成部分画关键处理流 |
| 8 | 关键处理流 / 重要函数数据流 | Step 7、Step 6、00 核心故事 | `02_hld_step_08_processing_flows.md` | `done` | `self_reviewed` | `pass` | 进入 Step 9，逐状态主语收敛并审计传播边界 |
| 9 | 状态机与状态流转 | Step 6～8、00 §10/13 | `02_hld_step_09_state_machine.md` | `done` | `self_reviewed` | `pass` | 进入 Step 10，点名改变主线的异常与边界 |
| 10 | 异常与边界场景轮廓 | Step 8/9、00 §14、01 §5/9/10 | `02_hld_step_10_exceptions_boundaries.md` | `done` | `self_reviewed` | `pass` | 进入 Step 11，识别配置影响与不可配置红线 |
| 11 | 配置影响轮廓 | Step 4～10、01 §13 | `02_hld_step_11_configuration_impact.md` | `done` | `self_reviewed` | `pass` | 进入 Step 12，整理稳定主语与详细设计展开方向 |
| 12 | 详细设计承接清单 | Step 4～11 | `02_hld_step_12_detail_design_handoff.md` | `done` | `self_reviewed` | `pass` | 进入 Step 13，区分设计风险与待确认事项 |
| 13 | 设计风险与待确认事项 | Step 4～12、项目/专项台账 | `02_hld_step_13_risks_open_questions.md` | `done` | `self_reviewed` | `pass` | 进入 Step 14，仅做正式文档重组/润色/追溯 |
| 14 | 整理正式概要设计文档 | Step 1～13、概要设计书写规范 | `02_hld_step_14_formal_document_assembly.md` + 重建正式 `02-概要设计.md` | `done` | `self_reviewed` | `formal_stop_review` | 等待用户明确授权进入 03 |

## 4. 稳定输入与专项上游裁剪

| 输入 | 用途 | 当前上限 |
|---|---|---|
| `projects/L5-console/00-需求文档.md` | 承接 C-CON-1～6、FR/BR/DR/IF/DEP/NFR/AC/VETO 与 CON-Q-034～047 | 只转译结构，不重复需求。 |
| `projects/L5-console/01-架构设计.md` | 承接客户端边界、owner 分区、SDK-only、局部降级、数据/通信/横切约束 | 不重开架构、技术选型或 ADR。 |
| `projects/L0-sdk/` | 官方访问边界、query/command/result/ref 消费原则 | exact surface 未核验不写方法、路径或 schema。 |
| `projects/L1-identity/`、`L1-work/`、`L1-process/`、`L1-governance/`、`L1-artifact/` | identity/member、work/process、治理/evidence 的 owner 边界和安全消费线索 | 不把 owner 对象、状态机或正文复制为 Console 对象。 |
| `projects/L1-workspace/`、`L2-member-service/` | Workspace safe read、成员宿主和 scope 相关边界 | 消费合同与执行语义 pending。 |
| `projects/L3-method-library/`、`L3-capability-hub/` | 方法资产、能力注册/访问复核的 owner 入口线索 | 正向 activation 与 exact result/ref pending。 |
| `projects/L4-observability/`、`L4-sandbox/`、`L4-archive/` | 观测、Sandbox、Archive 的只读状态/引用边界 | 不生成 audit/evidence/readiness，也不执行归档/sandbox。 |
| `projects/L1-workspace/draft/` 与本仓 `draft/` | 粒度参考、候选术语、污染审计 | 不作为真相源；固定数字、技术栈、Provider Contract、旧事件和旧页面模型不得回流。 |

## 5. 持续 blocker / pending 传递

| 主题 | 影响 | 02 处理 |
|---|---|---|
| Owner exact query/command/result/ref 与 activation | §7～§9 的精确接口、流、状态 | 只写能力级骨架；相关主题 `pending/blocked/read-only/partial`。 |
| Tenant/organization/project scope | 会话锚定、直接入口和切换 | 只承接外部 scope ref；不可验证即 `fail-closed`。 |
| Visibility/资格/reason/redaction | 最小披露和动作姿态 | 客户端只能收紧；unknown/撤销/冲突不得放行。 |
| Freshness/coverage/availability/consistency | 视图、缓存、错误和导出 | 按 owner 保留多轴，不合成健康/合规/readiness。 |
| Unknown reconciliation/幂等 | 受控意图恢复 | 无正式依据不自动重放；保持 `unknown/blocked`。 |
| 客户端状态生命周期/介质 | 草稿、偏好、请求经历和失效 | 只定义交互 truth 上限，不固定 TTL、设备同步或持久化实现。 |
| 性能、可用率、兼容矩阵、诊断 envelope | 量化、测试、验收和配置 | 采用行为级有界口径，不写无 authority 数字。 |
| 未停审 L5/L6 链接/引用合同 | 外围导航和跨产品协作 | 仅记录 pending，不复制私有状态。 |

## 6. 历史材料后置污染审计入口

Step 1 先独立确认正式 00/01 输入；旧材料只在本 Step 的诊断中记录：

- `ConsoleWorkspace`、`PanelState`、`CrossPanelContext`、`UnifiedDashboard` 等只能作为客户端状态候选，不能升级为服务端 truth、数据库、projection、事件族或治理中心。
- React/Svelte/Tailwind、固定组件库、Provider Contract、固定控制项/指标数量、首屏/P95/SLA、旧 API path/DTO/数据库/私有 bus 均无当前 authority。
- Chat/Runner/Sync/Marketplace/Bridges 等未停审项目不提供当前真相；只保留未来正式 link/ref 候选。
- 页面日志、toast、transport success、缓存命中、feature flag、fake 或 mock 不得成为正式结果、权限、审计、evidence 或 readiness 证明。

## 7. 正式装配门禁

Step 14 已完成：正式 `02-概要设计.md` 已按 §1～§14 重建，每章保留校准来源和延伸阅读，并完成对象/接口/流程/状态/风险/历史污染审计。项目级、文档级和 Step 级均为 `formal_stop_review`；当前不创建或进入 03，不改变其他项目。

## 8. Step 14 停审记录

| 项 | 结果 |
|---|---|
| 正式文档 | `projects/L5-console/02-概要设计.md` 已完成 14 章装配。 |
| 对象粒度 | §6 关键对象已逐对象成节；引用、history、view、guard 辅助家族的省略原因已在正文说明。 |
| 总审计 | 章节顺序、来源追溯、交叉引用、历史污染、owner truth、forbidden body、unknown、a11y 和事实诚实均通过。 |
| Pending | `CON-Q-034～047` 继续保持 `open/pending`，按 Step 13 阻塞范围传递。 |
| 停审动作 | 正式 02、Step 14、flow、项目台账均切换 `formal_stop_review`；`formal_03_write_allowed = false`。 |
