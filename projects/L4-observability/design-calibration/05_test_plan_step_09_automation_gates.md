# L4-observability 05-测试方案 Step 09 · 设计自动化与 CI/CD 门禁

## Step 状态

| 字段 | 当前值 |
|---|---|
| project | `L4-observability` |
| document | `05-测试方案.md` |
| step | `09 / 设计自动化与 CI/CD 门禁` |
| mode | `full-restart` |
| status | `completed_current_with_inherited_affected_open` |
| current_module | `all` |
| direct_input | current Step 04、06、07、08；`03` planned script contract |
| formal_document_write | `not_allowed_until_step_15` |
| implementation | `not_started`; target implementation repository absent |
| pipeline / script reality | `not_established`; no CI instance or script file exists |
| test_execution | `not_run` |
| artifact / report / evidence | `absent_by_design`; candidate EV is not a real alias |
| new_upstream_blocker | `none` |
| inherited_blocker | 12 项 inherited blocker / affected 保持开放，见 §13 |
| next_allowed_action | 按当前连续 M4 授权读取 Step 10 标准与上游材料并重建 Step 10 |
| commit | 不需要；用户未要求提交 |

本文件是 Step 09 中间产物，不是正式 `05-测试方案.md`。旧 Step 09 已作为
`historical_material` 后置审计，本次按 current 输入重建，不在旧文件结构上增量修补。

## 1. 本步目标与输入边界

### 1.1 本步目标

本 Step 将测试分层、99 个 P0 测试用例、82 个数据集、6 条环境 lane 和 `03` 已冻结的脚本
契约收敛为可交给实施者的自动化门禁设计，回答以下问题：

1. 哪些测试作为 PR、main CI、nightly、release candidate 或 selected-run 的阻断输入。
2. 每个 P0 用例的唯一主 suite、候选证据回指、运行 lane 和 artifact/report 位置。
3. 五个 planned script 的输入、输出、失败语义和禁止行为。
4. 环境、依赖、配置、affected path 不可用时如何保持 `blocked`、`conditional`、`not_run`，不降级伪造成功。
5. suite 之间如何审计覆盖、重叠、证据配对、redaction、metric label、依赖边界和 report provenance。

本 Step 不定义测试框架、具体实现仓目录、CI 平台语法、性能阈值、正式 evidence 编号或真实
测试结果；这些内容必须在目标仓 reality 建立、后续 Step 或 `06/07` 中闭合。

### 1.2 输入与权威顺序

| 输入 | 当前状态 | 本 Step 消费方式 |
|---|---|---|
| `standards/document/测试方案讨论流程_SOP.md` Step 09 | current standard | 固定问题集合、必须产物、停审和跨 suite 审计要求 |
| `standards/document/测试方案书写规范.md` §5.9 | current standard | 固定 suite、触发点、阻断级别、artifact/report 根路径和脚本目录 |
| `standards/document/设计文档讨论中间产物规范.md` | current standard | full-restart、先思考后写入、单 Step、分批写入和三层台账纪律 |
| `05_test_plan_step_04_strategy_layers.md` | completed current | `L1-CONTRACT` 到 `L9-RELEASE` 的风险发现位置和触发策略 |
| `05_test_plan_step_06_cases.md` | completed current | 16 个切口、99 个唯一 `TC-OBS-*` 与 99 个 `EV-CAND-OBS-*` |
| `05_test_plan_step_07_test_data.md` | completed current | 82 个 dataset、隔离/清理/替身/状态 corpus 及 TC 前置映射 |
| `05_test_plan_step_08_environment_config.md` | completed current | `ENV-LCL-ISO/INT`、`ENV-CI-ISO/INT`、`ENV-STG-RT`、`ENV-PRD-RT` 六条 lane和三类 profile |
| `03-详细设计.md` §15.9 | current formal | 仅允许五个 planned script 及其参数、路径和失败语义 |
| `03_ddd_step_16_test_cuts.md` §19 | current calibration | 与 formal `03` 相同的五脚本 source contract；不新增脚本 |
| `01-架构设计.md` §3.3、`04-配置设计.md` §6~§13 | current formal | 唯一 compile dependency、runtime/event/handoff 协作和 profile/config redline |
| L1-governance / L1-artifact Step 09 | reference only | 只参考粒度和审计结构，不复制其业务 suite、脚本或状态 |

### 1.3 当前现实与真实性边界

| 对象 | 当前现实 | 允许写入本 Step | 禁止写入本 Step |
|---|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-observability` 不存在 | planned suite / boundary contract | 已有代码、测试通过或实际 CI |
| CI、配置实例、脚本文件 | 未建立 | logical gate contract | pipeline run、exit code、green build |
| 六条环境 lane | 只有设计位置 | `defined`、`not_established`、`not_run` | ready、available、staging pass、production pass |
| `run_id` | 当前不存在 | 规定未来输入必须由执行者提供 | 生成或伪造 run id |
| `EV-CAND-OBS-*` | Step 06 planned candidate | 作为 TC 到未来证据的设计回指 | 当作真实 evidence alias、artifact 或验收证据 |
| 上游 affected | 12 项开放 | fail-closed / conditional / controlled blocked 分支 | 用 fake、空 payload 或静态文件关闭 blocker |

## 2. SOP 问题回答

| SOP 问题 | current 回答 |
|---|---|
| 哪些 suite 必须进 PR | `S-OBS-CONTRACT-DOMAIN`、`S-OBS-SERVICE-FLOW`、`S-OBS-CONFIG-REDLINE` 和 `S-OBS-STATIC-REDLINE` 的确定性子集；涉及 durable-only 断言的 TC 不因 PR 缺 durable lane 而降级为 pass，而标记 `conditional/not_run`。 |
| 哪些 suite 进 main CI | PR suite 全集，加 `S-OBS-REPOSITORY-CONFORMANCE`、`S-OBS-ENTRY-CAPABILITY`、`S-OBS-RECOVERY-REPLAY` 和 `S-OBS-TELEMETRY-SAFETY`；`ENV-CI-ISO` 与 `ENV-CI-INT` 必须分开计结果。 |
| 哪些 suite 进 nightly | `S-OBS-RECOVERY-REPLAY` 的扩展故障、并发、commit/external unknown、report fold 和 fake/durable parity；nightly 结果不能替代 release candidate 的当前 run。 |
| 哪些 suite 是 release gate | `S-OBS-RELEASE-SMOKE`、`S-OBS-STATIC-REDLINE`、`S-OBS-TELEMETRY-SAFETY`、`S-OBS-CONFIG-REDLINE` 以及已承诺的 durable/replay P0 子集；随后必须通过 `generate_reports.sh` 的同 run 输入完整性与 report provenance 阶段。只有 `ENV-STG-RT` precondition 满足且上述门禁均有真实结果时，才可能形成 release evidence 输入。 |
| staging smoke 如何表达 | 作为 `S-OBS-RELEASE-SMOKE` 的 RuntimeLike 运行语境和 planned contract；当前 `ENV-STG-RT` 未建立时只能记录 `not_evaluated/blocked`，不以 `ENV-CI-ISO` 或 controlled fake 代替。 |
| production 是否作为测试 gate | `ENV-PRD-RT` 只描述未来 operations/resume 语境，不是当前自动化测试环境，也不是 release pass 的替代。 |
| flaky、超时和依赖故障怎么处理 | 对 P0 suite，timeout、flaky、输入缺失、artifact 不完整、配置/依赖无法解析均是 failed 或 blocked；不能重跑后删除失败记录、不能空 artifact、不能 fallback 到低等级 lane。仅 P1 selected-run 可记录 unavailable/residual。 |
| 每个阻断 suite 由什么脚本执行 | 所有 CI、nightly、release gate 统一由 `scripts/gates/run_ci_gate.sh` 这一 planned gate contract 承载；不发明 `run_release_gate.sh` 或 `run_selected_p1_gate.sh`。suite id 是设计键，不是本 Step 擅自冻结的 CLI 参数。 |
| gate 参数是否固定 | `--run-id`、`--artifact-root`、`--config-profile` 只按 `03` §15.9 作为 gate 输入。`artifact-root` 必须与 run id 对应；本 Step 不新增 `--gate`、`--suite` 等未在 source contract 中出现的参数。 |
| report 脚本如何运行 | `scripts/reports/generate_reports.sh` 读取同一 `artifacts/test/<run_id>`，写入 `reports/runs/<run_id>`；缺失、不完整、无法解析或 raw/report/candidate 关联不完整时非零。 |
| 哪些 check 必须进入 release | `check_redaction.sh`、`check_metric_labels.sh`、`check_dependency_boundary.sh` 均是 release required check；artifact/report 配对和静态 evidence 防伪作为 gate/report 输入完整性规则，不新增脚本路径。 |
| 每个 suite 如何回指测试切口、TC、EV | 本文件 §7 给出唯一 primary suite 到 16 个切口、99 个 TC 和 99 个 candidate EV 的逐项映射；secondary check 只标注约束，不重复计数。 |
| P0 是否有不可自动化用例 | 没有因“需要人工观察”而排除的 P0 用例。I05/J06 的 positive path 是上游 blocker/controlled blocked，不生成人工成功证据；其 fail-closed / blocked 断言仍可自动化。报告阅读、验收裁决和 residual acceptance 不属于 suite pass。 |
| 退出码是否等于验收结论 | 不是。script exit code 只表示命令输入和执行处理成功或失败；验收 verdict、signoff、真实 evidence alias 由后续 `06` 和真实运行产生。 |

## 3. 当前文档问题诊断与改动前后对比

### 3.1 Historical material 诊断

| 材料 | 冲突或缺口 | current 处理 |
|---|---|---|
| 旧 `05_test_plan_step_09_automation_gates.md` | 只有 81 行摘要，未消费 99 TC、82 dataset、6 lane，且把 suite/gate 写成未闭合口号 | 不继承；本文件全量重建 |
| 旧 Step 09 脚本表 | 引入 `run_release_gate.sh`、`run_selected_p1_gate.sh`、`build_gate_summary.sh`、`build_evidence_candidates.sh`、`check_artifact_report_pairing.sh`、`check_no_static_evidence.sh` 等 `03` 未预留路径 | 记为 historical discrepancy；仅保留五个 current script contract |
| `03` current script contract | 只有一个 gate、一个 report、三个 check；参数和输出根路径已冻结 | 作为唯一脚本真相源；配对/防伪纳入输入完整性，不扩脚本目录 |
| Step 06 | TC 只有自动化候选，未分配唯一 suite、lane、artifact/report | 本 Step 逐项分配 primary suite 和候选 EV 回指 |
| Step 07 | 82 dataset 有前置和清理语义，未绑定 suite execution | 本 Step 绑定 dataset class、lane 和 suite artifact namespace |
| Step 08 | 六条 lane 和三类 profile已定义，但未连接触发点和阻断策略 | 本 Step 固定 PR/main/nightly/release/selected-run 语境 |
| L1 参考材料 | 粒度较完整，但含不同项目的业务协议、脚本和真实假设 | 只借鉴结构，不复制名称、路径、结果或业务语义 |
| 正式 `05-测试方案.md` | 仍是 historical material | 本 Step 不修改；只允许 Step 15 从 current Step 01~14 装配 |

### 3.2 改动前后对比

| 项目 | 旧材料 | current 重建结果 |
|---|---|---|
| 自动化单元 | suite 名称未与 TC 建立闭环 | 9 个 logical suite；每个 TC 有唯一 primary suite |
| 流水线 | PR/main/nightly/release 只列概念 | 绑定六条 lane、三类 profile 和 P0 阻断级别 |
| 脚本 | 混入未定义脚本 | 严格限制为 `03` 的 5 个路径 |
| CLI | 擅自新增 `--suite`、`--gate` 等参数 | 只承接 `--run-id`、`--artifact-root`、`--config-profile`；suite 选择由 CI orchestration contract 后续实现 |
| artifact/report | 路径和生成器分散 | 固定 `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`，报告只消费真实 artifact |
| evidence | candidate 可能被当作结果 | 明确 `EV-CAND-OBS-*` 仅为 planned linkage，不能生成 pass |
| affected | 可能被 controlled fake 伪关闭 | I05/J06 和 其余 affected 保持 conditional/blocked/not_run |

## 4. 自动化设计取舍

| 议题 | 方案 A | 方案 B | current 选择与理由 |
|---|---|---|---|
| suite 粒度 | 一个总 suite 包含所有 P0 | 按风险和执行依赖拆分 suite，再由 gate 汇总 | 采用 B；失败定位、lane 选择和跨 suite 审计可判定 |
| TC 归属 | 同一 TC 在多个 suite 中重复计数 | 每个 TC 一个 primary suite，额外约束以 secondary check 标注 | 采用 B；保持 99/99 唯一覆盖，同时允许 redaction/no-write 叠加审计 |
| release gate | 用总测试数或 `cargo test` 代表通过 | 用五个核心能力纵切和静态红线形成场景级 gate | 采用 B；局部断言仍在早期 suite 发现，release 只做组合闭环 |
| 环境 | 一个万能 profile | lane 与 runtime class 分离，ISO/INT/RT 各自承担边界 | 采用 B；避免 fake 结果冒充 durable 或 RuntimeLike |
| 外部依赖 | always-success mock | formal Fake/Controlled/Endpoint/Disabled 按 profile 合法组合 | 采用 B；验证 typed outcome、phase 和 fail-closed，不伪造外部 truth |
| 脚本扩展 | 为每个 gate 新增脚本 | 只使用 `03` 已冻结的五条脚本契约 | 采用 B；避免 implementation boundary 与详细设计漂移 |
| report/evidence | 静态模板直接写 passed | report 从真实 artifact 生成，candidate 只做索引 | 采用 B；保持 evidence authenticity 和验收权责分离 |
| blocked 处理 | 切换低等级环境记 pass | 原 lane 保持 blocked/not_run，记录 precondition | 采用 B；不污染测试真相 |

## 5. Suite 设计与执行契约

### 5.1 Suite 语义

| 术语 | 本 Step 定义 | 约束 |
|---|---|---|
| primary suite | 每个 `TC-OBS-*` 的唯一自动化归属；负责执行该 TC 的主断言并生成 raw case record | 一个 TC 只能有一个 primary suite；不能因为被 release smoke 复用而重复计数 |
| secondary check | 对同一 raw case 做 redaction、metric label、dependency、truth/no-write 或 report 完整性审查 | 只能补充审计，不创建第二个 TC 或第二个 candidate EV |
| gate context | PR、main、nightly、release candidate 等由 CI 编排选择的 suite 集合 | context 不是 `run_ci_gate.sh` 的新增 CLI 参数；实际参数仍以 `03` 契约为准 |
| lane | Step 08 定义的验证语境 | lane 不是 domain state、Job identity、run identity 或 evidence alias |
| suite status | `planned`、`not_run`、`blocked`、`failed`、`passed` | 本设计阶段只能写 `planned`；没有真实执行不能写 `passed` |
| candidate EV | Step 06 的 `EV-CAND-OBS-*` 计划回指 | 不能进入正式验收结论，也不能代替 `artifacts/test/<run_id>` 中的真实输出 |

### 5.2 自动化套件总表

| Suite ID | 主要覆盖 | 主执行 lane / profile | 触发位置 | P0 处理 | planned gate / check | artifact 输出 | report 输出 |
|---|---|---|---|---|---|---|---|
| `S-OBS-CONTRACT-DOMAIN` | protocol carrier、typed ref、schema、27 state owner、domain policy、body-free类型 | `ENV-CI-ISO` / `LocalTest` | PR、main、release candidate required subset | blocking | `run_ci_gate.sh` | `artifacts/test/<run_id>/suites/S-OBS-CONTRACT-DOMAIN/` | `reports/runs/<run_id>/suites/S-OBS-CONTRACT-DOMAIN.md` |
| `S-OBS-SERVICE-FLOW` | Command/Query/Consumer service flow、accepted UoW 顺序、幂等、strict no-write、typed mapper | `ENV-CI-ISO` + `ENV-CI-INT` / `LocalTest` + `IntegrationLike` | PR semantic subset、main、release affected subset | blocking；INT 缺失时对应 case=`blocked/not_run` | `run_ci_gate.sh` | `artifacts/test/<run_id>/suites/S-OBS-SERVICE-FLOW/` | `reports/runs/<run_id>/suites/S-OBS-SERVICE-FLOW.md` |
| `S-OBS-REPOSITORY-CONFORMANCE` | fake/durable parity、unique/CAS/cursor、rollback visibility、outbox、claim/fence | `ENV-CI-INT` / `IntegrationLike`；ISO 只跑 shared semantic conformance | main、nightly、release affected subset | blocking；不能用 ISO 结果替代 INT | `run_ci_gate.sh` | `artifacts/test/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE/` | `reports/runs/<run_id>/suites/S-OBS-REPOSITORY-CONFORMANCE.md` |
| `S-OBS-ENTRY-CAPABILITY` | API/Query、Consumer、Job entry mapping、header/ack、facade-only、least authority | `ENV-CI-ISO` + `ENV-CI-INT` / `LocalTest` + `IntegrationLike` | main、release affected subset | blocking；affected positive保持conditional | `run_ci_gate.sh` | `artifacts/test/<run_id>/suites/S-OBS-ENTRY-CAPABILITY/` | `reports/runs/<run_id>/suites/S-OBS-ENTRY-CAPABILITY.md` |
| `S-OBS-RECOVERY-REPLAY` | failpoint、commit unknown、claim/fence、rebuild/replay、external phase、report fold | `ENV-CI-INT` / `IntegrationLike`；J06 controlled blocked lane单列 | nightly、release candidate required subset | blocking；未建立 capability 的路径只能 blocked/manual | `run_ci_gate.sh` | `artifacts/test/<run_id>/suites/S-OBS-RECOVERY-REPLAY/` | `reports/runs/<run_id>/suites/S-OBS-RECOVERY-REPLAY.md` |
| `S-OBS-CONFIG-REDLINE` | 三 profile 合法性、13-stage assembly、availability、historical binding、不可配置红线 | `ENV-CI-ISO` / `LocalTest`；INT/RT 作为条件化复核 | PR、main、release candidate | blocking；profile invalid 必须 fail closed | `run_ci_gate.sh` | `artifacts/test/<run_id>/suites/S-OBS-CONFIG-REDLINE/` | `reports/runs/<run_id>/suites/S-OBS-CONFIG-REDLINE.md` |
| `S-OBS-TELEMETRY-SAFETY` | log/metric/trace/audit schema、redaction-before-serialization、recursion、no truth authority | `ENV-CI-ISO` + `ENV-CI-INT` / `LocalTest` + `IntegrationLike` | main、nightly selected、release required | blocking；sink unavailable不可变为安全通过 | `run_ci_gate.sh` + `check_redaction.sh` + `check_metric_labels.sh` | `artifacts/test/<run_id>/suites/S-OBS-TELEMETRY-SAFETY/` | `reports/runs/<run_id>/suites/S-OBS-TELEMETRY-SAFETY.md` |
| `S-OBS-STATIC-REDLINE` | only-core compile edge、capability graph、historical material、truth/no-write source scan | `ENV-CI-ISO` / `LocalTest` | PR、main、release required | blocking / VETO candidate | `run_ci_gate.sh` + `check_dependency_boundary.sh` | `artifacts/test/<run_id>/suites/S-OBS-STATIC-REDLINE/` | `reports/runs/<run_id>/suites/S-OBS-STATIC-REDLINE.md` |
| `S-OBS-RELEASE-SMOKE` | `C-OBS-1~C-OBS-5` 五能力纵切、handoff/report provenance 和 RuntimeLike 组合 | `ENV-STG-RT` / `RuntimeLike` | release candidate only | blocking when lane is established; otherwise `blocked/not_evaluated` | `run_ci_gate.sh` + required checks | `artifacts/test/<run_id>/suites/S-OBS-RELEASE-SMOKE/` | `reports/runs/<run_id>/suites/S-OBS-RELEASE-SMOKE.md` |

`S-OBS-RELEASE-SMOKE` 不是所有底层 suite 的替代；它只证明跨边界组合。report provenance 也不拥有
独立 suite 身份，而是 `generate_reports.sh` 对各 TC exact primary suite 产物执行的输入完整性和报告生成阶段，
避免形成第 10 个 suite 或在 `03` 未冻结的脚本路径上继续扩张。

### 5.3 Gate context 到 suite 的选择

一个 gate invocation 只消费一个 `--config-profile`，因此 `ENV-CI-ISO` 与 `ENV-CI-INT` 必须使用不同的
`run_id` 和独立 raw artifact namespace。CI 编排可以在同一变更上启动多个 invocation，但不得把不同 profile
的结果拼成单一成功结果。

| Context | 必跑 suite | profile / lane | 阻断规则 |
|---|---|---|---|
| PR contract/domain | `S-OBS-CONTRACT-DOMAIN`、`S-OBS-SERVICE-FLOW` 的 ISO 子集、`S-OBS-CONFIG-REDLINE`、`S-OBS-STATIC-REDLINE` | `LocalTest` / `ENV-CI-ISO` | 任一可运行 P0 失败阻断；INT-only case 记录 `conditional/not_run`，不能写 pass |
| main semantic | PR 全集，加 `S-OBS-TELEMETRY-SAFETY` ISO 子集 | `LocalTest` / `ENV-CI-ISO` | 必须有完整 raw artifact；缺输入或 check 失败阻断 |
| main integration | `S-OBS-SERVICE-FLOW` INT、`S-OBS-REPOSITORY-CONFORMANCE`、`S-OBS-ENTRY-CAPABILITY`、`S-OBS-RECOVERY-REPLAY` 基线 | `IntegrationLike` / `ENV-CI-INT` | durable、restart、capability 断言不能由 ISO fallback；lane 不可用则 blocked |
| nightly | main integration suite，加 `S-OBS-RECOVERY-REPLAY` 扩展、`S-OBS-TELEMETRY-SAFETY` fault subset | `IntegrationLike` / `ENV-CI-INT` | timeout/flaky/unknown 保留失败或 indeterminate；不自动重写为 pass |
| release candidate | 所有当前 P0 required suite，加 `S-OBS-RELEASE-SMOKE` 和三个 current checks | `RuntimeLike` / `ENV-STG-RT`；底层 suite 可引用独立 CI run | STG precondition 不满足时 release gate blocked；不以 CI fake 生成 RuntimeLike evidence |
| production operations | 不自动启动本轮测试 suite | `RuntimeLike` / `ENV-PRD-RT` | 仅未来 runbook/operations contract；不计测试 pass 或验收事实 |

### 5.4 CI/CD 门禁图

图类型：CI/CD 自动化门禁拓扑

```text
                 [PR change]
                      |
                      v
       run_ci_gate.sh + LocalTest / ENV-CI-ISO
          |       |        |             |
          v       v        v             v
      contract  service   config       static
       domain    flow     redline      redline
                      |
                      v
                 [main change]
                      |
                      v
       run_ci_gate.sh + IntegrationLike / ENV-CI-INT
          |          |             |                |
          v          v             v                v
       repository  entry       recovery         telemetry
       conformance capability   replay           safety
                      |
                      v
                   [nightly]
                      |
                      v
              fault / race / unknown
                      |
                      v
             generate_reports.sh
                      |
                      v
              [release candidate]
                      |
                      v
       run_ci_gate.sh + RuntimeLike / ENV-STG-RT
          |          |             |                |
          v          v             v                v
       five-core  redaction     metric          dependency
       smoke      check         check            check
                      |
                      v
              reports/runs/<run_id>
```

图后说明：

1. 每个矩形代表逻辑 suite 或 check，不代表目标仓已有文件或已运行实例。
2. `run_ci_gate.sh` 的实际参数只使用 `03` 已冻结的三个参数；PR/main/nightly/release 是外部编排上下文。
3. 同一变更的 ISO、INT、RT 结果分别保存，不得将较低等级 lane 的结果升级为高等级 lane 结论。
4. 只有真实 artifact 被 report script 成功解析后，才允许产生未来的 candidate-to-report linkage；当前仍为 planned。

## 6. Primary suite 到 TC / candidate EV 映射

本节是当前 Step 的覆盖主表。每个 `TC-OBS-*` 只出现一次，作为一个 primary suite case；每一行的
`EV-CAND-OBS-*` 与 Step 06 同号，仍只是候选证据回指。artifact 和 report 路径由 §5.2 的 suite
行按 `suite_id` 解析，不在每一行复制路径，防止路径漂移。

`data anchor` 只引用 Step 07 的 exact TC 数据行；本 Step 不创造第二个 dataset 名称、fixture
builder 或清理语义。`ISO -> INT` 表示同一 TC 的语义断言先在 isolated lane 执行，durable / restart /
capability 断言必须在 IntegrationLike lane 独立执行，不能合并成一个结果。

### 6.1 `S-OBS-CONTRACT-DOMAIN` · 10 TC

| TC | primary suite | primary lane / profile | data anchor | candidate EV | planned disposition |
|---|---|---|---|---|---|
| `TC-OBS-COR-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-COR-001` | `planned` |
| `TC-OBS-RED-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-RED-001` | `planned` |
| `TC-OBS-AUD-003` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-AUD-003` | `planned` |
| `TC-OBS-EVD-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-EVD-001` | `planned` |
| `TC-OBS-SIG-003` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-SIG-003` | `planned` |
| `TC-OBS-DEG-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-DEG-001` | `planned` |
| `TC-OBS-DIA-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-DIA-001` | `planned` |
| `TC-OBS-AUT-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-AUT-001` | `planned` |
| `TC-OBS-AUT-002` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-AUT-002` | `planned` |
| `TC-OBS-RET-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-RET-001` | `planned` |

### 6.2 `S-OBS-SERVICE-FLOW` · 24 TC

| TC | primary suite | primary lane / profile | data anchor | candidate EV | planned disposition |
|---|---|---|---|---|---|
| `TC-OBS-ING-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT UoW follow-up | Step07 §8.1 | `EV-CAND-OBS-ING-001` | `planned` |
| `TC-OBS-ING-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-ING-002` | `planned` |
| `TC-OBS-ING-003` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT reservation follow-up | Step07 §8.1 | `EV-CAND-OBS-ING-003` | `planned` |
| `TC-OBS-ING-004` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT race follow-up | Step07 §8.1 | `EV-CAND-OBS-ING-004` | `planned` |
| `TC-OBS-COR-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-COR-002` | `planned` |
| `TC-OBS-AUD-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT UoW follow-up | Step07 §8.1 | `EV-CAND-OBS-AUD-001` | `planned` |
| `TC-OBS-AUD-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-AUD-002` | `planned` |
| `TC-OBS-EVD-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-EVD-002` | `planned` |
| `TC-OBS-EVD-003` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-EVD-003` | `planned_conditional` |
| `TC-OBS-SIG-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT atomicity follow-up | Step07 §8.1 | `EV-CAND-OBS-SIG-001` | `planned` |
| `TC-OBS-DEG-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-DEG-002` | `planned_conditional` |
| `TC-OBS-DEG-003` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-DEG-003` | `planned` |
| `TC-OBS-QRY-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-QRY-001` | `planned` |
| `TC-OBS-QRY-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-QRY-002` | `planned` |
| `TC-OBS-QRY-003` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-QRY-003` | `planned` |
| `TC-OBS-RPT-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT UoW follow-up | Step07 §8.2 | `EV-CAND-OBS-RPT-001` | `planned` |
| `TC-OBS-RPT-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-RPT-002` | `planned_conditional` |
| `TC-OBS-RET-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-RET-002` | `planned` |
| `TC-OBS-EXT-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-EXT-001` | `planned` |
| `TC-OBS-EXT-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT seam follow-up | Step07 §8.4 | `EV-CAND-OBS-EXT-002` | `planned_conditional` |
| `TC-OBS-OWN-003` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest`; INT store comparison | Step07 §8.4 | `EV-CAND-OBS-OWN-003` | `planned` |
| `TC-OBS-TRUTH-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-TRUTH-001` | `planned` |
| `TC-OBS-TRUTH-002` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-TRUTH-002` | `planned` |
| `TC-OBS-NW-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-NW-001` | `planned` |

### 6.3 `S-OBS-REPOSITORY-CONFORMANCE` · 12 TC

| TC | primary suite | primary lane / profile | data anchor | candidate EV | planned disposition |
|---|---|---|---|---|---|
| `TC-OBS-COR-003` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.1 | `EV-CAND-OBS-COR-003` | `planned` |
| `TC-OBS-AUD-004` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.1 | `EV-CAND-OBS-AUD-004` | `planned` |
| `TC-OBS-SIG-004` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.1 | `EV-CAND-OBS-SIG-004` | `planned` |
| `TC-OBS-DEG-004` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.2 | `EV-CAND-OBS-DEG-004` | `planned_conditional` |
| `TC-OBS-RET-003` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.2 | `EV-CAND-OBS-RET-003` | `planned` |
| `TC-OBS-RET-004` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.2 | `EV-CAND-OBS-RET-004` | `planned` |
| `TC-OBS-UOW-001` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.3 | `EV-CAND-OBS-UOW-001` | `planned_conditional` |
| `TC-OBS-UOW-002` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.3 | `EV-CAND-OBS-UOW-002` | `planned_conditional` |
| `TC-OBS-UOW-003` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.3 | `EV-CAND-OBS-UOW-003` | `planned_conditional` |
| `TC-OBS-UOW-004` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.3 | `EV-CAND-OBS-UOW-004` | `planned` |
| `TC-OBS-UOW-005` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.3 | `EV-CAND-OBS-UOW-005` | `planned` |
| `TC-OBS-UOW-006` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.3 | `EV-CAND-OBS-UOW-006` | `planned_conditional` |

### 6.4 `S-OBS-ENTRY-CAPABILITY` · 5 TC

| TC | primary suite | primary lane / profile | data anchor | candidate EV | planned disposition |
|---|---|---|---|---|---|
| `TC-OBS-EVD-004` | `S-OBS-ENTRY-CAPABILITY` | `ENV-CI-ISO` / `LocalTest`; I05 positive remains blocked | Step07 §8.1 | `EV-CAND-OBS-EVD-004` | `planned_conditional` |
| `TC-OBS-QRY-004` | `S-OBS-ENTRY-CAPABILITY` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.2 | `EV-CAND-OBS-QRY-004` | `planned_conditional` |
| `TC-OBS-DIA-002` | `S-OBS-ENTRY-CAPABILITY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-DIA-002` | `planned` |
| `TC-OBS-OWN-002` | `S-OBS-ENTRY-CAPABILITY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-OWN-002` | `planned` |
| `TC-OBS-NW-002` | `S-OBS-ENTRY-CAPABILITY` | `ENV-CI-ISO` / `LocalTest`; INT source-writer audit follow-up | Step07 §8.4 | `EV-CAND-OBS-NW-002` | `planned` |

### 6.5 `S-OBS-RECOVERY-REPLAY` · 12 TC

| TC | primary suite | primary lane / profile | data anchor | candidate EV | planned disposition |
|---|---|---|---|---|---|
| `TC-OBS-SIG-005` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.1 | `EV-CAND-OBS-SIG-005` | `planned_conditional` |
| `TC-OBS-DEG-005` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.2 | `EV-CAND-OBS-DEG-005` | `planned_conditional` |
| `TC-OBS-RPT-003` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike`; RT follow-up | Step07 §8.2 | `EV-CAND-OBS-RPT-003` | `planned_conditional` |
| `TC-OBS-RPT-004` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike`; RT follow-up | Step07 §8.2 | `EV-CAND-OBS-RPT-004` | `planned_conditional` |
| `TC-OBS-REB-001` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.3 | `EV-CAND-OBS-REB-001` | `planned_conditional` |
| `TC-OBS-REB-002` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.3 | `EV-CAND-OBS-REB-002` | `planned_conditional` |
| `TC-OBS-REB-003` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.3 | `EV-CAND-OBS-REB-003` | `planned_conditional` |
| `TC-OBS-REB-004` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.3 | `EV-CAND-OBS-REB-004` | `planned_conditional` |
| `TC-OBS-REB-005` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-ISO` / `LocalTest` controlled blocked lane | Step07 §8.3 | `EV-CAND-OBS-REB-005` | `planned_blocked_controlled` |
| `TC-OBS-UOW-007` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike`; RT follow-up | Step07 §8.3 | `EV-CAND-OBS-UOW-007` | `planned_conditional` |
| `TC-OBS-UOW-008` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.3 | `EV-CAND-OBS-UOW-008` | `planned_conditional` |
| `TC-OBS-NFR-003` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` / `IntegrationLike` | Step07 §8.4 | `EV-CAND-OBS-NFR-003` | `planned_conditional` |

### 6.6 `S-OBS-CONFIG-REDLINE` · 6 TC

| TC | primary suite | primary lane / profile | data anchor | candidate EV | planned disposition |
|---|---|---|---|---|---|
| `TC-OBS-CFG-001` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest`; INT/RT legality follow-up | Step07 §8.3 | `EV-CAND-OBS-CFG-001` | `planned` |
| `TC-OBS-CFG-002` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.3 | `EV-CAND-OBS-CFG-002` | `planned` |
| `TC-OBS-CFG-003` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.3 | `EV-CAND-OBS-CFG-003` | `planned` |
| `TC-OBS-CFG-004` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.3 | `EV-CAND-OBS-CFG-004` | `planned` |
| `TC-OBS-CFG-005` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.3 | `EV-CAND-OBS-CFG-005` | `planned` |
| `TC-OBS-CFG-006` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.3 | `EV-CAND-OBS-CFG-006` | `planned` |

### 6.7 `S-OBS-TELEMETRY-SAFETY` · 11 TC

| TC | primary suite | primary lane / profile | data anchor | candidate EV | planned disposition |
|---|---|---|---|---|---|
| `TC-OBS-RED-002` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-RED-002` | `planned` |
| `TC-OBS-RED-004` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-RED-004` | `planned` |
| `TC-OBS-SIG-002` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-SIG-002` | `planned` |
| `TC-OBS-SIG-006` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-SIG-006` | `planned` |
| `TC-OBS-DIA-003` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-DIA-003` | `planned` |
| `TC-OBS-RPT-005` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-RPT-005` | `planned` |
| `TC-OBS-AUT-003` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-AUT-003` | `planned` |
| `TC-OBS-RET-005` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-RET-005` | `planned` |
| `TC-OBS-TRUTH-003` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-TRUTH-003` | `planned` |
| `TC-OBS-NW-003` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-NW-003` | `planned` |
| `TC-OBS-NW-004` | `S-OBS-TELEMETRY-SAFETY` | `ENV-CI-ISO` / `LocalTest`; INT phase follow-up | Step07 §8.4 | `EV-CAND-OBS-NW-004` | `planned_conditional` |

### 6.8 `S-OBS-STATIC-REDLINE` · 12 TC

| TC | primary suite | primary lane / profile | data anchor | candidate EV | planned disposition |
|---|---|---|---|---|---|
| `TC-OBS-RED-003` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.1 | `EV-CAND-OBS-RED-003` | `planned` |
| `TC-OBS-DIA-004` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.2 | `EV-CAND-OBS-DIA-004` | `planned` |
| `TC-OBS-DEP-001` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-DEP-001` | `planned` |
| `TC-OBS-DEP-002` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-DEP-002` | `planned` |
| `TC-OBS-DEP-003` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-DEP-003` | `planned` |
| `TC-OBS-HIST-001` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-HIST-001` | `planned` |
| `TC-OBS-HIST-002` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-HIST-002` | `planned` |
| `TC-OBS-OWN-001` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-OWN-001` | `planned` |
| `TC-OBS-OWN-004` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-OWN-004` | `planned` |
| `TC-OBS-REB-006` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.3 | `EV-CAND-OBS-REB-006` | `planned` |
| `TC-OBS-NW-005` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-NW-005` | `planned` |
| `TC-OBS-NFR-002` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` / `LocalTest` | Step07 §8.4 | `EV-CAND-OBS-NFR-002` | `planned` |

### 6.9 `S-OBS-RELEASE-SMOKE` · 7 TC

| TC | primary suite | primary lane / profile | data anchor | candidate EV | planned disposition |
|---|---|---|---|---|---|
| `TC-OBS-REL-001` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | Step07 §8.4 | `EV-CAND-OBS-REL-001` | `planned_not_evaluated` |
| `TC-OBS-REL-002` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | Step07 §8.4 | `EV-CAND-OBS-REL-002` | `planned_not_evaluated` |
| `TC-OBS-REL-003` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | Step07 §8.4 | `EV-CAND-OBS-REL-003` | `planned_not_evaluated` |
| `TC-OBS-REL-004` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | Step07 §8.4 | `EV-CAND-OBS-REL-004` | `planned_not_evaluated` |
| `TC-OBS-REL-005` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | Step07 §8.4 | `EV-CAND-OBS-REL-005` | `planned_not_evaluated` |
| `TC-OBS-EXT-003` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | Step07 §8.4 | `EV-CAND-OBS-EXT-003` | `planned_not_evaluated` |
| `TC-OBS-NFR-001` | `S-OBS-RELEASE-SMOKE` | `ENV-STG-RT` / `RuntimeLike` | Step07 §8.4 | `EV-CAND-OBS-NFR-001` | `planned_not_evaluated` |

### 6.10 覆盖主表校验

| 检查项 | 期望 | 当前设计结果 | 结论 |
|---|---:|---:|---|
| primary suite 数量 | 9 | 9 | `pass_design` |
| unique `TC-OBS-*` | 99 | 99 | `pass_design` |
| unique `EV-CAND-OBS-*` | 99 | 99 | `pass_design` |
| TC 重复归属 | 0 | 0 | `pass_design` |
| TC 无 suite | 0 | 0 | `pass_design` |
| candidate EV 与 TC 同号 | 99/99 | 99/99 | `pass_design` |
| I05 positive fixture | 0 | 0 | `pass_blocked_boundary_preserved` |
| J06 positive H13 fixture | 0 | 0 | `pass_blocked_boundary_preserved` |

## 7. Gate、script、artifact 与 report 合同

### 7.1 路径与身份不变量

| 不变量 | current contract | 失败处置 |
|---|---|---|
| run identity | 执行者必须提供非空、当前 invocation 唯一的 `<run_id>`；它只标识一次测试执行 | 缺失、空值、跨 invocation 复用或无法解析时 gate 非零，不能生成默认 run |
| artifact root | `artifacts/test/<run_id>`；不允许附加 project 子目录或使用 `latest` | root 与 run id 不一致时立即失败；不得写入另一路径后再复制 |
| report root | `reports/runs/<run_id>`；验收归档根 `reports/acceptance` 留给后续 Step 13/`06` | 本 Step 的 report 只能写 run report；不得提前生成 acceptance verdict |
| profile identity | artifact/report 元数据必须记录 `LocalTest`、`IntegrationLike` 或 `RuntimeLike` 及对应 lane | profile 缺失、非法组合或跨 lane 混合时记录 `blocked`/`failed`，不聚合为 pass |
| suite identity | 每个 raw case 必须有本文件定义的 `suite_id` 和 Step 06 exact `TC-OBS-*` | unknown suite、孤儿 TC、重复 primary case 或 TC/EV 号不一致时输入不完整，gate/report 均失败 |
| candidate evidence | `EV-CAND-OBS-*` 只作为 planned linkage；真实执行后才可从 raw case/artifact 生成 candidate record | 静态模板、旧 alias、设计文档或手写 markdown 不得产生 passed evidence |
| source snapshot | static/dependency checks 记录源码、manifest、配置和设计输入的 digest/路径摘要 | 输入快照缺失或无法解析时 check 非零；不得以历史快照补当前快照 |
| time and clock | `Fixed` / `Deterministic` 只允许 LocalTest；IntegrationLike/RuntimeLike 必须遵守 Step 08 合法组合 | 非法 clock/profile 组合进入 `InvalidConfiguration`，不得继续执行 suite |

### 7.2 五个 current script contract

下表严格承接 `03-详细设计.md` §15.9 和 `03_ddd_step_16_test_cuts.md` §19。脚本路径是 planned
implementation boundary，不表示文件已经存在。除表中参数外，本 Step 不冻结额外 CLI 参数。

| 脚本 | 类型 | 必需输入 | 规划输出 | 非零条件 | 禁止行为 |
|---|---|---|---|---|---|
| `scripts/gates/run_ci_gate.sh` | gate | `--run-id`、`--artifact-root`、`--config-profile`；源码、配置、suite runner 输入 | `artifacts/test/<run_id>/` 下各 suite raw result、case result、stdout/stderr、failure summary | required suite/check 非零；参数/root/profile 非法；suite 输入缺失；timeout/flaky；artifact 不可写或不完整 | 不得从 design doc、空模板或上次 run 补 pass；不得删除失败 artifact；不得把低等级 lane 升级为高等级结果 |
| `scripts/reports/generate_reports.sh` | report | `--run-id`、`--artifact-root`、`--report-root`；同 run 的 raw artifacts | `reports/runs/<run_id>/` 下 suite report、run summary、输入缺失清单和 provenance link | root/run 不匹配；artifact 缺失、重复、损坏、无法解析；TC/EV/suite link 不完整；report 写入失败 | 不得补默认 success；不得修改 source/truth/artifact；不得把 `planned`、`blocked` 或 `failed` 改成 `passed` |
| `scripts/checks/check_redaction.sh` | check | `--artifact-root`、`--report-root`；raw artifacts、generated reports、forbidden corpus | `reports/runs/<run_id>/redaction-check.md` | raw body、secret、credential、endpoint/topic/path、provider/package/receipt body、full sensitive ref 或 hash/base64 escape 出现在扫描面 | 不得打印敏感原文；不得截断后当作清洁；不得修改输入来消除命中 |
| `scripts/checks/check_metric_labels.sh` | check | `--artifact-root`、`--report-root`；captured metric descriptor/sample 与 current allowlist | `reports/runs/<run_id>/metric-label-check.md` | 未声明 metric；label 不在 allowlist；label 含 ref/key/digest/free text/high-cardinality value；descriptor/sample 无法解析 | 不得按样本数量推断通过；不得删除违规 sample；不得把 metric backend health 当业务 truth |
| `scripts/checks/check_dependency_boundary.sh` | check | `--artifact-root`、`--report-root`；Cargo metadata/lockfile/module graph snapshot | `reports/runs/<run_id>/dependency-boundary-check.md` | 非 `core-contracts` sibling path compile dependency；方向反转；未声明 member；entry/query/rebuild 越权 writer/capability 证据 | 不得通过修改输入快照、忽略未知边或只扫描单一 crate 来规避边界 |

`check_redaction.sh`、`check_metric_labels.sh` 和 `check_dependency_boundary.sh` 可以由
`run_ci_gate.sh` 编排，但它们仍保持独立 check 身份和独立 failure reason。不能因为 gate 主命令返回
非零就省略 check 的 raw finding，也不能因为 check 命令本身启动成功就写 `passed`。

### 7.3 Gate 输入完整性与执行顺序

每个 gate invocation 按以下顺序完成；顺序是设计约束，不是当前已实现的脚本行为。

```text
validate run_id/root/profile
        |
        v
load source + config + suite manifest
        |
        +--> missing / invalid / forbidden profile
        |          |
        |          +--> blocked or failed artifact, stop
        v
construct namespace and dataset references
        |
        v
run primary suites in declared lane
        |
        +--> timeout / flaky / dependency unknown
        |          |
        |          +--> preserve failed or indeterminate case, no fallback
        v
write raw case and suite artifacts
        |
        v
run redaction / metric / dependency checks as required
        |
        v
validate artifact completeness and TC/EV linkage
        |
        v
generate report from raw inputs
```

关键说明：

1. suite 执行失败不能跳过 artifact 写入；至少必须留下可脱敏的 failure record，若连 failure record 都无法写入，整个 invocation 视为 artifact integrity failure。
2. `commit outcome unknown`、external outcome unknown 和 stale fence 是被测业务结果，不是脚本基础设施失败；case 必须记录对应 typed surface，不能被 runner 统一改成 failed 或 success。
3. 环境依赖缺失是 precondition 状态。若该 TC 的断言要求该依赖，状态为 `blocked/not_run`；若测试目标就是验证 `Unavailable/Disabled/Degraded`，则只有 exact typed surface 被观察到才可记录 case-level pass。
4. `flaky` 不得靠重复运行删除第一次结果；重跑必须有新的 invocation identity 或明确 attempt record，最终仍由后续缺陷/回归规则裁决。

### 7.4 Raw artifact 结构

`artifacts/test/<run_id>` 是机器输入根，不是验收结论目录。每个 suite 至少规划以下结构；具体文件格式
由目标仓 implementation boundary 冻结，但不得删除必需字段。

```text
artifacts/test/<run_id>/
  run-metadata.json
  suites/<suite_id>/
    suite-metadata.json
    cases/<tc_id>.json
    stdout.log
    stderr.log
    failure-summary.json
    input-manifest.json
    dataset-manifest.json
    check-inputs/
```

| raw record | 必需字段 / 关系 | truthfulness 规则 |
|---|---|---|
| `run-metadata` | `run_id`、profile、lane、invocation context、source/config snapshot ref、planned/current status | 不得填入真实 verdict、signoff 或不存在的 environment readiness |
| `suite-metadata` | `suite_id`、run id、profile/lane、trigger context、TC set、dataset set、start/end/attempt metadata、suite status | `passed` 只有真实 case results 和 required checks 完整时才可由执行器产生；设计文档不能预填 |
| case result | exact `TC-OBS-*`、primary suite、dataset refs、assertion refs、status、failure/recovery class、redacted diagnostic、raw record digest | 不得含 forbidden body；candidate EV 只能是 planned linkage，不得伪造正式 EV alias |
| input manifest | source/config/test input path、content digest、schema/version、missing list | 缺失输入必须显式列出；不能用旧 run、`latest` 或设计文档代替 |
| dataset manifest | `DS-OBS-*` refs、fixture namespace、cleanup status、substitute type、lane | fixture namespace 不得冒充 application `JobRunId`、external run 或 evidence identity |
| check input | scanner version/contract、scanned artifact/report refs、allowlist/denylist snapshot digest | scanner 不能改写被扫描输入；无法解析即 nonzero |
| stdout/stderr | 只保存脱敏诊断和执行上下文 | raw body、secret、provider response、credential、full path/token 不得穿透 |

### 7.5 Report 与 provenance 结构

`generate_reports.sh` 只能从同一个 `artifacts/test/<run_id>` 生成 report。planned report 结构如下：

```text
reports/runs/<run_id>/
  run-summary.md
  suites/<suite_id>.md
  checks/redaction-check.md
  checks/metric-label-check.md
  checks/dependency-boundary-check.md
  input-integrity.md
  candidate-evidence-links.md
```

| report | 最小内容 | 生成条件 | 禁止解释 |
|---|---|---|---|
| suite report | suite、lane/profile、TC 状态摘要、dataset/cleanup 状态、失败原因、raw artifact refs/digests | 对应 suite raw artifact 完整且可解析 | suite report 的 `passed` 不等于验收 signoff |
| check report | scanner 输入、allowlist/denylist digest、脱敏 findings、nonzero reason | checker 有完整输入；finding 不输出敏感原文 | clean scan 不等于业务 truth 成功 |
| input integrity | run/root/profile、缺失/重复/无法解析输入、TC/EV/suite 配对 | 所有 raw manifests 已读取 | 不能把缺失输入折叠为 zero tests/pass |
| candidate evidence links | `TC-OBS-*` -> raw case -> report -> `EV-CAND-OBS-*` planned link | raw case 和 report provenance 完整 | 不能升级为正式 evidence alias、AC pass 或 VETO signoff |
| run summary | 各 suite 状态、阻断项、blocked/conditional/not_run、check 状态和 residual references | 所有 required suite/check 有明确状态 | 不得只汇总通过数量而隐藏 blocked/failed |

Provenance 链必须保持：

```text
TC-OBS-* + DS-OBS-*
          |
          v
raw case artifact
          |
          v
suite report / check report
          |
          v
candidate evidence link
          |
          v
后续 Step 13 / 06 的真实 evidence 与验收裁决
```

当前链条的每一项均为 planned contract；没有真实 artifact、report、run 或 evidence alias。

## 8. Environment、dataset 与 failure 承载

### 8.1 Lane 到 suite 的承载矩阵

| Lane | 允许承载的 suite / 子集 | 允许的协作方式 | 不可承载 / 不可升级的结论 |
|---|---|---|---|
| `ENV-LCL-ISO` / `LocalTest` | 本地调试版 `S-OBS-CONTRACT-DOMAIN`、`S-OBS-SERVICE-FLOW`、`S-OBS-CONFIG-REDLINE`、`S-OBS-TELEMETRY-SAFETY`、`S-OBS-STATIC-REDLINE` | formal Fake/Controlled/Disabled、InMemory 或 explicit Durable、Fixed/Deterministic | 不能证明 CI 可重复、durable restart、RuntimeLike capability、正式 evidence |
| `ENV-LCL-INT` / `IntegrationLike` | 本地 `S-OBS-REPOSITORY-CONFORMANCE`、`S-OBS-ENTRY-CAPABILITY`、`S-OBS-RECOVERY-REPLAY` 和 INT service subset | Durable、Controlled/Endpoint/Disabled、System/Runtime、restart/barrier | 不能用本地结果替代 CI INT 或 staging；不能 fallback ISO 记 durable pass |
| `ENV-CI-ISO` / `LocalTest` | PR/main 的确定性 contract/domain/service/config/static/telemetry semantic subset，以及所有可在 ISO 完成的 99 TC 主断言 | CI-safe formal fake、deterministic barrier/failpoint、InMemory；禁止 production credential | 不能证明 physical durable、真实 transport、RuntimeLike endpoint 或 external product truth |
| `ENV-CI-INT` / `IntegrationLike` | main/nightly 的 repository、durable UoW、CAS/fence、restart、entry transport、recovery/replay、external phase conditional subset | Durable nonprod、Controlled/Endpoint/Disabled、System/Runtime、verified cleanup | fake/ISO 通过不能替代 INT；服务/Schema/capability 缺失时保持 blocked/not_run |
| `ENV-STG-RT` / `RuntimeLike` | release candidate 的 `S-OBS-RELEASE-SMOKE` 和 selected RuntimeLike redline/rehearsal | approved Durable/Endpoint/Disabled、managed locator、de-identified body-free canary | 当前实例未建立；不能使用 Fixture/Fake/Controlled、synthetic credential 或 CI result 冒充 staging evidence |
| `ENV-PRD-RT` / `RuntimeLike` | 未来 operations/resume/runbook 语境；不自动承载当前 P0 suite | production Durable/Endpoint/Disabled、stored historical binding | 不属于本轮测试环境；生产健康、缺席或手工观察均不构成验收通过 |

### 8.2 82 个 dataset 到 primary suite / lane 映射

下表的 `DS-OBS-*` 名称全部来自 Step 07。每个 dataset 可以被多个 TC 消费，但其 primary execution
语境固定；同一 dataset 在 INT 或 RT 的复核必须产生独立 lane / artifact 记录。`S-OBS-RELEASE-SMOKE`
只消费 de-identified、body-free 的 selected subset，不把 ISO synthetic material 当 production material。

#### 8.2.1 54 个 canonical / fixture / static dataset

| Dataset group | Exact dataset IDs | primary suite | primary lane | additional suite / lane | 清理与真实性规则 |
|---|---|---|---|---|---|
| harness / reference | `DS-OBS-NS-001`; `DS-OBS-REF-001`; `DS-OBS-REF-NEG-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` | service/static suites按 TC 消费 | value drop；namespace 不是 Job/run/evidence identity |
| protocol metadata / digest | `DS-OBS-META-001`; `DS-OBS-META-NEG-001`; `DS-OBS-DIGEST-001`; `DS-OBS-SOURCE-VERSION-001` | `S-OBS-CONTRACT-DOMAIN` | `ENV-CI-ISO` | `S-OBS-SERVICE-FLOW`、repository INT parity | 只用 typed builder；不得从 raw/debug/transport 重新 hash |
| intake / correlation / signal / audit | `DS-OBS-INTAKE-001`; `DS-OBS-INTAKE-NEG-001`; `DS-OBS-CORRELATION-001`; `DS-OBS-SIGNAL-001`; `DS-OBS-AUDIT-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` | repository/telemetry/release selected | owner namespace rollback/delete；forbidden sentinel 独立清理 |
| evidence linkage | `DS-OBS-EVIDENCE-001`; `DS-OBS-EVIDENCE-NEG-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` | `S-OBS-ENTRY-CAPABILITY`；I05 INT/RT 只能 blocked/conditional | 不保存 evidence body；I05 canonical DTO 数量为 0 |
| read / degraded / diagnostic | `DS-OBS-READ-001`; `DS-OBS-READ-SURFACE-001`; `DS-OBS-READ-CORRUPT-001`; `DS-OBS-DIAGNOSTIC-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` | repository INT fence/corruption；release selected read | corrupt fixture 必须强制隔离删除；Query 始终 zero-write |
| handoff / retention / gap | `DS-OBS-HANDOFF-001`; `DS-OBS-HANDOFF-NEG-001`; `DS-OBS-RETENTION-001`; `DS-OBS-GAP-001` | `S-OBS-SERVICE-FLOW` | `ENV-CI-ISO` | recovery/repository/release selected | local marker/hand-off only；不生成 verdict/signoff 或 source cleanup |
| UoW / idempotency / cursor | `DS-OBS-UOW-ORDER-001`; `DS-OBS-UOW-FAILPOINT-001`; `DS-OBS-COMMIT-UNKNOWN-001`; `DS-OBS-IDEMPOTENCY-001`; `DS-OBS-CAS-CURSOR-001`; `DS-OBS-READ-FENCE-001` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` | service ISO semantic；recovery nightly | 每个 failpoint 独立 namespace；unknown 结果先 probe，不能 blind retry |
| outbox / corruption / write spy | `DS-OBS-OUTBOX-001`; `DS-OBS-OUTBOX-CORRUPT-001`; `DS-OBS-RECOVERY-CLASS-001`; `DS-OBS-WRITE-SPY-001` | `S-OBS-REPOSITORY-CONFORMANCE` | `ENV-CI-INT` | telemetry/static/entry/recovery suites | snapshot 不从 current truth 重建；spy 每 case 新实例并 reset |
| Job / claim / report / resume | `DS-OBS-JOB-PLAN-001`; `DS-OBS-JOB-PLAN-NEG-001`; `DS-OBS-JOB-ITEM-001`; `DS-OBS-CLAIM-FENCE-001`; `DS-OBS-JOB-REPORT-001`; `DS-OBS-JOB-REPORT-NEG-001`; `DS-OBS-JOB-RESUME-001` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` | entry/repository/release selected | worker join、claim release、plan/report cleanup；不读取 current config 替 snapshot |
| external / peripheral / J06 | `DS-OBS-EXTERNAL-INTENT-001`; `DS-OBS-EXTERNAL-OUTCOME-001`; `DS-OBS-J06-BLOCKED-001`; `DS-OBS-PERIPHERAL-001` | `S-OBS-RECOVERY-REPLAY` | `ENV-CI-INT` controlled | `S-OBS-SERVICE-FLOW` ISO finite outcome；STG selected endpoint | prepare/call/finalize 分离；J06 只允许 Blocked/manual，无 H13 positive |
| config / activation / availability | `DS-OBS-CONFIG-PROFILES-001`; `DS-OBS-CONFIG-REDLINE-001`; `DS-OBS-ACTIVATION-FAULT-001`; `DS-OBS-AVAILABILITY-001`; `DS-OBS-SENSITIVE-REF-001` | `S-OBS-CONFIG-REDLINE` | `ENV-CI-ISO` | INT descriptor/secret/capability；STG RuntimeLike future | fail-fast/all-or-error；private handle teardown/zero；不 fallback target/credential |
| redaction / telemetry / static corpus | `DS-OBS-SENTINEL-001`; `DS-OBS-TELEMETRY-SCHEMA-001`; `DS-OBS-DEPENDENCY-CORPUS-001`; `DS-OBS-HISTORY-CORPUS-001`; `DS-OBS-TRUTH-COMPARISON-001`; `DS-OBS-EVIDENCE-DESIGN-001` | `S-OBS-STATIC-REDLINE` | `ENV-CI-ISO` | telemetry suite、report generation、release checks | source/document corpus read-only；sentinel drop/zero；candidate index 不是 artifact |

#### 8.2.2 28 个状态 corpus dataset

27 个正式 state owner 加 1 个技术协调状态均作为 `S-OBS-CONTRACT-DOMAIN` 的 canonical state harness
输入；需要 persistence/CAS/fence 的状态再由 repository/recovery suite 做独立复核。状态名不能跨 owner
解释，`ObservationJobPlanItemState` 不得变成业务 truth。

| 状态 corpus 范围 | Exact dataset IDs | primary suite / lane | required secondary check |
|---|---|---|---|
| observation truth / safety / correlation / signal / audit / evidence | `DS-OBS-STATE-RECEIPT-001`; `DS-OBS-STATE-SAFETY-001`; `DS-OBS-STATE-CORRELATION-001`; `DS-OBS-STATE-SIGNAL-001`; `DS-OBS-STATE-AUDIT-001`; `DS-OBS-STATE-EVIDENCE-001` | `S-OBS-CONTRACT-DOMAIN` / `ENV-CI-ISO` | service UoW + redaction check；INT persistence subset |
| handoff / readiness / authenticity / retention / protection / replay scope / no-write / gap | `DS-OBS-STATE-HANDOFF-001`; `DS-OBS-STATE-READINESS-001`; `DS-OBS-STATE-AUTHENTICITY-001`; `DS-OBS-STATE-RETENTION-001`; `DS-OBS-STATE-PROTECTION-001`; `DS-OBS-STATE-REPLAY-SCOPE-001`; `DS-OBS-STATE-NOWRITE-001`; `DS-OBS-STATE-GAP-001` | `S-OBS-CONTRACT-DOMAIN` / `ENV-CI-ISO` | service/recovery/static no-write and non-signoff checks |
| degraded / rollup / visibility / diagnostic / reference / maintenance | `DS-OBS-STATE-DEGRADED-001`; `DS-OBS-STATE-ROLLUP-001`; `DS-OBS-STATE-VISIBILITY-001`; `DS-OBS-STATE-DIAGNOSTIC-001`; `DS-OBS-STATE-REFERENCE-001`; `DS-OBS-STATE-MAINTENANCE-001` | `S-OBS-CONTRACT-DOMAIN` / `ENV-CI-ISO` | Query no-write; repository read fence; recovery freshness |
| replay coordination / rollup rebuild / peripheral / export / outbox / idempotency / Job report | `DS-OBS-STATE-REPLAY-COORD-001`; `DS-OBS-STATE-ROLLUP-REBUILD-001`; `DS-OBS-STATE-PERIPHERAL-001`; `DS-OBS-STATE-EXPORT-001`; `DS-OBS-STATE-OUTBOX-001`; `DS-OBS-STATE-IDEMPOTENCY-001`; `DS-OBS-STATE-JOB-REPORT-001` | `S-OBS-RECOVERY-REPLAY` / `ENV-CI-INT` for durable subset | static ownership; repository CAS/outbox; J06 controlled handling |
| technical coordination item state | `DS-OBS-STATE-JOB-ITEM-001` | `S-OBS-RECOVERY-REPLAY` / `ENV-CI-INT` | contract/domain state harness; claim/fence/report fold |

### 8.3 25 类配置 failure 的 gate 处置

| Failure ID | Failure subject | primary suite / lane | expected result | 是否阻断 |
|---|---|---|---|---|
| `CFG-FAIL-01` | source winner / required input missing | `S-OBS-CONFIG-REDLINE` / CI-ISO | fail before typed candidate; no lower-source fallback | 是 |
| `CFG-FAIL-02` | unknown key / duplicate key / wrong type | `S-OBS-CONFIG-REDLINE` / CI-ISO | exact validation error; no partial snapshot | 是 |
| `CFG-FAIL-03` | range / enum / cross-field invariant | `S-OBS-CONFIG-REDLINE` / CI-ISO | `InvalidConfiguration`; no runtime exposure | 是 |
| `CFG-FAIL-04` | public config contains secret / endpoint / private locator | `S-OBS-CONFIG-REDLINE` + telemetry check / CI-ISO | candidate rejected; sensitive value never enters public/domain/report | 是 |
| `CFG-FAIL-05` | profile / clock / ID / store mode illegal combination | `S-OBS-CONFIG-REDLINE` / CI-ISO | whole candidate rejected; no profile coercion | 是 |
| `CFG-FAIL-06` | schema / source / safety policy binding missing | `S-OBS-CONFIG-REDLINE` / CI-ISO | fail closed before service/entry activation | 是 |
| `CFG-FAIL-07` | digest / idempotency configuration incomplete | `S-OBS-CONFIG-REDLINE` / CI-ISO | no reservation or replay surface; explicit failure | 是 |
| `CFG-FAIL-08` | store schema / atomic UoW capability absent | repository + config / CI-INT | runtime blocked; no InMemory substitution | 是 |
| `CFG-FAIL-09` | unique / CAS / cursor capability absent | repository / CI-INT | `StoreCompatibilityMismatch` or typed blocked; no partial activation | 是 |
| `CFG-FAIL-10` | external root family missing / duplicate | config + entry / CI-ISO, INT follow-up | exact catalog incomplete; no handler/adapter exposure | 是 |
| `CFG-FAIL-11` | event target catalog missing / duplicate / mismatch | static + repository / CI-ISO/INT | no outbox publication activation; old snapshot not rerouted | 是 |
| `CFG-FAIL-12` | Consumer / Job catalog missing or extra | entry capability / CI-ISO | `EntryBindingIncomplete`; no generic/default handler | 是 |
| `CFG-FAIL-13` | required capability `Disabled` or `Unavailable` | config/recovery / CI-ISO then INT | exact Disabled/Unavailable/Blocked surface; no silent success | 是 |
| `CFG-FAIL-14` | capability probe `Unknown` or `Unsupported` | config/recovery / CI-ISO then INT | preserve unknown/unsupported; probe/manual posture | 是 |
| `CFG-FAIL-15` | secret/locator resolution fails | config / CI-ISO/INT | candidate construction fails; no alternate target/credential | 是 |
| `CFG-FAIL-16` | registrar prepare/arm fails at Nth stage | config / CI-ISO | revoke/join previous registrations; zero active partial root | 是 |
| `CFG-FAIL-17` | duplicate activation / cross-profile handle reuse | config/static / CI-ISO | reject; opaque handle set not shared across profile | 是 |
| `CFG-FAIL-18` | startup drain/revoke/join fails | recovery/config / CI-INT | blocked/manual with safe issue; no claim of clean shutdown | 是 |
| `CFG-FAIL-19` | old historical binding missing | recovery / CI-INT; RT future | stop before external call; `ManualIntervention`/unavailable | 是 |
| `CFG-FAIL-20` | old snapshot digest/binding mismatch on resume | recovery / CI-INT | resume rejected; no current-config replacement | 是 |
| `CFG-FAIL-21` | migration/retirement state incomplete | static/config / CI-INT | retain old reader/binding or stop; no pointer flip | 是 |
| `CFG-FAIL-22` | rollback / cleanup / active reference protection failure | repository/recovery / CI-INT | preserve material and marker; no source delete | 是 |
| `CFG-FAIL-23` | audit/report handoff input incomplete | service/report / CI-ISO | report readiness blocked/pending; no delivery/verdict | 是 |
| `CFG-FAIL-24` | telemetry sink recursion or sink failure | telemetry / CI-ISO/INT | bounded suppression; committed business owner unchanged | 是 |
| `CFG-FAIL-25` | target repository / physical environment reality absent | all contexts | `not_established/not_run/not_evaluated`; design remains planned | 当前不形成执行结果；实现前置阻断 |

`CFG-FAIL-25` 是现实前置而不是可通过的负向业务用例。它可以阻止真实 gate 启动，但不能被写成
“测试正确发现 failure，因此 release 通过”。

### 8.4 跨 lane fallback 规则

1. `ENV-CI-INT` 不可用时，`S-OBS-REPOSITORY-CONFORMANCE`、durable UoW、restart、claim/fence 和 external phase 的 INT 断言保持 `blocked/not_run`；ISO semantic result 只作为独立 planned result。
2. `ENV-STG-RT` 不可用时，`S-OBS-RELEASE-SMOKE` 为 `not_evaluated`；不得用 `ENV-CI-ISO` 的 Fake/Controlled 运行填充 RuntimeLike report。
3. `RuntimeLike` 禁止 `Fake`、`InMemory`、`Controlled`、`Fixed`、`Deterministic` 非法组合；检测到即 config VETO。
4. `Disabled` 只适用于 formal optional capability 和明确的 negative/blocked 断言；不得把 required dependency 缺失转换成 silent Disabled。
5. 环境状态和 case 状态分开记录：环境可以 `not_established`，预期 unavailable case 仍可在已建立的 controlled lane 观察 exact typed outcome。

## 9. Suite / gate 停审与跨 suite 审计

### 9.1 单 suite 停审记录

| Suite / Gate | 覆盖与执行位置 | 脚本位置 | artifact/report 配对 | 失败与 blocked 处理 | 停审结论 |
|---|---|---|---|---|---|
| `S-OBS-CONTRACT-DOMAIN` | 10 个 primary TC；contract/state/domain 风险在 `ENV-CI-ISO` 前置发现 | gate=`scripts/gates/run_ci_gate.sh` | §5.2 固定 suite 目录和 run report | schema/owner/transition 不完整阻断；无 target repo 时 `not_run` | `pass_design` |
| `S-OBS-SERVICE-FLOW` | 24 个 primary TC；Command/Query/Consumer、UoW/no-write service 语义 | gate=`scripts/gates/run_ci_gate.sh` | ISO 与 INT 必须独立 invocation | durable-only precondition 缺失不 fallback；affected 保留 conditional | `pass_design_with_precondition` |
| `S-OBS-REPOSITORY-CONFORMANCE` | 12 个 primary TC；fake/durable、CAS、cursor、outbox、rollback | gate=`scripts/gates/run_ci_gate.sh` | INT raw artifact 必须可定位；ISO parity 不能覆盖 INT | store/schema/UoW 未建立则 blocked；不写 fake pass | `pass_design_with_precondition` |
| `S-OBS-ENTRY-CAPABILITY` | 5 个 primary TC；entry facade、ack/parse、least authority | gate=`scripts/gates/run_ci_gate.sh` | entry case 与 source/capability scan 关联 | I05 pre-parse 可测；positive landing blocked；writer edge VETO | `pass_design_with_affected_open` |
| `S-OBS-RECOVERY-REPLAY` | 12 个 primary TC；recovery、replay、external phase、report fold | gate=`scripts/gates/run_ci_gate.sh` | INT/controlled blocked lane分开；unknown保留 typed record | J06 仅 controlled Blocked/manual；unknown不盲重试 | `pass_design_with_affected_open` |
| `S-OBS-CONFIG-REDLINE` | 6 个 primary TC；3 profile、13-stage、activation、availability | gate=`scripts/gates/run_ci_gate.sh` | profile/lane 必须进入 metadata | invalid combination / missing capability 阻断；不 silent fallback | `pass_design` |
| `S-OBS-TELEMETRY-SAFETY` | 11 个 primary TC；redaction、metric labels、recursion、truth authority | gate + `check_redaction.sh` + `check_metric_labels.sh` | check report 与 suite raw input 同 run | forbidden material/high cardinality/sink recursion 阻断；finding 脱敏 | `pass_design` |
| `S-OBS-STATIC-REDLINE` | 12 个 primary TC；dependency、history、ownership、no-write static corpus | gate + `check_dependency_boundary.sh` | dependency report 与 source snapshot 同 run | non-core edge/越权 capability/VETO；历史材料不得成为 source | `pass_design` |
| `S-OBS-RELEASE-SMOKE` | 7 个 primary TC；五能力纵切和 RuntimeLike handoff | gate=`scripts/gates/run_ci_gate.sh` + required checks | STG report 只在真实 lane 建立后生成 | STG 缺失为 `not_evaluated`；不以 CI ISO 代替 | `pass_design_with_environment_precondition` |

停审规则：suite 表中所有数字必须与 §6 primary rows 相等；suite 通过设计停审不等于测试执行通过。
任何 suite 若无法提供 deterministic barrier、formal fault schedule、write spy、body-free resolver、
fake/durable conformance 或可解析的 input manifest，必须回到设计缺口，不得由 runner 减少断言后继续。

### 9.2 跨 suite 覆盖审计

| 审计项 | 方法 | 当前结论 | 缺口 / 后续动作 |
|---|---|---|---|
| P0 TC 完整性 | 比较 Step 06 exact TC 集合与 §6 primary rows | `99/99`、0 duplicate、0 orphan | 真实实现后由 gate manifest 再验证 |
| candidate EV 完整性 | TC 后缀与 EV 后缀逐项相等 | `99/99` | 正式 EV 仍留 Step 13/真实 run |
| 16 canonical test cuts | Step 06 §6.1 的 16 切口逐一查 primary suite | 16/16 有 suite，且 cut 内正/负/边界语义未被 gate 丢失 | 后续实施 boundary 需保留 cut id |
| 60 exact protocols | Step 06 §7.1~§7.5 的 `16+14+9+12+9` index 作为 suite input | 60/60 由 contract/service/repository/entry/recovery/release 组合承接 | `03-RPR-S09-PER-FLOW` implementation proof 仍开放 |
| 27 state owners + technical state | Step 07 28 state corpus 与 contract/recovery suite 比较 | 28/28 有 canonical harness 和 secondary owner check | technical state 不得升级为业务 state |
| Query strict no-write | Q01~Q14、DIA、NW rows 和 write-spy dataset | all query primary/secondary paths保留 zero writer assertion | target implementation 需提供 capability scan |
| Consumer ordering | header/schema/producer before parse、commit certainty before action | I05 缺口只进入 pre-parse blocked；无 default ack | upstream schema/binding owner未闭合 |
| Event snapshot | accepted UoW -> immutable snapshot -> stored publisher | UoW/outbox/repository/recovery suites均有约束 | publisher/durable implementation未建立 |
| Job phase | plan -> claim/fence -> item -> fold/finalize -> report | recovery/repository/entry suites覆盖；J06 controlled lane保留 | H13 positive owner未闭合 |
| external phase | prepare commit -> no-DB call -> probe/finalize same token | RPT/UOW/RECOVERY suites覆盖；不把 receipt当 Delivered truth | real endpoint capability未建立 |
| redaction | pre-serialization、artifact/report scan、hash/base64 escape、forbidden field | telemetry suite + `check_redaction.sh` required | checker实现未建立 |
| metric labels | declared metric + finite allowlist + no ref/key/digest/free text | telemetry suite + `check_metric_labels.sh` required | current metric descriptor source需实现时确认 |
| dependency boundary | only `core-contracts` compile edge、no reverse writer capability | static suite + `check_dependency_boundary.sh` required | target Cargo graph不存在 |
| dataset isolation | 82 dataset、fixture namespace、cleanup status 与 suite artifact | Step07映射全量承接；RT不复用 synthetic secret/body | target harness清理实现待 `07` boundary |
| report provenance | raw case -> suite report/check -> candidate link | `generate_reports.sh` 只读同 run artifact | Step13 再固定正式 evidence index |
| suite overlap | secondary checks不创建第二 TC；release smoke只做组合 | overlap intentional and bounded | implementation manifest需禁止 duplicate primary ownership |
| release gate coverage | smoke + config + redaction + metric + dependency + report input integrity | design coverage complete | STG lane / real run 未建立，不能写 release pass |

### 9.3 Cross-suite failure precedence

当同一 run 有多个状态时，报告必须保留全部原始状态，并按以下优先级确定 gate disposition：

```text
input/artifact integrity failure
        > static VETO / forbidden material
        > required suite failed
        > required environment blocked
        > conditional / affected
        > non-blocking planned or unavailable
```

这只是报告归类顺序，不把 `blocked` 改写为 `failed`，也不把 `failed` 改写为 `passed`。`run_ci_gate.sh`
的命令非零只能说明 gate execution 未满足脚本合同；后续 `06` 仍需独立读取真实 artifact/report 做裁决。

## 10. P0 手工测试与不可自动化清单

| 项 | current 结论 | 处理 |
|---|---|---|
| P0 contract/domain/service/query/UoW/config/redaction/dependency | 没有不可自动化项 | 必须进入 primary suite 或 required check；人工不能替代 |
| I05 canonical payload / producer binding positive path | 当前不可运行但不是“手工通过” | 自动化 pre-parse reject/slot disabled/ack=0/write=0；positive 保持 `blocked_upstream` |
| J06 H13 positive replay path | 当前不可运行但不是“手工通过” | 自动化 controlled `Blocked/manual` 和 no-fabrication；positive/Completed 保持 blocked |
| `ENV-STG-RT` selected RuntimeLike | 当前未建立 | selected run 只能 `not_evaluated/residual`；不能用人工截图或日志作 evidence |
| report 阅读、验收 verdict、signoff | 不属于 suite automation | 后续 `06` / Step 13 的人工或 Agent 裁决，必须引用真实 raw artifact/report |
| performance/capacity/SLO | 本 Step 不定义阈值 | Step 10 另行定义方法、环境、阈值来源和证据，不在本 Step 伪造结果 |

## 11. Inherited blocker / affected 处置

| ID | 本 Step 自动化可闭合面 | 保持开放面 | 当前 suite / status |
|---|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | schema/header presence、unsupported envelope pre-parse fail-closed | canonical payload decode/positive landing | `S-OBS-ENTRY-CAPABILITY`; `planned_blocked_upstream` |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | producer binding slot map、missing binding 不激活/不 ack/不写 | exact producer event to I05 positive adapter | `S-OBS-STATIC-REDLINE` + entry; `planned_blocked_upstream` |
| `R06.6-F2-H13-UPSTREAM` | approved observation-only scope guard、controlled Blocked/manual、zero external effect | H13 positive execution/completion/report truth | `S-OBS-RECOVERY-REPLAY`; `planned_blocked_controlled` |
| `R06-F-AFFECT-UOW-01` | exact stage order、known rollback、commit unknown probe contract | implementation atomicity proof across every exact flow | service/repository/recovery; `planned_conditional` |
| `S08-RECOVERY-CLASS-OWNER-01` | eight recovery posture rows、no-default/no-wildcard mapping check | canonical enum owner and total application mapper | recovery/static; `planned_conditional` |
| `R07-EXTERNAL-PHASE-LINK-01` | prepare/call/finalize relation、same token/binding | production endpoint capability | recovery/service; `planned_conditional` |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | unknown probe、known-success finalize-only、no blind retry | real retry/probe accounting owner | recovery; `planned_conditional` |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | accepted local snapshot boundary、duplicate no second effect | exact per-consumer outbox capability | service/repository; `planned_conditional` |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | commit unknown has no default ack/retry/dead-letter | exact completion mapper owner | service/entry/recovery; `planned_conditional` |
| `S08-JOB-REPORT-REF-OWNER-01` | missing/wrong report ref fail closed、immutable fold | canonical report-ref owner/mint/rehydrate | service/recovery; `planned_conditional` |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | declaration/use/static owner scan、typed ref non-mixing | positive protocol lane until owner closes | contract/static; `planned_conditional` |
| `03-RPR-S09-PER-FLOW` | 60 exact protocol IDs、primary suite and case count audit | implementation-level per-flow proof | all suites; `planned_design_closed_implementation_open` |

本表不关闭任何上游 blocker。`controlled` 只表示可验证边界和失败分类，不表示 external/provider/H13
能力已存在；`planned_conditional` 不得进入真实 acceptance pass。

## 12. 对上游与下游的影响判定

| 结论 | 是否回写上游 | 处理 |
|---|---|---|
| suite 与 99 TC 的 primary 分配 | 否 | 只细化测试执行组织；Step 06 的 case/EV ID不变 |
| 六 lane 与三 profile 的 gate 连接 | 否 | 承接 Step 08；不新增 profile，不修改 `04` |
| 五脚本限制与旧稿脚本差异 | 否 | 以 current `03` 为准；旧额外脚本保留 historical discrepancy |
| report provenance / candidate EV | 否 | Step 13 再固定正式 evidence index；本 Step 不写真实结果 |
| I05/J06 affected | 否 | 保持 upstream/controlled blocker，未创建 DTO、H13 record 或成功 fixture |
| 如果未来需要新增 release/check script | 是 | 必须回写 `03` §15.9、Step 09、`07` boundary inventory，经用户确认后才可加入 |
| 如果未来把 RuntimeLike / durable lane 设为当前 P0 必备且实例不存在 | 是 | 回写 `05/06/07` 的 environment、entry/exit、evidence 和 residual contract |

## 13. 正式 `05` §9 回填草稿

正式 `05-测试方案.md` §9 只应装配以下 current 收口结论，并列出本文件作为校准来源：

1. 自动化按 `S-OBS-CONTRACT-DOMAIN`、`S-OBS-SERVICE-FLOW`、`S-OBS-REPOSITORY-CONFORMANCE`、
   `S-OBS-ENTRY-CAPABILITY`、`S-OBS-RECOVERY-REPLAY`、`S-OBS-CONFIG-REDLINE`、
   `S-OBS-TELEMETRY-SAFETY`、`S-OBS-STATIC-REDLINE` 和 `S-OBS-RELEASE-SMOKE` 九个 logical suite 组织。
2. PR/main/nightly/release candidate 使用不同 suite 集合和明确 lane；`ENV-CI-ISO`、`ENV-CI-INT`、
   `ENV-STG-RT` 结果不能互相升级，`ENV-PRD-RT` 不属于当前测试 gate。
3. 每个 `TC-OBS-*` 有唯一 primary suite，99 个 TC 与 99 个 `EV-CAND-OBS-*` 一一对应；candidate EV
   不是正式 evidence、run、verdict 或 signoff。
4. 所有 gate/report/check 只使用 `03` 已冻结的五个脚本路径；artifact 固定为
   `artifacts/test/<run_id>`，report 固定为 `reports/runs/<run_id>`，正式门禁不得引用 `latest`。
5. 缺失、不可解析、不完整、timeout、flaky、forbidden material、非法 metric label、非 core compile edge
   和 required suite failure 均不能静默成功；blocked/conditional/not_run 必须保留原语义。
6. report 只能从同一 run 的真实 raw artifact 生成；Step 09 不生成正式 evidence alias、验收 verdict、signoff、
   commit 或测试结果。

## 14. 本步自检与进入下一步条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| Step 09 必需产物是否齐全 | `pass_design` | suite 表、CI/CD 图、五脚本表、artifact/report 映射、TC/EV 映射、停审和跨 suite 审计均已写入 |
| suite 数量与映射是否一致 | `pass_design` | 9 suite；主表 99/99，无重复 primary TC |
| 16 切口是否都有 suite | `pass_design` | 每个 cut 至少有 primary suite，release smoke只做组合验证 |
| 60 exact protocol 是否被承接 | `pass_with_affected_open` | 16+14+9+12+9=60；实现级逐 flow proof仍开放 |
| 27+1 状态是否被承接 | `pass_with_affected_open` | 28 corpus；technical item state不替代业务 owner |
| 82 dataset 是否被承接 | `pass_design` | 54 canonical/fixture/static + 28 state corpus，lane/cleanup语义已回指 Step 07 |
| 五脚本是否与 `03` exact | `pass_design` | 无新增 script path；旧稿额外脚本标 historical discrepancy |
| artifact/report root 是否固定 | `pass_design` | `artifacts/test/<run_id>`、`reports/runs/<run_id>`；无 `latest` |
| P0 是否依赖手工测试 | `pass_design` | 没有；人工只负责报告阅读/验收裁决，不能替代 suite |
| I05/J06 是否被伪关闭 | `pass_with_blocker_open` | I05 pre-parse/slot disabled，J06 controlled Blocked/manual；positive lane仍 blocked |
| 是否生成真实执行事实 | `pass_truthfulness` | 未生成 run、artifact、report、evidence alias、verdict、signoff、result 或 commit |
| 新增上游 blocker | `none` | 12 inherited blocker/affected 继续保持开放 |

进入 Step 10 前必须满足：

- [x] 本文件按 Step 09 独立重建，未修改正式 `05-测试方案.md`。
- [x] 9 个 suite 的职责、lane、触发语境、阻断级别和输出位置明确。
- [x] 99 个 unique TC 与 99 个同号 candidate EV 已逐行映射，0 duplicate、0 orphan。
- [x] 五个 current script contract、输入完整性、失败语义、artifact/report provenance 已闭合。
- [x] 6 lane、3 profile、82 dataset、25 config failure 和跨 lane fallback 已承接。
- [x] I05/J06、UoW、recovery、external phase、consumer completion、report owner 和 secondary type affected 未被关闭。
- [x] 跨 suite 审计无设计层 unresolved coverage、ID、路径或 phase 冲突。
- [x] 未产生真实测试结果、run_id、artifact、report、evidence alias、验收签署或 commit。

Step 09 current gate：`pass_current_with_inherited_affected_open_waiting_next_step`。

## 15. 参考

- `standards/document/测试方案讨论流程_SOP.md` Step 09
- `standards/document/测试方案书写规范.md` §5.9
- `standards/document/设计文档讨论中间产物规范.md`
- `projects/L4-observability/03-详细设计.md` §3.2、§3.3、§13、§14、§15.9
- `projects/L4-observability/design-calibration/03_ddd_step_16_test_cuts.md` §18.3、§19
- `projects/L4-observability/design-calibration/05_test_plan_step_04_strategy_layers.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_06_cases.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_07_test_data.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_08_environment_config.md`
- `projects/L1-governance/design-calibration/05_test_plan_step_09_automation_gates.md`（粒度参考）
- `projects/L1-artifact/design-calibration/05_test_plan_step_09_automation_gates.md`（粒度参考）
- `projects/L4-observability/design-calibration/project_execution_ledger.md`
