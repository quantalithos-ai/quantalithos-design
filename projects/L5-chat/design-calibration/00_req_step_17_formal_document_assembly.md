# Step 17 · 正式文档装配与停审

> 状态：`装配完成，正式文档停审通过`  
> 对应正式文档：`00-需求文档.md`  
> 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 17  
> 对应书写规范：`standards/document/需求文档书写规范.md` §2.2、§2.3 与正式章节规范  
> 输入：Step 1～16 已通过的 calibration 文件，以及旧 `00-需求文档.md` 的 historical 差异审计。  
> 本步只重组、润色和装配已确认结论，不新增需求、接口、指标、实现、测试或 readiness。

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 17 · 正式文档装配与停审 |
| 输出文件 | `00-需求文档.md`、本文件 |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes；需求 SOP Step 17、正式文档结构/校准来源规则与中间产物规范 |
| 已读取前序输入 | yes；Step 1～16 全部通过的 calibration 文件、项目台账和旧 `00` historical 材料 |
| 装配动作 | 已完成旧 `00` 差异审计；已删除旧正式文件并按 Step 1～16 重建；已完成章节来源、编号、边界和交叉引用审计 |
| 停审条件 | 已满足：每个正式章节均有 calibration 来源；能力级停审和跨能力追溯无遗留阻塞；open contract 仍显式保留为风险/待确认 |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 完成旧 `00` historical 差异审计 | done | 见 §5 |
| 删除旧正式 `00`，禁止直接沿用旧内容 | done | 见 §6 |
| 按正式 16 章结构装配 Step 1～16 结论 | done | `00-需求文档.md` |
| 为每章写入逐行 calibration 来源和延伸阅读 | done | `00-需求文档.md` 各章开头 |
| 统一当前编号、术语、pending/blocked 状态和 owner 边界 | done | `00-需求文档.md` 全文 |
| 完成静态交叉引用、孤儿/越界和历史污染审计 | done | 见 §7、§8、§10 |
| 完成正式文档停审，禁止进入 `01` | done | 见 §11、§12 |

## 3. 装配原则

1. 正式文档只承载 Step 1～16 已确认的结论；推理、旧材料诊断、取舍过程和详细审计留在 `design-calibration/`。
2. 正式目录采用 `1～16` 章：关系声明、定位边界、问题、目标、用户角色、使用方/依赖、核心能力、故事、功能、规则、数据、接口、非功能、验收、风险/待确认、追溯矩阵。
3. 每章正文开始前列出对应 calibration 文件，并给出“延伸阅读”；不使用“见 Step 1～3”这类合并引用。
4. 只有 owner safe view/ref/result、Chat-local state 和能力级状态进入正文；Conversation、Governance、Artifact、Workspace、Runtime、Observability truth 不转移到 Chat。
5. `CHAT-UP-*`、`WS-UP-*`、`CHAT-NF-Q-*`、`CHAT-AC-Q-*`、`OPEN-CHAT-*` 只能以 pending/blocked/read-only/stale/unavailable/unknown 风险姿态出现，不能被润色成 ready。
6. 不在正式文档写 API path、DTO、JSON/proto、topic、数据库表、代码目录、监控配置、测试步骤、运行结果、evidence、verdict、signoff、readiness 或 commit。

## 4. 正式章节与校准来源映射

| 正式章节 | 主要校准来源 |
|---|---|
| §1 与上游文档的关系声明 | `design-calibration/00_req_step_01_upstream_relation.md` |
| §2 本仓定位与边界 | `design-calibration/00_req_step_02_position_boundary.md` |
| §3 背景与问题定义 | `design-calibration/00_req_step_03_problem_context.md` |
| §4 目标与非目标 | `design-calibration/00_req_step_04_goals_non_goals.md` |
| §5 用户与角色 | `design-calibration/00_req_step_05_users_roles.md` |
| §6 使用方与依赖 | `design-calibration/00_req_step_06_consumers_dependencies.md` |
| §7 核心能力闭环 | `design-calibration/00_req_step_07_core_capability_loop.md` |
| §8 用户故事 | `design-calibration/00_req_step_08_user_stories.md` |
| §9 功能需求 | `design-calibration/00_req_step_09_functional_requirements.md` |
| §10 业务规则与边界约束 | `design-calibration/00_req_step_10_rules_boundary_constraints.md` |
| §11 数据需求与数据归属 | `design-calibration/00_req_step_11_data_requirements_ownership.md` |
| §12 接口与依赖 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| §13 非功能需求 | `design-calibration/00_req_step_13_non_functional_requirements.md` |
| §14 验收标准 | `design-calibration/00_req_step_14_acceptance_criteria.md` |
| §15 风险与待确认事项 | `design-calibration/00_req_step_15_risks_open_questions.md` |
| §16 需求追溯矩阵 | `design-calibration/00_req_step_16_traceability_matrix.md` |

## 5. 旧正式 `00` historical 差异审计

| 旧内容 | 问题 | 装配处理 |
|---|---|---|
| 旧文档将 Chat 描述为承载六域业务对象、员工登录、项目进度和治理总入口 | 把展示/入口层写成 owner truth 或相邻产品能力，并与当前 Chat 边界冲突。 | 删除对象生命周期和管理真相，改写为 safe view/ref、入口、状态和受控意图；正式 owner 保持外置。 |
| group/channel/dm/thread、Turn kind、AG-UI 17、SSE/WebSocket 被当成当前合同 | 将体验分类或传输机制固定为需求真相，绕过 SDK surface。 | 保留对话入口和 Turn 可理解展示目标；具体 transport 改为 SDK formal event/resume 能力，协议后移。 |
| GateCard 点击、HTTP/stream ACK、toast 或刷新被视为审批成功 | 违反 Governance truth、receipt/result、unknown 和幂等边界。 | 采用 `submitted/pending/confirmed/rejected/failed/unknown`，只有 owner result 可收口。 |
| 旧目标含 `<2s`、`≥99.9%`、`500+`、后端 P95 和 owner SLA | 缺少当前 authority、场景、测量边界，且越权替 owner 承诺。 | 仅保留行为级性能/可用性口径，数字列为历史污染和待确认。 |
| 旧依赖表直接写 RPC/proto/package、私有服务和 `sdk-core/sdk-events` | 违反 L0-sdk 唯一应用接入边界和需求层粒度。 | 只保留能力级 query/command/event/ref/platform seam 与 blocker。 |
| 旧数据章节把 Conversation、Turn、Gate、Project、Member、Artifact 当作 Chat 核心实体并规定缓存/保留期 | 转移 truth ownership，且把配置/实现细节写入需求。 | 重建为 Chat-owned local state、owner safe snapshot、external ref、forbidden body 四类。 |
| 旧非目标/功能包含 console、runner、process、ImplementationPlan、员工运行上下文和完整离线工作流 | 吸收相邻项目或未经确认的外围能力，扩大 V1。 | 归为边界外、外围增强或风险/待确认，不进入核心闭环。 |
| 旧验收和风险写入 E2E、命令、RUM、监控、baseline、run 或固定负责人/截止时间 | 把测试方案、运行事实和实施计划提前写入需求。 | 正式 `00` 只保留可判断验收条件、一票否决、风险和挂起状态。 |
| 旧追溯矩阵只有旧 US/F 与后续文档待办 | 无法连接当前能力、规则、数据、NFR、接口和验收。 | 用 Step 16 的 `F-CHAT-*` 主矩阵重建，保留 open contract 状态。 |

## 6. 旧文件删除与重建记录

- 旧 `projects/L5-chat/00-需求文档.md` 已作为 `historical_material` 完成读取与差异审计。
- 旧正式文件内容不直接沿用；装配使用 Step 1～16 的回填草稿和已通过门禁的结构化结论。
- 已删除旧正式文件并重建同路径的新 `00-需求文档.md`。
- 本动作没有修改 `projects/L5-chat/` 之外的正式文档、SDK 源码或其他项目。
- 未创建代码、测试运行、artifact、report、evidence、commit 或 readiness 记录。

## 7. 装配后静态审计计划与结果

| 检查项 | 结果 | 说明 |
|---|---|---|
| 章节是否完整覆盖正式 16 章结构 | pass | §1～§16 均存在且顺序固定。 |
| 每章是否有逐行 calibration 来源和延伸阅读 | pass | 每章开头均列对应 `design-calibration/00_req_step_*`。 |
| 是否将旧内容直接复制进正文 | pass | 旧 AG-UI/传输、旧数字、旧对象、私有 API 和相邻项目能力已排除。 |
| 是否保留四个核心能力及外围/边界外划分 | pass | N1～N4、外围增强和边界外能力在 §7、§9、§15、§16 可追溯。 |
| 是否保留 owner truth、SDK-only、禁止正文、ACK/unknown、cache-not-authority 红线 | pass | §2、§6、§10～§15 交叉覆盖。 |
| 是否写入协议、实现、测试步骤或执行结果 | pass | 正式正文只保留能力、规则、质量和验收条件。 |
| 是否将 pending/blocked 伪装成 ready | pass | §12～§16 明确保留 pending、blocked、read-only、stale、unknown。 |
| 是否出现孤儿功能、规则、数据、接口、NFR 或验收 | pass | Step 16 主矩阵和漏项审计通过，正式正文沿用该结果。 |
| 是否修改其他项目 | pass | 装配变更仅限 `projects/L5-chat/`。 |

## 8. 正式文档静态一致性检查

装配后必须检查以下内容并将结果回填到项目台账：

1. 所有 `F-CHAT-*`、`BR-CHAT-*`、`NFR-CHAT-*`、`AC-*`、`VETO-*` 和 `OPEN-CHAT-*` 引用均能回指 Step 7～16。
2. §12 的接口与依赖不出现 API path、DTO、topic、handler、repository、私有 service 或共享数据库。
3. §13 的数值 authority 只标记为 pending/rejected，不把历史值写成目标。
4. §14 的验收条件不写测试步骤，不声称任何运行结果；§15 的风险和待确认事项分表保留。
5. §16 的主矩阵以功能需求为行主轴，不新增 ID，不把 pending 转成 ready。

审计结果：`pass`。正式 `00` 已满足装配与停审条件。

## 9. 正式文档停审边界

正式 `00` 停审后：

- 本轮不进入 `01-架构设计.md`，也不创建/修改 `01` 的 calibration flow。
- 上游 contract、数值 authority、兼容矩阵和诊断 envelope 仍由 §15 风险/待确认承接；停审不等于这些外部问题已解决。
- 后续若要进入 `01`，必须由用户明确继续，并重新读取项目台账、flow 和 `01` 对应 SOP/书写规范。

## 10. Step 17 自检与最终门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否只做重组/润色，没有新增需求？ | pass | 正式章节均来自 Step 1～16，新增内容仅为来源引用和统一术语。 |
| 是否完成旧文档 historical 差异审计并删除重建？ | pass | 旧内容已审计，正式文件已按当前校准结果重建。 |
| 是否每章都有 calibration 来源与延伸阅读？ | pass | §1～§16 均有来源块。 |
| 是否完成术语、编号、owner 边界和 pending 状态统一？ | pass | 使用 N1～N4、`F/BR/NFR/AC/VETO/OPEN-CHAT` 和四类数据归属。 |
| 是否完成静态交叉引用、孤儿项和边界审计？ | pass | Step 16 追溯结论与本步静态检查均通过。 |
| 是否伪造实现、测试、证据、验收结果、readiness 或 commit？ | no | 只写设计结论、验收条件、风险和挂起状态。 |
| 是否修改了 `projects/L5-chat/` 之外的文件？ | no | 未执行跨项目文档或源码修改。 |

## 11. Step 17 门禁

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 旧文档差异审计、删除重建、来源引用、编号术语、静态一致性和停审边界完成。 | 更新 flow 与项目台账，将正式 `00` 标记为 stopped/complete。 |
| 文档级 | `stopped` | 正式 `00-需求文档.md` 已完成并可追溯、可验收；open contract 仍显式保留，不被正文伪装关闭。 | 停止本项目当前轮次，不进入 `01`。 |
| 项目级 | `stopped_after_00` | `00` 完成后按用户要求停审；不提交 commit，不创建实现代码。 | 等待用户明确授权下一份正式文档。 |

## 12. 本步结论

### 本轮逐章修复停审（2026-10-01）

本轮按用户要求修复现有正式 00 的 §1～§16，未新建总同步文档，未删除重建正式文档。下方删除/重建措辞描述前轮历史装配，不适用于本轮。Step 3～16 分别补充原型回写及结构化结果；Step 7～16 正式章节引用修正；新增核心功能 F-CHAT-018～021 归回 §9.1。US-CHAT-019～022、AC-FR-CHAT-011～014、RISK-CHAT-011～012、OPEN-CHAT-013～015 保留同章承接。

当前门禁只表示需求文档修复停审，不表示 SDK/owner 合同、实现、运行、测试、验收或 readiness 已成立。CHAT-UP、WS-UP、流程投影、绑定撤销与成员可见性合同仍 open。当前停止，不进入 01，不提交 commit。

Step 17 已完成旧正式 `00` 的历史差异审计、删除和重建。新的正式文档只承载 Step 1～16 已通过的当前结论：L5-chat 是经 `L0-sdk` 接入各 owner 的跨平台客户端产品，拥有 UI、导航、客户端局部状态、草稿、选择、缓存与恢复体验，不拥有 Conversation、Governance、Artifact、Workspace、Runtime、Member 或 Observability truth。正式 `00` 已完成来源、边界、功能、规则、数据、接口、非功能、验收、风险和追溯闭环；上游合同、数值 authority、兼容矩阵和诊断 envelope 仍保持显式 pending。当前文档在 `00` 处停审，不进入 `01`。
