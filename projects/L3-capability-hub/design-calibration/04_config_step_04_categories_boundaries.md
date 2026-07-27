# L3-capability-hub 04 配置设计 Step 4：配置分类与禁止配置化边界

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 4
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §4
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_04_completed_continuous_execution`

---

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 `定义配置分类与禁止配置化边界` |
| 输入基线 | 04 Step 1~3；active formal 00~03；DDD Step 14/15 canonical binding and observer boundary |
| 本步产物 | 配置分类、加载/冻结边界、禁止配置化清单、CP-01~CP-10 逐域分类、停审和跨分类审计 |
| 当前结论 | completed；所有 27 个 canonical row 仍由 startup root 一次加载并校验，P0 不支持进程内热更新 |
| 03 影响 | `无回写`；新增/删除/合并 typed field、binding kind、Port、flow、state 或 error 均为 0 |
| 上游 blocker | 0 |

## 2. 本步目标、输出与限制

本 Step 在 Step 3 的十个控制面上定义配置类别和可执行红线，先回答“什么可以被 operator 调整”，再允许 Step 5 讨论来源和覆盖关系。

本步必须闭合：

1. 区分设计不变量、启动配置、运行作用域视图、技术策略、敏感引用、诊断、fixture 和外围依赖启停。
2. 区分 raw source 的加载时机与 typed value 的作用域冻结时机。
3. 明确 hot reload、per-run dynamic override 和 admin override 当前均不存在。
4. 把安全、事务、一致性、协议、状态、truth owner 和责任边界逐项列为禁止配置化项。
5. 对 CP-01~CP-10 逐域标明适用类别、不适用类别和禁止能力。
6. 给出禁止项变化时的受控设计变更路径。

本步不定义 raw key、JSON path、环境变量名、来源优先级、数值默认、secret provider、profile 实值、产品、部署命令或配置加载函数。这些分别留给 Step 5~10 和正式 09 运维文档。

## 3. 本步输入

| 输入 | 本步使用方式 | 权威边界 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | 保持 active/historical input 隔离 | old 05/06/README 不得反向定义类别 |
| `04_config_step_02_scope.md` | 承接 P0/P1/P2 和 27/27 P0 schema obligation | 不把 P2 hot reload/config center 重新引入 |
| `04_config_step_03_control_plane.md` | 承接唯一 raw reader、builder、CP-01~CP-10 和配置域 | 不改变 owner 或新增 control plane |
| `03-详细设计.md` §10~§14 | 承接状态、事务、重试、binding、profile、observer 红线 | 27-row typed surface 不拆、不并、不扩 |
| `03_ddd_step_14_config_external_binding.md` §§14~16、145~148 | exact config root、entry parameters、binding states、Stage 0~7 | config 只做 raw/operator-facing 转译 |
| `03_ddd_step_15_observability_audit.md` §§123~150 | `Off/Redacted`、allowlist、observer failure | 不产生 raw/full/verbose 或 evidence authority |
| formal `00/01/02` | responsibility、truth、dependency、data-body exclusions | 不通过配置改变需求或架构 |
| L1-governance / L3-method-library Step 4 | 结构和停审粒度参考 | 不继承其业务 key、TTL、feature 或 policy |

## 4. SOP 问题回答

| SOP 问题 | L3-capability-hub 回答 |
|---|---|
| 有哪些启动、运行时、策略、敏感和调试配置？ | 采用九类：`static design boundary`、`startup runtime config`、`invocation-scoped frozen view`、`entry-local technical parameters`、`policy-like technical knobs`、`sensitive reference config`、`diagnostic/redaction config`、`deterministic fixture config`、`peripheral dependency enablement`。第一类不是配置项；其余类别都必须映射回 27-row typed surface，不能形成自由扩展区。 |
| 哪些允许热更新？ | 当前无任何 P0 配置允许进程内热更新。raw source 只在 startup 读取；改变配置必须构造新进程和新 runtime graph。Jobs 每次 `run_once` 使用启动时形成的 immutable typed parameters，不重新读取或覆盖配置。 |
| 哪些只能冷更新或启动读取？ | 27/27 canonical rows、27 local/base Port binding、9 external slots、6 Worker sources、10 routes、profile、entry、technical policy 和 diagnostic mode 全部 startup-only。 |
| 哪些规则禁止配置化？ | capability truth/state、registry/descriptor semantics、governance approval、method body、formal exposure rule、protocol/state/transaction/idempotency/event identity、runtime/tools execution、marketplace、SDK product、provider route/quota/cost、secret/raw body、delivery lifecycle、Job business identity、Query no-write 和 evidence/signoff 均禁止。 |
| 禁止项如需改变走什么流程？ | 先定位 formal 00/01/02/03 owner，创建受控 reopen，修改对象/协议/flow/state/transaction/Port 时先更新 03 并完成 Rustdoc 门禁，再顺序同步 04/05/06/07/09。配置审批不能替代设计变更。 |
| 每个配置域适用哪些类别？ | §8.4 对 CP-01~CP-10 逐域闭合；所有域都以 startup config 为加载基础，其他类别只是语义标签或消费视图，不是第二加载通道。 |
| 禁止项是否回指上游不变量？ | §8.3 每项回指 formal 00~03 或 DDD Step 14/15；没有只凭本 Step 新增的红线。 |
| 每域是否完成停审？ | §9 对十个控制面逐项检查类别、冻结时机、禁止面和 03 影响，10/10 pass。 |
| 是否存在跨域分类冲突或遗漏？ | §10 审计后 unresolved=0。retry/timeout/page limit 只属于 technical policy；binding `Disabled` 只表达外部依赖显式不可用，不等于关闭核心业务语义。 |

## 5. 当前问题诊断

| 位置 | Step 4 前的缺口 | 本步处置 |
|---|---|---|
| Step 3 source chain | 已知 startup root immutable，但未区分加载与 invocation 使用时机 | 固定“一次启动加载，多处 typed frozen view”，禁止 per-run reread |
| 27-row catalog | 有 owner/presence/failure，尚无类别标签 | 以 row group 映射九类，不改变 typed shape |
| Jobs parameters | `run_timeout/runner_retry` 作用于一次 run，易误读为 per-run config source | 明确 run-scoped consumption 不等于动态来源或 override |
| binding states | `Disabled` 容易被泛化成 feature flag | 限定为 exact named external Port/source 的闭集 binding decision |
| technical policy | retry/timeout 容易被误解为 governance/runtime policy | 固定为 body-free technical guard，不拥有 approval、routing 或 business policy |
| diagnostic mode | `Redacted` 易被误解为可调字段列表 | allowlist 由 DDD Step 15 固定，配置只能选 `Off/Redacted` |
| compatibility row | typed binding 易被误解为算法 selector | 只允许声明固定 `StableSurfaceV1 + Sha256V1`，任何其他值启动拒绝 |
| historical material | 旧 provider/cost/runtime/listing 口径可能被包装成配置项 | 全部列为禁止项或 historical pollution，不进入 Step 5/7 |

## 6. 改动前后对比

| 维度 | Step 4 前 | Step 4 后 | 目的 |
|---|---|---|---|
| 配置类别 | 十个控制面和功能域 | 九类语义分类，且第一类明确不是配置 | 为来源/清单提供边界 |
| 生效时机 | process-lifetime immutable 的总原则 | design-time、startup load、invocation frozen use 三层 | 防止私造 reload/override |
| Jobs 参数 | startup validated + run use | 明确“startup source，per-run frozen consumption” | 避免第二配置权威 |
| Disabled | 外部 slot/source 状态 | exact peripheral binding decision，不是 generic feature flag | 防止关闭核心流程 |
| 禁止面 | 分散在 00~03 | 一张可执行变更路径表 | 后续 key catalog 可逐项反查 |
| 详细设计影响 | Step 3 无回写 | 本步仍无回写，未来 typed delta 必须回开 | 保持 03 为代码契约真相源 |

## 7. 配置设计取舍

| 议题 | 候选 | 裁决与原因 |
|---|---|---|
| P0 hot reload | A. 配置中心推送；B. restart only | 采用 B。03 没有 watcher、atomic graph swap、last-known-good 或 reload audit contract。 |
| Jobs run 参数来源 | A. 每次 run 重读 env/file；B. startup typed parameters 的 run-local frozen use | 采用 B。只有 `infra/config.rs` 可读 raw source。 |
| feature flag | A. generic flags map；B. exact closed binding decision | 采用 B。generic map 会绕过 27 rows、unknown-field rejection 和 Rustdoc。 |
| compatibility | A. runtime selectable codec/hash；B. fixed assertion | 采用 B。`StableSurfaceV1 + Sha256V1` 是互操作不变量。 |
| technical policy | A. 可覆盖 business/governance policy；B. 只调 bounded retry/timeout/page | 采用 B。approval、truth、state 和 route choice 不属于 technical policy。 |
| sensitive material | A. raw secret in root；B. symbolic ref only | 采用 B。raw value 只存在于具体安全设施和 adapter-local resolved material。 |
| diagnostics | A. raw/full/verbose；B. `Off/Redacted` | 采用 B。field allowlist 不是 operator 可编辑配置。 |
| fixture | A. dependency failure fallback；B. explicit Local/Integration eligibility only | 采用 B。Deployment fake=0，运行失败不能降级为 fake success。 |

## 8. 结构化中间产物

### 8.1 配置分类表

| 类别 | 定义 | 27-row / binding 示例 | 加载与冻结 | 热更新 | 主要风险 |
|---|---|---|---|---|---|
| `static design boundary` | 不可配置的需求、架构和详细设计不变量 | truth owner、83 protocol、24 state family、UoW ordering | 仅设计变更 | 不适用 | 被伪装成 flag 后绕过正式设计 |
| `startup runtime config` | 构造 immutable root 和 Stage 0~7 graph 的 typed 配置 | rows 1~27 全集 | startup 一次读取、校验、冻结 | 否 | partial graph、跨 profile fallback |
| `invocation-scoped frozen view` | 从已验证 root 复制/借用到当前 entry/invocation 的只读 view | API/Worker/Jobs parameters、technical policy | 不读取 raw source；生命周期内只读 | 否 | 被误作 per-request/per-run override |
| `entry-local technical parameters` | 只由选中 entry 消费的技术上限与 deadline | rows 8~14、19~22 | startup 验证；对应 entry 使用 | 否 | 混入业务 scope、target、protocol identity |
| `policy-like technical knobs` | 有界且不改变业务语义的执行参数 | rows 23~26；rows 10/14/21/22 | startup 验证；wrapper/phase 使用 | 否 | 盲重试、取消 future、改变终态 |
| `sensitive reference config` | 只保存符号 ref 与非敏感连接约束 | configured adapter/feed/route credential/TLS refs | startup resolve；adapter-local retention | 否 | raw secret、token、cert body 泄露 |
| `diagnostic/redaction config` | 只选择既有安全观测模式 | row 27 `Off/Redacted` | startup freeze | 否 | operator 放宽 allowlist 或产生第二 authority |
| `deterministic fixture config` | 显式可复现 fake、clock、ID、compatibility fixture | Local/Integration eligible fake bindings | startup explicit binding | 否 | Deployment fake 或 failure fallback |
| `peripheral dependency enablement` | exact named external Port/source 的 Configured/Fake/Disabled 闭集决定 | row 5、row 15、configured collaboration routes | startup complete predicate | 否 | generic feature flag 改变核心 accepted path |

分类规则：一个 row 可以有一个 primary loading class 和多个 cross-cutting tag。例如 configured external Port 同时属于 `startup runtime config`、`sensitive reference config` 和 `peripheral dependency enablement`，但仍只有一个 raw-reader 和一个 typed owner。

### 8.2 加载、生效与变更边界

| 时机 | 允许事项 | 禁止事项 | 生效方式 |
|---|---|---|---|
| design-time | 修改正式需求/架构/对象/协议/state/flow/config typed schema | 以 JSON/env/profile 代替设计修改 | 受控 reopen + 文档/实现变更 |
| process startup | 读取有限 source、构造 candidate、聚合 issue、形成 immutable root 和完整 graph | partial activation、Missing fallback、unknown extension | 新进程通过 Stage 0~7 后首次 exposure |
| entry construction | 从 root 生成恰好一个 API/Worker/Jobs typed handoff | entry 读取 raw source、混合三个 entry variant | startup graph 内完成 |
| invocation use | 使用已冻结参数限定 bytes/page/deadline/retry/scan | request/env/host scheduler 覆盖 root | 当前 invocation 只读使用 |
| Job run start | 对该次 `run_once` 借用/复制 startup-validated Jobs parameters | 重读文件/env/secret、改 target/scope/run/key | 新 invocation 使用同一 immutable graph |
| config change | 准备新 source material 并启动新进程 | in-place mutation、watcher push、admin override | restart 后重新完整校验 |

### 8.3 禁止配置化项与变更路径

| 禁止配置化项 | 原因 / exact redline | 权威来源 | 如需改变 |
|---|---|---|---|
| capability identity、registry、descriptor truth/state/guard | Hub-owned truth 与合法状态不可由 operator 跳转 | formal 00~03 §§6~10 | 回开 00/01/02 和 DDD object/flow/state Steps |
| governance approval、Policy、workflow truth | Hub 只保存 seam/reference，不批准 | formal 00 §10；03 §13.4 | 先改跨仓责任与协议，再同步全链 |
| method asset body/source/lifecycle | Hub 只保存 body-free relation/ref | formal 00/01；03 §13.4 | 回开责任、Port、protocol、data boundary |
| formal exposure/visibility applicability rule | 是 typed policy/guard，不是 allowlist config | 03 §§8~10、13 | 回开 object/protocol/flow/state |
| runtime/tools execution 与 tool result | 属下游执行仓 | formal 00/01；03 §13.11 | 需求/架构责任变更，不得新增 execution flag |
| marketplace listing/ranking/pricing/transaction | Hub 只供只读派生材料 | formal 00/01；03 §13.11 | 回开需求与 bounded context |
| SDK package/client/cache/release | SDK 是下游 exposure consumer | formal 00/01；03 §13.11 | 回开跨仓责任，不得以 SDK enable flag 合并 |
| provider route/quota/cost/failover | 不是 capability access truth | formal 00 exclusions；03 §13.1 | 新责任先走需求/架构，不进入 adapter refs |
| raw secret/token/password/private key/cert body | root 只持 symbolic ref | formal 00 security；03 §13.4 | 只可更换安全设施 binding；body 仍不得进入 Hub |
| external document/method/audit/evidence body | body-free data boundary | formal 00/01；03 §§13.4、14 | 先回开数据所有权与安全边界 |
| 83 protocol identity/schema/DTO fields | public contract 不能由 runtime config 改写 | 03 §§8~9 | 回开 DDD protocol/flow，完整 Rustdoc 后同步 04 |
| 24 state families、111 variants、638 transition pairs | 状态合法性是 domain invariant | 03 §10 | 回开 object/state/flow/error |
| UoW order、single authority `A`、CAS/commit resolution | 事务/一致性不能按 profile 弱化 | 03 §§11、13.3 | 回开 Port/transaction/recovery design |
| idempotency key/digest/winner/replay | duplicate 与 accepted result authority 固定 | 03 §§9、11、13 | 回开 protocol/concurrency/transaction |
| event name/schema/payload/source/digest/capture/stable intent | route 只能映射物理目的地 | 03 §§9、13.7 | 回开 event/protocol/flow/transaction |
| source family/event/schema/trusted actor consumer mapping | feed/topic/credential 不能推导 logical identity | 03 §13.6 | 回开 Inbound protocol/source binding |
| queue/lease/ack/attempt/DLQ/outbox relay/TTL/cleanup | local delivery lifecycle 非 Hub truth | formal 01；03 §§13.6~13.8 | 新责任需需求/架构批准，不得加配置项 |
| Job kind/schema/run/key/scope/targets/journal/serial ordinal | host scheduler 不能定义业务身份或终态 | 03 §§13.8、9~11 | 回开 Job protocol/flow/state/transaction |
| Query no-write 与 page semantics | Query 不能因 profile/diagnostic 写入或改变真相 | 03 §§8~11 | 回开 protocol/flow/transaction |
| observer allowlist、business outcome、evidence/signoff | observer 非业务 authority，04 不生成真实证据 | 03 §14；DDD Step 15 | 回开 observability Step 15；验收签署仍归 06/执行期 |
| codec/hash algorithm、canonical field order | 固定 `StableSurfaceV1 + Sha256V1` | 03 §§13.2、13.10 | compatibility 设计迁移，不是 runtime selector |
| Cargo dependency graph / crate feature set | 编译依赖由详细设计/实施边界拥有 | 03 §§3、13.11 | 回开 DDD dependency binding 和 07 |

### 8.4 按控制面的分类边界

| 控制面 | 适用类别 | 加载/冻结 | 明确不适用 | 核心禁止项 |
|---|---|---|---|---|
| CP-01 root/profile/entry | startup、invocation frozen view | startup；one entry handoff | hot reload、tenant/region overlay | implicit Deployment、new entry/protocol |
| CP-02 local authority | startup、fixture | startup；process lifetime | entry-local override、per-run store | second authority、weaker fake semantics、TTL |
| CP-03 clock/id/compatibility | startup、fixture；compatibility assertion | startup；process lifetime | runtime algorithm selector | fallback clock/ID、hash/codec choice |
| CP-04 API entry | entry-local technical、technical knob、frozen view | startup；each call reads fixed values | request-driven global override | cancellation/detach/redispatch、Query write |
| CP-05 Worker entry/source | startup、entry-local technical、sensitive ref、fixture、peripheral | startup；source tasks fixed | delivery-local config lookup | event/schema/actor inference、queue/lease/ack |
| CP-06 external Ports | startup、sensitive ref、fixture、peripheral | startup constructor; adapter-local resolved material | call-time discovery/fallback | family merge、body/execution/approval/listing |
| CP-07 Outbound routes | startup、sensitive ref、peripheral | startup；10/10 route set | wildcard/dynamic routing | envelope/digest/state/intent mutation |
| CP-08 Jobs entry | entry-local technical、technical knob、frozen view | startup source；per-run read-only use | per-run raw reread、host override | scheduler identity、target parallelism、entry auto-retry |
| CP-09 recovery policy | policy-like technical knob、frozen view | startup；exact phase use | generic/blind retry | text parsing、mutation after unknown commit |
| CP-10 diagnostics | diagnostic/redaction、startup | startup；private observer use | raw/full/verbose、editable allowlist | outcome/state/evidence/signoff authority |

## 9. 分类边界停审记录

| 配置域 / 禁止项 | 类别与时机 | 禁止面可执行 | 03 影响 | 结论 |
|---|---|---|---|---|
| CP-01 | startup/root only | exact entry/profile gate | none | pass |
| CP-02 | startup/fake eligibility | one authority and parity fixed | none | pass |
| CP-03 | startup/fixture/assertion | no algorithm/time/id fallback | none | pass |
| CP-04 | startup source/invocation view | no cancellation or Query write | none | pass |
| CP-05 | startup source/task freeze | no delivery lifecycle truth | none | pass |
| CP-06 | startup constructor/ref | no execution/body/approval | none | pass |
| CP-07 | startup complete route set | route-neutral event identity | none | pass |
| CP-08 | startup source/run-local use | no scheduler business authority | none | pass |
| CP-09 | startup typed policy/phase use | no blind retry or text classifier | none | pass |
| CP-10 | startup `Off/Redacted` | no editable allowlist/business effect | none | pass |

## 10. 跨分类 / 禁止项审计

| 审计项 | 结果 | 修正 / 固定规则 |
|---|---|---|
| 27-row category coverage | 27/27 covered by startup runtime config | no split/merge/new row |
| raw-reader count | 1 | only `infra/config.rs` |
| dynamic source count | 0 | no config center/admin/per-run reread |
| hot-reloadable P0 items | 0 | restart required |
| generic feature flag | 0 | only exact binding decisions |
| Jobs source ambiguity | closed | startup-loaded, invocation-frozen |
| compatibility selector | 0 | fixed assertion only |
| Deployment fake fallback | 0 | fake count must remain 0 |
| secret value in root | 0 | symbolic ref only |
| business/governance policy config | 0 | technical knobs only |
| protocol/state/transaction override | 0 | design-time reopen only |
| runtime/tools/marketplace/SDK responsibility leakage | 0 | downstream/other-owner boundary preserved |
| observer/evidence authority leakage | 0 | `Off/Redacted`, no signoff/evidence claim |
| control-plane category conflict | 0 unresolved | primary loading class + cross-cutting tags |
| 03 writeback gap | 0 | no typed/code-contract delta |

## 11. 对 03 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 九类只对现有 27 rows / bindings 作语义分类 | 否 | config-only classification | formal 03 §13；DDD Step 14 | 无回写 |
| 全部 raw source startup-only，P0 无 hot reload | 否 | existing lifetime restatement | formal 03 §13.1、13.9 | 无回写 |
| Jobs 为 startup source + per-run frozen use | 否 | owner/lifetime clarification | formal 03 §13.8；DDD Step 14 Jobs binding | 无回写 |
| Disabled 不是 generic feature flag | 否 | closed binding semantics | formal 03 §§13.4、13.6~13.7 | 无回写 |
| 禁止项变化必须受控 reopen | 否 | change-control gate | originating formal 00~03 section | 无回写 |

Impact audit: `待回写=0`；`阻塞待确认=0`。本步新增 Rust declaration/struct/field/enum/variant/trait/method/callable=`0`，因此没有新增注释缺口。未来任何新增或修改的 public declaration、struct field、enum variant/payload field、trait/method/callable 都必须有英文 `///`，并先回写 03。

## 12. Formal §4 回填草稿

正式 §4 应保留：九类配置表、加载/生效边界、禁止配置化项与 CP-01~CP-10 分类矩阵。正文必须明确：

- `CapabilityRuntimeConfig` 是 startup 构造的 process-lifetime immutable root。
- invocation-scoped view 不是新的来源或 override；Jobs 也不在 run start 重读 raw config。
- 当前没有 hot reload、config center、admin override、tenant/region overlay 或 generic feature flag。
- `Configured/DeterministicFake/Disabled/Missing` 只用于 exact named binding；`Disabled` 不关闭核心 truth/protocol。
- technical policy 只约束已允许的 retry/timeout/page/scan，不拥有 governance、routing、state 或 failure reclassification。
- 禁止项变化必须回到上游正式设计，不能在配置审批中绕过。

正式 §4 不得提前写 Step 5 的来源优先级、Step 7 的 raw key/default 或 Step 8 的具体 secret provider。

## 13. 待确认事项与下一步门禁

| 事项 | 当前状态 | 是否阻塞 Step 5 | 后续处理 |
|---|---|---|---|
| concrete durable store / adapter / secret / observer product | unselected | no | Step 5/7 只写 product-neutral source/ref；选型触发受控 binding review |
| raw source precedence and duplicate conflict | pending by design | no | Step 5 exact closure |
| Local/Integration/Deployment item matrix | pending by design | no | Step 6 exact closure |
| exact keys/defaults/bounds | pending by design | no | Step 7 exact closure |

进入 Step 5 的条件审计：

| Gate | 结果 |
|---|---|
| 配置类别已明确 | pass；9 categories |
| 冷/热更新边界已明确 | pass；startup-only，hot reload=0 |
| 每域适用/不适用类别已明确 | pass；CP-01~CP-10=10/10 |
| 禁止配置化项有来源和变更路径 | pass；22 rows |
| 跨分类 unresolved conflict | 0 |
| 03 pending writeback / blocker | 0 / 0 |

```text
document = 04-配置设计.md
step = 4
status = 04_step_04_completed_continuous_execution
configuration_categories = 9
control_plane_reviews = 10/10
canonical_rows_preserved = 27/27
hot_reloadable_p0_items = 0
dynamic_raw_sources = 0
detailed_design_writeback = none
unresolved_upstream_blocker = none
next_allowed_action = complete_04_step_05_sources_priority_conflicts
commit_required = no
```
