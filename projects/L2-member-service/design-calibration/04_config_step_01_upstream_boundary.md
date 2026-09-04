# Step 1：确认配置输入边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 1
> 回填章节：未来正式 `04-配置设计.md` §1“与上游文档的关系声明”
> 参考粒度：`projects/L1-governance/design-calibration/04_config_step_01_upstream_boundary.md`
> 执行模式：full-restart；旧材料只作 historical_material / 污染审计输入
> 完成日期：2026-09-02

## 1. Step 状态与停审门禁

| 项目 | 结论 |
|---|---|
| 当前文档 | `04-配置设计.md`（正式文件尚未创建） |
| 当前 Step | Step 1 确认配置输入边界 |
| 当前模块 | `upstream_boundary` |
| Step 状态 | `completed / pass_with_upstream_blockers` |
| 输入基线 | 新版正式 `00/01/02/03`、`03_ddd_step_14_config_dependencies.md`、通用配置 SOP / 书写规范；旧 `05/06`、README、draft 仅方向 / 历史输入 |
| 停审方式 | 本 Step 完成后立即停审，等待用户明确确认 Step 2 |
| 正式 `04` 写入 | `false`；不得创建正式配置设计正文 |
| 实现 / 测试 / 证据 | `false`；本 Step 不产生实现、测试结果、artifact、report、evidence、verdict、signoff 或 readiness |
| commit | `false`；未经用户明确要求不提交 |
| 下一允许动作 | `stopped_waiting_for_user_explicit_confirmation_for_step_02` |

本 Step 只确认配置设计的输入、效力和缺口，不定义完整配置控制面、配置项、默认值、环境矩阵、密钥存储、加载函数或失效数值。

## 2. 本步目标与问题边界

本 Step 要确定：

1. 配置设计需要承接哪些需求、架构、概要和详细设计结论；
2. `03-详细设计.md` 中哪些 config / builder / adapter / port / entry binding 必须进入 `04`；
3. 旧 `05/06`、README 和 draft 哪些内容只能作为方向或污染审计输入；
4. 哪些测试、验收和环境差异需要后续配置矩阵支撑，但不能由旧下游文档反向定义；
5. 配置设计不再回答哪些问题、后续必须回答哪些问题；
6. 当前上游缺口是否阻塞 Step 2，若不阻塞，缺口如何在后续保持 pending / blocked / fail-closed。

本 Step 不回答配置项值、profile 命名、环境变量名、secret provider、热更新、部署命令、具体产品选型或测试执行结果。

## 3. 本步输入

| 输入 | 状态 / 效力 | 本 Step 用途 |
|---|---|---|
| `standards/document/设计文档编写通则.md` | 通用正式规范 | 约束正式文档边界、追溯、审计与禁止越界 |
| `standards/document/设计文档讨论中间产物规范.md` | 通用正式规范 | 约束三层台账、Step 产物、重启顺序、停审与写入批次 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 通用正式规范 | 约束 truth owner、可落码、证据诚实和 pending 口径 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 全局正式基线 | 约束 Layer 3 并行窗口、依赖类型和 sibling 不得伪装源码依赖 |
| `standards/document/配置设计讨论流程_SOP.md` | 当前文档 SOP | 定义 Step 1~15 顺序和五个必答问题 |
| `standards/document/配置设计书写规范.md` | 当前文档书写规范 | 定义正式 `04` 主链、JSON、敏感配置和下游边界 |
| `projects/L2-member-service/00-需求文档.md` | 新版正式上游 | 提供项目型双锚、宿主控制面、外部依赖、安全、失败与交接红线 |
| `projects/L2-member-service/01-架构设计.md` | 新版正式上游 | 提供 Host Truth Center、A/S/P 分层、依赖方向、运行角色和产品中立约束 |
| `projects/L2-member-service/02-概要设计.md` | 新版正式上游 | 提供 CMP、对象 / 接口 / 流程 / 状态骨架和配置影响方向 |
| `projects/L2-member-service/03-详细设计.md` | 新版直接输入 | 提供 `infra/config.rs`、`runtime_builder`、Port / adapter、入口参数、错误、并发、观测和不可配置化边界 |
| `design-calibration/03_ddd_step_14_config_dependencies.md` | 已完成字段级输入 | 提供 section、binding、依赖分类、builder 顺序和 P0 fake / blocked 策略 |
| `projects/L2-member-service/05-测试方案.md` | historical_material / 待后续重校准 | 只提取环境、配置矩阵和测试前置方向，不提供配置真相 |
| `projects/L2-member-service/06-验收标准.md` | historical_material / 待后续重校准 | 只提取配置准入和环境前置方向，不提供配置真相 |
| `projects/L2-member-service/README.md` | historical_material | 识别旧产品、性能、目录、部署和凭据假设，全部进入污染审计 |
| `projects/L2-member-service/draft/` | 预讨论输入 | 识别仓定位、交互、能力和分层候选，不直接成为正式配置结论 |
| `projects/L1-governance/04-配置设计.md`、其 Step 1 产物 | 只读粒度 / 格式参考 | 参考输入映射、回填草稿、诊断和 gate 写法，不替本仓定义配置 |
| `L2-runtime`、`L2-member`、`L2-member-images`、`L4-sandbox`、`L1-identity`、`L1-work`、`L0-core`、`L0-bus`、`L0-sdk` 当前文档与台账 | 只读协作输入 | 识别 owner、边界和 blocker；未闭合部分只以 pending / blocked / placeholder 进入本仓 |

## 4. SOP 五问逐项回答

### 4.1 当前配置设计要承接哪些需求、非功能、安全和环境差异？

配置设计必须承接新版 `00~03` 已经收稳的以下输入：

| 输入类别 | 已成立结论 | 对 `04` 的意义 |
|---|---|---|
| 执行主语与 owner | `ProjectMemberRef` 是唯一执行主语，`GlobalMemberRef` 是身份锚；Host Truth 归本仓 | 配置不得扩展主语、改写 owner 或开启第二写源 |
| 宿主控制面 | 本仓承载意图、资格、装配、实例 / generation、注册、session、健康、恢复、closure 和安全交接 | 配置应只驱动允许的运行装配、adapter、runner 和刷新行为 |
| 四层语义 | control plane、host truth、runtime session、execution handoff 不合并 | 配置不能用一个开关或一个状态替代四层语义 |
| 外部 truth 边界 | Runtime、Member、Images、Sandbox、Identity、Work、Governance、Observability 等 truth 归各自 owner | 只允许 typed ref、safe summary、freshness、redacted marker、body-free material 和匹配的 safe outcome |
| 失败与安全 | missing / stale / conflict / unknown / unavailable / timeout / gap 必须可解释；required qualification 缺失时 fail closed；secret / 外部正文禁止入仓 | 配置缺失、越界值、敏感泄漏和未闭合 seam 必须有显式失效策略 |
| 一致性与幂等 | local-first、UoW、revision、generation fence、single-active、stable key、Query no-write、Job no-authorization | 配置不得关闭或放宽这些实现不变量 |
| 环境差异 | 旧 `05/06` 仅有 dev / test / staging 方向和 fake / controlled seam 候选；新版 `00~03` 未锁定最终 profile、产品和数字 | 后续 Step 6 必须重新收敛环境矩阵，不能直接继承旧值 |

因此，`04` 需要回答“哪些运行行为可被环境或部署差异驱动、其来源和失效如何处理”，而不是重新回答宿主为何独立或谁拥有 Runtime / Member / Images / Sandbox truth。

### 4.2 详细设计中哪些配置引用、runtime builder、adapter 或外部依赖需要进入配置设计？

`03-详细设计.md` §13 与 `03_ddd_step_14_config_dependencies.md` 已给出明确绑定面，必须进入后续 `04`：

| 配置输入 / 绑定域 | `03` 中的绑定点 | 后续 `04` 要展开的方面 |
|---|---|---|
| profile / config identity | `infra/config.rs` 的加载与校验 | profile 语义、来源优先级、配置身份与环境矩阵 |
| logical truth / maintenance / outbox / projection / result stores | `runtime_builder` + 各逻辑 repository / UoW | logical owner、adapter ref、可用性、持久化产品是否锁定、失效策略 |
| Identity / Work resolver | qualification ports + resolver adapter | ref / endpoint 来源、freshness、缺失 / stale / conflict 处理 |
| Member registration / signal | Member placeholder adapter | launch / register / heartbeat / status 的绑定占位和 fail-closed；不补对端 schema |
| Member Images pinned supply | images placeholder adapter | pinned supply ref / availability 的配置接缝；不解析 role → image，不保存 manifest 正文 |
| Runtime Host Session / handoff | runtime placeholder adapter | session / handoff target binding；不定义 Runtime run / checkpoint / outcome |
| Sandbox host binding / release | sandbox placeholder adapter | 宿主级 bind / release / cleanup binding；不定义 backend / policy / execute truth |
| carrier availability / registry / container runtime | lifecycle handoff seam | carrier availability marker、registry/container availability 和 fallback 约束；不定义 carrier ref、release schema 或 backend truth |
| publisher / consumer / topic-neutral event seam | Bus / worker / outbox adapter | route / version / dedup / delivery 配置；exact Core / Bus schema 继续 pending |
| handoff / archive / observation target | handoff / observability port | target ref、redaction、attempt / gap；不宣称 delivered / observed / accepted |
| clock / id generator | `ClockPort` / `IdGeneratorPort` | deterministic fake、运行实现 ref、不可把时间当 revision / cursor |
| API / worker / job boundary | typed entry parameters | body / page / batch / concurrency / timeout 等允许参数的来源和失效 |
| redaction / diagnostics | error / observability seams | deny list、safe diagnostic ref、敏感输出和 forbidden body 约束 |

必须保留的读取方向是：只有 `infra/config.rs` 读取 raw config；`infra/runtime_builder.rs` 只消费 validated config 并完成装配；`domain`、`contracts`、application use-case、入口 handler 不读取 raw config、env 或 secret body。

### 4.3 哪些测试和验收场景依赖配置矩阵？

旧 `05/06` 中可以提取出配置相关方向，但不能直接升格为新版真相：

| 后续需要覆盖的场景 | 配置矩阵需要提供的维度 | 当前效力 |
|---|---|---|
| deterministic local / CI fake | fake store、fake resolver、fake publisher、fixed clock / id、fixture ref | 方向成立；具体 key / ref 待 Step 6~8 |
| controlled integration-like seam | Member / Images / Runtime / Sandbox / Bus 的受控 adapter ref 和 availability | 受 `MSVC-UP-001~008` 限制，不能宣称真实集成 |
| required qualification fail-closed | 缺失、陈旧、冲突、未知、不可用的 resolver / supply / binding 组合 | 需由 `04` 明确配置组合与失效策略 |
| redaction / forbidden-body | sensitive / secret ref、deny field、错误和日志输出面 | 需由 Step 8~11 收敛，不读取 raw secret |
| revision / generation / unknown recovery | durable / fake store、lease / lock、retry / timeout 语义 | 产品和数值未锁，不能由旧文档补齐 |
| publisher / handoff / projection | topic-neutral route、target ref、stale / gap / replay 设置 | Core / Bus / observability exact contract pending |
| acceptance environment gate | test / staging 级 seam 可构造性与证据前置 | 由未来 `05/06` 重新承接，旧矩阵只作方向 |

旧 `05/06` 仍使用 `ExecuteRuntimeAction`、capability / tool scope / actor context 等旧词汇，与当前 `03` 的 Host Truth / host-side placeholder 分层不一致。因此它们只能作为“需要重新校准哪些测试和验收配置”的输入，不得反向新增配置项或恢复旧执行真相。

### 4.4 哪些内容不应在配置设计中重新定义？

以下内容已有正式 owner 或属于其他文档职责，不在 `04` 重新定义：

- 需求目标、用户故事、验收目标和非范围（`00`）；
- Host Truth Center、A1~A5 / S1~S3 / P1~P3、依赖方向、运行角色和架构取舍（`01`）；
- CMP、29 个对象、17 个 IB、协议 / 状态 / 流程骨架（`02`）；
- struct / enum / trait / port / DTO / 函数顺序、UoW、错误、幂等和观测字段（`03`）；
- Runtime loop、goal / plan、memory / checkpoint、run / turn / outcome truth（`L2-runtime`）；
- Member 主体、request / signal / report 正文和 IPC 实现（`L2-member`）；
- 镜像内容、构建、digest / BOM / provenance、Role → image 映射（`L2-member-images` / `L3-method-library`）；
- Tool execution、Capability registry、外部 MCP / A2A / API truth（`L2-tools` 及其 owner）；
- Sandbox backend、policy、enforcement、capture、逐动作 execute 和 cleanup truth（`L4-sandbox`）；
- Identity、Work、Governance、Artifact、Observability backend 和 L1 领域真相；
- 具体部署命令、容器挂载、数据库 / 消息 / RPC / scheduler / metric / DLQ 产品最终选型、值班流程和告警面板；
- 测试用例、验收裁决、实施排期、代码仓、编译 / 运行 / 测试结果、artifact、report、evidence、verdict、signoff、readiness。

配置可以影响 adapter 绑定、运行 profile、runner 参数、刷新节奏和外围能力启停，但不能把上述 owner、状态、事务、幂等和安全红线变成可选项。

### 4.5 当前上游是否存在会阻塞配置设计的缺口？

Step 1 进入 Step 2 的输入条件已经足够，因而不存在阻塞 Step 2 的“输入清单缺失”问题；但下列缺口会限制后续配置的 exactness 和正向运行声明：

| blocker | 当前状态 | 对配置设计的上限 |
|---|---|---|
| `MSVC-UP-001` Runtime entry / Host Session / execution handoff | pending / blocked | 只能配置 host-side placeholder / target ref；不能配置 Runtime run / outcome |
| `MSVC-UP-002` Member launch / register / heartbeat / status | pending / blocked | 只能配置 adapter slot / fake / disabled；不能补 register body、凭据或 ready |
| `MSVC-UP-003` Member Images pinned supply / manifest / verification | pending / blocked | 只能配置 pinned ref seam；不能解析 Role → image 或宣称 verified |
| `MSVC-UP-004` SandboxBinding bind / release / cleanup | pending / blocked | 只能配置宿主级 binding placeholder；不能定义 backend / policy / execute truth |
| `MSVC-UP-005` policy 到宿主的传递 owner | owner pending | 只能保留可选 / blocked 的传递接缝；不能把 Governance truth 配给本仓 |
| `MSVC-UP-006` launch credential owner | owner pending | 只能保存 opaque credential ref；不能配置 raw token / secret body |
| `MSVC-UP-007` Core / Bus event family、route、envelope、receipt | schema pending | 只能保留 topic-neutral candidate / fake；不能伪造 delivered / accepted |
| `MSVC-UP-008` L0-sdk target / Server self-test | baseline pending | 只能保留 compile / fake seam；不能声明已编译或自测试通过 |
| durable store / lease / lock / observability backend / measurement authority | product / authority pending | 只能保留 product-neutral binding、placeholder、degraded 或 fail-fast 选项 |

这些 blocker 不阻塞 Step 2，但必须在后续每个受影响 Step、正式 `04` 和项目级台账中持续显式；不能通过配置默认值、fake、timeout 或局部 assembly 把它们关闭。

## 5. 当前材料与历史材料问题诊断

| 材料 / 位置 | 发现的问题 | Step 1 处置 |
|---|---|---|
| 正式 `04-配置设计.md` | 文件尚不存在，配置线索分散在 `02/03/05/06` | 建立本 flow 与 Step 1；正式文件延后 Step 15 |
| `03-详细设计.md` §13 | 已有 section、读取层、builder、adapter、fake / blocked 绑定，但没有完整 key、默认值、环境矩阵、secret、迁移和失效策略 | 作为 `04` 直接输入，不静默改写 `03` |
| `03_ddd_step_14_config_dependencies.md` | 已收稳配置引用与外部依赖分类，具体产品 / endpoint / 数值保留 pending | 作为字段级来源；后续按配置域展开 |
| 旧 `05-测试方案.md` | 仍把 capability / tool scope / `ExecuteRuntimeAction`、旧 sandbox / callback 词汇当作测试对象，并带有未校准环境和性能假设 | 仅提取配置矩阵方向，待新版 `04` 后重写 |
| 旧 `06-验收标准.md` | 验收对象、环境和门禁仍依赖旧动作执行口径 | 仅提取配置准入方向，待新版 `04/05` 后重写 |
| 旧 `README.md` | 固定 Docker / k8s、PostgreSQL、30 秒心跳、3 次失败、10 分钟 forensic、P95 / QPS 等无当前 authority 的产品和数字 | 全部作为历史污染，不进入配置真相 |
| `draft/` | 对宿主、交互、能力和分层的候选已帮助收稳边界，但 draft 不是正式 truth | 只作为讨论输入，须经正式 `00~03` 转译 |
| 并行 sibling 当前文档 | exact schema、route、credential、image manifest、Sandbox binding 等未闭合 | 只记 pending / blocked / placeholder，不能复制其正文或定义对端 truth |

## 6. 改动前后对比

| 维度 | 改动前 | Step 1 完成后 | 原因 |
|---|---|---|---|
| 配置文档入口 | 没有正式 `04`，配置线索散落于 `02/03/05/06` | 建立 `04_config_calibration_flow.md`、Step 1 产物和 ledger 恢复点 | 符合“中间产物先于正式文档” |
| 输入权威 | 旧 `05/06` 与 README 可能被误当成环境 / 产品真相 | 新版 `00~03` 为主，旧材料仅方向 / 历史审计 | 防止旧执行模型和数字回流 |
| 配置范围 | 可能把容器、Runtime、Member、Images、Sandbox、Governance、Observability 的 truth 合并进配置 | 只允许配置 binding、adapter、runner、刷新、外围启停和失效策略 | 保持 owner 与四层语义边界 |
| 外部依赖 | 可能把 sibling / Bus / DB / RPC 写成源码或产品依赖 | 明确 compile / runtime / event / ref / adapter / fake 分类 | 避免运行期协作伪装 compile dependency |
| 上游未闭合合同 | 可能被默认值、fake 或 receipt 冒充 ready | 统一保持 pending / blocked / waiting / placeholder / fail-closed | 与 `03` 的诚实性约束一致 |
| 详细设计回写 | 配置结论可能静默新增 constructor / Port / DTO | 仅配置语义留在 `04`；若改变代码契约则回写 `03` 或阻塞 | 防止 `04` 反向偷改 `03` |

## 7. Step 1 配置设计取舍

| 议题 | 候选 | 本 Step 取舍 | 理由 |
|---|---|---|---|
| 是否直接创建正式 `04` | A. 直接写正文；B. 先生成 flow / Step 产物 | 采用 B | SOP 与三层台账要求正式文档最后装配 |
| 是否走“无配置”路径 | A. 无配置；B. 按有配置项目推进 | 采用 B | `03` 已存在 profile、store、resolver、publisher、handoff、clock / id、entry 和 redaction 绑定点 |
| 是否继承旧 `05/06` 环境矩阵 | A. 直接继承；B. 作为方向输入重校准 | 采用 B | 旧测试 / 验收对象已含旧执行模型与无 authority 数值 |
| 是否现在锁定 DB / Bus / container / RPC 产品 | A. 锁产品；B. 保持 product-neutral seam | 采用 B | 当前架构与 `03` 未给出产品 authority；产品应由 ADR / 实施门禁确认 |
| 是否允许 `04` 静默新增代码契约 | A. 允许；B. 影响 `03` 时回写或阻塞 | 采用 B | 配置设计不得新增 struct / enum / trait / constructor / DTO / flow |
| 如何处理 sibling 未闭合合同 | A. 伪造正向；B. placeholder / blocked / fail-closed | 采用 B | 并行窗口禁止把 WIP 当 truth |
| JSON 与注释 | A. 任意 JSONC；B. 严格 JSON，注释只用于文档示例 | 采用 B 作为后续设计基线 | 与配置书写规范一致；具体加载校验留 Step 9 |

## 8. 结构化中间产物

### 8.1 上游输入映射与正式回填位置

| 来源 | 配置输入 | 计划回填正式 `04` 章节 | 当前状态 |
|---|---|---|---|
| `00-需求文档.md` | 项目型双锚、Host Truth、外部 truth 最小化、fail-closed、secret / body 禁入、环境差异方向 | §1、§2、§3、§4、§11 | 稳定；数字 / profile 未定 |
| `01-架构设计.md` | A1~A5 / S1~S3 / P1~P3、依赖裁剪、运行角色、产品中立、不可改变红线 | §1、§3、§4、§5、§11、§13 | 稳定；产品未定 |
| `02-概要设计.md` | CMP、代码主体、配置影响方向、边界和非范围 | §1、§2、§3、§4、§7、§9 | 稳定；详细 key 未定 |
| `03-详细设计.md` | `infra/config.rs`、`runtime_builder`、stores、resolver、Member / Images / Runtime / Sandbox、carrier availability marker、publisher / handoff、clock / id、entry、redaction | §1、§3、§4、§7、§9、§11 | 稳定；exact contract pending |
| `03_ddd_step_14_config_dependencies.md` | section → binding、依赖分类、builder 顺序、P0 fake / blocked 策略 | §3、§4、§7、§9、§11 | 稳定；defaults / endpoint 未定 |
| 旧 `05-测试方案.md` | dev / test / staging、fake / controlled seam、输入可构造性 | §6、§12 | 方向输入；需重校准 |
| 旧 `06-验收标准.md` | 配置门禁、环境准入、可构造性和 fail-closed 方向 | §6、§11、§12、§14 | 方向输入；需重校准 |
| `L1-governance` 配置设计 | 配置输入表、诊断、回填和 gate 粒度 | 仅作格式 / 粒度参考 | 不提供本仓配置 truth |

### 8.2 当前配置域候选（只到输入边界，不是配置项清单）

| 候选配置域 | 来源 | 当前结论 | 后续责任 |
|---|---|---|---|
| runtime profile / config identity | `03` §13、Step 14 | 有读取绑定点 | Step 2~6 收敛目标、来源和 profile |
| logical store / UoW / result | `03` §10、§13 | 有 builder / repository 绑定点，产品未锁 | Step 3~7 收敛逻辑 owner、ref 和失效 |
| resolver / qualification | `03` CMP-MS-02、§13 | 有 Identity / Work / Images / Member 等 seam | Step 3~7 收敛来源、freshness 和 blocked |
| host carrier / runtime / sandbox | `03` CMP-MS-03~06、§13 | Runtime / Sandbox 有 placeholder adapter；carrier 仅有 availability marker，exact contract pending | Step 3~7、Step 11 保持 fail-closed |
| registration / session / health | `03` CMP-MS-04~05、§13 | 有 Member / Runtime 绑定方向 | 不补对端字段；按 adapter availability 表达 |
| publisher / consumer / handoff | `03` §7、§13~§14 | 有 event / ref / handoff seam，route / receipt pending | Step 5~11 处理来源、敏感性、失效 |
| API / worker / job runner | `03` §4、§8、§13 | 有 typed entry 参数和 job 选择边界 | Step 6~9 处理 runner 配置 |
| clock / id / redaction / diagnostics | `03` §13~§14 | 有明确 adapter / output boundary | Step 8~11 处理敏感与加载校验 |

上述候选域不代表最终配置项数量，也不创建新的领域对象或模块。

### 8.3 配置设计必须回答 / 不再回答清单

**不再由 `04` 回答：**

- 为什么本仓独立存在、执行主语是谁、Host Truth 归谁；
- Runtime、Member、Images、Sandbox、Governance、Identity、Work、Observability 的 truth owner；
- CMP、对象、trait / port / DTO、状态机、事务、幂等、错误和函数流；
- 是否选择某个 DB、Bus、容器平台、RPC、scheduler、metric、DLQ 或 observability 产品；
- 如何实现容器、镜像、运行循环、工具执行、隔离 enforcement 或外部交接；
- 测试如何执行、验收是否通过、实施何时开始、是否存在证据或 readiness。

**后续 `04` 必须回答：**

- 哪些配置控制面和配置域存在，哪些行为允许或禁止配置化；
- 每个配置项的类型、默认值、必填性、来源、优先级、作用域、生效方式、敏感级别、失败策略和关联模块；
- dev / local、CI / fixture、integration-like、staging-like、production-like 等 profile 的差异（如确有必要）；
- raw config、文件、环境、entry-local / job-run-start、secret ref 的合并与冲突处理；
- secret / credential / endpoint / route / target ref 的存储、读取、轮换、审计和禁止输出；
- startup / job-run-start / entry-local 加载、类型 / 范围 / cross-field / redaction 校验和生效方式；
- 变更、审计、回滚、漂移、失效、降级、disabled / blocked / unknown 的处理；
- 如何把配置矩阵交给后续 `05/06/07/09`，并记录仍受 `MSVC-UP-001~008` 限制的项。

### 8.4 配置来源边界（Step 1 级别）

| 来源候选 | 当前允许表达 | 当前不允许表达 |
|---|---|---|
| code defaults | 后续可作为低优先级候选 | 不在本 Step 填数字或业务默认状态 |
| strict JSON file | 作为默认运行配置格式基线 | 不创建实际环境文件，不写 secret |
| environment | 作为后续来源候选 | 不现在命名 env key 或覆盖语义 |
| entry-local / job-run-start | 只允许影响入口 / 单次 job 的参数候选 | 不覆盖 startup invariant、授权、owner 或状态机 |
| secret provider | 只允许提供 opaque secret / credential material 的外部引用 | 不确定 provider 产品，不保存 raw secret body |
| sibling / external response | 只能经 runtime / event / ref / adapter seam 提供 safe input | 不把响应正文、backend status 或 receipt 变成 config truth |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 `03` | 影响类型 | `03` 回写位置 | 处理状态 |
|---|---|---|---|---|
| `04` 应从新版 `00/01/02/03` 和 Step 14 生成，而非继承旧 `05/06` | 否 | 配置文档输入与权威级别 | 不适用 | 无回写 |
| `03` §13 的 config loader、validated binding、adapter / entry binding 进入后续 `04` | 否 | 配置设计承接 | 不适用 | 无回写 |
| 当前存在 profile、store、resolver、Member / Images / Runtime / Sandbox、publisher / handoff、clock / id、entry、redaction 配置绑定点 | 否 | 配置域输入确认 | 不适用 | 无回写 |
| 后续只改变来源、优先级、默认值、profile、敏感级别或失效策略 | 否 | 配置语义 | 不适用 | 待后续 Step 收敛 |
| 后续新增 `RuntimeConfig` 字段、adapter constructor 参数、Port、DTO、错误类型或函数流 | 是 | 代码契约变化 | `03` §4~§14 对应章节 | 阻塞待确认；必须先回写 `03` |
| 后续将 raw config 读取下沉到 domain / application / entry handler | 是 | 依赖方向和安全契约变化 | `03` §3、§4、§13 | 阻塞待确认；禁止静默采用 |
| 后续把 `MSVC-UP-001~008` 的 exact schema、endpoint、route、credential 或产品写进配置 | 是 | 越界或伪造外部合同 | `03` §1、§7、§13 | 阻塞待确认；保持 placeholder / pending |
| 后续用配置关闭 metadata、幂等、history / material / outbox、Query no-write、Job no-authorization、generation fence 或 redaction | 是 | 破坏不变量 | `03` §3、§10~§14 | 设计拒绝；不得进入 `04` |

当前结论：Step 1 不需要回写 `03-详细设计.md`。如果后续配置 Step 产生上述代码契约影响，必须暂停配置链并先完成详细设计回写与审计。

## 10. 回填草稿：正式 `04-配置设计.md` §1

正式 `04` §1 只允许在 Step 15 装配时使用以下已校准结论：

```md
## 1. 与上游文档的关系声明

本文直接承接本项目新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 和 `03-详细设计.md`。其中，`03-详细设计.md` 是配置设计的直接输入，特别是 `infra/config.rs`、`infra/runtime_builder.rs`、logical store / UoW、resolver、Member / Images / Runtime / Sandbox adapter、carrier availability marker、publisher / handoff、clock / id、API / worker / job entry 与 redaction 的绑定点。`design-calibration/03_ddd_step_14_config_dependencies.md` 提供字段级配置引用和依赖分类来源。

旧 README、旧正式 `05-测试方案.md`、`06-验收标准.md` 与 `draft/` 只作为历史材料、方向输入或污染审计依据。它们不得覆盖新版 `00~03`，不得直接贡献旧的 Docker / PostgreSQL / k8s、心跳 / 性能数字、`ExecuteRuntimeAction`、capability / tool scope 或 callback truth。

本配置设计只定义配置控制面、允许配置化边界、来源与优先级、profile / 环境矩阵、配置项、敏感配置、加载校验、生效、变更审计、回滚和失效策略。它不重新定义需求、架构、CMP、对象、trait / port / DTO、状态机、事务、幂等、外部 owner、Runtime / Member / Images / Sandbox truth、产品选型或部署命令。

`ProjectMemberRef` 仍是唯一执行主语，`GlobalMemberRef` 仍是身份锚；Host Truth owner、四层语义、generation fence、Query no-write、Job no-authorization、redaction 和四层 handoff 不可被配置改变。`MSVC-UP-001~008`、具体存储 / 消息 / 观测产品、cursor 类型和 measurement authority 尚未闭合，受影响项只能以 pending / blocked / waiting / placeholder / fail-closed 表达。
```

该草稿不是正式正文；正式正文必须在 Step 15 重新按全部已完成 Step 的来源装配。

## 11. 待确认事项与 blocker

| ID / 事项 | 影响 | 当前处理 |
|---|---|---|
| `MSVC-UP-001~008` | 影响 Runtime / Member / Images / Sandbox / policy / credential / Core / Bus / SDK 的 exact binding、endpoint、schema、receipt 和正向 readiness | 继续 pending / blocked / waiting / placeholder / fail-closed |
| durable store、lease / lock、observability backend、DLQ / diagnostic store | 影响配置产品、可用性、保留、重试和观测承接 | 维持 product-neutral；不写产品和数值 |
| `HostChangeCursor` / `CommittedChangeCursor` exact type | 影响 material / projection / outbox 配置绑定和测试矩阵 | 继续 pending；不创建第三种 cursor |
| 旧 `05/06` 是否整体按新版 `03/04` 重写 | 影响后续测试 / 验收配置前置和门禁 | 本 Step 不修改；留给 05 / 06 流程 |
| profile 命名、默认值、环境变量、secret provider | 影响 Step 5~9 | 本 Step 只确定必须回答，不提前定值 |
| policy 到宿主传递是否由本仓承担 | 影响配置域和 handoff | 继续 `MSVC-UP-005` owner pending |
| launch credential 签发 / 撤销 owner | 影响敏感配置表示和启动失败策略 | 继续 `MSVC-UP-006` owner pending |

## 12. Step 内执行计划与完成记录

| 小阶段 | 计划产物 | 状态 |
|---|---|---|
| 读取恢复入口 | `project_execution_ledger.md`、本 flow、配置 SOP / 书写规范、标准 | completed |
| 读取正式上游 | `00/01/02/03`、`03_ddd_step_14_config_dependencies.md` | completed |
| 读取历史 / 方向材料 | 旧 README、旧 `05/06`、draft、L1-governance 配置 Step 1 | completed |
| SOP 五问回答 | 本文件 §4 | completed |
| 当前与历史材料诊断 | 本文件 §5 | completed |
| 改动前后与取舍 | 本文件 §6~§7 | completed |
| 结构化输入映射与候选域 | 本文件 §8 | completed |
| `03` 影响判定 | 本文件 §9 | completed；当前无回写 |
| 正式 §1 回填草稿 | 本文件 §10 | completed；仅草稿，不写正式文件 |
| blocker / 待确认记录 | 本文件 §11 与项目 ledger | completed；上游 blocker 仍开放 |
| Step 自检与停审 | 本文件 §13 | completed |

## 13. 自检与进入下一步条件

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已明确配置设计的正式输入及权威级别 | pass | 新版 `00~03` 为主，Step 14 为字段级输入，旧 `05/06` / README / draft 降级 |
| 已区分当前配置设计要回答与不再回答的问题 | pass | 见 §8.3 |
| 已覆盖 `03` 的 config / builder / adapter / entry 绑定面 | pass | 见 §4.2、§8.1、`03` §13 |
| 已识别测试 / 验收对配置矩阵的依赖 | pass_with_upstream_blockers | 旧矩阵只作方向，exact seam 受 `MSVC-UP-001~008` 限制 |
| 已完成历史污染审计 | pass | 旧产品、旧数字、旧执行对象和旧 callback 语义未继承 |
| 已记录配置不可改变的 owner / invariant | pass | 双锚、Host Truth、状态、事务、幂等、no-write、redaction、handoff 均锁定 |
| 已记录对 `03` 的影响判定 | pass | 当前无回写；代码契约变化必须阻塞并回写 |
| 已记录 blocker 与待确认事项 | pass_with_upstream_blockers | `MSVC-UP-001~008` 等继续 pending / blocked |
| 已生成回填草稿但未写正式 `04` | pass | 正式文档仍等 Step 15 |
| 已更新三层台账与停审状态 | pass | ledger、flow、Step 1 一致 |
| 可进入 Step 2 的输入条件 | pass | 本 Step 仅允许在用户明确确认后进入 |

## 14. Step 1 停审结论

```text
step_01_status = completed / pass_with_upstream_blockers
step_01_gate = pass_with_upstream_blockers
formal_04_write_allowed = false
formal_04_created = false
next_allowed_action = stopped_waiting_for_user_explicit_confirmation_for_step_02
implementation_allowed = false
commit_allowed = false
```

Step 1 已完成并停审。下一轮恢复时必须先读取项目级台账、本配置 flow 和本文件；只有用户明确确认 Step 2 后，才可以创建 `04_config_step_02_scope.md`，不得跳到后续 Step 或正式 `04-配置设计.md`。
