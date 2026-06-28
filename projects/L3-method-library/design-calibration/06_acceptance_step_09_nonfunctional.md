# Step 9. 定义非功能验收门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 9
> 回填章节: `06-验收标准.md` §9 非功能验收门禁
> 创建日期: 2026-06-28
> 当前模式: full-restart / step9-nonfunctional
> 当前状态: completed_wait_user_confirm_to_R10.1
> 当前模块: `R9.2 nonfunctional gate:再写入`
> 当前门禁: `R9.2` completed_wait_user_confirm_to_R10.1;等待确认进入 Step 10 `R10.1 observability evidence:先思考`

---

## R9.1 nonfunctional gate:先思考

### 1. 当前模块目标

`R9.1` 只思考新版 `06-验收标准.md` 的非功能验收门禁如何从正式 `00`~`05`、Step 6~8 中间产物和 SOP Step 9 收敛。

当前模块不修改正式 `06-验收标准.md`,不写最终非功能验收表,不裁决 Step 10 证据真实性,不裁决 Step 11 一票否决,不补性能阈值、SLO、容量模型、真实 provider SLA、metric schema、report schema、CI required check 或 implementation boundary。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.2 |
| 用户确认 | 已确认从 Step 8 completed 推进到 Step 9 `R9.1 nonfunctional gate:先思考`。 |
| 当前允许 | 思考 P0 非功能维度、阈值来源、专项覆盖缺口、阻断发布失败、证据来源、P1/P2 residual 和 R9.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写最终非功能验收表;把旧 P95/SLO/SLA 写成 P0;写真实执行结论;生成 Step 10/11/13 裁决;补 config key、metric name、retention、artifact schema 或实现命令。 |

### 2. 本模块输入承接

| 输入 | R9.1 关注点 | 禁止外推 |
|---|---|---|
| SOP Step 9 | 性能、安全、可用性、兼容性、恢复等非功能门禁;阈值不得无来源。 | 用习惯性 P95、SLO、容量、外部 SLA 或经验数值填补阈值。 |
| Step 6 架构红线 | truth owner、Definition vs Use、body-free、dependency boundary、query/job/report no truth repair。 | 把非功能通过条件写成可绕过架构红线的风险接受。 |
| Step 7 接口 / 事件 / 同步 | Command / Query / Inbound / Outbound / Job 边界和跨仓协作可用性。 | 要求真实下游产品、真实 topic 或真实 publisher 成为当前 P0。 |
| Step 8 状态 / 事务 / 一致性 | UoW、stored replay、checkpoint、commit unknown、expected_version、no hidden write。 | 用非功能恢复或观测机制修复 truth。 |
| `00-需求文档.md` | `NFR-ML-*` 的性能、可用性、安全、追溯、幂等、观测和一致性方向。 | 把未量化的 NFR 直接转成无来源数字阈值。 |
| `01-架构设计.md` | 横切关注点:安全、可观测性、韧性/恢复、性能/容量、兼容/演进。 | 把 `L4-observability`、console、marketplace、artifact 等外围增强写成定义主线前置。 |
| `03-详细设计.md` | §14 observability / redaction:body-free、low-cardinality、diagnostic not truth、observability not recovery source。 | 自行定义 metric names、alert thresholds、sampling、retention、runbook 或 dashboard。 |
| `04-配置设计.md` | profile、config validation、secret/redaction、dependency availability、degraded / unavailable。 | 用配置开关改变 truth owner、依赖方向或安全边界。 |
| `05-测试方案.md` | `config-redline`、`dependency-boundary`、`redaction-boundary`、`observability-boundary`、`report-generation-audit`、`release-main-smoke` 和 `EV-ML-*`。 | 用静态 JSON、`latest`、手写报告或 P1 selected-run 替代 P0 evidence。 |
| L1-governance Step 9 | framework_reference:参考模块结构、P1/P2 residual、失败裁决和停审粒度。 | 复制 governance 领域事实、`AC-GOV-*`、`EV-GOV-*`、旧阈值或治理对象。 |

### 3. SOP Step 9 问题思考

| SOP 问题 | R9.1 初判 | R9.2 写入提醒 |
|---|---|---|
| 哪些非功能指标是 P0? | P0 应覆盖性能 sample/trend、availability/degraded/unavailable、安全/redaction、config fail-fast/profile isolation、dependency boundary、recovery/idempotency/replay、observability/audit safe signal、evidence/report integrity 和 compatibility/evolution explicitness。 | 写入 `ML-NFR-*` 时按维度聚合,避免和 Step 8 状态/事务项重复。 |
| 阈值来自需求、设计还是运行基线? | Redaction、dependency boundary、config fail-fast、no truth repair、evidence integrity、P0 profile unavailable marked passed 等有硬门禁来源。性能/容量只有 sample/trend 来源,没有 P95/SLO/capacity/external SLA 硬阈值。 | `阈值` 列可写“blocking pass / scan clean / no source-less threshold / sample required”,不得写具体毫秒、QPS、错误率或 SLA。 |
| 哪些专项未覆盖,是否影响验收? | production-like capacity、real DB/bus/search/object storage、真实 external provider SLA、长期 retention、真实 publisher/handoff target、marketplace/console 深层行为当前不是 P0。 | 写 P1/P2 residual 表,后续 Step 13 承接;不得伪装为 P0 pass。 |
| 哪些非功能失败会阻断发布? | raw body/secret 泄露、non-core sibling compile dependency、invalid config silent fallback、query/job/observability truth repair、artifact/report pairing 缺失、`latest` 正式引用、static evidence 伪 pass、P0 profile unavailable 却 marked passed 均阻断。 | R9.2 写失败裁决表;Step 11 再裁决一票否决。 |
| 证据来自哪里? | `EV-ML-CONFIG-001`、`EV-ML-DEPENDENCY-001`、`EV-ML-REDACTION-001`、`EV-ML-OBSERVABILITY-001`、`EV-ML-REPLAY-001`、`EV-ML-REPORT-001`、`EV-ML-RELEASE-001` 和相关 suite report。 | Step 10 继续展开 raw artifact/report pairing 和 evidence index;本 Step 不写正式 schema。 |

### 4. 非功能维度候选思考

| 候选 ID | 维度 | R9.1 判断 | 证据候选 | R9.2 处理 |
|---|---|---|---|---|
| ML-NFR-001 | Performance sample / trend | 当前只要求 duration/count/sample/trend 可采集,证明核心主链不依赖 P1/P2 能力;无硬 P95/SLO。 | `EV-ML-RELEASE-001`;`EV-ML-SERVICE-001`;`EV-ML-REPLAY-001` | 写“sample required / no hard threshold”。 |
| ML-NFR-002 | Availability / degraded / unavailable | required missing fail-fast 或 safe rejected;optional unavailable 返回正式 degraded/unavailable marker;外围失败不改 truth。 | `EV-ML-CONFIG-001`;`EV-ML-INFRA-001`;`EV-ML-ENTRY-001` | 写可用性门禁,但不要求真实 provider 可用。 |
| ML-NFR-003 | Security / redaction / body-free | log、trace、audit、report、artifact、diagnostic 不得含 raw body、secret、provider response 或 full sensitive ref。 | `EV-ML-REDACTION-001`;`EV-ML-OBSERVABILITY-001`;`EV-ML-REPORT-001` | 写硬门禁;失败不得风险接受。 |
| ML-NFR-004 | Config fail-fast / profile isolation | invalid config、unsafe redaction、profile contradiction、forbidden configurable boundary 必须 fail-fast/reject。 | `EV-ML-CONFIG-001` | 写 blocking pass;不新增 config key。 |
| ML-NFR-005 | Dependency boundary | 只允许正式依赖方向;non-core sibling compile dependency 必须阻断;runtime/event/replay 不等于 compile dependency。 | `EV-ML-DEPENDENCY-001` | 写架构型非功能硬门禁。 |
| ML-NFR-006 | Recovery / idempotency / replay | commit unknown、duplicate、partial failure、stored report replay 必须可解释且不重跑 mutation、不 hidden write。 | `EV-ML-REPLAY-001`;`EV-ML-SERVICE-001`;`EV-ML-INFRA-001` | 与 Step 8 去重,侧重非功能 release gate。 |
| ML-NFR-007 | Observability / audit safe signal | metric label low-cardinality;trace/span body-free;audit refs-only;diagnostic not truth;observability 不修复 truth。 | `EV-ML-OBSERVABILITY-001`;`EV-ML-REDACTION-001` | 写观测安全性,详细证据门禁留 Step 10。 |
| ML-NFR-008 | Evidence / report integrity | blocking suite 必须有 run-scoped artifact/report pair;不得使用 `latest`、static evidence 或手写 pass。 | `EV-ML-REPORT-001`;`EV-ML-RELEASE-001` | 本 Step 作为非功能完整性候选;Step 10 展开。 |
| ML-NFR-009 | Compatibility / explicit evolution | 正式引用、消费材料、资产范围、接口/事件/配置变更必须显式;旧对象或旧 phase 不得静默复活。 | `EV-ML-CONTRACT-001`;`EV-ML-DEPENDENCY-001`;`EV-ML-REPORT-001` | 写兼容/演进门禁;不定义 semver policy。 |

### 5. 阈值来源思考

| 类别 | 当前来源 | R9.1 判断 | R9.2 写入提醒 |
|---|---|---|---|
| Redaction scan clean | `03` §14;`05` §10 / §13 | 有硬门禁来源。 | 任一 raw body/secret/provider response/full sensitive ref 泄露即失败。 |
| Dependency boundary clean | `01` §8;`05` dependency-boundary | 有硬门禁来源。 | non-core sibling compile dependency 阻断。 |
| Config fail-fast | `04` profile/config validation;`05` config-redline | 有硬门禁来源。 | silent fallback、unsafe profile、P0 unavailable marked passed 均失败。 |
| No truth repair | Step 6~8;`03` §9~§12;`05` recovery tests | 有硬门禁来源。 | Query/job/observability 修 truth 均失败。 |
| Evidence/report integrity | `05` §13 | 有硬门禁来源,但详细 schema 留 Step 10。 | artifact/report pair、no latest、no static pass。 |
| Performance duration/count/sample | `00` NFR direction;`05` §10 | 只有 sample/trend 来源。 | 不写 P95/SLO/capacity pass/fail。 |
| Production-like capacity | `01` risk;`05` residual | 缺负载模型和部署基线。 | P1/P2 residual,不得作为 P0。 |
| External provider SLA | `05` residual | 缺真实 provider baseline。 | residual 或未来验收,不得当前硬化。 |

### 6. P1 / P2 残余思考

| 能力 / 材料 | R9.1 判断 | R9.2 写入提醒 |
|---|---|---|
| real DB / bus / search / object storage | P1/P2 selected-run 或后续部署绑定。 | P0 只验 port / repository / seam / fake controlled behavior。 |
| production-like capacity / long-run | 缺容量模型、负载模型和部署基线。 | 进入 Step 13 residual;不写当前 P0 pass/fail。 |
| external provider SLA / real publisher target | 当前不是 P0 真值来源。 | 只验证 safe boundary、candidate/outcome/handoff surface。 |
| marketplace / console / SDK 深层行为 | peripheral / future。 | 不进入当前 core P0 非功能门禁。 |
| long retention / dashboard / alert threshold | 运维或后续观测基线。 | Step 10 可写证据入口,不得定义 retention/alert 数字。 |

### 7. 旧正式 06 污染思考

| 旧口径 | R9.1 判断 | R9.2 处理 |
|---|---|---|
| 旧 P95 / SLA / capacity | 当前没有负载模型、环境和阈值来源。 | 不进入 P0 硬阈值;最多作为 historical pollution。 |
| PostgreSQL / gateway / HTTP code | 属旧实现/transport 绑定。 | 不作为非功能验收阈值或证据来源。 |
| old outbox / delivery | 与当前 candidate/outcome/handoff safe surface 不一致。 | 不作为可用性或恢复证明。 |
| MethodContent / publish / snapshot / fingerprint | 旧主语污染。 | 不作为兼容性或性能基线。 |
| 静态报告或 `latest` | 当前 `05` 明确禁止。 | R9.2 写成失败裁决候选,Step 10 展开证据门禁。 |

### 8. R9.2 写入策略思考

R9.2 应写入 Step 9 的结构化中间产物,但仍不修改正式 `06-验收标准.md`。

| 写入范围 | 目的 |
|---|---|
| SOP 问题回答 | 固定哪些非功能维度是 P0、哪些阈值有来源、哪些缺口进入 residual。 |
| 非功能验收表 | 将 `ML-NFR-*` 的维度、指标/要求、阈值来源、证据来源和结论口径写清。 |
| 阈值来源矩阵 | 防止 P95/SLO/capacity/external SLA 无来源硬化。 |
| P1/P2 residual 表 | 将 real-like / production-like / external SLA / retention 等转交 Step 13。 |
| 非功能失败裁决表 | 固定 redaction、dependency、config、truth repair、evidence integrity 等失败的阻断口径。 |
| 非功能验收项停审记录 | 检查阈值来源、证据来源、P0/P1 边界、旧口径污染和 Step 10/11 衔接。 |
| 回填草稿 | 提供未来 `06` §9 草稿,不写正式文档。 |

### 9. R9.2 写入边界思考

`R9.2 nonfunctional gate:再写入` 可以写入:

1. `06_acceptance_step_09_nonfunctional.md` 的 SOP 问题回答、非功能验收表、阈值来源矩阵、P1/P2 residual 表、非功能失败裁决表、停审记录、回填草稿、待确认事项和进入 Step 10 条件。
2. `06_acceptance_calibration_flow.md` 推进到 Step 9 completed_wait_user_confirm_to_R10.1。
3. `project_execution_ledger.md` 推进到 `06` Step 9 completed_wait_user_confirm_to_R10.1。

`R9.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. Step 10 evidence artifact/report schema、Step 11 VETO 最终裁决、Step 13 risk acceptance 结论。
3. 无来源 P95/SLO/capacity/external SLA、真实 provider SLA、metric names、alert thresholds、retention days、CI YAML、implementation boundary 或实现代码。

### 10. R9.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 9 R9.1 | pass |
| 是否读取 SOP Step 9 和 L1-governance 框架 | pass |
| 是否承接 `00` NFR、`01` 横切关注点、`03` observability/redaction、`04` config/dependency 和 `05` 非功能专项 | pass |
| 是否识别阈值来源并禁止无来源 P95/SLO/capacity | pass |
| 是否使用 L3-local `ML-NFR-*` 候选而非 governance ID | pass |
| 是否明确 P1/P2 不污染 P0 非功能门禁 | pass |
| 是否未填写最终非功能验收表、真实测试结论或 verdict | pass |
| 是否未修改正式 `06-验收标准.md` | pass |
| 是否形成 R9.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.2 nonfunctional gate:再写入`;只允许写入 Step 9 的 SOP 问题回答、非功能验收表、阈值来源矩阵、P1/P2 residual 表、非功能失败裁决表、非功能验收项停审记录、回填草稿、待确认事项和进入 Step 10 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R9.2 nonfunctional gate:再写入

### 11. R9.2 模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.1 |
| 用户确认 | 已确认从 Step 9 `R9.1 nonfunctional gate:先思考` 推进到 `R9.2 nonfunctional gate:再写入`。 |
| 当前写入 | SOP 问题回答、非功能验收表、阈值来源矩阵、P1/P2 residual 表、非功能失败裁决表、停审记录、回填草稿、待确认事项和进入 Step 10 条件。 |
| 当前禁止 | 修改正式 `06`;写 Step 10 artifact/report schema;裁决 Step 11 VETO;写真实测试执行结论;补 P95/SLO/capacity/external SLA、metric name、alert threshold、retention、CI 或 implementation boundary。 |

### 12. SOP 问题回答

| SOP 问题 | R9.2 回答 |
|---|---|
| 哪些非功能指标是 P0? | P0 覆盖 performance sample/trend、availability/degraded/unavailable、安全/redaction、config fail-fast/profile isolation、dependency boundary、recovery/idempotency/replay、observability/audit safe signal、evidence/report integrity 和 compatibility/evolution explicitness。 |
| 阈值来自需求、设计还是运行基线? | Redaction、dependency boundary、config fail-fast、no truth repair、evidence integrity 和 P0 profile unavailable marked passed 有硬门禁来源。Performance 只有 duration/count/sample/trend 来源,没有硬 P95/SLO/capacity/external SLA。 |
| 哪些专项未覆盖,是否影响验收? | production-like capacity、real DB/bus/search/object storage、真实 external provider SLA、长期 retention、真实 publisher/handoff target、marketplace/console 深层行为不影响当前 P0,但必须进入 residual / future acceptance。 |
| 哪些非功能失败会阻断发布? | raw body/secret 泄露、non-core sibling compile dependency、invalid config silent fallback、query/job/observability truth repair、artifact/report pairing 缺失、`latest` 正式引用、static evidence 伪 pass、P0 profile unavailable 却 marked passed 均阻断。 |
| 证据来自哪里? | 证据来自 `EV-ML-CONFIG-001`、`EV-ML-DEPENDENCY-001`、`EV-ML-REDACTION-001`、`EV-ML-OBSERVABILITY-001`、`EV-ML-REPLAY-001`、`EV-ML-REPORT-001`、`EV-ML-RELEASE-001` 和相关 `reports/runs/<run_id>/...` suite report。 |

### 13. 非功能验收表

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| ML-NFR-001 | Performance sample / trend | release smoke、service flow、operations replay 至少产出 duration/count/sample/trend,并证明核心主链不依赖 P1/P2 能力。 | sample required;no hard P95/SLO/capacity threshold。 | `EV-ML-RELEASE-001`;`EV-ML-SERVICE-001`;`EV-ML-REPLAY-001`;`reports/runs/<run_id>/suites/release-main-smoke.md`;`service-flow-fast.md`;`operations-replay-core.md` | sample 缺失或依赖 P1/P2 能力则非功能门禁失败;数值趋势只进入风险/残余,不直接判 P0 失败。 |
| ML-NFR-002 | Availability / degraded / unavailable | required dependency missing 必须 fail-fast 或 safe rejected;optional dependency unavailable 必须返回正式 degraded/unavailable marker;外围失败不得改写 truth。 | blocking pass for required missing / optional unavailable scenarios。 | `EV-ML-CONFIG-001`;`EV-ML-INFRA-001`;`EV-ML-ENTRY-001`;`reports/runs/<run_id>/suites/config-redline.md`;`infra-runtime-fake.md`;`entry-worker-job.md` | silent pass、无 marker、truth 被外围失败回滚/改写均不通过;真实 provider 不可用只进入 residual。 |
| ML-NFR-003 | Security / redaction / body-free | log、trace、audit、report、artifact、diagnostic 不得含 raw body、secret、credential、token、provider response、raw endpoint 或 full sensitive ref。 | redaction-boundary clean;negative leak fixture must fail safely。 | `EV-ML-REDACTION-001`;`EV-ML-OBSERVABILITY-001`;`EV-ML-REPORT-001`;`reports/runs/<run_id>/suites/redaction-boundary.md`;`observability-boundary.md`;`report-generation-audit.md` | 任一泄露阻断验收;不得用人工目测或风险接受替代 redaction-boundary。 |
| ML-NFR-004 | Config fail-fast / profile isolation | invalid config、unsafe redaction、profile contradiction、forbidden configurable boundary、P0 profile unavailable marked passed 必须 fail-fast/reject。 | config-redline blocking pass。 | `EV-ML-CONFIG-001`;`reports/runs/<run_id>/suites/config-redline.md` | silent fallback、partial facade、profile 互污染或配置改变 truth owner / 依赖方向均不通过。 |
| ML-NFR-005 | Dependency boundary | 只允许正式依赖方向;non-core sibling compile dependency 必须阻断;runtime/event/replay 协作不得伪装 compile dependency。 | dependency-boundary clean。 | `EV-ML-DEPENDENCY-001`;`reports/runs/<run_id>/suites/dependency-boundary.md` | 任一 non-core sibling compile dependency 或反向依赖阻断;不得有条件通过。 |
| ML-NFR-006 | Recovery / idempotency / replay | commit unknown、duplicate、partial failure、stored report replay 必须可解释,且不得重跑 mutation、重发 side effect 或 hidden write 修 truth。 | recovery/replay suite blocking pass。 | `EV-ML-REPLAY-001`;`EV-ML-SERVICE-001`;`EV-ML-INFRA-001`;`operations-replay-core.md`;`service-flow-fast.md`;`infra-runtime-fake.md` | duplicate rerun、commit unknown 盲写、partial failure 无 report/checkpoint 或 query/job repair truth 均不通过。 |
| ML-NFR-007 | Observability / audit safe signal | metric label low-cardinality;trace/span body-free;audit refs-only;diagnostic not truth;observability 不替代 stored replay、report、checkpoint 或 recovery source。 | observability-boundary blocking pass for safe signal shape。 | `EV-ML-OBSERVABILITY-001`;`EV-ML-REDACTION-001`;`reports/runs/<run_id>/suites/observability-boundary.md`;`redaction-boundary.md` | 高基数敏感标签、raw diagnostic、观测材料修 truth 或成为恢复来源均不通过。 |
| ML-NFR-008 | Evidence / report integrity | blocking suite 必须有 run-scoped artifact/report pair;不得使用 `latest`、static evidence、手写 pass 或缺 failed suite evidence。 | report-generation-audit blocking pass;no latest/static pass。 | `EV-ML-REPORT-001`;`EV-ML-RELEASE-001`;`reports/runs/<run_id>/suites/report-generation-audit.md`;`release-main-smoke.md` | orphan EV、缺 raw artifact、report 与 artifact 不配对、`latest` 正式引用或 static pass 均不通过;详细 schema 留 Step 10。 |
| ML-NFR-009 | Compatibility / explicit evolution | 正式引用、消费材料、资产范围、接口/事件/配置变更必须显式;旧 MethodContent、publish、snapshot、fingerprint、old outbox 不得静默复活。 | explicit change evidence required;old-state resurrection forbidden。 | `EV-ML-CONTRACT-001`;`EV-ML-DEPENDENCY-001`;`EV-ML-REPORT-001`;`contract-domain-fast.md`;`dependency-boundary.md`;`report-generation-audit.md` | 静默覆盖正式版本、旧主语污染、接口/配置变更无追溯或兼容性破坏无显式裁决均不通过。 |

### 14. 阈值来源矩阵

| 阈值 / 门禁 | 来源 | 当前裁决 | 禁止写法 |
|---|---|---|---|
| Redaction clean | `03` §14;`05` §10 / §13 | P0 硬门禁。 | “基本无泄露”“人工确认无敏感信息”。 |
| Dependency boundary clean | `01` §8;`05` dependency-boundary | P0 硬门禁。 | “仅测试环境反向依赖可接受”。 |
| Config fail-fast / profile isolation | `04` profile/config validation;`05` config-redline | P0 硬门禁。 | “配置缺失时 fallback pass”。 |
| No truth repair | Step 6~8;`03` §9~§12;`05` recovery tests | P0 硬门禁。 | “query/job/observability 自动修复 truth 后通过”。 |
| Evidence/report integrity | `05` §13 | P0 硬门禁;Step 10 展开证据门禁。 | “静态 JSON pass”“report 见 latest”。 |
| Performance sample/trend | `00` NFR direction;`05` §10 | P0 只要求 sample/trend 存在。 | 写 P95、QPS、错误率、容量或 SLA pass/fail。 |
| Production-like capacity | `01` risk;`05` residual | 当前 residual/future。 | “production-like 未跑所以 P0 不通过”或“未跑但标记 P0 通过”。 |
| External provider SLA | `05` residual | 当前 residual/future。 | “真实 provider 达到某 SLA 即 P0 通过”。 |

### 15. P1 / P2 非功能 residual 表

| 项 | 当前范围 | 验收处理 |
|---|---|---|
| real DB / bus / search / object storage | P1/P2 selected-run 或部署绑定 | 不作为 P0 pass/fail;P0 只验 formal port / repository / seam / fake controlled behavior。 |
| production-like capacity / long-run | P2 / future | 无容量模型、负载模型和部署基线;进入 Step 13 residual。 |
| external provider SLA / real publisher target | P1/P2 | P0 只验证 safe boundary、candidate/outcome/handoff surface;真实 SLA 后续闭口。 |
| marketplace / console / SDK 深层行为 | peripheral / future | 不阻断 core P0;后续产品基线另行验收。 |
| long retention / dashboard / alert threshold | 运维或后续观测基线 | 当前只要求 run-scoped evidence 可追溯;保留周期、告警阈值和 dashboard 进入后续标准。 |

### 16. 非功能失败裁决表

| 失败 | 裁决 |
|---|---|
| redaction scan failed 或 raw body/secret/provider response/full sensitive ref 泄露 | `ML-NFR-003` 失败;不得风险接受;Step 11 复核 VETO。 |
| dependency boundary failed 或 non-core sibling compile dependency 出现 | `ML-NFR-005` 失败;不得有条件通过;Step 11 复核 VETO。 |
| invalid config silent fallback / unsafe profile pass / P0 profile unavailable marked passed | `ML-NFR-004` 失败;不得风险接受。 |
| query/job/observability 修 truth 或成为 recovery source | `ML-NFR-006` / `ML-NFR-007` 失败;同时回指 Step 6~8 红线。 |
| performance sample 缺失 | `ML-NFR-001` 失败;需补 run 或判定不可裁决。 |
| performance sample 高于旧 P95/SLO 候选 | 不直接 P0 失败;记录 trend/risk,不得用无来源阈值阻断。 |
| P1 selected-run unavailable | 不影响 P0;进入 Step 13 residual。 |
| report-generation-audit failed / orphan EV / `latest` 正式引用 / static pass | `ML-NFR-008` 失败;Step 10 evidence gate 继续展开。 |
| 旧 MethodContent / publish / snapshot / fingerprint / old outbox 静默复活 | `ML-NFR-009` 失败;需回设计或验收基线闭口。 |

### 17. 非功能验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| ML-NFR-001 | 阈值是否有来源 | 通过 | 不写硬 P95/SLO/capacity;只要求 sample/trend。 |
| ML-NFR-002 | 可用性是否依赖真实 provider | 通过 | P0 只验 fail-fast/degraded/unavailable safe surface。 |
| ML-NFR-003 | redaction 是否硬门禁 | 通过 | 任一泄露阻断,不得风险接受。 |
| ML-NFR-004 | config fail-fast 是否承接 `04` / `05` | 通过 | 不新增 config key,只转译既有 redline。 |
| ML-NFR-005 | dependency boundary 是否清楚 | 通过 | compile dependency 与 runtime/event/replay 协作分离。 |
| ML-NFR-006 | recovery/idempotency 是否与 Step 8 去重 | 通过 | 本 Step 只裁决非功能 release gate,状态细节见 Step 8。 |
| ML-NFR-007 | observability 是否不替代 truth/recovery | 通过 | Step 10 再展开审计和证据门禁。 |
| ML-NFR-008 | evidence integrity 是否越过 Step 10 | 通过 | 本 Step 固定阻断口径;schema 和 artifact/report pairing 留 Step 10。 |
| ML-NFR-009 | compatibility 是否避免旧口径污染 | 通过 | 不继承旧 MethodContent / publish / snapshot / fingerprint / outbox。 |

### 18. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_09_nonfunctional.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“非功能验收表”“阈值来源矩阵”“P1/P2 非功能 residual 表”“非功能失败裁决表”和“非功能验收项停审记录”小节,了解性能、安全、可用性、配置、依赖、恢复、观测、证据和兼容性如何从正式设计与测试方案收敛。

正式 `06-验收标准.md` §9 应回填:

- 非功能验收覆盖 `ML-NFR-001~009`:performance sample/trend、availability/degraded/unavailable、安全/redaction、config fail-fast、dependency boundary、recovery/idempotency/replay、observability/audit safe signal、evidence/report integrity 和 compatibility/evolution explicitness。
- 当前 P0 不设置硬 P95/SLO/capacity/external SLA;只要求 release/service/operations run 产出 duration/count/sample/trend,且核心主链不依赖 P1/P2 能力。
- redaction leak、non-core sibling compile dependency、invalid config silent fallback、query/job/observability truth repair、artifact/report pairing 缺失、`latest` 正式引用、static evidence 伪 pass 和 P0 profile unavailable marked passed 均阻断通过。
- production-like capacity、real DB/bus/search/object storage、真实 external provider SLA、真实 publisher/handoff target、long retention、dashboard/alert threshold、marketplace/console/SDK 深层行为进入 residual/future,不得伪装为当前 P0 pass。

### 19. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 是否未来硬化 P95/SLO/capacity | 影响 `ML-NFR-001` | 当前不硬化;需新负载模型、环境、阈值来源和 `06` 基线闭口。 |
| P1 selected-run 是否在某次送验强制 | 影响 Step 13 residual / Step 14 sign-off | 当前不影响 P0;后续由验收负责人裁决。 |
| evidence retention 天数、dashboard 和 alert threshold | 影响长期审计 / 运维 | 当前只要求 run-scoped evidence 可追溯;长期保留进后续标准。 |
| external provider SLA 是否纳入 release | 影响 availability 和 residual | 当前只验 safe boundary;真实 SLA 后续闭口。 |

### 20. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 非功能裁决口径明确 | 通过 | 见 §13 / §16。 |
| 阈值来源明确且无来源阈值未写入 P0 pass | 通过 | 见 §14。 |
| P1/P2 residual 边界明确 | 通过 | 见 §15。 |
| 非功能验收项已停审 | 通过 | 见 §17。 |
| 可进入 Step 10 | 通过 | 下一步定义可观测性、审计与证据门禁;进入前等待用户确认。 |

### 21. R9.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 Step 9 R9.2 | pass |
| 是否完成 SOP Step 9 期望产出 | pass |
| 是否使用 L3-local `ML-NFR-*` ID 而非 governance ID | pass |
| 是否覆盖性能、安全、可用性、兼容性、恢复、配置、依赖、观测和证据完整性 | pass |
| 是否未写无来源 P95/SLO/capacity/external SLA | pass |
| 是否明确 P1/P2 residual 不污染 P0 | pass |
| 是否未写 Step 10 evidence schema 或 Step 11 VETO 最终裁决 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.1 observability evidence:先思考`;只允许思考可观测性、审计与证据门禁;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
