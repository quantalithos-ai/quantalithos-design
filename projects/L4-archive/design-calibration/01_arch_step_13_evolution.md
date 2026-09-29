# 01 架构 Step 13：演进路线

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 13。

### Step 内计划

- [x] 读取技术机制、方案取舍、横切约束与 blocker。
- [x] 回答当前阶段成立边界、可接受债务、后续演进项和触发条件。
- [x] 诊断旧阶段路线中的产品、功能、排期与无来源阈值。
- [x] 输出演进路线、触发条件、串行门禁与自检。

## 2. 问题回答、历史诊断与取舍

当前 01 做到 U1~U6、authority/所有权、依赖、交互、多轴失败和横切边界可稳定交给概要设计即足够；它不要求外部合同、实现或运行证据已经存在。可接受债务仅限未固化精确 schema、provider、算法、容量数值与 receiver 协议，因为保守 seam 已阻止越权正向声明。不可接受债务包括双真相、直接写 owner、配置创造 authority、未知变成功和错误依赖类型。

旧路线以 “Bundle baseline → hot/warm/cold → version schema → deep compliance” 排期式展开，并用 restore>2min 等无来源阈值触发。当前改为事实驱动的结构演进：先闭合 owner-safe capture/receiver，再闭合 integrity/storage/governance，最后在真实规模/兼容压力下演进介质和 schema。

取舍：阶段只描述架构主线何时需要改变，不承诺版本、日期、产品或实施完成。

## 3. 结构化中间产物

### 3.1 演进路线

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 架构安全骨架阶段（当前设计） | 固定 U1~U6、source authority、Bundle closure、多轴状态、外部 seam 与 owner handoff 红线 | 精确 export/schema/provider/receiver 合同未闭合；正向分支可保持 blocked | 无；先守住保守边界并交给 02 细化可落码结构 | 进入概要设计且需定义代码主体、对象和接口骨架 | 本阶段完成只代表架构可审查，不代表任何运行能力。 |
| Canonical capture 与 receiver 合同收敛阶段 | 让逐 owner snapshot/export/fence/coverage 与 restore receiver 形成可比较、可验证边界 | 某些 source/receiver 仍可 unsupported，不能假装全覆盖 | 扩展受支持 source/owner 集合和兼容转换边界 | owning projects 发布正式合同并通过一致性/无写权审查 | 优先改变 U2/U6 外部接缝，不改变业务 truth owner。 |
| Integrity、storage 与 governance 承载收敛阶段 | 闭合算法/key ref、storage commit/retrieval、retention/hold/delete decision execution | 尚无全介质/全策略覆盖；未支持项保持 blocked | 增加已获准验证机制、存储层级与治理动作类型 | `AR-UP-003~005` owner authority 与真实反馈合同闭合 | 改变 U4/U5 adapter 能力，不让 provider 定义核心语义。 |
| 长期兼容与规模演进阶段 | 在真实历史包、规模和恢复证据下演进 schema compatibility、材料布局与执行隔离 | 不保证任意旧版本、无限包规模或任意介质 | 兼容 adapter、分片/流式承载、独立扩缩与更多恢复粒度 | 真实 workload、迁移压力或 unsupported-version 分布证明当前结构不足 | 所有演进仍保留 manifest/authority/multi-axis/handoff 红线。 |

### 3.2 结构债务判断

| 债务 | 当前是否可接受 | 理由 / 上限 |
|---|---|---|
| exact source/export/receiver schema 未固化 | 可接受 | seam 和 unsupported/blocked 已明确；不能宣称已集成。 |
| storage/signature/KMS/compression 产品未选 | 可接受 | 外部能力角色已隔离；不能生成真实结果或配置默认值。 |
| workload、RTO、吞吐和容量数字缺失 | 可接受 | 结构要求进度/局部结果可见；不能承诺 SLA。 |
| Archive 与 owner 共用 truth 或 restore 直写 | 不可接受 | 直接打穿单一真相和 owner UoW。 |
| sealed/verified/accepted 推导 archived/restored | 不可接受 | 混淆本仓状态与外部业务状态。 |
| `L0-sdk` 依赖方向冲突被默认为 compile | 不可接受 | 可能造成服务端/client 反向依赖与循环，须保持 blocker。 |

### 3.3 触发条件

| 触发事实 | 首先变化的结构面 | 不得改变的红线 |
|---|---|---|
| owner 发布稳定 snapshot/export/fence/coverage | U2 adapter 与 compatibility | source authority 不转移 |
| receiver 发布 import/restore/handoff 与 probe/outcome | U6 handoff/reconciliation | Archive 不直接提交业务 truth |
| governance 发布正式 retention/hold/delete/risk decision | U5 action guard 与 execution | Archive 不解释或创建 policy |
| integrity/storage authority 与真实反馈合同闭合 | U4/U5 adapter 与状态映射 | key/secret/backend truth 不入核心 |
| 真实大包/慢源/高 fan-out 证据超过当前承载 | 运行单元隔离与材料处理形态 | 不用无来源阈值预设产品 |
| 旧 Bundle 出现已证实的兼容缺口 | compatibility adapter 与 manifest evolution | 不自动猜兼容或覆写历史材料 |

### 3.4 串行门禁

01 完成后必须停审；02 只能在用户新授权后开始。Layer 5 产品/分发并行窗口在 L4-archive 整套 00~07 完成并停审前不得因本架构完成而提前开启。演进表不授权实现、集成、测试、供应商采购或跨仓改写。

## 4. 回填、待确认与门禁

正式 §14 承接演进路线、债务判断和触发条件。没有排期、任务拆单或边界外愿望池。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 14 风险与待确认事项`。
