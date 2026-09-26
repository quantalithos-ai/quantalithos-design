# L5-sync 架构 Step 4 · 系统边界与上下文

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 4 |
| 输入 | Step 1~3、专项上游正式架构文档、全局依赖规则 |
| 回填章节 | 正式 01 §5 |
| 下一步 | Step 5：限界上下文与子域划分 |

## 2. Step 内计划

- [x] 确认 L5-sync 在全局系统中的正式位置。
- [x] 区分正式上下文对象、输入面、输出面和外部边界；不画角色、接口名或实现组件。
- [x] 画出符合规范的系统上下文 ASCII 图并附图示说明。
- [x] 为每个上游/下游失效定义 blocked/pending/unknown/fail-closed 口径。
- [x] 完成上下文关系停审和跨边界审计。

## 3. 本步输入

| 输入 | 承接 |
|---|---|
| Step 3 职责边界 | 确认哪些对象属于外部 owner，哪些是本仓本地语义 |
| `L0-sdk` 正式 01 | 平台能力访问的正式 SDK 边界 |
| `L1-work` / `L1-identity` | Project、ProjectMember、principal 和姿态来源 |
| `L1-artifact` | Artifact/version/source/baseline 语义边界 |
| `L1-workspace` | Workspace projection 与本地视图的分离 |
| `L1-governance` | Review Gate、Decision 和 policy 边界 |
| `L4-archive` / `L4-observability` | archive posture、诊断/审计消费边界 |
| 全局依赖裁剪规则 | L5 产品层对 SDK 和 L1/L4 能力的消费方向 |

## 4. SOP 问题回答

### 4.1 这个仓在全局系统中的位置是什么？

`L5-sync` 位于 Layer 5 产品/分发窗口，是面向本地开发工作区的受控同步入口。它通过 `L0-sdk` 消费正式能力边界，接触本地 Git/filesystem 和工作区 metadata，并把候选回流交给 Governance；它不是 L1 业务真相服务、Workspace projection 服务、Archive 服务或 Git remote 服务。

### 4.2 正式上游和输入面是什么？

输入面包括：身份/调用主体与项目访问资格、Project/ProjectMember posture、Artifact 或 Workspace 提供的来源版本和 materialization 资格、Review handoff 资格与协议状态、Archive posture、SDK shared contract，以及本地 Git/filesystem 的观察结果和用户显式选择。上游内容必须通过正式 owner/SDK seam 进入，不能用缓存或 remote 推测替代。

### 4.3 正式下游和输出面是什么？

输出面包括：本地 working-copy 的受控应用结果、local session/status/conflict/recovery 诊断、候选 handoff attempt 和 transport/probe 引用、对用户展示的 archive posture，以及面向 SDK/CLI/GUI 入口的 bounded status。输出不包含外部正文、Review decision、Artifact/Baseline 或 Workspace projection 写入。

### 4.4 依赖失效时如何降级？

- 身份、Project 权限或 posture 不可确认：`blocked / fail-closed`，不 materialize、不 handoff。
- Artifact/Workspace source、版本水位、comparator 或 mapping 不可确认：`needs-action / pending`，不推进 pull。
- Git/filesystem dirty、untracked、路径保护或 metadata 完整性不明：停止 apply，保留现状并要求人工处理。
- Review handoff call unknown：进入 probe/finalize 或 manual review，不重复副作用。
- Archive/Observability 不可用：只降级展示相应 posture/diagnostic，不改变本地或平台真相。

## 5. 当前文档问题诊断

| 历史问题 | 影响 | 当前修正 |
|---|---|---|
| 旧图把开发者角色、SDK、Artifact/Work/Governance 和 Git 混成一张功能图 | 角色、上下文和内部模块混层 | 图只保留正式系统/边界对象，角色留给需求层 |
| 旧文档把 `sdk -> artifact/work/governance` 写成可直接调用的固定服务 | 误锁 API 和 owner surface | 统一写为 `L0-sdk` 正式能力边界，具体 surface pending |
| 旧文档把 local Git workspace 当平台代码真相 | 破坏 Artifact/Workspace ownership | 分离 source material 与 local working copy |
| 旧文档默认 Archive/Review 成功可以推进 | 可能产生危险副作用 | 明确 blocked/unknown/fail-closed 降级 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. 以命令/角色作为上下文节点 | 不采用 | 命令和角色不是正式系统上下文对象。 |
| B. 以 owner 能力边界、本地工作区和 handoff 边界建上下文 | 采用 | 与需求所有权和全局依赖规则一致。 |
| C. 以 Git remote 为中心反推平台边界 | 不采用 | Git remote 不是平台 source 或 Review truth。 |

## 7. 结构化中间产物

### 7.1 系统上下文图

```text
                         +----------------------+
                         | L1-identity / L1-work|
                         | principal, project,  |
                         | posture, permission  |
                         +----------+-----------+
                                    |
                                    | formal owner checks
                                    v
+------------------+      +--------+---------+      +----------------------+
| L1-artifact /    |      |                  |      | L1-governance        |
| L1-workspace     +----->+    L5-sync       +----->+ Review Gate / Decision|
| source/version/  |      | controlled local |      | handoff boundary     |
| projection view  |      | sync entry       |      +----------------------+
+------------------+      +---+----------+---+
                              |          |
                              |          | posture / diagnostics
                              v          v
                    +---------+--+   +---+----------------+
                    | local Git/ |   | L4-archive /       |
                    | filesystem |   | L4-observability   |
                    | working copy|   | consumption edges |
                    +------------+   +--------------------+
```

图示说明：

1. 图只表达 L5-sync 与正式 owner/边界的上下文关系，不表达角色、API、事件名或内部模块。
2. Artifact/Workspace 输入提供来源资格或版本/投影视图；它们仍拥有各自真相。
3. Governance 只接收 handoff 边界并拥有 Review decision；本地 Git/filesystem 只代表工作区事实。
4. Archive/Observability 是姿态/诊断消费边界，不反向定义同步成功。

### 7.2 上下游与输入/输出面表

| 上下文 | 方向 | 输入/输出面 | L5-sync 处理 |
|---|---|---|---|
| `L0-sdk` | 输入 | 能力访问、错误、trace、metadata、版本语义 | 编译期/运行期边界由 SDK 合同决定，不调用私有实现 |
| `L1-identity` | 输入 | principal/actor 引用与身份状态 | 只消费资格语境，不拥有身份真相 |
| `L1-work` | 输入/协作 | Project、ProjectMember、访问动作、项目 posture | 只读取正式判断，不本地裁决 |
| `L1-artifact` | 输入/协作 | Artifact/version/source/baseline 引用和 materialization 资格 | 只绑定/应用可验证来源，不存 Artifact 正文 |
| `L1-workspace` | 输入/协作 | Workspace projection/version/visibility 查询 | 不把 local working copy 写成 projection |
| `L1-governance` | 输出/输入 | Review handoff、ACK/probe/decision refs | 只发起候选交接，decision 由 governance 拥有 |
| `L4-archive` | 输入/输出 | archived posture、restore/archive handoff ref | 只展示/交接姿态，不拥有 package |
| `L4-observability` | 输出/消费 | bounded diagnostics、audit/telemetry context | 观测不决定业务成功 |
| local Git/filesystem | 输入/输出 | dirty/untracked/HEAD/path state、受控 materialize | 适配器仅白名单观察/锁/apply |
| user-selected local target | 输入 | 显式路径、版本/source、operation | 不以默认或 latest 猜测替代 |

### 7.3 边界说明

系统边界的中心不是“代码仓库同步”，而是“由正式 owner 授权、以本地工作区为目标、可审计且可暂停的同步操作”。`L5-sync` 与任何外部 owner 的交互都必须表现为能力边界、引用或状态消费；上下文图中的箭头不代表调用顺序，也不表示 Sync 获得外部数据所有权。

## 8. 上下文停审与跨边界审计

| 审计项 | 结果 |
|---|---|
| 角色是否误画为系统上下文 | pass；角色和用户故事留在 00 |
| 接口名/事件名是否提前锁定 | pass；只写能力边界 |
| Project/Artifact/Review/Workspace/Archive/Git remote ownership 是否清楚 | pass |
| 本地 working copy 是否被误写成 Workspace projection | pass；明确分离 |
| 失效是否有降级口径 | pass；blocked/pending/unknown/fail-closed 已覆盖 |
| 上游 blocker 是否被伪造关闭 | pass；`SYNC-UP-001~010` 继续开放 |

## 9. 回填草稿

正式 §5 回填 7.1 的上下文图、7.2 的输入/输出面表和 7.3 的边界说明；不回填本步历史诊断与协议细节。

## 10. 待确认事项

| 待确认项 | 备选方案 | 当前推荐 | 状态 |
|---|---|---|---|
| Artifact/Workspace source 角色 | A. Artifact 固定 source；B. Workspace 固定 source；C. owner-neutral resolver，按正式合同选择 | C | pending `SYNC-UP-002` |
| Archive 姿态消费 | A. 本地复制 archive truth；B. 只读 posture/ref；C. 不显示 | B | 已确认边界，精确 surface pending |
| Observability 关系 | A. 决定成功；B. bounded 诊断/审计消费；C. 无关系 | B | 已确认 |

## 11. 自检与进入下一步条件

- [x] 上下文图、表和说明遵守不画角色/接口/内部组件规则。
- [x] 上游、下游和本地目标均有正式边界语义。
- [x] 依赖失效降级口径明确，未用缓存替代 owner。
- [x] 上下文停审无 owner 重叠；可进入内部限界上下文划分。

`gate_status = pass_with_upstream_blockers`。
