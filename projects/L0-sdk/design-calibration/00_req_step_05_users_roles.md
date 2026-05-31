# Step 5. 用户与角色

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 5
> 回填章节: `00-需求文档.md` §5 用户与角色
> 生成日期: 2026-05-30

---

## 1. 本步目标

明确哪些人类角色和系统角色会接触 `L0-sdk`，以及它们分别为什么接触本仓；本步不写仓际依赖、不写用户故事、不写接口清单、不写语言包目录和实现结构。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓定位与边界 | 确认 `L0-sdk` 是三语言官方客户端接入层，不是 core truth、bus runtime、server facade、UI 组件库或 runtime 执行框架 |
| Step 4 目标与非目标 | 确认角色围绕官方 client、三语言一致性、trace / error / redaction、版本兼容、文档示例和本地可验证包出现 |
| 旧 `00` 用户与角色章节 | 迁移 UI 开发者、runtime 开发者、Rust 服务开发者、第三方开发者和 SDK maintainer 等合理角色 |
| `product/产品矩阵.md` SDK 条目 | 确认 SDK 面向端侧产品、内部集成、第三方开发者、研究人员 / 评测者和三语言生态 |
| `standards/子项目遵循规范清单.md` SK1~SK6 | 确认维护角色需要覆盖版本同步、类型生成、breaking change、docstring、trace 和 MCP 候选能力 |

---

## 3. SOP 问题回答

### 3.1 本仓有哪些主要角色？

`L0-sdk` 的角色分为两类：

- 人类角色：使用、维护、发布、评审或审计 SDK 需求与体验的人。
- 系统角色：在运行时或自动化流程中安装、运行、验证、生成或消费 SDK 的程序。

本步不把 `L0-core`、`L0-bus`、L1+ 服务仓、L2 runtime、L5/L6 产品仓写成角色。这些是仓际协作对象，留到 Step 6 使用方与依赖中展开。

### 3.2 哪些是人类角色？

| 人类角色 | 使用场景 |
|---|---|
| SDK maintainer | 维护 SDK 需求、语言一致性、公共概念、breaking change 规则、文档示例和发布节奏 |
| TypeScript product developer | 在端侧产品或 Node.js 集成中使用官方 SDK，而不是直接拼接底层协议或私有 client |
| Python runtime / automation developer | 在 AI runtime、自动化脚本、评测脚本或运维工具中使用官方 SDK 消费平台能力 |
| Rust service / integration developer | 在内部服务或性能敏感集成中使用 Rust SDK 复用类型、错误、trace 和事件封装口径 |
| Third-party / enterprise integration developer | 以外部开发者身份接入 Quantalithos 能力，依赖 quickstart、示例、错误说明和版本兼容承诺 |
| Documentation / example maintainer | 维护 quickstart、docstring、跨语言示例和可运行样例，确保学习路径可验证 |
| Release maintainer | 维护版本同步、package candidate、deprecated 过渡和发布证据，不把公共注册表正式发布强行写成当前 P0 |
| Security / compliance reviewer | 审查 token、credential、secret redaction、错误文本和 trace 传播是否符合安全边界 |
| Architecture / standards reviewer | 审查 SDK 是否守住 core / bus / 服务端 truth / runtime / UI 边界，并对齐标准和全局依赖规则 |

### 3.3 哪些是系统角色？

| 系统角色 | 使用场景 |
|---|---|
| SDK consumer process | 运行时加载某一种语言 SDK 的应用、脚本或服务进程，通过官方 client 消费平台能力 |
| Codegen / binding pipeline | 从稳定契约生成语言 binding 或同步生成产物，并将结果交给 SDK 封装层使用 |
| Cross-language smoke test runner | 运行三语言示例和一致性测试，验证核心概念、错误、trace、redaction 和事件封装没有漂移 |
| Documentation example runner | 执行 quickstart 和文档示例，证明文档中的最小接入路径可运行 |
| Release / package validation pipeline | 校验版本号、package candidate、兼容声明、deprecated 过渡和发布前证据 |
| Fake / fixture service endpoint | 在 SDK 测试和示例中提供受控响应，避免需求阶段绑定真实服务端实现细节 |
| Trace / log collector | 接收 SDK 调用产生的 trace 和日志材料，用于验证追踪传播和敏感信息保护效果 |

### 3.4 是否存在管理、审计或维护类角色？

存在，且必须与普通 SDK 使用者区分：

- SDK maintainer 维护 API 概念、语言一致性、兼容性和文档体验。
- Release maintainer 维护版本同步、发布候选和 deprecated 过渡证据。
- Security / compliance reviewer 审查 redaction、credential 处理、错误文本和 trace 传播。
- Architecture / standards reviewer 审查 SDK 是否越界成为 core truth、bus runtime、server facade、UI 层或 runtime 执行层。
- Documentation / example maintainer 维护 quickstart、docstring 和示例，不拥有 SDK 需求边界决策权。

### 3.5 是否需要权限差异？

需要给出能力级权限差异方向。`L0-sdk` 的角色差异明显：普通使用者只消费 SDK；维护者可以变更公共概念和兼容策略；发布角色负责版本候选和证据；安全与架构评审者拥有评审和门禁职责。本步不写认证授权机制，也不写 API 路径、Command 名或事件名。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `00` §4.1 | 写 L5 UI 开发者、L2 runtime 开发者、L1/L3/L4 Rust 开发者、第三方开发者、SDK Maintainer | 基本覆盖主要使用者，但用层级 / 仓分类承载角色，容易与 Step 6 使用方与依赖混淆 | 改成使用者画像和职责角色 |
| 旧 `00` §4.2 | 权限矩阵写“使用 SDK 调 API / 订阅事件 / 发布新 SDK 版本 / deprecated / redaction” | 有方向价值，但“调 API / 订阅事件”接近接口动作；Admin / Owner 容易变成人员头衔 | 改为能力级权限差异，不写接口动作和组织头衔 |
| 旧 `00` §5 | 用户故事紧接角色章节，部分角色和故事边界较近 | 容易把角色定义写成故事，或提前写功能 | 本步只写角色和接触场景，故事留到 Step 8 |
| 旧 `00` §6 | 功能清单包含 MCP、REST / GraphQL、REPL、公共发包等候选能力 | 若在角色章节继承，会把候选增强变成 P0 角色前提 | 本步只保留 P0 主使用者；MCP / REST / REPL 相关角色作为后续增强判断，不进入核心角色表 |

---

## 5. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 角色分类 | 按 L5 / L2 / L1/L3/L4 / 第三方 / SDK Maintainer 列角色 | 按实际使用职责列人类角色，并单独列系统角色 |
| 仓际关系 | 角色名称中混入层级和仓概念 | 仓际协作留到 Step 6，本步只写谁接触 SDK |
| 维护角色 | SDK Maintainer + Admin / Owner | 拆成 SDK maintainer、Release maintainer、Security / compliance reviewer、Architecture / standards reviewer |
| 权限表达 | 直接写调 API、订阅事件、发布版本、修改规则 | 写使用、验证、变更公共概念、发布候选、兼容审批、安全审查等能力级差异 |
| 候选增强 | MCP、REST / GraphQL、REPL 容易扩大角色范围 | 当前角色聚焦 P0 主闭环，候选增强后续 Step 9 再裁剪 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 继续按 L5 / L2 / L1/L3/L4 等层级写角色 | 能快速迁移旧文档 | 会把仓际依赖和角色混在一起，后续 Step 6 难以清楚展开 | 不采用 |
| 方案 B: 按使用者画像和职责角色收敛 | 角色边界清楚，能自然承接用户故事和功能需求 | 需要在 Step 6 再单独说明具体仓际使用方 | 采用 |
| 方案 C: 只写外部第三方开发者和 SDK maintainer | 简洁 | 覆盖不了内部产品、runtime、运维脚本、release、安全和架构评审需求 | 不采用 |
| 方案 D: 把 MCP / REST / REPL 相关使用者提前列成核心角色 | 能覆盖旧草案所有候选能力 | 会把 P1/P2 候选增强误升为 P0 角色前提 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 角色结论

| 角色 | 类型 | 使用场景 |
|---|---|---|
| SDK maintainer | 人类角色 | 维护 SDK 需求、公共概念、语言一致性、兼容性、文档示例和演进边界 |
| TypeScript product developer | 人类角色 | 在端侧产品或 Node.js 集成中通过官方 SDK 消费平台能力 |
| Python runtime / automation developer | 人类角色 | 在 AI runtime、自动化脚本、评测脚本或运维工具中通过官方 SDK 消费平台能力 |
| Rust service / integration developer | 人类角色 | 在内部服务或性能敏感集成中复用 Rust SDK 的类型、错误、trace 和事件封装口径 |
| Third-party / enterprise integration developer | 人类角色 | 以外部集成方身份通过文档、示例和兼容承诺接入平台能力 |
| Documentation / example maintainer | 人类角色 | 维护 quickstart、docstring、跨语言示例和可运行样例 |
| Release maintainer | 人类角色 | 维护版本同步、package candidate、deprecated 过渡和发布证据 |
| Security / compliance reviewer | 人类角色 | 审查凭据材料保护、敏感信息脱敏、错误文本和 trace 传播边界 |
| Architecture / standards reviewer | 人类角色 | 审查 SDK 是否守住客户端接入层边界并对齐全局标准 |

### 7.2 系统角色结论

| 系统角色 | 类型 | 使用场景 |
|---|---|---|
| SDK consumer process | 系统角色 | 在运行时加载某一种语言 SDK 并消费平台能力 |
| Codegen / binding pipeline | 系统角色 | 从稳定契约生成语言 binding 或同步生成产物 |
| Cross-language smoke test runner | 系统角色 | 验证三语言核心概念、错误、trace、redaction 和事件封装一致 |
| Documentation example runner | 系统角色 | 执行 quickstart 和文档示例，证明最小接入路径可运行 |
| Release / package validation pipeline | 系统角色 | 校验版本号、package candidate、兼容声明、deprecated 过渡和发布前证据 |
| Fake / fixture service endpoint | 系统角色 | 为 SDK 测试和示例提供受控响应 |
| Trace / log collector | 系统角色 | 接收 SDK 调用产生的 trace 和日志材料，用于追踪和 redaction 验证 |

### 7.3 权限差异结论

| 能力 | 普通 SDK 使用者 | SDK 维护 / 发布角色 | 安全 / 架构评审角色 | 自动化系统 |
|---|---|---|---|---|
| 阅读文档和运行示例 | 允许 | 允许 | 允许 | 允许执行验证 |
| 使用 SDK 消费平台能力 | 允许，受调用方凭据和服务端边界约束 | 允许，主要用于维护验证 | 受限，主要用于审查验证 | 允许在测试 / CI 范围执行 |
| 修改公共概念和语言一致性规则 | 不允许 | 允许提出和实现 | 可审查 / 阻断 | 不允许 |
| 变更版本兼容和 deprecated 规则 | 不允许 | 允许提出和维护 | 可审查 / 阻断 | 校验规则是否满足 |
| 维护 quickstart、docstring 和示例 | 可反馈 | 允许 | 可审查 | 可执行示例验证 |
| 发布 package candidate | 不允许 | 允许 | 可审查 | 可执行发布前校验 |
| 审查 redaction、错误文本和 trace 传播 | 可反馈 | 必须配合修正 | 负责审查 / 阻断 | 可执行安全回归 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §5。

```md
## 5. 用户与角色

> 校准来源：
> - `design-calibration/00_req_step_05_users_roles.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“结构化中间产物”“改动前后对比”和“设计取舍”小节，了解角色如何从旧文档的层级 / 仓分类收敛为使用者画像和职责角色。

### 5.1 角色说明表

| 角色 | 类型 | 使用场景 |
|---|---|---|
| SDK maintainer | 人类角色 | 维护 SDK 需求、公共概念、语言一致性、兼容性、文档示例和演进边界 |
| TypeScript product developer | 人类角色 | 在端侧产品或 Node.js 集成中通过官方 SDK 消费平台能力 |
| Python runtime / automation developer | 人类角色 | 在 AI runtime、自动化脚本、评测脚本或运维工具中通过官方 SDK 消费平台能力 |
| Rust service / integration developer | 人类角色 | 在内部服务或性能敏感集成中复用 Rust SDK 的类型、错误、trace 和事件封装口径 |
| Third-party / enterprise integration developer | 人类角色 | 以外部集成方身份通过文档、示例和兼容承诺接入平台能力 |
| Documentation / example maintainer | 人类角色 | 维护 quickstart、docstring、跨语言示例和可运行样例 |
| Release maintainer | 人类角色 | 维护版本同步、package candidate、deprecated 过渡和发布证据 |
| Security / compliance reviewer | 人类角色 | 审查凭据材料保护、敏感信息脱敏、错误文本和 trace 传播边界 |
| Architecture / standards reviewer | 人类角色 | 审查 SDK 是否守住客户端接入层边界并对齐全局标准 |
| SDK consumer process | 系统角色 | 在运行时加载某一种语言 SDK 并消费平台能力 |
| Codegen / binding pipeline | 系统角色 | 从稳定契约生成语言 binding 或同步生成产物 |
| Cross-language smoke test runner | 系统角色 | 验证三语言核心概念、错误、trace、redaction 和事件封装一致 |
| Documentation example runner | 系统角色 | 执行 quickstart 和文档示例，证明最小接入路径可运行 |
| Release / package validation pipeline | 系统角色 | 校验版本号、package candidate、兼容声明、deprecated 过渡和发布前证据 |
| Fake / fixture service endpoint | 系统角色 | 为 SDK 测试和示例提供受控响应 |
| Trace / log collector | 系统角色 | 接收 SDK 调用产生的 trace 和日志材料，用于追踪和 redaction 验证 |

### 5.2 权限差异

| 能力 | 普通 SDK 使用者 | SDK 维护 / 发布角色 | 安全 / 架构评审角色 | 自动化系统 |
|---|---|---|---|---|
| 阅读文档和运行示例 | 允许 | 允许 | 允许 | 允许执行验证 |
| 使用 SDK 消费平台能力 | 允许，受调用方凭据和服务端边界约束 | 允许，主要用于维护验证 | 受限，主要用于审查验证 | 允许在测试 / CI 范围执行 |
| 修改公共概念和语言一致性规则 | 不允许 | 允许提出和实现 | 可审查 / 阻断 | 不允许 |
| 变更版本兼容和 deprecated 规则 | 不允许 | 允许提出和维护 | 可审查 / 阻断 | 校验规则是否满足 |
| 维护 quickstart、docstring 和示例 | 可反馈 | 允许 | 可审查 | 可执行示例验证 |
| 发布 package candidate | 不允许 | 允许 | 可审查 | 可执行发布前校验 |
| 审查 redaction、错误文本和 trace 传播 | 可反馈 | 必须配合修正 | 负责审查 / 阻断 | 可执行安全回归 |
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否继续把 L5 / L2 / L1/L3/L4 作为角色名称 | 保留旧层级角色 | 改成 TypeScript product developer、Python runtime / automation developer、Rust service / integration developer | 推荐 B。原因是角色章节应写使用者画像，具体仓际使用方留到 Step 6 |
| Q-002 | 是否把 Admin / Owner 写成角色 | 保留 Admin / Owner | 改成 Release maintainer、Security / compliance reviewer、Architecture / standards reviewer | 推荐 B。原因是职责角色比组织头衔更稳定 |
| Q-003 | 是否把 MCP / REST / REPL 相关使用者写入当前核心角色 | 写入核心角色 | 作为后续增强相关角色，Step 9 再按 P1/P2 裁剪 | 推荐 B。原因是 Step 4 已确认这些不是当前 P0 主目标 |
| Q-004 | Release maintainer 是否意味着当前 P0 必须公共发包 | 是，角色存在即要求公共注册表发布 | 否，当前只要求本地可验证包、package candidate、版本规则和发布治理边界 | 推荐 B。原因是角色职责可以先服务本地验证和发布治理，不必把公共注册表正式发布提前写成 P0 |

当前建议：接受上述推荐后进入 Step 6。

---

## 10. 进入下一步条件

- 已区分人类角色与系统角色。
- 已明确 SDK 使用、维护、发布、文档、安全、架构评审和自动化验证角色。
- 没有把仓际依赖、用户故事、接口动作、目录结构或实现方案混写进本章。
- 权限差异只写能力级动作，没有写 API 路径、Command 名或事件名。
