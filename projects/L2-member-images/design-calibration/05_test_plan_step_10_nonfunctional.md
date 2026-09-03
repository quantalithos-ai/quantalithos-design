# L2-member-images 05 测试方案 Step 10：专项测试与非功能验证

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 10
> 回填位置：正式 `05-测试方案.md` 第 10 章

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 设计安全、一致性、恢复、可观测、审计、依赖和性能方向的专项验证，明确没有 baseline 时不得编造数值阈值。 |
| 本步输入 | Step 1~9；00 `NFR-MI-*`；01 横切约束；03 §10~§15；04 §8~§11。 |
| 本步输出 | 专项矩阵、不可量化项处理、VETO 关联和证据规划。 |
| gate_status | `pass_with_explicit_blockers` |

## 1. SOP 问题回答

| 问题 | 收敛回答 |
|---|---|
| 性能如何测试？ | 只验证不触发 build/registry/instantiation 的 read path 以及未来 benchmark 的可重复设计；无 workload/baseline 时不写时延、吞吐、容量或 SLO 数字。 |
| 安全如何测试？ | raw body/secret/credential/endpoint/live state 拒绝、no-`latest`、profile fake 隔离、redaction scan 和低基数标签审查。 |
| 一致性/恢复如何测试？ | version、append-only、UoW、duplicate、commit unknown、projection direction；PF 的 `Unavailable` recovery 只能断言 blocked，不能伪造恢复。 |
| 可观测性如何测试？ | 验证 safe fields、safe reason、low-cardinality labels，且日志/metric/span 不变成 audit/evidence backend。 |
| 哪些专项依赖外部 owner？ | build/registry、Artifact、scanner/signature、consumer、真实 environment 的正向/量化测试均是 P1/P2 pending。 |

## 2. 专项测试矩阵

| 专项 | 风险/设计依据 | 方法 | 环境 | 通过条件 | 证据规划 |
|---|---|---|---|---|---|
| 安全与静态/live | `BR-MI-007`、`NFR-MI-019`、03/04 redline | forbidden fixture + parser/domain/entry scan | `ci-test` | body/secret/live state 均被拒绝或不输出 | `EV-SEC-001` |
| Pin/immutable input | no-`latest`、static reference constraints | mutable/latest/unknown selector negative cases | local/CI | `Blocked`/reject；无 auto replacement | `EV-UNIT-001`、`EV-SEC-001` |
| UoW/一致性 | 03 §10/12 | fake store/fault injection、version race、rollback | CI controlled | 无 partial commit、cursor 非 version、history append-only | `EV-INT-001` |
| 幂等/重入 | 03 §12，B01/B02/OPEN-01/02 | canonical/replay contract tests；current zero-effect | CI | 当前不 reserve/result；future template仅同 canonical input replay | `EV-SVC-001`、`EV-INT-001` |
| 恢复/可用性 | 03 §11/12、PF | unavailable/unknown/blocked injection | CI/nightly planned | 不盲 retry、不 Query repair；`Unavailable` recovery = blocked | `EV-REC-001` |
| 配置韧性 | 04 source/schema/profile/fail-closed | malformed/priority/sensitive/reload tests | local/CI | whole-config reject，无 silent fallback/LKG | `EV-CONFIG-001` |
| 可观测与审计 | 03 §14 | safe log/metric/span fixture scan | CI | 仅 low-cardinality safe field；no audit record on no-audit paths | `EV-OBS-001` |
| 依赖边界 | 01/03 dependency matrix | planned dependency/static scan | CI | 无 sibling business compile dependency；分类不漂移 | `EV-GATE-001` |
| 性能/容量方向 | `NFR-MI-001`、`R-MI-009` | future benchmark plan，read-only workload sample | future controlled | 未设阈值；结果只能用于后续 baseline | `EV-PERF-001` planned |
| 真实供应链/consumer | `MI-UP-001/007`、`Q-MI-003/004` | owner-closed real-like seam | future staging | 仅 owner 合同闭合后定义 oracle | blocked，不列当前 EV pass |

## 3. VETO 与专项断言

| 风险 | 专项断言 |
|---|---|
| 外部 body、secret 或 live state 入仓 | 任何 truth/view/trace/log/report 输出发现 forbidden sentinel 即失败 |
| staged state 冒充 global readiness | `Available`、`Fresh`、`Assembled`、slot Available 均不能产生 build/Artifact/consumer/runtime/readiness assertion |
| Query/Job 反写真相 | Query 无写；Job 无 scheduler/report/repair，PF 前 no recovery transition |
| fake/ACK 伪成功 | fake 只返回正式 blocked/unavailable/unknown 等保守 disposition；不产生 digest/gate/Artifact/confirmation |

## 4. 改动前后对比与取舍

不采用无来源的性能/SLO、扫描品类、签名算法、容量或 retention 数字；采用离散状态、禁止行为和链完整性作为当前判定。专项表统一引用 Step 13 的 `EV-UNIT/SVC/ENTRY/INT/CONFIG/SEC/OBS/GATE/REC/PERF` 规划族，未产生实际 evidence。

## 5. 回填草稿、待确认事项与进入下一步条件

正式 §10 回填专项矩阵、VETO 关联和“无量化 baseline 不伪造阈值”规则。待确认：实际性能模型、scanner/signature policy、real-like adapter、observability backend。进入 Step 11 的条件是每个 NFR/VETO 有方法、环境、判定上限和证据规划。
