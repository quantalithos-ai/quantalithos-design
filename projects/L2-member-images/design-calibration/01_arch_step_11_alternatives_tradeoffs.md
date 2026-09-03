# Step 11. 备选方案与取舍

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `alternatives_tradeoffs` | pass | 当前主线与 5 条路径级替代方案已在同一框架比较;采用 / 不采用理由和得失明确,未混入产品横评或边界外职责 | 进入 Step 12 横切关注点 | `01_arch_step_02_goals_constraints.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_10_technology_choices.md` |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 2~10、架构 SOP Step 11 与书写规范 §4.12。
- [x] 固定当前主线方案的路径级描述。
- [x] 只选择仍在本仓职责范围内、会改变整体结构的替代路径。
- [x] 为每条路径写清解决问题、收益、代价和当前结论。
- [x] 单列已被前文边界排除、不得重新包装为方案的方向。
- [x] 区分“不采用”和“未来条件具备后需重开决策”。
- [x] 排除产品、协议、局部实现和愿望池式比较。
- [x] 核对开放项没有因方案比较被默认选择或关闭。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 2 | AG-MI-001~008、IC-MI-001~011、current / conditional / future |
| Step 3 | 职责范围与不得重新打开的 owner 边界 |
| Step 5~9 | 四核心 + 一支撑、运行承载、依赖、数据和交互主线 |
| Step 10 | TM-MI-001~010、产品 deferred 和机制代价 |
| Draft / historical audit | CI-centric、九组件、六节点 / pipeline 等候选线索;只作比较输入 |
| MI-UP / Q | Event / consumer / Artifact / product 等路径上限 |

## 3. SOP 问题回答

1. 这个仓有哪些主要可选架构方案?

   回答:当前主线是“独立镜像域控制面 + 分阶段领域判定 + 外部 adapter / ref”。相邻替代路径包括纯声明资产仓 + 外部 pipeline、单一 lifecycle state machine、每阶段独立服务、consumer-driven on-demand build、完整 event-sourced control plane。

2. 为什么选择当前方案?

   回答:它是唯一能同时承载 definition / revision、attempt / candidate、eligibility、availability / entry 及 history,又不把 CI、registry、Artifact、consumer 或 live state 变成 truth owner 的路径;并能在 exact seams 未闭口时局部 fail closed 而非伪成功或全局停摆。

3. 被放弃方案有什么优点?

   回答:纯声明仓最简单;单一状态机对操作者直观;每阶段独立服务隔离和伸缩明确;on-demand build 减少预构建库存;完整事件溯源强化重放与历史表达。这些均是真实收益。

4. 为什么仍不采用?

   回答:它们分别牺牲镜像域事实完整性、阶段 owner / failure 隔离、P0 运维与一致性成本、ADR nightly / pinned entry 语义或在 event authority / workload 未成熟时提前锁范式。

5. 当前选择牺牲了什么、换来了什么?

   回答:牺牲了纯文件仓的简单、单布尔状态的易读、强拆服务的隔离、即时构建的低库存和完整 ES 的原生重放;换来 owner 唯一、阶段失败可解释、部署可渐进、供给可预先验证、开放 seam 可保守推进和后续技术载体可替换。

## 4. 当前材料问题诊断

| 候选方案表达 | 问题 | 当前处理 |
|---|---|---|
| “CI 产出仓”作为唯一主线 | 无法拥有 eligibility / availability / entry history | 降为纯声明 + external pipeline 替代路径,不采用 |
| Draft 九组件 + 六层职责 | 实施粒度混入架构路径 | 不作为整体替代;其有用责任已被 Step 5~7 重推导 |
| 六节点 lifecycle | 将 revision / availability 放在构建前后多处 | 当前用四核心单向阶段,不直接继承六节点结构 |
| 每个 BC 一个 microservice | 语义边界机械映射部署 | 作为 per-stage services 路径比较,当前不采用 |
| Publish / notify / launch event chain | 无 outbound authority且吞并 consumer truth | 不构成当前有效方案 |
| OCI / registry / builder 产品组合比较 | 产品级选择,不是路径级架构 | 不进入本 Step |

## 5. 改动前后对比

| 维度 | 分散候选取舍 | 当前路径级取舍 |
|---|---|---|
| 主线 | CI pipeline、九组件、六节点混排 | 独立控制面 + staged decisions + external seams |
| 比较单位 | 工具、对象、module 数量 | 会改变 truth、failure、deployment 或 consistency 的结构路径 |
| 收益表达 | 当前方案单边更好 | 每个 rejected path 均保留真实收益 |
| 代价表达 | “更复杂”泛化 | 对 owner、状态、运维、预构建和演进成本具体说明 |
| Future | 与 current 混排 | 只有正式触发条件出现才重开,不形成 readiness |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只比较当前方案与 CI pipeline | 简短 | 遗漏状态组织、部署和构建时机等关键路径 | 不采用 |
| 把所有可能技术与 future 能力列为方案 | 看似完整 | 变成产品横评和愿望池 | 不采用 |
| 比较 1 条主线 + 5 条结构性相邻路径 | 覆盖 truth / consistency / deployment / timing / history 取舍 | 表较长 | 采用 |
| 将 Artifact-centric / container-centric 重新列为候选 | 可显示边界意识 | 前文已明确排除,不是有效本仓方案 | 不采用;只列边界外方向 |

## 7. 结构化中间产物

### 7.1 当前主线方案

```text
Independent image-domain control plane
  + controlled definition / pinned assembly baseline
  + staged candidate / eligibility / availability decisions
  + immutable digest / provenance identity
  + append / supersede / explicit transition history
  + inward runtime / event / ref / adapter / fake seams
  + synchronous local decisions + background external handoff
  + separate image / Artifact / consumer states
```

这里的 control plane 是架构责任描述,不代表已选择常驻服务、数据库、queue、CI 或 registry 产品。它可以由较薄的运行承载实现,但必须保存前序章节收敛的 truth、failure 和 history 语义。

### 7.2 方案路径比较

| 方案路径 | 解决的问题 | 主要收益 | 主要代价 / 约束 | 当前结论 | 说明 |
|---|---|---|---|---|---|
| 独立镜像域控制面 + staged decisions + external seams | 多 owner 静态输入如何转化为可追溯、可供给且不串仓的镜像 truth。 | Owner 唯一;各阶段 failure / rollback 可解释;产品可替换;pending 可局部挂起。 | 需要显式 contexts、refs、snapshots、gaps、history 和 adapter parity。 | 采用 | 唯一同时满足 AG / IC、五节点需求和跨仓裁剪的主线。 |
| 纯声明资产仓 + 外部 pipeline 作为运行事实来源 | 以最小控制面维护 manifests / build declarations。 | 仓结构简单;Git review 直观;运行服务需求较低。 | Attempt、external outcome、eligibility、availability / rollback / consumer gap 会散落在 CI / registry / scripts。 | 不采用 | 声明文件可成为实现载体之一,但不能替代完整镜像域 truth。 |
| 单一 image lifecycle state machine | 用一个状态串联 definition、build、gate、publish 和 retire。 | 操作者易读;状态查询简单;顺序约束直观。 | Adapter success 容易自动推进;Artifact / consumer gap 污染 local state;partial / unknown 难分层。 | 不采用 | 四个核心 decision contexts 必须分别成立,不压成一个枚举。 |
| 每个阶段独立部署服务 | 通过服务边界隔离 definition、build、qualification 和 supply。 | 故障隔离、独立伸缩和 ownership 显性。 | 无 workload 依据;引入分布式 consistency、operation、contract 和 recovery 成本。 | 不采用,current | 语义边界保留,部署初期允许同置;正式测量出现后再重开。 |
| Consumer-driven on-demand build / resolve | 只在实例化请求到来时构建或选择镜像。 | 减少预构建库存;低频 variant 不占长期供给资源。 | 违反 nightly 与预构建方向;实例化受长时 build / gate 影响;无法保证预先 pinned entry。 | 不采用 | 可作为未来 cache-miss enhancement 研究,不能替代 current core。 |
| 完整 event-sourced control plane | 以事件日志作为 revision、attempt、eligibility 和 availability 的主要演进载体。 | 历史重放、审计和派生重建表达强。 | 需要稳定 event taxonomy / ordering / replay contract;MI-UP-005/009 未闭口且 P0 复杂度高。 | 不采用,current | 采用 append / supersede history semantics,不锁完整 ES。 |

### 7.3 不进入正式比较的方向

| 方向 | 不进入原因 | 正确边界 |
|---|---|---|
| Artifact-centric image lifecycle | Step 3 / 8 已固定 Artifact 通用 truth 外置。 | Image eligibility / availability 与 Artifact ref / gap 分域。 |
| Member Service / container-centric supply truth | Container lifecycle 和 confirmation 明确不归本仓。 | 本仓提供 pinned entry,consumer 自主管理运行。 |
| Method Library-centric build ownership | Method Library 拥有 Role / mapping,不拥有 image build / supply truth。 | Runtime + ref 消费 mapping。 |
| Registry-as-source-of-truth | Registry 是技术 adapter / ref owner,不是 image-domain owner。 | Immutable ref 输入 + local availability history。 |
| Governance / scanner / signer owns eligibility | 外部 authority / backend 提供 gate set / safe conclusion,不拥有 image eligibility。 | BC-MI-03 基于正式输入形成 local eligibility。 |
| Product / marketplace owns image catalog | 产品和生态层不得反向定义镜像供给。 | 未来只读消费或 listing 边界另行设计。 |

### 7.4 轻量取舍对照

| 当前方案换来 | 当前方案牺牲 |
|---|---|
| 完整镜像域 truth 与明确 owner | 纯声明仓的最小复杂度 |
| Candidate / eligibility / availability 独立失败和恢复 | 单一状态机的表面简洁 |
| 初期可同部署、后续按依据拆分 | 一开始强隔离 / 独立伸缩的直接性 |
| Nightly 预构建与下游稳定 pinned entry | On-demand build 的低库存潜力 |
| History semantics 不依赖 event product | 完整 ES 的原生 replay 能力 |
| Product-neutral adapters 与开放 seam fail-closed | 直接绑定具体工具的短期实现速度 |

### 7.5 方案边界说明

本章只比较会改变镜像域 truth、阶段边界、部署粒度、构建时机或历史机制的相邻路径。具体 image format、language、database、CI、builder、registry、scanner、signer、transport 和 schema 属于实现载体,不构成当前架构路径。Artifact、container、method、registry 或 product 主导的方向已违反前序 owner 边界,因此只作为排除说明而非有效候选。Future path 只有在正式 authority、workload 和 measurement 输入出现后才能重开,不能从本表推导已规划 readiness。

## 8. 回填草稿

正式 01 §12 回填 §7.1 主线、§7.2 路径比较、§7.3 排除方向、§7.4 得失和 §7.5 边界说明。正式章不重复 Step 10 每个单项机制的论证。

## 9. 待确认事项

- 本 Step 不新增开放编号。
- Per-stage independent deployment 只有正式 workload / isolation / recovery measurement 才能重开。
- Full event sourcing 需 MI-UP-005 / 009 authority、event taxonomy 与 replay requirement 才能重开。
- On-demand build 若未来提出,必须重新审查 ADR-0005、instantiation latency 和 pinned entry 需求,不能作为当前 fallback。
- Q-MI-001~004 和 MI-UP-001~009 均未因路径比较获得选择或 closure。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 当前主线是否明确 | pass |
| 替代路径是否均为结构级且有真实收益 / 代价 | pass |
| 采用 / 不采用判断是否有前序约束依据 | pass |
| 边界外事项是否未被包装成有效方案 | pass |
| 是否无产品横评、局部实现或 readiness 推导 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 12,不得跳到 Step 13 或修改正式 01。
