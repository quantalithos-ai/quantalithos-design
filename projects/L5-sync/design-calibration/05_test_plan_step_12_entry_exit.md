# Step 12. 定义进入准则与退出准则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 12。
> 回填章节：未来正式 `05-测试方案.md` §12。
> 本步定义可审计的进入/退出条件；条件本身不是当前测试执行或放行结论。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 12 / entry_exit |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 直接下一步 | Step 13：定义测试报告与证据归档 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 1A. 本步输入

- Step 5 traceability、Step 8 profile/config、Step 9 automation gates、Step 10 NFR、Step 11 defect/retest、Step 13 evidence。
- 00 的 AC/VETO、03 的 public protocol/state/UoW、04 的 activation/failure/redaction handoff。

## 1B. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 进入条件证明什么？ | 证明测试设计、数据、配置、suite 和证据边界具备可审计入口，不证明执行通过。 |
| 退出条件如何处理 blocker？ | P0 local 可知收束；P1/physical/production-like 未闭合保持 blocked/waiting，不准伪造整体完成。 |
| 哪些条件一票否决？ | VETO、敏感泄露、truth ownership、dirty overwrite、blind replay、Query write、evidence fabrication。 |

## 1C. 旧材料诊断与改动前后对比

| 维度 | 旧材料 | 当前准则 |
|---|---|---|
| entry | 环境存在即可开始 | 文档/追溯/data/profile/gate/evidence schema 均可回链 |
| exit | “测试通过”泛化 | typed disposition、VETO 无违反、P1 blocker 明确分层 |
| blocked | 可能当 skipped | 显式 blocked/waiting/outcome_unknown/exit_blocked |

## 1D. 测试设计取舍

1. 入口条件强调确定性和安全，而不是追求提前启动 external integration。
2. 退出条件只定义未来可审计判断；06 负责 verdict/signoff/readiness。
3. 任何缺失 evidence 或 redaction 失败都阻断 packaging，不覆盖业务 state。

## 2. 进入准则（未来执行时）

### 2.1 文档和追溯

- 正式 `00`～`04` 与本轮 05 calibration 处于可消费的停审版本，版本/来源/flow/ledger 可回链。
- Step 5 双向 coverage 中的 P0 需求、VETO 和 `TC-SYNC-*` ID 已建立；没有未解释的核心需求空洞。
- 29 object、10 Command、13 Query、3 Consumer、3 Job、17 state 和 42 config leaf 名称与 03/04 一致。

### 2.2 数据、环境和配置

- 选定 P0 profile：`local-dev`、`ci-test`、`integration-like` 或 `operations-replay`，并固定 source precedence 和 immutable snapshot。
- 仅使用 synthetic/deterministic 数据集；敏感值为 ref-only，redaction canary 可扫描。
- required config、strict JSON、duplicate/alias/unknown/forbidden、cross-field 和 high-risk no-fallback 规则可被验证。
- 需要真实 SDK/source/review/Git/fs/metadata 的 suite 已明确 `blocked/waiting`，不会被误列为可执行。

### 2.3 Suite 与执行边界

- G0～G4 P0 suite 的语义入口、case、dataset、fault plan 和预期 write-set 已定义。
- runner/package/CLI binary/flags/exit code 若未由 `SYNC-LOCAL-*` 确认，只能使用 semantic contract，不得伪造命令可运行。
- artifact/report/evidence 目录规则和 redaction schema 已固定；禁止 `latest` 和 project 子目录。

## 3. 退出准则（未来执行时）

### 3.1 P0 核心退出条件

1. G0～G4 所有计划 P0 case 都有可审计的 disposition：`completed_known`/`no_op_known`/明确的 reject/block/unknown，不允许缺失或 silent pass。
2. 10 Command 的安全主线、13 Query zero-write、3 Consumer 的保守 invalidation、3 Job 的 bounded/report/no-repair 和 17 状态迁移均无未接受的 P0/VETO defect。
3. UoW/write-set、expected version、same/different digest、commit unknown、checkpoint/probe 和 no-blind-replay 断言均完成；unknown 不被转换为已知成功。
4. strict config、4 P0 profile、redaction/no-output、capability ceiling、no-silent-fallback 和 activation/failure 断言满足设计条件。
5. `VETO-SYNC-001~005` 负向 gate 没有未处置的违反；local result/commit/ACK/cache/telemetry/job report 未升格为外部 truth 或 readiness。

### 3.2 P1/P2 退出条件

- P1 external/controlled suite 只有在 owner/tool/store contract、fixture、权限和环境均闭合后才可标 `completed_known`；否则保持 `blocked/waiting`，不阻断已明确的 P0 local suite，但不能声称整体集成完成。
- P2 性能/容量/批量/归档引用/LFS/浅克隆/GUI 等只在权威 workload/support matrix 和后续文档授权后进入；本轮不作 exit gate。

### 3.3 证据和报告退出条件

- 每个 suite/run 的计划 evidence 具备来源、case、profile、blocker、redaction 和路径；不存在伪造 artifact/report/evidence/verdict/signoff/readiness。
- 失败、blocked、unknown、partial 和 skipped-with-reason 均可追踪；不得用空报告或最新索引覆盖历史。
- 06 可从 `reports/acceptance/` 消费映射，但 05 不填写验收 verdict。

## 4. 一票否决退出条件

| 条件 | 结果 |
|---|---|
| 自动 merge/rebase/push/stash、dirty overwrite、blind replay | exit blocked |
| 本地 commit/ACK/HTTP 200/remote object/log/cache 被当 Artifact/Baseline/accepted | exit blocked |
| Sync 创建/修改/伪造 Project/Artifact/Baseline/Review Gate/Workspace/Archive/Git remote truth | exit blocked |
| raw secret/body/credential/path/Git output/provenance deletion/forgery | exit blocked |
| owner/access/source/comparator unknown 时危险 materialize/handoff | exit blocked |
| Query 写入、Job 自动 repair/submit、Consumer 改 owner truth | exit blocked |

## 5. 进入/退出状态词汇

| 状态 | 语义 | 不能解释为 |
|---|---|---|
| `eligible_to_start` | 入口条件满足，可开始对应 suite | 已通过 |
| `running` | 未来执行中 | 已完成 |
| `completed_known` | local suite 结果已知收束 | owner accepted/readiness |
| `blocked` | 依赖/安全/设计条件不满足 | pass 或失败已定位 |
| `waiting` | 等待外部确认/环境/fixture | skipped-as-pass |
| `outcome_unknown` | effect/commit/报告状态无法确定 | failure 或 success |
| `exit_blocked` | P0/VETO/证据链不满足 | 可发布/readiness |

## 6. 回填草稿（未来正式 §12）

进入准则要求正式文档链、追溯、P0 profile、synthetic data、semantic suite、redaction 和 evidence path 已锁定；退出准则要求 P0 suite 结果可知、VETO 无未处置违反、Query/状态/UoW/幂等/恢复/配置边界闭合。P1/P2 未闭合时保持 blocked/waiting，不得用计划材料或 local result 声称整体 accepted/readiness。

## 7. 待确认事项

| 事项 | 处理 |
|---|---|
| 06 的正式验收 verdict/签署 | 05 只定义条件与证据输入。 |
| P1 integration exit 是否阻断 release | 等 06/07 和 owner contract；当前不自行放宽。 |
| runner/CI 的具体 exit code | 等 LOCAL-004；语义 gate 先固定。 |

## 8. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| 进入、退出、VETO 和状态词汇可审计 | pass |
| P1/P2/blocker 与 P0 条件区分明确 | pass_with_upstream_blockers |
| 未宣称当前 run/通过/readiness | pass |
| 允许进入 Step 13 | pass |

## 9. 下一步门禁

Step 13 必须将这些条件映射到报告、artifact/evidence 计划、路径、保留/重试和 redaction 规则，并明确每类载体能证明什么、不能证明什么。
