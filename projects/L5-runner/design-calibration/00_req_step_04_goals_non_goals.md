# 00 需求 Step 4 · 目标与非目标

> 状态：`completed`
> 前置：`00_req_step_03_problem_context.md`
> 回填章节：正式 `00` §4 目标与非目标

## 1. 本步目标

把 Runner 本轮需求收束为可验证的状态、边界和能力范围，同时明确虽然相关但不属于 Runner 的事项，避免后续故事和功能漂移到上游真相域或旧技术选择。

## 2. 目标表

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立显式且不可变的运行选择语境 | 用户或正式调用方必须明确选择 Release/version；选择可回指 Artifact/Release、项目语境和 authority 检查，不能由 `latest`、默认分支或目录排序替代。 | 需求/验收审查确认无隐式版本选择；负向场景确认 `latest` 不可直接运行。 |
| 建立 approved/baselined Release 的消费门禁 | Runner 只能在正式 authority chain 可验证、未撤销/未过期/无冲突的前提下进入下载或运行准备；本地管理员、缓存或 Sandbox ACK 不能补齐批准。 | 使用缺失、过期、撤销、scope 冲突和不可见输入进行边界验收。 |
| 建立下载、缓存与完整性边界 | 下载过程、cache entry、manifest/digest/signature 验证和材料保护必须可区分；未验证或校验失败材料不得进入 Sandbox。 | 以完整、部分、篡改、断线恢复和 cache 失效场景验证状态分离。 |
| 建立正式 Sandbox 请求与运行生命周期的分层表达 | Runner 负责用户意图、请求关联和展示；`accepted`、boundary、running、terminal、cleanup 各自回指正式 owner，不能被单一成功状态压平。 | 负向验收确认 ACK、进程存活、端口开放和 UI toast 均不能单独证明运行成功。 |
| 建立资源冲突、停止、清理与恢复的安全体验 | 端口/文件/容量冲突、停止、清理、lease/orphan、网络断线和应用重启均有可解释的保护姿态；未知副作用不自动重放。 | 通过冲突、lease 丢失、断线、重连和 cleanup guard 未通过场景验收。 |
| 建立安全输出预览、失败诊断与 handoff 边界 | Runner 可以显示裁剪后的输出和安全诊断摘要，并在正式合同允许时发起 Observability handoff；不把本地材料升级为 evidence/report/verdict/signoff。 | 通过 redaction、body-free、不可见、partial、handoff accepted/delivered 场景验证。 |
| 建立可重建的跨平台本地体验 | 本地选择、cache 元数据、cursor、连接和资源视图可在重启/断线后重建；平台差异只表现为明确能力状态，不改变 source truth。 | 通过平台能力缺失、休眠唤醒、网络切换和应用重启的恢复验收。 |

上述目标是需求层的能力和边界结果，不预先指定桌面框架、容器后端、下载协议、签名算法、数据库或固定容量数字。

## 3. 非目标表

| 非目标 | 不做原因 |
|---|---|
| 创建、修改、发布或撤销 Release/Artifact version/baseline | 属于 `L1-artifact` 的正式事实和版本生命周期，Runner 只消费引用。 |
| 生成或解释 Governance approval、Policy、Gate、Decision、Control | 属于 `L1-governance`，Runner 不能本地推断“已批准”。 |
| 实现 Runtime loop、checkpoint、outcome、scheduler 或执行控制真相 | 属于 `L2-runtime` 等 owner；Runner 只保存请求和消费正式状态/结果。 |
| 实现 Sandbox backend、isolation policy、boundary、lease/reaper 或 cleanup guard | 属于 `L4-sandbox`；Runner 通过正式 API/adapter 协作，不复用私有实现。 |
| 生成正式 audit/evidence/report/verdict/signoff 或保存完整日志正文 | 属于 `L4-observability`/Artifact 等 owner；Runner 仅展示安全摘要并发起 handoff。 |
| 归档包生成、恢复编排或归档成功判定 | 属于 `L4-archive`，且当前正向交接合同未闭合。 |
| 代码编辑、调试、源码同步和生产级部署编排 | Runner 的产品主语是运行已批准产物，不替代 IDE、Sync、Process 或部署平台。 |
| `latest`、默认版本、自动选择“最近可用版本”作为真实运行输入 | 不可审计、可变且无法证明治理适用性。 |
| 预先锁定 Tauri、Electron、Docker、gVisor、Firecracker 或任何固定桌面/隔离技术 | 旧材料选择未经当前跨平台、SDK、Sandbox 和安全约束核验，后续架构阶段重新比较。 |
| 在需求层承诺冷/热启动时延、并发数、启停成功率、带宽、磁盘或清理 SLA 数字 | 当前缺少权威基线；数字后置到 NFR/测试/验收阶段重新校准。 |

## 4. 范围收束结论

本轮 Runner 需求只收束端侧运行入口与本地体验：显式版本选择、authority 门禁、下载/cache/完整性、Sandbox 正式请求、运行控制展示、资源/清理/恢复、输出预览、失败诊断和安全 handoff。上游 truth、私有实现和无来源的性能/容量数字保持在非目标或待确认范围。

## 5. 取舍与未采用方案

- 采用可验证的能力/边界目标，不采用“实现某个组件”或“达到历史数字”作为目标。
- 采用将发布、治理、执行、隔离、观测和归档交给 owner 的范围裁剪，不采用 Runner 全能化。
- 采用 NFR 先保留判断口径、后由正式来源量化，不采用从 README 自动继承阈值。

## 6. 回填草稿

正式 §4 由目标表、非目标表和范围收束短文组成。目标验证方式只写需求层可判断的验收方向，不写测试脚本、实现路径或尚未存在的证据。

## 7. 自检与进入下一步门禁

- [x] 每个目标描述了可验证的状态、边界或能力。
- [x] 非目标具体指向相邻 owner 或后续阶段，没有使用空洞“不做所有事情”。
- [x] 未将功能编号、接口、数据库或组件实现写成目标。
- [x] 旧技术选择和历史数字已明确排除或后置。

`Step 4 gate_status = pass`；下一步允许进入 `Step 5 用户与角色`。
