# L2-member-images 05 测试方案 Step 13：测试报告与证据归档

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 13
> 回填位置：正式 `05-测试方案.md` 第 13 章
> 执行边界：本文件只定义 future evidence design；未创建脚本、CI、run、artifact、report、digest、evidence alias、verdict、signoff 或 readiness。

## 1. Step 状态与 Step 内计划

| 项目 | 记录 |
|---|---|
| 本步目标 | 统一 EV 规划族、原始 artifact、报告、验收交接和脱敏审查，使未来执行结果可被未来 06 引用。 |
| 本步输入 | Step 1~12；03 §14~§15 / Step 16；04 §8~§12；Step 5/6/9/10 的 TC、suite 和路径规划；测试方案规范 §4.6、§5.13。 |
| 本步输出 | 证据归档表、测试切口→TC→suite→EV→path 映射、报告生成表、目录结构、真实性/脱敏审计。 |
| gate_status | `pass_with_explicit_blockers`；所有 EV 仅为规划 family，未产生实例。 |

### 1.1 Step 内计划

- [x] 读取用例、环境、suite、NFR、退出与风险输入。
- [x] 确定 artifact / report 分工、固定路径与禁止引用。
- [x] 统一 EV family，移除旧 `EV-API/DOMAIN` 等断链引用。
- [x] 建立 suite、TC、EV 与 future-06 交接方向表。
- [x] 定义报告、审查、失败保留、真实性和脱敏规则。
- [x] 完成跨证据审计和回填草稿；不生成实际证据。

## 2. SOP 问题回答

| 问题 | 收敛回答 |
|---|---|
| 原始证据放哪里？ | `artifacts/test/<run_id>/...`；每个 suite 保留结构化结果、脱敏 stdout/stderr、failure reason、case result 和安全环境/配置 identity。 |
| 可读报告放哪里？ | `reports/runs/<run_id>/...` 由 `scripts/reports/*` 从 artifact 生成；验收交接初稿在 `reports/acceptance/...`，允许人 / Agent 审查补充。 |
| EV 如何关联？ | 使用稳定 `EV-<层级>-<三位序号>` 规划 family；实际实例必须由固定 run 的 artifact/report pair 推导，不能由静态表或手写 JSON 生成。 |
| EV 如何交给 06？ | 00 的 `AC-MI-*` 与 `VETO-MI-*` 仅是验收方向；未来 06 必须独立确认其 final mapping、门禁和裁决。本文件不预占未来 06 编号、结论或 signoff。 |
| 哪些内容不能进证据？ | raw secret/token/key、credential、完整外部正文、live memory/checkpoint/workspace、未脱敏 endpoint、payload、provider result、伪造 digest/result。 |
| 失败 suite 是否保留？ | 是；仍保留 `report.json`、stdout/stderr、failure reason 和已执行 case result，且不得把 failed/blocked 改写为 pass。 |

## 3. 规则来源与 artifact / report 分工

### 3.1 规则来源

- `standards/document/测试方案书写规范.md` §4.6、§5.13。
- `standards/document/设计文档讨论中间产物规范.md` §5.9、§5.10。
- `03-详细设计.md` §14~§15：safe observability、no-audit path、test seams。
- `04-配置设计.md` §8~§12：sensitive/no-output、profile、downstream handoff。

### 3.2 分工表

| 类型 | 固定路径 | 未来生成方 | 消费方 | 是否可人工补充 |
|---|---|---|---|---|
| raw artifact | `artifacts/test/<run_id>/...` | gate / CI / test runner | report script / reviewer | 否；不得改写 raw result |
| run report | `reports/runs/<run_id>/...` | `scripts/reports/*` | QA / reviewer / future 06 | 可补说明，不得改 raw result |
| acceptance handoff | `reports/acceptance/...` | script 初稿 + 人 / Agent 审查 | future 06 owner | 是；不得替代验收裁决 |

## 4. 统一证据 ID 与归档表（规划）

| 证据 ID | 证据类型 | 来源套件 | 保存位置 | 关联用例 | 验收交接方向 |
|---|---|---|---|---|---|
| `EV-UNIT-001` | contract/domain/state result | `pr-contract-domain` | `artifacts/test/<run_id>/suites/pr-contract-domain/` | `TC-CMD-001~003`、`TC-STATE-001~019` | 00 `AC-MI-001~010`、`AC-MI-026~030` direction；future 06 mapping pending |
| `EV-SVC-001` | service no-write / ordering result | `pr-boundary-no-write` | `artifacts/test/<run_id>/suites/pr-boundary-no-write/` | `TC-CMD-004~010`、`TC-QUERY-001~010`、`TC-CON-001~002` | 00 `AC-MI-011~025` direction；future 06 mapping pending |
| `EV-ENTRY-001` | API/worker/job logical-entry result | `ci-entry-contracts` | `artifacts/test/<run_id>/suites/ci-entry-contracts/` | `TC-IN-001~002`、`TC-JOB-001~006` | 00 `AC-MI-012`、`AC-MI-015`、`AC-MI-022~025` direction；future 06 mapping pending |
| `EV-INT-001` | store/UoW/fault / state-history result | `ci-integration-seams` | `artifacts/test/<run_id>/suites/ci-integration-seams/` | `TC-CON-003~005`、`TC-STATE-008~011` | 00 `AC-MI-010/015/020/025/029` direction；future 06 mapping pending |
| `EV-CONFIG-001` | config parse/profile/source/redaction result | `pr-config-security` | `artifacts/test/<run_id>/suites/pr-config-security/` | `TC-CONFIG-001~005` | 00 `AC-MI-005/010/015/020/025/029` direction；future 06 mapping pending |
| `EV-SEC-001` | static/live, pin and forbidden-body scan | `pr-config-security`、`ci-dependency-redaction` | `artifacts/test/<run_id>/suites/<suite>/` | `TC-SEC-001~002`、`TC-CMD-005` | `VETO-MI-002~007` direction；future 06 mapping pending |
| `EV-OBS-001` | safe log/metric/span / no-audit scan | `ci-dependency-redaction`、`ci-entry-contracts` | `artifacts/test/<run_id>/suites/<suite>/` | `TC-OBS-001~002`、`TC-STATE-018` | 00 `NFR-MI-009/022` direction；future 06 mapping pending |
| `EV-GATE-001` | dependency / outbound-zero / report-integrity audit | `ci-dependency-redaction`、checks | `artifacts/test/<run_id>/evidence/EV-GATE-001/` | `TC-DEP-001`、`TC-EVENT-001`、`TC-STATE-019` | `VETO-MI-007` direction；future 06 mapping pending |
| `EV-REC-001` | recovery negative / blocked report | `nightly-risk` | `artifacts/test/<run_id>/suites/nightly-risk/` | `TC-CON-004~005`、`TC-REC-001` | 00 `NFR-MI-014/018` direction；future 06 mapping pending |
| `EV-PERF-001` | read-only benchmark sample | `nightly-risk` or future controlled suite | `artifacts/test/<run_id>/suites/<suite>/` | `TC-PERF-001` | baseline input only; no current acceptance verdict |

## 5. 测试切口到证据 / 验收交接映射（规划）

| 测试切口 | 用例 ID | Suite / Gate | 证据 ID | artifact root | report path | future 06 handoff |
|---|---|---|---|---|---|---|
| contracts/domain/state | `TC-CMD-001~003`、`TC-STATE-001~019` | `pr-contract-domain` | `EV-UNIT-001` | `artifacts/test/<run_id>/suites/pr-contract-domain/` | `reports/runs/<run_id>/suites/pr-contract-domain.md` | 00 C-MI / AC-MI / VETO direction; final mapping pending |
| Command/Query no-write | `TC-CMD-004~010`、`TC-QUERY-001~010` | `pr-boundary-no-write` | `EV-SVC-001` | `artifacts/test/<run_id>/suites/pr-boundary-no-write/` | `reports/runs/<run_id>/suites/pr-boundary-no-write.md` | 00 build/qualification/supply AC direction; final mapping pending |
| inbound / jobs | `TC-IN-001~002`、`TC-JOB-001~006` | `ci-entry-contracts` | `EV-ENTRY-001` | `artifacts/test/<run_id>/suites/ci-entry-contracts/` | `reports/runs/<run_id>/suites/ci-entry-contracts.md` | marker / bounded-job / owner-gap direction; final mapping pending |
| UoW / consistency / recovery | `TC-CON-003~005`、`TC-REC-001` | `ci-integration-seams`、`nightly-risk` | `EV-INT-001`、`EV-REC-001` | `artifacts/test/<run_id>/suites/<suite>/` | `reports/runs/<run_id>/suites/<suite>.md` | NFR / blocked risk direction; final mapping pending |
| config / security / observability | `TC-CONFIG-001~005`、`TC-SEC-001~002`、`TC-OBS-001~002` | `pr-config-security`、`ci-dependency-redaction` | `EV-CONFIG-001`、`EV-SEC-001`、`EV-OBS-001` | `artifacts/test/<run_id>/suites/<suite>/` | `reports/runs/<run_id>/suites/<suite>.md` | VETO / NFR direction; final mapping pending |
| dependency / zero outbound | `TC-DEP-001`、`TC-EVENT-001` | `ci-dependency-redaction` | `EV-GATE-001` | `artifacts/test/<run_id>/evidence/EV-GATE-001/` | `reports/runs/<run_id>/gate-results.md` | `VETO-MI-007` direction; final mapping pending |
| performance candidate | `TC-PERF-001` | `nightly-risk` or future controlled suite | `EV-PERF-001` | `artifacts/test/<run_id>/suites/<suite>/` | `reports/runs/<run_id>/suites/<suite>.md` | baseline-only; cannot support pass before threshold authority |

## 6. 报告生成、目录与审查要求

| 报告 | 来源 artifact | 生成脚本（规划） | 输出位置 | 人 / Agent 审查要求 |
|---|---|---|---|---|
| suite summary | `artifacts/test/<run_id>/suites/<suite>/report.json` | `scripts/reports/generate_test_reports.sh` | `reports/runs/<run_id>/suites/<suite>.md` | 核对 failure、blocked 与 pass 分离 |
| evidence index | `artifacts/test/<run_id>/evidence-index.json` | `scripts/reports/generate_evidence_index.sh` | `reports/runs/<run_id>/evidence-index.md` | 核对 EV→TC→设计/需求方向可回指 |
| gate results | suite results | `scripts/reports/generate_gate_summary.sh` | `reports/runs/<run_id>/gate-results.md` | 核对 P0/VETO 方向与无 `latest` |
| redaction report | scan output | `scripts/reports/generate_redaction_report.sh` | `reports/runs/<run_id>/redaction-check.md` | 抽样确认无 raw body / secret |
| acceptance handoff | run reports + open issues | `scripts/reports/generate_acceptance_handoff.sh` | `reports/acceptance/handoff.md` | future 06 owner 补充 final mapping、裁决、风险接受与 signoff |

```text
artifacts/test/<run_id>/
  meta/context.json
  evidence-index.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/cases/<case_id>.json

reports/
  runs/<run_id>/
    summary.md
    evidence-index.md
    gate-results.md
    redaction-check.md
    suites/<suite>.md
    evidence/EV-<TYPE>-<NNN>.md
  acceptance/
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

## 7. 真实性、脱敏与跨证据停审

| 审计项 | 规则 | 结论 |
|---|---|---|
| real artifact origin | 每个实际 EV instance 必须由同一 fixed `run_id` 的 suite artifact/report pair 推导。 | planned；不允许静态映射造证据。 |
| fixed path | raw 仅 `artifacts/test/<run_id>/...`；run report 仅 `reports/runs/<run_id>/...`；handoff 仅 `reports/acceptance/...`。 | planned；禁止 project 子目录和 `latest`。 |
| failed / blocked retention | failed suite 保存 report/stdout/stderr/failure reason；blocked 保留 blocker id，二者不互换。 | planned。 |
| redaction | artifact、stdout/stderr、reports、evidence index 和 acceptance draft 均不得有 raw secret/body/live state/endpoint。 | planned；scan failure 进入 veto gate。 |
| EV uniqueness | EV family 可由多个 TC 共享，但每个 run instance 必须带 suite/path/case mapping。 | planned；无 EV instance。 |
| future 06 boundary | 05 只交接 evidence direction，06 自行确认 final AC/VETO mapping、verdict、risk acceptance、signoff。 | pending；未预造 06 合同。 |

## 8. 改动前后、回填草稿与待确认事项

旧材料使用不稳定目录、旧 EV 族和“报告已完成”措辞；本轮固定路径、统一 `EV-UNIT/SVC/ENTRY/INT/CONFIG/SEC/OBS/GATE/REC/PERF` 规划族，明确任何实例均须由 future artifact/report pair 产生。正式 §13 回填本文件第 3~7 节的收口结论。

最终 evidence kind、artifact digest 算法、报告签名、retention、真实 runner 与未来 06 final mapping 待实施 / policy / acceptance owner 确认；当前不生成其结果或默认值。
