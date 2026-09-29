# L4-archive 03 Step 17：详细设计到实施计划的承接与闭环复核

> 执行日期：2026-09-12。对应 `详细设计讨论流程_SOP.md` Step 17、`详细设计书写规范.md` §5.16、`设计文档讨论中间产物规范.md` §5.10；正式回填位置为 `03-详细设计.md` §16。
> 状态：`completed / design_handoff_ready_with_blockers / implementation_handoff_not_ready / continue_authorized`。本步不创建实施台账或 boundary skeleton；它们只能在正式 07 完成时创建。

## 1. Step 状态、输入与完成上限

| 项 | 结论 |
|---|---|
| 用户授权 | 连续完成全部 03；本步完成后按顺序进入 Step 18 |
| 输入 | 正式00/01/02、Step01～16、SOP Step17、书写规范§5.16、中间产物规范§5.10、可落码性标准、实施计划规范、Rust/目录/提交规范 |
| 当前事实 | 目标实现仓`/home/aris/Projects/quantalithos-archive`不存在；设计仓Git identity只读观察为`quantalithos-labs / quantalithos.ai@gmail.com`；未提交 |
| 本步输出 | 实施承接、前置阅读、十类闭环预审、命名/冲突、未来phase/commit boundary输入与暂停条件 |
| 可宣称 | 正式03装配后可供04/05/06/07继续设计；本地对象/协议/flow/state/transaction/test输入已具备唯一来源 |
| 不可宣称 | 已可编码、实现仓/baseline存在、外部合同ready、测试/验收通过、实施计划/ledger/skeleton已创建 |

## 2. SOP 问题回答、诊断与取舍

| 问题组 | 回答 |
|---|---|
| 哪些契约可进入实施计划？ | 六crate布局、26对象、8services、30入口、18状态、repositories/ports、事务/幂等、配置binding、观测与测试切口均可作为07输入；外部positive按blocker分段，不可被列为ready。 |
| 实施者需读什么？ | §4列正式00～07、对应boundary校准来源、Rust/目录/可落码/实施计划/代码台账/提交规范和真实Core layout；不能只读正式03摘要。 |
| 字段与输入能构造对象吗？ | 本地字段、typed refs、fixed sidecars、ID/version/context均在Step06～09闭合；owner/provider字段只能由正式port outcome构造，合同未闭合时明确Blocked，不交实现者猜。 |
| Query闭合吗？ | 五safe view、page/marker、visibility、public/private cursor边界已闭合；cursor codec/mapping仍local pending，continuation fail-closed。Archive无独立projection truth。 |
| 状态名一致吗？ | Step06 enum、Step09 flow、Step10矩阵、Step12 error与Step16 tests统一18状态主语；05/06/07尚未创建，不能声称跨未来文档已通过。 |
| phase boundary是否越界？ | 本步不拆phase/commit；未来07必须按可验证vertical slice建立boundary并确保前置surface在同boundary首批，不能引用后续才生成的result/evidence。 |
| 旧名/缺口如何处理？ | §10登记已修正漂移；external/config/local pending进入Step18和未来04/07 gate，不能由实现自行选择。 |
| 07如何承接？ | 引用正式03与精确Step文件，不复制成第二schema；正式03/05/06/07齐全后逐boundary执行交付实现前整体审计并创建implementation ledger与全部planned skeleton。 |

当前最大风险不是本地模型缺少字段，而是把“blocked但已定义的接口”误写成“生产可实现且已就绪”。因此本步使用三态：`locally_closed`、`blocked_external`、`future_document_required`，不使用笼统“全部可实现”。

## 3. 真相源与实施承接清单

| 事实 / 承接项 | 唯一真相源 | 后续使用 | 冲突处理 |
|---|---|---|---|
| 需求目标、owner红线、F/BR/NFR | 正式`00-需求文档.md` | 04～07范围与验收基线 | 不得由03或实现扩权；冲突回00 |
| architecture/依赖/source authority | 正式`01-架构设计.md` | compile/runtime/event/ref/adapter/fake与部署边界 | 不得以目录存在改依赖类型 |
| 6 CP、26对象、30入口骨架 | 正式`02-概要设计.md` | 03细化的分母；05/06/07覆盖 | 新主体需回退02 |
| 6 crates与planned文件 | Step04/05 | 07按allowed_scope和owner切boundary | planned路径不是现存源码 |
| fields/factories/helpers/safe views | Step06 | 实现逐对象还原；05生成fixture | 不得从正式摘要删字段或复制shadow type |
| repositories/ports/factory | Step07 | application/infra seam与fake/durable parity | 未定义method不得实现侧私加 |
| 3C/5Q/5E/17J DTO | Step08 | public/worker协议与stored replay | transport/provider未定不改logical schema |
| 30 flows / 32 method surfaces | Step09 | 编码顺序、effect/UoW boundary | 与Step07 callable冲突时暂停回设计 |
| 18状态主语 | Step10 | domain transition、public status、tests | Step10正式名优先；禁止global success state |
| store/UoW/sidecar/read-set | Step11 | durable schema/adapter与atomicity | backend必须满足语义，否则blocked |
| 六层错误/recovery | Step12 | public mapper、worker policy、operator posture | 不自定HTTP码或盲retry |
| operation key/concurrency/reentry | Step13 | idempotency store、worker resume | codec/hash/数值由04，不得fake私定 |
| config/external binding | Step14 | 04展开schema和值；07装配boundary | config不改变invariant/authority |
| telemetry/native audit | Step15 | host instrumentation；05安全测试 | 不新增generic audit truth/backend |
| minimal test cuts | Step16 | 05用例、06门禁、07required_checks | planned/not-run，不是evidence |

## 4. 实施前置阅读与事实检查

| 文档 / 检查 | 路径 / 内容 | 阅读目的 | 未满足处理 |
|---|---|---|---|
| 本项目正式设计链 | `projects/L4-archive/00-需求文档.md`～未来`07-实施计划.md` | 当前正式baseline与跨文档边界 | 04～07未完成前不得实施移交 |
| boundary对应校准 | `projects/L4-archive/design-calibration/03_ddd_step_*.md`及未来04～07来源 | 字段、trait、flow、state、test精确还原 | 07逐boundary列required_reads，不要求一次读全部 |
| 可落码性标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 交付前整体审计及每boundary开工复核 | 任一缺口暂停并回写设计 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` §5.10 | 十类跨文档闭环材料 | 不能只写“遵循标准” |
| 实施计划规范 | `standards/document/实施计划书写规范.md` | phase/commit、ledger/skeleton、evidence与交付纪律 | 07阶段必须重读完整规范/SOP |
| 代码实施台账规范 | `standards/document/代码实施台账与门禁规范.md` | implementation ledger与boundary gate schema | 07创建前读取；缺台账不得改代码 |
| 目录规范 | `standards/document/子项目目录与代码文件组织规范.md` | workspace/member/package/crate/bin/test路径 | 路径偏离先回设计 |
| Rust规范 | `standards/coding/rust.md` | planned Rust2024/MSRV1.93、英文identifier/rustdoc/comment、fmt/clippy实践 | toolchain/dependency未核验时暂停相应boundary |
| 提交规范 | `projects/README.md` §8.2及实施计划规范§4.9 | design中文subject/实现仓英文message、body/footer、scope与staged gate | 每次commit前重读；本轮不提交 |
| Git identity | 目标实现仓project-local `user.name/user.email` | 要求`quantalithos-labs / quantalithos.ai@gmail.com`且不改global | 实现仓不存在，当前观察不能代替未来检查 |
| Core真实契约 | `/home/aris/Projects/quantalithos-core/crates/contracts`及正式L0-core | 核验package、exports、path与语义 | 不符即停止受影响compile，不复制type |
| 目标实现仓 | `/home/aris/Projects/quantalithos-archive` | 当前不存在；未来确认目录与干净/用户改动 | 未获实施授权不得创建 |

## 5. 字段闭环预审

Step06包含全部字段级卡片；下表按对象族检查高风险必填字段组，不替代原卡片。`测试`只指Step16设计切口，验收证据留正式06且当前不存在。

| 对象族 / 关键字段 | 类型与来源 | 构造入口 / 持久落点 | 缺失处理 | 测试 / 验收 |
|---|---|---|---|---|
| `DeclaredArchiveScope`：subject/scope/selectors/exclusions/authority | contracts typed refs/set；C01 payload + formal authority | `declare/validate_shape`→内嵌ArchiveRequest | reject/block；不猜固定六域 | C01/source matrix；06待建 |
| `ArchiveRequest` / `RestoreRequest`：id/scope或bundle/owner-set/admission basis | ID source + typed command + formal authority | admit/reject/block→admission collection | Accepted缺basis/job为defect | C01/C02 atomic；06待建 |
| `ArchiveJob` / stage：request/kind/current stage/components/version/basis | admission + committed component refs | factory/advance/recompute→job+stage collections | missing component保持Partial/Blocked | J01/state；06待建 |
| binding/capture：source class/selector/requiredness/authority/contract/attempt/fence/version/coverage | scope expansion + SourceExportPort outcome | plan/bind/start/settle→binding/attempt/sidecars | external contract缺失exact slot Blocked | J02～J04/E02；06待建 |
| bundle/manifest/closure：request/revision/declared+actual entries/source refs/findings/seal basis | committed capture exact sets + ID/version source | J05 append immutable aggregate；J06 seal | missing/phantom/overfull拒绝，不补current truth | J05/J06/range；06待建 |
| integrity/compatibility：revision/fixed input/target/capability/evidence/finding/posture | committed bundle + formal ports | J07/J08 assessment collections | blocked/unknown/unsupported/integrityfailed | assessment tests；06待建 |
| placement/action：revision/operation/effect key/digest/fixed input/observations/location/tier/commit | J09/J10/J11 typed input + storage port | intent sidecar then action/aggregate histories | ACK/timeout不造commit/location | J09～J12；06待建 |
| governance decision/lifecycle：decision owner/version/scope/validity/action/block history | GovernanceDecisionPort + command/event | lifecycle/action stores | missing/conflict/hold→Blocked | C03/E03/J11/J12；06待建 |
| restore plan/item：request/revision/frozen owner/item/entries/receiver/material/eligibility | C02 request + assessments + storage + source/receiver ports | J13/J14 plan/item/material sidecar | per-owner Blocked/Partial；不跨owner | J13/J14；06待建 |
| handoff/outcome/compensation：item/receiver/material/effect key/authority/typed feedback/history | fixed item + current receiver resolve + formal authority/outcome | J15～J17/E05 histories/sidecars | Unknown只probe；不直写owner | restore concurrency；06待建 |
| operation result/claim/checkpoint：scope/channel/name/key/digest/result/ref/fence/sequence | metadata/job context + local typed sources/store | reserve/result/complete/checkpoint same UoW | missing result/sidecar=ConsistencyDefect | idempotency/fence；06待建 |

结论：本地字段和缺失姿态 `locally_closed`；external字段不是“缺字段”，而是 `blocked_external` 输入。operation/cursor codec和数值配置为 `future_document_required`，在04闭合前不允许positive production构造。

## 6. DTO / Consumer / Job 到对象构造闭环

| 输入契约 | 主要目标对象 | 字段来源与不得混同 | 缺失行为 | Flow |
|---|---|---|---|---|
| C01 RequestArchive | ArchiveRequest/Job/Stage/VisibilityBinding | actor/metadata来自trusted context；authority ref不等actor；scope不由workspace推导 | Rejected/Blocked | Step09 C01 |
| C02 RequestRestore | RestoreRequest/Job/Stage | bundle revision和owner set来自payload/current store；receiver mapping不在admission | NotAvailable/Blocked/Unsupported | C02 |
| C03 RequestLifecycleExecution | LifecycleExecution/action intent | decision ref来自formal owner；schedule/config不等authority | Blocked/Conflict | C03 |
| E01 ArchiveTrigger | admission对象/result | envelope source/dedup与payload scope分离 | quarantine/blocked | E01 |
| E02 SourceExportFeedback | attempt/coverage/captured record/findings | binding/attempt/fence/version exact；owner version不等RecordVersion | delayed/conflicting/unknown | E02 |
| E03 GovernanceDecisionChange | lifecycle decision/block history | event decision不是policy body；current recheck优先 | stale/conflicting/blocked | E03 |
| E04 StorageActionFeedback | action+placement或lifecycle | persisted target决定二选一路由；ACK不等commit | unmatched/conflict/unknown | E04/E04-L |
| E05 RestoreReceiverFeedback | handoff/outcome/item/plan | receiver/owner/item/material/effect exact；一个owner不代表全局 | partial/conflicting/unknown | E05 |
| J01～J04 | job/stage/binding/capture | expected version来自current read；J02 bind无probe | blocked/unknown/new explicit op | J01～J04 |
| J05～J08 | bundle/manifest/closure/assessments | all exact same revision；operation digest不等Bundle digest | incomplete/unsupported/integrityfailed | J05～J08 |
| J09～J12 | placement/lifecycle/actions | application key与external key分离；intent先于effect | CommitUnknown→J12 | J09～J12 |
| J13～J17 | plan/item/material/handoff/outcome/compensation | receiver mapping由J13解析/J15重验；Bundle不是写权 | per-owner Blocked/Unknown/Partial | J13～J17 |

## 7. Query response / view 闭环

| Query | Response/view与关键来源 | empty/not-visible/degraded | public ref/page规则 | 测试 |
|---|---|---|---|---|
| Q01 GetArchiveJobStatus | `SafeArchiveJobStatusViewDto`←request/job/stages/components同snapshot | absent/hidden/revoked→NotAvailable；component缺失→Partial/Unknown | safe refs only；cursor绑定principal/visibility/snapshot/order | Step16 Q01 |
| Q02 GetArchiveBundle | `SafeArchiveBundleViewDto`←bundle/manifest/entry/closure/placement/lifecycle | hidden entry不计数；sidecar缺失→Unknown/Blocked | locator/digest ref仅当前授权；no private cursor | Q02 |
| Q03 VerifyArchiveBundle | `SafeBundleVerificationViewDto`←matching assessments/findings | no assessment/unsupported/failed/unknown均独立 | assessment必须same revision/target；Query不重验 | Q03 |
| Q04 GetRestorePlan | `SafeRestorePlanViewDto`←plan/items/handoffs/outcomes | hidden owner不泄露；关联缺损→Unknown | per-item safe refs；page exact snapshot | Q04 |
| Q05 GetRestoreHandoffStatus | `SafeRestoreHandoffViewDto`←one handoff/item histories | absent/hidden统一NotAvailable；commitunknown不压平 | owner/receiver/material按披露裁剪 | Q05 |

所有Query严格no-write。Archive没有独立projection identity/rebuild；safe view在一个read snapshot即时组装。public cursor与repository cursor已分离，但codec/mapping未选时continuation保持Blocked，不能让实现者选择base64/JSON/内存map。

## 8. Public protocol 传递类型闭环

| Surface | 外层DTO / 二级类型 | 正式归属与定义 | duplicate/retry/缺失 | 依赖边界 / 测试 |
|---|---|---|---|---|
| Command result | 三独立response + `ArchiveCommandDisposition/Issue` | contracts Step08 | full stored response replay；异digest Conflict | no domain type leak；C01～C03 |
| Query | 五request/view/page/marker | contracts Step06/08 | no idempotency；cursor mismatch/visibility fail-closed | read-only ports；Q01～Q05 |
| Consumer | trusted envelope + 五payload + complete receipt | contracts Step08 | dedup replay；unsupported不解析；commitunknown不ACK complete | bus/event adapter only；E01～E05 |
| Job | `ArchiveJobMetadata` + 17 input/report | contracts Step08 | full report replay；partial explicit targets；new key for new input | worker→application；J01～J17 |
| Source material | SourceClass/AuthorityRef/MaterialClass/version/fence/coverage | contracts/domain Step06/07 | per-source blocked/unknown；不统一schema | runtime/ref/adapter；matrix tests |
| External effect | typed target/input/key/dispatch knowledge/observation | application/domain Step06/07 | intent-before-effect；MayHaveDispatched only probe | provider body absent；effect tests |
| Stored replay | operation key/input digest/complete result/surface ref | application Step06/07/11/13 | result missing=defect，不重算 | local store only；idem tests |

## 9. 状态、phase / commit boundary 与 accepted side-effect 预审

### 9.1 状态闭环

| 状态组 | 正式名称来源 | 触发/持久 | 测试与未来验收 | 结论 |
|---|---|---|---|---|
| admission/job/stage | Step10 §4.1～4.3 | C01/C02/E01/J01 + job/stage records | Step16 §8；06待建 | locally_closed |
| binding/capture/bundle/verification | Step10 §4.4～4.7 | J02～J08/E02 + exact records | Step16 §7/8 | locally_closed_with_external_blockers |
| placement/retrieval/lifecycle/action | Step10 §4.8～4.11 | C03/E03/E04/J09～J12 | Step16 §7/8 | locally_closed_with_external_blockers |
| restore plan/item/handoff/compensation | Step10 §4.12～4.15 | C02/E05/J13～J17 | Step16 §7/8 | locally_closed_with_external_blockers |
| idempotency/worker entry/claim | Step10 §4.16～4.18 | all non-query/worker control | Step16 §9 | locally_closed; codec/config pending |

### 9.2 Future phase / commit boundary输入

| Future boundary family | 必须包含的前置surface | 明确不得依赖后续 | required checks输入 |
|---|---|---|---|
| workspace/bootstrap + contracts/domain | exact Core path/exports、all current-boundary helper/ref/enums、domain invariants | provider schema、external success、evidence | contracts/domain suites + dependency scan |
| local store/UoW/idempotency | versioned read/write、sidecars、result replay、transaction probe、claim/fence | API/worker或external adapter来补store semantics | store/atomic/CAS/idem/fence contracts |
| admission/query vertical slices | authority/visibility ports/fakes、complete result、安全views | later worker/provider来补DTO/mapper；cursor success若codec未闭合 | 3C/5Q tests + no-write/redaction |
| source/bundle/assessment slices | source matrix、binding/capture、manifest exact-set、assessment ports | workspace/Artifact/audit ref替canonical；fake proof当integration | J02～J08/E02 + closure/concurrency |
| storage/lifecycle slice | fixed intents、decision/storage ports、J09～J12/E03/E04 | config授权动作、ACK当commit | effect unknown/reconcile/hold tests |
| restore slice | frozen plan/items/material/receiver/handoff/compensation | Bundle直写owner、cross-owner transaction、global restored | C02/Q04/Q05/E05/J13～J17 tests |
| runtime/telemetry/integration | validated bindings/required slots、entry facades、安全telemetry | fake production fallback、backend/evidence/readiness | config/observability + approved integration only |

具体phase/commit数量、顺序和allowed_scope只能由正式07在04/05/06完成后决定。每个boundary必须把所需contracts/helper/mapper/repository放入当前或更早boundary，不能借后续代码；必须预创建全部planned boundary ledger skeleton，初始只可planned/blocked/waiting。

### 9.3 Accepted side-effect inventory

| Flow family | Accepted local side effects | Outbox / external | 不能发生 |
|---|---|---|---|
| Command | reservation+complete result；按flow写request/job/stage或lifecycle/visibility | external effect不在admission UoW；outbox=[] | source capture、project状态、owner DB写 |
| Query | none | none | reservation/result/audit/cache/repair/probe |
| Consumer | reservation+mapped native record/history+receipt/result | ACK在commit后由host处理；outbox=[] | 以arrival/ACK造owner success |
| Job local-only | claim/read-set/native objects/report/result/checkpoint | outbox=[] | 日志代替history/result |
| Job external | committed intent/fixed sidecar；后续typed observation/history/report/result/checkpoint | exact port在Tx外；unknown只probe；outbox=[] | blind retry、provider body、直接上游写 |

`AR-HLD-Q-001` 未关闭，所以所有 flow 的 outbound outbox均为空；实现不得为满足通用模板发明事件。

## 10. 命名一致性、冲突与正反例

### 10.1 命名一致性

| 正式名称 | 禁用旧名 / 模糊名 | 结论 |
|---|---|---|
| `ArchiveStorePort` + `WorkerLeasePort` | generic repository manager / process mutex | Step07/11统一 |
| `ArchiveOperationKey(scope,channel,operation_name,idempotency_key)` | 拼接字符串key / event id / run id | Step13统一 |
| operation input digest | Bundle integrity digest/signature | 两namespace分离，算法都未冒充 |
| `SourceExport(SourceClass)` / `RestoreReceiver(RestoreOwnerRef)` | wildcard adapter / first matching provider | exact payload slot |
| `WorkspaceProjection` / `Auxiliary` | canonical workspace truth | 全链禁止升格 |
| `CommitUnknown` / `ReconcileRequired` | timeout failure / retryable success | Step10～13统一 |
| `NotAvailable` public surface | NotFound vs Forbidden存在性泄露 | Step08/12统一 |
| `WorkerLeasePort` | WorkerClaimPort acquire旧名 | Step10/11已校正 |
| `ArchiveRuntimeAssembly::Ready` | product readiness / integration ready | Step14/15明确限定 |
| 6 crate短role名 | l4_archive_* / jobs crate | Step04/05统一 |

### 10.2 冲突与修正记录

| ID | 冲突 / 影响 | 修正 | 状态 |
|---|---|---|---|
| `AR-DOC-03-01` | contracts/domain对象owner若不分会造成反向依赖 | 固定2 contracts+24 domain | closed in Step05/06 |
| `AR-DOC-03-02` | J02可能先bind后持久intent且无probe | Planned先commit；unknown保持Blocked，不借J04 | closed in Step09/11/13 |
| `AR-DOC-03-03` | C02提前要求receiver mapping | mapping只在J13解析、J15重验 | closed in Step08/09/11 |
| `AR-DOC-03-04` | WorkerEntry durable语义与claim trait命名漂移 | entry仅进程内；统一`WorkerLeasePort` | closed in Step10/11 |
| `AR-DOC-03-05` | operation digest与Bundle digest混同风险 | 本地等价digest独立；具体binding pending | closed boundary / pending implementation |
| `AR-DOC-03-06` | config/fake可能默认positive provider | required slot fail-closed；fake仅test | closed in Step14 |
| `AR-DOC-03-07` | telemetry可能形成generic audit/backend truth | native record与runtime telemetry分层 | closed in Step15 |
| `AR-DOC-03-08` | historical 03可能被逐段继承 | Step19删除后整体重建 | pending Step19 |

正例：J15 boundary先读取plan/item/material与current receiver mapping，提交fixed handoff intent后才调用receiver；unknown由J16读取原key/input probe。反例：用当前config重建旧handoff并换key重发。

正例：Q02从一个committed snapshot即时组装safe view，visibility撤销返回NotAvailable且不写read audit。反例：Query触发retrieve或把repository cursor直接回传。

## 11. 未进入实施事项与移交门禁

| 未完成事项 | 所需 owner / 文档 | 未完成前姿态 |
|---|---|---|
| 正式03装配与用户停审 | 当前Step19/用户 | 不进入04 |
| 正式04配置 | Archive后续设计 | provider/codec/budget/secret/profile均未定 |
| 正式05测试 | Archive后续设计 | Step16不是完整case或已运行结果 |
| 正式06验收 | Archive后续设计 | 无AC/EV/verdict/signoff |
| 正式07实施计划 | Archive后续设计 | 无phase/commit、implementation ledger、skeleton或design baseline |
| external blockers | `AR-UP-001~009` owners、全局依赖 owner | 受影响positive integration blocked |
| local questions | operation/cursor codec、store/provider、workload/NFR | production path fail-closed |
| implementation repo | 用户/实施授权 | 当前不存在且本轮不创建 |

实现移交只有在以下全部成立后才可能：正式00～07完成并停审；07按每个phase/commit boundary审计正式03/05/06/07；所有当前boundary blocker关闭或该boundary明确blocked；implementation ledger和全部planned skeleton创建但未伪造事实；目标仓、project-local Git identity、toolchain和Core path重新核验；用户明确授权实现。当前均未达到。

## 12. 正式回填草稿与完成门禁

正式 §16 应保留真相源/承接表、前置阅读、闭环预审摘要、future boundary family、accepted side-effect inventory、命名与未实施门禁；详细字段/DTO/Query/状态矩阵继续引用本Step与Step06～16，避免正式文档膨胀成第二份重复schema。

| 完成门禁 | 结果 |
|---|---|
| 实施承接清单 | pass |
| 前置阅读/提交/Git/目录 | pass_as_future_requirement |
| 字段与DTO构造 | locally_closed_with_external_blockers |
| Query/public protocol | locally_closed_with_cursor_pending |
| 状态/side-effect | pass |
| future phase boundary输入 | pass；未越界创建07内容 |
| implementation handoff | not_ready / correctly_blocked |
| 正式03写入 | not allowed until Step19 |
| 下一动作 | 按连续授权进入Step18 |

本 Step 未创建04～07、implementation ledger或boundary skeleton，未创建目标实现仓、未实现、未测试、未生成baseline/commit/run/artifact/report/evidence/verdict/signoff/readiness，也未提交 commit。
