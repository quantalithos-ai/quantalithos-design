# Step 1. 确认配置输入边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 1
> 回填章节：`04-配置设计.md` §1
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_01_upstream_boundary.md`
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与内计划

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 1 |
| current_module | `upstream_boundary:input_and_authority_mapping` |
| gate_status | `pass_for_step_02` |
| gate_reason | 正式输入、历史材料、配置影响入口、必须回答/不再回答的问题和 03 影响初判均已闭合；无待回写项。 |
| formal_04_write_allowed | `false_until_step_15` |
| implementation_write_allowed | `false` |
| next_allowed_action | 创建并完成 `04_config_step_02_scope.md` |

### 1.1 Step 内计划

| 项目 | 状态 | 产物/门禁 |
|---|---|---|
| 读取 00～03 与 03 Step 14/17/18 | done | 输入权威表 |
| 扫描旧 README/05/06/draft | done | 历史污染表 |
| 判定有配置/无配置路径 | done | 配置项目判定 |
| 形成必须回答/不再回答问题 | done | 边界问题表 |
| 形成 03 影响初判与回填草稿 | done | 影响判定表 |
| 自检并开放 Step 2 | done | `pass_for_step_02` |

## 2. 本步输入

| 输入 | 权威状态 | 本 Step 用途 |
|---|---|---|
| `projects/L5-runner/00-需求文档.md` | 正式停审 | Runner 定位、能力闭环、安全红线、环境/平台差异和验收口径 |
| `projects/L5-runner/01-架构设计.md` | 正式停审 | owner 边界、依赖裁剪、SDK-first、技术中立和跨平台约束 |
| `projects/L5-runner/02-概要设计.md` | 正式停审 | 配置影响轮廓、组成部分、对象/port/flow/state 约束 |
| `projects/L5-runner/03-详细设计.md` | 正式停审、直接输入 | §13 配置读取点、builder 顺序、外部依赖、限额、观测和禁止配置化边界 |
| `03_ddd_step_14_config_dependencies.md` | 字段级中间产物 | `RunnerRuntimeProfileRef`、store/adapter refs、typed limits、读取模块和依赖分类 |
| `03_ddd_step_17_implementation_handoff.md` | 实施承接输入 | 配置只作为 07 的前置阅读和边界，不创建实现台账 |
| `03_ddd_step_18_risks_open_questions.md` | 风险输入 | 目标仓/技术/上游合同/store/观测 blockers 及未确认前处理 |
| 旧 `README.md`、旧 `05/06`、`draft/` | `historical_material` | 只做冲突/污染扫描，不提供当前配置事实 |
| `standards/document/配置设计讨论流程_SOP.md`、书写规范、中间产物规范、真相源标准、全局依赖规则 | 当前规范 | 规定 Step、章节、来源追溯、配置边界和依赖类型 |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 当前配置设计承接哪些需求和 NFR？ | 承接显式 Release/version 选择、authority/integrity fail-closed、cache/资源保护、断线/unknown 冻结、redacted preview、Query no-write、SDK-first、跨平台 capability 差异和本地可重建性。 |
| 03 哪些配置引用进入 04？ | `profile/config identity`、local truth/projection/idempotency/cache binding、authority/material/integrity/Sandbox/Runtime/platform/diagnostic/handoff/archive adapter refs、page/body/batch/read budgets、job policy、clock/id/digest 与安全 telemetry/redaction 绑定。 |
| 哪些测试/验收会依赖配置矩阵？ | profile isolation、strict parse、required binding 缺失、configured/enabled/ready 分层、numeric bound、redaction forbidden-field、unknown/no-replay、missing core store、dependency unavailable 和 reload/new-builder 负向切口。编号和执行证据留给 05/06。 |
| 哪些内容不在 04 重新定义？ | 需求目标、架构方案、domain/DTO/trait/function/error/state、owner truth、exact SDK/API/event schema、具体语言/框架/数据库/cache backend、部署命令、测试结果、验收 verdict、phase/commit。 |
| 当前是否“无配置项目”？ | 否。03 已明确 config/builder/adapter/job/observability 读取点；即使所有正向外部 binding blocked，也必须定义 profile、binding、预算、redaction 和 fail-closed 配置语义。 |
| 上游缺口是否阻塞进入 04？ | 不阻塞语义配置设计；阻塞 exact endpoint/SDK method、production positive binding、真实 durable backend、量化阈值和 readiness。未闭合项只能为 `blocked/pending/disabled/unknown`。 |

## 4. 当前文档问题诊断与历史污染扫描

| 位置 | 诊断 | 当前处理 |
|---|---|---|
| 正式 03 §13 | 只有读取点和逻辑绑定，缺来源、优先级、profile、配置项、secret、校验、生效和失效细节 | 作为 04 的唯一语义输入展开；不改 03 类型/函数 |
| 03 Step 14 | 类型多为 semantic placeholder，数值/endpoint/secret/backend 未定 | 04 只登记 opaque ref、有限类型和无权威默认；不猜产品 |
| 旧 `05/06` | 使用旧 `RunnerRun/RunQueueEntry/RunCard` 和旧性能/环境数字 | 仅记录为拒绝迁移材料；不反向生成配置项 |
| README/draft | 可能暗示 Rust/Tauri/Docker、目录、进程和端口默认值 | 全部后置冲突扫描；不作为配置 authority |
| 上游 owner 文档 | exact Runner-facing contract 未闭合 | 只登记 binding slot/ref 和负向策略，不声称 ready |

## 5. 改动前后对比与设计取舍

| 议题 | 收口前 | 本 Step 收口后 | 取舍理由 |
|---|---|---|---|
| 配置入口 | 线索分散在 02/03 与历史 05/06 | 正式 00～03 + 03 Step 14 为主链，旧材料只作审计 | 防止历史对象/技术选择反向污染 |
| 配置项目判定 | 可能误判为“无配置”或直接列 env | 明确为有配置项目，先做控制面/边界再列项 | 满足 SOP 可追溯和先边界后清单 |
| 外部依赖 | 可能把 sibling repo/endpoint 写成 ready | 只写 typed/opaque binding 与 blocked/unknown | 保持 SDK-first 和 truth ownership |
| 数值默认 | 历史文档含并发/性能数字 | 无 authority 的 limit 使用 required/authority-pending，不继承数字 | 避免伪造 workload/SLO |
| secret | 可能把 token/DSN 写入普通配置 | 只允许 opaque ref；raw secret 永不成为配置项 | 降低泄露和错误授权风险 |

## 6. 结构化中间产物

### 6.1 配置输入映射

| 来源 | 配置输入 | 回填章节 |
|---|---|---|
| 正式 00 | 显式选择、authority、完整性、运行/清理/恢复红线、redaction 和跨平台要求 | §1、§4、§6、§11 |
| 正式 01 | 依赖类型、owner partition、技术中立、local truth / projection / observation 分离 | §1、§3、§4、§5 |
| 正式 02 | 配置影响轮廓、配置不可改变的状态/一致性边界 | §1、§3、§4、§7 |
| 正式 03 §13 | 读取模块、配置绑定、builder 顺序、外部依赖和禁止配置化项 | §3～§11 |
| 03 Step 14 | 绑定项、依赖裁剪、configured/enabled/ready、逻辑 runtime builder | §3、§5、§7、§9 |
| 03 Step 15/16 | safe log/metrics/redaction 和配置测试切口 | §8、§9、§11、§12 |
| 03 Step 17/18 | 下游承接、实施暂停项、blocker 和未确认前处理 | §12～§14 |

### 6.2 04 必须回答的问题

- 配置来源覆盖链、唯一装配入口和 raw-config 读取边界是什么？
- 哪些配置域/模块属于 P0，哪些只保留 P1/P2 seam？
- 每个配置项的精确语义类型、默认/必填、来源、作用域、生效、敏感级别和失败策略是什么？
- 哪些 binding 仅是 local opaque correlation，哪些 owner/endpoint/secret 明确禁止进入 JSON？
- local/CI/integration-like/staging-like/production-like profile 如何区分，哪些只能做负向或 fake 验证？
- 配置如何 parse/type/cross-field validate、装配 builder、记录变更、回滚和 fail-closed？
- 05/06/07/09 如何承接配置，不复制第二真相源？

### 6.3 不再回答的问题

- Runner 是否选择 Rust、TypeScript、Tauri、Electron、Docker、gVisor、Firecracker、数据库、cache backend、进程模型或具体平台命令。
- Artifact/Governance/Sandbox/Runtime/Observability/Archive 的 owner truth、exact DTO、SDK method、event payload、lease 或 evidence schema。
- 03 已定义的对象、trait/port、protocol、flow、state、error、UoW 和 idempotency schema。
- 具体部署文件、环境变量名、secret provider 产品、证书安装、工单系统、测试用例编号、验收结果、implementation phase 或 commit。

## 7. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 04 只序列化 03 已存在的 semantic profile/ref/limit/policy 绑定 | 否 | 配置语义细化 | 不适用 | 无回写 |
| raw secret、owner body、private path 不成为配置项 | 否 | 重申已有安全边界 | 不适用 | 无回写 |
| 无权威的 numeric default 采用 required/blocked，而非历史数字 | 否 | 默认值/失败策略细化 | 不适用 | 无回写 |
| 新增 config field、builder 参数、adapter constructor、Port、error、DTO、flow 或 state | 是 | 代码契约变化 | 对应 03 Step 4/7/11/14/15 | 当前禁止；若后续需要，先回写 03 |

## 8. 回填草稿（未来正式 §1）

04 应声明：本配置设计直接承接正式 00～03，尤其是 03 §13 与 Step 14；配置只在 `infra/config`、composition/builder、entry、worker、operations 和安全观测装配层读取，application/domain/contracts 不读取 raw config。旧 README、draft、旧 05/06 不提供配置真相。当前上游 blocker 不阻塞 semantic configuration，但阻塞 exact integration、durable backend、量化阈值和 readiness。

## 9. 待确认事项与进入下一步条件

| 事项 | 当前影响 | 未确认前处理 |
|---|---|---|
| 外部配置文档的具体 delivery mechanism | 部署/实施细节未定 | 04 只定义 source role；具体挂载/注入留 07/09 |
| exact SDK/owner binding ref 语义 | 正向 adapter | 只登记 opaque ref 和 blocked/unknown |
| local store/cache backend 与锁/迁移 | durable implementation | 只登记 capability requirement；不写 DSN/path |
| numeric limits 的 workload authority | 默认和量化验收 | required/authority-pending；不得继承历史数字 |

| 进入 Step 2 条件 | 结论 |
|---|---|
| 正式输入与权威顺序明确 | pass |
| 有配置/无配置判定完成 | pass：有配置 |
| 必须回答/不再回答问题闭合 | pass |
| 03 影响初判无待回写 | pass |
| 历史污染处理明确 | pass |

Step 1 完成，允许进入 Step 2；正式 04 尚不可写。
