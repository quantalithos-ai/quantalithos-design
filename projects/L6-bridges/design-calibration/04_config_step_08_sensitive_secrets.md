# L6-bridges 04 Step8：敏感配置与密钥

## 1. Step状态与开工确认

2026-10-04；前序Step7已通过设计静态自检，授权仅全部04；正式04完成即停审。full-restart / single-agent-serial，无代理/并行工具。

| 模块 | 骨架 | 思考 | 写入/草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|
| S8 | done | done | done | done | pass | enter_step09 |

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

Step7字段/selector/private/实际平台公开核验；03 OpaqueSecretBindingRef/QualifiedSecretUseContext/private lease及SecretProviderRequirements，配置SOP Step8和书写§5.8。Step7初次检查失败后被误推进创建了本骨架，未写secret结论；已如实回退Step7修正nullable列并真实重审通过，才恢复当前Step8。actual 来源/产品/secret资格没有建立。

后续精确来源：Step7平台核验附录8 read_selected / 3 unavailable及00原PS07~09；敏感用途与driver credential/controller责任按03原port，不重新发明安装OAuth API。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1 敏感分类 | §7十族涵盖全部敏感selectors与五平台/技术用途；public/internal不意味着可输出。secret值永不普通配置。 |
| 2 存储/明文 | JSON只有受控ref；provider负责actual材料。本仓durable/log/cache/temp/dead-letter拒raw、header/credential URL与敏感body；owning lease仅本call短借。 |
| 3 轮换 | 显式C01新config revision+exact新secret ref，冷装配；每次IO最后revalidate旧exact版本撤销/current，不能latest换身份或重发unknown。 |
| 4 审计 | 每次raw读取若provider治理规则要求，在该provider审计；Bridges只原03已获准body-free安全变化材料，不写secret值/ref原串/内容digest。 |
| 5 避泄露 | log/trace/metrics/错误采用fixed allowlist与finite reason，禁raw Error::source/Debug/Display/配置dump；材料fail-closed，不弱化审批内容。 |
| 6~8 逐族与跨审 | 每族回指Step7字段/Step5唯一来源，Step9现有loader/private seam与Step10冷变更消费；族内先诊断再表，停审后下一族。 |

## 4. 当前文档问题诊断

单installation原OpaqueSecretBindingRef不能被误当“所有平台用途共用一token”。相同binding只能由provider证明purpose-qualified exact版本子材料映射，resolver每次只输出该用途的PrivateSecret lease；provider不支持就拒该功能，不新增公开credential bundle DTO。Discord interaction token与response URL属于当前callback lease，不是可持久secret ref。DSN/route和wrong-key错误也会泄漏，不能只mask token字符。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| sensitive标签存在但用途/轮换未闭合 | 十族明确明文禁止、用途版本、provider和原unknown保持 |
| “加密/KMS即可安全”风险 | KMS只是seam；private复制/生命周期/revoke/route/scope和日志仍必须证明 |
| 配置审计可能dump差异 | 不存raw before/after，仅03授权safe材料/version/finite分类 |

## 6. 设计取舍与复杂度

采用五个03 exact SecretUsePurpose：VerifyIngress、VerifyCallback、ConnectSource、Deliver、AuthoritativeProbe。provider管理的同binding复合用途必须逐purpose证明真实子材料/精确版本/scope，不读取整包或混用；不具能力保持blocked，不改InstallationConfigDraft/OpaqueSecretBindingRef形状。

未采用raw-env secret、SDK惯用token默认读取、latest、OAuth/API Key fallback、长期callback token、临时文件、bodyhash证据、Debug/error-source继承或“drop=zeroize”。OAuth安装/state/CSRF/code exchange由获准provider/平台bootstrap处理，本项目不新增OAuth公网接纳API。逐十族写入/停审，原owner/current/test-only界限不动。

## 7. 结构化中间产物

### 7.1 敏感族与逐族停审

| 配置项 / 用途族 | 敏感级别 | 存储方式 | 是否可明文 | 轮换方式 | 审计要求 / 停审 |
|---|---|---|---|---|---|
| installations.entries[].secret_binding_ref；credential_use.bindings[] / 平台安装凭据引用 | sensitive ref / secret value | 受控JSON仅exact selector；值由provider private lease | file仅ref；raw仅合法本call private，永不普通明文持久化 | cold新ref/version，撤销每IO立即核，不latest | 原C01/qualified安全变化ref；不含provider key/credential原值；回指Step5/7及§7.2~3（交Step9/10）；族内明文/用途/轮换/审计/所有出口核对pass_design |
| slack.adapters[] credential/capability/route引用 / Slack用途材料 | secret（值） | HTTP signing secret、API bot/user token、Socket app-level用途分别qualify；只能当前call | file仅ref；raw仅合法本call private，永不普通明文持久化 | provider按purpose pinned映射新revision，旧未知不重发 | VerifyIngress/VerifyCallback/ConnectSource/Deliver/AuthoritativeProbe逐用途，不以OAuth替内部权限；回指Step5/7及§7.2~3（交Step9/10）；族内明文/用途/轮换/审计/所有出口核对pass_design |
| mattermost.adapters[] / credential_use / Mattermost用途材料 | secret（值） | PAT/API Key/部署trusted callback私有材料；具体载体未选，不打印context | file仅ref；raw仅合法本call private，永不普通明文持久化 | server revoke/deactivate每call核；不得default admin/fallback | PAT权限/主体并非内部Actor；仅finite来源/失败分类；回指Step5/7及§7.2~3（交Step9/10）；族内明文/用途/轮换/审计/所有出口核对pass_design |
| telegram.adapters[] / credential_use / Telegram用途材料 | secret（值） | bot token、webhook secret分别purpose；token化下载URL仅private，不进mapping | file仅ref；raw仅合法本call private，永不普通明文持久化 | provider pinned版本；Webhook/Polling同updates group冷切换 | 官网资格不足blocked；不会生成真实bot/chat/token；回指Step5/7及§7.2~3（交Step9/10）；族内明文/用途/轮换/审计/所有出口核对pass_design |
| discord.adapters[] / credential_use / Discord用途材料 | secret（值）；public key亦配置internal | bot/OAuth凭据private；public key由installation capability绑定；interaction token来自本次PrivateCallbackContext lease | file仅ref；raw仅合法本call private，永不普通明文持久化 | Bot/provider cold版本；interaction token不当长期resolver secret或持久ticket | HTTP验签来源与内部action授权分开；初始ACK/token期限按actual协议；回指Step5/7及§7.2~3（交Step9/10）；族内明文/用途/轮换/审计/所有出口核对pass_design |
| local_consistency/entry_transport/platform transport、installation.route_policy_ref / DSN/网络route/TLS/proxy | sensitive descriptor / secret认证材料 | 普通JSON无DSN/URL/private key/Proxy-Authorization；trusted注册只safe pointer，connector private seam | file仅ref；raw仅合法本call private，永不普通明文持久化 | 新qualified route/driver配置先兼容和原op probe；mTLS/key由provider独立用途管理 | endpoint/DSN/query/header/cert私钥不能日志或证据；回指Step5/7及§7.2~3（交Step9/10）；族内明文/用途/轮换/审计/所有出口核对pass_design |
| credential_use.bindings[].adapter_binding_ref / KMS/resolver产品 | sensitive ref / secret plaintext | KMS decrypt只private短借或provider受控句柄；key material不进本地配置 | file仅ref；raw仅合法本call private，永不普通明文持久化 | provider证明policy/scope/revoke/rotation、copy/destroy与所有five用途 | 产品未选，decrypt成功不授内部权、安装/送达或readiness；回指Step5/7及§7.2~3（交Step9/10）；族内明文/用途/轮换/审计/所有出口核对pass_design |
| identity_responsibility/binding_authorization/conversation_handoff/attachment_refs/private_material/workspace_projection / Owner/Policy/action/private refs | sensitive selectors / forbidden body | 普通file仅selector；实际safe材料由03资格/private接口取得，敏感Gate正文永不外发 | file仅ref；raw仅合法本call private，永不普通明文持久化 | 配置cold；材料current/expiry即时，不使用LKG授权 | 隐藏存在性/count/ref仍被current裁剪，无permission debug；回指Step5/7及§7.2~3（交Step9/10）；族内明文/用途/轮换/审计/所有出口核对pass_design |
| platform registration_ref；observation_handoff/dispatch/replay_continuity/source_binding_ref / source/stream/consumer/recovery | sensitive selectors | 正式source/version/scope safe注册；不保存raw event/headers/callback或可还原body digest | file仅ref；raw仅合法本call private，永不普通明文持久化 | 同source/mode/epoch冷切换，原key/gap/unknown保留；不日志cursor token | protected audit只允许03获准safe ref/version/stage/reason，不抄源原值；回指Step5/7及§7.2~3（交Step9/10）；族内明文/用途/轮换/审计/所有出口核对pass_design |
| entry-local三参数、host_admission basis/profile / invocation/path/配置快照 | internal或sensitive selector | path/selector只本进程loader/trusted invocation；不stdout dump、shell生成token或普通report归档 | file仅ref；raw仅合法本call private，永不普通明文持久化 | 受权snapshot cold；failed候选不能覆盖当前宿主或历史 | 只finite error/static field类别；不输出path/值/hash/secret存在性；回指Step5/7及§7.2~3（交Step9/10）；族内明文/用途/轮换/审计/所有出口核对pass_design |


### 7.2 精确private读取与凭据用途

`OpaqueSecretBindingRef`原五字段provider/key/revision/scope/validity全部由正式source给出；`QualifiedSecretUseContext`原七字段installation/binding/purpose/scope/route/basis/validity与current安装/授权窗口交集。`SecretProviderRequirements::resolve(current, max_bytes, control)`仅返回原BridgeSecretLease；`revalidate(current, revision, control)`在最后IO前核同版本/revoke/window，不自动续期。owner/local无凭据probe不得塞platform secret；正式platform readonly method要求secret却缺失就NotEstablished。

| 03用途 | 实际材料/消费面 | 不得解释为 |
|---|---|---|
| VerifyIngress | HTTP签名/HMAC/webhook secret等当前source验证；Gateway来源按actual认证合同 | 消息可信即binding/Actor/Gate获准 |
| VerifyCallback | actual source/action对应的签名或trusted integration验证材料 | 低敏审批/平台管理员自动授权 |
| ConnectSource | 合格Socket/Gateway/Polling连接身份和token，source/mode/epoch当前注册 | 可以双消费、恢复时跳epoch或用新账号代原source |
| Deliver | 已获准original effect的API凭据；route/target/claim/current全部齐 | SDK可自行retry/redirect换target或HTTP2xx即delivered |
| AuthoritativeProbe | 正式readonly原effect/result方法资格的凭据 | probe产生新send/action；NotFound证明无效果 |

provider若以一个OpaqueSecretBindingRef表示多用途的受控凭据集合，必须在exact key+revision下由provider自身维持每purpose→实际secret版本的不可变授权映射，scope/window分开核验；private resolver只借出本次所需材料，不返回整集合、不在Bridges新增bundle字段。若具体产品只能一key一用途，或无法证明套件版本/current授权，则受影响组合NotEstablished，可分别设计新的合法installation配置，不能偷偷换身份/target或给原op套新secret。

Discord临时interaction token/response URL仅本次PrivateCallbackContext owning lease与原ProtocolAckExecution消费，不扩展五用途enum、不保存成长期catalog或callback record材料。公开verification key不是raw secret，仍须与actual installation/capability/version匹配，不由请求自报key替代。平台initial/deferred ACK与owner action/local commit独立，超协议窗口不得补造成功。

secret/provider错误不可带key ID、路径、endpoint、raw response或Error::source；private lease实际复制/析构/zeroization是否成立必须产品资格证明。除非有明确可验证实现合同，drop只能结束借用，不能声称secret已物理擦除。HSM/KMS opaque句柄也须purpose/current/scope/route和private error证明，不默认继承授权。

### 7.3 轮换 / 撤销 / 原operation

1. 配置提案在受控来源选择新exact selector/ref；新basis/profile/secret/capability/route需全套current核验，经明确C01 expected CAS接纳新config revision；文件加载不自动写C01。
2. source或credential变更按cold停止旧宿主/排他source group，再新actual装配。provider即时revoke/current失效必须立刻阻后续IO，不等冷变更或J05准时。
3. 原op/effect/target/attempt/binding generation及其exact secret/current basis不被新配置改写。已有known先保持原result；unknown只同identity权威probe/manual，不能因为旧secret失效换新token/账号重发或重批。
4. 允许旧版本保留的前提是provider/owner原current资格仍实际成立且仅为获准原subject恢复；这不是LKG授权、secret缓存或保留过期窗口。old registry selector只安全指针，不保raw值。
5. 若旧secret已撤销且readonly原op查询也不获准，保indeterminate/manual/blocked及key/tombstone，不放宽expiry或原attempt预算，运维只经正式owner恢复。

### 7.4 禁止输出与跨族审计

| 出口 | 允许 | 禁止 |
|---|---|---|
| process-local错误 | exit分类/固定module/固定field类/finite safe reason，无actual index或隐藏细节 | 原path、selector/value、raw bytes、endpoint/URL、provider key、stack cause、credential存在性 |
| log/trace/metrics | 03 fixed allowlist的phase/platform-kind/branch/finite reason、预算类别和受控耗时；不记identity | raw external ID/body/header/token/callback/敏感审批、raw error、配置dump/差异、可还原bodyhash/高基数标签 |
| protected durable audit / handoff | 原03正式current准入与visibility批准的safe subject/basis/result ref、revision/stage/有限reason；不是file selector原串 | raw配置secret/DSN/route/provider descriptor、private材料/敏感正文；不得递归O01或造evidence |
| Query / report / evidence | 仅正式owner裁剪和Observability消费合同允许的材料，实际consumer disposition独立 | hidden count/ref/existence、secret原值/版本locator、私有URL、未经准入payload、伪run/verdict/signoff/readiness |
| SDK/provider内部出口 | 必须能证明清洗/关raw Debug/隐藏重试且所有副本在合法private边界 | library默认日志/Exception source、后台detached raw、cache/temp/dead-letter；不合格即不绑定 |

| 跨族审计项 | 结论 |
|---|---|
| raw进入文档 | 示例只fixture selector，未生成或提供secret/account/body，literal token值0 |
| 等级 | Step7所有ref均sensitive；数值internal，public不开放自动dump |
| 轮换 | exact版本、purpose、current撤销、cold变更与original保留一致 |
| 审计 | provider读取审计与Bridges protected安全变化材料各自owner；没有report/evidence事实 |
| 平台差异 | Slack用途分离、Mattermost可信server、Telegram官网不足、Discord短期callback lease分别闭合 |
| 尚未建立资格 | 所有具体secret/provider/SDK/private复制销毁资格仍open，不能用审查pass当运行证明 |

### 7.5 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 五用途/purpose-qualified provider、private lease与cold轮换 | 否 | 原SecretProviderRequirements与Context消费的配置资格细化 | 03§5/6/13/14，无新bundle DTO/API | 无回写 |
| Discord临时token只原callback lease | 否 | 保持原protocol/private生命期 | 原03 E03/ACK合同不改 | 无回写 |

## 8. 回填草稿

正式§8逐字装配§7.1~7.5；十敏感族、五exact用途、凭据套件provider资格/原callback短期lease、cold轮换/即时revoke与所有出口边界完整保留。示例只fixture ref，产品/实际secret未建立，不把KMS decrypt、OAuth/PAT或source签名当内部授权。

## 9. 待确认事项

BR-UP001~009=open、010=reference_only；WS十二开放项及Observability十二affected保原状态；平台/SDK/OAuth/API Key/KMS/router/DB/executor实际资格未建立。不实现、运行项目测试、stage或commit。

## 10. 自检与下一Step条件

实际只读检查：十段齐，§3~8未写占位0、03影响表存在，errors=[]。人工按本Step SOP问题与具名03消费点逐项核对，本步范围/禁止面/来源/失效语义通过设计静态自检；十族逐族审查和五exact用途逐项回指原03，未新增secret字段/端点/DTO，无raw secret/敏感正文示例。

self_review=pass_design_static；下一仅enter_step09。BR-UP/WS/affected及真实产品资格不释放；没有编译、项目测试或平台投递，不stage/commit。
