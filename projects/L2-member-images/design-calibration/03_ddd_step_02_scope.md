# L2-member-images 03 详细设计 Step 2：明确本轮实现范围和非范围

> 创建日期：2026-08-25  
> 状态：`completed_pass`  
> 文档模式：`full-restart`  
> 回填位置：正式 `03-详细设计.md` 第 2 章（仅形成回填草稿，当前不得装配正式文档）  
> 前置：`03_ddd_step_01_upstream_boundary.md` 已通过。  
> 当前授权：用户允许继续至 Step 5；本 Step 完成后只可进入 Step 3，不得创建 Step 4 以前的跳步产物、不得写正式 03 或实施。

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 1 的上游关系映射与输入缺口、02 的目标 / 范围 / handoff、01 的依赖方向与一致性边界。 |
| 规范 | `详细设计讨论流程_SOP.md` Step 2、`详细设计书写规范.md` §5.2、`设计文档讨论中间产物规范.md`。 |
| 本步目标 | 明确本轮详细设计能交给实现者的“契约范围”，并把外部 owner、后续文档、future capability 和实际实施活动排除在外。 |
| 本步禁止 | 不把目标写成用户故事或功能需求复述；不写排期 / 开发任务 / commit；不因 pending external schema 缺失而给出虚构 public API。 |

## 1. Step 内计划与模块级门禁

| 子阶段 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 目标拆解 | §2 的设计目标表 | `done` | 每个目标都明确可交给实现者的代码契约成果。 |
| 范围裁剪 | §3 的范围层和非范围表 | `done` | current / conditional / future / excluded 与 02 一致。 |
| 取舍 | §4 的方案比较 | `done` | 未把详细设计变成实施计划或 owner 替代文档。 |
| 回填与自检 | §5、§7 | `done` | 正式回填仍关闭，Step 3 输入完整。 |

| 模块 / 范围 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| `ddd_scope` | done | done | done | done | done | done | `pass` | 进入 Step 3，收稳语言、编码和仓库约束。 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 本轮详细设计必须覆盖哪些模块？ | 必须覆盖承接五个业务主体的 planned implementation modules：definition / assembly、build candidate、qualification、supply entry、reference / derived；以及将其组织成 inbound / operations、application、domain、ports、persistence、projection 的实现角色。模块名和物理布局留给 Step 4/5 收稳，不能预设为五个服务。 |
| 2. 本轮必须定义哪些对象、接口、事件、job 和状态机？ | 必须定义本仓 private / neutral 的 object、guard、repository / port、command/query/job carrier、conditional inbound event boundary、函数级流、局部状态矩阵、history / projection、错误、配置引用与测试 seam。当前没有镜像域 outbound event；不得为其创建 active handler、topic、outbox 或 delivery state。 |
| 3. 哪些能力属于 P1 / 后续阶段，不应在本轮展开？ | restricted / read-only variant、multi-architecture identity、hardened base、outbound build / publish event 仅为 future / conditional；外部 backend product binding、evidence inventory / priority、consumer confirmation、Artifact formal ref、exact mapping / component / seed schema仅在 authority 到位后重开受影响 Step。 |
| 4. 哪些内容属于测试方案、实施计划、配置设计或运维手册？ | 05 负责完整测试策略与案例；06 负责验收门禁；07 负责 phase / commit boundary、implementation ledger 与 planned skeleton；04 负责 key/source/default/profile、部署和 secret binding；运维文档负责部署拓扑、告警和处置。03 只提供它们需要的实现切口、配置引用、最小验证方向和实施承接。 |
| 5. 实现者拿到本文后，应能完成哪些代码范围？ | 在后续 Step 6~17 全部完成并获得用户批准后，实现者应能创建 planned Rust repository 的本仓模块、private types、guards、ports、repositories、application handlers、projection rebuilders 和 test seams；能够实现 fail-closed local decision / history，而无需猜测外部 owner body 或协议。当前 Step 2 不表示实现已获准，也不表示 external integration ready。 |

## 3. 当前材料诊断

| 现象 | 若不裁剪范围的后果 | 本 Step 处置 |
|---|---|---|
| 00 的 `P0-core` 是能力完整性，而不是所有外部 integration 已 ready | 容易把 P0 理解为必须现在填完 consumer、Artifact、event、mapping 的 exact schema | P0 的本仓 invariant / neutral seam 进入 03；受 owner 限制的 positive lane 继续 blocked。 |
| 02 已提供 Command / Query / conditional Event / Job 骨架 | 容易提前当作产品 API / transport contract | 03 要定义本仓协议 carrier 和 handler boundary；route / topic / external DTO 仍排除。 |
| 03 的书写规范要求测试、配置、实施承接 | 容易把 03 写成 04~07 的替代物 | 只定义 code-level reference / seam / handoff；不写完整策略、环境矩阵、排期或执行证据。 |
| 未来 scope 已有名称 | 容易为未裁定功能建立可实现对象、enum 或 Cargo feature 并计入 current | future 只保留触发条件和重开点，不进入本轮 type / state / protocol 交付面。 |

## 4. 设计取舍

| 方案 | 收益 | 风险 / 代价 | 结论 |
|---|---|---|---|
| A. 以功能需求编号逐项组织详细设计 | 追溯直观 | 跨模块对象、port 和状态会重复，难以 1:1 实现 | 不采用；需求追溯保留为后续索引。 |
| B. 以五业务主体和正交实现角色组织模块契约，并让每项能力回指 00 / 02 | 符合详细设计模块主轴，可保留 staged decisions | 需要在 Step 4/5 额外收稳物理布局和依赖图 | 采用。 |
| C. 为消除 pending 直接扩大范围至 sibling / upstream owner 实现 | 看似端到端完整 | 越权、制造循环合同、违反用户只修改本项目目录的范围 | 不采用。 |

## 5. 结构化中间产物

### 5.1 本轮详细设计目标表

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 形成可落码的模块主轴 | 将五业务主体与正交实现角色映射为 planned crate / module / file 及允许依赖 | 可创建的目录和模块职责表；不把业务主体误当部署服务。 |
| 完成本仓 truth object 契约 | 为 definition、baseline / revision、intent / attempt / candidate、provenance / gate / eligibility、availability / entry / history、reference / gap / projection 定义字段、构造、函数和不变量 | private Rust types、guards、state enum 与 append / supersede 约束可直接实现。 |
| 完成边界 seam 契约 | 为 runtime / ref / adapter / fake / conditional event 明确 port、carrier、错误和 owner boundary | 能实现 neutral / fail-closed seam；外部 exact contract 未到时不会被猜成 positive integration。 |
| 完成流程与一致性契约 | 把 command/query/job 与局部状态轴展开为函数级流、transaction、idempotency、unknown recovery 与 projection rebuild | application handler、repository / UoW 和 state matrix 可互相回指。 |
| 为下游文档提供实现输入 | 定义配置引用、observability safe category、test seam 与实施承接，不替代下游文档 | 04~07 可引用的 code binding / minimal verification / implementation dependency 输入。 |

### 5.2 本轮范围层

| 范围层 | 03 纳入 / 保留内容 | 实现级上限 |
|---|---|---|
| current | 本仓 definition、baseline、revision、intent、attempt、snapshot、candidate、provenance、gate evaluation、eligibility、availability transition、entry、handoff/gap、external snapshot、trace、projection 的私有实现契约 | 可定义本仓字段、函数、history、port、repository、guard、错误和 state；所有正向阶段保持分离。 |
| current | nightly build-intent 来源、reconciliation、refresh、projection rebuild 等 operation shape | 可定义 job input / output 的本仓 carrier 和持久化范围；不声明 backend execution 或 job result。 |
| conditional | verified inbound build-request / source-refresh event、Artifact / consumer reconciliation、owner-safe conclusion refresh | 只定义 authority check、opaque/neutral carrier、rejected / pending / blocked / unavailable / gap 与 reopen condition。 |
| future | hardened base、restricted variant、multi-architecture dimension、outbound build/publish event | 仅记录 absence 和重开 trigger；不定义 current domain state、handler、protocol、product binding或 completion。 |
| excluded | RoleDefinition / mapping body、member component body、runtime loop、tool execution、live memory / checkpoint、seed semantic body、Artifact / governance / Sandbox / observability truth | 仅通过 owner-controlled ref / safe conclusion / gap 交接；不进入本仓 module ownership。 |
| excluded | container lifecycle、launch / health / consumer confirmation、marketplace / UI / product entrance | `InstantiableEntry` 只表达 local pinned supply；不创建或读取 live consumer truth。 |

### 5.3 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 完整测试策略、fixture、case 矩阵、coverage、测试执行结果 | `05-测试方案.md`；真实执行环境。 |
| 验收判定、evidence、verdict、signoff、readiness | `06-验收标准.md` 和授权的真实验收流程。 |
| 实施 phase、任务拆分、排期、commit boundary、implementation ledger | `07-实施计划.md`；当前不得提前创建 implementation ledger。 |
| 配置 key、source、default、profile、环境矩阵、secret / backend 产品绑定 | `04-配置设计.md`；03 仅定义读取点、类型类别和不可配置化边界。 |
| 部署拓扑、容器编排、告警阈值、故障处置 | 运维 / 部署文档和对应 owner。 |
| Role mapping、member release、seed content、Artifact reference、consumer contract 的 exact schema | `L3-method-library`、`L2-member`、seed owner、`L1-artifact`、`L2-member-service` 的正式 owner 文档；当前为 pending。 |
| builder / registry / evidence backend 选型与 credential | `Q-MI-003` 关闭后由配置 / 运维边界承接；03 仅保留 product-neutral port。 |
| restricted / multi-arch / hardened base / outbound event 的实现 | future 条件重新授权后，重开 02/03 受影响 Step。 |

### 5.4 可交付给实现者的边界矩阵

| 交付面 | 后续详细设计应完成 | 当前不承诺 |
|---|---|---|
| Domain | private value / entity / policy / state / invariant；history append 和 supersede | 已存在 Rust crate、已编译实现或任何 external truth body。 |
| Application | command/query/job handler、idempotency / correlation、UoW 编排和 conservative result | HTTP/API endpoint、event topic、真实 scheduler / builder job。 |
| Ports / adapters | inward port trait、opaque ref / safe conclusion / gap carrier、fake parity | 对端 exact schema、真实 SDK、positive callback / confirmation。 |
| Persistence / projection | repository contract、transaction boundary、read-only rebuild / freshness | 已选 DB、DDL、migration、运行数据或 projection report。 |
| Downstream handoff | implementation dependency、test seam、configuration binding points | 实施排期、测试结果、验收证据、发布 / rollback 执行事实。 |

## 6. 正式文档回填草稿（暂不写入）

### 6.1 第 2 章《本次详细设计目标与范围》草稿

正式 03 应采用 §5.1 的目标表和 §5.3 的非范围表。正文应强调：本轮设计交付的是本仓可实现的模块、对象、端口、流程、状态和一致性契约；它不交付实际代码、外部协议、运行结果、完整测试 / 配置 / 实施方案。conditional 与 future 项只给出 fail-closed 或重开边界，不能计入当前实现完成面。

## 7. 待确认事项

- `MI-UP-001~007` 对应的 exact positive lane 继续保留为条件阻塞，不改变 Step 1 的输入缺口表。
- Step 4 的布局选择必须基于本仓不存在、仅能 planned 的实现仓现实，不能以将来可能存在的多 binary / 公共 crate 预设 workspace。
- 本轮用户的 Step 5 停点不等于已批准 Step 6 对象契约或正式 03；本文件只收稳了后续讨论范围。

## 8. 完成审计与下一步门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 目标为实现契约目标而非需求复述 | `pass` | 每个目标均指向 module/type/port/flow/state 或下游输入。 |
| current / conditional / future / excluded 已分层 | `pass` | 与 02 范围和 `MI-UP` / `Q-MI` 上限一致。 |
| 非范围已指出正确 owner 或文档 | `pass` | 04~07、运维和 external owner 均未被本仓替代。 |
| 未写实施排期、测试结果、配置全集或外部 positive schema | `pass` | 03 范围未越界。 |
| 未进入 Step 3 或创建未来 Step 文件 | `pass` | Step 3 仅在当前 Step 完成后可创建。 |

```text
step_status = completed
gate_status = pass
gate_reason = scope_and_non_scope_are_implementation_contract_bounded
next_allowed_action = create_and_complete_step_03_constraints
formal_03_write_allowed = false
implementation_allowed = false
commit_required = false
```
