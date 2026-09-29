# 01 架构 Step 11：备选方案与取舍

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 11。

### Step 内计划

- [x] 读取目标、约束与 Step 10 机制。
- [x] 识别与当前主线构成结构性替代的路径。
- [x] 诊断旧“bundle-first/各仓冷存/DB snapshot”的单边对比。
- [x] 输出路径比较、取舍边界和自检。

## 2. 问题回答、诊断与判断框架

当前主线是“中央 Archive-owned manifest/closure + authority-bound owner material/ref + 多轴验证/承载状态 + owner-specific restore handoff”。有效替代路径必须仍守住 owner truth 和无跨域写权，不能把已经被约束排除的“Archive 接管业务 truth/直接写库”伪装候选。

旧比较赞美 bundle-first、贬低各仓冷存和 DB snapshot，却没有区分协调边界、材料保管、source authority 和恢复写权。当前以 authority、闭包可证、耦合、失败可见与演进成本共同评价。

## 3. 结构化中间产物

### 3.1 方案路径比较

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 中央 manifest/closure，材料可由获准 snapshot 或 ref 构成 | 跨域包边界、来源和覆盖如何统一可审查 | 一个可验证声明面，同时不要求 Archive 拥有所有正文 | 需逐 source authority、材料定位、兼容与长期引用治理 | 采用 | 当前主线；中央的是包声明和执行 truth，不是业务 truth。 |
| 各 owner 独立归档且无中央 Bundle | 减少中央协调 | owner 自主、局部实现简单 | 无统一请求范围、跨源 closure、恢复计划和总 provenance | 不采用 | 不能承接 F-AR-003/006/007，但 owner export 仍是主线组成。 |
| Archive 复制所有 owner 正文形成自足包 | 减少恢复时对外部引用依赖 | 历史材料更自包含 | 授权、容量、敏感正文、双真相和 schema 耦合显著 | 不采用为默认 | 只有 owner 明确批准的 snapshot material 才可入包，不能默认全复制。 |
| Reference-first 薄 Bundle，仅保存外部引用 | 降低材料复制与存储成本 | authority 清晰、包小 | 长期引用可能失效，无法保证离线验证/恢复所需内容闭包 | 不采用为唯一模式 | ref 可作为条目类型，但不得把可寻址性等于内容可恢复。 |
| 同步跨 owner capture/restore 全局闭环 | 追求即时全局结果 | 表面状态简单 | 高耦合、长事务、局部失败不可控且需要跨域写权 | 不采用 | 违背 per-source/per-owner 一致性边界。 |
| 后台逐 source/item 收敛并保留 partial/unknown | 承接异构外部依赖与长时副作用 | 可恢复、可解释、无需全局事务 | 状态与核对/补偿复杂度增加 | 采用 | 与 U2/U5/U6 及多轴状态一致。 |
| Archive 恢复协调器直接修改所有 owner | 获得单点操作体验 | 表面像“一键恢复” | 打穿 owner UoW、授权与冲突处理，Bundle 变成通用写权 | 不构成合法候选 | 已被不可变约束排除，不进入未来观察。 |

### 3.2 当前取舍摘要

| 当前方案得到什么 | 当前方案牺牲什么 |
|---|---|
| 逐源 authority 和可审查闭包 | 无法假装单一全局快照或瞬时完成 |
| owner truth 与恢复写权不转移 | receiver 合同和局部结果管理更复杂 |
| 外部产品可替换且未知可见 | 不能预先承诺算法、供应商、RTO/SLA |
| partial/commit-unknown 可恢复 | 状态组合与运维核对成本上升 |

### 3.3 方案边界说明

数据库、对象存储、队列、加密或压缩产品的横评不属于本章，它们不改变当前边界主线且 authority 未闭合。UI、SDK cache、policy engine、observability backend、runtime 和 sandbox 已被职责边界排除，也不作为备选。未来若 source contract 支持自包含材料与稳定引用的不同组合，应仍在中央 manifest/closure 主线内演进，而不是重新分配业务 truth owner。

## 4. 回填、待确认与门禁

正式 §12 承接方案表、取舍摘要和边界说明。每条有效路径同时写明收益和代价，没有把产品比较、局部实现或边界外事项作为选择。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 12 横切关注点`。
