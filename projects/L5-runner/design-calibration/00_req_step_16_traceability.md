# 00 需求 Step 16 · 需求追溯矩阵与孤儿项审计

> 状态：`completed`
> 前置：`00_req_step_07_core_capability_loop.md`～`00_req_step_15_risks_open_questions.md`
> 回填章节：正式 `00` §16 需求追溯矩阵

## 1. 能力到需求矩阵

| 能力节点 | 用户故事 | 功能需求 | 规则 | 验收 | NFR/数据 |
|---|---|---|---|---|---|
| `CP-RUN-01` | `US-RUN-001~002` | `FR-RUN-001~002` | `BR-RUN-001~005` | `AC-RUN-001~002` | 安全、审计；选择 truth、authority snapshot/ref |
| `CP-RUN-02` | `US-RUN-003~004` | `FR-RUN-003~004` | `BR-RUN-006~008` | `AC-RUN-003~004` | 性能、可用性、一致性；cache/验证 truth |
| `CP-RUN-03` | `US-RUN-005~006` | `FR-RUN-005~007` | `BR-RUN-009~013` | `AC-RUN-005~006` | 可用性、安全、一致性；request/control snapshot/ref |
| `CP-RUN-04` | `US-RUN-007~009` | `FR-RUN-008~010` | `BR-RUN-014~018`,`024` | `AC-RUN-007~009` | 安全、审计、一致性；resource/recovery truth |
| `CP-RUN-05` | `US-RUN-010~012` | `FR-RUN-011~013` | `BR-RUN-019~023`,`025` | `AC-RUN-010~011` | 安全、审计、可观测性；preview/diagnostic snapshot/ref |

## 2. 外围与全局覆盖

| 范围 | 覆盖 |
|---|---|
| 外围用户故事 | `US-RUN-013~015` 分别由 `FR-RUN-014~016`、`RUN-UP-006` 和后续 read surface 承接，不阻塞核心闭环。 |
| 外围功能 | `FR-RUN-014~016` 有 pending/blocked 语境、非核心验收边界和 §15 风险入口。 |
| 全部规则 | `BR-RUN-001~025` 均映射至功能、能力节点和验收；无未映射规则。 |
| 全部 NFR | 性能、可用性、安全、审计/可追溯、幂等/一致性、可观测性均在 `AC-RUN-001~011` 和 Step 13 表中有判断口径。 |
| 数据分类 | Runner-owned truth、上游 snapshot、safe ref、禁止正文均有功能/规则/能力映射。 |

## 3. 孤儿与串仓审计

| 审计项 | 结果 |
|---|---|
| 无能力来源的用户故事 | 通过；`US-RUN-001~015` 均归属五个能力节点或外围增强。 |
| 无故事来源的功能 | 通过；`FR-RUN-001~016` 均有用户故事或核心边界理由。 |
| 无功能来源的规则 | 通过；`BR-RUN-001~025` 均映射功能。 |
| 无验收承接的 P0/硬规则 | 通过；核心 P0 与 25 条规则均进入验收矩阵。 |
| 串仓 truth | 通过；Release、Governance、Runtime、Sandbox、Observability、Archive、Project truth 均明确归属上游。 |
| 历史技术污染 | 通过；旧技术和数字只在 historical/pending 语境出现。 |
| 伪造事实 | 通过；未生成实现、测试、baseline、run、artifact、report、evidence、verdict、signoff 或 readiness。 |

## 4. 装配准入

追溯矩阵无孤儿项；上游 blocker 保持原状态。允许进入 Step 17 正式文档装配。

`Step 16 gate_status = pass`；下一步允许进入 `Step 17 正式装配`。
