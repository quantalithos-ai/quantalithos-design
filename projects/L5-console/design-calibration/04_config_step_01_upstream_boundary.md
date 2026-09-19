# Step 1. 确认配置输入边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 1
> 回填章节：`04-配置设计.md` §1
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_01_upstream_boundary.md`
> 状态：`done / pass / self_reviewed`

## 1. 本步目标与状态

本 Step 确认配置设计所承接的正式输入、历史输入、必须回答与不再回答的问题，并判定上游缺口是否阻塞进入 Step 2。它不列配置项、不选择框架/介质/endpoint，不写正式 04。

| 项 | 结果 |
|---|---|
| 输入基线 | 正式 `00/01/02/03`；03 Step 14/17/18；项目台账 |
| 历史输入 | README、旧 `05/06`，仅污染审计和下游方向 |
| 配置项目判定 | 已存在 typed binding config，非“无配置项目” |
| 正式 04 | 当前缺失；只允许 Step 15 新建 |
| 当前门禁 | Step 1 pass；允许 Step 2 |

## 2. 本步输入

| 输入 | 权威状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` | 正式停审 | 客户端职责、权限裁剪、数据最小化、局部降级和 a11y 行为 |
| `01-架构设计.md` | 正式停审 | 浏览器客户端、SDK-only、owner truth、partial failure、diagnostic 边界 |
| `02-概要设计.md` | 正式停审 | 五部分、对象/Port/flow/state 骨架及配置影响/禁止配置化项 |
| `03-详细设计.md` | 正式停审，直接输入 | `ConsoleClientBindingConfig`、`buildConsoleRuntime`、Port、状态、错误、test cuts |
| `03_ddd_step_14_config_dependencies.md` | 直接字段级输入 | 三个 profile、adapter binding、两个 enable boolean、装配顺序和禁止矩阵 |
| `03_ddd_step_17_implementation_handoff.md` | 已完成 | 实施暂停项与 04/05/06/07 承接边界 |
| `03_ddd_step_18_risks_open_questions.md` | 已完成 | `CON-Q-034～047`、state/host/diagnostic/量化 blocker |
| 旧 `05/06` | historical material | 识别旧 workspace/panel/store/固定阈值污染；不得反向定义配置 |
| `L1-governance` 04 | 粒度参考 | 15-Step、小循环、停审与跨域审计结构，不迁移领域内容 |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 承接哪些需求/NFR/安全/环境差异？ | 承接权限 fail-closed、owner 分区、safe-field/forbidden-body、unknown/no-replay、局部降级、a11y 等价和浏览器客户端边界；环境名称需在 Step 6 映射到既有 runtime profile，不自行声称 production ready。 |
| 哪些 03 配置引用进入 04？ | `ConsoleRuntimeProfile`、`ConsoleAdapterBindingRef[]`、`enableSdkInvalidation`、`enableDiagnostics`，以及 host/state/diagnostic/formal Port 的依赖装配语义。 |
| 哪些测试/验收依赖配置矩阵？ | profile isolation、严格 JSON、unknown/duplicate key、forbidden switch、binding coverage、invalidation disabled、diagnostic disabled/failure isolation、session-volatile state、无 secret/no-output。正式编号和证据留未来 05/06。 |
| 哪些内容不重定义？ | runtime config/Port/DTO/function/error/state；truth owner、Policy/Gate、owner schema；框架、router、bundler、存储介质；部署命令；测试/验收结论。 |
| 上游缺口是否阻塞？ | 不阻塞 fail-closed 配置合同。缺口按 facet 阻塞 positive binding、configured medium、consumer/sink activation、兼容和量化；不能转为正式配置值。 |

## 4. 当前问题诊断

| 位置 | 问题 | 本 Step 处理 |
|---|---|---|
| 正式 04 | 文件不存在 | 按 full-restart 先建 calibration，Step 15 才新建 |
| `03` §13 | 绑定点已闭合，但来源/优先级/profile matrix/JSON/失效未展开 | 作为 04 主输入，不改 03 签名 |
| `adapterBindings[].bindingRef` | 是 local configuration correlation，不能被当 endpoint/secret | Step 7 只允许 opaque local ref |
| `enable*` | flag 只能请求绑定，不能证明合同/健康/readiness | Step 4/7/9 加 cross-field 与 availability guard |
| state medium | `configured-medium` 类型存在但当前无正向 authority | P0 不增加 medium 配置项；固定 session-volatile 安全上限 |
| 旧 `05/06` | workspace/panel/store、action history、固定阈值与旧证据口径污染 | 仅登记为拒绝迁移输入，未来 full-restart |
| README | Provider Contract、RBAC 配置和技术目录表达未经当前链确认 | 不进入配置控制面或配置项 |

## 5. 改动前后对比与取舍

| 议题 | 改动前 / 候选 | 收口后 | 理由 |
|---|---|---|---|
| 配置设计入口 | 配置线索散在 03/旧 05/06 | 正式 00～03 + 03 Step 14 为唯一输入主链 | 防止下游反向定义 |
| 配置项范围 | endpoint、secret、storage、TTL 等均可猜测 | 只展开既有四字段/四域；未获 authority 的值不进入 P0 | 不新增 03 代码契约 |
| 浏览器配置来源 | file/env/CLI/config center 全量候选 | Step 5 再选择能安全映射到一个 typed JSON document 的来源 | 客户端不能暴露 secret 或任意运行覆盖 |
| positive activation | flag=true 即启用 | flag 仅 request；Port availability/合同检查决定实际姿态 | 配置不授予能力 |
| state durability | 配置 medium/TTL | P0 固定注入 session-volatile dependency，不伪造 configured medium | `CON-Q-044` 未闭口 |

## 6. 结构化中间产物

### 6.1 上游输入映射

| 来源 | 配置输入 | 回填章节 |
|---|---|---|
| 正式 00 | 安全/权限/局部降级/a11y/数据最小化 | §1、§4、§11 |
| 正式 01 | 浏览器客户端、SDK-only、owner partition、state/diagnostic 边界 | §1、§3、§4、§11 |
| 正式 02 | 配置影响轮廓和禁止配置化边界 | §1、§3、§4 |
| 正式 03 §13 | 配置 reader、binding point、启动顺序、forbidden config | §1、§3、§7、§9 |
| 03 Step 14 | typed fields 与 external dependency matrix | §3～§11 |
| 03 Step 15/16 | diagnostic 和配置测试切口 | §8、§11、§12 |
| 03 Step 17/18 | 实施暂停项与 blocker | §12、§14 |

### 6.2 不再回答的问题

- 谁拥有成员、项目、流程、治理决定、制品、workspace、能力、观测、归档或 sandbox truth。
- Query 是否零写入、唯一 owner write、状态正向来源和 unknown/no-replay 语义。
- 是否直连 DB/private bus/BFF/worker/job，或是否由 route/menu/config 授权。
- TypeScript interface、Port、protocol、function flow 和 error taxonomy 的具体形状。
- framework/router/bundler/package manager、browser support、部署平台、secret provider 与具体存储产品选型。

### 6.3 必须回答的问题

- 四个既有配置域如何在一个严格 JSON 文档中表达，类型、默认值、必填性、作用域、生效、敏感性和失败策略是什么。
- code default 与外部 JSON document 如何合并；重复、未知、非法和 forbidden key 如何处理。
- runtime profile 如何约束 binding、invalidation 与 diagnostics，而不形成 readiness。
- bindingRef 如何保持 local opaque correlation，且不能携带 URL/secret/owner body。
- 浏览器配置如何保证 raw secret、credential、endpoint 与 forbidden body 零进入。
- 配置如何 startup 加载、校验、装配、变更、审计、回滚和失效。
- 05/06/07/09 如何承接，并保留 blocker 与事实诚实边界。

### 6.4 初始配置输入候选

| 配置域 | 既有 03 字段 | 当前状态 | 后续处理 |
|---|---|---|---|
| runtime | `profile` | exact union 已存在 | Step 3/6/7 定义语义与环境映射 |
| bindings | `adapterBindings[]` | shape 已存在；positive slot 全部受合同约束 | Step 3～9 定义 refs、coverage、冲突、校验 |
| invalidation | `enableSdkInvalidation` | field 已存在；production contract pending | 默认 false；true 仅在合同/绑定 profile 允许时，否则拒绝 |
| diagnostics | `enableDiagnostics` | field 已存在；production sink pending | 默认 false；受控 local fake 可 true，生产正向仍 blocked |
| configured state medium | 无新增字段 | authority pending | 不进入 P0 清单，作为 P1/design-change trigger |
| host/router routes | 无 config 字段 | framework/host pending | 不在 04 静默新增；未来需先回写 03 |

## 7. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 04 只展开既有 `ConsoleClientBindingConfig` 四字段与 dependencies binding | 否 | 已有配置语义细化 | 不适用 | 无回写 |
| `bindingRef` 只作 local correlation，不作 endpoint/secret/owner ref | 否 | 承接 Step 14 明确不变量 | 不适用 | 无回写 |
| P0 state 只允许 session-volatile；不新增 medium/TTL key | 否 | 当前安全上限 | 不适用 | 无回写 |
| 后续如需新增 route map、endpoint、secret provider、configured medium、hot reload、diagnostic envelope 字段 | 是 | runtime config/builder/adapter/flow 变更 | 03 Step 4/7/11/14/15 | 未来触发时回写；当前不进入正式配置 |

## 8. 回填草稿

正式 §1 应说明：04 强承接正式 00～03，字段级来源为 03 Step 14；配置只在 composition root / registry / host-state-diagnostic binding 读取，业务模块不读 raw config；旧 README/05/06 不构成配置真相；现有 blocker 不阻止四域 fail-closed 配置语义，但阻止对应 positive production binding。

## 9. 待确认事项与门禁

| 事项 | 当前影响 | 未确认前处理 |
|---|---|---|
| 外部 JSON 的 host delivery mechanism | 部署/实现如何提供文档 | 04 只定义 typed document 来源角色；具体注入留 07/09，不能用 DOM/URL猜造 |
| production formal adapter binding refs | positive owner slots | profile 保持 pending，binding 不得标 bound |
| SDK invalidation contract | `enableSdkInvalidation=true` | 当前所有正式 profile拒绝或保持 false |
| diagnostic sink/envelope | production diagnostics | production profile 保持 false/disabled |
| configured state medium | 跨会话/持久 state | session-volatile only |

| 进入 Step 2 条件 | 结论 |
|---|---|
| 输入清单、权威级别、历史污染明确 | pass |
| 不再回答 / 必须回答问题闭口 | pass |
| 上游缺口阻塞范围可判定 | pass |
| 无当前 `待回写` 项 | pass |

Step 1 `done / pass / self_reviewed`；允许串行进入 Step 2。正式 04 仍不可写。
