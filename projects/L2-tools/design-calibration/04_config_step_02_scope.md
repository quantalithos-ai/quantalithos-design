# L2-tools 04 配置设计 Step 2: 目标、范围与非范围

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 2
> 对应书写规范: `standards/document/配置设计书写规范.md` §5.2
> 回填目标: `projects/L2-tools/04-配置设计.md` §2
> 状态: `completed / pass; stop review`
> 模式: `full-restart / single-agent-serial`

## 1. Step 状态

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 2 明确配置设计目标、范围和非范围 |
| 前序门禁 | Step 1 `completed / pass; stop review`；用户以“继续”确认进入 Step 2。 |
| 本步状态 | `completed / pass; stop review` |
| 输入基线 | Step 1 输入映射；current `00~03`；03 Step 14 配置与外部绑定；旧 `05/06` 仅作方向。 |
| 正式文档写入 | 关闭；本 Step 只形成 §2 回填草稿，不创建正式 `04-配置设计.md`。 |
| 下一动作 | 等待用户 review；确认后读取 Step 3 标准和输入，创建 `04_config_step_03_control_plane.md`。 |
| 提交 | 不需要；未经用户明确要求不提交。 |

## 2. 本步目标

把 Step 1 已确认的配置输入转成可执行的配置设计范围，回答：

1. 当前 P0 必须定义哪些配置控制面，才能装配本地可验证、blocked-aware 的工具行动契约 runtime。
2. 哪些能力只作为 P1/P2 或 future 设计触发器，不能混入 P0 schema。
3. 哪些内容必须留给 03、05、06、07、部署运维、ADR 或外部 owner。
4. `L2-tools` 是否可走“无配置项目”简化路径。
5. 哪些非范围风险会在后续 Step 7/8/9/11/14 重新审计。

本 Step 不定义配置 key、JSON schema、具体默认值、环境变量、secret/provider、产品 endpoint、timeout 数值、调度表达式、部署命令或实现批次。

## 3. 本步输入

| 输入 | 已收口内容 | 本 Step 使用方式 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | current/historical 输入层级、不再回答和必须回答问题、blocker 对配置影响。 | 作为范围边界和 future trigger 来源。 |
| `03-详细设计.md` §13.1~§13.9 | candidate/root、loader/validator/builder、七 Store、七 Port、fallback、timeout/retry/degraded、25 红线。 | 逐项映射 P0/P1/P2 与非范围。 |
| `03_ddd_step_14_config_external_binding.md` §5~§15 | config sections、唯一读取者、协议族绑定、Port seam、adapter fallback、配置失败影响。 | 确保每个范围项可回指 03，不新增 runtime type。 |
| `00/01/02` current formal | 定位、owner、依赖分类、模块/数据写权、配置影响轮廓。 | 防止配置扩大到 runtime orchestration、registry、Sandbox/Observability truth。 |
| 旧 `05/06` | dev/test/staging 方向和 config failure/safety gate 方向。 | 后续 Step 6/12 参考，当前不继承旧环境事实、阈值或结果。 |
| 配置 SOP/规范 | P0/P1/P2、非范围去向、无配置路径和回写门禁。 | 约束本 Step 的表格与结论。 |

## 4. SOP 问题回答

### 4.1 P0 必须定义哪些配置才能运行主链？

P0 的“运行主链”是本地可验证、blocked-aware、无伪 readiness 的 runtime composition，不是 external positive E2E。必须覆盖：

| P0 配置面 | 必须定义的语义 | P0 可运行结果 | 不得推断 |
|---|---|---|---|
| profile/config identity | 显式 profile、source attribution、redacted config ref/issue ref。 | candidate 可被严格解析、归因和审计。 | profile/config ref 不产生 actor、authority、truth 或 readiness。 |
| boundary/entries | Command/Query/Consumer/Job 的 size/page/schema/version/bounded request 类别。 | entry 可在调用 application 前 fail-fast。 | 不改变 metadata、DTO、actor、idempotency、cursor 语义。 |
| seven Stores + UoW | 每个 logical Store 的 adapter ref、required capabilities、shared UoW/capability marker。 | 本地 truth/attempt/ref/projection 可按 03 原子/CAS/append 契约装配。 | 不允许 cache/file/memory 隐式降级成 production truth。 |
| idempotency/replay | Command/Consumer/Continuation/Job 的 sidecar ref、retention category、stored surface capability。 | duplicate 可回放 immutable stored result/receipt/report。 | 不重跑 flow，不从 current truth 重建。 |
| projection | read adapter、freshness/rebuild/bounded page、job enablement。 | Query 可表达 fresh/stale/rebuilding/unavailable，Job 可 bounded rebuild。 | Query 不刷新/写入；projection 不代替 core truth。 |
| jobs | 四个 Job 的 enabled/scope/batch/parallelism/timeout/retry category。 | Job 可 bounded run 并形成 report surface。 | 不生成 run/evidence/readiness；不修 subject。 |
| adapters | Core/Hub/caller/Auth/Sandbox/source/collaboration/visibility 的 adapter slot、availability 和 blocked-aware mode。 | 未闭口 seam 仍有完整 typed blocked adapter；本地 negative path 可运行。 | endpoint/ref/fake 不等于 formal provider/positive response。 |
| handoff/targets | target refs、enabled branches、one-call fence category、local failure/unknown surface。 | safe material 可形成本地 eligibility/material/attempt；无 target 明确为无尝试。 | 不声明 route/delivery/observed/executed。 |
| clock/ID | 独立 adapter ref；test deterministic profile。 | application 可显式注入 time/ID。 | clock/ID 不生成 semantic identity/digest authority。 |
| features | 只控制外围 outbound event/projection/status job registration。 | 可明确 disabled/degraded 外围 surface。 | 不关闭 identity/admission/outcome/audit/idempotency/fail-closed/no-write。 |
| redaction/diagnostics | 固定 body-free/redaction floor、safe config issue/log/metric/trace labels。 | invalid/blocked/degraded 可安全观测。 | 不允许 debug/emergency 输出 raw body、secret、credential、stack trace。 |

### 4.2 哪些配置属于 P1/P2 或后续扩展？

| 层级 | 配置方向 | 当前文档处理 | 进入当前契约的前置 |
|---|---|---|---|
| P1 | durable Store 实体产品、共享 transaction driver、real-like adapter conformance、真实 secret locator、staging-like profile。 | 定义 product-neutral capability/ref、失败和 qualification gate；不写供应商字段/真实值。 | ADR/产品选择、capability test、secret/no-output 方案、必要 03 回写。 |
| P1 | Authorization/Sandbox/source/collaboration positive adapter。 | 只保留 blocked slot 和 future qualification 规则。 | `L2T-UP-001~006` 对应 owner/schema/mapping/route 正式闭合。 |
| P1 | Core tools-specific shared schema 和 SDK tools client integration。 | 只保留 candidate/future consumer seam。 | `L2T-UP-008~009` 正式合同和 exact type/client coverage 闭合。 |
| P1 | production-like observability sink、alert/retention/capacity parameters。 | 只定义 safe handoff/diagnostic 接缝和 future trigger。 | measurement/evidence authority、SLO/ops owner、产品选择。 |
| P2 | remote config/config center/admin override、runtime hot reload、online last-known-good。 | 当前 schema 中 unsupported；出现对应 key/source 即 reject。 | 先重开 03 builder lifecycle、source priority、audit、rollback 和 partial failure 设计。 |
| P2 | multi-region/multi-tenant、dynamic routing、vendor-specific schema、capacity auto-tuning。 | 非范围/演进队列，不生成 P0 key。 | 新需求/架构/03/04 全链重开。 |
| P2 | marketplace/MCP/A2A/API registry、SDK client generation、runtime planning/recovery。 | 永不由当前 04 吸收。 | 回到对应 owner/正式文档，而非增加 L2 配置开关。 |

### 4.3 哪些配置细节应留给部署与运维手册？

部署与运维文档负责环境实例化，不反向定义配置语义。以下内容不进入当前 04：

- 配置文件实际路径、挂载、权限、owner/group、容器/主机目录和部署命令；
- 环境变量注入命令、secret provider/KMS/Vault 操作、证书安装与轮换步骤；
- 真实 endpoint/topic/queue/consumer group/DSN/credential/target 值；
- 进程拓扑、scheduler 安装、扩缩容、backup/restore、pager、dashboard、告警路由和 runbook；
- 真实生产 SLO、容量、保留、超时、retry/backoff 和告警阈值的运维调优。

04 只提供这些值必须满足的类型、范围、敏感级别、来源、优先级、验证、生效、失败和审计规则。

### 4.4 哪些配置细节应留给实施计划？

`07-实施计划.md` 承接：

- `infra/config.rs` parser/validator、`runtime_builder.rs`、adapter/store registry、entry/job wiring 的实施顺序；
- 每个配置域对应的 planned boundary skeleton、任务、commit boundary 和测试/验收门禁；
- fake -> durable/real-like 的 qualification/迁移实施批次；
- config fixture/sample/schema、migration tooling、config digest、report/artifact 路径的落地任务；
- 实现仓创建、Cargo/path dependency、目录、脚本、CI 和 rollback 提交策略。

04 不写 commit 数、commit hash、实现人员、排期、真实 evidence alias 或已完成状态。

### 4.5 哪些非范围仍有残余风险？

| 残余风险 | 影响后续 Step | 当前处理 |
|---|---|---|
| 具体 Store/UoW 产品未选 | Step 7/8/9/11/14；05/06/07/09 | 先定义 required capability/ref；产品字段不得进入 P0。 |
| external owner/schema/mapping/route 未闭 | Step 6/7/9/11/14；positive test/readiness | P0 固定 blocked-aware adapter/fail-closed；不写 positive profile。 |
| secret provider 未选 | Step 7/8/9/10/11 | 普通配置只保存 opaque sensitive ref；raw material 由 future private resolver/运维承接。 |
| timeout/retry/retention/SLO 数值无 measurement authority | Step 7/11/12/14 | 只定义 safe bounded category/范围与 future qualification，不伪造性能目标。 |
| 旧 05/06 尚未重建 | Step 6/12/14 | 只提取方向；正式 04 后按新基线重建。 |
| 目标实现仓不存在 | Step 7/9/12/14；07 | 所有 path/type/config 示例为 planned contract，不声明实现或验证。 |
| future 能力可能要求新增代码契约 | Step 7~14 | 一旦触发 `ToolsRuntimeConfig`/builder/Port/error/flow/state 变化，先回写 03。 |

## 5. 当前材料问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| Step 1 必答清单 | 尚未区分当前可交付与 future trigger。 | 按 P0/P1/P2/Forbidden 分层。 |
| `03` §13 config binding | 列出 typed sections 和 binding，但未给 04 的范围/去向。 | 映射为十一个 P0 配置面和 P1/P2 qualification。 |
| 旧 `05/06` | dev/test/staging、policy/result/audit 等旧主语不可直接复用。 | 只保留环境矩阵和 config safety gate 的方向。 |
| external blockers | 可能被误读为阻塞整份 04。 | 收窄为阻塞 positive external profile/readiness，不阻塞 local/negative P0 配置设计。 |
| 具体产品/数值 | 当前没有正式 authority。 | 不写进 P0 key/value；留 ADR/07/09/future reopen。 |

## 6. 改动前后对比

| 项 | Step 1 后 | Step 2 后 | 原因 |
|---|---|---|---|
| 配置范围 | 列出必须回答的问题族 | 固定 P0 十一个配置面、P1 qualification、P2 unsupported/future | 支撑 Step 3 控制面拆分。 |
| external blocker | 映射到配置影响 | 明确只阻塞 positive profile/readiness，不阻塞本地 P0 | 防止全局停滞或伪闭口。 |
| 产品与数值 | 尚未归属 | 产品/真实值去 ADR/07/09，04 只定义 schema/validation/failure | 保持产品中立和事实纪律。 |
| 无配置路径 | 初步判断不适用 | 通过正式矩阵判定不适用，Step 3~13 全部适用 | 满足 SOP 无配置门禁。 |
| 03 影响 | 有 future trigger | 当前 P0 不触发；future 一旦入范围先回写 03 | 允许继续 04 且不静默改代码契约。 |

## 7. 配置设计取舍

| 议题 | 选择 | 取舍 |
|---|---|---|
| P0 的含义 | local/CI/integration-like 可验证且 blocked-aware，不等于 production ready | 让本地 contract/negative path 可落地，同时不伪造 external 正向链。 |
| Store P0 基线 | 定义 capability-complete fake 与 production required capability，不指定实际 durable 产品 | fake 可测试 contract；生产缺 capability 必须 fail-fast，不能自动 fallback。 |
| external seam | required slot 始终存在；未闭口绑定 blocked-aware adapter | 避免 null/no-op，同时不把 fake/endpoint 当 provider。 |
| profile 层级 | P0 只允许 local/CI/integration-like；staging-like 是 P1 candidate，production-like 为 blocked/future | 防止 test fixture/blocked seam 被误标 production。 |
| feature 配置 | 只控制外围 runner/event/projection/status registration | 核心 identity/admission/outcome/audit/idempotency/gates 永远启用。 |
| P2 sources | config center/admin/hot reload/LKG 不预留当前成功 key | 当前 03 无 lifecycle contract，出现即 reject 并触发设计重开。 |

## 8. 结构化中间产物

### 8.1 配置设计目标表

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| 闭合唯一配置控制面 | 从 strict JSON/default/env/opaque ref 进入 `ToolsConfigCandidate`，经 validator 和 runtime builder 暴露 entry facade。 | Step 3 来源链、控制面和配置域。 |
| 闭合安全与事实边界 | 把 `NC-L2T-001~025`、forbidden body、fail-closed、atomic pair、unknown fence 固定为不可配置化。 | Step 4 禁止项和 Step 9/11 negative validation。 |
| 闭合配置来源与 profile | 定义普通来源优先级、profile isolation、test fake 和 blocked external 规则。 | Step 5/6 来源冲突与环境矩阵。 |
| 闭合配置项 schema | 为 P0 section 给出 exact path/type/default-or-required/source/scope/activation/sensitivity/failure/consumer。 | Step 7 配置项、严格 JSON module/full demo。 |
| 闭合敏感/no-output | 普通配置只持 opaque ref，raw secret/material 私有解析；log/error/audit/report 不输出。 | Step 8 敏感表和泄露审计。 |
| 闭合加载与 composition | section/type/cross-field/capability/forbidden override 验证，builder only-after-complete expose。 | Step 9 加载图、校验表和 activation contract。 |
| 闭合变更/失败/恢复 | startup/new-entry/new-job 生效，变更有 digest/audit/rollback；invalid/blocked/unknown 不混淆。 | Step 10/11 变更、回滚和失效矩阵。 |
| 闭合下游与演进 | 为 `05/06/07/09` 提供可直接引用的配置门禁，future 能力有 reopen 条件。 | Step 12~14 下游、迁移和风险。 |

### 8.2 本轮覆盖范围表

| 范围 | 当前必须闭合 | 不允许越界 | 后续 Step |
|---|---|---|---|
| profile/config identity | profile、config source/ref、strict selection、redacted attribution | actor/authority/truth/readiness | 3/5/6/7/9/10 |
| boundary/entries | Command/Query/Consumer/Job bounds、schema/version allowlist、entry selector | 改 DTO/metadata/idempotency/actor/cursor | 3/4/7/9/11 |
| stores/UoW | 七 Store refs、required capabilities、shared atomic authority、fake parity | 产品/DDL/hidden transaction/atomicity downgrade | 3~5/7/9/11 |
| idempotency/replay | sidecar ref、retention category、stored result/receipt/report capability | digest/key/replay/unknown 语义变化 | 3~5/7/9/11 |
| projection | store/ref、freshness/rebuild/page、job activation | Query refresh/write/live fallback/core prerequisite | 3/4/6/7/9/11 |
| jobs | four job enablement、scope/batch/parallelism/timeout/retry category | subject repair、run/evidence fabrication、whole-scan retry | 3/4/6/7/9/11 |
| external adapters | seven Port slots、adapter ref、availability、version/authority/body policy、blocked mode | external truth/provider/readiness/host bypass | 3~9/11/14 |
| handoff/collaboration | target ref set、event branch、one-call fence、local disposition | route/delivery/observed/executed、second call after unknown | 3~11 |
| clock/ID/visibility | independent refs、test deterministic、scope resolution | semantic identity/digest、default visible | 3/6/7/9/11 |
| features | peripheral event/projection/status registration | core gate/outcome/audit/idempotency/no-write | 3/4/7/9/11 |
| redaction/diagnostics | safe issue/log/metric/trace categories、redaction floor | raw body/secret/credential/stack/high-cardinality data | 3/4/7~12 |

### 8.3 P0 / P1 / P2 / Forbidden 口径

| 等级 | 配置口径 | 是否进入当前 schema | 典型例子 |
|---|---|---|---|
| P0 | 支撑 local-dev、CI、integration-like 的 complete local composition 和 blocked external seam；可实现、可测试、不可冒充 production。 | 是 | explicit profile、strict boundaries、capability-complete fake Store、blocked adapters、bounded jobs、opaque refs、redaction floor。 |
| P1 | formal 03 已存在 seam 的 product-neutral durable/real-like qualification 与 staging-like candidate。 | 只定义已有 ref/capability/blocked-to-qualified 条件；不写供应商字段/真实值。 | durable adapter ref、formal external adapter candidate、secret locator、staging-like qualification。 |
| P2 | 需要新增 lifecycle/source/tenant/region/vendor contract 的未来扩展。 | 否；当前出现即 unsupported/reject。 | config center、admin override、hot reload、online LKG、multi-region、vendor schema。 |
| Forbidden | 会改变 truth、owner、state、transaction、security、idempotency、phase fence 或 external status ownership 的开关。 | 永不生成。 | default allow、host bypass、outcome-only commit、query write、raw-body diagnostic、fake-as-production。 |

### 8.4 非范围与唯一去向

| 非范围 | 唯一去向 |
|---|---|
| 需求目标、业务主语、owner、功能/非功能验收目标变化 | `00-需求文档.md` 和用户/产品决策。 |
| 架构依赖、容器、数据 owner、技术产品、部署拓扑变化 | `01-架构设计.md` / ADR。 |
| runtime config root 字段、builder lifecycle、adapter constructor、Port/Store trait、DTO/error/flow/state 变化 | 先回写 `03-详细设计.md` 和对应 calibration Step。 |
| 完整测试 suite/case/data/environment automation、真实 report/evidence/result | full-restart `05-测试方案.md` 和真实执行。 |
| 验收门禁、阈值、VETO、风险接受、reviewer/signoff | full-restart `06-验收标准.md`。 |
| phase/task/commit boundary、implementation ledger、boundary skeleton、实现仓创建与迁移执行 | `07-实施计划.md`。 |
| config path/mount、env injection command、secret provider 操作、endpoint/DSN/topic 真实值、runbook/alert/dashboard | `09-部署与运维手册.md`。 |
| Authorization/Sandbox/Bus/Observability/Core/SDK 外部 contract truth | 对应上游/下游正式 owner；04 只绑定 ref/blocked surface。 |
| agent loop、LLM planning、runtime orchestration/recovery、registry/marketplace/MCP/A2A/API inventory/client | 对应 Runtime/Hub/SDK/分发 owner，不进入 L2 配置。 |

### 8.5 无配置路径判定

| 判断项 | 结论 | 依据 |
|---|---|---|
| 是否存在 typed config candidate/root | 是 | `ToolsConfigCandidate` / `ToolsRuntimeConfig`。 |
| 是否存在 config loader/validator/builder | 是 | `ConfigSource::load`、cross-section validation、`ToolsRuntimeBuilder::from_validated_config`。 |
| 是否存在 required local composition | 是 | 七 Store/UoW/idempotency/Clock/ID/visibility。 |
| 是否存在 external adapter/target binding | 是 | 七 Port、adapter registry、handoff target set。 |
| 是否存在 entry/job/projection/feature 参数 | 是 | boundary、jobs、projection、features sections。 |
| 是否存在 sensitive/redaction/no-output 设计 | 是 | forbidden body/secret/ref/diagnostic/redaction floor。 |
| 是否可走“无配置说明”路径 | 否 | 缺上述配置无法形成 complete candidate/builder validation，或会把 blocked/invalid 隐藏为 ready。 |

结论：Step 3~13 全部适用，不得跳过；正式 04 必须采用 15 章完整主链。

### 8.6 非范围残余风险表

| 风险 | 阻塞范围 | 未确认前处理 |
|---|---|---|
| durable Store/UoW 产品和 transaction capability 未锁定 | P1 durable 实接、production readiness、相关 test/evidence | P0 使用 capability-complete fake；production profile 不可启用。 |
| `L2T-UP-001~009` 未闭口 | 对应 positive adapter/profile/E2E/readiness | blocked-aware slot + fail-closed/unknown；不写 positive result。 |
| secret provider/rotation API 未锁定 | P1 private resolution/rotation/health | 普通配置仅 opaque ref；raw secret 拒绝。 |
| measurement/SLO/capacity authority 未锁定 | 量化 timeout/retry/retention/alert、05/06 threshold | 只给 bounded safe range/category；不伪造目标。 |
| 旧 05/06 和缺失 07/09 | 测试、验收、实施、运维闭环 | Step 12 提供输入；后续严格顺序重建。 |
| 实现仓不存在 | 代码/config sample validation/readiness | 所有内容标 planned，不声明执行事实。 |

## 9. 对详细设计的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 覆盖 profile、boundary、stores/UoW、idempotency、projection、jobs、adapters、handoff、clock/ID、features | 否 | 对既有 `ToolsConfigCandidate` sections 的配置语义具体化 | `03` §13 已闭合 | 无回写 |
| P0 external seam 只允许 blocked-aware/disabled/fake，positive profile 受 `L2T-UP-001~009` 阻塞 | 否 | 既有 adapter availability/fallback 具体化 | `03` §1.5/§13.5~13.6 | 无回写 |
| P0 不支持 config center/admin override/hot reload/online LKG/multi-region/vendor schema | 否 | 明确 unsupported/future | 不适用 | 无回写 |
| 当前不锁定数据库/broker/scheduler/secret/telemetry 产品和真实值 | 否 | 保持 03 产品中立 | `03` §3/§13 | 无回写 |
| future 若新增 root 字段、builder lifecycle、constructor、Port/Store trait、error/DTO/flow/state | 是 | future 代码契约变化 | 对应 `03` §4~§15/calibration Step | 无回写（future trigger；Step 3~13 已确认当前未触发） |

本 Step 没有当前 `待回写` 项。最后一行是 future trigger；Step 14 必须复核其是否被 Step 3~13 的具体配置项触发。

## 10. 回填草稿

正式 `04-配置设计.md` §2 应回填：

- 配置设计目标表；
- P0 配置面和本轮覆盖范围；
- P0/P1/P2/Forbidden 分层；
- 非范围与唯一去向；
- 无配置路径判定；
- non-scope residual risks；
- 当前 P0 无 03 回写、future code-contract trigger 先回写的声明。

不得在 §2 提前列 exact key/value、环境变量、产品/endpoint/secret、部署命令、测试结果或实现状态。

## 11. 待确认事项

| 待确认事项 | 当前影响 | 需要谁确认 | 未确认前处理 |
|---|---|---|---|
| 用户是否确认进入 Step 3 | 影响下一中间产物创建 | 用户/项目负责人 | 保持正式 04 write-closed，停在 Step 2 review gate。 |
| P1 durable/real-like/staging-like 是否进入近期路线 | 不影响 P0 04；影响 product-specific 03/04/07/09 | 架构/产品/实施/运维 | 只保留 qualification gate，不进入 P0 schema。 |
| P2 config center/hot reload/LKG 是否需要 | 不影响 P0；如需要会改变 builder lifecycle | 架构/运行时/安全/运维 | 当前出现即 reject；先重开 03。 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 必须配置面已列全 | 通过 | §4.1、§8.2。 |
| P1/P2/future/Forbidden 分层明确 | 通过 | §4.2、§8.3。 |
| 部署运维和实施计划去向明确 | 通过 | §4.3~4.4、§8.4。 |
| 非范围残余风险有处理 | 通过 | §4.5、§8.6。 |
| 无配置路径判定完成 | 通过 | §8.5；完整 Step 3~13 适用。 |
| 03 影响判定完成 | 通过 | 当前无回写；future trigger 保留。 |
| 正式 04 是否提前写入 | 否 | 本 Step 只生成回填草稿。 |
| 下一动作 | 停审 | 用户确认后创建 Step 3。 |
