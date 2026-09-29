# Step 8. 用户故事

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 8
- 回填章节：正式 `00-需求文档.md` §6
- gate_status：`pass_with_blockers`
- gate_reason：A1~A9 每个能力节点均有外部角色、价值、前置条件、结果和失败上限；故事未写内部实现。
- next_allowed_action：进入 Step 9 功能需求。

### 1.1 Step 内计划

- [x] 读取 Step 7 能力节点与 Step 5 角色。
- [x] 先建立 A1~A9 故事骨架，再逐节点回答用户价值和可验收结果。
- [x] 诊断旧故事中的六域强制、自动恢复和合规声明越界。
- [x] 选择能力节点小循环，不采用按 CRUD/对象铺故事。
- [x] 形成故事表、Given-When-Then 和外围故事清单。
- [x] 完成跨能力故事审计和回填草稿。

## 2. 本步输入

- `00_req_step_05_users_roles.md`
- `00_req_step_07_core_capability_loop.md`
- `draft/02_功能推演.md`
- `projects/L1-workspace/00-需求文档.md` §7~§8
- L4 旧 `00-需求文档.md` §5、旧 README（仅污染审计）

## 3. SOP 问题回答

1. 当前每个核心能力节点服务谁？

   A1 服务归档请求发起者；A2/A3 服务审计者和请求发起者；A4/A5 服务审计者、运维者和治理/存储协作方；A6 服务审计者与下游只读 consumer；A7/A8 服务恢复申请者与 owner receiver；A9 服务运维者、审计者和受影响 owner。

2. 每个故事希望得到什么外部结果？

   故事只要求可观察的请求受理、来源覆盖说明、闭包/完整性/兼容状态、存储/生命周期执行状态、验证结果、恢复计划、逐 owner handoff 和局部失败/补偿结果；不要求 Archive 改变业务状态。

3. 如何表达失败和不确定性？

   Given/When/Then 明确缺失、过期、冲突、未知版本、完整性失败、提交未知和补偿要求的可见结果；不把局部成功压成全局成功。

4. 哪些故事不属于当前核心？

   一键恢复 Active、自动生成合规声明、跨包全文搜索/趋势/RCA、跨区域灾备编排和 UI 交互是外围或边界外，不进入当前故事分母。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| 旧 00 US-001 | “自动打包六域”未说明请求范围和 owner approval | 固定集合冒充业务授权 |
| 旧 00 US-002 | 要求 Archive 生成 SoA/AIIA/Conformance Claim | 治理结论越界 |
| 旧 00 US-003 | 要求恢复 Active 并发布 `project.restored` | 越过 `L1-work` 等 owner |
| 旧 00 US-004 | 要求按 7 年策略自动冷存 | 保留期限和 policy 未闭合 |
| draft/02 | 已有 A1~A9 方向，但故事仍为候选 | 需要逐节点可验收化 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 故事主轴 | 项目自动归档/恢复 | 请求、材料、验证、存储、交接 | 对齐 Archive-owned boundary |
| 故事对象 | “六域/合规包”固定集合 | 请求声明的 source slices 与 owner decision | 支持逐 slice authority matrix |
| 恢复结果 | Archive 把项目变 Active | owner-specific material/handoff/outcome | 保持业务状态 owner 唯一 |
| 失败表达 | 统一成功/失败 | partial/stale/missing/conflicting/unknown/compensation | 支撑可判别验收 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 按 A1~A9 能力节点逐故事收敛 | 每个故事能映射功能、规则、数据和验收 | 故事数量较多 | 采用 |
| B. 只保留一个“归档项目”大故事 | 简短 | 无法覆盖来源、闭包、完整性和 owner handoff 失败 | 不采用 |
| C. 按六域/CRUD 罗列故事 | 容易列清对象 | 把 source domain 结构和实现动作写成需求 | 不采用 |

## 7. 结构化中间产物

### 7.1 核心用户故事表

| ID | 角色 | 用户故事 | 能力 | 验收结果（Given/When/Then 摘要） | 优先级 |
|---|---|---|---|---|---|
| `US-AR-001` | 归档请求发起者 | 希望提交带范围、依据和幂等语境的归档请求，以便请求可被审计和安全处理。 | A1 | Given 依据缺失或范围不可解释 When 提交请求 Then request 被拒绝/阻断且原因可见；合法时形成 request 记录。 | P0 |
| `US-AR-002` | 归档请求发起者 | 希望知道每个纳入切片由哪个 owner 提供、覆盖到哪个版本/水位和 fence。 | A2 | Given source provider 返回 binding When capture 完成 Then 每个 slice 显示 owner/ref/version/fence/coverage 和状态。 | P0 |
| `US-AR-003` | 归档审计者 | 希望验证 manifest 声明与实际材料/引用集合闭合，以便发现缺片、越界或重复。 | A3 | Given manifest 与材料集合不一致 When 执行 closure check Then 返回 incomplete/overfull/invalid，不能形成 sealed。 | P0 |
| `US-AR-004` | 归档审计者 | 希望查看包和切片的摘要、签名、版本兼容状态，而不把未知结果误认为可信。 | A4 | Given 验证输入缺失、版本未知或摘要/签名不匹配 When verify Then 返回 unknown/unsupported-version/integrity-failed。 | P0 |
| `US-AR-005` | Archive 运维者 | 希望看到材料的存储位置、层级、迁移和取回状态，以便执行受控运维。 | A5 | Given 外部存储反馈 When placement/retrieval 完成 Then 显示 location/tier/status；commit unknown 保持可见。 | P0 |
| `US-AR-006` | 审计者/下游 consumer | 希望只读查询 manifest、来源、完整性和生命周期执行结果，以便审查历史包边界。 | A6 | Given query 请求 When 读取 Archive material Then 返回 provenance/coverage/status，不回源冒充 operational query。 | P0 |
| `US-AR-007` | 恢复申请者 | 希望提交带目标 owner、范围、依据和兼容性约束的恢复申请，以便生成可审查计划。 | A7 | Given 包验证失败、目标 owner 缺失或授权不可解释 When submit restore Then request blocked/rejected。 | P0 |
| `US-AR-008` | 恢复申请者 | 希望为每个 owner 获得最小、可验证且不越权的恢复材料。 | A8 | Given plan 和 source binding 有效 When materialize Then 生成 owner-specific material/ref，不直接写上游。 | P0 |
| `US-AR-009` | Owner restore receiver | 希望接收与自身 truth 对齐的恢复材料并返回明确接受、拒绝或部分结果。 | A8/A9 | Given handoff material When receiver 处理 Then Archive 记录 accepted/rejected/partial/commit-unknown，owner 决定业务提交。 | P0 |
| `US-AR-010` | Archive 运维者/审计者 | 希望看到重试、补偿、冲突和未知提交记录，以便不重复产生副作用。 | A9 | Given handoff/storage commit unknown When retry or reconcile Then 先验证/查询，记录 compensation-required，不静默重放副作用。 | P0 |

### 7.2 故事与失败上限矩阵

| 能力 | 正常外部结果 | 失败/降级结果 | 禁止解释 |
|---|---|---|---|
| A1 | request accepted | rejected/blocked | 不解释为业务归档批准 |
| A2 | per-slice captured | partial/stale/missing/conflicting | 不解释为全局快照 |
| A3 | closure complete | incomplete/overfull/invalid | 不解释为内容完整 |
| A4 | verified/supported | unknown/unsupported-version/integrity-failed | 不解释为安全可信 |
| A5 | location/tier 可查询 | storage-pending/unavailable/commit-unknown | 不解释为已持久化 |
| A6 | read/verify result | stale/partial/blocked | 不回源替代业务查询 |
| A7 | restore plan ready | rejected/blocked | 不解释为恢复已执行 |
| A8/A9 | handoff outcome recorded | partial/commit-unknown/compensation-required | 不解释为 owner committed/restored |

### 7.3 外围故事清单

| 故事 | 当前处理 | 原因 |
|---|---|---|
| 自动生成 SoA/AIIA/Conformance Claim | 不纳入核心 | 治理 authority/schema 未闭合 |
| 一键恢复 Active 或发布 `project.restored` | 禁止 | 业务生命周期归 owner |
| 跨包全文搜索、趋势/RCA | 后置 | 产品/observability 另有消费边界 |
| 跨区域灾备编排 | 后置 | 存储/运维 owner 未闭合 |

## 8. 回填草稿

Archive 的用户故事围绕九个核心能力节点展开：请求发起者能够提交可解释的归档请求；请求者和审计者能够查看每个 source slice 的 owner、版本、水位、fence 和 coverage；审计者能够验证 manifest 与材料闭包以及摘要/签名/版本兼容状态；运维者能够查看存储、迁移和取回状态；下游能够只读查询带 provenance 的归档结果；恢复申请者能够提交目标 owner 明确的恢复申请并获得计划与材料；各 owner 能够通过正式边界接收材料并返回逐项 outcome；运维和审计角色能够查看 partial、stale、missing、conflicting、unsupported-version、integrity-failed、commit-unknown 和 compensation-required。

这些故事不要求 Archive 改变任何项目、身份、对话、过程、治理、制品或审计真相，也不要求生成合规结论或一键恢复业务状态。

## 9. 待确认事项

- owner receiver 的具体角色标识、反馈枚举和授权语境受 `AR-UP-009` 影响。
- story 的量化 SLA、容量和 RTO/RPO 仍等待 workload/measurement authority。

## 10. 进入下一步条件

- [x] A1~A9 每个能力节点至少有一个核心故事。
- [x] 每个故事都有角色、价值、能力映射和可验收结果。
- [x] 故事未写 API、DTO、数据库、供应商或内部函数。
- [x] 外围故事与禁止项已分离。
- [x] gate_status=`pass_with_blockers`，允许进入 Step 9。
