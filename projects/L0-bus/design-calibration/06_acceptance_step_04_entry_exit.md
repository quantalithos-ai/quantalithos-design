# L0-bus 06 验收标准 Step 4: 进入条件与退出条件

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 4 中间产物。
> 本步定义正式验收什么时候可以开始、什么时候可以结束,以及不同验收结论对应的退出门槛。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 4 |
| 主题 | 定义进入条件与退出条件 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §4 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `06_acceptance_step_01_input_boundary.md` | 已确认 | 继承 `06` 是裁决文档,不替代测试方案和测试报告 |
| `06_acceptance_step_02_scope.md` | 已确认 | 继承 P0 / P0-min 是硬验收范围,P1 / P2 进入风险或接缝验收 |
| `06_acceptance_step_03_baseline.md` | 已确认 | 继承文档、实现、测试运行、环境、证据和路径基线 |
| `05-测试方案.md` §12 | 已完成 | 提取测试进入准则和测试退出准则,转换为验收进入 / 退出门禁 |
| `05-测试方案.md` §13 | 已完成 | 提取 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 证据归档要求 |
| `05-测试方案.md` §14 | 已完成 | 提取回归策略、残余风险和 P1-risk 处理边界 |

---

## 3. SOP 问题回答

### 3.1 开始验收前哪些基线必须确认?

开始正式验收前必须确认三类基线:文档基线、送验实现基线、测试运行基线。

| 基线 | 必须确认的内容 | 判定方式 |
|---|---|---|
| 文档基线 | `00-需求文档.md` ~ `05-测试方案.md` 的版本 / 标识没有漂移 | 与 Step 3 的基线表一致 |
| 实现基线 | 实现仓路径、commit sha、tag / build id、image digest 如适用、依赖快照 | 由 `reports/acceptance/handoff.md` 或送验说明提供 |
| 上游依赖基线 | `L0-core` path dependency 对应 commit / version 固定 | 由 dependency snapshot 或 lockfile 证据提供 |
| 测试运行基线 | 固定 `<run_id>`,不得使用 `latest` 或“当前最新提交” | `reports/runs/<run_id>/summary.md` 和 test context 证明 |
| 环境基线 | `ci-test`、`integration-test`、`operations-recovery` profile 已验证 | `config-summary.md` 和 gate-results 证明 |
| 数据基线 | `DS-BUS-*` fixture、actor、metadata、fixed clock、deterministic namespace 可追溯 | `artifacts/test/<run_id>/meta/context.json` 和 evidence-index 证明 |

如果任何基线缺失或漂移,不能开始正式验收裁决。此时应补齐送验材料或回到对应上游文档重新校准。

### 3.2 哪些测试证据必须先生成?

正式验收不是执行测试,而是裁决测试证据。因此进入验收前必须已经生成可审计的报告和证据索引。

| 证据 / 报告 | 固定位置 | 进入验收前要求 |
|---|---|---|
| run summary | `reports/runs/<run_id>/summary.md` | 必须存在,说明本次 run 的范围、profile、commit、结果摘要 |
| gate results | `reports/runs/<run_id>/gate-results.md` | 必须存在,列出 PR / CI / release gate 结果 |
| evidence index | `reports/runs/<run_id>/evidence-index.md` | 必须存在,能从 AC / TC 追到 EV / artifact |
| coverage matrix | `reports/runs/<run_id>/coverage-matrix.md` | 必须存在,证明 P0 / P0-min 覆盖状态 |
| config summary | `reports/runs/<run_id>/config-summary.md` | 必须存在,证明 profile、runtime graph、secret ref 和 fail-fast / fail-closed |
| redaction check | `reports/runs/<run_id>/redaction-check.md` | 必须存在,证明 raw secret、payload body、backend private body 未泄漏 |
| artifact index | `reports/runs/<run_id>/artifact-index.md` | 必须存在,能回链到 `artifacts/test/<run_id>` |
| acceptance index | `reports/acceptance/<run_id>-index.md` | 必须存在,作为验收审查入口 |
| handoff | `reports/acceptance/handoff.md` | 必须存在,说明送验版本、依赖快照、运行环境和已知风险 |

原始机器证据必须位于 `artifacts/test/<run_id>`。验收人员优先阅读 `reports/runs/<run_id>` 和 `reports/acceptance`,但必须能沿索引回到 raw artifact。

### 3.3 哪些缺陷会阻断进入验收?

需要区分“阻断进入验收”和“导致验收不通过”。

| 缺陷 / 状态 | 是否阻断进入验收 | 原因 |
|---|---|---|
| 未分级缺陷存在 | 是 | 无法判断缺陷是否影响 P0 / S0 / S1 |
| 证据缺失或路径非法 | 是 | 无法进行可审计裁决 |
| 文档基线或 commit 基线漂移 | 是 | 验收对象不确定 |
| S0 已确认且证据完整 | 否,但会进入不通过裁决 | 验收可以开始并给出一票否决结论 |
| S1 已确认且证据完整 | 否,但通常导致不通过 | 验收可以裁决失败,不能写成通过或有条件通过 |
| S2 已确认且有 owner / deadline / 复验计划 | 否 | 可作为有条件通过或残余风险输入 |
| P1-risk 已记录且不影响 P0 | 否 | 进入风险接受章节处理 |
| P1-risk 被误声明为已交付 | 是 | 验收范围被污染,需先修正送验说明或文档 |

因此,进入验收前不是要求所有缺陷都已关闭,而是要求所有缺陷已分级、证据完整、影响范围清楚。否则验收没有裁决基础。

### 3.4 退出验收需要哪些结论?

退出验收必须形成三值结论之一:通过、有条件通过、不通过。每种结论都有不同门槛。

| 最终结论 | 退出条件 |
|---|---|
| 通过 | P0 / P0-min 全部通过;无 S0 / S1;S2 已关闭或不影响交付;证据链完整;签署完成 |
| 有条件通过 | P0 / P0-min 全部通过;无 S0 / S1;仅剩已接受 S2 或 P1-risk;有 owner、期限、复验计划和风险接受记录 |
| 不通过 | 存在 S0、一票否决、未解决 S1、P0 / P0-min 主链失败、证据链不可审计或基线不可确认;失败证据和整改入口已记录 |

验收退出不是只允许“通过”。如果证据完整且失败原因明确,也可以以“不通过”退出,并给出整改和复验要求。

### 3.5 哪些风险必须先接受?

下列风险如果存在,必须在退出验收前完成接受或转为不通过。

| 风险类型 | 退出前要求 |
|---|---|
| 未关闭 S2 | 必须有 owner、影响范围、截止时间、复验计划和接受记录 |
| P1-risk | 必须明确不是当前 P0 交付范围,且有后续专项或仓库归属 |
| production adapter 未交付 | 必须说明当前只验接缝和默认可验证路径 |
| observability / governance / SDK 下游能力未完成 | 必须说明 bus 只验输出材料和接缝,不替下游裁决产品能力 |
| 多 run 证据混用 | 必须说明 run 之间的关系;无法说明则不能接受 |
| 配置 profile 差异 | 必须说明差异是否影响 P0;影响 P0 则重新执行受影响 gate |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `06` 没有区分测试准则与验收准则 | 进入 / 退出条件更像测试执行清单 | 验收阶段无法判断是否已有可裁决证据 | 本步把测试 §12 转换为验收进入 / 退出门禁 |
| 旧 `06` 缺少固定 run 证据入口 | 没有要求 `<run_id>`、acceptance index、handoff | 验收证据不可追溯 | 本步把 `reports/runs/<run_id>`、`reports/acceptance` 纳入进入条件 |
| 旧 `06` 容易把“测试失败”理解为“不能验收” | 失败用例可能被挡在验收之外 | 无法形成“不通过”结论 | 本步区分“证据缺失阻断进入”和“失败证据进入不通过裁决” |
| 旧 `06` 对风险接受条件不清 | S2 / P1-risk 缺少 owner、期限和复验要求 | 有条件通过不可审计 | 本步把风险接受作为退出条件 |
| 旧 `06` 未明确三值结论退出门槛 | 通过、有条件通过、不通过边界不稳 | 签署口径不一致 | 本步定义三种退出路径 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 进入条件 | 笼统要求需求 / 设计 / 测试准备好 | 明确文档、实现、依赖、run、环境、数据和证据基线 | 可判定 |
| 证据前置 | 未列出报告和 handoff 最小集合 | 明确 summary、gate-results、evidence-index、coverage、config、redaction、acceptance index、handoff | 可审计 |
| 缺陷处理 | 未区分进入阻断和结论失败 | 未分级 / 证据缺失阻断进入;已确认失败可进入不通过裁决 | 可裁决 |
| 退出条件 | 偏向“全部通过” | 支持通过 / 有条件通过 / 不通过三值退出 | 符合验收标准定位 |
| 风险接受 | 缺少明确条件 | S2 / P1-risk 必须有 owner、期限、复验和接受记录 | 可追责 |

---

## 6. 验收设计取舍

### 6.1 是否要求所有 P0 测试通过后才能进入验收

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 必须全部通过后才进入验收 | 进入后更容易签署通过 | 无法用 `06` 正式裁决“不通过” |
| B. 证据完整即可进入验收,失败证据导致不通过 | 支持通过 / 有条件通过 / 不通过三值裁决 | 需要缺陷分级和证据索引严格 | 采用 |
| C. 不设置进入条件 | 简单 | 验收可能基于漂移证据 | 不采用 |

### 6.2 是否把 `reports/acceptance` 作为进入验收硬条件

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 作为硬条件 | 验收入口稳定,交接清楚 | 实施前需要生成脚本和审查补充 | 采用 |
| B. 只要求 `reports/runs/<run_id>` | 少一个交接步骤 | 验收人员需要自己拼接证据 | 不采用 |
| C. 只要求 raw artifacts | 最接近机器事实 | 人类审查成本过高,不适合作为验收入口 | 不采用 |

### 6.3 有条件通过是否允许未关闭 S1

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许 S1 有条件通过 | 放行更灵活 | S1 是阻断级缺陷,会破坏 P0 可信度 |
| B. 不允许 S1 有条件通过,仅允许已接受 S2 / P1-risk | 结论边界清晰 | 需要严格分级 | 采用 |
| C. 所有缺陷都必须关闭才可通过或有条件通过 | 最严格 | 无法表达低风险遗留项 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 验收进入条件清单

| ID | 进入条件 | 判定方式 | 阻断规则 |
|---|---|---|---|
| AC-ENTRY-001 | `00`~`05` 文档基线与 Step 3 一致 | 对照文档版本 / 标识 | 不一致则不得进入 |
| AC-ENTRY-002 | 送验实现仓、commit、依赖快照已固定 | `reports/acceptance/handoff.md` | 缺失则不得进入 |
| AC-ENTRY-003 | 固定 `<run_id>` 已确定,且未使用 `latest` | summary / context / acceptance index | 使用漂移引用则不得进入 |
| AC-ENTRY-004 | `reports/runs/<run_id>` 最小报告集合已生成 | 文件存在且链接可达 | 缺任一关键报告则不得进入 |
| AC-ENTRY-005 | `reports/acceptance/<run_id>-index.md` 和 `handoff.md` 已生成 | 文件存在且引用固定 run | 缺失则不得进入 |
| AC-ENTRY-006 | `artifacts/test/<run_id>` 存在,且无 `<project>` 层级 | artifact index / layout check | 路径非法则不得进入 |
| AC-ENTRY-007 | `ci-test`、`integration-test`、`operations-recovery` profile 已验证 | config summary / gate-results | 配置不可加载则不得进入 |
| AC-ENTRY-008 | 所有已知缺陷已分级 | open issues / defect list | 未分级缺陷存在则不得进入 |
| AC-ENTRY-009 | P1/P2 非范围没有被误声明为当前 P0 已交付 | handoff / scope statement | 范围污染则不得进入 |
| AC-ENTRY-010 | redaction、artifact layout、report links、config summary 四类 check 有结果 | check reports | 缺结果则不得进入 |

### 7.2 验收退出条件清单

| ID | 退出条件 | 适用结论 | 判定方式 |
|---|---|---|---|
| AC-EXIT-001 | 所有 P0 / P0-min 验收项均有明确结论 | 全部结论 | AC matrix |
| AC-EXIT-002 | 一票否决项已全部裁决 | 全部结论 | veto checklist |
| AC-EXIT-003 | 证据链能从结论追溯到 AC / TC / EV / artifact | 全部结论 | evidence index |
| AC-EXIT-004 | 通过结论下无 S0 / S1 / 未接受 S2 | 通过 | defect list / release signoff |
| AC-EXIT-005 | 有条件通过结论下无 S0 / S1,且剩余项均为已接受 S2 / P1-risk | 有条件通过 | risk acceptance |
| AC-EXIT-006 | 不通过结论下失败证据、阻断项和整改入口已记录 | 不通过 | failure summary / open issues |
| AC-EXIT-007 | 残余风险均有 owner、期限、后续动作和复验计划 | 有条件通过 / 不通过后复验 | risk acceptance |
| AC-EXIT-008 | 最终结论、签署人、签署时间和适用范围已记录 | 全部结论 | final signoff |

### 7.3 验收进入 / 退出裁决流

图类型: 验收裁决流

图标题: L0-bus 验收进入与退出裁决流

```text
固定基线
  -> 生成 reports / artifacts / acceptance handoff
  -> 检查进入条件
       -> 不满足: 补证据 / 回上游重校准
       -> 满足: 开始验收裁决
            -> 裁决 P0 / P0-min / S0 / S1 / S2 / P1-risk
                 -> 通过
                 -> 有条件通过
                 -> 不通过
                      -> 记录整改入口和复验要求
```

关键说明:

- 进入条件裁决的是“是否具备可审计证据”,不是“是否已经通过”。
- S0 / S1 证据完整时可以进入验收,但不能形成通过或有条件通过。
- 有条件通过只能承载已接受 S2 或 P1-risk,不能承载 S0 / S1。
- 所有退出路径都必须绑定固定 `<run_id>` 和签署记录。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_04_entry_exit.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“验收进入条件清单”“验收退出条件清单”和“验收进入 / 退出裁决流”小节,了解本章如何把测试准则转换为验收裁决门禁。

正式验收开始前,必须确认文档基线、送验实现基线、上游依赖基线、测试运行基线、环境基线和数据基线已经固定。验收不得引用 `latest`、`artifacts/test/latest`、`artifacts/test/<project>/<run_id>`、`reports/latest`、`reports/<project>`、mutable image tag、“当前最新提交”或“本机当前状态”。

进入验收前必须生成 `reports/runs/<run_id>`、`reports/acceptance/<run_id>-index.md`、`reports/acceptance/handoff.md` 和 `artifacts/test/<run_id>`。其中 `reports/runs/<run_id>` 至少包含 summary、gate-results、evidence-index、coverage-matrix、config-summary、redaction-check 和 artifact-index。

未分级缺陷、证据缺失、路径非法、基线漂移或 P1/P2 非范围被误声明为 P0 已交付,均阻断进入验收。已确认且证据完整的 S0 / S1 不阻断验收裁决本身,但会导致不通过,不能形成通过或有条件通过。

验收退出必须形成通过、有条件通过、不通过三种结论之一。通过要求 P0 / P0-min 全部通过,无 S0 / S1,证据链完整且签署完成。有条件通过要求 P0 / P0-min 全部通过,无 S0 / S1,仅剩已接受 S2 或 P1-risk,并具备 owner、期限、复验计划和风险接受记录。不通过要求失败证据、阻断项、整改入口和复验要求明确。

---

## 9. 待确认事项

当前没有阻塞进入 Step 5 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| P0 测试失败时是否允许进入验收 | A. 不允许;B. 允许进入并裁决不通过;C. 不设规则 | 采用 B | 验收标准必须能裁决失败,否则“不通过”没有正式出口 |
| `reports/acceptance` 是否作为进入验收硬条件 | A. 是;B. 否,只看 `reports/runs`;C. 只看 raw artifact | 采用 A | 验收需要稳定交接入口,不能让审查者自行拼证据 |
| 有条件通过是否允许 S1 | A. 允许;B. 不允许,只允许 S2 / P1-risk;C. 所有缺陷都必须关闭 | 采用 B | S1 是阻断级缺陷,不应进入有条件通过 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 验收进入条件已定义且可判定 | 已满足 |
| 验收退出条件已定义且支持三值结论 | 已满足 |
| 测试证据前置清单已定义 | 已满足 |
| 缺陷进入阻断与失败裁决边界已区分 | 已满足 |
| 风险接受作为退出条件已定义 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 5,定义功能验收门禁。
