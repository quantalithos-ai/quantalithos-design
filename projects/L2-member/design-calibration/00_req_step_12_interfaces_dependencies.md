# L2-member 00 需求 Step 12: 接口与依赖

> 创建日期: 2026-08-20
> 状态: repaired_done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 12 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 12 接口与依赖 |
| 输出文件 | `design-calibration/00_req_step_12_interfaces_dependencies.md` |
| 已读取通用规范 / SOP / 书写规范 | yes(书写规范 4.12:五类接口 + 四类依赖枚举;承接 4.6 不重抄;不写 API / DTO / schema) |
| 已读取前序输入 | yes(Step 6 依赖裁剪、Step 9 功能、Step 11 数据归属) |
| 当前模式 | full-restart |
| 进入条件 | Step 11 gate_status=pass |

## 1. Step 内计划

| 模块(能力节点) | 接口回答 | 依赖承接 | 停审 | gate_status |
|---|---|---|---|---|
| C-L2M-1 | done | done | pass | pass |
| C-L2M-2 | done | done | pass | pass |
| C-L2M-3 | done | done | pass | pass |
| C-L2M-4 | done | done | pass | pass |
| C-L2M-5 | done | done | pass | pass |
| 外围增强 | done | done | pass | pass |
| 跨能力接口审计 | done | — | pass | pass |

## 2. 本步输入

- Step 6 裁剪表 / 分类表 / 禁止表 / 裁剪图(本章图示真相源,不重画)。
- Step 9 FR-001~012 / E01~E03;Step 11 数据归属(接口只能触达允许的数据形态)。
- L2-tools 00 §12 体例(接口边界表 IB-* + 外部依赖边界表 DB-*)。

## 3. SOP 问题回答(摘要)

1. 当前正在讨论哪个能力节点? — 按 C1~C5 逐节点收敛,见 §5。
2. 对外提供哪些能力级接口? — 15 项核心 IB + 3 项外围 IB,见 §5。
3. 消费哪些能力级输入? — 9 条依赖边界 DB,见 §6。
4. 同步 / 异步边界? — 在场受理、投递提交、摘要查询为同步语义;入站事实、policy 变化、delivery / 观测反馈为异步(事件输入 / 输出);存活面与视图重建为周期 / 后台语义。
5. 输入型 / 输出型? — DB 表方向列。
6. 核心 / 外围? — IB / DB 表所属层级列;`IB-L2M-014`(能力出口)随 FR-012 标可裁剪。
7. 与 Step 6 依赖类型映射? — DB 表全局依赖类型列,与 Step 6 一致,无冲突。
8. 是否存在无功能来源的接口? — 无,见 §7 审计。
9. 是否存在功能需要外部协作但无依赖承接? — 无。

## 4. 当前文档问题诊断

| 位置 | 旧口径 | 当前判断 |
|---|---|---|
| 旧 00 §10.2 | 上下游接口写成 "core(proto)/bus(订阅发布)/member-service(register/heartbeat)" | proto / register / heartbeat 是协议与命令名;重写为能力面。 |
| 旧 README B4 | "gRPC server :50143" | 端口 / 协议;废弃。 |

## 5. 结构化中间产物(对外能力接口边界表)

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 变更接口 | `IB-L2M-001` 启动语境受理与在场建立 | 对外体现为以项目型 `ProjectMemberRef` 执行主语、关联 `GlobalMemberRef` 身份锚和可验证启动语境让成员实例进入本地在场;不可验证、关联冲突或非项目型主语未闭口即拒绝。 | 核心闭环能力(C1) |
| 变更接口 | `IB-L2M-002` 在场状态变化与退出 | 对外体现为在场状态显式变化(含 draining / terminated)的能力入口。 | 核心闭环能力(C1) |
| 变更接口 | `IB-L2M-003` 注册请求、存活信号与状态报告面 | 对宿主体现为接收 member 注册请求、存活信号、状态报告与本地尝试语境的能力面;不含注册接受、endpoint registry、host session 或健康判定。 | 核心闭环能力(C1) |
| 变更接口 | `IB-L2M-004` 订阅范围决定 | 对外体现为按身份 / 角色语境建立或调整订阅范围的能力入口。 | 核心闭环能力(C2) |
| 事件输入 | `IB-L2M-005` 入站事实承接 | 对内体现为经事件主干承接已提交事实 ref 及正式授权范围内必要瞬时检查材料的异步输入面;正文不得落为 member truth。 | 核心闭环能力(C2) |
| 事件输入 | `IB-L2M-006` 筛选规则来源变化承接 | 对内体现为承接 Policy effective 结果 / safe snapshot 变化的异步输入面;不生成裁决。 | 核心闭环能力(C2) |
| 变更接口 | `IB-L2M-007` 入站筛选结论形成 | 对外体现为对入站事实形成通过 / 降级 / 阻断 / 待定结论的能力面。 | 核心闭环能力(C2) |
| 变更接口 | `IB-L2M-008` 受控投递提交 | 对内体现为向运行决策协作方提交 typed ref、safe snapshot 或受控安全语境,携带来源、scope 与筛选结论并关联受理结果;不得透明转发 raw body。 | 核心闭环能力(C2) |
| 变更接口 | `IB-L2M-009` 运行结果出站承接 | 对内体现为承接运行侧 committed safe material 并形成出站决定的能力面。 | 核心闭环能力(C3) |
| 事件输出 | `IB-L2M-010` 安全发布输出 | 对外体现为向事件主干提交 body-free 发布材料的输出面;不承诺 delivery。 | 核心闭环能力(C3) |
| 事件输入 | `IB-L2M-011` 发布反馈承接 | 对内体现为承接 delivery / 下游反馈状态摘要的异步输入面;不逆写本地决定。 | 核心闭环能力(C3) |
| 查询接口 | `IB-L2M-012` 交互追溯读取 | 对外体现为按关联语境只读追溯在场 / 筛选 / 投递 / 出站事实的能力面(body-free)。 | 核心闭环能力(C4) |
| 事件输出 | `IB-L2M-013` 安全观测材料输出 | 对外体现为输出最小必要、body-free、可关联观测 / 审计材料的输出面;route 未闭口只 attempt / gap。 | 核心闭环能力(C4) |
| 查询接口 | `IB-L2M-014` 成员摘要与能力出口读取 | 对外体现为只读消费成员状态摘要与能力出口安全视图的能力面;失效显式 stale / gap。 | 核心闭环能力(C5;能力出口子项可裁剪) |
| 后台任务接口(按需) | `IB-L2M-015` 派生视图重建与对账 | 对内体现为重建摘要 / 出口视图和对账追溯关联的后台能力入口;不创造业务事实。 | 核心闭环能力(C5 / C4 支撑) |
| 查询接口 | `IB-L2M-E01` 筛选统计与诊断摘要 | 只读筛选统计 / 误拦截诊断的外围能力面。 | 外围增强能力 |
| 查询接口 | `IB-L2M-E02` 交互历史浏览 | body-free 历史摘要只读浏览的外围能力面。 | 外围增强能力 |
| 查询接口 | `IB-L2M-E03` 生效配置可解释视图 | 只读展示订阅 / 出站边界生效配置及来源的外围能力面。 | 外围增强能力 |

## 6. 外部依赖边界表

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L0-core` | 编译期依赖 | `DB-L2M-001`:只消费正式 shared ID / ref / metadata / error / trace / envelope 类别;member-specific contract 受 `L2M-UP-005` 约束保持候选。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L0-bus` | 事件协作依赖 | `DB-L2M-002`:入站事实承接与出站 / 观测材料发布的事件主干;delivery truth 归 bus。 | 核心闭环能力 |
| 输入 / 输出 | 下游消费依赖 + 外部能力依赖 | `L2-runtime` | 运行期依赖 | `DB-L2M-003`:向 Runtime entry 提交入站语境(Runtime 是 member 投递的消费方),并消费其 committed safe material / safe view;mapping 受 `L2M-UP-003` 约束。 | 核心闭环能力 |
| 输入 / 输出 | 外部能力依赖 | `L2-member-service` | 运行期依赖 | `DB-L2M-004`:消费启动语境、凭据 / 注册接受 / host session ref,提供注册请求、存活信号、状态报告与本地尝试语境;接受 / registry / session / health truth 归宿主,字段合同受 `L2M-UP-001/006` 约束。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L1-work` | 运行期依赖(ref) | `DB-L2M-005`:消费项目型 `ProjectMemberRef` 作为执行主语;不拥有 ProjectMember truth,非项目型路径受 `L2M-UP-008` 约束。 | 核心闭环能力 |
| 输入 | 治理结论依赖 | `L1-governance` | 运行期依赖 + 事件协作依赖 | `DB-L2M-006`:消费 Policy effective 结果 / safe snapshot 用于筛选分级与出站约束;unknown 保守处置(`L2M-UP-007`)。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L2-tools`、`L3-method-library` | 运行期依赖(弱) | `DB-L2M-007`:消费工具契约 / 定义 ref 派生能力出口视图;失效显式 stale / gap。 | 核心闭环能力(可裁剪子项) |
| 输出 | 下游消费依赖 | `L1-conversation`、`L4-observability` 等 | 事件协作依赖 | `DB-L2M-008`:输出 body-free 交互 / 观测材料;消费缺口独立显式,不反写本仓 truth;route 受 `L2M-UP-004` 约束。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L1-identity` | 运行期依赖(ref) | `DB-L2M-009`:消费与 ProjectMember 关联的 `GlobalMemberRef` 身份锚 / 安全摘要;不拥有 GlobalMember truth。 | 核心闭环能力 |

`DB-L2M-001~008` 与 Step 6 裁剪结论一致;member-images / L0-sdk / sandbox / hub 不进入本章(Step 6 已裁剪为不适用 / future 记录)。本章不重画依赖图,图示以 Step 6 §7.5 为真相源。

## 7. 跨能力接口审计

| 检查项 | 结果 |
|---|---|
| 无功能来源的接口 | 无(IB-001~015 ↔ FR-001~012;IB-E01~E03 ↔ FR-E01~E03) |
| 功能需外部协作但无依赖承接 | 无(FR-001↔DB-004/005/009;FR-004~006↔DB-002/003/006;FR-007/008↔DB-002/003;FR-010↔DB-002/008;FR-012↔DB-007) |
| 依赖类型与 Step 6 冲突 | 无 |
| API 路径 / 命令名 / DTO / topic / port 泄漏 | 无 |
| 同一外部能力被重复定义 | 无 |

## 8. 回填草稿

按 §5 接口表 + §6 依赖边界表回填第 12 章;结论段声明:具体 API path、DTO、event topic、IPC 载体、repository 与事务不在需求层定义;只有 `L0-core` 为编译期候选,其余关系保持 runtime / event seam,ref 只是受控交互形态;外部 adapter 是禁止直边,fake 只可作为后续测试替身。

## 9. 待确认事项

- `IB-L2M-014` 能力出口子项随 FR-012 的裁剪决定挂起。

## 10. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 接口 / 依赖类型使用定稿枚举 | pass |
| 未重抄 Step 6 仓依赖表(DB 表为能力面细化) | pass |
| 每节点已停审 | pass |
| Step 13 输入已形成 | pass |

```text
gate_status = pass
next_allowed_action = create_step_13_non_functional_requirements
formal_document_write_allowed = false
```
