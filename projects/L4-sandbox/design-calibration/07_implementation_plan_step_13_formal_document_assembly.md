# L4-sandbox 实施计划 Step 13 整理正式实施计划文档

> 对应SOP: `standards/document/实施计划讨论流程_SOP.md` Step 13
> 书写规范: `standards/document/实施计划书写规范.md`
> 台账规范: `standards/document/代码实施台账与门禁规范.md`
> 正式输出: `projects/L4-sandbox/07-实施计划.md`
> 创建日期: 2026-07-17
> 最近校准: 2026-08-01
> 状态: completed_current_closeout
> 当前成熟度: design_assembly_current_contract_locked;不表示目标实现仓、boundary、commit、run、evidence、review或验收已经形成

---

## 1. Step状态与输出契约

| 项 | 状态 | 说明 |
|---|---|---|
| 当前Step | Step 13 | 整理正式实施计划文档 |
| 流程门禁 | passed_for_step_13_closeout | Step 12输入和当前contract propagation输入已完成设计静态收口 |
| 输入门禁 | passed_for_assembly_and_propagation | Step 1~12主件与分件、当前contract propagation输入均已读取并装配 |
| 输出一 | `projects/L4-sandbox/07-实施计划.md` | 正式13章实施计划 |
| 输出二 | `design-calibration/implementation_execution_ledger.md` | 项目级实现恢复与Boundary Ledger |
| 输出三 | `design-calibration/implementation-boundaries/CB-SBX-01A.md`~`CB-SBX-14C.md` | 32件非空planned boundary skeleton |
| 输出四 | 本文件 | 章节映射、装配审计、输出计数与停审记录 |
| 实现授权 | no | HDO文档形成不等于design baseline commit已固定,也不等于01A可修改目标仓 |
| 本Step终点 | completed_current_closeout | 正式输出、current contract lock、设计库存和最终静态审计已完成;实现仍保持blocked |

当前禁止填写真实design commit、实现commit、`run_id`、EV alias、测试结果、review结果、风险接受、验收三值、签署或下游授权。

---

## 2. 输入与章节来源映射

| 正式章节 | 已审查输入 | 正式文档保留粒度 |
|---|---|---|
| §1 与上游关系 | Step 1 | 权威顺序、historical material、Sandbox职责边界和冲突回退 |
| §2 目标与范围 | Step 2 | `MDR-SBX-P0`、P0-C /P0-Q、明确非范围与防误入 |
| §3 前置与阅读 | Step 3 | 恢复顺序、11个阅读包、永久记忆、repo /git /tool /dependency前置 |
| §4 对象与交付物 | Step 4 | 19个实施surface、39项交付物分组、非交付物与跨仓边界 |
| §5 Phase顺序 | Step 5 | HDO、PH-01~14、PH-QP、依赖拓扑和Phase Gate |
| §6 任务与boundary | Step 6 + current contract propagation | 62 task、108 batch摘要、32 boundary总表、闭环Profile、单current与ledger规则，以及capture / handoff / relay contract lock |
| §7 测试与验收门禁 | Step 7 + current inventory propagation | G0~G4、16 suite、7 gate、17 script、21 slot、17 VETO、64 design checks和254 TC inventory |
| §8 配置 /环境 /依赖 | Step 8 | source /material /ENV /PROFILE、fake /candidate边界、逐phase准备和不可用路由 |
| §9 Spike /风险 /OQ | Step 9 | 15 /20 /18完整索引、截止点、默认安全处置和risk acceptance禁区 |
| §10 控制 | Step 10 | 暂停原子动作、五类回退、合法next action、失效 /恢复和变更回写 |
| §11 提交 /评审 /交付 | Step 11 | 一boundary一commit、英文message、12 review、10 delivery、canonical handoff |
| §12 完成判定 | Step 12 + current inventory propagation | 四层判定、39 /32 /14 /250 /17分母、30 /31 /39状态库存、64 checks、未完成路由和正式验收接口 |
| §13 参考 | Step 13 | 只列真实读取的正式文档、标准和校准入口 |

每章必须保留校准来源块和延伸阅读提示。正式`07`只保留实施者需要的执行摘要,不得复制正式`03/04/05/06`的完整字段、DTO、状态矩阵、TC表、evidence schema或验收算法正文。

---

## 3. SOP八项问题回答

| # | 问题 | 装配判定 |
|---:|---|---|
| 1 | 是否覆盖书写规范主链 | 正式文档固定13章,不增删主章。 |
| 2 | 每章是否来自已确认产物 | §1~§12分别只消费Step 1~12;§13消费本Step真实引用。 |
| 3 | phase / task / gate编号是否一致 | 保留HDO-SBX-00、PH-01~14、PH-QP、IMPL-SBX-*、BATCH-SBX-*、CB-SBX-01A~14C、GATE /SUITE /ESLOT /VETO正式ID。 |
| 4 | 上游 /测试 /验收引用是否准确 | 只引用正式`00~06`及对应已审查校准文件;旧README /旧文档继续为historical material。 |
| 5 | 是否复制详细设计 | 不复制完整对象 /port /flow /state /DDL;正式§6和skeleton仅保留exact owner章节、scope与检查。 |
| 6 | 每个phase /boundary是否有闭环复核 | 正式§6保留`CL-SBX-BASE`与专项Profile;32件skeleton逐项固定required reads、scope、checks、Gate和风险。 |
| 7 | 是否包含交付实现前可落码审计和永久记忆 | 正式§3 /§6 /§12保留11条memory seed、14 /32审计门禁和设计回写规则。 |
| 8 | 是否有未解释空表 /占位 | skeleton执行字段使用规范化诚实初值`not_fixed / not_run / not_committed / pending`;不得出现泛化`TBD`或空白证据格。 |
| 9 | current contract与设计库存是否只出现一套 | active surface固定capture、handoff、relay publisher和ordinary observability hook；30 /31 /39、64 checks、254 /237 /250只作为design inventory，不表示执行结果。 |

---

## 4. 装配取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 将Step 1~12全文拼入正式`07` | 不采用 | 会重复详细设计、测试和验收真相,降低可执行性 |
| 只保留14 phase摘要 | 不采用 | 32 boundary的scope、checks、暂停与commit纪律会丢失 |
| 正式主链 + 32非空skeleton | 采用 | 正式文档保持可读,逐boundary仍可直接落码 /恢复 |
| 01A直接标ready | 不采用 | 目标仓、baseline、version、core revision仍开放 |
| 01A设唯一current但`blocked / wait_design` | 采用 | 满足单current规则并诚实反映Activation前置 |
| future boundary标`pending / read_docs` | 不采用 | 会构成提前激活 |
| future boundary标`planned / wait_until_current` | 采用 | 符合台账规范且避免多current |

---

## 5. 正式文档必须保留的执行骨架

### 5.1 实施主线

```text
HDO-SBX-00
  -> CB-SBX-01A
  -> CB-SBX-02A -> 02B -> 02C -> 02D
  -> CB-SBX-03A -> 03B
  -> CB-SBX-04A -> 04B
  -> CB-SBX-05A -> 05B
  -> CB-SBX-06A -> 06B
  -> CB-SBX-07A -> 07B -> 07C
  -> CB-SBX-08A -> 08B
  -> CB-SBX-09A -> 09B -> CB-SBX-10A -> 10B
  -> CB-SBX-11A -> 11B -> 11C
  -> CB-SBX-12A -> 12B
  -> CB-SBX-13A -> 13B
  -> CB-SBX-14A -> 14B -> 14C
```

`PH-QP`是从01A后开始的P0-Q准备支线,不是boundary或commit。所有实施、staging、commit与handoff严格单current;只有当前Handoff Gate通过后,项目ledger才可激活下一boundary。

### 5.2 不可压缩规则

正式§6~§12不得删除:

- `Context -> Boundary -> Policy -> Run`单向依赖。
- active execution identity前置 + resource /filesystem /network /process四维coherent isolation + workspace requirement。
- I065只在generation-scoped boundary establishment消费并保存bounded lease;Run只读exact persisted handle /lease。
- query write set=0、consumer不创建core success、relay /handoff no rollback、job no repair。
- capture collection固定为`CaptureCollectionPort::{collect_capture, inspect_capture}`；`CaptureFact::record(...)`创建即定格，不能出现`Pending`，unknown只能走inspect。
- handoff固定为`HandoffTargetDeliveryPort::{deliver, inspect_same_attempt}`；opening提交fixed target plan和完整`Pending` progress set且delivery call为0；每个attempt先提交`Attempting`再最多一次deliver，unknown只能检查同一attempt，aggregate status机械派生且不回滚capture。
- relay publisher固定为`SandboxEventPublisherPort::publish`；只消费committed frozen relay bundle和exact attempt，成功状态为`Published`，publisher结果不回滚source truth。
- ordinary observability hook只在post-return / post-inspection触发，输入body-free、低基数且失败隔离，不拥有capture、handoff或relay truth。
- 237 P0-C +13 P0-Q均mandatory,4 conditional不补偿。
- raw /report fixed pairing、redaction、dependency、no-static、review分权和17 VETO。
- tools semantic execution、runtime agent loop和member lifecycle不进入Sandbox实现。

---

## 6. Ledger与Skeleton初始化规则

### 6.1 项目级初态

| field | Step 13初值 |
|---|---|
| current_design_baseline | `not_fixed_uncommitted_design_worktree` |
| current_boundary | `CB-SBX-01A` |
| gate_status | `blocked` |
| gate_reason | HDO文件已形成,但design commit baseline、目标仓策略、edition /rust-version、core revision与目标仓git identity尚未固定 |
| next_allowed_action | `wait_design` |
| implementation_repo | `/home/aris/Projects/quantalithos-sandbox` (`absent`) |

`CB-SBX-01A`是唯一current identity,但不获得实现授权。`CB-SBX-02A~14C`全部为`planned / wait_until_current`。

### 6.2 每件Skeleton必须非空

每件文件至少包含:

1. Boundary Header与直接前置。
2. exact Required Reads。
3. Allowed Scope与Forbidden Scope。
4. Task / Batch索引。
5. Required Checks与evidence maturity。
6. Activation /Design /Scope /Worktree /Build /Test /Evidence /Commit /Handoff九类Gate。
7. Spike /Risk /OQ refs与现实前置。
8. planned commit title /summary /body groups。
9. Commit Record、Review /Delivery Record和Blockers初态。

所有未执行字段写`not_run`、`not_reviewed`、`not_committed`或`absent`,不得留空或写pass。

### 6.3 Current contract与设计库存锁

以下是实现移交必须消费的 active surface。它们是当前详细设计的引用锁，本Step不重新定义DTO、状态或provider细节。

| surface | current owner rule | implementation redline |
|---|---|---|
| `CaptureCollectionPort::{collect_capture, inspect_capture}` | `CaptureFact`由`CaptureFact::record(...)`一次构造并冻结；status来自已提交capture decision，只有`Complete / Partial / Failed / Unavailable` | 不接收raw body；unknown不得猜测或再次collect；handoff不得反写capture |
| `HandoffTargetDeliveryPort::{deliver, inspect_same_attempt}` | opening先提交fixed target plan、完整`Pending` progress set和`HandoffFact`；per-target由`Attempting`提交进入一次delivery，aggregate从完整progress set派生 | opening不得外呼；unknown不得换attempt；delivery失败不得回滚capture；不得引入material `DeadLetter` |
| `SandboxEventPublisherPort::publish` | publisher只读committed frozen relay bundle和exact attempt；一次committed attempt至多一次publish；成功映射为`Published` | 不重建payload、不回滚source truth；unknown只能检查同一attempt |
| ordinary observability hook | 只消费post-return / post-inspection的body-free、低基数summary，失败与主体事务隔离 | 不拥有业务truth、不触发主体重试、不把hook失败写成主体失败 |

当前设计库存（均非实现、测试或验收结果）:

| inventory | current design count |
|---|---:|
| owner-level state machines | 30 |
| Step 10 canonical enum entries (`STA-001..STA-031`) | 31 |
| Step 6 shared status declarations | 39 |
| design checks (`31 STCHK + 14 TXCHK + 19 RCHK`) | 64 |
| test cases (`237 P0-C + 13 P0-Q + 4 conditional`) | 254 |
| mandatory P0 (`237 P0-C + 13 P0-Q`) | 250 |

旧port、generic adapter outcome和旧状态计数只保留在明确标注的historical material中；不得作为active implementation surface。

---

## 7. 机械审计结果

| 审计 | 结果 |
|---|---|
| 章节 | passed:正式`07`恰有§1~§13主章。 |
| 来源 | passed:§1~§12各有对应Step来源,§13只列真实引用。 |
| Phase | passed:PH-01~14均可追溯,PH-QP明确为非commit准备支线。 |
| Boundary集合 | passed:正式§6、项目implementation ledger与32个文件名集合完全一致。 |
| Skeleton结构 | passed:32 /32非空;每件均有Required Reads、Allowed / Forbidden Scope、Task / Batch、Required Checks、Spike / Risk / OQ、Commit / Review / Delivery / Blocker和九类Gate。 |
| 任务 /批次 | passed:62个task、108个batch在32件skeleton中唯一归属。 |
| Planned title | passed:32 /32与Step 11 message矩阵一致;`CB-SBX-01A`为`chore(workspace): bootstrap the seven-crate sandbox workspace`。 |
| 初态 | passed:`CB-SBX-01A`唯一current但为`blocked / wait_design`;其余31件均为`planned / wait_until_current`。 |
| 测试 /验收 | passed:254 /16 /7 /17 /21 /17计数与正式`05/06`保持一致,未生成执行结果。 |
| Current contract lock | passed:4/4 active surface（capture、handoff、relay publisher、ordinary hook）已与boundary owner和redline对齐。 |
| Design inventory | passed:30 /31 /39、64 checks、254 /237 /250已传播到正式`07`、Step 13、ledger和受影响boundary；均标记为design-only。 |
| 禁止占位 | passed:无`<TBD>`、`TODO`、空hash /run /review /acceptance字段;`<run_id>`只作为canonical路径参数。 |
| 无伪事实 | passed:无真实实现hash、run、EV、Passed、Reviewed、Accepted、Effective或签名预填。 |
| 历史空表 | passed:项目ledger保留Design Baseline History、Gate Transition Log、Handoff History空表及明确无事实说明。 |
| 格式 | passed:`git diff --check`完成后保持无空白错误。 |

---

## 8. 当前Blocker与停审条件

当前没有新的上游L1/L2设计冲突阻塞本Step。历史状态库存漂移已按当前设计库存关闭为`design-inventory-only`；以下现实前置仍必须写入ledger并继续阻塞future Activation /execution:

- design commit baseline未固定。
- 目标实现仓不存在。
- target edition /rust-version和core exact revision未固定。
- Shell规则 /lint与RFC 8785工具未选。
- P0-Q candidate /ENV-05 /provider /material /lab packet未形成。
- CI binding、source invocation authority、review /acceptance actual identity未形成。

正式`07`、项目implementation ledger和32件skeleton已经形成；current contract、状态库存、测试库存和静态审计均已同步。本Step状态切为`completed_current_closeout`并停审；该状态不固定design baseline、不通过Activation Gate、不产生runtime evidence，也不授权进入实现或自行commit设计仓。

## Current Closeout Override: `v7.9-closeout`

本节是本Step物理EOF的current恢复点。此前`completed_reviewed`、历史计数和旧port名称只保留追溯意义；当前实现状态仍为`CB-SBX-01A blocked / activation_gate / wait_design`。

```text
current_document = 07-实施计划.md
current_step = Step 13 formal document assembly and current contract propagation
current_module = final_static_audit
design_plan_version = v7.9-closeout
design_status = completed_current_closeout
current_contract_lock = capture|handoff|relay_publisher|ordinary_observability_hook
actor_authority_lock = core_Human|AiMember|System|Integration;P0_worker_job_ActorKind::System_only;trusted_source_via_source_ref_and_envelope_gate
state_inventory = 30_owner_state_machines|31_step10_enum_entries|39_shared_declarations
check_inventory = 64_design_checks|31_STCHK|14_TXCHK|19_RCHK
test_design_inventory = 254_total|237_P0-C|13_P0-Q|4_conditional|250_P0
current_boundary = CB-SBX-01A
implementation_gate = blocked|activation_gate|wait_design
implementation_repo_exists = no
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
next_allowed_action = fixed_design_baseline_then_close_01A_activation_prerequisites
```

## Final design closure reassembly authorization (`DC-03`)

正式 `07` 获准汇总 Step 14/15 的四类 disposition、精确技术基线及拆分后的 Activation blocker。随后必须同批同步
implementation ledger、受影响 Boundary 与项目台账。任务数、批次数、32 件 Boundary 和主体设计库存不变，且所有实现
任务仍为 planned。

```text
assembly_authorization = DC-04_formal_07_final_closure_summary
implementation_inventory_changed = no
implementation_started = no
real_commit_count = 0
real_run_count = 0
next_allowed_action = update_formal_07_then_execute_DC-05_ledger_boundary_sync
commit_required = no
```

## PHYSICAL EOF DC-06 formal-status repair authorization

最终静态审计确认正式 `07` 元信息仍把 ledger / Boundary 同步写为待执行，而 Step 16 已完成 implementation ledger、
6 件受影响 Boundary 和 32 /32 skeleton 反向审计。允许只更新文档版本、变更记录和 current 状态描述；不得改变
14 phase、62 task、108 batch、32 Boundary、测试 /验收门禁或实现初态。

```text
assembly_authorization = DC-06_formal_07_current_status_only
formal_delta = metadata_version|change_record|current_status
implementation_inventory_changed = no
ledger_boundary_sync = completed_design_static_only
final_design_static_audit = in_progress_at_writeback
design_baseline = not_fixed
implementation_started = no
real_commit_count = 0
real_run_count = 0
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = update_formal_07_current_status_then_complete_DC-06_reaudit
commit_required = no
```

## PHYSICAL EOF DC-06 final audit disposition

前述授权已被正式 `07` 精确消费：元信息、变更记录与 current 状态已同步 Step 16 的 ledger/Boundary 完成事实，并保留
`design_baseline = not_fixed`。本处同时授权正式 `07` 在 Step 17 审计完成后只把最终审计状态更新为
`completed_design_static_only`；不得改动 14 phase、62 task、108 batch、32 Boundary 或实现初态。

```text
dc_06_assembly_disposition = exact_formal_delta_completed
formal_07_delta = metadata_version|change_record|current_status
ledger_boundary_sync = completed_design_static_only
final_design_static_audit = completed_design_static_only
design_conclusion = design_closed_ready_for_baseline_publication
implementation_inventory_changed = no
design_baseline = not_fixed
implementation_started = no
real_commit_count = 0
real_run_count = 0
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = update_formal_07_final_audit_status_then_DC-07_disposition
commit_required = no
```

## PHYSICAL EOF DC-07 publication-disposition writeback authorization

Step 18 已裁决 `baseline_publication_disposition = completed_without_publication`。允许正式 `07` 只同步元信息版本、变更记录
和当前移交状态，明确 baseline 未发布、`BLK-SBX-BASELINE-001` 继续开放及下一动作是等待明确 commit 授权。不得改动
14 phase、62 task、108 batch、32 Boundary、技术选择、测试/验收库存或实现初态。

```text
assembly_authorization = DC-07_formal_07_publication_disposition_status_only
source_step = 07_implementation_plan_step_18_baseline_publication_disposition.md
formal_delta = metadata_version|change_record|current_handoff_status
baseline_publication_disposition = completed_without_publication
baseline_publication_status = not_published
design_baseline = not_fixed
baseline_blocker_status = open_wait_explicit_commit_authorization
implementation_inventory_changed = no
implementation_started = no
real_commit_count = 0
real_run_count = 0
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
next_allowed_action = update_formal_07_publication_disposition_then_finalize_recovery_sources
commit_required = no
```

## PHYSICAL EOF DC-07 formal writeback disposition

正式 `07` 已按前述授权更新为 v0.3.3。只同步了 metadata、change record 与 current handoff status；14 phase、62 task、
108 batch、32 Boundary、技术基线、测试/验收库存和所有实现初值均未改变。

```text
dc_07_assembly_disposition = exact_formal_delta_completed
formal_07_version = v0.3.3
formal_delta = metadata_version|change_record|current_handoff_status
baseline_publication_disposition = completed_without_publication
baseline_publication_status = not_published
design_baseline = not_fixed
baseline_blocker_status = open_wait_explicit_commit_authorization
implementation_inventory_changed = no
runtime_fact_created = no
next_allowed_action = wait_explicit_commit_authorization
commit_required = no
```
