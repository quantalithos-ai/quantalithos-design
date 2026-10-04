# L6-bridges 04 Step4：分类与禁止配置化

## 1. Step状态与开工确认

2026-10-04；前序Step3已通过设计静态自检，授权仅全部04；正式04完成即停审。full-restart / single-agent-serial，无代理/并行工具。

| 模块 | 骨架 | 思考 | 写入/草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|
| S4 | done | done | done | done | pass | enter_step05 |

### Step内计划

| 小阶段 | 位置 | 状态 |
|---|---|---|
| 读取输入/前序 | §2 | done |
| SOP问题回答 | §3 | done |
| 当前材料诊断 | §4 | done |
| 设计取舍 | §6 | done |
| 结构化/逐域停审 | §7 | done |
| 复杂度与批次 | §6 | done |
| 回填草稿 | §8 | done |
| 自检/下一条件 | §10 | done |

## 2. 本步输入

Step3二十域/来源链/停审；00§10/11红线、02§11.2、03§7/9/10/13 current/state/UoW/key/Query；配置SOP Step4和书写§5.4。精确读取/使用范围随§7记录，不把旧05/06或Chat作正式输入。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1 类别 | schema/environment/branch与provider选择是启动配置；预算是运行限制但仅startup；策略仅引用正式owner policy，敏感项仅ref；没有body-debug配置。 |
| 2 热更新 | 全部不允许hot/reload；本轮没有承接runtime热配置API。 |
| 3 冷更新 | 所有二十域startup读取；C01 revision变化是显式受权业务管理，不是文件reload。新文件需停止旧宿主、current资格和actual新装配后激活。 |
| 4 禁止控制 | 权限、材料、身份、truth、原key/op/state/one-use、whole事务、未知处理、source coverage和mandatory材料。 |
| 5 变更流程 | 红线先回00/01/02和正式owner；03结构/flow影响先具名回写重审；纯配置语义由04再校准。 |
| 6~8 逐域分类 | 每域分类/不适用/禁配/原因/停审见§7.2；不存在平台例外debug/skip。 |
| 9 跨审 | runtime外部rate/secret撤销动态事实不是可热改文件；资源设置不能变成retention或业务retry authority。 |

## 4. 当前文档问题诊断

“运行时配置”容易被误读为可热更新，“策略配置”容易被误读为本地判Policy。二者分别限定为启动加载的运行资源限制与外部正式policy引用。每次IO的current重核仍动态发生，但不属于配置hot reload；停维护job不能停即时expiry/revoke核验。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| cold方向未按域收口 | 二十域均startup，动态current事实与配置更新分开 |
| 禁配红线来源可能只口号 | 禁配项具名指00/01/02/03的不变量与变更路径 |
| 调试环境风险 | fixture仅隔离测试，不存在生产body_debug或fake_fallback |

## 6. 设计取舍与复杂度

采用全部startup/cold，显式管理C01与宿主重新装配分层；append-only事实/原结果不能“回滚配置”抹掉。未采用hot安全策略切换、audit_only布尔或debug免责。逐域按类别/冷热/禁止面审查再写下一行，不新增公共类型或控制API。

## 7. 结构化中间产物

### 7.1 分类

| 类别 | 说明 / 示例 | 是否允许热更新 | 主要风险 |
|---|---|---|---|
| 启动选择 | host_admission、platform driver/source、owner/store/transport绑定 | 否；startup | 未核choice冒称Qualified |
| 运行限制 | execution数值和scoped宿主绑定，启动固化 | 否；startup | 资源限额被当业务budget/ACK deadline |
| 策略引用 | dispatch/replay选择正式retry/retention/coverage source | 否；startup | 文件自定authority/删除原key |
| 敏感引用 | credential provider、route/owner/private safe selectors | 否；startup；值每call私有解析 | token、ref、DSN/URL泄漏 |
| build-time | core实际path与条件SDK/executor/driver pin登记 | 否；构建不等运行资格 | 选字符串包替代真实compile闭包 |
| static | truth/授权、body-free、原effect、state/UoW/Query红线 | 不可配置 | 绕过owner或一致性 |
| 调试 | 本轮无raw/body/secret debug项；隔离fixture只测试profile | 不适用 | 假造生产driver/权限/证据 |

### 7.2 逐域分类边界 / 停审

| 配置域 | 适用类别 | 不适用类别 | 禁止项 / 具名原因 | 生效与停审 |
|---|---|---|---|---|
| `host_admission` | 启动选择 | hot/reload/body-debug/本地授权 | 不能从bin名启用、不能授平台或内部权限；Schema/environment用于loader；branch集合与required一致（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `execution` | 运行限制/启动绑定 | hot/reload/body-debug/本地授权 | 不覆盖业务attempt预算、平台ACK期限或rate下界；资源上限与execution profile一致；SafeInstant运行同域派生（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `installations` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不建账号、不自动C01、不授binding/generation；已接纳revision与启动拟载入内容需一致；首次配置仅管理操作接纳（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `slack` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不从公开文档推安装scope、ACK不当owner结果；family/mode/具体endpoint同时核，不把Events body当交互payload（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `mattermost` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不借Slack验签；PAT/管理员不当内部actor；callback必须trusted integration/plugin合同；incoming webhook不作事件输入（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `telegram` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不双消费、不保证删除通知/历史完整、不存含token URL；消息/回调family整体切换，offset不等owner进度（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `discord` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不把Snowflake当总序、不把token或ACK当授权/送达；Inbound仅Gateway；Callback family独立互斥；resume不足保gap（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `local_consistency` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不改wholeCAS/原子性、不换driver探原unknown、不生产inmemory；SafeRead只用读取切面，不因driver支持写而给Query写权限（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `identity_responsibility` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | external_id不自动建GlobalMember/human actor；正式责任还与Governance交集；配置不能补失去主体的basis（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `binding_authorization` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 无skip_gate/audit_only/低敏approve/默认target；同一个合格Governance绑定按现有port分面消费，不造新权威（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `conversation_handoff` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不拥有Conversation/Turn、不把平台ACK当提交；source只有正式producer/schema current才能E02；null未消费不授默认源（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `attachment_refs` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不存附件bytes/公开token URL、不新造Artifact；必要/可省略由owner当前grant，不让配置drop_required_attachment（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `private_material` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不得durable/cache/temp/dead-letter，不把drop说成zeroize；各实际payload来源覆盖与max_private_bytes一致；provider不产可外显权限（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `workspace_projection` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不当频道/权限/导出truth，不以optional绕选用required；null只表示明确未消费；其他source不借Workspace资格（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `observation_handoff` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不通过开关跳mandatory、不造canonical/report/evidence；缺正式规则不默认audit-only；原十二affected不因配置存在关闭（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `credential_use` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不收raw secret/env token/URL、不latest/fallback/换身份；binding指provider/key/revision/scope/window；private resolver每次重核撤销（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `dispatch` | 启动/正式策略引用 | hot/reload/body-debug/本地授权 | 不缩任何rate下界、不隐藏SDK retry/盲重发；只供new/current qualification；原effect冻结预算/窗口不被config覆盖（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `replay_continuity` | 启动/正式策略引用 | hot/reload/body-debug/本地授权 | 不设自由TTL清key、不跨epoch、不用timer消unknown；retention/current维护由ConfigQualificationPort取得；不足manual/blocked（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `entry_transport` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | 不自建listener默认路由、不以ACK推业务结果；平台transport由其模块具名；本域只管理/API及safe E02/E04宿主（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |
| `scheduling` | 启动/敏感引用 | hot/reload/body-debug/本地授权 | CLI不建subject/op/TrustedJobContext、不绕owner authority；五bin仅消费正式JobInvocationPlan；调度预算沿execution不重复（03§13对应consumer与02§11.2） | startup/cold；类别/禁止面/03无回写逐域核对pass_design |


### 7.3 禁止配置化项

| 禁止配置化项 | 原因 / 来源 | 如需改变应走什么流程 |
|---|---|---|
| external_id自动建GlobalMember、内部actor/Turn/Workspace | 00 BR001~005；02§11.2；03 owner refs不是truth | 回00/01及Identity/Conversation/Workspace正式owner |
| skip_gate、auto_approve、低敏审批默认允许 | 00 BR002/003/015；03 current/action守卫 | Governance/00~03重新审，不作运维开关 |
| raw/body/secret/token/callback/敏感Gate debug/cache/证据 | 00 BR005/021、NFR015；03 private和出口白名单 | 需求/安全/正式owner，不留任何环境例外 |
| 默认channel/target、OAuth/API Key身份fallback或redirect自动放行 | 00 BR004/019；03 immutable target与RoutePolicyRef | 先owner新授权/绑定，再设计变更 |
| ACK=Turn、HTTP2xx=外部成功、audit=consumer/evidence | 00 BR007/013/022；03独立结果 | 需求/阶段owner，不设统一success开关 |
| unknown_timeout_as_no_effect、blind_retry、SDK隐藏重试 | 03§7/9/12三阶段与NoIo/NoEffect | 原effect权威恢复合同；不能运维强放 |
| 清dedup/result/tombstone/key以重执行 | 03§10/12/13及具名RetentionExpiryBasisRef | 正式retention/维护授权，只合法原状态 |
| one-use/terminal复活、旧generation/旧secret跳重核 | 03§9 current和原机guard | owner与00~03重新审 |
| cursor用裸ID/time、跨epoch、partial覆盖关gap | 03 comparator/coverage/Gap guard | 来源owner/comparator正式合同 |
| 取消global/bucket/method/resource下界或无限attempt/replay | 00 NFR010/011；03§12 rate与original budget | 实际平台/current policy，配置只能更保守 |
| 拆wholeUoW、先发后记、driver unknown换库探测 | 03§10/11 commit journal/CAS/probe | 01~03事务设计重审 |
| Query自动audit/dedup/refresh/probe/repair | 00 BR023；03 Q01~04 pure read | 必须另受权Command/Job，不是query开关 |
| mandatory_observation=false / audit_only=true | 03§13/14 formal producer条件 | 正式Observability规则/准入，不由本地文件生成 |
| fixture通过即prod_ready或四平台全支持 | 00 NFR016；03§15~17事实边界 | 真实实施/运行/验收各自权威，不可配置 |

### 7.4 跨分类审查与对详细设计的影响判定

| 审查项 | 结论 |
|---|---|
| 同一行为分类 | 文件均startup；current限流/资格/撤销是外部事实核验，不是hot配置 |
| P1污染P0 | Workspace只有明确未消费能省略；mandatory观察不允许类似省略 |
| 禁配覆盖 | 14类禁止项覆盖20域，回指具名红线，无环境debug例外 |

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| startup/cold与禁配边界 | 否 | 原current/原op守卫的配置解释 | 03§13，无代码/DTO/flow改动 | 无回写 |

## 8. 回填草稿

正式§4逐字装配§7.1~7.4；不允许热更新、绕门禁、数据所有权或一致性配置化。动态current事实核验与startup设置是两件事，C01配置接纳与宿主cold激活也是两阶段；变更文件不隐式产生管理Command或原状态迁移。

## 9. 待确认事项

BR-UP001~009=open、010=reference_only；WS十二开放项及Observability十二affected保原状态；平台/SDK/OAuth/API Key/KMS/router/DB/executor实际资格未建立。不实现、运行项目测试、stage或commit。

## 10. 自检与下一Step条件

实际只读检查：十段齐，§3~8未写占位0、03影响表存在，errors=[]。人工按本Step SOP问题与具名03消费点逐项核对，本步范围/禁止面/来源/失效语义通过设计静态自检；二十域分类/停审及十四禁配类别人工逐行审查，无不一致；首次静态检查只因影响表标题未用固定词组拒绝，已精确更正后重跑。

self_review=pass_design_static；下一仅enter_step05。BR-UP/WS/affected及真实产品资格不释放；没有编译、项目测试或平台投递，不stage/commit。
