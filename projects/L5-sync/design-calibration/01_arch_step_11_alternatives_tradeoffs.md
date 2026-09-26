# L5-sync 架构 Step 11 · 备选方案与取舍

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 11 |
| 输入 | Step 2 目标/约束、Step 10 技术机制、Step 3~9 边界结论 |
| 回填章节 | 正式 01 §12 |
| 下一步 | Step 12：横切关注点 |

## 2. Step 内计划

- [x] 只比较架构层有效替代路径，不比较命令语法或库实现变体。
- [x] 围绕 ownership、依赖、数据、一致性、恢复、治理和演进成本比较。
- [x] 明确采用路径得到什么、牺牲什么、为何不采用其他路径。
- [x] 将边界外事项排除出“被放弃方案”。
- [x] 完成跨方案取舍与核心约束审计。

## 3. 本步输入

| 输入 | 说明 |
|---|---|
| Step 2 | 不可变约束和阶段取舍 |
| Step 3~5 | 职责、系统上下文、五个内部上下文 |
| Step 7~10 | 依赖、数据、通信、技术机制 |
| 历史 README/01 | 仅提供“纯 Git/平台同步/CLI-GUI”候选线索 |

## 4. SOP 问题回答

### 4.1 主要架构替代路径是什么？

有效候选有三类：

- **受控本地桥（当前主线）**：本地客户端边界，owner seam + Git/fs adapter，local transition/checkpoint，handoff/probe 分层。
- **纯 Git 脚本/插件集合**：以 Git 命令为中心，不建立独立 local sync truth。
- **平台同步服务/远程代理**：由远端服务管理工作区、版本和回流，本地只作为薄客户端。

另一个可讨论的“事件驱动自动同步”不是独立有效主线，因为它直接违反显式选择、dirty protection 和人工裁决约束，只能作为被排除方向。

### 4.2 为什么选择当前方案？

当前方案同时保留开发者熟悉的本地 Git/filesystem、平台正式 owner 的治理边界和本地操作可恢复性；它可以把危险动作关在门禁后，同时不把 Project/Artifact/Review/Archive/Git remote truth 集中到 Sync。

### 4.3 被放弃方案的优点是什么？

纯 Git 脚本实现快、侵入低；远程代理可以集中控制版本、权限和审计；事件驱动自动同步可以减少显式操作。它们分别牺牲了 local provenance、离线/本地修改保护、平台 owner 单一真相或人工裁决安全。

### 4.4 当前选择牺牲和换取了什么？

牺牲：实现更复杂、状态分层更多、部分场景必须 pending/manual、不能用 Git push 的便利路径替代 handoff。换取：不覆盖用户修改、不绕过 Review Gate、能解释 unknown outcome、可恢复并能在审计中区分 Git/transport/decision。

## 5. 当前文档问题诊断

| 历史方向 | 问题 | 当前处理 |
|---|---|---|
| “Rust CLI-first + Tauri” | 是实现/入口选择，不是架构替代路径本身 | 抽象到本地客户端形态，不进入比较表定论 |
| “纯 Git facade” | 没有 local cursor/provenance/handoff truth | 作为架构备选 B 比较并放弃 |
| “平台代码同步服务” | 可能吞并 Workspace/Artifact/Review owner | 作为备选 C 比较并放弃 |
| “LFS/浅克隆” | 是规模优化而非架构路径 | 移到风险/演进触发，不进入方案对比 |

## 6. 设计取舍

### 6.1 方案路径比较表

| 维度 | A 受控本地桥（采用） | B 纯 Git 脚本/插件 | C 远程平台同步服务 |
|---|---|---|---|
| 本地修改保护 | 强：独立 dirty/path/conflict gate | 中：依赖脚本纪律 | 弱/复杂：远端与本地状态需双向协调 |
| 平台 owner 边界 | 清楚：经 SDK/handoff seam | 容易绕过：Git remote 可能成为事实入口 | 容易集中：服务吞并多个 owner |
| provenance/cursor | 本地有独立可回链语义 | 弱，常退化为 commit/log | 强但可能成为第二平台 truth |
| 恢复/unknown | checkpoint + probe 可表达 | 依赖脚本和人工日志 | 可集中但副作用/网络面更大 |
| Review Gate | handoff 明确分层 | 容易误解 Git push | 可以集中，但需与 Governance 精确接缝 |
| 开发者心智 | 接近本地工作流 | 最接近 Git | 需要远端工作区模型 |
| 演进成本 | 中，adapter 可替换 | 初期低、后期补边界成本高 | 高，远端服务与多个 owner 耦合 |
| 取舍 | 采用 | 放弃 | 放弃当前主线 |

### 6.2 当前主线方案

采用 A：Sync 是本地受控桥，不是 VCS、远程工作区服务或全能平台 facade。核心由 local operation truth、owner formal seam、受限 Git/fs edge、checkpoint/recovery、review handoff/provenance 组成；所有技术实现必须服从这些边界。

### 6.3 不作为备选的边界外方向

Project/Artifact/Workspace/Archive 内部实现、Git server、统一认证中心、自动 merge/rebase/push、GUI 产品、LFS backend、共享数据库和任意事件总线均不是本 Step 的可选架构路径；它们要么属于其他 owner，要么违反已确认红线。

### 6.4 取舍结论

| 取舍 | 得到 | 失去/成本 |
|---|---|---|
| 本地真相不等同平台真相 | 审计清晰、owner 单一 | 需要多层 refs/snapshots 和用户理解成本 |
| 不自动解决冲突/unknown | 安全、可恢复、人工可控 | 操作可能暂停，体验不如盲重试 |
| handoff 不等于 accepted | Governance 不被绕过 | 需要额外 probe/decision read |
| 技术栈后置 | 避免历史方案锁定 | 后续概要设计需要重新选择实现承载 |

## 7. 回填草稿

正式 §12 回填方案路径比较、当前主线和取舍结论；只保留架构理由，不搬入历史诊断或实现工具细节。

## 8. 待确认事项

| 待确认项 | 当前状态 |
|---|---|
| 远程代理是否未来作为产品增强 | 不影响当前主线；需新需求/ADR，当前不进入演进承诺 |
| 事件提示是否可作为外围优化 | 仅在正式 owner/SDK event contract 成立后重评 |
| LFS/浅克隆是否影响主线边界 | 只作为 materialization adapter 选项，不能改变安全 gate |

## 9. 自检与进入下一步条件

- [x] 比较的是架构路径而非库/命令变体。
- [x] 每个被放弃方案均有边界、数据、一致性或演进理由。
- [x] 当前主线与 Step 2、7、8、9、10 无冲突。
- [x] 边界外事项未伪装成“放弃的本仓方案”。

`gate_status = pass_with_upstream_blockers`；可进入 Step 12。
