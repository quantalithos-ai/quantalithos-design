# Step 17. 收口详细设计到实施计划的承接清单

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 17  
> 书写规范：`standards/document/详细设计书写规范.md` §5.16  
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md` §5.10  
> 参考框架：`projects/L1-governance/design-calibration/03_ddd_step_17_implementation_handoff.md`  
> 回填位置：未来正式 `projects/L5-runner/03-详细设计.md` §16  
> 状态：`completed_with_upstream_blockers`

## 1. Step 状态与开工确认

| 项 | 当前值 |
|---|---|
| current_document | `03-详细设计.md` |
| current_step | Step 17 |
| current_module | `implementation_handoff:cross_document_closure` |
| gate_status | `pass_for_step_18` |
| gate_reason | 已形成实施承接清单、实施前置阅读、字段/DTO/Query/状态/metadata/idempotency/projection/phase 预复核和命名修正清单；不定义 phase、commit boundary 或实现仓事实。 |
| formal_03_write_allowed | `false_until_step_19` |
| implementation_write_allowed | `false` |
| implementation_ledger_allowed | `false_until_07` |
| test_execution_allowed | `false` |
| commit_required | `false` |
| next_allowed_action | 创建并完成 Step 18 风险与待确认事项 |

用户已授权完成全部 03，因此解除了 Step 10 后的停审；本 Step 继续遵守 Step 4 physical layout blocker。Step 17 不是实现移交通过结论，正式 `07` 仍必须按 phase/commit boundary 对正式 `03/05/06/07` 重做整体可落码审计。

## 2. 本步目标、输入与非目标

### 2.1 目标

将 Step 1～16 的详细设计结果整理为可供后续 `07-实施计划.md` 使用的承接输入，明确：

- 实施者需要先读哪些正式文档、校准文件、规范和提交纪律。
- 哪些模块、对象、协议、flow、状态、持久化、错误、幂等、配置、观测和测试切口已经形成语义实现输入。
- Domain 字段、public DTO/secondary type、Query response/view/page/marker、状态名和 metadata/idempotency 如何闭环。
- 哪些内容仍受上游/物理 blocker 影响，不能交给实现者自行补 schema、路径、产品或 phase。
- 正式 `07` 如何把本 Step 作为阅读矩阵与逐 boundary 审计输入，而不复制第二真相源。

### 2.2 输入基线

| 输入 | 承接内容 |
|---|---|
| Step 1～4 | 上游输入边界、范围、技术/仓库约束和 physical layout blocker。 |
| Step 5～7 | 七模块主轴、对象字段/状态、14 required semantic ports、repository/UoW/adapter 责任。 |
| Step 8～9 | 11 Command、12 Query、4 planned Consumer、0 outbound event、5 Job 以及 32 条 flow。 |
| Step 10 | 21 个状态主语、projection generation guard、合法/非法/reserved 口径。 |
| Step 11～13 | logical persistence、version/UoW、错误恢复、幂等、并发、commit-unknown/no-replay。 |
| Step 14～16 | config/dependency binding、observability/redaction 和最小测试切口。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段、DTO、metadata/idempotency、projection、artifact materialization 和 phase boundary 的复核标准。 |
| `standards/coding/rust.md`、目录规范、实施计划规范、实施计划 SOP | 条件性 Rust/目录纪律、目标仓命名、提交/台账/phase 规则的实施前置阅读。 |

### 2.3 非目标

- 不定义 phase、任务拆分、commit boundary、排期、实现仓代码批次或测试用例编号。
- 不创建 `implementation_execution_ledger.md` 或 `implementation-boundaries/`；这些只在正式 `07` 授权后创建。
- 不选择 Rust、TypeScript、Tauri、Electron、Docker、gVisor、Firecracker、数据库、cache backend、scheduler、transport 或具体 SDK package/crate。
- 不把当前 design git identity、现存 sibling repo 或规范示例宣称为 Runner 实现 baseline、manifest、commit 或 readiness。

## 3. SOP 问题回答

| 问题 | Runner 答案 |
|---|---|
| 哪些实现契约已经足够进入实施计划？ | 七模块逻辑边界、17 个正式对象及支撑 carrier、14 semantic ports/repositories、11/12/4/0/5 protocol inventory、32 flows、21 状态主语、logical persistence/error/idempotency/config/observability/test cuts 已足够作为 `07` 引用输入；物理路径和 exact adapters 仍 blocked。 |
| 实施者首先阅读什么？ | 先读新版正式 `00/01/02`、Step 19 后正式 `03`，再按阶段矩阵读取必要 calibration Step，随后读 `04/05/06/07`（生成后）、可落码标准、目录规范、所选语言规范和实施计划规范/SOP。 |
| 提交规范、git config、Rust 编码/注释是否列入？ | 列入实施前检查；当前提交规范仍有独立权威缺口，必须以届时有效规范为准。若最终选择 Rust，真实源码标识符、rustdoc、普通注释和测试名使用英文；设计中的中文 Rust-like 片段不等于源码选择。 |
| Domain 字段是否可回指？ | 语义预复核通过：字段来源分为 explicit DTO/metadata、formal port/repository lookup、system-generated clock/id/generation、derived mapping 或 persisted basis；未闭合的 owner exact field 标为 blocked，不由实现者补。 |
| Command/Event/Job 是否可构造目标对象？ | 11 Command、4 negative Consumer、5 Job 有 DTO→object/report/result 映射；Runner outbound event=0。planned Consumer positive payload/apply 仍 reserved/blocked，不能当成完整实现入口。 |
| Query response/view/page/marker 是否闭合？ | 12 Query 均有 request、response body/view、surface、page/cursor 和 empty/not-visible/degraded/stale/failed 口径；projection identity 缺失时 no-upsert。 |
| 状态/测试/验收是否同名？ | Step 10 正式 enum 名称已被 Step 16 反查；后续 `05/06/07` 必须继续使用这些名称，不得恢复旧 `RunnerRun`/`waiting`/`success` 口语。 |
| 当前 phase 是否引用后续 phase 对象？ | 本 Step 不定义 phase；只能给 `07` 提供预复核表。任何 boundary 若依赖尚未存在的 DTO、port、state、report、evidence 或 artifact，必须阻塞并回写设计。 |
| 哪些旧名/别名必须修正？ | 旧正式 `03` 的 `RunnerRun/RunQueueEntry/RunCard` 主线、Rust/Tauri 文件树和 queue truth 只作 historical diagnostic；新版正式入口以 Step 5～16 为准。`latest/default`、`running`、`cleaned`、`evidence` 等跨轴偷换均禁用。 |
| `07` 应如何引用而不复制？ | `07` 按 phase/commit boundary 建阶段阅读矩阵，引用正式 `03` 章节和对应 calibration 文件；不得复制字段、DTO、flow、状态矩阵或测试表形成第二真相源。 |
| 是否已提供交付实现前审计输入？ | 提供了对象、字段来源、协议/secondary types、flow、状态、persistence、error、idempotency、projection、config、observability 和 test-cut 输入；最终审计仍由 `07` 负责。 |

## 4. 当前文档问题诊断与改动前后对比

| 位置 | 诊断 | 本 Step 处理 |
|---|---|---|
| 旧正式 `03` | 旧产品 run/queue/UI 主线与新版 semantic contract 冲突 | 明确旧文档只作 historical diagnostic，Step 19 full-restart 重建。 |
| Step 4 | physical layout、语言、runtime、shell、store、manifest 未收稳 | 承接清单只引用 logical module/file responsibility，禁止写具体路径。 |
| Step 8/9 | protocol/flow 数量和二级类型容易被实现侧重新猜测 | 固定 11/12/4/0/5 与 32 flow；secondary type 缺口按表回设计。 |
| Step 10/16 | 状态名若传递到下游容易被口语化 | 建立状态闭环表，要求测试/验收/实施使用 Step 10 enum 原名。 |
| Step 11～13 | persistence/error/idempotency 可能被拆成跨 boundary 的不一致实现 | 要求每个后续 boundary 复核 UoW、version、stored result、Unknown/no-replay。 |
| Step 14/15 | config/readiness/observability 可能越界成为 truth | 固定 configured/enabled/ready、local log/audit/evidence 分离。 |
| Step 16 | 测试切口不能代替正式 05/06/07 | 标记为最小 semantic cuts，后续文档负责用例/验收/phase 化。 |

## 5. 设计取舍

| 议题 | 候选 | 采用口径 |
|---|---|---|
| Step 17 是否预写 phase/commit | 现在定义 / 只提供承接和复核 | 只提供承接和复核；phase/commit 属于 `07`。 |
| 是否复制详细设计 schema | 复制全表 / 建索引并回指 | 建索引并回指，避免第二真相源。 |
| 目标仓不存在是否阻塞 Step 17 | 阻塞所有设计 / 作为实现开工门禁 | 不阻塞本 Step；作为正式实现开工前门禁 `RUN-DDD-001`。 |
| Rust 规范是否等于 Runner 已选 Rust | 是 / 条件性前置阅读 | 条件性；Step 3/4 authority 未关闭，不锁语言。 |
| 当前 git identity 是否写成事实 baseline | 写入 baseline / 仅列核验要求 | 仅列核验要求；不伪造 commit/baseline。 |
| implementation ledger 是否现在创建 | 现在创建 / 留给 07 | 留给 07；本 Step 明确 `implementation_ledger_allowed=false_until_07`。 |

## 6. 承接关系图

```text
[formal 00/01/02]
        |
        v
[03 calibration Step 5~16 semantic contracts]
        |
        +--> [Step 17 reading + closure matrix]
        |          |
        |          +--> [07 phase/boundary audit input]
        |          +--> [05 test expansion input]
        |          +--> [06 acceptance mapping input]
        |          +--> [04 config binding input]
        v
[Step 19 formal 03]
        |
        v
[formal 07 may define implementation phases/commits]
```

关键说明：

- Step 17 只转译阅读和复核关系，不新增代码实现顺序。
- Step 19 是正式 `03` 的唯一装配入口；旧正式 `03` 不在图中。
- `07` 完成前不创建 implementation ledger/boundary skeleton，也不声称可开工。

## 7. 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 | 当前门禁 |
|---|---|---|---|
| 上游与 ownership | Step 1、正式 00/01/02 | 先确认 Runner local truth 与 Artifact/Governance/Sandbox/Runtime/Observability/Archive truth 分离 | upstream blockers retained |
| 七模块依赖方向 | Step 5 | 按 `contracts → domain → application → infra → entry/worker/operations` 逻辑关系组织实现；不得当作物理 crate 事实 | physical layout blocked |
| 对象/字段/状态 | Step 6、10 | 先读取对象卡片和状态矩阵，字段缺口回设计，不在代码补 placeholder | semantic pass; owner fields blocked |
| Trait/port/repository | Step 7、11 | application 只依赖 semantic ports；adapter 只在 infra 绑定；所有 mutable save 带 expected version/UoW | exact adapter/backend blocked |
| Public protocol | Step 8 | 使用 typed envelope、surface、page、receipt、job report；secondary type 缺失即暂停 | transport/owner DTO blocked |
| Function flows | Step 9 | 遵守 validate→reserve→load→domain→local write→stored result→complete/commit；external I/O 不进 UoW | semantic pass |
| State matrix | Step 10 | 只使用正式 enum；Unknown/Blocked/Conflict 不能压成 success/failure；reserved path 不调用 | semantic pass |
| Persistence/UoW | Step 11 | 以 logical store/identity/version/generation/append-only 规则实现 adapter；产品/schema 待后续 authority | backend blocked |
| Error/recovery | Step 12 | public issue 映射、RecoveryCase、no replay/resend/reclaim/resume 必须保留 | SDK exact mapping blocked |
| Concurrency/idempotency | Step 13 | operation namespace + stable digest + exact stored result/report/receipt replay；commit unknown 只读恢复 | durable implementation blocked |
| Config/dependency | Step 14 | 只有 infra builder/entry/worker/operations 读 validated config；domain 不读 config；configured≠ready | formal 04 pending |
| Observability | Step 15 | safe structured logs/low-cardinality metrics/trace/local audit；local records 不等 formal evidence | backend/SLO pending |
| Test cuts | Step 16 | 将 semantic cuts 转成 `05` 用例/fixture/CI；不把当前切口当已执行结果 | test runner/repo blocked |

## 8. 实施前置阅读清单

| 文档/资源 | 阅读目的 | 状态 |
|---|---|---|
| `projects/L5-runner/00-需求文档.md` | 需求范围、truth ownership、验收红线 | current formal input |
| `projects/L5-runner/01-架构设计.md` | 边界、依赖方向、技术未决项 | current formal input |
| `projects/L5-runner/02-概要设计.md` | 六部分、17 对象、接口/flow/state 骨架 | current formal input |
| `projects/L5-runner/03-详细设计.md`（Step 19 后） | 正式实现入口；旧文件不得使用 | pending assembly |
| `projects/L5-runner/design-calibration/03_ddd_step_05_module_contracts_axis.md` ～ `03_ddd_step_16_test_slices.md` | 按 boundary 读取字段/port/protocol/flow/state/consistency/test 细节 | completed semantic chain |
| `projects/L5-runner/design-calibration/03_ddd_step_17_implementation_handoff.md` | 实施前闭环和命名/风险入口 | current |
| 后续正式 `04-配置设计.md` | profile、secret、adapter binding、numeric limits | not yet generated |
| 后续正式 `05-测试方案.md` | fixture、suite、CI、报告和执行门禁 | existing file requires new-03 review |
| 后续正式 `06-验收标准.md` | AC/VETO/evidence boundary | existing file requires new-03 review |
| 后续正式 `07-实施计划.md` | phase、commit boundary、implementation ledger、handoff gate | not yet generated |
| `standards/document/详细设计书写规范.md`、详细设计 SOP | 章节和 Step 纪律 | read |
| `standards/document/设计文档讨论中间产物规范.md` | 三层台账、来源追溯、重建纪律 | read |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段/DTO/state/metadata/idempotency/projection/phase audit | read |
| `standards/document/全局项目依赖关系与裁剪规则.md` | L0～L4 truth owner 与依赖裁剪 | read |
| `standards/document/子项目目录与代码文件组织规范.md` | 目标实现仓命名和条件性 Rust 布局 | read |
| `standards/coding/rust.md` | 仅在 Rust 获正式 authority 后适用；英文源码/rustdoc/测试名 | conditional |
| `standards/document/实施计划书写规范.md`、`实施计划讨论流程_SOP.md` | phase/commit/ledger/boundary gate 规则 | read |
| 当前有效提交规范与项目 git config | commit title/body/footer/user 核验 | authority gap; recheck before commit |

## 9. 实施前检查清单（不代表已通过）

| 检查项 | 期望条件 | 当前结论 |
|---|---|---|
| formal design baseline | Step 19 新版 `03`、下游 `04/05/06/07` 对齐 | blocked/not created |
| target implementation repo | `/home/aris/Projects/quantalithos-runner` 真实存在且偏离已登记 | blocked (`RUN-DDD-001`) |
| language/runtime/shell | 正式 authority + package/test runner | pending (`RUN-DDD-002`) |
| local store/cache | transaction/version/durability/locking/corruption contract | pending (`RUN-DDD-003`) |
| upstream SDK/owner contracts | exact DTO/error/redaction/trace/lease/read surface | blocked (`RUN-UP-001~008`) |
| field closure | every required field has source/mapper/missing behavior | pass for semantic chain; owner exact fields blocked |
| DTO construction closure | 11/12/4/0/5 surfaces map to object/view/report or explicit blocked path | pass for semantic chain |
| state closure | Step 10 names ↔ Step 16 cuts; no old names | pass; downstream must preserve |
| metadata/idempotency | command/job/consumer keys, digest, result/report/receipt replay | pass for semantic contract |
| projection rebuild | J05 existing identity + generation/version guard; Query no-write | pass for semantic contract |
| artifact/materialization | transfer/integrity/cache axes separate; raw bytes/body excluded | pass for local boundary; upstream artifact contract blocked |
| phase boundary | no phase defined here; 07 must audit each boundary | pending 07 |
| git user/commit format | current config + effective commit standard verified before implementation | not verified for implementation; no commit |

## 10. 字段闭环预复核

| Domain/record | 必填字段类别 | 来源 | 缺失行为 | 结论 |
|---|---|---|---|---|
| `ReleaseSelection` | context、release、version、scope、generation、selection state | explicit `SelectReleaseInput` + context read + id generator/generation allocator | reject/conflict/blocked；不得 latest/default | pass semantic |
| `AcquisitionTask` | selection binding、task id、state、source/handle/progress optional | C03 DTO + selection repository + J01 source/cache result | absent/blocked/unknown；不把 locator 变下载成功 | pass semantic |
| `IntegrityPosture` | material binding、manifest/digest/signature/platform results、freshness/state | J01 verifier/authority safe result | Invalid/Blocked/Stale；不本地猜测 | pass semantic; exact verifier blocked |
| `MaterialCacheEntry` | cache ref/handle、binding、integrity ref、state、protection metadata | J01 cache provider + local generated ref | quarantine/blocked；不存 path/bytes | pass semantic; backend blocked |
| `RunIntent`/`ControlIntent` | selection/material basis、request/control kind、state、owner refs/receipt | C07/C08 metadata + formal Sandbox/Runtime result | Unknown + RecoveryCase；Accepted≠Running | pass semantic; owner DTO blocked |
| `ProtectionGuard`/`RecoveryCase` | subject set、guard inputs、expected basis、state/reason | C09/J03 safe reads + local persisted basis | conservative Unknown/ManualReview | pass semantic; owner read blocked |
| `OutputPreview`/`FailureDiagnosis`/`HandoffPosture` | bounded safe refs/content、redaction/visibility、state/receipt | J04/C11 redaction/diagnostic/handoff result | body-free Blocked/Unavailable | pass semantic; L4 contract blocked |
| `RunnerReadSection`/`ConnectivityView` | section identity、subject/scope、generation、surface/source attribution | J05 existing projection + safe source observations | no-upsert; stale/conflict | pass semantic; physical store blocked |
| idempotency/result/entry/consumer/job records | key/digest, result/report/receipt refs, claim/checkpoint/disposition | trusted metadata + local repositories | Unknown/recovery; no replay/reclaim | pass semantic; durable backend blocked |

## 11. DTO / protocol secondary type 闭环预复核

| Protocol family | Outer surface | Secondary types | Target / outcome | Missing behavior | Conclusion |
|---|---|---|---|---|---|
| Command 11/11 | `RunnerTypedCommandRequest/Response/Outcome` | actor, metadata, basis, issue, result ref, change summary, 11 stored variants | local object/intent/result | reject/conflict/unknown; duplicate exact replay | pass |
| Query 12/12 | `RunnerQueryResponse` / `RunnerPageResponse` | page info, surface, visibility/freshness/degraded, section/view types | safe view/read section | empty/not-visible/stale/degraded/failed | pass |
| Consumer 4/4 | header/envelope/receipt/disposition | source/schema/event/dedup header, issue/result refs | current negative receipt only | malformed/unsupported/blocked; positive apply reserved | pass for blocked path |
| Outbound 0 | none | none | none | no outbox/publisher/topic | pass/no residue |
| Job 5/5 | `RunnerTypedJobRequest`/`RunnerJobResponse`/`RunnerJobReport` | kind, run/basis, claim/checkpoint, counters, issue refs | local operations report | blocked/partial/failed/unknown/replay | pass |

## 12. 状态闭环预复核

| 状态集合 | 正式来源 | 触发/读取 | Step 16 切口 | 结论 |
|---|---|---|---|---|
| `SelectionState`、`AcquisitionState` | Step 6/10 | C01～C06/J01/Q03/Q04 | `domain_selection_material_invariants`、状态表 | pass |
| `IntegrityState`、`MaterialCacheState`、`ProtectionState` | Step 6/10 | J01/J02/C09/Q05/Q07 | cross-axis and safe-release cuts | pass |
| `RunIntentState`、`ControlIntentState`、`RecoveryState`、`HandoffState` | Step 6/10 | C07～C11/J03/J04/Q06/Q08/Q11 | lifecycle/recovery guard cuts | pass semantic; owner effects blocked |
| `ConnectivityState` + projection generation guard | Step 10 | J03/J05/Q01/Q07/Q12 | `operations_generation_refresh` / `projection_identity_generation_guard` | pass |
| `RunnerIdempotencyState`、entry/handler dispositions | Step 10 | all C/Q | protocol/application cuts | pass |
| consumer loop/item dispositions | Step 10 | E01～E04 | header-first negative cuts | pass for reserved path |
| job entry/claim/checkpoint/disposition | Step 10 | J01～J05 | claim/checkpoint/report cuts | pass semantic |
| adapter availability/runtime build | Step 10/14 | builder/readiness | marker/builder cuts | pass semantic; physical readiness blocked |

## 13. Metadata / idempotency / projection / artifact 复核

| 复核项 | 设计结论 | 实施约束 |
|---|---|---|
| command/job/consumer metadata | trusted boundary 提供 actor/scope/trace/issued-at/key/basis；Query 无 write key | 不从 UI label/route/body 自报 metadata；Consumer body 不覆盖 header。 |
| canonical digest | operation name + stable result-affecting fields；排除 time/trace/request/random/raw body | exact hash algorithm待 authority；不得用 raw body、PID、port 或 arrival time。 |
| duplicate replay | exact stored Command result/Job report/Consumer receipt | result/report/receipt 缺失→ConsistencyUnknown+RecoveryCase；不得重算。 |
| projection rebuild | 仅显式 J05，existing projection identity + generation + expected version | Query/Online/render/reconnect 不替换；missing identity 不 upsert。 |
| materialization | acquisition Complete、integrity Verified、cache Qualified 三轴分离 | 不把 local path/bytes/manifest body写入普通 record；上游 manifest/integrity exact seam blocked。 |
| local audit/evidence | local trace/history/marker/receipt/report 是 operational/local records | 不提升为 L4 audit/evidence/report/verdict/signoff。 |

## 14. 命名一致性与冲突修正

| 冲突/旧名 | 正式口径 | 处理 |
|---|---|---|
| 旧 `RunnerRun` / `RunQueueEntry` / `RunCard` | `RunIntent`、`ControlIntent`、`OwnerRunProjection`、`RunnerReadModel` | Step 19 不继承旧对象主线；下游不得引用旧名。 |
| 旧 Tauri/Rust `src-*` tree | physical layout `blocked` | 不写路径、crate、package 或 binary；关闭 authority 后重开 Step 3/4。 |
| `latest/default/newest/tag/branch` | explicit immutable `ReleaseRef + ArtifactVersionRef + scope + generation` | schema 不可表达；测试必须 rejected。 |
| `Accepted/Running`、`Complete/Verified/Qualified`、`Confirmed/Cleaned` | 独立状态轴 | 所有 formal docs/test/acceptance 使用分轴名称。 |
| local receipt/log/report vs evidence | local safe record only | 禁止升级 truth/evidence/verdict/signoff。 |
| Configured/Enabled/Ready | 三层 marker/build posture | 不以 config/connection/UI 直接构造 Ready。 |
| `Command` 数量 | 11（Runner） | 不从其他项目的 23/22 Command 口径迁移。 |

## 15. Phase boundary 预复核（不定义 phase）

| 复核项 | 本 Step 结论 | 07 必须补充 |
|---|---|---|
| 当前 phase 是否依赖后续 phase DTO/port/state | 未定义 phase；不得假设后续对象可用 | 每个 boundary 列 required reads、allowed/forbidden scope、依赖和暂停条件。 |
| 设计 baseline | 尚无实现 baseline/commit | 07 生成后由真实 design/implementation authority 确认；本 Step 不伪造 hash。 |
| test/evidence/report | 只有 planned semantic cuts | 07/05/06 指定真实 test gate、artifact/report/evidence 产物和失败语义。 |
| implementation ledger | 未创建且不允许现在创建 | 07 为每个 boundary 定义 ledger path、status、Commit/Handoff Gate。 |
| experience review | 未按 boundary 选择标准 §九条目 | 07 的设计者必须逐 boundary 给 pass/not applicable/blocker。 |

## 16. 实施、提交与台账纪律承接

以下仅是实施前必须阅读并核验的纪律，不表示 Runner 已进入实现：

| 纪律 | 承接要求 | 当前状态 |
|---|---|---|
| 实现仓 | 按目录规范核验 `/home/aris/Projects/quantalithos-runner`，记录实际偏离后才能定义路径 | absent/blocker |
| 语言/编码 | 若正式选 Rust，源码标识符、rustdoc、普通注释、测试名默认英文；若非 Rust，重开相应规范 | pending authority |
| git identity | 实施前执行并记录 `git config user.name` / `git config user.email`；规范期望值需以有效项目规则核验 | not verified for Runner implementation |
| commit message | 其他实现仓使用英文标题 `type(scope): subject`，body 按 boundary 子功能分组，footer 前保留真实空行；精确格式可用 `git commit -F` | required reading; no commit now |
| commit 粒度 | 一笔提交对应一个经 `07` 审定的 commit boundary，不按文件/函数随意拆分 | phase not defined |
| implementation ledger | 只在 `07` 正式授权并创建后使用；`gate_status=blocked` 时不得实现或提交 | forbidden now |
| workspace safety | 保持 design 仓与 future implementation repo 边界；不得写其他项目或 broad path | active |

## 17. 回填草稿（未来正式 §16）

正式 `03-详细设计.md` §16 应汇总本 Step §7～§16，明确：

1. 详细设计只向 `07` 提供设计契约和审计输入，不定义 phase、任务、commit 或排期。
2. 实施者必须先读正式 `00/01/02`、Step 19 后正式 `03`、按 boundary 选择的 calibration、有效 coding/目录/提交规范和后续 `04/05/06/07`。
3. 字段、DTO、Query、状态、metadata/idempotency、projection/materialization 的闭环结论和 blocker 必须在开工前复核。
4. 目标实现仓、语言/runtime、SDK/owner seam、local store/cache、配置/测试/观测后端未确认前，不得由实现者自行补选。
5. `07` 必须在正式实现移交前按 phase/commit boundary 对正式 `03/05/06/07` 重新执行可落码闭环审计。

## 18. 待确认事项与进入下一步条件

| 待确认事项 | 影响 | 待确认方 | 未确认前处理 |
|---|---|---|---|
| 正式 `03` 尚未重建 | 旧文档不能作为实现入口 | 详细设计维护者/用户 | Step 19 full-restart；不得按旧 03 开工。 |
| `04/05/06/07` 下游正式文档 | 配置、测试、验收、phase 尚未闭合 | 对应文档维护者 | 只使用 semantic calibration；不得假设下游已对齐。 |
| 目标 implementation repo | 无 manifest/source/test/baseline | 实施计划维护者/用户 | 保持 `RUN-DDD-001`；不创建仓。 |
| language/runtime/shell/process/store | 物理布局和测试 runner 未定 | 架构 authority/用户 | 保持 `RUN-DDD-002/003`；不写 package/crate/path。 |
| L0-sdk exact public surface | adapter 方法、错误、redaction/trace 未闭合 | L0-sdk/相关 owner | semantic port + fake/blocked；不猜 SDK。 |
| Artifact/Governance/Sandbox/Runtime/Observability/Archive seam | positive adapter/consumer/integration 未闭合 | 各 truth owner | fail closed；不把 receipt/projection/local log升级 truth。 |

Step 17 完成；下一步进入 Step 18。本文不证明实现仓、baseline、commit、测试、artifact、report、evidence、verdict、signoff 或 readiness 存在。
