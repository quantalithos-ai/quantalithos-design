# Step 11. 定义一票否决项

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 11
> 回填章节: `06-验收标准.md` §11 一票否决项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义一票否决项 |
| 当前状态 | 已完成;自动连续推进 |
| 输入基线 | `00-需求文档.md` VF-GOV-001~010;Step 5~10 中间产物;`05-测试方案.md` §10 / §11 / §13 / §14 |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_11_veto.md` |
| 停审方式 | 本轮按用户要求不停审连续推进;本文件保留独立停审记录 |

## 2. 本步目标

定义任何情况下都不能通过验收、不能被风险接受覆盖的问题。

本 Step 只回答:

- VF-GOV-001~010 如何转成正式 VETO。
- 证据失真、redaction、dependency、config silent fallback 等非功能失败是否属于一票否决。
- 每个 VETO 如何检查、引用哪些 EV/report、触发后如何裁决。
- 哪些 VETO 不允许降级成 A/B/R 缺陷或 risk acceptance。

本 Step 不填写真实 VETO 结果,不默认 passed,不替代 `reports/acceptance/veto-checklist.md` 的实际执行审查。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` VF-GOV-001~010 | 已完成 | 提供正式一票否决上游来源 |
| `06_acceptance_step_06_data_arch_redlines.md` | 已完成 | 提供 RL-GOV 红线和 AC-GOV-016~025 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已完成 | 提供状态 / 事务 / query/job no-write VETO 候选 |
| `06_acceptance_step_09_nonfunctional.md` | 已完成 | 提供 redaction、config、dependency、evidence integrity 硬门禁 |
| `06_acceptance_step_10_observability_evidence.md` | 已完成 | 提供 VETO checklist、EV/report 追溯和 no static evidence 规则 |
| `05-测试方案.md` §11 / §14 | 已完成 | 提供 S 级缺陷、不可风险接受项和复验要求 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些失败会直接导致不通过? | 核心闭环断裂、相邻状态替代 Decision truth、外部正文入仓、Policy truth 被反向定义、shared rules 被低 scope 覆盖、Decision 原地改写、AIIA/SoA body boundary 失效、NC 退化、query/job 反写真相、non-core sibling compile dependency、redaction leak、evidence integrity failure 和 config silent fallback。 |
| 否决项来自哪个需求或设计红线? | 主要来自 VF-GOV-001~010、BR-GOV-012~040、`01` 架构数据所有权 / 依赖裁剪、`03` 状态 / 事务 / redaction / query no-write / job no truth repair、`04` config fail-fast。 |
| 否决项如何检查? | 通过 `EV-GOV-*`、fixed report path、redaction/dependency/report audit、VETO checklist 和缺陷状态检查。 |
| 否决项是否允许风险接受? | 不允许。VETO 命中时最终结论只能是不通过或暂停验收,不能有条件通过。 |
| 否决项是否覆盖所有 P0 红线? | 覆盖 VF-GOV-001~010,并补充证据真实性、配置 silent fallback 和 P0 profile 伪 pass 作为验收过程红线。 |
| 每个 VETO 能否回指需求 / 架构 / 详细设计红线、检查证据和 report path? | 可以。见 §8.1 / §8.2。 |
| 每个 VETO 完成后是否通过停审? | 已按红线来源、检查方式、证据路径、不可风险接受和重复覆盖停审。见 §8.3。 |
| 是否存在 P0 红线未覆盖、VETO 与风险接受冲突或检查方式不可执行? | 未发现 unresolved 冲突。Step 13 将明确 risk acceptance 不得覆盖本 Step VETO。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 一票否决围绕旧 request/decision 主线,缺新版 VF-GOV-001~010 | 重建 VETO-GOV-001~013 |
| Step 6 | 红线只是 VETO 候选 | 本 Step 固定正式 VETO |
| Step 10 | VETO checklist 不能默认 passed | 本 Step 要求每项 VETO 必须回指真实 EV/report/defect |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| VETO 范围 | 旧 request/decision 边界 | VF-GOV-001~010 + evidence/config 过程红线 | 承接新版需求和证据标准 |
| 风险接受 | 可模糊接受 | VETO/S 级不可接受 | 防止有条件通过越权 |
| 检查方式 | 人工判断 | 固定 EV、report path、suite/check 和 defect state | 可复验 |
| 清单状态 | 可默认 passed | 必须由证据驱动 | 防止伪验收 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否把 evidence integrity failure 写成 VETO | A. 否;B. 是 | 采用 B。证据不真实时验收裁决本身不成立 |
| config silent fallback 是否一票否决 | A. 否;B. 是 | 采用 B。它会绕过设计不变量和 profile isolation |
| P1 selected-run unavailable 是否 VETO | A. 是;B. 否 | 采用 B。P1 unavailable 进入 residual,不得伪 pass |
| 性能 sample 未达旧 P95 是否 VETO | A. 是;B. 否 | 采用 B。当前无硬阈值来源 |

## 8. 结构化中间产物

### 8.1 一票否决项表

| 否决项 ID | 否决项 | 原因 | 证据 / 检查方式 |
|---|---|---|---|
| VETO-GOV-001 | C-GOV-1~5 核心闭环断裂 | Governance truth center 不成立 | `EV-GOV-CORE-001`;`EV-GOV-CMD-001`;`reports/runs/<run_id>/suites/release-main-smoke.md` |
| VETO-GOV-002 | 相邻仓状态 / UI / runtime 替代 Gate / Decision truth | 命中 VF-GOV-002,破坏治理裁决所有权 | `EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001`;`reports/runs/<run_id>/suites/service-flow-fast.md` |
| VETO-GOV-003 | 外部正文、raw secret、full sensitive ref 入仓或输出 | 命中 VF-GOV-003 / 007 和安全红线 | `EV-GOV-REDACTION-001`;`reports/runs/<run_id>/redaction-check.md` |
| VETO-GOV-004 | Policy truth 被 method/runtime/capability/external cache 反向定义 | 命中 VF-GOV-004 | `EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001`;`EV-GOV-STATE-001` |
| VETO-GOV-005 | shared rules 被低 scope 静默覆盖 | 命中 VF-GOV-005 | `EV-GOV-STATE-001`;`reports/runs/<run_id>/suites/contract-domain-fast.md` |
| VETO-GOV-006 | finalized Decision 原地改写 | 命中 VF-GOV-006,破坏审计和历史 | `EV-GOV-STATE-001`;`EV-GOV-CMD-001` |
| VETO-GOV-007 | AIIA / SoA conclusion 保存第二份正文或无法回链正文来源 | 命中 VF-GOV-007 | `EV-GOV-REDACTION-001`;`EV-GOV-CMD-001` |
| VETO-GOV-008 | Nonconformity 被 bug/work blocker/alert/备注替代关闭 | 命中 VF-GOV-008 | `EV-GOV-CMD-001`;`EV-GOV-QUERY-001` |
| VETO-GOV-009 | Query / projection / reconciliation / handoff / export / job 反写 core truth | 命中 VF-GOV-009 | `EV-GOV-QUERY-001`;`EV-GOV-JOB-001`;`EV-GOV-IDEMP-001` |
| VETO-GOV-010 | 非 `L0-core` sibling 成为编译期依赖 | 命中 VF-GOV-010 和架构裁剪红线 | `EV-GOV-ARCH-001`;`reports/runs/<run_id>/dependency-boundary.md` |
| VETO-GOV-011 | evidence index / VETO checklist / report 由静态 JSON 或手写表伪造 passed | 验收证据不真实,无法裁决 | `EV-GOV-REPORT-001`;`reports/runs/<run_id>/report-audit.md`;`reports/acceptance/veto-checklist.md` |
| VETO-GOV-012 | P0 redaction/dependency/report audit failed 被忽略或风险接受 | 安全 / 架构 / 证据硬门禁被绕过 | `redaction-check.md`;`dependency-boundary.md`;`report-audit.md`;defect state |
| VETO-GOV-013 | invalid P0 config silent fallback、partial facade 或 P0 profile unavailable but marked passed | 配置绕过设计不变量,运行基线不可信 | `EV-GOV-CONFIG-001`;`reports/runs/<run_id>/suites/config-redline.md` |

### 8.2 VETO 闭环矩阵

| 否决项 ID | 红线来源 | 检查证据 | report path | 触发后裁决 |
|---|---|---|---|---|
| VETO-GOV-001 | VF-GOV-001;C-GOV-1~5 | `EV-GOV-CORE-001`;`EV-GOV-CMD-001` | release smoke / service-flow reports | 不通过 |
| VETO-GOV-002 | VF-GOV-002;RL-GOV-002 | `EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001` | service / worker reports | 不通过 |
| VETO-GOV-003 | VF-GOV-003/007;RL-GOV-003/007 | `EV-GOV-REDACTION-001` | `reports/runs/<run_id>/redaction-check.md` | 不通过 |
| VETO-GOV-004 | VF-GOV-004;RL-GOV-004 | `EV-GOV-CMD-001`;`EV-GOV-CONSUMER-001` | service / worker reports | 不通过 |
| VETO-GOV-005 | VF-GOV-005;RL-GOV-005 | `EV-GOV-STATE-001` | contract-domain report | 不通过 |
| VETO-GOV-006 | VF-GOV-006;AC-GOV-STATE-002 | `EV-GOV-STATE-001`;`EV-GOV-CMD-001` | contract-domain / service reports | 不通过 |
| VETO-GOV-007 | VF-GOV-007;AC-GOV-012/025 | `EV-GOV-REDACTION-001`;`EV-GOV-CMD-001` | redaction / service reports | 不通过 |
| VETO-GOV-008 | VF-GOV-008;AC-GOV-013 | `EV-GOV-CMD-001`;`EV-GOV-QUERY-001` | service reports | 不通过 |
| VETO-GOV-009 | VF-GOV-009;AC-GOV-TX-002/003 | `EV-GOV-QUERY-001`;`EV-GOV-JOB-001`;`EV-GOV-IDEMP-001` | service / operations reports | 不通过 |
| VETO-GOV-010 | VF-GOV-010;RL-GOV-010 | `EV-GOV-ARCH-001` | `reports/runs/<run_id>/dependency-boundary.md` | 不通过 |
| VETO-GOV-011 | Evidence integrity redline | `EV-GOV-REPORT-001` | `reports/runs/<run_id>/report-audit.md` | 不通过或暂停验收 |
| VETO-GOV-012 | Step 9/10 hard gates | redaction/dependency/report audit | fixed reports | 不通过 |
| VETO-GOV-013 | `04` config fail-fast redline | `EV-GOV-CONFIG-001` | `reports/runs/<run_id>/suites/config-redline.md` | 不通过 |

### 8.3 一票否决项停审记录

| 否决项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| VETO-GOV-001~010 | 是否覆盖 VF-GOV-001~010 | 通过 | 每个 VF 均有 VETO |
| VETO-GOV-011~013 | 是否属于验收过程硬红线 | 通过 | 证据、配置和审计真实性影响裁决成立 |
| 全部 VETO | 是否有 report path 和 EV | 通过 | 实际执行时必须在 veto-checklist 中引用 |
| 全部 VETO | 是否允许风险接受 | 不允许 | Step 13 保留该约束 |

### 8.4 跨 VETO 覆盖审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 红线未覆盖 | 未发现 | VF-GOV-001~010 全覆盖 |
| VETO 重复 | 可接受 | redaction/body 在 VETO-GOV-003/007 有交叉,但检查证据一致 |
| VETO 与风险接受冲突 | 未发现 | 全部禁止风险接受 |
| 检查方式不可执行 | 未发现 | 均绑定 EV/report/check |
| P1/P2 被误设 VETO | 未发现 | selected-run unavailable 和旧 P95 未达不设 VETO |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_11_veto.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“一票否决项表”“VETO 闭环矩阵”“一票否决项停审记录”和“跨 VETO 覆盖审计表”小节,了解一票否决项如何从需求 VF、架构红线、详细设计不变量和证据真实性门禁收敛。

正式 `06-验收标准.md` §11 应回填:

- 一票否决项固定为 VETO-GOV-001~013。
- VETO-GOV-001~010 对应 VF-GOV-001~010;VETO-GOV-011~013 覆盖 evidence integrity、hard gate bypass 和 config silent fallback。
- 任一 VETO 命中时,最终结论不得为“通过”或“有条件通过”。
- VETO 不得被风险接受、残余风险、P1 selected-run 或人工口头确认覆盖。
- `reports/acceptance/veto-checklist.md` 必须逐项引用真实 EV/report/defect,不得默认全部 passed。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 是否要将 VETO-GOV-011~013 回写需求文档 | 影响上游编号 | 当前作为验收过程红线;不修改需求编号 |
| VETO checklist 具体脚本字段 | 影响实现 | Step 10 已固定语义;具体字段由 implementation report script 对齐 |
| P1 selected-run 在某 release 是否必须 | 影响风险接受 | 不作为 VETO;Step 13 记录 residual |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 否决项清楚且可检查 | 通过 | 见 §8.1 / §8.2 |
| 一票否决项已停审 | 通过 | 见 §8.3 |
| 跨 VETO 覆盖审计无 unresolved 冲突 | 通过 | 见 §8.4 |
| 可进入 Step 12 | 通过 | 下一步定义缺陷分级、复验与放行规则 |
