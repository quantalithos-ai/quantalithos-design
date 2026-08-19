# L2-runtime 07 实施计划 Step 1：实施输入边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 1
> 回填位置：正式 `07-实施计划.md` §1
> 状态：`completed_continuous_authorized`
> 事实边界：本 Step 判断是否足以制定实施路径，不授权实现；目标实现仓不存在，actual implementation/test/evidence/acceptance 均未开始。

## 1. 本步输入

| 输入 | 定位 | 本步用途 |
|---|---|---|
| current formal `00~06` | normative project authority | 固定需求、架构、对象、协议、状态、配置、测试与验收真相 |
| 07 SOP / writing standard | normative process authority | 固定 Step 1~13、13 章、planned ledger/skeleton 规则 |
| global dependency / ledger / landability standards | normative cross-project authority | 固定依赖六分类、implementation gate 与设计缺口回流 |
| current owner chains and ledgers | upstream/current seam authority | 裁剪 Core/Tools/Hub/Method/Gov/Sandbox/Obs/Bus/SDK seam |
| old formal 07、old Step 1~13、old ledger/skeleton | `historical_material` | 只用于 phase 候选与 stale identity 污染审计 |
| filesystem preflight | current environment fact | 确认目标实现仓 absent、Core/Bus/SDK sibling 目录存在但 compatibility 未验证 |

## 2. SOP 问题回答

1. **00/01/02/03/04/05/06 是否完整**：完整，且 06 已获用户确认作为 07 输入。
2. **本轮基线是什么**：当前 workspace 中 formal 00~06 的内容；尚未绑定 immutable commit/tree digest，故只能生成设计级实施合同。
3. **03 是否足以支持 1:1 规划**：足以拆分 module/object/Port/protocol/Flow/state/UoW/config/test boundary；实际开工仍须按每个 boundary 绑定 immutable source 并二次复核。
4. **05/06 是否足以定义门禁**：是。当前 canonical contract 为 37 CUT、177 TC/EV、8 suite、9 check、36 AC、8 VF、19 NFR、G0~G3 分层。
5. **是否有冲突**：current 00~06 内部主分母可闭合；旧 07 与 current 03~06 冲突，必须拒绝旧 18-state、20-CUT、109-EV、12-suite、4-check、18-EG 口径。
6. **字段/DTO/状态/phase boundary 是否闭合**：current 03 已给出 7 crate、12 CAP、48 surface、31 state、UoW/replay/error/config/test handoff；但 implementation repo、Core compatibility、binary product identity 和正向 owner seam 未形成实际开工证明。
7. **05/06 是否使用 current 03 正式身份**：当前 05/06 已绑定 C01~C17、Q01~Q12、E01~E06、O01~O06、J01~J07、SM01~SM31、7 UoW、6 replay family 和 177 registry。
8. **哪些缺口阻塞计划，哪些阻塞实现**：没有缺口阻塞 07 设计；目标仓、immutable baseline、Core exact contract、Rust toolchain、entry/positive adapters 等阻塞实现激活或相应 qualification。

## 3. Canonical implementation input baseline

| Dimension | Current canonical input | Planning disposition |
|---|---|---|
| requirements | 20 core FR + 4 peripheral future FR；44 BR；19 NFR；36 AC；8 VF | core P0 与 conditional/future 分层，不把 peripheral future 混入 local completion |
| architecture | Runtime loop/local orchestration truth；六类 dependency seam；owner redlines | only Core compile candidate；所有 runtime/event/ref/adapter/fake 保持非 package |
| workspace | Rust planned；7 crates：contracts/domain/application/infra/api/worker/jobs | 可规划；edition 2024/MSRV 1.93 仍需未来 preflight |
| capabilities | 12 CAP；loop kernel 是唯一推进点 | phase 同时按 capability slice 与 technical layer 切分 |
| public surfaces | 17 C + 12 Q + 6 inbound E + 6 outbound O + 7 J = 48 | 每个 surface 必须落入唯一 implementation boundary |
| state/consistency | 31 states；7 UoW crash windows；6 replay/concurrency families；typed CAS/lease/cursor/fence | 不能沿用旧 18-state/TX alias；每个 boundary 绑定 exact SM/UoW/replay rows |
| configuration | 15 config slices；12 roots/153 leaves/39 derived；13 slots；7 job controls；V0~V12 | whole candidate + builder + fail-closed；无 hot reload/Ready/private fallback |
| testing | 37 CUT；172 raw + 5 aggregate = 177；8 suites `35/32/32/16/25/15/17/5`；9 checks | PH-12 实现 runner/check/report tooling；早期 boundary 只使用 exact repository-local selectors，后续 fixed run 重放 |
| acceptance | G1 local/G2 candidate/G3 slot/product 分离；M0~M5；fixed paths；36 AC/8 VF | implementation 只生成 review-required handoff candidate，不产生 verdict/signoff/readiness |

## 4. Dependency cut and owner audit

| Relation | Type | Runtime implementation may own | Must remain external / blocked |
|---|---|---|---|
| `L0-core` | `compile_candidate` | exact reviewed shared primitives only | package/crate/API/schema/codec compatibility must be proven; no shadow copy |
| `L2-tools` | `runtime/ref/adapter/fake` | invocation intent、local attempt/fence/gap、finite result mapping | tool execution/receipt/cleanup truth；UP-001~003 |
| Capability Hub | `runtime/ref/adapter/fake` | body-free identity/exposure/descriptor view consumer | registry/exposure/adapter truth |
| Method Library | `runtime/ref` | method/role/process refs/version/availability | definition body/source/lifecycle；dirty source disclosure |
| Governance | `runtime/ref/adapter/fake` | read-only precondition view and fail-closed local decision | policy/approval/effective truth |
| Sandbox | `runtime/adapter/fake` | isolation requirement in guard and attempt context | execution/isolation/cleanup truth |
| model/memory owners | `runtime/ref/adapter/fake` | provider-neutral intent/result；working memory；durable ref/candidate/gap | route/secret/quota/cost/raw；durable body/index/lifecycle |
| `L0-bus` / Observability | `event/adapter/fake` | immutable outbox/safe observation candidate/attempt/gap | delivery/DLQ/Observed/backend/audit truth |
| `L0-sdk` / member/product | `downstream/ref` | formal facade surface only | reverse package edge、container/image/member/marketplace/product lifecycle |

## 5. Input closure and blocker classification

| Item | Current state | Blocks 07 planning? | Blocks implementation/qualification? | Required handling |
|---|---|---:|---:|---|
| formal 00~06 structure and canonical identities | available/current workspace | no | immutable binding pending | Step 3/12 require content digest/source manifest before activation |
| target `/home/aris/Projects/quantalithos-runtime` | absent | no | all implementation | `L2R-IMPL-001`; do not create without explicit implementation authorization |
| Rust edition/MSRV/toolchain | planned/not build-verified | no | Build Gate | `L2R-LANG-001`; verify actual `Cargo.toml`/`rustc` later |
| Core sibling directory | exists | no | PH-01 exact compile contract | directory is not compatibility; run bounded Spike/preflight |
| Bus/SDK sibling directories | exist | no | positive event/client lanes | cannot become compile dependencies from directory presence |
| Tools/Hub/Method/Gov/Sandbox/Obs positive seams | pending/open per owner | no | affected G2/G3/positive lane | implement blocked/fail-closed local contract only until owner closure |
| checkpoint physical commit | `L2R-CP-001` pending | no | checkpoint positive commit/resume | Prepared/Unknown/local recovery only; no stable claim |
| product entry mapping | `L2R-ENTRY-001` pending | no | production entry | facade-only; no member/container lifecycle |
| immutable design baseline | not bound | no | every Activation/Design Gate | bind exact current formal sources before first code edit |

## 6. Historical pollution rejection

| Old 07 assertion | Current disposition |
|---|---|
| `18 state machine` implementation denominator | reject；current canonical state denominator is 31 |
| `20 CUT` | reject；current CUT denominator is 37 |
| `109 planned evidence slot` | reject；current G1 registry is 177 TC/EV identities |
| `12 suites / 9 local owners / 4 checks` | reject；current G1 owns 8 suites and 9 mandatory checks |
| `18 evidence gate` / `EG-L2R-*` | reject；current evidence contract is M0~M5 + 177 registry + 9 checks + AC/VF disposition |
| old `CMD/QRY/INE/OUT/JOB/SM-*` aliases | reject as active test identity；use C/Q/E/O/J formal surface and current canonical TC/EV registry |
| 35 boundaries and 12 phases | candidate only；may be retained only after Step 5/6 revalidates against current 03~06 |
| old implementation ledger/skeleton status | reject as current；all future ledgers must be rebuilt from new Step 6~12 contracts |

## 7. Design choice

采用“保留业务纵切顺序、重建全部 identity/gate/evidence binding”的 full-restart：旧 12-phase 结构与 current 03 §16 的实现顺序大体一致，可作为候选；但任何 phase/boundary 只有在 Step 5/6 重新覆盖 loop kernel、31 state 和 current 177-row test contract 后才能进入正式 07。

不在 Step 1 解决以下事项：具体 async runtime、transport、DB、broker、scheduler、provider SDK、physical checkpoint store、production adapter 或 product entry。这些若不是 current formal truth，只能成为 Spike/blocker，不能由 07 选择。

## 8. Formal backfill draft

正式 §1 必须声明：current formal 00~06 是唯一 active project authority；旧 07 为 historical material；当前可以完成 implementation contract design，但不能开始实现。它必须列出六类 dependency seam、owner/non-owner 边界、canonical 31/177/8/9 分母以及所有 persistent blocker。

## 9. Stop review

| Check | Result |
|---|---|
| required formal inputs | 00~06 present and current 06 user-confirmed |
| design-planning sufficiency | sufficient for phase/boundary planning |
| implementation activation sufficiency | insufficient；repo/baseline/Core/toolchain/positive seams remain blocked |
| historical conflicts | classified and rejected |
| owner/dependency boundary | six dependency types retained；only Core compile candidate |
| fabricated implementation/evidence | none |

```text
step_status = completed_continuous_authorized
gate_status = pass_to_step_02
formal_07_write_allowed = false_until_step_13
implementation_activation = blocked
next_allowed_action = rebuild_step_02_scope
commit_required = false
```
