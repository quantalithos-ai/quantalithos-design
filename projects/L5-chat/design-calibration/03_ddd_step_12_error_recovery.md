# L5-chat 03 · Step 12 错误模型、异常分支与恢复

## 1. Step 状态

> 状态：done；gate_status：pass_with_upstream_blockers；日期：2026-10-01。
> SOP Step12/书写规范5.11；回填正式03 §11；错误模型为planned契约，无运行结果。

### 1.1 Step内计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 12-A | canonical错误码及分层映射 | done |
| 12-B | 43协议族的异常/重试/恢复边界 | done |
| 12-C | UI安全输出、unknown/清理、前序回查 | done |

复杂度：按local validation、qualified SDK、local CAS、host/storage四层整理；无第二error enum。复用Step9图，不新增图，因为本步只补相同调用点的失败分支。

## 2. 本步输入

Step6 ChatError/ChatErrorCode/Outcome、Step8 local consumer receipt与reply、Step9全部异常分支、Step10非法迁移、Step11提交边界；Governance Step12错误层级/协议映射/异常/恢复/无成功副作用纪律作为粒度参考。具体SDK HTTP/RPC错误码仍须正式绑定，不猜transport映射。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1. 模块有哪些错误 | 共用ChatErrorCode，由模块按§7.1可用范围返回；ChatError仅code/retry，无自由文本/stack。 |
| 2. 对外映射 | Chat本身无HTTP/RPC服务；Facade输出Outcome<T>，consumer输出local disposition。SDK错误在adapter映射，不穿透正文。 |
| 3. 重试/介入 | never为不可原样重试；read_only只允许新资格化query/probe/resume；explicit_after_probe须用户动作、正式无effect/拒绝结果和capability；unknown不重发。schema/安全/合同缺失需owner或设计修复。 |
| 4. 事务/冲突/重复/依赖 | CAS失败无部分patch；pure重算；已dispatch仅probe。相同change duplicate无水位变化；外部暂不可用保持局部姿态，不伪missing。 |
| 5. 异常观测 | 仅有限低敏code/category；默认diagnostic disabled。拒绝、unknown或清理失败不产生owner审计/成功event/验收证据。 |

## 4. 当前文档问题诊断

| 位置 | 问题 | 修复 |
|---|---|---|
| Step6 §2.3/§20.5 | 已绑定SDK只读暂不可用缺专属错误码，易借宿主错误 | 原位新增dependency_unavailable；五page failLoad同码unavailable |
| Step9 §12补充 | 失败更新需保留original slot并禁止成功reply | 原位映射同步；context_changed/aborted_read不写新view |
| Step11 unknown/删除失败 | 异步失败不能统一为failed/cleared | §7.3～7.5固定effect/result/cleanup恢复上限 |
| 历史正式03错误/重试章节 | 不满足当前SDK-only和结果authority | 不继承自由文本、自动重发或内部bus映射 |

## 5. 改动前后对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| SDK只读临时失效 | 错误类别不独立 | dependency_unavailable/read_only | 区分缺合同与已绑定暂失效 |
| 异常返回 | “失败”可能被当业务failed | 按dispatch点和正式no-effect分别判断 | 保护不确定副作用 |
| UI降级 | 空白/旧cache可能覆盖撤销 | 先资格后安全姿态，hidden优先 | 不泄露存在性 |
| retry | 错误码可能触发通用retry middleware | retry只是上限提示，仍需flow gate | 不绕过unknown与幂等 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 有限code + 安全姿态 + 独立retry上限 | 可测、可本地化、无raw error | 必须按flow细分恢复 | 采用 |
| 原样SDK异常/HTTP message展示 | 简单 | 泄露正文/secret，无法证明effect | 不采用 |
| 所有网络错误自动重试 | 容易恢复读请求 | 副作用重复、撤销后重入 | 不采用；只读也须新current context |

## 7. 结构化中间产物

### 7.1 canonical错误类型及模块映射

ChatError完整schema仍Step6：{ code: ChatErrorCode; retry: "never"或"read_only"或"explicit_after_probe" }。新增dependency_unavailable已回填唯一定义；以下逐variant语义为factory/adapter JSDoc依据。

| code | 返回模块/触发条件 | retry上限 | 安全展示与处理 |
|---|---|---|---|
| invalid_input | config/factory/local protocol；结构、范围、未知键 | never | invalid/blocked；不IO；修改输入再验 |
| dependency_unbound | sdk/platform/repository；正式export/合同未满足 | never | blocked/unavailable安全面；owner补合同后重装配 |
| dependency_unavailable | 已绑定SDK query/probe/resume临时失效 | read_only | 当前VM unavailable，独立section可partial；新资格重取 |
| authority_missing | guards/result gate；正式session/source/visibility/result证明不足 | never | blocked/hidden；丢弃未qualified材料，不补actor |
| access_denied | navigation/intent capability；正式读取或当前action拒绝 | never | restricted/hidden；不泄露对象是否存在 |
| context_changed | coordinator/store；actor/session/scope/target/slot/代次改变 | never | 旧只读discard；effect可能成立的旧command不能写新session |
| local_conflict | store/repository；expected版不匹配 | read_only | 重读/纯patch重算；不得二次dispatch |
| invalid_transition | state factory/method；From/To/不变量不满足 | never | 保持原值，设计缺陷需修复；不可兜底成功 |
| unsafe_material | mapper/guard；禁止正文、secret、隐藏关系/图label | never | 拒绝持有/展示；可按低敏code诊断，无raw材料 |
| unsupported_material | mapper/render；未知schema/category | never | 合格可披露category可unsupported安全占位；不解析未知正文 |
| continuity_gap | reducer/resume；正式缺口 | read_only | gap/stale，走formal requery，不按arrival补序 |
| effect_unknown | 已dispatch命令/诊断/host effect无决定结论 | explicit_after_probe | command unknown→probe/query/wait；此flag绝不直接允许重发 |
| storage_unavailable | repository读写/delete不能确认 | read_only | persist失败不声称cached；evict失败restricted；只重试安全清理 |
| platform_unavailable | 宿主probe/open/lifecycle/AT缺能力 | read_only | unknown/unavailable/needs_action；安全等价列表/焦点路径 |
| aborted_read | query被取消 | never | 不更新新view；无owner取消含义 |

effect_unknown的retry=explicit_after_probe仅表示后续**正式probe证实无effect或业务拒绝并有新capability**时可由用户建新intent；在unknown本身仍只能probe/wait，不能走SDK retry。

### 7.2 Facade、Consumer、页面失败映射

| 内部结果 | 协议输出 | 状态处理 |
|---|---|---|
| 合格读取且current CAS成功 | Outcome.ok(ClientReply<T>) | 可包含正式empty/partial/blocked安全surface；不伪业务成功 |
| parser/session/guard/port/CAS失败 | Outcome.error(ChatError) | 不能返回旧localVersion伪success；UI按安全失败姿态 |
| 已dispatch后无决定结果 | 正常IntentFeedback(status=unknown)或effect_unknown错误；以对应Step9flow为准 | attempt保留unknown，不把请求失败当no-effect |
| rejected/failed正式result | 合格feedback，非transport error | 精确释放匹配草稿submitting→editing，随后validate；保留文本 |
| applied change | LocalConsumerReceipt.applied | 安全patch/水位/去重身份同CAS |
| SDK证明duplicate | duplicate | 不重算领域状态、不再次推进cursor |
| 旧context/已取消read | ignored | 无新generation写入 |
| 正式visibility revoke | restricted | 先隐藏/失效再stop/delete；不能作为普通ignored漏收紧 |
| 缺合同/资格 | blocked | 不ACK业务，不订bus |
| SDK gap/无法证明连续 | needs_requery | formal resume/requery；不凭连接恢复fresh |
| hidden/unsupported/failed preview | safe PreviewResultView或Outcome.error | 清reference/summary/openRef/provenance；不发明URL |
| AT/诊断失败 | 安全本地反馈/typed错误 | 不推进owner状态，不输出raw材料 |

五page Factory.failLoad(view,error,current)均使用Step6签名：unbound/authority/access/unsafe→blocked并清引用；dependency_unavailable/storage_unavailable/platform_unavailable→unavailable；gap→stale；独立section缺失且主access合格→partial。context_changed/aborted_read不应用旧结果；CAS冲突重读。hidden不能被unavailable恢复。

### 7.3 Command失败点逐项恢复

| 失败点 | effect证据 | attempt/draft | 允许后续 |
|---|---|---|---|
| local validate/capability失败 | dispatch尚未预留/调用 | 无new attempt或draft failed；匹配稿保留 | 用户修正并重新验证 |
| SDK prepare失败 | 正式prepare合同必须无effect | failed/dispatched=false；释放匹配submitting稿 | 新capability后显式新intent |
| reserveDispatch CAS loser | 当前winner可能已dispatch | loser不调用SDK；读winner反馈 | 同intent返回当前反馈；不造新intent绕过去重 |
| reserve之后dispatch抛异常/断线/关闭 | 无formal no-effect证明 | unknown/dispatched=true；稿不自动释放 | probe/query/wait，不automatic resend |
| 普通HTTP/WS/AG-UI ACK | 仅接收/transport | submitted或SDK明示pending | 等正式result |
| 正式业务committed result/receipt | owner+intent+actor+scope+association匹配 | confirmed；只清同revision稿 | 显示正式引用，不从toast断言 |
| 正式拒绝/no-effect failure | 正式authority保证 | rejected/failed；同稿releaseSubmission | 用户决定新意图；SDK新准备 |
| probe not_found | 未证明no-effect | unknown | 保持待核对；不能把无记录当失败 |
| 回包到旧session/scope | 原effect可能已成立 | 不写当前root，不展示旧actor结果 | 当前获准正式查询可另核对；不恢复旧命令权限 |

### 7.4 查询/消费/清理异常恢复

| 场景 | 检测位置 | 恢复 | 成功event/审计 |
|---|---|---|---|
| 项目/节点/目录搜索迟到 | original slot+parent/query lineage/CAS | discard或重取当前目标 | 无owner写入 |
| 部分owner失败/版本不兼容 | mapper/VM工厂 | partial/stale；不跨source补snapshot | 无owner审计 |
| Process父图新版本 | topology工厂/selection guard | 旧stage/node/边失效；重新formal read | 无token推进 |
| 关系解除/目标撤销 | qualified change/visibility | 清双向入口与target选择；返回需独立重验 | 无客户端解绑命令 |
| feed停止失败 | stop/stopContext | 旧slot已失效，后续回包拒绝；可再安全停止 | 不回滚遮蔽 |
| evict冲突/失败 | repository返回DeleteResult | 不cleared，保持restricted；重读当前entry再delete | 无durable删除证明 |
| memory持有达上限 | guard/config bound | 裁剪候选且旧context失效；必要source stale/requery | 不丢去重身份后继续声称fresh |
| 诊断sink缺失/未知 | DiagnosticPort | disabled/blocked/unknown，一次显式操作不自动重送 | 不产report/evidence |
| host open失败/ACK | PlatformPort | unavailable/needs_action，链接不当业务提交 | 无业务审计 |
| IME/重复mount/重复callback | UI callback/intent预留 | 不误发/不双dispatch；纯读新请求须fence | 无fake业务成功 |

### 7.5 恢复优先级与安全输出

1. 正式撤销/登出优先：失效、隐藏、清引用，不因缓存或技术失败重新暴露。
2. 校验当前actor/session/scope/target/source/visibility/请求slot，再处理纯本地版本冲突。
3. 有潜在effect时先probe，不执行通用retry；SDK正式no-effect才能进入用户新意图分支。
4. 只读暂失效允许明确的新query/resume；cancel只取消读等待，不取消业务effect。
5. 所有错误文案从code/SafeReasonCode本地化；不含对象隐藏title、人员数量、URL、正文、secret、stack或原SDK消息。

## 8. 回填草稿

正式03 §11采用§7完整错误表/协议输出/异常恢复；唯一定义在§5的ChatError/ChatErrorCode，新增dependency_unavailable与五page失败映射已原位同步Step6/9。状态enum仍12种、主体仍17个；没有新增错误state。

## 9. 待确认事项

实际SDK wire错误→本地code、no-effect证明、probe恢复语义由CHAT-UP001～003及owner绑定合同确认；清理/宿主受限由host/storage确认。未闭合维持blocked，不以temporary错误伪装contract缺失。质量阈值交04/05/06，不宣布测试通过。

## 10. 进入下一步条件

15个canonical错误variant、协议族输出、dispatch前后、撤销、清理和read-only恢复已覆盖；schema与Step6/9原位同步，local设计检查通过。进入Step13并发幂等；没有实施/运行/证据。
