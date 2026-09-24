# 01 架构 Step 15 · ADR 与需求追溯

> 状态：`completed`
> 前置：`01_arch_step_01_requirements_baseline.md`～`01_arch_step_14_risks_open_questions.md`、正式 `00` §7～§16
> 回填章节：正式 `01` §16 需求追溯矩阵、§17 ADR 索引

## 1. Step 内计划与判断

- [x] 识别足够关键、长期且已收稳的架构决定。
- [x] 对每个决定回指架构单元、需求/约束/风险来源和取舍结论。
- [x] 将五个能力节点和外围能力映射到具体架构结果及正式章节。
- [x] 检查需求未承接、架构缺来源和承接关系未闭环。
- [x] 按决定停审，并完成跨 ADR/追溯孤儿审计。

本步只索引已经在前序步骤成立的决策，不创建独立 ADR 正文，也不把旧 ADR-0008/0009、Tauri、Rust 或 Docker 选择继承进来。编号是本轮正式架构索引中的稳定标识，不代表已有单独 ADR 文件或实现。

## 2. ADR 索引表

| ADR 编号 | 架构决策 | 解决的问题 | 关联主线 | 说明 |
|---|---|---|---|---|
| `ADR-RUN-001` | Runner 只拥有端侧选择、意图、取得/保护、恢复和展示真相；外部 owner 只以 snapshot/ref/status 进入 | 防止 Runner 成为第二 Release、Governance、execution、Sandbox 或 Observability truth | 职责边界 / 数据归属 / 依赖方向 | 长期决定本仓所有读写边界和后续对象归属。 |
| `ADR-RUN-002` | 每个副作用绑定显式 immutable Release/version、scope 和 selection generation，禁止 `latest` | 防止可变选择、旧 cache 或旧请求静默作用于不同版本 | 选择与资格 / 一致性 / 安全边界 | 是运行入口可追溯和防混淆的核心长期决定。 |
| `ADR-RUN-003` | 跨域协作仅经 L0-sdk 或正式公开 API/adapter，不依赖相邻仓私有实现或内部存储 | 防止入口旁路 owner、封装、版本和审计边界 | 依赖方向 / 外部接缝 / 技术机制 | 长期约束编译期与运行期依赖；Sandbox backend 不进入 Runner。 |
| `ADR-RUN-004` | Authority、取得、完整性、请求、执行、控制、清理和诊断采用多轴状态，`accepted ≠ running` | 防止单一 RunnerRun success 压平不同 owner 和成功条件 | 核心语义 / 数据一致性 / 交互 | 决定后续状态对象、页面和验收如何保持来源差异。 |
| `ADR-RUN-005` | 本地材料经 quarantine、正式内容绑定和资格门禁后才晋级为 qualified cache | 防止传输完成、文件存在或 cache hit 替代完整性与当前 authority | 取得与材料资格 / 资源保护 | 长期影响下载、cache、淘汰和启动边界。 |
| `ADR-RUN-006` | 同步承接即时意图/判断，异步承接 owner 事实，后台承接长时本地工作与对账 | 防止长时工作阻塞入口或后台任务隐式创造成功 | 运行承载 / 关键交互 / 一致性 | 决定三类运行承载的协作语义，但不锁协议产品。 |
| `ADR-RUN-007` | 副作用结果 unknown 时冻结自动重放，以 owner-safe 查询对账，不能确认则 manual-review | 防止断线、超时或重启后重复 start/stop/cleanup 和误删 | 资源清理 / 恢复 / 韧性 | 长期决定故障恢复的安全性格。 |
| `ADR-RUN-008` | 输出预览、失败诊断和 handoff 必须 redaction-first、body-bounded、带来源，且不构成正式 evidence/verdict | 防止 raw output、secret 和本地日志越界为审计真相 | 诊断预览 / 数据边界 / 横切安全 | 长期保护敏感信息和 Observability ownership。 |
| `ADR-RUN-009` | 本地平台 probe 与 Sandbox allocation/lease/cleanup 保持双视图，不互相替代 | 防止端口、PID、路径观察被误作全局资源或清理成功 | 资源/恢复 / 数据一致性 / 交互 | 是跨平台体验不侵占 Sandbox truth 的长期边界。 |

## 3. 架构决定停审记录

| ADR | 架构单元 / 跨单元来源 | 需求 / 约束 / 风险来源 | 取舍来源 | 停审 |
|---|---|---|---|---|
| `ADR-RUN-001` | Step 3/5/7/8 跨单元审计 | `FR-RUN-001~013`、`BR-RUN-022~025`、`AB-RUN-002/004/007/008` | Step 10 正式接缝/数据分离；Step 11 最小本地 truth | 值得长期保留，无新结论；通过。 |
| `ADR-RUN-002` | 选择与资格承接 | `FR-RUN-002`、`BR-RUN-001~005`、`AC-RUN-001~002` | Step 10 generation/content binding | 来源充分，非字段级决定；通过。 |
| `ADR-RUN-003` | 依赖方向跨单元审计 | `BR-RUN-025`、`AC-RUN-011`、全局依赖规则 | Step 10 正式接缝隔离 | 来源充分，非具体 SDK 方法；通过。 |
| `ADR-RUN-004` | 运行意图、资源恢复、诊断多个单元 | `FR-RUN-003~013`、`BR-RUN-006~021` | Step 10 多轴状态；Step 11 状态消费路径 | 决定长期语义，未伪造 owner 状态；通过。 |
| `ADR-RUN-005` | 取得与材料资格承接 | `FR-RUN-003~004`、`BR-RUN-006~008/014` | Step 10 quarantine 晋级；Step 11 cache 路径 | 不锁算法/产品；通过。 |
| `ADR-RUN-006` | Step 6/9 运行与交互跨单元审计 | `FR-RUN-003/005~013`、查询 no-write 约束 | Step 10 三路径；Step 11 同步/异步路径 | 不锁协议或部署；通过。 |
| `ADR-RUN-007` | 资源、清理与恢复保护 | `FR-RUN-007/009~010`、`BR-RUN-012~018/024`、`AC-RUN-009` | Step 11 自动对账/全人工路径 | 来源充分，保留 manual-review；通过。 |
| `ADR-RUN-008` | 输出预览与失败诊断 | `FR-RUN-011~013`、`BR-RUN-019~023`、`AC-RUN-010~011` | Step 10 redaction-first | 不把交接写成 evidence；通过。 |
| `ADR-RUN-009` | 资源、清理与恢复保护 | `FR-RUN-008~010`、`BR-RUN-015~018`、`RUN-UP-007` | Step 10 双视图 | 保持上游 blocker，不补责任合同；通过。 |

## 4. 需求追溯矩阵

| 需求来源 | 需求结论 / 约束 | 架构承接结果 | 承接位置 | 说明 |
|---|---|---|---|---|
| 正式 `00` `CP-RUN-01`、`FR-RUN-001~002`、`BR-RUN-001~005` | 可信语境下显式选择 immutable Release/version，authority 不可本地补齐 | 选择与资格核心子域、generation/content binding、同步资格判断、`ADR-RUN-002` | §4～§6、§9～§11、§17 | 把需求门禁转译为边界、数据和交互结构。 |
| 正式 `00` `CP-RUN-02`、`FR-RUN-003~004`、`BR-RUN-006~008` | 取得、cache、完整性和平台资格分离，未通过不得运行 | 取得支撑子域、quarantine→qualified 材料机制、后台取得承载、`ADR-RUN-005` | §6～§7、§9～§11、§17 | 传输与资格在架构中保持独立来源和状态。 |
| 正式 `00` `CP-RUN-03`、`FR-RUN-005~007`、`BR-RUN-009~013` | 正式请求、accepted、running、terminal 和控制结果不得压平 | 本地意图核心子域、多轴状态、同步意图+异步 owner 事实、`ADR-RUN-004/006` | §4～§11、§17 | Runner 只拥有意图和展示，执行结果回指 owner。 |
| 正式 `00` `CP-RUN-04`、`FR-RUN-008~010`、`BR-RUN-014~018/024` | 资源冲突、lease/保护、清理和断线恢复必须 fail-closed | 资源/清理/恢复核心子域、probe/owner 双视图、unknown 冻结、`ADR-RUN-007/009` | §6～§11、§13～§17 | 把副作用安全和材料保护落实为承载、数据和恢复机制。 |
| 正式 `00` `CP-RUN-05`、`FR-RUN-011~013`、`BR-RUN-019~023/025` | 预览/诊断/handoff 必须 bounded/redacted、有来源且非 evidence/verdict | 诊断支撑子域、redaction-first、安全交接、`ADR-RUN-008` | §4～§13、§15～§17 | 用户解释能力与 Observability truth 明确分离。 |
| 正式 `00` §6/§12、`BR-RUN-025`、`AC-RUN-011` | 跨仓依赖必须 SDK-first，不得直连私有 backend/topic/storage | 分层依赖方向、裁剪/禁止依赖表、正式接缝隔离、`ADR-RUN-003` | §5、§7～§8、§10～§11、§17 | 将依赖规则落实到编译期/运行期/事件分类。 |
| 正式 `00` §11/§13 | Runner truth、上游 snapshot/ref、禁止正文和六类 NFR 必须持续成立 | 数据归属/一致性表、六类横切约束、`ADR-RUN-001/008` | §9、§13、§17 | 数据和非功能要求被转译为长期架构约束。 |
| 正式 `00` `FR-RUN-014~016`、§15 | 批量预取、多运行比较、Archive 浏览仅为外围并受 blocker 控制 | 不进入核心子域；在演进路线和风险/待确认中条件性保留 | §3、§6、§14～§16 | 架构承接其外围身份，不伪装为当前主线。 |
| 正式 `00` §14 `AC-RUN-001~011` | 验收必须区分 authority、材料、请求、执行、清理、恢复和诊断边界 | 多轴状态、正式来源、fail-closed、横切约束与 ADR 主线 | §9～§13、§16～§17 | 架构提供后续概要/测试可映射的结构判断，不声称已有证据。 |

## 5. 追溯缺口检查表

| 追溯缺口类型 | 对象 / 缺口 | 影响范围 | 当前状态 | 说明 |
|---|---|---|---|---|
| 承接关系未闭环 | `RUN-UP-001~002` 的 Release/authority exact contract | 选择、取得、资格和 `ADR-RUN-002/005` 的具体接缝 | `blocked` | 架构边界已承接，具体来源对象和协议不能主观补齐。 |
| 承接关系未闭环 | `RUN-UP-003~004/007` 的 Sandbox/Runtime/平台状态与恢复合同 | 请求、生命周期、资源清理和 `ADR-RUN-004/007/009` | `blocked` | 当前只有 owner-safe 结构约束，正向合同仍缺。 |
| 承接关系未闭环 | `RUN-UP-005~006` 的 Observability/Archive 消费与交接合同 | 诊断 handoff 和外围 Archive 能力 | 核心部分 `blocked` / 外围条件性 | 不可用本地日志或历史材料补齐正式交接。 |
| 承接关系未闭环 | `RUN-UP-008` 的 L0-sdk exact surface | 全部跨域接缝和 `ADR-RUN-003` 的落地面 | `pending` | SDK-first 决策有正式来源，但具体 client/error/redaction/trace 尚未核验。 |
| 架构判断缺来源 | 无 | 全部正式架构主线 | 无缺口 | 每项 ADR 和主线结论均回指正式 00、依赖规则或已登记风险。 |
| 需求未被承接 | 无核心缺口 | `CP-RUN-01~05`、`FR-RUN-001~013`、`BR-RUN-001~025`、`AC-RUN-001~011` | 已承接 | 外围 `FR-RUN-014~016` 也以条件性演进/风险方式承接。 |

## 6. 跨 ADR / 需求追溯审计

| 审计项 | 结果 |
|---|---|
| 孤儿架构决定 | 无；`ADR-RUN-001~009` 均有正式需求/约束/风险和已停审单元来源。 |
| 孤儿核心需求 | 无；五个能力节点、13 项核心功能、25 条规则和 11 项验收均进入矩阵。 |
| 普通实现选择误入 ADR | 无；语言、桌面框架、数据库、协议、Sandbox backend 和量化数字均未进入。 |
| 取舍缺来源 | 无；ADR 分别回指 Step 10/11 已收稳机制或路径。 |
| 新增未确认结论 | 无；上游 exact contract 只保留追溯缺口，不写成已成立。 |
| 单元停审 | 选择、取得、运行意图、资源恢复、诊断预览、入口展示及跨单元决定均通过。 |

## 7. 回填草稿与门禁

正式 §16 回填需求追溯矩阵和缺口表；§17 回填 ADR 索引及决策边界说明。ADR 编号只作本正式文档索引，不声称已有独立 ADR 文件、批准或实施事实。

`Step 15 gate_status = pass`；下一步允许进入 Step 16 正式文档整理。
