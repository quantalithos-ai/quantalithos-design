# L4-observability 06-验收标准 Step 03：固定验收基线

> 对应标准：`standards/document/验收标准讨论流程_SOP.md` Step 03；
> `standards/document/验收标准书写规范.md` §5.3。
> 本文件是 current full-restart 中间产物，不是验收报告，不包含真实测试结果或验收签署。

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `03 / 固定验收基线` |
| mode | `full-restart` |
| status | `completed_current_design_record_with_inherited_affected_open` |
| current_module | `immutable_acceptance_baseline_and_evidence_roots` |
| direct_input | current `00~05`；current Step 01~02；验收 SOP / 书写规范；全局依赖裁剪规则 |
| formal_document_write | `not_allowed_until_step_15` |
| implementation / test execution | `not_started` / `not_run` |
| target reality | target repo、CI、RuntimeLike instance、真实 run/artifact/report/evidence 均 `not_established` |
| new_upstream_blocker | `none` |
| inherited_affected | 12 项保持开放，见 §10 |
| gate_status | `pass_for_acceptance_baseline_design` |
| next_allowed_action | `wait_user_confirmation_before_step_04` |
| commit | 不需要；用户未要求提交 |

## Step 内计划

| 计划项 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取标准、台账和 current 上游 | 输入与权威顺序 | `done` | 不从旧 `06`、README 或旧 Step 反推 current truth |
| 回答 SOP 十个问题 | §3 问题回答 | `done` | 文档、交付、环境、数据、run 和路径均有明确回答 |
| 诊断历史冲突 | §4 问题诊断 | `done` | 旧 AC/VETO/profile/path/evidence 口径全部降级 |
| 固定基线字段与 canonical root | §7 结构化中间产物 | `done` | 每个未来必填字段有 owner、状态和缺失影响 |
| 固定变更、重跑与失效规则 | §8 基线生命周期 | `done` | 旧证据不能支撑新基线 |
| 形成正式 §3 回填草稿 | §11 回填草稿 | `done` | 不提前修改正式 `06` |
| 完成真实性与路径自检 | §13 Step 门禁 | `done` | 不伪造 commit/run/evidence/result/verdict/signoff |

## 1. 本步目标与边界

本 Step 固定“未来一次正式送验必须携带什么不可漂移的基线”，使验收者能够从一个明确的送验版本和
`<run_id>` 反查需求、设计、实现、依赖、环境、配置、数据、原始机器证据、人类可读报告和验收交接文件。

本 Step 必须收口：

- current `00~05` 的文档角色，以及未来送验时必须补齐的 design source ref / file digest。
- implementation commit、build id、交付物 digest、可选 image digest 的必填规则。
- 唯一允许的 compile-time upstream、运行期 / 事件 / handoff 依赖快照规则。
- 六个 environment lane、三个 `RuntimeProfileClass`、config snapshot 和 82 个 dataset 的基线字段。
- `<run_id>`、invocation / attempt、artifact root、report root 和 acceptance handoff 的 canonical 关系。
- 基线冻结、变更、重跑、旧证据失效和 review version 变更规则。

本 Step 不做：

- 不生成送验 build、commit、tag、image、config digest、dataset manifest 或 `<run_id>`。
- 不创建 `artifacts/test/`、`reports/runs/`、`reports/acceptance/` 下的真实文件。
- 不把 `EV-CAND-OBS-*` 升级为真实 `EV-OBS-*` evidence alias。
- 不判断任何 suite、AC 或 `VF-OBS-*` 已通过、未触发或已签署。
- 不把产品内 `ReportHandoffRecord`、`EvidenceLinkage`、trace、metric、log 或 audit projection 当成验收结论。
- 不修改正式 `06-验收标准.md`，也不进入 Step 04。

## 2. 本步输入与权威顺序

| 优先级 | 输入 | 本 Step 的使用方式 |
|---:|---|---|
| 1 | 验收 SOP Step 03、验收书写规范 §5.3 | 固定十个问题、基线表、canonical path 和禁止引用 |
| 2 | 中间产物规范、真相源闭环标准、依赖裁剪规则 | 固定三层门禁、可追溯性、唯一 compile dependency 和不伪造事实 |
| 3 | current `06_acceptance_step_01_input_boundary.md` | 承接 current 输入、真实性状态、31 AC / 10 VF 和 inherited affected |
| 4 | current `06_acceptance_step_02_scope.md` | 承接 P0/P1/P2/Forbidden、五条核心闭环和 blocked/conditional 口径 |
| 5 | current `00~03` | 承接需求、架构、对象、60 exact protocol、状态、UoW、脚本和 truth boundary |
| 6 | current `04-配置设计.md` | 承接六 lane、三个 runtime class、strict source、13-stage assembly 和 sensitive ref |
| 7 | current `05-测试方案.md` 与 Step 08/09/13 | 承接 99 TC、82 DS、9 suite、6 lane、3 profile、5 script、证据 schema 和路径 |
| 8 | L1-governance / L1-artifact current Step 03 | 只参考字段粒度、基线生命周期和送验缺口表达，不复制其 profile、ID 或 truth |
| 9 | 旧 README、旧正式 `06`、旧 Step 03、旧 implementation 资产 | 仅作 `historical_material` 和差异审计，不进入 current baseline |

### 2.1 当前可固定与不可固定的分层

| 层级 | 本 Step 当前能固定 | 当前不能填写 | 送验时的最低要求 |
|---|---|---|---|
| 设计内容 | current `00~05` 路径、职责和状态 | immutable design commit / file digest | 同一 design source ref 下可复查，或逐文件 digest 可复查 |
| 实现交付 | 字段和不可变性规则 | implementation commit / build / artifact / image digest | 送验交付物与源码、构建和可选镜像一一绑定 |
| 环境配置 | lane/profile 合法矩阵和字段 | 实例、config digest、binding/capability snapshot | 每个 invocation 固定 lane/profile/config/dependency snapshot |
| 测试数据 | 82 个 `DS-OBS-*` 设计 ID 和 manifest contract | 真实 fixture、namespace、seed/snapshot digest | run-scoped、去标识、可清理、可复现且不含业务正文 |
| 执行证据 | canonical schema 和路径 | `<run_id>`、artifact、report、candidate result | 同一 run 下 raw -> report -> index 可逆追溯 |
| 验收交接 | 固定文件名和 review version 规则 | handoff 内容、VETO 裁决、风险接受、签署 | 引用固定 run/source/digest，不能由模板默认通过 |

## 3. SOP 问题回答

### 3.1 按哪一版需求和设计验收

正式验收必须绑定 current `projects/L4-observability/00-需求文档.md` 至 `05-测试方案.md` 所在的同一
design source ref；若送验流程不能保证单一 source ref，还必须逐文件记录 `content_digest`。文件名或“当前版本”
不足以形成验收基线。当前工作树内容是本轮校准输入，但尚未形成送验意义上的 immutable design source ref。

`06-验收标准.md` 是裁决规则，不把自身作为被测设计来源；Step 01~03 是裁决形成过程的 trace，不替代 `00~05`。
`07-实施计划.md` 是下游实施编排，不得反向成为本 Step 的需求、设计或测试 truth。

### 3.2 按哪一版测试方案和测试结果裁决

测试方案固定为 current `05-测试方案.md`，其 current 计数为 16 cuts、60 exact protocols、27 formal state
owners + 1 technical coordination state、99 TC、82 DS、9 primary suites、6 lanes、3 profiles、5 scripts。

测试结果只能来自未来固定 `<run_id>` 的真实 raw artifact 与由同一 raw root 生成的 report。设计期
`TC-OBS-*`、`DS-OBS-*` 和 `EV-CAND-OBS-*` 只分别表示用例、数据与候选关联键，不是结果或 evidence。

### 3.3 送验 build / commit / image 是什么

当前均不存在，不填写占位实值。正式送验至少必须固定：

| 字段 | 必填性 | 规则 |
|---|---|---|
| `implementation_repository` | 必填 | 指向唯一目标实现仓身份，不以本机临时目录状态代替 |
| `implementation_commit` | 必填 | immutable commit；不得写 branch、`HEAD`、`current` 或“最新提交” |
| `build_id` | 必填 | 能回指 implementation commit、toolchain 和 build manifest |
| `delivery_artifact_digest` | 必填 | 对实际送验 binary/package 计算，不以文件名代替 |
| `image_digest` | 条件必填 | 只有交付形态包含 image 时必填；必须是 immutable digest，mutable tag 不成立 |
| `source_tree_state` | 必填 | 必须证明构建输入与 commit 一致；dirty/untracked 输入需阻断或形成新 commit |

### 3.4 环境、配置、数据和依赖是什么

每个真实 invocation 必须记录 exact environment lane、`RuntimeProfileClass`、validated config snapshot、
selected dependency binding/capability snapshot、dataset manifest、clock/ID mode、fixture namespace 和 cleanup state。

允许的 runtime class 只有 `LocalTest`、`IntegrationLike`、`RuntimeLike`。lane 只是执行语境，不进入 typed
config，也不能由 host、branch、binary 或 namespace 推断 profile。低真实性 lane 的结果不能替代高真实性 lane。

compile-time dependency 只允许 `L0-core/core-contracts`；其 commit/package version、content digest 和
lockfile/graph digest 必须固定。Bus、Identity、Governance、Artifact、Runtime、Sandbox、Archive、SDK、Console
以及外部产品只能通过 current 设计允许的 event/runtime/ref/handoff seam 进入依赖快照，不能成为 sibling path dependency。

### 3.5 基线变更如何处理

基线冻结前可以修订 draft manifest，但不能产生正式证据。基线冻结并开始执行后，任何影响需求、设计、实现、
依赖、配置、数据、suite/check、artifact/report schema 或验收范围的变化都不能原地修改旧 run；必须计算影响面、
生成新 `<run_id>`、重跑 required coverage，并将旧证据标为 superseded 或 invalidated，而不是删除。

只修改 `reports/acceptance/*` 的审查说明且不改变证据选择或裁决时，可以保留 run，但必须增加 review version、
重新计算文件 digest 并保留变更记录。改变 selected run、VETO 状态、风险接受、送验范围或最终裁决不属于文字修订。

### 3.6 本轮验收固定的 `<run_id>` 是什么

当前不存在，不伪造。正式裁决前必须选择一个非 `latest` 的 primary `<run_id>`。它标识一次 immutable
acceptance evidence set，不是 `core_contracts::metadata::JobRunId`、`ObservationJobExecutionRef`、fixture namespace、
deployment id、trace id 或产品内 report handoff identity。

同一 run 内不同 lane/profile/attempt 必须有独立 invocation / attempt 记录，不能覆盖。基线冻结后的重跑使用
新 `<run_id>`；旧 run root 保持只读。

### 3.7 原始机器证据是否位于 `artifacts/test/<run_id>`

必须是。canonical raw root 唯一为 `artifacts/test/<run_id>/`，并由 `meta/context.json`、source/config/dataset
manifest、suite/case/check raw record 和 `evidence-index.json` 组成。`artifacts/test/<project>/<run_id>`、
`artifacts/test/latest`、临时目录、手写 JSON 或无 digest raw output 都不能成为正式基线。

### 3.8 人类可读报告是否位于 `reports/runs/<run_id>`

必须是。`scripts/reports/generate_reports.sh` 只能读取同一 `artifacts/test/<run_id>` 并输出同一
`reports/runs/<run_id>`。report 缺 raw back-reference、run mismatch、缺失 required suite/check、无法解析或由
设计文档/旧 run 补默认成功时，当前 evidence set 不可裁决。

### 3.9 验收交接文件是否位于 `reports/acceptance/`

必须是。固定入口为 `handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md`。
`risk-acceptance.md` 仅在存在 residual / 有条件通过候选时成为结论前置，但路径和“缺失时不能有条件通过”的规则
始终固定。每个文件必须记录 review version、content digest、selected run 和审查状态，不得由 generator 默认签署。

### 3.10 是否存在不可作为正式基线的引用

存在。以下引用一律拒绝：`latest`、branch/`HEAD`/“当前提交”、mutable image tag、泛化 `test/staging`、
无 config/dataset/dependency digest 的环境、`reports/<project>`、`reports/latest`、
`artifacts/test/<project>/<run_id>`、跨 run 拼接而无 lineage 的报告、静态 `passed`/green/VF 未触发、
真实值形态的伪 `EV-OBS-*`、以及产品内 trace/log/metric/audit/report handoff 对最终验收的自我声明。

## 4. 当前文档问题诊断与 historical material

| 材料 / 位置 | 冲突或不足 | Current 处置 |
|---|---|---|
| 旧 Step 03（81 行） | 只写观测对象摘要，没有送验字段、环境/数据 snapshot、证据根或失效规则 | 整体替换；不继承其 gate 结论 |
| 旧正式 `06` §2~§11 | 只有 6 个旧 AC、旧 `VETO-OBS-*`、旧协议名和泛化 evidence | 标记 `historical_material`；Step 15 按 31 current AC / 10 `VF-OBS-*` 重装 |
| 旧正式 `06` §3 | 只写 `00~05` 和 path 方向，缺 source ref、delivery/config/data/dependency 字段 | 本 Step 固定字段级 manifest 和缺失影响 |
| 旧正式 `06` §4 | 把 `00~07`、旧 implementation ledger 当进入条件 | `07` 是下游；旧 ledger/skeleton 不进入 current baseline |
| README / 旧产品材料 | 产品、P95/P99、保留天数、147 events、旧目录和技术栈可能漂移 | 只保留 historical trace；不得成为硬基线 |
| 旧上游参考模板 | 四 profile、其他项目 EV/AC/VETO 命名可能被复制 | Observability 只使用 3 profile、`EV-CAND-OBS-*`、31 AC、10 VF |
| current `03` 与 `05` report 命名 | `03` planned script 有内部 `*-check.md` 名；`05` Step 13 已收敛 canonical report 名 | `05` canonical report path 优先；内部输出只作 producer mapping，不形成第二 truth |
| target reality | 目标实现仓、CI、runtime instance、run/artifact/report/evidence 未建立 | 记录为正式送验前置缺口；不阻断本 Step 设计完成 |

## 5. 改动前后对比

| 维度 | 旧 Step / 旧正式 `06` | Current Step 03 |
|---|---|---|
| 文档基线 | 文件名或“当前文档” | `00~05` + immutable design source ref / file digest |
| 交付基线 | 无固定字段 | repo + commit + build + artifact digest + 条件 image digest |
| 依赖基线 | only-core 口号 | core-contracts source/package/graph digest + runtime/event/handoff snapshot |
| 环境基线 | test/staging 泛称 | 6 exact lane + 3 exact runtime class + validated config snapshot |
| 数据基线 | 未定义 | 82 exact DS 的 run-scoped manifest、namespace、digest、cleanup |
| 证据身份 | candidate 名称或泛化报告 | primary run + invocation/attempt + raw/report digest + candidate linkage |
| 路径 | 只有根路径方向 | canonical required files、禁止路径和 producer/read-only 关系 |
| 变更与重跑 | 未定义 | freeze -> execute -> report -> review；变更新 run，旧证据保留并失效 |
| 真实性 | 文件存在容易被误读为通过 | 当前统一 `not_established/not_run`，无真实 EV/verdict/signoff |

## 6. 验收裁决取舍

| 议题 | 可选方案 | Current 取舍 | 原因 |
|---|---|---|---|
| 设计阶段是否填实际 commit/run | A. 填临时值；B. 保持待送验固定 | 采用 B | 当前没有 immutable delivery/evidence，临时值会伪造基线 |
| 文档基线只记文件名是否足够 | A. 足够；B. 加 source ref/digest | 采用 B | 文件可变，必须能复查送验时内容 |
| 是否允许 `latest` 便利入口 | A. 正式可用；B. 正式禁止 | 采用 B | alias 漂移，不能支撑审计 |
| 多 lane 是否合并成一个模糊结果 | A. 合并；B. 每 invocation/attempt 独立 | 采用 B | 真实性等级、配置和数据不能互相替代 |
| 重跑是否覆盖旧 root | A. 覆盖；B. 新 run + lineage | 采用 B | 保留失败历史和裁决可复现性 |
| acceptance 文件能否自动 passed | A. 可以；B. 只能生成待审输入 | 采用 B | generator/Observability 不拥有最终裁决 |
| RuntimeLike 缺失是否用 LocalTest 替代 | A. 替代；B. 保持 not_evaluated/blocked | 采用 B | 低真实性 evidence 不能升级 |
| 产品 telemetry 是否等于验收 evidence | A. 等同；B. 只有 captured raw ref 才能作为输入 | 采用 B | telemetry 是观察投影，不是业务 truth 或最终 verdict |

### 6.1 模块骨架与复杂度判断

Step 03 不是一张“版本信息表”，而是一个跨文档、交付、环境、数据和证据的冻结协议。按以下模块独立审查，
每个模块都有自己的输入、输出和门禁：

| 模块 | 主要问题 | 结构化输出 | 模块门禁 | 当前状态 |
|---|---|---|---|---|
| design-source-baseline | 验收按哪套 `00~05` 和标准裁决 | source ref / content digest registry | 每个 P0 输入均可定位；未有 ref 不伪造 | `pass_design` |
| delivery-and-dependency-baseline | 哪个实现、build、image 和 core contract 被送验 | delivery/dependency field registry | commit、build、artifact、dependency 字段独立且不混 Job/run identity | `pass_design` |
| environment-config-data-baseline | 哪个 lane/profile/config/dataset 实际运行 | environment/profile/data manifest contract | 3 profile、6 lane、82 DS 不跨等级替代 | `pass_design_with_precondition` |
| run-and-evidence-roots | 如何从一个 run 反查 raw/report/acceptance | run manifest、canonical roots、linkage schema | 同 run、同 digest、失败保留、无 `latest` | `pass_design` |
| baseline-change-control | 何时重跑、何时使旧 evidence 失效 | freeze/change/re-run matrix | 影响 P0 的变化生成新 run，旧根只读保留 | `pass_design` |

复杂度判断：本 Step 需要字段注册表、路径树、provenance 图和变更矩阵四类产物，不能压缩为一张总表；但它
不需要新建 domain state、public protocol 或产品实现对象。上述 `baseline_*`、`run_*` 和 `evidence_*` 字段是
验收/测试编排 metadata contract，不是 `L4-observability` 业务 truth，也不增加 `03` 的 27 个 formal state owner。

## 7. 结构化中间产物：基线字段注册表

下表定义 future acceptance baseline manifest 的字段级要求。`required` 表示正式送验前必须有可验证值；
`planned` 表示设计已定义但当前没有执行值；`not_applicable` 只允许在交付形态或本轮范围明确不适用时使用，
不能用来掩盖缺失的 required field。

### 7.1 设计与标准基线

| 基线组 | 字段 | 必填 | 当前状态 | 未来值来源 | 缺失影响 |
|---|---|---:|---|---|---|
| requirement | `requirements.source_ref` | 是 | `not_established` | `00-需求文档.md` 的 immutable commit/immutable tag/digest | 无法确定 AC/VF 输入，不能进入正式裁决 |
| requirement | `requirements.content_digest` | 是 | `not_established` | 送验时对 current `00` 内容计算的 content digest | 文件漂移，旧 evidence 不可复用 |
| architecture | `architecture.source_ref` | 是 | `not_established` | `01-架构设计.md` source ref | 无法裁决 truth ownership / dependency boundary |
| architecture | `architecture.content_digest` | 是 | `not_established` | 送验时 current `01` digest | 架构红线证据失效 |
| hld | `hld.source_ref` | 是 | `not_established` | `02-概要设计.md` source ref | protocol / component / flow 输入不完整 |
| hld | `hld.content_digest` | 是 | `not_established` | 送验时 current `02` digest | 概要契约与 evidence 可能错配 |
| ddd | `ddd.source_ref` | 是 | `not_established` | `03-详细设计.md` source ref | exact object/protocol/state/UoW 无法定位 |
| ddd | `ddd.content_digest` | 是 | `not_established` | 送验时 current `03` digest | P0 设计闭环失效 |
| config | `config_design.source_ref` | 是 | `not_established` | `04-配置设计.md` source ref | profile / strict validation 无法裁决 |
| config | `config_design.content_digest` | 是 | `not_established` | 送验时 current `04` digest | 配置证据与代码输入可能漂移 |
| test | `test_plan.source_ref` | 是 | `not_established` | `05-测试方案.md` source ref | TC/DS/EV/suite/path 不可定位 |
| test | `test_plan.content_digest` | 是 | `not_established` | 送验时 current `05` digest | 报告不能证明按哪套测试方案生成 |
| process | `standards.source_refs` | 是 | `planned` | 本轮使用的 SOP、书写规范、通用标准 source refs | 生成过程不可复查；标准变化需重新校准 |
| process | `calibration.source_refs` | 是 | `planned` | current 06 Step 01~03 文件 refs/digests | 无法审计验收范围和基线如何收敛 |

`source_ref` 不能写成 branch、普通可变 tag、工作树路径、`HEAD` 或“当前文件”。路径是定位信息，digest/source ref 才是
immutable identity。当前 design-calibration 文件存在不代表它们已经成为送验 design baseline。

### 7.2 交付与构建基线

| 基线组 | 字段 | 必填 | 当前状态 | 未来值来源 | 缺失或冲突影响 |
|---|---|---:|---|---|---|
| implementation | `implementation.repository_ref` | 是 | `not_established` | 目标实现仓的固定仓身份 | 无法确认被测仓，阻断验收 |
| implementation | `implementation.commit` | 是 | `not_established` | 目标仓 immutable commit | branch/HEAD 不能作为送验版本 |
| implementation | `implementation.source_tree_digest` | 是 | `not_established` | 构建输入树或等价 source manifest | dirty/untracked 输入未解释时阻断 |
| build | `build.id` | 是 | `not_established` | CI/build producer | 无法回指构建过程和 toolchain |
| build | `build.manifest_digest` | 是 | `not_established` | compiler/toolchain/lockfile/build flags manifest | 构建不可复现 |
| delivery | `delivery.artifact_digest` | 是 | `not_established` | 实际 binary/package digest | 只能按文件名或 tag 定位时阻断 |
| delivery | `delivery.image_digest` | 条件必填 | `not_established`（是否使用 image 由未来交付形态确定） | 实际 image manifest digest | 使用 mutable image tag 时阻断 |
| dependency | `core_contracts.source_ref` | 是 | `not_established` | `L0-core/core-contracts` source/package ref | only-core contract 输入不可复查 |
| dependency | `core_contracts.content_digest` | 是 | `not_established` | source/package content digest | contract mismatch 时旧 evidence 失效 |
| dependency | `dependency_graph_digest` | 是 | `not_established` | Cargo/lockfile/module graph snapshot | sibling compile edge 或图漂移阻断 |

`image_digest` 只有在实际送验交付包含 image 时才为 required；不能以“未使用 image”隐藏 binary/package
digest。目标实现仓当前不存在，因此表中的 `not_established` 是真实性状态，不是待执行测试的失败结果。

### 7.3 环境与配置基线

| 字段 | 必填 | 允许值 / 结构 | 当前状态 | 失败处理 |
|---|---:|---|---|---|
| `environment.lane_id` | 是 | 六个 exact lane：`ENV-LCL-ISO`、`ENV-LCL-INT`、`ENV-CI-ISO`、`ENV-CI-INT`、`ENV-STG-RT`、`ENV-PRD-RT` | `planned` | 未知 lane 或 lane/profile 混写，整次 invocation `blocked` |
| `environment.runtime_profile_class` | 是 | `LocalTest`、`IntegrationLike`、`RuntimeLike` | `planned` | 缺失或由 host/branch 推断，`InvalidConfiguration` |
| `environment.store_mode` | 是 | 由 profile 合法矩阵决定的 `InMemory` / `Durable` | `planned` | 非法组合或 silent substitution，阻断 |
| `environment.clock_mode` | 是 | `Fixed` / `System`，遵循 profile 约束 | `planned` | 非法组合，阻断；不得默默改 mode |
| `environment.id_mode` | 是 | `Deterministic` / `Runtime`，遵循 profile 约束 | `planned` | 非法组合，阻断 |
| `environment.external_modes` | 是 | 每个 external family 的 `Fake` / `Controlled` / `Endpoint` / `Disabled` | `planned` | required capability 缺失不得转成 silent success |
| `environment.config_snapshot_digest` | 是 | validated config snapshot 的 digest | `not_established` | 无 digest 或与 runtime 不一致，阻断 |
| `environment.binding_snapshot_digest` | 是 | selected adapter/transport/store binding 与 capability digest | `not_established` | 不能证明实际绑定，阻断或 `not_evaluated` |
| `environment.secret_reference_digest` | 条件必填 | 只记录 secret/locator reference 的 digest，不记录值 | `not_established` | required secret 未解析，candidate 不暴露 |
| `environment.toolchain_digest` | 是 | runner/build/test toolchain manifest digest | `not_established` | 不能复查执行条件，阻断 evidence provenance |
| `environment.host_snapshot_digest` | 条件必填 | 真实 lane 所需的受控环境摘要 | `not_established` | 只在 lane 要求时必填；不允许以机器名称替代 |
| `environment.cleanup_policy_ref` | 是 | dataset namespace / teardown policy ref | `planned` | cleanup contract 缺失，后续 run 不得继续复用环境 |

profile 合法矩阵固定如下；它是配置候选的约束，不是当前环境已经存在的证明：

| RuntimeProfileClass | Store / clock / ID | External mode | 当前可裁决语义 |
|---|---|---|---|
| `LocalTest` | `InMemory` 或 `Durable`；`Fixed`/`System`；`Deterministic`/`Runtime` | `Fake`/`Controlled`/`Disabled` | 可用于 isolated semantic/conformance；不能证明 RuntimeLike |
| `IntegrationLike` | `Durable` + `System` + `Runtime` | `Controlled`/`Endpoint`/`Disabled` | 可用于 durable/restart/capability；缺实例则 blocked/not_run |
| `RuntimeLike` | `Durable` + `System` + `Runtime` | `Endpoint`/`Disabled` | 只接受 managed runtime candidate；当前实例未建立 |

以下组合必须在配置装配前拒绝：`RuntimeLike` + `InMemory`/`Fake`/`Controlled`/`Fixed`/`Deterministic`，
`IntegrationLike` + `InMemory`/`Fake`/`Fixed`/`Deterministic`，以及任何 `LocalTest + Endpoint` 组合。

### 7.4 数据基线

`05` 当前固定 82 个 exact dataset：54 个 canonical/fixture/static dataset、27 个 formal state owner corpus
dataset 和 1 个 `ObservationJobPlanItemState` technical coordination dataset。Step 03 不复制 82 行清单；exact
ID、primary suite 和 lane 以 current `05` Step 07/13 join 为唯一来源，baseline manifest 必须逐项展开而不能用
family、wildcard 或“全量数据集”替代。

| manifest 字段 | 必填 | 语义 | 当前状态 / 约束 |
|---|---:|---|---|
| `dataset_manifest_ref` | 是 | 本次 run 使用的完整 exact DS 清单 | `not_established`；缺失即 incomplete |
| `dataset_manifest_digest` | 是 | 清单内容 digest | 不可用旧 run 或静态表补齐 |
| `dataset_id` | 是 | `DS-OBS-*` exact ID | 每个 TC 至少一个；不得使用 wildcard |
| `dataset_builder_ref` | 是 | fixture/seed/snapshot producer 版本 | 不能把手写 JSON 当 builder provenance |
| `dataset_content_digest` | 是 | 去标识、body-free fixture 或 corpus digest | 不记录业务正文或 secret |
| `fixture_namespace` | 条件必填 | run-scoped 隔离命名空间 | 不是 run、Job、evidence 或业务 truth identity |
| `seed_or_snapshot_ref` | 条件必填 | 可复现 seed/snapshot/replay root ref | 不记录 raw body；缺失时标 `not_reproducible` |
| `allowed_lane_profile` | 是 | exact lane/profile allowlist | 违规使用必须阻断，不跨 lane 升级 |
| `sensitivity_class` | 是 | body-free / synthetic / controlled / de-identified 等有限分类 | forbidden material 不能进入 manifest |
| `cleanup_state` | 是 | `planned`、`clean`、`failed`、`blocked` 等受控状态 | cleanup 未闭合时后续执行 blocked |
| `replay_root_ref` | 条件必填 | 需要 replay/operations job 的 dataset 根 | 不得使用 `latest` 或 current source truth 重算 |
| `affected_constraint_refs` | 条件必填 | I05/J06/UoW 等 affected 约束 | positive blocked 不能被标为 passed |

数据基线必须同时保存“使用了什么”和“没有保存什么”：原始业务正文、evidence/artifact body、credential、
provider response、完整敏感 locator、真实验收 signoff 和最终 verdict 都是 forbidden material，不得以 hash、
base64、debug 或压缩形式绕过 redaction。

## 8. 结构化中间产物：run-level baseline 与证据根

### 8.1 Run-level baseline manifest

正式送验必须有一个 primary baseline manifest。它可以由送验编排器生成，但必须是 immutable、可解析、可审计的
输入；不能由 `06` 正文、手写表或 generator 默认值代替。以下是字段级合同，不是当前存在的 JSON 文件：

| 字段组 | 必需字段 | 约束 | 当前状态 |
|---|---|---|---|
| baseline identity | `baseline_id`、`baseline_schema_version`、`review_version` | baseline identity 与 review 文本 identity 分离；schema version 变化触发新 baseline | `planned` |
| acceptance selection | `primary_run_id`、`selected_run_reason`、`scope_ref` | `primary_run_id` 必须是非 `latest` 的真实 run；scope 必须回指 current Step 02 | `not_established` |
| run relation | `parent_run_id`、`supersedes_run_id`、`invalidates_run_ids` | 首次 run 可为空；重跑必须保留 lineage，不覆盖旧 root | `planned` |
| design refs | `requirements_ref`、`architecture_ref`、`hld_ref`、`ddd_ref`、`config_ref`、`test_plan_ref` | 每项同时含 source ref 和 content digest | `not_established` |
| delivery refs | `implementation_ref`、`build_ref`、`artifact_ref`、`image_ref`（条件） | 与 §7.2 字段一致；不允许 branch/tag-only | `not_established` |
| dependency refs | `core_contracts_ref`、`dependency_graph_ref`、`runtime_dependency_snapshot_ref` | compile/runtime/event/handoff 类型必须可区分 | `not_established` |
| execution context | `lane_id`、`runtime_profile_class`、`config_snapshot_ref`、`binding_snapshot_ref` | 一个 invocation 一个 exact lane/profile/config binding | `planned` / `not_established` |
| data context | `dataset_manifest_ref`、`dataset_manifest_digest`、`fixture_namespace`、`replay_root_ref`（条件） | exact DS join；namespace 不得成为业务身份 | `not_established` |
| producer context | `gate_script_ref`、`report_script_ref`、`check_script_refs`、`runner_version` | 只能是 current 5-script contract | `planned` |
| evidence roots | `artifact_root`、`report_root`、`acceptance_root`、`review_root` | 必须匹配 §8.2 canonical roots | `planned` |
| status | `baseline_status`、`run_status`、`evidence_status` | 使用有限状态；缺失不能折叠为 passed | `planned` |
| integrity | `manifest_digest`、`generated_at`、`generator_ref`、`input_integrity_status` | digest 覆盖 manifest 内容；时间只能说明生成时间 | `planned` |
| retention | `retention_marker_ref`、`hold_state`、`active_reference_count`、`cleanup_decision` | marker 只表达本地观察，不定义 TTL 或删除 source | `planned` |

`generated_at`、trace id、span id、attempt、claim token 和 `core_contracts::metadata::JobRunId` 不能替代
`primary_run_id`。同样，`baseline_id` 不能被当作实现 commit、Job identity 或业务 truth ref。

### 8.2 Canonical root 与必需文件

路径本身也是验收契约。实际值中的 `<run_id>` 必须与 manifest、所有 raw record、所有 report 和 acceptance
handoff 中的 `primary_run_id` 一致。当前仅固定路径模板，不创建目录：

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

规则如下：

| 规则 | 要求 | 违反时的状态 |
|---|---|---|
| root identity | raw/report root 中的 `<run_id>` 必须非空且与 manifest 相等 | `blocked` |
| raw/report pairing | report 只能从同一 run 的 raw root 生成；不能跨 run 拼接 | `blocked` |
| required file completeness | required suite/check 的最小文件必须存在且可解析；失败也要有 failure record | `blocked` |
| evidence index derivation | `evidence-index.json` 是 raw relation 的机器投影，`evidence-index.md` 是其可读投影 | provenance failure |
| acceptance handoff | acceptance 文件引用 selected run 和 report path，但不拥有 raw evidence | `not_ready` / `blocked` |
| review projection | review 文件只能补充审查意见和冲突记录，不能改 raw/report 或制造 evidence | review conflict |
| path namespace | 禁止 `latest`、project 子目录、别名根、临时绝对路径和跨 run hard link 作为正式引用 | `blocked` |

### 8.3 Raw -> report -> acceptance provenance

未来每个 P0 验收引用都必须形成下列单向关系：

```text
source/design/config/dataset snapshot
          |
          v
run-level context + exact TC case artifact
          |
          v
suite report + gate/check report
          |
          v
reports/runs/<run_id>/evidence-index.md
          |
          v
reports/acceptance/handoff.md
          |
          v
06 future AC/VF decision input
```

每一跳必须保留 source ref、path、digest、producer 和 status。`06` 可以引用 report/evidence index，但不能
把 `report generated`、`metric clean`、`audit projection appended`、`HandoffReady` 或产品内 `Delivered` 当作
验收通过。Observability 的 report handoff 仍然只是被测能力和验收输入，不是最终裁决 owner。

### 8.4 最小 evidence linkage record

未来 `evidence-index` 的每一条 candidate linkage 至少要能表达以下字段；此处不生成任何真实记录：

| 字段 | 作用 | 缺失处理 |
|---|---|---|
| `candidate_evidence_id` | 对应 current `EV-CAND-OBS-*` | orphan candidate，阻断 |
| `tc_id` | exact `TC-OBS-*` | orphan TC，阻断 |
| `ac_refs` / `vf_refs` | 关联验收项和红线 | P0 无法裁决，阻断 |
| `run_id` / `invocation_id` / `attempt` | 定位真实执行 | 无法复验，阻断 |
| `suite_id` / `lane_id` / `profile` | 定位 primary suite 与真实性等级 | 跨 suite/lane 混用，阻断 |
| `dataset_refs` | 回指 exact `DS-OBS-*` | 缺 dataset provenance，阻断 |
| `artifact_path` / `artifact_digest` | 回指 raw case 或 check | 无 raw evidence，阻断 |
| `report_path` / `report_digest` | 回指 suite/run report | 无可读报告或 digest mismatch，阻断 |
| `status` / `failure_reason` / `blocked_reason` | 保留执行结果和不可用原因 | 不得以空值表示 passed |
| `source_snapshot_refs` | 回指 design/config/dependency input | 输入漂移，旧 linkage 失效 |
| `redaction_status` | 证明 evidence/index 本身经过安全检查 | 未执行或 failed，证据门禁阻断 |
| `provenance_record_digest` | 防止 linkage 被静态改写 | digest mismatch，阻断 |

`candidate_evidence_id` 只能在真实 raw relation 生成后成为 candidate record；设计期表格中的同名 ID 不代表
该字段已经有值。正式 evidence alias、最终 AC 结论和签署由后续真实执行/验收流程产生，不能由此 Step 预填。

### 8.5 Acceptance handoff 的基线字段

`reports/acceptance/*` 的固定文件名不等于文件已经存在。未来生成或人工审查时至少必须互相回指：

| 文件 | 必须包含的基线引用 | 可表达 | 不可表达 |
|---|---|---|---|
| `handoff.md` | baseline id、review version、selected run、design/delivery/config/data refs、artifact/report roots | 送验范围、缺口、blocked/conditional 说明 | 静态 final verdict、signoff、真实 evidence alias |
| `veto-checklist.md` | `VF-OBS-001~010`、TC/EV/report refs、raw/check digest | 每项待检查、finding、未来裁决输入 | 缺证据自动等于未触发 |
| `risk-acceptance.md` | residual id、影响面、run/report refs、责任角色、接受角色、动作、截止/触发条件 | 有条件通过候选的显式风险记录 | 无接受人的批准、VETO 接受、伪造签署 |
| `open-issues.md` | blocker/affected/defect、owner、source ref、next action、重跑范围 | 未关闭问题和恢复路径 | 删除问题或把 blocked 改写为 pass |

验收交接文件若只存在模板、没有 selected run 或没有 raw/report provenance，基线状态为 `not_ready`；它不是
本 Step 的新 blocker，但会阻断正式验收进入/退出条件。

## 9. 基线冻结、变更、重跑与旧证据失效

### 9.1 基线生命周期标签

以下是 baseline metadata 的生命周期标签，不是验收结论，也不替代 `05` 定义的 run/case/suite 状态：

| 标签 | 含义 | 当前是否可用 | 允许的下一动作 |
|---|---|---|---|
| `design_planned` | 字段、路径和规则已在设计中定义，但没有真实送验值 | 是 | 继续校准；不得生成 evidence |
| `freeze_pending` | 送验材料正在收集，至少一个 required field 尚未固定 | 未来 | 补齐 manifest；不得开始正式裁决 |
| `frozen` | 所有 required source/delivery/environment/data/run/root 字段已固定，manifest digest 已封存 | 当前否 | 执行或复核同一 baseline |
| `superseded` | 被一个有明确 lineage 的新合法 baseline 替代 | 当前否 | 保留只读历史；不再作为 primary selection |
| `invalidated` | 因 digest/path/provenance/forbidden material/范围不一致而不可用于裁决 | 当前否 | 保留 finding；修复后新建 baseline/run |

当前 Step 03 的 baseline 状态是 `design_planned`。不能把 calibration 文件存在、测试方案计数完成或 planned
script contract 存在写成 `frozen`。

### 9.2 冻结前置门禁

未来只有同时满足下列条件，baseline 才能从 `freeze_pending` 变成 `frozen`：

| 门禁 | 必须证明 | 当前状态 |
|---|---|---|
| design source | current `00~05` source ref 与 content digest 固定，且与 Step 02 scope 一致 | `not_established` |
| delivery | implementation commit、build manifest、delivery artifact digest 固定；image 形态则补 image digest | `not_established` |
| dependency | `core-contracts` source/digest、dependency graph 和 runtime/event/handoff snapshot 固定 | `not_established` |
| environment | exact lane/profile/mode、config snapshot、binding/capability、toolchain 和 cleanup policy 固定 | `not_established` |
| data | exact dataset manifest、fixture/replay root、namespace、sensitivity 和 cleanup 状态固定 | `not_established` |
| run identity | 真实、唯一、非 `latest` 的 `<run_id>` 与 invocation/attempt 关系固定 | `not_established` |
| root integrity | raw/report/acceptance/review roots符合 canonical path，且不存在跨 run 拼接 | `not_established` |
| provenance | raw artifact、report、evidence index 能形成同 run、同 digest、同 TC/DS/suite 的可逆关系 | `not_established` |
| redline | no raw body/secret、only-core dependency、no-write、history/static evidence scan 均可执行 | `not_established` |

任一 required gate 缺失时，正式验收只能保持 `not_ready`、`blocked` 或 `not_evaluated`；不能用人工说明、旧 run、
低等级 lane、空 artifact、静态 evidence index 或验收模板补齐。

### 9.3 基线变更处理矩阵

| 变更对象 | 是否需要新 baseline | 是否需要新 `<run_id>` | 最小处理 | 旧 evidence 处置 |
|---|---:|---:|---|---|
| `00` 需求、P0/P1/P2、AC/VF 或 truth boundary | 是 | 是 | 回到受影响需求/验收 Step；重建 affected scope 和 P0 manifest | `superseded`；若旧范围不再适用则 `invalidated` |
| `01` 架构、ownership、dependency type 或 no-write boundary | 是 | 是 | 重新做架构红线、dependency、writer capability 和受影响 suite 审计 | 旧 run 不可直接支撑新边界 |
| `02` 组成部分、flow、状态轮廓或 public surface | 是 | 是 | 重新闭合受影响 protocol/state/flow AC 与 TC/EV join | affected linkage `invalidated` |
| `03` exact object、protocol、state、UoW、recovery、redaction 或 script contract | 是 | 是 | 至少全量 P0 contract/affected suite；共享契约变化触发 full P0 | 旧 report/evidence 只读保留并标失效 |
| `04` profile legality、source priority、config schema、binding 或 activation | 是 | 是 | 重跑 config-redline 和受影响 lane；不得跨 profile 复用 | config mismatch 的旧 run `invalidated` |
| `05` TC/DS/suite、script、artifact/report schema 或 evidence join | 是 | 是 | 重建 exact manifest、provenance audit 和受影响 raw producer | 旧 evidence index 不可复用 |
| implementation commit/build/artifact/image | 是 | 默认是 | 重新绑定交付物并执行受影响或 full P0；默认不接受“无影响”口头声明 | 旧 run `superseded` 或 `invalidated` |
| `core-contracts` 或 lockfile/dependency graph | 是 | 是 | contract、dependency boundary 和受影响跨 seam 全量复核 | 旧 compile/runtime evidence 失效 |
| lane/profile/config/binding/secret reference | 是 | 是 | 新 invocation 必须独立记录；缺依赖保持 blocked/not_run | 不得把 ISO/INT/RT 结果合并 |
| fixture/seed/snapshot/replay root/dataset manifest | 是 | 是 | 重新生成 DS manifest、namespace、cleanup 和受影响 TC | 旧 dataset linkage 失效 |
| acceptance scope 选择 primary run | 是 | 是 | 新 baseline 明确 `selected_run_reason` 和 lineage | 原 primary 变为 superseded |
| 只修改 handoff/review 文字，不改证据选择、scope、status 或裁决 | 否 | 否 | 增加 `review_version` 和内容 digest；保留原 raw/report | raw evidence 继续有效 |
| 修改 raw artifact、report、evidence index 内容本身 | 是 | 是 | 禁止原地编辑；保留 finding，修复 producer 后重跑 | 原 run 立即 `invalidated` |
| 发现 raw body/secret、静态 passed、`latest` 或跨 run provenance | 是 | 是 | 立即阻断并执行 redaction/provenance 修复 | 原 evidence `invalidated`，不得风险接受覆盖 |

“默认新 run”是为了避免实现者在没有影响分析证据时复用旧 evidence。若未来确实证明某类变更只影响审查文本，
只能走表中明确的 review-only 分支，并保留 review version 和 digest。

### 9.4 重跑、attempt 与旧 run 保留规则

```text
baseline B0 + run R0
        |
        | change / failure / unavailable / affected owner closure
        v
baseline B1 + run R1
        |
        +--> R0 remains read-only historical input
        +--> B1 records parent/supersedes/invalidates relation
        +--> only one run is selected as primary for the review version
```

关键规则：

1. 重跑不得覆盖 `artifacts/test/<old_run_id>`、`reports/runs/<old_run_id>` 或旧 acceptance/review 记录。
2. 同一 run 的重复 attempt 必须有独立 attempt identity 和结果关系；不得删除第一次失败或只保留最后一次绿色结果。
3. `blocked`、`not_run`、`not_evaluated`、`conditional` 和 `indeterminate` 必须原样保留；不能通过汇总计数改成 `passed`。
4. 旧 run 被 `superseded` 不等于旧 run 通过；旧 run 被 `invalidated` 也不能从报告中删除。
5. 新 run 必须重新生成 raw/report/evidence index；不能复制旧 report 后仅替换 `<run_id>`。
6. `reports/acceptance/handoff.md` 只能选择一个 primary run 作为当前 review version 的输入；其他 run 作为 lineage / residual / defect evidence。

### 9.5 生成者、消费者与只读边界

| 组件 / 材料 | 可以做什么 | 不可以做什么 |
|---|---|---|
| `run_ci_gate.sh` | 生成同 run raw suite/case/check artifact 和 failure record | 从设计文档或旧 run 补结果；写业务 truth；生成最终验收结论 |
| `generate_reports.sh` | 从同 run raw artifact 生成可读 report 和 candidate provenance | 修改 raw/artifact/source；跨 run 拼接；把 blocked 改成 passed |
| 三个 check script | 读取扫描面并写独立 check report | 修改输入以消除 finding；以未执行表示 clean |
| `reports/acceptance/*` | 汇总送验范围、缺口、VETO/risk 待审输入 | 代替机器证据、静态签署或拥有 final verdict |
| `reports/review/*` | 记录人/Agent 的复核、冲突和回流建议 | 修改 raw/report、创建 evidence alias 或关闭 blocker |
| `06-验收标准.md` | 定义未来通过/有条件通过/不通过裁决规则 | 在设计期填写真实 run、执行结果或签署 |

## 10. 模块停审与跨基线审计

### 10.1 模块停审记录

| 模块 | 输入是否足够 | 关键结论是否可追溯 | 是否伪造执行事实 | 模块结论 |
|---|---|---|---|---|
| design-source-baseline | 是 | `00~05`、标准和 Step 01~02 均有明确入口 | 否 | `pass_design` |
| delivery-and-dependency-baseline | 是 | repo/commit/build/artifact/image/core-contracts/graph 字段已注册 | 否 | `pass_design_with_precondition` |
| environment-config-data-baseline | 是 | 6 lane、3 profile、82 DS、config/binding/cleanup 字段已注册 | 否 | `pass_design_with_precondition` |
| run-and-evidence-roots | 是 | raw/report/acceptance/review roots、required files、TC/DS/EV join 已固定 | 否 | `pass_design` |
| baseline-change-control | 是 | freeze、new run、lineage、superseded/invalidated 和 review-only 分支已固定 | 否 | `pass_design` |

### 10.2 跨来源一致性审计

| 审计项 | current 结果 | 处理 |
|---|---|---|
| runtime profile count | 3：`LocalTest`、`IntegrationLike`、`RuntimeLike` | 以 current `04/05` 为准；旧四 profile 只在 historical 说明中出现 |
| environment lane count | 6：`ENV-LCL-ISO`、`ENV-LCL-INT`、`ENV-CI-ISO`、`ENV-CI-INT`、`ENV-STG-RT`、`ENV-PRD-RT` | lane 不替代 profile；每个真实 invocation 独立记录 |
| primary suite / script count | 9 suites、5 scripts | 不引入旧 suite、独立 provenance suite 或新 generator |
| TC / DS / candidate EV count | 99 TC、82 DS、99 `EV-CAND-OBS-*` planned linkage | 只承接 current `05` exact mapping；不生成真实 EV |
| acceptance scope | 31 current AC、10 `VF-OBS-*` | 旧 6 AC / 旧 VETO 不进入 current truth |
| canonical roots | raw=`artifacts/test/<run_id>`；report=`reports/runs/<run_id>`；acceptance=`reports/acceptance`；review=`reports/review` | 禁止 project-prefixed root 和 `latest` |
| only-core boundary | compile-time 仅 `L0-core/core-contracts` | sibling 只能 runtime/event/ref/handoff；graph snapshot 未来固定 |
| no-write / truth boundary | observation/audit projection only；不反写 source truth | 后续 Step 06~11 继续把它转为验收门禁 |
| real execution | target repo、CI、RuntimeLike、run/artifact/report/evidence 均未建立 | 保持 `not_established` / `not_run`；不形成 pass |

### 10.3 新 blocker 与 inherited affected

本 Step 未发现新的上游 blocker。以下 inherited affected 继续开放，不能由基线字段、模板或 candidate linkage 关闭：

| ID | 当前状态 | 对 Step 03 的处理 |
|---|---|---|
| `S08-E-I05-PAYLOAD-SCHEMA-01` | `open_upstream_internal` | 只记录为 affected constraint；不创建 I05 canonical payload |
| `S08-E-I05-PRODUCER-EVENT-BINDING-01` | `open_upstream_internal` | 不从事件名称或字段并集推断 binding |
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | J06 positive 不进入 current frozen evidence |
| `R06-F-AFFECT-UOW-01` | downstream open | accepted UoW 顺序由后续 Step 08/12/13 继续消费 |
| `S08-RECOVERY-CLASS-OWNER-01` | open affected | 不在基线中发明 recovery enum 或 owner |
| `R07-EXTERNAL-PHASE-LINK-01` | open affected | 不把 external phase 当作已执行 evidence |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | open affected | attempt/probe/finalize 仅记录为 future field |
| `S08-CONSUMER-OUTBOX-SURFACE-01` | open affected | 不凭空冻结 consumer outbox surface |
| `S08-CONSUMER-INDETERMINATE-COMPLETION-01` | open affected | indeterminate 保持不可汇总为 passed |
| `S08-JOB-REPORT-REF-OWNER-01` | open affected | report ref 只作 linkage metadata，不复制 owner |
| `S08-M1-SECONDARY-TYPE-OWNER-01` | open affected | 不新增 secondary type definition |
| `03-RPR-S09-PER-FLOW` | open affected | 99 row 只作为 test-plan join contract，不声称 implementation proof |

## 11. 正式 `06` §3 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_03_baseline.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“基线字段注册表”“run-level baseline 与证据根”“基线变更处理矩阵”和“模块停审与跨基线审计”小节，了解本章如何固定设计、交付、环境、数据和证据。

正式 `06-验收标准.md` §3 只承载以下收口结论：

### 3.1 必须固定的设计、交付、依赖、环境和数据基线

| 基线 | 送验时必须提供 | 当前设计状态 |
|---|---|---|
| 需求与设计 | current `00~05` 的 immutable source refs 和 content digests | `not_established`；设计内容已定义 |
| 交付物 | implementation repository ref、immutable commit、build id/manifest、delivery artifact digest；image 交付另需 image digest | `not_established` |
| 依赖 | `L0-core/core-contracts` source/package ref、content digest 和 dependency graph digest；运行期/event/handoff 依赖另列 snapshot | `not_established` |
| 环境 | exact lane、`LocalTest`/`IntegrationLike`/`RuntimeLike`、合法 mode、config snapshot、binding/capability snapshot、toolchain 和 cleanup policy | `planned` / `not_established` |
| 数据 | exact `DS-OBS-*` manifest、fixture/seed/snapshot/replay ref、namespace、sensitivity、content digest 和 cleanup state | `not_established` |
| 执行 | 非 `latest` 的真实 `<run_id>`、invocation/attempt 和 baseline manifest digest | `not_established` |

缺少任一 required design/delivery/dependency/environment/data/run 字段，或字段无法由 digest/path 复查时，
不得进入正式验收裁决，不能填写“通过”或“有条件通过”。

### 3.2 Canonical evidence roots

原始机器证据固定在 `artifacts/test/<run_id>/`，人类可读报告固定在 `reports/runs/<run_id>/`；
`evidence-index.json` 必须由同一 raw root 推导，`evidence-index.md` 是其同 run 可读投影。验收交接固定在
`reports/acceptance/`，包括 `handoff.md`、`veto-checklist.md`、`risk-acceptance.md` 和 `open-issues.md`；
审查补充固定在 `reports/review/`。禁止 `latest`、`reports/<project>`、`artifacts/test/<project>/<run_id>`、
跨 run 拼接、无 digest artifact/report 和静态 passed/evidence。

每个 P0 evidence linkage 必须能逆向回指 exact `TC-OBS-*`、`DS-OBS-*`、primary suite、lane/profile、
`<run_id>`、raw artifact path/digest、report path/digest、AC/VF refs 和 failure/blocked status。candidate
`EV-CAND-OBS-*` 只在真实 raw relation 产生后成为 candidate linkage，不是正式 evidence alias、验收结论或签署。

### 3.3 基线变更和重跑

冻结后，任何影响 `00~05`、实现交付、core-contracts、依赖图、profile/config/binding、dataset、suite/script、
artifact/report schema、evidence join 或验收范围的变化，都必须建立新 baseline 和新 `<run_id>`，重新执行受影响
或要求的 P0 coverage，并记录 parent/supersedes/invalidates lineage。旧 raw/report/evidence 只读保留，不能原地
覆盖或删除；不一致、静态造证据、`latest`、forbidden material 或跨 run provenance 会使旧 baseline invalidated。

只修改 acceptance/review 说明且不改变 selected run、证据选择、范围、状态或裁决时，可以保留同一 run，但必须
递增 review version、记录内容 digest 和变更说明。任何真实 run、artifact、report、evidence alias、最终 verdict
和 signoff 均由未来实际执行与验收阶段提供，当前文档不填写。

## 12. 待确认事项与送验前置缺口

这些事项不阻断本 Step 的设计校准，但会阻断未来正式验收基线冻结：

| ID | 事项 | 当前状态 | 缺失影响 | 责任方向 |
|---|---|---|---|---|
| `Q-06-03-01` | target implementation repository、immutable commit、build id、delivery artifact/image | `not_established` | 无法绑定被测交付物 | implementation owner |
| `Q-06-03-02` | `00~05` 与标准 source refs/content digests | `not_established` | 无法证明验收依据不漂移 | design owner |
| `Q-06-03-03` | `L0-core/core-contracts` ref/digest 与 dependency graph snapshot | `not_established` | only-core contract/dependency gate 无法裁决 | core/architecture owner |
| `Q-06-03-04` | selected lane/profile、validated config digest、binding/capability 和 toolchain snapshot | `not_established` | 环境真实性和配置 redline 无法裁决 | config/runtime owner |
| `Q-06-03-05` | exact 82-DS manifest、fixture/replay root、namespace 和 cleanup result | `not_established` | P0 case provenance 和可复现性不完整 | test/data owner |
| `Q-06-03-06` | primary `<run_id>`、raw artifact、run report、evidence index 和 acceptance handoff | `not_established` | 不得进入正式验收 | test/release/acceptance owner |
| `Q-06-03-07` | acceptance 是否使用 image 交付形态 | `undecided` | 决定 `image_digest` 是否 required | delivery owner |

## 13. Step 自检与停审门禁

### 13.1 Step 内计划完成情况

| 计划项 | 结论 |
|---|---|
| 读取标准、台账和 current 上游 | `done` |
| SOP 十个问题回答 | `done`；§3.1~§3.10 均有明确回答 |
| 历史材料与冲突诊断 | `done`；旧 profile、AC/VETO、path、evidence 口径未继承 |
| 设计取舍 | `done`；§6 记录采用与放弃方案 |
| 字段、路径、provenance 结构化产物 | `done`；§7~§8 |
| 冻结、变更、重跑与失效规则 | `done`；§9 |
| 模块停审与跨来源审计 | `done`；§10 |
| 正式 §3 回填草稿 | `done`；§11；正式 `06` 未修改 |
| 真实性、路径和 blocker 自检 | `done`；§13 |

### 13.2 真实性与一致性检查

| 检查项 | 当前结论 |
|---|---|
| 是否填写真实 implementation commit/build/image | 否；全部保持 `not_established` 或条件待定 |
| 是否填写真实 `<run_id>` | 否；只定义字段和 canonical path |
| 是否生成 artifact/report/evidence alias | 否；目录与文件均为 planned contract |
| 是否填写 passed / final verdict / signoff | 否；`passed` 只作为未来允许的执行状态，当前无执行结论 |
| 是否使用 `latest` 或 project-prefixed canonical path | 否；仅在禁止清单中作为 historical/negative example |
| 是否混用 JobRunId、JobExecutionRef、trace id、fixture namespace 与 acceptance run | 否；身份边界已明确 |
| 是否把 Observability 写成业务 truth owner | 否；只承载 observation/audit projection、evidence linkage、marker 和 handoff input |
| 是否新增 protocol/state/type owner | 否；基线字段是测试/验收 metadata，不改变 `03` 的 60 protocol / 27+1 state 计数 |
| 是否关闭 inherited affected | 否；12 项逐项保留在 §10.3 |
| 是否发现新的上游 blocker | `none` |

### 13.3 Step 门禁结论

| 门禁 | 结论 |
|---|---|
| 基线类型完整：需求、设计、测试、交付、依赖、环境、配置、数据 | `pass` |
| 送验字段有明确 owner、状态和缺失影响 | `pass` |
| artifact/report/acceptance/review canonical roots 固定 | `pass` |
| raw -> report -> evidence -> acceptance provenance 可逆 | `pass` |
| `latest`、project-prefixed path、静态 evidence、P1 替代 P0 已禁止 | `pass` |
| 基线变更、重跑、旧 evidence superseded/invalidated 规则可判定 | `pass` |
| 当前 target reality / run / evidence 真实性未被夸大 | `pass` |
| 新 blocker | `none` |
| inherited affected | `open`；不阻断本 Step 设计完成，但阻断对应未来 positive acceptance |
| `gate_status` | `pass` |
| `next_allowed_action` | `wait_user_confirmation_before_step_04` |
| formal `06-验收标准.md` 是否修改 | `no`；Step 15 前禁止 |
| 当前是否需要提交 | `no`；用户未要求提交 |

Step 03 现已达到 current 设计门禁；在用户确认前不得读取或重建 Step 04，不得修改正式 `06`。

## 14. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 03
- `standards/document/验收标准书写规范.md` §4.4、§5.3、§5.10
- `standards/document/设计文档编写通则.md`
- `standards/document/设计文档讨论中间产物规范.md` §3.4.3~§3.5.2
- `standards/document/设计真相源闭环与可落码性标准.md`
- `standards/document/全局项目依赖关系与裁剪规则.md`
- `projects/L4-observability/design-calibration/project_execution_ledger.md`
- `projects/L4-observability/design-calibration/06_acceptance_calibration_flow.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_01_input_boundary.md`
- `projects/L4-observability/design-calibration/06_acceptance_step_02_scope.md`
- `projects/L4-observability/00-需求文档.md`
- `projects/L4-observability/01-架构设计.md`
- `projects/L4-observability/02-概要设计.md`
- `projects/L4-observability/03-详细设计.md`
- `projects/L4-observability/04-配置设计.md`
- `projects/L4-observability/05-测试方案.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_08_environment_config.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_09_automation_gates.md`
- `projects/L4-observability/design-calibration/05_test_plan_step_13_evidence.md`
- `projects/L1-governance/design-calibration/06_acceptance_step_03_baseline.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_03_baseline.md`
