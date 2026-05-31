# Step 11. 数据需求与数据归属

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 11
> 回填章节: `00-需求文档.md` §11 数据需求与数据归属
> 生成日期: 2026-05-30

---

## 1. 本步目标

说明 `L0-sdk` 在需求层拥有哪些数据真相，哪些只是来自上游的快照或生成派生，哪些只是外部引用，哪些正文和敏感材料明确不得由 SDK 保存或拥有。

---

## 2. 本步输入

| 输入 | 使用方式 |
|---|---|
| Step 2 本仓定位与边界 | 确认 SDK 不拥有 core truth、bus runtime、服务端业务 truth、auth truth、UI 状态和 runtime loop |
| Step 9 功能需求 | 从三语言 client、package candidate、示例、验证、版本兼容等能力抽取数据项 |
| Step 10 业务规则与边界约束 | 将禁止保存正文、上游 truth 引用、candidate 验证证据等规则转成数据归属口径 |
| 旧 `00-需求文档.md` §9 | 迁移 generated binding、examples、versions.toml、proto-ref.toml、凭据保护等合理线索 |
| `L0-core` / `L0-bus` 稳定结论 | 判定契约、错误、trace、metadata、事件语义正式 truth 不属于 SDK |

---

## 3. SOP 问题回答

### 3.1 哪些数据由本仓拥有真相？

`L0-sdk` 拥有的是 SDK 接入体验和发布候选相关真相，而不是平台业务真相：

- 官方客户端公共概念与语言映射口径。
- SDK package candidate 与本地安装验证状态。
- SDK redaction、错误映射、trace 传播的默认行为口径。
- SDK 版本兼容、deprecated 和迁移治理结论。
- SDK quickstart、docstring、示例和跨语言验证证据。

### 3.2 哪些数据只是快照？

来自 `L0-core`、`L0-bus` 和稳定服务边界的派生内容只是快照：

- 从 `L0-core` 契约派生的三语言 binding 或类型视图。
- 从 `L0-bus` 语义派生的事件客户端视图。
- 从 L1/L2/L3/L4 正式边界派生的 client 能力视图。
- 上游 ErrorCode、TraceContext、metadata、CloudEvents 约束在 SDK 中的消费快照。

这些数据不形成 SDK 自己的 truth。上游变化时，SDK 只能显式刷新、验证和标记兼容性，不能把旧快照当成新的平台真相。

### 3.3 哪些数据只是引用？

SDK 只保存或声明外部对象的引用关系：

- `L0-core` / `L0-bus` 上游版本引用。
- L1/L2/L3/L4 服务边界引用。
- ADR、标准、设计文档、发布策略和安全规范引用。
- fake / fixture endpoint 引用。
- 测试报告、reports、artifacts 和发布候选证据引用。
- 未来公共注册表 package 引用。

### 3.4 哪些内容绝不能保存正文？

SDK 不得拥有或保存以下正文：

- 业务对象正文和服务端领域状态正文。
- 事件实例 payload 正文和 bus delivery runtime 状态正文。
- token、secret、credential、password、private key 等凭据正文。
- 用户隐私数据、生产请求正文、生产响应正文。
- 观测日志、trace 全量正文和运行时执行记录正文。
- UI 页面状态、产品工作流状态和 runtime loop 状态正文。
- 外部标准、ADR、下游仓实现和服务端内部实现正文。

### 3.5 这些数据在需求层面的生命周期口径是什么？

真相数据从 SDK 正式定义、candidate 形成或文档发布开始，随 SDK 版本、兼容判断、deprecated 过渡或退役而变化。快照数据随上游正式 truth 变化而更新，不形成独立真相生命周期。引用数据随引用关系建立、更新或失效而变化，SDK 不负责外部正文生命周期。禁止保存正文不进入 SDK 生命周期。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `00` §9.1 | 把 generated binding、examples、versions.toml、proto-ref.toml 列为核心业务实体 | 混合真相数据、快照数据、引用数据和实现文件名 | 改成需求层数据归属分类 |
| 旧 `00` §9.2 | 画 proto -> codegen -> registry -> install 的数据关系图 | 这是生成 / 发布实现流，不是数据归属 | 本步不保留实现流图 |
| 旧 `00` §9.3 | 写注册表永久保留、CI artifact 90 天、GitHub 默认策略 | 进入平台存储策略和实施细节 | 生命周期改为需求层口径 |
| 旧 `00` §9.4 | 只写 token / secret / credential 和异常消息 | 方向正确但禁止正文范围过窄 | 扩展为业务正文、事件正文、凭据正文、运行时正文、UI / runtime 状态正文等 |

---

## 5. 改动前后对比

| 项 | 旧口径 | 新口径 |
|---|---|---|
| 数据分类 | generated binding、examples、versions.toml、proto-ref.toml | 真相数据、快照数据、引用数据、禁止保存正文 |
| SDK 真相 | 不清楚 SDK 真正拥有哪类数据 | SDK 拥有 public client 概念、candidate、行为口径、兼容治理、文档和验证证据 |
| 上游契约 | proto / binding 容易混为本仓实体 | core / bus 真相不归 SDK，SDK 只保留派生快照和引用 |
| 生命周期 | 写注册表、CI、Git 策略 | 写需求层生命周期，不绑定实现平台 |
| 禁止正文 | 只强调凭据 | 明确禁止业务、事件、运行、观测、UI、runtime 和外部实现正文 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 generated binding / examples / versions.toml 表 | 贴近实现者直觉 | 需求层绑定文件形态，无法表达 truth / snapshot / ref 差异 | 不采用 |
| 方案 B: 按真相 / 快照 / 引用 / 禁止保存正文四类重写 | 对齐规范，边界清楚，能支撑后续接口与验收 | 需要详细设计再展开具体文件和包结构 | 采用 |
| 方案 C: 只写 SDK 不存业务数据 | 简洁 | 无法说明 SDK 拥有 public surface、candidate、文档和验证证据等真相 | 不采用 |
| 方案 D: 把所有生成产物都视为真相数据 | 实现上方便 | 会让 SDK 反向拥有 core / bus truth，破坏上游边界 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| 官方客户端公共概念与语言映射口径 | 真相数据 | 官方客户端公共概念与语言映射口径由 `L0-sdk` 拥有正式真相。 | 从正式定义到变更、废弃或退役，形成完整 SDK 生命周期。 |
| SDK package candidate 状态 | 真相数据 | SDK package candidate 状态由 `L0-sdk` 拥有正式真相。 | 随 candidate 创建、验证、通过、拒绝或退役而变化。 |
| SDK 默认错误 / trace / redaction 行为口径 | 真相数据 | SDK 默认错误 / trace / redaction 行为口径由 `L0-sdk` 拥有正式真相。 | 随 SDK 行为规则变更和兼容判断显式变化。 |
| SDK 版本兼容与 deprecated 结论 | 真相数据 | SDK 版本兼容与 deprecated 结论由 `L0-sdk` 拥有正式真相。 | 随 release candidate、破坏性变更、迁移说明或退役而变化。 |
| SDK quickstart、docstring 与示例内容 | 真相数据 | SDK quickstart、docstring 与示例内容由 `L0-sdk` 拥有正式真相。 | 随 SDK 能力、文档版本和示例验证结果持续演进。 |
| SDK 跨语言验证证据 | 真相数据 | SDK 跨语言验证证据由 `L0-sdk` 拥有正式真相。 | 随 candidate 验证、smoke test 和安全回归形成或失效。 |
| `L0-core` 契约派生类型视图 | 快照数据 | `L0-core` 契约正式真相不属于 SDK，但 SDK 可为稳定消费保留派生快照。 | 随 `L0-core` 正式真相变化而更新，不形成独立 truth。 |
| `L0-bus` 事件语义客户端视图 | 快照数据 | `L0-bus` 事件语义正式真相不属于 SDK，但 SDK 可保留客户端消费快照。 | 随 `L0-bus` 正式语义变化而更新，不形成独立 truth。 |
| L1/L2/L3/L4 服务边界客户端视图 | 快照数据 | 服务端正式边界不属于 SDK，但 SDK 可保留客户端消费快照。 | 随服务端正式边界变化而更新，不形成独立业务 truth。 |
| ErrorCode / TraceContext / metadata 消费视图 | 快照数据 | ErrorCode / TraceContext / metadata 真相不属于 SDK，但 SDK 可保留语言消费快照。 | 随上游共享契约变化而更新，不形成独立 truth。 |
| 上游版本引用 | 引用数据 | SDK 只保存对 `L0-core`、`L0-bus` 和服务边界版本的引用关系，不拥有上游正文真相。 | 随引用关系建立、变化或失效而变化，本仓不负责上游正文生命周期。 |
| ADR / 标准 / 设计文档引用 | 引用数据 | SDK 只保存对 ADR、标准和设计文档的引用关系，不拥有其正文真相。 | 随引用关系建立、变化或失效而变化，本仓不负责外部正文生命周期。 |
| fake / fixture endpoint 引用 | 引用数据 | SDK 只保存对 fake / fixture endpoint 的引用关系，不拥有其服务实现真相。 | 随验证目标建立、变化或失效而变化，本仓不负责服务实现生命周期。 |
| reports / artifacts / 发布证据引用 | 引用数据 | SDK 可引用报告和证据位置，但不把外部证据正文视为 SDK 数据 truth。 | 随验证证据形成、移动或失效而变化。 |
| 业务对象正文 | 禁止保存正文 | 业务对象正文不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |
| 事件实例 payload 正文 | 禁止保存正文 | 事件实例 payload 正文不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |
| 凭据和密钥正文 | 禁止保存正文 | token、secret、credential、password、private key 正文不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |
| 生产请求 / 响应正文 | 禁止保存正文 | 生产请求 / 响应正文不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |
| 观测日志 / trace 全量正文 | 禁止保存正文 | 观测日志 / trace 全量正文不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |
| UI / runtime 状态正文 | 禁止保存正文 | UI 页面状态、产品工作流状态和 runtime loop 状态不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |

### 7.2 数据归属结论

`L0-sdk` 的数据真相是“客户端接入体验、package candidate、文档示例、横切行为和兼容演进真相”。它不拥有 `L0-core` 契约 truth、`L0-bus` 事件运行时 truth、服务端业务 truth、认证授权 truth、UI 状态 truth 或 runtime 执行 truth。

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §11。

```md
## 11. 数据需求与数据归属

> 校准来源：
> - `design-calibration/00_req_step_11_data_requirements_ownership.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“数据归属表”和“数据归属结论”小节，了解 `L0-sdk` 如何区分自身 truth、上游快照、外部引用和禁止保存正文。

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| 官方客户端公共概念与语言映射口径 | 真相数据 | 官方客户端公共概念与语言映射口径由 `L0-sdk` 拥有正式真相。 | 从正式定义到变更、废弃或退役，形成完整 SDK 生命周期。 |
| SDK package candidate 状态 | 真相数据 | SDK package candidate 状态由 `L0-sdk` 拥有正式真相。 | 随 candidate 创建、验证、通过、拒绝或退役而变化。 |
| SDK 默认错误 / trace / redaction 行为口径 | 真相数据 | SDK 默认错误 / trace / redaction 行为口径由 `L0-sdk` 拥有正式真相。 | 随 SDK 行为规则变更和兼容判断显式变化。 |
| SDK 版本兼容与 deprecated 结论 | 真相数据 | SDK 版本兼容与 deprecated 结论由 `L0-sdk` 拥有正式真相。 | 随 release candidate、破坏性变更、迁移说明或退役而变化。 |
| SDK quickstart、docstring 与示例内容 | 真相数据 | SDK quickstart、docstring 与示例内容由 `L0-sdk` 拥有正式真相。 | 随 SDK 能力、文档版本和示例验证结果持续演进。 |
| SDK 跨语言验证证据 | 真相数据 | SDK 跨语言验证证据由 `L0-sdk` 拥有正式真相。 | 随 candidate 验证、smoke test 和安全回归形成或失效。 |
| `L0-core` 契约派生类型视图 | 快照数据 | `L0-core` 契约正式真相不属于 SDK，但 SDK 可为稳定消费保留派生快照。 | 随 `L0-core` 正式真相变化而更新，不形成独立 truth。 |
| `L0-bus` 事件语义客户端视图 | 快照数据 | `L0-bus` 事件语义正式真相不属于 SDK，但 SDK 可保留客户端消费快照。 | 随 `L0-bus` 正式语义变化而更新，不形成独立 truth。 |
| L1/L2/L3/L4 服务边界客户端视图 | 快照数据 | 服务端正式边界不属于 SDK，但 SDK 可保留客户端消费快照。 | 随服务端正式边界变化而更新，不形成独立业务 truth。 |
| ErrorCode / TraceContext / metadata 消费视图 | 快照数据 | ErrorCode / TraceContext / metadata 真相不属于 SDK，但 SDK 可保留语言消费快照。 | 随上游共享契约变化而更新，不形成独立 truth。 |
| 上游版本引用 | 引用数据 | SDK 只保存对 `L0-core`、`L0-bus` 和服务边界版本的引用关系，不拥有上游正文真相。 | 随引用关系建立、变化或失效而变化，本仓不负责上游正文生命周期。 |
| ADR / 标准 / 设计文档引用 | 引用数据 | SDK 只保存对 ADR、标准和设计文档的引用关系，不拥有其正文真相。 | 随引用关系建立、变化或失效而变化，本仓不负责外部正文生命周期。 |
| fake / fixture endpoint 引用 | 引用数据 | SDK 只保存对 fake / fixture endpoint 的引用关系，不拥有其服务实现真相。 | 随验证目标建立、变化或失效而变化，本仓不负责服务实现生命周期。 |
| reports / artifacts / 发布证据引用 | 引用数据 | SDK 可引用报告和证据位置，但不把外部证据正文视为 SDK 数据 truth。 | 随验证证据形成、移动或失效而变化。 |
| 业务对象正文 | 禁止保存正文 | 业务对象正文不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |
| 事件实例 payload 正文 | 禁止保存正文 | 事件实例 payload 正文不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |
| 凭据和密钥正文 | 禁止保存正文 | token、secret、credential、password、private key 正文不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |
| 生产请求 / 响应正文 | 禁止保存正文 | 生产请求 / 响应正文不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |
| 观测日志 / trace 全量正文 | 禁止保存正文 | 观测日志 / trace 全量正文不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |
| UI / runtime 状态正文 | 禁止保存正文 | UI 页面状态、产品工作流状态和 runtime loop 状态不属于 SDK 真相范围，SDK 不得保存其正文。 | 不进入本仓生命周期。 |

`L0-sdk` 的数据真相是“客户端接入体验、package candidate、文档示例、横切行为和兼容演进真相”。它不拥有 `L0-core` 契约 truth、`L0-bus` 事件运行时 truth、服务端业务 truth、认证授权 truth、UI 状态 truth 或 runtime 执行 truth。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | generated binding 是否作为 SDK 真相数据 | 是，binding 是 SDK 真相 | 否，binding 是从 `L0-core` 派生的快照 | 推荐 B。原因是 binding 不应反向成为契约 truth |
| Q-002 | quickstart / docstring / examples 是否属于 SDK 真相数据 | 否，只是文档附属 | 是，属于 SDK 开发者体验真相 | 推荐 B。原因是 SDK 的接入体验需要由本仓正式维护 |
| Q-003 | 验证证据是否进入数据归属 | 不进入 | 作为 SDK candidate 的真相或引用数据进入 | 推荐 B。原因是后续验收和实施需要可追溯证据入口 |
| Q-004 | 是否需要细列禁止保存正文 | 只写“不存业务数据” | 细列业务、事件、凭据、生产请求、观测、UI、runtime 状态正文 | 推荐 B。原因是 SDK 容易在日志、示例和诊断中误保存正文 |

当前建议：接受上述推荐后进入 Step 12。

---

## 10. 进入下一步条件

- 已明确 SDK 自身拥有的真相数据。
- 已明确上游契约、事件语义和服务边界在 SDK 内只能形成快照或引用。
- 已明确业务正文、事件正文、凭据正文、生产请求 / 响应、观测正文、UI / runtime 状态正文不得保存。
- 没有写字段清单、表结构、缓存策略、索引、实现对象或具体文件布局。
