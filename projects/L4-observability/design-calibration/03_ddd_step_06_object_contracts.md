# L4-observability 03-详细设计 Step 06 · 对象实现契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 06
> 回填章节: `03-详细设计.md` §5 模块实现契约中的对象实现契约;§6 全局对象 / Trait / API 索引
> 当前模式: full-restart
> 当前门禁: `R06.8-B_done_design_only_waiting_user_before_Step07`；Step 06 definition set 已完成 design-only，未经用户明确确认不得进入 Step 07 affected review

## 1. Step 状态

| 项 | 内容 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 06 `逐模块定义对象实现契约` |
| 输出文件 | 主控 `design-calibration/03_ddd_step_06_object_contracts.md`;R06.2专项 `design-calibration/03_ddd_step_06_contracts_carriers.md`;R06.3专项 `design-calibration/03_ddd_step_06_domain_truth_signal_audit.md`;R06.4专项 `design-calibration/03_ddd_step_06_boundary_read_maintenance.md`;R06.5专项 `design-calibration/03_ddd_step_06_policy_guard_records.md`;R06.6各application专项；R06.7-A专项 `design-calibration/03_ddd_step_06_runtime_infra_entry_carriers.md`;R06.7-B专项 `design-calibration/03_ddd_step_06_runtime_availability.md`;R06.7-C专项 `design-calibration/03_ddd_step_06_runtime_infra_entry_carriers_r06_7c.md`;R06.7-D专项 `design-calibration/03_ddd_step_06_entry_local_carriers_r06_7d.md`;R06.7-E专项 `design-calibration/03_ddd_step_06_runtime_entry_cross_module_r06_7e.md`;R06.8-A专项 `design-calibration/03_ddd_step_06_application_input_assembly_r06_8a.md`;R06.8-B专项 `design-calibration/03_ddd_step_06_final_cross_module_gate_r06_8b.md` |
| flow 文件 | `design-calibration/03_ddd_calibration_flow.md` |
| Step 状态 | R06.8-B_done_design_only_waiting_user_before_Step07 |
| 正式回填状态 | blocked_until_step_19 |
| gate_status | pass_step06_design_only_waiting_user_before_Step07 |
| next_allowed_action | wait_user_confirmation_before_Step07_affected_review |
| 原完成门禁 | historical_gate_invalidated_for_granularity_repair；原 `done/pass` 不再证明对象级可落码性 |
| downstream targeted repair | `CFG-BLK-07-01` repaired on 2026-07-14；该修复结论保留,但不能替代本轮逐对象粒度修复 |

### 1.1 定向重开恢复门禁

| 项 | 当前裁定 |
|---|---|
| 重开触发 | 用户要求重新审查 Step 05~10 粒度；2026-07-16 审查确认 Step 06 以 family 汇总替代大量独立对象卡,原 `pass` 过早 |
| 临时审查记录 | `/tmp/L4-observability_03_step05-10_granularity_review.md`；只提供恢复线索,不作为设计仓 truth source |
| 当前 truth source | 本文件、`03_ddd_calibration_flow.md` 与 `project_execution_ledger.md` 的 current repair 状态 |
| 当前内部 blocker | `03-RPR-S06-GRANULARITY=resolved_in_R06.8_design_only`；三个 executable seam 与 file-owner decision 已在 Step 06 definition 层关闭；`R06-F-AFFECT-UOW-01=open_controlled_downstream` 及 Step 07~16 affected-use 仍阻塞 implementation-ready，不能误写为整个 `03` 已完成 |
| 直接上游 blocker | `R06.6-F2-H13-UPSTREAM=open_controlled`；formal `02`的scope-only H13映射与current per-target H13 factory冲突，formal重装配前必须裁定 |
| 当前允许写入 | 仅可做R06.8-A/B静态纠错与控制文件一致性修复，当前应停审；用户确认后才可写 Step 07 当前中间产物 |
| 当前禁止写入 | 未确认的 Step 07~19、正式 `03-详细设计.md`、任何`04`文件、任何实现代码 |
| 下游冻结 | Step 07~10 与 formal `03` 只可作为反向缺口诊断输入；`04` Step 11 保持未启动,原 `04` Step 10 停审点冻结 |
| 当前恢复点 | R06.8-A已闭合48个 concrete input与三类有限assembler；R06.8-B已闭合C-11/C-13、single publication Job、owner/state/Step07 handoff与全文门禁；等待用户确认进入Step07 |

### 1.2 第 1 批范围与非范围

| 范围 | 本批处理 | 本批不处理 |
|---|---|---|
| 恢复门禁 | 废止原 Step 06 完成声明,固定修复期间的允许 / 禁止动作 | 不恢复 Step 06 `pass` |
| inventory | 汇总当前概要对象、Step 05 owner、现有 Step 06 类型、Step 10 反向补口和 R2 technical carrier | 不在本批新增或改写对象字段 |
| 独立卡资格 | 为每个对象组裁定 full card、template-backed card、external type 或 historical exclusion | 不用资格表替代后续独立对象小节 |
| 差异矩阵 | 记录概要、Step 05、当前 Step 06、Step 07~10 / formal 的 definition / use 漂移 | 不在本批直接选择有上游语义差异的任一旧版本 |
| 下游影响 | 标出 Step 07~10、Step 19、formal `03` 与 `04` 的后置复审顺序 | 不修改这些下游文件 |

本批只建立可审查的修复控制面。下文原有对象 schema 暂时保留为 `repair input`，其中任何 `pass`、`已闭口`、`同等 Rust-facing 深度` 或“可直接进入 Step 07”的表述均受本节覆盖，不能单独作为实现依据。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 06 | 已读取 | 约束本步必须先建批次、模块顺序、对象闭口决策,再逐模块写 capability、对象、字段、函数、状态和 Step 7 承接 |
| `standards/document/详细设计书写规范.md` 5.5 | 已读取 | 约束对象卡片、字段表、成员函数表、工厂函数表、enum 变体表和第 5 章收口摘要 |
| `standards/coding/rust.md` | 已读取 | 要求实现仓 Rust 源码标识符、注释、rustdoc、测试名使用英文;因此本文件 Rust code block 使用英文 rustdoc,中文仅用于设计说明 |
| `design-calibration/03_ddd_step_03_constraints.md` | 已完成 | 提供 Rust、源码英文、`core-contracts` 唯一编译期 sibling dependency 和 no raw body 约束 |
| `design-calibration/03_ddd_step_04_file_layout.md` | 已完成 | 提供 7 个 workspace member、package / crate 命名和文件职责 |
| `design-calibration/03_ddd_step_05_module_contracts.md` | 已完成 | 提供 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 模块主轴与对象归属 |
| `projects/L4-observability/02-概要设计.md` §5 / §6 / §8 / §9 / §12 | 当前正式概要输入 | 提供 10 个业务组成部分、关键对象池、处理流族、状态族和详细设计承接清单 |
| `02_hld_step_05_components_boundary.md` | 已读取 | 提供业务组成部分与对象发现维度 |
| `02_hld_step_06_key_objects*.md` | 已读取 | 提供关键对象骨架、字段骨架、状态集合、函数骨架、禁止事项 |
| `02_hld_step_09_state_machine.md` | 已读取 | 提供 Step 10 需要承接的状态主语和状态名基线 |
| `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` | 已读取 | 作为对象契约粒度、批次表和闭环审计参考,不复制 Governance truth |
| `projects/L1-artifact/design-calibration/03_ddd_step_06_object_contracts.md` | 已读取 | 作为 7 模块主轴、非 core 闭口决策和 Step 7 承接清单参考,不复制 Artifact truth |
| 旧 `03_ddd_step_06_object_contracts.md` | historical material | 旧文件只有 141 行,混入 `ObservationEnvelope`、`MetricPoint`、`TraceSpanRecord`、hash link 等旧 schema 心智;本步全量替换 |

## 3. SOP 问题回答

### 3.1 是否已经建立 Step 6 文件骨架、写入批次状态表和模块执行顺序表?

已建立。本文件 §7.1 给出写入批次状态表,§7.2 给出模块执行顺序。当前 Step 06 作为单个正式 Step 收口,不会自动进入 Step 07。

### 3.2 本仓是否需要先收敛 shared vocabulary、typed ref、public marker 或基础 state enum?

需要。`L4-observability` 的 protocol、view、event、job、domain object 和 application result 都会共享 body-free typed ref、safe marker、visibility / degraded / freshness surface、handoff / retention / gap / maintenance state name。它们必须先归 `contracts` 或 `core-contracts`,否则 Step 08 的 public DTO 会被迫引用 domain-only 类型。

### 3.3 当前模块需要完成哪些 capability?

本步按 7 个实现模块收口:

- `contracts`: public typed carrier、public state / kind、public view / report helper、receipt / error surface。
- `domain`: observation-owned truth、state enum、policy / guard、append-only history、body-free linkage、marker、maintenance state。
- `application`: application service object、idempotency / stored result carrier、operation context、visibility decision、consumer / job disposition。
- `application`: adapter availability carrier作为port boundary type闭口；`infra`只构造snapshot并承接store binding identity/runtime assembly marker，具体config key、DDL和adapter binding由Step 11 / 14闭口。
- `api`: sync entry handler state 和 request / response mapping disposition。
- `worker`: inbound consumer disposition、outbox loop state、resident projection loop state。
- `jobs`: one-shot job runner context、job report draft、job exit disposition。

### 3.4 哪些对象当前 Step 6 必须闭口,哪些 defer?

必须闭口:

- `contracts` 的所有 typed ref、public marker、public state enum、public view / report helper。
- `domain` 的所有 truth object、state object、policy / guard、history / record object。
- `application` 的 service object、idempotency、stored result、operation context、visibility decision、consumer / job disposition。
- `infra` / `api` / `worker` / `jobs` 中已经是唯一 stable carrier 的 availability、entry disposition、loop state、job report draft。

明确 defer:

- repository / port / adapter trait exact function 留给 Step 07。
- command / query / event / job DTO schema 留给 Step 08。
- 函数级事务顺序、save order、outbox order 留给 Step 09 / 11。
- 完整状态矩阵和非法迁移错误映射留给 Step 10 / 12。
- config key、runtime product binding、adapter product selection 留给 Step 14 和 `04-配置设计`。

### 3.5 每个对象的字段、函数和状态如何闭合?

字段来源分为:

- `system_generated`: 本仓生成的 id、ref、cursor、record identity。
- `command_input`: Command DTO 或 entry metadata 中复制的安全字段。
- `event_input`: event envelope、typed payload 或 safe summary 中复制的字段。
- `repository_lookup`: 本仓 repository 读取到的既有 object / state / version。
- `resolver_snapshot`: infra resolver 返回的 body-free safe summary 或 resolution state。
- `domain_derivation`: 由 domain policy / state transition 在同一事务中派生。
- `job_input`: job metadata、cursor、target ref、operator / system actor。

如果字段无法回指上述来源,本步不把它写成已闭口字段。

### 3.6 当前模块或对象组是否存在功能无人承接、对象无来源或跨模块越界?

当前发现并处理:

- 旧 `ObservationEnvelope` / `MetricPoint` / `NormalizedLogRecord` / `TraceSpanRecord` 是 schema / provider record 心智,不作为当前 domain 主语。它们的安全观测语义收敛到 `ObservationReceipt`、`SafeSignal`、`SignalRollupWindow` 和 `SafeSignalProjectionView`。
- 旧 hash chain / cost / dashboard / health truth 不进入当前对象契约。dashboard / alert / GRC 只作为 `PeripheralConsumerRef` 和 `DashboardAlertExportView` 的只读消费面。
- `ReportHandoffRecord` 不生成真实 `run_id`、真实 evidence alias、final verdict 或 signoff。
- `RetentionMarker` 不执行 cleanup;`ReplayScope` / `ProjectionMaintenanceState` 不修 source truth。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| 旧 Step 06 | 只有少量全仓对象表,未按模块、capability、对象卡片和字段来源闭口 | 全量替换为当前 Step 06 |
| 旧 Step 06 | 使用 `ObservationEnvelope`、`MetricPoint`、`TraceSpanRecord` 等未在当前概要 Step 06 正式化的旧对象 | 降级为 historical material,当前以正式 `02` 对象池为准 |
| 旧 Step 06 | Rustdoc 使用中文且与 Step 03 源码英文约束冲突 | 当前 Rust code block 使用英文 rustdoc,中文说明放在表格 |
| 概要 Step 06 | 对象很多但只是骨架,未给完整 Rust-facing 字段 / 函数 / enum 变体表 | 当前按实现模块压到可落码契约,并保留后续 Step 承接 |
| 后续 Step 07 / 08 | 若 Step 06 不闭口 application helper / public secondary types,后续会私补类型 | 当前闭口 idempotency、stored result、visibility decision、consumer / job disposition 和 public marker |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 组织方式 | 单个全仓对象表 | 先批次 / 模块顺序,再按 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 收口 |
| 对象来源 | 旧 README / 旧正式 `03` schema 心智 | 当前正式 `02` §5 / §6 / §8 / §9 和 Step 05 模块 owner |
| 字段深度 | 字段只有名称,缺少来源和约束 | 字段写类型、作用、约束 / 来源,无法闭口的后移并写明 Step |
| 函数深度 | 多数函数无完整参数 / 返回 | 成员函数、工厂函数写 Rust-facing 签名、参数类型、返回类型和副作用 |
| 状态深度 | enum 无 variant 注释和来源 / 去向 | 状态 enum 写 Rust code block 和变体表,Step 10 继续补矩阵 |
| 非 core 模块 | 几乎未处理 | application / infra / entry 模块均有闭口或 defer 决策 |

## 6. 设计取舍与粒度修复控制

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 为每个当前实现责任对象建立独立卡,允许严格透明 newtype 复用固定模板 | 满足 SOP 的逐对象审查主键,实现者可逐类型落码 | 文档较长,必须按批次和模块维护 | 本轮修复采用 |
| B. 只写 domain truth object,把 contracts / application / infra / entry defer | 篇幅较短 | Step 07 / 08 必然私补 public carrier、idempotency 和 entry disposition | 不采用 |
| C. 对 record / policy / state carrier / entry carrier 与 typed ref 一并使用 family 总表 | 篇幅较短 | 违反“每个对象必须独立成小节”;字段、factory、状态与 owner 无法逐项停审 | historical_decision_invalidated |
| D. 让 product / backend adapter 决定对象结构 | 便于接入现成产品 | 产品会反向塑造 observation truth | 不采用 |

### 6.1 Step 06 粒度修复批次控制

#### 6.1.1 修复批次状态表

| 修复批次 | 覆盖范围 | 当前状态 | 完成证据 | 停审门禁 |
|---|---|---|---|---|
| `R06.1` | 恢复门禁、对象 inventory、独立卡 / 模板资格、差异矩阵 | done_confirmed | 本文件 §1.1~§1.2、§6.1~§6.8 | 用户已确认进入下一批 |
| `R06.2` | `contracts` typed ref / value / enum / set carrier | done_confirmed | `03_ddd_step_06_contracts_carriers.md` §5~§23逐对象卡、owner registry、传播与自检 | 用户已确认进入下一批 |
| `R06.3` | `domain` truth / safety / correlation / audit / evidence | done_confirmed | `03_ddd_step_06_domain_truth_signal_audit.md` §7~§21；43个support/state/transition/view卡、7个truth object、5个public view及闭环审计 | 用户已确认进入下一批 |
| `R06.4` | handoff / retention / replay / no-write / read / diagnostic / gap / peripheral / reference / maintenance | done_confirmed | `03_ddd_step_06_boundary_read_maintenance.md` §8~§18；110个active type、18个truth/state object、6个public view及字段来源/rehydration/状态/affected-only/承接审计 | 用户已确认进入下一批 |
| `R06.5` | policy / guard 与 append-only record | done_confirmed_historical_checkpoint | `03_ddd_step_06_policy_guard_records.md` §§57~73；18 policy、H1~H13 13张独立record card、F/G新增类型账、affected-definition与总门禁已完成 design-only | 已被 R06.6 输入审查消费；不再是 current pointer |
| `R06.6` | application idempotency / stored result / outbox / intent / plan / claim / token / report / error / service / digest / record-UoW assembly | done_confirmed_historical_checkpoint | A/B/C对象卡 + D专项 §§1~47 + E专项 §§1~24 + F1专项 §§1~10 + F2专项 §§1~18；F2 owner addendum已同步contracts/records/error-service/boundary | 已由用户确认并被R06.7-A消费；不再是current pointer |
| `R06.7` | infra / runtime / api / worker / jobs stable carrier 与 defer boundary | done_confirmed_historical_checkpoint | A authority/inventory、B三张availability卡、C十五张technical carrier卡、D五个entry候选资格审查均已被E消费；E final audit成为R06.8输入 | 已由用户确认并被R06.8消费；不再是current pointer |
| `R06.8` | 48 input assembly、字段/状态/owner、C-11/C-13、single publication Job、Step 07承接、下游影响和全文门禁 | `R06.8-B_done_design_only_waiting_user_before_Step07` | A见`03_ddd_step_06_application_input_assembly_r06_8a.md` §§1~15；B见`03_ddd_step_06_final_cross_module_gate_r06_8b.md` §§1~21 | Step06已停审；等待用户确认进入Step07 affected review |

原 §7.1 的 `6.0~6.7 done/pass` 只描述修复前的历史写入过程,现统一降级为 `historical_batch_record_invalidated_by_R06.1`。它们不能与上表并行形成第二个 current 状态源。

#### 6.1.2 当前修复顺序与停止规则

```text
R06.1 inventory / qualification / delta
  -> R06.2 contracts
  -> R06.3 domain core
  -> R06.4 domain boundary / maintenance
  -> R06.5 policies / records
  -> R06.6 application
  -> R06.7 infra / entry
  -> R06.8 cross-module gate
  -> affected-only Step 07 review
```

每批只读取该批需要的上游与既有 definition/use,写完后更新本表、flow 和项目台账并停审。`R06.8` 通过前不得修改 Step 07；本轮 Step 06 修复全部通过前,原正式 `03` 与 `04` 只保持冻结,不得边修中间产物边回填正式正文。

### 6.2 对象卡资格规则

#### 6.2.1 资格类别

| 资格 | 适用条件 | 当前 Step 06 必须产出 | 不允许的替代 |
|---|---|---|---|
| `FC` full card | 有多个字段、独立 validation、factory、member、状态、variant、持久化、协议可见性、外部 effect 或唯一 stable carrier 中任一项 | 独立小节、Rust type、字段、factory / static、member、variant、来源、不变量、owner / use、测试红线 | family 总表、后续 Step 首次定义、自由字符串 |
| `TC` template-backed card | 仅单字段 transparent newtype；与同模板共享构造 / 非空 / body-free validation；无额外 discriminator、状态、行为、持久化差异 | 每个类型仍有独立小节；写 exact owner、inner type、来源、wire、禁止互换与模板回指 | type alias、裸 `String`、一个 family 小节代替全部类型 |
| `ET` external type | 唯一 owner 已在 `core-contracts` 或另一个正式上游 crate,本仓只引用 | 独立引用卡；写 upstream path / type、允许来源、禁止重定义、fallback blocker | 本仓同义 wrapper、猜字段、复制外部 truth |
| `DX` explicit defer | 当前 Step 06 不应定义 trait / DTO / config detail,且已有具名后续 owner | 独立 defer 记录；写 exact type / owner / Step / 当前不需构造的理由 | 无 owner 的“后续补”、当前 flow 已使用却仍 defer |
| `HX` historical exclusion | 旧 schema / product / raw-body 类型与当前上游冲突 | 具名排除与替代对象 | 恢复旧对象或把它计入 current inventory |
| `UR` unresolved | 当前 definition/use 或上游之间存在冲突,本批只发现尚未裁定 | 差异 ID、影响批次、禁止提前选择 | 静默沿用当前 Step 或后续 Step |

#### 6.2.2 `TC` 必须同时满足的判定

1. Rust 形态只能是 `pub struct TypeName(pub BodyFreeRef)` 或等价单字段透明包装。
2. 构造只复用同一 `BodyFreeRef::new` / typed-id factory,没有额外 kind、scope、state、version、digest 或 relation guard。
3. 不存在独立 member transition、repository lifecycle、protocol discriminator 或 external effect identity。
4. wire 必须保留类型 discriminator；不同 wrapper 即使 inner value 相同也不可互换。
5. 上游概要没有为该名称定义多字段 reference object、状态或成员行为。

任一条件不满足即为 `FC`。因此名称以 `Ref` 结尾不自动获得模板资格。

#### 6.2.3 独立对象卡最低结构

```text
#### <TypeName>
##### capability / object source
##### Rust type definition
##### fields and field sources
##### factory / static functions
##### member functions
##### enum variants / state, when applicable
##### invariants and forbidden substitutions
##### downstream owner / use and test redlines
##### object stop-review result
```

`FC` 的任一小节只有在明确“不适用”及理由时才可省略内容。state enum、outcome enum、error enum、append-only record、public view 和 entry carrier 都是实现类型,不能因为不是 aggregate 而免除独立卡。

### 6.3 输入权威与 inventory 取并规则

| 输入 | 权威用途 | 本轮规则 |
|---|---|---|
| 正式 `02` §5 / §6 / §8 / §9 / §12 与 `02_hld_step_06_key_objects*.md` | 关键对象主语、对象类别、字段 / 函数骨架、状态族、详细设计承接 | 不得静默删除、合并或把结构化 reference 降成透明 wrapper |
| Step 05 current module contract | 七模块 owner、依赖方向、non-core stable carrier 必须闭口的原则 | Step 06 不能把唯一 carrier 推给实现者 |
| 本文件修复前正文 | 可复用的 schema / signature / invariant 草稿 | 只是 repair input；必须通过独立卡资格和上游一致性后才能转为 current |
| Step 07 / 08 / 09 | trait、协议、flow 的当前 use site | 可反查 Step 06 是否缺 definition；不得反向成为对象 definition owner |
| Step 10 | 27 state owner、trigger 与反向补口记录 | 用于证明缺口和检查触发闭环；不得绕过 Step 06 独立卡 |
| Step 14 / formal `03` R2 | technical registration stable carrier 的后置 definition/use | 作为定向回灌输入；对象 owner 需在 `R06.7` 重新固定 |
| README / 旧 `03` / 旧 schema 名 | historical material | 只做排除诊断 |

inventory 采用并集:上游正式对象 + Step 05 要求闭口对象 + 当前 Step 06 显式类型 + Step 07~10 已使用但 Step 06 缺 definition 的对象 + R2 technical carrier。出现同名不同 shape 时标 `UR`,不在第 1 批自行选边。

### 6.4 `contracts` 对象 inventory 与资格

#### 6.4.1 透明 typed identity 候选

下表记录 `R06.1` 的 template 资格与闭口要求。`R06.2` 已为每行创建独立对象卡；current schema只见 `03_ddd_step_06_contracts_carriers.md` §5~§7。

| 类型 | 资格 | 当前唯一 owner | inner / identity source | R06.2 closure requirement（已完成） |
|---|---|---|---|---|
| `ObservationReceiptRef` | `TC` | `contracts::refs` | `BodyFreeRef`;receipt factory / repository | 独立 wire、owner discriminator、mint source |
| `SafetyDispositionRef` | `TC` | `contracts::refs` | `BodyFreeRef`;same-UoW disposition factory | 同上 |
| `CorrelationContextRef` | `TC` | `contracts::refs` | `BodyFreeRef`;context factory | 同上 |
| `SafeSignalRef` | `TC` | `contracts::refs` | `BodyFreeRef`;signal factory | 同上 |
| `SignalRollupWindowRef` | `TC` | `contracts::refs` | `BodyFreeRef`;rollup factory | 同上 |
| `AuditProjectionRef` | `TC` | `contracts::refs` | `BodyFreeRef`;projection factory | 同上 |
| `EvidenceLinkageRef` | `TC` | `contracts::refs` | `BodyFreeRef`;linkage factory | 同上 |
| `ReportHandoffRecordRef` | `TC` | `contracts::refs` | `BodyFreeRef`;handoff factory | 同上 |
| `AuthenticityHintRef` | `TC` | `contracts::refs` | `BodyFreeRef`;hint factory | 同上 |
| `RetentionMarkerRef` | `TC` | `contracts::refs` | `BodyFreeRef`;marker factory | 同上 |
| `ActiveReferenceProtectionRef` | `TC` | `contracts::refs` | `BodyFreeRef`;protection factory | 同上 |
| `ReplayScopeRef` | `TC` | `contracts::refs` | `BodyFreeRef`;scope factory | 同上 |
| `NoWriteViolationRef` | `TC` | `contracts::refs` | `BodyFreeRef`;violation factory | 同上 |
| `ReadVisibilityRef` | `TC` | `contracts::refs` | `BodyFreeRef`;visibility decision factory | 同上 |
| `DiagnosticSummaryRef` | `TC` | `contracts::refs` | `BodyFreeRef`;summary factory | 同上 |
| `DiagnosticScopeRef` | `TC` | `contracts::refs` | `BodyFreeRef`;scope factory | 同上 |
| `DiagnosticRequestContextRef` | `TC` | `contracts::refs` | `BodyFreeRef`;query input / trusted factory | one-shot only,不得作 projection identity |
| `GapStateRef` | `TC` | `contracts::refs` | `BodyFreeRef`;gap factory | 同上 |
| `PeripheralDeliveryRef` | `TC` | `contracts::refs` | `BodyFreeRef`;delivery factory | 同上 |
| `ReferenceSnapshotStateRef` | `TC` | `contracts::refs` | `BodyFreeRef`;snapshot-state registration | canonical name；旧`ReferenceSnapshotRef`不生成alias |
| `ProjectionMaintenanceRef` | `TC` | `contracts::refs` | `BodyFreeRef`;maintenance factory | 同上 |
| `ObservationReadModelRef` | `TC` | `contracts::refs` | `BodyFreeRef`;first projection create | stable lookup binding |
| `DiagnosticViewRef` | `TC` | `contracts::refs` | `BodyFreeRef`;first diagnostic create | stable lookup binding |
| `DashboardAlertExportViewRef` | `TC` | `contracts::refs` | `BodyFreeRef`;first consumer+scope create | stable lookup binding |
| `RebuildProgressViewRef` | `TC` | `contracts::refs` | `BodyFreeRef`;first target create | stable lookup binding |
| `ProjectionFreshnessMarkerRef` | `TC` | `contracts::refs` | `BodyFreeRef`;projection first create | one-to-one projection binding |

#### 6.4.2 结构化 reference / context 对象

| 对象 | 资格 | 上游 / 当前差异 | 目标批次 | 当前裁定 |
|---|---|---|---|---|
| `BodyFreeRef` | `FC` | R06.1发现缺serde/debug-redaction边界 | `R06.2` | resolved；专项§5 |
| `ObservationSourceRef` | `FC` | family + external ref + safe summary + resolution | `R06.2` | `UR-REF-01 resolved`；专项§10.1 |
| `RuntimeSandboxSignalRef` | `FC` | runtime/sandbox scope + safe summary + boundary marker | `R06.2` | `UR-REF-02 resolved`；专项§10.2 |
| `ReportConsumerRef` | `FC` | kind/scope/purpose/state，与旧wrapper冲突 | `R06.2` | `UR-REF-03 resolved`；专项§10.3 |
| `ProtectedObservationRef` | `FC` | protected object/scope/marker/state | `R06.2` | `UR-REF-04 resolved`；专项§10.4 |
| `GapSourceRef` | `FC` | source kind/ref/visibility/state | `R06.2` | `UR-REF-05 resolved`；专项§10.5 |
| `PeripheralConsumerRef` | `FC` | kind/scope/export flag/state，与旧wrapper冲突 | `R06.2` | `UR-REF-06 resolved`；专项§10.6 |
| `SubjectObservationReference` | `FC` | subject kind/safe ref/identity marker/snapshot | `R06.2` | `UR-REF-07 resolved`；专项§10.7 |
| `GovernanceArtifactEvidenceReference` | `FC` | family/external ref/digest/snapshot | `R06.2` | `UR-REF-08 resolved`；专项§10.8 |
| `RuntimeSandboxSummaryRef` | `FC` | scope/summary/boundary/state | `R06.2` | `UR-REF-09 resolved`；专项§10.9 |
| `ArchiveReportHandoffRef` | `FC` | family/consumer/handoff/boundary/state | `R06.2` | `UR-REF-10 resolved`；专项§10.10 |
| `MaintenanceTargetRef` | `FC` | immutable target id/kind/object/effect/no-write descriptor；execution state独立 | `R06.2/R06.4 reconcile` | `UR-REF-11 resolved`；contracts专项§10.11，R06.4移除重复target lifecycle |
| `ObservationSourceVersionRef` | `FC` | producer/source/token + out-of-order guard | `R06.2` | resolved；专项§12.7 |

`DiagnosticRequestContext` 与 `DiagnosticScope` 是 domain/application read context,不属于透明 ref；它们进入 §6.5。

#### 6.4.3 contracts value / enum / surface

下表的“当前状态”是 `R06.1` 发现，不是仍未完成的 current 状态。21个对象均已在专项§11~§15建立独立卡并通过本批停审。

| 对象 | 资格 | R06.1发现 | 目标批次 |
|---|---|---|---|
| `SchemaVersion` | `FC` | 有 schema,缺独立 variant/source/use 卡 | `R06.2` |
| `SourceFamilyKind` | `FC` | 有 finite variants,需与 structured source ref 对齐 | `R06.2` |
| `ObservationProducerFamily` | `FC` | 有 finite variants,需与 source family 禁止隐式转换 | `R06.2` |
| `DigestProfileVersion` | `FC` | validation 与兼容策略独立,不能当普通 `u16` wrapper | `R06.2` |
| `DigestValue` | `FC` | 64 lowercase hex / redaction 规则独立 | `R06.2` |
| `RequestDigest` | `FC` | operation canonical input digest | `R06.2` |
| `DigestSummary` | `FC` | body-free material / outcome digest | `R06.2` |
| `ObservationCursor` | `FC` | observation namespace allocator | `R06.2` |
| `ReferenceCursor` | `FC` | reference namespace allocator | `R06.2` |
| `ObservationCommittedCursor` | `FC` | tagged union,禁止丢 variant 比较 | `R06.2` |
| `OutboxCursor` | `FC` | pending scan resume token,不是 committed cursor | `R06.2` |
| `OpaqueSourceVersionToken` | `FC` | adapter-declared comparator,不能由 timestamp 合成 | `R06.2` |
| `ObservationProjectionScope` | `FC` | public enum + canonical lookup semantics | `R06.2` |
| `ObservationReferenceRefreshScope` | `FC` | public enum + set canonicalization | `R06.2` |
| `VisibilitySurface` | `FC` | public visibility output | `R06.2` |
| `PublicVisibilityKind` | `FC` | enum 与 body presence / gap invariant | `R06.2` |
| `DegradedSurface` | `FC` | public degraded output | `R06.2` |
| `DegradedReason` | `FC` | typed reason enum,不得 free-text 扩展 | `R06.2` |
| `ObservationConsistencyHint` | `FC` | query consistency enum | `R06.2` |
| `AdapterFamily` | `FC` | product-neutral finite family | `R06.2` |
| `ProtocolError` | `FC` | public input/schema validation authority | `R06.2` |

#### 6.4.4 set / marker / secondary support carrier 闭口账

下表的“问题”是 `R06.1` 发现。10个set已在专项§16逐类型闭口；两项旧surface名已在专项§17排除；known secondary carrier已在专项§19分配唯一owner。

| support carrier | 资格 | R06.1问题 | current closure / owner |
|---|---|---|---|
| `BodyFreeRefSet`;`GapStateRefSet`;`SafeSignalRefSet`;`NoWriteViolationRefSet`;`ObservationConsumerRefSet`;`ReplayTargetRefSet` | `FC` or strict set template per type | 多处被字段 / 参数引用,当前没有元素类型、排序、去重、empty 语义和 max bound 独立 definition | `R06.2`,逐类型卡 |
| `ObservationReceiptRefSet`;`EvidenceLinkageRefSet`;`ReferenceSnapshotStateRefSet`;`AffectedObservationObjectRefSet` | `FC` or strict set template per type | 上游 projection / record 使用,当前 Step 06 未闭口 | `R06.2`,逐类型卡 |
| `HandoffSurface`;`JobReportSurface` | `HX` | §7.4 capability 表点名但无 schema；Step 08 有其他正式 result/report surface | R06.2排除；canonical job类型为`ObservationJobReportSurface`,R06.6回灌 |
| `SubmissionPurpose`;`SafeSignalKind`;`EvidenceOriginKind`;`GapKind`;`ReadVisibilityKind` 等 domain-facing finite type | `FC` | 主对象字段已使用,部分只有名称或后置 enum | owning object batch,先在 `R06.2` 建 owner registry |
| 所有 `*Reason` / `*Marker` / `*Summary` / `*Decision` / `*Result` 参数载体 | `FC` / `ET` / `DX` 逐项裁定 | 当前 member signature 大量引用未定义 support type；禁止实现侧补 local enum/string | `R06.8` 前必须 zero-unowned-support-type |

support carrier 总账是后续批次的硬门禁,不是允许继续用模糊名称的豁免。`R06.2` 先建立 owner registry；每个 owning object 批次在对象卡中完成 exact schema / external reference / defer 决议。

### 6.5 `domain` 与 public projection inventory

#### 6.5.1 intake / correlation / signal / audit / evidence

本组 current authoritative schema 统一位于 `03_ddd_step_06_domain_truth_signal_audit.md`：shared/state/support见§7~§9，七个 truth object见§10~§15，字段来源、rehydration、状态与跨对象顺序见§17~§18。下表保留 inventory 主键，但修复前 definition 状态已被该专项替换。

| 对象 | 资格 | 当前 definition 状态 | 目标批次 | 独立卡必须闭口 |
|---|---|---|---|---|
| `ObservationReceipt` | `FC` | R06.3专项§10.2 authoritative | `R06.3` | aggregate fields、factory、transitions、record output、state owner |
| `ObservationReceiptState` | `FC` | R06.3专项§8.1 authoritative | `R06.3` | 6 variants、terminal/reserved、trigger mapping |
| `SafetyDisposition` | `FC` | R06.3专项§11.2 authoritative | `R06.3` | forbidden-body/redaction fields、factory、transition、summary source |
| `SafetyDispositionState` | `FC` | R06.3专项§8.2 authoritative | `R06.3` | 5 variants、terminal rule、safe/redacted distinction |
| `CorrelationContext` | `FC` | R06.3专项§12.2 authoritative | `R06.3` | opaque trace/causation、source relation、degraded/invalid behavior |
| `CorrelationContextState` | `FC` | R06.3专项§8.3 authoritative | `R06.3` | 4 variants 与 exact trigger |
| `SafeSignal` | `FC` | R06.3专项§13.2 authoritative | `R06.3` | kind/summary/runtime ref、record/suppress/stale semantics |
| `SafeSignalState` | `FC` | R06.3专项§8.4 authoritative | `R06.3` | candidate/recorded/stale/suppressed 与 reserved rule |
| `SignalRollupWindow` | `FC` | R06.3专项§13.3 authoritative | `R06.3` | full fields、factory、accept/seal/rebuild/fail、cursor source |
| `SignalRollupState` | `FC` | R06.3专项§8.5 authoritative | `R06.3` | variants、state owner、member triggers |
| `AuditProjection` | `FC` | R06.3专项§14.2 authoritative | `R06.3` | append-only projection semantics、visibility、gap attach、source audit boundary |
| `AuditProjectionState` | `FC` | R06.3专项§8.6 authoritative | `R06.3` | pending/appended/restricted/body-blocked/suppressed semantics |
| `EvidenceLinkage` | `FC` | R06.3专项§15.2 authoritative | `R06.3` | structured boundary ref、digest、visibility、body exclusion |
| `EvidenceLinkageState` | `FC` | R06.3专项§8.7 authoritative | `R06.3` | candidate/linked/missing/not-visible/body-blocked variants |

#### 6.5.2 handoff / retention / read / gap / reference / maintenance

本组 current authoritative schema 统一位于`03_ddd_step_06_boundary_read_maintenance.md`：capability/owner见§4~§5，support、truth/state object和transition见§8~§11，六个public view见§12，字段来源/rehydration/状态/affected-only/no-write/承接审计见§13~§18。下表保留修复inventory主键；其中“已有独立卡/family row/Step10反向补入”等旧状态均已由该专项替换，不再是current definition。

| 对象 | 资格 | 当前 definition 状态 | 目标批次 | 独立卡必须闭口 |
|---|---|---|---|---|
| `ReportHandoffRecord` | `FC` | R06.4专项§10.1 authoritative | `R06.4` | lifecycle/readiness co-state、immutable evidence input、non-signoff |
| `ReportHandoffState` | `FC` | R06.4专项§11.3 authoritative | `R06.4` | draft/prepared/delivered/failed/cancelled 与 triggers |
| `HandoffReadinessState` | `FC` | R06.4专项§11.3 authoritative | `R06.4` | pending/ready/blocked/degraded policy output,不得等同 lifecycle |
| `AuthenticityHint` | `FC` | R06.4专项§10.2 authoritative | `R06.4` | evidence origin、placeholder、insufficient gaps、non-fabrication |
| `AuthenticityHintState` | `FC` | R06.4专项§11.3 authoritative | `R06.4` | 4 variants 与 member triggers |
| `RetentionMarker` | `FC` | R06.4专项§8.4 authoritative | `R06.4` | protection relation、hold/release/conflict、no cleanup |
| `RetentionMarkerState` | `FC` | R06.4专项§11.2 authoritative | `R06.4` | unmarked/hold/release-eligible/released/conflict |
| `ActiveReferenceProtection` | `FC` | R06.4专项§8.5 authoritative | `R06.4` | consumer set、expiry/conflict/release、protected-ref relation |
| `ActiveReferenceProtectionState` | `FC` | R06.4专项§11.2 authoritative | `R06.4` | unprotected/protected/expired/released/conflicted |
| `ReplayScope` | `FC` | R06.4专项§8.6 authoritative | `R06.4` | canonical targets、allowed effect、approve/block/close、no source repair |
| `ReplayScopeState` | `FC` | R06.4专项§11.2.1 authoritative | `R06.4` | defined/approved/blocked/completed/cancelled |
| `NoWriteViolation` | `FC` | R06.4专项§8.7 authoritative | `R06.4` | trigger context、forbidden target、block/escalate/close、no repair claim |
| `NoWriteViolationState` | `FC` | R06.4专项§11.2.2 authoritative | `R06.4` | detected/blocked/escalated/closed |
| `ReadVisibilityState` | `FC` | R06.4专项§9.8 authoritative | `R06.4` | kind/context/constraint/gap、query no-write、not-visible != missing |
| `ReadVisibilityKind` | `FC` | R06.4专项§11.4 authoritative | `R06.4` | visible/restricted/not-visible/blocked |
| `DiagnosticScope` | `FC` | R06.4专项§9.9 authoritative | `R06.4` | canonical target set、time window、visibility scope、stable identity |
| `DiagnosticTimeWindow` | `FC` | R06.4专项§9.2 authoritative | `R06.4` | bounded interval、ordering、clock/source |
| `DiagnosticRequestContext` | `FC` | R06.4专项§9.10 authoritative | `R06.4` | one-shot actor/scope/visibility/time、never persisted by Query |
| `DiagnosticSummary` | `FC` | R06.4专项§9.11 authoritative | `R06.4` | safe signal/gap/violation sets、freshness、immutable replacement |
| `DiagnosticFreshnessState` | `FC` | R06.4专项§11.4 authoritative | `R06.4` | fresh/stale/partial/unavailable |
| `GapState` | `FC` | R06.4专项§9.12 authoritative | `R06.4` | structured gap source、kind、affected ref、ack/mitigate/close |
| `GapLifecycleState` | `FC` | R06.4专项§11.2.3 authoritative | `R06.4` | open/acknowledged/mitigated/resolved/suppressed |
| `DegradedOutputState` | `FC` | R06.4专项§9.13 authoritative | `R06.4` | reason/gap/state、allow-limited/block、no synthetic success |
| `DegradedOutputKind` | `FC` | R06.4专项§11.5 authoritative | `R06.4` | none/active/blocked |
| `PeripheralDeliveryState` | `FC` | R06.4专项§9.19 authoritative | `R06.4` | consumer/view/preparation relation、delivery result、non-truth write |
| `PeripheralDeliveryKind` | `FC` | R06.4专项§11.5 authoritative | `R06.4` | pending/prepared/delivered/failed/blocked/cancelled |
| `ExternalAuditExportPreparation` | `FC` | R06.4专项§9.20 authoritative | `R06.4` | consumer/view/visibility、prepare/block/deliver、handoff distinction |
| `ExportPreparationState` | `FC` | R06.4专项§11.5 authoritative | `R06.4` | draft/prepared/blocked/delivered/failed |
| `ReferenceSnapshotState` | `FC` | R06.4专项§9.21 authoritative | `R06.4` | subject/source version/safe summary、six resolution states、no external lifecycle |
| `ReferenceSnapshotStateKind` | `FC` | R06.4专项§11.6 authoritative | `R06.4` | pending/resolved/stale/unresolved/invalid/unavailable exact set audit |
| `ProjectionMaintenanceState` | `FC` | R06.4专项§9.22 authoritative | `R06.4` | target/progress、missing projection starts stale、schedule/start/complete/fail |
| `ProjectionMaintenanceStateKind` | `FC` | R06.4专项§11.6 authoritative | `R06.4` | fresh/stale/rebuilding/failed |
| `ReplayCoordinationState` | `FC` | R06.4专项§9.23 authoritative | `R06.4` | scope/no-write/retention relation、coordinate/block/complete/fail |
| `ReplayCoordinationKind` | `FC` | R06.4专项§11.6 authoritative | `R06.4` | pending/coordinating/blocked/completed/failed |
| `RollupRebuildState` | `FC` | R06.4专项§9.24 authoritative | `R06.4` | window/cursor/count、start/complete/fail/cancel |
| `RollupRebuildKind` | `FC` | R06.4专项§11.6 authoritative | `R06.4` | pending/running/completed/failed/cancelled |

#### 6.5.3 public projection / read-model 对象

这些对象的 public schema owner 按 Step 05 固定为 `contracts::views`;`domain` 提供状态 / policy 输入,`application` 组装,`infra` 只实现 lookup / persistence mapping。R06.3五个 view 的 current authoritative schema 位于 `03_ddd_step_06_domain_truth_signal_audit.md` §16；R06.4六个 view 的 current authoritative schema位于`03_ddd_step_06_boundary_read_maintenance.md` §12。Step 08 同名/旧名 schema全部降为待传播 use。

| 对象 | 资格 | 当前 definition 所在 | 目标批次 | 必须闭口的 identity / body 规则 |
|---|---|---|---|---|
| `IntakeStatusView` | `FC` | R06.3专项§16.2 authoritative | `R06.3` | receipt/safety/admission refs、visibility/freshness、body-free |
| `SafeSignalProjectionView` | `FC` | R06.3专项§16.3 authoritative | `R06.3` | signal identity、safe summary、state/visibility/freshness |
| `SignalRollupView` | `FC` | R06.3专项§16.4 authoritative | `R06.3` | window identity、count/kind/state/cursor/freshness |
| `AuditTimelineView` | `FC` | R06.3专项§16.5 authoritative | `R06.3` | timeline window、append refs、visibility、stable order |
| `EvidenceIndexInputView` | `FC` | R06.3专项§16.6 authoritative | `R06.3` | immutable body-free linkage/audit/gap input；Query preview与Command snapshot区分 |
| `ObservationReadModel` | `FC` | R06.4专项§12.2 authoritative | `R06.4` | stable generated ref、canonical scope、constituent refs、freshness marker |
| `DiagnosticView` | `FC` | R06.4专项§12.3 authoritative | `R06.4` | stable view/scope/marker、fresh immutable summary、composite invariant |
| `GapStatusView` | `FC` | R06.4专项§12.4 authoritative | `R06.4` | identity复用`GapStateRef`、kind/lifecycle/degraded/visibility |
| `DashboardAlertExportView` | `FC` | R06.4专项§12.5 authoritative | `R06.4` | consumer+scope stable identity、read/diagnostic/gap refs、product neutral |
| `ReferenceSnapshotView` | `FC` | R06.4专项§12.6 authoritative | `R06.4` | snapshot identity、resolution/source version/safe summary/freshness；single snapshot无aggregate counts |
| `RebuildProgressView` | `FC` | R06.4专项§12.10 authoritative | `R06.4` | target-bound stable identity、maintenance/rebuild refs、no repair claim |

#### 6.5.4 policy / guard 对象

`DomainPolicy<P, R>` 最多可作为 private implementation helper,不能替代以下 18 个 public/internal policy 类型。每个 policy 都有不同输入、输出、rule snapshot、错误、禁止事项与测试红线,因此全部为 `FC`。

| # | Policy object | capability | R06.5-A current status | exact-card 子批次 |
|---|---|---|---|---|
| P1 | `IntakeAdmissionPolicy` | source/purpose/disposition 准入；唯一产生target-bound `AdmissionDecision` | inventory_fixed；decision owner reserved | C |
| P2 | `SafetyDispositionPolicy` | material summary 安全分类 | inventory_fixed；decision owner reserved | C |
| P3 | `SafeSignalPolicy` | correlation/summary/kind 安全判定 | inventory_fixed；复用`SignalDecision` | C |
| P4 | `BodyFreeLinkagePolicy` | evidence boundary body-free 校验 | inventory_fixed；structural guard exception | C |
| P5 | `EvidenceVisibilityPolicy` | evidence visibility | inventory_fixed；复用两个visibility decision | C |
| P6 | `AuthenticityHintPolicy` | evidence/gap authenticity hint | inventory_fixed；decision owner reserved | C |
| P7 | `HandoffReadinessPolicy` | handoff readiness | inventory_fixed；复用`HandoffReadinessDecision` | D |
| P8 | `RetentionProtectionPolicy` | marker/protection 冲突判定 | inventory_fixed；复用marker/release decisions | D |
| P9 | `ReplayBoundaryPolicy` | replay scope / no-write 审批 | inventory_fixed；复用`ReplayApprovalSnapshot` | D |
| P10 | `NoWriteGuardPolicy` | forbidden target guard | inventory_fixed；decision owner reserved | D |
| P11 | `ReadVisibilityPolicy` | read context / visibility 输出 | inventory_fixed；复用`ReadVisibilityDecision` | D |
| P12 | `GapClassificationPolicy` | source/snapshot/visibility gap 分类 | inventory_fixed；decision owner reserved | D |
| P13 | `DegradedOutputPolicy` | gap/safety/visibility degraded 输出 | inventory_fixed；decision owner reserved | E |
| P14 | `PeripheralExportPolicy` | consumer/view/visibility export guard | inventory_fixed；复用delivery/preparation decisions | E |
| P15 | `ReferenceFreshnessPolicy` | snapshot refresh guard | inventory_fixed；decision owner reserved | E |
| P16 | `AdapterBoundaryPolicy` | product-neutral adapter output guard | inventory_fixed；structural guard exception | E |
| P17 | `DerivedMaintenancePolicy` | maintenance target/authorization guard | inventory_fixed；复用`MaintenanceExecutionAuthorization` | E |
| P18 | `ReplayCoordinationPolicy` | scope/retention/no-write coordination | inventory_fixed；decision owner reserved | E |

`MaintenanceExecutionAuthorization` 是 `DerivedMaintenancePolicy` 的 domain-only target-bound output，current exact fields/authorization mode位于R06.4专项§9.18；R06.5只闭口其唯一producer与rule snapshot，不得重定义。`ApprovedReplay(ReplayScopeRef)` 必须使用已加载且 Approved 的 versioned object,不能由临时/default scope 构造。

#### 6.5.5 append-only record 对象

`ObservationHistoryRecord { change_kind: String }` 不能作为以下 persisted record 的正式 schema,因为它丢失 typed kind、reason、subject owner、transition delta、trace/audit flag 和多字段构造时点。它当前标记 `UR-REC-BASE`;`R06.5` 只能将其裁定为 private generic helper 或删除,不得作为 repository persisted row。

| # | Record object | exact subject | R06.5-A current status | exact-card 子批次 |
|---|---|---|---|---|
| H1 | `IntakeDecisionRecord` | `ObservationReceiptRef` | exact；receipt/safety tagged source、9 kinds、three-input factory、validated rehydrate | F done |
| H2 | `CorrelationLinkRecord` | `CorrelationContextRef` | exact；context/direct signal linkage、explicit no-record branches、validated rehydrate | F done |
| H3 | `AuditAppendRecord` | projection/linkage tagged subject | exact；复用`AuditAppendRecordRef/AuditAppendKind`并分离linkage lifecycle | F done |
| H4 | `HandoffLifecycleRecord` | handoff/hint tagged subject | exact；readiness/lifecycle/delivery/authenticity provenance分离 | F done |
| H5 | `RetentionChangeRecord` | marker/protection tagged subject | exact；P8 two-stage各自PK，共享cursor但不推断intra-UoW顺序 | F done |
| H6 | `NoWriteViolationRecord` | `NoWriteViolationRef` | exact；existing transition only，P10 Blocked不伪造record | F done |
| H7 | `ReadAccessRecord` | `DiagnosticRequestContextRef` | exact schema + validated future shape；phase_reserved，current sync Query无writer/rehydrate | F done |
| H8 | `GapTransitionRecord` | `GapStateRef` | inventory/input coverage fixed；exact schema pending | G |
| H9 | `PeripheralDeliveryRecord` | delivery/preparation tagged subject | inventory/input coverage fixed；exact schema pending | G |
| H10 | `ReferenceRefreshRecord` | `ReferenceSnapshotStateRef` | inventory/input coverage fixed；exact schema pending | G |
| H11 | `ProjectionMaintenanceRecord` | projection/rollup tagged maintenance subject | inventory/input coverage fixed；exact schema pending | G |
| H12 | `GapScanRecord` | exact gap `MaintenanceTargetRef` | R06.6 immutable item result input reserved；exact schema pending | G |
| H13 | `ReplayExecutionRecord` | scope + exact coordination + target | per-target input coverage fixed；exact schema pending | G |

每个 record 独立卡必须包含 exact typed record ref、subject、typed change kind、typed reason / basis、actor/system owner、recorded time、trace/correlation ref、audit visibility、factory 字段来源和 append-only 禁止事项。R06.5-A 已裁定不生成概要 `*RecordId` / current `*RecordRef` 双类型；record factory固定消费successful transition或accepted immutable item result、same-UoW post-mutation snapshot与typed `ObservationRecordMetadata`，不能仅凭delta或current truth重建历史。

#### 6.5.6 R06.5-B shared policy / record / error foundation

| object / group | qualification | authoritative owner | current status / boundary |
|---|---|---|---|
| `PolicyBasisRef` | `TC` | `contracts::refs` | exact；resolved immutable snapshot identity，不是infra `PolicyBindingRef` |
| 12个new record refs + reused `AuditAppendRecordRef` | 13个独立`TC` | `contracts::refs` | exact；application id generator mint，无generic PK或`*RecordId` alias |
| `PolicyFamily`;`PolicyRevision`;`PolicyEvaluationBasis` | `FC` | `domain::policies` | exact；18-family/ref/revision/digest，不含rule body或authorization truth |
| `ObservationRecordOrigin`;`RecordAuditVisibility`;`ObservationRecordMetadata<R>` | `FC` | `domain::records` | exact；typed ref/actor/time/trace/causation/visibility/tagged commit cursor；不复制R06.6 operation namespace |
| `DomainRelationMismatchKind`;`PolicyBasisMismatchKind`;`RecordConstructionMismatchKind`;`DomainError` | `FC` | `domain::errors` | exact；20 top-level variants，expected blocked/denied/not-ready仍归typed decision |

authoritative schema只见`03_ddd_step_06_policy_guard_records.md` §§14~17。Step04仍写`history.rs`，与current logical owner `domain::records`存在affected naming conflict，必须在R06.8统一后才能作为实现文件布局；不得同时创建`history`与`records`两个owner module。

#### 6.5.7 R06.5-C P1~P6 concrete policy closure

| policy | exact output / exception | complete observed input | unique owning member | current evidence |
|---|---|---|---|---|
| P1 `IntakeAdmissionPolicy` | `AdmissionDecision` | policy basis + complete receipt + post-safety disposition | `ObservationReceipt::apply_admission(..., &decision)` | R06.5专项§§20~21；R06.3专项§10/§22 |
| P2 `SafetyDispositionPolicy` | `SafetyDispositionDecision` | policy basis + complete receipt/pending disposition + summary/context | `SafetyDisposition::apply_decision(..., &decision)` | R06.5专项§§20/22；R06.3专项§9.11/§11/§22 |
| P3 `SafeSignalPolicy` | extended `SignalDecision` | policy basis + candidate + complete correlation + label/runtime assessment | `SafeSignal::apply_decision(..., &decision)` | R06.5专项§23；R06.3专项§9.21/§13/§22 |
| P4 `BodyFreeLinkagePolicy` | structural `Result<(), DomainError>` only | projection + boundary + purpose/scope + digest | no direct mutation；success后仍须Candidate factory + P5 | R06.5专项§24 |
| P5 `EvidenceVisibilityPolicy` | extended linkage/projection visibility decisions | basis + complete linkage/projection/boundary/digest or global assessment | `EvidenceLinkage::apply_visibility`；projection restrict/restore借用decision | R06.5专项§25；R06.3专项§9.36~§9.39/§14~§15/§22 |
| P6 `AuthenticityHintPolicy` | `AuthenticityHintDecision` | basis + complete hint/handoff/input/linkage/origin/gap snapshots | `AuthenticityHint::apply_decision(..., &decision)` | R06.5专项§26；R06.4专项§10.2/§20 |

C批共计40个new explicit Rust type与3个existing decision authoritative extension。所有policy持有完整`PolicyEvaluationBasis`并按`material-v1` canonical framing验证typed rule material digest；decision constructor均为`pub(crate)`且仅对应policy可调用。expected Reject/Quarantine/Degrade/Suppress/NotVisible/Placeholder/Insufficient均是typed outcome，不滥用`DomainError`；任何error保持loaded object、identity、record、outbox与external port零副作用。

contracts affected definition已同步：`EvidenceOriginResolution`唯一owner为`contracts::metadata`，只作为`GovernanceArtifactEvidenceResolver` resolved safe summary的一部分；它不得成为Command/config字段或直接转换成persisted`EvidenceOriginKind`。R06.3/R06.4 affected objects只收窄public mutation入口并扩展complete snapshot binding，不改变truth owner或正式概要的18个policy主语。

#### 6.5.8 R06.5-D P7~P12 concrete policy closure

| policy | exact output | complete observed input | unique consumption / assembly boundary | current evidence |
|---|---|---|---|---|
| P7 `HandoffReadinessPolicy` | extended `HandoffReadinessDecision` | handoff + committed immutable input/cursor + current consumer + hint + complete gap revisions/effective subset + marker/protection + P10 | `ReportHandoffRecord::{apply_readiness,prepare,block}`借用decision；Ready必要条件total | R06.5专项§§32.1/33；R06.4专项§10.1/§21 |
| P8 `RetentionProtectionPolicy` | extended `ActiveProtectionReleaseDecision` + `RetentionMarkerDecision` | complete protection + 21 current consumer states；随后marker + accepted protection post-state | `ActiveReferenceProtection::apply_release_decision`先于`RetentionMarker::apply_decision`；KeepActive/Conflict retained | R06.5专项§§32.2/34；R06.4专项§§8.4~8.5/§21 |
| P9 `ReplayBoundaryPolicy` | extended `ReplayApprovalSnapshot` | Defined scope + six-target exact effect matrix + one opaque marker/protection lookup snapshot and P10 decision per target | `ReplayScope::apply_boundary_decision`唯一public policy入口；global representative非法 | R06.5专项§§32.3/35；R06.4专项§§8.6/9.6/§21 |
| P10 `NoWriteGuardPolicy` | `NoWriteGuardDecision` | exact trigger identity/kind/scope + tagged local or forbidden target + effect | decision only；handoff/replay/query/maintenance identity total binding；local Blocked不伪造forbidden ref | R06.5专项§§32.4/36 |
| P11 `ReadVisibilityPolicy` | extended `ReadVisibilityDecision` | one-shot request/actor + committed target/projection/freshness + source provenance + complete gaps + P10 | synchronous Query只借用decision组装response；无state/H7/outbox/idempotency writer | R06.5专项§§32.5/37/42；R06.4专项§§9.6.1/9.8/§21 |
| P12 `GapClassificationPolicy` | `GapClassificationDecision` | source/affected binding + finite reference/visibility/safety basis | `GapState::open_from_decision`唯一public opening factory；NoGap不建对象 | R06.5专项§§32.6/38；R06.4专项§9.12/§21 |

D批机械类型账为77个唯一new `pub struct/enum`，另有5个existing decision authoritative extension、1个existing domain enum extension `ActiveProtectionReleaseOutcome::Protected`和3个contracts affected groups。77个new type均只有一个声明owner；五个reused decision与enum extension均只在R06.4 canonical owner声明。跨crate边界已明确区分：decision constructor保持domain `pub(crate)`，application组装loaded snapshot/binding使用字段private、无serde/default的public Rust domain factory，避免不可编译的`pub(crate)`跨crate调用，也不把policy outcome开放给application伪造。

#### 6.5.9 R06.5-E P13~P18 concrete policy closure

| policy | exact output / exception | complete observed input | unique consumption / assembly boundary | current evidence |
|---|---|---|---|---|
| P13 `DegradedOutputPolicy` | `DegradedOutputDecision::{Normal,Limited,Blocked}` | exact affected object/scope + P11 complete decision + explicit safety + all gap revisions | Query只映射surface；durable `create/replace_from_decision`换new revision identity | R06.5专项§47；R06.4专项§§9.13/11.8.5/22 |
| P14 `PeripheralExportPolicy` | existing `ExportPreparationDecision` / `PeripheralDeliveryDecision` | respective complete preparation/delivery + consumer/view/input + freshness/gaps + retention/protection + P10 + optional P13 | preparation/delivery public members同时借用complete input与decision；adapter result独立 | R06.5专项§48；R06.2专项§26；R06.4专项§§9.15~9.20/22 |
| P15 `ReferenceFreshnessPolicy` | `ReferenceFreshnessDecision` | complete current snapshot + resolver result + adapter family + typed version relation + exact target + P10 | reference mutation还须same-target P17 Authorized；Invalid recovery使用new snapshot identity | R06.5专项§49；R06.4专项§§9.21/22 |
| P16 `AdapterBoundaryPolicy` | structural `Result<(), DomainError>` only | trusted mapper family + subject + safe summary owner + source-version stream | success不产生proof/status/decision；P15重新校验相同结构 | R06.5专项§50 |
| P17 `DerivedMaintenancePolicy` | `DerivedMaintenanceDecision::{Authorized,Blocked}`内嵌maintenance-owned authorization | target + complete scope set + typed dependency namespaces/availability + Scheduled/ApprovedReplay mode + P10 | projection/reference/rollup start借用完整decision；裸authorization只作private helper | R06.5专项§51；R06.4专项§§9.18/9.21~9.24/22 |
| P18 `ReplayCoordinationPolicy` | `ReplayCoordinationDecision::{Start,Blocked}` | existing Pending coordination + Approved scope + one exact current target boundary + P17 + P10 | `apply_policy_decision`只推进Coordinating/Blocked；不迭代scope、不生成changed/violation/job | R06.5专项§52；R06.4专项§§9.23/11.8.10/22 |

E批机械类型账为66个唯一new `pub struct/enum`：56个shared carrier + 10个policy/decision。`MaintenanceExecutionAuthorization`不计new type且唯一owner统一为`domain::maintenance`；P14两个existing decision只作complete-input/basis extension。contracts仅扩展`PeripheralBlockReason`两个variant，不承载policy、decision、complete domain snapshot或authorization DTO。

P13/P15 complete rule universe分别固定120/180 key；P14固定40/4/4；P16固定13 family；P17固定4 pair；P18固定6 row。任何missing/extra/duplicate/unsafe material、stale decision或cross-target binding均返回typed error且zero mutation。六个policy evaluation均不调用repository、resolver、adapter、clock、id generator、writer、record/outbox或job/claim。

P9六类current target均是marker presence Optional，但marker/protection lookup Required；只有repository `Ok(None)`分支可形成opaque snapshot的None，错误、未加载或partial batch不能冒充absence。P10绑定query request context、handoff/preparation、maintenance target与replay scope identity。P11 Blocked gap只能来自source visibility provenance，不能借用unrelated diagnostic gap。P12固定792 key、88 `RejectInconsistentSnapshot`、704 explicit outcome，no-write/retention block alone保持NoGap。

### 6.6 `application` 对象 inventory

#### 6.6.1 operation / context / idempotency / stored result

| 对象 | 资格 | 当前状态 | `R06.6` 独立卡重点 |
|---|---|---|---|
| `ObservationOperationName` | `FC` | R06.6-A 独立卡已完成 | family discriminator、合法 operation set、no free-text |
| `ObservationCommandOperation` | `FC` | R06.6-A 独立卡已完成；16 variants | exact variants / route map / digest use |
| `ObservationQueryOperation` | `FC` | R06.6-A 独立卡已完成；14 variants | owner、query no-idempotency、route map |
| `ObservationInboundConsumerOperation` | `FC` | R06.6-A 独立卡已完成；9 variants | producer/source static map use |
| `ObservationJobOperation` | `FC` | R06.6-A 独立卡已完成；9 variants | public job name / invocation exact map |
| `ObservationInboundEventIdentity` | `FC` | R06.6-A 独立卡已完成 | consumer+producer+source event uniqueness |
| `ObservationOperationContext` | `FC` | R06.6-A 独立卡已完成 | four factories、metadata source、family-specific required/forbidden fields |
| `ObservationIdempotencyScope` | `FC` | R06.6-A 独立卡已完成 | actor+operation+key canonical identity |
| `ObservationIdempotencyReservation` | `FC` | R06.6-A 独立卡已完成 | atomic reserve owner、digest/event uniqueness、result-before-complete |
| `IdempotencyReservationState` | `FC` | R06.6-A 独立卡已完成；与 reservation 生命周期分离 | only Reserved -> Completed;incoming outcomes不是state |
| `ObservationIdempotencyReserveOutcome` | `FC` | R06.6-A 独立卡已完成 | Acquired/Replay/Conflict/InFlight payload and no-write rule |
| `StoredObservationResultKind` | `FC` | R06.6-B 独立卡已完成 | four exact kinds / protocol surface match |
| `StoredObservationReplaySurface` | `FC` | R06.6-B 独立卡已完成 | schema version、body-free bytes、digest、roundtrip invariant |
| `BodyFreeSerializedResult` | `FC` | R06.6-B 独立卡已完成 | bounded immutable bytes、safe Debug、schema-owned decoding |
| `StoredObservationResult` | `FC` | R06.6-B 独立卡已完成 | immutable exact replay、actor/scope/digest/kind match |
| `OperationResultDisposition` | `FC` | R06.6-B 独立卡已完成 | finite result classification、stored kind compatibility |

#### 6.6.2 outbox / job plan / claim / external effect

| 对象 | 资格 | 当前状态 | `R06.6` 独立卡重点 |
|---|---|---|---|
| `OutboxRecordRef`;`OutboxPayloadSnapshotRef`;`OutboundEventRef`;`DeadLetterRef` | `TC` | R06.6-B 独立 mint/use 卡已完成；canonical declaration=`contracts::refs` | public low-dependency identity、application-only mint、no cross-wrapper conversion |
| `BodyFreeSerializedEvent`;`ObservationOutboxPayloadSnapshot` | `FC` | R06.6-B 独立卡已完成 | compile-time byte ceiling、immutable exact bytes、historical binding、protocol/application snapshot split |
| `PublicationReceipt`;`PublicationFailureKind`;`PublicationFailure`;`DeadLetterReason` | `FC` | R06.6-B 独立卡已完成 | body-free exact snapshot compatibility、finite failure/reason、no provider body |
| `ObservationOutboxRecord` | `FC` | R06.6-B 独立卡已完成 | immutable snapshot pair、cursor/state/receipt/failure/dead-letter reason+ref |
| `OutboxPublicationState` | `FC` | R06.6-B 独立卡已完成 | Pending/Published/Failed/DeadLettered,Failed不回Pending |
| `HandoffDeliveryPreparationRef` | `TC` | R06.6-C 独立 mint/use 卡已完成；canonical declaration=`contracts::refs` | public Job output identity、application result/token relation、no contracts -> application dependency |
| `ExternalEffectBindingRef`;`ExternalEffectPhase` | `FC` | R06.6-C 独立卡已完成；canonical owner=`application::runtime` | opaque retained revision、finite five phases、no locator/credential、Step14只派生/装配 |
| `ExternalEffectIntentRef` | `FC` | R06.6-C 独立卡已完成 | generated local phase identity；publication不mint该ref |
| `ObservationPublicationToken`;`HandoffPreparationToken`;`HandoffDeliveryToken`;`ExportPreparationToken`;`ExportDeliveryToken` | `FC` | R06.6-C 五张独立卡已完成 | private fields、named factory、exact historical binding/material equality、no attempt/claim/clock |
| `ExternalEffectIntent` | `FC` | R06.6-C 独立卡已完成 | four-variant tagged append-once landing；no nullable union / second lifecycle |
| `HandoffDeliveryPreparation`;`HandoffDeliveryReceipt`;`PeripheralExportPackage` | `FC` | R06.6-C 三张独立卡已完成 | exact source-token retention、append-once body-free result、one result per intent |
| `PublicationProbeOutcome`;`ExternalPreparationProbe<T>`;`ExternalDeliveryProbe<T>` | `FC` | R06.6-C 三张独立卡已完成 | four-way positive/formal-negative/unknown/unsupported；positive exact-token compatibility |
| `ObservationJobExecutionRef` | `FC` | D-2独立卡已完成；D专项§9 | application-generated accepted execution identity；public=`JobRunId` correlation、real run absent、no alias |
| `ObservationJobExecutionPlanRef` | `FC` | D-2独立卡已完成；D专项§10 | independent generated plan PK、unique execution/idempotency lookup、resume no replacement |
| `ObservationFencingToken` | `FC` | D-2独立卡已完成；D专项§11 | `NonZeroU64`、same-subject fresh acquire strictly monotonic、renew stable、exhaustion fail closed |
| `ObservationJobWorkKey` | `FC` | D-2独立卡已完成；D专项§12 | nine typed variants、versioned canonical bytes、global uniqueness；snapshot/peripheral owner conflicts resolved |
| `ObservationJobPlanItemState` | `FC` | D-3 independent card completed | planned/running/finalizable states、retry/blocked/skipped semantics |
| `ObservationJobPlanItemOutcome` | `FC` | D-3 independent card completed；R06.8-B dead-letter addendum已同步 | mutually consistent classification + H12 typed accepted-result compatibility；private association固定11 tags，含exact `publication_dead_letter` |
| `ObservationJobPlanItem` | `FC` | D-3 independent card completed | immutable planned material + mutable CAS classification |
| `ObservationJobExecutionPlan` | `FC` | D-4 independent card completed；D专项§26 | immutable canonical work-set/config snapshot、resume no-relist |
| `ObservationExecutionClaimState` | `FC` | D-5 independent card completed | durable Active/Released/Expired authority，独立状态卡已闭口 |
| `ObservationExecutionClaim` | `FC` | D-5 independent card completed | claim identity/plan/subject/owner/lease/heartbeat/fence与commit-time authority已闭口 |
| `JobExecutionConfigSnapshot` | `FC` | D-4 independent card completed；D专项§25 | typed executable values随plan持久化；resume不热读current config |

#### 6.6.3 decision / report / service objects

| 对象 | 资格 | 当前状态 | `R06.6` 独立卡重点 |
|---|---|---|---|
| `ObservationVisibilityDecision` | `HX` | 历史 §7.7 名称，已排除 | canonical 类型为 R06.4 `domain::read::ReadVisibilityDecision`；application 不得创建第二 visibility authority |
| `ProjectionScopeItemReport` | `FC` | entry carrier段合写 | canonical scope one-row rule、durable report ownership |
| `ProjectionScopeItemOutcome` | `FC` | 与 item report 合写 | success refs vs failed reason/gaps mutual exclusion |
| `ObservationJobReportDraft` | `FC` | 仅在大表给字段/函数 | plan/execution/digest/fence/ref-set/item consistency、terminal seal |
| `JobReportState` | `FC` | Step 10 反向补入 | Draft + five terminal outcomes；DuplicateReplayed非stored state |
| `JobError` | `FC` | 与 report 合写 | report mutation error only,不得成为 public code |
| `ObservationConsumerDisposition` | `HX` | E 批确认其混合 public/stored/entry 语义 | historical exclusion；不得恢复为 current owner；分别使用application result、public outcome与C-05 exact completion，且不存在generic `EntryDisposition` |
| `ObservationJobDisposition` | `HX` | E 批确认其混合 public/report/entry 语义 | historical exclusion；`JobReportState`、application Job result、C-08/C-09 callback与public job outcome分别拥有，不新增entry-local generic disposition |
| `ApplicationError` | `FC` | E 批已完成唯一 owner与safe-detail闭合 | `application::errors` 唯一 current owner；Step 07/12 只做 affected mapping，不复制 enum |
| `ObservationTruthWriteService` | `FC` | E dependency inventory由R06.8-B收敛 | 四个 entry-callable façade之一；no source write / no public outcome |
| `ObservationReadService` | `FC` | E dependency inventory由R06.8-B收敛 | 四个 entry-callable façade之一；不注入UoW写入、idempotency、outbox或repair |
| `ObservationInboundEventService` | `FC` | E dependency inventory由R06.8-B收敛 | 四个 entry-callable façade之一；ack/dead-letter仍属entry层 |
| `ObservationOperationsJobService` | `FC` | R06.8-B统一原maintenance与publication entry职责 | 四个 entry-callable façade之一；九个 Operations Job 方法统一闭合plan/claim/report/stored-result lifecycle |
| `ObservationMaintenanceService` | `HX` | historical E façade，已被R06.8-B supersede | 八个方法语义迁移到`ObservationOperationsJobService`；无compatibility alias或第二entry handle |
| `ObservationPublicationService` | `FC` | R06.8-B收窄为`pub(crate)` concrete collaborator | 只消费一个已plan/claim的publication item；不是trait、worker façade、runtime assignment field或第五entry authority |

四个 entry-callable service 的 callable 细签名与 port trait 仍由 Step 07承接；crate-private publication collaborator只承接R06.8-B §6的exact callable，不得升级为port trait。Step 06 必须先闭口 service struct / constructor dependency owner、每类 capability、input/output carrier和禁止依赖；不能只保留一个代表函数。

### 6.7 runtime / infra / entry stable carrier inventory

#### 6.7.1 application-owned runtime availability

| 对象 | 资格 | 当前状态 | 目标批次 |
|---|---|---|---|
| `AdapterAvailabilityScope` | `FC` | R06.7-B独立对象卡已完成；family scope与三类exact-effect scope关系闭合 | `R06.7-B` |
| `AdapterAvailabilityState` | `FC` | R06.7-B独立对象卡已完成；immutable scope/kind/observed_at snapshot闭合 | `R06.7-B` |
| `AdapterAvailabilityKind` | `FC` | R06.7-B独立对象卡已完成；四态、来源、谓词与unknown处理闭合 | `R06.7-B` |

三者的语义 owner 是 `application::ports::runtime`,infra 只构造 snapshot；family aggregate不能授权具体 external effect。`AdapterAvailabilityProbe` trait 继续由 Step 07定义,标记 `DX-Step07`,不在本批写 trait。

#### 6.7.2 api / worker / jobs stable carrier

| 模块 | 对象 | 资格 | 当前状态 | `R06.7` 必须闭口 |
|---|---|---|---|---|
| `api` | `ObservationCommandHandlerState` | `DX` | R06.7-D逐对象审查已完成 | exact static route、API root assignment与per-call application context/input seam已完整承接；禁止共享`last_entry_disposition` |
| `api` | `ObservationQueryHandlerState` | `DX` | R06.7-D逐对象审查已完成 | exact static route、read façade与per-request metadata已完整承接；禁止`visibility_defaults`与write authority |
| `worker` | `ObservationConsumerDisposition` | `HX` | R06.6-E / R06.7-E均确认 historical exclusion | 不得恢复；由 application result、public outcome与`InboundConsumerCompletion`分层承接 |
| `worker` | `OutboxPublisherLoopState` | `DX` | R06.7-D逐对象审查已完成 | publication统一走`PublishObservationOutbox` Operations Job；禁止resident cursor/loop/error recovery authority |
| `worker` | `ProjectionWorkerLoopState` | `DX` | R06.7-D逐对象审查已完成 | 没有独立requirement、trigger、config或maintenance façade；derived maintenance统一走typed Operations Job |
| `jobs` | `ObservationJobRunnerContext` | `DX` | R06.7-D逐对象审查已完成 | C-07完整invocation、C-10 exact handler与application context seam已承接；禁止`JobRunRef` wrapper或identity conversion |
| shared entry | `EntryDisposition` | `HX` | R06.7-E已按直接删除关闭owner gap | 无独立语义/生命周期/跨模块契约；禁止以`ApiDisposition`、`WorkerDisposition`、`JobDisposition`或alias/wrapper恢复 |

本表由R06.7-D §§4、§§6~10与R06.7-E §§4~12 supersede原provisional `FC/UR`。五个候选没有独立稳定语义、不变量或生命周期，落成canonical struct反而会复制既有carrier或建立第二执行authority，因此合法结论是逐对象`DX`而不是省略对象卡；generic `EntryDisposition`同样没有资格并已删除为`HX`。若具体framework要求private wiring wrapper，它只能是crate-private装配细节，字段必须等于R06.8最终least-authority assignment，不得成为public API、persistence、protocol、telemetry identity或business truth owner。

#### 6.7.3 R2 technical registration carrier

| 对象 | 资格 | 当前 definition owner | `R06.7` 裁定目标 |
|---|---|---|---|
| `ValidatedInboundConsumerRegistration` | `FC` | `infra::runtime_builder`；冻结Step07/14只保留use-site | operation/producer/schema only；不得重复定义或携带locator/material |
| `ValidatedJobScheduleRegistration` | `FC` | `infra::runtime_builder`；冻结Step07/14只保留use-site | operation only；不得重复定义或携带locator/material |
| `InboundConsumerDelivery` | `FC` | Step 07 / formal | exact operation/producer/schema/actor/frame,move-only delivery |
| `InboundEnvelopeFrame` | `FC` | Step 07 / formal | private constructor、finite bound、no Clone/Debug/Serialize/body persistence |
| `InboundConsumerCompletion` | `FC` | Step 07 / formal | ack/retry/dead-letter exact receipt payload |
| `InboundConsumerHandlerCatalog` | `FC` | Step 07 / formal | 9 exact optional fields、enabled totality、no free-text map |
| `ObservationJobInvocation` | `FC` | Step 07 / formal | 9 exact existing request variants,不得补造 request |
| `ObservationJobInvocationResult` | `FC` | Step 07 / formal | 9 exact existing response variants |
| `ObservationJobInvocationFailure` | `FC` | Step 07 / formal | only Protocol/Application error,不新增 taxonomy |
| `ObservationJobHandlerCatalog` | `FC` | Step 07 / formal | 9 exact optional fields、totality |
| `ValidatedWorkerEntryConfig` | `FC` | `infra::runtime_builder` | R06.8-B current schema仅含canonical inbound registrations；无resident publication cadence/limit |
| `ValidatedJobsEntryConfig` | `FC` | Step 14 / formal | locator-free schedule registrations only |
| `ObservationApiAssignment` | `FC` | `infra::runtime_builder` | API-only safe slice、TruthWrite/Read façade与API assembler；one-shot、private fields、不可提取重组 |
| `ObservationWorkerAssignment` | `FC` | `infra::runtime_builder` | Consumer-only safe slice、Inbound façade/assembler与matching registrar；无publication capability |
| `ObservationJobsAssignment` | `FC` | `infra::runtime_builder` | Jobs-only safe slice、统一Operations Job façade/assembler与matching registrar |
| `BuiltApiObservabilityRuntime` | `FC` | `infra::runtime_builder` | `build_api`唯一产出；只含一个API assignment，只能由matching process-local activation消费 |
| `BuiltWorkerObservabilityRuntime` | `FC` | `infra::runtime_builder` | `build_worker`唯一产出；只含一个worker assignment，只能由matching process-local activation消费 |
| `BuiltJobsObservabilityRuntime` | `FC` | `infra::runtime_builder` | `build_jobs`唯一产出；只含一个jobs assignment，只能由matching process-local activation消费 |
| `BuiltObservabilityRuntime` | `HX` | historical R06.7-C aggregate | 已被R06.8-B三个具名runtime替换；不得定义generic family、aggregate assignment或跨进程联合activation |
| `RuntimeAssemblyIssueRef` | `TC` candidate | Step 14 / formal | safe diagnostic correlation only,not evidence/run/signoff |
| `RuntimeAssemblyError` | `FC` | `infra::runtime_builder`；Step14只保留derivation/use-site | finite startup failures、safe issue ref、no provider body；complete-or-error |

以下是 trait / alias,不作为 Step 06 data object 强行复制,但必须具名 defer：

| 名称 | 资格 | 后续唯一 owner | Step 06 当前边界 |
|---|---|---|---|
| `InboundConsumerHandler`;`ObservationJobHandler` | `DX` | Step 07 technical port seam | Step 06 闭口其 delivery/invocation carrier与catalog shape；trait signature后置 |
| `InboundConsumerRegistrar`;`JobScheduleRegistrar` | `DX` | Step 07 infra-entry technical seam | Step 06 固定 registrar 不属于 application business port |
| `RegisteredInboundConsumerSet`;`RegisteredJobScheduleSet` | `DX` | Step 07 opaque handle trait | 无 lookup/invoke/serialize/downcast/data fields；只持有 process lifecycle |
| `RegistrationFuture`;handler future aliases | `DX` | Step 07 | Rust object-safe async shape,不是 domain object |

raw `InboundConsumerBindingConfig`、`JobScheduleBindingConfig`、locator、credential、endpoint、cron、store binding 和完整 `ValidatedObservabilityConfig` 继续 `DX-Step14`;它们不得进入 worker/jobs。`R06.7` 只闭口 entry-safe current carrier与 assembly ownership,不提前复制配置 key/default/source。

### 6.8 第 1 批差异矩阵与修复门禁

#### 6.8.1 定义 / 使用差异矩阵

| 差异 ID | 来源 A | 来源 B / 当前现状 | 影响 | 修复批次 | 当前状态 |
|---|---|---|---|---|---|
| `R06-D01-INDIVIDUAL-CARD` | SOP要求每个对象独立小节 | 修复前约 30 个具名对象小节承载大量 struct/enum/family | 无法逐对象落码/停审 | `R06.2~R06.7` | partial_resolved_through_R06.5-G；18 policy、H1~H13与F/G类型账及affected owner已闭口，R06.6~R06.7仍open |
| `R06-D02-STRUCTURED-REF` | 概要 reference/boundary对象有字段/状态/行为 | 修复前 typed-ref family 将部分名称压成或视作透明 ref | 可能删除概要对象语义 | `R06.2` | resolved_definition_R06.2；R06.4 context对象已闭口 |
| `R06-D03-CONSUMER-REF-SHAPE` | 概要 `ReportConsumerRef` / `PeripheralConsumerRef` 有 kind/scope/state | R1 把两者定义为 transparent `BodyFreeRef` wrapper | handoff/export relation与config catalog可能分裂 | `R06.2` | resolved_definition_propagation_pending |
| `R06-D04-MAINTENANCE-TARGET` | 概要 `MaintenanceTargetRef` 是结构化目标/allowed-effect/no-write carrier | 修复前 typed-ref family 当 transparent ref使用；概要state又与execution object重复 | job/replay/maintenance guard输入不闭口或形成双重state truth | `R06.2/R06.4` | resolved_definition_reconciled_R06.4_propagation_pending；current为immutable descriptor，四组effect一一对应，execution state只归owning object |
| `R06-D05-PROJECTION-OWNER` | Step 05规定 public view归contracts | 修复前多数 view schema 首次在 Step 08定义,Step 06只点名 | object truth source后置且owner不清 | `R06.3/R06.4` | resolved_definition_R06.3_R06.4；11个view均已回灌contracts owner，传播待Step08 |
| `R06-D06-POLICY-FAMILY` | 概要正式化18个不同 policy/guard | 修复前一个generic + 一张 family表 | rule snapshot/input/output/error/test无法逐项实现 | `R06.5` | resolved_R06.5-E；P1~P18均有独立exact card、complete snapshot、typed outcome/error与zero-side-effect gate |
| `R06-D07-RECORD-FAMILY` | 概要正式化13个 append-only record | 修复前generic `String change_kind` + family表 | persisted schema/factory/source不闭口 | `R06.5` | resolved_R06.5-G design-only；13 typed refs、metadata、H1~H13 concrete cards、F/G类型账、transition mapping与rehydrate门禁已闭口 |
| `R06-D08-APP-FAMILY` | Step 05要求idempotency/stored result/outbox/job report等稳定carrier闭口 | current plan/claim/token/report/service多对象合写 | transaction/idempotency实现仍需猜 | `R06.6` | resolved_in_R06.6-E_design_only；digest canonicalizer进入 `R06.6-F1-W1`，逐入口 material 与下游 affected use 仍受控 |
| `R06-D09-STATE-BACKFILL` | Step 06应先定义state/trigger | Step 10反向补`HandoffReadinessState`、reference triggers、outbox、job report | 原 Step 06 `pass`被事实否证 | `R06.3/R06.4/R06.6` | partial_resolved_R06.3_R06.4_R06.6-A；reservation state已闭口，outbox/job/report state仍open |
| `R06-D10-ENTRY-CARRIER` | Step 05 R2固定technical registrar/carrier owner | Step 06未同步,R2类型首次在Step07/14/formal出现 | entry boundary可能再次反向补设计 | `R06.7` | resolved_design_only_by_R06.7-E；C-11/C-13 affected definitions与三个executable seam交R06.8 |
| `R06-D11-SUPPORT-TYPE` | 标准要求字段/方法参数secondary carrier闭口 | 大量`*Reason/*Summary/*Set/*Result/*Marker`只有名字 | 实现端会补local enum/string/default | `R06.2~R06.8` | partial_resolved_through_R06.5-G；shared foundation、P1~P18与H1~H13 support已闭口，R06.6~R06.8仍open |
| `R06-D12-ERROR-OWNER` | member/service signatures返回typed error | Step 06只定义Protocol/Domain/Job部分,Application/Api/Worker后置 | error mapping与对象能力漂移 | `R06.2/R06.5/R06.6/R06.7` | `ApplicationError` 唯一 owner与safe-detail已 `resolved_in_R06.6-E_design_only`；Step07/12只待affected mapping |
| `R06-D13-SERVICE-OBJECT` | SOP将service列为Step 06对象 | 四个application service各只有代表函数一行 | constructor/dependencies/capability surface缺失 | `R06.6/R06.8` | resolved_in_R06.8-B_design_only；四个entry-callable façade与crate-private publication collaborator的owner/dependency/callable boundary已闭口 |
| `R06-D14-DUPLICATE-DEFINITION` | 类型应有唯一definition owner | `ExternalEffectBindingRef`、R2 safe items、runtime error在多个后续文件重复定义 | 实现者无法判断导入路径 | `R06.6/R06.7` | application report/error/service owner已闭口；其余 downstream definition/use 仍待affected review |
| `R06-D15-HISTORICAL-PASS` | current恢复必须由ledger/flow/Step一致证明 | 原§7.1/§7.9/§10曾写done/pass；本批已改为historical invalidated | 继续agent不得误进Step07或04 | `R06.1`;`R06.8`再终检 | controlled_in_R06.1 |

#### 6.8.2 blocker 与影响传播（R06.1 historical snapshot；current 见 §6.30）

本表记录 R06.1 当时的诊断和关闭条件，已被 R06.8 消费，不能作为
current gate。表中四个 Step 06 definition blocker 的 current 状态已同步为
resolved；Step 08/09 两项仍保持其独立 scope。

| blocker | 类型 | R06.1 当时状态 / current 结论 | 关闭条件 | 影响范围 |
|---|---|---|---|---|
| `03-RPR-S06-GRANULARITY` | `03`内部质量 blocker | historical `open`；current=`resolved_in_R06.8_design_only` | `R06.2~R06.8`全部完成；每个current对象有独立卡或合法ET/DX/HX；zero unowned support type；cross-module审计通过 | Step06 definition阻塞已关闭；下游按独立affected ID推进 |
| `R06-F1-AFFECT-07-01` | executable affected seam | historical `open_controlled_affected`；current=`resolved_at_step06_definition_in_R06.8-A` | application-owned exact input assembler消费既有digest canonicalizer并供API/Consumer/Job调用；entry不得自行hash或构造private context | Step07/08/09/13/14 use propagation pending |
| `R06.7-D-ENTRY-ASSIGNMENT-SEAM` | executable affected seam | historical `open_controlled_affected`；current=`resolved_at_step06_definition_in_R06.8-B` | 三个explicit builder method分别产出一个具名runtime；每个runtime只含一个least-authority assignment并由matching process-local activation一次消费 | Step07/14 activation propagation pending；不得声明跨进程联合事务 |
| `R06.7-D-PUBLICATION-JOB-SEAM` | executable internal seam | historical `open_controlled_internal`；current=`resolved_at_step06_definition_in_R06.8-B` | batch publication capability收敛到canonical `PublishObservationOutbox` Job orchestration，闭合plan/claim/report/stored-result且只有一个entry mode | Step05/07/08/09/12/13/14 propagation pending |
| `03-RPR-S08-PER-PROTOCOL` | `03`内部质量 blocker | open_controlled | Step06/07稳定后,60协议逐协议卡与typed binding handoff完成 | 当前不在Step06写入 |
| `03-RPR-S09-PER-FLOW` | `03`内部质量 blocker | open | Step08稳定后,60接口逐flow闭口 | 当前不在Step06写入 |

未发现新的外部上游 blocker。`R06-D02~D04` 是详细设计与概要骨架的内部一致性问题；若 `R06.2` 证明必须删除、合并或改变正式概要关键对象归属,必须按正式 `02` §12.3 回退到概要 Step 06,不能在详细设计静默裁决。

#### 6.8.3 第 1 批完成检查

| 检查项 | 结论 | 证据 / 限制 |
|---|---|---|
| 是否废止原 Step 06 `pass` | pass | §1.1、§6.1 |
| 是否固定8个修复批次与逐批停审 | pass | §6.1.1~§6.1.2 |
| 是否定义独立卡 / 模板 / external / defer / historical资格 | pass | §6.2 |
| 是否禁止结构化 Ref 自动模板化 | pass | §6.2.2、§6.4.2 |
| 是否覆盖概要 truth/state/policy/projection/reference/record对象族 | pass_for_inventory | §6.4~§6.5；最终数量待`R06.8` support扫描 |
| 是否覆盖 current application/runtime/entry后置对象 | pass_for_inventory | §6.6~§6.7 |
| 是否记录Step10与R2反向补口 | pass | `R06-D09`、`R06-D10` |
| 是否在本批修改对象 schema | pass_no_schema_change | 本批只建立控制层；下文旧schema仍是repair input |
| 是否修改 Step07~10 / formal03 / 04 | pass_no_downstream_write | 未修改 |
| R06.1 gate_status（historical） | historical_replaced_by_R06.2 | 该门禁已消费；current gate 见 §6.9 |

#### 6.8.4 R06.2 / R06.3 / R06.4 / R06.5-A~E 必读输入（已消费）与下一批门禁

R06.2 已按以下清单读取并使用:

1. `详细设计讨论流程_SOP.md` Step 06与`详细设计书写规范.md`对象格式。
2. `设计真相源闭环与可落码性标准.md` support carrier、member parameter、typed ref、状态factory与唯一owner条款。
3. 正式 `02` §6 / §12及`02_hld_step_06_key_objects_references.md`、各对象附录中的 reference / enum / set输入。
4. current Step 05 contracts owner与本文件§6.4 inventory / `R06-D02~D04/D11/D12`。
5. Step 08 shared protocol helper、Step 10 state owner和Step 14 R1/R2 definition/use,只用于反查,不得成为Step 06 definition owner。
6. `L1-governance`与`L1-artifact` Step 06中 typed ref / value / enum 的逐对象卡粒度。

R06.3 已在用户确认后消费 Step 06 SOP / 书写规范、正式 `02` §6/§12、truth/signal/audit 与 projection 概要专项、current Step 05、contracts专项§19.3及Step08~10 affected use。产物为 `03_ddd_step_06_domain_truth_signal_audit.md`，并已完成字段来源、rehydration、状态、跨对象顺序、truth boundary与Step7+承接审计。

R06.4 已在用户确认后消费 Step 06 SOP / 书写规范、正式`02` §6/§12、handoff/retention/reference/projection概要专项、current Step05、contracts专项§19.4及Step08~10 affected use。产物为`03_ddd_step_06_boundary_read_maintenance.md`，并已完成110个active type、18个truth/state object、6个public view及字段来源、rehydration、状态、target-bound、affected-only、no-write与Step7+承接审计。最终裁定另固定：`MaintenanceTargetRef`是无state/maintenance ref/block reason的immutable descriptor；target/effect仅四组一一对应；replay coordination每个identity只绑定一个exact target并由R06.6 job plan逐target展开；maintenance state/progress分别保存observation/reference dual watermarks，Step07 read fence不持久化。

R06.5-A 已在用户确认后消费 Step 06 policy/guard/record/error条款、正式`02`的18个policy与13个record主语、contracts专项§19.5、R06.3/R06.4 decision/transition与same-UoW post-state，以及Step07/09~12 affected use。产物为`03_ddd_step_06_policy_guard_records.md` §1~§12；本批只固定authority、inventory、coverage、owner、historical delta和B~G逐批门禁，没有提前定义policy/record Rust schema。

R06.5-B 已在用户确认后消费 Step06 secondary carrier/error/factory规则、A批shared owner、R06.2 TC/cursor、R06.3 actor/time/trace/causation、R06.4三输入/dual-watermark、Step04/14/04 affected material与L1粒度。产物为R06.5专项§§13~18，闭口23个new explicit type、1个复用record ref、policy basis、record metadata/audit visibility及20-variant `DomainError`。

R06.5-B完成后曾停审，随后用户已确认进入C批。R06.5-C消费Step06 policy对象/constructor/error标准、B批foundation、R06.3 intake/safety/signal/audit/evidence对象、R06.4 authenticity/input对象、概要P1~P6候选及冻结affected use。产物为R06.5专项§§19~30，并同步R06.2 §24、R06.3 §22、R06.4 §20 affected definitions。

R06.5-C完成后曾停审，随后用户已确认进入D批。R06.5-D消费Step06 policy/secondary carrier/cross-crate可落码标准、B/C foundation、R06.4 handoff/retention/replay/no-write/read/gap对象、概要P7~P12候选、冻结Step07/09/10/12 affected use与L1粒度参考。产物为R06.5专项§§31~44，并同步R06.2 §25、R06.4 §21和本主控§6.5.8；未修改冻结下游。

R06.5-D完成后曾停审，随后用户已确认进入E批。R06.5-E消费Step06逐policy/object/member parameter标准、B~D foundation、R06.4 degraded/peripheral/reference/maintenance/replay coordination对象、概要P13~P18候选、冻结affected use与L1粒度参考。产物为R06.5专项§§45~56，并同步R06.2 §26、R06.4 §22和本主控§6.5.9；未修改Step07~19、formal03或任何04。

### 6.9 R06.5-B 完成与传播摘要（historical，已由C批消费）

| 项 | 结论 |
|---|---|
| authoritative contracts schema | R06.2 contracts专项§5~§20；R06.3 shared/state/support/view见专项§7~§9/§16；R06.4 boundary state/reason/ref/view见专项§8~§12 |
| authoritative domain schema | core truth见R06.3专项§10~§15；boundary/read/maintenance truth/state见R06.4专项§8~§10 |
| inventory / qualification / owner | R06.4专项§4~§5/§13/§17；contracts专项§19.4已同步R06.4 owner闭口状态 |
| state / cross-object / truth boundary | R06.4专项§13~§14；target-bound decision、current aggregate conditional fields、query no-write、affected-only propagation和reserved release/cleanup边界 |
| maintenance target / effect | contracts专项§10.11/§20.16/§20.22~§20.23与R06.4专项§9.18/§9.22~§9.25；target为immutable id/kind/object/effect/no-write descriptor，不保存lifecycle；仅允许projection rebuild、body-free reference refresh、gap scan、signal rollup rebuild |
| replay cardinality / changed set | R06.4专项§9.23/§11.8.10/§14；每个coordination固定一个target，scope-wide replay后置R06.6 immutable job plan逐target展开；completion changed set只能empty或stored target object singleton |
| maintenance cursor boundary | R06.4专项§9.22/§11.8.9/§12.7/§13~§14；observation/reference requirement与watermark分别持久化、校验、比较，禁止折叠global cursor；`ProjectionReadFence`仅为Step07 transaction-local proof |
| R06.5 authority / inventory | R06.5专项§3~§5；18个policy分配C/D/E各6个，13个record分配F 7个/G 6个；概要policy id与record id/ref双类型均不得自动生成 |
| policy output coverage | R06.5专项§6；11个current exact carrier复用，8个decision owner预留给C~E，P4/P16为无public marker的structural guard例外 |
| transition / record coverage | R06.5专项§7/§9；R06.3的7个与R06.4的17个transition共24个，另有R06.6 gap-scan item result；所有record factory固定三输入并append-only |
| shared policy foundation | R06.5专项§15；18-variant `PolicyFamily`、`PolicyRevision`、`PolicyEvaluationBasis`与`PolicyBasisRef` exact，infra locator保持隔离 |
| shared record foundation | R06.5专项§14/§16；13 typed record refs、generic typed metadata、5 origins、3 audit visibility及commit cursor边界exact；F/G批H1~H13现已闭口（历史摘要） |
| DomainError owner | R06.5专项§17；20 top-level variants + 8/6/12三个finite classifier，expected blocked/denied/not-ready回到typed decision；Step12仅后续mapping |
| internal affected layout | R06.5专项§18.3；record ref owner已回正`contracts::refs`，Step04 `history.rs`与logical `domain::records`命名待R06.8统一 |
| downstream affected-only传播 | R06.4专项§15~§16；本批未修改任何冻结下游 |
| external upstream blocker | none |
| internal blocker at B checkpoint | `03-RPR-S06-GRANULARITY`仍open；当时等待R06.5-C~G及R06.6~R06.8 |
| historical stop | R06.5-B_done_waiting_user；已由用户确认解除并被C批消费 |
| historical pointer | 当时current stop只见§6.13；现行指针见§6.14、flow与project ledger |

### 6.10 R06.5-C 完成与传播摘要（historical，已由D批消费）

| 项 | historical结论 |
|---|---|
| six policy cards | R06.5专项§§21~26；P1 intake、P2 safety、P3 signal、P4 structural linkage、P5 visibility、P6 authenticity均有schema/factory/完整signature/outcome/error/test redline |
| explicit type account | R06.5专项§27；40 new + 3 existing decision extensions，zero duplicate owner |
| policy material binding | R06.5专项§19.4；六policy均以family + `material-v1` exact fields重新计算digest并匹配完整`PolicyEvaluationBasis` |
| decision construction | P1/P2/P3/P5/P6 decision均`pub(crate)`且仅对应policy调用；P4不生成public marker或authorization |
| complete snapshot gate | receipt/disposition、signal/correlation/runtime、projection/linkage/boundary、hint/handoff/input/origin/gap均按complete body-free revision绑定，不以ref/state-only代替 |
| owning member gate | R06.3专项§22与R06.4专项§20；裸policy mutation降private，public入口借用target-bound decision；exact replay与changed same-state明确区分 |
| contracts affected type | R06.2专项§24；`EvidenceOriginResolution`只归resolver result，`AdmissionDecision`owner修正为`domain::intake` |
| expected outcomes | Reject/Quarantine/Degrade/Suppress/NotVisible/Placeholder/Insufficient不是error；P4 incompatibility才走typed boundary error |
| visibility / authenticity | Missing、NotVisible、Restricted分离；P6先过visibility/freshness/open-gap gate再分类origin，不生成verdict、alias、run id或signoff |
| affected-only downstream | Step07 resolver补origin/label assessment、Step08删除caller origin、Step09/10/12旧签名与error mapping保持frozen，待repair链对应Step解冻后传播 |
| external upstream blocker | none；正式00/01/02足以支撑C批 |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；R06.5仍需D~G，Step06仍需R06.6~R06.8 |
| historical stop | `R06.5-C_done_waiting_user`；已由用户确认解除并被D批消费 |
| historical pointer | 当时current stop只见§6.13；现行指针见§6.14、flow与project ledger |

### 6.11 R06.5-D 完成与传播摘要（historical，已由E批消费）

| 项 | historical结论 |
|---|---|
| six policy cards | R06.5专项§§33~38；P7 handoff readiness、P8 two-stage retention/protection、P9 per-target replay、P10 no-write、P11 read visibility、P12 gap classification均有schema/factory/complete signature/outcome/error/test redline |
| explicit type account | R06.5专项§39；77 new + 5 decision extensions + 1 domain enum extension + 3 contracts groups，机械扫描zero duplicate owner |
| cross-crate API | R06.5专项§31.4.1/§§32.1~32.6；decision constructor保持domain `pub(crate)`，loaded snapshot/binding factory为application可调用的public Rust domain API，fields private且无serde/default |
| P7 readiness | committed input proof、current consumer、complete/effective gap双层、retention/P10 total matrix；Placeholder/Insufficient永不Ready，InputNotFresh不冒充EvidenceGap |
| P8 mandatory order | full current consumer snapshot -> protection accepted post-state -> marker decision；KeepActive与Conflict consumer均retained；mixed release/conflict reason拒绝 |
| P9 per-target lookup | 六类target逐项marker/protection/P10；marker presence Optional但两类lookup Required；opaque lookup snapshot的None只来自repository `Ok(None)`；无global representative |
| P10 identity binding | Read/Handoff/Export/Maintenance/Replay的trigger identity、target与effect逐项exact；Blocked是expected outcome；local Blocked无fake forbidden ref |
| P11 Query zero-write | source visibility provenance + complete gaps + P10；Blocked gap optional且不能借unrelated gap；同步Query无state/H7/outbox/idempotency/refresh/rebuild writer |
| P12 total classification | 792 exact keys、88 structural reject、704 explicit outcomes；No default；NoWrite/Retention block alone不伪造gap |
| affected definitions | R06.2 §25、R06.4 §21；`HandoffBlockReason`、`VisibilitySurface`、`DegradedReason/Surface`及五个reused decision、`ActiveProtectionReleaseOutcome`已同步 |
| external upstream blocker | none；正式00/01/02足以支撑D批 |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；R06.5仍需E~G，Step06仍需R06.6~R06.8 |
| historical stop | `R06.5-D_done_waiting_user`；已由E批消费 |
| historical next allowed | 用户明确确认后只进入R06.5-E P13~P18；已消费，不再是current action |

### 6.12 R06.5-E 完成与传播摘要（historical，已由F批消费）

| 项 | historical结论 |
|---|---|
| six policy cards | R06.5专项§§47~52；P13 degraded output、P14 two-entry peripheral export、P15 reference freshness、P16 structural adapter boundary、P17 derived maintenance、P18 per-target replay coordination均有exact schema/factory/signature/outcome/error/test redline |
| explicit type account | R06.5专项§53；§46 shared carrier 56 + §§47~52 policy/decision 10 = 66 unique new `pub struct/enum`；与C/D合计183 new explicit types |
| material cardinality | P13 120 keys；P14 40/4/4；P15 180 keys；P16 13 family中四true九false；P17四target/effect pair；P18六exact replay row；无wildcard/default |
| P13 degraded split | Query只借decision映射surface且zero write；durable revision绑定exact affected object/scope，replacement换new identity，transition保留before/after identity与P13 basis |
| P14 two-entry boundary | preparation/delivery各有complete input与decision，不复用P7；六个`PeripheralBlockReason`；adapter result不是policy result、acceptance、verdict或signoff |
| P15/P16 reference boundary | typed version relation不用wall clock；Invalid recovery建立new snapshot identity；P16只做结构guard且无proof/status，P15仍重复safe-output compatibility校验 |
| P17 maintenance boundary | complete target-scope/dependency namespace/mode/P10；authorization唯一owner `domain::maintenance`且不能裸public消费；projection/reference/rollup start借用完整decision |
| P18 cardinality / no fabrication | 每次一个Pending coordination + Approved scope中的一个exact target；current retention/protection/P17/P10重新绑定；Start/Blocked不建plan/claim/progress/changed/violation ref |
| affected definitions | R06.2 §26、R06.4 §22；`PeripheralBlockReason`六variant、decision/state public入口、transition policy-basis branch matrix与H8~H13 handoff已同步 |
| owner / contracts gate | policy归`domain::policies`；decision/state归owning module；authorization归`domain::maintenance`；contracts不复制policy/decision/complete snapshot；`ScanGap`与`ScanObservationGap`保持两个canonical token且无alias |
| external upstream blocker | none；正式00/01/02足以支撑E批 |
| internal blocker at E checkpoint | `03-RPR-S06-GRANULARITY=open`；当时P1~P18已闭口，仍需F/G records与R06.6~R06.8 |
| historical stop | `R06.5-E_done_waiting_user`；已由F批消费 |
| historical next allowed | 只进入`R06.5-F H1~H7`；已消费，不再是current action |

### 6.13 R06.5-F 完成与传播摘要（historical，已由G批消费）

| 项 | historical F结论 |
|---|---|
| seven record cards | R06.5专项§§58~64；H1 intake、H2 correlation、H3 audit/evidence、H4 handoff、H5 retention、H6 no-write、H7 future read audit均有exact schema、三输入factory、inspection、validated rehydrate、append-only与test redline |
| explicit type account | R06.5专项§65.1；F批67 unique new `pub struct/enum`，分组11/11/11/11/10/6/7；与C/D/E合计250 new explicit types |
| owner registry | record family归logical `domain::records::{intake,correlation,audit,handoff,retention,no_write,read_access}`；H7 acceptance envelope归`domain::read`；typed refs归`contracts::refs`；无duplicate owner或`*RecordId` alias |
| transition total mapping | R06.5专项§65.3；12 transition family全部映射为exact H1~H7、`explicit_no_record`或`phase_reserved`；同一transition不无条件复制到多个record family |
| field / persistence closure | metadata、subject、before/change/after、reason/basis与record-specific refs/sets均有exact source、typed inspection及validated stored-shape rehydrate；mapper禁止unchecked struct literal、default或opaque transition blob |
| provenance corrections | H2 Revalidated是direct branch且basis None；H6 metadata origin描述本次lifecycle writer lane，不等同original trigger kind；P10 Blocked不伪造violation/H6 |
| multi-record UoW | H1 safety+receipt、H5 protection+marker使用不同PK和同一Observation cursor；cursor只证明atomic commit，跨record因果由decision/transition/post-state binding证明，不按PK/time/row order猜测 |
| H7 phase boundary | schema保留但current同步Query无writer、id mint、UoW、cursor、record/outbox/context row；current `from_accepted/try_rehydrate`均先返回ReservedTransition |
| affected definitions | R06.3 §23、R06.4 §23；transition previous snapshots、decision proof、retention/no-write fields和phase gate已同步；未修改冻结Step07~19/formal03/04 |
| UoW affected item | `R06-F-AFFECT-UOW-01=open_controlled`；冻结Step07/09/11旧record-before-cursor与consuming save不可落码，R06.8后须统一为borrow-stage state -> assign cursor -> construct/append record，并同步Step16 |
| external upstream blocker | none；正式00/01/02足以支撑F批 |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；R06.5仍需G批H8~H13，Step06仍需R06.6~R06.8 |
| historical stop | `R06.5-F_done_waiting_user`；已由G批消费 |
| historical next allowed | 当时只允许进入`R06.5-G H8~H13`；不再是current action |

### 6.14 R06.5-G 完成与传播摘要（historical checkpoint; consumed by R06.6 input review）

| 项 | historical checkpoint 结论 |
|---|---|
| six G record cards | R06.5专项§§67~72；H8 gap、H9 peripheral、H10 reference、H11 maintenance、H12 reserved scan result、H13 per-target replay均有exact schema、accepted input、same-UoW post-state、factory、inspection、validated rehydrate、append-only与planned verification |
| G explicit type account | R06.5专项§73.1；62 unique new `pub struct/enum`，分组`12/11/10/13/8/8`，无duplicate declaration；F/G合计新增记录内部类型129个 |
| affected-definition closure | R06.3 §24补齐H11 rollup previous snapshot与branch consumption；R06.4 §24补齐H8/H9/H10/H11/H13 creation proof、terminal semantics、diagnostic carrier与per-target replay handoff |
| transition total mapping | R06.5专项§73.2；所有current accepted branch均落到唯一record family，reserved/no-record边界显式列出 |
| field / persistence closure | R06.5专项§73.3；before/change/after、typed metadata、origin/visibility/cursor、inspection与rehydrate规则闭口 |
| H12 boundary | 仅保留R06.6 future accepted item result的typed reservation；不定义job/plan/item/claim/attempt/run/report/schedule schema |
| same-UoW / truth boundary | R06.5专项§73.5；record append-only、失败全量rollback，不拥有business/source/external truth、raw body、credential、verdict或signoff |
| external upstream blocker | none |
| internal blocker | `03-RPR-S06-GRANULARITY=open`；G批已被 R06.6 输入审查消费，Step06仍需R06.6-A~F、R06.7~R06.8及后续受影响审计 |
| controlled affected item | `R06-F-AFFECT-UOW-01=open_controlled`；留待R06.8解冻下游时处理 |
| historical stop | `R06.5-G_done_waiting_user` |
| historical next allowed | 用户确认后读取 R06.6 输入；该动作已完成，当前指针见 `R06.6_input_boundary_done_waiting_user` |
| commit | 不需要提交 |

### 6.15 R06.6-A application operation / context / idempotency 传播摘要（historical checkpoint; consumed by B）

本节是当前 R06.6-A 的主控传播摘要；逐对象字段、factory、member、rehydrate 与禁止事项只以 `03_ddd_step_06_application_operation_context_idempotency.md` §§6~10 为准。本节不把尚未完成的 B~F 对象提前标记为 current，也不回填正式 `03`。

| capability / type group | current definition owner | A 批闭口内容 | 未覆盖内容 |
|---|---|---|---|
| finite operation namespace | `application::operations` | `ObservationOperationFamily`、`ObservationOperationName`、Command 16、Query 14、Inbound Consumer 9、Job 9；显式 family/variant discriminator 与 static mapping 边界 | protocol wrapper、free-text route、Job plan/execution identity |
| inbound identity / trusted context | `application::context` | `ObservationInboundEventIdentity`、`ObservationOperationContext`；四类 factory 的必填/禁填矩阵、actor/trace/digest/key 来源 | canonical digest 字段全集与 protocol DTO 细节，留 affected Step 08/13 |
| logical idempotency | `application::idempotency` | `ObservationIdempotencyScope`；operation + effective actor + key 的完整唯一键，Query 明确不进入 reservation lane | stored result bytes、outbox、job plan、claim、report |
| durable reservation | `application::idempotency` | `ObservationIdempotencyReservation`、`IdempotencyReservationState`、`ObservationIdempotencyReserveOutcome`；仅 `Reserved -> Completed`，`Replay/Conflict/InFlight` 是 incoming outcome | repository trait、CAS SQL/DDL、Step 11/13 affected implementation contract |

### 6.15.1 A 批唯一 owner 与排除裁定

- `ActorSafeRef`、`TraceCorrelationRef`、`SourceEventRef`、`RequestDigest`、`IdempotencyKey`、`IdempotencyRef` 与 `StoredObservationResultRef` 由既有 contracts owner 提供；A 批只组合和校验，不复制 newtype。
- Consumer 的 secondary identity 固定为 `(consumer, producer_family, source_event_ref)`，必须和 logical scope 在同一 reservation acquire 边界建立；不得只依赖 dedup key。
- 历史 §7.7 的 `ObservationVisibilityDecision` 是 `HX`，canonical owner 为 `domain::read::ReadVisibilityDecision`；application 不得声明同名类型或 alias。
- `ObservationConsumerDisposition`、`ObservationJobDisposition` 已由 R06.6-E 标记为 historical exclusion；不得与 public outcome、durable result/report state 或 R06.7 `EntryDisposition` 合并。
- `ApplicationError` 的唯一 current owner 已固定为 `application::errors`；Step 07/12 仅登记 affected mapping，不得复制 definition。

### 6.15.2 A 批传播与停审

| affected consumer | 当前承接 | 状态 |
|---|---|---|
| Step 07 context factory / idempotency port | 复用 A 批 typed context、scope 与 atomic outcome；不得重新声明 operation enum | frozen，待 R06.6 完整后 affected review |
| Step 08 route / producer map | 48 个 variant 与 9 条 Consumer producer mapping 必须 total、无 alias；Query key/event 固定 absence | frozen，`03-RPR-S08-PER-PROTOCOL` open_controlled |
| Step 11 persistence | reservation acquire、secondary event uniqueness、result-before-complete 作为同一 UoW 边界输入 | frozen，不能在本节写 store/DDL |
| Step 13 concurrency | digest canonicalization、key drift、duplicate/in-flight race 与 same-token classification | frozen，`R06.6-DIGEST-CANONICALIZER=resolved_in_F1_design_only`；Step13 profile-switch affected review仍待后续解冻 |
| H12 record boundary | 只接受最小 accepted item-result reservation；不定义 job、item、claim、run、report | pass reservation-only |

该 A 批 checkpoint 已经用户确认并由 B 批消费。其对象定义继续有效，但不再承担 current gate。当前 external upstream blocker 为 `none`；正式 `03`、R06.6-D~F、R06.7~R06.8、Step 07~19 与 `04` 继续冻结。

### 6.16 R06.6-B stored result / outbox 传播摘要（historical checkpoint consumed by C）

本节是当前 B 批主控摘要；逐对象字段、factory、member、rehydrate、状态矩阵和禁止事项只以 `03_ddd_step_06_application_stored_result_outbox.md` §§6~29 为准。正式 `03` 仍不得回填。

| capability / type group | current definition owner | B 批闭口内容 | 未覆盖内容 |
|---|---|---|---|
| exact stored replay | `application::stored_result` | kind、bounded canonical bytes、replay surface、fact disposition、durable stored result；result-before-complete和fail-closed replay | Step 08 exact decoder implementation、repository trait、error mapping |
| public outbox identities | `contracts::refs`；application mints | `OutboxRecordRef`、`OutboxPayloadSnapshotRef`、`OutboundEventRef`、`DeadLetterRef`；一份低依赖声明、四个typed mint source、不可互换 | raw ID generator implementation、wire codec tests |
| immutable outbox material | `application::outbox` | `BodyFreeSerializedEvent`、`ObservationOutboxPayloadSnapshot`；protocol/application snapshot分离、binding不进bytes、publisher不重建 | C 批 binding owner/token、Step 08 per-protocol bound proof |
| publication outcome | `application::outbox` | receipt、failure kind/fact、dead-letter reason、four-state record；reason/ref durable co-presence、latest failure replacement与保留规则 | retry eligibility/claim/probe/token与repository CAS port |

### 6.16.1 B 批唯一 owner 与关键裁决

- `OutboxRecordRef`、`OutboxPayloadSnapshotRef`、`OutboundEventRef`、`DeadLetterRef` 位于 `contracts::refs`，因为 public DTO 已使用这些类型；application 只拥有新值 mint 和 lifecycle relation，contracts 不依赖 application。
- `ObservationOutboxPayloadSnapshot` 是 durable application owner；pure protocol snapshot 不含 `effect_binding_ref`，serialized bytes 也不含 binding。
- `BodyFreeSerializedEvent` 的 `262_144` 是 Step 06 compile-time safety ceiling，不从 `04 boundary.max_request_body_bytes` 反向取得；配置不能提高或重定义它。
- `ObservationOutboxRecord` durable 保存 `dead_letter_reason` 与 `dead_letter_ref`；repository 不得把 reason 藏在 schema、ref 或 adapter 私有记录中。
- `Pending -> Published` 的 failure 为 `None`；`Failed -> Published` 保留 latest compatible failure；`Failed -> Failed` 替换 latest failure；`Failed -> DeadLettered` 保留 failure。不存在 later persistence policy 自由选择。
- publication failure / dead-letter 只改变 observation-side publication marker，不回滚或反写业务 truth。

### 6.16.2 B 批传播与停审

| affected consumer | current required repair | status |
|---|---|---|
| Step 07 | 删除平行 `BodyFreeSerializedEvent` / snapshot definition；port必须消费B批对象，并让 `mark_dead_letter` 持久化reason/ref | frozen affected review |
| Step 08 | 四个 refs 从 contracts import；protocol snapshot bytes映射到application bounded carrier；12 event逐协议证明上限 | frozen，`03-RPR-S08-PER-PROTOCOL` open_controlled |
| Step 10 | 状态矩阵增加dead-letter reason保存与failure retention rule，删除“Step10反向补Step06”口径 | frozen affected review |
| Step 11 | logical schema增加 `dead_letter_reason`；outcome matrix与B批完全一致 | frozen affected review |
| Step 13/14 | same-token retry保持snapshot/binding不变；`04` request-body limit不得定义outbound event byte ceiling | frozen；C批先闭口binding/token owner |

该 B 批停审结论 `R06.6-B_done_waiting_user` 已由用户确认并被 C 批消费。B 批对象定义继续有效，但其 blocker/pointer 不再是 current；当前状态只看下述 §6.17。

### 6.17 R06.6-C external binding / intent / token 传播摘要（historical checkpoint; consumed by D-1）

本节是当前 C 批主控摘要；16 个对象的字段、factory、member、source-token-result chain、owner/state audit、affected-use 与 Step 07 handoff 只以 `03_ddd_step_06_application_external_effect_intent_tokens.md` §§6~28 为准。正式 `03` 仍不得回填。

| capability / type group | current definition owner | C 批闭口内容 | 未覆盖内容 |
|---|---|---|---|
| external binding identity | `application::runtime` | opaque immutable binding revision + finite five-phase enum；no locator/credential；infra只从完整validated binding派生并装配 | catalog subject/entry/resolver trait、runtime availability and config snapshot |
| public preparation identity | `contracts::refs`; application validates new-value relation | `HandoffDeliveryPreparationRef` low-dependency canonical declaration、public Job use、no cross-wrapper conversion | exact Step 08 codec/tests |
| stable call identity | `application::external_effects` | publication token + four intent-backed handoff/export tokens；private fields、named factory、same-binding/material equality | D batch plan/claim/fence linkage；F canonical digest encoding |
| durable external-effect facts | `application::external_effects` | four-variant append-once intent；three exact source-token result carriers；no second lifecycle | repository/port exact traits and logical store correction |
| probe classification | `application::external_effects` | three independent four-way outcomes；Unknown/Unsupported indeterminate；Not* alone insufficient for retry | Step 13 retry/abort proof and Step 12 error mapping |

### 6.17.1 C 批唯一 owner 与关键裁决

- `ExternalEffectBindingRef` 和 `ExternalEffectPhase` 唯一定义于 `application::runtime`；Step 14 的同名 declaration 降为 affected use，infra config/runtime builder只负责完整 validated binding 到 revision identity/catalog 的派生和装配。
- `ExternalEffectIntentRef`、五类 token、tagged `ExternalEffectIntent`、三类 result carrier 与三类 probe outcome 唯一定义于 `application::external_effects`；Step 07/13 不得平行声明。
- publication 不创建 intent ref；其 durable identity 已由 immutable outbox record/snapshot pair 承担。
- handoff/export 四个 external phases 各有 distinct intent ref，intent append-before-call；result carrier 保存 exact source token并 append once。
- `ExternalEffectIntent` 没有 mutable state/CAS；lifecycle仍归 outbox/handoff/export/delivery/job owner。Step 11 的旧 intent state/phase marker 口径登记 affected correction。
- export local `ExternalAuditExportPreparation::Prepared` 是 external package prepare 的输入前置；`PeripheralExportPackage` 是外部 prepare result，不建立第二次 Prepared transition。
- positive probe payload必须与 exact token/intent兼容；formal negative仍需 abort proof + current claim/fence/policy，Unknown/Unsupported停在人工/不确定分类。

### 6.17.2 C 批传播与停审

| affected consumer | current required repair | status |
|---|---|---|
| Step 04/05 | 增加 `application::runtime` / `application::external_effects` logical owner，并保持 domain lifecycle ownership | frozen affected review |
| Step 07 | 删除平行 token/probe/result定义；补 append/get intent/result、exact binding resolver、fake parity 和 no-network-UoW port contract | frozen until R06.8 |
| Step 08 | 从 contracts import `HandoffDeliveryPreparationRef`；不暴露 application token/result internals | frozen，`03-RPR-S08-PER-PROTOCOL` open_controlled |
| Step 09 | 使用 named factory；分开 handoff 与 export preparation order；intent-before-call/result-before-finalize | frozen，`03-RPR-S09-PER-FLOW` open |
| Step 10/11 | 不新增 intent lifecycle；logical store改为 tagged immutable intent + append-only result carriers | frozen affected review |
| Step 12/13 | E/F 后消费 canonical error/digest；删除重复 struct/enum；四态 probe和formal-negative gate不变 | frozen affected review |
| Step 14 | 删除重复 binding ref declaration；catalog/resolver只消费 application runtime value | frozen affected review |
| Step 15~17 | safe metadata、逐token tests与实施阅读顺序回指C owner registry | frozen affected review |

该 C 批 checkpoint 已经用户确认并由 D-1 消费。其对象定义继续有效，但不再承担 current gate。

### 6.18 R06.6-D1 job plan / item / claim / config 输入与资格摘要（consumed historical checkpoint）

本节只同步 D-1 恢复信息。D 批输入权威、后置材料降级、capability、identity/config/claim/H12 冲突、11对象资格与 D-2~D-6 计划的唯一 current source 是 `03_ddd_step_06_application_job_plan_claim_config.md` §§1~7；本节不得替代后续逐对象卡。

| D-1 surface | current conclusion | next closure |
|---|---|---|
| identity | public invocation、application-local accepted execution、real external/runtime run identity三层隔离；`JobExecutionRef` / `JobRunRef`未发现可检索正式声明 | D-2先关闭`R06.6-D-JOB-IDENTITY-UPSTREAM`，不得静默alias |
| plan / item | work-set/config/planned material immutable；item state/outcome为唯一CAS mutable classification；report只作lossless derived fold | D-3/D-4逐对象闭口 |
| work claim / fence | item claim按global typed work key唯一；durable positive token严格递增；claim/fence不替代row version、source fence或external token | D-2 token/work-key卡；D-5 claim cards |
| work-key payload owner | frozen snapshot payload使用historical `ReferenceSnapshotRef`；`PeripheralConsumerScopeRef`无current owner | D-2使用`ReferenceSnapshotStateRef`并先裁定peripheral scope语义 |
| config snapshot | durable stable carrier owner方向=`application::jobs`；Step14只派生/装配；resume不得热读current config | D-4先闭口typed support owner与exact schema |
| H12 | reservation-only exact target snapshot/outcome字段保持；H12不拥有通用job lifecycle | D-3/D-6逐字段兼容或controlled affected-definition |

该D-1 checkpoint已由用户确认并被D-2消费。其输入诊断和资格计划继续有效，但不再承担current gate；identity与work-key两个open_controlled blocker的current closure见§6.19。

### 6.19 R06.6-D2 execution / plan identity、fence 与 global work-key 摘要（historical checkpoint）

D-2唯一current source是`03_ddd_step_06_application_job_plan_claim_config.md` §§8~14；本节只同步恢复信息，不替代四张独立对象卡。

| D-2 surface | current conclusion | downstream / next closure |
|---|---|---|
| identity | public invocation correlation=`core_contracts::metadata::JobRunId`；application local execution ref独立生成；real external/runtime run absent；旧`JobExecutionRef -> JobRunRef` alias链关闭 | Step07/08/11/13 affected review；D-4 plan字段显式保存relation |
| plan identity | plan ref与execution ref分别mint；one execution/idempotency对应one immutable plan；resume不replace | D-4 execution-plan对象卡与Step11 unique indexes |
| fencing | `NonZeroU64`；fresh owner epoch按same subject严格递增；renew不换token；current Active claim identity/owner/token联合校验 | D-5 claim card与Step07/11 commit-fence contract |
| global work key | nine exact typed variants；active item claim不附加execution ref；versioned canonical bytes；gap/replay使用stable id | D-3 planned material分层、D-4 plan digest、D-5 claim subject |
| snapshot payload | current `ReferenceSnapshotStateRef`唯一；historical alias无decode path | Step08/09/13 affected correction |
| peripheral payload | stable `PeripheralConsumerRefId + ObservationProjectionScope`；完整consumer snapshot留planned material；不生成`PeripheralConsumerScopeRef` | Step08 typed input重组、D-3/D-4 planned material |

该 D-2 checkpoint 已被 D-3/D-4/D-5 消费。`R06.6-D-JOB-IDENTITY-UPSTREAM=resolved_in_D2`；`R06.6-D-WORK-KEY-PAYLOAD-OWNER=resolved_in_D2_with_downstream_affected_definitions`。当前 gate 见 §6.21。

### 6.20 R06.6-D4 execution plan / config snapshot 摘要（historical checkpoint; consumed by D-5）

D-4唯一current source是`03_ddd_step_06_application_job_plan_claim_config.md` §§22~30；本节只同步恢复信息，不替代 support、binding、snapshot、plan 四组独立卡。

| D-4 surface | current conclusion | downstream / next closure |
|---|---|---|
| typed execution support | `ConfigBindingRef`、positive duration/limit、retry/backoff、claim lease、probe/stable-token capability均由`application::runtime`提供；raw config/locator/secret仍归infra | R06.7审runtime assembly与entry-safe carrier |
| job binding | `JobConfigBinding`是finite operation-scoped enum；non-external variant单例，external binding按typed ref/phase canonical unique | Step14/04只提供validated derivation与raw key/source |
| config snapshot | `JobExecutionConfigSnapshot` owner=`application::jobs`；保存config ref、operation与canonical typed bindings；resume不热读current config | Step11 persistence/Step13 affected audit |
| execution plan | plan保存public `JobRunId` correlation、local execution/plan/idempotency refs、request digest、snapshot、canonical items与plan digest；work-set/planned material immutable | D-5 claim exact plan binding；D-6 cross-object closure |
| plan digest | 覆盖operation/request/config snapshot/item key/planned digest/source version；排除identity、JobRunId、state/outcome、claim/fence、worker/attempt/clock/report | R06.6-F / Step13 canonicalizer |
| start/resume | reserve-before-list；bounded materialization与snapshot同一start UoW；commit-before-claim；resume只读原material，不relist/current-config substitute | Step09/11 per-flow/persistence audit |
| timeout | `job_timeout`仅invocation wrapper budget，不入snapshot或plan digest，不制造terminal result | Step14/04 affected audit |

当前external upstream blocker为`none`。`R06.6-JOB-CONFIG-OWNER=resolved_in_D4`；`R06.6-D-CONFIG-SUPPORT-OWNER=resolved_in_D4`；`R06.6-D-H12-COMPAT=resolved_in_D3_fieldwise_with_D6_integration_followup`。D-5已将`R06.6-D-CLAIM-SHAPE`关闭为`resolved_in_D5`；`03-RPR-S06-GRANULARITY`、disposition/error/digest blocker仍open。D-4停审结论已被D-5消费，当前 gate 见下节。

### 6.21 R06.6-D5 claim state / claim / lease / fence 摘要（historical checkpoint; consumed by D-6/E）

D-5唯一current source是`03_ddd_step_06_application_job_plan_claim_config.md` §§31~38；本节只同步恢复信息，不替代claim state、claim、subject或transition独立契约。

| D-5 surface | current conclusion | downstream / next closure |
|---|---|---|
| claim subject | `Execution { execution_ref }`与`Item { execution_ref, work_key }`为有限互斥tag；item active uniqueness只按global typed `ObservationJobWorkKey` | D-6 zero-unowned-field与affected-use closure |
| claim identity | 每次fresh acquire生成新的`ObservationExecutionClaimRef`与`ObservationClaimOwnerRef`；Released/Expired claim不复活 | Step07 ID generator与Step11 claim PK/index affected review |
| lease / state | state仅`Active`/`Released`/`Expired`；expiry必须由durable authority判定，local clock/heartbeat miss不能接管 | Step07/11 persistence and Step12 recovery mapping |
| commit authority | claim ref、plan ref、subject、owner、fence、Active、lease window与current claim row version必须联合验证；claim不替代item CAS/source fence/external token | D-6 cross-object closure and later Step07/11 affected review |
| persistence / resume | claim row保留terminal history；fresh reentry不relist、不热读current config、不从expiry推导rollback或external未发生 | D-6 handoff and Step13 affected review |

在D-5 checkpoint时，external upstream blocker记录为`none`。`R06.6-D-CLAIM-SHAPE=resolved_in_D5`，`R06.6-D-H12-COMPAT=resolved_in_D6_design_only_with_affected_use_register`，`R06.6-DISPOSITION-LAYER=resolved_in_E_design_only`，当时的`R06.6-APP-ERROR-OWNER=resolved_in_E_design_only`随后已被F2 owner addendum扩展，`R06.6-DIGEST-CANONICALIZER=resolved_in_F1_design_only`保持有效。D-6/E/F1均为historical checkpoint；当时的pointer为`R06.6-F1-W3_done_waiting_user_before_F2`，current pointer只见§6.24。

### 6.22 R06.6-E report / error / result / service closure（historical checkpoint; consumed by F1/F2 and R06.7-E）

E 批唯一 current source 是 `03_ddd_step_06_application_report_error_service.md` §§1~24。本批已完成以下 design-only 闭口：

| surface | current conclusion | downstream handling |
|---|---|---|
| report item/scope fold | `ProjectionScopeItemOutcome`、`ProjectionScopeItemReport`、`JobReportItemFold`、`JobReportFoldSummary` 与 `ObservationJobReportDraft` 形成 lossless plan-bound snapshot；`PlanMaterialized` 与 `ItemCas` proof 适用范围分离 | Step 07/11/13 只做 affected persistence/CAS review；不得从 summary反推plan或item truth |
| report lifecycle | `JobReportState` 固定为 `Draft` + `Completed` / `PartiallyCompleted` / `FailedRetryable` / `FailedPermanent` / `Blocked`；`DuplicateReplayed`不进入durable state | Step 08 public mapping保持独立；Step 10只引用 owner |
| error owner | `ApplicationError` 唯一 owner=`application::errors`；`JobError`只服务report mutation；raw adapter detail不得穿越port | Step 07/12 affected-only mapping，不复制定义 |
| result layers | R06.6阶段先分离stored fact、report、application return、provisional entry-local与public outcome；R06.7-E随后证明provisional generic entry layer冗余并删除 | current owner见§6.29；Step08/09/13按affected register复审 |
| façade constructor | historical E已列出五 bundle inventory；current R06.8-B只保留四个entry-callable façade，并把publication收窄为crate-private claimed-item collaborator | Step 07只定义四个trait；不得恢复maintenance/publication双façade或worker publication入口 |
| open controls | digest canonicalizer已由F1 design-only关闭；record cursor/UoW顺序和总体Step06粒度仍未关闭 | `R06.6-DIGEST-CANONICALIZER=resolved_in_F1_design_only`；继续保持`R06-F-AFFECT-UOW-01`、`03-RPR-S06-GRANULARITY`控制 |

E 批完成状态曾为 `R06.6-E_done_waiting_user`，现已由用户确认并被 F1/F2及R06.7-E消费。R06.7-E同步后的current result-layer结论只见§6.29。未修改正式 `03`、Step 07~19、任何 `04` 文件、implementation ledger 或 boundary skeleton。

### 6.23 R06.6-F1-W3 digest canonicalizer historical checkpoint（consumed by F2）

F1语义的唯一source仍是`03_ddd_step_06_application_digest_canonicalizer.md`。W1、W2与W3均已完成design-only静态闭环；本节记录其被F2消费前的停审状态：

| surface | current conclusion | remaining gate |
|---|---|---|
| digest value owner | `DigestProfileVersion`、`DigestValue`、`RequestDigest`、`DigestSummary` 继续唯一归 `contracts::refs` | 不得在 application 复制 newtype |
| canonicalizer owner | `application::digest`唯一拥有12-kind registry、typed writer、SHA-256、profile support、candidate和persisted verifier；无repository/UoW依赖 | Step04/07 affected review后置，不重开owner |
| profile v1 | deterministic JSON exact byte grammar、UTF-8、SHA-256和64 lowercase hex；九个grammar/frame seed固定text/length/hash，production corpus为planned | 实现测试仍`planned/not_run`，不得当evidence |
| request material | 16 Command、14 Query、9 Consumer、9 Job共48项均有exact material与planned fixture；Query保持zero-write | Step08/09逐协议/逐flow回灌后置 |
| durable material | 8类durable family与4个external phase均固定non-recursive/same-profile verification；C批delivery digest和A批old-profile admission已修正 | Step07/11/13 affected review后置 |
| material registry | Command、Query、Consumer、Job、stored result、outbox payload、plan、plan item、item outcome、report、external intent/token均有finite kind | 新增kind或改变v1字段语义必须profile bump |
| error / migration | malformed carrier、startup support、五个application digest variant分层；四阶段rollout与all-owner shared-cut retirement固定，不允许rehash/overwrite | exact config key、真实scan和activation evidence后置且不得伪造 |
| no-write / truth boundary | Query只作read context marker；digest不成为业务truth/evidence/verdict，forbidden body无hash逃逸 | 后续affected review不得弱化 |
| historical open controls | `R06.6-DIGEST-CANONICALIZER=resolved_in_F1_design_only`；当时`R06-F-AFFECT-UOW-01=open_controlled`；总体粒度blocker仍open | F1停审门禁随后已由用户确认并被F2消费 |

F1当时状态为`R06.6-F1-W3_done_waiting_user_before_F2`，该门禁已由用户确认并被F2消费。本批当时未修改正式`03`、Step07~19、任何`04`文件、implementation ledger或boundary skeleton；current动作只见§6.24。

### 6.24 R06.6-F2 record / UoW assembly historical checkpoint（consumed by R06.7）

F2唯一完整source是`03_ddd_step_06_application_record_uow_assembly.md` §§1~18。本节只同步Step 06主控恢复信息，不复制其request、plan、batch、follower或dispatcher对象卡；若§6.23及更早checkpoint仍指向F1等待F2，均视为historical pointer并由本节覆盖。

| surface | current conclusion | remaining gate |
|---|---|---|
| process-local owner | `application::unit_of_work`拥有pre-cursor obligation、independent footprint、commit class、assembly plan、prepared commit和dispatcher handoff；不创建`application::records` persistence owner | R06.8复核Step04物理文件与logical owner命名 |
| record owner | H1~H6/H8~H13 concrete schema/factory仍归`domain::records`；H7无current writer | Step07/09/11 affected review不得引入generic record/append |
| one cursor | commit class只由accepted primary mutation推导；一个UoW只分配一个tagged cursor；Reference-only H10用Reference，mixed用Observation | adapter enforcement与parity tests后置且`planned/not_run` |
| three-phase closure | validated pre-cursor plan -> cursor-dependent H11 primary closure -> complete in-memory records/followers；完整物化后才开始append | downstream旧record-before-cursor与consuming save仍冻结待修 |
| H11/H12/Job | H11在cursor后member/factory/stage；H12借用`&GapScanPostState`；claim guard一次注册、fold在append前、commit重验guard/item/report CAS | Step07/09/11/13/16 affected review后置 |
| error owner | `application::errors`唯一拥有14-kind `RecordAssemblyFailureKind`和wrapper；不解析provider/domain文本 | Step12 total recovery mapping后置 |
| façade applicability | TruthWrite/Inbound/Maintenance仅在exact accepted H-family obligation存在时调用；Query、duplicate、claim/report/finalize-only、publisher marker-only绕过 | Step09逐flow回灌后置 |
| rollback / unknown | known failure无可见subset；allocated cursor可留下不可见gap且不复用；`CommitOutcomeUnknown`既非rollback也非success，禁止盲重跑 | Step11/13 durable behavior review后置 |
| truth boundary | records/followers只承载observation/audit/evidence projection，不拥有或反写source/business truth、external acceptance、verdict或signoff | 后续模块不得弱化 |
| upstream blocker | `R06.6-F2-H13-UPSTREAM=open_controlled`；只有`CoordinateObservationReplay`可写per-target H13，`DefineReplayScope`暂不写H13 | formal `03`重装配前受控裁定formal `02`映射 |
| downstream blocker | `R06-F-AFFECT-UOW-01=open_controlled_downstream`；exact子项已覆盖Step07/08/09/11/13/16 | R06.8后按门禁传播，当前不改冻结文件 |

F2 owner addendum已同步`contracts` cursor copy/ordering、R06.5 records factory、R06.4 boundary/maintenance对象，以及E批error/service owner。所有verification仍为`planned/not_run`；未生成实现commit、run id、evidence alias、验收签署或测试结果。

该句只保留为 F2 historical checkpoint；current pointer 已由 §6.29 覆盖为 `R06.7-E_done_waiting_user_before_R06.8`。未经用户确认不得进入 R06.8、修改Step07~19/formal`03`/任何`04`文件或实现代码。

### 6.25 R06.7-A runtime / infra / entry authority and inventory historical checkpoint

`03_ddd_step_06_runtime_infra_entry_carriers.md` §§1~11 remains the authority and inventory source for R06.7-A and has been consumed by R06.7-B~E. A completed authority order, owner inventory, historical conflict ruling, and named defer boundaries; later batches own each exact qualification and schema conclusion.

| surface | current conclusion | remaining gate |
|---|---|---|
| application availability | `AdapterAvailabilityScope`, `AdapterAvailabilityKind`, and `AdapterAvailabilityState` remain application-owned under `application::ports::runtime`; infra only probes and assembles snapshots | R06.7-B independent object cards and read-only behavior |
| runtime-builder registration | `ValidatedInboundConsumerRegistration` and `ValidatedJobScheduleRegistration` have one data-definition owner: `infra::runtime_builder`; Step 07/14 retain technical use-sites only | resolved in R06.7-C carrier cards and exact assembly rules |
| bounded consumer delivery | `InboundConsumerDelivery`, `InboundEnvelopeFrame`, and `InboundConsumerCompletion` are technical entry carriers; frame is bounded and single-consumption, completion is transport action, neither is business truth | resolved in R06.7-C exact fields, constructors, and error mapping |
| finite handler catalogs | Consumer and Job catalogs are finite typed slots with totality checks; generic maps and fallback handlers are prohibited | resolved in R06.7-C catalog cards and registration boundary |
| runtime assembly | historical R06.7-C aggregate `BuiltObservabilityRuntime`曾按complete-or-error设计；current由R06.8-B三个具名profile-specific runtime取代；`RuntimeAssemblyIssueRef`仍只作安全诊断关联，`RuntimeAssemblyError`仍为startup-only | aggregate shape superseded；current exact schema见§6.30.2与R06.8-B §8 |
| API / worker / jobs | A列出的handler state、loop state与runner context只是provisional candidates；D逐对象审查已将五者统一裁定为`DX`，entry用static handler、root assignment与per-call value承接 | resolved by R06.7-D and confirmed by E final inventory |
| disposition layer | `ObservationConsumerDisposition`、`ObservationJobDisposition`和`EntryDisposition`均为`HX`；无generic entry layer | resolved by deletion in R06.7-E；禁止alias/wrapper恢复 |
| raw config and private binding | raw config, locator, credential, endpoint, schedule, registry, and provider material remain Step 14 / infra-private; they cannot enter worker/jobs | outside R06.7; affected review only |
| upstream / downstream controls | `R06.6-F2-H13-UPSTREAM` and `R06-F-AFFECT-UOW-01` remain open and are not changed by R06.7-A | formal reassembly / R06.8 affected review |

R06.7-A verification is design-only. No runtime, integration, or implementation test was run; no commit, run ID, evidence alias, signoff, or implementation boundary was created. Its former pointer `R06.7-A_done_waiting_user_before_R06.7-B` has been consumed by the user-confirmed R06.7-B batch and is no longer current.

### 6.26 R06.7-B application runtime availability consumed checkpoint

`03_ddd_step_06_runtime_availability.md` §§1~14 is the canonical current source for the three availability object cards. It supersedes the merged availability draft in §7.8 and the field-level placeholder in §6.25; R06.7-A remains authoritative only for the wider runtime / entry inventory and owner boundaries.

| surface | current conclusion | remaining gate |
|---|---|---|
| `AdapterAvailabilityScope` | `application::ports::runtime` owner；`AdapterFamily + Option<ExternalEffectBindingRef>`；`Some`只允许EventPublisher、ReportHandoffDelivery、PeripheralExportDelivery | Step 07 affected review must consume the exact type without shadow definition |
| `AdapterAvailabilityKind` | finite `Available/Degraded/Unavailable/Misconfigured`；`Degraded`不等于unrestricted available；unknown probe mapping走typed error | Step 08/09/12 affected mapping remains frozen |
| `AdapterAvailabilityState` | immutable `scope + availability + observed_at` snapshot；time来自application clock；不持久化、不推进lifecycle | runtime registry replacement / Step 07 probe implementation remains downstream |
| historical `diagnostic_ref` | removed；probe不能mint durable diagnostic identity或因availability classification写diagnostic truth | Step 15 may define safe telemetry fields,not a snapshot ref |
| historical `require_available()` | removed；generic helper没有operation context，无法合法裁定Degraded或family-specific error | application façade performs contextual mapping using canonical `ApplicationError` |
| exact binding boundary | exact scope保留historical binding identity，不暴露infra `AdapterBindingRef` / locator / credential，也不fallback current/default target | Step 14 affected review must preserve raw/private split |
| truth / evidence boundary | snapshot不证明accepted、published、delivered、consumed、signed或evidence authenticity，不触发domain/projection/reference/outbox write | non-negotiable downstream invariant |
| upstream blockers | 未发现新的R06.7-B外部blocker；`R06.6-F2-H13-UPSTREAM`与`R06-F-AFFECT-UOW-01`原样保留 | outside R06.7-B |

R06.7-B verification is design-only and all planned cuts remain `planned/not_run`. No runtime, integration, or implementation test was run; no commit, real run ID, evidence alias, signoff, acceptance result, or implementation boundary was created. Its former pointer `R06.7-B_done_waiting_user_before_R06.7-C` has been consumed by the user-confirmed R06.7-C batch and is no longer current.

### 6.27 R06.7-C infra runtime builder and technical carriers consumed checkpoint

`03_ddd_step_06_runtime_infra_entry_carriers_r06_7c.md` §§1~28 is the canonical current source for C-batch technical carriers and complete-or-error assembly. R06.7-A remains the wider authority/inventory source, and R06.7-B remains the canonical source for the three application-owned availability objects; C references those types without shadow definitions.

| object group | closed objects | current conclusion | remaining gate |
|---|---|---|---|
| registration metadata | `ValidatedInboundConsumerRegistration`;`ValidatedJobScheduleRegistration` | locator-free、canonical、unique safe metadata；private transport/actor/scheduler slots remain infra-only | Step 07/14 affected review consumes definitions without copying |
| Consumer invocation | `InboundConsumerDelivery`;`InboundEnvelopeFrame`;`InboundConsumerCompletion` | bounded move-only frame；exact safe route metadata；completion wraps existing receipt only after explicit entry-policy action selection；it is not public/durable truth | D已确认直接per-call mapping且不新增candidate state；`Rejected`/`UnsupportedSchema`仍无默认action，E只审跨层重复 |
| Consumer catalog | `InboundConsumerHandlerCatalog` | nine explicit optional slots、fieldwise operation totality、prepare-all -> totality -> arm-all；no map/default/fallback | Step 07 owns exact handler/registrar trait signatures |
| Job invocation | `ObservationJobInvocation`;`ObservationJobInvocationResult`;`ObservationJobInvocationFailure` | nine exact typed request/response wrappers；C only checks typed variant plus fixed public name；Protocol/Application failure preservation；no metadata/report/result mint | D已确认exact handler直接消费完整invocation且不新增runner context；exact mapper仍拥有input与深层response/report invariant |
| Job catalog | `ObservationJobHandlerCatalog` | nine explicit slots via shape-only `from_slots(...)`；registrar owns enabled/scheduled totality checks and `EntryBindingIncomplete` context；external-audit public/internal spelling has static mapping | Step 07 owns exact handler/registrar trait signatures |
| entry-safe slices | `ValidatedWorkerEntryConfig`;`ValidatedJobsEntryConfig` | typed bounded values and finite sets only；no locator/material；enabled-but-unscheduled Job remains one-shot callable | D已按read-only输入消费；least-authority root split登记为affected seam，待R06.8/Step07/14闭合 |
| historical runtime assembly | aggregate `BuiltObservabilityRuntime`;`RuntimeAssemblyIssueRef`;`RuntimeAssemblyError` | R06.7-C stages 1~4 / 5~12 / 13 checkpoint保留为历史recipe输入；其exact twelve-field aggregate已被R06.8-B supersede | current为`build_api/build_worker/build_jobs`分别产出一个具名runtime；Step 07/14传播matching process-local activation且不得复制aggregate |

The C quality review removed every remaining placeholder constructor (`<variant>` / `try_new(...)`) and the premature `RuntimeBuildFuture` reference. It also separates Consumer action shape from entry policy, removes the nonexistent universal Job request validator assumption, and makes deep Job response/report consistency an exact response-assembler precondition. All fifteen objects have an owner, field/source boundary, exact constructor/member surface, lifecycle/persistence decision, error mapping, forbidden surface, and planned verification cuts. No generic string routing, `Vec`/`HashMap` handler lookup, schedule-to-request synthesis, partial runtime, warning runtime, runtime identity token, or business-truth write is permitted.

At the C checkpoint no new external upstream blocker was found. R06.7-E later closed only `R06.7-ENTRY-DISPOSITION-OWNER` by deletion; `03-RPR-S06-GRANULARITY`, `R06.6-F2-H13-UPSTREAM`, `R06-F-AFFECT-UOW-01`, `03-RPR-S08-PER-PROTOCOL`, and `03-RPR-S09-PER-FLOW` retain their existing states and scopes. C verification is design-only; every implementation/runtime/integration check remains `planned/not_run`. No implementation commit, real run ID, evidence alias, acceptance signature/result, implementation ledger, or boundary skeleton was created.

C was consumed by the user-confirmed R06.7-D/E reviews and is no longer the current pointer. C-01~C-10 and C-12/C-14/C-15 remain canonical; E marked C-11/C-13 `FC_affected` without reopening their owner. The current gate and next reading order are defined only by §6.29.

### 6.28 R06.7-D entry-local carrier qualification consumed checkpoint

`03_ddd_step_06_entry_local_carriers_r06_7d.md` §§1~20 is the canonical source for D-batch qualification, entry execution boundaries, affected-use register, planned cuts, and stop review. D consumed A §§1~11, B §§1~14, C §§1~28, Step 05 entry dependency boundaries, R06.6 application carriers, and only the necessary frozen entry use-sites; it did not change the C schemas or any frozen downstream document.

| candidate / boundary | D conclusion | implementation-facing consequence | remaining gate |
|---|---|---|---|
| `ObservationCommandHandlerState` | `DX` | 16 exact static handlers borrow one API root assignment；operation/context/input/result remain per-call；no `last_entry_disposition` | E confirmed；R06.8/Step07 exact input seam |
| `ObservationQueryHandlerState` | `DX` | 14 exact static handlers expose only read façade and per-request metadata；no visibility/default/result cache or write authority | E confirmed |
| `OutboxPublisherLoopState` | `DX` | publication has one authority: complete `PublishObservationOutbox` Operations Job；no resident cursor/loop/error recovery path | `R06.7-D-PUBLICATION-JOB-SEAM` |
| `ProjectionWorkerLoopState` | `DX` | projection/reference/gap/replay/peripheral maintenance remains typed Operations Job；no worker trigger/config/façade/state | E confirmed；R06.8 affected-use audit |
| `ObservationJobRunnerContext` | `DX` | C-07 invocation -> C-10 exact handler -> application-owned context/input seam；no `JobRunRef` or identity wrapper | E confirmed；exact input seam |
| `EntryDisposition` | `HX` after E | no D candidate field needs it；stored/application/public/completion owners are already total | resolved by deletion；no alias/wrapper restoration |
| historical root composition | R06.7-D当时假设existing C-13 aggregate需要one-shot split | 已由R06.8-B改判为三个独立builder output，各含一个assignment且profile-local zero-partial | `superseded_by_R06.8-B`; current见§6.30.2 |
| digest / input assembly | canonicalizer exists but no executable exact assembler connects all entry families | application-owned assembler consumes typed material; entry cannot hash or construct private context | `R06-F1-AFFECT-07-01` |

D fixes publication to a single Job mode because the resident worker draft cannot prove actor-scoped idempotency, immutable plan, global claim/fence, durable report/stored-result, duplicate replay, or public Job response. The publication batch façade may remain only as an internal collaborator under the canonical Job orchestration; it cannot be a second entry authority. D likewise confirms that framework-required private state wrappers are noncanonical wiring details and may contain only the final least-authority root assignment.

| executable seam | current state | close condition |
|---|---|---|
| `R06-F1-AFFECT-07-01` | `open_controlled_affected` | application-owned exact input assembler consumes the existing digest canonicalizer for API/Consumer/Job before any mutation |
| `R06.7-D-ENTRY-ASSIGNMENT-SEAM` | historical `open_controlled_affected` | 当时的aggregate split close condition已被R06.8-B supersede；current为三个具名runtime分别被matching activation消费，不存在all-three same-assembly或cross-process transaction |
| `R06.7-D-PUBLICATION-JOB-SEAM` | `open_controlled_internal` | batch publication is composed under the canonical Job plan/claim/report/stored-result lifecycle and resident publication mode is absent |

No new external upstream blocker was found. `R06.6-F2-H13-UPSTREAM`, `R06-F-AFFECT-UOW-01`, `03-RPR-S06-GRANULARITY`, `03-RPR-S08-PER-PROTOCOL`, and `03-RPR-S09-PER-FLOW` retain their prior states; the three executable seams above are internal/affected implementation-readiness blockers, not fabricated upstream dependencies. Every D verification cut remains `planned/not_run`; no implementation test, runtime result, commit, run ID, evidence alias, acceptance signoff/result, implementation ledger, or boundary skeleton was created.

This D checkpoint was consumed by E and is no longer the current pointer. E used the D source §§1~20, A §§1~11, B §§1~14, C §§1~28, this §6.28, the flow/ledger, R06.6 result carriers, C-05 and C-07~C-10, plus only the required frozen Step08/09 use-sites. Current status is defined by §6.29.

### 6.29 R06.7-E cross-module final audit historical checkpoint（consumed by §6.30）

`03_ddd_step_06_runtime_entry_cross_module_r06_7e.md` §§1~18 is the canonical source for the R06.7 final inventory, result/action ownership, C-03~C-10 cross-module closure, C-11/C-13 affected status, single publication mode, executable-seam handoff and stop review. E did not reopen any C-01~C-10 schema and did not modify formal `03` or frozen Step07~19.

#### 6.29.1 Final inventory and owner decisions

| subject | E conclusion | implementation consequence |
|---|---|---|
| availability B-01~B-03 | `FC`; application-owned immutable snapshots | infra constructs only；entry reads without authorization or truth ownership |
| C-01~C-10 | `FC`; existing fields/constructors/catalog boundaries remain canonical | no shadow schema、generic route map、default handler or request synthesis |
| C-11 `ValidatedWorkerEntryConfig` | `FC_affected` | inbound registration owner remains；resident publication cadence/limit cannot be implemented before R06.8 correction |
| C-12、C-14、C-15 | current qualification unchanged | jobs safe slice、startup issue ref and complete-or-error failure remain canonical |
| historical C-13 `BuiltObservabilityRuntime` | `HX after R06.8-B` | R06.7-E当时的`FC_affected`已被消费；aggregate不存在current owner，替代物是三个具名profile-specific runtime及其exact assignment |
| five handler/loop/context candidates | `DX` | static exact handlers、per-call values、C carriers and typed Operations Jobs carry the capability |
| `EntryDisposition` | `HX`; `R06.7-ENTRY-DISPOSITION-OWNER=resolved_by_deletion_in_R06.7-E_design_only` | no `ApiDisposition`、`WorkerDisposition`、`JobDisposition` or equivalent alias/wrapper |

#### 6.29.2 Result, action and error ownership

| concern | unique current owner | forbidden collapse |
|---|---|---|
| durable operation fact | `OperationResultDisposition` + `StoredObservationResult` | duplicate/ack/retry/public outcome |
| durable Job lifecycle | `JobReportState` + `ObservationJobReportDraft` | public `DuplicateReplayed`、scheduler state、real run/signoff |
| application return | five façade result carriers | transport action、public DTO、generic entry disposition |
| API public mapping | Step08 typed outcome/surface or typed `ApiError` | shared disposition intermediate |
| Consumer transport action | C-05 `InboundConsumerCompletion` | durable truth、public outcome owner、wildcard/default action |
| Job callback | C-08 complete result or C-09 failure | fabricated report/result、generic runner classification |

C-05 action selection must be total per Consumer protocol and flow. Only `Accepted` and `Duplicate` have a fixed acknowledge rule; `CommitOutcomeUnknown` requires a probe before retry/ack/dead-letter, and every other outcome requires an explicit branch. C-08 and C-09 remain mutually exclusive, and every complete Job response requires an exact response assembler before C-08 wrapping.

#### 6.29.3 Publication and executable seams

Publication has one entry authority: the complete `PublishObservationOutbox` Operations Job with typed input、idempotency、immutable plan、claim/fence、report、stored result and public response. No resident worker loop, cursor, cadence or current-config request synthesis may coexist. `ObservationPublicationService` may only be an internal collaborator under that Job orchestration.

| executable seam | state after E | R06.8 close condition |
|---|---|---|
| `R06-F1-AFFECT-07-01` | `open_controlled_affected` | exact API/Consumer/Job input assemblers invoke the application canonicalizer/context factory in a fixed typed order |
| `R06.7-D-ENTRY-ASSIGNMENT-SEAM` | historical `open_controlled_affected` | R06.8-B current correction：`build_api/build_worker/build_jobs`各自产出一个具名runtime；matching process-local activation一次消费，不承诺跨进程原子性 |
| `R06.7-D-PUBLICATION-JOB-SEAM` | `open_controlled_internal` | publication capability is callable only inside the canonical Job plan/claim/report/stored-result flow |

#### 6.29.4 Historical gate and truthfulness

At this historical E checkpoint no new external upstream blocker was found. `R06.6-F2-H13-UPSTREAM=open_controlled` and `R06-F-AFFECT-UOW-01=open_controlled_downstream` remained unchanged. `03-RPR-S06-GRANULARITY` was still open because R06.8 had not run；its current state is `resolved_in_R06.8_design_only` in §6.30. `03-RPR-S08-PER-PROTOCOL` and `03-RPR-S09-PER-FLOW` remain open in their existing scopes.

Historical pointer at that time: `R06.7-E_done_waiting_user_before_R06.8`. It was consumed by the user-confirmed R06.8 review and must not be used as a recovery point. The only current pointer and next-action rule are in §6.30.

Every E verification cut remains `planned/not_run`. No implementation/runtime/integration/acceptance test, commit, real run ID, evidence alias, signoff, implementation ledger or boundary skeleton was created.

### 6.30 R06.8 final Step 06 checkpoint

`03_ddd_step_06_application_input_assembly_r06_8a.md` and `03_ddd_step_06_final_cross_module_gate_r06_8b.md` are the current R06.8 sources. They consume R06.7-E rather than modifying its historical checkpoint.

#### 6.30.1 Input assembly and exact types

| subject | R06.8 conclusion | implementation consequence |
|---|---|---|
| 48 service inputs | exact owner=`application::inputs`；16 Command、14 Query、9 Consumer、9 Job均有独立字段/factory | Step07/08不得首次定义或用generic family替代 |
| input assembler | three least-authority finite facets，one application implementation | api/worker/jobs只取得matching facet；无naked context factory/canonicalizer/raw hash |
| writer admission | Command/Consumer/Job input保留`RequestDigestCandidates`；context保存write candidate | atomic reserve按retained row profile选择candidate；Query无candidate/writer lane |
| corrected types | public Job correlation=`JobRunId`；snapshot=`ReferenceSnapshotStateRef`；peripheral target=consumer+projection scope | `JobExecutionRef`、`ReferenceSnapshotRef`、`PeripheralConsumerScopeRef`均不得进入current input definition |

#### 6.30.2 Publication, runtime and file owner

| subject | R06.8 conclusion | implementation consequence |
|---|---|---|
| C-11 | final Consumer-only `ValidatedWorkerEntryConfig`；删除cadence/limit | worker无resident publication authority |
| Operations Job façade | four entry-callable application façades；one `ObservationOperationsJobService`承接全部9 Job | publication不是第五entry façade；batch result只作内部Job fold |
| publication collaborator | crate-private claimed-item collaborator under plan/claim/report/stored-result lifecycle | 只能发布immutable snapshot+stable token；不能list/plan/claim/report/complete reservation |
| publication dead-letter association | `ObservationJobPlanItemOutcomeAssociation`固定11 tags，新增`PublicationDeadLetter { reason, dead_letter_ref, retained_failure }`与`publication_dead_letter` canonical encoding | terminal outbox reason/ref/retained failure必须exact一致；不得用generic failure或空association代替 |
| C-13 | `build_api/build_worker/build_jobs`分别返回`BuiltApiObservabilityRuntime`、`BuiltWorkerObservabilityRuntime`、`BuiltJobsObservabilityRuntime`；每个只含一个matching least-authority assignment | 无aggregate/generic runtime、independent accessor、Clone、downcast、任意重组或跨进程联合activation claim；相同`ConfigBindingRef`只证明同validated recipe |
| record file owner | logical `domain::records`映射到physical `domain/src/records/` tree | frozen `history.rs`为affected path；禁止双module owner |

#### 6.30.3 Gate and affected handoff

| item | state after R06.8 |
|---|---|
| `03-RPR-S06-GRANULARITY` | `resolved_in_R06.8_design_only` |
| `R06-F1-AFFECT-07-01` | `resolved_at_step06_definition_in_R06.8-A`; downstream use propagation pending |
| `R06.7-D-ENTRY-ASSIGNMENT-SEAM` | `resolved_at_step06_definition_in_R06.8-B`; Step07/14 propagation pending |
| `R06.7-D-PUBLICATION-JOB-SEAM` | `resolved_at_step06_definition_in_R06.8-B`; Step05/07/08/09/12/13/14 propagation pending |
| `R06-F2-AFFECT-04-FILE-OWNER` | `resolved_at_step06_decision_in_R06.8-B`; Step04 propagation pending |
| `R06.6-F2-H13-UPSTREAM` | unchanged `open_controlled` |
| `R06-F-AFFECT-UOW-01` | unchanged `open_controlled_downstream` |

No new external upstream blocker was found. Step 07~16 remain frozen affected material, formal `03` remains blocked until Step19, and every R06.8 test cut is `planned/not_run`.

Current pointer: `R06.8-B_done_design_only_waiting_user_before_Step07`. The only next action is to wait for explicit user confirmation before reading/writing Step 07 affected review. No implementation, commit, run ID, evidence alias, signoff, implementation ledger or boundary skeleton was created.

## 7. 结构化中间产物

### 7.1 修复前 Step 6 写入批次记录（historical invalidated）

> 本表只证明修复前曾写入这些范围,不再证明内容完整或门禁通过。current 状态只看 §6.1.1。

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| `6.0` | Step 状态、输入、SOP 回答、诊断、取舍 | historical_written | 否,需重审 | historical_invalidated | `R06.1`已替换控制面 |
| `6.1` | 批次表、模块顺序、非 core 闭口决策、字段来源规则 | historical_written | 否,需重审 | historical_invalidated | `R06.1/R06.7/R06.8` |
| `6.2` | `contracts` shared vocabulary / typed ref / marker / public enum | historical_written | 否 | historical_invalidated | `R06.2` |
| `6.3` | `domain` truth / state object | historical_written | 否 | historical_invalidated | `R06.3/R06.4` |
| `6.4` | `domain` policy / guard / record family | historical_written | 否 | historical_invalidated | `R06.5` |
| `6.5` | `application` service helper / idempotency / stored result / visibility / disposition | historical_written | 否 | historical_invalidated | `R06.6` |
| `6.6` | application runtime boundary、`infra` / `api` / `worker` / `jobs` stable carrier 与 defer 决策 | historical_written | 否 | historical_invalidated | `R06.7` |
| `6.7` | 字段来源审计、状态闭环审计、Step 7 承接清单、回填草稿、自检 | historical_written | 否 | historical_invalidated | `R06.8` |

### 7.2 模块执行顺序表

| 顺序 | 模块 | 模块职责 | 输入来源 | 完成后停审点 |
|---|---|---|---|---|
| 1 | `contracts` | 收口 public secondary types、typed ref、state / kind、view / report helper | Step 05 owner、概要对象池、协议边界 | Step 08 public DTO 不引用 domain-only 类型 |
| 2 | `domain` truth / state | 收口 observation-owned facts、markers、state objects | 概要 §6、§9 | 状态名、字段来源、factory 和 transition method 可回指 |
| 3 | `domain` policy / record | 收口 guard、policy、append-only history / audit records | 概要 Step 06 policies / history | policy 只判断,record 只追溯 |
| 4 | `application` | 收口 service object、idempotency、stored result、visibility decision、consumer / job disposition | Step 05 application capability | Step 07 不私补 operation context / stored result carrier |
| 5 | `application` runtime boundary + `infra` | application收口adapter availability port carrier；infra收口assembly marker,exact adapter留给Step 07 / 14 | Step 05 application / infra capability | application不依赖infra type；adapter不改变truth boundary |
| 6 | `api` / `worker` / `jobs` | 收口 entry disposition、loop state、job report draft | Step 05 entry module capability | entry 模块不拥有 truth |
| 7 | 跨模块审计 | 字段来源、状态 owner、Step 7 承接 | 当前 Step 6 全文 | historical target；current 需完成 `R06.8`,现在不得进入 Step 07 |

### 7.3 非 `contracts` / `domain` 模块对象闭口决策表

| 模块 | 当前 Step 6 是否闭口 | 需要闭口的对象组 | 若 defer 的理由 | 后续承接 Step |
|---|---|---|---|---|
| `application` | 是 | service facade、operation context、idempotency reservation、stored result、visibility decision、consumer disposition、job disposition、application error | port trait、repository function、transaction order 不是 Step 06 职责 | Step 07 / 09 / 11 / 13 |
| `infra` | 部分闭口 | store binding identity、runtime assembly marker；实现application-owned availability port | repository adapter exact functions、DDL、config key、product binding 需 Step 07 / 11 / 14 输入 | Step 07 / 11 / 14 |
| `api` | 是,仅 entry stable carrier | command handler state、query handler state、entry disposition | route path、HTTP/RPC schema 和 public DTO 留给 Step 08 | Step 08 / 09 |
| `worker` | 是,仅 loop / consumer stable carrier | inbound consumer disposition、outbox publisher loop state、projection worker loop state | event envelope schema 和 retry/backoff 留给 Step 08 / 13 | Step 08 / 13 |
| `jobs` | 是,仅 runner stable carrier | job runner context、job report draft、job exit disposition | job input/output protocol 和 config binding 留给 Step 08 / 14 / 16 | Step 08 / 14 / 16 |

### 7.4 修复前 `contracts` 模块对象草稿（historical invalidated by R06.2）

> 本节及其 `7.4-a` 子节只保留为修复输入。它含旧transparent consumer/maintenance、旧support family和旧error schema，不再是current definition。current contracts对象只能引用`03_ddd_step_06_contracts_carriers.md`；后续批次不得从本节恢复旧shape。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| body-free typed carrier | `core-contracts` shared id / metadata、安全 ref | `ObservationReceiptRef`、`EvidenceLinkageRef`、`GapStateRef` 等 | 无写入 | typed ref family | Step 08 |
| public state / kind | domain state name、read / handoff / delivery 状态 | public enum / kind / marker | 无写入 | public enum family | Step 08 / Step 10 |
| visibility / degraded surface | read policy、gap、safety disposition | `VisibilitySurface`、`DegradedSurface` | 无写入 | view helper | Step 08 / Step 09 |
| report / job helper | job progress、handoff、export preparation | `JobReportSurface`、`HandoffSurface` | 无写入 | report helper | Step 08 / Step 16 |

#### `contracts` 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `BodyFreeRef` | typed carrier primitive | value object | 承载不透明、非空、不可解析 body-free pointer | 不携带正文、不表达 truth owner |
| typed ref family | body-free typed carrier | newtype family | 为 receipt / signal / audit / evidence / handoff / retention / gap / reference / maintenance 提供 public ref | 不用裸 `String` 穿透 protocol |
| `VisibilitySurface` | visibility output | public helper | 表达 visible / restricted / not-visible / blocked / degraded | 不授权、不读取外部 truth |
| `DegradedSurface` | degraded output | public helper | 表达 degraded、gap、stale、blocked 的对外说明 | 不伪造成功 |
| public enum family | public state / kind | enum | 提供 DTO / view / event / job 可引用的状态名 | 不承载 domain transition logic |

#### `BodyFreeRef`

```rust
/// Body-free opaque pointer carried across public protocol surfaces.
pub struct BodyFreeRef {
    /// Non-empty opaque value generated or accepted at a trusted boundary.
    pub value: String,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `value` | `String` | 不透明引用值 | `system_generated`、`command_input`、`event_input` 或 `resolver_snapshot`;必须非空;不得解析成外部正文路径 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn as_str(&self) -> &str` | 返回引用字符串 | 无 | `&str` | 不暴露解析语义 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn new(String value) -> Result<Self, ProtocolError>` | 创建 body-free ref | `value`: 非空 opaque value | `Result<BodyFreeRef, ProtocolError>` | DTO / event / domain ref wrapper 构造 |

| 不变量 / 禁止事项 | 说明 |
|---|---|
| 非空 | 空字符串必须返回 `ProtocolError::InvalidRef` |
| body-free | 不得保存 file path、raw payload、evidence body、source body 或 provider body |

#### typed ref family

以下 public ref 均使用 `BodyFreeRef` 同构模式,但必须保持具名 newtype,实现侧不得退化成裸 `String` 或混用 ref owner。

| 类型 | 定义位置 | 字段 | 作用 | 来源 |
|---|---|---|---|---|
| `ObservationReceiptRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 observation intake receipt | `system_generated` / repository lookup |
| `SafetyDispositionRef` | `contracts::refs` | `value: BodyFreeRef` | 指向安全处置 | `system_generated` / same transaction |
| `CorrelationContextRef` | `contracts::refs` | `value: BodyFreeRef` | 指向关联语境 | `system_generated` / repository lookup |
| `SafeSignalRef` | `contracts::refs` | `value: BodyFreeRef` | 指向安全信号 | `system_generated` |
| `SignalRollupWindowRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 rollup 窗口 | `system_generated` / job input |
| `AuditProjectionRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 audit projection | `system_generated` |
| `EvidenceLinkageRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 body-free evidence linkage | `system_generated` |
| `ReportHandoffRecordRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 report handoff record | `system_generated` |
| `ReportConsumerRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 report / archive handoff 的逻辑消费边界，不是 destination locator | `command_input` / `validated_config` / trusted feedback envelope |
| `PeripheralConsumerRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 dashboard / alert / external-audit / GRC 等产品中立外围消费边界，不是产品配置 | `command_input` / `validated_config` / trusted feedback envelope |
| `AuthenticityHintRef` | `contracts::refs` | `value: BodyFreeRef` | 指向真实性提示 | `system_generated` |
| `RetentionMarkerRef` | `contracts::refs` | `value: BodyFreeRef` | 指向留存标记 | `system_generated` |
| `ActiveReferenceProtectionRef` | `contracts::refs` | `value: BodyFreeRef` | 指向活动引用保护 | `system_generated` |
| `ReplayScopeRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 replay scope | `system_generated` / job input |
| `NoWriteViolationRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 no-write violation | `system_generated` |
| `ReadVisibilityRef` | `contracts::refs` | `value: BodyFreeRef` | 指向读取可见性判断 | `system_generated` |
| `DiagnosticSummaryRef` | `contracts::refs` | `value: BodyFreeRef` | 指向诊断摘要 | `system_generated` |
| `DiagnosticScopeRef` | `contracts::refs` | `value: BodyFreeRef` | 指向嵌入 diagnostic projection 的 immutable scope | `system_generated`;首次 diagnostic projection create 时分配 |
| `DiagnosticRequestContextRef` | `contracts::refs` | `value: BodyFreeRef` | 指向一次只读请求语境 | `query_input`;只用于 correlation / audit context,不作为 projection identity |
| `GapStateRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 gap state | `system_generated` |
| `PeripheralDeliveryRef` | `contracts::refs` | `value: BodyFreeRef` | 指向外围交付状态 | `system_generated` |
| `ReferenceSnapshotRef` | `contracts::refs` | `value: BodyFreeRef` | 指向引用快照状态 | `system_generated` / resolver snapshot |
| `MaintenanceTargetRef` | `contracts::refs` | `value: BodyFreeRef` | 指向维护目标 | `job_input` |
| `ProjectionMaintenanceRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 projection maintenance state | `system_generated` |
| `ObservationReadModelRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 canonical observation read model projection | `system_generated`;首次 projection create 时分配 |
| `DiagnosticViewRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 explain-only diagnostic projection | `system_generated`;首次 diagnostic projection create 时分配 |
| `DashboardAlertExportViewRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 product-neutral peripheral export projection | `system_generated`;首次 consumer + scope projection create 时分配 |
| `RebuildProgressViewRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 maintenance progress projection | `system_generated`;首次 target progress create 时分配 |
| `ProjectionFreshnessMarkerRef` | `contracts::refs` | `value: BodyFreeRef` | 指向 projection freshness sidecar marker | `system_generated`;与 projection identity 建立一对一 binding |

projection typed ref 必须与 canonical projection scope / consumer scope / maintenance target 通过 projection lookup index 建立关系。`DiagnosticRequestContextRef` 只关联一次 Query,不得进入 projection lookup。scope 的 typed serialization 可以作为唯一 lookup key,但不得被 hash、拼接或直接包装为上述 owned ref。

`ReportConsumerRef` 与 `PeripheralConsumerRef` 必须落实为两个不可互换的 transparent newtype，而不是 type alias 或裸 `String`：

```rust
/// Body-free identity of one report or archive handoff consumer.
pub struct ReportConsumerRef(pub BodyFreeRef);

/// Body-free identity of one product-neutral peripheral export consumer.
pub struct PeripheralConsumerRef(pub BodyFreeRef);
```

两者复用 `BodyFreeRef::new` 的非空 / body-free validation，wire value 只序列化已验证的 opaque inner value。它们不得包含 endpoint、topic、bucket、path、credential、provider payload、report body、evidence body、真实 run ID、verdict 或 signoff；同一个 inner value 被不同 wrapper 包装时仍是两个不同 owner，catalog、token、DTO 和 digest 必须保留 wrapper discriminator。

#### protocol schema、source family 与 producer family

以下三个 finite type 归 `contracts::metadata`（planned file `crates/contracts/src/metadata.rs`，由 `contracts::lib` 明确 re-export）。它们是 protocol / config / idempotency 共用的 public support type，不由 `04-配置设计.md`、transport adapter 或 serde fallback 动态扩展：

```rust
/// Version of the L4-observability public protocol schema.
pub enum SchemaVersion {
    V1,
}

/// External truth or material family referenced by body-free observation input.
pub enum SourceFamilyKind {
    Bus,
    SourceOwner,
    Identity,
    Governance,
    Artifact,
    Runtime,
    Sandbox,
    Archive,
    ReportConsumer,
}

/// Authenticated producer boundary that emitted one inbound envelope.
pub enum ObservationProducerFamily {
    Bus,
    SourceOwner,
    Identity,
    Governance,
    Artifact,
    Runtime,
    Sandbox,
    Archive,
    ReportConsumer,
}
```

| Type | Exact wire tokens | Validation / invariant |
|---|---|---|
| `SchemaVersion` | `v1` | P0 binary-supported set只有`V1`；unknown token在payload parse前返回`UnsupportedSchemaVersion`；不得与`DigestProfileVersion(1)`、`StoreSchemaRevision`或source version混同 |
| `SourceFamilyKind` | `bus`;`source_owner`;`identity`;`governance`;`artifact`;`runtime`;`sandbox`;`archive`;`report_consumer` | 表示被引用材料 / truth owner family；unknown无`Other`分支；不会证明producer真实性、transport来源或业务成功 |
| `ObservationProducerFamily` | `bus`;`source_owner`;`identity`;`governance`;`artifact`;`runtime`;`sandbox`;`archive`;`report_consumer` | 表示已通过entry binding认证的envelope producer namespace；参与route、source-version comparator与dedup identity；不能由payload或consumer名称运行时猜测 |

Serialization 必须使用表中的 exact lowercase `snake_case` token，禁止 case-fold、trim alias、numeric alias、unknown passthrough 或 first-variant default。两个 family 即使 token 同名也没有 `From` / implicit cast；`SourceFamilyKind` 描述材料归属，`ObservationProducerFamily` 描述 envelope producer，二者的兼容关系只由 Step 08 的静态 Consumer 表判断。

#### digest value family

`core-contracts`当前不提供`RequestDigest` / `DigestSummary`。它们是Observability协议、幂等、outbox、plan和external intent共同使用的secondary public types，归`contracts::refs`：

```rust
/// Version of one canonical serialization and digest profile.
pub struct DigestProfileVersion(pub u16);

/// Lowercase hexadecimal digest value.
pub struct DigestValue(pub String);

/// Digest of one normalized command,event,or job input.
pub struct RequestDigest {
    pub profile_version: DigestProfileVersion,
    pub digest_value: DigestValue,
}

/// Digest of body-free material,stored payload,or structured outcome.
pub struct DigestSummary {
    pub profile_version: DigestProfileVersion,
    pub digest_value: DigestValue,
}
```

| Type | Invariant | Source / use |
|---|---|---|
| `DigestProfileVersion` | positive supported version；P0 v1 exact profile由Step 13 / 14固定 | application canonical serializer |
| `DigestValue` | exactly 64 lowercase hexadecimal characters for v1 | SHA-256 of canonical bytes；never raw body hash |
| `RequestDigest` | profile + value immutable；include/exclude按finite operation contract | operation context、reservation、plan |
| `DigestSummary` | profile + value immutable；material必须body-free | evidence linkage、stored surface/payload、item outcome、external token |

Unknown profile、malformed value或retained material profile不可读都是consistency/config failure；不得按当前profile重算后覆盖旧值。

#### committed cursor family

```rust
/// Opaque committed order within the observation-truth namespace.
pub struct ObservationCursor(pub u64);

/// Opaque committed order within the reference-only namespace.
pub struct ReferenceCursor(pub u64);

/// Tagged cursor carried by infrastructure that can observe either namespace.
pub enum ObservationCommittedCursor {
    /// Cursor allocated for an observation-owned truth change.
    Observation(ObservationCursor),

    /// Cursor allocated for a reference-only snapshot or refresh change.
    Reference(ReferenceCursor),
}

/// Opaque public cursor used only to resume stable outbox pending scans.
pub struct OutboxCursor(pub String);
```

| 类型 | 生成者 | 合法承载面 | 禁止事项 |
|---|---|---|---|
| `ObservationCursor` | `ObservationUnitOfWork.assign_observation_cursor` | observation truth/history、rollup/rebuild source position | 不表示 reference-only 顺序、row version 或 page cursor |
| `ReferenceCursor` | `ObservationUnitOfWork.assign_reference_cursor` | reference snapshot/refresh record | 不表示 observation truth 顺序或 external source version |
| `ObservationCommittedCursor` | application 将当前 UoW 唯一 allocator 结果包装为具名 variant | outbox pair、projection freshness marker、dependency freshness、stored result traceability | 不允许一个 UoW 同时出现两个 variant;adapter 不得丢弃 tag 后比较数值 |
| `OutboxCursor` | outbox repository page mapper | public outbox publication job / worker loop resume | 只编码稳定 pending scan 位置;不得当 committed cursor、event identity、version 或 publication claim |

#### external source version marker

```rust
/// Opaque source-side version token. It is never a local repository version.
pub struct OpaqueSourceVersionToken(pub String);

/// Body-free version marker asserted by one producer for one source.
pub struct ObservationSourceVersionRef {
    pub producer_family: ObservationProducerFamily,
    pub source_ref: ObservationSourceRef,
    pub version_token: OpaqueSourceVersionToken,
}
```

| Type | Source | Capability | Forbidden substitution |
|---|---|---|---|
| `OpaqueSourceVersionToken` | trusted producer / resolver boundary | equality and adapter-declared typed monotonic comparison | `occurred_at`,local clock,schema version,cursor,digest or row version |
| `ObservationSourceVersionRef` | inbound envelope / reference command / resolver result | binds one version token to exact producer + source;supports out-of-order guard | snapshot identity,repository `expected_version` or global ordering |

Missing source version remains explicit `None`;it must not be synthesized. A producer adapter may compare Older/Equal/Newer only for the same producer/source and a validated version scheme. Otherwise the result is Uncomparable and drives stale/degraded handling rather than an overwrite.

#### public projection and reference scopes

以下 scope 会直接出现在 Query / Operations Job public DTO 中,因此归 `contracts`,不是 application-private repository helper。

```rust
/// Public scope for read-model queries and projection rebuild jobs.
pub enum ObservationProjectionScope {
    ByObservation(ObservationReceiptRef),
    ByCorrelation(CorrelationContextRef),
    ByAuditSubject(AuditSubjectRef),
    ByReportHandoff(ReportHandoffRecordRef),
    ByMaintenanceTarget(MaintenanceTargetRef),
}

/// Public scope for body-free reference refresh jobs.
pub enum ObservationReferenceRefreshScope {
    ExplicitRefs(Vec<BodyFreeRef>),
    BySourceFamily(SourceFamilyKind),
    UnhealthyOnly,
    ByMaintenanceTarget(MaintenanceTargetRef),
}
```

| Scope | canonicalization | 边界 |
|---|---|---|
| `ObservationProjectionScope` | enum discriminator + typed ref lossless serialization | 可作为 lookup unique key;不得直接转换成 view ref |
| `ObservationReferenceRefreshScope` | variant-specific typed ref set / source family;`ExplicitRefs` canonical sorted/unique | 只选择 tracked body-free snapshots;不得触发 body scan 或全仓猜测 |

#### `VisibilitySurface`

```rust
/// Public visibility result for read, diagnostic, handoff, and export surfaces.
pub struct VisibilitySurface {
    /// Visibility classification safe for protocol output.
    pub kind: PublicVisibilityKind,

    /// Optional real gap explaining missing, stale, not-visible, or gap-backed blocked data.
    pub gap_ref: Option<GapStateRef>,

    /// Optional degraded output marker safe for consumers.
    pub degraded: Option<DegradedSurface>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `kind` | `PublicVisibilityKind` | public 可见性分类 | `domain_derivation` from `ReadVisibilityState` |
| `gap_ref` | `Option<GapStateRef>` | 解释不可见、缺失、stale或有真实gap支撑的阻断 | `repository_lookup` / `domain_derivation`；guard-only Blocked允许None |
| `degraded` | `Option<DegradedSurface>` | 降级输出说明 | `domain_derivation` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_visible(&self) -> bool` | 判断是否可公开输出 | 无 | `bool` | 只读 |
| `pub fn requires_redaction(&self) -> bool` | 判断是否必须隐藏具体字段 | 无 | `bool` | 不改变 visibility |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn visible() -> Self` | 创建 visible surface | 无 | `VisibilitySurface` | query / handoff response |
| `pub fn blocked(Option<GapStateRef> gap_ref) -> Self` | 创建 blocked surface | `gap_ref`: 仅在真实gap存在时Some | `VisibilitySurface` | forbidden body、no-write 或 retention block；不得为guard-only block伪造gap |

#### `PublicVisibilityKind`

```rust
/// Public visibility classification shared by query, handoff, and export protocols.
pub enum PublicVisibilityKind {
    /// The requested safe surface is visible to the current consumer.
    Visible,

    /// The requested surface is visible only within a narrower scope.
    Restricted,

    /// The requested surface exists but is not visible to the current consumer.
    NotVisible,

    /// The requested surface is blocked by safety, retention, or no-write guards.
    Blocked,

    /// The requested surface can be returned only with degraded semantics.
    Degraded,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Visible` | The requested safe surface is visible to the current consumer. | 可正常输出 | `ReadVisibilityState::Visible` | 不适用 |
| `Restricted` | The requested surface is visible only within a narrower scope. | 限制输出 | `ReadVisibilityState::Restricted` | 不适用 |
| `NotVisible` | The requested surface exists but is not visible to the current consumer. | 不可见,不等于缺失 | `ReadVisibilityState::NotVisible` | 不适用 |
| `Blocked` | The requested surface is blocked by safety, retention, or no-write guards. | 阻断 | `ReadVisibilityState::Blocked` / no-write / retention | 不适用 |
| `Degraded` | The requested surface can be returned only with degraded semantics. | 降级 | `DegradedOutputState::Active` | 不适用 |

#### `DegradedSurface`

```rust
/// Safe degraded output description that never fabricates success.
pub struct DegradedSurface {
    /// Public reason class for the degraded output.
    pub reason: DegradedReason,

    /// Gap or safety marker explaining why full output is unavailable.
    pub gap_ref: Option<GapStateRef>,

    /// Whether consumers may continue with limited material.
    pub limited_consumption_allowed: bool,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `reason` | `DegradedReason` | 降级原因 | `domain_derivation`;不得包含正文 |
| `gap_ref` | `Option<GapStateRef>` | 缺口引用 | `repository_lookup` / same transaction |
| `limited_consumption_allowed` | `bool` | 是否允许受限消费 | policy 输出,不能由 consumer 自行改写 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn blocks_handoff(&self) -> bool` | 判断是否阻断 handoff | 无 | `bool` | 只读 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_gap(DegradedReason reason, GapStateRef gap_ref) -> Self` | 从 gap 创建降级输出 | typed reason 和 gap ref | `DegradedSurface` | query / handoff / export response |

#### `DegradedReason`

```rust
/// Public degraded reason class.
pub enum DegradedReason {
    /// Expected observation material is absent from the local boundary.
    MissingMaterial,

    /// The source material is present but not fully visible.
    NotVisible,

    /// The source material or snapshot cannot currently be resolved.
    UnresolvedReference,

    /// The material is stale and must not be represented as fresh.
    Stale,

    /// A restricted scope permits only a narrower body-free surface.
    VisibilityLimited,

    /// Placeholder or insufficient origin quality permits only limited semantics.
    AuthenticityLimited,

    /// Safety policy allows only a reduced output.
    SafetyLimited,

    /// Retention, replay, or no-write guards blocked a full output.
    GuardBlocked,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `MissingMaterial` | Expected observation material is absent from the local boundary. | 缺失降级 | gap/readiness policy + real gap | 不适用 |
| `NotVisible` | The source material is present but not fully visible. | 不可见降级 | visibility policy | 不适用 |
| `UnresolvedReference` | The source material or snapshot cannot currently be resolved. | 引用不可解析 | reference freshness policy | 不适用 |
| `Stale` | The material is stale and must not be represented as fresh. | stale 降级 | projection / snapshot state | 不适用 |
| `VisibilityLimited` | A restricted scope permits only a narrower body-free surface. | restricted受限 | read/handoff policy | 不适用 |
| `AuthenticityLimited` | Placeholder or insufficient origin quality permits only limited semantics. | origin hint受限 | handoff policy | 不适用 |
| `SafetyLimited` | Safety policy allows only a reduced output. | 安全限制 | safety policy | 不适用 |
| `GuardBlocked` | Retention, replay, or no-write guards blocked a full output. | guard 阻断 | retention / no-write / replay policy | 不适用 |

#### `ObservationConsistencyHint`

```rust
/// Read-only caller preference for an already committed projection surface.
pub enum ObservationConsistencyHint {
    /// Return a committed stale view when visibility and safety policy allow it.
    AllowStale,

    /// Return a body only when the committed projection is currently fresh.
    RequireFresh,

    /// Return the safest committed body available and preserve exact freshness metadata.
    BestEffort,
}
```

| 变体 | Body规则 | 禁止事项 |
|---|---|---|
| `AllowStale` | Fresh / Stale 可按visibility返回；Rebuilding可返回旧committed body；Unknown不返回body | 不把Stale/Rebuilding改写为Fresh |
| `RequireFresh` | 仅Fresh可返回body；Stale/Rebuilding/Unknown返回`view=None`并保留exact surface | 不等待、不触发同步rebuild |
| `BestEffort` | Fresh / Stale / Rebuilding可按visibility和degraded policy返回最安全committed body；Unknown不返回body | 不用默认值填补unknown |

该类型只是Query请求偏好,不持久化、不成为freshness authority。persisted marker和maintenance/progress state始终优先；hint不能开启UoW、刷新reference、关闭gap或修复projection。

#### `AdapterFamily`

```rust
/// Product-neutral adapter family shared by boundary policies and runtime probes.
pub enum AdapterFamily {
    ObservationStore,
    ProjectionStore,
    IdempotencyStore,
    JobExecutionStore,
    ObservationSourceResolver,
    RuntimeSandboxResolver,
    GovernanceArtifactEvidenceResolver,
    SubjectObservationResolver,
    EventPublisher,
    ReportHandoffDelivery,
    PeripheralExportDelivery,
    Clock,
    IdGenerator,
}
```

`AdapterFamily` belongs to `observability-contracts` and is finite。It carries no provider/product name。Adding a family requires reopening the module/port/config boundary；runtime config cannot add string variants。

### 7.4-a `contracts` / `domain` error contracts

```rust
/// Validation failure produced before application orchestration.
pub enum ProtocolError {
    /// A body-free typed reference is empty,malformed,or owned by another boundary.
    InvalidRef,
    /// Required envelope or metadata fields are missing or inconsistent.
    InvalidEnvelope,
    /// The declared operation does not match the concrete body type.
    RouteBodyMismatch,
    /// The inbound event schema version is unsupported.
    UnsupportedSchemaVersion,
    /// A public page cursor cannot be decoded under the declared query.
    InvalidPageCursor,
}

/// Observation-domain factory,policy,and state-transition failure.
pub enum DomainError {
    /// A required body-free reference is absent.
    MissingRequiredReference,
    /// A supplied scope does not match the object's formal scope.
    ScopeMismatch,
    /// The requested lifecycle transition is not allowed.
    InvalidStateTransition,
    /// The transition is reserved and has no current callable flow.
    ReservedTransition,
    /// A domain policy rejected the requested effect.
    PolicyRejected,
    /// The current actor or visibility context cannot read the surface.
    ReadNotAllowed,
    /// Safety or redaction invariants were violated.
    SafetyBoundaryViolation,
    /// Raw or forbidden body crossed a body-free boundary.
    BodyFreeBoundaryViolation,
    /// Authenticity fields would claim evidence that is not formally linked.
    AuthenticityBoundaryViolation,
    /// A reference snapshot or subject crossed its ownership boundary.
    ReferenceBoundaryViolation,
    /// Replay attempted an effect outside the approved observation-only scope.
    ReplayBoundaryViolation,
    /// Correlation identity conflicts with the existing canonical binding.
    CorrelationConflict,
    /// Reference identity or state conflicts with the current snapshot.
    ReferenceConflict,
    /// Retention release conflicts with an active protection.
    RetentionConflict,
    /// Gap and degraded-output fields are mutually inconsistent.
    GapInvariantViolation,
    /// Rollup identity,scope,or source position is inconsistent.
    RollupInvariantViolation,
    /// Required rollup source material is incomplete.
    RollupIncomplete,
    /// Report handoff readiness guards are not satisfied.
    HandoffNotReady,
    /// A maintenance,rollup,or replay completion lacks required members or records.
    MaintenanceIncomplete,
}
```

| Error owner | 允许表达 | 禁止表达 | Step 12 mapping |
|---|---|---|---|
| `ProtocolError` | ref/envelope/route/schema/page的纯输入验证 | repository、UoW、domain state、adapter message | invalid request / unsupported schema |
| `DomainError` | factory、policy、scope、boundary、state与对象不变量 | transport status、retry参数、SQL/network错误 | rejected/blocked/quarantined/conflict或item failure |

错误variant是control-flow authority,不得通过自由字符串扩展。subject、issue、gap和trace detail由application/protocol carrier以body-free typed ref承载,不得塞入raw message或external body。

### 7.5 修复前 `domain` 模块对象草稿（historical invalidated by R06.3 / R06.4）

> 本节只保留 full-restart 修复前的 capability、对象字段和函数草稿，用于解释粒度缺口与后续传播来源，不再是 current definition。core truth / signal / audit 的 current schema 只见 `03_ddd_step_06_domain_truth_signal_audit.md`，handoff / retention / replay / read / reference / maintenance 的 current schema 只见 `03_ddd_step_06_boundary_read_maintenance.md`。本节出现的直接返回 `*Record`、旧 `ReferenceSnapshotRef`、原地 `DiagnosticSummary` / `DegradedOutputState` mutation、scope-only replay coordination 或旧 maintenance authorization shape 均为 historical material，不得落码或回灌下游。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| intake and safety truth | source ref、safe summary、actor、purpose | receipt、safety disposition、decision record | observation-owned write | `ObservationReceipt`;`SafetyDisposition`;`IntakeDecisionRecord` | Step 09 / 10 / 11 |
| correlation and signal truth | receipt、correlation hints、runtime safe summary | correlation context、safe signal、rollup window | state transition / stale marker | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow` | Step 09 / 10 |
| audit and evidence projection | correlation、source audit ref、body-free evidence ref | audit projection、evidence linkage、append record | append-only projection | `AuditProjection`;`EvidenceLinkage`;`AuditAppendRecord` | Step 07 / 09 / 11 |
| handoff and authenticity | evidence index input、consumer ref、gap / visibility | handoff record、authenticity hint、readiness | handoff state / lifecycle record | `ReportHandoffRecord`;`AuthenticityHint`;`HandoffLifecycleRecord` | Step 08 / 09 / 10 |
| retention / replay / no-write | protected observation ref、active consumer、job target | marker、protection、scope、violation | marker / violation state | `RetentionMarker`;`ActiveReferenceProtection`;`ReplayScope`;`NoWriteViolation` | Step 10 / 13 |
| read / diagnostic / gap / degraded | read context、gap source、projection freshness | visibility、diagnostic、gap、degraded state | read-side state only | `ReadVisibilityState`;`DiagnosticSummary`;`GapState`;`DegradedOutputState` | Step 08 / 09 / 10 |
| peripheral / reference / maintenance | consumer ref、snapshot、maintenance target | delivery state、export prep、snapshot state、maintenance state | derived maintenance state | `PeripheralDeliveryState`;`ReferenceSnapshotState`;`ProjectionMaintenanceState` | Step 11 / 14 / 16 |

#### `domain` 功能到对象映射

| 对象 | 承接功能 | 对象类别 | 对象能力 | 不承接的功能 / 禁止事项 |
|---|---|---|---|---|
| `ObservationReceipt` | intake and safety truth | aggregate | 建立准入事实和 admission state | 不保存 raw body、不拥有 source truth |
| `SafetyDisposition` | intake and safety truth | entity | 表达 redaction / forbidden body / quarantine 判断 | 不生成 report handoff |
| `CorrelationContext` | correlation truth | context object | 绑定 trace / causation / source / actor safe refs | 不反推业务 truth |
| `SafeSignal` | signal truth | entity | 表达安全 log / metric / trace 观察事实 | 不裁决 runtime execution truth |
| `AuditProjection` | audit projection | aggregate | 追加 audit fact 和 visibility state | 不替代 Governance / source audit truth |
| `EvidenceLinkage` | body-free linkage | entity | 保存 evidence / artifact / governance body-free linkage | 不保存 evidence body |
| `ReportHandoffRecord` | handoff | aggregate | 记录 handoff readiness / delivery lifecycle | 不生成 final verdict |
| `RetentionMarker` | retention guard | aggregate | hold / release / conflict / archive eligibility marker | 不执行 cleanup |
| `NoWriteViolation` | no-write guard | entity | 记录和阻断写源尝试 | 不修复 source truth |
| `GapState` | gap / degraded | entity | 表达 missing / not-visible / unresolved / unsafe output | 不补造默认成功 |
| `ReferenceSnapshotState` | reference support | state object | 表达 safe summary freshness / resolution | 不拥有外部 lifecycle |
| `ProjectionMaintenanceState` | derived maintenance | state object | 表达 projection rebuild / refresh progress | 不回写 truth |

#### `ObservationReceipt`

```rust
/// Admission fact for material entering the observability boundary.
pub struct ObservationReceipt {
    /// Stable receipt reference generated by observability.
    pub receipt_ref: ObservationReceiptRef,

    /// Body-free source reference explaining where the material came from.
    pub source_ref: ObservationSourceRef,

    /// Current admission state for this receipt.
    pub admission_state: ObservationReceiptState,

    /// Safety disposition attached to the receipt.
    pub safety_disposition_ref: Option<SafetyDispositionRef>,

    /// Purpose explaining why this material entered the observation side.
    pub submission_purpose: SubmissionPurpose,

    /// Time when the receipt was recorded.
    pub received_at: ObservedAt,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `receipt_ref` | `ObservationReceiptRef` | 准入事实身份 | `system_generated` |
| `source_ref` | `ObservationSourceRef` | 来源引用 | `command_input` / `event_input`;必须 body-free |
| `admission_state` | `ObservationReceiptState` | 当前准入状态 | factory 初始 `Received`,transition method 更新 |
| `safety_disposition_ref` | `Option<SafetyDispositionRef>` | 安全处置引用 | same transaction 或 repository lookup |
| `submission_purpose` | `SubmissionPurpose` | 进入观察面的目的 | command / event input;不得是自由文本正文 |
| `received_at` | `ObservedAt` | 记录时点 | system clock / metadata |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn accept(&mut self, SafetyDispositionRef disposition_ref, ActorSafeRef actor_ref) -> Result<IntakeDecisionRecord, DomainError>` | 转为 accepted 并形成审计记录 | `disposition_ref` 必须指向 safe / redacted disposition | `IntakeDecisionRecord` | 只能从 `Received` / `Degraded` 进入 `Accepted` |
| `pub fn reject(&mut self, IntakeRejectReason reason, ActorSafeRef actor_ref) -> Result<IntakeDecisionRecord, DomainError>` | 拒绝材料 | typed reason + actor | `IntakeDecisionRecord` | 不允许从 accepted 静默退回 |
| `pub fn quarantine(&mut self, QuarantineReason reason, ActorSafeRef actor_ref) -> Result<IntakeDecisionRecord, DomainError>` | 隔离高风险材料 | typed reason + actor | `IntakeDecisionRecord` | forbidden body 必须隔离或拒绝 |
| `pub fn degrade(&mut self, DegradedReason reason, ActorSafeRef actor_ref) -> Result<IntakeDecisionRecord, DomainError>` | 标记有限可解释 | typed reason + actor | `IntakeDecisionRecord` | degraded 不得被当作 accepted |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn receive(ObservationReceiptRef receipt_ref, ObservationSourceRef source_ref, SubmissionPurpose purpose, ObservedAt received_at) -> Self` | 建立 receipt 初始骨架 | id、source、purpose、time | `ObservationReceipt` | command / consumer intake |

```rust
/// Admission lifecycle for an observation receipt.
pub enum ObservationReceiptState {
    /// Material was received but has not yet passed safety admission.
    Received,

    /// Material can enter the observation-owned processing line.
    Accepted,

    /// Material was rejected and must not enter the processing line.
    Rejected,

    /// Material is quarantined because safety is not closed.
    Quarantined,

    /// Material can be used only with degraded semantics.
    Degraded,

    /// Material has been superseded by a safer or more complete receipt.
    Superseded,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Received` | Material was received but has not yet passed safety admission. | 初始态 | factory | `Accepted` / `Rejected` / `Quarantined` / `Degraded` |
| `Accepted` | Material can enter the observation-owned processing line. | 可进入主线 | `Received` / `Degraded` | `Superseded` |
| `Rejected` | Material was rejected and must not enter the processing line. | 拒绝终态 | `Received` | 不适用 |
| `Quarantined` | Material is quarantined because safety is not closed. | 隔离 | `Received` / `Degraded` | `Rejected` / `Superseded` |
| `Degraded` | Material can be used only with degraded semantics. | 降级可解释 | `Received` | `Accepted` / `Rejected` / `Superseded` |
| `Superseded` | Material has been superseded by a safer or more complete receipt. | 被替代历史态 | `Accepted` / `Degraded` / `Quarantined` | 不适用 |

#### `SafetyDisposition`

```rust
/// Safety decision for admitted material, enforcing redaction-first and body-free boundaries.
pub struct SafetyDisposition {
    /// Stable safety disposition reference.
    pub disposition_ref: SafetyDispositionRef,

    /// Receipt evaluated by this disposition.
    pub receipt_ref: ObservationReceiptRef,

    /// Current safety state.
    pub state: SafetyDispositionState,

    /// Redaction marker proving whether safe material exists.
    pub redaction_marker: RedactionMarker,

    /// Forbidden body marker detected during safety evaluation.
    pub forbidden_body: ForbiddenBodyFlag,

    /// Safe summary reference that may be consumed downstream.
    pub sanitized_summary_ref: Option<SafeSummaryRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `disposition_ref` | `SafetyDispositionRef` | 安全处置身份 | `system_generated` |
| `receipt_ref` | `ObservationReceiptRef` | 对应 receipt | repository lookup / same tx |
| `state` | `SafetyDispositionState` | 安全处置状态 | policy transition |
| `redaction_marker` | `RedactionMarker` | redaction 结果 | redaction policy / safe summary resolver |
| `forbidden_body` | `ForbiddenBodyFlag` | 禁止正文命中 | safety evaluation |
| `sanitized_summary_ref` | `Option<SafeSummaryRef>` | 安全摘要 | resolver snapshot;不能是正文 |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn allow_redacted(&mut self, RedactionMarker marker, SafeSummaryRef summary_ref) -> Result<(), DomainError>` | 标记为 redacted/safe | redaction marker + safe summary | `Result<(), DomainError>` | forbidden body false 时才允许 |
| `pub fn reject_unsafe(&mut self, ForbiddenBodyEvidence evidence) -> Result<(), DomainError>` | 因禁止正文拒绝 | body-free evidence marker | `Result<(), DomainError>` | 不保存证据正文 |
| `pub fn quarantine(&mut self, QuarantineReason reason) -> Result<(), DomainError>` | 标记隔离 | reason | `Result<(), DomainError>` | 后续只能诊断或拒绝 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn evaluate(SafetyDispositionRef disposition_ref, ObservationReceiptRef receipt_ref, ReceivedMaterialSummary summary) -> Self` | 建立 pending disposition | ref、receipt、body-free material summary | `SafetyDisposition` | intake service |

```rust
/// Safety lifecycle for material evaluation.
pub enum SafetyDispositionState {
    /// Safety evaluation has not completed.
    Pending,

    /// Material is safe for observation-side use.
    Safe,

    /// Material is safe only after redaction.
    Redacted,

    /// Material is rejected by safety policy.
    Rejected,

    /// Material must remain quarantined.
    Quarantined,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | Safety evaluation has not completed. | 初始态 | factory | `Safe` / `Redacted` / `Rejected` / `Quarantined` |
| `Safe` | Material is safe for observation-side use. | 可继续主线 | `Pending` | 不适用 |
| `Redacted` | Material is safe only after redaction. | 可继续但输出受限 | `Pending` | 不适用 |
| `Rejected` | Material is rejected by safety policy. | 拒绝终态 | `Pending` / `Quarantined` | 不适用 |
| `Quarantined` | Material must remain quarantined. | 隔离 | `Pending` | `Rejected` |

#### `CorrelationContext`

```rust
/// Observation-side correlation context that never upgrades opaque identifiers into business truth.
pub struct CorrelationContext {
    /// Stable correlation context reference.
    pub context_ref: CorrelationContextRef,

    /// Receipt that seeded this context.
    pub receipt_ref: ObservationReceiptRef,

    /// Trace reference safe for observation use.
    pub trace_ref: Option<TraceCorrelationRef>,

    /// Causation reference safe for observation use.
    pub causation_ref: Option<CausationRef>,

    /// Source reference bound to this correlation context.
    pub source_ref: ObservationSourceRef,

    /// Current correlation state.
    pub state: CorrelationContextState,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `context_ref` | `CorrelationContextRef` | 关联语境身份 | `system_generated` |
| `receipt_ref` | `ObservationReceiptRef` | 关联来源 receipt | repository lookup |
| `trace_ref` | `Option<TraceCorrelationRef>` | trace 相关性 | command / event input;opaque |
| `causation_ref` | `Option<CausationRef>` | 因果链 | command / event input;opaque |
| `source_ref` | `ObservationSourceRef` | 来源引用 | receipt copy |
| `state` | `CorrelationContextState` | 关联状态 | factory / transition |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn bind_source(&mut self, ObservationSourceRef source_ref, ActorSafeRef actor_ref) -> Result<CorrelationLinkRecord, DomainError>` | 绑定来源 | source ref + actor | `CorrelationLinkRecord` | 不读取 source body |
| `pub fn link_runtime_signal(&mut self, RuntimeSandboxSignalRef runtime_signal_ref) -> Result<CorrelationLinkRecord, DomainError>` | 绑定 runtime / sandbox 安全信号 | body-free runtime ref | `CorrelationLinkRecord` | 不裁决 execution truth |
| `pub fn degrade(&mut self, CorrelationGapReason reason) -> Result<CorrelationLinkRecord, DomainError>` | 标记 partial | reason | `CorrelationLinkRecord` | degraded 必须传播 |
| `pub fn invalidate(&mut self, CorrelationInvalidReason reason) -> Result<CorrelationLinkRecord, DomainError>` | 标记无效 | reason | `CorrelationLinkRecord` | invalid 不可继续主线 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_receipt(CorrelationContextRef context_ref, ObservationReceiptRef receipt_ref, ObservationSourceRef source_ref, CorrelationSeed seed) -> Self` | 从 receipt 和 seed 建立关联语境 | ref、receipt、source、seed | `CorrelationContext` | correlation service |

```rust
/// Correlation availability state.
pub enum CorrelationContextState {
    /// No stable source or trace binding exists yet.
    Unbound,

    /// The context has enough safe references for normal processing.
    Bound,

    /// The context is usable only with partial or degraded semantics.
    Partial,

    /// The context is invalid and must not be used.
    Invalid,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Unbound` | No stable source or trace binding exists yet. | 初始态 | factory | `Bound` / `Partial` / `Invalid` |
| `Bound` | The context has enough safe references for normal processing. | 正常主线 | `Unbound` / `Partial` | `Partial` / `Invalid` |
| `Partial` | The context is usable only with partial or degraded semantics. | 降级 | `Unbound` / `Bound` | `Bound` / `Invalid` |
| `Invalid` | The context is invalid and must not be used. | 终态 | `Unbound` / `Bound` / `Partial` | 不适用 |

#### `SafeSignal`

```rust
/// Safe log, metric, trace, or summary signal derived from redacted observation material.
pub struct SafeSignal {
    /// Stable safe signal reference.
    pub signal_ref: SafeSignalRef,

    /// Signal kind safe for public or downstream classification.
    pub signal_kind: SafeSignalKind,

    /// Correlation context associated with this signal.
    pub correlation_context_ref: CorrelationContextRef,

    /// Current signal state.
    pub state: SafeSignalState,

    /// Safe summary reference for this signal.
    pub summary_ref: SafeSignalSummaryRef,

    /// Optional runtime or sandbox source reference.
    pub runtime_signal_ref: Option<RuntimeSandboxSignalRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `signal_ref` | `SafeSignalRef` | 信号身份 | `system_generated` |
| `signal_kind` | `SafeSignalKind` | log / metric / trace / summary 分类 | command / event input,受 `SafeSignalPolicy` 约束 |
| `correlation_context_ref` | `CorrelationContextRef` | 关联语境 | repository lookup |
| `state` | `SafeSignalState` | 信号状态 | factory / transition |
| `summary_ref` | `SafeSignalSummaryRef` | 安全摘要 | resolver snapshot / redaction output |
| `runtime_signal_ref` | `Option<RuntimeSandboxSignalRef>` | runtime / sandbox 安全来源 | event input / resolver snapshot |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn record(&mut self, SafeSignalPolicy policy) -> Result<(), DomainError>` | 将 candidate 记录为正式 signal | policy object | `Result<(), DomainError>` | policy 必须通过 |
| `pub fn mark_degraded(&mut self, DegradedOutputState degraded) -> Result<(), DomainError>` | 绑定降级输出 | degraded state | `Result<(), DomainError>` | 不改写 summary |
| `pub fn suppress(&mut self, SignalSuppressionReason reason, ActorSafeRef actor_ref) -> Result<CorrelationLinkRecord, DomainError>` | 抑制信号输出 | reason + actor | `CorrelationLinkRecord` | suppressed 不进入 rollup |
| `pub fn is_exportable(&self) -> bool` | 判断是否可导出 | 无 | `bool` | 只读 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_summary(SafeSignalRef signal_ref, CorrelationContextRef context_ref, SafeSignalSummaryRef summary_ref, SafeSignalKind signal_kind) -> Self` | 建立 signal candidate | ref、context、summary、kind | `SafeSignal` | signal service |

```rust
/// Lifecycle for a safe signal.
pub enum SafeSignalState {
    /// The signal exists only as a candidate.
    Candidate,

    /// The signal has been recorded as observation-owned material.
    Recorded,

    /// The signal is suppressed and must not be emitted.
    Suppressed,

    /// The signal exists but depends on stale reference or projection data.
    Stale,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Candidate` | The signal exists only as a candidate. | 初始态 | factory | `Recorded` / `Suppressed` |
| `Recorded` | The signal has been recorded as observation-owned material. | 正常主线 | `Candidate` | `Suppressed` / `Stale` |
| `Suppressed` | The signal is suppressed and must not be emitted. | 抑制 | `Candidate` / `Recorded` / `Stale` | 不适用 |
| `Stale` | The signal exists but depends on stale reference or projection data. | stale | `Recorded` | `Recorded` / `Suppressed` |

#### `AuditProjection`

```rust
/// Append-only audit projection owned by observability, not by the source audit domain.
pub struct AuditProjection {
    /// Stable audit projection reference.
    pub projection_ref: AuditProjectionRef,

    /// Stable audit subject used by timeline and projection scope indexes.
    pub subject_ref: AuditSubjectRef,

    /// Correlation context used to explain this projection.
    pub correlation_context_ref: CorrelationContextRef,

    /// Body-free source audit reference.
    pub source_audit_ref: SourceAuditRef,

    /// Current audit projection state.
    pub state: AuditProjectionState,

    /// Latest append record produced by this projection.
    pub latest_append_record_ref: Option<AuditAppendRecordRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `projection_ref` | `AuditProjectionRef` | 投影身份 | `system_generated` |
| `subject_ref` | `AuditSubjectRef` | audit timeline / scope 主语 | command input;必须 body-free,不得从 source audit body 推导 |
| `correlation_context_ref` | `CorrelationContextRef` | 关联语境 | repository lookup |
| `source_audit_ref` | `SourceAuditRef` | source audit body-free ref | event / command input,不得保存 audit body |
| `state` | `AuditProjectionState` | 投影状态 | transition |
| `latest_append_record_ref` | `Option<AuditAppendRecordRef>` | 追加记录 | same transaction |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn append_fact(&mut self, EvidenceLinkageRef linkage_ref, ActorSafeRef actor_ref) -> Result<AuditAppendRecord, DomainError>` | 追加审计投影 | linkage ref + actor | `AuditAppendRecord` | append-only |
| `pub fn restrict_visibility(&mut self, EvidenceVisibilityReason reason) -> Result<AuditAppendRecord, DomainError>` | 标记受限 | reason | `AuditAppendRecord` | 不删除投影 |
| `pub fn attach_gap(&mut self, GapStateRef gap_ref) -> Result<AuditAppendRecord, DomainError>` | 绑定缺口 | gap ref | `AuditAppendRecord` | gap 不被当成功 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn create(AuditProjectionRef projection_ref, AuditSubjectRef subject_ref, CorrelationContextRef context_ref, SourceAuditRef source_audit_ref) -> Self` | 创建待追加投影 | ref、body-free subject、context、source audit ref | `AuditProjection` | audit evidence service |

```rust
/// Lifecycle for an observability audit projection.
pub enum AuditProjectionState {
    /// The projection is waiting for an append operation.
    PendingAppend,

    /// The projection has been appended.
    Appended,

    /// The projection exists but is restricted for the current consumer.
    VisibilityRestricted,

    /// The projection is suppressed by safety or visibility policy.
    Suppressed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `PendingAppend` | The projection is waiting for an append operation. | 初始态 | factory | `Appended` / `VisibilityRestricted` / `Suppressed` |
| `Appended` | The projection has been appended. | 正常主线 | `PendingAppend` | `VisibilityRestricted` / `Suppressed` |
| `VisibilityRestricted` | The projection exists but is restricted for the current consumer. | 受限 | `PendingAppend` / `Appended` | `Appended` / `Suppressed` |
| `Suppressed` | The projection is suppressed by safety or visibility policy. | 抑制 | `PendingAppend` / `Appended` / `VisibilityRestricted` | 不适用 |

#### `EvidenceLinkage`

```rust
/// Body-free linkage between an audit projection and an external evidence reference.
pub struct EvidenceLinkage {
    /// Stable evidence linkage reference.
    pub linkage_ref: EvidenceLinkageRef,

    /// Audit projection that owns this observation-side linkage relation.
    pub projection_ref: AuditProjectionRef,

    /// Boundary reference to governance, artifact, or evidence material.
    pub boundary_ref: GovernanceArtifactEvidenceReference,

    /// Explicit body-free purpose for consuming this evidence linkage.
    pub evidence_purpose: EvidenceConsumerPurpose,

    /// Current linkage state.
    pub state: EvidenceLinkageState,

    /// Digest or summary that proves stable body-free linkage.
    pub digest_summary: DigestSummary,

    /// Optional visibility reason when linkage is not fully visible.
    pub visibility_reason: Option<EvidenceVisibilityReason>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `linkage_ref` | `EvidenceLinkageRef` | linkage 身份 | `system_generated` |
| `projection_ref` | `AuditProjectionRef` | 所属 audit projection | command input + versioned repository lookup |
| `boundary_ref` | `GovernanceArtifactEvidenceReference` | 跨域 body-free ref | command / event / resolver snapshot |
| `evidence_purpose` | `EvidenceConsumerPurpose` | linkage 消费目的 | command/event typed input;进入唯一键,不得由下游产品名推导 |
| `state` | `EvidenceLinkageState` | linkage 状态 | policy transition |
| `digest_summary` | `DigestSummary` | body-free 摘要 | resolver snapshot;不得保存正文 |
| `visibility_reason` | `Option<EvidenceVisibilityReason>` | 不可见原因 | `EvidenceVisibilityPolicy` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn link(&mut self, BodyFreeLinkagePolicy policy) -> Result<(), DomainError>` | 标记 linkage 成立 | policy | `Result<(), DomainError>` | policy 必须确认 body-free |
| `pub fn body_block(&mut self, BodyBlockedReason reason) -> Result<(), DomainError>` | 阻断正文材料 | reason | `Result<(), DomainError>` | 不能保留 body |
| `pub fn mark_not_visible(&mut self, EvidenceVisibilityReason reason) -> Result<(), DomainError>` | 标记不可见 | reason | `Result<(), DomainError>` | not-visible 不等于 missing |
| `pub fn mark_stale(&mut self, ReferenceStaleReason reason) -> Result<(), DomainError>` | 标记 stale | reason | `Result<(), DomainError>` | handoff 必须感知 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn candidate(EvidenceLinkageRef linkage_ref, AuditProjectionRef projection_ref, GovernanceArtifactEvidenceReference boundary_ref, EvidenceConsumerPurpose evidence_purpose, DigestSummary digest_summary) -> Self` | 创建候选 linkage | linkage ref、projection ref、boundary、purpose、digest | `EvidenceLinkage` | LinkBodyFreeEvidence command |

```rust
/// Lifecycle for body-free evidence linkage.
pub enum EvidenceLinkageState {
    /// The linkage exists only as a candidate.
    Candidate,

    /// The linkage is body-free and usable.
    Linked,

    /// The linkage was blocked because body material was detected.
    BodyBlocked,

    /// The linkage exists but is not visible to the current consumer.
    NotVisible,

    /// The linkage depends on stale reference data.
    Stale,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Candidate` | The linkage exists only as a candidate. | 初始态 | factory | `Linked` / `BodyBlocked` / `NotVisible` |
| `Linked` | The linkage is body-free and usable. | 正常主线 | `Candidate` / `Stale` | `NotVisible` / `Stale` |
| `BodyBlocked` | The linkage was blocked because body material was detected. | 正文阻断 | `Candidate` | 不适用 |
| `NotVisible` | The linkage exists but is not visible to the current consumer. | 不可见 | `Candidate` / `Linked` / `Stale` | `Linked` / `Stale` |
| `Stale` | The linkage depends on stale reference data. | stale | `Linked` / `NotVisible` | `Linked` / `NotVisible` |

#### `ReportHandoffRecord`

```rust
/// Handoff record that prepares body-free observation material without producing final signoff.
pub struct ReportHandoffRecord {
    /// Stable handoff record reference.
    pub handoff_ref: ReportHandoffRecordRef,

    /// Stable observation-side scope prepared by this handoff.
    pub handoff_scope_ref: ReportHandoffScopeRef,

    /// Consumer boundary that will receive the handoff material.
    pub consumer_ref: ReportConsumerRef,

    /// Current report handoff lifecycle state.
    pub state: ReportHandoffState,

    /// Current readiness state for delivery.
    pub readiness: HandoffReadinessState,

    /// Evidence index input used for this handoff.
    pub evidence_index_input_ref: EvidenceIndexInputViewRef,

    /// Optional authenticity hint attached to this handoff.
    pub authenticity_hint_ref: Option<AuthenticityHintRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `handoff_ref` | `ReportHandoffRecordRef` | handoff identity | `system_generated` |
| `handoff_scope_ref` | `ReportHandoffScopeRef` | handoff observation scope | command input;body-free |
| `consumer_ref` | `ReportConsumerRef` | 目标消费边界 | command input |
| `state` | `ReportHandoffState` | 生命周期 | transition |
| `readiness` | `HandoffReadinessState` | 准备态 | `HandoffReadinessPolicy` |
| `evidence_index_input_ref` | `EvidenceIndexInputViewRef` | body-free evidence input | repository lookup |
| `authenticity_hint_ref` | `Option<AuthenticityHintRef>` | 真实性提示 | same transaction / lookup |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn prepare(&mut self, HandoffReadinessPolicy policy) -> Result<HandoffLifecycleRecord, DomainError>` | 准备 handoff | readiness policy | `HandoffLifecycleRecord` | 不生成 final verdict |
| `pub fn attach_authenticity_hint(&mut self, AuthenticityHintRef hint_ref) -> Result<HandoffLifecycleRecord, DomainError>` | 绑定真实性提示 | hint ref | `HandoffLifecycleRecord` | placeholder 必须可见 |
| `pub fn deliver(&mut self, HandoffDeliveryResult delivery_result) -> Result<HandoffLifecycleRecord, DomainError>` | 记录交付结果 | adapter delivery result | `HandoffLifecycleRecord` | delivered 不等于验收通过 |
| `pub fn block(&mut self, HandoffBlockReason reason) -> Result<HandoffLifecycleRecord, DomainError>` | 阻断 handoff | reason | `HandoffLifecycleRecord` | blocked 必须可诊断 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn draft(ReportHandoffRecordRef handoff_ref, ReportHandoffScopeRef handoff_scope_ref, ReportConsumerRef consumer_ref, EvidenceIndexInputViewRef input_ref) -> Self` | 创建 draft | handoff/scope/consumer/input refs | `ReportHandoffRecord` | PrepareReportHandoff |

```rust
/// Lifecycle for report handoff preparation and delivery.
pub enum ReportHandoffState {
    /// The handoff record exists but is not prepared.
    Draft,

    /// The handoff material has been prepared.
    Prepared,

    /// The handoff was delivered to the consumer boundary.
    Delivered,

    /// Delivery failed and may require retry or diagnostics.
    Failed,

    /// The handoff was cancelled and must not be delivered.
    Cancelled,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Draft` | The handoff record exists but is not prepared. | 初始态 | factory | `Prepared` / `Cancelled` / `Failed` |
| `Prepared` | The handoff material has been prepared. | 可交付 | `Draft` | `Delivered` / `Failed` / `Cancelled` |
| `Delivered` | The handoff was delivered to the consumer boundary. | 交付完成 | `Prepared` | 不适用 |
| `Failed` | Delivery failed and may require retry or diagnostics. | 失败 | `Draft` / `Prepared` | `Prepared` / `Cancelled` |
| `Cancelled` | The handoff was cancelled and must not be delivered. | 取消终态 | `Draft` / `Prepared` / `Failed` | 不适用 |

```rust
/// Readiness decision persisted with a report handoff record.
pub enum HandoffReadinessState {
    /// Required body-free evidence or visibility input is not complete.
    PendingEvidence,

    /// The handoff satisfies body-free, visibility, gap, retention, and no-write guards.
    Ready,

    /// A policy guard prevents handoff preparation or delivery.
    Blocked,

    /// The handoff is usable only with explicit degraded semantics.
    Degraded,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `PendingEvidence` | Required body-free evidence or visibility input is not complete. | 初始 / 待证据 | `draft` / readiness reevaluation | `Ready` / `Blocked` / `Degraded` |
| `Ready` | The handoff satisfies body-free, visibility, gap, retention, and no-write guards. | 可准备 / 可交付 | `PendingEvidence` / `Blocked` / `Degraded` | `Blocked` / `Degraded` |
| `Blocked` | A policy guard prevents handoff preparation or delivery. | 阻断 | `PendingEvidence` / `Ready` / `Degraded` | `Ready` / `Degraded` |
| `Degraded` | The handoff is usable only with explicit degraded semantics. | 受限可交付 | `PendingEvidence` / `Ready` / `Blocked` | `Ready` / `Blocked` |

#### `RetentionMarker`

```rust
/// Retention marker for observation-owned material.
pub struct RetentionMarker {
    /// Stable retention marker reference.
    pub marker_ref: RetentionMarkerRef,

    /// Protected observation-side reference.
    pub protected_ref: ProtectedObservationRef,

    /// Current retention state.
    pub state: RetentionMarkerState,

    /// Active protection that currently blocks release.
    pub active_protection_ref: Option<ActiveReferenceProtectionRef>,

    /// Optional archive eligibility hint that does not own archive truth.
    pub archive_eligibility_ref: Option<ArchiveEligibilityRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `marker_ref` | `RetentionMarkerRef` | 留存标记身份 | `system_generated` |
| `protected_ref` | `ProtectedObservationRef` | 被保护 observation-side 对象 | command / job input |
| `state` | `RetentionMarkerState` | 留存状态 | policy transition |
| `active_protection_ref` | `Option<ActiveReferenceProtectionRef>` | 活动保护 | repository lookup / same tx |
| `archive_eligibility_ref` | `Option<ArchiveEligibilityRef>` | archive eligibility 线索 | resolver / policy output;不拥有 archive package |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn place_hold(&mut self, ActiveReferenceProtectionRef protection_ref, ActorSafeRef actor_ref) -> Result<RetentionChangeRecord, DomainError>` | 建立 hold | protection ref + actor | `RetentionChangeRecord` | active protection 优先 |
| `pub fn mark_release_candidate(&mut self, RetentionReleaseReason reason, ActorSafeRef actor_ref) -> Result<RetentionChangeRecord, DomainError>` | 标记释放候选 | reason + actor | `RetentionChangeRecord` | 不是 cleanup |
| `pub fn mark_conflict(&mut self, RetentionConflictReason reason) -> Result<RetentionChangeRecord, DomainError>` | 标记冲突 | reason | `RetentionChangeRecord` | conflict 必须诊断 |
| `pub fn mark_archive_eligible(&mut self, ArchiveEligibilityRef archive_ref) -> Result<RetentionChangeRecord, DomainError>` | 输出 archive eligibility | archive ref | `RetentionChangeRecord` | 不写 archive truth |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_observation(RetentionMarkerRef marker_ref, ProtectedObservationRef protected_ref, RetentionPurpose purpose) -> Self` | 创建 marker | marker、protected ref、purpose | `RetentionMarker` | SetRetentionMarker |

```rust
/// Retention marker lifecycle.
pub enum RetentionMarkerState {
    /// No retention marker has been applied yet.
    Unmarked,

    /// Retention hold is active and blocks cleanup.
    ActiveHold,

    /// The material may be evaluated for release.
    ReleaseEligible,

    /// The observation-side retention hold was released.
    Released,

    /// Retention rules conflict with active references or handoff needs.
    Conflict,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Unmarked` | No retention marker has been applied yet. | 初始态 | factory | `ActiveHold` / `ReleaseEligible` / `Conflict` |
| `ActiveHold` | Retention hold is active and blocks cleanup. | hold | `Unmarked` / `ReleaseEligible` / `Conflict` | `ReleaseEligible` / `Conflict` |
| `ReleaseEligible` | The material may be evaluated for release. | 释放候选 | `Unmarked` / `ActiveHold` / `Conflict` | `Released` / `ActiveHold` / `Conflict` |
| `Released` | The observation-side retention hold was released. | 终态 | `ReleaseEligible` | 不适用 |
| `Conflict` | Retention rules conflict with active references or handoff needs. | 冲突 | `Unmarked` / `ActiveHold` / `ReleaseEligible` | `ActiveHold` / `ReleaseEligible` |

#### `NoWriteViolation`

```rust
/// Recorded attempt to write outside the observability-owned boundary.
pub struct NoWriteViolation {
    /// Stable no-write violation reference.
    pub violation_ref: NoWriteViolationRef,

    /// Context that triggered the violation.
    pub trigger_context_ref: NoWriteTriggerContextRef,

    /// Forbidden target that the operation attempted to write.
    pub attempted_write_target: ForbiddenWriteTargetRef,

    /// Current violation state.
    pub state: NoWriteViolationState,

    /// Optional audit record for this violation.
    pub record_ref: Option<NoWriteViolationRecordRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `violation_ref` | `NoWriteViolationRef` | 违例身份 | `system_generated` |
| `trigger_context_ref` | `NoWriteTriggerContextRef` | 触发语境 | application guard / job guard |
| `attempted_write_target` | `ForbiddenWriteTargetRef` | 禁止写入目标 | domain_derivation |
| `state` | `NoWriteViolationState` | 违例状态 | transition |
| `record_ref` | `Option<NoWriteViolationRecordRef>` | 审计记录 | same transaction |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn block(&mut self, NoWriteGuardPolicy policy, ActorSafeRef actor_ref) -> Result<NoWriteViolationRecord, DomainError>` | 阻断写源 | policy + actor | `NoWriteViolationRecord` | 不执行补偿写入 |
| `pub fn escalate(&mut self, NoWriteEscalationReason reason) -> Result<NoWriteViolationRecord, DomainError>` | 升级违例 | reason | `NoWriteViolationRecord` | escalation 只审计 |
| `pub fn close(&mut self, NoWriteCloseReason reason, ActorSafeRef actor_ref) -> Result<NoWriteViolationRecord, DomainError>` | 关闭语境 | reason + actor | `NoWriteViolationRecord` | 保留 history |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn detect(NoWriteViolationRef violation_ref, NoWriteTriggerContextRef trigger_context_ref, ForbiddenWriteTargetRef attempted_target) -> Self` | 建立 detected violation | refs | `NoWriteViolation` | query / job / export guard |

```rust
/// Lifecycle for a no-write violation.
pub enum NoWriteViolationState {
    /// A forbidden write attempt was detected.
    Detected,

    /// The forbidden write attempt was blocked.
    Blocked,

    /// The violation was escalated for operational review.
    Escalated,

    /// The violation handling context was closed.
    Closed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Detected` | A forbidden write attempt was detected. | 初始态 | factory | `Blocked` / `Escalated` |
| `Blocked` | The forbidden write attempt was blocked. | 阻断 | `Detected` | `Escalated` / `Closed` |
| `Escalated` | The violation was escalated for operational review. | 升级 | `Detected` / `Blocked` | `Closed` |
| `Closed` | The violation handling context was closed. | 关闭 | `Blocked` / `Escalated` | 不适用 |

#### `GapState`

```rust
/// Observable gap, missing material, not-visible material, or unsafe output marker.
pub struct GapState {
    /// Stable gap state reference.
    pub gap_ref: GapStateRef,

    /// Body-free source explaining the gap.
    pub source_ref: GapSourceRef,

    /// Classified gap kind.
    pub gap_kind: GapKind,

    /// Current gap lifecycle state.
    pub state: GapLifecycleState,

    /// Optional degraded output tied to this gap.
    pub degraded_ref: Option<DegradedOutputRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `gap_ref` | `GapStateRef` | gap identity | `system_generated` |
| `source_ref` | `GapSourceRef` | 缺口来源 | resolver snapshot / repository lookup |
| `gap_kind` | `GapKind` | missing / not-visible / unresolved / unsafe 分类 | `GapClassificationPolicy` |
| `state` | `GapLifecycleState` | gap 生命周期 | transition |
| `degraded_ref` | `Option<DegradedOutputRef>` | 降级输出 | same transaction |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn acknowledge(&mut self, ActorSafeRef actor_ref) -> Result<GapTransitionRecord, DomainError>` | 确认 gap | actor | `GapTransitionRecord` | 不表示已解决 |
| `pub fn mitigate(&mut self, DegradedOutputState degraded) -> Result<GapTransitionRecord, DomainError>` | 缓解并绑定 degraded | degraded state | `GapTransitionRecord` | 不能补造成功 |
| `pub fn close(&mut self, GapCloseReason reason, ActorSafeRef actor_ref) -> Result<GapTransitionRecord, DomainError>` | 关闭 gap | reason + actor | `GapTransitionRecord` | source truth 未被修复 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn open(GapStateRef gap_ref, GapSourceRef source_ref, GapKind gap_kind) -> Self` | 建立 open gap | ref、source、kind | `GapState` | RecordGapState / gap scan |

```rust
/// Lifecycle for a gap state.
pub enum GapLifecycleState {
    /// The gap is open and must be visible to downstream consumers.
    Open,

    /// The gap has been acknowledged but not closed.
    Acknowledged,

    /// The gap has been resolved within the observation boundary.
    Resolved,

    /// The gap is suppressed for the current surface but remains auditable.
    Suppressed,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Open` | The gap is open and must be visible to downstream consumers. | 初始态 | factory | `Acknowledged` / `Resolved` / `Suppressed` |
| `Acknowledged` | The gap has been acknowledged but not closed. | 已确认 | `Open` | `Resolved` / `Suppressed` |
| `Resolved` | The gap has been resolved within the observation boundary. | 已关闭 | `Open` / `Acknowledged` | 不适用 |
| `Suppressed` | The gap is suppressed for the current surface but remains auditable. | 当前输出隐藏 | `Open` / `Acknowledged` | `Open` / `Resolved` |

#### `ReferenceSnapshotState`

```rust
/// Resolution and freshness state for a body-free external reference snapshot.
pub struct ReferenceSnapshotState {
    /// Stable reference snapshot state reference.
    pub snapshot_ref: ReferenceSnapshotRef,

    /// Subject of the snapshot.
    pub subject_ref: ReferenceSubjectRef,

    /// Current freshness and resolution state.
    pub state: ReferenceSnapshotStateKind,

    /// Optional safe summary produced by a resolver.
    pub safe_summary_ref: Option<SafeExternalSummaryRef>,

    /// Last refresh record for this snapshot.
    pub refresh_record_ref: Option<ReferenceRefreshRecordRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `snapshot_ref` | `ReferenceSnapshotRef` | snapshot identity | `system_generated` |
| `subject_ref` | `ReferenceSubjectRef` | 被解析对象 | command / event / job input |
| `state` | `ReferenceSnapshotStateKind` | freshness / resolution | resolver result / job |
| `safe_summary_ref` | `Option<SafeExternalSummaryRef>` | 安全摘要 | resolver snapshot;不得保存正文 |
| `refresh_record_ref` | `Option<ReferenceRefreshRecordRef>` | 刷新记录 | same transaction |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn refresh(&mut self, ReferenceRefreshRecord record, Option<SafeExternalSummaryRef> summary_ref) -> Result<(), DomainError>` | 刷新 snapshot | refresh record + safe summary | `Result<(), DomainError>` | 不改外部 lifecycle |
| `pub fn mark_stale(&mut self, ReferenceStaleReason reason) -> Result<ReferenceRefreshRecord, DomainError>` | 标记 stale | reason | `ReferenceRefreshRecord` | 下游必须降级 |
| `pub fn mark_unresolved(&mut self, ReferenceResolutionReason reason) -> Result<ReferenceRefreshRecord, DomainError>` | 标记 unresolved | reason | `ReferenceRefreshRecord` | 不静默视为 missing |
| `pub fn mark_invalid(&mut self, ReferenceResolutionReason reason) -> Result<ReferenceRefreshRecord, DomainError>` | 标记无效 reference | typed resolution reason | `ReferenceRefreshRecord` | `Invalid` 为当前 snapshot 终态 |
| `pub fn mark_unavailable(&mut self, ReferenceResolutionReason reason) -> Result<ReferenceRefreshRecord, DomainError>` | 标记 resolver / adapter 暂不可用 | typed resolution reason | `ReferenceRefreshRecord` | 不得补造 resolved summary |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn pending(ReferenceSnapshotRef snapshot_ref, ReferenceSubjectRef subject_ref) -> Self` | 创建 pending snapshot | ref + subject | `ReferenceSnapshotState` | RegisterReferenceSnapshot |

```rust
/// Resolution and freshness state for external reference snapshots.
pub enum ReferenceSnapshotStateKind {
    /// The snapshot is waiting for resolution.
    Pending,

    /// The snapshot is resolved and fresh enough for current use.
    Resolved,

    /// The snapshot exists but is stale.
    Stale,

    /// The snapshot cannot currently be resolved.
    Unresolved,

    /// The snapshot target is invalid for this boundary.
    Invalid,

    /// The resolver or adapter is unavailable.
    Unavailable,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | The snapshot is waiting for resolution. | 初始态 | factory | `Resolved` / `Stale` / `Unresolved` / `Invalid` / `Unavailable` |
| `Resolved` | The snapshot is resolved and fresh enough for current use. | 可用 | `Pending` / `Stale` / `Unresolved` / `Unavailable` | `Stale` / `Unresolved` / `Invalid` / `Unavailable` |
| `Stale` | The snapshot exists but is stale. | stale | `Resolved` / `Unavailable` | `Resolved` / `Unresolved` / `Invalid` |
| `Unresolved` | The snapshot cannot currently be resolved. | 不可解析 | `Pending` / `Resolved` / `Stale` / `Unavailable` | `Resolved` / `Invalid` |
| `Invalid` | The snapshot target is invalid for this boundary. | 无效终态 | `Pending` / `Resolved` / `Stale` / `Unresolved` | 不适用 |
| `Unavailable` | The resolver or adapter is unavailable. | adapter 不可用 | `Pending` / `Resolved` / `Stale` / `Unresolved` | `Resolved` / `Stale` / `Unresolved` |

#### `DiagnosticScope` and `DiagnosticRequestContext`

```rust
/// Stable versioned diagnostic scope embedded in a diagnostic projection.
pub struct DiagnosticScope {
    /// Stable scope identity preserved across replacements of one diagnostic view.
    pub scope_ref: DiagnosticScopeRef,

    /// Canonical projection scope covered by this diagnostic material.
    pub projection_scope: ObservationProjectionScope,

    /// Canonical sorted body-free targets included in the captured source snapshot.
    pub target_refs: BodyFreeRefSet,

    /// Optional lower bound and required upper bound for observed material.
    pub time_window: DiagnosticTimeWindow,

    /// Visibility constraint applied when this scope is read.
    pub visibility_scope_ref: VisibilityScopeRef,
}

/// Bounded time window used only to select already stored observation material.
pub struct DiagnosticTimeWindow {
    pub starts_at: Option<ObservedAt>,
    pub ends_at: ObservedAt,
}

/// Transient context built for one read-only query;it is never projection truth.
pub struct DiagnosticRequestContext {
    pub request_context_ref: DiagnosticRequestContextRef,
    pub actor_ref: ActorSafeRef,
    pub projection_scope: ObservationProjectionScope,
    pub diagnostic_scope_ref: DiagnosticScopeRef,
    pub visibility_scope_ref: VisibilityScopeRef,
    pub requested_at: ObservedAt,
}
```

| 对象 | 构造函数 | 规则 | 持久化 |
|---|---|---|---|
| `DiagnosticScope` | `define(DiagnosticScopeRef scope_ref, ObservationProjectionScope projection_scope, BodyFreeRefSet target_refs, DiagnosticTimeWindow time_window, VisibilityScopeRef visibility_scope_ref) -> Result<Self, DomainError>` | targets canonical sorted/unique;`starts_at <= ends_at`;target 必须属于 projection scope;scope ref 不能由 target/scope 拼接 | versioned inside diagnostic bundle;first create generates ref,replacement preserves ref and atomically replaces the derived scope body |
| `DiagnosticRequestContext` | `for_query(DiagnosticRequestContextRef request_context_ref, ActorSafeRef actor_ref, ObservationProjectionScope projection_scope, DiagnosticScopeRef diagnostic_scope_ref, VisibilityScopeRef visibility_scope_ref, ObservedAt requested_at) -> Result<Self, DomainError>` | metadata actor/visibility 与 request scope lossless map;只允许 read purpose;write intent 在 entry validation 阶段拒绝 | never persisted by synchronous Query |

概要中的 `DiagnosticScope` `Defined / Restricted / Invalid` 在本详细设计不新增独立生命周期状态机:`Defined` 对应 factory success,`Restricted` 由 `ReadVisibilityState` / `VisibilitySurface` 表达,`Invalid` 对应构造错误。由此保持 Step 10 的 27 个正式 state owner 不变。

#### domain object family closure

以下对象采用同等 Rust-facing 深度,字段、函数和状态 owner 已闭口;后续 Step 不得改 owner,只能补 port、protocol、flow、矩阵或持久化。

| 对象 | 关键字段 | 关键函数 | 状态 enum / 变体 | 禁止事项 |
|---|---|---|---|---|
| `SignalRollupWindow` | `window_ref: SignalRollupWindowRef`;`scope: SignalRollupScope`;`window_kind: RollupWindowKind`;`state: SignalRollupState`;`signal_count: SignalCount`;`source_cursor: ObservationCursor` | `accept_signal(SafeSignalRef signal_ref) -> Result<(), DomainError>`;`seal(ActorSafeRef actor_ref) -> Result<(), DomainError>`;`reopen_for_rebuild(MaintenanceTargetRef target_ref) -> Result<(), DomainError>`;`fail(MaintenanceFailureReason reason) -> Result<(), DomainError>` | `SignalRollupState`: `Pending`;`Fresh`;`Stale`;`Rebuilding`;`Failed` | 不表达业务状态 truth |
| `AuthenticityHint` | `hint_ref: AuthenticityHintRef`;`handoff_ref: ReportHandoffRecordRef`;`state: AuthenticityHintState`;`evidence_origin: EvidenceOriginKind`;`placeholder_reason: Option<PlaceholderReason>` | `confirm_real_evidence(EvidenceOriginKind origin) -> Result<(), DomainError>`;`mark_placeholder(PlaceholderReason reason) -> Result<(), DomainError>`;`mark_insufficient(GapStateRefSet gaps) -> Result<(), DomainError>` | `AuthenticityHintState`: `Unassessed`;`RealEvidenceLinked`;`PlaceholderDetected`;`Insufficient` | 不伪造真实 evidence / run id |
| `ActiveReferenceProtection` | `protection_ref: ActiveReferenceProtectionRef`;`protected_ref: ProtectedObservationRef`;`state: ActiveReferenceProtectionState`;`consumer_refs: ObservationConsumerRefSet` | `attach_consumer(ObservationConsumerRef consumer_ref) -> Result<(), DomainError>`;`request_release(RetentionReleaseReason reason) -> Result<(), DomainError>`;`mark_expired(RetentionReleaseReason reason) -> Result<(), DomainError>`;`mark_conflicted(RetentionConflictReason reason) -> Result<(), DomainError>`;`release(ActorSafeRef actor_ref) -> Result<(), DomainError>` | `ActiveReferenceProtectionState`: `Unprotected`;`Protected`;`Expired`;`Released`;`Conflicted` | 不绕过合法引用 |
| `ReplayScope` | `scope_ref: ReplayScopeRef`;`target_refs: ReplayTargetRefSet`;`allowed_effect: ReplayAllowedEffect`;`state: ReplayScopeState` | `approve(NoWriteGuardPolicy policy, ActorSafeRef actor_ref) -> Result<(), DomainError>`;`block(ReplayBlockReason reason) -> Result<(), DomainError>`;`close(ReplayCloseReason reason) -> Result<(), DomainError>` | `ReplayScopeState`: `Defined`;`Approved`;`Blocked`;`Completed`;`Cancelled` | 不修 source truth |
| `ReadVisibilityState` | `visibility_ref: ReadVisibilityRef`;`kind: ReadVisibilityKind`;`request_context_ref: Option<DiagnosticRequestContextRef>`;`gap_ref: Option<GapStateRef>` | `is_visible() -> bool`;`restrict(VisibilityConstraintRef constraint_ref) -> Result<(), DomainError>`;`block(ReadBlockReason reason) -> Result<(), DomainError>` | `ReadVisibilityKind`: `Visible`;`Restricted`;`NotVisible`;`Blocked` | 不形成业务授权 truth |
| `DiagnosticSummary` | `summary_ref: DiagnosticSummaryRef`;`scope_ref: DiagnosticScopeRef`;`freshness: DiagnosticFreshnessState`;`safe_signal_refs: SafeSignalRefSet`;`gap_refs: GapStateRefSet`;`no_write_violation_refs: NoWriteViolationRefSet` | `attach_signal(SafeSignalRef signal_ref) -> Result<(), DomainError>`;`attach_gap(GapStateRef gap_ref) -> Result<(), DomainError>`;`attach_no_write_violation(NoWriteViolationRef violation_ref) -> Result<(), DomainError>`;`mark_stale(StalenessReason reason) -> Result<(), DomainError>` | `DiagnosticFreshnessState`: `Fresh`;`Stale`;`Partial`;`Unavailable` | 不下发控制命令;不修 source truth |
| `DegradedOutputState` | `degraded_ref: DegradedOutputRef`;`reason: DegradedReason`;`state: DegradedOutputKind`;`gap_ref: Option<GapStateRef>` | `block(DegradedBlockReason reason) -> Result<(), DomainError>`;`allow_limited(DegradedReason reason) -> Result<(), DomainError>` | `DegradedOutputKind`: `None`;`Active`;`Blocked` | 不生成替代成功 |
| `PeripheralDeliveryState` | `delivery_ref: PeripheralDeliveryRef`;`preparation_ref: ExternalAuditExportPreparationRef`;`consumer_ref: PeripheralConsumerRef`;`state: PeripheralDeliveryKind`;`view_ref: DashboardAlertExportViewRef` | `prepare(PeripheralExportPolicy policy) -> Result<(), DomainError>`;`record_delivery(PeripheralDeliveryResult result) -> Result<PeripheralDeliveryRecord, DomainError>`;`block(ExportBlockReason reason) -> Result<PeripheralDeliveryRecord, DomainError>` | `PeripheralDeliveryKind`: `Pending`;`Prepared`;`Delivered`;`Failed`;`Blocked`;`Cancelled` | 不反写真相 |
| `ExternalAuditExportPreparation` | `preparation_ref: ExternalAuditExportPreparationRef`;`consumer_ref: PeripheralConsumerRef`;`view_ref: DashboardAlertExportViewRef`;`visibility: VisibilitySurface`;`state: ExportPreparationState` | `prepare(PeripheralExportPolicy policy) -> Result<(), DomainError>`;`block(ExportBlockReason reason) -> Result<(), DomainError>`;`record_delivery(PeripheralDeliveryResult result) -> Result<(), DomainError>` | `ExportPreparationState`: `Draft`;`Prepared`;`Blocked`;`Delivered`;`Failed` | 不替代 report handoff |
| `ProjectionMaintenanceState` | `maintenance_ref: ProjectionMaintenanceRef`;`target_ref: MaintenanceTargetRef`;`state: ProjectionMaintenanceStateKind`;`progress_ref: Option<RebuildProgressViewRef>` | `for_missing_projection(ProjectionMaintenanceRef maintenance_ref, MaintenanceTargetRef target_ref) -> Self`;`schedule(DerivedMaintenancePolicy policy) -> Result<(), DomainError>`;`start(ProjectionMaintenanceRecord record) -> Result<(), DomainError>`;`complete(ProjectionMaintenanceRecord record) -> Result<(), DomainError>`;`fail(MaintenanceFailureReason reason) -> Result<(), DomainError>` | `ProjectionMaintenanceStateKind`: `Fresh`;`Stale`;`Rebuilding`;`Failed`;missing projection factory starts `Stale`,never `Fresh` | 不覆盖 observation truth |
| `ReplayCoordinationState` | `coordination_ref: ReplayCoordinationRef`;`scope_ref: ReplayScopeRef`;`state: ReplayCoordinationKind`;`no_write_guard_ref: NoWriteGuardPolicyRef` | `coordinate(ReplayCoordinationPolicy policy) -> Result<(), DomainError>`;`block(ReplayBlockReason reason) -> Result<(), DomainError>`;`complete(ReplayExecutionRecord record) -> Result<(), DomainError>`;`fail(MaintenanceFailureReason reason) -> Result<(), DomainError>` | `ReplayCoordinationKind`: `Pending`;`Coordinating`;`Blocked`;`Completed`;`Failed` | 不越过 no-write |
| `RollupRebuildState` | `rebuild_ref: RollupRebuildRef`;`window_ref: SignalRollupWindowRef`;`state: RollupRebuildKind`;`source_cursor: ObservationCursor` | `start(MaintenanceTargetRef target_ref) -> Result<(), DomainError>`;`complete(SignalCount rebuilt_count) -> Result<(), DomainError>`;`fail(MaintenanceFailureReason reason) -> Result<(), DomainError>` | `RollupRebuildKind`: `Pending`;`Running`;`Completed`;`Failed`;`Cancelled` | 不修 source data |

### 7.6 修复前 `domain` policy / guard / record family（historical repair input for R06.5）

> 本节的 generic policy、family 表、`String change_kind`、直接从 aggregate 构造 record 及旧 authorization enum 均已失效，只作为 `R06.5` 缺口清单。用户确认进入 `R06.5` 后，必须从 current R06.3/R06.4 decision / transition delta、same-UoW post-mutation aggregate snapshot 与 typed record metadata 三输入原则逐 policy / record 重建，不能从本节复制 shape。

#### policy / guard family

所有 policy object 都是 stateless 或配置快照驱动的 domain guard。它们可以持有 policy ref、rule set、scope 和 version,但不得保存业务 truth 或执行 adapter I/O。

```rust
/// Domain policy object that validates one observability boundary decision.
pub struct DomainPolicy<P, R> {
    /// Stable policy reference.
    pub policy_ref: P,

    /// Rule snapshot used for deterministic evaluation.
    pub rule_snapshot: R,
}
```

| 对象 | 关键输入 | 输出 | 必须定义的函数 | 禁止事项 |
|---|---|---|---|---|
| `IntakeAdmissionPolicy` | `ObservationSourceRef`;`SubmissionPurpose`;`SafetyDisposition` | admission decision | `evaluate(ObservationSourceRef source_ref, SubmissionPurpose purpose, SafetyDisposition disposition) -> Result<AdmissionDecision, DomainError>` | 不读取外部正文 |
| `SafetyDispositionPolicy` | `ReceivedMaterialSummary`;`SafetyEvaluationContext` | safety disposition kind | `classify(ReceivedMaterialSummary summary, SafetyEvaluationContext context) -> Result<SafetyDispositionState, DomainError>` | 不生成正文摘要 |
| `SafeSignalPolicy` | `CorrelationContext`;`SafeSignalSummaryRef`;`SafeSignalKind` | signal decision | `evaluate(CorrelationContext context, SafeSignalSummaryRef summary_ref, SafeSignalKind kind) -> Result<SignalDecision, DomainError>` | 不裁决 execution truth |
| `BodyFreeLinkagePolicy` | `GovernanceArtifactEvidenceReference`;`EvidenceConsumerPurpose` | linkage decision | `validate(GovernanceArtifactEvidenceReference boundary_ref, EvidenceConsumerPurpose purpose) -> Result<(), DomainError>` | 不读取证据正文 |
| `EvidenceVisibilityPolicy` | `EvidenceLinkage`;`EvidenceConsumerScope` | visibility decision | `evaluate(EvidenceLinkage linkage, EvidenceConsumerScope scope) -> Result<ReadVisibilityState, DomainError>` | 不把 not-visible 写成 missing |
| `AuthenticityHintPolicy` | `EvidenceIndexInputViewRef`;`GapStateRefSet` | authenticity hint | `assess(EvidenceIndexInputViewRef input_ref, GapStateRefSet gaps) -> Result<AuthenticityHint, DomainError>` | 不伪造真实 evidence |
| `HandoffReadinessPolicy` | `ReportHandoffRecord`;`VisibilitySurface`;`NoWriteGuardPolicy` | readiness | `evaluate(ReportHandoffRecord record, VisibilitySurface visibility, NoWriteGuardPolicy no_write) -> Result<HandoffReadinessState, DomainError>` | 不把 pending 写成 ready |
| `RetentionProtectionPolicy` | `RetentionMarker`;`ActiveReferenceProtection` | retention decision | `evaluate(RetentionMarker marker, ActiveReferenceProtection protection) -> Result<RetentionMarkerState, DomainError>` | 不定义 retention days |
| `ReplayBoundaryPolicy` | `ReplayScope`;`NoWriteGuardPolicy` | replay decision | `approve(ReplayScope scope, NoWriteGuardPolicy no_write) -> Result<ReplayScopeState, DomainError>` | 不扩大 replay scope |
| `NoWriteGuardPolicy` | `NoWriteTriggerContextRef`;`ForbiddenWriteTargetRef` | violation or pass | `assert_no_source_write(NoWriteTriggerContextRef context_ref, ForbiddenWriteTargetRef target_ref) -> Result<(), DomainError>` | 不允许静默通过 |
| `ReadVisibilityPolicy` | `DiagnosticRequestContext`;`ReadVisibilityState` | public visibility | `assert_can_read(DiagnosticRequestContext context, ReadVisibilityState visibility) -> Result<VisibilitySurface, DomainError>` | 不形成授权 truth |
| `GapClassificationPolicy` | `GapSourceRef`;`ReferenceSnapshotState`;`ReadVisibilityState` | gap kind | `classify(GapSourceRef source_ref, ReferenceSnapshotState snapshot, ReadVisibilityState visibility) -> Result<GapKind, DomainError>` | 不补造默认成功 |
| `DegradedOutputPolicy` | `GapState`;`SafetyDisposition`;`ReadVisibilityState` | degraded surface | `evaluate(GapState gap, SafetyDisposition disposition, ReadVisibilityState visibility) -> Result<DegradedOutputState, DomainError>` | 不隐藏 blocked |
| `PeripheralExportPolicy` | `PeripheralConsumerRef`;`DashboardAlertExportViewRef`;`VisibilitySurface` | export decision | `assert_export_allowed(PeripheralConsumerRef consumer_ref, DashboardAlertExportViewRef view_ref, VisibilitySurface visibility) -> Result<(), DomainError>` | 不反写 consumer truth |
| `ReferenceFreshnessPolicy` | `ReferenceSnapshotState`;`MaintenanceTargetRef` | freshness decision | `assert_refresh_allowed(ReferenceSnapshotState snapshot, MaintenanceTargetRef target_ref) -> Result<(), DomainError>` | 不拥有 external lifecycle |
| `AdapterBoundaryPolicy` | `AdapterFamily`;`SafeExternalSummaryRef` | adapter boundary decision | `assert_product_neutral(AdapterFamily family, SafeExternalSummaryRef summary_ref) -> Result<(), DomainError>` | 不引入 product truth |
| `DerivedMaintenancePolicy` | `MaintenanceTargetRef`;`ProjectionMaintenanceState`;`MaintenanceExecutionAuthorization` | maintenance decision | `assert_rebuild_allowed(MaintenanceTargetRef target_ref, ProjectionMaintenanceState state, MaintenanceExecutionAuthorization authorization) -> Result<(), DomainError>` | scheduled 不冒充 replay;replay 必须 Approved且覆盖 target;两者都不修 source truth |
| `ReplayCoordinationPolicy` | `ReplayScope`;`RetentionMarker`;`NoWriteGuardPolicy` | replay coordination decision | `coordinate(ReplayScope scope, RetentionMarker marker, NoWriteGuardPolicy no_write) -> Result<ReplayCoordinationState, DomainError>` | 不绕过 retention |

```rust
/// Validated authorization mode for one derived maintenance execution.
pub enum MaintenanceExecutionAuthorization {
    /// Normal scheduler or operator maintenance without replay semantics.
    Scheduled,

    /// Observation-side replay whose approved scope contains the target.
    Replay(ReplayScope),
}
```

`Scheduled` 只允许当前 Job 定义的 projection / progress / report effect,不授权 source write。`Replay(scope)` 必须在 application 层 versioned load `ReplayScope`,校验状态为 `Approved`、target membership 和 `ReplayAllowedEffect`;不能用 `None`、临时对象或默认 scope 冒充批准。

#### append-only record family

```rust
/// Append-only audit or history record produced by a domain transition.
pub struct ObservationHistoryRecord {
    /// Stable record reference.
    pub record_ref: BodyFreeRef,

    /// Object changed by this record.
    pub subject_ref: BodyFreeRef,

    /// Domain-specific change kind.
    pub change_kind: String,

    /// Actor or system agent responsible for the transition.
    pub actor_ref: ActorSafeRef,

    /// Time when the record was produced.
    pub recorded_at: ObservedAt,
}
```

| 记录对象 | subject | change kind | factory | 禁止事项 |
|---|---|---|---|---|
| `IntakeDecisionRecord` | `ObservationReceiptRef` | `IntakeDecisionKind` | `record_decision(ObservationReceipt receipt, IntakeDecisionKind kind, IntakeDecisionReason reason, ActorSafeRef actor_ref) -> Self` | 不修改 receipt |
| `CorrelationLinkRecord` | `CorrelationContextRef` | `CorrelationLinkChangeKind` | `record_change(CorrelationContext context, CorrelationLinkChangeKind kind, CorrelationChangeReason reason) -> Self` | 不重写 context |
| `AuditAppendRecord` | `AuditProjectionRef` | `AuditAppendKind` | `append(AuditProjection projection, AuditAppendKind kind) -> Self` | 不保存 source audit body |
| `HandoffLifecycleRecord` | `ReportHandoffRecordRef` | `HandoffLifecycleChangeKind` | `record_transition(ReportHandoffRecord record, HandoffLifecycleChangeKind kind) -> Self` | 不伪造交付成功 |
| `RetentionChangeRecord` | `RetentionMarkerRef` | `RetentionChangeKind` | `record_change(RetentionMarker marker, RetentionChangeKind kind, RetentionChangeReason reason) -> Self` | 不触发 cleanup |
| `NoWriteViolationRecord` | `NoWriteViolationRef` | `NoWriteViolationRecordKind` | `record_violation(NoWriteViolation violation, NoWriteViolationRecordKind kind) -> Self` | 不说明 source 已修复 |
| `ReadAccessRecord` | `DiagnosticRequestContextRef` | `ReadAccessKind` | `record_access(DiagnosticRequestContext context, ReadVisibilityState visibility, ReadAccessKind kind) -> Self` | 不授权访问 |
| `GapTransitionRecord` | `GapStateRef` | `GapTransitionKind` | `record_transition(GapState gap, GapTransitionKind kind) -> Self` | 不修复来源 |
| `PeripheralDeliveryRecord` | `PeripheralDeliveryRef` | `PeripheralDeliveryKind` | `record_delivery(PeripheralDeliveryState delivery, PeripheralDeliveryResult result) -> Self` | 不反写 consumer |
| `ReferenceRefreshRecord` | `ReferenceSnapshotRef` | `ReferenceRefreshKind` | `record_refresh(ReferenceSnapshotState snapshot, ReferenceRefreshKind kind) -> Self` | 不保存外部正文 |
| `ProjectionMaintenanceRecord` | `ProjectionMaintenanceRef` | `ProjectionMaintenanceKind` | `record_maintenance(ProjectionMaintenanceState state, ProjectionMaintenanceKind kind) -> Self` | 不修 truth |
| `GapScanRecord` | `MaintenanceTargetRef` | `GapScanKind` | `record_scan(MaintenanceTargetRef target_ref, GapScanKind kind) -> Self` | 不关闭未验证 gap |
| `ReplayExecutionRecord` | `ReplayScopeRef` | `ReplayExecutionKind` | `record_execution(ReplayScope scope, ReplayExecutionKind kind) -> Self` | 不声明 source repaired |

### 7.7 修复前 `application` 模块对象草稿（historical repair input for R06.6）

> 本节尚未经过 `R06.6` 逐对象修复，只能用于 inventory 和 use-site 诊断；其中 service、idempotency、stored result、outbox、job plan / claim / report 与 one-shot decision 的字段和函数都不是 current implementation contract。

| 功能 / capability | 输入 | 输出 | 状态 / 副作用 | 所属对象 | 后续 Step 承接 |
|---|---|---|---|---|---|
| command orchestration | Command DTO、metadata、actor | operation context、stored result | UoW / repository / outbox side effects | service objects | Step 07 / 09 / 11 |
| query orchestration | Query DTO、visibility scope | visibility decision、view result | read-only | query service / visibility decision | Step 08 / 09 |
| idempotency | typed operation、effective actor、idempotency key、request digest、optional source-event identity | atomic reserve outcome、stored result ref | acquired / replay / conflict / in-flight | `ObservationIdempotencyScope`;`ObservationIdempotencyReservation`;`ObservationIdempotencyReserveOutcome`;`StoredObservationResult` | Step 13 |
| consumer orchestration | envelope、dedup key、safe refs | consumer disposition | quarantine / ack / dead-letter | `ObservationConsumerDisposition` | Step 08 / 13 |
| job orchestration | job input、cursor、target | immutable plan、fenced claim、job disposition、report draft | progress / partial failure / resumable finalize | `ObservationJobExecutionPlan`;`ObservationExecutionClaim`;`ObservationJobDisposition`;`ObservationJobReportDraft` | Step 08 / 13 / 16 |

#### typed operation namespace

```rust
/// Route-neutral finite operation identity shared by context,digest,and idempotency.
pub enum ObservationOperationName {
    Command(ObservationCommandOperation),
    Query(ObservationQueryOperation),
    InboundConsumer(ObservationInboundConsumerOperation),
    Job(ObservationJobOperation),
}

pub enum ObservationCommandOperation {
    SubmitObservationMaterial,
    RecordSafetyDisposition,
    BindCorrelationContext,
    RecordSafeSignal,
    AppendAuditProjection,
    LinkBodyFreeEvidence,
    PrepareReportHandoff,
    EvaluateAuthenticityHint,
    SetRetentionMarker,
    ProtectActiveReference,
    DefineReplayScope,
    RecordNoWriteViolation,
    RecordGapState,
    PrepareExternalAuditExport,
    RegisterReferenceSnapshot,
    UpdateReferenceSnapshotState,
}

pub enum ObservationQueryOperation {
    GetObservationReceipt,
    GetIntakeStatus,
    GetSafeSignal,
    GetSignalRollup,
    GetAuditTimeline,
    GetEvidenceIndexInput,
    GetReportHandoff,
    GetRetentionProtection,
    GetObservationReadModel,
    GetDiagnosticView,
    GetGapStatus,
    GetPeripheralExportView,
    GetReferenceSnapshotView,
    GetRebuildProgress,
}

pub enum ObservationInboundConsumerOperation {
    ConsumeBusObservationMaterial,
    ConsumeSourceAuditMaterial,
    ConsumeIdentityObservationContext,
    ConsumeGovernanceAuditContext,
    ConsumeArtifactEvidenceContext,
    ConsumeRuntimeSignalSummary,
    ConsumeSandboxSignalSummary,
    ConsumeArchiveHandoffFeedback,
    ConsumeReportConsumerFeedback,
}

pub enum ObservationJobOperation {
    PublishObservationOutbox,
    RebuildObservationReadModels,
    RebuildSignalRollups,
    RefreshReferenceSnapshots,
    ScanObservationGaps,
    CoordinateObservationReplay,
    PrepareReportHandoffDelivery,
    PrepareExternalAuditExportDelivery,
    RebuildPeripheralViews,
}
```

`ObservationQueryOperation` 的唯一 owner 是 `application::idempotency`（planned file `crates/application/src/idempotency.rs`，由 application crate re-export）；上方 14 个 variant 是 current P0 全集。它只用于 route、operation context、digest 与 entry enablement binding；Query 不能创建 idempotency scope。Public `*Name` wrapper 只能通过 total static route table 映射到这些 enum，禁止 free-text parsing、alias 或 unknown passthrough。

#### `ObservationInboundEventIdentity`

```rust
/// Stable producer event identity used as a secondary consumer deduplication key.
pub struct ObservationInboundEventIdentity {
    pub consumer: ObservationInboundConsumerOperation,
    pub producer_family: ObservationProducerFamily,
    pub source_event_ref: SourceEventRef,
}
```

#### `ObservationOperationContext`

```rust
/// Application context shared by command, query, consumer, and job use cases.
pub struct ObservationOperationContext {
    /// Exact finite operation bound by the entry route.
    pub operation_name: ObservationOperationName,

    /// Actor or system principal safe reference.
    pub actor_ref: ActorSafeRef,

    /// Trace context used for observability-owned correlation.
    pub trace_ref: Option<TraceCorrelationRef>,

    /// Idempotency key supplied by the entry boundary when required.
    pub idempotency_key: Option<IdempotencyKey>,

    /// Request digest computed from protocol input and metadata.
    pub request_digest: RequestDigest,

    /// Secondary source-event identity;present only for inbound consumers.
    pub inbound_event_identity: Option<ObservationInboundEventIdentity>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `operation_name` | `ObservationOperationName` | route-neutral operation namespace | static route/body mapping |
| `actor_ref` | `ActorSafeRef` | actor / stable system principal | authenticated metadata / validated consumer or job principal |
| `trace_ref` | `Option<TraceCorrelationRef>` | correlation | metadata / envelope |
| `idempotency_key` | `Option<IdempotencyKey>` | 幂等键 | command / event / job input |
| `request_digest` | `RequestDigest` | 输入摘要 | application derived from DTO / envelope / job input |
| `inbound_event_identity` | `Option<ObservationInboundEventIdentity>` | 防止producer更换dedup key绕过同一event identity | Consumer only;other families requireNone |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn require_idempotency(&self) -> Result<IdempotencyKey, ApplicationError>` | 获取必需幂等键 | 无 | `Result<IdempotencyKey, ApplicationError>` | query 可不需要 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn for_command(ObservationCommandOperation operation, ActorSafeRef actor_ref, IdempotencyKey key, RequestDigest digest, Option<TraceCorrelationRef> trace_ref) -> Self` | command context | exact route + typed values | `ObservationOperationContext` | command service |
| `pub fn for_query(ObservationQueryOperation operation, ActorSafeRef actor_ref, RequestDigest digest, Option<TraceCorrelationRef> trace_ref) -> Self` | query context | exact route + typed values | `ObservationOperationContext` | query service;key/event identity absent |
| `pub fn for_inbound_event(ObservationInboundEventIdentity event_identity, ActorSafeRef actor_ref, IdempotencyKey key, RequestDigest digest, Option<TraceCorrelationRef> trace_ref) -> Self` | consumer context | exact consumer/producer/event + typed values | `ObservationOperationContext` | inbound service |
| `pub fn for_job(ObservationJobOperation operation, ActorSafeRef actor_ref, IdempotencyKey key, RequestDigest digest, Option<TraceCorrelationRef> trace_ref) -> Self` | job context | exact route + typed values | `ObservationOperationContext` | job service |

#### `ObservationIdempotencyScope`

```rust
/// Logical key of one idempotent operation under one effective actor scope.
pub struct ObservationIdempotencyScope {
    pub operation_name: ObservationOperationName,
    pub actor_ref: ActorSafeRef,
    pub idempotency_key: IdempotencyKey,
}
```

#### `ObservationIdempotencyReservation`

```rust
/// Application-owned idempotency reservation for commands, consumers, and jobs.
pub struct ObservationIdempotencyReservation {
    /// Stable idempotency reference.
    pub idempotency_ref: IdempotencyRef,

    /// Actor-scoped typed logical key.
    pub scope: ObservationIdempotencyScope,

    /// Digest of the normalized request input.
    pub request_digest: RequestDigest,

    /// Secondary unique event identity for inbound consumers.
    pub inbound_event_identity: Option<ObservationInboundEventIdentity>,

    /// Current idempotency state.
    pub state: IdempotencyReservationState,

    /// Stored result reference when a previous result exists.
    pub stored_result_ref: Option<StoredObservationResultRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `idempotency_ref` | `IdempotencyRef` | reservation identity | `system_generated` |
| `scope` | `ObservationIdempotencyScope` | operation + actor + raw key | operation context |
| `request_digest` | `RequestDigest` | 请求摘要 | application derived |
| `inbound_event_identity` | `Option<ObservationInboundEventIdentity>` | Consumer secondary unique key | must match context;None forCommand/Job |
| `state` | `IdempotencyReservationState` | reservation 状态 | repository / application transition |
| `stored_result_ref` | `Option<StoredObservationResultRef>` | 已存结果 | repository lookup |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn attach_result(&mut self, StoredObservationResultRef result_ref) -> Result<(), ApplicationError>` | 绑定存储结果 | result ref | `Result<(), ApplicationError>` | completed 后不可改写 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn reserve(IdempotencyRef idempotency_ref, ObservationIdempotencyScope scope, RequestDigest digest, Option<ObservationInboundEventIdentity> event_identity) -> Self` | 创建reservation | exact logical scope/digest/event identity | `ObservationIdempotencyReservation` | repository-only Acquired branch |

```rust
/// Application idempotency reservation lifecycle.
pub enum IdempotencyReservationState {
    /// The operation has been reserved but not completed.
    Reserved,

    /// The operation completed and has a stored result.
    Completed,

}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Reserved` | The operation has been reserved but not completed. | 初始态 | repository Acquired | `Completed` |
| `Completed` | The operation completed and has a stored result. | 已完成/终态 | `Reserved` | 不适用 |

```rust
/// Atomic repository decision for one incoming idempotent request.
pub enum ObservationIdempotencyReserveOutcome {
    Acquired(ObservationIdempotencyReservation),
    Replay { idempotency_ref: IdempotencyRef, result_ref: StoredObservationResultRef },
    Conflict { idempotency_ref: IdempotencyRef },
    InFlight { idempotency_ref: IdempotencyRef },
}
```

`Replay`、`Conflict`和`InFlight`是incoming request outcomes,不是durable reservation states,不得写回原row。

#### `StoredObservationResult`

```rust
/// Stored result channel used to validate exact duplicate replay.
pub enum StoredObservationResultKind {
    CommandResult,
    CommandRejection,
    ConsumerReceipt,
    JobReport,
}

/// Exact immutable protocol surface returned during duplicate replay.
pub struct StoredObservationReplaySurface {
    pub result_kind: StoredObservationResultKind,
    pub schema_version: SchemaVersion,
    pub serialized_surface: BodyFreeSerializedResult,
    pub digest_summary: DigestSummary,
}

/// Redacted, body-free serialized protocol result. It must never contain source or evidence body.
pub struct BodyFreeSerializedResult(pub Vec<u8>);
```

```rust
/// Stored application result used for idempotent replay.
pub struct StoredObservationResult {
    /// Stable stored result reference.
    pub result_ref: StoredObservationResultRef,

    /// Reservation that owns this exact replay surface.
    pub idempotency_ref: IdempotencyRef,

    /// Operation name that produced this result.
    pub operation_name: ObservationOperationName,

    /// Effective actor scope that owns this replay surface.
    pub actor_ref: ActorSafeRef,

    /// Original stable input digest.
    pub request_digest: RequestDigest,

    /// Public receipt or view reference returned by the operation.
    pub public_result_ref: BodyFreeRef,

    /// Stored result disposition.
    pub disposition: OperationResultDisposition,

    /// Exact immutable protocol surface replayed for a duplicate request.
    pub replay_surface: StoredObservationReplaySurface,

    /// Time when the result was stored.
    pub stored_at: ObservedAt,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `result_ref` | `StoredObservationResultRef` | stored result identity | `system_generated` |
| `idempotency_ref` | `IdempotencyRef` | owning reservation | current Acquired reservation |
| `operation_name` | `ObservationOperationName` | 用例名称 | application service |
| `actor_ref` | `ActorSafeRef` | replay actor scope | operation context |
| `request_digest` | `RequestDigest` | original logical input | operation context |
| `public_result_ref` | `BodyFreeRef` | 返回引用 | command / query / job result |
| `disposition` | `OperationResultDisposition` | 结果分类 | application derived |
| `replay_surface` | `StoredObservationReplaySurface` | duplicate 精确重放 surface | Step 08 response / receipt / report 在 accepted/rejected transaction 内序列化;immutable,body-free |
| `stored_at` | `ObservedAt` | 存储时间 | system clock |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn can_replay(&self) -> bool` | 判断是否可幂等重放 | 无 | `bool` | conflict / failed 不可重放 |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_replay_surface(StoredObservationResultRef result_ref, IdempotencyRef idempotency_ref, ObservationOperationName operation_name, ActorSafeRef actor_ref, RequestDigest request_digest, BodyFreeRef public_result_ref, OperationResultDisposition disposition, StoredObservationReplaySurface replay_surface, ObservedAt stored_at) -> Self` | 创建 immutable stored result | reservation scope/digest + exact body-free protocol surface | `StoredObservationResult` | command result/rejection、consumer receipt、job report |

#### `ObservationOutboxRecord`

```rust
/// Durable publication marker for one committed outbound payload snapshot.
pub struct ObservationOutboxRecord {
    pub outbox_ref: OutboxRecordRef,
    pub event_ref: OutboundEventRef,
    pub subject_ref: BodyFreeRef,
    pub payload_snapshot_ref: OutboxPayloadSnapshotRef,
    pub committed_cursor: ObservationCommittedCursor,
    pub state: OutboxPublicationState,
    pub publication_receipt: Option<PublicationReceipt>,
    pub last_failure: Option<PublicationFailure>,
    pub dead_letter_ref: Option<DeadLetterRef>,
    pub committed_at: ObservedAt,
}

/// Durable publication lifecycle for one immutable outbox payload snapshot.
pub enum OutboxPublicationState {
    Pending,
    Published,
    Failed,
    DeadLettered,
}
```

| 函数签名 | 作用 | 前置条件 | 状态副作用 | 边界 |
|---|---|---|---|---|
| `pub fn pending(OutboxRecordRef outbox_ref, OutboundEventRef event_ref, BodyFreeRef subject_ref, OutboxPayloadSnapshotRef payload_snapshot_ref, ObservationCommittedCursor committed_cursor, ObservedAt committed_at) -> Self` | 建立 committed publication marker | payload snapshot 已在同一 UoW staged;tagged cursor 与 snapshot 相同 | `Pending` | 不在此处发布 |
| `pub fn mark_published(&mut self, PublicationReceipt receipt) -> Result<(), ApplicationError>` | 记录发布成功 | 当前 `Pending` 或 Step 13 允许的 retry candidate | `Published`;保存 receipt | 不回查 truth |
| `pub fn mark_failed(&mut self, PublicationFailure failure) -> Result<(), ApplicationError>` | 记录发布失败 | 当前 `Pending` | `Failed`;保存 body-free failure | 不回滚 committed truth |
| `pub fn mark_dead_letter(&mut self, DeadLetterReason reason, DeadLetterRef dead_letter_ref) -> Result<(), ApplicationError>` | 记录不可恢复失败 | `Pending` payload corrupt 或 `Failed` permanent / exhausted | `DeadLettered`;保存 dead-letter ref | 不重建 payload |

| 变体 | 作用 | 是否终态 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Pending` | committed payload snapshot 等待发布 | 否 | factory | `Published` / `Failed` / `DeadLettered` |
| `Published` | stored snapshot 已成功发布 | 是 | `Pending` | 不适用 |
| `Failed` | 发布失败,是否可重试由typed failure + Step 13 eligibility policy判断 | 否 | `Pending` | `Published` when same-token retry succeeds / `Failed` reclassification / `DeadLettered`;不得改回Pending |
| `DeadLettered` | permanent 或 exhausted failure | 是 | `Pending` / `Failed` | 不适用 |

#### Job execution plan / claim / fencing objects

```rust
pub struct ObservationJobExecutionRef(pub JobRunRef);
pub struct ObservationJobExecutionPlanRef(pub BodyFreeRef);
pub struct ObservationFencingToken(pub u64);

pub enum ObservationJobWorkKey {
    Outbox(OutboxRecordRef),
    ProjectionScope(ObservationProjectionScope),
    SignalRollup(SignalRollupWindowRef),
    ReferenceSnapshot(ReferenceSnapshotRef),
    GapSource(GapSourceRef),
    ReplayTarget(MaintenanceTargetRef),
    ReportHandoff(ReportHandoffRecordRef),
    ExternalExport(ExternalAuditExportPreparationRef),
    PeripheralScope(PeripheralConsumerScopeRef),
}

/// Durable coordination state of one item in an accepted immutable job plan.
pub enum ObservationJobPlanItemState {
    /// The item is frozen in the plan and has not acquired execution ownership.
    Planned,
    /// One current fenced claimant may execute or classify the item.
    Running,
    /// The item committed its intended local effect or equivalent success fact.
    Succeeded,
    /// The latest attempt failed with a typed recovery class that may permit retry while the report is Draft.
    FailedRetryable,
    /// The item has a permanent failure classification for this execution.
    FailedPermanent,
    /// A policy,visibility,retention,or no-write guard blocked the item.
    Blocked,
    /// An equivalent durable terminal effect already existed and was verified without re-execution.
    SkippedTerminal,
}

/// Exact body-free item classification folded into the owning job report.
pub struct ObservationJobPlanItemOutcome {
    /// Local body-free refs changed or verified by this item.
    pub affected_refs: BodyFreeRefSet,
    /// Existing body-free refs whose item processing failed.
    pub failed_refs: BodyFreeRefSet,
    /// Gaps that explain missing,unsafe,or not-visible item material.
    pub gap_refs: GapStateRefSet,
    /// Durable progress,preparation,receipt,or equivalent-effect refs.
    pub progress_refs: BodyFreeRefSet,
    /// Typed failure or block reason when required by the item state.
    pub failure_reason: Option<JobFailureReason>,
    /// Digest over item state,canonical refs,and typed failure reason.
    pub outcome_digest: DigestSummary,
}

/// One immutable planned input plus its current fenced classification.
pub struct ObservationJobPlanItem {
    /// Global typed identity used for cross-execution item claims.
    pub work_key: ObservationJobWorkKey,
    /// Stable digest of the exact frozen input for this item.
    pub planned_input_digest: RequestDigest,
    /// Local owner version observed when the plan was materialized,when applicable.
    pub observed_version: Option<ObservationRepositoryVersion>,
    /// Current coordination state.
    pub state: ObservationJobPlanItemState,
    /// Current exact classification;None only while no finalizable outcome exists.
    pub outcome: Option<ObservationJobPlanItemOutcome>,
}

pub struct ObservationJobExecutionPlan {
    pub plan_ref: ObservationJobExecutionPlanRef,
    pub execution_ref: ObservationJobExecutionRef,
    pub idempotency_ref: IdempotencyRef,
    pub operation_name: ObservationJobOperation,
    pub request_digest: RequestDigest,
    /// Complete immutable runtime settings required to resume this plan.
    pub config_snapshot: JobExecutionConfigSnapshot,
    pub plan_digest: RequestDigest,
    pub items: Vec<ObservationJobPlanItem>,
}

pub enum ObservationExecutionClaimState {
    Active,
    Released,
    Expired,
}

pub struct ObservationExecutionClaim {
    pub execution_ref: ObservationJobExecutionRef,
    pub work_key: Option<ObservationJobWorkKey>,
    pub fencing_token: ObservationFencingToken,
    pub state: ObservationExecutionClaimState,
}
```

| Object | Invariant | Boundary |
|---|---|---|
| `ObservationJobExecutionPlan` | work-set与config snapshot immutable,items canonical sorted/unique,plan digest covers exact planned input + canonical config snapshot | resume不得重新list扩大/缩小范围或读取current config替换snapshot |
| `ObservationJobPlanItem` | work key/planned digest/observed version immutable；state按formal transition分类；outcome保存可确定性汇总到report的exact refs/reason/digest | terminal item不重新执行；FailedRetryable可在fresh claim下重入但不得改planned input |
| `ObservationJobPlanItemOutcome` | refs canonical sorted/unique；digest覆盖state + all refs + typed reason；Succeeded不得有failure reason/failed refs，failed/blocked必须有typed reason | report sets必须等于all current finalizable item outcomes的canonical lossless fold；不得从current truth重建 |
| `ObservationExecutionClaim` | durable Active owner + strictly increasing fencing token | claim不是business truth或exactly-once proof |
| `ObservationJobWorkKey` | global typed item identity shared acrossjob executions | 不降级为hash/string或仅execution-local key |

#### Stable external effect tokens

```rust
pub struct ExternalEffectIntentRef(pub BodyFreeRef);

/// Immutable body-free revision of one external destination and idempotency namespace.
pub struct ExternalEffectBindingRef(pub BodyFreeRef);

pub struct ObservationPublicationToken {
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub event_ref: OutboundEventRef,
    pub outbox_ref: OutboxRecordRef,
    pub payload_digest: DigestSummary,
    pub schema_version: SchemaVersion,
}

pub struct HandoffPreparationToken {
    pub intent_ref: ExternalEffectIntentRef,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub handoff_ref: ReportHandoffRecordRef,
    pub evidence_index_input_ref: EvidenceIndexInputViewRef,
    pub consumer_ref: ReportConsumerRef,
    pub material_digest: DigestSummary,
}

pub struct HandoffDeliveryToken {
    pub intent_ref: ExternalEffectIntentRef,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub handoff_ref: ReportHandoffRecordRef,
    pub preparation_ref: HandoffDeliveryPreparationRef,
    pub consumer_ref: ReportConsumerRef,
    pub material_digest: DigestSummary,
}

pub struct ExportPreparationToken {
    pub intent_ref: ExternalEffectIntentRef,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub preparation_ref: ExternalAuditExportPreparationRef,
    pub view_ref: DashboardAlertExportViewRef,
    pub consumer_ref: PeripheralConsumerRef,
    pub material_digest: DigestSummary,
}

pub struct ExportDeliveryToken {
    pub intent_ref: ExternalEffectIntentRef,
    pub effect_binding_ref: ExternalEffectBindingRef,
    pub preparation_ref: ExternalAuditExportPreparationRef,
    pub delivery_ref: PeripheralDeliveryRef,
    pub consumer_ref: PeripheralConsumerRef,
    pub material_digest: DigestSummary,
}
```

Tokens are immutable and reused across all retries. `effect_binding_ref` pins the exact product-neutral destination revision and external idempotency namespace selected before the effect is planned；infra resolves it to the concrete adapter/route/target。It never contains raw endpoint、topic、path or credential。Tokens contain only body-free identities/digests and never include job execution ref,claim token,attempt number,time,target path,credential or external body.

#### `ObservationVisibilityDecision`

```rust
/// Application-level read decision assembled from domain visibility, gaps, and stale markers.
pub struct ObservationVisibilityDecision {
    /// Public visibility surface returned to the caller.
    pub surface: VisibilitySurface,

    /// Read context used to evaluate visibility.
    pub request_context_ref: DiagnosticRequestContextRef,

    /// Whether application may continue assembling a view.
    pub assemble_allowed: bool,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `surface` | `VisibilitySurface` | public visibility | domain policy result |
| `request_context_ref` | `DiagnosticRequestContextRef` | read context | query service |
| `assemble_allowed` | `bool` | 是否可继续组装 | application derived from `surface` |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn require_assemblable(&self) -> Result<(), ApplicationError>` | 阻止 blocked / not-visible view assembly | 无 | `Result<(), ApplicationError>` | 不触发 write |

| 工厂函数签名 | 作用 | 参数说明 | 返回 | 使用场景 |
|---|---|---|---|---|
| `pub fn from_surface(VisibilitySurface surface, DiagnosticRequestContextRef request_context_ref) -> Self` | 创建 decision | surface + context | `ObservationVisibilityDecision` | query / handoff / export flow |

#### application service objects

| service object | 主要函数 | 使用对象 | 禁止事项 |
|---|---|---|---|
| `ObservationCommandService` | `submit_observation_material(SubmitObservationMaterialCommand command, ObservationOperationContext context) -> Result<StoredObservationResult, ApplicationError>` | `ObservationReceipt`;`SafetyDisposition`;idempotency;UoW | 不写 source truth |
| `ObservationQueryService` | `get_observation_read_model(GetObservationReadModelQuery query, ObservationOperationContext context) -> Result<ObservationReadModelView, ApplicationError>` | `ObservationVisibilityDecision`;read model ports | query 不写 |
| `ObservationConsumerService` | `consume_material_event(ObservationEventEnvelope envelope, ObservationOperationContext context) -> Result<ObservationConsumerDisposition, ApplicationError>` | idempotency;receipt;gap;quarantine | 不复制外部正文 |
| `ObservationJobService` | `run_maintenance_job(ObservationJobInput input, ObservationOperationContext context) -> Result<ObservationJobReportDraft, ApplicationError>` | maintenance state;replay scope;no-write | job 不修 source truth |

### 7.8 修复前 runtime / infra / entry 草稿（historical repair input for R06.7）

> 本节尚未经过 `R06.7` 逐 carrier 修复，只保留旧 stable-carrier 候选和后置 use；runtime、infra、api、worker、jobs 的 current definition 必须等对应批次完成，不得由本节提前落码。

#### `AdapterAvailabilityState`

`AdapterAvailabilityScope` / `AdapterAvailabilityState` / `AdapterAvailabilityKind` are defined in `application::ports::runtime` because the application-owned `AdapterAvailabilityProbe` returns them。Infra implements the probe and constructs snapshots；entry modules may read the snapshot but do not own its semantics。

```rust
/// Product-neutral scope of one availability probe.
pub struct AdapterAvailabilityScope {
    /// Adapter family without product-specific truth semantics.
    pub adapter_family: AdapterFamily,

    /// Exact external-effect binding for a target-specific probe,when applicable.
    pub effect_binding_ref: Option<ExternalEffectBindingRef>,
}

/// Runtime availability of a product-neutral adapter implementation.
pub struct AdapterAvailabilityState {
    /// Family-level or exact binding-level scope that was probed.
    pub scope: AdapterAvailabilityScope,

    /// Current adapter availability.
    pub availability: AdapterAvailabilityKind,

    /// Last safe diagnostic marker.
    pub diagnostic_ref: Option<DiagnosticSummaryRef>,
}
```

| 字段 | 类型 | 作用 | 约束 / 来源 |
|---|---|---|---|
| `scope` | `AdapterAvailabilityScope` | family-level或exact external binding可用性范围 | contracts-owned finite family + optional application-owned binding ref；不含产品名/route |
| `availability` | `AdapterAvailabilityKind` | 可用性 | runtime health probe / config validation |
| `diagnostic_ref` | `Option<DiagnosticSummaryRef>` | 诊断引用 | infra derived;不得含 secret |

| 函数签名 | 作用 | 参数说明 | 返回 | 副作用 / 不变量 |
|---|---|---|---|---|
| `pub fn is_available(&self) -> bool` | 判断是否可用 | 无 | `bool` | 只读 |
| `pub fn require_available(&self) -> Result<(), ApplicationError>` | adapter 不可用时返回application port错误 | 无 | `Result<(), ApplicationError>` | 不改变状态；不暴露infra error |

```rust
/// Runtime availability for product-neutral adapters.
pub enum AdapterAvailabilityKind {
    /// The adapter is available for calls.
    Available,

    /// The adapter can serve only degraded or read-only calls.
    Degraded,

    /// The adapter is unavailable.
    Unavailable,

    /// Adapter configuration is invalid.
    Misconfigured,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Available` | The adapter is available for calls. | 可用 | runtime probe / config validation | 不适用 |
| `Degraded` | The adapter can serve only degraded or read-only calls. | 降级可用 | runtime probe | 不适用 |
| `Unavailable` | The adapter is unavailable. | 不可用 | runtime probe | 不适用 |
| `Misconfigured` | Adapter configuration is invalid. | 配置错误 | config validation | 不适用 |

`effect_binding_ref=None` 只表示非target adapter或family aggregate。Publisher、handoff、export在执行某个external effect前必须probe/调用exact `Some(effect_binding_ref)` scope；family aggregate不得授权具体target调用，也不得掩盖单个binding的Unavailable/Misconfigured。

#### entry / loop / job carrier

```rust
/// Durable per-scope outcome for a staged read-model rebuild.
pub struct ProjectionScopeItemReport {
    pub scope: ObservationProjectionScope,
    pub outcome: ProjectionScopeItemOutcome,
}

/// Exactly one mutually exclusive outcome for one requested projection scope.
pub enum ProjectionScopeItemOutcome {
    Succeeded {
        read_model_ref: ObservationReadModelRef,
        diagnostic_view_ref: DiagnosticViewRef,
    },
    Failed {
        reason: JobFailureReason,
        gap_refs: GapStateRefSet,
    },
}
```

`ProjectionScopeItemReport` 是 application-local durable carrier,不进入 public protocol。`scope` 保留 typed enum discriminator,不得 hash、拼接或降级为裸 `BodyFreeRef`。一个 report 对一个 canonical scope 只能保存一项;同 scope 同 outcome 的重入可 no-op,不同 outcome / refs / reason 必须 conflict。成功项只能在 read model + diagnostic composite 同 UoW replace 成功后写入;失败项只能在失败 item rollback 后的独立 accounting UoW 写入。

| 模块 | 对象 | 字段 | 函数 | 边界 |
|---|---|---|---|---|
| `api` | `ObservationCommandHandlerState` | `operation_name: ObservationOperationName`;`runtime_available: AdapterAvailabilityState`;`last_entry_disposition: Option<EntryDisposition>` | `map_request(CommandRequestEnvelope envelope) -> Result<ApplicationCommandInput, ApiError>` | 不访问 repository |
| `api` | `ObservationQueryHandlerState` | `operation_name`;`runtime_available`;`visibility_defaults: QueryVisibilityDefaults` | `map_query(QueryRequestEnvelope envelope) -> Result<ApplicationQueryInput, ApiError>` | query 不写 |
| `worker` | `ObservationConsumerDisposition` | `event_ref: InboundEventRef`;`state: ConsumerDispositionState`;`receipt_ref: Option<ObservationReceiptRef>`;`dead_letter_ref: Option<DeadLetterRef>` | `ack() -> Result<(), WorkerError>`;`dead_letter(WorkerFailureReason reason) -> Result<(), WorkerError>` | 不创建外部 truth |
| `worker` | `OutboxPublisherLoopState` | `cursor: OutboxCursor`;`state: OutboxLoopKind`;`last_error_ref: Option<WorkerErrorRef>` | `advance(OutboxCursor cursor) -> Result<(), WorkerError>`;`mark_failed(WorkerFailureReason reason) -> Result<(), WorkerError>` | publish failure 不回滚 truth |
| `worker` | `ProjectionWorkerLoopState` | `target_ref: MaintenanceTargetRef`;`state: ProjectionLoopKind`;`maintenance_ref: Option<ProjectionMaintenanceRef>` | `mark_stale(MaintenanceTargetRef target_ref) -> Result<(), WorkerError>` | loop 不重定义 maintenance truth |
| `jobs` | `ObservationJobRunnerContext` | `job_ref: JobRunRef`;`target_ref: MaintenanceTargetRef`;`actor_ref: ActorSafeRef`;`idempotency_key: IdempotencyKey` | `from_metadata(JobExecutionRef job_execution_ref, MaintenanceTargetRef target_ref, ActorSafeRef actor_ref, IdempotencyKey key) -> Self`;`to_operation_context(RequestDigest digest) -> ObservationOperationContext` | `JobRunRef` 是 public `JobExecutionRef` 的 lossless application-local wrapper,不生成或伪造新的 external run id |
| `jobs` | `ObservationJobReportDraft` | `report_ref: JobReportRef`;`job_ref: JobRunRef`;`execution_ref: ObservationJobExecutionRef`;`plan_ref: ObservationJobExecutionPlanRef`;`plan_digest: RequestDigest`;`last_fencing_token: ObservationFencingToken`;`state: JobReportState`;`affected_refs: BodyFreeRefSet`;`failed_refs: BodyFreeRefSet`;`gap_refs: GapStateRefSet`;`progress_refs: BodyFreeRefSet`;`projection_scope_items: Vec<ProjectionScopeItemReport>`;`failure_reason: Option<JobFailureReason>` | `record_scope_success(ObservationProjectionScope scope, ObservationReadModelRef read_model_ref, DiagnosticViewRef diagnostic_view_ref) -> Result<(), JobError>`;`record_scope_failure(ObservationProjectionScope scope, JobFailureReason reason, GapStateRefSet gap_refs) -> Result<(), JobError>`;`accept_fence(ObservationFencingToken token) -> Result<(), JobError>`;`mark_partial(JobFailureReason reason) -> Result<(), JobError>`;`complete() -> Result<(), JobError>`;`fail_retryable(JobFailureReason reason) -> Result<(), JobError>`;`fail_permanent(JobFailureReason reason) -> Result<(), JobError>`;`block(JobFailureReason reason) -> Result<(), JobError>` | report必须与immutable plan/execution/digest一致；fence只严格前进；scope item list canonical sorted/unique；report 是运行报告草稿,不是验收签署;`job_ref` 不是外部真实 run id |

```rust
/// Stored lifecycle of an observability operations job report draft.
pub enum JobReportState {
    Draft,
    Completed,
    PartiallyCompleted,
    FailedRetryable,
    FailedPermanent,
    Blocked,
}
```

```rust
/// Invariant failure while updating one durable observation job report.
pub enum JobError {
    /// A report identity required by the job flow is absent.
    MissingReportReference,
    /// The requested report lifecycle transition is invalid.
    InvalidReportTransition,
    /// One projection scope was classified as both success and failure.
    ScopeClassificationConflict,
    /// Report sets,progress refs,or terminal fields are inconsistent.
    ReportInvariantViolation,
}
```

`JobError` 只属于application-local report mutation,不得直接成为public protocol code。persisted report invariant破坏必须fail closed；duplicate不得借错误恢复改写原terminal report。

`DuplicateReplayed` 只属于 Step 08 `ObservationJobOutcome` 返回 surface,不是 stored `JobReportState`;duplicate 必须读取原 report,不得把原 report 改写成 duplicate 状态。

```rust
/// Disposition for an entry, consumer, or job runner.
pub enum EntryDisposition {
    /// The entry accepted the request or envelope.
    Accepted,

    /// The entry rejected invalid or out-of-bound input.
    Rejected,

    /// The entry quarantined unsafe material.
    Quarantined,

    /// The entry returned a stored idempotent result.
    DuplicateReplay,

    /// The entry blocked execution because a guard failed.
    Blocked,
}
```

| 变体 | Rustdoc 注释 | 作用 | 允许来源 | 允许去向 |
|---|---|---|---|---|
| `Accepted` | The entry accepted the request or envelope. | 接受 | api / worker / jobs mapper | 不适用 |
| `Rejected` | The entry rejected invalid or out-of-bound input. | 拒绝 | validation / policy | 不适用 |
| `Quarantined` | The entry quarantined unsafe material. | 隔离 | safety policy | 不适用 |
| `DuplicateReplay` | The entry returned a stored idempotent result. | 幂等重放 | idempotency repository | 不适用 |
| `Blocked` | The entry blocked execution because a guard failed. | 阻断 | no-write / retention / visibility guard | 不适用 |

### 7.9 修复前模块内停审记录（historical invalidated）

> 下表结论已被 §6.8 的粒度差异推翻。对象组完成对应 repair batch 后必须重写逐模块停审,不能复用这里的 `pass`。

| 模块 | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `contracts` | public secondary type 是否都归 `contracts` | historical_invalidated | `R06.2`需重审structured ref与support carrier |
| `domain` truth / state | 核心对象是否覆盖概要 §6 的 truth / state 主语 | partial_pass_R06.4 | R06.3 core与R06.4 boundary/read/maintenance对象均已逐对象闭口；policy/record/application/entry仍按R06.5~R06.7修复 |
| `domain` policy / record | policy 是否只判断、record 是否 append-only | historical_invalidated | `R06.5`需逐policy/record卡 |
| `application` | idempotency、stored result、outbox publication record、operation context、visibility decision 是否闭口 | historical_invalidated | `R06.6`需逐carrier/service卡 |
| `application` / `infra` | availability port carrier owner与实现边界是否闭口 | historical_invalidated | `R06.7`需重审runtime owner与R2 carrier |
| `api` / `worker` / `jobs` | entry / loop / job carrier 是否闭口,truth 是否仍归 application / domain | historical_invalidated | `R06.7`需逐entry carrier卡 |

### 7.10 修复前对象组字段来源审计表（historical invalidated）

> R06.3 / R06.4 已覆盖对象组的 current 字段来源、rehydration 与 conditional matrix 分别见两个专项；其余对象组等待 R06.5~R06.8。下表不再证明 current closure。

| 对象组 | 代表对象 | Step 6 已闭合字段来源 | 后续 Step 必须闭合 | 实现侧暂停条件 |
|---|---|---|---|---|
| public typed ref | `ObservationReceiptRef`;`EvidenceLinkageRef`;`GapStateRef` | `system_generated` / `command_input` / `event_input` / resolver snapshot,统一 `BodyFreeRef` | Step 08 DTO 字段映射 | DTO 使用裸 `String` 或混用 ref owner |
| intake / safety | `ObservationReceipt`;`SafetyDisposition` | source ref、safe summary、actor、received_at | Step 09 save order;Step 11 persistence | 出现 raw body / provider body 字段 |
| correlation / signal | `CorrelationContext`;`SafeSignal` | receipt lookup、correlation seed、safe summary | Step 09 flow;Step 10 matrix | 从 opaque id 反推业务 truth |
| audit / evidence | `AuditProjection`;`EvidenceLinkage` | correlation lookup、source audit ref、body-free evidence ref、digest summary | Step 07 evidence resolver port;Step 09 append flow | 保存 evidence / artifact / audit body |
| handoff / authenticity | `ReportHandoffRecord`;`AuthenticityHint` | evidence index input、consumer ref、gap / visibility | Step 08 handoff DTO;Step 09 delivery flow | 伪造真实 run id、evidence alias 或 signoff |
| retention / replay / no-write | `RetentionMarker`;`ReplayScope`;`NoWriteViolation` | protected observation ref、job target、forbidden target | Step 10 matrix;Step 13 idempotency/concurrency | 执行 cleanup / source repair |
| read / diagnostic / gap | `ReadVisibilityState`;`DiagnosticSummary`;`GapState` | query context、read model lookup、gap source | Step 08 query views;Step 09 query flow | query 写 truth 或触发 rebuild |
| reference / maintenance | `ReferenceSnapshotState`;`ProjectionMaintenanceState` | resolver snapshot、job target、maintenance cursor | Step 11 persistence;Step 14 adapter binding | resolver 保存正文或 job 修 source truth |
| application helper | `ObservationIdempotencyReservation`;`StoredObservationResult`;`ObservationOutboxRecord` | metadata、idempotency key、request digest、operation result、committed payload snapshot ref | Step 07 idempotency/outbox repository;Step 13 conflict/retry rules | 后续私补 stored result 或 publication state schema |
| entry / runner | `EntryDisposition`;`ObservationJobReportDraft` | mapper result、application result、job input | Step 08 protocol;Step 16 tests | entry 直接访问 repository 或伪造真实 evidence |

### 7.11 修复前状态闭环审计表（historical invalidated）

> R06.3 / R06.4 current 状态、transition delta 与 reserved/terminal 规则见对应专项；下表含旧 trigger / result-return 口径，只保留为 Step 10 受影响复审线索。

| 状态族 | 状态主语 | 初始状态 | 关键迁移 | 终态 / 特殊状态 | 后续 Step 闭合位置 |
|---|---|---|---|---|---|
| intake / safety | `ObservationReceipt`;`SafetyDisposition` | `Received`;`Pending` | accept / reject / quarantine / redact | `Rejected`;`Superseded`;`Quarantined` | Step 10 |
| correlation / signal | `CorrelationContext`;`SafeSignal`;`SignalRollupWindow` | `Unbound`;`Candidate`;`Pending` | bind / record / suppress / rebuild | `Invalid`;`Suppressed`;`Failed` | Step 10 |
| audit / evidence | `AuditProjection`;`EvidenceLinkage` | `PendingAppend`;`Candidate` | append / link / body-block / restrict | `Suppressed`;`BodyBlocked` | Step 10 |
| handoff / authenticity | `ReportHandoffRecord`;`HandoffReadinessState`;`AuthenticityHint` | `Draft`;`PendingEvidence`;`Unassessed` | prepare / readiness evaluate / deliver / mark placeholder | `Delivered`;`Cancelled`;`Blocked`;`PlaceholderDetected` | Step 10 |
| retention / replay / no-write | `RetentionMarker`;`ReplayScope`;`NoWriteViolation` | `Unmarked`;`Defined`;`Detected` | hold / approve / block / close | `Released`;`Cancelled`;`Closed` | Step 10 / 13 |
| read / diagnostic / gap | `ReadVisibilityState`;`DiagnosticSummary`;`GapState` | visibility derived;`Fresh`;`Open` | restrict / stale / acknowledge / close | `Blocked`;`Unavailable`;`Resolved` | Step 10 |
| peripheral / export | `PeripheralDeliveryState`;`ExternalAuditExportPreparation` | `Pending`;`Draft` | prepare / deliver / fail / block | `Delivered`;`Cancelled`;`Failed` | Step 10 / 16 |
| reference / maintenance | `ReferenceSnapshotState`;`ProjectionMaintenanceState`;`RollupRebuildState` | `Pending`;`Stale`;`Pending` | resolve / stale / rebuild / fail | `Invalid`;`Failed`;`Cancelled` | Step 10 / 11 |
| outbox publication | `ObservationOutboxRecord` | `Pending` | publish / fail / dead-letter | `Published`;`DeadLettered` | Step 10 / 11 / 13 |
| application idempotency | `ObservationIdempotencyReservation` | `Reserved` | acquired writer attaches result and completes；incoming request is classified as Replay / Conflict / InFlight without mutating the row | `Completed` | Step 13 |
| job report | `ObservationJobReportDraft` | `Draft` | complete / partial / retryable failure / permanent failure / block | all non-Draft states terminal for one report | Step 10 / 13 / 16 |
| entry disposition | `EntryDisposition`;consumer / job disposition | mapper result | accept / reject / quarantine / replay / block | 无生命周期终态,作为一次性结果 | Step 08 / 09 / 16 |

### 7.12 修复前 Step 7 承接清单（historical invalidated）

> current Step 7+ 承接只见 R06.3 / R06.4 专项的 handoff 清单，并将在 R06.8 重建全量清单。下表不能授权进入 Step 07 或修改冻结文件。

| Step 7 契约组 | 必须承接的 Step 6 内容 | Step 7 输出要求 | 若未承接的实现 blocker |
|---|---|---|---|
| repository traits | `ObservationReceipt`;`SafetyDisposition`;`SafeSignal`;`AuditProjection`;`EvidenceLinkage`;`ReportHandoffRecord`;`RetentionMarker`;`GapState`;`ReferenceSnapshotState`;`ProjectionMaintenanceState` | 每个 truth / state object 的 get/save/list/append 函数、锁 / version / page helper | application flow 无法读取或保存 Step 6 对象 |
| resolver ports | `ObservationSourceRef`;`RuntimeSandboxSignalRef`;`GovernanceArtifactEvidenceReference`;`SubjectObservationReference`;`ReferenceSnapshotState` | body-free safe summary resolver,not-visible/unresolved/stale result schema | evidence / reference 字段来源无法闭合 |
| publisher / outbox ports | append-only records、outbox publication state、handoff / export result | publish、mark published、mark failed、dead-letter function | outbox failure 无法与 truth 解耦 |
| idempotency repository | `ObservationIdempotencyReservation`;`StoredObservationResult` | atomic `reserve_or_load(context,uow)`、load by actor-scoped typed scope / inbound event identity、store result、complete | duplicate replay / digest mismatch / in-flight / dedup-key drift 无法实现 |
| UoW | all command / consumer / job write objects | begin、commit、rollback、repository access grouping | Step 09 事务边界无法落码 |
| handoff / export adapter | `ReportHandoffRecord`;`ExternalAuditExportPreparation`;`PeripheralDeliveryState` | prepare/deliver result,product-neutral adapter error | handoff / export 无法映射 delivery state |
| read model / projection stores | `ObservationReadModel`;`DiagnosticView`;`GapStatusView`;`DashboardAlertExportView`;`ReferenceSnapshotView`;`RebuildProgressView` | query page, freshness, visibility, stale marker | Query DTO 无来源 |
| clock / id generator | all `system_generated` id/ref/time fields | typed id generation、observed_at clock | factory 字段无法闭合 |

## 8. 修复前回填草稿（冻结）

本节在 `R06.8` 完成前不得用于 Step 19 或正式 `03` 装配；修复结束后必须从 current 独立对象卡重新生成。

> 校准来源:
> - `design-calibration/03_ddd_step_06_object_contracts.md`
>
> 延伸阅读:
> - 建议继续阅读本文件 §7 的 Step 6 批次状态表、模块执行顺序、对象卡片、对象组字段来源审计表、状态闭环审计表和 Step 7 承接清单。

### 5.x.4 对象实现契约

`L4-observability` 的对象契约按 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七个模块展开。`contracts` 先闭口 body-free typed ref、public state / kind、visibility / degraded surface 和 job / handoff helper,确保后续 public protocol 不引用 domain-only 类型。`domain` 闭口 observation receipt、safety disposition、correlation context、safe signal、audit projection、evidence linkage、handoff、retention、no-write、gap、reference snapshot 和 derived maintenance 等 observation-owned truth / state / policy / record。`application` 闭口 operation context、idempotency reservation、stored result、outbox publication record、visibility decision、consumer / job disposition。`infra`、`api`、`worker`、`jobs` 只闭口 adapter availability、entry disposition、loop state 和 job report draft 等 stable carrier,具体 trait、protocol、flow、config 和持久化后续分 Step 展开。

本章对象契约的红线是: forbidden body 不入仓;body-free evidence linkage 不保存正文;query / diagnostic / handoff / export / replay / maintenance 不反写 source truth;report handoff 不生成 final verdict、signoff、真实 `run_id` 或真实 evidence alias;retention marker 不执行 cleanup;projection rebuild 不修外部 truth。

## 9. 待确认事项

| 待确认项 | 当前处理 | 是否阻塞 Step 07 |
|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-observability` 当前未发现 | 保留为 Step 17 / `07-实施计划.md` 实施前置 gate | 否 |
| 完整 repository / port 函数签名 | 本步只闭口对象能力和字段来源;Step 07 必须逐 port 承接 | 否 |
| 完整 DTO / event / job schema | 本步只闭口 public secondary types;Step 08 继续闭口 | 否 |
| 完整状态矩阵与非法迁移错误 | 本步闭口状态 enum 和状态主语;Step 10 继续闭口 | 否 |
| config key、adapter 产品绑定和 runtime builder 参数 | 本步只闭口 availability carrier;Step 14 和 `04` 继续闭口 | 否 |

## 10. 修复前自检与进入下一步条件（historical invalidated）

| 检查项 | 结论 |
|---|---|
| 是否先建立 Step 6 批次状态表和模块执行顺序表 | historical_only；current见§6.1 |
| 是否先收敛 shared vocabulary / typed ref / public marker | pass_R06.2；current见contracts专项 |
| 是否按模块展开,而不是全局对象堆叠 | historical `blocked`；current closure见R06.2~R06.8与§6.30 |
| 是否给出非 core 模块对象闭口 / defer 决策 | historical `blocked_by_R06.7`；current见R06.7/R06.8 |
| 是否为核心对象写 Rust-facing 类型、字段、函数、工厂、enum 变体表 | historical `blocked_by_R06.2_to_R06.7`；current见各专项与§6.30 |
| 是否说明 Rust code block 使用英文 rustdoc 的原因 | retained |
| 是否覆盖概要 §6 的核心对象族和 §9 的状态主语 | inventory_only；未逐对象闭口 |
| 是否完成对象组字段来源审计表 | historical `blocked_by_R06.8`；current pass见R06.8-B §12 |
| 是否完成状态闭环审计表 | historical `blocked_by_R06.8`；current pass见R06.8-B §13 |
| 是否完成 Step 7 承接清单 | historical缺失；current见R06.8-B §15 |
| 是否保持正式 `03-详细设计.md` 到 Step 19 才装配 | pass_no_formal_write |
| gate_status | historical `blocked_by_03-RPR-S06-GRANULARITY`；current=`pass_step06_design_only_waiting_user_before_Step07`见§6.30 |
| historical next_allowed_action | wait_user_confirmation_before_R06.5-G；current状态见§6.14 |
