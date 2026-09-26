# L5-sync 架构 Step 14 · 风险与待确认事项

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 14 |
| 输入 | Step 1~13、项目台账 `SYNC-UP-001~010`、专项上游当前状态 |
| 回填章节 | 正式 01 §15 |
| 下一步 | Step 15：ADR 与需求追溯 |

## 2. Step 内计划

- [x] 汇总前序未关闭的架构风险和待确认事项，二者分开表达。
- [x] 为每项写明影响层、当前处理、owner/来源和解锁条件。
- [x] 判断哪些不阻塞正式 01、哪些阻塞后续具体设计或危险操作。
- [x] 复核 LFS/浅克隆/GUI 等历史选择没有被主线吸收。
- [x] 完成风险与待确认审计，不脑补确定性结论。

## 3. 本步输入

| 来源 | 风险类别 |
|---|---|
| 项目台账 `SYNC-UP-001~010` | 上游 surface、source、permission、handoff、idempotency、metadata、Git、cursor、tool、dirty contract |
| Step 5~9 | 上下文、数据、依赖和交互中的 pending contract |
| Step 10~13 | 技术候选、演进触发、不可接受债务 |
| 专项上游 ledger/flow | 正式文档完成不等于所有 L5-sync 所需精确消费合同已发布 |

## 4. SOP 问题回答

### 4.1 当前还有哪些架构风险？

主要风险是：owner surface 与 version compatibility 未精确闭合；Artifact/Workspace source authority 模糊；Project permission/posture 动作矩阵不足；Review handoff/probe/decision 协议不足；unknown outcome 无统一等价性；metadata schema/迁移/完整性不足；Git remote 与平台 source 关系模糊；cursor/comparator/gap 未闭合；LFS/浅克隆/GUI 支持矩阵缺失；dirty/path/manual conflict 合同不足。

### 4.2 影响哪一层？

这些风险分别影响 Selection、Materialization、Working Copy/Metadata、Recovery、Handoff、依赖 adapters、数据一致性、技术选型、演进与后续 02/03 的可落码粒度。它们不阻止架构确定保守边界，但会阻止具体 protocol/schema/state transition 或危险 mutation 被宣称 ready。

### 4.3 哪些待确认会影响前文成立？

如果未来 owner 正式合同与当前能力边界相冲突，需回归 Step 4/7/8/9；如果 source authority 证明无法支持 safe delta，Materialization 必须退化为 blocked 或仅全量受控流程；如果 Git adapter 无法提供原子/dirty protection，不能放宽红线，而应保持 unsupported。

### 4.4 哪些阻塞后续推进？

正式 01 可以在 blocker 真实保留的前提下完成；但 `SYNC-UP-001~010` 会分别阻塞 02/03 中的精确 API/object/schema/state/flow 定稿，尤其阻塞任何实际 materialize/handoff readiness。没有用户授权也阻塞进入 02，这与技术 blocker 分开记录。

## 5. 当前文档问题诊断

| 历史处理 | 问题 | 当前处理 |
|---|---|---|
| 用“重试/repair/rebind”泛化解决风险 | 没有 owner、等价性和 provenance 依据 | 风险保持 open，unknown 先 probe/manual |
| 把 LFS/浅克隆当大仓答案 | 缺支持矩阵和 workload | 作为待确认技术候选 |
| 把 Tauri/GUI 当演进确定项 | 无正式产品需求 | 作为外围待确认，不承诺 |
| 把 SDK 存在解释为精确接口存在 | 官方客户端层不等于所有 sync surface 已发布 | 保持 `SYNC-UP-001` |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. 为完成正式 01 推测上游合同 | 不采用 | 违反真实性和 owner 边界。 |
| B. 架构边界确定，具体合同显式 blocked/pending | 采用 | 既可形成稳定结构，又不伪造接口。 |
| C. 因所有 blocker 未闭合而不写任何架构 | 不采用 | 保守 fail-closed 结构仍可收敛并指导上游/后续设计。 |

## 7. 结构化中间产物

### 7.1 架构风险表

| 风险 ID | 风险 | 影响范围 | 当前处理口径 | 是否阻塞正式 01 |
|---|---|---|---|---|
| `AR-SYNC-001` | SDK/owner 精确 surface 缺失导致 adapter 猜测 | §5/7/8/10、后续 API | 只定义 capability port；不锁方法/DTO/error | 否；阻塞 02/03 精确 surface |
| `AR-SYNC-002` | Artifact/Workspace source authority 重叠或缺口 | §5/6/9/10 | owner-neutral source resolver；无唯一来源即 blocked | 否；阻塞 materialization 定稿 |
| `AR-SYNC-003` | 权限/posture 缓存过期导致越权 | §3/5/9/13 | mutation 前 owner revalidation；unknown fail-closed | 否；阻塞允许动作矩阵 |
| `AR-SYNC-004` | ACK/HTTP 成功误报 Review accepted | §4/9/10/13 | attempt/transport/probe/decision 分层 | 否；阻塞 handoff protocol |
| `AR-SYNC-005` | unknown outcome 盲重放产生重复副作用 | §9/10/11/13 | prepare→call→probe/finalize；等价不明转人工 | 否；阻塞 retry policy |
| `AR-SYNC-006` | metadata 损坏/迁移导致 provenance 断裂 | §6/9/13 | generation/integrity/checkpoint；不静默迁移/删除 | 否；阻塞 schema/layout |
| `AR-SYNC-007` | Git remote/source/branch 语义混层 | §4/8/9 | Git 只作 observation/apply edge；remote 不授权平台事实 | 否；阻塞 Git mapping |
| `AR-SYNC-008` | cursor/comparator/gap 不闭合导致错误增量 | §9/10/14 | 无安全 comparator/gap contract 则 pull blocked | 否；阻塞增量路径 |
| `AR-SYNC-009` | LFS/浅克隆/GUI 历史承诺污染范围 | §3/11/14 | 不进入当前方案；需支持矩阵/正式需求 | 否 |
| `AR-SYNC-010` | dirty/untracked/path protection 不足导致覆盖 | §4/7/9/10/13 | 任一不确定即 pause/manual，不自动 stash/merge | 否；阻塞 safe apply |

### 7.2 待确认事项表

| 对应 blocker | 待确认事项 | owning 来源 | 当前挂起口径 | 解锁条件 |
|---|---|---|---|---|
| `SYNC-UP-001` | SDK project/version/source/artifact/workspace/review surfaces、errors、compatibility | `L0-sdk` + owner contracts | capability-only | 正式发布可消费合同/版本矩阵 |
| `SYNC-UP-002` | Artifact/Workspace materialization source、watermark、priority | `L1-artifact`/`L1-workspace` | owner-neutral resolver | 单一 authority/选择规则与安全 ref 发布 |
| `SYNC-UP-003` | ProjectMember permissions、archived/dissolved/retired allowed actions | `L1-work`/policy owner | fail-closed | 正式动作矩阵/撤销时效发布 |
| `SYNC-UP-004` | Review handoff、ACK、probe、decision ref | `L1-governance` + SDK | attempt/decision 分层 | 正式 handoff/probe contract 发布 |
| `SYNC-UP-005` | idempotency key、unknown retry/probe | 各副作用 owner + SDK | no blind replay | 等价性、probe 和 retry contract 发布 |
| `SYNC-UP-006` | `.qs-sync` schema、migration、integrity、recovery、retention | L5-sync 后续设计 + security/owner inputs | controlled metadata only | 02/03/04 按上游合同闭合且通过审计 |
| `SYNC-UP-007` | Git remote/platform source/branch/object relation | source/Git adapter contract | observation only | 正式 mapping/compatibility contract |
| `SYNC-UP-008` | incremental cursor/mapping/comparator/gap/replay | source owners + SDK | pull blocked without proof | stable version/cursor/gap contract |
| `SYNC-UP-009` | LFS、shallow clone、GUI/Tauri support | product/tooling/source owners | historical/pending | 正式 requirement + support/workload matrix |
| `SYNC-UP-010` | dirty/untracked/path protection/manual conflict decisions | L5-sync 后续设计 + Git/fs capability | pause/manual | precise adapter capability and recovery contract |

### 7.3 当前处理口径

所有待确认项在正式 01 中保持 `pending/blocked`；架构只承诺当合同缺失时如何安全停止，不承诺合同已经存在。任何 fake、fixture、cache、ACK、log 或 historical README 都不能关闭这些条目。

### 7.4 架构完成上限

完成正式 01 仅说明架构边界、单元、依赖、数据、通信、取舍、横切与追溯在设计文本中一致；不说明实现仓存在、SDK surface 可调用、Git adapter 可用、测试已跑、证据已生成、Review 已通过或系统 ready。

## 8. 回填草稿

正式 §15 回填 7.1、7.2、7.3、7.4；风险与待确认分表，不把“当前处理”润色成最终解决方案。

## 9. 自检与进入下一步条件

- [x] 风险和待确认事项分开表达。
- [x] 每项有影响范围、当前处理、owner 与解锁条件。
- [x] `SYNC-UP-001~010` 无一被 fake/cache/ACK/历史文档关闭。
- [x] 已明确正式 01 完成上限和对后续 02/03 的阻塞方式。

`gate_status = pass_with_upstream_blockers`；可进入 Step 15。
