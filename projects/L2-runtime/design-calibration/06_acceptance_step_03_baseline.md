# L2-runtime 06 验收标准 Step 3：固定验收基线

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 3
> 回填位置：正式 `06-验收标准.md` §3
> 状态：`completed_continuous_authorized`
> 输入：Step 1~2、formal 00~05、05 §7/9/12/13/14
> 事实边界：本 Step 定义 future immutable baseline schema；当前没有 candidate、run、artifact、report、evidence instance 或 acceptance package

## 1. 本步目标与裁决边界

验收基线必须把“验谁、按什么合同验、在哪里验、用哪批数据验、证据来自哪次执行、由谁裁决”固定为同一不可变 tuple。设计文件存在只能证明合同来源可定位，不能替代送验实现、fixed run 或 evidence。

本 Step 不生成真实 revision、build、`run_id`、digest、artifact、report 或 review version；当前所有 execution/acceptance 字段保持 absent，process 保持 `not_entered`。

## 2. SOP 问题回答

| 问题 | 结论 |
|---|---|
| 按哪一版需求和设计验收 | future `design_source_manifest` 必须逐文件绑定 current formal 00~06 的 repository-relative path、content digest、source revision 与 workspace status；不能写“最新版” |
| 按哪版测试方案和结果 | 测试合同固定为 current formal 05 的 37 CUT、177 TC/EV、8 suites、9 checks；实际结果只允许来自一个 fixed run 的 eligible M1~M3 material |
| 送验对象是什么 | 一个明确 target implementation revision/worktree state、Rust toolchain、workspace/build identity；若有 image 只能作为附加 delivery identity，不能替代 source/build |
| 环境、配置、数据和依赖是什么 | environment/profile、04 config snapshot ref/digest、dataset/seed/clock/fault manifests、Core compile ref 和所有适用 external slot contract/adapter/owner refs 都必须固定 |
| 基线如何变更 | 任一 semantic/evidence/reviewer 输入变化使旧 tuple 对新裁决失效；新建 acceptance instance，必要时新建 run，保留 prior link，禁止覆盖或拼接 |
| fixed `run_id` 是什么 | 当前 absent；future runner 分配 nonempty、非 `latest` 的 opaque identity，并与领域 `run_ref` 严格区分 |
| raw/report/handoff 路径 | 分别固定为 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/*`；不得添加 project 嵌套层 |
| 是否有不可接受引用 | `latest`、隐式 branch/head、moving alias、跨 run 合并、静态 EV、无 raw/report pair、无 digest 手写报告、旧路径均拒绝 |

## 3. Immutable acceptance baseline tuple

```text
AcceptanceBaseline = (
  acceptance_instance_id,
  lane_kind,
  candidate_scope_manifest_digest,
  design_source_manifest_digest,
  implementation_revision,
  implementation_workspace_status,
  toolchain_and_build_identity,
  dependency_contract_manifest_digest,
  external_subject_manifest_digest,
  environment_identity,
  runtime_profile,
  config_snapshot_ref,
  config_snapshot_digest,
  dataset_manifest_digest,
  clock_seed_fault_manifest_digest,
  case_and_variant_manifest_digest,
  suite_and_check_manifest_digest,
  blocker_preflight_snapshot_digest,
  execution_run_id,
  artifact_root,
  run_report_root,
  evidence_index_digest,
  defect_snapshot_digest,
  acceptance_review_version,
  acceptance_file_digests,
  reviewer_authority_snapshot_digest
)
```

`baseline_valid` 当且仅当：所有当前 scope 的 required 字段非空且 schema 合法；177 local denominator 或专用 qualification denominator 精确；所有 raw/report/index/check 来自同一 run；所有 acceptance 文件绑定同一 source tuple/review version；不存在 moving alias、cross-run merge、静态 status promotion 或 unresolved integrity conflict。

## 4. Tuple 字段合同

| 字段族 | 必须固定的内容 | 有效性要求 | 缺失/冲突效果 |
|---|---|---|---|
| acceptance identity | `acceptance_instance_id`、`lane_kind=G1_local/G2_candidate/G3_slot/product_release` | identity 唯一且不复用旧结论 | `not_entered` |
| candidate scope | included AC/VF、priority、lane、slot、version/profile/environment、formal exclusions | digest 与 handoff 一致；不得事后缩分母 | `not_entered` 或 rebaseline |
| design source | 00~06 exact path/content digest/source revision/workspace status；适用 standards | 逐文件可复查；dirty/unknown 必须显式且不得冒充 immutable commit | `not_entered` |
| implementation | target repository/ref、revision、workspace status、manifest、Rust edition/toolchain、build identity | 可定位、可重建；当前 planned Rust 不等于已验证 toolchain | `not_entered`;`L2R-IMPL-001` open |
| compile dependency | 仅授权 `L0-core` exact contract/package ref 与 resolved dependency graph | 不含 sibling runtime/event/ref/adapter/fake package | mismatch 触发 dependency VETO |
| external subjects | 13 slot 各自 owner contract/schema、adapter impl、profile、owner implementation/environment refs | G1 允许 blocked snapshot；G2/G3 positive lane 必须 exact real subject | positive lane `not_evaluable` |
| environment/profile | environment class/identity、OS/arch、process surface、isolation namespace、network/clock controls | 不得用泛化 local/test/staging；TestFake 与 non-TestFake 分离 | `not_entered`/invalid execution |
| configuration | 04 snapshot ref/digest、12 root/153 leaves/39 derived、13x5 slots、7x6 jobs、V0~V12 | complete immutable capture；no default/hot/partial/secret | config gate fail or VETO |
| data/fault | dataset IDs/digests、namespace、seed、fixed clock、typed ID queues、fault scripts、expected residue | 每 raw case 可复现且隔离 | evidence ineligible |
| execution manifest | exact 172 raw + 5 aggregate、all required variants、8 suites、9 checks、selector | one raw owner；nonempty；无 filter/skip/ignore | invalid execution |
| blocker/preflight | 12 current rows及 owner fact provenance/status | design/ping/fake/Candidate 不得 close | affected positive lane blocked |
| run/evidence | fixed `run_id`、roots、artifact/report/index/check digests | same-run pairing and redaction clean | `not_decidable` |
| defects | first-failure refs、severity/status、retest lineage、closure refs | 不删除首败，不同 run 不拼 green | exit blocked |
| acceptance review | review version、handoff/VETO/risk/issues digests、review authority snapshot | review addition不改 raw；签署绑定 exact package | 无 verdict/signoff |

## 5. Canonical design/test denominator baseline

| Subject | Exact design denominator | Baseline rule |
|---|---:|---|
| requirements | 20 core FR + 4 peripheral FR；44 BR；19 NFR | peripheral 仅在 rebaselined future scope；核心不可因 seam blocked 缩减 |
| acceptance/VETO | 36 AC；8 VF | AC 是唯一验收主语；VF 必须逐项 disposition |
| test cuts/capabilities | 37 CUT；12 capabilities | manifest 必须双向无孤儿 |
| protocol/jobs | 17 Commands；12 Queries；6 inbound Events；6 outbound Events；7 Jobs | identity、schema、route/surface 分母固定 |
| state subjects | 31 | 拒绝旧 18-state subset；legal/illegal/unknown/concurrency 均在 oracle 范围 |
| dependencies/config | 13 external slots；15 config slices | 每 slot 独立 posture；配置 denominator 使用 04/05 current form |
| local cases/evidence | 172 raw + 5 aggregate = 177 TC；177 planned EV | M0 ID 不是 evidence；aggregate 只派生同 run children |
| suites | `35/32/32/16/25/15/17/5` = 177 | 前 7 个为 raw owning suites，最后 5 为 same-run aggregate count |
| mandatory checks | 9 | source/denominator/dependency/forbidden/fake/status/redaction/pairing/no-static 全部执行 |
| blockers/risks | 12 blocker/preflight；14 residual risks | status 原样冻结；当前无 accepted risk |

## 6. G1/G2/G3 baseline isolation

| Lane | Required tuple specialization | May reuse | Must not reuse/infer |
|---|---|---|---|
| G1 local | exact 177 manifest、TestFake/blocked adapters、local profile、12 blocker snapshot | current formal design identities和 deterministic fixtures | fake/local result不能形成 owner positive qualification |
| G2 named candidate | named seam、real adapter revision、non-TestFake profile、owner contract/schema、independent run | formal local protocol oracle可作为来源 | G1 raw/EV instance、其他 seam 或 whole-product结论 |
| G3 slot qualification | `TC-QUAL-SLOTnn` 专用 rebaseline、owner implementation/version/environment、QUAL EV、authorized reviewer | verified G2 contract parity可作为前置 | `TC-SLOTnn-001`/local SLOT EV 不得冒充 positive proof |
| product/release | G1 + 所有 delivery-mandatory G2/G3 + operational/release package | 各有效子 package 的 immutable refs | 任一 optional pass、目录存在或设计完成不能补 mandatory 缺口 |

每条 lane 使用独立 `execution_run_id` 和 evidence namespace。上层 decision 可以引用下层 immutable package digest，但不得复制、改写、筛选或跨 run 拼接原始结果。

## 7. Fixed artifact/report/acceptance paths

| 入口 | 固定路径 | Authority /用途 | 当前状态 |
|---|---|---|---|
| run context | `artifacts/test/<run_id>/meta/*.json` | source/case/selector/blocker/config/data tuple 的机器记录 | `planned_not_created` |
| raw checks | `artifacts/test/<run_id>/checks/<check_id>.json` | 9 checks 原始结果 | `planned_not_created` |
| raw cases | `artifacts/test/<run_id>/suites/<suite>/cases/<case_id>.json` | case assertion、state/write/call/phase truth | `planned_not_created` |
| raw evidence index | `artifacts/test/<run_id>/evidence-index.json` | M3 derivation 的机器入口 | `planned_not_created` |
| run reports | `reports/runs/<run_id>/...` | summary/gates/suites/redaction/blockers/evidence 人读 projection | `planned_not_created` |
| evidence detail | `reports/runs/<run_id>/evidence/<evidence_id>.md` | EV 到 raw/report/check 的 same-run trace | `planned_not_created` |
| handoff | `reports/acceptance/handoff.md` | candidate/scope/baseline/run 总说明 | `planned_not_created` |
| VETO checklist | `reports/acceptance/veto-checklist.md` | VF001~008 的 review projection | `planned_not_created` |
| risk acceptance | `reports/acceptance/risk-acceptance.md` | eligible residual 的授权记录 | `planned_not_created` |
| open issues | `reports/acceptance/open-issues.md` | blocker/defect/residual projection | `planned_not_created` |
| review notes | `reports/review/{reviewer-notes,agent-review}.md` | review 补充，不改变 raw/EV status | `planned_not_created` |

`reports/acceptance/*` 是固定入口但不是无版本的 moving truth。正式 decision package 必须记录每个文件的 review version 与 content digest；任一内容变化创建新 acceptance instance 或明确 superseding review，旧 package 保持可复查。

## 8. Current actual baseline audit

| Actual field | Current value | Interpretation |
|---|---|---|
| candidate/acceptance instance | absent | 未送验 |
| design immutable revision/digests | absent；current workspace files only | 可用于设计编写，不足以进入验收 |
| implementation revision/build/toolchain result | absent | `L2R-IMPL-001` 未关闭 |
| environment/profile/config/data tuple | absent | 未固定执行环境 |
| external real subjects | absent/open by slot | 13/13 positive qualification 不可运行 |
| fixed `run_id` | absent | 不能引用任何 actual EV |
| artifacts/reports/evidence | none | 177 EV 仍是 M0 planned identity |
| defect/risk/review package | none；14 risks accepted=0 | 不存在 closure/acceptance |
| verdict/signoff/readiness | none/not_bound/not_formed | process=`not_entered` |

缺失实际 tuple 表示尚未进入验收，不表示已经执行后“不通过”。只有未来 candidate 通过进入门禁、绑定 eligible evidence 并由授权 reviewer 裁决后，才允许三值 verdict。

## 9. Baseline change and invalidation matrix

| Change | Required action | Existing material disposition |
|---|---|---|
| AC/VF/scope/priority/owner boundary | 重新校准 00~06 和 05 manifest；新 acceptance instance + full affected run | 旧 package 仅历史，不支撑新 scope |
| 01~04 protocol/state/UoW/config semantics | 更新正式 truth source；重建影响矩阵；新 run | 不允许在 06 私补并沿用旧 evidence |
| implementation revision/worktree/build/toolchain | 默认新 run；仅纯 metadata 需可审计 no-impact approval | 禁止隐式 branch/head 漂移 |
| Core/external contract/schema/adapter/owner subject | 对 affected G1/G2/G3 重新 preflight、contract、replay/qualification | 未闭口 slot 保持 blocked/not_evaluable |
| profile/config snapshot/digest | 新 run，重跑 config/builder 与所有消费 slice | 旧 run 不可跨 digest 复用 |
| dataset/seed/clock/fault/selector/variant | 新 run；重新核对 denominator 与 deterministic reproduction | 禁止 best-of-run 合并 |
| runner/check/report/evidence schema | 新 run 或完整重新派生且由 schema contract 明确允许；默认新 run | 旧 EV eligibility 不能假定 |
| defect fix | 新 `run_id`，targeted + impacted retest；保留 first run | 首败不可删除或覆盖 |
| blocker owner fact | 新 snapshot；positive lane re-entry；必要时新 qualification run | design/ping/fake 不构成 fact change |
| review/risk/signoff authority/content | 新 review version/acceptance instance，重新核对同一 immutable run | 不得修改旧 signed package |

## 10. Historical pollution rejection

| Historical material | Rejection rule |
|---|---|
| 旧 18 state / 109 EV / 12 suite / 4 check | 与 current 31/177/8/9 冲突，不进入 manifest |
| 旧 `TC-CMD/QRY/INE/OUT/JOB-*` 体系 | 不作为 current canonical case registry；必须解析到 formal 05 当前 IDs |
| 旧 suite/report/project-nested paths | 不迁移为当前 fixed roots，不可作为 baseline |
| README/旧 06 的 verdict/risk/readiness wording | 全部 historical；不构成实际 state |
| 静态表、目录、设计文件、planned skeleton | 只能作 design trace，不能升级为 M1~M5 evidence |
| current dirty source | 必须在 future manifest 记录并固定 content digest；不得声称 clean immutable commit |

## 11. 回填草稿与 Step stop-review

Formal §3 应保留：immutable tuple 定义、canonical denominator、G1/G2/G3 isolation、fixed paths、current actual audit 和 change invalidation。正文不得填写虚构示例值，也不得把 `<run_id>` 占位符解释为实际 identity。

| Audit | Result |
|---|---|
| requirements/design/test denominator fixed | yes；20+4/44/19/36/8、37、12、48、31、13、15、177 |
| path contract fixed | yes；raw/run/acceptance/review roots all canonical |
| same-run and digest binding | explicit |
| lane isolation | G1/G2/G3/product separated |
| current actual values | all absent/none/not_entered；no fabricated value |
| historical pollution | explicitly rejected |

```text
step_status = completed_continuous_authorized
baseline_schema = defined
actual_acceptance_baseline = absent
current_process_state = not_entered
next_step = Step 4
formal_06_write_allowed = false_until_step_15
```
