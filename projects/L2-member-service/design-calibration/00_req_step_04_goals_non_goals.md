# Step 04. 目标与非目标

## 1. Step 状态

- 状态：[x] 已完成（2026-08-22 同步 Step 07 已确认范围）
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 4
- 回填章节：`00-需求文档.md` §4(书写规范 4.4)

### 1.1 Step 内计划

- [x] 读取输入和前序结论：Step 02 边界 / Step 03 问题;draft/01 §4 不拥有清单;draft/03 能力候选;L2-runtime 00 §4 范式
- [x] SOP 问题回答：见 §3
- [x] 当前材料 / 旧文档诊断：见 §4
- [x] 设计取舍：见 §6
- [x] 结构化中间产物：见 §7
- [x] 复杂度判断：单 Step 完成
- [x] 回填草稿：见 §8
- [x] 自检与进入下一步条件：见 §9 / §10
- [x] 后续范围回填：用户已在 Step 07 明确选择当前版项目型-only，补入 NG-MS-012

## 2. 本步输入

- 上游文档：Step 02 / Step 03 产物;`L2-runtime/00` §4(目标 / 非目标写法范式与 fail-closed 尾注)
- 讨论输入：draft/01 §4 不拥有清单;draft/03 §1 六能力候选(仅作目标方向参照,不预定能力节点)
- 依赖的前序 Step：Step 03(pass)

## 3. SOP 问题回答

1. 本次需求结束后,应成立哪些状态、边界或能力？

   回答：五个方向——宿主真相与编排决定成立;装配输入与解析边界成立;注册 / 会话 / 健康分层成立;隔离交接与恢复清理语义成立;宿主事实的对外交接分层成立。逐条见 §7 目标表。

2. 这些目标如何被验证？

   回答：每条目标给"完成方向"(可判定语句),最终由 Step 14 验收标准承接;不用无 authority 数字做验证口径。

3. 哪些事项虽然相关,但明确不纳入当前范围？

   回答：见 §7 非目标表（12 条，均带 owner / 原因）。其中 NG-MS-012 是 Step 07 后续确认的当前版范围，经用户明确同意后回填。

4. 哪些事情必须交给相邻仓或后续阶段处理？

   回答：runtime run truth、member 门面内部、镜像内容、隔离 truth、身份 / 工作 / 治理真相交给相邻仓;技术栈 / 部署 / 数值 SLA / policy 传递 owner / launch credential owner 交给后续阶段或待确认闭口。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 00 §3.1 | 六条目标全部是性能数字(P95 / QPS / 并发 / 延迟) | 无 workload authority;把测量目标当需求目标,丢失能力成立语义 |
| 旧 00 §3.2 | 非目标仅 5 条,且"原因"列与"归属"列错位串格 | 排除面不完整;表格本身损坏 |
| 旧 00 全文 | 无 fail-closed / pending 总则 | 上游未闭口 seam 可能被写成 ready |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 目标 | 6 条性能数字 | 5 条能力成立目标 + 完成方向 | 需求目标表达能力成立;数字留给有 authority 的后续阶段 |
| 非目标 | 5 条 | 12 条，均带 owner / 原因 | 承接 Step 02 排除面、全局纪律及 Step 07 已确认的项目型-only 范围 |
| 总则 | 无 | fail-closed / pending 尾注 | 与 runtime / sandbox 范式一致 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 保留旧性能目标作为 G 条目 | 连续 | 无 authority;违反"非功能指标要有来源"红线 | 不采用;测量维度留 Step 13 |
| 目标按六能力候选逐条写(6+ 条) | 完整对应 | 目标层过细,预定了 Step 7 的节点拆分 | 不采用;目标收敛为 5 个方向,节点拆分留 Step 7 |
| 5 条能力成立目标 + 12 条带 owner / 原因非目标 + fail-closed 尾注 | 层次正确；与上游范式及已确认范围一致 | — | 采用 |

## 7. 结构化中间产物

### 目标表(正式 §4.1 候选)

| ID | 目标 | 完成方向 |
|---|---|---|
| `G-MS-001` | 宿主真相与编排决定成立 | 一个成员宿主实例有唯一身份、显式生命周期状态与可追溯的编排决定来源;意图受理 / 拒绝 / 等待可判定 |
| `G-MS-002` | 装配边界成立 | 身份 / 分配 refs、member-images 正式 pinned image ref / manifest、运行环境需求、宿主凭据与适用的 SandboxBinding 装配结果按 owner / ref / freshness 组织；本仓不直接解析 role/image mapping，部分成功不伪装 ready |
| `G-MS-003` | 注册、会话与健康分层成立 | 宿主内进程凭可撤销凭据注册;endpoint 与运行会话事实唯一;心跳健康与失败分类分层(host / session / backend / unknown),不与业务或运行状态混写 |
| `G-MS-004` | 隔离交接与恢复清理语义成立 | 受限动作经 sandbox 正式边界交接,装配结果与交接 refs 归本仓;crashed / degraded 宿主按显式恢复决定处理,重启形成新实例事实,下线清理与孤儿对账可追溯 |
| `G-MS-005` | 宿主事实对外交接分层成立 | 已提交宿主生命周期事实以 body-free 形态交接;attempt / gap 与 delivered / observed 分层,外部失败不回滚本地 truth |

### 非目标表(正式 §4.2 候选)

| ID | 非目标 | Owner / 原因 |
|---|---|---|
| `NG-MS-001` | Runtime run / turn / decision / checkpoint truth 与运行恢复内容 | `L2-runtime` |
| `NG-MS-002` | 成员门面进程内部(身份卡、入站过滤、attention、IPC) | `L2-member`(并行,pending) |
| `NG-MS-003` | 镜像内容、构建、签名、BOM truth | `L2-member-images`(并行,pending) |
| `NG-MS-004` | 隔离边界、policy enforcement、capture、cleanup 的 isolation truth | `L4-sandbox` |
| `NG-MS-005` | GlobalMember / Role 身份真相与认证凭据体系 | `L1-identity` / 安全 owner |
| `NG-MS-006` | Project / ProjectMember / WorkItem 工作事实与业务状态机 | `L1-work` |
| `NG-MS-007` | 治理裁决、policy 内容与生效判定 truth | `L1-governance` |
| `NG-MS-008` | Role → image variant 定义 truth | `L3-method-library` |
| `NG-MS-009` | Observability backend / observed truth / 归档正文 | `L4-observability` / `L4-archive` |
| `NG-MS-010` | 容器运行时 / 编排平台产品本体与产品级部署策略 | 基础设施 adapter / SRE |
| `NG-MS-011` | 固定技术栈、框架、数据库、部署形态、数值 SLA 与性能数字 | 无当前 authority,后续阶段按证据收敛 |
| `NG-MS-012` | 非 `ProjectMember` scoped 的宿主及 DM / PersonalWorkspace 独立宿主 | 当前版只支持以 `ProjectMemberRef` 为执行主语的项目型宿主；未来纳入前必须由正式 ADR / 上游合同定义第三种执行主语，并重开 C-MS-1 及受影响需求 Step |

### fail-closed 总则(正式 §4 尾注候选)

所有正向 seam(runtime 入口、member 合同、镜像引用合同、sandbox 正向字段、policy 传递、launch credential owner、Core schema)在 owner contract、字段与真实证据闭口前,只能是 `pending`、`blocked`、`waiting`、`degraded` 或 `fail-closed`,不得伪造 ready。

## 8. 回填草稿

> 校准来源：
> - `design-calibration/00_req_step_04_goals_non_goals.md`

(装配时复制 §7 三块。)

## 9. 待确认事项

- policy 传递路径若后续确认归本仓(MSVC-UP-005),目标表可能追加一条"传递事实成立"目标——当前不预写。
- NG-MS-012 已由用户在 Step 07 明确确认，只闭合当前版本范围；不构成对未来第三种执行主语的定义。

## 10. 进入下一步条件

- [x] 每条目标有完成方向且可被 Step 14 承接
- [x] 每条非目标具体且带 owner
- [x] Step 07 已确认的项目型-only 范围已回填为 NG-MS-012
- [x] 无功能罗列、无方案、无空洞口号、无无源数字
- [x] fail-closed 总则成立

结论：gate_status = pass,允许进入 Step 05。
