# L6-bridges 03 Step12：有限错误、异常分支与恢复

## 1. 开工确认

2026-10-03；剩余03授权下串行到达Step12。已读SOP12全文/书写§5.11、Step6错误与stage/result、Step7 PE/conflict/Entry mapper、Step8协议及Step9异常/Step11事务。通用执行纪律沿03 flow；不新增错误标签/外部authority，不运行测试或提交，正式写权限仍false。

## 2. 模块计划与门禁

| 模块 | 思考 | 写入/草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|
| E1 finite errors / boundary mapping | done | done | pass_design | pass | 进入E2 |
| E2 failure stages / authorized recovery | done | done | pass_design | pass | 进入X |
| X cross-audit | done | done | pass_design_static | pass | enter_step13 |

当前03/Step12/complete，gate_status=pass，gate_reason=finite_error_recovery_design_review_pass，next_allowed_action=enter_step13；当步语义写入关闭。BR-UP-001~009及原Workspace/Observability资格仍open；commit_required=false。

## 3. E1 可审查设计记录

问题1~2：Domain/Contracts纯guard只有`ContractViolation`八variant；Application/Infra/Entry调用失败只有`BridgePortError`十variant及具名conflict五族。已知业务结果、ACK、LocalCommitDisposition/资格/Job返回不是error别名。公开codec错误为Step8完整`BridgeProtocolError`，不得导出PE的privileged subject/key/phase载荷。

诊断：如果所有timeout/403/429都映Failed再retry，会把结果未知当无效果；safe错误直接Display/source会泄漏raw SDK/DB/header。采用已有finite error -> visibility-safe protocol issue的total分支映射，已越效果边界先保原original/known/unresolved；未采用新统一`BridgeError`或“任何异常写审计”。复杂度：有限两表与逐阶段表，不新enum/状态；完整schema仍原卡。

## 4. E1 错误类型与边界映射

### 4.1 类型、归属与重试分类

完整Rust-facing载荷分别在Step6 `errors.rs`/shared outcomes、Step7 support§3、Step8 shared§2/6；不另定义同名类型。`PE`/`CV`仅表记法。

| 错误 / 类型所属 | 触发 | 重试 / 对外上限 |
|---|---|---|
| CV InvalidValue / WrongKind / InconsistentFields | shape/编码/expected/非法state边 | 不自动retry；PE::InvalidInput，finite InvalidInput；零候选修改 |
| CV ForbiddenMaterial | 正文/token/secret/审批或可还原派生进入safe载荷 | 不自动retry；PE::InvalidInput(CV::ForbiddenMaterial)，不导出输入值/敏感分类详情 |
| CV MissingRequired / OutOfScope / Expired / UnknownEffect | required Slot/scope/window/原unknown guard | 修正来源/授权或原op权威恢复；不能retry execute；finite InvalidInput/资格结果，不能新成功 |
| PE InvalidInput(CV) | 已校finite结构失败 | 零执行；改合法请求且不得换key掩盖原meaning |
| PE Denied / NotEstablished / Unsupported / Stale | current责任拒绝/正式seam未建立/不支持/依据失效 | 不自动retry；用户或owner/装配补资格后重新核；不把Stale reason构造成维护basis |
| PE Conflict(BridgeLocalConflict) | Version / SemanticKey / Effect / OneUse / RateReservation | Version只新actual读/受权意图；Semantic/Effect原winner复用；OneUse零重批；Rate等待全bounds，不通用retry |
| PE Unavailable | 未取得合法typed结果且尚未可能effect | bounded只读取得可再核；已有effect必须保original，不返回丢original的Unavailable |
| PE Cancelled(BridgeCallPhase) | 尚无原operation且local停止 | 非NoIo/NoEffect；已有original/可能effect改原稳定结果或Indeterminate，不丢责任 |
| PE Indeterminate {original,phase} | LocalStage/LocalCommit/OwnerHandoff/PlatformEffect/ConsumerHandoff任一可能未知 | same-op权威读/人工出口；禁止新apply/send/approve/operation |
| PE InvariantViolation | 同source/schema/namespace、closure、未知decode/额外write等不一致 | 隔离受影响动作、人工/设计修复；不降级成功或从raw cause猜分类 |
| BridgeProtocolError | wrapper版本、metadata、surface、shape或安全对外映射 | only finite issue/area/reason三字段；无PE raw载荷/ref/count/Error source |
| known owner/platform/consumer result与LocalCommitDisposition | 各实际source的业务/driver结果 | 不当transport error；KnownRejected仍可能已有效果，不推NoEffect；Committed只local |

### 4.2 HTTP / typed library / Event / Job 映射

| 内部情况 | 原protocol / HTTP映射 | 调用方必须处理 |
|---|---|---|
| decode/unsupported version/wrong surface/missing-required/invalid shape | Step8原ProtocolError；HTTP400 | 零business dispatch/raw evidence；修合法输入，不反推授权 |
| Denied 或无许可披露冲突/存在性 | finite NotAuthorized；403 | 不输出hidden subject/ref/key/actual revision/count；不借404测存在性 |
| Conflict且当前允许披露 | finite Conflict；409 | 只原safe reason，不序列化BridgeLocalConflict typed载荷或winner refs |
| NotEstablished/Unavailable/InvariantViolation | finite DependencyUnavailable；503；原typed库保有限分类 | 没有NoEffect不重execute；缺正式合同/driver需要补资格，不靠等待解决 |
| PE Unsupported | outer ProtocolIssue DependencyUnavailable + reason MissingContract；503。只有真正UnsupportedVersion才原version拒绝400 | Application已产出stable Unsupported原因的原结果可按该结果呈现；outer不能造result或不存在的Issue Unsupported；不替换action/平台 |
| PE Stale | outer DependencyUnavailable + reason DependencyUnavailable；503；已有合法filtered结果沿其原wrapper | 不能把StaleBasis塞入不允许的ProtocolIssue配对、用旧资格继续IO或自行创status码 |
| 已过滤Application Indeterminate | 原safe结果；outer缺view只finite OutcomeUnknown，202 | 202不是accepted；host保actual original/phase/unresolved，mapper零IO不能补结果 |
| Cancelled / connection lost after effect | 能输出时原Indeterminate/known结果；无法响应则host保原责任 | 不造fake response/200/ACK；client断开不rollback foreign |
| stable C/Q结果 | 原response wrapper；HTTP200只运输成功 | body有限local/owner/platform/consumer分stage，Denied/NotFound/Blocked/Unavailable仍不互证 |
| Event E01/E03 或 E02/E04 | 原Consume result + 独立actual ACK；不用通用HTTP表伪平台ACK | ACK失败保已提交结果，redelivery同key复用；不复制raw dead-letter |
| 五Job/Worker | 原六JobResultDisposition/entry phase/unresolved | 仅actual summary才能response；finite失败不造run/report/count，batch完成不清unknown |

E1草稿：公开错误只finite、visibility先于细节，known结果与transport失败分离；不写raw cause/Display/stack/SQL。PE/CV/ProtocolIssue回指原类型，无新增variant，人工E1自检pass。

## 5. E2 可审查设计记录

问题3~5：能否retry取决于原效果证明/current/预算/源窗口，而非error名字。诊断：失败可能发生在begin、commit、owner已执行、platform已接受或consumer已收取后；统一“失败重试”会制造第二效果。采用known优先、分phase记录责任、正式只读probe与合法result-only；未采用NotFound/lease/deadline作为NoEffect。复杂度：按actual边界及原五Job逐切口，不新增通用恢复命令或retry loop。

## 6. E2 异常分支与恢复

| 检测位置 / 异常 | 处理 / 恢复 | 审计/事件与禁止 |
|---|---|---|
| pre-dispatch shape/source/signature/unknown route/body预算 | 原finite ProtocolError或平台专属失败ACK计划；零business接管 | 零dedup/audit/artifact；不log raw body/header/token |
| actor/两端binding/generation/Gate/附件/secret current不足 | Denied/Blocked/Stale/NotEstablished；原current失效即阻新IO，不等J05 | 无实际mutation则零审计；授权拒绝不造默认low-sensitivity展示/审批 |
| local stage/CAS/unique失败且actual RolledBack | 保原request/key/meaning；可见same meaning winner复用；有限Conflict | whole rollback，不部分audit/claim/result；不换effect/op再执行 |
| commit/rollback返回Err/Indeterminate或client取消 | 保original/mutation/phase，只同driver `read_original_commit` | 不新begin/apply/IO；NotFound不RolledBack，logger不存proof材料 |
| actual Committed，下一资格失效/secret解析失败，尚无IO | 实际NoIo同attempt有完整来源才沿J01 D；否则unknown/manual | 不声称rollback local；NoIo不是NoEffect，不能清head换新effect |
| owner handoff timeout/unknown | 原Inbound/Callback Indeterminate、one-use/claim保持；受权J02只读同op权威probe | 平台ACK不提供owner结果；zero二次handoff/approve/GlobalMember/Turn创建 |
| platform timeout/连接断开/5xx不含effect proof | 原attempt/intent未知、lane unresolved_head；J02受权原probe或人工 | zero generic retry/delete重发；没有known结果不append receipt |
| platform 429 / rate bound更新 | 原全global/method/resource/bucket下界最大值；有权威NoEffect且同effect/current预算才J01后续attempt | 429本身不证明NoEffect；没有qualified bounds不进行外呼，SDK暗重试禁用 |
| receipt/结果已known，local finalize失败 | host保actual typedknown+原claim/op；同mutation权威恢复，known-only合法finalize | foreign结果不回滚、不重send；原immutable proof不覆盖成“最新” |
| action callback合法验签但无责任/Policy/Gate/one-use | 当前Denied；Claimed/Expired/Revoked终态不复活 | 零owner审批；callback ACK不证明Decision，平台actor不自动Integration权限 |
| sensitive Gate无外显或动作资格 | 仅有明确无action安全外显授权才Degraded；否则Blocked/Unsupported | 零正文/敏感审批日志或evidence，不能把“脱敏”当授权依据 |
| source disconnect/epoch变更/unknown range/partial覆盖 | 原Protocol gap/old cursor保持；C06显式受权后J03同range readonly | 空页/时间/count不Closed；gap闭合不advance stage，zero raw replay |
| canonical/admission/rule缺失或consumer未知 | preflight阻对应local mutation/IO；原handoff不建新producer；J04同canonical/op | 正式非递归scope不够仍blocked；consumer ACK!=Accepted!=evidence |
| J04 Blocked带原claim迟到known | 保actual原consumer结果/责任，人工出口；不造Blocked->ConsumerAccepted边 | 不能丢known后以NoEffect复活；原typed责任不进入raw日志 |
| Query hidden/NotFound/Unavailable/projection失败 | 当前有限view/Unavailable，返回前再核visibility | zero audit/dedup/clock-ID/repair/probe；hidden count=None，不假0 |
| Dedup Expired与迟到known | Expired终态不attach_result换state；原业务record/receipt保known及原op责任 | 不删key/换op重执行，原immutable result不补写伪known；expiry本身仅J05批准U |
| Worker停止/Jobs取消/ACK丢失 | 合并原unresolved到宿主停止责任；原candidate/job action界限保留；redelivery复用原结果 | source reconnect不清gap；batch CompletedLocal只收齐，不造运行report/全平台成功 |
| forbidden材料/unknown schema/额外stage/invariant | fail-closed、有限安全分类；必要人工修复source/设计 | 零raw dead-letter/SQL/stack/source display/证据；pure异常不创建持久audit |

### 6.1 原Job恢复角色

| 恢复路径 | 当前许可 / 必需证明 | 不能执行 |
|---|---|---|
| C06 -> J02 | 原subject/op授权/窗口/预算/正式readonly authority，LocalCommit独立分支 | new effect/新op、not-found即no-effect、直接send/approve |
| C06 -> J03 | 同gap/range/epoch、正式comparator与full source coverage；B后新stage读取 | replay raw body、partial close、自动跨epoch水位 |
| J01 retry | 同intent/effect，authoritative NoEffect及完整RetryEligibility/current/all bounds/budget、原head合法处置；NoIo只允许原attempt合法NotDispatched本地处置，不能替NoEffect授retry | timeout/429/lease到期自动第二attempt；修改旧target/action；NoIo强转NoEffect |
| J04 retry | 原canonical/op、正式consumer幂等或NoEffect、完整admission/rule/window、实际claim提交 | new producer/canonical/O01或借ACK lost“再试一次” |
| J05 maintenance | exact既有subject/expected与正式typed维护/expiry依据、完整关联CAS | 新grant、probe/重批/重发/删去重、Unknown head释放 |
| 人工出口 | 显式原scope/subject责任及owner/provider正式结果，仍沿原C/E/J合同 | 人工备注/日志/手填成功替代NoEffect/receipt/authority；新通用override接口 |

每次actual安全mutation的audit/O01沿Step11 G，拒绝/纯读/guard异常本身不写。异常technical指标只有限标签，详细材料禁入；完整观测副作用inventory到Step15。E2草稿及人工自检pass，进入X。

## 7. X 跨审与草稿

对照CV八、PE十、conflict五族、BridgeCallPhase六及ProtocolIssue十一/Area三完整目录；HTTP只承接Step8原400/403/409/503/202/200，平台ACK另行。修正初稿误写PlatformDispatch为原PlatformEffect、删除不存在的protocol定位字段，PE Unsupported/Stale outer只能已有DependencyUnavailable配对，不造新Issue。十九flow都有stage责任/原恢复入口，17+4机及Expired/Blocked终态不增边。

正式§11草稿使用§4有限类型/映射及§6逐阶段异常/五Job角色，schema不变，proof/known优先/source责任保存明确。current/read/private/secret/mandatory/非递归边界与Step9~11一致；外部资格仍未建立，不把设计错误闭包当driver/平台测试。

## 8. 实际检查与停止条件

实际只读03文本格式/本地文件链接检查errors=[]；人工total错误/phase/outer配对和已知结果优先核对完成，不运行compiler/项目测试。过度宽glob与误用shared_protocols复数路径的只读失败已改精确已存在文件并补读；门禁更新器重复匹配恢复行的补丁失败未落盘，修正plan-row匹配后成功，不报失败为完成。下一读取SOP13/书写§5.12、完整typed meaning/key/effect/metadata/retention/结果回放及scope/fence/comparator；不提交。
