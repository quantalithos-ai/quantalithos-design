# L3-capability-hub 02 Step 11 配置影响轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 11
> 回填章节: `projects/L3-capability-hub/02-概要设计.md` §11 配置影响轮廓
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 本轮口径: 在 Step 5~10 已收稳的组成部分、接口、处理流、状态和异常边界基础上,只识别哪些概要层结构受配置影响、哪些边界禁止配置化、哪些配置实现契约后移 `03/04`;不写配置 key、默认值、JSON / YAML / TOML 示例、环境变量名、secret 名、`RuntimeConfig` 字段全集、`ConfigError` 枚举、adapter constructor 参数、配置加载实现、部署挂载、热更新流程或产品参数。

---

## 0. Step 开工确认

| 项 | 结论 |
|---|---|
| 用户确认 | 已确认从 Step 10 进入 `02-概要设计.md` Step 11。 |
| 当前恢复点 | Step 10 `异常与边界场景轮廓` 已完成并停审通过。 |
| 正式文档状态 | `projects/L3-capability-hub/02-概要设计.md` 仍为 historical material,本步不得修改。 |
| 上游基线 | 新版正式 `00-需求文档.md`、新版正式 `01-架构设计.md`、`02` Step 1~10 calibration 产物。 |
| 旧材料处理 | 旧 `README.md`、旧正式 `02/03/05/06` 只作后置差异审计,不得作为配置项或配置默认值来源。 |

---

## 1. Step 内计划

| 子任务 | 状态 | 说明 | gate |
|---|---|---|---|
| 标准读取 | done | 读取概要设计 SOP Step 11、书写规范 §4.11 和配置影响轮廓表 / 禁止配置化边界表要求。 | pass |
| 上游读取 | done | 读取正式 `00/01`、Step 3/5/7/8/9/10 的约束、组成部分、接口、flow、状态和异常结论。 | pass |
| 参考粒度 | done | 参考 `L1-governance`、`L1-artifact`、`L3-method-library` 的 Step 11 粒度和结构。 | pass |
| 配置影响候选识别 | done | 从 8 个主要组成部分、Command / Query / Consumer / Job / Port 和 external seam 中识别受影响主语。 | pass |
| 禁止配置化边界识别 | done | 从 truth owner、domain invariant、状态机红线、审计链、一致性和安全边界中提取禁止配置化项。 | pass |
| 结构化产物 | done | 输出配置影响轮廓表、禁止配置化边界表、配置影响图、详细设计承接和 `04` 后移说明。 | pass |
| 回填草稿 | done | 准备正式 §11 回填草稿,但不写正式 `02`。 | pass |
| 恢复点更新 | done | 本文件完成后已更新 flow 与项目台账。 | pass |

---

## 2. 必读文档

| 文档 | 读取结论 | 本步使用方式 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` Step 11 | 本步必须识别配置影响、禁止配置化边界和交给详细设计的配置实现契约方向。 | 组织配置影响轮廓表、禁止配置化边界表和详细设计承接说明。 |
| `standards/document/概要设计书写规范.md` §4.11 | `是否受配置影响` 必须写“是 / 否 / 间接受影响 / 不适用”;影响类型只能写类别。 | 本文件所有配置表只写类别,不写具体配置项。 |
| `02_hld_step_03_constraints.md` | 配置可以影响运行承载、外部接缝参数、派生刷新节奏、保留策略和安全展示策略,但不能改变 truth owner、formal boundary、分层、ref / safe summary、forbidden body 和派生不反写。 | 作为 Step 11 的硬门禁。 |
| `02_hld_step_05_components_boundary.md` | 已收稳 8 个主要组成部分及其职责 / 非职责。 | 配置影响主语必须回指这 8 个组成部分和已确认接缝。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已按 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job、External Port Skeleton 分类。 | 配置影响可落在入口、consumer、job、publisher、external port 和 runtime builder 注入方向。 |
| `02_hld_step_08_processing_flows.md` | 已收稳 GenericCommandWritePath、GenericQueryReadPath、GenericInboundEventConsumerPath、GenericOperationsJobPath 和 event candidate 路径。 | 配置不得让 Query 写状态、Consumer 写核心 truth、Job 修核心 truth 或 event 投递失败回滚 truth。 |
| `02_hld_step_09_state_machine.md` | 已收稳多状态族、允许 / 禁止迁移和状态传播关系。 | 状态词表、允许迁移、禁止迁移和传播分层不得配置化。 |
| `02_hld_step_10_exceptions_boundaries.md` | 已点名 Command / Query / Consumer / Job / event collaboration 异常和 forbidden body 红线。 | 配置不得吞掉异常、伪装成功或把 forbidden / partial / unavailable surface 配成正常 ready。 |
| `projects/L3-capability-hub/00-需求文档.md` | 需求基线明确 capability access truth、边界外职责、数据归属、规则红线和后续配置后移。 | 保护 runtime execution、tools execution、governance truth、method body、SDK client、marketplace、secret、cost、observability 边界。 |
| `projects/L3-capability-hub/01-架构设计.md` | 架构基线明确 truth / snapshot / ref / derived / forbidden body 分层、同步 / 异步 / 后台分离和协议产品中立。 | 配置只影响承载和接缝,不改变架构所有权和分层。 |
| 参考项目 Step 11 | 参考候选识别、配置影响总表、禁止配置化表、配置图和详细设计承接密度。 | 只参考结构和粒度,不复制领域内容。 |

---

## 3. SOP 问题回答

### 3.1 哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受到配置影响?

受配置影响的结构集中在运行装配和外围接缝:

- Inbound / API entry:Command intake、Query intake、operation context factory、consumer context 注入和 profile 选择。
- 外部来源接缝:外部 MCP / A2A / API source adapter、external document adapter、governance result ref adapter、method asset ref adapter、secret ref / safe summary adapter、runtime / tools / SDK consumer ref adapter、observability / audit ref adapter。
- 派生维护与只读输出:consumer view refresh、directory projection rebuild、audit-friendly export、read-only ecosystem discovery、reconciliation report。
- Inbound Event Consumer:governance / method / external source / downstream impact / audit material / external document reference changed consumer。
- Outbound Event / collaboration port:已提交 access fact、change record、impact summary 或 derived material refreshed 的协作投递接缝。
- Operations Job runner:registry reconciliation、consumer view refresh、projection rebuild、export preparation、reference refresh、event collaboration repair。

### 3.2 哪些模块只能间接受配置影响,不能直接读取配置?

Domain Model、Domain Policy、核心状态机和核心 truth object 只能通过 application service 注入的已校验输入、port、adapter、reference state、safe summary、freshness surface 或 command intent 间接受配置影响。它们不得直接读取 runtime config,也不得让配置改变:

- capability access truth owner。
- `CapabilityIdentity`、`CapabilityRegistryEntry`、`AdapterDescriptor`、`GovernanceSeamRelation`、`CapabilityMethodBodyFreeRelation`、`FormalExposureBoundary` 等核心对象的成立语义。
- `DescriptorBoundaryPolicy`、`FormalExposurePolicy`、`ReferenceResolutionPolicy`、`DerivedMaterialPolicy`、`ConsumerViewFreshnessPolicy` 等领域策略的红线。
- 状态词表、允许迁移、禁止迁移和 normal path 判断。

### 3.3 哪些领域规则、状态机、审计链、事务一致性或安全门禁禁止配置化?

禁止配置化的边界包括:

- capability identity 必须先于 registry、descriptor、seam、relation 和 exposure 成立。
- registry / descriptor / governance seam / method relation / formal exposure 的前置关系。
- retired 对象不得原地恢复为 active 或 formal_visible。
- adapter descriptor 不得承载 ProviderContract、secret 正文、provider runtime、quota、route、cost、failover、retry truth。
- governance seam 不得生成 approval、Policy 或 shared_rules truth。
- method relation 必须 body-free,不得迁入 method body。
- formal exposure 与 controlled consumer view 分层,consumer view 不反写 exposure。
- Query no-write、Consumer no-core-truth-write、Job no-core-truth-repair。
- forbidden body 不得通过配置变成 allowed summary。
- event collaboration failed / handoff unavailable 不得回滚已提交 truth 或 change record。

### 3.4 哪些配置影响需要在 `03-详细设计.md` 中继续定义实现契约?

`03-详细设计.md` 需要继续定义配置实现契约方向,但不得由本步提前展开字段全集:

- Runtime config ownership:哪些 runtime builder / adapter builder / job runner / consumer runner 读取并校验配置。
- Config validation:启动阻断、adapter disabled、entry degraded、job delayed、handoff unavailable 等错误 surface。
- Dependency injection:application service 如何接收 repository、publisher、external reference adapter、safe summary adapter、query projection adapter、job runner 和 handoff adapter。
- Adapter config:external source、governance、method、secret safe summary、runtime / tools / SDK consumer、observability / audit、external document 和 marketplace ecosystem ref adapter。
- Job config:refresh scope、batch、cursor、retry、parallelism、report target 和 safe diagnostic 的实现契约。
- Query / read config:freshness hint、fallback strategy、visibility redaction、projection source selection 和 degraded response surface。
- Consumer / event config:source profile、schema / contract version allowlist、idempotency channel、forbidden body check、dead-letter category 和 handoff result surface。

### 3.5 哪些配置细节属于 `04-配置设计.md`,不能在概要设计中提前展开?

以下内容必须后移 `04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` 或 `07-实施计划.md`:

- 配置 key、默认值、上限、下限、单位、环境变量名、文件路径和配置文件格式。
- JSON / YAML / TOML 示例、配置 schema、配置 loader 实现和热更新流程。
- secret 名称、token、证书、KMS / Vault 参数和 network policy。
- 具体数据库、cache、broker、search、object store、API gateway、MCP / A2A / API adapter 产品参数。
- retry 间隔、backoff、dead letter 名称、quarantine 策略、batch size、cursor schema、schedule 和 worker 并发数。
- SLO、P95、吞吐、容量数字、测试证据 alias、验收签署、run id 或实现 commit。

---

## 4. 配置影响候选识别

### 4.1 候选识别规则

配置影响候选必须同时满足:

1. 主语已经在 Step 4~10 出现,且能回指主要组成部分、入口、adapter、job、consumer、publisher 或 external port。
2. 影响属于运行装配、配置来源选择、profile、store root、timeout、batch、retry、feature policy、secret ref、external endpoint、safe diagnostic、fallback、redaction、handoff target 等类别。
3. 不改变业务不变量、状态机红线、truth owner、正式接入边界、审计 / trace 成立关系、安全门禁或 forbidden body 边界。

### 4.2 候选诊断

- 核心业务组成部分不是“直接读取配置”的模块。配置只能通过 application service、runtime builder 和 adapter builder 形成输入、port 或 degraded surface。
- 外部 MCP / A2A / API 方向需要配置影响轮廓,但概要层只能写 source adapter、external endpoint、timeout、secret ref 和 safe summary adapter 等类别,不能锁定具体协议、认证、DTO 或 provider runtime。
- governance / method / SDK 只能作为接缝配置影响,不得借配置迁入 `L1-governance`、`L3-method-library` 或 `L0-sdk` 的 truth。
- 派生维护、只读输出、event collaboration 和 reference refresh 需要配置影响轮廓,但配置不能把 job、consumer 或 query 变成核心 truth 写入路径。
- 旧 `ProviderContract`、`CapabilityDecision`、`QueryCapabilities`、KMS / Vault、CostRecord、policy refresh、outbox relay 参数不能作为当前配置候选。

### 4.3 配置影响候选表

| 候选主语 | 来源 | 候选影响类别 | 是否进入正式轮廓 | 初步理由 |
|---|---|---|---|---|
| Inbound / Command / Query entry | Step 7 接口分类 | config source selector、profile、operation context injection、request size / timeout category | 是 | 入口需要运行装配,但 actor、metadata、idempotency 和 scope 门禁不可配置关闭。 |
| 能力身份与接入语境 | Step 5 组成部分 | external source adapter、intake profile、source ref resolver、safe diagnostic category | 是 | identity truth 不直接配置化,但外部来源接入和解析接缝受运行装配影响。 |
| 注册目录与生命周期 | Step 5 / 8 / 9 | registry store adapter、reconciliation scope、directory read material source | 是 | registry truth 不由配置改变,但维护和读取材料承载受配置影响。 |
| 接入描述与风险摘要 | Step 5 / 7 / 10 | descriptor source adapter、external document endpoint、secret ref、risk / safe summary display policy | 是 | descriptor 主线需要外部接缝,但不得保存 ProviderContract、secret 正文或 provider runtime。 |
| 治理与方法关系 | Step 5 / 7 / 8 | governance result ref adapter、method asset ref adapter、reference refresh cadence、safe summary profile | 是 | seam / relation 通过 ref 协作,配置只影响接缝和刷新,不能改 relation truth。 |
| 正式暴露与受控消费 | Step 5 / 8 / 9 | consumer view profile、freshness hint、read material store、degraded fallback | 是 | exposure 是 truth,consumer view 是 projection;配置只影响消费视图装配和可读降级。 |
| 追溯、变化与影响 | Step 5 / 8 / 10 | trace store adapter、impact source profile、handoff target、safe diagnostic policy | 是 | trace / impact 要可解释,但不得复制 raw observability、execution payload 或 evidence alias。 |
| 派生维护与只读输出 | Step 5 / 7 / 8 | job profile、batch category、retry category、refresh scope、store root、report root | 是 | 派生维护天然受配置影响,但只能写 projection / summary / report / freshness。 |
| 外部引用与安全摘要支撑 | Step 5 / 7 / 8 / 10 | external endpoint、source allowlist、adapter kind、timeout、secret ref、event collaboration adapter | 是 | ref / safe summary / handoff 需要接缝配置,但不拥有外部 truth 或正文。 |
| Inbound Event Consumer | Step 7 / 8 | transport binding、source profile、idempotency channel、schema / contract version allowlist | 是 | consumer 配置影响接收方式,但不得绕过 Command 写核心 truth。 |
| Outbound Event / collaboration port | Step 7 / 8 / 9 | publisher adapter、transport binding、retry category、dead-letter category、handoff target | 是 | event collaboration 受投递接缝影响,失败不得回滚 truth。 |
| Operations Job runner | Step 7 / 8 / 10 | schedule category、batch category、cursor category、retry category、parallelism category | 是 | job 运行策略受配置影响,但不得成为业务 repair command。 |
| External Port Skeleton | Step 7 | endpoint、adapter kind、timeout、secret ref、safe summary adapter、handoff mode | 是 | 概要层只点名外部接缝类别,不写 trait、transport 或产品参数。 |
| Domain model / policy / state machine | Step 6 / 8 / 9 | 无直接配置 | 否,列入禁止边界 | domain invariant、状态迁移和 policy guard 不能由配置开关改变。 |

### 4.4 候选自检

| 检查项 | 结论 | 说明 |
|---|---|---|
| 候选是否来自已收稳主语 | pass | 均回指 Step 5 组成部分、Step 7 接口、Step 8 flow、Step 9 状态或 Step 10 异常。 |
| 是否写入配置项清单 | pass | 只写影响类别,未写 key、默认值、env var、JSON 或 secret 名。 |
| 是否让 domain 直接读取配置 | pass | domain / policy / state machine 进入禁止配置化边界。 |
| 是否恢复旧配置口径 | pass | 未继承旧 ProviderContract、KMS / Vault、CostRecord、QueryCapabilities 或 policy refresh 配置线索。 |

---

## 5. 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| Inbound / Command / Query entry | 是 | config source selector、profile、operation context injection、request size / timeout category | 03 定义 entry config ownership、ConfigValidator、runtime builder 注入和 invalid / degraded surface;不得关闭 actor、metadata、idempotency、scope 门禁。 |
| 能力身份与接入语境 | 间接受影响 | external source adapter、intake profile、source ref resolver、safe diagnostic policy | 03 定义 source adapter / resolver 注入和 `unresolved / unavailable / forbidden` 映射;domain identity 不直接读取配置。 |
| 注册目录与生命周期 | 间接受影响 | registry store adapter、reconciliation scope、directory read material source | 03 定义 repository / reconciliation adapter 和 report surface;配置不得改变 registry lifecycle、visibility prerequisite 或 retired 终态。 |
| 接入描述与风险摘要 | 是 | descriptor source adapter、external document endpoint、secret ref、risk summary display policy、safe summary adapter | 03 定义 AdapterConfig、secret ref adapter、safe summary boundary 和 descriptor unavailable / forbidden surface;不得恢复 ProviderContract 或 secret 正文。 |
| 治理与方法关系 | 间接受影响 | governance result ref adapter、method asset ref adapter、reference refresh cadence、safe summary profile | 03 定义 governance / method ref adapter、consumer 处理和 command intent 边界;不得用配置改写 seam / relation truth 或迁入外部正文。 |
| 正式暴露与受控消费 | 是 | consumer view profile、freshness hint、read material store、visibility redaction、fallback policy | 03 定义 consumer view resolver、freshness policy 注入和 degraded response;配置不得让 consumer view 反写 formal exposure。 |
| 追溯、变化与影响 | 是 | trace store adapter、impact source profile、handoff target、safe diagnostic policy、retention category | 03 定义 trace / impact adapter、handoff result surface 和 safe diagnostic contract;不得生成 raw audit、observability store 或真实 evidence alias。 |
| 派生维护与只读输出 | 是 | job profile、batch category、retry category、refresh scope、store root、report root、safe diagnostic policy | 03 定义 JobConfig、job runner injection、cursor / scope typed surface 和 job failure surface;配置不得允许 job 修核心 truth。 |
| 外部引用与安全摘要支撑 | 是 | external endpoint、source allowlist、adapter kind、timeout、secret ref、event collaboration adapter、handoff mode | 03 定义 reference adapter、safe summary adapter、event collaboration adapter 和 forbidden body check;不定义外部系统 truth 或 payload schema。 |
| Inbound Event Consumer | 是 | transport binding、source profile、idempotency channel、schema / contract version allowlist、forbidden body check | 03 定义 consumer config、dedup / version validation 和 rejected / delayed / ignored surface;不得让 consumer 直接写核心 relation / exposure truth。 |
| Outbound Event / collaboration port | 是 | publisher adapter、transport binding、retry category、dead-letter category、handoff target | 03 定义 publisher config、event candidate assembly、delivery outcome 和 handoff unavailable surface;不得让投递失败回滚 truth。 |
| Operations Job runner | 是 | schedule category、batch category、cursor category、retry category、parallelism category、operator context profile | 03 定义 job ownership、job config validation、idempotent job surface 和 operator actor 注入;不得把 job 变成业务 command。 |
| External Port Skeleton | 是 | endpoint、adapter kind、timeout、secret ref、safe summary adapter、handoff mode | 03 定义 port contract、adapter boundary、unavailable / partial / forbidden 映射;04 再说明如何填写配置。 |
| Domain model / domain policy / core state machine | 否 | 不适用 | 03 只能定义 guard、transition function 和 error mapping;不得把 invariant、状态词表、允许迁移或 forbidden body 边界做成配置开关。 |

---

## 6. 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| capability access truth owner | 本仓存在理由是独立承载 identity、registry、descriptor、seam、relation、exposure 和 trace / impact truth,不能由部署或 profile 改变。 | `00-需求文档.md` / `01-架构设计.md` 重新评审。 |
| capability identity 必须先于 registry / descriptor / seam / relation / exposure | identity 是后续能力接入事实的主体锚点,配置不能允许 URL、provider 名、tool config、runtime config、SDK client 或 listing 替代 identity。 | 需求业务规则、架构数据所有权、Step 9 状态机。 |
| retired identity / registry / exposure 不得原地复活 | 退役是历史保留和追溯边界,配置恢复会破坏状态机和审计链。 | 状态机重审或新对象 / 新关系设计。 |
| registry lifecycle 和 formal visibility 前置 | 未描述、未治理、visibility pending 的能力不能通过配置变成 formal_visible。 | 需求规则、架构责任边界、正式 Command 设计。 |
| descriptor boundary 不得退化为 ProviderContract | descriptor 只表达接入方式、能力类型、风险和约束摘要,不得承载 provider runtime、route、quota、cost、failover、retry 或 secret 正文。 | 需求数据归属、架构边界、详细 descriptor 设计。 |
| secret / KMS / Vault truth 不入仓 | 本仓只允许 secret ref 和安全 safe summary,配置不能开放 secret value、token、API key 或 KMS / Vault lifecycle。 | 安全平台 / 配置设计 / 需求数据归属重审。 |
| governance seam 不生成 governance approval / Policy / shared_rules truth | 本仓只承接 result ref 和允许摘要,配置不能让本仓执行治理或拥有治理正文。 | `L1-governance` 需求 / 架构和本仓 seam 设计重审。 |
| method relation 必须 body-free | method body、TaskDefinition、AIPolicyDef、ProcessTemplateDef 和 method version body 属于 `L3-method-library`。 | `L3-method-library` 设计和本仓 relation 边界重审。 |
| formal exposure 与 controlled consumer view 分层 | 服务端 exposure 是 truth,consumer view 是 snapshot / projection;配置不能让 view、runtime cache、SDK client 或 QueryCapabilities 反写 exposure。 | Step 8 flow、Step 9 状态机、formal exposure 详细设计。 |
| Query no-write | 读取路径不得刷新 projection、解析 external ref、创建 missing truth、修复状态或生成 event candidate。 | 架构交互分层和 query 详细设计。 |
| Inbound Event Consumer no-core-truth-write | 外部事件只能写 ref state、safe summary、stale marker、impact summary 或 command intent,不得绕过 Command 改写 core truth。 | event consumer 详细设计和正式 Command 设计。 |
| Operations Job no-core-truth-repair | job 只能维护 projection、summary、report、freshness、reference state 或 handoff status,不得修 identity、registry、descriptor、seam、relation 或 exposure truth。 | operations / reconciliation 详细设计。 |
| forbidden body 永不通过配置入仓 | governance truth、method body、secret 正文、provider runtime、execution payload、SDK client、marketplace transaction、cost ledger、observability store 和 external document body 均禁止保存。 | 需求数据归属、架构 forbidden body 边界、接口 DTO 详细设计。 |
| derived material 不反写核心 truth | directory projection、consumer view、audit export、ecosystem discovery、reconciliation report 只是可重建材料或报告。 | 派生维护详细设计和 query / job 边界。 |
| event collaboration failure 不回滚已提交 truth | 下游投递或 handoff 可用性不能改变已提交的 access fact、change record 或 traceability。 | event collaboration / handoff 详细设计。 |
| trace / audit / handoff 不伪造 evidence alias | 本步不拥有测试证据、验收签署或真实 observability audit store;配置不能生成伪证据。 | `05-测试方案.md` / `06-验收标准.md` / observability 设计。 |
| sync / async / background 分层 | Command 同步裁定、event 协作异步传播、job 后台派生三者边界不能被配置合并。 | `01-架构设计.md` 交互分层和 Step 8 flow 重审。 |
| `L0-core` 之外的编译期依赖裁剪 | 配置不能把 sibling 仓源码、SDK client、runtime adapter 或 governance / method 实现变成本仓编译期依赖。 | 全局依赖规则和架构依赖方向重审。 |

---

## 7. 配置影响轮廓图

#### 配置影响轮廓图

```text
+=====================================================================+
|                 Capability Hub Configuration Impact                 |
+=====================================================================+
| Runtime configuration                                                |
|   |                                                                  |
|   +--> Entry / Consumer / Job / Adapter builders                     |
|   |       | validate config and create allowed ports / profiles       |
|   |       v                                                          |
|   |   Application services                                           |
|   |       | receive validated adapters, stores, freshness hints       |
|   |       v                                                          |
|   |   Domain objects and policies                                    |
|   |       | no direct config read; invariants and state rules fixed    |
|   |       v                                                          |
|   |   Truth / relation / summary / reference / projection stores     |
|   |                                                                  |
|   +--> Operations and collaboration controls                         |
|           | refresh / rebuild / publish / handoff categories          |
|           v                                                          |
|       Derived material / reference state / handoff surfaces          |
+=====================================================================+
```

关键说明:

- 配置只能进入 entry、consumer、job、adapter builder、external port、publisher、handoff 和 derived maintenance 等运行装配边界。
- Application service 接收已校验的 port、profile、store、freshness hint、safe diagnostic policy 或 handoff target,不能让配置绕过 domain policy。
- Domain object、domain policy 和核心状态机不直接读取配置;truth owner、forbidden body、状态迁移和审计链保持固定。
- 图不表达配置加载实现、JSON / YAML / TOML 示例、密钥系统细节、部署挂载、热更新流程、产品参数、topic 或 payload。

---

## 8. 配置实现契约交给详细设计的方向

| 契约方向 | 详细设计需要回答 | 不在概要设计展开 |
|---|---|---|
| Config ownership | 哪个 runtime builder、entry builder、adapter builder、consumer runner、job runner 或 publisher builder 读取并校验配置。 | 具体配置文件、key、env var、默认值和目录。 |
| Config validation | 配置错误如何导致 startup blocked、entry disabled、adapter unavailable、job delayed、handoff unavailable 或 degraded surface。 | 完整 `ConfigError` enum、错误码、响应 schema。 |
| Runtime builder injection | application service 如何接收 repository、query projection、external ref adapter、safe summary adapter、publisher、job runner 和 handoff adapter。 | 完整 constructor 参数、trait 定义、依赖注入代码。 |
| AdapterConfig | external source、governance、method、secret safe summary、runtime / tools / SDK consumer、observability / audit、external document、marketplace ecosystem ref adapter 如何抽象。 | 具体 URL、认证字段、产品参数、adapter crate、协议 DTO。 |
| JobConfig | refresh、rebuild、reconciliation、reference resolution、event collaboration repair 的 scope、batch、cursor、retry、parallelism 和 report surface 如何表达。 | retry 数字、cron、worker loop、锁、DLQ、恢复脚本。 |
| Query / ReadConfig | freshness hint、projection availability、fallback、redaction、page / filter 和 consumer view profile 如何进入只读 surface。 | 分页默认值、排序字段、缓存实现、响应字段全集。 |
| Consumer / EventConfig | source profile、schema / contract version allowlist、dedup、forbidden body check、delayed / ignored / rejected surface 如何表达。 | topic、payload schema、consumer group、消息中间件参数。 |
| Handoff / PublisherConfig | event candidate、publisher result、handoff target、delivery failure 和 handoff unavailable 如何表达。 | outbox 表、relay 实现、具体 topic、重试策略数字。 |
| Safe diagnostic boundary | 配置错误、外部不可用和摘要 partial 如何被安全地显化给 query / operations / audit-friendly output。 | raw log、metric、trace、audit store、evidence alias、验收报告格式。 |
| Change control | 哪些高风险配置改变需要 operator approval、governance decision 或发布流程控制。 | 具体审批 UI、组织流程、验收签署和真实运行证据。 |

---

## 9. 配置细节留给 `04-配置设计.md`

| 配置细节 | 留给后续文档的原因 |
|---|---|
| 配置 key / env var / JSON / YAML / TOML / file path | 属于配置说明和实现约定,概要层只识别影响类别。 |
| 默认值、上限、下限、单位、容量数字 | 需要详细设计、测试方案和验收标准支撑。 |
| 具体 DB / cache / broker / search / object store / API gateway / MCP / A2A / API adapter 产品参数 | 当前概要保持协议和产品中立。 |
| secret 名称、token、证书、KMS / Vault 参数、network policy | 属于安全基础设施、部署和配置设计。 |
| retry 间隔、backoff、dead-letter、quarantine、schedule、worker 并发、cursor schema | 属于详细设计、配置设计、测试和实施计划。 |
| SLO、P95、吞吐、batch size 数字、retention 天数 | 需要负载模型、测试证据和验收口径闭合。 |
| evidence alias、验收签署、run id、实现 commit | 当前没有真实实现和测试运行,不得伪造。 |

---

## 10. 旧材料差异审计

| 旧材料 / 旧口径 | 本步处理 | 理由 |
|---|---|---|
| 旧 README 的“能力池 / MCP / A2A / API 集成中心” | 只保留方向线索,不生成具体 adapter 配置项。 | 当前只需表达外部能力接入对象和接缝影响,不锁定协议 / 产品 / DTO。 |
| 旧 `ProviderContract` 配置口径 | 不继承。 | 新版是 `AdapterDescriptor` + ref / safe summary 边界;ProviderContract 混入 secret、quota、route、cost、failover、provider runtime。 |
| 旧 KMS / Vault / secret envelope 配置 | 不继承。 | 本仓不是 secrets 平台,只允许 secret ref 和 safe summary。 |
| 旧 `CapabilityDecision` / `QueryCapabilities` / allow-deny 配置 | 不继承。 | formal exposure、controlled consumer view、runtime enforcement 和 governance decision 已分层。 |
| 旧 cost / billing / finance 配置 | 排除。 | cost / billing / finance ledger 不归本仓。 |
| 旧 policy refresh / shared_rules 配置 | 不继承。 | governance approval、Policy effective fact 和 shared_rules truth 属于 `L1-governance`。 |
| 旧 method version / method body 配置 | 不继承。 | method body 和 lifecycle 属于 `L3-method-library`;本仓只维护 body-free relation。 |
| 旧 outbox relay / topic / retry 参数 | 不继承为概要配置。 | Step 11 只识别 event collaboration / publisher / handoff 影响类别;具体 topic、payload、retry 后移。 |
| 旧 marketplace listing / SDK client 配置 | 不继承。 | 只读生态发现和服务端 exposure 可配置装配,listing / transaction / SDK client 不归本仓。 |
| 旧 P95 / 30s / SLA / 成本覆盖率量化 | 不继承。 | 当前无负载模型和测试证据;量化目标后续按 `05/06` 重建。 |

### 10.1 新增 blocker 处理

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| `CH-HLD-CONFIG-001` | 旧 `02/03` 配置与运行机制口径 | resolved_for_step_11 | 旧材料容易把 ProviderContract、KMS / Vault、CostRecord、QueryCapabilities、policy refresh、outbox relay、runtime provider lookup 和旧量化指标写成当前配置基线。 | Step 11 已按新版 Step 3/5/7/8/9/10 重建配置影响轮廓,旧配置口径只作 historical material。 |

---

## 11. 设计取舍

| 取舍项 | 选项 | 结论 | 理由 |
|---|---|---|---|
| 是否在概要层列完整配置项 | A. 列完整 key / default;B. 只列影响类别 | B | 配置项清单属于 `03/04`,概要层只负责影响轮廓和禁止配置化边界。 |
| 是否允许 domain 直接读取配置 | A. 允许;B. 不允许 | B | 防止运行配置改变 domain invariant、状态迁移和 truth owner。 |
| 是否把 external MCP / A2A / API 分类写成具体 adapter 配置 | A. 写具体协议 / adapter;B. 只写 source adapter / endpoint / timeout / secret ref 类别 | B | descriptor taxonomy 和协议细分仍后移,当前保持协议中立。 |
| 是否配置化 formal exposure 前置 | A. 可以通过 profile 放宽;B. 禁止 | B | exposure 是服务端 truth,不得绕过 registry、descriptor、seam、relation 和 visibility 前置。 |
| 是否配置化 job 修复核心 truth | A. 可以;B. 不可以 | B | job 只维护派生、reference、report 和 handoff surface。 |
| 是否把 event collaboration 具体化为 outbox / topic / retry | A. 在 Step 11 写;B. 后移 | B | 本步只识别 publisher / handoff 配置影响,不定义 outbox / topic / payload / retry 实现。 |

---

## 12. 回填草稿

正式 `02-概要设计.md` 后续 Step 14 装配时:

- §11 使用本文件 §5 的配置影响轮廓表。
- §11 使用本文件 §6 的禁止配置化边界表。
- §11 摘录本文件 §7 的配置影响轮廓图和关键说明。
- §11 使用本文件 §8 的详细设计配置实现契约方向。
- §11 明确配置 key、默认值、JSON / YAML / TOML、env var、secret 名、产品参数、部署挂载、热更新、retry 数字、batch 数字、evidence alias、run id 和实现 commit 均不在概要设计写入。

建议回填正文:

```md
## 11. 配置影响轮廓

本章只识别配置影响轮廓,不定义配置项清单、默认值、JSON / YAML / TOML 示例、环境变量名、secret 名称、`RuntimeConfig` 字段、`ConfigError` 枚举或 adapter constructor 参数。配置主要影响 entry、consumer、job、adapter、publisher、external port、派生维护和 handoff 的运行装配;Domain object、Domain policy、核心状态机和 capability access truth owner 不直接读取配置。

<插入配置影响轮廓表>

<插入禁止配置化边界表>

<插入配置影响轮廓图>

上述配置影响应在 `03-详细设计.md` 中收口为 runtime builder、ConfigValidator、AdapterConfig、JobConfig、Query / Consumer / Publisher config 和 handoff config 的实现契约,并由 `04-配置设计.md` 继续说明如何填写、校验和使用。
```

---

## 13. 待确认事项

本步不新增阻塞 Step 12 的上游 blocker。以下事项需在后续文档继续闭口:

| 待确认项 | 后续承接 | 当前不阻塞原因 |
|---|---|---|
| descriptor taxonomy 是否细分 MCP / A2A / external API / LLM provider API | `03-详细设计.md` / `04-配置设计.md` | Step 11 只写 descriptor source adapter 和 endpoint 类别。 |
| governance seam 字段和 safe summary 最小内容 | `03-详细设计.md` | Step 11 只写 ref adapter / safe summary profile,不定义字段。 |
| method relation 摘要强度 | `03-详细设计.md` | Step 11 只写 method asset ref adapter 和 body-free 边界。 |
| secret safe summary 最小内容 | `03/04/05` | 当前只确认 secret ref / safe summary 和 secret 正文禁止入仓。 |
| SDK exposure handoff contract | `03/07` | 当前只确认服务端 exposure boundary 与 `L0-sdk` consumer ref。 |
| event collaboration outbox / topic / payload / retry | `03/07` | 当前只保留 publisher / handoff 配置影响类别。 |
| 量化指标和验收证据格式 | `05-测试方案.md` / `06-验收标准.md` | 当前不得伪造测试证据、run id、evidence alias 或验收签署。 |

---

## 14. 进入下一步条件

- 已明确哪些主要组成部分、入口、adapter、job、worker 和外部接缝受配置影响。
- 已明确 Domain Model、Domain Policy、核心状态机和核心 truth object 只能间接受配置影响,不能直接读取配置。
- 已显式列出禁止配置化边界,覆盖 domain invariant、状态机红线、审计链、事务一致性、安全门禁、Query / Consumer / Job 红线和 forbidden body。
- 已说明配置实现契约交给 `03-详细设计.md` 继续展开,配置填写和校验说明交给 `04-配置设计.md`。
- 未写入配置 key、默认值、JSON / YAML / TOML 示例、环境变量名、secret 名称、产品参数、`RuntimeConfig` 字段、`ConfigError` 枚举、adapter constructor 参数、测试结果、证据 alias、run id 或实现 commit。
- 正式 `projects/L3-capability-hub/02-概要设计.md` 仍未修改。
- 用户确认后才允许进入 Step 12 `详细设计承接清单`。
