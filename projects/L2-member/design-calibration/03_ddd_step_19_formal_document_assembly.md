# L2-member 03 详细设计 Step 19：整理正式详细设计文档

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 19
> 对应书写规范：`standards/document/详细设计书写规范.md` §5.1～§5.18
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md` §3.4.2～§4.1
> 粒度 / 格式参考：`projects/L1-governance/design-calibration/03_ddd_step_19_formal_document_assembly.md`；只参考装配粒度和审计结构，不继承 Governance 的对象、协议或产品结论。
> 输出：`projects/L2-member/03-详细设计.md`
> 模式：`full-restart + single-agent-serial`
> 最近校准：2026-09-03

## 1. Step 状态

| 项 | 当前记录 |
|---|---|
| 当前 Step | Step 19：整理正式详细设计文档 |
| 当前状态 | `[x]` 已完成；三层门禁通过（保留上游与本仓设计 blocker），正式 03 已整体重建并停审 |
| 前序状态 | Step 1～18 均为 `completed / stop_review` |
| 正式正文 | 旧 `03-详细设计.md` 仅作 historical material；新正文只能从本轮 Step 1～18 收口材料装配 |
| 写入范围 | 仅 `projects/L2-member/03-详细设计.md`、本 Step 文件、项目 flow 和项目级台账 |
| 实施状态 | `not_started`；不创建目标实现仓、不写代码、不运行测试、不提交 commit |

### 1.1 Step 内计划

| 子阶段 | 可审查产物 | 状态 | 说明 |
|---|---|---|---|
| 读取项目级台账、03 flow、规范和 Step 18 | 本文件 §2、写入前检查 | completed | 已确认恢复点、用户授权和 blocker 不变 |
| SOP 七问回答 | 本文件 §3 | completed | 只回答装配问题，不把过程问答带入正式正文 |
| 历史正式 03 诊断 | 本文件 §4、§5 | completed | 旧 persona / transport / product 假设全部作为污染输入 |
| 18 章来源映射与分母审计 | 本文件 §7 | completed | 每章回指具体 calibration 文件；分母与 Step 8～10 对齐 |
| 三层写入前门禁 | 本文件 §7.4 | completed | 项目级、文档级、Step 级均允许本次正式回填；开放 blocker 不被伪关闭 |
| 正式正文整体重建 | `03-详细设计.md` | completed | 已按 §7.5 的 A～F 批次整体重建，正文只放收口结论 |
| 静态审计与停审 | 本文件 §10、flow、ledger | completed / stop_review | 已完成来源块、旧污染、分母、禁词、事实纪律和台账同步审计 |

## 2. 本步输入

### 2.1 必读规范与流程

| 输入 | 用途 |
|---|---|
| `standards/document/设计文档编写通则.md` | 正式正文只承载收口结论、三层门禁、ASCII 图和批次纪律 |
| `standards/document/设计文档讨论中间产物规范.md` | Step 恢复、写入前检查、来源追溯和历史后置审计 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段 / DTO / 状态 / metadata / projection / artifact 闭环和非伪造边界 |
| `standards/document/详细设计讨论流程_SOP.md` | Step 19 七问、完成条件和装配顺序 |
| `standards/document/详细设计书写规范.md` | 18 章主链、模块组织、表格和 Rustdoc 规则 |
| `standards/document/子项目目录与代码文件组织规范.md` | planned workspace、package、crate、binary 和路径命名 |

### 2.2 本项目与上游材料

| 输入 | 本 Step 承接 |
|---|---|
| `project_execution_ledger.md`、`03_ddd_calibration_flow.md` | 当前恢复点、授权、文档切换纪律和 blocker 台账 |
| `03_ddd_step_01_upstream_boundary.md`～`03_ddd_step_18_risks_open_questions.md` | 详细设计全部收口结论、回填草稿、风险和待确认事项 |
| 当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | 需求、架构、CP01～CP07、分层和概要骨架的正式输入 |
| `projects/L1-governance/03-详细设计.md` 与其 Step 19 | 仅作章节粒度、来源块和审计格式参考 |
| `projects/L2-runtime/00~07`、`projects/L2-tools/00~07`、L0/L1 owner 与 sibling 正式材料 | 只确认 owner / seam；未闭合边界仍按 `L2M-UP-001~008` 记录 |
| 旧 README、旧正式 `03/05/06`、`draft/` | historical / discussion input；不得直接成为正式契约 |

## 3. SOP 问题回答

1. **正式文档是否按书写规范章节主链组织？**
   回答：是。正式 03 使用 18 章固定主链；每章正文开头列出具体 calibration source 和延伸阅读。章节只承载已收口的实现契约摘要，问题回答、诊断、取舍和停审记录留在 `design-calibration/`。

2. **第 5 章是否以模块为主轴？**
   回答：是。第 5 章按 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个 planned library crate 组织；CP01～CP07 是跨层业务责任轴，不被机械拆成 crate。

3. **对象、Trait、协议、处理流、状态机是否互相可回指？**
   回答：是。对象和 stable carrier 回指 Step 6，Port / Adapter 回指 Step 7，协议回指 Step 8，逐接口流回指 Step 9，状态回指 Step 10，持久化与事务回指 Step 11；正式正文中的索引不替代这些字段级真相源。

4. **字段闭环、DTO 构造闭环、状态闭环和 phase boundary 是否通过复核？**
   回答：设计级预复核通过，见 Step 17；但 `L2M-DDD-003~007`、`scope_supersede_gap`、`L2M-UP-001~008` 和 `L2M-UP-005` 仍开放。正式正文明确暂停条件，不把预复核当作实现或 integration 结果。

5. **实现者是否可以按本文 1:1 开始实现？**
   回答：可以把本文作为入口，按章节来源读取字段级 Step 文件；若来源文件仍标记 blocker，必须暂停受影响 lane 回到 owning Step，不能由实现者自行补 schema、factory、transport、route 或状态。

6. **是否有内容误放到测试方案、实施计划、配置设计或运维手册？**
   回答：正文只保留实现契约、最小测试切口和实施承接输入；完整配置 profile、测试矩阵 / 结果、验收 verdict、phase / commit、部署和运维产品均留给后续正式文档或实施授权。

7. **本文是否给 `07` 提供交付实现前整体审计所需输入？**
   回答：是。§16 汇总目标仓、阅读顺序、34 对象、10/16/14/24/5 协议、28 状态主语、Port、UoW、projection、replay、错误、配置、观测和 test-cut 的审计入口；`07` 仍必须按真实 phase / commit boundary 重做审计。

## 4. 当前正式文档问题诊断

| 位置 / 材料 | 问题 | 装配影响 |
|---|---|---|
| 旧 `03-详细设计.md` §1～§5 | 以 `MemberRuntimePersona`、`ExposedCapability`、`ExecutionActorBinding`、`MemberVisibleSummary` 为主线，混淆 Identity、Runtime、Tools、host 与 read model owner | 必须整体替换，不能增量修补或沿用旧对象名 |
| 旧 `03` 协议与流程段 | CloudEvents、AG-UI、UDS、gRPC、launch token、固定端口和固定 transport 形态没有当前 member-specific authority | 只保留为污染审计；正文改为 transport-neutral typed seam |
| 旧 `03` 存储 / 性能描述 | DB、broker、cache、固定 SLA / P95 等未经当前 Step 11～14 选择 | 正文只写 logical Store、UoW、CAS、append / replay 和 pending physical binding |
| 旧 `05/06` | 仍引用旧 persona、旧协议和旧验收词汇；不能承接新版分母 | §15 只写 planned test cut；§17 明确后续重建门禁 |
| 正式 `04`、`07` | 当前缺失，无法作为配置或实施真相源 | §13 / §16 写绑定和承接边界，但不伪造配置、phase、commit 或 ledger |
| Step 6～10 局部缺口 | Consumer receipt/source closure、CP04～CP07 与 scope helper / flow / version 仍有 targeted repair | 正文保留 blocked lane 和 owning Step，不在装配阶段私补 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 文档组织 | 历史 persona 五部分 + 技术细节混排 | 18 章规范主链，§5 以七模块为主轴、CP01～CP07 为业务映射 | 让实现者按代码边界阅读并保持追溯 |
| 实现布局 | 单一旧 facade / transport 叙事 | planned Rust 2024 workspace，七个 library crate，无预设 binary | 与 Step 3～4 和 L1-governance 粒度一致，避免伪造 process topology |
| 对象分母 | 旧 persona 对象集合 | 34 个 HLD 对象（CP01～CP07 为 `5/5/5/5/5/4/5`）及 application / infra / entry stable carrier | 以当前 HLD / Step 6 唯一来源为准 |
| 协议分母 | 历史 API / event 名称漂移 | 10 Command、16 Query、14 Consumer、24 blocked semantic candidate、5 Job | 与 Step 8 / 9 / 16 对齐；24 candidate 在 `L2M-UP-005` 前不物化 |
| 状态与一致性 | 成功 / 可用 / 已发送等语义压平 | 28 个状态主语、typed result、CAS、same-UoW、Query no-write、Unknown fence | 保留 truth、attempt、gap、projection 和外部结果的边界 |
| 下游承接 | 旧测试 / 配置 / 验收被视为可直接使用 | 04～07 作为后续正式链；只交付可追溯输入和 blocker | 防止设计摘要被误读为实现、测试或 readiness |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在旧 03 上增量修补 | 写入量小 | 旧 persona、transport 和 product 假设容易回流，无法证明新旧边界 | 不采用 |
| 从 Step 1～18 整体装配新 03 | 来源、分母、阻塞和章节可审计；符合 full-restart | 正文需要重新组织并维护来源索引 | 采用 |
| 正文复制 Step 6～9 全量字段与 flow | 入口文档看似完整 | 形成第二真相源，容易与 calibration 漂移 | 不采用；正文摘要 + 精确回指 |
| 正文只写极短目录和链接 | 文档短 | 实现者缺少模块、分母、边界和硬红线 | 不采用；保留足够实现入口摘要 |
| 将 24 semantic candidate 当作 Event / outbox 规划 | 可提前安排发布链 | 伪关闭 `L2M-UP-005`，会制造 route / payload / delivery 假设 | 不采用；统一标为 blocked / non-materialized |
| 以默认值或 fake 关闭上游 exact seam | 可让流程看似完整 | 把 owner contract 缺口伪装成成功 | 不采用；仅保留 typed ref、safe resolution、attempt / gap、blocked |

## 7. 结构化中间产物

### 7.1 正式 18 章来源映射

| 正式章节 | 主要来源 | 装配边界 |
|---|---|---|
| §1 与上游文档的关系声明 | `03_ddd_step_01_upstream_boundary.md` | 上游 owner、本文不再回答 / 必须回答、历史输入效力 |
| §2 本次目标与范围 | `03_ddd_step_02_scope.md` | 实现契约目标、非范围、实现者能力边界 |
| §3 实现约束与编码规范 | `03_ddd_step_03_constraints.md` | Rust 2024 / MSRV、源码语言、依赖分类、Core-only compile |
| §4 实现单元与文件布局 | `03_ddd_step_04_file_layout.md` | planned workspace、七 crate、文件职责、无 binary / physical choice |
| §5 模块实现契约 | `03_ddd_step_05_module_contracts.md`、`03_ddd_step_06_object_contracts.md`、`03_ddd_step_07_trait_port_adapter_contracts.md` | 七模块 capability、对象、Port、Adapter、错误和测试切口摘要 |
| §6 全局对象 / Trait / API 索引 | `03_ddd_step_06_object_contracts.md`、`03_ddd_step_07_trait_port_adapter_contracts.md`、`03_ddd_step_08_protocol_contracts.md` | 34 对象、Port / Store、协议索引；不新增定义 |
| §7 协议契约 | `03_ddd_step_08_protocol_contracts.md` | 10/16/14/24/5 分母、DTO、typed result / receipt、digest |
| §8 函数级处理流 | `03_ddd_step_09_function_flows.md` | Command / Query / Consumer / blocked candidate / Job flow inventory 和硬顺序 |
| §9 状态机与转换矩阵 | `03_ddd_step_10_state_matrix.md` | 28 状态主语、合法 / 非法迁移和 Query / event 红线 |
| §10 持久化、事务与一致性 | `03_ddd_step_11_persistence_transaction_consistency.md` | logical Store、UoW、CAS、append、projection、replay |
| §11 错误、异常与恢复 | `03_ddd_step_12_error_recovery.md` | 分层错误、映射、Unknown / blocked / waiting / delayed |
| §12 并发、幂等与重入 | `03_ddd_step_13_concurrency_idempotency.md` | key、digest、duplicate replay、commit-unknown、资源冲突 |
| §13 配置与外部绑定 | `03_ddd_step_14_configuration_external_bindings.md` | raw config 入口、validated ref、builder、依赖绑定和不可配置边界 |
| §14 可观测性与审计 | `03_ddd_step_15_observability_audit.md` | safe log、metric、member-local audit、trace / span、redaction |
| §15 测试切口 | `03_ddd_step_16_test_cuts.md` | 七模块、协议、状态、一致性、错误、配置和观测的 planned cut |
| §16 到实施计划承接 | `03_ddd_step_17_implementation_handoff.md` | 阅读清单、目标仓前置、真相源和 phase boundary 预复核 |
| §17 风险与待确认事项 | `03_ddd_step_18_risks_open_questions.md` | 风险、owner、阻塞范围、未确认前处理、重开规则 |
| §18 参考 | Step 1～19 与已实际阅读的标准 / 上游 | 只列实际使用材料，不新增事实 |

### 7.2 固定分母审计

| 分母 | 当前唯一来源 | 装配结论 |
|---|---|---|
| HLD 对象 | Step 6、`02` 对象附录 | 34 个：CP01～CP07 为 `5/5/5/5/5/4/5`；application / infra / api / worker / jobs stable carrier 另列，不改变 HLD 分母 |
| Command | Step 8 / Step 9 | 10：CP01×4、CP02×2、CP03×2、CP06×2 |
| Query | Step 8 / Step 9 | 16：Presence 1、Host 1、Subscription 1、Inbound 1、Runtime 2、Outbound 2、Trace 3、Mirror 2、Read Model 3 |
| Consumer | Step 8 / Step 9 | 14：external 10 + committed-fact 4 |
| outbound semantic candidate | Step 8 / Step 9 | 24；`L2M-UP-005` 关闭前全部 `blocked`，不是 Event / outbox / delivery work item |
| Operations Job | Step 8 / Step 9 | 5：PublicationRelay、ObservationRelay、ExternalContextRefresh、MemberProjectionRebuild、GapReconciliation |
| 状态主语 | Step 10 | 28；按 CP01～CP07、application / infra、api / worker / jobs 分族，正文只汇总正式状态名和来源 |

### 7.3 历史污染排除表

| 历史口径 | 当前处理 |
|---|---|
| `MemberRuntimePersona`、`ExposedCapability`、`ExecutionActorBinding`、`MemberVisibleSummary` 主线 | 不进入新对象或模块真相；按 CP01～CP07 和当前 34 对象重建 |
| CloudEvents / W3C 类别 | 仅在 Core 当前 authority 明确支持时作为共享类别消费；不在 member 生成 member-specific envelope |
| AG-UI | 不作为当前 member protocol 或 UI truth |
| UDS / gRPC / HTTP、固定端口、launch token | 不选择 transport、IPC、token 或 process topology；仅保留 neutral Port / entry |
| 固定 DB / broker / cache / scheduler / SLA / P95 | 不进入正式实现约束；物理 binding 留后续 authority |
| 旧测试、验收、report、run、artifact、evidence、signoff、readiness | 一律不继承，也不在本 Step 伪造 |

### 7.4 三层正式写入门禁

| 门禁层级 | 检查 | 结果 | 证据 |
|---|---|---|---|
| 项目级 | 台账允许 Step 19；用户已授权完成 03；无全局 blocker 要求停止装配 | `pass`（带开放 blocker） | `project_execution_ledger.md` §1、§6；授权记录 §1.1 |
| 文档级 | flow 的 Step 1～18 为完成 / 停审，当前 Step 19 的来源映射和装配计划完整 | `pass` | `03_ddd_calibration_flow.md` §1～§3、本文件 §7 |
| Step 级 | 本文件 SOP 七问、诊断、取舍、结构化产物和写入前检查完成；正文只写收口结论 | `pass` | 本文件 §3～§7；Step 18 §10 |
| blocker 处理 | `L2M-UP-001~008`、`L2M-DDD-001~007`、`scope_supersede_gap`、`L2M-UP-005` 保持 open，不被装配升级为 success | `pass_with_blockers` | Step 18 §7～§8；本文件 §7.2～§7.3 |

### 7.5 正式正文分批写入与审计记录

| 批次 | 正式章节 | 实际写入 | 局部审计 |
|---|---|---|---|
| A | 文档头、§1～§4 | completed：版本 / 状态、上游、范围、Rust / workspace / planned layout 已整体装配 | pass：来源块、历史名称、目标仓与依赖分类均明确为 planned / non-choice |
| B | §5～§6 | completed：七模块主轴、CP 映射、对象 / Port / API 索引和 stable carrier 边界已装配 | pass：模块依赖、34 对象与唯一 Core compile candidate 一致 |
| C | §7～§9 | completed：协议分母、typed surface、flow 模板 / inventory、28 状态族已装配 | pass：`10 / 16 / 14 / 24 / 5`、Query no-write 与状态名称一致 |
| D | §10～§12 | completed：Store / UoW / replay、错误恢复、并发幂等已装配 | pass：CAS / cursor 分离、Unknown fence、duplicate replay；non-Query 顺序为 validate typed context → canonical digest → begin UoW → reserve → mutation → carrier → complete → commit |
| E | §13～§15 | completed：配置绑定、safe observability、planned test cut 已装配 | pass：不可配置化、redaction 与未执行边界明确 |
| F | §16～§18 | completed：实施承接、风险、参考与最终自检入口已装配 | pass：phase boundary、blocker、历史污染和引用路径均保持边界 |

## 8. 正式正文回填约束

正式 03 必须满足以下装配契约：

1. 章节顺序固定为书写规范 §5.1～§5.18；每章正文前都有具体 `design-calibration/03_ddd_step_*.md` 来源块和“结构化中间产物 / 回填草稿 / 待确认事项”延伸阅读。
2. §5 以七模块为主轴。每个模块至少给出职责、文件组、capability → object 映射、允许 / 禁止依赖、Port / Adapter 位置、错误和测试切口；字段级卡片仍回指 Step 6。
3. 正文只汇总已确认的 planned contract。对未闭合 seam 使用 `pending`、`blocked`、`waiting`、`unknown` 或 safe ref / gap，不使用默认值、字符串、fake success 或旧 transport。
4. Query 永远 no-write：不 digest、不 reserve、不 refresh / rebuild / reconcile、不写 result / audit / projection、不调用 resolver / handoff。
5. duplicate 只能读取同 operation、同 relation、同 digest、同 typed stored carrier；缺失或错配必须 fail-closed。`Unknown` 必须 inspect-first，不能换 key、盲重试或升级为成功。
6. 24 个 outbound semantic candidate 在 `L2M-UP-005` 前不得生成 event envelope、payload、publisher、outbox、route、topic、retry、DLQ、delivery 或 observed 结论。
7. 正文不得声称实现、编译、测试、integration、artifact、report、evidence、verdict、signoff、readiness 或 commit 已存在。

## 9. 待确认事项与装配限制

| 事项 | 当前状态 | 本 Step 处理 |
|---|---|---|
| `L2M-UP-001~008` | open | 正文保留 owner、影响和 blocked-aware seam；不补 exact carrier |
| `L2M-DDD-001` | open | 目标仓缺失；仅写 planned layout，不创建仓 |
| `L2M-DDD-002` | open | physical Store / UoW / durability 未选；只写 logical semantics |
| `L2M-DDD-003~007` | open | Consumer receipt、CP04～CP07 / scope helper 缺口回指 owning Step；不在 Step 19 修复 |
| `scope_supersede_gap` | open | `ReplaceSubscriptionScope` 正向 lane 保持 blocked / wait_design |
| 24 candidate | blocked by `L2M-UP-005` | 只记录 non-materialization 约束 |
| 正式 04～07 | not_started / historical or absent | 不预写配置 key、测试结果、验收 verdict、phase、commit 或 implementation ledger |

## 10. 自检、完成门禁与停审

### 10.1 Step 19 自检清单

| 检查项 | 结果 |
|---|---|
| 承接概要设计、架构和需求边界 | pass |
| 使用 18 章正式主链 | pass |
| 每章列具体 calibration source 和延伸阅读 | pass：18 个正式章节均有具体来源块；§5、§6 以多个字段级来源补充，不形成第二真相源 |
| §5 按七模块组织，CP01～CP07 不机械变成 crate | pass |
| 34 / 10 / 16 / 14 / 24 / 5 / 28 分母一致 | pass |
| 对象、Port、协议、flow、state 能回指 Step 6～11 | pass：索引和正文均回指 Step 6～11，字段 / trait / DTO / flow / 状态细节仍留在 owning Step |
| Query no-write、duplicate replay、Unknown fence 明确 | pass |
| 24 candidate 未被物化为 Event | pass |
| 上游 / 本仓 blocker 保持 open | pass |
| 历史 persona、AG-UI、UDS、gRPC、launch token、固定产品未继承 | pass |
| 未写实现、测试、artifact、report、evidence、verdict、signoff、readiness、commit 事实 | pass：仅陈述 planned contract、未执行约束和后续门禁，未把设计静态检查表述为实现或验证事实 |
| 正式 03、flow、台账同步 | pass：本文件、正式 03、03 flow 和项目台账已同步为 Step 19 completed / stop_review |

### 10.2 正式正文静态装配审计（2026-09-03）

此处是对设计稿文本的静态核对，不是代码构建、测试、集成或交付结论。

| 检查面 | 核对结果 | 处理结论 |
|---|---|---|
| 章节主链与来源 | `03-详细设计.md` 的 §1～§18 各出现一次且顺序连续；每章均列具体 `03_ddd_step_*` calibration source | pass |
| 来源映射 | 本文件 §7.1 为 18 行一一映射；§12 仅保留 `03_ddd_step_13_concurrency_idempotency.md` 一项映射 | pass |
| 固定分母 | 34 HLD 对象（`5 / 5 / 5 / 5 / 5 / 4 / 5`）、10 Command、16 Query、14 Consumer、24 candidate、5 Job、28 状态主语在正文、映射和承接章节一致 | pass |
| 模块与依赖 | §5 以七个 planned library crate 为主轴；唯一 planned sibling Cargo candidate 仍为 `core-contracts`，runtime / event / ref / adapter / fake 未伪装为 package dependency | pass |
| 处理与一致性红线 | Query no-write、matching typed carrier replay、Unknown inspect-first、corrected non-Query UoW / digest 顺序均一致 | pass |
| event blocker | 24 项保持 `Blocked(L2M-UP-005)` / non-materialized；未写成 Event、publisher、outbox、route、topic、retry、DLQ 或 delivery contract | pass_with_upstream_blocker |
| 历史污染与文字健康 | persona、CloudEvents、AG-UI、UDS、gRPC、launch token 和物理产品仅出现在否定性污染审计或非选择语境；未发现未预期乱码 | pass |
| 事实纪律 | 未声称实现仓、代码、编译、运行、测试、集成、artifact、report、evidence、verdict、signoff、readiness 或 commit 已存在 | pass |

### 10.3 完成门禁

正式正文整体替换、静态审计和三层台账同步完成后，Step 19 才可标记：

```text
step_19_status = completed
step_19_gate = pass_with_upstream_and_design_blockers / stop_review
formal_03_write_allowed = completed
next_allowed_action = wait_for_explicit_user_confirmation_before_04
implementation_repo_write_allowed = false
commit_required = false
```

Step 19 已完成并立即停审。它不授权创建或进入 `04-配置设计.md`，也不授权实现代码、测试、验收、实施计划或提交 commit。除非用户明确确认进入 04，`03-详细设计.md` 仅可接受用户指定的纠正，不得自行扩展。
