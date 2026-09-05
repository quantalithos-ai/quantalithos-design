# L2-member 00 需求 Step 1: 与上游文档的关系声明

> 创建日期: 2026-08-20
> 状态: repaired_done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 1 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 1 与上游文档的关系声明 |
| 输出文件 | `design-calibration/00_req_step_01_upstream_relation.md` |
| 通用规范 | 已读取通则、中间产物规范、真相源标准(§一/§二核心原则)、全局依赖规则全文 |
| 类型规范 | 已读取需求 SOP 与需求书写规范全文 |
| 专项输入 | 已读取 L2-runtime / L2-tools 00~07、L0-core / bus / sdk、L1-identity / conversation / governance / work 当前正式链、ADR-0004/0005、L2-member-service 当前校准至 Step 9、L2-member-images 当前 Step 1~8 与 Step 9 ledger / flow 状态 |
| 历史输入 | 已读取 L2-member README 与旧 00、旧 01(节选),只作污染审计 |
| 讨论输入 | `draft/01~03`(用户已确认) |
| 正式文档写入 | not_allowed_before_step_17 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 来源权威分层 | done | 来源分类表 | pass |
| SOP 问题回答 | done | 四项回答 | pass |
| 当前文档诊断 | done | 历史污染表 | pass |
| 设计取舍 | done | 来源使用规则 | pass |
| 结构化产物 | done | 正式来源映射候选 | pass |
| 回填草稿 | done | 第 1 章候选 | pass |
| 自检 | done | 门禁表 | pass |

## 2. 本步输入与来源分层

| 来源层 | 材料 | 使用规则 |
|---|---|---|
| normative authority | 六份强制标准 | 决定全局顺序、需求结构、依赖分类和 full-restart 门禁。 |
| direct upstream | `projects/L2-runtime/00~07` | member 是 Runtime 的 Entry consumers / 下游入口边界;消费其 loop / context / plan / outcome 语义边界与 entry 合同,保留其开放 seam(`Q-L2R-001`、`L2R-UP-002/006`)。 |
| action contract upstream | `projects/L2-tools/00~07` | 工具行动语义合同 owner;member 能力出口只以 ref / safe view 引用,不复制 ToolDefinition。 |
| truth upstream | `projects/L1-identity`、`projects/L1-conversation`、`projects/L1-governance` 正式链 | 分别承接身份锚点、对话真相边界、Policy effective / Decision 消费口径;member 只消费,不反写。 |
| foundation | `projects/L0-core`、`L0-bus`、`L0-sdk` 正式链 | Core 为共享契约 authority(唯一编译期候选);Bus 为事件主干;SDK 为下游封装面。 |
| granularity reference | `L1-governance`、`L1-artifact` 正式链与 calibration | 参考 owner 分层、组成部分与实施 boundary 粒度,不复制领域结论。 |
| sibling pending | `projects/L2-member-service/design-calibration/` 当前 Step 1~9;`projects/L2-member-images/design-calibration/` 当前 Step 1~8 与 Step 9 ledger / flow | member-service Step 9 pass / Step 10 pending,member-images Step 1~8 pass / Step 9 in progress;只引用已通过门禁且明确标为当前的边界,进行中内容不引用,正式 00 未停审前不升格为稳定合同。 |
| confirmed discussion input | `projects/L2-member/draft/01~03` | 用户确认的预推演;各 Step 独立回答后对照复核,不作免检结论。 |
| historical material | `projects/L2-member/README.md`、旧 `00/01/02/03/05/06` | 只用于差异 / 污染审计,不直接进入正式结论。 |
| blocker input | `L2M-UP-001~008` | 作为 pending / blocked / fail-closed 条件传递,不补造正向事实。 |

## 3. SOP 问题回答

1. 本文承接哪些上游文档?

   回答: 承接 `standards/document/全局项目依赖关系与裁剪规则.md` 确立的 Layer 3 并行窗口位置与三类依赖纪律;承接已完成停审的 `projects/L2-runtime/00~07`(受控运行、entry / outcome / handoff 边界)与 `projects/L2-tools/00~07`(工具行动契约);承接 `L1-identity` 的 `GlobalMemberRef` 身份锚、`L1-work` 的 `ProjectMemberRef` 项目执行主语、`L1-conversation` 的对话真相和 `L1-governance` 的 Policy effective / Decision truth;承接 `L0-core / L0-bus / L0-sdk` 正式契约。

2. 承接的是上游哪一部分主题?

   回答: 承接"AI Member 容器内运行态主体的对外交互边界"主题——项目型实例以 `ProjectMemberRef` 为执行主语并关联 `GlobalMemberRef` 身份锚,消费 Runtime 的 Entry consumers / downstream consumer 边界,在事件协作主干上形成成员侧订阅与发布语义,消费治理结论约束入站筛选,并受控引用工具 / 方法定义形成能力出口。

3. 本文为什么不是重新定义这些主题?

   回答: 这些主题各有正式 owner——run truth 归 Runtime,工具契约归 Tools,身份归 Identity,对话归 Conversation,裁决归 Governance,传递归 Bus,共享契约归 Core。member 只建立容器内成员门面的交互语义(presence、入站筛选、受控投递、出站决定与发布、摘要与能力出口),不得复制或反向定义相邻 truth。

4. 本文在当前仓里承担什么细化作用?

   回答: 将 member 职责细化为需求层的 owner 范围、核心能力闭环、功能与失败语义、数据归属、能力级接口、质量约束与验收合同,为后续 `01~07` 提供唯一需求基线。

## 4. 当前文档问题诊断(historical material 污染审计)

| 历史问题 | 位置 | 诊断 | 当前处置 |
|---|---|---|---|
| 以 `architecture/ai-member设计.md` §三与旧 README 为最高 authority | 旧 00 头部、§1 | 未按当前全局规则与已停审上游核验;该文档不在当前 normative authority 清单 | 全部降级为 historical material。 |
| B1-B6 六子模块作为需求出发点 | 旧 00 §6、旧 01 §5 | 从实现模块反推需求,缺 truth 归属层;违反"先能力后功能"纪律 | 模块划分后移 01/02;需求层从能力闭环重建(draft 02 §1 为讨论输入)。 |
| CloudEvents 1.0 + W3C Trace Context、AG-UI 17 事件写成同一硬对齐清单 | 旧 README §主要对齐 | CloudEvents / W3C Trace Context 已由 L0-core 当前正式链承接,不能整体降为 historical;但旧 member-specific type / source / subject / payload / route 与 AG-UI 事件集没有当前合同 | 继承 Core 的 envelope / trace 标准;旧 member-specific 事件细节与 AG-UI 仅记 historical,受 `L2M-UP-005` 约束。 |
| UDS gRPC、端口 :50143、supervisord、Rust 技术栈 | 旧 README、旧 00 §2/§6、旧 01 §2/§3 | 技术载体提前成为需求事实;L2-runtime 正式链明确不锁载体 | 需求层只保留容器内受控 seam、不得暴露通用外部监听面和不得任意直连 provider / MCP / A2A;Bus、宿主、Runtime 正式边界不因此被禁止。 |
| launch_token(短时 JWT)校验作为 F-001 | 旧 00 §6 | 凭据形态与签发 / 撤销 owner 尚无闭口合同 | 语义保留为"可验证启动语境 / 凭据 ref",形态记 `L2M-UP-006`。 |
| Attention = Prompt Injection 预过滤,规则可热更新 | 旧 00 §5/§6、旧 README MB2 | 筛选能力方向成立,但规则 truth 来源未回链 Governance / 安全边界,存在自建 allowlist 风险 | 保留"入站筛选"能力;规则来源记 `L2M-UP-007`,unknown 保守处置。 |
| P95 < 20ms / 50ms / 5ms、SLA 99.9%/99.95% | 旧 00 §3/§7/§11、旧 01 §1.3 | 无当前 workload / measurement authority | 全部不继承;NFR 只定判断口径。 |
| member-service 依赖写成 SLA 表 + retry 降级机制 | 旧 00 §10 | 把运行期协作写成带机制的确定依赖;对方虽已校准至 Step 9,正式 00 与字段合同仍未闭口 | 重新按 runtime seam + `L2M-UP-001` 表达,并采用当前明确的 owner 分层。 |
| "下游 conversation(间接通过 bus)"等接口约定 | 旧 00 §10.2 | 方向成立但未按三类依赖分类,且未区分 delivery / accepted | Step 6 按 compile/runtime/event/ref 重新裁剪。 |

## 5. 设计取舍

| 取舍 | 采用 | 不采用 | 原因 |
|---|---|---|---|
| 上游顺序 | 当前全局规则与已停审 L2-runtime / L2-tools 正式链 | 旧 README 对齐清单与 `ai-member设计.md` | 当前标准是权威顺序;旧文档未经核验。 |
| member 定位来源 | 从 Runtime 正式链的 Entry consumers / handoff 边界反推 member 侧职责 | 从旧 B1-B6 模块反推 | full-restart 要求先形成独立结论;Runtime 已单方面锁定其一侧边界。 |
| 兄弟输入 | member-service / images 按当前校准阶段分别记 sibling pending,只引用已明确边界 | 把当前 Step 当成正式跨仓合同,或继续声称兄弟未启动 | 两仓均未完成正式 00;但当前进度与已明确 owner 不能被忽略。 |
| 开放 seam | pending / blocker / fail-closed | 虚构 mapping、route、凭据形态或 readiness | 防止 member 私自补上游 / 兄弟 truth。 |
| 需求粒度 | 外部可见交互行为与边界 | DTO、IPC 载体、协议、状态字段、技术栈 | 细节后移 01~04。 |

## 6. 结构化中间产物(正式来源映射候选)

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `standards/document/全局项目依赖关系与裁剪规则.md` | `§4 总依赖矩阵`;`§4.1 系统讨论顺序与并行窗口` | `L2-member` 在 Layer 3 并行窗口的位置、三类依赖纪律与并行纪律。 |
| `projects/L2-runtime/00-需求文档.md` | `§2 本仓定位与边界`;`§5 用户与角色`;`§12 接口与依赖` | Runtime 拥有 run / decision / checkpoint / outcome truth;member 作为运行触发方 / 运行材料消费方经 entry 合同协作。 |
| `projects/L2-runtime/01-架构设计.md` | `§4.2 边界红线`;`§5 系统边界与上下文` | member 不得成为第二 run truth owner;Entry consumers 是下游消费边界,不反向定义 Runtime。 |
| `projects/L2-tools/00-需求文档.md` | `§2 本仓定位与边界`;`§12 接口与依赖` | 工具契约 / normalized outcome truth 归 Tools;member 能力出口只以受控 ref / safe view 引用。 |
| `projects/L1-identity/00-需求文档.md` | `§2 本仓定位与边界` | 平台级成员身份真相归 identity;member 只持运行态身份锚点消费视图。 |
| `projects/L1-work/00-需求文档.md`;`architecture/adr/0004-global-vs-project-member.md` | ProjectMember / GlobalMember 边界 | 项目型运行实例以 `ProjectMemberRef` 为执行主语,并关联 `GlobalMemberRef` 身份锚;两类 ref 不可互相替代。 |
| `projects/L1-conversation/00-需求文档.md` | `§2 本仓定位与边界` | 对话真相归 conversation;member 出站只形成 body-free handoff material。 |
| `projects/L1-governance/00-需求文档.md` 当前正式链 | `§2`;`§10` | Policy effective / Decision truth 归 governance;入站筛选只消费正式结果,unknown fail closed。 |
| `projects/L0-core/00-需求文档.md` | `§7 核心能力闭环` | 共享 ID、ref、metadata、error、trace、envelope 类别 authority。 |
| `projects/L0-bus/00-需求文档.md` | `§2`;`§7` | 已提交事实的事件传递主干;delivery truth 归 bus。 |
| `projects/L0-sdk/00-需求文档.md` | `§2`;`§12` | 下游 SDK 封装边界,不反向进入 member package 依赖。 |

## 7. 回填草稿

本文承接当前全局依赖规则和已停审的 `L2-runtime`、`L2-tools` 正式设计链,在 Layer 3 并行窗口内细化 AI Member 容器内成员门面的交互语义。本文不重新定义运行循环、工具契约、成员身份、对话真相、治理裁决、事件传递或共享契约,只收束 member 自身的运行态主体、入站筛选与受控投递、成员侧 IPC 语境、出站交互与发布、成员可见摘要与能力出口需求。

## 8. 待确认事项

- `L2M-UP-001/002`:member-service 已完成需求 Step 9 并停审、member-images 已完成 Step 1~8 且正在 Step 9,两者正式 00 均未停审;宿主协作与静态镜像打包边界只按已通过门禁的明确材料保留 pending seam。
- `L2M-UP-003/004`:Runtime entry mapping 与 handoff source family 开放,入站投递与出站承接保持 seam。
- `L2M-UP-005~007`:member-specific Core schema、启动凭据 owner 契约、入站筛选规则来源未闭口。
- `L2M-UP-008`:项目型执行主语已由 ADR / Work 锚定;非项目型 / personal 执行主语未闭口,不得以 `GlobalMemberRef` 替代。
- 上述事项不阻塞需求边界成文,但阻塞后续正向字段 / 配置 / 联调 / readiness 声明。

## 9. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 已区分 authority、upstream、sibling-pending、historical、blocker | pass |
| 未把旧 member 设计当当前事实 | pass |
| 未提前写功能、对象、协议或实现 | pass |
| 未重新定义相邻 owner | pass |
| 来源映射表一行一个语义单元 | pass |
| Step 2 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_02_position_boundary
formal_document_write_allowed = false
```
