# L3-capability-hub 03 详细设计 Step 19：正式文档装配

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 19
> 书写规范：`standards/document/详细设计书写规范.md`
> 闭环标准：`standards/document/设计真相源闭环与可落码性标准.md`
> 正式输出：`projects/L3-capability-hub/03-详细设计.md`
> 创建日期：2026-07-25
> 当前模式：full-restart / continuous execution
> 状态：`03_step_19_completed_continuous_execution`

---

## 1. 装配目标与替换策略

本 Step 从 DDD Step 1~18 的 active canonical source 重建正式 `03-详细设计.md`，不对旧正式文档做章节修补。旧文档的 provider contract、allow/deny decision、cost ledger、KMS/Vault、runtime/tools execution、marketplace、governance approval、method body和local delivery lifecycle均与新版 `00/01/02` 冲突，只能作为 historical material。

正式 `03` 的职责是：

1. 使用书写规范规定的18章主链，且第5章以七个workspace module为主轴；
2. 为实现者提供文件、对象、Port、protocol、flow、state、persistence、error、idempotency、binding、observability与test cut的正式入口；
3. 对超大精确矩阵给出完整命名/数量闭包、强制算法与唯一规范性来源，不制造第二份易漂移schema；
4. 明确所有 public Rust struct/enum、field、variant、variant payload field、trait/callable必须具备英文`///`；
5. 给formal 04/05/06/07提供稳定输入，但不抢写config catalog、TC catalog、acceptance decision或commit boundary；
6. 不声称任何代码、测试、run、evidence、验收签署或commit已经存在。

## 2. 输入完整性

| Input | Status | Formal ownership |
|---|---|---|
| formal `00/01/02` | active formal baseline | requirement、architecture、HLD responsibility and owner boundary |
| DDD Steps 1~5 | completed | upstream、scope、constraints、layout、module axis |
| DDD Steps 6~8 | completed with controlled reopen synchronized | object、Port/repository、public protocol exact declaration source |
| DDD Steps 9~13 | completed with later sync | 83 flow、24 state family、persistence、17/51 error、concurrency/idempotency |
| DDD Steps 14~15 | completed | exact binding/runtime composition and 155+3 observability contract |
| DDD Steps 16~18 | completed | test cuts、implementation handoff、risk/reopen classification |
| old formal `03` | historical material | diagnostics only; no text inherited by authority |

Input gate：Step 1~18 complete，unresolved upstream blocker=`0`，two L0-core design-sync debts are non-blocking，target implementation repository is a future implementation prerequisite。

## 3. 正式章节唯一来源表

| Formal chapter | Primary canonical source | Secondary source | Formal minimum content |
|---|---|---|---|
| 1 上游关系 | Step 1 §§5~7 | formal 00/01/02 | authority、historical exclusion、rollback rules |
| 2 目标范围 | Step 2 §§5~7 | formal 02 §12 | objectives、in/out scope、implementable surface |
| 3 实现约束 | Step 3 §§5~7 | Rust/coding/repo standards | language、dependency、security、git/comment gates |
| 4 文件布局 | Step 4 §§6~7 | Steps 5/14 final dependency sync | 7 members、paths、file owner、Cargo edge |
| 5 模块契约 | Step 5 §6；Step 6 §§7~16/19；Step 7 final | Steps 8~16 module deltas | seven modules each with files/objects/ports/functions/errors/tests |
| 6 全局索引 | Step 6 §19；Step 7 exact indexes；Step 8 §14.1 | Step 17 §5 | 43+7 objects、36 Ports、22/110 repositories、250 public types |
| 7 协议契约 | Step 8 §§6~14 | Steps 12~14 sync | shared carriers、26/33/6/10/8 exact protocol families |
| 8 函数级flow | Step 9 exact cards and final §41 | Steps 11~15 | 83 named flows、phase/effect/error/replay source |
| 9 状态机 | Step 10 §§15~72 | Step 13 two-state sync | 24 families、111 variants、638 pairs、owner/guard/test links |
| 10 持久化 | Step 11 §§6~18 | Steps 13/14 resolution sync | 22/110 exact source、UoW/order/crash/parity |
| 11 错误恢复 | Step 12 §§7~56 | Steps 13/14 sync | stable owners、17 errors、51 issues、83 mappings、recovery |
| 12 并发幂等 | Step 13 §§7~26 | Step 14 commit-resolution sync | 40 keys、four digests、race/replay/reentry/unknown |
| 13 配置与绑定 | Step 14 §148 | Step 18 reopen table | `13.1~13.12` exact binding source and 04 handoff |
| 14 观测审计 | Step 15 §§148~150 | Step 16 observability cuts | 60/48/27/20+3、redaction、backend reopen |
| 15 测试切口 | Step 16 §§4~14 | Steps 9~15 | module/83/24/22/12/12 cuts and planned commands only |
| 16 实施承接 | Step 17 §§5~13 | Step 18 prerequisites | implementation units、mandatory reads、closure/reopen gate |
| 17 风险待确认 | Step 18 §§1~9 | project ledger debts | 11 active classifications、owner/trigger/scope/action/target |
| 18 参考 | Steps 1~19 | standards/upstreams | active documents and normative calibration sources |

## 4. 规范性引用与正文压缩规则

### 4.1 Authority order

当正式正文摘要与校准矩阵存在粒度差异时，按以下顺序解释：

1. 正式 `00/01/02` 决定 responsibility、owner、scope与architecture；
2. 正式 `03` 决定实现入口、章节组织、硬门禁与canonical source定位；
3. 正式章节明确列出的当前 calibration exact section决定field/signature/variant/flow/matrix细节；
4. 若上述来源仍不闭合，停止受影响设计/实现并受控回开，不得由实现者自行补全。

旧正式文档、README shorthand、batch过程文本、参考项目领域语义和未来实现事实不参与该优先级。

### 4.2 Must remain embedded in formal text

| Content | Formal embedding rule |
|---|---|
| responsibility/non-responsibility | 全量写入；不得只给source link |
| 7-member/file/dependency structure | 全量写入owner/path表 |
| 43 HLD object owner index + 7 helpers | 全量命名 |
| 36 Port与22 repository trait owner index | 全量命名或按exact source family逐项定位；总数闭包必须出现 |
| 83 protocol/flow | `C01..C26/Q01..Q33/I01..I06/O01..O10/J01..J08`全部命名并映射exact source |
| 24 state families | 全部命名；variants/pair arithmetic与current/reserved/illegal规则必须出现 |
| transaction/recovery/idempotency algorithms | hard statements与phase/order表全量写入 |
| 17 errors/51 issues | exact closed-set source、owner与83 mapping coverage必须出现 |
| 155+3 observability | four-plane count/owner/redaction/reopen完整写入 |
| risks/reopen/prerequisites | 11 active项完整写入 |

### 4.3 May remain in calibration as normative exact matrix

以下超大矩阵允许在正式正文提供complete coverage index和exact section pointer，而不逐行复制；这不是可选延伸阅读：

- 250 public type的全部field-level Rust declaration；
- 22 repository trait / 110 method的逐method parameter/return/error表；
- 83 flow的全部逐语句pseudocode、每个branch call-count和effect table；
- 24 state family的638 ordered pair逐行矩阵；
- 51 issue literal、83 protocol error mapping的全部逐行映射；
- 60 log、48 metric、27 span、20 durable profile的每个allowlist字段。

正式正文必须对这些来源使用“规范性实现来源”措辞，禁止“示例”“建议”“其余类似”。

## 5. Rust declaration与结构体注释门禁

| Surface | Gate |
|---|---|
| public struct/newtype | declaration前必须有英文`///` |
| every public/private documented struct field in design contract | field逐项英文`///`；不得只注释struct |
| public enum | declaration前英文`///` |
| every enum variant | variant逐项英文`///` |
| every variant payload field | payload field逐项英文`///`；struct-like variant field不得写field-level`pub` |
| public trait / method / callable | declaration与每个public callable英文`///` |
| DTO/event/job/report/receipt/view | type、field、variant、payload、callable全覆盖 |
| source code ordinary comment/test name | English |

正式文档不新造一份简化Rust schema。凡正文展示代码声明，必须原样承接当前Step 6/7/8/12/14的Rustdoc-complete版本；其余声明以这些Step exact section为规范性来源。`scripts/checks/check_rustdoc_contract.sh`只是未来planned contract，本文不声称脚本或检查结果存在。

## 6. Cross-document closure assembly audit

| Review | Source | Formal result required |
|---|---|---|
| fields | Step 6 final source/constructor tables | every required field has caller DTO、typed read、derived rule、clock/id or existing carrier source |
| DTO construction | Steps 8/9 | 26/6/10/8 write/event/job inputs construct exact targets; 33 Query construct exact responses |
| Query page/marker/cursor | Steps 8/9/11 | 33/33 no-write、resolver-first、stable key/order/cursor、body-free degraded |
| state names | Steps 6/10/16 | exact Rust names; no lowercase/HLD aliases |
| transaction phase | Steps 9/11/13 | entry/invocation、local UoW/post-commit、Outbound A/B/C、Job plan/target/final separated |
| metadata/idempotency | Steps 8/13/14 | canonical fields/bytes/key/digest owner fixed; two L0-core debt noted |
| projection rebuild | Steps 9~11 | no core-truth repair; collect-before-mutate and exact source symmetry |
| artifact/materialization | Steps 6/9/11 | derived material/report/reference/capture use declared source and atomicity |
| observability | Step 15 | no observer authority or business-result change |
| 07 audit input | Steps 16/17 | exact object/protocol/flow/state/persistence/test source available per boundary |

## 7. Formal write batches

| Batch | Formal content | Gate |
|---|---|---|
| A | header + Chapters 1~4 | upstream/scope/constraints/layout source and old-material exclusion complete |
| B | Chapters 5~6 | module axis、object/Port/repository/protocol indexes and Rustdoc rule complete |
| C | Chapters 7~9 | protocol、83 flow、24 state family named coverage complete |
| D | Chapters 10~12 | persistence/error/idempotency hard algorithms and exact normative indexes complete |
| E | Chapters 13~15 | binding/observability/test cuts and controlled reopen complete |
| F | Chapters 16~18 | implementation handoff、11 active risks、references and final checks complete |

每批均使用本文件已有唯一来源，不改变已完成Step。正式写入完成后只做机械修正；若发现语义冲突，必须先回开来源Step并同步本装配表。

## 8. Forbidden carryover audit

| Forbidden old/current-external subject | Formal disposition |
|---|---|
| `ProviderContract`、provider quota/route/failover/runtime | historical only; replaced by body-free adapter descriptor/safe boundary |
| `CapabilityDecision`、allow/deny、policy refresh/cache | historical only; governance seam + formal exposure + controlled view, no runtime enforcement |
| `CostRecord`、billing/finance | out of scope; no local object/store/flow |
| KMS/Vault/secret value/path token | external owner; local `SecretRef` and safe summary only |
| governance approval/Policy/shared_rules/workflow | external owner; result ref/safe summary/seam only |
| method body/source/publication/execution | method-library owner; body-free relation/ref only |
| runtime/tools invocation/result/route | downstream owner; formal exposure/view/ref only |
| SDK package/client/cache/publication | L0-sdk owner; exposure consumer ref only |
| marketplace listing/ranking/pricing/transaction | marketplace owner; read-only ecosystem summary is not listing truth |
| local outbox/relay/attempt/DLQ/delivery status | forbidden; immutable snapshot/capture/stable intent only |
| raw audit/observability body or acceptance evidence | external/future owner; body-free ref and redacted projection only |

## 9. Formal completion checklist

| Check | Required result |
|---|---|
| 18 chapters in exact main chain | pass |
| every chapter carries calibration source | pass |
| Chapter 5 module-first | seven modules, each has owner/files/capability/contracts/functions/errors/tests |
| source/cardinality closure | `43+7 / 36 / 22+110 / 250 / 83 / 24+111+638 / 17+51 / 155+3` searchable |
| exact flow coverage | `26+33+6+10+8=83`, missing/extra/duplicate=`0/0/0` |
| state pair coverage | `239+98+301=638`, unclassified=`0` |
| field/DTO/state/phase closure | pass with exact source pointer |
| Rustdoc/structure comments | formal gate explicit; no undocumented declaration introduced |
| responsibility leakage | zero |
| fake evidence/implementation fact | zero |
| unresolved upstream blocker | zero |
| downstream handoff | formal 04 next; no implementation artifacts created early |

## 10. Formal assembly result

Formal `03-详细设计.md` has been rebuilt from the Step 1~18 canonical chain. During final assembly, the duplicated second Chapter 16~18 chain was removed and Chapter 13.2 was restored to the exact 27-row source in Step 14 §145.1. No historical provider/decision/cost/runtime content was adopted as authority.

### 10.1 Static assembly audit

| Check | Expected | Static result | Conclusion |
|---|---:|---:|---|
| unique main chapters | 18 | Chapters 1~18 each occur once | pass |
| Command IDs | `C01..C26` | 26 unique IDs, no gap | pass |
| Query IDs | `Q01..Q33` | 33 unique IDs, no gap | pass |
| Inbound IDs | `I01..I06` | 6 unique IDs, no gap | pass |
| Outbound IDs | `O01..O10` | 10 unique IDs, no gap | pass |
| Job IDs | `J01..J08` | 8 unique IDs, no gap | pass |
| protocol arithmetic | `26+33+6+10+8=83` | 83 exact entries | pass |
| state inventory | `24 / 111 / 638` | `239 + 98 + 301 = 638` | pass |
| object/helper/Port inventory | `43+7 / 36` | searchable exact baseline present | pass |
| repository/type inventory | `22/110 / 250` | searchable exact baseline present | pass |
| error/issue inventory | `17 / 51` | searchable exact baseline present | pass |
| binding inventory | `27 local/base + 9 external / 14 callables` | exact baseline plus 6/10/8 entry surfaces present | pass |
| observability inventory | `155 profiles + 3 events` | `60+48+27+20=155`, events=3 | pass |
| canonical configuration rows | 27 | Step 14 §145.1 row identity/shape/owner/presence/failure/04 destination preserved | pass |
| Markdown whitespace | no diff-check defects | `git diff --check` clean after header correction | pass |

These are design-document static checks. They are not implementation scans, test executions or acceptance evidence.

### 10.2 Rustdoc, responsibility and truthfulness audit

| Gate | Result |
|---|---|
| reduced Rust declaration | 0; formal text points to the Rustdoc-complete Step 6/7/8/12/14 declarations instead of reproducing partial schemas |
| structure/field/variant/callable comment gate | explicit English `///` requirement covers declarations, every struct field, enum variant, variant payload field, trait, method and public callable |
| responsibility leakage | 0; runtime/tools execution, marketplace listing, governance approval, method body, provider route/cost, secret body and delivery lifecycle occur only in exclusion/redline/historical contexts |
| fabricated implementation/test/run/evidence/signoff | 0 |
| fabricated commit | 0; no commit created or requested |
| unresolved upstream blocker | 0 |
| retained non-blocking debt | `CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001`; `CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001` |
| implementation prerequisite | target implementation repository remains absent; this does not block formal 04~07 design work |

## 11. Completion and handoff

Step 19 and formal `03-详细设计.md` are complete. `CH-PREREQ-03-FORMAL-ASSEMBLY-001` is now historical resolved. The next document must begin with the configuration-design SOP and writing standard, then initialize `04_config_calibration_flow.md` and record the missing old formal 04 disposition before Step 1.

```text
document = 03-详细设计.md
step = 19
status = 03_step_19_completed_continuous_execution
formal_03_completed = true
static_audit = passed
implementation_or_test_evidence_claimed = false
implementation_artifacts_created = false
next_allowed_action = initialize_04_config_calibration_flow
unresolved_upstream_blocker = none
commit_required = no
```
