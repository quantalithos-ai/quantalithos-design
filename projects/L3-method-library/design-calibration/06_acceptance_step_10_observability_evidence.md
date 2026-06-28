# Step 10. 定义可观测性、审计与证据门禁

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 10
> 回填章节: `06-验收标准.md` §10 可观测性、审计与证据门禁
> 创建日期: 2026-06-28
> 当前模式: full-restart / step10-observability-evidence
> 当前状态: completed_wait_user_confirm_to_R11.1
> 当前模块: `R10.2 observability evidence:再写入`
> 当前门禁: `R10.2` completed_wait_user_confirm_to_R11.1;等待确认进入 Step 11 `R11.1 veto:先思考`

---

## R10.1 observability evidence:先思考

### 1. 当前模块目标

`R10.1` 只思考新版 `06-验收标准.md` 的可观测性、审计与证据门禁如何从正式 `03` §14、`05` §13、Step 5~9 验收项和 SOP Step 10 收敛。

当前模块不修改正式 `06-验收标准.md`,不写最终证据门禁表,不生成真实 `<run_id>`,不填真实 EV 状态,不裁决验收 passed/failed,不定义 artifact JSON schema、report schema、CI YAML、脚本实现、retention days、dashboard、alert threshold 或 implementation boundary。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R10.2 |
| 用户确认 | 已确认从 Step 9 completed 推进到 Step 10 `R10.1 observability evidence:先思考`。 |
| 当前允许 | 思考 observability / audit / evidence 的验收门禁主题、证据来源、run-scoped 路径、EV/TC/suite/AC 映射、report audit、redaction scan、acceptance handoff 和 R10.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写最终证据门禁表;生成真实执行结论;补机器 artifact 字段 schema;定义 CI / script;新增测试用例、设计对象、config key 或实施边界。 |

### 2. 本模块输入承接

| 输入 | R10.1 关注点 | 禁止外推 |
|---|---|---|
| SOP Step 10 | 哪些行为必须有 audit / trace / log / metric / report / evidence,缺失如何影响验收。 | 用静态表、默认 passed 或口头说明替代 run-scoped artifact/report。 |
| 书写规范 §4.4 | 正式验收引用固定 `<run_id>` 下的 report / artifact,不得引用 `latest`。 | 使用 `reports/<project>`、`artifacts/test/<project>/<run_id>` 或 `latest`。 |
| `03-详细设计.md` §14 | Observability 只能观察正式对象、stored surface、marker、diagnostic、report、handoff 和 body-free refs;不得替代 truth / replay / recovery。 | 定义具体 metric name、alert threshold、dashboard、retention 或观测后端产品。 |
| `04-配置设计.md` | config validation、sensitive/secret、adapter availability、degraded / unavailable 和 downstream handoff。 | 用配置开关改变证据真实来源或把 P0 unavailable 标记 passed。 |
| `05-测试方案.md` §13 | `EV-ML-*` 证据族、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance`、no latest、no static evidence。 | 复用旧 `EV-GOV-*` 或旧 `MethodContent` evidence。 |
| Step 5~8 | 功能、架构、接口、状态 / 事务验收项已引用 `EV-ML-*` 证据方向。 | 在 Step 10 改写 AC 或新增测试覆盖。 |
| Step 9 | `ML-NFR-007` / `ML-NFR-008` 已把 observability safe signal 与 evidence integrity 固定为非功能门禁。 | 把 Step 9 的非功能结论重复写成无证据门禁。 |
| L1-governance Step 10 | framework_reference:参考证据门禁表、P0 Evidence 追溯表、report 完整性检查和跨证据审计。 | 复制 governance 领域 ID、AC、VETO、TC、EV 或业务对象。 |

### 3. SOP Step 10 问题思考

| SOP 问题 | R10.1 初判 | R10.2 写入提醒 |
|---|---|---|
| 哪些行为必须有 audit record? | accepted command、inbound receipt、outbound candidate/outcome、operations job report、config validation failure、redaction/dependency/report audit、handoff preparation 必须有 safe audit / report / marker 方向。 | 写成 evidence gate,不新增 audit object 或字段。 |
| 哪些行为必须有 trace / log / metric? | command/query/inbound/outbound/job/runtime/config/report generation 都要有 safe signal;metric 只允许低基数分类;trace/log 不得含 raw body/secret。 | 不定义 metric name、span payload schema 或 dashboard。 |
| 哪些测试报告必须归档? | P0 blocking suite report、gate summary、evidence index、redaction check、dependency boundary、report audit、release smoke、acceptance handoff / veto / risk draft。 | R10.2 固定路径方向,不填真实 `<run_id>`。 |
| 证据缺失是否导致不通过? | P0 EV、blocking suite raw artifact/report pair、redaction/dependency/report audit 缺失时不得通过;无法裁决时暂停验收。 | 写为 gate failure / cannot adjudicate,Step 11 再挑一票否决。 |
| 证据如何被复查? | 从 `reports/runs/<run_id>/evidence-index.md` 查 EV -> suite report -> raw artifact -> digest / safe failure reason。 | 不写正式 JSON schema 字段名和值域。 |
| 每个 P0 EV 是否能回指测试用例、suite artifact、report path 和验收项? | 必须能回指 `TC-ML-*`、suite/check family、artifact root、report path、AC/NFR/VETO candidate。 | R10.2 写追溯方向,不改变 `05` 用例族。 |
| 是否存在静态造证据、orphan EV、report 缺失或 acceptance 初稿未经审查? | 这些均应成为 evidence gate failure;acceptance report 只能作交接和审查入口。 | 写跨证据审计表,不写真实 verdict。 |

### 4. L1-governance Step 10 框架参考思考

L1-governance Step 10 可借鉴的是证据链深度,不是领域事实。L3 采用“run-scoped artifact/report -> evidence index -> acceptance report”的框架,并替换为 `EV-ML-*` 和 L3 suite family。

| L1 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| 证据门禁表 | L3 写 `AC-ML-EV-*` 或等价验收项方向,覆盖 evidence index、suite artifact、human report、redaction/dependency/report audit、acceptance handoff。 | 复制 `AC-GOV-EV-*`。 |
| P0 Evidence 追溯表 | L3 映射 `EV-ML-CONTRACT/SERVICE/INFRA/ENTRY/REPLAY/CONFIG/DEPENDENCY/REDACTION/OBSERVABILITY/REPORT/RELEASE-*` 到 suite/report。 | 复制 `EV-GOV-*` 或 governance TC。 |
| Report 完整性检查 | L3 固定 `reports/runs/<run_id>/...` 与 `artifacts/test/<run_id>/...` 配对。 | 使用 `latest` 或旧项目路径。 |
| Acceptance handoff | L3 后续 `reports/acceptance/*` 只作审查入口,不得替代 raw artifact。 | 在 Step 10 直接宣布验收通过。 |
| 跨证据审计 | L3 必须检查 orphan EV、static evidence、failed artifact 被删、redaction/report 二次泄露。 | 把缺口留到实施侧自由判断。 |

### 5. L3 evidence gate 主题思考

| 候选 ID | 主题 | R10.1 判断 | 主要证据来源候选 |
|---|---|---|---|
| AC-ML-EV-001 | P0 evidence index | 必须覆盖全部 P0 `EV-ML-*`,并能回指 TC、suite、artifact、report、AC/NFR/VETO candidate。 | `EV-ML-REPORT-001`;`reports/runs/<run_id>/evidence-index.md` |
| AC-ML-EV-002 | blocking suite artifact/report pair | 每个 P0 blocking suite 必须有 raw artifact 与 human report 配对;failed / timeout / unavailable 也要留 safe failure evidence。 | `contract-domain-fast`;`service-flow-fast`;`infra-runtime-fake`;`entry-worker-job`;`operations-replay-core`;`config-redline`;`dependency-boundary`;`redaction-boundary`;`observability-boundary`;`report-generation-audit`;`release-main-smoke` |
| AC-ML-EV-003 | observability safe signal | log / metric / trace / audit 只能含 body-free refs、safe markers、low-cardinality labels;不得成为 truth/recovery source。 | `EV-ML-OBSERVABILITY-001`;`EV-ML-REDACTION-001` |
| AC-ML-EV-004 | redaction / dependency hard audit | redaction scan、dependency boundary 和 report audit 失败不得通过。 | `EV-ML-REDACTION-001`;`EV-ML-DEPENDENCY-001`;`EV-ML-REPORT-001` |
| AC-ML-EV-005 | report generation integrity | report 必须由 raw artifact 推导;不得静态造 EV、手写 pass、删除 failed artifact 或 orphan EV。 | `EV-ML-REPORT-001`;`reports/runs/<run_id>/report-audit.md` |
| AC-ML-EV-006 | acceptance handoff / review | handoff、veto checklist、risk acceptance、open issues 只作验收审查入口,必须引用 run_id 和 EV/report。 | `reports/acceptance/handoff.md`;`veto-checklist.md`;`risk-acceptance.md`;`open-issues.md` |

### 6. P0 Evidence 追溯思考

| Evidence ID | 来源 suite / check | R10.1 验收关注 | 缺失影响 |
|---|---|---|---|
| `EV-ML-CONTRACT-001` | `contract-domain-fast` | truth / formalization / version / state AC。 | contract / domain / state 门禁不可裁决。 |
| `EV-ML-SERVICE-001` | `service-flow-fast` | command/query/flow、accepted/rejected/duplicate/no-write。 | 功能与服务流门禁不可裁决。 |
| `EV-ML-INFRA-001` | `infra-runtime-fake` | UoW、dependency seam、fake/durable parity direction、marker source。 | runtime seam 与一致性门禁不可裁决。 |
| `EV-ML-ENTRY-001` | `entry-worker-job` | inbound / worker / job entry safe surface。 | entry 与 operations surface 不可裁决。 |
| `EV-ML-REPLAY-001` | `operations-replay-core` | replay、checkpoint、report、partial failure、no truth repair。 | 恢复 / 幂等 / job 门禁不可裁决。 |
| `EV-ML-CONFIG-001` | `config-redline` | fail-fast、profile isolation、unsafe config rejected。 | config gate 不可裁决或不通过。 |
| `EV-ML-DEPENDENCY-001` | `dependency-boundary` | compile dependency boundary 和 no non-core sibling dependency。 | 架构红线 / NFR dependency 失败。 |
| `EV-ML-REDACTION-001` | `redaction-boundary` | raw body / secret / provider response / full sensitive ref 禁入。 | redaction 门禁失败;Step 11 复核 VETO。 |
| `EV-ML-OBSERVABILITY-001` | `observability-boundary` | safe log/metric/trace/audit,observability not truth/recovery。 | observability gate 不可裁决或失败。 |
| `EV-ML-REPORT-001` | `report-generation-audit` | artifact/report pair、no latest、no static evidence、orphan EV audit。 | evidence integrity 失败。 |
| `EV-ML-RELEASE-001` | `release-main-smoke` | representative release readiness and sample/trend。 | release readiness 不可裁决,但不替代底层 suite。 |
| `EV-ML-RISK-001` | P1 selected-run / residual report | residual only,not P0 pass。 | 影响 Step 13 residual,不直接阻断 P0。 |

### 7. Report / artifact 路径思考

| 路径方向 | 用途 | R10.1 约束 |
|---|---|---|
| `artifacts/test/<run_id>/...` | raw artifact root。 | 必须固定 run_id;failed / timeout / unavailable 也要留 safe evidence。 |
| `reports/runs/<run_id>/suites/<suite>.md` | suite human report。 | 必须从 raw artifact 推导,不得手写补洞。 |
| `reports/runs/<run_id>/summary.md` | run summary。 | 只汇总,不得替代 suite report 或 evidence index。 |
| `reports/runs/<run_id>/evidence-index.md` | EV / TC / AC / suite / artifact / report 索引。 | 不得由静态 JSON 直接宣告 pass。 |
| `reports/runs/<run_id>/redaction-check.md` | artifact/report 脱敏扫描结果。 | 失败不得忽略或风险接受。 |
| `reports/runs/<run_id>/dependency-boundary.md` | dependency boundary audit。 | non-core sibling compile dependency 阻断。 |
| `reports/runs/<run_id>/report-audit.md` | no latest、no static evidence、pairing、orphan EV 审计。 | 失败则 evidence gate 失败。 |
| `reports/acceptance/*.md` | handoff、veto、risk、open issues 审查入口。 | 不能替代 raw artifact 或最终签署。 |

### 8. 风险与边界思考

| 风险 | R10.1 判断 | R10.2 处理 |
|---|---|---|
| evidence schema 未在 `05` / `06` 正式闭口 | 当前 Step 只定义验收门禁和路径方向,不得发明机器字段。 | 若 R10.2 需要字段名/值域,必须标注由 `05` / future schema owner 闭口。 |
| Step 10 与 Step 9 重复 | Step 9 定义非功能门禁,Step 10 负责证据链、report audit、observability/audit evidence 的可裁决性。 | R10.2 避免重复非功能表,只写证据门禁。 |
| Step 10 与 Step 11 VETO 重复 | Step 10 判断证据是否可信;Step 11 再挑一票否决项。 | R10.2 只标注“Step 11 复核 VETO”。 |
| acceptance report 被当最终结论 | acceptance report 只是 handoff/review material。 | R10.2 明确不得替代 raw artifact、EV index 或 Step 14 sign-off。 |
| old `06/07` 证据污染 | 旧 PostgreSQL/gateway/outbox/P95 证据不进入当前 P0。 | R10.2 写旧材料隔离。 |

### 9. R10.2 写入策略思考

`R10.2 observability evidence:再写入` 可以写入:

1. Step 10 模块状态、必读文档表和输入承接。
2. SOP Step 10 问题回答。
3. evidence gate 表,覆盖 P0 evidence index、blocking suite artifact/report pair、observability safe signal、redaction/dependency/report audit、acceptance handoff。
4. P0 Evidence 追溯表,使用 `EV-ML-*` 和 L3 suite family。
5. Report 完整性检查表,固定 `reports/runs/<run_id>` 与 `artifacts/test/<run_id>` 路径方向。
6. 证据门禁停审记录和跨证据裁决审计。
7. 回填草稿、待确认事项和进入 Step 11 条件。

`R10.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. 真实 run_id、真实 pass/fail、验收 verdict、release sign-off。
3. artifact JSON schema、case JSON schema、assertion item key、digest algorithm 细节、retention days、metric names、alert threshold、dashboard、CI YAML 或脚本实现。
4. 新增 `TC-ML-*`、`EV-ML-*` 以外的临时 ID,或复制 `EV-GOV-*` / `AC-GOV-*`。
5. `07-实施计划.md`、implementation boundary、required check 或实现代码。

### 10. R10.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 10 R10.1 | pass |
| 是否读取 SOP Step 10、书写规范、`03` §14、`05` §13 和 L1-governance Step 10 框架 | pass |
| 是否使用 L3-local `EV-ML-*`、suite/report 路径和候选 `AC-ML-EV-*` 方向 | pass |
| 是否明确 run-scoped evidence / no latest / no static evidence / artifact-report pairing | pass |
| 是否区分 Step 9 非功能、Step 10 证据门禁和 Step 11 VETO | pass |
| 是否未定义机器 artifact schema、metric name、alert threshold、retention、CI 或 implementation boundary | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 10 `R10.2 observability evidence:再写入`;只允许写入 Step 10 的 SOP 问题回答、evidence gate 表、P0 Evidence 追溯表、Report 完整性检查表、证据门禁停审记录、跨证据裁决审计、回填草稿、待确认事项和进入 Step 11 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R10.2 observability evidence:再写入

### 11. R10.2 模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R11.1 |
| 用户确认 | 已确认从 Step 10 `R10.1 observability evidence:先思考` 推进到 `R10.2 observability evidence:再写入`。 |
| 当前写入 | SOP 问题回答、evidence gate 表、P0 Evidence 追溯表、Report 完整性检查表、acceptance handoff 约束、证据门禁停审记录、跨证据裁决审计、回填草稿、待确认事项和进入 Step 11 条件。 |
| 当前禁止 | 修改正式 `06`;写真实 run_id / pass-fail;定义 artifact JSON schema、case JSON schema、assertion item key、digest algorithm、metric name、alert threshold、retention、CI、script 或 implementation boundary。 |

### 12. SOP 问题回答

| SOP 问题 | R10.2 回答 |
|---|---|
| 哪些行为必须有 audit record? | accepted command、inbound receipt、outbound candidate/outcome、operations job report、config validation failure、redaction/dependency/report audit 和 handoff preparation 必须能在 safe audit / report / marker 中被追溯。 |
| 哪些行为必须有 trace / log / metric? | command、query、inbound、outbound、job、runtime、config validation 和 report generation 均需 safe signal;metric 只允许低基数 category,trace/log/audit 不得含 raw body、secret、provider response 或 full sensitive ref。 |
| 哪些测试报告必须归档? | P0 blocking suite report、run summary、gate summary、evidence index、redaction check、dependency boundary、report audit、release smoke、acceptance handoff、veto checklist、risk acceptance 和 open issues 必须有固定路径方向。 |
| 证据缺失是否导致不通过? | P0 EV、blocking suite raw artifact/report pair、redaction/dependency/report audit 缺失或失败时不得通过;无法确认来源时标记不可裁决并停审。 |
| 证据如何被复查? | 从 `reports/runs/<run_id>/evidence-index.md` 查到 `EV-ML-*`,再回到 suite report,再回到 `artifacts/test/<run_id>/...` raw artifact 和 safe failure evidence。 |
| 每个 P0 EV 是否能回指测试用例、suite artifact、report path 和验收项? | 必须能回指 `TC-ML-*`、suite/check family、artifact root、report path、相关 AC / ML-NFR / VETO candidate。不能回指则视为 orphan EV。 |
| acceptance handoff 能否替代 raw artifact? | 不能。`reports/acceptance/*` 只能作为验收交接和审查入口,不得替代 raw artifact、suite report、evidence index 或 Step 14 sign-off。 |
| 是否允许静态造证据或默认 passed? | 不允许。evidence index、veto checklist 和 risk acceptance 均不得从静态表或默认值宣告 passed。 |

### 13. Evidence gate 表

| 验收项 ID | 证据主题 | 必须存在的证据 | 通过条件 | 失败条件 |
|---|---|---|---|---|
| AC-ML-EV-001 | P0 evidence index | `reports/runs/<run_id>/evidence-index.md` | 覆盖全部 P0 `EV-ML-*`,每项可回指 TC、AC/NFR、suite、artifact root、report path 和 review direction。 | 缺任一 P0 EV、orphan EV、使用 `latest`、无法回到 raw artifact 或缺 review direction。 |
| AC-ML-EV-002 | blocking suite artifact/report pair | `artifacts/test/<run_id>/...` 与 `reports/runs/<run_id>/suites/<suite>.md` | 每个 blocking suite 都有 raw artifact 与 generated human report 配对;failed / timeout / unavailable 也保留 safe failure evidence。 | suite report 无 raw artifact、failed artifact 被删除、report 手写补洞或 unavailable 被标记 passed。 |
| AC-ML-EV-003 | observability safe signal | `observability-boundary` suite report、safe log/metric/trace/audit sample direction | signal 只含 body-free refs、safe markers、low-cardinality categories,且不作为 truth / replay / recovery source。 | raw body/secret/provider response 泄露、高基数敏感标签、observability 修 truth 或替代 recovery。 |
| AC-ML-EV-004 | redaction hard audit | `reports/runs/<run_id>/redaction-check.md` | artifact root 与 report root 均 clean;negative leak fixture safe failure。 | raw body、secret、credential、token、provider response 或 full sensitive ref 出现在 artifact/report/log/trace/audit。 |
| AC-ML-EV-005 | dependency boundary audit | `reports/runs/<run_id>/dependency-boundary.md` | 证明 compile dependency 不引入 non-core sibling repo,运行时协作与编译依赖分离。 | non-core sibling compile dependency、反向依赖或缺少 dependency graph 证据。 |
| AC-ML-EV-006 | report generation integrity | `reports/runs/<run_id>/report-audit.md` | artifact/report pairing、no latest、no static evidence、no orphan EV、failed suite retained 均通过。 | 静态 JSON 造 EV、手写 pass、report 无 artifact、orphan EV、failed suite 被覆盖。 |
| AC-ML-EV-007 | release summary / gate summary | `reports/runs/<run_id>/summary.md`;`reports/runs/<run_id>/gate-summary.md`;`release-main-smoke` suite report | release summary 只汇总底层 suite,不替代底层证据;P0/P1/P2 与 blocking/non-blocking 分类清楚。 | release smoke 替代底层 suite、P1 unavailable 写成 P0 pass、gate summary 缺 blocking suite。 |
| AC-ML-EV-008 | acceptance handoff | `reports/acceptance/handoff.md`;`open-issues.md` | 说明送验范围、baseline、run_id、P0/P1/P2、失败/未覆盖项,且只作为审查入口。 | handoff 缺 run refs、未经审查、直接宣告最终通过或替代 raw artifact。 |
| AC-ML-EV-009 | veto / risk review entry | `reports/acceptance/veto-checklist.md`;`risk-acceptance.md` | VETO / risk 均有来源、EV/report/defect 支撑;风险项有影响、接受人和后续动作方向。 | VETO 默认全 passed、接受 VETO/S 级缺陷、risk acceptance 无接受人或缺后续动作。 |

### 14. P0 Evidence 追溯表

| Evidence ID | 来源 suite / check | 关联用例族 | report path direction | 验收引用方向 | 缺失影响 |
|---|---|---|---|---|---|
| `EV-ML-CONTRACT-001` | `contract-domain-fast` | `TC-ML-TRUTH-*`;`TC-ML-FORMALIZATION-*`;`TC-ML-VERSION-*`;`TC-ML-STATE-*` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | truth / formal version / state AC。 | contract、domain、state 门禁不可裁决。 |
| `EV-ML-SERVICE-001` | `service-flow-fast` | `TC-ML-QUERY-*`;`TC-ML-CONSUMPTION-*`;`TC-ML-IDEMP-*` | `reports/runs/<run_id>/suites/service-flow-fast.md` | command/query/flow AC。 | 功能流、query no-write、duplicate replay 不可裁决。 |
| `EV-ML-INFRA-001` | `infra-runtime-fake` | `TC-ML-UOW-*`;`TC-ML-DEPENDENCY-*`;`TC-ML-MARKER-*` | `reports/runs/<run_id>/suites/infra-runtime-fake.md` | runtime / seam / marker AC。 | UoW、seam、marker source 不可裁决。 |
| `EV-ML-ENTRY-001` | `entry-worker-job` | `TC-ML-TRACE-*`;`TC-ML-AUDIT-*`;`TC-ML-JOB-*`;`TC-ML-REPORT-*` | `reports/runs/<run_id>/suites/entry-worker-job.md` | entry and operations surface AC。 | inbound、worker、job entry 门禁不可裁决。 |
| `EV-ML-REPLAY-001` | `operations-replay-core`;`operations-replay-extended` | `TC-ML-REPLAY-*`;`TC-ML-RECOVERY-*`;`TC-ML-JOB-*` | `reports/runs/<run_id>/suites/operations-replay-core.md` | consistency / recovery / no truth repair AC。 | recovery、checkpoint、stored report replay 不可裁决。 |
| `EV-ML-CONFIG-001` | `config-redline` | `TC-ML-CONFIG-*`;`TC-ML-MARKER-*` | `reports/runs/<run_id>/suites/config-redline.md` | config redline AC / veto。 | config fail-fast / profile isolation 不可裁决。 |
| `EV-ML-DEPENDENCY-001` | `dependency-boundary` | dependency boundary cut;`TC-ML-DEPENDENCY-*` | `reports/runs/<run_id>/dependency-boundary.md` | dependency veto / AC。 | 架构依赖红线失败或不可裁决。 |
| `EV-ML-REDACTION-001` | `redaction-boundary` | `TC-ML-REDACTION-*`;`TC-ML-DIAGNOSTIC-*` | `reports/runs/<run_id>/redaction-check.md` | redaction veto / AC。 | redaction 门禁失败;Step 11 复核 VETO。 |
| `EV-ML-OBSERVABILITY-001` | `observability-boundary` | `TC-ML-OBSERVABILITY-*`;`TC-ML-METRIC-*`;`TC-ML-AUDIT-*` | `reports/runs/<run_id>/suites/observability-boundary.md` | observability not truth AC。 | observability safe signal 不可裁决。 |
| `EV-ML-REPORT-001` | `report-generation-audit` | `TC-ML-EVIDENCE-*`;report pairing cases | `reports/runs/<run_id>/report-audit.md` | evidence integrity veto / AC。 | evidence gate 失败。 |
| `EV-ML-RELEASE-001` | `release-main-smoke` | representative `TC-ML-*` | `reports/runs/<run_id>/suites/release-main-smoke.md` | release readiness direction;不替代底层 suite。 | release readiness 不可裁决。 |
| `EV-ML-RISK-001` | P1 selected-run / residual report | P1/P2 selected cases | `reports/acceptance/risk-acceptance.md` 或 residual report direction | residual only,not P0 pass。 | 影响 Step 13 residual,不直接阻断 P0。 |

### 15. Report 完整性检查表

| 检查项 | 固定路径方向 | 通过条件 | 失败影响 |
|---|---|---|---|
| EV 索引 | `reports/runs/<run_id>/evidence-index.md` | P0 EV 可回指 TC / AC / suite / artifact / report。 | 不通过或送验不成立。 |
| Suite reports | `reports/runs/<run_id>/suites/<suite>.md` | blocking suite 均有 generated report,失败也可审计。 | 对应 suite 不可裁决。 |
| Raw artifacts | `artifacts/test/<run_id>/...` | report 能回指 raw artifact,不得只保留 human report。 | report 不可信。 |
| Gate summary | `reports/runs/<run_id>/gate-summary.md` | P0 blocking / non-blocking / P1 selected-run 分类清楚。 | release readiness 不可裁决。 |
| Redaction check | `reports/runs/<run_id>/redaction-check.md` | artifact root 和 report root 无 unsafe material。 | redaction gate 失败;Step 11 复核 VETO。 |
| Dependency boundary | `reports/runs/<run_id>/dependency-boundary.md` | compile dependency boundary clean。 | 架构红线失败;Step 11 复核 VETO。 |
| Report audit | `reports/runs/<run_id>/report-audit.md` | no latest、no static evidence、no orphan EV、artifact/report pairing。 | evidence integrity 失败。 |
| Acceptance handoff | `reports/acceptance/handoff.md` | 送验范围、baseline、run_id、未覆盖项清楚。 | 交接不完整,不得进入最终签署。 |
| VETO checklist | `reports/acceptance/veto-checklist.md` | 每项 VETO 有来源和证据方向。 | 不得通过。 |
| Risk acceptance | `reports/acceptance/risk-acceptance.md` | residual 有影响、接受人和后续动作方向。 | 不得有条件通过。 |

### 16. Acceptance handoff 约束

| 文档 | 允许作用 | 禁止作用 |
|---|---|---|
| `reports/acceptance/handoff.md` | 汇总送验范围、baseline、run_id、P0/P1/P2、失败/未覆盖项和审查入口。 | 替代 evidence index、raw artifact、suite report 或最终 sign-off。 |
| `reports/acceptance/veto-checklist.md` | 作为 Step 11 一票否决项复核入口。 | 默认全部 passed 或用风险接受覆盖 VETO。 |
| `reports/acceptance/risk-acceptance.md` | 承接 Step 13 residual、接受人、后续动作和触发条件。 | 接受 S 级缺陷、redaction leak、dependency violation 或 evidence integrity failure。 |
| `reports/acceptance/open-issues.md` | 记录不可裁决项、未覆盖项和后续闭口入口。 | 把 P0 blocker 降级为普通 note。 |

### 17. 证据门禁停审记录

| Evidence / Report | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `EV-ML-*` | 是否均能回指 TC / AC / suite / artifact / report | 通过 | 正式执行时由 evidence index 证明;本 Step 不填真实状态。 |
| `reports/runs/<run_id>/evidence-index.md` | 是否禁止静态 JSON 造 EV | 通过 | `EV-ML-REPORT-001` 必须覆盖 no static evidence。 |
| suite report / raw artifact pair | 是否每个 blocking suite 都配对 | 通过 | failed / timeout / unavailable 也必须保留 safe evidence。 |
| redaction / dependency / report audit | 是否作为硬门禁 | 通过 | failed 不得风险接受;Step 11 复核 VETO。 |
| acceptance handoff | 是否不替代原始证据 | 通过 | handoff 只作审查入口。 |
| machine schema | 是否未发明 artifact/report JSON 字段和值域 | 通过 | 若实现需要字段级 schema,回 `05` / schema owner 闭口。 |

### 18. 跨证据裁决审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| orphan EV | 已禁止 | 由 report-audit / evidence-index 审计。 |
| 静态造证据映射 | 已禁止 | EV 必须从 artifact/report pair 和 suite status 推导。 |
| 缺 report / 缺 raw artifact | 已禁止 | blocking suite 缺任一侧即不可裁决。 |
| failed suite 被改写 passed | 已禁止 | failed artifact/report 必须保留 safe failure evidence。 |
| `latest` 正式引用 | 已禁止 | 正式验收必须固定 `<run_id>`。 |
| acceptance 初稿未经审查 | 已禁止作为最终结论 | handoff/veto/risk/open issues 需要审查。 |
| redaction / dependency / evidence integrity failure | 已硬化 | 进入 Step 11 VETO 复核,不得风险接受。 |
| old `06/07` 证据污染 | 已隔离 | 旧 PostgreSQL/gateway/outbox/P95/MethodContent 证据不进入当前 P0。 |

### 19. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_10_observability_evidence.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Evidence gate 表”“P0 Evidence 追溯表”“Report 完整性检查表”“证据门禁停审记录”和“跨证据裁决审计表”小节,了解可观测性、审计与证据门禁如何从测试证据、report 结构和验收裁决口径收敛。

正式 `06-验收标准.md` §10 应回填:

- P0 证据必须固定到 `reports/runs/<run_id>` 和 `artifacts/test/<run_id>`;不得引用 `latest`。
- `EV-ML-*` 必须从 suite raw artifact、suite report、case refs、safe failure evidence 和 report audit 推导,不得由静态 JSON、手写表或默认 passed 宣告覆盖。
- `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md` 只能作为验收交接与审查入口,不得替代 raw artifact、suite report、evidence index 或最终签署。
- redaction、dependency boundary、report audit、evidence index、artifact/report pairing 和 observability safe signal 任一 P0 失败时不得通过。
- 若实现或验收执行需要机器 artifact 字段名、digest algorithm、case assertion item schema 或 retention 天数,必须回 `05` / `06` 对应 owner 闭口,不得在验收执行时自行补口。

### 20. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 机器 artifact/report 字段级 schema 是否需要在后续硬化 | 影响实现 evidence writer / reader | 当前只定义验收门禁与路径方向;字段级 schema 需回 `05` 或专门 schema owner 闭口。 |
| evidence retention 天数 | 影响长期审计与运维 | 当前只要求验收期间 run-scoped 可追溯;Step 13 residual 继续承接。 |
| acceptance review 签署人 | 影响最终结论 | Step 14 固定签署口径。 |
| P1 selected-run 是否进入某次送验强制 | 影响 risk acceptance | Step 13 裁决 residual / conditional pass。 |

### 21. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| SOP Step 10 问题已回答 | 通过 | 见 §12。 |
| evidence gate 已结构化 | 通过 | 见 §13。 |
| P0 Evidence 追溯方向完整 | 通过 | 见 §14。 |
| report 完整性与 acceptance handoff 约束已固定 | 通过 | 见 §15 / §16。 |
| 证据门禁已停审 | 通过 | 见 §17。 |
| 跨证据裁决审计无 unresolved 冲突 | 通过 | 见 §18。 |
| 可进入 Step 11 | 通过 | 下一步定义一票否决项;进入前等待用户确认。 |

### 22. R10.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 Step 10 R10.2 | pass |
| 是否完成 SOP Step 10 期望产出 | pass |
| 是否使用 L3-local `EV-ML-*` / `AC-ML-EV-*` 而非 governance ID | pass |
| 是否覆盖 evidence index、suite artifact/report pair、observability safe signal、redaction/dependency/report audit 和 acceptance handoff | pass |
| 是否禁止 `latest`、static evidence、orphan EV、handwritten pass 和 failed suite 覆盖 | pass |
| 是否未定义机器 artifact schema、case schema、metric name、alert threshold、retention、CI 或 implementation boundary | pass |
| 是否区分 Step 10 evidence gate 与 Step 11 VETO / Step 13 risk / Step 14 sign-off | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 11 `R11.1 veto:先思考`;只允许思考一票否决项来源、候选 VETO、证据依赖、风险接受禁止项和 R11.2 写入边界;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。
