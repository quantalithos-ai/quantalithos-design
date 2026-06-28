# Step 8. 设计测试环境与配置矩阵

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 8
> 回填章节: `05-测试方案.md` §8 测试环境与配置矩阵
> 创建日期: 2026-06-27
> 当前模式: full-restart / step8-environment-config
> 当前状态: completed_wait_user_confirm_to_R9.1
> 当前模块: `R8.10 topology / unavailable / audit:再写入`
> 当前门禁: `R8.10` completed_wait_user_confirm_to_R9.1;等待确认进入 Step 9 `R9.1 automation / gates:先思考`

---

## 0. Step 7 handoff

Step 7 已确认当前 `05-测试方案.md` 的测试数据设计:

- 已为 Step 6 的 83 条唯一 `TC-ML-*` 候选用例映射可重复数据前置。
- 已形成 81 个唯一 `DS-ML-*` 测试数据集定义,覆盖基础、边界、异常、并发、恢复、配置、依赖、redaction 和 observability 数据。
- 已固定 fixture / builder / seed / fake / corpus / fault profile 的构造边界、隔离键和清理方式。
- 已明确 `DS-ML-RUN-001` 只作为 run namespace、fixed clock、scoped id、actor / operation context 壳,不承载业务事实。
- 已把环境、依赖服务、执行位置、CI suite、evidence schema、验收标准和实施边界后移。
- 缺正式 schema、port、state、mapper、marker source、config key、evidence schema 或 phase boundary 时,Step 8 也不得用环境、profile、path dependency、fake adapter 或旧材料补口。

Step 8 的任务是把 Step 6/7 的用例和数据前置放到可定位的测试环境、依赖类型、协作方式和配置 profile 中。它只能定义测试在哪些环境和 profile 下执行、依赖如何替身化或回放、配置如何影响测试结果、环境不可用如何裁决。它不得提前写 Step 9 的 CI suite / 脚本 / gate,也不得写 Step 13 的 evidence artifact schema。

---

## R8.1 测试环境与配置矩阵:先思考

### 1. 当前模块目标

`R8.1` 只思考 Step 8 的输入边界、必读文档、SOP 七问、L1-governance Step 8 框架参考、L3-method-library 的环境族、依赖类型、测试协作方式、配置 profile / 数据策略承接、环境拓扑边界和 `R8.2` 写入边界。

当前模块不写最终环境矩阵、配置矩阵、依赖判定表、环境拓扑图、CI suite、执行脚本、artifact path、report path、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.2 |
| 用户确认 | 已确认从 Step 7 completed 推进到 Step 8 `R8.1`。 |
| 当前允许 | 思考测试环境与配置矩阵的输入边界、环境族、依赖类型、协作方式、配置 profile、数据策略承接、不可用处理、拓扑边界和 R8.2 写入计划。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写最终环境矩阵、配置矩阵、依赖判定表、拓扑图、CI suite、命令、artifact / report 输出、evidence schema、验收标准、实施计划或 implementation code。 |

### 2. Step 8 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承 / 禁止提前 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点为 Step 8 `R8.1`;每次确认只推进一个当前模块。 | 跳过 R8.1 直接写完整环境矩阵。 |
| `05_test_plan_calibration_flow.md` | Step 1~7 completed;Step 8 waiting_user_confirm_to_R8.1;Step 9+ blocked。 | 写 CI gate、suite、artifact path 或正式 `05`。 |
| `05_test_plan_step_06_cases.md` | 83 条候选用例、自动化候选、环境 / 数据 / evidence 后移。 | 新增 TC 或改变断言。 |
| `05_test_plan_step_07_test_data.md` | 81 个 DS、83 条 TC 映射、fake / seed / fixture / corpus / fault profile、隔离清理。 | 新增数据集或改变 DS 语义。 |
| `测试方案讨论流程_SOP.md` Step 8 | 输出环境矩阵、配置矩阵、环境拓扑、依赖类型与协作方式判定表。 | 只写“测试环境准备好”。 |
| `测试方案书写规范.md` §5.8 | 必须区分 local / CI / staging 等环境、依赖类型、协作方式、关键配置和风险。 | 把运行期 / 事件依赖写成 path dependency。 |
| `全局项目依赖关系与裁剪规则.md` | 编译期、运行期、事件协作依赖的固定定义。 | 把本地存在的 sibling repo 直接写进 Cargo dependency。 |
| `00-需求文档.md` | `L0-core` 编译期;`L0-bus` 事件协作;process / identity / runtime / member-images 运行期消费;governance / artifact / marketplace / console 等为条件型或外围。 | 让外围或候选关系成为 P0 环境前置。 |
| `01-架构设计.md` | 依赖裁剪、系统上下文、Definition vs Use、数据所有权和禁止依赖表。 | 通过环境把下游运行状态变成本仓 truth。 |
| `03-详细设计.md` | 仅 `core-contracts` 为 compile dependency candidate;其他 sibling repos 通过 port / adapter / event / fake / handoff 协作。 | 在环境中新增 compile dependency、port、adapter、marker 或 schema。 |
| `04-配置设计.md` | `local-dev` / `ci-test` / `integration-like` / `operations-replay` 为 P0 candidate;`staging-like` / `production-like` 为 P1/P2 direction;配置来源、profile、adapter binding、redaction 和 failure strategy。 | 新增 config key、env key、profile enum、secret provider、product binding 或 hot reload。 |
| L1-governance Step 8 | 参考环境矩阵、依赖判定、profile 配置矩阵、不可用处理和停审结构。 | 复制 governance 的 DS、TC、依赖对象或领域事实。 |

### 3. SOP Step 8 七问思考边界

| SOP 问题 | R8.1 思考边界 | 后续落点 |
|---|---|---|
| local / CI / integration / staging 分别测什么? | 初判 L3 P0 环境采用 `local-dev`、`ci-test`、`integration-like`、`operations-replay`;`staging-like` / `production-like` 只作 P1/P2。 | R8.2 写环境矩阵。 |
| 每个环境依赖哪些服务? | 先识别 in-memory/fake store、fake / controlled resolver、publisher、handoff、event replay、redaction checker、dependency checker、fixed clock/id。 | R8.2 写依赖服务列和风险。 |
| 哪些 feature flag / config 影响测试结果? | 先按 runtime profile、adapter mode、strict validation、store binding、resolver/publisher/handoff target、jobs/replay、redaction、clock/id 分类。 | R8.2 写配置矩阵。 |
| 哪些依赖需要 mock 或 fake? | P0 默认 fake / controlled / disabled / replay;真实 DB、bus、secret provider、external product 不作为 P0 必备。 | R8.2 写协作方式。 |
| 环境不可用时如何处理? | P0 local/CI 装配失败应 fail-fast;controlled seam 仅在预期用例中返回 degraded / failed marker;P1/P2 unavailable 不计 P0 pass。 | R8.2 写不可用处理。 |
| 哪些依赖是编译期依赖,可用 path dependency? | 只有 `L0-core` / `core-contracts` 可进入 compile dependency 候选。 | R8.2 写依赖类型判定表。 |
| 哪些依赖是运行期依赖或事件协作依赖? | `L0-bus` 是 event;process / identity / runtime / member-images 是 runtime consumption;governance / artifact / marketplace / observability 等为候选 runtime / event / peripheral。 | R8.2 写 fake / controlled / event replay / disabled 策略。 |

### 4. L1-governance Step 8 框架参考思考

L1-governance Step 8 的价值在于“把 Step 7 数据集绑定到环境、依赖类型和配置 profile,并明确 P0 环境不可用时不能伪造通过”。L3 采用框架,不复制 governance 领域事实。

| L1-governance 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| 先声明 Step 状态、输入基线和非范围 | L3 R8.1 先固定 Step 7 handoff、必读输入和禁止范围。 | 直接写正式 `05` §8。 |
| 环境矩阵稳定列 | L3 后续保留环境、用途、依赖服务、依赖类型、协作方式、关键配置、数据策略、风险。 | 用“环境准备好”替代表格。 |
| 依赖类型判定表 | L3 明确 compile/runtime/event/replay,防止 sibling path dependency 越界。 | 把 process / identity / runtime / member-images 写成 Cargo path dependency。 |
| profile 配置矩阵 | L3 依据 `04` 的 profile 和 config domain 转译。 | 新增 key、env、secret provider 或 profile enum。 |
| 环境不可用处理 | L3 明确 P0 fail-fast、预期 degraded/failed 和 P1/P2 residual。 | 跳过 unavailable 后仍计 P0 pass。 |
| 拓扑图 | L3 若写拓扑,连线必须标注 `[compile]`、`[runtime]`、`[event]` 或 `[replay]`。 | 用拓扑图暗示源码依赖或真实产品前置。 |

### 5. L3 环境族思考

| 环境族 | P0 / P1 定位 | 主要用途 | R8.1 初判 |
|---|---|---|---|
| `local-dev` | P0 support / non-release evidence | 本地装配、手动 sanity、fake adapter wiring、最小 runtime builder 检查。 | 可进入环境矩阵,但不作为正式 release evidence。 |
| `ci-test` | P0 required candidate | deterministic contract/domain/service/fake integration、redaction / dependency guard 候选。 | P0 自动化主环境;具体 suite 留 Step 9。 |
| `integration-like` | P0 controlled seam | controlled resolver / publisher / handoff seam、adapter unavailable / degraded / failed mapping。 | 证明接缝语义,不证明真实产品 SLA。 |
| `operations-replay` | P0 replay / job semantics | job-run-start freeze、event candidate / handoff / report / stored replay / recovery 数据回放。 | 承接 Step 7 job/replay/recovery 数据,不修 core truth。 |
| `staging-like` | P1/P2 direction | future durable / real-like adapter selected-run 或 release-candidate direction。 | 不作为当前 P0 pass 前置。 |
| `production-like` | P1/P2 future ops | future approved product / secret provider / operations profile direction。 | 当前只记录风险,不写 runbook 或产品。 |

### 6. 依赖类型与协作方式思考

| 依赖对象 | 正式依赖类型 | Step 8 P0 协作方式初判 | 禁止 |
|---|---|---|---|
| `L0-core` / `core-contracts` | 编译期依赖候选 | path dependency / package dependency 候选,实施前复核 crate path。 | 让其他 sibling repo 进入 Cargo。 |
| `L0-bus` | 事件协作依赖 | fake publisher、event fixture、event replay、topic map completeness candidate。 | 作为 Cargo dependency 或用 broker ack 证明 truth。 |
| `L1-process` | 运行期消费方 | process-facing safe refs / consumption boundary fixture / fake read surface。 | 读取 process execution state 证明 definition truth。 |
| `L1-identity` | 运行期消费方 | role / identity safe summary、actor metadata、fake adapter。 | 迁入成员实际状态或身份生命周期。 |
| `L2-runtime` | 运行期消费方 | runtime use context fixture、controlled adapter / unavailable branch。 | 用 runtime execution 改写方法资产定义。 |
| `L2-member-images` | 运行期消费方 | role-to-image safe ref / downstream boundary fixture。 | 把 image build 状态写成本仓 truth。 |
| `L1-governance` | 条件型 runtime / event 候选 | basis summary / governance result ref fake 或 disabled by scenario。 | 把 governance execution / Gate 过程作为 P0 环境前置。 |
| `L1-artifact` / archive | runtime candidate | artifact/archive ref fixture、body-free boundary。 | 保存 artifact / archive / evidence body。 |
| `L6-marketplace` | peripheral runtime / event candidate | distribution context / marketplace ref fixture。 | marketplace 交易、安装、订单、履约进入 P0。 |
| observability / diagnostics | runtime handoff / local tool | redaction checker、safe diagnostic capture、metric label candidate。 | 观测后端作为 truth / recovery proof。 |

### 7. 配置 profile 与数据策略承接思考

| 配置域 | Step 8 需要表达 | 禁止补口 |
|---|---|---|
| runtime profile | `local-dev`、`ci-test`、`integration-like`、`operations-replay`、`staging-like`、`production-like` 的用途和风险。 | 新增 runtime enum 或 profile key。 |
| adapter mode | fake / in-memory / controlled / disabled / future durable-like 的环境适配。 | 写死 durable product、broker、secret provider 或 endpoint。 |
| strict validation | invalid config、duplicate key、forbidden boundary override 的环境裁决。 | 把非法配置降级为成功启动。 |
| store / repository binding | P0 使用 isolated fake / in-memory;future durable 只作 P1/P2 selected-run。 | 用真实 DB 作为 P0 必过。 |
| resolver / publisher / handoff | fake / controlled / unavailable / failed marker source。 | 从 raw adapter error、HTTP code、topic 或 receipt body 合成 marker。 |
| jobs / replay | operations-replay 需要 de-identified replay root、job run key、report/checkpoint refs。 | 写 Step 9 命令或 Step 13 artifact schema。 |
| redaction / diagnostic | safe diagnostic、dummy leak corpus、low-cardinality metric / trace capture。 | raw secret、endpoint、provider response、report body 输出。 |
| fixed clock / id | `DS-ML-RUN-001` 承接 deterministic run context。 | 用当前时间或随机值使测试不可复现。 |

### 8. 环境拓扑边界思考

若 R8.2 需要写拓扑图,只允许表达依赖类型和测试协作方式。图中所有跨仓连线必须标注依赖类型:

| 连线类型 | 表达含义 | 禁止含义 |
|---|---|---|
| `[compile]` | 仅 `L0-core` / `core-contracts` 提供 shared contract / typed ref 基线。 | 任意 sibling repo 源码依赖。 |
| `[runtime]` | process / identity / runtime / member-images 等通过 safe refs、API/SDK/adapter/fake 协作。 | 下游运行状态成为本仓 truth。 |
| `[event]` | `L0-bus` 或事件候选通过 fake event / controlled publisher / event replay 协作。 | broker ack 或 topic 成为 truth proof。 |
| `[replay]` | operations-replay 使用去标识 replay root / stored surface / report refs。 | raw body、secret、provider response 或 evidence body 回放。 |

### 9. source gap 与停审风险

| 风险 | 判断 | 处理 |
|---|---|---|
| config key / env key / CLI selector 未闭合 | Step 8 不能发明正式 key、命令参数或文件路径。 | R8.2 只写配置域 / profile / feature family;具体 key 若缺回 `04` 或后续 Step 9。 |
| suite / script / CI trigger 未闭合 | Step 8 只定义环境和 profile,不定义执行脚本。 | 留 Step 9。 |
| artifact root / evidence schema 未闭合 | Step 8 不定义 artifact path、report path 或 JSON schema。 | 留 Step 13。 |
| durable product / broker / secret provider 未定 | P0 不要求真实产品。 | 标为 P1/P2 direction 或 residual。 |
| marker source 未闭合 | 环境不可用不能生成 synthetic marker。 | 缺 source 时停审或回 owning `03/04`。 |
| sibling path dependency 越界 | 除 `L0-core` 外均不得 path dependency。 | R8.2 依赖判定表必须显式禁止。 |

### 10. R8.2 写入边界

R8.2 可以写入:

1. Step 8 开工基线、输入列表和禁止范围。
2. 环境矩阵列定义和 L3 环境族总体框架。
3. 依赖类型与测试协作方式判定表的结构和 L3 依赖分类。
4. profile / config domain / 数据策略承接规则。
5. 环境不可用处理原则。
6. 必要时写环境拓扑图的表达规则和后续 R8.x 分批计划。

R8.2 禁止写入:

1. 完整最终环境矩阵、完整配置矩阵、最终拓扑图和全部依赖判定行。
2. CI suite、执行脚本、触发条件、required check、artifact 输出、report 输出。
3. evidence ID、artifact path、JSON schema、报告 schema、验收 gate、release verdict。
4. 新增 config key、env key、CLI selector、secret provider、adapter product、topic、port、mapper、marker source 或 phase boundary。
5. 修改正式 `05-测试方案.md` 或 implementation code。

### 11. R8.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 Step 8 环境与配置矩阵边界 | pass |
| 是否承接 Step 7 的 81 个 DS 和 83 条 TC 映射 | pass |
| 是否参考 L1-governance 框架但不复制领域事实 | pass |
| 是否识别 L3 P0 / P1 环境族、依赖类型、协作方式和 profile 边界 | pass |
| 是否明确只有 `L0-core` / `core-contracts` 可作为编译期依赖候选 | pass |
| 是否未写最终环境矩阵、配置矩阵、拓扑图、CI suite 或 evidence schema | pass |
| 是否未新增 config key、secret provider、adapter product、marker source 或 phase boundary | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 已收到用户确认,进入 Step 8 `R8.2 测试环境与配置矩阵:再写入`。

---

## R8.2 测试环境与配置矩阵:再写入

### 1. 当前模块写入目标

`R8.2` 将 `R8.1` 的思考结果写成 Step 8 的执行骨架。它只固定后续环境与配置矩阵的栏目、分批模块、依赖类型判定结构、profile / config domain / 数据策略承接规则、环境不可用原则和拓扑表达规则。

当前模块不填完整最终矩阵,不定义 CI suite / 脚本 / required check,不定义 artifact / report 路径,不定义 evidence schema,不写验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.3 |
| 用户确认 | 已确认从 `R8.1` 推进到 `R8.2`。 |
| 当前允许 | 写 Step 8 开工基线、输入列表、禁止范围、矩阵列定义、L3 环境族框架、依赖类型与协作方式结构、profile / config / data 承接规则、不可用原则、拓扑表达规则和后续 R8.x 分批计划。 |
| 当前禁止 | 修改正式 `05-测试方案.md`;写完整最终环境矩阵、完整配置矩阵、最终拓扑图、CI suite、脚本、evidence schema、验收 gate、phase / commit boundary 或 implementation code。 |

### 2. Step 8 开工基线

| 基线项 | 当前裁决 | Step 8 使用方式 |
|---|---|---|
| 上游正式文档 | `00/01/02/03/04` 已按 full-restart 完成,作为 Step 8 权威输入。 | 只承接正式结论,不从旧 `05/06/07` 反推环境或配置。 |
| 当前测试数据 | Step 7 已形成 81 个唯一 `DS-ML-*` 数据集和 83 条 `TC-ML-*` 映射。 | 后续环境矩阵只分配数据使用位置,不新增或改写 DS / TC。 |
| 当前 profile 来源 | `04-配置设计.md` 已定义 `local-dev`、`ci-test`、`integration-like`、`operations-replay`、`staging-like`、`production-like`。 | Step 8 只把 profile 转成测试环境和风险,不新增 profile enum / key。 |
| 当前依赖裁剪 | 只有 `L0-core` / `core-contracts` 是 compile dependency candidate。 | 环境矩阵必须防止其他 sibling repo 变成 path dependency。 |
| 当前 P0 产品选择 | P0 采用 fake / in-memory / controlled / disabled / replay。 | 真实 DB、bus、secret provider、external product 不作为 P0 必过前置。 |
| 当前证据边界 | evidence ID、artifact path、report path 和 JSON schema 未进入 Step 8。 | 后移 Step 13;Step 8 不发明证据 schema。 |

### 3. Step 8 必读输入清单

| 输入 | 读取目的 | 不得派生 |
|---|---|---|
| `05_test_plan_step_06_cases.md` | 确认用例族、P0 / P1、自动化候选和环境后移点。 | 不新增 TC、不改断言。 |
| `05_test_plan_step_07_test_data.md` | 确认数据集、fixture、fake、fault profile、run namespace 和清理方式。 | 不新增 DS、不改数据语义。 |
| `04-配置设计.md` §6 / §9 / §11 / §12 | 承接 profile、配置域、加载校验、失效策略和下游承接。 | 不新增 config key、env key、secret provider 或 product binding。 |
| `03-详细设计.md` §3 / §13 / §14 / §16 | 承接依赖边界、config redline、adapter availability、observability 和 test cut。 | 不新增 port、mapper、marker、state 或 evidence schema。 |
| `01-架构设计.md` §8 | 承接 compile / runtime / event 依赖裁剪。 | 不把运行期消费关系写成源码依赖。 |
| L1-governance Step 8 | 参考表格密度、停审结构和拓扑表达。 | 不复制 governance 领域事实、DS、TC、环境依赖行。 |

### 4. 环境矩阵列定义

后续环境矩阵必须使用稳定列。每一行必须能回答“在哪测、测什么、依赖什么、如何替身、用哪些配置族、用哪些数据、剩余风险是什么”。

| 列 | 含义 | 写法约束 |
|---|---|---|
| 环境 | 使用 `local-dev`、`ci-test`、`integration-like`、`operations-replay`、`staging-like`、`production-like`。 | 不新增环境名;若需新环境,回 `04` 或后续运维文档。 |
| 用途 | 描述该环境验证的测试目标。 | 不写 CI job 名或 shell 命令。 |
| 依赖服务 | 列出 store、resolver、publisher、handoff、redaction、clock/id、replay 等依赖族。 | 不写真实产品名、endpoint、secret 或部署资源。 |
| 全局依赖类型 | 标注 compile / runtime / event / replay / local tool / not applicable。 | 只有 compile 允许 path dependency。 |
| 测试协作方式 | 使用 path dependency / fake / controlled / disabled / event replay / fixture / future selected-run。 | 不用真实 broker ack、HTTP status 或 provider body 证明 truth。 |
| 关键配置 / feature family | 写 runtime profile、adapter mode、store binding、resolver / publisher / handoff、jobs、redaction、clock/id、replay root 等配置域。 | 只写配置域,不发明 key、env、CLI selector。 |
| 数据策略 | 写 DS family、run namespace、fixture / replay / fault profile 和清理隔离方式。 | 不新增数据集、不使用生产数据或 raw body。 |
| 风险 | 写 P0 / P1 边界、不可用处理和残余风险。 | 不把 P1/P2 unavailable 算作 P0 pass。 |

### 5. L3 环境族总体框架

| 环境族 | 当前级别 | 后续 R8.x 任务 |
|---|---|---|
| `local-dev` | P0 support / manual sanity | R8.3/R8.4 判断本地装配、fake wiring、最小 runtime builder 检查如何定位。 |
| `ci-test` | P0 required candidate | R8.3/R8.4 判断 deterministic contract / domain / service / fake integration 如何定位。 |
| `integration-like` | P0 controlled seam | R8.3/R8.4 判断 adapter unavailable / degraded / failed mapping 和 controlled seam 如何定位。 |
| `operations-replay` | P0 replay / job semantics | R8.3/R8.4 判断 job-run-start freeze、replay root、report/checkpoint refs 如何定位。 |
| `staging-like` | P1/P2 selected-run direction | R8.3/R8.4 只记录 future / residual,不进入当前 P0 pass 前置。 |
| `production-like` | P1/P2 future operations | R8.3/R8.4 只记录真实运维方向,不写 production runbook 或真实产品。 |

### 6. 依赖类型与测试协作方式结构

| 依赖类型 | 可出现对象 | P0 协作方式 | 禁止表达 |
|---|---|---|---|
| compile | `L0-core` / `core-contracts`。 | path dependency / package dependency candidate,实施前复核 crate path。 | 任意其他 sibling repo path dependency。 |
| runtime | process、identity、runtime、member-images、governance、artifact、marketplace 等消费或候选消费边界。 | fake adapter、safe ref fixture、controlled resolver、disabled by scenario。 | 下游运行状态成为本仓 truth。 |
| event | `L0-bus` 和事件协作候选。 | fake publisher、event fixture、event replay、topic completeness candidate。 | broker ack、topic 或 raw payload 证明 truth。 |
| replay | operations job、stored report、handoff、outbox、reference / projection replay 相关材料。 | de-identified replay root、stored surface fixture、checkpoint/report refs。 | raw body、secret、provider response 或 evidence body 回放。 |
| local tool | redaction checker、dependency graph guard、manifest scan。 | 本地 / CI safe tool candidate,具体脚本留 Step 9。 | 工具输出替代正式 marker / evidence schema。 |

### 7. Profile / config domain / 数据策略承接规则

| 承接域 | Step 8 写法 | 后续分批落点 |
|---|---|---|
| runtime profile | 以 `04` 已定义 profile 为环境行主键。 | R8.3/R8.4。 |
| adapter mode | 只写 fake / controlled / disabled / replay / future real-like 这类 mode family。 | R8.7/R8.8。 |
| store / repository binding | P0 写 isolated fake / in-memory / temp / replay fixture;future durable 只写 P1/P2 direction。 | R8.7/R8.8。 |
| resolver / publisher / handoff | 写 fake、controlled、unavailable、failed marker source 的环境位置。 | R8.5/R8.6 和 R8.7/R8.8。 |
| jobs / replay | 写 operations-replay 需要 run-scoped replay input、checkpoint、report root 语义。 | R8.7/R8.8 和 R8.9/R8.10。 |
| redaction / diagnostics | 写 safe diagnostic、dummy leak corpus、low-cardinality check 的环境位置。 | R8.7/R8.8。 |
| data strategy | 只把 Step 7 DS family 分配到环境和 profile。 | R8.3/R8.4。 |

### 8. 环境不可用处理原则

| 场景 | Step 8 处理原则 | 是否允许通过 |
|---|---|---|
| P0 profile 无法装配 | fail-fast / test fail-fast。 | 否。 |
| P0 fake / in-memory / controlled seam 缺失 | 视为测试环境或设计闭口失败。 | 否。 |
| 预期 unavailable / degraded / failed 分支 | 必须复制正式来源 marker / safe issue / report ref。 | 仅对应负向场景可通过。 |
| 缺 marker / mapper / port / schema source | 停审并回 owning `03/04/05` Step。 | 否。 |
| `staging-like` / `production-like` 不可用 | 记录 P1/P2 residual 或 selected-run unavailable。 | 不计 P0 pass。 |
| 真实 DB/bus/secret provider 未选择 | 不阻塞 P0;作为 P1/P2 风险或 future trigger。 | 不影响 P0。 |

### 9. 环境拓扑表达规则

如果后续 R8.x 输出拓扑图,只能表达测试协作和依赖类型,不能表达部署拓扑或源码拥有关系。

| 图中标注 | 必须表达 | 禁止暗示 |
|---|---|---|
| `[compile]` | `L0-core` / `core-contracts` shared contract / typed ref 基线。 | 下游仓源码依赖本仓业务实现。 |
| `[runtime]` | safe refs、API/SDK/adapter/fake、controlled resolver / handoff。 | 下游运行状态改写本仓 truth。 |
| `[event]` | fake publisher、event fixture、event replay、topic map completeness。 | broker ack、topic 或 payload 成为 truth proof。 |
| `[replay]` | de-identified replay root、stored surface、checkpoint/report refs。 | raw body、secret、provider response 或 evidence body。 |
| `[local-tool]` | redaction / dependency guard 这类本地检查入口。 | 工具输出替代 formal evidence schema。 |

### 10. 后续 R8.x 分批计划

| 模块 | 主题 | 写入边界 |
|---|---|---|
| `R8.3` | P0 环境矩阵:先思考 | 思考 `local-dev` / `ci-test` / `integration-like` / `operations-replay` 的用途、依赖族、数据策略和风险。 |
| `R8.4` | P0 环境矩阵:再写入 | 写 P0 环境矩阵,仍不写 CI suite / script / evidence schema。 |
| `R8.5` | 依赖类型 / 协作方式表:先思考 | 思考 compile / runtime / event / replay / local tool 依赖判定。 |
| `R8.6` | 依赖类型 / 协作方式表:再写入 | 写依赖类型与协作方式判定表。 |
| `R8.7` | profile / config matrix / data strategy:先思考 | 思考 profile、config domain、DS family 分配和 fail-fast / degraded 策略。 |
| `R8.8` | profile / config matrix / data strategy:再写入 | 写 profile 配置矩阵和环境到数据策略矩阵。 |
| `R8.9` | topology / unavailable / audit:先思考 | 思考拓扑图、不可用处理、跨环境审计和 Step 8 closure。 |
| `R8.10` | topology / unavailable / audit:再写入 | 写拓扑表达、不可用处理表、跨环境审计和 Step 8 停审。 |

### 11. R8.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只写 Step 8 执行骨架和矩阵框架 | pass |
| 是否未填完整最终环境矩阵 / 配置矩阵 / 依赖表 | pass |
| 是否承接 L3 profile、依赖裁剪和数据策略 | pass |
| 是否保留 L1-governance 框架参考而未复制领域事实 | pass |
| 是否未新增 config key、env key、CLI selector、secret provider、product、topic、port、mapper、marker source 或 phase boundary | pass |
| 是否未写 CI suite、脚本、artifact path、report path、evidence schema 或验收 gate | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 已收到用户确认,进入 Step 8 `R8.3 P0 环境矩阵:先思考`。

---

## R8.3 P0 环境矩阵:先思考

### 1. 当前模块目标

`R8.3` 只思考后续 `R8.4` 应如何写入环境矩阵行。它需要把 `04-配置设计.md` 的六个 profile、Step 6 的 83 条 `TC-ML-*` 用例族和 Step 7 的 81 个 `DS-ML-*` 数据族,映射到可定位的测试环境候选中。

当前模块不写最终环境矩阵,不定义 CI suite、执行脚本、artifact / report 路径、evidence schema、验收 gate、实施 phase 或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.4 |
| 用户确认 | 已确认从 `R8.2` 推进到 `R8.3`。 |
| 当前允许 | 思考 `local-dev`、`ci-test`、`integration-like`、`operations-replay`、`staging-like`、`production-like` 的用途、依赖族、协作方式、关键配置域、数据策略和风险。 |
| 当前禁止 | 写最终环境矩阵;写依赖判定表全集;写 profile 配置矩阵全集;写 CI suite / script / required check;evidence schema;验收标准;实施计划;正式 `05-测试方案.md`。 |

### 2. R8.3 输入承接

| 输入 | R8.3 承接点 | 思考影响 |
|---|---|---|
| Step 6 cross-case closure | 83 条唯一 `TC-ML-*` 候选用例,覆盖 truth、version、consumption、trace/job/recovery、config/dependency/redaction/observability。 | 环境必须覆盖 P0 主线、负向、恢复、配置和 redaction 用例族。 |
| Step 7 cross-data closure | 81 个唯一 `DS-ML-*`,且所有 DS 具备 run namespace、构造方式、隔离和清理规则。 | 环境只分配数据族执行位置,不改写 DS。 |
| `04` profile matrix | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 为 P0 candidate;`staging-like`、`production-like` 为 P1/P2 direction。 | R8.4 应把前四个写成当前 P0 环境行,后两个写成非 P0 前置行。 |
| `04` failure strategy | invalid config fail-fast;raw secret/body fail-closed;optional read/material degraded;publisher/handoff failed 不回滚 truth。 | 环境风险列必须说明不可用如何裁决。 |
| `03` test cuts | contracts/domain/application/infra/api/worker/jobs、command/query/inbound/outbound/job、stored replay、no-write、redaction。 | `ci-test` 和 `integration-like` 需要承载大部分 P0 自动化候选,但具体 suite 留 Step 9。 |
| `03` dependency constraints | 只有 `core-contracts` 是 compile dependency candidate;其他 sibling repo 是 runtime / event / replay 协作。 | 环境行不得把 process、identity、runtime、member-images 等写成 path dependency。 |

### 3. 环境行候选思考

| 环境 | R8.3 候选用途 | 应承接的用例 / 数据族 | R8.4 写入提醒 |
|---|---|---|---|
| `local-dev` | 本地装配、手动 sanity、fake adapter wiring、最小 runtime builder 检查。 | 少量 happy-path DS: `RUN`、`DEF`、`CATALOG`、`FORMAL`、`QUERY`;不承载全量 P0 evidence。 | 风险列必须写“不作为正式 release evidence”。 |
| `ci-test` | P0 deterministic 主环境,覆盖 contract/domain/application/service/fake integration、config validation、redaction、low-cardinality guard。 | 全部 P0 DS 族均可在 CI 被调度;尤其 `CONFIG`、`DEPENDENCY`、`REDACTION`、`OBS`、`MARKER`。 | 不写 suite 名和命令;只写自动化主环境候选。 |
| `integration-like` | P0 controlled seam,覆盖 resolver / publisher / handoff / inbound / downstream boundary 的 unavailable、degraded、failed 和 no rollback。 | `CONSUME`、`DIST`、`PUBLISHER`、`HANDOFF`、`AVAILABILITY`、`DEPENDENCY`、`MARKER`。 | 只能证明 seam semantics,不证明真实 DB/bus/provider SLA。 |
| `operations-replay` | P0 replay / job semantics,覆盖 job-run-start freeze、stored replay、checkpoint/report、partial failure、no truth repair。 | `REPLAY`、`UOW`、`RECOVERY`、`JOB`、`REPORT`、`TRACE`、`AUDIT`、`HANDOFF`。 | 必须写 replay root / report refs 需去标识,不写 artifact path/schema。 |
| `staging-like` | P1/P2 selected-run / release-candidate direction。 | future durable selected-run dataset direction;不可消费 Step 7 P0 fixture 作为生产前置。 | 写为非 P0 pass 前置;unavailable 只记 residual。 |
| `production-like` | P1/P2 future operations direction。 | future production-safe data strategy;无当前 P0 fixture / replay override。 | 当前不写 production runbook、capacity、secret provider 或真实产品。 |

### 4. 依赖服务候选思考

R8.4 的依赖服务列不应写真实产品清单,而应写测试所需的依赖族和替身形态。

| 环境 | 依赖服务候选 | 不应写入 |
|---|---|---|
| `local-dev` | in-memory / fake store、fake or disabled resolver、fake publisher、fake handoff、safe local diagnostics、local deterministic or safe default clock/id。 | 真实 DB、真实 bus、真实 secret provider、production endpoint。 |
| `ci-test` | isolated fake / temp store、deterministic fake resolver、fake outbox / handoff、fixed clock/id、redaction checker、dependency guard、metric/trace capture candidate。 | CI 明文 secret、真实 provider、未脱敏 evidence、真实 topic。 |
| `integration-like` | controlled durable-like seam、controlled resolver/publisher/handoff、scenario clock/id、adapter unavailable / failed injection。 | 真实产品 SLA、vendor schema、真实 sibling repo state。 |
| `operations-replay` | replay material / loaded report refs、replayed outbox / handoff refs、job run input、checkpoint/progress/report refs、run-scoped diagnostic capture。 | raw replay body、provider response body、report body、truth repair worker。 |
| `staging-like` | future durable store、future real-like resolver/bus/handoff/secret ref direction。 | 当前 P0 required dependency。 |
| `production-like` | future approved durable store、external dependency、production bus、handoff target、runtime provider direction。 | 当前测试环境承诺、runbook、capacity 或 product binding。 |

### 5. 数据策略候选思考

| 数据族 | 首选环境思考 | 原因 |
|---|---|---|
| `RUN` shared baseline | all P0 environments。 | 只提供 run namespace、fixed clock、scoped id、actor / operation context。 |
| `DEF` / `CATALOG` / `FORMAL` / `VERSION` / `STATE` | `ci-test`;少量 happy path 可进 `local-dev`。 | 主要验证 domain / application deterministic behavior。 |
| `CONSUME` / `DIST` / `PUBLISHER` / `HANDOFF` / `AVAILABILITY` | `integration-like`;部分 deterministic branch 可进 `ci-test`。 | 需要 controlled seam 和 failure mapping。 |
| `TRACE` / `AUDIT` / `LINEAGE` / `IMPACT` / `EVIDENCE` | `ci-test` 与 `operations-replay`。 | 一部分是 deterministic no raw body / refs-only,一部分依赖 report/checkpoint/replay。 |
| `REPLAY` / `UOW` / `RECOVERY` / `JOB` / `REPORT` | `operations-replay`;部分 UoW rollback 可进 `ci-test`。 | replay/resume/checkpoint/report 不应在普通 query/command 环境里临时拼。 |
| `CONFIG` / `DEPENDENCY` / `REDACTION` / `DIAGNOSTIC` / `METRIC` / `OBS` / `MARKER` | `ci-test`;controlled unavailable 可进 `integration-like`。 | 需要 deterministic validator、fake dependency registry、scanner/capture candidate 和 marker-source guard。 |

### 6. 环境风险与不可用思考

| 风险 | R8.3 判断 | R8.4 应写入方式 |
|---|---|---|
| `local-dev` 被误当正式证据 | 它只适合快速反馈和手动 sanity。 | 风险列写 non-release evidence。 |
| `ci-test` 装配失败后 silent fallback | P0 主环境不能 fallback。 | 写 fail-fast / test fail-fast。 |
| `integration-like` 被理解为真实集成 | 当前只验证 controlled seam。 | 写 does not prove real product SLA。 |
| `operations-replay` 误修 core truth | job/replay 只能读 stored surface、写 report/checkpoint/issue。 | 写 no truth repair。 |
| `staging-like` / `production-like` 进入 P0 前置 | 当前属于 P1/P2 direction。 | 写 unavailable 不计 P0 pass。 |
| 缺 marker / mapper / schema | 环境不能补正式来源。 | 写 source-missing stop / return owning Step。 |

### 7. R8.4 写入边界

R8.4 可以写入:

1. 环境矩阵的六个 profile 行。
2. 每行的用途、依赖服务、全局依赖类型、测试协作方式、关键配置 / feature family、数据策略和风险。
3. 只在环境行内标出 P0 / P1/P2 口径和不可用处理。

R8.4 禁止写入:

1. 依赖类型判定表全集,该内容留 R8.5/R8.6。
2. profile 配置矩阵全集和环境到数据集全集,该内容留 R8.7/R8.8。
3. 环境拓扑图、不可用处理表和跨环境审计,该内容留 R8.9/R8.10。
4. CI suite、执行脚本、artifact path、report path、evidence schema、验收 gate、implementation plan 或正式 `05-测试方案.md`。

### 8. R8.3 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考环境矩阵行内容 | pass |
| 是否承接 Step 6 TC 族和 Step 7 DS 族 | pass |
| 是否承接 `04` 六个 profile 且未新增 profile | pass |
| 是否明确前四个 profile 为 P0 candidate,后两个为 P1/P2 direction | pass |
| 是否未写最终环境矩阵、完整依赖表、完整配置矩阵或拓扑图 | pass |
| 是否未写 CI suite、脚本、artifact path、evidence schema、验收 gate 或实施计划 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 已收到用户确认,进入 Step 8 `R8.4 P0 环境矩阵:再写入`。

---

## R8.4 P0 环境矩阵:再写入

### 1. 当前模块写入目标

`R8.4` 只把 `R8.3` 已确认的六个 profile 写成环境矩阵行。矩阵用于说明当前测试在哪些环境、依赖和配置域下执行,以及 P0 / P1/P2 边界如何裁决。

当前模块不写依赖类型判定表全集、profile 配置矩阵全集、环境拓扑图、不可用处理表、跨环境审计、CI suite、脚本、artifact / report 路径、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.5 |
| 用户确认 | 已确认从 `R8.3` 推进到 `R8.4`。 |
| 当前允许 | 写环境矩阵六个 profile 行,包括用途、依赖服务、全局依赖类型、测试协作方式、关键配置 / feature family、数据策略和风险。 |
| 当前禁止 | 写依赖类型判定表全集;写 profile 配置矩阵全集;写拓扑图;写 CI suite / script / required check;evidence schema;验收标准;实施计划;正式 `05-测试方案.md`。 |

### 2. 环境矩阵

| 环境 | 用途 | 依赖服务 | 全局依赖类型 | 测试协作方式 | 关键配置 / feature family | 数据策略 | 风险 |
|---|---|---|---|---|---|---|---|
| `local-dev` | 本地装配、手动 sanity、fake adapter wiring、最小 runtime builder 检查。 | in-memory / fake store、fake or disabled resolver、fake publisher、fake handoff、safe local diagnostics、local deterministic or safe default clock/id。 | compile:`L0-core` / `core-contracts`;runtime:fake / disabled local adapters;local tool:safe diagnostics。 | path dependency only for `core-contracts`;fake / in-memory / disabled;manual sanity。 | runtime profile、adapter mode、store binding、resolver/publisher/handoff fake or disabled、safe diagnostics、clock/id family。 | `DS-ML-RUN-001` 加少量 happy-path `DEF`、`CATALOG`、`FORMAL`、`QUERY` 数据族;run namespace drop。 | P0 support,但不作为正式 release evidence;不能证明 production readiness。 |
| `ci-test` | P0 deterministic 主环境,覆盖 contracts/domain/application/service/fake integration、config validation、redaction、metric/trace guard。 | isolated fake / temp store、deterministic fake resolver、fake outbox / handoff、fixed clock/id、redaction checker、dependency guard、metric/trace capture candidate。 | compile:`L0-core` / `core-contracts`;runtime:fake infra;event:fixture / fake publisher;local tool:redaction / dependency / metric guard。 | path dependency only for `core-contracts`;fake / fixture / deterministic capture。 | runtime profile、strict validation、adapter mode=fake family、store binding、fake resolver/publisher/handoff、redaction、clock/id、test fixture family。 | 全部 P0 DS family 可在 CI 调度;重点覆盖 `CONFIG`、`DEPENDENCY`、`REDACTION`、`DIAGNOSTIC`、`METRIC`、`OBS`、`MARKER`;run namespace drop、fake reset、corpus delete。 | P0 主环境;装配失败、fixture 缺失、unsafe redaction 或 source gap 必须 fail-fast / test fail-fast,不得 silent fallback。 |
| `integration-like` | P0 controlled seam,覆盖 resolver / publisher / handoff / inbound / downstream boundary 的 unavailable、degraded、failed 和 no rollback。 | controlled durable-like seam、controlled resolver / publisher / handoff、scenario clock/id、adapter unavailable / failed injection、safe target refs。 | compile:`L0-core` / `core-contracts`;runtime:controlled adapters;event:controlled publisher / event fixture;replay:limited seam replay where needed。 | controlled / fake failure injection;disabled by scenario;event fixture;no real product SLA claim。 | runtime profile、adapter mode=controlled family、scenario config、safe selector refs、publisher/handoff target family、availability / failed marker source family。 | `CONSUME`、`DIST`、`PUBLISHER`、`HANDOFF`、`AVAILABILITY`、`DEPENDENCY`、`MARKER`;adapter reset、fault profile reset、run namespace drop。 | 只证明 seam semantics;不证明真实 DB / bus / provider SLA;unexpected unavailable fails,expected unavailable only passes with formal marker/source。 |
| `operations-replay` | P0 replay / job semantics,覆盖 job-run-start freeze、stored replay、checkpoint/report、partial failure、no truth repair。 | replay material / loaded report refs、replayed outbox / handoff refs、job run input、checkpoint/progress/report refs、run-scoped diagnostic capture。 | runtime:replay fixture / job runner seam;event:replayed outbox / fake publisher;replay:stored surface / checkpoint / report refs。 | event replay / fake adapters / controlled failure;resolver disabled unless scenario requires。 | runtime profile、replay root family、job-run-start input、batch/page policy family、report root family、handoff target family、diagnostic family。 | `REPLAY`、`UOW`、`RECOVERY`、`JOB`、`REPORT`、`TRACE`、`AUDIT`、`HANDOFF`;replay root must be de-identified;run namespace / report fixture cleanup。 | job/replay 不修 core truth,不覆盖 stored replay;missing or non-deidentified replay root rejects/fails;artifact path/schema 留 Step 13。 |
| `staging-like` | P1/P2 selected-run、release-candidate 和 future deployment-like 配置方向。 | future durable store、future real-like resolver / bus / handoff、future secret ref direction。 | runtime:future real-like;event:future real event;not current P0 prerequisite。 | future selected-run / dry-run only;no P0 required pass。 | future profile direction、deployment config direction、environment refs direction、secret provider ref direction。 | future durable selected-run data direction;不得消费 Step 7 P0 fixture 作为 staging 前置。 | P1/P2 direction;unavailable 只记录 residual / selected-run unavailable,不计 P0 pass。 |
| `production-like` | P1/P2 future operations、真实运维和 future approved dependency 方向。 | future approved durable store、external dependency、production bus、handoff target、runtime provider direction。 | runtime:future production;event:future production event;not current P0 prerequisite。 | future approved real products;no fake/test fixture/replay override。 | future production profile direction、operations-controlled config direction、secret provider ref only direction、no ad hoc override。 | future production-safe data strategy;当前无 P0 fixture / replay material / production data requirement。 | 当前不执行;不写 production runbook、capacity、secret provider schema 或产品选择;unavailable 不计 P0 pass。 |

### 3. 本批写入后移记录

| 后移内容 | 后续模块 | 原因 |
|---|---|---|
| 依赖对象逐项分类与协作方式判定 | R8.5/R8.6 | 本批只写环境行,不展开依赖对象全集。 |
| profile 配置矩阵和环境到 DS 矩阵 | R8.7/R8.8 | 本批只在环境行写配置域和数据族方向。 |
| 环境拓扑图、不可用处理表和跨环境审计 | R8.9/R8.10 | 需要等依赖表和配置矩阵完成后再统一审计。 |
| CI suite、脚本、required check | Step 9 | Step 8 只定义环境,不定义自动化门禁。 |
| artifact / report path、evidence JSON schema | Step 13 | Step 8 不定义证据归档 schema。 |

### 4. R8.4 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只写环境矩阵六个 profile 行 | pass |
| 是否前四个 profile 为 P0 candidate,后两个为 P1/P2 direction | pass |
| 是否明确 `local-dev` 不作为正式 release evidence | pass |
| 是否明确 `ci-test` 为 P0 deterministic 主环境且不得 silent fallback | pass |
| 是否明确 `integration-like` 只证明 controlled seam semantics | pass |
| 是否明确 `operations-replay` 不修 core truth 且 replay root 需去标识 | pass |
| 是否未写依赖类型判定表全集、profile 配置矩阵全集或拓扑图 | pass |
| 是否未写 CI suite、脚本、artifact path、evidence schema、验收 gate 或实施计划 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 已收到用户确认,进入 Step 8 `R8.5 依赖类型 / 协作方式表:先思考`。

---

## R8.5 依赖类型 / 协作方式表:先思考

### 1. 当前模块目标

`R8.5` 只思考后续 `R8.6` 的依赖类型与测试协作方式判定表如何写。它需要把全局依赖规则、`00/01/03` 的依赖裁剪和 R8.4 环境矩阵对齐,防止测试环境把运行期 / 事件 / replay 协作误写成 Cargo path dependency。

当前模块不写最终依赖判定表全集,不写 profile 配置矩阵、拓扑图、CI suite、脚本、artifact / report 路径、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.6 |
| 用户确认 | 已确认从 `R8.4` 推进到 `R8.5`。 |
| 当前允许 | 思考 compile / runtime / event / replay / local tool 依赖判定、各相邻仓测试协作方式、path dependency 禁止边界和 R8.6 写入边界。 |
| 当前禁止 | 写最终依赖判定表全集;写 profile 配置矩阵;写拓扑图;写 CI suite / script / required check;evidence schema;验收标准;实施计划;正式 `05-测试方案.md`。 |

### 2. R8.5 输入承接

| 输入 | 依赖裁剪结论 | R8.6 思考影响 |
|---|---|---|
| `全局项目依赖关系与裁剪规则.md` | 编译期依赖可写 package/path dependency;运行期和事件协作依赖不得写成 Cargo path dependency。 | R8.6 表必须有“是否允许 path dependency”列。 |
| `00-需求文档.md` §6 / §12 | `L0-core` 为编译期;`L0-bus` 为事件协作;process / identity / runtime / member-images 为运行期消费;governance / artifact / marketplace 等多为候选或外围。 | R8.6 要区分核心 P0 协作方和外围 / 条件型协作方。 |
| `01-架构设计.md` §8 | 运行期 / 事件协作不得写成源码级拥有关系;外围不可用不得改写核心 truth。 | R8.6 的禁止列要写“不得把下游运行状态当 truth”。 |
| `03-详细设计.md` §3.4 / §4.6 | `core-contracts` 是唯一 compile dependency candidate;`L0-bus`、process、identity、runtime、member-images 等不写 Cargo dependency。 | R8.6 可以直接列 `core-contracts` 允许 path dependency,其他对象全部禁止。 |
| R8.4 环境矩阵 | P0 使用 fake / in-memory / controlled / disabled / replay / local tool。 | R8.6 应把这些协作方式分配到具体依赖对象。 |

### 3. 依赖类型判定思考

| 依赖类型 | R8.5 判定 | R8.6 写入提醒 |
|---|---|---|
| compile | 只有 `L0-core` / `core-contracts`。 | 允许 path dependency / package dependency candidate,但实施前仍需复核 crate path。 |
| runtime | process、identity、runtime、member-images、governance、artifact、marketplace、console/SDK 等。 | 只能用 safe refs、summary fixture、adapter / fake / controlled seam。 |
| event | `L0-bus` 和事件协作候选。 | 只能用 fake publisher、event fixture、event replay、topic map completeness candidate。 |
| replay | stored surface、outbox、handoff、report、checkpoint、job run、operations replay materials。 | 只能使用 de-identified replay root、stored surface fixture、report/checkpoint refs。 |
| local tool | redaction checker、dependency guard、manifest scan、metric / trace capture checker。 | 工具只能作为测试辅助,不能替代正式 marker、truth 或 evidence schema。 |

### 4. 依赖对象行候选思考

| 依赖对象 | R8.5 候选类型 | R8.6 应写协作方式 | 关键禁止 |
|---|---|---|---|
| `L0-core` / `core-contracts` | compile | path dependency / package dependency candidate。 | 用其他 sibling repo 进入 Cargo。 |
| `L0-bus` | event | fake publisher、event fixture、event replay、topic map completeness candidate。 | 用 broker ack、topic 或 payload 证明 truth。 |
| `L1-process` | runtime / event candidate | process-facing safe refs、consumption boundary fixture、fake read surface、impact summary fixture。 | 读取 process execution state 或 ProcessInstance 证明方法定义 truth。 |
| `L1-identity` | runtime / event candidate | actor / role / identity safe summary、fake adapter、event fixture。 | 迁入成员生命周期、成员实际角色状态或 auth truth。 |
| `L2-runtime` | runtime | runtime use context fixture、controlled adapter、unavailable branch。 | 用 runtime execution 改写方法资产 definition truth。 |
| `L2-member-images` | runtime | role-to-image safe ref、downstream boundary fixture、fake adapter。 | 把 image build 状态写成本仓 truth。 |
| `L1-governance` | conditional runtime / event candidate | governance basis summary、result ref fake、disabled by scenario。 | 把 governance Gate 执行或 policy enforce 写成 P0 环境前置。 |
| `L1-artifact` / archive | runtime / replay candidate | artifact/archive ref fixture、body-free boundary、lineage hint fixture。 | 保存 artifact、archive、evidence 正文或文件体。 |
| `L6-marketplace` | peripheral runtime / event candidate | distribution context ref、marketplace context fixture、disabled by scenario。 | marketplace 交易、订单、安装、履约进入 P0。 |
| observability / diagnostics | local tool / runtime handoff | redaction checker、safe diagnostic capture、metric / trace candidate。 | 观测后端作为 truth 或 recovery proof。 |
| durable DB / broker / secret provider | P1/P2 future runtime product | future selected-run direction only。 | 作为当前 P0 required dependency。 |

### 5. path dependency 禁止边界思考

R8.6 必须把 `path dependency` 从“本地仓存在”中剥离出来。是否允许 path dependency 只取决于正式依赖类型,不取决于测试方便程度。

| 场景 | R8.5 裁决 | R8.6 表达方式 |
|---|---|---|
| 测试需要 typed ref / shared contract | 只能由 `core-contracts` 提供。 | `L0-core` 行写允许 path dependency candidate。 |
| 测试需要 process / identity / runtime / member-images 输入 | 使用 safe refs、summary fixture、fake adapter。 | 这些行写 path dependency = 否。 |
| 测试需要 bus 协作 | 使用 fake publisher、event fixture、event replay。 | `L0-bus` 行写 path dependency = 否。 |
| 测试需要 governance / artifact / marketplace 方向 | 使用 conditional / peripheral safe refs 或 disabled by scenario。 | 写 runtime/event candidate,不作为 P0 前置。 |
| 测试需要 redaction / dependency scan | 使用 local tool candidate。 | 写 not applicable,不写 package dependency。 |

### 6. R8.6 写入边界

R8.6 可以写入:

1. 依赖类型与测试协作方式判定表。
2. 每个依赖对象的依赖类型、是否允许 path dependency、P0 协作方式、覆盖环境和禁止事项。
3. path dependency 禁止边界和 source gap 停审口径。

R8.6 禁止写入:

1. profile 配置矩阵和环境到数据集矩阵,该内容留 R8.7/R8.8。
2. 环境拓扑图、不可用处理表和跨环境审计,该内容留 R8.9/R8.10。
3. CI suite、执行脚本、artifact path、report path、evidence schema、验收 gate、implementation plan 或正式 `05-测试方案.md`。
4. 新增 port、adapter、topic、config key、marker source、schema 或 phase boundary。

### 7. R8.5 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考依赖类型 / 协作方式表 | pass |
| 是否承接全局依赖规则和 `00/01/03` 裁剪 | pass |
| 是否明确只有 `L0-core` / `core-contracts` 允许 path dependency candidate | pass |
| 是否明确 runtime / event / replay 依赖只能用 fake / controlled / fixture / replay | pass |
| 是否未写最终依赖表全集、profile 配置矩阵或拓扑图 | pass |
| 是否未写 CI suite、脚本、artifact path、evidence schema、验收 gate 或实施计划 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 已收到用户确认,进入 Step 8 `R8.6 依赖类型 / 协作方式表:再写入`。

---

## R8.6 依赖类型 / 协作方式表:再写入

### 1. 当前模块写入目标

`R8.6` 将 `R8.5` 的依赖裁剪思考写成依赖类型与测试协作方式判定表,并固定 path dependency 禁止边界和 source gap 停审口径。

当前模块不写 profile 配置矩阵、环境到数据集矩阵、拓扑图、CI suite、执行脚本、artifact / report 路径、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.7 |
| 用户确认 | 已确认从 `R8.5` 推进到 `R8.6`。 |
| 当前允许 | 写依赖类型与测试协作方式判定表、path dependency 禁止边界和 source gap 停审口径。 |
| 当前禁止 | 写 profile 配置矩阵;写环境到数据集矩阵;写拓扑图;写 CI suite / script / required check;evidence schema;验收标准;实施计划;正式 `05-测试方案.md`。 |

### 2. 依赖类型与测试协作方式判定表

| 依赖对象 | 依赖类型 | 是否允许 path dependency | P0 协作方式 | 覆盖环境 | 禁止事项 |
|---|---|---|---|---|---|
| `L0-core` / `core-contracts` | compile | 是,仅作为 compile dependency candidate。 | path dependency / package dependency candidate;实施前复核 package、crate 名和相对路径。 | `local-dev`;`ci-test`;`integration-like`。 | 用其他 sibling repo 进入 Cargo;把 `core-contracts` 版本漂移当作测试通过。 |
| `L0-bus` | event | 否。 | fake publisher、event fixture、event replay、topic map completeness candidate。 | `ci-test`;`integration-like`;`operations-replay`。 | broker ack、topic、offset 或 raw payload 证明本仓 truth。 |
| `L1-process` | runtime / event candidate | 否。 | process-facing safe refs、consumption boundary fixture、fake read surface、impact summary fixture。 | `ci-test`;`integration-like`。 | 读取 process execution state、ProcessInstance 或流程运行状态证明方法定义 truth。 |
| `L1-identity` | runtime / event candidate | 否。 | actor / role / identity safe summary、fake adapter、event fixture。 | `local-dev`;`ci-test`;`integration-like`。 | 迁入成员生命周期、成员实际角色状态、auth truth 或 identity 仓内部状态。 |
| `L2-runtime` | runtime | 否。 | runtime use context fixture、controlled adapter、unavailable / degraded branch。 | `ci-test`;`integration-like`。 | 用 runtime execution、tool loop 或运行结果改写方法资产 definition truth。 |
| `L2-member-images` | runtime | 否。 | role-to-image safe ref、downstream boundary fixture、fake adapter。 | `ci-test`;`integration-like`。 | 把 image build 状态、镜像产物或构建日志写成本仓 truth。 |
| `L1-governance` | conditional runtime / event candidate | 否。 | governance basis summary、result ref fake、disabled by scenario。 | `integration-like`;future selected-run。 | 把 governance Gate 执行、policy enforce 或治理过程作为 P0 环境前置。 |
| `L1-artifact` / archive | runtime / replay candidate | 否。 | artifact/archive ref fixture、body-free boundary、lineage hint fixture。 | `ci-test`;`operations-replay`;future selected-run。 | 保存 artifact、archive、evidence 正文、文件体、provider body 或 archive package。 |
| `L6-marketplace` | peripheral runtime / event candidate | 否。 | distribution context ref、marketplace context fixture、disabled by scenario。 | `integration-like`;future selected-run。 | marketplace 交易、订单、安装、结算、履约或 listing body 进入 P0。 |
| observability / diagnostics | local tool / runtime handoff | 不适用。 | redaction checker、safe diagnostic capture、metric / trace candidate、dependency guard。 | `ci-test`;`operations-replay`。 | 观测后端、metric、trace、log 或 diagnostic 文本作为 truth / recovery proof。 |
| durable DB / broker / secret provider | P1/P2 future runtime product | 否 for current P0。 | future selected-run / dry-run direction only。 | `staging-like`;`production-like` future direction。 | 作为当前 P0 required dependency;写入产品名、endpoint、secret provider schema 或 runbook。 |

### 3. path dependency 禁止边界

| 判定点 | 裁决 | 说明 |
|---|---|---|
| 是否本地有 sibling repo | 不构成 path dependency 依据。 | 依赖类型必须来自正式 `00/01/03` 和全局裁剪规则。 |
| 是否需要 typed ref / shared contract | 只允许 `core-contracts`。 | 其他仓的 public surface 只能以 safe refs / summary fixture / adapter fake 承接。 |
| 运行期消费关系 | 不允许 path dependency。 | process、identity、runtime、member-images 等只能通过 runtime boundary / fake / controlled seam。 |
| 事件协作关系 | 不允许 path dependency。 | `L0-bus` 在测试中用 fake publisher、event fixture、event replay。 |
| 外围 / 条件型关系 | 不允许升级为 P0 compile dependency。 | governance、artifact、marketplace、observability 等不可阻断核心 P0。 |
| local tool | 不适用 path dependency。 | redaction / dependency / metric guard 的具体脚本和 required check 留 Step 9。 |

### 4. source gap 停审口径

| 缺口 | Step 8 裁决 | 后续处理 |
|---|---|---|
| 需要新的 compile dependency | Step 8 不得新增。 | 回架构 / `03` dependency owner 和后续实施计划。 |
| 需要新的 runtime adapter / port | Step 8 不得补口。 | 回 `03` port / adapter owner。 |
| 需要新的 event topic / payload schema | Step 8 不得补 topic 或 payload。 | 回 `03` protocol / outbound owner 或后续事件设计。 |
| 需要新的 config key / env key / CLI selector | Step 8 不得发明 key。 | 回 `04-配置设计.md` 或 Step 9 automation owner。 |
| 需要 degraded / failed / availability marker source | Step 8 不得合成 marker。 | 回 `03` mapper / marker / availability owner。 |
| 需要 evidence artifact / report schema | Step 8 不得定义。 | 留 Step 13。 |

### 5. 本批写入后移记录

| 后移内容 | 后续模块 | 原因 |
|---|---|---|
| profile 配置矩阵和环境到 DS 矩阵 | R8.7/R8.8 | 依赖对象判定已完成,但配置域和数据族需单独收敛。 |
| 环境拓扑图、不可用处理表和跨环境审计 | R8.9/R8.10 | 需要依赖表与配置矩阵完成后再统一审计。 |
| CI suite / required check / script | Step 9 | 本批只定义测试协作方式,不定义自动化执行。 |
| artifact / report path / evidence schema | Step 13 | 本批不定义证据归档格式。 |

### 6. R8.6 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入依赖类型与测试协作方式判定表 | pass |
| 是否明确只有 `L0-core` / `core-contracts` 允许 path dependency candidate | pass |
| 是否明确 runtime / event / replay / local tool 依赖不得写成 Cargo path dependency | pass |
| 是否覆盖 L0-bus、process、identity、runtime、member-images、governance、artifact、marketplace、observability 和 future product 边界 | pass |
| 是否写入 source gap 停审口径 | pass |
| 是否未写 profile 配置矩阵、拓扑图、CI suite、evidence schema、验收 gate 或实施计划 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.7 profile / config matrix / data strategy:先思考`;只允许思考 profile 配置矩阵、config domain、环境到 DS family 分配、fail-fast / degraded 数据策略和 R8.8 写入边界;不得写拓扑图、CI suite、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

---

## R8.7 profile / config matrix / data strategy:先思考

### 1. 当前模块目标

`R8.7` 只思考后续 `R8.8` 应如何写入 profile 配置矩阵和环境到数据策略矩阵。它需要把 `04-配置设计.md` 的 profile、配置来源、配置域、加载校验、失效策略,以及 Step 7 的 DS family,映射到可定位的测试环境和数据策略中。

当前模块不写最终 profile 配置矩阵、不写最终环境到 DS family 矩阵、不写拓扑图、不可用处理表、CI suite、执行脚本、artifact / report 路径、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.8 |
| 用户确认 | 已确认从 `R8.6` 推进到 `R8.7`。 |
| 当前允许 | 思考 profile 配置矩阵、config domain、环境到 DS family 分配、fail-fast / degraded 数据策略和 R8.8 写入边界。 |
| 当前禁止 | 写最终配置矩阵;写最终 DS family 矩阵;写拓扑图;写 CI suite / script / required check;evidence schema;验收标准;实施计划;正式 `05-测试方案.md`。 |

### 2. R8.7 输入承接

| 输入 | 已闭合结论 | R8.8 思考影响 |
|---|---|---|
| `04-配置设计.md` §6 | 六个 profile 已固定为 `local-dev`、`ci-test`、`integration-like`、`operations-replay`、`staging-like`、`production-like`。 | R8.8 只能按这六个 profile 写矩阵,不得新增 profile 名称或 runtime enum。 |
| `04-配置设计.md` §7 | 配置项只以 family 表达,例如 runtime profile、store slot、resolver slot、publisher target、handoff target、jobs、redaction、clock/id、testFixtures。 | R8.8 写配置域和验证方向,不写具体 key、env、CLI selector、文件路径或默认值。 |
| `04-配置设计.md` §9 | `runtime.*`、`stores.*`、`externalResolvers.*`、`inboundConsumers.*`、`outbox.*`、`jobs.*`、`handoff.*`、`redaction.*`、`idempotency.*`、`projection.*`、`reference.*`、`clockId.*`、`testFixtures.*` 等域已有激活和失败口径。 | R8.8 可按配置域写 startup / job-run-start / test harness 冻结点,不得改 activation 语义。 |
| `04-配置设计.md` §11 | invalid config fail-fast;fixture invalid test fail-fast;raw secret/body fail-closed;optional read/material/adapter 可 degraded 或 unavailable。 | R8.8 需要把 fail-fast / degraded / rejected / job failed 按 profile 和数据策略定位。 |
| Step 7 closure | 81 个唯一 `DS-ML-*`,且 `DS-ML-RUN-001` 只承载 run namespace、fixed clock、scoped id、actor / operation context。 | R8.8 只分配 DS family 到 profile / 环境,不新增 DS 或改变 DS 语义。 |
| R8.4 环境矩阵 | 前四个 profile 是 P0 candidate;后两个是 P1/P2 direction。 | R8.8 配置矩阵必须保持 P0 与 P1/P2 隔离。 |
| R8.6 依赖判定表 | 除 `core-contracts` 外,运行期 / 事件 / replay / local tool 依赖不得写成 path dependency。 | R8.8 的配置域不能把 runtime/event/replay 协作升级成源码依赖或真实产品前置。 |

### 3. profile 配置轴思考

`R8.8` 应以 profile 为行主轴,以配置域为列主轴,写出每个 profile 在 store、resolver、publisher、handoff、jobs、redaction、clock/id、fixture/replay 等域的测试定位。矩阵必须保持“配置域可定位,但不发明 key”。

| profile | R8.7 思考重点 | R8.8 写入提醒 |
|---|---|---|
| `local-dev` | 本地装配需要 in-memory / fake store、fake or disabled resolver、fake publisher / handoff、safe diagnostics、local deterministic or safe default clock/id。 | 写为 P0 support / manual sanity;不作为正式 evidence;允许 fake seed,禁止 raw secret/body。 |
| `ci-test` | P0 deterministic 主环境需要 isolated fake / temp store、deterministic fixture、fixed clock/id、redaction/dependency/metric guard。 | 写为 P0 自动化主 profile;invalid fixture / unsafe redaction / dependency gap 必须 test fail-fast。 |
| `integration-like` | controlled seam 需要 controlled resolver / publisher / handoff、scenario config、safe selector refs、adapter unavailable / failed injection。 | 写 controlled seam,不写真实产品 SLA;selected controlled adapter 后不得 fake fallback。 |
| `operations-replay` | replay / job 需要 replay root family、job-run-start input、report root family、checkpoint / progress / issue refs。 | 写 job-run-start freeze、de-identified replay root、no truth repair;不写 artifact path/schema。 |
| `staging-like` | future durable / real-like selected-run 方向。 | 写 P1/P2 direction;不允许 test fixture / fake override;unavailable 不阻塞 P0。 |
| `production-like` | future approved provider / production bus / operations-controlled config 方向。 | 写 future direction;禁止 ordinary raw secret、fixture、replay override、ad hoc operator override。 |

### 4. config domain 分组思考

R8.8 不应逐个发明配置键,而应按 `04` 的配置域写“影响测试结果的配置 family”。这样既能满足 Step 8 的可定位要求,又不会越权定义实施 key。

| 配置域 | R8.7 判断 | R8.8 应表达 |
|---|---|---|
| runtime / profile | profile selector、entry readiness、runtime assembly。 | 哪些 profile 参与 P0 / P1,显式非法 profile fail-fast。 |
| stores / material stores | repository store、read material store、fake/temp/replay/future durable binding。 | P0 fake / in-memory / temp;future durable 只在 P1/P2 direction。 |
| externalResolvers / source adapters | fake、disabled、controlled、future real-like resolver。 | required missing fail-fast;optional unavailable 只能按正式 marker/source degraded 或 rejected。 |
| inboundConsumers / outbox | inbound consumer registry、fake publisher、topic map coverage candidate、event replay。 | topic/payload schema 不在 Step 8 发明;enabled missing topic/target fail-fast 或 job rejected。 |
| jobs / replay | job kind、batch/page/timeout family、run-scoped replay input、checkpoint/report root。 | startup 或 job-run-start freeze;replay root 必须去标识;job 不修 truth。 |
| handoff / externalGrc / report target | handoff target、report target、optional export target。 | failed / pending / report issue 只复制正式 outcome/marker;不证明 downstream truth。 |
| redaction / boundary | safe output、deny list、page/body/time guard、body-free boundary。 | unsafe config fail-fast;raw secret/body fail-closed;dummy corpus 只在测试 profile。 |
| idempotency / projection / reference | retention、batch、stale threshold、maintenance params。 | invalid fail-fast / job rejected;不得用配置关闭 stored replay 或 query no-write。 |
| clockId / testFixtures | fixed clock/id、fake seed、fixture digest、de-identified replay root。 | local/CI/controlled/replay 可用;staging/production 禁止 fixture pollution。 |

### 5. 环境到 DS family 分配思考

R8.8 应写“环境到数据族”的矩阵,而不是重写 81 条 DS 明细。矩阵只说明哪类数据族主要在哪个 profile 运行,并保留 Step 7 的隔离和清理规则。

| DS family | 首选 profile 思考 | 备用 / 补充 profile | R8.8 写入提醒 |
|---|---|---|---|
| `RUN` | all P0 profiles。 | none。 | 只作 run namespace / fixed clock / scoped id / actor shell。 |
| `DEF` / `BODY` / `BOUNDARY` / `CATALOG` / `QUERY` / `POLLUTION` | `ci-test`。 | `local-dev` 少量 sanity;`integration-like` 只覆盖 boundary seam。 | 不让 pollution/body corpus 进入 truth 或 report。 |
| `FORMAL` / `VERSION` / `STATE` / `IDEMP` / `RECOVERY` | `ci-test`。 | `operations-replay` 覆盖 stored replay / recovery source 补充分支。 | idempotency / recovery 不能从 current truth 重建 stored surface。 |
| `CONSUME` / `DIST` / `PUBLISHER` / `HANDOFF` / `AVAILABILITY` / `SHELL` | `integration-like`。 | `ci-test` 覆盖 deterministic fake branch;`operations-replay` 覆盖 handoff / report replay。 | publisher / handoff failed 不回滚 truth,delivered 不证明 downstream truth。 |
| `TRACE` / `AUDIT` / `LINEAGE` / `IMPACT` / `EVIDENCE` | `ci-test`。 | `operations-replay` 覆盖 stored report / checkpoint / evidence lineage direction。 | 不写 evidence artifact schema;只承接 safe refs / summary。 |
| `REPLAY` / `UOW` / `JOB` / `REPORT` | `operations-replay`。 | `ci-test` 覆盖 UoW rollback deterministic branch。 | report body/path/schema 后移 Step 13。 |
| `CONFIG` / `DEPENDENCY` / `REDACTION` / `DIAGNOSTIC` / `METRIC` / `OBS` / `MARKER` | `ci-test`。 | `integration-like` 覆盖 controlled unavailable/degraded;`operations-replay` 覆盖 job diagnostic/report issue。 | marker source missing 必须停审,不能由 fixture 合成。 |

### 6. fail-fast / degraded 数据策略思考

R8.8 需要把失败裁决写清楚,避免环境或 fixture 把设计缺口伪装为通过。

| 场景 | R8.7 裁决 | R8.8 写入提醒 |
|---|---|---|
| 显式非法 profile / config source / duplicate key | fail-fast / current entry rejected。 | 只表达 source family 和 issue class,不写具体 key。 |
| required store / adapter / target 缺失 | startup fail-fast 或 job-run-start rejected。 | P0 不允许 silent fallback;production-like 禁止 fake fallback。 |
| test fixture / fixed clock/id / replay root 非法 | test fail-fast 或 replay job rejected。 | replay root 必须去标识;fixture 不得进入 staging/production。 |
| raw secret / raw body / provider payload 暴露 | fail-closed / rejected。 | dummy corpus 只用于测试;不得写真实 secret/body。 |
| optional read material / resolver / diagnostic sink unavailable | degraded / unavailable,但必须复制正式 marker/source。 | 缺 marker/source 即停审,不得 synthetic marker。 |
| publisher / handoff failed | accepted truth 不回滚;记录 failed / pending / report issue。 | outcome 只证明本仓 outcome,不证明下游 truth。 |
| job partial failure / checkpoint resume | 写 report / issue / checkpoint refs;不修 core truth。 | report schema、artifact path 留 Step 13。 |

### 7. R8.8 写入边界

R8.8 可以写入:

1. profile 配置矩阵,以六个 profile 为行,配置域为列。
2. config domain 测试影响表,只写配置 family、冻结点、失败口径和 profile 限制。
3. 环境到 DS family 分配矩阵,只写 DS family 级别,不重写 81 条 DS 明细。
4. fail-fast / degraded / rejected / job failed 的数据策略表。
5. 本批后移记录和 R8.9 进入门禁。

R8.8 禁止写入:

1. 新增 profile、config key、env key、CLI selector、文件路径、默认值、secret provider、adapter product、topic、port、mapper、marker source 或 schema。
2. 环境拓扑图、不可用处理总表和跨环境审计,这些留 R8.9/R8.10。
3. CI suite、执行脚本、required check、artifact path、report path、evidence schema、验收 gate、implementation plan 或正式 `05-测试方案.md`。
4. 改写 Step 7 的 DS 定义、TC-to-DS 映射、隔离清理规则或 fixture 构造语义。

### 8. R8.7 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 profile / config matrix / data strategy | pass |
| 是否承接 `04-配置设计.md` 的六个 profile 和配置域 | pass |
| 是否未新增 profile、config key、env key、CLI selector、secret provider、adapter product 或 schema | pass |
| 是否承接 Step 7 的 81 个 DS 和 `DS-ML-RUN-001` 共享壳边界 | pass |
| 是否只按 DS family 分配环境,未新增 DS 或改写 TC 映射 | pass |
| 是否明确 fail-fast / degraded / rejected / job failed 的 source 边界 | pass |
| 是否未写拓扑图、CI suite、artifact path、evidence schema、验收 gate 或实施计划 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.8 profile / config matrix / data strategy:再写入`;只允许写 profile 配置矩阵、config domain 测试影响表、环境到 DS family 分配矩阵、fail-fast / degraded / rejected / job failed 数据策略表和本批后移记录;不得写拓扑图、CI suite、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

---

## R8.8 profile / config matrix / data strategy:再写入

### 1. 当前模块写入目标

`R8.8` 将 `R8.7` 已确认的 profile、config domain 和 DS family 分配判断写成矩阵。它只固定测试 profile 下哪些配置域影响结果、哪些数据族在哪类环境执行、不同失败口径如何裁决。

当前模块不写环境拓扑图、不可用处理总表、跨环境审计、CI suite、执行脚本、artifact / report 路径、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.9 |
| 用户确认 | 已确认从 `R8.7` 推进到 `R8.8`。 |
| 当前允许 | 写 profile 配置矩阵、config domain 测试影响表、环境到 DS family 分配矩阵、fail-fast / degraded / rejected / job failed 数据策略表和本批后移记录。 |
| 当前禁止 | 写拓扑图;写 CI suite / script / required check;evidence schema;验收标准;实施计划;正式 `05-测试方案.md`;新增 config key / env key / CLI selector / schema / marker source。 |

### 2. profile 配置矩阵

| profile | 测试定位 | 配置来源组合 | store / resolver / publisher / handoff | jobs / replay / report | diagnostics / clock / id / fixture | 失败口径 |
|---|---|---|---|---|---|---|
| `local-dev` | P0 support;本地装配、手动 sanity、fake adapter wiring。 | baseline defaults、optional local config file、safe refs、entry-local selector。 | in-memory / fake store;disabled or fake resolver;fake publisher / outbox;local fake handoff。 | job / replay 只允许 local sanity 或 disabled by scenario。 | local deterministic or safe default clock/id;optional fake seed;safe local diagnostics。 | 不作为正式 release evidence;raw secret/body fail-closed;fake target 缺失按本地装配失败处理。 |
| `ci-test` | P0 deterministic 主 profile。 | baseline defaults、test scenario config、CI-safe refs、deterministic fixture。 | isolated fake / temp store;deterministic fake resolver;fake outbox / handoff。 | job 参数只做 deterministic branch;stored replay / report ref 使用 fixture。 | fixed clock/id;deterministic fixture;redaction / dependency / metric guard candidate。 | invalid config、fixture missing、unsafe redaction、dependency gap 必须 fail-fast / test fail-fast。 |
| `integration-like` | P0 controlled seam。 | baseline defaults、scenario config、safe selector refs、entry-local entry / job selector。 | controlled durable-like seam;controlled resolver / publisher / handoff;scenario fault injection。 | job 只覆盖 controlled target / handoff / unavailable branch。 | scenario clock/id;controlled scenario fixture;credential / endpoint refs only。 | selected controlled adapter 后不得 fake fallback;unexpected unavailable fails;expected degraded 必须复制正式 marker/source。 |
| `operations-replay` | P0 replay / job semantics。 | baseline defaults、replay / job config direction、run-local input、replay material / report root refs。 | replay material / loaded report refs;resolver disabled unless scenario requires;replayed outbox / handoff refs。 | job-run-start freeze;checkpoint / progress / report / issue refs;de-identified replay root。 | run-scoped diagnostic capture;job-run fixed clock/id;replay fixture digest。 | replay root 缺失或未去标识则 rejected / test fail-fast;job 不修 core truth;report schema 后移 Step 13。 |
| `staging-like` | P1/P2 selected-run direction。 | deployment config direction、environment refs direction、limited operator entry params direction。 | future durable store;future real-like resolver / bus / handoff。 | future dry-run / selected-run direction。 | future runtime provider direction;no test fixture。 | 不阻塞当前 P0;fixture / fake override / raw secret 均为 profile pollution。 |
| `production-like` | P1/P2 future operations direction。 | operations-controlled config direction、restricted entry-local direction、no fixture / replay override。 | future approved durable store、external dependency、production bus、handoff target。 | future approved operations job direction;no replay override。 | future operations provider;secret provider refs only direction。 | 当前不执行;禁止 ordinary raw secret、fixture、replay override 和 ad hoc operator override。 |

### 3. config domain 测试影响表

| config domain | 冻结 / 生效点 | P0 测试影响 | 失败 / 降级口径 | 禁止补口 |
|---|---|---|---|---|
| `runtime.*` | startup;profile selector 可 entry-local。 | 选择 `local-dev` / `ci-test` / `integration-like` / `operations-replay` 的测试 profile。 | unknown profile、readiness 不满足或非法 entry selector -> fail-fast / entry rejected。 | 新增 profile enum、热重载、admin override。 |
| `stores.*` | startup。 | fake / in-memory / temp store、read material store、replay material store。 | required store missing / wrong kind -> startup fail-fast。 | 将真实 DB 写成 P0 required dependency。 |
| `externalResolvers.*` | startup;test fixture before fake runtime。 | fake / disabled / controlled resolver、availability branch。 | required resolver missing -> fail-fast;optional unavailable -> degraded / unavailable only with formal marker/source。 | 从 raw adapter error、HTTP status 或 fixture 合成 marker。 |
| `inboundConsumers.*` | startup。 | consumer namespace、supported version、dedup retention 的测试装配。 | invalid namespace/version -> fail-fast;unsupported runtime event rejected。 | 发明 event payload schema 或 topic。 |
| `outbox.*` | startup;batch may be job-run-start。 | fake publisher、event fixture、event replay、topic map completeness candidate。 | enabled target / topic missing -> fail-fast 或 job rejected。 | 用 broker ack、offset 或 raw payload 证明 truth。 |
| `jobs.*` | startup;batch / timeout may be job-run-start。 | operations replay、checkpoint resume、partial issue/report。 | invalid job kind / batch / timeout -> fail-fast 或 job rejected。 | 用配置允许 job 修 core truth。 |
| `handoff.*` / `externalGrc.*` | startup;target may be job-run-start。 | handoff target、external GRC / report target safe refs。 | target unavailable -> handoff failed / pending / report issue。 | delivered marker 证明 downstream truth 或保存 receipt body。 |
| `redaction.*` / `boundary.*` | startup。 | safe output、dummy leak corpus、body-free boundary guard。 | unsafe redaction、raw secret/body -> fail-closed / fail-fast。 | 放宽 redaction、输出 raw endpoint/body、保存 provider payload。 |
| `idempotency.*` / `projection.*` / `reference.*` | startup;batch may be job-run-start。 | duplicate replay、stale / batch / retention、maintenance params。 | invalid duration / batch / stale threshold -> fail-fast / job rejected。 | 配置关闭 stored replay、query no-write 或 marker copy-only。 |
| `clockId.*` / `testFixtures.*` | startup or test harness / operations replay start。 | fixed clock/id、fake seed、fixture digest、de-identified replay root。 | invalid timestamp/ref、fixture missing、replay root missing -> test fail-fast / replay job rejected。 | fixture 污染 staging / production,或 replay root 覆盖 marker/source。 |

### 4. 环境到 DS family 分配矩阵

| DS family | 主要 profile | 补充 profile | 数据策略 | 风险控制 |
|---|---|---|---|---|
| `RUN` | `local-dev`;`ci-test`;`integration-like`;`operations-replay` | none | 共享 `DS-ML-RUN-001`,只提供 run namespace、fixed clock、scoped id、actor / operation context。 | 不承载业务事实,不得作为 truth / evidence 数据。 |
| `DEF` / `BODY` / `BOUNDARY` / `CATALOG` / `QUERY` / `POLLUTION` | `ci-test` | `local-dev` 少量 sanity;`integration-like` boundary seam | fake repository / builder / read surface / write spy / isolated dummy corpus。 | body / pollution corpus 不进入 truth、audit、report 或 evidence body。 |
| `FORMAL` / `VERSION` / `STATE` / `IDEMP` / `RECOVERY` | `ci-test` | `operations-replay` for stored replay / recovery source | formalization / version / state seed、idempotency guard、commit unknown source variants。 | duplicate replay 不重跑;recovery 不从 current truth 重建 stored surface。 |
| `CONSUME` / `DIST` / `PUBLISHER` / `HANDOFF` / `AVAILABILITY` / `SHELL` | `integration-like` | `ci-test` deterministic fake branch;`operations-replay` handoff/report replay | controlled seam、safe boundary fixture、publisher / handoff fault profile、availability marker source。 | publisher / handoff failed 不回滚 truth;delivered 不证明 downstream truth。 |
| `TRACE` / `AUDIT` / `LINEAGE` / `IMPACT` / `EVIDENCE` | `ci-test` | `operations-replay` report/checkpoint lineage direction | refs-only trace/audit/lineage/impact safe chain。 | 不定义 evidence artifact schema;不保存 governance body、artifact body、receipt body。 |
| `REPLAY` / `UOW` / `JOB` / `REPORT` | `operations-replay` | `ci-test` UoW rollback deterministic branch | stored result / receipt / report present/missing variants、checkpoint/progress/issue refs、job no-repair guard。 | report body/path/schema 留 Step 13;job 不创建/修复 core truth。 |
| `CONFIG` / `DEPENDENCY` / `REDACTION` / `DIAGNOSTIC` / `METRIC` / `OBS` / `MARKER` | `ci-test` | `integration-like` controlled unavailable/degraded;`operations-replay` job diagnostic/report issue | config source samples、fake dependency registry、dummy leak corpus、safe capture、formal marker source present/missing variants。 | marker source missing 必须停审;local tool / diagnostic 不替代 truth 或 recovery proof。 |

### 5. fail-fast / degraded / rejected / job failed 数据策略表

| 场景 | 适用 profile | 裁决 | 测试数据 / fixture 口径 |
|---|---|---|---|
| 显式非法 profile、source、duplicate key、forbidden boundary override | `ci-test`;`integration-like`;`operations-replay` | startup fail-fast / entry rejected / test fail-fast。 | 使用 `CONFIG` family 的 source conflict / forbidden override sample,不定义正式 key。 |
| required store / adapter / target 缺失 | `ci-test`;`integration-like`;`operations-replay` | startup fail-fast 或 job-run-start rejected。 | 使用 `DEPENDENCY` family fake registry state;不得 fallback 到低优先级 fake。 |
| test fixture、fixed clock/id、replay root 非法 | `local-dev`;`ci-test`;`operations-replay` | test fail-fast 或 replay job rejected。 | 使用 run namespace、fixture digest、de-identified replay root guard。 |
| raw secret、raw body、provider payload 暴露 | all profiles | fail-closed / rejected。 | 使用 isolated dummy corpus;不得使用真实 secret、endpoint、provider response 或 artifact body。 |
| optional read material / resolver / diagnostic sink unavailable | `integration-like`;`ci-test` selected scenarios | degraded / unavailable only with formal marker/source。 | 使用 `MARKER` / `DEPENDENCY` family 的 formal marker source;source missing 进入停审。 |
| publisher / handoff target failed | `integration-like`;`operations-replay` | accepted truth 不回滚;outcome 为 failed / pending / report issue。 | 使用 publisher / handoff fault profile 与 truth guard。 |
| job partial failure、checkpoint resume、report issue | `operations-replay` | job failed / partial completed / replayed report,不修 truth。 | 使用 `JOB` / `REPORT` / `REPLAY` family 的 checkpoint、issue、stored report refs。 |

### 6. 本批写入后移记录

| 后移内容 | 后续模块 | 原因 |
|---|---|---|
| 环境拓扑图 | R8.9/R8.10 | 需要结合环境矩阵、依赖判定表和 profile 配置矩阵统一表达。 |
| 不可用处理总表 | R8.9/R8.10 | 本批只写失败策略,总表需和拓扑、跨环境审计一起收口。 |
| 跨环境审计 | R8.9/R8.10 | 需要检查 P0/P1 隔离、path dependency 越界、fixture 污染和 marker source 缺口。 |
| CI suite / required check / command | Step 9 | Step 8 不定义自动化执行。 |
| artifact / report path / evidence JSON schema | Step 13 | Step 8 不定义证据归档 schema。 |

### 7. R8.8 stop-review

| 检查项 | 结果 |
|---|---|
| 是否写入 profile 配置矩阵 | pass |
| 是否写入 config domain 测试影响表 | pass |
| 是否写入环境到 DS family 分配矩阵 | pass |
| 是否写入 fail-fast / degraded / rejected / job failed 数据策略表 | pass |
| 是否只按配置域 / family 表达,未新增 config key、env key、CLI selector、文件路径或默认值 | pass |
| 是否只按 DS family 分配环境,未重写 81 条 DS 明细或改写 TC 映射 | pass |
| 是否未写拓扑图、CI suite、artifact path、evidence schema、验收 gate 或实施计划 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.9 topology / unavailable / audit:先思考`;只允许思考环境拓扑图、不可用处理总表、跨环境审计、Step 8 closure 和 R8.10 写入边界;不得写 CI suite、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

---

## R8.9 topology / unavailable / audit:先思考

### 1. 当前模块目标

`R8.9` 只思考 Step 8 最后一批内容:环境拓扑图、不可用处理总表、跨环境 / 配置审计和 Step 8 closure。它需要把 R8.4 环境矩阵、R8.6 依赖判定表、R8.8 profile / config / data strategy 统一审计,为 `R8.10` 写入做准备。

当前模块不写最终拓扑图、不写最终不可用处理表、不写最终跨环境审计表、不写 CI suite、执行脚本、artifact / report 路径、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.10 |
| 用户确认 | 已确认从 `R8.8` 推进到 `R8.9`。 |
| 当前允许 | 思考环境拓扑图、不可用处理总表、跨环境审计、Step 8 closure 和 R8.10 写入边界。 |
| 当前禁止 | 写最终拓扑图;写最终不可用表;写最终审计结论;写 CI suite / script / required check;evidence schema;验收标准;实施计划;正式 `05-测试方案.md`。 |

### 2. L1-governance Step 8 框架参考思考

L1-governance Step 8 的可借鉴点是:用一张拓扑图表达 P0 测试依赖,再用不可用处理表和跨环境 / 配置审计表防止伪 pass。L3 只采用结构,不复制治理领域对象。

| L1-governance 框架点 | L3 采用方式 | L3 禁止 |
|---|---|---|
| 拓扑图明确 P0 测试依赖 | L3 R8.10 画出 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 与 `core-contracts`、fake / controlled / replay / local tool 的关系。 | 复制 governance 的 resolver、GRC、policy、outbox topic 或 suite 名。 |
| 跨仓连线标注依赖类型 | L3 所有跨仓 / 外部协作连线必须标注 `[compile]`、`[runtime]`、`[event]`、`[replay]` 或 `[local-tool]`。 | 用拓扑暗示 runtime/event 依赖是 Cargo path dependency。 |
| 不可用处理表禁止伪 pass | L3 P0 profile 装配失败必须 fail-fast;预期 unavailable/degraded 只有 formal marker/source 时可通过;P1/P2 unavailable 只记 residual。 | P0 环境不可用后跳过并标记 pass。 |
| 跨环境 / 配置审计表 | L3 R8.10 审计 P0/P1 隔离、path dependency 越界、fixture 污染、marker source 缺口、旧材料污染和 Step 9/13 后移边界。 | 把 Step 9 CI 或 Step 13 evidence schema 提前闭合。 |

### 3. 拓扑表达思考

R8.10 的拓扑图应该只表达测试依赖和协作方式,不表达部署拓扑、产品选择或源码拥有关系。图中可出现的节点和连线应受 R8.4 / R8.6 / R8.8 约束。

| 拓扑元素 | R8.9 判断 | R8.10 写入提醒 |
|---|---|---|
| `L3-method-library test runner` | 作为测试入口抽象,承接 local / CI / controlled / replay 执行。 | 不写具体命令、CI job 名或 suite 名。 |
| `core-contracts` | 唯一 compile dependency candidate。 | 连线标 `[compile]`;不得扩展到其他 sibling repo。 |
| fake / in-memory stores | `local-dev`、`ci-test` P0 支撑。 | 连线标 `[runtime]` 或 `[local-tool]` 视用途;不得写真实 DB 产品。 |
| controlled resolver / publisher / handoff seam | `integration-like` 支撑 unavailable / degraded / failed mapping。 | 连线标 `[runtime]` / `[event]`;只证明 seam semantics。 |
| event fixture / fake publisher / event replay | `ci-test`、`integration-like`、`operations-replay` 支撑 event 协作。 | 连线标 `[event]` 或 `[replay]`;不得用 broker ack 证明 truth。 |
| replay material / report / checkpoint refs | `operations-replay` 支撑 job semantics。 | 连线标 `[replay]`;不写 artifact path/schema。 |
| redaction / dependency / metric guard | `ci-test` local tool candidate。 | 连线标 `[local-tool]`;不替代 formal evidence schema。 |
| staging / production future deps | P1/P2 direction。 | 可作为 future direction 注释,不进入 P0 pass 拓扑主链。 |

### 4. 不可用处理思考

R8.10 需要把不可用裁决写成总表,覆盖 profile、依赖服务、marker/source、P0 pass 资格和后续处理。

| 不可用场景 | R8.9 裁决 | R8.10 写入提醒 |
|---|---|---|
| `local-dev` 无法装配 fake / in-memory / safe diagnostic | 本地 sanity 不通过,不能作为 release evidence。 | 标为 local support failure;不影响 CI 但不得伪 pass。 |
| `ci-test` fake store / fixture / fixed clock/id / redaction guard 不可用 | P0 fail-fast / test fail-fast。 | 不允许 silent fallback 或跳过阻断用例。 |
| `integration-like` controlled resolver / publisher / handoff 不可用 | 若是预期场景,必须断言正式 degraded / unavailable / failed marker;若非预期则失败。 | 只允许预期场景 pass;marker/source 缺失停审。 |
| `operations-replay` replay root / report root / checkpoint store 不可用 | replay job rejected / test fail-fast;不得修 truth。 | replay root 未去标识视为 rejected。 |
| required store / adapter / target 缺失 | startup fail-fast 或 job-run-start rejected。 | 不得 fallback 到 fake,特别是 selected controlled / future production-like。 |
| optional read / material / diagnostic unavailable | 可 degraded / unavailable,但只复制正式 marker/source。 | source missing 不可通过。 |
| `staging-like` / `production-like` unavailable | 只记 P1/P2 residual / selected-run unavailable。 | 不计入 P0 pass,不阻断当前 Step 8 closure。 |

### 5. 跨环境 / 配置审计思考

R8.10 需要把审计表写成 Step 8 的收口检查,确保前面矩阵没有互相冲突。

| 审计项 | R8.9 判断 | R8.10 结论候选 |
|---|---|---|
| P0 profile 是否可定位 | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 已分别定位。 | pass candidate。 |
| P1/P2 是否被隔离 | `staging-like`、`production-like` 只作 future direction。 | pass candidate。 |
| path dependency 是否越界 | R8.6 已限定只有 `core-contracts`。 | pass candidate。 |
| runtime/event/replay 是否有替身策略 | fake、controlled、event fixture、replay 已定位。 | pass candidate。 |
| fixture / replay 是否污染 staging / production | R8.8 禁止 staging/production fixture / fake / replay override。 | pass candidate。 |
| marker/source 缺口是否被环境补口 | R8.6 / R8.8 均要求 source missing 停审。 | pass candidate。 |
| raw secret/body 是否可能进入输出 | R8.8 已要求 dummy corpus only、fail-closed、body-free。 | pass candidate。 |
| Step 9/13 是否被提前写入 | R8.4~R8.8 均后移 CI suite、required check、evidence schema。 | pass candidate。 |
| 正式 `05` 是否被提前修改 | 当前仍只写中间产物。 | pass candidate。 |

### 6. Step 8 closure 思考

R8.10 完成后,Step 8 应能证明:

1. P0 自动化和手动 support 环境均可定位。
2. profile / config domain 能定位到测试影响,但没有新增 key、env、CLI selector 或 schema。
3. compile / runtime / event / replay / local tool 的依赖类型清晰,且只有 `core-contracts` 允许 path dependency candidate。
4. P0 不可用、配置非法、fixture 缺失和 marker source 缺失不会伪装通过。
5. `staging-like` / `production-like` 只作为 P1/P2 direction,不阻塞当前 P0。
6. CI suite / script / required check 仍留 Step 9;artifact / report / evidence schema 仍留 Step 13。

### 7. R8.10 写入边界

R8.10 可以写入:

1. 环境拓扑图,使用 ASCII 图并标注 `[compile]`、`[runtime]`、`[event]`、`[replay]`、`[local-tool]`。
2. 不可用处理总表。
3. 跨环境 / 配置审计表。
4. Step 8 completed stop-review 和 Step 9 进入门禁。

R8.10 禁止写入:

1. CI suite、执行脚本、required check、run id 参数、artifact root 参数或 config profile 参数;这些留 Step 9。
2. evidence ID 正式化、artifact path、report path、JSON schema、generated_from 链;这些留 Step 13。
3. 新增 config key、env key、CLI selector、adapter product、secret provider、topic、port、mapper、marker source、state 或 schema。
4. 修改正式 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 或 implementation code。

### 8. R8.9 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只思考 topology / unavailable / audit | pass |
| 是否参考 L1-governance Step 8 框架但未复制领域事实 | pass |
| 是否明确拓扑图只能表达测试依赖和协作方式 | pass |
| 是否明确 P0 不可用不得伪 pass | pass |
| 是否明确 P1/P2 unavailable 只记 residual | pass |
| 是否规划跨环境 / 配置审计和 Step 8 closure | pass |
| 是否未写最终拓扑图、不可用表、审计表、CI suite 或 evidence schema | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.10 topology / unavailable / audit:再写入`;只允许写环境拓扑图、不可用处理总表、跨环境 / 配置审计表、Step 8 completed stop-review 和 Step 9 进入门禁;不得写 CI suite、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

---

## R8.10 topology / unavailable / audit:再写入

### 1. 当前模块写入目标

`R8.10` 将 `R8.9` 已确认的 topology / unavailable / audit 判断写成 Step 8 收口内容。它只固定环境拓扑表达、不可用处理、跨环境 / 配置审计和 Step 9 进入门禁。

当前模块不写 CI suite、执行脚本、required check、artifact / report 路径、evidence schema、验收标准、实施计划或正式 `05-测试方案.md`。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R9.1 |
| 用户确认 | 已确认从 `R8.9` 推进到 `R8.10`。 |
| 当前允许 | 写环境拓扑图、不可用处理总表、跨环境 / 配置审计表、Step 8 completed stop-review 和 Step 9 进入门禁。 |
| 当前禁止 | 写 CI suite / script / required check;artifact path;report path;evidence schema;验收标准;实施计划;正式 `05-测试方案.md`;新增 config key / env key / CLI selector / marker source。 |

### 2. 环境拓扑图: L3-method-library P0 测试依赖

```text
                         [L0-core / core-contracts]
                                   ^
                                   | [compile]
                                   |
[local-dev / ci-test / integration-like / operations-replay test runner]
        | [runtime]                         | [runtime]
        v                                   v
[runtime builder + validated profile]   [fake / in-memory / temp stores]
        | [runtime]                         |
        v                                   v
[fake / controlled adapters]          [read material / replay / report refs]
        | [runtime/event]                   |
        v                                   v
[fake publisher / event fixture]      [redaction / dependency / metric guards]
        | [event/replay]                    | [local-tool]
        v                                   v
[event replay / handoff refs]         [safe diagnostic capture]

External sibling projects and future products:
  L0-bus / L1-process / L1-identity / L1-governance /
  L1-artifact or archive / L2-runtime / L2-member-images / L6-marketplace /
  durable DB / broker / secret provider
  -> [runtime/event/replay only through safe refs, fixtures, fakes, controlled seams, replay refs]
  -> no [compile] dependency except L0-core / core-contracts
```

关键说明:

- `L0-core` / `core-contracts` 是唯一允许的 compile dependency candidate。
- 其他 sibling repo 在 P0 中只能通过 safe refs、fixtures、fake adapters、controlled seams、event replay 或 replay refs 协作。
- P0 不要求真实 DB、真实 broker、secret provider、external product 或 production endpoint。
- Redaction、dependency 和 metric guards 属于 local tool / test support,不替代正式 evidence schema。
- CI suite、脚本、required check 和 artifact / report 归档在 Step 9 / Step 13 再定义。

### 3. 不可用处理总表

| 环境 / 依赖 | 不可用场景 | Step 8 裁决 | 是否可记 P0 pass |
|---|---|---|---|
| `local-dev` fake / in-memory / safe diagnostics | 本地装配失败或 fake wiring 缺失。 | local sanity failed;不作为正式 release evidence。 | 否。 |
| `ci-test` fake store / fixture / fixed clock/id | deterministic fixture 缺失、fake store 不可用、clock/id 非法。 | P0 fail-fast / test fail-fast。 | 否。 |
| `ci-test` redaction / dependency / metric guard | guard 缺失或输出 unsafe。 | P0 fail-fast;不得跳过阻断项。 | 否。 |
| `integration-like` controlled resolver / publisher / handoff | 预期 unavailable / failed / degraded 场景。 | 仅当断言正式 marker/source 或 safe issue/ref 时可通过。 | 仅预期场景可通过。 |
| `integration-like` unexpected adapter unavailable | 非预期 seam unavailable。 | test failed;不得 silent fallback 到 fake。 | 否。 |
| `operations-replay` replay root / report root / checkpoint store | replay root missing、非去标识、checkpoint/report refs 不可读。 | replay job rejected / test fail-fast;不得修 core truth。 | 否。 |
| required store / adapter / target | startup required binding 缺失或 wrong kind。 | startup fail-fast 或 job-run-start rejected。 | 否。 |
| optional read material / resolver / diagnostic sink | optional surface unavailable。 | degraded / unavailable 只复制正式 marker/source;source missing 停审。 | 仅正式 marker/source 存在时可通过。 |
| publisher / handoff target | failed / pending / blocked。 | accepted truth 不回滚;记录 failed / pending / report issue。 | 仅对应负向 / seam 用例可通过。 |
| `staging-like` | selected-run unavailable。 | 记录 P1/P2 residual / selected-run unavailable。 | 不计 P0 pass。 |
| `production-like` | 当前未准备或未来产品不可用。 | 记录 future risk;当前不执行。 | 不计 P0 pass。 |

### 4. 跨环境 / 配置审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| P0 profile 是否可定位 | pass | `local-dev`、`ci-test`、`integration-like`、`operations-replay` 已在 R8.4 / R8.8 定位。 |
| P1/P2 profile 是否隔离 | pass | `staging-like`、`production-like` 只作 future direction,不阻塞当前 P0。 |
| compile dependency 是否越界 | pass | 只有 `L0-core` / `core-contracts` 允许 path dependency candidate。 |
| runtime / event / replay 是否有替身策略 | pass | fake、controlled、event fixture、event replay、replay refs 已定位。 |
| 是否把真实 DB / broker / secret provider 写成 P0 前置 | pass | durable DB / broker / secret provider 均为 P1/P2 future product。 |
| fixture / replay 是否污染 staging / production | pass | R8.8 明确 staging / production 禁止 fixture、fake override 和 replay override。 |
| marker/source 缺口是否被环境补口 | pass | source missing 必须停审,不得由 fixture、环境或 fake 合成 marker。 |
| raw secret/body 是否可能进入输出 | pass | R8.8 固定 dummy corpus only、fail-closed、body-free,不得使用真实 secret/body。 |
| Step 9 内容是否被提前定义 | pass | 未写 CI suite、script、required check、run id、artifact root 或 config profile 参数。 |
| Step 13 内容是否被提前定义 | pass | 未写 evidence ID 正式化、artifact path、report path、JSON schema 或 generated_from 链。 |
| 正式 `05-测试方案.md` 是否被提前修改 | pass | Step 8 仍只更新中间产物。 |
| 旧 `05/06/07` 是否反向定义当前环境 | pass | 旧材料只作 historical / old direction input。 |

### 5. Step 8 completed stop-review

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否完成 Step 8 planned R8.x 模块 | pass | R8.1~R8.10 均已完成。 |
| 是否输出环境矩阵 | pass | R8.4 已写入六 profile 环境矩阵。 |
| 是否输出测试依赖类型与协作方式判定表 | pass | R8.6 已写入依赖对象、类型、path dependency 许可和禁止事项。 |
| 是否输出 profile 配置矩阵 | pass | R8.8 已写入 profile 配置矩阵和 config domain 测试影响表。 |
| 是否输出环境到 DS family 分配矩阵 | pass | R8.8 已写入 DS family 到 profile 分配,未重写 81 条 DS 明细。 |
| 是否输出环境拓扑图 | pass | 本模块已写入 P0 测试依赖拓扑图。 |
| 是否明确环境不可用处理 | pass | 本模块已写入不可用处理总表。 |
| 是否完成跨环境 / 配置审计 | pass | 本模块已写入审计表,无 unresolved 冲突。 |
| 是否未新增 config key、env key、CLI selector、secret provider、adapter product、topic、port、mapper、marker source 或 schema | pass | Step 8 全程只写 profile、domain、family 和协作方式。 |
| 是否未把 runtime/event/replay 依赖写成 Cargo path dependency | pass | 只有 `core-contracts` 是 compile dependency candidate。 |
| 是否未写 CI suite、脚本、artifact path、report path、evidence schema、验收 gate 或实施计划 | pass | 这些分别后移 Step 9 / Step 13 / 后续文档。 |
| 是否未修改正式 `05-测试方案.md` | pass | 正式 05 留 Step 15 装配。 |

### 6. Step 9 进入门禁

| 门禁项 | 裁决 |
|---|---|
| Step 8 是否完成环境矩阵、依赖判定、profile 配置矩阵、数据策略、拓扑图、不可用处理和跨环境审计 | pass |
| P0 自动化和人工 support 环境是否可定位 | pass |
| P0 不可用 / 配置非法 / fixture 缺失 / marker source missing 是否禁止伪 pass | pass |
| CI suite / script / required check 是否仍未定义,可交给 Step 9 | pass |
| artifact / report / evidence schema 是否仍未定义,可交给 Step 13 | pass |
| 是否未修改正式 `05-测试方案.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.1 automation / gates:先思考`;只允许创建 / 更新 `design-calibration/05_test_plan_step_09_automation_gates.md`,读取 Step 1~8 中间产物、正式 `00`~`04`、SOP Step 9、测试方案书写规范 §5.9,思考自动化与 CI/CD 门禁的输入边界、suite family、gate 分层、run 参数、redaction / dependency / report audit 后移边界和 `R9.2 automation / gates:再写入` 边界;不得直接修改正式 `05-测试方案.md`;不得写 evidence schema、验收标准、实施计划或 implementation code。
