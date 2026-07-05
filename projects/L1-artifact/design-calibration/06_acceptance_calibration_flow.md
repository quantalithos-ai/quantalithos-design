# L1-artifact 06 验收标准校准流程

> 对应正式文档: `projects/L1-artifact/06-验收标准.md`
> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md`
> 书写规范: `standards/document/验收标准书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 当前目标: 按新版正式 `00/01/02/03/04/05` 复核并重写 `L1-artifact` 的 `06-验收标准.md`
> 当前状态: Step 9 已完成;待用户审查

---

## 1. 本轮重写原则

- 新版 `06` 必须直接承接正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md`。
- 旧版 `06-验收标准.md` 只作为历史诊断输入,不得直接继承旧 CreateArtifact / PublishArtifactVersion / EvidenceRef / FreezeBaseline 少量主线、旧环境矩阵、旧证据口径或旧最终结论占位。
- 验收标准只定义通过 / 有条件通过 / 不通过的裁决门禁和签署口径,不得新增 `00`~`05` 未定义的需求、schema、port、state、profile、测试用例、真实 run 结果或实施任务。
- 当前 `05` 固定的 authoritative candidate evidence id 是 `EV-CAND-ART-*`;新版 `06` 必须保持 `EV-CAND-ART-* -> artifact_path -> report_path -> run_id` 可逆追溯,不得静态伪造 evidence 或默认 VETO passed。
- `PublishPendingArtifactRelays` 必须继续作为 worker-only internal relay publication facade 单独裁决,不得并入 6 个 public operations jobs。
- 本轮每个 Step 完成后停审;用户审核通过后再进入下一 Step。

---

## 2. 稳定输入

| 输入 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `projects/L1-artifact/00-需求文档.md` | 新版正式文档 | 核心能力、`FR-ART-*`、`BR-ART-*`、`NFR-ART-*`、`14.1~14.6` 和 `VF-ART-*` 输入 |
| `projects/L1-artifact/01-架构设计.md` | 新版正式文档 | truth ownership、依赖裁剪、数据所有权、只读消费和派生不反写输入 |
| `projects/L1-artifact/02-概要设计.md` | 新版正式文档 | 组成部分、接口骨架、处理流、状态集合和配置影响输入 |
| `projects/L1-artifact/03-详细设计.md` | 新版正式文档 | 对象、协议、flow、状态矩阵、事务、幂等、错误、观测和测试切口输入 |
| `projects/L1-artifact/04-配置设计.md` | 新版正式文档 | P0 profile、strict validation、source priority、redaction、degraded/no-write 和 replay 输入 |
| `projects/L1-artifact/05-测试方案.md` | 新版正式文档 | `TC-ART-*`、`EV-CAND-ART-*`、suite / gate、artifact root、report root、证据真实性和 residual risk 输入 |
| `standards/document/验收标准讨论流程_SOP.md` | 最新验收标准流程标准 | Step 1~15 执行依据 |
| `standards/document/验收标准书写规范.md` | 最新正式文档结构标准 | 正式 `06` 装配依据 |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物和台账规范 | Step / flow / project ledger 纪律依据 |
| 旧 `06-验收标准.md` | 早于新版正式 `03/04/05` | 只作为历史诊断输入;不得直接继承 |

---

## 3. 总流程计划

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---:|---|---|---|---|---|---|---|
| 1 | 确认验收输入边界 | 新版 `00/01/02/03/04/05`、旧 `06`、验收 SOP / 规范 | `06_acceptance_step_01_input_boundary.md` | 无 | 已完成;待用户审查 | 验收输入、旧 `06` 降级、必须回答 / 不再回答、后续基线待固定项明确 | 等待 Step 1 用户审查 |
| 2 | 明确验收目标与范围 | Step 1、新版 `00/05` | `06_acceptance_step_02_scope.md` | Step 1 | 已完成;待用户审查 | P0/P1/P2 验收范围、非范围和一票否决候选闭合 | 等待 Step 2 用户审查 |
| 3 | 固定验收基线 | Step 2、送验版本、测试报告 / 证据 run、环境配置 | `06_acceptance_step_03_baseline.md` | Step 2 | 已完成;待用户审查 | design / implementation / core-contracts / config / run / artifact / report / acceptance handoff 基线闭合 | 等待用户审查 Step 3 |
| 4 | 定义进入条件与退出条件 | Step 3、`05` 退出准则 | `06_acceptance_step_04_entry_exit.md` | Step 3 | 已完成;待用户审查 | entry / exit checklist、暂停 / 不可裁决条件闭合 | 等待用户审查 Step 4 |
| 5 | 定义功能验收门禁 | `00` 功能清单、`03` flow、`05` 用例与证据 | `06_acceptance_step_05_function_gate.md` | Step 4 | 已完成;待用户审查 | 五个核心能力与 `FR-ART-001~020` 的功能裁决闭合 | 等待用户审查 Step 5 |
| 6 | 定义数据边界与架构红线验收 | `01` 数据所有权、`02/03` 禁止事项、`05` 红线证据 | `06_acceptance_step_06_data_arch_redlines.md` | Step 5 | 已完成;待用户审查 | truth / snapshot / ref / forbidden body 和架构红线闭合 | 等待用户审查 Step 6 |
| 7 | 定义接口、事件与跨仓同步验收 | `03` protocol、`04` topic/config、`05` suite / evidence | `06_acceptance_step_07_interfaces_events_sync.md` | Step 6 | 已完成;用户审查通过 | 16 Command、13 Query、6 Consumer、8 Event、6 Job、relay facade 和跨仓 seam 裁决闭合 | 进入 Step 8 `定义状态机、事务与一致性验收` |
| 8 | 定义状态机、事务与一致性验收 | `03` state / transaction / idempotency、`05` idempotency cases | `06_acceptance_step_08_state_tx_consistency.md` | Step 7 | 已完成;待用户审查 | 状态迁移、UoW、stored result、duplicate replay、commit unknown、query no-write、job no-truth-repair 闭合 | 等待用户审查 Step 8 |
| 9 | 定义非功能验收门禁 | `00` NFR、`04` config、`05` nonfunctional | `06_acceptance_step_09_nonfunctional.md` | Step 8 | 已完成;待用户审查 | 性能 sample、安全、可用性、恢复、依赖降级、配置 fail-fast 和无来源指标边界闭合 | 待 Step 9 审查 |
| 10 | 定义可观测性、审计与证据门禁 | `03` observability、`05` evidence/report | `06_acceptance_step_10_observability_evidence.md` | Step 9 | 未开始 | trace/audit/log/metric/report、artifact/report pairing、redaction/dependency/report audit 闭合 | 待 Step 9 审查 |
| 11 | 定义一票否决项 | `00` §14.6、`05` VETO /不可接受项 | `06_acceptance_step_11_veto.md` | Step 10 | 未开始 | `VF-ART-001~004` 与不可风险接受项闭合 | 待 Step 10 审查 |
| 12 | 定义缺陷分级、复验与放行规则 | `05` §11 / §12 / §14 | `06_acceptance_step_12_defects_retest_release.md` | Step 11 | 未开始 | S/A/B/R、复验范围、放行影响和关闭证据闭合 | 待 Step 11 审查 |
| 13 | 定义风险接受与遗留项 | `05` residual risk、Step 2~12 | `06_acceptance_step_13_risk_acceptance.md` | Step 12 | 未开始 | residual、接受人、影响、后续动作、截止条件和不可接受风险闭合 | 待 Step 12 审查 |
| 14 | 定义最终结论与签署口径 | Step 1~13 | `06_acceptance_step_14_final_decision_signoff.md` | Step 13 | 未开始 | 通过 / 有条件通过 / 不通过三值规则、签署角色和归档口径闭合 | 待 Step 13 审查 |
| 15 | 整理正式验收标准文档 | Step 1~14、书写规范 | `06_acceptance_step_15_formal_document_assembly.md` 与 `../06-验收标准.md` | Step 14 | 未开始 | 正式 `06` 每章有校准来源,正式 `06` 已装配且未引入未确认口径 | 待 Step 14 审查 |

---

## 4. Step 内统一执行模板

每个 `06_acceptance_step_*` 文件必须按以下结构落盘:

1. Step 状态
2. 本步目标
3. 本步输入
4. SOP 问题回答
5. 当前文档问题诊断
6. 改动前后对比
7. 验收裁决取舍
8. 结构化中间产物
9. 回填草稿
10. 待确认事项
11. 进入下一步条件

涉及验收项、红线、接口、状态、非功能、证据、一票否决、缺陷和风险接受的 Step,必须按“验收主题 -> 验收项 -> 设计契约 -> 测试用例 -> 证据 ID / report path -> 通过条件 / 失败条件 -> 裁决影响”的小循环展开,不得先生成全局大表再事后补证据。

---

## 5. 当前必须额外盯住的事项

| 编号 | 事项 | 来源 | 当前处理 |
|---|---|---|---|
| ART-ACC-WATCH-001 | 旧 `06` 只覆盖 create / publish / adopt / freeze 少量旧主线,缺少新版 7 模块、16 Command、13 Query、6 Consumer、8 Event、6 Job、relay facade、配置和证据门禁 | 旧 `06` 诊断 | Step 1 降级为历史输入 |
| ART-ACC-WATCH-002 | `05` 已明确不做验收裁决、不发明 formal EV / AC,新版 `06` 必须正式收口裁决口径 | 新版 `05` §1 / §13 / §14 | Step 1 记录为后续 Step 2 / 5 / 10 / 11 / 14 必答 |
| ART-ACC-WATCH-003 | 当前 authoritative evidence id 是 `EV-CAND-ART-*`,不是真实 run 结论 | 新版 `05` §13 | Step 3 / Step 10 必须固定 run/report 后才能裁决 |
| ART-ACC-WATCH-004 | P0 profile 只有 `local-dev`、`ci-test`、`integration-like`、`operations-replay` | 新版 `04` / `05` | `staging-like` / `production-like` 只能作为 P1/P2 或 residual |
| ART-ACC-WATCH-005 | `PublishPendingArtifactRelays` 是 worker-only internal facade | 新版 `03` / `05` | Step 7 / Step 8 / Step 10 / Step 11 必须单列裁决 |

---

## 6. 当前执行状态

| 项 | 状态 |
|---|---|
| 正式 `06-验收标准.md` | 旧正文保留;尚未在本轮重写中修改 |
| 当前完成 Step | Step 9 已完成;等待用户审查 |
| 当前下一步 | 审查 `06_acceptance_step_09_nonfunctional.md`;通过后进入 Step 10 |
| 是否创建 / 替换未来 Step 文件 | 已创建 `06_acceptance_calibration_flow.md`、`06_acceptance_step_01_input_boundary.md`、`06_acceptance_step_02_scope.md`、`06_acceptance_step_03_baseline.md`、`06_acceptance_step_04_entry_exit.md`、`06_acceptance_step_05_function_gate.md`、`06_acceptance_step_06_data_arch_redlines.md`、`06_acceptance_step_07_interfaces_events_sync.md`、`06_acceptance_step_08_state_tx_consistency.md` 与 `06_acceptance_step_09_nonfunctional.md`;未创建未来 Step 文件 |
| 旧 `06` 如何处理 | 只作历史诊断输入;Step 15 再按新版 `00`~`05` 和 Step 1~14 结论重写正式 `06` |
