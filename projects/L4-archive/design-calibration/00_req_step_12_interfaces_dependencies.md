# Step 12. 接口与依赖

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 回填位置：正式 `00-需求文档.md` §12
- gate_status：`pass_with_blockers`
- gate_reason：已按能力节点列出查询/变更/事件/后台任务接口面，并承接 Step 6 的 compile/runtime/event/ref/adapter/fake 分类；未写协议或 schema。
- next_allowed_action：进入 Step 13 非功能需求。

### 1.1 Step 内计划

- [x] 读取 Step 6、Step 9、Step 11 和需求规范 §4.12。
- [x] 按 A1~A9 回答本仓提供与消费的能力级接口面。
- [x] 诊断旧 API/SLA/依赖表和 package/runtime/event 混写污染。
- [x] 比较能力级边界与协议/API 清单方案。
- [x] 形成对外能力接口表、外部依赖边界表和禁止解释。
- [x] 完成逐能力/跨能力接口审计、回填草稿和待确认记录。

## 2. 本步输入

- `design-calibration/00_req_step_06_consumers_dependencies.md`
- `design-calibration/00_req_step_09_functional_requirements.md`
- `design-calibration/00_req_step_11_data_ownership.md`
- `standards/document/全局项目依赖关系与裁剪规则.md`
- `standards/document/需求文档书写规范.md` §4.12
- 旧 `00-需求文档.md` §10 与旧 01/03（仅作污染审计）

## 3. SOP 问题回答

1. 本仓对外提供哪些能力级接口？

   请求/恢复/重试是受控变更或后台任务入口；manifest、来源、完整性、兼容、存储和结果是查询/验证面；owner-specific material 通过 handoff 面输出。

2. 本仓消费哪些同步、异步和引用输入？

   同步/运行期消费 owner query/export/restore receiver、governance decision 和设施 adapter；异步消费 bus trigger/owner change；以 ref 表达 source/decision/artifact/audit/workspace/handoff 外部对象。

3. 能力边界如何映射全局依赖类型？

   `L0-core` 仅是经核验 compile candidate；`L0-bus` 是 event/adapter；L1 owner、Artifact、Workspace、Observability 和设施是 runtime/ref/adapter/event；下游 SDK/product 是 adapter/ref。fake 仅为测试替身。

4. 哪些接口或依赖不得进入？

   不提供跨域写接口，不共享上游数据库，不纳入 API 路径、DTO、event schema、供应商或内部 port；runtime/event/ref/adapter/fake 不得伪装成 package dependency。

5. 是否有接口无功能来源或功能无依赖承接？

   无。F-AR-001~009 均有能力面；未闭合的 owner、governance、storage/integrity 和 receiver 合同保留为 AR-UP blocker。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| 旧 00 §10 | 把 core/bus、所有 L1、object storage 作为同类依赖并赋无来源 SLA。 | package/runtime/event 边界混乱。 |
| 旧 00 §10 | 直接列 archive/restore 事件和上游行为。 | 需求层提前固定协议，可能冒充 owner 决定。 |
| 旧 01/03 | 将 PostgreSQL、S3/Glacier、worker 和 SDK 作为既定内部组件。 | 供应商/适配边界被并入本仓。 |
| 旧材料 | 对所有 owner 使用固定六域读取接口。 | 未核验 source 合同被写成 ready。 |

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 能力级接口 + 类型化依赖边界 | 可保持需求层粒度和真实依赖类型。 | 具体协议留待后续设计。 | 采用。 |
| B. 直接列 API/Command/DTO | 看似可实施。 | 上游合同未闭合且越过需求层。 | 不采用。 |
| C. 所有关系建 package dependency | 编译调用简单。 | 破坏层级和 owner 边界。 | 不采用。 |

## 6. 结构化中间产物

### 6.1 对外能力接口表

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 变更接口 | 归档请求受理 | 接收可解释的范围、依据和幂等语境并返回受理/阻断结果。 | 核心闭环能力 |
| 后台任务接口 | 逐源采集与闭包评估 | 触发 source capture、manifest closure 和状态推进。 | 核心闭环能力 |
| 查询接口 | Bundle manifest 与 provenance 查询 | 读取切片来源、版本、fence、coverage、闭包和状态。 | 核心闭环能力 |
| 查询接口 | 完整性与版本兼容验证 | 读取摘要、签名、兼容性和失败原因。 | 核心闭环能力 |
| 后台任务接口 | 存储/生命周期执行跟踪 | 查询或推进位置、层级、迁移、取回和正式治理执行反馈。 | 核心闭环能力 |
| 查询接口 | 归档材料只读验证 | 为审计者和下游返回带 provenance 的只读结果。 | 核心闭环能力 |
| 变更接口 | 恢复申请与计划形成 | 接收目标 owner、范围、依据和兼容性约束，生成计划或阻断。 | 核心闭环能力 |
| 后台任务接口 | Owner-specific 材料交接 | 生成最小材料/引用并记录 receiver outcome。 | 核心闭环能力 |
| 变更接口 | 重试、核对与补偿登记 | 对未知提交或局部失败执行受控核对并登记补偿要求。 | 核心闭环能力 |

### 6.2 外部依赖边界表

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L0-core` | 编译期依赖（候选） | 仅复用经核验的共享引用/错误/版本语义；未核验前不建立 path dependency。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L0-bus` | 事件协作依赖 | 接收归档触发或 owner 变化提示；delivery/retry/replay truth 归 bus。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | L1 identity/conversation/work/process | 运行期依赖 + 引用 | 提供 owner-approved snapshot/export/ref、版本/fence/coverage 及恢复接收边界。 | 核心闭环能力 |
| 输入 | 治理结论依赖 | `L1-governance` | 运行期依赖 + 引用/事件 | 提供 retention/hold/delete/risk decision；Archive 只执行并记录。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-artifact` | 运行期依赖 + 引用 | 提供制品正文/版本/血缘的获准材料或引用。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-workspace` | 运行期依赖 + 引用 | 仅提供明确标注的 projection 辅助材料，不是 canonical truth。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L4-observability` | 运行期依赖 + 引用/事件 | 提供脱敏审计/证据材料或引用，不等同完整审计链。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | 对象存储、签名/KMS、压缩 | 运行期依赖 + adapter | 提供位置、完整性和材料处理能力；供应商、算法和密钥 authority 未闭合。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | owner restore receivers | 运行期依赖 + adapter | 接收 owner-specific material/ref 并返回 accepted/rejected/partial/unknown 等结果。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L0-sdk`、Console、Sync、审计 consumer | 运行期依赖 + adapter/ref | 只读消费 manifest、provenance、验证、生命周期和 handoff 状态。 | 核心闭环能力 |

### 6.3 明确禁止的接口/依赖解释

- 不提供直接改写上游业务状态、数据库或治理结论的接口。
- 不把 runtime、event、ref、adapter 或 fake 关系改写成 package/path dependency。
- 不把 workspace projection、observability backend、SDK cache、UI、runtime/tools/sandbox、marketplace 或 capability registry 纳入本仓业务依赖。
- 不在需求阶段定义 API 路径、DTO、事件 schema、函数签名或重试算法。

## 7. 能力级与跨能力停审

| 能力 | 能力接口/依赖承接 | 结果 |
|---|---|---|
| A1 | 归档请求受理；授权/触发输入 | pass_with_blockers |
| A2 | 逐源采集任务；owner runtime/ref/event | pass_with_blockers |
| A3 | closure 任务与 manifest query | pass_with_blockers |
| A4 | integrity/compatibility query；签名/KMS adapter | pass_with_blockers |
| A5 | storage/lifecycle task；governance/storage adapter | pass_with_blockers |
| A6 | 只读 read/export；下游 adapter/ref | pass_with_blockers |
| A7 | restore request/plan；authorization/receiver 输入 | pass_with_blockers |
| A8 | material handoff；owner receiver adapter | pass_with_blockers |
| A9 | reconcile/retry/compensation；receiver outcome | pass_with_blockers |

跨能力审计确认同一外部能力没有被不同类型重复定义，依赖类型与 Step 6 一致。

## 8. 回填草稿

Archive 对外提供归档请求、逐源采集/闭包、manifest/provenance 查询、完整性/兼容验证、存储/生命周期跟踪、只读 read/export、恢复申请/计划、owner-specific handoff 和结果/补偿能力面。`L0-core` 仅为 compile candidate，其他 owner、bus、设施、receiver 和下游均按 runtime/event/ref/adapter 协作；fake 不证明真实集成。任何能力面都不授予 Archive 跨域写权。

## 9. 待确认事项

- `AR-UP-001~009` 继续约束 source、governance、storage/integrity、workspace/observability 和 restore receiver 的具体合同。
- API/protocol/schema、同步/异步实现选择、重试协议和共享类型只在后续文档核验，不在需求层固定。

## 10. 自检与进入下一步条件

- [x] 所有接口/依赖均回指 F-AR-001~009 和 A1~A9。
- [x] 已区分查询、变更、事件输入/输出和后台任务接口。
- [x] 已保留 compile/runtime/event/ref/adapter/fake 语义，未制造 package dependency。
- [x] gate_status=`pass_with_blockers`，允许进入 Step 13。
