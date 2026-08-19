# L2-runtime 06 验收标准 Step 9：非功能验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 9
> 回填位置：正式 `06-验收标准.md` §9
> 状态：`completed_continuous_authorized`
> 输入：formal 00 NFR-L2R-001~019/VF、formal 03 §§9~15、formal 04 bounds/profiles、formal 05 Step 10/automation gates/registry、Step 8 state/transaction contract
> 事实边界：本 Step 定义 future nonfunctional decision contract；当前没有 workload、benchmark、implementation、environment、run、measurement、artifact、report 或 actual disposition

## 1. 本步目标与阈值 authority

非功能验收只裁决正式 `NFR-L2R-001~019` 和其映射的 AC/VF，不新增性能数字，不把实现缺失或外部正向 seam 缩成“跳过”。NFR-001~003 当前只有测量维度和配置 hard bounds；没有可合法继承的 P95/P99、QPS、capacity、SLA 或生产适用性阈值，因此只能判定 characterization 结构是否完整，不能形成 numeric performance pass。

```text
nfr_pass(NFR) :=
  exact formal NFR and source authority resolves
  AND required method/workload/profile/bound/status fields are present in one fixed run
  AND canonical mapped TC/EV raw/report evidence is eligible
  AND all source-based structural assertions pass
  AND mapped applicable VF is not_triggered
```

```text
nfr_not_evaluable(NFR) :=
  missing fixed workload/threshold/implementation/evidence or blocked external owner
```

`not_evaluable` 不得被写成 pass；对当前无阈值的性能项，`characterization_only` 不是验收通过。命中 VF、结构性硬边界、fail-open、secret/body leak、unknown retry、phase promotion、dependency disguise 或 status fabrication 都是 P0 failure/VETO 方向。

## 2. 非功能裁决流

**图类型：** nonfunctional evidence flow
**图标题：** 结构性门禁与性能 characterization 分流

```text
formal NFR
   |
   +--> structural oracle (state/write/call/fence/redaction/source)
   |          |
   |          +--> fixed raw case + suite report + checks -> eligible / not_evaluable
   |
   +--> performance/budget dimension
              |
              +--> fixed workload/profile + stage samples + bounds
                         |
                         +--> characterization_status only
                              (recorded | invalid | infra_error | blocked_dependency)
```

关键说明：

1. 性能总时长不能替代 local/UoW、external wait、report/observation stage 的分解；所有样本绑定同一 `run_id/case_id/variant_id/config_snapshot_digest`。
2. 固定配置的 context/action/delegation/checkpoint/handoff/page/lease bounds 是可判定的 hard bound；它们不等于容量或 SLA。
3. 外部不可用、等待、降级和 unknown 必须保持正式状态与历史；working-only/no-model 是显式非等价路径。
4. fake、设计文件、ping、Candidate、Bound、ACK、receipt 或 planned EV 均不能关闭 positive qualification 或 readiness blocker。

## 3. NFR-L2R-001~003：性能、等待分解与预算

| NFR | 指标/要求 | 来源与方法 | 结构性通过条件 | 无法通过 / 结论上限 | Canonical TC/EV owner |
|---|---|---|---|---|---|
| NFR-001 | local orchestration/context/decision/checkpoint 不因 report/Observed/SDK 路径无限放大 | `DS-L2R-PLAN-LOOP/CONTEXT-MEMORY/RECOVERY/HANDOFF`，fixed profile，外围 spy on/off | 相同输入的 local stage、call/write identity、bound 不随外围 sink 增加；samples 有 provenance | 缺实现/workload 只能 not_evaluable；无 numeric SLA | `TC-LOOP-001`,`TC-C04-001`,`TC-C12-001`,`TC-C16-001`；EV-420/454/462/466 |
| NFR-002 | 区分 local latency 与 memory/model/tool/handoff wait | finite Port wait scripts；分 stage 计时 | local/UoW/Port-wait/report 各有 stage、clock、dependency posture；Unknown/timeout 保留 | 总时延单值、无 stage provenance 或 provider wait 混入 local => failure；无阈值 numeric verdict | `TC-C06-001`,`TC-CAP07-002`,`TC-CAP12-001`,`TC-OBS-001`；EV-456/409/415/691 |
| NFR-003 | context、child、checkpoint、handoff、job 有预算/限制语义 | exact/exceed boundary corpus；04 snapshot；page/lease fixtures | 配置 hard bound 生效；超界 typed reject/block/HardYield；预算引用 snapshot | 缺 authority 不得生成 capacity verdict；无来源默认值/无限增长 => failure | `TC-C04-001`,`TC-C10-001`,`TC-C12-001`,`TC-J01~07-001`,`TC-CFG03/05/08-001`；mapped registry EV |

### 3.1 性能 characterization 必填字段

| Field | 必须条件 | 缺失影响 |
|---|---|---|
| `run_id/case_id/variant_id` | fixed run、canonical raw case、declared variant | invalid/not_evaluable |
| `workload_manifest_digest` | counts、weights、page、stage、seed immutable | invalid |
| `config_snapshot_ref/digest` | operation/page 捕获的同一快照 | invalid；不能重采样 |
| `dependency_posture` | 每 slot Disabled/Blocked/Candidate + scripted outcome；无 Ready | blocked_dependency 或 invalid |
| `stage_samples` | validation/read/UoW/call-wait/UoW-2/report 分开，unit/clock 明确 | no numeric interpretation |
| `work_counters` | candidate/item/page/call/write/retry 各自记录 | incomplete characterization |
| `semantic_result_ref` | 指向 raw oracle，不改写 status | invalid if absent |
| `characterization_status` | `recorded/invalid/infra_error/blocked_dependency` | 禁止 performance-pass |

## 4. NFR-L2R-004~010：可用性、安全与边界

| NFR | 主题 | 必须通过的结构性 oracle | 失败条件 | Canonical source / AC/VF |
|---|---|---|---|---|
| NFR-004 | unavailable/timeout/late | Waiting/Blocked/Degraded/Unknown/Unavailable 区分；append-only history | 压平状态、覆盖历史、unknown=success | CAP02/CAP09/ERR/OBS；AC008/018/025/035；VF004 |
| NFR-005 | model/memory seam 缺失 | working-only/no-model 明示非等价；只影响适用能力；zero durable/provider readiness | fallback 冒充等价成功或 owner write | SLOT04/07/08,CAP05/06,BOUND002；AC002/003/010/011；VF001/003 |
| NFR-006 | governed/tool/sandbox fail-closed | guard 不全 zero invocation；无 host/direct fallback；blocked fact retained | default allow、direct Sandbox、host route | C09/CAP07/SLOT01/05/06/BOUND004/008；AC015/023/032；VF002 |
| NFR-007 | forbidden material | body/secret/raw provider/tool/Sandbox/Artifact/hidden reasoning absent from truth/checkpoint/event/handoff/report | 任一 carrier leak 或 redaction failure | CFG09/OBS02/SEC01/02/BOUND003；AC013/029/033；VF003 |
| NFR-008 | owner/scope/version/freshness | all required owner views current and unchanged before Allowed | stale/missing/unknown default allow；local approval/registry/isolation truth | CAP07/C09/SLOT01/05/06；AC015/022/023；VF001/002 |
| NFR-009 | child containment | immutable strict-subset scope/context/action/budget/authority；invalid zero child call | superset/mutable shared context/overflow/member fields | CAP08/C10/SLOT09/BOUND005；AC016/027/033；VF001/003 |
| NFR-010 | traceability chain | run/goal/source/turn/action/checkpoint/outcome/handoff refs retain correlation/causation/version | guessed identity/body or broken source chain | CAP01/OBS001/SOURCE/E2E；AC026/027/034；VF008 |

## 5. NFR-L2R-011~019：真值分层、幂等、观测与 status truth

| NFR | 主题 | 必须通过的结构性 oracle | 失败条件 | Canonical source / AC/VF |
|---|---|---|---|---|
| NFR-011 | outcome/attempt/receipt/delivery/Observed/consumption 分层 | downstream ACK/receipt/report 只改变 matching attempt/gap/projection；local outcome/checkpoint/run immutable | phase promotion/reverse write | C15/16/O04/05/BOUND007/TRUTH；AC020/024/036；VF005 |
| NFR-012 | stale/conflict/re-resolution | new fact/decision/gap append with prior refs；old source/turn/history immutable | LWW、in-place rewrite、stale Current | C14/17,CAP09-002,E04,SM15/24；AC019/021/030/035；VF001/005 |
| NFR-013 | duplicate trigger/feedback/checkpoint/resume/handoff | same identity+digest exact replay；collision conflict；Unknown fence/status-only | second irreversible effect/new identity retry | C01~17 variants,UOW/REPLAY；AC034/035；VF004 |
| NFR-014 | duplicate source read/candidate/snapshot/commit | refs/snapshot/use/commit distinct；repeat read no second owner truth/durable write | candidate=commit、snapshot=source body、duplicate truth | C04/05/17,E04,SLOT03/04；AC009/010/021/028；VF001 |
| NFR-015 | late model/tool/child result | quarantine/record-only/one valid apply；new decision/outcome not reverse-written | late overwrite, duplicate apply, mismatch accepted | C07/11,E01/02/03,REPLAY；AC012/015/016/025；VF004/005 |
| NFR-016 | low-sensitivity failure/recovery material | safe refs/phase/disposition/reason/gap/fence present; candidate status retained | no material, raw body, candidate=Observed/evidence | OBS001/003/SOURCE；AC025/030/036；VF003/005 |
| NFR-017 | observation/log/metric/report redaction/cardinality | allow-listed low-cardinality labels; redaction before serialization | secret/body/hidden reasoning/provider/user high-cardinality leak | OBS002/SEC/CFG09；AC013/029/033；VF003 |
| NFR-018 | observation/event handoff failure | attempt/gap/cursor explicit；receipt != delivery/Observed；domain truth unchanged | route failure interpreted as Runtime success/failure | SLOT11/12/13,J07,OBS003,BOUND007；AC020/024/036；VF005 |
| NFR-019 | planned/blocked/not-run/fake status truth | status mapper preserves actual posture; no EV/readiness/pass promotion; only Core compile candidate | static evidence、fake leak、blocked -> ready/pass、sibling package dependency | TRUTH/SOURCE/DEP/BOUND008/CFG15；AC022/032/034/036；VF006/007/008 |

## 6. NFR gate、suite 与 evidence 绑定

| NFR group | Owning suites | Mandatory checks | Future gate behavior | Current ceiling |
|---|---|---|---|---|
| NFR-001~003 performance/bounds | `unit_state`,`service_semantics`,`entry_worker_job`,`config_builder` | source + denominator + status truth | missing stage/bound/source => not_evaluable/invalid；no number invention | characterization only |
| NFR-004~006 availability/dependency | `service_semantics`,`contract_protocol`,`fault_replay_consistency` | status truth + fake leak + pairing | negative local may pass; positive owner lane remains blocked | no owner readiness |
| NFR-007~010 security/traceability | `security_source_boundary`,`config_builder`,`contract_protocol` | forbidden material + dependency + redaction + source | any leak/orphan/fail-open hard failure | no backend qualification |
| NFR-011~015 consistency/phase | `fault_replay_consistency`,`service_semantics`,`entry_worker_job` | denominator + pairing + no-static evidence | any phase promotion/unknown retry hard failure | no physical durability |
| NFR-016~018 observation/audit | `security_source_boundary`,`contract_protocol`,`entry_worker_job` | redaction + pairing + status truth | candidate/gap allowed; delivery/Observed blocked | no Observability readiness |
| NFR-019 global status/dependency | all eight suites/check set | source, denominator, dependency, fake, status, no-static | any planned/fake/blocked promotion hard failure | no positive qualification |

固定 report 路径：`reports/runs/<run_id>/suites/<owning_suite>.md`；EV detail：`reports/runs/<run_id>/evidence/<evidence_id>.md`；原始 case：`artifacts/test/<run_id>/suites/<owning_suite>/cases/<case_id>.json`。NFR 行不会创建第二套 TC/EV identity。

## 7. NFR 停审与跨门禁审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| NFR denominator | 19/19 mapped to source, method, structural oracle and canonical cases | none |
| threshold authority | 001~003 no numeric threshold; 004~019 use formal behavioral contracts | numeric verdict remains absent |
| VF coverage | all eight VF detected by mapped NFR cases/checks | future actual trigger still none |
| external blocker treatment | negative local path may be judged; G2/G3 remains independent blocked lane | no denominator shrink |
| stage/provenance | performance fields require fixed run/config/workload/dependency posture | implementation/workload absent |
| evidence truth | registry/planned EV cannot satisfy NFR; same-run raw/report/checks required | actual evidence none |
| status/phase | characterization, blocked, not_evaluable, pass and veto are not conflated | none |

## 8. 回填草稿与 Step stop-review

Formal §9 应按 NFR-001~003、004~010、011~019 三组装配，保留性能无数值 authority、结构性 hard gate、suite/evidence path、positive qualification ceiling 和 blocker disclosure。不得把 `characterization_only` 写成通过，也不得把外部 owner 缺失写成性能失败或跳过。

```text
step_status = completed_continuous_authorized
nfr_denominator = 19/19
numeric_performance_verdict = none
structural_nfr_gate = defined
actual_measurement_or_evidence = none
positive_qualification = blocked_dependency_not_runnable_13_of_13
current_process_state = not_entered
next_step = Step 10
formal_06_write_allowed = false_until_step_15
```
