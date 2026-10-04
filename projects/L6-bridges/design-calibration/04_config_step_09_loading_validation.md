# L6-bridges 04 Step9：加载、校验与生效

## 1. Step状态与开工确认

2026-10-04；前序Step8已通过设计静态自检，授权仅全部04；正式04完成即停审。full-restart / single-agent-serial，无代理/并行工具。

| 模块 | 骨架 | 思考 | 写入/草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|
| S9 | done | done | done | done | pass | enter_step10 |

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

Step7完整raw/typed/source/budget/schema、Step8private/secret与03 actual builder/RuntimeRequiredSeams/ConfigQualification；配置SOP Step9和书写§5.9。精确读取/使用范围随§7记录，不把旧05/06或Chat作正式输入。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1 时机 | 每process startup/cold新宿主一次受控snapshot；运行不watch/reload/env覆盖；每业务IO仍current核验。 |
| 2 parse/type | UTF-8/size/depth/array hard cap、duplicate-aware structured JSON parser，逐字段exact schema/enum/integer/selector与null guard；不stringify/last-wins。 |
| 3 cross-field | §7.3具名检查覆盖basis/profile/environment、namespace/draft/accepted revision、driver/source/mode/family、owner/current/secret/route、同driver/原op/mandatory/clock/预算/entry。 |
| 4 生效 | 二十域startup；pin/build能力由已构建产物决定；红线static。只有正常actual admission才能Active，不把evaluate纯结果当外部已安装。 |
| 5 失败 | parse/shape/冲突exit2；actual required/资格未建立exit3；整体不发布，不能用部分新settings补旧宿主。已有原result/unknown不变。 |
| 6~8 逐域与跨审 | §7.2逐域五维校验/装配/失败和停审；03所有field/control闭包覆盖，CFG-03-001已回写，无新增runtime API/错误DTO。 |

## 4. 当前文档问题诊断

“JSON.parse成功”不足：duplicate key常被吞、nullable必填误补、错误namespace/secret/provider/mode可合法typed却错误scope。先publish再查询缺失会暴露半装配；配置校验也不能暗中C01或resolve raw secret。停止deadline是actual运行事件，不可文件绝对值或启动TTL。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| 字段清单已有，loader消费顺序未闭口 | 十四阶段、二十域校验与二十二cross-field guard闭合 |
| profile/ref可能只shape检查 | source/kind/scope/actual注册/selected required完整交集 |
| startup成功可能被当权限或投递 | 静态校验、actual admission、每次owner/platform IO分开 |

## 6. 设计取舍与复杂度

采用fail-fast raw校验、complete-or-error actual装配；选用集合任一缺失即该process候选整体不发布，其他合格功能需要另受权隔离profile冷装配，不偷偷降为optional。未选模块显式null/空数组不造adapter。

未采用runtime任意刷新、LKG authority、配置watcher、bootstrap C01自动写、secret预解析或“用一次HTTP请求检验然后当长期Qualified”。只校验模式限制本地snapshot/现有typed注册与trusted technical clock读取，不触发owner/platform/business/probe IO或raw secret读取。产品不具能力就blocked，不在本Step发明实现。

## 7. 结构化中间产物

### 7.1 配置加载流程图: Bridges complete-or-error装配

```text
[entry allowlist + one authorized file snapshot]
  -> [bounded UTF-8 / duplicate-aware JSON parse]
  -> [exact keys / types / ranges / finite values]
  -> [basis/profile/namespace/source cross-field]
  -> [trusted typed lookup + actual required union]
  -> [safe settings + RuntimeCompositionPlan::evaluate]
  -> [actual adapters/hosts checked, all selected complete]
  -> [normal mode admission -> Active -> each IO current]
       |
       +--> [validate-only: finite disposition, no activation]

[any invalid/missing qualification] -> [no partial publish]
```

关键说明：

- loader使用结构化parser且保duplicate诊断，不接受raw map/secret/HTTP body作trusted settings。
- @selector只能查实际受信typed注册，missing/wrong-kind不构造authority。
- shape/evaluate/normal admission各阶段分开；Active也不授业务权限或外部送达。
- 全过程不自动写C01/绑定/mapping/cursor/audit/job，Query保持只读。

| 阶段 | 加载/校验/装配消费 | 失败策略 / 生效 |
|---|---|---|
| L01 entry参数 | exact七bin/三flag/ENV；路径/模式/invocation冲突规则 | exit2；不猜HOME/CWD |
| L02 snapshot | 单受控普通file授权目标，open/read一次有界bytes；修改不会替换本次snapshot；source/revision必须批准该语义内容 | exit2/3；禁止配置dump |
| L03 lexical parse | UTF-8/BOM/额外值/注释、size/depth/array累积、duplicate-aware object | exit2；parser原message/byte片段不外显 |
| L04 exact schema | 二十域/82项，unknown/missing/null父子guard | exit2；不default/merge |
| L05 value shape | enum、integer硬范围、selector @记录版本、checked conversions | exit2；不扩大预算/转字符串 |
| L06 basis/profile | ConfigurationBasisRef与actual approved环境/build/scope/五资源tuple同内容；不能self文件给proof | exit3；无authority默认 |
| L07 installation | 完整namespace四tuple；七draft字段typed factory；已C01接纳内容/revision一致 | exit2/3；不C01自动写/创建安装 |
| L08 platform/source | 逐四driver/transport、两family/mode、capability/route/credential current、排他group | exit3；不启动listener/session或换平台 |
| L09 owner/provider | 六owner实际消费/compat与material/secret/clock/executor/transport/job绑定，current finite窗口 | exit3；不raw resolve/not_selected猜资格 |
| L10 local consistency | 同driver/schema/scope八repo/UoW/probe/ID/fence/read切面，19collection契约 | exit3；旧unknown不改存储或新begin |
| L11 required闭包 | 03 Step6底线+Step7补全+十九callable/technical host依赖，逐selected scope；formal mandatory规则current | exit3；Query不套MutatingLocal，不能配置省略 |
| L12 safe装配 | 原RuntimeExecutionBudget/SafeRuntimeSettings/RuntimeRequiredSeams/RuntimeCompositionPlan具名factory/evaluate；actual source同origin | 任何失败不返回部分组合 |
| L13 actual publish | 正常模式actual QualifiedInfraPorts和technical host需与registry/plan全部同源，State::from_parts/::begin只原guard | all-or-error；只校验模式不begin/激活 |
| L14 runtime current | 每local mutation/owner或platform IO前重核原subject、Config/Policy/Gate/binding/generation/material/secret/limit/window/原budget | finite fail-closed，known保结果/unknown保原，取消不证NoEffect |

### 7.2 逐域加载 / 校验 / 生效停审

| 配置域 | parse / type validate | cross-field validate | assemble target / expose | 时机与失败 / 停审 |
|---|---|---|---|---|
| `host_admission` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | Schema/environment用于loader；branch集合与required一致；同source/version/scope/current与selected required，CF01~22相关项 | SafeRuntimeSettings.branches/configuration_basis；RuntimeCompositionPlan；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `execution` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | 资源上限与execution profile一致；SafeInstant运行同域派生；同source/version/scope/current与selected required，CF01~22相关项 | RuntimeExecutionBudget；runtime/execution.rs与scoped executor/TrustedClock；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `installations` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | 已接纳revision与启动拟载入内容需一致；首次配置仅管理操作接纳；同source/version/scope/current与selected required，CF01~22相关项 | InstallationConfigDraft七字段；C01/InstallationRepository；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `slack` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | family/mode/具体endpoint同时核，不把Events body当交互payload；同source/version/scope/current与selected required，CF01~22相关项 | BoundSlackPlatformAdapter / PlatformSourceHost / PlatformDriverRequirements；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `mattermost` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | callback必须trusted integration/plugin合同；incoming webhook不作事件输入；同source/version/scope/current与selected required，CF01~22相关项 | BoundMattermostPlatformAdapter / PlatformSourceHost；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `telegram` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | 消息/回调family整体切换，offset不等owner进度；同source/version/scope/current与selected required，CF01~22相关项 | BoundTelegramPlatformAdapter / PlatformSourceHost；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `discord` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | Inbound仅Gateway；Callback family独立互斥；resume不足保gap；同source/version/scope/current与selected required，CF01~22相关项 | BoundDiscordPlatformAdapter / PlatformSourceHost；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `local_consistency` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | SafeRead只用读取切面，不因driver支持写而给Query写权限；同source/version/scope/current与selected required，CF01~22相关项 | LocalStorageBinding；八repo/UoW/LocalCommitProbeAdapter；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `identity_responsibility` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | 正式责任还与Governance交集；配置不能补失去主体的basis；同source/version/scope/current与selected required，CF01~22相关项 | IdentityOwnerRequirements / ActorResponsibilityPort；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `binding_authorization` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | 同一个合格Governance绑定按现有port分面消费，不造新权威；同source/version/scope/current与selected required，CF01~22相关项 | GovernanceOwnerRequirements；Binding/Presentation/Read/Action ports；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `conversation_handoff` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | source只有正式producer/schema current才能E02；null未消费不授默认源；同source/version/scope/current与selected required，CF01~22相关项 | ConversationOwnerRequirements；ConversationHandoffPort与E02来源；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `attachment_refs` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | 必要/可省略由owner当前grant，不让配置drop_required_attachment；同source/version/scope/current与selected required，CF01~22相关项 | ArtifactOwnerRequirements；authorized attachment grant；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `private_material` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | 各实际payload来源覆盖与max_private_bytes一致；provider不产可外显权限；同source/version/scope/current与selected required，CF01~22相关项 | PrivateMaterialProviderRequirements / BoundPrivateMaterialAdapter；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `workspace_projection` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | null只表示明确未消费；其他source不借Workspace资格；同source/version/scope/current与selected required，CF01~22相关项 | WorkspaceOwnerRequirements；选用safe read/export/provenance；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `observation_handoff` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | 缺正式规则不默认audit-only；原十二affected不因配置存在关闭；同source/version/scope/current与selected required，CF01~22相关项 | ObservabilityOwnerRequirements；SafeObservationPort与E04来源；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `credential_use` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | binding指provider/key/revision/scope/window；private resolver每次重核撤销；同source/version/scope/current与selected required，CF01~22相关项 | SecretProviderRequirements；OpaqueSecretBindingRef / QualifiedSecretUseContext；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `dispatch` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | 只供new/current qualification；原effect冻结预算/窗口不被config覆盖；同source/version/scope/current与selected required，CF01~22相关项 | QualifiedRateLimitBoundSet、RetryBudgetRef、AuthorizedAttemptWindowRef；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `replay_continuity` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | retention/current维护由ConfigQualificationPort取得；不足manual/blocked；同source/version/scope/current与selected required，CF01~22相关项 | AuthoritativeComparator/coverage；RetentionExpiryBasisRef；AuthoritativeRecoveryPort；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `entry_transport` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | 平台transport由其模块具名；本域只管理/API及safe E02/E04宿主；同source/version/scope/current与selected required，CF01~22相关项 | TransportHost / SafeEventTransportHost / PlatformSourceHost；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |
| `scheduling` | bounded结构化JSON；Step7该域所有key/typed enum/integer/selector/null guard，无默认 | 五bin仅消费正式JobInvocationPlan；调度预算沿execution不重复；同source/version/scope/current与selected required，CF01~22相关项 | WorkerEligibleJobRunner；JobInvocationDispatcher；trusted operations host；只Infra组装，Domain不读外部配置 | startup/cold；parse exit2、实际缺失exit3、runtime fail-closed；本域五维及Step7/8一致性核对pass_design |


### 7.3 Cross-field可落码guard

| ID | 精确交叉规则 | 缺失/不符 |
|---|---|---|
| CF01 | 根schema=1，exact全部域/key；CLI仅local参数，不全局merge | exit2 |
| CF02 | environment必须与basis/profile/namespace实际受权环境一致，不借test→prod | exit3 |
| CF03 | 五资源元组落hard range且被该profile实际批准；max_batch可大于并发但执行不得超max_inflight | exit2/3 |
| CF04 | 同call累计private buffer≤max_private_bytes，所有length/conversion/multiplication checked；max_inflight×bytes不是批准SLA | finite超限/overflow拒绝 |
| CF05 | installation namespace四tuple唯一；platform标签相等；每entry七字段完整，config revision与已C01内容一致 | exit2/3，不修改DB |
| CF06 | 四platform.adapters namespace集合与installations平台分组全等，无多余/重复driver | exit2 |
| CF07 | actual Bound adapter context的namespace/capability/secret/route与draft/current完整相同，product/pin/features/compile/current已核 | exit3 |
| CF08 | 非null inbound/callback source分别必须选Inbound/Callback branch；注册full六字段与family/mode一致；null不代替selected required，只表示未消费该入口 | exit2/3 |
| CF09 | source互斥键installation+actual source_id+family，同group当前只能一个mode；Telegram同updates两family/其他active来源整体核排他 | exit3；不先开新source再停旧 |
| CF10 | Discord Inbound仅Gateway；Callback HTTP/Gateway同interaction source排他；Slack/Mattermost HTTP callback独立具名认证/schema资格 | exit2/3 |
| CF11 | Source selection/handler/actual host与当前entry/profile消费面一致，无默认listener/route；config不能借bin名/请求自报scope授authority | exit3 |
| CF12 | secret provider逐ref unique、provider与OpaqueSecretBindingRef一致、exact版本/purpose/scope/window/route覆盖；无raw/ENV/latest | exit3；IO前再revalidate |
| CF13 | 六owner exact kind/source/version/current/interface需求兼容；SDK不是所有owner方法的替代 | exit3 |
| CF14 | WorkspaceRead或actual projection消费必需Workspace；未消费才null，原十二未决不可绕 | exit3 |
| CF15 | 任一OwnerMandatory先正式规则+canonical/schema/admission/producer+SafeObservationPort齐；SafeHandoff恒required；不可直接选audit-only | exit3；mutation/IO前阻 |
| CF16 | E02/E04 source binding只有formal producer/schema/current/consumer资格，source_ref与transport过滤/ACK原身份一致 | exit3；不造producer |
| CF17 | local所有repo/UoW/probe/ID/fence同driver/source/schema，original mutation unknown只能同binding readonly probe；SafeRead纯读取切面 | exit3，Query zero-write |
| CF18 | dispatch所有global/method/resource/bucket源完整，shared scope下界max；retry原maximum/used/window和NoEffect/current，不config清used | fail-closed/waiting/manual |
| CF19 | stream/stage/epoch/comparator/coverage同源且full；无来源/partial不关gap，不把Protocol当owner stage | manual/blocked保gap |
| CF20 | retention逐DedupNamespace批准scope/validity/basis，expiry独立current Maintenance/治理proof；禁止timer/TTL清key/result/tombstone/unknown | fail-closed，J05缺proof不迁移 |
| CF21 | executor能scoped poll非Send Future；technical/UoW clock同域；startup deadline seed有限且非TTL，actual stop new budget四资源全等 | exit3/finite停止保unknown；CFG-03-001已回写 |
| CF22 | Jobs invocation经trusted host得到same-kind/subject/original plan；worker selection/page/预算/current一致；无文本生成context/op或phantom scheduler | exit2/3，不执行新effect |

原03 step6/7完整需求表是本文CF17/required的依据，不因本章摘要缺某port而删下限。静态选择不授动态window：最短current授权/material/secret窗口与deadline相交；budget耗尽停止本地等待，platform/owner已触发可能仍unknown。配置字段方法不得直接传入Domain或业务DTO；只在Infra组装原carrier，再entry→Application原callable。

### 7.4 错误边界 / 跨域审计 / 对详细设计的影响判定

| 情况 | process-local外显 | 业务入口 |
|---|---|---|
| parse/key/type/range/conflict | exit2/config_invalid，只fixed字段类/finite理由 | 未发布，不调用业务 |
| source/profile/provider/required/current未建立 | exit3/bindings_not_established，不泄哪个hidden source/ref | 原Unavailable/NotEstablished/Denied有限变体，按03 visibility裁剪 |
| 合格validate-only | exit0/config_valid_not_activated；不监听、连接、probe、写audit或解析rawsecret | 无owner/平台业务IO，无readiness |
| 正常运行IO失败/超时 | 不继承raw SDK/error-source或HTTP message | 03原finite结果；known/Indeterminate(original)分开 |

审查二十域字段/条件必填均在L03~L12和CF01~22消费；unknown key/nullable/external secret没有旁路。未选域只有显式null/空集合，在消费闭包当前证据证明不需要时可不注册；选择后任一缺失则该候选不发布，不能静默部分启动。没有hot/reload，因此没有热值回退，cold候选失败与旧宿主的current资格必须独立处理。

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| L01~14/CF01~22完成原factory/required/current装配 | 否 | 现有接口的文件校验/生效细化 | 03§5/6/13，无新DTO/type/function | 无回写 |
| actual stop预算经begin_shutdown消费 | 是，前步已处理 | CFG-03-001继承的member/host/guard | 03§5/6/9/13与4source | 已回写 |

## 8. 回填草稿

正式§9逐字装配§7.1~7.4，包含十四加载阶段、二十域停审、二十二guard、原typed装配和finite错误。先完整验证后publish，validate-only不授ready，cold启动不自动写C01/绑定/mapping，也不读取rawsecret；运行IO重核/current与original事实分别保留。

## 9. 待确认事项

BR-UP001~009=open、010=reference_only；WS十二开放项及Observability十二affected保原状态；平台/SDK/OAuth/API Key/KMS/router/DB/executor实际资格未建立。不实现、运行项目测试、stage或commit。

## 10. 自检与下一Step条件

实际只读检查：十段齐，§3~8未写占位0、03影响表存在，errors=[]。人工按本Step SOP问题与具名03消费点逐项核对，本步范围/禁止面/来源/失效语义通过设计静态自检；L01~14、CF01~22和20域逐项回指82项/03，缺失拒绝与assemble/expose零越权，actual stop修订已继承。

self_review=pass_design_static；下一仅enter_step10。BR-UP/WS/affected及真实产品资格不释放；没有编译、项目测试或平台投递，不stage/commit。
