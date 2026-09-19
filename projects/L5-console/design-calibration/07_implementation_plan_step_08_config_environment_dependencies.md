# Step 8. 定义配置、环境与外部依赖准备

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 8
> 回填章节：`07-实施计划.md` §8 配置、环境与外部依赖准备
> 粒度参考：`projects/L1-governance/design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md`
> 执行模式：`full-restart + single-agent-serial`

## 1. Step 状态与开工确认

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 8 · 配置、环境与外部依赖准备 |
| 当前状态 | `done / pass / self_reviewed`（设计层；`step_stop_review`） |
| 输入基线 | Step 3 阅读/前置矩阵；Step 5 `PH-01～PH-08`；Step 6 `commit-01-a～commit-08-c`；Step 7 门禁；正式 `03/04/05/06` |
| 正式 07 写入 | `false`；Step 13 full-restart 前不得创建或修改正式 `07-实施计划.md` |
| 实现移交 | `blocked / wait_design`；目标仓、runner、host 和 exact owner/SDK surface 未固定 |
| 本步输出 | 外部依赖准备表、配置/环境检查表、phase/boundary 准备矩阵、fake/mock/disabled 使用边界和失败处理 |
| 下一动作 | Step 8 停审完成；按用户“完成全部 07”授权进入 Step 9 |

### 1.1 开工确认

| 检查项 | 记录 |
|---|---|
| 已读取规范 | `实施计划讨论流程_SOP.md` Step 8；`实施计划书写规范.md` §5.8；`代码实施台账与门禁规范.md` §三～§七；可落码性标准相关章节 |
| 已读取项目输入 | Step 3/5/6/7 calibration、正式 `03` §3/§4/§5/§7/§13、正式 `04` §3～§13、正式 `05` §8/§9、正式 `06` §3/§6/§10/§11 |
| 技术边界 | planned TypeScript/ESM browser client；Rust/Cargo、DB、repository、projection、outbox、worker、job 均不适用或禁止 |
| 当前事实 | `/home/aris/Projects/quantalithos-console` 不存在；无 package、runner、run、artifact、report、evidence 或 baseline |
| 设计权限 | 仅能写本 calibration；不得以本 Step 发明配置 key、SDK DTO、host API、错误码或状态 |

## 2. 本步输入与权威顺序

| 输入 | 用途 | 当前结论 |
|---|---|---|
| 正式 `04-配置设计.md` §3～§13 | 四项配置、三 profile、strict whole-document、startup-only、fail-closed | `runtime.profile` 必填；其余 `[]/false/false` optional defaults；不等 readiness |
| 正式 `03-详细设计.md` §3～§5、§7、§10、§13～§15 | TypeScript/ESM、十模块、Port/adapter、carrier、外部依赖、诊断 | 只经 official SDK/formal boundary；positive surface pending |
| 正式 `05-测试方案.md` §8～§10、§13 | 环境角色、suite、artifact/report roots、不可用处理 | 全部 future/planned；无执行环境事实 |
| 正式 `06-验收标准.md` §3、§6、§10～§14 | baseline、redaction、VETO、handoff、完成上限 | 当前 `not_entered / blocked_by_missing_baseline` |
| Step 5/6/7 calibration | phase/boundary 使用时点、门禁和失败姿态 | 作为实施编排，不新增真相 |

权威顺序固定为：正式 `03/04/05/06` → Step 5/6/7 calibration → 本 Step 准备编排。若准备表与正式文档冲突，暂停并回写正式真相源；不得由实现者在仓内选边。

## 3. SOP 问题回答

| 问题 | 本项目结论 |
|---|---|
| 1. 哪些外部服务或仓是实施前置依赖？ | 业务 truth 依赖均是 SDK/formal-service runtime seam，不是 sibling 源码依赖。官方 `@quantalithos/sdk` 是唯一允许的客户端访问边界；目标实现仓、实际 package manager、framework/router/bundler、host lifecycle、测试 runner 和 exact owner/SDK surface 必须先由 authority 固定。当前目标仓不存在，故 PH-01 blocked。 |
| 2. 哪些依赖只在特定阶段需要？ | package/config/runner/root 在 PH-01；host/context 在 PH-02；safe query surface 在 PH-03；owner command/reconcile/carrier 在 PH-04；八主题 facet 在 PH-05；recovery/a11y/diagnostic sink 在 PH-06；formal adapter/invalidation 在 PH-07；fixed-run release/report/evidence 在 PH-08。 |
| 3. 哪些配置必须在本地或 CI 准备？ | 只准备正式四项：`runtime.profile`、`bindings.adapterBindings`、`invalidation.enableSdkInvalidation`、`diagnostics.enableDiagnostics`。配置必须是单一 strict JSON 文档；profile 必填；不得通过 env/CLI/URL/DOM/cookie/storage 覆盖叶子字段。 |
| 4. 是否允许 fake/mock，允许到什么阶段？ | 允许 P0 safety/negative/semantic/static 验证使用 deterministic formal-shaped fake、controlled seam 或 disabled adapter；不允许 fake 证明 owner positive、production readiness、真实兼容或正式 audit/evidence。fake 不能跳过 scope、safe-field、state、unknown/no-replay、redaction 或 Query zero-write。 |
| 5. 外部依赖不可用时暂停、降级还是替代？ | 目标仓、编译/类型工具、P0 runner、配置根或 required fake 不可用：`blocked / wait_design` 或 gate failure，不能继续。selected browser/AT、owner positive、production sink、quantitative authority 不可用：`residual / conditional`，不贡献 P0 pass。正式边界调用不可用：保留 typed unavailable/blocked/read-only/partial，不能本地推导成功。 |
| 6. 哪些依赖需要其他团队或仓提供？ | identity、work、process、governance、artifact、workspace、member、method、capability、observability、archive、sandbox 等 owner 提供正式 SDK/service contract；SDK/host/AT/诊断 authority 由相应 owner 提供。当前只登记依赖和解锁条件，不假定对方仓停审或可编译。 |
| 7. 实现仓是否已存在？ | 否。只读检查确认 `/home/aris/Projects/quantalithos-console` 当前不存在；本 Step 不创建目录、不写 package、不初始化 git。 |
| 8. 是否存在 Cargo/path dependency？ | 不适用。L5-console 是 TypeScript/ESM 客户端；不得把 L0～L4 sibling 源码、Rust crate、DB 或私有 package 作为 path dependency。`@quantalithos/sdk` 的具体 package/version/export 需目标仓和正式 authority 再确认。 |
| 9. 运行期/事件协作如何接入？ | 通过 official SDK、正式 service adapter、host port、safe ref 或 conditional SDK hint；禁止直连 broker、cursor、DB、private bus、BFF、owner source、projection 或 cache。`ConsumeSdkInvalidationHint` 默认 disabled，合同未闭合前不启用。 |

## 4. 当前材料问题诊断

| 问题 | 风险 | 本 Step 修正 |
|---|---|---|
| 目标实现仓不存在 | 无法核实 package、lockfile、host、runner、git worktree 或 build 命令 | 将 `BLK-CON-07-001` 前置到 PH-01；不创建仓、不伪造命令 |
| 依赖名称可能被误写成 sibling package | 形成第二 truth、绕过 SDK 或引入私有 schema | 依赖表按 compile/package/runtime/host/test/evidence 分类；owner 仅 formal boundary |
| 04 配置项容易被扩展 | 将 endpoint、secret、TTL、threshold、readiness 写入客户端配置 | 只保留四项正式 key；未知/duplicate/forbidden key 整文档 reject |
| fake 可能被当作正向集成 | fake pass 被误解释为 owner/production pass | 每个 fake 记录证明上限；positive adapter、invalidation、诊断 sink 仍 conditional |
| 环境不可用处理分散 | 实施者可能临场决定继续或降级 | 固定 `pause / blocked / residual` 矩阵，并绑定 phase/boundary |
| evidence roots 尚未创建 | 脚本路径被误写成已存在 | `artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance` 统一标为 future/not_created |

## 5. 配置与环境设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 从旧 README 选择框架、router、bundler | 可快速写命令 | 无当前 authority，易污染实施计划 | 不采用 |
| 为每个 owner 建 sibling path dependency | 类型看似直接 | 复制 owner truth，违反 SDK-only 和跨仓裁剪 | 不采用 |
| 单一 strict JSON + startup-only 四项配置 | 可审计、fail-closed、无热更新歧义 | 正向环境切换需新文档/新启动 | 采用 |
| P0 依赖真实 owner 服务和生产 sink | 接近产品 | 合同和环境未固定，阻塞安全骨架 | 不采用 |
| P0 使用 formal-shaped fake/controlled/disabled seam | 可验证负向和语义边界 | 不能证明真实 positive | 采用，且明确证明上限 |
| 将 selected browser/AT、量化作为 P0 | 覆盖面较广 | authority 未选会伪造 readiness | 不采用；保留 residual |

## 6. 结构化中间产物

### 6.1 外部依赖准备表

| 依赖项 | 类型 | 全局依赖类型 | 使用阶段 | 提供方/权威 | 检查方式 | 不可用时处理 |
|---|---|---|---|---|---|---|
| `/home/aris/Projects/quantalithos-console` | implementation repo | 实现工作区 | PH-01～PH-08 | Console 项目 owner | `test -d`、git/worktree/package 只读检查 | PH-01 blocked；不得创建或替代到 design 仓 |
| `@quantalithos/sdk` public package | package boundary | 编译/运行期客户端边界（具体版本 pending） | PH-03～PH-07 | L0 SDK / owner service | 目标仓 manifest、公开 export 和版本核对 | exact surface 缺失则 safe fake/no-call；不得读私有源码 |
| identity/work/process/governance/artifact/workspace/member/method/capability/observability/archive/sandbox | formal service/SDK | 运行期 owner 依赖 | PH-02～PH-07 | 各正式 owner | approved SDK/service contract、scope/safe-field/ref 检查 | unavailable→typed unavailable/blocked/partial；positive gate blocked |
| browser host lifecycle/route/focus/announcement | host adapter | 运行期宿主依赖 | PH-02、PH-05、PH-06 | host owner | host contract 和 semantic harness | restricted/minimal/semantic fallback；具体 binding pending |
| L0 bus / invalidation hint | conditional SDK seam | 事件协作依赖 | PH-07 | SDK/formal boundary | exact envelope/version/order/dedup contract | default disabled；不得直连 broker/cursor/replay |
| package manager/framework/router/bundler | tool/host | 构建与运行工具依赖 | PH-01、PH-02、PH-07 | 目标仓 authority | manifest/lockfile/host docs | unknown→blocked；不从历史材料选择 |
| test runner/browser/AT harness | test tool | 测试环境依赖 | PH-01～PH-08 | 目标仓/测试 authority | runner manifest、deterministic dry-run | P0 runner missing→blocked；selected unavailable→residual |
| artifact/report filesystem roots | filesystem | 证据依赖 | PH-01、PH-08 | 实现仓/CI | explicit run-id dry-run、write/read/manifest checks | missing root→gate blocked；不得静态造证据 |
| diagnostic sink/envelope | optional service/host | 运行期可选依赖 | PH-06、PH-08 | Observability/host authority | body-free contract、redaction and sink isolation | disabled/body-free facade；不得生产 positive |
| design baseline / delivery / environment manifest | governance record | 交付依赖 | PH-08、handoff | design/implementation owners | immutable refs and manifest fields | `not_entered / blocked_by_missing_baseline` |

### 6.2 配置与环境检查表

| 配置/环境项 | 使用阶段 | 检查方式 | 失败处理 | 当前事实 |
|---|---|---|---|---|
| `runtime.profile` | PH-01 起 | strict parse、required enum、profile matrix | missing/unknown→fail-fast | key defined；未运行 |
| `bindings.adapterBindings` | PH-01、PH-07 | array/object/slot/profile/ref、duplicate和forbidden-body检查 | invalid→reject whole document；empty→safe pending | key defined；未运行 |
| `invalidation.enableSdkInvalidation` | PH-01、PH-07 | boolean、contract/slot/profile precondition | true without authority→reject；false→disabled | formal upper bound=false |
| `diagnostics.enableDiagnostics` | PH-01、PH-06 | boolean、allowed sink/body-free/redaction precondition | true without sink→reject；false→disabled | default=false |
| single host-provided strict JSON document | PH-01 | duplicate/unknown/alias/trailing-comma/whole-document validation | reject; no leaf fallback | source contract defined |
| profile `local-fake` | PH-01～PH-06 | deterministic formal-shaped fake and semantic negative suite | fake missing→P0 blocked | planned only |
| profile `integration-pending` | PH-07 | exact contract and enabled facet manifest | contract missing→remain pending | not enabled |
| profile `production-pending` | PH-08 | immutable approved artifact and release checks | missing baseline→not_entered | not a readiness claim |
| `artifacts/test/<run_id>` | PH-01、PH-08 | explicit run id, manifest, digest, write/read audit | block gate/report | directory absent |
| `reports/runs/<run_id>` / `reports/acceptance` | PH-08 | same-run pairing, redaction, review refs | handoff invalid | directories absent |
| target runner/toolchain | all | target repo manifest and real command discovery | blocked; no guessed command | target repo absent |

### 6.3 Fake / controlled / disabled 使用边界

| Seam | P0 允许 | 不能证明/不能做 | 适用阶段 |
|---|---|---|---|
| formal owner query | deterministic safe snapshot fake with source/status/qualification axes | owner truth freshness、production integration、body access | PH-02～PH-05 |
| owner command | recording fake that verifies call shape, scope and single-flight without mutating owner truth | real acceptance、idempotency positive、unknown replay | PH-04 |
| host/router/focus/announce | semantic host fake with shared guard/action/outcome | browser compatibility or AT certification | PH-02、PH-06 |
| carrier | session-volatile whole-record fake with single writer and late-drop scheduler | durable/cross-tab/cross-device guarantees | PH-04、PH-07 |
| invalidation | disabled branch and contract-shaped future fixture | broker/cursor/replay, observed freshness or positive restore | PH-07 |
| diagnostics | body-free whitelist sink fake with redaction and failure isolation | production audit/evidence/readiness or raw error capture | PH-06、PH-08 |
| report generator | generated report from real raw artifact in future run | static JSON, hand-written pass, missing source | PH-08 |

Fake data must be deterministic, case-local and synthetic. It must not contain credentials, owner body, database snapshots, private source, or hidden authorization decisions. A fake result may establish a safety assertion only within the declared fixture; it never upgrades a facet to `bound`, `active`, `current`, `confirmed`, `ready` or `production`.

### 6.4 Phase 级准备矩阵

| Phase | 开工前必须确认 | 可后置/conditional | 不可用处理 |
|---|---|---|---|
| PH-01 | target repo、package/toolchain authority、四项 config schema、artifact/report roots、static forbidden list | formal owner adapters、browser matrix | 任一基础项缺失→blocked；不创建替代仓 |
| PH-02 | host-neutral entry/access/navigation seam、context fixture、semantic guard | concrete router/framework | host contract缺失→restricted/minimal；P0 semantic可保留 |
| PH-03 | safe-field/source axes、Core Query inventory、no-write call ledger | owner positive DTO | exact query surface缺失→no-call/blocked；不得猜 schema |
| PH-04 | command phase/state、recording submit seam、unknown/no-replay、carrier ceiling | formal idempotency/reconcile | owner contract缺失→positive blocked；local safety可继续设计 |
| PH-05 | eight partition descriptors、canonical order、partial isolation | enabled owner facets | owner facet unavailable→disabled/partial；不合成 health/readiness |
| PH-06 | typed recovery matrix、semantic action map、redaction corpus、body-free sink | selected browser/AT、production sink | selected unavailable→residual；body leak→S/VETO block |
| PH-07 | adapter registry、SDK export authority、invalidation envelope/order/dedup | positive binding and observed invalidation | contract missing→disabled/zero-write；direct transport→architecture blocker |
| PH-08 | fixed baseline/run authority、report/pairing/no-static scripts、review roles | P1/quantitative/production-like | missing baseline/run/report→not_entered; no verdict |

### 6.5 Commit boundary 准备矩阵

| Boundary | 开工前准备 | 检查方式 | 不可用处理 |
|---|---|---|---|
| `commit-01-a` | target repo、package/toolchain、四项 schema | manifest/config dry-run（future） | blocked/wait_design |
| `commit-01-b` | gate/check/report roots、synthetic corpus、run-id rule | path/no-static/redaction dry-run | blocked；不创建 evidence |
| `commit-02-a/b` | host-neutral context/route ports、semantic fake | module-flow/a11y planned slices | authority缺失→restricted/blocked |
| `commit-03-a/b/c` | safe mapper、Core Query inventory、no-write ledger | pure-contract/query/architecture checks | exact owner surface缺失→no-call |
| `commit-04-a/b/c` | local state/command fixtures、carrier/race scheduler | state/intent/race/recovery suites | owner/reconcile/carrier缺失→blocked/ceiling |
| `commit-05-a/b/c` | descriptor registry、partition fixtures、canonical order | composition/redaction/a11y checks | facet/browser authority缺失→conditional/residual |
| `commit-06-a/b/c` | recovery plan、semantic map、forbidden corpus/sink fake | recovery/a11y/redaction checks | leak或semantic divergence→block |
| `commit-07-a/b/c` | approved SDK surface、adapter registry、invalidation contract | architecture/adapter/race checks | contract missing→disabled; no direct bus |
| `commit-08-a/b/c` | immutable baseline、run id、raw/report roots、review authority | release/pairing/no-static/report audit | missing source/review→handoff invalid |

### 6.6 环境不可用处理总表

| 环境/依赖 | 不可用场景 | P0 处理 | 是否贡献 pass |
|---|---|---|---|
| target repo | path absent或无法定位 worktree | PH-01 pause/block | 否 |
| package/toolchain/runner | command unknown或无法运行 | `blocked / wait_design`；不猜命令 | 否 |
| required P0 fake | fixture/ledger/scheduler 不可构造 | suite/gate failed | 否 |
| owner SDK contract | exact method/schema/ref未闭合 | no-call/disabled/blocked | 否；仅安全姿态可验证 |
| host/AT selected matrix | authority或环境缺失 | semantic P0保留；selected residual | 不贡献 selected pass |
| diagnostic sink | production envelope/sink未定 | disabled/body-free facade | 不贡献 production evidence |
| invalidation contract | version/order/dedup未定 | consumer disabled/zero-write | 否 |
| artifact/report roots | 无法写同一 run | gate/report blocked | 否 |
| P1/P2 real-like dependency | selected 环境缺失 | residual + trigger | 不贡献 P0 positive |

## 7. 配置/环境停审与跨依赖审计

| 审计项 | 结论 | 依据/修正 |
|---|---|---|
| 四项配置是否与正式 04 一致 | `pass` | 无新增 key；strict/startup-only/fail-closed 保持 |
| 是否把 profile 当 readiness | `pass` | profile、enabled、active、current、ready 分离 |
| 依赖是否区分 package/runtime/host/test/evidence | `pass` | §6.1 分类；无 sibling private source |
| 是否引入 Cargo/Rust/path dependency | `pass` | Console TypeScript；明确 not_applicable |
| fake 是否越过 owner truth | `pass` | 每类 fake 有证明上限；不得 positive/production |
| phase/boundary 准备是否完整 | `pass` | PH-01～PH-08、22 boundary 均有前置和失败处理 |
| 不可用处理是否可执行 | `pass` | pause/block/residual 三类均绑定下一动作 |
| artifact/report 事实是否诚实 | `pass` | roots 仅 future；当前不存在 run/实例 |

## 8. 回填草稿

正式 §8 只保留实施所需的配置、环境和依赖索引：四项 startup-only 配置、`local-fake`/`integration-pending`/`production-pending` profile、official SDK/formal service boundary、host/runner/AT/诊断条件、P0 fake/disabled 规则、`artifacts/test/<run_id>` 与 `reports/runs/<run_id>` roots，以及不可用处理。不得复制 04 的完整字段表，不得写具体框架、命令、endpoint、secret、TTL、阈值或 owner DTO。目标实现仓不存在时，PH-01 及所有实施移交保持 blocked。

## 9. 待确认事项

| 事项 | 状态 | 影响 | 截止点/解锁条件 |
|---|---|---|---|
| target repo 创建/提供方式 | `BLK-CON-07-001` | 全部 boundary | `commit-01-a` 开工前；路径和 worktree 可核验 |
| package manager/framework/router/bundler/host | `RES-CON-07-002` | `01-a/02-b/07-a/b` | 对应 boundary 开工前；正式 authority 写回 03/04 |
| exact owner/SDK query/command/result/ref | `BLK-CON-07-002` | `03/04/05/07` boundary | positive 开启前；03/05/06 contract-derived |
| carrier medium/TTL/migration/cross-tab | `CON-Q-044` | `04-c/07-c` | 任何 durability 声明前；否则 session-only |
| browser/AT authority and selected matrix | `CON-Q-046` | `05-c/06-b` | selected gate 开工前；semantic P0 可独立 |
| diagnostic sink/envelope | `RES-CON-07-001` | `06-c/08` | production diagnostics 开启前；默认 disabled |
| invalidation envelope/version/order/dedup | pending | `07-c` | consumer enabled 前；否则 disabled/zero-write |
| immutable design/delivery/environment baseline | `BLK-CON-07-003` | `08`/handoff | Step 12/13 移交前；固定后重审 |

## 10. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 依赖均显式列出并分类 | `pass` | package/runtime/host/test/evidence/handoff 分离 |
| 配置检查表与正式 04 一致 | `pass` | 四项 key、三 profile、strict/startup-only |
| fake/mock/disabled 使用边界明确 | `pass` | 只证明 safety/negative/semantic/static，不证明 positive |
| phase/boundary 准备与 Step 5/6/7 一致 | `pass` | 全部有失败处理和解锁条件 |
| blocker/residual 有截止点 | `pass with blockers` | blocker 继续阻塞实施移交，不阻塞计划设计 |
| 正式 07 仍未写入且无执行事实 | `pass` | Step 13 前关闭 |
| 可进入 Step 9 | `pass` | 按用户授权继续串行推进 |

## 11. Step 自审记录

- [x] 已回答 Step 8 全部 9 个 SOP 问题。
- [x] 已列出外部依赖、配置/环境检查、phase/boundary 准备和不可用处理。
- [x] 已明确 TypeScript/SDK-only 边界，排除 Rust/Cargo、DB、private bus、worker/job 等不适用项。
- [x] 已为 fake、controlled、disabled seam 写明允许阶段、证明上限和禁止用途。
- [x] 已保持 `BLK-CON-07-001～003`、`RES-CON-07-001～002`、`CON-Q-034～047` 的 blocked/conditional/residual 语义。
- [x] 未创建实现仓、package、脚本、run、artifact、report、evidence、formal `07` 或 commit。
- [x] `git diff --check -- projects/L5-console` 作为后续总审计项；本 Step 无执行测试事实。

## 12. Step 8 停审结论

Step 8 在设计层 `done / pass / self_reviewed`，并允许进入 Step 9。该结论仅表示配置、环境、依赖和 fake/disabled 准备规则可审查；目标仓、runner、exact contract、baseline、run 和 evidence 仍未创建或固定。任何后续实现必须先重新执行本 Step 的实际前置检查，不能把本文件中的 planned 表格解释为环境已就绪。
