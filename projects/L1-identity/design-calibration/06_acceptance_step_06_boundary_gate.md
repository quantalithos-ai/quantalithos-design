# Step 6. 定义数据边界与架构红线验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 6
> 回填章节: `06-验收标准.md` §6 数据边界与架构红线验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 定义数据边界与架构红线验收 |
| 当前状态 | 已审核通过 |
| 输入基线 | Step 1~5 已审核通过;新版 `00` 数据归属、`01` 依赖边界、`03` 安全 / 持久化约束、`05` redaction / dependency 证据 |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_06_boundary_gate.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 7 |

## 2. 本步目标

把数据归属、forbidden material、架构依赖、query no-write、job no-repair、P1/P2 不污染 P0 等红线转成可检查的验收门禁。

本 Step 只定义边界和红线验收:

- identity-owned truth、snapshot、reference、forbidden body 的边界。
- external body / secret / raw private material 不进入 truth、event、trace、audit、report 或 artifact。
- sibling business implementation 不成为 compile-time dependency。
- query、projection、consumer、callback、job 不隐式创建或修复 identity business truth。
- reconciliation / maintenance 只 report-only,不得修相邻仓 truth。
- P1/P2 selected-run、真实产品和 production-like 能力不得替代 P0。

一票否决的最终裁决、VETO 编号绑定和触发后结论留到 Step 11。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `06_acceptance_step_05_function_gate.md` | 已审核通过 | 提供功能门禁中标注的红线影响 |
| `00-需求文档.md` §10 / §11 / §14 | 正式输入 | 提供 BR-ID-001~015、数据归属、禁止正文和 VETO-ID-001~006 |
| `01-架构设计.md` §8 | 正式输入 | 提供依赖方向、跨仓依赖裁剪和禁止依赖 |
| `03-详细设计.md` §3 / §8 / §10 | 正式输入 | 提供安全外部边界、flow discipline、no-write/no-repair、persistence boundary |
| `05-测试方案.md` §10 / §13 | 正式输入 | 提供 redaction-boundary、dependency-boundary、write-audit、job no-repair 和正式 EV/report 证据 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据不得由本仓保存? | RoleDefinition / Method Content 正文、Project / ProjectMember / WorkItem truth、memory 原文、embedding、检索索引、artifact / evidence body、conversation message body、runtime logs / execution context body、credential、token、session、raw secret、archive package 和外部来源正文不得进入 identity truth、event、trace、audit、report、artifact 或 diagnostic body。 |
| 哪些下游不得反向改写真相? | downstream consumers、query、projection、event consumer、handoff、reconciliation、maintenance job、runtime、observability 和相邻仓不得反向写 identity truth。`L1-work`、`L3-method-library`、governance、memory / archive 等只能通过 refs、safe summary、events、adapters、receipt 或 report 接缝协作。 |
| 哪些 projection / cache 不得反写真相? | `MemberSummaryView`、projection/read model、reference state、reconciliation report、trace/audit view、outbox/handoff marker、runtime technical marker 都不得被当作 truth source,不得由 query 或 job 反向修复 business truth。 |
| 哪些 P1 能力不得污染 P0? | real-like / durable-like selected-run、真实 DB / bus / archive / metric / secret provider、production-like profile、capacity、hard SLO、external HR / IdP、UI / dashboard、复杂组织和 full event-sourcing-first 不得作为 P0 pass 必要条件,也不得替代 P0 fake / controlled evidence。 |
| 红线失败时是否一票否决? | 本 Step 标注红线失败影响。涉及 `VETO-ID-001~006`、forbidden body / secret、non-core sibling compile dependency、query/job truth write、reconciliation repair truth、static evidence / missing artifact-report pairing 的失败将在 Step 11 / Step 12 中进入一票否决或 S 级缺陷裁决。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| 旧 `06-验收标准.md` | 架构红线、数据边界和安全治理分散,并使用旧对象 / 旧 gate 口径 | 新版统一用 `AC-BOUNDARY-*` 表达数据与架构红线 |
| `00` §11 | 数据归属表覆盖 truth、snapshot、reference、forbidden body | 本 Step 将其转成可检查验收项 |
| `01` §8 | 依赖边界是架构约束 | 本 Step 将 non-core sibling compile dependency 设为红线 |
| `03` §8 / §10 | query no-write、job no-repair、fake parity 是实现约束 | 本 Step 先定义红线,Step 7/8 再逐接口 / 状态细化 |
| `05` §10 | 红线专项已定义检查方向 | 本 Step 只引用正式 evidence/report path,避免使用候选 EV 名 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 数据边界 | 旧验收泛写不复制正文 | 新版按 truth / snapshot / reference / forbidden body 分类验收 | 对齐 `00` §11 |
| 架构红线 | 旧验收混在安全与治理章节 | 新版单独建立 `AC-BOUNDARY-*` | 符合验收 SOP Step 6 |
| 依赖边界 | 旧验收无固定证据路径 | 新版绑定 `dependency-boundary` 和 `EV-ID-ARCH-001` | 可复验 |
| query/job 红线 | 旧验收缺统一 no-write/no-repair 口径 | 新版绑定 service-flow / operations-replay 和 write-audit | 阻断 hidden write |
| P1/P2 污染 | 旧验收未明确 | 新版明确不能替代 P0 evidence | 保持 Step 2/3/4 边界 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否在 Step 6 直接宣告 VETO 触发结论 | A. 是;B. 只定义红线门禁,Step 11 正式裁决 VETO | 采用 B。保持 SOP 分工。 |
| 是否把接口细节展开到每个 route / event | A. 展开;B. 留 Step 7 | 采用 B。Step 6 聚焦边界红线。 |
| 是否允许真实产品 selected-run 替代 P0 fake evidence | A. 允许;B. 不允许 | 采用 B。P1/P2 不能污染 P0。 |
| 是否允许 fake 私有 map 补正式 port 缺口 | A. 允许;B. 不允许 | 采用 B。fake 必须与 durable adapter 保持正式 logical semantics。 |

## 8. 结构化中间产物

### 8.1 架构红线验收表

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| `AC-BOUNDARY-001` | identity truth ownership | member、lifecycle、role/capability summary、career、memory refs、trace/report 等按 `00` 数据归属落在 truth/snapshot/reference/report-only 类别;projection/read model 不替代 truth | ProjectMember、RoleDefinition、memory body、runtime body 等被写成 identity truth;projection/cache 被当作 truth source | `EV-ID-CONTRACT-001`;`EV-ID-STATE-001`;`reports/runs/<run_id>/suites/contract-domain-fast.md` |
| `AC-BOUNDARY-002` | forbidden material / redaction | forbidden body fixture 被拒绝、隔离或只保存 body-free marker;logs/metrics/audit/trace/report/artifact scan clean | RoleDefinition、ProjectMember、memory text、artifact body、archive package、credential、token、raw secret 或 full sensitive ref 出现在 store/event/trace/audit/report/artifact | `EV-ID-REDACTION-001`;`reports/runs/<run_id>/redaction-check.md` |
| `AC-BOUNDARY-003` | compile-time dependency boundary | business crate 只允许 `L0-core` / core contracts 编译期依赖;method/work/governance/runtime/archive/observability 通过 runtime/event/adapter 接缝 | 非 core sibling business implementation path dependency;truth mixing;共享数据库事务 | `EV-ID-ARCH-001`;`reports/runs/<run_id>/dependency-boundary.md` |
| `AC-BOUNDARY-004` | query / projection no-write | Query visibility-first/read-only;missing/not-visible/degraded 不创建 truth、不 reserve idempotency、不 repair projection/reference/report | query 创建 `GlobalMember` 或 identity truth;query 刷新 resolver、重建 projection、写 trace/audit/outbox/report | `EV-ID-QUERY-001`;`reports/runs/<run_id>/suites/service-flow-fast.md`;write-audit artifact |
| `AC-BOUNDARY-005` | consumer / callback no implicit create | consumer/callback missing target 走 delayed/quarantined/rejected/noop;duplicate replay 返回 stored receipt | consumer/callback 对 missing member/relation 隐式创建 truth 或 accepted marker;unsupported schema 仍 parse/write | `EV-ID-CONSUMER-001`;`reports/runs/<run_id>/suites/entry-worker-job.md` |
| `AC-BOUNDARY-006` | operations job no business truth repair | rebuild/refresh/reconcile/publish/deliver/retry 只改 maintenance/propagation/report stores;reconciliation report-only | job 修 identity business truth 或相邻仓 truth;duplicate job 重新扫描 / rerun mutation;reconciliation 写 remediation plan | `EV-ID-JOB-001`;`reports/runs/<run_id>/suites/operations-replay-core.md` |
| `AC-BOUNDARY-007` | outbox / handoff payload body-free | outbox material 和 handoff marker 来自 accepted facts,保存 refs/markers/cursor/trace;publisher 不查询 current truth 重构 payload | outbound payload 包含外部正文;publisher 从 current truth 重构 payload;publish success 被误当 downstream consumed | `EV-ID-OUTBOX-001`;`EV-ID-JOB-001`;`reports/runs/<run_id>/suites/operations-replay-core.md` |
| `AC-BOUNDARY-008` | P1/P2 no P0 pollution | P0 pass 只依赖 fake/controlled/replay evidence;P1 selected-run unavailable 记录 residual;production-like 不伪造 evidence | P1 selected-run、真实产品、production capacity、UI/dashboard 替代 P0 suite 或被写成已验收 | `EV-ID-REPORT-001`;`reports/runs/<run_id>/report-audit.md`;`reports/acceptance/risk-acceptance.md` |

### 8.2 红线闭环表

| 红线 ID | 需求 / 设计来源 | 测试用例 / suite | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|
| `AC-BOUNDARY-001` | `00` §11;`03` §10.2 | `TC-ID-CONTRACT-*`;`TC-ID-DOMAIN-*`;`TC-ID-STATE-*`;`contract-domain-fast` | `EV-ID-CONTRACT-001`;`EV-ID-STATE-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md` | 失败导致不通过;truth mixing 进入 Step 11 |
| `AC-BOUNDARY-002` | `00` §11.2;`03` §3.4;`05` §10.3 | `TC-ID-CONTRACT-004`;`TC-ID-CMD-010`;`TC-ID-REDACTION-*`;`redaction-boundary` | `EV-ID-REDACTION-001` | `reports/runs/<run_id>/redaction-check.md` | 失败进入 Step 11 / S 级缺陷 |
| `AC-BOUNDARY-003` | `01` §8.3/§8.4;`03` §3.3 | `TC-ID-ARCH-001`;`dependency-boundary` | `EV-ID-ARCH-001` | `reports/runs/<run_id>/dependency-boundary.md` | 失败进入 Step 11 / S 级缺陷 |
| `AC-BOUNDARY-004` | `03` §8.3;`05` §10.3 | `TC-ID-QUERY-015`;`service-flow-fast` | `EV-ID-QUERY-001` | `reports/runs/<run_id>/suites/service-flow-fast.md` | 失败进入 Step 11 |
| `AC-BOUNDARY-005` | `03` §8.4;`05` §10.3 | `TC-ID-CONSUMER-001~006`;`entry-worker-job` | `EV-ID-CONSUMER-001` | `reports/runs/<run_id>/suites/entry-worker-job.md` | implicit create 进入 Step 11 |
| `AC-BOUNDARY-006` | `00` BR-ID-015;`03` §8.6/§10.4 | `TC-ID-JOB-001~008`;`operations-replay-core` | `EV-ID-JOB-001` | `reports/runs/<run_id>/suites/operations-replay-core.md` | job repair truth 进入 Step 11 |
| `AC-BOUNDARY-007` | `03` §8.5;§10.5 | `TC-ID-OUTBOX-*`;`TC-ID-JOB-*`;`operations-replay-core` | `EV-ID-OUTBOX-001`;`EV-ID-JOB-001` | `reports/runs/<run_id>/suites/operations-replay-core.md` | payload body 或 reconstruction 失败导致不通过 |
| `AC-BOUNDARY-008` | Step 2 / Step 3;`05` §14 | `report-generation-audit`;acceptance review | `EV-ID-REPORT-001` | `reports/runs/<run_id>/report-audit.md`;`reports/acceptance/risk-acceptance.md` | P1/P2 污染 P0 阻断退出 |

### 8.3 红线验收项停审记录

| 红线 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| `AC-BOUNDARY-001` | 数据归属、设计契约、TC / EV、report path | 通过 | VETO 绑定留 Step 11 |
| `AC-BOUNDARY-002` | forbidden material、redaction evidence、report path | 通过 | evidence 完整性留 Step 10 |
| `AC-BOUNDARY-003` | dependency boundary、allowed compile dependency、report path | 通过 | 依赖类型细化留 Step 7 |
| `AC-BOUNDARY-004` | query no-write、write-audit、evidence | 通过 | query surface 细化留 Step 7 |
| `AC-BOUNDARY-005` | consumer/callback no implicit create、receipt replay | 通过 | inbound interface 细化留 Step 7 |
| `AC-BOUNDARY-006` | job no business truth repair、report-only | 通过 | job state / transaction 细化留 Step 8 |
| `AC-BOUNDARY-007` | outbox/handoff body-free payload marker | 通过 | publish/handoff details 留 Step 7 |
| `AC-BOUNDARY-008` | P1/P2 no P0 pollution | 通过 | risk acceptance 留 Step 13 |

### 8.4 跨红线门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否覆盖 forbidden body / secret | 通过 | `AC-BOUNDARY-002` |
| 是否覆盖 sibling compile dependency | 通过 | `AC-BOUNDARY-003` |
| 是否覆盖 query no-write | 通过 | `AC-BOUNDARY-004` |
| 是否覆盖 consumer/callback no implicit create | 通过 | `AC-BOUNDARY-005` |
| 是否覆盖 job no truth repair / report-only | 通过 | `AC-BOUNDARY-006` |
| 是否覆盖 outbox/handoff body-free | 通过 | `AC-BOUNDARY-007` |
| 是否覆盖 P1/P2 不污染 P0 | 通过 | `AC-BOUNDARY-008` |
| 是否提前替代 Step 11 VETO | 通过 | 本 Step 只定义红线验收,不做最终 VETO 裁决 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 数据边界与架构红线足够进入 Step 7 | 否 | 红线验收范围闭合 | 无需回写 |
| `05` §5 候选 EV 名称未进入正式验收 | 否 | 正式证据表达已收敛 | 使用 `05` §13 formal EV |
| 若 Step 7 发现依赖类型或接口证据缺口 | 是 | 接口 / 同步验收缺口 | Step 7 暂停并回写 |
| 若 Step 10 发现 redaction/dependency/report artifact 缺失 | 是 | 证据门禁缺口 | Step 10 阻断 |
| 若 Step 11 确认红线触发 VETO | 是 | 最终裁决影响 | Step 11 / Step 14 不得通过 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_06_boundary_gate.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“架构红线验收表”“红线闭环表”“红线验收项停审记录”和“跨红线门禁审计表”小节,了解数据边界和架构红线如何从需求、架构、详细设计和测试证据收敛。

正式 `06-验收标准.md` §6 应回填:

- 数据边界与架构红线按 `AC-BOUNDARY-001~008` 组织。
- 每条红线必须给出通过条件、失败条件、需求 / 设计来源、测试用例或 suite、正式 EV、report path 和裁决影响。
- Forbidden material、non-core sibling compile dependency、query no-write、consumer/callback no implicit create、job no-repair、outbox/handoff body-free payload 和 P1/P2 no P0 pollution 是 P0 红线。
- 本章只定义红线验收;一票否决项的最终触发和结论在 §11 裁决。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| Step 7 是否需要按依赖类型拆分 `AC-BOUNDARY-003` | 影响接口 / 同步验收粒度 | Step 7 处理 |
| Step 8 是否需要按 job / query state 增补 no-write/no-repair 状态断言 | 影响一致性验收 | Step 8 处理 |
| Step 10 是否 redaction/dependency/report artifact 都存在 | 影响红线可裁决性 | Step 10 处理 |
| Step 11 哪些红线正式绑定 VETO | 影响最终结论 | Step 11 裁决 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 红线验收表完成 | 通过 | 见 §8.1 |
| 每条红线有来源 / TC / EV / report path | 通过 | 见 §8.2 |
| 红线验收项已停审 | 通过 | 见 §8.3 |
| 跨红线审计无 unresolved 冲突 | 通过 | 见 §8.4 |
| 未提前替代 Step 7~11 | 通过 | 接口、状态、证据、VETO 留后续 Step |
| 可进入 Step 7 | 通过 | 用户已确认,进入 Step 7: 定义接口、事件与跨仓同步验收 |
