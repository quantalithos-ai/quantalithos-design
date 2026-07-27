# L3-capability-hub 04 配置设计 Step 2：目标、范围与非范围

> 对应 SOP: `standards/document/配置设计讨论流程_SOP.md` Step 2
> 回填章节: `projects/L3-capability-hub/04-配置设计.md` §2
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 状态: `04_step_02_completed_continuous_execution`

---

## 1. Step 目标与输入

| 项目 | 内容 |
|---|---|
| 目标 | 确定本轮 04 覆盖的配置控制面、P0/P1/P2 口径和每个非范围的下游 owner |
| 直接输入 | Step 1 上游映射；formal 00 §4；formal 03 §§2、13、17；DDD Step 14 §§138~148 |
| 输出 | 配置设计目标表、P0/P1/P2 矩阵、范围/非范围、残余风险、对 03 影响判定 |
| 不做 | 不定义 exact raw key、数值默认、source precedence、JSON demo、secret schema 或 product selection |

## 2. SOP 五问回答

| SOP 问题 | 收口答案 | 边界 |
|---|---|---|
| 1. P0 必须定义哪些配置？ | root schema/profile/entry、single local persistence、clock/ID/compatibility、selected entry limits/deadlines、9 external slots、Worker 6 sources/feed/actor、Outbound 10 routes、Jobs parameters、external/contention/commit retry、internal scan、diagnostics。即 27/27 canonical rows 全部是 P0 schema surface；profile 可以决定某些 external slot 显式 Disabled，但不能删除 row | P0 意味“实现必须理解并验证”，不意味每个 external product 必须已部署 |
| 2. 哪些属于 P1/P2？ | P1 是在不改 typed contract 前提下绑定 durable persistence、real external adapters/feed/routes、TLS/credential refs、observer backend 和 Integration/Deployment 真实材料。P2 是 multi-region/tenant overlay、config center/admin override、hot reload、dynamic failover、vendor-specific capability、advanced capacity tuning；当前均不授权 | P1 需产品兼容审查；P2 需先重开需求/架构/详细设计 |
| 3. 哪些留给部署与运维？ | 实际文件放置/挂载、env injection、secret provider operation、cert install/rotation command、endpoint/destination 实值、container/service manager、rollout command、dashboard/alert/on-call/runbook | 04 仍定义这些值的 schema、敏感性、validation、change/rollback contract，但不写环境实值或操作命令 |
| 4. 哪些留给实施计划？ | target repo creation/preflight、implementation order、crate/file task、adapter product spike、commit boundary、command/check、evidence placeholder、rollback/pause 执行规律 | 04 交付 prerequisites 与 config gates，不提前创建 implementation ledger/boundaries |
| 5. 非范围有什么残余风险？ | product/backend 未选、target repo 缺失、L0-core 两项 debt、旧 05/06 未重建、P2 要求潜入 P0、实际 secret/endpoint 运维未准备 | 通过 controlled reopen、implementation prerequisite、downstream work 和 out-of-scope 分类，不伪造 closure |

## 3. 配置设计目标

| ID | 目标 | 说明 | 交付给下游的结果 |
|---|---|---|---|
| `CFG-G-01` | 建立唯一 operator-facing schema | 把 27 typed rows 组织为定义完整的 JSON root，不引入 extension map | 05 获得可组造正/反配置；07 获得 parser/builder 实施输入 |
| `CFG-G-02` | 闭合来源与冲突 | 定义 file/env/CLI 的允许面、优先级、duplicate/unknown/conflict 处理 | 05/06 获得 fail-fast 门禁；09 获得注入契约 |
| `CFG-G-03` | 闭合 profile 与 entry 矩阵 | 定义 Local/Integration/Deployment、API/Worker/Jobs 与四态 binding 的合法组合 | 05 获得环境矩阵；06 获得 Deployment 否决条件 |
| `CFG-G-04` | 闭合 adapter/source/route material | 为 9 external、6 source、10 route 定义 product-neutral endpoint/ref/TLS/credential/fixture 规则 | 07 获得绑定对象和 spike；09 获得真实环境填充边界 |
| `CFG-G-05` | 闭合 technical policy | 定义 body/page/timeout/retry/scan/diagnostic 的单位、范围、默认和 effect-safe 语义 | 05 获得 boundary cases；06 获得 invalid/unsafe veto |
| `CFG-G-06` | 闭合安全和红线 | 分离 raw secret 与 symbolic ref，禁止 body/credential 输出，保持 Off/Redacted | 05/06 获得泄漏负向用例/否决项；09 获得轮换操作边界 |
| `CFG-G-07` | 闭合 startup lifecycle | 定义 parse -> validate -> immutable root -> Stage 0~7 -> exposure，当前不支持 hot reload | 07 获得实施顺序；05/06 获得 startup/activation gates |
| `CFG-G-08` | 闭合 change/evolution handoff | 定义 review/audit/rollback、schema compatibility、deprecation 和 reopen | 07/09 获得 change discipline；05 获得 compatibility fixtures |

## 4. P0 / P1 / P2 口径

### 4.1 Priority semantics

| 级别 | 含义 | 是否进入当前 formal 04 | 是否代表已实现/部署 |
|---|---|---|---|
| P0 | 当前 typed contract 的 parser/validator/builder 必须明确理解的 schema 与门禁 | 是，完整定义 | 否 |
| P1 | 使真实 integration/deployment adapter/backend 可绑定的 product-neutral schema 与选型门禁 | 是，定义契约与待确认材料 | 否 |
| P2 | 未被 current requirement/architecture/DDD 授权的动态/多环境/高级运行特性 | 否，只写 reopen trigger | 否 |

### 4.2 Scope matrix

| 配置面 | 级别 | 当前 04 范围 | 不越过的红线 |
|---|---|---|---|
| root schema/profile/entry | P0 | version、root、one selected entry、unknown/duplicate rejection | 不动态选协议或业务 owner |
| local persistence | P0 schema; P1 product | one binding and authority、fake/durable eligibility、constructor material class | 不增 second store/session/replica guess |
| clock/ID/compatibility | P0 | exact binding、fixture class、fixed wire/digest version | 不允许 application/domain fallback |
| API parameters | P0 | request/page/call limits and non-cancelling semantics | 不以 timeout 取消/re-dispatch application |
| Worker parameters/sources | P0 schema; P1 transport | limits、deadlines、6 exact slots、feed/actor refs、fixture/Disabled | 不配置 event identity 或 delivery lifecycle |
| external Ports | P0 four-state schema; P1 products | 9 exact slots、configured refs/TLS/credential classes、fake/Disabled | 不合并 Port family 或引入 body/execution |
| Outbound routes | P0 completeness; P1 transport | 10 exact refs when collaboration Configured | route 不进 envelope/digest/state/intent |
| Jobs parameters | P0 | body/page/run/retry、one typed dispatch set | 不配置 scheduler truth/alias/auto-retry |
| technical retry/scan/commit | P0 | bounded unit/default/range and phase-specific owner | 不 generic retry、mutation retry 或 text classifier |
| diagnostics | P0 Off/Redacted; P1 backend | exact mode and safe sink binding class | 不 raw/full/verbose，不改 business result |
| multi-region/tenant overlay | P2 | excluded; trigger formal 00/01/03 reopen | 不在 raw key 中暗含 |
| hot reload/config center/admin override | P2 | excluded; current root is startup immutable | 不绕过 Stage 0~7 和 audit/rollback |
| provider failover/dynamic route/cost/quota | out of scope | never a Hub config surface | runtime/provider owner |

All 27 canonical rows remain P0 schema obligations even when a particular entry/profile does not consume their branch at runtime. Branch non-applicability is validated structure, not permission to omit the schema definition from formal 04.

## 5. 范围内交付物

| 范围内 | 完成形状 | 后续 owner |
|---|---|---|
| configuration control plane/domains | exact source/consumer/forbidden owner matrix | Step 3~4 |
| source/precedence/conflict | one deterministic overlay and duplicate/unknown policy | Step 5 |
| profile/environment matrix | Local/Integration/Deployment plus test-role mapping | Step 6 |
| full catalog | module JSON paths + 27 canonical trace + binding subcatalogs + JSONC examples | Step 7 |
| sensitive configuration | classification、symbolic ref、injection/rotation/audit/redaction | Step 8 |
| loading/validation/activation | startup algorithm、cross-field rules、Stage 0~7 | Step 9 |
| change/audit/rollback | cold-change review、versioned artifact、last-known configuration artifact (not runtime hot fallback) | Step 10 |
| failure/degradation | source/parse/validate/assembly/invocation/observer phase matrix | Step 11 |
| downstream handoff | exact 05/06/07/09 input tables | Step 12 |
| migration/evolution | schema v1、compatibility/deprecation/reopen rules | Step 13 |
| risks/open questions | product/debt/prerequisite/downstream/out-of-scope register | Step 14 |

## 6. 非范围与明确去向

| 非范围 | 不进 04 的内容 | Owner / 去向 |
|---|---|---|
| requirement/business authority | new capability semantics、approval/allow-deny、execution/listing/method body | formal 00/01/02 受控重开或 external owner |
| Rust/code contract | new field/variant/Port/error/DTO/flow/state/lifecycle | originating DDD Step + formal 03 |
| concrete product decision | final DB/broker/HTTP/KMS/observer vendor、crate/version/feature | ADR + DDD controlled reopen + formal 07 boundary |
| environment values | real endpoint、credential/cert ref value、topic/destination、filesystem path | deployment/operations manual §09 |
| deployment mechanics | config mount/injection command、service unit、container manifest、rollout | §09 |
| monitoring operations | alert threshold、dashboard、on-call/runbook | §09; 04 only defines safe diagnostic mode and binding contract |
| complete testing | TC/precondition/action/oracle/data/automation/evidence schema | formal 05 |
| acceptance decision | pass threshold、veto、waiver、signoff | formal 06 |
| implementation execution | phase/task/boundary/commit/check/evidence/rollback execution | formal 07 then ledgers/skeletons |
| implementation/deployment facts | actual repo/code/config/connectivity/run/result/readiness | future execution records only |

## 7. 残余风险与未确认前处理

| ID | 残余风险 | 影响 | 未确认前处理 | 阻塞范围 |
|---|---|---|---|---|
| `CFG-SCOPE-R01` | concrete durable product unselected | Deployment local authority binding | define semantic constructor material only; reject non-conforming product | product implementation boundary only |
| `CFG-SCOPE-R02` | transport/source/route products unselected | Configured external/source/route bindings | retain symbolic endpoint/credential/TLS refs and Disabled/Fake profile options | affected Configured boundary |
| `CFG-SCOPE-R03` | observer backend unselected | Redacted sink binding | retain backend-neutral private cut; Off remains valid | concrete instrumentation boundary |
| `CFG-SCOPE-R04` | target repository absent | parser/builder implementation cannot start | complete design 04~07; no repository facts claimed | all implementation boundaries |
| `CFG-SCOPE-R05` | two core wire/key debts | compatibility fixture may drift | pin current design assumption; dependency change triggers reopen | affected fixture/digest boundary |
| `CFG-SCOPE-R06` | old 05/06 not rebuilt | no active test/acceptance truth | hand off only; rebuild via own SOP | test/acceptance claims |
| `CFG-SCOPE-R07` | P2 requests may surface later | scope creep / hidden dynamic behavior | reject from v1; reopen formal owners | requested P2 feature |

None is an unresolved upstream blocker for Step 3.

## 8. 设计取舍

| 议题 | 裁决 | 理由 |
|---|---|---|
| 27 rows 是否按当前 entry 裁剪 | formal catalog 全量，runtime branch 按 entry 验证 | 保证 schema/tooling/docs 完整，避免隐式字段 |
| P1 product 是否必须在 04 选定 | 否；04 定义 compatibility gate 与 required material | 目标仓与真实环境不存在，不可伪造 |
| 是否支持 hot reload | 否；v1 startup immutable/cold restart only | formal 03 root/process lifetime contract |
| 是否提供 admin override/config center | 否 | 无需求、架构、audit/authority contract |
| 是否用 timeout/retry 完成 runtime failover | 否 | Hub only has effect-safe bounded retry; provider failover is external owner |

## 9. 对 `03-详细设计.md` 的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 27 rows 全部为 P0 schema obligation | 否 | priority/coverage classification | formal §13.2 | 无回写 |
| P1 product-neutral bindings; product choice deferred | 否 | scope/handoff | formal §13.11~13.12/§17 | 无回写 |
| P2 hot reload/config center/admin override excluded | 否 | confirms immutable startup root | formal §13.1/§13.9 | 无回写 |
| deployment/operations/testing/acceptance/implementation ownership | 否 | downstream boundary | formal §§2.3、15~17 | 无回写 |

Impact audit: `待回写=0`; `阻塞待确认=0`.

## 10. Formal §2 回填草稿

Formal §2 shall include `CFG-G-01..08`, the priority semantics and the scope/non-scope matrices. It shall state that all 27 typed rows are P0 schema obligations, while P1 denotes product-neutral real binding readiness and P2 remains excluded. It must point every non-scope item to formal 00/01/03, 05, 06, 07 or 09 and state that no implementation/deployment fact is claimed.

## 11. Step 完成门禁

| 检查 | 结果 |
|---|---|
| SOP 五问 | 5/5 closed |
| goals | 8/8 have downstream result |
| P0/P1/P2 | semantics and per-surface classification closed |
| non-scope | every row has owner/destination |
| residual risk | 7/7 has interim action and blocking scope |
| no-config path | not applicable; 27-row active surface proves configuration is required |
| detailed-design impact | no writeback/pending blocker |
| raw key/default/product/JSON/formal 04 prematurely created | 0 |
| fabricated implementation/test/evidence/signoff/commit | 0 |

```text
document = 04-配置设计.md
step = 2
status = 04_step_02_completed_continuous_execution
configuration_required = true
unresolved_upstream_blocker = none
detailed_design_writeback = none
next_allowed_action = complete_04_step_03_control_plane
commit_required = no
```
