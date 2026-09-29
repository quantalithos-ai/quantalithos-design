# L4-archive 03 详细设计校准流程

> 创建日期：2026-09-10；最近补完复核：2026-09-12；模式：`full-restart / single-agent-serial`。
> 最新授权：用户明确“现在完成全部 03”，连续授权完成 03 Step 12～19 并重建正式 `03-详细设计.md`；不包含 04。
> 当前恢复点：Step 19 已完成；Step 1～19 与正式 03 已完成并停审，等待用户审查和正式 04 的明确授权。

> 本轮：完成 Step 19 十八章装配、historical pollution 排除、分母与 source-authority / owner / dependency / consistency 交叉审计；完成后立即停审，不进入 04。

## 1. 输入与执行纪律

直接输入为本仓已停审的 [正式 00](../00-需求文档.md)、[正式 01](../01-架构设计.md)、[正式 02](../02-概要设计.md)及其校准链；[项目台账](project_execution_ledger.md)是跨文档恢复入口。旧 `README.md`、旧正式 `03-详细设计.md`、`05/06` 与 `draft/` 只作为 `historical_material` 或污染审计输入。

执行依据：`standards/document/详细设计讨论流程_SOP.md`、`详细设计书写规范.md`、`设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`、`全局项目依赖关系与裁剪规则.md`、`子项目目录与代码文件组织规范.md`；编码依据 `standards/coding/rust.md`；未来实施提交依据 `projects/README.md` §8.2。以上路径均相对设计仓根。

- 每个 Step 独立保留状态、输入、SOP 回答、问题诊断、前后对比、取舍、结构化产物、回填草稿、待确认和下一步条件。
- 每个 Step 先更新当步产物，再同步本文与项目台账；未执行的后续 Step 只登记流程，不提前创建文件。
- 本轮只修改 `projects/L4-archive/`；不写实现、不执行项目测试、不提交，不回写 owning project。
- Step 1～11 已完成并停审；本轮连续授权 Step 12～19，但仍须逐 Step 串行形成中间产物、同步台账并完成内部门禁；正式 03 仅在 Step 19 装配。
- Step 05～Step 10 的范围授权只确定候选推进区间，不替代逐 Step 审查门禁；每次只能执行用户审查后明确放行的下一 Step。
- 外部合同、算法、provider、配置值或目标仓事实未知时保留 pending/blocked，并保持 fail-closed。

## 2. 总流程计划与状态台账

| Step | 讨论内容 / 产物 | 正式回填位置 | 状态 / 门禁 | 下一动作 |
|---|---|---|---|---|
| 1 | `03_ddd_step_01_upstream_boundary.md`：概要输入与缺口 | §1/17 | completed / pass_with_upstream_blockers | 允许 Step 2 |
| 2 | `03_ddd_step_02_scope.md`：实现范围与非范围 | §2 | completed / pass_with_upstream_blockers | 允许 Step 3 |
| 3 | `03_ddd_step_03_coding_runtime_constraints.md`：编码、runtime、仓库约束 | §3/16 | completed / pass_with_upstream_blockers | 允许 Step 4 |
| 4 | `03_ddd_step_04_units_file_layout.md`：实现单元与文件布局 | §4 | completed / pass_with_upstream_blockers | 已获准 Step 5 |
| 5 | `03_ddd_step_05_module_contracts.md`：模块实现契约主轴 | §5 | completed / pass_with_upstream_blockers | 已获准 Step 6 |
| 6 | `03_ddd_step_06_object_contracts.md`：逐模块对象实现契约 | §5/6 | completed / pass_with_upstream_blockers | 用户已明确授权 Step 7 |
| 7 | `03_ddd_step_07_trait_port_adapter_contracts.md`：Trait / Port / Adapter 契约 | §5/6 | completed / pass_with_upstream_blockers / stop_review | 等用户审查与 Step 8 明确授权 |
| 8 | `03_ddd_step_08_protocol_contracts.md`：协议契约 | §7 | completed / pass_with_upstream_blockers / stop_review | 等用户审查并明确授权 Step 9 |
| 9 | 逐接口函数级处理流 | §8 | completed / pass_with_upstream_blockers / stop_review | 已完成并停审 |
| 10 | 状态机与转换矩阵 | §9 | completed / pass_with_upstream_blockers / stop_review | 等用户审查并明确授权 Step 11 |
| 11 | `03_ddd_step_11_persistence_transaction_consistency.md`：持久化、事务与一致性 | §10 | completed / pass_with_upstream_blockers / stop_review | 等用户审查并明确授权 Step 12 |
| 12 | `03_ddd_step_12_error_recovery.md`：错误、异常与恢复 | §11 | completed / pass_with_upstream_blockers | 按连续授权允许 Step 13 |
| 13 | `03_ddd_step_13_concurrency_idempotency.md`：并发、幂等与重入 | §12 | completed / pass_with_local_pending_and_upstream_blockers | 按连续授权允许 Step 14 |
| 14 | `03_ddd_step_14_config_external_binding.md`：配置引用与外部绑定 | §13 | completed / pass_with_local_pending_and_upstream_blockers | 按连续授权允许 Step 15 |
| 15 | `03_ddd_step_15_observability_audit.md`：可观测性与审计 | §14 | completed / pass_with_observability_boundary_and_upstream_blockers | 按连续授权允许 Step 16 |
| 16 | `03_ddd_step_16_test_cuts.md`：测试切口 | §15 | completed / pass_at_design_with_blocked_positive_integrations | 按连续授权允许 Step 17 |
| 17 | `03_ddd_step_17_implementation_handoff.md`：实施计划承接 | §16 | completed / pass_as_design_handoff_not_implementation_ready | 按连续授权允许 Step 18 |
| 18 | `03_ddd_step_18_risks_open_questions.md`：风险与待确认 | §17 | completed / pass_with_explicit_external_blockers_and_local_pending | 按连续授权允许 Step 19 |
| 19 | `03_ddd_step_19_formal_document_assembly.md`：正式文档装配 | §1~18 | completed / formal_stop_review | 等待用户审查与正式 04 明确授权 |

文档级状态：`formal / stop_review`；`formal_03_write_allowed = false_except_review_fixes`。旧正式 03 已登记为 historical material；当前正文是正式停审入口，但不构成实现、测试、验收或 readiness 事实。

## 3. 专题输入与依赖裁剪登记

| 输入 | 本轮用途 | 裁剪结论 |
|---|---|---|
| 本仓正式 00/01/02 与 02 Step 12/14 | 本地责任、六 CP、26 对象、30 入口、状态/异常/配置上限 | 03 的唯一直接业务基线 |
| `L1-workspace` 正式 00~07、ledger、03 Step 1~4 | 强串行前置与详细设计粒度样本 | workspace projection 永远只是 Auxiliary；不复制领域主语 |
| L1 identity/conversation/work/process/governance/artifact 当前正式文档 | canonical owner、governance、artifact/ref、restore receiver 边界 | runtime/event/ref/adapter；不形成 sibling compile 依赖 |
| `L4-observability` 当前正式文档 | audit/evidence material 与后端边界 | runtime/event/ref/adapter；不拥有审计链后端 |
| `L0-core` 正式 02/03 与真实 `crates/contracts` | 核验共享 metadata/ref/value 候选及真实 crate 路径 | compile candidate；逐 symbol 核验后方可使用 |
| `L0-bus` 当前正式文档 | inbound event 与可能的 outbound 接缝 | event/adapter；不等 delivery truth |
| `L0-sdk` 当前正式文档 | 下游 client 边界与方向冲突 | 不进入 Archive compile graph；保留 `AR-ARCH-001` |
| 旧 README/03/05/06/draft | 后置污染审计 | 不作为正式 truth 或实现事实 |

## 4. 当前事实观察

| 观察 | 结论 / 上限 |
|---|---|
| `/home/aris/Projects/quantalithos-archive` | 2026-09-10 只读检查时不存在；Step 4 只能给计划布局，不得声称已有仓、Cargo workspace 或 baseline。 |
| `/home/aris/Projects/quantalithos-core` | 存在；真实 workspace 含 `crates/contracts`，package=`core-contracts`、crate=`core_contracts`、edition=2024、rust-version=1.93。 |
| Core 共享类型 | `ActorContext`、`ActorRef`、`CommandMetadata`、`QueryMetadata`、`IdempotencyKey`、`Timestamp` 等存在并导出；是否逐一适合 Archive 仍须后续按字段语义核验。 |
| Rust 源码语言 | 当前 `standards/coding/rust.md` 要求标识符和源码注释（含 rustdoc）使用英文；与详细设计 SOP 的中文 Rustdoc 旧句冲突时采用更具体、更新的编码规范，并登记冲突。 |
| 实现技术 | 正式架构只固定同步入口、后台执行、异步消费和 port-adapter 机制；Step 3 已独立收稳 planned Rust 2024/MSRV 1.93 与 Tokio I/O runtime，framework/provider 仍未固定，未从旧 README 继承。 |

## 5. 持续 blocker 与完成上限

持续开放 `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`。它们不阻止本地范围、约束与计划布局收敛，但阻止受影响 adapter、outbound publisher、provider wiring 和正向集成被标为 ready。

Step 1～19 与正式 03 已完成并停审。不得据此声称实现仓存在、代码可编译、真实 Bundle/digest/signature/material/storage commit/handoff 成功、测试通过或 readiness。

## 6. 恢复顺序

```text
1. 读取 project_execution_ledger.md
2. 读取本文件
3. 读取当前 Step 文件和前一 Step 文件
4. 复核详细设计 SOP / 书写规范与当前 Step 专项规范
5. 反查正式 00/01/02 和受影响上游
6. 确认 current_step、gate_status、next_allowed_action 和 blocker
7. 才能继续写入
```

## 7. 当前门禁

```text
formal_00_status = formal / stop_review
formal_01_status = formal / stop_review
formal_02_status = formal / stop_review
formal_03_status = formal / stop_review
ddd_current_step = 19_completed_formal_stop_review
ddd_next_allowed_action = wait_for_user_review_and_explicit_04_authorization
ddd_authorized_through = step_19_and_formal_03_completion
formal_03_write_allowed = false_except_review_fixes
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 8. Step 1～6 停审记录

2026-09-10：按 Step 1 → 2 → 3 → 4 串行完成上游边界、范围、编码/runtime/仓库约束和实现单元/文件布局校准。最终选择六个技术 role 的 planned Rust workspace：`contracts`、`domain`、`application`、`infra`、`api`、`worker`；26 个正式对象、30 个正式入口和 7 类 required/local ports 均有唯一职责落点。

### 8.1 Step 1～4

目标实现仓仍不存在；截至 Step 4 未创建源码、Cargo manifest、测试、脚本或 evidence，未修改旧正式 03。

### 8.2 Step 5（2026-09-10）

按 `L1-governance` 的架构组织与详细设计粒度参考，收稳六个技术模块的职责、暴露面和精确 direct dependency；完成 6 CP、26 对象、8 service、30 入口、7 port family 及 adapter/store/handler 唯一归属审计。反查修正 Step 4：`DeclaredArchiveScope` 与 `GovernanceDecisionRef` 因跨 public protocol/domain 共用而定义在 contracts，其余 24 个对象定义在 domain；正式对象分母和语义不变，消除了 contracts 反向依赖 domain 或复制 shadow type 的风险。

本 Step 未创建源码、Cargo manifest、测试、脚本、artifact 或 evidence，未修改 historical 正式 03，未创建 Step 6 文件。`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 全部继续开放；无新增 owning-project blocker。下一步必须等待用户审查并明确授权 Step 6。

### 8.3 Step 6（2026-09-10）

按 contracts shared vocabulary → 2 个 contracts 正式对象与五类 safe view → domain CP1～CP6 三批共 24 个对象 → application 八 service 与稳定 carrier → infra/api/worker 最小稳定对象 → 跨模块总审计的顺序完成。正式对象分母保持 `2 contracts + (7 + 8 + 9) domain = 26`；application/infra/api/worker helper 不计入业务正式对象分母。

本 Step 已闭合每组 capability 到对象、字段、factory、成员函数、状态与不变量，以及 high-reuse 字段来源、source-authority、依赖方向、entry disposition、worker claim/fence/checkpoint 和 Step 7 承接清单。修正了重复 helper 声明、双重 optional evidence 命名和 lifecycle/restore compensation 主语混用。provider/config/backend/transport/schedule、port trait、完整 DTO、函数流、事务与算法继续按职责 defer 并保持 fail-closed。

截至 Step06 当时，本 Step 未写源码、未执行测试、未修改 historical 正式 03、未创建 Step 7 文件、未提交。随后 Step07 已获新授权并完成；当时的 blocker 记录仍全部适用。

### 8.4 Step 6 补完复核（2026-09-11）

复核修正了引用无法支持语义 guard、部分失败/阻塞依据无持久落点、manifest 集合与 contracts 依赖反向、safe summary 可选性、非 core 签名和 runtime required slot 可变等本地缺口。Step 文件 §14.9 记录详细前后对比、来源责任和后续承接。

- Bundle seal 读取明确对象并保存 exact seal_basis；assembly_origin 防止旧 closure 解阻；manifest freeze 重评 exact sets。
- source feedback correlation 与 coverage 分离，Stale/Conflicting/Unknown 可以如实保存，不当 Complete；restore 按 exact owner/receiver/material handoff。
- action/placement/lifecycle/item/handoff/compensation 的依据与历史明确保存；Plan Failed 有显式 plan-level basis；ACK/commit/unknown 不混用。
- 10 类 safe summary 和五 view、八 service、infra/api/worker 的 typed factory/成员补全；Store/Adapter 引用区分；required_slots 冻结，expiry 独立类型。
- 文档自检核对 `2+24=26` 对象、8 service、30 逻辑入口/32 方法面、73 enum/369 variant；围栏、表格列数、尾空白和重复类型声明检查通过。这是文档检查，不是编译、运行或项目测试证据。

截至 Step06 补完复核时，仅修改本 flow、Step06 文件、项目台账三个文件；Step07 尚未创建是该历史时点事实。随后已按用户授权完成 Step07，当前应以 §8.5 及台账 §10 的停审记录为准。

### 8.5 Step 7 完成与停审（2026-09-11，历史记录）

本轮按用户明确授权完成 Step 07：contracts、domain、application、infra、api、worker 六模块均有 capability / 调用方 / 实现方 / typed Rust trait / 读取面 / 写入面 / version / UoW / 错误 / 内部停审记录；并完成跨模块重复 port、反向依赖、source-authority、完整结果 replay、worker claim/checkpoint、public page helper、Step08～11 承接审计。

- 26 正式对象、8 service、30 入口 / 32 方法面、7 business/local port family 保持不变；新增的 authority/visibility/inbound family/worker target 仅为技术 carrier 或 runtime slot。
- 补齐完整 result payload save/get、scope/channel/key/digest、per-item details、fixed-input sidecar、source member 与 restore entry 显式关联；Query 仍 no-write。
- 将持久 WorkerClaim/Checkpoint 与必要 control carrier 的 definition owner 校正为 application；worker 保留 entry/runner state。Core 类型改为 contracts 显式 re-export 路径，未增加 sibling compile dependency。
- production adapter、provider、storage、crypto/KMS、receiver、outbound publisher/outbox 均保持 blocked/fail-closed；`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 全部保留，无新增 owning-project blocker。
- 当时只修改本项目校准材料，未修改正式 03、未实现、未测试、未创建目标实现仓、未提交。Step 07 已 `completed / pass_with_upstream_blockers / stop_review`；随后用户已明确授权并完成 Step 08。

### 8.6 Step 8 完成与停审（2026-09-11）

本轮按用户明确授权完成 Step 08 协议契约校准，并创建 `03_ddd_step_08_protocol_contracts.md`。协议分组严格沿正式 02 保持 `3 Command + 5 Query + 5 Inbound Consumer + 17 Operations Job = 30 logical entries`；E04/J12 的 placement/lifecycle 路由仍是两个互斥 method surfaces，不新增入口；另列 3 个 outbound candidate，全部 blocked。

- shared protocol helper 明确 logical route/topic/RPC、envelope/payload 分离、Command result、Consumer receipt、Job report、Issue/Disposition 及 public page/cursor 映射；public cursor 与 repository cursor 独立绑定 selector、principal、visibility、snapshot、order 和 read-model kind。
- 三个 Command 均给出独立 payload/result DTO、source map、accepted/duplicate/rejected/blocked/conflict/commit-unknown 姿态；五个 Query 均给出 request、safe view DTO、page/marker、hidden/absent/stale/partial/blocked/unknown surface 和 strict no-write 约束。
- 五个 Consumer 均给出 trusted envelope、typed payload、完整 receipt、unsupported/quarantined/delayed/duplicate/commit-unknown 处理；payload 不重复 envelope metadata，不保存外部正文或 provider secret。
- J01～J17 均有独立 input/report、固定输入与 owner/source/receiver mapping、worker claim/fence、intent-before-effect、probe/reconcile、partial/stale/missing/conflicting/unsupported/integrity-failed/commit-unknown 和完整 duplicate replay 规则。
- `ArchiveJobPostureChanged`、`ArchiveBundleSealed`、`RestoreHandoffPostureChanged` 仅作为 outbound blocked candidate；`AR-HLD-Q-001` 未闭合前不创建 outbox/publisher/topic/delivery contract。
- 完成 DTO→domain/port→flow 承接审计、source-authority matrix 审计、enum/ref/value 唯一归属审计和 static markdown 检查。`AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 继续开放；无新增 owning-project blocker。

本轮仅修改本项目 `design-calibration/03_ddd_step_08_protocol_contracts.md`、`03_ddd_calibration_flow.md`、`project_execution_ledger.md`；未修改正式 03、未创建正式 04～07、未实现、未测试、未生成真实 artifact/report/evidence/verdict/readiness、未提交 commit。当前停在 Step 08，等待用户审查与 Step 09 明确授权。

### 8.7 Step 9～11 完成与停审（2026-09-11～12）

- Step 09 已覆盖 `3 Command + 5 Query + 5 Consumer + 17 Job = 30 logical entries / 32 method surfaces` 的函数级处理流；闭环审计补正 J02 为 Planned binding commit-before-bind、明确无 probe 时不借 E02/J04 推断，并将 C02 receiver mapping 延后到 J13/J15 的 `RestoreService`；页眉完成状态已同步。
- Step 10 已为 18 个真实状态主语收稳转换矩阵、非法转换和 ACK/commit-unknown/receiver outcome 边界；闭环审计明确 WorkerEntry 终态仅属进程内、异 digest 不改写原 reservation，并将 acquire trait 名统一为 `WorkerLeasePort`；页眉完成状态已同步。
- Step 11 已创建 `03_ddd_step_11_persistence_transaction_consistency.md`，逐项覆盖 2 contracts + 24 domain 对象、technical sidecars、8 类 source-authority、logical collections、Step 07 repository 语义、30 入口事务、serializable-equivalent read-set、transaction probe 与 fake/durable parity。
- 上述校正不改变 `26` 个正式对象、`30 logical entries / 32 method surfaces`、`18` 个状态主语或 blocker 集合，也未新增 port/repository surface。
- Archive 无独立 projection truth；`AR-HLD-Q-001` 未关闭前无 outbox/publisher/delivery store。`ArchiveRepositoryCursorMapping` 的 codec/persistent-map 选择保持 pending/fail-closed，未私造算法或新 repository。
- 持续 blocker 为 `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`；无新增 owning-project blocker。未修改正式 03、未实现、未执行项目测试、未生成真实事实、未提交。

当前停在 Step 11，等待用户审查并明确授权 Step 12。

### 8.8 Step 17 完成与连续推进（2026-09-12）

Step 17 已创建并审计 `03_ddd_step_17_implementation_handoff.md`，将 Step 01～16 的字段、DTO、Query/view、public protocol、状态、事务、并发、配置、观测和测试切口分类为 `locally_closed`、`blocked_external` 或 `future_document_required`，并给出未来正式 07 可消费但不得提前实例化的 boundary family。

- 目标实现仓当前不存在；正式 04～07、implementation ledger、planned boundary skeleton 与项目级 Git/toolchain 检查尚未完成，因此正式 03 完成只允许继续设计，不构成编码授权或 implementation readiness。
- 所有外部 effect 继续执行 intent-before-effect、commit-unknown probe/reconcile 和 exact correlation；全部 outbound outbox 仍为空，`AR-HLD-Q-001` 未关闭前不创建 publisher/delivery truth。
- 未来 07 必须逐 phase/commit boundary 审计正式 03/05/06/07，并同时创建初始仅为 planned/blocked/waiting 的 implementation ledger 与全部 planned boundary skeleton；当前没有提前创建。
- Step 文件 233 行；Markdown fence、行尾空白及 `git diff --check -- projects/L4-archive` 通过。这是静态文档检查，不是实现、编译、测试、证据或 readiness。

持续 blocker 为 `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002`，无新增跨仓 blocker。按用户连续授权进入 Step 18；正式 03 当时仍须等待 Step 19。

### 8.9 Step 19 完成与正式 03 停审（2026-09-12）

Step 19 已创建并完成 `03_ddd_step_19_formal_document_assembly.md`，historical 正式 03 已整体重建为当前规范的十八章正式入口。第 5 章按 `contracts/domain/application/infra/api/worker` 六模块组织，第 6 章仅作索引；每个正式章节均有具体 calibration source 和延伸阅读入口。

- 固定分母核对为 `6 crates / 26 objects / 8 services / 7 port families / 30 logical entries / 32 method surfaces / 18 states / 8 source classes`；3 个 outbound candidate 全部保持 blocked。
- §9 已逐行回查 Step 10，修正 admission、capture、retrieval、compensation、idempotency、worker entry/claim 以及 stage/aggregate、CommitUnknown/Unknown 的摘要漂移。
- workspace projection 永为 Auxiliary；Archive 不拥有或反写任何 L1/workspace/artifact/observability truth。依赖按 compile/runtime/event/ref/adapter/fake 分类，唯一 sibling compile candidate 仍为 `core-contracts`。
- Query strict no-write、完整 duplicate replay、UoW/read-set/fence、intent-before-effect、exact probe/reconcile、cursor/config pending 与 fail-closed 均通过正式入口交叉审计。
- 机器静态检查：18 个连续正式章节、18 组校准来源/延伸阅读、12 个 fence 成对、表格列一致、本地 Markdown 链接存在、historical object/provider/年限/性能/算法污染无命中、尾空白及 `git diff --check -- projects/L4-archive` 通过。这不是项目测试、实现或验收证据。

本轮只修改 `projects/L4-archive/03-详细设计.md`、Step 19、本文与项目台账；未创建正式 04～07、implementation ledger/skeleton 或目标仓，未实现、未执行项目测试、未生成任何真实 bundle/digest/artifact/report/evidence/verdict/signoff/readiness，未提交 commit。正式 03 当前为 `formal / stop_review`，下一动作只能等待用户审查并明确授权正式 04。
