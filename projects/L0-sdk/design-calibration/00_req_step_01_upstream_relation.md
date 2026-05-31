# Step 1. 与上游文档的关系声明

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 1
> 回填章节: `00-需求文档.md` §1 与上游文档的关系声明
> 生成日期: 2026-05-30

---

## 1. 本步目标

先校准 `L0-sdk` 需求文档的语义来源，明确它承接哪些上游结论，而不是重新定义 core 契约、bus 投递语义、领域服务事实、身份管理、UI 组件或运行时执行逻辑。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `projects/L0-sdk/README.md` | 旧版仓定位材料 | 作为旧口径诊断输入，识别仍可保留的使命、依赖和开放问题 |
| `projects/L0-sdk/00-需求文档.md` | 旧版需求文档 | 作为旧需求诊断输入，不作为新版正式基线 |
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为直接稳定上游，承接共享契约、proto / DTO、错误、trace、metadata、配置和 evidence 口径 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为直接稳定上游，承接事件发布、订阅、ack、retry、dead-letter、replay、tap 和报告证据口径 |
| `product/产品矩阵.md` | SDK 产品定位输入 | 承接 SDK 作为开发者接入层、端侧统一接入层和三语言形态的产品定位 |
| `product/产品遵循规范清单.md` | 产品侧强制规则 | 承接端侧产品必须经 SDK 接入、SDK breaking change gate、版本同步和 deprecated API 过渡期 |
| `architecture/仓库拆分方案.md` | 27 仓七层分层输入 | 承接 `L0-sdk` 位于 L0 共享契约层、依赖 `L0-core` / `L0-bus` 的定位 |
| `architecture/开发路线图与优先级.md` | 路线图输入 | 承接 N0 / N8 中 SDK 最小客户端、三语言发布和正式版节奏 |
| `architecture/标准对齐全景图.md` | 标准对齐输入 | 承接 25010 Interaction Capability、MCP Client、9001 文档完备和“SDK 不跑过程”的边界 |
| `architecture/sdk-draft/README.md` | 旧 SDK 草案 | 作为候选事实、术语和风险来源，不高于新版需求结论 |
| `architecture/proto-draft/README.md` | 旧 proto 草案 | 作为历史类型生成线索，实际以 `L0-core` 稳定契约为准 |
| `architecture/bus-draft/README.md` | 旧 bus 草案 | 作为事件订阅封装线索，实际以 `L0-bus` 稳定需求和设计为准 |
| `standards/子项目遵循规范清单.md` | 子项目规则输入 | 承接 SK1~SK6 和公共仓库规则 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪基线 | 承接 `L0-sdk` 对 `L0-core` / `L0-bus` 的编译期依赖，以及对 L1+ API 的运行期封装关系 |

---

## 3. SOP 问题回答

### 3.1 本文承接哪些上游文档？

本文直接承接四类上游：

1. 已稳定基础仓结论：`projects/L0-core/00`~`07`、`projects/L0-bus/00`~`07`。
2. 全局产品与架构结论：`product/产品矩阵.md`、`product/产品遵循规范清单.md`、`architecture/仓库拆分方案.md`、`architecture/开发路线图与优先级.md`、`architecture/标准对齐全景图.md`。
3. 历史草案与候选事实：`architecture/sdk-draft/README.md`、`architecture/proto-draft/README.md`、`architecture/bus-draft/README.md`。
4. 规范与依赖基线：`standards/子项目遵循规范清单.md`、`standards/document/全局项目依赖关系与裁剪规则.md`。

其中 `L0-core` 与 `L0-bus` 是最重要的直接稳定上游。`L0-sdk` 不再重新定义 core 契约或 bus 投递语义，而是在三语言中提供一致但符合语言习惯的客户端封装。

### 3.2 承接的是上游哪一部分主题？

本仓承接的主题是：在 `L0-core` 提供共享契约、`L0-bus` 提供事件传递语义之后，`L0-sdk` 如何把这些底层能力包装成 Rust / Python / TypeScript 三语言可用、可学习、可追踪、可发布的客户端接入层。

具体承接关系如下：

| 上游主题 | `L0-sdk` 承接方式 |
|---|---|
| `L0-core` 的共享类型、错误、trace、metadata、event envelope | 作为生成类型和高层错误 / trace 封装来源，不在 SDK 手写或另造 schema |
| `L0-bus` 的 publish / subscribe / ack / retry / DLQ / replay / tap | 作为事件发布与订阅高层接口的语义来源，不在 SDK 内实现总线运行时 |
| 产品矩阵中的开发者接入层 | 转译为三语言 SDK、quickstart、docstring、示例和统一 client 体验需求 |
| 产品侧“端侧产品通过 SDK 访问能力”规则 | 转译为 L5/L6 产品和第三方接入的默认消费方式 |
| 标准对齐中的 25010 / MCP / 9001 | 转译为 learnability、跨语言一致性、MCP Client 能力和文档完备要求 |
| 全局依赖裁剪规则 | 转译为编译期依赖 `L0-core` / `L0-bus`，运行期封装 L1+ API，而不是源码依赖 L1+ |

### 3.3 本文为什么不是重新定义该主题？

因为 `L0-sdk` 的主题不是“契约是什么”或“事件如何投递”，而是“开发者如何一致、低成本、安全地消费已经定义好的契约和服务能力”。如果 SDK 重新定义类型、事件语义或领域事实，会造成 `L0-core` / `L0-bus` / L1+ 与 SDK 多真相。

本文只把上游已经成立的能力转译为 SDK 仓的需求边界：

- 如何生成和包装 `L0-core` 类型。
- 如何封装 `L0-bus` 事件发布和订阅视图。
- 如何提供三语言 idiomatic client。
- 如何注入 trace、映射错误、处理认证材料和 redaction。
- 如何提供 quickstart、docstring、示例、版本同步和 breaking change 过渡。
- 如何避免端侧产品、runtime、第三方重复手写 client。

### 3.4 本文在当前仓里承担什么细化作用？

本文承担 `L0-sdk` 的仓级需求基线作用。它需要回答：

- `L0-sdk` 作为 L0 客户端接入层要做什么。
- 它与 `L0-core`、`L0-bus`、L1+ 服务、L2 runtime、L5/L6 产品和第三方开发者的边界是什么。
- 哪些能力属于 P0 主闭环，哪些只是历史草案中的候选增强。
- 后续架构、概要、详细、配置、测试、验收、实施计划应围绕哪些需求结论展开。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 文档头部 | 写“三语言统一接入层”，并把需求来自下游端侧、runtime、第三方 | 方向基本正确，但缺少已稳定 `L0-core` / `L0-bus` 上游承接关系 | 后续正式文档明确 SDK 消费 core / bus，不重新定义底层契约 |
| 文档头部 | 写“下游文档: `01` -> `02` -> `03` -> `04-实施计划.md`” | 最新主链已有 `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` | Step 17 重建正式文档时统一改为 `00`~`07` 主链 |
| §1 | 只写“与 `product/` 的关系声明” | 来源过窄，漏掉稳定 L0 上游、全局依赖裁剪、仓库拆分、标准对齐和历史草案 | 正式 §1 改为“与上游文档的关系声明” |
| §2 | 写“25 仓重复劳动” | 当前总项目计划已按 27 仓口径推进 | 后续问题定义改为当前仓际网络口径，不继续使用旧量化 |
| §3 | 写三语言发版到 crates.io / PyPI / npm | 这是长期发布目标，但当前本地实现阶段不应强制公共发布 | 后续目标区分 P0 本地可验证包 / P1 公共发布 |
| §6 | 把 REST / GraphQL gateway、REPL / playground 放入功能需求 | 可能是后续增强，不应污染 P0 主闭环 | 后续 Step 9 分 P0/P1/P2 重新收束 |
| 旧文档整体 | 已包含认证、MCP、trace、redaction、版本同步等线索 | 有可迁移事实，但缺少最新 SOP 的来源追溯 | 逐 Step 判断哪些进入新版需求 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 来源层级 | 主要从 `product/产品矩阵.md` 和旧 sdk 草案出发 | 从稳定 `L0-core` / `L0-bus` + 产品 / 架构 / 标准 / 草案共同收敛 | SDK 的输入依赖已经随着 core / bus 校准稳定，不能继续按旧草案孤立设计 |
| 来源章节名称 | 与 `product/` 的关系声明 | 与上游文档的关系声明 | 需求来源不只来自 product |
| 上游权威顺序 | `architecture/sdk-draft` 被当成主要设计输入 | 稳定正式文档优先，sdk-draft 只是候选事实 | 避免旧草案中的实现细节和旧范围直接进入需求 |
| core / bus 关系 | 写 proto binding 和 bus 语义，但未以稳定上游方式声明 | 明确 core / bus 是直接稳定上游，SDK 只消费和封装 | 防止 SDK 重复定义类型、事件和投递语义 |
| 文档链 | 缺 `04-配置设计.md` 和 `07-实施计划.md` | 按 `00`~`07` 主链校准 | 对齐当前文档规范 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 继续以 `architecture/sdk-draft` 为权威来源 | 内容多，能快速迁移旧草案 | 会继承旧范围、旧目录和实现假设，且可能与稳定 core / bus 冲突 | 不采用 |
| 方案 B: 以稳定 `L0-core` / `L0-bus` 为直接上游，产品 / 架构 / 标准 / 草案作为补充来源 | 依赖方向清楚，能避免 SDK 成为多真相层 | 需要逐 Step 重新裁剪旧草案内容 | 采用 |
| 方案 C: 只把 SDK 写成三语言 binding 生成仓 | 边界很轻，易实现 | 不能覆盖高层 client、trace、error mapping、redaction、quickstart 和端侧统一接入诉求 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 上游文档来源结论

| 来源文档 | 上游章节 / 模块 | 承接内容 | 权威级别 |
|---|---|---|---|
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 共享契约、proto / DTO、Error、TraceContext、CloudEvents、配置、测试和 evidence | SDK 类型生成、错误映射、trace 传播、配置和测试证据的直接上游 | 直接稳定上游 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | publish / subscribe / ack / retry / DLQ / replay / tap / reports | SDK 事件发布、订阅、确认、失败和报告读取封装的直接上游 | 直接稳定上游 |
| `product/产品矩阵.md` | §6.2 SDK、§9 发布节奏 | SDK 是开发者接入层、端侧统一接入层、三语言形态、版本同步和 deprecated 过渡期 | 产品输入 |
| `product/产品遵循规范清单.md` | SDK 条目、端侧产品规则 | 端侧产品通过 SDK 接入、SDK breaking change gate、版本和文档约束 | 产品规则输入 |
| `architecture/仓库拆分方案.md` | §3.3 `quantalithos-sdk`、依赖方向矩阵 | L0-sdk 的层级、依赖 core / bus、三语言 client 和高层封装定位 | 全局架构输入 |
| `architecture/开发路线图与优先级.md` | N0 / N8 / 路线图矩阵 | SDK 最小客户端、三语言发布和正式版演进节奏 | 全局路线图输入 |
| `architecture/标准对齐全景图.md` | `quantalithos-sdk` 条目 | 25010 Interaction Capability、MCP、9001 Documented Information、过程标准不适用 | 标准输入 |
| `architecture/sdk-draft/README.md` | 旧 SDK 草案 | 三语言组织、codegen、client、events、auth、MCP、tracing、retry、文档和发版候选事实 | 历史草案输入 |
| `architecture/proto-draft/README.md` | 旧 proto 草案 | 生成 binding 和 breaking change 线索，实际以 `L0-core` 正式文档为准 | 历史草案输入 |
| `architecture/bus-draft/README.md` | 旧 bus 草案 | 事件订阅封装和 sdk / bus 关系线索，实际以 `L0-bus` 正式文档为准 | 历史草案输入 |
| `standards/子项目遵循规范清单.md` | `quantalithos-sdk` SK1~SK6 | 三语言发版、类型生成、breaking change、docstring、trace、MCP 等强制项 | 规范输入 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | L0-sdk 依赖行 | 编译期依赖 `L0-core` / `L0-bus`，运行期封装 L1+ API，事件协作按能力封装 | 依赖基线输入 |

### 7.2 承接主题结论

`L0-sdk` 承接的不是契约定义、事件总线实现或领域服务真相，而是基于稳定 core / bus 的三语言客户端接入能力。它的需求主线应围绕以下主题展开：

| 主题 | 说明 |
|---|---|
| 三语言高层 client | Rust / Python / TypeScript 都提供符合语言习惯的高层 client，不让使用者直接面对裸生成代码 |
| 类型生成与版本锁定 | 从 `L0-core` 稳定契约生成 binding，并通过版本锁和兼容规则管理变更 |
| 事件消费封装 | 封装 `L0-bus` 的 publish / subscribe / ack / failure / replay view，但不实现 bus runtime |
| Trace / Error / Redaction | 默认传播 W3C Trace Context，映射统一错误，避免敏感信息进入日志和异常文本 |
| 文档和示例 | 通过 quickstart、docstring、示例和 cross-lang smoke test 保证可学习性 |
| 版本与发布治理 | 支持三语言版本同步、breaking change gate 和 deprecated API 过渡期 |

### 7.3 收束说明结论

```text
L0-core
  defines shared contracts, generated types, errors, trace, metadata
  |
  v
L0-bus
  defines event delivery, subscription, ack, retry, DLQ, replay, tap semantics
  |
  v
L0-sdk
  wraps core and bus capabilities into Rust / Python / TypeScript client APIs
  |
  v
L1+ / L2 / L5 / L6 / third-party developers
  consume Quantalithos capabilities without redefining contracts or transport truth
```

本图只表达需求来源和依赖方向，不表达具体 crate 结构、包结构、代码生成脚本、HTTP / RPC 路由或发布流水线。

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §1。

```md
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/00_req_step_01_upstream_relation.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前文档问题诊断”和“设计取舍”小节，了解本章上游来源和承接边界如何收敛。

本文承接已经稳定的 `L0-core` 与 `L0-bus` 设计结论，以及全局产品、架构、路线图、标准对齐、依赖裁剪和历史 SDK 草案中的相关输入。本文不重新定义 core proto / DTO、CloudEvents schema、Error、TraceContext、metadata，也不重新定义 bus 的 publish / subscribe / ack / retry / dead-letter / replay / tap 语义；这些由 `L0-core` 与 `L0-bus` 承载。本文只把这些已成立的基础能力，收束为 `L0-sdk` 的 Rust / Python / TypeScript 三语言 client、类型生成、事件封装、trace 传播、错误映射、redaction、文档示例、版本同步和发布治理需求基线。

| 来源文档 | 承接内容 |
|---|---|
| `projects/L0-core/00-需求文档.md` ~ `07-实施计划.md` | 共享契约、proto / DTO、Error、TraceContext、CloudEvents、metadata、配置和测试证据口径 |
| `projects/L0-bus/00-需求文档.md` ~ `07-实施计划.md` | publish / subscribe / ack / retry / dead-letter / replay / tap / reports 等事件传递语义 |
| `product/产品矩阵.md` | SDK 作为开发者接入层、端侧统一接入层、三语言形态和版本同步的产品定位 |
| `product/产品遵循规范清单.md` | 端侧产品必须通过 SDK 接入、SDK breaking change gate、deprecated API 过渡期和文档要求 |
| `architecture/仓库拆分方案.md` | `L0-sdk` 位于 L0 共享契约层，并依赖 `L0-core` / `L0-bus` 的分层位置 |
| `architecture/开发路线图与优先级.md` | SDK 最小客户端、三语言发布和正式版演进节奏 |
| `architecture/标准对齐全景图.md` | 25010 Interaction Capability、MCP Client、9001 Documented Information 和“SDK 不跑过程”的标准边界 |
| `architecture/sdk-draft/README.md` | 三语言组织、codegen、client、events、auth、MCP、tracing、retry、文档和发版候选事实 |
| `architecture/proto-draft/README.md` | 历史类型生成线索，实际以 `L0-core` 正式文档为准 |
| `architecture/bus-draft/README.md` | 历史事件订阅封装线索，实际以 `L0-bus` 正式文档为准 |
| `standards/子项目遵循规范清单.md` | SK1~SK6 和公共仓库规则 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `L0-sdk` 的编译期依赖、运行期封装和事件协作依赖裁剪口径 |

旧 `README.md` 和旧 `00-需求文档.md` 中可保留“三语言 client 封装、统一接入层、类型生成、事件订阅、trace、redaction、文档示例、版本同步”等事实线索；但旧的 `25 仓`、缺少 `04-配置设计.md` / `07-实施计划.md` 的文档链、把公共发包作为 P0 验收的口径不直接继承，后续章节将按 27 仓、`00`~`07` 主链和已稳定 `L0-core` / `L0-bus` 边界重新收束。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | `architecture/sdk-draft` 的权威级别 | 作为正式需求直接继承 | 作为历史草案和候选输入 | 推荐 B。原因是 sdk-draft 包含实现目录、发版假设和旧范围，不能高于新版需求 SOP、稳定 `L0-core` 与稳定 `L0-bus` |
| Q-002 | 公共发包 crates.io / PyPI / npm 是否进入 P0 验收 | P0 要求公共仓可发布 | P0 要求本地可验证包和发版契约，公共发布后移到发布阶段 | 推荐 B。原因是当前实现可能仍在本机 `/home/aris/Projects` 本地 path / workspace 依赖阶段，需求应先保证可实现和可验证 |
| Q-003 | MCP Client 能力是否放入 P0 | P0 直接实现完整 MCP Client | 先保留为需求来源，后续 Step 4 / Step 9 决定 P0/P1 | 推荐 B。原因是 MCP 是标准输入，但是否阻塞 SDK 主闭环需要在目标和功能需求步骤中裁剪 |

当前建议：接受上述推荐后进入 Step 2。

---

## 10. 进入下一步条件

- 已明确 `L0-sdk` 直接稳定上游是 `L0-core` 与 `L0-bus`。
- 已明确本文不重新定义 core 契约、CloudEvents schema、Error、TraceContext、metadata 和 bus 投递语义。
- 已明确 `architecture/sdk-draft`、`proto-draft`、`bus-draft` 只是候选输入和历史线索，不高于新版需求结论。
- 已识别旧文档中需要后续清理的旧口径。
