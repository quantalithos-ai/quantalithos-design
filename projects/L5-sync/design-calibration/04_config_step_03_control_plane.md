# Step 3. 建立配置控制面总览

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 3。
> 回填章节：未来正式 `04-配置设计.md` §3「配置控制面总览」。
> 当前模式：`full-restart + single-agent-serial`；本文件是中间产物，不是正式 04。

## 1. Step 状态与门禁

| 项目 | 状态 |
|---|---|
| 当前 Step | `3 / control_plane` |
| Step 状态 | `completed / stop_review` |
| `gate_status` | `pass_with_upstream_blockers` |
| 前序门禁 | Step 1、Step 2 均 `pass_with_upstream_blockers` |
| 正式 04 写入 | `false`；Step 15 前不得创建 |
| 允许的下一动作 | `enter_step_04_categories_boundaries` |
| 实现 / 测试 / commit | `false / false / false` |

本 Step 的 `pass` 只表示配置控制面、配置域归属和边界已能继续向 Step 4～14 展开；不表示任何 SDK、远端来源、物理 `.qs-sync` 后端、Git/filesystem 工具或 consumer 已经 `bound`、健康、授权或 ready。

## 2. 本步目标与输入

本 Step 建立配置来源链、唯一装配入口、raw/validated config 的读取边界、控制面总表、配置域总表，并逐域完成停审。它不列最终 raw key、默认值、环境变量名、来源优先级、冲突策略或环境数值。

| 输入 | 权威级别 | 本 Step 采用内容 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 当前 04 校准输入 | 八个既有 config family、上游 blocker、历史材料隔离和 03 影响基线 |
| `04_config_step_02_scope.md` | 当前 04 校准输入 | P0/P1/P2、strict JSON candidate、cold composition、ref-only 与非范围 |
| `03-详细设计.md` §4～§6、§13～§17 | 当前正式直接输入 | TypeScript 文件边界、`ValidatedSyncRuntimeConfig`、builder 顺序、capability snapshot、读写图隔离和禁止配置化项 |
| `03_ddd_step_14_config_dependencies.md` | 当前详细设计中间产物 | 42 个 code-level leaf、八个 family、adapter/port seam、external dependency 和 runtime composition |
| 当前专项上游正式 04 / 必要台账 | 外部 binding 语境 | 仅核验 opaque ref、owner、secret 和 blocker 语境，不导入其私有 key 或 truth |
| `L1-governance` 04 Step 3 | 框架参考 | 参考控制面、配置域和停审粒度，不继承 Governance 的 store/topic/domain 结论 |
| README、旧 05/06、draft | `historical_material / direction_only` | 仅用于污染审计；不作为当前配置来源或控制面事实 |

## 3. SOP 问题回答

### 3.1 当前系统配置从哪些来源读取？

当前设计只承认一个普通配置候选的语义入口：一个严格 JSON candidate，由 `src/config/load_runtime_config.ts` 读取为 `unknown`。编译期 schema、类型约束和 hard-boundary redline 是校验规则，不是业务 leaf 的隐式默认值。opaque credential/provider ref 的解析是私有引用解析，不是普通配置覆盖层。

环境/profile 只在本 Step 作为候选的语境标识；是否允许文件、环境变量或其他 source 对 leaf 形成覆盖，以及它们的唯一优先级，留给 Step 5。当前不授权 config center、admin override、hot reload 或 daemon source。测试 fixture/controlled override 只属于显式 test composition，不能成为 production-like candidate 的隐式高优先级来源。

### 3.2 配置进入系统的唯一或主要装配入口是什么？

装配入口固定为：

```text
load_runtime_config.ts (raw unknown)
  -> validate_runtime_config.ts (typed + hard-boundary validation)
  -> capability_validation.ts (resolve refs / classify capability)
  -> runtime_composition.ts (build ports, adapters, graphs and snapshot)
```

只有 `src/config/*` 可以读取 raw source；只有 `src/composition/*` 可以把 validated config 变成 adapter graph、read-only graph、mutation facade、conditional Consumer/Job registration 和 body-free `AdapterCapabilitySnapshot`。CLI/operations entry 只能接收已校验的 limits/budgets 或 facade，不得自行读取文件、环境变量或 secret。

### 3.3 哪些模块可以读取配置，哪些模块不得直接读取？

| 模块 | 可接收内容 | 明确禁止 |
|---|---|---|
| `src/config/load_runtime_config.ts` | 单一候选 source 的 raw `unknown`、安全 source reference | 读取业务 truth、执行 command、解析 provider body |
| `src/config/validate_runtime_config.ts` | raw candidate、schema/hard-boundary 规则 | 创建 adapter、调用 SDK/Git/fs、把 warning 当成功 |
| `src/composition/*` | `ValidatedSyncRuntimeConfig`、局部 binding family、adapter registry | 改写 domain state、替 blocker 伪造 `bound` |
| concrete adapter constructors | 自己的局部 typed binding/ref 和相应 port | 读取 raw config、读取 sibling adapter 私有状态、任意 fallback |
| CLI / operations entry | `SyncBoundaryLimits`、`SyncJobBudgets` 的最小子集、已装配 facade | 直接读取 env/file/secret、生成隐式 actor/scope/key |
| Application / orchestration | ports、最小 typed limits/budgets、immutable snapshot ref | 读取 raw config、拼 provider DTO、改变 owner truth |
| Domain / contracts | 显式 policy/function 参数和 domain objects | 读取 config/profile/env、依赖 concrete adapter 或 capability registry |
| Query graph | metadata read 与 read-only Git/fs observation | UoW、write、lock、probe、handoff、diagnostic emit |

### 3.4 配置控制哪些行为，不控制哪些领域不变量？

配置控制 runtime 的边界限额、调用预算、job 批量/并发预算、adapter binding intent、profile identity、redaction/clock/ID/digest provider ref 和可选 operations binding slot。配置只能声明“想绑定什么”和提供可验证的运行语境；实际 capability 仍由 constructor/static validation、owner 合同、工具探测和 per-entry preflight 分类为 `bound | blocked | unsupported | unknown`。

配置不控制 Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive 或 Git remote truth；不控制 actor/project/version/source/target 的隐式选择、权限结论、状态机合法迁移、expected version、UoW 原子性、幂等键/摘要、append-only/provenance、dirty/path/symlink/lock 安全门禁、cursor comparator、unknown recovery、review accepted 或 readiness。配置也不能开启 auto merge/rebase/push/stash、覆盖用户未提交修改、把 Git commit 或上传 ACK 升格为平台事实。

### 3.5 配置变化会影响哪些下游文档？

本 Step 的控制面会作为后续 04 Step 4～14 的唯一组织轴，并向正式 05、06、07、09 提供输入：

| 下游 | 承接内容 | 不得重复定义 |
|---|---|---|
| 04 Step 4～11 | 分类边界、来源/优先级、profile、配置项、secret、加载/变更/失败语义 | 不新增 runtime type、Port、DTO 或业务 flow |
| 04 Step 12～14 | 05/06/07/09 handoff、迁移/废弃、风险和待确认 | 不以 blocker 伪造 positive integration |
| 正式 05 | 配置矩阵、负向 case、failure/capability test cut 的输入 | 不把测试结果或 fixture 当配置事实 |
| 正式 06 | 配置合法性、禁止项和 fail-closed gate 的验收方向 | 不把 gate/verdict/readiness 写回 04 |
| 正式 07 | loader/validator/composition 的实施批次和 boundary 输入 | 不在 04 创建 implementation ledger 或 commit boundary |
| 正式 09（若存在） | 物理文件、secret 注入、rotation、runbook 的运维落地 | 不把部署命令、实际 secret 或环境实例写入 04 |

若后续配置结论要求新增或修改 runtime config interface、Port、DTO、error、state 或 flow，必须先回流正式 03；本 Step 不默许任何 code-shape 变化。

## 4. 配置来源链图

### 4.1 L5-sync 配置覆盖链（Step 3 语义层）

```text
[compile-time schema + hard-boundary redlines]
       (规则；不提供 operational leaf default)
                         |
                         v
[one strict JSON candidate]
       (ordinary candidate; key/source/precedence in Step 5)
                         |
                         v
[profile/environment context]
       (semantic context only; no implicit leaf merge)
                         |
                         v
[opaque credential/provider reference resolution]
       (ref-only; not an ordinary override source)
                         |
                         v
[load raw unknown]
        -> [type + cross-field + hard-boundary validation]
        -> [adapter ref resolution + capability classification]
        -> [new runtime composition + immutable body-free snapshot]
        -> [read-only query graph / mutation facade / conditional slots]
```

关键说明：

1. 图只表达来源类别与装配方向，不表达部署命令、文件路径、环境变量名、最终优先级或产品选型。
2. `one strict JSON candidate` 是当前 P0 的普通配置语义；Step 5 才能决定 candidate 如何从具体 source 得到，不能在本 Step 偷渡 merge 或 override。
3. `profile/environment context` 不是 implicit project/version/source/target 选择，也不能静默覆盖 leaf；profile 矩阵留 Step 6。
4. secret/provider resolution 只能从 opaque ref 得到私有材料，材料不得进入 `ValidatedSyncRuntimeConfig`、snapshot、`.qs-sync`、status、diagnostic 或 error。
5. test fixture/controlled override 仅可在显式 test composition 使用，且不得改变 production-like candidate 的来源链或 capability truth。
6. config center、admin override、hot reload、daemon schedule 和历史 README 中的固定 metadata/LFS/shallow/GUI 选择不属于当前链。

## 5. 配置控制面总表

| 控制面 | 作用 | 对应模块 | 是否 P0 | 详细设计绑定 / 能力上限 |
|---|---|---|---|---|
| candidate identity & profile | 识别 `configRef/profileRef`、候选语境和 composition 生命周期 | `src/config/*`、`src/composition/runtime_composition.ts` | 是 | 对应 `configRef`、`profileRef`；只标识候选，不证明合法、授权或 ready |
| boundary & execution budget | 约束请求、分页、path/target/diagnostic scope、local/SDK/effect/shutdown 调用和并发 | entry wrappers、composition budget guards、adapter call wrappers | 是 | `SyncBoundaryLimits`、`SyncExecutionBudgets`；数值不 silent clamp，不改变 known/unknown |
| job budget & explicit operations | 约束三个 planned job 的批量/并发及显式 runner slot | `src/operations/jobs/*`、operations entry composition | 是 | `SyncJobBudgets`、`SyncOperationsBindings`；不创建 schedule、actor、scope、job key 或 daemon |
| local metadata & runtime binding | 绑定 `.qs-sync` logical store、UoW、lock 和 runtime snapshot repository | `src/adapters/metadata/*`、`src/composition/*` | 是 | `SyncMetadataBindings`；physical backend/schema/migration/retention 未锁，能力不足即 mutation blocked |
| platform SDK / owner / source / review | 绑定 SDK profile、credential provider、owner access、material source、handoff、Decision read、recovery probe | `src/adapters/sdk/*`、five feature ports | 是 | `SyncSdkBindings`；ref 不等于 contract、权限、source freshness、accepted 或 probe success |
| local Git / filesystem | 绑定 observation/worktree、filesystem inspection/apply 和 allowed-root policy | `src/adapters/git/*`、`src/adapters/filesystem/*` | 是 | `SyncLocalToolBindings`；不提供 argv/shell/remote/refspec/merge strategy；LFS/shallow/GUI 不进入 positive config |
| support / safety providers | 绑定 diagnostics、redaction、Clock、ID、Digest 及算法 ref | `src/adapters/diagnostics/*`、`src/composition/*` | 是 | `SyncSupportBindings`；只产生安全技术信号和 deterministic provider seam，不产生 evidence/readiness |
| capability classification & composition lifecycle | 将所有 exact capability 分类、隔离 read/write graph、创建 immutable snapshot 并决定 conditional slot 是否注册 | `capability_validation.ts`、`runtime_composition.ts` | 是（横切） | 不新增 config family；沿用 03 `SyncAdapterCapability`、四态 availability 和 cold new composition |

控制面总表中的“是”表示必须在 P0 contract 中有可审查语义，不表示相应外部依赖已在本地实例化。正向 SDK、metadata、Git/fs、consumer/job capability 继续受 `SYNC-UP-001~010` 与 `SYNC-LOCAL-001~005` 约束。

## 6. 配置域 / 功能模块总表

下表的“配置项”仍是 03 的 code-level carrier/domain，不是最终 raw key。每个域必须在后续 Step 4～13 继续小循环；本 Step 不提前给出默认值或优先级。

| 配置域 / 功能模块 | 来源控制面 | 对应 03 runtime config / builder / adapter / external dependency | 允许配置的能力 | 禁止控制的能力 |
|---|---|---|---|---|
| `config_identity` | candidate identity & profile | `configRef`；loader、validator、snapshot factory | 表示候选身份、变更/回滚引用和 profile 语境 | 保存 raw document、secret、endpoint、path/body；宣称配置正确或 ready |
| `profile_context` | candidate identity & profile | `profileRef`；runtime composition、Step 6 profile matrix | 选择已定义的语义 profile，决定候选所需 adapter 组合 | 隐式选择 Project/version/source/target；用 profile 绕过权限、归档姿态或 blocker |
| `boundary_limits` | boundary & execution budget | `SyncBoundaryLimits`；CLI/query/consumer/job boundary wrappers | request/page/path/target/diagnostic 的正数上限与 bounded scope | 截断后宣称完整成功；关闭 dirty/path/symlink/lock/authorization guard |
| `execution_budgets` | boundary & execution budget | `SyncExecutionBudgets`；metadata/SDK/Git/fs/effect wrappers | 单次读取、commit、lock、SDK/effect/tool/shutdown timeout 和 bounded concurrency | 自动 retry、timeout-as-not-happened、替代 expected version/target lock |
| `job_budgets` | job budget & explicit operations | `SyncJobBudgets`；三类 planned job runner | batch/parallel item upper bound | 创建 schedule、扩大 scope、生成 actor/key、自动 repair/materialize/handoff |
| `metadata_bindings` | local metadata & runtime binding | `SyncMetadataBindings`；metadata store/UoW/lock/snapshot adapters | 选择满足 logical store/UoW/append/replay/lock contract 的 opaque refs | 选择或改写 physical `.qs-sync` truth、删除 provenance、last-write-wins、用 cache 代替 store |
| `sdk_bindings` | platform SDK / owner / source / review | `SyncSdkBindings`；L0 SDK and owner/source/handoff/probe adapters | 绑定 profile、credential provider ref 和各独立 SDK adapter slot | 保存 token/body/provider DTO；本地授权、source authority、Decision/accepted/readiness override |
| `local_tool_bindings` | local Git / filesystem | `SyncLocalToolBindings`；Git observation/worktree、filesystem inspect/apply、root policy adapters | 选择经过验证的 typed local adapters 和 root policy ref | 任意命令/shell/remote/refspec、merge/rebase/push/stash、dirty overwrite、删除 `.qs-sync` |
| `support_bindings` | support / safety providers | `SyncSupportBindings`；diagnostics/redaction/Clock/ID/Digest adapters | 安全诊断 sink、redaction policy、deterministic/runtime provider ref | 把日志/ACK/Git commit/job report 当 truth/evidence；泄露 raw secret/body/path/output |
| `operations_bindings` | job budget & explicit operations | `SyncOperationsBindings`；3 conditional Consumer + explicit runner slot | 以 nullable ref 表达已知的 consumer/job registration intent | 因 ref 存在就注册 blocked consumer；定义 topic/schema、daemon 或隐式业务请求 |
| `capability_snapshot_context` | capability classification & composition lifecycle | `AdapterCapabilitySnapshot`、`RuntimeBindingSnapshotRepository`；runtime builder | 记录 body-free immutable composition binding，供 operation/plan/candidate/attempt pinning | 改写历史 snapshot、把 `bound` 映射为 health/permission/readiness、存 raw payload/evidence |

### 6.1 归属与重复项规则

- `config_identity` 与 `profile_context` 只承载 candidate identity/context；它们不重复承载各 family 的 leaf。
- `execution_budgets` 负责调用预算；`job_budgets` 负责显式 job 的 item 上限；二者都不能表达 retry policy、schedule 或业务 scope。
- `metadata_bindings` 负责 local state adapter refs；`capability_snapshot_context` 只记录 composition 后的分类事实，不重新选择 adapter。
- `sdk_bindings`、`local_tool_bindings`、`support_bindings` 的 refs 不互相 fallback；一个 family `bound` 不推导另一个 family `bound`。
- `operations_bindings` 是条件 registration intent；没有正式 consumer/schema/runner 合同时，ref 也只能得到 `blocked/unsupported/unknown`。

## 7. 配置域逐项停审记录

每个域均按“来源链是否清楚、允许/禁止能力是否清楚、是否回指 03、是否把 blocker 误写成 bound”审查。`通过（带上游 blocker）` 不等于外部能力已实现。

| 配置域 | 来源 / 装配入口 | 允许与禁止边界 | 03 绑定检查 | 停审结论 | 缺口 / 修正 |
|---|---|---|---|---|---|
| `config_identity` | strict candidate → loader/validator | identity only；不存 raw/secret | `configRef` | 通过（带上游 blocker） | raw key、identity digest/source precedence 留 Step 5/7 |
| `profile_context` | candidate context → composition | profile semantics only；不隐式选择业务对象 | `profileRef` | 通过（带上游 blocker） | profile/environment matrix 留 Step 6 |
| `boundary_limits` | validated candidate → entry wrappers | bounded input/page/scope；不绕过 safety | `SyncBoundaryLimits` | 通过（带上游 blocker） | 数值、单位、相互关系留 Step 7/9 |
| `execution_budgets` | validated candidate → call wrappers | bounded single call；no generic retry | `SyncExecutionBudgets` | 通过（带上游 blocker） | timeout/source/failure mapping 留 Step 5/9/11 |
| `job_budgets` | validated candidate → explicit runner | batch/parallel only；no schedule/scope synthesis | `SyncJobBudgets` | 通过（带上游 blocker） | job environment and runner availability 留 Step 6/12 |
| `metadata_bindings` | opaque refs → metadata composition | logical adapter intent；physical truth not selected | `SyncMetadataBindings` + `.qs-sync` logical seam | 通过（`SYNC-UP-006` 仍阻塞） | backend/schema/migration/atomic proof 留上游/后续 Step |
| `sdk_bindings` | opaque refs → SDK adapters | separate capability slots；no local owner/source truth | `SyncSdkBindings` | 通过（`SYNC-UP-001~005/008` 仍阻塞） | endpoint/method/error/version/secret provider 留上游/Step 8 |
| `local_tool_bindings` | opaque refs → Git/fs adapters | typed observation/apply only；no remote/unsafe command | `SyncLocalToolBindings` | 通过（`SYNC-UP-007/009/010`、`SYNC-LOCAL-*` 仍阻塞） | exact tool/library/root policy 留 Step 5/6/7 与 07 |
| `support_bindings` | opaque refs → support adapters | redacted diagnostics and deterministic providers | `SyncSupportBindings` | 通过（带上游 blocker） | sink/provider product and algorithm source 留 Step 5/8/9 |
| `operations_bindings` | nullable refs → conditional composition | explicit slots only; blocked stays blocked | `SyncOperationsBindings` | 通过（consumer contracts 仍阻塞） | transport/schema/schedule not in current schema |
| `capability_snapshot_context` | validated binding → composition snapshot | body-free immutable history pin | `AdapterCapabilitySnapshot` / repository | 通过（带上游 blocker） | physical snapshot store/retention留 `SYNC-UP-006`/Step 7/13 |

逐域停审结论：所有域均有唯一控制面归属、明确允许/禁止能力、对应 03 carrier 或明确横切 composition contract；未发现需要新增 runtime type、Port、DTO、error、state 或 flow 的项。上游 blocker 只影响 capability disposition，不构成控制面冲突。

## 8. 跨控制面闭环审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 来源链是否与 single-candidate/P0 目标一致 | 通过 | Step 5 才收敛具体 source、优先级和冲突；本 Step 不写 env key 或文件路径 |
| 控制面是否覆盖全部 03 family/leaf | 通过 | identity、limits、budgets、metadata、SDK、local tools、support、operations 和 snapshot context 均有归属；Step 7 做 42 leaf 一对一核对 |
| 控制面重叠是否可判定 | 通过 | budgets 与 jobs、metadata 与 snapshot、SDK 与 support、operations 与 profile 按 owner 规则拆开；不做隐式 fallback |
| 是否把领域不变量误开放为配置 | 通过 | Project/Artifact/Baseline/Gate/Workspace/Archive/Git remote ownership、state/lock/idempotency/provenance/review redlines 全列为禁止 |
| 是否把 ref 存在误读成 `bound` | 通过 | 统一使用 constructor/static validation + four-state availability + per-entry preflight |
| read/write graph 是否泄漏 | 通过 | Query graph 不持有 UoW/write/lock/probe/handoff/diagnostic emit |
| secret / raw payload 是否进入普通域 | 通过 | 仅 opaque ref；材料解析留 Step 8；snapshot/metadata/status/diagnostics 禁止材料 |
| blocker 是否被配置开关关闭 | 通过 | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` 原样继承；无 fake/cache/ACK/log/default bypass |
| 历史 LFS/shallow/GUI/Tauri 是否偷渡 | 通过 | 不进入任何 current positive family 或 capability union |
| 下游文档边界是否明确 | 通过 | 05/06/07/09 各有承接项；不提前生成测试/验收/实施事实 |
| 03 契约影响是否完整识别 | 通过 | 当前 `待回写=0`、`阻塞待确认=0`；若后续要改 code shape 必须回流 03 |

## 9. 对详细设计的影响判定

| 结论 | 是否影响 03 | 影响类型 | 处理状态 |
|---|---|---|---|
| 以既有八个 config family 加 `configRef/profileRef` 组织控制面 | 否 | 既有 carrier 的配置视图归类 | `无回写` |
| 以 `src/config/*` → `src/composition/*` 作为唯一读取/装配边界 | 否 | 重申 03 已有读取和 builder 顺序 | `无回写` |
| 增加 `capability_snapshot_context` 作为横切审查域 | 否 | 仅引用 03 已定义的 `AdapterCapabilitySnapshot` / repository | `无回写` |
| 将 metadata、SDK、Git/fs、operations 正向能力保留为 blocked/unsupported/unknown | 否 | 继承 03 blocker 与四态 availability | `无回写` |
| 将 config center、hot reload、daemon、LFS/shallow/GUI 排除出当前控制面 | 否 | P2 / historical 边界 | `无回写` |
| 未决定 raw key、默认值、优先级、物理后端或具体工具 | 否 | 保持 03 code shape 与 04 后续 Step 分工 | `无回写` |

当前计数：`待回写=0`；`阻塞待确认=0`。`SYNC-UP-*` 与 `SYNC-LOCAL-*` 继续是外部依赖 blocker，不被错误升级为 03 回写项。

## 10. 回填草稿（未来正式 §3）

> L5-sync 的配置控制面以一个严格 JSON candidate 为普通语义入口。`src/config/load_runtime_config.ts` 读取 raw `unknown`，`validate_runtime_config.ts` 完成类型、交叉字段和 hard-boundary 校验，`src/composition/*` 解析既有 binding refs、分类 exact capabilities，并构造新的 runtime composition 与 body-free immutable snapshot。CLI、operations、application 只接收已验证的局部 limits/budgets、ports 和 snapshot；domain 不读取 raw config 或环境变量。
>
> 控制面覆盖 candidate identity/profile、boundary/execution/job budget、`.qs-sync` logical metadata、SDK owner/source/review、Git/filesystem、support provider 和 conditional operations。配置可以选择 opaque binding intent，不能把 ref 存在解释为 capability bound、权限、健康、source freshness、Review accepted 或 readiness。Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、Git remote truth，以及 state/lock/idempotency/provenance/dirty-worktree 红线不开放为配置。
>
> 物理配置来源优先级、raw key、数值、secret provider、环境矩阵和变更/失效细节在后续 04 Step 4～14 收敛；当前不承诺 config center、hot reload、daemon、LFS、浅克隆、GUI/Tauri。所有 `SYNC-UP-001~010` 与 `SYNC-LOCAL-001~005` blocker 维持真实状态。

## 11. 待确认事项

| 事项 | 影响 | 未确认前姿态 | 归属 |
|---|---|---|---|
| 普通 candidate 的具体 source、覆盖优先级和冲突规则 | Step 5 | 不写 env/file key；invalid/conflict 后续 fail-closed | 04 Step 5 |
| profile/environment 分类及 external binding 矩阵 | Step 6 | profile 仅语义 context，不声称实例已存在 | 04 Step 6 |
| 42 leaf 的 raw key、required/null/default 与 JSON 样例 | Step 7 | code-level property 不当 raw key；无隐式 operational default | 04 Step 7 |
| credential provider、rotation、secret audit | Step 8 | 仅 opaque ref；不读取或记录真实 secret | 04 Step 8/正式运维 |
| `.qs-sync` physical backend/schema/migration/retention | `SYNC-UP-006`、Step 7/13 | logical binding only；mutation capability 保持 blocked unless proven | 上游/04/07 |
| SDK/source/handoff/probe exact contract | `SYNC-UP-001~005/008` | ref 可存在但 capability 为 blocked/unknown；不提交 effect | 上游 |
| Git/fs exact library/tool/root and dirty semantics | `SYNC-UP-007/009/010`、`SYNC-LOCAL-*` | typed adapter seam；不提供 arbitrary command 或 LFS/shallow/GUI key | 上游/07 |
| consumer/job formal transport and runner contract | operations binding | nullable/blocked；不自动注册或调度 | 上游/04 Step 12 |

这些是后续步骤或上游确认项，不构成当前 Step 的“阻塞待确认”回写项；本 Step 仍可进入 Step 4。

## 12. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| 来源链图存在且不含部署命令、env key 或最终优先级 | pass |
| 唯一配置读取/装配入口和模块隔离清楚 | pass |
| 控制面覆盖既有 config family、binding、capability snapshot | pass |
| 每个配置域均回指 03 runtime config/builder/adapter/external seam | pass |
| 每个配置域均完成独立停审 | pass |
| 领域不变量、ownership、security、append-only、unknown、review redline 未配置化 | pass |
| secret/raw payload/ref-only 边界清楚 | pass |
| blocker 未被 fake、cache、ACK、日志、默认值或 profile 关闭 | pass_with_upstream_blockers |
| 03 影响判定无待回写、无阻塞待确认 | pass |
| 未创建正式 04、未写 Step 4 文件、未实现/测试/提交 | pass |

### Step 3 结论

`gate_status = pass_with_upstream_blockers`；`Step status = completed / stop_review`。允许进入 `04_config_step_04_categories_boundaries.md`。正式 `04-配置设计.md` 仍保持不存在，直至 Step 15。
