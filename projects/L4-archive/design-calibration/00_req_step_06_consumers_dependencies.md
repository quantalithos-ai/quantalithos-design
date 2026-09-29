# Step 6. 使用方与依赖

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 6
- 回填章节：正式 `00-需求文档.md` §6
- gate_status：`pass_with_blockers`
- gate_reason：依赖已按全局规则分类并裁剪；上游合同未闭合事项已显式登记，不影响需求层继续但阻塞正向集成和 readiness。
- next_allowed_action：进入 Step 7 核心能力闭环。

### 1.1 Step 内计划

- [x] 读取 Step 2、Step 5、全局依赖规则、L1-workspace 01/07 和各 owner 正式文档。
- [x] 列出使用方与前置依赖。
- [x] 按 compile/runtime/event/ref/adapter/fake 分类。
- [x] 诊断旧文档把所有 L1、对象存储和 SDK 写成同类 package dependency 的问题。
- [x] 比较“最小裁剪子图”与“全量六域 path dependency”方案。
- [x] 形成依赖裁剪表、类型表、禁止表和 ASCII 图。
- [x] 形成回填草稿并自检。

## 2. 本步输入

- `00_req_step_02_position_boundary.md`、`00_req_step_05_users_roles.md`
- `standards/document/全局项目依赖关系与裁剪规则.md` §2/§4/§5/§6
- `projects/L1-workspace/01-架构设计.md`、`07-实施计划.md`
- `projects/L0-core/00-需求文档.md`、`projects/L0-bus/00-需求文档.md`、`projects/L0-sdk/00-需求文档.md`
- 六个 L1 owner、`L1-artifact`、`L4-observability` 正式文档和必要台账
- L4 README、旧正式文档和 draft（仅污染审计）

## 3. SOP 问题回答

1. 本仓向哪些仓/系统提供哪些能力？

   向归档请求/恢复操作者、审计者、运维者和下游 SDK、Console、Sync、审计/法务/运营 consumer 提供 manifest、来源绑定、coverage、完整性/兼容、存储/生命周期执行状态、恢复计划/材料和 owner handoff 结果的只读或受控操作边界。

2. 本仓依赖哪些仓/系统提供哪些能力？

   依赖 `L0-core` 的经核验共享契约候选；依赖 `L0-bus` 的事件传递协作；依赖各 L1 owner 提供 approved snapshot/export/ref、版本/fence/coverage 和 restore receiver；依赖 governance 提供 retention/hold/delete/risk decision；依赖 `L1-artifact` 提供制品正文/版本/血缘的获准材料或引用；依赖 `L4-observability` 提供脱敏审计材料/ref；依赖对象存储、签名/KMS 等外部运行时能力。

3. 哪些关系是 compile、runtime、event、ref、adapter 或 fake？

   `L0-core` 仅为 compile candidate，必须通过正式导出核验；各 L1 owner、governance、artifact、observability 和外部设施是 runtime/ref/adapter；`L0-bus` 与 owner 变化通知是 event；SDK、产品和下游 receiver 是 adapter/ref；fake 只用于受控测试，不代表真实接入。

4. 哪些依赖会阻塞核心能力闭环？

   source snapshot/export/fence/coverage 合同、治理 decision、digest/signature/KMS、存储 location/tier/取回、Artifact/Observability/Workspace archive handoff，以及各 owner restore receiver 的反馈会阻塞正向闭环。需求层可先保留失败姿态和 pending 上限，但不应将这些依赖写成已可用。

5. 本仓禁止哪些依赖？

   禁止共享 L1 内部表或数据库事务，禁止把 L1 sibling、workspace projection、observability backend、对象存储供应商、KMS/secret truth、SDK client/cache、产品 UI、runtime/tools/sandbox、marketplace、capability registry 作为本仓业务 package/path dependency，禁止通过 Archive 反写上游。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| README §43~§54 | “所有 L1 六域服务 + core/bus + S3/PG”并列为上游 | 未区分依赖类型，诱导共享数据库和 path dependency |
| 旧 00 §275~§300 | 给每个依赖硬编码 SLA、API 和降级 | 需求阶段越界，且无来源 |
| 旧 01/03 | 将 object storage、PostgreSQL、worker 作为既定实现组件 | 把 runtime/adapter 提前写成实现结构 |
| draft/01 §5 | 已有分类，但 `L0-sdk` compile candidate 与全局矩阵关系仍需核验 | 需明确“candidate ≠ 已成立依赖” |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 上游关系 | 所有 L1 和基础设施统一列为依赖 | 按 owner 输入、事件协作、运行时 adapter、下游 ref 分类 | 反映真实协作关系 |
| 编译依赖 | core/bus/SDK 都可理解为 package | 仅 `L0-core` 为 compile candidate；其余禁止 path dependency | 遵循全局依赖裁剪规则 |
| 下游 | work/governance/console 混列 | owner receiver、SDK/product/sync consumer 各自分层 | 明确谁提供能力、谁消费结果 |
| 失败处置 | 统一 backlog/延迟 | unknown/partial/blocked/fail-closed 按依赖类型表达 | 不把 fake/降级写成 ready |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 最小裁剪子图 + 类型显式分类 | 依赖方向清楚，可逐 source/adapter 开放 | 需要保留多个 pending seam | 采用 |
| B. 所有 L1 sibling 建立 path dependency | 调用直接，初期代码似乎简单 | 形成跨域耦合和真相越权 | 不采用 |
| C. 通过 workspace/SDK 统一转发全部输入 | 接口数量少 | projection/cache/SDK 不能替代 owner truth | 不采用 |

## 7. 结构化中间产物

### 7.1 依赖裁剪表

| 关联方 | 本仓角色 | 关系分类 | 是否主链 | 依赖失效后果 | 当前处理 |
|---|---|---|---|---|---|
| `L0-core` | 共享 typed ref/error/metadata candidate | `compile`（候选） | 条件 | 跨仓类型无法核验 | 仅复用正式导出；未闭合不 shadow |
| `L0-bus` | 归档触发/变化提示协作 | `event` + `adapter` | 是 | 事件触发延迟或缺失 | bus 保有 delivery/ack/retry/replay truth |
| `L1-identity` | identity snapshot/ref provider | `runtime` + `ref` + `event` | 是，逐 slice | 身份材料缺失 | owner 返回版本/fence/coverage |
| `L1-conversation` | conversation slice provider | `runtime` + `ref` + `event` | 条件 | 对话材料不完整 | 不把 projection 当 canonical |
| `L1-work` | project/work slice 与生命周期 owner | `runtime` + `ref` + `event` | 是 | 无法证明项目上下文或状态前置 | Archive 不发布/修改状态 |
| `L1-process` | process snapshot/ref provider | `runtime` + `ref` + `event` | 条件 | 过程材料缺失 | owner-approved input |
| `L1-governance` | policy/gate/decision/retention/hold/delete owner | `runtime` + `ref` + `event` | 条件 | 处置动作必须 blocked | 只消费正式 decision/ref |
| `L1-artifact` | Artifact 正文/版本/血缘 provider | `runtime` + `ref` + `event` | 是，逐 slice | 内容闭包不成立 | 只接收获准 material/ref |
| `L1-workspace` | 只读 projection provider | `runtime` + `ref` | 受限 | 辅助视图缺失，不影响 canonical slice | projection 永不升格 |
| `L4-observability` | audit/evidence material provider | `runtime` + `ref` + `event` | 受限 | 审计材料不完整 | 只接收脱敏材料/ref |
| 外部存储/签名/KMS/压缩 | 基础设施 adapter | `runtime` + `adapter` | 条件 | location/integrity unknown | 产品/算法/密钥保持 pending |
| `L0-sdk`、Console、Sync | 只读消费与操作适配 | `adapter` + `ref` | 否 | 下游消费延迟 | 不拥有 Archive truth |

### 7.2 依赖类型分类表

| 类型 | 允许对象 | 本仓约束 |
|---|---|---|
| `compile` | 仅经核验的共享契约 | 当前只有 `L0-core` candidate；不能复制未发布 schema |
| `runtime` | owner query/export/restore、治理读取、外部存储 | 通过正式 service/adapter seam；不共享 DB |
| `event` | bus trigger、owner change、受控回执 | bus 负责 delivery truth；不把事件写成包内真相 |
| `ref` | source、decision、artifact、audit、workspace、handoff 引用 | ref 不自动转移 authority |
| `adapter` | storage、signature/KMS、SDK/product/restore receiver | adapter 返回能力/commit 状态；不拥有业务决定 |
| `fake` | 后续测试替身 | 仅验证本地失败姿态，不证明真实集成 |

### 7.3 禁止依赖表

| 禁止依赖 | 原因 | 正确做法 |
|---|---|---|
| 共享 L1 表/跨域事务 | 破坏 owner truth | 独立 query/export/ref seam |
| `L1-workspace` projection 作为 canonical snapshot | projection 不是 L1 truth | 逐 owner canonical source；projection 仅辅助 |
| observability backend / SDK cache / product UI | 不是 Archive-owned truth | 只读材料/ref 或下游 adapter |
| 对象存储供应商、KMS/secret truth | 产品与密钥 authority 未闭口 | runtime adapter + pending |
| runtime/member/tools/sandbox/capability registry | 不属于归档需求 | 记录边界，不纳入依赖 |
| fake 替代真实 owner approval/restore/storage | 会伪造 readiness | 标记 fake/blocked/not_run |

#### 依赖裁剪图: L4-archive

```text
L0-core --[compile candidate]--> L4-archive
L0-bus  --[event/adapter]-----> L4-archive
L1 truth owners --[runtime/ref/event]--> L4-archive
L1-workspace --[runtime/ref, projection only]--> L4-archive
L4-observability --[runtime/ref/event, approved material only]--> L4-archive
external storage/signature/KMS --[runtime/adapter]--> L4-archive
L4-archive --[adapter/ref]--> SDK / Console / Sync / restore receivers
```

图示说明：只有经过核验的 `L0-core` 共享契约可能进入 package dependency；其余边均不等价于 Cargo/package dependency。`fake` 只用于测试隔离。

## 8. 回填草稿

Archive 的主要消费方是归档/恢复操作者、审计者、运维者和下游 SDK、Console、Sync 及审计/法务/运营 consumer；主要输入来自各 owning domain 的 approved snapshot/export/ref、版本/fence/coverage、治理 decision、Artifact/Observability 获准材料，以及对象存储和完整性验证等外部运行时能力。

依赖关系严格按全局规则分类：`L0-core` 仅为经核验共享契约的 compile candidate；`L0-bus` 与 owner 变化是 event 协作；各 L1 owner、治理、Artifact、Observability、Workspace 和恢复接收方通过 runtime/ref/adapter 协作；SDK、产品和 Sync 是下游 adapter/ref。禁止共享 L1 表、跨域事务、projection 冒充 canonical truth、把对象存储/KMS/SDK/UI/runtime/tools 合并进本仓或把 fake 写成真实集成。

## 9. 待确认事项

- `AR-UP-001~009` 使正向 source、治理、存储、完整性和 restore receiver 接缝保持 pending/blocked。
- `L0-core` 共享类型是否有可直接复用的 archive-specific export 仍需架构阶段核验；未核验前不能建立 path dependency。
- 下游 SDK/Console/Sync 的稳定 read/export contract 受 `AR-UP-008` 和相关下游契约影响。

## 10. 进入下一步条件

- [x] 依赖已裁剪为本仓相关子图。
- [x] compile/runtime/event/ref/adapter/fake 分类明确。
- [x] 禁止依赖和 fake 边界明确。
- [x] 依赖失效后果可判别，未将 pending 写成 ready。
- [x] gate_status=`pass_with_blockers`，允许进入 Step 7。
