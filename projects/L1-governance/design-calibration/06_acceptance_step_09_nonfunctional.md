# Step 9. 定义非功能验收门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 9
> 回填章节: `06-验收标准.md` §9 非功能验收门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义非功能验收门禁 |
| 当前状态 | 已完成;自动连续推进 |
| 输入基线 | `00-需求文档.md` AC-GOV-026~031;`03-详细设计.md` §11~§14;`04-配置设计.md` §6 / §8 / §11 / §12;`05-测试方案.md` §10 / §13 / §14 |
| 输出文件 | `projects/L1-governance/design-calibration/06_acceptance_step_09_nonfunctional.md` |
| 停审方式 | 本轮按用户要求不停审连续推进;本文件保留独立停审记录 |

## 2. 本步目标

定义性能、安全、可用性、兼容性、恢复、配置和观测等非功能验收门禁。

本 Step 只回答:

- 哪些非功能要求属于 P0 release gate。
- 哪些指标只有 sample / trend,不能硬判 pass/fail。
- 哪些专项失败直接阻断验收或进入 VETO。
- 哪些 P1/P2 环境或真实产品缺失只能进入 residual。
- 非功能证据如何回指 `EV-GOV-NFR-*`、`EV-GOV-CONFIG-*`、`EV-GOV-REDACTION-*`、`EV-GOV-ARCH-*` 和 report path。

本 Step 不填写真实性能数值,不定义 production-like SLO,不把旧 P95/SLA 候选硬化为 P0 阈值。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `03-详细设计.md` §11 | 已完成 | 提供错误、恢复、forbidden body 和 safe diagnostic 口径 |
| `03-详细设计.md` §12 | 已完成 | 提供幂等、并发、commit unknown 和 replay 口径 |
| `03-详细设计.md` §13 / §14 | 已完成 | 提供配置绑定、redaction、observability 和 trace/audit 约束 |
| `04-配置设计.md` §6 / §11 / §12 | 已完成 | 提供 P0 profile、fail-fast/degraded、配置验收门禁和 topic completeness |
| `05-测试方案.md` §10 | 已完成 | 提供专项测试矩阵、性能 sample、redaction、故障注入和观测测试 |
| `05-测试方案.md` §13 / §14 | 已完成 | 提供正式 EV、残余风险和不可风险接受项 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些非功能指标是 P0? | P0 包括性能结构性 sample、availability/degraded surface、安全 / redaction、配置 fail-fast、dependency boundary、idempotency / recovery、observability evidence 和 report integrity。 |
| 阈值来自需求、设计还是运行基线? | 安全、redaction、dependency、query/job no truth repair、config fail-fast 是硬门禁;性能只要求 duration/count sample,旧 P95/SLA 没有当前 P0 硬阈值来源。 |
| 哪些专项未覆盖,是否影响验收? | production-like capacity、真实 DB/bus/search/object storage、external GRC vendor 深度行为、高级 Policy DSL 和真实 SLO 当前未覆盖,不影响 P0,但必须进入 Step 13 residual。 |
| 哪些非功能失败会阻断发布? | redaction leak、non-core sibling compile dependency、invalid config silent fallback、P0 profile unavailable、evidence/report integrity failure、query/job truth repair、missing release-main-smoke business assertions 均阻断。 |
| 证据来自哪里? | 证据来自 `release-main-smoke`、`operations-replay-core`、`redaction-boundary`、`config-redline`、`dependency-boundary`、`report-generation-audit` 和 `reports/runs/<run_id>` 固定报告。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 非功能门禁使用旧 P95 / SLA 口径,无当前负载模型和环境基线 | 改为 P0 sample/trend,不硬判 numeric threshold |
| `05-测试方案.md` §10 | 已明确旧性能数字为候选 | 本 Step 保持候选身份,避免写成通过阈值 |
| `04-配置设计.md` | 配置失败、redaction 和 topic completeness 已定义 | 本 Step 转成 AC-GOV-NFR 门禁 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 性能验收 | 旧固定 P95/SLA | 当前只要求 sample 存在且不依赖 P1/P2 能力 | 缺正式负载模型和 production-like baseline |
| 安全验收 | 泛化“无敏感泄露” | redaction scan 覆盖 artifact/report/log/audit/trace/outbox/report | 支撑 VF-GOV-003 / 007 |
| 可用性验收 | 外部服务可用 | unavailable/degraded/failed marker 正确且 core truth unchanged | P0 不依赖真实外部产品 |
| 配置验收 | 配置可加载 | invalid config fail-fast、no silent fallback、topic completeness、profile isolation | 防止配置绕过设计不变量 |

## 7. 验收裁决取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否恢复旧 P95/SLA 为 P0 硬阈值 | A. 恢复;B. 只保留 sample/trend | 采用 B。无正式负载模型、环境和基线时不得硬判 |
| P1 selected-run 不可用是否导致 P0 不通过 | A. 是;B. 否,记录 residual | 采用 B。P0 使用 fake/controlled/disabled seam |
| redaction check 失败是否可风险接受 | A. 可接受;B. 不可接受 | 采用 B。安全和正文边界属于硬门禁 |
| dependency boundary failed 是否可有条件通过 | A. 可;B. 不可 | 采用 B。非 core sibling compile dependency 命中架构红线 |

## 8. 结构化中间产物

### 8.1 非功能验收表

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| AC-GOV-NFR-001 | 性能结构性 sample | release smoke、service flow、operations replay 产出 duration/count sample,且核心主链不依赖 P1/P2 能力 | 必须有 sample;无硬 P95/SLA | `EV-GOV-NFR-001`;`reports/runs/<run_id>/suites/release-main-smoke.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | sample 缺失或依赖 P1/P2 能力则不通过;数值高低只进风险 |
| AC-GOV-NFR-002 | 可用性 / 降级 | resolver/publisher/handoff/export/store runtime failure 映射为 degraded/delayed/failed marker/report,core truth unchanged | P0 failure injection 场景必须覆盖 | `EV-GOV-NFR-001`;`EV-GOV-JOB-001`;`EV-GOV-OUTBOX-001` | marker/report 缺失或 truth 被回滚/改写则不通过 |
| AC-GOV-NFR-003 | 安全 / redaction | raw body、raw secret、token、full sensitive ref 不得进入 truth、outbox、audit、trace、log、metric、report、artifact | redaction scan clean;negative leak fixture must fail safely | `EV-GOV-REDACTION-001`;`reports/runs/<run_id>/redaction-check.md` | 任一泄露阻断;不得风险接受 |
| AC-GOV-NFR-004 | 配置 fail-fast / profile isolation | P0 profile 可装配;invalid config、missing topic、unsafe redaction、production-like fake fixture fail-fast/reject | `config-redline` blocking pass | `EV-GOV-CONFIG-001`;`reports/runs/<run_id>/suites/config-redline.md` | silent fallback、partial facade 或 missing topic 均不通过 |
| AC-GOV-NFR-005 | dependency boundary | 编译期上游只允许 `L0-core` / core-contracts;其余通过 ref/adapter/event/handoff | dependency check clean | `EV-GOV-ARCH-001`;`reports/runs/<run_id>/dependency-boundary.md` | 任一 non-core sibling compile dependency 阻断 |
| AC-GOV-NFR-006 | 恢复 / 幂等 / replay | commit unknown、duplicate、partial failure、retry/dead-letter、stored report replay 均可解释且不重跑 mutation | `EV-GOV-IDEMP-001` and job/outbox suite pass | `EV-GOV-IDEMP-001`;`EV-GOV-JOB-001`;`EV-GOV-OUTBOX-001` | duplicate 重跑、partial failure 无 report 或 commit unknown 盲写不通过 |
| AC-GOV-NFR-007 | observability / audit | accepted mutation、rejected path、consumer、publisher、job、config failure 均有 safe log/metric/audit/trace/report refs | 必须有 safe refs;metric labels low-cardinality | `EV-GOV-NFR-001`;`EV-GOV-REPORT-001`;`EV-GOV-REDACTION-001` | 缺关键 trace/audit/report 或高敏输出不通过 |
| AC-GOV-NFR-008 | evidence / report integrity | blocking suite 均有 raw artifact + run report;EV 不由静态 JSON 或手写表伪造 | report-generation-audit pass | `EV-GOV-REPORT-001`;`reports/runs/<run_id>/report-audit.md` | orphan EV、缺 artifact、static pass 阻断 |

### 8.2 P1/P2 非功能残余表

| 项 | 当前范围 | 验收处理 |
|---|---|---|
| 真实 DB / bus / search / object storage 性能 | P1/P2 | 不作为 P0 pass/fail;进入 Step 13 residual |
| production-like SLO / SLA | P2 | 无当前硬阈值;未来需负载模型和运维基线 |
| external GRC vendor deep integration | P1/P2 | P0 只验 disabled/fake/controlled export boundary |
| advanced Policy DSL / simulation performance | P2 | 不作为基础 Policy truth 门禁 |
| long-retention evidence storage | P1/P2 / 运维 | 当前只要求验收和复验期间可追溯;长期保留进入运维标准 |

### 8.3 非功能失败裁决表

| 失败 | 裁决 |
|---|---|
| redaction scan failed | 不通过;进入 VETO |
| dependency boundary failed | 不通过;进入 VETO |
| config invalid silent fallback | 不通过;进入 VETO 候选 |
| P0 profile unavailable but marked passed | 不通过;不得风险接受 |
| performance sample missing | 非功能门禁失败;需补 run 或说明不可裁决 |
| performance sample 高于候选旧 P95 | 不直接失败;进入 risk/trend |
| P1 selected-run unavailable | 不影响 P0;进入 Step 13 residual |
| report-generation-audit failed | 不通过;Step 10 证据门禁失败 |

### 8.4 非功能门禁停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| AC-GOV-NFR-001 | 阈值是否有来源 | 通过 | 无硬 P95/SLA;只要求 sample |
| AC-GOV-NFR-002 / 006 | failure / recovery 是否不反写真相 | 通过 | 继续由 Step 11 裁决 VETO |
| AC-GOV-NFR-003 | redaction 是否硬门禁 | 通过 | 失败不得风险接受 |
| AC-GOV-NFR-004 | config fail-fast 是否承接 `04` | 通过 | P0 profile and topic completeness 已覆盖 |
| AC-GOV-NFR-005 | dependency boundary 是否清楚 | 通过 | only `L0-core` compile upstream |
| AC-GOV-NFR-008 | evidence integrity 是否前置 | 通过 | Step 10 展开证据门禁 |

## 9. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_09_nonfunctional.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“非功能验收表”“P1/P2 非功能残余表”“非功能失败裁决表”和“非功能门禁停审记录”小节,了解非功能验收如何从配置、专项测试、证据和残余风险收敛。

正式 `06-验收标准.md` §9 应回填:

- 非功能验收覆盖性能结构性 sample、可用性 / 降级、安全 / redaction、配置 fail-fast、dependency boundary、恢复 / 幂等 / replay、observability / audit 和 evidence integrity。
- 当前 P0 不设置硬 P95/SLA;只要求 release / service / operations run 产生 duration/count sample,且核心主链不依赖 P1/P2 能力。
- redaction leak、non-core sibling compile dependency、invalid config silent fallback、evidence/report integrity failure 和 query/job truth repair 均阻断通过。
- P1 selected-run、production-like、真实产品性能、external GRC vendor 深度行为和长期保留策略进入 residual / future,不得伪装 P0 pass。

## 10. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 是否在未来 release 硬化 P95/SLA | 影响 AC-GOV-NFR-001 | 当前不硬化;需新负载模型、环境和阈值来源 |
| P1 selected-run 是否某次送验强制 | 影响 residual / conditional pass | Step 13 / 14 处理 |
| evidence retention 天数 | 影响长期审计 | 当前只要求固定 run artifact/report;长期保留进运维或风险 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 非功能裁决口径明确 | 通过 | 见 §8.1 / §8.3 |
| 无来源阈值未写入 P0 pass | 通过 | 旧 P95/SLA 仅 sample/trend |
| P1/P2 residual 边界明确 | 通过 | 见 §8.2 |
| 可进入 Step 10 | 通过 | 下一步定义可观测性、审计与证据门禁 |
