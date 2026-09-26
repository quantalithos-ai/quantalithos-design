# Step 4. 制定测试策略与分层

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 4。
> 回填章节：未来正式 `05-测试方案.md` §4。
> 本步确定问题应在哪一层被发现、哪些层可 planned、哪些层受 blocker；不选择尚未确认的 runner/package/Git library。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 4 / strategy_layers |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 直接下一步 | Step 5：建立需求追溯与覆盖矩阵 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 2. 本步输入

- Step 2 的 P0/P1/P2 scope 与 VETO 关联。
- Step 3 的 29 objects、protocol 数量、17 states 与切口矩阵。
- `03-详细设计.md` §10～§15 的 UoW、错误恢复、并发幂等、配置和 observability 约束。
- `04-配置设计.md` §6、§9～§12 的 profile/activation/redaction/failure handoff。
- 测试方案 SOP/规范关于分层、自动化门禁和证据边界的要求。

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些问题在 unit/contract 层发现？ | typed ref/DTO、canonical digest、对象不变量、state transition、配置 parser、redaction、禁止字段和 dependency graph。 |
| 哪些问题在 application/flow 层发现？ | Command orchestration、UoW write-set、Query zero-write、duplicate replay、consumer receipt、job report/no-truth-repair、prepare→effect→finalize 顺序。 |
| 哪些问题需要 controlled adapter 层？ | repository version/atomic visibility、metadata migration、Git/fs path/dirty、SDK/source/access/review/probe error mapping；真实正向依赖仍 blocked。 |
| E2E/release gate 的角色？ | 只做最小跨入口 smoke、profile assembly、redaction/dependency scan 和报告汇总，不替代底层断言，也不制造 readiness。 |
| 如何防止 fake 伪成功？ | fake 只能返回正式 typed result/unknown/failure 并受同一状态机；fake 通过不改变 `SYNC-UP-*` blocker。 |

## 4. 旧材料诊断

| 旧问题 | 当前修正 |
|---|---|
| 以 GUI/E2E 作为主验证 | 改为 risk-based bottom-up；E2E 只汇总。 |
| 测试层与证据层混为一谈 | 每层定义能证明/不能证明；fake/unit 不升格 external truth/evidence。 |
| 依赖假定可用 | adapter layer 设 `blocked/waiting`，同时保留 negative/contract planned。 |
| 只覆盖 happy path | 每个层同时放 invalid/duplicate/version conflict/partial/unknown/forbidden-effect。 |

### 4.1 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 主验证层 | GUI/E2E 叙事优先 | L1 static → L2 unit → L3 flow → L4 seam → L5 entry → L6 summary |
| 外部依赖 | 默认可调用 | positive adapter 明确 `blocked/waiting`，local negative 可 planned |
| 证据语义 | 上层报告代表整体完成 | 每层写明可证明/不可证明，禁止 truth/evidence 升格 |
| 失败处理 | retry 或 skipped | typed failure/unknown/blocker 保留原因和历史 |

## 5. 分层模型

```text
[L6 release/evidence summary, planned]
  cross-entry smoke · profile assembly · redaction scan · dependency scan
                         |
[L5 CLI/consumer/job entry contract, planned]
  explicit flags/selection DTO · safe presentation · envelope mapping
                         |
[L4 controlled adapter contract, blocked/waiting for positive]
  repository/UoW · SDK/source/access/review/probe · Git/fs · metadata store
                         |
[L3 application/flow fake, planned]
  command orchestration · query no-write · consumer receipt · job report
                         |
[L2 domain/state/property, planned]
  objects · policies · canonicalization · 17 transitions · redaction helper
                         |
[L1 static/architecture checks, planned]
  dependency direction · outbound-event absence · forbidden API/shell surface
```

## 6. 测试分层表

| 层级 | 主要对象/切口 | 可证明 | 不可证明 | 当前姿态 |
|---|---|---|---|---|
| L1 static/architecture | module imports、adapter allowlist、no outbound event | 依赖方向和禁止 surface | runtime behavior、owner success | planned |
| L2 unit/property | 29 objects、7 policies、17 states、refs/digest、config/redaction | pure invariants、deterministic mapping | store/tool/SDK integration | planned |
| L3 application/flow fake | 10 Command、13 Query、3 Consumer、3 Job、UoW spy | order、write-set、zero-write、idempotency、unknown branch | external effect equivalence | planned |
| L4 repository/UoW contract | version、unique、atomic visibility、commit ambiguity、metadata logical store | logical persistence semantics | physical `.qs-sync` driver until UP-006 | blocked/waiting |
| L4 SDK/Git/fs contract | adapter error mapping、dirty/path/symlink、safe apply、source comparator | bounded seam behavior | official owner/tool support until UP-001~010 | blocked/waiting |
| L5 entry contract | CLI route, safe output, consumer/job envelope | presentation and input boundary | parser/bin/exit-code exact choice until LOCAL-003/004 | planned/partial |
| L6 release/evidence | smoke, profile, redaction/dependency scan | cross-surface assembly and plan evidence | acceptance/readiness or real run in this turn | planned |

## 7. 切口到层级映射

| 切口族 | 首要层级 | 补充层级 | gate 规则 |
|---|---|---|---|
| `TC-SYNC-PROTO-*` | L2 | L5 | public carrier 不得泄漏 raw provider/body |
| `TC-SYNC-MOD-001~011` | L2/L3 | L1/L4 | cross-feature flow 在 L3 验证，不复制 owner truth |
| `TC-SYNC-CMD-001~010` | L3 | L4/L5 | unknown/partial/dirty 负向优先；positive external blocked |
| `TC-SYNC-QRY-001~013` | L3 | L5 | UoW/write/lock/probe/handoff call count 必须为 0 |
| `TC-SYNC-CONS-001~003` | L3/L5 | L4 | source/schema/order 未闭合则 blocked；receipt 不含 raw payload |
| `TC-SYNC-JOB-001~003` | L3/L5 | L4 | batch partial/replay/no truth repair；report 非 evidence |
| `TC-SYNC-STATE-001~017` | L2 | L3 | 表外 transition 和 terminal reopen 必须失败且 no side effect |
| config/redaction | L2/L3 | L6 | strict invalid/high-risk values fail-fast；敏感值不出边界 |
| dependency/outbound absence | L1 | L6 | 架构扫描不能通过任意 remote/publisher truth 依赖 |

## 8. 测试设计取舍

1. L2/L3 是 P0 的主证据来源，因为能在没有外部服务时发现大多数安全/一致性错误。
2. L4 正向 integration 不作为 P0 先决；若 owner contract 仍 unknown，只运行（未来）negative mapping 或 controlled unavailable 分支。
3. L5 CLI 只锁语义：四个核心命令、显式 selection、安全输出和 disposition；不猜 binary、flag、exit code。
4. L6 不使用 `latest`、不汇总成 top-level success；每个 suite/运行计划都保留 blocker 和证据边界。

## 9. 回填草稿（未来正式 §4）

测试策略采用 bottom-up 分层。Unit/property 覆盖对象、策略、状态和安全 helper；application/flow fake 覆盖 Command/Query/Consumer/Job 的编排、UoW、幂等、恢复和禁止副作用；controlled adapter 层覆盖 repository/SDK/Git/filesystem seam，并对未闭合正向依赖保持 blocked/waiting；CLI/E2E/release 只做最小跨入口、配置、redaction 和依赖汇总。任何上层通过都不能替代底层状态和 truth-boundary 断言。

## 10. 待确认事项

| 事项 | 当前处理 |
|---|---|
| test runner / package manager | 由 `SYNC-LOCAL-002/004` 关闭后确定；当前使用 semantic suite 名。 |
| Git library / SDK dependency | 由 `SYNC-LOCAL-004/005` 与 `SYNC-UP-001` 关闭后确定；不写 manifest。 |
| physical store crash test | `SYNC-UP-006` 关闭前只定义 logical commit-unknown/reload case。 |
| staging/production-like E2E | 无真实环境不创建 gate pass；只登记入口条件。 |

## 11. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| 所有切口均有首要测试层级 | pass |
| 证明上限与 blocker 明确 | pass_with_upstream_blockers |
| E2E 未被用作底层风险替代 | pass |
| 未选择未确认 runner/package/tool | pass |
| 允许进入 Step 5 | pass |

## 12. 下一步门禁

Step 5 必须将 00 的 FR/BR/AC/VETO/NFR 与本步层级/切口建立双向覆盖矩阵；任何没有测试切口的需求不得被默认为覆盖，任何新增设计契约都必须回写 03/04。
