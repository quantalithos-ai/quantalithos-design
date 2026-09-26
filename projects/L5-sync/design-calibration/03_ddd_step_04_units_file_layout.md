# Step 4. 收稳实现单元与文件布局

## 1. Step 状态

- 状态：`completed / stop_review`
- Step `gate_status=pass_with_upstream_blockers`
- 文档 `gate_status=formal_stop_review`
- 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 4（按 TypeScript package 适配 Rust/Cargo 专属字段）
- 回填章节：未来正式 `03-详细设计.md` §4 实现单元与文件布局
- 前序门禁：Step 1～3 已完成；`SYNC-UP-001~010` 与 `SYNC-LOCAL-001~005` 均未关闭。
- 正式 `03-详细设计.md` 写入：`false`
- 下一动作：`wait_for_user_confirmation_before_step_05`

### Step 内计划完成情况

1. [x] 回读 Step 2/3、正式 02 §4/§5/§12、目录规范与目标仓只读状态。
2. [x] 比较 Rust、multi-package、layer-first 与 feature-first TypeScript 布局。
3. [x] 将五个业务部分分别映射到 domain/application/ports，并规划 CLI、adapters、composition/config 等正交层。
4. [x] 输出实现单元、package/binary 映射、目录树、文件职责、依赖方向与命名检查。
5. [x] 区分 P0 最小计划文件、P1/条件性入口和不得创建的历史能力目录。
6. [x] 完成静态审计并在 Step 4 后停审；未创建 Step 5、正式 03 或实现仓文件。

## 2. 本步输入

| 输入 | 已确认内容 | 本步用途 |
|---|---|---|
| `03_ddd_step_02_scope.md` | P0 五部分、四 CLI、local state、ports/adapters 和文档分工 | 限定实现单元，不扩大功能范围。 |
| `03_ddd_step_03_coding_runtime_constraints.md` | TypeScript + ESM + strict、Node-compatible、单 package CLI+library、SDK 边界 | 决定文件语言、package topology 和依赖方向。 |
| 正式 02 §4/§5 | 五业务部分与 Inbound/Application/Domain/Ports/Persistence/Adapters 正交轴 | 决定 feature-first + layer-within-feature 布局。 |
| 正式 02 §6/§7 | 29 对象、services、ports、commands/queries/consumers/jobs | 映射对象和接缝的唯一计划文件归属。 |
| `02_hld_step_12_detailed_design_handoff.md` | `DDH-SYNC-01~17`、回退规则、test seams | 确认后续 Step 的文件落点和阻塞上限。 |
| `projects/L1-workspace/draft/03_模块划分与分层.md` | 仅提供“业务组成部分 × 实现分层 × 文件职责”的表达粒度 | 参考组织方式，不复制 Workspace truth、projection 或 owner 对象。 |
| 目录组织规范 | 实现仓身份、职责命名、禁止层级泄漏；Rust 规则只在 Rust 项目适用 | 确定 `quantalithos-sync` 和 TypeScript 适配口径。 |
| `/home/aris/Projects/quantalithos-sync` | 当前不存在 | 所有路径均标 `planned / not_created`。 |
| `@quantalithos/sdk` TypeScript package | 已存在，但 Sync-specific surface 未闭合 | 只允许进入 `src/adapters/sdk/` 和 composition。 |

## 3. SOP 问题回答

### 3.1 本轮包含哪些 package / binary / library？

采用一个 TypeScript package，不拆 monorepo/workspace subpackage：

| 单元 | 形态 | 状态 | 责任 |
|---|---|---|---|
| repository root | single TypeScript package | `planned / not_created` | package/tsconfig 和 build/export/bin 元数据；具体 package manager/name 待定。 |
| `src/index.ts` | embeddable library export boundary | `planned` | 只导出经后续 Step 收稳的 public contracts/use cases，不导出 concrete adapters。 |
| `src/cli/cli_entry.ts` | Node-compatible CLI source entry | `planned` | 启动 composition、路由四个 P0 verb、呈现 typed result；binary key/name 待定。 |
| five feature modules | internal library modules | `planned` | 按业务部分承载 domain/application/ports；不形成五个 package。 |
| adapters + composition/config | internal infrastructure modules | `planned` | 绑定 SDK/Git/fs/metadata/diagnostics，并做 capability validation。 |
| conditional operations | consumer/job entry modules | `planned/blocked` | 只有正式合同成立后启用，不作为 daemon。 |
| `tests/` | future test source layout | `planned / not_created` | 为 Step 16/05 预留 unit/contract/flow/fault 切口，不选择 runner。 |

### 3.2 每个实现单元对应哪个概要代码主体？

| 计划单元 | 概要主体 | 边界 |
|---|---|---|
| `src/selection_access` | `SelectionAccessService`、CP1 对象、`OwnerAccessPort`/`OwnerReferenceStore` | 不认证、不本地授权、不拥有 Project posture。 |
| `src/working_copy_metadata` | working-copy/metadata services、CP2 对象、store/UoW/local observation ports | 不拥有 Workspace projection/Git remote，不静默 repair/rebind。 |
| `src/source_materialization` | `MaterializationService`、CP3 对象、source/Git/fs apply ports | 不决定 source authority/comparator，不自动 Git。 |
| `src/conflict_recovery` | conflict/recovery services、CP4 对象、probe/repositories | 不自动 resolve、不 blind replay。 |
| `src/review_handoff_provenance` | handoff/provenance/status services、CP5 对象、handoff/decision/diagnostics ports | 不拥有 Gate/Decision，不生成 evidence/verdict。 |
| `src/cli` | 四 CLI entries + maintenance/recovery entries | 只解析 intent/输出，不直连 adapter/store。 |
| `src/orchestration` | `OperationCoordinator` | 跨五部分编排，不新增 local truth。 |
| `src/adapters` | SDK/Git/fs/metadata/diagnostics adapters | 翻译/执行白名单，不裁决 domain/owner truth。 |
| `src/operations` | conditional consumers + three jobs | 显式 maintenance/invalidation，不自动 materialize/handoff。 |

### 3.3 文件路径如何体现模块边界？

采用 feature-first、layer-within-feature：每个业务部分内部固定 `domain/`、`application/`、`ports/` 三类职责；CLI、adapters、operations、composition/config 是正交技术层。这样既不把五部分压成单一 `domain/` 大目录，也不把 adapter/CLI 误当第六业务部分。

依赖方向为：

```text
CLI / src/index / operations
              |
              v
       orchestration + feature application
              |
       +------+------+
       v             v
 feature domain   inward feature ports
                         ^
                         |
                 concrete adapters
                         |
                         v
             SDK / Git / filesystem / local metadata
```

关键说明：

- Domain 不 import CLI、composition、concrete adapter 或 provider DTO。
- Adapter import public SDK/package/tool facility 并实现 inward port；core 不 import adapter。
- 跨 feature 协作经 typed refs/contracts 与 coordinator，禁止 service-to-service 环状依赖。
- `status` composition 只能获得 read-only stores/observation ports，不能获得 mutation capability。

### 3.4 哪些文件必须计划，哪些只可后续扩展？

P0 最小计划集合包括 root manifests、library/CLI entry、coordinator、五 feature 的 domain/application/ports、SDK/Git/fs/metadata/diagnostics adapters 和 composition root。`operations/consumers` 当前为 `planned/blocked`；three jobs 和 maintenance entries 为 P1 safety seam。GUI/Tauri、daemon、LFS、shallow、remote sync、auto Git、outbox/publisher 均不得建立目录或占位文件。

### 3.5 每个文件负责定义什么？

§7.5 目录树给出全部已知对象文件；§7.6 按文件组说明 service、port、adapter、entry 和 test responsibility。Step 4 只分配归属，不定义字段、完整签名、protocol schema、存储格式或测试用例；这些分别由 Step 5～16 收稳。

### 3.6 project slug 是什么？

`sync`。实现仓计划路径是 `/home/aris/Projects/quantalithos-sync`；当前为 `absent / not_created`。设计仓名 `L5-sync`、历史 `qs-sync` 均不得自动成为 package/binary/type 前缀。

### 3.7～3.10 Rust workspace/package/crate 与 binary 规则如何适用？

Rust workspace、Cargo package 和 Rust crate 全部 `not_applicable`。TypeScript package name 与 CLI `bin` key 尚为 `SYNC-LOCAL-003`，本步只锁源码入口 `src/index.ts` 与 `src/cli/cli_entry.ts`，不发明 `qs-sync`、`sync` 或 `@quantalithos/sync` 为已批准名称。

### 3.11 是否有架构层级泄漏进代码命名？

计划路径不含 `L5`、`l5_`、`quantalithos_` 或重复 `sync_` 顶层前缀；顶层不使用 `common`、`utils`、`helper`。文件使用描述性 `snake_case.ts`，类型仍用 UpperCamelCase，函数用 lowerCamelCase。

### 3.12 编译期依赖写在哪里？

未来只在根 `package.json` 声明已批准的 package dependency。`@quantalithos/sdk` 是唯一已核验的 TypeScript candidate；精确 version/workspace/file syntax 待 package manager/ADR，不得 import sibling `src/` 私有路径。当前没有可写的 L0-core TypeScript dependency。

### 3.13 哪些关系不能进入 package dependency？

Identity/Work/Artifact/Workspace/Governance/Archive/Observability 是 runtime owner/collaboration，默认经 SDK adapters；Git/filesystem 是 local runtime facilities；L0-bus 是当前未启用的条件事件协作。它们都不得成为 service-repo path/source dependency。

## 4. 当前文档问题诊断

旧正式 03 使用 Rust `src/api/application/domain/infra/projection` 树并围绕 `SyncTask`、fanout/replay 组织；draft 将九个业务、工具和横切模块并列，README 又暗含 Tauri/LFS/浅克隆。若直接继承，会同时违反当前 TypeScript 方向、五部分边界和“业务部分 × 实现分层”双轴。

目标仓不存在不是阻止 planned layout 的理由，因为 Step 3 已收稳语言、runtime 形态和 package topology；但它要求本文件始终标注 `planned/not_created`，不能声称 manifest、source、tests 或 build output 已存在。

## 5. 改动前后对比

| 项 | 历史材料 | 当前 planned layout |
|---|---|---|
| 仓形态 | Rust/Tauri 或不明多模块 | 单 TypeScript package，CLI + library |
| 组织轴 | 纯技术层或九个混合模块 | 五 feature 为主轴，每个 feature 内含 domain/application/ports |
| 入口 | RPC/HTTP/GUI/CLI 混合 | root library export + Node CLI entry；GUI/daemon 不建目录 |
| local persistence | 固定 metadata file/repository 假设 | logical ports + technology-neutral metadata adapters |
| SDK | 旧 RPC 或直接 service | 仅 `src/adapters/sdk` 消费 public `@quantalithos/sdk` |
| tests | 历史测试/报告可能被当事实 | 只规划 test source categories，不创建 run/report/evidence |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| Rust single/workspace | 可套现有 Cargo 规范 | 与 Step 3 TypeScript 决策冲突 | 不采用 |
| TypeScript multi-package workspace | 强 package 边界 | 当前只有一个 CLI/library 产品，过早拆包增加版本/循环依赖 | 不采用 |
| layer-first `domain/application/infra` | 技术层直观 | 五部分对象和功能被分散，不符合 feature-oriented 规范 | 不采用 |
| feature-first + layer-within-feature | 业务责任可定位，同时保留依赖倒置 | 需要 coordinator 和 adapters 显式管理跨 feature seam | 采用 |
| owner-per-directory | external owner 清晰 | 会复制外部 truth/domain model | 不采用；owner 只在 SDK adapter seam 出现 |

## 7. 结构化中间产物

### 7.1 布局形态决策

```text
repository = /home/aris/Projects/quantalithos-sync  [planned / not_created]
project_slug = sync
language = TypeScript
module_system = ESM
runtime = Node-compatible, exact version pending
package_topology = single package
public_surfaces = library export + CLI entry
package_name = pending (SYNC-LOCAL-003)
cli_bin_name = pending (SYNC-LOCAL-003)
```

### 7.2 实现单元总表

| 实现单元 | 类型 | 职责 | 对应概要设计 | 状态 |
|---|---|---|---|---|
| root package | TypeScript package | manifest/compiler/public export/bin mapping | §4、DDH-01/02 | planned |
| `src/cli` | inbound | four P0 verbs、maintenance/recovery entry、presentation | §7 | planned |
| `src/orchestration` | application | cross-feature coordination and capability segregation | §4/§8 | planned |
| five feature directories | domain/application/ports | 29 objects、services、inward contracts | §5～§9 | planned |
| `src/adapters` | infrastructure | SDK/Git/fs/metadata/diagnostics binding | §7/§10/§11 | planned; positive seams blocked |
| `src/operations` | inbound operations | conditional consumers and bounded jobs | §7.8/§8 | planned/blocked or P1 |
| `src/composition` / `src/config` | composition | dependency wiring/capability validation/typed config seam | §11/DDH-13 | planned |
| `tests` | test source | unit/contract/flow/fault seams | DDH test handoff | planned/not_created |

### 7.3 目录 / Package / Crate / Binary 映射表

| 目录/入口 | 类型 | TypeScript package / export / bin | Cargo/Rust | 是否对外 | 说明 |
|---|---|---|---|---|---|
| `/` | package root | name `TBD` | N/A | package | 单 package；不创建 workspace members。 |
| `src/index.ts` | library entry | `exports["."]` target planned | N/A | 是 | 精确 dist mapping 留给 build tool decision。 |
| `src/cli/cli_entry.ts` | CLI source entry | `bin[TBD]` target planned | N/A | 是 | verb semantics stable；bin name/parser/exit values pending。 |
| `src/<feature>` | internal modules | package-internal | N/A | 默认否 | public symbol 只经 root export 明示。 |
| `src/adapters` | infrastructure | package-internal | N/A | 否 | concrete SDK/tool/store types不泄漏 public surface。 |

### 7.4 文件布局树

```text
quantalithos-sync/                                      # planned; repository absent
  package.json                                          # name/manager/scripts/version ranges pending
  tsconfig.json                                         # ESM/strict baseline; exact runtime target pending
  src/
    index.ts                                            # embeddable library public export boundary
    cli/
      cli_entry.ts                                      # Node-compatible entry; parser-neutral
      command_router.ts                                 # route explicit verb to application contract
      output_presenter.ts                               # safe layered result rendering
      clone_entry.ts
      pull_entry.ts
      status_entry.ts
      push_review_entry.ts
      metadata_maintenance_entry.ts                     # P1 safety seam
      recovery_operations_entry.ts                      # P1 safety seam
    orchestration/
      operation_coordinator.ts                          # cross-feature mutation coordination
      sync_telemetry_port.ts                            # non-throwing cross-cutting telemetry contract
    selection_access/
      domain/{sync_operation,sync_selection,access_evaluation}.ts
      domain/{operation_eligibility_policy,external_owner_snapshot}.ts
      application/selection_access_service.ts
      ports/{owner_access_port,owner_reference_store}.ts
    working_copy_metadata/
      domain/{working_copy_binding,metadata_manifest,cursor_state,mapping_set}.ts
      domain/{working_copy_observation,working_copy_safety_policy,metadata_integrity_policy}.ts
      application/{working_copy_service,metadata_maintenance_service}.ts
      ports/{metadata_store,local_state_unit_of_work,git_observation_port,filesystem_port}.ts
    source_materialization/
      domain/{materialization_plan,source_delta,path_change_set}.ts
      domain/{materialization_run,materialization_safety_policy}.ts
      application/materialization_service.ts
      ports/{material_source_port,git_worktree_port,filesystem_apply_port}.ts
    conflict_recovery/
      domain/{conflict_record,recovery_checkpoint,manual_resolution}.ts
      domain/{probe_record,recovery_safety_policy}.ts
      application/{conflict_recovery_service,recovery_probe_service}.ts
      ports/{recovery_probe_port,conflict_repository,recovery_repository}.ts
    review_handoff_provenance/
      domain/{review_candidate,handoff_attempt,provenance_record}.ts
      domain/{candidate_eligibility_policy,handoff_result_policy}.ts
      domain/{layered_handoff_status,sync_status_view}.ts
      application/{review_handoff_service,provenance_service,sync_status_query_service}.ts
      ports/{review_handoff_port,review_decision_read_port,provenance_repository,diagnostics_port}.ts
    adapters/
      sdk/{owner_access,material_source,review_handoff,review_decision,recovery_probe}_sdk_adapter.ts
      git/{git_observation_adapter,git_worktree_adapter}.ts
      filesystem/{filesystem_adapter,filesystem_apply_adapter}.ts
      metadata/{metadata_store_adapter,local_state_unit_of_work_adapter}.ts
      metadata/{owner_reference_store_adapter,conflict_repository_adapter}.ts
      metadata/{recovery_repository_adapter,provenance_repository_adapter}.ts
      diagnostics/diagnostics_adapter.ts
    operations/
      consumers/{access_or_posture_invalidated,material_source_invalidated}.ts  # blocked
      consumers/review_decision_changed.ts                                     # blocked
      jobs/{scan_metadata_integrity,probe_pending_handoff_attempts}.ts
      jobs/mark_stale_owner_snapshots.ts
    composition/{runtime_composition,capability_validation}.ts
    config/{runtime_config,load_runtime_config,validate_runtime_config}.ts
  tests/
    unit/                                               # future Step 16/05 files
    contract/
    flow/
    fault/
```

树中的 `{a,b}.ts` 是多个独立计划文件的紧凑表示，不是带花括号的真实路径；实施时不得建立空占位目录或空文件。Protocol DTO/error files、secondary value types 和 tests 的精确拆分由 Step 5～16 回填到所属 feature，不能另建全局 `types/`、`common/` 或 `utils/` 倾倒目录。

### 7.5 文件职责表

| 文件/文件组 | 定义内容 | 主要责任 | 不得承担 |
|---|---|---|---|
| `src/index.ts` | approved public named exports | library surface | concrete adapter/provider type export |
| `src/cli/*_entry.ts` | input decoding/routing/output mapping | explicit CLI intent | domain rule、SDK/Git/fs direct call |
| `src/orchestration/operation_coordinator.ts` | cross-feature call order/capability segregation | mutation orchestration | global state machine/new truth |
| `src/orchestration/sync_telemetry_port.ts` | closed log/metric/span records与non-throwing emission surface | entry/application/UoW/adapter wrapper的cross-cutting技术信号 | domain依赖、业务判定、durable audit/provenance、任意attributes map |
| each `domain/*.ts` | one formal 02 object/policy/view | invariants/state-local behavior | transport/store/tool logic |
| each `application/*_service.ts` | use-case coordination for owning feature | ports/UoW/typed results | provider DTO or hidden side effect |
| each `ports/*.ts` | inward minimal interface and local result types | dependency inversion | concrete SDK/tool schema |
| `adapters/sdk/*` | SDK public surface decode/map/call | owner capability binding | private endpoint、local authorization、ACK elevation |
| `adapters/git/*` | local observation/whitelisted worktree operations | Git tool isolation | fetch/push/merge/rebase/stash/remote truth |
| `adapters/filesystem/*` | canonical inspect/stage/commit capability | path/non-overwrite boundary | unsafe symlink/path escape/implicit delete |
| `adapters/metadata/*` | store/UoW/repository implementations after schema decision | local durability/generation | fixed historical metadata.json、provenance deletion |
| `operations/consumers/*` | conditional invalidation/Decision intake | mark local snapshot/plan/candidate stale | auto pull/apply/cancel/handoff |
| `operations/jobs/*` | bounded scan/probe/staleness jobs | explicit maintenance | daemon truth、auto retry/repair |
| `composition/*` | instantiate ports/adapters/services and validate capabilities | composition root | domain defaults or blocker bypass |
| `config/*` | typed config family/load/validation seam | Step 14/04 binding point | final keys/defaults or hard-gate switches |
| `tests/*` | future deterministic test sources | module/contract/flow/fault cuts | test result/report/evidence/readiness |

### 7.6 命名检查表

| 检查项 | 通过条件 | 结果 |
|---|---|---|
| 实现仓 | `/home/aris/Projects/quantalithos-sync` | pass_as_identity / absent_on_disk |
| project slug | `sync` | pass |
| package/bin | 未获 authority 不猜名称 | pass_pending (`SYNC-LOCAL-003`) |
| module/file | 职责清晰、snake_case、无泛化顶层目录 | pass |
| type/function | UpperCamelCase / lowerCamelCase | planned pass |
| layer leakage | 无 `L5/l5_`、无重复项目/仓前缀 | pass |
| business/technical axes | five features are primary；adapters/CLI/composition remain orthogonal | pass |
| historical pollution | 无 Rust/Tauri/LFS/shallow/GUI/daemon/auto Git path | pass |

### 7.7 依赖路径表

| 依赖 | 类型 | Manifest/代码落点 | 当前写法 | 禁止 |
|---|---|---|---|---|
| `@quantalithos/sdk` | compile candidate + runtime seam | root `package.json`; `src/adapters/sdk` | version/reference `pending` | sibling private `src` import、Sync schema 假定 |
| L0-core | compile candidate but no verified TS package | none | `blocked/not_declared` | Rust crate/Cargo path 转写为 npm dependency |
| L1/L4 owners | runtime via SDK | SDK adapter only | no package/path dependency | direct service repo/DB/private endpoint |
| Git/filesystem | local runtime | Git/fs adapters | library/process choice pending | arbitrary shell、remote truth |
| L0-bus/events | conditional collaboration | blocked consumer modules | disabled until formal contract | broker/topic direct binding |

### 7.8 后续精化与回退规则

- Step 5～8 可在既有 feature 目录内增加 module/protocol/error 文件，但不得新增业务部分、改变 ownership 或把 adapters 提升为 domain。
- 若 package topology、语言、runtime host 或 CLI/library 形态改变，必须回退 Step 3/4。
- 若 29 对象 identity、接口类别或状态轴改变，必须按概要 Step 5～9 回退，不可只改路径。
- 若物理 `.qs-sync` backend 要求新的 persistence unit，须先通过 Step 11/14 与 `SYNC-UP-006` 审计。

## 8. 回填草稿

未来正式 §4 应摘录 §7.1～§7.7：先声明目标仓尚未创建与单 TypeScript package 决策，再给出实现单元、package/entry 映射、依赖图、文件树、职责与命名/依赖表。所有路径标为 planned contract，不能写成现有实现。

延伸阅读入口应指向本文件“布局形态决策”“实现单元总表”“文件布局树”“文件职责表”“依赖路径表”“后续精化与回退规则”。

## 9. 待确认事项

- `SYNC-UP-001~010` 仍为 `pending/blocked`；尤其 SDK/source/metadata/Git/fs/handoff 正向 adapters 不可宣称可运行。
- `SYNC-LOCAL-001~005` 仍为 `local_pending`：Node version、package manager、package/bin name、parser/validator/test/Git library、SDK dependency syntax 均未确定。
- 目标实现仓仍 `not_created`；本步没有创建或修改其中任何文件。

## 10. 停审条件与自检

- [x] 单 package、CLI/library entry、五 feature 与正交技术层均有明确 planned 落点。
- [x] 29 个概要对象各有唯一 domain 文件归属；services/ports/adapters 无 ownership 漂移。
- [x] 输出了实现单元、package/crate/binary 适配表、目录树、文件职责、命名和依赖表。
- [x] `status` no-write、no auto Git、non-overwrite、ACK/Decision、provenance 和 blocker 边界保留。
- [x] Rust/Cargo 专属字段诚实标为 N/A；未发明 package/bin/version/tooling。
- [x] 未创建实现仓、代码、测试、artifact/report/evidence、implementation ledger/skeleton 或 commit。
- [x] 未创建 Step 5 文件，正式 `03-详细设计.md` 未修改。

结论：Step 4 中间产物通过 `pass_with_upstream_blockers`，03 校准在此进入 `formal_stop_review`。下一动作只能等待用户明确确认后进入 Step 5；本结论不是正式 03 完成、实现 readiness 或上游 signoff。
