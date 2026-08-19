# L2-runtime 00 需求 Step 13: 非功能需求

> 创建日期: 2026-08-07
> 状态: done_stop_review
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 13 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 7 能力、Step 10 规则、Step 11 数据、Step 12 接口 |
| 类别 | 性能 / 可用性 / 安全 / 审计可追溯 / 幂等一致性 / 可观测性 |
| 禁止 | 无来源数字、实现方案、真实测试结果、provider / backend SLA |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| C1~C5 能力级质量 | done | 能力 NFR | pass |
| 全局质量约束 | done | 全局 NFR | pass |
| 六类覆盖审计 | done | 适用性矩阵 | pass |
| 判断口径 / 后置基线 | done | 无伪 SLA 口径 | pass |
| 回填与自检 | done | 第 13 章候选 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些 NFR 回指能力? | C1 的状态一致性、C2 的 source-safe composition、C3 的 model decision safety、C4 的 action admission / isolation、C5 的 recovery / handoff integrity。 |
| 哪些覆盖全仓? | owner separation、fail-closed、history / idempotency、safe material、degraded surface 和 evidence traceability。 |
| 是否能量化? | 当前无实现 / workload / baseline;只定义测量维度、分位数 / 错误预算未来如何固定,不填目标数字。 |
| Step 14 如何验收? | 每项 NFR 都提供结构性断言与未来同 run 证据要求;不能填写“已达标”。 |

## 3. NFR 表

| ID | 类别 | 适用能力 | 要求 | 判断口径 / 目标值 |
|---|---|---|---|---|
| `NFR-L2R-001` | 性能 | C1~C5 | Runtime 主循环的本地编排、context composition、decision bookkeeping 与 checkpoint 不应因外围报表 / observed / SDK 等非核心路径无限放大。 | 以固定 workload、依赖状态、run scope、模型调用是否排除和同一环境记录分解测量;当前无数值目标。 |
| `NFR-L2R-002` | 性能 | C2/C3 | Context 预算、memory retrieval、model turn 与 action decision 必须能区分等待外部耗时和本地处理耗时。 | 报告按 stage / dependency / outcome 分类;不得用一个总延迟掩盖 provider / memory / Sandbox。 |
| `NFR-L2R-003` | 性能 | C4/C5 | sub-agent 数量、context size、checkpoint 频率和 handoff material 大小必须有可审查的预算或限制语义。 | 预算来源和超限行为后续在配置 / 详细设计闭口;无来源时 blocked,不默认无限。 |
| `NFR-L2R-004` | 可用性 | C1/C5 | 外部输入或 adapter 短暂不可用时,Runtime 应保持可判别 waiting / blocked / degraded,而不丢失本地历史。 | 可重复注入 dependency unavailable / timeout / late feedback,检查状态和历史不被覆盖。 |
| `NFR-L2R-005` | 可用性 | C2/C3 | model / durable memory 非核心 seam 不可用时,只影响适用能力;可安全继续的 no-model / working-only 路径需显式标注。 | 按能力依赖矩阵验证隔离降级;不把 fallback 结果伪装为等价成功。 |
| `NFR-L2R-006` | 可用性 | C4 | Tools / Governance / Sandbox 正向 seam 缺失时,必须 fail closed 或等待,不得 host / local bypass。 | negative / blocked-aware / deterministic fake 测试;真实 positive readiness 另行 qualification。 |
| `NFR-L2R-007` | 安全 | C2/C3 | forbidden body、secret、token、raw provider / tool / Sandbox / Artifact body 和 hidden reasoning 不得进入 Runtime truth、checkpoint 或 safe handoff。 | redaction / denylist / body-free 检查覆盖写面、事件面、报告面;发现即阻塞。 |
| `NFR-L2R-008` | 安全 | C4 | governed action、capability-bound action、sandbox-required action 必须按正式 owner 结果和边界执行。 | owner、scope、freshness、precondition 缺失 / 冲突即 reject / wait / blocked;不得本地 allow。 |
| `NFR-L2R-009` | 安全 | C4 | sub-agent scope、context、budget 和 action authority 必须不超过父 run 可授权范围。 | 构造越权 / 共享 mutable memory / 无界 child fixture,必须被拒绝或隔离。 |
| `NFR-L2R-010` | 审计 / 可追溯 | C1~C5 | run、goal / plan、context source、model decision、action、checkpoint、recovery、outcome 和 handoff 都能按同一关联语境追溯。 | 每条结论有 source / purpose / run / turn / outcome linkage;不要求隐藏推理正文。 |
| `NFR-L2R-011` | 审计 / 可追溯 | C5 | local outcome、handoff attempt、delivery、observed、artifact / process / conversation consumption 分层可解释。 | 故障注入后本地 truth 保持,外部状态独立标注 pending / failed / unknown。 |
| `NFR-L2R-012` | 审计 / 可追溯 | C2/C3 | source version / freshness / decision summary 与后续恢复 / 重入可关联,防止 snapshot 漂移无法解释。 | stale / conflict / re-resolution 形成新事实或 gap,不覆盖历史。 |
| `NFR-L2R-013` | 幂等 / 一致性 | C1/C4/C5 | 重复 trigger、action feedback、checkpoint、resume 和 handoff 不产生分叉 run truth 或重复不可逆副作用。 | 相同 correlation / digest / scope 的重复输入行为可判定;side-effect unknown 不自动重放。 |
| `NFR-L2R-014` | 幂等 / 一致性 | C2 | 同一 source 在同一 turn 的重复读取不会生成第二 truth;候选、snapshot 和 committed memory 语义不混。 | duplicate / stale / conflict fixture 检查读写分层。 |
| `NFR-L2R-015` | 幂等 / 一致性 | C3/C4 | model / Tool / child 迟到结果不能覆盖新的 decision 或已提交 outcome。 | late / duplicate / out-of-order feedback 保留独立关联并拒绝逆写。 |
| `NFR-L2R-016` | 可观测性 | C1~C5 | Runtime 关键状态、失败、等待、unknown、dependency gap、recovery 和 handoff degradation 能形成低敏、低基数、可关联材料。 | 不以 Observability backend ready 为前提;safe material / local audit / event attempt 可判断。 |
| `NFR-L2R-017` | 可观测性 | C3/C4 | 观测材料不泄漏 hidden reasoning、secret、raw body 或高基数 provider / user 内容。 | redaction-before-serialization、body-free、label cardinality 检查。 |
| `NFR-L2R-018` | 可观测性 | C5 | 事件 / 观测交接失败、不可用、重复或 unknown 必须可见但不能被解释为 Runtime outcome 失败 / 成功。 | attempt / delivery / observed / gap 状态可分层,route 未闭口则 pending。 |
| `NFR-L2R-019` | 全局 | C1~C5 | 所有依赖边界、正向 qualification、fake / controlled seam 与真实 readiness 必须区分。 | 设计、测试、验收和实施台账不得把 planned / blocked / not_run 写成 pass。 |

## 4. 六类适用性审计

| 类别 | 是否适用 | 处理结论 |
|---|---|---|
| 性能 | 是,但当前不量化 | 先定义 stage / dependency / workload 测量边界。 |
| 可用性 | 是 | 以 waiting / blocked / degraded / local history 保留为目标。 |
| 安全 | 强适用 | body-free、fail-closed、scope、no-bypass 是硬门禁。 |
| 审计 / 可追溯 | 强适用 | safe decision / source / outcome / handoff linkage。 |
| 幂等 / 一致性 | 强适用 | duplicate、unknown、late、history immutable。 |
| 可观测性 | 强适用 | safe material / low cardinality / owner separation。 |

## 5. 历史指标审计

| 旧指标 | 处置 |
|---|---|
| loop < 50ms、checkpoint P95 < 100ms、memory < 500ms | 无当前 workload / measurement authority,不继承;后续由 05/06/07 在证据就绪后制定。 |
| reasoning trace 100% | 改为关键 decision / outcome / source 可追溯且无 hidden body。 |
| tool guardrail 100% 高危路径 | 改为所有适用 governed / sandbox-required path fail closed;高危 taxonomy 由 Governance / Tools owner 提供。 |
| provider / vector store 99.9% | 不进入 Runtime NFR;availability 由 dependency seam 和 blocked surface 表达。 |

## 6. 回填草稿

正式第 13 章采用 `NFR-L2R-001~019` 与六类适用性审计。当前质量目标优先锁定安全、可追溯、幂等、一致性和失效分层;性能与容量只定义测量口径,不凭旧 README 伪造阈值。

## 7. 待确认事项

- workload、容量、model / memory profile、Sandbox / Observability readiness、真实 provider qualification 均后置。
- 若后续出现必须量化的合同义务,必须补充 authority、baseline、workload、error semantics 和变更规则后才能写入正式 NFR。

## 8. 自检与门禁

| 检查 | 结果 |
|---|---|
| 六类均判断适用性 | pass |
| 无来源数字 / SLA | pass |
| NFR 可被 Step 14 承接 | pass |
| 全局质量约束未强塞能力节点 | pass |

```text
gate_status = pass
next_allowed_action = create_step_14_acceptance_criteria
formal_document_write_allowed = false
```
