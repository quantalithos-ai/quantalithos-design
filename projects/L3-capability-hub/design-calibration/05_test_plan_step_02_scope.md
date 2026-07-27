# L3-capability-hub 05 测试方案 Step 2：明确测试目标、范围和非范围

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 2
> 回填章节：`projects/L3-capability-hub/05-测试方案.md` §2
> 创建日期：2026-07-25
> 当前模式：full-restart / continuous execution
> 状态：`05_step_02_completed_continuous_execution`
> 真实性边界：本文定义测试范围与优先级，不定义或声称任何 TC、EV、执行结果、CI 配置、验收签署或实现事实。

---

## 1. 本步目标与输入

本步把 Step 1 的输入边界收敛为可判定的测试目标、P0/P1/P2 优先级、范围/非范围、接缝责任和一票否决关联。完整对象清单、切口、用例、数据、环境、自动化和证据分别留给后续 Step。

| 输入 | 用途 |
|---|---|
| `05_test_plan_step_01_input_boundary.md` | authority、历史隔离、测试方案不得改写的责任 |
| formal `00` §§4/7/9~14 | goals/non-goals、capability loop、FR/BR/NFR、acceptance directions |
| formal `01` §§4/8~15 | responsibility、dependency/data/consistency/cross-cutting/risk boundaries |
| formal `02` | component/object/interface/flow/state/error outline |
| formal `03` §§5~17 与 Step 16 | exact modules/protocols/flows/states/consistency/config/observability/test cuts |
| formal `04` §§2/6/8/9/11/12 | P0/P1/P2 config, profile, secret, activation, failure and downstream test obligations |

## 2. SOP 五问回答

| 问题 | 收口答案 |
|---|---|
| P0 必须通过哪些测试才能证明主链成立？ | 必须证明 capability identity、registry、adapter descriptor、governance approval seam、method-library asset relation、formal exposure boundary、controlled consumer view 和 change/reference/impact 协作均遵守 formal 03 的对象、协议、状态、一致性、无正文和无执行责任边界；同时覆盖 83 flows、配置启动门禁、secret/redaction 与 Query no-write。 |
| P1/P2 是否只做边界验证或延后？ | 是。P1 验证真实或 real-like durable/transport/provider/observer adapter 接缝，不把产品选择作为 P0 前置；P2 验证生产容量、multi-region/tenant、advanced discovery、rich UI、dynamic config 等未来能力，不阻塞当前设计基线。 |
| 哪些下游能力只测接缝？ | `L1-governance`、`L3-method-library`、`L0-sdk`、`L2-runtime`、`L2-tools`、`L4-observability`、`L6-marketplace` 和外部 transport/secret provider 只测 body-free reference、typed seam、failure mapping、redaction 和 no-write/no-leakage；不测其内部业务真相。 |
| 哪些非范围有残余风险？ | 真实产品行为、生产容量、跨仓完整 E2E、provider/secret rotation、deep marketplace/SDK/runtime behavior、advanced policy/approval 和 dynamic control plane 都保留为 P1/P2 或 controlled-reopen 风险。 |
| 哪些范围项关联一票否决？ | 任一核心 identity/registry/descriptor/relation/exposure flow 不可验证、外部正文或 secret 泄漏、Query/Job/observer 反写真相、配置 partial graph/fallback、Deployment fake、Rustdoc 漏项、非 Hub 责任泄漏均是 P0 veto candidate；最终 veto 由新版 `06` 裁决。 |

## 3. 测试目标表

| ID | 测试目标 | Source | Priority | 必须证明的边界 |
|---|---|---|---|---|
| `TP-GOAL-01` | capability identity 可建立、校验、变更和追溯 | 00 C-CH-1; 03 §§6~9 | P0 | identity 不由 URL/provider/runtime state 临时替代 |
| `TP-GOAL-02` | capability registry 是受控目录真相 | 00 C-CH-2; 03 C/Q flows | P0 | lifecycle/version/visibility/reference 保持单一 authority |
| `TP-GOAL-03` | adapter descriptor 表达接入边界而非 provider runtime | 00 C-CH-3; 03 descriptor flows | P0 | 不保存 method body、secret value、route/cost/failover 或 execution result |
| `TP-GOAL-04` | governance seam 只引用治理结果，不拥有 approval truth | 00 C-CH-4; 01 boundary; 03 relation flows | P0 | relation/reference failure 不被转换为 approval/allow decision |
| `TP-GOAL-05` | method-library relation body-free 且不接管资产生命周期 | 00 C-CH-4; 03 method relation flows | P0 | method body/source/publication/execution 均 zero-write/zero-body |
| `TP-GOAL-06` | formal exposure 与 controlled consumer view 可供下游引用 | 00 C-CH-5; 03 exposure/query flows | P0 | exposure 不等于 SDK client、runtime execution 或 marketplace listing |
| `TP-GOAL-07` | 83 条 C/Q/I/O/J flow 的正向、异常、effect 和 no-write 语义可验证 | 03 §§7~8; Step 16 | P0 | exact protocol/flow/state/error names，不用日志猜 truth |
| `TP-GOAL-08` | persistence/UoW/idempotency/concurrency/recovery 保护 truth | 03 §§10~12 | P0 | duplicate winner、commit unknown、rollback、race、Query no-write 保持正式 surface |
| `TP-GOAL-09` | config source/profile/activation/failure/redaction contract成立 | 04 §§5~12 | P0 | Missing fail-fast、显式 Disabled、无 fallback、Deployment fake=0、无 raw output |
| `TP-GOAL-10` | module/dependency/Rustdoc/observability boundaries可审计 | 03 §§3~6/14~15 | P0 | 7 modules、public docs、Off/Redacted、observer non-cancelling 不被绕过 |
| `TP-GOAL-11` | selected product/transport/provider seam 不改变 P0 truth | 01/04 risk and handoff | P1 | real-like adapter only；产品未选时不伪造可达性 |
| `TP-GOAL-12` | future operations/capacity/evolution 风险有触发条件 | 00/01/04 §§13~14 | P2 | 不把未来能力误报为当前 supported/implemented |

## 4. 范围 / 非范围矩阵

| 范围项 | 类型 | Priority | 验证目标 | 不验证 / owner |
|---|---|---:|---|---|
| capability identity context、registry lifecycle、descriptor relation | core truth | P0 | exact object/flow/state/reference closure | 不验证外部 provider runtime；03/domain/application owner |
| governance seam relation / safe result reference | cross-boundary truth | P0 | relation/reference state、subject/version/failure symmetry | 不执行 governance approval；`L1-governance` owner |
| method-library asset relation | cross-boundary truth | P0 | body-free ref、relation change、unavailable/degraded path | 不保存方法正文或发布状态；`L3-method-library` owner |
| formal exposure / controlled consumer view | exposure surface | P0 | consumer-specific visibility/applicability/freshness | 不实现 SDK client、runtime/tools execution；`L0-sdk`/runtime owner |
| 26 Command / 33 Query / 6 Inbound / 10 Outbound / 8 Job | protocol/flow | P0 | exact precondition, terminal, effect and no-effect | 不新增协议或状态；formal 03 owner |
| 24 state families / 111 variants / 638 pairs | state | P0 | current/reserved/illegal/same-state/terminal gates | 不改状态矩阵；formal 03 owner |
| 22 repository traits / 110 methods、UoW、idempotency、concurrency | consistency | P0 | authority/CAS/order/commit/rollback/race/reentry | 不指定真实 DB product；infra/implementation owner |
| 7 module/dependency and Rustdoc surfaces | static/code contract | P0 | dependency direction、public docs、no hidden Port/method | 不实现代码；07/implementation owner |
| 18 config modules / 27 rows / 21 content env / 9 slots / 6 sources / 10 routes | configuration | P0 | strict parse/merge/profile/cardinality/cross-field | 不发明 key/default/product；04 owner |
| Secret/provider/TLS/ref-only and Off/Redacted | security/observation | P0 | no raw value/body/provider response, safe projection | 不测试 provider platform internals；security/ops owner |
| Local/Integration/Deployment graph and API/Worker/Jobs barriers | activation | P0 | complete predicate, prefix disposal, no partial exposure | 不声称 real deployment；07/09 owner |
| real durable store/transport/secret provider/observer adapter | product seam | P1 | exact constructor/failure/redaction/no fallback | 产品未选；implementation/operations owner |
| cross-repository live integration | integration seam | P1 | typed ref/event/handoff compatibility | 不测试相邻仓内部真相；各 owning project |
| production-like capacity/SLO/multi-region/tenant | operations/evolution | P2 | future load/topology/retention decisions | 当前无硬阈值/产品；09/future architecture |
| rich UI/search/ranking/marketplace transaction | peripheral | P2/out | only body-free read boundary if later required | `L6-marketplace`/product owner |

## 5. P0/P1/P2 定义

| Priority | Definition | Required design output | Release meaning |
|---|---|---|---|
| P0 | 当前 formal 00~04 已授权且缺失会破坏 Hub truth、security、consistency 或 responsibility boundary 的契约 | exact cut、planned case、oracle、negative/effect guard、future evidence contract | P0 test design and later execution are prerequisites for any 06 decision；本 Step 不声称通过 |
| P1 | 需要真实/选定产品或跨仓协作才能证明，但不改变 P0 truth contract | seam test、failure mapping、product-neutral environment prerequisite、residual risk | 未执行不自动否定设计基线；06/07/09 另行裁决 |
| P2 | 当前明确未来/外围/运营增强或需要新设计契约的能力 | controlled-reopen trigger、risk and future test seed | 不进入当前 P0 exit |

## 6. 接缝测试边界

| Downstream / external | 本项目测试内容 | 明确不测 | Residual-risk owner |
|---|---|---|---|
| `L1-governance` | typed governance result/ref、subject/version/failure、no approval write | approval workflow、Policy engine、decision truth | governance project |
| `L3-method-library` | asset ref/relation/family mismatch/body-free rejection | method body/source/publication/execution lifecycle | method-library project |
| `L0-sdk` | formal exposure/consumer boundary/visibility | client/package/cache/release/delivery | SDK project |
| `L2-runtime` / `L2-tools` | consumer ref, exposure view, no execution body/call | execution loop/tool invocation/result/quota/cost | runtime/tools projects |
| `L4-observability` | safe projection, mode, no leakage/non-cancellation | physical log/metric/trace backend | observability project |
| external transport/secret/TLS | constructor/ref/failure/security contract | vendor API, credential lifecycle and uptime | implementation/operations |
| `L6-marketplace` | optional body-free discovery/exposure seam only | listing/ranking/pricing/transaction/fulfillment | marketplace project |

## 7. 一票否决候选关联

| Candidate veto | P0 scope | Planned assertion direction |
|---|---|---|
| `VETO-CH-01` | identity/registry/descriptor core closure | missing/duplicate/illegal state or broken source symmetry blocks acceptance candidate |
| `VETO-CH-02` | cross-boundary responsibility | governance approval, method body, runtime execution, marketplace or SDK state enters Hub truth |
| `VETO-CH-03` | persistence/consistency | winner changes, Query writes, commit unknown is guessed, rollback/business rewrite occurs |
| `VETO-CH-04` | security/redaction | raw secret/body/provider response/full sensitive ref reaches artifact/root/output/observer |
| `VETO-CH-05` | configuration/activation | invalid source accepted, Missing inferred, configured failure fallback, partial graph/listener/task exposed |
| `VETO-CH-06` | profile/deployment | Deployment selects fake/inMemory/deterministic fixture/plaintext transport or incomplete graph |
| `VETO-CH-07` | code/documentation boundary | public Rust declaration/field/variant/payload/trait/method/callable lacks required English `///` |

These are test-plan veto candidates only. Formal 06 must define the actual decision, evidence sufficiency and signer contract.

## 8. 对上游设计的影响判定

| Conclusion | Changes 00~04? | Classification | Treatment |
|---|---|---|---|
| P0 includes all current core/test-cut contracts | no | test scope translation | 无回写 |
| P1 is product/cross-repo seam only | no | dependency priority | retain unselected prerequisites |
| P2 is future/out-of-scope | no | evolution boundary | controlled reopen only |
| later cut lacks exact typed oracle or contradicts source | yes | design/testability gap | stop cut, reopen owning 03/04 Step |

Current `待回写=0`, `阻塞待确认=0`, unresolved upstream blocker=`0`.

## 9. Formal §2 回填草稿

正式 §2 应保留：10 个 P0 goals、P0/P1/P2 definition、core range table、接缝-only boundary、7 个 veto candidates 和 residual-risk ownership。正式章节不得加入未在后续 Step 收稳的 TC/EV、命令、环境地址、阈值、实际结果或 acceptance decision。

## 10. 待确认与 Step 3 entry gate

| Item | Impact | Current rule |
|---|---|---|
| P1 product selection | integration execution only | retain product-neutral seam |
| exact 06 veto threshold | downstream acceptance | define candidate only; 06 decides |
| P2 load/capacity target | future operations | no hard number until owner confirms |
| future dynamic config or new responsibility | code/design contract | reject and controlled reopen |

| Gate | Result |
|---|---|
| SOP five questions answered | pass, 5/5 |
| P0/P1/P2 stable | pass |
| scope/non-scope and owners stable | pass |
| seam-only boundaries recorded | pass |
| veto candidates recorded without fake decisions | pass |
| current writeback/blocker/upstream blocker | 0/0/0 |
| formal 05 changed | 0 |

Step 2 is complete. Next allowed action: T025 / Step 3, extract exact test objects and test cuts from formal 03, DDD Step 16 and formal 04 without assigning full TC/evidence IDs yet.
