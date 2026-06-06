# L1-process 07 实施计划 Step 2: 明确实施目标、范围和非范围

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-process/07-实施计划.md` §2 实施目标与范围
> 状态: `[x] 已完成`
> 日期: 2026-06-06

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 2 |
| 主题 | 明确实施目标、范围和非范围 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-process/design-calibration/07_implementation_plan_step_02_scope.md` |

本步定义 L1-process 本轮要交付什么、不交付什么,并把范围锚定到 `00~06` 已确认的 P0 / P1 / P2 边界。

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 最小可交付结果是什么 | `/home/aris/Projects/quantalithos-process` 中可编译、可测试、可验收的 Rust 2024 workspace,支撑 Process runtime shape、profile、instance、activity、waiting gate、checkpoint / recovery、rhythm、query、consumer、outbox、job 和 evidence 闭环。 |
| 哪些需求必须覆盖 | P0 覆盖 C-1~C-5、`FR-PROC-001~008`、`BR-PROC-*` 中 P0 规则和 `AC-PROC-001~029` 的 P0 判定面。 |
| 哪些详细设计章节必须落地 | `03` 中 workspace / module、object、port、protocol、flow、state、persistence、error、idempotency、config、observability 和 test cuts。 |
| 哪些验收项必须可判定 | `AC-PROC-001~029`、`VF-PROC-001~008`、`ST-PROC-*`、`RL-PROC-*` 和 evidence / redaction / risk acceptance 门禁。 |
| 哪些能力明确不在本轮 | production DB / MQ / search / trace / archive 接入、真实生产容量、deployment topology、on-call runbook、完整 P1 real-like adapter 成熟度和 P2 运维平台。 |
| P1 / P2 是否易膨胀 | 是。`integration-like` 只做 controlled seam / smoke,不代表生产成功;性能只做 sample report,不继承旧硬阈值。 |

## 3. 结构化中间产物

### 3.1 实施目标表

| 目标 | 来源 | 本轮口径 | 完成判定 |
|---|---|---|---|
| Runtime process shape 成立 | `FR-PROC-001`;`AC-PROC-001/006` | method definition 形成可执行 runtime shape,不接管 method 正文 | shape/profile command、consumer、query 和 event 证据可追溯 |
| Process instance 成立 | `FR-PROC-002`;`AC-PROC-002/007` | ProcessInstance 作为运行事实,不退化为 workspace 进度条或 runtime record | instance command / state / query / trace 通过 |
| Activity / token / gateway 表达推进位置 | `FR-PROC-003`;`AC-PROC-003/008` | Activity、Token、Gateway 只表达 Process 节点与流控位置 | 16 状态机与 activity progress tests 通过 |
| Runtime feedback 绑定 Activity | `FR-PROC-004`;`AC-PROC-009` | 只保存 ref / digest / marker,不保存 runtime execution body | inbound feedback、redaction 和 query 证据通过 |
| Waiting / checkpoint / recovery 连续 | `FR-PROC-005/006`;`AC-PROC-004/010/011` | waiting gate、checkpoint、recovery attempt 延续同一 Process truth | recovery / replay / state tests 通过 |
| 授权消费与追溯 | `FR-PROC-007`;`AC-PROC-005/012` | 11 Query、timeline、trace、reconciliation report 只读消费 | query no-write 与 evidence index 通过 |
| 维护与对账 | `FR-PROC-008`;`AC-PROC-013` | jobs 只写 marker、report、projection 或 publication state,不修复 Process truth | 7 operations job tests 通过 |

### 3.2 实施范围表

| 类别 | 本轮实施 | 数量 / 口径 |
|---|---|---|
| workspace | Rust 2024 workspace | 7 个 crate:`contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` |
| Command | public write protocol | 13 个 Command |
| Query | public read protocol | 11 个 Query,全部 no-write |
| Inbound Consumer | inbound event intake | 7 个 event consumer |
| Outbound Event | outbox publication payload | 10 个 outbound event |
| Operations Job | maintenance / reconciliation / handoff | 7 个 jobs |
| State machine | core truth + derived / reference / publication / handoff / report | 16 组状态机 |
| Config profile | P0 profile | `local-dev`、`ci-test`、`integration-like`、`operations-replay` |
| Evidence | fixed run artifacts / reports | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |

### 3.3 非范围表

| 非范围 | 理由 | 处理 |
|---|---|---|
| method-library 正文、work 正文、runtime execution body、conversation body | Process 只保存 ref / digest / marker / safe summary | redaction 和 forbidden body tests |
| 真实 production DB / MQ / search / trace / archive adapter | P0 只要求 fake / controlled seam | 后续 P1 / P2 |
| production deployment / on-call / capacity SLO | 06 明确 P0 只要 sample report | 后续运维文档 |
| 自动修复 Process truth 的 reconciliation / job | 违反 query / job no truth repair 红线 | jobs 只写 marker / report |
| staging-like / production-like 配置 | `04` 标为 P1/P2 | 不阻塞 P0 |
| README 旧 Python / PG 方案 | 已被 `03` Rust workspace 基线取代 | 不作为实现输入 |

## 4. 回填草稿

```markdown
## 2. 实施目标与范围

> 校准来源:
> - `design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“实施目标表”“实施范围表”和“非范围表”小节。

本轮最小可交付结果是在 `/home/aris/Projects/quantalithos-process` 中交付一个可编译、可测试、可验收的 Rust 2024 workspace,让 L1-process 的运行时过程形态、项目过程实例、节点推进、等待恢复、授权消费、维护对账和证据闭环成立。
```

## 5. 进入下一步条件

- P0 / P1 / P2 边界明确。
- 非范围已显式列出。
- 目标实现仓、协议数量、状态机数量和 evidence 路径已固定。
