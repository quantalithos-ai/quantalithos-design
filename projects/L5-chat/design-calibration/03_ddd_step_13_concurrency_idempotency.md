# L5-chat 03 · Step 13 并发、幂等与重入保护

## 1. Step 状态

> done；pass_with_upstream_blockers；2026-10-01。SOP Step13、书写规范5.12；回填正式03 §12。策略/测试切口均planned。

### 1.1 Step内计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 13-A | 冲突资源、local CAS、current slot | done |
| 13-B | 43协议族去重身份、SDK幂等责任 | done |
| 13-C | effect unknown、恢复single-flight、撤销与容量 | done |
| 13-D | 读取/结果闭环审查和测试承接 | done |

复杂度按local concurrency与SDK业务幂等拆分；没有新增幂等repository、mutex truth或后台worker。复用Step11时序图，避免重复图。

## 2. 本步输入

Step6 Attempt/Draft/ConsumptionContext/Continuity、Step7所有ports、Step8协议全清单、Step9各flow、Step10状态、Step11版本与Step12错误；Governance Step13 §8～16的资源/key/digest/replay/reentry颗粒度。SDK实际prepare/result/probe合同未闭合，不能声称key/digest/result store已由SDK提供。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1. 谁会竞争同资源 | 同composition UI callbacks、React重复effects、异步读取、formal change/resume、session切换和cleanup竞争唯一root与memory entry。 |
| 2. 哪些会重复 | 43协议均可能重复；业务仅两个Submit具有owner命令effect，preview须只读，诊断/host交付单独受控。 |
| 3. key来源 | local身份由LocalIdentityPort/current正式句柄；业务association由SDK正式prepare；change identity/cursor来自SDK；不从title/ref字符串/hash正文生成。 |
| 4. 重复处理 | same intent复用当前feedback；相同source/change返回duplicate；读请求重复新slot并取消旧读；unknown probe；清理already_absent为本地成功。 |
| 5. 如何验证 | 固定竞态调度：双callback、late response、revoke/save、双resume、capacity、跨session/source、不同payload关联；只planned，不执行。 |

## 4. 当前文档问题诊断

| 位置 | 风险 | 固定口径 |
|---|---|---|
| Step9 Submit双CAS | 第一次local预留与第二次dispatch reservation混淆 | 两次CAS分工；第二winner单次调用；preparing不可双prepare/dispatch |
| Step6 idempotencyAssociation | 可能以local intent id替代formal key | association只从prepare；payload冻结、不自行digest |
| Step9 consume/Step10 fresh | consumedChanges有界后忘记身份可能重复接受 | 容量处理须正式checkpoint/coverage，未提供则stale/gap重取 |
| Step11 repo async API | Promise不意味着内存操作可跨await执行 | fence/partition/版检查+map mutation同turn |
| 跨端体验 | 错把local CAS理解为跨设备锁或草稿同步 | 每composition独立；业务冲突/幂等由owner/SDK证明 |

## 5. 改动前后对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| 去重 | 分散描述 | 每族稳定identity/窗口/处理/恢复 | 避免用arrival、对象标题或按钮文字去重 |
| unknown | 可能被超时恢复重送 | 无lease过期重发，仅正式probe | 不承诺exactly-once delivery |
| capacity | 通用LRU容易忘记去重 | source安全失效/重取，不伪fresh | 有界内存也须保持消费正确性 |
| 跨端 | 局部同步措辞宽泛 | 正式owner变化刷新；local稿不跨设备合并 | 无正式草稿同步合同 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| local CAS一次派发权 + 正式SDK幂等/查询 | 本地双击可控，业务责任正确 | SDK合同未闭合时业务blocked | 采用 |
| 客户端自造digest/key和重试队列 | 表面上可离线发送 | 无正式幂等窗口/结果读取/授权证据 | 不采用 |
| 锁按钮/disabled防重复 | 有视觉反馈 | 重复callback、重入或多设备仍可重复 | 只作UX，不能替代CAS |
| 超时释放unknown租约 | 恢复快 | 旧effect仍可能完成 | 不采用 |

## 7. 结构化中间产物

### 7.1 并发场景与测试切口

| 场景 | 冲突资源 | 控制方式 | 失败错误 | planned切口 |
|---|---|---|---|---|
| Enter/点击/双mount同时提交 | current draft/attempt/root版 | first reserve CAS，同revision已有nonterminal复用；second reserveDispatch CAS winner一次 | local_conflict | CONC-01双回调只有一次SDK dispatch |
| preparing时编辑新稿 | draftRevision/frozen payload | 原payload不可变；new revision与old attempt分立 | invalid_input/context_changed | CONC-02 old confirm不清新稿 |
| Gate重复action | actor/fence/Gate/action | nonterminal同组复用attempt；需formal capability | local_conflict/access_denied | CONC-03多个Gate按钮不双发 |
| intent A/B不同正文误复用association | PreparedCommand/submission | SDK正式prepare绑定冻结payload；different association/payload拒绝 | authority_missing/invalid_input | CONC-04不复用key发送改稿 |
| result/probe同时收敛 | attempt/root版 | 同formal result terminal no-op；冲突authority拒绝；CAS loser重读 | local_conflict/authority_missing | CONC-05不反转terminal |
| source change/resume并发 | continuity/accepted ids/marker | 同source current recovery、资格顺序、原slot checks、一CAS | local_conflict/continuity_gap | CONC-06无丢水位或双apply |
| 项目/节点/搜索旧回包 | slot/target/parent/query generation | 完整context equality；旧slot不可改成current | context_changed | CONC-07 late response零覆写 |
| 父图更新/选中节点 | selection+topology+node refs | invalidate旧child后新正式read | context_changed | CONC-08无幽灵边/隐藏label |
| revoke和query/result返回 | 当前scope/registry/slot | 正式降权优先；hide/invalidated一次CAS | access_denied/context_changed | CONC-09旧回包不复活 |
| save和logout/evict | map entry版/当前partition/fence | 同turn检查并写；generation失效阻旧save | local_conflict/context_changed | CONC-10删除失败仍隐藏 |
| resume重入 | source activeRecovery/current slot | source-local single-flight；旧recovery回包拒绝 | context_changed/local_conflict | CONC-11双resume不跨source覆写 |
| 多设备同命令 | owner业务资源 | SDK正式业务幂等/owner version；local CAS只同composition | formal结果gate | CONC-12不声称跨端exactly-once |
| 有界consumed/context/cache达到上限 | 当前source资格/slots | 先失效source、取消旧消费；formal requery/coverage再开新代次 | continuity_gap/dependency_unbound | CONC-13有限内存不丢去重后fresh |
| dispose后effect返回 | root/registry/listeners | trusted lifecycle先失效；返回不写新root | context_changed | CONC-14取消等待不取消owner |

### 7.2 43协议族身份与窗口

| 接口/族 | 身份或幂等键 | 有效窗口 | 重复处理 |
|---|---|---|---|
| SubmitConversationIntent | local actor/fence/draftRef/draftRevision；正式association另由SDK | 当前composition与同revision nonterminal；SDK窗口未确认 | 本地返回同attempt feedback；不得第二dispatch |
| SubmitGovernanceIntent | local actor/fence/Gate reference/governanceAction；正式association | 当前composition同组nonterminal；SDK窗口未确认 | 复用attempt；重新action须正式capability |
| RequestSafePreview/LoadArtifactPreview | current preview request/target/source/visibility | 当前slot | 只读新请求可取代旧；native effect未qualified blocked |
| AcknowledgeLocalRecoveryAction | source/recoveryRef/action/currentfence | 当前恢复语境 | 单flight或当前local no-op；不重发业务command |
| 20 Query | 原request.slotId + actor/session/scope/target/source/generation/parent/query lineage | 当前active slot | 可取消旧读；当前读取只安全应用一次版；无业务幂等记录 |
| ConsumeFormalChange/MaterialRevisionChange | 正式source + changeRef + qualification | SDK定义的source coverage/window | accepted身份与watermark同CAS；duplicate no-op |
| ConsumeCommandReceiptOrResult | association/intent/actor/scope + formal result/receipt ref/authority | 同attempt，terminal保守保留 | 普通receipt不升级；同terminal no-op；冲突拒绝 |
| ConsumeResumeResult | source + recoveryRef + formal coverage + original slots | 当前activeRecovery | 旧恢复ignored，不覆盖新水位 |
| ConsumeVisibilityChange | 正式scope/session/source + visibility change identity | 当前session/scope；不依赖已关闭node active slot | 重复安全收紧可no-op；不能为了去重跳过仍需隐藏的slice |
| ConsumeShellLifecycle | host受控source + epoch/lifecycle通知 | 当前composition | 重复offline不创建新业务重试；closing无owner取消 |
| ConsumeEvictionTrigger/EvictLocalMaterial | key+partition+entry版+ClearReason | 当前memory map | already_absent成功；new版本重读；无blind delete |
| ClientDiagnosticHandoffRequested/ClientSupportContextRequested/EmitDiagnosticHandoff | local requestId + formal SDK交付关联（如正式提供） | 单次显式操作 | 默认disabled；unknown不automatic resend |
| ResumeChangeContext/RequeryAfterGap/RefreshStaleMaterial | source+current request/recovery/generation | 当前source slot | current single-flight；旧job不得修复truth |
| ResolveUnknownAttempt | intent+association+current正式资格 | 当前可获准probe | 只probe，无dispatch；重复probe不改terminal |
| RestoreAfterShellRestart | 正式locator候选+新epoch/新entry qualification | 新composition | 不复用内存handle、不恢复confirmed/access |
| PersistLocalProjection | key+partition+expected entry版+currentfence | 同map当前entry | create-if-absent/update CAS；同内容不blind upsert |
| NavigateProjectContext | root版+获准project/stage/node+parent版本 | 当前local safe model | pure选择；旧选择清理后新请求，不建立binding |
| UpdateDirectorySearch | current provider/query generation/page lineage | 当前搜索代次 | 旧页弃；分页不得跨query合并 |

### 7.3 正式SDK业务幂等与result读取门禁

| 必须由SDK/owner证明 | Chat消费点 | 未证明时 |
|---|---|---|
| operation namespace/业务action、actor/scope边界 | IntentCommandPort.prepare | CHAT-UP001/003 blocked |
| stable idempotency key与冻结payload绑定、canonical digest规则 | PreparedCommand.idempotencyAssociation | 不自行生成hash，不把local intent id当正式key |
| same key same payload duplicate语义、different payload conflict | dispatch正式结果/安全错误 | 保守unknown或拒绝；不改association绕过冲突 |
| reserve/complete与owner提交事务关系 | SDK正式合同 | Chat无UoW/outbox，不宣称exactly-once |
| resultRef/业务receiptRef→完整safe result/probe查询 | IntentProbePort.probe→FormalProbeResult→gate | 缺结果或not_found仍unknown |
| result保存/缺失/窗口过期/no-effect证明 | formal probe status+authority | 不从Turn出现/按钮变灰/当前Gate状态补猜结果 |
| event顺序/cursor/coverage与过期恢复 | ChangeQualificationPort/ResumePort | stale/gap/blocked，无bus fallback |
| 跨device重复与retry合同 | 新显式intent的prepare | local CAS不替代server幂等 |

没有本地业务digest、stored business result或reserve/complete repository；metadata唯一来自SDK。Chat只是消费者，要求上述闭环作为正向binding前置，不能把要求写成SDK已提供。

### 7.4 重入与unknown恢复顺序

1. 读取当前root；重验actor/session/fence/slot以及当前attempt关联。
2. 本地同draft/Gate已有nonterminal时返回反馈；新explicit retry须先formal结果允许且capability当前有效。
3. prepare必须无effect；payload一旦冻结不可随draft修改；没有正式association不得reserveDispatch。
4. 同turn reserveDispatch/CAS将dispatched=true、submitted保存；仅winner离开CAS调用一次SDK。
5. reserve后窗口关闭、dispatch调用抛错或回包丢失均保守unknown；不能以本地计时证明未调用。
6. unknown只probe/query/wait；resolved formal no-effect/rejected/committed才分别收敛；not_found保持unknown。
7. session切换/撤销先隐藏与失效；旧attempt不能在新session自动恢复权限。
8. source single-flight与缓存清理只维护local display，不替代owner replay或修复。

### 7.5 有界性、跨端与审计

| 项 | 硬规则 |
|---|---|
| consumedChanges上限 | 没有正式checkpoint/coverage就不得LRU忘记身份后继续fresh；失效当前source并正式重取 |
| source/cursor版本 | opaque值不排序，不跨owner比较，arrival/timestamp不作顺序依据 |
| query/context上限 | 淘汰slot先invalidated、取消旧读/订阅、清对应材料；late响应必拒绝 |
| 无源draft同步 | 每设备内存稿独立；不得用WS/目录/聊天事件私造跨端稿合并 |
| 业务跨端变化 | 只qualified正式query/change/resume刷新；权限撤销每端均重新资格化 |
| 循环与重入 | 无unbounded retry/spin；CAS conflict允许当前纯操作重读，不自动触发第二effect |
| 测试证据 | CONC-01～14仅planned切口；不证明SDK/backend实测 |

## 8. 回填草稿

正式03 §12采用§7逐资源、逐族identity/window、SDK闭环前置、重入/unknown规则。Step6/9现有reserveDispatch、payload冻结、current CAS一致；没有新增函数或state。

## 9. 待确认事项

SDK幂等窗口/digest/result存储查询/跨设备冲突、正式source checkpoint/coverage和恢复能力仍CHAT-UP001～003/008/009 blocked；host/storage与质量阈值待后续文档。不能交实现者自行补key、窗口或重试次数。

## 10. 进入下一步条件

43协议均可回指identity/current窗口/重复处理；业务association与local身份分立；双dispatch、late/revoke/容量/unknown恢复有planned切口。本地设计gate通过，进入Step14配置与外部绑定，不宣称集成ready。
