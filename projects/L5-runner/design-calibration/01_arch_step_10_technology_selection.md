# 01 架构 Step 10 · 关键技术选型

> 状态：`completed`
> 前置：`01_arch_step_02_goals_constraints.md`、`01_arch_step_07_dependency_direction.md`、`01_arch_step_08_data_ownership_consistency.md`、`01_arch_step_09_interactions_communication.md`
> 回填章节：正式 `01` §11 关键技术选型

## 1. Step 内计划与问题回答

- [x] 从目标、依赖、数据和交互结论筛选真正上升到架构层的机制。
- [x] 逐项回答解决的问题、采用理由、代价和边界意义。
- [x] 重新核验旧 Tauri、Electron、Rust、Docker、gVisor、Firecracker 选择。
- [x] 区分架构机制与后续实现载体，形成不采用/后置口径。
- [x] 形成正式 §11 回填草稿并通过门禁。

当前能够定稿的是保护边界和状态语义的架构机制，而不是产品/框架栈。Runner 必须以正式接缝隔离外部 owner、以多轴状态保护 truth 差异、以本地 generation 和 protection posture 管理副作用，并对安全摘要实行最小暴露。桌面壳、语言、数据库、下载库和 Sandbox backend 都不具备当前架构定稿条件。

## 2. 历史污染诊断

旧 `01` 将 Rust shared core、Tauri 优先、Electron 备选、Docker/本机进程以及 Sandbox facade 的具体载体写成正式选择。这些项目既缺少当前平台/workload/SDK authority，也可能侵入 Sandbox 私有实现。它们统一降级为后续实现候选；Docker、gVisor、Firecracker 只能属于 Sandbox owner 的实现域，不能成为 Runner 的直接技术选择。

## 3. 关键技术机制表

| 技术机制 | 解决的问题 | 采用理由 | 代价 / 约束 | 说明 |
|---|---|---|---|---|
| 正式 SDK/API/adapter 接缝隔离 | 防止入口或本地编排直接穿透 Artifact、Governance、Runtime、Sandbox、Observability truth 和私有实现。 | Owner 边界与 L5 依赖规则要求 Runner 只能表达意图和消费安全结果。 | 需要维护适配、版本、错误、可见性和未闭合 surface；上游缺口会直接形成 blocker。 | 接缝决定跨域依赖结构，属于架构机制。 |
| Runner-owned truth、外部 snapshot/ref 与 forbidden body 分离 | 防止本地状态成为第二 Release、execution、cleanup 或 audit truth。 | 本地体验必须可恢复，同时不能复制外部正文或反写 owner。 | 需要 source/freshness/visibility 元数据，并显式处理 stale/partial/unknown。 | 同时约束存储、交互和展示。 |
| 多轴资格与生命周期状态 | 防止单个 `RunnerRun.status` 把 authority、download、integrity、request、execution、cleanup、diagnostic 压成伪成功。 | 各轴来源和成功条件不同，只有分离才能守住 `accepted ≠ running` 等红线。 | 状态组合和用户解释更复杂，后续必须定义合法迁移与冲突映射。 | 该机制长期决定核心语义。 |
| 显式 selection generation 与内容绑定 | 防止切换版本后旧请求、cache 或恢复动作静默作用于新选择。 | 每个副作用必须绑定 immutable version、scope、source/digest 和 generation。 | 选择变化会使旧资格失效，需要重新验证和对账。 | 影响一致性、幂等和恢复主链。 |
| Quarantine 到 qualified 的受保护材料晋级 | 防止下载完成、文件存在或 cache hit 被误作完整性和运行资格。 | 材料必须通过正式 manifest/digest/signature 和平台资格才能晋级。 | 引入中间姿态、保护元数据和淘汰约束；exact 算法/transport 等待上游。 | 是下载与运行边界之间的架构保护手段。 |
| 同步意图、异步 owner 事实、后台本地工作的三路径分离 | 防止长时工作阻塞入口，也防止后台工作隐式创造业务成功。 | 不同交互语义分别需要即时判断、事实送达和延后承接。 | 增加 pending/stale/failed/reconcile 的解释、追踪和恢复成本。 | 直接影响运行承载和一致性。 |
| Unknown 冻结与查询优先的对账机制 | 防止断线、重启或超时后自动重放 start/stop/cleanup 产生重复副作用。 | 无法证明前一副作用结果时，安全性高于自动恢复速度。 | 可能需要 manual-review，体验更保守；依赖 owner 可读状态。 | 这是跨故障边界的长期副作用保护。 |
| Redaction-first、body-bounded 的预览与交接 | 防止 raw output、secret 和本地日志进入常驻状态或冒充 evidence。 | Runner 只需向用户解释并交接安全线索，不拥有正式证据链。 | 信息可能 partial/restricted，需要保留 source、coverage 和真实性提示。 | 同时约束数据、展示、诊断和 handoff。 |
| 平台观察与 owner allocation/lease 双视图 | 防止端口/进程/路径 probe 被升级为调度、隔离或清理真相。 | 端侧体验必须显示本机冲突，同时以 Sandbox owner 资格为准。 | 观察可能滞后或冲突，需要显式 freshness 和 conservative blocking。 | 影响跨平台资源与清理边界。 |

## 4. 当前不采用或后置的选择

| 候选 | 当前口径 | 原因 |
|---|---|---|
| Tauri、Electron 或其他桌面壳 | 后置到概要/详细设计核验 | 当前只确定入口可替换；缺平台、分发、安全与 workload authority。 |
| Rust、TypeScript、Go 或 shared runner core | 后置 | 编程语言/包结构尚不能改变已经收稳的语义边界。 |
| SQLite 或其他本地数据库/cache 产品 | 后置 | 当前只确定安全持久化边界，未确定 schema、事务和容量。 |
| Docker、gVisor、Firecracker、本机进程直管 | 不作为 Runner 直接选型 | 属于 Sandbox backend/private implementation；直接采用会越界。 |
| 具体 HTTP/RPC/MQ/topic/callback 产品 | 后置 | Step 9 仅确定通信类别，上游 exact surface 未闭合。 |
| 固定重试、并发、冷/热启动和 SLA 数字 | 不采用当前历史数字 | 缺 workload、平台和正式量化 authority。 |

## 5. 技术边界说明

本步定稿的机制都会持续改变 Runner 的系统边界、数据归属、交互方式或故障安全，因此够格进入架构主线。产品名、框架名和语言只是可能承载这些机制的实现选择，当前不能替代机制本身。后续若选择具体载体，必须证明其满足这些边界，并重新核验上游正式合同；不得由载体反向改写本步结论。

## 6. 回填草稿与门禁

正式 §11 回填关键机制表、后置选择表和技术边界说明。完整替代路径比较进入 Step 11；具体产品、包、协议、数据库、算法和部署参数不在本步锁定。

`Step 10 gate_status = pass`；下一步允许进入 Step 11 备选方案与取舍。
