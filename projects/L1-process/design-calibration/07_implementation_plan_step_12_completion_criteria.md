# L1-process 07 实施计划 Step 12: 实施完成判定

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §12 实施完成判定
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 12 |
| 主题 | 实施完成判定 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_12_completion_criteria.md` |

本步定义 L1-process 实现完成后,什么时候可以宣称本轮实施完成。本步不提前填写实现结果,不替代 `06-验收标准.md`。

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 需求覆盖如何判定 | C-1~C-5、`FR-PROC-001~008`、P0 `BR/NFR`、`AC-PROC-001~029` 均有实现证据或明确非范围 / 风险接受记录。 |
| 交付物如何判定 | 7 crate、13 Command、11 Query、7 inbound event、10 outbound event、7 job、scripts、artifacts、reports 都有落点。 |
| 测试和验收如何判定 | P0 TC / EV、redaction、dependency scan、minimum E2E、AC 和 VF checklist 均通过。 |
| 风险如何关闭 | P0 blocker 全部关闭;P1/P2 非范围或 S2/S3 readiness 风险进入 risk acceptance / open issues。 |
| 一票否决如何处理 | 任一 `VF-PROC-*` failed 即不通过,不得风险接受。 |
| 交付实现前闭环审计如何判定 | 必须按 PH-01~PH-10 和 `07-实施计划.md` §6 完整 commit boundary 表对正式 `03/05/06/07` 执行可落码闭环审计;未通过项先回写 design repo 并固定新 baseline。 |
| 是否允许“基本完成” | 不允许。最终结论只能是通过、有条件通过、不通过或不适用。 |

## 3. 结构化中间产物

### 3.1 实施完成判定表

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| 需求覆盖 | C-1~C-5、`FR-PROC-001~008`、P0 `BR/NFR` 均覆盖 | trace matrix、EV、acceptance handoff | 通过 / 不通过 |
| 交付物完成 | Step 4 交付物全部有实现、测试或不适用说明 | commit list、workspace tree、delivery checklist | 通过 / 不通过 |
| 编译与依赖 | workspace 可编译,只有 core sibling path dependency | `cargo check`、dependency scan | 通过 / 不通过 |
| 阶段测试 | PH-02~PH-09 direct TC、同组 TC、suite 通过 | `artifacts/test/<run_id>`、gate results | 通过 / 不通过 |
| 验收门禁 | `AC-PROC-001~029` 可判定且 P0 通过 | EV pages、acceptance handoff | 通过 / 不通过 |
| VF | `VF-PROC-001~008` 全部有结论且未 failed | `reports/acceptance/veto-checklist.md` | 通过 / 不通过 |
| Redaction | artifact、report、log、audit、event 中无 forbidden body / raw secret / raw payload | `redaction-check.md` | 通过 / 不通过 |
| 设计闭环 | 无未关闭字段、DTO、状态、命名、phase boundary 冲突 | design baseline hash、blocker log | 通过 / 不通过 |
| 交付实现前闭环审计 | 已按 PH-01~PH-10 和 `07-实施计划.md` §6 完整 commit boundary 表对正式 `03/05/06/07` 执行可落码闭环审计,未通过项已回写 design repo 并固定新 baseline | 审计表、design baseline hash | 通过 / 不通过 |
| 风险闭环 | P0 blocker 关闭;P1/P2 或 S2/S3 有 owner / 截止点 | `risk-acceptance.md`、`open-issues.md` | 通过 / 不适用 / 不通过 |
| 交付审查 | implementation commit、design baseline、run id、report 和 acceptance 文件固定 | handoff package | 通过 / 不通过 |

### 3.2 交付证据判定表

| 交付证据 | 固定路径 | 完成标准 |
|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` | P0 suite 原始证据完整,包含 pass / failure summary |
| run reports | `reports/runs/<run_id>` | `summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md` 完整 |
| EV pages | `reports/runs/<run_id>/evidence/EV-*.md` | P0 EV 被 evidence index 引用并回指 artifacts |
| acceptance handoff | `reports/acceptance/handoff.md` | design baseline、implementation commits、run id、scope、风险和结论明确 |
| veto checklist | `reports/acceptance/veto-checklist.md` | `VF-PROC-001~008` 全部有结论 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过时必须存在;无条件通过时不适用 |
| open issues | `reports/acceptance/open-issues.md` | P1/P2、S3 或后续专项有 owner、影响和截止点 |

### 3.3 未完成项处理表

| 未完成项类型 | 处理方式 | 是否允许宣称完成 |
|---|---|---|
| P0 功能缺失 | blocker,修复后重验 | 否 |
| P0 测试 / release gate 失败 | blocker,修复后重跑相关 suite | 否 |
| `VF-PROC-*` failed | blocker,不得风险接受 | 否 |
| redaction violation | blocker,修复泄漏源并重生成 evidence | 否 |
| 字段 / DTO / 状态 / phase boundary 冲突 | 回写 design repo 后恢复 | 否 |
| P1 / P2 非范围缺失 | risk acceptance 或 open issues | 有条件 |
| 明确非范围能力 | 标记不适用 | 是 |

### 3.4 最终交付清单

| 交付项 | 必须内容 |
|---|---|
| design baseline | `quantalithos-design` 完整 commit hash,包含正式 `07-实施计划.md` |
| implementation commit list | `quantalithos-process` 每个 Step 6 boundary 对应 commit hash |
| workspace summary | crate、package、binary、dependency 和 path check 摘要 |
| test run id | 固定 `<run_id>`,不使用 `latest` |
| artifacts root | `artifacts/test/<run_id>` |
| reports root | `reports/runs/<run_id>` |
| acceptance files | `reports/acceptance/handoff.md`、`veto-checklist.md`,必要时 `risk-acceptance.md` 和 `open-issues.md` |
| final decision | `通过` / `有条件通过` / `不通过`,不得使用“基本完成” |

### 3.5 最终结论规则

| 结论 | 允许条件 | 禁止条件 |
|---|---|---|
| 通过 | 所有 P0 功能、测试、验收、redaction、EV、VF、设计闭环和交付审查通过 | 存在 blocker、VF failed、redaction failure、P0 EV 缺失 |
| 有条件通过 | P0 全部通过,仅存在 S2/S3、P1/P2 非范围风险且已审查 | 把 P0 缺口、VF、S0/S1 或 redaction violation 写入风险接受 |
| 不通过 | 任一 P0 blocker、VF、S0/S1、redaction failure、设计冲突或证据缺失未关闭 | 用“基本完成”替代失败结论 |
| 不适用 | 明确非范围或无需生成的证据项 | 未解释的空项或缺失项 |

## 4. 回填草稿

```markdown
## 12. 实施完成判定

> 校准来源:
> - `design-calibration/07_implementation_plan_step_12_completion_criteria.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施完成判定表”“交付证据判定表”“未完成项处理表”“最终交付清单”和“最终结论规则”小节。

实施完成必须同时满足需求覆盖、交付物、测试、验收、redaction、VF、设计闭环、交付实现前可落码闭环审计、风险闭环和交付审查。最终结论只能是通过、有条件通过、不通过或不适用。
```

## 5. 进入下一步条件

- 完成判定和最终交付清单已固定。
- 未完成项处理口径已明确。
- 后续 Step 13 可以整理正式 `07-实施计划.md`。
