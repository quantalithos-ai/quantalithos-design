# L1-conversation 06 验收标准 Step 4: 定义进入条件与退出条件

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §4 进入条件与退出条件
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 4 |
| 主题 | 定义进入条件与退出条件 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_04_entry_exit.md` |

本步定义正式验收审查何时可以开始、何时可以结束。它不重新定义测试执行准则,而是把 Step 3 的基线冻结规则和 `05-测试方案.md` §12 的进入 / 退出准则提升为验收裁决门禁。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `06_acceptance_step_03_baseline.md` | 设计、实现、环境、数据、run_id、artifact、report 和 acceptance handoff 基线 | 作为验收进入条件主来源 |
| `05-测试方案.md` §12 | 测试执行进入 / 退出准则 | 转成验收证据前置条件 |
| `05-测试方案.md` §11 | S0 / S1 / S2 / S3、复验和关闭证据 | 转成缺陷阻断和风险接受条件 |
| `05-测试方案.md` §13 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` | 转成证据可审查条件 |
| `05-测试方案.md` §14 | 回归策略和残余风险 | 转成有条件通过和风险接受条件 |
| `06_acceptance_step_02_scope.md` | P0 / P1 / P2 范围和一票否决候选 | 限定进入 / 退出条件的裁决范围 |

## 3. SOP 问题回答

### 3.1 开始验收前哪些基线必须确认?

开始正式验收审查前必须确认 design repo commit、implementation repo commit、build id / artifact digest、必要时的 image digest、`run_id`、profile、fixture seed、artifact root、report root 和 acceptance review version。design commit 必须包含新版 `00~06`；implementation commit 必须来自 `/home/aris/Projects/quantalithos-conversation`；证据必须绑定同一个 `<run_id>`。

未提交设计工作树、未固定实现 commit、只写 branch / tag / image tag、缺少 `<run_id>`、使用 `latest` 或使用 `<project>` 层级时,不得开始正式验收审查。

### 3.2 哪些测试证据必须先生成?

正式验收审查前必须生成:

- `artifacts/test/<run_id>`
- `reports/runs/<run_id>/summary.md`
- `reports/runs/<run_id>/evidence-index.md`
- `reports/runs/<run_id>/gate-results.md`
- `reports/runs/<run_id>/redaction-check.md`
- `reports/runs/<run_id>/evidence/EV-CONV-*.md`
- `reports/acceptance/handoff.md`
- `reports/acceptance/veto-checklist.md`
- 如存在 S2 / S3 或 P1 / P2 遗留,还必须生成 `reports/acceptance/risk-acceptance.md` 或 `open-issues.md`

如果这些文件没有生成,验收标准可以继续书写,但不能进入最终裁决。

### 3.3 哪些缺陷会阻断进入验收?

未解决的设计真相源冲突、基线无法定位、证据路径错误、report generation 失败、redaction check 无法运行、S0 / S1 缺陷在送验前已知且未完成复验,都会阻断“通过型送验”进入验收。

如果送验方明确提交的是失败审查材料,验收可以进入“不通过裁决”路径,但不得把该路径用于规避修复、复验或风险接受要求。

### 3.4 退出验收需要哪些结论?

退出验收必须形成三类结论之一:

- `通过`: P0 AC、P0-blocking suite、release redline、redaction、path shape、veto checklist 和 acceptance handoff 全部通过,无未关闭 S0 / S1。
- `有条件通过`: P0 和一票否决项全部通过,无未关闭 S0 / S1,仅存在已记录并被接受的 S2 / S3 或 P1 / P2 风险。
- `不通过`: 任一 P0 红线、S0 / S1、redaction violation、授权失效、source truth isolation 失败、path shape 错误、fake-as-production 或证据不可审计成立。

缺少基线或证据时,原则上不能形成通过 / 有条件通过；如果必须裁决,只能按“证据不可审计”进入不通过或退回送验。

### 3.5 哪些风险必须先接受?

所有 S2 / S3、P1 / P2、release readiness、integration-like、operations-replay、真实外部服务未验证、真实跨仓端到端未验证、生产级容量数字未锁定、production-like 运维未覆盖等风险,必须在 `reports/acceptance/risk-acceptance.md` 或 `open-issues.md` 中记录影响范围、owner、目标时间、临时规避和 P0 不受影响证据。

S0 / S1、redaction violation、授权失效、source truth isolation 失败、append-only 破坏、evidence path 错误和 fake-as-production 不允许风险接受。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 旧稿没有固定新版基线、run_id 和 evidence path 的进入 / 退出门禁 | 不继承旧门禁 |
| `06_acceptance_step_03_baseline.md` | 已固定基线字段,但还未转成开始 / 结束验收的 checklist | 本步转成验收进入条件 |
| `05-测试方案.md` §12 | 已定义测试执行准则 | 本步只承接其结果,不重复测试过程 |
| `05-测试方案.md` §11 / §14 | 已定义缺陷分级和风险接受 | 本步转成验收退出和有条件通过规则 |
| 送验执行证据 | 当前尚未产生实际 `<run_id>` 和 acceptance handoff | 记录为最终裁决前置条件 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 验收开始条件 | 旧稿可能只要求测试完成 | 必须同时固定设计、实现、环境、数据、run_id、artifact、report 和 handoff |
| 测试证据 | 泛写“测试报告” | 固定 `reports/runs/<run_id>`、EV index、gate、redaction 和 acceptance handoff |
| 缺陷处理 | 通过 / 不通过边界不清 | S0 / S1 阻断通过,S2 / S3 只能有条件接受 |
| 风险接受 | 旧稿未绑定风险文档 | 必须落到 `reports/acceptance/risk-acceptance.md` 或 `open-issues.md` |
| 退出结论 | 可能只有“验收通过” | 明确通过 / 有条件通过 / 不通过三值裁决 |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 验收进入是否要求所有测试通过 | 通过后才能开始验收 | 证据必须生成,失败可进入不通过审查 | B | 验收是裁决动作,可裁决失败 |
| 已知 S0 / S1 是否可送验 | 可以带着风险送验 | 阻断通过型送验,只能作为不通过材料审查 | B | S0 / S1 不可风险接受 |
| 缺少 run_id 是否可有条件通过 | 可以人工说明 | 不可通过或有条件通过 | B | 证据不可审计不能支撑验收 |
| P1/P2 风险是否阻断 P0 退出 | 一律阻断 | 不阻断 P0,但必须风险接受并限制结论表述 | B | Step 2 已区分 P0 与 readiness / production-like |
| 退出条件是否写自然语言 | 写“基本满足” | 写可检查 checklist | B | SOP 要求条件可判定 |

## 7. 结构化中间产物

### 7.1 验收进入条件

- [ ] design repo commit 已固定,且包含新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md` 和待重建的 `06-验收标准.md`。
- [ ] implementation repo commit 已固定,来源为 `/home/aris/Projects/quantalithos-conversation`,并记录 build id / artifact digest;如存在 image,记录 image digest。
- [ ] `run_id` 已固定,且与送验 implementation commit、design commit、profile、fixture seed 和 report version 对齐。
- [ ] P0 默认 profile 为 `ci-test`,并记录 in-memory store、fixed clock、deterministic id generator、fake resolver、fake publisher、fake handoff。
- [ ] 测试数据基线已固定为 `DS-CONV-*`、`TestRunId` namespace、deterministic fixture builder 和 fake script。
- [ ] `artifacts/test/<run_id>` 已生成,且不含 `<project>` 层级或 `latest`。
- [ ] `reports/runs/<run_id>` 已生成,且包含 `summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md` 和 EV 证据页。
- [ ] `reports/acceptance/handoff.md` 和 `reports/acceptance/veto-checklist.md` 已生成并完成送验说明。
- [ ] 如存在 S2 / S3 或 P1 / P2 遗留,`reports/acceptance/risk-acceptance.md` 或 `open-issues.md` 已生成。
- [ ] 没有未解决的设计真相源冲突、未复验 S0 / S1、证据路径错误、report generation failure 或 redaction check execution failure。

### 7.2 验收退出条件

- [ ] 所有 P0 AC 均已映射到正式设计契约、TC、EV 和 `reports/runs/<run_id>/evidence-index.md`。
- [ ] 所有 P0-blocking 用例和 suite 在固定 `<run_id>` 下有明确 pass / fail / blocked 记录。
- [ ] `SUITE-CONV-MAIN-SERVICE`、`SUITE-CONV-MAIN-QUERY`、`SUITE-CONV-MAIN-WORKER-JOB`、`SUITE-CONV-MAIN-CONFIG` 均已完成裁决。
- [ ] `SUITE-CONV-RELEASE-REDLINE`、`scripts/checks/check_redaction.sh` 和 `SUITE-CONV-RELEASE-REPORT` 均已完成裁决。
- [ ] `reports/runs/<run_id>/redaction-check.md` 未发现 forbidden body、runtime reasoning body、bridge platform body、raw secret 或 raw payload 泄露。
- [ ] `reports/acceptance/veto-checklist.md` 已确认无一票否决触发,或已明确记录触发后不通过。
- [ ] 没有未关闭 S0 / S1;所有 S0 / S1 修复均有复验 run、相关 suite、redline 和必要 redaction 证据。
- [ ] 所有 S2 / S3 或 P1 / P2 遗留均完成风险接受或 open issue 记录。
- [ ] acceptance owner 已基于固定 design commit、implementation commit、`run_id` 和 reports 给出通过 / 有条件通过 / 不通过结论。
- [ ] 最终结论没有使用 `latest`、`reports/<project>`、`artifacts/test/<project>/<run_id>`、未提交工作树或不可审计证据。

### 7.3 进入 / 退出阻断矩阵

| 阻断项 | 阻断进入 | 阻断通过 | 处理 |
|---|---|---|---|
| design commit 未固定 | 是 | 是 | 提交设计仓并记录 hash |
| implementation commit / build 未固定 | 是 | 是 | 固定实现 commit 和 build / digest |
| `<run_id>` 未固定 | 是 | 是 | 执行 gate 并生成固定 run |
| `artifacts/test/<run_id>` 缺失 | 是 | 是 | 重新生成 raw artifact |
| `reports/runs/<run_id>` 缺失 | 是 | 是 | 运行 report generator |
| `reports/acceptance/handoff.md` 缺失 | 是 | 是 | 补交接说明并审查 |
| `latest` 或 `<project>` 层级被引用 | 是 | 是 | 修正路径并重新送验 |
| 未解决设计真相源冲突 | 是 | 是 | 回到对应设计文档修正 |
| S0 / S1 送验前已知未关闭 | 是 | 是 | 修复、复验、重新送验 |
| S0 / S1 在审查中发现 | 否 | 是 | 结论为不通过或退回修复 |
| S2 / S3 无风险接受 | 否 | 是 | 补风险接受或修复 |
| P1 / P2 风险未记录 | 否 | 影响有条件通过 | 补 `risk-acceptance.md` 或 `open-issues.md` |

### 7.4 结论判定表

| 结论 | 必要条件 | 不允许出现 |
|---|---|---|
| 通过 | P0 AC 全部通过;无 S0 / S1;无 veto;redaction / path / report / handoff 均通过;无未接受风险 | S2 / S3 未接受;P1/P2 风险未说明;证据不可审计 |
| 有条件通过 | P0 AC 全部通过;无 S0 / S1;无 veto;仅剩 S2 / S3 或 P1 / P2,且已风险接受 | redaction violation;授权失效;source truth isolation 失败;path shape 错误 |
| 不通过 | 任一 P0 blocking、S0 / S1、veto、redaction、授权、source truth、append-only、path 或 fake-as-production 失败 | 不得通过风险接受改写为通过 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §4 时摘录。

```markdown
## 4. 进入条件与退出条件

> 校准来源：
> - `design-calibration/06_acceptance_step_04_entry_exit.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_04_entry_exit.md` 的“验收进入条件”“验收退出条件”“进入 / 退出阻断矩阵”和“结论判定表”小节，了解本章如何把基线、测试证据、缺陷分级和风险接受转成正式验收门禁。

正式验收审查开始前,必须固定 design repo commit、implementation repo commit、build id / artifact digest、`run_id`、profile、fixture seed、artifact root、report root 和 acceptance review version。机器证据必须位于 `artifacts/test/<run_id>`,运行报告必须位于 `reports/runs/<run_id>`,验收交接必须位于 `reports/acceptance`。

退出验收必须形成通过、有条件通过或不通过三类结论之一。通过要求所有 P0 AC、P0-blocking suite、release redline、redaction、path shape、veto checklist 和 acceptance handoff 均通过,且无未关闭 S0 / S1。有条件通过只允许剩余已接受的 S2 / S3 或 P1 / P2 风险。任一 S0 / S1、redaction violation、授权失效、source truth isolation 失败、append-only 破坏、path shape 错误、fake-as-production 或证据不可审计均不得通过。
```

## 9. 待确认事项

无阻塞进入 Step 5 的待确认事项。

后续必须继续收口:

- Step 5~Step 11 将 P0 范围、一票否决候选和证据路径转成具体 AC。
- Step 12 将本步缺陷阻断规则细化为缺陷分级、复验和放行规则。
- Step 13 将本步 S2 / S3、P1 / P2 风险接到正式风险接受章节。
- Step 14 将本步三值结论转成最终签署口径。
- Step 15 重建正式 `06-验收标准.md` 时必须保留 checklist 和判定表,不得改写成“基本满足”。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 进入条件可判定 | 通过 | design / implementation / run_id / evidence / handoff 均有明确检查项 |
| 退出条件可判定 | 通过 | P0 AC、suite、redaction、veto、缺陷和风险均有明确检查项 |
| 缺陷阻断关系清楚 | 通过 | S0 / S1 阻断通过,S2 / S3 需风险接受 |
| 结论口径清楚 | 通过 | 通过 / 有条件通过 / 不通过三值条件已定义 |
| 可以进入 Step 5 | 通过 | 下一步定义功能验收门禁 |
