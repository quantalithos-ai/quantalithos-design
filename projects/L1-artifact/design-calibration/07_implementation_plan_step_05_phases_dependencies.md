# Step 5. 设计实施阶段与依赖顺序

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 5
> 回填章节: `07-实施计划.md` §5 实施阶段与依赖顺序
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_05_phases_dependencies.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 5 设计实施阶段与依赖顺序 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 4 实施对象与交付物;`03-详细设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_05_phases_dependencies.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 6 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 4 实施对象与交付物 | 已完成;用户已确认 | 固定代码、协议、测试、脚本、证据和台账交付面 |
| `03-详细设计.md` §4~§16 | 已存在 | 提取模块依赖、truth/core capability 依赖、protocol、flow、state、persistence、job 和 observability 关系 |
| `05-测试方案.md` §9 / §13 / §14 | 已存在 | 绑定 P0 suites、artifact/report 和 candidate evidence 到 phase |
| `06-验收标准.md` §5~§14 | 已存在 | 绑定 `AC-ART-*`、`VETO-ART-*`、residual 和 acceptance handoff 约束 |
| Step 3 前置检查结论 | 已完成;用户已确认 | 固定目标实现仓缺失、唯一编译期依赖、artifact/report roots 和 implementation ledger 门禁 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 最小可运行或可测试的纵切是什么? | 在 PH-01 建好仓、workspace、config 和脚本骨架后,最小可测试纵切是 PH-02 的“制品事实承载 accepted flow”: command -> application service -> versioned truth load/save -> trace/audit/outbox/stored result -> targeted tests。它是五个核心能力中最先能独立成立并被验证的主链。 |
| 哪些阶段必须先于其他阶段? | PH-01 必须先于所有业务 phase。制品事实承载必须先于版本化与血缘,因为 version / lineage 不能脱离 formal fact。版本化与血缘必须先于基线冻结,因为 baseline 只允许基于正式 version。基线冻结必须先于制品事实可消费表达,因为 consumable ref、stable selector 和只读读面需要依附稳定 truth。事件 / relay 必须晚于 truth 与 read surface,operations jobs 必须晚于 relay / replay / derived state,release evidence 最后收口。 |
| 哪些风险或跨仓依赖需要前置? | 目标实现仓 `/home/aris/Projects/quantalithos-artifact` 当前未发现、`core-contracts` path dependency、目录命名、artifact/report roots、config profiles、script shell 和 implementation ledger 恢复规则都必须前置在 PH-01。其他 sibling 仓和 vendor 不作为 P0 开工前置,只通过 fake / controlled / disabled seam 进入后续 phase。 |
| 每个阶段完成后能验证什么? | PH-01 验证仓骨架和根目录契约。PH-02 验证 formal Artifact fact accepted truth。PH-03 验证 version / lineage truth 稳定形成。PH-04 验证 baseline freeze 只收 formal version。PH-05 验证 13 Query、consumable ref / backref 和 no-write read surface。PH-06 验证 6 Consumer、8 Event、worker-only relay facade。PH-07 验证 6 public jobs、report replay、handoff/export 和 no-truth-repair。PH-08 验证 release smoke、evidence/report pairing、VETO checklist 和 acceptance handoff。 |
| 是否存在按对象拆分而不可验证的阶段? | 不采用按 object / crate 裸拆。阶段主轴是可验证功能增量:五个核心能力先成立,外围 event / job / evidence 再逐层叠加。crate、object、protocol 只作为落点,不作为 phase 主轴。 |
| 哪些阶段可以并行,哪些不能并行? | P0 主链原则上串行。`scripts/reports`、`scripts/checks`、fixture builder 和 targeted test shell 可以在 PH-01 之后随主链增量并行补齐,但它们不能反向定义业务 phase 或替代阶段门禁。P1 selected-run / real-like adapter 只允许在 P0 完成后并行探索。 |
| 每个 phase 是否有明确的功能增量、输入、输出、测试门禁和验收门禁? | 有。本 Step 用阶段总表、核心能力映射表和可验证增量说明固定每个 phase 的输入、输出、不包含项和代表性 gates。Step 7 再把这些 gates 细化到 commit boundary。 |
| 每个 phase 是否包含只能由后续 phase 提供的对象、协议、flow、状态或证据? | 当前设计避免这种逆依赖。前序 phase 可预留后续会消费的 typed ref / marker / report slot,但测试通过条件不能依赖后续 phase 的 consumer、job、publisher 或 release reports。 |
| 每个 phase 完成后是否通过停审? | 设计层面通过。每个 phase 都在本 Step 有停审记录,检查是否形成可验证增量、是否越界、是否污染 P1/P2、是否需要回写 `03/05/06/07`。实际实现时仍需按 Step 7 / Step 12 的 gates 重复验证。 |
| 所有 phase 完成后,依赖顺序、风险前置、外部依赖和验收覆盖是否通过跨 phase 审计? | 当前设计层审计通过。唯一前置 blocker 是目标实现仓路径未落地,它属于 PH-01 开工门禁,不是 phase 顺序冲突。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| `07-实施计划.md` | 尚无 phase 顺序和依赖图 | Step 6 无法拆 commit boundary | 本 Step 建立 PH-01~PH-08 阶段链 |
| 五个核心能力 | 上游按能力定义,但未转换为实现先后 | 容易按 crate 或对象横切实施 | 本 Step 把五个核心能力映射到 truth-first 的 phase 顺序 |
| `03` 的 protocol / flow / state | Command、Query、Consumer、Event、Job 和 relay facade 数量多 | 若不分层,容易把 relay/job/read surface 混在一个阶段 | 按 truth write、read surface、event/relay、jobs、evidence 拆开 |
| `05` 的 suites | suite 覆盖横跨多个层级 | 容易最后集中补测 | 每个 phase 给出代表性 suite / gate |
| `06` 的 AC / VETO | VETO 红线覆盖 truth、boundary、redaction、evidence | 若只在最后考虑,容易出现阶段返工 | 从 PH-01 开始把 dependency / config / redaction / no-write / no-truth-repair 前置 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 实施顺序 | 只有交付物清单,没有阶段主轴 | PH-01~PH-08 串行推进 | 让 Step 6 可以按 phase 拆 boundary |
| 阶段主轴 | 容易按 crate 横切 | 按五个核心能力和外围维护面纵切 | 保持每阶段都可验证 |
| relay / public job | 容易混为一类 | `PublishPendingArtifactRelays` 与 6 public jobs 分开 | 对齐 `03/05/06` 正式口径 |
| evidence | 可能被当成最后附属脚本 | 单独放到 PH-08 收口 | 防止静态造证据和 acceptance 假闭合 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按七 crate 横向拆 phase | 与代码目录对齐 | 每个 phase 很难形成业务或验收增量 | 不采用 |
| 按五个核心能力再加 foundation / event-job / evidence 拆 phase | 与需求主轴一致,每阶段可验证 | 需要 Step 6 再细拆 commit boundary | 采用 |
| 把 version、lineage、baseline 放一个大 phase | phase 数量更少 | 风险过大,baseline 无法独立停审 | 不采用 |
| 把 inbound/outbound/relay 与 public jobs 合并 | 表面上都属于后台维护 | 会混淆 worker-only relay 与 public job 口径 | 不采用 |
| 把 release evidence 作为每个 phase 的附属结果 | 过程上更连续 | 容易产生半成品 report 和静态补洞 | 不采用;单独 PH-08 |

## 7. 结构化中间产物

### 7.1 阶段依赖图

#### 阶段依赖图: L1-artifact 实施阶段顺序

```text
[PH-01 仓初始化、配置与证据骨架]
  | enables
  v
[PH-02 制品事实承载最小 accepted 纵切]
  | depends_on
  v
[PH-03 制品版本化与血缘关联纵切]
  | depends_on
  v
[PH-04 制品基线冻结纵切]
  | depends_on
  v
[PH-05 制品事实可消费表达与只读读面]
  | depends_on
  v
[PH-06 Inbound / Outbound Event 与 relay publication]
  | depends_on
  v
[PH-07 Operations Jobs / Reconciliation / Handoff / Export]
  | depends_on
  v
[PH-08 Release Gate / Reports / Acceptance Handoff]
```

关键说明：
- 图表达阶段依赖顺序,不表达完整函数调用链。
- 五个核心能力分别落在 PH-02~PH-05,event / relay / jobs / evidence 作为外围维护与交付面后置。
- `PublishPendingArtifactRelays` 是 worker-only relay publication facade,不计入 6 个 public jobs。

### 7.2 阶段总表

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化、配置与证据骨架 | 创建目标实现仓、workspace、唯一编译期依赖、config profile skeleton、artifact/report roots 和 script shell | 无 | `Cargo.toml`、七 crate skeleton、config fixtures、`scripts/gates` / `reports` / `checks` / `dev` 骨架 | `cargo check`;`config-redline` 最小壳;`dependency-boundary`;script `--help`;path/root checks |
| PH-02 | 制品事实承载最小 accepted 纵切 | 建立 formal Artifact fact、intake / review / responsibility anchor 和 accepted mutation 原子性 | PH-01 | fact/intake/review command contracts、domain、service、repo fake、trace/audit/outbox/stored result 基础主链 | `contract-domain-fast` fact/state slice;`service-flow-fast` fact command slice;targeted `infra-runtime-fake` UoW slice;`AC-ART-021~022` |
| PH-03 | 制品版本化与血缘关联纵切 | 建立 formal version、history retain、supersede、lineage link / reject / impact 语义 | PH-02 | version / lineage contracts、domain、service、expected-version / replay guard、history read anchor | `contract-domain-fast` version/lineage slice;`service-flow-fast` version/lineage slice;`infra-runtime-fake` conflict/replay slice;`AC-ART-023`;`VETO-ART-003` 预防 |
| PH-04 | 制品基线冻结纵切 | 建立 baseline candidate / freeze / supersede / history audit,保证 baseline 只接 formal version | PH-03 | baseline contracts、domain、service、history audit anchor、formal-member-only guards | `contract-domain-fast` baseline slice;`service-flow-fast` baseline slice;`AC-ART-023`;`VETO-ART-003` 预防 |
| PH-05 | 制品事实可消费表达与只读读面 | 建立 13 Query、consumable ref / backref、stable selector、projection / trace / report read surface 和 query no-write | PH-04 | query/view DTO、projection store、query handlers、consumable read surface、`RecordArtifactConsumptionBackref`、trace/report read | `service-flow-fast` query/read slice;targeted projection tests;`AC-ART-024`;`AC-ART-027`;`AC-ART-037`;`VETO-ART-004` 预防 |
| PH-06 | Inbound / Outbound Event 与 relay publication | 建立 6 Consumer、8 Event、stored payload snapshot、publisher marker 和 worker-only relay publication loop | PH-05 | consumer services / receipts、event payload snapshot、publisher worker、relay publication markers、topic-neutral binding | `entry-worker-job` consumer/relay slice;`operations-replay-core` outbox/relay slice;`redaction-boundary`;`config-redline` topic slice;`AC-ART-028~029`;`AC-ART-041` |
| PH-07 | Operations Jobs / Reconciliation / Handoff / Export | 建立 6 public jobs、report replay、partial failure、reference refresh、handoff / export seam 和 no-truth-repair | PH-06 | jobs DTO、application job services、jobs entry、derived/reference maintenance、handoff/export marker 和 report store | `entry-worker-job` public job slice;`operations-replay-core` jobs/handoff/replay slice;`redaction-boundary`;`AC-ART-030`;`AC-ART-036`;`AC-ART-038~040` |
| PH-08 | Release Gate / Reports / Acceptance Handoff | 生成固定 `run_id` 的 release smoke、candidate evidence、report audit、acceptance handoff / veto / risk docs | PH-07 | `release-main-smoke`、`report-generation-audit`、`reports/runs/<run_id>`、`reports/acceptance/*`、open issues / veto / risk drafts | `release-main-smoke`;`report-generation-audit`;`dependency-boundary`;`redaction-boundary`;`AC-ART-050~058`;`VETO-ART-001~009` |

### 7.3 五个核心能力到阶段映射表

| 核心能力 | 覆盖需求 | 对应 phase | 为什么落在这里 |
|---|---|---|---|
| 制品事实承载 | `FR-ART-001~004` | PH-02 | 它是 formal truth 的唯一入口,后续 version / lineage / baseline / consumption 都必须依附其成立 |
| 制品版本化 | `FR-ART-005~008` | PH-03 | formal version、history retain 和 supersede 必须先于 baseline / consumption 稳定成立 |
| 制品血缘关联 | `FR-ART-009~012` | PH-03 | lineage 依赖 formal fact/version,与 version 一起形成稳定追溯语境 |
| 制品基线冻结 | `FR-ART-013~016` | PH-04 | baseline 只接 formal version,适合在 version / lineage 之后独立停审 |
| 制品事实可消费表达 | `FR-ART-017~020` | PH-05 | consumable ref、read surface、query no-write 和 backref 依赖前四类 truth 全部稳定 |

### 7.4 Phase 可验证增量说明

| Phase | 功能增量 | 输入 | 输出 | 不包含 | 验证方式 |
|---|---|---|---|---|---|
| PH-01 | 从无目标仓到可编译 workspace 与根目录契约 | Step 3 / Step 4;`03` §4;`04` profiles | repo path、workspace、config shell、script shell、artifact/report roots | 任何业务 truth / protocol 主链 | `cargo check`;path checks;`config-redline` / `dependency-boundary` shell |
| PH-02 | formal Artifact fact accepted flow | PH-01;fact/intake/review truth design | fact truth、accepted mutation、trace/audit/outbox/stored result 基础链 | version / lineage / baseline / query / event / job | `contract-domain-fast`;`service-flow-fast`;targeted infra slice |
| PH-03 | version / lineage formal truth 扩展 | PH-02;version/lineage protocol/flow/state | formal version、history retain、supersede、lineage link / reject / impact | baseline / query / event / job | `contract-domain-fast`;`service-flow-fast`;`infra-runtime-fake` conflict/replay |
| PH-04 | baseline freeze formal truth | PH-03;baseline protocol/flow/state | baseline candidate/freeze/supersede/history audit | query / consumption / event / job | targeted baseline tests in `contract-domain-fast` / `service-flow-fast` |
| PH-05 | read-only consumption surface | PH-04;query/projection/consumption design | 13 Query、projection/read views、consumable ref/backref、stable selector | consumer / publisher / public jobs | `service-flow-fast` query slice;projection tests |
| PH-06 | external event seam 和 relay publication | PH-05;consumer/outbox/event design | 6 Consumer、8 Event、stored payload snapshot、relay publication markers | public jobs / acceptance reports | `entry-worker-job`;`operations-replay-core`;`redaction-boundary` |
| PH-07 | public maintenance / replay / handoff seam | PH-06;job/replay/handoff design | 6 public jobs、report replay、partial failure、handoff/export marker | final release evidence / verdict | `entry-worker-job`;`operations-replay-core`;handoff/export slices |
| PH-08 | release evidence and acceptance packaging | PH-07;`05` evidence;`06` acceptance | `reports/runs/<run_id>`、`reports/acceptance/*`、candidate evidence index、audit docs | 新增业务功能或真实产品绑定 | `release-main-smoke`;`report-generation-audit`;acceptance draft generation |

### 7.5 Phase 停审记录

| Phase | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| PH-01 | 是否只做仓、配置、脚本和路径骨架,不混入业务语义 | 通过 | 目标实现仓当前未发现,记录为 PH-01 开工 blocker |
| PH-01 | 是否把 compile-time dependency 裁到 `core-contracts` | 通过 | 其他 sibling 全部保留为 runtime seam |
| PH-02 | 是否形成最小 truth write 纵切 | 通过 | 只覆盖 fact/intake/review accepted flow,不提前做 version / lineage |
| PH-02 | 是否具备独立测试门禁 | 通过 | 使用 fact/state 子集运行 `contract-domain-fast` 和 `service-flow-fast` |
| PH-03 | 是否先于 baseline 成立 formal version / lineage | 通过 | baseline 被后置到 PH-04,避免一阶段过大 |
| PH-03 | 是否需要后续 query / relay / job 才可验证 | 通过 | 用 conflict/replay/history retain 即可闭合 |
| PH-04 | baseline 是否只依赖 formal version,不引入消费或 handoff 语义 | 通过 | baseline 独立停审,避免和 read/event/job 混写 |
| PH-05 | query/read surface 是否保持 no-write | 通过 | `VETO-ART-004` 从本 phase 起强约束 |
| PH-05 | consumption backref 是否仍不转移 truth ownership | 通过 | 只追加 backref / traceability,不改 truth anchor |
| PH-06 | relay facade 是否仍保持 worker-only | 通过 | 不并入 6 public jobs,保持单独门禁 |
| PH-06 | publisher 是否只读 stored snapshot | 通过 | current truth rebuild 被排除 |
| PH-07 | public jobs 是否只维护 derived / report / handoff,不 repair truth | 通过 | no-truth-repair 作为阶段硬门禁 |
| PH-07 | 是否需要 release reports 才可验证 | 通过 | report replay / handoff marker 可在 `operations-replay-core` 闭合 |
| PH-08 | 是否只汇总真实 artifacts / reports,不新增业务逻辑 | 通过 | report generation 和 acceptance drafts 最后收口 |
| PH-08 | residual / P1/P2 是否仍隔离于 P0 | 通过 | selected-run 和真实产品不进入 P0 passed |

### 7.6 跨 Phase 依赖闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 阶段顺序是否由 truth 依赖驱动 | 通过 | fact -> version/lineage -> baseline -> consumption/read -> event/relay -> jobs -> evidence |
| 是否存在按 crate / object 裸拆的 phase | 通过 | 每个 phase 都绑定能力、测试和验收红线 |
| 五个核心能力是否全部覆盖 | 通过 | 分别落在 PH-02~PH-05 |
| `PublishPendingArtifactRelays` 是否与 6 public jobs 混淆 | 通过 | PH-06 单列 relay facade,PH-07 单列 public jobs |
| 是否存在依赖后续 phase 才能通过当前测试的情况 | 通过 | 当前 phase 只要求当前可生成的 truth / markers / reports |
| 外部依赖是否被错误提升为 P0 compile-time 前置 | 通过 | 只有 `core-contracts` compile-time;其余 runtime seam / fake / disabled |
| P1/P2 / real-like / production-like 是否污染 P0 | 通过 | 只记录 residual / selected-run,不进入主 phase |
| evidence/report 是否可能被静态补洞 | 通过 | PH-08 要求从真实 suite artifacts 和 checks 推导 |
| 目标实现仓缺失是否影响顺序设计 | 通过但仍是 blocker | 作为 PH-01 开工前确认项,不影响 phase 逻辑 |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阶段依赖图”“阶段总表”“五个核心能力到阶段映射表”“Phase 可验证增量说明”“Phase 停审记录”和“跨 Phase 依赖闭环审计表”小节,了解阶段顺序为什么这样排。

正式 `07-实施计划.md` §5 应回填:

L1-artifact 的实施顺序按 truth-first 的可验证增量拆成八个 phase: PH-01 仓初始化、配置与证据骨架;PH-02 制品事实承载最小 accepted 纵切;PH-03 制品版本化与血缘关联纵切;PH-04 制品基线冻结纵切;PH-05 制品事实可消费表达与只读读面;PH-06 Inbound / Outbound Event 与 relay publication;PH-07 Operations Jobs / Reconciliation / Handoff / Export;PH-08 Release Gate / Reports / Acceptance Handoff。

阶段顺序遵循三条原则。第一,先建立目标仓、workspace、唯一编译期依赖、config profile、artifact/report roots 和脚本骨架,再进入业务 truth。第二,五个核心能力按事实承载 -> 版本化/血缘 -> 基线冻结 -> 可消费表达的顺序成立,避免让 baseline、query、consumable ref 或外部事件依赖未稳定的 truth。第三,event / relay / public jobs / evidence 作为外围维护与交付面后置,并保持 `PublishPendingArtifactRelays` 与 6 个 public jobs 分离。

每个 phase 完成时都必须停审:是否形成可验证功能增量,是否误依赖后续 phase,是否引入 compile-time sibling 污染,是否触及 `VETO-ART-*` 红线,以及是否需要回写正式 `03/05/06/07`。若发现字段、DTO、状态、payload source、report surface 或 phase boundary 无法 1:1 落码,不得继续拆 commit boundary,必须先回写设计真相源。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-artifact` 当前未发现 | PH-01 不能实际开工 | Step 8 继续列为前置门禁 |
| commit boundary 如何在 PH-02~PH-07 内细拆 | 影响 Step 6 | 下一步在 Step 6 继续拆分 |
| 每个 phase 的 suite / AC / VETO 精确映射到 boundary 的粒度 | 影响 Step 7 | 当前只给 phase 级映射 |
| P1 selected-run / 真实产品绑定何时触发 | 影响 Step 9 风险记录,不影响 P0 phase | Step 9 记录 residual / trigger |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 阶段依赖图已输出 | 通过 | PH-01~PH-08 顺序明确 |
| 阶段总表已输出 | 通过 | 每个 phase 有目标、依赖、交付物和门禁 |
| 五个核心能力映射已输出 | 通过 | FR 主轴已挂到 PH-02~PH-05 |
| 每个 phase 有可验证增量说明 | 通过 | 已给出输入、输出、不包含和验证方式 |
| Phase 停审完成 | 通过 | 当前为设计层停审,实现期需重复验证 |
| 跨 phase 审计无 unresolved 冲突 | 通过 | 仅剩目标实现仓缺失这一前置 blocker |
| 可进入 Step 6 | 待用户确认 | 下一步拆分阶段任务、编写顺序与提交边界 |
