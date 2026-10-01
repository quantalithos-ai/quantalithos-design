# L5-chat 01 架构设计校准流程

> 文档类型：`01-架构设计.md`  
> 当前模式：`regression-review + single-agent-serial`；前轮 full-restart 记录保留为历史材料。  
> 生成流程：`standards/document/架构设计讨论流程_SOP.md` Step 1～16  
> 结果结构：`standards/document/架构设计书写规范.md` §1～§18  
> 当前状态：本轮 Step 1～16 与正式01 §1～§18逐章回归重审完成；stopped_after_01。前轮记录保留为historical_material；不进入02。  
> 修改范围：只允许修改 `projects/L5-chat/`；不实现代码、不修改 SDK 源码、不执行测试、不提交 commit。

## 1. 执行状态台账

### 本轮逐章审查台账（2026-10-01）

本轮保持原文件与章节，逐 Step 读取、诊断、取舍、更新中间产物、回填正式章节并自检。旧表的 done/pass 为前轮记录，不能用来跳过本轮检查；尚未进入的 Step 文件不预先改写。

| Step | 回填章节 | 本轮状态 | 下一动作 |
|---|---|---|---|
| 1 | §1、基线输入 | pass | 进入 Step 2 |
| 2 | §2～§3 | pass | 进入 Step 3 |
| 3 | §4 | pass | 进入 Step 4 |
| 4 | §5 | pass | 进入 Step 5 |
| 5 | §6 | pass | 进入 Step 6 |
| 6 | §7 | pass | 进入 Step 7 |
| 7 | §8 | pass | 进入 Step 8 |
| 8 | §9 | pass | 进入 Step 9 |
| 9 | §10 | pass | 进入 Step 10 |
| 10 | §11 | pass | 进入 Step 11 |
| 11 | §12 | pass | 进入 Step 12 |
| 12 | §13 | pass | 进入 Step 13 |
| 13 | §14 | pass | 进入 Step 14 |
| 14 | §15 | pass | 进入 Step 15 |
| 15 | §16～§17 | pass | 进入 Step 16 |
| 16 | 元信息、§18、总审计 | pass | 停审，不进入 02 |

本轮全局门禁：stopped；CHAT-UP-001～009、WS-UP、OPEN-CHAT及CHAT-BASE-001继续pending/blocked/open。本轮逐Step下一动作是历史路径，当前只允许停审，不授权进入02。

### 前轮执行记录

| Step | 架构主题 | 输入 | 输出文件 | 回填章节 | 状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 确认需求基线 | 正式 `00`、需求追溯、上游 owner 边界、全局依赖规则 | `01_arch_step_01_requirements_baseline.md` | §1、§3、§16 | done | pass | 需求基线、架构硬约束、未关闭风险和回填草稿已通过自检 | 创建并执行 Step 2 | inherited blockers |
| 2 | 明确架构目标与约束 | Step 1 | `01_arch_step_02_arch_goals_constraints.md` | §2、§3 | done | pass | 9 项架构目标、12 条不可变约束、阶段取舍和非目标已通过自检 | 创建并执行 Step 3 | inherited blockers |
| 3 | 职责边界 | Step 1～2、上游 owner 边界 | `01_arch_step_03_responsibility_boundary.md` | §4 | done | pass | 做/不做/易混淆职责、红线和架构单元预分界已通过审计 | 创建并执行 Step 4 | inherited blockers |
| 4 | 系统边界与上下文 | Step 1～3、全局依赖裁剪、上游 01 | `01_arch_step_04_system_context.md` | §5 | done | pass | 系统上下文图、关系表、失效降级和边界说明已通过静态自检 | 创建并执行 Step 5 | inherited blockers |
| 5 | 限界上下文与子域划分 | Step 3～4、draft/03、客户端产品边界 | `01_arch_step_05_bounded_context_subdomains.md` | §6 | done | pass | 两个核心、三个支撑和两个本地影子结构已逐个停审；关系图、统一语言和跨上下文审计通过 | 创建并执行 Step 6；不得提前展开 Step 7 | `CHAT-UP-*`、`WS-UP-*`、`OPEN-CHAT-*`（不阻塞边界级通过） |
| 6 | 容器 / 部署架构 | Step 4～5、Desktop-first 平台决策 | `01_arch_step_06_container_deployment.md` | §7 | done | pass | 同步入口、连续性承接、本地受限状态和外部运行时边界已收敛；容器图、部署关系和通信降级通过自检 | 创建并执行 Step 7；不得提前展开 Step 8 | `CHAT-UP-*`、`WS-UP-*`、`OPEN-CHAT-*`（不阻塞容器级通过） |
| 7 | 依赖方向与层间约束 | Step 5～6、全局依赖规则、L0-sdk 边界 | `01_arch_step_07_dependency_direction.md` | §8 | done | pass | 四类依赖角色、七个架构单元停审、跨仓裁剪、禁止依赖和总审计通过 | 创建并执行 Step 8；不得提前展开 Step 9 | `CHAT-UP-*`（不阻塞依赖边界级通过） |
| 8 | 数据所有权与一致性策略 | Step 3、5、7、00 数据归属 | `01_arch_step_08_data_ownership_consistency.md` | §9 | done | pass | Chat-local truth、owner safe snapshot/ref、forbidden body/write、一致性口径和跨数据审计通过 | 创建并执行 Step 9；不得提前展开 Step 10 | `CHAT-UP-*`、`WS-UP-*`（不阻塞数据边界级通过） |
| 9 | 关键交互与通信方式 | Step 4、6、8、owner change/command 语义 | `01_arch_step_09_key_interactions_communication.md` | §10 | done | pass | 同步/异步/后台场景、正式边界、失败降级和逐单元交互停审通过 | 创建并执行 Step 10；不得提前展开 Step 11 | `CHAT-UP-*`（不阻塞通信类别级通过） |
| 10 | 关键技术选型 | Step 2、7～9、draft 平台候选 | `01_arch_step_10_key_technology_selection.md` | §11 | done | pass | 八项架构机制、正式/候选/不采用边界和 authority 审计通过 | 创建并执行 Step 11；不得提前展开 Step 12 | `CHAT-NF-Q-*`、`OPEN-CHAT-009~012`（不阻塞机制级通过） |
| 11 | 备选方案与取舍 | Step 2、10、平台路径和边界取舍 | `01_arch_step_11_alternatives_tradeoffs.md` | §12 | done | pass | 六组结构性替代路径、主线选择、牺牲/收益和不采用原因通过审计 | 创建并执行 Step 12；不得提前展开 Step 13 | platform/SDK contracts pending |
| 12 | 横切关注点 | Step 2、7～11、00 NFR/规则 | `01_arch_step_12_cross_cutting_concerns.md` | §13 | done | pass | 六类横切项、七单元适用矩阵、逐项停审和跨横切审计通过 | 创建并执行 Step 13；不得提前展开 Step 14 | `CHAT-NF-Q-*`、`OPEN-CHAT-*`（不阻塞行为级通过） |
| 13 | 演进路线 | Step 10～12、V1 Desktop-first 范围 | `01_arch_step_13_evolution_roadmap.md` | §14 | done | pass | 当前成立边界、可接受/不可接受债务、结构阶段和事实触发条件通过审计 | 创建并执行 Step 14；不得提前展开 Step 15 | upstream contracts pending |
| 14 | 风险与待确认事项 | Step 1～13 未闭合项 | `01_arch_step_14_risks_open_questions.md` | §15 | done | pass | 风险与待确认分离、影响范围、挂起口径、阻塞性和继承 blocker 审计通过 | 创建并执行 Step 15；不得提前展开 Step 16 | inherited blockers |
| 15 | ADR 与需求追溯 | Step 1～14、00 追溯矩阵 | `01_arch_step_15_adr_traceability.md` | §16、§17 | done | pass | 八项 ADR、需求追溯、追溯漏项和 A～G 跨单元总审计已完成；未新增未确认结论 | 进入 Step 16；不得进入 `02-概要设计.md` | inherited blockers |
| 16 | 整理正式文档 | Step 1～15、旧 01 historical 差异审计 | `01_arch_step_16_formal_document_assembly.md` | §1～§18 | done | pass | 旧正式文档差异审计、删除后重建、章节来源、术语统一、blocker 保留和跨架构单元静态审计均通过 | 正式 `01` 停审；等待用户明确授权后才可进入 `02-概要设计.md` | inherited blockers |

## 2. 总流程计划

```text
Step 1 需求基线
  -> Step 2 架构目标与约束
  -> Step 3 职责边界
  -> Step 4 系统边界与上下文
  -> Step 5 限界上下文与子域
  -> Step 6 容器 / 部署架构
  -> Step 7 依赖方向与层间约束
  -> Step 8 数据所有权与一致性
  -> Step 9 关键交互与通信
  -> Step 10 关键技术选型
  -> Step 11 备选方案与取舍
  -> Step 12 横切关注点
  -> Step 13 演进路线
  -> Step 14 风险与待确认事项
  -> Step 15 ADR 与需求追溯
  -> Step 16 正式文档整理与停审
```

每个 Step 必须独立完成：

```text
读取输入
  -> 回答 SOP 问题
  -> 诊断旧材料 / 边界污染
  -> 做架构取舍
  -> 形成结构化产物
  -> 判断复杂度与是否需要图表
  -> 写正式回填草稿
  -> 完成模块自检与门禁
```

Step 5、7、8、9、12、15 需要按架构单元逐个小循环推进；每个单元先停审，再进入下一个单元，最后做跨单元审计。正式 `01` 只承载已通过 Step / 模块门禁的架构结论。

## 3. 全局架构边界

| 项目 | 当前裁决 |
|---|---|
| 产品形态 | `L5-chat` 是 Desktop-first 的跨平台协作客户端产品；架构主语是共享客户端 core、页面/路由/组件、客户端状态与平台 shell。 |
| 业务接入 | `L0-sdk` 是唯一业务 query/command/event/ref 接入边界；Chat 不直连 owner 私有 API、内部 bus 或共享数据库。 |
| Chat-owned | route/context、view model、client store、draft、selection/focus、optimistic/confirmed/failed/unknown 展示姿态、展示缓存、恢复上下文和平台体验。 |
| 外部 truth | Conversation、Turn、Participant、Project、Member、Gate/Decision、Artifact、Workspace、Runtime、Observability 分别归正式 owner。 |
| 变化语义 | 只消费 SDK 提供的正式 change/event/resume；transport ACK、按钮点击、缓存命中和连接状态不构成业务确认。 |
| 平台策略 | V1 Desktop-first；Tauri Desktop shell 为当前候选，React/TypeScript shared UI/core 为候选；Web 是扩展面，Mobile 暂保留 Capacitor 候选。 |
| 设计粒度 | 架构层确定边界、运行承载角色、依赖方向、数据归属、一致性、通信类别、技术机制和演进；不定义 DTO、API path、事件 schema、代码目录、配置键或测试结果。 |

## 4. 旧材料处理口径

| 历史材料 | 处理方式 |
|---|---|
| 前轮 `projects/L5-chat/01-架构设计.md` | 本轮按用户授权逐章节回归重审；保留文件结构，旧结论须重新核对后才可保留。 |
| `projects/L5-chat/README.md`、旧 02～06 | 只做污染审计和差异对照，不直接继承技术栈、指标、协议或对象定义。 |
| `draft/01~03` | 作为已确认预推演输入；正式架构结论必须重新通过 Step 1～15。 |
| `L6-bridges` 未停审设计 | 只作为边界参考，不进入 Chat 正式输入。 |

## 5. 当前停审规则

- 本轮逐章审查台账 Step 1～16 已通过，正式 01 stopped；当前不得推进后续文档。
- Step 16 只做旧文档差异审计、已确认结论重组、术语统一、引用补齐和跨单元总审计，不新增架构判断。
- 前轮停审不代表本轮已完成；本轮结束后不进入 02，除非用户再次明确授权。
- `CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*`、`CHAT-AC-Q-*`、`OPEN-CHAT-*` 在架构中只能保持 pending / blocked / deferred / read-only / stale / unavailable / unknown 等姿态。
