# L1-conversation 06 验收标准 Step 14: 定义最终结论与签署口径

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §14 最终结论与签署
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 14 |
| 主题 | 定义最终结论与签署口径 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_14_final_conclusion.md` |

本步定义最终验收结论、进入下一阶段、发布准备和签署责任的裁决口径。它不替代真实送验结论;实际送验时必须填入 implementation commit / build / image、`<run_id>`、P0 evidence、veto checklist、risk acceptance 和签署日期。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `验收标准书写规范.md` §4.2 / §5.14 | 三值结论和最终签署表要求 | 作为结论格式来源 |
| `06_acceptance_step_10_observability_evidence.md` | evidence、gate、redaction、handoff 和 report 门禁 | 作为结论成立前置条件 |
| `06_acceptance_step_11_veto_items.md` | `VETO-CONV-*` 和不可风险接受边界 | 作为不通过条件 |
| `06_acceptance_step_12_defects_release.md` | S0 / S1 / S2 / S3 对结论的影响 | 作为缺陷裁决来源 |
| `06_acceptance_step_13_risk_acceptance.md` | 风险接受、open issues 和有条件通过候选 | 作为有条件通过来源 |
| `06_acceptance_calibration_flow.md` | 当前 `06` 重建流程状态 | 作为 Step 15 入口来源 |

## 3. SOP 问题回答

### 3.1 结论只能有哪些取值?

最终验收结论只能使用 `通过`、`有条件通过`、`不通过`。`送验不成立`、`暂停裁决` 和 `待送验填写` 只能作为最终结论前的状态说明,不能替代最终结论。禁止使用“基本通过”“原则上通过”“大体没问题”“后面补一下”等模糊结论。

### 3.2 何时允许进入下一阶段?

当全部 P0 AC 可裁决通过、无 `VETO-CONV-*`、无未关闭 S0 / S1、P0 evidence / gate / redaction / handoff 完整,且不存在未接受 S2 时,允许进入下一阶段。若 P0 主线成立但存在已接受 S2 / readiness 风险或明确 P1/P2 非范围风险,可有条件进入下一阶段,但必须保留 `risk-acceptance.md` 和 `open-issues.md`。

### 3.3 何时允许发布准备?

只有在 P0 gate、release redline、release report、redaction check、veto checklist、handoff 和 risk acceptance 完整时,才允许进入发布准备。`通过` 可进入发布准备;`有条件通过` 只能进入受限发布准备或下一阶段准备,不得宣称 production-like ready;`不通过` 不得进入发布准备。

### 3.4 哪些角色必须签署?

至少需要 acceptance owner、test owner、technical owner、security / redaction reviewer、release / operations owner 签署。若存在跨仓风险或被接受的 P1/P2 缺口,还需要 affected repo owner 或对应能力 owner 签署。签署表必须记录角色、姓名 / 责任、结论和日期;当前无法填写真实人名时,正式文档可用 `待送验填写`,但送验报告不得留空。

### 3.5 签署是否代表风险接受?

签署不等于无边界地接受所有风险。对于 `通过`,签署代表各角色确认其职责范围内 P0 evidence 和 veto 均通过。对于 `有条件通过`,签署代表签署人接受 `risk-acceptance.md` 中明确列出的风险、后续动作和截止时间。对于 `不通过`,签署代表确认失败原因、阻断项和重验要求。没有列入风险接受表的风险,不得因签署而自动被接受。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧结论口径无法承接新版 P0 evidence、veto、risk acceptance | 不继承旧最终结论 |
| `验收标准书写规范.md` | 明确三值结论,但未区分送验前置状态 | 本步把送验不成立定义为裁决前状态 |
| Step 10 | 证据完整性已定义,但未汇入最终结论 | 本步纳入结论前置条件 |
| Step 11 | 否决项已定义,但未汇入签署口径 | 本步规定命中 veto 时只能不通过 |
| Step 12 | 缺陷等级已定义,但未汇入总体结论表 | 本步把 S0~S3 映射到通过 / 有条件通过 / 不通过 |
| Step 13 | 风险接受表已定义,但签署是否代表接受尚未裁决 | 本步限定签署只接受已列明风险 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 最终结论 | 尚未定义正式裁决模板 | 固定三值结论 |
| 送验不成立 | 容易混入最终结论 | 定义为前置状态,不是最终结论 |
| 进入下一阶段 | 只知道通过 / 有条件通过大致含义 | 明确 P0、veto、S0/S1、S2 risk、evidence 条件 |
| 发布准备 | 可能和下一阶段混淆 | 明确有条件通过不得宣称 production-like ready |
| 签署责任 | 尚未落角色和风险接受关系 | 明确签署角色、范围和日期 |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否把送验不成立作为第四种最终结论 | 是 | 否,只作为裁决前状态 | B | 书写规范要求最终结论三值 |
| 有条件通过是否允许进入发布准备 | 完全允许 | 只允许受限发布准备,不得宣称 production-like ready | B | 防止风险接受覆盖生产就绪 |
| 签署是否自动接受全部风险 | 是 | 否,只接受明确列入风险表的风险 | B | 风险接受必须显式 |
| 没有真实 run id 时是否给出通过结论 | 可以 | 不可以,只能保留待送验填写 | B | 证据缺失不能裁决通过 |
| 是否所有角色都必须签署 | 只需 acceptance owner | 核心角色都签署,跨仓风险追加 affected owner | B | 验收裁决涉及技术、测试、安全、发布和风险 |

## 7. 结构化中间产物

### 7.1 最终结论取值表

| 结论 | 含义 | 允许动作 | 禁止条件 |
|---|---|---|---|
| 通过 | 全部 P0 门禁通过,无 S0 / S1,无未接受 S2,证据完整 | 可进入下一阶段或发布准备 | 任一 `VETO-CONV-*` 命中;P0 evidence 缺失;redaction 失败 |
| 有条件通过 | P0 主线成立,存在已接受 S2 / readiness 或 P1/P2 残余风险 | 可进入下一阶段或受限发布准备,必须跟踪风险 | 用风险接受覆盖 S0 / S1 / VETO;风险缺 owner / action / deadline |
| 不通过 | P0 门禁失败、S0 / S1 未关闭、veto 命中或证据不可复查 | 必须修复后重验 | 不适用 |

### 7.2 裁决前状态表

| 状态 | 含义 | 处理方式 |
|---|---|---|
| 送验不成立 | 缺 design baseline、implementation commit / build / image、`<run_id>`、P0 reports 或 acceptance handoff | 补齐送验材料后重新裁决,不得写通过 |
| 暂停裁决 | 存在无法判断 P0 影响的 S2 / readiness 缺口或证据冲突 | 先完成分级、复验或风险接受,再进入最终结论 |
| 待送验填写 | 正式设计文档阶段尚无真实执行数据 | Step 15 可保留模板字段,实现送验时必须替换 |

### 7.3 维度结论表模板

| 维度 | 结论 | 说明 |
|---|---|---|
| 功能验收 | 待送验填写: 通过 / 有条件通过 / 不通过 | 依据 §5~§8 的 P0 AC、TC、EV 和 gate 结果 |
| 非功能验收 | 待送验填写: 通过 / 有条件通过 / 不通过 | 依据 §9~§10 的 redaction、config、observability、evidence 和 report 结果 |
| 发布准备 | 待送验填写: 通过 / 有条件通过 / 不通过 | 依据 release gate、veto checklist、risk acceptance 和 handoff |
| 总体结论 | 待送验填写: 通过 / 有条件通过 / 不通过 | 取决于 P0 主线、VETO、S0 / S1、S2 风险接受和 evidence 完整性 |
| 是否允许进入下一阶段 | 待送验填写: 是 / 否 / 有条件 | `有条件` 必须回指 `reports/acceptance/risk-acceptance.md` |

### 7.4 结论判定矩阵

| 条件组合 | 功能验收 | 非功能验收 | 发布准备 | 总体结论 |
|---|---|---|---|---|
| 全部 P0 AC 通过;P0 EV 完整;无 VETO;无 S0 / S1;无未接受 S2 | 通过 | 通过 | 通过 | 通过 |
| P0 AC 通过;无 VETO / S0 / S1;存在已接受 S2 或 P1/P2 风险 | 通过或有条件通过 | 通过或有条件通过 | 有条件通过 | 有条件通过 |
| P0 AC 通过;无 VETO / S0 / S1;只有 S3 open issues | 通过 | 通过 | 通过或有条件通过 | 通过或有条件通过 |
| 任一 VETO 命中或 S0 未关闭 | 不通过 | 不通过 | 不通过 | 不通过 |
| 任一 S1 P0-blocking 未关闭 | 不通过 | 不通过 | 不通过 | 不通过 |
| P0 evidence、gate、redaction 或 handoff 缺失 | 不可裁决 | 不可裁决 | 不可裁决 | 送验不成立 |
| 风险接受缺 owner、接受人、后续动作或截止时间 | 通过或有条件通过 | 有条件通过 | 不通过 | 不通过或暂停裁决 |

### 7.5 进入下一阶段和发布准备规则

| 裁决对象 | 允许条件 | 禁止条件 |
|---|---|---|
| 进入下一阶段 | 总体结论为通过;或有条件通过且风险已接受 | VETO / S0 / S1;P0 evidence 缺失;未接受 S2 |
| 受限发布准备 | 总体结论为有条件通过,且风险不影响 P0 truth、安全、redaction 和 evidence | production-like 缺口被伪装成 production ready;风险缺 owner / deadline |
| 正式发布准备 | 总体结论为通过,release gate、redaction、handoff、veto checklist 全部通过 | 有条件通过但仍宣称无风险;fake-as-production |
| 重验 | 总体结论为不通过或送验不成立 | 用口头确认替代修复和复验 |

### 7.6 签署角色表

| 角色 | 姓名 / 责任 | 结论 | 日期 |
|---|---|---|---|
| Acceptance owner | 待送验填写;确认最终裁决、风险接受和 handoff | 待送验填写 | 待送验填写 |
| Test owner | 待送验填写;确认 P0 suite、EV、gate、缺陷和复验 | 待送验填写 | 待送验填写 |
| Technical owner | 待送验填写;确认设计契约、实现边界和 P0 主线 | 待送验填写 | 待送验填写 |
| Security / redaction reviewer | 待送验填写;确认 redaction、forbidden body 和 secret 边界 | 待送验填写 | 待送验填写 |
| Release / operations owner | 待送验填写;确认 reports、artifacts、handoff 和发布准备范围 | 待送验填写 | 待送验填写 |
| Affected repo owner | 如存在跨仓风险则填写;确认被接受风险和后续动作 | 待送验填写 | 待送验填写 |

### 7.7 最终裁决流程图

```text
[Acceptance Handoff + Run Reports]
  |
  v
[P0 AC / EV / Gate / Redaction Complete?]
  | no
  +---> [Submission Not Established]
  |
  | yes
  v
[Any VETO / S0 / S1?]
  | yes
  +---> [Not Passed]
  |
  | no
  v
[Any S2 / P1 / P2 Residual Risk?]
  | no
  +---> [Passed]
  |
  | yes
  v
[Risk Accepted With Owner / Action / Deadline?]
  | no
  +---> [Not Passed or Suspended]
  |
  | yes
  +---> [Conditionally Passed]
```

关键说明:

- `Submission Not Established` 是裁决前状态,不是最终结论。
- `Not Passed` 对应正式结论 `不通过`。
- `Conditionally Passed` 必须回指 `reports/acceptance/risk-acceptance.md`。
- 所有结论必须回指固定 `<run_id>` 的 reports 和 artifacts。

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §14 时摘录。

```markdown
## 14. 最终结论与签署

> 校准来源：
> - `design-calibration/06_acceptance_step_14_final_conclusion.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_14_final_conclusion.md` 的“最终结论取值表”“裁决前状态表”“结论判定矩阵”“签署角色表”和“最终裁决流程图”小节，了解最终结论如何从 P0 evidence、veto、缺陷分级和风险接受中收敛。

最终验收结论只允许使用 `通过`、`有条件通过`、`不通过`。`送验不成立`、`暂停裁决` 和 `待送验填写` 只能作为结论前状态,不能替代最终结论。禁止使用“基本通过”“原则上通过”“大体没问题”等模糊表述。

当全部 P0 AC 可裁决通过、P0 evidence / gate / redaction / handoff 完整、无 `VETO-CONV-*`、无 S0 / S1 且无未接受 S2 时,总体结论为通过。P0 主线成立但存在已接受 S2 / readiness 或 P1/P2 残余风险时,总体结论可为有条件通过,并必须回指 `reports/acceptance/risk-acceptance.md`。任一 VETO、S0 / S1、redaction failure、授权失效、source truth isolation 失败或 P0 evidence 缺失时,不得通过。
```

## 9. 待确认事项

无阻塞进入 Step 15 的待确认事项。

后续必须继续收口:

- Step 15 将删除旧版正式 `06-验收标准.md`,并按新文件标准重建。
- Step 15 必须保留本步三值结论、裁决前状态、签署角色和延伸阅读。
- 实际实现送验时必须把 `待送验填写` 替换为真实 run、结论、签署人和日期。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 结论取值明确 | 通过 | 最终结论只允许通过 / 有条件通过 / 不通过 |
| 裁决前状态明确 | 通过 | 送验不成立和暂停裁决不冒充最终结论 |
| 进入下一阶段口径明确 | 通过 | 通过或有条件通过才可进入下一阶段 |
| 发布准备口径明确 | 通过 | 有条件通过不得宣称 production-like ready |
| 签署角色明确 | 通过 | acceptance、test、technical、security、release 和 affected owner 已定义 |
| 可以进入 Step 15 | 通过 | 下一步整理正式 `06-验收标准.md` |
