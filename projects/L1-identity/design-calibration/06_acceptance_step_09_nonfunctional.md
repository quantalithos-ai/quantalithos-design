# Step 9. 定义非功能验收门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 9
> 回填章节: `06-验收标准.md` §9 非功能验收门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义非功能验收门禁 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~8 已审核通过;新版 `00` NFR、`04` config / degradation、`05` NFR evidence |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_09_nonfunctional.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 10 |

## 2. 本步目标

把 `NFR-ID-001~009`、`AC-ID-014~015`、配置降级、redaction、safe diagnostics、fake / controlled parity 和专项测试证据转成可裁决的非功能验收门禁。

本 Step 只定义非功能验收:

- performance sample / trend 和 no hidden P1/P2 dependency。
- availability / degraded / disabled / unavailable 的正式 surface。
- trusted actor / high-risk basis / write boundary。
- forbidden body、credential、raw secret 和 unsafe diagnostic 的零容忍。
- traceability、append-only、idempotency、recovery、config fail-fast 和 dependency boundary 的非功能裁决口径。

证据完整性、artifact/report pairing、evidence index、审计交接和 report-generation-audit 留 Step 10;一票否决最终裁决留 Step 11;未执行项风险接受留 Step 13。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_05_function_gate.md` | 已审核通过 | 提供核心功能主线与 release smoke 验收主语 |
| `06_acceptance_step_06_boundary_gate.md` | 已审核通过 | 提供 body-free、dependency boundary、query no-write、job no-repair 红线 |
| `06_acceptance_step_08_state_tx_consistency.md` | 已审核通过 | 提供 transaction、idempotency、recovery、fake parity 的一致性基础 |
| `00-需求文档.md` §13 / §14 | 正式输入 | 提供 `NFR-ID-001~009`、`AC-ID-014~015` 和旧性能数字不可继承口径 |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 提供 degraded、delayed、manual recovery、forbidden body 和 query no-write 恢复规则 |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 提供 runtime builder、adapter mode、disabled / unavailable 和 no fake success 边界 |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 提供 safe log / metric / trace / audit / report 字段和 redaction 规则 |
| `04_config_step_05_sources_priority_conflicts.md` | 已审核通过 | 提供 `defaults < file < env`、high-priority invalid no fallback 和 P0 no config center |
| `04_config_step_11_failure_degradation.md` | 已写入 | 提供 fail-fast、fail-closed、reject-run、reject-entry、degraded 和 disabled adapter 口径 |
| `05-测试方案.md` §9 / §10 / §13 | 正式输入 | 提供 P0 blocking suite、专项测试和正式 `EV-ID-*` / report path |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些非功能指标是 P0? | `NFR-ID-001~009` 均进入 P0 非功能裁决,但性能和容量当前只要求 sample / trend 与结构性 no hidden dependency;安全、redaction、query no-write、job no-repair、idempotency no-rerun、append-only、config fail-fast 和 dependency boundary 是阻断门禁。 |
| 阈值来自需求、设计还是运行基线? | 零容忍阈值来自 `00` 的 AC / VETO 和 `03/04` 的红线;状态、事务、幂等和降级阈值来自 `03` Step 10~15;性能阈值来自 `00` 的“不得继承旧数字”约束和 `05` 的 sample 方案,当前没有硬 P95 / SLA。 |
| 哪些专项未覆盖,是否影响验收? | production-like capacity、真实 DB / bus / archive / observability backend、具体 alert threshold / SLO 不是当前 P0 必过。若验收要求这些成为 P0,必须回写测试方案、配置和验收基线;否则在 Step 13 作为残余风险或后续增强记录。 |
| 哪些非功能失败会阻断发布? | raw body/secret 泄漏、无可信上下文 accepted、query write、job repair truth、duplicate rerun mutation、stored replay missing 后重算、invalid config silent fallback、disabled adapter fake success、dependency loop、accepted mutation 不可追溯均阻断。 |
| 证据来自哪里? | 正式证据来自 `EV-ID-NFR-001`、`EV-ID-CORE-001`、`EV-ID-QUERY-001`、`EV-ID-JOB-001`、`EV-ID-IDEMP-001`、`EV-ID-CONFIG-001`、`EV-ID-REDACTION-001` 及相关 suite report;路径必须固定到 `reports/runs/<run_id>/...` 和 `artifacts/test/<run_id>/...`。 |
| 是否存在无来源阈值? | 不写无来源硬阈值。凡是没有正式 baseline 的指标只允许写 sample / trend / must-exist evidence;未执行时进入 Step 13 风险接受,不得宣告通过。 |
| 每个非功能验收项完成后是否停审? | 本 Step 为 `AC-NFR-*` 建立闭环表和停审记录。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 倾向继承旧性能数字和旧对象口径 | 新版不继承旧 P95 / SLA,只按 `00/05` sample 口径 |
| `00` NFR-ID-001 | 要求后续给出 P0 baseline 或 sample,但没有硬阈值 | 本 Step 固定 sample / trend 和缺 sample 阻断 |
| `05` Step 10 | 使用候选 evidence 视角 | 本 Step 改用正式 `EV-ID-*` 和固定 report path |
| `03` Step 15 | 观测字段丰富,容易提前写成证据审计 | 本 Step 只写 safe diagnostics 非功能要求;证据完整性留 Step 10 |
| `04` config | 配置失败策略分散 | 本 Step 抽成 config fail-fast / no silent fallback 验收项 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 性能 | 旧草案可能直接使用历史数字 | 当前只要求 sample / trend、duration/count 和 no hidden dependency | 没有正式负载模型来源 |
| 可用性 | 泛写系统可用 | 明确核心 anchor/lifecycle/read 不因外围依赖整体失败,外围用 degraded / disabled surface | 承接 NFR-ID-002 |
| 安全 | 分散在功能和红线章节 | 非功能章单独给 trusted context、redaction、safe diagnostic 阈值 | 零容忍必须可裁决 |
| 恢复 | 与事务一致性混在一起 | 非功能章只写 duplicate no-rerun、manual recovery surface 和 fail-safe 质量要求 | Step 8 已处理事务细节 |
| 配置 | 只在配置设计中出现 | 作为验收门禁:invalid fail-fast,no fallback,no fake success | 配置错误会直接影响 P0 可信度 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否设置硬 P95 / SLA | A. 设置旧数字;B. 只要求 sample / trend 和 no hidden dependency | 采用 B。阈值必须有来源。 |
| 是否把真实产品依赖纳入 P0 | A. 纳入;B. P0 使用 fake / controlled / replay 证明语义 | 采用 B。真实产品留 P1/P2 或后续部署验收。 |
| 是否把 observability backend 作为 P0 | A. 必须接入真实后端;B. 必须产出 safe log/metric/report fields 和 redaction-clean evidence | 采用 B。当前验收不绑定产品后端。 |
| 是否把 config degraded 当作非法配置容错 | A. 允许;B. 不允许 | 采用 B。非法配置 fail-fast / reject,运行依赖才可 degraded。 |
| 是否由 Step 9 判定 evidence index 完整 | A. 是;B. Step 9 只绑定证据来源,完整性留 Step 10 | 采用 B。符合章节分工。 |

## 8. 结构化中间产物

### 8.1 非功能验收表

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| `AC-NFR-001` | 性能 sample / baseline readiness | command、query、job、release smoke 必须产出 duration/count sample,并证明核心读取不依赖 P1/P2 外围能力 | 必须有 sample;无硬 P95 / SLA;不得使用旧数字宣告通过 | `EV-ID-NFR-001`;`EV-ID-CORE-001`;`reports/runs/<run_id>/suites/release-main-smoke.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 缺 sample 或把旧数字当 pass 阈值为不通过;数值未达未定义目标只能进 Step 13 residual |
| `AC-NFR-002` | 可用性 / 降级 | 核心身份锚点、生命周期读取和基础摘要读取在外围 resolver / publisher / handoff / report 不可用时仍返回正式 surface | core read 不整体崩溃;外围缺口必须是 `Degraded` / `Disabled` / `Missing` / `StaleVisible` / rejected / delayed 等正式结果 | `EV-ID-QUERY-001`;`EV-ID-JOB-001`;`EV-ID-NFR-001`;`reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 外围不可用导致核心读取整体失败或伪造完整事实为不通过 |
| `AC-NFR-003` | trusted context / write security | 写入 identity truth 必须有可信 actor/context、idempotency metadata、trace context 和高风险 basis | 无可信上下文、越权或高风险依据不可用时 0 accepted side effect | `EV-ID-CMD-001`;`EV-ID-CONTRACT-001`;`EV-ID-CORE-001`;`reports/runs/<run_id>/suites/service-flow-fast.md` | 越权 accepted 或 rejected 后产生 accepted trace/outbox/result 为不通过 |
| `AC-NFR-004` | redaction / forbidden material | request/event/job/config/log/audit/report/artifact 不得保存或输出外部正文、credential、raw secret、adapter response body 或 unsafe diagnostic | 泄漏 0 容忍;negative leak fixture 必须 safe failure | `EV-ID-REDACTION-001`;`artifacts/test/<run_id>/suites/redaction-boundary/`;`reports/runs/<run_id>/redaction-check.md` | 任一 raw body / secret 泄漏为不通过并交 Step 11 判定 |
| `AC-NFR-005` | audit / traceability | accepted identity truth change、consumer/callback marker、outbox/job/handoff/report material 必须能追到 safe actor/reason/source/operation refs | 每类 accepted mutation 有 trace/audit/outbox/stored result or receipt/report 证据;rejected 不伪造 accepted trace | `EV-ID-CMD-001`;`EV-ID-CONSUMER-001`;`EV-ID-JOB-001`;`EV-ID-CORE-001` | accepted 不可追溯、rejected 伪造 accepted trace 或 query 写业务 audit 为不通过 |
| `AC-NFR-006` | idempotency / consistency quality | duplicate same digest 只 replay stored result / receipt / report;different digest conflict;stored missing no-rerun | duplicate rerun mutation/job 0 容忍;stored missing 不得从 current truth 重构 | `EV-ID-IDEMP-001`;`EV-ID-CMD-001`;`EV-ID-JOB-001`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` | duplicate rerun、blind retry 或 stored replay 重构为不通过 |
| `AC-NFR-007` | append-only / history integrity | career、memory ref、trace、audit、lifecycle high-risk history 和 terminal member ref 必须保持追加 / 不复用语义 | 已确认历史不得原地改写;terminal ref 不释放给新 member;纠错必须追加 | `EV-ID-STATE-001`;`EV-ID-CMD-001`;`EV-ID-IDEMP-001`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | 历史改写、ref reuse 或 terminal retry 越界为不通过 |
| `AC-NFR-008` | safe diagnostics / observability | log、metric、report、issue ref 必须能定位 operation kind、state/disposition、duration/count 和 safe issue,且低基数、body-free | safe diagnostic fields must exist;metric label 不含高基数 ref / raw body / secret | `EV-ID-NFR-001`;`EV-ID-REDACTION-001`;`EV-ID-JOB-001`;`reports/runs/<run_id>/redaction-check.md` | 无法定位 P0 failure 或 diagnostic 泄漏 forbidden material 为不通过 |
| `AC-NFR-009` | reconciliation / report-only drift | 对账只产出 identity-owned projection/reference/report issue 和 finding,不得修相邻 truth 或 core truth | repair truth 0 容忍;report-only finding / issue refs must exist | `EV-ID-JOB-001`;`reports/runs/<run_id>/suites/operations-replay-core.md` | reconciliation 修 truth 或丢失 report item refs 为不通过 |
| `AC-NFR-010` | config fail-fast / no silent fallback | invalid config、high-priority invalid value、unsafe redaction、disabled adapter、unsupported config center / hot reload 必须 fail-fast / reject / formal disabled | high-priority invalid 不 fallback;disabled adapter no fake success;P0 unsupported source rejected | `EV-ID-CONFIG-001`;`reports/runs/<run_id>/suites/config-redline.md` | silent fallback、partial facade、fake success 或 unsafe config accepted 为不通过 |
| `AC-NFR-011` | dependency boundary / compatibility | P0 compile-time dependency 只能使用允许的 core contract;business sibling 只能 runtime / event / replay / handoff | forbidden compile dependency 0 容忍;dependency report must be clean | `EV-ID-ARCH-001`;`reports/runs/<run_id>/dependency-boundary.md`;`artifacts/test/<run_id>/suites/dependency-boundary/` | dependency loop 或 sibling business compile dependency 为不通过并交 Step 11 判定 |
| `AC-NFR-012` | fake / controlled parity | fake、controlled、disabled 和 durable-like adapters 必须共享 formal state、port、error、stored replay 和 redaction 语义 | fake private success / direct store bypass / raw body side store 0 容忍 | `EV-ID-IDEMP-001`;`EV-ID-CONFIG-001`;`reports/runs/<run_id>/suites/infra-runtime-fake.md` | fake-only pass、disabled fake success 或 private map 证据为不通过 |

### 8.2 非功能闭环表

| 验收项 ID | 需求 / 设计契约 | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|
| `AC-NFR-001` | `NFR-ID-001`;`AC-ID-015`;`05` Step 10 performance sample | related `TC-ID-QUERY-*`;`TC-ID-JOB-*`;release representative cases | `EV-ID-NFR-001`;`EV-ID-CORE-001` | `reports/runs/<run_id>/suites/release-main-smoke.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 缺 sample 不通过;numeric threshold 缺来源进 Step 13 |
| `AC-NFR-002` | `NFR-ID-002`;`03` query degraded recovery;`04` failure degradation | `TC-ID-QUERY-*`;`TC-ID-JOB-*`;`TC-ID-CONFIG-*` | `EV-ID-QUERY-001`;`EV-ID-JOB-001`;`EV-ID-NFR-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | 外围失败伪造成完整事实不通过 |
| `AC-NFR-003` | `NFR-ID-003`;`BR-ID-002`;`BR-ID-005`;trusted actor/context guard | `TC-ID-CMD-*`;`TC-ID-CONTRACT-*` | `EV-ID-CMD-001`;`EV-ID-CONTRACT-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/contract-domain-fast.md` | 越权 accepted 不通过 |
| `AC-NFR-004` | `NFR-ID-004`;`AC-ID-014`;body-free / secret-free boundary | `TC-ID-REDACTION-*`;`TC-ID-CONTRACT-004`;`TC-ID-CMD-010` | `EV-ID-REDACTION-001` | `reports/runs/<run_id>/redaction-check.md` | 泄漏触发不通过 / Step 11 |
| `AC-NFR-005` | `NFR-ID-005`;`BR-ID-014`;`03` trace/audit/outbox/stored replay | `TC-ID-CMD-*`;`TC-ID-CONSUMER-*`;`TC-ID-JOB-*` | `EV-ID-CMD-001`;`EV-ID-CONSUMER-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | accepted 不可追溯不通过 |
| `AC-NFR-006` | `NFR-ID-006`;`03` idempotency / stored replay / commit unknown | `TC-ID-IDEMP-001~011` | `EV-ID-IDEMP-001` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | no-rerun 失败不通过 |
| `AC-NFR-007` | `NFR-ID-007`;append-only and terminal ref integrity | `TC-ID-DOMAIN-*`;`TC-ID-STATE-*`;`TC-ID-CMD-*` | `EV-ID-STATE-001`;`EV-ID-CMD-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/service-flow-fast.md` | 历史改写 / ref reuse 不通过 |
| `AC-NFR-008` | `NFR-ID-008`;`03` Step 15 observability fields | `TC-ID-REDACTION-*`;related query/job cases | `EV-ID-NFR-001`;`EV-ID-REDACTION-001` | `reports/runs/<run_id>/redaction-check.md` | unsafe diagnostic 不通过 |
| `AC-NFR-009` | `NFR-ID-009`;report-only reconciliation | `TC-ID-JOB-*` | `EV-ID-JOB-001` | `reports/runs/<run_id>/suites/operations-replay-core.md` | report-only 破坏不通过 |
| `AC-NFR-010` | `AC-ID-015`;`04` fail-fast / no fallback / disabled adapter | `TC-ID-CONFIG-001~004` | `EV-ID-CONFIG-001` | `reports/runs/<run_id>/suites/config-redline.md` | config silent fallback 不通过 |
| `AC-NFR-011` | dependency boundary / allowed compile-time dependency | `TC-ID-ARCH-001`;dependency boundary cases | `EV-ID-ARCH-001` | `reports/runs/<run_id>/dependency-boundary.md` | dependency loop 不通过 / Step 11 |
| `AC-NFR-012` | fake / controlled parity from `03` Step 11 / 12 / 14 | `TC-ID-IDEMP-*`;`TC-ID-CONFIG-*` | `EV-ID-IDEMP-001`;`EV-ID-CONFIG-001` | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/suites/config-redline.md` | fake-only pass 阻断证据可信度 |

### 8.3 非功能验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `AC-NFR-001` | 性能阈值来源 | 通过 | 不设硬 P95 / SLA;未执行 sample 留 Step 13 |
| `AC-NFR-002` | 降级 surface 与 no-write | 通过 | 证据完整性留 Step 10 |
| `AC-NFR-003` | trusted context 与 high-risk basis | 通过 | 具体 defect 分级留 Step 12 |
| `AC-NFR-004` | redaction 零容忍 | 通过 | 泄漏最终 VETO 裁决留 Step 11 |
| `AC-NFR-005` | accepted traceability | 通过 | evidence pairing 留 Step 10 |
| `AC-NFR-006` | idempotency no-rerun | 通过 | public recovery wording 留 Step 12 |
| `AC-NFR-007` | append-only / ref integrity | 通过 | VETO ref reuse 留 Step 11 |
| `AC-NFR-008` | safe diagnostics | 通过 | 具体 evidence index 留 Step 10 |
| `AC-NFR-009` | reconciliation report-only | 通过 | VETO truth repair 留 Step 11 |
| `AC-NFR-010` | config fail-fast | 通过 | future config center / hot reload 留风险或后续阶段 |
| `AC-NFR-011` | dependency boundary | 通过 | final blocker 留 Step 11 |
| `AC-NFR-012` | fake / controlled parity | 通过 | durable product parity 不升级为 P0 |

### 8.4 跨非功能审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| `NFR-ID-001~009` 是否都有验收项 | 通过 | `AC-NFR-001~009` |
| `AC-ID-014~015` 是否承接 | 通过 | redaction zero tolerance 和 baseline/sample 已覆盖 |
| 阈值是否都有来源 | 通过 | hard zero 来自需求/设计;performance 只 sample |
| 是否继承旧性能数字 | 否 | 明确禁止 |
| 是否把真实产品依赖写成 P0 必过 | 否 | 真实产品留 Step 13 residual 或后续阶段 |
| 是否提前判定 evidence index 完整 | 否 | 留 Step 10 |
| 是否提前替代 VETO 裁决 | 否 | 留 Step 11 |
| 是否存在未执行非功能项处理口径 | 通过 | 未执行进入 Step 13 风险接受,不得通过 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 当前不设置硬 P95 / SLA | 否 | 承接 `00` 与 `05` 的 sample 口径 | Step 13 可记录 residual |
| P0 不要求真实 DB / bus / archive / observability backend | 否 | 环境范围未扩大 | 若升级为 P0 必须回写 `05/06` |
| 安全 / redaction / config / dependency failure 均阻断 | 否 | 已由 `00/03/04/05` 支撑 | Step 11 再裁决 VETO |
| 非功能证据必须固定 `<run_id>` | 否 | 承接 Step 3 / Step 10 | Step 10 审计证据完整性 |
| 若验收方要求未执行 NFR 仍通过 | 是 | 风险接受越权 | Step 13 必须显式接受,且不得覆盖 VETO |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_09_nonfunctional.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“非功能验收表”“非功能闭环表”“非功能验收项停审记录”和“跨非功能审计表”小节,了解非功能门禁如何从 NFR、配置降级、专项测试和正式证据收敛。

正式 `06-验收标准.md` §9 应回填:

- 非功能验收按 `AC-NFR-001~012` 组织。
- 性能当前只要求 duration/count sample、trend 和 no hidden P1/P2 dependency;不得继承旧硬阈值。
- 安全、redaction、trusted context、query no-write、job no-repair、duplicate no-rerun、append-only、config fail-fast、dependency boundary 和 fake parity 都是 P0 阻断门禁。
- 每个非功能项必须绑定 `NFR-ID-*` / `AC-ID-*` / 设计契约、TC、`EV-ID-*`、report path、通过条件、失败条件和裁决影响。
- 未执行或未生成证据的非功能项不得宣告通过,必须进入 Step 13 风险接受;VETO 相关项不得风险接受。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 是否需要未来给出硬 latency / capacity baseline | 影响性能验收阈值 | 当前不硬化;后续需新 baseline |
| production-like / real backend 是否升级为 P0 | 影响环境和 evidence | 当前不升级;留 Step 13 residual |
| Step 10 是否能证明所有 `EV-ID-NFR-001` 关联 report 都物化 | 影响最终验收裁决 | Step 10 审计 |
| Step 11 是否将 redaction、dependency、truth repair 和 implicit create 触发 VETO | 影响最终结论 | Step 11 裁决 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 非功能验收表完成 | 通过 | 见 §8.1 |
| 每个非功能项有阈值来源 | 通过 | hard zero / sample / formal surface 均有来源 |
| 每个非功能项有 TC / EV / report path | 通过 | 见 §8.2 |
| 非功能验收项已停审 | 通过 | 见 §8.3 |
| 跨非功能审计无 unresolved 冲突 | 通过 | 见 §8.4 |
| 未提前替代 Step 10~13 | 通过 | 证据、VETO、缺陷、风险仍留后续 Step |
| 可进入 Step 10 | 通过 | 用户已确认,进入 Step 10: 定义可观测性、审计与证据门禁 |
