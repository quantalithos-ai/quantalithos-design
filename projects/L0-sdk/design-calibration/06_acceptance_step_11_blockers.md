# L0-sdk 06 验收标准 Step 11: 一票否决项

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 11 中间产物。
> 本步定义任何情况下都不能通过验收、不能被风险接受覆盖的一票否决项。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 11 |
| 主题 | 定义一票否决项 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §11 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §14.2 | 已完成 | 提取原始一票否决项 |
| `01-架构设计.md` §13 / §15 | 已完成 | 提取横切红线和架构风险 |
| `03-详细设计.md` §9~§14 | 已完成 | 提取状态门禁、事务、错误、幂等、配置和观测不变量 |
| `04-配置设计.md` §8 / §11 / §12 | 已完成 | 提取 raw secret、forbidden toggle 和 fail-fast / fail-closed 红线 |
| `05-测试方案.md` §11 / §12 / §14 | 已完成 | 提取 S0 定义、复验规则和残余风险边界 |
| `06_acceptance_step_06_boundary_gate.md` | 已确认 | 继承数据边界和架构红线 S0 候选 |
| `06_acceptance_step_09_nonfunctional.md` | 已确认 | 继承非功能阻断项和 P1/P2 非范围边界 |
| `06_acceptance_step_10_evidence_audit.md` | 已确认 | 继承 veto checklist、redaction check 和 risk acceptance 不可覆盖 S0 / S1 的规则 |

---

## 3. SOP 问题回答

### 3.1 哪些失败会直接导致不通过?

以下失败直接导致总体结论为“不通过”。它们不是普通 S1 缺陷，也不能通过风险接受转为有条件通过。

| 类别 | 直接不通过的失败 |
|---|---|
| truth 边界 | SDK 重定义 `L0-core` / `L0-bus` truth，或拥有服务端 / runtime / UI truth |
| 三语言闭环 | Rust / Python / TypeScript 任一语言缺失，或核心语义出现不可接受漂移 |
| 最小接入 | 没有 local package candidate，或没有稳定服务边界 / fake / fixture endpoint 支撑最小验证 |
| 安全泄露 | raw secret、token、private key、credential value、request / response / payload body 任一泄露 |
| auth / governance | SDK 执行身份认证、权限裁决、治理审批或服务端业务编排 |
| fake 污染 | fake-only success 被标成 production supported，或支撑 candidate `Stable` |
| candidate gate | skipped、failed、unredacted、missing evidence 或 incompatible decision 支撑 `Verified` / `Stable` |
| 配置绕过 | 配置关闭 redaction、credential protection、fake marker、evidence 或 compatibility gate |
| 只读 / runtime 边界 | Query、projection rebuild、runtime boundary call 写 SDK truth |
| 兼容演进 | breaking / deprecated 无 compatibility decision、migration ref 或 deprecated lifecycle 记录 |
| 证据安全 | redaction check 失败，或证据 / report 反向补造 truth、跨 run 拼接伪证据 |

### 3.2 否决项来自哪个需求或设计红线?

| 来源 | 提供的红线 |
|---|---|
| `00-需求文档.md` §14.2 | 双 truth、三语言闭环缺失、最小接入不可验证、敏感泄露、保存 forbidden body、auth / governance 越界、兼容演进不可追溯 |
| `06_acceptance_step_06_boundary_gate.md` | core / bus / service truth、raw secret、fake success、query / projection / runtime 写 truth、P1/P2 污染 |
| `06_acceptance_step_08_state_tx_consistency.md` | 未验证 candidate stable、非法状态推进、query / projection / runtime 写 truth |
| `06_acceptance_step_09_nonfunctional.md` | redaction 泄露、三语言漂移、fake-only stable、forbidden config |
| `06_acceptance_step_10_evidence_audit.md` | redaction check 失败、veto checklist 缺失、risk acceptance 不得覆盖 S0 / S1 |
| `05-测试方案.md` §11 | S0 是一票否决或 P0 核心闭环破坏，不允许风险接受 |

### 3.3 否决项如何检查?

检查必须优先从 `reports/acceptance/veto-checklist.md` 读取结论，再回链到 `reports/runs/<run_id>` 和 `artifacts/test/<run_id>`。

| 检查类别 | 主要证据 |
|---|---|
| truth / dependency | dependency snapshot、contract compile、`EV-SDK-CONTRACT-001`、`EV-SDK-EVENT-001` |
| 三语言一致性 | semantic baseline、cross-language smoke、`EV-SDK-SEMANTIC-001`、`EV-SDK-SMOKE-001` |
| 最小接入 | boundary / docs / smoke evidence、`EV-SDK-BOUNDARY-001`、`EV-SDK-DOCS-001` |
| 安全 / redaction | `reports/runs/<run_id>/redaction-check.md`、`EV-SDK-SECURITY-001` |
| auth / governance | DTO / API / docs / config scan、`EV-SDK-SECURITY-002` |
| fake / candidate gate | boundary evidence、candidate evidence、compat evidence |
| 配置 | config validation evidence、`EV-SDK-CONFIG-001` |
| 只读 / runtime 边界 | consistency / idempotency / recovery evidence |
| 兼容演进 | `EV-SDK-COMPAT-001`、migration ref、deprecated lifecycle evidence |
| 证据安全 | evidence-index、gate-results、redaction-check、handoff、artifact path check |

### 3.4 否决项是否允许风险接受?

不允许。`reports/acceptance/risk-acceptance.md` 只能接受 S2 / S3 或 P1 / P2 risk。任一 `VETO-SDK-*` 被触发时，最终结论只能是不通过。

### 3.5 否决项是否覆盖所有 P0 红线?

覆盖。本步将需求一票否决、架构红线、详细设计关键不变量、安全 / 合规要求、证据安全门禁统一收口为 `VETO-SDK-001`~`VETO-SDK-011`。普通 P0 用例失败但未触发这些红线时，不写成 VETO，留给 Step 12 按 S1 处理。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 否决项来源分散 | 需求、边界、非功能、证据章节都有 S0 候选 | 验收时遗漏或重复裁决 | 本步统一编号 `VETO-SDK-*` |
| 普通 P0 失败和一票否决容易混淆 | S1 也会阻断通过，但不是不可风险接受的红线 | 缺陷分级失真 | 本步只收口 S0 / VETO，S1 留给 Step 12 |
| 证据缺失和证据伪造容易混淆 | 缺证据可能阻断送验，伪造证据是红线 | 误把所有缺证据都写成 VETO | 本步只把 redaction fail、伪造 / 拼接 / 反向补 truth 写成 VETO |
| P1/P2 未完成容易被误判为 VETO | public registry、real credential、production endpoint 不在 P0 | 范围膨胀 | 本步仅在 P1/P2 污染 P0 truth / gate 时触发 VETO |
| risk acceptance 可能被滥用 | S0 被包装成可接受风险 | 验收结论失真 | 本步明确 VETO 不允许风险接受 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 否决项编号 | 只有需求 bullet 和 S0 描述 | `VETO-SDK-001`~`VETO-SDK-011` | 可引用 |
| 来源追溯 | 分散在 `00`、`05`、Step 6~10 | 每个 VETO 绑定来源和证据 | 可审计 |
| 风险接受 | 只说 S0 不可接受 | 明确 VETO 不得被 `risk-acceptance.md` 覆盖 | 可签署 |
| 证据口径 | redaction / veto / risk 分散 | 统一要求 `veto-checklist.md` 裁决 | 可复查 |
| P1/P2 | 容易误升为阻断 | 仅污染 P0 时触发 VETO | 不越界 |

---

## 6. 验收设计取舍

### 6.1 是否把所有 P0 失败都写成一票否决

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全部 P0 失败都是 VETO | 简单严格 | S1 / S0 无法区分，风险接受体系失效 | 不采用 |
| B. 只有破坏 P0 核心闭环、安全边界或 truth 不变量的失败是 VETO | 边界清晰 | Step 12 仍需处理 S1 | 采用 |
| C. 不定义 VETO，只按缺陷分级处理 | 文档更短 | 一票否决不可审计 | 不采用 |

### 6.2 是否把证据缺失写成 VETO

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 任一证据缺失都是 VETO | 严格 | 缺证据和红线事实混淆 |
| B. 缺证据阻断通过或送验，证据伪造 / redaction fail / 反向补 truth 是 VETO | 裁决准确 | 需要 Step 10 证据门禁配合 | 采用 |
| C. 证据问题只作为 S2 | 太宽松 | P0 不可审计 | 不采用 |

### 6.3 是否允许 P1/P2 未完成触发 VETO

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. P1/P2 未完成就是 VETO | 极严格 | 与 P0 范围冲突 |
| B. P1/P2 未完成不触发，除非污染 P0 语义、truth 或 gate | 符合范围 | 需要 handoff 明确非范围 | 采用 |
| C. 完全不检查 P1/P2 | 简单 | 容易误声明已交付 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 一票否决项表

| 否决项 ID | 否决项 | 原因 | 证据 / 检查方式 |
|---|---|---|---|
| VETO-SDK-001 | SDK 重定义 `L0-core` 或 `L0-bus` truth | 双 truth 会破坏官方客户端接入层边界 | dependency snapshot、contract compile、`EV-SDK-CONTRACT-001`、`EV-SDK-EVENT-001` |
| VETO-SDK-002 | SDK 拥有服务端业务 truth、runtime truth、UI truth 或 auth / governance truth | SDK 不是服务端、runtime、UI、identity、gateway 或 governance | boundary scan、DTO / API / docs / config scan、`EV-SDK-SECURITY-002` |
| VETO-SDK-003 | 三语言官方客户端闭环缺失或核心语义漂移 | Rust / Python / TypeScript 是 P0 official SDK 闭环 | semantic baseline、package surface compare、`EV-SDK-SEMANTIC-001`、`EV-SDK-SMOKE-001` |
| VETO-SDK-004 | 没有 local package candidate，或没有 stable boundary / fake / fixture endpoint 导致最小接入不可验证 | 最小可验证接入是 P0 核心闭环 | candidate evidence、boundary evidence、docs / smoke evidence |
| VETO-SDK-005 | raw secret、token、private key、credential value、request / response / payload body 泄露 | 安全和合规红线，泄露次数必须为 0 | `redaction-check.md`、`EV-SDK-SECURITY-001` |
| VETO-SDK-006 | fake-only success 污染 production supported 或 candidate `Stable` | fake 只能证明最小接入，不代表正式生产能力 | `TC-SDK-BOUNDARY-003`、candidate gate、fake marker evidence |
| VETO-SDK-007 | skipped、failed、unredacted、missing evidence 或 incompatible decision 支撑 `Verified` / `Stable` | candidate gate 必须由 passed + redacted + compatibility 支撑 | candidate、evidence、compatibility、docs / smoke gate evidence |
| VETO-SDK-008 | 配置关闭 redaction、credential protection、fake marker、evidence 或 compatibility gate | 配置不得绕开设计红线 | config validation、`EV-SDK-CONFIG-001` |
| VETO-SDK-009 | Query、projection rebuild、runtime boundary call 写 SDK truth | 只读 / runtime 边界写 truth 会形成隐藏副作用 | consistency、boundary、projection rebuild evidence |
| VETO-SDK-010 | breaking / deprecated 缺 compatibility decision、migration ref 或 deprecated lifecycle 记录 | 兼容演进不可追溯会破坏三语言升级承诺 | `EV-SDK-COMPAT-001`、migration guide ref、deprecated lifecycle evidence |
| VETO-SDK-011 | 验收证据被伪造、跨 run 拼接、使用 `latest` 作为正式结论或反向补造 truth | 验收不可审计，且可能掩盖红线事实 | evidence-index、gate-results、handoff、artifact path check、review notes |

### 7.2 VETO 与前序门禁映射表

| VETO | 前序门禁 | 主要测试 / 证据 |
|---|---|---|
| VETO-SDK-001 | `AC-RED-001`、`AC-RED-002` | `TC-SDK-CONTRACT-*`、`TC-SDK-EVENT-*` |
| VETO-SDK-002 | `AC-RED-003`、`AC-RED-004`、`AC-NFR-003` | `SPECIAL-SDK-SEC-002` |
| VETO-SDK-003 | `AC-FUNC-002`、`AC-FUNC-009`、`AC-NFR-010` | semantic / smoke evidence |
| VETO-SDK-004 | `AC-FUNC-003`、`AC-FUNC-007`、`AC-NFR-006` | boundary / candidate / docs / smoke |
| VETO-SDK-005 | `AC-BOUND-003`、`AC-RED-005`、`AC-NFR-002`、`AC-EV-003` | redaction check |
| VETO-SDK-006 | `AC-RED-006`、`AC-STATE-002` | fake marker / boundary gate |
| VETO-SDK-007 | `AC-RED-007`、`AC-STATE-003`、`AC-STATE-004`、`AC-STATE-005` | candidate / evidence / compat |
| VETO-SDK-008 | `AC-RED-008`、`AC-NFR-004` | config validation |
| VETO-SDK-009 | `AC-BOUND-004`、`AC-BOUND-005`、`AC-TX-003` | consistency / projection / boundary |
| VETO-SDK-010 | `AC-FUNC-010`、`AC-NFR-009` | compatibility / deprecated evidence |
| VETO-SDK-011 | `AC-BOUND-006`、`AC-EV-001`~`AC-EV-009` | reports / artifacts / handoff / review |

### 7.3 VETO 裁决流

图类型: 一票否决裁决流

图标题: L0-sdk 一票否决裁决链

```text
reports/acceptance/veto-checklist.md
  |
  v
check VETO-SDK-001..011
  |
  +-- any triggered --> final result: not accepted
  |                    risk acceptance: forbidden
  |
  +-- none triggered -> continue Step 12 defect grading
                       S1 / S2 / S3 / P1 / P2 risk
```

关键说明:

- VETO 触发时，最终结论只能是不通过。
- VETO 不允许通过 `risk-acceptance.md` 覆盖。
- 没触发 VETO 不代表验收通过，还需要 Step 12~14 裁决缺陷、风险和签署。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_11_blockers.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“一票否决项表”“VETO 与前序门禁映射表”和“VETO 裁决流”小节，了解本章如何把需求红线、架构红线、详细设计不变量、安全 / 合规要求收口为不可风险接受的否决项。

L0-sdk 的一票否决项以 `VETO-SDK-001`~`VETO-SDK-011` 为正式裁决入口。任一 VETO 被触发时，最终验收结论必须为“不通过”，且不得通过 `reports/acceptance/risk-acceptance.md` 转为有条件通过。

一票否决项必须通过 `reports/acceptance/veto-checklist.md` 逐项裁决，并回链到 `reports/runs/<run_id>` 和 `artifacts/test/<run_id>`。如果 veto checklist 缺失或任一 VETO 没有结论，不得裁决通过或有条件通过。

普通 P0 用例失败但未触发 `VETO-SDK-*` 时，不在本章升级为一票否决；它会在 Step 12 中按 S1 缺陷处理，仍然阻断通过，但不允许混淆为 S0。

---

## 9. 待确认事项

当前没有阻塞进入 Step 12 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否把所有 P0 失败都写成一票否决 | A. 全部写入；B. 仅核心闭环、安全边界和 truth 不变量写入 | 采用 B | 保持 S0 / S1 分级清晰 |
| 证据缺失是否都是 VETO | A. 是；B. 缺证据阻断通过，伪造 / 拼接 / redaction fail 才是 VETO | 采用 B | 区分不可审计和红线事实 |
| P1/P2 未完成是否触发 VETO | A. 是；B. 否，除非污染 P0 | 采用 B | 符合 P0 范围 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 直接导致不通过的失败已定义 | 已满足 |
| 每个否决项来源已说明 | 已满足 |
| 每个否决项检查方式已定义 | 已满足 |
| 明确一票否决不得风险接受 | 已满足 |
| 覆盖需求红线、架构红线、详细设计不变量和安全 / 合规要求 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 12,定义缺陷分级、复验与放行规则。
