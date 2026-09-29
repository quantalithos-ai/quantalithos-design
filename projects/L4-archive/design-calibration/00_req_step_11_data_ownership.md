# Step 11. 数据需求与数据归属

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 回填位置：正式 `00-需求文档.md` §11
- gate_status：`pass_with_blockers`
- gate_reason：已区分 Archive 真相、上游快照、外部引用和禁止保存正文，并建立 source-authority matrix；正文闭包和 retention 合同仍受 blocker 约束。
- next_allowed_action：进入 Step 12 接口与依赖。

### 1.1 Step 内计划

- [x] 读取 Step 2、Step 9、Step 10、各 source owner 正式边界和需求规范 §4.11。
- [x] 按 A1~A9 识别功能所需数据，并先判定真相/快照/引用/禁止保存正文。
- [x] 诊断旧固定 Slice/RetentionSchedule 结构和 workspace/observability authority 污染。
- [x] 比较“Archive-owned 过程真相 + owner-approved material/ref”与“跨域复制主库”方案。
- [x] 建立逐类 source-authority matrix 和数据归属表。
- [x] 完成能力级、跨能力数据审计、回填草稿与待确认记录。

## 2. 本步输入

- `design-calibration/00_req_step_02_position_boundary.md`
- `design-calibration/00_req_step_09_functional_requirements.md`
- `design-calibration/00_req_step_10_business_rules_boundaries.md`
- 各 L1 truth owner、`L1-workspace`、`L1-artifact`、`L4-observability` 当前正式边界
- `standards/document/需求文档书写规范.md` §4.11
- 旧 `00-需求文档.md` §9（仅作污染审计）

## 3. SOP 问题回答

1. 哪些数据由 Archive 拥有正式真相？

   仅归档专属 request/job、Bundle/manifest/inventory、source binding/capture/coverage、closure/integrity/compatibility、storage/lifecycle execution、restore request/plan/material/handoff/outcome/retry/compensation。

2. 哪些只是快照或引用？

   各 owner 的 approved snapshot/export 是快照；source、decision、artifact、audit、workspace 和 handoff 外部对象仅以 ref 表达。两类数据都不转移 authority。

3. 哪些正文禁止保存？

   identity、conversation、work、process、governance、通用 artifact、workspace projection backend、observability backend、SDK/client/cache 的业务正文或内部真相均禁止作为 Archive-owned 正文保存。请求获准纳入 Bundle 的 material 是带 source binding 的归档材料，不转化为其业务真相。

4. 数据生命周期如何表达？

   Archive-owned 数据随请求、采集、验证、存储、恢复和补偿正式变化；快照随来源版本/有效性变化；引用随外部关系有效性变化；禁止正文不进入本仓生命周期。

5. 是否有功能所需数据无归属或数据无来源？

   无。A1~A9 和 F-AR-001~009 均有数据承接；没有数据库表、字段、索引或缓存设计泄漏。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| 旧 00 §9 | 固定 identity/work/.../observability Slice 树。 | 固定集合替代请求范围与 owner authority。 |
| 旧 00 §9 | `RetentionSchedule` 被视为 Archive 规则真相。 | 侵入 governance 的 policy/decision authority。 |
| 旧 01/02/03 | 将 PostgreSQL、对象存储路径和固定字段当需求真相。 | 需求层绑定实现与供应商。 |
| 旧材料 | workspace projection、audit summary 与 canonical source 混列。 | 副本/摘要可能冒充业务真相。 |

## 5. 改动前后对比与设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. Archive 过程真相 + owner-approved material/ref | authority 清晰，支持逐 slice fail-closed。 | 需要记录多类 binding 和状态。 | 采用。 |
| B. Archive 复制全域主数据 | 查询直接。 | 形成第二真相源并引入跨域写权。 | 不采用。 |
| C. 只保存 workspace 聚合快照 | 接入面少。 | projection 覆盖与 canonical authority 不足。 | 不采用。 |

## 6. 结构化中间产物

### 6.1 source-authority matrix

| 切片/材料类别 | canonical source authority | Archive 允许持有 | 明确禁止 |
|---|---|---|---|
| identity | `L1-identity` | owner-approved snapshot/ref、版本/fence/coverage | identity 业务真相和正文 |
| conversation | `L1-conversation` | approved snapshot/ref、coverage | 对话真相、未授权正文复制 |
| work/project | `L1-work` | 项目/WorkItem approved snapshot/ref、生命周期 decision ref | 修改 project 状态或成员真相 |
| process | `L1-process` | process/activity approved snapshot/ref、checkpoint 引用 | 过程运行真相和重放写权 |
| governance | `L1-governance` | policy/gate/decision/hold/delete/risk decision ref 或获准材料 | 治理裁决、保留期限和销毁权限 |
| artifact | `L1-artifact` | Artifact version/lineage/baseline approved material/ref | 通用 Artifact 正文与血缘真相 |
| workspace | `L1-workspace` | 明确标注的只读 projection snapshot/ref | 把 projection 升格为 L1 canonical truth |
| observability | `L4-observability` | 脱敏 audit/evidence material/ref | 观测后端真相和完整审计链声明 |

### 6.2 数据归属表

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| Archive request/job | 真相数据 | 归档请求与作业由本仓拥有正式真相。 | 从受理到终止/阻断形成本仓生命周期。 |
| Archive Bundle / manifest / slice inventory | 真相数据 | Bundle、manifest、切片清单和闭包结果由本仓拥有正式真相。 | 从创建、验证、封存到处置形成本仓生命周期。 |
| source binding / capture attempt / coverage | 真相数据 | 逐源绑定、采集尝试和覆盖状态由本仓拥有正式真相。 | 随采集、重试、失效或补偿变化。 |
| integrity / compatibility result | 真相数据 | 摘要、签名和版本兼容的验证结果由本仓拥有正式真相。 | 每次验证形成可追溯结果，不覆盖历史失败。 |
| storage location / tier / lifecycle execution | 真相数据 | 位置、层级、迁移、取回和治理执行记录由本仓拥有正式真相。 | 随外部执行反馈变化，未知状态保留。 |
| restore request / plan / handoff / outcome | 真相数据 | 恢复申请、计划、交接和逐项结果由本仓拥有正式真相。 | 从申请到逐 owner 终止/补偿闭合。 |
| L1 owner snapshot/export | 快照数据 | 上游正式真相不属于本仓，但可为归档消费保留 owner-approved 快照。 | 随来源版本和有效性变化，不形成业务真相生命周期。 |
| workspace projection snapshot | 快照数据 | workspace projection 不属于 canonical truth，本仓仅可保留明确标注的快照。 | 随上游 projection revision 变化，不升格为真相。 |
| source/decision/artifact/audit/handoff refs | 引用数据 | 本仓只保存对外部对象、正文或决定的引用关系，不拥有其正文真相。 | 随引用建立、变化或失效而变化。 |
| identity/conversation/work/process/governance/artifact 正文 | 禁止保存正文 | 各 owner 正文不属于本仓真相范围，本仓不得保存其正文。 | 不进入本仓生命周期。 |
| workspace/observability backend 与 SDK/client/cache 正文 | 禁止保存正文 | projection、观测后端和客户端缓存正文不属于本仓真相范围。 | 不进入本仓生命周期。 |

## 7. 能力级与跨能力停审

| 能力 | 数据承接 | 结果 |
|---|---|---|
| A1 | request/job | pass_with_blockers |
| A2 | source binding/capture/coverage；owner snapshot/ref | pass_with_blockers |
| A3 | Bundle/manifest/inventory/closure | pass_with_blockers |
| A4 | integrity/compatibility result | pass_with_blockers |
| A5 | storage/lifecycle execution；decision ref | pass_with_blockers |
| A6 | provenance/coverage/verification read material | pass_with_blockers |
| A7 | restore request/plan；authorization/source ref | pass_with_blockers |
| A8 | owner-specific material/ref/handoff | pass_with_blockers |
| A9 | outcome/retry/compensation | pass_with_blockers |

跨能力审计未发现同一数据被重复定义为不同 authority；workspace、artifact 和 observability 边界保持一致。

## 8. 回填草稿

Archive 只拥有归档过程与材料封装真相。各 L1 owner、Artifact、Workspace 和 Observability 的输入必须通过 source-authority matrix 标明 canonical owner、material/ref、版本/fence/coverage 和允许范围。上游业务事实只能作为获准快照或引用进入归档闭包，不转化为 Archive 的业务真相；禁止保存的正文不进入本仓生命周期。

## 9. 待确认事项

- `AR-UP-001/004/006/007/008` 继续影响 source material、正文/引用、schema evolution 与长期可读边界。
- Bundle 内“获准材料”与“禁止拥有业务正文”的精确封装规则留待架构/详细设计，并必须保持 authority 元数据。

## 10. 自检与进入下一步条件

- A1~A9 均有数据承接；Archive-owned 数据和外部 source 数据未混淆。
- 已明确四类数据：真相、快照、引用、禁止保存正文。
- 未写表结构、字段、索引、缓存、DDL 或事务。
- gate_status=`pass_with_blockers`，允许进入 Step 12。
