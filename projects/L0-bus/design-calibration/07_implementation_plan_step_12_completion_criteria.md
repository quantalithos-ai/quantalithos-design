# L0-bus 07 实施计划 Step 12: 实施完成判定

> 本文件是 `projects/L0-bus/07-实施计划.md` 的 Step 12 中间产物。
> 本步定义 L0-bus 本轮实施何时可以被判定为完成、未完成项如何处理、最终交付物和证据如何进入验收。
> 本步不创建或修改正式 `07-实施计划.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 12 |
| 主题 | 定义实施完成判定 |
| 状态 | 已确认 |
| 正式回填位置 | `07-实施计划.md` §12 |
| 是否修改正式 `07-实施计划.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `07_implementation_plan_step_02_scope.md` | 已确认 | 继承本轮 P0 / P0-min 范围、F-001~F-008、非范围和 P1 / P2 后置边界 |
| `07_implementation_plan_step_04_deliverables.md` | 已确认 | 继承实施对象、交付物、非交付物和跨仓依赖清单 |
| `07_implementation_plan_step_07_tests_acceptance_gates.md` | 已确认 | 继承 PH-01~PH-08 的测试门禁、验收门禁、artifact / report 输出和失败处理 |
| `07_implementation_plan_step_09_spikes_risks.md` | 已确认 | 继承 Spike、风险、待确认事项、blocker 分类和上游回写触发条件 |
| `07_implementation_plan_step_10_rollback_change_control.md` | 已确认 | 继承暂停、回退、变更和恢复条件 |
| `07_implementation_plan_step_11_commit_review_delivery.md` | 已确认 | 继承提交、评审、交付证据和实现仓语言纪律 |
| `06-验收标准.md` §12~§14 | 已完成 | 提取 S0 / S1 / S2、VETO、风险接受、最终结论和签署口径 |

---

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 本轮需求覆盖如何判定 | `F-001`~`F-008` 必须全部可由 P0 / P0-min 测试、验收门禁和 evidence 链路证明。任何 F 项无法判定时,不得宣称实施完成。 |
| 2. 交付物是否全部完成 | Step 4 的代码、API、event、job、adapter、config、tests、scripts、artifacts、reports 和 acceptance handoff 必须全部有对应落点和证据。 |
| 3. 测试门禁和验收门禁是否全部通过或有明确风险接受 | P0 / P0-min 阻断门禁必须通过。仅 S2 / S3 / P1-risk 可进入风险接受;S0、S1、VETO 不得风险接受。 |
| 4. 风险、Spike 和待确认事项是否关闭 | Step 9 的 Spike 必须有输出;阶段 blocker 必须关闭;待确认事项必须采用推荐方案、回写设计或明确进入风险接受。 |
| 5. 是否存在一票否决项 | `VETO-BUS-001`~`012` 必须全部有结论。任一 VETO 命中时,本轮只能判定不通过或暂停进入整改。 |
| 6. 未完成项如何进入延期、风险接受或 blocker | P0 / P0-min 未完成项是 blocker;S2 / S3 可有条件风险接受;P1 / P2 非范围能力进入后续专项,不得写成本轮已完成。 |
| 7. `reports/runs/<run_id>` 是否已经从 `artifacts/test/<run_id>` 生成 | 必须生成,且 report 能回链 raw artifact。不得用 raw artifact 替代人类可读 report。 |
| 8. `reports/acceptance/handoff.md`、`veto-checklist.md` 和必要的 `risk-acceptance.md` 是否已经审查 | 必须由人或 Agent 审查补充。脚本生成初稿不能替代审查结论。 |
| 9. artifact / report 是否通过 redaction 和 link 检查 | 必须通过 forbidden body / raw secret redaction、no-latest、no project layer 和 report link check。 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 完成判定容易被写成口头结论 | “完成”“可交付”等词可能缺证据 | 后续 agent 不知道如何裁决 | 输出判定项、标准、证据和结论表 |
| P0、P0-min、P1 / P2 容易混淆 | 非范围能力可能被误报为完成 | 验收范围污染 | 未完成项分类处理 |
| raw artifact 与 report 容易混用 | artifact 是机器证据,report 是人读入口 | 验收材料不可审查 | 明确 artifact -> report -> acceptance 链路 |
| 风险接受容易替代修复 | S0 / S1 / VETO 不可接受 | 红线绕过 | 明确风险接受边界 |
| 脚本生成 handoff 容易被当成签署 | `reports/acceptance/*` 需要审查 | 责任链不完整 | 要求人或 Agent 审查补充 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 完成口径 | 分散在范围、交付物、门禁和验收标准中 | 收敛为完成判定表 | 可审查 |
| 未完成项 | 只有风险和门禁失败口径 | 分类为 blocker、risk acceptance、deferred、out of scope | 不混淆 |
| 证据链 | Step 7 / Step 11 已定义路径 | 作为实施完成硬门槛 | 支撑验收 |
| 风险接受 | 验收标准定义规则 | 实施完成前必须关闭或记录 | 防止模糊通过 |
| 最终交付 | 交付物清单较长 | 形成最终交付清单 | 方便 handoff |

---

## 6. 实施设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 用“代码写完”作为完成标准 | 简单 | 忽略测试、证据、report、handoff 和验收门禁 | 不采用 |
| 用 release gate 通过作为唯一完成标准 | 自动化明确 | 忽略 acceptance handoff、VETO 审查和风险接受 | 不采用 |
| 用范围覆盖 + 交付物 + gate + evidence + handoff + risk closure 综合判定 | 可审计、可签署 | 检查项更多 | 采用 |
| 允许 S0 / VETO 风险接受 | 能减少阻塞 | 违反验收标准 | 不采用 |
| 只允许 S2 / S3 / P1-risk 有条件接受 | 与验收标准一致 | 需要 owner、deadline 和 retest plan | 采用 |

---

## 7. 结构化中间产物

### 7.1 实施完成判定表

| 判定项 | 标准 | 证据 | 结论 |
|---|---|---|---|
| 范围覆盖 | F-001~F-008 均有对应实现、测试和验收证据 | coverage matrix、`reports/runs/<run_id>/evidence-index.md` | 实施后判定 |
| P0 / P0-min 主闭环 | publication、semantic、delivery、feedback、recovery、read output、outbox relay、fake backend 默认路径均成立 | `EV-BUS-PUB/SEM/DLV/FDB/REC/OUT/OBX/BND` | 实施后判定 |
| 交付物完成 | Step 4 交付物均有代码、测试、脚本或证据落点 | final deliverable checklist | 实施后判定 |
| 配置控制面 | valid profile 可构建 runtime graph,非法配置 fail-fast / fail-closed,reload rejected | `EV-BUS-CFG-*`、config summary | 实施后判定 |
| 测试门禁 | PH-01~PH-08 阶段 gate 和 release gate 均通过或有允许的风险接受 | gate-results、suite reports | 实施后判定 |
| 验收门禁 | AC-FUNC、AC-RED、AC-IF、AC-STATE、AC-TX、AC-IDEM、AC-CONC、AC-NFR、AC-EVID 均可判定 | acceptance matrix | 实施后判定 |
| 一票否决 | `VETO-BUS-001`~`012` 均无命中 | `reports/acceptance/veto-checklist.md` | 实施后判定 |
| 缺陷状态 | 无 S0、无未关闭 S1、无未接受 S2、无未分级缺陷 | defect summary、risk acceptance | 实施后判定 |
| 风险与 Spike | Spike 有输出,阶段 blocker 关闭,待确认事项已决策或进入允许风险 | Step 9 closure report | 实施后判定 |
| 证据链 | artifact、report、acceptance handoff 固定 `<run_id>`,可互相回链 | artifact index、report link check | 实施后判定 |
| 脱敏与边界 | artifact / report / log / event / projection 无 forbidden body、raw secret、private body | redaction-check | 实施后判定 |
| 提交与评审 | 16 个 commit boundary 或等价边界均合规、可 review、可回退 | git log、review notes、handoff | 实施后判定 |

### 7.2 交付证据项表

| 交付证据项 | 固定路径 | 完成标准 | 结论 |
|---|---|---|---|
| raw artifacts | `artifacts/test/<run_id>` | P0 / P0-min suite 原始证据完整,失败也有 failure reason | 实施后判定 |
| run reports | `reports/runs/<run_id>` | summary、evidence-index、gate-results、redaction-check、report links 完整 | 实施后判定 |
| acceptance index | `reports/acceptance/<run_id>-index.md` | 可从验收入口回链 run reports 和 raw artifacts | 实施后判定 |
| acceptance handoff | `reports/acceptance/handoff.md` | 已由人或 Agent 审查,说明范围、commit、dependency、profile、run_id、非范围 | 实施后判定 |
| veto checklist | `reports/acceptance/veto-checklist.md` | `VETO-BUS-001`~`012` 全部有结论和证据链接 | 实施后判定 |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | 有条件通过时 S2 / S3 / P1-risk 有 owner、acceptor、deadline、retest plan | 不适用或实施后判定 |
| open issues | `reports/acceptance/open-issues.md` | 有未关闭 S2 / S3 / P1-risk 时列出影响、责任人和复验入口 | 不适用或实施后判定 |

### 7.3 未完成项处理表

| 未完成项类型 | 示例 | 处理方式 | 是否允许宣称实施完成 |
|---|---|---|---|
| P0 / P0-min blocker | F-001~F-008 任一不可判定、release gate 失败、shared contract 不可编译 | 暂停、修复、重跑门禁 | 否 |
| S0 / VETO | forbidden body 泄漏、Query 写 truth、replay 绕过 audit chain、证据不可审计 | 修复或回退,不得风险接受 | 否 |
| 未关闭 S1 | P0 主链或 P0-min 支撑边界不可用 | 修复并复验 | 否 |
| 未分级缺陷 | 缺少影响、证据或等级 | 先分级,再按 S0~S3 处理 | 否 |
| S2 / S3 | 非主链质量问题、非关键报告字段缺失 | 可进入风险接受,必须有 owner、deadline、retest plan | 可有条件完成 |
| P1 / P2 非范围能力 | production adapter、dashboard、SDK、hot reload | 写入后续专项或 risk acceptance,不得声明为 P0 完成 | 可完成,但必须声明非范围 |
| 文档回写未完成 | 实现与 `03` / `04` / `05` / `06` 不一致 | 回写上游并重审影响范围 | 否 |
| 证据路径问题 | `latest`、`<project>` 层级、report link 断链 | 修正路径并重跑 check | 否 |

### 7.4 最终交付清单

| 交付项 | 完成要求 |
|---|---|
| 目标仓代码 | `/home/aris/Projects/quantalithos-bus` 存在,workspace 可构建,crate 命名和依赖方向符合 `03` |
| 编译期依赖 | `core-contracts` 本地 path dependency 可编译,dependency snapshot 已记录 |
| P0 功能代码 | publication、delivery、feedback、recovery、read output、outbox relay、fake backend 默认路径完成 |
| 配置 | JSON profile、runtime graph、secret ref、fail-fast / fail-closed、reload rejected 均可验证 |
| 自动化测试 | P0 / P0-min unit、service、integration、API、consumer、job、contract、release gate 通过 |
| 脚本 | `scripts/gates`、`scripts/reports`、`scripts/checks` 支持 required args 并输出固定路径 |
| 证据 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 完整且可回链 |
| 脱敏 | redaction check 覆盖 artifact、report、log、event、projection、config summary |
| 提交历史 | commit boundary 合规,message 英文,scope 合理,footer 和 body 格式合规 |
| 验收材料 | handoff、veto checklist、risk acceptance、open issues 已审查 |

### 7.5 最终结论口径

| 结论 | 允许条件 | 禁止情况 |
|---|---|---|
| 通过 | P0 / P0-min 全部通过;无 S0 / S1 / VETO;无未接受 S2;证据链完整;handoff 已审查 | 存在任何一票否决、证据断链或未分级缺陷 |
| 有条件通过 | P0 / P0-min 全部通过;无 S0 / S1 / VETO;仅剩已接受 S2 / S3 / P1-risk;风险接受完整 | 用风险接受覆盖 P0 失败、S1 或 VETO |
| 不通过 | 存在 S0、VETO、未关闭 S1、P0 / P0-min 失败、证据不可审计、基线不可确认或签署材料不足 | 用“暂定”“建议”“基本”等模糊表述替代 |
| 不进入签署 | 基线漂移、证据路径非法、缺陷未分级、P1 / P2 被误声明为 P0 或 acceptance handoff 缺失 | 直接给出通过 / 有条件通过 |

---

## 8. 回填草稿

以下内容用于 Step 13 回填 `07-实施计划.md` §12。

```markdown
## 12. 实施完成判定

> 校准来源：
> - `design-calibration/07_implementation_plan_step_12_completion_criteria.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“实施完成判定表”“交付证据项表”“未完成项处理表”“最终交付清单”和“最终结论口径”小节,了解本轮实施何时可以进入验收和签署。

本轮实施完成不能只以“代码写完”或“release gate 通过”裁决。完成判定必须同时满足范围覆盖、交付物完成、测试门禁、验收门禁、风险关闭、证据链完整、脱敏检查、提交纪律和 acceptance handoff 审查。

正式内容从 `design-calibration/07_implementation_plan_step_12_completion_criteria.md` §7.1~§7.5 摘录。
```

---

## 9. 待确认事项

| 事项 | 当前结论 | 影响 | 建议 |
|---|---|---|---|
| 是否允许使用“基本完成” | 不允许 | 会破坏验收口径 | 只使用通过 / 有条件通过 / 不通过 / 不进入签署 |
| 是否允许 raw artifact 替代 report | 不允许 | 人类不可审查 | 必须生成 `reports/runs/<run_id>` |
| 是否允许脚本 handoff 替代审查 | 不允许 | VETO 和风险接受责任不完整 | 必须人或 Agent 审查补充 |
| 是否允许 P1 / P2 未完成影响 P0 完成 | 不允许 | P0 范围会漂移 | 明确非范围或风险接受,不得声明已完成 |

建议方案: 接受当前完成判定规则。原因是它与 `06-验收标准.md` 的最终结论、Step 7 的门禁、Step 9 的风险和 Step 11 的交付纪律保持一致。

---

## 10. 进入下一步条件

- 实施完成判定可审查。
- 未完成项处理口径明确。
- 最终交付清单和证据路径明确。
- 可以进入 Step 13,整理正式 `07-实施计划.md`。
