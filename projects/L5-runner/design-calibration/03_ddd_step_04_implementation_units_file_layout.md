# Step 4. 收稳实现单元与文件布局

## 1. Step 状态

| 字段 | 值 |
|---|---|
| 文档 | `03-详细设计.md` |
| Step | 4 / 收稳实现单元与文件布局 |
| 状态 | `completed_blocked_stop_review` |
| 当前模块 | `implementation_units_file_layout:blocked_self_reviewed` |
| gate_status | `blocked` |
| gate_reason | 目标仓不存在，且语言/runtime/product shell/process/store/concrete SDK binding 未获 authority；无法满足“实现者可直接创建真实 package/crate/binary/file”的 Step 4 进入下一步条件。仅逻辑责任单元可收稳，物理布局不得伪造。 |
| next_allowed_action | `stop_review_wait_for_user_and_authority` |
| 正式正文写入 | `blocked` |

### 1.1 Step 内计划

- [x] 恢复项目台账、03 flow 和 Step 3 技术决定状态。
- [x] 读取 Step 4 SOP、详细设计规范 §5.4、目录组织规范和正式 02 代码主体/交接。
- [x] 再次只读确认 `/home/aris/Projects/quantalithos-runner` 不存在。
- [x] 分别评估 single-crate、Rust workspace、TypeScript package 和 hybrid product layout。
- [x] 识别可独立于技术收稳的逻辑责任单元与物理布局所需前置条件。
- [x] 后置扫描 README/旧 03/draft 的目录污染。
- [x] 输出布局决定、实现单元、mapping/file tree/file table 的阻塞占位、命名检查与重开清单。
- [x] 同步 flow / 项目台账并在 Step 4 后停审；不创建 Step 5。

### 1.2 开工与写入前检查

- 项目级：用户授权到 Step 4，完成后必须停止。
- 文档级：Step 3 允许本步只做 blocked layout assessment；不表示技术决定已通过。
- Step 级：SOP 要求真实可创建路径、package/crate/binary mapping 和文件职责；若不能满足，必须 `blocked`，不得降低门禁。
- 事实检查：`/home/aris/Projects/quantalithos-runner` 再次核验为不存在。
- 历史门禁：README 的 `src-tauri/src/web/cli` 和旧 03 的 Rust `src/application/domain/infra` 只作冲突输入。

## 2. 本步输入

| 输入 | 本步使用 |
|---|---|
| Step 2 | 六部分/实现轴、完整 03 目标和非范围。 |
| Step 3 | 技术硬约束、真实 repo facts、`blocked_pending_authority` 技术决定。 |
| 正式 02 §4～§5 | 六业务部分与 Inbound/Application/Domain/Projection/Persistence/Ports/Operations 双轴。 |
| 正式 02 §12 | modules/pages/objects/commands/queries/jobs/ports、transaction/test/config 交接。 |
| Step 4 SOP / 书写规范 §5.4 | 布局形态决策、implementation units、package/crate/binary mapping、file tree、file table 和真实路径门禁。 |
| 目录组织规范 | `quantalithos-runner` 仓名；Rust single/workspace 规则；脚本/artifact/report 边界。 |
| 文件系统检查 | 目标仓不存在；Core/SDK sibling facts 已在 Step 3 记录。 |

## 3. SOP 问题回答

### 3.1 本轮实现包含哪些 crate / package / binary / library

无法给出真实 crate/package/binary/library 清单。原因不是设计偷懒，而是以下决定均为 package topology 的前置：

- Rust、TypeScript、其他语言或多语言 host；
- desktop/Web/CLI/product shell 组合；
- 单进程、后台 worker、sidecar 或 platform service；
- public SDK 的 Rust crate、TypeScript package 或其他 binding；
- local state/cache/provider 技术。

当前只能收稳**逻辑实现责任单元**，它们不是物理 package/crate/file：

| 逻辑责任单元 | 责任 | 来自概要设计 | 物理落点状态 |
|---|---|---|---|
| Entry and presentation | 多入口 context/action/query 映射、multi-axis view、cross-platform degradation | §4.2/§5.4.6/§12.2 | blocked pending shell/language |
| Context and selection | trusted context、explicit selection、authority posture/invalidation | §5.4.1/§6.1/§7～§9 | blocked pending language/SDK binding |
| Material acquisition and qualification | acquire/quarantine/verify/qualify/cache protection | §5.4.2/§6.2/§7～§10 | blocked pending runtime/store/provider |
| Run intent and lifecycle | run/control intent、owner projection、accepted≠running | §5.4.3/§6.3/§7～§10 | blocked pending SDK/Sandbox/Runtime contracts |
| Resource, cleanup and recovery | local probe、guard、cleanup intent、reconcile/manual review | §5.4.4/§6.4/§7～§10 | blocked pending platform/process/store/contracts |
| Preview, diagnosis and handoff | bounded/redacted view、failure mapping、handoff posture | §5.4.5/§6.5/§7～§10 | blocked pending SDK/redaction/Observability contracts |
| Local persistence/projection | Runner truth、safe refs、expected version、read model | §4/§8～§12 | blocked pending store/language |
| Required adapters | 14 semantic ports 的技术绑定、readiness/error mapping | §7.6/§12.1 | blocked by `RUN-UP-001~008` + binding decision |
| Operations | 5 jobs 的受控长时/恢复触发 | §7.5/§8/§12 | blocked pending process/runtime model |
| Composition/config/diagnostics/tests | dependency injection、typed policies、safe telemetry、test seams | §11～§12 | blocked pending language/runtime; contracts stay logical |

### 3.2 每个实现单元对应哪个概要代码主体

上述表已完成逻辑映射；但不能把表中每一行变成一个 crate/module/process。正式 02 明确六业务部分和实现层是正交轴，一个业务部分跨多个实现层，同一实现层服务多个业务部分。物理切分需要 Step 3 技术决定后再以依赖、入口和 public contract 强度判断。

### 3.3 文件路径应如何组织以体现模块边界

当前只能给出与语言无关的组织规则，不能给真实路径：

1. 入口/展示不得直接依赖 external adapter 或 writable store，必须经 application gate。
2. 核心对象/guards 不得依赖 UI shell、SDK client、OS API、store product 或 Sandbox backend。
3. Query/composer/presenter 只接只读 capability；refresh/reconcile/jobs 为独立写/后台入口。
4. External owner 只能出现在 required adapter boundary，不按 owner 名称建立 shadow domain。
5. local store/cache/platform/redaction implementations 与 semantic ports 分离。
6. fake/fixture/test support 不进入 production fallback。

文件扩展名、目录名和 manifest 路径无法在语言未定时真实确定。

### 3.4 哪些文件必须创建，哪些后续扩展

当前不能列“必须创建文件”。任何 `Cargo.toml`、`package.json`、`src/lib.rs`、`src/main.rs`、`src-tauri/`、`web/`、`cli/`、database migration、shell entry 或 worker binary 都依赖尚未关闭的决定。

允许记录的未来必备**职责类别**只有：manifest/build boundary、source module boundary、entry/composition boundary、local state/cache boundary、adapter boundary、tests；它们不是文件名或存在事实。

### 3.5 每个文件定义哪些对象/trait/handler/repository/test

无法填写文件职责表。可确认的后续分配原则是：

- 17 对象必须有唯一 module owner；
- 11 Command / 12 Query / 4 conditional Consumer / 5 Job 必须有唯一 entry/handler owner；
- 14 required ports 必须有唯一 semantic definition 与 adapter owner；
- state store、cache bytes、projection read 和 protection/cleanup capabilities 必须按读写与 ownership 分离；
- tests 按 module/protocol/flow/state/concurrency/platform/security 切口组织，并由真实 package/test runner 可发现。

### 3.6 当前仓 project slug

可确认 `runner`。计划实现仓名按规范为 `/home/aris/Projects/quantalithos-runner`，但当前状态是 `absent / not_created`。

### 3.7～3.10 Rust workspace/package/crate/binary 命名

全部 `not_applicable_until_rust_is_selected`：

- 不能决定是否使用 `crates/<role>`；
- 不能写 `runner-<role>` Cargo package；
- 不能写 `runner_<role>` Rust crate；
- 不能写 `runner`、`runner-cli`、worker/job binary。

若未来正式选择 Rust，必须重开本 Step，按 single-crate 与 workspace 的判断问题重新决策，且代码命名不得包含 `L5/l5_` 或重复 `quantalithos` 前缀。

### 3.11 架构层级是否泄漏进代码命名

当前没有新代码命名，因此无泄漏。未来硬约束：repo 可为 `quantalithos-runner`，仓内 package/crate/module/file/type/function 不得包含 `L5` / `l5_`；顶层职责不使用 `utils/common/helper`。

### 3.12 Cargo path dependency 写在哪里

当前不适用：无 Runner Cargo manifest，Rust 未选择。真实 Core/SDK Rust crate 路径只作为 Step 3 事实存在，不写入假想 `Cargo.toml`。

### 3.13 哪些关系不能进入 package dependency

Artifact/Governance/Work/Workspace/Runtime/Sandbox/Observability/Archive 为运行期 owner；L0-bus 为条件事件协作；OS/Sandbox backend/store provider 是 runtime adapter。它们均不得因 sibling repo 名称或旧 README 而成为 source/path dependency。即使未来 Rust 被选择，也只有正式批准的 Core/SDK public crates 可候选进入 Cargo。

## 4. 当前文档问题诊断

| 历史布局 | 问题 | 处置 |
|---|---|---|
| README：`Cargo.toml/src-tauri/src/web/cli` | 同时假定 Rust、Tauri、Web frontend 和 CLI，未定义依赖/进程/packaging 边界 | 不继承。 |
| 旧 03：单 `src/api/application/domain/infra/projection/types/config` | 假定 Rust single-crate/service 风格，且按旧五模块/queue 主线 | 不继承。 |
| draft：product shell/feature/application/domain/adapters/store/platform/telemetry | 逻辑责任覆盖较全，但仍是预校准候选 | 只用于遗漏扫描；以本步逻辑单元表为准。 |
| 目录规范的 Rust 模板 | 容易机械套用 `contracts/domain/application/infra/api/worker/jobs` | 只有 Rust + 边界强度确定后才适用。 |
| 其他项目的 planned workspaces | 可被误当跨项目模板 | 不能以相邻项目风格替代 Runner authority。 |

## 5. 改动前后对比

| 维度 | 历史/候选 | 当前收口 |
|---|---|---|
| 仓现状 | 隐含 Cargo/Tauri repo 已存在 | `/home/aris/Projects/quantalithos-runner` absent。 |
| 布局 | `src-tauri/src/web/cli` 或 Rust service tree | physical layout blocked；仅逻辑职责单元稳定。 |
| 实现单元 | 页面/五旧模块或标准七 crate | 六业务部分 × 实现层的逻辑映射；不等物理 package。 |
| SDK | Rust crate 默认 | binding depends on language + exact surface。 |
| Sandbox | shared source/backend | public runtime adapter only。 |
| tests/scripts | 可直接列标准目录 | 需真实 package/test runner 与 05/07 决定后再列。 |

## 6. 设计取舍

### 6.1 布局形态决策表

| 候选布局 | 是否采用 | 判断依据 | 影响 |
|---|---|---|---|
| Rust 单 crate 模块分层 | 未决定 | Rust 未获 authority；多入口/public contract 强度亦未闭口 | 不能写 `src/<module>`。 |
| Rust workspace 多 crate | 未决定 | Rust 未获 authority；是否需要 compile-time 强制 public contract/multi-entry 未闭口 | 不能写 `crates/<role>` 或 Cargo mapping。 |
| TypeScript package / browser client | 未决定 | SDK TS skeleton 存在，但 host wiring/owner schema/local resource runtime 不闭口 | 不能写 `src/*.ts`、package/bundler/framework。 |
| Rust host + Web frontend/Tauri hybrid | 不采用为当前结论 | 只有 README 历史材料，无正式 process/build/security/packaging authority | 禁止继承 `src-tauri/web`。 |
| 技术中立逻辑单元 + blocked physical layout | 是（本 Step 唯一真实结论） | 符合正式 01/02 和 Step 3 事实 | 允许保留责任映射；不满足进入 Step 5 门禁。 |

### 6.2 为什么不能用“planned layout”绕过门禁

“planned/not_created”可以准确描述一个**已获正式技术选择**但尚未创建的仓；本项目连语言/runtime/shell/package topology 都未选择。此时列 Rust crate 或 TypeScript 文件并非单纯计划，而是在无 authority 时作技术决定。SOP 要求路径能被实现者直接使用，故必须 `blocked`。

## 7. 结构化中间产物

### 7.1 实现单元总表

当前只能输出逻辑责任单元，不能冒充 §5.4 要求的物理实现单元：

| 逻辑实现责任单元 | 类型 | 职责 | 对应概要设计章节 | 物理落点 |
|---|---|---|---|---|
| Entry/presentation | logical boundary | 多入口、presenter、read-model composition、action availability | §4～§5、§7、§12 | blocked |
| Selection | logical capability | context、exact selection、authority posture、generation invalidation | §5.4.1、§6.1、§7～§9 | blocked |
| Material | logical capability | acquisition/quarantine/integrity/qualification/cache protection | §5.4.2、§6.2、§7～§10 | blocked |
| Lifecycle | logical capability | run/control intents、owner lifecycle projection | §5.4.3、§6.3、§7～§10 | blocked |
| Resource/recovery | logical capability | resource observation、guard、cleanup、reconcile/manual review | §5.4.4、§6.4、§7～§10 | blocked |
| Diagnosis/handoff | logical capability | preview、failure diagnosis、redaction、handoff posture | §5.4.5、§6.5、§7～§10 | blocked |
| Local state/read model | logical infrastructure | local truth persistence、projection/read model、expected version | §4、§8～§12 | blocked |
| External/platform adapters | logical infrastructure | SDK/owner/platform/store/redaction bindings | §7.6、§12～§13 | blocked |
| Operations | logical entry | five jobs、cancellation/checkpoint/recovery triggers | §7.5、§8、§12 | blocked |

### 7.2 目录 / Package / Crate / Binary 映射表

| 实现单元目录 | 类型 | Cargo package | Rust crate / binary | 职责 | 是否对外暴露 |
|---|---|---|---|---|---|
| `BLOCKED` | language/runtime/layout unresolved | `not_applicable` | `not_applicable` | 关闭 `RUN-DDD-001/002` 后重开本 Step | `undetermined` |

禁止将 §7.1 的 logical unit names 填入目录列；它们不是已确认路径。

### 7.3 文件布局树

```text
/home/aris/Projects/quantalithos-runner/  # planned repository identity only; currently absent
  <physical layout blocked>               # language/runtime/shell/process/store/binding unresolved
```

关键说明：

- 这不是计划源码树，也不授权创建目录。
- 除规范确定的 repo identity 外，没有任何 manifest、source、test、script 或 artifact path 获得确认。
- 关闭 blocker 后必须重开 Step 3，再重跑 Step 4；不能在 Step 5 临时补路径。

### 7.4 文件职责表

| 文件路径 | 所属模块 | 定义内容 | 主要责任 |
|---|---|---|---|
| `BLOCKED` | `undetermined` | language-specific contract unavailable | 等待技术与仓库 authority；不得由实现者自行命名。 |

### 7.5 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| 设计仓目录 | `projects/L5-runner` | pass |
| 实现仓目录 | `/home/aris/Projects/quantalithos-runner` | pass_as_name / absent_on_disk |
| project slug | `runner` | pass |
| layout shape | 已从 single crate / workspace / non-Rust 中选定 | blocked |
| member/package/crate/binary | 与所选语言和目录规范一致 | not_applicable / blocked |
| 架构层级泄漏 | 代码命名不出现 `L5/l5_` | no_new_code_names; future invariant |
| 顶层泛化目录 | 不使用 `utils/common/helper` | no_new_directories; future invariant |

### 7.6 依赖路径表

| 依赖仓库 | 全局依赖类型 | Manifest 位置 | dependency 写法 | 说明 |
|---|---|---|---|---|
| `quantalithos-core` | 编译期类别 | `BLOCKED` | `BLOCKED` | 具体 binding 取决于 Runner 语言；真实 Rust contracts path 不等当前声明。 |
| `quantalithos-sdk` | 编译期/运行期边界 | `BLOCKED` | `BLOCKED` | exact Runner public surface 未闭合；不依赖 SDK internal application/infra。 |
| L1/L2/L4 owners | 运行期 | 不适用 | 不得 path/source dependency | 只经 formal SDK/API adapters。 |
| `L0-bus` | 条件事件协作 | 不适用 | 不得直接 dependency/broker wiring | 只经正式 SDK event seam。 |

### 7.7 关闭 blocker 后的重开清单

| 必须先确认 | 重开时输出 |
|---|---|
| 语言及源码注释/编码规范 | type/module/file extension 与 lint/format contract |
| product shell 与入口组合 | UI/CLI/product entry package/module/binary |
| runtime/process/background model | main/worker/job lifecycle 与 composition root |
| local store/cache/file technology | persistence/cache/migration/locking directories |
| Core/SDK exact public binding | manifest dependency name/path/version 与 adapter boundary |
| target repo creation/existing files | actual deviation table、manifest/member/file mapping |
| test runner/build/package manager | discoverable test layout 与 scripts boundary |

## 8. 回填草稿

当前不能形成符合书写规范 §5.4 的正式第 4 章回填草稿；§7.1 只能作为未来物理布局讨论的责任输入。若在 blocker 未关闭时装配正式 03，只能明确该章 blocked，而不能声称可 1:1 实现。正式旧 03 保持不动。

## 9. 待确认事项

| 事项 | 当前影响 | 需要的确认 | 未确认前处理 |
|---|---|---|---|
| `RUN-DDD-001` 目标仓 | 无现状/偏离/manifest | 用户/实施计划与真实文件系统 | 不创建、不声称存在。 |
| `RUN-DDD-002` language/runtime/shell/process | 所有物理实现单元 | 用户或正式架构 authority | physical layout blocked。 |
| `RUN-DDD-003` store/cache/file | persistence/cache paths | 平台/security/crash-consistency 决策 | 不写 DB/schema/migration/path。 |
| `RUN-UP-008` concrete SDK binding | dependencies/adapters/contracts | L0-sdk + Runner integration authority | 不写 package/crate/version。 |
| `RUN-UP-001~007` owner exact seams | adapters/consumers/positive flow | 对应 owner contracts | logical required ports only。 |

## 10. 进入下一步条件

- [x] 已重新核验目标仓不存在。
- [x] 已识别逻辑责任单元并回指概要设计。
- [x] 已评估所有候选布局且没有从历史材料自动继承。
- [x] 已输出 mapping/tree/file table 的明确阻塞状态，而非伪造内容。
- [x] 已记录命名不变量、依赖分类和重开清单。
- [ ] 实现者可据本步直接创建真实 package/crate/binary/file。
- [ ] 语言/runtime/shell/process/store/binding 已收稳。

结论：Step 4 的讨论和阻塞评估已完成，但 SOP 的进入 Step 5 条件不成立，故 `gate_status=blocked`。按用户授权在 Step 4 后立即 `stop_review`；不创建 Step 5、不修改正式旧 03、不进入 04、不实现、不测试、不提交。
