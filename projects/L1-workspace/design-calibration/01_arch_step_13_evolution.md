# 01 架构 Step 13：演进路线

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 13。
开工确认：项目台账、flow、前序 Step 已读；三层门禁允许当前 Step。formal_01_write_allowed 仍关闭。

### Step 内计划

- [x] 读取输入和前序结论：见 §2。
- [x] SOP 问题回答：见 §3。
- [x] 当前材料诊断：见 §4。
- [x] 设计取舍：见 §6。
- [x] 结构化中间产物。
- [x] 复杂度判断与按单元停审。
- [x] 回填草稿。
- [x] 自检与进入下一步条件。

模块骨架：not_applicable。未来 Step 不创建。

## 2. 本步输入

Step 10~12，项目台账 WS-UP-001~008 与全局 §4.1；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 当前做到哪里？收稳 scope/owner/no-write/投影/局部状态/失败结构，不声称正向集成。
2. 第一批守住什么？六单元、分区原子性、所有权和安全来源，即使先做 fake 也不能放宽。
3. 后续演进什么？逐 owner 闭合来源，再扩 coverage/恢复/消费交接，最后考虑性能/高级查询。
4. 可接受债务？物理部署、存储产品、量化目标未定；来源接缝 pending 可隔离，但不能把必需 schema 留给实现临时补。
5. 哪些触发重审？新 scope/执行主语、source contract 变更、可见性/分页契约变更、多实例切换、下游 export 需求。
6. 文档顺序？完成 01 后停审；02~07 逐篇用户确认，项目 07 停审后才轮到 archive；产品/分发窗口必须等 archive 也停审。

## 4. 当前文档问题诊断

README §三缺少 04，不能继承其目录任务链；draft 的预测排序、archive freeze 不能直接列为未来必做。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 以合同/结构成立条件驱动演进 | 不伪造排期和能力 | 解锁依赖外部 owner | 采用 |
| 按时间承诺所有来源上线 | 容易展示进度 | 无实际合同支撑 | 不采用 |

## 7. 结构化中间产物

### 7.1 演进阶段

| 阶段 | 架构范围 | 进入/退出条件 | 当前姿态 |
|---|---|---|---|
| A 结构基线 | U1~U6、只读输入、局部写、保守失败 | 正式 00/01 收束且用户审阅 | 当前交付目标，非实现 baseline |
| B 可落码契约闭包 | 02/03 按功能展开模块、对象、ref、协议、状态、事务 | owner seam 已闭合，或受影响路径明确不可执行且不伪造 schema | waiting；01 不授权进入 |
| C 来源逐域接入 | 显式 query/visibility、event/baseline、局部状态、恢复 | 每来源顺序/水位/撤销可验证，测试验收有真实材料 | blocked_by_upstream |
| D 稳定消费与交接 | 产品/SDK/sync 所需读模型；archive 只读边界 | consumer 合同和分页/版本语义一致 | pending；不承诺 archive 结果 |
| E 规模与外围增强 | 多实例、搜索/统计/历史比较等 | workload、隔离或需求触发且重新审阅 | 非当前核心承诺 |

### 7.2 债务与触发条件

| 项 | 可接受性 | 触发条件 / 约束 |
|---|---|---|
| 存储、部署产品未选定 | 架构阶段可接受 | 02/03/04 必须证明本地原子边界与运行条件 |
| 单部署逻辑隔离 | 当前可接受 | 负载或故障隔离要求多实例时重审 writer/cutover |
| exact upstream seam pending | 仅允许隔离且 fail-closed | 不允许作为可执行接口交给实现者 |
| 无量化 SLO baseline | 当前可接受 | 05/06 在 workload/测量条件具备后定目标 |
| Query 隐式 refresh/已读 | 不可接受 | 不是后续修复债务，当前禁止 |
| 旧授权继续可用、cursor 静默跳 gap | 不可接受 | 任何阶段不得绕过 |
| 新 Personal 执行主语/镜像 seed owner | 边界外，不是债务 | owner 正式裁决后重开需求与架构，不由 workspace 扩张 |
| 下游 export/分页契约变更 | 需重新评估 | 不能用 consumer 实现直接改本仓 truth |

### 7.3 串行门禁

当前只完成 01 并停审，不创建 02 flow。未来按 02 -> 03 -> 04 -> 05 -> 06 -> 07 逐文档确认；04/07 在对应步骤创建。07 同时建立 implementation ledger 和 planned boundary skeleton，不能提前生成执行事实。整个 L1-workspace 完成停审后才推进 L4-archive；archive 完成停审后才开启后续产品/分发并行窗口。

## 8. 回填草稿

正式 §14 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：按结构条件划分演进，不写任务排期、提交清单或实施 skeleton。

## 9. 待确认事项

WS-UP-001~008 仍保持 open；exact query/event/ref/visibility/cursor/export 和共享 schema 必须由 owner 关闭，不由本 Step 补全。

## 10. 进入下一步条件

阶段与 blocker 相容；债务不越过 owner/no-write/安全；未把外部 owner 能力当未来默认范围；未解锁 02/archive。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 14。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
