# L1-work 07 实施计划 Step 5: 设计实施阶段与依赖顺序

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-work/07-实施计划.md` §5 实施阶段与依赖顺序
> 状态: `[x] 已完成`
> 日期: 2026-06-05

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 5 |
| 主题 | 设计实施阶段与依赖顺序 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-work/design-calibration/07_implementation_plan_step_05_phases_dependencies.md` |

本步把 Step 4 的交付物组织成按依赖推进的阶段化可验证功能增量。本步只定义阶段顺序、阶段级目标和阶段级门禁,不拆分阶段任务、编写顺序或 commit boundary。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 提取交付物、非交付物、跨仓依赖和交付物边界 |
| `07_implementation_plan_step_03_prerequisites_reading.md` | 已确认 | 承接开工阅读矩阵、git / 目录 / 依赖 / 脚本 / evidence 前置门禁 |
| `03-详细设计.md` §4~§16 | 已完成 | 提取 crate 依赖、协议依赖、状态依赖、事务依赖、配置绑定和测试切口 |
| `04-配置设计.md` §3~§12 | 已完成 | 提取 config / runtime graph、profile、reports / artifacts、redaction 和 failure modes |
| `05-测试方案.md` §5~§13 | 已完成 | 提取 `TC-WORK-*`、`EV-WORK-*`、gate、report、artifact、redaction 和退出准则 |
| `06-验收标准.md` §2~§11 | 已完成 | 提取 P0 / P1 / P2、AC / VETO、evidence gate 和一票否决约束 |

校准来源:

- `design-calibration/03_ddd_step_04_file_layout.md`
- `design-calibration/03_ddd_step_05_module_contracts.md`
- `design-calibration/03_ddd_step_09_function_flows.md`
- `design-calibration/03_ddd_step_10_state_matrix.md`
- `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
- `design-calibration/03_ddd_step_13_concurrency_idempotency.md`
- `design-calibration/03_ddd_step_16_test_cuts.md`
- `design-calibration/03_ddd_step_17_implementation_handoff.md`
- `design-calibration/05_test_plan_step_05_traceability_coverage.md`
- `design-calibration/05_test_plan_step_06_cases_matrix.md`
- `design-calibration/05_test_plan_step_09_automation_gates.md`
- `design-calibration/06_acceptance_step_05_function_gate.md`
- `design-calibration/06_acceptance_step_08_state_transaction_consistency.md`
- `design-calibration/06_acceptance_step_10_observability_evidence.md`
- `design-calibration/06_acceptance_step_11_veto.md`

## 3. SOP 问题回答

### 3.1 最小可运行或可测试的纵切是什么?

最小可运行纵切是“目标仓可编译 + `core-contracts` path dependency + strict config 默认 profile + run-scoped evidence 骨架”。这条纵切先证明 `/home/aris/Projects/quantalithos-work` 的 workspace、crate 命名、唯一编译期依赖、脚本参数、artifact root 和 report root 都可审查。

最小业务纵切是 `CreateProject` 同步建立 `Project` 与 `Backlog`,并在同一 UnitOfWork 内写入 trace / audit / outbox intent、projection stale marker 和 idempotency result。这条纵切证明 C-1 项目主语成立,也为 ProjectMember、WorkItem、Iteration、Query、Outbox 和 Operations Job 提供稳定 truth root。

### 3.2 哪些阶段必须先于其他阶段?

仓初始化、配置和证据骨架必须先于任何业务纵切。Project / Backlog 必须先于 ProjectMember、WorkItem 和 Iteration,因为它们都归属于 Project。ProjectMember 必须早于正式工作协作和授权消费,否则 actor / responsibility 边界不清。Formal Work 和 Promote 必须早于 Dependency / Blocker 和 Iteration,因为依赖、阻塞和承诺对象都指向正式工作。Iteration 必须在完整 Query / Projection 前完成,这样消费面可以覆盖 C-1~C-4。Operations Job 和 Outbox Publish 必须晚于核心 truth flows,否则无法覆盖完整 projection / reference / reconciliation / handoff 维护面。Release evidence 必须最后执行。

### 3.3 哪些风险或跨仓依赖需要前置?

需要前置的风险包括目标实现仓不存在、`core-contracts` baseline 未固定、crate 命名、artifact / report 路径、strict JSON config、fake-as-production reject、forbidden body / raw secret redaction、非 core sibling repo 误写 Cargo dependency 和 P1 / P2 范围膨胀。

真实 bus、identity、conversation、method-library、process、governance、artifact、runtime、workspace、observability、archive 和 SDK 不作为 P0 服务依赖前置,只通过 port、fake adapter、fixture、event payload、safe snapshot、marker 和 boundary tests 表达。

### 3.4 每个阶段完成后能验证什么?

PH-01 验证目标仓、workspace、core dependency、基础 config、scripts 和证据骨架。PH-02 验证 Project / Backlog C-1 纵切。PH-03 验证 ProjectMember C-2 和 identity 边界。PH-04 验证 Backlog / WorkItem / ChildWorkItem / Promote 的 C-3 正式工作全集和升级边界。PH-05 验证 Dependency / Blocker / completion evidence 的可解释协作关系。PH-06 验证 Iteration / Commitment 的 C-4 承诺子集。PH-07 验证授权 Query、Projection、Trace 和 no-write 的 C-5 消费追溯。PH-08 验证 Inbound Consumer、Outbox、Operations Jobs、Reference Refresh、Reconciliation 和 Handoff 维护对账。PH-09 验证 release gate、reports、redaction、evidence index、acceptance handoff 和 veto checklist。

### 3.5 是否存在按对象拆分而不可验证的阶段?

存在。比如“实现所有 DTO”“实现所有 domain 对象”“实现所有 repository”“实现所有 worker / jobs”都不可作为阶段,因为它们无法独立证明 Work truth center 的业务闭环。正确阶段必须穿过 contracts、domain、application、infra、entry、tests 和 evidence,形成一条可验证功能纵切。

### 3.6 哪些阶段可以并行,哪些不能并行?

PH-01 必须串行先完成。PH-02~PH-08 的主状态链路原则上串行推进,因为后续阶段依赖前置 truth、state、idempotency、visibility、trace 和 evidence。脚本 help、report template、redaction checker、fixture builder 可以从 PH-01 后持续增量完善,但不能替代对应阶段的业务门禁。PH-09 必须最后执行,因为它依赖所有 P0 / P0-supporting 用例和证据完整性。

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 交付物清单尚未排序 | Step 4 只说明交付什么 | 实施者不知道先做哪个能力 | 本步按状态和依赖链组织阶段 |
| crate 依赖易误当阶段 | `contracts/domain/application/infra/api/worker/jobs` 边界清楚 | 可能按模块分工,但每阶段不可验 | 阶段按可验证纵切命名,crate 只是落点 |
| query / projection 容易后置 | `FR-WORK-007` 是核心闭环,不只是后置视图 | 最后才发现授权和 no-write 问题 | PH-07 专门收口 authorized query / projection / trace |
| outbox / operations 容易最后补 | outbox、jobs 和 reports 是验收门禁 | 最后无法生成完整 evidence | PH-02 起 enqueue,PH-08 完成 publish / operations |
| reports / artifacts 容易最后补 | `05` / `06` 强制 fixed run evidence | 最后验收时证据缺失 | PH-01 建骨架,PH-09 收口 |
| production adapter 诱导膨胀 | 真实外部服务容易被提前做 | 阶段变大且不可稳定验收 | 阶段只要求 fake / in-memory / controlled seam |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 阶段组织 | 只有交付物列表 | 形成 PH-01~PH-09 阶段依赖顺序 | 实施者知道按什么顺序推进 |
| 最小闭环 | 尚未定义 | 明确先仓骨架,再 Project / Backlog 最小纵切 | 避免一次性铺开全部对象 |
| 成员承担 | 可能与 identity 生命周期混写 | PH-03 单独建立 ProjectMember 和 resolver boundary | 前置 C-2 和 identity 红线 |
| 正式工作全集 | 可能把 WorkItem、Promote、Dependency 混成大阶段 | PH-04 与 PH-05 分开 formal / promote 和 dependency / blocker | 保持阶段可验证 |
| 授权消费 | 可能放到最后 | PH-07 在 operations 前建立 authorized query / projection / trace | 维护和对账前先证明 no-write |
| 证据门禁 | 只列交付物 | 阶段从 PH-01 绑定 artifact / report,PH-09 收口 | 防止测试证据后补 |
| 并行性 | 未说明 | 明确核心状态链路串行,脚本模板可增量并行 | 降低实现冲突 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate 阶段推进 | 目录清晰,便于分工 | 完成一个 crate 不等于完成可验能力 | 不采用 |
| 按 P0 功能纵切推进 | 每阶段可测试、可验收 | 同一阶段会跨多个 crate | 采用 |
| 先完整实现 infra 再做业务 | 底层能力完整 | 容易提前做 production adapter,并延迟主闭环验证 | 不采用 |
| 先 fake / in-memory 闭环,后续替换 adapter | 快速形成可验 P0 | 生产 adapter 风险后置 | 采用 |
| 把 query / projection 放到最后 | 写路径推进快 | 无法及时发现授权和 read-only 问题 | 不采用 |
| 在 core truth 后建立 authorized query | 后续维护能力都有消费验证 | 需要早期实现最小 read model | 采用 |
| 最后统一补报告和证据 | 实现阶段更短 | 不满足验收标准,容易补不齐 | 不采用 |
| PH-01 建证据骨架,PH-09 统一收口 | 证据链从一开始可见 | 初始阶段需要多做脚本骨架 | 采用 |

## 7. 结构化中间产物

### 7.1 阶段依赖图: L1-work 实施阶段顺序

```text
[PH-01 仓初始化与证据骨架]
  | enables workspace, core dependency, config and scripts
  v
[PH-02 Project / Backlog truth 最小纵切]
  | creates Work truth root and backlog boundary
  v
[PH-03 ProjectMember 承担与 identity 边界]
  | proves project responsibility without owning identity truth
  v
[PH-04 Formal Work / Promote 正式工作全集]
  | proves WorkItem, child WorkItem and promote boundary
  v
[PH-05 Dependency / Blocker / Evidence 协作关系]
  | proves explainable dependency, blocker and completion evidence refs
  v
[PH-06 Iteration / Commitment 承诺子集]
  | proves committed subset separated from Backlog and process planning
  v
[PH-07 Authorized Query / Projection / Trace 消费追溯]
  | proves authorized consumption, stale surfaces and query no-write
  v
[PH-08 Outbox / Consumers / Operations Maintenance]
  | proves event sync, rebuild, refresh, reconciliation and handoff no-write
  v
[PH-09 Release gate / reports / acceptance handoff]
```

关键说明:

- 图表达阶段依赖顺序,不表达完整函数调用链。
- 阶段按可验证功能增量组织,不是按 crate、对象或文件组织。
- `scripts`、`artifacts`、`reports` 在 PH-01 建骨架,在 PH-09 形成完整送验材料。
- 真实 production adapter 不在阶段主链中,只作为 P1 / P2 风险或后续专项。

### 7.2 阶段总表

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化与证据骨架 | 创建目标仓、workspace、core dependency、基础 config、gate / report / check 脚本骨架 | 无 | `/home/aris/Projects/quantalithos-work`、`crates/*`、`core-contracts` path、`scripts/*`、`artifacts/test/<run_id>`、`reports/` | workspace 可编译;路径和命名检查通过;脚本支持 required args;无 `latest` 正式引用 |
| PH-02 | Project / Backlog truth 最小纵切 | 建立 Project 主语、Backlog 边界、lifecycle、trace / audit / outbox intent 和 idempotency | PH-01 | Project / Backlog contracts、domain、repository、UoW、minimal command handler、in-memory store | `TC-WORK-CORE-001~004`;`EV-WORK-CORE-001~004`;`AC-WORK-001/006`;`VF-WORK-001` |
| PH-03 | ProjectMember 承担与 identity 边界 | 建立 ProjectMember 承担事实、capability snapshot、identity resolver seam 和责任状态 | PH-02 | ProjectMember contracts / domain / service、identity resolver port、member repository、negative body guard | `TC-WORK-MEMBER-001~004`;`EV-WORK-MEMBER-001~004`;`AC-WORK-002/007`;`VF-WORK-003` |
| PH-04 | Formal Work / Promote 正式工作全集 | 建立 Backlog 正式工作全集、WorkItem、ChildWorkItem、PromoteResult、source ref 和 runtime / plan body 拒绝 | PH-03 | WorkItem / ChildWorkItem / Promote contracts、domain、services、promote intake fixture、forbidden body scan | `TC-WORK-FORMAL-001~005`;`TC-WORK-PROMOTE-001~005`;`EV-WORK-FORMAL-*`;`EV-WORK-PROMOTE-*`;`AC-WORK-003/008/009` |
| PH-05 | Dependency / Blocker / Evidence 协作关系 | 建立正式工作依赖、阻塞、解除依据、completion evidence ref 和 graph / cycle guard | PH-04 | Dependency / Blocker contracts、domain、repository、service、evidence resolver seam、audit history | `TC-WORK-DEP-001~005`;`EV-WORK-DEP-001~005`;`AC-WORK-010/019/027`;`VF-WORK-007` |
| PH-06 | Iteration / Commitment 承诺子集 | 建立 Iteration、IterationCommitment、formal candidate guard、commit / change / close / cancel 和 process ref boundary | PH-05 | Iteration contracts、domain、repository、service、process timebox resolver seam、state tests | `TC-WORK-ITER-001~005`;`EV-WORK-ITER-001~005`;`AC-WORK-004/011`;`VF-WORK-001` |
| PH-07 | Authorized Query / Projection / Trace 消费追溯 | 建立 8 Query、authorized read、ProjectBoardView、MemberWorkView、IterationSummaryView、WorkSearchProjection、trace page 和 query no-write | PH-06 | query DTO、view DTO、projection store、trace read service、query handlers、authorization guard | `TC-WORK-QUERY-001~008`;`EV-WORK-QUERY-001~008`;`AC-WORK-005/012/021~023`;`VF-WORK-006/008` |
| PH-08 | Outbox / Consumers / Operations Maintenance | 完成 inbound consumers、outbox publisher、projection rebuild、reference refresh、reconciliation、trace / archive handoff 和 recovery marker | PH-07 | event DTO、worker consumers、outbox relay、operations job runners、fake publisher / handoff、reconciliation report | `TC-WORK-OPS-001~006`;`EV-WORK-OPS-001~006`;`AC-WORK-013/025/028/029`;`VF-WORK-004/005/009/010/011` |
| PH-09 | Release gate / reports / acceptance handoff | 执行 P0 阻断 suite,生成 fixed run artifacts、reports、evidence index、redaction report、acceptance handoff 和 veto checklist | PH-08 | release gate、report generation、evidence index、redaction check、veto checklist、risk acceptance / open issues | `release-main-smoke`;`release-config-redline`;`release-evidence-pack`;`EV-WORK-NFR-*`;`VETO-WORK-*`;`AC-WORK-024~029` |

### 7.3 阶段顺序理由

| 顺序 | 理由 |
|---|---|
| PH-01 先行 | 没有目标仓、workspace、dependency、config 和证据骨架,任何代码阶段都不可验证 |
| PH-02 早于 PH-03 | ProjectMember 必须归属于已存在 Project,Project 是 Work truth root |
| PH-03 早于 PH-04 | 正式协作工作需要项目内承担和 actor / responsibility guard |
| PH-04 早于 PH-05 | Dependency、Blocker 和 completion evidence 都指向 formal WorkItem / ChildWorkItem |
| PH-05 早于 PH-06 | Iteration commitment 应基于已能解释依赖 / 阻塞和 completion evidence 的正式工作集合 |
| PH-06 早于 PH-07 | Query / projection / trace 应覆盖 C-1~C-4 的完整主链 |
| PH-07 早于 PH-08 | Operations maintenance 必须建立在 authorized read、projection no-write 和 trace surface 已可验证的基础上 |
| PH-09 最后 | release gate、reports、acceptance handoff 和 VETO 裁决必须基于全部 P0 evidence |

### 7.4 阶段可并行性判断

| 阶段 | 可并行部分 | 不可并行部分 | 结论 |
|---|---|---|---|
| PH-01 | README / script help / report template 可与 workspace 骨架并行 | `core-contracts` dependency 和 crate naming 必须统一后再推进 | 小范围并行 |
| PH-02~PH-08 | 单阶段内部可按 test / contracts / domain / service / adapter 协作 | 阶段之间的状态链路必须串行 | 阶段间不并行 |
| PH-07 | view fixture、report template 和 query contract tests 可提前准备 | authorized query no-write 和 projection store 依赖 PH-02~PH-06 truth | 部分并行 |
| PH-08 | redaction checker 和 report skeleton 可从 PH-01 后增量补强 | consumer / outbox / operations jobs 依赖前置 truth flows | 部分并行 |
| PH-09 | 无 | 必须等待 PH-01~PH-08 证据齐全 | 不并行 |

### 7.5 按对象拆分风险检查

| 错误阶段写法 | 问题 | 替代表达 |
|---|---|---|
| 实现所有 DTO | 只能证明类型存在,不能证明业务闭环 | PH-02~PH-08 随纵切交付 DTO |
| 实现所有 domain 对象 | 缺少 repository、service、entry 和测试证据 | 按 Project、Member、Formal Work、Dependency、Iteration、Query、Operations 纵切交付 |
| 实现所有 repository | 没有业务用例驱动,容易过度抽象 | 在 PH-02 起随写路径、query、consumer 和 job 交付 |
| 实现所有 worker / jobs | worker / jobs 依赖 truth、projection、outbox 和 idempotency | PH-08 集中完成 consumer / outbox / operations maintenance |
| 最后统一写测试和 reports | 阶段不可验,不符合验收标准 | 每个阶段绑定 TC / AC,PH-09 只做总收口 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §5。

````markdown
## 5. 实施阶段与依赖顺序

> 校准来源:
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阶段依赖图”“阶段总表”“阶段顺序理由”“阶段可并行性判断”和“按对象拆分风险检查”小节,了解本轮为什么按可验证功能增量而不是按 crate / 对象排阶段。

#### 阶段依赖图: L1-work 实施阶段顺序

```text
[PH-01 仓初始化与证据骨架]
  | enables workspace, core dependency, config and scripts
  v
[PH-02 Project / Backlog truth 最小纵切]
  | creates Work truth root and backlog boundary
  v
[PH-03 ProjectMember 承担与 identity 边界]
  | proves project responsibility without owning identity truth
  v
[PH-04 Formal Work / Promote 正式工作全集]
  | proves WorkItem, child WorkItem and promote boundary
  v
[PH-05 Dependency / Blocker / Evidence 协作关系]
  | proves explainable dependency, blocker and completion evidence refs
  v
[PH-06 Iteration / Commitment 承诺子集]
  | proves committed subset separated from Backlog and process planning
  v
[PH-07 Authorized Query / Projection / Trace 消费追溯]
  | proves authorized consumption, stale surfaces and query no-write
  v
[PH-08 Outbox / Consumers / Operations Maintenance]
  | proves event sync, rebuild, refresh, reconciliation and handoff no-write
  v
[PH-09 Release gate / reports / acceptance handoff]
```

阶段必须按可验证功能增量推进。`contracts/domain/application/infra/api/worker/jobs` 是代码落点,不是阶段拆分依据。

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化与证据骨架 | 创建目标仓、workspace、core dependency、基础 config 和脚本证据骨架 | 无 | 目标仓、`crates/*`、`scripts/*`、`artifacts/test/<run_id>`、`reports/` | workspace 可编译;命名和路径检查通过 |
| PH-02 | Project / Backlog truth 最小纵切 | 建立 Project 主语、Backlog 边界和 accepted truth 副作用 | PH-01 | Project / Backlog contracts、domain、repository、UoW、minimal command handler | `TC-WORK-CORE-001~004`;`AC-WORK-001/006` |
| PH-03 | ProjectMember 承担与 identity 边界 | 建立 ProjectMember 承担事实和 identity resolver seam | PH-02 | ProjectMember contracts / domain / service、identity resolver port、member repository | `TC-WORK-MEMBER-001~004`;`AC-WORK-002/007` |
| PH-04 | Formal Work / Promote 正式工作全集 | 建立 WorkItem、ChildWorkItem、PromoteResult 和 runtime / plan body 拒绝 | PH-03 | WorkItem / ChildWorkItem / Promote contracts、domain、services、promote fixture | `TC-WORK-FORMAL-*`;`TC-WORK-PROMOTE-*`;`AC-WORK-003/008/009` |
| PH-05 | Dependency / Blocker / Evidence 协作关系 | 建立依赖、阻塞、解除依据和 evidence ref | PH-04 | Dependency / Blocker contracts、domain、service、evidence resolver seam | `TC-WORK-DEP-001~005`;`AC-WORK-010/019/027` |
| PH-06 | Iteration / Commitment 承诺子集 | 建立 Iteration、Commitment 和 process ref boundary | PH-05 | Iteration contracts、domain、repository、service、process timebox seam | `TC-WORK-ITER-001~005`;`AC-WORK-004/011` |
| PH-07 | Authorized Query / Projection / Trace 消费追溯 | 建立 8 Query、projection view、trace page 和 query no-write | PH-06 | query / view DTO、projection store、trace read service、query handlers | `TC-WORK-QUERY-001~008`;`AC-WORK-005/012` |
| PH-08 | Outbox / Consumers / Operations Maintenance | 完成 consumer、outbox publish、projection rebuild、reference refresh、reconciliation 和 handoff | PH-07 | event DTO、worker consumers、outbox relay、operations jobs、fake publisher / handoff | `TC-WORK-OPS-001~006`;`AC-WORK-013/025/028/029` |
| PH-09 | Release gate / reports / acceptance handoff | 生成固定 run 的送验证据 | PH-08 | release gate、reports、evidence index、redaction check、acceptance handoff、veto checklist | `release-main-smoke`;`release-config-redline`;`release-evidence-pack`;`VETO-WORK-*` |
````

## 9. 待确认事项

无阻塞进入 Step 6 的待确认事项。

后续必须继续收口:

- Step 6 将 PH-01~PH-09 拆成阶段任务、代码批次和 commit boundary。
- Step 6 必须为每个 phase / commit boundary 增加字段、DTO、状态、metadata、idempotency、projection rebuild 和 phase boundary 开工前复核。
- Step 7 必须把本步阶段门禁展开为具体 fmt / check / test / gate / evidence 命令。
- Step 8 必须把 PH-01 / PH-08 / PH-09 涉及的 config、external seam 和 local environment 准备收口。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 阶段依赖图已输出 | 已满足 |
| 阶段总表已覆盖 Step 4 的核心交付物 | 已满足 |
| 每个阶段都有实施目标、依赖阶段、核心交付物和阶段门禁 | 已满足 |
| 阶段顺序已经说明为什么不能按对象、crate 或文件裸拆 | 已满足 |
| 最小可测试纵切已明确 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

结论:可以进入 Step 6,拆分阶段任务、编写顺序与提交边界。
