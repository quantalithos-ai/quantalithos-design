# 07 Step 1：确认实施输入边界

## Step 状态

`completed_with_explicit_blockers`

## 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 需求基线 | `00-需求文档.md` | 已存在、正式 | 五 capability、owner 红线、P0/P1/P2、MI-UP/Q-MI 上限 |
| 架构基线 | `01-架构设计.md` | 已存在、正式 | 五业务责任、四逻辑层、依赖分类、static/live 分离 |
| 概要基线 | `02-概要设计.md` | 已存在、正式 | 对象轮廓、接口族、处理流与状态骨架 |
| 详细基线 | `03-详细设计.md` | 已存在、正式 | 七 workspace 单元、对象/port/protocol/flow/state/store/error/test seam |
| 配置基线 | `04-配置设计.md` | 已存在、正式 | 五域、21 key、profile、strict/fail-closed、startup-only |
| 测试基线 | `05-测试方案.md` | 已存在、正式 | TC/EV、8 suites、脚本与 artifact/report 路径 |
| 验收基线 | `06-验收标准.md` | 已存在、正式 | AC、VETO、进入/退出、缺陷/风险/签署上限 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-member-images` | 缺失 | 不得在设计仓代替创建实现代码 |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 00/01/02/03/05/06 是否齐全 | 齐全；04 也已完成并纳入本轮输入 | 当前项目目录与正式文档头部 |
| 当前基线是什么 | 本轮重建后的正式 00~06；旧材料仅为历史污染样本 | 各正式文档 `full-restart` / stop-review 声明 |
| 详细设计是否可直接 1:1 落码 | 仅局部纯契约和负向边界可规划；全部 mutation/replay/recovery positive lane 不能直接激活 | 03 §8、§10~§13、§17 |
| 测试与验收能否定义阶段门禁 | 可以定义 planned gate、TC/EV/path 和失败上限；不能生成实际结果 | 05 §9/§13、06 §3/§10/§11 |
| 当前冲突/缺口 | 目标仓与 baseline 未核验；Core compile、owner contract、UoW/result/recovery 等 blocker 持续存在 | 03 §17、05 §14、06 §3/§13 |
| 缺口如何影响实施 | 影响的 boundary 保持 `blocked / wait_design`；纯 local contract、strict config、no-write、marker-only 可列入 planned | 03/04/05/06 正式边界 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 历史 07 尚不存在 | 无实施计划、ledger 或 boundary inventory | 本轮按 Step 1~13 新建，不追加旧稿 |
| 目标仓 absent | 无法固定 Cargo、toolchain、git、baseline 或真实命令 | PH-01 activation 前置 blocker |
| B01/B02 canonical/result 闭环未闭 | 10 Command、6 Job 的正向 mutation/replay 不能作为完成路径 | 只规划合法 shape 后 zero-effect 与 blocked lane |
| Artifact/consumer/event owner 未闭 | 不能规划成功 handoff、event receipt、publisher 或 readiness | 保留 ref/gap/marker/zero inventory |
| projection recovery 未定义 | Unavailable 后不能假定 Rebuilding/Fresh | 只规划 blocked negative test，等待 03 重开 |

## 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 实施输入 | 只有正式 00~06，未转实施边界 | 固定正式 00~06 + calibration + standards 为输入层 | 满足 SOP Step 1 的可追溯性 |
| 文档效力 | 07 未创建 | 07 只承接，不补设计；旧材料不继承 | 防止历史污染回流 |
| readiness 语义 | 容易把 planned 当可实施 | 明确 `not_started / blocked / wait_design` 上限 | 与 06 三值裁决一致 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 等所有 owner 闭合后再写 07 | 正向路径完整 | 无法提前规划本地边界和 blocker | 不采用 |
| 直接沿用兄弟项目 07 | 速度快 | 会复制不属于本仓的 event/outbox/scheduler truth | 不采用 |
| 先固化局部 planned、显式 blocked | 可为后续实现提供安全顺序且不伪造事实 | 需要维护大量负向门禁 | 采用 |

## 结构化中间产物

### 实施输入边界表

| 输入层 | 可直接承接 | 只能作为 pending/blocker | 禁止承接 |
|---|---|---|---|
| 本仓正式 00~06 | 范围、模块、协议库存、测试/验收规则 | 受 blocker 限制的 positive lane | 实际执行事实 |
| 已闭合上游 | typed ref、safe conclusion、边界类别 | 未闭 owner 字段和 schema | owner body / readiness |
| 兄弟项目进行中内容 | 方向性 pending 输入 | exact manifest、release、consumer confirmation | “已闭合”合同 |
| historical material | 污染审计线索 | 无 | 任何数字、成功、产品或结论 |

### 设计闭环预判

| 复核项 | 当前结论 | 影响 |
|---|---|---|
| 字段 / DTO | local contract 可索引；positive result/ref 仍受 B01/B02、MI-UP | 相关 boundary blocked |
| 状态 | 19 matrix / 20 subject 已有正式名称 | 可规划纯 guard 与负向测试 |
| metadata / idempotency | key namespace、stored result、in-flight recovery 未闭 | 不激活 write/replay |
| projection | read-only 方向明确；Unavailable recovery 缺函数 | query 可规划，rebuild positive blocked |
| artifact materialization | 只允许 typed handoff gap | 不生成 Artifact ref/digest |
| phase boundary | 可按 capability chain 分阶段，不能跨阶段借用后续结果 | Step 5/6 继续审计 |

## 回填草稿

> 本实施计划承接正式 00~06 及其校准材料。目标实现仓尚不存在，immutable design baseline 尚未固定；因此本计划可以定义 planned phase、boundary、gate 和 handoff 规则，但不得把任何 planned 记录写成实现、测试、证据或 readiness 事实。所有未闭合的 owner、UoW、result/replay、terminal persistence、recovery、event、Artifact 和 consumer 合同均保持 blocked。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 目标仓是否创建并可核验 | 阻塞 PH-01/commit-01-a 激活 | PH-01 activation 前 |
| immutable baseline 与 Git identity | 阻塞所有真实提交 | 首个 boundary 开工前 |
| MI-UP-001~009、Q-MI-001~004 | 阻塞受影响正向 lane | 对应 boundary 开工前，未闭则保持 blocked |
| B01/B02/B03/OPEN/PF | 阻塞 mutation、replay、terminal persistence、recovery | 对应正向 boundary 开工前 |

## 进入下一步条件

- [x] 正式输入文件存在并区分 authority / pending / historical。
- [x] 缺失与冲突已按 blocker、risk、deferred 分类。
- [x] 已确定可以在不伪造实现事实的前提下继续 Step 2~13。
