# 01 架构 Step 1：需求基线

## 1. Step 状态

状态：completed；SOP：架构 SOP Step 1；回填：正式 §1、§3、§16。模式：full-restart。

### Step 内计划

- [x] 读取项目台账、架构 SOP/规范、正式 00 与相关上游边界。
- [x] 从正式 00 提炼架构需求，不重写需求全文。
- [x] 标出直接影响边界、所有权、依赖和一致性的硬约束。
- [x] 将未闭合上游合同保留为风险和进入条件。
- [x] 完成回填草稿、自检与 Step 停审。

## 2. 本步输入

正式 `00-需求文档.md` §1~16；`00_requirements_calibration_flow.md`；全局依赖规则 §2/4.1/5/6；架构 SOP Step 1 和书写规范 §4.1/4.3/4.16；通用规范的三层门禁和真相源约束。专项上游复核入口见 flow 的来源复核表。

## 3. SOP 问题回答

| 问题 | 收束结论 | 状态 |
|---|---|---|
| 架构依赖哪些需求 | 只读跨域 read model、Personal/Project scope、owner-safe query/event/visibility 输入、可重建 projection、workspace-only local state、稳定 read surface。 | stable |
| 哪些已稳定 | workspace 不拥有任何上游 truth；query no-write；projection 不反写；source cursor/view revision/read cursor 分离；stale/partial/blocked/fail-closed 可区分。 | stable |
| 哪些待确认 | 各 owner 的 query、摘要、版本/水位、event family、replay/rebuild、visibility 撤销、scope ref 和下游 export 合同。 | pending/blocker |
| 影响边界的需求 | Personal 与 Project 只是 scope；不生成执行主语、授权 truth、业务命令或 archive truth。 | stable |
| 影响所有权的需求 | workspace 只拥有 partition、projection/generation/cursor/application record、coverage/gap、Inbox 派生状态及局部注意力状态。 | stable |
| 影响依赖/一致性的需求 | L0-core 为 compile candidate，L0-bus 为 event carrier；owner query/ref/event 为 runtime/event；外部失败必须保守降级。 | stable with pending seams |

## 4. 当前文档问题诊断

正式 01 尚不存在。README §二的“InboxItem visibility”需要拆分本地隐藏与 owner 决定；§二“项目动作仍然写回”描述的是外部产品调用 owner，不能视为 workspace 的写路由职责。draft/03 §1 的九个组成部分不是九个限界上下文；候选 FR 编号已被正式 00 的十项功能替换。

## 5. 改动前后对比

| 旧位置 | 旧口径 | 当前判断 | 原因与回填影响 |
|---|---|---|---|
| README §二 | Inbox visibility 未拆分 | 修改为 owner 决定消费 + local hide | 防止本地权限真相；约束 §3 |
| README §二 | 项目动作写回 | 外部 owner 入口责任，workspace 禁止代写 | 保护 no-write；约束 §4 |
| draft/03 §1 | 九组成部分/候选 FR | 后移实现划分，FR 只用正式 00 | 防止把模块当子域；约束 §6/16 |

## 6. 设计取舍

| 方案 | 收益 | 代价 | 结论 |
|---|---|---|---|
| 固定 owner 边界与失败姿态，exact seam 保留 blocker | 可继续收敛架构而不造合同 | 正向集成不能承诺 | 采用 |
| 把历史 draft 的候选协议视作已就绪输入 | 快速填满架构 | 违反全量重启和 owner 唯一性 | 拒绝 |

## 7. 结构化中间产物

### 7.1 需求基线清单

| 基线 ID | 架构相关需求结论 | 直接影响 |
|---|---|---|
| `AB-WS-01` | Workspace 是跨 L1 真相域的只读视图与投影局部状态仓。 | 系统边界、职责 |
| `AB-WS-02` | PersonalWorkspace 与 ProjectWorkspace 共用 read-model 框架，仅 scope 锚点和输入裁剪不同。 | 子域、容器 |
| `AB-WS-03` | Source query 必须 no-write，且不得共享 owner 内部表或跨仓事务。 | 依赖、交互 |
| `AB-WS-04` | Owner 正式事实、摘要/ref、版本、水位和 visibility 决定是外部输入。 | 数据所有权 |
| `AB-WS-05` | Projection 维护 source cursor、版本、幂等、重复、乱序、缺口、重放、重建和 generation cutover 语义。 | 一致性、演进 |
| `AB-WS-06` | Workspace 只允许写入绑定 principal/scope 的 local state。 | 职责、数据 |
| `AB-WS-07` | 读取结果必须携带 provenance、coverage 和 stale/partial/blocked/fail-closed 姿态。 | read surface、可观测 |
| `AB-WS-08` | Inbox 只由 owner 明示 attention input 派生，workspace 不自行推断业务优先级。 | 子域、边界 |
| `AB-WS-09` | 事件消费不等于 bus delivery truth；workspace 不拥有 ack/retry/dead-letter。 | 依赖、交互 |
| `AB-WS-10` | L1-workspace 不拥有 identity、conversation、work、process、governance、artifact、runtime、tools、capability、sandbox、archive、SDK/client/UI truth。 | 全部架构章节 |
| `AB-WS-11` | 未闭合上游合同不得被写成 ready、fresh 或可联调事实。 | 风险、演进 |

### 7.2 架构硬约束

1. 真相所有权单一：workspace 只能拥有自己的视图和局部状态，任何 projection、query 或维护动作不得反写 owning domain。
2. 读写分离：source query/read/export 是 no-write；local-state 写入必须绑定 principal、scope 和 workspace revision 语境。
3. 依赖分类不可混淆：`L0-core` 仅作 compile candidate；`L0-bus` 提供事件协作主干；L1 owner 输入是 runtime/ref/event；SDK、产品、sync、archive 是下游 adapter/ref。
4. 安全默认拒绝：visibility、membership 或治理决定缺失、冲突、撤销或过期时，受影响数据 fail-closed，不默认展示。
5. 一致性可解释：source cursor、source version/watermark、view revision、read cursor、generation 不得互相替代。
6. 失败可见：缺口、乱序、重复、失效、重建和不可用必须形成可查询状态，不能静默跳过或以 stale 冒充 fresh。
7. 不越权建模：不得把 workspace 变成业务命令入口、授权中心、执行主语、正文仓或 archive 接收方。

### 7.3 未关闭需求风险

| 风险 | 影响 | 在架构层的保守处理 | 解锁条件 |
|---|---|---|---|
| `WS-UP-001` query/summary/version 未统一 | 无法固化字段和 fresh barrier | 只定义 owner-safe query seam 与 partial/blocked | 各 owner 正式 query 与 watermark 合同 |
| `WS-UP-002` event/cursor/replay 未闭合 | 无法承诺实时或任意重放 | 保留 event adapter、gap、rebuild 状态 | owner event/replay/baseline 合同 |
| `WS-UP-003` visibility owning chain 未统一 | 受影响内容不得展示 | fail-closed，消费正式决定 | 决定来源、撤销、时效合同 |
| `WS-UP-004` attention input 未对齐 | Inbox 不可自行推断 | 只接受明示 input | owner attention 生命周期 |
| `WS-UP-005` scope safe ref 未闭合 | scope key 与错误语义待定 | scope 只作架构概念，不固化协议 | identity/work safe ref/query |
| `WS-UP-006` downstream read/export 未闭合 | 不定义 SDK/sync/archive 协议 | 提供稳定 read-model 边界概念 | 下游消费合同 |
| `WS-UP-007` workspace Core type 是否进 L0-core 未确认 | 不应复制共享 schema | 以 compile candidate 与 pending seam 表述 | L0-core 评审决定 |
| `WS-UP-008` personal execution subject 未定义 | workspace 不得补执行语义 | 明确非职责与下游 blocker | owning execution subject 定义 |

### 7.4 旧材料污染审计

旧 README、ADR 草案和 draft 仅作为历史输入。未继承以下危险倾向：把 workspace 写成 member/authorization truth、把 inbox 当 notification truth、把 archive 当当前 owner、把 bus cursor 当 projection cursor、把 SDK cache 当 read model，或把未闭合协议字段写成正式架构事实。

## 8. 回填草稿

正式架构的“与上游关系”“约束条件”“需求追溯”将引用本文件；其余章节只能承接这里已标记 `stable` 的结论，`pending/blocker` 必须进入风险或待确认，不得转换为确定 schema。

复杂度：本 Step 只有基线筛选，不拆架构单元；具体单元在 Step 5 推导。正式 §1 使用正式 00 的来源表及 flow 来源复核表，§3 使用 7.2，§16 使用 7.1 的追溯锚点。

## 9. 待确认事项

`WS-UP-001~008` 见 7.3。无新增 owner 合同；不把 seed owner 或 replay executor 默认归于 workspace。

## 10. 进入下一步条件

| 检查 | 结果 |
|---|---|
| 需求基线来自正式 00 和已读上游 | pass |
| 未重写需求全文或滑入实现 | pass |
| 所有 blocker 有影响和解锁条件 | pass |
| truth / projection / ref / local state 已区分 | pass |
| 可进入 Step 2 | pass_with_upstream_blockers |

`step_status = completed / pass_with_upstream_blockers / stop_review`
