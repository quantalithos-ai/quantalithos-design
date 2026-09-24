# Step 1. 确认测试输入边界

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 1
> 回填章节：`05-测试方案.md` §1
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| current_document | `05-测试方案.md` |
| current_step | Step 1 |
| current_module | `input_boundary:formal_sources_and_blockers` |
| gate_status | `pass_for_step_02` |
| gate_reason | 输入、权威级别、不再回答/必须回答问题、历史污染和执行 blocker 均已定位；可进入测试范围设计。 |
| formal_05_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 2 |

## 2. 本步输入

| 输入 | 状态 | 本 Step 使用方式 |
|---|---|---|
| 正式 `00-需求文档.md` | `formal_stop_review` | 抽取 5 个能力节点、16 项 FR、25 条 BR、11 项 AC、六类 NFR 与 owner/data 红线。 |
| 正式 `01-架构设计.md` | `formal_stop_review` | 抽取 Layer 5、SDK-first、truth ownership、依赖裁剪、跨平台和技术中立约束。 |
| 正式 `02-概要设计.md` | `formal_stop_review` | 抽取六个组成部分、关键对象、Command/Query/Job 骨架、处理流、状态和异常。 |
| 正式 `03-详细设计.md` | `completed_with_upstream_blockers` | 抽取七模块、对象/port/协议/flow/state/UoW/error/idempotency/config/observability 正式契约。 |
| `03_ddd_step_16_test_slices.md` | `completed_with_upstream_blockers` | 作为 11 Command、12 Query、4 Consumer、0 Event、5 Job、21 状态及一致性/安全切口直接输入。 |
| 正式 `04-配置设计.md` | `completed_with_upstream_blockers` | 抽取 41 项、四 profile、严格文档、builder/readiness、失败、回滚及下游测试承接。 |
| 专项上游正式 `00~05` 与必要台账 | 当前事实快照 | 核验 Runner-facing positive seam、依赖类型和 blocked scope，不复制私有实现。 |
| 旧 `05-测试方案.md` / `06-验收标准.md` | `historical_material` | 仅扫描旧对象、旧阈值、旧证据路径与验收关注方向。 |
| 测试 SOP / 书写规范 / 通则 / 中间产物 / truth closure / 依赖规则 | 当前规范 | 固定 15 Step、15 章、三层门禁、证据真实性和依赖测试方式。 |

## 3. SOP 问题回答

| 问题 | 收口回答 | 依据 |
|---|---|---|
| 承接哪些需求、规则和非功能目标？ | 承接 `CP-RUN-01~05`、`FR-RUN-001~016`、`BR-RUN-001~025`、`AC-RUN-001~011`，以及性能、可用性、安全、审计/追溯、幂等/一致性、可观测性六类 NFR。 | `00` §7～§16 |
| 哪些设计直接影响测试对象？ | `03` §5～§15 是直接真相源；特别是七模块、11/12/4/0/5 协议库存、21 状态、external-I/O/UoW 顺序、Unknown/RecoveryCase、幂等和 no-write/no-replay/no-parse/no-truth-repair。 | `03` §5～§15、Step 16 |
| 哪些验收方向需要证据？ | `AC-RUN-001~011` 全部需要 planned EV；06 尚未重建，因此本轮只定义候选证据绑定，不形成裁决或 signoff。 | `00` §14；旧 06 仅历史方向 |
| 哪些内容不得重定义？ | 需求编号、owner、对象字段、DTO、port、状态、错误、flow、事务、配置项/profile/default、安全红线、验收结论和实施路径。 | 设计通则、truth closure、正式 00～04 |
| 上游缺口是否阻塞测试设计？ | 不阻塞语义测试设计；阻塞真实实现测试、durable parity、正向跨仓 integration、production NFR 和 release evidence。必须以 `blocked/planned` 显式保留。 | `RUN-UP-*`、`RUN-DDD-*`、`RUN-OPS-*` |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本 Step 处理 |
|---|---|---|
| 旧 05 以 `RunnerRun`、`RunQueueEntry`、`TriggerRetry/Replay/Kill` 等旧模型组织 | 与新版 `ReleaseSelection`、`RunIntent`、`ControlIntent`、`OwnerRunProjection`、`RecoveryCase` 冲突 | 全部标为 historical；Step 15 删除旧文件重建。 |
| 旧 05 只有 12 章，缺 SOP 规定的对象切口、数据、环境、证据真实性等完整主链 | 无法追溯或被 06 可靠消费 | 新版严格按 15 Step / 15 章生成。 |
| 旧 05/06 固定 `<200ms`、`<1s`、`100%` 等无当前 authority 数字 | 会伪造 NFR 阈值和 readiness | 不继承；仅定义测量方法，等待 workload/SLO authority。 |
| 旧 05 证据路径为待定、无固定 run_id 和 raw artifact → report 关系 | 可能静态造证据或引用 `latest` | 新版固定 planned `artifacts/test/<run_id>` 与 `reports/runs/<run_id>`，但不生成。 |
| 目标实现仓/语言/test runner 不存在 | 无法命名真实测试文件或执行命令 | suite/script 只定义逻辑合同和标准目录；保持 planned/blocked。 |
| 上游 Runner-facing exact DTO/API 未闭合 | 正向 integration 无法诚实执行 | 使用 semantic fake 和 negative contract；真实正向案例进入 blocker。 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 输入权威 | 旧 03/05/06 混读 | 正式 00～04 + 03 Step 16/04 Step 12 为唯一正向输入 | 防止旧模型覆盖当前设计。 |
| 测试对象 | 五条旧 UI 主线 | 六个业务组成部分 + 七模块 + 正式协议/state/config/owner seam | 与可落码契约对齐。 |
| 上游缺口 | 容易被 fake 隐藏 | 语义设计可继续，真实 execution/integration 明确 blocked | 保持事实诚实。 |
| Evidence | 模糊截图/日志/待定路径 | 先设计 TC/EV/suite/artifact/report 绑定，执行事实保持不存在 | 支撑后续 06 且不伪造。 |

## 6. 测试设计取舍

| 议题 | 备选 | 结论 |
|---|---|---|
| 是否继承旧用例 | 直接迁移 / 仅冲突扫描 | 仅冲突扫描；正式名称全部来自新版 03/04。 |
| 是否等待所有上游合同闭合 | 全部等待 / 先做语义级与负向设计 | 后者；blocked 正向 seam 不影响本仓安全契约测试设计。 |
| 是否以 fake 证明 integration ready | 允许 / 禁止 | 禁止；fake 只证明 Runner 编排和边界，不证明 owner 产品合同。 |
| 是否现在固定语言和命令 | 固定旧 Rust/Tauri / 技术中立 planned contract | 后者；不从 README 继承。 |
| 是否定义 EV | 不定义 / 定义 candidate ID 与未来来源 | 定义 candidate ID；未绑定真实固定 run_id 前不称实际 evidence。 |

## 7. 结构化中间产物

### 7.1 上游输入映射

| 来源 | 测试输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | CP/FR/BR/AC/NFR、owner/data/安全边界 | §1、§2、§5、§10、§12～§14 |
| `01-架构设计.md` | SDK-first、依赖分类、truth ownership、跨平台、技术中立 | §1～§4、§8、§10、§14 |
| `02-概要设计.md` | 六组成部分、对象/API/flow/state/异常/page/read model | §1、§3、§4、§6～§8 |
| `03-详细设计.md` | 七模块、对象/port、11/12/4/0/5 协议、21 状态、UoW/error/idempotency/config/observability | §1、§3～§11 |
| `03_ddd_step_16_test_slices.md` | 最小 test cuts、fake capability、全局断言、脚本语义 | §3～§10、§13 |
| `04-配置设计.md` / Step 12 | 41 项、四 profile、parser/validator/builder、failure/change/rollback、证据候选 | §1、§3、§6～§10、§12～§14 |
| 专项上游 | public seam readiness 与 blocked positive integration | §1、§2、§8、§10、§14 |
| 旧 05/06 | 旧模型和无来源阈值污染；验收方向提醒 | 只进入诊断/风险，不直接回填 |

### 7.2 不再回答的问题

- 不决定 Release/Artifact、Governance approval/baseline、Runtime execution、Sandbox isolation/lease/cleanup、Observability evidence 或 Archive truth。
- 不补上游 exact SDK method、DTO、transport、topic、private backend、store schema 或产品选择。
- 不选择 Rust/Tauri/Docker/gVisor/Firecracker，不命名不存在的 crate/package/test target。
- 不把 ACK、HTTP 200、PID、端口、cache、local log、handoff receipt 当运行成功、cleanup 或正式 evidence。
- 不做验收裁决、风险签署、实现阶段/commit、部署命令或运维 SLO。

### 7.3 测试方案必须回答的问题

- 五个能力节点和全部 P0 设计契约应在哪个最小层级被发现问题。
- 六个业务组成部分、七模块、32 条 inbound/job flow、21 状态和 41 项配置如何形成可执行切口。
- 11 Command 如何覆盖校验、duplicate/conflict、external ambiguity、UoW 和 stored result；12 Query 如何证明 no-write。
- 4 planned Consumer 如何证明 header-first/no-payload/no-ACK，0 outbound event 如何做 no-residue；5 Job 如何证明 no truth repair。
- selection/material/run/control/resource/recovery/preview/diagnosis/handoff 状态如何覆盖正向、负向、边界、并发、一致性和恢复。
- 测试数据、环境、fake/real-like、配置、suite、gate、artifact/report/EV 如何稳定映射且不伪造成熟度。

### 7.4 专项上游成熟度快照

| 依赖 | 当前可测 seam | 当前阻塞的正向 seam |
|---|---|---|
| L0-sdk | semantic ref/error/trace/redaction boundary、SDK-first static dependency check | exact client/version/method/error mapping |
| L1-artifact | formal ref/version/baseline/consumption概念及边界负测 | locator/manifest/digest/signature/revoke/expire Runner consumption contract |
| L1-governance | decision/approval truth ownership与不可本地批准 | Runner-facing applicability/scope/expiry/revoke/conflict chain |
| L1-work / workspace | project/context safe ref、visibility/selection boundary | exact Runner context read contract |
| L2-runtime | execution truth ownership与只读边界 | Runner-safe status/result/recovery DTO |
| L4-sandbox | request/boundary/lease/cleanup 安全概念和 ACK≠Running | Runner-facing exact request、idempotency、orphan/reaper/cleanup DTO |
| L4-observability | diagnostic/evidence owner boundary和 redaction 要求 | safe diagnostic/handoff/receipt/freshness/retention seam |
| L4-archive | archive/restore truth owner 与非核心边界 | Runner-facing正向 reference/restore consumption |

## 8. 回填草稿

正式 §1 应声明：本测试方案只把正式 00～04 转化为可执行、可追溯、可留证的 planned 验证合同；03/Step 16 是字段、状态、协议、错误和 test cut 的直接真相源，04/Step 12 是配置测试直接输入。旧 05/06、README 和 draft 不具权威性。语义 unit/service/fake/negative-contract 测试可设计，真实 durable 与跨仓正向 integration、production NFR 和 release evidence 仍受 blocker 约束。

## 9. 待确认事项

| 事项 | 影响 | 截止点 / 当前处理 |
|---|---|---|
| 目标实现仓、语言、test runner | 真实测试文件、命令、fixture 无法定位 | 07/implementation precheck；05 只定义 planned contract |
| exact SDK/owner seams | positive integration 用例不可执行 | owner 合同闭合前只 fake/negative/blocked |
| durable store/cache/platform products | durable parity、migration/corruption、跨平台矩阵不可实测 | `RUN-DDD-003` / `RUN-UP-007` |
| production workload/SLO | 性能/容量阈值无 authority | Step 10 只定义采样与阈值来源门禁 |
| 新版 06 | AC/VETO 最终裁决与 risk acceptance 未形成 | 05 产出候选 EV；06 后续 full-restart |

## 10. 进入下一步条件

- [x] 输入文档与权威级别明确。
- [x] 不再回答与必须回答的问题明确。
- [x] 旧材料污染已识别且不继承。
- [x] 测试设计可继续与测试执行不可开始的边界明确。
- [x] blocker 有安全处理，不会由 fake 或文档状态伪装关闭。

Step 1 完成，允许进入 Step 2；正式 05 仍不可写。
