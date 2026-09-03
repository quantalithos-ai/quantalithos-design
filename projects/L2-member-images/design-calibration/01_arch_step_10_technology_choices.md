# Step 10. 关键技术选型

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `technology_choices` | pass | 10 项架构机制均说明问题、理由、代价与边界;产品、协议、语言、存储和具体 evidence inventory 全部保持 deferred | 进入 Step 11 备选方案与取舍 | `01_arch_step_02_goals_constraints.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md` |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 2 / 7~9、架构 SOP Step 10 与书写规范 §4.11。
- [x] 只选择会改变结构、边界、一致性或关键交互的机制。
- [x] 为每项机制回答解决问题、采用理由、代价 / 约束和架构级说明。
- [x] 区分 current 必要机制、conditional 机制与 deferred implementation carrier。
- [x] 比较并拒绝产品清单式选型和单体流水线机制。
- [x] 排除语言、框架、数据库、queue、CI、registry、scanner、signer 和协议产品。
- [x] 核对具体 evidence kind、event schema 和 Core schema 未被私造。
- [x] 形成正式 §11 回填草稿并执行 readiness 审计。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 2 AG / IC | 必须解决的结构问题和不可变红线 |
| Step 7 | 向内依赖、anti-corruption seam 和跨仓裁剪 |
| Step 8 | 本地强一致、跨域最终一致、ref / snapshot / projection 边界 |
| Step 9 | 同步判断、后台延后承接、conditional inbound event |
| 正式 00 NFR / VETO | 安全、追溯、幂等、恢复和否决口径 |
| ADR-0005 | Nightly、pinned、production no-`latest` |
| MI-UP / Q | 未闭口合同与产品 / evidence 选择上限 |

## 3. SOP 问题回答

1. 当前采用哪些关键架构机制?

   回答:采用向内防腐边界、immutable pinned input snapshot、分阶段领域判定、digest / provenance content identity binding、fail-closed authority-driven gate、append-only / superseding history、truth / projection separation、同步判断与后台延后承接分离、product-neutral adapter、local supply / Artifact / consumer state separation 十项机制。

2. 每个机制解决什么问题?

   回答:分别解决外部语义侵入、输入漂移、adapter success 串线、输出与来源脱锚、未知 gate 被默认通过、历史覆盖、读模型反写、长时任务伪同步、基础设施产品反向定义领域以及跨域 readiness 混写。

3. 为什么不用其他方案?

   回答:不采用直接复制上游正文、mutable selector、单一 pipeline success、全链共享事务、registry-as-truth、CI-as-domain、固定 evidence toolchain、event-first architecture 或 consumer-driven availability,因为它们会违反前序 owner、一致性、authority 或失败上限。

4. 每个选型带来什么代价或风险?

   回答:需要维护更多显式 decision contexts、refs、snapshots、gap / unknown 状态和历史;adapter 需要防腐转换;派生视图可能滞后;外部合同缺口会让 positive lane 挂起;下游必须理解 local / external state 分层。

5. 哪些当前必要,哪些暂不引入?

   回答:上述十项边界机制当前必要。Event-driven input、multi-architecture、restricted variant、hardened base、usage summary、具体 Core image schema、具体 builder / registry / evidence products、存储、语言、协议和完整 event sourcing 暂不作为 current mechanism。

## 4. 当前材料问题诊断

| 候选“技术选型” | 问题 | 当前处理 |
|---|---|---|
| Docker / OCI / BuildKit / buildx / GitHub Actions | 产品 / 格式 / 流水线名称未经正式选定 | 不进入 01;只保留 immutable image ref 与 external builder adapter 机制 |
| Trivy / Grype / cosign / SBOM | Q-MI-004 未确权具体 gate,且混合工具与证据 | 只采用 authority-driven applicable gate / safe conclusion |
| Registry 是 source of truth | 无法承载 definition、attempt、eligibility、availability history | Registry 仅为 adapter + immutable ref boundary |
| Outbox + publish events | MI-UP-009 无 outbound authority | 不采用;conditional inbound 也仅保留边界 |
| 一次 pipeline 状态机 | 将 build / gate / Artifact / supply / consumer 压成一条状态 | 采用分阶段领域判定与分域状态 |
| 每个上下文独立数据库 / 服务 | 缺少 workload / isolation 依据 | 只锁语义和承载边界,部署 / storage deferred |
| 全量 event sourcing | 可保历史但复杂度高,需求未要求事件回放真相 | 采用 explicit append / superseding history,不锁存储机制 |

## 5. 改动前后对比

| 维度 | 候选口径 | 当前选型 |
|---|---|---|
| 选型单位 | 技术产品和工具清单 | 架构机制 / 手段 |
| Input | Git branch / latest artifact | Verified pinned refs + immutable attempt snapshot |
| Pipeline | 单一 success / failure | Candidate / eligibility / availability 分阶段判断 |
| Identity | Tag / registry path | Digest / provenance 与本仓 revision / source binding |
| Security | 固定 scan / sign | Authority-driven applicable gates,fail closed |
| History | 更新当前记录 | Append / supersede / rollback transition 保留历史 |
| Infra | SDK / product 侵入 core | Product-neutral adapter 与 inward contract |
| Cross-domain | Artifact / consumer 同一 ready | Image / Artifact / consumer states 分层 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接列语言 / database / CI / registry / scanner 技术栈 | 实施感强 | 缺 authority,不能解释架构边界 | 不采用 |
| 使用单一供应链流水线作为核心机制 | 简单直观 | 各阶段 owner 与 failure 无法隔离 | 不采用 |
| 采用机制级边界组合,产品载体 deferred | 可保护 truth 并允许后续替换 | 需要更多显式状态和 adapter | 采用 |
| 全量 event-driven / event-sourced | 历史和解耦强 | 入站 / 出站 authority 不足,复杂度无依据 | 不采用 |
| 跨仓同步事务确保全链一致 | 表面一致 | 破坏独立 owner 且不可在外部能力间成立 | 不采用 |

## 7. 结构化中间产物

### 7.1 关键技术机制

| ID / 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| `TM-MI-001` 向内防腐与正式 seam | 外部 DTO / SDK / body / product 直接侵入核心 | 多 owner 输入必须先变为本仓 ref / snapshot / safe conclusion 才能保护 truth | 增加转换、validation、gap 和 parity 维护成本 | 同时改变依赖方向、数据边界和失败语义,属于架构决定。 |
| `TM-MI-002` Immutable pinned input snapshot | 构建输入随 external latest 漂移 | Attempt 必须证明使用了哪组确定输入,且历史不能随上游变化 | Snapshot 需要完整性检查、来源状态和不可变管理 | 直接决定可重复解释和 candidate 成立条件。 |
| `TM-MI-003` 分阶段领域判定 | Pipeline success 自动变成 eligible / available | Candidate、eligibility、availability 的 owner、前提和失败各不相同 | 增加 explicit intermediate outcomes 和跨阶段 gap | 这是核心上下文和 consistency 主链的基础机制。 |
| `TM-MI-004` Digest / provenance content identity binding | 输出引用无法证明与输入 / revision 一致 | Immutable digest 与完整 provenance 能稳定识别候选并阻止 tag 漂移 | 所有来源必须可回链;incomplete provenance 直接阻断 | 它定义 candidate identity 的架构级约束,不等于选择 registry 产品。 |
| `TM-MI-005` Authority-driven fail-closed gate | 未知 / 缺失 gate 被默认跳过或通过 | 只有正式 authority 决定适用集合,任一适用结论异常都不能获得 positive eligibility | Authority / evidence 不可用会降低 positive availability;需要显式 pending | 具体 gate kind 可变,机制本身保护供应链资格。 |
| `TM-MI-006` Append / supersede / explicit transition history | Revision、attempt、evaluation 或 supply 状态被原地覆盖 | Rollback、复盘和 provenance 需要原语境持续可解释 | 增加历史量、superseding relation 和读取复杂度 | 只锁 history semantics,不锁 event sourcing 或 storage model。 |
| `TM-MI-007` Truth 与派生读取分离 | Catalog / trace / cache / report 反写领域 | Projection 可以滞后和重建,核心 truth 仍保持唯一 | 读取端需表达 stale / rebuilding / unavailable | 同时保护数据 owner、部署角色和维护交互。 |
| `TM-MI-008` 即时判断与后台延后承接分离 | 长时构建 / gate / handoff 被同步接口伪装完成 | 本地 decision 可即时收口,外部长时工作保留 pending / unknown | 调用方需理解 accepted 不等于 completed;需要状态追踪 | 改变关键交互主链,不等于选择 queue / job product。 |
| `TM-MI-009` Product-neutral external adapters | Builder / registry / evidence / Artifact 产品决定领域语义 | 外部能力可替换,adapter outcome 经过本仓规则才能成为 local input | Adapter parity、错误映射和配置绑定需要单独维护 | 这是依赖倒置的具体架构手段,不是产品选择。 |
| `TM-MI-010` Image / Artifact / consumer state separation | Image ready 被误报为 Artifact / container / product ready | 三个 owner 的状态独立成立,外部失败只形成 gap | 下游需处理多层状态;不能依靠单一 ready 布尔值 | 直接保护 Artifact、Member Service 与镜像域边界。 |

### 7.2 当前采用 / 不采用边界

| 当前采用 | 当前不采用 / 不硬化 |
|---|---|
| Inward seam、pinned snapshot、staged decisions、digest / provenance、fail-closed gates、history、projection separation、background handoff、neutral adapters、cross-domain state separation | 具体语言 / framework / DB / cache / queue / CI / builder / registry / scanner / signer / secret store / transport / schema / deployment product |
| Nightly 作为受控 intent 语义 | 固定 scheduler / cron / workflow 配置 |
| Conditional inbound event seam | Event family / topic / schema / positive consumer readiness / outbound event |
| Explicit history semantics | Full event sourcing / outbox / retention duration |
| Immutable image ref 语义 | 具体 image format、registry layout、tag convention 或 platform matrix |

### 7.3 机制与架构单元映射

| 架构单元 | 必要机制 | 保护结果 |
|---|---|---|
| BC-MI-01 | TM-MI-001/002/006 | Mapping / assembly 来源不漂移,revision 历史可追 |
| BC-MI-02 | TM-MI-002/003/006/008/009 | Attempt 输入确定,external outcome 不冒充 candidate |
| BC-MI-03 | TM-MI-003~006/009/010 | Provenance 完整,gate 不绕过,Artifact 状态不混写 |
| BC-MI-04 | TM-MI-003/004/006/008~010 | Availability / entry immutable,consumer gap 不反写 |
| BC-MI-05 | TM-MI-001/007/009 | External shadow 受控,projection 不反写 truth |

### 7.4 技术边界说明

这些机制进入架构层,因为它们共同决定外部输入如何进入核心、一个 candidate 如何获得身份、资格和供给如何分段成立、历史如何恢复以及相邻 owner 如何隔离。语言、数据库、CI、registry、scanner、signer、transport 和 deployment product 只是未来承载这些机制的候选,当前没有足够 authority 或测量依据将其锁定。本章也不把某个 ref、digest、report 或 evidence 写成已经生成的事实。具体实现、参数和产品比较分别留给 02~07。

## 8. 回填草稿

正式 01 §11 回填 §7.1 十项关键机制、§7.2 当前边界、§7.3 单元映射和 §7.4 说明。正式章节不得把 TM-MI-* 误写为已实现组件或已选产品。

## 9. 待确认事项

- MI-UP-004 关闭前不选 image-specific Core contract 载体。
- MI-UP-005 / 009 使 event 机制仅有 conditional inbound boundary,无 output / outbox。
- MI-UP-001 / 002 / 003 / 006 / 007 限制 adapter / ref exact contracts,不改变 TM-MI-001~010。
- Q-MI-003 / 004 使具体 products 与 evidence inventory 保持 deferred。
- 当前不存在实施、benchmark、qualification 或 evidence 事实支撑产品和量化选择。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 每项机制是否解决架构问题并说明理由 / 代价 | pass |
| 是否区分机制与产品 / 实现载体 | pass |
| 是否覆盖五个架构单元和主要红线 | pass |
| 是否保留 event / Core / evidence / contract pending | pass |
| 是否无已实现、已测试、已选产品或 readiness 事实 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 11,不得跳到 Step 12 或修改正式 01。
