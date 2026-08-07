# L2-tools 04 配置设计 Step 6：环境、部署 profile 与配置矩阵

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 6
> 对应书写规范：`standards/document/配置设计书写规范.md` §5.6
> 回填目标：`projects/L2-tools/04-配置设计.md` §6
> 状态：`completed / pass; stop review`
> 模式：`full-restart / single-agent-serial`

## 1. Step 状态与 Step 内计划

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 6 定义环境、部署 profile 与配置矩阵 |
| 前序门禁 | Step 5 `completed / pass; stop review`；普通来源、secret lane、fixture lane、entry-local scope 和冲突规则已闭合。 |
| 本步状态 | `completed / pass; stop review` |
| 正式文档写入 | 关闭；本文件只形成 §6 回填草稿，不创建正式 `04-配置设计.md`。 |
| 当前 blocker | 无新增；`L2T-UP-001~009` 继续作为外部正向 profile 的 inherited blocker。 |
| 下一动作 | 等待用户 review；确认后读取 Step 7 输入并创建 `04_config_step_07_config_items.md`。 |
| 提交 | 不需要；未经用户明确要求不提交。 |

### 1.1 Step 内计划

- [x] 读取 Step 6 SOP、书写规范、Step 5 来源结论、Step 2 范围、`03` §13 和当前 `00~02`。
- [x] 对 local / CI / test / staging / prod 的适用性逐项作答，并区分 environment 与 logical profile。
- [x] 固定 P0 profile 集合、P1/P2 条件式 profile 和 replay 场景归属。
- [x] 建立外部依赖、来源、敏感配置、测试/验收承接和跨 profile 审计矩阵。
- [x] 诊断旧 README/05/06 与当前 profile 口径的冲突；保留为 `historical_material`。
- [x] 判定对 `03-详细设计.md` 的影响；当前无回写，future contract trigger 明确。
- [x] 形成正式 §6 回填草稿和 review gate。

## 2. 本步目标与边界

本 Step 把 Step 5 的来源规则组合成可审查的 environment/profile 矩阵，回答每个运行语境中：

1. 哪些 profile 是当前 P0 可用的逻辑组合，哪些只是 P1/P2 条件候选。
2. 每个 profile 允许的配置来源、fixture scope、entry-local scope 和敏感 ref 形态。
3. 七个 logical Store、UoW、IdempotencyStore、Clock/ID、七个 external Port 和外围 runner 的依赖状态。
4. profile 差异如何交给后续测试、验收、实施和运维文档，而不改变 L2 truth、state、phase 或 owner。

本 Step 不定义具体配置 key、环境变量名、JSON 数值、部署挂载、secret 产品、真实 endpoint、数据库/broker 产品、测试结果、验收签署或 readiness。`profile` 是配置语义中的逻辑组合，不等于 Rust enum、部署对象、actor、authority、production claim 或外部事实。

### 2.1 Environment 与 profile 的分离

| 概念 | 本文定义 | 本文禁止的推断 |
|---|---|---|
| environment | 运行位置、隔离程度、凭据语境和外部资源语境，例如 local、CI、controlled integration、staging-like、production-like。 | environment 名称不能生成 authority、readiness、delivery 或验收通过。 |
| profile | 已登记的配置组合选择器，决定 source lane、adapter/store binding、fixture 许可和 activation scope。 | profile 名称不能改变业务 owner、状态转换、权限裁决、事务语义或安全红线。 |
| profile ref | 经 `infra/config.rs` 解析并由 builder 校验的 typed/redacted reference。 | 不能从字符串、endpoint、health marker 或 fake 成功推断 provider truth。 |
| test/replay scenario | 当前 profile 内的 bounded entry/job 输入。 | 不得偷偷创建新 profile、覆盖全局 metadata、identity、cursor 或 idempotency key。 |

## 3. 本步输入

| 输入 | 关键结论 | 本步用途 |
|---|---|---|
| `04_config_step_05_sources_priority_conflicts.md` | 普通来源固定为 `code defaults < strict JSON file < allowlisted environment`；secret、fixture、entry-local 是独立 lane；非法高优先级不回退。 | 组合每个 profile 的来源矩阵，并审计来源漂移。 |
| `04_config_step_02_scope.md` | P0 需要完整 local composition、blocked-aware external seam、bounded jobs、projection 和安全 overlay；不走无配置路径。 | 确定 profile 必须覆盖的控制面。 |
| `03-详细设计.md` §13.1~§13.9 | `ToolsConfigCandidate` / `ToolsRuntimeConfig`、builder 顺序、七 Store、IdempotencyStore、Clock/ID、七 external Port、feature、timeout/retry/degraded 类别。 | 固定 profile 能选择的装配点及不可配置化边界。 |
| `projects/L2-tools/00-需求文档.md` | L2 只负责 runtime 行动契约/工具执行契约；外部 registry、Sandbox、Bus、Observability、SDK 等不归 L2。 | 防止 profile 把外部 owner 吸收到 L2。 |
| `projects/L2-tools/01-架构设计.md` | compile/runtime/event 三类依赖裁剪和数据写权已收口。 | 固定 sibling 不入 Cargo、外部只经 Port/ref/event seam。 |
| `projects/L2-tools/02-概要设计.md` | 七工程模块、六业务组成部分、同步/异步/Job 分工和 blocked seam 已收口。 | 把 profile 差异映射到 entry、adapter、job、projection，而非新增业务主体。 |
| 配置 Step 6 SOP 与 §5.6 | 必须回答 local/CI/test/staging/prod、来源、外部依赖、敏感处理和测试/验收差异。 | 约束本 Step 的矩阵和停审门禁。 |
| 旧 `README.md`、旧 `05-测试方案.md`、旧 `06-验收标准.md` | 含旧 Python/Policy/host callback/真实 staging 与签署口径，和当前 `00~03` 冲突。 | 仅作 `historical_material` 和污染审计输入，不继承旧 profile/key/结果。 |
| 已完成项目 Step 6 样本 | 提供环境矩阵、依赖矩阵、下游承接的粒度参考。 | 只借结构，不借 sibling 的 profile、产品或领域事实。 |

## 4. SOP 五个问题逐项回答

### 4.1 local / CI / test / staging / prod 分别是否适用？

| 环境语境 | 是否适用 | 映射 profile | 当前定位 |
|---|---:|---|---|
| local | 是 | `local-dev` | P0 active；提供完整本地 composition、deterministic 或 in-memory local capability，以及显式 blocked external seam。 |
| CI | 是 | `ci-test` | P0 active；提供隔离、确定性、可重复的 contract/service/negative/fake-parity 测试。 |
| test（跨入口/接缝测试） | 是 | `integration-like` | P0 active；验证 adapter、handoff、projection/status 和 failure mapping，不证明真实 provider 或 delivery。 |
| staging | 条件适用 | `staging-like` | P1 candidate；只有 owner/schema/mapping/route/secret/Store qualification 闭合后才可启用，当前不得声明 qualified。 |
| prod | 当前不适用为 P0 | `production-like` | P2 target；当前 inactive/blocked，不接受 fixture/fake fallback，不产生生产 readiness claim。 |

`test` 不再创建第三个泛化 profile；需要纯确定性测试时使用 `ci-test`，需要受控接缝时使用 `integration-like`。`replay` 不是 L2 的新环境/profile，而是 jobs/idempotency 的 bounded scope；除非后续 current L2 文档证明独立 profile 必要，否则不得引入 `operations-replay`。

### 4.2 每个环境的配置来源是什么？

所有 profile 都继承 Step 5 的普通覆盖链；差异只体现在来源是否必需、可使用的 lane 和 scope：

```text
code defaults
      < strict JSON file
      < allowlisted environment

secret/connection/certificate: typed opaque-ref lane（不与普通 raw merge）
fixture: explicit Local/CI lane only
entry-local: bounded selector/snapshot, never per-field global override
remote config / admin / generic CLI / watcher / online LKG: P0 unsupported
```

- `local-dev` 可以使用安全 defaults 和可选 local file/env；fixture 必须显式选择，不能因 adapter 缺失而静默 fallback。
- `ci-test` 使用 test file、CI-safe env 和显式 deterministic fixture；固定 clock/ID 通过 test-only binding 注入，不使用真实 secret 或正向 provider。
- `integration-like` 使用 file/env 中的受控 ref 和 entry-local scenario selector；不得使用 Local/CI fixture lane 冒充接缝结果。
- `staging-like` 需要完整 deployment file 和受控 ref；当前只保留条件式 candidate，不允许用 fixture/fake 补齐 required dependency。
- `production-like` 只接受未来 approved deployment/operation source 与 opaque secret refs；当前 source/profile 不可启用。

### 4.3 每个环境依赖哪些外部服务？

profile 只声明依赖类别和解析状态，不声明具体产品或 provider ready：

- `local-dev` 和 `ci-test` 的七个 logical Store、UoW、IdempotencyStore、Clock/ID、visibility 与 projection 可由 capability-complete in-memory/deterministic adapter 组成；Hub/Auth/Sandbox/source/collaboration 等外部 Port 使用 blocked-aware 或 deterministic fake slot。
- `integration-like` 可使用 controlled/real-like adapter seam，但仍经 L2-owned Port；外部 contract 未闭合时必须返回 `Blocked`、`Unavailable`、`Unsupported`、`Conflicting` 或 `Unverifiable`，不能返回正向 readiness 结论。
- `staging-like` 只有在 `L2T-UP-001~009` 受影响部分闭合并完成 durable/real-like qualification 后，才可选择真实或批准的外部 binding；这些条件当前未满足。
- `production-like` 的依赖类别可作为未来目标记录，但不在本 Step 声明部署、容量、路由、交付、观察或 SDK readiness。

### 4.4 敏感配置在不同环境如何处理？

所有 profile 都禁止 raw password、token、private key、credential、DSN material、prompt/request/capture/provider body 和 stack trace 进入 `ToolsConfigCandidate`、日志、错误、审计、event、report 或普通配置 demo。普通 file/env 只能提供已登记的 typed opaque locator；真实材料由后续受控 owner 解析。

- `local-dev`：只允许 absent、fake handle 或 deterministic fixture handle；required external ref 缺失时保持 blocked/fail-fast，不回退到 raw 值。
- `ci-test`：只允许 deterministic fake/fixture handle；CI secret 即使存在也不能进入 candidate 或开启正向 provider。
- `integration-like`：可携带 credential/connection/target 的 opaque ref，用于验证解析和 failure mapping；不写入或输出材料本身。
- `staging-like`：未来只允许 approved secret-provider ref；不得接受 fixture/fake 作为 required real-like dependency 的隐式替代。
- `production-like`：未来只允许受控 secret-provider ref；当前 inactive/blocked，任何 raw material 或 emergency override 均拒绝。

### 4.5 哪些环境差异会影响测试和验收？

- `local-dev` 只承接开发 smoke、手工 negative path 和本地 composition 检查，不是验收证据，也不证明生产 readiness。
- `ci-test` 承接配置 parser/validator、domain/application contract、Store/Port fake parity、redaction、duplicate/semantic conflict、idempotency replay、unknown/manual fence 和 Query/Job no-write 自动化方向。
- `integration-like` 承接跨 entry、blocked/unavailable/unknown mapping、one-call handoff fence、safe material gate、projection freshness/status 和无 fake fallback 的接缝测试；不证明真实 provider、Sandbox isolation、Bus delivery 或 Observability observed truth。
- `staging-like` 只承接未来 P1 qualification、durable capability、approved secret injection 和 real-like contract tests；当前不阻塞 P0。
- `production-like` 只承接未来运维验证与发布门禁，不能在当前设计中写成已通过或 must-pass。

## 5. 当前材料诊断

| 材料/位置 | 诊断 | 本 Step 的处理 |
|---|---|---|
| Step 5 来源规则 | 已有单一 precedence，但尚未按环境/profile 组合。 | 用 P0/P1/P2 profile 矩阵固定来源 lane 和 scope。 |
| `03` §13.3、§13.5~§13.7 | 已定义 builder、adapter availability 和 fake/blocked 语义，但没有环境层级。 | 不新增 runtime enum；将 profile 作为 config composition ref。 |
| `00~02` | 明确 external owner 和依赖裁剪，不允许 profile 越权。 | 逐项把外部依赖写成 Port/ref/resolution，不写 provider truth。 |
| 旧 `README.md` | Python 同进程、builtin/MCP、registry/provider 装配与当前 L2 边界冲突。 | 标记 `historical_material`，不恢复旧 profile/key。 |
| 旧 `05-测试方案.md` | `dev/test/staging` 行包含旧 DB、policy、host callback 和 e2e readiness 假设。 | 只提取测试方向；由本 Step 重建环境承接。 |
| 旧 `06-验收标准.md` | `test/staging` baseline、签署和 readiness 未由当前 owner/证据闭合。 | 只作为验收方向输入，不继承结果或证据声明。 |
| sibling Step 6 样本 | 部分项目把 replay 作为独立 profile。 | L2 当前无授权，不引入；replay 留给 bounded Job/idempotency scope。 |

## 6. 改动前后对比

| 项 | Step 5 后 | Step 6 后 | 原因 |
|---|---|---|---|
| 环境/profile 口径 | 只有 source lane 与 future staging/production 方向 | 明确 `local-dev`、`ci-test`、`integration-like` 为 P0；`staging-like` 为 P1 candidate；`production-like` 为 P2 inactive/blocked | 让测试、验收和实施可定位环境差异。 |
| test 语境 | 可能与 CI、integration 混为一谈 | 纯确定性 test 映射 `ci-test`；接缝 test 映射 `integration-like` | 避免泛化 `test` profile 和不明依赖。 |
| replay 语境 | sibling 参考项目有独立 replay profile | L2 不新增 profile；由 bounded Job/idempotency 承接 | 当前 `00~03` 没有独立 profile contract。 |
| fixture 处理 | 仅规定显式 Local/CI | 明确 local/CI 可显式 fixture，integration/staging/prod 禁止静默 fixture | 防止 fake/fixture 冒充真实外部 readiness。 |
| 外部依赖 | endpoint/ref 仅被描述为 adapter 输入 | 每 profile 都保留 blocked/unknown 解析状态和 positive claim 禁止项 | 配置不能关闭 `L2T-UP-001~009`。 |
| `03` 影响 | 未判定 | 当前无回写；新增 enum/lifecycle/secret reload 才触发 future contract change | 保持详细设计类型与 builder 边界稳定。 |

## 7. 设计取舍

| 议题 | 采用方案 | 取舍与理由 |
|---|---|---|
| P0 profile 数量 | 三个：`local-dev`、`ci-test`、`integration-like` | 覆盖本地 composition、确定性验证和受控接缝；不把生产正向依赖伪装成 P0。 |
| `staging-like` 定位 | P1 conditional candidate | 允许未来 qualification 有明确落点，但当前不声明 qualified、不接受 fixture fallback。 |
| `production-like` 定位 | P2 inactive/blocked | 未闭合的 owner/schema/mapping/route/client/readiness 和产品/运维事实不能由配置补齐。 |
| replay 是否独立 profile | 不独立 | replay 是 Job/idempotency 的 bounded scenario；新增 profile 会引入未授权的 source、state 和 acceptance 语义。 |
| environment 与 profile | 两个概念分离 | 同一 profile 可在受控环境复用；环境名称不产生 authority/readiness。 |
| integration-like 依赖 | controlled/real-like seam，经 Port 接入 | 验证 handoff/failure mapping，不强制 sibling Cargo 或真实 provider。 |
| fake 的作用 | 只证明 local L2 语义、负向路径和 deterministic parity | 不证明 external provider、Sandbox isolation、delivery、observed 或 production readiness。 |
| profile 变更 | startup/new assembly；不支持 hot/reload | `03` 没有在线 lifecycle/atomic swap contract；保持完整 graph 与旧 Job snapshot。 |

## 8. 结构化中间产物

### 8.1 环境 / profile 总表

| 环境 / profile | 层级 | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异说明 |
|---|---|---|---|---|---|---|
| `local-dev` | P0 active | 本地运行 Command、Query、Consumer 和 bounded Job 的完整 composition，检查 local truth、negative path 和 blocked surface。 | 安全 code defaults；可选 strict JSON local file；allowlisted local env；显式 entry-local selector。 | capability-complete in-memory/deterministic Store/UoW/Idempotency/Projection、Clock/ID；Hub/Auth/Sandbox/source/collaboration Port 使用 blocked-aware 或 deterministic fake slot。 | absent、fake handle 或 deterministic fixture handle；raw secret/body 禁止；required ref 不可用时 fail-fast/blocked。 | 可手动启动和定位问题；不构成测试签署、外部 readiness 或 production claim。 |
| `ci-test` | P0 active | 隔离、确定性、可复现的 contract/domain/application/infra fake-parity 与安全负向测试。 | code defaults；required test JSON file；CI allowlisted env；显式 fixture；固定 clock/ID binding。 | 每 run 隔离的 local Store/UoW/Idempotency/Projection；scripted Port fake；disabled external positive provider。 | 仅 fixture/fake opaque ref；CI secret 不进入 candidate；输出必须 body-free、低基数、可关联。 | 证明 L2 本地语义和错误映射，不证明真实 provider、Sandbox isolation、Bus delivery、Observed 或 SDK client。 |
| `integration-like` | P0 active | 验证 API/worker/job entry、adapter seam、handoff fence、projection/status feedback 和 failure mapping。 | code defaults；required controlled JSON file；allowlisted env refs；entry-local bounded scenario selector；不使用 CI fixture lane。 | controlled/real-like Store 或 adapter seam，经 L2-owned Store/Port；外部 owner 未闭合时显式 `Blocked`/`Unavailable`/`Unsupported`/`Conflicting`/`Unverifiable`。 | 仅 credential/connection/certificate/target opaque ref；不输出或保存 material；required real-like ref 不可用不回退 fake。 | 允许受控接缝和故障注入；不等于 external contract qualification 或 delivery/readiness。 |
| `staging-like` | P1 conditional | 未来 durable/real-like qualification、部署候选和跨 owner 合同验证。 | 完整 deployment JSON；allowlisted operations env；受控 secret/connection refs；无 fixture/replay override。 | 需先完成受影响的 Store capability、Core/Hub/Auth/Sandbox/source/collaboration schema/mapping/route 和 downstream seam qualification。 | 仅 approved opaque secret-provider refs；raw material 永不进入普通 candidate。 | 当前 inactive candidate；任何未闭合依赖必须保持 blocked，不能以 endpoint、health marker 或 fake 变成 qualified。 |
| `production-like` | P2 inactive/blocked | 未来生产运行和运维语境的边界定义。 | 未来 approved deployment/operations source；当前不提供成功加载路径。 | 未来批准的 durable Store、外部 Port、handoff/collaboration、status/observability 和 SDK consumer seam。 | 仅未来受控 secret-provider ref；fixture、fake、raw secret 和 emergency override 均禁止。 | 不在 P0/P1 证明范围；当前不启用、不声明 readiness、delivery、observed、accepted、executed 或 sign-off。 |

### 8.2 Profile 外部依赖矩阵

| Profile | 七 logical Store / UoW | Idempotency / Projection | Core / Hub / Auth | Sandbox / source | Collaboration / target | Clock / ID / visibility |
|---|---|---|---|---|---|---|
| `local-dev` | in-memory 或 capability-complete local adapter；必须保留 CAS、semantic uniqueness、pair atomicity、bounded page 和 rollback 语义。 | local sidecar；可重放 immutable result/receipt/report；projection 可 fresh/stale/rebuilding。 | Core candidate/blocked；Hub/Auth blocked-aware/fake；不生成 authority 或 allow。 | blocked-aware/fake readiness and source mapping；不生成 run/capture/receipt/outcome。 | fake/disabled local submission；target ref 与 route/delivery 分离。 | deterministic 或明确注入 local adapter；visibility 仍按 scoped resolver，不默认 visible。 |
| `ci-test` | per-run isolated deterministic adapter；fake 与 durable contract 共享 CAS/error/redaction parity。 | deterministic claim/replay/conflict/in-flight；projection fixture 不可反写 subject。 | scripted candidate/blocked/negative fake；覆盖 missing/stale/conflicting/unverifiable。 | scripted mapping blocked/unknown/failure；验证 one-call fence 和 no host fallback。 | fake submission/unknown/route-blocked；只验证 local attempt 和 safe material。 | fixed Clock/ID；ID 不进入 canonical digest；visibility cases explicit。 |
| `integration-like` | controlled or real-like local capability；缺 required capability 仍阻断 builder。 | controlled replay/report store；bounded projection/status refresh；不 inline refresh。 | Port seam 可受控调用；formal source/authority 不闭合时保持 non-positive resolution。 | controlled handoff/source adapter；mapping/receipt/cleanup blocker 继续 open。 | controlled target/publisher seam；delivery/observed status 独立 ref。 | controlled clock/ID allowed；scope and visibility resolver remains L2 boundary。 |
| `staging-like` | future qualified durable capability and shared UoW；不得隐式切换 cache/file/memory。 | future durable immutable replay/report and projection qualification。 | only after Core/Hub/Auth formal contract closure and compatibility evidence。 | only after Sandbox mapping/receipt/source contract closure。 | only after Bus/Observability producer/source/route/status closure。 | approved production-like providers only after owner and operational qualification。 |
| `production-like` | future approved durable Store/UoW with all required capabilities；当前 no activation。 | future retention/replay/report policy；当前 no claim。 | future approved formal providers；`L2T-UP-001~009` 未闭合则 blocked。 | future approved execution/source mapping；不由 profile bypass。 | future approved route/status target；不由 target existence infer delivery/observed。 | future operational providers; no current readiness evidence。 |

### 8.3 Profile 配置来源矩阵

| Profile | Code defaults | Strict JSON file | Allowlisted environment | Fixture / replay input | Entry-local scope | Secret / connection lane | 非法或不匹配策略 |
|---|---|---|---|---|---|---|---|
| `local-dev` | 只用于安全、非敏感、有界且不创造事实的项。 | 可选；存在则严格解析并参与完整校验。 | 可选；只覆盖已登记 canonical item。 | fixture 只能显式选择；replay 作为 bounded Job input。 | 可选完整 profile/snapshot 或当前 job scope，不可逐字段改 global。 | absent/fake/deterministic opaque ref。 | profile/fixture mismatch、unknown key、非法高优先级值直接 fail-fast；不静默 fallback。 |
| `ci-test` | 仅安全 baseline。 | test config required when suite needs override。 | CI-safe canonical refs only。 | deterministic fixture explicit and run-scoped；replay input bounded。 | 仅选择测试 snapshot/scenario；不得改 metadata、identity、idempotency 或 cursor semantics。 | fake/fixture ref only；真实 secret 不进入 candidate。 | 缺 fixture、fixed Clock/ID 或 required capability 时 assembly fail-fast。 |
| `integration-like` | 安全 baseline。 | controlled integration config required。 | allowlisted adapter/target/connection refs。 | 不接受 Local/CI fixture 作为隐式 provider；scenario file 只能是 bounded input。 | 当前 entry/job selector；不能改变 global adapter graph。 | opaque credential/connection/certificate/target refs。 | external owner blocked -> typed blocked/unverifiable；不回退 fake 或 endpoint-as-ready。 |
| `staging-like` | safe defaults only。 | deployment candidate required。 | operations-controlled refs only。 | fixture/replay override forbidden。 | restricted bounded deployment/job selector。 | approved secret-provider refs only。 | 未 qualification、缺 dependency 或 raw material -> inactive/blocked；不生成 success path。 |
| `production-like` | safe defaults only。 | future approved deployment material。 | future approved operations source。 | fixture/replay forbidden。 | restricted and audited; current profile inactive。 | future approved secret-provider refs only。 | 当前直接拒绝启用；任何 unsafe override、raw secret、unapproved source -> typed reject。 |

### 8.4 Profile 敏感配置处理矩阵

| 敏感类别 | `local-dev` | `ci-test` | `integration-like` | `staging-like` | `production-like` | 共同禁止 |
|---|---|---|---|---|---|---|
| secret / credential material | 不读取 raw material；只可 absent/fake handle。 | fixture handle；CI secret 不落 candidate。 | opaque provider/connection ref；材料由外部 owner 解析。 | approved secret-provider ref candidate。 | future approved secret-provider ref。 | 不进入 JSON 普通值、env raw value、日志、错误、审计、event、report 或 metrics。 |
| endpoint / target / certificate | local fake/typed ref。 | deterministic fake/typed ref。 | opaque connection/certificate/target ref；不代表 route。 | approved opaque ref。 | future approved opaque ref。 | URL/DSN 中的 credential、private key、完整 provider body 禁止。 |
| fixture / replay artifact | explicit local fixture；replay 只作为 bounded Job input。 | explicit run-scoped fixture/replay input。 | 不得静默接受 CI fixture；只允许受控 scenario ref。 | 禁止 fixture fallback；replay 需未来正式 contract。 | 禁止。 | fixture/replay 不得改变 truth、identity、authority、readiness 或 outcome。 |
| diagnostics | safe config issue/trace/metric labels。 | redacted deterministic diagnostics。 | safe failure mapping and correlation。 | future approved low-cardinality diagnostics。 | future audited diagnostics。 | raw body、prompt、capture、provider response、stack trace、高基数自由文本禁止。 |

### 8.5 Profile 测试 / 验收承接矩阵

| Profile | 05 测试方案承接 | 06 验收标准承接 | 07 实施承接 | 不得误用 |
|---|---|---|---|---|
| `local-dev` | smoke、手动 negative、local builder composition、body-free error 检查。 | 仅作为开发前置检查，不是验收证据。 | local config fixture、fake parity 和 planned boundary 调试入口。 | 不得证明 external readiness、production behavior 或签署。 |
| `ci-test` | parser/validator、cross-section conflict、Store/UoW capability、CAS/pair/replay、redaction、duplicate、unknown/manual、Query no-write、Job no-repair。 | P0 自动化结构性证据入口；真实结果由 05/06 后续产生。 | deterministic fixture、固定 Clock/ID、isolated run 和 CI gate wiring。 | 不得证明真实 provider、Sandbox isolation、Bus delivery、Observed 或 SDK coverage。 |
| `integration-like` | API/worker/job 跨入口、blocked/unavailable mapping、one-call fence、safe material gate、projection/status degradation、no fake fallback。 | P0 接缝证据入口；只证明 L2 handoff/failure mapping。 | controlled adapter boundary、scenario fixture、failure injection 和 external seam review。 | 不得写成 provider qualification、delivery/readiness 或 production acceptance。 |
| `staging-like` | future durable/real-like qualification、secret injection、cross-owner contract tests。 | P1 candidate gate，须有 owner、source、mapping、route 和 evidence authority。 | future deployment binding、qualification boundary、rollback/runbook 输入。 | 当前不得标 `qualified`、`must-pass` 或已执行。 |
| `production-like` | future production validation/runbook tests。 | P2 target only；当前无验收签署。 | future approved deployment/operations boundary。 | 不得启用、不得接受 fake/fixture、不得声明 readiness。 |

### 8.6 Profile 激活与失败判定矩阵

| 判定场景 | `local-dev` | `ci-test` | `integration-like` | `staging-like` | `production-like` |
|---|---|---|---|---|---|
| required local Store/UoW/Idempotency/Clock/ID 缺失 | fail-fast，不暴露 entry bundle。 | fail-fast，测试 run 不成立。 | fail-fast；不以外部 blocker 掩盖本地能力缺口。 | fail-fast/inactive。 | reject/inactive。 |
| external owner/schema/mapping/route 未闭合 | blocked-aware adapter；受影响正向 flow fail-closed。 | scripted blocked/unknown；测试可断言负向结果。 | blocked/unverifiable/unknown；不转 ready。 | inactive/blocked，不能用 fake 补齐。 | inactive/blocked。 |
| optional peripheral feature 关闭 | 只取消外围 registration；core gate/outcome/audit/idempotency/no-write 仍启用。 | 同左，并记录 run-scoped disabled reason。 | 同左；target 空集表示无目标，不是成功。 | 需显式审计变更，不得关闭安全红线。 | 当前不允许启用 profile。 |
| profile/source mismatch | 当前 entry 或 assembly fail-fast，禁止 fallback。 | run fail-fast，保留 safe issue ref。 | entry-local reject；不修改全局 runtime。 | profile inactive。 | reject。 |
| side-effect call outcome unknown | 保持 `CallOutcomeUnknown`/`SubmissionOutcomeUnknown`，人工或同 authority resolution；不重试。 | scripted unknown assertion；不二次调用。 | 同左；只写 phase-2 local disposition/gap。 | blocked until formal recovery contract。 | inactive。 |

## 9. 上游 blocker 与 profile 影响矩阵

配置 profile 可以声明 adapter slot、typed ref 和 blocked mode，但不能关闭外部 owner/schema/mapping/route/readiness blocker。每个 inherited blocker 的 profile 处理如下：

| Blocker | `local-dev` | `ci-test` | `integration-like` | `staging-like` | `production-like` |
|---|---|---|---|---|---|
| `L2T-UP-001~002` Authorization owner/source/taxonomy/schema | blocked-aware adapter；required governed path fail-closed。 | scripted missing/stale/conflicting/unverifiable cases；不得 fake allow。 | controlled seam 仍只接受 formal typed result；未闭合保持 blocked。 | 不得启用 positive path，等待 owner contract。 | inactive/blocked。 |
| `L2T-UP-003~004` Sandbox mapping/receipt/cleanup/DLQ | local handoff/attempt 可构造；不声明 accepted/run/capture/receipt。 | mapping-blocked、call-unknown、no-host-fallback 断言。 | controlled handoff failure mapping；不声明 execution truth。 | 不得用 fake/endpoint 补齐 mapping。 | inactive/blocked。 |
| `L2T-UP-005~006` Bus/Observability producer/source/route/status | safe material/local submission 或 disabled；不声明 delivery/observed。 | route-blocked/unknown/status-ref negative tests。 | controlled collaboration seam；status ref 独立于 local attempt。 | 等 producer/source/route/status 正式闭合。 | inactive/blocked。 |
| `L2T-UP-007` workspace baseline 未冻结 | 只记录 redacted source/config identity。 | run-scoped source attribution；不声明 immutable commit。 | 同左。 | qualification baseline blocked。 | inactive。 |
| `L2T-UP-008` Core tools-specific schema/package | candidate-only 或 blocked selector；不复制 shared type。 | compile candidate/unsupported schema negative cases。 | formal compile seam 未闭合则 blocked。 | 不得以 profile 值补 Core authority。 | inactive/blocked。 |
| `L2T-UP-009` SDK tools-specific client seam | server-side contract only；不配置现成 client。 | future consumer seam negative/compatibility placeholder only。 | 不以 caller adapter 假设 SDK coverage。 | 等 SDK contract/client closure。 | inactive/blocked。 |

## 10. 跨 profile 审计

### 10.1 语义不变量审计

| 审计项 | 结论 | 证据 / 处理 |
|---|---|---|
| profile 是否改变 Tool identity、definition、Binding、invocation、admission、outcome 或 audit owner | 通过 | 所有 profile 只选择 infra composition；这些主语仍由 `00~03` 固定。 |
| profile 是否改变 state transition、phase fence、UoW、CAS、pair atomicity 或 replay semantics | 通过 | activation 只影响 assembly/entry/job；`Prepared`、unknown、duplicate 和 no-write 红线跨 profile 保持不变。 |
| P0 fixture/fake 是否可能被误判为 external positive | 通过 | fixture 只允许显式 local/CI；integration/staging/prod mismatch reject；fake 输出不升级 `Available`/readiness。 |
| environment 名称是否产生 authority、actor、production claim 或 sign-off | 通过 | environment/profile 仅是配置组合和运行语境；验收、签署和 evidence 留给 `05/06`。 |
| 普通来源是否发生 profile-specific precedence 漂移 | 通过 | 所有 profile 统一 `defaults < strict JSON < allowlisted env`；secret/fixture/entry-local 独立 lane。 |
| 高优先级非法值是否在某 profile 回退 | 通过 | 所有 profile 都 fail-fast；不回退 file/default/fake。 |
| entry-local 是否覆盖 global runtime、metadata、identity、cursor、idempotency 或 target | 通过 | 只选择完整 snapshot/profile 或 bounded job scope；非法只拒绝当前 entry/job。 |
| P1/P2 是否污染 P0 schema 或 success path | 通过 | staging/production 仅 candidate/inactive；remote/admin/hot/LKG 仍 unsupported。 |
| replay 是否形成隐含新 profile | 通过 | replay 仅为 bounded Job/idempotency input；不新增 profile enum/source/acceptance claim。 |
| feature 是否关闭 core safety gate | 通过 | feature 仅注册外围 event/projection/status/job；identity/admission/outcome/audit/idempotency/no-write/fail-closed 永远存在。 |
| required local capability 是否能被 profile 降级 | 通过 | 七 Store/UoW/Idempotency/Clock/ID/required boundary 缺失均阻断 assembly。 |
| external endpoint/ref/health marker 是否被 profile 当成 readiness | 通过 | 只有 formal typed Port resolution 能产生 resolution state；配置存在本身不改变 blocker。 |
| sensitive data 是否随 profile 进入普通 candidate 或诊断面 | 通过 | 全 profile raw secret/body/credential/stack trace 禁止；只允许 opaque locator。 |

### 10.2 Profile 组合冲突审计

| 冲突组合 | 处理 | 结果 |
|---|---|---|
| `ci-test` + production-like external ref | profile/source lane mismatch；不以 CI fixture 或 env 覆盖。 | fail-fast / inactive。 |
| `integration-like` + implicit local fake fallback | required external slot 解析为 fake 但未显式 test-only 标记。 | `UnsafeOverrideAttempt` 或 `BlockedExternalContract`，不继续 positive flow。 |
| `staging-like` + fixture/replay override | P1 candidate 试图使用 Local/CI lane。 | reject；不把 fixture 当 qualification evidence。 |
| `production-like` + disabled required adapter | required dependency 被 feature 关闭。 | inactive/blocked；不能暴露 entry bundle。 |
| any profile + raw secret in file/env/default | sensitive lane collision。 | parser/validator fail-fast；无日志/错误正文泄露。 |
| any profile + entry-local per-field override | selector 越界到 global candidate。 | current entry reject；不改变 global runtime。 |
| any profile + online config center/admin/watch/LKG | unsupported source/lifecycle。 | typed unsupported/unsafe issue；不静默忽略。 |
| any profile + side-effect retry after unknown | one-call fence 被 profile parameter 放宽。 | validator reject；保持 manual/unknown。 |

### 10.3 Profile 与配置域覆盖审计

| 控制面 | `local-dev` | `ci-test` | `integration-like` | `staging-like` | `production-like` | 统一不变量 |
|---|---|---|---|---|---|---|
| CP-01 source/profile/identity | safe defaults/local file/explicit selector | test file/fixture | controlled file/env/selector | deployment candidate | inactive operations source | profile 不产生 authority/readiness。 |
| CP-02 boundary/entries | bounded local limits | deterministic bounds | controlled scenario bounds | qualified bounded values | inactive | 不改 DTO/metadata/idempotency/cursor。 |
| CP-03 stores/UoW | capability-complete fake/local | isolated deterministic | controlled/real-like | future durable qualification | inactive | CAS/UoW/pair atomicity 不可降级。 |
| CP-04 idempotency/replay | local sidecar | deterministic replay | controlled report/replay | future durable retention | inactive | key/digest/unknown semantics固定。 |
| CP-05 projection | local read/rebuild | fixture/rebuild assertions | controlled freshness/status | future qualification | inactive | Query no-write、Job no-repair。 |
| CP-06 jobs | bounded local jobs | deterministic job slices | controlled failure slices | future operations | inactive | 不修 subject、不伪造 run/evidence。 |
| CP-07 adapters | blocked/fake slots | scripted blocked/fake | controlled seam | future formal providers | inactive | ref/endpoint 不等 readiness。 |
| CP-08 handoff/targets | fake/disabled target | scripted attempt/unknown | controlled target seam | future approved target | inactive | four-gate/one-call fence不变。 |
| CP-09 clock/ID | local/deterministic | fixed deterministic | controlled | future approved | inactive | clock/ID不生成 semantic authority。 |
| CP-10 features | peripheral registration | run-scoped registration | controlled registration | audited future | inactive | core gates永不关闭。 |
| CP-11 safety/telemetry | safe local diagnostics | redacted CI diagnostics | safe failure mapping | future approved sink | inactive | redaction floor只能收紧。 |

## 11. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | 预期回写位置 | 当前状态 |
|---|---|---|---|---|
| 逻辑 profile 集合为 `local-dev`、`ci-test`、`integration-like`，staging/production 为条件候选 | 否 | configuration matrix / scope | `03` §13 已将具体 profile/value 后置给 `04` | 无回写。 |
| environment 与 profile 分离，profile ref 不是业务 enum/authority | 否 | composition semantics | `03` §13.1~§13.3 已允许 typed ref | 无回写。 |
| replay 不单独建立 profile，承接到 bounded Job/idempotency scope | 否 | job/entry composition | `03` §13.4、§13.7、Jobs flow 已有 bounded scope | 无回写。 |
| P0 local/CI 使用 capability-complete fake/in-memory；integration 使用 controlled seam | 否 | adapter binding/fake parity | `03` §13.5~§13.6 已定义 blocked/fake/durable 三类 binding | 无回写。 |
| staging/production 不得用 fixture/fake fallback 或声明 readiness | 否 | external blocker policy | `03` §13.5~§13.9 已固定 resolution/blocked semantics | 无回写。 |
| profile 变更只在 startup/new assembly，禁止 hot/reload | 否 | lifecycle boundary | `03` §13.3 builder 顺序可承接，无新 lifecycle API | 无回写。 |
| 未来若新增 profile enum、online reload、dynamic adapter swap、secret rotation API、source actor/audit 或 production positive contract | 是 | Rust type/builder/Port/error/lifecycle contract | 先回写 `03` 对应 §4~§15 及 calibration Step，再重开 04 | `future design-change trigger`，当前未触发。 |

当前没有待回写项，也没有需要用户补充才能继续 Step 7 的阻塞项。`L2T-UP-001~009` 仍阻塞受影响的外部正向 qualification，但不阻塞 P0 profile 设计。

## 12. 正式 `04-配置设计.md` §6 回填草稿

> 校准来源：
> - `projects/L2-tools/design-calibration/04_config_step_06_profiles_matrix.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“环境 / profile 总表”“Profile 外部依赖矩阵”“Profile 配置来源矩阵”“Profile 敏感配置处理矩阵”“Profile 测试 / 验收承接矩阵”“Profile 激活与失败判定矩阵”“跨 profile 审计”和“待确认事项”小节，了解 §6 的结论、限制和后续输入。

正式 §6 应按以下顺序装配：

1. 先声明 environment 与 logical profile 分离，profile 名称不产生 authority、readiness、production claim 或 sign-off。
2. 回填 `local-dev`、`ci-test`、`integration-like`、`staging-like`、`production-like` 的环境/profile 总表，并明确 P0/P1/P2 状态。
3. 回填七 Store/UoW/Idempotency/Projection、Core/Hub/Auth、Sandbox/source、collaboration/target、Clock/ID/visibility 的 profile 外部依赖矩阵。
4. 回填统一普通来源链和 profile 来源矩阵：`defaults < strict JSON < allowlisted env`，secret/fixture/entry-local 独立；replay 仅为 bounded Job/idempotency input。
5. 回填各 profile 的敏感配置处理；所有 raw secret/body/credential/prompt/capture/provider response/stack trace 继续禁止进入 candidate 或输出面。
6. 回填测试/验收承接矩阵：`ci-test` 负责确定性结构证据，`integration-like` 负责受控接缝和 failure mapping，staging/production 只作后续候选。
7. 回填激活与失败规则：required local capability 缺失 fail-fast；外部 blocker 保持 blocked/unverifiable/unknown；unknown 不自动重试；fixture/fake 不升级 readiness。
8. 回填跨 profile 审计结论和 `03` 无回写判定；未来新增 lifecycle/profile/secret/positive contract 必须先回写 `03`。

正式章节不得加入 exact environment variable name、部署命令、真实 endpoint、secret product、数据库/broker 产品、run_id、测试结果、验收签署、evidence alias 或 readiness 声明。

## 13. 待确认事项

| 事项 | 影响 | 责任人/来源 | 未确认前处理 |
|---|---|---|---|
| `integration-like` 的 controlled seam 是否在后续需要某个具体 durable capability | Step 7/9/12；可能影响 P1 qualification | 架构/实施与对应 external owner | 只保留 product-neutral ref/capability；缺能力 fail-fast。 |
| replay artifact / report ref 是否需要正式配置项 | Step 7/12 | 测试/实施负责人 | 继续作为 bounded Job/idempotency input，不新增 profile。 |
| staging-like 的 Store、secret provider、external Port qualification 条件 | Step 7/8/13/14 | 对应 owner/安全/运维 | 维持 conditional/inactive；不接受 fixture/fake fallback。 |
| production-like 是否需要额外 source actor/audit/reload lifecycle | 可能触发 `03` 回写 | 架构/安全/运维 | 当前 profile inactive，相关 source/key 直接 reject。 |
| 旧 `05/06` 重建后是否保留相同环境命名 | Step 12 及 downstream docs | 测试/验收负责人 | 下游以本 Step 矩阵为当前方向，不继承旧文档结果。 |

以上均为后续配置项、敏感项和下游承接输入，不构成当前 Step blocker；没有新增上游 blocker。

## 14. Step 6 review gate

| 门禁 | 状态 | 说明 |
|---|---|---|
| local / CI / test / staging / prod 适用性已逐项回答 | 通过 | `test` 映射为 `ci-test` 或 `integration-like`；staging/prod 分层为 P1/P2。 |
| P0 profile 差异可定位 | 通过 | `local-dev`、`ci-test`、`integration-like` 各有用途、来源、依赖和失败策略。 |
| profile 来源规则与 Step 5 一致 | 通过 | 统一 ordinary precedence；secret/fixture/entry-local 独立。 |
| 外部依赖矩阵可区分 fake、controlled、blocked、future | 通过 | endpoint/ref/health marker 不改变 formal resolution。 |
| 敏感配置处理覆盖所有 profile | 通过 | raw material 全 profile 禁止，opaque ref 分 profile 处理。 |
| 测试/验收差异可直接交给 05/06 | 通过 | `ci-test`、`integration-like`、future staging/production 的承接已列。 |
| inherited blocker 已映射且未被 profile 关闭 | 通过 | `L2T-UP-001~009` 仍 open；无 fake/fixture/readiness 伪闭口。 |
| replay、environment、profile 没有新增未授权事实 | 通过 | replay 保持 Job/idempotency scope；profile 不是代码 enum/部署事实。 |
| 跨 profile 语义/来源/安全审计无 unresolved 冲突 | 通过 | §10.1~§10.3。 |
| `03` 影响判定已完成 | 通过 | 当前无回写；future trigger 明确。 |
| 正式 `04` 是否提前写入 | 否 | 仅保留 §6 回填草稿，正式文档待 Step 15 整体装配。 |
| 下一动作 | 停审 | 等待用户确认后创建 Step 7；不得自动跨 Step。 |
