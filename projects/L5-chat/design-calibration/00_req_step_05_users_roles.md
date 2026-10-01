## Step 5. 用户与角色

### 1. Step 状态

- 状态：`[x] 已确认`
- 对应 SOP：`standards/document/需求文档讨论流程_SOP.md` Step 5
- 回填章节：正式 `00-需求文档.md` §5「用户与角色」
- 当前模块：`roles-and-contact-scenarios`

#### 1.1 Step 内计划

- [x] 读取 Step 2、4 和产品角色线索。
- [x] 区分人类角色、系统角色、平台壳和 owner 服务。
- [x] 诊断旧权限矩阵将角色、授权、接口动作和业务 owner 混写的问题。
- [x] 取舍“场景角色 + owner 授权外置”的角色模型。
- [x] 形成角色说明表、接触场景表和权限边界表。
- [x] 判断不需要额外拆权限附录；effective authorization 在 Step 10 / 12 继续约束。
- [x] 形成正式 §5 回填草稿并完成自检。

### 2. 本步输入

- `00_req_step_02_position_boundary.md`
- `00_req_step_04_goals_non_goals.md`
- `product/最终目的.md` 用户与管理者叙事
- `projects/L1-governance/00-需求文档.md` 的审批角色边界
- `projects/L1-identity/00-需求文档.md` 的 identity role 边界
- `projects/L1-work/00-需求文档.md` 的项目角色线索
- `projects/L0-sdk/00-需求文档.md` 的 SDK consumer 角色

### 3. SOP 问题回答

#### 3.1 本仓有哪些主要人类角色？

| 角色 ID | 人类角色 | 主要接触场景 |
|---|---|---|
| `ROLE-CHAT-COLLABORATOR` | 协作者 / 参与者 | 阅读和发送自己有权参与的对话，查看相关成员、项目和产物摘要。 |
| `ROLE-CHAT-PROJECT-OWNER` | 项目负责人 / 管理者 | 进入项目群、查看进度和阻塞、定位线程、处理被授权的治理入口。 |
| `ROLE-CHAT-APPROVER` | Gate 决策人 / 审批者 | 查看治理上下文、证据引用和选项，发起受控审批并等待正式结果。 |
| `ROLE-CHAT-OBSERVER` | 旁观者 / 审计查看者 | 在授权范围内只读查看历史、状态、引用和降级说明，不发起命令。 |
| `ROLE-CHAT-MOBILE` | 移动端轻量用户 | 在小屏和不稳定网络下完成阅读、通知、回复或审批等被允许的路径。 |
| `ROLE-CHAT-SUPPORT` | 客户端支持 / 排障人员 | 查看低敏连接、缓存、同步和错误状态，使用正式诊断入口，不读取业务正文或内部日志。 |

这些角色是产品场景角色，不是 Identity 的 GlobalMember / RoleDefinition，也不自动授予权限。用户实际可见范围和可执行命令由 Identity、Governance、Conversation、Work 等正式 owner 的授权结果决定。

#### 3.2 本仓有哪些系统角色？

| 系统角色 ID | 系统角色 | 接触场景 | Chat 依赖 / 不拥有 |
|---|---|---|---|
| `SYS-CHAT-SDK-ADAPTER` | SDK client adapter | 把产品场景映射到 typed query / command / event 能力 | 依赖 SDK；不拥有 owner truth。 |
| `SYS-CHAT-OWNER-QUERY` | owner query / safe view source | 提供对话、成员、项目、治理、产物、workspace、runtime 的正式读取 | Chat 只消费；不改变 source。 |
| `SYS-CHAT-OWNER-EVENT` | owner change source | 提供正式变化、cursor、resume 或 gap 语义 | 只有 SDK 正式提供时才接入；不直订内部 bus。 |
| `SYS-CHAT-PLATFORM-SHELL` | Web / Desktop / Mobile shell | 提供窗口、导航、通知、输入法、存储和辅助技术集成 | shell 不改变产品语义或 owner truth。 |
| `SYS-CHAT-LOCAL-STORE` | 客户端局部存储 | 保存草稿、选择、展示缓存、cursor metadata 和恢复标记 | 不保存 forbidden body，不冒充 source。 |
| `SYS-CHAT-ACCESSIBILITY` | 浏览器 / OS 辅助技术 | 屏幕阅读、键盘、焦点、触控和 reduced motion | Chat 负责语义和可操作性；平台实现由壳提供。 |

#### 3.3 角色分别在什么场景下接触本仓？

| 场景 | 主要人类角色 | 系统角色 | 关键边界 |
|---|---|---|---|
| 打开 group / channel / dm / thread | 协作者、项目负责人、旁观者 | SDK query、owner visibility | 无权 / stale / unavailable 不能以空白或缓存伪造可见。 |
| 发送普通 Turn | 协作者、项目负责人 | SDK command、Conversation owner | draft / intent 不等于 Turn 已提交；要等待正式 result / change。 |
| 处理 GateCard | 审批者、项目负责人 | Governance command、Conversation change | 只有授权者能看到或操作；点击不等于 decision。 |
| 查看成员与项目进度 | 协作者、负责人、旁观者 | Identity / Work / Member / Runtime query | 显示 safe summary；不展示越过 scope 的内部状态。 |
| 预览 Artifact | 参与者、审批者、审计查看者 | Artifact safe view / preview adapter | 预览失败显示 ref / unavailable，不猜正文。 |
| 弱网恢复 / 多端同步 | 所有角色 | SDK resume、local store、platform shell | unknown / conflict / stale 显式呈现。 |
| 客户端排障 | 支持人员 | SDK error / connection status / low-sensitivity observation | 不开放内部 bus、raw log、secret 或业务正文。 |

#### 3.4 是否需要权限差异结论？

需要，但 Chat 只表达“可见 / 不可见 / 可操作 / 只读 / pending / unavailable”等客户端状态，不定义最终授权算法。权限差异至少包括：

| 能力 | 协作者 | 项目负责人 | 审批者 | 旁观者 / 审计者 | 规则来源 |
|---|---|---|---|---|---|
| 查看对话 | 按 Conversation visibility | 按项目 / 对话授权 | 按授权范围 | 通常只读 | Conversation / Identity / Governance |
| 发送 Turn | 按 participant / policy | 按 participant / policy | 通常不因审批角色自动获得 | 不允许或受限 | Conversation / Governance |
| Gate 操作 | 不默认允许 | 仅被授权时 | 被授权时允许 | 不允许 | Governance |
| 查看成员 / 项目 | safe summary | 受项目 scope | 受审批 context | 受审计 scope | Identity / Work / Member / Runtime |
| 查看 Artifact | 按 artifact visibility | 按 project / artifact scope | 按 Gate context | 按审计 scope | Artifact / Governance |
| 修改 Chat 局部偏好 | 允许 | 允许 | 允许 | 允许 | Chat local state |

### 4. 当前文档问题诊断

| 旧内容 | 问题 | 修订 |
|---|---|---|
| 旧 `00` “普通用户 / Owner / Auditor / 系统”矩阵 | 把产品角色、Identity 角色和治理授权压缩成一个静态矩阵 | 改为场景角色；effective authorization 留在正式 owner。 |
| “员工登录”角色 | 容易暗示 Chat 可以切换身份或进入 Runtime 内部 | 改为成员安全摘要 / 观察入口，不改变执行主语和授权。 |
| “系统事件”发送者 | 容易把内部 event source 当作 UI 用户 | 改为 SDK / owner 系统角色，不能绕过 command / query contract。 |
| 旧 `01` Member Lens / Inbox 模块 | 以 UI 名称推断业务权限和 attention truth | 角色章节只写接触场景，状态由 owner safe view 决定。 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 角色定义 | 用户、Owner、Auditor、系统混列 | 人类场景角色、系统接缝角色分列 | 便于后续故事和接口追溯。 |
| 权限 | 静态 ✅/❌ 矩阵看似由 Chat 决定 | Chat 展示 owner 授权结果，不裁决 | 避免 UI 私造权限。 |
| 员工登录 | 进入某员工当前上下文 | 受控只读成员 / 运行安全摘要 | 守住 Identity、Member、Runtime 边界。 |
| 支持角色 | 未明确 | 增加低敏客户端排障角色 | 覆盖恢复、缓存、连接问题而不开放 backend。 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 在 Chat 内定义完整权限矩阵 | UI 开发直接 | 与 owner 授权漂移，形成第二裁决 | 不采用。 |
| 只列最终用户，不列系统角色 | 文档简短 | 无法说明 SDK、event、local store 和 platform shell 的责任 | 不采用。 |
| 场景角色 + 系统接缝角色 + owner 授权外置 | 可追溯、跨端一致、不会越权 | 需要把权限结果映射为多个 UI 状态 | 采用。 |

### 7. 结构化中间产物

#### 7.1 角色接触链

```text
human role
   -> Chat route / view / action
   -> SDK adapter
   -> owner visibility / command authority
   -> result / event / safe view
   -> Chat display + local state
```

#### 7.2 权限状态表达

| owner 结论 | Chat 可见表达 | Chat 禁止表达 |
|---|---|---|
| authorized + available | 可见 / 可操作 | “Chat 自己授权” |
| authorized + stale | 可见但 stale / refresh required | 当前真相确定 |
| not visible | 不可见 / 无权 | 对象不存在（除非 owner 明示） |
| command pending | submitting / pending | 已审批 / 已发送 |
| rejected | rejected / blocked with reason class | 修改 owner policy |
| unknown | unknown / retry decision | 自动重发或成功 |

### 8. 回填草稿

正式 `00-需求文档.md` §5 可回填为：

> `L5-chat` 的人类角色包括协作者、项目负责人、Gate 审批者、旁观者 / 审计查看者、移动端轻量用户和客户端支持人员；系统角色包括 SDK adapter、owner query / safe view source、owner change source、平台壳、客户端局部存储和辅助技术集成。人类角色描述接触场景，不等于 Identity / Governance 的最终授权主体；系统角色描述协作接缝，不拥有上游业务真相。
>
> Chat 只把正式 owner 返回的可见性、可操作性、pending、rejected、unknown、stale 和 unavailable 结果映射成界面状态。它不自行授予权限、不把“员工视角”变成身份切换、不把系统事件当作 UI 用户、不把支持人员权限扩张到内部 bus 或原始日志。

### 9. 待确认事项

- Chat 支持角色是否需要独立诊断入口，需在安全和配置阶段确认。
- Mobile 的角色能力是否固定为阅读、通知和被授权审批，需在架构 / 产品切片阶段确认。
- 审计查看者是否可见完整历史和 Artifact preview，必须由 Governance / Artifact / Conversation owner 提供结果。

### 10. 进入下一步条件

- 人类角色、系统角色和权限 owner 已分离。
- 角色表描述场景，不把接口动作、依赖关系或授权算法写成角色定义。
- Chat 的权限表达使用 owner 结果和显式状态，未形成本地裁决。
- Step 5 自检通过，允许进入 Step 6。

### 11. 原型修复回写

新增场景角色边界：项目负责人可进入项目进度和阶段详情，群聊参与者从所属群聊进入项目，公司目录查看者浏览公司成员，Gate 审批者只能看到 owner 返回的受控审批入口。项目成员、群聊成员和公司成员目录保持三个不同视角，不能由 Chat 合并裁决。

- 影响故事：`US-CHAT-019~022`。
- Step 5 自检：角色描述仍是接触场景，授权和成员归属继续由 Identity/Work/Conversation/Governance owner 提供。

### 逐章修复结构化结果（2026-10-01）

以下为本 Step 已复核的当前需求级结果，替代前轮回填草稿中对应范围；保留旧轮记录用于差异审计，不代表实现或验收通过。

| 人类角色 | 主要接触场景 | 权限语义 |
|---|---|---|
| `ROLE-CHAT-COLLABORATOR` 协作者/参与者 | 阅读、发送有权参与的对话，查看安全摘要和引用。 | 依正式 Conversation/Identity/Governance 结果。 |
| `ROLE-CHAT-PROJECT-OWNER` 项目负责人/管理者 | 项目群、进度/阻塞摘要、线程和被授权治理入口。 | 项目负责人身份不自动授予所有 Gate 权限。 |
| `ROLE-CHAT-APPROVER` Gate 审批者 | 治理语境、证据引用、选项和受控提交。 | 仅正式授权可操作；点击不等于 Decision。 |
| `ROLE-CHAT-OBSERVER` 旁观者/审计查看者 | 授权范围内只读阅读和状态解释。 | 不因只读入口推断额外对象存在性。 |
| `ROLE-CHAT-MOBILE` 移动端轻量用户 | 后续小屏阅读、通知、回复或审批。 | Mobile 是外围体验，不构成 V1 前置。 |
| `ROLE-CHAT-SUPPORT` 客户端支持人员 | 低敏连接、缓存、恢复与错误状态。 | 不访问内部 bus、原始日志或业务正文。 |

SDK adapter、owner safe view/change source、Desktop/Web/Mobile shell、客户端局部存储和辅助技术是系统接缝，不是 Chat 的业务授权主体。Chat 只将 owner 返回的可见、只读、可操作、pending、rejected、unknown、stale、unavailable 等结果映射为界面状态；不会自行授予权限或把“员工视角”变成身份切换。

项目负责人、群聊参与者、公司目录查看者和 Gate 审批者的操作范围分别受项目、Conversation、Identity/Member 和 Governance owner 约束；任一角色不因进入 Chat 或项目详情而获得额外权限。
