# L3-capability-hub 05 测试方案 Step 5：建立需求 / 设计 / 配置追溯与覆盖

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 5
> 回填章节：`projects/L3-capability-hub/05-测试方案.md` §5
> 创建日期：2026-07-25
> 当前模式：full-restart / continuous execution
> 状态：`05_step_05_completed_continuous_execution`
> 真实性边界：本文只定义 planned coverage relationship；未创建或执行测试，未分配稳定 `TC-*`、真实 `EV-*`、run_id、artifact、report、验收结论或签署。

---

## 1. 本步目标、输入、输出与执行边界

| 项目 | 内容 |
|---|---|
| 目标 | 建立 `requirement/rule/acceptance direction -> design/config contract -> exact cut -> scenario family candidate -> case-family candidate -> evidence-family placeholder` 的正向追溯，以及从每个 exact cut 反查需求、规则和设计契约的反向追溯。 |
| 需求输入 | formal 00 §§7~14：`C-CH-1~5`、`FR-CH-001~016`、`BR-CH-001~037`、`NFR-CH-001~020`、`AC-CH-001~037`、`VF-CH-001~013`。 |
| 设计输入 | formal 01 §§3~16、formal 02 §§3~13、formal 03 §§3~15、DDD Step 16 exact test-cut registry。 |
| 配置输入 | formal 04 §§3~12、config Steps 11~12、`CFG-F-01..18`。 |
| 本步输出 | requirement-facing matrix、acceptance/veto direction matrix、171 exact `CUT-*` reverse registry、18 exact `CFG-F-*` reverse registry、orphan/duplicate/automation/evidence-gap audit和formal §5回填草稿。 |
| 留给 Step 6 | 稳定 `TC-*`、完整precondition/action/input/typed oracle/zero-effect oracle、case priority和每个用例的evidence placeholder。 |
| 留给 Step 13 | 稳定evidence ID、artifact/report schema、producer/consumer、path template、retention、redaction和archive lifecycle。 |

旧 formal 05 的 `TC-001..TC-012`、旧对象和旧环境拓扑不进入本矩阵。本文中的 `SCF-*`、`TCF-*`、`EVF-*` 分别是 scenario-family、test-case-family和evidence-family占位符，不是可执行用例或真实证据编号。

## 2. SOP 八问回答

| SOP 问题 | 收口答案 |
|---|---|
| 1. 每个 P0 需求对应哪些设计章节？ | 16个核心FR逐项映射formal 01责任/所有权/交互、formal 02对象/API/flow/state和formal 03对象/协议/flow/state/TX/binding/observation章节；37个核心BR和20个NFR也逐项映射，不以formal 00自证formal 00。 |
| 2. 每个 P0 需求至少有哪些测试场景？ | 每个FR至少映射一个正向、一个拒绝/降级或边界scenario family；跨域不变量再由BR/NFR矩阵补充。场景候选只到`SCF-*`，Step 6才展开可执行步骤。 |
| 3. 哪些场景必须自动化？ | 所有P0 exact cuts均为`required-planned`自动化候选；L0~L4可确定的断言不得只靠人工。真实产品或跨仓P1可条件执行，但不能替代P0。 |
| 4. 每个场景的证据如何编号？ | 本步只绑定`EVF-*` evidence family placeholder。稳定`EV-*`及schema由Steps 6/13定义，真实alias/run仅在实际执行后产生。 |
| 5. 哪些需求暂未覆盖？ | 核心`FR/BR/NFR`当前planned coverage空洞为0；外围`FR-CH-E01..E07`是P2，只有边界负向和`BR-CH-E001`约束，不计P0空洞。无量化目标的性能NFR在Step 10定义可判定方法，不伪造阈值。 |
| 6. 每个Step 3切口是否有需求/规则/设计来源？ | 是。171 exact DDD cuts和18 config failure cuts逐项登记；其中module/doc/codec/TX/binding/observer等design-risk cuts可能服务多个FR，但至少映射一个BR/NFR及exact formal 03/04 contract。 |
| 7. 每个P0需求/规则是否有cut、case候选和evidence ID？ | 是。每个核心FR/BR/NFR绑定exact cut或closed exact range、`TCF-*`和`EVF-*`；这只是Step 6/13的注册义务，不是实现存在性。 |
| 8. 覆盖矩阵是否通过停审？ | 是。171/171 DDD cuts、18/18 config cuts、16/37/20 FR/BR/NFR及37/13 AC/VF方向均通过正反向计数；orphan、duplicate、旧编号污染、P0 automation gap和unresolved conflict均为0。该结论仅表示planned traceability闭合。 |

## 3. 当前文档问题诊断与测试设计取舍

| 问题 | 旧材料风险 | 当前处理 |
|---|---|---|
| 覆盖主体错误 | 旧05围绕`MCPServer/A2ANode/ProviderContract/CapabilityDecision/CostRecord` | 仅使用formal 03 exact objects/protocols/cuts；旧主体命中数必须为0。 |
| 编号污染 | 旧`TC-001..012`无法回指新设计 | 全部retired，不建立alias；Step 6重新分配domain-qualified IDs。 |
| 需求自证 | 只把FR映射回formal 00或写“详见设计” | 每一行必须有formal 03/04可执行契约和exact cut。 |
| family掩盖成员 | 用`CUT-FLOW-C-*`声称26条flow已覆盖 | family矩阵便于阅读，但反向registry必须逐个列出83 flow IDs和全部171 exact IDs。 |
| evidence越级 | 在coverage表提前写真实`EV-*`、路径或pass | 本步仅`EVF-*`，结果状态统一为`planned/not_executed`。 |
| 自动化空洞 | 把边界、安全或配置项留作“人工确认” | 可由L0~L4确定的P0场景全部`required-planned`；人工评审只能辅助，不替代oracle。 |
| E2E越权 | 用runtime/tools执行、marketplace、governance approval端到端证明Hub | 这些仅作为negative responsibility-leakage corpus；Hub正向终点仍是typed exposure/ref/handoff boundary。 |

### 3.1 改动前后对比

| 维度 | Step 5 前 | Step 5 后 |
|---|---|---|
| requirement-facing coverage | 只有scope、cut inventory和layer owner，不能从单个FR/BR/NFR定位exact cut | 16 FR、37 BR、20 NFR逐项定位到formal 03/04 contract、cut和future case/evidence family |
| acceptance direction | formal 00有37 AC和13 VF，但formal 05尚无证据消费入口 | 37 AC和13 VF均有planned evidence-family consumer，当前状态统一`not_evaluated` |
| design-facing coverage | 171 DDD cuts和18 config cuts只有family抽取 | 189个exact obligation均有唯一反向registry row，可回指requirement/rule/design contract |
| automation | Step 4只固定layer strategy | 每个P0 trace item明确required L0~L4 automation intent；P1 live product保持conditional |
| case/evidence identity | 未建立Step 6/13移交边界 | 只建立`SCF/TCF/EVF` family placeholder，不提前分配稳定`TC/EV`或真实run |
| historical isolation | 旧05已登记为historical material | active matrices中旧对象、旧TC和旧产品拓扑均为0 |

### 3.2 Candidate identity contract

| Prefix | 含义 | 本步允许 | 本步禁止 |
|---|---|---|---|
| `SCF-*` | scenario family candidate | 表达正向/负向/边界风险族 | 充当可执行步骤或测试结果 |
| `TCF-*` | future case family candidate | 给Step 6稳定分配`TC-*`的归属域 | 声称test file/case已存在 |
| `EVF-*` | future evidence family placeholder | 给Step 13选择schema/producer/consumer的归属域 | 真实alias、digest、run_id、路径存在性 |

统一候选族：`IDENTITY`、`REGISTRY`、`DESCRIPTOR`、`GOVERNANCE`、`METHOD`、`EXPOSURE`、`TRACE`、`REFERENCE`、`DERIVED`、`PROTOCOL`、`STATE`、`TX`、`BINDING`、`CONFIG`、`OBSERVATION`、`BOUNDARY`、`NFR`。候选族不改变formal 03 exact owner和oracle precedence。

## 4. 核心功能需求正向覆盖矩阵：16/16

| 需求 ID | Design authority | Exact cut registration | Scenario / case / evidence family candidate | Automation | Planned status |
|---|---|---|---|---|---|
| `FR-CH-001` | 03 §§5~8 identity access-context objects/protocol/flows | `CUT-OBJ-CORE`;`CUT-FLOW-C-01`;`CUT-FLOW-Q-01..03`;`CUT-STATE-01..02` | `SCF-IDENTITY-CONTEXT`;`TCF-IDENTITY`;`EVF-DOMAIN` | required L1/L2 | covered-planned |
| `FR-CH-002` | 03 §§5~6/8~12 stable identity/version/digest | `CUT-FLOW-C-01..03`;`CUT-STATE-01`;`CUT-TX-02/08..10/15/22` | `SCF-IDENTITY-STABILITY`;`TCF-IDENTITY`;`EVF-TX` | required L1/L2 | covered-planned |
| `FR-CH-003` | 03 §§5~8 access review and body-free risk context | `CUT-FLOW-C-04`;`CUT-FLOW-Q-03`;`CUT-STATE-02`;`CUT-OBS-08/12` | `SCF-ACCESS-REVIEW-SEPARATION`;`TCF-IDENTITY`;`EVF-BOUNDARY` | required L1/L2/L3 | covered-planned |
| `FR-CH-004` | 03 §§5~10 registry truth and lifecycle | `CUT-FLOW-C-05..08`;`CUT-FLOW-Q-04..06`;`CUT-STATE-03`;`CUT-TX-01..07` | `SCF-REGISTRY-LIFECYCLE`;`TCF-REGISTRY`;`EVF-DOMAIN` | required L1/L2/L3 | covered-planned |
| `FR-CH-005` | 03 §§8~9 registry/exposure visibility semantics | `CUT-FLOW-C-06..08/19`;`CUT-FLOW-Q-04..06/15..17`;`CUT-STATE-03/09/10/14` | `SCF-VISIBILITY-SEMANTICS`;`TCF-REGISTRY`;`EVF-STATE` | required L1/L2 | covered-planned |
| `FR-CH-006` | 03 §§8~10 Jobs/derived reconciliation | `CUT-FLOW-J-01..06`;`CUT-FLOW-Q-24..28`;`CUT-STATE-15..17/24`;`CUT-TX-13/14/20/21` | `SCF-DERIVED-MAINTENANCE`;`TCF-DERIVED`;`EVF-JOB` | required L1/L2/L4 | covered-planned |
| `FR-CH-007` | 03 §§5~9 descriptor truth | `CUT-FLOW-C-09..10`;`CUT-FLOW-Q-07/10`;`CUT-STATE-04`;`CUT-FLOW-O-03` | `SCF-DESCRIPTOR-LIFECYCLE`;`TCF-DESCRIPTOR`;`EVF-DOMAIN` | required L1/L2 | covered-planned |
| `FR-CH-008` | 03 §§5~9 descriptor/safe-summary boundary | `CUT-FLOW-C-11..12`;`CUT-FLOW-Q-08..09`;`CUT-STATE-05..06`;`CUT-OBS-06..08/12` | `SCF-SAFE-SUMMARY`;`TCF-DESCRIPTOR`;`EVF-BOUNDARY` | required L1/L2/L3 | covered-planned |
| `FR-CH-009` | 03 §§7~9 body-free descriptor consumption | `CUT-FLOW-Q-07..10/17..19`;`CUT-OBJ-PROTOCOL`;`CUT-OBS-08/12` | `SCF-DESCRIPTOR-CONSUMPTION`;`TCF-DESCRIPTOR`;`EVF-PROTOCOL` | required L1/L2/L4 | covered-planned |
| `FR-CH-010` | 03 §§5~9 governance seam | `CUT-FLOW-C-13..15`;`CUT-FLOW-Q-11..12`;`CUT-FLOW-I-01`;`CUT-STATE-07` | `SCF-GOVERNANCE-SEAM`;`TCF-GOVERNANCE`;`EVF-SEAM` | required L1/L2/L4 | covered-planned |
| `FR-CH-011` | 03 §§5~8 access-review/governance separation | `CUT-FLOW-C-04/13..15`;`CUT-FLOW-Q-12`;`CUT-STATE-02/07`;`CUT-OBS-12` | `SCF-GOVERNANCE-SEPARATION`;`TCF-GOVERNANCE`;`EVF-BOUNDARY` | required L1/L2 | covered-planned |
| `FR-CH-012` | 03 §§5~9 method body-free relation | `CUT-FLOW-C-16..17`;`CUT-FLOW-Q-13..14`;`CUT-FLOW-I-02`;`CUT-STATE-08`;`CUT-FLOW-O-05` | `SCF-METHOD-RELATION`;`TCF-METHOD`;`EVF-SEAM` | required L1/L2/L4 | covered-planned |
| `FR-CH-013` | 03 §§5~10 trace/change/impact | `CUT-FLOW-C-22..23`;`CUT-FLOW-Q-20..23`;`CUT-STATE-11..13`;`CUT-FLOW-O-08` | `SCF-TRACE-IMPACT`;`TCF-TRACE`;`EVF-TRACE` | required L1/L2 | covered-planned |
| `FR-CH-014` | 03 §§5~9 formal exposure/controlled consumer view | `CUT-FLOW-C-18..21/26`;`CUT-FLOW-Q-15..19/31..32`;`CUT-STATE-09/10/14`;`CUT-FLOW-O-06..07` | `SCF-CONTROLLED-EXPOSURE`;`TCF-EXPOSURE`;`EVF-ENTRY` | required L1/L2/L4 | covered-planned |
| `FR-CH-015` | 03 §§8~9 formal visibility/applicability | `CUT-FLOW-C-18..21`;`CUT-FLOW-Q-15..18`;`CUT-STATE-09/10/14` | `SCF-FORMAL-VISIBILITY`;`TCF-EXPOSURE`;`EVF-STATE` | required L1/L2 | covered-planned |
| `FR-CH-016` | 03 §§8/10~13 capture/collaboration/impact | `CUT-FLOW-O-01..10`;`CUT-FLOW-C-22..23`;`CUT-FLOW-I-03..06`;`CUT-STATE-19/23`;`CUT-TX-17..20` | `SCF-CHANGE-COLLABORATION`;`TCF-TRACE`;`EVF-COLLABORATION` | required L2/L3/L4 | covered-planned |

## 5. 核心业务规则正向覆盖矩阵：37/37

| Rule ID | Exact design/cut owner | Negative or boundary scenario family | Case/evidence family | Status |
|---|---|---|---|---|
| `BR-CH-001` | 03 §§5/9；`CUT-OBJ-CORE`,`CUT-STATE-01`,`CUT-FLOW-C-01..03` | URL/provider/config/listing cannot substitute identity | `TCF-IDENTITY`;`EVF-BOUNDARY` | covered-planned |
| `BR-CH-002` | 03 §§8~10；`CUT-FLOW-C-05`,`CUT-STATE-03`,`CUT-TX-01..03` | registry without stable identity rejects | `TCF-REGISTRY`;`EVF-TX` | covered-planned |
| `BR-CH-003` | 03 §§8~9；`CUT-FLOW-C-06..08`,`CUT-FLOW-Q-06`,`CUT-STATE-03` | allowlist/availability-bit collapse rejects | `TCF-REGISTRY`;`EVF-STATE` | covered-planned |
| `BR-CH-004` | 03 §§5~8；`CUT-FLOW-C-09..12`,`CUT-FLOW-Q-07..10`,`CUT-OBS-12` | provider runtime/quota/route/cost/secret body rejects | `TCF-DESCRIPTOR`;`EVF-BOUNDARY` | covered-planned |
| `BR-CH-005` | 03 §§5~8/14；`CUT-FLOW-C-11`,`CUT-STATE-05`,`CUT-OBS-06/08/12` | summary cannot become policy/approval/enforcement | `TCF-DESCRIPTOR`;`EVF-BOUNDARY` | covered-planned |
| `BR-CH-006` | 03 §§5~9；`CUT-FLOW-C-13..15`,`CUT-FLOW-I-01`,`CUT-STATE-07` | local approval/Policy creation calls zero | `TCF-GOVERNANCE`;`EVF-SEAM` | covered-planned |
| `BR-CH-007` | 03 §§5~9；`CUT-FLOW-C-16..17`,`CUT-FLOW-I-02`,`CUT-STATE-08` | method body/source/version payload rejects | `TCF-METHOD`;`EVF-SEAM` | covered-planned |
| `BR-CH-008` | 03 §§8~10；`CUT-FLOW-C-18..21`,`CUT-FLOW-Q-15..19`,`CUT-STATE-09/10/14` | consumer/export/derived view cannot define exposure | `TCF-EXPOSURE`;`EVF-TX` | covered-planned |
| `BR-CH-009` | 03 §§8~10；`CUT-FLOW-Q-24..28`,`CUT-FLOW-J-01..06`,`CUT-STATE-15..17/24` | derived output has core-truth writes=0 | `TCF-DERIVED`;`EVF-JOB` | covered-planned |
| `BR-CH-010` | 03 §§8/10；all `CUT-FLOW-Q-*`,`CUT-TX-01` | read/consume/export identity mutations all zero | `TCF-IDENTITY`;`EVF-ZERO-EFFECT` | covered-planned |
| `BR-CH-011` | 03 §§8~10；`CUT-FLOW-J-01..06`,`CUT-STATE-15..17/24` | maintenance cannot create formal conclusion | `TCF-DERIVED`;`EVF-ZERO-EFFECT` | covered-planned |
| `BR-CH-012` | 03 §§7~8/14；`CUT-FLOW-Q-18/31`,`CUT-FLOW-O-06`,`CUT-OBS-12` | execution/allow-deny/provider result fields and writes zero | `TCF-BOUNDARY`;`EVF-BOUNDARY` | covered-planned |
| `BR-CH-013` | 03 §§5~7/13~14；`CUT-FLOW-C-12`,`CUT-BIND-05`,`CUT-OBS-08/12`,`CFG-F-08` | secret/runtime/cost/routing body never persists or emits | `TCF-BOUNDARY`;`EVF-SECURITY` | covered-planned |
| `BR-CH-014` | 03 §§5~9；`CUT-FLOW-C-13..15`,`CUT-FLOW-I-01`,`CUT-OBS-12` | governance approval/Policy/shared_rules writes zero | `TCF-GOVERNANCE`;`EVF-BOUNDARY` | covered-planned |
| `BR-CH-015` | 03 §§5~9；`CUT-FLOW-C-16..17`,`CUT-FLOW-I-02`,`CUT-OBS-12` | method body/type corpus rejected | `TCF-METHOD`;`EVF-BOUNDARY` | covered-planned |
| `BR-CH-016` | 03 §§7~8；`CUT-FLOW-Q-19/32`,`CUT-FLOW-C-26`,`CUT-OBS-12` | SDK package/client/cache body and mutation absent | `TCF-EXPOSURE`;`EVF-BOUNDARY` | covered-planned |
| `BR-CH-017` | 03 §§8~9/14；`CUT-FLOW-Q-27`,`CUT-FLOW-J-05`,`CUT-STATE-17`,`CUT-OBS-12` | listing/transaction/pricing/fulfilment writes zero | `TCF-DERIVED`;`EVF-BOUNDARY` | covered-planned |
| `BR-CH-018` | 03 §§8/14；`CUT-FLOW-Q-20/23/33`,`CUT-OBS-11/12` | telemetry/audit/cost material cannot source access truth | `TCF-TRACE`;`EVF-BOUNDARY` | covered-planned |
| `BR-CH-019` | 03 §§5~9；`CUT-FLOW-C-04/13`,`CUT-FLOW-Q-12`,`CUT-STATE-02/07` | review fact cannot advance governance state | `TCF-GOVERNANCE`;`EVF-STATE` | covered-planned |
| `BR-CH-020` | 03 §§8~12；`CUT-FLOW-C-01..03`,`CUT-STATE-01`,`CUT-TX-02/15` | merge/split/correct/retire only declared command path | `TCF-IDENTITY`;`EVF-TX` | covered-planned |
| `BR-CH-021` | 03 §§8~12；`CUT-FLOW-C-05..08`,`CUT-STATE-03`,`CUT-TX-02/15` | registry inclusion/exit/visibility explicit and versioned | `TCF-REGISTRY`;`EVF-STATE` | covered-planned |
| `BR-CH-022` | 03 §§8~12；`CUT-FLOW-C-09..12`,`CUT-STATE-04..06`,`CUT-TX-02/15` | descriptor replacement/summary revision explicit | `TCF-DESCRIPTOR`;`EVF-STATE` | covered-planned |
| `BR-CH-023` | 03 §§8~12；`CUT-FLOW-C-04/13..15`,`CUT-STATE-02/07`,`CUT-TX-02/15` | review/seam attach/replace/expire explicit | `TCF-GOVERNANCE`;`EVF-STATE` | covered-planned |
| `BR-CH-024` | 03 §§8~12；`CUT-FLOW-C-16..17`,`CUT-STATE-08`,`CUT-TX-02/15` | method relation establish/remove explicit | `TCF-METHOD`;`EVF-STATE` | covered-planned |
| `BR-CH-025` | 03 §§8~12；`CUT-FLOW-C-18..21`,`CUT-STATE-09/10`,`CUT-TX-02/15` | exposure/visibility changes only declared commands | `TCF-EXPOSURE`;`EVF-STATE` | covered-planned |
| `BR-CH-026` | 03 §§8~14；`CUT-FLOW-C-22..23`,`CUT-FLOW-O-01..10`,`CUT-FLOW-J-01..08` | every output has exact source/scope/result carrier | `TCF-TRACE`;`EVF-COLLABORATION` | covered-planned |
| `BR-CH-027` | 03 §§3/7~8；`CUT-MOD-DEP-01..03`,`CUT-FLOW-Q-18/31`,`CUT-OBS-12` | runtime/tools are runtime refs/consumers only | `TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |
| `BR-CH-028` | 03 §§3/7~8；`CUT-MOD-DEP-02`,`CUT-FLOW-I-01`,`CUT-OBS-12` | governance is runtime/event seam, never source dependency/truth | `TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |
| `BR-CH-029` | 03 §§3/7~8；`CUT-MOD-DEP-02`,`CUT-FLOW-I-02`,`CUT-OBS-12` | method-library body/source dependency absent | `TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |
| `BR-CH-030` | 03 §§3/7~8；`CUT-MOD-DEP-02`,`CUT-FLOW-Q-19/32`,`CUT-OBS-12` | SDK source/client/package owner absent | `TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |
| `BR-CH-031` | 03 §§3/13~14；`CUT-MOD-DEP-02`,`CUT-BIND-05`,`CUT-OBS-12`,`CFG-F-08` | secret/provider/cost product truth absent | `TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |
| `BR-CH-032` | 03 §§3/8/14；`CUT-MOD-DEP-02`,`CUT-FLOW-Q-27`,`CUT-OBS-12` | marketplace ownership/dependency absent | `TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |
| `BR-CH-033` | 03 §§3/14；`CUT-MOD-DEP-02`,`CUT-OBS-01..12` | observation projects only; store truth absent | `TCF-OBSERVATION`;`EVF-STATIC` | covered-planned |
| `BR-CH-034` | 03 §§8~9；`CUT-FLOW-C-13/18`,`CUT-STATE-07/09/10` | formal visibility cannot advance without valid seam | `TCF-EXPOSURE`;`EVF-STATE` | covered-planned |
| `BR-CH-035` | 03 §§8~9/14；`CUT-FLOW-C-04/11/13/18`,`CUT-STATE-02/05/07/09` | high-risk change preserves review/governance separation | `TCF-GOVERNANCE`;`EVF-TRACE` | covered-planned |
| `BR-CH-036` | 03 §§8~10/14；all `CUT-FLOW-C-*`,`CUT-FLOW-O-01..08`,`CUT-OBS-04` | key changes have declared trace/change/capture symmetry | `TCF-TRACE`;`EVF-DURABLE` | covered-planned |
| `BR-CH-037` | 03 §§8~10/14；`CUT-FLOW-O-09`,`CUT-FLOW-J-01..06`,`CUT-OBS-04` | derived/export output source/scope/result explicit | `TCF-DERIVED`;`EVF-DURABLE` | covered-planned |

## 6. 非功能需求正向覆盖矩阵：20/20

| NFR ID | Exact design/config owner | Scenario family and required oracle | Case/evidence family | Status |
|---|---|---|---|---|
| `NFR-CH-001` | 03 §§8/15；`CUT-FLOW-Q-01..33`,`CUT-FLOW-J-02..05` | core reads remain independently executable when derived surfaces are delayed; no fabricated P95 | `TCF-NFR-PERFORMANCE`;`EVF-NFR-PERFORMANCE` | covered-planned; quantitative method owned by Step 10 |
| `NFR-CH-002` | 03 §§10~12；`CUT-TX-01..22` | latency pressure never bypasses UoW/version/idempotency/truth oracle | `TCF-TX`;`EVF-TX` | covered-planned |
| `NFR-CH-003` | 03 §§8~10；`CUT-FLOW-Q-24..28`,`CUT-FLOW-J-01..06`,`CUT-TX-16/20/21` | derived failure/latency has core read/write calls=0 | `TCF-DERIVED`;`EVF-ZERO-EFFECT` | covered-planned |
| `NFR-CH-004` | 03 §§8~9；`CUT-FLOW-Q-24..28`,`CUT-STATE-15..17/24` | peripheral unavailable/partial/stale surfaces do not erase C-CH-1~5 truth | `TCF-DERIVED`;`EVF-STATE` | covered-planned |
| `NFR-CH-005` | 03 §§8~11；`CUT-FLOW-I-01..06`,`CUT-FLOW-Q-08..13/29..33`,`CUT-STATE-05..08/18` | delayed/unavailable external input produces typed wait/failure/degraded result, never synthetic truth | `TCF-REFERENCE`;`EVF-SEAM` | covered-planned |
| `NFR-CH-006` | 03 §§8/10~12；`CUT-FLOW-O-01..10`,`CUT-FLOW-J-08`,`CUT-STATE-19/23`,`CUT-TX-17..20` | Phase B/downstream failure leaves Durable local truth unchanged | `TCF-TX`;`EVF-COLLABORATION` | covered-planned |
| `NFR-CH-007` | 03 §§6~8/14；`CUT-OBJ-PROTOCOL`,`CUT-FLOW-I-01..06`,`CUT-OBS-06..08/12`;04 §§8/11 `CFG-F-08/16` | forbidden body corpus rejected before persistence/emission | `TCF-BOUNDARY`;`EVF-SECURITY` | covered-planned |
| `NFR-CH-008` | 03 §§5~9；`CUT-FLOW-C-11..12`,`CUT-FLOW-Q-08..09`,`CUT-STATE-05..06`,`CUT-OBS-08` | ref/safe summary cannot advance external truth or expose body | `TCF-DESCRIPTOR`;`EVF-BOUNDARY` | covered-planned |
| `NFR-CH-009` | 03 §§8~9；`CUT-FLOW-C-18..21`,`CUT-FLOW-Q-15..18`,`CUT-STATE-07/09/10/14` | unresolved prerequisite cannot become formal visible/consumable | `TCF-EXPOSURE`;`EVF-STATE` | covered-planned |
| `NFR-CH-010` | 03 §§5~9；`CUT-FLOW-C-04/13..15`,`CUT-FLOW-Q-12`,`CUT-STATE-02/07` | access review cannot create approval or advance governance state | `TCF-GOVERNANCE`;`EVF-ZERO-EFFECT` | covered-planned |
| `NFR-CH-011` | 03 §§8~10/14；`CUT-FLOW-C-01..23`,`CUT-FLOW-Q-20..23`,`CUT-FLOW-O-01..08`,`CUT-STATE-11..13` | change source/scope/impact/trace/capture symmetry | `TCF-TRACE`;`EVF-TRACE` | covered-planned |
| `NFR-CH-012` | 03 §§7~9；`CUT-FLOW-C-24..26`,`CUT-FLOW-Q-29..33`,`CUT-FLOW-I-01..06`,`CUT-FLOW-O-10`,`CUT-STATE-18` | exact kind/subject/state refs remain body-free and explain ownership | `TCF-REFERENCE`;`EVF-PROTOCOL` | covered-planned |
| `NFR-CH-013` | 03 §§8~10；`CUT-FLOW-Q-24..28`,`CUT-FLOW-O-09`,`CUT-FLOW-J-01..07`,`CUT-STATE-15..17/24` | derived/export/reconcile source, scope and terminal result explicit | `TCF-DERIVED`;`EVF-DURABLE` | covered-planned |
| `NFR-CH-014` | 03 §§9~12；`CUT-STATE-01/03/20`,`CUT-TX-08..16/22` | one winner, stable digest, stored replay; duplicate truth count=0 | `TCF-TX`;`EVF-TX` | covered-planned |
| `NFR-CH-015` | 03 §§8~12；`CUT-FLOW-C-09..21`,`CUT-FLOW-Q-01..33`,`CUT-STATE-04..10` | only declared Commands mutate descriptor/seam/relation/exposure | `TCF-STATE`;`EVF-ZERO-EFFECT` | covered-planned |
| `NFR-CH-016` | 03 §§8~10；`CUT-FLOW-Q-17/24..28`,`CUT-STATE-14..17/24`,`CUT-TX-16/21` | stale/partial/unavailable remains explicit; no current-truth reconstruction | `TCF-DERIVED`;`EVF-STATE` | covered-planned |
| `NFR-CH-017` | 03 §§7~9；`CUT-FLOW-C-26`,`CUT-FLOW-Q-18..19/31..32`,`CUT-FLOW-O-06..07`,`CUT-STATE-14` | runtime/tools/SDK consume one server boundary and have truth writes=0 | `TCF-EXPOSURE`;`EVF-ZERO-EFFECT` | covered-planned |
| `NFR-CH-018` | 03 §14；`CUT-OBS-01..12` | exact owner/cardinality/state/error boundary observable with safe projection | `TCF-OBSERVATION`;`EVF-OBSERVATION` | covered-planned |
| `NFR-CH-019` | 03 §§8/14；`CUT-FLOW-I-01..06`,`CUT-FLOW-O-01..10`,`CUT-FLOW-J-01..08`,`CUT-OBS-01..04/10` | dependency/collaboration/maintenance failure has typed owner and does not cancel business flow | `TCF-OBSERVATION`;`EVF-OBSERVATION` | covered-planned |
| `NFR-CH-020` | 03 §14；`CUT-OBS-04..12`,`CUT-FLOW-Q-33`;04 §11 `CFG-F-16` | observer cannot source truth, persist body or change carrier/UoW/retry | `TCF-OBSERVATION`;`EVF-SECURITY` | covered-planned |

## 7. 需求层验收方向的未来证据消费：37/37

Formal 00 的 `AC-CH-*` 是 formal 06 的重建输入，不是本 Step 的裁决结果。下表只固定 planned evidence consumer；当前统一为 `not_evaluated`。

| Acceptance ID | Requirement/rule direction | Planned evidence-family consumer | Current status |
|---|---|---|---|
| `AC-CH-001` | stable identity closure | `EVF-AC-IDENTITY` consuming `TCF-IDENTITY/STATE/TX` | not_evaluated |
| `AC-CH-002` | controlled registry closure | `EVF-AC-REGISTRY` consuming `TCF-REGISTRY/STATE/TX` | not_evaluated |
| `AC-CH-003` | explainable descriptor closure | `EVF-AC-DESCRIPTOR` consuming `TCF-DESCRIPTOR/BOUNDARY` | not_evaluated |
| `AC-CH-004` | governance and method seams | `EVF-AC-SEAMS` consuming `TCF-GOVERNANCE/METHOD` | not_evaluated |
| `AC-CH-005` | controlled exposure and change sensing | `EVF-AC-EXPOSURE` consuming `TCF-EXPOSURE/TRACE` | not_evaluated |
| `AC-CH-006` | `FR-CH-001` | consume §4 `FR-CH-001` mapped evidence families | not_evaluated |
| `AC-CH-007` | `FR-CH-002` | consume §4 `FR-CH-002` mapped evidence families | not_evaluated |
| `AC-CH-008` | `FR-CH-003` | consume §4 `FR-CH-003` mapped evidence families | not_evaluated |
| `AC-CH-009` | `FR-CH-004` | consume §4 `FR-CH-004` mapped evidence families | not_evaluated |
| `AC-CH-010` | `FR-CH-005` | consume §4 `FR-CH-005` mapped evidence families | not_evaluated |
| `AC-CH-011` | `FR-CH-006` | consume §4 `FR-CH-006` mapped evidence families | not_evaluated |
| `AC-CH-012` | `FR-CH-007` | consume §4 `FR-CH-007` mapped evidence families | not_evaluated |
| `AC-CH-013` | `FR-CH-008` | consume §4 `FR-CH-008` mapped evidence families | not_evaluated |
| `AC-CH-014` | `FR-CH-009` | consume §4 `FR-CH-009` mapped evidence families | not_evaluated |
| `AC-CH-015` | `FR-CH-010` | consume §4 `FR-CH-010` mapped evidence families | not_evaluated |
| `AC-CH-016` | `FR-CH-011` | consume §4 `FR-CH-011` mapped evidence families | not_evaluated |
| `AC-CH-017` | `FR-CH-012` | consume §4 `FR-CH-012` mapped evidence families | not_evaluated |
| `AC-CH-018` | `FR-CH-013` | consume §4 `FR-CH-013` mapped evidence families | not_evaluated |
| `AC-CH-019` | `FR-CH-014` | consume §4 `FR-CH-014` mapped evidence families | not_evaluated |
| `AC-CH-020` | `FR-CH-015` | consume §4 `FR-CH-015` mapped evidence families | not_evaluated |
| `AC-CH-021` | `FR-CH-016` | consume §4 `FR-CH-016` mapped evidence families | not_evaluated |
| `AC-CH-022` | peripheral enhancements do not block core | `EVF-AC-PERIPHERAL-ISOLATION` | not_evaluated |
| `AC-CH-023` | `BR-CH-001..009` core invariants | `EVF-AC-INVARIANT` | not_evaluated |
| `AC-CH-024` | `BR-CH-010..019` forbidden behavior | `EVF-AC-FORBIDDEN-WRITE` | not_evaluated |
| `AC-CH-025` | `BR-CH-020..026` explicit changes | `EVF-AC-EXPLICIT-CHANGE` | not_evaluated |
| `AC-CH-026` | `BR-CH-027..033` adjacent boundaries | `EVF-AC-ADJACENT-BOUNDARY` | not_evaluated |
| `AC-CH-027` | `BR-CH-034..037` governance/trace | `EVF-AC-GOVERNANCE-TRACE` | not_evaluated |
| `AC-CH-028` | `BR-CH-E001` peripheral truth isolation | `EVF-AC-PERIPHERAL-ISOLATION` | not_evaluated |
| `AC-CH-029` | Hub truth ownership | `EVF-AC-DATA-TRUTH` | not_evaluated |
| `AC-CH-030` | snapshot is not second truth | `EVF-AC-DATA-SNAPSHOT` | not_evaluated |
| `AC-CH-031` | references do not own body | `EVF-AC-DATA-REFERENCE` | not_evaluated |
| `AC-CH-032` | forbidden bodies remain absent | `EVF-AC-FORBIDDEN-BODY` | not_evaluated |
| `AC-CH-033` | `NFR-CH-001..003` | `EVF-NFR-PERFORMANCE` plus truth-fidelity families | not_evaluated |
| `AC-CH-034` | `NFR-CH-004..006` | `EVF-NFR-AVAILABILITY` | not_evaluated |
| `AC-CH-035` | `NFR-CH-007..010` | `EVF-NFR-SECURITY` | not_evaluated |
| `AC-CH-036` | `NFR-CH-011..017` | `EVF-NFR-TRACE-CONSISTENCY` | not_evaluated |
| `AC-CH-037` | `NFR-CH-018..020` | `EVF-NFR-OBSERVABILITY` | not_evaluated |

## 8. 一票否决方向的负向覆盖：13/13

| Veto ID | Exact negative coverage direction | Planned evidence family | Current status |
|---|---|---|---|
| `VF-CH-001` | five core closure families complete; no orphan core requirement/cut | `EVF-VF-CORE-CLOSURE` | not_evaluated |
| `VF-CH-002` | identity replacement corpus rejected; identity state/effects unchanged | `EVF-VF-IDENTITY` | not_evaluated |
| `VF-CH-003` | allowlist/runtime/cache/listing cannot substitute registry | `EVF-VF-REGISTRY` | not_evaluated |
| `VF-CH-004` | provider/secret/quota/route/cost/failover/retry body absent | `EVF-VF-DESCRIPTOR` | not_evaluated |
| `VF-CH-005` | approval/Policy/shared_rules dependencies and writes zero | `EVF-VF-GOVERNANCE` | not_evaluated |
| `VF-CH-006` | method body/source/type dependencies and writes zero | `EVF-VF-METHOD-BODY` | not_evaluated |
| `VF-CH-007` | Query/downstream/derived/event/job reverse writes zero | `EVF-VF-REVERSE-WRITE` | not_evaluated |
| `VF-CH-008` | draft/unresolved/unreviewed/not-governed candidates cannot be formal-visible | `EVF-VF-EXPOSURE` | not_evaluated |
| `VF-CH-009` | exact required change/trace/capture symmetry | `EVF-VF-TRACEABILITY` | not_evaluated |
| `VF-CH-010` | reserve/winner/digest/concurrency matrix has one truth | `EVF-VF-IDEMPOTENCY` | not_evaluated |
| `VF-CH-011` | cost/telemetry/marketplace/production body static and redaction corpus | `EVF-VF-FORBIDDEN-DATA` | not_evaluated |
| `VF-CH-012` | exact dependency graph and sibling import scan | `EVF-VF-DEPENDENCY` | not_evaluated |
| `VF-CH-013` | historical objects/thresholds/topology/TC IDs absent from active baseline | `EVF-VF-HISTORICAL-LEAKAGE` | not_evaluated |

## 9. Design/config coverage axes

| Axis | Canonical inventory | Exact cut owner | Requirement / acceptance direction | Primary coverage |
|---|---:|---|---|---|
| modules/dependency/Rustdoc | 7 modules;15 local edges;1 sibling edge | `CUT-MOD-01..07`,`CUT-MOD-DEP-01..03`,`CUT-MOD-DOC-01` | BR 027~033;VF 012;public documentation gate | L0 static |
| objects/helpers/protocol | 43 + 7 + 250 | `CUT-OBJ-CORE/HELPER/PROTOCOL/DIGEST` | all core FR;NFR 007/012/014/015 | L0/L1 generated inventory |
| Ports/repositories | 36 Ports;22 traits/110 methods | `CUT-PORT-LOCAL/EXTERNAL`,`CUT-REPO-ALL` | NFR 002/005/006/014/016/019 | L3 contract |
| protocol flows | 26 C + 33 Q + 6 I + 10 O + 8 J = 83 | exact `CUT-FLOW-*` | FR 001~016;BR 001~037;AC 001~037 | L2 semantics + L4 entry |
| state | 24 families/111 variants/638 pairs | `CUT-STATE-01..24` | lifecycle/explicit change/no reverse authority | L1 generated registry |
| transaction/concurrency | 22 | `CUT-TX-01..22` | NFR 002/006/014/016;VF 010 | L2/L3 fault/race harness |
| binding/runtime graph | 12 | `CUT-BIND-01..12` | dependency/profile/entry/fallback redlines | L1/L3/L4 |
| observation/redaction | 12;155 profiles + 3 events | `CUT-OBS-01..12` | NFR 007/018~020;VF 011 | L0/L1/L3 |
| config source/schema/profile | 18 modules/27 rows/21 env leaves/3 profiles | `CFG-F-01..05/15/17/18` | source/schema/profile/frozen gates | L1/L3 |
| config material/assembly | 9 external/6 sources/10 routes/Stage 0~7 | `CFG-F-06..11` | Missing/Disabled/no-fallback/no-partial graph | L3/L4 |
| activated failure fidelity | formal 03 typed error/effect semantics | `CFG-F-12..14/16` | no generic degradation, duplicate or observer cancellation | L2/L3/L4 |

## 10. Exact DDD cut reverse registry：基础与 Command 44/171

本节至§14是canonical reverse registry。每行只登记一个exact cut；`Requirement/rule`列允许多值，但不得为空。`Case/evidence`仍是future family candidate，不表示实现或执行。

### 10.1 Module/object/Port/repository：18/18

| Exact cut | Requirement / rule | Exact design contract | Scenario / case / evidence family | Status |
|---|---|---|---|---|
| `CUT-MOD-01` | all FR;NFR 007/012 | 03 §§3~7 `contracts` and 250 public types | protocol inventory/codec boundary;`TCF-PROTOCOL`;`EVF-STATIC` | covered-planned |
| `CUT-MOD-02` | FR 001~015;BR 001~009 | 03 §§5~6/9 `domain`,43 objects,24 state families | object/state invariant;`TCF-STATE`;`EVF-DOMAIN` | covered-planned |
| `CUT-MOD-03` | FR 001~016;NFR 002/014/015 | 03 §§5/8/10~12 application flow/UoW | Port/order/effect orchestration;`TCF-TX`;`EVF-FLOW` | covered-planned |
| `CUT-MOD-04` | NFR 002/006/014/016 | 03 §§5/10/13 infra authority/assembly | repository/builder parity;`TCF-BINDING`;`EVF-ADAPTER` | covered-planned |
| `CUT-MOD-05` | FR 001~016;BR 010~019 | 03 §§5/7/8/13 API mapping/barrier | API decode/map/no-cancel;`TCF-PROTOCOL`;`EVF-ENTRY` | covered-planned |
| `CUT-MOD-06` | FR 010/012/016;NFR 005/019 | 03 §§5/7/8/13 Worker six-source lifecycle | header/barrier/task/drain;`TCF-PROTOCOL`;`EVF-ENTRY` | covered-planned |
| `CUT-MOD-07` | FR 006/016;NFR 003/013/019 | 03 §§5/7/8/12~13 Jobs lifecycle | dispatch/plan/target/final;`TCF-DERIVED`;`EVF-JOB` | covered-planned |
| `CUT-MOD-DEP-01` | BR 027~033;VF 012 | 03 §§3~4 seven members/15 local edges | dependency graph;`TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |
| `CUT-MOD-DEP-02` | BR 027~033;VF 012 | 03 §§3~4 only `core-contracts` sibling edge | forbidden sibling import;`TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |
| `CUT-MOD-DEP-03` | BR 008/009/027~033;VF 007/012 | 03 §§3~5 selected graph entry boundary | entry cannot receive repository/adapter;`TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |
| `CUT-MOD-DOC-01` | design-risk-only;formal 03 §3.2 | 03 §3.2 English `///` on declaration/field/variant/payload/callable;no enum-field `pub` | Rustdoc source scan;`TCF-PROTOCOL`;`EVF-STATIC` | covered-planned |
| `CUT-OBJ-CORE` | FR 001~015;BR 001~009 | 03 §§5~6 object factories/invariants | valid/invalid object member matrix;`TCF-STATE`;`EVF-DOMAIN` | covered-planned |
| `CUT-OBJ-HELPER` | NFR 006/012/014;BR 026 | 03 §§6/12 seven canonical helpers | body-free channel/domain symmetry;`TCF-TX`;`EVF-DOMAIN` | covered-planned |
| `CUT-OBJ-PROTOCOL` | FR 001~016;NFR 007/012 | 03 §§6~7 250 public protocol types | construct/roundtrip/forbidden field;`TCF-PROTOCOL`;`EVF-PROTOCOL` | covered-planned |
| `CUT-OBJ-DIGEST` | NFR 014;VF 010 | 03 §12 four digest domains/canonical frames | permutation/domain vectors;`TCF-TX`;`EVF-DOMAIN` | covered-planned |
| `CUT-PORT-LOCAL` | NFR 002/014/015 | 03 §§6/13 27 local/base Ports | exact callable/Send/authority;`TCF-BINDING`;`EVF-ADAPTER` | covered-planned |
| `CUT-PORT-EXTERNAL` | NFR 005/006/012;BR 027~033 | 03 §§6/13 9 Ports/14 callables | Configured/Fake/Disabled/Missing;`TCF-BINDING`;`EVF-ADAPTER` | covered-planned |
| `CUT-REPO-ALL` | NFR 002/014/016;VF 010 | 03 §§6/10 22 traits/110 methods | exact key/index/version/order parity;`TCF-TX`;`EVF-ADAPTER` | covered-planned |

### 10.2 Command flows：26/26

| Exact cut | Requirement / rule | Exact design contract | Scenario / case / evidence family | Status |
|---|---|---|---|---|
| `CUT-FLOW-C-01` | FR 001/002;BR 001/020/036 | 03 §§7.2/8.2 establish access context | accepted/invalid/duplicate atomic identity;`TCF-IDENTITY`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-C-02` | FR 002;BR 020/036 | 03 §§7.2/8.2 correct identity | expected-version/stale/terminal winner;`TCF-IDENTITY`;`EVF-TX` | covered-planned |
| `CUT-FLOW-C-03` | FR 002;BR 020/036 | 03 §§7.2/8.2 retire identity | legal/terminal/no cascade;`TCF-IDENTITY`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-C-04` | FR 003/011;BR 005/019/023/035 | 03 §§7.2/8.2 record access review | body-free review/no approval truth;`TCF-GOVERNANCE`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-C-05` | FR 004;BR 002/021/036 | 03 §§7.2/8.2 register registry entry | identity precondition/duplicate/atomic sidecars;`TCF-REGISTRY`;`EVF-TX` | covered-planned |
| `CUT-FLOW-C-06` | FR 005;BR 003/021/036 | 03 §§7.2/8.2 update registry lifecycle | current/reserved/illegal/version;`TCF-REGISTRY`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-C-07` | FR 005;BR 003/021/036 | 03 §§7.2/8.2 update visibility basis | actual delta/no-op/invalid applicability;`TCF-REGISTRY`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-C-08` | FR 004/005;BR 003/021/036 | 03 §§7.2/8.2 retire registry | legal/terminal/no exposure cascade;`TCF-REGISTRY`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-C-09` | FR 007;BR 004/022/036 | 03 §§7.2/8.2 establish descriptor | registry precondition/body-bearing rejection;`TCF-DESCRIPTOR`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-C-10` | FR 007;BR 004/022/036 | 03 §§7.2/8.2 replace descriptor | predecessor/two-object/change symmetry;`TCF-DESCRIPTOR`;`EVF-TX` | covered-planned |
| `CUT-FLOW-C-11` | FR 008;BR 005/022/035/036 | 03 §§7.2/8.2 record risk summary | body-free/forbidden raw material;`TCF-DESCRIPTOR`;`EVF-SECURITY` | covered-planned |
| `CUT-FLOW-C-12` | FR 008;BR 013/022/031/036 | 03 §§7.2/8.2 attach secret reference | resolver symmetry/no credential body;`TCF-DESCRIPTOR`;`EVF-SECURITY` | covered-planned |
| `CUT-FLOW-C-13` | FR 010/011;BR 006/014/019/023/034~036 | 03 §§7.2/8.2 attach governance seam | review/ref prerequisites/no approval write;`TCF-GOVERNANCE`;`EVF-SEAM` | covered-planned |
| `CUT-FLOW-C-14` | FR 010/011;BR 006/014/023/035/036 | 03 §§7.2/8.2 replace governance seam | prior ref/state/no workflow mutation;`TCF-GOVERNANCE`;`EVF-SEAM` | covered-planned |
| `CUT-FLOW-C-15` | FR 010/011;BR 006/014/023/035/036 | 03 §§7.2/8.2 expire governance seam | legal/terminal/reason-source-version;`TCF-GOVERNANCE`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-C-16` | FR 012;BR 007/015/024/029/036 | 03 §§7.2/8.2 attach method relation | body-free ref/no method mutation;`TCF-METHOD`;`EVF-SEAM` | covered-planned |
| `CUT-FLOW-C-17` | FR 012;BR 007/015/024/029/036 | 03 §§7.2/8.2 remove method relation | terminal/wrong subject/no method mutation;`TCF-METHOD`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-C-18` | FR 014/015;BR 008/025/034/035/036 | 03 §§7.2/8.2 establish formal exposure | prerequisite/exposure-visibility atomic/no runtime allow;`TCF-EXPOSURE`;`EVF-TX` | covered-planned |
| `CUT-FLOW-C-19` | FR 005/014/015;BR 008/025/036 | 03 §§7.2/8.2 update applicability | source-version symmetry/no runtime call;`TCF-EXPOSURE`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-C-20` | FR 014/015;BR 008/025/036 | 03 §§7.2/8.2 suspend exposure | legal/illegal pair/declared propagation;`TCF-EXPOSURE`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-C-21` | FR 014/015;BR 008/016/025/036 | 03 §§7.2/8.2 retire exposure | exposure/visibility symmetry/no SDK mutation;`TCF-EXPOSURE`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-C-22` | FR 013/016;BR 026/036 | 03 §§7.2/8.2 record impact fact | exact change/trace/subject atomic;`TCF-TRACE`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-C-23` | FR 013/016;BR 026/036 | 03 §§7.2/8.2 record trace handoff | local Durable before optional failure;`TCF-TRACE`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-C-24` | NFR 012;BR 026/037 | 03 §§7.2/8.2 record reference state | kind/subject/state exact/no synthetic change refs;`TCF-REFERENCE`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-C-25` | NFR 007/012;BR 013/026 | 03 §§7.2/8.2 register document ref | body/schema-body rejection;`TCF-REFERENCE`;`EVF-SECURITY` | covered-planned |
| `CUT-FLOW-C-26` | FR 014;BR 012/016/026/030;NFR 017 | 03 §§7.2/8.2 register consumer ref | runtime/SDK typed ref/no execution/client truth;`TCF-REFERENCE`;`EVF-BOUNDARY` | covered-planned |

### 10.3 Query flows：33/33

| Exact cut | Requirement / rule | Exact design contract | Scenario / case / evidence family | Status |
|---|---|---|---|---|
| `CUT-FLOW-Q-01` | FR 001/002;NFR 001/014 | 03 §§7.3/8.3 get identity | visible/missing/degraded; all writes zero;`TCF-IDENTITY`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-Q-02` | FR 001/002;NFR 001/014 | 03 §§7.3/8.3 search identities | stable order/cursor/empty; no hidden scan;`TCF-IDENTITY`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-Q-03` | FR 003/011;BR 019;NFR 010 | 03 §§7.3/8.3 get review fact | optional body-free fact/absent; no approval;`TCF-GOVERNANCE`;`EVF-ZERO-EFFECT` | covered-planned |
| `CUT-FLOW-Q-04` | FR 004/005;BR 002/003;NFR 001 | 03 §§7.3/8.3 get registry entry | identity-linked visible/missing; no write;`TCF-REGISTRY`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-Q-05` | FR 004/005;BR 003/009;NFR 001/016 | 03 §§7.3/8.3 list registry entries | typed page/cursor/empty; no rebuild;`TCF-REGISTRY`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-Q-06` | FR 005/015;BR 003/008/034;NFR 009/016 | 03 §§7.3/8.3 get visibility semantics | source mismatch explicit optional surface;`TCF-EXPOSURE`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-Q-07` | FR 007/009;BR 004;NFR 008 | 03 §§7.3/8.3 get descriptor | exact body-free descriptor; no provider request;`TCF-DESCRIPTOR`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-Q-08` | FR 008;BR 005;NFR 008 | 03 §§7.3/8.3 get risk summary | closed safe-summary state; no policy;`TCF-DESCRIPTOR`;`EVF-SECURITY` | covered-planned |
| `CUT-FLOW-Q-09` | FR 008;BR 013/031;NFR 007/008 | 03 §§7.3/8.3 get secret safe summary | ref/state only; secret value zero;`TCF-BOUNDARY`;`EVF-SECURITY` | covered-planned |
| `CUT-FLOW-Q-10` | FR 007/009;BR 004/009;NFR 001 | 03 §§7.3/8.3 list descriptors | capability-bound page; no generic scan;`TCF-DESCRIPTOR`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-Q-11` | FR 010/011;BR 006/014/034;NFR 005/010 | 03 §§7.3/8.3 get governance seam | ref/state only; no approval body;`TCF-GOVERNANCE`;`EVF-SEAM` | covered-planned |
| `CUT-FLOW-Q-12` | FR 003/011;BR 019;NFR 010 | 03 §§7.3/8.3 get governance separation | review/seam separation; never allow/deny;`TCF-GOVERNANCE`;`EVF-ZERO-EFFECT` | covered-planned |
| `CUT-FLOW-Q-13` | FR 012;BR 007/015/029;NFR 012 | 03 §§7.3/8.3 get method relation | body-free relation; no source/body;`TCF-METHOD`;`EVF-SEAM` | covered-planned |
| `CUT-FLOW-Q-14` | FR 012;BR 007/024/029;NFR 012 | 03 §§7.3/8.3 list relations | kind-bound page; no cross-kind union;`TCF-METHOD`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-Q-15` | FR 014/015;BR 008/034;NFR 009/017 | 03 §§7.3/8.3 get exposure | exposure/visibility only; no runtime authorization;`TCF-EXPOSURE`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-Q-16` | FR 015;BR 008/034;NFR 009/016 | 03 §§7.3/8.3 get applicability | exact source-version pair; no runtime decision;`TCF-EXPOSURE`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-Q-17` | FR 014/015;BR 008/009;NFR 001/004/016 | 03 §§7.3/8.3 get controlled view | ready/stale/partial/unavailable explicit; no refresh;`TCF-EXPOSURE`;`EVF-STATE` | covered-planned |
| `CUT-FLOW-Q-18` | FR 014;BR 012/027;NFR 017 | 03 §§7.3/8.3 list runtime-tools consumable | consumer-bound view; execution calls zero;`TCF-BOUNDARY`;`EVF-ZERO-EFFECT` | covered-planned |
| `CUT-FLOW-Q-19` | FR 014;BR 016/030;NFR 017 | 03 §§7.3/8.3 get SDK boundary | server view only; no package/client/cache;`TCF-EXPOSURE`;`EVF-BOUNDARY` | covered-planned |
| `CUT-FLOW-Q-20` | FR 013;BR 018/026/036;NFR 011 | 03 §§7.3/8.3 get access trace | append-only page; refs preserved;`TCF-TRACE`;`EVF-TRACE` | covered-planned |
| `CUT-FLOW-Q-21` | FR 013;BR 026/036;NFR 011 | 03 §§7.3/8.3 get change impact | exact/trace-linked impact; no synthetic impact;`TCF-TRACE`;`EVF-TRACE` | covered-planned |
| `CUT-FLOW-Q-22` | FR 013/016;BR 026/036;NFR 006/019 | 03 §§7.3/8.3 get downstream summary | typed partial/unavailable; no downstream mutation;`TCF-TRACE`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-Q-23` | FR 013;BR 018/026/036;NFR 011/020 | 03 §§7.3/8.3 get audit handoff trace | body-free refs/states; no audit body;`TCF-TRACE`;`EVF-BOUNDARY` | covered-planned |
| `CUT-FLOW-Q-24` | FR 006;BR 009/011/037;NFR 003/004/013/016 | 03 §§7.3/8.3 search directory | projection page; stale/unavailable; no rebuild;`TCF-DERIVED`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-Q-25` | FR 006;BR 009/011/037;NFR 003/004/013 | 03 §§7.3/8.3 browse directory | browse projection only; no ranking/listing owner;`TCF-DERIVED`;`EVF-FLOW` | covered-planned |
| `CUT-FLOW-Q-26` | FR 006/013;BR 009/018/037;NFR 003/013 | 03 §§7.3/8.3 get audit export summary | summary only; no archive/evidence body;`TCF-DERIVED`;`EVF-BOUNDARY` | covered-planned |
| `CUT-FLOW-Q-27` | FR 006;BR 017/032;NFR 004/013 | 03 §§7.3/8.3 get ecosystem discovery | read-only summary; no marketplace listing/transaction;`TCF-DERIVED`;`EVF-BOUNDARY` | covered-planned |
| `CUT-FLOW-Q-28` | FR 006;BR 009/011/037;NFR 003/013/016 | 03 §§7.3/8.3 get reconciliation report | immutable scope/result; no rerun;`TCF-DERIVED`;`EVF-DURABLE` | covered-planned |
| `CUT-FLOW-Q-29` | FR 009/013;BR 013/026;NFR 007/012 | 03 §§7.3/8.3 get reference state | canonical kind-specific values; no raw body;`TCF-REFERENCE`;`EVF-PROTOCOL` | covered-planned |
| `CUT-FLOW-Q-30` | FR 009/013;BR 015/026/029;NFR 012 | 03 §§7.3/8.3 get document reference | typed ref/state; no document body;`TCF-REFERENCE`;`EVF-SECURITY` | covered-planned |
| `CUT-FLOW-Q-31` | FR 014;BR 012/027;NFR 017 | 03 §§7.3/8.3 get runtime-tools reference | ref/state only; no execution result;`TCF-REFERENCE`;`EVF-BOUNDARY` | covered-planned |
| `CUT-FLOW-Q-32` | FR 014;BR 016/030;NFR 017 | 03 §§7.3/8.3 get SDK reference | ref/state only; no SDK body;`TCF-REFERENCE`;`EVF-BOUNDARY` | covered-planned |
| `CUT-FLOW-Q-33` | FR 013;BR 018/033;NFR 012/018/020 | 03 §§7.3/8.3 get observability/audit reference | ref/state only; no telemetry/audit body;`TCF-OBSERVABILITY`;`EVF-BOUNDARY` | covered-planned |

### 10.4 Inbound, Outbound and Job flows：24/24

| Exact cut | Requirement / rule | Exact design contract | Scenario / case / evidence family | Status |
|---|---|---|---|---|
| `CUT-FLOW-I-01` | FR 010/016;BR 006/014/026/028;NFR 005/012 | 03 §§7.4/8.4 governance result ref consumer | header/schema/ref gate; typed receipt; no approval write;`TCF-GOVERNANCE`;`EVF-ENTRY` | covered-planned |
| `CUT-FLOW-I-02` | FR 012/016;BR 007/015/024/029;NFR 005/012 | 03 §§7.4/8.4 method asset ref consumer | body-bearing/duplicate rejection; no method body;`TCF-METHOD`;`EVF-ENTRY` | covered-planned |
| `CUT-FLOW-I-03` | FR 013/016;BR 026/036;NFR 006/011/019 | 03 §§7.4/8.4 downstream impact consumer | source/duplicate/delayed receipt; core writes zero;`TCF-TRACE`;`EVF-ENTRY` | covered-planned |
| `CUT-FLOW-I-04` | FR 001/007/016;BR 020/022/026;NFR 005/012 | 03 §§7.4/8.4 external source ref consumer | subject mismatch/duplicate; no identity/descriptor rewrite;`TCF-REFERENCE`;`EVF-ENTRY` | covered-planned |
| `CUT-FLOW-I-05` | FR 013/016;BR 018/026/033;NFR 011/020 | 03 §§7.4/8.4 audit material ref consumer | body/evidence/duplicate rejection; no audit body;`TCF-TRACE`;`EVF-ENTRY` | covered-planned |
| `CUT-FLOW-I-06` | FR 007/013/016;BR 004/022/026;NFR 012 | 03 §§7.4/8.4 document ref consumer | body/schema/duplicate rejection; no descriptor/document body;`TCF-REFERENCE`;`EVF-ENTRY` | covered-planned |
| `CUT-FLOW-O-01` | FR 002/016;BR 020/026/036;NFR 006/011 | 03 §§7.5/8.5 identity change outbound | A capture Durable, B collaboration, optional C bind independent;`TCF-TRACE`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-O-02` | FR 004/006/016;BR 021/026/037;NFR 003/013 | 03 §§7.5/8.5 registry change outbound | official source/snapshot/capture; report not source;`TCF-REGISTRY`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-O-03` | FR 007/016;BR 022/026;NFR 011/012 | 03 §§7.5/8.5 descriptor change outbound | body-free immutable snapshot;`TCF-DESCRIPTOR`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-O-04` | FR 010/016;BR 006/014/026/028;NFR 006/011 | 03 §§7.5/8.5 seam change outbound | no approval/policy copy;`TCF-GOVERNANCE`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-O-05` | FR 012/016;BR 007/015/026/029;NFR 011/012 | 03 §§7.5/8.5 method relation outbound | no method body/source;`TCF-METHOD`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-O-06` | FR 014/015/016;BR 008/012/025/026/027;NFR 006/017 | 03 §§7.5/8.5 exposure change outbound | no runtime allow/deny payload;`TCF-EXPOSURE`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-O-07` | FR 014/015/016;BR 008/009/025/026;NFR 006/016/017 | 03 §§7.5/8.5 consumer view availability outbound | source revision symmetry; no cache owner merge;`TCF-EXPOSURE`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-O-08` | FR 013/016;BR 026/036;NFR 006/011 | 03 §§7.5/8.5 impact identified outbound | exact identified impact; no synthetic source;`TCF-TRACE`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-O-09` | FR 006/016;BR 009/017/026/037;NFR 003/013 | 03 §§7.5/8.5 derived material outbound | four allowed source variants only; no listing;`TCF-DERIVED`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-O-10` | FR 009/013/016;BR 026/037;NFR 012 | 03 §§7.5/8.5 reference change outbound | kind/state/source exact; no raw body;`TCF-REFERENCE`;`EVF-COLLABORATION` | covered-planned |
| `CUT-FLOW-J-01` | FR 004/006/016;BR 009/011/026/037;NFR 003/013/014 | 03 §§7.6/8.6 registry reconciliation job | frozen plan/target/report; no registry repair;`TCF-DERIVED`;`EVF-JOB` | covered-planned |
| `CUT-FLOW-J-02` | FR 006/015/016;BR 008/009/011/025;NFR 003/004/016 | 03 §§7.6/8.6 refresh consumer view job | per-target outcome; no exposure/core mutation;`TCF-DERIVED`;`EVF-JOB` | covered-planned |
| `CUT-FLOW-J-03` | FR 006;BR 009/011/037;NFR 003/004/013 | 03 §§7.6/8.6 rebuild directory job | projection only; no source/ranking truth;`TCF-DERIVED`;`EVF-JOB` | covered-planned |
| `CUT-FLOW-J-04` | FR 006/013;BR 018/026/037;NFR 003/013/020 | 03 §§7.6/8.6 prepare audit export job | body-free summary; no evidence body;`TCF-DERIVED`;`EVF-JOB` | covered-planned |
| `CUT-FLOW-J-05` | FR 006;BR 017/032;NFR 004/013 | 03 §§7.6/8.6 rebuild ecosystem discovery job | read-only summary; no marketplace transaction;`TCF-DERIVED`;`EVF-JOB` | covered-planned |
| `CUT-FLOW-J-06` | FR 006/013;BR 009/011/037;NFR 003/013/016 | 03 §§7.6/8.6 derived reconciliation job | immutable report; no auto-rebuild truth;`TCF-DERIVED`;`EVF-JOB` | covered-planned |
| `CUT-FLOW-J-07` | FR 009/016;BR 026/037;NFR 005/012/019 | 03 §§7.6/8.6 refresh external references job | canonical state revision; no body/core repair;`TCF-REFERENCE`;`EVF-JOB` | covered-planned |
| `CUT-FLOW-J-08` | FR 016;BR 026/036;NFR 006/011 | 03 §§7.6/8.6 repair collaboration job | official snapshot + intent bind; no new source/event lifecycle;`TCF-TRACE`;`EVF-JOB` | covered-planned |

## 11. Exact state cut reverse registry：24/24

| Exact cut | Requirement / rule | Exact design contract | Scenario / case / evidence family | Status |
|---|---|---|---|---|
| `CUT-STATE-01` | FR 001/002;BR 001/020;NFR 014 | 03 §9 `CapabilityIdentityState` | current/reserved/illegal/terminal pairs;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-02` | FR 003/011;BR 005/019/023;NFR 010 | 03 §9 `CapabilityAccessReviewFactState` | review history/no approval advancement;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-03` | FR 004/005;BR 002/003/021;NFR 014 | 03 §9 `RegistryLifecycleState` | all current/reserved/illegal pairs;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-04` | FR 007;BR 004/022;NFR 015 | 03 §9 `AdapterDescriptorState` | draft-in-UoW/current/unsupported route;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-05` | FR 008;BR 005/022;NFR 005/008 | 03 §9 `DescriptorRiskConstraintSummaryState` | ready/partial/unavailable/supersede;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-06` | FR 008;BR 013/022/031;NFR 007/008 | 03 §9 `SecretHandlingSafeSummaryState` | stale/unavailable/forbidden; no secret truth;`TCF-STATE`;`EVF-SECURITY` | covered-planned |
| `CUT-STATE-07` | FR 010/011;BR 006/014/023/034/035;NFR 009/010 | 03 §9 `GovernanceSeamState` | attach/reactivate/expire/replace/forbidden; no approval;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-08` | FR 012;BR 007/015/024/029;NFR 005/012 | 03 §9 `CapabilityMethodRelationState` | active/stale/unresolved/removed/forbidden;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-09` | FR 014/015;BR 008/025/034;NFR 009/015 | 03 §9 `FormalExposureState` | prerequisite/current/terminal/no runtime advance;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-10` | FR 005/014/015;BR 008/025/034;NFR 009/015 | 03 §9 `FormalVisibilityState` | source-version symmetry/no authorization input;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-11` | FR 013;BR 026/036;NFR 011 | 03 §9 `TraceabilityState` | recorded/partial/handoff-pending/superseded;`TCF-STATE`;`EVF-TRACE` | covered-planned |
| `CUT-STATE-12` | FR 013;BR 026/036;NFR 011 | 03 §9 `CapabilityImpactState` | identified/partial/delayed/ignored/resolved;`TCF-STATE`;`EVF-TRACE` | covered-planned |
| `CUT-STATE-13` | FR 013/016;BR 026/036;NFR 006/011 | 03 §9 `DownstreamImpactSummaryState` | legal feedback revision; source truth writes zero;`TCF-STATE`;`EVF-TRACE` | covered-planned |
| `CUT-STATE-14` | FR 014/015;BR 008/009;NFR 004/016/017 | 03 §9 `ConsumerViewFreshnessState` | ready/stale/rebuilding/partial/unavailable; no mutation by Query/client;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-15` | FR 006;BR 009/011/037;NFR 003/004/013/016 | 03 §9 `DirectoryProjectionState` | rebuild/no-op/current; source/ranking writes zero;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-16` | FR 006/013;BR 009/018/037;NFR 003/013/020 | 03 §9 `AuditExportState` | ready/partial/stale/unavailable; no evidence body;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-17` | FR 006;BR 009/017/032/037;NFR 004/013 | 03 §9 `EcosystemDiscoveryState` | ready/partial/stale/unavailable; no listing truth;`TCF-STATE`;`EVF-STATE` | covered-planned |
| `CUT-STATE-18` | FR 009/013/016;BR 013/026;NFR 005/012 | 03 §9 `ReferenceResolutionValue` | kind-specific precedence/wrong kind/body rejection;`TCF-STATE`;`EVF-PROTOCOL` | covered-planned |
| `CUT-STATE-19` | FR 016;BR 026/036;NFR 006 | 03 §9 `CapabilityEventCaptureState` | Captured to IntentBound; no local delivery lifecycle;`TCF-STATE`;`EVF-COLLABORATION` | covered-planned |
| `CUT-STATE-20` | FR 002/004;BR 002/020/021;NFR 014 | 03 §9 `CapabilityIdempotencyState` | Reserved to Completed; winner immutable; no persisted Conflict;`TCF-STATE`;`EVF-TX` | covered-planned |
| `CUT-STATE-21` | FR 006;BR 011/026;NFR 013/014 | 03 §9 `CapabilityJobExecutionState` | Planned to Finalized only after all terminal;`TCF-STATE`;`EVF-JOB` | covered-planned |
| `CUT-STATE-22` | FR 006;BR 011/026;NFR 013/014 | 03 §9 `CapabilityJobExecutionTargetOutcome` | ordinal terminal cell single write;`TCF-STATE`;`EVF-JOB` | covered-planned |
| `CUT-STATE-23` | FR 016;BR 026;NFR 006/019 | 03 §9 `EventCollaborationStatus` | typed external outcomes; local state/write count zero;`TCF-STATE`;`EVF-COLLABORATION` | covered-planned |
| `CUT-STATE-24` | FR 006;BR 009/011/037;NFR 003/013/016 | 03 §9 `ReconciliationReportState` | immutable factory outcomes/new run new ID;`TCF-STATE`;`EVF-JOB` | covered-planned |

All `239 current + 98 reserved + 301 illegal = 638` exact pairs across 111 active variants inherit their owning row above. Step 6 must register a parameter dataset that identifies every pair; a sample per family is insufficient.

## 12. Exact transaction, consistency and concurrency cut reverse registry：22/22

| Exact cut | Requirement / rule | Exact design contract | Scenario / case / evidence family | Status |
|---|---|---|---|---|
| `CUT-TX-01` | all truth FR;BR 002/008/009;NFR 002/014/016 | 03 §§10.1~10.3 22/110 repository contract | success/missing/conflict/key/index/order parity;`TCF-TX`;`EVF-ADAPTER` | covered-planned |
| `CUT-TX-02` | BR 020~025;NFR 002/014/015 | 03 §§10.2~10.4 expected version/write constraints | create/update/append/insert timing; winner unchanged;`TCF-TX`;`EVF-ADAPTER` | covered-planned |
| `CUT-TX-03` | BR 036/037;NFR 002/011/014 | 03 §§10.4~10.5 same-UoW members/order | source/change/trace/material/capture/result all visible at Durable;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-04` | NFR 002/014;VF 010 | 03 §§10.4~10.7 staged failure rollback | fail each write; no member visible;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-05` | NFR 002/014/019;VF 010 | 03 §§10.5/11.6 rollback failure precedence | original error preserved; diagnostic independent;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-06` | NFR 002/014/016;VF 010 | 03 §§10.6/11 commit NotDurable | no accepted carrier/projection; exact recovery;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-07` | NFR 002/014/016;VF 010 | 03 §§10.6/12.7 commit Unknown | barrier + same tx ref + linearizable resolution; no guess;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-08` | FR 002;NFR 014;VF 010 | 03 §§12.1~12.3 reserve absent | one Reserved winner; effect allowed once;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-09` | FR 002;NFR 014;VF 010 | 03 §§12.2~12.3 same digest loser | stored replay; effect calls zero;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-10` | FR 002;NFR 014;VF 010 | 03 §§12.2~12.3 different digest loser | conflict; winner unchanged; effects zero;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-11` | NFR 014/016;VF 010 | 03 §§12.3/12.8 corrupt stored surface | `ConsistencyDefect`; no reconstruction/rerun;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-12` | NFR 014/016;VF 010 | 03 §§12.3/12.6 orphan Reserved | no second reserve/blind retry;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-13` | FR 006;BR 011;NFR 014 | 03 §§12.3/12.6 Job Reserved + Planned | exact frozen-plan reentry; no scope rescan;`TCF-TX`;`EVF-JOB` | covered-planned |
| `CUT-TX-14` | FR 006;BR 011;NFR 014/016 | 03 §§12.3/12.6 asymmetric Job journal | consistency defect; no plan regeneration;`TCF-TX`;`EVF-JOB` | covered-planned |
| `CUT-TX-15` | BR 020~025;NFR 002/014;VF 010 | 03 §12.4 two writers | one Durable winner; declared retry only;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-16` | FR 006;BR 009/011;NFR 003/016 | 03 §12.4 collect-before-mutate | deterministic union/one revision/no full scan;`TCF-TX`;`EVF-TX` | covered-planned |
| `CUT-TX-17` | FR 016;BR 026/036;NFR 006 | 03 §§10/12 Outbound Phase A crash | source/snapshot/capture atomic; no B before Durable;`TCF-TX`;`EVF-COLLABORATION` | covered-planned |
| `CUT-TX-18` | FR 016;BR 026;NFR 006 | 03 §§10/12 Outbound Phase B failure | local source/capture unchanged; no rollback/delivery state;`TCF-TX`;`EVF-COLLABORATION` | covered-planned |
| `CUT-TX-19` | FR 016;BR 026;NFR 006/014 | 03 §§10/12 Outbound Phase C race/Unknown | one stable intent bind/exact recovery;`TCF-TX`;`EVF-COLLABORATION` | covered-planned |
| `CUT-TX-20` | FR 006/016;BR 011/026;NFR 003/006/013 | 03 §§10/12 Job crash points | independently recoverable phases; journal/effect symmetry;`TCF-TX`;`EVF-JOB` | covered-planned |
| `CUT-TX-21` | FR 006;BR 009/011;NFR 003/016 | 03 §§10/12 cursor/index asymmetry | typed consistency error; no scan/fallback;`TCF-TX`;`EVF-ADAPTER` | covered-planned |
| `CUT-TX-22` | FR 002/016;NFR 014;VF 010 | 03 §§12.2/12.8 digest boundary | stable fields/domain separation/retry metadata excluded;`TCF-TX`;`EVF-DOMAIN` | covered-planned |

## 13. Exact binding cut reverse registry：12/12

| Exact cut | Requirement / rule | Exact design/config contract | Scenario / case / evidence family | Status |
|---|---|---|---|---|
| `CUT-BIND-01` | NFR 004/005;VF 008 | 03 §§13.1/13.9;04 §§5~9 typed root/Stage 0~7 | raw invalid/missing/conflict; no partial graph;`TCF-CONFIG`;`EVF-ASSEMBLY` | covered-planned |
| `CUT-BIND-02` | BR 027~033;NFR 004 | 03 §§13.2/13.12;04 §6 Local/Deployment authority | Local parity fake or Durable; Deployment fake=0;`TCF-CONFIG`;`EVF-ASSEMBLY` | covered-planned |
| `CUT-BIND-03` | NFR 004/005;VF 008 | 03 §§13.4/13.12;04 §6 Integration slots | Configured/Fake/Disabled exact; Missing blocks;`TCF-BINDING`;`EVF-ASSEMBLY` | covered-planned |
| `CUT-BIND-04` | BR 002/008/009;NFR 002/014 | 03 §13.3;04 §§6/9 27 local/base Ports | one authority; no private finder/partial prefix;`TCF-BINDING`;`EVF-ADAPTER` | covered-planned |
| `CUT-BIND-05` | BR 012~018/027~033;NFR 005/007/012 | 03 §13.4;04 §§6/8/9 9 Ports/14 callables | typed body-free result; no generic/fallback/raw response;`TCF-BINDING`;`EVF-ADAPTER` | covered-planned |
| `CUT-BIND-06` | FR 010/012/016;NFR 005/019 | 03 §13.6;04 §§6/9 six Worker sources | task/barrier/header/Disabled/Missing matrix;`TCF-BINDING`;`EVF-ENTRY` | covered-planned |
| `CUT-BIND-07` | FR 016;BR 026/032;NFR 006/012 | 03 §13.7;04 §§6/9 ten Outbound routes | official snapshot/exact route/no wildcard;`TCF-BINDING`;`EVF-ADAPTER` | covered-planned |
| `CUT-BIND-08` | FR 006;BR 011/026;NFR 013/019 | 03 §13.8;04 §§6/9 eight Jobs | closed dispatch/input/result/no generic execute;`TCF-BINDING`;`EVF-JOB` | covered-planned |
| `CUT-BIND-09` | NFR 002/005/006/014 | 03 §13.10;04 §§7/11 phase retry | exact temporary/timeout effect proof; no Unknown/codec/permanent retry;`TCF-CONFIG`;`EVF-ADAPTER` | covered-planned |
| `CUT-BIND-10` | NFR 006/019 | 03 §§13.6/13.8/13.10;04 §11 shutdown | stop/drain/join; original failure preserved; no queue/DLQ lifecycle;`TCF-BINDING`;`EVF-ENTRY` | covered-planned |
| `CUT-BIND-11` | NFR 007/012/014 | 03 §§12.2/13.10;04 §7 codec/header | strict serde/raw bounded header/SHA; no generic Value/Debug;`TCF-PROTOCOL`;`EVF-DOMAIN` | covered-planned |
| `CUT-BIND-12` | BR 027~033;VF 012 | 03 §13.11;04 §12 sibling prerequisite | `core-contracts` compatible or blocked; no copied replacement;`TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |

## 14. Exact observability/redaction cut reverse registry：12/12

| Exact cut | Requirement / rule | Exact design/config contract | Scenario / case / evidence family | Status |
|---|---|---|---|---|
| `CUT-OBS-01` | BR 036/037;NFR 018~020 | 03 §§14.1~14.2 60 log profiles | exact owner/key/level/terminal/allowlist;`TCF-OBSERVATION`;`EVF-OBSERVATION` | covered-planned |
| `CUT-OBS-02` | NFR 018~020 | 03 §14.3 48 metric profiles | 34/12/2 kinds; closed labels; selector uniqueness;`TCF-OBSERVATION`;`EVF-OBSERVATION` | covered-planned |
| `CUT-OBS-03` | NFR 018~020 | 03 §14.4 27 spans + 3 events | lifecycle/link/timeout non-cancellation;`TCF-OBSERVATION`;`EVF-OBSERVATION` | covered-planned |
| `CUT-OBS-04` | BR 036/037;NFR 011/013/018~020 | 03 §14.5 20 Durable profiles | exact carrier/Durable/symmetry; Unknown emits none;`TCF-OBSERVATION`;`EVF-DURABLE` | covered-planned |
| `CUT-OBS-05` | NFR 018/020 | 03 §14.6 Off mode | no field construction/sink/fallback; business bytes equal;`TCF-OBSERVATION`;`EVF-SECURITY` | covered-planned |
| `CUT-OBS-06` | BR 013/033;NFR 007/020 | 03 §14.6 Redacted required field | entire emission rejected; business unchanged;`TCF-OBSERVATION`;`EVF-SECURITY` | covered-planned |
| `CUT-OBS-07` | BR 033;NFR 018/020 | 03 §14.6 optional/atomic correlation | optional omit; historical group all-or-none;`TCF-OBSERVATION`;`EVF-SECURITY` | covered-planned |
| `CUT-OBS-08` | BR 013/015/018/033;NFR 007/008/020 | 03 §14.6 material classes | actor/secret/document/audit/private/external body reject;`TCF-OBSERVATION`;`EVF-SECURITY` | covered-planned |
| `CUT-OBS-09` | NFR 018/020 | 03 §14.6 eleven count readers | exact 4 Inbound + 6 Job + conditional audit count;`TCF-OBSERVATION`;`EVF-OBSERVATION` | covered-planned |
| `CUT-OBS-10` | NFR 019/020 | 03 §14.6 sink/redaction failure | one safe non-recursive fallback; caller/UoW/retry unchanged;`TCF-OBSERVATION`;`EVF-SECURITY` | covered-planned |
| `CUT-OBS-11` | BR 018/033;NFR 018/020 | 03 §§14.1/14.6 four planes | planes do not source each other or business decision;`TCF-OBSERVATION`;`EVF-OBSERVATION` | covered-planned |
| `CUT-OBS-12` | BR 012~018/027~033;NFR 007/020;VF 004~007/011 | 03 §14.6 forbidden owners | cost/secret/execution/listing/approval/method body profile count=0;`TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |

Reverse-registry shorthand is closed and mechanical: `FR 001` means `FR-CH-001`, `BR 012~018` means every exact ID from `BR-CH-012` through `BR-CH-018`, `NFR 018~020` means every exact ID from `NFR-CH-018` through `NFR-CH-020`, and `VF 004~007` means every exact ID from `VF-CH-004` through `VF-CH-007`. It never refers to historical or peripheral IDs.

## 15. Exact configuration-failure cut reverse registry：18/18

| Exact cut | Requirement / rule | Exact config/design contract | Scenario / case / evidence family | Status |
|---|---|---|---|---|
| `CFG-F-01` | NFR 004/005;VF 008 | 04 §§5/7/9/11 required artifact/module/leaf/ref | valid minimal vs missing required input; no root/constructor/entry;`TCF-CONFIG`;`EVF-CONFIG` | covered-planned |
| `CFG-F-02` | BR 013/033;NFR 007/020;VF 011 | 04 §§5/7/9/11 strict UTF-8 JSON parser/V0~V1 | BOM/comment/trailing/duplicate/unknown/null/coercion/oversize rejection; no raw token;`TCF-CONFIG`;`EVF-SECURITY` | covered-planned |
| `CFG-F-03` | NFR 004/005/016 | 04 §§5/7/9/11 bounded env precedence | invalid higher-priority env rejects; JSON fallback count=0;`TCF-CONFIG`;`EVF-CONFIG` | covered-planned |
| `CFG-F-04` | NFR 002/004/005 | 04 §§7/9/11 V1~V6 exact type/bound/name/profile/entry checks | min-1/max+1/type/case/cross-field rejection; no clamp/alias/fallback;`TCF-CONFIG`;`EVF-CONFIG` | covered-planned |
| `CFG-F-05` | BR 008/009/013;NFR 005/012/016 | 04 §§7/9/11 reference graph/family/reachability | orphan/cycle/wrong-family/collision rejects before provider;`TCF-CONFIG`;`EVF-ASSEMBLY` | covered-planned |
| `CFG-F-06` | NFR 004/005;VF 008 | 04 §§6/7/9/11 Missing versus explicit Disabled | omission rejects; legal Disabled alone constructs exact `NotConfigured`;`TCF-CONFIG`;`EVF-ASSEMBLY` | covered-planned |
| `CFG-F-07` | NFR 004/005;BR 031 | 04 §§6/8/9/11 configured provider/constructor | failure rejects whole candidate; fake/inMemory/Disabled fallback calls zero;`TCF-CONFIG`;`EVF-ASSEMBLY` | covered-planned |
| `CFG-F-08` | BR 013/031;NFR 007/008;VF 004/011 | 04 §§8/9/11 credential/TLS provider | unavailable/denied/malformed/expired/revoked/mismatch fail closed; no sensitive output;`TCF-CONFIG`;`EVF-SECURITY` | covered-planned |
| `CFG-F-09` | NFR 002/004/006 | 03 §13.9;04 §§9/11 Stage 0~7 builder | each stage/cleanup fault disposes complete prefix; original failure retained;`TCF-BINDING`;`EVF-ASSEMBLY` | covered-planned |
| `CFG-F-10` | NFR 004/005;VF 008 | 03 §§13.5~13.8;04 §§9/11 entry barriers | fail each API/Worker/Jobs prerequisite; listener/task/facade exposure=0;`TCF-BINDING`;`EVF-ENTRY` | covered-planned |
| `CFG-F-11` | FR 016;NFR 004/005/006 | 03 §§13.4/13.6/13.7;04 §§6/9/11 cardinality | fail each of 9 slots/6 sources/10 routes; reduced graph never active;`TCF-BINDING`;`EVF-ASSEMBLY` | covered-planned |
| `CFG-F-12` | NFR 002/005/006/014 | 03 §§8/11/13;04 §11 activated Port failures | exact typed failure; only proven temporary/timeout bounded retry;`TCF-CONFIG`;`EVF-ADAPTER` | covered-planned |
| `CFG-F-13` | BR 009/010;NFR 005/015/016 | 03 §§8/11;04 §11 Query/reference outcomes | normal partial/unavailable remains degraded no-write; malformed relation is `ConsistencyDefect`;`TCF-CONFIG`;`EVF-ZERO-EFFECT` | covered-planned |
| `CFG-F-14` | FR 016;NFR 006/014/019;VF 010 | 03 §§8/10~13;04 §11 Worker/Jobs/Outbound failures | exact receipt/journal/outcome/error; duplicate effect and fabricated marker count=0;`TCF-CONFIG`;`EVF-TX` | covered-planned |
| `CFG-F-15` | BR 008/009;NFR 004/005/006/016 | 04 §§9~11 frozen root/drift/active dependency | new candidate rejects or active Port fails; current root never reloads;`TCF-CONFIG`;`EVF-ASSEMBLY` | covered-planned |
| `CFG-F-16` | BR 018/033;NFR 018~020;VF 011 | 03 §14;04 §§8/11 observer/redaction | safe omission/non-recursive fallback; business result byte-equivalent;`TCF-OBSERVATION`;`EVF-SECURITY` | covered-planned |
| `CFG-F-17` | BR 027~033;VF 012/013 | 04 §§2/4/11 unsupported dynamic controls | config-center/admin/watch/hot-reload key/Port/worker/dependency count=0;`TCF-BOUNDARY`;`EVF-STATIC` | covered-planned |
| `CFG-F-18` | BR 013/031;NFR 005/016 | 04 §§8/10/11 rollback eligibility | revoked/expired/digest/profile-incompatible target rejects; fix-forward required;`TCF-CONFIG`;`EVF-CONFIG` | covered-planned |

## 16. Coverage-item stop review

| Coverage item | Source present | Design contract present | Scenario/case family present | Automation intent | Evidence family present | Review conclusion |
|---|---|---|---|---|---|---|
| `FR-CH-001..016` | 16/16 | 16/16 | 16/16 | required L0~L4 as mapped | 16/16 family placeholders | closed-planned |
| `BR-CH-001..037` | 37/37 | 37/37 | 37/37 | required | 37/37 family placeholders | closed-planned |
| `NFR-CH-001..020` | 20/20 | 20/20 | 20/20 | required; Step 10 expands methods | 20/20 family placeholders | closed-planned |
| `AC-CH-001..037` direction | 37/37 | requirement/rule owner fixed | future formal 06 consumer fixed | consumes required P0 automation | 37/37 planned families | closed-planned; all not_evaluated |
| `VF-CH-001..013` direction | 13/13 | negative owner fixed | veto-negative family fixed | required | 13/13 planned families | closed-planned; all not_evaluated |
| module/object/Port/repository | 18/18 exact cuts | formal 03 §§3~13 | member/family candidate fixed | L0~L3 required | placeholder present | closed-planned |
| protocol flows | 83/83 exact cuts | formal 03 §§7~8 | each ID individually registered | L2/L4 required | placeholder present | closed-planned |
| states | 24/24;638 pairs | formal 03 §9 | each family plus exact pair dataset obligation | L1 required | placeholder present | closed-planned |
| TX/concurrency | 22/22 | formal 03 §§10~12 | each injection/race/recovery owner fixed | L2/L3 required | placeholder present | closed-planned |
| binding | 12/12 | formal 03 §13;formal 04 | each profile/graph/entry boundary fixed | L1/L3/L4 required | placeholder present | closed-planned |
| observation | 12/12 | formal 03 §14 | owner/redaction/no-effect family fixed | L0/L1/L3 required | placeholder present | closed-planned |
| config failures | 18/18 | formal 04 §§5~11 | each failure ID individually registered | L1/L3/L4 required | placeholder present | closed-planned |

`closed-planned` means the design-time trace entry is complete. It is not a test, acceptance, coverage-percentage or release result.

## 17. Cross-coverage audit

| Audit item | Mechanical / design result | Gap or treatment |
|---|---|---|
| orphan core FR | `0`;16/16 exact IDs present | none |
| orphan core BR | `0`;37/37 exact IDs present | `BR-CH-E001` remains P2 boundary and is consumed by `AC-CH-028` |
| orphan NFR | `0`;20/20 exact IDs present | performance measurement detail remains owned by Step 10, not a trace gap |
| orphan AC/VF direction | `0`;37/37 AC and 13/13 VF present | all remain `not_evaluated` |
| DDD source exact cuts | source `171`;registry `171`;missing `0`;extra `0` | seven prefix placeholders excluded from identity count |
| duplicate DDD exact cut row | `0` | each exact cut has one canonical reverse row |
| config exact cuts | source `18`;registry `18`;missing `0`;extra `0` | binding overlap retains separate `CFG-F-*` identity |
| exact flow registration | `26/33/6/10/8 = 83/83` | family helpers cannot replace rows |
| state registration | `24/24`;future dataset obligation `638=239+98+301` | Step 6 must make pair identity observable |
| object/protocol/repository member orphan | family owners cover `43+7+250` and `22/110` inventories | Step 6 must enumerate parameter-member registries; sample-only implementation forbidden |
| P0 automation gap | `0`;all P0 cuts have L0~L4 required intent | L5 selected product remains conditional P1 |
| P0 evidence-family gap | `0` | stable EV identity/schema remains Step 13 authority |
| stable `TC-*` allocated early | `0` active IDs | old `TC-001..012` appears only in historical diagnosis |
| stable `EV-*` / run / artifact allocated early | `0` | no path existence or result claimed |
| duplicate semantic authority | `0` | typed terminal/repository/carrier/zero-effect precedence retained |
| historical object pollution | `0` in active matrices | old object names appear only in §3 diagnosis |
| responsibility leakage | `0` positive scenarios | execution/approval/method body/provider runtime/cost/marketplace/SDK client are negative assertions only |
| current upstream writeback / blocker | `0 / 0` | all oracles translate active 03/04 contracts |

## 18. Upstream impact, formal §5 fill draft and Step 6 gate

| Conclusion | Changes formal 00~04? | Treatment |
|---|---|---|
| requirement/design/config bidirectional mapping | no | test-only translation |
| exact member registries and generated 638-pair dataset needed | no | Step 6/7/9 and formal 07 implementation obligation |
| NFR performance has no inherited P95 | no | Step 10 defines executable method and formal 06 decides sufficiency; no invented threshold |
| selected product/cross-repo validation conditional | no | P1 prerequisite tracked in Steps 8/10/14 |

Formal §5 must include the 16-FR,37-BR,20-NFR positive matrices, AC/VF future-consumer summary, design/config axes, canonical count `171 exact CUT + 18 CFG-F`, exact-cut reverse registry or an equally explicit normative appendix, and the orphan/duplicate audit. It must mark design-time status as planned/not-executed/not-evaluated and must not compress exact flow/state/config identity into an unverifiable generic statement.

Step 6 may start only if it:

1. consumes every one of the 189 exact obligations without renaming;
2. allocates stable domain-qualified `TC-*` and maps every exact cut to at least one case or a trace-preserving justified merge;
3. gives every P0 case exact precondition, action, typed terminal, zero-effect oracle, data reference, layer, automation intent and future evidence reference;
4. keeps 83 flows individually registered and makes all 638 state-pair expectations identifiable;
5. does not allocate real run_id, evidence alias, artifact existence or pass/fail result.

Current `待回写=0`, `阻塞待确认=0`, unresolved upstream blocker=`0`.

### 18.1 待确认事项

| Item | Current treatment | Owner / trigger |
|---|---|---|
| P0性能如何形成可判定、非伪造的量化方法 | 不继承旧P95/30s/SLA；当前只保留truth优先与外围不阻塞oracle | Step 10设计measurement workload/method；formal 06决定证据充分性 |
| 171 cuts如何展开为稳定用例而不制造无意义一对一膨胀 | exact cut trace不得丢；允许共享helper和trace-preserving merge | Step 6逐cut分批分配`TC-*`并记录merge rationale |
| 638状态对如何形成可定位结果 | 必须有exact pair identity、expected class和失败定位，不接受family sample | Step 6 case registry + Step 7 generated dataset |
| selected durable/transport/provider/cross-repo产品 | 保持P1 conditional；缺失不影响P0 trace闭合，也不算pass | Steps 8/10/14和formal 07 preflight |
| stable evidence schema/path/retention | 本Step仅`EVF-*`，不得提前固定真实alias或声称路径存在 | Step 13 |

```text
document = 05-测试方案.md
step = 5
status = 05_step_05_completed_continuous_execution
next_allowed_action = enter_05_step_06_cases
formal_05_modified = false
test_execution_claimed = false
run_id_or_real_evidence_created = false
unresolved_upstream_blocker = none
commit_required = no
```
