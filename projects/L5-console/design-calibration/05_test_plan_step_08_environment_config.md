# Step 8. 设计测试环境与配置矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 8
> 回填章节：`05-测试方案.md` §8
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_08_environment_config.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标与事实边界

本 Step 定位 P0 planned tests 在 local/CI/controlled integration/future release-candidate 上的环境职责，明确 compile/runtime/event 依赖、替身方式、四项配置与三 profile 的组合、环境不可用姿态。环境名称是未来执行角色，不表示环境、目标仓、CI、浏览器 harness 或 owner 服务已经建立。

Console 的正式配置 profile 只有 `local-fake`、`integration-pending`、`production-pending`；本文件不得另造 `ci-test` 或 `staging-ready` profile。CI/selected integration/release candidate 是环境角色，可以选择现有 profile，但不会改变其语义。

## 2. 输入

| 输入 | 用途 |
|---|---|
| Step 6/7 | TC、data registry、fake/controlled/blocked posture |
| 01 §8～§10 | SDK-only 与跨仓依赖裁剪 |
| 03 §3、§5.8、§13～§15 | TypeScript/ESM、narrow Ports、binding、diagnostic/a11y |
| 04 §5～§12 | source/profile/schema/default/startup/failure truth |
| 全局依赖 §4.1 | Layer 5 并行窗口不构成本仓 runtime/compile truth |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| local/CI/integration/staging 分别测什么？ | local 做纯规则/flow/semantic 快速反馈；CI 做完整 P0 deterministic suites；controlled integration 用 `integration-pending` 测 pending/fail-closed 与已闭合 selected facet；release-candidate 用 `production-pending` 验证它仍不冒充 ready，并在 authority 到达后承接 selected smoke。 |
| 每个环境依赖哪些服务？ | P0 无真实 owner 服务硬依赖；使用 public shared types/SDK boundary、formal-shaped fake Ports、volatile carrier、host/a11y/sink fakes、strict config fixture。 |
| 哪些配置影响结果？ | 恰好四项：`runtime.profile`、`bindings.adapterBindings`、`invalidation.enableSdkInvalidation`、`diagnostics.enableDiagnostics`；均 startup-only。 |
| 哪些依赖需要 fake？ | 所有 runtime owner/host/carrier/sink seam 在 local/CI 用 recording fake；selected real-like 只在 exact contract/环境 authority 到达后。 |
| 环境不可用如何处理？ | P0 mandatory harness/config 无法装配→blocked/fail-fast，不能 skip-pass；selected/P1 环境不可用→`not_run_environment_unavailable` + residual risk，不能贡献 EV。 |
| 哪些允许 path dependency？ | 测试不在 05 固定 filesystem path；compile 只允许正式 `L0-sdk`/批准 shared package boundary，禁止 L1～L6 sibling source/path import。 |
| runtime/event 如何协作？ | owner/host 经 narrow fake/controlled/real-like Ports；SDK invalidation 是可选 `[event]` seam，当前 disabled/pending-contract，不能做 event replay positive。 |

## 4. 环境拓扑图：L5-console Planned Test Environments

```text
                         [L0-sdk / approved shared public types]
                                      |
                                      | [compile]
                                      v
 [test runner / semantic harness] -> [L5-console planned modules]
             | [runtime]                       | [runtime]
             v                                 v
 [host-route-focus-announce fake]   [narrow formal-shaped Port registry]
             |                                 |
             | [runtime]                       | [runtime]
             v                                 v
 [session-volatile carrier fake]    [owner-partition fakes / selected real-like]
                                               |
                                               | [event, optional]
                                               v
                                  [SDK invalidation seam: currently disabled]

 L1/L2/L3/L4 owners and other L5/L6 products:
   -> no [compile] sibling source/path dependency
   -> [runtime] only through SDK/formal narrow Ports
   -> no private DB/repository/bus/BFF access
```

## 5. 环境矩阵

| 环境角色 | 用途 | 依赖 | 类型 | 协作方式 | profile/四项配置 | 数据 | 风险/不可用处理 |
|---|---|---|---|---|---|---|---|
| local pure/flow | factory、state、flow、fake parity、语义 a11y 调试 | public types、in-process fake registry、volatile carrier、host/sink fake | compile + runtime fake | builder/table/recording fake | `local-fake`; bindings 可为批准 fake refs；flags 默认 false | DS-CON pure/state/Port/config | 非正式 evidence；harness 缺失即不可运行，不写 pass |
| CI deterministic P0 | 96 TC 的可重复 unit/flow/contract/composition/semantic/static suites | 同 local + scheduler/call ledger/generated graph | compile + runtime fake；event disabled | isolated fake/container/generated graph | `local-fake`; explicit test JSON；必要 case 参数化 flags，但须满足 04 cross-field | 全部 P0 DS，case/run 隔离 | P0 future blocking；配置/runner失败不能 fallback/skip-pass |
| controlled integration | adapter registry、owner partition failure、pending profile、selected formal facet parity | approved SDK/formal seam、controlled host/carrier；owner services 可为 controlled fake 或 selected real-like | runtime；optional event | fake/controlled；formal exact facet 到达后 selected real-like | `integration-pending`; flags默认false；仅闭合 slot 可 binding | formal contract-derived + negative DS | profile 本身不 ready；缺 exact contract 的 positive case blocked |
| release-candidate simulation | production-pending fail-closed、whole-document/rollback、minimal smoke、report/evidence assembly 输入 | immutable strict doc、approved harness、static/redaction checks | runtime + release simulation | controlled composition；无 fake 冒充 production | `production-pending`; flags默认false；未批准 slot 不绑定 | run-scoped planned data，无 real secret | 当前只证明 pending/minimal；不得产生 production readiness |
| selected browser/AT | 具体兼容组合上的 C1～C6 semantic paths | future browser/AT authority + host adapter | runtime environment | selected real-like/manual-assisted automation | existing profile chosen per approved plan；不新增 profile | safe synthetic DS | `CON-Q-046` 未闭口，当前 `not_run/blocked` |
| quantitative/load | 有界 fan-out/延迟/负载测量 | future environment/window/owner authority | runtime | controlled/real-like | existing profile + future non-config test parameters | synthetic safe workload | `CON-Q-045` 未闭口；无 pass threshold |

## 6. 依赖类型与测试协作判定

| 依赖对象 | 全局类型 | compile/path 是否允许 | P0 协作 | Positive selected 条件 | 失败姿态 |
|---|---|---|---|---|---|
| `L0-sdk` / approved shared public types | compile + formal runtime boundary | 仅正式 package boundary；05 不固定 path | type/contract fixture + narrow adapter fake | published/approved exact surface | missing surface→blocked |
| identity/member/Policy/Gate | runtime | no sibling path/source | context/visibility/qualification/member partition fake | exact safe contract | identity-critical fail-closed |
| work/process/workspace | runtime | no | three independent partition fakes | exact safe read/ref | partition-local partial/unavailable |
| method/governance/artifact | runtime | no | safe status/ref partition fake | exact read/command contract | read-only/blocked；无 body/verdict |
| observability | runtime | no | safe query refs + diagnostic sink disabled/fake | exact query/sink envelope | view local degrade；sink failure isolated |
| capability/archive/sandbox | runtime | no | independent pending/blocked fakes | exact owner surface | local partition blocked/partial |
| browser host/a11y | runtime output | N/A | deterministic route/present/focus/announce fake | browser/AT matrix authority | equivalent fallback or blocked |
| client state medium | runtime local | N/A | in-memory session-volatile fake | medium authority/design change | unavailable→minimal/reload |
| SDK invalidation | optional event | no private bus | disabled/pending-contract | envelope/order/dedup authority | zero-write, explicit Query retained |
| other L5/L6 | future runtime link/ref | no | disabled/no mainline dependency | both sides formal stop-reviewed contract | pending;不影响核心 P0 |

## 7. 四项配置测试矩阵

| 配置 | local/CI | integration-pending | production-pending | 关键 TC | 失败语义 |
|---|---|---|---|---|---|
| `runtime.profile` | required=`local-fake`; missing/bad enum negative | required exact value；不等已集成 | required exact value；不等可发布 | CONFIG-001/002/005 | missing/invalid whole reject，no default |
| `bindings.adapterBindings` | default `[]`;批准 fake refs可显式列 | only formally closed/controlled slot refs；其余 absent/pending | only approved refs；fake/test ref 禁止冒充 | CONFIG-001/004～006 | duplicate/mismatch/bad ref/partial whole reject or mandatory fail-closed |
| `invalidation.enableSdkInvalidation` | default/normal `false`; true negative gate | default false；true without contract reject/blocked | false until approved contract | CONFIG-007;ADAPTER-005/006 | disabled zero-write；no silent observed path |
| `diagnostics.enableDiagnostics` | default false；approved local fake may test true | false unless approved controlled sink | false until production envelope/sink authority | CONFIG-008;DIAG-* | disabled/failed isolated；no raw body/audit claim |

### 7.1 Source 与生命周期矩阵

| 场景 | 输入 | 预期 |
|---|---|---|
| defaults only | `[]/false/false`，无 profile | bootstrap fail-fast；不得隐式 local-fake |
| valid external document | one strict JSON + optional defaults | whole typed config once at startup |
| invalid higher-precedence field | bad type/key/ref/profile | whole reject；不回落 default |
| two documents/leaf env override/URL/DOM/storage | unsupported source | reject/not consumed；不建立 overlay priority |
| runtime document change | already started runtime | no hot patch；new runtime requires whole validation |
| rollback | previous approved document | revalidate whole document；无 online LKG/hot leaf rollback |

## 8. TC / Suite Environment Allocation

| TC family | 最小 P0 环境 | 辅助环境 | 当前不可执行环境声明 |
|---|---|---|---|
| CTX/NAV/VIEW/INTENT/RECOVERY/STATE | local + CI `local-fake` | controlled integration selected facets | exact owner positives blocked |
| TOPIC/ADAPTER/CONSISTENCY | CI controlled fakes | integration-pending controlled/selected | full real-owner E2E not P0 |
| DIAG/SEC/CONFIG | CI + release simulation | integration selected sink | production sink blocked |
| A11Y semantic | CI semantic harness | selected browser/AT | concrete compatibility blocked |
| ARCH | CI generated graph once implementation exists | release summary | target repo currently absent |
| consumer disabled | CI `local-fake`/integration-pending | none | observed event branch blocked |
| performance structural | CI scheduler/call ledger | future quantitative | numeric thresholds blocked |

## 9. 环境不可用与降级矩阵

| 不可用项 | P0 处理 | Evidence 资格 | 禁止处理 |
|---|---|---|---|
| runner/harness/target repo absent | planned/blocked；不执行 | none | 手写 pass/coverage |
| local/CI mandatory fake/config cannot build | future gate fail-fast | failure artifact only when real run exists | skip 并 pass |
| one controlled owner adapter unavailable | local partition unavailable/partial；其余继续 | integration artifact when run | global normal 或 sibling success 掩盖 |
| formal positive contract absent | execute safety/no-call case；positive case blocked | safety case only | fake success 冒充 formal integration |
| selected real-like environment unavailable | mark `not_run_environment_unavailable` + residual | no positive EV | 用 P0 fake EV替代 selected result |
| diagnostic sink unavailable | disabled/failed，business unchanged | diagnostic isolation result only | 解释为 owner failure/audit missing |
| browser/AT matrix absent | semantic suite still planned；compatibility blocked | semantic EV only | 宣称具体兼容 |
| quantitative authority absent | structural boundedness only | structural EV only | 套旧阈值判 pass |

## 10. 跨环境审计

| 审计项 | 结论 | 依据 / 修正 |
|---|---|---|
| profile 是否恰好三个且逐字一致 | pass | `local-fake/integration-pending/production-pending` |
| 是否另造 ci/staging profile | pass | CI/staging 仅环境角色 |
| 四项 config/default/lifecycle 是否与 04 一致 | pass | §7/§7.1 |
| compile/runtime/event 是否明确 | pass | §4、§6 |
| 是否允许 sibling source/path dependency | pass | 禁止；只经 formal runtime seam |
| P0 是否依赖真实 DB/bus/owner service | pass | no；fake/controlled |
| invalidation 是否被误写成 active event replay | pass | disabled/pending-contract |
| production-pending 是否被改写 ready | pass | 仅 fail-closed/minimal simulation |
| environment unavailable 是否可 skip-pass | pass | 明确禁止 |
| secret/body 是否进入 config/test env | pass | zero raw secret；synthetic isolated leak only |
| concrete browser/AT/quantitative 是否伪覆盖 | pass | blocked/conditional |

## 11. 上游影响、回填与门禁

| 结论 | 处理 |
|---|---|
| 当前环境矩阵可由正式 01/03/04 推导 | 无上游回写 |
| CI/runner/script/tool 未选择 | Step 9 只定义 planned boundary/CLI contract，不宣称工具存在 |
| selected formal/browser/quantitative 环境缺 authority | Step 10/14 保持 residual/blocked |
| future runtime 需要新 profile/key/source | 必须先重开 03/04，不能在测试环境私加 |

正式 §8 应回填拓扑、环境矩阵、dependency classification、四项配置矩阵、TC allocation 与 unavailable posture。

> 校准来源：`design-calibration/05_test_plan_step_08_environment_config.md`
>
> 延伸阅读：建议继续阅读本文件的“环境拓扑图”“环境矩阵”“依赖类型与测试协作判定”“四项配置测试矩阵”和“环境不可用与降级矩阵”。

| 进入 Step 9 条件 | 结论 |
|---|---|
| P0 planned 自动化/语义测试环境可定位 | pass |
| 依赖类型/替身/配置可定位 | pass |
| blocked selected 环境不伪 pass | pass |
| 跨环境审计无冲突 | pass |
| 可进入 Step 9 | pass |

Step 8 `done / pass / self_reviewed`；未建立或验证任何真实环境。
