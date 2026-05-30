# L0-bus 06 验收标准 Step 14: 最终结论与签署口径

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 14 中间产物。
> 本步定义最终验收结论只能如何取值、何时允许进入下一阶段或发布准备、哪些角色必须签署,以及签署与风险接受的关系。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 14 |
| 主题 | 定义最终结论与签署口径 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §14 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `06_acceptance_step_04_entry_exit.md` | 已确认 | 继承通过、有条件通过、不通过三值退出口径 |
| `06_acceptance_step_05_function_gate.md` | 已确认 | 继承 P0 / P0-min 功能门禁结论 |
| `06_acceptance_step_06_boundary_gate.md` | 已确认 | 继承数据边界与架构红线验收结论 |
| `06_acceptance_step_07_interface_sync_gate.md` | 已确认 | 继承接口、事件与跨仓同步门禁结论 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已确认 | 继承状态机、事务和一致性门禁结论 |
| `06_acceptance_step_09_nonfunctional.md` | 已确认 | 继承非功能门禁结论 |
| `06_acceptance_step_10_evidence_audit.md` | 已确认 | 继承 evidence、report、handoff、veto checklist、risk acceptance 的签署输入 |
| `06_acceptance_step_11_blockers.md` | 已确认 | 继承 VETO / S0 不允许通过或有条件通过的规则 |
| `06_acceptance_step_12_defects_release.md` | 已确认 | 继承缺陷分级、复验和放行规则 |
| `06_acceptance_step_13_risk_acceptance.md` | 已确认 | 继承风险接受、遗留项和同步规则 |

---

## 3. SOP 问题回答

### 3.1 结论只能有哪些取值?

正式验收结论只能取以下三值:

| 结论 | 定义 |
|---|---|
| 通过 | P0 / P0-min 全部通过,无 S0 / S1 / VETO,无未接受 S2,证据链完整,必签角色完成签署 |
| 有条件通过 | P0 / P0-min 全部通过,无 S0 / S1 / VETO,仅剩已接受 S2 / S3 / P1-risk,风险接受材料完整,必签角色完成签署 |
| 不通过 | 存在 S0、VETO、未关闭 S1、P0 / P0-min 主链失败、证据链不可审计、基线不可确认,或签署材料不足 |

`不进入签署` 不是最终结论,而是前置阻断状态。它适用于基线漂移、证据路径非法、缺陷未分级、`reports/acceptance` 缺失、P1-risk 被误声明为 P0 等情况。此时必须先补齐输入,不能伪装成“不通过”或“有条件通过”。

### 3.2 何时允许进入下一阶段?

“下一阶段”指后续仓库开发、P1/P2 专项、外部仓联动或继续实现的工作流。

| 结论 | 是否允许进入下一阶段 | 条件 |
|---|---|---|
| 通过 | 允许 | 签署完成,证据索引可复查,非范围说明清楚 |
| 有条件通过 | 允许,但带条件 | 所有遗留 S2 / S3 / P1-risk 已进入 risk acceptance 和 open issues,并同步到责任仓或后续实施计划 |
| 不通过 | 不允许作为通过基线进入下一阶段 | 只能进入整改、复验或重新送验阶段 |
| 不进入签署 | 不允许 | 先修正基线、证据、缺陷分级或范围声明 |

有条件通过进入下一阶段时,下游必须读取 `reports/acceptance/risk-acceptance.md` 和 `open-issues.md`,不能只读取最终结论标题。

### 3.3 何时允许发布准备?

“发布准备”指可以开始打 tag、生成 release package、准备变更说明、通知下游或交付给实现 / 运维使用。

| 情况 | 是否允许发布准备 | 说明 |
|---|---|---|
| 通过 | 允许 | 可以进入正常 release preparation |
| 有条件通过 | 允许受控发布准备 | 只能在 risk acceptance 明确限制范围、owner、deadline 和复验计划后进行 |
| 不通过 | 不允许 | 只能做整改分支、修复计划和复验准备 |
| 不进入签署 | 不允许 | 送验对象或证据对象不稳定 |

有条件通过下的发布准备必须在 release note 或 handoff 中标明条件、非范围和残余风险,不得让使用方误以为 P1/P2 后置能力已交付。

### 3.4 哪些角色必须签署?

签署角色分为必签角色和条件签署角色。

| 角色 | 是否必签 | 签署责任 |
|---|---|---|
| Acceptance owner | 是 | 对最终结论、适用范围和签署材料完整性负责 |
| Bus maintainer | 是 | 对 L0-bus P0 / P0-min 能力、缺陷处置和后续整改负责 |
| Test / release owner | 是 | 对 gate results、reports、artifacts、fixed `<run_id>`、release readiness 负责 |
| Security / boundary reviewer | 是 | 对 forbidden body、raw secret、privileged output、redaction 和边界红线负责 |
| L0-core contract owner | 条件必签 | 当 L0-core dependency snapshot、shared contract 或 contract boundary 涉及本次验收时签署 |
| Adapter owner | 条件必签 | 当 production adapter、durable store 或 backend compatibility 被列为风险或范围项时签署 |
| Governance owner | 条件必签 | 当 failure material、governance decision truth 或 replay approval 接缝被列为风险时签署 |
| Observability owner | 条件必签 | 当 dashboard、alerting 或观测产品化风险被列为风险时签署 |
| SDK / downstream consumer owner | 条件必签 | 当 SDK、subscriber idempotency、downstream usage 风险被列为风险时签署 |
| Platform / ops owner | 条件必签 | 当 config center、hot reload、多后端、多租户或运维专项被列为风险时签署 |

签署不能只写“已看过”。每个签署项必须写明结论、责任范围、日期和证据入口。

### 3.5 签署是否代表风险接受?

签署不自动代表风险接受。

| 情况 | 签署含义 |
|---|---|
| 通过签署 | 表示签署人认可 P0 / P0-min 验收通过,且没有需要接受的未关闭风险 |
| 有条件通过签署 | 表示签署人认可最终结论,但风险接受只以 `risk-acceptance.md` 中的逐项记录为准 |
| 不通过签署 | 表示签署人认可失败事实、阻断原因、整改入口和复验范围,不代表接受风险 |
| 条件签署人签署 | 只表示其责任范围内的风险、边界或后续动作已确认 |

因此,最终签署表必须和 `risk-acceptance.md` 分开。签署表证明“结论被确认”,风险接受表证明“哪些遗留项被谁接受”。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 结论容易出现模糊词 | “基本通过”“建议通过”“暂定通过”不可裁决 | 下游不知道是否能继续开发或发布 | 本步限定三值结论 |
| 前置阻断状态容易混入最终结论 | 基线漂移和证据缺失可能被写成不通过 | 掩盖送验材料不足 | 本步把“不进入签署”定义为非结论状态 |
| 有条件通过和风险接受容易混同 | 签署人可能以为签署表自动接受所有风险 | 遗留项不可追责 | 本步分离 signoff 和 risk acceptance |
| 必签角色不清 | 只写“项目组确认” | 缺陷、证据、安全和发布责任无人承担 | 本步定义必签和条件必签角色 |
| 发布准备口径不稳 | 有条件通过后可能直接发布 | 后续使用方误解非范围能力 | 本步要求有条件发布准备必须带条件、非范围和风险说明 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 结论取值 | 可能出现自然语言结论 | 只能通过 / 有条件通过 / 不通过 | 可裁决 |
| 前置状态 | 缺少不进入签署口径 | 明确不进入签署不是最终结论 | 防误签 |
| 下一阶段 | 只知道通过可继续 | 区分通过、有条件通过、不通过、不进入签署 | 可执行 |
| 发布准备 | 未区分正常和受控发布准备 | 有条件通过只能受控发布准备 | 防误用 |
| 签署角色 | 泛化为团队确认 | 必签 + 条件必签角色清单 | 可追责 |
| 风险接受 | 可能由签署隐含 | 明确签署不自动代表风险接受 | 防遗漏 |

---

## 6. 验收设计取舍

### 6.1 是否允许“基本通过”等模糊结论

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许 | 语言灵活 | 不可自动裁决,容易绕过风险接受 |
| B. 不允许,只保留三值结论 | 清晰可执行 | 需要把前置状态另行表达 | 采用 |
| C. 允许但要求解释 | 看似折中 | 仍然不稳定 | 不采用 |

### 6.2 是否把“不进入签署”作为第四种最终结论

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 是 | 能表达材料不足 | 破坏 Step 4 已确定的三值结论 |
| B. 否,只作为前置阻断状态 | 保持最终结论稳定 | 需要签署前检查清单 | 采用 |
| C. 不提 | 文档简短 | 基线和证据缺失可能被误签 | 不采用 |

### 6.3 是否让签署自动代表风险接受

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 是 | 流程简单 | 无法逐项追责 |
| B. 否,签署表和风险接受表分离 | 边界清楚 | 需要维护两类材料 | 采用 |
| C. 只在有条件通过时合并 | 材料少 | 仍会混淆结论确认和风险承担 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 最终结论表

| 维度 | 结论 | 说明 |
|---|---|---|
| 允许取值 | 通过 / 有条件通过 / 不通过 | 禁止“基本通过”“建议通过”“暂定通过”等模糊结论 |
| 通过 | P0 / P0-min 全部通过;无 S0 / S1 / VETO;无未接受 S2;证据链完整;签署完成 | 可进入下一阶段和正常发布准备 |
| 有条件通过 | P0 / P0-min 全部通过;无 S0 / S1 / VETO;仅剩已接受 S2 / S3 / P1-risk;风险接受完整;签署完成 | 可进入下一阶段和受控发布准备 |
| 不通过 | 存在 S0、VETO、未关闭 S1、P0 / P0-min 失败、证据不可审计、基线不可确认或签署材料不足 | 只能进入整改、复验或重新送验 |
| 不进入签署 | 证据路径非法、基线漂移、缺陷未分级、P1/P2 被误声明为 P0、acceptance handoff 缺失 | 不是最终结论;先补齐输入 |

### 7.2 下一阶段与发布准备裁决表

| 结论 / 状态 | 下一阶段 | 发布准备 | 必须附带材料 |
|---|---|---|---|
| 通过 | 允许 | 允许 | final signoff、acceptance index、evidence index |
| 有条件通过 | 允许,但下游必须读取风险材料 | 允许受控发布准备 | risk-acceptance、open-issues、handoff、release note 风险说明 |
| 不通过 | 不允许作为通过基线 | 不允许 | failure summary、open issues、整改入口、复验范围 |
| 不进入签署 | 不允许 | 不允许 | 输入修正清单、缺失证据清单或范围修正说明 |

### 7.3 签署角色表

| 角色 | 姓名 / 责任 | 结论 | 日期 |
|---|---|---|---|
| Acceptance owner | 最终验收结论、范围和签署材料完整性 | `<通过 / 有条件通过 / 不通过>` | `<YYYY-MM-DD>` |
| Bus maintainer | L0-bus P0 / P0-min 能力、缺陷处置和整改承诺 | `<通过 / 有条件通过 / 不通过>` | `<YYYY-MM-DD>` |
| Test / release owner | gate results、reports、artifacts、fixed `<run_id>` 和 release readiness | `<通过 / 有条件通过 / 不通过>` | `<YYYY-MM-DD>` |
| Security / boundary reviewer | forbidden body、raw secret、privileged output、redaction 和边界红线 | `<通过 / 有条件通过 / 不通过>` | `<YYYY-MM-DD>` |
| L0-core contract owner | 条件签署: shared contract / dependency snapshot / contract boundary | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |
| Adapter owner | 条件签署: production adapter / backend compatibility / durable store 风险 | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |
| Governance owner | 条件签署: failure material / decision truth / replay approval 接缝 | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |
| Observability owner | 条件签署: dashboard / alerting / observability productization 风险 | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |
| SDK / downstream consumer owner | 条件签署: SDK、subscriber idempotency、downstream usage 风险 | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |
| Platform / ops owner | 条件签署: config center、hot reload、多后端、多租户或运维专项 | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |

### 7.4 签署前检查表

| 检查项 | 通过 / 有条件通过要求 | 不通过要求 |
|---|---|---|
| acceptance index | `reports/acceptance/<run_id>-index.md` 存在且链接可达 | 记录缺失或不可达原因 |
| handoff | 说明送验版本、commit、dependency snapshot、profile、run_id、非范围和已知风险 | 记录缺失或内容不足 |
| gate results | P0 / P0-min gate 均有结论 | 记录失败 gate 和整改入口 |
| evidence index | AC / TC / EV / artifact 可追溯 | 记录缺失证据或断链 |
| veto checklist | 所有 `VETO-BUS-*` 均未命中 | 记录命中的 VETO |
| defect list | 无未分级缺陷;通过无未接受 S2;有条件通过只剩已接受风险 | 记录 S0 / S1 / 未分级缺陷 |
| risk acceptance | 有条件通过时所有风险有 owner、acceptor、deadline、retest 和 sync target | 记录无法接受的风险 |
| open issues | 有条件通过或不通过时存在并可追踪 | 记录缺失问题清单 |
| signoff roles | 必签角色完成签署;条件角色按风险范围签署或标明不适用 | 记录缺失签署 |

### 7.5 最终签署裁决流

```text
进入 Step 14
  -> 检查 reports/acceptance 与 fixed <run_id>
  -> 汇总 P0 / P0-min / VETO / defects / risks
       |
       +-- 基线漂移或证据缺失
       |     -> 不进入签署
       |
       +-- S0 / VETO / 未关闭 S1 / P0 主链失败
       |     -> 不通过
       |     -> 记录整改入口和复验范围
       |
       +-- P0 / P0-min 全部通过且无未接受风险
       |     -> 通过
       |     -> 必签角色签署
       |
       +-- P0 / P0-min 全部通过且仅剩已接受风险
             -> 有条件通过
             -> risk acceptance + open issues + 必签/条件签署
```

图后说明:

- 最终签署先检查送验材料是否稳定,再裁决三值结论。
- `不进入签署` 不是验收结论,不会出现在最终结论取值中。
- 有条件通过必须同时具备风险接受材料和签署材料。

---

## 8. 回填草稿

以下内容用于 Step 15 回填 `06-验收标准.md` §14。

```markdown
## 14. 最终结论与签署

> 校准来源：
> - `design-calibration/06_acceptance_step_14_conclusion_signoff.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“最终结论表”“下一阶段与发布准备裁决表”“签署角色表”和“签署前检查表”小节，了解最终结论如何被裁决和签署。

正式验收结论只能取三值:通过、有条件通过、不通过。`不进入签署` 不是最终结论,而是基线漂移、证据路径非法、缺陷未分级、P1/P2 被误声明为 P0 或 acceptance handoff 缺失时的前置阻断状态。

| 维度 | 结论 | 说明 |
|---|---|---|
| 允许取值 | 通过 / 有条件通过 / 不通过 | 禁止“基本通过”“建议通过”“暂定通过”等模糊结论 |
| 通过 | P0 / P0-min 全部通过;无 S0 / S1 / VETO;无未接受 S2;证据链完整;签署完成 | 可进入下一阶段和正常发布准备 |
| 有条件通过 | P0 / P0-min 全部通过;无 S0 / S1 / VETO;仅剩已接受 S2 / S3 / P1-risk;风险接受完整;签署完成 | 可进入下一阶段和受控发布准备 |
| 不通过 | 存在 S0、VETO、未关闭 S1、P0 / P0-min 失败、证据不可审计、基线不可确认或签署材料不足 | 只能进入整改、复验或重新送验 |

有条件通过进入下一阶段时,下游必须读取 `reports/acceptance/risk-acceptance.md` 和 `reports/acceptance/open-issues.md`。有条件通过下的发布准备必须在 release note 或 handoff 中标明条件、非范围和残余风险。

| 角色 | 姓名 / 责任 | 结论 | 日期 |
|---|---|---|---|
| Acceptance owner | 最终验收结论、范围和签署材料完整性 | `<通过 / 有条件通过 / 不通过>` | `<YYYY-MM-DD>` |
| Bus maintainer | L0-bus P0 / P0-min 能力、缺陷处置和整改承诺 | `<通过 / 有条件通过 / 不通过>` | `<YYYY-MM-DD>` |
| Test / release owner | gate results、reports、artifacts、fixed `<run_id>` 和 release readiness | `<通过 / 有条件通过 / 不通过>` | `<YYYY-MM-DD>` |
| Security / boundary reviewer | forbidden body、raw secret、privileged output、redaction 和边界红线 | `<通过 / 有条件通过 / 不通过>` | `<YYYY-MM-DD>` |
| L0-core contract owner | 条件签署: shared contract / dependency snapshot / contract boundary | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |
| Adapter owner | 条件签署: production adapter / backend compatibility / durable store 风险 | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |
| Governance owner | 条件签署: failure material / decision truth / replay approval 接缝 | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |
| Observability owner | 条件签署: dashboard / alerting / observability productization 风险 | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |
| SDK / downstream consumer owner | 条件签署: SDK、subscriber idempotency、downstream usage 风险 | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |
| Platform / ops owner | 条件签署: config center、hot reload、多后端、多租户或运维专项 | `<不适用 / 已确认 / 不通过>` | `<YYYY-MM-DD>` |

签署不自动代表风险接受。最终签署表证明“结论被确认”,`risk-acceptance.md` 证明“哪些遗留项被谁接受”。没有进入 `risk-acceptance.md` 的风险,不能被签署表隐式接受。
```

---

## 9. 待确认事项

| 事项 | 方案 | 建议 |
|---|---|---|
| 是否允许模糊结论 | A. 允许;B. 不允许,只保留三值;C. 允许但解释 | 采用 B |
| 是否把“不进入签署”作为第四种最终结论 | A. 是;B. 否,只作为前置阻断状态;C. 不提 | 采用 B |
| 签署是否自动代表风险接受 | A. 是;B. 否,签署表和风险接受表分离;C. 有条件通过时合并 | 采用 B |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 已回答 SOP Step 14 的 5 个问题 | 已满足 |
| 已形成最终结论表 | 已满足 |
| 已形成下一阶段与发布准备裁决表 | 已满足 |
| 已形成签署角色表 | 已满足 |
| 已形成签署前检查表 | 已满足 |
| 禁止模糊结论 | 已满足 |
| 结论和签署口径完整 | 已满足 |

结论: 可以进入 Step 15,整理正式 `06-验收标准.md`。
