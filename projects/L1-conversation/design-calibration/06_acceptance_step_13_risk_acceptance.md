# L1-conversation 06 验收标准 Step 13: 定义风险接受与遗留项

> 所属流程: `06_acceptance_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/06-验收标准.md` §13 风险接受与遗留项
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 13 |
| 主题 | 定义风险接受与遗留项 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `06-验收标准.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/06_acceptance_step_13_risk_acceptance.md` |

本步把测试方案残余风险、架构可接受债务、Step 11 一票否决边界和 Step 12 缺陷分级规则转成验收风险接受结构。它不提前给出最终通过 / 有条件通过 / 不通过结论,最终结论留给 Step 14。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05-测试方案.md` §14 | 残余风险和回归策略 | 作为风险列表主来源 |
| `05_test_plan_step_14_regression_risks.md` | 风险接受门禁、残余风险表和必须转入 06 的规则 | 作为结构化输入 |
| `01-架构设计.md` §14 / §15 | 可接受债务、不可接受债务、架构风险和待确认事项 | 作为风险边界来源 |
| `06_acceptance_step_10_observability_evidence.md` | `risk-acceptance.md` 和 `open-issues.md` 的证据要求 | 作为报告位置来源 |
| `06_acceptance_step_11_veto_items.md` | `VETO-CONV-*` 和不可风险接受项 | 作为禁止接受来源 |
| `06_acceptance_step_12_defects_release.md` | S0 / S1 / S2 / S3 对放行的影响 | 作为有条件通过前置规则 |

## 3. SOP 问题回答

### 3.1 哪些风险可以支持有条件通过?

只有未命中 `VETO-CONV-*`、不属于 S0 / S1、且不影响 P0 truth、安全、授权、redaction、source truth isolation、证据路径和 P0 EV 的风险,才可以支持有条件通过。典型风险包括 P1/P2 非范围缺口、S2 boundary / readiness 缺陷、S3 非阻断问题、真实外部服务未验证、真实跨仓端到端未完成、下游体验未覆盖、runtime 质量未覆盖、来源仓 lifecycle 未覆盖、量化容量数字未锁定、config center / hot reload / auto repair 未覆盖和 production-like 运维专项未覆盖。

### 3.2 哪些风险不能接受?

`VETO-CONV-*`、S0、S1、redaction violation、授权失效、source truth isolation 失败、truth 被反写、query / projection / report 写 truth、fake-as-production、证据路径错误、P0 evidence 缺失、raw secret / forbidden body 泄漏,均不能进入风险接受。它们只能修复并复验,不能作为有条件通过依据。

### 3.3 每个风险的接受人是谁?

风险接受必须同时有能力 owner、测试 owner 和 acceptance owner。实现阶段如果角色尚未固定,正式报告必须标记 `待送验填写` 或 `待确认`,但该风险不能在缺接受人的情况下支撑有条件通过。owner 不是默认接受人;接受人必须对 P0 不受影响、后续动作和截止时间负责。

### 3.4 后续动作和截止时间是什么?

每个可接受风险必须绑定后续专项、目标阶段或目标日期。当前无法给出真实日期时,正式验收报告必须写 `P1 staging-like 专项`、`P2 production-like 专项`、`对应下游仓验收` 或 `待送验填写`,不得留空。没有后续动作或截止时间的风险只能进入 open issue,不能支撑有条件通过。

### 3.5 风险是否需要同步到实施计划或问题记录?

会影响后续开发、测试、运维或跨仓联调的风险必须同步到实施计划、对应子项目测试方案或 `reports/acceptance/open-issues.md`。只属于本轮送验解释的范围边界可以保留在 `reports/acceptance/risk-acceptance.md`,但仍必须说明“不代表 production-like 通过”。

## 4. 当前文档问题诊断

| 文档 / 输入 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 缺少新版 risk acceptance、P0 / P1 边界和报告路径 | 不继承旧风险口径 |
| `05-测试方案.md` §14 | 已列残余风险,但还不是验收裁决结构 | 转成风险接受表和报告位置 |
| `01-架构设计.md` §14 / §15 | 可接受债务和阻塞风险混在架构语境 | 本步分为可接受风险和不可接受风险 |
| Step 11 产物 | 已明确 veto 不得风险接受 | 本步把 veto 纳入禁止接受表 |
| Step 12 产物 | 已明确 S2 / S3 可候选、S0 / S1 不可接受 | 本步补 owner、接受人、动作和截止时间要求 |
| Step 14 未生成 | 最终结论尚未签署 | 本步只提供风险接受输入 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 风险清单 | 测试和架构文档分散列出 | 汇总为 `RISK-CONV-*` |
| 可接受边界 | 只知道 P1/P2 或 S2/S3 | 增加 P0 红线不受影响、owner、动作和截止时间要求 |
| 不可接受边界 | 分散在 veto、缺陷、redaction 和证据门禁 | 统一列为禁止风险接受项 |
| 报告位置 | `risk-acceptance.md` 和 `open-issues.md` 已存在 | 明确每类风险写入哪个报告 |
| 有条件通过 | 缺少风险接受结构 | 风险表完整时才可进入 Step 14 的有条件通过候选 |

## 6. 验收裁决取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 风险接受是否覆盖 S1 | 可以覆盖 | 不可覆盖,必须修复 | B | S1 仍阻断 P0 |
| 缺接受人的风险是否能有条件通过 | 可以暂存 | 不可以,只能 open issue | B | SOP 明确没有接受人的风险不能作为有条件通过依据 |
| P1/P2 缺口是否都写 risk-acceptance | 全部写入 | 支撑有条件通过写 risk-acceptance,非阻断跟踪写 open-issues | B | 保持报告语义清楚 |
| production-like 缺口是否可接受 | 可接受并宣称 production-ready | 可接受范围边界,不得宣称 production-like 通过 | B | 防止 fake-as-production |
| 截止时间是否可空 | 可空 | 不可空,至少写目标阶段或待送验填写 | B | 风险接受必须可跟踪 |

## 7. 结构化中间产物

### 7.1 风险接受表

| 风险 / 遗留项 | 影响 | 接受理由 | 后续动作 | 责任人 | 接受人 | 截止时间 |
|---|---|---|---|---|---|---|
| RISK-CONV-001 真实 DB / broker / resolver / handoff 产品行为未验证 | P0 通过不代表真实产品集成可用 | P0 使用 in-memory / fake / controlled adapter 验证本仓语义和接缝 | P1 integration / staging-like 专项;不得宣称 production-like 通过 | integration owner | integration owner + acceptance owner | P1 staging-like 专项 |
| RISK-CONV-002 真实跨仓端到端联调未完成 | 跨仓部署可能暴露配置或契约接缝问题 | 上游 / 下游仓实现和部署不属于当前 P0 | 基于已收稳仓库执行后续跨仓联调 | project owner + affected repo owner | acceptance owner | P1 staging-like 专项 |
| RISK-CONV-003 Chat UI / Workspace / Bridges 体验未覆盖 | 产品体验完整性不能由本仓 P0 证明 | 下游体验属于对应子项目验收范围 | 转入下游仓测试和验收计划 | downstream owner | downstream owner + acceptance owner | 对应下游仓验收 |
| RISK-CONV-004 Runtime 推理质量和工具调用正确性未覆盖 | 推理质量问题不在本仓裁决 | Conversation 只消费结果性事实 ref,不拥有 reasoning truth | 转入 `L2-runtime` / tools 测试方案 | runtime owner | runtime owner + acceptance owner | 对应运行时专项 |
| RISK-CONV-005 来源仓 truth lifecycle 未覆盖 | 来源仓数据不一致会影响 manifestation 输入 | 本仓不拥有治理、产物、身份、runtime 或 bridge truth | 本仓保留 unresolved / digest mismatch;来源仓自行验收 | source repo owner | source repo owner + acceptance owner | 对应来源仓验收 |
| RISK-CONV-006 生产级吞吐、延迟、容量数字未锁定 | 不能宣称达到生产容量目标 | 需求未确认正式负载模型,不得补默认阈值 | 保留 baseline / trend evidence;后续容量专项锁定阈值 | performance owner | performance owner + acceptance owner | P2 capacity 专项 |
| RISK-CONV-007 config center / hot reload / auto repair 未覆盖 | 后续启用可能影响冷更新和审计边界 | P2 能力不在当前设计范围;P0 仅支持静态配置和 fail-fast | 后续配置中心设计;P0 中启用应 fail-fast | config owner | config owner + acceptance owner | P2 configuration 专项 |
| RISK-CONV-008 production-like runbook / dashboard 未覆盖 | 运维交接完整性不足 | 当前只要求 run-scoped reports 和 acceptance handoff | 转入 production-like 运维专项和 dashboard / runbook 设计 | operations owner | operations owner + acceptance owner | P2 operations 专项 |
| RISK-CONV-009 S2 readiness / boundary 缺陷 | 可能影响进入下一阶段的准备度 | 仅在 P0 truth、安全、redaction 和 evidence 不受影响时可接受 | 记录 defect、影响、临时规避、复验计划和目标时间 | defect owner + test owner | acceptance owner | 待送验填写 |
| RISK-CONV-010 S3 非阻断问题 | 不影响 P0 裁决,但影响文档、报告或后续体验 | 可作为 open issue 跟踪 | 写入 `reports/acceptance/open-issues.md` 或 backlog | issue owner | acceptance owner | 待送验填写 |

### 7.2 不可接受风险表

| 类型 | 不可接受原因 | 必须处理方式 |
|---|---|---|
| `VETO-CONV-*` 任一命中 | 直接破坏 P0 红线或证据成立性 | 修复、复验、更新 `veto-checklist.md` |
| S0 一票否决 | 等价 veto | 修复并执行 release redline / redaction / main suite |
| S1 P0-blocking | P0 用例、suite 或 gate 未关闭 | 修复并按 Step 12 复验 |
| redaction violation | raw secret、raw body 或 forbidden body 泄漏 | 修复并重跑 redaction check |
| 授权失效 | 隐藏 fact、sealed visibility 或追溯读取被绕过 | 修复并重跑授权相关 P0 TC |
| source truth isolation 失败 | 本仓补造或保存来源 truth | 修复并重跑 manifestation / consumer 相关 TC |
| fake-as-production | controlled seam 被伪装为真实生产成功 | 修复 handoff、config marker 和报告说明 |
| 证据路径错误或 P0 evidence 缺失 | 验收不可复查 | 补齐 `reports/runs/<run_id>` 和 `artifacts/test/<run_id>` 后重新裁决 |

### 7.3 风险记录字段要求表

| 字段 | 必填 | 说明 |
|---|---|---|
| 风险 ID | 是 | 使用 `RISK-CONV-*` 或缺陷 ID |
| 风险级别 / 类型 | 是 | P1/P2、S2、S3 或 readiness |
| 影响 | 是 | 必须说明是否影响 P0 AC、EV、redaction 和 veto |
| 接受理由 | 是 | 说明为什么不破坏 P0 结论 |
| 后续动作 | 是 | 指向专项、子项目、复验或 backlog |
| 责任人 | 是 | 能力 owner 或 defect owner |
| 接受人 | 是 | acceptance owner,必要时加 test owner |
| 截止时间 / 目标阶段 | 是 | 可为目标日期、目标阶段或 `待送验填写` |
| 证据入口 | 是 | `risk-acceptance.md` 或 `open-issues.md` |

### 7.4 风险到报告位置映射表

| 风险类型 | 报告位置 | 用途 |
|---|---|---|
| 支撑有条件通过的 S2 / readiness 风险 | `reports/acceptance/risk-acceptance.md` | 作为 Step 14 有条件通过输入 |
| P1/P2 非范围但需要验收说明的风险 | `reports/acceptance/risk-acceptance.md` | 说明范围边界和后续专项 |
| S3 非阻断问题 | `reports/acceptance/open-issues.md` | 进入 backlog 或后续修正 |
| 未固定 owner / deadline 的问题 | `reports/acceptance/open-issues.md` | 不支撑有条件通过 |
| S0 / S1 / VETO | `reports/acceptance/veto-checklist.md` 和缺陷记录 | 不得写成风险接受 |
| 证据、redaction、path 缺口 | `reports/runs/<run_id>` + `reports/acceptance/veto-checklist.md` | 修复后重新送验 |

### 7.5 有条件通过裁决图

```text
[P0 Gate / EV / VETO Result]
  | any VETO / S0 / S1?
  +-- yes --> [Not Passed]
  |
  +-- no --> [Residual Risks]
                |
                | all risks have owner, acceptor, action, deadline?
                +-- no --> [Open Issues Only / No Conditional Pass]
                |
                +-- yes --> [Conditional Pass Candidate]
                              |
                              v
                       [Step 14 Final Conclusion]
```

关键说明:

- 风险接受只在 P0 gate、EV 和 veto 未失败之后生效。
- 没有接受人、后续动作或截止时间的风险不能支撑有条件通过。
- S0 / S1 和 `VETO-CONV-*` 不进入残余风险流程。
- Step 14 才给出最终结论,本步只提供风险接受输入。

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `06-验收标准.md` §13 时摘录。

```markdown
## 13. 风险接受与遗留项

> 校准来源：
> - `design-calibration/06_acceptance_step_13_risk_acceptance.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/06_acceptance_step_13_risk_acceptance.md` 的“风险接受表”“不可接受风险表”“风险记录字段要求表”“风险到报告位置映射表”和“有条件通过裁决图”小节，了解哪些残余风险可以支撑有条件通过，以及哪些失败必须修复后重验。

风险接受只允许覆盖 P1/P2 非范围风险、S2 boundary / readiness 风险和 S3 非阻断问题。所有可接受风险必须写明影响、接受理由、后续动作、责任人、接受人和截止时间,并进入 `reports/acceptance/risk-acceptance.md` 或 `reports/acceptance/open-issues.md`。

`VETO-CONV-*`、S0、S1、redaction violation、授权失效、source truth isolation 失败、truth 反写、fake-as-production、证据路径错误和 P0 evidence 缺失不得风险接受。没有接受人、后续动作或截止时间的风险不能作为有条件通过依据。
```

## 9. 待确认事项

无阻塞进入 Step 14 的待确认事项。

后续必须继续收口:

- Step 14 将根据 P0 gate、veto、S0 / S1、S2 / S3 风险接受和证据完整性生成最终结论模板。
- Step 15 汇总正式 `06-验收标准.md` 时必须保留 `risk-acceptance.md` 与 `open-issues.md` 的不同语义。
- 实施阶段送验时必须把 `待送验填写` 替换为真实 owner、接受人、目标阶段或目标日期。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 可接受风险已列清 | 通过 | RISK-CONV-001~010 覆盖 P1/P2、S2/S3 和 readiness 缺口 |
| 不可接受风险已列清 | 通过 | VETO、S0、S1、redaction、授权、source isolation 和证据路径错误均禁止接受 |
| 风险字段完整 | 通过 | 影响、接受理由、动作、责任人、接受人和截止时间均为必填 |
| 报告位置明确 | 通过 | `risk-acceptance.md` 和 `open-issues.md` 语义已区分 |
| 可以进入 Step 14 | 通过 | 下一步定义最终结论与签署口径 |
