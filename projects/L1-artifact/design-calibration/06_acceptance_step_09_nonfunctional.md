# Step 9. 定义非功能验收门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 9
> 回填章节: `06-验收标准.md` §9 非功能验收门禁
> 参考粒度: `projects/L1-governance/design-calibration/06_acceptance_step_09_nonfunctional.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义非功能验收门禁 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 8 `状态机、事务与一致性验收`;`00-需求文档.md` §13 / §14;`04-配置设计.md` §9 / §11 / §12;`05-测试方案.md` §10 / §13 / §14;`03-详细设计.md` §15 |
| 输出文件 | `projects/L1-artifact/design-calibration/06_acceptance_step_09_nonfunctional.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 10 |

## 2. 本步目标

本 Step 定义 `L1-artifact` 的非功能验收门禁,把性能、安全、可用性、兼容性、恢复、配置、依赖边界、可观测性与证据真实性转成可裁决的正式验收项。

本 Step 只回答:

- 哪些非功能要求属于 P0 release gate。
- 哪些指标只能做 sample / trend,不能硬化成来源不明的阈值。
- 哪些失败会直接阻断验收,哪些只能进入 residual。
- 哪些证据必须回指 `EV-CAND-ART-*`、`reports/runs/<run_id>/...` 和 `reports/acceptance/...`。
- 哪些 P1/P2 / real-like / production-like 能力当前不进入 P0 pass/fail。

本 Step 不重新定义需求、配置项、测试用例、实施计划或正式最终结论;也不提前冻结正式 `EV-ART-*` / `AC-ART-*` alias。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_08_state_tx_consistency.md` | 已完成 | 提供 query no-write、truth immutability、duplicate replay、commit unknown 和 no-truth-repair 的一致性前提 |
| `00-需求文档.md` §13 / §14 | 正式输入 | 提供 `NFR-ART-CAP-*`、`NFR-ART-GLOB-*`、五类验收方向和 `VF-ART-*` |
| `04_config_step_09_loading_validation_activation.md` | 已完成 | 提供 strict JSON、source merge、builder ready/failed、startup / entry / job / test activation 口径 |
| `04_config_step_11_failure_degradation.md` | 已完成 | 提供 fail-fast、fail-closed、degraded、delayed、failed marker 和告警边界 |
| `04_config_step_12_downstream_handoff.md` | 已完成 | 提供配置门禁对测试 / 验收 / 实施 / 运维的承接边界 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供日志、指标、审计、trace、marker、report 和 redaction 的埋点边界 |
| `05_test_plan_step_10_nonfunctional.md` | 已完成 | 提供专项测试矩阵、性能 sample、redaction、依赖边界、恢复与观测验证 |
| `05_test_plan_step_13_evidence.md` | 已完成 | 提供 candidate evidence、artifact / report pairing 和归档路径 |
| `05_test_plan_step_14_regression_risks.md` | 已完成 | 提供 residual 风险、全量回归触发条件和不可风险接受项 |
| `projects/L1-governance/design-calibration/06_acceptance_step_09_nonfunctional.md` | 已读取 | 仅作为粒度和结构参考,不复用 governance 专属语义 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些非功能指标是 P0? | P0 包括性能结构性 sample、可用性 / 降级、安全 / redaction、配置 fail-fast、dependency boundary、恢复 / 幂等 / replay、observability / audit 和 evidence / report integrity。 |
| 阈值来自需求、设计还是运行基线? | 当前只允许来源明确的门禁:安全、配置、依赖、恢复、观测和证据完整性来自需求 / 设计 / 测试承接;性能只要求 sample / trend,不把无来源数字硬化成 P0 阈值。 |
| 哪些专项未覆盖,是否影响验收? | `p1-real-like-selected-run`、真实上游 / 下游产品行为、production-like / capacity、长期保留天数和未来硬性能阈值当前都进入 residual,不阻断 P0。 |
| 哪些非功能失败会阻断发布? | redaction leak、non-core sibling compile dependency、invalid config silent fallback、report / artifact pairing failure、query / job / relay truth repair、accepted truth 缺 trace / audit / outbox / result、P0 profile unavailable 却被标为 passed,都阻断发布。 |
| 证据来自哪里? | 证据来自 `EV-CAND-ART-*`,以及 `reports/runs/<run_id>/...`、`reports/acceptance/handoff.md`、`reports/acceptance/veto-checklist.md`、`reports/acceptance/risk-acceptance.md` 和 `reports/runs/<run_id>/report-audit.md`。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 只有状态 / 事务主线,缺非功能裁决门禁 | 本 Step 补齐性能、安全、配置、依赖、恢复、观测和证据门禁 |
| `05-测试方案.md` §10 / §13 / §14 | 已有专项测试、证据和残余风险,但还没有验收裁决口径 | 本 Step 把 `EV-CAND-ART-*` 归入正式非功能验收项 |
| `04-配置设计.md` §11 / §12 | 已定义 fail-fast / degraded / handoff 边界,但未升格为验收门禁 | 本 Step 固定配置和依赖作为非功能 release gate |
| `03_ddd_step_15_observability_audit.md` | 已有日志 / 指标 / 审计埋点,但未收口到验收标准 | 本 Step 固定 observability / audit / report integrity 门禁 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 性能验收 | 旧 P95 / SLA 候选混入验收 | 只保留结构性 sample / trend | 当前缺正式负载模型和可引用基线 |
| 安全验收 | 泛化“无泄露” | redaction scan 覆盖 truth / log / metric / audit / report / artifact | 防止正文、secret 和 full sensitive ref 越界 |
| 可用性验收 | 只看能否跑完 | 明确 degraded / delayed / failed marker 且 core truth 不变 | 区分运行期退化和 truth 变更 |
| 配置验收 | 只看配置能加载 | 增加 fail-fast、no silent fallback、topic completeness 和 profile isolation | 防止错误配置静默进入 P0 |
| 证据验收 | 只看报告存在 | 固定 raw artifact + report pairing 和 no-static-evidence | 防止手写 pass / 静态造证据 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否恢复旧 P95 / SLA 为 P0 硬阈值 | A. 恢复;B. 只保留 sample / trend | 采用 B。无正式负载模型时不得硬化。 |
| 是否把 `p1-real-like-selected-run` 提升为当前 P0 | A. 提升;B. 留作 residual | 采用 B。它不在当前 P0 主链。 |
| redaction / dependency / evidence failure 是否可风险接受 | A. 可接受;B. 不可接受 | 采用 B。它们属于硬门禁。 |
| 配置 silent fallback 是否可视为 degraded | A. 可以;B. 不可以 | 采用 B。silent fallback 破坏门禁。 |
| query / job / relay truth repair 是否属于非功能容忍 | A. 可以;B. 不可以 | 采用 B。它违反 truth ownership 和 no-write。 |

## 8. 结构化中间产物

### 8.1 非功能验收表

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| AC-ART-042 | 性能结构性 sample | `release-main-smoke`、`service-flow-fast`、`operations-replay-core` 必须产出 duration / count sample,且核心主链不依赖 P1/P2 能力 | 必须有 sample;不设硬 P95 / SLA | `EV-CAND-ART-CORE-001`;`EV-CAND-ART-CMD-001`;`EV-CAND-ART-QUERY-001`;`EV-CAND-ART-JOB-001` | 缺 sample 或依赖 P1/P2 能力则不通过 |
| AC-ART-043 | 可用性 / 降级 | resolver / publisher / handoff / query / job 失效时必须显式 degraded / delayed / failed marker,且 core truth 不变 | P0 failure injection 场景必须覆盖 | `EV-CAND-ART-QUERY-001`;`EV-CAND-ART-JOB-001`;`EV-CAND-ART-OUTBOX-001` | marker / report 缺失或 truth 被改写则不通过 |
| AC-ART-044 | 安全 / redaction | raw body、raw secret、token、full sensitive ref 不得进入 truth、outbox、audit、trace、log、metric、report、artifact | redaction scan clean;negative leak fixture 必须 fail safely | `EV-CAND-ART-REDACTION-001`;`reports/runs/<run_id>/redaction-check.md` | 任一泄露阻断,不得风险接受 |
| AC-ART-045 | 配置 fail-fast / profile isolation | P0 profile 可装配;invalid config、missing topic、unsafe redaction、production-like fake fixture 必须 fail-fast / reject | `config-redline` blocking pass | `EV-CAND-ART-CONFIG-001`;`reports/runs/<run_id>/suites/config-redline.md` | silent fallback、partial facade 或 missing topic 均不通过 |
| AC-ART-046 | dependency boundary | 编译期上游只允许 `L0-core` / `core-contracts`;其余必须通过 refs / ports / events / handoff | dependency check clean | `EV-CAND-ART-ARCH-001`;`reports/runs/<run_id>/dependency-boundary.md` | 任一 non-core sibling compile dependency 阻断 |
| AC-ART-047 | 恢复 / 幂等 / replay | commit unknown、duplicate replay、partial failure、stored result replay 必须不重跑 mutation,且 same-key replay 读取 stored result | same-key replay 读取 stored result;no second truth write | `EV-CAND-ART-IDEMP-001`;`EV-CAND-ART-JOB-001` | duplicate 重跑 mutation 或盲写 commit unknown 不通过 |
| AC-ART-048 | observability / audit | accepted / rejected / consumer / publisher / job / config failure 必须有 safe log / metric / audit / trace / report refs | 必须是 safe refs;metric labels 低基数 | `EV-CAND-ART-REPORT-001`;`EV-CAND-ART-REDACTION-001` | 缺关键 trace / audit / report 或高敏输出不通过 |
| AC-ART-049 | evidence / report integrity | raw artifact + report pairing 必须成立,候选证据不能由静态 JSON 或手写 pass 伪造 | `report-generation-audit` pass | `EV-CAND-ART-REPORT-001`;`reports/runs/<run_id>/report-audit.md` | 孤儿 EV、缺 raw artifact、静态造证据均不通过 |

### 8.2 P1 / P2 非功能残余表

| 项 | 当前范围 | 验收处理 |
|---|---|---|
| 真实 DB / bus / search / object storage 性能 | P1 / P2 | 不作为 P0 pass / fail;进入 Step 13 residual |
| production-like SLO / SLA | P2 | 无当前硬阈值;若未来硬化需新版 `06` 收口 |
| external GRC vendor 深度集成 | P1 / P2 | P0 只验 disabled / fake / controlled export boundary |
| long-retention evidence storage | 运维 / P1 | 当前只要求验收与复验窗口可追溯 |
| real upstream / downstream seam 产品行为 | P1 / P2 | 当前只验 formal seam contract |
| advanced dashboard / analytics | P2 | 不属于当前 P0 门禁 |

### 8.3 非功能失败裁决表

| 失败 | 裁决 |
|---|---|
| redaction scan failed | 不通过,进入 VETO 候选 |
| dependency boundary failed | 不通过,进入 VETO 候选 |
| config invalid silent fallback | 不通过,不得风险接受 |
| report / artifact pairing failed | 不通过,证据链断裂 |
| accepted truth 缺 trace / audit / outbox / result | 不通过,需回写设计或实现后复验 |
| query / job / relay truth repair | 不通过,违反 no-write 和 truth ownership |
| P0 profile unavailable 却被标为 passed | 不通过,不得风险接受 |
| performance sample missing | 非功能门禁未通过,需补 run 或说明不可裁决 |

### 8.4 非功能门禁停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| AC-ART-042 | 性能是否只保留 sample / trend | 通过 | 不硬化无来源阈值 |
| AC-ART-043 / 047 | degraded / replay / no-truth-repair 是否不反写真相 | 通过 | 继续由 Step 11 收口不可风险接受项 |
| AC-ART-044 | redaction 是否作为硬门禁 | 通过 | 失败不得风险接受 |
| AC-ART-045 / 046 | config / dependency 是否承接 `04` 与 `03` | 通过 | P0 profile 和 core-only upstream 已覆盖 |
| AC-ART-048 / 049 | observability / evidence 是否前置 | 通过 | 继续由 Step 10 / Step 13 细化证据 |

### 8.5 非功能与需求覆盖审计表

| 需求族 | 对应验收项 | 审计结论 |
|---|---|---|
| `NFR-ART-CAP-001~027` | `AC-ART-042~049` | 已分散承接到性能、降级、redaction、配置、依赖、恢复、观测和证据门禁 |
| `NFR-ART-GLOB-001~012` | `AC-ART-042~049` | 单一 truth、外部正文不归属、依赖降级不伪造 truth、边界异常可识别均已纳入 |
| `VF-ART-*` | `AC-ART-044~049` | 与 redaction、config、dependency、recovery、evidence 和 observability 门禁闭环 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_09_nonfunctional.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“非功能验收表”“P1 / P2 非功能残余表”“非功能失败裁决表”“非功能门禁停审记录”和“非功能与需求覆盖审计表”小节,了解本章非功能门禁如何从需求、配置、测试、观测和证据收敛而来。

正式 `06-验收标准.md` §9 应回填:

- 非功能验收覆盖性能结构性 sample、可用性 / 降级、安全 / redaction、配置 fail-fast、dependency boundary、恢复 / 幂等 / replay、observability / audit 和 evidence / report integrity。
- 当前 P0 不设置硬 P95 / SLA;只要求 release / service / operations run 产生 duration / count sample,且核心主链不依赖 P1/P2 能力。
- redaction leak、non-core sibling compile dependency、invalid config silent fallback、report / artifact pairing failure、query / job / relay truth repair、accepted truth 缺 trace / audit / outbox / result 均阻断通过。
- `p1-real-like-selected-run`、真实 seam 产品、production-like / capacity、hard performance threshold 和 long-retention 策略属于 residual,需要在 Step 13 / 新版 `06` 中明确接受人和触发条件。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 是否在未来 release 硬化 P95 / SLA | 影响 AC-ART-042 | 当前不硬化,需新负载模型和阈值来源 |
| `p1-real-like-selected-run` 是否在某些 release 必跑 | 影响 residual / conditional pass | 当前不阻断 P0 |
| evidence retention 天数 | 影响长期审计 | 当前只要求固定 run artifact / report,长期保留进入运维 |
| formal veto / acceptance 引用样式 | 影响最终送验 | 当前只保持 `EV-CAND-ART-*` 与 `14.x` 引用 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 非功能裁决口径明确 | 通过 | 见 §8.1 / §8.3 |
| 无来源阈值未写入 P0 pass | 通过 | 只保留 sample / trend |
| P1 / P2 residual 边界明确 | 通过 | 见 §8.2 |
| 可进入 Step 10 | 通过 | 下一步定义可观测性、审计与证据门禁 |
