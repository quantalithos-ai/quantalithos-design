# Step 2. 明确验收目标与范围

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 2
> 回填章节：06-验收标准.md §2
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_02_scope.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 2 明确验收目标与范围 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | Step 1；00 §2/§4/§7/§14；03 §5~§9；05 §2 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_02_scope.md |

## 2. 本步目标

裁决 L2-member 是否作为 AI Member 容器内运行态主体、成员门面、入站筛选、出站交互、追溯与摘要 / 能力出口的 member-local 边界成立。P0 关注本仓真相与 fail-closed；P1 只在 owner 合同闭合后做 selected seam；P2 只保留未来能力。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| Step 1 输入边界 | 固定权威层级和历史隔离 |
| 00 §7、§9~§14 | 五个核心能力、功能、规则、AC / VF |
| 01 §4~§10 | 七个 BC、owner、依赖方向和架构红线 |
| 03 §5~§15 | 七模块、协议、状态、事务、配置、观测和测试切口 |
| 05 §2、§5、§14 | P0/P1/P2、TC / EV 覆盖和 residual |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 核心裁决目标是什么？ | C-L2M-1~5 及其 member-local truth、边界、可追溯、安全和派生只读语义是否成立。 |
| P0/P1/P2 如何划分？ | P0：双锚在场、筛选 / 投递、出站安全材料、追溯、摘要边界、七模块协议、状态 / UoW / replay、配置、redaction、依赖和证据完整性。P1：真实 host / Runtime / Bus / resolver / image / durable-like / outlet 正向资格。P2：非项目型主语、容量 / 硬 SLO、深度产品集成和未来体验。 |
| 哪些下游只验接缝？ | Runtime、Tools、member-service、member-images、Core/Bus、Identity、Work、Governance、Conversation、Artifact、Observability、SDK 只验 ref / safe result / attempt / gap / blocked，不验其内部 truth。 |
| 非范围如何影响结论？ | P1/P2 不可用本身不使 P0 失败；但若被伪装成 P0 pass、或缺 residual / owner / acceptance，就会导致证据或结论不成立。 |
| 哪些范围可能一票否决？ | 核心 C1~C4 断裂、错主语放行、foreign truth 反写、正文 / secret 泄露、external accepted/delivered/observed 伪装、任意外联、非 Core package、blocked / planned 伪造、关键事实不可回链。 |
| 哪些必须使用正式字段 / 状态 / 接口？ | 10 Command、16 Query、14 Consumer、24 blocked candidate、5 Job、28 状态主语、正式 ref / version / disposition / result carrier 和配置 profile。 |

## 5. 当前文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧 06 | 以旧 persona / endpoint 组织范围，未覆盖 Query、Consumer、Job、projection、dependency、evidence | 新版按 CP01~CP07 和验收主题重建 |
| 05 | 测试范围已细化，但 06 需要明确“裁决什么” | 将测试范围转成 P0/P1/P2 验收目标 |
| 并行兄弟 | exact seam 未稳定 | 只验本仓可证的 local / negative / blocked-aware 结果 |

## 6. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 核心 | “成员能展示 / 能交互” | member-local truth 与安全接缝是否可裁决 |
| 外部成功 | 易误写 accepted / delivered | 只写 attempt / gap / blocked / unknown |
| 优先级 | 旧功能一揽子 | P0 核心与红线、P1 selected seam、P2 future |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否按旧功能表验收 | 继续旧表 / 按当前 CP 与 AC 重建 | 按当前 CP 与 AC 重建 |
| P1 正向联调是否为 P0 前置 | 是 / 否 | 否；P1 只能作为条件化 selected-run |
| 是否把能力出口正向激活列为核心前置 | 是 / 作为安全视图 P0、正向激活 P1 | 后者；安全视图边界 P0，授权 / invocation readiness 不在本仓 |

## 8. 结构化中间产物

| 验收范围项 | 类型 | 优先级 | 裁决目标 | 非范围 / 说明 |
|---|---|---:|---|---|
| CP01 双锚启动、presence、host local material | 功能 / 红线 | P0 | 项目型 ProjectMemberRef + GlobalMemberRef、startup / presence 和本地协作记录可判定 | host acceptance、session、health、credential issue 外置 |
| CP02 scope、inbound fact、screening | 功能 / 安全 | P0 | 四态筛选、来源回链、瞬时检查和无正文持久化 | policy truth、taxonomy、Bus delivery 外置 |
| CP03 Runtime mediation | 功能 / 接缝 | P0（负向）/ P1（正向） | typed delivery、attempt、result link、reception 和 unknown fence | Runtime loop / plan / outcome 外置 |
| CP04 outbound | 功能 / 安全 | P0 | committed safe material、decision / attempt / gap 分层 | delivery / accepted、24 candidate 物化外置或 blocked |
| CP05 trace / observation | 追溯 / 观测 | P0 | correlation、body-free、低敏诊断和本地 attempt | observability backend、observed truth 外置 |
| CP06 mirror | 派生 / 依赖 | P0（保守）/ P1（正向） | owner-specific ref、freshness、stale / gap / blocked | authorization、registry、health 外置 |
| CP07 summary / outlet | 派生读模型 | P0（summary / boundary）/ P1（正向 outlet） | committed-only projection、rebuild no-write、安全视图 | UI、definition body、invocation 外置 |
| 七模块 / public surface | 架构 / 协议 | P0 | 7 模块、10/16/14/24/5 分母和 28 状态主语可裁决 | 具体物理产品和部署不在本轮 |
| 配置 / 证据完整性 | 支持门禁 | P0 | profile、strict validation、redaction、artifact/report pairing 和事实等级 | 真实执行值尚未生成 |

### 8.1 P0/P1/P2 裁决关系

```text
P0 member-local contract + negative/blocked-aware seam
        |
        +--> required for 通过
        |
P1 owner-approved positive seam
        |
        +--> optional selected-run / residual
        |
P2 future capability / capacity
        |
        +--> not a current acceptance prerequisite
```

## 9. 回填草稿

正式 §2 应声明 P0/P1/P2、只验接缝和明确非范围；任何 P1/P2 缺失不得被写成 P0 通过或失败。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 非项目型 / personal subject | future scope | L2M-UP-008，当前 reject / blocked |
| real-like owner seam | P1 qualification | 合同闭合后定向重审 |
| workload / SLO | 非功能硬阈值 | 当前只保留结构性 sample |

## 11. 进入下一步条件

- [x] P0/P1/P2 范围和非范围可裁决。
- [x] 下游只验接缝且不改变 owner truth。
- [x] VETO 候选和正式字段 / 状态 / 接口范围已固定。
