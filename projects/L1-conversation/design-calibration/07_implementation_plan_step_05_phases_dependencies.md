# L1-conversation 07 实施计划 Step 5: 设计实施阶段与依赖顺序

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` §5 实施阶段与依赖顺序
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 5 |
| 主题 | 设计实施阶段与依赖顺序 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_05_phases_dependencies.md` |

本步把 Step 4 的交付物组织成按依赖推进的阶段化可验证功能增量。本步只定义阶段顺序、阶段级目标和阶段级门禁，不拆分阶段任务、编写顺序或 commit boundary。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 提取交付物、非交付物、跨仓依赖和交付物边界 |
| `03-详细设计.md` §4~§16 | 已完成 | 提取 crate 依赖、协议依赖、状态依赖、事务依赖和测试切口 |
| `04-配置设计.md` §3~§12 | 已完成 | 提取 config / runtime graph、profile、reports / artifacts、redaction 和 failure modes |
| `05-测试方案.md` §4~§14 | 已完成 | 提取测试分层、TC / EV、gate、report、artifact 和 redaction 门禁 |
| `06-验收标准.md` §5~§14 | 已完成 | 提取 AC / VETO 对阶段顺序的约束 |

校准来源:

- `design-calibration/03_ddd_step_04_units_file_layout.md`
- `design-calibration/03_ddd_step_05_module_contracts_axis.md`
- `design-calibration/03_ddd_step_09_function_flows.md`
- `design-calibration/03_ddd_step_10_state_matrix.md`
- `design-calibration/03_ddd_step_11_persistence_transaction_consistency.md`
- `design-calibration/03_ddd_step_13_concurrency_idempotency.md`
- `design-calibration/03_ddd_step_16_test_slices.md`
- `design-calibration/03_ddd_step_17_implementation_handoff.md`
- `design-calibration/05_test_plan_step_05_traceability_matrix.md`
- `design-calibration/05_test_plan_step_06_cases.md`
- `design-calibration/06_acceptance_step_05_function_gate.md`
- `design-calibration/06_acceptance_step_08_state_tx_consistency.md`

## 3. SOP 问题回答

### 3.1 最小可运行或可测试的纵切是什么?

最小可测试纵切不是完整 Conversation 仓，而是“目标仓可编译 + `core-contracts` path dependency + 创建 conversation space / scope + 固定 run evidence”。该纵切最早证明本仓目录、依赖、基础 DTO、domain state、application transaction、API handler、in-memory repository、配置和证据路径都能形成可审查结果。

业务上最小有意义纵切是 space / scope，因为 fact、manifestation、query、handoff、outbox、projection 和 audit 都依赖明确 conversation space、participant scope 和 visibility scope。

### 3.2 哪些阶段必须先于其他阶段?

仓初始化、配置和证据骨架必须先于任何业务纵切。Space / scope 必须先于 fact append，因为对话事实不能脱离明确空间和可见范围。Fact append 必须先于 authorized query、manifestation、trace 和 outbox publish，因为这些能力需要已提交 fact、receipt、trace 和 outbox intent。Authorized query / projection 必须在复杂来源事实和 handoff 前建立，以便后续所有能力都能立即验证授权、refs-only 和 no-write。Manifestation / inbound consumer 必须先于完整 outbox / operations 收口，因为它们会产生需要发布、投影和审计的本仓事实。Release reports 必须最后执行，因为它依赖全部 P0 evidence。

### 3.3 哪些风险或跨仓依赖需要前置?

需要前置的风险包括目标实现仓不存在、`core-contracts` path dependency、crate 命名、artifact / report 路径、strict JSON config、fake-as-production reject、forbidden body / raw secret redaction 和 P1 / P2 范围膨胀。真实 bus、identity、work、governance、artifact、runtime、bridges、observability、archive、sdk、chat 和 workspace 不前置为 P0 服务依赖，只以前置 port、fake、fixture、marker 和 boundary test 表达。

### 3.4 每个阶段完成后能验证什么?

PH-01 验证目标仓、workspace、core dependency、基础 config、scripts 和证据骨架。PH-02 验证 space / participant scope / visibility scope truth。PH-03 验证 append-only fact、retract、transaction、idempotency 和 outbox enqueue。PH-04 验证 authorized query、read model、search refs、cursor 和 query no-write。PH-05 验证 manifestation、source resolver、inbound consumer、source truth isolation 和 quarantine。PH-06 验证 review anchor、trace handoff、archive handoff 和 handoff failure 不回滚 truth。PH-07 验证 outbox publish、projection rebuild、cursor maintenance、snapshot refresh、consistency validation 和 operations rerun。PH-08 验证 release gate、reports、redaction、evidence index、acceptance handoff 和 veto checklist。

### 3.5 是否存在按对象拆分而不可验证的阶段?

存在风险。例如“实现所有 DTO”“实现所有 domain 对象”“实现所有 repository”“实现所有 worker”都不可作为阶段，因为它们无法独立证明 P0 truth center 成立。正确做法是让每个阶段穿过 contracts、domain、application、infra、entry、tests 和 evidence 的一条可验证纵切。

### 3.6 哪些阶段可以并行，哪些不能并行?

PH-01 必须串行先完成。PH-02~PH-07 的主状态链路原则上串行推进，因为后续阶段依赖前置 truth、state、idempotency、visibility 和 evidence。脚本 help、report template、redaction checker、fixture builder 可以从 PH-01 后持续增量完善，但不能替代对应阶段的业务门禁。PH-08 必须最后执行，因为它依赖所有 P0 / P0-supporting 用例和证据完整性。

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 交付物清单尚未排序 | Step 4 只说明交付什么 | 实施者不知道先做哪个能力 | 本步按状态和依赖链组织阶段 |
| crate 依赖易误当阶段 | `contracts/domain/application/infra/api/worker/jobs` 边界清楚 | 可能按模块分工，但每阶段不可验 | 阶段按可验证纵切命名，crate 只是落点 |
| query / projection 容易后置 | `FR-CONV-003` 是核心闭环，不只是后置视图 | 后续功能缺少授权消费验证 | PH-04 前置 authorized query / projection / cursor |
| outbox / operations 容易最后补 | outbox、jobs 和 reports 是验收门禁 | 最后无法生成完整 evidence | PH-03 开始 enqueue，PH-07 完成 publish / operations |
| reports / artifacts 容易最后补 | `05` / `06` 强制 fixed run evidence | 最后验收时证据缺失 | PH-01 建骨架，PH-08 收口 |
| production adapter 诱导膨胀 | 真实外部服务容易被提前做 | 阶段变大且不可稳定验收 | 阶段只要求 fake / in-memory / controlled seam |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 阶段组织 | 只有交付物列表 | 形成 PH-01~PH-08 阶段依赖顺序 | 实施者知道按什么顺序推进 |
| 最小闭环 | 尚未定义 | 明确先仓骨架，再 space / scope，再 fact append | 避免一次性铺开全部对象 |
| 授权消费 | 可能放到后期 | PH-04 单独建立 authorized query / projection / cursor | 后续能力都能立即验证可见性 |
| 跨域事实 | 可能与 fact 混写 | PH-05 单独承接 manifestation / inbound consumer | 前置 source truth isolation 和 forbidden body guard |
| 证据门禁 | 只列交付物 | 阶段从 PH-01 绑定 artifact / report，PH-08 收口 | 防止测试证据后补 |
| 并行性 | 未说明 | 明确核心状态链路串行，脚本模板可增量并行 | 降低实现冲突 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate 阶段推进 | 目录清晰，便于分工 | 完成一个 crate 不等于完成可验能力 | 不采用 |
| 按 P0 功能纵切推进 | 每阶段可测试、可验收 | 同一阶段会跨多个 crate | 采用 |
| 先完整实现 infra 再做业务 | 底层能力完整 | 容易提前做 production adapter，并延迟主闭环验证 | 不采用 |
| 先 fake / in-memory 闭环，后续替换 adapter | 快速形成可验 P0 | 生产 adapter 风险后置 | 采用 |
| 把 query / projection 放到最后 | 写路径推进快 | 无法及时发现授权和 read-only 问题 | 不采用 |
| 在 fact append 后尽早建立 authorized query | 后续阶段都有消费验证 | 需要早期实现最小 read model | 采用 |
| 最后统一补报告和证据 | 实现阶段更短 | 不满足验收标准，容易补不齐 | 不采用 |
| PH-01 建证据骨架，PH-08 统一收口 | 证据链从一开始可见 | 初始阶段需要多做脚本骨架 | 采用 |

## 7. 结构化中间产物

### 7.1 阶段依赖图: L1-conversation 实施阶段顺序

```text
[PH-01 仓初始化与证据骨架]
  | enables workspace, core dependency, config and scripts
  v
[PH-02 Space / scope truth 最小纵切]
  | creates conversation boundary and visibility baseline
  v
[PH-03 Fact append / transaction / idempotency 写路径]
  | creates append-only conversation facts and outbox intent
  v
[PH-04 Authorized query / projection / cursor 消费闭环]
  | proves authorized consumption and query no-write
  v
[PH-05 Manifestation / inbound consumer 跨域事实显化]
  | proves source truth isolation and ref-only ingestion
  v
[PH-06 Trace / review / handoff 追溯交接]
  | proves auditability and failure-safe handoff
  v
[PH-07 Outbox publish / operations jobs / maintenance]
  | proves rerun, projection rebuild and no-auto-repair
  v
[PH-08 Release gate / reports / acceptance handoff]
```

关键说明:

- 图表达阶段依赖顺序，不表达完整函数调用链。
- 阶段按可验证功能增量组织，不是按 crate、对象或文件组织。
- `scripts`、`artifacts`、`reports` 在 PH-01 建骨架，在 PH-08 形成完整送验材料。
- 真实 production adapter 不在阶段主链中，只作为 P1 / P2 风险或后续专项。

### 7.2 阶段总表

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化与证据骨架 | 创建目标仓、workspace、core dependency、基础 config、gate / report / check 脚本骨架 | 无 | `/home/aris/Projects/quantalithos-conversation`、`crates/*`、`core-contracts` path、`scripts/*`、`artifacts/test/<run_id>`、`reports/` | workspace 可编译；路径和命名检查通过；脚本支持 required args；无 `latest` 正式引用 |
| PH-02 | Space / scope truth 最小纵切 | 建立 conversation space、participant scope、visibility scope、scope change 和初始 audit / outbox intent | PH-01 | Command DTO、space / scope domain、repository / UoW、minimal API handler、visibility guard、idempotency 初始能力 | `TC-CONV-SPACE-*`;`TC-CONV-SCOPE-*`;`EV-CONV-TRUTH-001`;AC-FUNC-001 |
| PH-03 | Fact append / transaction / idempotency 写路径 | 打通 append / retract fact、receipt、trace、idempotency、outbox enqueue 和 forbidden body guard | PH-02 | fact domain、append / retract service、idempotency record、transaction rollback、fact outbox event intent | `TC-CONV-FACT-*`;`TC-CONV-TX-001`;`EV-CONV-FACT-001`;`EV-CONV-REDACTION-001`;AC-FUNC-002 |
| PH-04 | Authorized query / projection / cursor 消费闭环 | 建立 authorized read model、query no-write、search refs、poll changes 和 cursor monotonic | PH-03 | Query DTO、read model store、projection state、search refs projection、change cursor、query handlers | `TC-CONV-QUERY-*`;`TC-CONV-SEARCH-001`;`TC-CONV-CURSOR-001`;`EV-CONV-AUTH-001`;AC-FUNC-003 / 006 / 007 |
| PH-05 | Manifestation / inbound consumer 跨域事实显化 | 承接 external fact、safe snapshot、source resolver、inbound consumer、quarantine 和 source truth isolation | PH-04 | manifestation domain、resolver port、source consumer fixture、runtime / bridge / identity / governance / artifact event handlers | `TC-CONV-MAN-*`;`TC-CONV-CONSUMER-*`;`EV-CONV-MAN-001`;`EV-CONV-CONSUMER-001`;AC-FUNC-004 |
| PH-06 | Trace / review / handoff 追溯交接 | 建立 review anchor、trace handoff、archive handoff、handoff retry / failed 和 safe diagnostic | PH-05 | review anchor command、trace / archive handoff record、fake handoff adapter、handoff delivery job seed | `TC-CONV-TRACE-001`;`TC-CONV-HANDOFF-*`;`EV-CONV-HANDOFF-001`;AC-FUNC-005 |
| PH-07 | Outbox publish / operations jobs / maintenance | 完成 outbox publish、projection rebuild、search rebuild、snapshot refresh、cursor maintenance、consistency validation 和 cleanup | PH-06 | outbox relay、publisher fake、operations jobs、projection / cursor / consistency reports、audit / tap output | `TC-CONV-OUTBOX-*`;`TC-CONV-DERIVED-*`;`TC-CONV-CONSISTENCY-001`;`EV-CONV-OUTBOX-001`;`EV-CONV-DERIVED-001`;AC-FUNC-008 |
| PH-08 | Release gate / reports / acceptance handoff | 执行 P0 / P0-supporting 阻断 suite，生成 fixed run artifacts、reports、acceptance handoff 和 veto checklist | PH-07 | release gate、report generation、evidence index、redaction check、acceptance handoff、risk acceptance / open issues | `TC-CONV-REPORT-001`;`TC-CONV-REDACTION-001`;`EV-CONV-GATE-001`;`EV-CONV-ACCEPT-001`;AC-EVID-*;VETO-CONV-* |

### 7.3 阶段顺序理由

| 顺序 | 理由 |
|---|---|
| PH-01 先行 | 没有目标仓、workspace、dependency、config 和证据骨架，任何代码阶段都不可验证 |
| PH-02 早于 PH-03 | fact 必须归属于明确 space / participant scope / visibility scope |
| PH-03 早于 PH-04 | authorized query、projection、search 和 cursor 需要已提交 fact、receipt 和 outbox intent |
| PH-04 早于 PH-05 | manifestation 和 inbound consumer 必须立即通过授权消费、stale marker 和 refs-only query 验证 |
| PH-05 早于 PH-06 | review / handoff 需要覆盖本仓 fact 与跨域 manifestation 的追溯上下文 |
| PH-06 早于 PH-07 | outbox、projection、snapshot refresh 和 consistency validation 需要覆盖前面所有主要 truth flow |
| PH-08 最后 | release gate、reports、acceptance handoff 和 VETO 裁决必须基于全部 P0 evidence |

### 7.4 阶段可并行性判断

| 阶段 | 可并行部分 | 不可并行部分 | 结论 |
|---|---|---|---|
| PH-01 | README / script help / report template 可与 workspace 骨架并行 | `core-contracts` dependency 和 crate naming 必须统一后再推进 | 小范围并行 |
| PH-02~PH-07 | 单阶段内部可按 test / domain / service / adapter 协作 | 阶段之间的状态链路必须串行 | 阶段间不并行 |
| PH-04 | search refs test fixture、report template 可提前准备 | authorized query no-write 和 read model 依赖 PH-03 fact truth | 部分并行 |
| PH-07 | redaction checker 和 report skeleton 可从 PH-01 后增量补强 | outbox publish / operations jobs 依赖前置 truth flows | 部分并行 |
| PH-08 | 无 | 必须等待 PH-01~PH-07 证据齐全 | 不并行 |

### 7.5 按对象拆分风险检查

| 错误阶段写法 | 问题 | 替代表达 |
|---|---|---|
| 实现所有 DTO | 只能证明类型存在，不能证明业务闭环 | PH-02~PH-07 随纵切交付 DTO |
| 实现所有 domain 对象 | 缺少 repository、service、entry 和测试证据 | 按 space、fact、query、manifestation、handoff、operations 纵切交付 |
| 实现所有 repository | 没有业务用例驱动，容易过度抽象 | 在 PH-02 起随写路径、query、consumer 和 job 交付 |
| 实现所有 worker | worker 依赖 fact、manifestation、outbox 和 idempotency | PH-05 / PH-07 分别交付 inbound consumer 和 outbox / projection worker |
| 最后统一写测试和 reports | 阶段不可验，不符合验收标准 | 每个阶段绑定 TC / AC，PH-08 只做总收口 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §5。

````markdown
## 5. 实施阶段与依赖顺序

> 校准来源：
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“阶段依赖图”“阶段总表”“阶段顺序理由”“阶段可并行性判断”和“按对象拆分风险检查”小节，了解本轮为什么按可验证功能增量而不是按 crate / 对象排阶段。

#### 阶段依赖图: L1-conversation 实施阶段顺序

```text
[PH-01 仓初始化与证据骨架]
  | enables workspace, core dependency, config and scripts
  v
[PH-02 Space / scope truth 最小纵切]
  | creates conversation boundary and visibility baseline
  v
[PH-03 Fact append / transaction / idempotency 写路径]
  | creates append-only conversation facts and outbox intent
  v
[PH-04 Authorized query / projection / cursor 消费闭环]
  | proves authorized consumption and query no-write
  v
[PH-05 Manifestation / inbound consumer 跨域事实显化]
  | proves source truth isolation and ref-only ingestion
  v
[PH-06 Trace / review / handoff 追溯交接]
  | proves auditability and failure-safe handoff
  v
[PH-07 Outbox publish / operations jobs / maintenance]
  | proves rerun, projection rebuild and no-auto-repair
  v
[PH-08 Release gate / reports / acceptance handoff]
```

阶段必须按可验证功能增量推进。`contracts/domain/application/infra/api/worker/jobs` 是代码落点，不是阶段拆分依据。

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化与证据骨架 | 创建目标仓、workspace、core dependency、基础 config 和脚本证据骨架 | 无 | 目标仓、`crates/*`、`scripts/*`、`artifacts/test/<run_id>`、`reports/` | workspace 可编译；命名和路径检查通过 |
| PH-02 | Space / scope truth 最小纵切 | 建立 conversation boundary、participant scope 和 visibility baseline | PH-01 | Command DTO、space / scope domain、repository / UoW、minimal API、visibility guard | `TC-CONV-SPACE-*`;`TC-CONV-SCOPE-*`;AC-FUNC-001 |
| PH-03 | Fact append / transaction / idempotency 写路径 | 打通 append-only fact、receipt、trace、idempotency 和 outbox enqueue | PH-02 | fact domain、append / retract service、idempotency、transaction rollback、outbox intent | `TC-CONV-FACT-*`;`TC-CONV-TX-001`;AC-FUNC-002 |
| PH-04 | Authorized query / projection / cursor 消费闭环 | 建立 authorized read、query no-write、search refs 和 cursor monotonic | PH-03 | Query DTO、read model、projection state、search refs、cursor、query handlers | `TC-CONV-QUERY-*`;`TC-CONV-SEARCH-001`;`TC-CONV-CURSOR-001` |
| PH-05 | Manifestation / inbound consumer 跨域事实显化 | 承接 external fact、safe snapshot、source resolver、consumer 和 quarantine | PH-04 | manifestation domain、resolver port、source consumer fixture、runtime / bridge / source event handlers | `TC-CONV-MAN-*`;`TC-CONV-CONSUMER-*`;AC-FUNC-004 |
| PH-06 | Trace / review / handoff 追溯交接 | 建立 review anchor、trace / archive handoff 和 failure-safe handoff | PH-05 | review anchor、trace / archive handoff record、fake handoff adapter、handoff delivery seed | `TC-CONV-TRACE-001`;`TC-CONV-HANDOFF-*`;AC-FUNC-005 |
| PH-07 | Outbox publish / operations jobs / maintenance | 完成 outbox publish、projection rebuild、snapshot refresh、cursor maintenance 和 consistency validation | PH-06 | outbox relay、publisher fake、operations jobs、projection / cursor / consistency reports | `TC-CONV-OUTBOX-*`;`TC-CONV-DERIVED-*`;AC-FUNC-006~008 |
| PH-08 | Release gate / reports / acceptance handoff | 生成固定 run 的送验证据 | PH-07 | release gate、reports、evidence index、redaction check、acceptance handoff、veto checklist | `TC-CONV-REPORT-001`;`TC-CONV-REDACTION-001`;AC-EVID-*;VETO-CONV-* |
````

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| PH-04 是否应该晚于 manifestation | 当前放在 manifestation 前 | 影响后续能力是否有授权消费验证 | 推荐保持 PH-04 在 PH-05 前 |
| PH-07 是否可以提前 | report / redaction 脚本可提前，operations 主体验证不宜提前 | 影响 outbox 和 projection 能否覆盖完整 truth flows | 推荐 PH-07 主体放在 PH-06 后 |
| production adapter 是否设独立阶段 | 当前非 P0 | 若纳入会扩大范围 | 不设阶段，只列 P1 / P2 风险 |

建议方案: 接受 PH-01~PH-08 的阶段顺序。原因是该顺序以最小可验证 Conversation truth center 闭环为主线，能前置仓库、依赖、授权、redaction 和证据风险，同时避免按 crate 或对象拆阶段。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 阶段依赖图已输出 | 已满足 |
| 阶段总表已覆盖 Step 4 的核心交付物 | 已满足 |
| 每个阶段都有实施目标、依赖阶段、核心交付物和阶段门禁 | 已满足 |
| 阶段顺序已经说明为什么不能按对象、crate 或文件裸拆 | 已满足 |
| 最小可测试纵切已明确 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

Step 5 可以进入 Step 6。Step 6 应继续拆分每个阶段的任务、编写顺序、代码批次、提交边界和开工前设计闭环复核。
