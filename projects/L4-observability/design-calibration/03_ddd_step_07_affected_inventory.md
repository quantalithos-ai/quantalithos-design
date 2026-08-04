# L4-observability 03-详细设计 Step 07 - affected-only review inventory

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 07
> 主输出: `design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md`
> 当前模式: full-restart / affected-only rebuild
> 当前边界: 只重建 Step 07 中间产物；不修改正式 `03-详细设计.md`，不进入 Step 08

## 1. 恢复状态

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 07 `逐模块定义 Trait / Port / Adapter 契约` |
| 上游门禁 | Step 06 `R06.8-B_done_design_only_waiting_user_before_Step07` 已由用户明确解除 |
| 本文件状态 | `S07-F_complete_stop_review_synced` |
| 主产物状态 | `affected_rebuild_S07-F_complete_waiting_user_before_Step08` |
| 正式回填 | frozen；只能在后续 Step 19 重新装配 |
| 下一允许动作 | 停审并等待用户明确确认；确认后才读取 Step 08 SOP / 书写规范和本文件 §12 handoff，进入 Step 08 |
| 禁止动作 | 不进入 Step 08~19，不修改正式 `03`、任何 `04` 文件、实现代码或 implementation ledger |
| 是否需要提交 | 不需要；用户未要求提交 |

本轮不是在旧 Step 07 上做命名替换。旧文件约 2524 行，已有 repository、resolver、registration 等可审查材料，但其 application 与 entry 主轴早于 R06.6~R06.8 的 current owner，不能继续标记为 current。当前已按 Step 05 的七模块顺序完成 S07-A authority、S07-B assembler/façade、S07-C persistence ports、S07-D Job/outbox/external-effect ports、S07-E resolver/infra/runtime/entry contracts和S07-F跨模块闭环；Step 07已在design-only深度完成并停在Step 08前。

## 2. 实际读取与权威顺序

| 顺序 | 输入 | 本轮使用方式 | 低权威材料的限制 |
|---:|---|---|---|
| 1 | current 正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` | 固定 observation-owned truth、只读外部 truth、redaction-first、body-free linkage、no-write 和模块依赖方向 | 发现用法漂移时登记 affected/blocker，不以旧 Step 07 反向修改上游 |
| 2 | `详细设计讨论流程_SOP.md` Step 07、`详细设计书写规范.md` 5.5/5.6 | 固定按模块 capability -> trait -> Rust signature -> 停审 -> 跨模块审计 | 不允许只做全仓 trait 总表或省略读取/version/UoW 面 |
| 3 | current Step 05 模块契约 | 固定 `contracts/domain/application/infra/api/worker/jobs` 七模块及依赖方向 | Step 05 中 worker publication loop 属已登记 affected use，不覆盖 R06.8-B |
| 4 | Step 06 current owner cards与R06.8-A/B | 固定对象、字段、状态、helper、48 inputs、四 façade、UoW、Job、external effect、runtime/entry 唯一 owner | Step 07 只定义接缝，不重复定义 Step 06 object schema |
| 5 | L1-governance、L1-artifact Step 07 | 只参考模块停审、repository/version、fake parity、runtime seam 的落码粒度 | 不复制相邻域 truth、trait 名称或状态 |
| 6 | 冻结的旧 Step 07 | 仅作为 historical affected-use inventory | 任何与 R06.8 冲突的片段不得保留为 current |

Step 06 精确消费入口如下：

- `03_ddd_step_06_application_input_assembly_r06_8a.md` §§4~14：三个 assembler facet、48 concrete input 与 pure assembly 边界。
- `03_ddd_step_06_final_cross_module_gate_r06_8b.md` §§4~8、§15：四 façade、single publication Job、三个 finite runtime/activation 和十项 Step 07 handoff。
- `03_ddd_step_06_application_operation_context_idempotency.md` §§8~11：context、scope、reservation state 与 atomic incoming outcome。
- `03_ddd_step_06_application_record_uow_assembly.md` §§12~17：three-phase closure、one-cursor namespace、family-specific append、claim/CAS guard 与 unknown commit。
- `03_ddd_step_06_application_job_plan_claim_config.md` §§37、41~47：plan/item/claim/report relation、global work key、exact tuple、resume/no-relist。
- `03_ddd_step_06_application_stored_result_outbox.md` §§10、20~25：immutable stored result、outbox snapshot/state/record 与 transaction relation。
- `03_ddd_step_06_application_external_effect_intent_tokens.md` §25：intent/result repository、stable token/probe、outside-UoW external call。
- `03_ddd_step_06_application_report_error_service.md` §§12~18：唯一 `ApplicationError`、四类 result carrier；§19 仅为 historical five-façade checkpoint。
- `03_ddd_step_06_runtime_infra_entry_carriers_r06_7c.md` current C-01~C-15、registrar lifecycle与R06.8修正。

## 3. Current truth boundary

Step 07 的所有 trait 必须保持以下边界：

1. 本仓只持久化 observation receipt、safety/correlation/safe signal、audit/evidence linkage、handoff preparation、retention/no-write/gap/reference/maintenance coordination、append-only local record、stored result、immutable outbox snapshot和derived read model。
2. resolver 只返回 body-free safe summary、visibility、freshness、unresolved/unavailable 分类；不存在 external body fetch 或 source write port。
3. publication、handoff 和 export 的 stable token只证明本地 intent/snapshot 关系；不证明 external acceptance、business completion、evidence authenticity、验收结论或 exactly-once。
4. Query 不创建 idempotency reservation、UoW、refresh、repair、outbox 或 external effect。
5. Entry 只取得 matching assembler facet、matching façade和有限 technical registrar/activation seam；不得取得 repository、resolver、UoW、raw binding、裸 context factory或 canonicalizer。
6. 同一 `ConfigBindingRef` 只证明同一 validated recipe；API、worker、jobs 是三个独立进程局部 activation，不存在跨进程联合 activation transaction。

## 4. R06.8-B 十项 handoff 差异清单

| 顺序 | subject | canonical owner / required Step 07 use | 旧 Step 07 冲突 | 本步处置 |
|---:|---|---|---|---|
| 1 | input assembly traits | R06.8-A：`ObservationApiInputAssembler` 30 methods、`ObservationInboundInputAssembler` 9 methods、`ObservationJobInputAssembler` 9 methods | 裸 `ObservationOperationContextFactory` 注入 entry；未形成48个 exact method | 主产物完整列出三个 trait；factory/canonicalizer保持 `pub(crate)` concrete helper |
| 2 | service façade traits | R06.8-B：TruthWrite、Read、InboundEvent、OperationsJob四 façade | Maintenance + Publication形成第五入口面 | 删除旧 entry-visible maintenance/publication trait；publication只作为 crate-private collaborator |
| 3 | input/service signatures | 每个 service method按值消费 matching R06.8-A input | generic/representative input、Step 07重复定义 input | 列出全部48 method；只引用 Step 06 input owner，不重复字段 schema |
| 4 | idempotency repository | atomic reserve接收 scope、optional event identity和完整 candidate set | `reserve_or_load(context)` 单 digest；secondary insert滞后 | 定义一次原子调用与完整 outcome；禁止分步 check/insert |
| 5 | UoW/cursor | primary stage -> derive one namespace -> assign one cursor -> H11/records/followers -> dispatch | record-before-cursor、generic mint、consuming save、双 allocator | 定义 borrow-stage、family append、一次 allocator、commit guard、unknown outcome |
| 6 | Job plan/claim/report | D-2~D-6 exact refs、tagged subject/global key、claim tuple、report relation | `JobExecutionRef`、naked fence、plan-local uniqueness、report lookup by public run | exact repository reads/CAS/acquire-renew-release-expire-probe，public `JobRunId`只作correlation |
| 7 | publication ports | stable publication token + immutable snapshot；exact CAS/probe relation | worker candidate scan、mutable payload rebuild、raw adapter result | candidate只来自 immutable plan；publisher/probe和local marker分离 |
| 8 | runtime/activation | 三个 finite built runtime、三个 exact assignment、matching consuming activation | aggregate runtime、generic family、assignment getter、跨进程原子性 | 定义 `build_api/build_worker/build_jobs` 与三个 consuming activation seam |
| 9 | registrar lifecycle | finite catalog；prepare-all -> totality -> arm-all；失败 revoke/join | generic callback map、partial registration、schedule补造request | 保留有限 catalog；registrar为infra technical seam，不是application port |
| 10 | error owners | existing `ApplicationError`、C-15 runtime error和entry errors | Step 07重复 `ApplicationError`、raw provider error、message parsing/retry bool | trait只引用既有 owner；adapter error必须在边界映射为有限分类 |

## 5. 旧 Step 07 章节处置表

| 旧章节 | 可复用语义 | historical / 必须替换内容 | 新位置 |
|---|---|---|---|
| §§1~6 状态、问题、模块总览 | Step 07 SOP问题、application定义port/infra实现port | `done_plus_R2`、`closed_consumed_by_04`、五 façade/worker loop模块描述 | 新 §§1~5 |
| §7 shared helper | page/version/fence helper的需求、UoW/Clock/ID接缝 | Step 06 object重复定义、裸 context factory、generic history ref mint、旧UoW顺序 | application shared ports批次 |
| §8 service façade | 16/14/9 operation catalog的大部分名称 | maintenance/publication双 façade、generic context参数、非current Job result | application façade批次 |
| §9 repositories | domain对象族 repository 和 projection read需求 | consuming save、record-before-cursor、旧idempotency、旧outbox eligible scan、Job缺口 | persistence与coordination port批次 |
| §10 resolver/delivery | body-free resolver、publisher/delivery产品中立边界 | 缺intent/token/probe四分结果、publisher未绑定stable token | external adapter port批次 |
| §11 infra | fake/durable parity、adapter不得改domain语义 | 裸 context factory fake、worker publisher adapter topology | infra批次 |
| §12 entry / registration | finite handler catalog、opaque registered set、all-or-nothing registrar | old service bundles、worker publication loop、generic runtime | entry/runtime批次 |
| §§13~17 audit/handoff | 跨模块审计框架、Step 08承接 | 旧 pass 声明和已关闭门禁 | 最终审计批次 |

旧内容中的名称即使仍与 current 相同，也只能在其参数、返回、owner、调用方和状态关系全部通过 current owner 校验后重写；不执行整段复制。

## 6. 模块 affected inventory

| 模块 | 本 Step trait/port owner | 需要定义/审查 | 不允许出现 |
|---|---|---|---|
| `contracts` | 否 | 证明只提供 public carrier；Step 07不新增协议/schema | repository、adapter、runtime trait；为trait补造DTO |
| `domain` | 否 | 证明对象/policy/state不依赖port | repository调用、clock、external client、application反向依赖 |
| `application` | 是 | assembler、四 façade、repository/projection/UoW/idempotency/Job/external-effect/resolver port | concrete adapter、raw config、source writer、entry ack/scheduler |
| `infra` | application port实现方；technical runtime seam owner | adapter mapping、fake/durable parity、builder、registrar、activation handoff | 重定义domain state/application error、暴露locator/material、业务policy |
| `api` | 否 | API assignment/activation只消费30-method assembler + 2 façade | repository/UoW/context factory/canonicalizer/raw binding |
| `worker` | 否 | worker assignment/activation只消费9-method assembler + inbound façade + consumer registrar | publication façade、outbox loop、Job scheduling、repository |
| `jobs` | 否 | jobs assignment/activation只消费9-method assembler + unified Job façade + job registrar | maintenance/publication双 façade、补造Job request、direct adapter |

## 7. Step 07 写入批次

| 批次 | 内容 | 预计主产物范围 | 批内停审条件 | 状态 |
|---|---|---|---|---|
| S07-A | 状态、权威、historical诊断、`contracts`/`domain` no-port停审 | 主产物 §§1~6 | 七模块顺序明确；无全仓总表先行 | completed_design_only |
| S07-B | application input assembler与四 façade | 主产物 §§7.4~7.8 | 30/9/9 assembler、48 service methods、四 façade、无裸factory/第五 façade | completed_design_only |
| S07-C | application shared/UoW/idempotency/record/repository/projection | 主产物 §§7.9~7.22 | atomic reserve、borrow-stage、one cursor、7 repository / 12 append、least-authority Query、read fence与fake parity闭合 | completed_design_only |
| S07-D | Job plan/item/claim/report与outbox/external effect | 主产物 §§7.23~7.33 | exact tuple、global key、report fold、stable token/probe、phase-local accounting与no-call reuse | completed_design_only |
| S07-E | resolver、infra builder/adapter、finite runtime、registrar/activation、entry限制 | 主产物 §§7.34~12 | no aggregate runtime/partial registration/cross-process claim | completed_design_only_waiting_user |
| S07-F | 模块停审、跨模块审计、Step 08 handoff、flow/ledger同步 | 主产物 §13 | 十项handoff全closed-at-Step07；保留blocker不被伪关闭 | completed_design_only_waiting_user_before_Step08 |

每个批次写入主产物前必须回读对应 Step 06 owner。批次状态只记录在校准产物，不进入正式文档。

## 8. 保留 blocker 与 affected register

| ID | 当前状态 | Step 07 可做 | Step 07 不可做 |
|---|---|---|---|
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | `DefineReplayScope` port/flow入口明确禁止scope-only H13；只有per-target `CoordinateObservationReplay`可承接current H13 | 擅自选择“无记录”或创建新scope lifecycle record，或修改正式 `02` |
| `R06-F-AFFECT-UOW-01` | `step07_port_surface_closed_downstream_open` | S07-C~D 已闭合 borrow-stage、one cursor、H6 split、H12 append、typed dispatch、projection followers和item/report/outbox/external-effect guard顺序；继续把Step 09/11/13/16传播标为pending | 将其他 Step 未传播误报为全局closed |
| `03-RPR-S08-PER-PROTOCOL` | `open_controlled` | 为每个后续协议列出依赖port与missing-read gate | 提前写Step 08 DTO |
| `03-RPR-S09-PER-FLOW` | `open` | 为48 flow提供exact callable/read/write seam | 提前写逐flow算法或声称Step 09完成 |
| Step 05 worker publication use | `affected_by_R06.8-B` | 本 Step按R06.8-B current topology设计并登记Step 05后续回填 | 让旧Step 05反向恢复worker publication loop |

当前未发现新的外部上游 blocker。

## 9. 验证纪律

本 Step 只允许静态设计检查：method/count集合、owner/name扫描、Markdown fence/table、historical term隔离、diff hygiene和flow/ledger恢复点一致性。所有实现测试、adapter parity test、registration test、数据库测试、runtime activation和external probe均保持 `planned/not_run`。

不得创建或声称：实现 commit、真实 run id、真实 evidence alias、验收签署、external acceptance、已注册 handler、已激活 runtime、已发布 event或已通过测试。

## 10. Inventory stop review

| 检查项 | 结论 |
|---|---|
| Step 07 入口已获用户确认 | pass |
| 十项 R06.8-B handoff逐项登记 | pass |
| 旧 Step 07 全部章节有处置 | pass |
| 七模块顺序和每模块停审要求明确 | pass |
| 保留 blocker 未伪关闭 | pass |
| formal `03`、Step 08+、`04`和实现代码未修改 | pass |
| S07-A / S07-B 是否完成 | pass_design_only；authority、三个assembler、四façade与48 methods已闭合 |
| S07-C repository / append totality | pass_design_only；7个domain-family repository，H1~H6/H8~H13共12个typed append，H7为0 |
| S07-C least-authority / UoW / projection | pass_design_only；Query只取read facet，UoW为`Send + Sync`且one-cursor，capture/replace共享read fence |
| S07-D Job / report / outbox surface | pass_design_only；plan/item独立version、global item claim、lossless Draft fold、immutable outbox pair和publication attempt accounting已闭合 |
| S07-D external-effect surface | pass_design_only；四phase stable intent/link、phase-local attempt accounting、ExportDelivery local proof、global unresolved gate和no-call success reuse已闭合 |
| S07-E resolver / availability surface | pass_design_only；四个body-free resolver各一方法，`SafeResolution<T>`五分支，availability使用typed scope/state且不授权target |
| S07-E infra / runtime / entry surface | pass_design_only；两个handler、两个registrar、三个builder、三个四字段assignment、三个named runtime和三个matching activation已闭合 |
| S07-E static gate | pass；assembler/service=`30/9/9 + 16/14/9/9`，assignment字段totality、future ownership、dependency direction、historical aggregate隔离、Markdown fence/table均通过 |
| 本批是否发现新外部上游 blocker | no；仅保留既有H13局部冲突和下游传播项 |
| S07-F technical carrier repair | pass_design_only；transaction ref、14个repository page binding与14/6 projection ref codec具备validated cross-crate surface；cursor固定一次性binary envelope、唯一digest owner、14组有限position codec、receipt/rollup复合序与fake/durable parity，projection set固定bound/empty follower规则；private fields和truth redline保持 |
| S07-F SOP / module closure | pass_design_only；11/11问题回答，7/7模块最终停审 |
| S07-F R06.8-B handoff | pass_design_only；10/10在Step07 definition/use深度关闭，下游传播状态独立保留 |
| S07-F Step 08 handoff | pass inventory；16 Command + 14 Query + 9 Consumer + 12 Outbound Event + 9 Job = 60，正文未修改 |
| 下一动作 | 停审并等待用户确认；不得自动进入Step 08 |

## 11. S07-F 输入消费记录

用户已明确确认并完成以下 S07-F 读取：

1. `standards/document/详细设计讨论流程_SOP.md` Step 07、`详细设计书写规范.md` 5.5/5.6 与 truth-source标准，重新执行模块停审和跨模块闭环问题。
2. 本文件 §§4、6、8、10，以及主产物 §§1~12；逐模块核对 capability、callable、implementation、error、lifecycle、fake/durable parity 和 forbidden surface。
3. `03_ddd_step_05_module_contracts.md` 七模块 current owner，以及 `03_ddd_step_06_final_cross_module_gate_r06_8b.md` §15 的十项 exact handoff；逐项给出 closed-at-Step07 或仍受控的下游状态。
4. Step 06 的 UoW、Job/outbox/external effect、resolver/runtime/entry current owner专项；检查 definition/use、field/method totality、同次构建和 process-local rollback 不被后置摘要削弱。
5. 冻结 `03_ddd_step_08_protocol_contracts.md` 只作为 historical affected-use inventory，登记每类协议下一步必须消费的 exact assembler/façade/port；不得把旧 DTO 或旧 mapping 当作 authority。

S07-F 只完成了 Step 07 closure 和 Step 08 handoff；没有补协议 DTO、进入 Step 08、修改正式 `03`、任何 `04` 文件或实现代码。

## 12. Step 08 恢复 handoff

| 项 | Current handoff |
|---|---|
| Step 07结果 | `pass_design_only`；主产物 §13完成7模块、11问、10 handoff和cross-module审计 |
| protocol inventory | 16 Command、14 Query、9 Inbound Event Consumer、12 Outbound Event、9 Operations Job，共60 |
| 必须替换的冻结use | naked context factory、maintenance/publication façade、worker publication scheduler、`JobExecutionRef`、`ReferenceSnapshotRef`、`PeripheralConsumerScopeRef`、historical `PageInfo/Page<T>`和旧outbound publication path |
| page handoff | public page request/info/page留Step08；application-local mapping只使用主产物§7.9 exact binding/page/result surface |
| Job handoff | public correlation=`JobRunId`；local identity=`ObservationJobExecutionRef`；9 Job统一进入`ObservationOperationsJobService` |
| truth boundary | protocol只暴露观测/审计投影、body-free linkage、retention/handoff/coordination surface；不得声明业务truth、external acceptance或验收签署 |
| 保留 blocker | `R06.6-F2-H13-UPSTREAM`;`R06-F-AFFECT-UOW-01` downstream;`03-RPR-S08-PER-PROTOCOL`;`03-RPR-S09-PER-FLOW`;two `R07-EXTERNAL-*` downstream |
| 下一读取 | 只有用户明确确认后，读取Step08对应SOP、书写规范、current Step06/07 handoff和冻结Step08全文 |
| 禁止 | 未确认不得进入Step08；不得修改formal `03`、任何`04`文件或实现材料 |

当前恢复点为 `Step07_S07-F_complete_waiting_user_before_Step08`；当前不需要提交。
