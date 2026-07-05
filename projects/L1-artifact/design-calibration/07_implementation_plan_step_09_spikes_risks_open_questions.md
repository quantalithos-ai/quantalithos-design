# Step 9. 定义 Spike、风险与待确认事项

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 9
> 回填章节: `07-实施计划.md` §9 Spike、风险与待确认事项
> 参考粒度: `projects/L1-governance/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义 Spike、风险与待确认事项 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 5 phase;Step 6 boundary;Step 7 gate;Step 8 配置 / 环境 / 外部依赖;`03-详细设计.md`;`04-配置设计.md`;`05-测试方案.md`;`06-验收标准.md` |
| 输出文件 | `projects/L1-artifact/design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 10 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 5 PH-01~PH-08 | 已完成;用户已确认 | 绑定风险影响阶段和 phase 级截止点 |
| Step 6 `commit-01-a`~`commit-08-b` | 已完成;用户已确认 | 绑定 Spike、风险和待确认事项到 commit boundary |
| Step 7 测试与验收门禁 | 已完成;用户已确认 | 绑定 blocking gates、artifact/report、AC/VETO 和失败处理 |
| Step 8 配置、环境与外部依赖准备 | 已完成;用户已确认 | 承接目标实现仓缺失、唯一编译期依赖、P0 profiles、fake/controlled/replay seam 和不可用处理 |
| `03_ddd_step_18_risks_open_questions.md` | 已存在 | 承接详细设计遗留风险、目标仓缺失、产品化 residual 和实现前不得自行补设计规则 |
| `04_config_step_14_risks_open_questions.md` | 已存在 | 承接配置 future trigger、P1/P2 product residual 和当前 P0 无配置回写缺口 |
| `05_test_plan_step_14_regression_risks.md` | 已存在 | 承接回归触发、不可风险接受项、residual 和 evidence integrity 风险 |
| `06-验收标准.md` §3~§14 | 已存在 | 承接 `AC-ART-001~058`、`VETO-ART-001~009`、`EV-CAND-ART-*`、risk acceptance 和 final decision 口径 |
| `projects/L1-governance/...step_09...md` | 已参考 | 提供 Step 9 粒度框架,本文件按 Artifact 语义重写 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些技术点需要先做 Spike? | 需要 Spike 的点集中在目标仓 bootstrap、config/runtime builder smoke、truth carrier 设计闭口 spot check、query visibility/degraded/stale surface、consumer stale mapping、outbox stored payload source、job stored report replay、handoff/export materialization、release evidence generator no-static-evidence。 |
| 哪些风险会阻塞某个阶段? | 目标实现仓不存在、`core-contracts` 不可用、design boundary 闭口缺失、non-core compile dependency、redaction leak、query/job/relay/handoff truth repair、outbox current-truth rebuild、static evidence/VETO passed、P0 profile unavailable 均可阻塞对应 phase 或 release gate。 |
| 哪些待确认事项会影响提交边界或验收门禁? | 目标仓创建方式、目标仓 git config、release `run_id`、acceptance report 审查责任、replay root、P1 selected-run 是否执行、真实产品选型、boundary design-review 记录位置都会影响提交、报告或验收手交接。 |
| 每个 Spike 的输出是什么? | Spike 必须输出 dry-run report、closure checklist、fixture list、payload source matrix、stored report demo、target mapping demo 或 report-generation-audit 记录。不得只输出口头结论。 |
| 每个风险的处理方式和截止点是什么? | 表 7.2 逐项给出处理方式和截止点。截止点使用 PH / commit boundary / release gate,不允许无限期“后续确认”。 |
| 哪些风险需要回写上游设计? | 字段、DTO、状态、typed ref、port、version source、visibility source、projection stale source、outbox source identity、job report result、config binding、evidence/report source 任何不闭口,都必须回写 `03/04/05/06/07` 对应真相源。 |
| 哪些事项只属于 residual 或 future? | 真实 DB/bus/archive/observability/sync 产品、`staging-like` / `production-like`、P1 real-like selected-run、hard P95/SLA、长期 evidence retention 属 residual/future,不得计入当前 P0 pass。 |

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 | 本 Step 处理 |
|---|---|---|---|
| Step 8 | `/home/aris/Projects/quantalithos-artifact` 当前未发现 | PH-01 无代码落点 | 标为 `R-ART-001` blocker 和 `OQ-ART-001` |
| Step 8 | replay artifact root 只定义为去标识化 replay root,未固定具体路径 | PH-07/PH-08 replay / report 需要运行时输入 | 标为 `OQ-ART-007`,截止 `commit-07-b` / `commit-08-a` |
| Step 6 | 20 个 commit boundary 依赖设计闭口质量 | 实现期若发现 schema / port 缺口会反复回设计 | 增加 boundary closure risk 和上游回写触发 |
| Step 7 | evidence/report 红线严格 | 静态 evidence、默认 VETO passed 或缺 raw artifact 会直接阻断 PH-08 | 增加 release evidence generator Spike 和 blocker |
| `03/04/05/06` | P1/P2 和真实产品仍是 residual | 若误计为 P0 pass 会污染验收 | 增加 P0 contamination risk 和 open question |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| Spike | 分散在 phase / gate / config 描述中 | 汇总为 `SP-ART-001~009`,每项有输出物和截止点 | 防止实现期开工才发现技术闭口缺口 |
| 风险 | 分散在 `03/04/05/06` 和 Step 8 | 汇总为 `R-ART-001~016`,绑定 phase、处理方式和截止点 | 让风险可被 commit boundary 执行 |
| 待确认事项 | 分散在各 Step 的“待确认”小节 | 汇总为 `OQ-ART-001~010`,每项有关闭位置 | 防止长期悬空 |
| 设计回写 | 只在 Step 6/7/8 间接出现 | 明确 risk trigger -> 上游设计文档 | 防止实现 agent 私补 schema / port / mapper |
| P1/P2 residual | 多处说明不计 P0 | 进入风险表和开放问题表 | 防止 release handoff 时伪装 passed |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把所有不确定项都列为 Spike | 最保守 | Spike 过多会替代实现计划 | 不采用 |
| 只对影响 boundary、gate、evidence 或 design closure 的事项列 Spike | 聚焦可落码风险 | 需要边界开工前严格复核 | 采用 |
| 风险只按主题列出 | 文档短 | 实现 agent 难以判断何时阻塞 | 不采用 |
| 风险绑定 phase / commit boundary / release gate | 可执行 | 表格更长 | 采用 |
| 允许“后续确认” | 写作轻 | 会把 blocker 留给实现或验收 | 不采用 |
| 每个待确认项给截止点 | 可审计 | 需要后续维护 | 采用 |

## 7. 结构化中间产物

### 7.1 Spike 表

| 编号 | 类型 | 描述 | 影响阶段 | 输出 | 截止点 |
|---|---|---|---|---|---|
| SP-ART-001 | spike | Target repo bootstrap dry-run:确认 `/home/aris/Projects/quantalithos-artifact`、workspace、seven crate skeleton、only-core path dependency 可建立 | PH-01 | repo / workspace check 记录、`cargo check` 记录、dependency graph 记录 | `commit-01-a` 开工前 |
| SP-ART-002 | spike | Config profile and runtime builder smoke:验证 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 可解析且 invalid profile fail-fast | PH-01 | config parse smoke report、negative invalid profile report、script `--help` dry-run | `commit-01-b` 提交前 |
| SP-ART-003 | closure-spike | Truth carrier / DTO / state / port closure spot check:fact、version、lineage、baseline 四类主 truth 在开工前逐 boundary 抽查 | PH-02~PH-04 | design closure checklist;缺口 patch list 或 blocker note | `commit-02-a`、`commit-03-a`、`commit-04-a` 开工前 |
| SP-ART-004 | spike | Query visibility / degraded / stale surface dry-run:确认 13 Query 的 no-write、not-visible、degraded、stale、empty page surface 都有正式来源 | PH-05 | query source matrix、projection / freshness checklist、targeted test fixture list | `commit-05-a` 开工前 |
| SP-ART-005 | spike | Consumer affected projection / stale mapping dry-run:确认 6 Consumer 能定位 affected public view、local snapshot、receipt 和 stale marker | PH-06 | affected view mapping review、consumer fixture list、unsupported version negative list | `commit-06-b` 开工前 |
| SP-ART-006 | spike | Outbox payload snapshot and source identity dry-run:确认 8 Outbound Event 与 `PublishPendingArtifactRelays` 只消费 stored payload snapshot | PH-06 | payload source matrix、topic map fixture、publisher fake failure fixture | `commit-06-c` 开工前 |
| SP-ART-007 | spike | Job stored report duplicate replay and no-truth-repair dry-run:确认 6 public Jobs duplicate 返回 stored report,maintenance 不修 core truth | PH-07 | stored report schema review、duplicate replay demo、write-audit fixture | `commit-07-a` / `commit-07-b` 开工前 |
| SP-ART-008 | spike | Handoff / export materialization and partial failure dry-run:确认 archive / observability / sync handoff 只输出 safe refs / markers / report refs | PH-07 | target mapping、partial failure report demo、redaction fixture | `commit-07-c` 开工前 |
| SP-ART-009 | spike | Release evidence generator and no-static-evidence dry-run:确认 evidence index、VETO checklist、handoff、risk/open issues 从 raw artifact/report 推导 | PH-08 | `report-generation-audit` dry-run、static evidence negative fixture、acceptance draft review checklist | `commit-08-a` 提交前 |

### 7.2 风险表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| R-ART-001 | blocker | 目标实现仓 `/home/aris/Projects/quantalithos-artifact` 当前未发现 | PH-01 | 创建或确认目标仓,再开始 `commit-01-a` | PH-01 开工前 |
| R-ART-002 | blocker | `core-contracts` path dependency 不可用或 package 名不一致 | PH-01 | 暂停;修复 core repo/path 或回写 `03/07` | `commit-01-a` 开工前 |
| R-ART-003 | risk | 设计 baseline 或 implementation boundary ledger 在实现期间漂移 | PH-01~PH-08 | 每个 boundary 开工前记录 design commit、project ledger、boundary ledger 和 required reads | 每个 commit boundary 开工前 |
| R-ART-004 | blocker | 字段 / DTO / state / typed ref / port / version / source surface 闭口缺失 | PH-02~PH-07 | 暂停当前 boundary,回写 `03/04/05/06/07`,固定新 baseline 后重跑 Design Gate | 受影响 boundary 开工前 |
| R-ART-005 | risk | fake / in-memory / controlled adapter 跳过正式 version、UoW、idempotency、receipt、report 或 error mapping 语义 | PH-02~PH-07 | `infra-runtime-fake`、`operations-replay-core`、duplicate replay tests 强制覆盖 fake parity | 对应 fake boundary 提交前 |
| R-ART-006 | blocker | Query、consumer、relay、public job、handoff/export 或 replay 反写 core Artifact truth | PH-05~PH-07 | no-write / no-truth-repair / write-audit tests;命中则阻断并回设计或修实现 | 对应 boundary 提交前 |
| R-ART-007 | blocker | raw body、external response、secret、token 或 full sensitive ref 进入 truth、outbox、trace、report、artifact 或 handoff | PH-02~PH-08 | `redaction-boundary`、release redaction check、negative leak fixture;命中不可风险接受 | 相关 boundary 提交前;PH-08 release gate |
| R-ART-008 | blocker | 除 `L0-core/core-contracts` 外的 sibling repo 被加入 Cargo compile dependency | PH-01~PH-08 | `dependency-boundary` check;移除依赖或回写架构 / 详细设计 | `commit-01-a` 起每次 manifest 变更 |
| R-ART-009 | blocker | evidence index、VETO checklist、gate summary 或 acceptance handoff 由静态 JSON / Markdown / 手写 passed 伪造 | PH-08 | `report-generation-audit`、`check_no_static_evidence.sh`、raw artifact/report pairing | `commit-08-a` / `commit-08-b` |
| R-ART-010 | risk | P1 real-like / production-like unavailable 被误记为 P0 pass | PH-08 | selected-run unavailable 只记录 residual,不计 P0 pass | PH-08 risk acceptance / handoff |
| R-ART-011 | risk | Config CLI/env/script args 与 implementation entry 不一致 | PH-01 / PH-08 | `commit-01-b` 前复核 `04` entry-local 参数;缺口回写 `04/07` | `commit-01-b` 开工前;`commit-08-a` 前复核 |
| R-ART-012 | risk | release `run_id`、artifact root、report root 或 report generator 参数未固定 | PH-08 | Step 12 收口;release gate 调用时固定并写入 report context | `commit-08-a` 开工前 |
| R-ART-013 | blocker | Outbox / relay publish 从 current truth 重算 payload,而不是读取 stored payload snapshot | PH-06 | payload source matrix、outbox snapshot tests、relay failure tests | `commit-06-c` 提交前 |
| R-ART-014 | risk | `PublishPendingArtifactRelays` 被误计入 6 public jobs 或与 public job report surface 混淆 | PH-06~PH-07 | Step 6/7 boundary 持续单列 relay facade;job count / suite count 检查 | `commit-06-c` 和 `commit-07-a` 开工前 |
| R-ART-015 | risk | acceptance reports 缺人 / agent 审查责任,脚本初稿被误当最终结论 | PH-08 | Step 11/12 固定审查记录;PH-08 handoff 必须附 review status | `commit-08-b` 提交前 |
| R-ART-016 | blocker | Step 13 未预创建 planned implementation boundary skeleton,导致实现推进时反复等待设计补 ledger | PH-08 / implementation handoff | Step 13 按 Step 6 Boundary Gate Matrix 预创建全部 boundary skeleton,未来 boundary 为 `planned / wait_until_current` | 正式 `07` 装配和移交实现前 |

### 7.3 待确认事项表

| 编号 | 类型 | 描述 | 影响阶段 | 处理方式 | 截止点 |
|---|---|---|---|---|---|
| OQ-ART-001 | open-question | 目标实现仓由谁创建、是否从模板初始化、是否需要保留已有用户文件 | PH-01 | 实施前确认仓存在;若不存在由 PH-01 bootstrap 创建或由用户预创建 | `commit-01-a` 开工前 |
| OQ-ART-002 | open-question | 目标实现仓 `git config user.name/user.email` 是否已设置为项目要求 | PH-01 | Step 11 提交纪律检查;首次提交前执行 git config 检查 | 首次实现仓提交前 |
| OQ-ART-003 | open-question | Release `run_id` 命名规则和 candidate baseline 标识 | PH-08 | Step 12 固定规则;release gate 调用时写入 report context | `commit-08-a` 开工前 |
| OQ-ART-004 | open-question | Acceptance reports 的审查责任人 / agent 和 review 记录落点 | PH-08 | Step 11 / Step 12 固定审查记录路径和审查状态字段 | `commit-08-b` 开工前 |
| OQ-ART-005 | open-question | P1 selected-run 是否在本轮执行,以及 unavailable 如何记录 | PH-08 | 不作为 P0 pass;若执行只生成 selected-run artifact 和 residual | PH-08 risk acceptance |
| OQ-ART-006 | open-question | 真实 DB、bus、archive、observability、sync、external content source 产品是否需要提前选型 | P1/P2 | 当前不需要;记录 future ADR / product binding 触发 | PH-08 risk acceptance;future ADR |
| OQ-ART-007 | open-question | `operations-replay` replay artifact root 的具体路径、去标识化规则和 fixture owner | PH-07~PH-08 | Step 12 固定 release / replay 输入约束;缺失则 replay run reject | `commit-07-b` 开工前;PH-08 复核 |
| OQ-ART-008 | open-question | 每个 commit boundary 的设计者经验复核记录放在哪里 | PH-02~PH-08 | 正式 §6 引用;执行期可放 boundary ledger handoff、commit note 或 report review | 对应 boundary 开工前 |
| OQ-ART-009 | open-question | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 在实现仓中的实际创建时机 | PH-01~PH-08 | PH-01 创建 root;PH-08 全量审计;不得使用 `latest` | `commit-01-b` 提交前 |
| OQ-ART-010 | open-question | planned boundary skeleton 的初始 `current_boundary` 与 future `wait_until_current` 状态如何在 Step 13 写入 | Step 13 / implementation handoff | Step 13 按代码实施台账规范预创建并只激活第一 boundary | 正式 `07` 装配前 |

### 7.4 需要回写上游设计的风险触发

| 触发 | 回写目标 | 不允许的处理 |
|---|---|---|
| Command request 无法 1:1 构造 domain factory / transition input | `03-详细设计.md` Step 6/8/9/10;必要时 `07` Step 6 | 实现侧新增字段、默认值或私有 mapper |
| Query response marker、visibility result、degraded / stale / empty page surface 无正式来源 | `03-详细设计.md` Step 7/8/9/10/11 | service 临时返回 marker 或查询时写 projection |
| Consumer affected projection、receipt、local snapshot、stale marker 无 source map | `03-详细设计.md` Step 7/9/11/13 | 从 ref 字符串反推、fake 全表扫描或 silent success |
| Outbox event payload、relay item、publish marker 无 stored snapshot / source identity | `03-详细设计.md` Step 6/7/8/9/11 | publisher 从 current truth 重算 payload |
| Public job duplicate 无 stored report result surface | `03-详细设计.md` Step 7/8/9/13 | duplicate 重新执行 job |
| Handoff/export failed item 类型、target ref、artifact/report materialization 不闭口 | `03-详细设计.md` Step 6/7/8/9/15;`04` handoff config | report 填错误 ref 类型或输出目标 body |
| Config profile、CLI/env key、topic map、replay root 或 adapter mode 不闭合 | `04-配置设计.md`;必要时 `03` runtime builder | entry 自行发明 flag/env 或 silent fallback |
| Test suite、artifact/report path、candidate evidence derivation、redaction/dependency audit 不闭合 | `05-测试方案.md`;`06-验收标准.md`;`07` Step 7/8/12 | 静态 JSON / 手写 pass / orphan EV |
| Commit boundary scope、required_reads、required_checks、Handoff Gate 不闭合 | `07-实施计划.md` Step 6/7/10/11/13 | 实现 agent 自行创建或改写 implementation-boundary ledger |

### 7.5 风险 / Spike 停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Spike 是否都有明确输出 | 通过 | 输出限定为 dry-run、checklist、matrix、demo 或 audit report |
| 风险是否绑定 phase / boundary | 通过 | `R-ART-001~016` 均有影响阶段和截止点 |
| blocker 是否明确 | 通过 | 目标仓、core dependency、design closure、redaction、dependency、evidence、outbox source、planned ledger skeleton 均列 blocker |
| 待确认事项是否有截止点 | 通过 | `OQ-ART-001~010` 均有截止点 |
| 回写上游设计触发是否明确 | 通过 | 见 §7.4 |
| 是否存在长期悬空的“后续确认” | 未发现 | P1/P2 和真实产品全部转 residual / future trigger |

### 7.6 跨风险审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否覆盖目标仓 / core dependency 前置风险 | 通过 | `R-ART-001/002` |
| 是否覆盖 implementation ledger / planned boundary skeleton 风险 | 通过 | `R-ART-003/016`;`OQ-ART-010` |
| 是否覆盖设计闭环可落码风险 | 通过 | `R-ART-004`;§7.4 |
| 是否覆盖 fake shortcut 风险 | 通过 | `R-ART-005` |
| 是否覆盖 query / consumer / relay / job / handoff truth repair 风险 | 通过 | `R-ART-006/013/014` |
| 是否覆盖 redaction / dependency / evidence VETO 风险 | 通过 | `R-ART-007/008/009` |
| 是否覆盖 P1/P2 伪 pass 风险 | 通过 | `R-ART-010`;`OQ-ART-005/006` |
| 是否覆盖 config / release 参数风险 | 通过 | `R-ART-011/012`;`OQ-ART-003/009` |
| 是否覆盖 acceptance 审查责任风险 | 通过 | `R-ART-015`;`OQ-ART-004` |

## 8. 回填草稿

> 校准来源:
> - `design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“Spike 表”“风险表”“待确认事项表”“需要回写上游设计的风险触发”和“跨风险审计表”小节,了解实施风险如何绑定 phase、commit boundary 和验收门禁。

正式 `07-实施计划.md` §9 应回填:

L1-artifact 的 Spike 只允许服务于 boundary、gate、evidence 或 design closure。目标仓 bootstrap、config/runtime smoke、truth carrier closure、query visibility / stale、consumer affected projection、outbox stored payload source、job stored report replay、handoff/export materialization 和 release evidence generator 必须分别产出 dry-run、closure checklist、matrix、demo 或 audit report。

阻塞类风险包括目标实现仓不存在、`core-contracts` 不可用、字段 / DTO / state / port / source surface 不闭口、non-core sibling compile dependency、redaction leak、query / relay / job / handoff 反写 truth、outbox current truth rebuild、static evidence / default VETO passed、planned boundary skeleton 未预创建。触发后不得继续当前 boundary,必须修复、回写设计或调整实施计划后再恢复。

待确认事项必须绑定截止点。目标仓创建、git config、release `run_id`、acceptance report 审查责任、replay root、P1 selected-run、真实产品选型、boundary 经验复核记录和 artifact/report root 创建时机,都不得以“后续确认”带入实现。

凡发现 schema、field source、state transition、ref identity、visibility / stale source、outbox source identity、job report surface、config binding、evidence derivation 或 boundary ledger scope 无法落码,必须回写对应设计真相源。实现 agent 只能二次校验和报告 blocker,不得自行补 schema、port、状态、mapper、gate 或 evidence 口径。

## 9. 待确认事项

| 事项 | 当前结论 | 处理位置 |
|---|---|---|
| 目标仓创建 | PH-01 开工前确认 | `commit-01-a` |
| release `run_id` | Step 12 固定规则;PH-08 使用 | `commit-08-a` / `commit-08-b` |
| acceptance report 审查责任 | Step 11/12 固定审查记录 | PH-08 release handoff |
| P1 selected-run | 不进入 P0 pass | PH-08 risk acceptance |
| 真实产品选型 | P1/P2 future ADR | future product binding |
| replay root 具体路径 | Step 12 / PH-07 复核 | `commit-07-b` |
| planned boundary skeleton | Step 13 必须预创建 | 正式 `07` 装配 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| Spike 表已完成 | 通过 | `SP-ART-001~009` |
| 风险表已完成 | 通过 | `R-ART-001~016` |
| 待确认事项表已完成 | 通过 | `OQ-ART-001~010` |
| blocker 已明确 | 通过 | 目标仓、core dependency、design closure、redaction、dependency、evidence、ledger skeleton |
| 回写设计触发已明确 | 通过 | §7.4 |
| 无长期悬空事项 | 通过 | 每项均有截止点 |
| 正式 `07` 是否已创建 | 未创建 | 仍按 SOP 留到 Step 13 装配 |
| 可进入 Step 10 | 待用户确认 | 下一步定义回退、暂停与变更控制 |
