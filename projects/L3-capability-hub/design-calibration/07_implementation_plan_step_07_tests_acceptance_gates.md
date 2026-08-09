# L3-capability-hub 07 实施计划 Step 7：测试与验收门禁

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 7
> 书写规范: `standards/document/实施计划书写规范.md` §3.3~§4.7
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 测试权威: `projects/L3-capability-hub/05-测试方案.md`
> 验收权威: `projects/L3-capability-hub/06-验收标准.md`
> 回填章节: `projects/L3-capability-hub/07-实施计划.md` §7
> 输入: Step 5 `PH-01`~`PH-11`、Step 6 `commit-01-a`~`commit-11-b`
> 创建日期: 2026-07-26
> 当前模式: controlled-reopen / selector-owner + fixed access-review reason repair
> Fixed access-review reason controlled repair: 2026-08-09; `commit-02-a` targeted contracts fixtures now include the exact factory literal/bytes while canonical ownership and all denominators remain unchanged

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 7 嵌入测试与验收门禁 |
| 当前状态 | fixed_reason_controlled_reopen_completed_anchor_pending_2026-08-09 |
| 输入基线 | Step 6 的 11 个 phase、26 个 boundary、批次和 scope；正式 `05/06` |
| canonical denominator | `189 TC / 189 DS / 189 EV`、`638` state pairs、`83` exact flows |
| primary suite | 10 个互斥 suite |
| gate/check/builder | 5 个 gate、9 个 mandatory check、4 个 report builder |
| artifact roots | `artifacts/test/<run_id>/`、`reports/runs/<run_id>/`、`reports/acceptance/`、`reports/review/` |
| implementation status | 目标实现仓已建立；`commit-01-a` 与 `commit-01-b` 已真实提交并完成 handoff；selector/scanner repairs 已有历史设计锚点；`commit-02-a` 的 preserved A1 草稿未提交、未运行 PH-02 gate，当前等待 fixed-reason repair 的真实 commit/tree anchor |
| unresolved upstream blocker | `0`；exact reason ambiguity 已在 active working tree 闭合，正式 `05` 的 189 个 canonical identity 不变 |
| 下一动作 | 只提交 Capability Hub fixed-reason 修复并冻结新的 immutable design baseline；随后重新执行 `commit-02-a` activation/design/worktree review，不得跳过 boundary |

## 2. 本步输入与 SOP 问题回答

| 输入 | 用途 | 当前结论 |
|---|---|---|
| Step 5 phase 表 | 绑定 phase 级测试和验收方向 | 每个 PH 必须有 blocking gate、失败处理和停审 |
| Step 6 boundary 表 | 绑定提交前测试、TC/DS/EV、scope 和 evidence | 每个 boundary 有 primary 或 targeted 测试，不允许无门禁提交 |
| `05-测试方案.md` §3~§15 | canonical cases、数据、环境、suite、check、raw/report/evidence | 189 分母、638 pairs、固定路径和 closed status 不变 |
| `06-验收标准.md` §3~§15 | AC、VF/VETO、evidence、risk、handoff、signoff contract | 实施计划只前置验证和交接，不生成验收 verdict/signoff |
| `代码实施台账与门禁规范.md` | boundary Gate Matrix 和 evidence 字段 | 当前只定义 future execution contract，不填真实证据 |

本步回答：

1. **每个 phase 执行什么？** 由 phase matrix 绑定 suite、canonical selector、structural checks、AC/VETO 方向和 raw/report 输出。
2. **每个 boundary 如何提交前验证？** 由 boundary matrix 绑定 `fmt/check/test/check script`、primary/secondary selector、失败处理和 handoff 条件。
3. **如何避免重复计数？** 每个 canonical TC/DS/EV 只有一个 primary owner；后续 boundary 可以做 targeted regression，但不增加 denominator。
4. **哪些结果可以进入验收？** 只有同一显式 `run_id` 下从 raw artifact 派生、通过 pairing/redaction/no-static 的 evidence instance；设计期合同不能进入验收。
5. **门禁失败如何处理？** P0 compile/test/check/redaction/dependency/report/VETO 失败阻止当前 boundary 和后续 phase；P1 unavailable 记录 `blocked_dependency`，不能转成 pass。
6. **哪些脚本在本轮执行？** 没有。`scripts/gates/*`、`scripts/checks/*`、`scripts/reports/*` 是实现仓 future contract。
7. **是否需要人工审查？** acceptance handoff、VETO、risk、open issues 和 review reports 可由脚本生成草稿，但必须由指定人或 Agent 审查；脚本不能自行签署。

## 3. 当前问题诊断与设计取舍

| 问题 | 风险 | 本 Step 处理 |
|---|---|---|
| Step 6 只有检查种子 | 实现者可能只编译、不留可追溯证据 | 绑定 exact suite、TC/DS/EV、raw/report 和失败处理 |
| 189 身份被多个 boundary 重复执行 | denominator 被重复或遗漏 | 建 primary owner 与 targeted regression 双层登记 |
| 638 state pairs 被 nightly 抽样 | P0 状态缺口无法裁决 | main 必须完整消费 `239 + 98 + 301 = 638`；扩展只增加非 canonical 参数 |
| release smoke 代替完整测试 | 场景数量可能掩盖责任/数据红线 | release 只能汇总 lower-run 和 mandatory checks，不能替代 main |
| report 先于 raw 生成 | 可能静态伪造 passed | 固定 `raw -> suite report -> summary/gate -> evidence index` 顺序 |
| selected external product 不存在 | 把 unavailable 错写成 P0 pass | selected 维持 `blocked_dependency`/`future_pending`，不补偿 P0 |
| 验收文档提前写 verdict | 越过 `06` owner | 只输出 handoff 输入、VETO/risk 草稿和审查责任 |
| `FOUNDATION/BIND/CONFIG/OBS` canonical identity 被分配到只能完成局部结构或协议的早期 boundary | 同一 TC/DS/EV 的正式 `05` 语义与 boundary 实际可验证范围不一致；例如 `FOUNDATION-002` 被错误映射为 contract codec，而正式 `05` 要求 43 个 domain object 和 24 个 state family | 保持正式 `05` identity、DS 和 EV 不变；早期 boundary 只运行不计分母的 targeted verification；18 FOUNDATION、12 BIND、18 CONFIG 和 12 OBS 共 60 个完整 canonical identity 统一由 `commit-11-a` 承担 full-main denominator/evidence assembly，semantic source/oracle 仍归正式 `03/04/05/06` 与对应业务 boundary |

### 3.1 设计取舍

| 方案 | 结论 | 原因 |
|---|---|---|
| 一个全仓 mega-suite | 不采用 | primary ownership、失败定位和证据归属不可审计 |
| 每个 TC 单独脚本 | 不采用 | 重复环境装配，无法维护 shared gate contract |
| 10 个 owner-aligned primary suite | 采用 | 与 `05` 完全对齐，保持 189 identity 唯一 |
| 每个 boundary 都创建新的 EV 编号 | 不采用 | EV 是 canonical contract，不是 commit 次数 |
| targeted regression 不计 primary denominator | 采用 | 允许跨 boundary 回归而不改变分母 |
| release 仅执行代表性 smoke | 采用但受限 | 必须同时验证完整 lower-run、9 checks、pairing 和 VETO 输入 |

## 4. 状态、路径与证据真实性规则

### 4.1 设计期与执行期状态

| 状态 | 含义 | 当前是否存在 |
|---|---|---|
| `pass-designed` | 设计合同完整且静态审计通过 | 仅用于本中间产物的设计结论 |
| `future_pending` | 未来实现/环境/执行事实尚未建立 | 是 |
| `pass` | 真实 gate 已通过且有执行证据 | 否，不得预填 |
| `failed` | raw 执行结果失败 | 当前不存在 |
| `blocked_dependency` | 真实依赖按合同不可用 | 当前不存在；目标仓 prerequisite 不是测试结果 |
| `invalid_artifact` | raw/report/pairing/provenance 不合法 | 当前不存在 |
| `not_evaluated` | 没有有效执行或裁决 | 设计期 AC/VF/evidence 使用 |

禁止把 `planned`、`用户同意`、`代码存在`、`报告存在`、`count=189` 或静态 JSON 映射成 `pass`。

### 4.2 固定路径和生成顺序

```text
gate/test/check runner
  -> artifacts/test/<run_id>/raw
  -> reports/runs/<run_id>/suites/<suite-id>.md
  -> reports/runs/<run_id>/summary.md + gate-summary.md
  -> reports/runs/<run_id>/redaction-check.md + dependency-boundary.md + report-audit.md
  -> reports/runs/<run_id>/evidence-index.md
  -> reports/acceptance/* and reports/review/* drafts
```

关键规则：

- 所有 gate 必须接收显式 `--run-id`；artifact/report root 必须属于同一 run。
- 禁止 `latest`、项目嵌套 root、跨 run 拼接、覆盖 failed raw 或手工补 passed row。
- report 只能投影 raw；不能从计数、日志摘要或人工编辑推断 pass。
- 失败、超时、flaky、blocked、invalid、cancelled 的 raw 必须保留，retry 使用新 attempt/run。
- `reports/acceptance/*` 和 `reports/review/*` 必须显式列出引用的 run ID，并与验收/审查责任分离。

### 4.3 Gate 编号与统一处理

| Gate | 名称 | 最低输入 | 失败处理 |
|---|---|---|---|
| `GATE-01` | Workspace / dependency / Rustdoc | manifest、source、toolchain | 阻止当前 boundary；回到 PH-01 或设计 blocker |
| `GATE-02` | Contract / domain / state | public contract、state registry、pure tests | 阻止提交；字段/状态冲突回写 `03` |
| `GATE-03` | Service / query / entry behavior | targeted TC/DS、typed oracle、call order | 阻止提交；不允许以日志/计数代替 |
| `GATE-04` | Transaction / replay / no-write | TX、idempotency、receipt/capture/job raw | 阻止当前 boundary；修复或 `wait_design` |
| `GATE-05` | Configuration / binding / redaction | profile、binding、safe fixture | blocking failure；不得 silent fallback |
| `GATE-06` | Artifact / report provenance | raw、digest、pairing、builder status | `invalid_artifact`；不得手工补报告 |
| `GATE-07` | Responsibility / dependency redline | source/import/protocol scan | VETO；不得风险接受 |
| `GATE-08` | Acceptance functional/redline | AC/VF/VETO selector and evidence direction | 不进入下阶段；由 `06` 负责最终裁决 |
| `GATE-09` | Release / handoff review | complete lower runs、9 checks、review draft | 不得送验；补齐或保持 `not_decided` |

## 5. Canonical suite 与 gate topology

### 5.1 Primary suite partition

| Suite | Primary TC owner | Count | 主要 boundary | 主环境 | P0 属性 |
|---|---|---:|---|---|---|
| `SUITE-CH-STATIC-CONTRACT-DOCS` | FOUNDATION-001,008~011,013~015 | 8 | `11-a` canonical primary/evidence assembly；`01-a`,`02-a` targeted inputs；semantic source/oracle remains formal `03/04/05/06` | CI static | blocking |
| `SUITE-CH-DOMAIN-STATE` | FOUNDATION-002,012; STATE-001~024 | 26 | `11-a` canonical primary/evidence assembly for FOUNDATION；`02-b` owns STATE；semantic source/oracle remains formal `03/05` and the domain boundary | deterministic | blocking |
| `SUITE-CH-SERVICE-COMMAND-QUERY` | FOUNDATION-003; CMD-001~026; QUERY-001~033 | 60 | `11-a` canonical primary/evidence assembly for FOUNDATION；`03-c`~`08-c` own CMD/QUERY semantics | deterministic | blocking |
| `SUITE-CH-ENTRY-INBOUND` | FOUNDATION-005~006; INBOUND-001~006 | 8 | `11-a` canonical primary/evidence assembly for FOUNDATION；`09-a` owns INBOUND semantics | controlled integration | blocking |
| `SUITE-CH-OUTBOUND-COLLABORATION` | OUTBOUND-001~010 | 10 | `09-b` | recovery controlled | blocking |
| `SUITE-CH-JOBS-LIFECYCLE` | FOUNDATION-007; JOB-001~008 | 9 | `11-a` canonical primary/evidence assembly for FOUNDATION；`10-b`,`10-c` own JOB semantics | recovery controlled | blocking |
| `SUITE-CH-REPOSITORY-TRANSACTION` | FOUNDATION-004,016,018; TX-001~022 | 25 | `11-a` canonical primary/evidence assembly for FOUNDATION；`02-c` owns TX semantics | CI/recovery | blocking |
| `SUITE-CH-RUNTIME-BINDING` | FOUNDATION-017; BIND-001~012 | 13 | `11-a` canonical primary/evidence assembly；adapter/entry boundaries targeted；semantic source/oracle remains formal `04/05` and binding owners | controlled integration | blocking |
| `SUITE-CH-OBSERVABILITY-REDACTION` | OBS-001~012 | 12 | `11-a` primary；`07-a`,`09-a`,`09-b` targeted | CI/integration | blocking |
| `SUITE-CH-CONFIGURATION-STRICT` | CONFIG-001~018 | 18 | `11-a` canonical primary/evidence assembly；`01-b`,`04-b`,`06-b`,`09-a`,`10-*` targeted；semantic source/oracle remains formal `04/05` and config owners | CI/integration/recovery | blocking |
| **Total** | **all canonical TC** | **189** | **26 boundary plan** | **P0 main** | **missing=0; duplicate primary=0** |

The suite partition is a design contract from `05`; it does not assert that any suite exists or has run.

### 5.2 Gate scripts and check scripts

| Script | Required arguments | Primary use | Raw/report contract | Blocking rule |
|---|---|---|---|---|
| `scripts/gates/run_pr_gate.sh` | `--run-id --artifact-root --config-profile` | four fast suites and applicable checks | same-run raw under `artifacts/test/<run_id>` | missing/fail/timeout/nonzero blocks PR |
| `scripts/gates/run_main_gate.sh` | common args plus `--entry` where needed | all 10 suites, 189 TC, 638 pairs | complete main manifest | missing/duplicate/fail/flaky/invalid blocks |
| `scripts/gates/run_nightly_gate.sh` | main args plus expansion manifest | full denominator plus race/crash/property expansion | new attempt records; no overwrite | expansion failure stays non-pass |
| `scripts/gates/run_selected_integration_gate.sh` | common args plus selected config ref | selected durable/external parity | selected raw distinct from P0 | unavailable = `blocked_dependency`, no P0 pass |
| `scripts/gates/run_release_gate.sh` | explicit run/artifact/report roots and lower-run refs | smoke, checks, report builders, handoff | same-run report/evidence candidate | any unresolved cell blocks handoff |
| `scripts/checks/check_case_manifest.sh` | canonical manifest + suite raw | primary owner exactness | check raw | 189/189 and duplicate=0 |
| `scripts/checks/check_state_pair_registry.sh` | state registry + pair raw | full state identity | check raw | exact 638; sampling blocks |
| `scripts/checks/check_dependency_boundary.sh` | Cargo metadata/import graph | owner/dependency redline | check raw | non-core compile edge blocks |
| `scripts/checks/check_rustdoc_coverage.sh` | public Rust source | declaration/field/variant/trait/callable docs | check raw | any missing `///` blocks |
| `scripts/checks/check_config_catalog.sh` | schema/profile/binding inventory | exact config cardinality | check raw | drift/missing/duplicate blocks |
| `scripts/checks/check_responsibility_boundary.sh` | source/import/protocol scan | forbidden owner detection | check raw | any responsibility leakage blocks |
| `scripts/checks/check_redaction.sh` | same-run artifacts/reports/log refs | forbidden body/secret scan | check raw | finding blocks; finding cannot echo body |
| `scripts/checks/check_artifact_report_pairing.sh` | explicit roots | same-run digest/linkage | check raw | orphan/cross-run/digest mismatch blocks |
| `scripts/checks/check_no_static_evidence.sh` | builder provenance and reports | static pass detection | check raw | hand-authored pass map blocks |

### 5.3 Report builder 契约

报告脚本是实现仓的交付物，不是本轮已经存在的执行结果。四个 builder 必须只读取显式 `--run-id` 对应的 raw artifact 和上游 report；任何 builder 都不得接受 `latest`、隐式当前目录或人工 status map。builder 的退出码、输出路径和输入 digest 必须写入同一 run 的 raw builder record，失败时保留失败 record，不覆盖前一次 attempt。

#### 5.3.1 统一 raw / report 字段

| 层 | 必填字段 | 约束 | 缺失或冲突处理 |
|---|---|---|---|
| run manifest | `run_id`、`attempt_id`、`gate_kind`、`config_profile`、`design_baseline`、`case_manifest_digest`、`state_pair_registry_digest`、`started_at`、`finished_at` | `run_id` 由调用方显式传入；baseline 和 manifest 在执行前冻结 | runner 退出非零并生成 `invalid_artifact` raw |
| case raw | `case_id`、`data_id`、`evidence_contract_id`、`owner_boundary`、`selector_kind`、`status`、`oracle_class`、`safe_failure_class`、`artifact_path` | `TC-CH-* -> DS-CH-* -> EV-CH-*` 必须同 owner；正文和秘密不得写入 | 缺一项即 case invalid，不能由 report 推断 |
| pair raw | `pair_id`、`family_id`、`classification`、`source_registry_digest`、`status`、`safe_reason` | 638 对必须逐一出现；classification 只能是 `current/reserved/illegal` | 缺失、重复或未知分类阻断 `GATE-02` |
| check raw | `check_id`、`input_paths`、`input_digests`、`status`、`finding_count`、`safe_finding_refs` | finding 只含 location/class/code，不回显 body、secret 或完整 ref | finding 不可安全裁剪时直接 `failed` |
| builder raw | `builder_id`、`source_paths`、`source_digests`、`output_paths`、`output_digests`、`exit_code`、`status` | 输出必须能反向定位到同一 run 的输入 | 任一 digest 或 path 不匹配为 `invalid_artifact` |
| report row | raw reference、status、reason、owner、run_id、artifact/report digest | 只能投影 raw，不创建新 case 或新证据身份 | 无 raw reference 的 row 禁止写入 |

结构化输出中的任何 Rust public type、struct、field、enum variant、struct-like payload、trait、method 或 callable，未来实现时必须按永久门禁写完整英文 `///`。报告 schema 也必须有对应的 typed contract 和字段注释，不能用未说明的开放 JSON map 规避结构体字段注释要求。

#### 5.3.2 Builder 表

| Builder | 必填参数 | 读取范围 | 固定输出 | 生成职责 | 禁止行为 / 失败处理 |
|---|---|---|---|---|---|
| `scripts/reports/generate_suite_reports.sh` | `--run-id --artifact-root --report-root --suite-manifest` | 当前 run 的 suite raw、case raw、check raw | `reports/runs/<run_id>/suites/<suite-id>.md`，并写 builder raw | 为每个声明执行的 suite 生成逐 case、summary、failure、digest 和 owner 视图 | 不得补 case、合并跨 run、把 missing 转 passed；输入缺失则失败 |
| `scripts/reports/build_run_summary.sh` | `--run-id --artifact-root --report-root --suite-report-root --check-root` | 当前 run 所有 suite/check report 和 raw | `summary.md`、`run-summary.json`（machine projection） | 聚合 suite/check 状态、189 primary coverage、638 pair coverage、失败分类 | 不得只用 count 推断覆盖；任一 primary duplicate/missing 保持 non-pass |
| `scripts/reports/build_gate_summary.sh` | `--run-id --artifact-root --report-root --run-summary --gate-manifest` | 当前 run summary、9 check raw/report、gate inputs | `gate-summary.md`、`gate-summary.json` | 按 GATE-01~09 计算 blocking 状态、next action 和 safe findings | 不得删除 failed attempt、接受未审查 VETO 或以 selected run 补偿 P0 |
| `scripts/reports/build_evidence_candidate_index.sh` | `--run-id --artifact-root --report-root --run-summary --gate-summary --evidence-manifest` | 同 run case/data/evidence raw、suite/gate/check reports | `evidence-index.md`、`evidence-index.json`、`evidence/EV-CH-*.md` candidate pages | 生成 189 个 EV candidate 的来源链、状态和待审查标志 | candidate 不是验收 evidence；无 raw、跨 run、redaction/pairing/no-static 未通过时不得标 `eligible` |

#### 5.3.3 状态推导和审查责任

| 输入条件 | Builder 输出状态 | 是否可进入验收交接 |
|---|---|---|
| raw、report、digest、pairing、redaction、dependency、no-static 全部同 run 且通过 | `candidate_ready`；最终 evidence 仍待审查 | 只能作为 `06` 的候选输入 |
| raw 有失败、超时、flaky、cancelled 或 missing case | `failed` 或 `incomplete` | 否 |
| 外部 selected 依赖按声明不可用 | `blocked_dependency` | 只记录 selected residual，不补 P0 |
| builder 输入跨 run、digest 不匹配、路径非法 | `invalid_artifact` | 否，必须修复 generator/runner |
| 没有执行 raw，只有 manifest、模板或计数 | `not_evaluated` | 否 |
| acceptance/review 文档尚未授权审查 | `pending_review` | 否 |

脚本可以生成 `reports/acceptance/handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md` 的草稿输入，但本 Step 不把这些文件视为 builder 的正式产物。任何最终 `通过`、`有条件通过`、`不通过`、risk acceptance 或 signoff 必须由 `06` 规定的责任域在真实执行期产生，脚本不得代签。

### 5.4 Phase gate matrix

下表的 `primary` 是该 phase 负责的 canonical denominator/evidence owner；`targeted` 允许用于依赖回归，但不增加 189/189/189 分母。对 `FOUNDATION/BIND/CONFIG/OBS`，`commit-11-a` 只负责 full-main primary assembly、same-run provenance 和 candidate-index construction；semantic producer/oracle 仍由正式 `03/04/05/06` 与对应 domain/application/config/entry boundary 提供，不实现 domain object、state family、Port、业务流程或其他业务真相。每一行的 TC、DS、EV 采用同一 family 和 ordinal，不能只登记其中一类。所有路径中的 `<run_id>` 都必须是调用时显式提供的真实值；本轮只定义模板，不填值。

| Phase | Primary selector（TC / DS / EV） | Targeted selector | AC / VF / VETO 前置关联 | 执行命令契约 | raw artifact | report | 失败处理 |
|---|---|---|---|---|---|---|---|
| `PH-01` | 无新增 primary | `FOUNDATION-001,008..011,013..015,017`; `CONFIG-001..018`; `BIND-001..012` 的 workspace、Rustdoc、config、binding 和 path probes | `AC-CH-023/026/032/035/037`; `VF-CH-012/013`; `VETO-CH-012/013`; `VETO-CH-P-006/007` | `cargo fmt --check`; `cargo check --workspace`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --config-profile <profile>`；9 checks 中 dependency、Rustdoc、config、responsibility | `artifacts/test/<run_id>/suites/static-contract-docs/`、`runtime-binding/`、`configuration-strict/`、`checks/` | targeted suite reports、`dependency-boundary.md`、`report-audit.md`（dry-run）；不得生成 canonical TC/DS/EV raw | workspace、path、命名、Rustdoc、配置或 dependency 失败时不得进入 PH-02；目标仓缺失保持 prerequisite blocker |
| `PH-02` | `STATE-001..024`; `TX-001..022` | `FOUNDATION-002..004,012,016,018` 及受影响的 contract/domain/service slices | `AC-CH-001..005,023,025,029,030`; `VF-CH-001,009,010`; `VETO-CH-001,009,010` | `run_pr_gate.sh` 的 contract/domain/repository slices；`check_case_manifest.sh` targeted；`check_state_pair_registry.sh` 必须验证全量 registry | `suites/domain-state/`、`suites/repository-transaction/`、`checks/state-pair/` | STATE/TX primary reports、FOUNDATION targeted reports、state-pair report | 字段/DTO/state/TX/UoW/idempotency 不闭合时回写 `03`，不提交任何 PH-02 boundary |
| `PH-03` | `CMD-001..008` | `QUERY-001..006`; `STATE-001..003`; `TX-001..006`; `FOUNDATION-002/003/004/012/016/018` | `AC-CH-001/002/006..011,023,025,029`; `VF-CH-001..003,010`; `VETO-CH-001..003,010` | `run_pr_gate.sh` service/domain/repository targeted；`cargo test --workspace <targeted selector>` 的命令形态由实现仓测试布局固定；case manifest 必须核 owner | `suites/service-command-query/identity-registry/`、`suites/domain-state/`、`suites/repository-transaction/` | identity/registry suite reports、run summary fragment | accepted mutation、current/history、duplicate、winner 或 no-write 失败则停在 PH-03，回写 `03` owning flow/state/TX |
| `PH-04` | `CMD-009..012` | `QUERY-007..011`; `STATE-004..006`; `BIND-001..012` adapter rows；`FOUNDATION-017`；配置 strict、redaction affected rows | `AC-CH-003,012..014,031..032,035`; `VF-CH-004,011,012`; `VETO-CH-004,011,012`; `VETO-CH-P-005/007` | service/domain targeted gate；`check_config_catalog.sh`；`check_redaction.sh --run-id <run_id>`；dependency check | `suites/service-command-query/descriptor/`、`suites/runtime-binding/`、`checks/redaction/` | descriptor suite、redaction、config report | secret/body/provider route/quota/cost/runtime truth 或 silent fallback 直接 VETO；不得风险接受 |
| `PH-05` | `CMD-013..017` | `QUERY-012..014`; `INBOUND-001..002`; `STATE-007..008`; `FOUNDATION-003/005/006`；redaction/responsibility affected rows | `AC-CH-004,015..017,027,031..032`; `VF-CH-005/006/011`; `VETO-CH-005/006/011`; `VETO-CH-P-005/008` | service/domain gate；inbound header-first and receipt targeted；redaction/responsibility checks | `suites/service-command-query/governance-relation/`、`suites/entry-inbound/`、`checks/` | relation/inbound/redaction reports | approval/Policy truth、method body/source、reverse write 或 body leak 失败时回写 `03` / owner seam，阻断后续 |
| `PH-06` | `CMD-018..021` | `QUERY-015..019`; `STATE-009..014`; `BIND-001..012` exposure rows；`JOB-002` read/material input | `AC-CH-005,014,019,020,028..030,033..037`; `VF-CH-007/008/009`; `VETO-CH-007/008`; `VETO-CH-P-008/009` | service/query targeted gate；no-write assertion；runtime-binding/config checks；case manifest | `suites/service-command-query/exposure/`、`suites/domain-state/exposure/`、`suites/runtime-binding/` | exposure/query targeted reports | unresolved/draft/ungoverned exposure、runtime decision、SDK client/cache or query repair blocks PH-06 |
| `PH-07` | `CMD-022..026` | `QUERY-020..023,029..033`; `INBOUND-003..006`; `STATE-011..014,018..023`; `TX-017..022`; `FOUNDATION-016/018` | `AC-CH-018,021,025,029..032,036`; `VF-CH-009/011/012`; `VETO-CH-009,011,012`; `VETO-CH-P-005/006/009` | repository/transaction + entry/inbound targeted；redaction；dependency/responsibility; full ref registry check | `suites/service-command-query/trace-reference/`、`suites/entry-inbound/`、`suites/repository-transaction/`、`checks/` | trace/reference/capture reports | source/version/trace/capture symmetry、typed ref kind或 no-body failure 回写 `03`，不进入 PH-08/09 |
| `PH-08` | `QUERY-001..033` | `FOUNDATION-003,017`; `STATE-009..024` read/material rows；all prior mutation regressions | `AC-CH-005,009..011,014,018..020,022,028,030,033..037`; `VF-CH-007/008/009`; `VETO-CH-003,007,008,009`; `VETO-CH-P-008` | `run_main_gate.sh` query selector；`check_case_manifest.sh`；query no-write check；config/redaction targeted | `suites/service-command-query/query/`、`suites/observability-redaction/`、`checks/` | query suite reports、run summary | 任一 Query 写入、修复、隐式刷新或可见性泄露阻断 PH-08；不得用 job/report 补偿 |
| `PH-09` | `INBOUND-001..006`; `OUTBOUND-001..010` | `FOUNDATION-005..006`; `TX-017..020`; `BIND-001..012` entry rows；`CMD/QUERY` source symmetry and worker lifecycle regressions | `AC-CH-004/005,018,021,024..028,034..037`; `VF-CH-007/009/010/011`; `VETO-CH-007,009,010,011`; `VETO-CH-P-004/005/008/009` | `run_main_gate.sh --entry inbound,outbound`；entry/outbound suites；redaction、pairing、dependency checks | `suites/entry-inbound/`、`suites/outbound-collaboration/`、`suites/runtime-binding/`、`checks/` | inbound/outbound primary reports、FOUNDATION targeted reports、capture/pairing reports | header/order/receipt/capture/snapshot/A-B-C/replay failure blocks; external unavailable remains typed, never success |
| `PH-10` | `JOB-001..008` | `FOUNDATION-007`; `TX-021..022`; `STATE-015..024`; query/material/outbound regressions | `AC-CH-011,018,021,022,024,028,030,033..037`; `VF-CH-007/009/010`; `VETO-CH-007,009,010`; `VETO-CH-P-008/009` | `run_main_gate.sh --entry jobs`; jobs lifecycle and repository-transaction suites；state-pair registry；config strict | `suites/jobs-lifecycle/`、`suites/repository-transaction/jobs/`、`suites/configuration-strict/`、`checks/` | JOB primary reports、FOUNDATION targeted report、replay/recovery reports | duplicate re-execution、current truth repair、unsafe retry、missing stored report或 terminal mismatch blocks PH-10 |
| `PH-11` | `FOUNDATION-001..018`; `BIND-001..012`; `CONFIG-001..018`; `OBS-001..012` | remaining 129 canonical identities、all 638 pairs、all 9 checks、selected integration/release smoke | `AC-CH-001..037`; `VF-CH-001..013`; `VETO-CH-001..013`; `VETO-CH-P-001..010` | `run_main_gate.sh --run-id <run_id> --artifact-root <root>` 完整执行 189 denominator；四 builders；9 checks；`run_release_gate.sh --run-id <release_run_id> --artifact-root <root> --report-root <root>` 和 manual review entry 由 `11-b` 承担 | `artifacts/test/<run_id>/raw/` plus all suite/check roots | `reports/runs/<run_id>/summary.md`、`gate-summary.md`、`evidence-index.md`；`reports/acceptance/*`、`reports/review/*` 仍由 `11-b` 生成 drafts | missing/duplicate/failed/invalid/redaction/dependency/report/VETO/review gap keeps `not_decided` or `不通过`; no automatic conditional pass |

阶段门禁的“通过”在本 Step 只表示设计合同完整（`pass-designed`），不表示未来命令已经执行。`PH-11` 的 release gate 只能聚合已经存在且 provenance 完整的 lower-run；不能以一次 smoke、人工计数、selected product、nightly expansion 或空模板替代 main denominator。

### 5.5 Commit boundary gate matrix（01-a 至 06-b）

`primary selector` 是该 boundary 对 189 个 canonical identity 的唯一 owner；`targeted selector` 是允许重复执行的回归集合，不改变 denominator。selector shorthand 必须按下表展开，不能把 DS family 猜成 TC family：

```text
FOUNDATION-n -> TC-CH-FOUNDATION-n / DS-CH-FOUNDATION-n / EV-CH-FOUNDATION-n
CMD-n        -> TC-CH-CMD-n        / DS-CH-FLOW-C-n     / EV-CH-CMD-n
QUERY-n      -> TC-CH-QUERY-n      / DS-CH-FLOW-Q-n     / EV-CH-QUERY-n
INBOUND-n    -> TC-CH-INBOUND-n    / DS-CH-FLOW-I-n     / EV-CH-INBOUND-n
OUTBOUND-n   -> TC-CH-OUTBOUND-n   / DS-CH-FLOW-O-n     / EV-CH-OUTBOUND-n
JOB-n        -> TC-CH-JOB-n        / DS-CH-FLOW-J-n     / EV-CH-JOB-n
STATE/TX/BIND/OBS/CONFIG-n -> matching TC/DS/EV family and ordinal
```

每个 boundary 的实现 agent 还必须执行 `check_rustdoc_coverage.sh` 的适用切片：public declaration、struct field、enum variant、struct-like variant payload field、public trait、method 和 callable 均缺英文 `///` 时不得提交。

| Boundary | Primary selector（TC / DS / EV） | Targeted selector | 提交前命令契约 | Gate set | Raw artifact / report | Evidence contract | AC / VF / VETO | 失败回流 |
|---|---|---|---|---|---|---|---|---|
| `commit-01-a` | 无新增 primary；相关 canonical assembly owner 为 `commit-11-a` | `FOUNDATION-001,008..011,013..015` 的 workspace manifest、所有 public skeleton、dependency probe | `cargo fmt --check`; `cargo check --workspace`; `git diff --check`; `check_dependency_boundary.sh --scope workspace`; `check_rustdoc_coverage.sh --scope public-skeleton` | `GATE-01`,`GATE-07` | targeted `suites/static-contract-docs/`、`checks/dependency-boundary/`; targeted suite/dependency reports | raw 只记录 source path、member、declaration kind 和 Rustdoc status；不得生成 canonical TC/DS/EV raw 或业务 EV | `AC-CH-023/026/032/035`; `VF-CH-012/013`; `VETO-CH-012/013` | 命名、workspace、compile edge 或注释缺口：`fix_gate_failure`；设计 source 不闭合：`wait_design` |
| `commit-01-b` | 无新增 primary；相关 canonical assembly owner 为 `commit-11-a` | `FOUNDATION-017`; `BIND-001..012`; `CONFIG-001..018` 的 config profile/parser skeleton、script CLI/path fixtures | `cargo fmt --check`; `cargo check --workspace`; `git diff --check`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --config-profile <profile> --suite runtime-binding,configuration-strict --targeted`; `check_config_catalog.sh`; `check_no_static_evidence.sh --scope scripts` | `GATE-01`,`GATE-05`,`GATE-06`,`GATE-07` | targeted `suites/runtime-binding/`、`suites/configuration-strict/`、`checks/config/`; targeted reports | raw 只记录 schema/profile/key class、path class 和 script exit；不得生成 canonical TC/DS/EV raw、真实 evidence 或 passed map | `AC-CH-026,032,035,037`; `VF-CH-012/013`; `VETO-CH-012/013`; `VETO-CH-P-003/006/007` | strict parse、path、profile、static evidence 或 dependency 失败：不提交；配置设计冲突回写 `04` |
| `commit-02-a` | 无新增 primary；相关 FOUNDATION canonical assembly owner 为 `commit-11-a` | public refs、metadata、errors、codec、nested type fixtures；`access-review-reason-v1-*` exact factory/literal/59-byte targeted fixtures | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- contract-foundation`; `check_rustdoc_coverage.sh --scope contracts`; targeted fixture inventory check（不得以 `FOUNDATION-002` 作为 contract codec identity） | `GATE-01`,`GATE-02` | targeted `suites/static-contract-docs/`; contract-foundation fixture report；不得声明 `domain-state` report | refs/metadata/errors/codec/fixed-reason fixtures 仅形成 boundary-targeted raw；固定 reason 断言 exact bytes、audited-static ownership 和 compatibility；不创建 `TC/DS/EV-CH-FOUNDATION-002` chain 或任何 canonical EV | `AC-CH-001,023,029,031`; `VF-CH-001,002,011`; `VETO-CH-001,002,011` | 字段/ref/codec/reason bytes/Rustdoc 不闭合：`wait_design` 并回写 `03`；测试失败：修复后用新 attempt 重跑 |
| `commit-02-b` | `STATE-001..024` | `FOUNDATION-002,012`；domain policy、state guard、all 638 pair registry consumers | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- domain-state`; `check_case_manifest.sh --selector STATE-001..024`; `check_state_pair_registry.sh --scope state`; `check_rustdoc_coverage.sh --scope domain` | `GATE-01`,`GATE-02`,`GATE-07` | `suites/domain-state/`、`checks/state-pair/`; STATE primary report and FOUNDATION targeted rows | 24 STATE chains与638个 `SP-CH-*` raw必须完整满足 `239 current + 98 reserved + 301 illegal = 638`；FOUNDATION rows只作 targeted，不增加分母 | `AC-CH-001..005,023,025,029,030`; `VF-CH-001,008,010`; `VETO-CH-001,008,010`; `VETO-CH-P-001` | 任一 pair 缺失/重复/误分类、非法 transition 或 field doc 缺失：阻断并回写 `03` |
| `commit-02-c` | `TX-001..022` | `FOUNDATION-003,004,016,018`；Port/repository method parity、UoW、idempotency、stored result、fake parity | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- application-transaction`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite repository-transaction --selector TX-001..022`; `check_rustdoc_coverage.sh --scope application`; `check_case_manifest.sh --selector TX-001..022` | `GATE-01`,`GATE-02`,`GATE-04`,`GATE-07` | `suites/repository-transaction/`、`checks/case-manifest/`; TX primary report and FOUNDATION targeted rows | 22 TX 必须有 authority、UoW order、commit tri-state、winner/replay/corruption raw；FOUNDATION rows只作 targeted；fake 不得绕过版本或幂等 | `AC-CH-023,025,029,030,036`; `VF-CH-009,010,012`; `VETO-CH-009,010,012`; `VETO-CH-P-009` | Port/method/transaction/source 缺口：`wait_design` 回写 `03`；fake parity 或测试失败：`fix_gate_failure` |
| `commit-03-a` | 无新增 primary；identity contract targeted owner由 `commit-03-c` 承担 | `CMD-001..004`; `QUERY-001..003`; `STATE-001..002` | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- identity-contract`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite static-contract-docs,domain-state --selector CMD-001..004,QUERY-001..003`; `check_rustdoc_coverage.sh --scope identity` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-07` | targeted `service-command-query/`、`domain-state/` raw/report；不创建新 EV | targeted rows必须引用其 primary owner 的 canonical IDs，并记录 no-duplicate-primary；identity source/ref/state negative branches必须有 safe findings | `AC-CH-001,006..008,023,029`; `VF-CH-001,002,003`; `VETO-CH-001,002,003` | identity 字段、review state 或 validation truth 缺失：`wait_design`；越界 allowlist/provider 语义：`VETO` 停审 |
| `commit-03-b` | 无新增 primary；registry contract targeted owner由 `commit-03-c` 承担 | `CMD-005..008`; `QUERY-004..006`; `STATE-003` | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- registry-contract`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite domain-state --selector CMD-005..008,QUERY-004..006,STATE-003`; `check_rustdoc_coverage.sh --scope registry` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-07` | targeted `service-command-query/`、`domain-state/` raw/report | current/history/version/visibility negative rows必须引用 canonical owner；不得把 registry status 映射为 runtime allow/deny | `AC-CH-002,009..011,023,029,030`; `VF-CH-003,008,010`; `VETO-CH-003,008,010` | registry lifecycle/history/visibility 不闭合：回写 `03`；allowlist/cache/listing leakage：立即 VETO |
| `commit-03-c` | `CMD-001..008` | `QUERY-001..006`; identity/registry contract rows；`TX-001..006` targeted | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- capability-identity-registry`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite service-command-query,repository-transaction --selector CMD-001..008,QUERY-001..006`; `check_case_manifest.sh --selector CMD-001..008`; `check_artifact_report_pairing.sh --scope commit-03-c` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-06`,`GATE-07` | `suites/service-command-query/identity-registry/`、`suites/repository-transaction/`; suite/run summary fragment | 8 Command 的 accepted/rejected/duplicate/race raw；Q targeted 必须 zero-write；stored result、same-UoW、trace/capture refs同 run | `AC-CH-001/002,006..011,023,025,029`; `VF-CH-001..003,007,009,010`; `VETO-CH-001..003,007,009,010`; `VETO-CH-P-008/009` | accepted path、winner、current/history 或 no-write 失败：不提交；设计冲突回写 `03`，不得并入 `03-b` |
| `commit-04-a` | 无新增 primary；descriptor contract targeted owner由 `commit-04-b` 承担 | `CMD-009..012`; `QUERY-007..011`; `STATE-004..006` | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- descriptor-contract`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite domain-state,service-command-query --selector CMD-009..012,QUERY-007..011,STATE-004..006`; `check_redaction.sh --scope descriptor`; `check_rustdoc_coverage.sh --scope descriptor` | `GATE-01`,`GATE-02`,`GATE-05`,`GATE-07` | targeted descriptor raw、`checks/redaction/`; descriptor/redaction report | safe summary/ref、typed secret ref、risk state和body-free negative raw；finding只含 safe location/class | `AC-CH-003,012..014,031..032`; `VF-CH-004,011`; `VETO-CH-004,011`; `VETO-CH-P-005` | secret/body/provider route/quota/cost field、variant或文档缺口：VETO 或回写 `03`，不得风险接受 |
| `commit-04-b` | `CMD-009..012` | `QUERY-007..011`; `STATE-004..006`; `BIND` adapter rows; `FOUNDATION-017` | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- adapter-descriptor`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite service-command-query,runtime-binding,configuration-strict --selector CMD-009..012,QUERY-007..011`; `check_config_catalog.sh --selector adapter`; `check_redaction.sh --scope adapter`; `check_dependency_boundary.sh --scope adapter` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-05`,`GATE-07` | `suites/service-command-query/descriptor/`、`suites/runtime-binding/`、`suites/configuration-strict/`、`checks/redaction/`; reports for each | external MCP/A2A/API adapter only produces typed descriptor/resolution outcome；selected unavailable is `blocked_dependency`, not pass；no execution/body | `AC-CH-003,012..014,026,031..032,035`; `VF-CH-004,011,012`; `VETO-CH-004,011,012`; `VETO-CH-P-005/007` | binding/adapter failure mapping or config fallback fails current boundary；external product unavailable remains selected residual |
| `commit-05-a` | 无新增 primary；relation contract targeted owner由 `commit-05-b` 承担 | `CMD-013..017`; `QUERY-012..014`; `STATE-007..008`; `INBOUND-001..002` contract rows | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- governance-method-relation-contract`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite domain-state,service-command-query,entry-inbound --selector CMD-013..017,QUERY-012..014,STATE-007..008,INBOUND-001..002`; `check_responsibility_boundary.sh --scope relation`; `check_redaction.sh --scope relation` | `GATE-01`,`GATE-02`,`GATE-05`,`GATE-07` | targeted relation/inbound/redaction raw/reports | governance result/policy approval ref、access review、method asset ref/summary必须 body-free且owner-separated；无新增 EV | `AC-CH-004,015..017,027,031..032`; `VF-CH-005,006,011`; `VETO-CH-005,006,011`; `VETO-CH-P-005/008` | approval/Policy/shared-rules或method body/source泄露：直接 VETO；字段/状态不闭合回写 `03` |
| `commit-05-b` | `CMD-013..017` | `QUERY-012..014`; `INBOUND-001..002`; `STATE-007..008`; relation TX/idempotency targeted | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- governance-method-relation`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite service-command-query,entry-inbound,repository-transaction --selector CMD-013..017,QUERY-012..014,INBOUND-001..002`; `check_artifact_report_pairing.sh --scope commit-05-b`; `check_redaction.sh --scope relation` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-05`,`GATE-06`,`GATE-07` | `suites/service-command-query/governance-relation/`、`suites/entry-inbound/`、`suites/repository-transaction/`; relation report and receipt candidate raw | accepted seam result、stored receipt precursor、typed ref and UoW order must be same-run; worker loop and external body are out of scope | `AC-CH-004,015..017,025,027,031..032`; `VF-CH-005,006,007,011`; `VETO-CH-005..007,011`; `VETO-CH-P-008/009` | receipt/order/body/no-write failure blocks; worker implementation remains `wait_until_current` for `commit-09-a` |
| `commit-06-a` | 无新增 primary；exposure contract targeted owner由 `commit-06-b` 承担 | `CMD-018..021`; `QUERY-015..019`; `STATE-009..014` | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- exposure-contract`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite domain-state,service-command-query --selector CMD-018..021,QUERY-015..019,STATE-009..014`; `check_rustdoc_coverage.sh --scope exposure`; `check_responsibility_boundary.sh --scope exposure` | `GATE-01`,`GATE-02`,`GATE-07` | targeted exposure/domain raw/reports | applicability, prerequisites, visibility and source-symmetric guards must be typed; no runtime allow/deny or SDK client/cache | `AC-CH-005,014,019,020,028..030`; `VF-CH-007,008,009`; `VETO-CH-007,008`; `VETO-CH-P-008/009` | unresolved/ungoverned exposure or missing source: `wait_design`; runtime/tool/SDK ownership: VETO |
| `commit-06-b` | `CMD-018..021` | `QUERY-015..019`; `STATE-009..014`; `BIND` exposure rows; `JOB-002` read input | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- formal-exposure`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite service-command-query,runtime-binding --selector CMD-018..021,QUERY-015..019`; `check_case_manifest.sh --selector CMD-018..021`; `check_artifact_report_pairing.sh --scope commit-06-b`; `check_no_static_evidence.sh --scope exposure` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-05`,`GATE-06`,`GATE-07` | `suites/service-command-query/exposure/`、`suites/domain-state/exposure/`、`suites/runtime-binding/`; view/exposure report | exposure accepted path、visibility resolver、controlled consumer view、freshness/degraded marker and no-write raw；J02 only read input | `AC-CH-005,014,019,020,028..030,033..037`; `VF-CH-007,008,009`; `VETO-CH-007,008`; `VETO-CH-P-008/009` | query-triggered repair, runtime decision, SDK client/cache, marketplace listing or missing marker source blocks and may reopen `03` |

### 5.6 Commit boundary gate matrix（07-a 至 11-b）

| Boundary | Primary selector（TC / DS / EV） | Targeted selector | 提交前命令契约 | Gate set | Raw artifact / report | Evidence contract | AC / VF / VETO | 失败回流 |
|---|---|---|---|---|---|---|---|---|
| `commit-07-a` | `CMD-022..023` | `QUERY-020..023`; `INBOUND-003`; trace/impact `STATE/TX/OBS` rows | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- trace-impact`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite service-command-query,repository-transaction,observability-redaction --selector CMD-022..023,QUERY-020..023,INBOUND-003`; `check_case_manifest.sh --selector CMD-022..023`; `check_redaction.sh --scope trace-impact`; `check_artifact_report_pairing.sh --scope commit-07-a` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-05`,`GATE-06`,`GATE-07` | `suites/service-command-query/trace-impact/`、`suites/repository-transaction/`、`suites/observability-redaction/`; trace/impact/redaction reports | accepted change必须带 exact source、scope、version、trace、revision、impact、capture；observer projection不能成为 truth或 evidence verdict | `AC-CH-018,021,025,029,030,032,036`; `VF-CH-009,011`; `VETO-CH-009,011`; `VETO-CH-P-005/008/009` | source/capture/revision 不对称、body leak、observer substitution 或 partial UoW：阻断并回写 `03` |
| `commit-07-b` | `CMD-024..026` | `QUERY-029..033`; `INBOUND-004..006`; reference `STATE/TX/BIND` rows | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- canonical-reference`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite service-command-query,entry-inbound,repository-transaction --selector CMD-024..026,QUERY-029..033,INBOUND-004..006`; `check_case_manifest.sh --selector CMD-024..026`; `check_responsibility_boundary.sh --scope reference`; `check_redaction.sh --scope reference`; `check_dependency_boundary.sh --scope reference` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-05`,`GATE-07` | `suites/service-command-query/reference/`、`suites/entry-inbound/`、`suites/repository-transaction/`、`checks/`; reference reports | typed reference必须保留 subject/kind/digest/reason/version和missing/degraded/invalid语义；禁止字符串猜 kind、正文或下游 truth | `AC-CH-013,017,019,021,025,026,029..032,036`; `VF-CH-006,007,009,011,012`; `VETO-CH-006,007,009,011,012`; `VETO-CH-P-005/008/009` | kind/source/sidecar/resolver signature缺口：`wait_design`；body或non-core dependency：VETO |
| `commit-08-a` | 无新增 primary；所有 Query primary 由 `commit-08-b/08-c` 承担 | `QUERY-001..033`; page/cursor/marker/read-port shared fixtures | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- query-foundation`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite static-contract-docs,service-command-query --selector QUERY-001..033 --targeted`; `check_rustdoc_coverage.sh --scope query-contracts`; `check_responsibility_boundary.sh --scope query-no-write` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-07` | targeted `service-command-query/query-foundation/` raw/report；不新增 EV | page/cursor/marker/empty/degraded DTO和read Port必须有正式 source；所有 public struct field/variant payload完整英文 `///` | `AC-CH-019,020,022,024,028,030,033..037`; `VF-CH-007,008`; `VETO-CH-007,008`; `VETO-CH-P-008` | marker/source/DTO 不闭合：`wait_design`；出现 UoW/save/reserve/capture 接口：阻断并回写 `03` |
| `commit-08-b` | `QUERY-001..019` | `CMD-001..021`; identity/registry/descriptor/relation/exposure states and visibility rows | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- core-capability-queries`; `run_main_gate.sh --run-id <run_id> --artifact-root <root> --entry api --selector QUERY-001..019`; `check_case_manifest.sh --selector QUERY-001..019`; `check_artifact_report_pairing.sh --scope commit-08-b`; `check_responsibility_boundary.sh --scope query-no-write` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-06`,`GATE-07` | `suites/service-command-query/query-core/`、`checks/case-manifest/`; core query report | 19 Query raw必须区分 visible/absent/NotVisible/degraded/stale/unavailable，且 UoW/save/reserve/capture/rebuild/repair=0 | `AC-CH-001..020,023,024,028..030,033..037`; `VF-CH-003,004,005,006,007,008`; `VETO-CH-003..008`; `VETO-CH-P-008` | 任一 Query 写入、fallback、first-row推断或visibility泄露：P0 hard failure，不提交 |
| `commit-08-c` | `QUERY-020..033` | `CMD-022..026`; trace/reference/directory/material/report states and redaction rows | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- extended-capability-queries`; `run_main_gate.sh --run-id <run_id> --artifact-root <root> --entry api --selector QUERY-020..033`; `check_case_manifest.sh --selector QUERY-020..033`; `check_redaction.sh --scope query-material`; `check_artifact_report_pairing.sh --scope commit-08-c`; `check_responsibility_boundary.sh --scope query-no-write` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-05`,`GATE-06`,`GATE-07` | `suites/service-command-query/query-extended/`、`suites/observability-redaction/`; extended query/material reports | 14 Query raw必须保留 source/version/freshness/degraded/body-free markers；directory/export/report只读，不生成/修复 truth | `AC-CH-011,018..022,024,028,030..037`; `VF-CH-007,008,009,011`; `VETO-CH-007,008,009,011`; `VETO-CH-P-005/008` | material source或freshness缺失：`wait_design`；job refresh/event publish/truth repair出现即阻断 |
| `commit-09-a` | `INBOUND-001..006` | `FOUNDATION-005..006`; related `CMD/QUERY/TX/BIND/CONFIG/OBS` rows；receipt/idempotency regressions | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- inbound-entry-worker`; `run_main_gate.sh --run-id <run_id> --artifact-root <root> --entry worker --selector INBOUND-001..006`; `check_case_manifest.sh --selector INBOUND-001..006`; `check_config_catalog.sh --selector worker`; `check_redaction.sh --scope inbound`; `check_artifact_report_pairing.sh --scope commit-09-a` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-05`,`GATE-06`,`GATE-07` | `suites/entry-inbound/`、targeted `suites/runtime-binding/`、`suites/configuration-strict/`、`checks/redaction/`; inbound/receipt reports | 6 INBOUND primary chains完整；FOUNDATION rows只作 targeted；header/source/schema/trusted actor必须在decode前校验，duplicate返回stored typed receipt，unsupported无payload write | `AC-CH-004,006,015..018,021,024..032,034..037`; `VF-CH-005,006,007,009,010,011`; `VETO-CH-005..007,009..011`; `VETO-CH-P-004/005/007/008/009` | 先decode、body保存、receipt缺失、duplicate mutation、worker cleanup失败：不提交；source contract缺口回写 `03` |
| `commit-09-b` | `OUTBOUND-001..010` | `CMD-001..026`; `TX-017..020`; `BIND/CONFIG/OBS` collaboration rows | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- outbound-collaboration`; `run_main_gate.sh --run-id <run_id> --artifact-root <root> --entry worker --selector OUTBOUND-001..010`; `check_case_manifest.sh --selector OUTBOUND-001..010`; `check_redaction.sh --scope outbound`; `check_artifact_report_pairing.sh --scope commit-09-b`; `check_responsibility_boundary.sh --scope collaboration` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-05`,`GATE-06`,`GATE-07` | `suites/outbound-collaboration/`、`suites/repository-transaction/outbound/`、`checks/`; snapshot/capture/A-B-C reports | source必须是committed change/material；immutable snapshot/capture和stable intent同源；A Durable先于B external，C不造local delivery truth | `AC-CH-005,018,021,025,028..037`; `VF-CH-007,009,010,011`; `VETO-CH-007,009,010,011`; `VETO-CH-P-004/005/008/009` | external先于durability、current重算payload、本地rollback、queue/DLQ/attempt truth或body leak：VETO/阻断 |
| `commit-10-a` | 无新增 primary；FOUNDATION canonical assembly owner 为 `commit-11-a`，JOB semantic owner 为 `10-b/10-c` | `FOUNDATION-007`; `JOB-001..008`; journal/checkpoint/frozen-plan/result/report protocol rows | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- job-protocol`; `run_pr_gate.sh --run-id <run_id> --artifact-root <root> --suite static-contract-docs,jobs-lifecycle --selector FOUNDATION-007,JOB-001..008 --targeted`; `check_rustdoc_coverage.sh --scope jobs`; targeted job protocol fixture inventory check | `GATE-01`,`GATE-02`,`GATE-04`,`GATE-07` | targeted `suites/static-contract-docs/`、`suites/jobs-lifecycle/`; job protocol report | protocol fixture raw必须标 `targeted_regression` 并回指 canonical owner；不创建新 EV；public Job carriers及每个 struct field/variant/payload必须英文 `///` | `AC-CH-011,021,022,024,028,030,033..037`; `VF-CH-007,010`; `VETO-CH-007,010`; `VETO-CH-P-008/009` | public schema/Rustdoc/journal/stored report source缺口：`wait_design`；不得用 generic execute 或 scheduler参数补业务 identity |
| `commit-10-b` | `JOB-001..007` | `QUERY-024..028`; material/reference states；job `TX/BIND/CONFIG/OBS` rows | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- derived-material-jobs`; `run_main_gate.sh --run-id <run_id> --artifact-root <root> --entry jobs --selector JOB-001..007`; `check_case_manifest.sh --selector JOB-001..007`; `check_state_pair_registry.sh --scope jobs`; `check_artifact_report_pairing.sh --scope commit-10-b`; `check_responsibility_boundary.sh --scope job-no-repair` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-05`,`GATE-06`,`GATE-07` | `suites/jobs-lifecycle/derived/`、`suites/repository-transaction/jobs/`、`checks/state-pair/`; job/material reports | frozen target selection、ordinal journal、per-target immutable outcome、final report完整；maintenance只能刷新derived material，不修identity/registry/exposure | `AC-CH-002,005,011,018,022,024,028,030,033..037`; `VF-CH-007,008,009,010`; `VETO-CH-007..010`; `VETO-CH-P-008/009` | rescan/replan、partial target丢失、current truth repair、duplicate mutation或report缺失：P0 hard failure |
| `commit-10-c` | `JOB-008` | `OUTBOUND-001..010`; `TX-017..022`; recovery/config/idempotency rows | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- collaboration-recovery-job`; `run_main_gate.sh --run-id <run_id> --artifact-root <root> --entry jobs --selector JOB-008`; `check_case_manifest.sh --selector JOB-008`; `check_artifact_report_pairing.sh --scope commit-10-c`; `check_redaction.sh --scope job-recovery`; `check_responsibility_boundary.sh --scope job-no-repair` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-05`,`GATE-06`,`GATE-07` | `suites/jobs-lifecycle/recovery/`、`suites/repository-transaction/jobs/`、`suites/outbound-collaboration/`; recovery/replay reports | duplicate/reentry使用stored plan/journal/report；commit-unknown保持typed；repair只处理collaboration intent，不重跑core mutation或递归entry | `AC-CH-011,018,021,024,025,030,033..037`; `VF-CH-007,009,010,011`; `VETO-CH-007,009,010,011`; `VETO-CH-P-004/005/008/009` | blind retry、recursive entry、commit-unknown伪success、capture不对称或body leak：阻断，不生成release verdict |
| `commit-11-a` | `FOUNDATION-001..018`; `BIND-001..012`; `CONFIG-001..018`; `OBS-001..012` | remaining `STATE/TX/CMD/QUERY/INBOUND/OUTBOUND/JOB` 129 identities、10 suites、638 pairs、9 checks、failure fixtures and builder fixtures | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- evidence-pipeline`; `run_main_gate.sh --run-id <run_id> --artifact-root <root>` 完整执行 189 denominator；`check_case_manifest.sh` 必须验证 `189/189, missing=0, duplicate=0`；四 report builders；9 checks；`git diff --check` | `GATE-01`,`GATE-02`,`GATE-03`,`GATE-04`,`GATE-05`,`GATE-06`,`GATE-07`,`GATE-08` | all 10 suite roots、`checks/<check-id>/`、builder raw；`summary.md`,`gate-summary.md`,`evidence-index.md`,`report-audit.md` | `commit-11-a`只承担60个跨阶段primary chain的denominator/evidence assembly并保留正式`05`语义；semantic producer/oracle仍由formal `03/04/05/06`与对应业务boundary提供；其余129行回指既有semantic owner；full main raw必须覆盖189 identities、638 pairs及83 flows，builder只从same-run raw生成candidate index | `AC-CH-001..037`; `VF-CH-001..013`; `VETO-CH-001..013`; `VETO-CH-P-001..009` | raw/report/digest/path/redaction/dependency/no-static/owner/missing/duplicate任一失败均为non-pass或`invalid_artifact`；不得手工补洞 |
| `commit-11-b` | 无新增 primary；release只聚合已完成 denominator | full compatible main refs、required selected refs、release smoke、37 AC、13 VF、23 VETO、review schema | `cargo fmt --check`; `cargo check --workspace`; `cargo test --workspace -- release-handoff`; `run_release_gate.sh --run-id <run_id> --artifact-root <root> --report-root <root> --lower-run-manifest <path>`；四 builders；9 checks；acceptance/review draft schema checks | `GATE-01`,`GATE-06`,`GATE-07`,`GATE-08`,`GATE-09` | release gate raw、all run reports；`reports/acceptance/*`、`reports/review/*` draft paths | handoff/veto/open-issues/risk/review drafts必须列explicit run IDs、provenance、status和待审查责任；无默认 verdict/signoff | `AC-CH-001..037`; `VF-CH-001..013`; `VETO-CH-001..013`; `VETO-CH-P-001..010` | 任一 lower-run、check、builder、VETO、review或授权字段缺失保持 `not_decided`/阻断；脚本不得自动有条件通过 |

### 5.7 Canonical primary owner ledger

| Owner boundary | Primary family | Count | 累计 |
|---|---|---:|---:|
| `commit-02-b` | STATE-001..024 | 24 | 24 |
| `commit-02-c` | TX-001..022 | 22 | 46 |
| `commit-03-c` | CMD-001..008 | 8 | 54 |
| `commit-04-b` | CMD-009..012 | 4 | 58 |
| `commit-05-b` | CMD-013..017 | 5 | 63 |
| `commit-06-b` | CMD-018..021 | 4 | 67 |
| `commit-07-a` | CMD-022..023 | 2 | 69 |
| `commit-07-b` | CMD-024..026 | 3 | 72 |
| `commit-08-b` | QUERY-001..019 | 19 | 91 |
| `commit-08-c` | QUERY-020..033 | 14 | 105 |
| `commit-09-a` | INBOUND-001..006 | 6 | 111 |
| `commit-09-b` | OUTBOUND-001..010 | 10 | 121 |
| `commit-10-b` | JOB-001..007 | 7 | 128 |
| `commit-10-c` | JOB-008 | 1 | 129 |
| `commit-11-a` | FOUNDATION-001..018 + BIND-001..012 + CONFIG-001..018 + OBS-001..012 | 60 | 189 |
| **Total** | **all canonical identities** | **189** | **missing=0; duplicate primary=0** |

没有 primary 的 boundary 仍必须运行 targeted tests，但其 raw row 的 `selector_kind` 必须是 `targeted_regression`，并回指上表 owner。Main gate 只能从 primary rows 计算 189；targeted、nightly expansion、selected integration、release smoke、defect/retest、review note 和 acceptance draft 均不得增加 denominator。

### 5.8 State-pair 完整性

| 规则 | Canonical 要求 | 禁止 |
|---|---|---|
| pair identity | 24 family机械展开成 638 个稳定 `SP-CH-*` | 实现运行时按结果反推 ID |
| classification | `239 current + 98 reserved + 301 illegal = 638` | unknown/unclassified/other |
| primary owner | `commit-02-b` / `SUITE-CH-DOMAIN-STATE` | 各 phase 复制新 pair identity |
| targeted regression | 受影响 family 可重复执行同一 pair ID | 以重复执行增加 count |
| main gate | 638/638、missing=0、duplicate primary=0、sampling=0 | nightly/property sample 替代 canonical registry |
| shared guard change | 受影响 family全量；若影响 generator/terminal/exposure则 R2 全 638 | 只测 happy path |
| evidence | 每个 pair raw同 run指向 owner TC/EV、classification和source registry digest | 仅写 family count 或 summary pass |

### 5.9 Evidence index 文件名冲突裁决

正式 `05-测试方案.md` §9.4 和 Step 9 calibration 已统一使用 `reports/runs/<run_id>/evidence-index.md` 与 `.json`；旧 `evidence-candidates.md` 只保留为 historical path typo。正式 `06-验收标准.md` 和全部验收 evidence gate 同样以 `evidence-index.md/.json` 为 canonical path。当前裁决如下：

- `build_evidence_candidate_index.sh` 输出 canonical `evidence-index.md`、machine `evidence-index.json` 和 per-EV pages；行状态可以是 `candidate_ready/pending_review/nonpass`，文件名不另建平行 authority。
- `evidence-candidates.md` 只记为 historical path typo，不得在实现仓创建 alias、软链接、复制文件或第二套 digest。
- `evidence-index.md/.json` 只表示 same-run candidate index；candidate 不是已采信 evidence、verdict 或 signoff。
- T071 final audit 已完成对 formal `05` §9.4 和对应 Step 9 calibration 的受控回写；189 identity、builder 数量和证据语义不变。

### 5.10 Evidence、report 与 review 责任矩阵

| 产物 / 动作 | Future producer | Canonical input | Design-time owner | Execution-time reviewer / decider | 当前状态与禁止事项 |
|---|---|---|---|---|---|
| suite raw | gate runner / test binary | frozen manifest、DS、profile、source digests | `05` suite/case/data owner；Step 7 只绑定 phase/boundary | implementation agent 复核 runner exit、case owner 和 safe failure | `future_pending`；不得在设计仓创建 raw 或预填 pass |
| check raw | `scripts/checks/*.sh` | explicit paths、digests、same-run roots | `03/04/05/06` 对应 invariant owner | implementation agent + boundary reviewer | `future_pending`；finding 不得回显正文、secret 或完整敏感 ref |
| suite report | `generate_suite_reports.sh` | same-run suite/check raw | `05` report contract owner | boundary reviewer 检查失败解释、TC/DS/EV owner 和 digest | `future_pending`；不得无 raw 手写 report |
| run / gate summary | `build_run_summary.sh`、`build_gate_summary.sh` | same-run suite reports、check raw、gate manifest | `05` automation/evidence owner | implementation agent 检查 denominator、pairing、failure retention | `future_pending`；不得用 count、selected run 或 retry 覆盖 non-pass |
| evidence candidate index | `build_evidence_candidate_index.sh` | same-run raw/report/check/builder digests | `05` evidence owner；`06` 定义可采信条件 | acceptance evidence reviewer 判定 admissibility | `future_pending`；candidate 不是 verdict，也不是已采信 evidence |
| acceptance handoff draft | release gate / report builder shell | eligible candidate index、defects、residuals、explicit run IDs | `06` handoff schema owner | delivery owner + acceptance coordinator 补充范围和责任 | `future_pending`；不得默认通过、接受人、时间或签名 |
| VETO checklist draft | release gate / review builder shell | 23 VETO directions、evidence refs、defect refs | `06` VETO owner | independent acceptance reviewer 逐项裁决 | `future_pending`；脚本不得把 missing/unknown 映射为未命中 |
| risk acceptance draft | review builder shell | residual risk、owner、expiry、evidence、non-VETO proof | `06` risk owner | authorized risk owner；最终规则仍由 `06` 约束 | `future_pending`；S/VETO/缺 evidence 不可接受 |
| open-issues / design review | implementation agent draft | boundary differences、design closure、gate failures | owning formal document + implementation ledger | design owner / reviewer 决定 `fix_gate_failure` 或 `wait_design` | `future_pending`；不得由代码或 README 反向覆盖 formal authority |
| final verdict / signoff | 不属于任何自动 builder | admissible evidence、VETO、defect、risk、authorization | `06-验收标准.md` | authorized acceptance/signoff roles | `not_evaluated`；本计划不生成、不代签、不推断 |

审查顺序固定为 `raw validity -> report projection -> evidence admissibility -> VETO/risk/handoff review -> final acceptance decision`。前一层不成立时后一层必须保持 `not_evaluated`、`pending_review` 或 `not_decided`，不得为了完成 phase 或提交 boundary 跳层。

### 5.11 VETO 前置规避矩阵

| VETO set | 实施期前置规避 | 主要 phase / boundary | Blocking check / evidence direction |
|---|---|---|---|
| `VETO-CH-001` | 五个 core closure 各自保留 identity、state、Port、service、TX 和 visible surface，不以 adapter/query/report 补洞 | `PH-02..07`; `02-a..07-b` | contract/domain/service/state/TX primary evidence；任一 orphan 直接停审 |
| `VETO-CH-002` | identity 不接受 URL、provider、config、SDK、listing 或 derived key 替代 | `PH-03`; `03-a..03-c` | identity negative cases、responsibility/dependency scan |
| `VETO-CH-003` | registry 不承载 runtime allowlist、availability、cache、listing | `PH-03/08`; `03-b/03-c/08-b` | state/query no-write、responsibility scan |
| `VETO-CH-004` | descriptor 只保存 typed safe metadata/ref，不保存 secret、route、quota、cost、failover、retry/runtime truth | `PH-04`; `04-a/04-b` | descriptor negative raw、redaction/config checks |
| `VETO-CH-005` | governance seam 只消费外部结果/ref；Hub 不生成 approval、Policy/shared rules，review 不替代 approval | `PH-05/09`; `05-a/05-b/09-a` | relation/inbound/responsibility evidence |
| `VETO-CH-006` | method relation 只保存 asset relation/ref/safe summary，不保存 method body/source/execution definition | `PH-05/07`; `05-a/05-b/07-b` | relation/reference redaction and dependency checks |
| `VETO-CH-007` | runtime/tools/SDK/product/query/export/event/job 都是 consumer/collaborator，不能反写 core truth | `PH-06..10`; `06-*` 至 `10-*` | no-write/no-repair/TX evidence、responsibility scan |
| `VETO-CH-008` | formal exposure 必须满足完整 prerequisite；draft/candidate/undescribed/ungoverned 不可消费 | `PH-06/08/10`; `06-a/06-b/08-b/10-b` | exposure state、visibility、query/job no-repair evidence |
| `VETO-CH-009` | accepted mutation保留 source/version/trace/history/impact/capture exact symmetry | `PH-03..10`; `03-c/05-b/06-b/07-*/09-b/10-*` | repository/TX/capture/pairing evidence |
| `VETO-CH-010` | proposal/discovery/feedback/job duplicate 和 race 只产生一个 winner 与 immutable replay | `PH-02/03/09/10`; `02-b/02-c/03-c/09-a/10-*` | state pair、idempotency、stored result/report evidence |
| `VETO-CH-011` | cost/billing、observer store、marketplace、production body 不进入 truth、artifact 或 report | `PH-04..11`; affected boundaries | redaction/responsibility/no-static checks；finding hard block |
| `VETO-CH-012` | compile graph 只允许 `core-contracts` sibling edge，不复制 sibling truth 或类型 | `PH-01..11`; all boundaries | dependency/import/public-signature report |
| `VETO-CH-013` | historical object、阈值、拓扑、旧 TC/path 不回流 active baseline | `PH-01/11`; `01-*`,`11-*` | source/README/formal/config/no-static scan |
| `VETO-CH-P-001..004` | denominator exact；路径同 run；无 static pass；失败 attempt immutable | `PH-02/11`; `02-b`,`11-a`,`11-b` | manifest/state-pair/pairing/no-static/report audit |
| `VETO-CH-P-005..007` | 全输出 redaction；dependency/report raw 完整；P0 config strict 且无 fallback | `PH-01/04/09/11`; `01-b/04-b/09-*/11-*` | redaction/dependency/config/report checks |
| `VETO-CH-P-008..009` | Query/Job/derived/report/consumer zero reverse-write；accepted truth source/TX/replay完整 | `PH-03..10`; service/query/entry/job boundaries | no-write/no-repair/TX/idempotency/capture evidence |
| `VETO-CH-P-010` | handoff/review/risk/signoff 每项保留真实 provenance、责任域和授权主体 | `PH-11`; `11-b` | review schema + explicit run refs；缺失保持 `not_decided` |

### 5.12 Phase 与 boundary 门禁停审记录

#### 5.12.1 Phase stop-review

| Phase | 增量覆盖 | evidence / report 归属 | 失败与人工审查 | 设计期结论 |
|---|---|---|---|---|
| `PH-01` | 0 primary；workspace/config/binding/static targeted baseline | targeted static/runtime/config reports + dependency/config/Rustdoc checks；不创建 canonical EV | 任一结构缺口阻断 | `pass-designed` |
| `PH-02` | 46 primary；STATE/TX foundation，FOUNDATION targeted | domain-state、repository-transaction、638 pair raw | 设计缺口回写 `03`；638 不允许 sampling | `pass-designed` |
| `PH-03` | 8 primary；identity/registry accepted vertical slice | service-command-query + TX same-run chain | winner/no-write/history failure阻断 | `pass-designed` |
| `PH-04` | 4 primary；descriptor/adapter seam | descriptor、binding、config、redaction reports | secret/body/provider truth 或 fallback 直接 VETO | `pass-designed` |
| `PH-05` | 5 primary；governance/method relation seam | relation/inbound/TX/redaction reports | approval/method ownership需 reviewer 复核 | `pass-designed` |
| `PH-06` | 4 primary；formal exposure/view | exposure/query/binding reports | unresolved exposure、SDK/runtime ownership或 query repair阻断 | `pass-designed` |
| `PH-07` | 5 primary；trace/impact/reference | service/repository/inbound/redaction/pairing | source/sidecar/capture symmetry失败回写 `03` | `pass-designed` |
| `PH-08` | 33 primary；全部 Query | query suites + no-write/responsibility checks | 任一 write/repair/visibility leak hard block | `pass-designed` |
| `PH-09` | 16 primary；Inbound/Outbound，FOUNDATION targeted | entry/outbound/binding/config/redaction reports | header-first、receipt、snapshot/capture/A-B-C失败阻断 | `pass-designed` |
| `PH-10` | 8 primary；Job lifecycle/recovery，protocol/FOUNDATION targeted | jobs/TX/state/config reports | duplicate/replan/repair/unsafe terminalization阻断 | `pass-designed` |
| `PH-11` | 60 canonical denominator/evidence assembly rows + full main 189/638 aggregate；semantic owner不迁移 | all 10 suite raw、9 checks、4 builder；acceptance/review drafts留给`11-b` | evidence/VETO/risk/handoff 需人/Agent审查；不得自动 verdict | `pass-designed` |

#### 5.12.2 Boundary stop-review

| Boundary group | Boundary | 提交前门禁完整 | primary / targeted 与证据归属 | 失败回流明确 | 设计期结论 |
|---|---|---|---|---|---|
| foundation | `commit-01-a`,`commit-01-b` | 是 | 仅 targeted verification；canonical FOUNDATION/BIND/CONFIG owner 为`11-a` | workspace/config/path/dependency failure阻断 | `2/2 pass-designed` |
| core foundation | `commit-02-a`,`commit-02-b`,`commit-02-c` | 是 | `0 + 24 + 22` primary；638 owner在`02-b`；FOUNDATION targeted | contract/state/TX缺口回写 `03` | `3/3 pass-designed` |
| identity/registry | `commit-03-a`,`commit-03-b`,`commit-03-c` | 是 | 前两者 targeted，`03-c` 8 primary，无重复分母 | VETO或`wait_design`规则明确 | `3/3 pass-designed` |
| descriptor | `commit-04-a`,`commit-04-b` | 是 | `04-a` targeted，`04-b` 4 primary | redaction/config/dependency failure阻断 | `2/2 pass-designed` |
| relation | `commit-05-a`,`commit-05-b` | 是 | `05-a` targeted，`05-b` 5 primary | approval/method/body或TX失败阻断 | `2/2 pass-designed` |
| exposure | `commit-06-a`,`commit-06-b` | 是 | `06-a` targeted，`06-b` 4 primary | visibility/source/no-write失败阻断 | `2/2 pass-designed` |
| trace/reference | `commit-07-a`,`commit-07-b` | 是 | `2 + 3` primary，sidecar/capture evidence归属明确 | symmetry/body/dependency缺口阻断 | `2/2 pass-designed` |
| query | `commit-08-a`,`commit-08-b`,`commit-08-c` | 是 | `08-a` targeted，`19 + 14` primary | no-write hard block；material source缺口回写设计 | `3/3 pass-designed` |
| entry/collaboration | `commit-09-a`,`commit-09-b` | 是 | `6 + 10` primary；FOUNDATION targeted；receipt/capture各归 owning suite | replay/body/A-B-C失败阻断 | `2/2 pass-designed` |
| jobs | `commit-10-a`,`commit-10-b`,`commit-10-c` | 是 | `0 + 7 + 1` primary；FOUNDATION/protocol targeted；runner owners唯一 | journal/replay/terminal/report失败阻断 | `3/3 pass-designed` |
| evidence/release | `commit-11-a`,`commit-11-b` | 是 | `11-a` assembly 60 canonical rows并执行full main；semantic owner不迁移；`11-b`只聚合 | invalid artifact/VETO/review gap保持non-pass | `2/2 pass-designed` |
| **Total** | **26 boundaries** | **26/26** | **189 primary；targeted 不计分母** | **26/26 有明确回流** | **26/26 pass-designed** |

### 5.13 跨门禁覆盖、重复与证据归属审计

| 审计项 | 机械 / 静态结果 | 结论 | 缺口 / 处理 |
|---|---:|---|---|
| phase coverage | `11/11` phase 均至少一个 blocking test gate | `pass-designed` | 无 |
| boundary coverage | `26/26` boundary 均有命令、Gate set、artifact/report、AC/VETO、失败回流 | `pass-designed` | 无 |
| primary identity | `189` owner rows；missing `0`；duplicate primary `0` | `pass-designed` | targeted 必须标 `targeted_regression` |
| suite partition | `10` suites，总数 `189` | `pass-designed` | release/smoke不能新增分母 |
| gate/check/builder | `5 / 9 / 4` future scripts | `pass-designed` | 当前均未实现或执行 |
| state pairs | `239 + 98 + 301 = 638`；owner=`commit-02-b` | `pass-designed` | sampling、unknown classification禁止 |
| exact flows | `26 CMD + 33 QUERY + 6 INBOUND + 10 OUTBOUND + 8 JOB = 83` | `pass-designed` | 每个 selector按 family规则展开 |
| evidence ownership | TC/DS/EV同 owner、same-run raw -> report -> candidate index | `pass-designed` | candidate不等于accepted evidence |
| report provenance | explicit roots/run/digests；失败attempt保留 | `pass-designed` | `latest`、跨run、手写status禁止 |
| AC/VF/VETO coverage | `37 AC + 13 VF + 13 semantic VETO + 10 process VETO` 有 phase/boundary方向 | `pass-designed` | 最终裁决仍由`06`负责 |
| redaction | artifacts/reports/acceptance/review均纳入，finding body-free | `pass-designed` | 任一泄漏 hard block |
| responsibility/dependency | only `core-contracts` compile edge；forbidden owner扫描全期 | `pass-designed` | runtime/approval/method/marketplace/SDK等不得吸收 |
| Rustdoc | public declaration、struct field、enum variant/payload、trait/method/callable永久 blocking | `pass-designed` | enum struct-variant field不写field-level `pub` |
| review responsibility | suite/run由boundary reviewer；evidence/VETO/risk/handoff由独立责任域审查 | `pass-designed` | builder不能代签或决定通过 |
| path consistency | canonical=`evidence-index.md/.json`；旧`evidence-candidates.md`仅为historical typo | `pass-designed` | T071 writeback complete；不创建alias或第二digest链 |
| execution truthfulness | implementation repo、`commit-01-a`/`commit-01-b` 和其 PH-01 targeted run-scoped tooling records 已由实现仓 ledger 真实记录；`commit-02-a`/full-main business evidence、verdict、risk acceptance、signoff 仍不存在 | `pass-designed` | 不得把 PH-01 targeted tooling records 当作新的 canonical denominator 或业务验收证据 |
| unresolved upstream design blocker | `0` | `pass-designed` | document consistency debt非upstream blocker |

## 6. 回填草稿

> 校准来源：
> - `design-calibration/07_implementation_plan_step_07_tests_acceptance_gates.md` §4~§5.13

正式 `07-实施计划.md` §7 必须保留 10 suite、5 gate script、9 mandatory check、4 report builder、11 个 phase gate 和 26 个 boundary gate 的稳定合同。189 个 canonical TC/DS/EV 只能有一个 denominator/evidence primary owner；`STATE-001..024` 与 `TX-001..022` 分别由 `commit-02-b` 与 `commit-02-c` 消费；`FOUNDATION-001..018`、`BIND-001..012`、`CONFIG-001..018` 和 `OBS-001..012` 共 60 个 canonical identity 由 `commit-11-a` 统一 assembly，但 semantic producer/oracle 不迁移。targeted regression、nightly expansion、selected integration、release smoke、defect/retest和review draft都不改变分母。

证据链固定为显式同 run 的 `raw -> suite report -> run/gate summary -> evidence-index -> acceptance/review draft`。任何 missing、failed、timeout、flaky、invalid、cross-run、digest mismatch、redaction finding、dependency violation、static pass 或未审查 VETO 都阻断 handoff。实施计划只定义候选证据和审查责任，最终 evidence admissibility、verdict、risk acceptance 和 signoff 继续由正式 `06` 的授权责任域裁决。

## 7. 待确认事项与进入 Step 8 条件

| 条件 | 状态 | 处理 |
|---|---|---|
| 11 个 phase gate 完整并停审 | pass-designed | 进入 Step 8 时只补环境/依赖准备，不改 primary owner |
| 26 个 boundary gate 完整并停审 | pass-designed | implementation skeleton 必须逐项复制 exact gate contract |
| 189 primary owner / 638 pair / 83 flow 闭合 | pass-designed | 任何后续变化需受控回开 `05/06/07` |
| evidence/report/review 责任分离 | pass-designed | builder 不得代替验收裁决或签署 |
| 23 项 VETO 有前置规避 | pass-designed | 任一命中不可风险接受或跨 phase 继续 |
| canonical evidence path | pass-designed | formal `05` §9.4 与对应 Step 9 已修正；不创建alias |
| 目标实现仓存在 | implementation prerequisite | 已建立并完成 PH-01；当前设计修复仍需形成新 immutable baseline |
| unresolved upstream design blocker | 0 | 允许进入 Step 8 |
| design repair commit | authorized_pending | 当前受控回开已获授权创建一笔 Capability Hub-only design repair commit；本次 design task 必须创建真实 repair commit 并冻结 scoped tree；不得创建 implementation commit、业务 evidence、verdict 或 signoff |

## 8. Step 7 完成记录

| 项目 | 状态 |
|---|---|
| Step 7 设计产物 | controlled_reopen_completed_2026-08-07 |
| phase gate coverage | 11/11 `pass-designed` |
| boundary gate coverage | 26/26 `pass-designed` |
| canonical coverage | 189 primary owner；missing=0；duplicate=0；638 pairs；83 flows |
| automation topology | 10 suites；5 gates；9 checks；4 builders |
| acceptance coverage | 37 AC、13 VF、23 VETO directions；最终裁决未执行 |
| implementation facts | PH-01 两个真实 implementation commit 和 targeted run-scoped tooling records 已存在；`commit-02-a` 未落码，full-main/business evidence、verdict、risk acceptance、signoff 不存在 |
| next step | 提交本次设计修复并冻结新 baseline；随后重新激活 `commit-02-a` |

### 8.1 Controlled Reopen Record

| field | value |
|---|---|
| change_id | `CH-07-OWNER-REPAIR-001` |
| trigger | `FOUNDATION-002` formal `05` domain/state identity conflicted with the prior Step 7 contract mapping to contract refs/metadata/errors/codec |
| authority | formal `05` identity retained; formal `07` Step 7 and affected boundary skeletons repaired |
| affected_boundaries | `commit-01-a`, `commit-01-b`, `commit-02-a`, `commit-02-b`, `commit-02-c`, `commit-09-a`, `commit-10-a`, `commit-11-a` |
| repair | 60 cross-phase canonical identities moved to `commit-11-a` primary/evidence assembly; semantic producer/oracle remains formal `03/04/05/06` and the corresponding domain/application/config/entry owners; early boundaries are targeted-only; `STATE/TX/CMD/QUERY/INBOUND/OUTBOUND/JOB` retain their semantic owners |
| execution_facts | no code, run, artifact, evidence, verdict or signoff was created by this design repair |
| resume_condition | real design repair commit, scoped tree freeze, implementation ledger update, then `commit-02-a` activation review |

### 8.2 Fixed Access-Review Reason Controlled Reopen

| field | value |
|---|---|
| change_id | `CH-DDD-FIXED-ACCESS-REVIEW-REASON-001` |
| trigger | existing `ChangeReason::access_review_fact_recorded()` was required by Step 6/8/9 but its persisted literal and UTF-8 bytes were not defined, so `commit-02-a` could not implement or test the factory without guessing |
| authority | Step 6 §7.6.1 owns exact literal/bytes and audited-static construction; Step 8/9/12/13/16 and formal 03/05/07 own propagation, replay, targeted oracle and boundary handoff |
| exact value | `capability-hub.change-reason/access-review-fact-recorded.v1`; ASCII=UTF-8; `59` bytes |
| denominator effect | no new canonical TC/DS/EV, flow, state pair, public type, Port or evidence identity |
| execution_facts | no PH-02 gate, run, artifact, report, evidence, verdict, signoff or implementation commit is created by this design repair |
| resume_condition | real fixed-reason design repair commit, scoped tree freeze, implementation-repository ledger update, then `commit-02-a` activation/design/worktree review |
