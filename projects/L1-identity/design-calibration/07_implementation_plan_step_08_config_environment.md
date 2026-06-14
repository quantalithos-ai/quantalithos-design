# Step 8. 定义配置、环境与外部依赖准备

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 8
> 回填章节: `07-实施计划.md` §8 配置、环境与外部依赖准备

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 定义配置、环境与外部依赖准备 |
| 当前状态 | 已完成,按用户授权自动进入后续 Step |
| 输入基线 | Step 7 gate matrix、正式 `04` profile / adapter / config failure、正式 `05` environment / artifact / report、依赖裁剪标准 |
| 输出文件 | `projects/L1-identity/design-calibration/07_implementation_plan_step_08_config_environment.md` |
| 正式文档状态 | 本 Step 不修改正式 `07-实施计划.md` |
| 停审方式 | 每个模块先思考、再写入、再局部停审;全部模块完成后做 profile / adapter / dependency / artifact root 跨表审计 |

## 2. 本步目标

本 Step 把 `04-配置设计.md`、`05-测试方案.md`、Step 5 phase、Step 6 commit boundary 和 Step 7 gate 嵌入实施前配置、环境与外部依赖准备。

本 Step 只回答:

- 实施前和各阶段前必须准备哪些 profile、adapter mode、配置来源、脚本目录和输出根目录。
- 哪些本地 sibling repo 是编译期依赖,哪些只能作为运行期 / 事件协作依赖。
- fake / controlled / endpoint / disabled adapter 分别允许在哪些 profile、phase 和 gate 中使用。
- 外部依赖不可用时应暂停、使用正式 fake / controlled seam,还是记录 residual。
- `artifacts/test/<run_id>`、`reports/runs/<run_id>` 和 `reports/acceptance/*` 如何在实施前准备。
- 哪些配置或依赖失败不得被 degraded、fallback 或静态证据掩盖。

本 Step 不新增 config key、entry flag、job input schema、adapter constructor、port、DTO、artifact JSON 字段或 evidence schema。若实施时发现 `04/05/06/07` 未闭合到可落码配置或证据字段,必须暂停并回写对应设计基线。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `实施计划讨论流程_SOP.md` Step 8 | 当前标准 | 提供配置、环境、外部依赖和 fake / mock 策略讨论问题 |
| `实施计划书写规范.md` §5.8 | 当前标准 | 提供外部依赖准备表和运行期依赖不得混入 path dependency 的写法 |
| `子项目目录与代码文件组织规范.md` | 当前标准 | 提供实现仓、workspace、scripts、artifacts 和 reports 目录规则 |
| `全局项目依赖关系与裁剪规则.md` | 当前标准 | 提供编译期 / 运行期 / 事件协作依赖分类 |
| `07_implementation_plan_step_05_phases_dependencies.md` | 已完成 | 提供 PH-01~PH-08 阶段顺序和阶段依赖 |
| `07_implementation_plan_step_06_tasks_commit_boundaries.md` | 已完成 | 提供 commit-01-a 到 commit-08-c 边界和 PH-08-a/b/c 配置收口 |
| `07_implementation_plan_step_07_test_acceptance_gates.md` | 已完成 | 提供 GATE-01~12、suite、artifact/report root 和失败处理 |
| `04-配置设计.md` | Draft / Step 15 已审核通过 | 提供 profile、adapter mode、配置来源优先级、严格 JSON、敏感边界和 failure 策略 |
| `04_config_step_05_sources_priority_conflicts.md` | 已审核通过 | 提供配置来源优先级和冲突处理 |
| `04_config_step_06_environment_profiles_matrix.md` | 已审核通过 | 提供 P0 profile 和 P1/P2 profile 边界 |
| `04_config_step_07_config_items.md` | 已审核通过 | 提供正式配置项来源,本 Step 只引用不新增 |
| `04_config_step_08_sensitive_secrets.md` | 已审核通过 | 提供 raw material 禁止进入 config / report / artifact 的边界 |
| `04_config_step_09_loading_validation_activation.md` | 已审核通过 | 提供 strict JSON、startup、job-run-start、entry-local 生效规则 |
| `04_config_step_11_failure_degradation.md` | 已审核通过 | 提供 fail-fast、fail-closed、reject-run 和 degraded 禁用口径 |
| `04_config_step_12_downstream_handoff.md` | 已审核通过 | 提供 `05/06/07/09` 承接项 |
| `05-测试方案.md` | Draft / Step 15 assembled | 提供 profile test matrix、P0 suite、artifact/report root 和 no static evidence 规则 |
| `05_test_plan_step_09_automation_gates.md` | 已审核通过 | 提供 gate/report/check 脚本、参数方向和输出路径 |
| `05_test_plan_step_13_evidence.md` | 已审核通过 | 提供 raw artifact / report / evidence index 路径与字段来源 |

## 4. 模块计划 / 模块目录

| 模块 | 目标 | 输入 | 输出 | 停审门禁 |
|---|---|---|---|---|
| M1 Step 8 规则与边界 | 固定本 Step 只做准备表,不新增配置或 schema | SOP Step 8、书写规范 §5.8、`04` 边界 | Step 8 写作规则、禁止事项、模块执行口径 | 不把配置准备写成新 runtime schema |
| M2 profile 准备矩阵 | 固定 P0 profile 与 P1/P2 非阻断边界 | `04` §6、`05` environment matrix | profile 准备表、profile 到 gate 映射 | 不把 adapter mode 写成 profile |
| M3 adapter mode 使用边界 | 固定 fake / controlled / endpoint / disabled 的使用阶段 | `04` adapter mode、Step 7 gate | adapter mode 准备表和失败处理 | fake / disabled 不得默认成功 |
| M4 本地仓库与依赖裁剪 | 明确 compile/runtime/event 依赖和本地 path baseline | 依赖裁剪规则、`03` file layout、Step 6 PH-01 | sibling repo 依赖准备表 | 非编译期依赖不得进入 Cargo path dependency |
| M5 config source / redline 准备 | 固定 strict JSON、来源优先级、entry-local/job-run-start 和敏感边界 | `04` Step 5/7/8/9/11 | config check table、failure table | invalid high-priority config 不 fallback |
| M6 scripts / artifacts / reports root 准备 | 固定 gate/report/check 脚本目录和 run-scoped 输出 | Step 7、`05` Step 9/13 | scripts/root 准备表 | 禁止 `latest`,禁止静态 pass |
| M7 phase / boundary 环境矩阵 | 把 PH-01~PH-08 和 commit boundary 映射到 profile / adapter / dependency 准备 | Step 5~7、M2~M6 | phase 和 commit environment matrix | 每个 phase 的准备项不与门禁冲突 |
| M8 不可用处理与跨表停审 | 汇总外部依赖不可用、配置失败、profile 越界和进入 Step 9 条件 | M1~M7 | blocker/residual 规则、跨表审计、回填草稿 | 无 unresolved 配置 / 依赖准备缺口 |

### 4.1 模块思考与写入记录

| 模块 | 思考重点 | 写入位置 | 局部停审结论 |
|---|---|---|---|
| M1 | Step 8 是准备层,不能补 `04` 未定义的 key、entry 参数或 adapter schema | §8.1~§8.2 | 通过 |
| M2 | P0 profile 只有 `local-dev`、`ci-test`、`integration-like`、`operations-replay`;`staging-like` / `production-like` 不作 P0 must-pass | §8.3 | 通过 |
| M3 | adapter mode 是装配选择,不是环境;fake/controlled/disabled 都必须暴露正式失败或 unavailable surface | §8.4 | 通过 |
| M4 | `L0-core` 是唯一编译期依赖候选;事件和外部来源只能走 port / adapter / event / handoff / fake | §8.5~§8.6 | 通过 |
| M5 | strict JSON、source priority、entry-local 不覆盖 global startup config、raw material 禁止入配置 | §8.7~§8.9 | 通过 |
| M6 | gate/report/check 脚本和 artifact/report root 必须 run-scoped;`reports/acceptance/*` 只作初稿 + 审查补充 | §8.10 | 通过 |
| M7 | phase 环境准备必须跟 Step 6/7 boundary 对齐,避免 PH-08 才发现 lower suite 不能产证 | §8.11~§8.12 | 通过 |
| M8 | 外部依赖不可用要有暂停 / fake / residual 规则;不能留给实现者临场判断 | §8.13~§8.16 | 通过 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些外部服务或仓是实施前置依赖? | 本地实现仓 `/home/aris/Projects/quantalithos-identity`、编译期候选 `/home/aris/Projects/quantalithos-core`、Rust toolchain、gate/report/check 脚本目录和 run-scoped artifact/report 根目录是实施前置。运行期外部来源、event bus、handoff、audit 和 resolver 均通过正式 adapter / fake / controlled seam 准备,不作为业务仓源码依赖。 |
| 哪些依赖只在特定阶段需要? | PH-01 需要 workspace 和 `L0-core` dependency baseline;PH-03 需要 fake runtime / config foundation;PH-04~PH-06 需要 role/work/memory/archive/basis 等 resolver fake 或 controlled seam;PH-07 需要 operations-replay roots、publisher/handoff fake/controlled seam;PH-08 需要 config redline、scripts、artifact/report writer 和 release profile 装配。 |
| 哪些配置项必须在本地或 CI 环境准备? | `profile.name`、store mode、role source mode、publisher mode、topic map ref、projection/report roots、operations replay input/report refs、external refs mode、audit sink mode、redaction profile、fixture/fixed clock/id 等必须按 `04` 准备;本 Step 不新增 key。 |
| 是否允许 fake / mock,允许到什么阶段为止? | P0 允许正式 fake / controlled adapter,但 fake 只能在 `local-dev`、`ci-test` 和明确允许的 replay 场景使用。`integration-like` 必须验证 controlled seam、no fake fallback 和 failure mapping。endpoint / real-like 只作 P1/P2 或 selected-run,不作为 P0 pass 前置。 |
| 外部依赖不可用时是暂停、降级还是替代? | 编译期依赖不可用暂停对应 phase。运行期 / 事件协作依赖若 `04/05` 允许 fake/controlled/disabled,则使用正式替身并记录 adapter mode;若 required ref 缺失或 endpoint enabled 但无 ref,按 fail-fast / reject-run,不得 degraded 掩盖。P1/P2 endpoint 不可用只记录 residual,不阻断 P0。 |
| 哪些依赖需要由其他团队或仓提供? | `L0-core` 提供编译期 shared contracts;event bus、method source、work source、basis resolver、memory/archive、artifact/evidence、audit/observability、archive/handoff target 都是运行期或事件协作提供方,但 P0 通过正式 fake/controlled/ref-only seam 验证。 |
| 已实现仓库依赖是否已经在 `/home/aris/Projects` 下存在? | 本 Step 固定检查路径和处理规则,不在设计仓裁决实际机器状态。实现前必须检查 `/home/aris/Projects/quantalithos-identity` 和 `/home/aris/Projects/quantalithos-core`;缺失时按 §8.5 处理。 |
| 哪些依赖是编译期依赖,Cargo 本地 path dependency 写法是否已经与详细设计一致? | 只有 `L0-core` shared contracts 是编译期依赖候选,在实现仓 root `[workspace.dependencies]` 使用 local path。bus、method、work、basis、memory/archive、artifact、observability、runtime 和 downstream consumers 不得进入 Cargo path dependency。 |
| 哪些依赖是运行期依赖或事件协作依赖,应该使用 API / SDK / adapter / event / projection / fake? | role/capability source、work source、basis resolver、memory/archive resolver、artifact/evidence resolver、publisher/event bus、handoff target、audit sink、observability 和 downstream consumers 均属于运行期 / 事件协作,必须走 application port、infra adapter、event envelope、handoff marker、projection/report 或 fake/controlled seam。 |

## 6. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 5 | phase 说明了 PH-08 收口 config/scripts/evidence,但未列每个 phase 的 profile / adapter 前置 | 本 Step 增加 phase 环境准备矩阵 |
| Step 6 | commit boundary 有 config binding 和 artifact materialization 复核,但未列实际准备项 | 本 Step 对 commit-08-a/b/c 和前序 boundary 补准备清单 |
| Step 7 | GATE 已绑定 suite/report,但未给 profile 和 artifact root 准备规则 | 本 Step 绑定 profile、script path 和 run-scoped roots |
| `04` | 配置项完整,但实施计划需要按 phase 解释何时需要哪些配置 | 本 Step 不复制所有 key,只抽实施前检查表 |
| `05` | automation/evidence 已定义脚本和输出,但实施前目录准备未汇总 | 本 Step 写 scripts / artifacts / reports 准备表 |
| 依赖裁剪 | 架构和详细设计已有依赖红线,但实施计划需显式写本地 path 和不可用处理 | 本 Step 写 compile/runtime/event 分类和处理 |

## 7. 改动前后对比

| 议题 | Step 8 前 | Step 8 后 | 作用 |
|---|---|---|---|
| profile | 分散在 `04/05` | P0 / P1P2 profile 准备矩阵 | 实现前不会把 `staging-like` 当 P0 gate |
| adapter mode | 配置设计已有枚举 | 按 phase / suite 说明 fake、controlled、endpoint、disabled | 防止 fake fallback 或 disabled fake success |
| external dependency | 架构和详细设计有裁剪红线 | 明确 compile/runtime/event 和本地路径 | 防止 runtime 仓进入 Cargo dependency |
| config source | `04` 已定义来源优先级 | 实施检查表化 | 防止 high-priority invalid fallback |
| scripts/root | `05` 已定义路径 | 实施前准备表和 boundary 入口 | 防止 report 脚本放进 `reports/` 或使用 `latest` |
| unavailable handling | 分散于 `04/05/06` | 统一为 pause / formal fake / reject-run / residual | 不把不可用留给实现者现场裁决 |

## 8. 设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否把所有 `04` config key 复制进实施计划 | A. 复制完整配置项;B. 只列实施前检查项并引用 `04` | 采用 B。实施计划不成为第二份配置 schema。 |
| P0 是否要求真实 endpoint | A. 要求真实 endpoint;B. 使用 fake / controlled seam,endpoint 留 P1/P2 | 采用 B。`05` 明确 P0 不要求真实产品依赖。 |
| adapter mode 是否可以当 profile | A. profile = fake/test/staging;B. profile 与 adapter mode 分离 | 采用 B。`fake`、`controlled`、`endpoint`、`disabled` 是 adapter mode。 |
| runtime/event 依赖是否可写 path dependency | A. 为联调方便写 path;B. 只允许编译期依赖 path | 采用 B。依赖裁剪标准和 `03` 均要求 runtime/event 通过正式边界协作。 |
| scripts/report 是否在 PH-08 才考虑 | A. PH-08 才准备;B. Step 8 先列准备,PH-08 实现 | 采用 B。路径和参数必须提前固定,实现仍在 PH-08。 |
| external unavailable 是否用 degraded 一概处理 | A. degraded;B. 按配置失败类型 fail-fast / fail-closed / reject-run / residual | 采用 B。非法配置和 required dependency 不得 degraded 掩盖。 |

## 9. 结构化中间产物

### 9.1 Step 8 写作规则

| 规则 | 说明 | 失败处理 |
|---|---|---|
| 不新增配置项 | 所有 key、mode、source、failure strategy 来自 `04` | 发现缺口暂停并回写 `04` |
| 不新增脚本参数 schema | gate/report/check 参数来自 `05` Step 9 / Step 13 | 发现缺口暂停并回写 `05` |
| 不新增 artifact JSON 字段 | raw artifact / evidence index 字段来自 `05` Step 13 | 发现缺口暂停并回写 `05/06` |
| 不新增 dependency 关系 | 依赖关系只从 `01/03` 和全局裁剪规则裁剪 | 发现新增依赖暂停并回写 `01/03/07` |
| 不用 `latest` | 所有 artifact/report 绑定 `<run_id>` | 任何 `latest` 输入或输出阻断 gate |
| 不让 fake 私有补口 | fake 只能实现正式 port / adapter / state / report surface | fake 私有 map 或默认成功阻断提交 |

### 9.2 实施前配置环境总检查表

| 检查项 | 必须准备 | 检查方式 | 不通过处理 |
|---|---|---|---|
| 目标实现仓 | `/home/aris/Projects/quantalithos-identity` | 检查目录、git worktree、workspace root | 暂停 PH-01,不得在设计仓写实现代码 |
| 编译期 sibling repo | `/home/aris/Projects/quantalithos-core` | 检查目录、Cargo metadata、shared contracts crate | 暂停 dependency boundary,不得替换为业务 sibling path |
| Rust workspace | 7 crate skeleton 方向:contracts/domain/application/infra/api/worker/jobs | `Cargo.toml`、crate name、dependency direction | 暂停 commit-01-a |
| profile selector | `local-dev` / `ci-test` / `integration-like` / `operations-replay` | strict config parse + profile validation | invalid fail-fast |
| config file | strict JSON only | parser reject comment/trailing comma/duplicate key | startup fail-fast |
| environment override | only non-sensitive override or opaque refs | source priority test | invalid high-priority value fail-fast |
| entry-local parameters | run id、page cursor、dry-run selector、current job input where allowed | entry validator | invalid reject current entry/run |
| scripts directory | `scripts/gates/`,`scripts/reports/`,`scripts/checks/` | path and executable check | PH-08-b 不得完成 |
| artifact root | `artifacts/test/<run_id>` | gate runner / writer path check | 缺失或 `latest` 阻断 |
| run report root | `reports/runs/<run_id>` | report generator output check | 缺失或非 artifact 推导阻断 |
| acceptance reports | `reports/acceptance/*` | script draft + human / Agent review | 未审查不得宣称送验完整 |
| redaction profile | `identity-safe` | config-redline + redaction scan | unsafe profile fail-fast |

### 9.3 Profile 准备矩阵

| Profile | P0 角色 | 允许 store / adapter 方向 | 必备准备 | 主要 gate | 失败处理 |
|---|---|---|---|---|---|
| `local-dev` | 本地开发和手动 smoke | in-memory、fake、disabled、local audit | optional local config、fake refs、local run id | 非正式手动检查 | 不作为 release evidence |
| `ci-test` | P0 deterministic 自动化基础 | isolated in-memory、deterministic fake、fixed clock/id | fixture refs、captured audit、redaction scan、run namespace | `contract-domain-fast`;`service-flow-fast`;`infra-runtime-fake`;`config-redline` | 任一装配失败不得 fallback,gate failed |
| `integration-like` | controlled seam 与 failure mapping | controlled resolver/publisher/handoff、in-memory or durable-like | endpoint/target refs as opaque refs、controlled failure profile | `entry-worker-job`;`operations-replay-core`;`redaction-boundary` | controlled seam 缺失或 fake fallback 则阻断 |
| `operations-replay` | replay、job、report 和 stored replay | replay state store、fake/controlled adapters、report/input refs | `run_id`、de-identified input root ref、report root ref、pending material | `operations-replay-core`;`report-generation-audit`;release subset | raw body 或 replay root 缺失则 reject-run |
| `staging-like` | P1/P2 dry-run 方向 | future durable / real-like | future provider refs | `p1-real-like-selected-run` only | 不阻断 P0;缺环境记录 residual |
| `production-like` | P1/P2 production 方向 | approved products | production ops material | future only | 不作为当前 P0 证据 |

### 9.4 Adapter mode 使用边界

| Adapter mode | 含义 | 允许 profile / phase | 不允许做法 | 不可用时处理 |
|---|---|---|---|---|
| `fake` | 正式 port 的 deterministic test implementation | `local-dev`,`ci-test`,部分 `operations-replay` replay fixture | 不得默认 valid / delivered / published,不得私造 schema 或 private map | fake 不满足正式 port 时暂停设计闭口 |
| `controlled` | 可注入成功、unavailable、invalid、retryable、permanent 等 outcome 的 seam | `integration-like`,`operations-replay`,部分 main/release gate | 不得回退 fake success,不得吞掉 failure class | 缺 controlled case 时 gate failed |
| `endpoint` | 真实或 real-like endpoint ref 装配 | P1/P2 或 explicit selected-run;P0 不要求生产 endpoint | 不得用 endpoint 不可用伪装 P0 fail/pass | P0 记录 residual;P1 selected-run unavailable |
| `disabled` | 显式不可用或不启用外部能力 | optional external refs、local/CI no external product | 不得返回 fake success,不得隐藏 required missing | required path disabled 时 fail-fast / reject-run |

### 9.5 本地仓库与依赖裁剪表

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-identity` | repo | 不适用 | PH-01+ | identity 实现仓 | 检查目录、git status、workspace layout | 暂停实现,不得在设计仓代写代码 |
| `/home/aris/Projects/quantalithos-core` | repo / crate | 编译期依赖 | PH-01+ | `L0-core` | 检查 `Cargo.toml`、shared contracts crate、path dependency | 暂停 dependency boundary;不得替换为业务仓源码 |
| event bus | service / event collaboration | 事件协作依赖 | PH-06~PH-07 | `L0-bus` / fake publisher | topic map fixture、publisher adapter test、outbox replay | P0 用 fake/controlled seam;required topic missing fail-fast |
| role / capability source | external source | 运行期依赖 | PH-04~PH-06 | method source provider / fake resolver | safe summary fixture、source version、controlled unavailable case | fake/controlled;endpoint unavailable 不阻断 P0 |
| basis resolver | external source | 运行期依赖 | PH-04 | external basis provider / controlled resolver | basis summary fixture、high-risk missing basis negative case | high-risk action fail-closed;不得 bypass |
| work source | external source | 运行期 / 事件协作依赖 | PH-04~PH-06 | work source provider / fake consumer | work source marker、safe summary、consumer event fixture | fake/controlled;missing target no-create |
| memory / archive source | external source / handoff | 运行期依赖 | PH-04~PH-07 | memory/archive provider / handoff adapter | ref-only fixture、handoff receipt marker、controlled failure | fake/controlled/disabled;raw body reject |
| artifact / evidence source | external source | 运行期依赖 | PH-04~PH-08 | artifact/evidence provider / resolver | evidence ref fixture、disabled mode check | disabled allowed where optional;enabled missing ref fail-fast |
| audit / observability sink | external service | 运行期依赖 | PH-03~PH-08 | local/captured/controlled sink | redaction scan、safe issue ref、compensation marker | sink unavailable uses formal compensation if defined;raw log reject |
| durable store product | infrastructure | 运行期依赖 | P1/P2 | future operator | not P0 | 不阻断 P0;不得把 durable product 写成 P0 must-pass |

### 9.6 依赖类型分类与 Cargo 边界

| 依赖类型 | 允许进入 Cargo path dependency | L1-identity 本轮对象 | 实施处理 |
|---|---|---|---|
| 编译期依赖 | 是 | `L0-core` shared contracts only | root `[workspace.dependencies]` 固定 local path,由 `GATE-01` 检查 |
| 运行期依赖 | 否 | role source、basis resolver、work source、memory/archive、artifact/evidence、audit sink | application port + infra adapter + config binding + fake/controlled test |
| 事件协作依赖 | 否 | event bus publish / consume、outbox propagation、downstream read consumption | event envelope、publisher adapter、consumer envelope、projection/report |
| 不适用 | 否 | scripts、artifact/report directories、local test fixtures | 目录和 writer 按 `05` 检查,不得当业务依赖 |

禁止实现仓出现以下方向:

- `identity-*` crate 直接依赖 method、work、bus implementation、archive implementation、observability implementation 或 downstream consumer implementation。
- `identity-domain` 读取 config、adapter、repository、runtime 或 entry context。
- `identity-api`、`identity-worker`、`identity-jobs` 绕过 application facade 直接访问 repository / publisher / handoff / projection implementation。

### 9.7 配置来源与生效准备表

| 配置来源 / 生效点 | 实施准备 | 允许影响 | 不允许影响 | 失败处理 |
|---|---|---|---|---|
| code defaults | 安全默认 profile / adapter baseline | startup runtime config | truth ownership、state matrix、query no-write | 缺失为设计缺口 |
| strict JSON config file | profile、store refs、adapter modes、topic refs、job defaults | startup runtime config | raw material、alias/duplicate key | parse/validation fail-fast |
| environment variables | profile selector、non-sensitive override、opaque refs | high-priority override | raw material、低优先级 fallback | invalid high-priority fail-fast |
| entry-local parameters | run id、page cursor、dry-run selector、current job input | current entry/run only | global store、adapter、redline、truth policy | reject current entry/run |
| job-run-start config | batch、timeout、retry、scope、report/input refs | current job run only | accepted truth、stored replay、state matrix | reject current run |
| test fixture / deterministic override | fake fixture、fixed clock/id、seed refs | local-dev / ci-test / test harness | integration-like endpoint or controlled seam | profile validation fail-fast |

### 9.8 Strict config 与 redline 检查表

| Redline | 实施检查 | 失败处理 |
|---|---|---|
| runtime parser 只接受 strict JSON | config-redline case 覆盖 comment、trailing comma、duplicate key | startup fail-fast |
| ordinary config/env/job input/test fixture 只允许 opaque refs / safe selectors | redaction-boundary + config validation | fail-closed |
| raw external body / adapter response body / memory body / archive package / artifact body 不进入 config、log、audit、report、artifact | redaction scan 覆盖 artifacts and reports | `VETO-ID-003` 风险,不得提交 |
| `profile.allow_test_override` 只在 local/CI | config-redline profile isolation | fail-fast |
| disabled adapter 不返回 fake success | config-redline + service negative cases | gate failed |
| topic/target completeness required when publisher/handoff enabled | dependency / config checks | startup fail-fast 或 reject-run |
| idempotency / stored replay 不能被配置关闭 | config validation | fail-fast |

### 9.9 配置失败处理矩阵

| 失败类型 | 处理 | 是否允许继续 |
|---|---|---|
| strict JSON parse failed | startup fail-fast,no facade | 否 |
| required startup config missing | startup fail-fast | 否 |
| high-priority env invalid | 不 fallback 低优先级 | 否 |
| entry-local invalid | reject current entry | 其他入口可继续 |
| job-run-start input invalid | reject current run,不写 job report pass | 其他 run 可继续 |
| required endpoint mode missing endpoint ref | startup fail-fast 或 reject-run | 否 |
| optional external disabled | 返回正式 disabled / unavailable surface | 是,但不得 fake success |
| P1/P2 product unavailable | selected-run unavailable / residual | 不阻断 P0 |

### 9.10 Scripts、Artifacts 与 Reports 准备表

| 项 | 正式路径 / 脚本 | 实施阶段 | 准备要求 | 不通过处理 |
|---|---|---|---|---|
| gate scripts | `scripts/gates/run_ci_gate.sh`;`scripts/gates/run_release_gate.sh`;`scripts/gates/run_selected_p1_gate.sh` | PH-08-b | 支持正式 `--run-id`、`--artifact-root`、`--config-profile` 等已定义参数方向 | script dry run / report audit failed |
| report scripts | `scripts/reports/generate_reports.sh`;`build_gate_summary.sh`;`build_evidence_candidates.sh` | PH-08-b/c | 从 raw artifact 推导 run reports | 不得生成静态 pass |
| check scripts | `scripts/checks/check_redaction.sh`;`check_dependency_boundary.sh`;`check_artifact_report_pairing.sh`;`check_no_static_evidence.sh` | PH-01,PH-08-b/c | 输出 run-scoped report | failed 阻断对应 gate |
| raw artifact root | `artifacts/test/<run_id>` | all gates | 必须绑定固定 run id,不得带 project 子目录 | 使用 `latest` 阻断 |
| suite artifact | `artifacts/test/<run_id>/suites/<suite>/` | all suites | 包含 raw report、case result、stdout/stderr 和 safe artifact | missing failed/partial evidence 阻断 |
| run report root | `reports/runs/<run_id>` | all generated reports | 从 raw artifact 生成 | 缺失或不可追溯阻断 |
| acceptance reports | `reports/acceptance/handoff.md`;`veto-checklist.md`;必要时 `risk-acceptance.md` | PH-08-c | 脚本初稿 + 人 / Agent 审查补充 | 未审查不得宣称送验完整 |
| review reports | `reports/review/` | PH-08-c | 记录 review notes / agent review | 不得替代 raw artifact |

### 9.11 Phase 环境准备矩阵

| Phase | 环境 / profile 准备 | adapter 准备 | external / repo 准备 | scripts / evidence 准备 | 不可用处理 |
|---|---|---|---|---|---|
| PH-01 | local-dev or ci-test compile baseline | 不需要业务 adapter | `quantalithos-identity`;`quantalithos-core` | dependency check output direction | repo/core 缺失暂停 |
| PH-02 | ci-test contract/domain baseline | 不需要 runtime external adapter | core contracts dependency | contract-domain-fast artifact/report direction | schema/body-free scan 失败暂停 |
| PH-03 | ci-test + local-dev runtime foundation | fake runtime、captured audit、fixed clock/id | no external product | infra-runtime-fake artifact/report direction | fake 不等价暂停设计闭口 |
| PH-04 | ci-test command service;integration-like for controlled failure where needed | role/work/memory/basis resolver fake/controlled | no path dependency to source providers | service-flow-fast + redaction direction | required basis/source 缺失 fail-closed |
| PH-05 | ci-test query service;integration-like visibility/degraded | read/projection/reference/report fake/controlled | no external write dependency | query no-write artifact/report direction | query write 或 visibility leak 暂停 |
| PH-06 | integration-like consumer/callback;operations-replay for outbound material | consumer,callback,publisher material fake/controlled | event collaboration via envelope only | entry-worker-job / operations-replay-core direction | missing target no-create 失败暂停 |
| PH-07 | operations-replay | publisher/handoff/maintenance fake/controlled | pending outbox/handoff/report/replay refs | operations-replay-core and job report direction | job 修 truth 或 report replay 失败暂停 |
| PH-08 | all P0 profiles redline;release config profile from `05` | runtime builder validates allowed modes | dependency boundary scan and no P1/P2 pollution | config-redline,report-generation-audit,release-main-smoke | final evidence 缺失不得送验 |

### 9.12 Commit Boundary 配置环境准备矩阵

| Commit boundary | 必备 profile / config | adapter / dependency 准备 | 输出准备 | 停审 |
|---|---|---|---|---|
| commit-01-a | compile baseline;project-level local paths | `L0-core` path only | dependency-boundary report direction | 无业务 config |
| commit-02-a~c | ci-test schema/domain baseline | no runtime adapter | contract-domain-fast / redaction output direction | 不读取 config |
| commit-03-a | ci-test application helper baseline | clock/id/context mapper only | application unit direction | 不接 external product |
| commit-03-b | ci-test fake runtime config direction | fake repositories/resolvers/publisher/handoff skeleton | infra-runtime-fake direction | fake only formal ports |
| commit-03-c | ci-test idempotency/replay | stored replay fake parity | replay artifact direction | duplicate 不重跑 |
| commit-04-a~c | ci-test command;integration-like failure cases where required | role/work/memory/basis controlled/fake;redaction | service-flow-fast + redaction | accepted path 不等外部 delivery |
| commit-05-a~c | ci-test query;integration-like degraded | read/projection/reference/report fake/controlled | query no-write artifacts | query 不写 |
| commit-06-a~c | integration-like worker/consumer;operations-replay material | consumer/callback/outbox material fake/controlled | entry-worker-job / outbox material artifacts | missing no-create |
| commit-07-a~c | operations-replay | job report replay,publisher/handoff/maintenance controlled outcomes | operations-replay-core reports | job no truth repair |
| commit-08-a | all P0 profile validation | runtime builder and dependency scan | config-redline + entry-worker-job | entry 不直连 repo |
| commit-08-b | report writer run config | scripts/checks no product dependency | raw artifact + run reports | no `latest`,no static pass |
| commit-08-c | release run config | all P0 gate profiles | evidence index + acceptance drafts | human / Agent review required |

### 9.13 外部依赖不可用处理总表

| 依赖 / 情况 | 允许处理 | 禁止处理 |
|---|---|---|
| 编译期 core repo 不存在 | 暂停 PH-01 / commit-01-a | 用其他业务仓或 generated local type 替代 |
| runtime source endpoint 不存在 | 用正式 fake/controlled/disabled where allowed,或 P1 residual | 让 endpoint missing 变成 fake success |
| required config ref missing | fail-fast / reject-run | fallback 到低优先级或 degraded pass |
| controlled failure fixture 缺失 | gate failed,补正式 fixture / test source | 跳过 negative case 宣称 pass |
| artifact/report root 不可写或不是 run-scoped | gate failed | 写到 `latest` 或静态 report |
| report generator 缺 raw artifact | gate failed | 手写 evidence / VETO pass |
| redaction scan 发现 forbidden material | 阻断提交并进入安全修复 | 截断日志后宣称原 gate pass |
| P1/P2 product unavailable | selected-run unavailable / residual | 当作 P0 release failure 或 P0 pass |

### 9.14 跨表审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| P0 profile 是否完整 | 通过 | `local-dev`,`ci-test`,`integration-like`,`operations-replay` 均已覆盖 |
| P1/P2 是否误入 P0 | 通过 | `staging-like`,`production-like` 只作为未来方向 |
| adapter mode 是否混成 profile | 通过 | adapter mode 独立列出 |
| compile dependency 是否只有 core | 通过 | 运行期 / 事件协作均不得 path dependency |
| fake 使用边界是否明确 | 通过 | fake 只走正式 port / fixture,不得默认成功 |
| strict config 是否闭合 | 通过 | strict JSON、source priority、entry/job 生效点和 redline 已列 |
| artifact/report root 是否闭合 | 通过 | 统一 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` |
| `latest` 是否禁止 | 通过 | 所有输出和输入都要求 fixed run id |
| reports/acceptance 责任是否明确 | 通过 | 仅脚本初稿 + 人 / Agent 审查补充 |
| phase / commit 是否均有环境准备 | 通过 | §9.11~§9.12 覆盖 PH-01~PH-08 和 commit-01-a~08-c |

## 10. 对上游 / 下游文档的影响判定

| 影响项 | 是否需要回写上游 | 说明 | 下游处理 |
|---|---|---|---|
| profile / adapter 口径 | 否 | 完全引用 `04` | Step 13 装配进正式 `07` §8 |
| config source priority | 否 | 完全引用 `04` | Step 10/11 继续用于变更控制和交付纪律 |
| dependency boundary | 否 | 引用 `01/03` 和全局裁剪规则 | Step 11 提交纪律需检查 dependency report |
| artifact/report root | 否 | 引用 `05/06/07` | Step 11/12 继续作为交付和完成判定 |
| external unavailable residual | 是,下游 | Step 9 需要把 P1/P2 endpoint、product refs 和 old repo migration cost 分类为 residual/spike | Step 9 继续处理 |

## 11. 回填草稿

> 回填目标: `07-实施计划.md` §8 配置、环境与外部依赖准备
> 正式 `07` 在 Step 13 统一装配,本节仅作为草稿。

### 11.1 配置与环境总原则

- P0 profile 固定为 `local-dev`、`ci-test`、`integration-like`、`operations-replay`。
- `staging-like` 和 `production-like` 只作为 P1/P2 方向,不作为 P0 must-pass。
- `fake`、`controlled`、`endpoint`、`disabled` 是 adapter mode,不是 profile。
- 普通配置来源优先级为 `code defaults < config file < environment variables`。
- runtime 配置只接受 strict JSON;entry-local parameters 只影响当前 entry/run;job-run-start config 只影响当前 job run。
- 普通配置、环境变量、job input、test fixture 和 report/artifact 只能包含 opaque refs、safe selectors 和 redacted digests,不得保存 forbidden material。

### 11.2 外部依赖准备

| 依赖项 | 类型 | 使用阶段 | 提供方 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|
| `quantalithos-identity` 实现仓 | repo | PH-01+ | 本项目 | 检查 `/home/aris/Projects/quantalithos-identity` | 缺失则暂停实现 |
| `quantalithos-core` shared contracts | repo / compile dependency | PH-01+ | `L0-core` | 检查 `/home/aris/Projects/quantalithos-core` 和 Cargo path | 缺失则暂停 dependency boundary |
| event bus / publisher | event collaboration | PH-06~PH-07 | event bus provider / fake publisher | topic map, publisher adapter, outbox replay | P0 用 fake/controlled;required topic missing fail-fast |
| role/work/basis/memory/archive/artifact/audit external sources | runtime dependency | PH-04~PH-08 | respective providers / fake/controlled adapters | safe ref fixtures, controlled failure, redaction scan | 按 required/optional 走 fail-fast、reject-run、disabled surface 或 residual |

### 11.3 输出目录与脚本准备

- gate scripts 放在 `scripts/gates/`。
- report scripts 放在 `scripts/reports/`。
- check scripts 放在 `scripts/checks/`。
- raw artifact root 为 `artifacts/test/<run_id>`。
- run report root 为 `reports/runs/<run_id>`。
- acceptance handoff、veto checklist 和必要 risk acceptance 位于 `reports/acceptance/`,但必须经人 / Agent 审查补充。
- 不得使用 `latest` 作为 gate 输入、artifact 路径、report 路径或 evidence 来源。

## 12. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 目标实现仓旧单 crate 到 workspace 的迁移成本 | 影响 PH-01 / commit-01-a | Step 9 作为 spike/risk 分类,但不改变当前 workspace 目标 |
| `quantalithos-core` 本地路径和 package 名是否已与实现仓一致 | 影响 dependency boundary | 实施前检查;不在设计仓猜测实际 Cargo metadata |
| PH-08-b artifact/report writer 的字段落码是否完全由 `05` Step 13 支撑 | 影响 machine artifact materialization | 当前引用 `05` 已定义字段;实现若发现缺口必须暂停 |
| selected P1 endpoint 或 real-like adapter 是否存在 | 影响 P1 residual | 不阻断 P0;Step 9 记录 residual |
| CI 环境是否已经有可执行 gate/report/check 脚本宿主 | 影响 PH-08-b | PH-08-b 才实现;当前只固定路径与参数来源 |

## 13. 进入下一步条件

| 条件 | 结论 |
|---|---|
| 已列出本 Step 必读文档 | 通过 |
| 已先写模块计划 / 模块目录 | 通过 |
| 已按模块记录思考、写入位置和停审结论 | 通过 |
| profile、adapter、local repo、script root、artifact/report root 和 external dependency 准备均已覆盖 | 通过 |
| 未新增 `04/05/06/07` 未定义的 config key、schema、port、state、TC、EV 或 AC | 通过 |
| phase / commit boundary 环境准备与 Step 5~7 不冲突 | 通过 |
| 可以进入 Step 9 定义 Spike、风险与待确认事项 | 是 |
