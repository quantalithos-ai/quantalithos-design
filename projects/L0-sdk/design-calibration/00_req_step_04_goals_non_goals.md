# Step 4. 目标与非目标

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 4
> 回填章节: `00-需求文档.md` §4 目标与非目标
> 生成日期: 2026-05-30

---

## 1. 本步目标

收束 `L0-sdk` 的需求范围，明确当前阶段必须达成什么、明确不做什么，以及旧文档中的公共发包、MCP、REST / GraphQL、REPL、gateway / facade、本地缓存等候选内容应如何处理。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓定位与边界 | 保证目标不越过 core / bus / L1+ 服务端 / 产品 UI / runtime 边界 |
| Step 3 背景与问题定义 | 保证目标回应官方客户端接入层缺位、三语言 drift 和旧文档口径混杂 |
| `L0-core` / `L0-bus` 已稳定文档 | 确认 SDK 目标以消费稳定契约和总线语义为前提 |
| 旧 `00` / `01` / `architecture/sdk-draft` | 提取候选目标，重新判断 P0 / P1 / 非目标 |

---

## 3. SOP 问题回答

### 3.1 本次需求结束后，应成立哪些状态、边界或能力？

本次需求收口后，至少应成立以下状态：

- `L0-sdk` 的定位稳定：它是三语言官方客户端接入层，而不是 binding-only 仓、服务端 gateway、领域服务、事件总线或产品 UI。
- `L0-sdk` 与 `L0-core` / `L0-bus` 的关系稳定：core / bus 是稳定上游，SDK 只生成、包装和消费，不重新定义底层 truth。
- 三语言一致性边界稳定：Rust / Python / TypeScript 可以保持核心概念、错误、trace、redaction、事件封装和版本兼容口径一致，同时允许语言 idiomatic 差异。
- 多消费者接入边界稳定：L5/L6 产品、L2 runtime、运维脚本和第三方开发者通过官方 SDK 消费能力，不各自发明私有 client 口径。
- 当前 P0 和后续增强边界稳定：公共注册表正式发布、完整 MCP Client、REST / GraphQL gateway、REPL / playground、本地缓存 / 状态管理不直接进入当前 P0 主目标。

### 3.2 这些目标如何被验证？

| 目标 | 验证方式 |
|---|---|
| 仓定位与边界稳定 | 后续章节不把 core 契约真相、bus runtime、服务端业务 truth、UI 组件或 runtime loop 写入 SDK 范围 |
| 上游消费关系稳定 | 后续依赖章节明确 SDK 消费 `L0-core` / `L0-bus`，不复制 schema，不重新定义投递语义 |
| 三语言一致性边界稳定 | 后续用户故事、功能需求和验收能检查核心概念、错误、trace、redaction、事件封装、版本兼容是否有统一口径 |
| 多消费者接入边界稳定 | 后续角色与依赖章节能覆盖端侧产品、runtime、运维脚本和第三方开发者，且不要求他们直面裸协议 |
| P0 / P1 / 非目标清晰 | 后续功能需求不把公共注册表正式发布、完整 MCP、REST / GraphQL、REPL、本地状态管理写成当前 P0 |

### 3.3 哪些事项虽然相关，但明确不纳入当前范围？

| 事项 | 处理方式 |
|---|---|
| core proto / DTO、Error、TraceContext、CloudEvents schema、metadata 定义 | 非目标，归 `L0-core` |
| publish / subscribe / ack / retry / DLQ / replay / tap 的总线运行语义 | 非目标，归 `L0-bus` |
| L1+ 服务端业务 API 真相和领域规则 | 非目标，归对应服务仓 |
| 服务端统一 gateway / facade | 非目标，避免 SDK 拥有业务编排和服务端 truth |
| UI 组件、页面状态和产品工作流 | 非目标，归 L5/L6 产品仓 |
| 登录认证、OAuth provider、权限裁决 | 非目标，归安全入口、identity、gateway 或 governance |
| 本地缓存、离线状态管理和客户端 store | 非目标或后续增强，当前只讨论客户端接入边界 |
| 完整 MCP Client 能力 | P1 候选，当前只保留边界和标准输入 |
| REST / GraphQL gateway 封装 | P2 候选，不作为当前主目标 |
| REPL / playground | P2 候选，不作为当前主目标 |
| 公共注册表正式发布 | 发布阶段目标，当前 P0 优先本地可验证包、版本规则和发布治理边界 |

### 3.4 哪些事情必须交给相邻仓或后续阶段处理？

| 交给谁 | 内容 |
|---|---|
| `L0-core` | 共享类型、协议 DTO、ErrorCode、TraceContext、CloudEvents schema、metadata |
| `L0-bus` | 事件传递、订阅推进、ack、retry、dead-letter、replay、tap 和 transport view truth |
| L1+ 服务仓 | 领域事实、业务规则、服务端 API 语义和业务事务 |
| L5/L6 产品仓 | UI 组件、页面状态、产品工作流、前端状态管理 |
| `L2-runtime` | agent loop、tool invocation、memory、checkpoint 和执行状态 |
| `L3-capability-hub` | provider contract、qualification binding、tool / MCP 能力定义 |
| 后续 SDK 阶段 | 公共注册表发布、完整 MCP Client、REST / GraphQL gateway、REPL / playground、离线缓存策略 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `00` §3 | 把三语言统一 API、codegen、quickstart、trace、redaction、公共发版都写成目标 | 目标混入功能名、实现路径和发布阶段承诺 | 改成可验证的状态 / 边界目标 |
| 旧 `00` §6 | MCP、REST / GraphQL、REPL 等候选增强混入功能清单 | P0 目标尚未收束时范围过大 | Step 4 先定非目标 / 后续增强，Step 9 再裁剪功能 |
| 旧 `01` / `sdk-draft` | 已展开目录结构、codegen、CI、包发布和具体语言目录 | 架构 / 详细设计内容前置 | 本步只确认目标和非目标，不固化实现结构 |
| 旧文档整体 | 公共发包被写得像当前最小验收前置 | 与当前本地 `/home/aris/Projects` path dependency 实施阶段不完全匹配 | 当前 P0 只要求本地可验证包、版本规则和发布治理边界，正式公共发布后移 |

---

## 5. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 目标表达 | `codegen/gen.sh`、Rust / Python / TS 包、quickstart、trace、redaction 等能力项 | 官方客户端接入层边界、上游消费关系、三语言一致性、多消费者接入和发布治理边界 |
| 公共发布 | crates.io / PyPI / npm 10 分钟内齐备像 P0 验收 | 当前不作为 P0 主目标，先保留版本规则和发布治理边界 |
| MCP | 内置 MCP Client 像 P0 功能 | 作为 P1 候选和标准输入，后续功能需求再裁剪 |
| REST / GraphQL / REPL | 出现在旧功能清单 | 明确 P2 候选，不进入当前目标 |
| SDK 范围 | 容易从 client 扩大成 gateway / facade / state manager | 明确 SDK 不拥有服务端 truth、产品 UI、本地状态策略和 runtime loop |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 把旧文档所有 P0 目标直接继承 | 内容完整，迁移快 | 会把公共发包、MCP、REST、REPL、具体 codegen 命令混进当前目标 | 不采用 |
| 方案 B: 目标先收束为官方客户端接入层的边界和可验证状态 | 目标稳定，能自然承接后续角色、依赖、闭环和功能需求 | 功能清单需要后续 Step 9 再展开 | 采用 |
| 方案 C: 目标只写三语言 binding 生成 | 目标很轻，第一批实现简单 | 无法回应官方 client、错误、trace、redaction、事件封装和开发者体验问题 | 不采用 |
| 方案 D: 目标写成服务端统一 gateway | 调用方体验看似统一 | 会破坏 SDK 客户端边界，并让 SDK 拥有服务端业务编排 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 目标结论

| 目标编号 | 目标 | 说明 | 验证方式 |
|---|---|---|---|
| G-001 | 建立官方客户端接入层的需求边界 | SDK 是三语言官方 client，不是 binding-only、gateway、领域服务或 UI 层 | 后续章节不把服务端 truth、UI、runtime loop 写入 SDK |
| G-002 | 建立对 `L0-core` / `L0-bus` 的稳定消费关系 | SDK 生成并包装 core 契约，封装 bus 事件视图，不重新定义底层语义 | 依赖与接口章节不出现 core / bus 双真相 |
| G-003 | 收束三语言一致性目标 | Rust / Python / TypeScript 核心概念一致，语言接口可 idiomatic | 后续验收可检查 API 概念、错误、trace、redaction 和事件封装一致 |
| G-004 | 收束多消费者接入目标 | 支撑 L5/L6 产品、L2 runtime、运维脚本和第三方开发者使用同一官方接入口径 | 用户与角色、使用方与依赖章节能覆盖这些消费者 |
| G-005 | 收束安全与可追踪默认目标 | 需求层明确 trace 传播、错误映射和敏感信息保护是 SDK 横切目标 | 非功能和验收章节能定义 trace / redaction / error mapping 门禁 |
| G-006 | 收束版本兼容与文档可学习目标 | 需求层明确 SDK 需要有版本兼容、deprecated 过渡和文档 / 示例可学习性 | 后续验收能检查版本规则、迁移说明、quickstart 和 docstring |
| G-007 | 区分 P0 主目标与后续增强 | 公共注册表正式发布、完整 MCP、REST / GraphQL、REPL、本地缓存不进入当前 P0 | 功能需求章节不把这些候选项写成当前 P0 |

### 7.2 非目标结论

| 非目标编号 | 非目标 | 不做原因 / 归属 |
|---|---|---|
| NG-001 | 定义 core proto / DTO、Error、TraceContext、CloudEvents schema、metadata | 归 `L0-core` |
| NG-002 | 实现 bus runtime 或重新定义 publish / subscribe / ack / retry / DLQ / replay 语义 | 归 `L0-bus` |
| NG-003 | 拥有 L1+ 服务端业务 API 真相和领域规则 | 归对应服务仓 |
| NG-004 | 作为服务端统一 gateway / facade | 会让 SDK 拥有服务端业务编排，破坏客户端边界 |
| NG-005 | 提供 UI 组件、页面状态和产品工作流 | 归 L5/L6 产品仓 |
| NG-006 | 实现登录认证、OAuth provider 或权限裁决 | 归安全入口、identity、gateway 或 governance |
| NG-007 | 提供本地缓存、离线状态管理和客户端 store | 当前不作为 SDK 主目标，后续按产品需要评估 |
| NG-008 | 完整 MCP Client 能力 | P1 候选，当前只保留标准输入和边界 |
| NG-009 | REST / GraphQL gateway 封装 | P2 候选，不作为当前主目标 |
| NG-010 | REPL / playground | P2 候选，不作为当前主目标 |
| NG-011 | 公共注册表正式发布 | 发布阶段目标，当前 P0 先保证本地可验证、版本规则和发布治理边界 |

### 7.3 范围收束结论

当前需求范围按三层收束：

| 范围层级 | 内容 |
|---|---|
| P0 主目标 | 官方三语言 client 接入边界、core / bus 稳定消费关系、三语言一致性、trace / error / redaction 横切目标、版本兼容和文档可学习性 |
| P0-min 可验证边界 | 本地可验证包、示例 / quickstart 口径、cross-lang consistency 验证、fake / fixture 接入证明 |
| P1/P2 增强 | 公共注册表正式发布、完整 MCP Client、REST / GraphQL gateway、REPL / playground、本地缓存 / 离线状态策略 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §4。

```md
## 4. 目标与非目标

> 校准来源：
> - `design-calibration/00_req_step_04_goals_non_goals.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“当前文档问题诊断”和“设计取舍”小节，了解目标、非目标和当前范围如何从旧 SDK 草案中重新裁剪。

### 4.1 目标

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立官方客户端接入层的需求边界 | SDK 是三语言官方 client，不是 binding-only、gateway、领域服务或 UI 层 | 后续章节不把服务端 truth、UI、runtime loop 写入 SDK |
| 建立对 `L0-core` / `L0-bus` 的稳定消费关系 | SDK 生成并包装 core 契约，封装 bus 事件视图，不重新定义底层语义 | 依赖与接口章节不出现 core / bus 双真相 |
| 收束三语言一致性目标 | Rust / Python / TypeScript 核心概念一致，语言接口可 idiomatic | 后续验收可检查 API 概念、错误、trace、redaction 和事件封装一致 |
| 收束多消费者接入目标 | 支撑 L5/L6 产品、L2 runtime、运维脚本和第三方开发者使用同一官方接入口径 | 用户与角色、使用方与依赖章节能覆盖这些消费者 |
| 收束安全与可追踪默认目标 | 需求层明确 trace 传播、错误映射和敏感信息保护是 SDK 横切目标 | 非功能和验收章节能定义 trace / redaction / error mapping 门禁 |
| 收束版本兼容与文档可学习目标 | 需求层明确 SDK 需要有版本兼容、deprecated 过渡和文档 / 示例可学习性 | 后续验收能检查版本规则、迁移说明、quickstart 和 docstring |
| 区分 P0 主目标与后续增强 | 公共注册表正式发布、完整 MCP、REST / GraphQL、REPL、本地缓存不进入当前 P0 | 功能需求章节不把这些候选项写成当前 P0 |

### 4.2 非目标

| 非目标 | 不做原因 / 归属 |
|---|---|
| 定义 core proto / DTO、Error、TraceContext、CloudEvents schema、metadata | 归 `L0-core` |
| 实现 bus runtime 或重新定义 publish / subscribe / ack / retry / DLQ / replay 语义 | 归 `L0-bus` |
| 拥有 L1+ 服务端业务 API 真相和领域规则 | 归对应服务仓 |
| 作为服务端统一 gateway / facade | 会让 SDK 拥有服务端业务编排，破坏客户端边界 |
| 提供 UI 组件、页面状态和产品工作流 | 归 L5/L6 产品仓 |
| 实现登录认证、OAuth provider 或权限裁决 | 归安全入口、identity、gateway 或 governance |
| 提供本地缓存、离线状态管理和客户端 store | 当前不作为 SDK 主目标，后续按产品需要评估 |
| 完整 MCP Client 能力 | P1 候选，当前只保留标准输入和边界 |
| REST / GraphQL gateway 封装 | P2 候选，不作为当前主目标 |
| REPL / playground | P2 候选，不作为当前主目标 |
| 公共注册表正式发布 | 发布阶段目标，当前 P0 先保证本地可验证、版本规则和发布治理边界 |

### 4.3 范围收束

当前 P0 主目标聚焦官方三语言 client 接入边界、`L0-core` / `L0-bus` 稳定消费关系、三语言一致性、trace / error / redaction 横切目标、版本兼容和文档可学习性。公共注册表正式发布、完整 MCP Client、REST / GraphQL gateway、REPL / playground、本地缓存 / 离线状态策略均不作为当前 P0 主目标。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 公共注册表正式发布是否进入当前 P0 | P0 直接要求 crates.io / PyPI / npm 正式发布 | P0 先保证本地可验证、版本规则和发布治理边界，正式公共发布进入发布阶段 | 推荐 B。原因是当前实现默认在 `/home/aris/Projects` 本地工作区推进，过早要求公共注册表会阻塞第一批实现 |
| Q-002 | 完整 MCP Client 是否进入当前 P0 | P0 内置完整 MCP Client | 作为 P1 候选，当前只保留标准输入和边界 | 推荐 B。原因是 MCP 依赖 capability-hub 口径，不能抢在依赖仓校准前成为 SDK 主闭环 |
| Q-003 | SDK 是否承担服务端 facade / gateway | 让 SDK 成为所有服务的统一业务门面 | SDK 只做客户端接入层，不拥有服务端业务编排 | 推荐 B。原因是 facade 会破坏 L1+ 服务真相边界 |
| Q-004 | 本地缓存 / store 是否进入目标 | 纳入当前 SDK 主目标 | 作为后续产品侧增强评估 | 推荐 B。原因是缓存策略更贴近产品和调用方，不应污染当前官方接入层边界 |

当前建议：接受上述推荐后进入 Step 5。

---

## 10. 进入下一步条件

- 每个目标都可验证。
- 每个非目标都有明确归属或后续阶段。
- 没有把接口名、功能清单、目录结构或实现方案写成目标。
- 公共注册表、完整 MCP、REST / GraphQL、REPL、本地缓存没有被提前写入当前 P0。
- 范围已经能支撑后续用户与角色、使用方与依赖、核心能力闭环和功能需求展开。
