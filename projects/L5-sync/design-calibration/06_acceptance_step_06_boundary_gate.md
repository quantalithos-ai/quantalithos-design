# Step 6. 定义数据边界与架构红线验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 6
> 回填位置：正式 `06-验收标准.md` §6

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 6 / boundary_gate |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 验收项范围 | `AC-SYNC-010~014`、架构红线候选 |
| 下一步 | `Step 7 / interface_sync_gate` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 数据归属与禁止保存清单 | `00-需求文档.md` §11 | `available` | Sync-local truth 与 forbidden body |
| 职责边界/数据所有权/依赖裁剪 | `01-架构设计.md` §4/§8/§9 | `available` | 架构红线 |
| 持久化/配置/观测边界 | `03-详细设计.md` §10/§13/§14 | `available` | local store、redaction、signal 分层 |
| 功能测试切口 | `05-测试方案.md` §3/§10/§15 | `planned` | architecture/redaction evidence plan |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些数据不得由本仓保存？ | Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、Git remote truth 及外部正文、credential/token/private key、raw stdout/stderr、evidence/report 正文。 | 00 §11；01 §9；03 §10/§14 |
| 哪些 projection/cache 不得反写真相？ | owner snapshot、status view、diagnostic、cache、job report、telemetry、handoff receipt 只能描述本地读取/交接姿态，不能创建或修改 owner truth。 | 00 BR-008/009/021/022；03 §7/§14 |
| 哪些 P1 能力不能污染 P0？ | SDK/Git/fs/metadata physical integration 未闭合时不得以 fake/cache/ACK/static mapping 代替真实 owner/physical truth；外围 LFS/浅克隆/GUI 不放宽 dirty/path/comparator 门禁。 | 05 §2、Step 2/3 |
| 红线失败是否一票否决？ | 越权写 owner truth、覆盖 dirty、自动 merge/rebase/push/stash、删除/伪造 provenance、泄露敏感正文和证据伪造进入 VETO 候选，Step 11 固定为否决项。 | `VETO-SYNC-001~005` |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| local session 与 platform lifecycle 混名 | Sync 可能声称拥有 Project/Artifact/Review 状态 | 明确 local-only object 与 owner ref 分离 |
| Git commit/remote object 被当作 platform truth | 破坏 Artifact/Baseline/Review ownership | 只允许观察/ref，不升格 |
| metadata/provenance 可被静默修复 | 破坏可追溯性和历史 | 只能 append/protect/supersede/integrity-unknown |
| dirty/untracked/path 规则没有红线级门禁 | 可能覆盖用户修改 | AC/VETO 明确 non-overwrite 和 fail-closed |
| 外部 raw body/secret 进入诊断 | 安全和证据边界失效 | body-free typed ref/safe diagnostic/redaction scan |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| ownership | “同步器管理项目”泛化 | Sync 只拥有 local session/binding/cursor/mapping/conflict/checkpoint/attempt/provenance | 对齐架构真相 |
| Git | 可能视为远端事实 | Git/fs 只是受限本地 adapter；remote truth 不归 Sync | 防越权 |
| metadata | 可删除/覆盖 | protected provenance、generation、integrity 状态和历史保留 | 可追溯 |
| dirty | 可通过 stash/merge 继续 | dirty/untracked/unknown 只阻断或人工处理 | 防数据损失 |
| 输出 | raw content 可方便排查 | body-free、redacted、bounded | 安全红线 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只做 schema/static 检查 | 成本低 | 不能发现 runtime truth write/dirty overwrite | 拒绝 |
| 用 cache/log 证明 owner boundary | 看似易测 | 无法证明真实 owner 事实和副作用 | 拒绝 |
| static architecture + controlled forbidden-port spy + redaction/path negative | 可证明 local boundary，且不伪造 external truth | 正向外部 integration 仍需 blocker 解锁 | 采用 |

## 7. 结构化中间产物

### 7.1 架构红线验收表

| 验收项 | 红线 | 通过条件 | 失败条件 | 计划证据 | 裁决影响 |
|---|---|---|---|---|---|
| `AC-SYNC-010` | owner 单一、禁止越界 | Sync 只持有 local truth 和 typed ref/safe snapshot；Project/Artifact/Baseline/Review Gate/Workspace/Archive/Git remote 不创建、修改、伪造 | 任一 external truth 被本仓持久化/更新，或私有 seam/共享 DB/任意 bus 越权 | `EV-SYNC-ARCH-001`、`EV-SYNC-TRACE-001`; `reports/runs/<run_id>/dependency-boundary.md` | 失败即不通过；命中 VETO-003 |
| `AC-SYNC-011` | dirty/non-overwrite | dirty/untracked/path/symlink/lock unknown、source drift、mapping conflict 只能 blocked/conflict/needs_action；无自动 stash/merge/rebase/overwrite | 用户未提交修改被覆盖、自动选择冲突、强推/重写本地路径 | `EV-SYNC-FLOW-001`、`EV-SYNC-CONSISTENCY-001`; `reports/runs/<run_id>/...` | 失败即不通过；命中 VETO-001 |
| `AC-SYNC-012` | Git/filesystem adapter 安全边界 | adapter 仅执行白名单观察、路径保护、锁和受控 atomic materialize；remote truth 不纳入 Sync | 隐式 fetch/push/merge/rebase/stash、任意 shell/私有 endpoint、Git commit 升格 Artifact/Baseline | `EV-SYNC-ARCH-001`、`EV-SYNC-FLOW-001`; `reports/runs/<run_id>/dependency-boundary.md` | 失败即不通过；工具 positive 未闭合为 blocked |
| `AC-SYNC-013` | Sync-local truth 与外部 truth 分离 | session、binding、cursor、mapping、conflict、checkpoint、attempt、provenance 只解释本地操作；local `completed` 不表示外部 accepted | local state 命名/状态冒充 Project/Artifact/Review/Archive/Git lifecycle | `EV-SYNC-TRACE-001`、`EV-SYNC-HANDOFF-001`; `reports/runs/<run_id>/evidence-index.md` | 失败即不通过；命中 VETO-002/003 |
| `AC-SYNC-014` | snapshot/ref/forbidden body | owner snapshot 带 source/version/freshness；外部对象只保存 typed ref/safe summary；raw body/secret/credential/path/body/stdout/stderr/evidence/report 正文不进入任何输出 | 敏感正文、token、私钥、完整 path/diff、provider response 或报告正文泄露/伪造 | `EV-SYNC-REDACT-001`、`EV-SYNC-OPS-001`; `reports/runs/<run_id>/redaction-check.md` | 失败即不通过；命中 VETO-004/005，不得风险接受 |

### 7.2 不得保存 / 可保存矩阵

| 数据主题 | 允许形态 | 禁止形态 |
|---|---|---|
| principal/project/version/source/target | typed ref、受限 snapshot、freshness、correlation | credential/token、未授权正文、默认推断值 |
| Artifact/Workspace/Review/Archive | source/version/attempt/decision/archive ref、safe summary | artifact body、workspace projection truth、Gate/Decision truth、archive package |
| Git/fs | observation、path safety、tool capability、commit/ref（按契约） | remote truth、stdout/stderr、任意 shell output、强制修改 |
| `.qs-sync` | logical metadata、generation、cursor/mapping/provenance、integrity marker | 未闭合 physical schema、静默 delete、伪造 parent/digest |
| conflict/recovery | conflict facts、checkpoint、resolution intent、probe result | raw diff、未授权自动 resolution、删除历史 |
| diagnostic/evidence | stable code、typed refs、bounded correlation、redaction marker | raw body/secret/path/output、verdict/signoff/readiness |

### 7.3 跨红线审计

| 审计项 | 结论 | 缺口/处理 |
|---|---|---|
| ownership 与 00/01 一致 | pass | 仅 Sync-local truth |
| 03 logical stores 与 boundary 一致 | pass | physical metadata 仍 blocked |
| dirty/path/no-overwrite 可检查 | pass (planned) | 需未来 Git/fs fixture；当前不声称执行 |
| redaction 可检查 | pass (planned) | 需真实 report/artifact scan；当前未生成 |
| VETO 覆盖 | pending until Step 11 | Step 11 统一裁决 |

## 8. 回填草稿

正式 §6 应声明：L5-sync 只能拥有 local sync session、working-copy metadata、cursor、mapping、conflict、checkpoint、attempt、provenance、受限 observation 和 safe diagnostic；不得拥有或改变 Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive 或 Git remote truth。dirty/untracked/path/comparator/provenance unknown 时必须 fail-closed；不得自动 merge/rebase/push/stash、覆盖修改、删除或伪造 provenance；外部 raw body、credential、token、私钥、stdout/stderr 和 evidence/report 正文不得进入任何输出。AC-SYNC-010~014 失败时按 P0 不通过，最终 VETO 在 §11 固定。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| Git/fs 白名单命令与 path/symlink/lock contract | AC-011/012 的正向 adapter 验证 | SYNC-UP-007/010、SYNC-LOCAL-* |
| `.qs-sync` physical schema/retention/crash | AC-002/010/013 的 physical integration | SYNC-UP-006 |
| report/artifact redaction scanner | AC-014 的真实证据 | Step 10/07 contract |

## 10. 进入下一步条件

- [x] AC-SYNC-010~014 红线验收项可检查，且已绑定证据计划。
- [x] 不得保存/可保存矩阵已覆盖 local truth、owner ref、Git/fs、metadata、diagnostic。
- [x] P1/P2 未污染 P0；physical/positive blocker 保留。
- [x] 正式 §6 回填草稿已形成。
- [x] 本步停审；进入 Step 7 前先读取 03 protocol、05 dependency/testing cuts 和全局依赖规则。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- 任何 redline 失败的未来结论均设计为不通过/VETO 候选；当前未填写实际 verdict。
- 下一步阅读：03 §7、05 §1.1/§3.3、全局依赖规则，创建 Step 7。
