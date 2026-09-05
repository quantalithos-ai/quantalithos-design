# Step 10. 定义可观测性、审计与证据门禁

> 对应 SOP：standards/document/验收标准讨论流程_SOP.md Step 10
> 回填章节：06-验收标准.md §10
> 粒度参考：projects/L1-governance/design-calibration/06_acceptance_step_10_observability_evidence.md

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 定义可观测性、审计与证据门禁 |
| 当前状态 | 已完成；本轮连续授权并保留独立停审记录 |
| 输入基线 | Step 5~9；03 §14~§15；04 §8、§11~§12；05 §9、§13 |
| 输出文件 | projects/L2-member/design-calibration/06_acceptance_step_10_evidence_audit.md |

## 2. 本步目标

定义验收前必须存在的真实证据、报告、审计和脱敏检查，以及它们如何回指 TC、设计切口、AC / VF。证据门禁不能由口头确认、静态手写映射、fake success 或 planned 文档替代。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| 03 §14 | member-local log / metric / trace / audit 的安全边界 |
| 05 §9 | suite、gate、artifact / report 规划路径 |
| 05 §13 | EV family、索引 schema、目录结构和生成 / 审查规则 |
| Step 5~9 | AC、VETO、非功能和接口 / 一致性证据需求 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些行为必须有 audit / trace？ | accepted / rejected / blocked / unknown mutation、Consumer receipt、Job report、config validation、attempt / gap、projection / mirror successor 和关键 redaction / dependency 检查必须有可关联 safe ref。 |
| 哪些报告必须归档？ | 每个 P0 suite report、summary、gate-results、evidence-index、redaction-check、dependency-boundary、report-audit，以及 acceptance handoff、VETO checklist、open-issues；有条件通过另需 risk-acceptance。 |
| 证据缺失如何裁决？ | P0 evidence 缺失、artifact/report 不配对、digest 缺失、静态 EV 或 acceptance 初稿未审查均使验收不可裁决 / 不通过。 |
| evidence-index 是否覆盖全部 P0 EV？ | 必须覆盖所有实际产生的 P0 EV；索引需由真实 suite artifact / report 关系生成并可反查 TC / AC / VF。 |
| redaction-check 是否必须存在？ | 是；无 raw body / secret / hidden reasoning / high-cardinality / stack trace 的检查是硬门禁。 |
| acceptance handoff / VETO / risk 文件谁填写？ | 脚本可生成初稿，但验收前必须由人或授权 agent 审查；本轮不生成任何实例。 |
| 是否逐项停审？ | 是。每个 evidence / report 检查 artifact、report、digest、TC / AC / VF 回指和审查状态；全部完成后做跨证据审计。 |

## 5. 当前文档问题诊断

| 问题 | 处理 |
|---|---|
| 旧 06 只写 API / DB / trace 泛证据 | 固定 EV、artifact、report、acceptance path 和 digest 关系 |
| 旧文档可把“已有设计”当证据 | 明确 planned schema 不生成正式 EV |
| 观测与业务事实易混 | audit / telemetry 只携带 safe refs，不替代 local truth 或 external truth |

## 6. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| EV | 泛化“报告” | EV family + TC + suite + fixed path + digest + disposition |
| 路径 | latest / 临时目录 | artifacts/test/<run_id> 与 reports/runs/<run_id> |
| acceptance | 静态表格 | handoff / VETO / risk 文件必须真实生成并审查 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否把 planned EV 当正式证据 | 是 / 否 | 否，必须由真实 artifact/report 推导 |
| acceptance handoff 是否可自动签署 | 可 / 仅生成初稿 | 仅生成初稿，不能写 verdict / signoff |
| redaction 失败是否可风险接受 | 可 / 不可 | 不可，属于硬门禁 / VETO |

## 8. 结构化中间产物

### 8.1 证据门禁表

| 门禁 ID | 证据主题 | 必须存在 | 通过条件 | 失败影响 |
|---|---|---|---|---|
| EVG-L2M-001 | P0 suite 输出 | suite report.json、case results、stdout / stderr、failure reason | 每个 P0 suite 有真实配对产物和 digest | 不可裁决 |
| EVG-L2M-002 | EV index | reports/runs/<run_id>/evidence-index.md 与 machine index | 每个 EV 可回指 TC、cut、AC/VF、artifact、report、digest、disposition | 不通过 |
| EVG-L2M-003 | gate summary | reports/runs/<run_id>/gate-results.md | 所有 blocking gate 有真实结果；blocked / not_run 不被写 pass | 不通过 |
| EVG-L2M-004 | redaction | reports/runs/<run_id>/redaction-check.md 与 raw check artifact | 无 forbidden field；扫描范围覆盖 artifact、report、log、metric、trace、audit、outbound | 一票否决 |
| EVG-L2M-005 | dependency | dependency-boundary report + candidate inventory | Core-only compile；24 candidate 未物化 | 一票否决 |
| EVG-L2M-006 | acceptance handoff | reports/acceptance/handoff.md | source refs、范围、未覆盖和送验说明经审查 | 交接不完整 |
| EVG-L2M-007 | VETO checklist | reports/acceptance/veto-checklist.md | VF-L2M-001~009 每项有真实检查和回指 | 不通过 |
| EVG-L2M-008 | risk acceptance | reports/acceptance/risk-acceptance.md | residual 有 owner、acceptor、deadline / trigger、follow-up | 不得有条件通过 |

### 8.2 EV family 到验收映射（规划）

| EV family | 覆盖 | 主要 TC / suite | AC / VF |
|---|---|---|---|
| EV-L2M-CONTRACT-* | finite protocol、双锚、metadata、typed carrier | contract-domain-fast | AC-019/026/033；VF-002/007 |
| EV-L2M-DOMAIN-* | 34 对象、policy、28 状态、非法 / reserved edge | contract-domain-fast | AC-019~021/029~031 |
| EV-L2M-SERVICE-* | Command / Query、UoW、no-write、error mapping | service-flow-fast | AC-001~017/019~021 |
| EV-L2M-ENTRY-* | API / Consumer / Job gate、receipt、report | api-worker-entry | AC-002/003/011/025/031 |
| EV-L2M-INFRA-* | Store、CAS、append、rollback、adapter / builder | infra-fake-parity | AC-022/026/028/030/033 |
| EV-L2M-REPLAY-* | duplicate、conflict、in-flight、unknown | replay-recovery | AC-020/030/031/033；VF-005/008 |
| EV-L2M-JOB-* | 5 Job、partial isolation、no source repair | job-continuation | AC-016/021/024/031 |
| EV-L2M-PROJECTION-* | summary / outlet / freshness、Query no-write | projection-readmodel | AC-005/016/017/024/028 |
| EV-L2M-REDACTION-* | forbidden body / secret / stack / cardinality | redaction-boundary | AC-014/015/025/032；VF-004/008 |
| EV-L2M-DEPENDENCY-* | Core-only、依赖分类、24 candidate non-materialization | dependency-boundary | AC-022/026/033；VF-006/007/008 |
| EV-L2M-SMOKE-* | C1~C5 local composition smoke | local-smoke | AC-001~005 |
| EV-L2M-REPORT-* | artifact / report pairing、index provenance、handoff | report-generation-audit | AC-033；VF-008 |
| EV-L2M-OWNER-* | 条件化 owner selected-run | owner-seam-selected | blocker-specific，非 P0 默认 |

### 8.3 最小 evidence index schema

~~~json
{
  "ev_id": "EV-L2M-SERVICE-001",
  "run_id": "<fixed-run-id>",
  "project": "L2-member",
  "suite": "service-flow-fast",
  "tc_refs": ["TC-L2M-CMD-001"],
  "cut_refs": ["application_non_query_orchestration"],
  "artifact_root": "artifacts/test/<run_id>",
  "report_path": "reports/runs/<run_id>/suites/service-flow-fast.md",
  "artifact_digest": "<computed-digest>",
  "disposition": "passed|failed|blocked|not_run|unknown",
  "ac_refs": ["AC-L2M-001"],
  "vf_refs": [],
  "redaction_status": "checked|failed|not_run",
  "generated_from": "real-suite-artifact-and-report"
}
~~~

### 8.4 证据真实性与跨证据审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| EV 可回指真实 TC / suite / artifact / report | 通过（设计级） | 实例待执行 |
| 无 latest / project-nested path | 通过 | 固定 root 规则 |
| blocked / not_run 不伪装 pass | 通过 | disposition 必须保留 |
| redaction / dependency / report audit 是硬门禁 | 通过 | 失败即阻断 |
| acceptance 初稿需人审 | 通过 | 不自动 signoff |
| 24 candidate 无 event artifact | 通过 | 仅 non-materialization evidence |

## 9. 回填草稿

正式 §10 应写入 evidence gate、EV family、index schema、固定目录、真实性规则和 acceptance 文件审查要求；明确当前不产生证据实例。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实 run / digest | 全部 EV | 执行时固定 |
| report generator 实现 | 报告生成 | 只在实施授权后实现 |
| retention / archive | 长期追溯 | 后续运维标准 |

## 11. 进入下一步条件

- [x] P0 evidence / report / acceptance 入口和真实性规则完整。
- [x] 每个 EV family 可回指 TC、suite、AC / VF 和路径。
- [x] 没有把规划 EV 或静态映射写成已生成证据。
