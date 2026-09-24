# Step 19. 正式详细设计装配审计

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 19
> 书写规范：`standards/document/详细设计书写规范.md` §5.18 及正式章节主链
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 参考框架：`projects/L1-governance/03-详细设计.md` 与其 Step 19 装配产物
> 正式输出：`projects/L5-runner/03-详细设计.md`
> 状态：`completed_with_upstream_blockers`
> 终态：Step 19 已完成；当前 `stop_review_required`，下一步仅为 `wait_for_user_review_before_04`。

## 1. Step 状态与装配门禁

| 项 | 当前值 |
|---|---|
| current_document | `03-详细设计.md` |
| current_step | Step 19 |
| current_module | `formal_document_assembly:full_restart_and_traceability_audit` |
| gate_status | `stop_review_required` |
| formal_03_write_allowed | `completed` |
| implementation_write_allowed | `false` |
| implementation_ledger_allowed | `false_until_07` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | `wait_for_user_review_before_04`；不得进入 04 |

本 Step 只把 Step 1～18 已通过的结论重排成正式正文，不新增对象、字段、状态、协议、配置、phase、commit 或技术选型。正式文档完成不代表 implementation ready，也不解除 `RUN-UP-*` 或 `RUN-DDD-*` blocker。

## 2. 装配输入与权威顺序

### 2.1 正式输入

| 优先级 | 输入 | 用途 |
|---:|---|---|
| 1 | `projects/L5-runner/00-需求文档.md` | 能力边界、truth ownership、验收红线和禁止行为 |
| 2 | `projects/L5-runner/01-架构设计.md` | 语义方向、依赖层次、多轴状态和数据所有权 |
| 3 | `projects/L5-runner/02-概要设计.md` | 六个业务组成部分、17 个对象轮廓、接口/flow/state 骨架 |
| 4 | `design-calibration/03_ddd_step_01_hld_input_boundary.md` ～ `03_ddd_step_18_risks_open_questions.md` | 详细设计实现契约、审计和风险闭环 |
| 5 | 设计标准与 SOP | 章节结构、来源追溯、可落码和真实性门禁 |

README、旧正式 `03-详细设计.md`、旧 `05/06` 和 `draft/` 仅用于历史冲突扫描。它们不能覆盖上述权威顺序，也不能提供 language、runtime、path、SDK、transport 或 ready 结论。

### 2.2 装配原则

1. 先删除旧正式 `03-详细设计.md`，再以新章节主链重建；不在旧结构上修补。
2. 每个正式章节列出具体 `design-calibration/03_ddd_step_*.md` 路径和延伸阅读小节。
3. 正式正文只保留收口结论、实现边界、表格和必要伪代码；完整问题回答与取舍留在 calibration。
4. 任何未确认事实以 `blocked`、`planned`、`unknown`、`reserved` 或 `pending` 表达，不转写成 ready。
5. 物理布局、目标仓、语言/runtime、store/cache backend 和 exact SDK surface 不因装配而解除 blocker。

## 3. 正式章节映射

| 正式章节 | 主要 calibration 来源 | 装配结论 |
|---:|---|---|
| §1 上游关系 | Step 1 | 直接承接 00/01/02；旧材料后置 |
| §2 目标与范围 | Step 2 | 实现契约范围与非范围固定 |
| §3 实现约束 | Step 3 | 技术中立、SDK-first、真实性门禁 |
| §4 实现单元与布局 | Step 4 | 逻辑单元已定，physical layout blocked |
| §5 模块实现契约 | Step 5～7 | 七模块、对象/port/adapter 归属 |
| §6 对象/Trait/API 索引 | Step 6～8 | 17 对象、14 required port、协议族索引 |
| §7 协议契约 | Step 8 | 11/12/4/0/5 surface |
| §8 函数级处理流 | Step 9 | 32 条 flow、事务与负向路径 |
| §9 状态矩阵 | Step 10 | 21 状态主语与 generation guard |
| §10 持久化/一致性 | Step 11 | logical store、UoW、version、projection |
| §11 错误/恢复 | Step 12 | typed error、Unknown、RecoveryCase |
| §12 并发/幂等 | Step 13 | digest、duplicate、commit-unknown、重入 |
| §13 配置/依赖 | Step 14 | semantic binding、禁止配置化 |
| §14 观测/审计 | Step 15 | safe log、低基数指标、redaction |
| §15 测试切口 | Step 16 | 设计级最小验证，不声称执行 |
| §16 实施承接 | Step 17 | 07 前置输入，不创建 implementation ledger |
| §17 风险/待确认 | Step 18 | blockers、负责人、未确认前处理 |
| §18 参考 | Step 19 | 上游、标准和全部 calibration 入口 |

## 4. Full-restart 与冲突扫描结果

### 4.1 旧正式文档替换

旧正式 `projects/L5-runner/03-详细设计.md` 已被视为 `historical_material`。装配动作是删除旧文件并创建新版文件，不保留旧章节骨架、旧对象表或旧伪代码。旧文件中出现的内容只有在 Step 1～18 或 00/01/02 重新得到支持时才可进入新版。

### 4.2 已排除的历史口径

| 历史口径 | 新版处理 |
|---|---|
| `RunnerRun`、`RunQueueEntry`、`RunCard` 作为主聚合 | 排除；使用 `RunIntent`、`ControlIntent`、`OwnerRunProjection` 和 `RunnerReadModel` 分轴表达 |
| Rust/Tauri/Electron、`src-*` 目录、Docker/gVisor/Firecracker | 排除；Step 3/4 未获 authority，physical layout 保持 blocked |
| queue/ACK/PID/端口作为运行 truth | 排除；owner execution 只能来自正式 safe read/projection |
| `latest`、default、newest、tag、branch | 排除；所有副作用使用 exact Release/version/scope/generation |
| local log/receipt/report 作为 audit/evidence | 排除；只保留 safe local record/handoff posture |
| Runner outbound event/outbox/publisher | 排除；协议审计确认数量为 0 |

### 4.3 计数和闭环审计

| 审计项 | 结果 |
|---|---|
| 逻辑模块 | 7：`contracts`、`domain`、`application`、`infra`、`entry`、`worker`、`operations` |
| 正式 domain/支撑对象 | Step 6 的 17 个正式对象及其 support carriers |
| required ports | 14 个；exact owner adapter 仍由上游 blocker 约束 |
| Command / Query / Consumer / Outbound Event / Job | 11 / 12 / 4 planned / 0 / 5 |
| Function flow | 32 条（11 Command + 12 Query + 4 Consumer + 5 Job） |
| 独立状态主语 | Step 10 筛选后的 21 个状态主语，另有 `RunnerReadSection` generation guard |
| Query 写入 | 0；所有 Query no-write |
| Runner truth 回写上游 | 0；不写 Release/Artifact/Governance/Sandbox/Runtime/Observability/Archive truth |
| implementation ledger / boundary skeleton | 未创建，按规则留给 07 |

## 5. 正式文档完成条件

| 条件 | 结论 |
|---|---|
| 18 章主链存在且顺序符合规范 | 通过 |
| 每章有具体 calibration 来源 | 通过；见正式文档各章开头 |
| 逻辑模块、对象、port、协议、flow、state 可互相回指 | 通过；详细索引和章节交叉审计已装配 |
| physical layout 可直接落到真实仓 | 未通过，保留 `RUN-DDD-001~003`；正文明确 blocked |
| 上游 positive adapter 可宣称 ready | 未通过，保留 `RUN-UP-001~008`；正文只写 semantic seam |
| 测试/报告/evidence/verdict/signoff 已存在 | 未执行、未生成、未伪造 |
| 进入 04 的权限 | 未授予；完成后 `next_allowed_action=wait_for_user_review_before_04` |

## 6. Step 19 终态

正式文档装配已完成。本文件、`03_ddd_calibration_flow.md` 与 `project_execution_ledger.md` 的同步终态为：

```text
current_document = 03-详细设计.md
current_step = 19
current_module = formal_document_assembly:full_restart_and_traceability_audit
gate_status = stop_review_required
formal_status = completed_with_upstream_blockers
next_allowed_action = wait_for_user_review_before_04
formal_03_write_allowed = completed
formal_04_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

Step 19 不创建实现仓、baseline、commit、run_id、artifact、report、evidence、verdict、signoff、readiness 或 implementation ledger。必须等待用户 review；只有用户明确授权后才可进入 04。
