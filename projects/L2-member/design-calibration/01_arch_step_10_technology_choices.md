# Step 10. 关键技术选型

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 10
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.11
> 回填位置: 正式 `01-架构设计.md` §11
> 日期: 2026-08-22
> 状态: `pass`
> 串行门禁: Step 1~9 已通过;本文件通过前未创建 Step 11

## 1. 本步输入与“技术”口径

| 输入 | 已收敛约束 |
|---|---|
| Step 2 goals / constraints | owner 唯一、body-free、依赖真实、pending 不伪造。 |
| Step 7 dependency | 五类 inward dependency roles;Core 唯一 compile candidate。 |
| Step 8 data / consistency | local logical strong、external eventual、unknown fence、projection rebuild。 |
| Step 9 communication | sync admission、async committed fact / feedback、background qualified continuation。 |

本步的“技术机制”指会长期影响 owner、依赖、数据、一致性、失败和演进的架构机制,不是语言 / 框架 / 数据库 / transport / SDK 产品清单。具体产品只有在后续文档具备 owner、failure、workload 和 evidence 时才能选择。

## 2. SOP 问题回答

### 2.1 当前正式采用哪些关键架构机制

| ID | 技术机制 | 解决的问题 | 采用理由 | 代价 / 新风险 |
|---|---|---|---|---|
| `TM-L2M-001` | Bounded contexts + inward dependency inversion | 外部 host / Runtime / Bus / Governance / Tools 侵入 member core | 让 Core 只依赖共享 primitive / local rules,adapter / carrier 服从 inward boundary | boundary / translation / error 分类增加。 |
| `TM-L2M-002` | Core-authoritative shared contracts | 多仓各造 ID / ref / envelope / trace / error schema | 只有 Core 是 compile authority;CloudEvents / W3C 等共享类别从 Core 承接 | member-specific contract 必须等待 Core / owner 闭口。 |
| `TM-L2M-003` | Truth / snapshot / projection / ref / forbidden-body separation | external truth 和正文进入 member,projection 成为第二写源 | 明确唯一 owner、freshness、可重建和禁止正文 | 需要更多数据分类、resolution / stale / gap 状态。 |
| `TM-L2M-004` | Anti-corruption External Context Mirror | 多个外部 owner 语言 / schema / freshness 直接扩散到核心 | source-specific adapter 转为 neutral ref / safe result / gap | mirror 若治理不严会膨胀为 registry / integration hub。 |
| `TM-L2M-005` | Source-anchored local decision | 筛选 / 投递 / 出站 / trace 无法解释依据 | 每个决定绑定 subject、source、scope、correlation 和安全分类 | 需要稳定 identity / causation 和 incomplete handling。 |
| `TM-L2M-006` | Local-truth-first + explicit attempt / gap | 外部 delivery / observed / accepted 回滚本地事实 | 本地决定先成立,外部协作独立最终收敛 | 运维 / 查询必须理解多层状态,不能只看一个 success。 |
| `TM-L2M-007` | Immutable / append-oriented history | late / duplicate / correction 原地覆盖历史 | 新反馈 / correction 形成新关联事实,便于追责 | history / retention / compaction 物理策略尚待设计。 |
| `TM-L2M-008` | Idempotency / ordering / correlation boundary | at-least-once / duplicate / out-of-order 造成 truth 分叉 | 以 source identity / correlation 分类重复与迟到,unknown 不盲重放 | idempotency key / ordering 物理合同仍 pending。 |
| `TM-L2M-009` | Fail-closed precondition + unknown-side-effect fence | 主语 / rule / credential / external result unknown 时默认继续 | 正确性优先;blocked / waiting / degraded / gap 均可审查 | availability 下降,需要 resolution / operator path。 |
| `TM-L2M-010` | Sync admission / async fact / background continuation separation | 全同步长链或全异步缺少即时判定 | 即时边界只回答受理,长时结果与 maintenance 解耦 | 多路径 correlation 和 failure handling 更复杂。 |
| `TM-L2M-011` | Transport-neutral member / Runtime and host seams | UDS / gRPC / server direction 反向定义业务边界 | 先锁 acceptance / result / handoff 语义,等待正式 mapping | 正向 adapter 暂不能声明 ready。 |
| `TM-L2M-012` | Body-free safe material gate | raw body、hidden reasoning、secret、definition body 扩散 | inspection / truth / handoff 分层,只输出最小 source-anchored material | 调查信息更少,需要 ref 回源和安全分类。 |
| `TM-L2M-013` | Derived read model / projection isolation | summary / outlet / diagnostics 阻塞核心或反写真相 | async projection + sync safe read + background rebuild;freshness 显式 | projection lag / rebuild gap 和读一致性成本。 |
| `TM-L2M-014` | Capability outlet as optional ref-derived projection | member 形成第二 registry 或被 capability source 拖垮 | 只从 Tools / method ref 派生,可裁剪且非 authorization | 初期能力可见性可能缺失 / stale。 |

### 2.2 每个机制为什么不用其他方案

| 当前机制 | 未采用的轻量替代 | 不采用原因 |
|---|---|---|
| inward dependency inversion | core 直接调用 sibling SDK / model | 形成 package / schema 耦合并转移 external truth。 |
| Core shared authority | member 复制 shared DTO / event schema | 产生第二 contract owner,L2M-UP-005 被伪闭口。 |
| data class separation | 一个统一 MemberState / event log 保存所有内容 | truth / snapshot / body 混写,forbidden persistence。 |
| local-truth-first | 分布式 transaction 或 external success 后才提交本地决定 | 跨 owner 耦合,且外部系统不提供当前 atomicity authority。 |
| append history | in-place update 只保留当前状态 | 迟到 / correction / owner feedback 无法追溯。 |
| unknown fence | timeout 即自动 retry / restart | 可能重复不可逆副作用并接管 Runtime / host lifecycle。 |
| mixed communication semantics | 全同步或全异步 | 前者级联 / 伪完成,后者缺即时 admission。 |
| derived read model | core truth 直接暴露给 SDK / UI | 下游绑定 internal model并可能反写。 |
| transport-neutral seam | 固定 UDS gRPC / external gRPC | mapping / direction / schema 无当前 authority。 |

### 2.3 机制适用到哪些架构单元

| 架构单元 | 必须采用的机制 |
|---|---|
| BC01 Presence / Host | TM-001~005、007~012 |
| BC02 Inbound | TM-001~005、007~012;TM-012 尤其约束 transient body |
| BC03 Runtime Mediation | TM-001~011、012 |
| BC04 Outbound | TM-001~012;TM-006 / 012 为主 |
| BC05 Trace | TM-002 / 003 / 005~010 / 012 |
| BC06 Mirror | TM-001~004 / 008~011 |
| BC07 Read Model | TM-002~004 / 008~010 / 012~014 |

## 3. 当前明确不采用 / 不锁定

| 候选 | 当前口径 | 原因 / 进入条件 |
|---|---|---|
| Rust / Go / Python 等语言 | 不锁定 | 无实现 / workload / team / toolchain authority;后续 07 / implementation decision。 |
| UDS gRPC / TCP localhost / pipe / shared memory | 不锁定 | L2M-UP-003 mapping / failure / backpressure 未闭口。 |
| member-service gRPC server / client / fixed port | 不锁定 | L2M-UP-001 的方向、fields、credential / IPC contract pending。 |
| supervisord / sidecar / single process / fixed dual process | 不锁定 | 只锁逻辑 runtime boundary;物理 topology 与 lifecycle owner 后移。 |
| JWT / launch_token / credential TTL | 不锁定 | credential issue / revoke owner 和形态 pending。 |
| PostgreSQL / embedded DB / object store / cache | 不锁定 | transaction / durability / retention / workload 未闭口。 |
| queue / scheduler / retry library | 不锁定 | Bus / continuation / idempotency physical contract 未闭口。 |
| full event sourcing | 不采用为当前硬机制 | append history 不要求全部 state 由 event replay;外部 side effect 也不可重演。 |
| shared database / two-phase commit | 不采用 | 破坏 owner separation,无跨仓 atomicity authority。 |
| member-specific CloudEvent type / AG-UI family / route | 不锁定 | Core shared envelope authority 有效,具体 family / route 受 L2M-UP-004 / 005 阻塞。 |
| generic external listener / provider adapter | 禁止 | 超出 member boundary并绕过 capability / Runtime -> Tools 链。 |
| fixed P95 / SLA / retry / heartbeat values | 不锁定 | 无 workload / measurement evidence。 |

## 4. 当前文档问题诊断与前后对比

| 旧选型 | 当前状态 | 替代机制 |
|---|---|---|
| Rust facade | historical | 语言中立的 logical runtime boundary。 |
| UDS gRPC | historical / pending | transport-neutral sync entry + async committed result。 |
| rule Attention module | historical | source-anchored four-state screening + safe material gate。 |
| supervisord dual process | historical | logical owner separation;physical topology pending。 |
| launch_token JWT | historical / pending | credential ref + fail-closed verification。 |
| CloudEvents only / AG-UI | shared envelope category partially revalidated;family historical | Core-authoritative contract + member-specific route pending。 |
| retry / reconnect / restart | historical | explicit gap + idempotency / resolution prerequisite + unknown fence。 |
| direct audit event | historical | body-free safe material + local attempt / observed external。 |

## 5. 设计取舍结论

当前选择的是“正确边界优先于早期联通”的机制组合。收益是 owner、数据、失败与追溯可证明;代价是更多状态分类、ref resolution、projection lag、adapter 和 gap 处理。这个代价是有意识接受的,因为用单一 `success`、共享 model、固定 transport 或自动 retry 换取表面简单会直接破坏正式需求红线。

## 6. 结构化中间产物与回填草稿

- 正式机制: `TM-L2M-001~014`。
- product / transport / language / storage / process manager 全部未锁定。
- Core shared contract authority 与 member-specific schema / route pending 明确分层。
- 每个选型均说明问题、采用理由、代价和不采用方向。

正式 §11 回填关键技术机制表、当前不采用表和边界说明。不得把 historical product / protocol 恢复为当前选择,不得把 adapter / fake / planned seam 写成实现完成。

## 7. 门禁自检

| 检查项 | 结果 |
|---|---|
| 每个机制是否说明解决问题、理由和代价 | pass |
| 是否选择了保护 owner / data / consistency / failure 的架构机制 | pass |
| 是否把部署事实 / API /协议 /实现细节当选型理由 | pass:未使用 |
| 是否继承 Rust / UDS / gRPC / supervisord / JWT /固定 SLA | pass:未继承 |
| 是否保留 Core shared authority 与 member-specific pending 的差别 | pass |
| Step 10 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_11_alternatives_tradeoffs.md`;正式 `01` 仍禁止修改。
