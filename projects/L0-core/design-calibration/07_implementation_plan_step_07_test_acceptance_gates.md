## Step 7. 嵌入测试与验收门禁

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 7
- 回填章节：`07-实施计划.md` §7 测试与验收门禁嵌入

### 2. 本步输入

- 上游文档：
  - `projects/L0-core/05-测试方案.md` §6 / §9 / §13
  - `projects/L0-core/06-验收标准.md` §5 / §6 / §7 / §10 / §11
- 已确认结论：
  - PH-01~PH-06 已定义阶段顺序。
  - commit-01-a ~ commit-06-a 已定义提交边界。
  - 测试和 evidence 不得最后补，必须嵌入阶段和提交边界。
  - 真实 L0-bus / L0-sdk / L1+ 不作为本轮 P0 门禁，boundary suite 必须作为替代证据。
- 依赖的前序 Step：
  - `07_implementation_plan_step_05_phases_dependencies.md`
  - `07_implementation_plan_step_06_tasks_commits.md`

### 3. SOP 问题回答

1. 每个阶段应执行哪些测试用例或测试切口。

   回答：PH-01 执行 fmt/lint、DTO schema 和 config smoke；PH-02 执行 scope、draft command、idempotency、transaction/outbox；PH-03 执行 review/publish/lifecycle/event/audit；PH-04 执行 query、stale projection、trace、package/sample 和安全边界；PH-05 执行 worker job、snapshot、fact、relay boundary；PH-06 执行 E2E minimal loop、evidence archive、redline scan 和 release gate。

2. 哪些阶段必须对齐验收标准 AC 项。

   回答：所有阶段都必须对齐 AC。PH-01 对齐 AC-FUNC-002、AC-SYNC-003、AC-RED-003、AC-RED-008；PH-02 对齐 AC-FUNC-001、AC-SYNC-001、AC-RED-001、AC-CONS-*；PH-03 对齐 AC-FUNC-003、AC-SYNC-001、AC-SYNC-004、AC-EVID-003/004；PH-04 对齐 AC-FUNC-006/007、AC-SYNC-002/007、AC-RED-002/006；PH-05 对齐 AC-FUNC-004/005、AC-SYNC-005/006/007；PH-06 对齐 AC-FUNC-008、AC-EVID-* 和 AC-BLOCKER-*。

3. 每个门禁需要产出什么证据。

   回答：每个阶段至少产出对应 suite 的 EV。所有 EV 必须包含 `run_id`、`commit`、`suite`、`case_id`、`evidence_id`、`config_profile`、`result`，关键路径还必须包含 `trace_id`。PH-06 必须聚合证据索引并证明 EV 可定位。

4. 门禁失败是否允许继续进入下一阶段。

   回答：P0 阻断门禁失败时不允许进入下一阶段。仅 EV-NFR / EV-NIGHTLY 在未被 release gate 标记为必需时可进入风险接受。任何 AC-BLOCKER、raw secret、禁止正文、truth/audit/outbox 半提交、失败伪成功或 release gate 失败都必须停止推进。

5. 哪些门禁可以自动化，哪些需要人工审查。

   回答：fmt/lint、unit、service、contract、config、integration、worker、relay、E2E、security scan 均应自动化。人工审查主要用于 evidence index 可复查性、风险接受、设计偏离回写、真实外部依赖未接入说明和最终 release gate 裁决。

6. 哪些验收一票否决项需要在实施阶段提前规避。

   回答：PH-01 规避相邻仓职责和 raw secret 配置；PH-02 规避 truth/audit/outbox 半提交；PH-03 规避发布基线不可追溯和失败伪成功；PH-04 规避禁止正文入仓、projection 反写真相和 query 写入；PH-05 规避 relay 丢事件、引用 fail open、job 失败伪成功；PH-06 规避 P0 EV 缺失、release gate 缺失和一票否决项被风险接受覆盖。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| Step 6 提交边界 | 已列提交前门禁，但尚未系统映射 AC / EV | 提交可以通过测试但仍缺少验收证据 |
| `05-测试方案.md` §9 / §13 | suite 和 evidence 已完整 | 需要嵌入阶段和 commit boundary |
| `06-验收标准.md` §5~§11 | AC / blocker 已完整 | 需要明确失败时能否继续推进 |
| PH-06 release gate | 已作为最终阶段 | 需要明确 release gate 不可被风险接受替代 |
| 外部依赖 | 真实 bus/sdk/L1 后置 | 需要明确 boundary suite 失败会阻塞，而真实联调缺失进入风险 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 阶段门禁 | Step 5 只有简要门禁 | 每阶段绑定 TC / AC / EV / 失败处理 | 阶段完成必须可验收 |
| 提交门禁 | Step 6 只有提交前 suite | 补充 commit boundary 到 EV 的映射 | 支持提交证据审查 |
| 失败处理 | 未集中定义 | P0 失败阻断；NFR/nightly 条件风险接受 | 防止失败后继续推进 |
| 一票否决 | 只在验收标准中定义 | 提前分配到阶段规避 | 避免最后才发现红线 |
| 人工审查 | 未明确 | 只保留 evidence、风险接受、设计偏离和放行裁决 | 自动化优先，人工审查聚焦不可自动判断项 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只在 PH-06 统一跑全量测试 | 操作简单 | 缺陷发现太晚，阶段和 commit 不可判定 | 不采用 |
| 每个阶段嵌入对应测试和 AC | 问题定位清楚，提交可审查 | 需要维护阶段到 TC/AC/EV 映射 | 采用 |
| 每个 commit 都跑 release gate | 最严格 | 成本过高，且早期阶段缺少完整闭环 | 不采用 |
| commit 运行局部门禁，PH-06 运行 release gate | 成本和质量平衡 | 需要确保局部门禁足够覆盖风险 | 采用 |
| 真实外部联调作为 P0 门禁 | 集成更真实 | 阻塞 L0-core 底座仓，违反边界 | 不采用 |
| 使用 boundary suite 替代真实外部联调 | 保持独立可验收 | 真实联调风险后续承接 | 采用 |

### 7. 结构化中间产物

#### 7.1 阶段门禁矩阵

| 阶段编号 | 测试门禁 | 验收门禁 | 证据产物 | 失败处理 |
|---|---|---|---|---|
| PH-01 | `fmt_lint_suite`、`dto_schema_contract_suite`、`config_smoke_suite` | AC-FUNC-002、AC-SYNC-003、AC-RED-003、AC-RED-008 | EV-CI-FMT-001、EV-CONTRACT-001、EV-CONFIG-001、EV-SEC-002 | 失败不得进入 PH-02；raw secret / P1 配置污染触发 blocker |
| PH-02 | `unit_domain_suite`、`service_command_query_suite`、`integration_persistence_suite` | AC-FUNC-001、AC-SYNC-001、AC-RED-001、AC-CONS-004/006/007 | EV-UNIT-001、EV-SVC-001、EV-INT-001、EV-AUDIT-001、EV-SCOPE-001 | 失败不得进入 PH-03；truth/audit/outbox 半提交一票否决 |
| PH-03 | command service tests、event contract tests、audit / trace checks | AC-FUNC-003、AC-SYNC-001、AC-SYNC-004、AC-EVID-003/004 | EV-SVC-001、EV-CONTRACT-002、EV-AUDIT-001、EV-TRACE-001 | 失败不得进入 PH-04/PH-05；发布基线不可追溯一票否决 |
| PH-04 | query tests、projection stale tests、trace/view tests、security body scan | AC-FUNC-006/007、AC-SYNC-002/007、AC-RED-002/006 | EV-SVC-001、EV-TRACE-001、EV-SEC-001、EV-SCOPE-001 | 失败不得进入 PH-06；禁止正文入仓或 projection 反写真相一票否决 |
| PH-05 | `worker_job_suite`、`outbox_relay_boundary_suite`、integration retry/failure tests | AC-FUNC-004/005、AC-SYNC-005/006/007、AC-RED-009/010 | EV-WORKER-001、EV-CONTRACT-002、EV-INT-001、EV-CONFIG-001 | 失败不得进入 PH-06；relay 丢事件、fail open、失败伪成功一票否决 |
| PH-06 | `e2e_minimal_loop_suite`、release gate、evidence archive check、redline scan | AC-FUNC-008、AC-EVID-001~010、AC-BLOCKER-* | EV-E2E-001、EV-SEC-001/002、EV-SCOPE-001、evidence index | 失败不得放行；P0 EV 缺失或 release gate 缺失不得风险接受 |

#### 7.2 Commit Boundary 门禁矩阵

| 提交边界 | 必跑测试 / 检查 | 最小证据 | 是否允许失败后提交 |
|---|---|---|---|
| commit-01-a | fmt/lint/check | EV-CI-FMT-001 初版 | 否 |
| commit-01-b | DTO roundtrip、config smoke、secret config negative | EV-CONTRACT-001、EV-CONFIG-001、EV-SEC-002 | 否 |
| commit-02-a | domain lifecycle / scope unit | EV-UNIT-001、EV-SCOPE-001 | 否 |
| commit-02-b | command service、idempotency、transaction/outbox | EV-SVC-001、EV-INT-001、EV-AUDIT-001 | 否 |
| commit-03-a | submit/publish/gate fail command tests | EV-SVC-001、EV-AUDIT-001 | 否 |
| commit-03-b | lifecycle terminal、CloudEvent、trace/audit | EV-CONTRACT-002、EV-TRACE-001、EV-AUDIT-001 | 否 |
| commit-04-a | get/list query、stale projection | EV-SVC-001、EV-INT-001 | 否 |
| commit-04-b | trace、package view、guide sample、body scan | EV-TRACE-001、EV-SEC-001、EV-SCOPE-001 | 否 |
| commit-05-a | validate/rebuild/recalculate job | EV-WORKER-001、EV-CONFIG-001 | 否 |
| commit-05-b | snapshot/fact/relay boundary | EV-WORKER-001、EV-CONTRACT-002、EV-INT-001 | 否 |
| commit-06-a | E2E minimal loop、release gate、evidence/redline | EV-E2E-001、AC-EVID index、EV-SEC/SCOPE | 否 |

#### 7.3 证据归档规则

| 规则 | 要求 |
|---|---|
| 证据字段 | 每份 EV 必须包含 `run_id`、`commit`、`suite`、`case_id`、`evidence_id`、`config_profile`、`result`，关键路径包含 `trace_id` |
| 证据路径 | 默认使用 `artifacts/test/l0-core/<run_id>/...` 逻辑路径；物理路径在 Step 8 / Step 11 固定 |
| 提交绑定 | 每个 commit boundary 必须能关联对应 EV 或本地执行记录 |
| 安全扫描 | EV、日志、trace、audit、outbox 和报告不得包含 raw secret、外部正文全文或生产敏感数据 |
| 不可补口头证据 | P0 EV 缺失时不得用口头确认替代，必须补跑并归档 |

#### 7.4 门禁失败处理口径

| 失败类型 | 是否可继续 | 处理方式 |
|---|---|---|
| P0 suite 失败 | 否 | 修复后重跑当前 suite 和相关回归 |
| P0 EV 缺失 | 否 | 补跑、补证、更新 evidence index |
| AC-BLOCKER 触发 | 否 | 停止推进，修复并复验；不得风险接受 |
| raw secret / 禁止正文泄露 | 否 | 清理、修复、重跑安全扫描和相关路径 |
| truth/audit/outbox 半提交 | 否 | 修复事务边界并重跑 integration / audit / outbox tests |
| 真实外部 bus/sdk/L1 未就绪 | 可继续 | 通过 boundary suite 验证，并登记后续仓风险 |
| EV-NFR / EV-NIGHTLY 未关闭 | 条件继续 | 未被 release gate 标记为必需时进入风险接受 |

#### 7.5 自动化与人工审查分工

| 类型 | 自动化 | 人工审查 |
|---|---|---|
| 格式 / lint / 编译 | 必须 | 仅审查异常豁免 |
| unit / service / contract / config / integration / worker / E2E | 必须 | 审查失败复验和新增覆盖是否合理 |
| security / scope scan | 必须 | 审查误报、风险接受和边界解释 |
| evidence index | 可自动生成 | 必须人工复核可访问性和字段完整性 |
| 设计偏离 | 自动化只能发现部分 | 必须人工判断是否回写设计 |
| release gate 裁决 | 自动化提供证据 | 必须人工确认是否通过 / 有条件通过 / 不通过 |

### 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §7。

```md
## 7. 测试与验收门禁嵌入

> 校准来源：
> - `design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“阶段门禁矩阵”“Commit Boundary 门禁矩阵”“证据归档规则”和“门禁失败处理口径”小节，了解测试方案和验收标准如何嵌入实施过程。

测试和验收不得在全部代码完成后补做。每个阶段、每个 commit boundary 都必须绑定对应测试门禁、验收门禁、证据产物和失败处理。

| 阶段编号 | 测试门禁 | 验收门禁 | 证据产物 | 失败处理 |
|---|---|---|---|---|
| PH-01 | fmt/lint、DTO、config smoke | AC-FUNC-002、AC-SYNC-003、AC-RED-003/008 | EV-CI-FMT-001、EV-CONTRACT-001、EV-CONFIG-001、EV-SEC-002 | 失败不得进入 PH-02 |
| PH-02 | domain、service、integration | AC-FUNC-001、AC-SYNC-001、AC-CONS-* | EV-UNIT-001、EV-SVC-001、EV-INT-001、EV-AUDIT-001 | 失败不得进入 PH-03 |
| PH-03 | publish、lifecycle、event、audit/trace | AC-FUNC-003、AC-SYNC-004、AC-EVID-003/004 | EV-SVC-001、EV-CONTRACT-002、EV-AUDIT-001、EV-TRACE-001 | 失败不得进入 PH-04/PH-05 |
| PH-04 | query、projection、trace/view、security scan | AC-FUNC-006/007、AC-SYNC-002/007、AC-RED-002/006 | EV-SVC-001、EV-TRACE-001、EV-SEC-001、EV-SCOPE-001 | 失败不得进入 PH-06 |
| PH-05 | worker job、relay boundary、failure recovery | AC-FUNC-004/005、AC-SYNC-005/006/007 | EV-WORKER-001、EV-CONTRACT-002、EV-INT-001 | 失败不得进入 PH-06 |
| PH-06 | E2E、release gate、evidence、redline | AC-FUNC-008、AC-EVID-*、AC-BLOCKER-* | EV-E2E-001、EV-SEC-*、EV-SCOPE-001、evidence index | 失败不得放行 |

P0 suite 失败、P0 EV 缺失、AC-BLOCKER 触发、raw secret / 禁止正文泄露、truth + audit + outbox 半提交、失败伪成功、release gate 缺失或失败，均不得继续推进或风险接受。真实 L0-bus / L0-sdk / L1+ 未就绪不阻塞本轮 P0，但必须通过 boundary suite 证明 L0-core 输出接缝成立，并进入后续仓风险。
```

### 9. 待确认事项

- 目标实现仓实际 CI job 名称和测试命令仍需 Step 11 与实现仓对齐。
- 证据物理归档路径仍需 Step 8 / Step 11 固定；本步只固定逻辑路径和必备字段。
- EV-NFR / EV-NIGHTLY 是否进入 release gate 必需项，留到 Step 9 / Step 12 裁决。

建议方案：接受当前阶段门禁矩阵。原因是它把 05 的测试 suite 和 06 的 AC / blocker 嵌入到 PH-01~PH-06 与 commit boundary，能防止最后补测和证据缺失。

### 10. 进入下一步条件

- 阶段门禁矩阵完整。
- Commit boundary 到测试 / 证据的映射明确。
- 证据归档和失败处理已明确。
- 可以进入 Step 8，继续定义配置、环境与外部依赖准备。
