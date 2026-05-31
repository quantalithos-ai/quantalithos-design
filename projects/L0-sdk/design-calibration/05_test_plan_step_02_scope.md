# L0-sdk 05 测试方案 Step 2:明确测试目标、范围和非范围

> 所属流程:`05_test_plan_calibration_flow.md`
> 对应正式文档:`projects/L0-sdk/05-测试方案.md` §2 本次测试目标与范围
> 状态:已完成
> 日期:2026-05-31

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 2 |
| 主题 | 明确测试目标、范围和非范围 |
| 当前状态 | 已完成 |
| 是否修改正式 `05-测试方案.md` | 否 |
| 产物位置 | `projects/L0-sdk/design-calibration/05_test_plan_step_02_scope.md` |

本步在 Step 1 输入边界基础上定义本轮测试要证明什么、覆盖什么、不覆盖什么。正式 `05-测试方案.md` 仍不修改，Step 15 统一删除旧文件后重建。

## 2. 本步输入

| 输入 | 本步使用方式 |
|---|---|
| `05_test_plan_step_01_input_boundary.md` | 继承新版 `00~04` 为真相源、旧 `05/06` 只作风险参考的口径 |
| `00-需求文档.md` §4 / §7 / §9 / §10 / §13 / §14 | 提取目标、非目标、CL-001~CL-005、F-001~F-010、BR-001~BR-014、非功能和一票否决方向 |
| `01-架构设计.md` §4 / §5 / §7 / §8 / §9 / §13 / §14 | 提取 official client access layer、运行承载、依赖方向、数据边界和演进阶段 |
| `02-概要设计.md` §2 / §3 / §5 / §8 / §9 / §10 / §11 | 提取概要层范围、约束、主处理流、状态主语、异常边界和配置影响 |
| `03-详细设计.md` §2 / §4 / §8 / §9 / §13 / §15 | 提取 P0 展开范围、实现单元、函数流、状态矩阵、配置绑定和最小测试切口 |
| `04-配置设计.md` §2 / §6 / §7 / §8 / §11 / §12 | 提取 P0 / P1 / P2 配置范围、profile、敏感配置、失效模式和下游测试承接 |

## 3. SOP 问题回答

### 3.1 P0 必须通过哪些测试才能证明主链成立?

| P0 主链 | 必须通过的测试方向 | 证明的闭环 |
|---|---|---|
| 上游 truth 稳定承接 | core / bus snapshot、derived view、semantic baseline、contract compare 和 stale / unsupported 负向测试 | CL-001、F-001、BR-001、BR-002 |
| 三语言官方客户端概念一致 | Rust / Python / TypeScript package surface、错误形状、trace、redaction、event client view 和 docs example 的一致性测试 | CL-002、F-002、F-009、BR-003 |
| 最小平台能力接入 | formal API 或 fake / fixture endpoint 下的 service capability call、bus event publish / consume client view、quickstart 和 smoke 测试 | CL-003、F-003、F-004 |
| 横切默认行为 | error mapping、trace propagation、redaction、credential protection、fake marker guard 和 forbidden body 检查 | CL-004、F-005、F-006、BR-005、BR-007、BR-013 |
| package candidate 与验证证据 | candidate generate / build / smoke / docs / boundary / compatibility runner、evidence result、redaction status 和 report ref 测试 | F-007、F-008、F-009、BR-012、BR-013 |
| 兼容与 deprecated 演进 | compatibility decision、breaking / migration / rejected、deprecated lifecycle 和 migration ref 测试 | CL-005、F-010、BR-008、BR-009、BR-014 |
| 配置与证据路径 | local-dev、ci-test、integration-test、candidate-validation profile、config validation、artifacts/test、reports/runs 和 redaction check | `04` P0 配置闭环与 `03` §15 脚本契约 |

### 3.2 P1/P2 是否只做边界验证或延后?

| 范围层级 | 当前测试处理 | 原因 |
|---|---|---|
| P0 | 必须形成可执行、可断言、可留证的自动化主线 | 决定当前 SDK 核心闭环是否成立 |
| P1 | 只做接缝存在性、配置拒绝 / pending / unsupported、fake marker 或风险登记 | production formal API endpoint、真实 credential provider、首批真实服务 coverage 还不是当前 P0 完整目标 |
| P2 | 延后,仅验证当前 P0 不依赖这些能力 | remote config、hot reload、offline cache、MCP、REST / GraphQL、REPL、完整 ops runbook 尚未进入主线 |
| Rejected / Forbidden | 必须做负向测试 | 关闭 redaction、fake success 当 production success、raw secret 入配置、query 写 truth 等会破坏边界 |

### 3.3 哪些下游能力只测接缝,不测对方完整实现?

| 外部 / 下游能力 | 本轮只测什么 | 不测什么 |
|---|---|---|
| `L0-core` | SDK 使用稳定契约、错误、trace、metadata、envelope 的引用和派生视图一致性 | 不测试 core 自身 proto / DTO / error truth 的完整实现 |
| `L0-bus` | SDK 使用 bus 语义 event client view、publish / consume boundary 和不重定义 delivery truth | 不测试 bus runtime、delivery、retry、DLQ、replay、tap 的完整执行 |
| L1/L2/L3/L4 formal APIs | SDK formal API adapter 接口、unsupported / stale / fake boundary 口径、最小 service capability call | 不测试服务端业务规则、领域状态机或生产 SLA |
| fake / fixture endpoint | 最小接入、docs example、smoke 和 candidate validation 是否可运行且保留 fake marker | 不把 fake 结果验收为 production supported |
| L5/L6 产品与 runtime / automation | package consumption、示例接入和 API shape 是否可用 | 不测试产品 UI、runtime loop、下游业务流程 |
| public registry / release platform | P0 不依赖公共发布;只验证 local package candidate 和 candidate evidence | 不测试 crates.io / PyPI / npm 发布、签名、回滚和平台运营 |

### 3.4 哪些非范围有残余风险?

| 非范围 | 残余风险 | 风险归属 / 后续处理 |
|---|---|---|
| 公共 registry 正式发布 | 本地 candidate 通过不代表公网分发、签名、provenance、撤回和回滚可用 | 后续 release / operations 专项 |
| production formal API endpoint 全集 | fake / fixture 或少量 formal API 通过不代表所有服务能力已覆盖 | 服务能力覆盖扩展阶段 |
| 真实 credential provider / KMS / Vault | P0 只验证 ref-only 和 raw secret 禁止,不验证真实 secret provider 集成 | 安全 / 运维专项 |
| remote config / hot reload / admin override | P0 拒绝这些能力,不验证在线变更一致性 | 配置 P1/P2 设计 |
| MCP / REST / GraphQL / REPL / offline cache | 缺失不影响当前闭环,但未来若进入主线需要重新裁剪需求 | 生态增强阶段 |
| 性能微基准固定阈值 | 当前只要求可测量和不成为明显瓶颈,不固定完整阈值 | 后续性能专项或验收阶段补充 |
| 全量 L1/L2/L3/L4 client coverage | 当前只证明官方 SDK 最小接入与封装边界 | 各服务 formal API 稳定后逐步纳入 |

### 3.5 哪些范围项是一票否决相关?

| 一票否决项 | 触发条件 | 测试处理 |
|---|---|---|
| 重定义 core truth | SDK 定义替代 proto / DTO / ErrorCode / TraceContext / metadata / CloudEvents schema | contract compare 和 forbidden schema negative test |
| 重定义 bus truth | SDK 定义 delivery、retry、DLQ、replay、tap runtime truth 或事件语义 | event semantic compare 和 bus boundary negative test |
| 三语言语义漂移 | Rust / Python / TypeScript 核心概念、错误、trace、redaction 或 event view 含义不一致 | cross-language smoke 和 semantic consistency test |
| 最小接入无法运行 | 没有 local package candidate,或没有 formal API / fake / fixture target 支撑 quickstart / smoke | candidate validation 和 docs example gate |
| 敏感信息泄露 | raw secret、credential value、payload body、production request / response body 进入错误、日志、evidence、reports 或 artifacts | redaction check 必须失败并阻断 |
| fake success 污染 production | fake / fixture 结果被标记为 production supported 或 stable production coverage | fake marker guard 和 boundary policy test |
| 未验证 candidate 进入 `Stable` | freshness、evidence、redaction、compatibility 任一条件不满足却标记 stable | candidate gate 和状态机 forbidden transition test |
| 配置绕过安全或状态门禁 | 配置关闭 redaction / credential 下限、绕过 evidence / compatibility gate、启用 unsupported P0 remote config | config validation negative test |
| Query / projection / runtime call 写 truth | 只读接口、projection rebuild 或 runtime boundary call 改写 SDK truth | read-only side effect 和 repository write guard test |

## 4. 当前文档问题诊断

| 文档 | 诊断 |
|---|---|
| 当前旧 `05-测试方案.md` | 测试目标仍是旧的 codegen / wrapper / subscription / release 线,没有定义 P0/P1/P2,也没有把 configuration、candidate evidence、compatibility、reports / artifacts 纳入范围 |
| 当前旧 `06-验收标准.md` | 验收范围仍跟随旧 `05`,不能作为新版 P0 退出条件 |
| 新版 `00~04` | 已提供足够的范围输入;需要在测试方案中明确 public registry、完整 MCP、REST / GraphQL、REPL、offline cache 和全量服务覆盖不是 P0 |

## 5. 改动前后对比

| 对比项 | 改动前 | 改动后 |
|---|---|---|
| 测试目标 | 验证 binding、wrapper、subscription 和 release manifest 是否可跑 | 验证官方三语言 SDK 核心闭环、横切默认、candidate evidence、compatibility 和配置证据 |
| P0 范围 | 未明确 P0 / P1 / P2 | P0 聚焦本地可验证 official SDK 闭环;P1/P2 只保留接缝或延后 |
| 非范围 | 公共发布、MCP、REST / GraphQL、REPL 等容易混入主线 | 明确这些不作为当前 P0 退出条件 |
| 一票否决 | 主要围绕 wrapper / release 失败 | 围绕双 truth、语义漂移、敏感泄露、fake 污染、未验证 stable、配置绕过和只读写 truth |
| 下游能力 | 容易把服务端、bus、产品或 registry 一起测 | 只测 SDK 接缝和边界,不测试对方完整实现 |

## 6. 测试设计取舍

| 取舍 | 结论 | 原因 |
|---|---|---|
| 本轮 P0 是否要求公共 registry 发布 | 不要求 | `00/01/03/04` 均确认 public registry 不是 P0 前置;当前先证明 local package candidate |
| fake / fixture 是否能支撑 P0 | 可以,但必须保留 fake marker | fake / fixture 可证明最小接入,不能宣称 production supported |
| 是否把全量 L1/L2/L3/L4 client coverage 纳入 P0 | 不纳入 | 当前只验证 stable formal API 或 fake boundary 的最小接入和 SDK 封装边界 |
| 是否固定性能阈值 | 暂不固定 | 需求要求可测量且不成为明显瓶颈,具体阈值留给后续专项或验收 |
| 是否在本步细化用例 ID | 不细化 | 本步只收范围;用例 ID 在 Step 6 基于 Step 3~5 生成 |
| 是否在本步画测试分层图 | 不画 | 分层图属于 Step 4;本步用范围表和一票否决表表达 |

## 7. 结构化中间产物

### 7.1 测试目标表

| 测试目标 | 来源 | 成立标准 | 证据方向 |
|---|---|---|---|
| 证明三语言稳定承接上游 truth | CL-001 / F-001 / BR-001 / BR-002 | Rust / Python / TypeScript 均承接同一 core / bus snapshot,不另造 truth | contract compare、snapshot ref、derived view evidence |
| 证明官方客户端概念一致 | CL-002 / F-002 / BR-003 | 三语言概念、错误、trace、redaction 和 event view 含义一致 | cross-language smoke、semantic baseline report |
| 证明最小可验证接入成立 | CL-003 / F-003 / F-004 | package candidate 可安装,quickstart / docs / service capability / event client 最小路径可运行 | smoke evidence、docs runner evidence、fake / formal boundary receipt |
| 证明横切默认一致 | CL-004 / F-005 / F-006 | error mapping、trace propagation、redaction、credential protection 和 fake marker guard 默认生效 | redaction check、policy test、boundary violation evidence |
| 证明文档与兼容演进可约束 | CL-005 / F-008 / F-010 | docs example 可运行,compatibility / deprecated / migration 可追溯 | docs runner、compatibility decision、deprecated record |
| 证明配置不能绕过设计红线 | `04` §4 / §7 / §8 / §11 | invalid config fail-fast / fail-closed,raw secret 和 forbidden toggle 被拒绝 | config validation evidence、redaction report |

### 7.2 范围 / 非范围表

| 范围项 | 类型 | 优先级 | 验证目标 | 非目标 / 说明 |
|---|---|---|---|---|
| core / bus truth consumption | 测试范围 | P0 | 验证 SDK 只消费上游 truth 并形成派生视图 | 不测试 core / bus 自身实现 |
| SDK semantic baseline and derived views | 测试范围 | P0 | 验证 baseline、snapshot freshness 和 derived view 一致 | 不重命名对象和状态 |
| Rust / Python / TypeScript package surface | 测试范围 | P0 | 验证三语言概念一致且 candidate 可安装 | 不要求公共 registry 发布 |
| formal API / fake boundary minimum access | 测试范围 | P0 | 验证最小 service capability call 和 fake marker | 不宣称全量 production service coverage |
| bus event client view | 测试范围 | P0 | 验证 SDK 不重定义 bus truth 的事件客户端体验 | 不测试 bus runtime delivery |
| boundary policies | 测试范围 | P0 | 验证 error、trace、redaction、credential、fake marker | 不执行 auth / governance 决策 |
| package candidate and verification evidence | 测试范围 | P0 | 验证 candidate 状态、evidence result、redaction status 和 report ref | 不测试公网发布运营 |
| compatibility and deprecated governance | 测试范围 | P0 | 验证 breaking / migration / deprecated 规则可阻断或放行 | 不定义完整 release ops |
| runtime config and profile validation | 测试范围 | P0 | 验证 local-dev、ci-test、integration-test、candidate-validation 和禁止配置化 | 不支持 hot reload、admin override、remote config |
| reports / artifacts evidence path | 测试范围 | P0 | 验证 `artifacts/test/<run_id>` 和 `reports/runs/<run_id>` 可形成证据 | 不定义所有报告审查流程细节 |
| production formal API endpoint | 接缝范围 | P1 | 验证接缝可配置为 ref / pending / unsupported | 不测生产 endpoint 全集 |
| real credential provider | 接缝范围 | P1 | 验证只接受 credential ref 的边界 | 不接入 KMS / Vault 产品实现 |
| public registry publish | 非范围 | P1 | 当前仅确认缺失不阻塞 P0 | 不测试 crates.io / PyPI / npm 发布 |
| remote config / hot reload / admin override | 非范围 | P2 | 当前只验证启用后被拒绝或 unsupported | 不测试在线变更一致性 |
| MCP / REST / GraphQL / REPL / offline cache | 非范围 | P2 | 当前只确认缺失不影响核心闭环 | 进入主线前需重新裁剪 |
| full L1/L2/L3/L4 client coverage | 非范围 | P1/P2 | 当前只测最小 formal / fake boundary | 不测试全量领域 API |

### 7.3 优先级口径表

| 优先级 | 定义 | 失败影响 |
|---|---|---|
| P0 | 当前 SDK 核心闭环必须通过的测试范围 | 阻断 `05` 退出,后续 `06` 不得验收通过 |
| P1 | 后续真实消费者、正式 endpoint、发布或更多服务覆盖需要的接缝 | 不阻断 P0,但必须保留风险和边界 |
| P2 | 生态增强、在线运维、远程配置、完整 gateway / REPL / cache 类能力 | 不阻断 P0,启用时应被拒绝或标记 unsupported |
| Forbidden | 会破坏设计红线的行为 | 必须有负向测试,一旦出现即阻断 |

### 7.4 一票否决范围表

| 范围项 | 是否一票否决 | 说明 |
|---|---|---|
| core / bus 双 truth | 是 | 破坏 L0 分层和官方 SDK 边界 |
| 三语言语义一致性 | 是 | 破坏 official SDK 共同心智 |
| 最小可验证接入 | 是 | 没有可运行 candidate 时核心闭环不成立 |
| redaction / credential protection | 是 | 敏感泄露次数必须为 0 |
| fake marker 和 production supported 边界 | 是 | fake 成功不得污染生产能力声明 |
| candidate stable gate | 是 | 未验证 candidate 不能进入 `Stable` |
| config forbidden toggle | 是 | 配置不能关闭安全和状态门禁 |
| query / projection / runtime call 只读边界 | 是 | 只读或运行期调用不得改写 SDK truth |

## 8. 回填草稿

以下内容供 Step 15 汇总正式 `05-测试方案.md` §2 时摘录。

```markdown
## 2. 本次测试目标与范围

> 校准来源：
> - `design-calibration/05_test_plan_step_02_scope.md`

本轮测试目标是证明 L0-sdk 的 P0 官方客户端接入层闭环成立：三语言稳定承接 core / bus truth，官方客户端概念一致，最小平台能力接入可运行，错误映射、trace、redaction 和凭据保护默认一致，package candidate、验证证据、文档示例、兼容和 deprecated 演进可追溯。

本轮 P0 范围包括：core / bus truth consumption、semantic baseline、derived views、Rust / Python / TypeScript package surface、formal API / fake boundary minimum access、bus event client view、boundary policies、package candidate、verification evidence、compatibility、deprecated、runtime config validation、reports / artifacts evidence path。

本轮不把 public registry 正式发布、production endpoint 全集、真实 credential provider、remote config、hot reload、admin override、MCP、REST / GraphQL、REPL、offline cache 和全量 L1/L2/L3/L4 client coverage 作为 P0 退出条件。这些能力只保留接缝、unsupported / pending 口径或后续专项风险。
```

## 9. 待确认事项

| 事项 | 建议方案 | 原因 |
|---|---|---|
| P0 smoke 是否默认使用 fake / fixture target | 是,除非后续正式指定 stable formal API | 能保证最小接入可验证,且不污染 production supported |
| public registry 是否进入本轮任何自动化 gate | 不进入 P0 gate | 当前只验证 local package candidate,公共发布后移 |
| 性能是否需要固定阈值 | 暂不固定阈值,只定义测量点和明显瓶颈失败口径 | 需求阶段未收稳微基准阈值;后续可由专项或验收补充 |

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| P0 测试目标明确 | 已满足 |
| P1/P2 处理口径明确 | 已满足 |
| 下游能力只测接缝的边界明确 | 已满足 |
| 非范围及残余风险明确 | 已满足 |
| 一票否决范围明确 | 已满足 |

Step 3 可以在本文件被确认后开始,主题是抽取测试对象与测试切口。
