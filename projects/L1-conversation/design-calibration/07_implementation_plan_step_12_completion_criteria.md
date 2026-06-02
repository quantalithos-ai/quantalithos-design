# L1-conversation 07 实施计划 Step 12: 实施完成判定

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` §12 实施完成判定
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 12 |
| 主题 | 定义实施完成判定 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_12_completion_criteria.md` |

本步定义 L1-conversation 实现完成后，什么时候可以宣称本轮实施完成，以及未完成项如何处理。本步不创建正式 `07-实施计划.md`，不替代验收标准，也不提前给出实现结果。

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_02_scope.md` | 已确认 | 继承 P0 / P0-supporting 范围、非范围和需求覆盖边界 |
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 继承实施对象、交付物、非交付物和跨仓依赖清单 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承阶段门禁、EV、artifact / report、redaction 和 VETO |
| `07_implementation_plan_step_09_spikes_risks.md` | 已确认 | 继承风险、blocker、待确认事项和风险接受边界 |
| `07_implementation_plan_step_10_rollback_change_control.md` | 已确认 | 继承暂停、变更、恢复和证据保留规则 |
| `07_implementation_plan_step_11_commit_review_delivery.md` | 已确认 | 继承提交、评审、交付和 acceptance handoff 规则 |
| `06-验收标准.md` §11~§14 | 已完成 | 作为 VETO、风险接受、最终结论和签署口径真相源 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 本轮需求覆盖如何判定 | `FR-CONV-001~008`、P0-supporting 切口和 `BR/NFR/AC` 门禁均有实现、测试或明确非范围 / 风险接受记录。 |
| 2. 交付物是否全部完成 | Step 4 中列出的目标仓、workspace、crates、Command / Query / Event / Job、domain、application、infra、scripts、tests、reports 和 artifacts 必须全部有落点。 |
| 3. 测试门禁和验收门禁是否全部通过或有明确风险接受 | P0-blocking suite、release redline、redaction、AC-EVID 和 VETO 必须通过；只有 S2/S3、P1/P2 非范围风险可有条件接受。 |
| 4. 风险、Spike 和待确认事项是否关闭 | 影响 P0 或当前 boundary 的 Spike / blocker 必须关闭；P1/P2 待确认项必须写入 risk acceptance 或 open issues，且不得作为 P0 已完成声明。 |
| 5. 是否存在一票否决项 | `VETO-CONV-001~014` 任一命中即不通过，不得进入风险接受。 |
| 6. 未完成项如何处理 | 分为 blocker、延期项、风险接受或不适用；禁止用“基本完成”或“后续优化”掩盖 P0 缺口。 |
| 7. `reports/runs/<run_id>` 是否已经从 `artifacts/test/<run_id>` 生成 | 必须生成，且 `summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md` 可回指 raw artifacts。 |
| 8. `reports/acceptance/*` 是否已经审查 | `handoff.md`、`veto-checklist.md` 必须审查；有条件通过时 `risk-acceptance.md` 必须审查；存在未关闭项时 `open-issues.md` 必须审查。 |
| 9. artifact / report 是否通过 redaction 和 link 检查 | 必须通过；raw secret、raw payload、forbidden body、source body、断链 EV 或 `latest` 路径均不通过。 |
| 10. 是否仍存在字段、DTO、状态、命名或 phase boundary 冲突 | 任一未关闭冲突均不允许宣称实施完成，必须按 Step 10 回写设计或修复实现后重验。 |

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 完成判定可能退化成口头结论 | 只说实现完成或测试通过 | 无法验收和追责 | 本步要求每项都有标准、证据和结论 |
| 未完成项容易被写成后续优化 | P0 缺口、VETO、redaction 可能被模糊处理 | 错误放行 | 本步强制分类为 blocker / 延期 / 风险接受 / 不适用 |
| raw artifact 可能替代 report | 测试输出存在但没有人类可读报告 | 审查困难，脱敏风险高 | 本步要求 run report 和 acceptance report |
| design 冲突可能留到实现仓解释 | 字段、DTO、状态或 phase boundary 未闭合 | 实现结果不可 1:1 追溯 | 本步要求无未关闭冲突才能完成 |
| P1/P2 可能被写成 P0 完成 | 真实生产外部服务未完成但被误报 | fake-as-production VETO | 本步要求风险接受中明确“不代表 production-ready” |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 完成判断 | 分散在验收标准和 gate 规则 | 集中为实施完成判定表 | 实现 agent 可自查 |
| 证据要求 | Step 7 定义路径 | Step 12 固定最终证据清单和审查条件 | 防止缺报告或断链 |
| 风险处理 | Step 9 定义风险边界 | Step 12 定义最终未完成项归类 | 防止“基本完成” |
| VETO | 验收标准定义一票否决 | Step 12 明确不可风险接受 | 最终放行口径清晰 |
| 设计闭环 | Step 10 定义暂停恢复 | Step 12 定义完成前必须全部关闭 | 防止带冲突交付 |

## 6. 实施计划取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只以所有测试通过作为完成 | 自动化清晰 | 无法覆盖 evidence、acceptance、VETO、风险和 design closure | 不采用 |
| 以测试、验收、证据、风险和设计闭环共同判定 | 完整可审查 | 检查项更多 | 采用 |
| P1/P2 未完成一律不通过 | 严格 | 会把非范围能力误变成 P0 blocker | 不采用 |
| P1/P2 未完成进入 risk acceptance 或 open issues | 保持 P0 边界 | 必须避免冒充 production-ready | 采用 |
| 允许“基本完成”作为最终结论 | 书写省事 | 不可审查 | 不采用 |
| 只允许通过 / 不通过 / 不适用 / 有条件通过 | 结论明确 | 需要证据支持 | 采用 |

## 7. 结构化中间产物

### 7.1 实施完成判定表

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| 需求覆盖 | `FR-CONV-001~008`、P0-supporting、`BR/NFR` 均有实现或明确非范围 / 风险接受记录 | trace matrix、EV、acceptance handoff | 通过 / 不通过 |
| 交付物完成 | Step 4 交付物全部有实现落点、测试落点或明确不适用说明 | commit list、workspace tree、delivery checklist | 通过 / 不通过 |
| 编译与基础门禁 | workspace 可编译，crate / package / binary 命名正确，core path dependency 可解析 | `cargo check`、metadata check、PH-01 gate | 通过 / 不通过 |
| 阶段测试门禁 | PH-02~PH-08 的 direct TC、同组 TC、suite 和 release redline 均通过 | `artifacts/test/<run_id>`、`reports/runs/<run_id>/gate-results.md` | 通过 / 不通过 |
| 验收门禁 | AC-FUNC、AC-RED、AC-SYNC、AC-STATE、AC-TX、AC-IDEM、AC-NFR、AC-EVID 可判定且通过 | EV pages、acceptance handoff、veto checklist | 通过 / 不通过 |
| VETO | `VETO-CONV-001~014` 全部有结论且未命中 | `reports/acceptance/veto-checklist.md` | 通过 / 不通过 |
| Redaction | artifact、report、logs、audit、event 和 evidence 中无 forbidden body / raw secret / raw payload | `reports/runs/<run_id>/redaction-check.md` | 通过 / 不通过 |
| 风险闭环 | P0 blocker 全部关闭；S2/S3、P1/P2 风险有 owner、影响、截止点和复验计划 | `risk-acceptance.md`、`open-issues.md` | 通过 / 不适用 / 不通过 |
| 设计闭环 | 无未关闭字段、DTO、状态、命名、phase boundary 或正式文档 / calibration 冲突 | design baseline hash、review checklist、blocker log | 通过 / 不通过 |
| 交付审查 | implementation commit、design baseline、run id、report 和 acceptance 文件全部固定 | handoff package | 通过 / 不通过 |

### 7.2 设计与实现闭环判定表

| 闭环项 | 完成标准 | 证据 | 结论 |
|---|---|---|---|
| 字段 / DTO 闭环 | 所有 phase 已按 `03-详细设计.md` 和 calibration 实现，无临时补设字段 | contract tests、review notes | 通过 / 不通过 |
| 状态闭环 | 代码、测试、报告、验收使用同一套正式状态名，无口语别名漂移 | state tests、EV、report grep | 通过 / 不通过 |
| phase boundary | 当前 phase 不依赖后续 phase 的对象、port、证据或状态 | commit review、Step 6 boundary checklist | 通过 / 不通过 |
| 依赖闭环 | 只有 core contracts 是编译期 path dependency，运行期 / 事件协作用 port / fake / fixture | Cargo review、dependency graph | 通过 / 不通过 |
| 配置闭环 | JSON config、profile、fail-fast / fail-closed、fake marker、path shape 均符合 `04` | config tests、PH-01 / PH-08 gate | 通过 / 不通过 |
| 证据闭环 | raw artifact、run report、EV、acceptance handoff 和 veto checklist 可互相回链 | evidence index、link check | 通过 / 不通过 |

### 7.3 交付证据判定表

| 交付证据项 | 固定路径 | 完成标准 | 结论 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` | P0 suite 原始证据完整，包含 context、suite result、failure summary 或 pass marker | 通过 / 不通过 |
| run reports | `reports/runs/<run_id>` | `summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md` 完整 | 通过 / 不通过 |
| EV pages | `reports/runs/<run_id>/evidence/EV-CONV-*.md` | P0 EV 均被 evidence index 引用，能回指 artifact | 通过 / 不通过 |
| acceptance handoff | `reports/acceptance/handoff.md` | 已写明 design baseline、implementation commit、run id、scope、风险和结论 | 通过 / 不通过 |
| veto checklist | `reports/acceptance/veto-checklist.md` | `VETO-CONV-001~014` 全部有结论，任一命中即不通过 | 通过 / 不通过 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过时必须存在并已审查；无条件通过时不适用 | 通过 / 不适用 / 不通过 |
| open issues | `reports/acceptance/open-issues.md` | P1/P2、S3 或后续专项有 owner、影响和截止点 | 通过 / 不适用 / 不通过 |

### 7.4 未完成项处理表

| 未完成项类型 | 处理方式 | 是否允许宣称完成 | 证据要求 |
|---|---|---|---|
| P0 功能缺失 | blocker，修复后重验 | 否 | blocker log、修复 commit、重跑 TC / EV |
| P0 测试或 release redline 失败 | blocker，修复后重跑直接 TC、同组 TC、相关 suite | 否 | failure artifact、rerun report |
| VETO / S0 / S1 | blocker，不得风险接受 | 否 | veto checklist、修复 evidence |
| redaction violation | blocker，清理泄漏源并重生成 artifact / report | 否 | redaction failure、clean rerun |
| 字段 / DTO / 状态 / phase boundary 冲突 | 回写 design repo，提交新 baseline 后恢复 | 否 | design fix commit、review note |
| P1 / P2 非范围能力缺失 | risk acceptance 或 open issues | 有条件 | owner、影响、截止时间、复验计划 |
| S2 / S3 readiness 风险 | risk acceptance 或 open issues | 有条件 | 不影响 P0 truth / redaction / evidence 的说明 |
| 明确非范围能力 | 标记不适用 | 是 | 非范围引用、下游专项说明 |

### 7.5 最终交付清单

| 交付项 | 必须内容 |
|---|---|
| design baseline | `quantalithos-design` 完整 commit hash，包含正式 `07-实施计划.md` |
| implementation commit list | `quantalithos-conversation` 每个 Step 6 boundary 对应的 commit hash |
| workspace summary | crate、package、binary、dependency 和 path check 摘要 |
| test run id | 固定 `<run_id>`，不使用 `latest` |
| artifacts root | `artifacts/test/<run_id>` |
| reports root | `reports/runs/<run_id>` |
| acceptance files | `reports/acceptance/handoff.md`、`veto-checklist.md`，必要时 `risk-acceptance.md` 和 `open-issues.md` |
| final decision | `通过` / `有条件通过` / `不通过`，不得使用“基本完成” |

### 7.6 最终结论规则

| 结论 | 允许条件 | 禁止条件 |
|---|---|---|
| 通过 | 所有 P0 功能、测试、验收、redaction、EV、VETO、设计闭环和交付审查通过 | 存在 blocker、VETO、redaction failure、P0 EV 缺失或未审查 handoff |
| 有条件通过 | P0 全部通过，仅存在 S2/S3、P1/P2 非范围风险，且 risk acceptance 已审查 | 把 P0 缺口、VETO、S0/S1 或 redaction violation 写入风险接受 |
| 不通过 | 任一 P0 blocker、VETO、S0/S1、redaction failure、设计冲突或证据缺失未关闭 | 用“基本完成”替代失败结论 |
| 不适用 | 明确非范围或无需生成的证据项 | 未解释的空项或缺失项 |

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §12。正式文档生成时应从本文件摘录，不提前填写实际实现结论。

````markdown
## 12. 实施完成判定

> 校准来源：
> - `design-calibration/07_implementation_plan_step_12_completion_criteria.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“实施完成判定表”“设计与实现闭环判定表”“交付证据判定表”“未完成项处理表”“最终交付清单”和“最终结论规则”小节，了解本项目何时可以宣称实现完成、何时必须阻断、何时只能有条件通过。

正式 §12 应摘录：

1. §7.1 实施完成判定表。
2. §7.2 设计与实现闭环判定表。
3. §7.3 交付证据判定表。
4. §7.4 未完成项处理表。
5. §7.5 最终交付清单。
6. §7.6 最终结论规则。

正式 §12 不得填写未来实现结果。它只定义判定标准。最终实现完成时，implementation agent 必须用固定 design baseline、implementation commit、run id、artifact、report 和 acceptance 文件填充实际结论。
````

## 9. 本步待确认事项

| 事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否允许“基本完成”作为最终结论 | A: 允许；B: 禁止，只允许通过 / 有条件通过 / 不通过 / 不适用 | 推荐 B | “基本完成”不可审查，也无法对应 VETO 和 evidence |
| P1/P2 非范围缺口是否阻断 P0 | A: 阻断；B: 不阻断，但必须写 risk acceptance / open issues | 推荐 B | 保持 P0 范围稳定，但不得声明 production-ready |
| risk acceptance 是否可覆盖 VETO | A: 可以；B: 不可以 | 推荐 B | VETO、S0/S1、redaction 和 P0 evidence 缺失是硬阻断 |

建议接受上述推荐。它们和 `06-验收标准.md`、Step 7、Step 9、Step 10、Step 11 保持一致，能防止最终交付阶段出现模糊通过。

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 完成判定可审查，且每项都有标准、证据和结论栏位 | 已满足 |
| 未完成项处理口径明确 | 已满足 |
| artifact / report / acceptance 证据路径已固定 | 已满足 |
| VETO、redaction、P0 blocker 和设计冲突不可风险接受的规则已明确 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

Step 12 可以进入 Step 13。Step 13 应继续严格单 Step 执行，专门整理正式 `07-实施计划.md`，并从 Step 1~12 已确认中间产物摘录，不新增未确认阶段、门禁、提交边界或完成判定。
