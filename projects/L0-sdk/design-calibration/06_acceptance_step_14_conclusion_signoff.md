# L0-sdk 06 验收标准 Step 14: 最终结论与签署口径

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 14 中间产物。
> 本步定义最终验收结论只能如何表达、何时允许进入下一阶段、何时允许发布准备、哪些角色必须签署。
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
| `06_acceptance_step_04_entry_exit.md` | 已确认 | 继承三值退出结论和签署前提 |
| `06_acceptance_step_05_function_gate.md` | 已确认 | 继承功能验收门禁结论 |
| `06_acceptance_step_06_boundary_gate.md` | 已确认 | 继承数据边界和架构红线结论 |
| `06_acceptance_step_07_interface_sync_gate.md` | 已确认 | 继承接口、事件和跨仓同步结论 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已确认 | 继承状态机、事务和一致性结论 |
| `06_acceptance_step_09_nonfunctional.md` | 已确认 | 继承非功能门禁结论 |
| `06_acceptance_step_10_evidence_audit.md` | 已确认 | 继承证据、审计和报告结论 |
| `06_acceptance_step_11_blockers.md` | 已确认 | 继承一票否决结论 |
| `06_acceptance_step_12_defects_release.md` | 已确认 | 继承缺陷分级和放行规则 |
| `06_acceptance_step_13_risk_acceptance.md` | 已确认 | 继承风险接受和遗留项规则 |

---

## 3. SOP 问题回答

### 3.1 结论只能有哪些取值?

正式验收结论只能有三个取值：通过、有条件通过、不通过。

| 结论 | 定义 | 使用限制 |
|---|---|---|
| 通过 | P0 全部通过，无 VETO、S0、S1、未接受风险和证据缺口 | 可进入下一阶段；可进入当前 P0 范围内的发布准备 |
| 有条件通过 | P0 全部通过，无 VETO、S0、S1，仅剩已接受 S2 / S3 或 P1 / P2 risk | 可有限进入下一阶段；发布准备不得覆盖未接受或非范围能力 |
| 不通过 | 任一 VETO、S0、S1、P0 gate failed、关键证据缺失或未接受风险存在 | 不得进入下一阶段；必须给出整改和复验入口 |

`不进入验收` 不是最终结论，而是签署前阻断状态。出现基线未固定、handoff 缺失、证据路径非法、缺陷未分级、veto checklist 缺失或 `latest` 被用于正式证据时，不得生成最终结论。

### 3.2 何时允许进入下一阶段?

| 总体结论 | 是否允许进入下一阶段 | 条件 |
|---|---|---|
| 通过 | 允许 | 交付范围、证据、签署完整 |
| 有条件通过 | 有条件允许 | 下一阶段不得依赖未关闭风险；risk acceptance 和 open issues 必须完整 |
| 不通过 | 不允许 | 必须完成整改、复验并重新裁决 |
| 签署前阻断状态 | 不允许 | 必须先补齐基线、证据、缺陷分级或 handoff |

### 3.3 何时允许发布准备?

发布准备必须按声明范围裁决。L0-sdk 的当前 P0 发布准备只允许指向 local package candidate 和最小可验证接入，不代表 public registry 正式发布。

| 发布准备类型 | 允许条件 | 不允许条件 |
|---|---|---|
| local package candidate 准备 | 总体通过，或有条件通过且风险不影响 candidate | P0 gate failed、candidate `Stable` 证据不完整、fake-only stable |
| public registry 发布准备 | 必须另有 release / operations 专项闭环 | 当前只凭 L0-sdk P0 验收不得声明公网发布完成 |
| production endpoint 接入准备 | 对应 service API stable 且真实 endpoint 验证完成 | 仅有 fake / fixture evidence |
| documentation / quickstart 发布准备 | docs / smoke / redaction / evidence gate 通过 | quickstart 依赖未验证 endpoint、泄露 raw secret 或使用 `latest` 证据 |

### 3.4 哪些角色必须签署?

签署角色分为必签角色和条件签署角色。必签角色用于确认本轮 P0 验收结论；条件签署角色只在对应风险、专项或发布范围出现时必须签署。

| 角色 | 是否必签 | 签署责任 |
|---|---|---|
| acceptance owner | 必签 | 确认总体结论、范围、证据、风险接受和签署完整 |
| SDK maintainer | 必签 | 确认 SDK 实现、三语言 surface、candidate 和兼容演进符合设计 |
| test owner | 必签 | 确认测试 gate、reports、artifacts、复验证据和缺陷状态 |
| security reviewer | 条件必签 | 涉及 credential、redaction、raw body、secret provider 或安全风险时签署 |
| architecture owner | 条件必签 | 涉及架构边界、P1/P2 生态入口或跨仓范围裁剪时签署 |
| release / operations owner | 条件必签 | 涉及 public registry、发布、签名、撤回、回滚或运维风险时签署 |
| service capability owner | 条件必签 | 涉及 production endpoint、全量服务 client coverage 或服务 API stable 风险时签署 |
| configuration owner | 条件必签 | 涉及 remote config、hot reload、配置 profile 或 forbidden toggle 风险时签署 |

### 3.5 签署是否代表风险接受?

不必然代表。最终签署确认的是“验收结论成立”。风险接受必须单独记录在 `reports/acceptance/risk-acceptance.md`，并且每项风险必须有明确 accepter。签署人可以同时作为某项风险的 accepter，但必须在 risk acceptance 记录中显式列出。

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 最终结论和签署前阻断状态容易混淆 | `不进入验收` 可能被写成最终结论 | 结论不符合 SOP 三值口径 | 本步明确正式结论只能三值 |
| 有条件通过可能被理解为可无限放行 | S2/P1 风险可能影响下一阶段 | 后续阶段依赖未完成能力 | 本步限定下一阶段不得依赖未关闭风险 |
| 发布准备范围容易夸大 | local candidate 可能被误读为 public registry 发布 | 验收结论过度声明 | 本步按发布准备类型拆分 |
| 签署和风险接受边界不清 | 签署人可能被默认视为接受所有风险 | 责任不清 | 本步要求 risk acceptance 单独列 accepter |
| 条件签署角色未定义 | 安全、发布、配置等风险可能没人签 | 风险无人负责 | 本步定义条件签署触发条件 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 结论取值 | 通过 / 有条件通过 / 不通过分散在前序 Step | 本步统一为唯一正式取值 | 禁止模糊结论 |
| 签署前阻断 | 可能混入最终结论 | 明确只是不得签署的状态 | 裁决清楚 |
| 下一阶段 | 只说明通过或有条件通过 | 明确有条件通过不得依赖未关闭风险 | 防止风险外溢 |
| 发布准备 | 未区分 local candidate 和 public registry | 分 local / public / production / docs 准备 | 防止过度声明 |
| 签署责任 | 角色散落 | 必签和条件签署角色统一列出 | 可执行 |

---

## 6. 验收裁决取舍

### 6.1 是否把“不进入验收”作为第四种结论

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 作为第四种正式结论 | 表达直观 | 违反 SOP 三值结论，签署口径变复杂 | 不采用 |
| B. 作为签署前阻断状态，不作为最终结论 | 保持三值结论稳定 | 需要在进入条件中说明 | 采用 |
| C. 并入“不通过” | 简单 | 混淆“没有裁决基础”和“裁决失败” | 不采用 |

### 6.2 有条件通过是否允许进入下一阶段

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 完全允许 | 推进最快 | 下阶段可能依赖未完成风险 |
| B. 有条件允许，下一阶段不得依赖未关闭风险 | 兼顾推进和边界 | 需要风险表和 open issues 配合 | 采用 |
| C. 不允许 | 最严格 | 无法表达低风险遗留项 | 不采用 |

### 6.3 签署是否自动代表风险接受

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 自动代表 | 文件少 | 风险责任不清 |
| B. 不自动代表；风险接受必须单独列 accepter | 责任明确 | 需要额外记录 | 采用 |
| C. 由 acceptance owner 统一接受全部风险 | 简单 | 不符合分域责任 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 结论表

| 维度 | 结论 | 说明 |
|---|---|---|
| 功能验收 | 通过 / 有条件通过 / 不通过 | 由 §5 功能门禁、P0 case、candidate 和 docs / smoke 证据裁决 |
| 数据边界与架构红线 | 通过 / 不通过 | 红线不允许有条件通过；触发 VETO 时总体不通过 |
| 接口、事件与跨仓同步 | 通过 / 有条件通过 / 不通过 | P0 contract / event 必须通过；P1/P2 非范围可风险接受 |
| 状态机、事务与一致性 | 通过 / 不通过 | P0 状态、事务、幂等、一致性失败不得有条件通过 |
| 非功能验收 | 通过 / 有条件通过 / 不通过 | P0 redaction / security 必须通过；固定性能阈值可作为残余风险 |
| 可观测性、审计与证据 | 通过 / 不通过 | 证据链不可审计不得通过；`latest` 不得作为正式结论证据 |
| 缺陷与复验 | 通过 / 有条件通过 / 不通过 | S0/S1 不通过；已接受 S2/S3 可有条件通过 |
| 风险接受与遗留项 | 通过 / 有条件通过 / 不通过 | 无风险为通过；已接受风险为有条件通过；未接受风险为不通过 |
| 发布准备 | 通过 / 有条件通过 / 不通过 | 当前 P0 只覆盖 local package candidate，不覆盖 public registry |
| 总体结论 | 通过 / 有条件通过 / 不通过 | 取所有维度中最严格结论 |
| 是否允许进入下一阶段 | 是 / 有条件 / 否 | 通过为是；有条件通过为有条件；不通过为否 |

### 7.2 签署表

| 角色 | 姓名 / 责任 | 结论 | 日期 |
|---|---|---|---|
| acceptance owner | 确认总体结论、签署范围和风险接受完整 | 通过 / 有条件通过 / 不通过 | `<YYYY-MM-DD>` |
| SDK maintainer | 确认 SDK 实现、三语言 surface、candidate 和兼容演进 | 通过 / 有条件通过 / 不通过 | `<YYYY-MM-DD>` |
| test owner | 确认测试 gate、reports、artifacts、复验和缺陷状态 | 通过 / 有条件通过 / 不通过 | `<YYYY-MM-DD>` |
| security reviewer | 条件签署：credential / redaction / secret / body / security risk | 通过 / 有条件通过 / 不通过 / 不适用 | `<YYYY-MM-DD>` |
| architecture owner | 条件签署：架构边界、生态入口或跨仓裁剪风险 | 通过 / 有条件通过 / 不通过 / 不适用 | `<YYYY-MM-DD>` |
| release / operations owner | 条件签署：public registry、发布、签名、撤回、回滚 | 通过 / 有条件通过 / 不通过 / 不适用 | `<YYYY-MM-DD>` |
| service capability owner | 条件签署：production endpoint 或全量服务 client coverage | 通过 / 有条件通过 / 不通过 / 不适用 | `<YYYY-MM-DD>` |
| configuration owner | 条件签署：remote config、hot reload、profile 或 forbidden toggle | 通过 / 有条件通过 / 不通过 / 不适用 | `<YYYY-MM-DD>` |

### 7.3 最终裁决流

图类型: 最终结论与签署裁决流

图标题: L0-sdk 最终验收裁决链

```text
acceptance handoff + fixed run_id
  |
  v
check entry prerequisites
  |
  +-- missing baseline / evidence / classification -> no final conclusion
  |
  v
evaluate gates and VETO
  |
  +-- VETO / S0 / S1 / P0 failed -> final result: not accepted
  |
  +-- P0 passed + accepted S2/S3/P1/P2 risk
  |       |
  |       v
  |   final result: conditionally accepted
  |
  +-- P0 passed + no open accepted risk
          |
          v
      final result: accepted
          |
          v
      signoff table + risk acceptance refs
```

关键说明:

- 最终结论取所有维度中最严格结论。
- “有条件通过”不能掩盖 P0 失败，只能承载已接受的 S2/S3/P1/P2 risk。
- 签署表确认结论成立；风险接受必须另见 `reports/acceptance/risk-acceptance.md`。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_14_conclusion_signoff.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结论表”“签署表”和“最终裁决流”小节，了解本章如何把前序门禁、缺陷规则和风险接受收敛成最终签署口径。

L0-sdk 的正式验收结论只能是通过、有条件通过、不通过。`不进入验收` 不是最终结论，而是签署前阻断状态；当基线、handoff、证据路径、缺陷分级、veto checklist 或固定 `run_id` 缺失时，不得生成最终结论。

通过要求 P0 全部通过，无 `VETO-SDK-*`、S0、S1、未接受风险和证据缺口。有条件通过要求 P0 全部通过，无 `VETO-SDK-*`、S0、S1，仅剩已接受 S2 / S3 或 P1 / P2 risk。不通过适用于任一一票否决、S0、S1、P0 gate failed、关键证据缺失、未接受风险或签署不完整。

进入下一阶段的规则是：通过可以进入；有条件通过可以有限进入，但下一阶段不得依赖未关闭风险；不通过不得进入。发布准备必须按声明范围裁决，当前 P0 只覆盖 local package candidate 和最小可验证接入，不代表 public registry、production endpoint 全量接入或真实 credential provider 已完成。

最终签署至少需要 acceptance owner、SDK maintainer 和 test owner。security reviewer、architecture owner、release / operations owner、service capability owner、configuration owner 在对应风险、专项或发布范围出现时必须签署。签署不自动代表风险接受；风险接受必须单独写入 `reports/acceptance/risk-acceptance.md`，并列出具体 accepter。

---

## 9. 决策记录

| 决策点 | 可选方案 | 采用方案 | 原因 |
|---|---|---|---|
| 结论取值 | A. 三值；B. 加入不进入验收；C. 自由文本 | 采用 A | 符合 SOP，禁止模糊结论 |
| 不进入验收如何表达 | A. 第四结论；B. 签署前阻断状态；C. 并入不通过 | 采用 B | 区分无裁决基础和裁决失败 |
| 有条件通过能否进入下一阶段 | A. 完全允许；B. 有条件允许；C. 不允许 | 采用 B | 不阻塞低风险遗留，但防止风险外溢 |
| 发布准备是否等同 public registry | A. 等同；B. 不等同，按范围裁决 | 采用 B | 当前 P0 只证明 local candidate |
| 签署是否自动接受风险 | A. 是；B. 否，风险接受单独记录 | 采用 B | 风险责任必须可追溯 |

---

## 10. 进入下一步检查

| 检查项 | 状态 |
|---|---|
| SOP 问题已逐项回答 | 已满足 |
| 结论取值已限定 | 已满足 |
| 进入下一阶段规则已定义 | 已满足 |
| 发布准备规则已定义 | 已满足 |
| 必签和条件签署角色已定义 | 已满足 |
| 签署与风险接受边界已定义 | 已满足 |
| 结论和签署口径完整 | 已满足 |
| 正式文档未修改 | 已满足 |

结论: 可以进入 Step 15,整理正式 `06-验收标准.md`。
