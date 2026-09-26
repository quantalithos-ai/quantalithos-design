# Step 13. 定义风险接受与遗留项

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 13
> 回填位置：正式 `06-验收标准.md` §13

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 13 / risk_acceptance |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 当前风险实例 | `not_provided`；仅定义结构与遗留项类别 |
| 下一步 | `Step 14 / conclusion_signoff` |
| 正式 06 写入 | `blocked_until_step_15` |

## 2. 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| 上游 blocker/risk/open questions | 00 §15、03 §17、04 §14、05 §14 | `available` | 必须原样保留 |
| 缺陷/放行规则 | Step 12 | `available` | 决定哪些风险可接受 |
| VETO/证据硬门禁 | Step 10/11 | `available` | 不可风险接受项 |
| 实际 owner/acceptor/deadline | 送验材料 | `not_provided` | 当前不填人员或日期事实 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些风险可以支持有条件通过？ | 仅 B/R residual、P1/P2 selected-run unavailable、无硬阈值的 performance trend、或严格限制且不影响 P0/VETO 的 A 级缺陷；必须有 evidence、owner、acceptor、deadline/trigger、follow-up。 | Step 12；06 SOP Step 13 |
| 哪些风险不能接受？ | VETO-SYNC-001~005、S 级、redaction leak、dependency boundary failed、evidence/report integrity failure、Query/Job truth repair、P0 config silent fallback、dirty overwrite、unknown 危险副作用。 | Step 9/10/11/12 |
| 每个风险谁接受？ | 送验时必须由业务/架构/测试/安全或验收责任角色显式指定；当前使用 `<待指定>` 占位，不声称已接受。 | 验收标准规范 §4.2/Step 13 |
| 后续动作与截止时间是什么？ | 每条记录 `follow_up_ref` 和 `<deadline-or-trigger>`；未填接受人或动作不能支撑有条件通过。 | Step 13/14 |
| 是否需要同步实施计划/问题记录？ | 需要；但当前不创建 07 implementation ledger/skeleton 或外部 issue 实例，只定义后续引用字段。 | 用户约束；Step 15 前不进入 07 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| blocker 被直接标记为 accepted | 伪造风险决策，掩盖 owner contract 缺口 | 仅登记待接受结构；当前不填写 acceptor/结论 |
| 无接受人/截止条件 | “有条件通过”不可执行 | 强制 owner/acceptor/deadline-or-trigger/follow-up |
| VETO 与普通 residual 混在一起 | 可能被条件通过绕过 | 明确 VETO/S/硬证据不可接受 |
| P1 unavailable 直接算 P0 fail/pass | 结论不能反映范围边界 | P1/P2 residual 单独登记，不能伪造 P0 positive |
| 风险未回链 evidence | 无法判断是否真实 residual | 每项必须有 evidence_refs 或明确未生成/blocked |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| blocker | 只有列表 | blocker、影响、当前姿态、触发器和后续动作 | 可追踪 |
| 接受 | 口头“后续补” | 结构化 owner/acceptor/deadline/follow-up | 可执行 |
| hard gate | 可与 residual 混排 | VETO/S/证据/安全边界明确不可接受 | 保持底线 |
| P1/P2 | 模糊未完成 | residual/future trigger，不污染 P0 | 结论清晰 |

## 6. 验收裁决取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 把所有 blocker 都视为不通过 | 保守 | 无法区分 P0 local 已成立与 P1 依赖等待 | 拒绝 |
| 把所有 blocker 都作为有条件通过 | 便于推进 | 会绕过 VETO/证据/安全硬门禁 | 拒绝 |
| 按硬门禁与 residual 分层，未指定 acceptor 不得成立 conditional | 可执行且不越权 | 需要后续责任人补齐 | 采用 |

## 7. 结构化中间产物

### 7.1 风险接受表（结构，不是已接受清单）

| 风险/遗留项 | 影响 | 可接受性 | 证据要求 | 后续动作 | 责任人 | 接受人 | 截止/触发 |
|---|---|---|---|---|---|---|---|
| `SYNC-UP-001~005` SDK/owner/access/review/probe contract | P1 positive source/access/handoff/probe 无法证明 | 仅在 P0 local/negative/evidence 完整后作为 P1 residual；不得替代正向通过 | `EV-SYNC-BLOCKER-001` 仅 metadata；真实 P1 EV 待生成 | 合同闭合后补 adapter/owner selected-run 并重新基线 | `<待指定>` | `<待指定>` | `<contract-closure>` |
| `SYNC-UP-006` `.qs-sync` physical schema/migration/crash/retention | physical durability 未证明 | 可作为 P1 residual；不能接受 physical redline 失败或 provenance 删除 | `EV-SYNC-BLOCKER-001` + logical `EV-SYNC-TRACE/CONSISTENCY`；不冒充 physical proof | 固定 schema/driver/migration/retention 后补 repository/fault suite | `<待指定>` | `<待指定>` | `<schema-closure>` |
| `SYNC-UP-007~010` Git/source/comparator/dirty/path/support matrix | real materialization/tool support 未证明 | 只可 residual；unknown 下危险 action 不可接受 | local negative/controlled EV；真实 tool evidence 待生成 | 完成 support matrix、path/dirty/comparator contract 后补验 | `<待指定>` | `<待指定>` | `<tool-contract-closure>` |
| `SYNC-LOCAL-001~005` Node/package/parser/runner/Git library/SDK dependency | 实际 runner/CLI/adapter 选择未定 | 只能 waiting/planned；不得当作实现 ready 或测试 passed | `EV-SYNC-BLOCKER-001` metadata，不是 proof | 07/实施前锁定 toolchain，重新固定 delivery/evidence baseline | `<待指定>` | `<待指定>` | `<implementation-bootstrap>` |
| 无硬阈值的 performance/capacity/trend | 无法做 numeric P95/SLO 裁决 | B/R residual；结构性 sample 仍是 P0 | `EV-SYNC-FLOW-001`/`OPS-001` sample | 建立 workload、SLO、capacity model 后升级验收 | `<待指定>` | `<待指定>` | `<workload-baseline>` |
| LFS/浅克隆/GUI/Tauri/批量预取/结果比较/归档引用 | P2 外围能力未核验 | R/future；不阻断 P0，不得宣称支持 | future EV 仅在新范围后生成 | 用户/架构确认后回写 00～06 并新基线 | `<待指定>` | `<待指定>` | `<scope-trigger>` |
| evidence retention/signer/acceptance handoff 角色 | 长期审计和签署职责未固定 | 可作为 process residual；缺 handoff 审查不能通过当前验收 | `reports/acceptance/*` 实例和审查记录 | 固定角色、保留期、签署和归档策略 | `<待指定>` | `<待指定>` | `<acceptance-process-closure>` |

### 7.2 不可风险接受清单

- `VETO-SYNC-001~005` 任一触发或检查证据缺失导致不可裁决。
- S 级缺陷、P0 truth/ownership/redaction/dependency/evidence integrity 失败。
- Query 写入、Job repair/migrate/rebind/delete/submit、Outbound Event 非 `not_applicable`。
- dirty/untracked/path/symlink/lock unknown 仍 apply，或 owner/access/source/comparator unknown 仍 materialize/handoff。
- local commit、ACK、HTTP 200、remote object、cache、telemetry、job report 作为 Artifact/Baseline/Review accepted/approved/signoff/readiness。
- provenance/冲突证据删除、伪造、静默重绑定，raw body/secret/credential/stdout/stderr/path 泄露。
- 缺接受人、缺后续动作、缺截止/触发条件的所谓风险接受。

### 7.3 风险接受文件要求

未来 `reports/acceptance/risk-acceptance.md` 至少包含：

```text
risk_id
impact
acceptance_reason
evidence_refs
affected_ac_or_veto
owner
acceptor
deadline_or_trigger
follow_up_ref
status
```

当前不创建该文件实例，也不填 `status=accepted`。

### 7.4 风险/遗留停审记录

| 检查项 | 结论 | 说明 |
|---|---|---|
| blocker 原样保留 | pass | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 未关闭 |
| hard gate 与 residual 分离 | pass | VETO/S/证据/安全不可接受 |
| 每项风险有影响和后续动作字段 | pass | owner/acceptor/deadline 当前待送验补齐 |
| risk acceptance 是否可支撑当前 conditional | not yet | 当前无真实 evidence、acceptor、deadline，不得填写结论 |

## 8. 回填草稿

正式 §13 应声明：风险接受仅适用于不触发 VETO/S、且不破坏 P0 truth/安全/证据的 B/R residual、P1/P2 未覆盖或严格受限 A；每项必须有影响、理由、evidence_refs、owner、acceptor、deadline/trigger、follow-up_ref。`SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样保留为 blocker；当前不声称任何风险已接受，缺 acceptor/动作/期限不能支持“有条件通过”。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 业务/架构/测试/安全/验收责任人 | 无法形成有效 risk acceptance | Step 14/送验前 |
| P1 blocker 解锁触发器 | 无法安排 residual follow-up | 各 SYNC-UP/LOCAL closure |
| evidence retention/signer/handoff process | 无法形成正式 acceptance handoff | Step 14/执行环境 |

## 10. 进入下一步条件

- [x] 可接受与不可接受风险边界已明确。
- [x] 所有持续 blocker 已原样保留，未用 fake/cache/ACK/log/telemetry 关闭。
- [x] 风险表具备 owner/acceptor/deadline/follow-up 字段，但未伪造实际责任人或接受结果。
- [x] 正式 §13 回填草稿已形成。
- [x] 本步停审；进入 Step 14 前读取三值结论和签署规则。

## 11. Step 停审记录

- 本步裁决：`pass_with_upstream_blockers`。
- 当前没有已接受风险实例；所有接受人、期限和最终结论均待正式送验资料。
- 下一步阅读：验收标准规范 §4.2、06 SOP Step 14、前述 Step 4/10/11/12，创建 Step 14。
