# Step 6. 使用方与依赖

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 6
> 回填章节: `00-需求文档.md` §6 使用方与依赖
> 生成日期: 2026-05-30

---

## 1. 本步目标

说明 `L0-sdk` 在仓际协作网络中依赖谁、为谁提供能力，以及哪些依赖会阻塞当前官方客户端接入层闭环成立；本步不写角色说明、不写用户故事、不写接口签名、不写 DTO / 事件 schema，也不写语言包目录结构。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓定位与边界 | 确认 SDK 是三语言官方客户端接入层，不是 core truth、bus runtime 或 server facade |
| Step 5 用户与角色 | 将 TypeScript / Python / Rust 使用者、SDK maintainer、release / security / architecture reviewer 映射为仓际协作关系 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 从总依赖矩阵裁剪出 `L0-sdk` 相关依赖边，并标注编译期 / 运行期 / 事件协作依赖 |
| `L0-core` 稳定文档 | 作为 SDK 共享契约、类型、错误、trace、metadata 的直接稳定上游 |
| `L0-bus` 稳定文档 | 作为 SDK 事件发布、订阅、确认、失败、replay / tap view 的直接稳定上游 |
| Step 4 目标与非目标 | 确认公共注册表、完整 MCP、REST / GraphQL、REPL 不作为当前 P0 闭环前置 |

---

## 3. SOP 问题回答

### 3.1 本仓向哪些仓 / 系统提供哪些能力？

`L0-sdk` 对外提供的是官方客户端接入能力，而不是服务端业务能力：

| 使用方 | 获得能力 |
|---|---|
| L5 产品仓 | 通过 TypeScript SDK 访问平台能力，避免端侧产品私有直连 L1+ 服务 |
| L6 生态仓 | 通过 SDK 复用平台 client、错误、trace、redaction 和版本兼容口径 |
| `L2-runtime` / 自动化脚本 | 通过 Python SDK 消费平台能力，避免 runtime 或脚本重复封装协议 |
| `L2-tools` / `L2-member-service` / `L4-archive` 等内部消费者 | 按需通过 SDK 复用官方 client 体验，不直接复制上游契约 |
| 第三方 / 企业集成代码 | 通过正式 SDK、文档示例和版本兼容承诺接入平台能力 |
| 测试 / 示例 / 发布验证流程 | 通过 SDK package candidate、fake endpoint 和 smoke test 验证三语言一致性 |

### 3.2 本仓依赖哪些仓 / 系统提供哪些能力？

| 依赖对象 | 提供能力 | 是否闭环前置 |
|---|---|---|
| `L0-core` | 共享契约、生成类型、错误、trace、metadata 和基础 envelope | 是 |
| `L0-bus` | 事件发布 / 订阅语义、delivery view、failure / replay / tap view | 是，对事件封装闭环是前置 |
| L1 服务仓 | 领域服务正式 API 边界和业务能力入口 | 是，对领域 client 封装闭环是前置；可按已稳定仓逐步接入 |
| L2 服务 / runtime 仓 | runtime、tools、member service 等需要被 SDK 调用或消费的正式边界 | 否，不阻塞 SDK 基础闭环；按能力逐步纳入 |
| L3 方法 / 能力仓 | method、qualification、tool / MCP 相关能力的正式边界 | 否，当前完整 MCP 是 P1 候选；method client 可按稳定边界接入 |
| L4 基础设施仓 | sandbox、observability、archive 等正式边界和横切材料 | 否，不阻塞 SDK 基础闭环；按产品需要封装 |
| fake / fixture endpoint | SDK 示例、smoke test 和 package candidate 的受控验证目标 | 是，对本地可验证闭环是前置 |

### 3.3 这些关系在全局依赖基线中分别是什么边？

全局依赖基线中，`L0-sdk` 的直接关系是：

- 编译期依赖：`L0-core` / `L0-bus`。
- 运行期依赖：L1 / L2 / L3 / L4 API。
- 事件协作依赖：按能力封装事件消费。
- 被依赖关系：UI / 生态默认通过 SDK 访问能力。

因此，`L0-sdk` 的需求文档只能裁剪出与这些关系有关的子图，不能把全 27 仓矩阵复制进来，也不能把运行期服务能力写成 SDK 的源码依赖。

### 3.4 哪些全局依赖边需要进入本仓需求主链，哪些应被裁剪出去？

进入当前需求主链的边：

- `L0-sdk -> L0-core` 编译期依赖。
- `L0-sdk -> L0-bus` 编译期依赖和事件封装协作。
- `L0-sdk -> L1/L2/L3/L4 API` 运行期封装关系。
- `L5/L6/internal consumers -> L0-sdk` 下游消费关系。
- `L0-sdk -> fake / fixture endpoint` 测试与示例验证关系。

裁剪出去或后移的边：

- `L0-sdk -> crates.io / PyPI / npm` 公共注册表正式发布关系，后移到发布阶段，不作为当前 P0 闭环前置。
- `L0-sdk -> external MCP providers` 完整 MCP Client 关系，作为 P1 候选，不阻塞当前需求闭环。
- `L0-sdk -> REST / GraphQL gateway`，P2 候选，不进入当前主链。
- `L0-sdk -> UI component / local store`，属于产品或后续增强，不进入 SDK 主链。

### 3.5 哪些依赖失效时会影响本仓当前阶段能力？

| 依赖 | 失效影响 |
|---|---|
| `L0-core` 不稳定 | SDK 无法稳定生成类型、映射错误、传播 trace 或表达共享 metadata |
| `L0-bus` 不稳定 | SDK 的事件发布 / 订阅封装无法保持语义一致，事件 client 只能停留在 stub / fake |
| 至少一个稳定服务边界或 fake endpoint 缺失 | SDK 无法证明“官方 client 接入层”在本地可运行，只能证明类型生成 |
| 下游 smoke test 缺失 | 无法验证三语言核心概念、错误、trace、redaction 和示例一致性 |
| 公共注册表不可用 | 不阻塞当前阶段；只影响后续正式发布阶段 |
| 完整 MCP provider 不可用 | 不阻塞当前阶段；只影响 P1 MCP Client 能力 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `00` §1 / §2 | 写 SDK 来自端侧产品、runtime、第三方需求 | 方向正确，但没有区分依赖类型 | 增补编译期 / 运行期 / 事件协作 / 下游消费关系 |
| 旧 `00` §6 | 把 codegen、SDK package、认证、事件订阅、trace、MCP、REST / GraphQL、REPL 平铺为功能 | 功能与依赖边界混写，且候选增强像 P0 | 本步只写能力级依赖关系，优先级留到 Step 9 |
| 旧 `01` / `sdk-draft` | 展开目录、生成脚本、包发布和具体语言结构 | 架构 / 详细设计内容前置 | 本步不写目录结构和实现组织 |
| 旧文档整体 | 公共注册表和完整 MCP 容易被视为当前前置依赖 | 与 Step 4 当前目标不一致 | 公共注册表和完整 MCP 后移，不阻塞当前闭环 |

---

## 5. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 依赖分类 | 只说 core、bus、下游产品和第三方使用 SDK | 明确编译期、运行期、事件协作和下游消费四类关系 |
| `L0-core` | proto / binding 来源 | SDK 的编译期共享契约来源和当前闭环强前置 |
| `L0-bus` | 事件订阅能力来源 | SDK 的事件封装语义来源；事件协作不等于 SDK 拥有 bus runtime |
| L1/L2/L3/L4 | 像所有能力一次性进入 SDK | 作为运行期封装目标，按稳定服务边界逐步进入 |
| L5/L6 | 端侧产品通过 SDK | 作为 SDK 下游消费者，不反向成为 SDK 源码依赖 |
| 公共注册表 | 像 P0 验收前置 | 后移到发布阶段；当前先保证本地可验证 package candidate |

---

## 6. 结构化中间产物

### 6.1 仓际能力关系结论

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享契约、生成类型、错误、trace、metadata 和基础 envelope | 是 | SDK 无法形成稳定类型、错误和追踪口径 |
| 输入 | `L0-bus` | 事件发布 / 订阅语义、delivery view、failure / replay / tap view | 是，对事件封装闭环是前置 | SDK 事件 client 只能停留在 stub / fake |
| 输入 | L1 服务仓 | 领域服务正式 API 边界和业务能力入口 | 是，对领域 client 封装闭环是前置 | SDK 无法证明领域能力接入层成立 |
| 输入 | L2 / L3 / L4 能力仓 | runtime、tools、method、capability、sandbox、observability、archive 等正式边界 | 否，按能力逐步纳入 | 对应高级 client 延迟，不阻塞基础 SDK 闭环 |
| 输入 | fake / fixture endpoint | 本地示例、smoke test 和 package candidate 验证目标 | 是 | 无法验证 SDK 最小接入路径可运行 |
| 输出 | L5 产品仓 | TypeScript SDK 和统一端侧接入口径 | 是，对端侧接入目标是前置 | 端侧产品可能继续私有直连 |
| 输出 | L6 生态仓 | SDK client、示例、版本兼容和外部集成接入口径 | 否 | 生态接入延迟，不阻塞 SDK 基础闭环 |
| 输出 | `L2-runtime` / 自动化脚本 | Python SDK 和自动化接入口径 | 是，对 runtime / automation 接入目标是前置 | runtime 或脚本会重复封装协议 |
| 输出 | 内部工具 / 运维 / 归档消费者 | 按需复用官方 client、错误、trace 和 redaction 口径 | 否 | 内部工具体验延迟，不阻塞基础闭环 |

### 6.2 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L0-sdk` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享契约、类型、错误、trace、metadata 是 SDK 基础前置 |
| `L0-bus` | `L0-sdk` 编译期依赖 `L0-bus`，并按能力封装事件消费 | 依赖方 / 协作方 | 编译期 / 事件协作 | 是 | SDK 需要消费 bus 语义并提供事件 client，但不实现 bus runtime |
| L1 服务仓 | `L0-sdk` 运行期依赖 L1 API | 依赖方 | 运行期 | 是 | 领域 client 需要封装服务端正式边界，但不得源码依赖 L1 仓 |
| L2 / L3 / L4 能力仓 | `L0-sdk` 运行期依赖 L2 / L3 / L4 API | 依赖方 | 运行期 | 是，按能力裁剪 | runtime、method、capability、sandbox、observability、archive client 按稳定边界逐步进入 |
| L5 产品仓 | L5 产品编译期 / 运行期消费 `L0-sdk` | 被依赖方 | 下游 package / 运行期消费 | 是 | SDK 是端侧产品统一接入层 |
| L6 生态仓 | L6 生态编译期 / 运行期消费 `L0-sdk` | 被依赖方 | 下游 package / 运行期消费 | 是 | SDK 是生态集成和 marketplace / bridges 接入层 |
| `L2-runtime` / 自动化脚本 | runtime / automation 经 SDK 消费平台能力 | 被依赖方 | 下游 package / 运行期消费 | 是 | Python SDK 是 runtime 与自动化接入的重要目标 |
| 公共注册表 | 旧文档将 crates.io / PyPI / npm 写成发布前置 | 外部发布目标 | 外部系统 | 否 | Step 4 已裁剪为发布阶段目标，不阻塞当前本地可验证闭环 |
| external MCP providers | 旧草案写完整 MCP Client | 外部能力目标 | 外部系统 / 运行期 | 否 | 完整 MCP 是 P1 候选，不阻塞当前 P0 |
| REST / GraphQL gateway | 旧草案候选增强 | 外部 / 相邻能力目标 | 运行期 | 否 | P2 候选，不进入当前主链 |

### 6.3 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享契约、生成类型、错误、trace、metadata | 架构设计 / 详细设计 / 实施计划 |
| 编译期依赖 | `L0-bus` | 使用 bus client contract / transport view 所需契约 | 架构设计 / 详细设计 / 实施计划 |
| 运行期依赖 | L1 服务仓 | 封装领域服务正式边界，不直接依赖服务仓源码 | 架构设计 / 详细设计 |
| 运行期依赖 | L2 / L3 / L4 能力仓 | 封装 runtime、method、capability、sandbox、observability、archive 等正式边界 | 架构设计 / 详细设计 |
| 事件协作依赖 | `L0-bus` | 按能力封装事件发布、订阅、失败和回放视图 | 需求 / 架构 / 测试 |
| 下游 package / 运行期消费 | L5 产品仓、L6 生态仓、`L2-runtime`、内部工具 | 这些消费者使用 SDK package 和 client 能力，SDK 不依赖它们源码 | 测试方案 / 验收标准 / 实施计划 |
| 测试 / 示例依赖 | fake / fixture endpoint | 支撑 quickstart、smoke test、package candidate 本地验证 | 测试方案 / 验收标准 |

### 6.4 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L0-sdk -> L1/L2/L3/L4` 源码依赖 | 会把运行期服务能力误写成 SDK 编译期依赖，扩大 SDK 边界 | 通过正式 API / adapter / fake endpoint 封装 |
| `L0-sdk -> L5/L6` 源码依赖 | 下游产品和生态是 SDK 消费方，不应反向污染 SDK | 下游通过 SDK package 使用能力 |
| `L0-sdk -> UI component / local store` | 会让 SDK 变成产品 UI 或端侧状态管理层 | UI / store 留在产品仓，SDK 只提供 client |
| `L0-sdk -> public registries as P0 blocker` | 公共注册表正式发布不应阻塞当前本地可验证闭环 | 当前先做 package candidate / 本地验证，发布阶段再接入公共注册表 |
| `L0-sdk -> external MCP providers as P0 blocker` | 完整 MCP Client 是 P1 候选，依赖 capability 口径继续收束 | 当前保留边界，后续按功能需求裁剪 |

### 6.5 依赖裁剪 ASCII 图

#### 依赖裁剪图: L0-sdk

```text
Global baseline
  |
  | crop only L0-sdk related edges
  v

L5 products / L6 ecosystem / selected L2-L4 consumers
  -> [compile] L0-sdk
  -> [runtime] L0-sdk

L0-sdk
  -> [compile]       L0-core
  -> [compile]       L0-bus
  -> [event]         L0-bus
  -> [runtime]       L1/L2/L3/L4 formal APIs
```

图示说明：

- 本图只展示 `L0-sdk` 相关依赖边，不展示全 27 仓。
- `[compile]` 可进入 package dependency；`[runtime]` 和 `[event]` 不得写成 SDK 的源码依赖。
- L1/L2/L3/L4 是 SDK 的运行期封装目标，必须通过正式边界、adapter 或 fake endpoint 讨论。
- L5/L6 与部分内部仓是 SDK 下游消费者，不是 SDK 的输入源码依赖。
- 本图不表达调用顺序、接口时序、事件传播时序或实施顺序。

---

## 7. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §6。

```md
## 6. 使用方与依赖

> 校准来源：
> - `design-calibration/00_req_step_06_consumers_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“本仓依赖裁剪表”“本仓依赖类型分类表”和“依赖裁剪 ASCII 图”小节，了解 `L0-sdk` 如何从全局依赖基线中裁剪自己的依赖关系。

### 6.1 内部仓依赖

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享契约、生成类型、错误、trace、metadata 和基础 envelope | 是 | SDK 无法形成稳定类型、错误和追踪口径 |
| 输入 | `L0-bus` | 事件发布 / 订阅语义、delivery view、failure / replay / tap view | 是，对事件封装闭环是前置 | SDK 事件 client 只能停留在 stub / fake |
| 输入 | L1 服务仓 | 领域服务正式 API 边界和业务能力入口 | 是，对领域 client 封装闭环是前置 | SDK 无法证明领域能力接入层成立 |
| 输入 | L2 / L3 / L4 能力仓 | runtime、tools、method、capability、sandbox、observability、archive 等正式边界 | 否，按能力逐步纳入 | 对应高级 client 延迟，不阻塞基础 SDK 闭环 |
| 输入 | fake / fixture endpoint | 本地示例、smoke test 和 package candidate 验证目标 | 是 | 无法验证 SDK 最小接入路径可运行 |
| 输出 | L5 产品仓 | TypeScript SDK 和统一端侧接入口径 | 是，对端侧接入目标是前置 | 端侧产品可能继续私有直连 |
| 输出 | L6 生态仓 | SDK client、示例、版本兼容和外部集成接入口径 | 否 | 生态接入延迟，不阻塞 SDK 基础闭环 |
| 输出 | `L2-runtime` / 自动化脚本 | Python SDK 和自动化接入口径 | 是，对 runtime / automation 接入目标是前置 | runtime 或脚本会重复封装协议 |
| 输出 | 内部工具 / 运维 / 归档消费者 | 按需复用官方 client、错误、trace 和 redaction 口径 | 否 | 内部工具体验延迟，不阻塞基础闭环 |

### 6.2 外部系统依赖

当前阶段，`L0-sdk` 无需要纳入 P0 主链的正式外部系统依赖。公共注册表、完整 MCP provider、REST / GraphQL gateway、REPL / playground 均不作为当前官方客户端接入层闭环前置；当前阶段优先保证本地可验证 package candidate、fake / fixture endpoint、quickstart 和 cross-language smoke test。

### 6.3 依赖裁剪结论

`L0-sdk` 当前最关键的强前置是 `L0-core`、`L0-bus`、至少一个稳定服务边界或 fake endpoint，以及下游 smoke test。L1/L2/L3/L4 能力只能作为运行期封装目标进入设计，不得写成 SDK 的本地源码依赖；L5/L6 和部分内部仓是 SDK 下游消费者，不得反向污染 SDK 主体边界。
```

---

## 8. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | L1/L2/L3/L4 服务能力是否写成 SDK 编译期依赖 | 写成 path / package dependency | 写成运行期正式边界封装 | 推荐 B。原因是 SDK 不拥有服务端业务 truth，也不应源码依赖服务仓 |
| Q-002 | `L0-bus` 对 SDK 是什么依赖 | 只写普通编译期依赖 | 同时写编译期契约依赖和事件协作封装关系 | 推荐 B。原因是 SDK 既消费 bus 契约，也封装事件能力，但不实现 bus runtime |
| Q-003 | 公共注册表是否进入当前 P0 依赖 | 是，作为 P0 外部系统前置 | 否，后移到发布阶段 | 推荐 B。原因是当前阶段以本地可验证 package candidate 为主 |
| Q-004 | 完整 MCP provider 是否进入当前 P0 依赖 | 是，作为 MCP Client 前置 | 否，作为 P1 候选 | 推荐 B。原因是 Step 4 已确认完整 MCP 不阻塞当前主目标 |
| Q-005 | 是否需要把所有 L1/L2/L3/L4 仓逐一列入正式需求表 | 逐一展开全部仓 | 按层级和能力组裁剪，后续架构 / 详细设计再按具体 client 展开 | 推荐 B。原因是需求阶段只需能力级依赖关系，避免复制 27 仓矩阵 |

当前建议：接受上述推荐后进入 Step 7。

---

## 9. 进入下一步条件

- 已明确 `L0-core` / `L0-bus` 是 SDK 当前强前置。
- 已明确 L1/L2/L3/L4 是运行期封装目标，不是 SDK 源码依赖。
- 已明确 L5/L6 和部分内部仓是 SDK 下游消费者，不反向进入 SDK 主体边界。
- 已明确公共注册表、完整 MCP、REST / GraphQL、REPL 不是当前 P0 依赖前置。
- 已输出依赖裁剪表、依赖类型分类表、禁止依赖表和依赖裁剪 ASCII 图。
