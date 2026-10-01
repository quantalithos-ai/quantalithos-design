# L5-chat 03 · Step 14 配置引用与外部依赖绑定

## 1. Step 状态

> done；pass_with_upstream_blockers；2026-10-01。SOP Step14、书写规范5.13；回填正式03 §13。
> 数值默认、配置格式与生产部署交04；本步只定义现有字段的绑定规则，不提前创建04。

### 1.1 Step内计划

| 批次 | 内容 | 状态 |
|---|---|---|
| 14-A | ClientConfig全字段及装配时序 | done |
| 14-B | typed ports/SDK/host/storage/跨仓映射 | done |
| 14-C | 默认、缺项、降级和不可配置化边界 | done |

复杂度：配置只有一个strict local输入，按字段表与binding表拆分；不引入配置服务或业务参数schema。

## 2. 本步输入

正式01/02、Step3/4技术与布局、Step6 ClientConfig/ConfigLoader/ApplicationComposition、Step7 §10/12能力矩阵、Step11～13安全/重试；Governance Step14配置边界、跨仓映射与builder粒度。重新读取真实SDK package.json/index.ts：@quantalithos/sdk private0.1.0，main/types指dist，当前export为SdkClient/EventClient/ServiceClient等骨架；不证明Chat typed能力已存在。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1. 谁读config | ConfigLoader strict parse，ApplicationComposition注入；coordinator只接必要validated参数/port；UI不读env/secret/endpoint。 |
| 2. 类型/默认/位置 | §7.1逐ClientConfig字段；schemaVersion=1、memoryOnly=true、diagnosticMode缺项disabled，其余required或宿主类型条件必填；数字确值交04，缺失blocked。 |
| 3. adapter注入 | SDK query/command/change/reference/diagnostic、platform/lifecycle/AT、memory repository、local identity/config source。 |
| 4. 超时/重试/降级 | SDK正式profile决定transport；Chat不包command通用retry。query临时失效unavailable，unbound blocked，unknown只probe；host/storage资格不足受限。 |
| 5. 04应细化 | 文件格式、加载优先级、完整校验区间及数值、profile选择/环境映射、宿主权限与版本矩阵；不能改变truth/guard。 |
| 6. Rust跨仓依赖 | 本Chat native_host无业务Rust跨仓依赖；不套用Governance core-contracts Cargo表。TS编译期消费SDK，Tauri仅bounded host。 |
| 7. 运行期/事件 | 所有owner消费只能SDK正式ports；无私有API、raw bus、共享DB或owner crate import。 |
| 8. 仓/contract不可用 | 纯core/fixture仅planned隔离验证；缺SDK构建export阻塞真实adapter，缺业务合同blocked；fake不满足生产binding。 |

## 4. 当前文档问题诊断

| 位置 | 问题 | 收口 |
|---|---|---|
| Step6 ClientConfig | 字段完整但消费者/缺项口径未集中 | §7.1所有字段逐项绑定 |
| Step7 SDK matrix | capability名称容易误认为真实export | §7.3重复强调operation为Chat-local名称，SDK方法仍未绑定 |
| Step3/4 planned package | 实际SDK dist与源码存在不等于可直接import所有设计能力 | file dependency要先SDK构建并验证export/合同，不能深链src代替public入口 |
| memoryOnly/host | 开关可能非法启用durable/原生打开 | literal和probe双边门禁，不可配置绕过 |

## 5. 改动前后对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| 默认值 | “后续确定”分散 | 硬literal/required/条件缺省分类 | 实现者不得猜生产数值 |
| dependency | 能力名称与source出口可能混同 | 实际package/export和blocked操作分开 | 不伪SDK已支持Chat |
| runtime参数 | 可能组件读env | config→composition→typed deps | 安全配置只能装配读取 |
| 无bound能力 | fixture可能默认开启业务 | blocked adapter只输出safe failure | fake不能成为正式输入 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| strict config一次加载、immutable注入 | 读取点清晰 | 修改profile需新composition和重新资格化 | 采用 |
| live env/raw endpoint注入组件 | 快速调试 | raw secret、绕SDK、旧generation跨profile | 不采用 |
| 自动默认生产limits | 能快速启动 | 无质量/内存预算依据 | 不采用；required缺项blocked |
| 公开npm/crates默认安装 | 易分发 | 当前private本地多仓流程不匹配 | 不作为前置 |

## 7. 结构化中间产物

### 7.1 ClientConfig逐字段引用

定义唯一在Step6 config/client_config.ts，LocalConfigSource.read返回LocalConfigInput；其未知输入只供strict配置parser，不作为SDK业务unknown。

| 配置项 | 类型 | 读取/注入位置 | 默认/缺项 | 04应承接位置 |
|---|---|---|---|---|
| schemaVersion | literal1 | ConfigLoader | 1；未知版本reject | schema/version |
| platform | desktop或web_preview | composition/platform选择 | required；V1 desktop，preview须显式 | profile/platform |
| sdkProfileRef | string正式非敏感profile ref | SDK binding装配 | required；无endpoint/token替代 | SDK profile来源 |
| hostProfileRef | string或null | DesktopPlatformAdapter/host guard | desktop须正式引用；preview null | host profile |
| maxTextUnits | 正safe integer | DraftPolicy/冻结payload工厂 | required，无生产默认 | 文本边界/单位和确值 |
| maxAttachmentRefs | 正safe integer | DraftPolicy/输入工厂 | required | 引用上限 |
| maxCachedEntries | 正safe integer | PersistenceSafetyGuard/local分页 | required | memory/cache/page预算 |
| maxConsumedChanges | 正safe integer | reducer/来源去重 | required；达限按Step13失效重取 | 去重/coverage预算 |
| maxDirectoryQueryUnits | 正safe integer | search工厂/DirectoryCoordinator | required | 搜索长度和安全参数 |
| maxConsumptionContexts | 正safe integer | 消费槽位注册/cleanup | required | active slot上限 |
| maxVisibleProcessNodes | 正safe integer | safe拓扑工厂/只读renderer | required | 图/等价列表节点预算 |
| maxVisibleProcessEdges | 正safe integer | safe拓扑工厂/只读renderer | required | 边预算，不泄露隐藏计数 |
| memoryOnly | literaltrue | repository装配/guard | true；false reject | 当前硬约束，不能profile override |
| diagnosticMode | disabled或formal_low_sensitivity | composition/handoff adapter | disabled；后者还需正式sink资格 | opt-in与低敏能力绑定 |

字段不得扩展raw credentials、内部topic、owner endpoint、allowAckConfirm、autoResendUnknown、persistRawBody、disableVisibility或开hidden topology。配置超范围/未知键拒绝，无half-valid composition。04尚未完成，因此生产limits/profile完整解析资格仍blocked；测试fixture可显式提供小整数验证边界，不能作为生产默认。

04反向校准（2026-10-01）：配置数值/profile/来源格式已由当前04流程收口；外部八域JSON→既有flat14字段映射、source重复键拒绝、UTF-16单位、required缺项及startup全量冻结已原位回写Step6与正式03 §5.9，不新增字段/签名。上表“04尚未完成/生产limits blocked”是本Step原日期的后续输入记录；当前应读取正式04的范围/required/profile与风险，实际SDK/host资格和生产质量预算仍blocked，不把数值示例当生产默认。

### 7.2 配置加载与装配顺序

1. LocalConfigSource读取一次typed本地输入；无业务网络和credential注入。
2. ConfigLoader.validate检查strict key/types/literals/正safe integers；失败仅安全blocked shell。
3. 选择desktop或web_preview；Mobile不注册，不自动申请宿主权限。
4. SDK正式public入口创建binding registry；每SdkOperation缺合同标blocked，不能按“包存在”bound。
5. trusted SDK session/actor关联建立新epoch；没有session保留blocked入口，不能构造假actor。
6. create immutable初始root；memory repository注入同store/guard；无localStorage/SQLite fallback。
7. 注入typed ports/coordinators与page callbacks；UI只snapshot，不给raw client。
8. host/lifecycle/AT订阅只一次，cleanup先invalidate/hide→stop/unsubscribe→memory clear。
9. profile切换建立新composition/epoch，旧回包全拒绝；不能live mutation使旧refs有效。

### 7.3 外部依赖绑定矩阵

| 依赖 | 装配位置/接口 | timeout/retry责任 | 未闭合降级 |
|---|---|---|---|
| SDK entry/session | SdkCapabilityBinding/SdkQueryAdapter→EntryAccessPort | 正式SDK profile；Chat只取消读等待 | CHAT-UP001/002 blocked |
| conversation/Turn | CollaborationReadPort.readSurface/readTurnPage | 正式query及cursor合同 | safe unavailable/blocked，无私有fallback |
| Work/Workspace safe page | CollaborationReadPort项目读取；SafeMaterialReadPort | source独立失败/重取 | CHAT-UP005/006/WS-UP blocked |
| Process整体/阶段/节点 | 同port三个Process方法 | topology/state版本与change/resume合同 | CHAT-UP008 blocked，无推图 |
| project↔conversation关系/公司目录provider | links/directory/member读取 | provider/access/搜索分页合同 | CHAT-UP009 blocked，目录不授予DM |
| Conversation/Governance intent | IntentCommandPort.prepare/dispatch；IntentProbePort | 正式幂等与owner result；无通用retry | CHAT-UP001/003 blocked；potential effect unknown |
| Artifact preview/locator | SafeReferencePort.preview/toRestorationHint | SDK正式只读/安全引用 | CHAT-UP004 blocked；不拼URL/serialize handle |
| changes/qualification/resume | ChangeFeedPort/ChangeQualificationPort/ResumePort | SDK coverage/重连；Chatsource单flight | CHAT-UP002/008等blocked；无内部bus |
| Runtime/Member/Identity摘要 | SafeMaterialReadPort/readMemberContext | 独立source资格 | CHAT-UP006 blocked；无执行/目录truth |
| 低敏Observability交付 | DiagnosticPort.send | 正式sink；unknown不自动重送 | 默认disabled，CHAT-UP007 blocked |
| desktop bounded host | PlatformPort/LifecyclePort/AccessibilityPort | host当前scope/window/origin资格 | controlled_preview/safe_storage未qualified blocked |
| Web preview host | WebPreviewPlatformAdapter | 无native安全存储/打开 | unavailable；fixture独立，不当desktop验收 |
| 内存投影 | MemoryProjectionRepository | 同turn版本CAS；delete安全重试 | memory事实，无durable证明 |
| LocalIdentityPort | composition生成local ids | 本地非空typed id | 不生成owner refs/results |
| LocalConfigSource | ConfigLoader注入 | 本地strict输入 | invalid/missing blocked |

### 7.4 跨仓依赖与包版本

| 仓/第三方 | 类型/路径 | planned引用/使用位置 | 不可用时 |
|---|---|---|---|
| quantalithos-sdk | TS编译期正式public package；/home/aris/Projects/quantalithos-sdk/packages/typescript | 实现仓预计同级quantalithos-chat，npm依赖file:../quantalithos-sdk/packages/typescript，import @quantalithos/sdk public exports | dist/types构建及export验证前真实adapter blocked；不得import私有src补能力 |
| core | 全局允许基础契约依赖；当前Chat无直接已确认public类型需求 | 本轮不增加TS/Cargo依赖，已需基础类型通过SDK正式暴露 | 如未来需直接类型，必须重新确认public绑定与设计裁剪 |
| Conversation/Process/Identity/Work/Governance/Artifact/Workspace/Member/Runtime/Observability | runtime消费，真实owner仓仅阅读 | 仅SDK ports；无Cargo/npm owner private依赖 | 正式能力缺失blocked |
| Bridges | parallel sibling边界参考 | 无compile/runtime接入，没有平台映射 | 未停审不作输入 |
| React/TypeScript/Vite/npm/Tauri2 | 已收稳技术方向；单TS app + native host | 版本/lock精确选择交04/07，native只host | 未做安装/build/兼容验证 |
| Mobile Capacitor候选 | reserved | 不注册、不要求V1实现 | 后续再评估 |
| 内部bus/DB/Tools/Runtime推理/观测backend | 禁止直接依赖 | 无binding | 不fallback |

真实SDK package版本0.1.0仅阅读事实，不能作为已验证兼容pin。中期private git tag/rev可评估，当前不需要公开发布。实际file相对路径须实施仓落位后再核对，不在设计仓创建package/lock。

### 7.5 不可配置化边界与检查

| 不可改变 | 原因/检查切口 |
|---|---|
| owner truth、结果authority、ACK不确认 | 正式业务边界；config parser拒绝绕过键 |
| unknown无automatic resend | SDK幂等/probe证据边界；offline/reconnect不发command |
| visibility/fence/slot/source隔离 | config不能授予权限或复活旧response |
| memoryOnly/草稿正文/handle不序列化 | 未闭合durable资格；host available也不自动启用 |
| safe图/列表/AT同拓扑 | 不能配置显示隐藏节点/数量/边 |
| 低敏allowlist/默认disabled | 不输出raw body/error/secret/ref token |
| SDK-only/no private API/bus | package存在不证明capability正式绑定 |

## 8. 回填草稿

正式03 §13采用§7全字段、装配、binding、跨仓与硬边界；numeric/profile确值移交04。实际package路径/export作为binding证据定位，不宣称正式能力可用。

## 9. 待确认事项

CHAT-UP/WS-UP/provider/host/storage继续blocked；04配置数值、优先级、兼容矩阵、SDK正式exports及dist构建资格待闭合。只影响相应正向集成/生产装配，不取消本地设计完成。

## 10. 进入下一步条件

ClientConfig14字段与全部ports读取/注入/缺项/降级可回指；无新增私有依赖/SDK方法，生产参数待04显式记录。本地门禁通过，进入Step15诊断与审计边界。
