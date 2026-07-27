# L3-capability-hub 06 验收标准 Step 15：整理正式验收标准文档

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 15
> 书写规范：`standards/document/验收标准书写规范.md` §3、§5.15、§6
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 回填文件：`projects/L3-capability-hub/06-验收标准.md`
> 当前模式：full-restart / continuous execution
> 日期：2026-07-26

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 15 整理正式验收标准文档 |
| 当前状态 | completed；正式文件已装配并通过静态审计 |
| 上游输入 | `06_acceptance_step_01` 至 `06_acceptance_step_14` 均已完成 |
| 旧正式 `06` | `historical_material`；不作为 active authority |
| 正式文件修改 | 已整体替换旧 historical formal 06；不再对旧文件增量修补 |
| unresolved upstream blocker | `0` |
| 真实执行事实 | implementation、run、artifact、report、evidence instance、defect、review、risk acceptance、verdict、signoff 均不存在 |
| 下一动作 | 初始化 `07_implementation_plan_calibration_flow.md`，不声称任何实现执行事实 |

## 2. 本步输入

### 2.1 权威输入顺序

```text
formal 00 requirement / AC / VF / responsibility
  -> formal 01 architecture / ownership / dependency
  -> formal 02 HLD / components / object and flow grouping
  -> formal 03 DDD / exact types / protocols / states / TX / observation
  -> formal 04 configuration / profiles / bindings / failure behavior
  -> formal 05 test / TC-DS-EV contracts / suites / gates / checks
  -> acceptance Steps 1~14 / decision contract
  -> formal 06 acceptance standard
```

正式 `06` 不得反向修改上游真相；如果装配审计发现上游计数、名称或责任冲突，必须回开 owning Step，而不是在本文件改写。

### 2.2 Step 文件输入矩阵

| 正式章节 | 主要校准来源 | 装配用途 |
|---|---|---|
| §1 | `06_acceptance_step_01_input_boundary.md` | authority、输入边界、历史材料隔离 |
| §2 | `06_acceptance_step_02_scope.md` | P0/P1/P2、核心与外围、非范围 |
| §3 | `06_acceptance_step_03_baseline.md` | immutable baseline、固定根路径、分母 |
| §4 | `06_acceptance_step_04_entry_exit.md` | entry、exit、pause、not-evaluable |
| §5 | `06_acceptance_step_05_function_gate.md` | 5 core、16 FR、外围隔离 |
| §6 | `06_acceptance_step_06_data_arch_redlines.md` | owner、数据分类、架构红线 |
| §7 | `06_acceptance_step_07_interfaces_events_sync.md` | 83 protocols、跨仓接缝、同步 |
| §8 | `06_acceptance_step_08_state_tx_consistency.md` | 24/111/638、TX、幂等、一致性 |
| §9 | `06_acceptance_step_09_nonfunctional.md` | 20 NFR、5 quality AC、numeric boundary |
| §10 | `06_acceptance_step_10_observability_evidence.md` | observation、189 EV contract、证据完整性 |
| §11 | `06_acceptance_step_11_veto.md` | 13 VF VETO、过程 VETO |
| §12 | `06_acceptance_step_12_defects_retest_release.md` | S/A/B/R、复验、release gate |
| §13 | `06_acceptance_step_13_risk_acceptance.md` | residual 资格、不可接受项、记录字段 |
| §14 | `06_acceptance_step_14_final_decision_signoff.md` | 三值结论、层级准入、签署责任 |
| §15 | 本文件、Step 1~14、规范 | 来源目录、总审计、下游承接 |

## 3. SOP 问题回答

| 问题 | 收口答案 |
|---|---|
| 正式文档是否使用规范主链？ | 是。严格使用 15 章固定名称，不把 Step 过程问题、诊断或停审记录带入正文。 |
| 每个 P0 门禁是否有三元裁决？ | 是。功能、边界、接口、状态、NFR 和证据门禁均保留正式设计来源、TC/DS/EV selector、固定 raw/report 入口、通过条件和失败条件。 |
| 37 个 AC 是否全部覆盖？ | 是。`AC-CH-001..037` 均在 §5~§10 有 primary 或 secondary consumer，孤儿数为 `0`。正式 00 仍是 AC identity authority。 |
| 13 个 VF 是否全部成为不可放宽红线？ | 是。`VF-CH-001..013` 一对一映射至 `VETO-CH-001..013`；另有过程真实性 VETO `VETO-CH-P-001..010`。 |
| 189 EV 是否已经存在？ | 否。189 是 `TC/DS/EV` contract denominator；真实执行时才产生 `(run_id, EV-CH-*)` instance。正式文档不得写成已有 evidence instance。 |
| 638 state pair 是否逐一可裁决？ | 是。正式文档固定全量分母和 `239 current + 98 reserved + 301 illegal` 分类；不得用采样或 generic state 替代。 |
| 是否填写真实结果、run 或签署？ | 否。只写未来字段和条件；当前状态保持 `not_entered` / `not_decided`，不伪造任何执行事实。 |
| 是否恢复旧对象、旧拓扑或旧阈值？ | 否。旧 `MCPServer`、`ProviderContract`、`CapabilityDecision`、cost、approval、runtime execution、P95/30s/99.9% 等只在历史处置中出现，不进入 active gate。 |

## 4. 当前正式文档问题诊断

| 旧材料问题 | 影响 | Step 15 处置 |
|---|---|---|
| 旧 `06` 不是 15 章结构 | 无法审计章节来源和裁决链 | 删除旧文件后整体重建 |
| 旧验收主语绑定 provider、allowlist、cost、approval 或 runtime | 越界且与 00~05 truth owner 冲突 | 不迁移、不改名、不建立 alias |
| 旧环境和拓扑写成既定事实 | 可能伪造产品、数据库、总线和 secret readiness | 只保留 future baseline prerequisite |
| 旧数字阈值无 workload、run 或 owner | 不能形成可判定门禁 | 结构门禁保留；numeric 状态为 `not_evaluated` |
| 旧证据用 API/DB/log/人工 review 标签 | 缺少 canonical contract 和 provenance | 使用 `TC-CH-*`、`DS-CH-*`、`EV-CH-*` 与固定根路径 |
| 旧风险 / 签署空白 | 空白不能表示通过或接受 | 只保留字段合同，实例为空 |

## 5. 改动前后对比

| 维度 | 改动前 | 装配后 |
|---|---|---|
| 章节 | 旧结构、旧主线 | 规范 15 章，固定来源块 |
| 核心主语 | provider / decision / cost / runtime | identity / registry / descriptor / seam / relation / exposure |
| 验收项 | 泛化功能描述 | 37 个正式 AC 与 design/test/evidence 闭环 |
| 状态分母 | 历史或不完整 | 24 families、111 variants、638 pairs，239/98/301 |
| 测试证据 | 执行结果与合同混用 | 189 contract 与未来 run-scoped instance 分离 |
| 结论 | 空白或模糊 | `通过` / `有条件通过` / `不通过`；内部暂停独立表达 |
| 风险 | 未授权或泛化接受 | 只允许 future eligible residual，当前 accepted 为 `0` |

## 6. 装配取舍

| 议题 | 选择 | 原因 |
|---|---|---|
| 正式章节是否复制所有 189 case | 否 | `05` 是 test contract authority；`06` 用精确 selector 和分母消费，避免双重真相源。 |
| 是否为验收另造 AC | 否 | formal `AC-CH-001..037` 由 00 拥有；Step-local gate 只作为解释性分组。 |
| 是否把 `EV-CH-*` 写成 evidence alias | 否 | contract、candidate、instance 和 verdict 必须分层，防止伪造证据。 |
| 是否允许 VETO 或 P0 A 风险接受 | 否 | Step 11/13 已锁定不可接受矩阵。 |
| 是否允许 selected / release 替代 P0 | 否 | R0/R1/R2/R3/R4 分层；release smoke 和 P1 不补偿 P0。 |
| 是否保留旧文件局部内容 | 否 | full-restart 要求整体替换，旧内容只能留在校准诊断。 |

## 7. 结构化中间产物

### 7.1 15 章来源映射

正式正文每章开头必须出现具体 `design-calibration/06_acceptance_step_*.md` 来源块，并引导读者阅读该文件的“结构化中间产物”“回填草稿”“待确认事项”。来源映射见 §2.2，正式 §15 再列完整路径目录。

### 7.2 Active inventory audit

| Inventory axis | Expected | Formal source | Acceptance assembly result |
|---|---:|---|---|
| core closures | 5 | `00` / Step 2 / Step 5 | 5/5 |
| FR | 16 | `00` / Step 5 | 16/16 |
| BR | 37 | `00` / Step 6/7/8 | 37/37 |
| NFR | 20 | `00` / Step 9 | 20/20 |
| AC | 37 | `00` / Steps 5~10 | 37/37; orphan=0 |
| VF | 13 | `00` / Step 11 | 13/13; waivable=0 |
| protocols/flows | 250 protocols / 83 flows | `03` / Step 7 | 83/83 flow families, exact names retained |
| Ports | 36 | `03` / Step 7 | 36/36 |
| repository traits/methods | 22 / 110 | `03` / Step 8 | 22/110 |
| state | 24 / 111 / 638 | `03` / Step 8 | `239/98/301`, gap=0 |
| config | 18 / 27 / 21 | `04` / Steps 3~9 | 18/27/21 |
| profiles/entries | 3 / 3 | `04` | 3/3 |
| bindings | 9 / 6 / 10 | `04` | 9/6/10 |
| test contracts | 189 TC / 189 DS / 189 EV | `05` | 189/189/189; contracts only |
| primary suites/gates/checks/builders | 10 / 5 / 9 / 4 | `05` | exact |

### 7.3 Cross-gate closure audit

| Audit | Result | Formal treatment |
|---|---|---|
| AC -> design contract | `37/37` | §5~§9 primary/secondary tables and source references |
| AC -> TC/DS/EV contract | `37/37` | selectors remain parameterized but exact family/ordinal is fixed |
| EV -> raw/report root | `189/189` contract rows | `artifacts/test/<run_id>` and `reports/runs/<run_id>` only |
| state pair denominator | `638/638` | no sampling; future raw must prove full registry |
| VETO coverage | `13/13 + 10 process` | §11; no risk override |
| evidence integrity | complete predicate defined | §10; no static, orphan, cross-run or digest mismatch |
| defect/retest | distinct failed/retest run | §12; immutable failed material retained |
| risk acceptance | `accepted=0` design-time | §13; only real authorized record can enable conditional conclusion |
| final decision/signoff | schema only | §14; no actual verdict/signoff |

### 7.4 Fixed evidence roots

```text
raw authority       = artifacts/test/<run_id>/
run reports         = reports/runs/<run_id>/
acceptance handoff  = reports/acceptance/
review provenance   = reports/review/
```

`<run_id>` 是未来显式实例占位，不是当前 run。禁止 `latest`、项目名二级嵌套、跨 run 拼接、静态 passed JSON、手工 status 覆盖 raw-derived status。

### 7.5 Final decision contract

```text
P0 gate results + evidence integrity
  -> VETO / S / current P0-A hard stop
  -> eligible residual + authorized risk record
  -> selected / release readiness (separate)
  -> final three-value conclusion + role signoff
```

缺 baseline、run、raw/report、review provenance 或设计 oracle时，内部只能为 `paused` / `not_decided`；不得把设计期 `pass-designed` 写成总体通过。

## 8. Formal 06 回填草稿与章节装配规则

正式文档按以下顺序分批写入：

1. 元信息与 §1~§4：声明 authority、scope、baseline 和 entry/exit。
2. §5~§8：写入功能、数据红线、接口同步、状态/TX 门禁。
3. §9~§11：写入 NFR、证据、VETO。
4. §12~§14：写入缺陷、风险、最终结论和签署字段。
5. §15：写入来源目录、标准、下游承接和装配审计入口。

每一章正文只写收口结论，不写 SOP 问题、历史诊断、候选方案、未确认讨论或真实执行记录。每个表格至少保留：验收项/主题、正式设计契约、TC/DS/EV selector 或固定证据入口、通过条件、失败条件、结论影响。

## 9. 正式文档装配审计清单

| 检查项 | 目标 | 状态 |
|---|---|---|
| 15 章完整且标题固定 | 15/15 | ready |
| 每章具体校准来源 | 15/15 | ready |
| AC coverage | 37/37，orphan=0 | ready |
| VF coverage | 13/13，waivable=0 | ready |
| TC/DS/EV contract denominator | 189/189/189 | ready |
| state pairs | 638，239/98/301 | ready |
| suites/gates/checks/builders | 10/5/9/4 | ready |
| fixed roots | 4 类根路径 | ready |
| VETO / evidence / risk / signoff chain | closed by Steps 10~14 | ready |
| real execution facts | 0 fabricated | ready |
| unresolved upstream blocker | 0 | ready |

## 10. 回填前后边界

### 10.1 正式文档允许承载

- 可判定验收条件、失败条件和结论影响。
- 正式 00~05 的名称、状态、字段、协议、分母和责任边界。
- 未来 evidence/report/acceptance 文件的固定路径合同。
- 风险接受、签署和最终结论的字段与资格规则。

### 10.2 正式文档禁止承载

- 真实 commit、run、artifact、digest、defect、review、acceptor、signature 或测试结果。
- 详细测试步骤的第二份 authority。
- 实施 phase、代码任务或 boundary；这些由 `07` 承接。
- runtime/tools execution、governance approval truth、method body、marketplace listing/transaction、provider route/quota/cost、SDK client/cache 或 observability backend truth。

## 11. 待确认事项

| 事项 | 当前状态 | 处理 |
|---|---|---|
| delivery/source/config/environment baseline | 未建立 | 由 `07` 和真实送验流程提供，不在 06 猜测 |
| explicit run and evidence instances | 不存在 | 真实执行时由 `05` contract 生成 |
| numeric performance/SLO thresholds | 无 active source | 保持 `not_evaluated`，受控重开后才可新增 |
| selected product scope | 未选择 | 由 immutable manifest 决定 P1/R3 适用性 |
| risk acceptance | `accepted=0` | 只有真实授权记录可改变 |
| role signoff | 未发生 | §14 仅定义字段和责任域 |

## 12. Step 15 完成门禁

| 条件 | 结果 |
|---|---|
| 15 章主链及来源映射完成 | `pass-designed` |
| Step 5~11 P0 gate/evidence/VETO 已停审 | `pass-designed` |
| 37 AC / 13 VF 无孤儿 | `37/37; 13/13` |
| 189 TC/DS/EV、638 pairs、10/5/9/4 一致 | `pass-designed` |
| 固定 evidence roots 无非法引用 | `pass-designed` |
| 真实执行事实未伪造 | `0` |
| unresolved upstream blocker | `0` |
| 正式文档可作为 `07` 输入 | `yes; active formal 06 assembled` |

## 13. 装配完成后的恢复点

```text
document = 06-验收标准.md
flow = completed
current_step = 15_completed
formal_06_authority = active
acceptance_verdict = not_entered
accepted_risk_count = 0
unresolved_upstream_blocker = none
next_allowed_action = initialize_07_implementation_plan
commit_required = no
```
