# L6-bridges 03 Step9：受权合同修订与准入重审

## 1. 开工确认与范围

2026-10-03；用户明确同意：仅Bridges Step6~9最小必要修订，重审通过后完成全部Step10。当前agent独立串行，`full-restart`主链内受权`targeted-repair`；不重做已完成十九flow，不修改正式03/其他项目/standards，不实现、执行项目测试、stage或commit。

已恢复项目台账 -> 03 flow -> Step9§7.4；复读通则§1、中间产物§3.4/3.5.2/3.6、真相源§2.1.1/2.2.1/3.5.5、全局依赖全文、SOP10全文与书写§5.9。Governance Step10§1~8用作组织参考，后续补读跨审；不搬运其truth、错误占位、outbox或运行材料。

[范围基线](03_ddd_step_09_contract_repair_scope_baseline.json)保存108个Bridges文件逐项SHA-256和其他4678文件聚合摘要。排除`.git/node_modules/.agents/.codex`；不把hash当运行证据。首次全仓输出截断/JSON解析失败未写文件，重新采集范围后成功。

## 2. 修订计划与小循环

| 批次 | 缺口 / 读取目标 | 问题/诊断/取舍 | 写入 | 自检 | 下一动作 |
|---|---|---|---|---|---|
| G0 | 边界、授权、范围及整体计划 | done | done | pass_design | R1 |
| R1 | TOMBSTONE、Q02-ROOTS：mapping/current与snapshot读取 | done | done | pass_design | R2 |
| R2 | PREPARE-LANE、LANE-INSERT：scope来源/首建两轴 | done | done | pass_design | R3 |
| R3 | CONTINUITY-MEANING、INBOUND-MEANING：notice与拒绝路径 | done | done | pass_design | R4 |
| R4 | LOCAL-PROBE、RECOVERY-RECEIPT、RECOVERY-RETRY-CURRENT、GAP-RECOVERY-LINK、STAGE-COVERAGE | done | done | pass_design | R5 |
| R5 | J04-PROBE-QUALIFICATION、NONRECURSIVE-AUDIT：原consumer及审计规则 | done | done | pass_design | X |
| X | 十三项source/DTO/port/factory/flow/guard及范围重审 | done | done | pass_design_contract | Step10 G0（已有用户授权） |

每组先读取具名schema/port/flow及必要owner正式合同，写可审查问题/诊断/取舍，之后修改原拥有文件、补flow及测试切口，再单组停审。只修影响范围，不借repair批量重写其他Step。新增支撑类型必须给Rust-facing schema/field/factory/归属/错误/消费边界，禁止私造外部truth。

## 3. 关闭判据

本地设计合同关闭要求：具名字段来源、成员能力、注入/端口、factory、flow与错误均可实现；缺外部正式兼容/准入/能力时精确返回既有NotEstablished/Unavailable并保持原结果，不代表已取得外部资格。不能以“稍后补合同”关闭本地缺口；可以明确零durable拒绝/carve-out，但需各层一致且不冒充positive。

外部blocker：BR-UP-001~009=open、010=reference_only；Workspace原开放项、Observability十二affected保持。平台SDK/OAuth/API Key/KMS/router及实际四平台安装/投递仍未选/未建立。非递归audit不能由本地默认降级代替Observability正式规则；内部提交、平台ACK、owner业务结果、platform业务结果、consumer结果分别保真。

## 4. 当前门禁

```text
current_document = 03
current_step = 9
current_module = repair_complete
gate_status = pass
gate_reason = local_contract_repair_review_pass_and_step10_authorized
next_allowed_action = establish_step10_scope_and_subject_screening
targeted_repair_allowed = false
calibration_write_allowed = true
step10_allowed = true
formal_document_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 5. 修订组记录

### 5.1 R1 问题、诊断、取舍

来源：Step7 BindingQualificationPort/MappingRepository/SafeTraceRepository、C03 input与注入；Step6 LocalSnapshotReadBasis/ExistingLocalSnapshot；Step9 C03/Q02；Conversation正式03§1/5/7、Identity正式01§4及Governance正式03§7/11边界复核。

问题：纯OwnerChangeDispositionRef factory只能校shape；Operation ID不提供完整effect；standalone plan/action不必有intent/callback。

诊断：缺少typed current解引用和独立read root，不是HTTP/SDK实现问题。取舍：在原BindingQualificationPort补核原message/source/actor/Delete/current的资格方法，输出仍原OwnerChangeDispositionRef；在原三个repository补精确snapshot读取。新增三个Application-only snapshot与ExistingLocalSnapshot variant，不增业务state/投影/主接口。禁用dummy callback/intent、全库扫描、解析opaque ref、自动删除owner对象。

Operation root来自同driver实际已提交operation/result journal，完整original和其safe results/basis；无行不证明NoEffect。三个新root必须经原read/current过滤才project；缺实际owner处置接口时NotEstablished，BR-UP-001/003保持open。

R1停审：具名方法/三个struct已实际rg定位；原read_basis、current、成员、同tx stage与原planned测试target人工复核通过。无新增business enum/主接口；后续X统一清理旧缺口叙述及统计。只关闭本地设计断口，owner compatible query缺失仍阻正向。

### 5.2 R2 问题、诊断、取舍

读取原ImmutableDeliveryTargetRef五字段、QualifiedLaneOrderScope六字段、DispatchLane十字段/九参for_scope、LaneRepository双轴stage、C04/E02注入/flow。问题：target不含lane_ref，技术ID不授scope；Existing1不能代首建Absent。

取舍：在原PresentationQualificationPort取得完整LanePreparationQualification（正式target/current/capability -> scope/dependency/all bounds/budget/rate basis），C04/E02显式注入原LaneRepository；按qualified scope唯一读取existing，否则纯factory构造新lane，并以具名insert_for_scope固定两轴Absent接纳。同tx lane/plan/intent/effect reservation联动；unique竞争只读取原winner，不每intent私建lane。J01只操作已实际存在的lane，不承担隐式首建。rate/budget不因新请求、lease、等候重置；shared/global依然原driver原子协调。

R2停审：scope资格schema/factory/读面齐，C04/E02已显式注入lanes并各写独立取得/首建调用；fixed dual Absent与original budget不重置人工核验。R3停审：notice七stable字段、独立codec/recipe与六字段qualified输入来源齐；fresh缺mapping/source采用明确零durable合同，不新增拒绝truth。两组只通过设计自检，平台能力/codec实际注册仍未建立。

### 5.3 R3 问题、诊断、取舍

notice不是Inbound消息，也不是Recovery请求；已有九variant不足承载其stream/epoch/range。新增ContinuityNoticeMeaning而不借消息mapping/正文hash；qualified notice扩展明确comparator/range/change/window取得面。Private缺mapping/source选择零durable拒绝，跨Step8/9保持一致；不把Missing Slot当创建拒绝记录的授权。测试红线：同key变化next/range冲突、Protocol与Owner/Delivery recipe互斥、source/method缺失零durable、Unknown range不推coverage。

### 5.4 R4 问题、诊断、取舍

来源为Step6 ProbeOutcome/KnownPlatformBusinessResult/RetryEligibility/Gap/Recovery/两coverage，Step7 AuthoritativeRecoveryPort及J02/J03/J05注入，Step9 C06/J02~05；不重新解释外部结果。

Local：补只读唯一unresolved阶段locator面，不扫描日志/选最新；仍独立LocalCommitDisposition。当前明确不支持仅local提交证明产生RecoveryState::Resolved，local-only转Manual/保留；若业务来源已正式可查才继续foreign readonly，不再apply。Platform：ProbeOutcome::Platform载荷改完整KnownPlatformBusinessResult，readonly method必须提供同次响应bounds或实际immutable原receipt；缺完整值只能Unknown/Unavailable，不能用现时bounds补。Retry：显式注入原PresentationQualificationPort并补五源同effect资格方法，NoEffect不是NoIo。

Gap：补纯attach_recovery并在C06同UoW建立原gap/recovery受权关联；J03不mint恢复记录。Coverage：补原AuthoritativeRecoveryPort的typed stage coverage取得面，核same stream/epoch/stage全部committed覆盖和formal comparator；source coverage只关gap，不能替stage coverage。任何外部契约未建立仍有限NotEstablished，局部关闭不等source效果已知。

### 5.5 R5 问题、诊断、取舍

读取Observability正式03§7.4静态producer规则/§14.2安全与recursion边界、Bridges SafeObservationPort、MutationObservationRequirement、J04/E04/J02/J05原handoff流程。正式source不含Bridges，不私补上游family或默认AuditOnly。

取舍：补qualify_consumer_probe正式同original consumer readonly资格面，不要求fresh J04先有RecoveryRecord，仍返回完整RecoveryQualificationRef。补NonRecursiveObservationQualification与MutationObservationRequirement::NonRecursiveResultOnly，必须正式规则scope证明该原handoff结果/维护 mutation免新增producer但本地audit仍mandatory；不是替代Mandatory的fallback。缺正式rule/准入NotEstablished，保原结果责任，不写或递归。该本地seam设计闭口与BR-UP-006外部阻塞分别记录。

R5局部停审：实际Node只读检查新增两端口定义/Job消费及四构造器字段，errors=[]；四variant在plan/from_parts/validate/seal具名穷尽，local kind复用NonRecursiveObservationQualification卡名、不声称foreign规则已登记。随后X补每阶段current/材料覆盖与完整typed stage检查；局部检查非编译/项目测试，外部rule依然NotEstablished。

## 6. 跨组审计与Step10准入

以下是当前设计裁定，不替换§7.4历史诊断或旧scope JSON。`closed_local_design`只表示本地取得/构造/guard/消费/失败合同无需实施者猜；真实外部兼容、准入、实例与运行结果没有关闭。

| S9-GAP suffix | 当前裁定 | schema / 获取与消费闭环 | 未解除的外部门禁 / planned反例 |
|---|---|---|---|
| TOMBSTONE | closed_local_design | Step6 MessageMapping原成员；Step7 Binding.qualify_tombstone及GovernanceOwnerRequirements；C03 actual same原处分/current/CAS。E01不隐式造处分 | 正式owner compatible处分未立NotEstablished；Delete/ACK/Accepted不当Tombstone |
| PREPARE-LANE | closed_local_design | Step7 LanePreparationQualification五字段/qualify_lane、C04/E02 lanes注入及new同序、完整scope来源/unique lookup | 平台scope/capability/rate/预算registry未立阻Planned；不拼target或私建lane |
| LANE-INSERT | closed_local_design | 原DispatchLane.for_scope九参；Lane.insert_for_scope固定两轴Absent/初始1，LocalStore同UoW plan/intent/effect/dedup | driver/schema/shared协调未立NotEstablished；unique race零部分提交 |
| Q02-ROOTS | closed_local_design | Step6三Snapshot完整schema/factory/read_basis；Step7三repo exact读取；十一ExistingLocalSnapshot及project穷尽；Q02八selector | journal/full row/budget/current不足Unavailable；无dummy intent/callback或新投影 |
| CONTINUITY-MEANING | closed_local_design | 七字段meaning/continuity_notice.v1独立recipe；六字段qualified notice；E01独立Ingress/Protocol tx及typed stages | 注册source/codec/rule缺失零durable、host保责任；不借Inbound消息含义 |
| INBOUND-MEANING | closed_local_design_by_explicit_carve_out | Step8/9一致：fresh缺mapping/source/version零ID/record/dedup/audit/result，host finite安全处置/ACK责任 | Missing Slot不授新拒绝truth；不hash正文/dummy映射；已有原同义结果才current复用 |
| LOCAL-PROBE | closed_local_design_by_finite_boundary | RecoveryPort/LocalCommitProbeAdapter exact retained unique阶段locator；J02 LocalCommitDisposition独立。local-only明确不Resolved | journal缺失None、多阶段Conflict；不选latest/伪ProbeOutcome::Local或重新apply |
| RECOVERY-RECEIPT | closed_local_design | ProbeOutcome::Platform完整KnownPlatformBusinessResult；driver同次bounds；J02实际immutable receipt优先/八参factory/Absent append及原对象CAS | 正式readonly不能提供完整known则Unknown/Unavailable；不拼现时bounds或宣送达 |
| RECOVERY-RETRY-CURRENT | closed_local_design | J02显式presentation注入、tx外revalidate/qualify_retry五源；纯schedule_retry三参、原budget/window/effect | NoIo/NotFound非NoEffect；正式current不足Manual、零send/attempt |
| GAP-RECOVERY-LINK | closed_local_design | 原Gap.attach_recovery四参；C06 get_gap actual expected/Present+recovery Absent同tx；J03只已提交Slot | 缺授权/原op关联不建；异ref/Closed/Probing拒绝 |
| STAGE-COVERAGE | closed_local_design | RecoveryPort/LocalCommitProbeAdapter带Maintenance read的typed五字段完整stage取得；J03 B close后actual读+独立C；J05 same-epoch零advance | formal comparator/source或任何阶段/gap/预算缺失Unavailable；B candidate不能证明已提交stage |
| J04-PROBE-QUALIFICATION | closed_local_design | SafeObservation/ObservabilityRequirements.qualify_consumer_probe完整readonly资格；fresh无需伪RecoveryRecord；原结果先读 | 正式consumer/source/window/budget未立NotEstablished；不能cast current/retention或盲交 |
| NONRECURSIVE-AUDIT | closed_local_design_with_external_rule_blocked | 四字段NonRecursive资格/local kind、四variant plan/validate/seal；E04/J04逐R/A/B/J02逐A/B/J05 Handoff tx外核全部拟写subjects/phase | Observability producer map/rule无Bridges，仍NotEstablished；local audit/seed/CAS必需、handoff=None、零新canonical/O01 |

X人工跨层审查：新增schema的全部字段/factory/只读面及exact来源；新增端口与adapter-local需求/constructor注入；本地Absent/Present与特殊版本轴；所有新增qualification在tx外；actual known/unknown/current有限出口、private/secret与材料边界；十九flow与原十一planned测试target一致。J03修正B candidate冒actual coverage的次序，B实际关闭后条件C读取与双CAS推进；C失败不撤回B，unknown只原C mutation。无新业务对象/state/入口/port、无外部truth/权限生成或通用outbox。

实际静态检查：十九受影响Markdown的首轮944表/492围栏块/58本地文件链接无格式/空白/缺链；606唯一本地定义、无重复，另6个既有core reexport不纳入该正则计数；十一ExistingLocalSnapshot逐项核对。十二关键新增方法的定义/参数数及flow消费、六新增struct均实际检查errors=[]；该扫描不检查Rust表达式/borrow checker。四constructor字段逐项与new表同序。git diff --check通过、cached为空。最终写入后再次复跑，统计只记录实际输出，不改旧checkpoint。

范围重审实际结果：108原Bridges文件中18受权校准/flow/台账变化、missing=[]，新增repair Markdown/JSON两份；其他4678文件按原捕获walk顺序逐项`path + NUL + sha256 + LF`聚合与基线摘要一致。此前先以排序/无末尾LF尝试未匹配，复核原遍历recipe后真实匹配，不把不匹配报pass；旧scope JSON不变。三次apply_patch上下文/顺序校验失败均无落盘，精确hunk后重做；一次Node审计括号SyntaxError未执行，修正后真实检查通过。

准入结论：十三项本地合同已按上述边界关闭，Step9设计的未闭口冲突已清除，允许在现有用户授权内开始Step10；不是所有外部positive已可执行，更不是编译/项目测试/投递/evidence/verdict/signoff/readiness。BR-UP/WS/Observability原开放项及产品未选/未建立保持。repair不再开放任意前序改写；完成Step10即停，不进入Step11、不提交。

最终source复查：J02误写的`mark_retry`已按原Domain卡补正为`DeliveryIntent.schedule_retry(actual_retry, intent_expected, now)`，参数三项且tx外取得完整retry资格。随后实际扫描Step9五附录347处具名调用、212个distinct方法，全部回指Step6~8定义，errors=[]、mark_retry残留0；O01编号标题另以九参完整签名验证。前两次扫描分别漏trait lifetime及插入子卡，后一次仍漏编号标题，均属解析口径不足，未用其报错结果宣称pass。

最终26份Step6~9 Markdown复查：1164表、587围栏块、62本地链接，errors=[]；原108文件的18项变化均在受权范围、missing=[]，其他4678文件原recipe摘要匹配；diff-check通过、cached为空。技术生命周期四卡已实际补读，Step10仍未创建。此checkpoint只证明设计静态/范围检查；repair权限关闭，下一Step10须重新取范围基线并逐主语小循环。
