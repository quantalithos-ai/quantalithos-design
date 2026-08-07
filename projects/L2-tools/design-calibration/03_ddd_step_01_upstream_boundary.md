# L2-tools 03 详细设计 Step 1: 确认概要设计输入边界

> 创建日期: 2026-08-05
> 状态: completed
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/03_ddd_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/03-详细设计.md`
> 当前写入许可: 只允许本 Step 中间产物与 flow / ledger；正式 03 禁止写入。

---

## 1. Step 状态

### 1.1 Step 开工确认

| 项目 | 记录 |
|---|---|
| 当前文档 / Step | `03-详细设计.md` / Step 1 |
| 用户切换授权 | 已明确授权完成全部 03。 |
| 项目级台账 | 已读取；原恢复点为 `02_completed_stop_review`。 |
| 文档级 flow | 已创建；19 Step 总计划和 blocked seam 纪律已建立。 |
| 正式直接上游 | 当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。 |
| 关键解释性输入 | `02_hld_step_12_detailed_design_handoff.md`;`02_hld_step_13_risks_open_questions.md`;`02_hld_step_14_formal_document_assembly.md`。 |
| 旧正式 03 | `historical_material`;不作为语言、布局、对象、协议、状态或存储 truth。 |
| 当前实现仓 | `/home/aris/Projects/quantalithos-tools` 不存在；只可设计计划布局。 |
| formal write | false；Step 19 前不得修改正式 03。 |
| document switch | false；正式 03 完成后停审，不进入 04。 |
| commit | 不需要，且未经授权不得提交。 |

### 1.2 Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 标准 / 三层台账恢复 | done | §1 | pass |
| 正式 00/01/02 与概要承接扫描 | done | §2~§3 | pass |
| 41 对象 / public surface / flow / state 输入完整性 | done | §4 | pass |
| 上游关系与效力分层 | done | §7.1 | pass |
| 本文不再回答 / 必须回答 | done | §7.2~§7.3 | pass |
| 输入不足风险 / blocker 分类 | done | §7.4~§7.5 | pass |
| Historical material 后置差异审计 | done | §7.6 | pass |
| 回填草稿与门禁 | done | §8~§10 | pass |

## 2. 本步输入

| 输入 | 已读取内容 | 当前效力 |
|---|---|---|
| 正式 00 | 仓定位、五节点、功能 / 规则 / 数据 / 接口 / NFR / AC / VF、`L2T-UP-001~009`。 | 正式需求基线；本 Step 不重写。 |
| 正式 01 | A/S/P、R/T/D、owner、compile/runtime/event、交互与横切约束。 | 正式架构基线；本 Step 不重选架构。 |
| 正式 02 | 六组成部分、41 对象、接口、流、状态、异常、配置轮廓与 03 承接。 | 直接输入；详细设计必须 exact-expand。 |
| 概要 Step 12 | 41 对象、协议、流、状态、异常、配置和 blocked exit conditions。 | 解释性输入；与正式 02 冲突时以正式 02 为准。 |
| 详细设计 SOP / 书写规范 | 19 Step / 18 章、模块主轴、1:1 契约、Step 6~10 小循环。 | 强制标准。 |
| 中间产物 / 可落码标准 | 三层门禁、字段 / DTO / Query / state / phase / side-effect closure。 | 强制标准。 |
| Rust / 目录规范 | Rust、英文源码 / rustdoc、workspace / package / crate / file 规则。 | 当前工程 authority；不代表产品选型已定。 |
| sibling Core 实现 | `core-contracts` package / `core_contracts` crate 可检索；现有类型以 Core contract domain 为主。 | compile candidate 实况；没有 Tools-specific shared schema。 |
| 旧正式 03 | 旧 Rust service、RPC / HTTP、DB / cache / bus 和旧 tool registry / executor 主线。 | 只作污染扫描。 |

## 3. SOP 问题回答

1. 当前详细设计直接承接正式 02 的代码主体框架、六组成部分、41 个对象、13 Command、11 Query、5 Consumer、4 Event skeleton、4 Job、external / persistence / projection ports、12 流族、六状态族、56 异常、25 配置红线和 §12 承接清单。
2. 代码主体框架已足够稳定：业务组成部分与 Inbound / Application / Domain / Ports / Persistence / Projection 分层明确，external seam 状态也明确。但文件 / crate 布局仍须由 Step 3~5 在当前标准下闭口。
3. 关键对象、接口骨架、处理流和状态机足以继续展开：对象名称与概要字段骨架已全量存在，接口和状态归属明确。它们仍缺 exact schema、完整 callable、repository / UoW、DTO 构造、非法转换、错误和测试切口，这正是 Step 6~17 的职责。
4. 进入详细设计必须补清：shared vocabulary 与 typed refs；41 对象 exact fields / enums / functions；application carriers；Port / repository / UoW；public protocol secondary types；逐接口 flow；state matrix；persistence / consistency；typed error；idempotency；config binding；telemetry / audit；test cuts；implementation handoff。
5. 需求 / 架构不会在 03 重定义：Tool contract owner、Binding body-free、canonical invocation、pre-execution admission、authorization consumption only、Sandbox no-bypass、unique immutable outcome、outcome + audit local closure、four-gate safe material、formal re-entry、three dependency classes 与 non-goals 都是不可改写基线。

## 4. 上游输入完整性核对

| 输入类别 | 已收稳数量 / 范围 | 详细设计责任 | 当前结论 |
|---|---:|---|---|
| 主要组成部分 | 6 | 映射到工程模块与业务 submodule，不按组成部分拆 crate。 | sufficient |
| 关键对象 | 41 (`6/6/5/6/10/8`) | Exact Rust type、field、function、enum、invariant、source closure。 | sufficient_for_expansion |
| Command | 13 | Request / result / error / metadata / flow / UoW / idempotency。 | sufficient_for_expansion |
| Query | 11 | Request / response view / empty / invisible / stale / unavailable / no-write。 | sufficient_for_expansion |
| Inbound Consumer | 5 | Envelope / source / dedup / ordering / receipt / formal re-entry。 | mixed;3 blocked-aware |
| Outbound Event skeleton | 4 | Safe payload / envelope / candidate capture / local submission；route 受 blocker 约束。 | logical_only |
| Operations Job | 4 | Input / report / cursor / watermark / idempotency / no-subject-repair。 | sufficient_for_expansion |
| External / store / projection ports | 7 external + store groups | Exact trait / error / caller / implementer / adapter / fake。 | mixed;blocked-aware |
| 处理流 | 5 common + 12 families | 每个实际 public interface 独立 function flow；common helper 不抹平 owner / transaction。 | sufficient_for_expansion |
| 状态 | 6 owner-qualified families | 先筛选状态主语，再逐状态机 exact matrix。 | sufficient_for_expansion |
| 异常 | `EX-L2T-001~056` | Typed error / disposition / recovery owner / protocol mapping。 | sufficient_for_expansion |
| 配置边界 | `NC-L2T-001~025` | Typed candidate / validated config / builder / negative binding。 | sufficient_for_expansion |
| Blocker | `L2T-UP-001~009` | 形成 blocked protocol / error / test / pause condition，不作 positive readiness。 | open_by_design |

## 5. 当前文档问题诊断

| 问题 | 诊断 | 当前处理 |
|---|---|---|
| 旧正式 03 自带技术栈 | Rust service、RPC / HTTP、PostgreSQL、Redis、NATS 等没有从当前 00/01/02 重新获得 authority。 | 全部 historical；Rust 只由当前编码 / 目录标准重新进入，产品与协议不继承。 |
| 旧核心模型 | Registry、Policy、Scope、Executor、MCP / builtin / callback 与当前 truth boundary 冲突。 | 不继承；41 对象为当前对象池。 |
| 目标实现仓缺失 | 无现有 Cargo / src / branch / git identity 可扫描。 | Step 4 设计计划创建布局；07 / 实施 preflight 再核实真实仓。 |
| Core contract coverage 不足 | `core-contracts` 实仓存在，但未发现 Tools-specific package / schema。 | 保留 `L2T-UP-008`；只可引用经实际检索确认的 generic types，Tools types 不伪造。 |
| External positive seams 未闭口 | Authorization、Sandbox mapping / receipt、Observability producer / route、SDK client 缺正式合同。 | L2 local logical / negative contract 可设计；positive provider / e2e readiness 仍 blocked。 |
| 概要对象字段是 skeleton | 字段类型命名存在但未形成 public / domain / persisted schema 权属。 | Step 6 / 8 / 11 分层闭口，不在 Step 1 偷填。 |

## 6. 改动前后对比

| 项 | 旧正式 03 | 当前详细设计输入边界 | 原因 |
|---|---|---|---|
| 真相主线 | Registry / policy / executor 与工具库存。 | Tool contract / Binding / canonical invocation / precondition / outcome + audit / integrity-derived。 | 承接当前 00~02。 |
| 工程事实 | 假定现成 Rust 服务与固定基础设施。 | Rust / workspace 是当前标准约束；实现仓不存在；产品技术保持未选。 | 分离标准 authority 与 historical guess。 |
| 对象规模 | 旧少量对象和 DTO。 | 41 对象全部进入 Step 6 exact-contract gate。 | 不允许摘要丢对象。 |
| Public surface | 固定 transport endpoint / callback。 | `13/11/5/4/4` logical public families + blocked-aware ports。 | Transport 与 route 不等于业务协议。 |
| 状态 / outcome | Execution / callback / delivery 混合。 | 六状态族；source、assessment、handoff attempt、terminal outcome、audit、external refs 分权。 | 防止跨 owner 覆盖。 |
| 外部缺口 | Fake / fallback 容易掩盖。 | 9 blocker 全部保留，positive path 明确暂停。 | 不伪造 readiness。 |

## 7. 设计取舍

- 采用“正式 00/01/02 为 authority、概要 calibration 为解释、旧 03 为 historical”的输入优先级。
- 采用“本地逻辑合同可闭口、外部 positive seam 保持 blocked”的分层，不因 blocker 全面停止 03，也不通过 fake schema 伪闭口。
- 采用 Rust / workspace 作为当前工程标准承接，但不把它解释为旧 03 技术栈整体复活。
- 采用 Core real package inspection；只引用可检索类型，Tools-specific shared type 缺失继续阻塞。
- 不在 Step 1 选择文件布局、framework、protocol、database、broker、scheduler、retry 产品或配置 key。

## 8. 结构化中间产物

### 8.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `projects/L2-tools/00-需求文档.md` | 仓定位、五节点、FR / BR / DR / IB / NFR / AC / VF 与九项 blocker。 | 将需求约束落实到 schema、callable、negative path、test cut 和 traceability。 |
| `projects/L2-tools/01-架构设计.md` | Owner、A/S/P 单元、R/T/D、三类依赖、数据归属、交互与横切边界。 | 落实 crate dependency、Port ownership、UoW、store / adapter / entry boundary。 |
| `projects/L2-tools/02-概要设计.md` | 六组成部分、41 对象、接口 `13/11/5/4/4`、12 流族、六状态族、异常、配置与承接。 | Exact Rust object、trait、protocol、flow、state、persistence、error、idempotency、binding、test。 |
| `02_hld_step_12_detailed_design_handoff.md` | 按对象 / public surface / flow / state / exception / config / blocker 的 03 展开清单。 | 作为 Step 6~18 逐项完成审计索引，不替代正式 02。 |
| Rust / 目录 / 依赖标准 | Rust、英文源码 / rustdoc、实现仓与 workspace 命名、compile/runtime/event。 | Step 3~4 收口可执行工程约束。 |
| sibling `quantalithos-core` real contracts | `core-contracts` package / crate 与当前可检索 generic types。 | Step 3 / 6 / 7 / 14 只引用真实存在的 compile surface；缺失 Tools surface 保持 blocked。 |

### 8.2 本文不再回答

- L2-tools 是否拥有 tool identity、formal definition、canonical invocation、normalized outcome 与 Tool audit truth。
- Hub、Authorization、Sandbox、Runtime、Bus、Observability、SDK 各自的 owner 是否应并入 L2。
- Binding 是否等于 authorization，execution requirement 是否等于 allow / deny，handoff attempt 是否等于 Sandbox lifecycle。
- Raw request / prompt / capture / provider response / secret / external document body 是否允许进入本地 truth。
- Outcome / audit 是否应等待 Bus / Observability，late material 是否可覆盖历史 anchor / terminal outcome。
- Compile / runtime / event 三类依赖及 Core-only compile 的架构裁剪。
- Search / diff / diagnostic / guidance / report 是否可以修复核心 truth 或成为核心前置。

### 8.3 本文必须回答

- 计划实现仓、workspace member、module / file、package / crate / binary 与依赖方向。
- Shared vocabulary、41 对象、必要 application / infra / entry carrier 的 exact Rust contract 和字段来源。
- Repository、UnitOfWork、idempotency、clock / id generator、external resolver / adapter / fake 的 trait contract。
- 13 Command、11 Query、5 Consumer、4 Event、4 Job 与全部 public secondary type 的 exact schema / validation / response / error。
- 每个 public interface 的 function-level flow、transaction、state、accepted side effect、error mapping 和 test cut。
- 状态主语筛选、逐状态机 enum / transition / illegal transition / correction / superseding contract。
- Store / key / version / history / attempt / audit / gap / projection / watermark 与 local atomicity。
- Typed errors、retry ownership、quarantine / blocked / unavailable / manual intervention 口径。
- Concurrency、idempotency key / digest / stored replay、dedup / ordering / late-conflict protection。
- Typed config candidate / validated config / runtime builder 与 external binding，不越过 25 条红线。
- Body-free telemetry 与 Tool audit 的分层、最小测试入口和 07 implementation handoff closure。

### 8.4 输入不足风险清单

| 风险 / blocker | 不足内容 | 影响范围 | Step 1 处理 | 后续暂停条件 |
|---|---|---|---|---|
| `L2T-UP-001~002` | Authorization owner / matrix / taxonomy / decision schema / freshness。 | Governed positive precondition。 | 保留 blocked；只定义 invocation-bound placeholder / fail-closed。 | 任何 positive allow provider / e2e test / readiness。 |
| `L2T-UP-003~004` | Sandbox command / source mapping、receipt、retry / DLQ / cleanup。 | Isolated execution handoff 与 source-backed outcome。 | 保留 blocked；只定义 L2 mapping responsibility / local attempt / errors。 | Concrete mapping、positive normalization、receipt-driven flow。 |
| `L2T-UP-005~006` | Observability producer / source / route / readiness。 | Post-outcome observation handoff。 | 保留 body-free / route-blocked / unknown contract。 | Observed result、route-ready test、implementation readiness。 |
| `L2T-UP-007` | Frozen upstream commit baseline。 | Reference / implementation preflight。 | 只引用 workspace file / section，不写 immutable commit。 | 任何 frozen baseline / evidence assertion。 |
| `L2T-UP-008` | Core Tools-specific package / schema。 | Compile shared types。 | Real package inspection；generic types only when exact;Tools surface blocked。 | Copy / invent / alias a missing Tools type。 |
| `L2T-UP-009` | SDK Tools client / wrapper / compatibility。 | Downstream client integration。 | Server schema / guidance only。 | SDK code、coverage、client-ready claim。 |
| Target repo absent | Cargo / files / branch / git identity / dependency graph 不存在。 | Step 4 / 07 implementation start。 | Design planned layout only。 | Claim existing code or implementation preflight pass。 |
| Product/backend unselected | HTTP / RPC / DB / broker / scheduler / telemetry backend 未定。 | Infra adapters and concrete config。 | Backend-neutral ports / stores / composition。 | Product-specific schema / API / DDL / config without authority。 |

### 8.5 输入充分性分层

| 层级 | 结论 | 允许推进 |
|---|---|---|
| Local domain / application truth | sufficient | 可以完成对象、callable、state、UoW、idempotency、store 与 negative path exact design。 |
| Public L2-owned logical protocol | sufficient | 可以定义 transport-neutral Command / Query / Consumer / Event / Job schema 和 error surface。 |
| Runtime / event seam shape | sufficient_for_blocked_contract | 可以定义 Port、request placeholder、local attempt、unavailable / blocked error 与 fake test seam。 |
| External positive provider / route / mapping | insufficient | 必须保持 blocked，不能声明 end-to-end executability。 |
| Implementation repository state | absent | 可以设计 planned layout，不能声明 code / build / test / commit state。 |

### 8.6 Historical material 污染清单

| 旧内容 | 与当前输入冲突 | 后续处理 |
|---|---|---|
| Local registry / allowlist / policy / scope truth | 吞并 Hub / authorization owner。 | 禁止继承。 |
| Builtin / MCP Client / provider inventory | 产品库存与外部 registry 不属于工具合同 truth。 | 禁止继承。 |
| Tool executor / host callback / Runtime loop | 吞并 Sandbox execution 与 Runtime orchestration。 | 禁止继承。 |
| Fixed RPC / HTTP / endpoint / DTO | 当前只收稳 transport-neutral protocol skeleton。 | 重新由 Step 8 定义 logical schema；transport binding 后移。 |
| PostgreSQL / Redis / NATS / fixed table / topic | 无当前 product authority。 | Step 11 / 14 只闭口 backend-neutral store / binding。 |
| Retry / replay / dead-letter owned by L2 | 跨越 Runtime / Sandbox / Bus owner。 | 只定义本地 idempotency / attempt / gap；外部 recovery 保持 owner。 |
| P95 / SLA / QPS / success rate / rollout | 无 measurement / evidence authority且越入下游。 | 不继承。 |

## 9. 回填草稿

正式 §1 应承接 §8.1~§8.3：以正式 00/01/02 为唯一上游主链，说明本详细设计继续展开 workspace、module、exact object / trait / protocol / flow / state / persistence / error / test contract；输入不足风险留在 §17，并在受影响章节以内联 blocked contract 表达。正式 §1 不写本 Step 的扫描过程、旧材料诊断或方案比较。

## 10. 待确认事项与进入下一步条件

### 10.1 待确认事项

- 本 Step 不新增新的上游 blocker；`L2T-UP-001~009` 原样继承。
- Rust edition / rust-version、七 member exact layout 和 Core generic type reuse 由 Step 3~4 在当前 authority 下继续收口，不在 Step 1 提前定论。
- 外部 positive seam 的 owner / schema / route 仍需相应正式 owner 闭口；未闭口前保守暂停受影响实现 boundary。

### 10.2 进入 Step 2 条件

| 条件 | 当前结果 |
|---|---|
| 正式 00/01/02 是否已读取并区分效力 | pass |
| 六组成部分、41 对象、public surface、flow、state 是否全量纳入 | pass |
| 本文不再回答 / 必须回答是否明确 | pass |
| 输入不足是否逐 blocker 标注影响与暂停条件 | pass |
| Rust authority 与旧技术栈是否分离 | pass |
| Core real package 与缺失 Tools schema 是否诚实记录 | pass |
| 旧正式 03 是否只作 historical pollution audit | pass |
| 是否未提前写正式 03 或后续 Step | pass |

```text
step_status = completed
gate_status = pass
gate_reason = formal 00/01/02 provide sufficient local object, protocol, flow and state inputs for exact design while all nine external seams remain explicitly blocked at their positive-contract boundaries
next_allowed_action = create_step_02_scope
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
