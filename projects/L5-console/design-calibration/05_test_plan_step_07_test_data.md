# Step 7. 设计测试数据

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 7
> 回填章节：`05-测试方案.md` §7
> 粒度参考：`projects/L1-governance/design-calibration/05_test_plan_step_07_test_data.md`
> 状态：`done / pass / self_reviewed`

## 1. 目标与事实边界

本 Step 为 Step 6 的 96 个 TC 定义可重复构造、按 future test invocation 隔离、自动清理的数据集和替身。Console 无 DB/repository/UoW/outbox/worker/job，因此 P0 数据主语是纯对象 builder、formal-shaped recording fake Port、in-memory exact-scope carrier、deterministic scheduler、host/sink fake、严格配置文档和静态图 fixture。

本文件不创建 fixture 文件或实现仓，不生成真实 `run_id`、seed、artifact、report 或 evidence。表中 `<test_run_ref>` 只是未来执行时生成的隔离键占位符，不是本轮已存在的运行标识。

## 2. 输入与数据分类

| 输入 | 用途 |
|---|---|
| Step 6 的 96 TC | 逐 family/范围映射数据前置 |
| 03 Step 6～13 | typed refs、对象、协议、状态、错误、carrier 与 race 数据形态 |
| 03 Step 14～16 | binding/diagnostic/a11y/test cut 数据输入 |
| 04 §5～§12 | strict JSON、四项 key、三 profile、failure/rollback fixtures |

| 数据分类 | Console 口径 |
|---|---|
| 基础数据 | deterministic local/formal refs、metadata、context、visibility、safe material、draft/request/state record |
| 边界数据 | empty/duplicate/mismatch/missing facet、axis combinations、terminal states、exact-scope boundaries |
| 异常数据 | typed Port failures、malformed/forbidden material、carrier/host/sink failure、invalid config |
| 并发数据 | controlled completion order、single-flight action key、late query、overlapping reconciliation/race |
| 恢复数据 | degradation/immutable plan、unknown request、new formal observation、fallback semantic channel |
| 静态数据 | future dependency/export/call graph 与 protocol registry fixture |

## 3. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 哪些基础数据必须存在？ | ref/metadata、七态 context、visibility/qualification、五轴 source、draft/request/result、八 topic descriptors/partitions、recovery/a11y、state record、四项 config。 |
| 哪些负向/并发/恢复数据需独立构造？ | forbidden body、malformed safe material、scope mismatch、terminal mutation、ambiguous dispatch/write、late result、partition failure、stale plan、sink/host failure、invalid config 与 forbidden graph 均独立。 |
| 如何隔离？ | future `<test_run_ref>` 为最高隔离键；其下使用 `<case_ref>`、session/context/scope、operation/action/request/partition refs；每 TC 获取新 fake container。 |
| 如何清理？ | 纯对象无清理；in-memory fake/container 在 case 后 reset/drop；fault schedule 恢复；synthetic leak corpus 删除/丢弃；不需 DB truncate。 |
| 外部依赖采用什么？ | P0 为 formal-shaped recording fake/controlled stub/disabled slot；real-like 只在正式合同和环境 authority 到达后 selected-run。 |
| 96 个 P0 用例是否都有稳定前置？ | 是，见 §6；conditional positive 只能从正式合同生成 fixture，当前明确 blocked，绝不自造 DTO。 |
| 是否依赖人工造数？ | 否；全部由 builder、table generator、controlled schedule、strict document fixture 或 generated static graph 提供。 |

## 4. Builder / Fake / Seed 统一规则

| 规则 | 正式测试数据合同 |
|---|---|
| deterministic refs | builder 以 `<test_run_ref>/<case_ref>/<kind>/<ordinal>` 生成非空 opaque test ref；只验证 kind/同源/唯一性，不冒充 owner production ref |
| fixed logical clock | 只在 completion schedule/diagnostic ordering 需要时使用 deterministic logical tick；绝不以时间生成 freshness/currentness |
| formal-shaped fixture | 只能从 03 已定义 public safe shape 或未来正式 owner/SDK contract 生成；未知字段/DTO 不用 JSON 猜造 |
| minimum fixture | 每个 case 只带目标断言所需字段；不继承可能掩盖负向分支的 happy-path 状态 |
| table mutation | negative case 从有效 typed fixture 做单一受控变异；forbidden-body fixture 保持隔离且不得进入 shared snapshot/state |
| recording fake | 每个 Port fake 记录 operation kind、safe ref、call count、completion/cancel disposition；不得记录 request/draft/owner body |
| parity | fake 返回与 formal adapter 相同 union/error/cancel shape；不能因为 map 命中就默认 qualified/current/confirmed |
| fault injection | fault profile 绑定 `<case_ref>` 且默认 single-shot；case teardown 必须验证 profile 已 reset |
| call ledger | write/no-write/single-flight 断言读取 case-local ledger；ledger 不是 audit/evidence 或业务历史 |
| blocked positive | exact contract 未到时 dataset 只有 missing-surface/no-call fixture；future positive builder 标 `contract-derived-only` |

## 5. 测试数据集注册表

### 5.1 基础与状态数据集

| Data ID | 用途 | 构造方式 | 隔离键 | 清理 |
|---|---|---|---|---|
| `DS-CON-RUN-001` | future invocation 隔离壳 | 生成 placeholder-bound `<test_run_ref>`、case refs、fixed logical schedule | `<test_run_ref>` | drop case container；当前不实例化 |
| `DS-CON-REF-001` | safe local/owner refs、metadata | typed ref/metadata builders；valid/empty/duplicate/wrong-kind variants | run+case+ref kind | pure，无清理 |
| `DS-CON-CONTEXT-001` | context/shell 主线 | builder 构造 `unresolved/verified/restricted/expired/revoked/conflict/unknown` 与 bootstrapping/presentable/restricted/closed | session+context ref | case drop |
| `DS-CON-ACCESS-001` | visibility/qualification/disclosure | table generator 产生 positive/conservative/missing/mismatched formal observations | context+topic+observation ref | pure |
| `DS-CON-NAV-001` | route/selection/history/cleanup | local builder + host route recording fake | session+context+topic | fake reset |
| `DS-CON-SOURCE-001` | safe material、snapshot、five axes/link | safe-field builder + axes cartesian/pairwise table + formal empty | owner+source+object ref | case drop |
| `DS-CON-SOURCE-NEG-001` | malformed/duplicate/forbidden owner material | valid fixture 的 isolated single mutation | case+negative tag | discard without persistence |
| `DS-CON-DRAFT-001` | draft lifecycle 与 controlled input | builder 覆盖 editing/invalid/reviewable/submitted/discarded | scope+draft+request ref | case drop |
| `DS-CON-REQUEST-001` | request/result/reconciliation | submitted/accepted/pending/confirmed/rejected/unknown + formal refs/missing surface | scope+request+result ref | case drop |
| `DS-CON-TOPIC-001` | 八 descriptor、owner partitions、activation facets | static owner-key table + mode×six-facet×context generator | topic+owner partition | pure/fake reset |
| `DS-CON-RECOVERY-001` | degradation/plan/action | non-normal axes builder + immutable plan/current/stale/mismatch variants | subject+plan+action ref | case drop |
| `DS-CON-A11Y-001` | semantic regions/actions/focus/announcement | shared action binding builder + visual/keyboard/AT channel table | page+region+action key | host fake reset |
| `DS-CON-STATE-001` | exact-scope whole record/carrier | valid/missing/malformed/duplicate/forbidden `ClientStateRecord` + volatile carrier fake | session+optional context scope | carrier reset/drop |

### 5.2 Port、错误、并发与诊断数据集

| Data ID | 用途 | 构造方式 | 隔离键 | 清理 |
|---|---|---|---|---|
| `DS-CON-PORT-001` | narrow Port success/error/cancel/unknown | per-Port formal-shaped recording fake registry | case+adapter slot | registry/ledger reset |
| `DS-CON-ERROR-001` | 全 `ConsolePortErrorKind` | typed error table with allowed source/ref/retry disposition only | case+error kind | pure |
| `DS-CON-CALLLEDGER-001` | no-write/unique-write/single-flight | case-local operation ledger recording safe call metadata only | case+port+operation | drop ledger |
| `DS-CON-SCHEDULE-001` | late result/partition order/reconcile/race | deterministic deferred completion graph，提供正/逆序与 cancel boundary | case+schedule variant | resolve/cancel all then reset |
| `DS-CON-INVALIDATION-001` | current disabled consumer | `SdkInvalidationPort.observe=disabled/pending-contract` fixture | case+slot | fake reset |
| `DS-CON-INVALIDATION-FUTURE-001` | future envelope/apply | `contract-derived-only` placeholder；无当前 payload | future contract ref | not constructible / no cleanup |
| `DS-CON-DIAG-001` | safe diagnostic pipeline | approved enum/ref candidate + availability/sink outcomes | case+diagnostic operation | sink ledger reset |
| `DS-CON-LEAK-001` | forbidden-body/redaction negative | synthetic dummy markers for secret/body/URL/stack/free-text/full-ref；永不使用真实敏感值 | case+leak kind | isolated corpus discard/delete |

### 5.3 配置与架构数据集

| Data ID | 用途 | 构造方式 | 隔离键 | 清理 |
|---|---|---|---|---|
| `DS-CON-CONFIG-001` | valid minimal/full configs | strict JSON fixtures：三 profile × optional explicit/default variants | case+profile+document digest | immutable fixture，无清理 |
| `DS-CON-CONFIG-NEG-001` | parser/type/key/security/cross-field failures | 每次对 valid doc 做一种 mutation：missing/unknown/duplicate/bad type/alias/comment/trailing/forbidden/cross-field | case+mutation kind | discard document |
| `DS-CON-BINDING-001` | builder mandatory/optional/partial posture | recording adapter registry + four config values + slot availability | case+profile+slot | registry reset |
| `DS-CON-CONFIG-CHANGE-001` | startup-only/change/rollback | old/current/changed/legacy whole documents，均 immutable | case+document generation | drop simulated runtime |
| `DS-CON-ARCH-001` | compliant future graph/registry | generated package/import/export/call graph fixture matching 03 layout | case+graph digest | no persistent cleanup |
| `DS-CON-ARCH-NEG-001` | forbidden structural nodes/edges | isolated graph mutations：DB/repo/private bus/BFF/worker/Event/Job/private sibling/write edge | case+mutation | discard graph |

## 6. TC 到数据前置映射

| Cut / TC | Data IDs | Builder / fake / stub | 清理 |
|---|---|---|---|
| ENTRY/ACCESS `TC-CTX-001～005` | RUN/REF/CONTEXT/ACCESS/PORT/CALLLEDGER/SCHEDULE | context table + resolver/host/carrier fakes；late completion scheduler | case container + ledgers reset |
| NAV `TC-NAV-001～004` | CONTEXT/ACCESS/NAV/A11Y/CALLLEDGER | visibility table + route/history/host fake | host/history ledger reset |
| VIEW `TC-VIEW-001～009` | REF/SOURCE/SOURCE-NEG/REQUEST/TOPIC/PORT/CALLLEDGER | safe mapper builders + axes table + recording Query/Command/carrier Ports | case drop;negative material discarded |
| INTENT `TC-INTENT-001～005` | CONTEXT/ACCESS/DRAFT/REQUEST/STATE/PORT/CALLLEDGER | typed patch/draft builders + volatile carrier + missing-surface command fake | carrier/ledger reset |
| INTENT `TC-INTENT-006` | future exact owner fixture | `contract-derived-only`;当前不可构造 | N/A;blocked-positive |
| INTENT `TC-INTENT-007～011` | DRAFT/REQUEST/PORT/ERROR/CALLLEDGER/SCHEDULE/STATE | formal-shaped observation mapper seam、dispatch boundary、carrier faults | resolve scheduler;reset fake/ledger |
| TOPIC `TC-TOPIC-001～012` | CONTEXT/ACCESS/SOURCE/TOPIC/PORT/CALLLEDGER/SCHEDULE | descriptor owner table + partition fake + completion permutation | per-partition fake reset |
| RECOVERY `TC-RECOVERY-001～005` | ERROR/RECOVERY/REQUEST/A11Y/PORT/CALLLEDGER | typed error/plan/action tables + recovery/host fakes | ledger/host reset |
| A11Y `TC-A11Y-001～003` | A11Y/CONTEXT/ACCESS/RECOVERY/CALLLEDGER | shared semantic action builder + channel/focus/announce fakes | host ledger reset |
| A11Y `TC-A11Y-004` | future authority-derived compatibility dataset | concrete browser/AT matrix only after `CON-Q-046` | N/A;conditional |
| ADAPTER `TC-ADAPTER-001～004` | PORT/ERROR/SOURCE/SOURCE-NEG/BINDING/CALLLEDGER | parity tables + registry failure profiles | registry/ledger reset |
| CONSUMER `TC-ADAPTER-005` | INVALIDATION/STATE/CALLLEDGER | disabled observation fake | fake/carrier reset |
| CONSUMER `TC-ADAPTER-006` | INVALIDATION-FUTURE | formal envelope-derived only | N/A;blocked-positive |
| STATE `TC-STATE-001～008` | CONTEXT/ACCESS/NAV/SOURCE/DRAFT/REQUEST/TOPIC/RECOVERY/A11Y/STATE/DIAG | exhaustive/pairwise state table + volatile carrier | case drop/reset |
| CONSISTENCY `TC-CONSISTENCY-001～008` | STATE/PORT/CALLLEDGER/SCHEDULE/REQUEST/TOPIC/INVALIDATION | deterministic interleaving and single-shot faults | settle scheduler;drop ledger/state |
| DIAG `TC-DIAG-001～004` | DIAG/LEAK/ERROR/CALLLEDGER | factory/gate/availability/sink fakes | discard leak corpus;reset sink ledger |
| SEC `TC-SEC-001～005` | CONTEXT/ACCESS/SOURCE-NEG/REQUEST/TOPIC/LEAK/CONFIG-NEG/ARCH-NEG/CALLLEDGER | negative table + recording zero-call assertions | discard isolated mutation;reset ledger |
| CONFIG `TC-CONFIG-001～011` | CONFIG/CONFIG-NEG/BINDING/CONFIG-CHANGE/LEAK/STATE/CALLLEDGER | strict parser/validator/builder and old/new document simulation | drop runtime/registry;discard invalid doc |
| ARCH `TC-ARCH-001～004` | ARCH/ARCH-NEG/CALLLEDGER | generated future graph/registry + isolated mutation | discard graph/ledger |

## 7. External Dependency Substitute Matrix

| 依赖/接缝 | P0 数据协作 | 不允许 | Positive 条件 |
|---|---|---|---|
| L0 SDK/shared types | public safe type fixture + narrow Port fake | private transport、源码复制、随意 JSON | package/formal contract 可用后 contract-derived fixture |
| identity/Policy/Gate | context/visibility/qualification recording fake | local RBAC 或规则正文 | exact safe observation authority |
| work/process/workspace | per-owner safe material fake | projection/cursor/rebuild/full object | owner-safe contract arrival |
| method/governance/artifact | safe status/ref fake | body、approval/verdict 推导 | exact read/command contract |
| observability | safe ref result + disabled diagnostic sink | audit/evidence body 或 sink receipt truth | formal query/sink envelope |
| capability/archive/sandbox | pending/blocked/read-only partition fake | registration/archive/run execution truth | owner formal surface |
| browser host/a11y | deterministic route/focus/announce fake | 假称具体浏览器/AT兼容 | authority matrix + selected real-like environment |
| state medium | in-memory session-volatile carrier | localStorage/IndexedDB/cookie 等猜测、durability | `CON-Q-044` closure |

## 8. 隔离、清理与安全规则

| 数据形态 | 隔离 | teardown | 特殊检查 |
|---|---|---|---|
| pure builders/tables | case-local immutable value | none | 禁止全局 mutable singleton |
| recording fake registry/Ports | `<test_run_ref>/<case_ref>/<slot>` | verify pending calls settled；reset registry/ledger | teardown 后 call count/fault profile 必须为 0 |
| volatile state carrier | exact session/context scope | clear exact case scope/drop container | 不跨 case/session/context 迁移 |
| deterministic scheduler | case schedule id | resolve/cancel all deferred tasks then reset | 未完成 promise 不得泄漏到下一 case |
| forbidden/leak corpus | isolated synthetic corpus id | discard/delete whole corpus | 不使用真实 secret；失败消息不 echo corpus |
| config documents | immutable case id + digest | discard invalid/current runtime simulation | invalid doc 不更新 shared defaults |
| generated static graph | graph digest | discard mutation | compliant graph与negative mutation 不共享对象 |
| future real-like | fixed future run namespace | 由正式环境合同定义 | 当前不存在，不写清理成功 |

## 9. 数据集停审与跨数据审计

### 9.1 按 Cut 停审

| Cut 组 | 可重复构造 | 隔离键 | 清理 | 替身明确 | blocker 保真 | 结论 |
|---|---|---|---|---|---|---|
| ENTRY/ACCESS/NAV | yes | yes | yes | resolver/host/carrier fake | yes | pass |
| VIEW/QUERY | yes | yes | yes | owner query/safe mapper fake | yes | pass |
| INTENT/COMMAND | safety yes | yes | yes | command/reconcile/carrier fake | exact positive blocked | pass |
| TOPIC | safety/partial yes | yes | yes | per-owner partition fake | owner positive blocked | pass |
| RECOVERY/A11Y | semantic yes | yes | yes | recovery/host fake | compatibility blocked | pass |
| ADAPTER/CONSUMER | disabled/parity yes | yes | yes | registry/invalidation fake | observed blocked | pass |
| STATE/CONSISTENCY | yes | yes | yes | carrier/scheduler/ledger | durability excluded | pass |
| DIAG/SEC | yes | yes | yes | sink/redaction fake | production sink blocked | pass |
| CONFIG/ARCH | yes | yes | yes | builder/graph fixture | production graph future | pass_planned |

### 9.2 跨数据审计

| 审计项 | 结论 | 依据 / 修正 |
|---|---|---|
| 96 TC 是否均有数据前置或明确无数据前置 | pass | §6；纯 static/pure 使用 graph/table fixture |
| 是否依赖人工临时造数 | pass | 全部 builder/generator/fake/document/graph |
| negative 是否与 happy fixture 隔离 | pass | SOURCE-NEG/LEAK/CONFIG-NEG/ARCH-NEG 独立 |
| fault 是否可能泄漏 | pass | case-local single-shot + teardown reset |
| 外部替身是否一致 | pass | P0 一律 formal-shaped fake/controlled/disabled |
| 是否假定真实 DB/repository/bus | pass | 无；这些只出现在 ARCH negative graph |
| scope/run 是否混为 owner identity | pass | test refs 仅隔离，不冒充 owner id/key/version |
| raw body/secret 是否进入 shared state/ledger | pass | isolated synthetic corpus；ledger safe metadata only |
| blocked positive 是否用假 DTO 填洞 | pass | `contract-derived-only` 且当前不可构造 |
| 清理是否依赖人工 | pass | container/ledger/fake reset 或 corpus discard |

## 10. 上游影响与后续承接

| 结论 | 处理 |
|---|---|
| 96 TC 的当前 P0 safety 数据均可构造 | 无需回写 00～04 |
| formal positive dataset 不可构造 | 这是既有 blocker，不以 fixture 关闭；Step 8/14 继续标 blocked |
| fixture 目录/builder 名仍未固定 | Step 9 的 planned test layout 与未来 07 承接；不在当前创建 |
| 若未来正式 contract 与现有 safe shape 不兼容 | 回写 03/05 受影响协议、用例和数据集 |

## 11. 正式回填与门禁

正式 §7 应回填数据分类、Data registry、TC 映射、external substitute、隔离/清理与 blocked-positive fixture 纪律。

> 校准来源：`design-calibration/05_test_plan_step_07_test_data.md`
>
> 延伸阅读：建议继续阅读本文件的“Builder / Fake / Seed 统一规则”“测试数据集注册表”“TC 到数据前置映射”“External Dependency Substitute Matrix”和“隔离、清理与安全规则”。

| 进入 Step 8 条件 | 结论 |
|---|---|
| P0 safety TC 数据前置可满足 | pass |
| 每个 cut 数据已停审 | pass |
| 跨数据隔离/清理无 unresolved 冲突 | pass |
| 无人工造数或假 positive DTO | pass |
| 可进入 Step 8 | pass |

Step 7 `done / pass / self_reviewed`；未创建或清理任何真实测试数据，未实例化 `<test_run_ref>`。
