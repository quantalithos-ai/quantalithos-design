# Step 10. 设计专项测试与非功能验证

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 10
> 回填章节：`05-测试方案.md` §10

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 专项测试与非功能验证 |
| 当前状态 | `completed / pass_with_upstream_blockers` |
| 原则 | 指标必须有来源；无 authority 的数值只保留 candidate，不判定通过 |
| 停审结论 | P0 结构性红线有验证方法；硬性能阈值与真实外部可用性保持 pending |

## 2. 输入与边界

| 输入 | 直接承接 |
|---|---|
| `00` §13~§14 | NFR-MS-001~020、AC-MS-034~039、VF-MS-001~009 |
| `03` §10~§15 | UoW、错误恢复、幂等并发、配置、观测和测试切口 |
| `04` §8~§12 | redaction、profile、failure、rollback、evidence 承接 |
| Step 6~9 | P0 用例、数据、环境和自动化门禁 |

本 Step 不引入新的业务状态、性能数字、外部产品、SLO、凭据策略或 observability backend；专项测试只验证本仓边界和可解释性。

## 3. 专项测试矩阵

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | 证据候选 |
|---|---|---|---|---|---|
| 性能分阶段 | 意图受理、当前读取、注册/信号受理、本地提交与外部等待混淆 | 固定 workload、profile、依赖状态，按阶段记录 duration | `ci-test` sample / future selected run | 当前无数值；必须分阶段、可重复、无无界外围任务 | `EV-CAND-NFR-PERF-*` |
| 装配耗时分解 | 镜像、承载、binding、Member/Runtime 等等待被压平 | controlled seam latency buckets | `integration-like` | 无 authority 不判定硬目标；每 bucket 可解释 | `EV-CAND-NFR-ASSEMBLY-*` |
| 可用性 / fail-closed | 必要依赖 unavailable/stale/conflict/partial/unknown 时误放行 | fault injection + disposition assertion | `ci-test` / `integration-like` | 不得 default allow；既有历史可读 | `EV-CAND-NFR-AVAIL-*` |
| 恢复 / unknown | restart、late feedback、commit/rollback unknown 产生竞争 host 或盲重放 | deterministic fault and replay | `operations-replay` | 原 generation/key 保留；进入 hold/blocked/reconcile | `EV-CAND-NFR-RECOVERY-*` |
| 安全 / no-bypass | 非项目主语、scope 不匹配、required binding 缺失、forbidden body | negative contract + artifact scan | all P0 profiles | 任一越权、fallback 或泄漏即 fail-closed | `EV-CAND-NFR-SEC-*` |
| 一致性 / 幂等 | duplicate、concurrent、out-of-order 不分叉 truth | dual writer/publisher and same-key replay | `ci-test` / `operations-replay` | 单一 winner；不重算、不换 key、不抹历史 | `EV-CAND-NFR-IDEMP-*` |
| 可观测性 | host/session/backend/binding/unknown 层级和 gap 可区分 | structured log/metric/trace/audit fixture check | `ci-test` | safe fields、低基数、correlation 继承 | `EV-CAND-NFR-OBS-*` |
| 审计 / 追溯 | intent→decision→host→closure/handoff 可回链 | history/material/handoff/report relation check | `ci-test` / replay | ref、reason、revision、generation 可回链；无正文 | `EV-CAND-NFR-AUDIT-*` |
| 证据诚实 | planned/blocked/not_run/fake-qualified 被伪装成 ready/pass | artifact/report audit | release gate | 缺 raw artifact/report 或静态映射即失败 | `EV-CAND-NFR-REPORT-*` |
| 依赖裁剪 | runtime/event/ref/adapter 被写成 compile dependency | graph scan | PR / release | 仅批准 compile seam；其余无源码依赖 | `EV-CAND-NFR-ARCH-*` |

## 4. 性能专项口径

| 维度 | 当前定义 | 不得做的事 |
|---|---|---|
| workload | 由未来测试 owner 固定 project/member/host 数、请求比例、信号频率和 job 批量 | 不从旧 README 数字倒填 |
| stage boundary | local validation、domain/UoW、adapter wait、publication/handoff 分开 | 不用单一端到端数字掩盖外部等待 |
| dependency state | fake、controlled、unavailable、unknown 分档 | 不把 fake positive 当真实可用 |
| statistic | 未来需确定采样、窗口、percentile、warm/cold 口径 | 无 authority 不写 P95/SLA |
| evidence | 每次 run 固定 `run_id`、profile、config digest、stage bucket | 不引用 `latest` 或手写通过 |

## 5. 安全、边界与恢复专项

| 红线 | 触发数据 / 操作 | 断言 |
|---|---|---|
| 主语边界 | GlobalMember、Workspace view、默认 actor 替代 ProjectMember | reject / waiting；无 HostIntent / Host |
| owner truth | 注入 Work / Identity / Member / Images / Runtime / Sandbox / Observability 正文 | reject；任何 store、log、report、outbox 均无正文 |
| required seam | binding/credential/pinned asset stale/unknown | not ready / blocked；无 host fallback |
| no-write | Query 读取 stale/degraded projection | outcome 可见；无 write UoW / repair / refresh |
| no-authorization | Job 触发无已提交 work 或 scheduler input | item rejected/empty；无 intent/decision/generation/new key |
| unknown fence | timeout/commit unknown/rollback unknown | hold/unknown/reconcile；原 key 保留 |
| generation fence | old feedback / out-of-order signal | late/gap/unknown；current 不变 |
| forbidden output | secret、credential、manifest、endpoint、stack、broker body、外部正文 | redaction gate failed；不回显 sentinel |

## 6. 观测与审计证据矩阵

| 输出面 | 必须包含 | 必须禁止 | 检查方式 |
|---|---|---|---|
| structured log | operation/CMP/disposition/error category/safe refs/freshness | request/body/secret/URL/SQL/stack | schema + redaction scan |
| metrics | low-cardinality operation/CMP/disposition/outcome layer | host/member/actor/effect/idempotency/message raw id | label allowlist check |
| trace | correlation/trace ref、phase、safe outcome | payload/body/token、高基数自由文本 | propagation fixture |
| accepted audit/history | object/ref、old/new state、reason、source/cursor、relation | 外部正文、secret、未提交结果 | relation and body-free check |
| artifact/report | run/profile/config digest、case/evidence refs、安全摘要 | raw body、静态 pass、未配对 evidence | report audit |

## 7. 专项到 suite 映射

| 专项 | 主要 suite | 失败处理 |
|---|---|---|
| fail-closed / safety | `service-flow-fast`、`config-redline` | P0 阻断 |
| consistency / recovery | `infra-runtime-fake`、`operations-replay-core` | P0 阻断 |
| redaction / observability | `redaction-boundary` | P0 阻断 |
| dependency boundary | `dependency-boundary` | P0 阻断 |
| performance candidate | future selected suite | 无 authority => residual，不判 P0 pass |
| real sibling positive | future `real-like-selected-run` | blocked/unavailable => residual |

## 8. 专项停审与回填草稿

| 审计项 | 结论 |
|---|---|
| P0 安全和一致性红线有方法 | pass |
| 非功能指标有来源 | pass；硬数值保持 candidate |
| 可观测性可留证 | pass；只使用安全字段 |
| 外部产品被误写为前置 | 未发现 |

正式 §10 应写专项矩阵、性能候选口径、安全/恢复/一致性/观测检查和 suite 映射；不填实际测量值或通过结论。

- [x] P0 非功能红线有可执行验证方法。
- [x] 无来源数值未升级为阈值。
- [x] 可进入 Step 11。
