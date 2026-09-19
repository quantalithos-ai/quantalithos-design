## Step 3. 收稳约束条件

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 3
- 回填章节：正式 `02-概要设计.md` §3「约束条件」

#### 1.1 Step 内计划

- [x] 读取 Step 1/2、00 §10～§13、01 §3/§8～§10/§13
- [x] 按来源区分需求、架构和全局真相源约束
- [x] 逐项回答约束问题并诊断旧约束污染
- [x] 形成可指导主体/对象/接口/流/状态的约束表
- [x] 明确不进入本章的泛化工程和实现细节
- [x] 完成回填草稿、边界复核与三层门禁

### 2. 本步输入

- `design-calibration/02_hld_step_01_upstream_boundary.md`
- `design-calibration/02_hld_step_02_scope.md`
- `projects/L5-console/00-需求文档.md` §10～§13
- `projects/L5-console/01-架构设计.md` §3、§8～§10、§13
- `standards/document/设计真相源闭环与可落码性标准.md` 的 truth、状态、query/view、权限、forbidden-body、幂等和配置绑定要求

### 3. SOP 问题回答

1. **哪些约束会直接影响对象、接口、处理流或状态机？**

   真相归属、SDK/正式服务访问、actor/scope/visibility/资格前置、来源多轴保真、草稿/受理/正式结果分层、unknown 不重放、局部故障隔离、forbidden-body 零进入、客户端状态仅表达交互事实、配置不得改变权限/真相/状态机、a11y 与视觉共享同一语义，都会直接决定后续结构。

2. **约束来自哪些层？**

   `00` 提供行为、数据、NFR 和一票否决边界；`01` 提供运行承载、依赖方向、数据所有权、通信和横切约束；全局规则提供 Layer 5 裁剪、依赖分类和事实诚实门禁；owner 正式文档只提供边界线索，不替 Console 定义对象。

3. **哪些边界若不先写清，最容易串到相邻仓或详细设计？**

   `owner-safe view` 不能升级为 projection/truth；`permission/visibility` 不能升级为本地授权；`receipt/accepted` 不能升级为业务完成；Workspace projection/cursor/rebuild、Observability audit、Archive/Sandbox execution、Capability registry 不能迁入 Console；组件、路由、adapter 不能反向定义 owner 规则。

4. **哪些只是泛化工程原则，不应进入本章？**

   代码风格、框架偏好、数据库索引、具体缓存产品、部署拓扑、重试次数、日志格式、团队排期、泛化 SOLID/DRY 口号不进入本章。它们不能直接指导 Console 的结构边界，或应留给 03/04/07。

5. **每条约束能否指导后续章节？**

   能。下表为每条约束绑定的影响面；若某条无法影响主体、对象、接口、处理流、状态或配置判断，则不纳入正式 §3。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 结构性后果 |
|---|---|---|
| 旧 02 §4.1 | “回指 source refs”正确方向与 React/Svelte、组件库、API 直连假设混杂 | 无法区分业务硬约束与实现偏好 |
| 旧 02 §4.2/§4.5 | 使用“中高/高/频繁”等无 authority 容量词和固定 SLA/卡片数量 | 可能被误写为量化结构或配置默认值 |
| 旧 02 §5.4/§7 | 外部故障被统一为面板失联，未保留 owner/source、coverage、consistency、unknown 轴 | 容易形成全局 loading/error/green 语义 |
| 本仓 draft | 已有 no-write、visibility-first、pending 线索，但候选对象仍可能滑向 Workspace projection 或治理对象 | 需将约束转译为对象筛选、接口边界和状态禁止迁移 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 真相约束 | “不改 source truth”一句话 | 按 owner truth、Console interaction truth、safe snapshot/ref、forbidden body 四类拆开 | 指导对象和数据生命周期 |
| 权限约束 | permission hint 与 auth 混写 | actor/scope/visibility/资格只由正式边界提供，客户端只能收紧 | 防止 fail-open 与存在性泄露 |
| 结果约束 | action entry/accepted 与成功距离不清 | 草稿→提交尝试→受理→处理中→正式结果/unknown 分层 | 指导 Command、回查和状态机 |
| 降级约束 | 面板失联统一 stale | owner 独立多轴、局部故障隔离、冲突/unknown 保真 | 防止伪造整体健康/ready |
| 配置约束 | 偏好/flag 可能影响入口与权限 | 配置只影响允许呈现和接缝；禁止改 truth、资格、状态迁移和审计语义 | 为 Step 11 提供红线 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：一套全局 `ConsoleStatus` / `PermissionState` | 页面统一、实现表面简单 | 压平 owner 多轴状态与授权来源，形成第二真相 | 不采用 |
| 方案 B：每个页面自行解释所有边界 | 页面自治、初期灵活 | 语义漂移、a11y 和 unknown 处理不一致 | 不采用 |
| 方案 C：共享安全不变量 + owner 分区视图/结果状态 | 保持跨页一致，同时不吸收 owner truth | 需要更多显式状态与 adapter 接缝 | 采用 |

### 7. 结构化中间产物

#### 7.1 约束条件表

| 约束 | 来源 | 直接影响的概要结构 | 说明 |
|---|---|---|---|
| Console 不拥有外部 truth | 00 BR/DR、01 §4/§9 | 对象候选、view model、处理流 | 成员、项目、治理、制品、Workspace、方法、能力、观测、归档、sandbox 只作 safe view/ref；不得出现其 domain aggregate。 |
| 业务访问 SDK-only / formal-boundary-only | 00 BR-CON-012、01 §8/§10 | Query/Command adapter、依赖方向 | 不出现 DB/repository/private bus/BFF；未开放 surface 保持 blocked/read-only。 |
| actor/scope/visibility/资格先于披露和副作用 | 00 BR-CON-001～008/018、01 §5/§13 | Context、Guard、入口/命令状态、流前置 | 无法验证、过期、撤销、冲突或 unknown 时 fail-closed；本地 route/menu/flag 不能 allow。 |
| 来源与多轴状态不得压平 | 00 BR-CON-009～012、01 §9 | OwnerView、ViewModel、异常和状态机 | 至少保持 owner/source、freshness、coverage、availability、consistency，并区分 empty/missing/restricted/partial/stale/unavailable/conflict/unknown。 |
| 草稿、受理、正式结果分层 | 00 BR-CON-013～019、01 §9/§10 | Draft、IntentRecord、ResultRef、Command/Query 流 | transport/receipt/toast/refresh 不代表 committed；没有正式 reconciliation 不重放。 |
| query no-write | 00 BR-CON-010、01 §8/§10 | Query adapter、cache/invalidations、流程 | 查询、筛选、预取、排序、分页、下钻不改变 owner 或 Console 业务状态；缓存命中不等于 current。 |
| owner 故障局部隔离 | 00 BR-CON-028～031、01 §5/§10 | TopicShell、ViewModel、错误边界、恢复流 | 单一 owner 只影响相关区域，不能扩散/被其他成功掩盖；无统一健康结论。 |
| forbidden body 零进入 | 00 DR-CON-004/008/012/016/024/030、01 §9/§13 | DTO 映射、缓存、错误、诊断、导出 | credential、secret、raw/hidden body、治理依据、正文、audit/evidence/report/package 不进入持久化、缓存、日志、诊断或导出。 |
| 客户端状态只表达交互事实 | 00 DR-CON-001/005/009/013/014/025/026、01 §9 | SessionShell、NavigationState、Draft、Preference、RequestPresentation | 不改权限、业务优先级、治理决定、readiness；介质和生命周期未定。 |
| 可访问路径共享正式语义 | 00 BR/NFR/AC-CON-006、01 §13 | Component state、focus/announcement、Error/Recovery | 键盘/读屏/非颜色路径与视觉路径共享同一资格、状态、结果和恢复上限。 |
| 主题按 owner 独立激活 | 00 FR-CON-010～015、01 §8/§14 | TopicRegistry/Route/Adapter | exact surface、safe-field、activation 未闭口的主题只能 pending/blocked/read-only/partial。 |
| 配置不可改写不变量 | 01 §13、Step 2 | Config seam、runtime assembly | 配置可收紧入口、布局和可选提示，不可放宽资格、改变状态迁移、伪造结果、改变审计/evidence 语义。 |
| 量化与兼容必须有 authority | 00 NFR/CON-Q-045/046、01 §15 | 不写数字的 HLD 结构、03/05/06 承接 | 不继承旧首屏/P95/SLA/控制项/指标数量；未测量不写 ready/pass。 |
| 未停审产品仅 link/ref pending | 全局依赖、00 CON-Q-047、01 §8 | 外围导航/LinkAdapter | Chat/Runner/Sync/Marketplace/Bridges 私有状态、页面/API/指标不进入当前主体。 |

#### 7.2 约束到后续 Step 的绑定

| 后续 Step | 必须继承的约束 | 自检问题 |
|---|---|---|
| Step 4 | SDK-only、无 BFF、业务/实现轴分离 | 图中是否把外部 owner 或组件误列为 Console 代码主体？ |
| Step 5 | 五部分、owner 分区、对象候选维度 | 每个部分是否有明确非职责与接缝？ |
| Step 6 | 对象只来自交互 truth/safe view/ref | 是否误把 owner domain、DTO、repository、cursor 当关键对象？ |
| Step 7 | Command/Query/Event/Job 只写能力级骨架 | 输入输出是否标 pending，是否绕过正式边界？ |
| Step 8 | 查询 no-write、命令结果分层、局部降级 | 每条流是否有 context/visibility、来源状态和安全恢复？ |
| Step 9 | 状态轴独立、unknown/revoked 不降级为成功 | 是否出现统一 health/ready 或跨轴自动推导？ |
| Step 10～11 | 异常保真、配置不改不变量 | 是否把重试参数、配置键或错误码提前写死？ |

#### 7.3 回填前静态边界清单

- [x] 不出现数据库、repository、私有 bus、BFF、服务源码或 owner 内部规则。
- [x] 不出现固定技术框架、性能阈值、控制项/指标数量或 readiness 结论。
- [x] 不把 session、permission hint、view model、toast、cache、feature flag 当授权/业务/审计 truth。
- [x] 不把 Workspace projection/cursor/rebuild、Archive/Sandbox execution、Capability registry 迁入 Console。
- [x] 任何 unknown、冲突、过期、撤销、不可验证都保留保守上限。

### 8. 回填草稿

正式 §3 仅回填“约束条件表”及其简短说明；不回填本文件的诊断和讨论过程。表格中的每条约束必须能在 §4～§11 找到承接位置，且不包含实现级参数。

### 9. 待确认事项

- 各 owner 对 safe-field、freshness/coverage/availability/consistency 的精确表达仍待确认；本表只约束必须保真，不发明字段名。
- unknown reconciliation、客户端状态介质和配置绑定方式仍待 03/04；本步只建立禁止无依据放行/重放/配置化的红线。
- 具体可访问浏览器/辅助技术矩阵仍待确认；本步只固化等价语义要求。

### 10. 进入下一步条件

- 约束表每一行均可指导后续对象、接口、处理流、状态或配置判断。
- 泛化工程原则、实现参数和量化数字已排除。
- 无约束冲突或未解释的边界穿透。
- 项目级、文档级、Step 级门禁通过后，进入 Step 4 代码主体框架映射。
