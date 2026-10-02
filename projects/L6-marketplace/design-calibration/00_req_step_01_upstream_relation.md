# 00 Step 1 · 与上游文档的关系声明

> 早期三批调查记录保留为过程历史；最终门禁以末尾“本轮收敛”各阶段为准。此前的“须全文回读所有长文件”是本地阅读计划，不是正向合同通过条件。当前阅读采用需求主题及正式 consumer 契约路由，未读实现章节不宣称已读。

## Step 开工确认

| 字段 | 当前值 |
|---|---|
| 模式 | full-restart |
| 当前单元 | 来源关系与输入资格核验 |
| gate_status | pass / stop_review |
| gate_reason | 本轮收敛及来源资格自检完成；早期三批阅读记录为过程历史，最终结果见末尾§3～§10。 |
| next_allowed_action | 本Step已完成，当前项目00整体停审，等待用户确认；不由本Step授权跨至01。 |
| source_files | project_execution_ledger.md、00_requirements_calibration_flow.md、draft/01～05 |
| 正式回填 | 已在Step17装配§1；上游正向资格仍保持明确缺口 |

## Step 内计划

- [x] 建立项目/文档/Step 恢复入口。
- [ ] 回读设计通则、中间产物规范、真相源闭环标准、依赖规则、需求 SOP 和书写规范。
- [ ] 核验产品与全局架构正式输入。
- [ ] 读取 L0-sdk、L1-identity、L1-governance、L1-artifact、L3-method-library、L3-capability-hub、L2-member-images、L4-observability、L4-archive 当前正式文档与必要台账。
- [ ] 逐项回答 SOP 的来源/承接问题。
- [ ] 从正式输入推导来源表后，再诊断旧 00 的来源污染。
- [ ] 形成取舍、结构化来源表、回填草稿及自检。
- [ ] Step 停审并更新三层台账。

## 当前输入资格

用户已确认原型第一版暂时收口，不等于正式需求确认、可发布资产包、真实 Governance decision 或集成 readiness。五类资产和前端/API/Worker 分离是讨论方向；owner 引用、版本、摘要、可见性、审核与分发接收合同必须逐项核验，不能由原型或技术栈候选补齐。

问题回答、诊断、取舍、结构化产物与回填草稿目前均 pending。不得把开工记录解释为 Step 1 完成。

## 来源核验记录（2026-10-01，部分完成）

本节为输入调查记录，不是正式 §1 回填草稿；边界、依赖和技术栈问题只作为后续 Step 的待核验输入。未完成完整回读，不允许将本 Step 标为 pass。

| 来源 | 本轮实际阅读覆盖 | 已核验结论 | 剩余动作 |
|---|---|---|---|
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全文 §1～§7 | Marketplace 位于 §4.1 Layer 5 并行窗口；项目内文档仍串行；未稳定上游不得私自吸收 | Step 6 再裁剪具体依赖类型 |
| `standards/document/需求文档讨论流程_SOP.md` | Step 1 | 来源、主题、不重新定义与本仓细化作用必须分别回答 | 其余通用执行要求仍需回读 |
| `standards/document/需求文档书写规范.md` | §4.1.1～§4.1.8 正例起始 | 正式 §1 只能写来源映射表与一段收束说明，不写边界清单、ASCII、接口或实现 | 继续回读公共章节与其余规范 |
| `standards/document/设计文档讨论中间产物规范.md` | §3.4.3～§3.4.5、§3.5 末段及 §3.6 | 恢复先读三层台账；未闭合门禁不得进入下一步；未来 Step 不提前建文件 | 继续完整回读 |
| `product/产品矩阵.md` | §6.3 Marketplace | 上位主题为社区、组织、第三方资产共享/发布；支付、订阅、认证仍为未来依赖 | 读取联动与治理相关段落；处理旧对象归属冲突 |
| `architecture/仓库拆分方案.md` | §9.2、§10 | Marketplace 为独立专属仓，有网站、发布 CLI、审核后台；生态通过 SDK 访问 L1 | 读取全局相关约束；记录技术栈差异 |
| `projects/L1-identity/00-需求文档.md` | 文件头及 §1～§6.1 起始 | 平台级 AI 员工身份真相，不是认证系统、RoleDefinition 正文仓或授权裁决系统 | 继续读取其余正式需求与必要契约 |
| `projects/L1-identity/design-calibration/00_requirements_calibration_flow.md` | 全文 | flow 记录 00 Step 1～17 已完成；正式文件头仍标 Draft | 不因 Draft 字样全盘否定输入，也不推断全部契约 readiness |
| `projects/L1-identity/design-calibration/00_req_step_17_formal_document_assembly.md` | §1～§7.1 前半 | 提供装配与校准来源说明 | 继续核验收尾门禁 |
| `projects/L0-sdk/design-calibration/00_requirements_calibration_flow.md` | 全文 | 00 校准完成；SDK 是客户端接入层，不是 server facade、auth provider 或业务 owner | 继续回读正式文档与当前具体 client 支持面 |
| `projects/L0-sdk/design-calibration/00_req_step_17_formal_document_assembly.md` | 全文 | 正式 00 已重建，有逐章来源；不反推已有 Marketplace client | 核验当前架构与契约面 |
| `projects/L4-observability/design-calibration/project_execution_ledger.md` | 当前恢复点、文档级进度、部分 blocker 行 | 台账记录当前 07 设计侧完成；同时保留 inherited affected 与实现 handoff blocked | 逐项检查影响 Marketplace 审计交接的 current 契约，不能以总状态代替接口核验 |

SDK 和 Identity 目录未找到 `project_execution_ledger.md`，本轮使用各自 00 flow 与 Step 17 作为补充状态来源；这是状态来源差异，不是接口缺失或项目未校准的直接证明。此前上游批量阅读有输出截断，本表只登记可确认的覆盖，不宣称九个上游已完整阅读。

## 已发现的来源冲突与待核验项

| 编号 | 证据与问题 | 当前处理 | 后续落点 |
|---|---|---|---|
| MP-SRC-001 | 产品矩阵 §6.3 使用 `identity.Role`；Identity 当前正式 §2、§4 明确 RoleDefinition 正文不归 Identity | 不沿用该旧对象归属；由 method-library 当前正式定义核验 RoleDefinition 来源，镜像由 member-images 核验 | Step 2、6、11、12 |
| MP-SRC-002 | 讨论稿将 publisher 身份/组织验证与 Identity 关联；Identity 正式 §2、§4 只声明 AI 员工 GlobalMember 与非认证边界 | `MP-UP-003` 保持 owner 待确认；不得声称 Identity 已提供人类发布者或组织资质验证 | Step 5、6、12、15 |
| MP-SRC-003 | 全局架构 §9.2 指定 Rust 服务端 + Vue 前端；draft 推荐 TypeScript + Next.js/React + Fastify | 两者差异显式保留；本 Step 不批准覆盖全局架构，也不确认最终技术栈 | 00 风险登记，01 经用户授权后处理选型与上位差异 |
| MP-SRC-004 | 产品矩阵列 Deployment Package 与购买/订阅；未核验联合包 owner 或 Billing 正式合同 | 产品愿景不等于本仓获得资产包正文、执行安装或支付真相所有权 | Step 2、4、7、12、15 |
| MP-SRC-005 | Observability 台账有设计完成总状态，同时保留 payload/schema、producer binding 和 affected 项 | 不推断这些项目均直接阻塞 Marketplace；须按本仓实际 handoff 逐项映射，未核验前不声明审计闭环可用 | Step 6、12、15 |
| MP-SRC-006 | 方法库正式 00 §4.2、BR-ML-016 将定价、购买、订单、结算和商业履约整体指向 Marketplace | 只承接其“方法库不拥有商业交易真相”的排除边界；不将指向本仓的描述当作 Billing ownership 授权。本任务明确要求无正式 owner 时保持 future/blocker | Step 2、4、11、12、15 |
| MP-SRC-007 | capability-hub 正式 00 §12.3、§15.2 只确认 Marketplace 外围只读发现候选；当前 03/05/07 还有 reason-repair anchor 等待项 | capability owner 已可核验，不等于 Marketplace 所需 immutable version/digest/visibility/exposure 合同已成立；后续按实际 adapter 字段核验，不照搬 provider URL 或登记条目作为可上架版本 | Step 6、11、12、15 |
| MP-SRC-008 | member-images 正式 00 明确 image supply 与 marketplace listing 分离；§15.2 保留 MI-UP-001/003/007/009 | 镜像供给、方法映射、Artifact formal ref、消费者 confirmation 与通知不能合为“已发布/已安装”；只继承与本仓路径实际有关的缺口，不将全部 MI-UP 自动升级为全仓 blocker | Step 2、6、7、12、15 |
| MP-SRC-009 | member-images Q-MI-004 对 BOM/scan/signature evidence kind 与 gate priority 保持待定；原型的镜像表单要求相关材料 | 原型字段不构成正式适用 gate authority；应闭合材料引用来源和失败边界，但不能宣称上传完整或扫描/签名通过等于 Governance approval | Step 7、10、11、12、14、15 |
| MP-SRC-010 | Governance 正式 00 和 Step 17 均记录已重建完成，但 00 flow §3 仍把 Step 10～17 标为待开始；未找到项目级执行台账 | 记录 owner 状态来源冲突，不在下游修改或选择一个状态宣称全链通过；明确的 Governance ownership 红线作为约束，审核正向合同资格待核验 | Step 1、6、12、15；待 owning 项目澄清 |
| MP-SRC-011 | Governance 正式 03 §7.2 列出 `GetGateDecision`，但本批尚未核验其 Marketplace subject/scope/version/material binding | 查询名称是已存在读取面线索，不等于本仓 review handoff 合同已成立；不得新增本地 approval 或使用接入审查/扫描/ACK 代替决定 | Step 7、10、12、14、15 |
| MP-SRC-012 | Archive 正式 00 §11.1 source-authority matrix 包含八类来源但不含 Marketplace；§15 保留 owner export/restore 与治理/完整性接缝 | 不假定存在 Marketplace 状态切片、恢复接收合同或保留/删除授权；市场局部恢复与跨域归档分开处理 | Step 6、11、12、15 |

上述 `MP-SRC-*` 是 Marketplace 本地调查编号，不是上游正式 blocker，也不代表已向上游回流或获 owner 确认。用户限制只允许改本项目，因此仅记录待回流事项，不修改 owning 项目台账。

## 第二批阅读覆盖与 owner 输入资格

本批承接用户“同意”，只继续 Step 1 的输入调查，不视为通过 Step 1、确认最终技术栈、开放正式 00 装配或进入 01。

| 来源 | 本批实际覆盖 | 输入资格 / 读取结论 | 未完成部分 |
|---|---|---|---|
| `standards/document/设计文档编写通则.md` | 1～1098 行分批回读；末段截断后重读 970～1098 行 | 单元小循环、三层装配门禁、正式结论与过程记录分离、图形粒度及无依据数字禁止 | 本批没有借其授权直接装配正式文档 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 1～410 行，含真相源唯一、恢复纪律、schema/support carrier/callable surface 约束起始 | 类型命名不能替代字段/owner；实现 boundary 内支撑类型、读取面、状态与 factory 必须闭合 | 全文剩余部分尚未完成，不能宣称完整回读 |
| `standards/document/设计文档讨论中间产物规范.md` | 补读 1～175 行；此前门禁/恢复段保留 | 一个 Step 一个产物；旧文件只从已核验输入重建；本项目不能借其他项目的授权扩大行动 | 其余规范内容继续回读 |
| `standards/document/需求文档讨论流程_SOP.md` | 补读 1～195 行 | 能力级小循环与独立 Step 纪律；不一次性生成全仓功能后补来源 | 其余 SOP 通用章节及 Step 1 的完整执行核验待续 |
| `standards/document/需求文档书写规范.md` | 补读开头至总体原则起始，已读取 §4.1 保留 | 需求不能锁表结构、DTO、handler 或事务实现；用户要求的可落码交接不能被误当作需求 §1 的写作粒度 | 其余书写规范回读待续；本批聚合输出曾截断，不声明全文完成 |
| `projects/L3-method-library/00-需求文档.md` | 全文 1～633 行；§15.2 的截断部分单独重读 | 正式需求 owner 边界可引用；RoleDefinition、ProcessTemplate、方法内容及 owner 正式化/版本语义归方法库 | exact Marketplace 消费合同需继续读取当前正式 01/02/03，不从需求主题推导 DTO |
| `projects/L3-method-library/design-calibration/project_execution_ledger.md` | 当前恢复点与文档级进度 1～34 行，部分历史/修复行仅作线索 | 台账明确 00～06 completed；07 记录上游自身 implementation handoff。正式 00 文件头 Draft 不等于未校准 | 上游 implementation 授权/commit/检查不转移到本项目，也不证明本项目集成已发生 |
| `projects/L3-capability-hub/00-需求文档.md` | 1～150、588～798、987～1048 行，即定位、归属、接口及风险相关段落 | capability identity、registry、adapter descriptor、formal exposure 归该仓；Marketplace listing 明确排除；生态消费候选是只读面 | 151～587、799～986、1049～1154 行及必要 current 契约待续 |
| `projects/L3-capability-hub/design-calibration/project_execution_ledger.md` | 1～45 行，恢复点、文档级进度与执行规则起始 | 00/01/02 是 active formal baseline；03/05/07 有受控 reason repair 等待 anchor，不能统称全链稳定 | 判断该修复是否影响本仓消费面；没有承接前不复制其 blocker 为本仓阻塞结论 |
| `projects/L2-member-images/00-需求文档.md` | 全文 1～840 行分批读取 | 镜像域 pin、revision、digest/provenance、eligibility、availability 和 pinned entry 归镜像 owner；Marketplace listing 与 container truth 明确外置 | exact 消费、visibility 和发布材料合同须继续读取当前正式 01/02/03 |
| `projects/L2-member-images/design-calibration/project_execution_ledger.md` | 当前恢复点 1～16 行；其他授权/进展仅部分读取 | 07 设计侧完成，当前 boundary 仍 blocked/wait_design；不能从正式 00 的旧 review-pending 文件头推断仍停在 00 | 仅记录设计状态；不继承其他项目用户授权、不虚构构建/资产/digest/证据事实 |

## 资产 owner 调查结论（非正式章节）

| 用户讨论的资产类型 | 已核验的 owner 语义 | Marketplace 当前允许推导的上限 | 正向路径仍需核验 |
|---|---|---|---|
| Method 资产 | 方法内容定义归方法库，见方法库 §11 | 类型方向与定义 owner 明确；不复制正文 | 可上架 exact type 与不可变发布读取合同，不能将讨论用的 Method 标签私造为上游类型 |
| ProcessTemplate | 方法库 §11 的过程模板与生命周期模型定义 | 以 owner 正式版本建立 listing 关联，不代替流程执行仓 | 版本、摘要、visibility、发布资格及分发接收合同 |
| RoleDefinition | 方法库 §11 的 SPEM 方法内容定义；Identity 只拥有成员身份及身份侧引用 | 可纠正 `identity.Role` 旧归属，不把 role 商品当 Identity 权限角色或实际成员 | 正式定义引用、版本读取及 role-image relation 来源 |
| Capability 资产 | capability-hub §2/11 的接入 identity、registry、descriptor 与 formal exposure | 独立市场 listing 不等于注册条目；只消费正式只读 owner 面 | 不可变版本/摘要/可见性字段、material refs、撤回/变更消费面与 SDK 支持 |
| Member Image | member-images §2/11 的镜像资产与供给事实 | pinned 资产引用与 supply 条件方向明确，不复制镜像内容或形成第二 digest/provenance truth | Marketplace 消费合同、MI-UP-003/007/009 与 Q-MI-004 的实际适用影响、接收方正式确认合同 |

三种“发布”必须在后续需求中分别判定：owner 资产正式化/供给事实、Marketplace 版本上架事实、分发到接收方的局部关系事实。实际安装/激活、成员创建、container 启动仍是接收 owner 的外部事实，不由 listing、获取请求或 transport ACK 生成。该区分来自本批 owner 输入和用户范围约束，不在本 Step 写状态机或 schema。

## 下一批必读与本批自检

| 检查 | 本批结果 |
|---|---|
| 是否只改本项目 calibration | 是；不改三个 owner 的正式文档/台账，不改 Marketplace 正式 00 或 draft |
| 是否把五类资产讨论当成上游 exact enum | 否；Method/Capability 等仍须核验 exact owner contract |
| 是否把 owner 的正式发布或接入审查当市场审核通过 | 否；Governance 正式决定消费合同仍未核验 |
| 是否将 MIRUP 全部归为 Marketplace 全仓阻塞 | 否；按受影响路径登记，发现/展示与正式上架/安装证明不能混用 |
| 是否声明三仓 current 00～07 已全文读完 | 否；本表逐项保留实际覆盖与后续契约读取任务 |
| 是否允许 Step 2 或正式 00 回填 | 否；Step 1 gate 仍未通过 |

下一批首先续读启动规范、capability-hub 需求剩余段和产品主题；随后核验 Governance/Artifact 的正式决定/资产引用来源及 SDK 接入支持，并读取 Archive/Observability 的正式交接边界。已完整读取的 method-library/member-images 00 不重复全文读取，但当前正式 01/02/03 的必要消费契约仍须补读。完成来源闭环后才执行 SOP 问题回答、来源映射候选表与后置旧材料诊断。

## 本批自检与恢复点

- 已核验：Layer 5 的并行许可不改变单 agent 执行及文档串行纪律；正式 §1 不容纳资产字段、状态机、技术栈或依赖图。
- 未完成：六项启动规范完整回读、产品相关输入完整核验、九个专项上游正式文档及必要台账核验、SOP 回答、后置历史诊断、来源表与回填草稿。
- 门禁：`in_progress`；下一 Step 不允许；正式 00 不允许回填。
- 下一阅读：公共规范剩余内容、产品最终目的相关主题、method-library / capability-hub / member-images 的正式需求与状态来源，再核验 Governance / Artifact / Archive / Observability 合同。

## 第三批：治理、制品、SDK 与审计归档输入调查

本批只推进当前来源调查单元。公共规范与专项上游尚未全部回读，正式 §1 来源表、SOP 回答和停审仍未开始；不因本批发现正式接口名称而解除门禁。

| 来源 | 本批覆盖 | 核验结果 / 输入限制 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | 补读 195～369 行 | 通用执行纪律、Step 字段关系和总流程已读取；当前 00/Step 1 仍按来源问题推进，不提前写 repository/状态机 |
| `standards/document/设计文档讨论中间产物规范.md` | 补读 175～275 行 | 独立产物、分批、项目恢复与三层分工；没有引入新的本项目授权 |
| `projects/L1-governance/00-需求文档.md` | 1～96、443～535 行及 Decision/approval 相关检索 | 明确拥有 Gate/Approval/Decision 与治理控制真相；不拥有 Artifact/evidence 正文。只是读取相关正式章节，未宣称全文完成 |
| `projects/L1-governance/design-calibration/00_requirements_calibration_flow.md` | 1～100 行 | §3 状态表与正式 00/Step 17 相冲突；本地 MP-SRC-010 保持 pending，不修改上游 |
| `projects/L1-governance/design-calibration/00_req_step_17_formal_document_assembly.md` | 全文 | 记录 Step 1～16 完成、正式装配与自检通过；证实存在冲突，不能单方面修复旧 flow |
| `projects/L1-governance/03-详细设计.md` | 1～75、270～321 行 | 正式入口将 exact schema/flow 保留于校准文件；`GetGateDecision`/`DecisionSummaryView` 是合法查询线索。下一步必须按该章具体来源读字段契约，不能用名称自补 Marketplace binding |
| `projects/L1-artifact/00-需求文档.md` | 1～62、397～491 行 | Artifact fact/version/lineage/baseline 与可消费回指归 Artifact；派生预览/索引与引用不迁移 ownership |
| `projects/L1-artifact/design-calibration/project_execution_ledger.md` | 当前恢复点与文档级进度 1～42 行 | 00～06 当前设计完成；07 已装配等待审查。状态是设计基线，不是已签发资产引用或实现事实 |
| `projects/L0-sdk/00-需求文档.md` | 1～68、255～345 行 | SDK 是三语言官方客户端接入层；不执行认证、权限裁决、治理审批或 UI/runtime 工作流。具体 owner client 支持面仍须字段级核验 |
| `projects/L4-archive/00-需求文档.md` | 29～58、299～373、425～455 行 | 只承接 owner-approved material/ref 与正式治理决定；manifest/verification/handoff 不等于业务恢复或删除授权。Marketplace source 未列入当前矩阵 |
| `projects/L4-archive/design-calibration/project_execution_ledger.md` | 1～32 行 | 正式 00～07 停审；18 项 blocker/pending 保留；不产生实施 baseline/证据或恢复结果 |
| `projects/L4-observability/00-需求文档.md` | 71～100、645～691 行 | 观测材料、审计投影和只读报告交接归该仓；证据关联不是证据正文，报告不是 approval/verdict。Marketplace producer 具体准入合同尚未核验 |
| Artifact/SDK/Archive 正式 03 的目标术语检索 | 仅检索，不是全文阅读 | 当前命中不足以证明 Marketplace adapter、`ConsumableArtifactReference` 或 restore receiver 已闭合；须沿正式章节引用继续读取，不能把搜索未命中解释为能力不存在 |

Governance 项目级台账缺失与 flow 冲突分别记录；其他项目的用户确认/commit 授权不承接到本项目。任何 blocker 回流目前仅记录为 owning 项目待协调项，未发送外部消息、未修改上游台账。

### 第三批承接判断

| 主题 | 已核验输入上限 | 不允许的推导 | 下一核验面 |
|---|---|---|---|
| 审核 handoff | Governance 拥有正式决定，已有裁决查询线索 | 查询成功/事件送达/材料上传完整 => 审核通过 | 状态资格、subject/scope、申请与 listing version、材料版本、决定有效性/替代关系、SDK 读取面 |
| 资产与材料引用 | Artifact 提供版本/血缘/基线与可消费引用语义 | 任意文件/digest/证据引用 => 可上架商品；本地复制正文 => 资产 owner | owner 版本引用、消费授权/可见性、不可变摘要、材料语义与 wrong-kind/missing/conflict 结果 |
| 官方接入 | SDK 封装正式服务边界、共享错误/metadata/trace | 通用 client 定位 => 五类资产/Marketplace review/安装 API 已存在 | 各 owner client 的 current exact callable surface 和不支持时的处理 |
| 审计交接 | Observability 提供安全材料、body-free linkage、审计投影与真实性提示 | 本地日志/投递 ACK/报告索引 => 完整审计链或 signoff | Marketplace producer 准入、脱敏/关联、接收结果与失败恢复 |
| 归档与恢复 | Archive 拥有包/manifest/来源覆盖/完整性/owner handoff | 包验证通过 => listing/distribution 已恢复；默认 retention/delete 权限 | Marketplace source 是否正式纳入、owner export/restore receiver、决定来源与逐项提交反馈 |

### 第三批自检与下一动作

- 本批只更新当前 Step、00 flow 与项目执行台账；正式 00、draft、其他项目、实现仓均未修改。
- MP-SRC-010 是真实状态记录冲突；MP-SRC-011/012 是受影响合同待核验，不宣称 owning 项目已确认的 blocker。
- 本 Step 保持 in_progress，SOP 回答/来源表定稿/历史诊断/回填草稿/自检停审仍 pending；没有创建 Step 2。
- 下一阅读先完成启动规范剩余部分、capability-hub 00 未读章节、产品正式主题与 Identity/SDK 等未读需求；随后沿 Governance 03 §7 与 Artifact/资产 owner 正式来源核验 exact consumer 合同。Governance 状态冲突保持显式，不阻止其他来源调查，但不得批准受影响 review 正向合同。
- 无实现、测试执行、证据、commit；只执行本批文档空白与引用检查。

## 本轮收敛：1. Step 状态 / 2. 本步输入

2026-10-01 用户授权完成全部 00。当前 Step 1 仅收敛来源资格，`gate_status=in_progress`；结构化产物、自检尚待完成。前序输入为上述实际阅读记录；新增读取需求书写规范 §3～§4.1、中间产物规范 §3.4.6～§4.1/§5.6、闭环标准 §2.3～§2.8.5、§3.5.5～§3.5.6、§5.1～§5.2、§6～§7.3。公共规范按适用需求/执行门禁读取，不宣称长文件所有实现示例已读。

新增正式来源：最终目的 §6.7、§7.3、§11.3、§12；产品矩阵 §7.2 员工招聘联动、§9.4 发布 Gate；仓库拆分 §11～§15。沿正式 03 读取 Governance §7 及 Step 8 §9.2～§9.4、Artifact §6～§8、SDK §6、Capability Hub §6、Member Images §6～§7、Observability §2。这些是契约资格核验入口，不是声明集成完成。

### 1.1 Step 内计划（本轮）

- [x] 恢复与读取输入：见原覆盖表及本节。
- [x] SOP 问题回答：见下一节。
- [ ] 独立来源结论后读取历史材料、诊断与对比。
- [ ] 设计取舍、结构化来源映射与复杂度判断。
- [ ] 回填草稿、自检、三层门禁更新。

## 3. SOP 问题回答（先于历史材料诊断）

1. 承接哪些上游？承接最终目的、产品矩阵、仓库拆分、全局依赖规则以及九个专项 owner 当前正式边界。draft 与原型仅是用户讨论输入，不是 owner authority。
2. 承接什么主题？生态资产市场及独立端产品定位；方法/角色/模板、能力、镜像来源；正式治理决定、制品引用、官方客户端、安全审计和受控归档协作主题。
3. 为什么不是重新定义？五类候选市场标签不是 owner enum，市场审核不重定义 Governance，获取不重定义安装或财务事实。来源中相互冲突的指向按当前 owner 与用户范围约束排除，不拼接成授权。
4. 当前仓做哪层细化？细化市场局部需求、对外行为及失败姿态；exact schema/adapter/transaction 归后续 01～07 校准。正向上游合同未闭合不妨碍写出拒绝/等待要求，但不允许宣称正向能力可运行。

## 本步独立结论（历史诊断前）

来源映射只呈现主题；Identity 承接 AI 身份边界而非 publisher verification；Governance 只消费正式决定；Artifact 只承接引用；Archive 为条件协作。§1 不写边界图、技术栈或接口。全局 Rust/Vue 与 draft TS/React 的冲突后移至风险，00 不越权裁定。

## 4. 当前文档问题诊断 / 5. 改动前后对比

独立结论之后读取旧 `00` §1～§7 和 README 全文，均为 historical_material。追加规范清单检索：产品 MK1～MK6 与子项目 MK1～MK4 编号不完全一致，后续必须标来源而非仅写 MK4。

| 旧材料位置 | 旧口径 | 当前判断 / 理由 | 回填影响 |
|---|---|---|---|
| 旧 00 §1 | 功能源自 README；来源表并列主题和实现 | 废弃；旧 README 不具备重新定义正式需求资格 | 正式 §1 重建主题映射 |
| README 资产表 / draft01 §2 | identity.Role、人类 publisher truth | 修改；Identity 当前只声明 AI 员工身份 | RoleDefinition 归方法库；认证来源 pending |
| 旧 00 §3/§6、README MK2 | Deployment Package 打包/解包为 P0 | 阻塞待确认；标准格式要求存在，但资产包 owner、适用类型与接收合同未闭合 | 保留合规缺口，不私造包正文，不静默宣布不适用 |
| 旧 00 §3/§7 | 各项 100% 与安装可用 | 废弃无证据通过率；须定义可验证正负向行为 | 后续验收不声称实测 |
| 旧 00 §5/§6 | Marketplace 合规与内容共批 | 修改；审核参与体验与 Governance decision authority 分开 | 不能在本地形成 approval |
| README 技术栈/目录 | TS/Python、payment package、扫描工具 | 后移/排除；技术选型不由历史目录决定，支付无 owner | §15 显式差异，不进入 §1 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 正式主题+owner 边界+条件缺口 | 可回链且不伪造正向合同 | 仍有待 owner 处理的路径 | 采用 |
| 沿用 README/原型字段作为正式合同 | 装配快 | 第二资产真相、错误认证与审核推导 | 不采用 |
| 等全部上游实现后才写需求 | 正向演示容易 | 无法先约束失败边界 | 不采用；设计停审与实现门禁分开 |

## 7. 结构化中间产物

| 来源文档 | 上游章节/模块 | 承接内容 |
|---|---|---|
| `product/最终目的.md` | §6.7 接入与生态能力族 | 社区资产市场主题 |
| `product/最终目的.md` | §7.3 对生态的成功 | 生态复用的成功方向 |
| `product/产品矩阵.md` | §6.3 Marketplace | 独立市场产品范围 |
| `product/产品矩阵.md` | §9.4 发布 Gate | 受控上架治理主题 |
| `architecture/仓库拆分方案.md` | §9.2 marketplace | 独立生态仓定位 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | §4.1 Layer 5 | 本项目设计窗口 |
| `standards/产品遵循规范清单.md` | §十 Marketplace | 市场合规要求 |
| `projects/L0-sdk/00-需求文档.md` | §2 本仓定位与边界 | 官方客户端主题 |
| `projects/L1-identity/00-需求文档.md` | §2 本仓定位与边界 | AI 员工身份边界 |
| `projects/L1-governance/00-需求文档.md` | §2 本仓定位与边界 | 正式治理决定主题 |
| `projects/L1-artifact/00-需求文档.md` | §11 数据需求与数据归属 | 制品事实及引用主题 |
| `projects/L3-method-library/00-需求文档.md` | §11 数据需求与数据归属 | 方法资产定义主题 |
| `projects/L3-capability-hub/00-需求文档.md` | §12 接口与依赖 | 能力生态消费主题 |
| `projects/L2-member-images/00-需求文档.md` | §11 数据需求与数据归属 | 镜像供给引用主题 |
| `projects/L4-observability/00-需求文档.md` | §15 风险与待确认事项 | 审计交接限制 |
| `projects/L4-archive/00-需求文档.md` | §11 数据需求与数据归属 | 受控归档主题 |

复杂度判断：正式 §1 只需一表一段；详细调查保留本文件，无需把字段合同塞进正文。Gov Step6 §15.2 已读的 DecisionSummaryView 只有 decision/gate ref、readability、surface、cursor、basis，没有公开 approved outcome 或 marketplace 申请/版本/材料 binding；因此 `GetGateDecision` 名称不足以放行。Artifact Step8 已读 IssueConsumableArtifactReferenceRequest 与 ArtifactVersionView 有消费 scope、version ref，但不能单独证明 marketplace 资产类型/摘要/可见性合同闭口。MP-SRC-011 从“未读”收敛为“已检查读取面仍不足”。Member Images 03 明确 0 outbound 且传输未绑定，不能设计一个假想 image 发布事件来消除此缺口。

## 8. 回填草稿

正式 §1 摘录上表，附一段：本文细化 Quantalithos 的生态资产市场主题。它不重新定义产品使命及专项 owner 语义，只在 Marketplace 仓级收敛需求、对外行为与验收边界。

## 9. 待确认事项

MP-SRC-001～012 与 MP-UP-001～008 保留，均为本仓调查号；不是上游确认或回流完成。新增 `MP-SRC-013`：产品 MK2 的 Deployment Package 格式适用范围及 owner 缺失，需合规 owner/资产 owner 澄清。规范清单的要求不是本仓生成包 truth 的授权；无匹配合同不得宣称该类发布合规通过。

## 10. 进入下一步条件 / 自检停审

来源主题、正式与历史资格、不可承接口径已分开；本 Step 不批准审核/分发正向合同，不提前锁技术栈。表与段可直接回填 §1；引用存在，自检通过。`gate_status=pass / stop_review`，允许 Step 2；正式装配仅 Step 17。原开工字段的 in_progress 属于早期批次，由此最终记录替代。

本轮计划补齐：历史诊断、取舍、结构化、复杂度、回填、自检均 done，对应 §4～§10。未读上游正文及实现章节不作为已读/ready；正向缺口在 Step 15 闭口记录。
