# Step 1. 确认上游输入边界

## 1. Step 状态与计划

- 模式：`full-restart + single-agent-serial`。
- `gate_status=pass_with_upstream_blockers`；本 Step 文档静态自检完成，`SYNC-UP-001~010` 原样开放。
- `source_files`：正式 00/01、专项上游当前正式 00/01/02 与必要台账、02 flow、概要 SOP/规范、全局依赖规则和闭环标准。
- `formal_fill_allowed=step14_only`；本步只确认输入，不写正式 02，不拆对象/API/处理流/状态机。

### Step 内计划

1. 回读三层台账、正式 00/01 和概要 Step 1 规范。
2. 逐项核对本项目需求/架构结论与八个专项上游 owner 边界。
3. 区分稳定 ownership、可保守展开输入与会阻断正向路径的未闭合合同。
4. 完成历史 02 污染诊断、结构化映射和正式 §1 回填草稿。
5. 执行来源、依赖、truth ownership、blocker 和粒度静态自检后更新 flow/台账。

## 2. 本步输入

| 输入 | 本步用途 |
|---|---|
| `projects/L5-sync/00-需求文档.md` | 承接 `G/NG/CP/FR/BR/NFR/AC-SYNC` 与 `SYNC-UP-001~010` |
| `projects/L5-sync/01-架构设计.md` | 承接五个业务组成部分、实现分层、owner seam、数据与通信边界 |
| `L0-sdk`、`L1-identity`、`L1-work`、`L1-governance`、`L1-artifact`、`L1-workspace`、`L4-archive`、`L4-observability` 当前正式文档与必要台账 | 核对 owner truth、可消费引用和未闭合 surface |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 核对 Layer 5 并行窗口和依赖方向，不反向定义上游 |
| 概要 SOP/规范、中间产物规范、闭环标准 | 约束 Step 粒度、可追溯与可落码上限 |
| `projects/L1-workspace/draft/`、其 02 calibration 与正式 02 | 只参考框架、对象卡、接口/流/状态的表达粒度 |
| L5-sync README、旧正式 02、draft | 仅用于历史污染诊断和候选线索复核 |

## 3. SOP 问题回答

1. **承接哪些需求结论？** 承接显式 project/version/source/target 选择、权限与姿态 fail-closed、来源绑定、`.qs-sync` 受控 metadata、只读 status、安全全量/增量 materialization、dirty/conflict 保护、断点恢复与 unknown probe、review handoff 及分层结果；承接全部禁止自动 merge/rebase/push、覆盖 dirty、伪造 provenance 和把 ACK/commit 升格为平台 truth 的规则。
2. **承接哪些架构结论？** 承接五个业务组成部分及其依赖方向；外部 owner references 仅是共享支撑；入口、应用服务、领域/策略、ports、local persistence 与 adapters 是正交实现分层；平台 owner 与本地 Git/filesystem 不向 Sync 转移 truth ownership。
3. **哪些结论足够稳定？** 本地 session/working-copy metadata/cursor/mapping/conflict/attempt/checkpoint/provenance 的局部 ownership，status no-write，source/working copy 分离，变更路径 fail-closed，Git/transport/decision 分层，以及正式 SDK/owner port 和 Git/filesystem adapter seam 足够支撑概要骨架。
4. **哪些结论仍未收稳？** 精确 SDK surface、Artifact/Workspace source authority、项目归档动作矩阵、Review handoff/ACK/probe、跨域幂等、metadata 永久 schema、Git/source 映射、增量 comparator/gap、LFS/浅克隆/GUI 支持和人工冲突决策合同仍开放；受影响正向路径只能表达为 port + blocked/unsupported/needs-action。
5. **当前不该展开到哪里？** 不锁上游方法/DTO/错误码，不定最终 metadata 文件布局，不定义 Git remote truth，不承诺自动冲突解决、真实 review accepted、归档 mutation、具体配置键、完整函数签名/DDL/时序或运行性能数字。

## 4. 当前文档问题诊断

旧正式 `02-概要设计.md` 将 L5-sync 描述为跨 chat/console/runner 的统一同步与跨端一致性产品层，以 `SyncTask`、fanout、replay/resync、旧五部分和固定 SLA 为主语。它既转移其他 owner 的职责，也没有承接当前正式 00/01 的显式选择、working-copy 保护、source binding、Review Gate 和 provenance 主线。

因此旧 02 不能局部修补：其对象、状态、接口、指标和流程均只作 `historical_material`。本轮只在 Step 14 从 Step 1~13 已审核产物 full-restart 装配新正文。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 旧 02 以跨端同步任务和消息传播为核心 | 输入边界固定为平台—本地工作区受控同步窄域 |
| 混淆 Git、本地传输与平台业务状态 | 明确 local、Git、transport、Governance、Archive 各自 owner |
| 旧接口和状态被当作既定实现 | 只承接稳定 capability；精确合同缺口维持 blocker |
| README 的 Rust/Tauri、LFS、浅克隆等选择被默认继承 | 全部回到 historical/pending，只有当前 owner 证据可使其进入设计 |

## 6. 设计取舍

- 采用“稳定 ownership + 保守失败骨架”推进概要设计：上游缺口不阻止本地对象/接口负向边界收稳，但阻止相应正向合同被写成可运行事实。
- 正式 00/01 是直接真相源；专项上游只提供各自 owner 边界；L1-workspace 样本只提供文档粒度，不向 L5-sync 移植业务对象。
- 五个业务组成部分沿用正式 01，避免在概要层重新发明架构；实现分层仅用于代码主体映射，不能代替业务组成部分。
- status/query 保持纯观察；任何 refresh、repair、cursor advance、metadata migration 都必须是独立显式 mutation 或维护动作。

## 7. 结构化中间产物

### 7.1 本项目上游关系映射

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| 正式 00 §2~7 | 定位、owner 边界、角色、依赖与六节点能力闭环 | 将能力闭环映射为代码主体、组成部分和操作入口 |
| 正式 00 §8~12 | 用户故事、FR/BR、数据归属与外部能力依赖 | 形成关键对象、port/API 和本地 metadata 主题骨架 |
| 正式 00 §13~16 | NFR、异常、验收与追溯 | 形成异常边界、配置禁止项、详细设计与测试切口承接 |
| 正式 01 §4~8 | 责任边界、上下文、五个限界上下文、运行与依赖方向 | 形成五个业务组成部分和正交实现分层 |
| 正式 01 §9~13 | 数据/一致性、通信、技术机制、取舍、横切约束 | 形成本地对象、接口分类、关键流、状态与 adapter seam |
| 正式 01 §14~17 | 演进、风险、追溯、ADR | 保留 blocker，防止概要设计越界锁死历史方案 |

### 7.2 专项上游 owner 映射

| 上游 | 稳定承接 | 不得推导 / 当前缺口 | 对 02 的处理 |
|---|---|---|---|
| `L0-sdk` | 正式 client/formal API boundary、共享 error/trace 语境 | 不存在已核验的完整 Sync project/version/source/handoff surface 与兼容矩阵 | 定义 SDK capability ports；精确方法/DTO 后置，`SYNC-UP-001` |
| `L1-identity` | principal/identity truth 与认证语境归 Identity | 本地缓存或 Git identity 不构成认证/授权 | 保存 principal ref/snapshot；unknown fail-closed |
| `L1-work` | Project、ProjectMember、项目生命周期归 Work | Active/ReadOnly/Closed/Archived 不能自动推出 Sync 对 dissolved/retired 的完整动作矩阵 | access/posture port + snapshot；写路径受 `SYNC-UP-003` 阻断 |
| `L1-governance` | Review Gate / Decision 归 Governance | input accepted、responsibility fulfilled、HTTP/transport ACK 均不等于 Decision approved；handoff/probe 合同未闭合 | 分离 handoff attempt、transport outcome、decision ref；`SYNC-UP-004/005` |
| `L1-artifact` | Artifact/version/lineage/Baseline 归 Artifact | 本地 commit、working copy、candidate 或 ACK 不能成为 Artifact/Baseline | 只保存 source/artifact refs；source authority 受 `SYNC-UP-002/008` 约束 |
| `L1-workspace` | Workspace projection/read model 归 Workspace | 本地 working copy 不等于 Workspace projection；不能从目录反推 workspace truth | 仅在 owner 明示时消费 source/binding 摘要；不反写 projection |
| `L4-archive` | Archive lifecycle、package/seal/storage truth 归 Archive | sealed/storage committed/handoff ACK 不等于 Project archived/restored | 只读 posture/ref，变更能力不属于 Sync；unknown 限制危险动作 |
| `L4-observability` | trace、diagnostic、body-free evidence linkage 归 Observability | 日志/trace/evidence ref 不证明同步成功、Review verdict 或 readiness | 仅输出脱敏诊断/correlation；不保存 report/evidence 正文 |
| Git / filesystem | 本地 HEAD/index/tree、dirty/untracked、path/lock/atomic I/O 观察 | remote/branch/commit 不是平台 source、Artifact 或 Baseline truth | 通过白名单 adapter 观察和受限 apply；禁止自动 merge/rebase/push/stash |

### 7.3 稳定输入与受阻输入

| 分类 | 可在 02 收稳 | 必须保持开放 |
|---|---|---|
| owner | owner ref、snapshot、freshness、fail-closed policy | owner 内部 schema、授权算法、跨 owner source priority |
| local truth | session、binding、metadata generation、cursor/mapping、conflict、checkpoint、attempt、provenance | metadata 永久物理布局与保留/销毁细节 |
| commands | `clone`、`pull`、`status`、`push-review` 的语义与门禁骨架 | 未核验 CLI flags、exit code 和 SDK RPC 名 |
| materialization | prepare/validate/apply/finalize、dirty/path/gap 保护 | comparator、increment token、rename/delete 精确协议 |
| handoff | freeze candidate、prepare→call→probe/finalize、结果分层 | upload/ACK/probe/idempotency 的精确跨域合同 |
| adapters | SDK、Git、filesystem、metadata、diagnostic port 边界 | LFS、shallow clone、GUI/Tauri 支持承诺 |

### 7.4 本文不再回答 / 必须回答

**本文不再回答：**

- L5-sync 的业务价值、owner 划分、系统上下文、限界上下文、部署边界与依赖方向为何如此选择。
- Project、Artifact、Baseline、Workspace projection、Review Gate/Decision、Archive、身份与 Git remote 的内部模型或生命周期。
- 上游权限、source authority、review decision 或 archive truth 如何计算。
- 具体语言/框架、目录、数据库、配置键、完整协议 schema、运行结果或性能承诺。

**本文必须回答：**

- 五个业务组成部分如何映射到可继续详细设计的代码主体和实现分层。
- 哪些本地对象承载 session、binding、metadata、cursor/mapping、conflict/recovery、handoff/provenance，字段/行为骨架是什么。
- `clone/pull/status/push-review`、维护入口和 owner/Git/fs ports 如何分类并保持 query no-write。
- 关键处理流、状态归属、允许/禁止迁移、冲突与 unknown outcome 恢复怎样闭合。
- 哪些配置影响、安全红线、异常与测试/证据边界交给 03 继续展开；哪些正向路径因 blocker 不能交实现。

### 7.5 `SYNC-UP-001~010` 对概要层的影响

| ID | 受影响概要主题 | 本轮可写上限 | 禁止伪造的结论 |
|---|---|---|---|
| `SYNC-UP-001` | SDK ports/API | capability 名、输入输出类型类别、错误分类 | 真实 SDK 方法/DTO/兼容已存在 |
| `SYNC-UP-002` | source binding/materialization | owner-neutral source ref 与显式选择 | Artifact/Workspace 优先级已统一 |
| `SYNC-UP-003` | access/posture | recheck、freshness、fail-closed | 完整 archived/dissolved/retired 动作矩阵 |
| `SYNC-UP-004` | review handoff | candidate freeze、attempt 与 decision 分层 | ACK 即 accepted / Gate 已创建 |
| `SYNC-UP-005` | unknown/recovery | 本地 idempotency、probe-required、manual | 跨域等价重放已获 owner 保证 |
| `SYNC-UP-006` | metadata | 逻辑主题、generation/integrity/migration states | 最终目录/文件/schema/永久删除规则 |
| `SYNC-UP-007` | Git adapter | local observation 与受限 I/O | remote/branch/object 是平台 source truth |
| `SYNC-UP-008` | incremental cursor | comparator port、gap stop、cursor 分离 | 连续性/replay/兼容合同已闭合 |
| `SYNC-UP-009` | compatibility/entry | unsupported/pending capability observation | LFS、浅克隆、GUI/Tauri 当前受支持 |
| `SYNC-UP-010` | local protection | dirty/untracked/path conflict 与 manual stop | 自动 merge/rebase/stash/覆盖或自动决策安全 |

### 7.6 依赖裁剪核对

| 依赖类型 | 本仓用途 | 禁止替代 |
|---|---|---|
| compile / shared contract | ref、error、trace、metadata 共同类型候选 | 未核验符号不得写成真实 import |
| runtime / SDK | owner query、source fetch、handoff、probe | 不直读 owner DB，不用 private API 补缺口 |
| reference / snapshot | 本地可追溯 owner 语境 | snapshot 不授权、不成为 owner truth |
| Git/filesystem adapter | local observation、lock、path protection、受限 apply | 不执行自动 merge/rebase/push/stash，不定义 remote truth |
| observability adapter | redacted correlation 与诊断 | 不形成 success/verdict/evidence/readiness |
| fake / test double | 后续验证本地规则 | 不证明真实 owner、remote 或跨域合同可用 |

### 7.7 完成上限

Step 1 已证明当前输入足以展开“本地保守概要骨架”，没有证明任何上游正向接缝可运行。正式 02 即使完成，也只能把受阻路径标为 `blocked/unsupported/needs-action/probe-required/manual`；不能宣称实现、集成、测试、artifact、evidence、review verdict、signoff 或 readiness。

## 8. 回填草稿

正式 §1 将摘录 §7.1~7.4：先说明正式 00/01 的承接关系，再列专项 owner 输入；明确本文不再回答与必须回答的边界。`SYNC-UP-001~010` 的完整影响留在正式 §13，并在相关对象/API/流章节就地标注门禁。

延伸阅读入口应指向本文件的“专项上游 owner 映射”“稳定输入与受阻输入”“本文不再回答 / 必须回答”和“完成上限”。

## 9. 待确认事项

`SYNC-UP-001~010` 全部继续开放。任何 owner 后续补齐合同都必须回到相应 Step 重审对象、接口、处理流、状态和异常影响，不能只在正式正文或详细设计中暗改。

## 10. 进入下一步条件

- [x] 已回答 Step 1 五个问题并形成上游关系映射。
- [x] 已区分稳定 ownership、可保守展开输入与受阻正向合同。
- [x] 已核对依赖方向，无跨项目写入或 truth ownership 转移。
- [x] 已登记旧 02 污染，未提前展开对象、API、流或状态。
- [x] `SYNC-UP-001~010` 未被关闭或降级掩盖。

结论：`gate_status=pass_with_upstream_blockers`；允许进入 Step 2。该结论是文档静态自检，不是用户签署、上游 signoff 或实现许可。
