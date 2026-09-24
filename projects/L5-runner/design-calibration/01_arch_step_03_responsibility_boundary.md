# 01 架构 Step 3 · 职责边界

> 状态：`completed`
> 前置：`01_arch_step_01_requirements_baseline.md`、`01_arch_step_02_goals_constraints.md`、正式 `00` §2/§5/§6/§10
> 回填章节：正式 `01` §4 职责边界

## 1. 本步目标与问题回答

本步只回答 Runner 在全局架构中承担什么、不承担什么以及最容易混淆的职责。Runner 是端侧产品入口，不是任何上游 truth owner；其正式架构职责是组织本地选择、准备、请求、展示、保护和恢复边界。

## 2. 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 可信语境与显式 Release/version 选择 | 做 | Runner 承接用户选择和 selection generation，但不改变 Release truth。 |
| authority、取得和完整性资格的本地承接 | 做 | Runner 组合正式 owner 结果与本地材料姿态，形成是否可继续的本地 view。 |
| 正式 Sandbox/Runtime 请求与生命周期展示 | 做 | Runner 表达用户意图、关联和展示 owner status，不拥有执行真相。 |
| 端侧资源冲突与平台能力观察 | 做 | Runner 展示本地 probe 和影响范围，不拥有全局 allocation 或 scheduler truth。 |
| 停止、清理、保护与断线恢复姿态 | 做 | Runner 组织安全意图、保护和 reconcile 入口，清理完成由 owner 确认。 |
| 安全输出预览、失败诊断和 handoff 姿态 | 做 | Runner 负责 redacted、bounded 的用户解释，不生成正式证据或 verdict。 |
| Release/Artifact 创建、修改、发布、撤销和 baseline truth | 不做 | 版本和产物生命周期属于 Artifact owner。 |
| Governance Policy/Gate/Decision/Approval/Control | 不做 | 批准和治理决定属于 Governance owner。 |
| Project/ProjectMember/Work truth | 不做 | Runner 只消费项目语境和可见性，不伪造成员资格。 |
| Runtime loop、checkpoint、outcome、scheduler | 不做 | 执行真相属于 Runtime owner。 |
| Sandbox boundary、policy、lease、reaper、cleanup guard、私有 backend | 不做 | 隔离和清理真相属于 Sandbox owner。 |
| Observability audit/evidence/report/verdict/signoff | 不做 | 本地诊断只能交接安全摘要，不能升格为审计结论。 |
| Archive package/restore truth | 不做 | Archive 只作为条件性历史引用，不参与运行成功判定。 |
| 本地 PID/端口/cache 作为运行或清理成功 | 易混淆职责 | 它们是观察或材料状态，不是 owner truth。 |
| Sandbox accepted 作为 running | 易混淆职责 | accepted 只表示请求被接收，running 必须有正式状态来源。 |
| 本地日志/telemetry 作为正式 evidence | 易混淆职责 | 本地材料须 redaction 并经过正式 handoff，仍不等于 evidence。 |
| SDK/Bus/适配器实现 | 易混淆职责 | Runner 消费公开 seam，不拥有 SDK、Bus 或相邻仓私有实现。 |

## 3. 做 / 不做边界

### 3.1 Runner 做什么

- 维护本地选择、请求、控制、取得/验证、资源和恢复姿态。
- 把已获资格的材料和明确意图交给正式公开边界。
- 以 source、freshness、visibility、redaction posture 展示安全视图。
- 在未知、冲突、过期或不可用状态下阻止危险副作用并给出 reconcile/manual-review 入口。

### 3.2 Runner 不做什么

- 不在本地批准、修改、冻结或推断 Release/Governance。
- 不直接运行未验证材料，不把本机进程当 Runtime/Sandbox 成功。
- 不调用 Sandbox 私有 backend，不共享相邻仓内部存储。
- 不把原始日志、截图、telemetry 或 handoff ACK 变成正式审计材料。

## 4. 边界红线

| 红线 | 架构保护 |
|---|---|
| RunnerRun/本地运行记录不得成为 Runtime 或 Sandbox execution truth | 运行状态必须带 owner status/ref；本地状态只表达意图、观察和展示。 |
| 本地 authority cache 不得绕过当前有效性 | 每次启动前重新确认适用性、撤销/过期和 source binding。 |
| 查询、刷新、恢复不得隐式修复上游 | read path no-write；repair/reconcile 只能由正式 owner 或明确意图承接。 |
| 清理不得越过 lease/capture/handoff/retention/orphan guard | 保护姿态未确认时保持 blocked/protected。 |
| 诊断不能穿透 secret/raw body | 所有预览和 handoff 经过最小范围和 redaction。 |
| 跨域协作不得形成循环依赖 | 只经 SDK/API/adapter/reference，禁止共享内部事务或源码路径。 |

## 5. 单元级职责停审前提

后续架构单元必须分别继承以上红线：语境/选择单元不得批准 authority；取得/完整性单元不得修改 Release；运行控制单元不得拥有 execution truth；资源/恢复单元不得拥有 Sandbox cleanup truth；预览/诊断单元不得拥有 evidence/report truth。若某单元无法在这些边界内成立，应回到本步标记为 blocker。

## 6. 取舍与回填草稿

正式 §4 将回填职责边界表、做/不做清单和六条边界红线。系统上下文对象、限界上下文、运行单元、数据矩阵和通信方式留到后续 Step，不在本章提前展开。

## 7. 自检与进入下一步门禁

- [x] 做、不做、易混淆职责已分离。
- [x] 每个易混淆职责均指出 owner 或误读风险。
- [x] 边界红线覆盖 truth、查询、清理、诊断和依赖。
- [x] 未写系统图、子域、容器、协议或实现结构。

Step 3 gate_status = pass；下一步允许进入 Step 4 系统边界与上下文。
