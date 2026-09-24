# 00 需求 Step 9 · 功能需求

> 状态：`completed`
> 前置：`00_req_step_07_core_capability_loop.md`、`00_req_step_08_user_stories.md`
> 回填章节：正式 `00` §9 功能需求
> 组织方式：按能力节点，不按对象、CRUD、API 或 Command。

## 1. 本步目标与诊断

把已确认的用户故事归并为 Runner 必须提供的业务能力。旧文档中 `CreateRun`、`OpenRun`、`TriggerRetry` 等命名可能是实现/协议线索，本 Step 不直接继承这些名字；需求只描述用户可观察的能力结果。

## 2. 核心功能需求表

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应用户故事 |
|---|---|---|---|---|
| `FR-RUN-001` 可信运行语境 | 核心闭环能力 | 在正式 actor/session/project context 和端侧平台语境下建立一次运行选择的可解释上下文。输入缺失时不暴露受保护内容或发起副作用。 | `CP-RUN-01` | `US-RUN-001` |
| `FR-RUN-002` 显式版本与 authority 选择 | 核心闭环能力 | 让用户明确选择一个 immutable Release/version，并展示可见的来源、适用性、有效性和选择失效姿态；不接受 `latest`/默认版本直接运行。 | `CP-RUN-01` | `US-RUN-001~002` |
| `FR-RUN-003` 取得过程可见性 | 核心闭环能力 | 提供已获正式 locator 的材料取得进度、暂停/恢复、失败和重试姿态，并区分传输完成与验证完成。 | `CP-RUN-02` | `US-RUN-003` |
| `FR-RUN-004` 完整性与本地资格判定 | 核心闭环能力 | 在启动前表达 manifest/digest/signature、平台兼容性、authority freshness 和 cache 保护的综合资格；未通过不得继续。 | `CP-RUN-02` | `US-RUN-004` |
| `FR-RUN-005` 正式受控运行请求 | 核心闭环能力 | 将已获资格的材料和用户意图交给正式 Sandbox/Runtime 边界，并让用户区分请求未发出、已接收、待确认、拒绝和未知。 | `CP-RUN-03` | `US-RUN-005` |
| `FR-RUN-006` 运行生命周期呈现 | 核心闭环能力 | 展示准备、启动、运行、停止、终态和未知等生命周期姿态，来源可回指 Runtime/Sandbox 正式状态。 | `CP-RUN-03` | `US-RUN-006` |
| `FR-RUN-007` 启停控制意图 | 核心闭环能力 | 允许用户发起正式允许的 start/stop/cancel 意图，并展示 accepted/pending/confirmed/rejected/unknown；不把意图当执行结果。 | `CP-RUN-03` | `US-RUN-005~006` |
| `FR-RUN-008` 资源冲突解释 | 核心闭环能力 | 在运行准备和运行期间展示端口、路径、磁盘、进程或平台能力冲突及影响范围，提供安全处理方向。 | `CP-RUN-04` | `US-RUN-007` |
| `FR-RUN-009` 清理与材料保护 | 核心闭环能力 | 展示停止/清理请求、lease/捕获/handoff/retention 保护、资源释放和 orphan/unknown 姿态；保护未解除时不允许危险淘汰。 | `CP-RUN-04` | `US-RUN-008~009` |
| `FR-RUN-010` 断线与重启恢复 | 核心闭环能力 | 在网络断线、休眠、应用重启或 lease 变化后冻结副作用，重新验证语境并恢复本地运行视图；不自动重放未知动作。 | `CP-RUN-04` | `US-RUN-008` |
| `FR-RUN-011` 安全输出预览 | 核心闭环能力 | 提供有限、可裁剪、带来源和 freshness 的输出/结果预览，支持用户理解运行表现；不得暴露不必要的 raw body/secret。 | `CP-RUN-05` | `US-RUN-010` |
| `FR-RUN-012` 失败诊断与下一步 | 核心闭环能力 | 将选择、取得、完整性、Sandbox、执行、清理和恢复失败映射为可理解的影响、来源和下一步姿态。 | `CP-RUN-05` | `US-RUN-011` |
| `FR-RUN-013` 安全诊断交接 | 核心闭环能力 | 在正式合同允许时向 Observability 交接 redacted 摘要、source refs、关联信息和错误分类，并展示 receipt/blocked 状态。 | `CP-RUN-05` | `US-RUN-012` |

## 3. 每项功能的输入、输出、触发与失败边界

| 功能 | 主要输入语境 | 用户可见输出 | 触发条件 | 失败/降级姿态 |
|---|---|---|---|---|
| `FR-RUN-001` | actor/session/project context、platform capability | context current/expired/restricted | 打开 Runner、切换项目或恢复 | `not_authenticated`、`not_visible`、`unavailable`；不发起副作用。 |
| `FR-RUN-002` | Release/version summary、baseline/approval applicability、用户选择 | selected ref、authority posture、invalidated reason | 用户选版本、重新验证 | `pending`、`blocked`、`revoked`、`expired`、`conflict`；不允许 `latest`。 |
| `FR-RUN-003` | formal locator/manifest、网络和本地 cache 语境 | transfer progress、paused/resumable、failure reason | 用户开始取得或恢复 | `incomplete`、`quarantined`、`unavailable`；不等于 verified。 |
| `FR-RUN-004` | bytes metadata、manifest/digest/signature policy、platform profile | integrity/compatibility/qualification posture | 取得完成、cache 命中或启动前 | `failed`、`unverifiable`、`stale`、`blocked`；不得提交 Sandbox。 |
| `FR-RUN-005` | qualified material refs、resource posture、formal Sandbox request context | request receipt and status | 用户确认运行 | `rejected`、`pending`、`unknown`；`accepted` 不显示 running。 |
| `FR-RUN-006` | Runtime/Sandbox status refs、local observation | lifecycle state、source attribution、freshness | 状态查询、事件/SDK 更新、恢复 | `unknown`、`stale`、`unavailable`；不以 PID/端口替代。 |
| `FR-RUN-007` | user control intent、expected source version/lease | control lifecycle and next action | 用户 start/stop/cancel | `pending`/`unknown`/`reconcile_required`；不自动重放。 |
| `FR-RUN-008` | OS/resource probe、formal allocation/lease summary | conflict type/scope/impact | preflight、运行中资源变化 | `conflict`、`unavailable`、`unknown`；不抢占或伪造可用。 |
| `FR-RUN-009` | control/cleanup result、lease/capture/handoff/retention refs | protected/released/orphan status | stop、cleanup、退出或淘汰前 | `protected`、`blocked`、`unknown`；不删除受保护材料。 |
| `FR-RUN-010` | connectivity/lifecycle signal、local cursor/generation、owner status | reconnecting/reconciled/manual-review | 断线、重启、休眠唤醒 | `offline`、`unknown`、`manual_review`；副作用冻结。 |
| `FR-RUN-011` | safe output/capture/result refs、redaction posture | clipped preview、ref、freshness | 打开运行详情或结果 | `partial`、`restricted`、`stale`；不保存 raw body。 |
| `FR-RUN-012` | owner failure category、local probe、source refs | impact、cause category、next step | 任何失败或未知 | `blocked`、`degraded`、`unknown`；不猜测最终结果。 |
| `FR-RUN-013` | redacted diagnostic、source refs、handoff eligibility | handoff pending/accepted/blocked/delivered | 用户/系统请求交接 | `blocked`、`unavailable`；不成为 evidence/verdict/signoff。 |

## 4. 外围增强功能

| 功能需求 | 能力类型 | 说明 | 依赖与裁剪 |
|---|---|---|---|
| `FR-RUN-014` 批量预取已选版本 | 外围增强能力 | 在每个版本仍通过 authority/integrity 门禁时优化重复使用等待。 | 不阻塞核心闭环；locator/签名合同未闭合时保持 pending。 |
| `FR-RUN-015` 多运行安全比较 | 外围增强能力 | 比较多个 RunnerRun 的安全摘要和资源提示，不合并 source truth。 | 等正式 read surface 和资源合同；不代替 scheduler。 |
| `FR-RUN-016` 归档运行上下文浏览 | 外围增强能力 | 在 Archive 正式开放时查看历史安全引用。 | `RUN-UP-006` blocked；不参与运行/清理成功判定。 |

## 5. 明确不进入功能需求的候选

以下名称或目标不进入正式功能需求：`latest` 自动选择、修改 Release、批准版本、直接运行本地目录、直接管理 Docker/gVisor/Firecracker、实现 Runtime loop/scheduler、强制 kill/删目录、生成正式 evidence/report/verdict、代码编辑/同步、生产部署、自动公网分享。它们分别越过 authority、Runtime、Sandbox、Observability、Sync 或部署边界。

## 6. 功能映射与孤儿审计

| 检查项 | 结果 |
|---|---|
| `FR-RUN-001~013` 是否都支撑核心能力节点 | 是 |
| 每个核心用户故事是否至少有一项功能承接 | 是：`US-RUN-001~012` 均有 |
| 是否按业务能力而非 CRUD/API/Command 拆分 | 是 |
| 是否有功能偷偷拥有上游 truth | 否 |
| 外围增强是否被误列为核心前置 | 否 |
| 是否存在无故事来源的核心功能 | 否 |

## 7. 取舍与回填草稿

采用 13 项核心功能 + 3 项外围增强的需求粒度，保留“输入语境—可见输出—触发—失败姿态”四列以便后续规则、数据、接口和验收追溯。正式 §9 不写实现函数、API 路径、表结构或技术栈；具体上游合同缺口在 §15 维护。

`Step 9 gate_status = pass`；下一步允许进入 `Step 10 业务规则与边界约束`。
