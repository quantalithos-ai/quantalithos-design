# L2-tools 05 测试方案 · Step 13 测试报告与证据归档

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 13「定义测试报告与证据归档」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §13
>
> 直接输入：`05_test_plan_step_05_traceability_coverage.md`、`05_test_plan_step_06_cases.md`、
> `05_test_plan_step_09_automation_gates.md`、`05_test_plan_step_10_nonfunctional.md`、
> `05_test_plan_step_11_defects_retest.md`、`05_test_plan_step_12_entry_exit.md`。

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 13 / 定义测试报告与证据归档 |
| 状态 | `accepted_for_step_13 / proceed_to_step_14` |
| 当前模块 | `test_reporting_and_evidence_archive` |
| 本步结论 | 已固定 planned artifact/report 目录、raw schema、candidate evidence 派生条件、TC/AC/VF 追溯、失败归档、人工审查和真实性审计；未创建真实 run、artifact、report 或 evidence alias。 |
| 正式文档写入 | 未允许；正式 `05-测试方案.md` 仍锁定至 Step 15。 |
| 下一步 | Step 14：回归策略与残余风险。 |

### 1.1 Step 内计划

- [x] 读取 Step 5/6 的 TC、candidate EV、AC/VF 双向追溯。
- [x] 承接 Step 9 的 suite、gate、check、report 脚本和固定输出根。
- [x] 承接 Step 10 的 redaction、dependency、NFR sample、local truth first 和 blocker 证据边界。
- [x] 承接 Step 11/12 的缺陷关闭、进入/退出和暂停条件。
- [x] 定义 raw artifact、报告、证据索引、验收交接初稿及人工/Agent 审查职责。
- [x] 完成证据归档停审和跨证据真实性/追溯审计。

## 2. 本步输入与 SOP 问题回答

| 输入 | 直接用途 | 当前状态 |
|---|---|---|
| Step 5 追溯矩阵 | `C/FR/BR/DR/NFR/AC/VF -> TC -> EV-CAND` | accepted intermediate |
| Step 6 用例矩阵 | case-level assertion、phase、data 前置和候选证据槽 | accepted intermediate |
| Step 7 数据设计 | dataset、deterministic primitive、effect probe、清理 | accepted intermediate |
| Step 8 环境配置 | profile、依赖类型、blocked/unavailable 行为 | accepted intermediate |
| Step 9 自动化门禁 | suite registry、脚本参数、artifact/report 根和 status | accepted intermediate |
| Step 10 专项验证 | redaction、dependency、NFR sample、故障注入和审计 | accepted intermediate |
| Step 11/12 | 缺陷关闭与进入/退出要求 | accepted intermediate |
| `测试方案书写规范.md` §4.6、§5.13 | 目录、报告和证据闭环约束 | standard |

| SOP 问题 | 回答 | 依据 |
|---|---|---|
| 每类测试输出什么证据？ | 每个主 suite 输出 run context、suite `report.json`、case-level result、stdout/stderr、safe failure reason 和人类可读 report；`EV-CAND-L2T-*` 由这些 raw records 绑定到 AC/VF。 | Step 6、9；规范 §4.6、§5.13 |
| 原始证据保存在哪里？ | 统一为 `artifacts/test/<run_id>/`，不带项目子目录；人类可读内容与验收 staging 统一为 `reports/runs/<run_id>/`；manifest-committed 固定工作投影为 `reports/acceptance/`；审查补充为 `reports/review/`。 | Step 9；规范 §4.6 |
| 证据如何关联用例和验收？ | 每个 case record 记录 `tc_ref`、设计来源、dataset、suite、profile、status、assertions 和 candidate slot；evidence index 从 case/suite raw artifact 推导 `ac_refs`、`veto_refs`、artifact/report refs。 | Step 5/6/9；`00` §14、§16 |
| 哪些日志、trace、snapshot 或报告保留？ | 保留安全结构化日志、effect/call journal、UoW/pair/CAS 断言、query/job no-write journal、config/redaction/dependency checks、suite reports 和 gate summary；不要求保存 raw body、secret、provider response 或外部 store 正文。 | `03` §10~§14；Step 10 |
| 证据保留多久？ | 当前只要求保留到对应候选的验收、缺陷复验和 residual review 结束；具体天数、介质和删除责任未有 authority，不固定数字。 | `L2T-UP-006~007`；Step 14 待确认 |
| 失败 suite 是否仍归档？ | 必须归档。失败、blocked、not_evaluated、invalid_artifact 和 cancelled 均保留安全的上下文、已执行 case、failure reason 和 report，供缺陷/复验使用。 | Step 9、11、12 |
| 如何证明 artifact/report 安全且真实？ | 每个 formal gate 按 Step 9 §7.1.1 的固定 `check_refs` 闭集执行；evidence index 只能从同一固定 run 的 raw records 生成，final seal 再绑定该 index 与全部 required check digest，不能由静态映射或手写 pass 生成。 | Step 9/10/12 |
| 哪些报告需要人或 Agent 审查？ | `reports/runs/<run_id>/acceptance-draft/*` 是 release run-scoped staging；`reports/acceptance/*` 只有在最后写入的 projection manifest 与 matching release seal 均验证成功时才是可消费工作投影；`reports/review/*` 是按 run/index/seal digest 追加的审查记录。三者都不能自动签署验收或改写机器状态。 | 规范 §5.13；`06` 尚未重建 |

## 3. 当前文档问题诊断

| 材料/位置 | 诊断 | 当前处理 |
|---|---|---|
| Step 5/6 | 只定义 `EV-CAND-L2T-*` 计划槽，未定义未来运行实例如何形成 | 保留 candidate slot；以 `run_id + suite + artifact_digest + tc_ref` 派生实例记录 |
| Step 9 | suite 和输出根已固定，缺 case artifact、evidence index 和报告字段 | 本 Step 补 raw schema、目录和生成规则 |
| Step 10 | NFR、redaction、dependency 的 evidence 仍是 candidate 方向 | 纳入专门 report/check，但不产生 positive readiness |
| Step 11 | 缺陷关闭需要前后 run，但未固定引用方式 | 用 fixed run refs、失败/修复 pair 和复验 TC/suite 关联 |
| Step 12 | 退出要求 artifact/report pairing，但未定义配对内容 | 固定 context、suite report、case records、stdout/stderr、human report 的配对检查 |
| 旧 `05/06` | 含静态结果、旧阈值、旧路径和签署叙事 | 标记 `historical_material`，不复制其 evidence IDs、结果或 acceptance wording |

## 4. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Evidence identity | 只有 planned `EV-CAND-L2T-*` | candidate slot + future run-scoped record | 不把设计槽位伪装成真实证据 |
| Artifact source | suite 输出方向 | 固定 raw context、case、suite、check 和 report pair | 支撑缺陷复验和审计 |
| Evidence index | 可能由静态表生成 | 必须由同一 run raw artifact/report 推导 | 防止静态造证据 |
| Acceptance handoff | 未定义审查边界 | 仅脚本初稿 + 人/Agent review，不自动 pass/sign | 保持 05/06 边界 |
| 固定 acceptance/review 路径 | 新 run 可能覆盖旧语境 | acceptance 先生成 run-scoped staging，再逐文件发布并最后以 manifest 提交固定视图；review 是 append-only 历史记录 | 保持标准根路径，以 manifest/digest 拒绝 partial/mixed 视图 |
| Failure handling | 通过结果更容易被保留 | failed/blocked/not_evaluated/invalid 全部保留且脱敏 | 失败是测试事实，不应丢失 |
| Performance evidence | 容易写成阈值 pass | 只输出 provenance-complete duration/count sample | 当前没有 measurement authority |

## 5. 测试设计取舍

| 议题 | 备选 | 取舍 |
|---|---|---|
| 每个 TC 是否各自固定一个 EV | 每 TC 一个 / 按 family + case record | 按 family + case record；减少重复槽位，同时保持 case 精确追溯。 |
| evidence index 是否允许人工维护 | 允许手写 / 从 raw artifact 推导 | 只允许从 raw artifact/report 推导；人工仅审查和补充解释。 |
| 失败 artifact 是否保留 | 只保留通过 / 全部保留 | 全部保留，但必须经过 redaction，且失败原因只用 safe ref。 |
| `reports/acceptance` 是否自动裁决 | 自动 pass / 初稿待审查 | 只生成带 source run/index digest 的工作初稿；验收裁决属于后续 `06`。 |
| 固定路径如何处理复验 | 覆盖且无来源 / run-scoped staging + manifest-committed fixed view + append-only review | acceptance 由新 fixed run 先生成 immutable staging，再逐文件替换固定视图并最后替换 manifest；消费者以 manifest snapshot 校验整组，不假设多文件原子性。review 只追加带 run/index/seal digest 的记录。 |
| provider positive 是否生成 P0 EV | 生成 / 保持 conditional | 保持 `blocked_dependency`/conditional；不进入 P0 evidence 分母。 |
| 性能 sample 是否生成 pass evidence | 生成 pass / 生成 sample-only | 只生成 sample provenance record；不声称性能通过。 |

## 6. 结构化中间产物

### 6.1 Evidence identity 与状态规则

`EV-CAND-L2T-*` 是设计期证据槽位，不是实例、alias、digest 或验收结论。未来执行时，证据记录至少由以下元组唯一定位：

```text
(run_id, candidate_evidence_slot, suite, tc_ref, artifact_digest)
```

同一 candidate slot 可以在不同 run 产生多个记录；不能把旧 run、多个 profile 或不同 suite 的结果拼成一个证据。`run_id` 必须是固定非空 opaque id，禁止 `latest`。

| 记录层 | 计划状态 | 含义 | 是否可交给 06 |
|---|---|---|---|
| candidate slot | `planned` | Step 5/6 预留的 EV-CAND 槽位 | 否 |
| case result | `passed`/`failed`/`blocked_dependency`/`not_evaluated`/`invalid_artifact`/`cancelled` | 单个 TC 在一个 run/profile 的结果 | 只作为 raw input |
| suite result | 同 Step 9 status contract | suite full denominator 和聚合结果 | 只有 passed 且证据审计通过才可派生 |
| derivation item | `derived`/`ineligible`/`unavailable`/`invalid` | 从 raw artifact/pre-index suite report 派生，尚未消费 post-run checks | 否 |
| final evidence record | `eligible`/`ineligible`/`unavailable`/`invalid`/`pending_review` | final seal 绑定 index 与 required check digests | `eligible` 仍需 06 裁决 |
| acceptance handoff | `draft`/`review_required` | 交接初稿，不是签署或 verdict | 否，直到 06 审查 |

`blocked_dependency`、`unknown`、`not_evaluated` 或缺少 raw/report pair 的记录不能标为 `eligible`。真实 provider、Sandbox run/receipt、Bus delivery、Observed、SDK readiness 和验收签署不由本状态表生成。

### 6.2 Candidate evidence family 与主 suite 映射

| Candidate family | 代表 TC family | 主 suite | 主要 artifact/report | AC/VF 消费方向 |
|---|---|---|---|---|
| `EV-CAND-L2T-CORE-001` | `CORE-*`、五能力代表路径 | `local-closure`、`release-local-smoke` | local/release suite report | `AC-L2T-001~005`、`VF-L2T-001` |
| `EV-CAND-L2T-FOUNDATION-001` | `FOUNDATION-*` | `contract-domain` | contract-domain report | `AC-L2T-024~033`、`VF-L2T-002`、`VF-L2T-008` |
| `EV-CAND-L2T-CONTRACT-001` | `CONTRACT-*` | `application-core` | application-core report | `AC-L2T-006~008`、`VF-L2T-002`、`VF-L2T-011` |
| `EV-CAND-L2T-BIND-001` | `BIND-*`、`CONSUMER-001` | `application-core`、`controlled-seam` | suite reports + blocker check | `AC-L2T-009~011`、`VF-L2T-003`、`VF-L2T-005` |
| `EV-CAND-L2T-INV-001` | `INV-*` | `application-core` | application-core report | `AC-L2T-012~014`、`VF-L2T-004` |
| `EV-CAND-L2T-PRE-001` | `PRE-*` | `application-core`、`controlled-seam` | phase/blocked reports | `AC-L2T-015~018`、`VF-L2T-005`、`VF-L2T-006` |
| `EV-CAND-L2T-OUTCOME-001` | `OUTCOME-*` | `application-core`、`transaction-concurrency` | outcome/pair/unknown reports | `AC-L2T-019~022`、`VF-L2T-007`、`VF-L2T-009`、`VF-L2T-011` |
| `EV-CAND-L2T-HANDOFF-001` | `HANDOFF-*`、`CONT-*` | `application-core`、`entry-worker-job` | handoff/continuation report | `AC-L2T-022`、`AC-L2T-029`、`VF-L2T-006~009` |
| `EV-CAND-L2T-QUERY-001` | `QUERY-*` | `query-purity` | query report + no-write check | `AC-L2T-023~025`、`VF-L2T-009` |
| `EV-CAND-L2T-CONSUMER-001` | `CONSUMER-*` | `entry-worker-job` | consumer report | `AC-L2T-018`、`AC-L2T-021`、`AC-L2T-029`、`VF-L2T-006`、`VF-L2T-009` |
| `EV-CAND-L2T-CONT-001` | `CONT-*`、`OF-01~04` | `entry-worker-job`、`controlled-seam` | continuation/attempt report | `AC-L2T-022`、`AC-L2T-029` |
| `EV-CAND-L2T-JOB-001` | `JOB-*` | `entry-worker-job` | bounded Job report + check | `AC-L2T-023`、`AC-L2T-025`、`AC-L2T-031`、`VF-L2T-009` |
| `EV-CAND-L2T-STATE-001` | `STATE-*` | `contract-domain`、`transaction-concurrency` | state transition report | `AC-L2T-024~026`、`VF-L2T-011` |
| `EV-CAND-L2T-TX-001` | `TX-*` | `transaction-concurrency` | UoW/commit/pair journal | `AC-L2T-024`、`AC-L2T-038`、`VF-L2T-007`、`VF-L2T-011` |
| `EV-CAND-L2T-CONC-001` | `CONC-*` | `transaction-concurrency` | race/replay journal | `AC-L2T-038`、`VF-L2T-011` |
| `EV-CAND-L2T-ERR-001` | `ERR-*` | `transaction-concurrency`、`application-core` | typed error/recovery report | `AC-L2T-020`、`AC-L2T-038` |
| `EV-CAND-L2T-CFG-001`、`EV-CAND-L2T-CFG-T-001`、`EV-CAND-L2T-CFG-A-001`、`EV-CAND-L2T-CFG-F-001`、`EV-CAND-L2T-CFG-X-001` | `CFG-*` families | `config-validator`、`config-assembly` | config validation/builder report | `AC-L2T-024~028`、`VF-L2T-005`、`VF-L2T-012` |
| `EV-CAND-L2T-OBS-001` | `OBS-*` | `observability-redaction` | observation/redaction report | `AC-L2T-021`、`AC-L2T-029`、`AC-L2T-033`、`AC-L2T-039`、`VF-L2T-007~009` |
| `EV-CAND-L2T-RULE-001`、`DATA-001` | `RULE-*`、`DATA-*` | `static-boundary`、`observability-redaction` | boundary/ownership scan | `AC-L2T-024~033` |
| `EV-CAND-L2T-NFR-AVAIL-001`、`EV-CAND-L2T-NFR-SEC-001`、`EV-CAND-L2T-NFR-AUDIT-001`、`EV-CAND-L2T-NFR-CONS-001`、`EV-CAND-L2T-NFR-OBS-001` | NFR family cases、`VETO-*` | `local-closure`、`controlled-seam`、`observability-redaction`、`transaction-concurrency` | specialized reports/sample | `AC-L2T-034~039`、对应 `VF-L2T-*` |
| `EV-CAND-L2T-VETO-001` | `VETO-001~013`、`NC-L2T-001~025` | `static-boundary`、release checks | veto/check reports | `VF-L2T-001~013` |

以上是对现有 candidate family 的归档映射，不新增需求、TC、suite 或配置 key；若未来需要新 family，必须先回写 Step 5/6/9 并通过编号审查。

### 6.3 Raw artifact 目录结构

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/config-digest.json
  meta/source-status.json
  evidence-index.json
  gate-summary.json
  checks/<check_name>.json
  suites/<suite>/report.json
  suites/<suite>/stdout.log
  suites/<suite>/stderr.log
  suites/<suite>/cases/<tc_ref>.json
  suites/<suite>/journals/<safe_journal_name>.json

reports/
  README.md
  runs/<run_id>/
    summary.md
    gate-results.md
    evidence-index.md
    redaction-check.md
    dependency-boundary.md
    artifact-report-pairing.md
    suites/<suite>.md
    evidence/<candidate_slot>.md
    acceptance-draft/
      handoff.md
      veto-checklist.md
      risk-acceptance.md
      open-issues.md
  acceptance/
    projection-manifest.json
    handoff.md
    veto-checklist.md
    risk-acceptance.md
    open-issues.md
  review/
    reviewer-notes.md
    agent-review.md
```

目录规则：

- raw artifact 只放在 `artifacts/test/<run_id>`，禁止 `artifacts/test/<project>/<run_id>`。
- human report 只放在 `reports/runs/<run_id>`，禁止 `reports/<project>`。
- 报告脚本放在 `scripts/reports/*.sh`，不得放入输出目录。
- 失败 suite 也必须生成 `report.json`、stdout/stderr 和安全 failure reason；不可用或未评估不能通过删除目录隐藏。
- `reports/runs/<run_id>/acceptance-draft/*` 保存 release-owned staging；`reports/acceptance/*` 是由最后写入 manifest 提交的 fixed-path 工作投影；`reports/review/*` 是 source-tuple append-only 审查记录。三者都不是测试结果或签署存储。

### 6.4 Raw artifact DTO、schema 与 digest 契约

以下是 planned test-infrastructure local DTO，不进入 `contracts`、domain、公开 API 或业务持久化。DTO owner 为未来实现边界 `test_support::artifacts`；suite runner、gate supervisor 和 check writer 只能通过该 owner 的 serializer 写入，report generator、pairing/redaction/no-static-evidence check 只能通过同一 owner 的 parser 读取。具体测试框架不得另建兼容层或第二套业务 oracle。

#### 6.4.1 共同 envelope、枚举与 canonicalization

每个 JSON artifact 都必须含以下共同字段；下列规则本身是测试产物编码规则，不是性能阈值或验收结论。

| 字段 | Required | 类型 / 值域 | 约束 |
|---|---|---|---|
| `schema_version` | 是 | string，固定 `l2-tools.test-artifact.v1` | 其它值拒绝读取并记 `invalid_artifact`。 |
| `run_id` | 是 | non-empty opaque string | 不得为 `latest`，所有被引用 artifact 必须同 run。 |
| `artifact_digest_algorithm` | 是 | string，固定 `sha256` | P0 只支持该值。 |
| `artifact_digest` | 是 | string，`sha256:<64 lowercase hex>` | 按下述 self-exclusion 规则计算。 |

| Enum | Closed values | 使用位置 |
|---|---|---|
| `L2TestArtifactStatus` | `passed`,`failed`,`blocked_dependency`,`not_evaluated`,`invalid_artifact`,`cancelled` | suite、case、check |
| `L2AssertionStatus` | `passed`,`failed`,`blocked_dependency`,`not_evaluated` | assertion item |
| `L2RedactionStatus` | `clean`,`failed`,`not_evaluated` | suite、journal、evidence item |
| `L2SourceStatus` | `committed`,`uncommitted`,`not_available` | design/implementation/Core source |
| `L2WorkspaceStatus` | `clean`,`dirty`,`not_available` | context |
| `L2DerivationStatus` | `derived`,`ineligible`,`unavailable`,`invalid` | pre-check evidence index item |
| `L2EvidenceStatus` | `eligible`,`ineligible`,`unavailable`,`invalid`,`pending_review` | post-check final seal item；不等于 06 verdict |
| `L2JournalKind` | `effect`,`call`,`cas`,`uow`,`provenance` | journal root |
| `L2JournalEventKind` | `begin_uow`,`read`,`write`,`append`,`cas`,`commit`,`rollback`,`port_call`,`port_return`,`emit`,`projection_write`,`job_target`,`no_op` | journal entry |

Digest 和 canonical JSON 固定如下：

- `artifact_digest` 的输入是从同一 JSON object 省略顶层 `artifact_digest` 后得到的 canonical UTF-8 JSON bytes；`artifact_digest_algorithm` 仍参与计算，禁止置空后计算或包含自身。
- object key 按 Unicode code point lexicographic order；array 保持 writer 已存顺序；无 insignificant whitespace；number 使用 JSON 最短十进制表示且禁止 NaN/Infinity；string 使用标准 JSON escaping；文件末尾不追加换行。
- 所有语义集合在写入前按 canonical ref 升序去重；有序执行记录、assertion、journal entry 和 evidence derivation input 保持实际存储顺序，不得为取得相同 digest 而重排。
- `stdout.log`、`stderr.log` 不嵌入 digest。writer 先执行 allowlist redaction，再原样保存 redacted exact bytes；suite report 对保存后的 bytes 直接计算 SHA-256，分别写入 required `stdout_digest`、`stderr_digest`。禁止换行、编码或空白归一化后再计算；空输出也创建零字节文件并记录其 digest。
- 任一 schema、枚举、条件字段、digest 或 referenced digest 校验失败，reader 必须返回 `invalid_artifact`；不得容错猜字段、跨版本回退或手工补 report。

#### 6.4.2 Metadata artifact

`meta/context.json` 的业务字段（另加共同 envelope）：

| 字段 | Required | 类型 / 值域 | 约束 |
|---|---|---|---|
| `gate_id` | 是 | `pr`,`main`,`nightly`,`integration`,`release`,`conditional_provider`,`single_suite` | 来自 §9.3 gate script；不从文件路径猜测。 |
| `suite_refs` | 是 | unique sorted array<string>，至少 1 项 | 只允许 §9.1 closed semantic suite ID。 |
| `check_refs` | 是 | unique sorted array<string> | formal gate 必须精确等于 Step 9 §7.1.1；`single_suite` 才可显式子集/空集；与 `checks/<check_name>.json` 一一映射。 |
| `config_profile` | 是 | `local-dev`,`ci-test`,`integration-like`,`staging-like`,`production-like` | 必须通过 §8 activation gate。 |
| `started_at` | 是 | RFC 3339 UTC timestamp string | 记录 gate entry；不是 source baseline。 |
| `artifact_root` | 是 | string，固定形状 `artifacts/test/<run_id>` | `<run_id>` 必须等于本 object 的 `run_id`。 |
| `report_root` | 是 | string，固定形状 `reports/runs/<run_id>` | 不允许 project subdirectory。 |
| `workspace_status` | 是 | `L2WorkspaceStatus` | 不推导 commit/readiness。 |
| `workspace_status_ref` | 否 | safe relative ref string | `dirty` 时可引用安全 status 摘要；禁止 diff/body。 |

`meta/source-status.json` 的业务字段：

| 字段 | Required | 类型 / 值域 | 条件语义 |
|---|---|---|---|
| `design_source_status` | 是 | `L2SourceStatus` | 当前 workspace 未冻结时必须为 `uncommitted`。 |
| `design_source_ref` | 否 | safe opaque string | `committed` 时必填；`uncommitted` 时只允许安全 workspace ref；`not_available` 时禁止。 |
| `implementation_source_status` | 是 | `L2SourceStatus` | 实现仓不存在时为 `not_available`。 |
| `implementation_source_ref` | 否 | safe opaque string | 与对应 status 条件一致；不得填 planned commit。 |
| `core_source_status` | 是 | `L2SourceStatus` | authority 未冻结时不得写 `committed`。 |
| `core_source_ref` | 否 | safe opaque string | 与对应 status 条件一致。 |

`meta/config-digest.json` 的业务字段：

| 字段 | Required | 类型 / 值域 | 条件语义 |
|---|---|---|---|
| `config_profile` | 是 | canonical profile enum | 与 context 相同。 |
| `redacted_config_ref` | 是 | safe opaque string | 只引用 redacted config identity，不含 raw document/full sensitive ref。 |
| `config_digest_status` | 是 | `available`,`unavailable_safe_projection` | 承接 `04` 的 safe projection 边界。 |
| `config_digest_algorithm` | 条件 | string，固定 `sha256` | 仅 `available` 时必填，否则禁止。 |
| `config_digest` | 条件 | `sha256:<64 lowercase hex>` | 仅对 `04` 已定义的 canonical safe projection 计算；projection 未闭口时必须省略并标 `unavailable_safe_projection`。 |

`artifact_digest` 只证明 metadata JSON 自身完整性，不会把 `config_digest_status=unavailable_safe_projection` 升级为有效配置摘要。

#### 6.4.3 Suite、case、journal 与 check artifact

`suites/<suite>/report.json` 的业务字段：

| 字段 | Required | 类型 / 值域 | 约束 |
|---|---|---|---|
| `suite` | 是 | §9.1 closed suite ID string | 路径 `<suite>` 与字段完全一致。 |
| `profile` | 是 | canonical profile enum | 与 context 一致。 |
| `status` | 是 | `L2TestArtifactStatus` | 只按 §9.4 聚合。 |
| `case_refs` | 是 | unique sorted array<TC ref> | full gate 使用 manifest denominator；空数组只允许 `not_evaluated`/`invalid_artifact`。 |
| `case_artifact_refs` | 是 | object map `tc_ref -> relative path` | key 集必须与 `case_refs` 完全相同；允许指向 owning suite 的 `suites/<owner>/cases/<tc_ref>.json`，聚合 suite 不复制 case。 |
| `case_digests` | 是 | object map `tc_ref -> sha256:<hex>` | key 集必须与 `case_refs` 完全相同。 |
| `safe_failure_reason_ref` | 条件 | safe opaque string | `passed` 时禁止；其它 status 必填。 |
| `redaction_status` | 是 | `L2RedactionStatus` | 非 `clean` 时 suite 不可 passed。 |
| `started_at`,`finished_at` | 是 | RFC 3339 UTC timestamp string | `finished_at >= started_at`。 |
| `duration_ms` | 是 | integer >= 0 | 只作 provenance sample，不构成性能 pass。 |
| `stdout_digest`,`stderr_digest` | 是 | `sha256:<64 lowercase hex>` | 分别校验 sibling redacted log exact bytes。 |

`suites/<suite>/cases/<tc_ref>.json` 的业务字段：

| 字段 | Required | 类型 / 值域 | 约束 |
|---|---|---|---|
| `suite` | 是 | closed suite ID | 与 parent path/report 一致。 |
| `tc_ref` | 是 | concrete `TC-L2T-*` string | 必须存在于 §6 manifest；不得使用 derived theme ID。 |
| `dataset_id` | 是 | canonical `DS-L2T-*` string | 必须存在于 §7 manifest。 |
| `status` | 是 | `L2TestArtifactStatus` | case status 不得优于失败 assertion。 |
| `assertions` | 是 | non-empty array<`L2AssertionItem`> | 按 manifest 顺序保存。 |
| `oracle_refs` | 是 | unique sorted non-empty array<string> | 回指 current 00/03/04 的具体 ID/对象/flow/CFG。 |
| `candidate_slots` | 是 | unique sorted array<`EV-CAND-L2T-*`> | helper case 可为空；不得写真实 EV alias。 |
| `safe_failure_reason_ref` | 条件 | safe opaque string | `passed` 时禁止；其它 status 必填。 |

`L2AssertionItem`：`assertion_id`（required non-empty string，case 内唯一）、`status`（required `L2AssertionStatus`）、`expected_ref`（required safe oracle ref）、`actual_ref`（optional safe result ref）、`message_ref`（optional safe diagnostic ref）、`failure_reason_ref`（`failed`/`blocked_dependency`/`not_evaluated` 时 required）。任何字段都不得承载 raw request、provider body、capture、secret、stack trace 或 full sensitive ref。

`suites/<suite>/journals/<safe_journal_name>.json` 的业务字段：

| 字段 | Required | 类型 / 值域 | 约束 |
|---|---|---|---|
| `suite` | 是 | closed suite ID | 与 parent path 一致。 |
| `journal_kind` | 是 | `L2JournalKind` | 不得使用自由文本 kind。 |
| `tc_ref` | 是 | concrete TC ref | 与 case artifact 同 run/suite。 |
| `entries` | 是 | array<`L2JournalEntry`> | 可为空，用于证明 zero-write/no-call；按 ordinal 存储。 |
| `redaction_status` | 是 | `L2RedactionStatus` | 非 clean 不可成为 oracle。 |

`L2JournalEntry`：`ordinal`（required integer >= 0 且严格递增）、`event_kind`（required `L2JournalEventKind`）、`phase_ref`（required safe formal phase/flow ref）、`subject_ref`（optional safe typed ref）、`outcome_ref`（optional safe status/error ref）。journal 只证明 effect/call/CAS/UoW/provenance，不拥有业务 truth。

root `checks/<check_name>.json` 的业务字段：

| 字段 | Required | 类型 / 值域 | 约束 |
|---|---|---|---|
| `gate_id` | 是 | context 中的 closed gate ID | check 可服务多个 suite，不伪装为 semantic suite。 |
| `check_name` | 是 | §9.5 script stem | 与 root path filename 一致，不带路径或 `.sh`。 |
| `input_refs` | 是 | unique sorted non-empty array<relative path> | 只引用本 run input。 |
| `input_digests` | 是 | object map `input_ref -> sha256:<hex>` | key 集与 `input_refs` 完全相同。 |
| `status` | 是 | `L2TestArtifactStatus` | check failure/blocked 不得被 generator 吞掉。 |
| `redaction_status` | 是 | `L2RedactionStatus` | 非 `clean` 时 check 不可 passed。 |
| `safe_findings` | 是 | array<`L2SafeFinding`> | 无 finding 用空数组。 |
| `safe_failure_reason_ref` | 条件 | safe opaque string | `passed` 时禁止；其它 status 必填。 |

`L2SafeFinding`：`finding_ref`（required safe opaque string）、`severity`（required `S`,`A`,`B`,`R`）、`oracle_ref`（required current design/check ref）。禁止 raw matched text、secret、body、stack 或 full filesystem content。

#### 6.4.4 Evidence index artifact

root `evidence-index.json` 除共同 envelope 外还含：required `generation_status: succeeded|failed`、required `items: array<L2EvidenceItem>`，以及 `safe_failure_reason_ref`（`failed` 时 required，`succeeded` 时 forbidden）。`succeeded` 时 `candidate_slot` 在 items 中唯一，items 只按该字段升序；一个 item 聚合该 slot 的全部同 run owning suites/cases。item 集必须等于 context suite manifest projection 可达的 candidate registry；release 必须等于 §6.2 全部 planned candidate slot，禁止静默漏 slot。合法零候选仅允许 manifest projection 本身为空，且只表示没有可派生 item，不能被解释为 pass。`failed` 时 items 必须为空，root artifact 仍可按共同 envelope 计算 digest并被 reader 判为 invalid；不得制造一个带假 candidate slot 的 failure item。

| `L2EvidenceItem` 字段 | Required | 类型 / 值域 | 约束 |
|---|---|---|---|
| `candidate_slot` | 是 | `EV-CAND-L2T-*` string | 只能来自 §13.2 planned family。 |
| `derivation_status` | 是 | `L2DerivationStatus` | `derived` 只表示来源可派生，不表示 final eligible。 |
| `tc_refs` | 是 | unique sorted non-empty array<concrete TC> | derived theme 必须展开到 concrete refs。 |
| `suite_refs` | 是 | unique sorted non-empty array<suite ID> | 所有来源同 run/profile。 |
| `artifact_refs` | 是 | unique sorted array<relative path> | 只引用本 run raw JSON/log；只有 `derivation_status=unavailable` 且 source 未产生时可为空。 |
| `artifact_digests` | 是 | object map `artifact_ref -> sha256:<hex>` | key 集与 `artifact_refs` 完全相同；只记录已通过 self-digest 校验的 artifact。 |
| `report_refs` | 是 | unique sorted array<relative path> | 只引用 pre-index `reports/runs/<run_id>/suites/<suite>.md`；仅 unavailable/no-source 可为空；禁止引用本 index 派生页或 post-check report。 |
| `report_digests` | 是 | object map `report_ref -> sha256:<hex>` | 对 UTF-8 report exact bytes 计算；key 集与 `report_refs` 完全相同。 |
| `ac_refs` | 是 | unique sorted array<`AC-L2T-*`> | 与 `veto_refs` 至少一方非空。 |
| `veto_refs` | 是 | unique sorted array<`VF-L2T-*`> | 不表达 VF 已通过。 |
| `review_requirement_refs` | 是 | unique sorted array<safe current formal ref> | empty 表示无 machine-known 人工前置；非空只允许当前 §14 residual 或 future-06 rule projection，不接收自由文本 review。 |
| `derivation` | 是 | `L2EvidenceDerivation` object | 禁止手写或跨 run merge。 |
| `redaction_status` | 是 | `L2RedactionStatus` | 只有 `clean` 才可能 derived；pre-check item 不携带 review/final eligibility 状态。 |

`L2EvidenceDerivation`：`generator_id`（required，固定 `generate_evidence_index`）、`rule_version`（required，固定 `l2-tools.evidence-derivation.v1`）、`source_artifact_digests`（required array<digest>，按 source processing order 保存；仅 unavailable/no-source 可为空）、`generated_at`（required RFC 3339 UTC timestamp）。generator 只能消费同 run 已校验 artifact/report。`derivation_status` 的映射固定为：来源完整、schema/digest/redaction有效且 candidate source oracle 成立=`derived`；来源完整但 source oracle 明确失败=`ineligible`；source case/suite 为 `blocked_dependency`、`not_evaluated`、`cancelled` 或 required source 未产生=`unavailable`；来源 artifact 自身有效但其 status=`invalid_artifact`，或 valid sources 之间出现 path/run/profile/ref 不一致=`invalid`。任一 source 无法 parse、自身 schema/self-digest 不合法，或 generator/schema/registry discovery 失败，root 必须 `generation_status=failed`、items 为空并保留 safe reason；不得把不可验证 bytes 写进 item digest map。

`evidence-index.json` 是 pre-check derivation index。其 item 不得引用 `check_artifact_report_pairing`、`check_no_static_evidence`、final `check_redaction_boundary` 或 `gate-summary.json`，避免 self-validation digest 环；它不存在 `eligible` 值。只有下述 final seal 对同一 slot 写 `eligible` 后才对 06 可交接。

#### 6.4.5 Final gate seal

root `gate-summary.json` 是所有 post-run check 完成后的唯一 machine seal；除共同 envelope 外具有：

| 字段 | Required | 类型 / 值域 | 约束 |
|---|---|---|---|
| `gate_id` | 是 | context closed gate ID | 与 context 一致。 |
| `config_profile` | 是 | canonical profile enum | 与 context 一致。 |
| `status` | 是 | `L2TestArtifactStatus` | 按该 gate required suite/check denominator 聚合；release 还纳入 projection publication integrity；不等于 acceptance。 |
| `suite_report_refs` | 是 | unique sorted non-empty array<relative path> | 只指本 run `suites/<suite>/report.json`。 |
| `suite_report_digests` | 是 | object map `ref -> sha256:<hex>` | key 集与 refs 完全相同。 |
| `check_refs` | 是 | unique sorted non-empty array<`checks/<check>.json`> | 必须精确等于该 formal gate 的 Step 9 §7.1.1 闭集；`single_suite` 禁止生成 final seal。 |
| `check_digests` | 是 | object map `ref -> sha256:<hex>` | key 集与 refs 完全相同。 |
| `evidence_index_ref` | 是 | fixed string `evidence-index.json` | 同 run pre-check index。 |
| `evidence_index_digest` | 是 | `sha256:<64 lowercase hex>` | 校验完整 index object。 |
| `evidence_eligibility` | 是 | array<`L2FinalEligibilityItem`> | slot 集合和顺序与成功 index items 完全一致；index failed 时必须为空且 gate invalid。 |
| `acceptance_projection_status` | 条件 | `published`,`invalid` | release required、其它 gate forbidden；`published` 只表示 manifest/four-file projection 可验证，不表示 acceptance；`invalid` 强制 release `invalid_artifact`。 |
| `acceptance_projection_manifest_ref` | 条件 | fixed string `reports/acceptance/projection-manifest.json` | release `published` 时 required；release `invalid` 和其它 gate forbidden。 |
| `acceptance_projection_manifest_digest` | 条件 | `sha256:<64 lowercase hex>` | release `published` 时 required，校验 manifest self-digest；其它情况 forbidden。 |
| `redaction_status` | 是 | `L2RedactionStatus` | 来自 final redaction check；非 clean 时 gate 不可 passed。 |
| `started_at`,`finished_at` | 是 | RFC 3339 UTC timestamp | 来自 context/gate finalizer，finish 不早于 start。 |
| `duration_ms` | 是 | integer >= 0 | provenance only。 |
| `safe_failure_reason_ref` | 条件 | safe opaque string | `passed` 时禁止；其它 status 必填。 |

`L2FinalEligibilityItem`：required `candidate_slot`、`status:L2EvidenceStatus`、`source_index_digest`（必须等于 root `evidence_index_digest`）；optional `safe_status_reason_ref`，但 `eligible` 时禁止，非 eligible 时 required。finalizer 采用固定优先级 `invalid > ineligible > unavailable > pending_review > eligible`：source/check integrity、缺项或 cross-run/schema/digest/path/`invalid_artifact`=`invalid`；否则有效语义失败=`ineligible`；否则 blocked/not-evaluated/cancelled/required source absent=`unavailable`；否则 derived、required checks 全 passed 且 `review_requirement_refs` non-empty=`pending_review`；同条件且 refs empty=`eligible`。pre-check 非 derived 状态不得提升。release projection publication 失败属于 integrity failure：root status=`invalid_artifact`，全部 final item=`invalid`，不保留可交接 eligibility。future 06 只接收 passed `gate_id=release` seal 与 matching committed acceptance projection；可按 seal digest 解引用 index 做追溯，但不得把 derivation item 当证据资格。

`reports/acceptance/projection-manifest.json` 是 fixed-view publication marker，使用独立 `schema_version=l2-tools.acceptance-projection-manifest.v1`，不套用 raw artifact common envelope。parser 对未知/缺失字段 fail closed。字段闭集为：

| 字段 | Required | 类型 / 值域 | 约束 |
|---|---|---|---|
| `source_run_id` | 是 | non-empty opaque string | 等于 release context；禁止 `latest`。 |
| `source_evidence_index_ref` | 是 | `artifacts/test/<run_id>/evidence-index.json` | `<run_id>` 与 source run 完全一致。 |
| `source_evidence_index_digest` | 是 | `sha256:<64 lowercase hex>` | 等于已验证 pre-check index digest。 |
| `files` | 是 | exactly four ordered `L2AcceptanceProjectionFile` | 按 role 升序；`handoff`,`open_issues`,`risk_acceptance`,`veto_checklist` 各一次。 |
| `published_at` | 是 | RFC 3339 UTC timestamp | 只作 publication provenance。 |
| `manifest_digest_algorithm` | 是 | `sha256` | 不允许 fallback。 |
| `manifest_digest` | 是 | `sha256:<64 lowercase hex>` | 复用 §6.4.1 canonical JSON；计算时仅省略顶层 `manifest_digest`。 |

`L2AcceptanceProjectionFile` 只含 required `role`,`staged_ref`,`published_ref`,`content_digest`，禁止其它字段。两个路径分别固定为 `reports/runs/<run_id>/acceptance-draft/<fixed-name>.md` 与 `reports/acceptance/<fixed-name>.md`；`content_digest` 对两处 exact UTF-8 bytes 计算且必须相等。manifest 不含 gate status、eligibility、seal digest 或 free-text finding，因此 finalizer 可单向消费它而不成环。

固定 writer 拓扑为：metadata -> case/journal/redacted log/suite report -> pre-index human suite reports -> `evidence-index.json` -> evidence pages 与 run-scoped acceptance staging -> non-redaction checks -> redaction check 扫描冻结的 pre-seal tree（含 staging exact bytes）-> release-only 获取 exclusive publication lock -> 逐文件固定视图替换 -> `projection-manifest.json` 最后单文件替换 -> `gate-summary.json` 绑定 manifest（失败分支写不含 manifest ref/digest 的 invalid seal）-> release-only 解锁 -> final check/gate human projections。`projection-manifest.json`、`redaction-check.md` 和 final projections 是固定 post-check/seal-safe 例外，只能携带 schema-bound safe ref/timestamp/count/status/digest，禁止 raw diagnostic；其它 artifact/report/draft 均在 redaction denominator 内。seal 不得成为其引用的 suite/report/index/check/projection 输入，也不反写 eligibility。

#### 6.4.6 Writer / reader owner 与失败保留

| Artifact | Writer owner | Reader owner | 失败保留规则 |
|---|---|---|---|
| `meta/context.json`,`meta/source-status.json`,`meta/config-digest.json` | gate supervisor + `test_support::artifacts` serializer | all gate/check/report entry readers | entry 失败时保留已写 metadata；缺项由 gate 判 `invalid_artifact`，不补假 ref。 |
| suite report/case/journal/stdout/stderr | suite runner adapter + shared serializer/redactor | suite report generator、pairing/redaction/evidence readers | failed/blocked/cancelled 同样落盘；writer 崩溃保留 prefix，缺 report 由 pairing check 判 invalid。 |
| check JSON | owning §9.5 root check writer + shared serializer | gate finalizer、final report audit、future release-seal consumer | `checks/<check_name>.json`；check 自身失败也写 safe finding；无法写时 gate 由缺项阻断；pre-check index generator 不读取 check。 |
| `evidence-index.json` | `generate_evidence_index` + shared serializer | acceptance draft generators、no-static-evidence check、finalizer、future 06 trace reader | 只从 verified raw/report 派生；生成失败保留原 raw；06 的资格只来自 matching release seal。 |
| acceptance staging | release-owned three generators | required checks、release publisher、future trace reader | 只写 `reports/runs/<run_id>/acceptance-draft`；输入闭集为 pre-seal raw/report/index、冻结 blocker 与 residual；禁止读取 seal/final reports；发布失败不删除 staging。 |
| fixed acceptance files + manifest | single locked release publisher + manifest serializer | release finalizer、future 06 | 对 `reports/acceptance/.projection.lock` non-blocking OS advisory exclusive acquire，持有 open descriptor 到 seal 写完；文件存在/内容不代表锁且不入 evidence/digest/retention；acquire 失败即 invalid；checks 后逐文件 temp + replace，manifest 最后 replace；缺失/mixed/digest drift 不得 fallback。 |
| `gate-summary.json` | gate finalizer + shared serializer | final human gate report generator、future 06 reader | checks 和 release manifest（适用时）冻结后写一次；`single_suite` 禁止写；只有 matching passed release seal 是 acceptance input。 |
| review blocks | review recorder | future 06 under its own validation rule | seal 后 append-only safe record；不进入当前 run machine evidence。 |

所有 writer 在写 artifact 前应用 `03` §14、`04` safe-output floor 和 Step 10 forbidden-body allowlist。保留期仍是 `L2T-RR-013` 的运维/验收待确认项；这不影响 schema/digest 必须确定，也不能成为删除失败 artifact 的理由。

### 6.5 报告生成脚本与审查责任

| 脚本 | 输入 | planned 输出 | 人/Agent 审查重点 |
|---|---|---|---|
| `scripts/reports/generate_suite_reports.sh` | suite `report.json`、case records | `reports/runs/<run_id>/suites/<suite>.md` | case 全量、失败解释、blocked 分类和 profile |
| `scripts/reports/generate_gate_summary.sh` | final seal + check JSON | `summary.md`、`gate-results.md`、`dependency-boundary.md`、`artifact-report-pairing.md` | final safe-ref projection；full denominator、阻断、依赖、pairing |
| `scripts/reports/generate_evidence_index.sh` | raw case/suite + pre-index suite reports | machine `evidence-index.json`，then `evidence-index.md`、`evidence/<candidate_slot>.md` | machine先冻结；TC/DS/suite/artifact/report/AC/VF；human页不反向入index |
| `scripts/reports/generate_redaction_report.sh` | raw artifact + reports | `redaction-check.md` | forbidden corpus、失败输出安全、扫描范围 |
| `scripts/reports/generate_acceptance_handoff.sh` | same-run context/suite/case、pre-index suite reports、successful index、冻结 blocker、residual registry | `reports/runs/<run_id>/acceptance-draft/handoff.md`、`risk-acceptance.md` | 禁止 final report/seal input；不写 verdict/signoff/accepted risk |
| `scripts/reports/generate_veto_checklist.sh` | successful index + veto/NC case records + VF registry | `reports/runs/<run_id>/acceptance-draft/veto-checklist.md` | 不读 final checks；只写 VF 引用和缺口 |
| `scripts/reports/generate_open_issues.sh` | same-run source/derivation status + blocker/residual | `reports/runs/<run_id>/acceptance-draft/open-issues.md` | 不读 seal；不遗漏 blocker、缺陷和 residual |

脚本是 planned interface，当前不创建脚本或报告。脚本失败、参数不合法、schema 不匹配或输出未配对时，gate 状态必须是 `invalid_artifact`/`not_evaluated`，不能静默生成可交接证据。

固定根路径的生命周期契约如下：

| Surface | Provenance floor | 更新/保留规则 | 证据权限 |
|---|---|---|---|
| `reports/runs/<run_id>/acceptance-draft/*.md` | 每文件 front matter 必含 `projection_schema=l2-tools.acceptance-draft.v1`、fixed `source_run_id`、`source_evidence_index_ref=artifacts/test/<run_id>/evidence-index.json`、`source_evidence_index_digest`、`generated_at`、`generation_mode=regenerated_working_projection`；共同 `(source_run_id,source_evidence_index_digest)` 是 projection-set key | 只允许 release generator 对一个 fixed run 生成；四文件完成后冻结，required checks 扫描其 exact bytes | pre-check staging；不得写 final eligibility、verdict、signoff 或 accepted risk |
| `reports/acceptance/*.md` + `projection-manifest.json` | 四份 Markdown exact-byte copy staging；manifest 按 §6.4.5 closed schema/self-digest 绑定四对 path/digest | single publisher 持有 `.projection.lock` 到 seal 写完；consumer 读取 manifest M1、matching seal/index、四份 staging/published byte snapshots/front matter，再读 M2 并要求 `digest(M1)=digest(M2)`，之后只用 captured bytes、不重开 fixed paths；缺失/mixed/concurrent drift 拒绝整组 | fixed working projection；只有 matching passed release seal 可交未来 06；manifest 不签署、不接受风险 |
| `reports/review/reviewer-notes.md`、`agent-review.md` | 每个追加 block 必含 `review_schema=l2-tools.review-note.v1`、unique safe `review_block_id`、fixed `source_run_id`、`source_evidence_index_digest`、`source_gate_summary_digest`、`reviewed_at`、`reviewer_role`、`disposition=supplemented|disputed|needs_followup` | append-only；新 run 新增 block，不覆盖、重排或修改旧 block。修正追加同 source tuple 且含 `supersedes_review_block_id` 的 block | 人工说明，不进入 evidence index、gate summary 或机器 eligibility；不能改 raw status/digest，未来 06 是否消费由其正式规则决定 |

acceptance staging 只在 release checks 之前生成并进入该 release run redaction denominator，因此不得预填 `source_gate_summary_digest` 或任何 final status；fixed files 只有在 manifest 最后提交并由 passed release seal 绑定后才可消费。发布中途崩溃即使留下部分新 fixed files，也因旧/缺 manifest 或 digest mismatch 整组 invalid；不能 fallback 到旧 set。consumer 的判定输入是已捕获并校验的 manifest/seal/index/Markdown byte snapshot，第二次读取 manifest 后不得为同一判定重开 mutable fixed path。其它 gate 不覆盖该目录，也不把 stale acceptance set 当本 run 输入。review block 在 seal 后产生，不属于该 run 的 machine evidence；它只能含 body-free safe refs，若后续验收要把其内容作为裁决输入，必须由新版 06 定义独立校验/redaction门禁。

### 6.6 TC/证据/验收追溯规则

| 追溯方向 | 必须包含 | 缺失时处理 |
|---|---|---|
| TC -> evidence | `tc_ref`、`DS-L2T-*`、suite、run、case artifact、candidate slot | candidate 保持 planned/unavailable，不进入 eligible |
| evidence -> design | `03` module/object/protocol/flow/state/error 或 `04` CFG/V/B 参考 | 不能用“核心流程”泛名替代 |
| evidence -> requirement | 至少一个 `AC-L2T-*` 或 `VF-L2T-*`；design-only 风险需指向 Step 14 residual | 无 consumer 的 evidence 不得送验 |
| suite -> gate | gate、profile、script、status、check refs | 缺 gate provenance 为 invalid_artifact |
| report -> raw | 同一 run 的 artifact path/ref 和 digest | 不得引用 `latest` 或另一个 profile/run |
| defect -> retest | failed run、fixed run、原 TC、same family、suite/check | 关闭证据不完整，保持 open |

AC/VF 只是未来 `06` 的消费方向；当前没有验收 pass/fail、risk signoff 或真实 evidence alias。

### 6.7 Final seal eligibility 与真实性门禁

pre-check `evidence-index.json` 只写 `derivation_status`，不写 `L2EvidenceStatus`。未来某个 candidate slot 只有在 finalizer 消费同 run index 与 Step 9 §7.1.1 的 required check 闭集后，才可在 `gate-summary.json.evidence_eligibility` 标为 `eligible`（仍需 06 裁决）；只有 release seal 可成为 06 输入：

- fixed `run_id`、profile、suite 和 dataset provenance 完整；
- full denominator/无静默过滤，所有 case records 可定位；
- suite `report.json`、case artifact、stdout/stderr、human report 和必要 checks 一一配对；
- `check_redaction_boundary.sh` 为 clean，失败 artifact 也已扫描；
- `check_dependency_boundary.sh`、`check_blocker_truth.sh`、`check_artifact_report_pairing.sh` 和 `check_no_static_evidence.sh` 结果可追溯；
- local outcome/audit、Query no-write、Job boundedness、phase/unknown 和 safe handoff 断言符合对应正式 oracle；
- candidate 槽位只引用本 run raw records，未合并多个 run 的择优结果；
- 未将 fake、endpoint、health marker、planned ref 或 open blocker 升级为 accepted/executed/delivered/observed/readiness；
- `review_requirement_refs` 为空；非空时即使机器门禁全过也只能 `pending_review`；
- 人/Agent review 仅补解释、缺口和 residual，不替代 raw artifact 或自动签署。

任一条件失败时，按 §6.4.5 的确定映射写 `ineligible`、`invalid`、`unavailable` 或 `pending_review`；`not_evaluated` 只属于 source case/suite/check 状态，映射到 final `unavailable`，不得成为 `L2EvidenceStatus` 或证据通过。

### 6.8 证据流图

#### 证据流图: L2-tools 从测试运行到验收交接

```text
[TC + DS + profile]
          |
          v
[suite runner / gate]
          |
          +--> artifacts/test/<run_id>/suites/<suite>/
          |       report.json + cases + safe journals
          v
[pre-index suite report generators]
          |
          +--> reports/runs/<run_id>/
          |       suite reports
          v
[pre-check evidence derivation]
          |
          +--> evidence-index.json
          |       EV-CAND-L2T-* + derivation_status only
          +--> evidence pages + run-scoped acceptance staging
          v
[required checks -> final redaction]
          |
          +--> checks/<check_name>.json
          v
[release publisher -> fixed files -> projection manifest]
          |
          v
[gate finalizer]
          +--> gate-summary.json.evidence_eligibility
          +--> release manifest digest
          v
[safe final projections + append-only review]
          |
          +--> reports/runs/<run_id> final safe projections
          +--> reports/review/* append-only blocks
          v
[future 06 reads final seal + source-bound draft/review]
      AC/VF decision; no automatic signoff
```

关键说明：

- 图表达 raw artifact、报告和未来验收消费之间的追溯关系，不表达真实执行已经发生。
- `EV-CAND-L2T-*` 是设计期槽位；pre-check item 只有 `derivation_status`，只有 final seal item 使用 `L2EvidenceStatus`。
- run-scoped acceptance staging 是 source-bound 可重生成输入；`reports/acceptance/*` 是 manifest-committed fixed view；`reports/review/*` 是 append-only 人工记录。它们都不拥有业务 truth，也不能把 blocked/unavailable 改名为 pass/readiness。

## 7. 对上游设计的影响判定

| 结论 | 是否回写上游 | 处理 |
|---|---|---|
| artifact/report schema 和 evidence derivation | 否 | 测试工具与验收交接设计，不改变 `03` 业务对象。 |
| redaction/dependency/no-write/pair checks 进入 evidence gate | 否 | 直接承接 `03`/`04`/Step 10 不变量。 |
| 需要新增业务字段才能产出 case artifact | 是 | 回写 `03`，禁止在测试 schema 中私造业务字段。 |
| 06 要求不同 EV/AC/VF 命名或保留策略 | 是 | 由新版 `06` 明确后回写 Step 13/14；当前只保留 candidate family。 |
| 证据 retention、source commit、measurement authority 未闭 | pending | 以 `L2T-UP-006~007` 和待确认事项承接，不伪造 commit/天数/阈值。 |

## 8. 回填草稿（正式 05 §13）

> 校准来源：
> - `design-calibration/05_test_plan_step_13_evidence.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“Evidence identity 与状态规则”“Candidate evidence family 与主 suite 映射”“Raw artifact 目录结构”“Raw artifact 最小字段契约”“Evidence eligibility 与真实性门禁”和“证据流图”小节，了解 planned evidence 如何由未来真实运行派生并交给新版 06。

正式 §13 应规定：原始机器证据统一进入 `artifacts/test/<run_id>`，人类报告与 release-only acceptance staging 进入 `reports/runs/<run_id>`；checks 完成后由 publisher 逐文件更新 `reports/acceptance` 并最后写 projection manifest，source-tuple append-only 审查补充进入 `reports/review`。每个 suite、case、check 和报告必须绑定同一固定 run、profile、dataset、TC 和 candidate EV 槽位；pre-check evidence index 只能由 raw artifact/report 派生，final seal 再绑定 index、规范 check 闭集与 release manifest（适用时）。失败、blocked、not_evaluated、invalid artifact 和 publication failure 均保留安全材料。candidate derivation 不等于 final eligibility，final eligibility 也不等于验收通过、readiness 或签署。

## 9. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 06 的正式 evidence consumer / VETO 裁决编号 | 影响 `ac_refs`、`veto_refs` 的最终闭口 | 当前引用 `AC-L2T-*`/`VF-L2T-*` 方向，不生成 06 结论。 |
| 实际测试 runner 和 artifact writer | 影响具体 JSON writer、命令和 digest 实现 | 只固定外层 schema/路径/安全规则，不伪造实现命令。 |
| source commit / workspace baseline | 影响 provenance | 当前 workspace 有未提交输入，使用 `uncommitted`/`not_available` marker，不填假 commit。 |
| evidence retention 天数和介质 | 影响归档运维 | 保留到验收及缺陷复验关闭；具体天数交给 06/运维标准。 |
| 性能 measurement authority | 影响 NFR evidence 是否可作硬门禁 | 只输出 sample provenance，不输出数值 pass。 |
| provider / Sandbox / Observability positive route | 影响 P1 evidence | 继续 `blocked_dependency`/conditional；不分配正向 EV 实例。 |

## 10. 证据归档停审与跨证据真实性审计

### 10.1 停审记录

| 审查项 | 结论 | 缺口/修正 |
|---|---|---|
| 每个 P0 candidate family 有主 suite、TC 和 AC/VF 方向 | 通过 | §6.2、§6.6；不新增业务 family。 |
| artifact/report 路径符合标准 | 通过 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance`。 |
| failed/blocked/not_evaluated 是否保留 | 通过 | 统一保留并执行 redaction。 |
| evidence index 是否只能由 raw 派生 | 通过 | `check_no_static_evidence.sh` 作为 planned gate。 |
| 证据是否会伪造 provider/readiness/accepted | 通过 | eligibility 门禁明确禁止。 |
| 人/Agent 是否越权签署 | 通过 | 仅审查补充，06 负责裁决。 |
| source commit、retention、performance threshold 是否被伪造 | 通过 | 均列 pending/待确认。 |
| 机器 artifact schema 是否可直接编码 | 通过（Step 15 装配复核后回补） | 固定 local DTO owner、`l2-tools.test-artifact.v1`、required/conditional 字段、closed enum、`sha256` canonicalization/self-exclusion、stdout/stderr exact-byte digest、reader/writer 和失败保留；不再把算法留给实现者。 |
| fixed acceptance 投影是否依赖不可实现的多文件原子替换 | 通过（2026-08-07 终审回补） | 改为 immutable run staging、逐文件 replace、manifest-last publication marker、seal 绑定 manifest digest；partial/mixed/concurrent drift 均 fail closed。 |

### 10.2 跨证据真实性/追溯审计表

| 审计项 | 结论 | 处理 |
|---|---|---|
| candidate EV 是否有 orphan TC | 未发现；Step 5/6 已建立 family 映射 | 新增 TC 必须先更新 Step 5/6/9。 |
| TC 是否有 orphan dataset 或 suite | 未发现；Step 7/9 已建立唯一入口 | 实现 manifest 必须保持一对多 case 映射可追溯。 |
| evidence 是否引用另一个 run/profile | 设计上禁止 | pairing check 失败则 `invalid_artifact`。 |
| 是否可以把失败/blocked 拼成通过 | 不可以 | status 保持原值，gate 阻断或 residual。 |
| raw body/secret 是否可能进入失败日志或报告 | 设计上禁止 | redaction scan 覆盖所有 artifact/report surface。 |
| 是否把 health marker/fake/ref 当真实事实 | 不可以 | blocker truth 和 no-static check 阻断。 |
| 是否存在静态 evidence index | 设计上禁止 | index 必须从本 run raw records 派生。 |
| 是否提前定义验收签署或 risk acceptance | 不存在 | manifest-committed `reports/acceptance` 仍只为 working draft，角色待 06 确认。 |

## 11. 进入下一步条件

- [x] P0 candidate evidence family、主 suite、TC、artifact/report、AC/VF 追溯已固定。
- [x] raw artifact、case record、suite report、check 和 evidence index 的完整 local DTO、字段类型/值域、schema/digest、writer/reader 和失败保留契约已定义，并在 Step 15 复核通过。
- [x] failed/blocked/not_evaluated/invalid artifact 的保留和安全扫描规则明确。
- [x] `latest`、静态 evidence、假 commit、真实 run、provider readiness 和验收签署均被禁止。
- [x] 证据归档停审和跨证据真实性/追溯审计无 unresolved 冲突。
- [x] 可进入 Step 14。

## 12. Step 13 停审记录

| 项 | 结论 |
|---|---|
| Step 状态 | `accepted_for_step_13 / proceed_to_step_14` |
| 停审时间 | 2026-08-06（设计审查记录；非测试执行时间） |
| 上游 blocker | `L2T-UP-001~009` 仍 open；provider/route/readiness 证据保持 blocked/conditional。 |
| 正式文档写入 | 未写；Step 15 前保持锁定。 |
| 下一步 | Step 14 回归策略与残余风险。 |
