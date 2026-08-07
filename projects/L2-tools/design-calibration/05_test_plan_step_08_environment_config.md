# L2-tools 05 测试方案 · Step 8 测试环境与配置矩阵

> 对应 SOP：`测试方案讨论流程_SOP.md` Step 8「设计测试环境与配置矩阵」
>
> 目标回填：`projects/L2-tools/05-测试方案.md` §8
>
> 直接输入：`05_test_plan_step_06_cases.md`、`05_test_plan_step_07_test_data.md`、
> `projects/L2-tools/03-详细设计.md` §13~§15、`projects/L2-tools/04-配置设计.md` §6~§12、
> `projects/L2-tools/01-架构设计.md` §8~§10 与全局依赖裁剪规则。

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | 8 / 设计测试环境与配置矩阵 |
| 状态 | `accepted_for_step_08 / proceed_to_step_09` |
| 当前模块 | `test_environment_and_config_matrix` |
| 本步结论 | P0 环境、依赖类型、profile、配置边界和不可用处理已完成逐环境停审与跨矩阵审计。 |
| 正式文档写入 | 未允许；正式 `05-测试方案.md` 仍锁定至 Step 15。 |
| 下一步 | 完成本步停审后进入 Step 9 自动化与 CI/CD 门禁。 |

### 1.1 Step 内计划

- [x] 读取 Step 6 用例、Step 7 数据集、03/04 配置与依赖真相。
- [x] 划分 `local-dev`、`ci-test`、`integration-like` 及条件性 future 环境。
- [x] 判定 compile-time、runtime、event collaboration 三类依赖及测试协作方式。
- [x] 形成环境拓扑图和不可用/blocked 处理矩阵。
- [x] 按 04 canonical item 形成配置测试矩阵，不新增配置 key。
- [x] 完成逐环境停审、跨矩阵审计并放行 Step 9。

## 2. 本步输入与 SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| local / CI / integration / staging 分别测什么？ | `local-dev` 验证可观察的本地组合和负向路径；`ci-test` 验证隔离、确定性和 fake parity；`integration-like` 验证 entry、adapter、handoff、projection/status 的受控接缝；`staging-like` 仅在上游合同和部署 authority 闭口后做条件性 qualification；`production-like` 当前不启用。 | `04` §6；Step 2/4/7 |
| 每个环境依赖哪些服务？ | P0 只要求本地 Store/UoW/idempotency/projection、Clock/ID 和 application-owned Port seam；Hub/Sandbox/Runtime 为 runtime seam，Bus/Observability 为 event collaboration。外部 owner 未闭时只挂 typed blocked/unavailable adapter。 | `01` §8；`03` §13.5~§13.6 |
| 哪些配置影响测试结果？ | `profile.*`、`boundary.*`、`stores.*`、`idempotency.*`、`projection.*`、`jobs.*`、`adapters.*`、`handoff.*`、`clockId.*`、`features.*` 十个 root 下的 54 个 canonical item；来源、scope、activation 和 safety floor 同样是测试输入。 | `04` §7、§9、§12 |
| 哪些依赖使用 mock/fake/controlled/real-like？ | pure/domain 使用无外部替身；local/CI 使用 contract-faithful fake 或 scripted Port；integration-like 使用 controlled/real-like seam，但不能回退 CI fake；staging/production 只有 owner 闭口后才可 real-like。 | `03` §13.5~§13.7；Step 7 |
| 环境不可用如何处理？ | 编译期 Core 缺失或本地 capability 不足为 `fail-fast`；开放 owner/schema/mapping/route 为 `blocked`；已配置但当前不能回答为 `unavailable`；安全/授权前置不可证明为 `fail-closed`；副作用结果不明为 `unknown`；不能把环境 health marker 升级为 ready、accepted、executed、delivered 或 observed。 | `03` §11~§13；`04` §11 |
| 哪些依赖允许 path dependency？ | 仅 `L0-core` 的正式 shared categories 候选可在实现阶段按 authority 核验后使用 compile-time/path candidate；Hub、Sandbox、Runtime、Bus、Observability 和 SDK 不得作为 sibling Cargo/path dependency。 | `01` §8.3~§8.6；全局依赖裁剪规则 |

## 3. 当前文档问题诊断与取舍

| 历史/当前问题 | 诊断 | 当前处理 |
|---|---|---|
| 旧 `05-测试方案.md` 只列 `local`、`CI`、`staging`，没有依赖类型 | 把环境名称当作可用事实，无法区分编译、运行和事件协作边界。 | 按 `local-dev`、`ci-test`、`integration-like` 三个 P0 profile 重建，并单列依赖类型。 |
| README/旧测试材料把 provider、MCP、host callback 当作本地能力 | 与当前 `L2-tools` runtime 行动契约边界冲突，会把外部 truth 和实现库存带入测试。 | 标记 `historical_material`；只保留 negative/blocked seam。 |
| 04 已有 profile 和 54 item，测试环境若另造 key 会产生第二配置真相 | 测试方案可能意外改变配置 owner。 | 只引用 04 canonical root/item、source lane、profile 和 gate；不新增 key、env 名或数值。 |
| `integration-like` 容易被理解为 provider 正向 ready | 当前 `L2T-UP-001~009` 均 open，正向 provider 分母没有 authority。 | 将 integration-like 定义为受控接缝环境；positive provider qualification 标为 P1/future/blocked。 |
| `staging`/`production` 被旧文档当作发布承诺 | 当前没有冻结 workspace baseline、部署、测量或 evidence authority。 | 仅保留 `staging-like`/`production-like` 条件环境，禁止当前激活或 readiness 叙事。 |

## 4. 环境与 profile 总矩阵

### 4.1 Canonical 环境矩阵

| 环境/profile | 优先级/状态 | 主要用途 | 本地能力依赖 | 外部/跨仓依赖 | 测试协作方式 | 关键配置面 | 数据与隔离 | 不可用/风险口径 |
|---|---|---|---|---|---|---|---|---|
| `local-dev` | P0 / active candidate | 开发者复核对象、协议、状态、负向路径和 blocked surface；可运行少量跨模块 smoke。 | 七个 logical Store、一个 UoW、CAS/pair/page/watermark/replay、Clock/ID、safe observer sink。 | Hub/Sandbox/Runtime 用 blocked-aware 或 explicit fake；Bus/Obs 只用 safe event sink；Core 为 compile candidate。 | pure + contract-faithful fake + scripted Port + formal `Disabled`；不使用隐式 host/provider。 | `profile.name=local-dev`；`clockId.deterministicMode` 只在显式 fixture 时启用；peripheral feature 可关闭；`features.redactionFloor` 保持 strict。 | `DS-L2T-*` 按 developer namespace + case key 隔离；禁止共享 mutable singleton；每次运行清理 journal、projection 和 observer capture。 | local capability 缺失 `fail-fast`；外部 seam open 为 `blocked`/`unavailable`；不构成验收、生产或 provider readiness。 |
| `ci-test` | P0 / active candidate | PR/main 自动化的确定性 contract、service、adapter、security、replay、no-write 和 fake parity。 | 每个 run 独立 Store/UoW/sidecar、deterministic Clock/ID、write/Port/observer spy、bounded scheduler harness。 | Hub/Auth/Sandbox/source/visibility/collaboration 由 scripted blocked/negative/unknown response 表示；Bus/Obs 不连真实 store。 | pure + deterministic fake + fault script + event replay fixture；所有 fixture 显式绑定 profile。 | `profile.name=ci-test`；`clockId.deterministicMode=true`；`projection.rebuildEnabled` 可按 suite 显式开启；`jobs.retryClass=none`；strict parser 全 gate。 | `run_id`、suite、case、dataset 四级 namespace；negative corpus 与 valid baseline 分离；失败保留 safe journal。 | fixture/profile mismatch 或 required capability 缺失 `fail-fast`；upstream positive 未闭保持 `blocked`，不能转 pass。 |
| `integration-like` | P0 / active candidate | 受控验证 API/worker/job entry、Port resolution、one-call phase fence、projection/status separation 和 adapter mapping。 | controlled durable-candidate 或 capability-complete local Store/UoW；必须能证明 CAS/pair/replay/page/watermark。 | Hub/Sandbox/Runtime 可使用 controlled/real-like seam；Bus/Obs 使用 event carrier/replay；authorization、Core schema、SDK 仍按 blocker 处理。 | controlled fake、contract test double、event replay；若使用 real-like，必须显式 opaque ref、profile 和 owner gate，禁止 CI fake fallback。 | `profile.name=integration-like`；`clockId.deterministicMode` 不得隐式 true；external feature 仅在依赖闭合或显式 blocked mode 注册；target 与 route 分离。 | bounded integration namespace、snapshot/watermark、target ordinal；禁止连接共享生产数据或真实 secret；cleanup 由 run scope 和 provider owner 双重确认。 | owner/schema/mapping/route 未闭为 `blocked`；已配置服务暂时不可答为 `unavailable`；安全/授权不可证为 `fail-closed`；不证明 delivered/observed/executed。 |
| `staging-like` | P1 / conditional inactive | future real-like qualification、跨仓版本兼容和发布前 smoke。 | future qualified durable Store/UoW/sidecar、冻结配置和部署 baseline。 | 只有 `L2T-UP-001~009` 相关 owner/schema/mapping/route/client 已正式闭口后才可启用。 | real-like + event replay；禁止 fixture/fake fallback。 | deployment source、approved opaque refs、strict redaction；所有 gate 和 measurement authority 需先闭口。 | 独立候选/运行 namespace；provider 数据保留和清理由 owner 规定。 | 当前 `inactive/blocked`；不产生 readiness、acceptance 或 signoff。 |
| `production-like` | P2 / future inactive | future production boundary 和运维 qualification。 | future approved durable graph、部署/密钥/审计 authority。 | 所有跨仓 owner、schema、route、measurement 和 immutable baseline 均需闭合。 | approved real-like only；禁止 test fixture、fake、health marker 推断成功。 | 仅 future approved source/ref；禁止 hot reload/admin/LKG override。 | future production isolation/retention；当前不创建数据或环境。 | 当前无激活路径；不得作为本轮测试环境或通过分母。 |

### 4.2 Profile 激活与边界规则

| 规则 ID | 判定 | 失败行为 |
|---|---|---|
| `ENV-GATE-01` | required local Store、UoW、idempotency/replay、Clock/ID 和 enabled boundary 全部具备 | 任一缺失：candidate 不形成 runtime bundle，`fail-fast`，无 entry exposure。 |
| `ENV-GATE-02` | `X` deterministic fixture 只允许 `local-dev` / `ci-test` | 在 `integration-like`、`staging-like` 或 `production-like` 发现隐式 fixture：`CrossSectionConflict`，阻断。 |
| `ENV-GATE-03` | external adapter 的 `Blocked`、`Unavailable`、`Unverifiable` 保留原语义 | endpoint、ref、health marker、fake response 不得转成 `Available`、ready 或 accepted。 |
| `ENV-GATE-04` | optional peripheral feature 关闭只影响 registration | 不得关闭 identity、admission、outcome/audit、redaction、Query no-write 或 fail-closed。 |
| `ENV-GATE-05` | `Prepared -> one Port call -> phase-2 local disposition` 在适用 flow 中成立 | 缺 phase marker、出现第二副作用调用或 unknown 自动 retry：`UnsafeOverrideAttempt`/P0 veto。 |
| `ENV-GATE-06` | `local-dev`/`ci-test` 的 fake 只证明 local mapping、error、key、digest、redaction parity | 不得把 fake artifact、endpoint 或 health marker作为 provider readiness、delivery、observed 或 execution evidence。 |

## 5. 依赖类型与测试协作判定

### 5.1 依赖分类表

| 依赖/接缝 | 全局依赖类型 | 测试中允许的表示 | 不允许的表示 | 当前状态 |
|---|---|---|---|---|
| `L0-core` shared identity/context/error/trace/metadata/envelope 类别 | compile-time | 仅在 authority 核验后使用 path/compile candidate；contract tests 可用 typed candidate | 在 L2 复制 Tools-specific schema/package 或把候选当已闭口 | `L2T-UP-008` open；candidate/blocked |
| `L3-capability-hub` controlled source/binding seam | runtime | `HubControlledSourcePort` 的 typed snapshot/ref、clue fake、blocked/unavailable script | sibling source/model、local registry、把 capability applicability 当 authorization | runtime seam；P0 negative/blocked |
| authorization owner/source | runtime seam，owner pending | typed deny/blocked/unverifiable/unknown fixture；正式 allow 仅条件性 | self-authorization、默认 allow、last-known-good fallback | `L2T-UP-001~002` open |
| `L4-sandbox` execution/readiness/source seam | runtime | readiness/local disposition/unknown fake、controlled mapping contract、bounded event replay | host execution、伪造 run/receipt/capture/cleanup、provider accepted | `L2T-UP-003~004` open |
| `L2-runtime` caller/consumer seam | runtime | canonical carrier contract test、facade fake、cross-entry parity | agent loop、planning、orchestration、retry/recovery truth | runtime consumer；P0 seam |
| `L0-bus` safe event carrier | event collaboration | submitted/rejected/unknown scripted publisher、event replay | Bus delivery truth、DLQ/retry authority、同步写本地 outcome | event seam；route pending |
| `L4-observability` safe material consumer | event collaboration | body-free observer sink、replay、status ref/gap fixture | direct store/route、observed truth、observation feedback改写本地终态 | `L2T-UP-005~007` open |
| `L0-sdk` tools-specific client | future/downstream seam | public carrier/fake boundary only；不进入 P0 environment dependency | SDK package/path dependency、现成 client/readiness/coverage | `L2T-UP-009` open |

### 5.2 测试替身选择矩阵

| 替身类别 | 允许 profile | 证明内容 | 不证明内容 | 必须带的标识 |
|---|---|---|---|---|
| pure function / domain fixture | all P0 | invariant、state、mapper、redaction、digest | Store/Port availability、跨仓 readiness | `fixture_kind=pure`、case/dataset ref |
| contract-faithful fake Store/UoW | `local-dev`、`ci-test`；integration-like 仅经显式 gate | CAS、pair atomicity、replay、no-write、error parity | durable backend qualification、生产性能 | adapter kind、capability set、profile |
| scripted Port | all P0 | Available/Unavailable/Blocked/Unsupported/Conflicting/Unverifiable/Unknown mapping | provider truth、真实 execution、delivery | port slot、script id、response class |
| controlled real-like seam | `integration-like`；P1 staging-like | boundary serialization、version、one-call、timeout、event replay | owner contract closure、生产 readiness | opaque connection/target ref、owner gate |
| formal `Disabled` adapter | all P0 | peripheral registration关闭、核心 truth不变 | external absence可被视为成功 | feature key、disabled reason ref |
| event replay fixture | `ci-test`、`integration-like` | envelope/version/correlation/status separation | Bus/Obs delivery或observed truth | source class、replay cursor、run namespace |

## 6. 环境拓扑图

#### 环境拓扑图: L2-tools P0 测试依赖与协作边界

```text
                         [compile]
                    +----------------+
                    |    L0-core     |
                    | shared classes |
                    +--------+-------+
                             |
                             v
 +----------------+   [runtime]   +-------------------------+
 | local-dev      |-------------->| L2-tools test runtime   |
 | ci-test        |                | contracts/domain/app   |
 | integration-   |                | infra/api/worker/jobs  |
 | like           |                +---+----------+----------+
 +-------+--------+                    |          |
         |                             |          |
         | [runtime]                    | [runtime]|
         v                             v          v
 +-------+--------+              +----+-----+  +---+------+
 | Hub / Auth     |              | Sandbox  |  | Runtime  |
 | controlled     |              | seam     |  | consumer |
 | source refs    |              | mapping  |  | carrier  |
 +----------------+              +----------+  +----------+
         ^                             ^          ^
         | [event]                     | [event]  |
         +--------------+--------------+----------+
                        v
                 +------+-------+
                 | L0-bus       |
                 | event carrier|
                 +------+-------+
                        | [event]
                        v
                 +------+-------+
                 | L4-observability |
                 | safe material sink|
                 +-------------------+
```

关键说明:

- 图表达测试环境与跨仓依赖的类型，不表达具体部署、网络地址、topic、route 或 provider 实现。
- `[compile]` 只允许 `L0-core`；Hub/Sandbox/Runtime 是 `[runtime]`，Bus/Observability 是 `[event]`。
- `L2-tools` 先形成 local outcome/audit 和 local submission disposition；Bus delivery、Sandbox run/receipt 和 Observed 状态不回写本地 truth。
- authorization owner、Core Tools-specific schema、Sandbox mapping、Observability route 和 SDK client 未闭口时，图中的协作节点只能由 typed blocked/controlled fixture 表示。

## 7. 配置矩阵

配置测试只承接 `04` 的十个 root、54 个 canonical item、来源优先级 `D < F < E`、独立 `R/X/L` lane、V0~V8 校验和 B0~B8 builder；本节不新增 key、环境变量、默认数值或 profile。

### 7.1 配置域到环境矩阵

| 配置域 | canonical item 范围 | `local-dev` | `ci-test` | `integration-like` | `staging/production` | 主要用例/数据 |
|---|---|---|---|---|---|---|
| `profile` / source identity | `profile.name`、`profile.configIdentityMode` | 允许显式 local source 与 safe identity | 必须 run-scoped、redacted identity | controlled source/ref；不接受 CI fixture fallback | future approved source only | `CFG-T-001~005/012`、`CFG-F-001/004/018`、`DS-L2T-CFG-001` |
| `boundary` | command/query/consumer/job limits、versions、freshness | bounded default + explicit selector | strict test profile、bounded deterministic | controlled schema/version/selector | inactive | `CFG-T-004/006/010`、`CFG-X-004/005/012` |
| `stores` / `uow` | 七 Store refs + one UoW binding | capability-complete local fake/durable candidate | isolated per run fake | controlled capability-complete candidate | future qualified durable | `CFG-T-007/010`、`CFG-F-006/019`、`CFG-X-002/012` |
| `idempotency` | command/consumer/continuation sidecars + retention class | replayable local surface | exact replay and unknown fence | controlled durable/replay surface | future qualified | `CFG-T-007/010`、`CFG-F-007`、`CFG-X-003` |
| `projection` / `jobs` | freshness、rebuild/status flags、bounded limits、retry class | optional jobs explicit; no hidden repair | bounded rebuild and no-retry tests | controlled watermark/cursor and status seam | future | `CFG-T-005/006/010`、`CFG-F-013/017`、`CFG-X-004/005` |
| `adapters` | Core/Hub/Auth/Sandbox/source/collaboration/visibility refs/modes | blocked-aware/scripted fake | all negative/unknown/blocked scripts | controlled/real-like only under owner gate | future approved | `CFG-T-008/009`、`CFG-A-007~009`、`CFG-F-010~015`、`CFG-X-006~008` |
| `handoff` | target refs、phase/timeout/retry policy | no-target or scripted target; one-call spy | Prepared/unknown/manual fence | controlled target/route separation | future | `CFG-T-009/010`、`CFG-F-014/016`、`CFG-X-008/009` |
| `clockId` | independent Clock/ID refs、deterministic mode | explicit deterministic optional | deterministic required for reproducibility | deterministic mode forbidden unless explicit test seam | future approved | `CFG-T-003/005`、`CFG-F-003/009`、`CFG-X-001` |
| `features` / safety | peripheral flags、redaction floor、diagnostic class | strict floor、peripheral off by default where applicable | strict floor + safe low-cardinality observer | only explicit controlled feature | future approved strict floor | `CFG-T-009`、`CFG-A-004/006`、`CFG-F-015/020`、`CFG-X-010/011` |

### 7.2 来源、作用域和生效矩阵

| 来源/作用域 | 允许环境 | 测试断言 | 失败处理 |
|---|---|---|---|
| `D` code default | all profiles，只填 bounded non-sensitive item | required ref、truth、identity 不由 default 生成；source attribution 稳定 | missing required -> `fail-fast` |
| `F` strict JSON file | P0 profiles；future profiles需 approved source | strict JSON；无 comment/trailing/duplicate/unknown/alias/null/coercion | malformed/unknown -> `fail-fast`，不回退 |
| `E` allowlisted environment | P0 profiles按 04 allowlist | 只覆盖 canonical leaf；高优先级非法不回退 D/F | typed invalid -> `fail-fast` |
| `R` opaque ref lane | external slot 或敏感 policy | 只保存 kind/ref digest/source class；不存 material、secret、endpoint/body | grammar/kind/revocation mismatch -> `fail-fast`/blocked |
| `X` deterministic fixture lane | `local-dev`、`ci-test` | fixture 显式且与 profile 相容；不进入 real-like | profile mismatch -> `CrossSectionConflict` |
| `L` entry-local/job-startup selector | all active P0 profiles | 只选择完整已验证 snapshot；不修改 global candidate 或历史 result | current entry/job reject |
| `startup` activation | all active P0 profiles | V0~V8/B0~B8 完成后只暴露一个 immutable bundle | any stage failure dispose prefix/no entry |
| `entry-local` / `job-startup` activation | active P0 profiles | bounded scope、target、page、watermark、retry policy 在边界冻结 | current entry/job reject，不改 global |
| `static` safety floor | all profiles | body-free/redaction/phase/no-write/NC redlines 不可覆盖 | `UnsafeOverrideAttempt`/fail-closed |

### 7.3 配置失败到环境行为矩阵

| 失败族 | `local-dev` | `ci-test` | `integration-like` | 共享断言 |
|---|---|---|---|---|
| parse/type/schema (`CFG-F-001~004`) | fail-fast，开发者可见 safe issue | P0 gate fail，保留 report/artifact | entry/assembly reject | 不回退低优先级、不输出 raw value、无 partial graph |
| local capability/replay (`CFG-F-006~007`) | 不暴露 entry | suite/gate 阻断 | qualification blocked | 不 split transaction、不重算 truth、不隐式 memory fallback |
| external contract open (`CFG-F-010`) | blocked-aware adapter | scripted blocked/unknown | blocked/unavailable | 不转 Available/ready/accepted/executed |
| configured adapter unavailable (`CFG-F-011~013`) | typed unavailable/degraded | deterministic expected surface | controlled unavailable | Query zero-write；Job bounded/no-repair；核心 truth不变 |
| side-effect timeout/unknown (`CFG-F-014`) | manual marker | gate verifies no second call | controlled unknown | `CallOutcomeUnknown`/`SubmissionOutcomeUnknown`，无 generic retry |
| peripheral disabled (`CFG-F-015`) | registration absent | expected disabled surface | route blocked或registration absent | identity/admission/outcome/audit/safety仍可用或显式 fail-closed |
| selector/scope invalid (`CFG-F-016`) | current entry/job reject | gate assertion | bounded reject | global candidate、旧历史和已形成 truth不变 |
| sensitive/redline (`CFG-F-020`, `CFG-X-010~011`) | fail-closed | P0 veto | P0 veto | artifact/report/material/log 全表面不得含 forbidden body/secret |

## 8. 环境不可用与依赖故障处理

### 8.1 可判定状态矩阵

| 状态 | 触发条件 | 允许的测试结论类别 | 后续动作 | 禁止升级为 |
|---|---|---|---|---|
| `blocked` | owner/schema/mapping/route/client 未闭合 | `blocked_dependency`、negative case、待确认 | 保留 blocker ref；等待 owner closure 或正式 deferred boundary | Available、ready、accepted、delivered、observed、executed |
| `unavailable` | 已配置的 Store/Port/visibility 当前不能回答 | typed unavailable/degraded；局部 entry/job reject | 记录 safe issue/ref；不调用替代 owner | success、default visible、automatic allow |
| `unverifiable` | 来源或关联不足以证明语义 | fail-closed、gap、manual resolution | 保留 correlation/ref；等待正式 source | accepted、outcome success/failure、readiness |
| `unknown` | Port call、submission 或 commit 可能跨越副作用边界 | unknown/manual marker | 仅命名 resolve 或人工处理；禁止 generic retry | failed、successful、second call |
| `fail-fast` | 配置、required local capability 或 redline 不满足 | assembly/gate failure | 不暴露 runtime/entry；修正 candidate 后新 assembly | degraded ready、旧配置静默继续 |
| `partial` | bounded Job target dispositions 混合 | `Partial`/`Blocked`/`Failed` report with refs | 保留每 target disposition；不修 subject/core truth | all-success、whole-scan、auto-repair |

### 8.2 环境准备失败的处置顺序

1. 先检查 profile、source attribution、Clock/ID 和 run namespace；这些失败不允许进入依赖探测。
2. 再检查七个 Store、UoW、idempotency/replay、page/watermark/pair/CAS capability；缺失即 `fail-fast`。
3. 再解析外部 Port slot；open contract 形成 `blocked-aware`，已配置但无响应形成 `unavailable`，安全来源不可证形成 `fail-closed`。
4. 最后注册 peripheral feature、event collaboration 和 observer sink；失败只影响对应外围，不能改写 local outcome/audit。
5. 任何准备过程不得把 endpoint、health marker、fake response、planned EV、ref 或 static config identity当作真实 evidence 或 readiness。

### 8.3 禁止的环境替代

| 禁止替代 | 原因 | 正确替代 |
|---|---|---|
| 缺 UoW 时拆成多个 transaction | 破坏 outcome/audit pair 和 phase 原子性 | fail-fast，补齐 capability 后新 assembly |
| Hub 不可用时读取本地 registry/inventory | 复制外部 capability truth | blocked/unavailable fixture |
| Sandbox 不可用时 host/direct callback 执行 | 绕过 isolation owner | no-execution/blocked/unknown |
| Bus/Obs 不可用时把 local attempt 标为 delivered/observed | 混淆本地与协作状态 | local disposition + independent status ref/gap |
| integration-like 不可用时回退 ci-test fake 并标 ready | 跨 profile 污染 | 保持 blocked/unavailable；重新选择合规 profile |
| staging/production 未闭时用 endpoint/health marker通过 | 伪造部署和 readiness | inactive/future，等待 owner/measurement authority |

## 9. 环境到测试切口/数据集映射

| 环境 | 首要测试层/套件候选 | 主要 case family | canonical 数据集 | 主要 effect probe |
|---|---|---|---|---|
| `local-dev` | L0/L1/L2/L4 cross-module smoke | FOUNDATION、CONTRACT、BIND、INV、PRE、OUTCOME、HANDOFF、CFG、OBS | `DS-L2T-FOUNDATION-001`、`DS-L2T-CONTRACT-001`、`DS-L2T-BIND-001`、`DS-L2T-INV-001`、`DS-L2T-PRE-001`、`DS-L2T-OUTCOME-001`、`DS-L2T-HANDOFF-001`、`DS-L2T-CFG-001`、`DS-L2T-OBS-001` | local Store/UoW write set、Port call count、pair presence、redaction scan |
| `ci-test` | unit、service、adapter、entry、replay、security gate | 全 P0 families；尤其 STATE/TX/CONC/ERR/CFG-T/A/F/X/VETO | 对应 18 个 `DS-L2T-*` family + NEG corpus | zero-write spy、CAS winner、digest/key parity、unknown no-retry、forbidden sweep |
| `integration-like` | entry-contract、controlled adapter、event replay、bounded Job | QUERY、CONSUMER、CONT、JOB、PRE、HANDOFF、OBS、CFG-F/X | `DS-L2T-QUERY-001`、`DS-L2T-CONSUMER-001`、`DS-L2T-CONT-001`、`DS-L2T-JOB-001`、`DS-L2T-NEG-UPSTREAM-001` | schema/version, correlation, one-call fence, local/status separation, bounded cursor |
| `staging-like` | future provider qualification | P1 conditional external positives | future qualified dataset only | owner evidence / route / measurement authority（当前未创建） |
| `production-like` | future release/ops | P2 future only | none in current plan | none in current plan |

## 10. 逐环境停审与跨矩阵审计

### 10.1 逐环境停审

| 环境 | 依赖类型是否明确 | profile/config 是否可定位 | 数据隔离/清理是否明确 | 不可用行为是否可判定 | 结论 |
|---|---|---|---|---|---|
| `local-dev` | 通过；Core compile、外部 runtime/event 已区分 | 通过；继承 04 十 root、D/F/E/R/X/L | 通过；developer/run/case namespace + cleanup profile | 通过；fail-fast/blocked/unavailable/unknown | `pass_for_step_08` |
| `ci-test` | 通过；无 sibling path，所有外部用 scripted seam | 通过；strict candidate、deterministic Clock/ID、run-scoped identity | 通过；per-run isolated stores/corpus/journal | 通过；gate failure/blocked dependency/no retry | `pass_for_step_08` |
| `integration-like` | 通过；controlled runtime/event seam，禁止隐式 fake | 通过；opaque refs、target/route 分离、profile gate | 通过；bounded scope/snapshot/watermark + owner cleanup | 通过；blocked/unavailable/fail-closed，不进入 positive 分母 | `pass_for_step_08` |
| `staging-like` | 条件性通过；future owner gate 明确 | 通过；inactive，无当前激活 key | 通过；只定义 future owner contract | 通过；inactive/blocked，不产 readiness | `pass_for_step_08_conditional` |
| `production-like` | 条件性通过；future only | 通过；无当前 activation path | 通过；当前不创建数据 | 通过；inactive，不产测试结论 | `pass_for_step_08_conditional` |

### 10.2 跨矩阵审计

| 审计项 | 结论 | 修正/限制 |
|---|---|---|
| P0 环境是否覆盖 Step 6 全部 P0 case family | 通过；local/CI/integration-like 分工互补，CI 保持全量 deterministic coverage | Step 9 再把 suite 与脚本逐项绑定 |
| 每个环境是否有唯一 profile/config 来源 | 通过；只引用 04 canonical profile、十 root、54 item 和 source lane | 不新增 env name、key 或数值 |
| compile/runtime/event 依赖是否混淆 | 通过；拓扑和矩阵均标注类型 | SDK、authorization owner 保持 pending/future，不转为当前依赖 |
| fake/controlled/real-like 是否跨 profile 污染 | 未发现设计性混用；integration-like 明确禁止 CI fake fallback | 实现时需由 Step 9 gate 检查 profile marker |
| Query zero-write、Job bounded/no-repair 是否受环境保护 | 通过；所有 profile 都保留 write spy、scope/cursor/watermark 断言 | 任何 refresh/repair 进入 P0 veto |
| unavailable/blocked/unknown 是否有独立语义 | 通过；状态矩阵逐项定义 | 不允许用通用失败或成功替代 |
| staging/production 是否被误写为已可用 | 通过；仅 conditional/inactive | 不进入当前通过分母、artifact 或 evidence alias |
| environment health 是否被当作 authority/evidence | 通过；明确禁止 | Step 13 做 artifact/report boundary scan 设计 |

## 11. 回填草稿（正式 05 §8）

> 校准来源：
> - `design-calibration/05_test_plan_step_08_environment_config.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“环境与 profile 总矩阵”“依赖类型与测试协作判定”“配置矩阵”“环境不可用与依赖故障处理”和“逐环境停审与跨矩阵审计”小节，了解 §8 的环境、配置与 blocker 结论如何收敛。

测试环境按 `local-dev`、`ci-test`、`integration-like` 三个 P0 profile 组织。`local-dev` 用于本地组合、负向路径和 blocked surface；`ci-test` 用于隔离、确定性、replay、no-write、redaction 和 fake parity；`integration-like` 用于受控 entry、Port、handoff、projection/status 和 event seam。`staging-like` 与 `production-like` 仅是上游合同、部署和测量 authority 闭合后的条件环境，当前 inactive，不进入通过分母。

依赖类型严格承接全局裁剪：只有 `L0-core` 可作为 compile-time candidate；`L3-capability-hub`、`L4-sandbox`、`L2-runtime` 是 runtime seam；`L0-bus`、`L4-observability` 是 event collaboration；`L0-sdk` 与 authorization owner 仍 pending/future。测试替身只能证明本地契约、错误、key/digest、redaction、blocked mapping 或事件回放，不构成 provider readiness、Sandbox run/receipt、Bus delivery 或 Observed 事实。

配置只使用 04 的十个 root、54 个 canonical item、`D < F < E` 普通优先级、独立 `R/X/L` lane、V0~V8 校验与 B0~B8 builder。profile、source、local capability、external blocked surface、phase/unknown fence、redaction floor 和 peripheral feature 均按矩阵验证；配置、endpoint、health marker、fake、planned ref 或环境可用性不得改变 identity、admission、outcome/audit、Query no-write、Job boundedness 或安全红线。

环境不可用时按 `fail-fast`、`blocked`、`unavailable`、`unverifiable`、`unknown`、`partial` 分层处理；不使用隐式 fallback、host execution、local registry、split transaction、generic retry 或 status inference。所有环境准备、配置装配和替身选择必须带 profile、run、case、dataset 与 safe diagnostic 关联，真实执行与 evidence 由后续 Step 9~13 定义。

## 12. 待确认事项与 blocker

| 事项 | 影响 | 当前处理 |
|---|---|---|
| `L2T-UP-001~002` authorization owner/source/taxonomy | governed profile 的 positive path | 只使用 deny/blocked/unverifiable/unknown fixture；不进入 positive 分母 |
| `L2T-UP-003~004` Sandbox mapping/receipt/cleanup/feedback | integration-like Sandbox positive | 只测试 mapping blocked、no-host、unknown、local handoff disposition |
| `L2T-UP-005~007` Observability producer/source/route/baseline | event sink 和 staging qualification | 只使用 body-free sink/replay/status gap；不声明 observed/readiness |
| `L2T-UP-008` Core Tools-specific schema/package | compile candidate 与跨仓 contract | 仅引用共享类别候选；不写 path/package 名或正向 schema closure |
| `L2T-UP-009` SDK tools-specific client | downstream integration | 只测 public carrier/fake seam；不声明 client 可用 |
| workspace immutable baseline 未冻结 | staging/production evidence | 不创建部署、run、结果或 alias；把当前 workspace 当 uncommitted input |

## 13. 进入下一步条件

- [x] `local-dev`、`ci-test`、`integration-like` P0 环境用途、依赖、协作方式、配置和数据策略可定位。
- [x] `staging-like`、`production-like` 明确为 conditional/inactive，不进入当前通过分母。
- [x] compile-time、runtime、event collaboration 类型在矩阵和拓扑中有标签。
- [x] 04 的十 root、54 item、source lane、profile 和 V0~V8/B0~B8 被测试矩阵承接，未新增配置 key。
- [x] 环境不可用、开放 blocker、fake/controlled/real-like 边界和禁止 fallback 可判定。
- [x] 未创建真实环境、连接、secret、run、artifact、report、evidence alias 或执行结论。
- [ ] 逐环境停审状态写回 flow/ledger 后，进入 Step 9。

## 14. Step 8 停审记录

| 项 | 结论 |
|---|---|
| Step 状态 | `accepted_for_step_08 / proceed_to_step_09`（待 flow/ledger 同步） |
| 停审时间 | 2026-08-06（设计审查记录；非环境执行时间） |
| 上游 blocker | `L2T-UP-001~009` 仍 open；正向 provider/staging/production 条件保持 blocked/inactive |
| 正式文档写入 | 未写；Step 15 前保持锁定 |
| 下一步 | Step 9 自动化与 CI/CD 门禁 |
