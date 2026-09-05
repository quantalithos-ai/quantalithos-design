# Step 3. 收稳约束条件

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 3
> 回填章节: `02-概要设计.md` §3 约束条件
> 生成日期: 2026-08-23
> 状态: completed / pass / stop_review
> 正式 02 写入: forbidden until Step 14

## 1. 本步目标与边界

只保留会直接改变代码主体、对象、接口、处理流或状态判断的硬约束。泛化工程口号、产品偏好、配置键、数据库约束、测试步骤和运维规则不进入本 Step。

## 2. 本步输入

| 输入 | 提取内容 |
|---|---|
| Step 1 上游边界 | stable / pending / blocked 与禁止脑补合同 |
| Step 2 目标 / 非范围 / 深度 | 概要层允许和禁止展开的边界 |
| 正式 00 `BR-L2M-001~030`、`NFR-L2M-001~016`、`VF-L2M-001~009` | 可改变结构的业务、安全、一致性与证据红线 |
| 正式 01 §8~§13 | 依赖、数据、一致性、通信、机制与横切约束 |
| Runtime / Tools / Core / Bus 正式 02 | 外部对象 / port 的 owner 与合同深度上限 |

## 3. SOP 问题回答

### 3.1 哪些约束直接影响对象、接口、处理流或状态机

可分为八组:

1. 主体与 owner:项目执行主语唯一、external truth 外置。
2. 输入 / 输出内容安全:瞬时检查与持久化分离、所有持久材料 body-free。
3. 决定分层:screening、Runtime admission、outbound、delivery、observed / accepted 分离。
4. 一致性与历史:local truth first、append / supersede、duplicate / late / unknown fence。
5. 外部语境:Mirror 只解析 ref / safe snapshot,不授权、不成为 registry。
6. 派生读取:projection 可重建、不反写、freshness / gap 可见。
7. 依赖与交互:Core-only compile、正式 host / Runtime / Bus seam、同步 / 异步 / 后台分离。
8. 开放合同与事实纪律:pending 不闭口、fake / design file 不构成 readiness。

### 3.2 约束来源如何区分

| 来源 | 本步承接方式 |
|---|---|
| 正式需求 | 约束“必须 / 不得”能力与失败行为 |
| 正式架构 | 约束 owner、层间依赖、一致性和交互类别 |
| 全局依赖规则 | 约束 compile / runtime / event 与 ref / adapter / fake 分类 |
| 正式上游 02 | 约束引用哪些外部对象 / safe view,以及 member port 不得声称什么 |
| sibling 当前材料 | 只验证 owner 无漂移;不提供 exact schema 或 ready 事实 |

### 3.3 哪些边界若不先写清最容易串仓或滑入详细设计

- 把 `ProjectMemberRef`、`GlobalMemberRef` 和本地 presence 当成一个 member persona。
- 把四态 screening 写成 Policy decision,或把 Runtime admission 写成 member delivery state。
- 把 Runtime `SafeHandoffMaterial` 复制为 member outcome,或把 Bus delivery / downstream accepted 写回 outbound decision。
- 让 External Context Mirror 自动刷新 / 授权 / 修复 source,或让 capability outlet 成为第二 registry。
- 用 sibling package / schema、UDS / gRPC、topic、JWT、DB / queue 提前定义业务骨架。
- 用 retry 实现掩盖 unknown side effect,或用 projection / Query 隐式改 truth。

### 3.4 哪些只是泛化工程原则,不应进入正式约束

“高内聚低耦合”“代码可读”“遵循最佳实践”“高性能”“高可用”“易扩展”等无法直接判断具体对象 / 接口 / flow / state,不进入正式表。只有被具体化为 owner、body、state、history、dependency、failure 或 evidence 边界的约束才保留。

### 3.5 每条约束如何指导后续设计

每条正式约束必须至少命中 Step 4~11 之一,并能回答一个可判定问题:某对象能否存在、某字段 / body 能否保存、某 API 能否写、某状态能否迁移、某 port 能否直连、某配置能否改变 invariant、某 external status 能否回写。不能命中这些问题的内容不进入约束基线。

## 4. 当前材料问题诊断

| 问题 | 风险 | 修正 |
|---|---|---|
| 正式 00 / 01 共有大量规则,若全部复制 | §3 膨胀为上游复述,后续无法找到真正结构门禁 | 合并为 20 条 `HLD-C-L2M-*` 约束并保留来源映射 |
| 旧 02 用“persona / binding / capability”边界规则 | 保护的是已废弃主语 | 由 subject / local truth / formal seam / projection 约束替代 |
| 旧安全约束只强调“未暴露能力” | 遗漏 raw body、hidden reasoning、external truth、unknown side effect | 建立全生命周期 body-free 与 fail-closed 约束 |
| 旧可用性依赖 SLA 和 last-known state | stale 值可能冒充 current,指标无 authority | freshness / gap 显式,不写数字、不 silent fallback |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 主体约束 | persona / execution binding | ProjectMember subject、GlobalMember anchor、local presence 三层分离 |
| 安全范围 | endpoint / capability 暴露 | inspection、truth、handoff、trace、projection 全生命周期边界 |
| 成功语义 | 运行态 / 能力可用笼统表达 | local decision / attempt 与 external status 明确分层 |
| 依赖 | sibling 和 hub 直接参与 | Core-only compile;正式 runtime / event / ref ports |
| 可用性 | SLA + 稳定快照默认 | stale / conflict / unknown 可见且 fail closed |

## 6. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 约束按上游章节逐条复制 vs 按结构判断合并 | 按结构判断合并 | 保持可执行性和后续反查能力 |
| 将 pending 作为“临时默认值” vs typed blocked boundary | typed blocked boundary | 防止默认值取得 contract authority |
| 所有 history 都 event sourced vs append-oriented semantic history | 后者 | 不预定 persistence mechanism,但禁止原地抹写 |
| 强一致跨仓 vs local truth first | local truth first | owner 分离,无 distributed transaction authority |
| capability outlet 缺源时保留旧值 vs 显式 stale / gap / not_available | 后者 | 防止视图成为第二 registry |

## 7. 结构化中间产物

### 7.1 概要设计硬约束表

| ID | 约束 | 说明 / 后续影响 | 主要来源 |
|---|---|---|---|
| `HLD-C-L2M-001` | 项目型正向路径必须以可验证 `ProjectMemberRef` 为执行主语并关联 `GlobalMemberRef`;本地 presence 不替代二者 | presence 对象须保存 typed refs 与 acceptance,invalid / conflict / non-project 不得进入 ready | BR-001/002;D01;ADR-0004 |
| `HLD-C-L2M-002` | member 只拥有 local presence / interaction truth;所有运行、工具、宿主、传递、治理、对话、身份等 truth 外置 | 对象池和写 API 不得出现第二 Runtime / Policy / Registry / Health / Conversation owner | BR-005/027;D03 |
| `HLD-C-L2M-003` | 授权入站检查只能瞬时发生;持久化、Runtime handoff、outbound、trace、projection 全部 body-free | 需要 transient inspection guard 与 forbidden-body rejection;不得有 raw body field | BR-011/015/021/030;CC002 |
| `HLD-C-L2M-004` | subscription scope 与每个 local decision 必须 source-anchored、scope-aware、correlated | 对象 / API 必须留 source、scope、correlation、category 类型槽位 | BR-007/008/020;TM005 |
| `HLD-C-L2M-005` | screening 只形成 passed / degraded / blocked / pending 的 member 预筛事实,不是 Policy 或 Bus truth | 独立 screening 对象 / 状态;rule unknown / stale / conflict 只能保守处置 | BR-008~010;CC001 |
| `HLD-C-L2M-006` | controlled delivery 与 Runtime admission / run / outcome 分离 | member 只保存 decision / submission attempt / result ref;exact trigger mapping pending | BR-011~013;L2M-UP-003 |
| `HLD-C-L2M-007` | Runtime committed material、member outbound decision、publication attempt、Bus delivery、observed / accepted 五层分离 | 出站对象、状态和接口不得使用单一 `success`;external feedback 只追加 link | BR-014~018;CC008 |
| `HLD-C-L2M-008` | 本地决定先提交,外部提交 / feedback 最终一致;外部失败不回滚本地事实 | 处理流需标 local commit 与 external handoff 边界,不建跨仓事务 | §9.2;TM006 |
| `HLD-C-L2M-009` | presence、decision、attempt、gap、feedback、resolution 采用 append / supersede 历史 | correction / late / retry 形成新事实,对象和状态禁止原地覆盖 | BR-003/013/018/023/026;TM007 |
| `HLD-C-L2M-010` | duplicate / late / out-of-order 必须幂等分类;side effect unknown 必须 fenced,不得盲重放 | 接口 / flow 需 idempotency / correlation slot 与 unknown resolution path | NFR-011/012;TM008/009 |
| `HLD-C-L2M-011` | host unavailable / unknown 不等于 terminated;member 不声明 accepted / session / health | presence 与 host collaboration 使用不同对象 / 状态,反馈只作 external ref | BR-004~006;L2M-UP-001 |
| `HLD-C-L2M-012` | Interaction Trace 只链接 committed local facts 与 typed external refs,不是完整日志 / evidence | trace 对象最小化、低敏低基数;trace / observation failure 不改 source fact | BR-020~023;CC005/007 |
| `HLD-C-L2M-013` | External Context Mirror 只做 neutral resolution / freshness / gap,不授权、不修复、不成为 hub / registry | source-specific adapter 服从 inward port;Mirror state 独立且不写 external truth | TM004;CC004;BC06 |
| `HLD-C-L2M-014` | summary / outlet / diagnostics 是最终一致、可重建、只读投影;不得反写 truth | Query 只读;projection failure 独立;freshness / gap / not_available 对 consumer 可见 | BR-024~026;TM013/014 |
| `HLD-C-L2M-015` | capability outlet 只消费 Tools / Method 正式 ref / safe view,不复制 definition / binding、不表示 authorization | outlet object 只含 ref / summary / availability;激活可裁剪 | FR-012;L2-tools formal 02 |
| `HLD-C-L2M-016` | 只有 Core 可成为 compile dependency;Runtime / host / Bus / truth owners 必须经 runtime / event / ref / adapter seam | Step 4 / 7 必须点名 inward ports,禁止 sibling package 和 shared mutable model | BR-028;DL01~05 |
| `HLD-C-L2M-017` | 只允许正式 host / Runtime / Bus / owner seam;禁止 generic listener、provider、MCP / A2A / API 和 Sandbox 直连 | External Boundary 只能出现限定 ports;外部工具行动经 Runtime -> Tools | BR-019;CC003 |
| `HLD-C-L2M-018` | 即时 admission、异步 committed fact / feedback、后台 continuation 必须分开 | Command / Consumer / Job 分类和 flow transaction boundary 不得混写 | TM010;§10.3 |
| `HLD-C-L2M-019` | `L2M-UP-001~008` 未闭口时只允许 blocked / waiting / degraded / stale / gap / fail-closed | exact schema / carrier / activation 进入 Step 13 / 03 blocked boundary,不得由配置绕过 | BR-029;D09 |
| `HLD-C-L2M-020` | 设计、fake、planned 或文件存在不构成实现 / integration / evidence / readiness | 本 02 和后续 port / flow 只陈述设计状态;禁止 positive execution 语言 | NFR-016;CC016;VF-008 |

### 7.2 约束到后续 Step 的覆盖

| 后续 Step | 必须反查的约束组 |
|---|---|
| Step 4 代码主体 | 002、013~018 |
| Step 5 组成部分 / capability | 001~019 |
| Step 6 对象 | 001~015、019 |
| Step 7 接口 / port | 003~007、010~019 |
| Step 8 处理流 | 003~013、016~019 |
| Step 9 状态 | 001、005~014、019 |
| Step 10 异常 | 001~020 |
| Step 11 配置 | 001~020,尤其 invariant 不可配置化 |

## 8. 回填草稿

正式 §3 使用 §7.1 的 20 条硬约束,正文可按主体 / 数据 / 决定 / 一致性 / 派生 / 依赖 / 开放合同分组展示。正式章节只保留“约束 + 说明”,来源细节留在本文件。

## 9. 待确认事项

没有新增阻塞 Step 4 的事项。若后续 Step 无法在不假设 exact sibling / Runtime / Core / Bus schema 的情况下定义 inward port,应回退本 Step,不得用历史协议补位。

## 10. 进入下一步条件与停审

| 门禁 | 结果 |
|---|---|
| 每条约束能指导至少一个后续结构判断 | pass;见 §7.2 |
| owner、data、state、dependency、failure、evidence 约束齐全 | pass |
| 未复制完整上游规则或泛化工程口号 | pass |
| 未写 DB / transport / schema / 配置实现 | pass |
| open seam 保持显式且不可被配置绕过 | pass |

Step 3 结论为 `completed / pass / stop_review`。下一允许动作是更新 flow / 项目台账至 Step 4,然后创建 `02_hld_step_04_code_subject_framework.md`。
