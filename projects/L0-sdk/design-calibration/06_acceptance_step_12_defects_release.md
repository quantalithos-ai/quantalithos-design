# L0-sdk 06 验收标准 Step 12: 缺陷分级、复验与放行规则

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 12 中间产物。
> 本步定义缺陷如何影响验收结论、修复后如何复验、什么情况下可以放行。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 12 |
| 主题 | 定义缺陷分级、复验与放行规则 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §12 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05-测试方案.md` §11 | 已完成 | 继承 S0 / S1 / S2 / S3、复验范围和关闭证据规则 |
| `05-测试方案.md` §12 | 已完成 | 继承进入 / 退出准则中的缺陷关闭要求 |
| `05-测试方案.md` §13 | 已完成 | 继承 `reports/runs/<run_id>`、`reports/acceptance` 和 `artifacts/test/<run_id>` 证据路径 |
| `05-测试方案.md` §14 | 已完成 | 继承回归触发和残余风险口径 |
| `06_acceptance_step_04_entry_exit.md` | 已确认 | 继承通过 / 有条件通过 / 不通过三值退出条件 |
| `06_acceptance_step_10_evidence_audit.md` | 已确认 | 继承证据、risk acceptance 和 open issues 规则 |
| `06_acceptance_step_11_blockers.md` | 已确认 | 继承 `VETO-SDK-*` 一票否决项和不可风险接受边界 |

---

## 3. SOP 问题回答

### 3.1 S/A/B 缺陷如何定义?

SOP 使用 S/A/B 作为通用严重度。本项目已经在测试方案中采用更细的 S0 / S1 / S2 / S3，因此本步将 SOP 严重度映射为项目严重度。

| SOP 级别 | L0-sdk 级别 | 定义 | 典型例子 |
|---|---|---|---|
| S | S0 | 一票否决或 P0 核心闭环被破坏 | `VETO-SDK-*` 触发、raw secret 泄露、双 truth、fake-only stable |
| S | S1 | P0 用例、P0 gate 或 P0 证据失败，但不属于一票否决 | DTO 缺字段、runner failed、config fail-fast 缺失、P0 evidence 缺失 |
| A | S2 | P1 接缝、staging-like、扩展能力或非 P0 风险 | staging endpoint unavailable、真实 credential provider 未接入 |
| B | S3 | 文档、报告展示、低风险可维护性或非阻断体验问题 | 报告字段排序不一致、说明文字不清但不影响裁决 |

### 3.2 每级缺陷对验收结论有什么影响?

| 级别 | 对通过的影响 | 对有条件通过的影响 | 对不通过的影响 |
|---|---|---|---|
| S0 | 必须不通过 | 不允许 | 任一 S0 直接不通过 |
| S1 | 必须不通过 | 不允许 | 任一 S1 导致不通过 |
| S2 | 不允许直接通过 | 可以在风险接受后有条件通过 | 未被接受或影响 P0 时不通过 |
| S3 | 可通过或有条件通过 | 可以记录为遗留项 | 未分级、无 owner 或影响证据裁决时不通过 |
| 未分级 | 不允许 | 不允许 | 未分级缺陷存在时不得裁决通过 |

### 3.3 修复后如何复验?

修复后必须先复跑缺陷直接关联的最小用例集，再根据影响面选择扩展回归。复验证据必须关联 defect id、case id、suite id、`run_id` 和修复 commit。

| 缺陷影响面 | 最小复验 | 扩展复验 |
|---|---|---|
| `VETO-SDK-*` / S0 | 对应 `TC-SDK-*`、专项、candidate gate、redaction / veto checklist | 全量 PR gate、main gate；必要时 nightly |
| P0 function / gate / DTO | 关联 contract / service / integration suite | 受影响语言 package surface smoke |
| security / redaction | security cases、redaction check、forbidden field scan | candidate gate、report completeness |
| candidate / evidence / compatibility | candidate cases、docs / smoke / compat cases | nightly compatibility regression |
| consistency / recovery | consistency、idempotency、projection 或 recovery 专项 | nightly concurrency 或 stress run |
| config | config negative cases、runtime builder、profile validation | PR config suite、main integration |
| observability / report | observability 专项、report generation、evidence-index check | acceptance summary generation |
| docs / low risk | 文档示例或报告生成检查 | 仅在影响 quickstart / smoke 时扩展 |

### 3.4 哪些缺陷可以风险接受?

| 缺陷类型 | 是否可风险接受 | 必要条件 |
|---|---|---|
| S0 / `VETO-SDK-*` | 不可接受 | 必须修复并复验通过 |
| S1 | 不可接受 | 必须修复并复验通过 |
| S2 | 可以 | 不影响 P0、无 truth / security / candidate gate 污染、有 owner、期限、后续动作和复验入口 |
| S3 | 可以 | 不影响证据裁决、报告可信度和实现契约理解 |
| P1 / P2 未完成 | 可以 | 不被声明为 P0 已交付，不支撑 `Verified` / `Stable` |
| 基础设施故障 | 条件接受 | 必须证明不是产品缺陷，并有重跑通过证据或明确的不通过裁决 |

### 3.5 哪些缺陷必须阻断下一阶段?

| 阻断类型 | 是否阻断下一阶段 | 原因 |
|---|---|---|
| 任一 `VETO-SDK-*` 触发 | 是 | 一票否决，不能进入发布或后续仓依赖 |
| 任一 S0 / S1 未关闭 | 是 | P0 可信度不足 |
| 未分级缺陷存在 | 是 | 无法判断是否影响 P0 或验收结论 |
| 失败证据缺失或不可追溯 | 是 | 无法复验 |
| risk acceptance 缺 owner / 期限 / 后续动作 | 是 | 有条件通过不可审计 |
| S2 / S3 被误声明为已通过 P0 | 是 | 验收结论失真 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| SOP 是 S/A/B，测试方案是 S0/S1/S2/S3 | 严重度体系不完全一致 | 正式验收可能出现两套分级 | 本步固定映射关系，以 S0/S1/S2/S3 为 L0-sdk 真相源 |
| S0 和 VETO 容易混淆 | S0 可被理解为所有 P0 失败 | 一票否决边界过宽 | 本步明确 `VETO-SDK-*` 属于 S0，但普通 P0 失败是 S1 |
| 有条件通过容易被滥用 | S1 可能被包装为风险接受 | P0 失败被放行 | 本步明确 S0/S1 不可风险接受 |
| 缺陷进入阻断和验收结论失败容易混淆 | 有失败证据时是否能进入验收不清楚 | 验收无法裁决 | 本步区分未分级 / 缺证据阻断进入，已分级失败可裁决为不通过 |
| 复验证据字段不稳定 | 只说“复验通过”，缺少 run 绑定 | 无法审计修复是否覆盖缺陷 | 本步固定 defect id、case id、suite id、run_id、commit 的关联 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 严重度体系 | 测试方案有 S0/S1/S2/S3，验收 SOP 是 S/A/B | 正式映射并以 S0/S1/S2/S3 作为项目口径 | 避免双体系 |
| 一票否决关系 | VETO 与普通 P0 失败边界不够显式 | VETO = S0 子集，普通 P0 失败 = S1 | 可裁决 |
| 有条件通过 | 仅泛化说风险可接受 | 只允许 S2/S3/P1/P2 risk，且必须有接受记录 | 不误放行 |
| 复验规则 | 测试方案给出影响面复验 | 验收补充 defect / case / suite / run / commit 绑定 | 可审计 |
| 放行规则 | 散落在进入退出准则和风险章节 | 汇总成通过 / 有条件通过 / 不通过条件 | 可签署 |

---

## 6. 验收裁决取舍

### 6.1 是否直接沿用 SOP 的 S/A/B

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 正式验收只写 S/A/B | 符合通用模板 | 丢失 `VETO-SDK-*` 和 S0/S1 的细分边界 | 不采用 |
| B. 使用 S0/S1/S2/S3，并说明映射到 S/A/B | 承接测试方案和前序 Step | 文档略长 | 采用 |
| C. 同时保留两套等级 | 兼容性强 | 容易造成裁决歧义 | 不采用 |

### 6.2 S1 是否允许有条件通过

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许 | 放行灵活 | P0 gate 失败也可能被接受，破坏验收可信度 | 不采用 |
| B. 不允许，S1 必须修复复验 | P0 可信度稳定 | 对修复要求更严格 | 采用 |
| C. 由 reviewer 判断 | 灵活 | 标准不可重复执行 | 不采用 |

### 6.3 缺陷缺少证据时如何处理

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 直接作为 VETO | 严格 | 混淆缺证据和一票否决事实 |
| B. 阻断通过或进入验收；证据伪造、redaction fail 才按 VETO | 区分准确 | 需要证据审计配合 | 采用 |
| C. 作为 S3 | 简单 | P0 不可审计 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 缺陷分级表

| 缺陷级别 | 定义 | 对结论的影响 | 复验要求 |
|---|---|---|---|
| S0 | `VETO-SDK-*` 触发，或 P0 核心闭环、安全边界、truth 不变量被破坏 | 总体不通过；不得风险接受；不得进入发布或后续依赖 | 修复后复跑关联用例、专项、candidate / redaction / veto gate，并按影响面扩展到 PR / main / nightly |
| S1 | P0 用例、P0 gate、P0 evidence 或 P0 配置门禁失败，但未触发 VETO | 总体不通过；不得有条件通过；不得风险接受 | 修复后复跑关联 suite、受影响语言 smoke、证据生成和退出准则 |
| S2 | P1 接缝、staging-like、扩展能力或非 P0 遗留风险 | 可支撑有条件通过；不得支撑直接通过 | 必须记录 owner、期限、后续动作、复验入口和 risk acceptance |
| S3 | 文档、报告展示、低风险可维护性问题，不影响 P0 证据和实现契约 | 可通过或有条件通过 | 必须记录 owner；按影响面抽样复验或进入后续计划 |
| 未分级 | 缺陷存在但未判断等级、影响面或证据 | 不得通过或有条件通过；必要时不得进入验收 | 必须先补充分级、影响分析和证据引用 |

### 7.2 放行规则表

| 结论 | 必要条件 | 不允许出现 |
|---|---|---|
| 通过 | 无 VETO；P0 全部通过；无 S0/S1；无未接受 S2/S3；证据完整；签署完成 | `latest` 证据、未分级缺陷、未接受风险 |
| 有条件通过 | 无 VETO；P0 全部通过；无 S0/S1；仅剩已接受 S2/S3 或 P1/P2 risk；risk acceptance 完整 | S0/S1、P0 gate failed、risk 缺 owner / deadline / retest |
| 不通过 | 任一 VETO、S0、S1、P0 gate failed、强制证据缺失、未分级缺陷或未接受风险 | 不得写成“通过但待修复” |
| 不进入验收 | 基线、证据、handoff、veto checklist、缺陷分级或运行路径缺失 | 不得裁决正式结论 |

### 7.3 复验记录字段表

| 字段 | 作用 | 是否必填 |
|---|---|---|
| defect_id | 绑定缺陷记录 | 是 |
| severity | 记录 S0 / S1 / S2 / S3 | 是 |
| affected_ac_id | 绑定验收项 | 是 |
| affected_case_id | 绑定 `TC-SDK-*` 或专项 | 是 |
| failure_run_id | 绑定失败证据 | 是 |
| fix_commit | 绑定修复实现 | 是 |
| retest_run_id | 绑定复验证据 | 是 |
| retest_scope | 说明最小复验和扩展复验 | 是 |
| result | `passed` / `failed` / `accepted-risk` | 是 |
| owner | 缺陷或风险负责人 | 是 |
| risk_acceptance_ref | 仅 S2 / S3 或 P1/P2 risk 需要 | 条件必填 |

### 7.4 缺陷裁决流

图类型: 缺陷分级与放行裁决流

图标题: L0-sdk 缺陷裁决链

```text
test / review failure
  |
  v
classify defect
  |
  +-- VETO / S0 --> final result: not accepted
  |                 risk acceptance: forbidden
  |
  +-- S1 ---------> fix required
  |                 retest required
  |                 final result before fix: not accepted
  |
  +-- S2 ---------> risk acceptance required
  |                 conditional acceptance only
  |
  +-- S3 ---------> open issue or scheduled fix
  |                 pass allowed if evidence truth is unaffected
  |
  +-- unclassified -> do not enter or finish acceptance
```

关键说明:

- VETO 和 S0 优先于所有其他裁决。
- S1 不可风险接受，即使没有触发 VETO，也不能有条件通过。
- S2 / S3 只有在 risk acceptance 或 open issue 记录完整时，才允许支撑有条件通过或通过。
- 未分级缺陷不是 S3；它必须先完成分级和影响分析。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_12_defects_release.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“缺陷分级表”“放行规则表”“复验记录字段表”和“缺陷裁决流”小节，了解本章如何从测试方案的缺陷管理规则收敛为验收放行规则。

L0-sdk 的验收缺陷分为 S0、S1、S2、S3。S0 对应一票否决或 P0 核心闭环、安全边界、truth 不变量被破坏；S1 对应 P0 用例、P0 gate、P0 evidence 或 P0 配置门禁失败，但未触发一票否决；S2 对应 P1 接缝、staging-like、扩展能力或非 P0 遗留风险；S3 对应不影响 P0 证据和实现契约的文档、报告展示或低风险可维护性问题。

任一 `VETO-SDK-*`、S0 或 S1 存在时，验收结论必须为“不通过”。S0 / S1 不允许通过 `reports/acceptance/risk-acceptance.md` 转为有条件通过。S2 / S3 或 P1 / P2 risk 可以支撑“有条件通过”，但必须记录 owner、影响范围、接受原因、到期条件、后续动作和复验入口。

缺陷修复后必须保留失败证据、修复证据、影响分析和复验证据。复验证据至少绑定 defect id、affected AC id、affected case id、failure run id、fix commit、retest run id、retest scope、result 和 owner。涉及 security、redaction、artifact、report 或 evidence 的缺陷，必须附 redaction / forbidden field scan 结果。

通过结论要求无 VETO、P0 全部通过、无 S0 / S1、无未接受 S2 / S3、证据完整且签署完成。有条件通过要求无 VETO、P0 全部通过、无 S0 / S1，仅剩已接受 S2 / S3 或 P1 / P2 risk。不通过要求阻断项、失败证据、整改入口和复验要求明确。基线、证据、handoff、veto checklist、缺陷分级或运行路径缺失时，不得进入正式验收裁决。

---

## 9. 决策记录

| 决策点 | 可选方案 | 采用方案 | 原因 |
|---|---|---|---|
| 严重度体系 | A. S/A/B；B. S0/S1/S2/S3；C. 两套并行 | 采用 B，并说明映射 | 承接 L0-sdk 测试方案和前序验收 Step |
| S1 是否可风险接受 | A. 可接受；B. 不可接受 | 采用 B | S1 代表 P0 失败，风险接受会削弱验收可信度 |
| 缺证据是否等同 VETO | A. 等同；B. 阻断通过，伪造 / redaction fail 才是 VETO | 采用 B | 区分证据不完整和红线事实 |
| 有条件通过的适用范围 | A. 包含 S1；B. 仅 S2/S3/P1/P2 risk | 采用 B | 与 Step 10 和 Step 11 一致 |
| 复验粒度 | A. 只写复验通过；B. 绑定 defect / case / suite / run / commit | 采用 B | 支撑审计和复现 |

---

## 10. 进入下一步检查

| 检查项 | 状态 |
|---|---|
| SOP 问题已逐项回答 | 已满足 |
| 缺陷分级表已定义 | 已满足 |
| 复验规则已定义 | 已满足 |
| 放行规则已定义 | 已满足 |
| 缺陷规则与一票否决项一致 | 已满足 |
| 缺陷对结论的影响可判定 | 已满足 |
| 正式文档未修改 | 已满足 |

结论: 可以进入 Step 13,定义风险接受与遗留项。
