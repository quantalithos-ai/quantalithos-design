# L4-observability 05-测试方案 Step 13 · 测试报告与证据归档

> 对应标准：`standards/document/测试方案讨论流程_SOP.md` Step 13；
> `standards/document/测试方案书写规范.md` §5.13。
> 本文件是 current calibration 中间产物，不是正式 `05-测试方案.md`，不包含任何真实执行结论。

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `05-测试方案.md` |
| step | `13 / 定义测试报告与证据归档` |
| mode | `full-restart` |
| status | `completed_with_inherited_affected_open` |
| current_module | `run_scoped_evidence_archive_and_provenance` |
| direct_input | current Step 05~12；Step 09 的 9 suite/5 script contract；Step 07 的 82 dataset；current `00` §14.2~§14.4 的 AC/VF inputs |
| formal_document_write | `not_allowed_until_step_15` |
| implementation / test execution | `not_started` / `not_run` |
| artifact / report / evidence | `absent_by_design`；`EV-CAND-OBS-*` 仍是 planned linkage，不是真实 alias |
| new_upstream_blocker | `none` |
| inherited_blocker | 12 项 inherited blocker / affected 保持开放，见 §12 |
| next_allowed_action | `rebuild_current_05_step_14` |
| commit | 不需要；用户未要求提交 |

旧 Step 13 只有 65 行，混用了未在 `03` 冻结的脚本、旧 evidence family 和泛化路径；本轮不沿用旧稿，按
current Step 09 的五个脚本、Step 12 的真实性门禁和 SOP 的标准目录全量重建。

## 1. 本步目标与边界

本 Step 固定测试执行后机器证据、人类可读报告、候选证据索引、验收交接初稿和人工 / Agent 审查材料的
来源、路径、身份和保留边界。它必须使任意一个未来 P0 用例都能沿以下关系逆向复核：

```text
TC-OBS-* + DS-OBS-*
        -> raw case artifact
        -> suite report / check report
        -> run-scoped evidence index
        -> EV-CAND-OBS-* candidate linkage
        -> 06 的验收引用与真实裁决
```

本 Step 只定义 producer contract，不创建 `artifacts/`、`reports/` 或真实运行文件；不生成真实 `run_id`、
正式 `EV-OBS-*` alias、测试通过结果、验收 verdict、signoff 或 release decision。

## 2. 输入、权威顺序与历史材料处理

| 优先级 | 输入 | 本 Step 的使用方式 |
|---|---|---|
| 1 | `standards/document/测试方案讨论流程_SOP.md` Step 13 | 固定输出物、标准目录、失败保留、停审与跨证据审计要求 |
| 2 | `standards/document/测试方案书写规范.md` §5.13 | 固定 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 acceptance/review 结构 |
| 3 | current Step 09 | 唯一 suite、lane/profile、五个 planned script、raw record 和 failure 语义 |
| 4 | current Step 12 | entry/exit、blocked/not_run/conditional、`latest` 禁止和真实性门禁 |
| 5 | current Step 05~08、10~11 | TC/EV、dataset、环境、专项、缺陷和复验回指 |
| 6 | current `00-需求文档.md` §14.2~§14.4 | `AC-OBS-001~031` 与 `VF-OBS-001~010` 的唯一上游引用方向；`06` 只作为下游验收消费者 |
| 7 | L1-governance / L1-artifact Step 13 | 只参考证据粒度、审查结构和 retention marker 口径，不复制其业务 ID 或脚本 |

| 历史材料 | 冲突 | current 处置 |
|---|---|---|
| 旧 Step 13 | 使用 `EV-OBS-*`、`latest` 风险和未冻结的 report generator | 标记 `historical_material`；只保留差异诊断 |
| 旧 `05` / `06` | 把 candidate EV 写成已存在的证据或验收输入 | current 只允许 `EV-CAND-OBS-*` planned linkage |
| Step 09 逻辑文件名 | `run-summary.md`、`checks/*` 等内部命名与 SOP 的 canonical 文件名不完全相同 | SOP canonical 路径优先；Step 09 名称只作为 raw producer 内部记录映射，不形成第二 truth source |
| README/旧性能资料 | 固定 P95、保留天数、产品 backend 或平台结果 | 不进入本 Step；无正式来源的数字只能记录 sample/trend |

## 3. SOP 问题回答

| 问题 | current 回答 |
|---|---|
| 每类测试输出什么证据 | 每个 primary suite 输出同 run 的 suite metadata、case result、stdout/stderr、failure reason、dataset/input manifest；三个独立 check 输出原始 finding；report generator 再生成 summary、gate、suite、evidence-index 和 provenance report。 |
| 证据保存在哪里 | 机器原始证据唯一进入 `artifacts/test/<run_id>`；人类可读报告唯一进入 `reports/runs/<run_id>`；验收交接初稿进入 `reports/acceptance`；人工/Agent 复核补充进入 `reports/review`。 |
| 如何关联用例与验收项 | run metadata、case record 和 evidence index 必须同时记录 `run_id`、`suite_id`、exact `TC-OBS-*`、`DS-OBS-*`、lane/profile、artifact path、report path、candidate EV、AC/VF refs 和 digest。任何缺一项都不能形成完整 P0 linkage。 |
| 哪些日志、trace、snapshot 必须保留 | 必须保留可脱敏的 suite report、case record、stdout/stderr、failure summary、redaction/metric/dependency finding、source/config/dataset manifest、必要的 trace/audit ref；不要求保存 raw business body、provider response 或 evidence/artifact body。 |
| 保留多久 | 本 Step 不伪造固定天数。每个 run 记录 `retention_marker`、`hold_state`、`active_reference_count`、`archive_eligibility` 和 `cleanup_decision`；实际 TTL 由归档 owner 后续确定，且不能覆盖 active/held/referenced protection。 |
| 原始机器证据是否统一进入标准根 | 是，必须是 `artifacts/test/<run_id>`，不得增加项目子目录、不得使用 `latest`。 |
| 人类可读报告是否统一进入标准根 | 是，必须是 `reports/runs/<run_id>`，报告只能从同 run raw artifact 生成。 |
| 验收交接报告是否自动通过 | 否。脚本可以生成初稿，但 `reports/acceptance/*` 必须由人或 Agent 审查补充；它不是 `06` 的签署。 |
| 哪些报告由脚本生成 | 仅使用 Step 09 冻结的 `scripts/reports/generate_reports.sh`；它从 raw artifact 生成 suite report、summary、gate-results、evidence-index、redaction/metric/dependency provenance 引用和 acceptance/review 初稿所需输入。不得新增 generator script。 |
| 失败 suite 是否保留 | 必须保留。失败、超时、flaky、blocked、not_run 和 artifact integrity failure 都要有 suite metadata、可脱敏 `report.json` 或 failure record、stdout/stderr、failure reason 和 input/dataset manifest；无法写入 failure record 时整个 run 的 evidence gate 为 blocked。 |
| 如何证明 redaction / boundary 安全 | `check_redaction.sh`、`check_metric_labels.sh`、`check_dependency_boundary.sh` 在同一 run 上读取 raw artifact 与 generated report，并输出独立 check report；check 自身也必须经过脱敏。未执行不等于 clean。 |
| 每个 P0 EV 是否能回指真实 artifact | 是。`EV-CAND-OBS-*` 只能由 `TC -> case artifact -> suite report -> evidence-index` 的实际关系产生；静态表、设计文档、空模板或上次 run 不能产生 candidate result。 |

## 4. 身份模型与真实性规则

### 4.1 四类标识不可混用

| 标识 | 含义 | current 阶段状态 | 禁止混用 |
|---|---|---|---|
| `TC-OBS-*` | 设计期稳定测试用例 ID | 已定义 99 个 | 不是执行结果、artifact 或 evidence |
| `DS-OBS-*` | 设计期稳定数据集 ID | 已定义 82 个 | 不是 `run_id`、Job identity 或业务 truth |
| `EV-CAND-OBS-*` | 设计期到未来执行的候选证据关联键 | 已定义 99 个，planned | 不是正式 evidence alias、AC pass 或 signoff |
| `<run_id>` | 一次真实测试 invocation 的唯一身份 | 当前不存在 | 不得由文档、时间戳模板或 `latest` 伪造 |

真实执行时，candidate evidence 的最小唯一定位键为：

```text
(run_id, suite_id, tc_id, dataset_id, profile, lane, artifact_digest, report_digest)
```

如果同一 TC 在另一个 lane/profile 或重试 invocation 运行，必须产生独立 raw record 和 attempt linkage，
不能覆盖原记录或把多个 lane 拼成单一绿色结果。

### 4.2 状态真实性

允许的 run/case/suite 状态为 `planned`（设计期）、`passed`、`failed`、`blocked`、`not_run`、
`conditional`、`indeterminate`。`planned` 不能出现在真实执行报告中而不附解释；`blocked`、`not_run`、
`indeterminate` 不得被汇总成 `passed`。`eligible_to_exit` 仍只是测试轮次状态，不是验收 verdict。

## 5. Canonical 归档目录

以下目录是 SOP 规定的 canonical 结构。实现者可以在 suite 目录增加不敏感辅助文件，但不得改变根路径、
run identity 或必需文件名。

```text
artifacts/test/<run_id>/
  meta/context.json
  meta/source-manifest.json
  meta/config-manifest.json
  meta/dataset-manifest.json
  gate-results.json
  evidence-index.json
  suites/<suite_id>/
    suite-metadata.json
    report.json
    cases/<tc_id>.json
    stdout.log
    stderr.log
    failure-summary.json
    input-manifest.json
    dataset-manifest.json
    checks/
      redaction.raw.json
      metric-label.raw.json
      dependency-boundary.raw.json

reports/runs/<run_id>/
  summary.md
  evidence-index.md
  gate-results.md
  redaction-check.md
  metric-label-check.md
  dependency-boundary.md
  report-audit.md
  input-integrity.md
  suites/<suite_id>.md
  evidence/<ev-candidate-id>.md

reports/acceptance/
  handoff.md
  veto-checklist.md
  risk-acceptance.md
  open-issues.md

reports/review/
  reviewer-notes.md
  agent-review.md
```

`artifacts/test/<run_id>/evidence-index.json` 与 `reports/runs/<run_id>/evidence-index.md` 必须由同一
raw artifact 关系推导；前者不是独立的手写输入。`reports/runs/<run_id>/evidence/` 中的页面如果生成，
也只能是 index 的可读投影，不能产生第二个 EV identity。

## 6. Raw artifact producer contract

### 6.1 `run_ci_gate.sh` 的 raw 输出

唯一 gate script 为 `scripts/gates/run_ci_gate.sh`。它承接 Step 09 的参数：
`--run-id`、`--artifact-root`、`--config-profile`。实际 suite 选择由编排层提供的 manifest 决定，不在
本 Step 新增 `--suite`、`--gate` 或 release 专用脚本。

每个 required suite 至少写出：

| record | 必需字段 | 真实性约束 |
|---|---|---|
| `meta/context.json` | run、invocation、source/config snapshot ref、lane/profile、clock、trigger context | 不写 environment ready、verdict 或 signoff |
| `suite-metadata.json` | suite、run、TC set、dataset set、lane/profile、attempt、status、时间语境 | status 必须由真实 case/check 归纳；设计期不得预填 passed |
| `cases/<tc_id>.json` | exact TC、primary suite、DS refs、assertion refs、status、failure/recovery class、safe diagnostic、record digest | 不含 raw body、secret、provider response、完整业务正文 |
| `report.json` | case summary、status、failure reason、artifact refs、producer version | 失败/阻塞也必须生成；无法解析则留下 failure record 并阻断 report |
| `stdout.log` / `stderr.log` | 脱敏执行诊断 | 不得将日志脱敏失败隐藏为 empty |
| `failure-summary.json` | timeout/flaky/input/dependency/check/integrity reason、affected cases、attempt refs | 不得删除第一次失败或改写成默认成功 |
| `input-manifest.json` / `dataset-manifest.json` | source/config/schema/dataset digest、fixture namespace、cleanup state | namespace 不是业务 run/evidence identity；缺 manifest 视为 incomplete |

### 6.2 失败、阻塞和未运行的保留规则

| 情形 | 必须保留 | 退出语义 |
|---|---|---|
| suite/case failed | 已执行 case、failure summary、stdout/stderr、输入 manifest、safe diagnostic | `failed`；进入 Step 11 缺陷/复验，不删除 |
| required lane unavailable | suite metadata、precondition finding、未执行 case 清单、环境探针摘要 | `blocked` 或 `not_run`，不能 fallback |
| RuntimeLike 未建立 | selected suite 的 not-evaluated record、缺失前置和恢复动作 | `not_run`/`blocked`；不能以 CI 结果代替 |
| flaky / timeout | 每次 attempt 的结果、最后状态和重跑关系 | `failed` 或 `indeterminate`，由 Step 11 裁决 |
| artifact 写入失败 | 可写出的 failure marker、stderr、root/integrity 信息 | 整轮 `blocked`；不能生成完整 evidence index |
| inherited affected | controlled negative / fail-closed material、owner、恢复前置 | `conditional`/`blocked`；不得生成 positive evidence |

## 7. Report producer 与 provenance contract

唯一报告脚本为 `scripts/reports/generate_reports.sh`。它读取同一 `<run_id>` 的 raw root，并将 Step 09
内部逻辑文件映射到标准 canonical 文件，不允许双写两个同义报告作为两个事实源。

| canonical report | 输入 | 最小内容 | 缺失/失败处置 |
|---|---|---|---|
| `summary.md` | 全部 suite metadata、case result、gate/check status | suite 状态、TC 覆盖、blocked/not_run/conditional、缺陷和 residual refs | 缺任一 required suite 或完整性信息则 `blocked` |
| `evidence-index.md` | `evidence-index.json`、case/report provenance | 99 candidate linkage 的实际存在状态、TC/DS/suite/lane、artifact/report/digest、AC/VF refs | orphan/duplicate/missing artifact 或静态映射则 nonzero/blocked |
| `gate-results.md` | gate raw output、三个 check raw output、required suite manifest | gate/check 状态、failure reason、attempt 和影响范围 | 不得只汇总通过数；未执行显示 `not_run` |
| `redaction-check.md` | `check_redaction.sh` raw output | scanner input digest、safe finding、命中类型、处置 | raw body/secret 或 scanner 不可执行为阻断 |
| `metric-label-check.md` | `check_metric_labels.sh` raw output | metric descriptor/sample、allowlist digest、违规类型 | 未声明 label/高基数/无法解析为阻断 |
| `dependency-boundary.md` | `check_dependency_boundary.sh` raw output | manifest/module graph digest、允许边、违规边、writer capability finding | non-core compile edge 或扫描缺失为阻断 |
| `report-audit.md` | report input graph和生成过程 | source raw path、generator contract、run matching、static evidence/latest/final-verdict scan | provenance 不完整为阻断 |
| `suites/<suite_id>.md` | 对应 suite raw `report.json` | 可读 case 摘要、dataset、失败/阻塞原因和 raw refs | 不得隐藏 failed/blocked/not_run |

报告生成必须遵守：

1. 不读取 `latest`、上次 run 或设计文档来补当前 run。
2. 不修改业务 source truth、observation owner、artifact raw input 或测试结果。
3. 不将 `Prepared` / `Delivered`、sink acknowledgement、metric clean 或 report generated 写成验收通过。
4. 不把 candidate evidence 升级为正式 alias；`06` 只消费未来真实 run 的可验证引用。

## 8. 99 个 TC 与 99 个 candidate EV 的精确追溯

### 8.1 数量与 primary suite 归属

Step 09 的 exact mapping 是唯一主归属表。Step 13 要求报告生成器对该表执行严格 join，而不是复制一张
静态 evidence 表。当前设计计数如下：

| primary suite | exact TC 数 | exact EV 数 | 主 lane/profile | canonical suite report |
|---|---:|---:|---|---|
| `S-OBS-CONTRACT-DOMAIN` | 10 | 10 | `ENV-CI-ISO` / `LocalTest` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `S-OBS-SERVICE-FLOW` | 24 | 24 | `ENV-CI-ISO` / `LocalTest`，必要时独立 INT follow-up | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `S-OBS-REPOSITORY-CONFORMANCE` | 12 | 12 | `ENV-CI-INT` / `IntegrationLike` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `S-OBS-ENTRY-CAPABILITY` | 5 | 5 | ISO/INT 按 exact case | `reports/runs/<run_id>/suites/S-OBS-ENTRY-CAPABILITY.md` |
| `S-OBS-RECOVERY-REPLAY` | 12 | 12 | `ENV-CI-INT` / `IntegrationLike`；J06 controlled blocked | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `S-OBS-CONFIG-REDLINE` | 6 | 6 | `ENV-CI-ISO` / `LocalTest` | `reports/runs/<run_id>/suites/S-OBS-CONFIG-REDLINE.md` |
| `S-OBS-TELEMETRY-SAFETY` | 11 | 11 | ISO，必要时独立 INT check | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `S-OBS-STATIC-REDLINE` | 12 | 12 | `ENV-CI-ISO` / `LocalTest` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `S-OBS-RELEASE-SMOKE` | 7 | 7 | `ENV-STG-RT` / `RuntimeLike` | `reports/runs/<run_id>/suites/S-OBS-RELEASE-SMOKE.md` |
| **合计** | **99** | **99** | 6 lane / 3 profile | run-scoped only |

### 8.2 一一对应规则

对 Step 09 每一行 `TC-OBS-X`，报告生成必须得到且只能得到同号 `EV-CAND-OBS-X`。机器可判定的 join 条件为：

```text
tc_id == tc_ref
candidate_ev_id == "EV-CAND-OBS-" + suffix(tc_id)
primary_suite == suite_id
artifact.run_id == report.run_id == evidence_index.run_id
dataset_ref ∈ Step07 exact dataset set
lane/profile == case execution context
```

以下任一情况都构成 evidence provenance failure：TC 无 case artifact、candidate EV 无 TC、同一 TC 有多个
primary suite、同一 candidate EV 指向多个不相容 digest、artifact/report run 不一致、dataset 不在 82 个
current dataset 中、或用 static table 直接填充 `status=passed`。

### 8.2.1 99 条 exact execution / evidence index

下表是由 Step 07 的 exact dataset mapping 与 Step 09 的 primary-suite mapping 做出的设计期 join。它是未来
报告生成器必须实现的逐条 contract，不是静态 evidence 结果。表中 `planned`、`planned_conditional` 和
`planned_not_evaluated` 只表达设计期执行处置；`artifacts/test/<run_id>` 与 `reports/runs/<run_id>` 只有
真实 invocation 后才能存在。每一行必须保持一个 primary suite、至少一个 exact dataset、同号 candidate EV
和同一 run 的 raw/report 路径。

| TC | primary suite | lane/profile | exact dataset refs | candidate EV | planned disposition | raw case artifact | suite report |
|---|---|---|---|---|---|---|---|
| `TC-OBS-COR-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-CORRELATION-001`,`DS-OBS-STATE-CORRELATION-001 | `EV-CAND-OBS-COR-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONTRACT-DOMAIN/cases/TC-OBS-COR-001.json` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `TC-OBS-RED-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-STATE-SAFETY-001`,`DS-OBS-INTAKE-001 | `EV-CAND-OBS-RED-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONTRACT-DOMAIN/cases/TC-OBS-RED-001.json` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `TC-OBS-AUD-003` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-AUDIT-001`,`DS-OBS-READ-SURFACE-001 | `EV-CAND-OBS-AUD-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONTRACT-DOMAIN/cases/TC-OBS-AUD-003.json` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `TC-OBS-EVD-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-EVIDENCE-001`,`DS-OBS-STATE-EVIDENCE-001 | `EV-CAND-OBS-EVD-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONTRACT-DOMAIN/cases/TC-OBS-EVD-001.json` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `TC-OBS-SIG-003` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-SIGNAL-001`,`DS-OBS-READ-SURFACE-001 | `EV-CAND-OBS-SIG-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONTRACT-DOMAIN/cases/TC-OBS-SIG-003.json` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `TC-OBS-DEG-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-READ-SURFACE-001`,`DS-OBS-STATE-DEGRADED-001 | `EV-CAND-OBS-DEG-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONTRACT-DOMAIN/cases/TC-OBS-DEG-001.json` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `TC-OBS-DIA-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-DIAGNOSTIC-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-DIA-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONTRACT-DOMAIN/cases/TC-OBS-DIA-001.json` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `TC-OBS-AUT-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-HANDOFF-001`,`DS-OBS-EVIDENCE-001`,`DS-OBS-STATE-AUTHENTICITY-001 | `EV-CAND-OBS-AUT-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONTRACT-DOMAIN/cases/TC-OBS-AUT-001.json` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `TC-OBS-AUT-002` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-HANDOFF-NEG-001`,`DS-OBS-STATE-AUTHENTICITY-001 | `EV-CAND-OBS-AUT-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONTRACT-DOMAIN/cases/TC-OBS-AUT-002.json` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `TC-OBS-RET-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-RETENTION-001`,`DS-OBS-STATE-RETENTION-001 | `EV-CAND-OBS-RET-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONTRACT-DOMAIN/cases/TC-OBS-RET-001.json` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `TC-OBS-ING-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT UoW follow-up` | DS-OBS-INTAKE-001`,`DS-OBS-UOW-ORDER-001 | `EV-CAND-OBS-ING-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-ING-001.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-ING-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-INTAKE-NEG-001 | `EV-CAND-OBS-ING-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-ING-002.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-ING-003` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT reservation follow-up` | DS-OBS-INTAKE-001`,`DS-OBS-IDEMPOTENCY-001 | `EV-CAND-OBS-ING-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-ING-003.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-ING-004` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT race follow-up` | DS-OBS-IDEMPOTENCY-001`,`DS-OBS-DIGEST-001 | `EV-CAND-OBS-ING-004` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-ING-004.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-COR-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-CORRELATION-001`,`DS-OBS-REF-NEG-001 | `EV-CAND-OBS-COR-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-COR-002.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-AUD-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT UoW follow-up` | DS-OBS-AUDIT-001`,`DS-OBS-UOW-ORDER-001`,`DS-OBS-OUTBOX-001 | `EV-CAND-OBS-AUD-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-AUD-001.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-AUD-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-REF-NEG-001`,`DS-OBS-AUDIT-001 | `EV-CAND-OBS-AUD-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-AUD-002.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-EVD-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-EVIDENCE-NEG-001`,`DS-OBS-SENTINEL-001 | `EV-CAND-OBS-EVD-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-EVD-002.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-EVD-003` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-EVIDENCE-001`,`DS-OBS-READ-SURFACE-001 | `EV-CAND-OBS-EVD-003` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-EVD-003.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-SIG-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT atomicity follow-up` | DS-OBS-SIGNAL-001`,`DS-OBS-CORRELATION-001`,`DS-OBS-UOW-ORDER-001 | `EV-CAND-OBS-SIG-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-SIG-001.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-DEG-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-GAP-001`,`DS-OBS-HANDOFF-NEG-001 | `EV-CAND-OBS-DEG-002` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-DEG-002.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-DEG-003` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-READ-SURFACE-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-DEG-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-DEG-003.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-QRY-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-READ-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-QRY-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-QRY-001.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-QRY-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-READ-001`,`DS-OBS-META-NEG-001 | `EV-CAND-OBS-QRY-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-QRY-002.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-QRY-003` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-READ-SURFACE-001`,`DS-OBS-READ-CORRUPT-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-QRY-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-QRY-003.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-RPT-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT UoW follow-up` | DS-OBS-HANDOFF-001`,`DS-OBS-EVIDENCE-001`,`DS-OBS-UOW-ORDER-001 | `EV-CAND-OBS-RPT-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-RPT-001.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-RPT-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-HANDOFF-NEG-001`,`DS-OBS-JOB-REPORT-NEG-001 | `EV-CAND-OBS-RPT-002` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-RPT-002.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-RET-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-RETENTION-001`,`DS-OBS-STATE-PROTECTION-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-RET-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-RET-002.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-EXT-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-PERIPHERAL-001`,`DS-OBS-TRUTH-COMPARISON-001 | `EV-CAND-OBS-EXT-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-EXT-001.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-EXT-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT seam follow-up` | DS-OBS-PERIPHERAL-001`,`DS-OBS-AVAILABILITY-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-EXT-002` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-EXT-002.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-OWN-003` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT store comparison` | DS-OBS-TRUTH-COMPARISON-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-OWN-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-OWN-003.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-TRUTH-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-TRUTH-COMPARISON-001 | `EV-CAND-OBS-TRUTH-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-TRUTH-001.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-TRUTH-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-TRUTH-COMPARISON-001`,`DS-OBS-SENTINEL-001 | `EV-CAND-OBS-TRUTH-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-TRUTH-002.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-NW-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-READ-001`,`DS-OBS-READ-SURFACE-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-NW-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/cases/TC-OBS-NW-001.json` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `TC-OBS-COR-003` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-CORRELATION-001`,`DS-OBS-CAS-CURSOR-001 | `EV-CAND-OBS-COR-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-COR-003.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-AUD-004` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-AUDIT-001`,`DS-OBS-UOW-FAILPOINT-001`,`DS-OBS-OUTBOX-001 | `EV-CAND-OBS-AUD-004` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-AUD-004.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-SIG-004` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-SIGNAL-001`,`DS-OBS-CAS-CURSOR-001 | `EV-CAND-OBS-SIG-004` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-SIG-004.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-DEG-004` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-READ-CORRUPT-001`,`DS-OBS-OUTBOX-CORRUPT-001 | `EV-CAND-OBS-DEG-004` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-DEG-004.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-RET-003` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-RETENTION-001`,`DS-OBS-CAS-CURSOR-001 | `EV-CAND-OBS-RET-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-RET-003.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-RET-004` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-RETENTION-001`,`DS-OBS-UOW-FAILPOINT-001`,`DS-OBS-OUTBOX-001 | `EV-CAND-OBS-RET-004` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-RET-004.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-UOW-001` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-UOW-ORDER-001`,`DS-OBS-OUTBOX-001 | `EV-CAND-OBS-UOW-001` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-UOW-001.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-UOW-002` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-UOW-FAILPOINT-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-UOW-002` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-UOW-002.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-UOW-003` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-COMMIT-UNKNOWN-001`,`DS-OBS-IDEMPOTENCY-001 | `EV-CAND-OBS-UOW-003` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-UOW-003.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-UOW-004` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-IDEMPOTENCY-001`,`DS-OBS-DIGEST-001 | `EV-CAND-OBS-UOW-004` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-UOW-004.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-UOW-005` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-CAS-CURSOR-001 | `EV-CAND-OBS-UOW-005` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-UOW-005.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-UOW-006` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-OUTBOX-001`,`DS-OBS-OUTBOX-CORRUPT-001 | `EV-CAND-OBS-UOW-006` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/cases/TC-OBS-UOW-006.json` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `TC-OBS-EVD-004` | `S-OBS-ENTRY-CAPABILITY` | `ENV-CI-ISO` / `LocalTest`; I05 positive remains blocked` | DS-OBS-EVIDENCE-NEG-001`,`DS-OBS-AVAILABILITY-001 | `EV-CAND-OBS-EVD-004` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-ENTRY-CAPABILITY/cases/TC-OBS-EVD-004.json` | `reports/runs/<run_id>/suites/S-OBS-ENTRY-CAPABILITY.md` |
| `TC-OBS-QRY-004` | `S-OBS-ENTRY-CAPABILITY` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-READ-FENCE-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-QRY-004` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-ENTRY-CAPABILITY/cases/TC-OBS-QRY-004.json` | `reports/runs/<run_id>/suites/S-OBS-ENTRY-CAPABILITY.md` |
| `TC-OBS-DIA-002` | `S-OBS-ENTRY-CAPABILITY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-READ-CORRUPT-001`,`DS-OBS-DEPENDENCY-CORPUS-001 | `EV-CAND-OBS-DIA-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-ENTRY-CAPABILITY/cases/TC-OBS-DIA-002.json` | `reports/runs/<run_id>/suites/S-OBS-ENTRY-CAPABILITY.md` |
| `TC-OBS-OWN-002` | `S-OBS-ENTRY-CAPABILITY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-DEPENDENCY-CORPUS-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-OWN-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-ENTRY-CAPABILITY/cases/TC-OBS-OWN-002.json` | `reports/runs/<run_id>/suites/S-OBS-ENTRY-CAPABILITY.md` |
| `TC-OBS-NW-002` | `S-OBS-ENTRY-CAPABILITY` | `ENV-CI-ISO` / `LocalTest`; INT source-writer audit follow-up` | DS-OBS-JOB-PLAN-001`,`DS-OBS-J06-BLOCKED-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-NW-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-ENTRY-CAPABILITY/cases/TC-OBS-NW-002.json` | `reports/runs/<run_id>/suites/S-OBS-ENTRY-CAPABILITY.md` |
| `TC-OBS-SIG-005` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-UOW-FAILPOINT-001`,`DS-OBS-RECOVERY-CLASS-001 | `EV-CAND-OBS-SIG-005` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-SIG-005.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-DEG-005` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-GAP-001`,`DS-OBS-SOURCE-VERSION-001`,`DS-OBS-READ-FENCE-001 | `EV-CAND-OBS-DEG-005` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-DEG-005.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-RPT-003` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike`; RT follow-up` | DS-OBS-EXTERNAL-INTENT-001`,`DS-OBS-EXTERNAL-OUTCOME-001 | `EV-CAND-OBS-RPT-003` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-RPT-003.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-RPT-004` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike`; RT follow-up` | DS-OBS-EXTERNAL-INTENT-001`,`DS-OBS-EXTERNAL-OUTCOME-001`,`DS-OBS-RECOVERY-CLASS-001 | `EV-CAND-OBS-RPT-004` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-RPT-004.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-REB-001` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-JOB-PLAN-001`,`DS-OBS-JOB-ITEM-001`,`DS-OBS-READ-FENCE-001 | `EV-CAND-OBS-REB-001` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-REB-001.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-REB-002` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-JOB-PLAN-NEG-001`,`DS-OBS-READ-CORRUPT-001`,`DS-OBS-SENTINEL-001 | `EV-CAND-OBS-REB-002` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-REB-002.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-REB-003` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-CLAIM-FENCE-001`,`DS-OBS-STATE-JOB-ITEM-001 | `EV-CAND-OBS-REB-003` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-REB-003.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-REB-004` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-JOB-RESUME-001`,`DS-OBS-COMMIT-UNKNOWN-001`,`DS-OBS-JOB-REPORT-001 | `EV-CAND-OBS-REB-004` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-REB-004.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-REB-005` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-ISO` / `LocalTest` controlled blocked lane` | DS-OBS-J06-BLOCKED-001`,`DS-OBS-STATE-REPLAY-COORD-001 | `EV-CAND-OBS-REB-005` | `planned_blocked_controlled` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-REB-005.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-UOW-007` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike`; RT follow-up` | DS-OBS-EXTERNAL-INTENT-001`,`DS-OBS-EXTERNAL-OUTCOME-001`,`DS-OBS-RECOVERY-CLASS-001 | `EV-CAND-OBS-UOW-007` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-UOW-007.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-UOW-008` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-JOB-ITEM-001`,`DS-OBS-JOB-REPORT-001`,`DS-OBS-JOB-REPORT-NEG-001 | `EV-CAND-OBS-UOW-008` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-UOW-008.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-NFR-003` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | DS-OBS-RECOVERY-CLASS-001`,`DS-OBS-COMMIT-UNKNOWN-001`,`DS-OBS-EXTERNAL-OUTCOME-001`,`DS-OBS-CLAIM-FENCE-001 | `EV-CAND-OBS-NFR-003` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/cases/TC-OBS-NFR-003.json` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `TC-OBS-CFG-001` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest`; INT/RT legality follow-up` | DS-OBS-CONFIG-PROFILES-001`,`DS-OBS-AVAILABILITY-001 | `EV-CAND-OBS-CFG-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONFIG-REDLINE/cases/TC-OBS-CFG-001.json` | `reports/runs/<run_id>/suites/S-OBS-CONFIG-REDLINE.md` |
| `TC-OBS-CFG-002` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-CONFIG-REDLINE-001`,`DS-OBS-SENSITIVE-REF-001 | `EV-CAND-OBS-CFG-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONFIG-REDLINE/cases/TC-OBS-CFG-002.json` | `reports/runs/<run_id>/suites/S-OBS-CONFIG-REDLINE.md` |
| `TC-OBS-CFG-003` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-CONFIG-PROFILES-001`,`DS-OBS-JOB-PLAN-001 | `EV-CAND-OBS-CFG-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONFIG-REDLINE/cases/TC-OBS-CFG-003.json` | `reports/runs/<run_id>/suites/S-OBS-CONFIG-REDLINE.md` |
| `TC-OBS-CFG-004` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-ACTIVATION-FAULT-001 | `EV-CAND-OBS-CFG-004` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONFIG-REDLINE/cases/TC-OBS-CFG-004.json` | `reports/runs/<run_id>/suites/S-OBS-CONFIG-REDLINE.md` |
| `TC-OBS-CFG-005` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-AVAILABILITY-001`,`DS-OBS-ACTIVATION-FAULT-001 | `EV-CAND-OBS-CFG-005` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONFIG-REDLINE/cases/TC-OBS-CFG-005.json` | `reports/runs/<run_id>/suites/S-OBS-CONFIG-REDLINE.md` |
| `TC-OBS-CFG-006` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-CONFIG-REDLINE-001`,`DS-OBS-TELEMETRY-SCHEMA-001 | `EV-CAND-OBS-CFG-006` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-CONFIG-REDLINE/cases/TC-OBS-CFG-006.json` | `reports/runs/<run_id>/suites/S-OBS-CONFIG-REDLINE.md` |
| `TC-OBS-RED-002` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-STATE-SAFETY-001`,`DS-OBS-INTAKE-NEG-001 | `EV-CAND-OBS-RED-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/cases/TC-OBS-RED-002.json` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `TC-OBS-RED-004` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-SENTINEL-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-RED-004` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/cases/TC-OBS-RED-004.json` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `TC-OBS-SIG-002` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-SENTINEL-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-SIG-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/cases/TC-OBS-SIG-002.json` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `TC-OBS-SIG-006` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-TELEMETRY-SCHEMA-001`,`DS-OBS-SENTINEL-001 | `EV-CAND-OBS-SIG-006` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/cases/TC-OBS-SIG-006.json` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `TC-OBS-DIA-003` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-SIGNAL-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-DIA-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/cases/TC-OBS-DIA-003.json` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `TC-OBS-RPT-005` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-TELEMETRY-SCHEMA-001`,`DS-OBS-SENTINEL-001 | `EV-CAND-OBS-RPT-005` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/cases/TC-OBS-RPT-005.json` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `TC-OBS-AUT-003` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-STATE-AUTHENTICITY-001`,`DS-OBS-SENTINEL-001`,`DS-OBS-TELEMETRY-SCHEMA-001 | `EV-CAND-OBS-AUT-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/cases/TC-OBS-AUT-003.json` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `TC-OBS-RET-005` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-STATE-RETENTION-001`,`DS-OBS-DEPENDENCY-CORPUS-001 | `EV-CAND-OBS-RET-005` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/cases/TC-OBS-RET-005.json` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `TC-OBS-TRUTH-003` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-TELEMETRY-SCHEMA-001`,`DS-OBS-DEPENDENCY-CORPUS-001 | `EV-CAND-OBS-TRUTH-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/cases/TC-OBS-TRUTH-003.json` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `TC-OBS-NW-003` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-STATE-NOWRITE-001`,`DS-OBS-UOW-FAILPOINT-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-NW-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/cases/TC-OBS-NW-003.json` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `TC-OBS-NW-004` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest`; INT phase follow-up` | DS-OBS-HANDOFF-NEG-001`,`DS-OBS-EXTERNAL-OUTCOME-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-NW-004` | `planned_conditional` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/cases/TC-OBS-NW-004.json` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `TC-OBS-RED-003` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-TELEMETRY-SCHEMA-001 | `EV-CAND-OBS-RED-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-RED-003.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-DIA-004` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-DEPENDENCY-CORPUS-001 | `EV-CAND-OBS-DIA-004` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-DIA-004.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-DEP-001` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-DEPENDENCY-CORPUS-001 | `EV-CAND-OBS-DEP-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-DEP-001.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-DEP-002` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-DEPENDENCY-CORPUS-001`,`DS-OBS-META-001 | `EV-CAND-OBS-DEP-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-DEP-002.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-DEP-003` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-DEPENDENCY-CORPUS-001`,`DS-OBS-AVAILABILITY-001 | `EV-CAND-OBS-DEP-003` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-DEP-003.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-HIST-001` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-HISTORY-CORPUS-001 | `EV-CAND-OBS-HIST-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-HIST-001.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-HIST-002` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-HISTORY-CORPUS-001`,`DS-OBS-DEPENDENCY-CORPUS-001 | `EV-CAND-OBS-HIST-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-HIST-002.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-OWN-001` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-DEPENDENCY-CORPUS-001 | `EV-CAND-OBS-OWN-001` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-OWN-001.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-OWN-004` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-REF-NEG-001`,`DS-OBS-DEPENDENCY-CORPUS-001 | `EV-CAND-OBS-OWN-004` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-OWN-004.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-REB-006` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-DEPENDENCY-CORPUS-001 | `EV-CAND-OBS-REB-006` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-REB-006.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-NW-005` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-DEPENDENCY-CORPUS-001 | `EV-CAND-OBS-NW-005` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-NW-005.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-NFR-002` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | DS-OBS-CONFIG-REDLINE-001`,`DS-OBS-TELEMETRY-SCHEMA-001`,`DS-OBS-HISTORY-CORPUS-001 | `EV-CAND-OBS-NFR-002` | `planned` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/cases/TC-OBS-NFR-002.json` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `TC-OBS-REL-001` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | DS-OBS-INTAKE-001`,`DS-OBS-CORRELATION-001`,`DS-OBS-SENTINEL-001`,`DS-OBS-IDEMPOTENCY-001 | `EV-CAND-OBS-REL-001` | `planned_not_evaluated` | `artifacts/test/<run_id>/suites/S-OBS-RELEASE-SMOKE/cases/TC-OBS-REL-001.json` | `reports/runs/<run_id>/suites/S-OBS-RELEASE-SMOKE.md` |
| `TC-OBS-REL-002` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | DS-OBS-AUDIT-001`,`DS-OBS-EVIDENCE-001`,`DS-OBS-READ-SURFACE-001 | `EV-CAND-OBS-REL-002` | `planned_not_evaluated` | `artifacts/test/<run_id>/suites/S-OBS-RELEASE-SMOKE/cases/TC-OBS-REL-002.json` | `reports/runs/<run_id>/suites/S-OBS-RELEASE-SMOKE.md` |
| `TC-OBS-REL-003` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | DS-OBS-SIGNAL-001`,`DS-OBS-DIAGNOSTIC-001`,`DS-OBS-WRITE-SPY-001 | `EV-CAND-OBS-REL-003` | `planned_not_evaluated` | `artifacts/test/<run_id>/suites/S-OBS-RELEASE-SMOKE/cases/TC-OBS-REL-003.json` | `reports/runs/<run_id>/suites/S-OBS-RELEASE-SMOKE.md` |
| `TC-OBS-REL-004` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | DS-OBS-HANDOFF-001`,`DS-OBS-PERIPHERAL-001`,`DS-OBS-TRUTH-COMPARISON-001 | `EV-CAND-OBS-REL-004` | `planned_not_evaluated` | `artifacts/test/<run_id>/suites/S-OBS-RELEASE-SMOKE/cases/TC-OBS-REL-004.json` | `reports/runs/<run_id>/suites/S-OBS-RELEASE-SMOKE.md` |
| `TC-OBS-REL-005` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | DS-OBS-RETENTION-001`,`DS-OBS-JOB-PLAN-001`,`DS-OBS-J06-BLOCKED-001`,`DS-OBS-UOW-FAILPOINT-001 | `EV-CAND-OBS-REL-005` | `planned_not_evaluated` | `artifacts/test/<run_id>/suites/S-OBS-RELEASE-SMOKE/cases/TC-OBS-REL-005.json` | `reports/runs/<run_id>/suites/S-OBS-RELEASE-SMOKE.md` |
| `TC-OBS-EXT-003` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | DS-OBS-DEPENDENCY-CORPUS-001`,`DS-OBS-TELEMETRY-SCHEMA-001 | `EV-CAND-OBS-EXT-003` | `planned_not_evaluated` | `artifacts/test/<run_id>/suites/S-OBS-RELEASE-SMOKE/cases/TC-OBS-EXT-003.json` | `reports/runs/<run_id>/suites/S-OBS-RELEASE-SMOKE.md` |
| `TC-OBS-NFR-001` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | DS-OBS-EVIDENCE-DESIGN-001 | `EV-CAND-OBS-NFR-001` | `planned_not_evaluated` | `artifacts/test/<run_id>/suites/S-OBS-RELEASE-SMOKE/cases/TC-OBS-NFR-001.json` | `reports/runs/<run_id>/suites/S-OBS-RELEASE-SMOKE.md` |

### 8.3 测试切口到归档族与验收引用

| 测试切口 / candidate EV family | primary TC family | 主 suite | canonical report / evidence 页面 | 主要 AC/VF 引用 |
|---|---|---|---|---|
| `CUT-INGEST-ADMISSION` / `EV-CAND-OBS-ING-*` | `TC-OBS-ING-001~004` | service-flow | service suite + `evidence/EV-CAND-OBS-ING-*.md` | `AC-OBS-001/006`、`VF-OBS-002` |
| `CUT-CORRELATION-SOURCE` / `COR-*` | `TC-OBS-COR-001~003` | contract/service/repository | 对应 suite report | `AC-OBS-001/007/025` |
| `CUT-REDACTION-SAFETY` / `RED-*` | `TC-OBS-RED-001~004` | contract/telemetry/static | `redaction-check.md` + suite report | `AC-OBS-001/008/019/021/028`、`VF-OBS-002~003` |
| `CUT-AUDIT-PROJECTION` / `AUD-*` | `TC-OBS-AUD-001~004` | contract/service/repository | suite report + evidence page | `AC-OBS-002/009/020`、`VF-OBS-004` |
| `CUT-EVIDENCE-BODY-FREE` / `EVD-*` | `TC-OBS-EVD-001~004` | contract/service/entry | suite report + redaction check | `AC-OBS-002/010/020/027~028`、`VF-OBS-003` |
| `CUT-SIGNAL-PROJECTION` / `SIG-*` | `TC-OBS-SIG-001~006` | contract/service/repository/recovery/telemetry | suite report + metric check | `AC-OBS-003/011/021`、`VF-OBS-002/004` |
| `CUT-DEGRADED-VISIBILITY` / `DEG-*` | `TC-OBS-DEG-001~005` | contract/service/repository/recovery | suite report | `AC-OBS-003/012/029` |
| `CUT-QUERY-NOWRITE` / `QRY-*` | `TC-OBS-QRY-001~004` | service/entry | suite report + write-spy raw ref | `AC-OBS-004/013/022`、`VF-OBS-005` |
| `CUT-DIAGNOSTIC-GUARD` / `DIA-*` | `TC-OBS-DIA-001~004` | contract/entry/telemetry/static | suite report + dependency check | `AC-OBS-004/014/022`、`VF-OBS-005` |
| `CUT-REPORT-HANDOFF` / `RPT-*` | `TC-OBS-RPT-001~005` | service/recovery/telemetry | suite report + report-audit | `AC-OBS-004/015/022`、`VF-OBS-005~006` |
| `CUT-EVIDENCE-AUTHENTICITY` / `AUT-*` | `TC-OBS-AUT-001~003` | contract/telemetry | `report-audit.md` | `AC-OBS-004/016/022`、`VF-OBS-006/010` |
| `CUT-RETENTION-PROTECTION` / `RET-*` | `TC-OBS-RET-001~005` | contract/service/repository/telemetry | suite report + retention marker ref | `AC-OBS-005/017/023`、`VF-OBS-007` |
| `CUT-REBUILD-REPLAY-NOWRITE` / `REB-*` | `TC-OBS-REB-001~006` | recovery/static | suite report + write-spy/dependency ref | `AC-OBS-005/018/023`、`VF-OBS-005` |
| `CUT-UOW-IDEMPOTENCY-RECOVERY` / `UOW-*` | `TC-OBS-UOW-001~008` | repository/recovery | suite report + failpoint raw refs | `AC-OBS-029`、`VF-OBS-001/005` |
| `CUT-CONFIG-RUNTIME-REDLINE` / `CFG-*` | `TC-OBS-CFG-001~006` | config | suite report + config manifest | `AC-OBS-019~024/029~031`、`VF-OBS-002/008~010` |
| `CUT-DEPENDENCY-REDLINE` / `DEP-*` | `TC-OBS-DEP-001~003` | static | `dependency-boundary.md` | `AC-OBS-024/030`、`VF-OBS-008~009` |
| historical/reference scan / `HIST-*` | `TC-OBS-HIST-001~002` | static | `report-audit.md` | `AC-OBS-024/030~031`、`VF-OBS-009~010` |
| peripheral boundary / `EXT-*` | `TC-OBS-EXT-001~003` | service/release | suite report | `AC-OBS-022/024/030`、`VF-OBS-004/009` |
| ownership/truth/no-write / `OWN-*`,`TRUTH-*`,`NW-*` | exact Step 09 rows | service/entry/telemetry/static | suite reports + check reports | `AC-OBS-022/025~028/030`、`VF-OBS-003~005` |
| release smoke / `REL-*` | `TC-OBS-REL-001~005` | release-smoke | release suite report | `AC-OBS-001~005`、`VF-OBS-001`；当前 RT 未建立则 not evaluated |
| NFR / `NFR-*` | `TC-OBS-NFR-001~003` | release/recovery/static | summary + report-audit | `AC-OBS-029~031`、`VF-OBS-009~010`；sample/trend only where no source threshold |

表中的 `*` 只表示 exact IDs 已在 Step 06/09 固定；真实 index 必须展开每一行，不能将 wildcard 当成实际
evidence record。

## 9. 82 个 dataset 与证据归档关系

每个真实 case record 必须至少引用一个 Step 07 的 exact `DS-OBS-*`。dataset manifest 还必须记录：
fixture builder/type、允许 lane/profile、namespace、污染面、cleanup result、substitute/controlled 类型和
是否受到 inherited affected 约束。当前 82 个 dataset 的归档审计分组如下：

| dataset 组 | 数量 | 归档要求 | 禁止行为 |
|---|---:|---|---|
| canonical/fixture/static dataset | 54 | 每个 suite manifest 列 exact IDs 和 digest；静态 corpus 使用 read-only snapshot | 用空 fixture、旧 manifest 或默认值代替 |
| 27 个正式 state owner corpus | 27 | case 必须记录 exact owner、legal seed/negative seed 和 transition assertion | 跨 owner 复用同名状态、直接 seed 私有 enum |
| 1 个技术协调 item-state corpus | 1 | 与 Job report/claim/fence raw ref 配对，不计为业务 truth | 将技术 item state当作验收 truth |
| **合计** | **82** | 82/82 必须可由 manifest 反查 | 缺任何一个仍汇总为 complete |

`DS-OBS-EVIDENCE-NEG-001`、`DS-OBS-SENTINEL-001`、`DS-OBS-J06-BLOCKED-001` 等负向/blocked dataset 仍必须
进入 raw manifest；它们验证的是 fail-closed 或真实性边界，不是 positive evidence。

## 10. Check、redaction 与 report provenance 审查

### 10.1 三个独立 check

| check | 扫描面 | 必须输出 | 阻断条件 |
|---|---|---|---|
| `check_redaction.sh` | raw artifact、suite report、run report、acceptance/review 初稿 | safe finding、scanner/input digest、命中类型、case refs | raw body、secret、credential、provider/package/receipt body、完整敏感 ref 或 hash escape |
| `check_metric_labels.sh` | metric descriptor/sample、allowlist、report rendering | label 名和值类型、allowlist digest、违规 case | 未声明 label、ref/key/digest/free text、高基数或无法解析 |
| `check_dependency_boundary.sh` | manifest/lockfile/module/capability graph | 允许/实际 compile edge、writer capability finding、snapshot digest | non-core sibling compile dependency、反向边、越权 writer 或未声明 member |

check report 必须记录“扫描未执行”的原因；没有输入或 scanner 失败不得写 clean。

### 10.2 Report authenticity audit

`report-audit.md` 必须能检查：

1. 所有 report 的输入 root 都是同一 `<run_id>`。
2. 所有 candidate EV 都能回到真实 case artifact 和 suite report。
3. `latest`、静态 `passed/green`、伪造 run/evidence alias、最终 verdict/signoff 不出现在自动生成材料中。
4. failed/blocked/not_run/indeterminate 没有被数量汇总吞掉。
5. acceptance 初稿和 review 补充都保留生成来源与审查状态。

静态 evidence index、手写 `EV-CAND-OBS-*` 结果、空 artifact、复制上次 run 和只生成 summary 而没有 raw
case 均属于 report provenance failure。

## 11. Acceptance 与 review 补充边界

| 路径 | 自动生成内容 | 人/Agent 必须补充 | 禁止内容 |
|---|---|---|---|
| `reports/acceptance/handoff.md` | run、suite、P0 coverage、blocked/residual、artifact/report 入口 | 送验范围、异常解释、是否需要回流 | final verdict、signoff 或真实 EV alias 的静态声明 |
| `reports/acceptance/veto-checklist.md` | `VF-OBS-001~010` 的证据入口和待检查状态 | 每项机器证据复核、触发/未触发裁决 | 自动把缺失证据写成 passed |
| `reports/acceptance/risk-acceptance.md` | residual ID、影响 lane、candidate mitigation | 接受人、理由、动作、截止/触发条件 | 没有接受人仍生成 conditional approval |
| `reports/acceptance/open-issues.md` | open blocker/affected/defect refs | owner、下一动作、回归范围 | 删除未关闭问题 |
| `reports/review/reviewer-notes.md` | 结构化 report/证据审查输入 | 人工审查结论和修正 | 修改 raw artifact 或伪造执行 |
| `reports/review/agent-review.md` | 自动检查摘要和 provenance diff | Agent 二次审查、残余和阻塞原因 | 以 Agent 文字替代机器证据 |

人工/Agent 审查材料属于 review projection，不拥有业务 truth、验收签署或正式 evidence identity。

## 12. Retention marker 与归档保留规则

每个 run 的 `meta/context.json` 或等价 marker 必须记录以下字段：

| marker | 语义 |
|---|---|
| `retention_marker_id` | 本地 marker 的 typed identity，不是 backend TTL |
| `hold_state` | `none`、`active`、`legal`、`conflict` 等有限状态，由当前设计/归档 owner 提供 |
| `active_reference_count` | 当前 report、诊断、验收或复验引用数量的观察值 |
| `archive_eligibility` | `eligible`、`held`、`referenced`、`blocked` 等本地归档判断 |
| `cleanup_decision` | `deferred`、`allowed_by_owner` 或 `blocked`；不能等同删除完成 |
| `source_refs` | body-free 来源与 report/evidence linkage refs |

本 Step 不固定“保留 N 天”，不把 marker 写成后端 TTL，不允许清理 active/held/referenced material。删除、归档
和外部 archive handoff 必须由其 owner 的真实协议和未来 run 证据决定；`RetentionMarker` 只表达本地保护/归档
观察，不反写上游 archive truth。

## 13. 证据归档停审记录

| 审查项 | 判定条件 | current 结论 |
|---|---|---|
| P0 TC 覆盖 | 99 exact TC 都有 primary suite、DS、candidate EV 和 future artifact/report path；§8.2.1 逐行展开 | `pass_design` |
| P0 EV 追溯 | 99 candidate EV 与 TC 同号，真实执行后由 raw relation 推导；join 校验 `99/99` | `pass_design_planned_only` |
| 失败/阻塞保留 | suite 无论 failed/blocked/not_run 都有 metadata、failure reason 和 manifest 规则 | `pass_design` |
| canonical path | raw=`artifacts/test/<run_id>`；report=`reports/runs/<run_id>`；无 project 子目录/`latest` | `pass_design` |
| scripts | 仅 1 gate + 1 report + 3 checks，共 5 个 current script | `pass_design` |
| redaction/metric/dependency | 三个 check 有独立输入、输出和 nonzero 语义 | `pass_design` |
| acceptance/review | 自动初稿与人/Agent 补充责任分离 | `pass_design` |
| retention | marker/hold/reference 语义明确，无伪造天数或删除事实 | `pass_design` |
| real execution | 目标仓、CI、run、artifact、report、evidence 均未建立 | `not_run_by_design` |

## 14. 跨证据真实性与追溯审计

| 审计项 | 判定 | 缺口处理 |
|---|---|---|
| orphan TC | 0；由 Step 09 exact mapping、Step 07 dataset mapping 和 §8.2.1 `99` 行 join 检查 | 出现即阻断 Step 05 exit，并回流 Step 09 |
| orphan candidate EV | 0；必须有同号 TC 和 primary suite | 出现即 report provenance failure |
| duplicate primary suite | 0；secondary check 不创建第二 TC/EV | 出现即阻断，不能合并计数 |
| missing exact dataset | 0；99 行均至少有一个 Step 07 exact `DS-OBS-*` | 出现即回流 Step 07，不得用 dataset family 或 wildcard 替代 |
| EV suffix mismatch | 0；每行 `EV-CAND-OBS-*` 与 TC suffix 完全相同 | 出现即阻断，不能由报告生成器猜测修正 |
| duplicate `(suite, TC)` row | 0；每个 TC 只有一个 primary suite 行 | 出现即 provenance failure |
| missing raw artifact | 不允许；failed/blocked 也须有最小 failure record | 缺失即 blocked |
| wrong run / `latest` | 不允许 | report-audit nonzero，保留原始失败材料 |
| static evidence | 不允许 | `VF-OBS-006/010` candidate failure；不能风险接受覆盖 |
| raw body/secret leak | 不允许 | `VF-OBS-002~003` 方向阻断 |
| report/acceptance contradiction | 不允许自动裁决 | 由人/Agent review 记录冲突并回流 `06` |
| inherited affected positive claim | 0 | I05/J06 等只保留 blocked/conditional |

## 15. 对上游和下游的影响判定

| 结论 | 是否影响上游 | 处理 |
|---|---|---|
| canonical report path 以 SOP 标准名为唯一正式路径 | 否 | Step 09 内部文件名作为 producer mapping，不新增脚本或第二 truth source |
| evidence index 必须从 raw artifact/report 关系推导 | 否 | 由 Step 09/12 已定义的 provenance 规则承接 |
| 99/99 exact join、82 dataset manifest 和 9 suite count 固定 | 否 | `06` 与 `07` 直接消费这些设计键 |
| retention 只写 marker，不写固定 TTL/删除结果 | 否 | 与当前 `03`/`06` truth boundary 一致 |
| 若未来把 RuntimeLike 或 performance threshold 纳入 P0 | 是 | 必须回写 `00/05/06/07` 和环境/验收门禁后再生成新的 run |

## 16. Inherited blocker / affected

本 Step 没有发现新的上游 blocker。以下项继续开放，不能通过 candidate evidence 或报告模板关闭：

`S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06.6-F2-H13-UPSTREAM`、
`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-LINK-01`、
`R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`、`S08-CONSUMER-OUTBOX-SURFACE-01`、
`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01`、
`S08-M1-SECONDARY-TYPE-OWNER-01`、`03-RPR-S09-PER-FLOW`。

目标实现仓、CI、RuntimeLike、真实 artifact/report/evidence 仍未建立；这是实施前真实性状态，不是本 Step
可以伪造成通过或新增的 blocker。

## 17. 正式 §13 回填草稿

正式 `05-测试方案.md` §13 只承载以下收口规则：

- 原始机器证据统一进入 `artifacts/test/<run_id>`，人类可读报告统一进入 `reports/runs/<run_id>`；验收交接和 review 补充分别进入 `reports/acceptance` 与 `reports/review`。
- 99 个 `TC-OBS-*` 与 99 个 `EV-CAND-OBS-*` 必须按同号、primary suite、82 个 dataset、lane/profile、artifact digest 和 report digest 建立真实 run-scoped 追溯；candidate 不是正式 evidence alias。
- 失败、阻塞、未运行和不确定 suite 都必须保留最小 raw artifact、failure reason、输入/数据 manifest 和 provenance；不得 fallback 或以 `latest` 补证据。
- 五个脚本保持唯一 producer contract；redaction、metric label、dependency 和 report provenance check 未执行或失败均不能通过证据门禁。
- `reports/acceptance/*` 只生成待审初稿，必须由人或 Agent 补充；不生成 final verdict、signoff 或真实 evidence alias。
- retention 使用 marker/hold/reference 语义，不伪造固定天数，不删除 active/held/referenced material。

## 18. Step 自检与进入下一步条件

| 条件 | 结论 |
|---|---|
| SOP 输出物均已回答 | `pass` |
| 99 TC / 99 candidate EV / 9 suite 关系可判定 | `pass_design`；§8.2.1 exact index=`99` 行 |
| 82 dataset、lane/profile、失败和 affected 语义可追溯 | `pass_design` |
| Step 07/09 join 校验 | `pass`；Step 07=`99` rows，Step 09=`99` rows，missing dataset=`0`，EV mismatch=`0`，duplicate primary=`0` |
| canonical artifact/report path 固定且无 `latest` | `pass_design` |
| 五脚本 contract 未扩张 | `pass` |
| redaction/metric/dependency/report provenance 审计闭合 | `pass_design` |
| 人/Agent review 与验收签署边界清楚 | `pass` |
| 真实 execution/evidence 是否存在 | `no; not_run_by_design` |
| 新上游 blocker | `none` |
| gate_status | `pass_current_step_13_with_inherited_affected_open` |
| next_allowed_action | `rebuild_current_05_step_14` |
| commit | 不需要；用户未要求提交 |

## 19. 参考

- `standards/document/测试方案讨论流程_SOP.md` Step 13
- `standards/document/测试方案书写规范.md` §5.13
- `projects/L4-observability/design-calibration/05_test_plan_step_06_cases.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_07_test_data.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_09_automation_gates.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_12_entry_exit.md`
- `projects/L4-observability/03-详细设计.md` §15.9
- `projects/L4-observability/00-需求文档.md` §14.2~§14.4 AC/VF inputs
