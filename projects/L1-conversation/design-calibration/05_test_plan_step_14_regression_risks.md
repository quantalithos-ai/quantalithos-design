# L1-conversation 05 测试方案 Step 14: 定义回归策略与残余风险

> 所属流程: `05_test_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/05-测试方案.md` §14 回归策略与残余风险
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 14 |
| 主题 | 定义回归策略与残余风险 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/05_test_plan_step_14_regression_risks.md` |

本步定义代码、配置、脚本、设计和缺陷修复发生变化时应触发的最小回归、全量回归和残余风险记录规则。正式 `05-测试方案.md` 重建留给 Step 15。

## 2. 本步输入

| 输入 | 用途 | 本步判定 |
|---|---|---|
| `05_test_plan_step_02_scope.md` | P0 / P1 / P2 范围和非范围风险 | 作为残余风险来源 |
| `05_test_plan_step_05_traceability_matrix.md` | 未覆盖项清单和 P1/P2 挂起项 | 作为非 P0 风险来源 |
| `05_test_plan_step_06_cases.md` | P0 用例矩阵 | 作为回归集来源 |
| `05_test_plan_step_09_automation_ci_gates.md` | PR、main CI、nightly、release gate suite | 作为回归执行位置来源 |
| `05_test_plan_step_10_special_nonfunctional.md` | 专项测试和红线 | 作为全量回归和 veto 回归来源 |
| `05_test_plan_step_11_defects_retest.md` | 缺陷分级、复验、风险接受 | 作为缺陷触发回归来源 |
| `05_test_plan_step_13_reports_evidence.md` | EV、report、acceptance 路径 | 作为残余风险交接来源 |

## 3. SOP 问题回答

### 3.1 哪些变更触发最小回归?

局部实现变更触发与对象族、协议族、suite 和 EV 对应的最小回归。例如 space / scope 变更至少回归 `TC-CONV-SPACE-*`、`TC-CONV-SCOPE-*` 和 `SUITE-CONV-MAIN-SERVICE`; query 变更至少回归 `TC-CONV-QUERY-*`、`TC-CONV-SEARCH-001` 和 `SUITE-CONV-MAIN-QUERY`; reports / scripts 变更至少回归 `TC-CONV-REPORT-001`、`TC-CONV-REDACTION-001`、release report 和 redaction check。

### 3.2 哪些变更触发全量回归?

任何影响 P0 truth boundary、state machine、transaction、idempotency、authorization、redaction、source truth isolation、config profile、artifact / report path、公共 DTO / event schema 的变更都触发全量 P0 回归。任何 S0 / S1 缺陷修复也触发对应主线 suite 加 release redline;若修复跨越多个对象族,触发全量 P0。

### 3.3 哪些风险暂不覆盖?

暂不覆盖真实 DB / broker / resolver / handoff 产品行为、真实跨仓端到端联调、Chat UI / Workspace 聚合 / Bridges 外部平台体验、Runtime 推理质量、Governance / Artifact / Identity 来源真相生命周期、生产级吞吐 / 延迟 / 容量数字、config center / hot reload / auto repair 和 production-like 运维专项。这些不构成 P0 空洞,但必须作为 P1/P2 或后续专项风险记录。

### 3.4 谁接受残余风险?

残余风险只能由对应能力 owner、测试 owner 和验收 owner 共同接受。实现阶段若没有明确角色,必须在 `reports/acceptance/risk-acceptance.md` 中标记为待确认,不得用“默认接受”替代。S0 / S1 不存在可接受人,必须修复后退出。

### 3.5 哪些风险必须转入验收标准?

必须转入 `06-验收标准.md` 的风险包括: P0 不依赖真实外部服务、integration-like 不等同 production-like、量化性能指标未锁定、`reports/acceptance/*` 必须经人 / Agent 审查、redaction / boundary scan 失败一票否决、S0 / S1 不允许风险接受、正式 AC 必须回指 `reports/runs/<run_id>/evidence-index.md`。

## 4. 当前文档问题诊断

| 文档 | 诊断 | 本步处理 |
|---|---|---|
| 旧 `05-测试方案.md` | 旧稿没有变更触发回归和残余风险接受规则 | 不继承旧回归策略 |
| Step 2 | 已列非范围风险,但没有接受人和验收转入规则 | 本步补残余风险表 |
| Step 6 | 用例矩阵已形成,但缺少变更到 TC / suite 的触发关系 | 本步建立回归触发表 |
| Step 11 | 缺陷复验规则已定义,但还未纳入变更触发 | 本步把 S0 / S1 修复纳入全量 / 扩展回归 |
| Step 13 | 已有 `risk-acceptance.md` 入口 | 本步规定哪些风险进入该报告 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 回归触发 | 只知道失败后要复验 | 按变更类型映射最小回归和全量回归触发条件 |
| 残余风险 | 非范围已列出但未落责任 | 每项风险有影响、缓解方式和接受角色 |
| 验收承接 | 未说明哪些风险转入 06 | 明确验收标准必须消费的风险和证据路径 |
| S0 / S1 | 已知不可风险接受 | 明确不能进入残余风险表 |
| P1/P2 | 已知不阻塞 P0 | 明确通过 `risk-acceptance.md` 或待确认项记录 |

## 6. 测试设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 回归粒度 | 每次变更全量 P0 | 小变更最小回归,高风险变更全量 P0 | B | 控制成本,同时不放松红线 |
| 残余风险是否写 P0 红线 | 可以写入并签字 | S0 / S1 不得进入残余风险 | B | 红线不能靠接受人绕过 |
| 接受人是否可空 | 不写接受人 | 明确 owner 或待确认 | B | SOP 要求未覆盖风险有接受人或待确认项 |
| 量化性能是否补默认数字 | 本步补数字 | 继续列为待确认 / 后续专项 | B | 需求未锁定数字,不得虚构阈值 |
| 验收标准是否消费本步 | 只放测试方案内部 | 06 必须引用风险和 EV 索引 | B | 验收需要裁决残余风险 |

## 7. 结构化中间产物

### 7.1 回归触发表

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任人 |
|---|---|---|---|
| Space / scope domain or service | `TC-CONV-SPACE-*`; `TC-CONV-SCOPE-*`; `EV-CONV-TRUTH-001` | 修改状态机、visibility guard、outbox side effect、audit 字段 | domain owner + test owner |
| Fact append / retract / idempotency | `TC-CONV-FACT-*`; `TC-CONV-TX-001`; `EV-CONV-FACT-001` | 修改 transaction、idempotency、append-only、forbidden body guard | domain owner + service owner |
| Query / read model / search | `TC-CONV-QUERY-*`; `TC-CONV-SEARCH-001`; `EV-CONV-AUTH-001` | 修改 authorization、query no-write、projection marker、cursor semantic | query owner + test owner |
| Manifestation / source resolver | `TC-CONV-MAN-*`; `EV-CONV-MAN-001` | 修改 source truth isolation、safe snapshot、digest / unresolved 语义 | integration owner + domain owner |
| Inbound consumer | `TC-CONV-CONSUMER-*`; `EV-CONV-CONSUMER-001` | 修改 event envelope、quarantine、ref-only boundary、duplicate handling | worker owner + contract owner |
| Trace / archive handoff | `TC-CONV-TRACE-001`; `TC-CONV-HANDOFF-*`; `EV-CONV-HANDOFF-001` | 修改 handoff state、payload ref-only、redaction requirement、retry / failed | job owner + observability liaison |
| Outbox / event publish | `TC-CONV-OUTBOX-*`; `EV-CONV-OUTBOX-001` | 修改 event schema、event id、publish retry、state write recovery | worker owner + bus liaison |
| Projection / cursor / consistency | `TC-CONV-DERIVED-*`; `TC-CONV-CURSOR-001`; `TC-CONV-CONSISTENCY-001`; `EV-CONV-DERIVED-001` | 修改 no-auto-repair、cursor sequence、failed / stale marker | job owner + query owner |
| Config / scripts / reports | `TC-CONV-CONFIG-001`; `TC-CONV-REPORT-001`; `TC-CONV-REDACTION-001`; `EV-CONV-CONFIG-001`; `EV-CONV-REDACTION-001`; `EV-CONV-GATE-001` | 修改 path shape、profile、redaction、report generator、evidence index | config owner + release owner |
| Public DTO / event schema / metadata | contract suite + all affected scenario TC | 影响两个以上对象族或跨仓 contract | contract owner + affected owners |
| S0 / S1 defect fix | direct TC + same group TC + related suite + release redline | 缺陷根因跨对象族、红线、事务、授权或 redaction | defect owner + test owner |

### 7.2 回归集定义表

| 回归集 | 内容 | 触发 |
|---|---|---|
| REG-CONV-MIN-DOMAIN | 受影响 domain / service TC + 同组 negative case | 单对象族内部变更 |
| REG-CONV-MIN-CONTRACT | contract roundtrip、DTO、event schema、metadata tests | public protocol 变更 |
| REG-CONV-MIN-WORKER-JOB | worker / job suite、duplicate / rerun、failure injection | consumer、outbox、handoff、projection job 变更 |
| REG-CONV-MIN-CONFIG-REPORT | config negative、path shape、report generation、redaction check | config、scripts、reports、artifact path 变更 |
| REG-CONV-REDLINE | release redline、redaction check、veto checklist inputs | S0 / S1 修复、红线相关变更 |
| REG-CONV-FULL-P0 | PR suites + main service/query/worker/job/config + release redline/report | 跨对象族、状态机、事务、授权、redaction、schema 或 path 变更 |
| REG-CONV-READINESS | nightly integration-like + operations-replay + risk report | P0/P1 boundary、controlled adapter 或 replay 变更 |

### 7.3 残余风险表

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| 真实 DB / broker / resolver / handoff 产品行为未验证 | P0 使用 in-memory / fake / controlled adapter | P0 通过不代表生产产品集成可用 | P1 integration / staging-like 专项;不得宣称 production-like 通过 | integration owner + acceptance owner |
| 真实跨仓端到端联调未完成 | 上游 / 下游仓实现和部署不属于当前 P0 | 跨仓部署可能暴露接缝配置问题 | 后续以已收稳仓库为输入做 staging-like 测试 | project owner + affected repo owner |
| Chat UI / Workspace / Bridges 体验未覆盖 | 属于下游子项目测试范围 | 产品体验完整性不能由本仓 P0 证明 | 下游仓测试方案覆盖;本仓只提供 authorized refs / events | downstream owner |
| Runtime 推理质量和工具调用正确性未覆盖 | Conversation 只消费结果性事实 ref | 推理质量问题不会在本仓 P0 中裁决 | `L2-runtime` / tools 测试方案覆盖;本仓验证 forbidden body boundary | runtime owner |
| Governance / Artifact / Identity 真相生命周期未覆盖 | 本仓不拥有来源 truth | 来源仓数据不一致会影响 manifestation 输入 | 本仓只验证 unresolved / digest mismatch;来源仓自行验收 | source repo owner |
| 生产级吞吐、延迟、容量数字未锁定 | 需求未确认量化阈值 | 不能宣称达到生产容量目标 | 保留 baseline / trend evidence;06 若补阈值需追加专项 | performance owner + acceptance owner |
| config center / hot reload / auto repair 未覆盖 | P2 能力不在当前设计范围 | 后续引入可能破坏冷更新、审计或 truth 边界 | P0 中启用即 unsupported / fail-fast;后续单独设计 | config owner |
| production-like 运维 runbook / dashboard 未覆盖 | 属于 P1/P2 运维专项 | 运维交接完整性不足 | `reports/acceptance/open-issues.md` 记录;后续 observability / archive 项目承接 | operations owner |

### 7.4 必须转入验收标准的风险 / 规则

| 项 | 转入 `06-验收标准.md` 的口径 | 证据入口 |
|---|---|---|
| P0 不依赖真实外部服务 | P0 通过只证明本仓语义和 controlled seam,不代表 production-like | `reports/acceptance/handoff.md` |
| integration-like 边界 | integration-like 通过不等于真实跨仓端到端通过 | `reports/acceptance/risk-acceptance.md` |
| 量化性能缺口 | 未锁定数字不得作为通过或失败阈值 | `reports/runs/<run_id>/summary.md` |
| redaction / boundary veto | scan 失败一票否决,不得风险接受 | `reports/runs/<run_id>/redaction-check.md` |
| S0 / S1 不可接受 | 未关闭 S0 / S1 时不得送验通过 | `reports/acceptance/open-issues.md` |
| EV / AC 追溯 | AC 必须回指 `reports/runs/<run_id>/evidence-index.md` | `reports/runs/<run_id>/evidence-index.md` |
| acceptance review | `reports/acceptance/*` 必须有人 / Agent 审查补充 | `reports/acceptance/handoff.md` |

### 7.5 风险接受门禁

| 门禁 | 通过条件 |
|---|---|
| 风险级别 | 仅 S2 / S3 或 P1/P2 非范围风险可进入风险接受 |
| 影响说明 | 必须说明不影响 P0 红线、P0 EV 和验收裁决 |
| 接受角色 | 必须有 owner、test owner、acceptance owner,或明确待确认 |
| 后续动作 | 必须有目标专项、目标时间或转入对应子项目测试方案 |
| 证据路径 | 必须写入 `reports/acceptance/risk-acceptance.md` 或 `open-issues.md` |
| 禁止项 | S0 / S1、redaction violation、授权失效、source truth isolation 失败、path shape 错误不得接受 |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §14 时摘录。

```markdown
## 14. 回归策略与残余风险

> 校准来源：
> - `design-calibration/05_test_plan_step_14_regression_risks.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“回归触发表”“回归集定义表”“残余风险表”“必须转入验收标准的风险 / 规则”和“风险接受门禁”小节，了解代码、配置、脚本、设计和缺陷修复如何触发回归，以及哪些风险可以进入验收交接。

回归策略按变更影响面触发。单对象族变更执行对应最小回归集；公共 DTO / event schema、状态机、事务、授权、redaction、source truth isolation、artifact / report path 或跨对象族变更触发全量 P0 回归。S0 / S1 缺陷修复必须回归直接 TC、同组 TC、相关 suite 和 release redline。

残余风险只允许记录 P1/P2 或 S2/S3 风险。真实 DB / broker / resolver / handoff 产品行为、真实跨仓端到端、下游 UI / bridge 体验、runtime 推理质量、来源仓 truth lifecycle、生产级容量数字、config center / hot reload / auto repair 和 production-like 运维专项不构成 P0 空洞,但必须进入 `reports/acceptance/risk-acceptance.md` 或 `open-issues.md`。S0 / S1、redaction violation、授权失效、source truth isolation 失败和证据路径错误不得风险接受。
```

## 9. 待确认事项

无阻塞进入 Step 15 的待确认事项。

后续 Step 必须继续收口:

- Step 15 重建正式 `05-测试方案.md` 时必须保留本步回归触发表和残余风险表。
- `06-验收标准.md` 必须消费本步“必须转入验收标准的风险 / 规则”。
- 实施计划若引用测试门禁,必须把本步 REG 集合映射到对应 phase / commit boundary。

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 回归触发可实施 | 通过 | 变更类型、最小回归、全量触发和责任角色已定义 |
| 残余风险有归属 | 通过 | 每项风险都有接受角色或后续专项 |
| S0 / S1 未被风险接受 | 通过 | 红线和 P0-blocking 缺陷必须修复 |
| 验收标准可引用 | 通过 | 已列出必须转入 06 的风险 / 规则 |
| 可以进入 Step 15 | 通过 | 下一步整理正式 `05-测试方案.md` |
