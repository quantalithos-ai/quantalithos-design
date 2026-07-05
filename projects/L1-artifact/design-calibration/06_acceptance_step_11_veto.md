# Step 11. 定义一票否决项

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 11
> 回填章节: `06-验收标准.md` §11 一票否决项
> 参考粒度: `projects/L1-governance/design-calibration/06_acceptance_step_11_veto.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 11 定义一票否决项 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | `00-需求文档.md` §14.6;Step 5~10 中间产物;`05-测试方案.md` §11 / §14 |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_11_veto.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 12 |

## 2. 本步目标

定义任何情况下都不能通过验收、不能被风险接受覆盖的问题。

本 Step 只回答:

- `VF-ART-001~004` 如何转成正式 `VETO-ART-*`。
- redaction、dependency、report integrity、config silent fallback、P0 profile 伪 pass、query / job / relay truth repair 等硬门禁失败是否进入一票否决。
- 每个 VETO 如何检查、引用哪些 `EV-CAND-ART-*`、report path 和 defect state。
- 哪些 VETO 不允许降级成 A/B/R 缺陷或 residual risk。

本 Step 不填写真实 VETO 结果,不默认 passed,不替代 `reports/acceptance/veto-checklist.md` 的实际执行审查。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` §14.6 | 已完成 | 提供正式一票否决上游来源:五个核心能力、外部正文 / 消费副本、version / lineage / baseline、消费方反写 truth |
| `06_acceptance_step_06_data_arch_redlines.md` | 已完成 | 提供 `RL-ART-001~011` 数据与架构红线 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已完成 | 提供状态 / 事务 / query no-write / job no-truth-repair / duplicate replay VETO 候选 |
| `06_acceptance_step_09_nonfunctional.md` | 已完成 | 提供 redaction、config、dependency、evidence integrity 硬门禁 |
| `06_acceptance_step_10_observability_evidence.md` | 已完成 | 提供 VETO checklist、EV / report 追溯和 no static evidence 规则 |
| `05-测试方案.md` §11 / §14 | 已完成 | 提供 S 级缺陷、不可风险接受项和全量 P0 regression 要求 |
| `projects/L1-governance/design-calibration/06_acceptance_step_11_veto.md` | 已读取 | 仅作为结构和粒度参考,不复用 governance 专属语义 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些失败会直接导致不通过? | 五个核心能力任一节点无法成立、外部正文 / 消费副本进入正式 truth、version / lineage / baseline 无法稳定追溯或冻结、消费方 / query / job / relay / handoff / replay 反写 Artifact truth、redaction leak、non-core sibling compile dependency、report / evidence integrity failure、config silent fallback 和 P0 profile unavailable but passed。 |
| 否决项来自哪个需求或设计红线? | 主要来自 `VF-ART-001~004`、`RL-ART-001~011`、`03` 状态 / 事务 / redaction / query no-write / job no-truth-repair、`04` config fail-fast 和 `05` S 级 / 不可风险接受项。 |
| 否决项如何检查? | 通过 `EV-CAND-ART-*`、fixed report path、redaction / dependency / report audit、VETO checklist、defect state 和 full P0 regression evidence 检查。 |
| 否决项是否允许风险接受? | 不允许。VETO 命中时最终结论只能是不通过或暂停验收,不能有条件通过。 |
| 否决项是否覆盖所有 P0 红线? | 覆盖 `VF-ART-001~004`,并补充证据真实性、redaction、dependency、配置 silent fallback、P0 profile 伪 pass 作为验收过程红线。 |
| 每个 VETO 能否回指需求 / 架构 / 详细设计红线、检查证据和 report path? | 可以。见 §8.1 / §8.2。 |
| 每个 VETO 完成后是否通过停审? | 已按红线来源、检查方式、证据路径、不可风险接受和重复覆盖停审。见 §8.3。 |
| 是否存在 P0 红线未覆盖、VETO 与风险接受冲突或检查方式不可执行? | 未发现 unresolved 冲突。Step 13 将明确 risk acceptance 不得覆盖本 Step VETO。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 一票否决只围绕旧 create / publish / baseline 少数主线,缺新版 `VF-ART-001~004` 与证据真实性门禁 | 重建 `VETO-ART-001~009` |
| Step 6 | 红线只是 VETO 候选 | 本 Step 固定正式 VETO |
| Step 9 | redaction / dependency / config / evidence failure 已是硬门禁,但未统一进入否决项 | 本 Step 固定为验收过程硬红线 |
| Step 10 | VETO checklist 不能默认 passed | 本 Step 要求每项 VETO 必须回指真实 EV / report / defect |
| `05-测试方案.md` §11 / §14 | S 级和不可风险接受项已经定义,但 `06` 尚未收口最终裁决 | 本 Step 把 S 级硬红线映射到 VETO |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| VETO 范围 | 旧主线或隐含红线 | `VF-ART-001~004` + evidence / security / dependency / config 过程红线 | 承接新版需求和测试方案 |
| 风险接受 | 可模糊接受 | VETO / S 级不可接受 | 防止有条件通过越权 |
| 检查方式 | 人工判断 | 固定 EV、report path、suite / check 和 defect state | 可复验 |
| 清单状态 | 可默认 passed | 必须由证据驱动 | 防止伪验收 |
| P1/P2 项 | 可能混入否决 | selected-run unavailable 和旧 P95 不设 VETO | 避免范围外能力误阻断 P0 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| evidence integrity failure 是否写成 VETO | A. 否;B. 是 | 采用 B。证据不真实时验收裁决本身不成立 |
| config silent fallback 是否一票否决 | A. 否;B. 是 | 采用 B。它会绕过设计不变量和 profile isolation |
| redaction / dependency failure 是否可风险接受 | A. 可接受;B. 不可接受 | 采用 B。它们是安全 / 架构硬红线 |
| P1 selected-run unavailable 是否 VETO | A. 是;B. 否 | 采用 B。P1 unavailable 进入 residual,不得伪 pass |
| 性能 sample 未达旧 P95 是否 VETO | A. 是;B. 否 | 采用 B。当前无硬阈值来源 |

## 8. 结构化中间产物

### 8.1 一票否决项表

| 否决项 ID | 否决项 | 原因 | 证据 / 检查方式 |
|---|---|---|---|
| VETO-ART-001 | 五个核心能力节点任一无法成立 | 命中 `VF-ART-001`,Artifact truth center 不成立 | `EV-CAND-ART-CORE-001`;`EV-CAND-ART-CMD-001`;`EV-CAND-ART-QUERY-001`;`reports/runs/<run_id>/suites/release-main-smoke.md` |
| VETO-ART-002 | 外部正文、运行材料、派生材料或消费副本进入正式 truth 或正式输出面 | 命中 `VF-ART-002`,破坏 truth / snapshot / ref / forbidden body 边界 | `EV-CAND-ART-REDACTION-001`;`EV-CAND-ART-CONSUMER-001`;`reports/runs/<run_id>/redaction-check.md` |
| VETO-ART-003 | Artifact version / lineage / baseline 无法稳定形成、追溯、冻结或历史被静默覆盖 | 命中 `VF-ART-003`,破坏版本事实和受控集合 | `EV-CAND-ART-STATE-001`;`EV-CAND-ART-CMD-001`;`EV-CAND-ART-IDEMP-001`;`reports/runs/<run_id>/suites/contract-domain-fast.md` |
| VETO-ART-004 | 下游 / 外围 / query / consumer / job / handoff / replay 可以反写 Artifact truth | 命中 `VF-ART-004`,破坏消费边界和 no-write / no-truth-repair | `EV-CAND-ART-QUERY-001`;`EV-CAND-ART-CONSUMER-001`;`EV-CAND-ART-JOB-001`;`EV-CAND-ART-RELAY-001` |
| VETO-ART-005 | accepted truth 缺 trace / audit / outbox / stored result 或 duplicate / commit unknown 触发第二次 truth write | 事务、幂等和证据链不成立 | `EV-CAND-ART-IDEMP-001`;`EV-CAND-ART-OUTBOX-001`;`EV-CAND-ART-REPORT-001` |
| VETO-ART-006 | redaction scan 检出 raw body、external response、secret、token、full sensitive ref 或 report 二次泄露 | 安全 / body-free 硬门禁失效 | `EV-CAND-ART-REDACTION-001`;`reports/runs/<run_id>/redaction-check.md` |
| VETO-ART-007 | 非 `L0-core` / `core-contracts` sibling 成为编译期依赖 | 架构裁剪和 truth ownership 被绕过 | `EV-CAND-ART-ARCH-001`;`reports/runs/<run_id>/dependency-boundary.md` |
| VETO-ART-008 | evidence index、VETO checklist、report 或 acceptance handoff 由静态 JSON / Markdown 或手写表伪造 passed | 验收证据不真实,无法裁决 | `EV-CAND-ART-REPORT-001`;`reports/runs/<run_id>/report-audit.md`;`reports/acceptance/veto-checklist.md` |
| VETO-ART-009 | invalid P0 config silent fallback、partial facade、forbidden override 生效或 P0 profile unavailable but marked passed | 配置绕过设计不变量,运行基线不可信 | `EV-CAND-ART-CONFIG-001`;`reports/runs/<run_id>/suites/config-redline.md`;`reports/runs/<run_id>/gate-summary.md` |

### 8.2 VETO 闭环矩阵

| 否决项 ID | 红线来源 | 检查证据 | report path | 触发后裁决 |
|---|---|---|---|---|
| VETO-ART-001 | `VF-ART-001`;`RL-ART-001` | `EV-CAND-ART-CORE-001`;`EV-CAND-ART-CMD-001`;`EV-CAND-ART-QUERY-001` | release smoke / service-flow reports | 不通过 |
| VETO-ART-002 | `VF-ART-002`;`RL-ART-002~003` | `EV-CAND-ART-REDACTION-001`;`EV-CAND-ART-CONSUMER-001` | `redaction-check.md`;entry-worker-job report | 不通过 |
| VETO-ART-003 | `VF-ART-003`;`RL-ART-004~006` | `EV-CAND-ART-STATE-001`;`EV-CAND-ART-CMD-001`;`EV-CAND-ART-IDEMP-001` | contract-domain / service / infra-runtime reports | 不通过 |
| VETO-ART-004 | `VF-ART-004`;`RL-ART-007~009` | `EV-CAND-ART-QUERY-001`;`EV-CAND-ART-CONSUMER-001`;`EV-CAND-ART-JOB-001`;`EV-CAND-ART-RELAY-001` | service / worker / operations reports | 不通过 |
| VETO-ART-005 | Step 8 transaction / idempotency hard gate | `EV-CAND-ART-IDEMP-001`;`EV-CAND-ART-OUTBOX-001`;`EV-CAND-ART-REPORT-001` | infra-runtime / operations / report audit | 不通过 |
| VETO-ART-006 | Step 9 / Step 10 redaction hard gate | `EV-CAND-ART-REDACTION-001` | `reports/runs/<run_id>/redaction-check.md` | 不通过 |
| VETO-ART-007 | `RL-ART-010`;dependency boundary hard gate | `EV-CAND-ART-ARCH-001` | `reports/runs/<run_id>/dependency-boundary.md` | 不通过 |
| VETO-ART-008 | Step 10 evidence integrity redline | `EV-CAND-ART-REPORT-001` | `reports/runs/<run_id>/report-audit.md`;`reports/acceptance/veto-checklist.md` | 不通过或暂停验收 |
| VETO-ART-009 | `04` config fail-fast / profile isolation redline | `EV-CAND-ART-CONFIG-001` | `reports/runs/<run_id>/suites/config-redline.md`;`gate-summary.md` | 不通过 |

### 8.3 一票否决项停审记录

| 否决项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| VETO-ART-001~004 | 是否覆盖 `VF-ART-001~004` | 通过 | 每个 VF 均有 VETO |
| VETO-ART-005~009 | 是否属于验收过程硬红线 | 通过 | transaction、redaction、dependency、evidence 和 config 影响裁决成立 |
| 全部 VETO | 是否有 report path 和 EV | 通过 | 实际执行时必须在 veto-checklist 中引用 |
| 全部 VETO | 是否允许风险接受 | 不允许 | Step 13 保留该约束 |
| P1 / P2 residual | 是否误设为 VETO | 未误设 | selected-run unavailable、production-like capacity 和 hard P95 不在当前 VETO |

### 8.4 跨 VETO 覆盖审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 红线未覆盖 | 未发现 | `VF-ART-001~004` 全覆盖 |
| VETO 重复 | 可接受 | body-free / redaction 在 VETO-ART-002 / 006 有交叉,但检查证据一致 |
| VETO 与风险接受冲突 | 未发现 | 全部禁止风险接受 |
| 检查方式不可执行 | 未发现 | 均绑定 EV / report / check |
| P1 / P2 被误设 VETO | 未发现 | selected-run unavailable、production-like / capacity 和旧 P95 不设 VETO |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_11_veto.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“一票否决项表”“VETO 闭环矩阵”“一票否决项停审记录”和“跨 VETO 覆盖审计表”小节,了解一票否决项如何从需求 VF、架构红线、详细设计不变量和证据真实性门禁收敛。

正式 `06-验收标准.md` §11 应回填:

- 一票否决项固定为 `VETO-ART-001~009`。
- `VETO-ART-001~004` 对应 `VF-ART-001~004`;`VETO-ART-005~009` 覆盖 transaction / idempotency、redaction、dependency、evidence integrity 和 config silent fallback / P0 profile 伪 pass。
- 任一 VETO 命中时,最终结论不得为“通过”或“有条件通过”。
- VETO 不得被风险接受、残余风险、P1 selected-run 或人工口头确认覆盖。
- `reports/acceptance/veto-checklist.md` 必须逐项引用真实 EV / report / defect,不得默认全部 passed。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 是否要将 `VETO-ART-005~009` 回写需求文档 | 影响上游编号 | 当前作为验收过程红线;不修改需求编号 |
| VETO checklist 具体脚本字段 | 影响实现 | Step 10 已固定语义;具体字段由 implementation report script 对齐 |
| P1 selected-run 在某 release 是否必须 | 影响风险接受 | 不作为 VETO;Step 13 记录 residual |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 否决项清楚且可检查 | 通过 | 见 §8.1 / §8.2 |
| 一票否决项已停审 | 通过 | 见 §8.3 |
| 跨 VETO 覆盖审计无 unresolved 冲突 | 通过 | 见 §8.4 |
| 可进入 Step 12 | 通过 | 下一步定义缺陷分级、复验与放行规则 |
