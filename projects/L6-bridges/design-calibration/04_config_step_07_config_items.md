# L6-bridges 04 Step7：配置项清单

## 1. Step状态与开工确认

2026-10-04；前序Step6已通过设计静态自检，授权仅全部04；正式04完成即停审。full-restart / single-agent-serial，无代理/并行工具。

| 模块 | 骨架 | 思考 | 写入/草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|
| S7 | done | done | done | done | pass | enter_step08 |

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

Step3二十域、Step4~6分类/来源/矩阵，03§5/6/13完整七installation字段、refs/source/budget/actual builder；平台公开合同按域复核；配置SOP Step7和书写§5.7。精确读取/使用范围随§7记录，不把旧05/06或Chat作正式输入。

## 3. SOP问题回答

| 问题 | 独立回答 |
|---|---|
| 1~5 名称/类型/默认/必填/来源/生效/敏感/模块 | §7逐域十列表与说明表；全局JSON无P0默认，条件项显式null/空数组只能未消费；全部startup，敏感ref不进日志。 |
| 6~9 demo/功能/命名/完整示例 | 二十功能域各严格JSON demo，项目本地不加bridges前缀；系统聚合仅摘取bridges子树、不得merge；最后严格JSON全量fixture示意无注释。 |
| 10 前序回指 | 每域回指Step3同域consumer、Step4分类、Step5来源、Step6环境，并给03typed映射，不让实现者猜。 |
| 11 逐域停审 | 每域先值与ref语义/缺失诊断/取舍，写demo+十列+说明后核字段/数值/required/来源/敏感/失败/consumer，再下一域。 |
| 12 跨审 | 字段与demo双向核查、默认/作用域/条件/finite mode/profile/current/注册齐；无未处理03影响才下一Step。 |

## 4. 当前文档问题诊断

直接把opaque ref当URL/key/token或把JSON字符串cast成SafeAuthorityRef会虚构scope/source/current。反向把所有细节留“实现者决定”又不能落码。本Step用exact-version selector选择03已计划的typed注册和值，不创造新的公共Rust类型或网络registry；每个selector明确具名返回shape、来源、消费位置与失败。预算数值只限资源，原effect retry/retention仍正式policy/source给出。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| 二十控制域尚无file schema | 每域严格结构/叶项、demo与typed consumer闭口 |
| 资源只有非零条件 | 明确static admission范围和非默认示例，不宣容量/SLA实测 |
| provider/source仅概念 | exact selector与既有注册/refs/required/source映射，missing fail-closed |
| 公开平台语义沿旧登记 | 附录实际串行再核11URL：8选段成功/3unavailable；产品/安装资格不释放 |

## 6. 设计取舍与复杂度

采用受控selector和严格JSON，实例身份/authority记录由03受信注册提供；文件只选择既有carrier。数值设置硬资源上限与批准profile交集，未采用默认无限/默认重试次数/本地TTL清理/自由URL/产品latest。source mode用03exact enum，不新增Slack callback mode或第24port。

先写raw约束/有限mapping骨架，再二十域逐一小循环；最后full demo与静态闭包检查。附录只包含真实公开资料读取记录，未写实现仓/测试或安装材料。所有手工批次≤500行；工具辅助仅构造apply_patch文本或只读审计。

## 7. 结构化中间产物

### 7.1 Raw JSON与selector合同

唯一根对象固定二十域：host_admission、execution、installations、slack、mattermost、telegram、discord、local_consistency、identity_responsibility、binding_authorization、conversation_handoff、attachment_refs、private_material、workspace_projection、observation_handoff、credential_use、dispatch、replay_continuity、entry_transport、scheduling。所有域及其已列key必须出现，即使本域未消费也显式null/空数组；不存在unknown key、通用map、隐式默认或extension_fields。

| raw类别 | 精确规则 | 失败 |
|---|---|---|
| 单JSON snapshot | UTF-8、顶层object、≤1,048,576字节、nesting≤32、全部数组累计元素≤1,024；这是loader static hard cap，不读预算再无限parse | parse拒绝，不回显内容/路径 |
| object | 每一级拒duplicate/unknown key；字段名ASCII snake_case；拒注释/尾逗号/BOM/额外顶层值 | exit2 config_invalid |
| 整数 | JSON十进制非负整数字面量，拒string/float/指数/null；checked u32/u64与本章hard range | exit2；不截断/饱和 |
| enum | 本章exact case-sensitive字面量，没有alias/自动大小写 | exit2 |
| Selector | 1~128 ASCII字节，匹配`^[a-z][a-z0-9_.-]{0,95}@[1-9][0-9]{0,9}$`；@后为selector记录版本，不等config/generation/owner revision | wrong syntax exit2；无actual记录/wrong-kind/source/scope/current exit3 |
| NullableSelector | 属性必出现；null仅静态消费闭包证明未消费，不能代替selected required | 缺消费证明或已选却null拒绝 |
| 数组 | installations.entries≤32，四platform.adapters各≤32且总namespace集合与installations相等；credential_use.bindings≤16；branches 1~10唯一 | duplicate/跨namespace/超限拒绝 |
| nullable source object | 属性必出现；null仅该family未消费；非null固定registration_ref/mode两个key | source资格缺失、错family/mode或重复拒绝 |

selector是**04文件选择语法，不是新的公共Rust ref schema、网络服务或自签authority**。Infra既有load/validate/qualification及actual builder对只读bootstrap注册查精确key，得到下列既有typed值/组合；禁止用selector文字构造SafeOpaqueId/SafeAuthorityRef/时间/Actor。注册来源、proof/window与实际产品绑定不能来自同一未经批准的自报JSON。记录必须是由03指定正式来源/adapter注册传入的完整值，所有factory/validation按03原卡。文件只持safe指针，actual/current由原port取得，Query不refresh。

| selector类别 | actual注册须返回 / 来源 | 装配去向 |
|---|---|---|
| configuration_basis_ref | exact ConfigurationBasisRef；ConfigQualificationPort/trusted configuration来源，完整source/revision/scope/window | SafeRuntimeSettings.configuration_basis / InstallationConfigDraft.basis |
| execution_profile_ref | 经ConfigurationBasisRef涵盖的environment/build/scope与五项资源tuple批准依据；不是新业务DTO | validate比较execution元组，不能授内部权限 |
| namespace_ref | InstallationNamespace四字段：platform/server_ref/environment_ref/installation_id，来自正式安装/route注册 | InstallationConfigDraft.namespace；与已接纳BridgeInstallation snapshot/原ref一致 |
| capability_ref / route_policy_ref | CapabilitySnapshotRef / RoutePolicyRef，逐安装/version/method/direction与固定route qualification | draft/context/current资格；endpoint由qualified route内部提供 |
| secret_binding_ref | OpaqueSecretBindingRef五字段provider/key/revision/scope/validity，provider正式版本/资格 | draft/context；只有QualifiedSecretUseContext才能私有resolve |
| driver_binding_ref | 03该平台actual Bound*PlatformAdapter + PlatformDriverRequirements，context与所需RuntimeSeamBinding集合 | QualifiedInfraPorts平台router；未选产品/pin返回NotSelected |
| transport_binding_ref | 对该namespace/source/mode合格PlatformSourceHost/private lease/ProtocolAckExecution及TransportHost实际注册 | 已选HTTP/socket/poll/Gateway宿主，不生成listener |
| registration_ref | QualifiedPlatformSourceRegistration六字段installation/family/mode/source_id/scope/qualification | RuntimeRequiredSeams.sources；文件mode必须与actual同值 |
| owner binding_ref | 对应OwnerContractBinding四字段owner/source/scope/qualification与具名OwnerRequirements实际adapter | 六owner facade现有ports，不借同名SDK臆造方法 |
| local_consistency.binding_ref | LocalStorageBinding四字段及同driver八repository/UoW/LocalCommitProbeAdapter、ID/fence/page read切面 | 19collection全原子；Query只取得readonly切面 |
| private/credential binding_ref | PrivateMaterialProviderRequirements或SecretProviderRequirements及actual Bound adapter，完整safe source/current | PrivateMaterialPort / SecretResolutionPort，raw值不进注册表/文件 |
| source_binding_ref | Conversation committed producer或Observability result producer的SafeAuthoritySourceRef/schema/consumer资格及现有transport注册 | E02/E04 Decoder/TrustedConsumerContext，formal producer不存在则NotEstablished |
| policy/source/recovery binding_ref | 对应03现有RateLimit/Retry/retention/comparator/coverage/AuthoritativeRecovery需求source/revision/scope/current与actual facade | 每原subject取得现有typed proof/预算/窗口，不从文件签发 |
| execution.clock_binding_ref / executor_binding_ref | actual ScopedRuntimeClock与同域UoW clock；能scoped poll非Send Future的宿主 | technical TrustedClock / runtime execution，不借客户端timestamp |
| API/event/scheduling binding_ref | 03既有safe technical host、trusted operations/eligible scheduler实际注入与scope/source/window | 原dispatcher/runner/JobInvocationPlan，不能文本造context |

编译产物与注册descriptor必须给具体产品/pin/features、传递依赖闭包、能力/版本/route/source/method、private复制/销毁、禁Debug/rawerror/hidden retry、clock/namespace/expiry/revoke及兼容核验来源；未选或无法证明即Missing/NotSelected/NotEstablished。**本轮这些actual注册尚不存在**；完整demo的fixture selector只是保留的隔离测试命名，不代表已经创建catalog、账号、token、adapter或basis。

系统聚合形式只允许宿主从`bridges`根提取完整对象交本loader，使`bridges.<module>.<setting>`映射为本地`<module>.<setting>`；本地拒绝再次包bridges。聚合与本地双来源同时提供或合并拒绝，不消费其他项目配置，也不实现系统聚合器。

### 7.2 逐域配置项 / module demo / 停审

每域下十列表的“来源”仅JSON选择+§7.1对应trusted来源，绝不ENV/CLI覆盖；“startup”包括cold重启后完整校验。public/internal只是等级，不代表当前可日志输出；所有selector、namespace/route/credential/source值均禁止日志/证据。示例值没有默认资格。

branches的exact十值沿03 RuntimeBranchKind：Management、Inbound、Preparation、Dispatch、Callback、Recovery、SafeRead、SafeHandoff、Qualification、WorkspaceRead。数组必须唯一且非空，不能从当前demo的九值推断删除WorkspaceRead；demo明确未选Workspace，不是默认branch集合。

#### D01 host_admission / 宿主准入

问题回答/诊断：Schema/environment用于loader；branch集合与required一致。本域以受权文件选择schema/environment/branch/profile为边界，类型/来源由SafeRuntimeSettings.branches/configuration_basis；RuntimeCompositionPlan既有合同提供。采用下列明确结构，不采用不能从bin名启用、不能授平台或内部权限。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### host_admission 配置 demo

```json
{
  "host_admission": {
    "schema_version": 1,
    "environment": "test",
    "branches": [
      "Management",
      "Inbound",
      "Preparation",
      "Dispatch",
      "Callback",
      "Recovery",
      "SafeRead",
      "SafeHandoff",
      "Qualification"
    ],
    "configuration_basis_ref": "fixture.configuration.test@1",
    "execution_profile_ref": "fixture.execution.test@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `host_admission.schema_version` | 整数；仅1 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本进程 | startup/cold | internal | fail-fast，不补默认 | load.rs支持版本分支 |
| `host_admission.environment` | enum local/ci/test/staging/prod | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本进程 | startup/cold | internal | fail-fast，不补默认 | namespace.environment_ref/actual profile匹配 |
| `host_admission.branches` | 唯一enum数组；1~10 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本进程 | startup/cold | internal | fail-fast，不补默认 | SafeRuntimeSettings.branches / RuntimeRequiredSeams.branches |
| `host_admission.configuration_basis_ref` | Selector | 无默认 | 是；任一加载时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | ConfigurationBasisRef -> SafeRuntimeSettings.configuration_basis |
| `host_admission.execution_profile_ref` | Selector | 无默认 | 是；任一加载时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | 03 qualified profile/source -> validate预算交集 |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `schema_version` | 整数；仅1 | 1；无默认 | 文件schema版本，不等Domain/owner revision | 仅1；未知版本拒绝 | fail-fast，不补默认 |
| `environment` | enum local/ci/test/staging/prod | "test"；无默认 | 隔离材料标签，不授权限 | 与basis/profile/所有注册environment一致 | fail-fast，不补默认 |
| `branches` | 唯一enum数组；1~10 | 见上方完整branches对象/数组；无默认 | 显式选用的03十branch集合 | exact十RuntimeBranchKind；集合相等、无bin自动启用 | fail-fast，不补默认 |
| `configuration_basis_ref` | Selector | "fixture.configuration.test@1"；无默认 | 本次完整配置来源/变更批准依据 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `execution_profile_ref` | Selector | "fixture.execution.test@1"；无默认 | 批准资源tuple与environment/build/scope | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：文件schema/environment/branch只是选择，不当current资格。exact两个basis/profile selector需要真实source和scope；branches与required集合相等，Schema 1不等其他版本轴。

本域停审：5行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D02 execution / 有界执行

问题回答/诊断：资源上限与execution profile一致；SafeInstant运行同域派生。本域以非零并发/批次/private bytes/wait/stop窗口与受核执行宿主为边界，类型/来源由RuntimeExecutionBudget；runtime/execution.rs与scoped executor/TrustedClock既有合同提供。采用下列明确结构，不采用不覆盖业务attempt预算、平台ACK期限或rate下界。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### execution 配置 demo

```json
{
  "execution": {
    "max_inflight": 4,
    "max_batch": 16,
    "max_private_bytes": 1048576,
    "max_wait_millis": 5000,
    "shutdown_window_millis": 15000,
    "clock_binding_ref": "fixture.clock.test@1",
    "executor_binding_ref": "fixture.executor.test@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `execution.max_inflight` | u32 JSON整数；1~64 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本进程 | startup/cold | internal | fail-fast，不补默认 | RuntimeExecutionBudget.max_inflight |
| `execution.max_batch` | u32 JSON整数；1~256 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本进程 | startup/cold | internal | fail-fast，不补默认 | RuntimeExecutionBudget.max_batch / WorkerBatchBudget |
| `execution.max_private_bytes` | u64 JSON整数；1~8,388,608 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本进程 | startup/cold | internal | fail-fast，不补默认 | RuntimeExecutionBudget.max_private_bytes / private providers / codec |
| `execution.max_wait_millis` | u64 JSON整数；1~60,000 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本进程 | startup/cold | internal | fail-fast，不补默认 | RuntimeExecutionBudget.max_wait_millis / BridgeCallControl |
| `execution.shutdown_window_millis` | u64 JSON整数；1~120,000 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本进程 | startup/cold | internal | fail-fast，不补默认 | clock now + checked duration -> new RuntimeExecutionBudget -> begin_shutdown |
| `execution.clock_binding_ref` | Selector | 无默认 | 是；任一actual准入时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | ScopedRuntimeClock与LocalUnitOfWorkPort::now同provider |
| `execution.executor_binding_ref` | Selector | 无默认 | 是；任一actual准入时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | runtime execution/State，不选Tokio/Axum |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `max_inflight` | u32 JSON整数；1~64 | 4；无默认 | 全本进程同时scoped in-flight call上限；不等平台并发配额 | explicit；与批准tuple一致；每inst/lane仍自己的guard | fail-fast，不补默认 |
| `max_batch` | u32 JSON整数；1~256 | 16；无默认 | 单Worker/Job选择和原page有界上限 | page≤剩余batch；不要求max_batch≤max_inflight，消费并发另控 | fail-fast，不补默认 |
| `max_private_bytes` | u64 JSON整数；1~8,388,608 | 1048576；无默认 | 单call所有存活private buffer累计上限，含ingress/material/payload/secret | checked长度和u32转换；ingress读到超限立即拒绝，不先无限读 | fail-fast，不补默认 |
| `max_wait_millis` | u64 JSON整数；1~60,000 | 5000；无默认 | 一次call本地总等待预算，不重试刷新 | deadline/current窗口取交集；rate下界更晚时保持waiting不提前 | fail-fast，不补默认 |
| `shutdown_window_millis` | u64 JSON整数；1~120,000 | 15000；无默认 | actual停止事件本地scoped drain窗口；非绝对时间 | 批准tuple一致；不沿用startup seed、不把Active当TTL | fail-fast，不补默认 |
| `clock_binding_ref` | Selector | "fixture.clock.test@1"；无默认 | 同域actual clock/单调与权威时间转换注册 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `executor_binding_ref` | Selector | "fixture.executor.test@1"；无默认 | scoped非Send Future宿主 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：五数值硬上限是本轮保守设计限制，不是实测容量或自动批准默认。批准profile必须涵盖同environment/build/scope和exact tuple；资源突变或time溢出拒绝。CFG-03-001已回写重审，stop-time预算通过新member传递；四资源项不在停止时增加。

本域停审：7行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D03 installations / 安装配置

问题回答/诊断：已接纳revision与启动拟载入内容需一致；首次配置仅管理操作接纳。本域以逐namespace的平台、revision及capability/secret/route/basis引用为边界，类型/来源由InstallationConfigDraft七字段；C01/InstallationRepository既有合同提供。采用下列明确结构，不采用不建账号、不自动C01、不授binding/generation。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### installations 配置 demo

```json
{
  "installations": {
    "entries": [
      {
        "namespace_ref": "fixture.slack.namespace@1",
        "platform_kind": "Slack",
        "config_revision": 1,
        "capability_ref": "fixture.slack.capability@1",
        "secret_binding_ref": "fixture.slack.credential@1",
        "route_policy_ref": "fixture.slack.route@1",
        "configuration_basis_ref": "fixture.slack.configuration@1"
      },
      {
        "namespace_ref": "fixture.mattermost.namespace@1",
        "platform_kind": "Mattermost",
        "config_revision": 1,
        "capability_ref": "fixture.mattermost.capability@1",
        "secret_binding_ref": "fixture.mattermost.credential@1",
        "route_policy_ref": "fixture.mattermost.route@1",
        "configuration_basis_ref": "fixture.mattermost.configuration@1"
      },
      {
        "namespace_ref": "fixture.telegram.namespace@1",
        "platform_kind": "Telegram",
        "config_revision": 1,
        "capability_ref": "fixture.telegram.capability@1",
        "secret_binding_ref": "fixture.telegram.credential@1",
        "route_policy_ref": "fixture.telegram.route@1",
        "configuration_basis_ref": "fixture.telegram.configuration@1"
      },
      {
        "namespace_ref": "fixture.discord.namespace@1",
        "platform_kind": "Discord",
        "config_revision": 1,
        "capability_ref": "fixture.discord.capability@1",
        "secret_binding_ref": "fixture.discord.credential@1",
        "route_policy_ref": "fixture.discord.route@1",
        "configuration_basis_ref": "fixture.discord.configuration@1"
      }
    ]
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `installations.entries` | object数组；0~32 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本进程 | startup/cold | internal | fail-fast，不补默认 | SafeRuntimeSettings.installations |
| `installations.entries[].namespace_ref` | Selector | 无默认 | 是；该entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | InstallationNamespace -> InstallationConfigDraft.namespace |
| `installations.entries[].platform_kind` | enum Slack/Mattermost/Telegram/Discord | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact namespace | startup/cold | internal | fail-fast，不补默认 | InstallationConfigDraft.platform_kind |
| `installations.entries[].config_revision` | u64 JSON整数；1~9,007,199,254,740,991 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact namespace | startup/cold | internal | fail-fast，不补默认 | InstallationConfigDraft.revision / ConfigRevision |
| `installations.entries[].capability_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/version/method | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | InstallationConfigDraft.capability / CapabilitySnapshotRef |
| `installations.entries[].secret_binding_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/provider/purpose | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | InstallationConfigDraft.secret_binding / OpaqueSecretBindingRef |
| `installations.entries[].route_policy_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/route/use | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | InstallationConfigDraft.route_policy / RoutePolicyRef |
| `installations.entries[].configuration_basis_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/config revision | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | InstallationConfigDraft.basis / ConfigurationBasisRef |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `entries` | object数组；0~32 | 见上方完整entries对象/数组；无默认 | 全部拟装配安装配置draft；空仅明确无平台消费 | 每行固定七key；namespace唯一；加载不自动C01 | fail-fast，不补默认 |
| `entries[].namespace_ref` | Selector | "fixture.slack.namespace@1"；无默认 | 完整platform/server/environment/installation四tuple | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `entries[].platform_kind` | enum Slack/Mattermost/Telegram/Discord | "Slack"；无默认 | 平台族标签 | 与namespace/对应平台adapters一致 | fail-fast，不补默认 |
| `entries[].config_revision` | u64 JSON整数；1~9,007,199,254,740,991 | 1；无默认 | 拟接纳revision；不是selector@version或binding generation | 已有installation snapshot内容/revision必须已C01 CAS接纳；首次1/后续expected下一值；loader不改DB | fail-fast，不补默认 |
| `entries[].capability_ref` | Selector | "fixture.slack.capability@1"；无默认 | 逐method/source/direction受核快照引用 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `entries[].secret_binding_ref` | Selector | "fixture.slack.credential@1"；无默认 | exact provider/key/revision/scope/window五字段引用 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `entries[].route_policy_ref` | Selector | "fixture.slack.route@1"；无默认 | 固定受权route/TLS/SSRF/proxy/redirect配置依据 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `entries[].configuration_basis_ref` | Selector | "fixture.slack.configuration@1"；无默认 | installation配置接纳/变更来源 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：七字段一一对应原InstallationConfigDraft；bootstrap读取不写C01/CAS。要初始化安装可使用Management-only、installations.entries为空的合格宿主，随后明确C01接纳，再按新受权snapshot冷装配；不存在载入即新建/active。映射identity/channel/message、binding generation与action由C02/C03/C05管理，不进file，也不由namespace字串构造外部账号。

本域停审：8行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D04 slack / Slack适配

问题回答/诊断：family/mode/具体endpoint同时核，不把Events body当交互payload。本域以选driver/transport和HTTP或Socket具名source registration为边界，类型/来源由BoundSlackPlatformAdapter / PlatformSourceHost / PlatformDriverRequirements既有合同提供。采用下列明确结构，不采用不从公开文档推安装scope、ACK不当owner结果。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### slack 配置 demo

```json
{
  "slack": {
    "adapters": [
      {
        "namespace_ref": "fixture.slack.namespace@1",
        "driver_binding_ref": "fixture.slack.driver@1",
        "transport_binding_ref": "fixture.slack.transport@1",
        "inbound_source": {
          "registration_ref": "fixture.slack.inbound@1",
          "mode": "SlackEventsHttp"
        },
        "callback_source": {
          "registration_ref": "fixture.slack.callback@1",
          "mode": "SlackEventsHttp"
        }
      }
    ]
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `slack.adapters` | object数组；0~32 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本平台selected namespace | startup/cold | internal | fail-fast，不补默认 | 该BoundSlackPlatformAdapter + required bindings |
| `slack.adapters[].namespace_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | 与draft同完整InstallationNamespace |
| `slack.adapters[].driver_binding_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/method | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | BoundSlackPlatformAdapter / PlatformDriverRequirements |
| `slack.adapters[].transport_binding_ref` | Selector / null | 无默认 | 是；source非null；外呼时已选qualified transport亦须完整时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | PlatformSourceHost + TransportHost/ProtocolAckExecution |
| `slack.adapters[].inbound_source` | {registration_ref,mode} / null | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact namespace/Inbound | startup/cold | sensitive | fail-fast，不补默认 | RuntimeRequiredSeams.sources / Inbound family |
| `slack.adapters[].inbound_source.registration_ref` | Selector | 无默认 | 是；父对象非null时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/source/family | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | QualifiedPlatformSourceRegistration / family=Inbound |
| `slack.adapters[].inbound_source.mode` | enum SlackEventsHttp/SlackSocket | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact source/family | startup/cold | internal | fail-fast，不补默认 | PlatformSourceMode；registration.mode必须相同 |
| `slack.adapters[].callback_source` | {registration_ref,mode} / null | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact namespace/Callback | startup/cold | sensitive | fail-fast，不补默认 | RuntimeRequiredSeams.sources / Callback family |
| `slack.adapters[].callback_source.registration_ref` | Selector | 无默认 | 是；父对象非null时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/source/family | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | QualifiedPlatformSourceRegistration / family=Callback |
| `slack.adapters[].callback_source.mode` | enum SlackEventsHttp/SlackSocket | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact source/family | startup/cold | internal | fail-fast，不补默认 | PlatformSourceMode；不是新增callback enum |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `adapters` | object数组；0~32 | 见上方完整adapters对象/数组；无默认 | 本平台全部安装driver/source装配条目 | 固定namespace_ref/driver_binding_ref/transport_binding_ref/inbound_source/callback_source；与installations中本平台集合全等 | fail-fast，不补默认 |
| `adapters[].namespace_ref` | Selector | "fixture.slack.namespace@1"；无默认 | 本平台namespace选择 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].driver_binding_ref` | Selector | "fixture.slack.driver@1"；无默认 | 实际driver产品/pin/features及十二method/Context/资格 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].transport_binding_ref` | Selector / null | "fixture.slack.transport@1"；无默认 | 当前source mode宿主/private lease/ACK | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].inbound_source` | {registration_ref,mode} / null | 见上方完整adapters[].inbound_source对象/数组；无默认 | 明确消息/变化family来源或未消费 | 选用该namespace入站必须非null；null无默认输入 | fail-fast，不补默认 |
| `adapters[].inbound_source.registration_ref` | Selector | "fixture.slack.inbound@1"；无默认 | 六字段合格来源注册，不是message ID | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].inbound_source.mode` | enum SlackEventsHttp/SlackSocket | "SlackEventsHttp"；无默认 | 本域的现有source mode选择 | 与actual family/capability相符，不能推默认支持 | fail-fast，不补默认 |
| `adapters[].callback_source` | {registration_ref,mode} / null | 见上方完整adapters[].callback_source对象/数组；无默认 | 明确交互callback family来源或未消费 | C05绑定准备可没有E03入口；选用E03必须非null | fail-fast，不补默认 |
| `adapters[].callback_source.registration_ref` | Selector | "fixture.slack.callback@1"；无默认 | 合格来源注册含Callback family和verification契约 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].callback_source.mode` | enum SlackEventsHttp/SlackSocket | "SlackEventsHttp"；无默认 | 交互入口模式，本平台已注册语义 | actual资格必须包含callback认证/schema/private用途；不能把消息payload当callback | fail-fast，不补默认 |

本域消费与失败闭环：SlackEventsHttp是03既有mode名。用于Callback必须actual registration另证明交互HTTP端点/schema/签名，不把Events请求当action；SlackSocket同样须family资格。事件ACK期限/签名防重放按actual协议，不从max_wait推。bot/user API credential、HTTP signing secret与Socket app-level用途分别provider资格，非单token通用。

本域停审：10行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D05 mattermost / Mattermost适配

问题回答/诊断：callback必须trusted integration/plugin合同；incoming webhook不作事件输入。本域以选server/version合格driver与TrustedHttp/WebSocket来源为边界，类型/来源由BoundMattermostPlatformAdapter / PlatformSourceHost既有合同提供。采用下列明确结构，不采用不借Slack验签；PAT/管理员不当内部actor。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### mattermost 配置 demo

```json
{
  "mattermost": {
    "adapters": [
      {
        "namespace_ref": "fixture.mattermost.namespace@1",
        "driver_binding_ref": "fixture.mattermost.driver@1",
        "transport_binding_ref": "fixture.mattermost.transport@1",
        "inbound_source": {
          "registration_ref": "fixture.mattermost.inbound@1",
          "mode": "MattermostWebSocket"
        },
        "callback_source": {
          "registration_ref": "fixture.mattermost.callback@1",
          "mode": "MattermostTrustedHttp"
        }
      }
    ]
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `mattermost.adapters` | object数组；0~32 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本平台selected namespace | startup/cold | internal | fail-fast，不补默认 | 该BoundMattermostPlatformAdapter + required bindings |
| `mattermost.adapters[].namespace_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | 与draft同完整InstallationNamespace |
| `mattermost.adapters[].driver_binding_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/method | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | BoundMattermostPlatformAdapter / PlatformDriverRequirements |
| `mattermost.adapters[].transport_binding_ref` | Selector / null | 无默认 | 是；source非null；外呼时已选qualified transport亦须完整时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | PlatformSourceHost + TransportHost/ProtocolAckExecution |
| `mattermost.adapters[].inbound_source` | {registration_ref,mode} / null | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact namespace/Inbound | startup/cold | sensitive | fail-fast，不补默认 | RuntimeRequiredSeams.sources / Inbound family |
| `mattermost.adapters[].inbound_source.registration_ref` | Selector | 无默认 | 是；父对象非null时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/source/family | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | QualifiedPlatformSourceRegistration / family=Inbound |
| `mattermost.adapters[].inbound_source.mode` | enum MattermostTrustedHttp/MattermostWebSocket | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact source/family | startup/cold | internal | fail-fast，不补默认 | PlatformSourceMode；registration.mode必须相同 |
| `mattermost.adapters[].callback_source` | {registration_ref,mode} / null | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact namespace/Callback | startup/cold | sensitive | fail-fast，不补默认 | RuntimeRequiredSeams.sources / Callback family |
| `mattermost.adapters[].callback_source.registration_ref` | Selector | 无默认 | 是；父对象非null时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/source/family | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | QualifiedPlatformSourceRegistration / family=Callback |
| `mattermost.adapters[].callback_source.mode` | enum MattermostTrustedHttp/MattermostWebSocket | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact source/family | startup/cold | internal | fail-fast，不补默认 | PlatformSourceMode；不是新增callback enum |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `adapters` | object数组；0~32 | 见上方完整adapters对象/数组；无默认 | 本平台全部安装driver/source装配条目 | 固定namespace_ref/driver_binding_ref/transport_binding_ref/inbound_source/callback_source；与installations中本平台集合全等 | fail-fast，不补默认 |
| `adapters[].namespace_ref` | Selector | "fixture.mattermost.namespace@1"；无默认 | 本平台namespace选择 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].driver_binding_ref` | Selector | "fixture.mattermost.driver@1"；无默认 | 实际driver产品/pin/features及十二method/Context/资格 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].transport_binding_ref` | Selector / null | "fixture.mattermost.transport@1"；无默认 | 当前source mode宿主/private lease/ACK | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].inbound_source` | {registration_ref,mode} / null | 见上方完整adapters[].inbound_source对象/数组；无默认 | 明确消息/变化family来源或未消费 | 选用该namespace入站必须非null；null无默认输入 | fail-fast，不补默认 |
| `adapters[].inbound_source.registration_ref` | Selector | "fixture.mattermost.inbound@1"；无默认 | 六字段合格来源注册，不是message ID | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].inbound_source.mode` | enum MattermostTrustedHttp/MattermostWebSocket | "MattermostWebSocket"；无默认 | 本域的现有source mode选择 | 与actual family/capability相符，不能推默认支持 | fail-fast，不补默认 |
| `adapters[].callback_source` | {registration_ref,mode} / null | 见上方完整adapters[].callback_source对象/数组；无默认 | 明确交互callback family来源或未消费 | C05绑定准备可没有E03入口；选用E03必须非null | fail-fast，不补默认 |
| `adapters[].callback_source.registration_ref` | Selector | "fixture.mattermost.callback@1"；无默认 | 合格来源注册含Callback family和verification契约 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].callback_source.mode` | enum MattermostTrustedHttp/MattermostWebSocket | "MattermostTrustedHttp"；无默认 | 交互入口模式，本平台已注册语义 | actual资格必须包含callback认证/schema/private用途；不能把消息payload当callback | fail-fast，不补默认 |

本域消费与失败闭环：TrustedHttp只接受已核server/plugin/integration认证；incoming webhook不当Inbound。WebSocket消息与可信HTTP callback可不同family。公开Blocks/legacy推荐不推部署版本；PAT/账户权限不推内部Actor。实际callback context不能由正文自授authority。

本域停审：10行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D06 telegram / Telegram适配

问题回答/诊断：消息/回调family整体切换，offset不等owner进度。本域以选Bot API driver与Webhook/Polling同updates source为边界，类型/来源由BoundTelegramPlatformAdapter / PlatformSourceHost既有合同提供。采用下列明确结构，不采用不双消费、不保证删除通知/历史完整、不存含token URL。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### telegram 配置 demo

```json
{
  "telegram": {
    "adapters": [
      {
        "namespace_ref": "fixture.telegram.namespace@1",
        "driver_binding_ref": "fixture.telegram.driver@1",
        "transport_binding_ref": "fixture.telegram.transport@1",
        "inbound_source": {
          "registration_ref": "fixture.telegram.inbound@1",
          "mode": "TelegramPolling"
        },
        "callback_source": {
          "registration_ref": "fixture.telegram.callback@1",
          "mode": "TelegramPolling"
        }
      }
    ]
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `telegram.adapters` | object数组；0~32 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本平台selected namespace | startup/cold | internal | fail-fast，不补默认 | 该BoundTelegramPlatformAdapter + required bindings |
| `telegram.adapters[].namespace_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | 与draft同完整InstallationNamespace |
| `telegram.adapters[].driver_binding_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/method | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | BoundTelegramPlatformAdapter / PlatformDriverRequirements |
| `telegram.adapters[].transport_binding_ref` | Selector / null | 无默认 | 是；source非null；外呼时已选qualified transport亦须完整时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | PlatformSourceHost + TransportHost/ProtocolAckExecution |
| `telegram.adapters[].inbound_source` | {registration_ref,mode} / null | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact namespace/Inbound | startup/cold | sensitive | fail-fast，不补默认 | RuntimeRequiredSeams.sources / Inbound family |
| `telegram.adapters[].inbound_source.registration_ref` | Selector | 无默认 | 是；父对象非null时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/source/family | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | QualifiedPlatformSourceRegistration / family=Inbound |
| `telegram.adapters[].inbound_source.mode` | enum TelegramWebhook/TelegramPolling | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact source/family | startup/cold | internal | fail-fast，不补默认 | PlatformSourceMode；registration.mode必须相同 |
| `telegram.adapters[].callback_source` | {registration_ref,mode} / null | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact namespace/Callback | startup/cold | sensitive | fail-fast，不补默认 | RuntimeRequiredSeams.sources / Callback family |
| `telegram.adapters[].callback_source.registration_ref` | Selector | 无默认 | 是；父对象非null时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/source/family | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | QualifiedPlatformSourceRegistration / family=Callback |
| `telegram.adapters[].callback_source.mode` | enum TelegramWebhook/TelegramPolling | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact source/family | startup/cold | internal | fail-fast，不补默认 | PlatformSourceMode；不是新增callback enum |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `adapters` | object数组；0~32 | 见上方完整adapters对象/数组；无默认 | 本平台全部安装driver/source装配条目 | 固定namespace_ref/driver_binding_ref/transport_binding_ref/inbound_source/callback_source；与installations中本平台集合全等 | fail-fast，不补默认 |
| `adapters[].namespace_ref` | Selector | "fixture.telegram.namespace@1"；无默认 | 本平台namespace选择 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].driver_binding_ref` | Selector | "fixture.telegram.driver@1"；无默认 | 实际driver产品/pin/features及十二method/Context/资格 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].transport_binding_ref` | Selector / null | "fixture.telegram.transport@1"；无默认 | 当前source mode宿主/private lease/ACK | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].inbound_source` | {registration_ref,mode} / null | 见上方完整adapters[].inbound_source对象/数组；无默认 | 明确消息/变化family来源或未消费 | 选用该namespace入站必须非null；null无默认输入 | fail-fast，不补默认 |
| `adapters[].inbound_source.registration_ref` | Selector | "fixture.telegram.inbound@1"；无默认 | 六字段合格来源注册，不是message ID | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].inbound_source.mode` | enum TelegramWebhook/TelegramPolling | "TelegramPolling"；无默认 | 本域的现有source mode选择 | 与actual family/capability相符，不能推默认支持 | fail-fast，不补默认 |
| `adapters[].callback_source` | {registration_ref,mode} / null | 见上方完整adapters[].callback_source对象/数组；无默认 | 明确交互callback family来源或未消费 | C05绑定准备可没有E03入口；选用E03必须非null | fail-fast，不补默认 |
| `adapters[].callback_source.registration_ref` | Selector | "fixture.telegram.callback@1"；无默认 | 合格来源注册含Callback family和verification契约 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].callback_source.mode` | enum TelegramWebhook/TelegramPolling | "TelegramPolling"；无默认 | 交互入口模式，本平台已注册语义 | actual资格必须包含callback认证/schema/private用途；不能把消息payload当callback | fail-fast，不补默认 |

本域消费与失败闭环：TelegramWebhook/Polling同updates source覆盖消息/回调family时两registration必须同actual source、mode和批准原子切换group；只消费一种family也必须核未启动另一种同updates入口。offset位置是Protocol-only；官网服务合同本轮仍unavailable，cloud留存/删除/配额/窗口不自行设默认。

本域停审：10行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D07 discord / Discord适配

问题回答/诊断：Inbound仅Gateway；Callback family独立互斥；resume不足保gap。本域以选API/Gateway driver、HTTP/Gateway callback和合格intents为边界，类型/来源由BoundDiscordPlatformAdapter / PlatformSourceHost既有合同提供。采用下列明确结构，不采用不把Snowflake当总序、不把token或ACK当授权/送达。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### discord 配置 demo

```json
{
  "discord": {
    "adapters": [
      {
        "namespace_ref": "fixture.discord.namespace@1",
        "driver_binding_ref": "fixture.discord.driver@1",
        "transport_binding_ref": "fixture.discord.transport@1",
        "inbound_source": {
          "registration_ref": "fixture.discord.inbound@1",
          "mode": "DiscordGateway"
        },
        "callback_source": {
          "registration_ref": "fixture.discord.callback@1",
          "mode": "DiscordHttpInteraction"
        }
      }
    ]
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `discord.adapters` | object数组；0~32 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | 本平台selected namespace | startup/cold | internal | fail-fast，不补默认 | 该BoundDiscordPlatformAdapter + required bindings |
| `discord.adapters[].namespace_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | 与draft同完整InstallationNamespace |
| `discord.adapters[].driver_binding_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/method | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | BoundDiscordPlatformAdapter / PlatformDriverRequirements |
| `discord.adapters[].transport_binding_ref` | Selector / null | 无默认 | 是；source非null；外呼时已选qualified transport亦须完整时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | PlatformSourceHost + TransportHost/ProtocolAckExecution |
| `discord.adapters[].inbound_source` | {registration_ref,mode} / null | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact namespace/Inbound | startup/cold | sensitive | fail-fast，不补默认 | RuntimeRequiredSeams.sources / Inbound family |
| `discord.adapters[].inbound_source.registration_ref` | Selector | 无默认 | 是；父对象非null时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/source/family | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | QualifiedPlatformSourceRegistration / family=Inbound |
| `discord.adapters[].inbound_source.mode` | enum DiscordGateway/DiscordHttpInteraction | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact source/family | startup/cold | internal | fail-fast，不补默认 | PlatformSourceMode；registration.mode必须相同 |
| `discord.adapters[].callback_source` | {registration_ref,mode} / null | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact namespace/Callback | startup/cold | sensitive | fail-fast，不补默认 | RuntimeRequiredSeams.sources / Callback family |
| `discord.adapters[].callback_source.registration_ref` | Selector | 无默认 | 是；父对象非null时非null | JSON选择＋§7.1具名trusted来源 | exact namespace/source/family | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | QualifiedPlatformSourceRegistration / family=Callback |
| `discord.adapters[].callback_source.mode` | enum DiscordGateway/DiscordHttpInteraction | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | exact source/family | startup/cold | internal | fail-fast，不补默认 | PlatformSourceMode；不是新增callback enum |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `adapters` | object数组；0~32 | 见上方完整adapters对象/数组；无默认 | 本平台全部安装driver/source装配条目 | 固定namespace_ref/driver_binding_ref/transport_binding_ref/inbound_source/callback_source；与installations中本平台集合全等 | fail-fast，不补默认 |
| `adapters[].namespace_ref` | Selector | "fixture.discord.namespace@1"；无默认 | 本平台namespace选择 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].driver_binding_ref` | Selector | "fixture.discord.driver@1"；无默认 | 实际driver产品/pin/features及十二method/Context/资格 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].transport_binding_ref` | Selector / null | "fixture.discord.transport@1"；无默认 | 当前source mode宿主/private lease/ACK | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].inbound_source` | {registration_ref,mode} / null | 见上方完整adapters[].inbound_source对象/数组；无默认 | 明确消息/变化family来源或未消费 | 选用该namespace入站必须非null；null无默认输入 | fail-fast，不补默认 |
| `adapters[].inbound_source.registration_ref` | Selector | "fixture.discord.inbound@1"；无默认 | 六字段合格来源注册，不是message ID | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].inbound_source.mode` | enum DiscordGateway/DiscordHttpInteraction | "DiscordGateway"；无默认 | 本域的现有source mode选择 | Inbound只DiscordGateway；HttpInteraction不能接消息 | fail-fast，不补默认 |
| `adapters[].callback_source` | {registration_ref,mode} / null | 见上方完整adapters[].callback_source对象/数组；无默认 | 明确交互callback family来源或未消费 | C05绑定准备可没有E03入口；选用E03必须非null | fail-fast，不补默认 |
| `adapters[].callback_source.registration_ref` | Selector | "fixture.discord.callback@1"；无默认 | 合格来源注册含Callback family和verification契约 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `adapters[].callback_source.mode` | enum DiscordGateway/DiscordHttpInteraction | "DiscordHttpInteraction"；无默认 | 交互入口模式，本平台已注册语义 | actual资格必须包含callback认证/schema/private用途；不能把消息payload当callback | fail-fast，不补默认 |

本域消费与失败闭环：Inbound只DiscordGateway；Callback可DiscordHttpInteraction或DiscordGateway，同interaction来源family排他。Gateway session/sequence/resume scope不足保gap；HTTP每请求Ed25519/timestamp验证；公开3秒ACK与15分钟token是协议限制不是审批或外部成功。Bot/OAuth credential与临时interaction token不能混持。

本域停审：10行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D08 local_consistency / 本地一致性

问题回答/诊断：SafeRead只用读取切面，不因driver支持写而给Query写权限。本域以选同driver/schema/scope/current binding及其能力切面为边界，类型/来源由LocalStorageBinding；八repo/UoW/LocalCommitProbeAdapter既有合同提供。采用下列明确结构，不采用不改wholeCAS/原子性、不换driver探原unknown、不生产inmemory。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### local_consistency 配置 demo

```json
{
  "local_consistency": {
    "binding_ref": "fixture.local_store.test@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `local_consistency.binding_ref` | Selector / null | 无默认 | 是；任一branch消费local read或mutation时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | LocalStorageBinding；八repo+UoW+commit probe/ID/fence |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `binding_ref` | Selector / null | "fixture.local_store.test@1"；无默认 | 同driver/schema/原wholeCAS/commit probe/读写切面 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：注册须19collection hydration/schema、所有独立revision/unique/index/wholeCAS/actual commit journal和readonly original probe；Unknown必须同store/driver读取，不选择新driver或新mutation begin。local product未选，不提供inmemory生产fallback；Query只读取snapshot切面。

本域停审：1行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D09 identity_responsibility / 身份责任

问题回答/诊断：正式责任还与Governance交集；配置不能补失去主体的basis。本域以选择exact Identity owner/source/责任兼容adapter为边界，类型/来源由IdentityOwnerRequirements / ActorResponsibilityPort既有合同提供。采用下列明确结构，不采用external_id不自动建GlobalMember/human actor。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### identity_responsibility 配置 demo

```json
{
  "identity_responsibility": {
    "binding_ref": "fixture.identity.owner@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `identity_responsibility.binding_ref` | Selector / null | 无默认 | 是；required闭包实际消费Identity责任时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | IdentityOwnerAdapter / OwnerContractBinding + ActorResponsibilityPort |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `binding_ref` | Selector / null | "fixture.identity.owner@1"；无默认 | AI身份锚点与formal actor责任兼容 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：AI GlobalMember与external human责任链不能混淆；actor/participant来源需正式Identity/Governance责任合同交集。未建立human责任链必须拒，config选择ID不生成GlobalMember。

本域停审：1行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D10 binding_authorization / 绑定授权

问题回答/诊断：同一个合格Governance绑定按现有port分面消费，不造新权威。本域以选择current Policy/Gate/双端/安全projection/action qualification来源为边界，类型/来源由GovernanceOwnerRequirements；Binding/Presentation/Read/Action ports既有合同提供。采用下列明确结构，不采用无skip_gate/audit_only/低敏approve/默认target。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### binding_authorization 配置 demo

```json
{
  "binding_authorization": {
    "binding_ref": "fixture.governance.owner@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `binding_authorization.binding_ref` | Selector / null | 无默认 | 是；required闭包实际消费Governance时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | GovernanceOwnerAdapter / Binding/Presentation/Read/Action现有ports |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `binding_ref` | Selector / null | "fixture.governance.owner@1"；无默认 | 双端/Policy/Gate/current可见性/正式action资格 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：治理绑定涵盖Policy/Gate适用性、visibility/existence、safe projection、action current/one-use及维护资格；附件/Workspace仍各自owner。只能展示已获准RefOnly/安全提示，无proof不能给敏感审批内容或默认可操作按钮。

本域停审：1行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D11 conversation_handoff / 会话交接

问题回答/诊断：source只有正式producer/schema current才能E02；null未消费不授默认源。本域以选bridge-origin/result/probe-compatible owner与committed source为边界，类型/来源由ConversationOwnerRequirements；ConversationHandoffPort与E02来源既有合同提供。采用下列明确结构，不采用不拥有Conversation/Turn、不把平台ACK当提交。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### conversation_handoff 配置 demo

```json
{
  "conversation_handoff": {
    "binding_ref": "fixture.conversation.owner@1",
    "source_binding_ref": "fixture.conversation.committed_source@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `conversation_handoff.binding_ref` | Selector / null | 无默认 | 是；Inbound/Recovery或实际消费Conversation时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | ConversationOwnerAdapter / Handoff/Recovery ports |
| `conversation_handoff.source_binding_ref` | Selector / null | 无默认 | 是；明确选用E02接收时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | E02/ConversationOwnerRequirements::qualify_source + safe event host |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `binding_ref` | Selector / null | "fixture.conversation.owner@1"；无默认 | bridge-origin/accepted/current原op及source兼容 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `source_binding_ref` | Selector / null | "fixture.conversation.committed_source@1"；无默认 | 正式producer/source/schema/version/consumer scope，不是webhook URL | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：binding和committed source分别注册，owner accepted不等Turn提交或平台送达；E02 source=null只明确不消费该producer，C04准备仍其完整Preparation required。source schema/version/committed basis/current不能由配置随便填写。

本域停审：2行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D12 attachment_refs / 附件引用

问题回答/诊断：必要/可省略由owner当前grant，不让配置drop_required_attachment。本域以选Artifact授权引用/准入来源为边界，类型/来源由ArtifactOwnerRequirements；authorized attachment grant既有合同提供。采用下列明确结构，不采用不存附件bytes/公开token URL、不新造Artifact。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### attachment_refs 配置 demo

```json
{
  "attachment_refs": {
    "binding_ref": "fixture.artifact.owner@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `attachment_refs.binding_ref` | Selector / null | 无默认 | 是；任何已选payload/consumer消费Artifact附件时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | ArtifactOwnerAdapter；与PrivateMaterial/Presentation现有组合 |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `binding_ref` | Selector / null | "fixture.artifact.owner@1"；无默认 | 附件authorized ref/grant/有效性/必要与可省略来源 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：authorized attachment/grant当前validity和必要/可省略合同必须具名；只选择Artifact owner adapter。不保存附件bytes、永久公共链接或tokenized file URL；传递途径仍由private lease/provider/route核。

本域停审：1行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D13 private_material / 私有材料

问题回答/诊断：各实际payload来源覆盖与max_private_bytes一致；provider不产可外显权限。本域以选择短借source/grant/schema/private buffer provider为边界，类型/来源由PrivateMaterialProviderRequirements / BoundPrivateMaterialAdapter既有合同提供。采用下列明确结构，不采用不得durable/cache/temp/dead-letter，不把drop说成zeroize。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### private_material 配置 demo

```json
{
  "private_material": {
    "binding_ref": "fixture.private_material.test@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `private_material.binding_ref` | Selector / null | 无默认 | 是；Inbound/Dispatch或实际source读取时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | BoundPrivateMaterialAdapter / PrivateMaterialProviderRequirements |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `binding_ref` | Selector / null | "fixture.private_material.test@1"；无默认 | 本call payload/source/lease/private材料 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：需要覆盖Conversation/Governance安全projection、Artifact引用和选用Workspace来源；raw仅当前call owning lease/短borrow，全部buffer按execution cap计量。不能选仅附件provider后默认覆盖敏感projection；不能temp/cache/dead-letter；drop不宣zeroize。

本域停审：1行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D14 workspace_projection / 工作区投影

问题回答/诊断：null只表示明确未消费；其他source不借Workspace资格。本域以显式未选或绑定Workspace只读兼容来源为边界，类型/来源由WorkspaceOwnerRequirements；选用safe read/export/provenance既有合同提供。采用下列明确结构，不采用不当频道/权限/导出truth，不以optional绕选用required。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### workspace_projection 配置 demo

```json
{
  "workspace_projection": {
    "binding_ref": null
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `workspace_projection.binding_ref` | Selector / null | 无默认 | 是；WorkspaceRead或实际projection明确消费时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | WorkspaceOwnerAdapter / 条件WorkspaceRead/current projection |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `binding_ref` | Selector / null | null；无默认 | Workspace安全read/export/visibility/provenance | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：完整demo为null，表示没有消费Workspace；一旦WorkspaceRead或actual projection依赖出现必须非null且required，不能借null退化成无权限内容。WS十二开放项状态不释放。

本域停审：1行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D15 observation_handoff / 观察交接

问题回答/诊断：缺正式规则不默认audit-only；原十二affected不因配置存在关闭。本域以选producer/schema/admission/原consumer-result绑定与transport来源为边界，类型/来源由ObservabilityOwnerRequirements；SafeObservationPort与E04来源既有合同提供。采用下列明确结构，不采用不通过开关跳mandatory、不造canonical/report/evidence。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### observation_handoff 配置 demo

```json
{
  "observation_handoff": {
    "binding_ref": "fixture.observability.owner@1",
    "source_binding_ref": "fixture.observability.consumer_result@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `observation_handoff.binding_ref` | Selector / null | 无默认 | 是；SafeHandoff或任何正式OwnerMandatory mutation时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | ObservabilityOwnerAdapter / SafeObservationPort |
| `observation_handoff.source_binding_ref` | Selector / null | 无默认 | 是；明确选用E04接收时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | E04/ObservabilityOwnerRequirements::qualify_source + safe event host |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `binding_ref` | Selector / null | "fixture.observability.owner@1"；无默认 | formal producer/schema/admission/consumer原op结果 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `source_binding_ref` | Selector / null | "fixture.observability.consumer_result@1"；无默认 | 正式producer/source/schema/version/consumer scope，不是webhook URL | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：owner binding不等producer admission。正式OwnerMandatory规则存在时，canonical/schema/admission/producer必须先齐才能mutation/IO；null仅正式非mandatory且明确未消费，有OwnerPermitsOmission依据。SafeHandoff总required；E04原consumer结果只finalize，不递归producer或生成evidence。

本域停审：2行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D16 credential_use / 凭据使用

问题回答/诊断：binding指provider/key/revision/scope/window；private resolver每次重核撤销。本域以选provider注册及exact-version用途引用为边界，类型/来源由SecretProviderRequirements；OpaqueSecretBindingRef / QualifiedSecretUseContext既有合同提供。采用下列明确结构，不采用不收raw secret/env token/URL、不latest/fallback/换身份。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### credential_use 配置 demo

```json
{
  "credential_use": {
    "bindings": [
      {
        "provider_ref": "fixture.credential.provider@1",
        "adapter_binding_ref": "fixture.credential.resolver@1"
      }
    ]
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `credential_use.bindings` | object数组；0~16 | 无默认 | 是 | JSON选择＋§7.1具名trusted来源 | provider/scope | startup/cold | sensitive | fail-fast，不补默认 | SecretResolutionPort实际provider注册 |
| `credential_use.bindings[].provider_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact provider/version | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | SecretProviderRef；与OpaqueSecretBindingRef.provider一致 |
| `credential_use.bindings[].adapter_binding_ref` | Selector | 无默认 | 是；entry存在时非null | JSON选择＋§7.1具名trusted来源 | exact provider/use | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | BoundSecretAdapter / SecretProviderRequirements |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `bindings` | object数组；0~16 | 见上方完整bindings对象/数组；无默认 | 支持已选installation secret_binding所需resolver集 | provider唯一；不使用provider索引猜identity；覆盖全部selected secret用途 | fail-fast，不补默认 |
| `bindings[].provider_ref` | Selector | "fixture.credential.provider@1"；无默认 | 正式provider safe引用，不含key/token | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `bindings[].adapter_binding_ref` | Selector | "fixture.credential.resolver@1"；无默认 | 具体resolver/KMS/secret产品及current/private contract | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：provider-ref到actual adapter逐个唯一，必须覆盖安装secret binding的provider和每次SecretUsePurpose；同revision/purpose/scope/window不可借用别安装凭据。KMS只作为resolver可选载体，解密不代表所有权限/轮换/撤销合同成立。所有raw值仅最后private seam读取。

本域停审：3行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D17 dispatch / 受控投递

问题回答/诊断：只供new/current qualification；原effect冻结预算/窗口不被config覆盖。本域以选择真实limit source与受权retry/attempt policy source为边界，类型/来源由QualifiedRateLimitBoundSet、RetryBudgetRef、AuthorizedAttemptWindowRef既有合同提供。采用下列明确结构，不采用不缩任何rate下界、不隐藏SDK retry/盲重发。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### dispatch 配置 demo

```json
{
  "dispatch": {
    "rate_source_binding_ref": "fixture.rate_source.test@1",
    "retry_policy_ref": "fixture.retry_policy.test@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `dispatch.rate_source_binding_ref` | Selector / null | 无默认 | 是；Dispatch或实际rate-limit消费时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | PlatformDriverRequirements::qualify_rate_bounds / LaneRepository / QualifiedRateLimitBoundSet |
| `dispatch.retry_policy_ref` | Selector / null | 无默认 | 是；Dispatch/原subject重交资格消费时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | PresentationQualificationPort::qualify_retry；原RetryBudgetRef/AuthorizedAttemptWindowRef/RetryEligibilityRef |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `rate_source_binding_ref` | Selector / null | "fixture.rate_source.test@1"；无默认 | all适用scope真实limit来源与same shared store；不是固定requests-per-second | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `retry_policy_ref` | Selector / null | "fixture.retry_policy.test@1"；无默认 | 批准new/current原subject attempt预算/窗口的正式source；文件不提供 used/NoEffect | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：rate source在每method实际取得QualifiedRateLimitBoundSet（scope/scope_id/not_before/validity/basis及完整qualification），全global/method/resource/bucket取max。retry policy使原subject取得RetryBudgetRef.maximum/used/window/basis和AuthorizedAttemptWindowRef，只有current+NoEffect+RetryEligibility+原lane成立才next；配置不重置used/原effect预算、不缩下界，SDK每调用零隐藏重试。

本域停审：2行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D18 replay_continuity / 回放连续性

问题回答/诊断：retention/current维护由ConfigQualificationPort取得；不足manual/blocked。本域以选择comparator/coverage、批准retention与权威原op probe来源为边界，类型/来源由AuthoritativeComparator/coverage；RetentionExpiryBasisRef；AuthoritativeRecoveryPort既有合同提供。采用下列明确结构，不采用不设自由TTL清key、不跨epoch、不用timer消unknown。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### replay_continuity 配置 demo

```json
{
  "replay_continuity": {
    "comparison_source_binding_ref": "fixture.stream_coverage.test@1",
    "retention_policy_ref": "fixture.retention_policy.test@1",
    "recovery_binding_ref": "fixture.recovery.test@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `replay_continuity.comparison_source_binding_ref` | Selector / null | 无默认 | 是；选用cursor/gap/replay source时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | AuthoritativeComparatorRef/AuthoritativeCoverageRef / J03 |
| `replay_continuity.retention_policy_ref` | Selector / null | 无默认 | 是；任何dedup/current维护消费时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | QualifiedRetentionWindowRef；ConfigQualificationPort::qualify_dedup_expiry -> RetentionExpiryBasisRef / J05 |
| `replay_continuity.recovery_binding_ref` | Selector / null | 无默认 | 是；Recovery/SafeHandoff或原unknown恢复时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | AuthoritativeRecoveryPort及各Requirements；J02/J03/J04原result |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `comparison_source_binding_ref` | Selector / null | "fixture.stream_coverage.test@1"；无默认 | same stream/epoch comparator与complete coverage来源 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `retention_policy_ref` | Selector / null | "fixture.retention_policy.test@1"；无默认 | 逐六DedupNamespace批准保留窗口及current维护适用性source | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `recovery_binding_ref` | Selector / null | "fixture.recovery.test@1"；无默认 | same-driver local与具名owner/platform/consumer原op readonly probe | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：comparison source必须same stream/epoch/stage comparator及complete coverage；不可比保gap/manual。retention source逐六namespace返回scope/validity/basis，expiry由ConfigQualificationPort::qualify_dedup_expiry取得独立current proof；timer/TTL不授权、不删除key/result/tombstone/unknown。recovery当前读取同original op，不默认包含send/action。

本域停审：3行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D19 entry_transport / 入口运输

问题回答/诊断：平台transport由其模块具名；本域只管理/API及safe E02/E04宿主。本域以选实际认证的API/事件transport宿主为边界，类型/来源由TransportHost / SafeEventTransportHost / PlatformSourceHost既有合同提供。采用下列明确结构，不采用不自建listener默认路由、不以ACK推业务结果。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### entry_transport 配置 demo

```json
{
  "entry_transport": {
    "api_binding_ref": "fixture.api_host.test@1",
    "event_binding_ref": "fixture.event_host.test@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `entry_transport.api_binding_ref` | Selector / null | 无默认 | 是；选用API/C/Q/HTTP入口时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | TransportHost / 原API dispatcher |
| `entry_transport.event_binding_ref` | Selector / null | 无默认 | 是；选用E02/E04 transport消费时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | SafeEventTransportHost/SafeTransportAckCall；非新Bus产品 |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `api_binding_ref` | Selector / null | "fixture.api_host.test@1"；无默认 | 具名受信管理/Query与HTTP handler宿主，qualified route/认证 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `event_binding_ref` | Selector / null | "fixture.event_host.test@1"；无默认 | safe E02/E04 producer/source/schema/consumer filter和ACK宿主 | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：API/安全event实际host注册匹配exact protocol family/schema/version/content type、actor来源/consumer过滤和route；无default endpoint/port/TLS/URL允许表。由其产品seam正式注册内部网络参数，不能把字段ref解析为任意URL；E02/E04 ACK只transport阶段。

本域停审：2行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。

#### D20 scheduling / 维护调度

问题回答/诊断：五bin仅消费正式JobInvocationPlan；调度预算沿execution不重复。本域以选operator invocation/eligible调度provider为边界，类型/来源由WorkerEligibleJobRunner；JobInvocationDispatcher；trusted operations host既有合同提供。采用下列明确结构，不采用CLI不建subject/op/TrustedJobContext、不绕owner authority。Step3同名域/Step4分类/Step5来源/Step6环境共同约束每行，§7.1 selector实际解析不可缺省。

##### scheduling 配置 demo

```json
{
  "scheduling": {
    "invocation_binding_ref": "fixture.operations_host.test@1",
    "scheduler_binding_ref": "fixture.scheduler.test@1"
  }
}
```

| 配置项 | 类型 | 默认值 | 是否必填 | 来源 | 作用域 | 生效方式 | 敏感级别 | 失败策略 | 关联模块 |
|---|---|---|---|---|---|---|---|---|---|
| `scheduling.invocation_binding_ref` | Selector / null | 无默认 | 是；五Jobs实际执行或worker消费该正式invocation时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | JobInvocationDispatcher/五bin现有入口 |
| `scheduling.scheduler_binding_ref` | Selector / null | 无默认 | 是；worker实际eligible调度时非null | JSON选择＋§7.1具名trusted来源 | 本进程受权scope | startup/cold | sensitive | syntax fail-fast；未建立fail-closed | WorkerEligibleJobRunner / Application五selector |

| 配置项 | 类型 | 示例值 / 默认 | 作用 | 约束 / 校验 | 失败策略 |
|---|---|---|---|---|---|
| `invocation_binding_ref` | Selector / null | "fixture.operations_host.test@1"；无默认 | trusted operations host输出原JobInvocationPlan | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |
| `scheduler_binding_ref` | Selector / null | "fixture.scheduler.test@1"；无默认 | 有界eligible selection/current维护read与original plan provider | §7.1 exact-version selector；wrong-kind/scope/version/current拒绝 | syntax fail-fast；未建立fail-closed |

本域消费与失败闭环：CLI invocation selector经同kind actual trusted operations host得到原plan；worker只collect qualified existing eligible subject/continuity，不创建新op/effect或operator身份。selector/page/batch current预算和原Jobs library复用，未选host不启动scheduler。

本域停审：2行十列/说明与demo逐key核对，来源/typed map/无默认/必填或null guard/startup/敏感/失败齐；回指Step3~6，pass_design。除execution的CFG-03-001已回写重审外，均无03type/API/state影响。demo只synthetic fixture选择，actual注册缺失仍blocked，不宣平台/测试ready。



### 7.3 跨配置项闭环审计

| 审计项 | 实际结论 | 设计状态 |
|---|---|---|
| 配置项覆盖 | 二十域82行，含object/array父容器和嵌套字段，全部十列+module JSON+六列说明；无通用runtime/storage/common/misc | pass_design |
| 数值/default | 五资源数值explicit/hard范围/approved tuple；config_revision有界，ref/@version独立；无P0默认/无限/窗口authoritative伪造 | pass_design |
| typed mapping | 七installation字段、settings四字段、budget五字段、source六字段、required三字段和23+3 seam静态并集全部回指03 | pass_design |
| 来源与secret | JSON选择不覆盖proof或secret；provider用途/版本/current/source/route齐；pin/driver/实际资格未建立 | pass_design |
| 平台差异 | 四typed平台独立；八mode两family、Telegram同updates整体排他、Discord family独立，命名不代替认证 | pass_design |
| 原业务语义 | rate所有scope max；retry original预算/NoEffect/current；retention proof不删tombstone/key/result/unknown；Query无write | pass_design |
| 03影响 | CFG-03-001已精确回写四source/正式03并重审，其他无公共type/API/flow变化；无待回写/阻塞待确认本地影响 | pass_design |

文件不含external binding relation或identity/channel/message locator映射规则，三mapping完整schema/显式授权/canonical key/cursor状态继续03；任何alias只能定位既有typed记录，不创事实。外部edit/delete/thread/附件差异由该capability_ref和四driver方法资格解释，不给默认模拟删除、退平铺或公开链接fallback。

required闭包必须完整使用03§5 Infra原表+§6 Infra补全+十九Application callable actual依赖：CommonRead=ConfigQualificationPort/InstallationRepository/TrustedClock；MutatingLocal=LocalUnitOfWorkPort/ContinuityRepository/SafeTraceRepository/LocalIdSource，**SafeRead禁止套MutatingLocal**；真实entry另TransportHost。每一selected scope/installation/source independently覆盖，mandatory观察规则额外current先核；source registry不能以一个kind遮盖多installation资格。执行profile必须涵盖当前binary实际装配/handler/host：非该入口消费面不因同一file默认启动，文件选项与actual能力不匹配拒绝，不让实现者按bin名猜authority。

### 7.4 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 二十域JSON/selector与五预算数值范围 | 否 | 文件语法与原field装配细化 | 原03§13消费位置，不改 | 无回写 |
| CFG-03-001：实际shutdown deadline必须在停止事件重建预算 | 是 | 一个runtime member签名/宿主调用/guard；不增type/state边 | 03§5/6/9/13及对应Step6/7/10/14；独立反校准附录重审 | 已回写 |
| 来源注册无raw值、profile不授authority | 否 | 原current/actual provider边界具体化 | 原03§5/6/13 | 无回写 |

### 7.5 完整配置 demo

下面是**未注册、不可运行的全字段test fixture结构示意**，不是外部账号、secret、安装或approved profile。没有任何catalog/driver/依据已创建，完整admission必然NotEstablished；也不能把这一份示意当七binary部署文件。实际运行须选择本binary可承接的branch/source、受权snapshot/profile和实际typed注册，未选项显式null/空数组，按§9整体校验/发布。此例不含真实外部ID、token、URL或审批材料。

```json
{
  "host_admission": {
    "schema_version": 1,
    "environment": "test",
    "branches": [
      "Management",
      "Inbound",
      "Preparation",
      "Dispatch",
      "Callback",
      "Recovery",
      "SafeRead",
      "SafeHandoff",
      "Qualification"
    ],
    "configuration_basis_ref": "fixture.configuration.test@1",
    "execution_profile_ref": "fixture.execution.test@1"
  },
  "execution": {
    "max_inflight": 4,
    "max_batch": 16,
    "max_private_bytes": 1048576,
    "max_wait_millis": 5000,
    "shutdown_window_millis": 15000,
    "clock_binding_ref": "fixture.clock.test@1",
    "executor_binding_ref": "fixture.executor.test@1"
  },
  "installations": {
    "entries": [
      {
        "namespace_ref": "fixture.slack.namespace@1",
        "platform_kind": "Slack",
        "config_revision": 1,
        "capability_ref": "fixture.slack.capability@1",
        "secret_binding_ref": "fixture.slack.credential@1",
        "route_policy_ref": "fixture.slack.route@1",
        "configuration_basis_ref": "fixture.slack.configuration@1"
      },
      {
        "namespace_ref": "fixture.mattermost.namespace@1",
        "platform_kind": "Mattermost",
        "config_revision": 1,
        "capability_ref": "fixture.mattermost.capability@1",
        "secret_binding_ref": "fixture.mattermost.credential@1",
        "route_policy_ref": "fixture.mattermost.route@1",
        "configuration_basis_ref": "fixture.mattermost.configuration@1"
      },
      {
        "namespace_ref": "fixture.telegram.namespace@1",
        "platform_kind": "Telegram",
        "config_revision": 1,
        "capability_ref": "fixture.telegram.capability@1",
        "secret_binding_ref": "fixture.telegram.credential@1",
        "route_policy_ref": "fixture.telegram.route@1",
        "configuration_basis_ref": "fixture.telegram.configuration@1"
      },
      {
        "namespace_ref": "fixture.discord.namespace@1",
        "platform_kind": "Discord",
        "config_revision": 1,
        "capability_ref": "fixture.discord.capability@1",
        "secret_binding_ref": "fixture.discord.credential@1",
        "route_policy_ref": "fixture.discord.route@1",
        "configuration_basis_ref": "fixture.discord.configuration@1"
      }
    ]
  },
  "slack": {
    "adapters": [
      {
        "namespace_ref": "fixture.slack.namespace@1",
        "driver_binding_ref": "fixture.slack.driver@1",
        "transport_binding_ref": "fixture.slack.transport@1",
        "inbound_source": {
          "registration_ref": "fixture.slack.inbound@1",
          "mode": "SlackEventsHttp"
        },
        "callback_source": {
          "registration_ref": "fixture.slack.callback@1",
          "mode": "SlackEventsHttp"
        }
      }
    ]
  },
  "mattermost": {
    "adapters": [
      {
        "namespace_ref": "fixture.mattermost.namespace@1",
        "driver_binding_ref": "fixture.mattermost.driver@1",
        "transport_binding_ref": "fixture.mattermost.transport@1",
        "inbound_source": {
          "registration_ref": "fixture.mattermost.inbound@1",
          "mode": "MattermostWebSocket"
        },
        "callback_source": {
          "registration_ref": "fixture.mattermost.callback@1",
          "mode": "MattermostTrustedHttp"
        }
      }
    ]
  },
  "telegram": {
    "adapters": [
      {
        "namespace_ref": "fixture.telegram.namespace@1",
        "driver_binding_ref": "fixture.telegram.driver@1",
        "transport_binding_ref": "fixture.telegram.transport@1",
        "inbound_source": {
          "registration_ref": "fixture.telegram.inbound@1",
          "mode": "TelegramPolling"
        },
        "callback_source": {
          "registration_ref": "fixture.telegram.callback@1",
          "mode": "TelegramPolling"
        }
      }
    ]
  },
  "discord": {
    "adapters": [
      {
        "namespace_ref": "fixture.discord.namespace@1",
        "driver_binding_ref": "fixture.discord.driver@1",
        "transport_binding_ref": "fixture.discord.transport@1",
        "inbound_source": {
          "registration_ref": "fixture.discord.inbound@1",
          "mode": "DiscordGateway"
        },
        "callback_source": {
          "registration_ref": "fixture.discord.callback@1",
          "mode": "DiscordHttpInteraction"
        }
      }
    ]
  },
  "local_consistency": {
    "binding_ref": "fixture.local_store.test@1"
  },
  "identity_responsibility": {
    "binding_ref": "fixture.identity.owner@1"
  },
  "binding_authorization": {
    "binding_ref": "fixture.governance.owner@1"
  },
  "conversation_handoff": {
    "binding_ref": "fixture.conversation.owner@1",
    "source_binding_ref": "fixture.conversation.committed_source@1"
  },
  "attachment_refs": {
    "binding_ref": "fixture.artifact.owner@1"
  },
  "private_material": {
    "binding_ref": "fixture.private_material.test@1"
  },
  "workspace_projection": {
    "binding_ref": null
  },
  "observation_handoff": {
    "binding_ref": "fixture.observability.owner@1",
    "source_binding_ref": "fixture.observability.consumer_result@1"
  },
  "credential_use": {
    "bindings": [
      {
        "provider_ref": "fixture.credential.provider@1",
        "adapter_binding_ref": "fixture.credential.resolver@1"
      }
    ]
  },
  "dispatch": {
    "rate_source_binding_ref": "fixture.rate_source.test@1",
    "retry_policy_ref": "fixture.retry_policy.test@1"
  },
  "replay_continuity": {
    "comparison_source_binding_ref": "fixture.stream_coverage.test@1",
    "retention_policy_ref": "fixture.retention_policy.test@1",
    "recovery_binding_ref": "fixture.recovery.test@1"
  },
  "entry_transport": {
    "api_binding_ref": "fixture.api_host.test@1",
    "event_binding_ref": "fixture.event_host.test@1"
  },
  "scheduling": {
    "invocation_binding_ref": "fixture.operations_host.test@1",
    "scheduler_binding_ref": "fixture.scheduler.test@1"
  }
}
```

## 8. 回填草稿

正式§7逐字装配§7.1~7.5，包括二十逐域控制/十列表/严格JSON/六列说明和消费者/失败闭环；82行字段不得只留名称，full demo明确不可运行/未建立。公开资料与shutdown最小反校准来源在本Step两个附录，正式§15列入导航。

## 9. 待确认事项

BR-UP001~009=open、010=reference_only；WS十二开放项及Observability十二affected保原状态；平台/SDK/OAuth/API Key/KMS/router/DB/executor实际资格未建立。不实现、运行项目测试、stage或commit。

## 10. 自检与下一Step条件

实际只读检查：十段齐，§3~8未写占位0、03影响表存在，errors=[]。人工按本Step SOP问题与具名03消费点逐项核对，本步范围/禁止面/来源/失效语义通过设计静态自检；20 module/完整JSON实际JSON.parse与内容一致，82行十列/20停审真实重跑errors=[]；先前检查31行含unescaped union竖线导致列数失败，工具返回exit1未被后续调用守卫拦截而误建Step8骨架，已先回退Step7修正重审再推进，过程偏差保留，未以失败结果定稿。CFG-03-001已回写重审，外部gate不释放。

self_review=pass_design_static；下一仅enter_step08。BR-UP/WS/affected及真实产品资格不释放；没有编译、项目测试或平台投递，不stage/commit。
