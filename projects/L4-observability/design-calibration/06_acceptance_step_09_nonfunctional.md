# L4-observability 06-验收标准 Step 09：定义非功能验收门禁

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `09 / 定义非功能验收门禁` |
| mode | `full-restart` |
| status | `completed_current_design_record_with_inherited_affected_open` |
| current_module | `nfr_source_threshold_lane_and_release_decision_gates` |
| formal_document_write | `not_allowed_until_step_15` |
| real execution | `not_run`;本 Step 只定义未来非功能裁决 |
| new_upstream_blocker | `none` |
| inherited blocker / affected | 12 项保持开放，见 §10 |
| gate_status | `pass_for_nonfunctional_gate_design` |
| next_allowed_action | `start_current_06_step_10` |
| commit | 不需要；用户未要求提交 |

本文件替换同名旧模板。旧模板只有通用 log/metric/trace 摘要，没有承接 24 条 current NFR、三 profile、六 lane、
99 个 exact TC、82 个 dataset、硬红线和无来源阈值处置，不能构成可裁决的非功能验收门禁。

## 1. 本步目标、输入与计划

### 1.1 目标与边界

本 Step 把 `NFR-OBS-001~024` 转成未来送验时可执行的性能结构性、可用性、安全、可追溯、幂等一致性、
恢复、配置兼容和证据真实性门禁。这里的“通过”只表示门禁设计完整，不表示目标仓、环境或任何测试已经通过。

本 Step 不做以下事情：

- 不恢复旧 P95/P99/SLA、吞吐、容量、冷存天数、hash chain 分片或产品默认阈值。
- 不把 TimescaleDB、Grafana、Prometheus、OTel Collector、对象存储、APM 或 GRC 产品设为 truth source。
- 不用 `LocalTest` / `IntegrationLike` 替代未建立的 `RuntimeLike`，也不把 `not_run` 汇总成 `passed`。
- 不创建真实 `<run_id>`、正式 evidence alias、验收 verdict、风险签署或测试结果。

### 1.2 输入与权威顺序

| 输入 | 本步使用 |
|---|---|
| 验收 SOP Step 09 / 书写规范 §5.9 | 非功能项、阈值来源、证据与结论口径 |
| `00-需求文档.md` §13~§14 | `NFR-OBS-001~024`、`AC-OBS-029~031`、`VF-OBS-001~010` |
| `03-详细设计.md` §10~§15 | UoW、幂等、恢复、配置、redaction、telemetry、truth separation |
| `04-配置设计.md` | 三 profile、fail-fast、availability、activation、产品中立边界 |
| `05-测试方案.md` §8~§10、§13~§14 | 六 lane、9 suite、5 script、99 TC、82 DS、证据路径与 residual |
| current Step 01~08 | 验收范围、31 AC、数据/架构红线、60 protocol、27+1 state 与事务门禁 |

权威顺序固定为 current 正式 `00~05` -> current Step 01~08 -> 当前 SOP/书写规范。README、旧正式 06、旧 Step 09
以及旧产品/性能材料只作 `historical_material`。

### 1.3 Step 内计划完成情况

| 计划项 | 产物 | 状态 |
|---|---|---|
| 固定阈值来源和真实性状态 | §4 | done |
| 定义八类非功能验收门禁 | §5 | done |
| 建立 24 NFR 双向覆盖 | §6 | done |
| 固定 lane/profile、未覆盖和失败裁决 | §7~§8 | done |
| 完成逐项停审、跨 NFR 审计与回填草稿 | §9~§13 | done |

## 2. SOP 问题回答

| SOP 问题 | Current 回答 |
|---|---|
| 哪些非功能指标是 P0 | body-free/redaction、truth/no-write、显式 degraded/gap、accepted projection 可追溯、重复不分叉、UoW/recovery、retention protection、配置 fail-fast、only-core compile edge、证据真实性均为 P0；性能当前只验结构性样本和主链独立性。 |
| 阈值来自哪里 | 硬阈值只来自 `00` 的判断句、`03` 的有限类型/状态/顺序不变量、`04` 的配置不变量和 `05` 的 exact manifest；数值性能/容量/保留期没有 current 来源。 |
| 哪些专项未覆盖 | 真实 workload、production capacity、`ENV-STG-RT/ENV-PRD-RT`、真实外部产品 seam、长期 retention 和硬 SLO 未建立；必须为 `blocked/not_evaluated` 或进入 Step 13，不能获得正向结论。 |
| 哪些失败阻断发布 | forbidden body/secret、source truth write、false truth interpretation、active material cleanup、non-core compile edge、silent config fallback、required lane substitution、commit unknown 盲重试、静态/跨 run 造证据均阻断。 |
| 证据来自哪里 | `TC-OBS-*` 的同 run raw case、primary suite report、redaction/metric/dependency/report audit，以及 `reports/runs/<run_id>` 固定报告；candidate EV 只是计划关联。 |

## 3. Historical material 诊断与设计取舍

### 3.1 问题诊断

| 材料 | 问题 | Current 处置 |
|---|---|---|
| 旧 Step 09 81 行模板 | 没有 NFR 编号、阈值来源、suite/lane、失败语义和覆盖审计 | 完整替换，不继承结论 |
| 旧正式 `06` | 含旧性能、数据库或产品假设，且证据路径未按 current run-scoped contract 建立 | Step 15 才从 current Step 01~14 重建 |
| README / 历史产品栈 | P95/SLA、数据库、dashboard、collector、冷存等未获 current source | 仅记录为 historical candidate，不进入 gate |
| current `05` | 已定义结构性 sample、fault injection、checks 和 evidence path，但没有最终验收裁决 | 本 Step 将其转为 acceptance gate，不篡改测试设计 |

### 3.2 裁决取舍

| 议题 | 采用 | 放弃 | 理由 |
|---|---|---|---|
| 性能 | 结构性 sample + 主链独立性 + provenance | 无来源 P95/P99/SLA | 当前无负载模型、样本量、统计方法和环境基线 |
| RuntimeLike | 未建立则 `not_evaluated`，建立后独立裁决 | 以 CI ISO/INT 或截图替代 | profile/lane 不能跨级替代 |
| 可用性 | 显式 typed degraded/gap/blocked/manual | silent fallback、空结果即成功 | Observability 不得补造 source truth |
| 安全 | raw artifact 与 report 全面扫描 | 只检查最终报告或人工承诺 | 泄漏可发生在中间材料和失败输出 |
| no-write | capability graph + writer spy + before/after source snapshot | 只看日志文字 | 必须证明没有外部 truth 写入 |
| 外部产品 | product-neutral seam、availability 和 unsupported/manual | 产品健康等于本仓通过 | 外部 sink 不拥有本仓或业务 truth |

## 4. 阈值来源、状态与升级规则

### 4.1 阈值来源分类

| 类别 | Current 来源 | 可用于通过/失败 | 示例 |
|---|---|---|---|
| absolute redline | `00` VF/BR/DO、依赖裁剪规则 | 是，命中即失败/VETO | forbidden body 数量必须为 0；source writer call 必须为 0；non-core sibling compile edge 必须为 0 |
| finite contract | `03` exact type/state/protocol/order、`04` profile/config invariant | 是 | 60 protocol、27 formal state owner、one UoW/single cursor、finite metric labels、三 profile 合法组合 |
| manifest completeness | `05` exact test/evidence design | 是 | 99 TC、82 DS、9 suite、required checks、同 run artifact/report pairing |
| qualitative structural gate | `00` 未量化 NFR | 是，但只能按结构性条件 | 核心链不依赖外围增强；必须产出 duration/count sample；无 silent timeout |
| numeric candidate | 新需求/负载/环境 review 尚未冻结 | 否 | latency percentile、throughput、capacity、retention duration、error budget |
| historical/product default | README、旧正式文档、产品默认 | 否 | 旧 P95/P99/SLA、冷存天数、TimescaleDB/Grafana 默认值 |

### 4.2 状态真实性与聚合优先级

未来执行允许 `passed`、`failed`、`blocked`、`not_run`、`conditional`、`indeterminate`、`not_evaluated`；设计期只允许
`planned`。总体聚合优先级固定为：

```text
input / evidence integrity failure
  > VETO / hard redline failure
  > required P0 case failure
  > required environment blocked or not_run
  > affected / conditional / indeterminate
  > numeric candidate not_evaluated
  > passed
```

这个顺序不改写原状态。required lane 未建立时，结论是不可裁决或阻塞，不是“负向场景通过”。

### 4.3 数值门禁升级前置

任何 numeric performance/capacity/retention gate 都必须先具有：`NFR` owner、workload/traffic shape、dataset、profile/lane、
warm-up、样本量、统计方法、异常值规则、硬阈值和来源、回归阈值、采集脚本、artifact/report 字段、风险接受和版本变更规则。
缺任一项时只能记录 sample/trend，不能影响 current P0 的正向通过。

## 5. 非功能验收门禁

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 | 通过条件 | 失败条件 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|---|---|
| `NFG-OBS-001` | 性能结构性 / 主链独立性 | intake、audit/evidence、safe signal/query、handoff/retention/rebuild 可独立于 dashboard/APM/GRC/archive 增强运行并产出 duration/count sample | 无 numeric threshold；sample、operation/profile/lane/count/provenance 必须存在 | required P0 flow 完成且不等待 P1/P2 产品；无 silent timeout；sample 可回指同 run raw case | 缺结构性 sample、核心流依赖外围产品、timeout 被写 success，或用旧 P95 判定 | `TC-OBS-NFR-001`;`REL-001~005`;相关 primary suite + `summary.md` | 结构性条件失败=`failed`；数值只作 `not_evaluated`/risk trend |
| `NFG-OBS-002` | 可用性 / 降级 / 产品中立 | source/sink/consumer/archive/external capability 不可用时，输出 exact rejected/quarantined/gap/degraded/blocked/manual，不污染已提交 owner | 所有必需 failure branches 有 typed outcome；silent success=0 | 依赖失效不回滚/重写 source truth；核心观察面保持可解释；optional peripheral 可降级 | empty/success 替代 failure、非法 fallback、外围健康被当业务成功、required capability unavailable 仍标 passed | `ING/DEG/RPT/EXT/CFG/NFR-*`; service/config/recovery/release reports | P0 branch 失败阻断；未建立产品 seam 保持 blocked/not_evaluated |
| `NFG-OBS-003` | 安全 / body-free / redaction | raw body、secret、credential、payload/provider/runtime/archive body、full sensitive ref 不进入 owner、log/metric/trace/audit/outbox/artifact/report | forbidden finding=0；redaction 必须在 serialization/append/report 前 | negative corpus 被 reject/quarantine/blocked；scanner覆盖 raw与report roots且输出不回显原文 | 任一 forbidden finding、scanner 未执行却 clean、hash/base64 escape、metric 高基数字段 | `RED/SIG/EVD/RPT/AUT-*`; `redaction-check.md`;`metric-label-check.md` | 任一 failure 触发 `VF-OBS-002/003`，不得风险接受 |
| `NFG-OBS-004` | truth ownership / no-write / 兼容依赖 | projection/summary/trace/metric/handoff 不等于外部 truth；Query/diagnostic/job/rebuild/export/sink 无 source writer；仅 `core-contracts` 编译依赖 | source writer calls=0；source snapshot delta=0；non-core sibling compile edges=0 | capability graph、write spy、source comparison 和 dependency scan 同时成立；仅写本仓 owner/violation | 反写/修复/控制外部 truth、观察面被裁决为 source truth、non-core compile edge、产品成为 truth source | `TRUTH/NW/DEP/HIST-*`; `dependency-boundary.md`; static/service reports | 触发 `VF-OBS-004/005/008/009/010`，不得条件放行 |
| `NFG-OBS-005` | 审计 / correlation / 可追溯 | accepted/rejected/quarantined/degraded、projection/linkage、retention/no-write、handoff/external phase 均有 safe source/correlation/causation/provenance | 必需 owner/history/report relation 完整；orphan relation=0 | typed context 按 phase 传播，gap/missing 显式；opaque ref 不推导 actor/business relation | accepted path 无 native record/source relation、correlation 断裂被猜测、telemetry 代替 durable owner | `COR/AUD/EVD/RPT/RET/NW-*`; service/repository/telemetry reports | P0 relation 缺失=`failed`；upstream owner未闭合的 positive path=`blocked/conditional` |
| `NFG-OBS-006` | 幂等 / 一致性 / 恢复 | duplicate不二写，CAS/fence/cursor/UoW一致，commit unknown先probe，external prepare/call/finalize分离，恢复不从current truth重建 | second owner/outbox/effect=0；partial commit=0；blind retry=0；stale fence commit=0 | same-key same-digest返回immutable stored result；known failure rollback；unknown保持indeterminate/manual | duplicate重算、partial commit、unknown重跑、stale claimant提交、external call持长事务或换token | `UOW/REB/RET/RPT/NFR-003`; repository/recovery reports | 失败阻断；12 affected 对应 positive gate 保持 conditional/blocked |
| `NFG-OBS-007` | 留存 / 活动引用 / 可恢复性 | `RetentionMarker`、active protection、replay/rebuild 与 backend retention 分离；active/held/referenced material 不清理 | protected cleanup=0；release必须有exact guard/version；backend TTL不能代替marker | hold/reference/consumer conflict 显式；失败保留材料和marker；重建只改派生面 | active material删除、ReleaseEligible等于物理删除、cleanup反写source、固定旧天数成为门禁 | `RET-001~005`;`REB-*`; repository/recovery reports | 触发 `VF-OBS-007` 不通过；长期保留天数未冻结则 not_evaluated |
| `NFG-OBS-008` | 配置 / 环境 / 证据真实性 | 三 profile、六 lane、25 failure、9 suite/99 TC/82 DS 与 run-scoped evidence 不被fallback、静态结果或跨run拼接污染 | required manifests/checks complete；wrong run/latest/static pass=0 | invalid config fail-fast/all-or-error；lane真实；failed/blocked保留；candidate EV从raw/report推导 | partial activation、required lane替代、`latest`、静态passed、跨run拼接、伪造run/evidence/verdict/signoff | `CFG/DEP/HIST/AUT/NFR-*`; `gate-results.md`;`report-audit.md`;`evidence-index.md` | integrity failure阻断；target reality absent时保持 not_run/not_evaluated |

## 6. `NFR-OBS-001~024` 双向覆盖

### 6.1 NFR 到 gate / test / evidence 映射

| NFR 范围 | Current gate | Exact test / dataset 主输入 | Candidate evidence / report | 覆盖判定 |
|---|---|---|---|---|
| `NFR-OBS-001` | `NFG-OBS-001/002` | `ING-001~004`,`REL-001`,`NFR-001`; intake/degraded DS | matching `EV-CAND`; service/release summary | structural sample + no peripheral prerequisite |
| `NFR-OBS-002` | `NFG-OBS-002/005` | `ING-*`,`DEG-*`; intake/gap/availability DS | service/entry/recovery reports | reject/quarantine/gap/degraded distinct |
| `NFR-OBS-003` | `NFG-OBS-003` | `RED-*`; sentinel/intake-negative DS | redaction + suite report | forbidden finding zero |
| `NFR-OBS-004` | `NFG-OBS-005` | `ING/COR/RED-*`; metadata/correlation DS | service report | admission/safety/source traceable |
| `NFR-OBS-005` | `NFG-OBS-001/005` | `AUD/EVD/REL-002`; audit/evidence/read DS | service/release reports | projection/linkage independent and sampled |
| `NFR-OBS-006` | `NFG-OBS-003/004` | `EVD/RED/OWN-*`; evidence-negative/sentinel DS | redaction/static reports | body-free + correct owner |
| `NFR-OBS-007` | `NFG-OBS-005` | `AUD/EVD/DEG-*`; audit/evidence/gap DS | service report | source/purpose/visibility/gap traceable |
| `NFR-OBS-008` | `NFG-OBS-006` | `EVD/UOW/REB-*`; idempotency/UoW DS | service/repository/recovery reports | duplicate single meaning, no truth rewrite |
| `NFR-OBS-009` | `NFG-OBS-001/002` | `SIG/REL-003/NFR-001`; signal/telemetry DS | telemetry/release summary | safe signal independent of dashboard/APM |
| `NFR-OBS-010` | `NFG-OBS-002/005` | `SIG/DEG/DIA-*`; gap/read DS | service/telemetry reports | not-visible/stale/gap/degraded explicit |
| `NFR-OBS-011` | `NFG-OBS-003` | `RED/SIG/RPT-*`; sentinel/telemetry DS | redaction + metric-label reports | raw signal and high-cardinality labels absent |
| `NFR-OBS-012` | `NFG-OBS-002/005` | `DEG/SIG/DIA-*`; telemetry/gap DS | telemetry/service reports | own missing/degraded state observable safely |
| `NFR-OBS-013` | `NFG-OBS-001/004` | `QRY/DIA/RPT/REL-004`; read/handoff DS | service/release summary | query/handoff sample and zero-write |
| `NFR-OBS-014` | `NFG-OBS-002/008` | `RPT/AUT/EXT-*`; handoff/peripheral DS | recovery/report audit | blocked/pending no verdict/run fabrication |
| `NFR-OBS-015` | `NFG-OBS-004` | `QRY/DIA/NW/TRUTH-*`; write-spy DS | service/static reports | all read/diagnostic/handoff source writes zero |
| `NFR-OBS-016` | `NFG-OBS-005/008` | `RPT/AUT/DEG-*`; evidence-design/provenance DS | report-audit/evidence-index | handoff provenance/gap/purpose traceable |
| `NFR-OBS-017` | `NFG-OBS-002/007` | `RET-*`; retention/reference DS | repository/recovery reports | conflicts explicit, protected material retained |
| `NFR-OBS-018` | `NFG-OBS-006/007` | `RET/REB/UOW-*`; idempotency/job/resume DS | repository/recovery reports | repeated retention/rebuild single meaning |
| `NFR-OBS-019` | `NFG-OBS-005/007` | `RET/REB/NW-*`; retention/job report DS | repository/recovery reports | hold/release/replay/violation traceable |
| `NFR-OBS-020` | `NFG-OBS-002/004/007` | `NW/RET/REB/DIA-*`; write-spy/gap DS | telemetry/static/recovery reports | violation/conflict/gap observable without source write |
| `NFR-OBS-021` | `NFG-OBS-003/004/008` | `OWN/NW/RED/DEP-*`; truth/sentinel/dependency DS | redaction/dependency/report audit | no external truth/body/evidence ownership |
| `NFR-OBS-022` | `NFG-OBS-002/008` | `EXT/CFG/DEG/NFR-*`; availability/peripheral DS | config/recovery/release reports | peripheral failure explicit, core not falsely green |
| `NFR-OBS-023` | `NFG-OBS-004/006` | `TRUTH/NW/AUT/UOW-*`; truth comparison/write-spy DS | service/static/report audit | observation material never second truth |
| `NFR-OBS-024` | `NFG-OBS-003/004/008` | `HIST/DEP/AUT/NFR-*`; history/dependency/evidence-design DS | static/report audit | old threshold/product/evidence misuse detected |

### 6.2 反向覆盖审计

| 审计项 | Current 结果 |
|---|---|
| 需求 NFR 数量 | 24/24 已映射，0 orphan |
| AC 承接 | `AC-OBS-029` -> `NFR-OBS-001~020`；`AC-OBS-030` -> `021~024`；`AC-OBS-031` -> no-source threshold/product/history guard |
| VF 承接 | `VF-OBS-001~010` 均至少进入一个 hard/structural gate；Step 11 再固定否决裁决 |
| 无来源 numeric threshold | 0 条被写成 pass/fail threshold |
| 外围产品硬前置 | 0；只保留 product-neutral seam 和 availability |
| TC/DS 新增 | 0；全部复用 current `05` exact ID |

## 7. Profile、lane 与可判定范围

| Lane / profile | Current 可裁决范围 | 不可替代范围 | 缺失时裁决 |
|---|---|---|---|
| `ENV-LCL-ISO` / `LocalTest` | 本地 contract/service/config/static/telemetry 调试 | CI 重现、durable、RuntimeLike | 不作为正式 release evidence |
| `ENV-LCL-INT` / `IntegrationLike` | 本地 durable/recovery/transport 调试 | CI INT、staging | 不作为正式 release evidence |
| `ENV-CI-ISO` / `LocalTest` | deterministic semantic、redaction、metric、dependency、no-write | physical durable、真实 endpoint | required subset 缺失=`blocked/not_run` |
| `ENV-CI-INT` / `IntegrationLike` | durable UoW/CAS/fence/restart/recovery/external controlled | RuntimeLike / production | 不可用时 INT cases 保持 blocked，不 fallback ISO |
| `ENV-STG-RT` / `RuntimeLike` | selected release smoke、真实 approved nonprod seam | production operations | 当前未建立=`not_evaluated`，不得伪 pass |
| `ENV-PRD-RT` / `RuntimeLike` | future operations/readiness，不自动承载 current P0 | 当前 release acceptance | 本轮 out of scope / not_evaluated |

RuntimeLike 检测到 `Fake`、`InMemory`、`Controlled`、`Fixed` 或 `Deterministic` 非法组合时，命中配置/证据真实性硬门禁；
`Disabled` 只可用于正式 optional capability，不能隐藏 required dependency 缺失。

## 8. 未执行、失败与风险转移规则

| 情形 | Current 裁决 | 是否可风险接受 |
|---|---|---|
| absolute redline / VETO finding | `failed`，总体不通过 | 否 |
| required P0 suite/check 未执行或 artifact/report 不完整 | `blocked/not_run`，不得正向放行 | 否，必须补真实执行 |
| affected positive path 因上游 owner 缺失 | `blocked/conditional`，保留 exact negative/fail-closed evidence | 不能以风险接受宣称能力存在；只可接受发布范围排除且需正式角色 |
| `ENV-STG-RT` 未建立 | `not_evaluated`；是否影响该次 release 由 Step 13/14 按送验范围裁决 | 可进入候选风险，但不能伪造成 RuntimeLike pass |
| numeric performance/capacity/retention 未冻结 | `not_evaluated` / trend only | 可作为未来项，有 owner/acceptor/deadline 才支持 conditional |
| 外部产品未选择或 optional unavailable | explicit `Disabled/Unavailable/Unsupported` | 可按范围接受，不得影响核心 truth/no-write/redaction |
| performance sample 高于历史数字 | 不直接失败；历史数字无权威 | 可记录 trend，不得反向生成阈值 |
| evidence authenticity / wrong run / `latest` | integrity failure，验收不可裁决 | 否 |

## 9. 非功能门禁停审与跨项审计

### 9.1 逐门禁停审

| Gate | 来源清楚 | 阈值合法 | pass/fail 可执行 | evidence 固定 | truth boundary | 结论 |
|---|---|---|---|---|---|---|
| `NFG-OBS-001` | yes | qualitative only | yes | summary + TC raw/report | no product truth | `pass_design` |
| `NFG-OBS-002` | yes | finite outcomes | yes | service/config/recovery | no silent source repair | `pass_design_with_environment_precondition` |
| `NFG-OBS-003` | yes | zero finding | yes | redaction/metric reports | body-free | `pass_design` |
| `NFG-OBS-004` | yes | zero writer/edge | yes | static/service reports | no-write / only-core | `pass_design` |
| `NFG-OBS-005` | yes | relation completeness | yes | native owner + report | telemetry not durable truth | `pass_design_with_affected` |
| `NFG-OBS-006` | yes | zero duplicate/partial/blind retry | yes | repository/recovery | no source reconstruction | `pass_design_with_affected` |
| `NFG-OBS-007` | yes | zero protected cleanup | yes | retention/recovery | marker not backend truth | `pass_design` |
| `NFG-OBS-008` | yes | exact counts / same run | yes | gate/report audit/index | no static evidence | `pass_design_with_target_precondition` |

### 9.2 跨非功能审计

| 审计项 | 结果 | 处理 |
|---|---|---|
| NFR orphan / duplicate loss | 0 orphan；多 gate 交叉均为不同断言维度 | pass |
| 旧 P95/P99/SLA/容量/保留天数升级 | 0 | pass |
| required lane fallback | 0 allowed | pass |
| security/no-write/dependency/evidence failure可风险接受 | 0 allowed | pass |
| blocked/not_run/not_evaluated汇总为passed | 0 allowed | pass |
| log/metric/trace冒充 durable audit/business truth | 0 allowed | pass |
| external product成为 truth source | 0 | pass |
| 新 upstream conflict | 0 | 可进入 Step 10 |

## 10. Inherited affected

本 Step 没有发现新上游 blocker。以下 12 项继续开放，且不能由非功能“通过”关闭：

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

I05 只允许 pre-parse/binding fail-closed；J06 只允许 controlled `Blocked/manual`；其余 UoW、recovery、external、
consumer、report ref、secondary owner 和 per-flow implementation proof 必须在真实实现后提供对应 positive evidence。

## 11. 正式 `06` §9 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_09_nonfunctional.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“阈值来源、状态与升级规则”“非功能验收门禁”“NFR 双向覆盖”“Profile、lane 与可判定范围”和“非功能门禁停审与跨项审计”。

正式 §9 应保留 `NFG-OBS-001~008`、24 条 NFR 反向映射、lane/profile 真实性和未执行裁决。性能只允许结构性
sample/trend；redaction/body-free、truth/no-write、依赖裁剪、幂等恢复、active protection、配置与 evidence integrity
是硬门禁。`not_run/blocked/not_evaluated` 不得改写成通过。

## 12. 待确认事项

| ID | 事项 | 当前状态 | 影响 |
|---|---|---|---|
| `Q-06-09-01` | 未来是否冻结 numeric workload/SLO | no source | 当前不影响 P0 structural gate；冻结时需全链回写 |
| `Q-06-09-02` | 哪次 release 强制 `ENV-STG-RT` | release scope absent | Step 13/14 只能定义裁决结构，不能预签 |
| `Q-06-09-03` | 长期 evidence/observation retention duration | no owner/threshold | 只保留 marker/protection gate，不写天数 |
| `Q-06-09-04` | 真实外部产品与 endpoint | not selected | 只验 product-neutral seam 和 explicit availability |

## 13. Step 自检与 gate

| 检查项 | 结论 |
|---|---|
| `NFR-OBS-001~024` 是否 24/24 映射 | yes |
| 是否引入无来源硬阈值 | no |
| 是否固定 pass/fail/evidence/结论口径 | yes |
| 是否区分六 lane / 三 profile 和不可 fallback | yes |
| 是否将未执行项送入 Step 13 而非伪 pass | yes |
| 是否伪造 run/evidence/result/signoff | no |
| 新 upstream blocker | none |
| inherited affected | 12 open；positive gates 条件化 |
| `gate_status` | `pass_for_nonfunctional_gate_design` |
| `next_allowed_action` | `start_current_06_step_10` |
| 正式 `06` 是否修改 | no；Step 15 前禁止 |

## 14. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 09
- `standards/document/验收标准书写规范.md` §5.9
- `projects/L4-observability/00-需求文档.md` §13~§14
- `projects/L4-observability/03-详细设计.md` §10~§15
- `projects/L4-observability/04-配置设计.md`
- `projects/L4-observability/05-测试方案.md` §8~§10、§13~§14
- `projects/L4-observability/design-calibration/06_acceptance_step_01_input_boundary.md` through `06_acceptance_step_08_state_tx_consistency.md`
- `projects/L1-governance/design-calibration/06_acceptance_step_09_nonfunctional.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_09_nonfunctional.md`
