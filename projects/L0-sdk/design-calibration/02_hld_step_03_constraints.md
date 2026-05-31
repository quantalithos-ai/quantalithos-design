## Step 3. 收稳约束条件

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 3
- 回填章节：`projects/L0-sdk/02-概要设计.md` §3 约束条件

### 2. 本步输入

- Step 1 已收敛的上游关系映射表：
  - `projects/L0-sdk/design-calibration/02_hld_step_01_upstream_boundary.md` §7.1
- Step 1 已收敛的 `本文不再回答` / `本文必须回答` 清单：
  - `projects/L0-sdk/design-calibration/02_hld_step_01_upstream_boundary.md` §7.2 / §7.3
- Step 2 已收敛的设计目标表、范围表和设计深度口径：
  - `projects/L0-sdk/design-calibration/02_hld_step_02_scope.md` §7.1 ~ §7.4
- 需求约束来源：
  - `projects/L0-sdk/00-需求文档.md` §10 / §11 / §12
- 架构约束来源：
  - `projects/L0-sdk/01-架构设计.md` §3 / §4 / §8 / §9 / §10 / §11 / §13

### 3. SOP 问题回答

1. 哪些约束会直接影响本仓对象、接口、处理流或状态机设计？

   回答：直接影响后续设计的约束包括：不得重新定义 `L0-core` truth、不得重新定义 `L0-bus` event truth、三语言语义必须一致、正式服务能力只能作为 formal API / fake boundary 进入、SDK 不执行 auth / governance、禁止业务正文和凭据正文进入 SDK truth、上游快照必须有版本引用和 stale / pending 表达、candidate 必须由验证证据支撑、error / trace / redaction / credential protection 必须作为横切默认、公共发布和外围增强不得进入当前 P0。

2. 哪些约束来自需求文档，哪些约束来自架构设计或全局设计？

   回答：需求文档提供 BR-001~BR-014、数据归属、接口与依赖的硬边界；架构设计提供职责边界、依赖方向、数据所有权、一致性策略、关键交互、技术机制和横切关注点；全局设计提供本仓依赖裁剪、L0 层定位和目录 / 代码组织后续输入。概要设计只吸收会影响结构骨架的约束，不重复完整需求或架构正文。

3. 哪些边界如果不先写清，后续最容易串到相邻仓或详细设计？

   回答：最容易串线的是 core 契约定义边界、bus runtime / delivery truth 边界、server gateway / 服务端业务 truth 边界、auth / identity / governance 边界、UI / runtime 边界、public registry 发布边界、具体协议 / 工具链边界和禁止正文边界。这些边界必须在 Step 3 固定为后续章节的判断门禁。

4. 哪些约束只是泛化工程原则，不应进入本章？

   回答：泛化的代码风格、性能优化建议、日志最佳实践、测试覆盖率目标、CI 时间、包体积阈值、具体目录命名、版本号格式、commit 边界、发布步骤和脚本命令不进入本章。它们可能重要，但属于详细设计、测试方案、验收标准或实施计划，不是概要设计结构性约束。

5. 每条约束是否能指导后续章节的设计判断？

   回答：本 Step 只保留能直接约束 Step 4~Step 11 的规则。每条约束必须能回答“这个主要组成部分是否越界”“这个对象是否应该属于 SDK truth”“这个接口是否应暴露”“这个处理流是否补造上游 truth”“这个状态是否需要 stale / pending / unsupported 表达”“这个配置是否会绕开主线边界”等问题。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` §4 | 将技术约束、资源约束、时间约束、合规约束和容量规划混在一起 | 无法区分哪些约束会影响概要设计结构,哪些属于测试、验收或实施 |
| 旧 §4.1 | 写入 trace 默认开启、redaction 默认开启等方向,但没有和对象 / 接口 / 流程结构绑定 | 后续仍可能只在实现细节里处理横切默认,而不是作为结构约束 |
| 旧 §4.2 / §4.5 | 写入包体积、CI 时长、quickstart 数量等阈值 | 这些不是当前概要设计结构约束,容易提前锁定验收或实施指标 |
| 旧 §4.4 | 写入 W3C Trace Context 和 deprecated minor 数量等具体规则 | 当前需求 / 架构没有把这些作为本轮概要设计已确认输入 |
| 全文 | 缺少禁止正文、snapshot freshness、candidate evidence、unsupported / stale / pending 等结构约束 | 后续对象、接口、处理流和状态机容易缺少必要状态和边界表达 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 约束来源 | 旧草案自定义约束和历史指标 | 新版需求 §10~§12 + 架构 §3~§13 | 保证约束可追溯且不脑补 |
| 约束粒度 | 工程指标、合规原则和结构边界混杂 | 只保留影响代码主体、对象、接口、流程和状态机的结构性约束 | Step 3 是概要设计门禁,不是测试或实施计划 |
| core / bus 边界 | 表述为 SDK 不手写冲突类型或不重写 transport | 固定为不得重新定义 core truth 和 bus event truth | 后续对象和接口不能制造第二真相源 |
| 数据边界 | 只强调 secret redaction | 扩展为禁止业务正文、事件 payload、生产请求响应、观测正文、UI / runtime 状态和凭据正文进入 SDK truth | 对象、示例、错误、报告和证据都受约束 |
| 状态表达 | 旧文档未要求 stale / pending / unsupported 等状态 | 固定为快照、接口、candidate 和证据必须显式表达失败 / 挂起状态 | 支撑 Step 9 状态机 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：沿用旧 §4 的技术 / 资源 / 时间 / 合规 / 容量约束 | 信息多,覆盖面广 | 混入未确认指标和实施细节,无法作为概要设计结构门禁 | 不采用 |
| 方案 B：只保留结构性约束,并把测试 / 验收 / 实施指标后移 | 能直接指导后续主体、对象、接口、流程和状态机设计 | 不在本章给出完整工程治理指标 | 采用 |
| 方案 C：把所有需求业务规则完整复制到概要设计 | 追溯信息完整 | 重复需求文档,且不利于后续章节使用 | 不采用 |

### 7. 结构化中间产物

#### 7.1 约束条件表

| 约束 | 来源 | 说明 | 影响后续章节 |
|---|---|---|---|
| SDK 不得重新定义 `L0-core` truth | 需求 BR-001 / 架构 §3 / §4 | 共享契约、错误、trace、metadata、CloudEvents 和 envelope 只能作为上游派生视图进入 SDK | 代码主体、关键对象、接口骨架、处理流 |
| SDK 不得重新定义 `L0-bus` event truth | 需求 BR-002 / 架构 §3 / §4 | publish / subscribe / ack / retry / dead-letter / replay / tap truth 归 `L0-bus`;SDK 只提供事件客户端视图 | 主要组成部分、API、处理流、状态机 |
| 三语言语义基线优先于语言 idiomatic 表达 | 需求 BR-003 / 架构 §6 / §11 | Rust / Python / TypeScript 可有不同表达,但对象、状态、错误和事件语义必须一致 | 代码主体、关键对象、接口骨架、处理流 |
| 服务能力只能通过 formal API / fake boundary 运行期接入 | 需求 BR-004 / BR-011 / 架构 §8 / §10 / §11 | L1/L2/L3/L4 不能成为 SDK 源码 truth,服务端业务事实不进入 SDK | API、处理流、异常边界 |
| SDK 不执行 auth / identity / governance 决策 | 需求 BR-005 / 架构 §4 / §13 | SDK 可保护凭据材料和传播调用上下文,但不做身份生命周期、登录认证、权限裁决或治理审批 | 主要组成部分、接口、异常边界、配置影响 |
| SDK 不拥有 UI / runtime 状态或本地离线状态 | 需求 BR-006 / 架构 §3 / §4 | UI 组件、页面状态、runtime loop、本地缓存 / 离线状态不进入当前 P0 结构 | 代码主体、主要组成部分、配置影响 |
| 禁止正文进入 SDK truth 和证据正文 | 需求 BR-007 / §11 / 架构 §9 / §13 | 业务正文、事件 payload、生产请求响应、观测正文、UI / runtime 状态和凭据正文不得进入对象 truth、示例、错误、报告正文 | 关键对象、接口、处理流、异常边界 |
| 上游变化必须形成版本引用、兼容判断和验证证据 | 需求 BR-008 / BR-014 / 架构 §9 / §11 / §13 | 上游 snapshot 变化不能静默进入 stable;必须能表达 stale / pending / unsupported / not verified | 关键对象、处理流、状态机 |
| deprecated 必须跨语言显式表达迁移与过渡口径 | 需求 BR-009 / 架构 §11 / §14 | 不得只在某一种语言移除或静默改变能力;兼容对象和状态必须保留迁移语义 | API、状态机、详细设计承接 |
| 外围增强进入主线前必须重新裁剪 | 需求 BR-010 / 架构 §3 / §12 / §14 | 完整 MCP、REST / GraphQL、REPL、本地缓存、公共发布和全量覆盖不得自然混入当前概要设计 | 范围、主要组成部分、风险 |
| 本地 package candidate 是当前 P0 承载 | 需求 BR-012 / BR-013 / 架构 §7 / §9 / §13 | candidate 必须可安装、可验证并有证据链;公共注册表不是当前 P0 前置 | 关键对象、接口、处理流、状态机 |
| 显式失败优先于伪成功 | 架构 §9 / §10 / §13 | 依赖未稳定、证据缺失、接口未覆盖、快照过期时必须表达 failed / missing / stale / pending / unsupported | 接口、处理流、状态机、异常边界 |
| 配置不得绕开主线边界 | 架构 §13 / Step 2 范围 | 配置只能影响可配置策略,不能让某语言绕开 redaction、trace、错误映射、兼容治理或上游 truth 引用 | 配置影响轮廓、详细设计承接 |

#### 7.2 不进入本章的泛化约束

| 不进入项 | 不进入原因 | 后续落点 |
|---|---|---|
| 包体积、CI 时长、性能阈值和初始化耗时 | 当前未收稳为概要设计结构约束 | `05-测试方案.md` / `06-验收标准.md` |
| 具体协议、transport、生成器、包管理器和语言工具链 | 属于详细技术实现选择 | `03-详细设计.md` / `07-实施计划.md` |
| 目录树、文件路径、crate / package 名称和 module layout | 属于实现组织细节 | `03-详细设计.md` / `07-实施计划.md` |
| 完整 HTTP path、proto / JSON schema、DTO 字段全集 | 属于详细接口契约 | `03-详细设计.md` |
| 测试用例矩阵、fixture、runner 和报告字段 | 属于测试和验收设计 | `05-测试方案.md` / `06-验收标准.md` |
| commit boundary、开发顺序、脚本命令和发布命令 | 属于实施管理 | `07-实施计划.md` |

#### 7.3 约束如何指导后续章节

| 后续章节 | 必须受哪些约束直接控制 |
|---|---|
| Step 4 代码主体框架 | core / bus truth 边界、三语言语义基线、formal API / fake boundary、candidate P0 承载 |
| Step 5 主要组成部分 | 不做 auth / governance、不做 UI / runtime、不做 public registry 主线、不做 bus runtime |
| Step 6 关键对象 | SDK truth / snapshot / reference / forbidden body 分类、candidate evidence、compatibility / deprecated 状态 |
| Step 7 API / 接口骨架 | formal API 运行期接入、event client view、显式失败、禁止正文 |
| Step 8 关键处理流 | 上游变化承接、candidate 验证、cross-language consistency、compatibility / deprecated |
| Step 9 状态机 | stale / pending / unsupported / not verified / verified / stable / deprecated 等状态表达 |
| Step 10 异常边界 | forbidden body、missing evidence、unsupported service、stale snapshot、credential leakage |
| Step 11 配置影响 | 配置不得绕开 redaction、trace、error mapping、compatibility 和上游 truth 引用 |

### 8. 回填草稿

正式 `02-概要设计.md` §3 “约束条件”直接摘录并润色本文件：

- §7.1 “约束条件表”
- §7.2 “不进入本章的泛化约束”
- §7.3 “约束如何指导后续章节”

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和交叉引用。

### 9. 待确认事项

- 无阻塞进入 Step 4 的待确认事项。
- 性能阈值、报告字段、工具链、目录结构、协议 schema 和 commit boundary 继续后移,不得在 Step 3 写成概要设计结构约束。

### 10. 进入下一步条件

- 已明确后续概要设计必须遵守的结构性约束。
- 每条约束都能影响后续代码主体、对象、接口、处理流、状态机或配置影响判断。
- 已剔除泛化工程原则和详细设计 / 测试 / 实施层内容。
- 已足以进入 Step 4 “代码主体框架映射”。
