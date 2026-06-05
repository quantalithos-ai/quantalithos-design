# Step 14. 定义最终结论与签署口径

> 本文件是 `projects/L1-work/06-验收标准.md` 的 Step 14 中间产物。
> 本步定义最终结论三值口径、进入下一阶段 / 发布准备规则、签署角色和签署记录字段。
> 本步不填写真验收结论,不替代风险接受记录,不整理正式 `06-验收标准.md`。

## 1. Step 状态

- 状态: `[x] 已确认`
- 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 14
- 回填章节: `projects/L1-work/06-验收标准.md` §14 最终结论与签署
- 生成日期: 2026-06-04

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| `design-calibration/06_acceptance_step_04_entry_exit.md` | 进入 / 退出条件、三值结论、签署归档 | 最终裁决前置条件 |
| Step 5~10 中间产物 | 功能、红线、接口、状态、非功能和证据门禁 | 维度结论来源 |
| `design-calibration/06_acceptance_step_11_veto.md` | 一票否决项和 veto checklist 规则 | 不通过优先级来源 |
| `design-calibration/06_acceptance_step_12_defect_retest_release.md` | S / A / B / C 缺陷和复验规则 | 缺陷对结论影响来源 |
| `design-calibration/06_acceptance_step_13_risk_acceptance.md` | 风险接受与遗留项 | 有条件通过来源 |
| `05-测试方案.md` §12~§14 | 退出准则、报告证据、残余风险和风险移交 | release / evidence 裁决来源 |

已确认结论:

```text
最终结论只允许通过 / 有条件通过 / 不通过。
禁止使用“基本通过”“原则上通过”“大体可用”“后续补齐”等模糊结论。
签署不自动代表风险接受;风险必须先在 `reports/acceptance/risk-acceptance.md` 中由具名接受人接受。
最终结论必须绑定固定文档基线、implementation commit、build / source baseline、run_id、reports 和 acceptance handoff。
```

## 3. SOP 问题回答

### 3.1 结论只能有哪些取值?

只允许三值:

| 结论 | 允许条件 | 禁止条件 |
|---|---|---|
| 通过 | P0 全部通过;无 veto failed;无 S / P0 A / release blocker;证据完整;无需要接受的残余风险或残余风险已关闭 | 存在任何未接受风险、未关闭阻断缺陷或证据缺口 |
| 有条件通过 | P0 主线通过;无 veto failed;无 S / P0 A / release blocker;证据完整;仅存在已正式接受的 B / C、P1/P2 或非阻断风险 | 风险无接受人、无 owner、无后续动作、无截止时间,或风险属于不可接受项 |
| 不通过 | 任一 P0 gate failed、veto failed、S 级、P0 A、release redline、P0 evidence 缺失、redaction failed、重复 truth、`latest` 证据路径或签署不完整 | 不适用 |

### 3.2 何时允许进入下一阶段?

| 裁决 | 是否允许进入下一阶段 | 条件 |
|---|---|---|
| 通过 | 是 | 全部 P0 门禁、证据、缺陷和签署闭合 |
| 有条件通过 | 有条件 | 风险接受表完整,后续动作已分配,不可接受风险为 0 |
| 不通过 | 否 | 必须修复阻断项并重新送验 |

“下一阶段”不等于生产上线。若下一阶段包含生产化、真实依赖、secret provider、config center、hot reload 或容量 SLA 硬化,必须先完成对应 P1/P2 专项。

### 3.3 何时允许发布准备?

发布准备必须比一般下一阶段更严格。

| 场景 | 发布准备口径 |
|---|---|
| 通过 | 可以进入发布准备,前提是 release gate、redaction、evidence pack 和 veto checklist 均通过 |
| 有条件通过且仅有非发布阻断风险 | 可进入受限发布准备,不得跳过风险跟踪和补测计划 |
| 有条件通过但风险涉及 production-like、secret provider、durable store、event bus、config center、hot reload 或 release selected gate | 只能进入对应专项准备,不得宣称 production release ready |
| 不通过 | 不得进入发布准备 |

### 3.4 哪些角色必须签署?

| 角色 | 签署责任 |
|---|---|
| 验收负责人 | 确认最终三值结论、基线、证据和签署完整 |
| 产品 / 交付负责人 | 确认需求目标、P0/P1/P2 范围和有条件通过影响 |
| 架构负责人 | 确认架构边界、数据归属、依赖裁剪和生产化风险 |
| 测试负责人 | 确认证据、suite、defect、retest、redaction 和 release gate 结果 |
| 实施负责人 | 确认 implementation commit、修复项和后续实施动作 |
| 安全负责人 | 在存在 secret、redaction、authorization 或 sensitive 风险时签署 |
| 运维负责人 | 在存在 production-like、retention、config center、endpoint 或 release 准备风险时签署 |
| 风险接受人 | 仅对自己接受的风险签署,不替代总体验收签署 |

### 3.5 签署是否代表风险接受?

不代表。

签署只表示签署角色对其负责范围内的事实和裁决口径负责。风险接受必须在签署前独立完成,并在 `reports/acceptance/risk-acceptance.md` 中具备接受人、owner、后续动作、截止时间和 evidence refs。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本步处理 |
|---|---|---|---|
| 旧 `06-验收标准.md` | 最终结论口径不够稳定,容易出现“基本通过”类表述 | 无法审计是否可进入下一阶段 | 固定三值结论 |
| Step 4 | 已定义退出需要最终裁决和签署 | 尚未定义每种结论的组合条件 | 本步补齐 |
| Step 11~13 | 已定义 veto、缺陷和风险接受 | 需要汇入最终结论优先级 | 本步收口 |
| `05-测试方案.md` | 只提供测试证据和风险移交 | 不负责最终裁决 | 本步明确 `06` §14 承担裁决 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 结论取值 | 可能存在模糊结论 | 仅通过 / 有条件通过 / 不通过 | 可裁决 |
| 下一阶段 | 未与风险接受绑定 | 有条件通过只能有条件进入 | 防止风险被隐藏 |
| 发布准备 | 与下一阶段容易混同 | 发布准备必须检查 release gate 和风险类型 | 防止把专项风险伪装为 release ready |
| 签署 | 只写签署角色 | 增加基线、证据、结论和风险边界 | 可审计 |
| 风险接受 | 可能被签署覆盖 | 签署不等于风险接受 | 防止无主风险 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只输出总体结论 | 简洁 | 无法定位功能、证据、风险或发布准备差异 | 不采用 |
| 方案 B: 输出维度结论、总体结论、下一阶段 / 发布准备和签署表 | 可复核,能支持三值裁决 | 表更多,真实验收时需要逐项填写 | 采用 |
| 方案 C: 把签署视为自动风险接受 | 流程短 | 风险责任不清,与 Step 13 冲突 | 不采用 |

推荐方案 B。

原因:

- 最终验收需要同时看 P0 门禁、证据、veto、缺陷、风险和签署。
- 发布准备比一般进入下一阶段更严格,必须单独裁决。
- 风险接受必须可追踪到具名接受人,不能靠总签署覆盖。

## 7. 结构化中间产物

### 7.1 结论判定表

| 维度 | 通过 | 有条件通过 | 不通过 |
|---|---|---|---|
| 功能验收 | `AC-WORK-001`~`013` 和对应 P0 `TC / EV` 全部通过 | P0 功能通过,仅有已接受的 B / C 风险 | 任一 P0 功能 gate failed |
| 数据边界与架构红线 | Work truth、外部正文排除、唯一编译期依赖、no-write 全部通过 | 不适用;红线不得风险接受 | 任一红线 failed |
| 接口、事件与跨仓同步 | P0 Command / Query / Consumer / Event / Job 协议证据完整 | P1 selected seam 风险已接受 | P0 协议 gate failed 或下游接缝污染 Work truth |
| 状态机、事务与一致性 | 合法 / 非法迁移、UoW、idempotency、dedup、commit unknown 全部通过 | 非阻断 stress 风险已接受 | 重复 truth、rollback 失败或 P0 状态 gate failed |
| 非功能验收 | P0 配置阈值、安全、恢复、幂等、观测门禁通过 | old P95、production-like 或 P2 专项风险已接受 | redaction、authorization、fake fallback、配置越界或 P0 NFR gate failed |
| 可观测性、审计与证据 | EV index、gate results、redaction、handoff、veto checklist 完整 | 仅 report 表达类 B / C 风险已接受 | 缺 P0 EV、缺 redaction、缺 veto checklist 或使用 `latest` |
| 缺陷 | 无 S / A / B / C 未关闭风险 | 仅有已接受 B / C 或非阻断风险 | 任一 S 或影响 P0 / release / evidence 的 A 未关闭 |
| 风险接受 | 无残余风险 | 残余风险全部有接受人、owner、动作、截止时间 | 存在未接受风险或不可接受风险 |
| 发布准备 | release gate、redaction、evidence pack 全部通过,无 release 风险 | 仅受限发布准备,且风险不影响 release selected gate | release gate failed、redline failed 或风险属于 production release blocker |
| 总体结论 | 全部维度通过 | P0 通过且风险接受完整 | 任一阻断项失败 |
| 是否允许进入下一阶段 | 是 | 有条件 | 否 |

### 7.2 最终结论记录表

| 维度 | 结论 | 说明 |
|---|---|---|
| 功能验收 | 通过 / 有条件通过 / 不通过 | 引用 Step 5 结论和 `EV-WORK-*` |
| 数据边界与架构红线 | 通过 / 不通过 | 红线不得有条件通过 |
| 接口、事件与跨仓同步 | 通过 / 有条件通过 / 不通过 | 区分 P0 协议和 P1 selected seam |
| 状态机、事务与一致性 | 通过 / 有条件通过 / 不通过 | 任何重复 truth 或 rollback 红线直接不通过 |
| 非功能验收 | 通过 / 有条件通过 / 不通过 | 区分硬阈值、redline 和观察项 |
| 可观测性、审计与证据 | 通过 / 有条件通过 / 不通过 | P0 evidence 缺失不得有条件通过 |
| 一票否决 | 通过 / 不通过 | 任一 veto failed 则总体不通过 |
| 缺陷与复验 | 通过 / 有条件通过 / 不通过 | 依 S / A / B / C 和复验状态裁决 |
| 风险接受 | 无风险 / 已接受 / 不完整 | 不完整时不得有条件通过 |
| 发布准备 | 是 / 有条件 / 否 | 不等于生产上线批准 |
| 总体结论 | 通过 / 有条件通过 / 不通过 | 最终裁决 |
| 是否允许进入下一阶段 | 是 / 有条件 / 否 | 绑定风险和后续动作 |

### 7.3 签署表

| 角色 | 姓名 / 责任 | 结论 | 日期 |
|---|---|---|---|
| 验收负责人 | `<name_or_role>` | 通过 / 有条件通过 / 不通过 | `<date>` |
| 产品 / 交付负责人 | `<name_or_role>` | 通过 / 有条件通过 / 不通过 | `<date>` |
| 架构负责人 | `<name_or_role>` | 通过 / 有条件通过 / 不通过 | `<date>` |
| 测试负责人 | `<name_or_role>` | 通过 / 有条件通过 / 不通过 | `<date>` |
| 实施负责人 | `<name_or_role>` | 通过 / 有条件通过 / 不通过 | `<date>` |
| 安全负责人 | `<name_or_role_or_not_applicable>` | 通过 / 有条件通过 / 不通过 / 不适用 | `<date>` |
| 运维负责人 | `<name_or_role_or_not_applicable>` | 通过 / 有条件通过 / 不通过 / 不适用 | `<date>` |
| 风险接受人 | `<risk_id:name_or_role>` | 已接受 / 拒绝 / 不适用 | `<date>` |

### 7.4 签署记录最小字段

| 字段 | 必填 | 说明 |
|---|---|---|
| `acceptance_decision_id` | 是 | 稳定验收裁决编号 |
| `document_baseline` | 是 | `00`~`06` commit / version |
| `implementation_commit` | 是 | 送验实现 commit |
| `build_ref` | 是 | build id、package、image digest 或 source delivery marker |
| `core_contracts_baseline` | 是 | core contracts commit |
| `run_id` | 是 | 固定 run id,不得为 `latest` |
| `report_refs` | 是 | `reports/runs/<run_id>` 和 `reports/acceptance/*` |
| `overall_decision` | 是 | 通过 / 有条件通过 / 不通过 |
| `conditional_risk_refs` | 有条件通过必填 | `risk_id` 列表 |
| `blocking_defect_refs` | 不通过必填 | S / A / veto / redline 缺陷 |
| `signed_by` | 是 | 签署角色、结论和日期 |
| `archive_ref` | 是 | 归档路径或记录引用 |

### 7.5 最终裁决图

#### 最终裁决图: Gate To Signoff

```text
Acceptance evidence
  -> P0 gates
  -> evidence / redaction / veto checklist
        |
        +-- blocker found
        |     -> overall decision: fail
        |
        +-- no blocker
              -> residual risks?
                    |
                    +-- no
                    |     -> overall decision: pass
                    |
                    +-- yes
                          -> risk acceptance complete?
                                |
                                +-- no -> fail or hold decision
                                +-- yes -> conditional pass
```

关键说明:

- veto、S 级、release redline 和 P0 evidence 缺失优先于风险接受。
- 有条件通过必须有完整风险接受记录。
- 签署前必须固定基线、run_id 和报告路径。
- 发布准备需要单独检查 release gate 和风险类型。

## 8. 验收输入影响判定

| 验收结论 | 是否影响上游设计 / 测试 | 影响类型 | 回写位置 | 处理状态 |
|---|---|---|---|---|
| 确认最终结论只允许通过 / 有条件通过 / 不通过 | 否 | 验收裁决规则 | 无 | 无回写 |
| 确认有条件通过必须先完成风险接受 | 否 | 风险裁决承接 | 无 | 无回写 |
| 确认发布准备不等于生产上线批准,且必须单独检查 release gate 和风险类型 | 否 | 发布准备裁决 | 无 | 无回写 |
| 确认签署不自动代表风险接受 | 否 | 签署边界 | 无 | 无回写 |

说明:

```text
本步没有新增需求、设计、测试用例、证据编号、release gate 或风险类型。
本步只把 Step 1~13 的验收门禁汇总成最终裁决和签署口径。
```

## 9. 回填草稿

正式 `06-验收标准.md` §14 建议采用以下结构:

```text
14. 最终结论与签署
  14.1 结论取值
  14.2 维度结论表
  14.3 下一阶段与发布准备口径
  14.4 签署角色
  14.5 签署记录字段
```

正文草稿:

```text
最终结论只允许通过 / 有条件通过 / 不通过。通过要求 P0 门禁、证据、一票否决、缺陷、风险和签署全部闭合;有条件通过只允许在 P0 主线成立、无 veto / S / P0 A / release redline / P0 evidence 缺失,且残余风险已由具名接受人接受时给出;不通过用于任一阻断项失败或证据不可复核。

签署不自动代表风险接受。风险接受必须先在 `reports/acceptance/risk-acceptance.md` 中记录接受人、owner、后续动作、截止时间和 evidence refs。最终签署必须绑定固定 document baseline、implementation commit、build / source baseline、core contracts baseline、run_id、report refs 和 archive ref。
```

## 10. 待确认事项

无阻塞进入 Step 15 的待确认事项。

后续 Step 必须继续收口:

- Step 15 将前 14 个中间产物整理为正式 `06-验收标准.md`。
- Step 15 不得新增未在 Step 1~14 中确认的验收门禁、风险类型或签署角色。
- Step 15 每个正式章节必须标注对应 `design-calibration/06_acceptance_step_*.md` 校准来源。

## 11. 进入下一步条件

- [x] 最终结论三值口径已经列明。
- [x] 进入下一阶段规则已经列明。
- [x] 发布准备规则已经列明。
- [x] 必须签署角色已经列明。
- [x] 签署不等于风险接受的规则已经列明。
- [x] 用户审核并确认本 Step。
