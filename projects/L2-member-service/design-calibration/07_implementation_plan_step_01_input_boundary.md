# Step 1. 确认实施输入边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 1
> 本步状态：`completed / pass_with_upstream_blockers`
> 回填目标：正式 `07-实施计划.md` §1

## Step 状态

| 项 | 结论 |
|---|---|
| gate_status | completed / pass_with_upstream_blockers |
| current_module | input_boundary |
| next_allowed_action | Step 2 scope |
| implementation_allowed | false；07 设计完成不等于实现授权 |

## 本步输入

| 输入 | 当前状态 | 使用方式 |
|---|---|---|
| `00-需求文档.md` | 已存在、正式停审 | 功能分母、双锚、核心闭环 |
| `01-架构设计.md` | 已存在、正式停审 | Host Truth、依赖方向、分层 |
| `02-概要设计.md` | 已存在、正式停审 | CMP、实现分层、对象轮廓 |
| `03-详细设计.md` | 已存在、正式停审 | 直接实现契约与 7 模块 / 29 对象 / 协议分母 |
| `04-配置设计.md` | 已存在、正式停审 | profile、binding、fail-fast |
| `05-测试方案.md` | 已存在、正式停审 | suite、TC、artifact/report 结构 |
| `06-验收标准.md` | 已存在、正式停审 | AC、VF、证据与放行门禁 |
| 实施计划 SOP / 规范 / 台账规范 | 已读取 | phase、boundary、台账和交付纪律 |
| 目标实现仓 | 不存在 | `MSVC-IMPL-001`，阻断实现移交 |

## SOP 问题回答

1. 00~06 均存在，04 是本轮已生成的正式文档；07 可从完整输入制定路径。
2. 基线是当前工作区中的正式文档，不把旧 README 或旧正式 07 当作可继承内容。
3. 03 已给出字段、对象、Port、flow、状态、事务、错误和测试切口的 planned contract；exact sibling / Core/Bus 合同仍未闭合。
4. 05/06 足以定义 planned 阶段门禁，但不能产生真实运行证据。
5. 已发现的冲突主要是跨仓 exact contract 缺失，不由实施计划选边。
6. 代码仓路径、cursor exact type、Core/Bus route/envelope/receipt、真实存储和观测 backend 是 implementation blocker 或 positive integration blocker。
7. 05/06 使用正式 03 的名称和分母；`submitted / delivered / observed / accepted`、Query no-write、Job no-truth-repair 一致。

## 当前文档问题诊断

此前没有本仓正式 07，无法直接移交实现；若直接写阶段清单，会遗漏 implementation ledger、boundary skeleton、经验复核和证据成熟度。旧材料中的具体性能数字、产品绑定和 sibling ready 口径没有 authority，不应继承。

## 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 07 缺失、无法审计实施入口 | 固定正式输入、缺口分类和实现前置 blocker |
| 旧材料可能被误当基线 | 明确 full-restart 与正式文档优先 |
| 没有目标仓事实 | 明确 absent，只能记录为 blocker |

## 设计取舍

- 允许在目标实现仓不存在时完成“计划设计”，因为计划本身不产生代码；但把 `MSVC-IMPL-001` 设为 PH-01 硬 blocker。
- 对 sibling exact contract 采用显式 pending / blocked / placeholder，而不是伪造正向实现顺序。
- 将 07 作为实现交接契约，不把 03/05/06 的正文复制进来。

## 结构化中间产物

### 输入闭环审计表

| 复核项 | 来源 | 结论 | 影响 |
|---|---|---|---|
| 字段 / DTO | `03` §6~§8 | planned 闭合；跨仓 mapper pending | 受影响 boundary 必须先复核 |
| 状态 / 迁移 | `03` §9、`05` §6、`06` §8 | 名称一致，正向外部反馈受阻 | unknown / blocked |
| 事务 / 幂等 | `03` §10~§12 | local UoW / key fence 已定义 | durable product pending |
| 测试 / 验收 | `05` §9~§14、`06` §4~§12 | 可形成 planned gate | 当前无 run |
| phase boundary | `03` §16 与本 07 | 需新建 8 phase / 24 boundary | Step 5~6 收口 |

### 缺失输入风险表

| 风险 | 级别 | 处理 |
|---|---|---|
| 目标实现仓 absent | blocker | `commit-01-a` blocked / wait_design |
| Core/Bus exact event schema 未闭合 | blocker | candidate + local marker；不声明 ready |
| Member/Images/Runtime/Sandbox mapper 未闭合 | blocker | typed ref / safe summary / fail-closed |
| storage / observability product 未锁定 | risk / waiting | Port + fake；真实证据后置 |

## 回填草稿

正式 §1 应声明：本计划承接正式 00~06，03 是实现契约真相源，05/06 分别提供测试与验收门禁；计划不重定义设计；目标实现仓不存在时只能停在设计交接，不能在设计仓写源码。

## 待确认事项

- `MSVC-UP-001~008` 的 exact contract、owner 和 baseline。
- `/home/aris/Projects/quantalithos-member-service` 的创建与工程身份。
- `L0-sdk` 的准确 compile target 与 server self-test 方式。

## 进入下一步条件

输入基线、缺口和处理姿态已明确；允许进入 Step 2 规划目标与范围，但不授权实现。
