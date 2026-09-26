# Step 1. 确认配置输入边界

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 1。
> 回填章节：未来正式 `04-配置设计.md` §1。
> 当前模式：`full-restart + single-agent-serial`；旧 05/06、README、draft 只作 historical/direction input。

## 1. Step 状态与门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `1 / upstream_boundary` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 当前模块 | 正式 00～03、03 config contract、专项上游 04、下游方向输入 |
| 正式 04 写入 | false；Step 15 前不得创建 |
| 下一动作 | `enter_step_02_scope` |

### 1.1 Step 内计划

| 批次 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 1.1 | SOP/规范与三层门禁读取 | completed | 配置 15 Step、正式 15 章和 03 回写规则明确 |
| 1.2 | 项目正式 00～03 与 Step 14/15/17/18 输入抽取 | completed | config family、binding、观测、下游和 blocker 可定位 |
| 1.3 | 八个专项上游正式 04/必要台账核验 | completed | 只承接 binding 语境，不以配置文档关闭 owner contract blocker |
| 1.4 | 输入映射、不答/必答与影响判定 | completed | 未新增代码契约；所有输入有权威级别 |
| 1.5 | 自检与停审 | completed | 允许进入 Step 2，不允许写正式 04 |

## 2. 本步目标与输入

本步只确认配置设计从哪里取得事实、哪些问题必须在 04 回答以及哪些问题仍属于上游、详细设计或下游，不定义 raw key、默认值、环境矩阵或密钥产品。

| 输入 | 权威级别 | 本步用途 |
|---|---|---|
| `00-需求文档.md` | 当前正式 | clone/pull/status/push-review、安全红线、显式选择、权限、dirty non-overwrite、provenance 与审计要求 |
| `01-架构设计.md` | 当前正式 | 五 feature、正交 adapter/composition、truth ownership、compile/runtime/event 依赖和 fail-closed 边界 |
| `02-概要设计.md` | 当前正式 | 29 对象、入口、状态、配置影响轮廓和详细设计承接项 |
| `03-详细设计.md` | 当前直接输入 | `ValidatedSyncRuntimeConfig` 语义、八个 config family、capability snapshot、runtime composition、配置禁止项与测试切口 |
| `03_ddd_step_14_config_dependencies.md` | 当前直接输入 | 42 个 code-level leaf、typed ref、binding/capability、route matrix、timeout/failure 与不可配置边界 |
| 03 Step 15～18 | 当前直接输入 | closed observability、planned test cuts、下游 handoff、`SYNC-*` 风险和待确认事项 |
| 八个专项上游正式 04/必要台账 | 外部正式语境 | 核验 SDK、identity/work、source、handoff、archive、observability 的 ref/profile/binding 处理；不得反推 Sync schema/API |
| `L1-governance` 04 calibration/formal | 框架参考 | 配置域小循环、JSON、影响判定和正式装配粒度；不继承 Governance 配置项 |
| 当前 `05-测试方案.md` / `06-验收标准.md` | `historical_material / direction_only` | 仅识别未来环境、负向配置、验收门禁方向；不得覆盖当前 03 |
| README、draft、旧正式材料 | `historical_material` | 污染扫描；Rust/Tauri/LFS/shallow/GUI/旧 metadata 选择不进入当前配置事实 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 承接哪些需求、非功能、安全与环境差异？ | 承接显式 project/version/source/target、权限与归档姿态 fail-closed、`.qs-sync` logical metadata、dirty/path/symlink/lock non-overwrite、bounded input、unknown outcome、append/protected provenance、secret/body redaction 和 Query zero-write。环境类别只作为 Step 6 待收敛输入，当前不继承旧 05/06 数值或命令。 |
| 2. 03 哪些配置引用与 builder/adapter 进入 04？ | `configRef/profileRef`；`SyncBoundaryLimits`、`SyncExecutionBudgets`、`SyncJobBudgets`、`SyncMetadataBindings`、`SyncSdkBindings`、`SyncLocalToolBindings`、`SyncSupportBindings`、`SyncOperationsBindings`；22 项 `SyncAdapterCapability`、四态 availability、immutable snapshot、loader/validator/capability validation/runtime composition 顺序。 |
| 3. 哪些测试/验收方向依赖配置矩阵？ | raw source/unknown key/type/range/cross-field、profile/ref binding、secret ref-only、hard-boundary reject、capability totality、read/write graph isolation、timeout known/unknown、sink failure、Consumer blocked registration 和 historical binding。真实 case/AC/EV 留 05/06。 |
| 4. 哪些内容不在 04 重定义？ | Project/Artifact/Baseline/Gate/Decision/Workspace/Archive/Git remote truth；29 对象、Port、DTO、flow、17 状态；source authority/comparator、permission matrix、handoff/probe equivalence、metadata physical schema、CLI parser/bin/package manager、实现库、部署命令和测试/验收判定。 |
| 5. 上游缺口是否阻塞配置设计？ | 不阻塞 Step 2～14 的配置控制面设计；它们阻塞相应 positive adapter/binding 变成 `bound`。04 必须允许合法配置经分类后得到 `blocked/unsupported/unknown`，不能借默认/fake/config 开关变正向。 |

## 4. 当前文档问题诊断

| 位置 | 现状 / 问题 | 本轮处置 |
|---|---|---|
| 正式 `04-配置设计.md` | 不存在 | 正常目标状态；Step 15 前不创建 |
| `03` §13 / Step 14 | code shape、绑定点和禁止项完整，但 raw JSON key、来源优先级、profile、敏感级别、变更和失效未定义 | Step 2～13 逐项展开，不修改 code shape |
| `03` 的 42 个 code-level leaf | 03 明确它们不是 raw key，且大多无默认 | Step 7 建立一对一 raw mapping、required/default 与严格 JSON demo |
| SDK/source/handoff/metadata positive adapter | 正向合同未闭合 | raw ref 可以合法存在，但 capability classification 仍为 blocked/unknown；不把 ref 存在当 bound |
| `SYNC-LOCAL-001~005` | implementation/toolchain 选择未确认 | 仅和 runtime config 有直接关系的 source selector 后续审查；Node/package/parser/test/Git library 不塞进 P0 config |
| 旧 `05/06` | 与本轮 00～03 不同基线 | direction only；正式 04 先行，05/06 后续 full-restart |
| 旧 README/draft | Rust/Tauri、固定 metadata/LFS/shallow/GUI 等历史选择 | historical pollution only；不得生成开关 |

## 5. 改动前后对比与设计取舍

| 议题 | 旧/未收口状态 | 当前取舍 | 原因 |
|---|---|---|---|
| 配置入口 | 只有 code-level interfaces | 先完成 15 Step calibration，Step 15 才装配正式 04 | 中间产物先于正式文档 |
| 配置域来源 | 可被旧 README/其他仓配置误导 | 只从本仓正式 03 exact family 派生；上游 04 只作接缝核验 | 防止跨仓配置成为第二真相源 |
| 正向绑定 | 可能误把 adapter ref 视为 capability | ref、constructor validation、capability availability、call outcome 四层分开 | 继承 03 的分层语义 |
| 下游测试/验收 | 旧 05/06 可能反向定义数值/环境 | 仅保留方向，待正式 04 完成后重建 | 文档顺序 00→…→07 |
| 详细设计回写 | 可能在 04 静默新增 loader/field/error | 当前只细化既有类型；任何 code-shape 变化立即回流 03 | 保持 1:1 可落码 |

## 6. 结构化中间产物

### 6.1 上游输入映射

| 来源文档 | 配置输入 | 正式 04 落点 |
|---|---|---|
| 正式 00 | 显式选择、安全/权限/dirty/provenance/unknown 红线 | §1、§4、§11 |
| 正式 01 | ownership、五 feature、adapter/composition、运行期依赖 | §1、§3～§5 |
| 正式 02 | config impact、入口/状态/异常骨架 | §1、§3、§11～§12 |
| 正式 03 §3～§5 | TypeScript/ESM、planned file tree、feature/technical boundary | §1～§4、§7、§9 |
| 正式 03 §7～§12 | protocol limits、flow、state、UoW/error/idempotency | §4、§7、§9～§11 |
| 正式 03 §13 | 八 config family、capability、composition、timeout/依赖与 hard boundary | §3～§11 |
| 正式 03 §14～§15 | redaction、closed signal、planned config test cuts | §8、§11～§12 |
| 正式 03 §16～§17 | downstream handoff、blocker、pending/local choices | §12～§14 |
| 专项上游正式 04 | opaque ref/secret/config boundary 的 owner 语境 | §5、§8、§11、§14；不导入其私有 key |

### 6.2 配置设计不再回答

- 不选择或改变 Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive 或 Git remote owner。
- 不重定义 29 对象、10 Command、13 Query、3 Consumer、3 Job、17 状态及其函数/Port/schema。
- 不通过配置决定 source authority、version comparator、gap replay、permission/action matrix、review accepted 或 effect equivalence。
- 不锁定 `.qs-sync` 物理文件/数据库/schema/migration/retention，也不把旧 `metadata.json` 恢复成真相。
- 不选择 Node/package manager/package/bin/CLI parser/schema validator/test runner/Git library，不生成 package/lock/命令。
- 不写部署挂载、secret 注入命令、schedule、告警阈值、测试用例、AC/EV、phase/commit boundary。

### 6.3 配置设计必须回答

- 42 个既有 code-level leaf 如何映射到 raw strict JSON，哪些 required、哪些允许 null、是否有 default。
- ordinary source 是什么、是否存在覆盖、冲突/unknown key/非法高优先级值如何处理。
- profile/environment 如何分类，哪些只是设计 profile 而不是新 code enum。
- opaque adapter/policy/provider ref 的来源、sensitivity、resolution、capability classification 和失败姿态。
- parse→type→cross-field→hard-boundary→binding→capability→new composition 的顺序。
- 配置变更是否只允许 cold new composition、旧 operation 如何 pin 旧 snapshot、回退如何处理。
- secret/raw body/path/endpoint/provider payload 的禁止输出和轮换边界。
- 缺失、非法、依赖不可达、capability blocked/unknown、commit/effect timeout 和 diagnostics failure 的失效语义。
- 05/06/07/09 应承接什么以及不得重定义什么。

### 6.4 初始配置域候选

| 配置域 | 03 exact family / carrier | 当前正向能力姿态 |
|---|---|---|
| identity & candidate | `configRef`、`profileRef` | 可定义 immutable identity；不是 readiness |
| boundary limits | `SyncBoundaryLimits` | 可完整定义 raw schema；数值待 Step 7 |
| execution budgets | `SyncExecutionBudgets` | 可完整定义；timeout 不改变 known/unknown |
| job budgets | `SyncJobBudgets` | 可完整定义；不创建 schedule/scope/key |
| metadata bindings | `SyncMetadataBindings` | ref schema可定义；positive atomic adapter受 UP-006 |
| SDK bindings | `SyncSdkBindings` | ref-only schema可定义；positive surface受 UP-001～005/008 |
| local tool bindings | `SyncLocalToolBindings` | ref-only schema可定义；Git/fs exact contract受 UP-007/009/010 |
| support bindings | `SyncSupportBindings` | ref-only/redaction可定义；sink/product受 UP/LOCAL blocker |
| operations bindings | `SyncOperationsBindings` | nullable slots可定义；3 Consumer blocked，Jobs只 explicit runner |

## 7. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 04 只细化 `ValidatedSyncRuntimeConfig` 与八 family 的 raw/source/profile/failure 语义 | 否 | 既有 code shape 的配置层展开 | 不适用 | 无回写 |
| adapter ref 存在不等于 `bound`，四态 capability 与 per-call result 保持分层 | 否 | 继承既有不变量 | 不适用 | 无回写 |
| 旧 05/06 和专项上游配置不能定义本仓 runtime type/Port/DTO | 否 | 权威级别约束 | 不适用 | 无回写 |
| 当前不新增 config loader public API、hot reload、config event、config ledger、fingerprint field 或 migration command | 否 | 明确排除 code-shape 变化 | 不适用 | 无回写 |

当前 `待回写=0`、`阻塞待确认=0`。上游 blocker 影响 capability availability，不构成 03 code-contract 回写项。

## 8. 回填草稿

未来正式 §1 应声明：本文直接承接当前正式 00～03，尤其是 03 §13 与 Step 14；八个 config family 和 runtime composition 是唯一代码级输入。专项上游 04 只提供 owner/ref/secret/binding 语境，不关闭 Sync 的 SDK/source/access/handoff blocker。旧 05/06、README 和 draft 不是配置真相源。本文只细化 raw schema、source、profile、sensitivity、validation、activation、change 和 failure，不重新定义对象、Port、DTO、状态或 flow。

## 9. 待确认事项

| 事项 | 当前影响 | 未确认前处理 |
|---|---|---|
| `SYNC-UP-001~010` | 正向 adapter、physical metadata、source/comparator、review/probe 与 Git/fs capability | 保留 `blocked/unsupported/unknown`；不影响负向/config control plane 设计 |
| `SYNC-LOCAL-001~005` | runtime/tool/package/entry 实现选择 | 非 raw runtime config 的项不进入 04；相关 source selector 只留 entry-local pending |
| 正式 05/06/07/09 尚未重建 | config case、gate、boundary、部署操作未存在 | §12 只给输入，不伪造编号或证据 |
| 目标实现仓不存在 | 无真实 registry、file、secret provider 或 profile instance | 所有样例标为 documentation candidate，不声称可运行 |

## 10. 自检与进入下一步条件

| 检查项 | 结果 |
|---|---|
| 输入清单、权威级别和历史材料边界明确 | pass |
| 03 exact config family/builder/adapter/capability 均已承接 | pass |
| 专项上游未被用来反推本仓 API/schema | pass |
| 不答/必答问题可判定 | pass |
| 当前无 03 待回写或阻塞待确认 | pass |
| 未创建正式 04、未进入 Step 2 内容、未实现/测试/提交 | pass |

结论：Step 1 `pass_with_upstream_blockers`；允许进入 Step 2，所有 blocker 原样继承。
