# L6-bridges 03 Step11：持久化、事务与一致性

## 1. 开工确认与输入

2026-10-03；用户授权剩余全部03，expiry repair已重审关闭本地S10-LOCAL-001。正式03/04/07/实施/测试/提交权限仍关闭。当前agent独立串行，full-restart主链正常续接；只建立当前Step骨架，未来Step不创建。

读取：SOP Step11全文、书写§5.10；通用恢复/三层/模块先思考后写入规则；正式01数据所有权及02持久化边界；Step6完整对象/Plan、Step7八repo/UoW/read support、Step9共享及19flow事务、Step10各机/expiry repair。外部owner/平台真相不入本地存储；实际DB/driver未选不冒称可运行。

## 2. Step内计划与恢复点

| 模块 | 思考 | 写入/草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|
| P1 logical storage / ownership | done | done | pass_design | pass | 进入P2 |
| P2 repository / transaction closure | done | done | pass_design | pass | 进入P3 |
| P3 consistency / recovery / cross-audit | done | done | pass_design_static | pass | 进入Step12 |

当前03/Step11/complete；`gate_status=pass` / `gate_reason=persistence_contract_design_review_pass` / `next_allowed_action=enter_step12`。当步语义写入关闭，正式写入仍关闭；commit_required=false，所有BR-UP/Workspace/Observability原未决不变。

## 3. P1 可审查设计记录

SOP问题1~2：本仓持久化19个Domain model、actual immutable结果及driver实际mutation/CAS/claim证明；只存安全引用、局部状态及授权关系，不复制owner/platform实体、正文、credential或read view。四技术phase/private lease/查询snapshot是进程或单call载体，没有表。

诊断：仅用“mapping DB/receipt DB”会丢代际、source版本、双轴CAS、反查及unknown tombstone；把result_ref当结果存储则无法当前复用。来源为Step6各字段卡、Step7八repo/read_operation_snapshot及UoW，必须完整同源保存/读取。

采用产品无关的逻辑collection契约，每row保完整原schema，复合identity按typed codec等价；不选PostgreSQL/Redis或SQL DDL，不以单字符串external_id唯一。外部引用不是跨库FK；本地required关联同UoW保证存在或正式Missing/NotApplicable。允许索引派生，不允许第二truth sidecar。复杂度：19行及两个技术保存面分表，完整字段不重新定义，引用唯一Step6卡及当前schema。

## 4. P1 存储契约与草稿

### 4.1 保存格式与拥有权

每collection名称是计划逻辑名，不是已建表。`N`=完整InstallationNamespace，`id`=原exact typed ref的LocalRefToken identity，`enc(T)`=受核codec的完整typed安全identity编码；这些只是表记法，不是新type/API。全row包含Step6对象全部字段（包括每个Slot的variant/payload）、exact schema/kind与actual local revision；任何缺字段/unknown schema/duplicate identity拒绝hydration，不默认空/0/Established。codec版本来源见Step8/13，原raw外部ID不脱scope参与查找。

| 数据对象 / logical collection | owner / 写入方 / 读取方 | 主键 / 唯一约束 | 关键索引 / 版本轴 |
|---|---|---|---|
| BridgeInstallation / bridge_installations | U1；C01/J05；安装及全C/E/J/Q01 | (N,id)；N唯一 | platform_kind/state/config_revision；local+config两轴 |
| ExternalBinding / external_bindings | U1授权relation；C02/J05；全C/E/J/Q01 | (N,id)；查找候选不强制单target唯一 | installation/external_scope/internal_target/directions_actions/generation；local+generation |
| ExternalIdentityMapping / identity_mappings | U1；C03/J05；actor资格/Q01 | (N,id)；(binding,generation,enc(external_account))唯一 | binding/generation/enc(internal_actor)/state；local |
| ExternalLocationMapping / location_mappings | U1；C03/J05；target资格/Q01 | (N,id)；(binding,generation,enc(external_location))唯一 | binding/generation/enc(internal_target)/parent/state；local |
| ExternalMessageMapping / message_mappings | U1局部known回链；C03/E01/J01/J05；映射/Q01 | (N,id)；(binding,generation,direction,enc(external_message),action含义)不歧义 | enc(source_ref_version)/generation_direction/state；local；tombstone不删 |
| InboundHandoffRecord / inbound_handoffs | U2；E01/J02；Q02/原op恢复 | (N,id)；enc(verified_source完整recipe identity)唯一；原op/effect关联唯一 | operation/source/state/owner_result；local，protocol_disposition单独保存 |
| SafePresentationPlan / presentation_plans | U3外显资格；C04/E02/J05；J01/Q02 | (N,id)；不强制同source永远单plan | binding_context/source_ref_version/state；local |
| DeliveryIntent / delivery_intents | U3；C04/E02/J01/J02；Q02/J01 | (N,id)；enc(StableEffectIdentity)唯一且C04/E02共用 | operation/binding/lane/source_projection/state；local |
| DeliveryAttempt / delivery_attempts | U3；J01/J02；Q02/原attempt恢复 | (N,id)；同lane/fence claim与attempt_effect精确唯一 | intent_effect/claim/window/state；local |
| PlatformReceipt / platform_receipts | U3 immutable事实引用；J01/J02 append；Q02 | (N,id)；同attempt/authority result identity唯一，冲突不能覆盖 | attempt_effect/result_kind/verified locator；local固定1 |
| ExternalActionBinding / action_bindings | U4；C05/E03/J05；Q02/E03 | (N,id)；enc(source_intent,target_action)唯一 | installation/binding_generation/expiry/one_use_claim/state；local |
| CallbackHandoffRecord / callback_handoffs | U4；E03/J02；Q02 | (N,id)；enc(verification完整identity)唯一；原op/effect关联唯一 | action_binding/op/state/owner_result；local，ACK独立 |
| DedupRecord / dedup_records | U5；原C/E/J与J05 expiry；Q03/原结果读取 | (N,id)；(namespace_scope,enc(key value/source))唯一，meaning不同也必须冲突 | key/meaning recipe+version/operation_effect/state/window；local，Expired保key |
| StreamCursor / stream_cursors | U5；E01/J03/J05；Q03 | (N,id)；(enc(namespace_stream完整stage/source),epoch)唯一 | stage/epoch/state；local+cursor两轴，opaque position禁排序 |
| GapRecord / stream_gaps | U5；E01/C06/J03；Q03 | (N,id)；qualified source gap identity/range去重沿原key，不能按时刻猜唯一 | cursor/原range/epoch/recovery/state；local |
| DispatchLane / dispatch_lanes | U5；C04/E02/J01/J02/J05；Q03 | (N,id)；enc(QualifiedLaneOrderScope)唯一 | binding/order_scope/head/claim/unresolved_head/state；local+lane+monotonic fence |
| RecoveryRecord / recovery_records | U5；C06/J02/J03；Q03 | (N,id)；(enc(original_subject),enc(operation_effect))唯一 | original_subject/operation_effect/state/window；local |
| SafeAuditRecord / safe_audits | U6 immutable本地材料；actual各U append；Q04 | (N,id)；mutation_ref唯一 | operation_ref/subject_refs/producer_revision；local固定1 |
| SafeHandoffRecord / safe_handoffs | U6；条件O01首建/J04/E04/J02/J05；Q04 | (N,id)；(audit,original consumer op,schema/material identity)唯一 | operation/audit/canonical/admission/claim/state/retention；local |

MessageMapping的binding/direction/action索引从原完整`MappingGenerationDirection`与`MappingBasisRef`取得，不能增加自由文本binding/action字段或从message ID解析它们。lookup需要完整同generation/action资格；多命中InvariantViolation，不取first/最新时间。不同动作/已删源的历史回链不能误认为新action许可。

### 4.2 技术保存、引用与排除面

| 保存面 | 必须保存与读取成对 | 约束 |
|---|---|---|
| actual stored result journal / SafeTrace | result_id、kind、完整original、key、完整meaning、scope、payload、actual revision/store basis；stage_result -> get/find/read_operation_snapshot | immutable；LocalMutation seed只actual commit后物化Committed；同key变义拒绝，payload缺失Unavailable，不能只回显locator |
| original mutation disposition / UoW driver | mutation identity、original、expected全集、actual commit revisions、driver/schema/source proof；commit -> read_original_commit | driver技术事实，不新增Domain model/业务port；只有正式actual Committed/RolledBack/Indeterminate，不能由row存在/NotFound推断rollback |
| claim/fence/shared-rate协调索引 | 原lane/action/handoff及actual tx reservation、唯一fence/预算/完整scope read-set | 必须与所属业务U同commit；是原字段的driver协调实现，不独立授permission或第20业务对象 |
| foreign owner/platform references | 保存已准入safe locator/source/version/basis/receipt；fresh/current经正式port | 无跨库FK/cascade；不可抓取正文补snapshot，不把外部删除当本地删键权限 |
| private/技术/read carriers | 不保存PlatformIngressPrivateContext/CallbackPrivateContext/payload/secret/reply lease、snapshot/DTO/view、四technical phase | 禁Debug/serde/log/cache/detached；进程phase停止不抹durable unresolved |

所有receipt/audit/结果不可原位改写或由当前对象重建过去。保留窗口只约束自动复用/probe/交接，不是purge许可证；本03无delete/GC/cascade API，原unknown/tombstone/已知材料关联保留。physical retention/归档必须另有正式批准且不破坏唯一键/unknown责任，当前blocked，不能实施者自行加清理Job。

P1草稿：19模型分owned-local/ref/state/immutable保存，各有exact PK/索引/版本及实际read/write面；结果journal与原mutation proof同driver、不成owner truth。逐原字段/lookup人工对照完成，P1设计自检pass；下一P2。

## 5. P2 可审查设计记录

SOP问题3~5：八repo与UoW完整签名以Step7为唯一来源；所有mutable写都只stage合法Domain candidate，immutable只Absent append，不授权adapter绕Domain改state。局部事务必须把required subjects/CAS、reservation、dedup、结果、audit、正式条件handoff封成同一all-or-none集合。

诊断：外部IO在DB锁中、stage当commit、提前构造claim proof、result覆写、多driver拼接以及只CAS主行都会破坏未知/并发等价。采用same storage/source/schema driver的begin-reserve-stage-seal-commit；CAS比较不足需unique/phantom scope全保护。未采用跨owner分布式事务/通用outbox或单进程mutex替代共享协调。

复杂度：repo函数逐名索引+规范签名定位，19flow按实际阶段列事务集；不是新API的摘要。错误沿既有PE/CV与LocalCommitDisposition，product缺保NotEstablished。

## 6. P2 Repository与事务契约

### 6.1 函数与driver准入

[Repository函数附录](03_ddd_step_11_repository_functions.md)逐名复用9trait/115全签名：八repo+既有UoW技术面。不存在query直写、generic save、绕Domain atomic state update或新delete函数。fake/durable的返回类型、uniqueness/CAS/guard/commit unknown完全等价；fake只能提供测试语义，不声称跨进程driver资格。

driver必须同时提供：same-source/schema transaction、原expected全集及phantom/unique保护、实际fence/claim预算协调、封存集合一致、immutable seed物化、actual commit proof及原mutation读回。任何required能力缺失NotEstablished；不能拆到不同KV/SQL/消息系统后称原子。DB/driver/锁隔离产品尚未选，下面是准入契约而不是已验证保証。

```text
[current complete baseline + foreign qualifications outside tx]
   -> begin(original mutation, full expected, formal observation)
   -> same-driver reserve / pure Domain candidates / typed stages
   -> immutable seed + actual local audit + conditional qualified handoff
   -> validate / seal exact set
   -> actual commit
       +-- Committed -> current recheck -> permitted foreign IO
       +-- RolledBack -> no local mutation; no new foreign IO
       +-- unknown -> retain original -> read same mutation only
```

图说明：stage/plan/claim结构不是commit；begin不要求未生成claim。事务期间零foreign资格/secret/private/网络调用。commit unknown禁止换mutation/op重apply；driver原mutation proof不可用时保持unknown。

### 6.2 逐flow事务集合

每行的`G`只是表记法：该阶段完整expected+本次/原dedup unique+immutable seed+SafeAuditRecord+正式observation及条件handoff+seal；不是新helper。所有state/guard/顺序以Step9逐流草稿及Step10 exact矩阵为准，不把同一original不同阶段揉成一个事务。

| 场景 | 开始 / 提交位置 | 同事务必须完成 | 失败 / 外部效果边界 |
|---|---|---|---|
| C01 Configure | actual draft/config/local条件后begin；安装stage+G后commit | 安装Absent或Present，config/local双条件，安全配置引用 | 零平台/secret IO；失败不能激活安装 |
| C02 Binding | 两端/actor/action正式basis及完整读后begin | 原relation/generation/local、G；激活只正式activation | 不创建owner target/member；fail零部分grant |
| C03 Mapping | typed两端/known结果/current后begin | 所选identity/location/message row+G；tombstone保历史 | 不调平台delete；不从unknown造Linked |
| C04 / E02 Prepare | source/projection/disclosure/附件/effect资格、actual effect lookup后begin | plan+intent+必要新lane scope唯一/Absent+G | zero dispatch；effect竞争原winner优先，不换source/target |
| C05 Action bind | actual known source/owner action/current责任后begin | 原source-action唯一action+G | zero one-use claim/owner审批 |
| C06 Request recovery | formal recovery授权/原subject读取后begin | 新Recovery与既有Gap attach关联（适用时）+各自CAS+G | zero probe/replay；unknown原effect不换 |
| Q01~Q04 | 不begin，不提交 | 只current committed snapshot及纯projector | 无dedup/audit/clock-ID/stale repair/恢复写 |
| E01 Private A verified | 完整qualified Inbound meaning、verified source/key/current后begin；缺mapping/source零durable | Verified原安全字段、dedup/唯一source+G；不含claim或owner未来结果 | actual A proof只证明接管，零owner IO；平台ACK不证明A |
| E01 Private B claim | actual A完整baseline及正式claim/current后begin | same-tx reserve claim + HandoffPending + 原key/result seed复用+G | actual B commit并最后current重核后才最多一次same-op owner handoff；B未知或CAS loser零owner IO |
| E01 Private C finalize | actual B原op及实际owner结果、完整关联读后begin | 原record/合法known message mapping或墓碑/dedup+G | owner已发生不因C失败撤销；保原known/unknown结果与original/mutation，无二次handoff |
| E01 Continuity | qualified notice/原stream/gap完整后begin | 合法Protocol cursor首建或失效+Open gap+G | 零advance/close/Owner/Conversation/ACK新事实 |
| E03 A | verified callback/action/actor/owner/current后begin | 原one-use reservation+Claimed action+callback+dedup+G | actual A commit后才owner command；ACK不释放claim |
| E03 B | 原claim/actual owner结果读后begin | 原callback/适用dedup结果+G | known优先，local失败不重批，one-use永久不复活 |
| E04 result | 正式consumer disposition及原handoff/claim读后begin | 原handoff consumer结果+dedup+G | 正式NonRecursiveResultOnly全scope，handoff=None，zero producer/consumer IO |
| J01 A | current full lane/intent/rate/预算后begin | lane reserve_claim/fence+Held lane+Dispatching intent+Claimed attempt/Absent+G | A commit unknown零send；SDK不得暗重试 |
| J01 B | actual A读/current最终IO资格后begin | 同attempt InFlight+G；B actual提交后才一次dispatch | crash B后即使尚未send也可能unknown；lease/cancel不證NoEffect |
| J01 C | actual platform result/全原关联读后begin | attempt/intent、known receipt Absent、适用known mapping、lane/bounds/dedup+G | unknown保unresolved_head；late result冲突保原known责任不造新效果 |
| J01 D NoIo | 仅actual同attempt NoIo证明+合法Domain边后begin | 原attempt/intent/lane+G，不改effect | NoIo!=NoEffect；local disposition不从timeout推导 |
| J02 A/B | A两原subject recovery Probing actual commit；B权威原probe结果后新begin | recovery+所属Inbound/Callback/Intent/Handoff及必要receipt/lane/mapping/dedup+G | local/owner/platform/consumer分开；只读probe，结果finalize不send；handoff原rule非递归 |
| J03 A/B/C | A gap/recovery Probing；B coverage处置；C独立current已提交stage proof | A/B各gap/recovery+G；C仅cursor双CAS+G | B不stage cursor，C失败不撤销B；partial/unknown零advance |
| J04 R/A/B | 正式same-op no-effect/current需要时R resume；A claim；B实际consumer disposition | 原handoff各自合法边/claim/dedup+G | 每阶段正式非递归全scope、zero new producer；actual claim先交consumer |
| J05 Maintenance | 原expected/key结果先读，完整qualification/合法候选后begin | 原subject+qualified affected全集各自CAS+G；目标Dedup额外原Present及独立Job key | no grant/send/probe；expiry保target original/unknown；page不足零部分全量宣称 |

G的observability四分支不能由配置默认：Mandatory/OptionalQualified须真实canonical/admission，OwnerPermitsAuditOnly须正式rule，NonRecursiveResultOnly须覆盖全部拟写subjects且禁止new canonical/handoff。缺rule不begin；Observability未纳Bridges的事实不变。

P2草稿：repository具名保存与读取成对，19flow按A/B/C/R/D及纯查询划清全CAS/unique/immutable/G，IO只在actual committed claim/phase之后。115签名来自原trait未改名/缩参，人工P2自检pass；下一P3。

## 7. P3 一致性、恢复与跨审

问题6：跨owner/platform/consumer不是local atomic boundary；发布/外部结果失败必须保原op/claim/mutation，不能事务rollback后假称撤销外部效果。诊断：本仓无durable projection/outbox truth，套通用“重建projection/重发event”会新增未经设计write面。采用原result journal、原record权威probe/finalize、gap/stage分离；不采用日志重建或后台无条件retry。

| 一致性范围 | 必须保证 | 失败 / 恢复 |
|---|---|---|
| local baseline/hydration | read session绑定namespace/purpose/actor/source/schema/window，完整原row与集合；强读不足不能标Strong | 缺字段/预算/同源proof为Unavailable/InvariantViolation；Query不repair |
| CAS/unique/phantom | expected全集在stage/commit同driver重核；Absent唯一/Present原版本；scope候选集合变化也须核 | Conflict零部分commit；竞争者actual原结果current可见才reuse，不换key/op |
| revision / fence | local正数checked next；config/generation/cursor/lane各自守卫；fence同scope单调不重置 | overflow/CAS/旧fence拒绝；不会外部fence的platform不宣全局exactly-once |
| shared bounds / retry budget | 原全global/method/resource/bucket集合；新下界取所有max，预算不因lease/restart重置 | 缺完整scope协调driver则NotEstablished；known-only释放head，Unknown保阻塞 |
| immutable seed/audit/receipt | exact key/meaning/op/kind关联、唯一audit/mutation；任何actual U都whole seal | actual commit后同driver具名get/find；缺payload保unknown/Unavailable，不补第二result |
| local commit unknown | 原mutation与original可重复权威读，返回原exact disposition/revisions | 禁新apply/foreign IO；NotFound/连接断开/clock/cancel不判RolledBack |
| foreign known / finalize失败 | host保actual typed结果及原claim/original责任；known优先于一般error | J02/E04原result-only/人工出口；不能重send/重approve，receipt不虚构 |
| source loss / reconnect | 保旧epoch/cursor/gap，正式新epoch另tracker；没有full coverage不关gap | J03受权同range probe，B actual close后C新stage proof，zero raw replay |
| expired / cleanup | tombstone/key/original/unknown/result不清除，自动复用受原窗口约束 | J05仅批准expiry；本03无GC/delete路径，物理清理资格缺失blocked |

跨审：19模型与八repo全对应，九trait115签名无新增surface，全部mutable stage都有exact完整读；技术保存面与业务truth分离。A/B/C/R/D的commit未知、Query零U、J05两key/op/CAS、J04非递归与全bounds逐项核对；没有新local policy/outbox/projection或foreign数据库。P3人工设计审查pass，外部实现资格不解除。

## 8. 草稿、自检与实际检查

正式§10草稿采用§4逻辑存储/owned边界、§6全签名附录/逐flow事务及§7一致性恢复。完整schema来自Step6，签名来自Step7，阶段来自Step9/10；不得在装配时新增DDL/schema/产品/迁移脚本。实际Node逐115签名原文反查source_mismatches=[]，本次03文本格式/链接检查errors=[]，diff-check通过。Step11没有运行DB、编译/项目测试/平台probe；P1~P3及跨审完成，设计自检pass，下一读SOP12/书写§5.11和原finite错误/协议mapper/各flow异常，不提交。

过程：P1结构补丁因hunk顺序不匹配未落盘，调顺序后重新apply及读回。逻辑表不是DDL、索引不是第二schema；没有声称driver性能或持久化实测。
