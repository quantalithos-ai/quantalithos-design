# 01 架构 Step 4：系统边界与上下文

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 4。

### Step 内计划

- [x] 读取 Step 1~3、正式 00 使用方/依赖/interface 和上游 owner 边界。
- [x] 回答位置、正式上下游、输入/输出面及依赖失效。
- [x] 诊断旧上下文图中的角色、协议、供应商和直接写入污染。
- [x] 输出系统上下文图、关系表、边界说明和自检。

## 2. 本步输入与问题回答

输入为正式 00 §6/11/12/15、Step 1~3 和全局依赖矩阵。

1. 全局位置：位于 Layer 4 跨域材料化层，接在 workspace 后、产品/分发前，但业务材料 authority 仍来自各 owner。
2. 正式上游：L1 truth owners/governance/artifact、workspace projection provider、observability material provider、bus、外部完整性与存储能力。
3. 正式下游：owner restore receivers 与只读 consumer/SDK product adapter。
4. 输入面：请求/decision ref、approved snapshot/export/ref、audit material、触发/回执、设施结果。
5. 输出面：Archive manifest/provenance/status read、owner-specific restore material/handoff。
6. 失效：按 source/operation 局部 blocked/partial/unknown；不可用不升级为全局失败或成功，也不由替代来源偷补。

## 3. 历史诊断、对比与取舍

旧图把管理员、审计者、PostgreSQL、S3/Glacier、API/worker 与 L1 仓放在同一上下文层，并暗示 Archive 可把状态写回 L1。当前分离“正式系统上下文”与后续“运行承载”：角色留在需求，具体产品不进图，restore receiver 只作为外部正式边界。

取舍：上下文对象按职责聚类为 7 个关键对象，具体 L1 owner 清单留在关系表/source-authority matrix；这样保持图可读且不掩盖逐 owner authority。

## 4. 结构化中间产物

### 4.1 系统上下文图

```text
                    +-----------------------------+
                    | L1 truth / governance owners|
                    | approved material/decisions |
                    +--------------+--------------+
                                   |
                                   | input / dependency
                                   v

+----------------------+   +----------------------+   +----------------------+
| L1-workspace         |   | L4-archive           |   | L4-observability     |
| projection input only|-->| archive/restore      |<--| audit material only  |
+----------------------+   | material boundary    |   +----------------------+
                           +----------+-----------+
                                      |
                     +----------------+----------------+
                     | output                          | output
                     v                                 v
          +----------------------+          +----------------------+
          | owner restore        |          | read consumers /     |
          | receivers            |          | SDK adapters         |
          +----------------------+          +----------------------+

                    +-----------------------------+
                    | Bus + integrity + storage   |
                    | external capabilities       |
                    +--------------+--------------+
                                   |
                                   | input / dependency
                                   +----------> L4-archive
```

图后说明：

- 图只表达 Archive 与正式上下文对象之间的输入、输出和依赖关系，不表达接口、事件、实现组件或时序。
- L1 truth/governance owners 在图中聚类，逐 source authority 必须在配套表和后续数据章展开。
- workspace 与 observability 只是受限材料来源，不是 L1 canonical truth 的替代。
- restore receiver 的输出关系是材料交接，不表示 Archive 具有业务写权。

### 4.2 上下游与输入/输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| identity/conversation/work/process owners | 输入/输出 | 来源/恢复接收 | approved snapshot/export/ref；owner-specific restore handoff | 各自拥有业务 truth；单源失败只影响相应 slice/item。 |
| `L1-governance`/明确治理 owner | 输入 | 治理依赖 | retention/hold/delete/risk decision/ref | Archive 不解释或创建设定。 |
| `L1-artifact` | 输入/输出 | 来源/恢复接收 | version/lineage/baseline approved material/ref；restore material | 通用正文/血缘 authority 不转移。 |
| `L1-workspace` | 输入 | 来源 | 明确标注的 projection snapshot/ref | 只能作为辅助材料。 |
| `L4-observability` | 输入 | 来源 | 脱敏 audit/evidence material/ref | 不等于完整审计链或 backend truth。 |
| `L0-bus` | 输入 | 入口/来源 | 触发、变化提示、回执协作 | delivery/replay truth 留在 bus。 |
| 完整性/签名/KMS/压缩能力 | 输入 | 外部能力依赖 | 处理或验证结果 | 具体产品、算法和密钥未确定。 |
| 对象存储/取回能力 | 输入 | 外部能力依赖 | location/tier/commit/retrieval feedback | Archive 记录结果，不拥有设施。 |
| owner restore receivers | 输出 | 消费 | 最小 owner-specific material/ref 与 handoff context | receiver 独立接受、拒绝、提交或返回未知。 |
| `L0-sdk`/Console/Sync/审计 consumer | 输出 | 入口/消费 | Archive read/verify/operation surface | 下游不反向拥有 Archive truth。 |

### 4.3 失效与边界说明

来源不可用、版本不可比较或 coverage 不足时，只把相关 slice 标成 stale/missing/conflicting/partial/blocked；不得用 workspace、cache 或 observability summary 补成 canonical source。存储或完整性能力不可用时保留 pending/unknown/commit-unknown，已知 metadata 可读但不得宣布 sealed/verified。receiver 不可用或提交未知时保留 plan/material/handoff 记录并进入核对或补偿，不能直接写 owner 数据库。`L0-core` 的潜在共享类型属于 Step 7 依赖裁剪，不在本上下文图中伪装为运行系统。

## 5. 回填、待确认与门禁

正式 §5 承接本图、关系表和边界说明。所有 `AR-UP-001~009` 仍 open；本步没有新增 API、event、DTO 或产品事实。

系统对象、方向和失效口径已明确；图的对象数和关系类型符合规范。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 5 限界上下文与子域划分`。
