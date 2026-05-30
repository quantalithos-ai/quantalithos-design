# L0-bus 06 验收标准 Step 11: 一票否决项

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 11 中间产物。
> 本步把需求红线、架构红线、详细设计不变量、安全边界和证据红线收敛为正式一票否决项。
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
| `00-需求文档.md` §14.2 | 已完成 | 作为一票否决项的原始需求来源 |
| `01-架构设计.md` §4 / §9 / §13 / §14 | 已完成 | 提取职责边界、数据所有权、横切红线和不可接受设计债务 |
| `03-详细设计.md` §7~§15 | 已完成 | 提取 protocol、state、transaction、error、config、observability 和 test slice 不变量 |
| `05-测试方案.md` §10 / §11 / §14 | 已完成 | 提取 S0 / S1 / P1-risk、redaction、report、replay、Query 写 truth 等验收影响 |
| `06_acceptance_step_02_scope.md` | 已确认 | 继承 P0 主闭环、P0-min 支撑边界和一票否决候选 |
| `06_acceptance_step_06_boundary_gate.md` | 已确认 | 继承 AC-BOUND / AC-RED 数据边界与架构红线 |
| `06_acceptance_step_09_nonfunctional.md` | 已确认 | 继承 S0 / S1 / S2 / P1-risk 非功能失败口径 |
| `06_acceptance_step_10_evidence_audit.md` | 已确认 | 继承 evidence、redaction、handoff 和 veto checklist 证据要求 |

---

## 3. SOP 问题回答

### 3.1 哪些失败会直接导致不通过?

以下失败直接导致“不通过”,不得被有条件通过或风险接受覆盖。

| 类型 | 直接不通过原因 |
|---|---|
| P0 主闭环断裂 | 无法形成契约化输入、transport semantic、delivery、feedback、recovery、read-only output 的闭环 |
| core / bus 双真相 | L0-bus 重新定义或绕过 L0-core 的共享契约 |
| forbidden body 泄漏 | payload body、raw secret、backend private body、governance decision body、observability long-term log body 进入 bus 或证据 |
| 审计 / history 缺失 | delivery、feedback、retry、DLQ、replay preparation 缺少正式追溯链 |
| replay 绕过材料链 | 未满足 DLQ、delivery history、audit chain、approval ref 仍进入 replay ready |
| 授权边界缺失 | tap、DLQ read、replay preparation、failure material 成为普通无约束读写面 |
| adapter 泄漏 | backend raw status / private response 泄漏为 platform transport semantic |
| governance 越界 | failure material 被当成 governance decision 或 bus 生成 decision body |
| 只读反写 | Query、projection、SDK / observability / governance view 反写 bus truth |
| 证据链不可审计 | P0 evidence / report / redaction / fixed run 缺失,或引用 latest / 跨 run 伪证据 |
| 配置绕过红线 | 配置允许保存 forbidden body、关闭 audit / history / redaction、热更新绕过 runtime graph |
| 未提交业务状态进入 bus truth | Outbox relay 承接未提交业务状态,或重复 fact 生成重复 acceptance |

### 3.2 否决项来自哪个需求或设计红线?

否决项以 `00-需求文档.md` §14.2 为主来源,并由后续设计和测试中间产物补充证据化表达。

| 否决项来源 | 承接方式 |
|---|---|
| `00` §14.2 | 原始一票否决清单 |
| `01` §4 / §9 / §13 / §14 | 职责边界、数据所有权、横切红线、不可接受设计债务 |
| `03` §7~§15 | API / event / job、状态机、UoW、配置、观测和 redaction 不变量 |
| `05` §10 / §11 / §14 | 红线型通过条件、S0 缺陷分级、必须转入验收标准的内容 |
| Step 6 | 把数据和架构红线编号为 AC-BOUND / AC-RED |
| Step 9 | 把安全、证据、配置、可追溯失败归入 S0 / S1 / S2 |
| Step 10 | 把 redaction、evidence-index、gate-results、veto-checklist 等证据化 |

### 3.3 否决项如何检查?

每个 VETO 都必须有可复查证据,不能靠口头确认。

| 检查方式 | 适用否决项 |
|---|---|
| release gate / P0 suite result | P0 主闭环、P0-min 支撑边界 |
| contract compile / dependency snapshot | core / bus 共享契约边界 |
| redaction-check | forbidden body、raw secret、backend private body、governance decision body 泄漏 |
| evidence-index / artifact-index | P0 证据可追溯性、固定 run、跨 run 引用 |
| state / recovery suite | replay、DLQ、history、audit chain |
| service / API negative tests | authorization seam、Query 写 truth、governance 越界 |
| consistency / UoW evidence | 半状态、audit / history 缺失、unsafe retry |
| config summary / config fault suite | 配置绕过红线、raw secret 接受、reload 隐式生效 |
| consumer / outbox relay evidence | 未提交 outbox fact、重复 fact、source ack failure |

### 3.4 否决项是否允许风险接受?

不允许。

一票否决项的语义是:只要命中,最终结论只能是“不通过”。它不能被 `risk-acceptance.md` 覆盖,也不能以 S2、P1-risk 或有条件通过形式放行。

允许风险接受的范围只包括:

- 不影响 P0 主闭环的 S2。
- 不属于当前 P0 完整交付范围的 P1-risk。
- 非关键报告字段缺失且不影响 P0 证据链。

以下内容永远不得风险接受:

- S0。
- VETO。
- P0 主闭环断裂。
- forbidden body / raw secret 泄漏。
- Query 写 truth。
- replay 绕过 audit chain。
- P0 evidence 缺失或不可审计。

### 3.5 否决项是否覆盖所有 P0 红线?

已覆盖。覆盖关系如下:

| P0 红线来源 | 覆盖方式 |
|---|---|
| P0 主闭环必须成立 | `VETO-BUS-001` |
| core / bus 边界 | `VETO-BUS-002` |
| forbidden body / raw secret | `VETO-BUS-003` |
| audit / history / replay chain | `VETO-BUS-004`、`VETO-BUS-005` |
| authorization seam | `VETO-BUS-006` |
| backend adapter boundary | `VETO-BUS-007` |
| governance boundary | `VETO-BUS-008` |
| Query / projection read-only boundary | `VETO-BUS-009` |
| evidence / report / fixed run | `VETO-BUS-010` |
| config must not override redlines | `VETO-BUS-011` |
| outbox committed fact boundary | `VETO-BUS-012` |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 需求已有一票否决,但不够证据化 | §14.2 是自然语言清单 | 验收时不知道查哪个报告或用例 | 本步增加 VETO ID 和证据 / 检查方式 |
| S0、S1、一票否决边界容易混淆 | P0 主链失败、证据缺失、红线泄漏严重度不同 | 有条件通过可能错误覆盖红线 | 本步明确 VETO 不允许风险接受 |
| Step 6/9/10 的红线分散 | AC-RED、AC-NFR、AC-EVID 分散在不同章节 | 最终验收清单可能漏项 | 本步汇总为 VETO 清单 |
| P1/P2 风险可能被误升级为 VETO | production adapter、dashboard、SDK 等未完成 | 当前 P0 被错误阻塞 | 本步只把“P1/P2 污染 P0 或造成红线事实”纳入 VETO |
| 证据链缺失未在需求原清单中显式展开 | Step 10 已定义证据门禁 | P0 通过无法审计 | 本步补充 evidence VETO |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 否决项表达 | 需求自然语言 bullet | `VETO-BUS-*` 稳定编号 | 可引用 |
| 来源追溯 | 主要来自需求 | 明确关联需求、架构、详细、测试和 Step 中间产物 | 可审计 |
| 检查方式 | 未逐项指定 | 每个 VETO 绑定证据 / 检查方式 | 可执行 |
| 风险接受 | 未逐项说明 | 所有 VETO 明确不可风险接受 | 防误放行 |
| P1/P2 | 容易误入否决 | 只在污染 P0 或触发红线时进入 VETO | 防范围漂移 |

---

## 6. 验收设计取舍

### 6.1 是否把所有 S1 都列为一票否决

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 全部 S1 都列为 VETO | 严格 | 会把普通 P0 功能失败和红线失败混为一类 |
| B. 只有不可风险接受的红线、闭环断裂和证据不可审计列为 VETO | 边界清楚 | 需要 Step 12 再定义 S1 复验 | 采用 |
| C. 只列安全类 S0 | 简短 | P0 主闭环和证据不可审计可能漏掉 | 不采用 |

### 6.2 是否把 P1/P2 未交付列为一票否决

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 列为 VETO | 更严格 | 与当前 P0 范围冲突 |
| B. 不列为 VETO,除非误声明为 P0 或污染 P0 / 红线 | 范围准确 | 需要风险章节承接 | 采用 |
| C. 完全不提 | 简洁 | 易被误读为已交付 | 不采用 |

### 6.3 是否把证据缺失列为一票否决

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. P0 证据不可审计列为 VETO | 保证验收可复查 | 需要严格 reports / artifacts 生成 |
| B. 只作为进入条件阻断 | 阶段清楚 | 已进入验收后仍可能缺证据 |
| C. 只作为 S2 | 宽松 | 无法支撑正式签署 | 采用 A |

---

## 7. 结构化中间产物

### 7.1 一票否决项表

| 否决项 ID | 否决项 | 原因 | 证据 / 检查方式 |
|---|---|---|---|
| VETO-BUS-001 | P0 主闭环无法成立 | 契约化输入、transport semantic、delivery、feedback、recovery、read-only output 任一关键链路缺失时,L0-bus 不具备当前交付目标 | `AC-FUNC-*`、release gate、coverage matrix、`EV-BUS-PUB/SEM/DLV/FDB/REC/OUT` |
| VETO-BUS-002 | `L0-core` 共享契约被 bus 重新定义或绕过 | Event、Error、TraceContext、Metadata、ActorRef 等共享契约必须由 L0-core 提供,否则形成 core / bus 双真相 | dependency snapshot、contract compile、`AC-RED-001` |
| VETO-BUS-003 | forbidden body 或 raw secret 泄漏 | payload body、raw secret、backend private body、governance decision body、observability long-term log body 不得进入 truth、snapshot、event、log、audit、artifact 或 report | `redaction-check.md`、`RP-BUS-RED-*`、`AC-RED-002/003` |
| VETO-BUS-004 | delivery / feedback / recovery 缺正式追溯链 | delivery 成功、失败、超时、重试、DLQ、replay preparation 必须有 history / audit,否则恢复和治理不可审计 | `EV-BUS-CONS-*`、`EV-BUS-OBS-*`、audit / history evidence |
| VETO-BUS-005 | replay 绕过 DLQ、delivery history、audit chain 或 approval ref | replay preparation 是受控恢复前置,不能绕过材料链进入 ready | `TC-BUS-REC-003/004`、`EV-BUS-REC-*`、recovery evidence |
| VETO-BUS-006 | privileged output / operation 无授权边界 | tap、DLQ read、replay preparation、failure material 不得作为普通无约束读写面暴露 | `EV-BUS-SEC-*`、access audit、service / API negative tests |
| VETO-BUS-007 | backend adapter 差异泄漏为上层 transport semantic | backend raw status / private response 必须被 normalization,不能改变平台级传递语义 | `TC-BUS-SEM-002`、`TC-BUS-BND-*`、backend boundary evidence |
| VETO-BUS-008 | failure material 被当成 governance decision | bus 只输出失败事实材料,治理决策真相属于 governance | `TC-BUS-OUT-004`、failure material contract、fake governance consumer |
| VETO-BUS-009 | Query、projection 或只读输出反写 bus truth | 只读消费面不能成为第二写入口,否则破坏 truth 所有权 | `TC-BUS-OUT-001/002`、no-write UoW tests、`AC-BOUND-004` |
| VETO-BUS-010 | P0 证据链不可审计 | 验收必须绑定固定 `<run_id>` 并能从 acceptance handoff 回链 reports / artifacts | evidence-index、gate-results、artifact-index、`reports/acceptance/*` |
| VETO-BUS-011 | 配置绕过关键红线 | 配置不得允许保存 forbidden body、关闭 audit / history / redaction、或热更新绕过 runtime graph | config summary、`TC-BUS-CFG-*`、config fault evidence |
| VETO-BUS-012 | 未提交业务状态进入 bus truth | Outbox relay 只能承接已提交 outbox fact,不能把未提交业务状态推进到 bus | `TC-BUS-OBX-*`、consumer / source ack evidence |

### 7.2 否决项到上游来源追溯表

| 否决项 ID | 需求来源 | 设计来源 | 测试 / 证据来源 |
|---|---|---|---|
| VETO-BUS-001 | `00` §14.2 第 1 条 | `01` §14 P0、`03` §8~§10 | Step 5、Step 8、release gate |
| VETO-BUS-002 | `00` §14.2 第 2 条 | `01` §4 / §8、`03` §3 / §13 | Step 6、Step 7 |
| VETO-BUS-003 | `00` §14.2 第 3 条 | `01` §9 / §13、`03` §14 | Step 6、Step 9、Step 10 |
| VETO-BUS-004 | `00` §14.2 第 4 条 | `01` §9 / §13、`03` §10 / §14 | Step 8、Step 10 |
| VETO-BUS-005 | `00` §14.2 第 5 条 | `03` §9 / §11 | Step 5、Step 8 |
| VETO-BUS-006 | `00` §14.2 第 6 条 | `01` §13、`03` §14 | Step 9、Step 10 |
| VETO-BUS-007 | `00` §14.2 第 7 条 | `01` §9 / §13、`03` §8 / §13 | Step 6、Step 7 |
| VETO-BUS-008 | `00` §14.2 第 8 条 | `01` §4 / §5、`03` §9 / §11 | Step 6、Step 7 |
| VETO-BUS-009 | `00` §10 / §11 / §14 | `01` §9、`03` §7~§10 | Step 6、Step 8 |
| VETO-BUS-010 | `00` §14 验收方向 | `03` §15、`05` §12 / §13 | Step 3、Step 4、Step 10 |
| VETO-BUS-011 | `00` §13 / §14 | `04` §4、`03` §13 | Step 6、Step 9 |
| VETO-BUS-012 | `00` BR-010 / §14 | `01` §4 / §9、`03` §8 / §10 | Step 5、Step 6、Step 7 |

### 7.3 风险接受规则表

| 项目 | 是否允许风险接受 | 说明 |
|---|---|---|
| 任一 `VETO-BUS-*` | 否 | 命中即不通过 |
| S0 | 否 | S0 与 VETO 均不可条件接受 |
| S1 P0 主链失败 | 否 | 修复后复验,不得有条件通过 |
| S2 非红线质量问题 | 是 | 必须有 owner、deadline、复验计划和接受记录 |
| P1-risk | 是 | 必须明确非当前 P0 交付范围,并进入后续专项 |
| P2 非范围 | 是 | 必须不影响 P0,不得误声明已交付 |

### 7.4 VETO 证据复查图

图类型: 否决项证据复查图

图标题: L0-bus 一票否决项从验收入口到证据的复查链路

```text
reports/acceptance/veto-checklist.md
  -> VETO-BUS-xxx
      -> reports/runs/<run_id>/gate-results.md
      -> reports/runs/<run_id>/evidence-index.md
      -> reports/runs/<run_id>/redaction-check.md
      -> reports/runs/<run_id>/evidence/EV-BUS-<AREA>.md
      -> artifacts/test/<run_id>/suites/<suite>/report.json
```

关键说明:

- `veto-checklist.md` 必须列出全部 `VETO-BUS-*`。
- 每个 VETO 必须有结论: 未命中 / 命中 / 证据不足。
- 任一 VETO 命中,最终结论只能是不通过。
- 任一 VETO 证据不足,不得判定通过或有条件通过。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_11_blockers.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“一票否决项表”“否决项到上游来源追溯表”“风险接受规则表”和“VETO 证据复查图”小节,了解本章如何把需求红线、架构红线和证据红线收敛为正式 VETO 清单。

本轮一票否决项以 `VETO-BUS-001`~`VETO-BUS-012` 为裁决入口。任一 VETO 命中,最终验收结论只能是不通过;任一 VETO 证据不足,不得判定通过或有条件通过。

一票否决项覆盖 P0 主闭环断裂、core / bus 双真相、forbidden body 或 raw secret 泄漏、delivery / feedback / recovery 缺正式追溯链、replay 绕过材料链、privileged operation 无授权边界、backend adapter 差异泄漏、governance decision 越界、Query / projection 反写 truth、P0 证据链不可审计、配置绕过红线、未提交业务状态进入 bus truth。

`reports/acceptance/veto-checklist.md` 必须列出全部 `VETO-BUS-*`,并为每项提供未命中 / 命中 / 证据不足结论。VETO 不允许风险接受,不能被 `risk-acceptance.md` 覆盖,也不能以 S2、P1-risk 或有条件通过形式放行。

---

## 9. 待确认事项

当前没有阻塞进入 Step 12 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否把所有 S1 都列为 VETO | A. 全部列入;B. 仅不可风险接受红线、闭环断裂和证据不可审计列入;C. 只列安全 S0 | 采用 B | 保持 VETO 与普通 S1 缺陷分级边界清楚 |
| P1/P2 未交付是否列为 VETO | A. 列入;B. 不列,除非误声明或污染 P0 / 红线;C. 不提 | 采用 B | 与当前 P0 范围一致,由风险章节承接 |
| P0 证据不可审计是否列为 VETO | A. 列入;B. 只阻断进入条件;C. 只作为 S2 | 采用 A | 正式验收必须可复查,否则无法签署 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 直接导致不通过的失败类型已定义 | 已满足 |
| 每个否决项均有上游来源 | 已满足 |
| 每个否决项均有证据 / 检查方式 | 已满足 |
| 风险接受不得覆盖 VETO 的规则已定义 | 已满足 |
| VETO 覆盖所有 P0 红线 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 12,定义缺陷分级、复验与放行规则。
