# L1-conversation 07 实施计划 Step 2: 明确实施目标、范围和非范围

> 所属流程: `07_implementation_plan_calibration_flow.md`
> 对应正式文档: `projects/L1-conversation/07-实施计划.md` §2 实施目标与范围
> 状态: `[x] 已完成`
> 日期: 2026-06-02

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 2 |
| 主题 | 明确实施目标、范围和非范围 |
| 当前状态 | `[x] 已完成` |
| 是否修改正式 `07-实施计划.md` | 否 |
| 产物位置 | `projects/L1-conversation/design-calibration/07_implementation_plan_step_02_scope.md` |

本步把 `00~06` 中已经确认的需求、详细设计、配置、测试和验收门禁转换为本轮实施目标、实施范围和非范围。本步不拆 phase、不拆 commit boundary、不创建正式 `07-实施计划.md`。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `07_implementation_plan_step_01_input_boundary.md` | 承接已确认的输入边界、目标实现仓、实现形态和风险 |
| `00-需求文档.md` §4 / §7 / §9 / §10 / §14 / §16 | 提取目标、非目标、核心能力闭环、`FR-CONV-*`、`BR-CONV-*` 和验收方向 |
| `03-详细设计.md` §2 / §3 / §4 / §16 / §17 | 提取 P0 展开范围、实现者可完成代码范围、workspace、crate、依赖和实施交接约束 |
| `04-配置设计.md` §2 / §7 / §9 / §11 / §12 | 提取配置、profile、路径、redaction、runtime graph 和 fail-fast / fail-closed 范围 |
| `05-测试方案.md` §6 / §9 / §10 / §12 / §13 | 提取 P0 用例族、suite、gate、reports、artifacts、redaction 和证据范围 |
| `06-验收标准.md` §2 / §5~§11 | 提取验收范围、AC、VETO、证据和一票否决边界 |

校准来源:

- `design-calibration/00_req_step_04_goals_non_goals.md`
- `design-calibration/00_req_step_07_core_capability_loop.md`
- `design-calibration/00_req_step_09_functional_requirements.md`
- `design-calibration/00_req_step_10_rules_boundary_constraints.md`
- `design-calibration/03_ddd_step_02_scope.md`
- `design-calibration/03_ddd_step_03_coding_runtime_constraints.md`
- `design-calibration/03_ddd_step_04_units_file_layout.md`
- `design-calibration/03_ddd_step_16_test_slices.md`
- `design-calibration/03_ddd_step_17_implementation_handoff.md`
- `design-calibration/04_config_step_02_scope.md`
- `design-calibration/05_test_plan_step_02_scope.md`
- `design-calibration/05_test_plan_step_09_automation_ci_gates.md`
- `design-calibration/05_test_plan_step_13_reports_evidence.md`
- `design-calibration/06_acceptance_step_02_scope.md`
- `design-calibration/06_acceptance_step_05_function_gate.md`
- `design-calibration/06_acceptance_step_06_data_architecture_redlines.md`
- `design-calibration/06_acceptance_step_11_veto_items.md`

## 3. SOP 问题回答

### 3.1 本轮实施的最小可交付结果是什么?

最小可交付结果是在 `/home/aris/Projects/quantalithos-conversation` 中交付一个可编译、可测试、可验收的 Rust 2024 workspace，让 `L1-conversation` 作为 Conversation truth center 的 P0 闭环成立。

该闭环必须至少包括:

- `contracts/domain/application/infra/api/worker/jobs` 多 crate workspace。
- 对话空间、参与范围、可见范围的显式建立、更新和关闭。
- 对话事实 append-only、幂等、receipt、trace 和 outbox 同事务。
- 授权查询、projection、search refs、cursor 和 stale / failed marker。
- 跨域事实只以 ref、safe snapshot、manifestation、unresolved 或 mismatch marker 进入。
- review anchor、trace handoff、archive handoff 和 retry / failed 状态。
- inbound consumer、outbox relay、operations jobs 和 reports / artifacts 证据链。
- JSON 配置、profile、redaction、fake-as-production reject 和 path shape 检查。

P0 可以使用 in-memory repository、fake resolver、fake publisher、fake handoff 和 controlled adapter 完成本仓闭环；真实生产 DB / MQ / resolver / archive / observability 产品行为不是本轮通过条件。

### 3.2 哪些需求编号必须覆盖?

`FR-CONV-001~FR-CONV-005` 是核心闭环，必须完整覆盖。`FR-CONV-006~FR-CONV-008` 是外围增强能力，但本轮仍需实现 P0 最小切口，因为 `06-验收标准.md` 已把 projection、search、cursor、change sensing、reports 和 outbox 作为可裁决门禁。

业务规则方面，`BR-CONV-001~005` 是核心不变量，`BR-CONV-006~012` 是仓边界禁止项，`BR-CONV-013~016` 是显式变化和派生结果约束，`BR-CONV-017~021` 是跨仓真相、审计和维护辅助边界。本轮实现必须让这些规则可通过测试和验收判断。

非功能方面，`NFR-CONV-001~012` 均需要进入门禁，但不引入未确认的 TPS、p95、容量或窗口数字；本轮只证明核心追加、授权读取、追溯、降级、redaction、幂等、配置和证据路径不破坏 P0。

### 3.3 哪些详细设计章节必须落地?

必须落地的详细设计范围包括:

| 详细设计范围 | 本轮处理 |
|---|---|
| §2 目标与范围 | 作为 P0 实施范围边界，不扩大到 UI、runtime 或 production adapter |
| §3 编码、运行时与约束 | 作为实现仓语言、命名、commit、dependency 和 git 纪律 |
| §4 实现单元与文件布局 | 作为 workspace、crate、package、binary 和目录命名约束 |
| §5 模块契约轴 | 作为 phase / commit boundary 拆分输入，Step 5~6 继续细化 |
| §6 对象契约 | 作为 domain / contracts 实现真相源，不能自行补字段 |
| §7 trait / port / adapter | 作为 application / infra 边界和 fake adapter 实现输入 |
| §8 协议契约 | 作为 Command / Query / Consumer / Event / Job DTO 与错误闭环输入 |
| §9 函数处理流 | 作为 application service、worker 和 jobs 编排输入 |
| §10 状态矩阵 | 作为 enum、状态迁移、非法迁移测试和报告命名输入 |
| §11~§13 持久化、错误、幂等 | 作为 UnitOfWork、repository、error、retry、idempotency 和 consistency 输入 |
| §14~§15 配置、观测、审计 | 作为 config、runtime graph、logs、metrics、audit 和 reports 输入 |
| §16~§17 测试切口与实施交接 | 作为 Step 6 / Step 7 拆任务和门禁输入 |

### 3.4 哪些验收项必须在本轮可判定?

本轮必须让以下验收组可判定:

| 验收组 | 范围 | 本轮判定要求 |
|---|---|---|
| `AC-FUNC-001~008` | 功能闭环 | 必须覆盖全部功能门禁；`001~005` 任一失败不通过 |
| `AC-RED-001~010` | 数据边界与架构红线 | 任一 forbidden body、授权绕过、source truth 补造、P1/P2 污染等不得通过 |
| `AC-SYNC-001~010` | 接口、事件与跨仓同步 | Command、Query、Consumer、Outbound Event、Job 和 core-contracts 编译接缝必须闭合 |
| `AC-STATE-*` / `AC-TX-*` / `AC-CONS-*` / `AC-IDEM-*` | 状态、事务、一致性、幂等 | 正式 enum、事务原子性、query no-write、sequence 单调和 duplicate / rerun 可判定 |
| `AC-NFR-001~012` | 非功能底线 | 降级、授权、redaction、配置、证据、可观测和 P1/P2 风险隔离可判定 |
| `AC-OBS-*` / `AC-AUDIT-*` / `AC-EVID-*` | 观测、审计、证据 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 可生成并可追溯 |
| `VETO-CONV-001~014` | 一票否决 | 全部进入 `veto-checklist.md`，任一命中不得风险接受 |

### 3.5 哪些能力明确不在本轮实施?

以下能力不进入本轮 P0 实施范围:

- Chat UI、前端消息展示、富媒体渲染和产品交互体验。
- Workspace 首页、inbox、项目视图和跨域聚合视图。
- Runtime 推理过程、agent loop、tool call body、reasoning body 和 runtime memory。
- Bridges 外部平台协议生命周期、外部平台原始消息正文和生产平台适配。
- Governance 裁决逻辑、Artifact 正文 / 版本 / 证据链生命周期、Identity 成员生命周期。
- 真实生产 DB / MQ / search / trace store / archive package 产品选择。
- 真实跨仓端到端联调、production-like 容量数字、SLO 数字、运维 runbook。
- config center、hot reload、admin override、auto repair truth、dashboard / alerting。

这些能力可以进入 risk acceptance、open issues、后续专项或下游仓实施计划，但不能成为 P0 DTO 必填字段、P0 gate、P0 配置必填项或通过条件。

### 3.6 是否存在 P1 / P2 能力容易被误做进 P0?

存在。最容易误膨胀的是:

- 把 Chat / Workspace 体验做成 Conversation 自己的 API 或 projection truth。
- 把 Runtime reasoning body、Bridge platform body 或 Artifact body 放进 fact payload。
- 把真实 MQ、真实 DB、真实 archive package 或真实 trace store 当成 P0 必须集成。
- 把 config center、hot reload 或 auto repair truth 放进配置和 job 范围。
- 把 search / projection / report 写成可修复 truth 的业务能力。
- 把 downstream SDK / Chat / Workspace 消费体验作为本仓 P0 通过条件。

实施计划必须在 Step 5~7 拆阶段和门禁时持续防止这些能力进入 P0 主线。

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| `07` 尚未定义范围 | 实施者只能从 `00~06` 自行推断 | 容易把 P1/P2 能力做进 P0 | 本步收敛实施目标、范围和非范围 |
| P0 与 P0-supporting 容易混淆 | `FR-CONV-006~008` 是外围增强，但验收需要最小切口 | 可能误删 projection、search、cursor、outbox 或 reports | 本步把它们列为 P0-supporting |
| 目标实现仓不存在 | Step 1 已确认 `/home/aris/Projects/quantalithos-conversation` 当前不存在 | 实施者可能不知道建仓是否属于本轮 | 本步把目标仓初始化列入支撑范围 |
| fake adapter 容易被误当 production success | P0 允许 fake / controlled adapter | 验收中可能误报真实集成通过 | 本步明确 fake 只证明本仓闭环 |
| 下游体验容易反向定义本仓 truth | Chat / Workspace / Runtime / Bridges 都消费 Conversation | 下游要求可能污染本仓数据归属 | 本步明确它们为非范围或下游后续 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 实施目标 | 散落在需求、详细设计和验收标准 | 收敛为 Conversation truth center P0 可交付闭环 | 实现者知道第一目标 |
| 实施范围 | `FR`、`AC`、对象、接口、配置和证据分散 | 形成可追溯实施范围表 | 后续 phase / commit boundary 有边界 |
| 非范围 | 分散在 `00`、`03`、`06` | 集中列出 UI、runtime、bridges、production、hot reload 等后置能力 | 防止范围膨胀 |
| P0-supporting | 容易被误认为非 P0 | projection、search、cursor、change sensing、reports 进入最小切口 | 符合验收标准 |
| controlled seam | fake / in-memory 只在设计中分散说明 | 明确 P0 可用 fake 证明闭环，但不得标 production success | 避免验收误判 |

## 6. 实施计划取舍

### 6.1 本轮是否只做 `FR-CONV-001~005`

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| A. 只做 `FR-CONV-001~005` 核心闭环 | 范围最小 | 无法满足 `AC-FUNC-006~008`、reports / artifacts 和 outbox 变化感知门禁 | 不采用 |
| B. 做 `FR-CONV-001~005` 完整闭环 + `FR-CONV-006~008` P0 最小切口 | 与 `06` 验收标准一致 | 需要后续 Step 控制外围增强深度 | 采用 |

推荐方案 B。原因是 Conversation truth center 的 P0 通过不仅要证明 truth 写入和查询，还要证明派生结果不反写真相、长历史消费有 refs-only 路径、变化感知和证据路径可审查。

### 6.2 是否把目标仓初始化纳入范围

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| A. 纳入本轮范围 | 目标仓不存在也能按计划开工 | Step 5 需要把建仓和 workspace 初始化放在第一阶段 | 采用 |
| B. 不纳入本轮范围 | 范围更像纯业务实现 | 交给 agent 时会缺少落地入口 | 不采用 |

推荐方案 A。原因是 Step 1 已确认目标仓当前不存在；实施计划必须把 repo scaffold、workspace、scripts、reports 和 artifacts 作为支撑交付物。

### 6.3 是否要求真实相邻仓集成作为 P0

| 方案 | 优点 | 风险 | 结论 |
|---|---|---|---|
| A. 要求真实相邻仓集成 | 更接近生产 | 下游 / 来源仓 readiness 会阻塞 Conversation truth center 本仓闭环 | 不采用 |
| B. P0 使用 in-memory / fake / controlled adapter，真实集成进风险接受或后续专项 | 可独立验证本仓 truth | 需要严格标记 fake，不得写成 production success | 采用 |

推荐方案 B。原因是本仓 P0 要先证明自身 truth、state、transaction、idempotency、redaction 和 evidence 成立；真实端到端联调不应成为本仓实施的前置阻塞。

## 7. 结构化中间产物

### 7.1 实施目标表

| 目标 ID | 实施目标 | 来源 | 完成判定 |
|---|---|---|---|
| GOAL-CONV-IMPL-001 | 建立 Conversation truth center P0 主闭环 | `FR-CONV-001~005`;`AC-FUNC-001~005` | space / scope、fact append、authorized query、manifestation、trace / handoff 均通过 |
| GOAL-CONV-IMPL-002 | 落地 Rust workspace 和 crate 边界 | `03` §3~§4 | `contracts/domain/application/infra/api/worker/jobs` 可编译、依赖方向正确 |
| GOAL-CONV-IMPL-003 | 让协议、对象、状态、事务和错误可 1:1 落码 | `03` §6~§13 | DTO roundtrip、domain state、service flow、error mapping 和 idempotency tests 通过 |
| GOAL-CONV-IMPL-004 | 交付 P0-supporting 派生、检索、变化感知和 operations jobs | `FR-CONV-006~008`;`AC-FUNC-006~008` | projection、search refs、cursor、outbox、rebuild / validation job 可验证 |
| GOAL-CONV-IMPL-005 | 交付配置、脚本、reports / artifacts 和验收证据链 | `04`;`05`;`06` | gate、redaction check、report generator 和 acceptance handoff 可生成 |

### 7.2 实施范围表

| 类别 | 内容 | 来源 | 是否本轮实施 | 说明 |
|---|---|---|---|---|
| 仓库初始化 | `/home/aris/Projects/quantalithos-conversation` workspace、Cargo、crates、tests、scripts、reports、artifacts | Step 1;`03` §3~§4 | 是 | 目标仓不存在，必须纳入初始交付 |
| 核心功能 | Conversation space / scope | `FR-CONV-001`;`AC-FUNC-001` | 是 | 显式创建、更新、关闭和 visibility guard |
| 核心功能 | Conversation fact append | `FR-CONV-002`;`AC-FUNC-002` | 是 | append-only、receipt、trace、outbox、idempotency |
| 核心功能 | Authorized query / projection | `FR-CONV-003`;`AC-FUNC-003` | 是 | query no-write、visibility、stale / failed marker |
| 核心功能 | Cross-domain manifestation | `FR-CONV-004`;`AC-FUNC-004` | 是 | ref / safe snapshot / unresolved / mismatch，不补 source truth |
| 核心功能 | Trace / review / handoff | `FR-CONV-005`;`AC-FUNC-005` | 是 | review anchor、trace handoff、archive handoff 和 retry / failed |
| 支撑功能 | Projection / derived read model | `FR-CONV-006`;`AC-FUNC-006` | 是 | 只从既有 truth 派生，不自动修写真相 |
| 支撑功能 | Search refs / cursor / long history locate | `FR-CONV-007`;`AC-FUNC-007` | 是 | refs-only、authorized、cursor monotonic |
| 支撑功能 | Change sensing / outbox / polling | `FR-CONV-008`;`AC-FUNC-008` | 是 | event / marker based，不含正文 |
| 支撑功能 | Inbound consumer、outbox relay、operations jobs | `AC-SYNC-*`;`AC-STATE-*`;`AC-TX-*` | 是 | worker / jobs 必须可执行并可重跑 |
| 配置和环境 | JSON 配置、profile、runtime graph、redaction、path shape | `04`;`AC-NFR-009~010` | 是 | config 不能绕过架构红线 |
| 测试和证据 | P0 suite、gate scripts、reports、artifacts、acceptance handoff | `05`;`06` | 是 | 路径固定为 `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` |

### 7.3 非范围表

| 非范围 | 后续归属 | 本轮只保留什么 | 误纳入风险 |
|---|---|---|---|
| Chat UI、前端展示、富媒体体验 | `L5-chat` | query / event / projection surface | UI 状态反写 Conversation truth |
| Workspace 首页 / inbox / 项目聚合 | `L1-workspace` | authorized view / refs | workspace view 被当成本仓 truth |
| Runtime 推理、agent loop、tool call body | `L2-runtime` / `L2-tools` | result fact ref / safe snapshot | reasoning body 进入 fact / report |
| Bridges 外部平台协议和原始消息正文 | `L6-bridges` | bridge mapped fact ref / marker | platform body 泄漏或生命周期被本仓拥有 |
| Governance 裁决和 Artifact 正文 / 证据链 | 来源仓 | manifestation ref / safe snapshot | source truth isolation 被破坏 |
| Identity 成员生命周期 | `L0-identity` | actor / participant ref 和 controlled resolver | 本仓创建或退休成员 |
| 真实生产 DB / MQ / search / trace / archive 产品 | 后续 infra / ops 专项 | port + in-memory / fake adapter | 真实集成阻塞 P0 或 fake 被标 production |
| config center / hot reload / admin override | 后续配置专项 | static JSON + fail-fast / fail-closed | 配置绕过 redaction / authorization |
| auto repair truth | 后续 governance / operations 专项 | validation、issue marker、manual follow-up | job 自动改写业务 truth |
| production-like 容量、SLO 和 runbook | 后续 NFR / operations 专项 | qualitative baseline 和 risk acceptance | 未确认数字被写成 P0 阈值 |

### 7.4 范围到验收项映射表

| 实施范围 | 关键验收项 | 关键证据 |
|---|---|---|
| space / scope | `AC-FUNC-001`;`AC-RED-004`;`AC-STATE-001` | `EV-CONV-TRUTH-001`;`EV-CONV-AUTH-001` |
| fact append | `AC-FUNC-002`;`AC-TX-001`;`AC-IDEM-001` | `EV-CONV-FACT-001` |
| authorized query / projection | `AC-FUNC-003`;`AC-TX-003`;`AC-RED-007` | `EV-CONV-AUTH-001`;`EV-CONV-DERIVED-001` |
| manifestation / inbound consumer | `AC-FUNC-004`;`AC-RED-005`;`AC-SYNC-003` | `EV-CONV-MAN-001`;`EV-CONV-CONSUMER-001` |
| trace / handoff | `AC-FUNC-005`;`AC-STATE-004`;`AC-NFR-007` | `EV-CONV-HANDOFF-001`;`EV-CONV-GATE-001` |
| outbox / change sensing | `AC-FUNC-008`;`AC-SYNC-004`;`AC-IDEM-002` | `EV-CONV-OUTBOX-001` |
| operations jobs | `AC-SYNC-005`;`AC-CONS-002`;`AC-NFR-002` | `EV-CONV-DERIVED-001` |
| config / reports / redaction | `AC-RED-003`;`AC-NFR-009~010`;`AC-EVID-*`;`VETO-CONV-*` | `EV-CONV-CONFIG-001`;`EV-CONV-REDACTION-001`;`EV-CONV-ACCEPT-001` |

### 7.5 范围边界图

图类型: 实施范围边界图

图标题: L1-conversation P0 实施范围与后置能力边界

```text
P0 implementation scope
  |
  +-- conversation truth center
  |     +-- space / participant scope / visibility scope
  |     +-- append-only fact / receipt / trace / idempotency
  |     +-- manifestation refs / safe snapshots / markers
  |
  +-- consumption and support
  |     +-- authorized query / projection / search refs / cursor
  |     +-- outbox / change sensing / inbound consumer
  |     +-- operations jobs / reports / artifacts / redaction
  |
  +-- controlled seams
        +-- core-contracts path dependency
        +-- fake resolver / fake publisher / fake handoff
        +-- in-memory default repositories

Out of P0 implementation scope
  |
  +-- Chat UI / Workspace UX / Bridges platform lifecycle
  +-- Runtime reasoning / tool call body / agent loop
  +-- Governance decision truth / Artifact body / Identity lifecycle
  +-- production DB / MQ / trace store / archive package product
  +-- config center / hot reload / auto repair truth / production SLO
```

## 8. 回填草稿

以下内容供 Step 13 组装正式 `07-实施计划.md` §2 时摘录，当前不直接写入正式文档。

```markdown
## 2. 实施目标与范围

> 校准来源：
> - `design-calibration/07_implementation_plan_step_02_scope.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“实施目标表”“实施范围表”“非范围表”“范围到验收项映射表”和“范围边界图”小节，了解本轮实施为什么限定为 Conversation truth center P0 闭环，而不是 Chat UI、Workspace 体验、Runtime 推理或生产外部服务集成。

本轮实施目标是在 `/home/aris/Projects/quantalithos-conversation` 中交付一个可编译、可测试、可验收的 Rust workspace，使 `L1-conversation` 作为 Conversation truth center 的 P0 闭环成立。主闭环覆盖 space / scope、append-only fact、authorized query、cross-domain manifestation、trace / handoff、outbox / events、operations jobs、configuration、reports / artifacts 和 redaction。

P0 可以使用 in-memory repository、fake resolver、fake publisher、fake handoff 和 controlled adapter 证明本仓 truth、state、transaction、idempotency、redaction 和 evidence 成立；真实生产 DB / MQ / resolver / trace / archive 产品行为、真实跨仓端到端和下游 UI / Workspace / Bridges 体验不进入本轮 P0 通过条件。

| 类别 | 实施范围 | 来源 | 本轮实施 |
|---|---|---|---|
| P0 核心 | Conversation space / scope | `FR-CONV-001`;`AC-FUNC-001` | 是 |
| P0 核心 | Conversation fact append | `FR-CONV-002`;`AC-FUNC-002` | 是 |
| P0 核心 | Authorized query / projection | `FR-CONV-003`;`AC-FUNC-003` | 是 |
| P0 核心 | Cross-domain manifestation | `FR-CONV-004`;`AC-FUNC-004` | 是 |
| P0 核心 | Trace / review / handoff | `FR-CONV-005`;`AC-FUNC-005` | 是 |
| P0 支撑 | Projection、search refs、cursor、change sensing、outbox、operations jobs | `FR-CONV-006~008`;`AC-FUNC-006~008` | 是，限最小可验收切口 |
| P0 支撑 | JSON 配置、gate scripts、reports、artifacts、redaction | `04`;`05`;`06` | 是 |

本轮明确不实施 Chat UI、Workspace 聚合视图、Runtime 推理、Bridges 外部平台协议、Governance 裁决、Artifact 正文和证据链生命周期、Identity 成员生命周期、真实生产外部服务、config center、hot reload、auto repair truth、production SLO 和 production runbook。
```

## 9. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 本轮目标已明确 | 已满足 |
| 实施范围已追溯到上游编号 | 已满足 |
| 非范围已显式写出 | 已满足 |
| P1 / P2 容易误入 P0 的风险已记录 | 已满足 |
| 未创建正式 `07-实施计划.md` | 已满足 |

Step 2 可以进入 Step 3。Step 3 应收稳前置条件、阅读清单、实现仓目录检查、`core-contracts` sibling dependency、design commit 固定规则、编码规范、提交规范、scripts / reports / artifacts 生成规则和每个 phase / commit boundary 的必读 `design-calibration` 矩阵。
