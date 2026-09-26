# Step 10. 设计专项测试与非功能验证

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 10。
> 回填章节：未来正式 `05-测试方案.md` §10。
> 本步定义非功能验证目标和证据上限，不填未经 workload/owner 批准的固定性能数字。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 10 / nonfunctional |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 直接下一步 | Step 11：缺陷管理与复验规则 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 1A. 本步输入

- Step 2 的 NFR/P0/P1/P2 范围、Step 6 的 fault/case matrix、Step 8 的 profile/config matrix、Step 9 的 G0～G7 gates。
- 00 的 `AC-SYNC-015~020`、03 的 concurrency/recovery/observability 契约、04 的 redaction/failure handoff。

## 1B. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 非功能是否需要固定数字？ | 不需要；性能/容量阈值等待权威 workload，当前只定义相对和安全指标。 |
| 如何验证安全？ | 用 explicit selection、path/dirty guard、forbidden-effect spy、redaction canary 和 dependency scan。 |
| 如何验证可靠性？ | 用 UoW、commit unknown、checkpoint/probe、duplicate/replay、version race 和 sink failure 注入。 |
| 如何区分观测与证据？ | telemetry/diagnostic/audit 只证明信号和 local fact，不证明 accepted/evidence/readiness。 |

## 1C. 旧材料诊断与改动前后对比

| 维度 | 旧材料 | 当前专项方案 |
|---|---|---|
| 性能 | 固定吞吐/延迟数字 | workload 未定，使用 bounded/no-unbounded-retry 相对断言 |
| 安全 | 依赖 E2E 观察 | 每个 VETO 都有可注入负向切口 |
| 故障 | timeout 当失败或重试 | known/partial/unknown/ProbeRequired 分层 |
| 观测 | log/report 可能当成功证据 | signal 与 business truth/evidence 分离 |

## 1D. 测试设计取舍

1. 先保证安全、恢复、幂等、redaction 和状态正确，再等待 workload 做容量数字。
2. 真实 tool/provider 的专项性能或兼容性不以 synthetic fake 代替；未闭合即 blocked/waiting。
3. CLI 可用性只测显式选择、安全输出和 next action，不锁 parser/GUI 选择。

## 2. 专项测试目标

| 专项 | 来源/目标 | 计划切口 | 当前上限 |
|---|---|---|---|
| 安全与越权 | `BR-SYNC-001~004/019/023`、`VETO-SYNC-003~005` | explicit selection/access negative、private seam/dependency scan、path/root/symlink、redaction canary | local/controlled planned；owner auth positive blocked |
| 本地修改保护 | `BR-SYNC-006/012/020`、`AC-SYNC-011/012` | dirty/untracked/non-overwrite、safe apply、no merge/rebase/push/stash | real Git/fs blocked by UP-007/009/010 |
| 一致性/恢复 | `BR-SYNC-008/013/014`、`FR-SYNC-008` | UoW、commit unknown、checkpoint/probe、exact replay、version race | logical planned；physical crash blocked |
| 幂等/并发 | `NFR-SYNC-019` | same/different digest、in-flight second writer、generation/apply/handoff/provenance races | controlled fake planned |
| 可观测性/审计 | `FR-SYNC-012`、`NFR-SYNC-020` | closed telemetry/diagnostic schema、sink failure、low cardinality、provenance | external sink blocked；signal不作证据 |
| 性能/容量 | `AC-SYNC-015` | bounded batch, path/change count, metadata growth, no unbounded retry | threshold/workload pending |
| 可用性/降级 | `AC-SYNC-016` | owner/network/Git/fs unavailable、stale/blocked/unknown/manual | real service blocked；typed disposition planned |
| 兼容性/演进 | `SYNC-UP-008/009`、config migration | schema/version unsupported、cursor comparator gap、old generation protected、tool matrix | physical/version contract pending |
| CLI/人机安全 | explicit selection、safe output、action wording | no default context、no raw path/body/secret、next-action clarity | parser/flag/exit code pending |

## 3. 安全专项矩阵

| 风险 | 注入/场景 | 必须观察 | VETO |
|---|---|---|---|
| implicit context | omit project/version/source/target、use latest/default | request rejected before UoW/effect | `VETO-SYNC-005` |
| owner denial/stale/archive | access unknown/denied/archived/dissolved | blocked/needs-action；no materialize/handoff | `VETO-SYNC-005` |
| dirty overwrite | dirty/untracked/conflicting local observation | no apply/overwrite/stash/merge/rebase | `VETO-SYNC-001` |
| path/root attack | `..`、symlink、absolute path、protected delete | path policy blocked；safe token only | `VETO-SYNC-001/004` |
| secret/body leakage | canary in config/provider/fs/Git output | no result/view/log/audit/trace/report/evidence | `VETO-SYNC-004` |
| private seam | fake import/shared DB/arbitrary bus/private endpoint | static architecture gate fails | `VETO-SYNC-003` |
| truth elevation | local commit/ACK/cache/job report/telemetry | remains local/transport/diagnostic layer | `VETO-SYNC-002` |

## 4. 可靠性、恢复与幂等专项

| 事件 | 期望 local result | 不允许 |
|---|---|---|
| before prepare commit | no external effect; no durable false intent | call provider/tool |
| after prepare, before effect | durable attempt/checkpoint remains | silently discard |
| effect known success, finalize conflict | `AppliedPendingFinalize`/`OutcomeUnknown` or typed consistency error; cursor unchanged | assume finalized/retry effect blindly |
| effect possible unknown | `ProbeRequired` + new probe identity | resubmit original call/change key |
| duplicate same key+digest | exact stored result/receipt/report | recompute current truth or call effect |
| duplicate different digest | idempotency conflict | overwrite carrier |
| concurrent stale version | typed version conflict; other writer retained | last-write-wins |
| query/read sink failure | safe partial/unavailable view; business state unchanged | query repair/probe/write |
| job partial batch | per-item results + summary partial; rerunnable bounded input | hide failed/unknown items or call auto repair |

## 5. 性能与容量验证纪律

1. 在 workload 未由上游/运维确认前，只定义相对指标：无重复外部调用、无无界 retry、bounded batch、单次 plan consume、metadata history 可分页。
2. 不写固定 P95/P99、TPS、文件数量、最大 repo 大小或超时数字；这些数字会成为未经授权的产品承诺。
3. 候选压测应使用 synthetic `D-SYNC-*` 数据，测量 local stage、metadata growth、redaction/diagnostic overhead 和 concurrency behavior；不使用真实业务正文。
4. 性能采样不能绕过 safety preflight，也不能把 timeout 当 unknown resolved。

## 6. 兼容性矩阵

| 维度 | 兼容性用例 | 当前姿态 |
|---|---|---|
| protocol schema | missing/extra/unsupported version、wrong carrier kind | P0 contract planned |
| metadata generation | old generation read、migration target、dangling history | logical P0；physical blocked |
| cursor/source | comparator unsupported、gap/replay、out-of-order | P0 negative；source positive blocked |
| Git/fs tools | dirty/symlink/path/lock/LFS/shallow/GUI | safety negative planned；support matrix pending |
| config | old/unknown/alias/forbidden leaf、source precedence | P0 planned；no silent fallback |
| SDK/owner | unavailable/unknown/error mapping、method/version drift | contract planned；positive blocked |

## 7. 可观测性专项

| surface | 允许字段 | 禁止字段 | 验证 |
|---|---|---|---|
| diagnostic | correlation、operation、typed disposition、safe refs、next action | body、secret、credential、full path、raw provider/Git output | redaction contract |
| telemetry | bounded event kind、low-cardinality status、duration bucket（若定义） | arbitrary ref/cardinality、business body | schema/label check |
| audit/provenance | append-only ref/digest/actor/correlation/transition | deletion、伪造 parent、raw content | append/protect/integrity cuts |
| report/artifact plan | case/suite/run/blocker/summary | fake result、verdict/signoff/readiness | evidence boundary check |

## 8. 回填草稿（未来正式 §10）

专项测试覆盖安全与越权、dirty/non-overwrite、可靠性/恢复、幂等/并发、降级、配置兼容、可观测性、CLI 安全和性能/容量设计。性能使用相对/待定指标，不填固定数字；任何真实 Git/SDK/source/review/metadata/tool 或 production-like 验证在合同和环境未闭合前保持 blocked/waiting。telemetry、job report、local commit、ACK 和诊断只作为各自层的观测，不作为 accepted/evidence/readiness。

## 9. 待确认事项

| 事项 | 处理 |
|---|---|
| workload 与性能阈值 | 由 owner/09/07 提供；当前只保留候选指标。 |
| LFS/浅克隆/GUI 支持 | `SYNC-UP-009`；当前只测安全未知/blocked。 |
| external observability backend | L4-observability 合同未闭合；只测 closed local schema/sink isolation。 |
| crash/power loss semantics | `SYNC-UP-006`；只定义 commit unknown/reload logical scenario。 |

## 10. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| NFR、安全、恢复、兼容、观测和性能均有切口 | pass |
| 无未经批准的性能数字或环境承诺 | pass |
| VETO 和 evidence ceiling 仍可捕获 | pass |
| 允许进入 Step 11 | pass |

## 11. 下一步门禁

Step 11 必须定义缺陷分类、严重度、根因回写和复验/回归规则，特别区分实现 defect、设计缺口、上游 blocker、环境问题和 evidence packaging 问题；不能用缺陷关闭 blocker。
