# Step 1. 确认需求基线

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/架构设计讨论流程_SOP.md` Step 1
- 回填章节：`projects/L0-sdk/01-架构设计.md` §1 / §3 / §16

### 2. 本步输入

- 上游文档：
  - `standards/document/架构设计书写规范.md` §4.1 与上游文档的关系声明
  - `standards/document/架构设计讨论流程_SOP.md` Step 1
  - `standards/document/全局项目依赖关系与裁剪规则.md`
  - `projects/L0-sdk/00-需求文档.md`
  - `projects/L0-sdk/01-架构设计.md`
  - `projects/L0-sdk/design-calibration/00_requirements_calibration_flow.md`
- 已确认需求结论：
  - `L0-sdk` 是 Rust / Python / TypeScript 三语言官方客户端接入层。
  - `L0-sdk` 不重新定义 `L0-core` 的 proto / DTO / ErrorCode / TraceContext / metadata / CloudEvents schema。
  - `L0-sdk` 不重新定义 `L0-bus` 的 publish / subscribe / ack / retry / dead-letter / replay / tap 语义。
  - 当前 P0 主闭环是三语言稳定承接、官方客户端一致、最小可验证接入、横切默认一致、文档与兼容演进。
  - 当前 P0 先保证本地 package candidate、可运行示例、跨语言 smoke、trace / error / redaction 和兼容证据。

### 3. SOP 问题回答

1. 当前架构设计依赖哪些需求结论？

   回答：依赖新版 `00-需求文档.md` 中已收稳的本仓定位、目标与非目标、使用方与依赖、核心能力闭环、功能需求 F-001~F-010、业务规则 BR-001~BR-014、数据归属、接口依赖、非功能要求、验收标准、风险清单和需求追溯矩阵。

2. 这些需求结论里，哪些已经稳定？

   回答：稳定结论包括 `L0-sdk` 的三语言官方客户端接入层定位、`L0-core` / `L0-bus` 作为上游 truth、SDK 不拥有服务端业务 truth、不执行认证授权或治理审批、不承担 UI / runtime loop、三语言核心概念语义一致、本地 package candidate 先于公共注册表、敏感正文和凭据正文禁止保存。

3. 哪些需求结论仍然待确认？

   回答：P0 最小可验证接入采用哪个稳定服务边界或 fake / fixture endpoint、性能阈值、candidate 验证报告格式、公共注册表正式发布阶段、完整 MCP Client / REST / GraphQL / REPL / 本地缓存重新评估时机、全量 L1/L2/L3/L4 client 覆盖阶段仍待后续设计确认，但不阻塞架构目标与边界讨论。

4. 哪些需求会直接影响架构边界？

   回答：SDK 只能作为客户端接入层；不得变成 binding-only 仓、服务端 gateway / facade、auth provider、UI 组件库、runtime 执行框架或本地状态缓存层。`L0-core` / `L0-bus` 是编译期上游；L1/L2/L3/L4 能力只能通过正式运行期 API 或 fake / fixture endpoint 进入；下游产品、runtime、生态和第三方是 SDK 消费方。

5. 哪些需求会直接影响数据所有权？

   回答：官方客户端公共概念与语言映射、package candidate 状态、默认错误 / trace / redaction 行为、版本兼容与 deprecated 结论、quickstart / docstring / 示例、跨语言验证证据属于 SDK truth。core 契约、bus 事件语义、服务边界、ErrorCode / TraceContext / metadata 只能作为快照或引用。业务对象正文、事件 payload 正文、生产请求响应正文、观测日志正文、UI / runtime 状态正文、凭据和密钥正文禁止保存。

6. 哪些需求会直接影响依赖方向或一致性策略？

   回答：`L0-sdk` 编译期依赖 `L0-core` 与 `L0-bus`；运行期封装 L1/L2/L3/L4 正式 API；通过 fake / fixture endpoint 支撑最小验证；被 L5/L6、`L2-runtime`、自动化脚本和第三方集成消费。三语言一致性策略是“平台概念语义一致、语言表达可以 idiomatic”，并通过上游版本引用、兼容判断、跨语言 smoke、redaction 和 trace 验证维持。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 文档头部 | 旧文档仍引用旧通则、旧草案和待定评审信息,没有声明新版 `00-需求文档.md` 是直接基线 | 后续章节容易继续继承旧 SDK 草案而不是需求校准结论 |
| §1 业务背景与驱动力 | 把公共发包、认证、trace、错误处理、第三方体验混在一起描述 | 没有区分 P0 当前闭环、发布阶段目标和候选增强 |
| §2 约束条件 | 把三语言发布、包体积、CI 时长等写成固定架构约束 | 混入实施、测试和发布计划内容 |
| §3 架构风格与选型 | 提前确定 `generated binding + language-specific thin wrapper` | 技术选型应在 Step 10 决策,当前只能作为候选方案 |
| §4 系统边界与上下文 | 把 external developers / L1-L6 repos 平铺到一个粗图中 | 无法表达编译期依赖、运行期封装、事件协作和下游消费的差异 |
| §5 限界上下文 | 直接按 Codegen / Rust SDK / Python SDK / TS SDK / Examples 切上下文 | 可能把实现目录和语言包形态提前固化为架构真相 |
| §6 容器 / 部署架构 | 把 registry、CI、package build 作为容器主线 | 旧文档更像发布流水线说明,不够体现 SDK 架构边界 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构基线 | 旧 `01-架构设计.md` 直接承接 `sdk-draft` 和公共发包叙事 | 以新版 `00-需求文档.md` v0.2.0 为直接需求基线 | 架构必须承接已收稳需求 |
| 仓定位 | 三语言 SDK / codegen / package registry 混合 | 三语言官方客户端接入层 | 避免把生成机制和发布渠道提升为仓级身份 |
| 上游 truth | proto、bus、auth、trace、service API 分散描述 | `L0-core` 与 `L0-bus` 是直接稳定上游 truth | 守住 core / bus 单一真相 |
| P0 范围 | 公共注册表、完整 MCP、REST / GraphQL、REPL 容易混入主线 | 本地 candidate、最小接入、三语言一致、横切默认、文档兼容为主线 | 对齐需求裁剪 |
| 数据归属 | 旧文档未系统区分 truth / snapshot / ref / forbidden body | 按 SDK truth、上游快照、外部引用、禁止正文组织 | 支撑后续数据所有权推导 |
| 依赖方向 | L1-L6 repos 粗粒度依赖 SDK | 编译期、运行期、事件协作和下游消费分层 | 防止把运行期封装误写成源码依赖 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：继续沿用旧架构基线,只局部修正文案 | 改动小 | 旧 P0、旧依赖和旧发布口径会持续污染后续设计 | 不采用 |
| 方案 B：以新版 `00-需求文档.md` 为唯一需求基线,旧架构只作诊断和可迁移事实来源 | 边界清晰,能与需求追溯矩阵对齐 | 需要重建大部分架构章节 | 采用 |
| 方案 C：以 `architecture/sdk-draft/README.md` 作为架构主线 | 能保留历史实现想法 | 草案未按最新 core / bus / 依赖裁剪口径收束 | 不采用 |

### 7. 结构化中间产物

#### 7.1 架构需求基线清单

| 需求结论 | 来源章节 | 架构影响 | 稳定性 |
|---|---|---|---|
| `L0-sdk` 是 Rust / Python / TypeScript 三语言官方客户端接入层 | 需求 §2 / §4 | 决定系统边界、职责边界和限界上下文 | 稳定 |
| SDK 不重新定义 `L0-core` 共享契约 truth | 需求 §1 / §10 / §14 | 决定上游依赖、数据所有权和一票否决项 | 稳定 |
| SDK 不重新定义 `L0-bus` 事件语义 truth | 需求 §1 / §10 / §14 | 决定事件封装边界和 bus 协作方式 | 稳定 |
| 核心闭环为三语言承接、官方客户端一致、最小接入、横切默认、文档兼容 | 需求 §7 / §9 / §16 | 决定架构目标、主要结构和关键交互主线 | 稳定 |
| 编译期依赖限定为 `L0-core` / `L0-bus`;L1/L2/L3/L4 是运行期封装目标 | 需求 §6 / §12 | 决定依赖方向与层间约束 | 稳定 |
| SDK truth、上游快照、引用数据和禁止正文四类数据归属已收稳 | 需求 §11 / §14 | 决定数据所有权和一致性策略 | 稳定 |
| 本地 package candidate 与 fake / fixture endpoint 支撑当前最小验证 | 需求 §6 / §9 / §14 / §15 | 决定容器 / 部署视图、测试边界和演进路线 | 稳定但目标待定 |
| 公共注册表、完整 MCP、REST / GraphQL、REPL、本地缓存、全量 client 覆盖后移 | 需求 §4 / §8 / §9 / §15 | 决定当前架构不把这些写成 P0 主线 | 稳定 |

#### 7.2 架构硬约束清单

| 硬约束 | 约束影响 |
|---|---|
| 不得重新定义 `L0-core` 已拥有的契约、错误、trace、metadata 和 CloudEvents schema | 职责边界、系统上下文、数据所有权和技术选型必须把 core 作为契约来源 |
| 不得重新定义 `L0-bus` 已拥有的事件传递、订阅、确认、失败、死信、回放和 tap 语义 | 事件 client 只能封装 bus 视图,不能拥有 bus runtime truth |
| 不得把 SDK 设计成服务端 gateway / facade | 运行期 API 封装不得变成服务端业务编排或业务 truth 聚合 |
| 不得让 SDK 执行认证授权、治理审批、身份生命周期或权限裁决 | auth / identity / governance 只能作为外部边界或调用上下文,不能进入 SDK truth |
| 不得把 L1/L2/L3/L4 服务仓写成 SDK 源码依赖 | 依赖方向必须区分编译期依赖和运行期正式 API |
| 不得保存业务正文、事件 payload 正文、生产请求响应正文、观测正文、UI / runtime 状态正文或凭据正文 | 数据所有权、日志、示例、报告和错误材料必须默认 redaction |
| 不得让公共注册表、完整 MCP、REST / GraphQL、REPL 或本地缓存阻塞当前 P0 | 演进路线和非目标必须保留外围增强边界 |

#### 7.3 未关闭需求风险清单

| 风险 / 待确认项 | 架构处理口径 | 是否阻塞 Step 2 |
|---|---|---|
| P0 最小可验证接入的稳定服务边界或 fake / fixture endpoint 未定 | Step 4 / Step 6 / Step 9 明确可验证目标形态;测试方案再落证据 | 否 |
| 性能、初始化耗时、包体积和微基准阈值未定 | Step 12 保留横切度量要求;测试方案确定阈值 | 否 |
| candidate 验证报告、reports 和 artifacts 格式未定 | Step 12 / Step 14 保留追溯风险;测试和实施计划落具体格式 | 否 |
| 公共注册表正式发布阶段未定 | Step 13 演进路线处理,不进入当前 P0 | 否 |
| 完整 MCP、REST / GraphQL、REPL、本地缓存重新评估时机未定 | Step 13 演进路线处理,不进入当前 P0 | 否 |
| 全量 L1/L2/L3/L4 client 覆盖阶段未定 | Step 13 演进路线处理;当前只要求可运行最小接入 | 否 |
| 旧架构仍有公共发包 P0、具体 codegen 风格和语言包目录提前固化等旧口径 | 本轮逐 Step 重建,Step 16 删除旧文件并重建正式架构文档 | 否 |

### 8. 回填草稿

正式 `01-架构设计.md` 后续生成时：

- §1 “与上游文档的关系声明”摘录本文件 §7.1 中与上游来源相关的结论，并结合 `00-需求文档.md` §1 补来源表。
- §3 “约束条件”摘录本文件 §7.2 和 §7.3。
- §16 “需求追溯矩阵”在 Step 15 统一生成，本 Step 仅提供追溯基线。

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 架构基线是否以新版 `00-需求文档.md` 为直接基线 | A. 以新版需求为唯一需求基线;B. 新旧架构混用;C. 继续沿用旧架构 | A | 新版需求已经明确替换旧 P0、旧发布和旧依赖口径 | 已确认采用 A |
| `sdk-draft` 是否作为架构主线直接继承 | A. 直接继承;B. 作为历史草案和可迁移事实来源;C. 完全不读 | B | 其中有三语言、codegen、client、events 等事实线索,但不能高于新版需求结论 | 已确认采用 B |
| 公共注册表正式发布是否作为当前架构 P0 | A. 作为 P0;B. 当前只保留本地 package candidate,公共发布进入演进路线;C. 完全删除 | B | 需求已确认当前先保证本地可验证和版本治理,公共发布是后续阶段 | 已确认采用 B |

#### 9.2 本 Step 未确认事项

- 无阻塞 Step 2 的待确认事项。
- P0 最小可验证目标、性能阈值、证据格式、公共发布阶段、完整 MCP / REST / GraphQL / REPL / 本地缓存和全量 client 覆盖阶段均挂入风险或后续 Step。

### 10. 进入下一步条件

- 已明确新版 `00-需求文档.md` v0.2.0 是直接需求基线。
- 已明确旧 `01-架构设计.md` 和 `architecture/sdk-draft/README.md` 只能作为问题诊断和可迁移事实来源。
- 已形成架构需求基线清单、架构硬约束清单和未关闭需求风险清单。
- 可以进入 Step 2 明确架构目标与约束。
