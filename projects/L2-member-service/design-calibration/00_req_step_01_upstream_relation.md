# Step 01. 与上游文档的关系声明

## 1. Step 状态

- 状态：[x] 已完成(2026-08-21 状态审计同步)
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 1
- 回填章节：`00-需求文档.md` §1(书写规范 4.1)

### 1.1 Step 内计划

- [x] 读取输入和前序结论：全局依赖规则、仓库拆分方案 §5.5、产品矩阵、draft/README 输入清单
- [x] SOP 问题回答：见 §3
- [x] 当前材料 / 旧文档诊断：见 §4
- [x] 设计取舍：见 §6
- [x] 结构化中间产物：见 §7
- [x] 复杂度判断：单 Step 完成,不拆模块
- [x] 回填草稿：见 §8
- [x] 自检与进入下一步条件：见 §9 / §10

## 2. 本步输入

- 上游文档：`architecture/仓库拆分方案.md` §5.5;`product/产品矩阵.md`(Server 产品构成 / AI Members 产品边界);`standards/document/全局项目依赖关系与裁剪规则.md` §4;上游正式 `00~07`(L2-runtime / L4-sandbox / L2-tools / L1-identity / L1-work / L1-governance / L1-artifact / L3-method-library / L3-capability-hub / L0-core / L0-bus / L0-sdk)
- 讨论输入：`draft/` 四文件;2026-08-21 用户同意审计结论与修复方向,不构成对草稿逐条结论的正式签署
- 依赖的前序 Step：无(首 Step)

## 3. SOP 问题回答

1. 本文承接哪些上游文档？

   回答：三类。(a) 全局架构与产品定位：`architecture/仓库拆分方案.md` §5.5 定义 `quantalithos-member-service` 为 L2 编排层；`product/产品矩阵.md` 把 member-service 归入 Server 产品，并定义“AI Members 产品（member+runtime+tools+member-images 四仓镜像）由 member-service 拉取运行”的产品级关系。(b) 全局依赖基线：`全局项目依赖关系与裁剪规则.md` §4 的 `L2-member-service` 行与 §4.1 Layer 3 并行窗口。(c) 已停审上游正式文档：`L2-runtime 00~07`（member host lifecycle 非目标 + 入口 surface 挂起）、`L4-sandbox 00~07`（MemberExecutionHost / SandboxBinding 装配 truth 归本仓）、`L1-identity`（成员生命周期与可运行性信号输出）、`L1-work`（ProjectMember 事实）、`L1-governance`（policy 生效事实）、`L3-method-library`（向 member-images 提供 role → image variant 定义）、`L2-tools` / `L3-capability-hub` / `L1-artifact`（边界排除输入）、`L0-core` / `L0-bus` / `L0-sdk`（契约 / 事件 / 编译与客户端边界）。

2. 承接的是上游哪一部分主题？

   回答：只承接"AI 成员执行宿主与编排控制面"主题：成员如何从已成立的身份 / 分配事实变成受控运行实体的宿主侧问题。不承接成员身份主题(identity)、项目工作主题(work)、运行循环主题(runtime)、镜像内容主题(member-images)、隔离执行主题(sandbox)。

3. 本文为什么不是重新定义该主题？

   回答：宿主编排主题在上游已有多处正式锚点——仓库拆分方案已给出仓级职责占位,L2-runtime 与 L4-sandbox 的停审文档已从两侧钉出本仓边界(runtime 拒绝拥有 member host lifecycle;sandbox 显式把宿主装配 truth 划给本仓)。本文是把这些已成立的边界结论收束为仓级需求,不发明新主题。

4. 本文在当前仓里承担什么细化作用？

   回答：把"成员执行宿主 + 编排控制面"从架构占位细化为可验收的仓级需求：定位边界、能力闭环、功能、规则、数据归属、接口边界与验收合同。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `00-需求文档.md` §1 | 来源只引 README 与 ai-member 设计 §5.3,未承接正式上游 `00~07` 链与全局依赖规则 | 需求语义来源停留在旧草案,与已停审上游(runtime / sandbox)脱节 |
| 旧 §1 表格 | "承接内容"直接写功能名(启停 / 注册 / 心跳 / policy 下发) | 违反书写规范 4.1(承接内容只写主题 / 范围) |
| 旧文档整体 | 生成于 L2 五仓并行草案期(2026-05),晚于它的 runtime / sandbox 停审结论未反映 | MemberExecutionHost / SandboxBinding 归属、runtime 入口挂起等关键边界缺失 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源集合 | README + ai-member 设计 §5.3 | 全局架构 / 产品矩阵 / 依赖规则 + 12 个上游正式项目文档 | full-restart 必须以当前 authority 为来源;ai-member 设计属 legacy 架构草案 |
| 承接内容写法 | 功能清单式 | 主题 / 范围式 | 符合书写规范 4.1 表格填写规则 |
| 旧材料地位 | 直接作为来源 | historical_material,仅后置差异审计 | full-restart 纪律 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 承接全部 12 个上游项目并逐行列映射 | 完整 | §1 表会过长,弱化主锚点 | 不采用全量逐行;核心锚点逐行,边界排除类项目归并说明 |
| 只承接 runtime / sandbox 两个直接锚点 | 简洁 | 丢失 identity / work / method-library 的输入锚点与产品级定位 | 不采用 |
| 分层承接:架构与产品定位 / 全局依赖基线 / 上游正式文档三类,类内逐行 | 主锚点清晰且可审 | 需要维护分类口径 | 采用 |
| 引用 `architecture/ai-member设计.md` §5.3 作为来源 | 与旧文档连续 | 该文档属 legacy 架构草案,非当前 authority | 不采用;只在污染审计中出现 |

## 7. 结构化中间产物

### 来源映射表(正式 §1 候选)

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `architecture/仓库拆分方案.md` | §五 L2 · 5.5 `quantalithos-member-service` | L2 编排层仓级职责定位主题 |
| `product/产品矩阵.md` | Server 产品构成 / AI Members 产品边界 | member-service 归 Server 产品、拉取运行 AI Members 镜像的产品级关系主题 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | §4 依赖矩阵 `L2-member-service` 行;§4.1 Layer 3 并行窗口 | 本仓依赖基线与讨论顺序主题 |
| `projects/L2-runtime/00-需求文档.md` | §4.2 `NG-L2R-008`;§15 `Q-L2R-001` | runtime 不拥有 member host lifecycle;运行入口 surface 待双侧闭口主题 |
| `projects/L4-sandbox/00-需求文档.md` | §2 非职责边界;§6 使用方 | MemberExecutionHost / SandboxBinding 装配 truth / session / worker / health / callback material 归本仓主题 |
| `projects/L1-identity/00-需求文档.md` | §6 使用方与依赖 | 成员生命周期、角色能力摘要与可运行性信号的输出边界主题 |
| `projects/L1-work/00-需求文档.md` | §2 定位与 §6 依赖 | ProjectMember 项目工作事实的消费边界主题 |
| `projects/L1-governance` 正式文档 | Policy 生效事实边界 | 生效策略消费与传递边界主题 |
| `projects/L3-method-library/00-需求文档.md` | §6 role → image variant 输出到 member-images | 镜像映射的间接定义来源与禁止本仓建立第二解析路径主题 |
| `projects/L0-core` / `L0-bus` / `L0-sdk` 正式文档 | 契约 authority / 事件主干 / SDK 边界 | 共享契约类别、事件协作、编译基线与下游客户端封装主题 |
| `projects/L2-tools`、`L3-capability-hub`、`L1-artifact` 正式文档 | 各自定位章 | 工具 / 能力 / 制品真相的边界排除输入主题 |

### 并行兄弟与 historical_material 声明(正式 §1 尾注候选)

- `projects/L2-member/`、`projects/L2-member-images/` 属同窗口兄弟；本 Step 执行时尚未停审。2026-08-22 Step 17 终审刷新确认两者正式 00 均已停审，可消费需求级 owner / supply 分工；exact contract、字段与正向联调仍作为 pending 对端。
- 旧 `README.md`、旧正式 `00/01/02/03/05/06`、`architecture/ai-member设计.md` §5.3 为 historical_material,仅作污染审计输入。

## 8. 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_01_upstream_relation.md`

`L2-member-service` 位于 Layer 3 并行窗口(`L2-member` / `L2-member-service` / `L2-member-images`),在 `L2-runtime` 正式链停审之后启动。本文承接全局架构与产品定位、全局依赖基线以及已停审上游正式文档中与"AI 成员执行宿主与编排控制面"相关的结论。

(来源映射表见 §7,装配时复制。)

本文讨论的主题是：上述上游结论在 `L2-member-service` 仓上的需求收束方式。本文不重新定义成员身份、项目工作、运行循环、镜像内容或隔离执行主题,只对"成员如何获得受控执行宿主"这一已由上游从两侧钉出的主题做仓级细化。

## 9. 待确认事项

- 无本 Step 级待确认;跨项目 pending 已在 ledger 登记(MSVC-UP-001~009)。

## 10. 进入下一步条件

- [x] 来源映射逐行成立,一行一个语义单元
- [x] 承接内容均为主题 / 范围,无功能名
- [x] 未滑入边界 / 依赖 / 闭环内容
- [x] 旧材料与并行兄弟地位声明明确

结论：gate_status = pass,允许进入 Step 02。
