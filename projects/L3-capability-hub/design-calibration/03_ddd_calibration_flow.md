# L3-capability-hub 03 详细设计校准工作台

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档: `projects/L3-capability-hub/03-详细设计.md`
> 创建日期: 2026-07-09
> 当前模式: full-restart
> 当前状态: `03_completed_design_task_wait_implementation_handoff`;正式`03-详细设计.md`已重建并通过静态装配审计

---

## 1. 本轮目标

按详细设计 SOP 将新版 `00-需求文档.md`、`01-架构设计.md` 和 `02-概要设计.md` 转译成可以 1:1 实现的 `03-详细设计.md`。

现有 `projects/L3-capability-hub/03-详细设计.md` 是 2026-05-17 旧草稿,仍以 `ProviderContract`、`CapabilityDecision`、`CostRecord`、`QueryCapabilities`、KMS / Vault、policy refresh、runtime / tools access decision、provider route / quota / cost / audit 为主线。该旧文档与新版 `02-概要设计.md` 的 capability access truth、capability identity、registry、adapter descriptor、governance seam relation、method body-free relation、formal exposure、controlled consumer view、trace / impact、derived material 和 external reference support 主线冲突,只能作为 historical material 和污染审计输入。

正式详细设计必须由本轮 `03_ddd_step_*` 中间产物逐步装配,不得从旧 `03` 直接继承未重新校准的对象、接口、流程、状态、配置、测试、证据或实施边界。

---

## 2. 权威输入

| 输入 | 权威级别 | 用途 | 使用边界 |
|---|---|---|---|
| `projects/L3-capability-hub/00-需求文档.md` | 正式上游 | 仓定位、需求边界、业务规则、数据归属、验收红线 | 不在 `03` 中重新定义需求目标、用户故事、功能需求或验收标准。 |
| `projects/L3-capability-hub/01-架构设计.md` | 正式上游 | 系统边界、职责边界、依赖方向、数据所有权、一致性、通信方式和技术机制边界 | 不在 `03` 中重写架构方案、限界上下文、运行承载或跨仓依赖裁剪。 |
| `projects/L3-capability-hub/02-概要设计.md` | 直接输入 | 代码主体框架、8 个主要组成部分、43 个关键对象、接口骨架、处理流、状态机、异常和配置影响轮廓 | `03` 所有对象、协议、flow 和 state 必须回指新版 `02`;若需要改主语,必须回退到 `02` 对应 Step。 |
| `projects/L3-capability-hub/design-calibration/02_hld_*` | 解释性输入 | 理解概要设计结论来源、旧材料隔离和详细设计承接清单 | 若与正式 `02` 冲突,以正式 `02` 为准;若正式 `02` 摘要不足,读取对应 Step。 |
| `projects/L3-capability-hub/03-详细设计.md` | 旧草稿 / 问题诊断输入 | 识别旧主线残留和禁入项 | 不作为新版详细设计真相源;旧事实必须经新版 `00/01/02` 或本轮 Step 重新进入。 |
| `projects/L1-governance/design-calibration/03_ddd_*` | 参考结构 | 参考 03 flow、Step 1 粒度、旧材料隔离、回填草稿和停审表达 | 只参考结构和深度,不得复制 governance 领域语义。 |
| `projects/L1-artifact/design-calibration/*` | 粒度参考 | 后续重 Step 可参考其可落码粒度和边界拆分方式 | 不改变 capability-hub 的业务主语。 |

---

## 3. Step 状态表

| Step | 主题 | 中间产物 | 状态 |
|---|---|---|---|
| Step 1 | 确认概要设计输入边界 | `03_ddd_step_01_upstream_boundary.md` | [x] 已完成 |
| Step 2 | 明确本轮实现范围和非范围 | `03_ddd_step_02_scope.md` | [x] 已完成 |
| Step 3 | 收稳编码规范、语言 / runtime、仓库约束 | `03_ddd_step_03_constraints.md` | [x] 已完成 |
| Step 4 | 收稳实现单元与文件布局 | `03_ddd_step_04_file_layout.md` | [x] 已完成并被Step 5承接；batch `9.9`移除旧application-outbox措辞,固定worker exact capture-ref continuation；batch `14.3`受控补入既有`infra/read_visibility.rs` owner |
| Step 5 | 定义模块实现契约主轴 | `03_ddd_step_05_module_contracts.md` | [x] 已完成并被Step 6承接；batch `9.9`固定worker只调用application collaboration facade,entry不持有repository/publisher adapter；batch `14.3`同步read visibility adapter职责 |
| Step 6 | 逐模块定义对象实现契约 | `03_ddd_step_06_object_contracts.md` | [x] 已完成并经Step 8 / Step 9 / Step 10 / Step 12 / Step 13受控回开；Step 13收紧closed operation、three-variant normalized key、四类`[u8; 32]`digest和两态idempotency record，删除无owner conflict reason；43个HLD objects + 7个application technical helpers不变，Rustdoc完整 |
| Step 7 | 逐模块定义 Trait / Port / Adapter 契约 | `03_ddd_step_07_trait_port_adapter_contracts.md` | [x] 已完成并经Step 13/14.2/14.5.2.2.3受控同步；33/33 async Port / repository trait固定`async-trait 0.1.89`、`Send`future、no `?Send`；当前36个Port、22 repository traits / 110 methods不变 |
| Step 8 | 定义 API / Command / Query / Event / Job 协议契约 | `03_ddd_step_08_protocol_contracts.md` | [x] 已完成并经Step 13/14.5.2.2.3受控回开；23/23 async handler/service trait固定attribute，Job metadata新增六字段response-validation copy；public wire type/DTO field/protocol/Port增量0，helper callable净`+1`，250 public types、83 protocols不变 |
| Step 9 | 定义逐接口函数级处理流 | `03_ddd_step_09_function_flows.md` | [x] 已完成并经Step 13受控同步；83 / 83 flow不变，shared guards调用canonical encoder，八条Job reserve-race改为rollback + discard plan + one exact winner read，递归入口为0 |
| Step 10 | 定义状态机与转换矩阵 | `03_ddd_step_10_state_matrix.md` | [x] 已完成并经Step 13受控回开；`CapabilityIdempotencyState`仅`Reserved / Completed`，当前24个state-like enum / 111 active variants，`638 = 239 current + 98 reserved + 301 illegal`，unclassified=0 |
| Step 11 | 定义持久化、事务与一致性契约 | `03_ddd_step_11_persistence_transaction_consistency.md` | [x] 已完成并经Step 13受控同步；22 traits / 110 methods不变，Command / Inbound committed orphan `Reserved`为consistency defect，Job仅`Reserved + matching Planned journal`可恢复 |
| Step 12 | 定义错误模型、异常分支与恢复口径 | `03_ddd_step_12_error_recovery.md` | [x] 已完成并经Step 13/14.2受控同步；三态resolution继续映射既有`CommitOutcomeUnknown`；17 errors、51 issue codes、83 / 83 mapping不变 |
| Step 13 | 定义并发、幂等与重入保护 | `03_ddd_step_13_concurrency_idempotency.md` | [x] 已完成并经14.2受控同步；exact read + `resolve_commit` + barrier recovery固定；原`CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001`按用户授权依赖假设解除，L0-core同步仍为非阻塞债务 |
| Step 14 | 定义配置引用与外部依赖绑定 | `03_ddd_step_14_config_external_binding.md` | [x] 已完成；batch `14.0~14.6`已完成并停审；cross-step/historical/Rustdoc审计、`04`逐Step handoff、配置/依赖/owner/profile/failure归零、正式§13 canonical assembly source和Step 15 handoff已闭合 |
| Step 15 | 定义可观测性与审计埋点契约 | `03_ddd_step_15_observability_audit.md` | [x] 已完成；`R15.1~R15.16`闭合四plane owner、phase、83 flow、17 error、51 issue、155 profile + 3 event、redaction、zero-surface、historical排除与backend controlled-reopen；正式§14 `14.1~14.7` canonical source map已固定 |
| Step 16 | 定义测试切口与最小验证清单 | `03_ddd_step_16_test_cuts.md` | [x] 已完成；7 module、83 exact flow、24 state family、22 transaction/concurrency、12 binding、12 observability cut及planned script contract已闭合；不声称执行结果 |
| Step 17 | 收口详细设计到实施计划的承接清单 | `03_ddd_step_17_implementation_handoff.md` | [x] 已完成；16/16 source、7 workspace unit、9 capability cut、mandatory preread、field/DTO/Query/state/phase closure和formal§16 source已闭合；目标仓为实施prerequisite，不是上游blocker |
| Step 18 | 风险与待确认事项 | `03_ddd_step_18_risks_open_questions.md` | [x] 已完成；11/11 active事项按六类闭集分类，owner/trigger/blocking scope/interim action/reopen target完整；两项L0-core debt保持non-blocking，目标仓为implementation prerequisite，unresolved upstream blocker=0 |
| Step 19 | 整理正式详细设计文档 | `03_ddd_step_19_formal_document_assembly.md` | [x] 已完成；18个唯一主章、83个协议ID、24/111/638状态与关键库存均通过静态装配审计 |

---

## 4. 当前恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|
| Step 19 `整理正式详细设计文档` | completed | `design_task_completed` | 正式`03`已从Step 1~18 canonical source重建；18主章、83协议、24/111/638状态、27行配置与Rustdoc/责任/真实性门禁审计通过；后续 `04~07`、T070/T071/T072 已完成。 | `wait_for_authorized_implementation_handoff` | `project_execution_ledger.md`;正式 `03~07`;`T071_full_restart_final_audit.md` |

---

## 5. 执行纪律

- 每个 Step 独立生成中间产物,不得合并 Step。
- 每个 Step 完成后更新本工作台、`project_execution_ledger.md`和`/tmp`任务清单；依据用户2026-07-25连续执行授权直接进入下一任务。
- 正式 `03-详细设计.md` 必须在 Step 19 由已完成的 Step 中间产物装配,不得直接从旧文档修补。
- 每个正式章节必须引用具体 `design-calibration/03_ddd_step_*.md` 校准来源。
- 对象契约、协议契约、处理流、状态机、持久化、错误、幂等、配置绑定、审计埋点和测试切口必须执行 `设计真相源闭环与可落码性标准.md`。
- Step 5 以后必须达到可落码粒度:模块、对象、trait / port / adapter、DTO / schema、函数级 flow、状态矩阵、事务、一致性、错误恢复和测试切口不得停留在摘要。
- 所有Rust public struct / enum、struct field、enum variant及variant field必须逐项提供英文`///` Rustdoc;enum struct variant内不得出现field-level `pub`。该门禁同时适用于后续Query、Inbound Event、Outbound Event和Job schema。
- Step 19装配完成前,现有正式`03`是historical material,与当前校准Step冲突时不得采用；Step 19装配完成后,新版正式`03`才成为正式基线。若新版正式章节摘要不足以明确字段、schema或处理规则,必须读取其列出的校准来源；仍不清楚时回Step 19修正文档,不得交给实现者自行选边。
- 旧 `03-详细设计.md` 中仍适用的事实必须通过新版 `00/01/02` 或本轮 Step 中间产物重新进入,不得直接继承。
- 本轮不得伪造实现 commit、run_id、验收签署、真实 evidence alias、测试结果或 implementation ledger。
- `implementation ledger` 和 planned boundary skeleton 只允许在 `07-实施计划.md` 完成时同步创建,不得提前在 `03` 创建。

---

## 6. 历史材料隔离

| 历史材料 | 当前问题 | 本轮处理 |
|---|---|---|
| 旧 `ProviderContract` | 混入 provider secret、quota、route、cost、failover 和 provider runtime。 | 不继承;由 `AdapterDescriptor`、`DescriptorRiskConstraintSummary`、`SecretRef` 和 `SecretHandlingSafeSummary` 分层替代。 |
| 旧 `CapabilityDecision` / allow-deny | 混写 governance decision、runtime enforcement 和本仓 formal exposure。 | 不继承;由 `GovernanceSeamRelation`、`FormalExposureBoundary`、`ControlledConsumerView` 和 degraded surface 分层替代。 |
| 旧 `QueryCapabilities` | 混合 formal exposure truth、runtime 高频查询、consumer cache、allow / deny 和 SDK view。 | 不继承;拆到 formal exposure Command、controlled consumer view Query、consumer view refresh Job 和 outbound event candidate。 |
| 旧 `CostRecord` / billing | cost ledger 不归 capability-hub。 | 不进入当前 `03` 基线;如后续出现只能作为外部 ref / handoff 边界。 |
| 旧 KMS / Vault / secret store | secret 平台和 secret 正文不归 capability-hub。 | 只保留 secret ref 与 safe summary;具体 secret 平台后移边界外 / `04` 绑定。 |
| 旧 policy refresh / governance policy truth | governance approval、Policy truth 和 shared_rules truth 不归 capability-hub。 | 只承接 governance result ref、policy result ref、safe summary 和 seam relation。 |
| 旧 runtime / tools execution gateway | execution 和 tools result 不归 capability-hub。 | 不进入 `03` 对象、接口或 flow;只保留 consumer ref / controlled view / handoff。 |
| 旧 marketplace listing / metadata | marketplace listing、transaction、pricing、fulfillment 不归 capability-hub。 | 不进入 `03` 核心;只可作为 read-only ecosystem discovery 的边界外消费线索。 |
| 旧 outbox relay / retry 实现 | 新版概要只收稳 event candidate、handoff 和 failure surface,未定义具体 outbox 产品或 relay 实现。 | 不继承旧产品、topic、attempt log或retry配置。Step 8 batch `8.5`只按reopen gate新增application-owned immutable payload snapshot、versioned capture和capture repository以关闭pre-intent恢复窗口;external delivery状态仍由collaboration port拥有,外部协作失败不得回滚本地truth。 |

---

## 7. 下一步门禁

Step 13 batch `13.0~13.5`已按用户显式授权完成，active baseline仍为43个HLD objects + 7个application helpers、36 Ports、22 / 110 repository traits / methods、250 public protocol types、83 protocols / flows、24个state-like enum / 111 active variants和`638 = 239 current + 98 reserved + 301 illegal`ordered pairs。原accessor blocker保留历史诊断，但Capability Hub已精确采用`IdempotencyKey::as_str().as_bytes()`原始UTF-8字节假设；L0-core正式设计同步是非阻塞债务，签名或字节语义变化会回开Step 13。

Step 14 batch `14.0~14.6`已完成并停审。`14.3`闭合27/27 local/base Port、110/110 repository methods和single authority；`14.4.1~14.4.4`闭合9/9 external Port与14/14 callable、6/6 Inbound、10/10 Outbound和8/8 Operations Job；`14.5.0~14.5.3`闭合唯一`core-contracts` sibling path、七member Cargo matrix、Stage 0~7、API/Worker/Jobs cycle-free composition、cross-entry complete predicate、四类依赖裁剪和Configured/DeterministicFake/Disabled/Missing parity。`14.5.4`完成Step 3~13 closure、旧材料隔离、全部结构/字段/variant/trait/callable英文`///`门禁、`04` Step 1~15 handoff、配置/依赖/owner/profile/failure surface归零和正式§13 `13.1~13.12` canonical assembly index；`14.6`完成SOP八问最终Evidence Matrix、27行配置引用表、33行外部依赖绑定表、canonical跨仓Rust依赖表、正式§13 assembly source、Step 15 redaction handoff及完成门禁。未分类项与unresolved upstream blocker均为0，两项L0-core design-sync仍为非阻塞debt。正式`03`仍未修改，`04`、implementation ledger和planned boundary skeleton均未创建或修改。

Step 15 `R15.1~R15.16`已完成。R15.16裁决`CC-01..CC-10=10/10`，最终反查83/83 flow、17/17 error、51/51 issue、155/155 profile + 3/3 event均无missing/extra/duplicate/source delta，10个高风险zero-surface与historical排除闭合；正式§14 `14.1~14.7` canonical source map和private backend-neutral instrumentation controlled-reopen gate已经固定。当前不新增业务Port/object/state，concrete backend仍须受控回开Step 14/15及正式04。unresolved upstream blocker=`0`，两项L0-core design-sync debt仍为non-blocking。用户已授权连续执行剩余任务，当前进入Step 16。

Step 16已完成。`03_ddd_step_16_test_cuts.md`按7 module、43+7 object/helper、250 public type、36 Port、22/110 repository、83 exact flow、24/111 state、638 pair、17/51 error/issue、27+9 binding与155+3 observability基线定义最小test cut；机械核对`26/33/6/10/8`与24 state cut均完整。本文只定义未来测试义务和planned scripts，不声称执行、run、artifact、evidence或签署。当前连续进入Step 17。

Step 17已完成。`03_ddd_step_17_implementation_handoff.md`映射Step 1~16全部source，固定7个workspace implementation unit、9个capability cut、mandatory preread、target-repo/git gate、field/DTO/Query/state/phase预审、controlled reopen和formal§16 source。目标实现仓当前不存在，准确分类为formal 07/实施开工 prerequisite；不是当前upstream design blocker。implementation ledger与boundary skeleton仍未提前创建。当前连续进入Step 18。

Step 18已完成。`03_ddd_step_18_risks_open_questions.md`将11/11 active事项完整归入`resolved / non_blocking_debt / implementation_prerequisite / controlled_reopen / downstream_work / out_of_scope`闭集，逐项固定owner、trigger、blocking scope、interim action与reopen/handoff target；两项L0-core design-sync debt保持non-blocking，目标仓缺失准确保留为implementation prerequisite，具体config/product/observability binding和formal 04/05/06/07均按owner后移。historical resolved blocker未重新激活，unresolved upstream blocker=`0`。当前连续进入Step 19。

当前 next_allowed_action:

```text
initialize_04_config_calibration_flow
```
## Final closure overlay

T072 已关闭本轮设计任务。本文前部的 Step 状态、历史恢复点和文档切换记录保留原始讨论轨迹；当前项目级恢复入口以 `project_execution_ledger.md` 和 `T071_full_restart_final_audit.md` 为准。

| field | value |
|---|---|
| formal_document | `03-详细设计.md` |
| document_status | `detailed design completed` |
| current_step | `Step 19 completed` |
| final_audit | `design-calibration/T071_full_restart_final_audit.md` |
| unresolved_upstream_design_blocker | `0` |
| implementation_status | `pre_implementation_blocked` |
| implementation_current_boundary | `commit-01-a` |
| implementation_next_allowed_action | `wait_design` |
| commit_required | `no` |

不得依据本文历史段落中的旧 `next_allowed_action` 重新进入已完成 Step。有效的下一动作是 `wait_for_authorized_implementation_handoff`；目标实现仓、immutable baseline、实现代码、测试 run、evidence instance、verdict、signoff 和 commit 均不存在。
