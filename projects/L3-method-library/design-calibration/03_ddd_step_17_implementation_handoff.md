# Step 17. 收口详细设计到实施计划的承接清单

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 17
> 回填章节: `projects/L3-method-library/03-详细设计.md` §16 详细设计到实施计划的承接清单
> 创建日期: 2026-06-24
> 当前模式: full-restart / step17-implementation-handoff
> 当前状态: completed_wait_user_confirm
> 当前模块: `R17.14 formal §16 candidate stop-review:再写入`
> 当前门禁: `R17.14` completed_wait_user_confirm;Step 17 completed;等待确认进入 Step 18 `R18.1 开工与必读文档:先思考`

---

## 0. 文件重置记录

旧 `03_ddd_step_17_implementation_handoff.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 `MethodContent`、P0 / P1、旧 crate / module、snapshot、fingerprint、outbox、Gateway、PostgreSQL、object storage、旧 `ResolveViewProfile` 和旧实施仓路径口径展开。该 completed 状态和旧实施承接结论全部失效。

当前 Step 17 不继承旧实施承接清单、旧前置阅读、旧待确认项、旧 crate 名、旧 P0 / P1 任务、旧实现仓路径、旧测试承接或旧回填草稿。旧内容只能作为 historical pollution 和差异审计输入,不得作为当前 L3-method-library 实施承接的正向来源。

当前 Step 17 的唯一正向基线是:

- 当前 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。
- 本轮 `03-详细设计` Step 1~16 中间产物。
- 特别是 Step 5 的七实现单元主轴,Step 6 对象契约,Step 7 port / adapter 契约,Step 8 protocol,Step 9 function flows,Step 10 state machine,Step 11 persistence / transaction,Step 12 error / recovery,Step 13 concurrency / idempotency,Step 14 config / dependency,Step 15 observability / audit,Step 16 test cuts and downstream handoff。

---

## R17.1 开工与必读文档:先思考

### 1. 当前模块目标

`R17.1` 只思考 Step 17 的开工边界、必读文档、Step 16 handoff、L1-governance Step 17 框架参考、旧 Step 17 污染隔离、实施承接清单分批计划和 `R17.2` 写入边界。当前模块不写最终实施承接清单、不写正式实施计划、不写 phase / commit boundary、不写代码文件清单、不写 evidence schema、不写 CI command、不写 acceptance gate、不写 implementation code,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 Step 16 completed 推进到 Step 17 `R17.1`。 |
| 当前允许 | 思考 Step 17 开工边界、必读文档、Step 16 handoff、L1-governance 框架参考、旧材料隔离、分批计划和 R17.2 写入边界。 |
| 当前禁止 | 写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate、implementation code、具体 config key/env/topic/URL 或正式 `03-详细设计.md`。 |

### 2. Step 17 开工边界思考

| 事项 | R17.1 裁决 |
|---|---|
| Step 17 的定位 | 详细设计到实施计划的承接清单,不是 `07-实施计划.md` 本体。 |
| 输出责任 | 后续写实施承接清单、实施前置阅读清单、字段 / DTO / 状态 / phase boundary 预复核、命名一致性复核、未进入实施的待确认项。 |
| 下游关系 | 为 `04/05/06/07/17/19` 提供输入;正式实现移交仍必须由 `07` 按 phase / commit boundary 审计正式 `03/05/06/07`。 |
| 禁止越界 | 不写开发排期、任务拆分、commit boundary、代码文件清单、CI 命令、run-scoped evidence schema、验收门禁或实现代码。 |
| 正式文档 | 本 Step 不直接修改正式 `03-详细设计.md`;后续正式装配由 Step 19 或明确回填模块处理。 |

### 3. 必读文档思考

| 文档 | Step 17 用途 | 当前 R17.1 口径 |
|---|---|---|
| `project_execution_ledger.md` | 确认当前恢复点、单模块推进规则、Step 16 completed。 | 每次只推进一个 `R17.x` 模块。 |
| `03_ddd_calibration_flow.md` | 确认 Step 17 pending、R17.1 等待确认、Step 18+ blocked。 | R17.1 完成后只能等待 R17.2。 |
| `03_ddd_step_17_implementation_handoff.md` | 当前文件旧内容已重置为 historical material。 | 不继承旧 `[x] 已确认`。 |
| `00-需求文档.md` | 固定仓定位、范围、非目标和验收红线。 | 只作为实施承接输入,不重写需求。 |
| `01-架构设计.md` | 固定系统边界、依赖方向、数据所有权和一致性边界。 | 不重划架构。 |
| `02-概要设计.md` | 固定八组件、对象轮廓、接口骨架、处理流、状态、异常、配置影响。 | 不恢复旧概要或旧正式 03。 |
| Step 1~16 中间产物 | 详细设计实现契约的唯一当前来源。 | R17 后续承接清单必须逐项回指。 |
| `详细设计讨论流程_SOP.md` Step 17 | 固定 Step 17 目标、输出、十二问、执行约束和进入下一步条件。 | 不写实施计划本体。 |
| `详细设计书写规范.md` §5.16 | 固定实施承接清单、前置阅读、未进入实施项、跨文档一致性复核表。 | 后续 R17.2+ 按此结构落地。 |
| `设计文档讨论中间产物规范.md` | 固定跨文档一致性复核和中间产物可恢复台账要求。 | 后续写复核表时必须可追溯。 |
| `设计真相源闭环与可落码性标准.md` | 固定 07 交付实现前整体审计和实现不得补 schema/port/state/mapper/config/evidence/phase。 | Step 17 只提供审计输入,不替代 07 boundary 审计。 |
| `实施计划书写规范.md` / `实施计划讨论流程_SOP.md` | 理解 07 需要的 phase / commit boundary、阅读门禁、台账与证据。 | Step 17 不提前写 07。 |
| `代码实施台账与门禁规范.md` | 后续 07 / 实现开工要承接台账与 boundary gate。 | R17 可标记为下游必读,不创建实现台账。 |
| L1-governance Step 17 | 参考组织深度、预复核表和 handoff 方式。 | 只参考框架,不得复制 governance 领域语义。 |

### 4. Step 16 handoff 承接思考

| Step 16 handoff | Step 17 承接方式 |
|---|---|
| Step 5~15 source coverage audit | 后续 R17 需要把已覆盖的 source Step 转成实施承接输入,但不重复测试表。 |
| formal §15 source map | Step 17 可引用测试切口作为 05/06/07 输入,不得写 TC ID 或 evidence schema。 |
| deferred-to-04/05/06/07 | 后续承接清单必须明确哪些事项不进入实现前置,而是交给配置、测试、验收、实施计划。 |
| Step 17 entry gate | R17.1 已按 gate 进入,只思考开工与必读文档。 |
| no formal 03 direct edit | Step 17 继续保持正式 `03-详细设计.md` 不改。 |

### 5. L1-governance Step 17 框架参考思考

L1-governance Step 17 的价值在组织深度,不是领域语义。L3-method-library 只参考其“目标 -> 输入 -> SOP 问题 -> 文档诊断 -> 设计取舍 -> 承接图 -> 实施承接清单 -> 前置阅读 -> 跨文档预复核 -> 未进入实施项 -> Step 18 gate”的结构。

| L1 Step 17 框架点 | L3 采用方式 |
|---|---|
| Step 17 不是实施计划本体 | L3 Step 17 不写 phase / commit boundary,只提供 07 输入。 |
| 输入必须覆盖 Step 1~16 | L3 后续按当前 Step 1~16 逐项建立实施承接表。 |
| 前置阅读必须显式列出 | L3 后续列正式 00/01/02/03、calibration source、Rust/提交/台账/实施计划规范。 |
| 跨文档预复核 | L3 后续复核字段、DTO/Event/Job、Query surface、状态、测试切口、phase boundary 输入是否足够。 |
| 07 仍要做正式 boundary 审计 | L3 明确 Step 17 只给审计输入,不替代 07 对正式 `03/05/06/07` 的逐 boundary 审计。 |

### 6. SOP 十二问初步回答

| SOP 问题 | R17.1 初步回答 | 后续落点 |
|---|---|---|
| 哪些实现契约已经足够进入实施计划? | Step 1~16 已覆盖输入边界、范围、runtime、布局、模块、对象、port、protocol、flow、state、persistence、error、idempotency、config、observability、test cut。 | R17.5/R17.6 |
| 实施者需要先阅读哪些文档? | 正式 00/01/02、Step 1~16、后续正式 03、04/05/06/07、Rust 编码、提交、目录组织、实施计划、可落码性、代码实施台账规范。 | R17.7/R17.8 |
| 提交规范、git config、Rust 编码规范和注释规范是否列入前置阅读? | 必须列入,但具体实现仓 git config 要在 07 / 实现开工时重新确认。 | R17.7/R17.8 |
| Domain 必填字段是否能回指正式来源? | 需要从 Step 6/8/9/11 做预复核,缺口不得交给实现者。 | R17.9/R17.10 |
| Command / Event / Job 是否能构造目标对象或明确缺失处理? | 需要从 Step 8/9/11/12/13 复核 DTO、flow、stored surface、error/replay。 | R17.9/R17.10 |
| Query response / page / marker 是否闭合? | 需要从 Step 7/8/9/10/12/15 复核 no-write、visible/empty/degraded/unavailable surface。 | R17.9/R17.10 |
| 状态枚举、状态图、测试切口、验收口径是否同名? | 当前 Step 10/16 已闭合到详细设计层;05/06/07 仍需正式复核。 | R17.9/R17.10 |
| 当前 phase / commit boundary 是否误用后续 phase? | Step 17 不定义 phase;只提供 07 审计输入和预警口径。 | R17.11/R17.12 |
| 哪些字段、状态、函数、用例或证据仍有旧名漂移? | 旧 MethodContent、P0/P1、snapshot、fingerprint、outbox relay 等全部列为历史污染候选。 | R17.11/R17.12 |
| 哪些内容仍待确认,不能进入实施? | 04/05/06/07 正式文档、具体配置、TC/evidence、commit boundary、implementation ledger 等后移。 | R17.11/R17.12 |
| 实施计划应该如何引用本文? | 07 应引用正式 03 章节和 calibration source map,不复制对象字段、DTO、flow、state、test tables。 | R17.13/R17.14 |
| 是否给 07 boundary 审计提供足够输入? | R17 完成后应提供对象、协议、flow、状态、持久化、测试切口和验收映射输入;正式审计仍由 07 执行。 | R17.13/R17.14 |

### 7. 旧 Step 17 污染隔离思考

| 旧内容 | 当前处理 |
|---|---|
| 旧 `[x] 已确认` 状态 | invalid;当前 Step 17 从 R17.1 重新执行。 |
| 旧 `MethodContent` / publish / retire / supersede 承接 | historical pollution;不得进入当前 L3-method-library 实施承接。 |
| 旧 P0 / P1 任务边界 | 不继承;当前范围以 Step 2/5/8/9/16 为准。 |
| 旧 crate / module / repo path | 不继承;当前实现单元以 Step 4/5 为准。 |
| 旧 snapshot / fingerprint / object storage / PostgreSQL / Gateway | 不作为当前承接真相源;若当前设计另有对象或 adapter,必须回指本轮 Step。 |
| 旧测试、CI、evidence、commit 口径 | 不继承;完整测试方案、验收、实施计划后移。 |

### 8. Step 17 初步分批思考

| 模块 | 主题 | 初判边界 |
|---|---|---|
| R17.1/R17.2 | 开工与必读文档 | 写输入基线、旧材料隔离、SOP 十二问、分批计划。 |
| R17.3/R17.4 | L1-governance 框架对齐与承接总图 | 写 Step 17 总图、下游边界、07 审计输入总览。 |
| R17.5/R17.6 | implementation handoff source matrix | 写 Step 1~16 到实施承接项的 source matrix。 |
| R17.7/R17.8 | implementation preread and agent gate | 写前置阅读、提交规范、git config、编码规范、台账规范、目标仓检查门禁。 |
| R17.9/R17.10 | cross-document closure pre-audit | 写字段、DTO/Event/Job、Query surface、state、flow、test cut、phase boundary 预复核。 |
| R17.11/R17.12 | not-entering-implementation and downstream handoff | 写未进入实施项、04/05/06/07/18/19 handoff、blocker watch。 |
| R17.13/R17.14 | formal §16 candidate stop-review | 写 formal §16 source map、禁入项、Step 18 entry gate 和 completed stop-review。 |

### 9. R17.2 写入边界思考

`R17.2 开工与必读文档:再写入` 只应把 R17.1 的开工思考落成可恢复台账,不得写最终实施承接清单:

1. 写 Step 17 必读文档表与读取状态。
2. 写输入基线与旧材料处理规则。
3. 写 Step 16 handoff 承接表。
4. 写 SOP 十二问初步回答。
5. 写 Step 17 输出骨架、模块计划和 L1-governance 框架参考边界。
6. 写 `R17.3 L1-governance 框架对齐与承接总图:先思考` 进入门禁。

### 10. R17.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否确认旧 Step 17 completed 作废 | pass |
| 是否只思考开工、必读文档、Step 16 handoff 和分批计划 | pass |
| 是否参考 L1-governance 框架但不复制领域语义 | pass |
| 是否明确不写正式实施计划、phase / commit boundary、evidence schema、CI | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否形成 R17.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.2 开工与必读文档:再写入`;只允许写入 Step 17 必读文档表、读取状态、输入基线、旧材料处理规则、Step 16 handoff 承接、SOP 十二问初步回答、输出骨架、模块计划、L1-governance 框架参考边界和 `R17.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.2 开工与必读文档:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.1` 推进到 `R17.2`。 |
| 本模块写入范围 | Step 17 必读文档表、读取状态、输入基线、旧材料处理规则、Step 16 handoff 承接、SOP 十二问初步回答、输出骨架、模块计划、L1-governance 框架参考边界和 `R17.3` 进入门禁。 |
| 本模块禁止范围 | 最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate、implementation code、具体 config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. 必读文档表与读取状态

| 文档 | 读取状态 | Step 17 用途 | 当前裁决 |
|---|---|---|---|
| `project_execution_ledger.md` | 已读取并承接 | 确认当前恢复点、单模块推进规则、Step 17 当前门禁。 | 每次只推进一个 `R17.x` 模块。 |
| `03_ddd_calibration_flow.md` | 已读取并承接 | 确认 Step 16 completed、Step 17 in_progress、Step 18+ blocked。 | `R17.2` 完成后只能等待 `R17.3`。 |
| `03_ddd_step_17_implementation_handoff.md` | 已读取并重置 | 确认旧文件污染已隔离、`R17.1` 已形成开工思考。 | 当前只补开工写入台账。 |
| `00-需求文档.md` | 作为正式上游基线 | 固定仓定位、范围、非目标、业务规则和验收红线。 | Step 17 不重写需求;只把需求约束作为实施承接输入。 |
| `01-架构设计.md` | 作为正式上游基线 | 固定系统边界、依赖方向、数据所有权、一致性边界和横切关注点。 | Step 17 不重划架构。 |
| `02-概要设计.md` | 作为直接输入基线 | 固定八组成部分、对象轮廓、接口骨架、处理流、状态、异常和配置影响。 | Step 17 必须回指概要承接,不得恢复旧 `03` 主线。 |
| Step 1~4 中间产物 | 已完成并列入必读 | 固定输入边界、范围、runtime / 仓库约束、实现单元与文件布局。 | 后续前置阅读和目标仓门禁必须引用。 |
| Step 5 中间产物 | 已完成并列入必读 | 固定七实现单元主轴和依赖方向。 | 实施承接不能改成旧 crate / module。 |
| Step 6 中间产物 | 已完成并列入必读 | 固定对象、字段、状态主语、marker、report、audit 和 body-free redline。 | 字段闭环预复核必须回指 Step 6。 |
| Step 7 中间产物 | 已完成并列入必读 | 固定 trait、port、repository、adapter、resolver、publisher、handoff。 | 实施者不得自行新增未闭口 port / mapper。 |
| Step 8 中间产物 | 已完成并列入必读 | 固定 Command / Query / Inbound / Outbound / Job public protocol。 | DTO / Event / Job 构造闭环必须回指 Step 8。 |
| Step 9 中间产物 | 已完成并列入必读 | 固定逐接口函数级 flow、事务顺序、副作用顺序和异常分支。 | 07 只能引用 flow,不得重写 flow。 |
| Step 10 中间产物 | 已完成并列入必读 | 固定状态机、状态枚举、合法 / 非法迁移和 no-write 约束。 | 状态名必须传递到 05/06/07。 |
| Step 11~13 中间产物 | 已完成并列入必读 | 固定 persistence、transaction、error/recovery、concurrency/idempotency。 | 实施前预复核必须覆盖 stored surface、rollback、duplicate replay。 |
| Step 14~15 中间产物 | 已完成并列入必读 | 固定 config/dependency、observability/audit/redaction。 | 不在 Step 17 写具体 key、topic、URL 或 observability backend。 |
| Step 16 中间产物 | 已读取 handoff | 固定最小测试切口、source coverage、formal §15 source map 和 Step 17 entry gate。 | Step 17 不重写测试切口。 |
| `详细设计讨论流程_SOP.md` Step 17 | 已读取并承接 | 固定 Step 17 十二问、输出、约束和进入下一步条件。 | 承接清单不是最终实现移交通行证。 |
| `详细设计书写规范.md` §5.16 | 已读取并承接 | 固定实施承接清单、前置阅读、未进入实施项、跨文档一致性复核表。 | 后续按该结构分批落地。 |
| `设计文档讨论中间产物规范.md` | 列入必读 | 固定中间产物、状态台账、恢复门禁和分批写入纪律。 | R17 后续继续先思考后写入。 |
| `设计真相源闭环与可落码性标准.md` | 列入必读 | 固定实现不得补 schema / port / DTO / state / mapper / config / evidence / phase。 | R17 只提供 07 审计输入。 |
| `实施计划书写规范.md` / `实施计划讨论流程_SOP.md` | 已读取边界并列入必读 | 理解 07 的 phase / commit boundary、阅读门禁、台账和证据职责。 | Step 17 不提前写 07。 |
| `代码实施台账与门禁规范.md` | 列入下游必读 | 后续实现开工要承接 implementation ledger 和 boundary gate。 | R17 不创建 implementation ledger。 |
| L1-governance Step 17 | 已读取框架 | 参考目标、输入、SOP 问答、诊断、取舍、承接图、复核表和停审方式。 | 只参考框架深度,不得复制 governance 领域语义。 |

### 3. 输入基线与旧材料处理规则

| 类别 | 当前口径 |
|---|---|
| 正向基线 | 当前 `00/01/02` 和本轮 Step 1~16 中间产物。 |
| 当前 Step 17 | 从 `R17.1` 起重启,旧 completed 状态作废。 |
| 旧正式 `03-详细设计.md` | historical material;只用于识别旧主线残留和旧结构污染。 |
| 旧 Step 17 | historical pollution;旧实施承接清单、前置阅读、实现仓路径、crate 名、测试 / CI / evidence / commit 口径不继承。 |
| 旧 `MethodContent` / publish / snapshot / fingerprint / outbox / Gateway / PostgreSQL / object storage | 不进入当前实施承接主线;若当前设计需要相似能力,必须回指本轮 Step 6~15 的正式对象、port、protocol 和 flow。 |
| 正式 `03-详细设计.md` | 本模块不修改;后续由 Step 19 或明确回填模块按 confirmed source map 装配。 |
| 04/05/06/07 | 作为下游消费者;Step 17 只提供输入和预警,不替代配置、测试、验收或实施计划。 |

### 4. Step 16 handoff 承接

| Step 16 输出 | Step 17 承接写法 | 本模块裁决 |
|---|---|---|
| Step 5~15 source coverage audit | 后续 R17 把覆盖状态转成实施承接 source matrix。 | 不重复测试切口表。 |
| R16.1~R16.16 coverage index | 后续 R17 用于证明 §15 候选来源完整。 | 不新增 test family。 |
| formal §15 source map | 后续 R17 只引用为测试切口输入来源。 | 不写 formal §15 正文。 |
| formal §15 forbidden carryover | 后续 R17 继承禁入项,防止 TC / fixture / evidence / CI 越界。 | 不写 case schema 或 evidence schema。 |
| downstream handoff table | 后续 R17 将 04/05/06/07 的消费者边界合并进实施承接清单。 | 不把下游职责改写为当前 Step 职责。 |
| Step 17 entry gate | 已满足 Step 16 completed、正式 03 未改、完整测试方案后移。 | 如发现新测试切口缺口,回 Step 16 或 owning Step。 |

### 5. SOP 十二问写入口径

| SOP 问题 | 当前写入口径 | 后续模块 |
|---|---|---|
| 哪些实现契约已经足够进入实施计划? | 按 Step 1~16 的对象、port、protocol、flow、state、persistence、error、idempotency、config、observability、test cut 建 source matrix。 | R17.5/R17.6 |
| 实施者需要先阅读哪些文档? | 列正式 00/01/02/03、Step 1~16 source、04/05/06/07、Rust、提交、目录组织、实施计划、可落码性、代码实施台账规范。 | R17.7/R17.8 |
| 提交规范、git config、Rust 编码规范和注释规范是否列入前置阅读? | 必须列入;具体实现仓 git config 在 07 / 实现开工时重新确认。 | R17.7/R17.8 |
| Domain 必填字段是否能回指正式来源? | 从 Step 6/8/9/11 做预复核,缺口不得交给实现者。 | R17.9/R17.10 |
| Command / Event / Job 是否能构造目标对象或明确缺失处理? | 从 Step 8/9/11/12/13 复核 DTO、flow、stored surface、error/replay。 | R17.9/R17.10 |
| Query response / page / marker 是否闭合? | 从 Step 7/8/9/10/12/15 复核 no-write、visible/empty/degraded/unavailable surface。 | R17.9/R17.10 |
| 状态枚举、状态图、测试切口、验收口径是否同名? | 以 Step 10/16 为预复核输入;05/06/07 仍需正式复核。 | R17.9/R17.10 |
| 当前 phase / commit boundary 是否误用后续 phase? | Step 17 不定义 phase;只提供 07 审计输入和预警口径。 | R17.11/R17.12 |
| 哪些字段、状态、函数、用例或证据仍有旧名漂移? | 旧 MethodContent、P0/P1、snapshot、fingerprint、outbox relay 等列为历史污染候选。 | R17.11/R17.12 |
| 哪些内容仍待确认,不能进入实施? | 04/05/06/07 正式文档、具体配置、TC/evidence、commit boundary、implementation ledger 等后移。 | R17.11/R17.12 |
| 实施计划应该如何引用本文? | 07 引用正式 03 章节和 calibration source map,不得复制字段 / DTO / flow / state / test tables 成第二真相源。 | R17.13/R17.14 |
| 是否给 07 boundary 审计提供足够输入? | R17 完成后应提供对象、协议、flow、状态、持久化、测试切口和验收映射输入;正式审计由 07 执行。 | R17.13/R17.14 |

### 6. Step 17 输出骨架与模块计划

| 后续模块 | 输出骨架 | 禁止越界 |
|---|---|---|
| R17.3/R17.4 | L1-governance 框架映射、L3 承接总图、07 审计输入总览。 | 不写最终承接清单或 phase / commit boundary。 |
| R17.5/R17.6 | Step 1~16 到实施承接项的 source matrix。 | 不复制对象字段表或 DTO schema。 |
| R17.7/R17.8 | 实施前置阅读和 agent gate。 | 不创建 implementation ledger 或 commit boundary。 |
| R17.9/R17.10 | 字段、DTO/Event/Job、Query surface、state、flow、test cut、phase boundary 预复核。 | 不替代 07 对正式 `03/05/06/07` 的 boundary 审计。 |
| R17.11/R17.12 | 未进入实施项、04/05/06/07/18/19 handoff、blocker watch。 | 不把未闭口问题交给实现者自行选择。 |
| R17.13/R17.14 | formal §16 source map、禁入项、Step 18 entry gate 和 completed stop-review。 | 不写正式 §16 正文或正式 `03`。 |

### 7. L1-governance 框架参考边界

| 可参考 | L3-method-library 采用方式 |
|---|---|
| 目标 / 输入 / SOP 问题 / 诊断 / 取舍 / 承接图 / 承接清单 / 前置阅读 / 复核表 / 待确认项 / 停审 | 在 R17.3/R17.4 中转成 L3 承接总图和审计输入框架。 |
| 字段闭环、DTO 构造闭环、Query response 闭环、状态闭环、phase boundary 预复核 | 在 R17.9/R17.10 中按 L3 当前对象、协议、flow、状态和测试切口重新填充。 |
| 07 仍需按 phase / commit boundary 做正式闭环审计 | 在 R17.11~R17.14 中固定为下游 handoff,不替代实施计划。 |

| 不可复制 | 处理 |
|---|---|
| governance 领域对象、Command 数量、Query 数量、目标仓路径、crate/package 名、旧 phase/commit 例子 | 禁止复制;L3 只使用本轮 Step 1~16 的正式名称。 |
| L1 中已识别的字段、DTO、测试、实现仓检查结果 | 不作为 L3 事实;只能提示 L3 需要做同类复核。 |

### 8. R17.3 进入门禁

`R17.3 L1-governance 框架对齐与承接总图:先思考` 只允许思考:

1. L1-governance Step 17 的框架如何映射到 L3-method-library。
2. L3 Step 17 的承接总图、下游边界和 07 审计输入总览。
3. Step 1~16 source family 如何进入后续 source matrix。
4. 哪些旧材料、实现计划、phase / commit、CI / evidence 内容继续禁入。
5. 不写最终 implementation handoff checklist、不修改正式 `03-详细设计.md`。

### 9. R17.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 17 必读文档表与读取状态 | pass |
| 是否写入输入基线与旧材料处理规则 | pass |
| 是否承接 Step 16 handoff | pass |
| 是否写入 SOP 十二问初步回答 | pass |
| 是否写入输出骨架、模块计划和 L1-governance 框架参考边界 | pass |
| 是否形成 R17.3 进入门禁 | pass |
| 是否未写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.3 L1-governance 框架对齐与承接总图:先思考`;只允许思考 L1-governance Step 17 框架到 L3-method-library 的映射、L3 承接总图、下游边界、07 审计输入总览、Step 1~16 source family 和禁入项;不得直接修改正式 `03-详细设计.md`;不得写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.3 L1-governance 框架对齐与承接总图:先思考

### 1. 当前模块目标

`R17.3` 只思考 L1-governance Step 17 的框架如何映射到 L3-method-library,并形成 L3 承接总图、下游边界、07 审计输入总览、Step 1~16 source family 和禁入项的写入计划。当前模块不写最终 implementation handoff checklist、不写正式实施计划、不写 phase / commit boundary、不写代码文件清单、不写 evidence schema、不写 CI command、不写 acceptance gate、不写 implementation code,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.2` 推进到 `R17.3`。 |
| 当前允许 | 思考 L1-governance Step 17 框架映射、L3 承接总图、下游边界、07 审计输入总览、Step 1~16 source family 和禁入项。 |
| 当前禁止 | 写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate、implementation code、具体 config key/env/topic/URL 或正式 `03-详细设计.md`。 |

### 2. L1-governance Step 17 可复用框架思考

L1-governance Step 17 已证明一个有效框架:先声明 Step 17 不是实施计划,再把 Step 1~16 的实现契约归并成 07 可引用的 source map,同时在正式进入实施计划前做字段、DTO、Query、状态、命名和 phase boundary 的预复核。L3-method-library 应采用这个组织顺序,但所有领域事实、对象名、协议数、目标仓路径和实现范围必须来自 L3 本轮 Step 1~16。

| L1 框架块 | L3 采用思路 |
|---|---|
| Step 状态与本步目标 | L3 写清 Step 17 只做 `03 -> 07` 承接输入,不直接放行实现。 |
| 本步输入 | L3 输入必须覆盖当前 `00/01/02`、Step 1~16、Step 16 handoff、SOP / 书写规范 / 可落码性标准。 |
| SOP 问题回答 | L3 保留十二问,但答案延后到 R17.5~R17.14 逐步收敛。 |
| 当前文档问题诊断 | L3 重点诊断旧 `03` / 旧 Step 17 / 旧 MethodContent 主线污染和后续文档未生成。 |
| 设计取舍 | L3 固定不写 07、不复制详细设计表、不把旧正式 03 交给实现、不恢复旧测试/CI/evidence。 |
| 承接关系图 | L3 需要画 `00/01/02 -> Step 1~16 -> Step 17 -> Step 18/19 -> 04/05/06/07 -> implementation` 的候选图。 |
| 实施承接清单 | L3 后续 R17.5/R17.6 才写 source matrix,当前只思考承接来源族。 |
| 前置阅读 / 检查清单 | L3 后续 R17.7/R17.8 才写,当前只确认需要包含 Rust、提交、目录、可落码性、实施台账门禁。 |
| 跨文档一致性复核 | L3 后续 R17.9/R17.10 才写,当前只确认复核轴。 |
| 未进入实施事项 | L3 后续 R17.11/R17.12 才写,当前只列禁入方向。 |

### 3. L3 承接总图思考

Step 17 的总图应表达“详细设计中间产物如何成为实施计划输入”,而不是“实现如何排期”。候选图应保留四层边界:

```text
+-------------------+
| 00 / 01 / 02      |
| formal upstream   |
+---------+---------+
          |
          v
+-------------------+
| 03 Step 1 - 16    |
| implementation    |
| contracts source  |
+---------+---------+
          |
          v
+-------------------+
| Step 17 handoff   |
| source map +      |
| pre-audit input   |
+---------+---------+
          |
          v
+-------------------+
| Step 18 / Step 19 |
| risks + formal 03 |
+---------+---------+
          |
          v
+-------------------+
| 04 / 05 / 06 / 07 |
| downstream docs   |
+---------+---------+
          |
          v
+-------------------+
| implementation    |
| boundary ledgers  |
+-------------------+
```

图后说明应强调:

- Step 17 只整理承接输入和预复核轴,不替代 Step 19 正式装配。
- 04/05/06/07 是正式下游消费者,不是 Step 17 的正文展开对象。
- 07 需要按 phase / commit boundary 审计正式 `03/05/06/07`,不能只引用 Step 17 中间产物放行实现。
- 如果 Step 17 发现 source、schema、marker、state 或 mapper 缺口,必须回 owning Step,不能把缺口留给实现 agent。

### 4. 下游边界思考

| 下游文档 / 步骤 | Step 17 应交付 | Step 17 不应交付 |
|---|---|---|
| Step 18 风险与待确认 | 未闭口事项、阻塞范围、需要回写的 owning Step。 | 新实现方案或临时假设。 |
| Step 19 正式 03 装配 | formal §16 source map、禁入项、可装配的承接结论。 | 未确认表格或新增实现契约。 |
| `04-配置设计.md` | config/dependency handoff 和 forbidden concrete config reminder。 | 具体 key/env/profile/topic/URL/default/secret source。 |
| `05-测试方案.md` | Step 16 最小测试切口 source map、待生成 case family。 | TC 编号、fixture、suite priority、evidence artifact schema。 |
| `06-验收标准.md` | 验收红线输入,例如 no raw body、no synthetic marker、query no-write、duplicate no-rerun。 | 最终验收门禁、报告模板或覆盖率目标。 |
| `07-实施计划.md` | source matrix、前置阅读、闭环预复核轴、实现暂停条件候选。 | phase / commit boundary、代码文件清单、CI command、run-scoped report schema。 |
| implementation agent | 通过 07 获取正式边界和台账,不是直接从 R17 开工。 | 直接拿 Step 17 中间产物改实现仓。 |

### 5. 07 审计输入总览思考

`07-实施计划.md` 最终需要的不是一份复制版详细设计,而是一组可审计入口。R17 后续应把这些入口整理清楚:

| 审计输入族 | 来源 | 07 使用方式 |
|---|---|---|
| 上游与范围 | Step 1~2 | 确认 phase 不扩域、不恢复旧主线。 |
| runtime / repo / layout | Step 3~4 | 确认目标仓、workspace、crate/package、依赖方向、提交语言和 git config。 |
| 模块 / 对象 / port / protocol | Step 5~8 | 确认每个 commit boundary 需要的对象、trait、DTO、event、job surface 已正式闭口。 |
| flow / state / persistence | Step 9~11 | 确认实现顺序、事务边界、状态迁移、repository key、stored surface 和 no-write 约束。 |
| error / idempotency | Step 12~13 | 确认 reject/retry/degraded/quarantine/dead-letter、duplicate replay、commit unknown 和 race 处理。 |
| config / observability / test | Step 14~16 | 确认配置绑定、adapter availability、redaction、audit refs-only、最小验证入口和下游测试来源。 |
| formal assembly / risk | Step 18~19 | 确认未闭口事项没有被移交给实现者自行取舍。 |

### 6. Step 1~16 source family 思考

R17.4 可以先写 source family,不急于写最终承接清单。候选分组如下:

| source family | 包含 Step | 后续作用 |
|---|---|---|
| baseline family | Step 1~2 | 输入边界、范围、非范围和旧材料禁入。 |
| implementation shape family | Step 3~5 | runtime、仓库、文件布局、七实现单元和依赖方向。 |
| contract family | Step 6~8 | object、trait/port/adapter、protocol/public surface。 |
| execution semantics family | Step 9~13 | flow、state、persistence、error、concurrency、idempotency。 |
| runtime binding family | Step 14~15 | config/dependency、observability/audit/redaction。 |
| verification family | Step 16 | 最小测试切口、source coverage 和 downstream handoff。 |
| handoff family | Step 17~19 | 07 输入、风险/待确认、正式 03 装配。 |

### 7. 禁入项思考

| 禁入项 | 原因 |
|---|---|
| 最终实施承接清单 | 应在 R17.5/R17.6 source matrix 之后写,当前只做框架思考。 |
| 正式实施计划、phase / commit boundary | 属于 `07-实施计划.md`,Step 17 只提供输入。 |
| 代码文件清单、CI command、run report / evidence schema | 属于 05/06/07 或 implementation ledger,不得在当前 Step 发明。 |
| 具体 config key/env/topic/URL/default/secret source | 属于 04 或后续配置文档。 |
| 旧 MethodContent / P0/P1 / snapshot / fingerprint / outbox relay / Gateway / PostgreSQL / object storage | historical pollution,不得作为 L3 当前实施承接来源。 |
| 直接修改正式 `03-详细设计.md` | 正式装配由 Step 19 或明确回填模块执行。 |

### 8. R17.4 写入计划思考

`R17.4 L1-governance 框架对齐与承接总图:再写入` 应把本模块思考落成可恢复记录:

1. 写 L1-governance Step 17 框架到 L3 的映射表。
2. 写 L3 承接关系候选 ASCII 图和图后说明。
3. 写下游边界表。
4. 写 07 审计输入族表。
5. 写 Step 1~16 source family 表。
6. 写禁入项表和 `R17.5 implementation handoff source matrix:先思考` 进入门禁。
7. 不写最终实施承接清单、不修改正式 `03-详细设计.md`。

### 9. R17.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 L1-governance 框架映射与 L3 承接总图 | pass |
| 是否形成下游边界和 07 审计输入总览思考 | pass |
| 是否形成 Step 1~16 source family 思考 | pass |
| 是否列出禁入项 | pass |
| 是否形成 R17.4 写入计划 | pass |
| 是否未写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.4 L1-governance 框架对齐与承接总图:再写入`;只允许写入 L1-governance Step 17 框架到 L3 的映射表、L3 承接关系候选 ASCII 图、下游边界表、07 审计输入族表、Step 1~16 source family 表、禁入项表和 `R17.5 implementation handoff source matrix:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.4 L1-governance 框架对齐与承接总图:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.3` 推进到 `R17.4`。 |
| 本模块写入范围 | L1-governance Step 17 框架到 L3 的映射表、L3 承接关系候选 ASCII 图、下游边界表、07 审计输入族表、Step 1~16 source family 表、禁入项表和 `R17.5` 进入门禁。 |
| 本模块禁止范围 | 最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate、implementation code、具体 config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. L1-governance Step 17 框架到 L3 的映射表

| L1-governance 框架块 | L3-method-library 写入结果 | 当前边界 |
|---|---|---|
| Step 状态与本步目标 | 已固定 Step 17 只做 `03 -> 07` 承接输入,不直接放行实现。 | 不写实现排期或提交计划。 |
| 本步输入 | 当前 `00/01/02`、Step 1~16、Step 16 handoff、详细设计 SOP、书写规范和可落码性标准作为正向输入。 | 旧 `03` 和旧 Step 17 只作污染审计。 |
| SOP 十二问 | 保留十二问作为 R17.5~R17.14 的分批收敛轴。 | R17.4 不回答最终结论。 |
| 文档问题诊断 | 识别旧 `MethodContent` 主线、旧 P0/P1、旧实现仓路径、旧测试/CI/evidence 口径为污染候选。 | 不把旧口径带入 source matrix。 |
| 设计取舍 | 采用“Step 17 提供输入,07 定义 phase / commit boundary”的取舍。 | 不复制详细设计表格形成第二真相源。 |
| 承接关系图 | 写 L3 候选承接图,表达从上游到正式实现移交的文档链路。 | 图不表达排期、commit 或代码文件。 |
| 实施承接清单 | 后移到 R17.5/R17.6 的 source matrix。 | 当前不写最终 checklist。 |
| 前置阅读 / 检查清单 | 后移到 R17.7/R17.8。 | 当前只保留为后续输出骨架。 |
| 跨文档一致性复核 | 后移到 R17.9/R17.10。 | 当前只写审计输入族。 |
| 未进入实施事项 | 后移到 R17.11/R17.12。 | 当前只写禁入项。 |

### 3. L3 承接关系候选 ASCII 图

#### 承接图: 详细设计到实施计划的输入链路

```text
+-------------------+
| 00 / 01 / 02      |
| formal upstream   |
+---------+---------+
          |
          v
+-------------------+
| 03 Step 1 - 16    |
| implementation    |
| contracts source  |
+---------+---------+
          |
          v
+-------------------+
| Step 17 handoff   |
| source map +      |
| pre-audit input   |
+---------+---------+
          |
          v
+-------------------+
| Step 18 / Step 19 |
| risks + formal 03 |
+---------+---------+
          |
          v
+-------------------+
| 04 / 05 / 06 / 07 |
| downstream docs   |
+---------+---------+
          |
          v
+-------------------+
| implementation    |
| boundary ledgers  |
+-------------------+
```

关键说明:

- 图表达 detailed design source 如何进入 07 的审计输入,不表达开发排期。
- Step 17 只整理承接输入和预复核轴,不替代 Step 19 正式 `03` 装配。
- `04/05/06/07` 是正式下游消费者,不是 Step 17 的正文展开对象。
- 实现 agent 必须从 `07` 的 phase / commit boundary 和 implementation ledger 开工,不能直接从 R17 中间产物开工。

### 4. 下游边界表

| 下游文档 / 步骤 | Step 17 应交付 | Step 17 不应交付 |
|---|---|---|
| Step 18 风险与待确认 | 未闭口事项、阻塞范围、需要回写的 owning Step。 | 新实现方案、临时假设或绕过规则。 |
| Step 19 正式 03 装配 | formal §16 source map、禁入项和可装配的承接结论。 | 未确认表格或新增实现契约。 |
| `04-配置设计.md` | config/dependency handoff、forbidden concrete config reminder。 | 具体 key/env/profile/topic/URL/default/secret source。 |
| `05-测试方案.md` | Step 16 最小测试切口 source map、待生成 case family。 | TC 编号、fixture、suite priority、evidence artifact schema。 |
| `06-验收标准.md` | 验收红线输入,例如 no raw body、no synthetic marker、query no-write、duplicate no-rerun。 | 最终验收门禁、报告模板、覆盖率目标或 veto 表。 |
| `07-实施计划.md` | source matrix、前置阅读、闭环预复核轴、实现暂停条件候选。 | phase / commit boundary、代码文件清单、CI command、run-scoped report schema。 |
| implementation agent | 通过 07 获取正式边界、required reads、allowed scope、checks 和台账。 | 直接拿 Step 17 中间产物修改实现仓。 |

### 5. 07 审计输入族表

| 审计输入族 | 来源 | 07 使用方式 | 禁止误用 |
|---|---|---|---|
| 上游与范围 | Step 1~2 | 确认 phase 不扩域、不恢复旧主线。 | 用旧 `03` 或旧 P0/P1 重新定义范围。 |
| runtime / repo / layout | Step 3~4 | 确认目标仓、workspace、crate/package、依赖方向、提交语言和 git config。 | 在 Step 17 发明目标仓细节。 |
| 模块 / 对象 / port / protocol | Step 5~8 | 确认每个 boundary 需要的对象、trait、DTO、event、job surface 已正式闭口。 | 由实现者补 schema、port 或 marker。 |
| flow / state / persistence | Step 9~11 | 确认实现顺序、事务边界、状态迁移、repository key、stored surface 和 no-write 约束。 | 让 07 改写 flow 或弱化状态约束。 |
| error / idempotency | Step 12~13 | 确认 reject/retry/degraded/quarantine/dead-letter、duplicate replay、commit unknown 和 race 处理。 | duplicate 重跑或从 current truth 重建 stored surface。 |
| config / observability / test | Step 14~16 | 确认配置绑定、adapter availability、redaction、audit refs-only、最小验证入口和下游测试来源。 | 在 Step 17 写 config key、CI 或 evidence schema。 |
| formal assembly / risk | Step 18~19 | 确认未闭口事项没有被移交给实现者自行取舍。 | 跳过风险闭口直接开实现。 |

### 6. Step 1~16 source family 表

| source family | 包含 Step | 后续作用 | R17 后续落点 |
|---|---|---|---|
| baseline family | Step 1~2 | 输入边界、范围、非范围、旧材料禁入。 | R17.5/R17.6 source matrix。 |
| implementation shape family | Step 3~5 | runtime、仓库、文件布局、七实现单元、依赖方向。 | R17.5/R17.8 source matrix and preread gate。 |
| contract family | Step 6~8 | object、trait/port/adapter、protocol/public surface。 | R17.5/R17.10 contract closure pre-audit。 |
| execution semantics family | Step 9~13 | flow、state、persistence、error、concurrency、idempotency。 | R17.5/R17.10 flow/state/transaction closure pre-audit。 |
| runtime binding family | Step 14~15 | config/dependency、observability/audit/redaction。 | R17.7/R17.12 preread, downstream handoff and blocker watch。 |
| verification family | Step 16 | 最小测试切口、source coverage、formal §15 source map、downstream handoff。 | R17.5/R17.12 test and acceptance input handoff。 |
| handoff family | Step 17~19 | 07 输入、风险/待确认、正式 03 装配。 | R17.11/R17.14 and Step 18/19。 |

### 7. 禁入项表

| 禁入项 | 当前处理 |
|---|---|
| 最终实施承接清单 | 后移到 R17.5/R17.6 source matrix 后再写。 |
| 正式实施计划、phase / commit boundary | 后移到 `07-实施计划.md`。 |
| 代码文件清单、CI command、run report / evidence schema | 后移到 `05/06/07` 或 implementation ledger。 |
| 具体 config key/env/topic/URL/default/secret source | 后移到 `04-配置设计.md` 或后续配置文档。 |
| 旧 `MethodContent` / P0/P1 / snapshot / fingerprint / outbox relay / Gateway / PostgreSQL / object storage | 继续作为 historical pollution,不得作为当前 L3 实施承接来源。 |
| 直接修改正式 `03-详细设计.md` | 禁止;正式装配由 Step 19 或明确回填模块执行。 |
| 实现 agent 自行补 schema / port / DTO / state / mapper / config / evidence / phase | 禁止;发现缺口必须回 owning design Step。 |

### 8. R17.5 进入门禁

`R17.5 implementation handoff source matrix:先思考` 只允许思考:

1. Step 1~16 如何逐项映射到 implementation handoff source matrix。
2. 哪些承接项属于实施者可读取输入,哪些仍属于 04/05/06/07 下游职责。
3. source matrix 的列结构、source Step、handoff item、consumer、forbidden inference 和 blocker handling。
4. 不写最终实施计划、phase / commit boundary、代码文件清单、CI/evidence schema 或正式 `03-详细设计.md`。

### 9. R17.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 L1-governance Step 17 框架到 L3 的映射表 | pass |
| 是否写入 L3 承接关系候选 ASCII 图和说明 | pass |
| 是否写入下游边界表 | pass |
| 是否写入 07 审计输入族表 | pass |
| 是否写入 Step 1~16 source family 表 | pass |
| 是否写入禁入项表 | pass |
| 是否形成 R17.5 进入门禁 | pass |
| 是否未写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.5 implementation handoff source matrix:先思考`;只允许思考 Step 1~16 到 implementation handoff source matrix 的映射、source matrix 列结构、handoff item、consumer、forbidden inference 和 blocker handling;不得直接修改正式 `03-详细设计.md`;不得写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.5 implementation handoff source matrix:先思考

### 1. 当前模块目标

`R17.5` 只思考 Step 1~16 如何映射到 implementation handoff source matrix,并定义 source matrix 的列结构、handoff item 粒度、consumer 分类、forbidden inference 和 blocker handling。当前模块不写最终 source matrix 正文、不写最终实施承接清单、不写正式实施计划、不写 phase / commit boundary、不写代码文件清单、不写 evidence schema、不写 CI command、不写 acceptance gate、不写 implementation code,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.4` 推进到 `R17.5`。 |
| 当前允许 | 思考 source matrix 列结构、Step 1~16 映射、handoff item、consumer、forbidden inference、blocker handling 和 R17.6 写入计划。 |
| 当前禁止 | 写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate、implementation code、具体 config key/env/topic/URL 或正式 `03-详细设计.md`。 |

### 2. source matrix 列结构思考

R17.6 的 source matrix 不应复制 Step 1~16 的全部正文,而应提供 07 可审计的入口。列结构需要让 07 和后续实现 agent 能回答“从哪里读、承接什么、谁消费、不能推断什么、缺口怎么处理”。

| 候选列 | 用途 | 写入注意 |
|---|---|---|
| `source_step` | 指向 Step 1~16 的具体中间产物。 | 必须写文件名或 Step 名,不得只写“详细设计”。 |
| `source_family` | 标识 baseline / shape / contract / semantics / binding / verification。 | 使用 R17.4 已确认的 source family。 |
| `handoff_item` | 概括 07 / implementation 需要承接的输入。 | 只写承接主题,不复制字段表、DTO schema 或 flow 全文。 |
| `primary_consumer` | 标识主要下游消费者。 | 可为 `07`, `04`, `05`, `06`, Step 18, Step 19 或 implementation agent via 07。 |
| `implementation_use` | 描述实现者如何使用该输入。 | 只能写阅读 / 校验 / 约束用途,不得写任务拆分或代码文件。 |
| `forbidden_inference` | 明确实现侧不得自行推断的内容。 | 必须覆盖 schema、port、state、mapper、config、evidence、phase 等红线。 |
| `blocker_handling` | 缺口或冲突出现时的处理方式。 | 统一写回 owning Step / downstream doc / 07 gate,不得交给实现者自选。 |

### 3. Step 1~16 映射思考

| source Step | source family | handoff item 思考 | primary consumer 思考 |
|---|---|---|---|
| Step 1 输入边界 | baseline family | 正式 00/01/02 为唯一正向上游,旧 `03` 只作 historical material。 | Step 19 / 07 |
| Step 2 范围与非范围 | baseline family | 本轮实现范围、非范围和旧主线禁入。 | 07 / 05 / 06 |
| Step 3 runtime / 仓库约束 | implementation shape family | Rust、源码语言、提交规范、git config、sibling dependency 约束。 | 07 / implementation via 07 |
| Step 4 实现单元与文件布局 | implementation shape family | workspace、crate/package、binary、文件职责和依赖落点。 | 07 / implementation via 07 |
| Step 5 模块实现契约主轴 | implementation shape family | 七实现单元、模块职责、依赖方向和模块边界。 | 07 / implementation via 07 |
| Step 6 对象实现契约 | contract family | object/ref/marker/state owner/body-free shell/field source。 | 07 / implementation via 07 |
| Step 7 Trait / Port / Adapter | contract family | repository、UoW、resolver、publisher、handoff、runtime/fake/durable adapter seam。 | 07 / implementation via 07 |
| Step 8 Protocol contracts | contract family | Command / Query / Inbound / Outbound / Job public surface 和 shared shell。 | 07 / 05 / implementation via 07 |
| Step 9 Function flows | execution semantics family | 每个 public protocol 的函数级处理流、side effect 顺序和 no-write 分支。 | 07 / 05 / implementation via 07 |
| Step 10 State machine | execution semantics family | 状态主语、状态集合、合法 / 非法转换和状态名统一。 | 05 / 06 / 07 |
| Step 11 Persistence / transaction | execution semantics family | repository key、version、UoW、transaction boundary、stored surface、consistency rule。 | 07 / implementation via 07 |
| Step 12 Error / recovery | execution semantics family | safe error、retry、degraded、quarantine、dead-letter、manual intervention。 | 05 / 06 / 07 |
| Step 13 Concurrency / idempotency | execution semantics family | duplicate replay、commit unknown、race、checkpoint/reentry。 | 07 / implementation via 07 |
| Step 14 Config / dependency | runtime binding family | config boundary、adapter binding、external dependency availability。 | 04 / 07 |
| Step 15 Observability / audit | runtime binding family | structured log、metric label、trace correlation、audit refs-only、redaction。 | 06 / 07 |
| Step 16 Test cuts | verification family | 最小验证入口、source coverage、formal §15 source map、downstream handoff。 | 05 / 06 / 07 |

### 4. consumer 分类思考

| consumer | R17 matrix 中的定位 |
|---|---|
| Step 18 | 接收 R17 发现的未闭口风险、待确认项和 blocker watch。 |
| Step 19 | 接收 formal §16 source map 和可装配结论,装配正式 `03`。 |
| `04-配置设计.md` | 接收配置与依赖 handoff,负责具体 config key/env/profile/topic/URL/default/secret source。 |
| `05-测试方案.md` | 接收 Step 16 test cut intent 和 Step 8~13 的可测输入,负责 TC / fixture / evidence 设计。 |
| `06-验收标准.md` | 接收红线、状态、错误、观测、安全 surface 和验收候选,负责 acceptance gate。 |
| `07-实施计划.md` | 接收所有 implementation handoff source,负责 phase / commit boundary、required reads、allowed scope、checks 和 implementation ledger。 |
| implementation agent via 07 | 只能通过 07 的正式 boundary 开工,不得直接按 R17 中间产物改实现仓。 |

### 5. forbidden inference 思考

R17.6 每一行都应尽量写清实现侧不得推断什么。尤其要覆盖:

| 禁止推断类别 | 说明 |
|---|---|
| schema / public DTO | 不得由实现者补字段名、required、enum variant、marker shell 或 public result shape。 |
| port / mapper / adapter | 不得由实现者新增未闭口 repository method、mapper method、resolver output 或 private fake map。 |
| state / transition | 不得由实现者合并状态、改名状态、放宽非法转换或跳过 no-write state。 |
| persistence / transaction | 不得由实现者自选 key、index、version、stored replay surface 或 rollback boundary。 |
| config / dependency | 不得在实现侧发明 config key、default、env、topic、URL、secret source 或 external product binding。 |
| test / evidence | 不得由实现者发明 TC ID、fixture、run artifact schema、report path 或 evidence字段。 |
| phase / commit boundary | 不得由实现者自行决定当前 commit 覆盖后续 phase 才定义的对象、结果或证据。 |

### 6. blocker handling 思考

source matrix 的 blocker handling 应统一到可执行规则:

| blocker 类型 | 处理方式 |
|---|---|
| source Step 内部缺字段 / schema / state / mapper | 回 owning Step 修正文档,不得继续进入 07 或实现。 |
| 04/05/06/07 下游职责未生成 | 标记为 downstream pending,不得在 R17 代写。 |
| Step 17 发现 source 名称漂移 | 回对应 source Step 或 Step 19 装配前统一命名。 |
| implementation boundary 缺台账 | 由 07 / implementation ledger 机制处理,R17 只标记需求。 |
| 旧材料与当前 Step 冲突 | 当前 Step 1~16 优先;旧材料继续作为 historical pollution。 |
| 无法判断是否 blocker | 进入 Step 18 风险与待确认,不得交给实现者自行选择。 |

### 7. R17.6 写入计划思考

`R17.6 implementation handoff source matrix:再写入` 应把本模块思考落成可恢复记录:

1. 写 source matrix 列定义表。
2. 写 Step 1~16 implementation handoff source matrix。
3. 写 consumer 分类表。
4. 写 forbidden inference 总表。
5. 写 blocker handling 总表。
6. 写 `R17.7 implementation preread and agent gate:先思考` 进入门禁。
7. 不写正式实施计划、phase / commit boundary、代码文件清单、CI/evidence schema、正式 `03-详细设计.md`。

### 8. R17.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 implementation handoff source matrix | pass |
| 是否形成 source matrix 列结构思考 | pass |
| 是否覆盖 Step 1~16 映射思考 | pass |
| 是否形成 consumer 分类思考 | pass |
| 是否形成 forbidden inference 和 blocker handling 思考 | pass |
| 是否形成 R17.6 写入计划 | pass |
| 是否未写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.6 implementation handoff source matrix:再写入`;只允许写入 source matrix 列定义表、Step 1~16 implementation handoff source matrix、consumer 分类表、forbidden inference 总表、blocker handling 总表和 `R17.7 implementation preread and agent gate:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.6 implementation handoff source matrix:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.5` 推进到 `R17.6`。 |
| 本模块写入范围 | source matrix 列定义表、Step 1~16 implementation handoff source matrix、consumer 分类表、forbidden inference 总表、blocker handling 总表和 `R17.7` 进入门禁。 |
| 本模块禁止范围 | 最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate、implementation code、具体 config key/env/topic/URL 和正式 `03-详细设计.md`。 |

### 2. source matrix 列定义表

| 列 | 含义 | 写法约束 |
|---|---|---|
| `source_step` | 具体来源 Step / 中间产物。 | 必须可回指 Step 1~16,不得只写“详细设计”。 |
| `source_family` | 来源族。 | 使用 baseline / implementation shape / contract / execution semantics / runtime binding / verification。 |
| `handoff_item` | 交给 07 和下游文档承接的主题。 | 只写承接主题,不复制对象字段、DTO、flow 或状态矩阵全文。 |
| `primary_consumer` | 主要消费者。 | 可为 `04`、`05`、`06`、`07`、Step 18、Step 19 或 implementation via 07。 |
| `implementation_use` | 实现侧如何使用。 | 只写阅读、校验、约束和暂停条件,不得写任务拆分。 |
| `forbidden_inference` | 实现侧不得自行推断的内容。 | 必须显式防止补 schema / port / state / mapper / config / evidence / phase。 |
| `blocker_handling` | 缺口处理。 | 回 owning Step / downstream doc / 07 gate,不得交给实现者自选。 |

### 3. Step 1~16 implementation handoff source matrix

| source_step | source_family | handoff_item | primary_consumer | implementation_use | forbidden_inference | blocker_handling |
|---|---|---|---|---|---|---|
| Step 1 input boundary | baseline | 正式 `00/01/02` 为唯一正向上游,旧 `03` 只作 historical material。 | Step 19 / 07 | 07 用于确认实现输入基线和旧材料禁入。 | 不得从旧正式 `03` 或旧 Step completed 状态恢复对象、接口或流程。 | 输入冲突回 Step 1 或 Step 19 装配前修正。 |
| Step 2 scope | baseline | 本轮实现范围、非范围、禁止越界项和旧主线禁入。 | 07 / 05 / 06 | 07 用于限制 phase / commit boundary,05/06 用于测试和验收范围。 | 不得由实现者扩大范围或恢复旧 P0/P1。 | 范围冲突回 Step 2,不得进入实现。 |
| Step 3 runtime constraints | implementation shape | Rust、源码语言、提交规范、git config、sibling dependency 约束。 | 07 / implementation via 07 | 07 转成 required reads、repo gate 和提交门禁。 | 不得实现侧自行改语言、依赖策略或提交规范。 | 仓库/依赖不匹配由 07 gate 暂停并回 Step 3/4。 |
| Step 4 module layout | implementation shape | workspace、crate/package、binary、文件职责和依赖落点。 | 07 / implementation via 07 | 07 转成允许改动范围和文件布局门禁。 | 不得从旧 crate/module 或实现便利重划布局。 | 布局缺口回 Step 4 或 07,不得先落代码。 |
| Step 5 module contracts | implementation shape | 七实现单元、模块职责、依赖方向和模块边界。 | 07 / implementation via 07 | 07 用于组织 commit boundary 的模块范围。 | 不得反向依赖、合并模块职责或新增未定义实现单元。 | 模块边界冲突回 Step 5。 |
| Step 6 object contracts | contract | object/ref/marker/state owner/body-free shell/field source。 | 07 / implementation via 07 | 07 用于检查每个 boundary 的对象和字段可落码性。 | 不得实现侧补字段、marker、enum variant 或 public shell。 | 字段/source 缺口回 Step 6。 |
| Step 7 trait / port / adapter | contract | repository、UoW、resolver、publisher、handoff、runtime/fake/durable adapter seam。 | 07 / implementation via 07 | 07 用于检查 service / infra 接缝和 fake/durable parity。 | 不得私加 repository method、mapper method、resolver output 或 fake private map。 | port/mapper 缺口回 Step 7。 |
| Step 8 protocol contracts | contract | Command / Query / Inbound / Outbound / Job public surface 和 shared shell。 | 07 / 05 / implementation via 07 | 07/05 用于建立 protocol reading gate 和测试来源。 | 不得补 DTO 字段、response surface、event payload、job report schema 或 marker source。 | 协议闭口冲突回 Step 8。 |
| Step 9 function flows | execution semantics | public protocol 的函数级处理流、事务顺序、副作用顺序和 no-write 分支。 | 07 / 05 / implementation via 07 | 07 用于指定实现顺序和不得改写的 flow gate。 | 不得调整 UoW 顺序、duplicate replay、query no-write 或 post-commit side effect 语义。 | flow 与协议/对象冲突回 Step 9 或 owning Step。 |
| Step 10 state machine | execution semantics | 状态主语、状态集合、合法/非法转换和状态名统一。 | 05 / 06 / 07 | 05/06/07 统一引用正式状态名和非法转换口径。 | 不得改名状态、合并状态、放宽非法转换或跳过 state owner。 | 状态缺口回 Step 10。 |
| Step 11 persistence / transaction | execution semantics | repository key、version、UoW、transaction boundary、stored surface、consistency rule。 | 07 / implementation via 07 | 07 用于建立 persistence / transaction implementation gate。 | 不得实现侧自选 key、index、stored replay surface、rollback boundary 或 cross-store invariant。 | 持久化闭口缺口回 Step 11。 |
| Step 12 error / recovery | execution semantics | safe error、retry、degraded、quarantine、dead-letter、manual intervention。 | 05 / 06 / 07 | 05/06/07 用于错误验证、验收红线和实现暂停条件。 | 不得返回 raw exception、发明 public error code 或弱化 recovery surface。 | 错误口径冲突回 Step 12。 |
| Step 13 concurrency / idempotency | execution semantics | duplicate replay、commit unknown、race、checkpoint/reentry。 | 07 / implementation via 07 | 07 用于并发/幂等 required checks 和 implementation gate。 | 不得 duplicate 重跑业务或从 current truth 重建 stored result。 | 幂等或重入缺口回 Step 13。 |
| Step 14 config / dependency | runtime binding | config boundary、adapter binding、external dependency availability。 | 04 / 07 | 04 定义具体配置,07 检查配置依赖是否已正式闭口。 | 不得在 R17 或实现侧发明 key/env/default/topic/URL/secret source。 | 具体配置缺口交 04,实现前由 07 gate 检查。 |
| Step 15 observability / audit | runtime binding | structured log、metric label、trace correlation、audit refs-only、redaction。 | 06 / 07 | 06/07 用于验收红线、观测门禁和敏感信息检查。 | 不得发明 log schema、metric name、raw body audit、secret label 或 dashboard/alert。 | 观测/审计缺口回 Step 15 或下游验收文档。 |
| Step 16 test cuts | verification | 最小验证入口、source coverage、formal §15 source map、downstream handoff。 | 05 / 06 / 07 | 05/06/07 用于生成 TC、验收和 implementation checks。 | 不得在 R17 或实现侧发明 TC ID、fixture、evidence schema、CI command。 | 测试/evidence 缺口交 05/06/07,不可由实现侧补。 |

### 4. consumer 分类表

| consumer | 承接内容 | R17 边界 |
|---|---|---|
| Step 18 | 未闭口风险、待确认项、blocker watch。 | 只接收问题,不替代 owning Step 修正。 |
| Step 19 | formal §16 source map 和可装配结论。 | 只装配 confirmed source,不新增实现契约。 |
| `04-配置设计.md` | 配置与依赖 handoff。 | 负责具体 key/env/profile/topic/URL/default/secret source。 |
| `05-测试方案.md` | test cut intent、protocol/flow/state/error 可测输入。 | 负责 TC、fixture、suite、evidence artifact schema。 |
| `06-验收标准.md` | 验收红线、状态、错误、观测和安全 surface。 | 负责 acceptance gate、veto 和验收报告口径。 |
| `07-实施计划.md` | source matrix、前置阅读、closure pre-audit、暂停条件候选。 | 负责 phase / commit boundary、required reads、allowed scope、checks 和 implementation ledger。 |
| implementation via 07 | 只能按 07 当前 boundary 和台账开工。 | 不得直接按 R17 中间产物改实现仓。 |

### 5. forbidden inference 总表

| 禁止推断类别 | 禁止内容 | 处理口径 |
|---|---|---|
| schema / public DTO | 字段名、required、enum variant、marker shell、public result shape。 | 回 Step 6 / 8 闭口。 |
| port / mapper / adapter | repository method、mapper method、resolver output、private fake map。 | 回 Step 7 闭口。 |
| state / transition | 状态改名、状态合并、非法转换放宽、no-write state 跳过。 | 回 Step 10 闭口。 |
| persistence / transaction | key、index、version、stored replay surface、rollback boundary。 | 回 Step 11 闭口。 |
| config / dependency | config key、default、env、topic、URL、secret source、external product binding。 | 交 04 并由 07 gate 检查。 |
| test / evidence | TC ID、fixture、run artifact schema、report path、evidence 字段。 | 交 05/06/07。 |
| phase / commit boundary | 当前 commit 覆盖后续 phase 对象、结果或证据。 | 由 07 定义并审计。 |

### 6. blocker handling 总表

| blocker 类型 | 处理方式 | 是否可交给实现者 |
|---|---|---|
| source Step 内部缺字段 / schema / state / mapper | 回 owning Step 修正文档。 | no |
| 04/05/06/07 下游职责未生成 | 标记 downstream pending,等待对应文档闭口。 | no |
| source 名称漂移 | 回对应 source Step 或 Step 19 装配前统一命名。 | no |
| implementation boundary 缺台账 | 由 07 / implementation ledger 机制处理,R17 只标记需求。 | no |
| 旧材料与当前 Step 冲突 | 当前 Step 1~16 优先,旧材料继续作为 historical pollution。 | no |
| 无法判断是否 blocker | 进入 Step 18 风险与待确认。 | no |

### 7. R17.7 进入门禁

`R17.7 implementation preread and agent gate:先思考` 只允许思考:

1. implementation agent 开工前必须阅读哪些正式文档、中间产物和规范。
2. 提交规范、git config、Rust 编码规范、目录组织、可落码性标准和代码实施台账如何进入前置阅读。
3. 哪些 gate 属于 07 / implementation ledger,哪些只由 Step 17 提供输入。
4. 不写最终实施计划、phase / commit boundary、代码文件清单、CI/evidence schema 或正式 `03-详细设计.md`。

### 8. R17.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 source matrix 列定义表 | pass |
| 是否写入 Step 1~16 implementation handoff source matrix | pass |
| 是否写入 consumer 分类表 | pass |
| 是否写入 forbidden inference 总表 | pass |
| 是否写入 blocker handling 总表 | pass |
| 是否形成 R17.7 进入门禁 | pass |
| 是否未写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.7 implementation preread and agent gate:先思考`;只允许思考 implementation agent 开工前置阅读、提交规范、git config、Rust 编码规范、目录组织、可落码性标准、代码实施台账和 gate 归属;不得直接修改正式 `03-详细设计.md`;不得写最终实施承接清单、正式实施计划、phase / commit boundary、代码文件清单、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.7 implementation preread and agent gate:先思考

### 1. 当前模块目标

`R17.7` 只思考 implementation agent 开工前置阅读、提交规范、git config、Rust 编码规范、目录组织、可落码性标准、代码实施台账和 gate 归属。当前模块不写最终前置阅读清单、不写 07 的正式 `required_reads`、不写 phase / commit boundary、不写 allowed_scope / forbidden_scope、不写 required_checks、不创建 implementation ledger、不写代码文件清单、不写 evidence schema、不写 CI command、不写 acceptance gate,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.6` 推进到 `R17.7`。 |
| 当前允许 | 思考 preread 分组、agent gate 分类、gate 归属、07 handoff 和 R17.8 写入计划。 |
| 当前禁止 | 写 07 正式 required_reads、phase / commit boundary、allowed_scope、required_checks、Commit Gate、Handoff Gate、implementation ledger、CI/evidence schema、implementation code 或正式 `03-详细设计.md`。 |

### 2. 前置阅读分组思考

Step 17 可以提出实施前置阅读候选,但正式开工门禁必须由 `07-实施计划.md` 按 phase / commit boundary 固化。R17.8 的阅读表应按“阅读目的”分组,而不是只列文件名。

| preread group | 候选文档 | 阅读目的 |
|---|---|---|
| upstream baseline | `00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md` | 确认范围、边界、依赖方向和概要实现主轴。 |
| detailed design source | Step 1~17 中间产物;Step 19 后正式 `03-详细设计.md` | 追溯对象、port、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cut 来源。 |
| downstream docs | 后续 `04/05/06/07` | 获取具体配置、测试方案、验收标准和实施计划边界。 |
| implementation planning standards | `实施计划书写规范.md`;`实施计划讨论流程_SOP.md` | 让 07 正式定义 phase / commit boundary、required_reads、allowed_scope、checks、commit discipline。 |
| code ledger standards | `代码实施台账与门禁规范.md`;`设计真相源闭环与可落码性标准.md` | 确认 implementation ledger、Design Gate、Scope Gate、Commit Gate、Handoff Gate 和 blocker 回流。 |
| repo / coding standards | Rust 编码规范、目录组织规范、项目 README / 提交规范 | 确认源码语言、注释、测试命名、仓库布局、git config 和提交格式。 |

### 3. gate 归属思考

R17 不应把候选 gate 写成正式实现 gate。需要明确三层归属:

| gate 层级 | 负责文档 | R17 可做什么 | R17 不做什么 |
|---|---|---|---|
| handoff input gate | Step 17 | 提供 preread 候选、source matrix、forbidden inference、blocker handling。 | 不定义 phase / commit boundary。 |
| implementation planning gate | `07-实施计划.md` | 由 07 将 R17 输入转成 per-boundary required_reads、allowed_scope、forbidden_scope、required_checks。 | R17 不替 07 写正式边界。 |
| execution ledger gate | implementation ledger / boundary ledger | 实现 agent 开工前读取当前 boundary 台账并按 gate_status / next_allowed_action 推进。 | R17 不创建 implementation_execution_ledger 或 boundary ledger。 |

### 4. agent gate 分类思考

implementation agent 的开工 gate 应该至少覆盖以下候选类别,但正式字段和值必须在 07 和 implementation ledger 中落地:

| gate category | 检查目标 | R17 口径 |
|---|---|---|
| Design Gate | 当前 design baseline、正式 03/05/06/07、source matrix 和 unresolved blocker 是否一致。 | R17 只提供候选输入。 |
| Scope Gate | 当前 boundary 允许和禁止修改的 crate/module/tests/docs 是否明确。 | 由 07 定义 allowed_scope / forbidden_scope。 |
| Source Closure Gate | 当前 boundary 涉及字段、DTO、state、port、mapper、config、evidence 是否已闭口。 | R17 提供 forbidden inference 和 blocker handling。 |
| Worktree Gate | 实现仓 dirty state、用户改动、未跟踪项处理口径。 | 由 implementation ledger 记录。 |
| Build/Test Gate | required checks、命令、报告、失败处理。 | 由 05/06/07 定义,R17 不写具体命令。 |
| Commit Gate | staged scope、commit message、whitespace、required checks、证据引用。 | 由 07 / 代码实施台账规范定义。 |
| Handoff Gate | commit hash、evidence、下一 boundary、blocker / lesson 回写。 | 由 implementation ledger 和 07 定义。 |

### 5. 提交与 git config 思考

R17.8 可以记录实施前必须阅读提交规范和检查 git config,但不应替目标实现仓执行命令或指定当前仓状态。候选要求:

| 项 | 候选要求 | 正式归属 |
|---|---|---|
| git user.name | `quantalithos-labs` | 07 / implementation ledger 开工 gate。 |
| git user.email | `quantalithos.ai@gmail.com` | 07 / implementation ledger 开工 gate。 |
| commit language | design 仓与实现仓语言边界按项目规范和 07 说明执行。 | 07 提交纪律。 |
| commit grain | 一笔提交对应一个正式 commit boundary;同一 boundary 内多子功能在 body 分组。 | 07 commit boundary。 |
| commit message | type/scope/subject/body/footer 按项目提交规范。 | 07 / Commit Gate。 |

### 6. 代码实施台账思考

代码实施台账不是普通 checklist。R17.8 应提醒 07 必须为 L3-method-library 后续实现提供:

| 台账项 | 需要 07 / implementation ledger 正式给出 |
|---|---|
| project-level implementation ledger path | `projects/<project>/design-calibration/implementation_execution_ledger.md` 或正式项目路径。 |
| boundary ledger path | `projects/<project>/design-calibration/implementation-boundaries/<boundary_id>.md`。 |
| current design baseline | 当前实现所依据的设计提交 / baseline。 |
| current boundary | 当前 phase / commit boundary ID。 |
| required_reads | 当前 boundary 必读正式章节和 calibration source。 |
| allowed_scope / forbidden_scope | 允许和禁止改动范围。 |
| required_checks | 当前 boundary 必跑检查和报告要求。 |
| Commit Gate / Handoff Gate | 提交前后必须记录的范围、检查、commit hash、evidence、next action。 |

### 7. R17.8 写入计划思考

`R17.8 implementation preread and agent gate:再写入` 应把本模块思考落成可恢复记录:

1. 写 implementation preread candidate table。
2. 写 gate ownership table。
3. 写 implementation agent start gate candidate table。
4. 写 commit / git config candidate table。
5. 写 code implementation ledger handoff table。
6. 写 `R17.9 cross-document closure pre-audit:先思考` 进入门禁。
7. 不写 07 正式 required_reads、phase / commit boundary、allowed_scope、required_checks、implementation ledger 或正式 `03-详细设计.md`。

### 8. R17.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 implementation preread and agent gate | pass |
| 是否形成前置阅读分组思考 | pass |
| 是否形成 gate 归属和 agent gate 分类思考 | pass |
| 是否形成提交 / git config 思考 | pass |
| 是否形成代码实施台账 handoff 思考 | pass |
| 是否形成 R17.8 写入计划 | pass |
| 是否未写 07 正式 required_reads、phase / commit boundary、allowed_scope、required_checks、implementation ledger、CI/evidence schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.8 implementation preread and agent gate:再写入`;只允许写入 implementation preread candidate table、gate ownership table、implementation agent start gate candidate table、commit / git config candidate table、code implementation ledger handoff table 和 `R17.9 cross-document closure pre-audit:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.8 implementation preread and agent gate:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.7` 推进到 `R17.8`。 |
| 本模块写入范围 | implementation preread candidate table、gate ownership table、implementation agent start gate candidate table、commit / git config candidate table、code implementation ledger handoff table 和 `R17.9` 进入门禁。 |
| 本模块禁止范围 | 最终实施承接清单、正式 `07` required_reads、phase / commit boundary、allowed_scope、forbidden_scope、required_checks、Commit Gate、Handoff Gate、implementation ledger、CI/evidence schema、implementation code 和正式 `03-详细设计.md`。 |

### 2. implementation preread candidate table

| preread group | candidate source | implementation use | formal owner | R17 warning |
|---|---|---|---|---|
| upstream baseline | `00-需求文档.md`;`01-架构设计.md`;`02-概要设计.md` | 确认仓定位、业务范围、架构边界、依赖方向和概要实现主轴。 | `07` 转成 boundary required reads。 | 不得跳过正式上游而直接按旧 `03` 或旧 Step 文件实现。 |
| detailed design source | Step 1~17 中间产物;Step 19 后正式 `03-详细设计.md` | 追溯对象、port、protocol、flow、state、persistence、error、idempotency、config、observability、test cut 和 handoff 来源。 | Step 19 / `07`。 | 实现 agent 只能读取正式 boundary 指定来源,不得自行挑选未确认草稿。 |
| downstream config/test/acceptance | 后续 `04-配置设计.md`;`05-测试方案.md`;`06-验收标准.md` | 获取具体配置、TC、fixture、evidence、验收红线和发布前 gate。 | `04/05/06`。 | R17 不产生具体 config key、TC ID、evidence schema 或 acceptance gate。 |
| implementation plan | `07-实施计划.md`;`实施计划书写规范.md`;`实施计划讨论流程_SOP.md` | 确认 phase / commit boundary、required_reads、allowed_scope、forbidden_scope、checks 和提交节奏。 | `07`。 | Step 17 候选表不得被实现 agent 当作正式 boundary。 |
| closure and ledger standards | `设计真相源闭环与可落码性标准.md`;`代码实施台账与门禁规范.md` | 确认缺 schema / port / DTO / state / mapper / config / evidence / phase 时必须暂停回设计。 | `07` / implementation ledger。 | 不得在实现仓自行补口或以 fake-only 私有映射绕过。 |
| repo and coding standards | Rust 编码规范、提交规范、子项目目录与代码文件组织规范、目标仓 README / workspace 约定 | 确认源码语言、模块布局、注释、测试命名、git config 和 commit message。 | `07` / target repo gate。 | R17 不执行目标仓命令,不声明目标仓当前状态。 |

### 3. gate ownership table

| gate | owner | R17 candidate input | not owned by R17 |
|---|---|---|---|
| Handoff Input Gate | Step 17 | source matrix、preread candidate、forbidden inference、blocker handling、cross-document pre-audit 输入。 | 不定义正式 boundary、checks、commit hash 或 evidence。 |
| Formal Assembly Gate | Step 19 | 将已确认 Step 1~18 source 装配进正式 `03-详细设计.md`。 | R17 不直接写正式 `03`。 |
| Config Gate | `04-配置设计.md` | 接收 Step 14 和 R17 handoff 的配置影响。 | R17 不写 key/env/default/topic/URL/secret source。 |
| Test Evidence Gate | `05-测试方案.md` | 接收 Step 16 和 Step 8~13 的测试切口输入。 | R17 不写 TC ID、fixture、run artifact schema 或报告路径。 |
| Acceptance Gate | `06-验收标准.md` | 接收红线、状态、错误、观测、安全和测试切口输入。 | R17 不写正式验收 gate。 |
| Implementation Planning Gate | `07-实施计划.md` | 接收 R17 source matrix、preread candidate、pre-audit、禁入项和 blocker watch。 | R17 不写 phase / commit boundary、allowed_scope、required_checks。 |
| Execution Ledger Gate | implementation ledger / boundary ledger | 接收 07 的正式 boundary 并记录实际执行、提交、证据、handoff 和经验。 | R17 不创建或推进 implementation_execution_ledger。 |

### 4. implementation agent start gate candidate table

| candidate gate | should verify before implementation | required response on failure | formalization owner |
|---|---|---|---|
| Design Baseline Gate | 当前 design baseline、正式 `03/04/05/06/07`、当前 boundary ledger 和 required source 是否一致。 | 暂停,回设计仓更新正式 baseline 或 boundary。 | `07` / implementation ledger。 |
| Source Closure Gate | 当前 boundary 涉及的 field、DTO、event、job、state、port、mapper、config、evidence、phase 是否有正式来源。 | 暂停,回 owning Step 或下游文档闭口。 | `03/04/05/06/07`。 |
| Scope Gate | allowed_scope / forbidden_scope 是否覆盖 crate/module/test/doc 路径和不可触碰项。 | 不开工,要求 07 补 boundary。 | `07`。 |
| Worktree Gate | 目标实现仓 dirty state、用户改动、未跟踪项和可忽略项是否记录。 | 不覆盖用户改动;必要时暂停交回。 | implementation ledger。 |
| Build/Test Gate | 当前 boundary 的 required checks、失败处理、报告归档和证据来源是否明确。 | 不自行替换 checks 或伪造 evidence。 | `05/06/07`。 |
| Commit Gate | staged scope、commit message、git config、whitespace、检查结果和 evidence 引用是否满足 boundary。 | 不提交;补齐检查或回 07。 | `07` / implementation ledger。 |
| Handoff Gate | commit hash、run evidence、blocker、经验、下一 boundary 和 next_allowed_action 是否回写。 | 不进入下一 boundary。 | implementation ledger / design handoff。 |

### 5. commit / git config candidate table

| item | candidate requirement | handoff target | R17 limit |
|---|---|---|---|
| `git user.name` | 目标仓开工前确认 `quantalithos-labs`。 | implementation ledger Worktree / Commit Gate。 | R17 不读取或修改目标实现仓 config。 |
| `git user.email` | 目标仓开工前确认 `quantalithos.ai@gmail.com`。 | implementation ledger Worktree / Commit Gate。 | R17 不替目标仓执行 `git config`。 |
| commit grain | 一笔提交必须对应一个正式 boundary 或 07 允许的 boundary 子提交。 | `07` commit boundary。 | R17 不拆分 commit boundary。 |
| commit message | 使用项目提交规范的 type/scope/subject/body/footer,body 说明 source、checks 和 evidence。 | `07` / Commit Gate。 | R17 不写具体提交正文。 |
| staged scope | 只 stage allowed_scope 内文件,不得混入用户改动或后续 boundary 文件。 | Commit Gate。 | R17 不定义 allowed_scope。 |
| post-commit handoff | 记录 commit hash、checks、evidence、blocker/lesson 和下一动作。 | Handoff Gate / implementation ledger。 | R17 只提示必须记录,不生成台账实例。 |

### 6. code implementation ledger handoff table

| ledger concern | must be provided later | consuming agent behavior | R17 status |
|---|---|---|---|
| project-level ledger path | `projects/<project>/design-calibration/implementation_execution_ledger.md` 或正式等价路径。 | 每次恢复先读项目级 implementation ledger。 | candidate only。 |
| boundary ledger path | `projects/<project>/design-calibration/implementation-boundaries/<boundary_id>.md` 或正式等价路径。 | 未找到当前 boundary ledger 时不得改代码。 | candidate only。 |
| current design baseline | 设计提交 / baseline、正式文档版本和 source references。 | baseline 不匹配时暂停。 | candidate only。 |
| current boundary | phase / commit boundary ID、allowed_scope、forbidden_scope、required_checks。 | 只实现当前 boundary。 | candidate only。 |
| gate status | Design Gate、Scope Gate、Build/Test Gate、Commit Gate、Handoff Gate 状态。 | 只按 `next_allowed_action` 推进。 | candidate only。 |
| evidence/report linkage | 由 05/06/07 定义的 report path、artifact schema 和 run summary。 | 不自行发明 evidence 字段。 | candidate only。 |
| blocker and lesson backflow | 记录 blocker、设计闭口位置、经验文档或项目台账回写。 | 完成后总结经验并交回设计侧。 | candidate only。 |

### 7. R17.9 进入门禁

`R17.9 cross-document closure pre-audit:先思考` 只允许思考:

1. 字段 / marker / ref / state owner 是否能从 Step 6/10/11 回指正式来源。
2. DTO / Event / Job / Query surface 是否能从 Step 8/9/12/13 形成构造闭环。
3. Query visible / empty / degraded / unavailable / stale / no-write surface 是否有正式 marker 和 resolver 来源。
4. persistence / transaction / replay / recovery / idempotency 是否存在跨 Step 名称漂移。
5. Step 16 test cut、05/06/07 downstream handoff 和 phase boundary 输入是否足够。
6. 旧 `MethodContent`、P0/P1、snapshot、fingerprint、outbox relay、Gateway、PostgreSQL、object storage 等是否仍有残留风险。
7. 不写最终 pre-audit 结论表、不修改正式 `03-详细设计.md`、不写实施计划、代码、CI 或 evidence schema。

### 8. R17.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 implementation preread candidate table | pass |
| 是否写入 gate ownership table | pass |
| 是否写入 implementation agent start gate candidate table | pass |
| 是否写入 commit / git config candidate table | pass |
| 是否写入 code implementation ledger handoff table | pass |
| 是否形成 R17.9 进入门禁 | pass |
| 是否未写 07 正式 required_reads、phase / commit boundary、allowed_scope、required_checks、implementation ledger、CI/evidence schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.9 cross-document closure pre-audit:先思考`;只允许思考字段 / marker / ref / state owner、DTO / Event / Job / Query surface、visible / empty / degraded / unavailable / stale / no-write surface、persistence / transaction / replay / recovery / idempotency、Step 16 test cut、05/06/07 downstream handoff、phase boundary 输入和旧材料残留风险;不得直接修改正式 `03-详细设计.md`;不得写最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.9 cross-document closure pre-audit:先思考

### 1. 当前模块目标

`R17.9` 只思考 Step 17 的跨文档闭环预复核轴,为 `R17.10` 写入候选预审表做准备。当前模块不写最终 pre-audit 结论表、不判定正式 `03/04/05/06/07` 已可移交实现、不写 phase / commit boundary、不写 allowed_scope / required_checks、不创建 implementation ledger、不写 evidence schema、CI command、acceptance gate 或 implementation code,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.8` 推进到 `R17.9`。 |
| 当前允许 | 思考字段 / marker / ref / state owner、protocol surface、query marker、persistence / replay / recovery、test cut / downstream handoff、phase boundary 输入和旧材料残留风险的预复核维度。 |
| 当前禁止 | 写最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate、implementation code 或正式 `03-详细设计.md`。 |

### 2. L1-governance 框架参考思考

L1-governance Step 17 的跨文档复核写法可以借鉴其“真相源表 -> 字段闭环 -> DTO/Event/Job 构造闭环 -> Query response 闭环 -> 状态闭环 -> phase boundary 预复核 -> 命名一致性 -> 冲突修正”的组织方式。L3-method-library 需要保留这种深度,但不能复制 governance 的对象、query、event、job 或测试语义。

| L1 框架点 | L3 转译方式 | R17.9 边界 |
|---|---|---|
| 真相源表 | 回指 L3 Step 1~16 source family 和 R17.6 source matrix。 | 只思考复核来源,不写最终真相源判定。 |
| 字段闭环表 | 聚焦 `MethodAsset*` typed ref、marker、decision、diagnostic、cursor、boundary/scope、entry result kind。 | 只定义复核问题,不新增字段。 |
| DTO / Event / Job 构造闭环表 | 聚焦 Command、Query、Inbound、Outbound、Operations Job 的 public shell 到 object/port/flow 的构造链。 | 不写具体 DTO 字段 schema。 |
| Query response 闭环表 | 聚焦 visible / empty / not-visible / stale / degraded / unavailable / failed / no-write surface。 | 不生成 query case 或 public response schema。 |
| 状态闭环表 | 聚焦 domain truth、policy/guard、read/projection、external reference、application technical、infra/runtime、entry local state owner。 | 不重写 Step 10 状态矩阵。 |
| phase boundary 预复核 | 提醒 `07` 每个 boundary 必须重做正式审计。 | R17 不定义 phase / commit boundary。 |
| 命名一致性与冲突表 | 标记旧 MethodContent / P0/P1 / snapshot / fingerprint / outbox relay 等残留风险。 | 不在 R17.9 做 Step 19 正式装配。 |

### 3. 真相源族预复核思考

R17.10 应先把复核对象绑定到 source family,否则容易变成实现者自由发挥的 checklist。

| source family | owning Steps | pre-audit focus | failure handling |
|---|---|---|---|
| baseline | Step 1~3 | 上游输入、范围、runtime、仓库语言、旧材料禁入是否仍一致。 | 回 owning Step 或 Step 19,不得让 07 或实现者自行取舍。 |
| implementation shape | Step 4~5 | 七实现单元、crate/package/file responsibility、依赖方向是否能被 07 承接。 | 回 Step 4/5 或 07 gate。 |
| object / contract | Step 6~8 | object field source、port / mapper / resolver、public protocol shell 是否互相闭合。 | 缺字段 / port / DTO / marker 时回 Step 6/7/8。 |
| execution semantics | Step 9~13 | function flow、state、persistence、error/recovery、idempotency/replay 是否同名同义。 | 回对应 owning Step,不得实现侧补 sequence 或 stored surface。 |
| runtime binding | Step 14~15 | config/dependency、availability、diagnostic、observability/audit 是否只用 safe refs。 | 具体配置交 04;观测/验收交 06/07。 |
| verification | Step 16 | test cut 是否覆盖对象、protocol、flow、state、consistency、error/config/observability 的最小入口。 | 具体 TC/evidence 后移 05/06/07。 |

### 4. 字段 / marker / ref / state owner 预复核思考

字段闭环预复核不能只问“有没有名字”,还要问“实现时是否能在合法时机取得”。尤其是 Step 6 已经给出 high-reuse field family 和暂停条件,R17.10 应把这些暂停条件转成 07 的审计输入。

| audit axis | source to compare | question to ask in R17.10 | likely blocker if broken |
|---|---|---|---|
| typed ref source | Step 6 object cards;Step 7 repository/resolver;Step 11 key/version | 每个 `*_ref` 是否来自 id generator、repository load、formal previous output 或 port summary。 | 只能从 raw string、route、topic、cron、文件名、hash 拼接或 private map 推导。 |
| marker source | Step 6 marker fields;Step 7 mapper/resolver;Step 8 public marker;Step 12 degraded/error mapping | stale/degraded/unavailable/visibility/public marker 是否只能复制正式 mapper / resolver / availability 输出。 | flow 需要现场合成 marker 或复用无关 marker。 |
| decision owner | Step 6 policy/application decision;Step 9 flow call site;Step 12 rejection/degraded | decision 是 domain policy / application helper 输出,还是 entry/infra 本地结果。 | API/worker/job entry 自行产生 business decision。 |
| state owner | Step 6 state owner;Step 10 state matrix;Step 9 transition owner | 状态主语和迁移 owner 是否一致。 | entry result、adapter availability、scheduler status 被当作 domain lifecycle。 |
| diagnostic boundary | Step 12 safe diagnostic;Step 15 redaction/audit | safe reason 是否 body-free、redacted、low-cardinality。 | raw exception、provider body、payload excerpt、secret、SQL error 进入 public / audit surface。 |
| cursor/checkpoint | Step 11 persistence;Step 13 replay/reentry;Step 16 test cuts | cursor/checkpoint 是否有 durable source 和 replay semantics。 | 用 queue offset、timestamp、file path、cron tick 或 private scan 替代。 |

### 5. Protocol surface 构造闭环思考

Step 8 只定义 protocol family / public shell,Step 9 才定义处理流,Step 11~13 才闭合 stored surface、error 和 replay。R17.10 需要复核这些职责没有互相替代。

| protocol family | compare Steps | closure question | forbidden shortcut |
|---|---|---|---|
| Command | Step 6 object;Step 7 service/port;Step 8 command shell;Step 9 command flow;Step 13 stored result replay | accepted / rejected / duplicate replay 是否都能回到正式 result / rejection / effect / stored surface。 | 通过重读 current truth 重建 duplicate result,或实现侧发明 public result DTO。 |
| Query | Step 6 read/degraded decision;Step 7 read ports;Step 8 query response/page shell;Step 9 query no-write flow | query response / page / marker 是否都来自 repository、projection/read material、resolver summary 或 degraded mapper。 | query 写 truth、刷新 projection、合成 marker、用 ordinary error 替代 not visible。 |
| Inbound | Step 6 intake decision;Step 7 source/resolver/store;Step 8 inbound shell;Step 9 consumer flow;Step 13 dedup | body-free intake、duplicate、unsupported、delayed、quarantine、dead-letter 是否有正式路径。 | 保存 source raw body,用 broker ack/offset 作为业务结果。 |
| Outbound | Step 6 event candidate assembly;Step 7 publisher/handoff;Step 8 outbound shell;Step 9 publisher flow;Step 11 stored payload/report | event candidate、publication outcome、blocked/degraded/unavailable 是否可从 stored snapshot / publisher summary 复制。 | 用 topic、routing key、delivery receipt 或 raw payload 当 truth source。 |
| Operations Job | Step 6 job context/result;Step 7 job ports;Step 8 job shell/report;Step 9 job flow;Step 11 checkpoint/progress;Step 13 replay | job result、progress、checkpoint、partial failure、stored report replay 是否闭合。 | 用 scheduler status、cron name、queue lease、process exit code 或 report body 反推。 |

### 6. Query surface marker 预复核思考

Query 是实施中最容易越界的区域,因为它既要 no-write,又要返回 public marker。R17.10 应单独写 query surface 预复核候选表。

| surface branch | source to check | R17.10 question | stop condition |
|---|---|---|---|
| visible | Step 7 read repository/resolver;Step 8 response shell;Step 9 query flow | view / material / summary 是否给出 response 所需 typed refs 和 visibility/freshness marker。 | response 字段只能从 route param、existing view guess 或 string 拼接得到。 |
| empty | Step 8 empty/page shell;Step 9 list query flow | empty page 是否仍有正式 page metadata、visibility or safe empty reason 来源。 | 空页没有合法 visibility_result / marker source。 |
| not visible | Step 7 visibility/read decision;Step 8 not-visible shell;Step 12 safe rejection/degraded | not-visible 是否走 marker surface 而不是 ordinary error。 | service 根据权限失败自行返回普通错误码。 |
| stale | Step 6 freshness/projection fields;Step 8 stale shell;Step 11 projection/material state | freshness marker 是否来自 material/projection builder 或 loaded state。 | 从 view ref、timestamp 或 current truth 反推 freshness。 |
| degraded / unavailable | Step 6 degraded decision;Step 7 mapper/availability;Step 8 degraded/unavailable shell;Step 12 recovery | degraded_kind、degraded_marker、availability marker 是否有正式 mapper/source。 | service 合成 synthetic marker 或复制无关 resolver marker。 |
| no-write | Step 9 query flow;Step 11 transaction;Step 15 observability;Step 16 query cuts | query 是否禁止 reserve id、append trace/outbox、refresh reference、repair projection。 | query 分支为了补 response 字段而写入任何 truth/material。 |

### 7. Persistence / transaction / replay / recovery 预复核思考

实现前最容易出现的隐藏断裂不是字段名,而是 flow 顺序、stored replay source 和 rollback boundary。R17.10 应把这些纳入同一张预审表。

| audit axis | compare Steps | question | forbidden shortcut |
|---|---|---|---|
| repository key / version | Step 7 repository;Step 11 persistence | save/load key、optimistic version、unique index、logical owner 是否一致。 | 实现侧自选 key、scan store、private secondary map。 |
| UoW boundary | Step 9 flow;Step 11 transaction;Step 12 rollback | accepted write、trace/report/outbox/stored result 是否在明确 UoW 顺序内。 | post-commit side effect 回写 truth 或 rollback 后仍发布 event。 |
| stored operation result | Step 6 stored result object;Step 8 response shell;Step 11 stored surface;Step 13 duplicate replay | duplicate accepted/rejected 是否能从 stored surface 还原。 | duplicate 重跑业务或从 current truth 重建 response。 |
| error / recovery | Step 12 recovery;Step 15 diagnostic;Step 16 error cuts | safe rejection、degraded、manual intervention、dead-letter、quarantine 是否有 public/safe surface。 | raw exception、adapter body 或 secret 进入 response/report/audit。 |
| idempotency / reentry | Step 13 guard;Step 9 flow;Step 11 checkpoint | in-flight、same/different digest、commit unknown、job resume 是否可重复执行或安全暂停。 | 忽略 digest,用 retry 次数或 scheduler lease 作为业务幂等。 |

### 8. Step 16 / downstream / phase boundary 预复核思考

R17.10 应确认 Step 17 给下游的是输入,不是最终结论。尤其 phase boundary 和 evidence schema 必须留给 `05/06/07`。

| downstream target | pre-audit question | R17.9 decision |
|---|---|---|
| `04-配置设计.md` | Step 14 的 config/dependency redline 是否足够让 04 定义 key/env/profile/topic/URL/default/secret source。 | 只标记 handoff,不写具体配置。 |
| `05-测试方案.md` | Step 16 的 test cut 是否覆盖 Step 5~15 source,但不等同 TC ID / fixture / evidence schema。 | 只标记 05 需要生成测试矩阵。 |
| `06-验收标准.md` | no raw body、no secret、query no-write、duplicate no-rerun、no synthetic marker 等红线是否能转验收。 | 只标记验收输入,不写 acceptance gate。 |
| `07-实施计划.md` | 是否具备让 07 逐 boundary 做 Design Gate / Scope Gate / Checks / Commit Gate / Handoff Gate 的输入。 | 只标记 07 必须重做正式审计。 |
| Step 18 | 如果 R17.10 发现 unresolved gap,是否进入风险与待确认事项。 | 只定义回流规则,不替 Step 18 写风险正文。 |
| Step 19 | 是否有足够 source map 装配正式 `03` §16。 | 只准备候选 source map,不改正式 `03`。 |

### 9. 旧材料残留与命名漂移思考

R17.10 应单独复核旧材料残留,否则旧 Step 17 的实现承接口径可能在后续 07 中复活。

| risk signal | likely residue | R17.10 handling thought |
|---|---|---|
| `MethodContent` / publish / retire / supersede | 旧方法内容发布主线。 | 标记 historical pollution,不得作为当前 object / protocol / flow source。 |
| P0 / P1 | 旧 phase 范围和任务优先级。 | 禁止带入 07 boundary;当前范围以 Step 2/5/8/9/16 为准。 |
| snapshot / fingerprint | 旧 material and verification 主线。 | 只有当前 Step 6~15 重新闭口的 marker/material 才可使用。 |
| outbox relay / delivery receipt | 旧 outbox / transport 主线。 | 当前 outbound/handoff 只能按 Step 8/9/11/13/15 body-free shell 和 safe outcome。 |
| Gateway / PostgreSQL / object storage / scheduler product | 旧具体技术绑定。 | 具体产品绑定后移 04/07;当前 Step 17 不能恢复。 |
| old crate/module/path | 旧实现仓布局。 | 当前布局只以 Step 4/5 七实现单元为准。 |

### 10. R17.10 写入计划思考

`R17.10 cross-document closure pre-audit:再写入` 应把本模块思考落成候选预审记录,但仍不得写最终 implementation plan:

1. 写 truth source family pre-audit candidate table。
2. 写 field / marker / ref / state owner pre-audit candidate table。
3. 写 protocol surface construction pre-audit candidate table。
4. 写 Query surface marker / no-write pre-audit candidate table。
5. 写 persistence / transaction / replay / recovery / idempotency pre-audit candidate table。
6. 写 Step 16 / downstream / phase boundary handoff pre-audit candidate table。
7. 写 historical residue / naming drift candidate table。
8. 写 `R17.11 not-entering-implementation and downstream handoff:先思考` 进入门禁。
9. 不写正式 `03-详细设计.md`、正式实施计划、phase / commit boundary、implementation ledger、CI/evidence schema 或 implementation code。

### 11. R17.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 cross-document closure pre-audit | pass |
| 是否参考 L1-governance 框架但未复制 governance 领域语义 | pass |
| 是否形成字段 / marker / ref / state owner 预复核轴 | pass |
| 是否形成 protocol surface 和 Query marker 预复核轴 | pass |
| 是否形成 persistence / replay / recovery / idempotency 预复核轴 | pass |
| 是否形成 Step 16 / downstream / phase boundary 预复核思考 | pass |
| 是否形成旧材料残留与命名漂移思考 | pass |
| 是否形成 R17.10 写入计划 | pass |
| 是否未写最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、CI/evidence schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.10 cross-document closure pre-audit:再写入`;只允许写入 truth source family pre-audit candidate table、field / marker / ref / state owner pre-audit candidate table、protocol surface construction pre-audit candidate table、Query surface marker / no-write pre-audit candidate table、persistence / transaction / replay / recovery / idempotency pre-audit candidate table、Step 16 / downstream / phase boundary handoff pre-audit candidate table、historical residue / naming drift candidate table 和 `R17.11 not-entering-implementation and downstream handoff:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.10 cross-document closure pre-audit:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.9` 推进到 `R17.10`。 |
| 本模块写入范围 | truth source family pre-audit candidate table、field / marker / ref / state owner pre-audit candidate table、protocol surface construction pre-audit candidate table、Query surface marker / no-write pre-audit candidate table、persistence / transaction / replay / recovery / idempotency pre-audit candidate table、Step 16 / downstream / phase boundary handoff pre-audit candidate table、historical residue / naming drift candidate table 和 `R17.11` 进入门禁。 |
| 本模块禁止范围 | 最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、forbidden_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate、implementation code 和正式 `03-详细设计.md`。 |

### 2. truth source family pre-audit candidate table

| source family | owning source | R17.10 candidate check | candidate handoff | stop condition |
|---|---|---|---|---|
| baseline | Step 1~3;正式 `00/01/02` | 实现输入、范围、runtime、旧材料禁入是否仍以当前 `00/01/02` 和本轮 Step 为准。 | Step 19 装配正式 `03`;07 设 baseline gate。 | 需要从旧正式 `03`、旧 completed Step 或旧 P0/P1 恢复事实。 |
| implementation shape | Step 4~5 | 七实现单元、crate/package/file responsibility、依赖方向是否足够给 07 做 scope gate。 | 07 转成 boundary allowed / forbidden scope。 | 需要旧 crate/module/path 或实现便利重划模块。 |
| object / contract | Step 6~8 | object field source、port/mapper/resolver、public protocol shell 是否互相闭合。 | 07 做 per-boundary source closure gate。 | 字段、DTO、marker、port、mapper、resolver output 无正式来源。 |
| execution semantics | Step 9~13 | flow、state、persistence、error/recovery、idempotency/replay 是否同名同义。 | 07 做 flow / transaction / replay gate。 | 实现侧必须重排 UoW、补 stored surface、补 replay source 或放宽 state。 |
| runtime binding | Step 14~15 | config/dependency、availability、safe diagnostic、observability/audit 是否保持 body-free。 | 04/06/07 承接具体配置、验收和实现门禁。 | 需要 raw config、secret、URL、topic、provider body 或 raw log。 |
| verification | Step 16 | 最小测试切口是否覆盖 Step 5~15,同时不替代 05/06/07。 | 05/06/07 生成 TC、evidence、checks 和 acceptance gate。 | 需要 R17 或实现侧发明 TC ID、fixture、evidence schema、CI command。 |

### 3. field / marker / ref / state owner pre-audit candidate table

| audit axis | source compare | candidate check | candidate response if broken |
|---|---|---|---|
| typed ref source | Step 6 object cards;Step 7 repository/resolver;Step 11 key/version | `*_ref` 是否来自 id generator、repository load、formal previous output、port summary 或 persisted key。 | 回 Step 6/7/11;不得从 raw string、route、topic、cron、file name、hash 或 private map 推导。 |
| marker source | Step 6 marker;Step 7 mapper/resolver/availability;Step 8 public marker;Step 12 degraded/error | stale/degraded/unavailable/visibility/public marker 是否只能复制正式输出。 | 回 Step 6/7/8/12;不得现场合成 synthetic marker 或复用无关 marker。 |
| decision owner | Step 6 policy/application decision;Step 9 call site;Step 12 rejection/degraded | decision 是否由 domain policy / application helper 产生,entry/infra 只装配结果。 | 回 Step 6/9/12;不得让 API/worker/job entry 创建 business decision。 |
| state owner | Step 6 state owner;Step 10 matrix;Step 9 transition owner | state subject、transition owner、error/recovery branch 是否一致。 | 回 Step 10 或 owning Step;不得把 entry result、adapter availability、scheduler status 当 truth lifecycle。 |
| diagnostic boundary | Step 12 safe diagnostic;Step 15 redaction/audit | public / audit / report diagnostic 是否 body-free、redacted、safe、低基数。 | 回 Step 12/15;不得暴露 raw exception、provider body、payload excerpt、secret、SQL error。 |
| cursor / checkpoint | Step 11 persistence;Step 13 replay/reentry;Step 16 tests | cursor/checkpoint 是否有 durable source、opaque rule 和 replay semantics。 | 回 Step 11/13;不得用 queue offset、timestamp、file path、cron tick 或 private scan 替代。 |

### 4. protocol surface construction pre-audit candidate table

| protocol family | compare source | candidate check | candidate response if broken |
|---|---|---|---|
| Command | Step 6 objects;Step 7 service/port;Step 8 command shell;Step 9 command flow;Step 13 replay | accepted / rejected / duplicate replay 是否都能返回正式 result / rejection / effect / stored surface。 | 回 Step 8/9/13;不得重读 current truth 重建 duplicate result。 |
| Query | Step 6 read/degraded decision;Step 7 read ports;Step 8 response/page shell;Step 9 no-write flow | response / page / marker 是否来自 repository、read material、resolver summary 或 degraded mapper。 | 回 Step 7/8/9/12;不得 query 写 truth、刷新 projection 或合成 marker。 |
| Inbound | Step 6 intake decision;Step 7 source/resolver/store;Step 8 inbound shell;Step 9 consumer flow;Step 13 dedup | intake、duplicate、unsupported、delayed、quarantine、dead-letter 是否保持 body-free 和 safe receipt。 | 回 Step 8/9/13;不得保存 source raw body 或用 broker ack/offset 当业务结果。 |
| Outbound | Step 6 event candidate;Step 7 publisher/handoff;Step 8 outbound shell;Step 9 publish flow;Step 11 stored surface | event candidate、publication outcome、blocked/degraded/unavailable 是否来自 stored snapshot / publisher summary。 | 回 Step 8/9/11/15;不得用 topic/routing key/delivery receipt/raw payload 当 truth source。 |
| Operations Job | Step 6 job context/result;Step 7 job ports;Step 8 job shell/report;Step 9 job flow;Step 11 checkpoint/progress;Step 13 replay | job result、progress、checkpoint、partial failure、stored report replay 是否闭合。 | 回 Step 8/9/11/13;不得用 scheduler status、cron name、queue lease、process exit code 或 report body 反推。 |

### 5. Query surface marker / no-write pre-audit candidate table

| surface branch | source compare | candidate check | candidate response if broken |
|---|---|---|---|
| visible | Step 7 read repository/resolver;Step 8 response shell;Step 9 query flow | view/material/summary 是否给出 response 所需 typed refs、visibility marker 和 freshness marker。 | 回 Step 6/7/8/9;不得从 route param、existing view guess 或 string 拼接补字段。 |
| empty | Step 8 empty/page shell;Step 9 list query flow | empty page 是否仍有正式 page metadata、visibility or safe empty reason 来源。 | 回 Step 8/9;不得返回缺 marker 的 public surface。 |
| not visible | Step 7 visibility/read decision;Step 8 not-visible shell;Step 12 safe recovery | not-visible 是否走 public marker surface,不是 ordinary error。 | 回 Step 7/8/12;不得由 service 本地权限失败映射普通错误码。 |
| stale | Step 6 freshness/projection fields;Step 8 stale shell;Step 11 projection/material state | freshness marker 是否来自 material/projection builder 或 loaded state。 | 回 Step 6/8/11;不得从 view ref、timestamp 或 current truth 反推。 |
| degraded / unavailable | Step 6 degraded decision;Step 7 mapper/availability;Step 8 shell;Step 12 recovery | degraded_kind、degraded_marker、availability marker 是否有正式 mapper/source。 | 回 Step 6/7/8/12;不得合成 synthetic marker 或复制无关 resolver marker。 |
| no-write | Step 9 query flow;Step 11 transaction;Step 15 observability;Step 16 query cuts | query 是否禁止 reserve id、append trace/outbox、refresh reference、repair projection。 | 回 Step 9/11/15/16;不得为补 response 字段写 truth/material。 |

### 6. persistence / transaction / replay / recovery / idempotency pre-audit candidate table

| audit axis | compare source | candidate check | candidate response if broken |
|---|---|---|---|
| repository key / version | Step 7 repository;Step 11 persistence | save/load key、optimistic version、unique index、logical owner 是否一致。 | 回 Step 7/11;不得自选 key、scan store 或 private secondary map。 |
| UoW boundary | Step 9 flow;Step 11 transaction;Step 12 rollback | accepted write、trace/report/outbox/stored result 是否在明确 UoW 顺序内。 | 回 Step 9/11/12;不得 post-commit 回写 truth 或 rollback 后发布 event。 |
| stored operation result | Step 6 stored result;Step 8 response shell;Step 11 stored surface;Step 13 duplicate replay | duplicate accepted/rejected 是否能从 stored surface 还原。 | 回 Step 11/13;不得 duplicate 重跑业务或从 current truth 重建 response。 |
| error / recovery | Step 12 recovery;Step 15 diagnostic;Step 16 error cuts | safe rejection、degraded、manual intervention、dead-letter、quarantine 是否有 public/safe surface。 | 回 Step 12/15;不得 raw exception、adapter body、secret 进入 response/report/audit。 |
| idempotency / reentry | Step 13 guard;Step 9 flow;Step 11 checkpoint | in-flight、same/different digest、commit unknown、job resume 是否可重复执行或安全暂停。 | 回 Step 13;不得忽略 digest 或用 retry 次数 / scheduler lease 作为业务幂等。 |

### 7. Step 16 / downstream / phase boundary handoff pre-audit candidate table

| downstream target | candidate input from R17 | must still be produced later | R17 non-ownership |
|---|---|---|---|
| `04-配置设计.md` | Step 14 config/dependency redline、adapter availability、forbidden configurable boundary。 | concrete key/env/profile/topic/URL/default/secret source。 | R17 不写具体配置。 |
| `05-测试方案.md` | Step 16 source coverage、test cut intent、forbidden shortcut。 | TC ID、suite、fixture、artifact schema、report path。 | R17 不写测试方案。 |
| `06-验收标准.md` | no raw body、no secret、query no-write、duplicate no-rerun、no synthetic marker 等验收输入。 | acceptance gate、veto、coverage target、release evidence。 | R17 不写验收标准。 |
| `07-实施计划.md` | source matrix、preread candidate、pre-audit candidate、forbidden inference、blocker handling。 | phase / commit boundary、allowed_scope、required_checks、implementation ledger、Commit Gate / Handoff Gate。 | R17 不写实施计划。 |
| Step 18 | unresolved gap、naming drift、downstream pending、implementation-blocking risk。 | 风险与待确认事项正式清单。 | R17 不替 Step 18 定最终风险状态。 |
| Step 19 | formal §16 candidate source map、禁入项、可装配候选。 | 正式 `03-详细设计.md` 装配。 | R17 不修改正式 `03`。 |

### 8. historical residue / naming drift candidate table

| risk signal | candidate classification | required later handling |
|---|---|---|
| `MethodContent` / publish / retire / supersede | historical pollution | Step 19 / 07 不得作为当前 object、protocol、flow 或 phase source。 |
| P0 / P1 | old phase priority pollution | 07 boundary 只能从当前 Step 2/5/8/9/16 和正式 `05/06/07` 生成。 |
| snapshot / fingerprint | old material verification pollution | 仅当前 Step 6~15 重新闭口的 marker/material 可用。 |
| outbox relay / delivery receipt | old transport / delivery pollution | 当前 outbound/handoff 必须按 Step 8/9/11/13/15 body-free shell 与 safe outcome。 |
| Gateway / PostgreSQL / object storage | old concrete product binding | 具体技术产品绑定后移 04/07,不得从旧 Step 17 恢复。 |
| scheduler / queue / topic / URL | old runtime shortcut | 只可作为后续配置/部署输入,不得变成 object field 或 protocol source。 |
| old crate / module / repo path | old implementation layout pollution | 当前实现形态只以 Step 4/5 七实现单元和后续 07 为准。 |
| 旧 `ResolveViewProfile` / old view resolver | old read model pollution | Query / read surface 只能从当前 Step 6~9/11/12 定义的 read decision、resolver、material、marker 来源闭合。 |

### 9. R17.11 进入门禁

`R17.11 not-entering-implementation and downstream handoff:先思考` 只允许思考:

1. 哪些事项明确不进入 implementation,必须交给 `04/05/06/07/18/19`。
2. 哪些候选表只能作为 downstream input,不得被 implementation agent 当作正式 boundary。
3. `04` 需要承接的 config / dependency / adapter binding。
4. `05/06` 需要承接的 test / evidence / acceptance。
5. `07` 需要承接的 phase / commit boundary、required reads、checks、implementation ledger。
6. Step 18 / Step 19 需要承接的 unresolved risk、naming drift、formal §16 source map。
7. 不写正式实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、CI/evidence schema、implementation code 或正式 `03-详细设计.md`。

### 10. R17.10 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 truth source family pre-audit candidate table | pass |
| 是否写入 field / marker / ref / state owner pre-audit candidate table | pass |
| 是否写入 protocol surface construction pre-audit candidate table | pass |
| 是否写入 Query surface marker / no-write pre-audit candidate table | pass |
| 是否写入 persistence / transaction / replay / recovery / idempotency pre-audit candidate table | pass |
| 是否写入 Step 16 / downstream / phase boundary handoff pre-audit candidate table | pass |
| 是否写入 historical residue / naming drift candidate table | pass |
| 是否形成 R17.11 进入门禁 | pass |
| 是否未写最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、CI/evidence schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.11 not-entering-implementation and downstream handoff:先思考`;只允许思考不进入 implementation 的事项、04/05/06/07/18/19 downstream handoff、implementation agent 不得直接使用 R17 候选表开工的红线、blocker watch 和 R17.12 写入计划;不得直接修改正式 `03-详细设计.md`;不得写最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.11 not-entering-implementation and downstream handoff:先思考

### 1. 当前模块目标

`R17.11` 只思考哪些内容明确不进入 implementation、应交给哪些下游文档或后续 Step,以及 implementation agent 不得直接使用 R17 候选表开工的红线。当前模块不写最终 downstream handoff 表、不写正式实施承接清单、不写正式实施计划、不写 phase / commit boundary、不写 allowed_scope / required_checks、不创建 implementation ledger、不写 evidence schema、CI command、acceptance gate 或 implementation code,也不修改正式 `03-详细设计.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.10` 推进到 `R17.11`。 |
| 当前允许 | 思考 not-entering-implementation 分类、04/05/06/07/18/19 handoff、implementation agent 红线、blocker watch 和 R17.12 写入计划。 |
| 当前禁止 | 写最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate、implementation code 或正式 `03-详细设计.md`。 |

### 2. not-entering-implementation 分类思考

Step 17 需要明确“哪些内容不是实现者可以补的洞”。这些内容即使已经在 R17 候选表中出现,也只是交给下游文档的输入,不能让 implementation agent 直接据此实现。

| category | why not implementation | owning downstream |
|---|---|---|
| concrete config | Step 14 只定义配置边界和依赖绑定,不定义 key/env/default/topic/URL/secret source。 | `04-配置设计.md` |
| test case / fixture / evidence | Step 16 只定义最小测试切口和 source coverage,不定义 TC ID、fixture JSON、run artifact schema。 | `05-测试方案.md` |
| acceptance gate | Step 17 只给验收输入,不定义 release veto、coverage target、acceptance evidence。 | `06-验收标准.md` |
| phase / commit boundary | Step 17 是 handoff input,不是正式实施计划。 | `07-实施计划.md` |
| implementation ledger | Step 17 可提示需要台账,但不创建项目级或 boundary implementation ledger。 | `07` / implementation ledger 机制 |
| unresolved design gap | 缺字段、DTO、state、port、mapper、config、evidence、phase 时必须回 owning design source。 | Step 18 / owning Step |
| formal document assembly | Step 17 不直接修改正式 `03-详细设计.md`。 | Step 19 |

### 3. downstream handoff 边界思考

R17.12 应把 handoff 写成“给谁、交什么、不得推断什么、何时阻塞”的表,而不是把下游文档内容提前写完。

| downstream | should receive from Step 17 | should not receive as final truth |
|---|---|---|
| `04` | config/dependency boundary、adapter availability、secret/raw body 禁入、runtime binding source family。 | concrete config key/env/profile/default/topic/URL/secret source。 |
| `05` | test cut source map、minimum verification intent、forbidden shortcut、pre-audit stop condition。 | TC ID、suite priority、fixture、artifact schema、report template、CI command。 |
| `06` | no raw body、no secret、query no-write、duplicate no-rerun、no synthetic marker、safe diagnostic redline。 | final acceptance gate、release veto、coverage target、SLO/alert threshold。 |
| `07` | source matrix、preread candidate、agent gate candidate、pre-audit candidate、forbidden inference、blocker handling。 | phase / commit boundary、allowed_scope、required_checks、implementation ledger、commit body。 |
| Step 18 | unresolved gap、naming drift、downstream pending、implementation-blocking risk。 | Step 17 的候选表不自动变成 risk final status。 |
| Step 19 | formal §16 candidate source map、禁入项、可装配候选。 | 未确认候选表不得直接复制为正式 `03` 终稿。 |

### 4. implementation agent 红线思考

R17.12 需要写明 implementation agent 的开工输入必须来自后续正式 `07` 和 implementation ledger,不是直接来自 Step 17 候选表。

| redline | rationale | response |
|---|---|---|
| 不得直接按 R17 候选表开工 | R17 不是 phase / commit boundary。 | 等 `07` 生成正式 boundary 和 required reads。 |
| 不得把 candidate table 当 required_reads | R17 只给 07 输入。 | 由 `07` 转成 per-boundary required_reads。 |
| 不得自行补 schema / port / DTO / state / mapper | 设计真相源必须闭口。 | 暂停并回 owning Step。 |
| 不得自行补 config / evidence / acceptance | 这些归属 04/05/06/07。 | 暂停并回下游文档。 |
| 不得用 fake-only private map 绕过缺口 | fake/durable parity 必须来自正式 port/mapper。 | 回 Step 7/11/13 或 07 gate。 |
| 不得进入后续 phase 内容 | 当前 boundary 只能由 `07` 定义。 | 等设计台账推进。 |

### 5. blocker watch 思考

R17.11 不应断言当前设计没有 blocker,但要说明未来发现 blocker 的归属。R17.12 可把这些 blocker watch 落成候选表。

| blocker watch | likely owner | handling thought |
|---|---|---|
| object required field 无来源 | Step 6 / Step 9 / Step 11 | 回字段来源或构造 flow,不得实现侧默认值。 |
| port / mapper / resolver output 缺失 | Step 7 | 回 port 契约,不得 implementation 私加方法。 |
| public DTO / marker / report shell 不闭合 | Step 8 / Step 12 | 回 protocol / error recovery,不得合成 public marker。 |
| flow 需要未定义 state / stored surface | Step 9 / Step 10 / Step 11 / Step 13 | 回 flow/state/persistence/replay owning Step。 |
| config / availability 只剩 raw string | Step 14 / `04` | 回配置设计,不得实现侧发明 key/default。 |
| test / evidence / acceptance 缺 schema | Step 16 / `05` / `06` | 回测试或验收设计,不得实现侧伪造 artifact。 |
| implementation boundary 缺台账 | `07` / implementation ledger | 不开工,等正式 boundary ledger。 |

### 6. Step 18 / Step 19 承接思考

Step 17 收口后仍有两个内部下游:Step 18 处理风险与待确认事项,Step 19 装配正式详细设计。R17.12 需要把它们分清。

| target Step | should receive | should not receive |
|---|---|---|
| Step 18 | unresolved blocker watch、downstream pending、旧材料残留风险、命名漂移风险、implementation-blocking unknown。 | 已经明确归 04/05/06/07 的正常后移项不应全部升级成 blocker。 |
| Step 19 | formal §16 source map、confirmed R17 source tables、禁入项、downstream ownership statement。 | R17.11/R17.12 思考草稿不能未经 stop-review 直接进入正式 `03`。 |

### 7. R17.12 写入计划思考

`R17.12 not-entering-implementation and downstream handoff:再写入` 应把本模块思考落成可恢复记录:

1. 写 not-entering-implementation candidate table。
2. 写 downstream handoff candidate table。
3. 写 implementation agent redline table。
4. 写 blocker watch ownership table。
5. 写 Step 18 / Step 19 handoff candidate table。
6. 写 `R17.13 formal §16 candidate stop-review:先思考` 进入门禁。
7. 不写正式 `03-详细设计.md`、正式实施计划、phase / commit boundary、implementation ledger、CI/evidence schema 或 implementation code。

### 8. R17.11 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 not-entering-implementation and downstream handoff | pass |
| 是否形成不进入 implementation 的分类思考 | pass |
| 是否形成 04/05/06/07/18/19 downstream handoff 边界思考 | pass |
| 是否形成 implementation agent 红线思考 | pass |
| 是否形成 blocker watch ownership 思考 | pass |
| 是否形成 Step 18 / Step 19 承接思考 | pass |
| 是否形成 R17.12 写入计划 | pass |
| 是否未写最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、CI/evidence schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.12 not-entering-implementation and downstream handoff:再写入`;只允许写入 not-entering-implementation candidate table、downstream handoff candidate table、implementation agent redline table、blocker watch ownership table、Step 18 / Step 19 handoff candidate table 和 `R17.13 formal §16 candidate stop-review:先思考` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.12 not-entering-implementation and downstream handoff:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.11` 推进到 `R17.12`。 |
| 本模块写入范围 | not-entering-implementation candidate table、downstream handoff candidate table、implementation agent redline table、blocker watch ownership table、Step 18 / Step 19 handoff candidate table 和 `R17.13` 进入门禁。 |
| 本模块禁止范围 | 最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、forbidden_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate、implementation code 和正式 `03-详细设计.md`。 |

### 2. not-entering-implementation candidate table

| candidate item | reason not implementation-owned | formal owner | implementation consequence |
|---|---|---|---|
| concrete config key/env/profile/default/topic/URL/secret source | Step 14 只定义 config / dependency boundary,不定义具体运行配置。 | `04-配置设计.md` | 实现前若缺配置真相源,必须暂停等 04 或 07 gate。 |
| TC ID / suite / fixture / run artifact schema / report path | Step 16 只定义最小测试切口和 source coverage。 | `05-测试方案.md` | 实现者不得自行发明 evidence schema 或声称覆盖。 |
| acceptance gate / release veto / coverage target | Step 17 只提供验收输入。 | `06-验收标准.md` | 实现提交前的通过标准必须来自 06/07。 |
| phase / commit boundary / allowed_scope / required_checks | Step 17 不是实施计划。 | `07-实施计划.md` | implementation agent 不得直接按 R17 候选表开工。 |
| implementation_execution_ledger / boundary ledger | Step 17 只提示需要台账机制。 | `07` / implementation ledger 机制 | 缺当前 boundary 台账时不得改实现仓代码。 |
| unresolved field / DTO / state / port / mapper / marker gap | 设计真相源必须由 owning Step 闭口。 | owning Step / Step 18 | 实现侧不得默认值、synthetic marker、private map 或 fake-only workaround。 |
| formal `03-详细设计.md` assembly | Step 17 当前仍是中间产物。 | Step 19 | 正式 03 只能由 confirmed source map 装配。 |

### 3. downstream handoff candidate table

| downstream | receives from Step 17 | must define later | must not infer |
|---|---|---|---|
| `04-配置设计.md` | config/dependency boundary、adapter availability、safe diagnostic、raw config / secret / URL / topic 禁入。 | concrete key、env、profile、default、topic、URL、secret source、adapter binding detail。 | 不得从 Step 17 表格中的候选词直接生成配置项。 |
| `05-测试方案.md` | Step 16 source coverage、test cut intent、forbidden shortcut、pre-audit stop condition。 | TC ID、suite hierarchy、fixture、artifact schema、run report path、case evidence。 | 不得把 R17 pre-audit 表当作测试用例矩阵。 |
| `06-验收标准.md` | no raw body、no secret、query no-write、duplicate no-rerun、no synthetic marker、safe diagnostic redline。 | acceptance gate、veto、coverage target、release evidence、manual approval rule。 | 不得把 R17 redline 直接当最终验收门禁。 |
| `07-实施计划.md` | source matrix、preread candidate、agent gate candidate、pre-audit candidate、forbidden inference、blocker handling。 | phase / commit boundary、required_reads、allowed_scope、forbidden_scope、required_checks、Commit Gate、Handoff Gate。 | 不得复制对象字段、DTO、flow 或状态矩阵形成第二真相源。 |
| Step 18 | unresolved gap、naming drift、downstream pending、旧材料残留风险、implementation-blocking unknown。 | risk / open question status、owner、resolution route。 | 不得把正常下游后移项全部升级为 blocker。 |
| Step 19 | formal §16 candidate source map、confirmed R17 tables、禁入项、downstream ownership statement。 | 正式 `03-详细设计.md` §16 装配。 | 不得复制未经确认的思考段或旧 Step 17 内容。 |

### 4. implementation agent redline table

| redline | concrete meaning | required action |
|---|---|---|
| R17 is not a boundary ledger | R17 候选表不能替代 07 的 phase / commit boundary。 | 等 07 和 implementation ledger 指定 current_boundary。 |
| Candidate table is not required_reads | R17 只给 07 输入,不是实现者开工清单。 | 由 07 转成 per-boundary required_reads。 |
| No design-gap invention | schema、port、DTO、state、mapper、marker、config、evidence、phase 缺口不能由实现侧补。 | 暂停并回 owning design source。 |
| No fake-only closure | fake runtime、private map、string parsing、route/topic/cron 推断不能替代正式 port/mapper。 | 回 Step 7/11/13 或 07 gate。 |
| No downstream document bypass | 04/05/06/07 未闭口时不得用实现仓 artifact 先行补口。 | 等下游文档正式闭合。 |
| No next-phase leakage | 当前实现范围只能来自 07 current boundary。 | 若需要后续 boundary 对象/结果/证据,暂停并回 07。 |
| No old-material resurrection | 旧 `MethodContent`、P0/P1、snapshot、fingerprint、outbox relay、old crate/path 不得复活。 | 只使用当前 `00/01/02` 和本轮 Step 1~16。 |

### 5. blocker watch ownership table

| blocker watch | likely owner | R17 handling | implementation action |
|---|---|---|---|
| object required field source missing | Step 6 / Step 9 / Step 11 | 标记为 field source closure risk。 | 不写代码;回设计闭口。 |
| port / mapper / resolver output missing | Step 7 | 标记为 port contract closure risk。 | 不私加 trait method 或 fake map。 |
| public DTO / marker / report shell incomplete | Step 8 / Step 12 | 标记为 protocol / recovery closure risk。 | 不合成 public marker 或 report field。 |
| flow requires undefined state / stored surface | Step 9 / Step 10 / Step 11 / Step 13 | 标记为 flow / state / replay closure risk。 | 不重排 flow 或重跑 duplicate。 |
| config / availability only has raw string | Step 14 / `04` | 标记为 config handoff pending。 | 不发明 key/default/topic/URL。 |
| test / evidence / acceptance schema missing | Step 16 / `05` / `06` | 标记为 verification downstream pending。 | 不伪造 artifact 或 acceptance report。 |
| implementation boundary ledger missing | `07` / implementation ledger | 标记为 implementation planning gate missing。 | 不开工,等 current boundary 台账。 |

### 6. Step 18 / Step 19 handoff candidate table

| target | candidate handoff | status in R17.12 | next required handling |
|---|---|---|---|
| Step 18 | unresolved blocker watch、naming drift、old material residue、downstream pending that may block implementation。 | candidate only | Step 18 判断 open / resolved / deferred / blocker。 |
| Step 18 | distinction between normal downstream ownership and true blocker。 | candidate only | Step 18 不应把所有 04/05/06/07 后移项都列为 blocker。 |
| Step 19 | formal §16 source map from R17.2~R17.14 confirmed modules。 | candidate only | Step 19 装配正式 `03` §16。 |
| Step 19 | forbidden carryover list for old Step 17 and old formal `03` residue。 | candidate only | Step 19 写入正式禁入说明。 |
| Step 19 | downstream ownership statement: implementation starts only after 07 and ledger gates。 | candidate only | Step 19 可装配为 formal §16 结论。 |

### 7. R17.13 进入门禁

`R17.13 formal §16 candidate stop-review:先思考` 只允许思考:

1. formal §16 candidate 的来源映射。
2. 哪些 R17 模块可进入 formal §16 source map。
3. 哪些内容必须继续禁入正式 §16。
4. Step 17 completion checklist 和进入 Step 18 的条件。
5. Step 19 后续装配边界。
6. 不写 formal §16 candidate 正文终稿、不修改正式 `03-详细设计.md`、不写正式实施计划、phase / commit boundary、implementation ledger、CI/evidence schema 或 implementation code。

### 8. R17.12 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 not-entering-implementation candidate table | pass |
| 是否写入 downstream handoff candidate table | pass |
| 是否写入 implementation agent redline table | pass |
| 是否写入 blocker watch ownership table | pass |
| 是否写入 Step 18 / Step 19 handoff candidate table | pass |
| 是否形成 R17.13 进入门禁 | pass |
| 是否未写最终实施承接清单、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、CI/evidence schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.13 formal §16 candidate stop-review:先思考`;只允许思考 formal §16 candidate source map、R17 模块可装配范围、禁入项、Step 17 completion checklist、Step 18 entry gate 和 Step 19 装配边界;不得直接修改正式 `03-详细设计.md`;不得写 formal §16 candidate 正文终稿、正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.13 formal §16 candidate stop-review:先思考

### 1. 当前模块目标

`R17.13` 只思考 formal §16 candidate 的来源映射、R17 模块可装配范围、禁入项、Step 17 completion checklist、Step 18 entry gate 和 Step 19 装配边界。当前模块不写 formal §16 candidate 正文终稿、不修改正式 `03-详细设计.md`、不写正式实施计划、不写 phase / commit boundary、不写 allowed_scope / required_checks、不创建 implementation ledger、不写 evidence schema、CI command、acceptance gate 或 implementation code。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.12` 推进到 `R17.13`。 |
| 当前允许 | 思考 formal §16 source map、R17 模块可装配范围、禁入项、completion checklist、Step 18 entry gate、Step 19 装配边界和 R17.14 写入计划。 |
| 当前禁止 | 写 formal §16 candidate 正文终稿、修改正式 `03-详细设计.md`、写正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。 |

### 2. formal §16 source map 思考

formal §16 的候选来源不应只指向 R17.12。它需要覆盖 Step 17 的完整收口链条,并能让 Step 19 判断哪些内容可装配、哪些仍是下游输入。

| source module | possible formal §16 role | R17.13 judgement |
|---|---|---|
| R17.1/R17.2 | 开工边界、必读文档、旧 Step 17 污染隔离、SOP 十二问初答。 | 可作为 §16 scope / source baseline 候选。 |
| R17.3/R17.4 | L1-governance 框架对齐、L3 承接总图、07 审计输入族、禁入项。 | 可作为 §16 handoff overview 候选。 |
| R17.5/R17.6 | Step 1~16 implementation handoff source matrix、consumer、forbidden inference、blocker handling。 | 可作为 §16 source matrix 候选。 |
| R17.7/R17.8 | implementation preread candidate、gate ownership、agent start gate、commit / git config、ledger handoff。 | 可作为 §16 preread / gate input 候选,但不成为正式 07 required_reads。 |
| R17.9/R17.10 | cross-document closure pre-audit candidate tables。 | 可作为 §16 pre-audit candidate 候选,但不声明正式 pass。 |
| R17.11/R17.12 | not-entering-implementation、downstream handoff、agent redline、blocker watch、Step 18/19 handoff。 | 可作为 §16 deferred / downstream ownership 候选。 |
| R17.13/R17.14 | stop-review、formal §16 candidate source map、Step 18 entry gate。 | 可作为 Step 17 completion record 和 Step 18 entry input。 |

### 3. R17 模块可装配范围思考

Step 19 装配正式 `03-详细设计.md` §16 时,应该引用 R17 已确认的表格和结论,但不能把所有中间思考原样复制。R17.14 需要把可装配范围写清楚。

| candidate block | can assemble into formal §16 | assembly constraint |
|---|---|---|
| Step 17 purpose and boundary | 是 | 必须强调 Step 17 不是 `07-实施计划.md`。 |
| Implementation handoff source matrix | 是 | 只写 source / consumer / forbidden inference,不复制所有对象字段、DTO、flow。 |
| Implementation preread candidate | 是 | 写成 07 输入,不得写成正式 required_reads。 |
| Gate ownership and agent redline | 是 | 写清 implementation agent must start from 07 / ledger gates。 |
| Cross-document pre-audit candidate | 是 | 写成 pre-audit candidate,不得声称正式 `03/05/06/07` 全部 pass。 |
| Downstream handoff | 是 | 写明确交 04/05/06/07/18/19 的职责。 |
| Blocker watch | 是 | 写 owner / return route,不得替 Step 18 定最终 risk status。 |

### 4. formal §16 禁入项思考

formal §16 必须避免成为第二实施计划或第二测试方案。R17.14 应把禁入项固化,防止 Step 19 装配时越界。

| forbidden formal §16 content | reason |
|---|---|
| phase / commit boundary、allowed_scope、forbidden_scope、required_checks | 归属 `07-实施计划.md`。 |
| implementation_execution_ledger / boundary ledger 实例 | 归属 07 / implementation ledger 机制。 |
| TC ID、suite、fixture、artifact schema、run report path | 归属 `05-测试方案.md`。 |
| acceptance gate、veto、coverage target、release evidence | 归属 `06-验收标准.md`。 |
| concrete config key/env/profile/default/topic/URL/secret source | 归属 `04-配置设计.md`。 |
| Rust struct / enum、JSON schema、代码文件清单、CI command、implementation code | 不属于详细设计 Step 17。 |
| 旧 `MethodContent`、P0/P1、snapshot、fingerprint、outbox relay、旧 crate/path | historical pollution,不得进入当前正向 source。 |

### 5. Step 17 completion checklist 思考

R17.14 需要写出 Step 17 完成检查,但检查对象是“Step 17 是否完成”,不是“实现是否可开工”。

| checklist item | completion meaning |
|---|---|
| source baseline complete | R17 已回指当前 `00/01/02` 和 Step 1~16。 |
| old material isolated | 旧 Step 17 / 旧 formal 03 / 旧主线不再作为正向来源。 |
| handoff source matrix complete | Step 1~16 已映射到 04/05/06/07/18/19 / implementation via 07。 |
| preread and gate candidates complete | 已给 07 提供 required reads / gate 输入候选。 |
| pre-audit candidate complete | 字段、protocol、query、persistence、replay、downstream、旧残留已有预审候选。 |
| downstream ownership clear | 不进入 implementation 的事项已有 owner。 |
| next step gate clear | Step 18 入口和 Step 19 装配边界清楚。 |

### 6. Step 18 entry gate 思考

Step 18 不应重新打开 Step 17 的 handoff 表。它应接收 R17 的 blocker watch、naming drift、downstream pending 和 historical residue,再判断 open / resolved / deferred / blocker。

| Step 18 input | R17.13 thought |
|---|---|
| unresolved gap watch | 若没有具体 blocker,也可作为 watch category 进入 Step 18。 |
| naming drift | 旧名称、旧主线、旧 crate/path、old resolver 等应进入风险排查。 |
| downstream pending | 04/05/06/07 未生成属于正常后移,是否升级 blocker 由 Step 18 判断。 |
| implementation-blocking unknown | 只要影响 07/implementation gate,Step 18 需要记录 owner 和 resolution route。 |
| formal assembly caution | Step 19 装配前必须确认 Step 18 没有阻塞 formal §16 的 open item。 |

### 7. Step 19 装配边界思考

Step 19 可以装配 formal §16,但应只装配 confirmed R17 source map 与结论。R17.14 应为 Step 19 提供候选 source map,不直接写正式 `03`。

| assembly concern | R17.13 thought |
|---|---|
| source selection | 只从 R17 confirmed modules 选取正式 §16 候选。 |
| duplication avoidance | 不复制 Step 6 object cards、Step 8 protocol tables、Step 9 flow 或 Step 10 matrix。 |
| downstream ownership | 明确 04/05/06/07 才是具体配置、测试、验收、实施计划 owner。 |
| implementation start rule | implementation starts only after formal 07 and ledger gates。 |
| historical pollution | formal §16 必须显式拒绝旧 Step 17 和旧 formal 03 主线。 |

### 8. R17.14 写入计划思考

`R17.14 formal §16 candidate stop-review:再写入` 应把本模块思考落成 Step 17 收口记录:

1. 写 formal §16 source map candidate table。
2. 写 formal §16 assemblable / forbidden content table。
3. 写 Step 17 completion checklist。
4. 写 Step 18 entry gate。
5. 写 Step 19 assembly boundary。
6. 写 Step 17 final stop-review,并将 flow / ledger 推进到 Step 17 completed / waiting Step 18。
7. 不直接修改正式 `03-详细设计.md`,不写正式实施计划、phase / commit boundary、implementation ledger、CI/evidence schema 或 implementation code。

### 9. R17.13 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 formal §16 candidate stop-review | pass |
| 是否形成 formal §16 source map 思考 | pass |
| 是否形成可装配范围和禁入项思考 | pass |
| 是否形成 Step 17 completion checklist 思考 | pass |
| 是否形成 Step 18 entry gate 思考 | pass |
| 是否形成 Step 19 装配边界思考 | pass |
| 是否形成 R17.14 写入计划 | pass |
| 是否未写 formal §16 candidate 正文终稿、正式实施计划、phase / commit boundary、implementation ledger、CI/evidence schema 或 implementation code | pass |
| 是否未修改正式 `03-详细设计.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 17 `R17.14 formal §16 candidate stop-review:再写入`;只允许写入 formal §16 source map candidate table、formal §16 assemblable / forbidden content table、Step 17 completion checklist、Step 18 entry gate、Step 19 assembly boundary 和 Step 17 final stop-review;不得直接修改正式 `03-详细设计.md`;不得写正式实施计划、phase / commit boundary、allowed_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。

---

## R17.14 formal §16 candidate stop-review:再写入

### 1. 当前模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm |
| 用户确认 | 已确认从 `R17.13` 推进到 `R17.14`。 |
| 本模块写入范围 | formal §16 source map candidate table、formal §16 assemblable / forbidden content table、Step 17 completion checklist、Step 18 entry gate、Step 19 assembly boundary 和 Step 17 final stop-review。 |
| 本模块禁止范围 | 直接修改正式 `03-详细设计.md`、正式实施计划、phase / commit boundary、allowed_scope、forbidden_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate 和 implementation code。 |

### 2. formal §16 source map candidate table

| formal §16 candidate block | confirmed R17 source | candidate role | assembly note |
|---|---|---|---|
| §16.1 Scope and boundary | R17.1/R17.2 | 声明 Step 17 是详细设计到实施计划的承接清单,不是 `07-实施计划.md`。 | 必须保留旧 Step 17 pollution 隔离说明。 |
| §16.2 Handoff overview | R17.3/R17.4 | 给出 L3 承接总图、下游边界和 07 审计输入族。 | 只装配 L3 语义,不得复制 L1-governance 领域对象。 |
| §16.3 Implementation handoff source matrix | R17.5/R17.6 | 将 Step 1~16 映射到 04/05/06/07/18/19 和 implementation via 07。 | 不复制对象字段表、DTO 表、flow 或状态矩阵。 |
| §16.4 Implementation preread and gate input | R17.7/R17.8 | 提供 preread、gate ownership、agent start gate、commit / git config、ledger handoff 候选。 | 写成 07 输入,不得写成正式 required_reads。 |
| §16.5 Cross-document closure pre-audit | R17.9/R17.10 | 提供字段、protocol、query、persistence、replay、downstream、旧残留预复核候选。 | 写成 pre-audit candidate,不得声明正式 `03/05/06/07` 全部 pass。 |
| §16.6 Deferred and downstream ownership | R17.11/R17.12 | 写不进入 implementation 的事项、downstream handoff、agent redline、blocker watch。 | 不替 04/05/06/07 写正文。 |
| §16.7 Stop-review and next gates | R17.13/R17.14 | 写 Step 17 completion checklist、Step 18 entry gate、Step 19 assembly boundary。 | 只作为 Step 18/19 输入。 |

### 3. formal §16 assemblable / forbidden content table

| content family | formal §16 can include | formal §16 must not include |
|---|---|---|
| purpose / boundary | Step 17 目标、非实施计划声明、implementation via 07 规则。 | 任务拆分、排期、phase / commit boundary。 |
| source matrix | Step 1~16 source family、consumer、forbidden inference、blocker handling。 | Step 6 object cards、Step 8 full protocol table、Step 9 flow、Step 10 state matrix 全量复制。 |
| preread / gate input | preread candidate、gate ownership、agent redline、ledger handoff requirement。 | `07` 的正式 required_reads、allowed_scope、required_checks、implementation ledger 实例。 |
| pre-audit | 字段、marker、protocol、query、persistence、replay、downstream、旧材料残留的预复核维度。 | 正式 pass 结论、implementation-ready 结论、代码级 workaround。 |
| downstream ownership | 04/05/06/07/18/19 的职责边界和不得推断项。 | concrete config、TC ID、evidence schema、acceptance gate、CI command。 |
| historical pollution | 旧 `MethodContent`、P0/P1、snapshot、fingerprint、outbox relay、old crate/path 禁入。 | 旧 Step 17 结论、旧正式 `03` 主线、旧实现路径。 |

### 4. Step 17 completion checklist

| checklist item | result | note |
|---|---|---|
| source baseline complete | pass | 已回指当前 `00/01/02` 和 Step 1~16,旧 `03` 仅作 historical material。 |
| old material isolated | pass | 旧 Step 17 completed 状态、旧 MethodContent / P0/P1 / snapshot / fingerprint / outbox relay 已隔离。 |
| handoff source matrix complete | pass | Step 1~16 已映射到 downstream consumer、implementation use、forbidden inference 和 blocker handling。 |
| preread and gate candidates complete | pass | 已形成 preread、gate ownership、agent start gate、commit / git config、code ledger handoff 候选。 |
| cross-document pre-audit candidate complete | pass | 已形成 truth source、field/marker/ref/state、protocol、query、persistence/replay、downstream、naming drift 预复核候选。 |
| downstream ownership clear | pass | 不进入 implementation 的内容已分配到 04/05/06/07/18/19。 |
| formal §16 source map candidate ready | pass | Step 19 可从 R17 confirmed modules 装配正式 §16。 |
| implementation start gate clear | pass | implementation 只能由正式 07 和 implementation ledger 开工,不得直接按 R17 候选表开工。 |

### 5. Step 18 entry gate

进入 Step 18 `风险与待确认事项` / `R18.1 开工与必读文档:先思考` 前必须满足:

- Step 17 `R17.1` ~ `R17.14` 均已 completed_wait_user_confirm。
- 正式 `03-详细设计.md` 未由 Step 17 直接修改。
- Step 17 已明确 R17 候选表不是正式实施计划、测试方案、验收标准或配置设计。
- Step 17 已给出 blocker watch ownership,但未替 Step 18 判定最终风险状态。
- Step 18 必须区分正常 downstream pending 与真正 implementation-blocking blocker。
- Step 18 若发现会阻塞 formal §16 装配的 open item,必须在 Step 19 前闭口或明确 deferred owner。

### 6. Step 19 assembly boundary

Step 19 装配正式 `03-详细设计.md` 时,对 Step 17 的使用边界如下:

| assembly boundary | requirement |
|---|---|
| source selection | 只从 R17 confirmed modules 和本 `R17.14` source map candidate 选取内容。 |
| no second truth source | 不复制对象字段表、DTO 表、flow、状态矩阵、测试用例或实施计划形成第二真相源。 |
| downstream ownership | 明确 concrete config / test / acceptance / implementation plan 分别由 04/05/06/07 负责。 |
| implementation start rule | formal §16 必须写明 implementation starts only after formal 07 and implementation ledger gates。 |
| risk dependency | 若 Step 18 有阻塞 formal §16 的 unresolved risk,Step 19 不得装配为 completed。 |
| historical pollution | 正式 §16 不得继承旧 Step 17、旧 formal `03`、旧 `MethodContent` / P0/P1 / snapshot / fingerprint / outbox relay。 |

### 7. Step 17 final stop-review

| 检查项 | 结果 |
|---|---|
| 是否完成 R17.1~R17.14 全部模块 | pass |
| 是否写入 formal §16 source map candidate table | pass |
| 是否写入 formal §16 assemblable / forbidden content table | pass |
| 是否写入 Step 17 completion checklist | pass |
| 是否写入 Step 18 entry gate | pass |
| 是否写入 Step 19 assembly boundary | pass |
| 是否保持 Step 17 不是正式实施计划 | pass |
| 是否保持 04/05/06/07 downstream ownership | pass |
| 是否明确 implementation starts only after 07 and ledger gates | pass |
| 是否未直接修改正式 `03-详细设计.md` | pass |
| 是否未写 phase / commit boundary、allowed_scope、required_checks、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code | pass |

Step 17 final status: completed_wait_user_confirm。

next_allowed_action: 等待用户确认后进入 Step 18 `R18.1 开工与必读文档:先思考`;只允许思考风险与待确认事项的开工边界、必读文档、Step 17 handoff、旧 Step 18 historical material 隔离、风险分类框架和 R18.2 写入计划;不得直接修改正式 `03-详细设计.md`;不得进入 Step 19;不得写正式实施计划、phase / commit boundary、implementation ledger、evidence schema、CI command、acceptance gate 或 implementation code。
