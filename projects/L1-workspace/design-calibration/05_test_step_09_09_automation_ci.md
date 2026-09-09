# Step 9. 设计自动化与 CI/CD 门禁

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 9  
> 回填章节：`05-测试方案.md` §9

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / automation_planned_not_implemented |
| 输入 | Step4/6/8；59 TC/EV；9个计划Rust suite；目录/证据规范 |
| 输出 | 13个suite、4个gate、9个planned脚本、artifact/report映射和审计 |
| 执行事实 | 脚本/CI/artifact/report/run_id均不存在；未执行任何门禁 |

## 2. 本步目标与输入

将 P0 用例映射到可重复的自动化 suite、触发阶段、阻断级别和未来机器输出。本文中的脚本路径属于目标实现仓 planned boundary，不在设计仓创建脚本。

| 输入 | 用途 |
|---|---|
| Step4 | 风险发现层与九个Rust suite职责 |
| Step6 | 59 TC/EV、14入口与blocked边界 |
| Step8 | local/test/staging/production语境与环境不可用规则 |
| 03 Step4/16 | member-local自动发现测试入口 |
| 测试书写规范§4.6、目录规范§9 | 固定scripts/artifacts/reports路径 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| PR suite？ | contract、domain、query no-write、maintenance、config/dependency fast；P0失败阻断。 |
| main CI suite？ | PR全部 + infra adapter/composition + API/Worker/Jobs + redaction。 |
| nightly？ | main全部 + expanded fault/race/resource；仍不自动转pass。 |
| staging/release？ | formal-seam-conformance等待正式owner/bus/durable/downstream合同；release要求固定run的P0报告/证据完整性，当前blocked。 |
| flaky/timeout/依赖故障？ | P0不允许以rerun掩盖；首次失败保留。基础设施故障=failed/blocked，不得skip-pass；预期故障注入仅在精确断言匹配时通过。 |
| gate脚本在哪里？ | `scripts/gates/`；check在`scripts/checks/`；report在`scripts/reports/`，全部planned。 |
| 参数？ | gate必须支持`--run-id`、`--artifact-root`、`--config-profile`；release另有`--report-root`。固定run_id必需，禁止latest。 |
| 输出在哪里？ | raw到`artifacts/test/<run_id>/`；人读报告到`reports/runs/<run_id>/`；验收草案到`reports/acceptance/`。 |
| P0不可自动化？ | 没有被接受为“手工即可”的P0；formal seam当前blocked但仍要求未来自动化/受控selected-run。人工只审报告，不替代suite。 |

## 4. 当前材料问题诊断

| 首稿问题 | 风险 | 修正 |
|---|---|---|
| 只有PR/nightly/staging/release四行 | 59 TC无法反查执行面 | 13 suite逐族映射 |
| “脚本尚未创建”但无合同 | 07无法落码 | 固定9个planned脚本参数/输出/失败语义 |
| staging adapter smoke含义不明 | fake/real seam可能混淆 | formal-seam-conformance独立blocked suite |
| report/evidence未配对 | 可静态伪造EV | 强制raw→report→EV索引，增加真实性check |
| release只说全量 | 无业务/安全/证据门禁 | 定义fixed-run aggregate，不用测试计数冒充结论 |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| suite | 主题词 | 13个具名suite |
| gate | 4行触发 | PR/main/nightly/release职责和依赖图 |
| script | 未定 | 3 gate + 3 check + 2 report planned合同 |
| 输出 | 无 | 固定artifact/report目录和最小文件 |
| blocked | 缺slot阻断 | formal seam P0 blocked与P1产品加固分离 |

## 6. 自动化设计取舍

1. 保持03九个member-local test file为真实测试发现入口；suite是gate聚合名，不再发明重复Rust测试文件。
2. config/security/dependency/report检查可由计划脚本聚合，但脚本不能直接写“passed”而不读取真实命令退出码和raw结果。
3. release gate不创建业务truth；只汇总固定run的suite结果，验收裁决仍属于06。
4. 正式 seam conformance是P0完整性的一部分，当前blocked；P1 durable性能/产品加固另列，不能拿P1 unavailable或fake结果填P0 EV。
5. 报告生成失败、redaction失败或artifact缺失本身是阻断失败，不能因为测试命令成功而忽略。

## 7. 结构化中间产物

### 7.1 自动化套件表

| Suite | 覆盖范围/入口 | 执行位置 | 触发 | 级别 | 计划执行入口 | raw/report |
|---|---|---|---|---|---|---|
| contracts-protocol | CONTRACT/PAGE schema | PR/main | contracts变更 | P0阻断 | protocol_boundary.rs | suites/contracts-protocol |
| domain-invariants | 16对象/STATE | PR/main | domain变更 | P0阻断 | local_state_invariants.rs | suites/domain-invariants |
| query-no-write | 6 Query/VIS | PR/main/release | application/query变更 | P0阻断 | query_no_write.rs | suites/query-no-write |
| maintenance-consistency | 2 Command+2 Consumer+4 Operation/TXN/IDEM | PR/main/nightly | application/store合同变更 | P0阻断 | maintenance_consistency.rs | suites/maintenance-consistency |
| infra-adapter-contract | store/cursor/config/fault/resource | main/nightly | infra/config变更 | P0阻断 | adapter_contract.rs | suites/infra-adapter-contract |
| read-model-boundary | composition/dependency/write capability | main/release | wiring/manifest变更 | P0阻断 | read_model_boundary.rs | suites/read-model-boundary |
| api-read-surface | 2 Command+6 Query handler | main | api/contracts变更 | P0阻断 | read_surface.rs | suites/api-read-surface |
| worker-consumer-boundary | 2 Consumer receipt/no ACK/no outbound | main/nightly | worker/source变更 | P0阻断 | consumer_boundary.rs | suites/worker-consumer-boundary |
| jobs-recovery-boundary | 4 Operation/phase/terminal | main/nightly | jobs/recovery变更 | P0阻断 | recovery_boundary.rs | suites/jobs-recovery-boundary |
| config-redaction-check | CONFIG/SEC/RES schema与输出 | PR/main/release | config/observability/report变更 | P0阻断 | checks脚本+既有tests | suites/config-redaction-check |
| dependency-boundary-check | DEP/BOUND静态边界 | PR/main/release | manifest/import/wiring变更 | P0阻断 | check_dependency_boundary.sh | suites/dependency-boundary-check |
| report-integrity-check | raw/report/TC/EV/redaction配对 | nightly/release | 报告生成/送验 | P0阻断 | check_test_outputs.sh | suites/report-integrity-check |
| formal-seam-conformance | owner scope/query/visibility/event/replay/durable/downstream正向 | staging/release | seam版本或release | P0必需/当前blocked | run_formal_seam_gate.sh | suites/formal-seam-conformance |

P1产品/容量加固不占P0 suite：通过`run_selected_hardening_gate.sh`按明确选择执行，当前pending baseline，不作为通过替代。

### 7.2 自动化门禁图：L1-workspace planned pipeline

```text
PR gate
  -> contracts-protocol + domain-invariants
  -> query-no-write + maintenance-consistency
  -> config-redaction-check + dependency-boundary-check
            |
            v
Main gate
  -> PR suites
  -> infra-adapter-contract + read-model-boundary
  -> api-read-surface + worker-consumer-boundary + jobs-recovery-boundary
            |
            v
Nightly gate
  -> Main suites with expanded fault/race/resource matrix
  -> report-integrity-check
            |
            v
Release gate (fixed <run_id>)
  -> selected blocking local suites
  -> formal-seam-conformance [currently BLOCKED]
  -> raw artifact -> reports -> redaction/integrity checks
  -> handoff to 06; no verdict created here
```

关键说明：

- 所有路径绑定明确`<run_id>`；`latest`不得用于正式门禁或证据引用。
- PR/Main/Nightly的本地成功不能关闭formal seam blocker。
- release gate生成测试结果汇总，不生成验收verdict/signoff/readiness。
- failed/blocked suite仍应尽量输出安全的report.json/stdout/stderr与failure reason。

### 7.3 Planned gate/check/report 脚本合同

| 计划脚本（实现仓相对） | 类型 | 必需输入 | 计划输出 | 失败语义 |
|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--gate pr|main|nightly --run-id --artifact-root --config-profile`；可选`--suite` | raw context + selected suite dirs | 任一P0 suite非通过即非0；不自动重跑改pass |
| `scripts/gates/run_release_gate.sh` | gate | `--run-id --artifact-root --report-root --config-profile` | fixed-run gate results +调用checks/reports | blocked/failed/missing均非0；不产验收verdict |
| `scripts/gates/run_formal_seam_gate.sh` | gate | 上述通用参数 + 版本化seam manifest/ref | formal-seam raw results | 缺任一正式seam输出blocked并非0；禁用fake |
| `scripts/gates/run_selected_hardening_gate.sh` | P1 gate | 通用参数 + explicit selected suite/baseline ref | P1 raw result | 不修改P0结果；无baseline为pending/非pass |
| `scripts/checks/check_dependency_boundary.sh` | check | source/dependency metadata、`--artifact-root` | dependency raw report | 非core sibling compile/fake production fallback即非0 |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root --report-root --config-profile` | redaction raw + human report input | forbidden canary/secret/body出现或无法扫描即非0 |
| `scripts/checks/check_test_outputs.sh` | check | `--run-id --artifact-root --report-root` | pairing/truthfulness raw result | 缺context/suite report/TC-EV映射、引用latest或静态pass即非0 |
| `scripts/reports/generate_test_reports.sh` | report | `--run-id --artifact-root --report-root` | `reports/runs/<run_id>/...` | 只从raw生成；缺raw/解析失败非0，不覆写失败状态 |
| `scripts/reports/generate_acceptance_handoff.sh` | report | `--run-id --report-root --acceptance-root` | `reports/acceptance/*`草案 | 只生成草案；必须保留blocked/risk/待人工审查，无signoff |

通用默认：`artifact-root=artifacts/test/<run_id>`、`report-root=reports/runs/<run_id>`、`acceptance-root=reports/acceptance`。`--run-id`不得省略或用`latest`；脚本实现尚不存在。

### 7.4 Artifact 与 report 计划目录

```text
artifacts/test/<run_id>/
  meta/context.json
  evidence-index.json
  suites/<suite>/
    report.json
    stdout.log
    stderr.log
    cases/<TC-ID>.json

reports/runs/<run_id>/
  summary.md
  evidence-index.md
  gate-results.md
  redaction-check.md
  suites/<suite>.md
  evidence/<EV-ID>.md

reports/acceptance/
  handoff.md
  veto-checklist.md
  risk-acceptance.md
  open-issues.md
```

| 输出 | 机器来源 | 最小事实 | 禁止 |
|---|---|---|---|
| meta/context.json | gate invocation | fixed run_id、profile、source revision、suite selection、环境类别 | credential、ready/signoff |
| suite/report.json | runner/check | suite、TC列表、status、failure reason、timing、raw paths | 只有总测试数无case断言；伪造pass |
| cases/TC.json | case runner | TC ID、actual status、assertion outcomes、safe failure | raw业务正文/secret |
| evidence-index.json | 由真实case raw聚合 | EV→TC→suite→raw digest/path | 静态EV声称存在 |
| run reports | report脚本读取raw | 原样保留passed/failed/blocked/not_run | 把blocked省略或改passed |
| acceptance草案 | report脚本+人/Agent审查 | 固定run引用、阻塞/风险/待决 | verdict/signoff/readiness冒充06 |

以上仅是未来输出schema方向；本轮没有创建目录或文件。

### 7.5 Suite 到 CUT / TC / EV 映射

| Suite | CUT / TC范围 | EV槽位 | artifact/report | 门禁 |
|---|---|---|---|---|
| contracts-protocol | CUT-CONTRACT/CURSOR；CONTRACT-*、PAGE-* | 同序EV | suites/contracts-protocol | PR阻断 |
| domain-invariants | CUT-OBJECT/STATE；STATE-*及入口对象断言 | STATE-* +相关入口EV | suites/domain-invariants | PR阻断 |
| query-no-write | CUT-SCOPE-VIS/QUERY；SCOPE/VIS/QRY-* | 同序EV | suites/query-no-write | PR阻断 |
| maintenance-consistency | CUT-COMMAND/SOURCE/RECOVERY/TXN/IDEM；对应TC | 同序EV | suites/maintenance-consistency | PR/main阻断 |
| infra-adapter-contract | CUT-TRANSACTION/CURSOR/CONFIG/RESOURCE；TXN/PAGE/CONFIG/RES | 同序EV | suites/infra-adapter-contract | main阻断 |
| read-model-boundary | CUT-DEPENDENCY/BOUNDARY；DEP/BOUND | 同序EV | suites/read-model-boundary | main/release阻断 |
| api-read-surface | 两Command+六Query主例 | SCOPE-001、LOCAL-001、QRY-001~006 | suites/api-read-surface | main阻断 |
| worker-consumer-boundary | SRC-001~006、INBOX-001~003 | 同序EV | suites/worker-consumer-boundary | main阻断/positive blocked |
| jobs-recovery-boundary | REC-001~006 | 同序EV | suites/jobs-recovery-boundary | main阻断/positive blocked |
| config-redaction-check | CONFIG/SEC/RES | 同序EV | suites/config-redaction-check + redaction-check.md | PR/release阻断 |
| dependency-boundary-check | DEP/BOUND | 同序EV | suites/dependency-boundary-check | PR/release阻断 |
| report-integrity-check | 59 TC/EV raw/report真实性 | 无新增业务EV；产gate检查结果 | suites/report-integrity-check | nightly/release阻断 |
| formal-seam-conformance | SCOPE-001、VIS-001、QRY/SRC/INBOX/REC的blocked positive、durable TXN/PAGE | 对应同序EV，只有真实执行后可填 | suites/formal-seam-conformance | P0 required/current blocked |

一个TC可在低层与入口层重复执行，但一个固定run的EV索引必须指向被选定的权威case result集合，不能用两个冲突状态生成同一EV。Step13再固定优先选择规则。

### 7.6 Flaky、超时、跳过与重跑

| 情况 | 首次状态 | 重跑规则 | 门禁结果 |
|---|---|---|---|
| assertion失败 | failed | 可诊断重跑，但首次raw不可删除；新run_id | 阻断 |
| 非故障注入timeout | failed或infrastructure_failed | 不在同run改写；修复后新run | 阻断 |
| 正式seam/credential缺失 | blocked | 补齐合同/授权后新run | 阻断formal seam/release |
| 预期Unavailable/Blocked注入且断言匹配 | passed（该负例） | 无需重跑 | 只证明负向处理 |
| test被skip/ignored | not_run | 只有明确新run执行后才可改变 | P0视为未满足 |
| flaky疑似 | failed + defect候选 | 禁止N次取一成功；修复/隔离后新run | 阻断 |
| P1 hardening无baseline | pending/not_run | baseline闭合后selected new run | 不影响本地suite，但不替代P0 seam |

### 7.7 Suite/Gate 停审

| Suite/Gate组 | 覆盖清楚 | 路径正确 | raw/report配对 | 失败阻断 | 结论 |
|---|---|---|---|---|---|
| PR suites | 是 | planned gate/check | 是 | 是 | pass_as_design |
| Main entry/infra suites | 是 | 复用9个member-local入口 | 是 | 是 | pass_as_design |
| Nightly expanded | 是 | planned参数化执行 | 是 | 是 | pass_as_design |
| Formal seam | 是 | 独立gate且禁止fake | 是 | blocked非0 | pass_with_blockers |
| Release aggregate | 是 | fixed run/no latest | 是 | 是 | pass_as_design/currently blocked |
| P1 hardening | 是 | 独立不覆盖P0 | 是 | 不改P0 | pass_with_pending_baseline |

### 7.8 跨 suite / 门禁 / 证据审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 59 TC是否映射自动化面 | pass；17族均进入至少一个suite |
| 14入口是否在entry或service suite | pass；2+6+2+4 |
| P0只靠手工项 | none accepted；external为blocked而非手工豁免 |
| suite重叠 | 合理；低层发现+entry映射；EV权威结果选择留Step13 |
| artifact/report根 | pass；固定规范路径，无project中间层 |
| latest引用 | prohibited |
| failed suite输出 | report/stdout/stderr/failure reason计划保留 |
| redaction | raw与report均扫描，扫描失败阻断 |
| 静态造证据 | check_test_outputs禁止；EV必须来自实际case raw |
| formal seam/fake | 完全分离，blocked未伪pass |
| 本轮事实 | scripts/CI/run/artifact/report/evidence均未创建 |

## 8. 对 03/04 的影响判定

九个Rust测试入口来自03；新脚本仅是05/07应实施的验证边界，不增加生产模块/对象/协议/配置。`--config-profile`仅选择04已定义profile，不新增配置键。未发现需回写03/04的缺口。

## 9. 回填草稿

正式§9回填suite表、门禁图、脚本合同、输出路径、suite映射、失败/重跑规则。所有脚本/路径必须标planned；不得出现真实run_id、测试结果、artifact digest、EV文件或release结论。

## 10. 待确认事项与进入下一步条件

- CI vendor、runner命令、脚本实现、raw JSON exact schema、EV权威选择算法交07实施和Step13证据结构。
- formal seam仍受WS-UP/WS-LOCAL阻塞；无新增owning blocker。
- P0自动化面、阻断规则、路径和真实性审计闭合；Step9通过，允许Step10专项测试。
