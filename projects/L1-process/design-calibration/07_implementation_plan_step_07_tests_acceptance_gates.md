# L1-process 07 实施计划 Step 7: 嵌入测试与验收门禁

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §7 测试与验收门禁嵌入
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 7 |
| 主题 | 嵌入测试与验收门禁 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md` |

本步把 `05-测试方案.md` 和 `06-验收标准.md` 的 TC、EV、AC、VF 嵌入 PH-01~PH-10 和 commit boundary。本步不新增测试用例和验收标准。

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每阶段需要执行哪些测试 | 按阶段覆盖 contract、domain、service、integration、entry-contract、config-security、recovery-replay、evidence-scripts、minimum-e2e 和 P1 smoke。 |
| 哪些测试必须在提交前执行 | 每个 commit boundary 至少执行 fmt/check 和本 boundary 相关 unit / contract / service / worker / job test;阶段完成执行对应 TC / EV。 |
| 验收门禁如何前置 | AC / VF 不等到最终才检查;每阶段关联相关 AC / ST / RL / VF,发现红线立即暂停。 |
| evidence 何时生成 | PH-01 建路径和脚本壳;PH-02~PH-09 逐阶段生成 suite artifact;PH-10 生成最终 reports、EV detail、veto 和 handoff。 |
| redaction 何时检查 | 涉及 config、snapshot、event、handoff、report 的 boundary 必跑 redaction targeted check;PH-10 做全量 scan。 |
| 失败如何处理 | 阻断测试或 VF 风险不得提交;P1 real-like smoke 可进入 risk acceptance,但不得伪装 P0 通过。 |

## 3. 结构化中间产物

### 3.1 阶段测试与验收门禁表

| 阶段 | 必跑测试 / suite | 证据 | 关联验收 | 阶段退出门禁 |
|---|---|---|---|---|
| PH-01 | workspace `cargo check`;dependency scan;script help/path check;config smoke | `EV-SCRIPT-002` seed;script artifact shell | `VF-PROC-008`;RL-PROC-CONFIG-001 | 7 crate 可编译,只有 core sibling dependency,artifact/report path 固定 |
| PH-02 | `TC-PROC-CONTRACT-*`;shape/profile command/domain/service tests | `EV-CONTRACT-001`;`EV-SERVICE-001` slice | AC-PROC-001/006;ST-PROC-TX-*;ST-PROC-IDEM-* | shape/profile success、reject、duplicate、rollback 可验证 |
| PH-03 | `TC-PROC-STATE-*`;instance/activity command/service tests | `EV-DOMAIN-001`;`EV-SERVICE-001` slice | AC-PROC-002/003/007/008;VF-PROC-003 | ProcessInstance / Activity / Token / Gateway 不混同 Work 或 Runtime truth |
| PH-04 | `TC-PROC-RECOVERY-*`;waiting/checkpoint/recovery integration tests | `EV-INTEGRATION-001` slice | AC-PROC-004/010/011;VF-PROC-004/007 | waiting / checkpoint / recovery 延续同一 Process truth |
| PH-05 | rhythm command/domain/service tests;work boundary redaction | `EV-SERVICE-001` slice;`EV-SCRIPT-001` targeted | RL-PROC-ARCH-001;RL-PROC-DATA-002 | timebox / stage 只保存 refs / markers,不接管 Work truth |
| PH-06 | `TC-PROC-QUERY-001~011`;projection/read model no-write tests | `EV-SERVICE-002`;`EV-SCRIPT-003` seed | AC-PROC-005/012;ST-PROC-QUERY-001;VF-PROC-006 | 11 Query hit/missing/degraded/not visible 均 no-write |
| PH-07 | `TC-PROC-EVENT-001~007`;consumer dedup/quarantine/delayed tests | `EV-WORKER-001`;`EV-SCRIPT-001` targeted | AC-PROC-009;ST-PROC-EVENT-001;RL-PROC-DATA-002 | inbound consumer 不保存外部正文,重复不重复写 marker |
| PH-08 | `TC-PROC-PUB-001`;outbox payload / publisher retry tests | `EV-WORKER-002`;topic map evidence | REQ-PROC-OUTBOX-001;ST-PROC-REC-001 | 10 outbound events ref-only,失败有 retry / failed marker |
| PH-09 | `TC-PROC-JOB-001~007`;recovery-replay;partial report tests | `EV-JOB-001`;`EV-INTEGRATION-001` slice | AC-PROC-013;ST-PROC-JOB-001;VF-PROC-006/007 | jobs 不修业务 truth,只写允许 marker / report |
| PH-10 | `TC-PROC-SCRIPT-001~003`;`TC-PROC-E2E-001`;redaction full scan;acceptance checklist | `EV-SCRIPT-*`;`EV-E2E-001`;acceptance handoff | AC-PROC-001~029;VF-PROC-001~008 | fixed run evidence 完整,无 VF failed |

### 3.2 Commit Boundary 门禁索引

| Boundary | 最低门禁 | 阶段完成附加门禁 |
|---|---|---|
| commit-01-a | `cargo check` | dependency scan 无非 core sibling path |
| commit-01-b | script `--help`;path grep | config smoke;artifact/report root 可写 |
| commit-02-a | contracts/domain tests | shape/profile state negative case |
| commit-02-b | service tests;duplicate/conflict/rollback | `EV-SERVICE-001` shape/profile slice |
| commit-03-a | contracts/domain tests | 当前 boundary 的 instance/activity/token/gateway 状态子集覆盖;waiting/recovery reserved |
| commit-03-b | service/integration tests | instance/activity trace/outbox/result 同 UoW |
| commit-04-a | contracts/domain tests | waiting/recovery illegal transition |
| commit-04-b | recovery integration tests | commit unknown / no fork evidence |
| commit-05-a | contracts/domain tests | external Work ref-only negative |
| commit-05-b | service tests;targeted redaction | rhythm outbox/result evidence |
| commit-06-a | query contract tests | no Query idempotency key |
| commit-06-b | projection/no-write tests | degraded / stale marker evidence |
| commit-06-c | query handler/search/timeline tests | `TC-PROC-QUERY-001~011` complete |
| commit-07-a | inbound shared + method/work contract tests | envelope / dedup negative |
| commit-07-b | identity/governance/artifact inbound contract tests | digest / forbidden body negative |
| commit-07-c | runtime/conversation inbound contract tests;targeted redaction | runtime feedback and conversation context schema stable |
| commit-07-d | external reference consumer worker tests;targeted redaction | `TC-PROC-EVENT-001~005` |
| commit-07-e | runtime/conversation consumer worker tests | `TC-PROC-EVENT-006~007`;`EV-WORKER-001` slice |
| commit-08-a | outbound shared + shape/profile payload contract tests | topic map seed and ref-only payload stable |
| commit-08-b | instance/activity/timing payload contract tests;outbox record persistence tests | `ProcessOutboxRecord.payload_snapshot` 在 accepted transaction 保存;truth change mapping stable |
| commit-08-c | waiting/checkpoint/recovery payload contract tests | payload snapshot not recomputed from current truth |
| commit-08-d | trace/view payload contract tests;payload redaction | all 10 event mapping stable |
| commit-08-e | publisher retry/failure tests | `EV-WORKER-002` |
| commit-09-a | shared job schema + publish job contract tests | receipt / error / report refs stable |
| commit-09-b | projection/refresh/reconciliation job contract tests | invalid input / duplicate fixture |
| commit-09-c | handoff/recovery job contract tests | no truth repair fixture |
| commit-09-d | projection/refresh/reconciliation runner tests | partial report / no truth repair |
| commit-09-e | trace/archive handoff runner tests | handoff fake failure matrix |
| commit-09-f | full job tests;recovery-replay | `EV-JOB-001` |
| commit-10-a | script tests;redaction checker | minimal evidence index shell |
| commit-10-b | release gate;acceptance handoff | `EV-E2E-001`;AC/VF checklist |

### 3.3 Evidence 成熟度规则

| 时机 | 允许生成 | 禁止宣称 |
|---|---|---|
| PH-01 | artifact / report 目录、script help、空或样例 run structure | 最终 EV、验收结论 |
| PH-02~PH-09 | 当前阶段 suite artifact、局部 EV slice、targeted redaction | 全量 P0 pass |
| commit-10-a | 最小 `evidence-index.md` 壳、path check、redaction checker 输出 | final EV detail pages、acceptance passed |
| commit-10-b | final EV detail pages、acceptance handoff、veto checklist、risk report | 新增未测功能或绕过 VF |

### 3.4 一票否决前置检查

| VF | 阶段前置检查 |
|---|---|
| VF-PROC-001 | PH-02~PH-10 都要确认 C-1~C-5 主闭环未断裂 |
| VF-PROC-002 | PH-02 / PH-07 / PH-10 检查 method definition body 不入仓 |
| VF-PROC-003 | PH-03 / PH-05 检查 ProcessInstance / Activity / Token 不等同 Work / Runtime truth |
| VF-PROC-004 | PH-04 / PH-07 检查 waiting gate 不接管 Governance truth |
| VF-PROC-005 | PH-07 / PH-09 / PH-10 检查 artifact/runtime/identity/conversation/workspace/observability/archive 正文不入仓或 report |
| VF-PROC-006 | PH-06 / PH-09 检查 query、projection、report、job no truth repair |
| VF-PROC-007 | PH-04 / PH-09 检查 recovery 不产生第二份 Process truth |
| VF-PROC-008 | PH-01 起每次 Cargo dependency 改动都扫描 |

### 3.5 失败处理

| 失败类型 | 处理 |
|---|---|
| fmt/check/unit 失败 | 不提交;修复同 boundary 代码后重跑 |
| contract / DTO 漂移 | 暂停并回查 `03` Step 8;设计不闭合则回写 |
| state / flow / transaction 冲突 | 暂停并回查 `03` Step 6 / 9 / 10 / 11 / 13 |
| redaction 命中 | 阻断;清除 raw body / secret 来源,重跑 targeted 或 full scan |
| evidence path 错误 | 阻断;路径必须固定为 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |
| P1 smoke 失败 | 不阻断 P0,但进入 risk acceptance;不得伪装为 P0 通过 |
| VF failed | 最终不可通过;不得风险接受 |

## 4. 回填草稿

```markdown
## 7. 测试与验收门禁嵌入

> 校准来源:
> - `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“阶段测试与验收门禁表”“Commit Boundary 门禁索引”“Evidence 成熟度规则”和“一票否决前置检查”小节。

每个 phase / commit boundary 都必须绑定测试和验收门禁。测试失败、redaction 命中、evidence path 错误或 VF 风险未处理时,不得提交或进入下一阶段。
```

## 5. 进入下一步条件

- PH-01~PH-10 已绑定测试、证据和验收门禁。
- commit boundary 最低门禁已列出。
- evidence 成熟度和 VF 前置检查已固定。
