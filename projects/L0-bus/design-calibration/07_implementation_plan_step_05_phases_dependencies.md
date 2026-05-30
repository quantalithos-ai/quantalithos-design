# L0-bus 07 实施计划 Step 5: 实施阶段与依赖顺序

> 本文件是 `projects/L0-bus/07-实施计划.md` 的 Step 5 中间产物。
> 本步把 Step 4 的交付物组织成按依赖推进的阶段化可验证功能增量。
> 本步只定义阶段顺序和阶段级门禁,不拆分阶段任务、编写顺序或 commit boundary。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 5 |
| 主题 | 设计实施阶段与依赖顺序 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §5 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 提取交付物、非交付物、跨仓依赖和交付物边界 |
| `03-详细设计.md` §4~§15 | 已完成 | 提取 crate 依赖、协议依赖、状态依赖、事务依赖和测试切口 |
| `04-配置设计.md` §3~§12 | 已完成 | 提取 config / runtime graph 在实施阶段中的位置 |
| `05-测试方案.md` §4~§14 | 已完成 | 提取测试分层、TS / TC / EV、gate、report 和 artifact 门禁 |
| `06-验收标准.md` §5~§14 | 已完成 | 提取 AC / VETO 对阶段顺序的约束 |

---

## 3. SOP 问题回答

### 3.1 最小可运行或可测试的纵切是什么?

最小可运行纵切不是完整 bus,而是“目标仓可编译 + `core-contracts` path dependency + publication acceptance 最小写路径 + 固定 run evidence”。因此阶段顺序必须先建立 workspace、依赖、配置和证据骨架,再打通 publication acceptance,然后逐步扩展 semantic、delivery、feedback、recovery、read output 和最终送验。

### 3.2 哪些阶段必须先于其他阶段?

仓初始化和证据骨架必须先于任何业务纵切。Publication acceptance 必须先于 delivery 和 outbox relay,因为 delivery、feedback、retry、projection 都需要 accepted / rejected publication 或 delivery record 作为上游事实。Delivery 默认路径必须先于 feedback 和 recovery,因为 feedback、timeout、retry、DLQ 都依赖 delivery lifecycle。Read output 和最终报告必须在主要写路径后收口,因为它们需要聚合 publication、delivery、feedback、recovery 和 audit material。

### 3.3 哪些风险或跨仓依赖需要前置?

需要前置的风险包括目标仓不存在、`core-contracts` path dependency、crate 命名、artifact / report 路径、P0 fake / in-memory 后端、production adapter 膨胀风险、forbidden body / raw secret redaction。真实 MQ / DB / SDK / governance / observability 不前置为 P0 服务依赖,只以前置 port、fake、fixture 和 boundary test 表达。

### 3.4 每个阶段完成后能验证什么?

每个阶段都必须能验证一组稳定能力:PH-01 验证仓和证据骨架;PH-02 验证 publication acceptance;PH-03 验证 semantic 和 delivery 默认路径;PH-04 验证 outbox relay 和 inbound source 幂等;PH-05 验证 feedback、timeout 和幂等锚点;PH-06 验证 retry、DLQ 和 replay preparation;PH-07 验证 read output、audit、tap、projection 和 outbound events;PH-08 验证 release gate、reports、acceptance handoff 和 VETO 清单。

### 3.5 是否存在按对象拆分而不可验证的阶段?

存在风险。例如“实现所有 domain 对象”“实现所有 repository”“实现所有 DTO”都不可作为阶段,因为它们无法独立证明业务闭环。正确做法是让每个阶段穿过 contracts、domain、application、infra、入口和测试的一条纵切,同时在阶段表中列出涉及的 crate。

### 3.6 哪些阶段可以并行,哪些不能并行?

PH-01 必须串行先完成。PH-02~PH-06 依赖核心状态链路,原则上串行推进。PH-07 的 read output / report projection 需要等主要写路径稳定后完成,但其中 redaction check、report template 和 artifact index 脚本可以在 PH-01 之后持续增量完善。PH-08 必须最后执行,因为它依赖所有 P0 / P0-min 用例和证据完整性。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 交付物清单尚未排序 | Step 4 只说明交付什么 | 实施者不知道先做哪个能力 | 本步按状态和依赖链组织阶段 |
| crate 依赖易误当阶段 | `contracts/domain/application/infra` 边界清楚 | 可能按模块分工,但每阶段不可验 | 阶段按可验证纵切命名,crate 只是落点 |
| P0-min 支撑边界容易后置 | Outbox relay 和 backend default path 是支撑能力 | P0 主闭环可能最后才发现不可验 | 分别放入 PH-03 / PH-04 前中段 |
| 证据和报告容易最后补 | `05` / `06` 强制 artifacts 和 reports | 最后验收时证据缺失 | PH-01 建骨架,PH-08 收口 |
| production adapter 诱导膨胀 | 真实 MQ / DB 很容易被提前做 | 阶段变大且不可稳定验收 | 阶段只要求 fake / in-memory path |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 阶段组织 | 只有交付物列表 | 形成 PH-01~PH-08 阶段依赖顺序 | 实施者知道按什么顺序推进 |
| 最小闭环 | 尚未定义 | 明确先仓骨架,再 publication acceptance,再 delivery / feedback / recovery | 避免一次性铺开全部对象 |
| P0-min | 只是交付物之一 | backend default path 和 outbox relay 被放到主链前中段 | 保证主闭环可验 |
| 证据门禁 | 只列交付物 | 阶段从 PH-01 开始绑定 artifact / report,PH-08 收口 | 防止测试证据后补 |
| 并行性 | 未说明 | 明确核心状态链路串行,脚本模板可增量并行 | 降低实现冲突 |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按 crate 阶段推进 | 目录清晰,便于分工 | 完成一个 crate 不等于完成可验能力 | 不采用 |
| 按 P0 功能纵切推进 | 每阶段可测试、可验收 | 同一阶段会跨多个 crate | 采用 |
| 先完整实现 infra 再做业务 | 底层能力完整 | 可能提前做生产 adapter,并延迟主闭环验证 | 不采用 |
| 先 fake / in-memory 闭环,后续替换 adapter | 快速形成可验 P0 | 生产 adapter 风险后置 | 采用 |
| 最后统一补报告和证据 | 实现阶段更短 | 不满足验收标准,容易补不齐 | 不采用 |
| PH-01 建证据骨架,PH-08 统一收口 | 证据链从一开始可见 | 初始阶段需要多做脚本骨架 | 采用 |

---

## 7. 结构化中间产物

### 7.1 阶段依赖图: L0-bus 实施阶段顺序

```text
[PH-01 仓初始化与证据骨架]
  | enables
  v
[PH-02 Publication acceptance 最小写路径]
  | creates accepted/rejected bus fact
  v
[PH-03 Transport semantic 与 delivery 默认路径]
  | creates delivery lifecycle baseline
  v
[PH-04 Outbox relay 与 inbound source 幂等]
  | proves committed fact ingestion
  v
[PH-05 Feedback / timeout / idempotency 闭环]
  | creates stable result and history
  v
[PH-06 Retry / DLQ / replay preparation 恢复链]
  | creates controlled recovery material
  v
[PH-07 Read output / audit / tap / outbound events]
  | creates consumable views and evidence
  v
[PH-08 Release gate / reports / acceptance handoff]
```

关键说明:

- 图表达阶段依赖顺序,不表达完整函数调用链。
- 阶段按可验证功能增量组织,不是按 crate、对象或文件组织。
- `scripts`、`artifacts`、`reports` 在 PH-01 建骨架,在 PH-08 形成完整送验材料。
- 真实 production adapter 不在阶段主链中,只作为 P1 / P2 风险或后续专项。

### 7.2 阶段总表

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化与证据骨架 | 创建目标仓、workspace、core dependency、基础 config、gate / report / check 脚本骨架 | 无 | `/home/aris/Projects/quantalithos-bus`、`crates/*`、`core-contracts` path、`scripts/*`、`artifacts/test/<run_id>`、`reports/` | workspace 可编译;路径和命名检查通过;脚本支持 required args;无 `latest` 正式引用 |
| PH-02 | Publication acceptance 最小写路径 | 打通 command / fixture 到 accepted / rejected publication fact 的最小写事务 | PH-01 | Command DTO、publication domain、repository / UoW、minimal API handler、audit、idempotency 初始能力 | `TC-BUS-PUB-001`~`004`;AC-FUNC-001;AC-RED-001 / 002;payload body redaction clean |
| PH-03 | Transport semantic 与 delivery 默认路径 | 基于 accepted material 和 fake backend capability 形成 transport semantic,推进 delivery 默认路径 | PH-02 | semantic policy、delivery lifecycle、in-memory backend、delivery job runner、backend capability fake | `TC-BUS-SEM-*`;`TC-BUS-DLV-*`;`TC-BUS-BND-*`;AC-FUNC-002 / 003 / 008 |
| PH-04 | Outbox relay 与 inbound source 幂等 | 承接 committed outbox fact,证明 source ack failure / duplicate 不重复生成 bus truth | PH-03 | `OutboxFactSourcePort`、fixture source、outbox relay consumer / job、source idempotency | `TC-BUS-OBX-*`;AC-FUNC-007;AC-IF-003;AC-TX-002;AC-IDEM-002 |
| PH-05 | Feedback / timeout / idempotency 闭环 | 打通 feedback command、backend signal、timeout signal,形成 result、history 和 idempotency anchor | PH-03 / PH-04 | feedback DTO、feedback service、backend signal consumer、timeout consumer、history append、conflict handling | `TC-BUS-FDB-*`;AC-FUNC-004;AC-IDEM-001;AC-CONC-002 |
| PH-06 | Retry / DLQ / replay preparation 恢复链 | 在 failed / timed out delivery 基础上生成 retry plan、dead-letter material 和 replay preparation | PH-05 | retry command、DLQ command、replay command、recovery policy、approval / audit chain guard | `TC-BUS-REC-*`;AC-FUNC-005;AC-RED-007;AC-STATE-004 |
| PH-07 | Read output / audit / tap / outbound events | 形成 transport view、failure summary、audit trail、tap output、outbound event payload 和 projection freshness marker | PH-06 | Query API、projection store、audit material、tap output、publisher sink、redaction check | `TC-BUS-OUT-*`;AC-FUNC-006;AC-IF-002 / 004 / 009;AC-NFR-002 / 005 / 008 |
| PH-08 | Release gate / reports / acceptance handoff | 执行 P0 / P0-min 阻断 suite,生成 fixed run artifacts、reports 和 acceptance handoff | PH-07 | release gate、report generation、acceptance index、veto checklist、risk acceptance handoff | `TC-BUS-RED-*`;AC-FUNC-010;AC-EVID-*;VETO-BUS-* 全量可判定 |

### 7.3 阶段顺序理由

| 顺序 | 理由 |
|---|---|
| PH-01 先行 | 没有目标仓、workspace、dependency、config 和证据骨架,任何代码阶段都不可验证 |
| PH-02 早于 PH-03 | delivery 必须基于 publication acceptance 的合法材料和 bus fact |
| PH-03 早于 PH-05 / PH-06 | feedback、timeout、retry、DLQ 都需要 delivery record 和 delivery lifecycle |
| PH-04 放在 PH-03 后 | outbox relay 需要 publication acceptance 能力,同时也需要基本 delivery / backend fake 环境用于端到端验证 |
| PH-05 放在 PH-04 后 | feedback 闭环需要已稳定的 delivery、source 幂等和基础 idempotency 语义 |
| PH-06 放在 PH-05 后 | recovery 只对 failed / timed out / eligible delivery 有意义 |
| PH-07 放在 PH-06 后 | read output、failure material、audit 和 outbound events 需要覆盖前面所有状态事实 |
| PH-08 最后 | release gate 和 acceptance handoff 必须基于全部 P0 / P0-min 用例和证据 |

### 7.4 阶段可并行性判断

| 阶段 | 可并行部分 | 不可并行部分 | 结论 |
|---|---|---|---|
| PH-01 | README / script help / report template 可与 workspace 骨架并行 | `core-contracts` dependency 和 crate naming 必须统一后再推进 | 小范围并行 |
| PH-02~PH-06 | 单阶段内部可按 test / domain / service / adapter 协作 | 阶段之间的状态链路必须串行 | 阶段间不并行 |
| PH-07 | report template、redaction checker 可从 PH-01 后持续补强 | Query / projection / outbound event 依赖前置 truth flows | 部分并行 |
| PH-08 | 无 | 必须等待 PH-01~PH-07 证据齐全 | 不并行 |

### 7.5 按对象拆分风险检查

| 错误阶段写法 | 问题 | 替代表达 |
|---|---|---|
| 实现所有 DTO | 只能证明类型存在,不能证明业务闭环 | PH-02 / PH-03 / PH-05 随纵切交付 DTO |
| 实现所有 domain 对象 | 缺少 repository、service、entry 和测试证据 | 按 publication、delivery、feedback、recovery 纵切交付 |
| 实现所有 repository | 没有业务用例驱动,容易过度抽象 | 在 PH-02 起随写路径交付 repository / UoW |
| 实现所有 worker | worker 依赖 publication、delivery 和 idempotency | PH-04 起交付 outbox / backend / timeout consumer |
| 最后统一写测试 | 阶段不可验,不符合验收标准 | 每个阶段绑定 TC / AC,PH-08 只做总收口 |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §5。

```markdown
## 5. 实施阶段与依赖顺序

> 校准来源：
> - `design-calibration/07_implementation_plan_step_05_phases_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“阶段依赖图”“阶段总表”“阶段顺序理由”“阶段可并行性判断”和“按对象拆分风险检查”小节，了解本轮为什么按可验证功能增量而不是按 crate / 对象排阶段。

#### 阶段依赖图: L0-bus 实施阶段顺序

```text
[PH-01 仓初始化与证据骨架]
  | enables
  v
[PH-02 Publication acceptance 最小写路径]
  | creates accepted/rejected bus fact
  v
[PH-03 Transport semantic 与 delivery 默认路径]
  | creates delivery lifecycle baseline
  v
[PH-04 Outbox relay 与 inbound source 幂等]
  | proves committed fact ingestion
  v
[PH-05 Feedback / timeout / idempotency 闭环]
  | creates stable result and history
  v
[PH-06 Retry / DLQ / replay preparation 恢复链]
  | creates controlled recovery material
  v
[PH-07 Read output / audit / tap / outbound events]
  | creates consumable views and evidence
  v
[PH-08 Release gate / reports / acceptance handoff]
```

阶段必须按可验证功能增量推进。`contracts/domain/application/infra/api/worker/jobs` 是代码落点,不是阶段拆分依据。

| 阶段编号 | 阶段名称 | 实施目标 | 依赖阶段 | 核心交付物 | 阶段门禁 |
|---|---|---|---|---|---|
| PH-01 | 仓初始化与证据骨架 | 创建目标仓、workspace、core dependency、基础 config 和脚本证据骨架 | 无 | 目标仓、`crates/*`、`scripts/*`、`artifacts/test/<run_id>`、`reports/` | workspace 可编译;命名和路径检查通过 |
| PH-02 | Publication acceptance 最小写路径 | 打通 accepted / rejected publication fact | PH-01 | Command DTO、publication domain、repository / UoW、minimal API、audit、idempotency 初始能力 | `TC-BUS-PUB-*`;AC-FUNC-001;AC-RED-001 / 002 |
| PH-03 | Transport semantic 与 delivery 默认路径 | 形成 transport semantic 并推进 delivery 默认路径 | PH-02 | semantic policy、delivery lifecycle、fake backend、delivery job | `TC-BUS-SEM-*`;`TC-BUS-DLV-*`;`TC-BUS-BND-*` |
| PH-04 | Outbox relay 与 inbound source 幂等 | 承接 committed outbox fact 并验证 source 幂等 | PH-03 | outbox source port、fixture source、relay consumer / job、source idempotency | `TC-BUS-OBX-*`;AC-FUNC-007 |
| PH-05 | Feedback / timeout / idempotency 闭环 | 形成 feedback result、history 和 idempotency anchor | PH-03 / PH-04 | feedback service、backend signal、timeout signal、conflict handling | `TC-BUS-FDB-*`;AC-FUNC-004 |
| PH-06 | Retry / DLQ / replay preparation 恢复链 | 生成 retry plan、dead-letter material 和 replay preparation | PH-05 | recovery command、DLQ command、replay command、policy guard | `TC-BUS-REC-*`;AC-FUNC-005 |
| PH-07 | Read output / audit / tap / outbound events | 形成 view、failure summary、audit trail、tap 和 outbound event | PH-06 | Query API、projection、audit、publisher sink、redaction check | `TC-BUS-OUT-*`;AC-FUNC-006 |
| PH-08 | Release gate / reports / acceptance handoff | 生成固定 run 的送验证据 | PH-07 | release gate、reports、acceptance index、veto checklist | `TC-BUS-RED-*`;AC-FUNC-010;AC-EVID-*;VETO-BUS-* |
```

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| PH-04 与 PH-05 是否可交换 | 可以局部交换,但 PH-04 更早暴露 source ack / duplicate 风险 | 影响 outbox relay 风险前置程度 | 推荐保持 PH-04 在 PH-05 前 |
| PH-07 是否可以提前 | report template 和 redaction checker 可提前,但 Query / projection / outbound event 不宜提前 | 影响只读输出能否覆盖完整状态事实 | 推荐阶段主体验证放在 PH-07,脚本模板可在 PH-01 后增量完善 |
| production adapter 是否设独立阶段 | 当前非 P0 | 若纳入会扩大范围 | 不设阶段,只列 P1 / P2 风险 |

建议方案: 接受 PH-01~PH-08 的阶段顺序。原因是该顺序以最小可验证主闭环为主线,能前置仓库、依赖、P0-min 和证据风险,同时避免按 crate 或对象拆阶段。

---

## 10. 进入下一步条件

- 阶段依赖图已输出。
- 阶段总表已覆盖 Step 4 的核心交付物。
- 每个阶段都有实施目标、依赖阶段、核心交付物和阶段门禁。
- 阶段顺序已经说明为什么不能按对象、crate 或文件裸拆。
- 可以进入 Step 6,继续拆分阶段任务、编写顺序与提交边界。
