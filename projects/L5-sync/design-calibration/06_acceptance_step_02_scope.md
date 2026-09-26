# Step 2. 明确验收目标与范围

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 2
> 回填位置：正式 `06-验收标准.md` §2

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 2 / scope |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 本步输入 | Step 1 输入边界、00 目标/非目标、05 范围矩阵 |
| 下一步 | `Step 3 / baseline` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 作用 |
|---|---|---|---|
| `CP-SYNC-01~06` | 00 §7、05 §2/§5 | `available` | 验收能力主线 |
| `FR-SYNC-001~015` | 00 §9 | `available` | 功能范围和外围触发 |
| `AC-SYNC-001~020`、`VETO-SYNC-001~005` | 00 §14 | `available` | 验收编号与硬红线 |
| 29 objects / 10 Command / 13 Query / 3 Consumer / 3 Job / 17 states | 03、05 | `available` | exact design contract scope |
| 4 P0 profiles、42 config leaf | 04、05 | `available` | 配置与环境范围 |
| P0/P1/P2 矩阵和 blocker | 05 §2、§14 | `available` | 结论上限 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮核心裁决目标是什么？ | 判断 local sync contract 是否在明确选择/权限、来源绑定、materialize、安全本地修改保护、冲突恢复、Review handoff/provenance、姿态失效、配置、证据和红线方面满足可交付门禁。 | 00 §7/§14；05 §2 |
| P0/P1/P2 如何划分？ | P0 验 local invariant 与 controlled contract；P1 验真实 SDK/source/access/review/probe、metadata driver、Git/fs seam（合同闭合前 blocked/waiting）；P2 为批量预取、结果比较、归档引用、容量数字、LFS/浅克隆/GUI 等 future/deferred。 | 05 §2.1、§2.2、§10、§14 |
| 哪些下游只验接缝？ | Identity principal/access、Work project/posture/member、Artifact source/version、Workspace projection/binding、Governance handoff/Decision、Archive posture/ref、Observability safe signal 只验 ref/snapshot/adapter/handoff seam，不验其 owner truth。 | 01 §5/§9；05 §1.1 |
| 哪些非范围影响结论？ | 非范围若越权成为 Sync truth、绕过 Review Gate、污染 dirty worktree、将 ACK/commit/log/cache 升格、泄露敏感正文，则转为 P0 红线/VETO；单纯未核验的外围能力保持 residual。 | 00 §10/§11/§14；03 §13/§14 |
| 哪些范围项可能一票否决？ | 自动 merge/rebase/push/stash/overwrite/blind replay；owner/权限/source/comparator unknown 仍危险执行；越权创建/改写外部 truth；provenance/冲突证据删除或伪造；敏感正文/credential 泄露；证据伪造。 | `VETO-SYNC-001~005`、05 §2.3 |
| 必须使用哪些正式名称？ | 所有门禁回指 03 的 exact object/protocol/state/config 名称；不使用旧 `SyncTask`、`SyncStatus`、泛化 `ConflictView` 作为主线。 | 03 §6～§15；历史污染审计 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| “全部验收”无法说明 P1/P2 边界 | 可能把未闭合外部能力误写为 P0 必过 | 建立 P0/P1/P2 范围表并明确 blocked/waiting |
| 只写命令成功，不写 owner/truth 边界 | ACK/commit/cache 可能被误认作平台事实 | 每个范围项同时列不能证明的外部 truth |
| 把外围 feature 当核心退出条件 | LFS、浅克隆、GUI 等无权威选择会阻断无关主线 | 置于 P2/deferred；不放宽核心安全门禁 |
| 只验 happy path | dirty、unknown、gap、revoked、archived、partial 等安全路径遗漏 | 将 fail-closed 和 manual action 纳入 P0 范围 |

## 5. 改动前后对比

| 维度 | 旧口径 | 当前口径 | 理由 |
|---|---|---|---|
| 主目标 | “能同步文件” | “受控同步入口的 local contract 与 owner boundary 可裁决” | 对齐平台 truth ownership |
| 核心范围 | 未区分外部仓和本地状态 | CP1～CP6 + local safety + handoff/provenance | 与 00/03/05 一致 |
| 外部依赖 | 默认端到端可用 | 只验接缝；合同未闭合即 blocked/waiting | 保留上游 blocker |
| 失败姿态 | 失败即重试/继续 | blocked/needs_action/conflict/unknown/manual | 防止危险副作用 |
| 外围能力 | 可能写成当前支持 | P2/deferred，需 future trigger | 不把历史选择当真相 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只验本地 happy path | 简短 | 无法裁决安全红线和外部边界 | 拒绝 |
| 把所有外部仓能力纳入 P0 | 看似完整 | 超出 Sync ownership，受阻时会诱发伪造证据 | 拒绝 |
| P0 local invariant + controlled seam；P1 real integration；P2 deferred | 结论边界清晰、与 blocker 对齐 | 正向 integration 暂不能完成 | 采用 |

## 7. 结构化中间产物

### 7.1 验收范围矩阵

| 范围项 | 类型 | 优先级 | 裁决目标 | 非范围/限制 |
|---|---|---:|---|---|
| CP1 selection/access | core local contract | P0 | principal、project、version/source、target、operation 显式；权限/姿态和 owner unknown fail-closed | 不拥有 Identity/Work truth；正向 owner contract blocked |
| CP2 binding/metadata | core local contract | P0 | binding、generation、manifest、cursor、mapping、provenance 关系可回链；migration/rebind guard 成立 | `.qs-sync` 物理 schema、driver、retention blocked |
| CP3 status/pull/materialize | core local contract + local tool seam | P0 | status zero-write；pull/clone 只在 source/comparator/path/dirty 安全时 materialize；cursor 仅 Finalized 推进 | source provider/Git/fs positive blocked |
| CP4 conflict/recovery | core local contract | P0 | conflict fact、checkpoint、manual resolution、probe、resume/cancel 可解释；不盲重放 | formal probe exact contract blocked |
| CP5 handoff/provenance | local candidate/attempt contract | P0 | candidate freeze、attempt-before-call、transport/probe/Decision 分层、provenance 保护 | Governance Gate/Decision owner truth blocked |
| CP6 posture/diagnostic | local projection/safety | P0 | access/source/review/archive posture 收紧；诊断 body-free/bounded；Query zero-write | Observability backend/evidence truth不属本仓 |
| 10 Command / 13 Query | public protocol | P0 | exact validation、result layer、Query no-write、known/partial/unknown | parser/exit code/tool library待确认 |
| 3 Consumer / 3 Job | conditional operations | P0 contract / P1 positive | 输入验证、保守失效、bounded item、exact replay、无 auto repair/submit | event/owner schema未闭合时 blocked |
| 42 config leaf / 4 profiles | configuration | P0 | strict JSON、source precedence、required/nullability、activation/failure/redaction | 实际 secret provider/部署未定 |
| SDK/source/access/review/probe integration | external seam | P1 | 合同闭合后证明 adapter mapping 和 fail-closed | 当前 `SYNC-UP-001~005/008` blocked |
| metadata/Git/filesystem physical integration | local infrastructure | P1 | 版本/原子可见性/dirty/path/LFS/浅克隆矩阵闭合后验证 | `SYNC-UP-006~010`、`SYNC-LOCAL-*` blocked |
| 批量预取、结果比较、归档消费、性能数字、LFS/浅克隆/GUI | peripheral | P2 | 只有明确选择和触发器后才扩大范围 | 不改变 P0 门禁 |

### 7.2 P0 能力到需求映射

| P0 能力 | FR | BR/AC | 主要计划证据 |
|---|---|---|---|
| selection/access | FR-SYNC-001~002 | BR-001~004；AC-SYNC-001、007 | `EV-SYNC-TRACE-001`、`EV-SYNC-FLOW-001` |
| binding/metadata | FR-SYNC-003~004 | BR-005、007、018；AC-SYNC-002、007、014 | `EV-SYNC-TRACE-001`、`EV-SYNC-CONFIG-001` |
| status/pull/materialize | FR-SYNC-005~006 | BR-006、008~010、020；AC-SYNC-003、008、011、012 | `EV-SYNC-FLOW-001`、`EV-SYNC-CONSISTENCY-001` |
| conflict/recovery | FR-SYNC-007~008 | BR-011~014、024；AC-SYNC-004、008、019 | `EV-SYNC-CONSISTENCY-001` |
| handoff/provenance | FR-SYNC-009~010 | BR-015、016、022、024；AC-SYNC-005、009、018 | `EV-SYNC-HANDOFF-001`、`EV-SYNC-TRACE-001` |
| posture/diagnostic | FR-SYNC-011~012 | BR-003、004、017~019、022；AC-SYNC-006、014、020 | `EV-SYNC-OPS-001`、`EV-SYNC-REDACT-001` |

### 7.3 范围裁决流

```text
explicit selection/access
  -> binding + metadata safety
  -> observe source/local state
  -> plan materialization
  -> dirty/conflict/gap/unknown gate
  -> safe local apply + finalize/cursor
  -> candidate freeze
  -> review handoff layers
  -> posture/provenance/diagnostic readback
```

其中任何 owner/access/source/comparator/dirty/path/provenance unknown 都只能进入 blocked/needs_action/conflict/unknown；不得以 P1/P2 能力替代 P0 安全判断。

## 8. 回填草稿

正式 §2 应声明本轮验收目标是裁决 L5-sync 的 local contract、边界红线和可复核证据是否成立。P0 覆盖 CP1～CP6、10 Command、13 zero-write Query、3 Consumer、3 Job 的 local/controlled contract、17 state、UoW/幂等/恢复、42 配置 leaf、4 P0 profile、redaction、证据完整性和 VETO。P1 真实外部/物理 integration 在合同闭合前为 blocked/waiting；P2 外围能力 deferred，不得放宽 P0 安全门禁。Sync 不拥有 Project、Artifact、Baseline、Review Gate、Workspace projection、Archive 或 Git remote truth。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 真实 source/access/review/probe contract | P1 正向验收仍 blocked/waiting | 对应上游合同闭合 |
| Git/fs/LFS/浅克隆/GUI 支持矩阵 | 工具适配和外围范围不裁决 | `SYNC-UP-007/009/010` 解锁 |
| P2 批量预取/比较/归档引用是否进入送验 | 只影响 future scope，不影响 P0 | 送验说明/新一轮基线 |

## 10. 进入下一步条件

- [x] P0/P1/P2 范围和非范围可裁决。
- [x] 每个 P0 能力已映射到需求、规则/AC 和计划证据。
- [x] 外部 truth、物理 integration 和历史选择的边界已明确。
- [x] 正式 §2 回填草稿已形成。
- [x] 本步完成后停审；进入 Step 3 前先读取 flow、台账、本文件和 05/00 基线来源。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- P0 范围不依赖外部正向成功；P1/P2 不得伪装为 P0 通过。
- 下一步阅读：验收基线 SOP、05 §8/§13、当前交付基线占位和证据路径规则，再创建 Step 3。
