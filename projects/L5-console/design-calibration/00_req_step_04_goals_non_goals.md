# Step 04 · 目标与非目标

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 04 · 目标与非目标 |
| 输出文件 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes，需求 SOP Step 4、书写规范 §4.4 与通用规范 |
| 已读取前序输入 | yes，Step 1~3、产品目标、专项 owner 边界、draft 非目标候选 |
| 模块骨架 | done：目标 / 非目标 / 范围收束 / historical 差异 |
| 进入条件 | `pass`，Step 3 已完成 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 从 Step 2~3 提取需成立的状态与边界 | done | 不先写页面或功能清单 |
| 回答目标、验证、排除、owner 交接四问 | done | 见 §4 |
| 诊断旧目标的固定功能/数字污染 | done | 见 §5 |
| 比较页面完成型、全域覆盖型、可信交互闭环型目标 | done | 见 §6 |
| 形成目标表、非目标表和范围收束 | done | 见 §7 |
| 判断复杂度 | done | 目标可单表收束，不拆附录 |
| 形成回填草稿并自检 | done | 见 §9、§11 |

## 3. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 2 | Console 只拥有客户端产品状态与交互编排，不拥有任何外部 truth。 |
| Step 3 | 需要解决边界缺失、状态/结果不可解释和上游成熟度不一三个问题。 |
| 产品叙事 | 管理者需查看状态、做关键决定并管理组织能力。 |
| 专项上游 | 所有正向业务变化必须由 owner 正式确认；部分合同继续 pending。 |
| draft 02 §6 | 提供非目标候选，须重新核验而非直接继承。 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本次需求结束后，应成立哪些状态、边界或能力？ | 应形成清晰的 Console-owned 客户端边界、正式 actor/scope/visibility 约束、跨 owner 安全查询与可解释视图、受控草稿/命令/结果反馈、治理与管理页面范围、降级/错误/可访问性要求及全链追溯。 |
| 这些目标如何验证？ | 后续故事、功能、规则、数据、接口、NFR 和验收都能回指目标；任何页面都保留 owner/source/状态边界；任何业务成功只由 owner 结果确认；pending 不被写成 ready。 |
| 哪些相关事项明确不纳入？ | 不实现代码，不定义服务端领域对象/数据库/API schema，不固定框架/阈值/指标数量，不承担 Chat/Runner/Sync 工作流，不替代外部 GRC，也不自建授权、治理、审计、归档或运行 truth。 |
| 哪些事情必须交给相邻仓或后续阶段？ | 业务规则和结果归各 owner；SDK 暴露面归 L0-sdk/owner；架构、模块、路由、组件、view model、adapter、状态机、缓存、配置和测试切口在 01~07 逐层落细；实现与测试需另行授权。 |

## 5. 当前材料与旧文档问题诊断

| 旧位置 | 旧目标/非目标 | 问题 | 当前处理 |
|---|---|---|---|
| 旧 `00` §3.1 | 4/4 员工动作、38/38 控制项、8 指标、MCP/Provider 主路径等 | 把功能清单、固定数量和未核验 owner 合同写成目标 | 改为可验证的边界与行为结果，不承诺数量 |
| 旧 `00` §3.2 | “只消费与操作六域真相” | 未区分客户端意图与正式业务变更 | 明确只提交意图并呈现 owner 结果 |
| 旧 `00` §3.2 | 不做运行时能力执行 | 正确方向但遗漏不推导 readiness、不直接控制 sandbox | 补充 owner truth 和执行边界排除 |
| draft 02 §6 | 列出 7 项候选非目标 | 边界总体合理，但尚未形成可验证目标配对 | 重新组织为正式目标/非目标表 |

## 6. 改动前后对比与设计取舍

### 6.1 改动前后对比

| 主题 | 旧口径 | 当前结论 |
|---|---|---|
| 目标单位 | 页面、动作和固定数字 | 需要成立的产品边界、状态解释和受控交互能力 |
| 成功定义 | 主路径跑通、页面刷新、指标可查 | 来源/权限/覆盖/时效/命令结果可判别且不侵占 owner truth |
| 技术范围 | 部分 API/框架/指标直接锁定 | 需求只写外部可见行为，设计实现后移 |
| 非目标 | 主要排除 Chat/IDE/runtime | 同时排除二次 truth、直连数据库、规则复制、readiness/evidence 推导 |

### 6.2 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 以“所有后台页面齐全”为目标 | 直观 | 无法验证边界正确，且受未闭口合同阻塞 | 不采用 |
| B. 以“覆盖全部上游能力”为目标 | 看似完整 | 导致范围无限扩张并把外围/blocked 能力当核心 | 不采用 |
| C. 以“可信管理交互闭环 + owner truth 不被重定义”为目标 | 可验证、可裁剪、能容纳部分/过期/未知 | 页面范围需在 Step 7~9 继续映射 | 采用 |

## 7. 结构化中间产物

### 7.1 目标表

| ID | 目标 | 说明 | 验证方式 |
|---|---|---|---|
| `G-CON-001` | 建立 Console 客户端产品边界 | 页面、导航、会话、草稿、筛选、布局、view model 与受控前端状态归 Console；业务 truth 归 owner | Step 10/11/14 不出现 Console 拥有外部 truth、数据库或服务端业务聚合 |
| `G-CON-002` | 建立正式访问语境与入口裁剪边界 | 所有受保护读取和操作均依赖正式 actor/scope/visibility/资格结果，未知或冲突不放行 | 故事、功能、规则和验收覆盖未授权、撤销、未知和冲突姿态 |
| `G-CON-003` | 建立 owner-safe 查询与可解释视图 | 管理页面能保留来源、可见性、覆盖、时效、可用性和一致性，不将 missing/partial/stale 压成成功 | 数据/接口/NFR/验收均能区分空、缺失、部分、过期、不可用和冲突 |
| `G-CON-004` | 建立受控管理意图与结果确认边界 | 草稿、本地校验、确认、提交、receipt 与 owner result 分层，只有正式确认才显示业务完成 | 功能、规则和验收明确 accepted/pending/rejected/unknown 不等于 confirmed |
| `G-CON-005` | 覆盖组织治理与管理入口的需求范围 | 员工、项目/workspace、方法、Governance、审计/指标、Capability、Archive 和受限 Sandbox 状态有可裁剪入口定义 | 每个正式纳入页面族都有 owner、能力/故事/功能和边界验收映射；blocked 面不伪装 ready |
| `G-CON-006` | 建立安全降级与可访问体验底线 | 权限不足、依赖故障、部分/过期数据、未知结果和高风险操作均有可理解、可恢复、键盘/读屏可达的表现 | NFR/验收覆盖文本语义、焦点、错误摘要、危险确认、安全遮蔽和恢复路径 |
| `G-CON-007` | 建立可追溯且可继续设计的需求基线 | 所有正式需求能从目标追到故事、功能、规则、数据、接口、NFR 和验收；pending 显式保留 | Step 16 无孤儿项；Step 17 每章有具体 calibration 来源且不伪造实现事实 |

### 7.2 非目标表

| ID | 非目标 | 不做原因 / 正确归属 |
|---|---|---|
| `NG-CON-001` | 拥有或重定义成员、项目、工作、过程、治理、制品、workspace、方法、能力、观测、归档或隔离 truth | 分别归 L1/L2/L3/L4 正式 owner |
| `NG-CON-002` | 直接连接数据库、内部仓储或私有服务，或绕过 SDK/正式服务边界 | 会绕过 owner visibility、Policy/Gate 与审计边界 |
| `NG-CON-003` | 在前端复制 RBAC、Policy、Gate、审批、合规、指标或 readiness 规则 | 客户端不得成为第二规则/裁决来源 |
| `NG-CON-004` | 把 UI、HTTP、toast、缓存或 optimistic 状态当业务提交成功 | 正式完成必须来自 owner committed result |
| `NG-CON-005` | 自建审计哈希链、证据、治理报告、Archive Bundle 或 sandbox 执行 | 分别归 Observability/Artifact/Governance/Archive/Sandbox 等 owner |
| `NG-CON-006` | 承担 Chat 日常协作、Runner 执行、Sync 本地同步或 Marketplace 交易 | 属其他 L5/L6 产品；未停审内容不作为本仓真相 |
| `NG-CON-007` | 在需求阶段固定前端框架、图表库、API path、DTO、数据库、代码目录、缓存 TTL、指标数量或性能阈值 | 需在后续设计/配置/测试阶段基于正式 authority 收敛 |
| `NG-CON-008` | 实现代码、执行测试、生成证据或宣称集成/readiness | 当前授权仅覆盖设计仓正式 00；实现和真实验证不在范围 |

### 7.3 范围收束

```text
in scope:
  trusted context + navigation + owner-safe read/view
  + controlled draft/intent + owner result presentation
  + governance/management entry surfaces
  + degraded/error/a11y posture

out of scope:
  external truth + local authorization/rule engine
  + direct storage/service access + execution/evidence/readiness
  + implementation technology and runtime proof
```

## 8. 复杂度判断

七项目标形成一条“客户端边界 → 可信访问 → 安全读取 → 受控操作 → 页面范围 → 韧性 → 追溯”链，不需要拆附录。页面族只是 `G-CON-005` 的范围验证对象，不能在本 Step 展开为功能清单。

## 9. 回填草稿

正式 §4 使用 §7.1、§7.2 两表；范围收束以一段短文表达。所有 ID 保持 `G-CON-*` / `NG-CON-*`，不写固定数量、接口或技术方案。

## 10. 待确认事项

| ID | 待确认事项 | 当前处理口径 | 当前状态 |
|---|---|---|---|
| `CON-Q-004` | 可量化性能/效率 baseline 缺失 | 不阻塞需求边界；不设伪阈值，后续由 NFR/测试 authority 补充 | `open / non_blocking_for_step_5` |
| `CON-Q-005` | Archive/Sandbox/部分管理命令何时成为正向可用入口 | 作为范围内受控/只读入口需求，但 readiness 与正向动作受 owner blocker 控制 | `open / blocks_positive_integration_claim_only` |

## 11. 自检

| 检查项 | 结果 |
|---|---|
| 每个目标是否描述状态/边界/能力而非页面名或 API | pass |
| 每个目标是否有验证方式 | pass |
| 非目标是否具体且有 owner/原因 | pass |
| 是否排除直连、规则复制、UI 成功推导和 readiness 伪造 | pass |
| 是否未固定 38 控制项、8 指标、Provider Contract、框架或阈值 | pass |
| 是否未提前写功能、接口或实现方案 | pass |
| 是否发现阻塞 Step 5 的 blocker | no |

## 12. 三层门禁

| 层级 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| Step / 模块级 | `pass` | 目标可验证、非目标具体、范围与 owner 清楚，历史固定目标已降级 | 更新 flow，激活 Step 5 | 本文件；Step 2~3；书写规范 §4.4 |
| 文档级 | `pass_to_step_05` | 目标/非目标足以约束角色识别和后续能力范围 | 创建并完成 `00_req_step_05_users_roles.md` | Step 2；本文件 |
| 项目级 | `pass_with_open_upstream_pending` | pending 只限制正向集成，不阻塞角色与依赖讨论 | 进入 Step 5；正式 00 仍不可写 | 项目台账；需求 flow |
