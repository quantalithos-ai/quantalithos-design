# Step 2. 明确本仓设计目标与当前范围

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 2。

### Step 内计划

- [x] 读取项目 ledger、02 flow 与 Step 1。
- [x] 读取正式 00 的目标/功能与正式 01 的演进/风险边界。
- [x] 回答本轮必须收稳的结构、深度、范围和非范围。
- [x] 诊断旧 02 的功能愿望、架构重述和详细实现混层。
- [x] 输出设计目标、非范围、深度和进入下一步门禁。

## 2. 本步输入

Step 1 已收稳的可承接边界；正式 00 §4/9；正式 01 §6~15。`AR-UP-001~009` 与 `AR-ARCH-001` 继续限定正向外部合同，但不改变本仓需要形成可实现的保守骨架。

## 3. SOP 问题回答

1. 必须讲清：六个主要组成部分如何映射为代码主体，Archive-owned truth 如何由对象承接，入口/任务/事件如何分类，关键长流程和多轴状态如何衔接。
2. 必须达到：详细设计无需重新发明 request/job、binding/capture、manifest/closure、verification/compatibility、storage/lifecycle、restore/handoff 等主语。
3. 当前范围包括有类型字段骨架、带类型参数的成员/工厂函数、API 输入输出骨架、关键处理流、状态迁移、异常和配置影响轮廓。
4. 当前不包括完整 schema、协议、DDL、目录/文件、算法/provider、配置默认值、测试/验收/实施计划。
5. 对未闭合外部合同，只交付 required port、blocked/unknown/unsupported/commit-unknown 语义，不交付可运行正向集成。

## 4. 当前文档问题诊断

旧 02 以“背景/目标/全局位置/主要部分”重复需求和架构，又用 ArchivedSnapshot、ArchiveIndex、RetentionClass 等对象提前决定本仓模型，同时混入 SLA、容量等级、备份和高级历史分析。它既没有新版关键字段/函数骨架，也没有 Command/Query/Event/Job、处理流和多轴状态的完整承接，因此不能成为本轮范围基线。

## 5. 改动前后对比

| 旧范围 | 当前范围 |
|---|---|
| 重讲为什么需要 archive 和全局位置 | 直接承接正式 00/01，只下沉可实现结构 |
| 平铺 snapshot/index/retention/restore 功能 | 围绕六个已停审语义单元形成稳定主要组成部分 |
| 提前承诺 query、tier、SLA、evidence replay | 只写有来源的接口/流/状态骨架，未知 fail-closed |
| 对象/协议/任务混在章节中 | Step 5~9 分别收稳 capability→对象→接口→流→状态 |

## 6. 设计取舍

- 采用“骨架足够具体、合同保持保守”的深度：本地对象和接口可命名，外部 exact schema 不猜测。
- 采用六个主要组成部分与实现分层双轴，是否进一步拆分只允许在 Step 4/5 有正式依据时决定。
- 不把 read/verify 另建第七个 truth 组成部分，它保持 U3/U4/U5 的只读组合面。

## 7. 结构化中间产物

### 7.1 设计目标

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 建立双轴代码主体框架 | 六个业务主要组成部分与 Inbound/Application/Domain/Ports 等实现分层正交 | 可继续收口模块/文件，而不把 U1~U6 机械变成部署或 crate |
| 建立归档请求到 Bundle 的对象骨架 | request/job、source binding、manifest/closure 和 verification 必须有稳定主语 | 对象字段/函数全集、事务与持久化结构的输入 |
| 建立存储/治理执行骨架 | location/tier/commit/retrieval 与 governance decision/execution 必须分离 | adapter、状态映射、幂等/核对和配置实现契约 |
| 建立 owner-safe 恢复骨架 | plan/material/handoff/outcome 按 owner/item 展开，不获得跨域写权 | receiver port、逐项事务、冲突/unknown/补偿协议 |
| 建立接口、处理流与多轴状态闭环 | Command/Query/Event/Job 有归属，关键流引用已定义对象，状态互不越权推导 | 函数签名、协议 schema、事务边界、错误码与测试矩阵 |
| 建立风险与配置交接边界 | blocker、禁止配置化和详细设计展开项显式可追溯 | 03/04 不得暗补外部 authority 或 readiness |

### 7.2 非范围

| 非范围 | 留给哪一层 |
|---|---|
| identity/conversation/work/process/governance/artifact/workspace/observability 业务 truth 与状态机 | 各 owning project；本仓只消费正式材料/决定或交接 |
| runtime/tools/capability/sandbox/marketplace、产品 UI、SDK client/cache | 相邻仓或产品/分发层，不进入 Archive 主体 |
| provider、语言、数据库、对象存储、算法、KMS、压缩和 schema registry 选择 | 既有架构 blocker 关闭后由详细/配置/实施设计核验 |
| 完整字段模型、返回类型全集、序列化 schema、HTTP/topic、DDL/索引、代码目录/文件 | `03-详细设计.md` |
| 配置项名称、默认值、环境变量、secret 名、部署挂载与运维流程 | `04-配置设计.md` 及实施/运维层 |
| 完整测试用例、验收 verdict、实现任务、commit boundary 与 readiness | `05`~`07`；需后续逐文档授权 |
| 任意保留期、删除许可、项目 archived/restored 或 receiver committed 结论 | 正式 governance/work/receiver owner；非本仓配置或状态 |

### 7.3 当前设计深度

- 点名正式主要组成部分、service/aggregate/value/projection/history record/port/job 等代码主体骨架。
- 关键对象独立成节；字段写概要类型，函数参数写 `TypeName param_name`，不写完整签名或实现。
- 接口按 Command/Query/Inbound Event/Outbound Event candidate/Operations Job 分类，不写 transport schema。
- P0 Command、改写本地状态的 event consumer、影响一致性的 job 画处理流；状态机按对象/轴分开。
- blocker 下的正向工厂、adapter 或 event 只可写 required contract 与拒绝/挂起语义，不能声称上游已提供。

## 8. 回填草稿

正式 §2 摘录目标表、非范围表和深度短文；不复制旧文档的背景、功能目标或量化指标。

## 9. 待确认事项

六 CP 是否需要在概要层进一步拆分，将在 Step 4/5 由职责、capability 与对象候选密度判断；此处不预设。外部合同仍按 `AR-UP-*` 阻塞。

## 10. 进入下一步条件

目标、非范围和设计深度互不混层，且每个目标都能交付给详细设计；没有提前创建对象或接口。`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 3。
