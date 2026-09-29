# Step 19. 整理正式详细设计文档

> 对应：`standards/document/详细设计讨论流程_SOP.md` Step 19、`详细设计书写规范.md` §3/§4.5/§5.18/评审清单。
> 回填位置：正式 `03-详细设计.md` §1～18。
> 状态：`completed / formal_stop_review`。正式正文已真实重建并完成静态审计；外部 blocker 与本地 pending 保持开放。

## 1. Step 状态与边界

| 项 | 结论 |
|---|---|
| 当前输入 | 正式 00/01/02、03 Step 01～18、03 flow 与项目台账 |
| 当前任务 | 整体删除 historical 正式 03，按十八章主链重建并做可落码闭环审计 |
| 写入授权 | 用户明确“完成全部 03”；正式 03 只在本 Step 可写 |
| 不进入 | 正式 04～07、implementation ledger、planned boundary skeleton、目标实现仓与代码实现 |
| 完成上限 | 正式 03 可作为当前设计入口；外部 positive integration 与整体 implementation start 仍 blocked |
| 停审 | 本 Step 完成后立即 `formal / stop_review`，等待用户新的明确授权 |

## 2. 本步输入与读取结论

| 输入 | 状态 | 装配用途 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | completed | 上游关系、本文回答边界与输入 blocker |
| `03_ddd_step_02_scope.md` | completed | 本轮目标、范围、非范围与实现上限 |
| `03_ddd_step_03_coding_runtime_constraints.md` | completed | Rust/runtime/源码语言/依赖与仓库约束 |
| `03_ddd_step_04_units_file_layout.md` | completed | 六 crate、package/binary 与 planned 文件布局 |
| `03_ddd_step_05_module_contracts.md` | completed | 六模块主轴、直接依赖与唯一归属 |
| `03_ddd_step_06_object_contracts.md` | completed | 2 contracts + 24 domain 对象、8 service 与稳定技术 carrier |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | completed | 7 类 business/local port、required external seam、UoW 与 fake 边界 |
| `03_ddd_step_08_protocol_contracts.md` | completed | 3C + 5Q + 5E + 17J、DTO、result/receipt/report 与 blocked outbound candidate |
| `03_ddd_step_09_processing_flows.md` | completed | 30 logical entries / 32 method surfaces 的函数级流程 |
| `03_ddd_step_10_state_matrices.md` | completed | 18 个真实状态主语、合法/非法转换与触发函数 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | completed | logical store、UoW、CAS/read-set、事务与 external effect fence |
| `03_ddd_step_12_error_recovery.md` | completed | 六模块错误、对外映射、unknown/retry/recovery |
| `03_ddd_step_13_concurrency_idempotency.md` | completed | operation key/input、并发、duplicate replay 与重入 |
| `03_ddd_step_14_config_external_binding.md` | completed | raw config owner、required slots、runtime builder 与依赖分类 |
| `03_ddd_step_15_observability_audit.md` | completed | signal 分层、安全字段、native durable review 与 backend 边界 |
| `03_ddd_step_16_test_cuts.md` | completed | planned suite、模块/入口/状态/一致性最小切口 |
| `03_ddd_step_17_implementation_handoff.md` | completed | 闭环预审、未来 07 boundary 输入与实施门禁 |
| `03_ddd_step_18_risks_open_questions.md` | completed | 12 项 blocker、6 项 local pending 与关闭证明 |
| 详细设计 SOP / 书写规范 / 通则 / 真相源标准 | 已读取 | 十八章结构、来源入口与评审口径 |
| `L1-governance`、`L1-workspace` Step 19 / 正式 03 | 粒度样本 | 参考模块主轴、索引和回源方式，不复制领域主语 |

旧 `README.md`、旧正式 03/05/06 与 `draft/` 仍只作 `historical_material` / 污染审计输入；不能关闭 blocker 或生成新的实现契约。

## 3. SOP 问题回答

| 问题 | 回答 / 装配规则 |
|---|---|
| 是否按章节主链组织？ | 是。使用 §1～§18 固定主链，每章开头列具体校准来源和延伸阅读。 |
| 第 5 章是否以模块为主轴？ | 是。按 `contracts/domain/application/infra/api/worker` 六模块组织；第 6 章只作索引。 |
| 对象、trait、协议、flow、状态是否互相可回指？ | 以 26 对象、8 service、7 port family、30 logical entries/32 surfaces、18 状态主语为固定分母，分别回指 Step 06～10。 |
| 字段、DTO、状态和 phase boundary 是否闭环？ | 本地设计按 Step 17 预审闭合；外部 slot 与后续 04～07 保持 blocked/future-document-required，未来 07 必须逐 phase/commit boundary 再审。 |
| 能否 1:1 实现？ | 本地合同可由正式 03 作为入口并继续读取精确 Step 卡片；受 blocker 影响的 production adapter/effect 只能实现 fail-closed seam，不得实现伪 positive path。 |
| 是否误放下游内容？ | 正式 03 只保留代码绑定点、最小测试切口与实施输入，不制定完整配置 schema、测试计划、验收 verdict 或 phase/commit。 |
| 是否为 07 提供整体审计输入？ | §16 提供对象、DTO、Query、protocol、state、UoW、测试与 accepted-side-effect 边界，并明确 07 的重审义务。 |

## 4. 当前文档问题诊断

| 观察 | 风险 | 本步处置 |
|---|---|---|
| historical 正式 03 采用旧 15 节/采集式主线 | 旧 `ArchivedSnapshot/ArchiveIndex/RetentionClass/LegalHold/EvidencePackage` 等主语污染当前模型 | 整体删除重建，不逐段修补 |
| 旧文档把 legal hold/retention/purge 近似写成本仓 truth | 越权替代 governance/明确 owner | 只保留正式 decision 的受控执行与本地执行记录 |
| 旧文档固定 provider、年限、表结构、性能和成功口径 | 私造配置、供应商、算法或 readiness | 全部排除；未知项进入 §17 并 fail-closed |
| Step 06～08 很长 | 全量复制会形成第二份字段/DTO/trait 真相且容易漂移 | 正式正文保留模块合同、关键 schema/签名和精确规范性入口；完整卡片仍在 Step 文件 |
| 外部 port 已定义但合同未闭合 | 被误读为 production integration ready | 每个 required slot 显式标 blocked，fake 仅 test support |
| outbound candidate 已列名 | 被误读为已授权 event/outbox | 正式 §7 只登记三项 blocked candidate；不定义 topic/schema/publisher/outbox |
| 目标实现仓不存在 | planned 路径被误写成实现事实 | 所有布局标 planned；无 baseline/build/test/readiness 声明 |

### 4.1 疑似重复声明核验

装配前对 Step 04/07/08 做 exact-line 检查：`archive_query_service.rs` 在 Step 04 各出现于文件树和职责表一次，语义不同且均需保留；`ArchiveUnitOfWork::rollback(self)` 只有一个声明；`ArchiveRepositoryCursorMapping` 只有一个 struct 声明。先前观察到的连续重复来自截断输出拼接，不修改校准真相。

## 5. 改动前后对比

| 装配前 | 装配后目标 | 原因 |
|---|---|---|
| 旧版 15 节 historical 文档 | 当前规范十八章正式入口 | 对齐详细设计主链 |
| 按旧业务“部分”组织 | 六个技术模块为第 5 章主轴 | 可由 crate/file/dependency 强制实现边界 |
| 旧对象/API/表结构 | 26 正式对象、30 logical entries、18 状态主语 | 与正式 02 及 Step 06～10 同分母 |
| Archive 拥有 retention/hold/purge 倾向 | governance/owner 决定，Archive 只消费并执行 | 避免 authority 越权 |
| Bundle/restore 近似成功真相 | exact basis、per-owner outcome、unknown/reconcile/compensation | 不把包当跨域写权或恢复成功证明 |
| 未分类仓依赖 | compile/runtime/event/ref/adapter/fake 分离 | 防止 Cargo 方向污染 |

## 6. 设计取舍

| 议题 | 选择 | 理由 |
|---|---|---|
| 正文详细度 | 给出完整模块/对象/port/protocol/flow/state/transaction 索引和关键合同，精确长卡片回指 Step | 可落码且避免双真相 |
| 对象卡片 | §5 按模块列具名对象、核心字段/工厂/不变量，并声明完整字段表的规范性来源 | 满足模块主轴，不压缩掉实现入口 |
| 协议与 flow | 30 个入口逐项列出 schema/结果/处理流摘要，完整 DTO/伪代码回指 Step 08/09 | 保持 1:1 定位和分母可审计 |
| 不确定外部细节 | 只写 typed slot、失败姿态和关闭条件 | 不私造 provider、算法、版本、数字或成功 |
| 图 | §4 保留依赖/布局图，§8 保留共享 effect flow，§9 保留状态族图；不为每个入口复制图 | 复杂关系可读，具体图仍由 Step 文件规范承载 |

## 7. 十八章装配映射

| 正式章节 | 校准来源 | 必须保留的结论 |
|---|---|---|
| §1 | Step 01 | 正式 00/01/02 输入、上游不重答、historical 排除 |
| §2 | Step 02 | 六 CP、实现范围/非范围、完成上限 |
| §3 | Step 03 | Rust 2024/MSRV、源码英文、Core 唯一 compile candidate |
| §4 | Step 04 | 六 crate、planned 文件树、Cargo/运行关系分离 |
| §5 | Step 05/06/07 | 六模块、26 对象、8 service、7 port family 与稳定技术 carrier |
| §6 | Step 06/07/08 | 对象、trait/adapter 与 30 入口查找索引；不新增设计 |
| §7 | Step 08 | 3C/5Q/5E/17J、完整 replay、blocked outbound |
| §8 | Step 09 | 30 logical / 32 surface 逐接口 flow 与外部 effect fence |
| §9 | Step 10 | 18 状态主语、非法迁移、owner 状态不传播 |
| §10 | Step 11 | logical collection、UoW、CAS/read-set、cursor pending、无 outbox |
| §11 | Step 12 | 六模块错误、对外安全映射、probe/reconcile |
| §12 | Step 13 | operation key/input、并发、duplicate replay、partial resume |
| §13 | Step 14 | config owner、11 adapter slots、required assembly 与依赖绑定 |
| §14 | Step 15 | telemetry/native record/observability material 分层与 redaction |
| §15 | Step 16 | 6/26/8/30/32/18/8 覆盖切口与 blocked positive tests |
| §16 | Step 17 | 三类交付状态、future boundary family、07 重审门禁 |
| §17 | Step 18 | 12 blocker、6 local pending、逐 target closure |
| §18 | Step 01～19 与实际标准 | 只列真实读取/使用的标准、上游和校准入口 |

## 8. 固定分母与交叉审计计划

| 分母 | 固定值 | 审计方法 |
|---|---:|---|
| planned crates | 6 | §4/§5 枚举一致，禁止混入 jobs/sdk/provider crate |
| 正式对象 | 26 | 2 contracts + 24 domain；§5/§6 与 Step 06 对齐 |
| application services | 8 | §5/§6/§8 唯一归属 |
| business/local port families | 7 | store + source/integrity/compatibility/governance/storage/receiver；support carrier 不扩分母 |
| logical entries / method surfaces | 30 / 32 | 3C + 5Q + 5E + 17J；E04/J12 双互斥 surface |
| 状态主语 | 18 | §9 与 Step 10 一一对应，不新增 global state |
| source authority classes | 8 | §5/§7/§10 保持 canonical/auxiliary/material/ref 区分 |
| outbound candidates | 3 blocked | 无 topic/schema/outbox/publisher/delivery evidence |

交叉审计还必须覆盖：每章 calibration source；workspace 永为 Auxiliary；所有 L1/artifact/observability owner 不被 Archive 替代；依赖分类；字段/DTO/Query/state/UoW/idempotency/config/observability/test 闭环；Markdown fence/table/link/尾空白；historical vendor/年限/性能/旧对象污染；无实现或 readiness 事实。

## 9. 正式回填草稿

正式正文以“实现入口 + 规范性 Step 引用”组织：第 5 章按六模块给出 capability、文件、正式对象/稳定 carrier、port、关键函数、错误和测试；第 6 章只列索引；第 7～9 章逐名列出全部协议/flow/状态；第 10～15 章固化横切实现合同；第 16～17 章明确实施门禁与未关闭事项；第 18 章列实际参考。

任何摘要不足以还原字段、variant、trait method 或 DTO 时，实施者必须继续读取本章列出的 Step 文件；若 Step 仍不闭合则回退设计，不能自行补 schema、provider、算法、配置或成功口径。

## 10. 待确认事项与完成门禁

`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 和 `AR-03-LOCAL-001~006` 全部保持开放。本步不会生成 owner confirmation、algorithm、config value、target repo、baseline、commit、run、bundle、digest、artifact、report、evidence、verdict、signoff 或 readiness。

| 完成条件 | 当前状态 |
|---|---|
| 正式 03 已整体重建为十八章 | passed：编号为 1～18 且连续，无第 19 个正式主章 |
| 每章具名校准来源与延伸阅读 | passed：18 个 `校准来源` + 18 个 `延伸阅读`，均指向具体 Step 文件/小节 |
| 六模块与全部固定分母一致 | passed：`6 crates / 26 objects / 8 services / 7 port families / 30 logical entries / 32 method surfaces / 18 states / 8 source classes`；3 个 outbound candidate 仍 blocked |
| source-authority / owner / dependency / no-write / external effect 边界通过 | passed_with_upstream_blockers：workspace 永为 Auxiliary；Archive 不反写 owner truth；仅 Core contracts 为 compile candidate；Query 零写；effect 先 intent 后调用，unknown 只 exact probe/reconcile |
| historical pollution、Markdown、链接与 diff 静态审计通过 | passed：正式 03 正文对旧 owned object/provider/年限/性能/算法污染为零命中（本 Step 中间产物仍保留 historical 诊断名称）；12 个 fence 成对；表格列检查、本地 Markdown 链接、尾空白和 `git diff --check -- projects/L4-archive` 通过 |
| flow/ledger 更新为 formal stop_review | completed：当前 Step、写入权、下一动作和不实施/不测试/不提交门禁已同步 |

### 10.1 实际装配与审计记录

| 审计面 | 实际结果 |
|---|---|
| 正文装配 | historical 正式 03 已整体替换为当前十八章入口；第 5 章按六模块组织，第 6 章仅作对象/Trait/API 索引 |
| 协议与状态计数 | 正式 §7 为 `3C + 5Q + 5E + 17J = 30`；正式 §9 为 18 行状态主语；E04/J12 的双 method surface 仍互斥，不扩 logical entry |
| 状态同名复核 | 逐行对照 Step 10；修正 admission、capture、retrieval、compensation、idempotency、worker entry/claim 摘要，并消除 stage 与 aggregate posture、`CommitUnknown` 与 `Unknown` 的混写；18 个状态主语的集合与关键出边均保持一致 |
| source / owner | §7.5 完整枚举 8 类 authority；L1 canonical、workspace Auxiliary、Artifact material/lineage、observability material 各自分离；Bundle 不产生跨域写权 |
| 依赖与外部作用 | compile/runtime/event/ref/adapter/fake 已分类；无 SDK/server/provider compile 污染；无 outbox/publisher/topic/delivery truth；CommitUnknown 不盲重发 |
| 闭环 | 对象字段与 factory 回指 Step 06，trait/port 回指 Step 07，DTO 回指 Step 08，逐 flow 回指 Step 09，状态回指 Step 10；UoW、Query、idempotency、cursor/config pending、观测与测试切口均有正式入口 |
| 未伪造事实 | 未创建目标仓/代码/04～07/implementation ledger/skeleton，未运行项目测试，未生成 bundle/digest/artifact/report/evidence/verdict/signoff/readiness，未提交 commit |

### 10.2 完成结论

Step 19 已完成，正式 `03-详细设计.md` 状态为 `formal / stop_review`。`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 与 `AR-03-LOCAL-001~006` 均未被静态审计关闭；无新增 owning-project blocker。下一动作只能等待用户审查并明确授权正式 04；不得自动进入 04，也不得提交 commit。
