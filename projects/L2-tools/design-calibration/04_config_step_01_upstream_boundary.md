# L2-tools 04 配置设计 Step 1: 配置输入边界

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 1
> 对应书写规范: `standards/document/配置设计书写规范.md` §5.1
> 回填目标: `projects/L2-tools/04-配置设计.md` §1
> 状态: `completed / pass; stop review`
> 模式: `full-restart / single-agent-serial`

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 1 确认配置输入边界 |
| 前序门禁 | 正式 `03-详细设计.md` Step 19 已完成并通过 review gate；用户以“继续”确认进入 04。 |
| 本步状态 | `completed / pass; stop review` |
| 输出文件 | `projects/L2-tools/design-calibration/04_config_step_01_upstream_boundary.md` |
| 正式文档写入 | 关闭；只允许写入本 Step 中间产物和 04 flow/台账状态。 |
| 下一动作 | 等待用户 review；确认后进入 Step 2，不提前创建 Step 2 文件。 |
| 提交 | 不需要；未经用户明确要求不提交。 |

## 2. 本步目标

确认配置设计必须承接的需求、架构、概要、详细设计、测试方向和验收方向，区分当前可闭合的本地配置语义与外部 blocker，明确配置设计不能重新回答的代码/业务问题。

本步只建立输入边界，不定义最终配置 key、默认数值、环境变量名、JSON demo、secret provider、部署命令或产品选型。

## 3. 本步输入

| 输入 | 读取结论 | 本步用途 |
|---|---|---|
| `projects/L2-tools/00-需求文档.md` | L2 是 runtime 行动契约/工具执行契约层；负责工具 identity/definition、调用受理、执行前置、结果/错误/审计 handoff；不拥有 agent loop、LLM planning、runtime orchestration、registry、Sandbox truth、Observability store 或 SDK client。 | 约束配置不得扩大职责，承接安全、NFR、外部 seam 和禁止事项。 |
| `projects/L2-tools/01-架构设计.md` | 七模块/依赖方向/数据写权和 compile-runtime-event 三类依赖已收口；外部 owner 以 runtime/event seam 接入。 | 确认 raw config 只能在 infra composition 侧读取，不能穿透 domain/application。 |
| `projects/L2-tools/02-概要设计.md` | 七工程模块、六业务组成部分、协议/flow/state 轮廓和配置影响方向已收口。 | 确认 04 只细化配置控制面，不新增对象、协议或状态。 |
| `projects/L2-tools/03-详细设计.md` §13 | `ToolsConfigCandidate` -> `ToolsRuntimeConfig`；`infra/config.rs` + `runtime_builder.rs`；七 Store、IdempotencyStore、UoW、Clock/ID、七 external Port、feature/target/timeout/retry/degraded 类别。 | 直接提取配置域、builder seam、校验错误和不可配置化红线。 |
| `projects/L2-tools/design-calibration/03_ddd_step_14_config_external_binding.md` | 已给出 candidate 字段类别、唯一读取者、builder 顺序、blocked adapter、fake parity、failure surface 和具体数值后置 04 的约束。 | 作为配置字段来源和回填索引，避免从旧文档发明配置。 |
| `projects/L2-tools/05-测试方案.md` | 旧文档包含旧 Python/工具对象和旧环境方向，与当前 `00~03` 冲突。 | 标为 `historical_material`；只提取“配置矩阵/invalid/blocked/redaction/replay/no-write”测试方向。 |
| `projects/L2-tools/06-验收标准.md` | 旧文档存在旧验收对象、阈值、签署和 readiness 表述，与当前边界不一致。 | 标为 `historical_material`；只提取配置 fail-fast、边界、审计、可追溯门禁方向。 |
| 配置设计 SOP/规范和中间产物规范 | 要求 Step 1~15 串行、默认 JSON、配置项最小列、敏感级别、03 回写门禁和正式后置装配。 | 约束本轮过程与输出格式。 |
| 参考项目 `L1-governance`、`L1-artifact`、`L3-capability-hub`、`L4-sandbox`、`L4-observability`、`L0-core`、`L0-bus`、`L0-sdk` | 已完成项目的 04 章节和 calibration 产物提供配置域、JSON、失败与下游承接粒度。 | 只作粒度校准，不继承 sibling 的配置 key、产品或领域事实。 |

## 4. SOP 问题回答

### 4.1 当前配置设计要承接哪些需求、非功能、安全和环境差异？

配置设计必须承接以下 current formal 结论：

| 输入类别 | 当前必须承接的配置语义 |
|---|---|
| 运行装配 | profile、candidate 到 validated runtime surface、七 Store/UoW/idempotency、Clock/ID、entry/worker/job bundle。 |
| 外部接缝 | Core/Hub/Auth/Sandbox/source/collaboration 七个 Port 的 adapter slot、blocked/unavailable/unsupported/unknown surface 和 target/ref 分离。 |
| 安全 | raw prompt/request/capture/provider response/body/secret/credential/stack trace 禁止进入任何 local/public surface；redaction 和 safe diagnostic 只能收紧。 |
| 一致性 | CAS、semantic key、pair atomicity、replay surface、Prepared/unknown fence、Query no-write、Consumer no-core-write、Job no-repair 不可配置化。 |
| 可观测与审计 | body-free logs、低基数 metrics、TraceContext、ToolAuditEntry 原子 pair 和 independent external status ref 的配置入口。 |
| 环境差异 | local/fixture、CI deterministic、integration-like blocked-aware；真实 staging/production-like 只有在 owner/产品闭合后才能启用，不以 endpoint/ref 存在代替 readiness。 |
| 失效 | invalid config fail-fast；危险动作在 blocked/unavailable/unverifiable 时 fail-closed；可选外围 projection/event/job 可 disabled/degraded，但不得改变本地 truth。 |

### 4.2 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入 04？

| 03 来源 | 04 必须展开的配置问题 | 当前允许的表达 |
|---|---|---|
| `ToolsConfigCandidate` / `ToolsRuntimeConfig` | 外部 JSON section、来源、profile、字段类型、默认/必填、sensitivity、生效和失败策略。 | 不改变 Rust type 名称和字段语义。 |
| `ConfigSource::load` -> parse -> validate | source priority、strict parse、type/cross-section validation、safe issue mapping。 | 不把 parser/backend 原文暴露到错误或日志。 |
| `ToolsRuntimeBuilder::from_validated_config` | seven Store/UoW/idempotency、Clock/ID、Port adapter registry、API/worker/jobs assembly 的启用条件。 | required local capability 缺失不暴露 runtime；external 未闭口装 blocked adapter。 |
| Store binding | backend-neutral adapter ref、CAS/page/watermark/pair/replay capability declaration、profile fallback。 | 不选数据库/缓存/表/DSN 产品；不能降级成 current truth cache。 |
| external Port binding | adapter ref、authority/version/body-policy、blocked/unavailable/unsupported/unknown surface、timeout/retry class。 | endpoint/configured 不等于 `PortResolution::Available`。 |
| features/targets/jobs | 外围 event、projection、status refresh、bounded jobs、target set 和 local entry selectors。 | 关闭只表示无该外围尝试，不改核心 outcome/audit/truth。 |

### 4.3 哪些测试和验收场景依赖配置矩阵？

当前只记录方向，具体用例和真实结果留给后续 `05/06`：

| 场景族 | 配置输入依赖 | 必须验证的边界 |
|---|---|---|
| candidate/parser | malformed JSON、unknown field、oversized/unbounded value、非法 enum/URI/ref | typed body-free config error；不回退到低优先级非法值。 |
| builder capability | 缺 Store/UoW/pair/replay/CAS/page capability | builder 不暴露 entry bundle；不切换 memory/cache/host fallback。 |
| blocked external | Authorization/Sandbox/Core/Bus/Observability/SDK seam 配置存在但 owner 未闭口 | blocked/unknown/fail-closed；不伪造 positive status。 |
| profile isolation | local fake/fixture、CI deterministic、integration-like | fake 与 production-like 不能混淆；fake success 不能升级 readiness。 |
| security/redaction | raw secret/body、credential、stack trace、debug override | reject/no-output；配置不能关闭 redaction 或安全 gate。 |
| replay/concurrency | idempotency retention、CAS、semantic uniqueness、Prepared/unknown | duplicate replay immutable result；不重跑副作用、不重建历史。 |
| query/job | projection/stale/rebuild、job batch/cursor/retry | Query no-write、Job no-repair、degraded 表面不改 core truth。 |
| audit/observability | safe material、low-cardinality metric、audit pair、config issue refs | body-free、可关联、观测不反写。 |

### 4.4 哪些内容不应在配置设计中重新定义？

| 不在 04 重定义的内容 | 权威位置/owner |
|---|---|
| Tool identity、definition、Binding、invocation、admission、outcome、audit 的字段、状态和写权 | `00~03` 与对应 domain/application contracts。 |
| Commands/Queries/Consumers/Events/Jobs 的 DTO、版本、mapper、call order 和错误 taxonomy | `02/03`；05 只测试，06 只验收。 |
| Agent loop、LLM planning、runtime orchestration、checkpoint/recovery、Sandbox isolation/run/capture/receipt/cleanup、Bus delivery/DLQ、Observability store、SDK client | sibling owner；`L2T-UP-001~009` 仍开放。 |
| 具体 database/broker/cache/search/scheduler/telemetry/secret product、部署挂载、CLI 命令和 runbook | ADR、07、部署与运维文档。 |
| 测试用例、真实阈值、run_id/evidence/验收签署 | `05/06` 和真实执行，不在 04 伪造。 |

### 4.5 当前上游是否存在会阻塞配置设计的缺口？

没有新增会阻塞当前 P0 配置设计的 blocker；但以下 inherited blocker 必须写入后续配置门禁：

| Blocker | 对 04 的影响 | 未闭合前策略 |
|---|---|---|
| `L2T-UP-001~002` Authorization owner/source/taxonomy/schema | 阻塞 positive authorization adapter/profile | 只允许 opaque ref + blocked-aware adapter；缺失/stale/conflict/unverifiable fail-closed。 |
| `L2T-UP-003~004` Sandbox mapping/receipt/DLQ/cleanup | 阻塞 positive execution/handoff profile | 只配置 local attempt/mapping gap/unknown；不配置 accepted/run/receipt/cleanup truth。 |
| `L2T-UP-005~006` Bus/Observability producer/source/route/status | 阻塞 positive collaboration/observed/readiness profile | 只配置 body-free material/target ref/route-blocked/unknown；不声明 delivery/observed。 |
| `L2T-UP-007` workspace immutable baseline | 阻塞 frozen source/readiness claim | 只记录文件/章节来源和 redacted config identity。 |
| `L2T-UP-008` Core tools-specific schema | 阻塞 Core positive compile authority | 只允许 candidate/blocked selector；不复制 Core schema。 |
| `L2T-UP-009` SDK tools client seam | 阻塞现成 client/profile | 只保留 server contract/future consumer seam。 |

## 5. 当前文档问题诊断

| 材料/位置 | 问题 | 本 Step 处理 |
|---|---|---|
| 旧 `README.md` | Python 同进程、builtin/MCP、member-images、registry/provider 装配与当前 runtime action contract 冲突。 | 标记 `historical_material`，不抽取旧 config key/默认/产品。 |
| 旧正式 `05-测试方案.md` | 旧 ToolDefinition/Policy/host callback 主线与当前 41 对象、37 flow、blocked seam 不一致。 | 只抽取配置测试方向，后续 05 重建。 |
| 旧正式 `06-验收标准.md` | 旧验收签署、阈值、readiness 和真实环境表述未经当前链确认。 | 只抽取配置门禁方向，后续 06 重建。 |
| 当前正式 `03` §13 | 已有 typed candidate/builder/adapter 类别，但具体 JSON/source/profile/value 被明确后置 04。 | 作为唯一配置事实基线，不新增 03 类型。 |
| 目标实现仓 `/home/aris/Projects/quantalithos-tools` | 当前不存在。 | 所有 implementation path 只写 planned；不声称源码、manifest、构建或测试。 |

## 6. 改动前后对比

| 项 | 本 Step 前 | 本 Step 后 | 处理理由 |
|---|---|---|---|
| 输入清单 | 04 尚未创建；03 配置 binding 分散在 §13 | 固定 current formal、explanatory calibration、historical downstream 和参考资料层级 | 保证后续 Step 可恢复且不误用旧内容。 |
| 旧 05/06 效力 | 可能被误当作配置/环境事实 | 明确为 historical material / direction only | 防止旧对象、阈值、签署或产品回流。 |
| 配置 owner | 03 已定义但 04 尚未承接 | 固定 `infra/config.rs` -> validator -> `runtime_builder` -> injected surface | 防止 domain/application/raw config 穿透。 |
| 外部 blocker | 只在 03 台账中记录 | 建立对配置 profile 的 blocked/fail-closed 影响映射 | 配置存在不能解除 owner 缺口。 |
| 03 回写判断 | 尚无 Step 1 级表 | 明确当前无回写；future 新代码契约必须先回写 03 | 满足配置设计回写门禁。 |

## 7. 配置设计取舍

| 议题 | 选择 | 取舍 |
|---|---|---|
| 是否走“无配置项目”路径 | 不走 | 03 已存在 runtime/config/builder、Store、Port、job、projection 和 feature binding；必须完成 Step 1~15。 |
| 配置事实来源 | 以当前 03 §13/Step 14 为唯一直接配置事实 | 旧 05/06、README 仅作污染审计和下游方向。 |
| 是否在 Step 1 定义具体 key/value | 不定义 | 先完成 scope/control-plane/classification/source，再按 Step 7 逐域列项。 |
| 外部正向绑定 | 不提前声明 ready | 用 blocked-aware/disabled/fake/unknown surface 承接 `L2T-UP-001~009`。 |
| 产品选型 | 不锁定 | 04 只定义 product-neutral ref/capability；具体产品进入 ADR/07/运维和未来回写。 |
| 配置错误与业务错误 | 分离 | loader/validator/builder 只输出 typed body-free config issue，不混入 domain rejection 或 external outcome。 |

## 8. 结构化中间产物

### 8.1 上游输入映射表

| 来源文档 | 配置输入 | 当前效力 | 回填 `04` 章节 |
|---|---|---|---|
| `00-需求文档.md` | 责任边界、工具行动契约、安全/追踪/审计/NFR、外部依赖分类 | current formal | §1~§4、§8、§11~§14 |
| `01-架构设计.md` | owner、依赖方向、runtime/event collaboration seams、数据 ownership | current formal | §1、§3~§6、§9~§12 |
| `02-概要设计.md` | 模块/组成部分、协议/flow/state/config impact skeleton | current formal | §1~§4、§7、§9 |
| `03-详细设计.md` §13 | candidate/root、builder、seven stores/UoW/idempotency、ports、features、target、timeout/retry/degraded | direct current | §3~§11、§14 |
| `03_ddd_step_14_config_external_binding.md` | config section-to-code binding、fallback、capability validation、NC redlines | current calibration | §3~§11、§14~§15 |
| 旧 `05/06` | 配置测试/验收方向 | historical direction | §12 only;不继承字段/结果 |
| 配置 SOP/规范 | Step 顺序、JSON、sensitivity、回写/停审和参考结构 | normative | 全文 |
| sibling 04 samples | 粒度和结构样本 | non-authoritative | 结构校准，不作内容来源 |

### 8.2 不再回答的问题清单

本配置设计不重新回答：

1. 为什么 L2-tools 是 runtime 行动契约层，以及六业务组成部分的业务目标和 owner。
2. 41 个对象、13/11/5/4/4 协议、37 flow、六状态族的字段、状态、写权和错误语义。
3. Agent loop、LLM planning、runtime orchestration、Sandbox isolation/execution truth、Bus delivery/DLQ、Observability store、marketplace、MCP/A2A/API registry、SDK client 的实现或所有权。
4. 具体数据库、broker、cache、scheduler、transport、telemetry、secret provider、endpoint、topic、部署拓扑和运维命令。
5. 真实代码、测试执行、run_id、evidence alias、验收签署、发布或 readiness。

### 8.3 配置设计必须回答的问题清单

后续 Step 必须逐项回答：

| 问题族 | 必须形成的结果 |
|---|---|
| 控制面 | 来源链、唯一装配入口、可读模块、配置域和禁止控制能力。 |
| 分类边界 | startup/entry/job/adapter/store/feature/sensitive/test-only 分类、冷/热边界和 `NC-L2T-*` 映射。 |
| 来源优先级 | defaults/file/env/secret refs/test fixture 的覆盖顺序、冲突与不可用策略；config center/admin/hot reload 是否拒绝。 |
| profile | local-dev、ci-test、integration-like、staging-like 和 production-like blocked/future 的依赖与敏感处理。 |
| 配置项 | 每项类型、默认/必填、来源、scope、生效、sensitivity、failure、关联模块及严格 JSON demo。 |
| 敏感项 | opaque ref、private material、读取/轮换/审计/no-output 规则。 |
| 加载生效 | parse/type/cross-section/forbidden override/capability validation、builder、startup/entry/job activation。 |
| 变更恢复 | actor/review/audit/digest/rollback、旧工作 snapshot、drift、无 hot reload 的边界。 |
| 失效降级 | invalid/missing/unavailable/blocked/unknown/stale/rebuilding/partial 的区别和 fail-fast/fail-closed/degraded。 |
| 下游承接 | `05/06/07/09` 可直接引用的配置输入，以及不得重复定义的契约。 |
| 演进风险 | 首版无迁移、future provider/config-center/hot-reload/product schema 的 reopen 触发器。 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| 04 承接既有 `ToolsConfigCandidate`/`ToolsRuntimeConfig`，不改变字段语义 | 否 | 配置语义具体化 | 不适用 | 无回写 |
| 04 将 raw source 限定在 `infra/config.rs`/`runtime_builder.rs`/entry wiring/infra adapter；domain/contracts/application 不读 raw config | 否 | 承接 §13 ownership | `03` §13 已有同一约束 | 无回写 |
| 04 对七 Store/UoW/idempotency、Clock/ID、七 external Port 仅定义 ref/source/profile/failure 绑定 | 否 | 外部配置具体化 | `03` §13 已有 seam | 无回写 |
| 04 对 `L2T-UP-001~009` 采用 blocked/disabled/fake/unknown，不声明 positive readiness | 否 | blocked boundary 具体化 | `03` §1/§13 已有 blocker | 无回写 |
| 未来新增 runtime config 字段、builder lifecycle、adapter constructor、Port、error、DTO、flow 或 state | 是 | 代码契约变更 | `03` §4~§15 与相应 calibration Step | 无回写（future trigger；Step 3~13 已确认当前未触发） |

当前 Step 只有最后一行属于未来触发器，尚未进入 P0 配置契约；在 Step 14 必须重新核对，若被当前范围触发则先回写 03，不得直接进入 Step 15。

## 10. 回填草稿

正式 `04-配置设计.md` §1 应回填：

1. 当前正式 `00/01/02/03` 的配置输入映射。
2. 旧 README、旧 `05/06` 的 historical material 处理口径。
3. `03` §13 和 Step 14 的 candidate/builder/Store/Port/blocked seam 承接说明。
4. 配置设计不再回答的问题清单。
5. 配置设计必须回答的问题清单。
6. 初始 `03` 影响判定；当前 P0 无回写，future code-contract trigger 必须在触发前回写。

## 11. 待确认事项

| 待确认事项 | 影响 | 需要谁确认 | 未确认前处理 |
|---|---|---|---|
| 用户是否确认从 Step 1 进入 Step 2 | 影响下一中间产物创建 | 用户/项目负责人 | 保持 `next_allowed_action=wait_for_user_review_before_step_02`。 |
| P1/P2 durable 产品、真实 secret provider、config center、hot reload 是否进入路线 | 不影响当前 Step；会影响后续 03/04 回写和 profile | 架构/安全/运维/实施负责人 | 不写成 P0 配置项；使用 product-neutral ref、disabled/blocked、startup/new job run。 |
| 旧 `05/06` 何时按新版链重建 | 不影响当前 04 Step 1；影响后续下游输入质量 | 测试/验收负责人 | 仅作为 historical direction，不覆盖当前 `00~03`。 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 当前配置输入文档清单明确 | 通过 | §3、§8.1 已列来源和效力。 |
| 当前/历史材料冲突已记录 | 通过 | §5 已标注 README、旧 05/06 和目标仓状态。 |
| 不再回答的问题清单完成 | 通过 | §8.2。 |
| 配置设计必须回答的问题清单完成 | 通过 | §8.3。 |
| inherited blocker 有配置影响和 fail-closed 口径 | 通过 | §4.5 和 flow §6。 |
| 03 影响判定已记录 | 通过 | §9；当前 P0 无回写，future trigger 不得静默进入正式契约。 |
| 正式 04 是否提前写入 | 否 | 当前只完成 Step 1 中间产物。 |
| 下一动作 | 停审 | 等用户确认后才创建 `04_config_step_02_scope.md`。 |
