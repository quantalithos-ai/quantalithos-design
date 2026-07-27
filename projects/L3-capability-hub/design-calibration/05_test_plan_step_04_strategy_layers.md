# L3-capability-hub 05 测试方案 Step 4：制定测试策略与分层

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 4
> 回填章节：`projects/L3-capability-hub/05-测试方案.md` §4
> 创建日期：2026-07-25
> 当前模式：full-restart / continuous execution
> 状态：`05_step_04_completed_continuous_execution`
> 真实性边界：本文件定义 future testing strategy；没有测试框架、suite、CI job、run 或 gate 已被实现或执行。

---

## 1. 本步目标与边界

本步按“风险最早可确定的位置”分层，而不是先分配测试数量。每个 P0 cut 必须有一个 primary discovery layer；secondary layer只验证跨边界组合，不复制 primary oracle。Step 5~13仍分别拥有追溯、用例、数据、环境、自动化、专项和证据设计。

| 输入 | 本步使用 |
|---|---|
| `05_test_plan_step_03_test_objects_cuts.md` | 171 exact DDD cuts + 18 config obligations及建议发现层 |
| formal 03 §§3~15 | module dependency、pure invariant、flow/UoW、adapter、entry、config/observation boundaries |
| formal 04 §§5~12 | strict parser、profile、material、assembly/barrier、failure and downstream gates |

## 2. SOP 五问回答

| 问题 | 收口答案 |
|---|---|
| 哪些问题必须在 unit 层发现？ | ref/value/DTO construction、canonical bytes/digest、domain invariant、24-state classification、strict JSON typed validation、redaction projection和bounded arithmetic必须在pure unit/property层发现。 |
| 哪些必须在 service 层验证？ | 83 flow编排、Port顺序、resolver-before-UoW、same-UoW成员、duplicate replay、Query no-write、commit unknown、rollback和Job phase必须在deterministic application service层发现。 |
| 哪些依赖 repository/adapter/worker integration？ | 22/110 repository contract、fake/durable parity、Stage 0~7、9/6/10 graph、Port failure、Worker task/barrier/drain、Outbound A/B/C、observer sink failure必须在adapter/runtime contract层发现；P0不要求真实产品。 |
| 哪些需要 API/contract test？ | 250 public protocols、API route/header/body/schema/metadata、Worker envelope/receipt/completion、Jobs input/report/dispatch和public-safe error mapping需要contract/entry层验证。 |
| 哪些才需要 E2E/release gate？ | 只需selected entry完整图smoke、P0 family result/evidence completeness、redaction/dependency/Rustdoc scans和veto summary；cross-repo/live-product E2E属于P1，不能替代低层oracle。 |

## 3. 测试策略取舍

| Decision | Rejected alternative | Reason |
|---|---|---|
| one primary discovery layer per risk | same semantic test copied into every layer | prevents duplicate maintenance and ambiguous failure ownership |
| property/generated matrices for 43+7/250/110/638 inventories | hand-written sample-only cases | exact finite inventories require member-level traceability |
| deterministic service tests own flow semantics | API/E2E owns business orchestration proof | service layer can observe exact Port/UoW/effect order and zero calls |
| product-neutral adapter contract is P0 | real DB/bus/provider required for all P0 | products are unselected and cannot define business truth |
| entry tests own decode/mapping/lifecycle only | entry directly verifies repository internals | preserves API/Worker/Jobs dependency boundary |
| release gate aggregates evidence | release smoke used as universal oracle | smoke cannot prove no-write, rollback or exact state-pair behavior |
| P1 live integration is explicitly conditional | absent live environment marked skipped/pass | missing prerequisite must remain not_executed/blocked, never pass |

## 4. 测试分层图

#### 测试分层图：L3-capability-hub 风险发现与证据汇总

```text
                 [L6 Release evidence gate]
          family completeness / scans / selected-entry smoke
                              ^
                              |
          [L5 Selected product / cross-repo integration]
             P1 live durable / transport / provider seams
                              ^
                              |
                   [L4 Entry runtime contract]
              API / Worker / Jobs decode and lifecycle
                              ^
                              |
             [L3 Adapter / runtime assembly contract]
       repository / UoW / builder / external Ports / observers
                              ^
                              |
                [L2 Application service tests]
           83 flows / ordering / effects / replay / phases
                              ^
                              |
                  [L1 Pure unit / property]
        objects / states / codec / digest / config / redaction
                              ^
                              |
               [L0 Static / compile-time contract]
       dependency / inventory / Rustdoc / public-surface checks
```

关键说明：

- L0~L4是P0风险的主发现区域；每个P0 cut必须指向其中至少一层。
- L5只在产品、环境和相邻仓实际可用时执行；未执行不是P0 pass，也不能伪装为pass。
- L6消费低层真实产物并检查完整性，不从缺失artifact推断成功。
- 业务truth oracle保持typed terminal/repository/carrier/zero-effect优先；observer和smoke不能替代。

## 5. 七层定义与失败规则

| Layer | Goal | Typical cuts | Future trigger | P0 failure handling |
|---|---|---|---|---|
| `L0 Static/compile` | 在运行前发现依赖、inventory、public surface和文档缺口 | `CUT-MOD-DEP-*`, `CUT-MOD-DOC-01`, protocol/repository/cut registries, forbidden symbols | local/PR fast gate | block boundary; missing check result is not pass |
| `L1 Unit/property` | 发现纯构造、不变量、状态、codec、digest、validator/redactor错误 | `CUT-OBJ-*`, `CUT-STATE-*`, parser/value branches, `CFG-F-01..05`, `CUT-OBS-05..09` | local/PR unit suite | block merge; no higher-layer waiver |
| `L2 Service` | 验证application编排、UoW、idempotency、error/effect order | 83 `CUT-FLOW-*`, most `CUT-TX-*`, Query zero-write | PR/service suite | block merge; report exact flow/branch |
| `L3 Adapter/runtime contract` | 验证repository/Port parity、failure injection、builder and observer sink | `CUT-REPO-ALL`, `CUT-PORT-*`, `CUT-BIND-*`, `CFG-F-06..18`, `CUT-OBS-*` | CI controlled integration | block P0 integration gate; product-independent |
| `L4 Entry runtime` | 验证API/Worker/Jobs decode、mapping、barrier、task/drain和terminal carrier | `CUT-MOD-05..07`, protocol entry branches, API/Worker/Jobs barrier | CI entry/runtime suite | block P0 gate; entry never introspects private repository |
| `L5 Selected integration` | 验证选定durable/transport/provider/adjacent-repo实现满足同一Port contract | P1 product seams and cross-repo compatibility | selected integration/nightly/release candidate | block only selected P1 boundary; no generic P0 pass/fail |
| `L6 Release evidence` | 检查required P0 suites/scans/artifacts/reports完整且无veto finding | selected-entry smoke, Rustdoc/dependency/redaction/inventory/evidence-index checks | release candidate | missing/failing required evidence blocks送验；does not fabricate result |

## 6. Cut-to-layer master mapping

| Cut family | Primary layer | Secondary confidence layer | Primary oracle | Duplicate-control rule |
|---|---|---|---|---|
| module dependency/Rustdoc | L0 | L6 summary | exact source/manifest inventory findings | L6引用L0 artifact，不重新解释source |
| contracts/protocol inventory | L0 + L1 | L4 | compile/construct/roundtrip/unknown-field | entry只测mapping，不重复全部250类型 |
| domain objects/states | L1 | L2 | exact factory/member/pair classification/zero mutation | service引用domain outcome，不复制638 pairs |
| digest/canonical bytes | L1 | L2/L3 | exact bytes/domain vector | service只检查选用正确domain |
| 26 Commands | L2 | L4 selected mappings | typed terminal + UoW/effects | L4只抽route/mapping representative，26 flows仍由L2注册 |
| 33 Queries | L2 | L4 selected mappings | typed surface + all write-like calls zero | entry不以HTTP status替代typed/no-write oracle |
| 6 Inbound | L2 + L4 | L3 source driver | receipt/effects and predecode dispatch=0 | header/lifecycle在L4，business flow在L2 |
| 10 Outbound | L2 + L3 | L4 Worker continuation where applicable | snapshot/capture/Durable/A-B-C independence | no end-to-end broker success as truth |
| 8 Jobs | L2 + L4 | L3 repository/Port | plan/target/final carrier symmetry | runner lifecycle and service semantics separately owned |
| 22 TX/concurrency | L2/L3 | L4 crash harness | exact winner/carrier/UoW/call count | one injected branch owns truth oracle |
| 22/110 repositories | L3 | L5 selected durable | exact key/version/index/order/parity | L5 reruns same contract against product, not new semantics |
| 9 external Ports/14 calls | L3 | L5 selected product | typed request/result/failure/Disabled/Missing | live call cannot broaden result/error schema |
| parser/source/profile | L1 + L3 | L6 selected graph smoke | exact V-stage reject/no exposure | smoke never replaces malformed-input matrix |
| Stage 0~7/barriers/9-6-10 graph | L3/L4 | L6 | prefix disposal and no exposure | no private partial-graph assertion through production API |
| observation/redaction | L1 + L3 | L6 scan | exact profile fields/no business effect | final scan catches leakage but helper/sink tests own cause |

## 7. Risk-specific earliest-discovery table

| High-risk defect | Earliest layer | Required controllability | Why higher layer alone is insufficient |
|---|---|---|---|
| missing Rustdoc on struct field/variant payload/method | L0 | source inventory | runtime cannot observe documentation |
| illegal state pair accepted | L1 | generated 638-pair dataset | E2E cannot cover exact pair matrix |
| canonical digest uses `Debug`/map order/raw body | L1 | fixed vectors/property permutation | integration symptom is nondeterministic and late |
| Command writes partial sidecars | L2 | staged UoW spy/failure injection | API response cannot prove atomic membership |
| Query repairs/writes | L2 | all write-like Port spies | black-box read success cannot prove no write |
| duplicate reruns effect | L2/L3 | reserve race + call counters + stored surface | E2E cannot reliably identify one winner |
| commit Unknown guessed | L2/L3 | deterministic three-state UoW | timeout response alone is ambiguous |
| configured failure falls back Fake | L3 | constructor registry spy | happy-path entry hides chosen implementation |
| Stage failure leaks task/listener | L3/L4 | barrier and owned-prefix lifecycle harness | process smoke cannot distinguish transient leak |
| observer failure cancels business flow | L3 | failing sink/redactor + byte-equivalent result | log absence cannot establish business equivalence |
| Deployment permits fake/inMemory/plaintext | L1/L3 | exact config/profile candidates | live deployment is too late for schema violation |
| forbidden responsibility enters public API | L0/L1 | public protocol inventory/body corpus | cross-repo E2E may normalize or hide leaked field |

## 8. Selected-entry smoke and E2E boundary

| Smoke / integration | Priority | What it proves | What it never proves |
|---|---:|---|---|
| API selected-entry graph smoke | P0 L6 | complete validated graph exposes API facade and one representative C/Q mapping | all 59 API flows, state/TX/no-write matrices |
| Worker selected-entry graph smoke | P0 L6 | six-source graph/barrier/tasks and representative receipt/continuation | real broker delivery or downstream truth |
| Jobs selected-entry graph smoke | P0 L6 | eight-dispatch map and representative plan/target/final lifecycle | all target failures/reentry combinations |
| fake/durable contract parity | P0 L3; P1 L5 for selected durable | same repository/Port semantics | product capacity/SLO |
| live adjacent-repo typed seam | P1 L5 | current released contract compatibility | adjacent project internal correctness |
| full runtime/tools/provider invocation | out of scope | none | Hub execution correctness; responsibility violation if treated as P0 |
| marketplace transaction or SDK client E2E | out of scope | none | Hub truth or exposure validity |

## 9. Future execution cadence contract

This table defines intended triggers only；it does not assert jobs exist.

| Trigger class | Intended layers | Required behavior if unavailable |
|---|---|---|
| local author check | L0/L1 focused | report not-run; cannot claim clean |
| pull request | L0/L1/L2 and bounded L3 | any P0 failure/missing required suite blocks future merge gate |
| controlled integration/nightly | full L3/L4, optional selected L5 | P0 missing/failure blocks integration readiness; optional P1 remains not_executed |
| release candidate | all required P0 L0~L4 + L6; selected required P1 only if 06 says so | missing artifact/result is gate failure/not_evaluated, never pass |
| dependency/config/product change | affected primary layer + all dependent confidence layers | trigger-based regression from Step 14; no fixed blanket skip |

## 10. Cross-layer coverage and duplication audit

| Audit | Result | Notes |
|---|---|---|
| 171 exact DDD cuts have primary layer | pass | family/member registration rules cover all exact IDs |
| 18 CFG-F obligations have primary layer | pass | L1/L3/L4 split by detection point |
| every P0 risk has L0~L4 primary discovery | pass | none deferred solely to L6/E2E |
| 83 flow semantics owned by service/entry split | pass | entry mapping cannot replace service oracle |
| 638 state pairs owned below E2E | pass | L1 generated registry |
| selected product required for P0 truth | no | L5 remains P1 unless formal 06 later promotes exact boundary |
| duplicated semantic authority | 0 | primary/secondary rules fixed |
| responsibility leakage through E2E | 0 | execution/approval/method/marketplace/SDK client excluded |
| current upstream writeback/blocking | 0/0 | strategy translates existing cuts only |

## 11. 对上游影响与 Formal §4 回填草稿

| Conclusion | Changes 00~04? | Treatment |
|---|---|---|
| seven-layer risk model | no | test strategy only |
| generated/state/repository inventory needed | no | Step 7/9 and formal 07 implementation prerequisite |
| selected live products are P1 | no | preserves product-neutral formal 01/04 |
| future promotion of a P1 selected run to P0 | may affect 05/06/07/09 | controlled change; exact owner review |

Current `待回写=0`, `阻塞待确认=0`, unresolved upstream blocker=`0`.

Formal §4 must include the ASCII layer diagram, seven-layer table, cut-family placement, earliest-discovery examples, selected-entry smoke boundary, future trigger semantics and missing-result rule. It must not name an existing framework/job, claim a suite runs, or report pass/fail.

## 12. 待确认事项与 Step 5 entry gate

| Item | Current handling |
|---|---|
| exact Rust test framework/plugin choices | formal 07 preflight; strategy remains framework-neutral |
| generated inventory/state registry implementation | Steps 7/9 define data/gate; 07 assigns boundary |
| which P1 live runs become release-required | formal 06 decision after evidence design |
| concrete CI trigger names | Step 9 semantic gate first; implementation later |

| Entry condition | Result |
|---|---|
| all P0 cut families assigned primary layer | pass |
| high risks not deferred solely to E2E | pass |
| layer failure/block semantics defined | pass |
| cross-layer duplicate authority | 0 |
| current writeback/blocking/upstream blocker | 0/0/0 |
| fabricated suites/jobs/results | 0 |

Step 4 is complete. Next allowed action: T027 / Step 5, build requirement/design/config-to-cut coverage and orphan audits; do not assign complete TC execution records before Step 6.
