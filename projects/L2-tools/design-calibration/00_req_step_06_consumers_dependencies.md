# L2-tools 需求 Step 6:使用方与依赖

> Step 状态: completed
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §6
> 本步原则: 从全局依赖基线裁剪 L2-tools 子图,只写能力级输入 / 输出、依赖类型、前置性和失效后果;不写接口、事件名、字段或主链步骤。

---

## 1. Step 状态与 Step 内计划

### 1.1 本步目标

明确 L2-tools 向哪些内部仓提供工具调用语义能力、依赖哪些当前正式边界、哪些关系是核心闭环前置或条件前置、哪些只能是事件 / 安全材料协作,并阻止运行期和事件关系被误写为源码依赖。

### 1.2 本步输出

- 内部仓依赖表与外部系统依赖结论。
- 闭环前置 / 条件前置 / 非阻塞协作判定。
- 本仓依赖裁剪表。
- 本仓依赖类型分类表。
- 本仓禁止依赖表。
- 依赖裁剪 ASCII 图。
- 正式 §6 回填草稿。

### 1.3 Step 内计划

| 计划项 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 恢复三层状态 | §1 与 §10 | done | Step 5 pass,只允许 Step 6。 |
| 读取依赖规范 | §6 规则确认 | done | 固定三表 + ASCII 图格式明确。 |
| 裁剪全局相关边 | §3 / §7 | done | 未复制 27 仓矩阵。 |
| 判定方向与类型 | §3 / §7 | done | compile / runtime / event 当前关系与“不适用”边界记录清晰。 |
| 判定前置与失败 | §3 / §4 | done | 核心前置、场景前置、条件前置、非阻塞协作分开。 |
| 建立禁止依赖 | §7 | done | sibling source、SDK、Bus、Observability 等反向依赖被禁止。 |
| 后置审计旧材料 | §5 | done | 旧 SDK / Hub / Sandbox 编译依赖与外部产品前置被剔除。 |
| 形成回填草稿 | §8 | done | 只含能力级关系。 |
| Step 17 受控回退复核 | §3 / §6~10 | done | 方向、角色、依赖类型和图例均收束到规范闭集;无已确认项目直边的对象仅以“不适用”边界记录保留,并退出当前分类表与依赖图。 |
| 自检与停审 | §10 | done | 四个固定裁剪产物齐全,无接口 / 主链提前展开。 |

---

## 2. 本步输入

- 项目台账、需求 flow 与 Step 1~5。
- 需求 SOP Step 6、书写规范 §4.6。
- `standards/document/全局项目依赖关系与裁剪规则.md` §2、§4~6。
- `L0-core`、`L0-bus`、`L0-sdk` 当前正式链。
- `L1-governance`、`L3-capability-hub`、`L4-sandbox`、`L4-observability` 当前正式边界。
- `L2-runtime` 当前旧正式材料仅用于下游消费线索;它尚未系统校准,不得反向定义 L2 truth。
- 旧 L2 依赖表和技术假设,仅作后置审计。

---

## 3. SOP 问题回答

### 3.1 本仓向谁提供能力

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输出 | `L2-runtime` | 稳定工具身份 / 定义消费边界、规范调用语义、normalized result / error 和 tool-domain audit 关联语境 | 是,直接下游消费前置 | Runtime 会自建工具 schema 或按适配器解释结果,tool loop 出现多真相和不可比较 outcome。 |
| 输出 | `L0-sdk` | 未来可封装的正式服务端工具契约边界 | 否,当前不进入主链 | tools-specific SDK client 尚未闭口;不影响工具契约自身成立。 |
| 输出 | `L0-bus` | 已提交 tool-domain fact 的安全变化协作材料 | 否,事件协作不阻塞本地工具语义闭环 | 跨仓变化感知延迟或失败,但不得反写 / 回滚本地 truth。 |
| 输出 | `L4-observability` | 经正式事件 carrier 交接的 body-free、redacted、可关联工具安全观察材料 | 否,观察协作不阻塞本地结果形成 | 工具调用的横切观察面不完整;不得据此伪装执行失败或改写结果。 |

### 3.2 本仓依赖谁

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 actor / metadata / error / trace / envelope 类别和跨仓契约 authority | 是,共享语境前置;tools-specific schema 当前仍是 blocker | 若正式共享类别不可用,跨仓身份、关联和错误语义无法稳定;L2 不得复制第二套 core schema。 |
| 输入 | `L3-capability-hub` | capability identity、descriptor、formal exposure 和 controlled consumer ref / safe summary | 对 capability-bound 工具是场景前置;不阻塞纯本地 tool identity | 相关工具不得假定 capability 已知、可见或可用;不能回退本地 capability registry。 |
| 输入 | `L4-sandbox` | isolation execution 能力、run / capture / failure / handoff / cleanup truth 及工具语义归一化所需正式材料 | 对 sandbox-required 工具是场景前置 | 受影响调用必须等待、拒绝或失败;不得宿主直跑、补造 capture 或声明成功。 |

Governed / authorization-required 调用仍必须承接正式 owner 的结果,但 `L2T-UP-001~002` 尚未闭合 Tools-specific owner / source matrix。当前不得把该待解析 seam 固化成任一项目级输入边;来源缺失、冲突或不可验证时必须 fail closed,L2 不得自我授权。

### 3.3 是否有正式外部系统依赖

当前阶段无需要直接进入 L2-tools 核心主链的正式外部系统依赖。

外部 MCP / A2A / API、provider endpoint、secret store、网络服务、工具运行时与具体 builtin 依赖均不是本仓当前直接 authority:外部能力接入事实应经 Capability Hub 受控引用;实际承载应经未来 adapter / Sandbox / provider owner 边界;具体工具库存不是仓成立前置。若后续某类 external runtime 被正式纳入,必须在 `01~04` 重新裁剪,不得从旧 README 直接恢复。

### 3.4 强阻塞与非阻塞关系

| 分类 | 关系 | 需求处理 |
|---|---|---|
| 核心共享前置 | `L0-core` shared context authority | 缺失时不能伪造跨仓 schema;允许先闭 L2 领域 truth 类别,跨仓字段定稿保持 blocked。 |
| 场景前置 | Hub 对 capability-bound 工具;Sandbox 对 sandbox-required 工具 | 只阻塞对应场景,不得把单个依赖不可用放大为所有本地工具契约不存在。 |
| 条件安全前置 | governance / authorization seam | governed 场景未知时 fail closed;exact source matrix 继续 blocker。 |
| 直接下游前置 | Runtime consumption seam | 不阻塞 L2 truth 建立,但阻塞端到端 runtime tool loop 可用性。 |
| 非阻塞协作 | Bus、Observability | 协作失败必须显式,不得回滚或替代 tool-domain truth。 |
| 下游集成 | SDK | 不阻塞核心闭环,tools-specific client 后续闭口。 |

---

## 4. 当前文档问题诊断

### 4.1 依赖失效与边界后果

| 依赖 / 消费边界 | 失效后必须保持的需求边界 | 禁止反应 |
|---|---|---|
| Core shared contract 未闭口 | L2 先保持本地领域 truth 和共享类别候选;跨仓 schema / 字段不宣称完成 | 在 L2 自造第二套 actor / trace / envelope authority |
| Hub ref 缺失 / stale / 不可消费 | capability-bound 工具不可被当作已绑定 / 可用 | 从旧配置或本地 registry 猜 capability truth |
| Sandbox 不可用 / handoff 不完整 | sandbox-required 调用显式等待、拒绝或失败 | 宿主直跑、静默降级、用日志补 capture |
| Authorization owner / source 未闭口 | governed 调用 fail closed | 风险声明自我升级为 allow / deny,或把某一项目未经确认写成直接 provider |
| Runtime 下游未闭口 | L2 合同仍可独立成立,端到端 consumption 标记 pending | 把旧 Runtime schema 反向写成 L2 authority |
| Bus 不可用 | 本地 truth 不回滚,协作材料保持显式未交接 | 本地成功等同事件已送达;在 L2 接管 retry / DLQ truth |
| Observability 不可用 | result / error / ToolAuditEntry 不被改写,安全观察 handoff 显式缺失 | 用 observation material 裁决结果或驱动 recovery |
| SDK client 缺失 | 服务端契约仍成立,客户端联调 pending | 在 L2 实现 SDK client 或宣称 full client coverage |

---

## 5. 改动前后对比

### 5.1 Historical material 后置差异审计

| 旧位置 | 旧依赖口径 | 问题 | 当前处理 |
|---|---|---|---|
| `README.md` 关键依赖 | Core Tool schema、SDK 调 Hub、Sandbox 危险工具、外部 pytest / lsp 等 | 伪称 Core schema 已存在,反向依赖 SDK,直接锁具体工具运行依赖 | Core 当前编译期关系保留,仅旧材料假定的 Tools-specific contract 降为 candidate;SDK 改为 future / excluded 下游边界;具体依赖重新裁剪。 |
| 旧 `00` §10 | Core / SDK 编译期、Sandbox / Hub SLA、member-images / observability | 混写源码、运行、产品和观察关系并伪造 SLA | 按当前类型重建,删除数字。 |
| 旧 `01` | Python 同进程依赖与具体包 | 技术栈反推依赖 | 不继承。 |
| 旧 `03` | Rust service、HTTP / RPC、PostgreSQL、Redis、NATS | 与旧 01 冲突,并把基础设施写成需求前置 | 后移 01~04,本步不纳入。 |
| 旧 `05/06` | 以真实 Hub / Sandbox / Bus / Observability 联调为已具备 | 未证明实现可用或 evidence 存在 | 只保留 planned dependency,不宣称已运行。 |

---

## 6. 设计取舍

### 6.1 全局基线裁剪结论

全局矩阵为 L2-tools 给出:

- 全局矩阵的编译期依赖栏列出 `L0-core` / 按需 `L0-sdk`;关系是否保留由本轮裁剪另行判断。
- 运行期:`L3-capability-hub` MCP / A2A 能力。
- 事件协作:工具调用事件按需进入 Bus。
- 下游:`L2-runtime` 在全局顺序中晚于 L2-tools,因为 runtime loop 依赖工具契约与 capability / sandbox 边界。

本轮根据当前正式 owner 边界进一步收紧:

1. `L0-core` 是本轮唯一保留的编译期依赖;当前只确认 shared context / error / trace / envelope 类别,tools-specific schema 仍为 pending 状态。
2. `L0-sdk` 是下游 client seam,不是 L2-tools 编译期依赖;全局矩阵中的“按需”在本轮裁剪为“否”。
3. Capability Hub 和 Sandbox 是运行期 truth consumption / handoff 边界,不得写为 package dependency。
4. Bus 是事件协作,Observability 是事件 / 安全材料交接;二者不拥有 tool-domain truth。
5. Governance 正式链证明 Policy effective / automation governance truth 不能由 Tools 反写,但全局矩阵和上游正式合同都没有闭合 Tools-specific authorization 直边;在 `L2T-UP-001~002` 关闭前不得把 `L1-governance` 指定为当前 provider。
6. Runtime 是 L2-tools 的直接下游消费方,不是 L2-tools 反向依赖的 truth source。

### 6.2 术语约束

本步将“依赖”用于广义仓际关系。当前依赖只使用“编译期依赖”“运行期依赖”“事件协作依赖”;已评估但尚未成立或已裁剪的边界记录使用“不适用”,且不得进入当前依赖分类表或依赖图。只有“编译期依赖”可以成为 package dependency;运行期、事件协作和材料交接均不得落成 path dependency。candidate、pending、blocked、future 只表示对象或关系状态,不是新的依赖类型。

---

## 7. 结构化中间产物

### 7.1 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | L2-tools 编译期依赖栏的基础 contract 关系 | 依赖方 | 编译期依赖 | 是 | 共享 context / error / trace / envelope authority 必须保留;tools-specific contract 状态仍为 pending,不得伪称可直接使用。 |
| `L0-bus` | 工具调用事件按需进入 Bus | 协作方 | 事件协作依赖 | 是 | 只承接已提交事实的变化材料;Bus 不执行工具、不拥有业务 payload 或 ToolAuditEntry。 |
| `L0-sdk` | SDK 未来可封装 L2 正式服务端契约 | 被依赖方 | 不适用 | 否 | 仅保留 future / excluded 下游边界记录;当前项目依赖和主链均未成立,tools-specific client seam 继续受 `L2T-UP-009` 阻塞。 |
| `L1-governance` | 全局矩阵未列出 L2-tools 直边;Governance 正式链仅确认 Policy effective / automation governance truth 边界 | 依赖方 | 不适用 | 否 | 仅保留 owner-pending 候选边界记录,不表示当前项目依赖成立;Tools-specific authorization owner / source matrix 未解析时 fail closed,不得从领域职责推导 Governance 直边。 |
| `L3-capability-hub` | L2-tools 运行期消费 MCP / A2A 能力 | 依赖方 | 运行期依赖 | 是 | 受控消费 capability identity / descriptor / exposure;不得复制 registry 或 applicability truth。 |
| `L4-sandbox` | Layer 1 isolation 上游,L2-tools 位于其后 | 依赖方 | 运行期依赖 | 是 | sandbox-required 调用依赖隔离执行;capture / failure / handoff material 附着于运行期 carrier,不得成为源码依赖或第四种依赖类型。 |
| `L4-observability` | 经 Bus 消费横切观察材料 | 协作方 | 事件协作依赖 | 是 | 只交接 body-free safe material;material 附着于事件 carrier,Tools producer / source / route 状态仍为 pending。 |
| `L2-runtime` | L2-runtime 运行期消费 tools 能力,L2-tools 先行闭口 | 被依赖方 | 运行期依赖 | 是 | Runtime 是直接消费者;它拥有 planning / orchestration / retry / recovery,不反向定义工具 truth。 |

---

### 7.2 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 仅消费正式发布且适用的 shared context / error / trace / envelope contract;tools-specific schema 需先闭口。 | `01-架构设计.md`;`02-概要设计.md`;`03-详细设计.md`;`07-实施计划.md` |
| 运行期依赖 | `L3-capability-hub`;`L4-sandbox`;`L2-runtime` | 分别消费 capability ref 与隔离执行能力 / material,并向 Runtime 提供稳定工具契约。 | `01~05`;`07-实施计划.md`;Runtime 回归设计 |
| 事件协作依赖 | `L0-bus`;`L4-observability` | 已成立工具事实的安全变化 / 观察材料附着正式事件 carrier;Observability producer / source / route 仍 blocked。 | `01~05`;`07-实施计划.md` |

---

### 7.3 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L2-tools -> L0-sdk` 源码 / package 依赖 | SDK 是下游客户端,反向依赖会形成层级循环并让 client DTO 定义 server truth。 | L2 暴露正式服务边界,SDK 在下游通过 API / adapter / fake 封装。 |
| `L2-tools -> L3-capability-hub` 源码依赖 | 会复制 capability 类型和 registry 生命周期,破坏 truth owner。 | 运行期 controlled view / typed ref / safe summary。 |
| `L2-tools -> L4-sandbox` 源码依赖 | 会把 isolation run / capture / failure truth 绑入工具领域模型。 | 运行期 execution adapter / material handoff,各自保留 truth。 |
| `L2-tools -> L1-governance` 源码依赖 | 会把 Policy effective / approval truth 写入工具定义或形成循环。 | 正式授权结果 ref / safe summary / event collaboration。 |
| `L2-tools -> L0-bus` 作为工具执行调用链 | Bus 只拥有传递 truth,不能执行工具或解释业务结果。 | 本地 truth 提交后按事件协作发布安全材料。 |
| `L2-tools -> L4-observability` 源码 / store 依赖 | 会让观察物理模型和 projection 反向定义 result / audit。 | body-free safe material handoff / correlation ref。 |
| `L2-tools -> L2-runtime` 源码依赖 | Runtime 是下游消费者;反向依赖会吸收 agent loop / orchestration truth。 | L2 定义服务端工具契约,Runtime 运行期消费。 |
| `L2-tools -> external MCP / A2A / API registry` 作为本地 registry truth | 会绕过 Hub 并把 provider endpoint / secret / route / quota 合入 L2。 | 经 Hub 正式 access / exposure ref 和后续受控 adapter。 |
| `L2-tools -> member-images / marketplace` 作为核心依赖 | 工具库存、镜像装配和 listing 是产品 / 分发边界。 | 后续正式服务消费、artifact ref 或产品层适配;当前裁剪。 |
| 任一 sibling L1 / L2 / L3 / L4 仓成为 path dependency | 除 Core 正式 shared contract 外,会破坏层级与 truth isolation。 | runtime API / adapter、event collaboration、safe ref / summary。 |

---

### 7.4 依赖裁剪图

#### 依赖裁剪图: L2-tools

```text
L2-tools --[compile]--> L0-core
L2-tools --[runtime]--> L3-capability-hub
L2-tools --[runtime]--> L4-sandbox
L2-tools --[event]----> L0-bus

L4-observability --[event]--> L0-bus
L2-runtime ------[runtime]--> L2-tools
```

图示说明:

- 本图只展示 L2-tools 相关裁剪边,不展示全 27 仓;箭头按“消费者指向所依赖 provider”表达依赖 / 消费关系,不表示调用时序。
- 只有 `L0-core` 的关系类型是编译期依赖,且 tools-specific contract 状态仍为 pending;其余关系不得写成 package dependency。
- Hub 与 Sandbox 是按场景消费的运行期边界;Tools-specific authorization owner / source matrix 仍受 `L2T-UP-001~002` 阻塞,因此当前图不画 Governance 直边。
- Runtime 是当前直接下游消费者;SDK 只保留在裁剪表的 future 说明中,不进入当前分类表或主链图。Bus 与 Observability 通过事件 carrier 协作,箭头不是事件传播方向。

---

## 8. 回填草稿

### 8.1 内部仓依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 actor / metadata / error / trace / envelope 类别和跨仓契约 authority | 是,但 tools-specific contract 尚未闭口 | 跨仓身份、关联和错误语义无法稳定;L2 不得复制第二套 Core schema。 |
| 输入 | `L3-capability-hub` | capability identity、descriptor、formal exposure 和 controlled consumer ref / safe summary | capability-bound 工具场景是 | 相关工具不得被当作已绑定或可用,不能回退本地 capability registry。 |
| 输入 | `L4-sandbox` | isolation execution 能力与 run / capture / failure / handoff / cleanup truth 材料 | sandbox-required 工具场景是 | 受影响调用必须显式等待、拒绝或失败,不得宿主直跑或补造结果。 |
| 输出 | `L2-runtime` | 稳定工具契约、规范调用和 normalized result / error / audit 语义 | 是,直接下游消费前置 | Runtime 会自建工具 schema 或按适配器解释结果,形成多真相。 |
| 输出 | `L0-bus` | 已提交 tool-domain fact 的安全变化材料 | 否 | 跨仓变化感知受影响,但本地 truth 不得被回滚或替代。 |
| 输出 | `L4-observability` | 经正式事件 carrier 交接的 body-free、redacted、可关联安全观察材料 | 否 | 横切观察不完整,但不得据此改写工具结果。 |
| 输出 | `L0-sdk` | 未来可封装的正式服务端工具契约边界 | 否,当前不进入主链 | tools-specific client 仍 pending,不影响本仓核心 truth。 |

Governed / authorization-required 场景需要正式 authorization 结果,但当前 owner / source 尚未解析为确定仓际关系,因此不进入以上内部仓依赖表。该 seam 受 `L2T-UP-001~002` 约束:缺失、冲突或不可验证即 fail closed,不得默认归属 `L1-governance`。

### 8.2 外部系统依赖

当前阶段无直接进入 L2-tools 核心主链的正式外部系统依赖。外部 MCP / A2A / API 和 provider runtime 应经 Capability Hub 与后续正式 adapter 边界消费;具体工具运行依赖、secret store、网络服务和产品工具库存都不是当前仓成立前置。

### 8.3 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | L2-tools 编译期依赖栏的基础 contract 关系 | 依赖方 | 编译期依赖 | 是 | 只消费正式 shared context;tools-specific schema 状态仍为 pending。 |
| `L0-bus` | 工具调用变化按需进入 Bus | 协作方 | 事件协作依赖 | 是 | 只承接已提交事实的安全变化材料。 |
| `L0-sdk` | SDK 未来可封装 L2 正式服务端契约 | 被依赖方 | 不适用 | 否 | 仅保留 future / excluded 下游边界记录;当前项目依赖和主链均未成立,tools-specific client seam 继续受 `L2T-UP-009` 阻塞。 |
| `L1-governance` | 全局矩阵未列出 L2-tools 直边;Governance 正式链仅确认 Policy effective / automation governance truth 边界 | 依赖方 | 不适用 | 否 | 仅保留 owner-pending 候选边界记录,不表示当前项目依赖成立;Tools-specific authorization owner / source matrix 未解析时 fail closed,不得从领域职责推导 Governance 直边。 |
| `L3-capability-hub` | 运行期消费 capability | 依赖方 | 运行期依赖 | 是 | 只消费 controlled ref / safe summary。 |
| `L4-sandbox` | isolation 上游 | 依赖方 | 运行期依赖 | 是 | 需要隔离的调用依赖执行 truth;材料交接附着运行期 carrier。 |
| `L4-observability` | 经 Bus 消费横切观察材料 | 协作方 | 事件协作依赖 | 是 | 安全材料附着事件 carrier,producer / source / route 状态仍为 pending。 |
| `L2-runtime` | 运行期消费 tools | 被依赖方 | 运行期依赖 | 是 | 直接消费者,不反向定义工具 truth。 |

### 8.4 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 正式 shared context;tools-specific contract 闭口后才能定稿。 | `01~03`;`07` |
| 运行期依赖 | `L3-capability-hub`;`L4-sandbox`;`L2-runtime` | 分别消费 capability 与 isolation execution material;Runtime 消费 L2 契约。 | `01~05`;`07`;Runtime 回归设计 |
| 事件协作依赖 | `L0-bus`;`L4-observability` | 安全变化 / 观察材料附着事件 carrier;Observability positive route 仍 blocked。 | `01~05`;`07` |

### 8.5 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| L2-tools 源码依赖 SDK、Hub、Sandbox、Governance、Observability、Runtime 或其他 sibling | 形成层级循环或把相邻 truth 吸入工具领域 | API / adapter、event collaboration、safe ref / summary;只有 Core 的关系类型是编译期依赖。 |
| 使用 Bus 执行工具或拥有 ToolAuditEntry | Bus 只拥有传递 truth | 本地 fact 提交后发布安全变化材料 |
| 直接把 external provider registry / secret / route / quota 写入 L2 truth | 绕过 Hub / provider / security owner | Hub controlled ref + 后续受控 adapter |
| 让 member-images / marketplace /具体库存成为核心依赖 | 产品装配和分发不定义工具契约 | 后续产品消费或 artifact ref |

### 8.6 依赖裁剪图

正式章节复用本 Step §7.4 的 `L2-tools` 依赖裁剪图及其四条图示说明。

---

## 9. 待确认事项

本步未新增待确认事项。既有开放依赖与上游缺口继续按 §3、§4 和 §6 的约束承接,不得因本步通过而改写为已闭口。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 是否明确输入依赖、输出能力和协作边界? | 是。 |
| 是否区分内部仓与外部系统? | 是,当前无直接正式外部前置。 |
| 是否标明闭环 / 场景 / 条件前置和失败后果? | 是。 |
| 是否输出固定依赖裁剪表? | 是。 |
| 是否输出依赖类型分类表? | 是。 |
| 是否输出禁止依赖表? | 是。 |
| 是否输出合规 ASCII 图? | 是。 |
| 方向是否只使用 `输入 / 输出`,本仓角色是否只使用 `依赖方 / 被依赖方 / 协作方`? | 是。 |
| 依赖边界记录类型是否只使用 `编译期依赖 / 运行期依赖 / 事件协作依赖 / 不适用`,且“不适用”记录未进入当前分类表或依赖图? | 是。 |
| 图中依赖标签是否只使用 `[compile] / [runtime] / [event]`? | 是。 |
| 是否把 material handoff 写成第四种依赖类型? | 否,均附着 runtime / event carrier。 |
| 是否把 SDK / Hub / Sandbox / Bus / Observability 写成 path dependency? | 否。 |
| 是否伪称 Core tools schema、authorization owner 或 producer family 已闭口? | 否。 |
| 是否写角色、接口名、事件 schema、字段或主链步骤? | 否。 |

### 10.2 模块状态

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| relationship_crop | done | done | done | done | done | pass | `pass` | 进入 dependency_types。 |
| dependency_types | done | done | done | done | done | pass | `pass` | 进入 forbidden_dependencies。 |
| forbidden_dependencies | done | done | done | done | done | pass | `pass` | 进入 dependency_graph。 |
| dependency_graph | done | done | done | done | done | pass | `pass` | 更新 flow / ledger 后创建 Step 7。 |

### 10.3 停审结论

```text
step_status = completed
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = 读取需求 SOP Step 7 与书写规范 §4.7,创建 00_req_step_07_core_capability_loop.md
commit_required = false
```
