# Step 9. 功能需求

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 9
- 回填章节：正式 `00-需求文档.md` §9
- gate_status：`pass_with_blockers`
- gate_reason：A1~A9 的功能均按业务能力而非 CRUD/API 拆分；每项均有故事和闭环映射；AR-UP-001~009 继续限制正向集成。
- next_allowed_action：进入 Step 10 业务规则与边界约束。

### 1.1 Step 内计划

- [x] 读取 Step 7、Step 8、Step 2、Step 6 与需求规范 §4.9。
- [x] 按 A1~A9 回答外部可见功能、输入/触发、结果和失败上限。
- [x] 诊断旧功能清单中的固定六域、治理越权、直接恢复和实现项。
- [x] 比较按能力节点归并与按对象/CRUD/API 罗列方案。
- [x] 形成 F-AR-001~009、故事映射和非目标功能表。
- [x] 完成能力级停审、回填草稿和自检。

## 2. 本步输入

- `design-calibration/00_req_step_07_core_capability_loop.md`
- `design-calibration/00_req_step_08_user_stories.md`
- `design-calibration/00_req_step_02_position_boundary.md`
- `design-calibration/00_req_step_06_consumers_dependencies.md`
- 旧 `00-需求文档.md` §6（仅作污染审计）

## 3. SOP 问题回答

1. A1~A9 需要哪些外部可见业务能力？
   - A1 需要受理带范围、依据、主体和幂等语境的归档请求。
   - A2 需要按 source-authority matrix 获取逐源 approved snapshot/export/ref，并暴露版本、水位、fence、coverage。
   - A3 需要将声明的切片、材料和引用形成可审查 manifest 与内容闭包。
   - A4 需要给出摘要、签名和版本兼容的可解释验证状态。
   - A5 需要记录存储位置、层级、迁移、取回及生命周期执行反馈。
   - A6 需要提供带 provenance、coverage 和状态的只读查询/验证面。
   - A7 需要受理恢复申请并形成目标 owner 明确的恢复计划。
   - A8 需要生成最小 owner-specific 恢复材料并交接。
   - A9 需要记录逐 item 结果、未知提交、重试和补偿要求。

2. 功能的输入、触发、结果和失败上限是什么？
   输入必须来自请求声明、owner-safe source、正式治理 decision、已核验完整性材料和外部 adapter 反馈；结果只表达 Archive-owned 状态或 handoff outcome。缺失、过期、冲突、未知版本、完整性失败和提交未知必须保留为可见状态，不能压成成功。

3. 哪些旧功能不继承？
   固定“六域必含”、自动生成 SoA/AIIA/Conformance Claim、Archive 直接把项目改为 Active、固定七年保留、指定 S3/Glacier/PostgreSQL、跨包搜索和产品 UI 均不作为当前功能需求。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 当前处置 |
|---|---|---|
| 旧 §6 F-001/F-002 | 把固定六域集合写成打包前提，未体现请求范围与 owner authority。 | 改为按请求声明逐 slice capture；缺少 binding 时 partial/blocked。 |
| 旧 §6 F-003 | 要求 Archive 生成治理合规结论。 | 只消费 governance decision/ref；不生成或裁决声明。 |
| 旧 §6 F-006 | 将恢复定义为 archived→active 状态写入。 | 改为 restore plan、material 和 owner-specific handoff。 |
| 旧 §6 F-005/F-007 | 把供应商、固定层级和保留期限写成确定实现。 | 只保留 location/tier/lifecycle execution seam，未闭合项进入 blocker。 |
| 旧 §6 F-008 | 以 PostgreSQL 索引查询作为实现前提。 | 改为带 provenance 的只读 read/export 能力。 |

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 按 A1~A9 能力节点归并 | 可直接承接规则、数据、接口和验收；失败边界清晰。 | 功能项较多，需要后续矩阵审计。 | 采用。 |
| B. 按 Bundle/Restore/Retention 三个对象大类 | 叙述简短。 | 丢失逐源 capture、closure、integrity 与 handoff 的独立门禁。 | 不采用。 |
| C. 按 CRUD、API 或 worker 罗列 | 便于实现拆分。 | 越过需求层，制造孤儿实现项。 | 不采用。 |

## 6. 结构化中间产物

### 6.1 核心功能需求表

| 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|
| `F-AR-001` 归档请求受理与范围解释 | 核心闭环能力 | 系统必须受理能说明主体、范围、依据和幂等语境的请求，并对不可解释请求给出阻断结果。 | A1 | `US-AR-001` |
| `F-AR-002` 逐源快照/导出/引用采集 | 核心闭环能力 | 系统必须按 source-authority matrix 获取 owner-approved source material/ref，并暴露版本、水位、fence、coverage 和逐源状态。 | A2 | `US-AR-002` |
| `F-AR-003` Manifest 与包内容闭包 | 核心闭环能力 | 系统必须将请求声明的 slice、材料和引用形成可审查 manifest，并判定 incomplete、overfull 或 invalid。 | A3 | `US-AR-003` |
| `F-AR-004` 完整性与版本兼容评估 | 核心闭环能力 | 系统必须记录正式摘要、签名和 schema/version compatibility 的验证结论，并区分 verified、unknown、unsupported-version、integrity-failed。 | A4 | `US-AR-004` |
| `F-AR-005` 存储位置与生命周期执行记录 | 核心闭环能力 | 系统必须记录材料的位置、层级、迁移、取回和治理生命周期执行反馈，不把请求已发出解释为已持久化。 | A5 | `US-AR-005` |
| `F-AR-006` 归档材料只读查询与验证 | 核心闭环能力 | 系统必须提供带 provenance、coverage、integrity、compatibility 和 lifecycle 状态的只读消费面。 | A6 | `US-AR-006` |
| `F-AR-007` 恢复申请校验与计划形成 | 核心闭环能力 | 系统必须校验目标 owner、范围、依据、授权和兼容性约束，并形成可审查的逐 owner restore plan。 | A7 | `US-AR-007` |
| `F-AR-008` Owner-specific 材料生成与交接 | 核心闭环能力 | 系统必须按 owner 生成最小恢复材料/引用并通过正式 handoff 边界交接，不能直接写上游。 | A8 | `US-AR-008`、`US-AR-009` |
| `F-AR-009` 结果记录、重试与补偿编排 | 核心闭环能力 | 系统必须逐 item 记录 accepted、rejected、partial、conflicting、commit-unknown 和 compensation-required，并支持受控重试/核对。 | A9 | `US-AR-010` |

### 6.2 非目标功能

| 非目标 | 原因 | 正确边界 |
|---|---|---|
| 固定六域强制收集 | source 范围由请求和 owner authority 决定。 | 使用逐 slice source-authority matrix。 |
| 自动生成 SoA/AIIA/Conformance Claim | 治理结论归 governance/明确 owner。 | 仅归档获准 decision/ref。 |
| 直接恢复项目 Active 或发布业务恢复事件 | 项目生命周期归 `L1-work` 等 owning domain。 | 通过 owner-specific restore handoff。 |
| 自行决定保留期限、legal hold、删除或销毁 | 治理授权未闭合。 | 只执行并记录正式 decision。 |
| 跨包全文搜索、RCA、产品 UI、SDK cache | 不属于 Archive 核心能力。 | 由下游产品/observability 消费。 |

## 7. 能力级功能停审

| 能力 | 故事承接 | 功能承接 | 结果 |
|---|---|---|---|
| A1 | US-AR-001 | F-AR-001 | pass_with_blockers |
| A2 | US-AR-002 | F-AR-002 | pass_with_blockers |
| A3 | US-AR-003 | F-AR-003 | pass_with_blockers |
| A4 | US-AR-004 | F-AR-004 | pass_with_blockers |
| A5 | US-AR-005 | F-AR-005 | pass_with_blockers |
| A6 | US-AR-006 | F-AR-006 | pass_with_blockers |
| A7 | US-AR-007 | F-AR-007 | pass_with_blockers |
| A8 | US-AR-008/009 | F-AR-008 | pass_with_blockers |
| A9 | US-AR-010 | F-AR-009 | pass_with_blockers |

## 8. 回填草稿

Archive 必须提供九项核心功能：可解释的归档请求受理；逐源 approved snapshot/export/ref 采集；manifest 与内容闭包；完整性和版本兼容评估；存储位置与生命周期执行记录；带 provenance 的只读查询/验证；恢复申请校验和逐 owner 计划；owner-specific 材料与正式 handoff；逐 item 结果、核对、重试和补偿记录。所有功能只表达 Archive-owned 状态或外部 handoff 结果，不决定项目状态、治理结论、保留/销毁权限或 owner committed。

## 9. 待确认事项

- `AR-UP-001~009` 继续限制逐源采集、完整性/存储、治理执行和 restore receiver 的正向功能结果；功能边界允许收束，真实接入与 readiness 仍 blocked。
- API、DTO、内部模块、供应商、算法和量化 SLA 只可在后续正式阶段基于已关闭 authority 核验，当前不固定。

## 10. 自检与进入下一步条件

- [x] 每项功能都能回指至少一个用户故事和明确能力节点。
- [x] 功能按业务能力组织，没有 CRUD/API/Command/内部模块名称。
- [x] 核心闭环与边界外能力已分离。
- [x] 失败上限没有被写成全局成功。
- [x] 未闭合外部合同继续保留为 blocker，不伪造 ready。
- [x] gate_status=`pass_with_blockers`，允许进入 Step 10。
