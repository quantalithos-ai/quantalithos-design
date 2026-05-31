# Step 8. 用户故事

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 8
> 回填章节: `00-需求文档.md` §8 用户故事
> 生成日期: 2026-05-30

---

## 1. 本步目标

围绕 Step 7 已收敛的核心能力闭环，展开 `L0-sdk` 的角色目标叙事；本步只写目标级用户故事，不写接口动作、功能清单、语言包目录、DTO、事件 schema、发布脚本或实现阶段。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 5 用户与角色 | 提供故事主语，包括 SDK maintainer、三语言使用者、第三方集成者、文档维护者、发布维护者、安全 / 架构评审者和自动化系统 |
| Step 7 核心能力闭环 | 提供故事映射节点 CL-001~CL-005 |
| Step 4 目标与非目标 | 防止把公共注册表正式发布、完整 MCP、REST / GraphQL、REPL 写成当前 P0 故事 |
| Step 6 使用方与依赖 | 确认 `L0-core` / `L0-bus` 是强前置，L1/L2/L3/L4 是运行期封装目标，L5/L6 和 runtime / automation 是下游消费者 |
| 旧 `00-需求文档.md` §5 | 迁移合理的 TS / Python / Rust / 第三方 / 安全 / 版本兼容故事，但移除接口级和发布平台级表达 |

---

## 3. SOP 问题回答

### 3.1 哪些角色目标在支撑本仓的核心能力闭环？

`L0-sdk` 的核心故事必须证明官方客户端接入层成立，而不是证明某个具体接口或某个包已经发布。核心故事应覆盖：

- SDK maintainer 需要让三语言 SDK 消费同一批稳定上游契约，不另造平台 truth。
- TypeScript product developer 需要通过官方客户端接入平台能力，避免端侧产品形成私有协议封装。
- Python runtime / automation developer 需要在 runtime、脚本和评测流程中复用官方 client，避免重复处理协议、错误和 trace。
- Rust service / integration developer 需要在内部服务和集成中复用稳定类型、错误、trace 与事件封装口径。
- Third-party / enterprise integration developer 需要通过可运行的最小接入路径判断 SDK 是否可用。
- Security / compliance reviewer 需要跨语言一致的 redaction、凭据材料保护、错误文本和 trace 传播默认行为。
- Documentation / example maintainer 需要让 quickstart、docstring 和示例持续可运行。
- Release maintainer 需要让版本同步、兼容声明和 deprecated 过渡可被维护和验证。
- Architecture / standards reviewer 需要确认 SDK 没有越界成为 core truth、bus runtime 或 server facade。

### 3.2 哪些角色目标只是外围增强，而不决定闭环是否成立？

| 故事方向 | 为什么是外围增强 |
|---|---|
| 公共注册表正式发布 | 当前 P0 可以先通过本地 package candidate、示例和 smoke test 验证，公共注册表属于发布阶段目标 |
| 完整 MCP Client | MCP 生态重要，但 Step 4 已裁剪为 P1 候选，不阻塞官方 client 主闭环 |
| REST / GraphQL wrapper | 属于接入形态增强，不能让 SDK 变成 server facade |
| REPL / playground | 改善开发体验，但不决定官方客户端接入层是否成立 |
| 本地缓存 / 离线状态管理 | 偏产品体验或后续增强，不属于当前 SDK 主闭环 |
| 全量 L1/L2/L3/L4 client 覆盖 | 完整覆盖有价值，但当前闭环先要求稳定边界和最小可验证接入 |

### 3.3 哪些看起来像故事，但其实不应进入本仓？

| 候选故事 | 不进入原因 |
|---|---|
| “作为管理员，我希望 SDK 校验用户权限” | 权限裁决属于安全入口、identity、gateway 或 governance，SDK 不拥有授权 truth |
| “作为开发者，我希望调用 `CreateProject` 自动完成项目业务流程” | 具体业务流程属于 L1/L2/L3/L4 服务仓，SDK 只封装正式边界 |
| “作为 bus 用户，我希望 SDK 实现事件投递和 retry” | 投递、retry、dead-letter、replay runtime 属于 `L0-bus` |
| “作为 UI 用户，我希望 SDK 提供 React 组件和页面状态” | UI 组件和页面状态属于 L5/L6 产品仓 |
| “作为第三方开发者，我希望平台提供完整 OAuth provider” | 登录认证 provider 不属于 SDK 当前主边界 |

### 3.4 每条故事分别支撑闭环中的哪个能力节点？

故事映射遵循 Step 7 的 CL-001~CL-005：

- CL-001 三语言稳定承接：由 SDK maintainer、Rust integration、architecture reviewer 的故事支撑。
- CL-002 官方客户端一致：由 TS、Python、Rust 使用者和 architecture reviewer 的故事支撑。
- CL-003 最小可验证接入：由第三方集成者、文档维护者和三语言使用者的故事支撑。
- CL-004 横切默认一致：由安全评审者、Python / Rust / TS 使用者和自动化验证故事支撑。
- CL-005 文档与兼容演进：由文档维护者、release maintainer、第三方集成者和 SDK maintainer 的故事支撑。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `00` §5.1 | 把 Rust 服务间调用、Python runtime 消费事件、TS UI 调服务、第三方 10 分钟接入、trace 传播写成核心用例 | 有可迁移方向，但混合了用例、接口动作和验收条件 | 改成目标级故事，并映射到核心能力闭环 |
| 旧 `00` §5.2 | 使用卡片形式写 `new WorkClient()`、`subscribe(type=...)`、公共注册表检查等验收条件 | 已进入接口 / 包发布 / 测试细节，不符合新版 Step 8 粒度 | 验收条件后移到 Step 14；功能动作后移到 Step 9 / Step 12 |
| 旧 `00` §3 | 把公共注册表 10 分钟齐备写成 P0 目标 | 与 Step 4 当前目标冲突 | 改为外围增强故事，不进入核心闭环故事 |
| 旧 `00` §6 | 功能清单和用户故事高度耦合 | 容易把功能名直接改写成故事 | 本步先收敛故事，Step 9 再归并功能需求 |

---

## 5. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 故事组织 | 按具体用例和接口验收条件组织 | 按角色目标和核心能力闭环组织 |
| 故事粒度 | `new WorkClient()`、`subscribe()`、registry 检查等动作级故事 | 官方 client、最小可验证接入、横切一致和兼容演进等目标级故事 |
| 公共发布 | crates.io / PyPI / npm 同步发布像 P0 故事 | 改为外围增强；当前 P0 先要求本地 package candidate 和发布治理口径 |
| 事件能力 | Python SDK 订阅 CloudEvent 像独立主线 | 改为 SDK 消费 `L0-bus` 语义并提供一致事件封装，不拥有 bus runtime |
| 安全故事 | 只强调 redaction token/password/key/secret | 扩展为错误文本、trace、凭据材料和 redaction 默认一致 |
| 追溯性 | 故事和核心闭环无明确映射 | 每条故事映射到 CL-001~CL-005 或外围增强 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 继承旧用户故事卡片和验收条件 | 迁移快，保留旧内容完整 | 粒度过细，混入接口、验收和发布平台前置 | 不采用 |
| 方案 B: 围绕核心能力闭环重写目标级故事 | 与新版 SOP 一致，能支撑后续功能需求归并 | 需要把旧验收条件拆到 Step 14 | 采用 |
| 方案 C: 按三种语言各写一批故事 | 语言差异清楚 | 容易重复，且忽略 maintainer、安全、文档、发布和架构评审故事 | 不采用 |
| 方案 D: 把所有候选生态能力都写成故事 | 覆盖面广 | MCP、REST / GraphQL、REPL、公共发包会误升为当前 P0 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 核心闭环故事结论

| 故事编号 | 用户故事 | 目标类型 | 业务价值 | 与核心能力闭环的关系 |
|---|---|---|---|---|
| US-001 | 作为 SDK maintainer，我希望三语言 SDK 都承接同一批稳定上游契约和事件语义，以便 SDK 不重新制造平台 truth。 | 核心闭环 | 保证 SDK 是官方接入层，而不是另一个协议来源 | 支撑 CL-001 / CL-002 |
| US-002 | 作为 TypeScript product developer，我希望通过官方客户端使用一致的平台概念，以便端侧产品不再维护私有协议封装。 | 核心闭环 | 降低端侧产品接入分裂和重复封装成本 | 支撑 CL-002 / CL-003 |
| US-003 | 作为 Python runtime / automation developer，我希望在 runtime、脚本和评测流程中复用官方客户端，以便自动化流程不重复处理协议、错误和 trace。 | 核心闭环 | 让 runtime 与自动化接入共享同一套 SDK 体验 | 支撑 CL-002 / CL-003 / CL-004 |
| US-004 | 作为 Rust service / integration developer，我希望复用稳定类型、错误、trace 和事件封装口径，以便内部服务集成不各自发明客户端约定。 | 核心闭环 | 保证内部集成与底层契约和事件语义一致 | 支撑 CL-001 / CL-002 / CL-004 |
| US-005 | 作为 third-party / enterprise integration developer，我希望通过可运行的最小接入路径验证平台能力，以便在投入集成前判断 SDK 是否可用。 | 核心闭环 | 降低外部和企业集成的试用门槛 | 支撑 CL-003 / CL-005 |
| US-006 | 作为 security / compliance reviewer，我希望错误、trace、redaction 和凭据材料保护在三语言默认一致，以便 SDK 不因语言差异泄露敏感信息或破坏审计链路。 | 核心闭环 | 保证安全和合规门禁跨语言生效 | 支撑 CL-004 |
| US-007 | 作为 documentation / example maintainer，我希望 quickstart、docstring 和跨语言示例持续可运行，以便开发者可以按文档完成最小接入。 | 核心闭环 | 让文档成为可验证接入路径，而不是静态说明 | 支撑 CL-003 / CL-005 |
| US-008 | 作为 release maintainer，我希望版本同步、兼容声明和 deprecated 过渡清晰可维护，以便 SDK 消费者能可预期地升级。 | 核心闭环 | 降低跨语言版本漂移和 breaking change 风险 | 支撑 CL-005 |
| US-009 | 作为 architecture / standards reviewer，我希望 SDK 始终守住 core truth、bus runtime、server facade 和 UI 边界，以便官方 client 不反向污染平台分层。 | 核心闭环 | 保证 SDK 的职责边界长期稳定 | 支撑 CL-001 / CL-002 / CL-005 |

### 7.2 外围增强故事结论

| 故事编号 | 用户故事 | 目标类型 | 业务价值 | 当前处理 |
|---|---|---|---|---|
| US-P1-001 | 作为外部开发者，我希望 SDK 正式发布到 crates.io、PyPI 和 npm，以便可以通过公共注册表安装。 | 外围增强 | 提升公开获取和生态分发便利性 | 发布阶段目标；当前 P0 先做本地 package candidate |
| US-P1-002 | 作为 runtime / tool developer，我希望 SDK 提供完整 MCP Client，以便统一接入 MCP 能力。 | 外围增强 | 提升工具生态接入体验 | P1 候选；不阻塞官方 client 主闭环 |
| US-P2-001 | 作为集成开发者，我希望 SDK 提供 REST / GraphQL wrapper，以便适配非原生协议接入场景。 | 外围增强 | 扩大接入形态 | P2 候选；不得让 SDK 变成 server facade |
| US-P2-002 | 作为开发者，我希望 SDK 提供 REPL / playground，以便交互式探索平台能力。 | 外围增强 | 改善学习和调试体验 | 后续开发体验增强 |
| US-P2-003 | 作为产品开发者，我希望 SDK 提供本地缓存或离线状态管理，以便提升端侧体验。 | 外围增强 | 提升产品体验 | 归产品层或后续增强，当前不进入主闭环 |

### 7.3 故事与闭环映射结论

| 闭环节点 | 支撑故事 |
|---|---|
| CL-001 三语言稳定承接 | US-001 / US-004 / US-009 |
| CL-002 官方客户端一致 | US-001 / US-002 / US-003 / US-004 / US-009 |
| CL-003 最小可验证接入 | US-002 / US-003 / US-005 / US-007 |
| CL-004 横切默认一致 | US-003 / US-004 / US-006 |
| CL-005 文档与兼容演进 | US-005 / US-007 / US-008 / US-009 |

### 7.4 边界外故事排除结论

| 候选故事 | 当前处理 |
|---|---|
| SDK 负责身份认证、权限裁决或 OAuth provider | 排除，归安全入口、identity、gateway 或 governance |
| SDK 负责 bus 投递、retry、dead-letter、replay runtime | 排除，归 `L0-bus` |
| SDK 负责具体 L1/L2/L3/L4 业务流程 | 排除，归对应服务仓；SDK 只封装正式边界 |
| SDK 负责 React / Vue 组件、页面状态和产品工作流 | 排除，归 L5/L6 产品仓 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §8。

```md
## 8. 用户故事

> 校准来源：
> - `design-calibration/00_req_step_08_user_stories.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“核心闭环故事结论”“外围增强故事结论”和“故事与闭环映射结论”小节，了解 `L0-sdk` 的用户故事如何从角色目标和核心能力闭环收敛而来。

| 故事编号 | 用户故事 | 目标类型 | 业务价值 | 与核心能力闭环的关系 |
|---|---|---|---|---|
| US-001 | 作为 SDK maintainer，我希望三语言 SDK 都承接同一批稳定上游契约和事件语义，以便 SDK 不重新制造平台 truth。 | 核心闭环 | 保证 SDK 是官方接入层，而不是另一个协议来源 | 支撑 CL-001 / CL-002 |
| US-002 | 作为 TypeScript product developer，我希望通过官方客户端使用一致的平台概念，以便端侧产品不再维护私有协议封装。 | 核心闭环 | 降低端侧产品接入分裂和重复封装成本 | 支撑 CL-002 / CL-003 |
| US-003 | 作为 Python runtime / automation developer，我希望在 runtime、脚本和评测流程中复用官方客户端，以便自动化流程不重复处理协议、错误和 trace。 | 核心闭环 | 让 runtime 与自动化接入共享同一套 SDK 体验 | 支撑 CL-002 / CL-003 / CL-004 |
| US-004 | 作为 Rust service / integration developer，我希望复用稳定类型、错误、trace 和事件封装口径，以便内部服务集成不各自发明客户端约定。 | 核心闭环 | 保证内部集成与底层契约和事件语义一致 | 支撑 CL-001 / CL-002 / CL-004 |
| US-005 | 作为 third-party / enterprise integration developer，我希望通过可运行的最小接入路径验证平台能力，以便在投入集成前判断 SDK 是否可用。 | 核心闭环 | 降低外部和企业集成的试用门槛 | 支撑 CL-003 / CL-005 |
| US-006 | 作为 security / compliance reviewer，我希望错误、trace、redaction 和凭据材料保护在三语言默认一致，以便 SDK 不因语言差异泄露敏感信息或破坏审计链路。 | 核心闭环 | 保证安全和合规门禁跨语言生效 | 支撑 CL-004 |
| US-007 | 作为 documentation / example maintainer，我希望 quickstart、docstring 和跨语言示例持续可运行，以便开发者可以按文档完成最小接入。 | 核心闭环 | 让文档成为可验证接入路径，而不是静态说明 | 支撑 CL-003 / CL-005 |
| US-008 | 作为 release maintainer，我希望版本同步、兼容声明和 deprecated 过渡清晰可维护，以便 SDK 消费者能可预期地升级。 | 核心闭环 | 降低跨语言版本漂移和 breaking change 风险 | 支撑 CL-005 |
| US-009 | 作为 architecture / standards reviewer，我希望 SDK 始终守住 core truth、bus runtime、server facade 和 UI 边界，以便官方 client 不反向污染平台分层。 | 核心闭环 | 保证 SDK 的职责边界长期稳定 | 支撑 CL-001 / CL-002 / CL-005 |

公共注册表正式发布、完整 MCP Client、REST / GraphQL wrapper、REPL / playground、本地缓存 / 离线状态管理和全量 L1/L2/L3/L4 client 覆盖属于外围增强故事，不决定当前 P0 核心闭环是否成立。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否保留旧文档中 `new WorkClient()` / `subscribe()` 这类接口动作故事 | 保留在用户故事表 | 后移到功能需求 / 接口与依赖 / 验收标准 | 推荐 B。原因是 Step 8 只写目标级故事，接口动作会破坏需求粒度 |
| Q-002 | 是否把公共注册表正式发布写成 P0 核心故事 | 写成 P0 核心故事 | 作为外围增强和发布阶段目标 | 推荐 B。原因是当前闭环以本地 package candidate 和可运行示例证明 SDK 成立 |
| Q-003 | 是否按三语言分别复制同类故事 | 每种语言都写完整故事组 | 保留三语言代表性故事，并用 CL 映射表达一致性要求 | 推荐 B。原因是复制会放大篇幅但不增加需求信息 |
| Q-004 | 是否把完整 MCP、REST / GraphQL、REPL 写入正式故事表 | 写入核心故事表 | 单列外围增强故事 | 推荐 B。原因是 Step 4 已确认它们不是当前 P0 |

当前建议：接受上述推荐后进入 Step 9。

---

## 10. 进入下一步条件

- 已区分核心闭环故事、外围增强故事和边界外故事。
- 核心故事覆盖 CL-001~CL-005。
- 每条核心故事都有编号、目标类型、业务价值和闭环映射。
- 没有把接口名、功能名、具体语言包目录、发布脚本或验收条件直接写成故事。
