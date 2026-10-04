# L6-bridges 04 Step5：来源、优先级与冲突

## 1. Step状态与开工确认

2026-10-04；前序Step4已通过设计静态自检，授权仅全部04；正式04完成即停审。full-restart / single-agent-serial，无代理/并行工具。

| 模块 | 骨架 | 思考 | 写入/草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|
| S5 | done | done | done | done | pass | enter_step06 |

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

Step3来源链/Step4分类；03 configuration/load/validate/qualification、secret及entry消费；配置SOP Step5和书写§5.5。精确读取/使用范围随§7记录，不把旧05/06或Chat作正式输入。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1 优先级 | 本轮无P0 code default；单JSON唯一全局来源；CLI/ENV仅entry-local、按缺省<ENV<CLI识别，但双来源不同值显式拒绝。trusted注册/secret不是覆盖层，是必须匹配的独立来源。 |
| 2 同名冲突 | duplicate JSON key即拒绝（即使相同）；不做merge/last-wins。CLI/ENV同值可接受，异值拒绝；不支持多file/多profile合并。 |
| 3 缺失 | 必填项、已选branch任何required或refs缺失阻启动/操作；null只允许明确未消费的条件项。 |
| 4 中心/provider不可用 | 未选remote/config-center不回退；secret current无法解析则阻受影响IO，原known/unknown保持。 |
| 5 禁止覆盖 | secret值不能file/env/CLI提供；source资格、owner授权、immutable结果不能普通配置覆盖。 |
| 6~8 逐域/跨审 | §7.4二十域各自来源/禁覆盖/不可用停审；同一ref只能由具名trusted类型解析，无环境权威漂移。 |

## 4. 当前文档问题诊断

把ENV优先级写成“可覆盖所有JSON”会让运营意外替换branch、provider或secret版本。把引用字串自解成URL/token绕过真实registry和qualification。loader不能隐式读SDK惯用环境token、HOME配置、CWD或latest目录；每binary应同一受控来源合同。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| 来源链无exact entry key | 三个entry参数注册：路径、仅校验、job invocation选择 |
| 覆盖语义可自由merge | JSON单一snapshot、同名/异值冲突必拒绝 |
| secret/config优先级可能混在一起 | secret exact resolver不是file/env覆盖层 |

## 6. 设计取舍与复杂度

采用显式单file与白名单参数，无安全P0默认；参数冲突拒绝提高可审查性。CLI/ENV只选择已具名入口材料，不构造受信context/subject/op。未采用CLI覆盖JSON叶项、所有prefix自动映射、secret环境变量、remote/admin优先级及默认路径。逐域只规定来源语义，不提前输出数值清单。

## 7. 结构化中间产物

### 7.1 来源与优先级

| 来源 | 优先级 | 适用配置 | 冲突处理 | 不可用时策略 |
|---|---|---|---|---|
| 代码默认 | 最低；本轮P0业务项无默认 | --validate-config缺省false；解析hard caps为static不变量 | 默认不补JSON必填或ref | P0缺失fail-fast |
| 单受控JSON file | 唯一全局来源 | 二十功能域的全部全局leaf | duplicate key/未知key/多file/profile合并拒绝 | 无file/非法snapshot阻启动 |
| entry-local ENV | 参数来源1 | exact三个ENV key | 与CLI不同值拒绝，无通用叶项覆盖 | 参数必填缺失拒绝 |
| entry-local CLI | 参数来源2 | exact三个flag | 与ENV同值复用；不同值拒绝，不静默override | 无参数不猜 |
| trusted bootstrap注册 | 非覆盖；必须完整匹配 | 03 actual adapter/typed refs/source/revision/scope/profile/current能力 | key不唯一/wrong-kind/scope/version/actual产品不符拒绝 | NotSelected/NotEstablished阻已选支路 |
| secret provider | 最后private解析，不属于数值覆盖优先级 | OpaqueSecretBindingRef exact provider/key/revision/purpose | 禁latest/raw/file/env替代 | 解析/撤销失败fail-closed，unknown不消失 |
| remote/config center/admin override | 未选，不适用 | 无 | 任何隐式读取/覆盖拒绝 | 无fallback |

### 7.2 Entry-local exact参数

`bridges-api`、`bridges-worker`及五Jobs binary分别为`dispatch_queued_delivery`、`reconcile_bridge_operation`、`reconcile_stream_gap`、`retry_safe_handoff`、`refresh_bridge_qualification`；名字沿03原planned入口，没有创建binary。

| CLI flag | ENV key | 类型 / 默认 / 缺失 | 适用binary | 局部/全局边界 |
|---|---|---|---|---|
| --config | BRIDGES_CONFIG_PATH | 绝对本地path；无默认；缺失拒绝；单次出现 | 全七bin | 只选单JSON snapshot，不能URL/目录/多file/HOME/CWD猜路径；不落日志 |
| --validate-config | BRIDGES_VALIDATE_CONFIG | bool；CLI无值表示true，ENV仅true/false；缺省false | 全七bin | 只完整解析/shape/cross-field/已有typed注册和required检查；不创建listener/session、解析raw secret或执行Command/Job；合格也不激活 |
| --invocation-ref | BRIDGES_JOB_INVOCATION_REF | exact-version受控selector；无默认；Jobs真实执行必填，仅校验模式不消费 | 仅五Jobs bin；api/worker出现即拒绝 | 由03 trusted operations host查找同kind的原JobInvocationPlan；不能从文本生成actor/context/subject/op/effect/key |

全局JSON值不得被上述flag/ENV覆盖；没有--token/--secret/--channel/--scope/--retry/--max-batch参数。重复flag拒绝；CLI/ENV路径按同一规范化绝对目标比较，相同才接受，symlink解析后仍需部署授权/同snapshot。拒绝输出原path或值。未知BRIDGES_参数名拒绝；其他系统ENV不读取，不扫描/打印秘密，SDK惯用token自动读取必须禁用。

入口退出合同仅process-local：成功完成完整静态校验且未激活为exit0/finite“config_valid_not_activated”；无效JSON/参数/值为exit2“config_invalid”；已选ref/provider/required未建立为exit3“bindings_not_established”。实际执行返回仍按03原entry结果，不制造业务success。示例fixture本轮没有typed注册，所以不具exit0或启动事实。

### 7.3 冲突处理

| 冲突场景 | 处理规则 | 阻断启动/操作 |
|---|---|---|
| duplicate JSON key，即使同值 | lexical解析时拒绝；普通last-wins JSON parser不足 | 是 |
| JSON unknown/null/错型与profile不符 | 拒绝，不默认转换/stringify/截断 | 是 |
| CLI与ENV同参数不同值/重复flag | 拒绝；不静默选高优先级 | 是 |
| 全局JSON与ENV同名企图覆盖 | 白名单无该ENV映射，拒绝BRIDGES_未知名 | 是 |
| selector匹配多个记录/wrong-kind/错namespace/revision | 绑定解析失败，不能取首个/跨安装复用资格 | 是，受影响选用集合整体不发布 |
| file宣称Established/secret/token/自由URL | 未注册schema拒绝，不进入trusted处理 | 是 |
| SDK自取ENV凭据、hidden retry/redirect | adapter资格不合格 | 是，受影响IO |
| 缺provider/超时/撤销 | 不fallback，保原record/result并有限拒绝 | 是；original unknown保持 |

### 7.4 逐域来源覆盖与停审

| 配置域 | 允许来源 | 禁止来源/覆盖 | 优先级 / 不可用策略 | 停审 |
|---|---|---|---|---|
| `host_admission` | JSON受权选择；ENV/CLI仅独立entry参数 | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不能从bin名启用、不能授平台或内部权限 | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `execution` | JSON显式预算 + 实际qualified profile/clock/executor | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不覆盖业务attempt预算、平台ACK期限或rate下界 | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `installations` | JSON七字段选择 + C01已接纳配置/revision + current qualification | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不建账号、不自动C01、不授binding/generation | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `slack` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不从公开文档推安装scope、ACK不当owner结果 | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `mattermost` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不借Slack验签；PAT/管理员不当内部actor | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `telegram` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不双消费、不保证删除通知/历史完整、不存含token URL | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `discord` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不把Snowflake当总序、不把token或ACK当授权/送达 | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `local_consistency` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不改wholeCAS/原子性、不换driver探原unknown、不生产inmemory | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `identity_responsibility` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；external_id不自动建GlobalMember/human actor | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `binding_authorization` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；无skip_gate/audit_only/低敏approve/默认target | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `conversation_handoff` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不拥有Conversation/Turn、不把平台ACK当提交 | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `attachment_refs` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不存附件bytes/公开token URL、不新造Artifact | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `private_material` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不得durable/cache/temp/dead-letter，不把drop说成zeroize | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `workspace_projection` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不当频道/权限/导出truth，不以optional绕选用required | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `observation_handoff` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不通过开关跳mandatory、不造canonical/report/evidence | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `credential_use` | JSON provider selector + actual provider注册 + private exact resolver | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不收raw secret/env token/URL、不latest/fallback/换身份 | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `dispatch` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不缩任何rate下界、不隐藏SDK retry/盲重发 | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `replay_continuity` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不设自由TTL清key、不跨epoch、不用timer消unknown | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `entry_transport` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；不自建listener默认路由、不以ACK推业务结果 | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |
| `scheduling` | JSON具名本域selector + 对应03 trusted bootstrap/current owner | 原值不被ENV/CLI/remote/admin/raw secret覆盖；CLI不建subject/op/TrustedJobContext、不绕owner authority | file唯一选择，与trusted来源交集；缺必填/已选资格fail-fast或IO fail-closed，不换身份/target | 本域来源/优先级/冲突/缺失逐项pass_design |


### 7.5 跨来源审计与对详细设计的影响判定

| 审计项 | 结论 |
|---|---|
| 选择不授权 | JSON/CLI仅选择材料，实际source、current与secret值不能由它们伪造 |
| 不做隐式覆盖 | 单snapshot、无duplicate、无通用ENV、无remote/admin |
| 环境一致 | 五环境同来源规则，prod不会回退fixture或other namespace |
| 敏感边界 | secret值仅resolver；ref/path/invocation不打印；private使用不会成为审计材料 |

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| exact process-local CLI/ENV/exit与单file语义 | 否 | 04负责的入口配置映射，不增公共DTO/function | 03§13 structured loader/entry边界不改 | 无回写 |
| invocation仅选择原trusted plan | 否 | 原entry消费限制细化 | 03§6 Jobs原合同，不造新subject/op | 无回写 |

## 8. 回填草稿

正式§5逐字装配§7.1~7.5，包括exact七binary/三flag/ENV与退出分类、二十域来源停审及冲突规则。code defaults不补P0、CLI/ENV不改全局、secret解析不当配置覆盖。接口/Job/owner实际结果继续03，不通过CLI自建受信材料。

## 9. 待确认事项

BR-UP001~009=open、010=reference_only；WS十二开放项及Observability十二affected保原状态；平台/SDK/OAuth/API Key/KMS/router/DB/executor实际资格未建立。不实现、运行项目测试、stage或commit。

## 10. 自检与下一Step条件

实际只读检查：十段齐，§3~8未写占位0、03影响表存在，errors=[]。人工按本Step SOP问题与具名03消费点逐项核对，本步范围/禁止面/来源/失效语义通过设计静态自检；二十域来源停审、三参数/ENV与七bin原名已逐项反查，无raw/通用ENV覆盖。

self_review=pass_design_static；下一仅enter_step06。BR-UP/WS/affected及真实产品资格不释放；没有编译、项目测试或平台投递，不stage/commit。
