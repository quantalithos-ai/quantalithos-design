# Step 5. 建立需求追溯与覆盖矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 5。
> 回填章节：未来正式 `05-测试方案.md` §5。
> 本步只建立“需求→切口→层级→计划证据”的双向关系；不宣称任何测试已执行或通过。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 5 / traceability_coverage |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 直接下一步 | Step 6：设计测试场景与用例矩阵 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 2. 本步输入与规则

- `00-需求文档.md` 的 `CP-SYNC-01~06`、`FR-SYNC-001~015`、`BR-SYNC-001~025`、`AC-SYNC-001~020`、`VETO-SYNC-001~005`、`NFR`。
- Step 3 的 `TC-SYNC-*` cut registry，Step 4 的 layer assignment。
- `04_config_step_12_downstream_handoff.md` 的 config VETO 与 evidence ceiling。

追溯规则：每个 P0 需求至少映射一个正向/结构性切口和一个负向/边界切口；每个 VETO 至少有可捕获 forbidden effect；每个切口必须回指需求或设计契约；P1 blocked 不能伪装为 P0 coverage；未关闭需求显式标为 `planned / blocked / waiting`。

## 2A. 旧材料诊断与改动前后对比

| 维度 | 旧材料 | 当前 05 |
|---|---|---|
| 追溯方式 | 以流程段落或旧 SyncTask 名称覆盖 | CP/FR/BR/AC/VETO/NFR ↔ TC/Suite/Evidence 双向矩阵 |
| coverage 语义 | 用“有用例”暗示通过 | `planned/blocked/waiting` 与 proof ceiling 分开 |
| VETO | 仅文字禁止 | 每个 VETO 均关联 forbidden-effect/exit-blocking 断言 |
| 外围能力 | 与核心混列 | FR-013~015/P2、P1 external 独立登记 |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 如何证明覆盖不是“列名覆盖”？ | 采用双向表：需求→TC/层级/证据上限，以及 TC→唯一来源/需求/状态/禁止效果；再做缺口审计。 |
| 哪些需求必须 P0？ | CP-SYNC-01～06、FR-SYNC-001～012、BR-SYNC-001～024、AC-SYNC-001～014、VETO-SYNC-001～005 和安全/幂等/观测 NFR。 |
| 外围 FR-013～015 如何处理？ | 登记 P2 planned，测试不放宽逐来源/归档/权限门禁；不列入当前核心退出条件。 |
| 需求与设计冲突怎么办？ | 记录 design-change-required，停止受影响切口并回写 00/03/04；05 不自行修改需求。 |
| coverage 状态如何写？ | `planned` 代表已设计切口；`blocked` 代表依赖未闭合；`waiting` 代表等待环境/fixture；禁止写 pass/fail。 |

## 4. 需求→覆盖矩阵（核心能力）

| 需求组 | 追溯需求 | 主切口 | 首要层 | 负向/边界 | 当前上限 |
|---|---|---|---|---|---|
| CP1 explicit selection/access | `FR-SYNC-001~002`、`BR-SYNC-001~004`、`AC-SYNC-001` | `TC-SYNC-MOD-001`、`TC-SYNC-PROTO-002`、`TC-SYNC-CMD-001` | L2/L3 | missing/implicit/latest/unknown/archived/denied | local planned；owner positive blocked |
| CP2 binding/metadata | `FR-SYNC-003~004`、`BR-SYNC-005/007/018/019`、`AC-SYNC-002/013/014` | `TC-SYNC-MOD-002`、`TC-SYNC-CMD-002~003`、metadata integrity cuts | L2/L3 | generation mismatch、corrupt、dangling、delete/provenance tamper | logical planned；physical blocked |
| CP3 status/pull/materialize | `FR-SYNC-005~006`、`BR-SYNC-006/008~010`、`AC-SYNC-003/008/011` | `TC-SYNC-MOD-003/008`、`TC-SYNC-CMD-001/004`、`TC-SYNC-QRY-004~006` | L2/L3/L5 | dirty、gap、rename/delete collision、partial/unknown、query write | local planned；source/tool blocked |
| CP4 conflict/recovery | `FR-SYNC-007~008`、`BR-SYNC-011~014/024`、`AC-SYNC-004/011/019` | `TC-SYNC-MOD-004`、`TC-SYNC-CMD-005~008`、`TC-SYNC-STATE-011~014` | L2/L3 | system actor、stale decision、possible effect、blind retry | local planned；formal probe blocked |
| CP5 handoff/provenance | `FR-SYNC-009~010`、`BR-SYNC-015/016/022/024`、`AC-SYNC-005/009` | `TC-SYNC-MOD-005`、`TC-SYNC-CMD-009~010`、handoff layer cuts | L2/L3/L5 | dirty/drift/archived、ACK=accepted、unknown/resubmit | local planned；owner handoff blocked |
| CP6 posture/diagnostic | `FR-SYNC-011~012`、`BR-SYNC-004/017~019/022`、`AC-SYNC-006/014/020` | `TC-SYNC-MOD-009/011`、consumer/job/redaction cuts | L2/L3/L6 | stale cache, raw body/secret/path, telemetry as proof | local planned；owner read blocked |

## 5. FR/BR/AC/VETO/NFR 覆盖矩阵

### 5.1 FR 与 user story

| ID 范围 | 覆盖切口/场景 | 证据计划 | 状态 |
|---|---|---|---|
| `FR-SYNC-001~004` / `US-SYNC-001~004` | selection/access、clone、metadata migrate/rebind、binding provenance | `EV-SYNC-TRACE-001`、`EV-SYNC-CONTRACT-001` | planned；owner/store positive blocked |
| `FR-SYNC-005~008` / `US-SYNC-005~008` | status、pull、conflict、resume/probe/cancel | `EV-SYNC-TRACE-002`、`EV-SYNC-FLOW-001` | planned；source/tool/probe blocked |
| `FR-SYNC-009~012` / `US-SYNC-009~012` | candidate freeze、handoff refresh、posture invalidation、safe diagnostic | `EV-SYNC-TRACE-003`、`EV-SYNC-REDACT-001` | planned；Governance/SDK blocked |
| `FR-SYNC-013~015` / `US-SYNC-013~015` | batch prefetch、local comparison、archive references | `EV-SYNC-FUTURE-001` | P2 planned/waiting |

### 5.2 BR 与 VETO

| 规则 | 对应切口 | 必须阻断的效果 | 状态 |
|---|---|---|---|
| `BR-SYNC-001~004` | selection/access negative | implicit selection、default allow、unknown owner 下 mutation | planned |
| `BR-SYNC-005~007` | metadata integrity/provenance | unbound/rebind without reason、silent migration/delete/repair | planned；physical blocked |
| `BR-SYNC-008~010` | result-layer/cursor/query no-write | cursor=Git/transport、query refresh/write、gap advance | planned |
| `BR-SYNC-011~014` | conflict/recovery/idempotency | conflict evidence loss、auto resolution、blind replay | planned |
| `BR-SYNC-015~018` | handoff/provenance | ACK/commit accepted、Gate bypass、posture cache、provenance forgery | planned；handoff blocked |
| `BR-SYNC-019~023` | redaction/dependency | raw body/credential、private seam/shared DB/any bus | planned |
| `BR-SYNC-024~025` | explicit mutation/history/tool posture | invisible user decision、LFS/shallow/GUI assumed | planned/pending |
| `VETO-SYNC-001~005` | cross-cut negative suite | any forbidden effect or unknown-danger action | planned gate; no verdict yet |

### 5.3 NFR 覆盖

| NFR 主题 | 设计切口 | 最小断言 | 当前状态 |
|---|---|---|---|
| 性能/进度 | bounded local stages、structured progress | 不以固定数字承诺；阶段可解释，不无限重试 | planned; threshold pending |
| 可用性/恢复 | checkpoint、needs_action、probe/manual | interrupted/unknown 不丢 history，不盲重放 | planned |
| 安全 | explicit access、path/root、non-overwrite、redaction | unknown fail-closed；敏感值不出输出 | planned |
| 可追溯 | provenance chain、correlation、stored result | local facts 可回链；不伪造 formal evidence | planned |
| 幂等/一致性 | digest/version/UoW/replay | equal replay exact；different digest conflict；Query no-write | planned |
| 可观测性 | bounded diagnostic/telemetry | sink failure 不改业务结果；low-cardinality、安全字段 | planned |

## 6. 覆盖缺口审计

| 审计项 | 结果 | 处置 |
|---|---|---|
| 每个核心 CP 有正向和负向切口 | pass | Step 6 展开具体 case |
| 每个 VETO 有 forbidden-effect 断言 | pass | Step 9/12 形成 gate |
| 每个 Command/Query/Consumer/Job 有需求映射 | pass | Step 6 逐条列出 |
| P1 blocked 是否被误算 P0 pass | no | 保持 blocked/waiting |
| FR-013~015 是否被误算核心闭环 | no | P2 future trigger |
| 是否存在无来源的切口 | no | 每个切口回指 03/04/00 |
| 是否存在需求无切口 | no（设计级） | 外部 positive 仍未执行，不能写 coverage pass |

## 6A. 测试设计取舍

1. 需求覆盖优先保留负向/边界切口；不能用一条 happy path 代表显式选择、dirty safety、unknown 和 truth boundary。
2. P1 blocked 仍进入追溯矩阵，但 evidence ceiling 明确为“contract/blocked mapping”，不算 P0 pass。
3. 06 可能重建 AC/VETO/evidence schema，因此 05 保留 00 的稳定 ID 并记录 consumer handoff，不自行改号。

## 7. 回填草稿（未来正式 §5）

正式方案以 CP、FR、BR、AC、VETO、NFR 的双向追溯为主线。核心需求均映射到 `TC-SYNC-*`、测试层级、计划 evidence ID 和安全上限；P1 external integration 只登记 blocked/waiting，P2 外围能力不成为核心 exit gate。覆盖矩阵表示设计覆盖，不表示实际 run、report、evidence 或 verdict 已产生。

## 8. 待确认事项

| 事项 | 处理 |
|---|---|
| 06 是否重建 AC/VETO | 05 仍引用 00 ID，并在 Step 13 保留 consumer mapping；06 需决定最终裁决 schema。 |
| 性能阈值与容量 workload | 等待权威 workload；不在本矩阵填数字。 |
| 真实 external evidence source | 由对应 owner/06 确认；05 只锁本地计划路径和禁止输出。 |

## 9. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| FR/BR/AC/VETO/NFR 双向追溯建立 | pass |
| 需求缺口和 blocker 显式登记 | pass_with_upstream_blockers |
| 未把计划 ID 写成执行结果 | pass |
| 允许进入 Step 6 | pass |

## 10. 下一步门禁

Step 6 必须按覆盖矩阵逐条展开可审计场景/用例，至少包含 happy、invalid、duplicate、version/generation conflict、partial/unknown、forbidden-effect 与 redaction；不能只复制需求标题。
