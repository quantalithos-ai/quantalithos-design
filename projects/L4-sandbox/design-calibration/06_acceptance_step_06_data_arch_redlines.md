# Step 6. 定义数据边界与架构红线验收

> 对应SOP: `standards/document/验收标准讨论流程_SOP.md` Step 6
> 书写规范: `standards/document/验收标准书写规范.md` §5.6
> 回填章节: `06-验收标准.md` §6 数据边界与架构红线验收
> 生成日期: 2026-07-15
> 状态: completed_reviewed_passed_to_step_7
> 所属流程: `06_acceptance_calibration_flow.md`
> 追溯分件: `06_acceptance_step_06_data_arch_trace_register.md`
> 停审分件: `06_acceptance_step_06_data_arch_review_register.md`
> 本Step口径: 复用canonical `AC-SBX-026~035`,把BR-SBX-001~033、数据归属、依赖裁剪、配置hard guard和P0-Q真实边界资格汇成可检查红线。本文不执行验收,不创建run、EV、报告、缺陷、风险、结论或签署,不修改旧正式`06`,不进入Step 7。

---

## 1. Step状态与Step内计划

| 检查项 | 结论 |
|---|---|
| 用户是否确认Step 5 | 是。用户明确回复“同意”;Step 5三件、flow和项目台账已转`passed_to_step_6`。 |
| 项目 /文档 /Step门禁 | 通过。当前只允许Step 6;正式`06`与Step 7仍禁止写入 /创建。 |
| 是否读取Step 6标准 | 是。已读取验收SOP Step 6和书写规范§5.6。 |
| 是否读取范围与功能门禁 | 是。已复核Step 2的AG / ASCP、P0-C / P0-Q和接缝边界,以及Step 5的18项功能门禁与后续责任保留。 |
| 是否读取正式来源 | 是。已复核正式`00` BR /数据 / AC / VF、`01`职责 /依赖 /数据所有权、`02`组成部分 /对象 /异常、`03`模块 /对象 /持久化 /绑定、`04`NCFG / sensitive / AHG / VETO-CFG和`05`TC / suite / ESLOT / report。 |
| 是否读取粒度参考 | 是。已读取L1-governance / L1-artifact验收Step 6;只参考红线表、闭环矩阵、停审和跨红线审计结构,不继承领域结论。 |
| 旧正式`06`定位 | historical material。旧session / command五段主线、host runtime环境、泛化API / DB / trace证据、三红线和空checkbox不得继承。 |
| canonical编号选择 | 复用`AC-SBX-026~035`;不创建平行`AC-SBX-DATA-*`。`AC-SBX-031`只裁决architecture assertion slice,协议完整性留Step 7。 |
| 是否发现阻塞Step 6的上游冲突 | 否。10项canonical AC均有正式规则 /数据 /设计 / TC / planned slot;目标仓和P0-Q环境缺失只阻塞执行,不阻塞门禁设计。 |
| 当前真实验收状态 | `NotEntered`;目标仓、fixed source run、raw / report、runtime EV和acceptance review均不存在。 |
| 当前Step状态 | 主件、追溯分件、停审分件及机械 /语义审计已完成;用户已明确回复“同意”,Step 6审查通过并放行Step 7。 |

### 1.1 Step内计划

| 模块 | 内容 | 状态 | 完成门禁 |
|---|---|---|---|
| M1 owner /编号 /phase边界 | 固定truth、snapshot、ref、forbidden body和AC-SBX-026~035 owner | done | 无平行AC;无Step 7 /8 /10吞并 |
| M2 数据与架构红线 | 建立RL-SBX-001~016可检查红线 | done | 每项有通过 /失败 /证据来源 |
| M3 canonical AC闭环 | 绑定设计、TC、planned ESLOT、future EV / report及裁决影响 | done | 10 /10可判定 |
| M4 单项停审 /跨红线审计 | 检查truth污染、依赖、产品反定义、双轴替代、配置与敏感材料 | done | 无orphan、冲突或越级裁决 |
| M5 回填草稿 /自检 /停审 | 形成正式§6草稿并更新两层台账 | done_reviewed | 用户已确认;`passed_to_step_7` |

### 1.2 模块级门禁

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|
| M1 owner /编号 /phase | done | done | done | done | pass | pass | 由M2接续 |
| M2 红线表 | done | done | done | done | pass | pass | 由M3接续 |
| M3 AC闭环 | done | done | done | done | pass | pass | 由M4接续 |
| M4 停审 /跨红线审计 | done | done | done | done | pass | pass | 由M5接续 |
| M5 回填 /总审 | done | done | done | done | pass | passed_to_step_7 | 用户已确认;由Step 7接续 |

---

## 2. 本步目标与边界

### 2.1 本步必须完成

1. 固定execution isolation truth、外部safe snapshot、typed ref和forbidden body四层数据边界,不让技术载体或下游状态成为第二真相源。
2. 把唯一sibling compile dependency、模块依赖方向、product-neutral domain、coherent四维边界和backend outcome边界变成可检查红线。
3. 把配置不得改变truth owner / hard guard、敏感material全carrier零raw和unsupported surface必须DesignReopen变成验收条件。
4. 对`AC-SBX-026~035`逐项闭环正式设计、正负TC、planned ESLOT、future runtime EV、fixed report、通过 /失败条件和裁决影响。
5. 区分P0-C contract/static证明与P0-Q fixed candidate真实资格;两者不得互替,也不得由P1 / P2补偿。

### 2.2 本步不完成

- 不裁决55协议逐项存在、schema兼容、event消费 /重放和job同步;它们由Step 7裁决。
- 不裁决31 canonical enum entry逐迁移、UoW、幂等、19 race、stored replay和事务一致性;它们由Step 8裁决。
- 不定义性能、可用性、审计等六类NFR总体门禁;它们由Step 9裁决。
- 不把raw / report pairing、digest、review和evidence integrity本身展开为总体证据门禁;它们由Step 10裁决。
- 不正式分配`VETO-SBX-*`;本Step只记录VF-SBX / VETO-CFG候选影响,正式否决索引由Step 11唯一收口。
- 不选择Docker、gVisor、Firecracker、k8s、provider、store、bus、sink、alert或retention介质。
- 不拥有tools semantic execution、runtime agent loop、member lifecycle orchestration、Artifact truth、observability store、policy / approval / capability truth或后端产品生命周期。

---

## 3. 本步输入

| 输入 | 当前状态 | 本Step用途 |
|---|---|---|
| `06_acceptance_step_02_scope.md` | reviewed | 提供ASCP-SBX-018 truth / dependency范围、P0双轴、接缝与P1 / P2防污染 |
| Step 5三件 | reviewed | 保留18项功能owner,避免把功能结果或后续Step职责重复计入本Step |
| 正式`00` §2 / §6 / §10 / §11 / §14 | current reviewed | 提供非职责、依赖、BR-SBX-001~033、四层数据归属、AC-SBX-026~035和VF-SBX-001~010 |
| 正式`01` §3 / §4 / §8 / §9 / §13 | current reviewed | 提供不可变约束、职责红线、依赖方向、数据所有权、coherent boundary和横切红线 |
| 正式`02` §3 / §5 / §6 / §8 / §10 / §11 | current reviewed | 提供组成部分、对象轮廓、处理流、异常边界和配置影响 |
| 正式`03` §5~§7 / §10 / §13 / §14 | current reviewed | 提供模块依赖、truth / snapshot对象、logical stores、external binding、NCFG和safe carrier |
| 正式`04` §4 / §8 / §9 / §11 / §12 / §14 | current reviewed | 提供NCFG-01~24、sensitive material、atomic generation、AHG-04 /06 /07 /08 /13~19和VETO-CFG |
| 正式`05` §5 / §6 / §8~§10 / §13 | current reviewed | 提供canonical覆盖、254 TC、16 suite、四源run、21 ESLOT和fixed report路径 |
| 全局依赖裁剪标准 | current | 固定compile / runtime / event类型;L4-sandbox仅编译依赖L0-core、运行依赖isolation backend |
| 旧正式`06` | historical material | 只做污染诊断;不得继承旧对象、环境、证据、阈值、风险或结论 |
| L1-governance / L1-artifact Step 6 | granularity reference | 只参考结构 /粒度 /停审,不继承其truth主语或证据ID |

---

## 4. SOP问题回答

| SOP问题 | 回答 |
|---|---|
| 哪些数据不得由本仓保存? | actor / member / project / work / runner / tool semantic / runtime recover、policy / approval / allowlist / capability、host / cluster / member binding、Artifact / baseline / evidence、observability store、conversation / UI、operator replay UI、raw audit store及外部SDK / provider正文不得保存为Sandbox truth。只允许正式typed ref、body-free safe snapshot、safe marker或handoff ref。 |
| 哪些下游不得反向改写真相? | tools、runtime、member-service、runner、artifact / archive、observability、investigation、console以及isolation backend / provider均不得创建、批准、覆盖或删除Sandbox的context、boundary、policy decision、run / capture / handoff、failure / control / cleanup / redline truth。receipt、backend success、telemetry或UI状态都不是truth writer。 |
| 哪些projection / cache不得反写真相? | query view、projection、derived inspect / preview / trend、reconciliation report、runtime adapter state、capability cache、policy snapshot、reference refresh、relay / handoff retry和job report只能读truth或写自己的snapshot / marker / report;不得修复core truth、重算stored result或解除guard。 |
| 哪些P1能力不得污染P0? | PROFILE-06 durable / real-like、真实bus / sink / provider、跨仓联合E2E、physical rollout / rollback / drift和量化SLO只在正式激活后单独裁决;不得替代P0-C或PROFILE-05 P0-Q。PROFILE-07与外围增强保持inactive / DesignReopen。 |
| 红线失败时是否一票否决? | `AC-SBX-026~035`任一mandatory assertion失败均阻断通过 /有条件通过。命中VF-SBX-002~010或VETO-CFG-01~16适用候选时转Step 11正式裁决;本Step不提前创建VETO编号或填写命中事实。 |

---

## 5. 当前文档与historical material问题诊断

| 位置 /材料 | 当前问题 | 本Step处理 |
|---|---|---|
| 旧正式`06` §1 / §4 | 以`SandboxExecution / SandboxSession / SandboxCommand / SandboxOutput / Control`五段旧主线承载验收 | 全部降级historical;改用正式truth / snapshot / ref / body和六组成部分 |
| 旧正式`06` §2 / §6 | test / staging host runtime、三红线和泛化“可裁剪性”无法证明真实四维或依赖闭集 | 使用四源run、P0双轴、RL-SBX与canonical AC逐项裁决 |
| 旧正式`06`证据列 | API响应、DB记录、trace、compare report无法定位TC、slot或fixed run | 绑定正式TC、planned ESLOT、future EV form和固定suite / evidence路径 |
| 旧正式`06` §7 | runtime / provider / output边界仍使用旧对象且未区分owner、snapshot、ref、body | 建立四层数据边界和相邻仓truth禁止表 |
| 正式`00~05` | 红线来源已完整,但尚未汇成验收裁决小循环 | 复用AC-SBX-026~035,不由`06`新造契约 |
| `AC-SBX-031` | 同时含接口类型与依赖裁剪,若整体在本Step判定会吞并Step 7 | 本Step只拥有ARCH-SLICE;Step 7拥有55协议 /同步slice,两者都闭合后canonical AC才可总体裁决 |

---

## 6. 改动前后对比

| 维度 | 旧口径 | 本Step收稳后的口径 | 原因 |
|---|---|---|---|
| 数据边界 | 泛化execution / output记录 | truth、safe snapshot、typed ref、forbidden body四层 | 可定位具体越权形态 |
| 架构红线 | 三条口号式红线 | RL-SBX-001~016,逐项通过 /失败 /证据 | 红线必须可检查 |
| backend | host runtime / provider桥接成为主语 | backend只返回typed outcome;domain truth保持产品中立 | 技术产品不得反定义需求 |
| 四维隔离 | fs / network / quota / env散列 | resource / filesystem / network / process同代coherent boundary + P0-Q真实probe | 禁止单维抽样或partial success |
| 依赖 | 泛化架构检查 | 仅`core-contracts`可作sibling compile dependency | 对齐全局裁剪规则 |
| 配置 /敏感 | 未进入数据红线 | NCFG hard guard、atomic generation、all-carrier no raw | 防止配置绕过设计红线 |
| 证据 | API / DB / trace泛化 | exact TC / slot / source role / suite / future EV / fixed report | 支持复验和审计 |
| VETO | 安全门禁直接混写 | Step 6记录候选,Step 11正式编号 /传播 | 保持SOP职责分离 |

---

## 7. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 是否创建新红线AC | 复用AC-SBX-026~035,RL-SBX只作本Step检查索引 | 新建`AC-SBX-DATA-*` | 避免平行验收真相源 |
| AC-SBX-031如何分工 | Step 6裁architecture slice,Step 7裁protocol / sync slice | 本Step一次性宣称AC-031闭合 | 防止协议门禁被架构静态检查替代 |
| backend outcome能否成为truth | 只能映射为typed adapter outcome并由domain裁定 | SDK response / backend state直接持久化为truth | 保持product-neutral与可替换性 |
| 是否用单一P0-C证明四维边界 | P0-C裁语义,P0-Q逐维真实施加;二者均mandatory | fake / simulation绿色即隔离通过 | 真实安全风险不能由模型测试替代 |
| 是否要求真实外部正文 | 使用body-free fixture / synthetic marker;禁止生产正文 | 导入真实identity / policy / artifact / secret body验证 | 红线证明不需要污染验收材料 |
| 是否允许P1 / P2补证据 | 不允许;激活后形成独立mandatory scope | durable / staging / production结果补P0缺口 | 防止证明轴和profile污染 |
| 是否在本Step定VETO | 只记录VF / VETO-CFG候选影响 | 直接分配VETO编号或写命中结论 | Step 11才是正式owner |

---

## 8. 结构化中间产物

### 8.1 数据与架构红线验收表

`RL-SBX-*`是本Step检查索引,不是新的需求AC、VF、VETO或runtime evidence ID。每条红线必须通过其适用TC / assertion slice形成可定位结果,不能靠架构评审文字单独判定。

| 红线ID | 红线 | 通过条件 | 失败条件 | 主要证据来源 |
|---|---|---|---|---|
| RL-SBX-001 | execution isolation truth独立归属 | context / identity、boundary / handle / lease、policy execution decision、run / capture / handoff、failure / control / cleanup / redline均由正式Sandbox对象与owner flow承载 | 调用方、backend、receipt、telemetry、UI或下游状态创建 /覆盖上述truth | CMD-001~020适用;STA-001~019;ESLOT-002~006 /011 /015 |
| RL-SBX-002 | 相邻仓业务truth不得入Sandbox | tools、runtime、member、identity、work、artifact、observability、governance / capability只提供typed ref、safe summary、marker或handoff outcome | ToolDefinition / semantic result、ExecutionInstance、member lifecycle、Artifact / observability / policy truth成为Sandbox字段、状态或writer | ARCH-003;CTR-001~003;CMD / CNS负向;ESLOT-001 /002 /016 |
| RL-SBX-003 | safe snapshot只服务稳定判断 | context、capability、policy applicability和handoff / investigation snapshot保留source ref、freshness / resolution并在stale / unavailable时degraded或fail-closed | snapshot变独立truth、无source ref、stale仍allow、refresh job补造source truth | CMD-002 /004 /006 /012 /018;QRY-002 /006 /022;JOB-002 /003;ESLOT-002~004 /007 |
| RL-SBX-004 | typed ref不接管外部生命周期 | 每个外部关系使用正确ref family,只记录resolution / receipt / marker,正文生命周期仍归外部owner | 错ref family被猜测转换、Sandbox创建外部ID正文、删除 /批准 /关闭外部对象 | CTR-001 /002 /005;CMD-001 /002;CNS-001 /002;CONF-011;ESLOT-001 /002 /019 |
| RL-SBX-005 | forbidden external body与raw material零入仓 | public carrier、truth、snapshot、audit、relay、report、error、log、metric、handoff、workload只含opaque ref / digest / safe summary | 任一identity / work / policy DSL / tool result / runtime recover / artifact / observability / UI正文、SDK response、process output、secret或full sensitive ref被保存 /回显 | CTR-006;CMD-002 /008 /010 /020;CFG-009 /030;CONF-008 /013;ESLOT-001 /005 /015 /019 |
| RL-SBX-006 | resource / filesystem / network / process同代coherent boundary | 四维requirement、capability、decision、handle、template / generation和environment identity一致;P0-Q逐维真实probe满足声明 | 任一维缺失 /跨代 /unsupported / ignored仍launch,或只证明单维就声明coherent | CMD-003 /004;CFG-010 /016 /018;CONF-001~006 /011 /012;ESLOT-003 /013 /017 /019 |
| RL-SBX-007 | backend与运行载体不得反定义domain truth | domain使用产品中立对象;infra只把SDK结果映射为typed `IsolationBackendAdapterOutcome`;backend unsupported / unclassified整体拒绝 | Docker / gVisor / k8s等产品名进入domain invariant,raw backend state成为truth,或backend success绕过Sandbox decision | ARCH-003;CMD-003 /004 /007 /008;ERR-006 /007 /029~032;CONF-006 /012;ESLOT-003 /012 /016 /019 |
| RL-SBX-008 | policy来源truth与执行裁定分离 | Sandbox只消费body-free policy / authorization / capability snapshot并拥有本次execution decision;missing / stale / conflict / unsupported fail-closed | Sandbox定义allowlist / approval / policy DSL / capability truth,或technical Degraded /旧decision授权launch | CMD-005 /006 /008;CFG-008 /018;ARCH-003;CONF-004 /006 /012;ESLOT-004 /013 /016 /017 /019 |
| RL-SBX-009 | capture / handoff不转移下游truth ownership | `CaptureFact` / `HandoffFact`只保存material refs、safe summary和owning status;target receipt不回滚source也不升格Artifact / observability truth | raw output入truth、receipt宣布formal artifact / evidence / observability truth、target失败回滚capture | CMD-009~012;CNS-013~020;JOB-004;CFG-021;CONF-008 /013;ESLOT-005 /009 /015 /018 /019 |
| RL-SBX-010 | failure / control / cleanup不得重写外部truth | safety flow只改变Sandbox-owned failure、control、lease / orphan、guard和containment;恢复使用新事实并保留因果ref | replay / cleanup / reaper修改runtime / artifact / governance / policy truth,或重算旧receipt / report / stored result | CMD-013~020;JOB-005~007 /011;CFG-022 /023 /026;CONF-009 /010;ESLOT-006 /010 /018 |
| RL-SBX-011 | query / projection / derived / reconciliation / job no-write / no-repair | Query write UoW为0;projection / job只写owning derived marker / report;missing保持正式degraded surface | Query refresh / rebuild / audit append,job修core success truth,projection / report成为truth source | QRY-001~026;JOB-008~012;CFG-019 /023;ESLOT-007 /008 /015 |
| RL-SBX-012 | sibling compile dependency闭集 | manifest / metadata证明唯一sibling compile dependency为`quantalithos-core/core-contracts`;runtime / event / handoff关系不进入Cargo path dependency | tools、runtime、member、policy、artifact、observability、bus、backend或任一其他sibling成为package dependency | ARCH-001;dependency check;ESLOT-016 |
| RL-SBX-013 | 模块依赖方向与entry边界成立 | contracts -> core;domain -> contracts;application -> domain / contracts;infra实现application ports;entry只调用facade | domain依赖infra / SDK,application依赖infra / sibling源码,entry直访repository / domain / backend,infra定义第二business trait | ARCH-003;CTR-003;CFG-014 /017;entry / builder mapping;ESLOT-013 /016 |
| RL-SBX-014 | 配置不能改变hard guard或truth owner | NCFG-01~24全部在builder前reject;required composition只发布complete same-generation handles;technical degraded不授权mutation / launch / release | config关闭四维 / fail-closed / audit / no-write / cleanup / redline / redaction,或发布partial / mixed generation | CFG-005 /008 /011 /014~018 /022;ESLOT-013;适用ESLOT-003 /004 /006 |
| RL-SBX-015 | sensitive material仅以opaque ref + bounded lifecycle使用 | S04仅在review后解析;class / slot / consumer / lease / expiry / revoke / release身份一致;all-carrier synthetic scan为零泄漏 | raw secret / full ref / provider body进入任一carrier,stale / revoked / wrong consumer继续使用,或fake / host fallback取得资格 | CFG-009 /012 /013 /030;CONF-013;ESLOT-015 /018 /019 |
| RL-SBX-016 | unsupported和P1 / P2不得污染P0 | S07 / S08、remote / admin、reload / LKG / hot / callback当前absent或正式reject;PROFILE-06 /07与外围能力不补P0 | unsupported被silent ignore / fallback为current snapshot,或real-like / production /外围结果替代P0-C / P0-Q | ARCH-002;CFG-007 /010 /029;COND-001~003 /005;ESLOT-016 /020 /021 |

### 8.2 数据归属四层闭集

| 层级 | Sandbox允许拥有 /保存 | 必备约束 | 禁止替代 |
|---|---|---|---|
| Sandbox truth | 正式受理 /拒绝与归责、execution environment identity、boundary decision / coherent boundary / handle / lease、policy execution decision、run / capture / handoff、failure / control / cleanup guard / redline containment、formal audit / relay / idempotency own facts | 只能由正式owner flow显式变化;version / audit / marker按正式设计闭合 | backend outcome、log、receipt、projection、外部状态或UI不得代替 |
| Safe snapshot | caller context、backend capability、policy applicability / authorization、handoff / investigation状态的body-free摘要 | 保留source ref、scope、freshness / resolution;stale / conflict / unavailable显式传播 | 不形成独立生命周期,不被缓存命中写成Accepted / Allowed |
| Typed reference | identity / work / runner / tool / runtime request、backend / workspace source、policy / approval / capability、artifact / observability / investigation / target refs | ref family严格;只记录关系 / resolution / receipt;不负责外部正文生命周期 | page cursor、version、timestamp、digest、字符串或本地复制对象不得冒充ref |
| Forbidden body | actor / member / project / work / runner、tool semantic、runtime recover、host / cluster / member binding、policy DSL / allowlist / approval、Artifact / baseline / evidence、observability store、conversation / UI、operator replay、raw audit、SDK / provider / process output正文 | 在entry、config、adapter、persistence、audit、relay、report、log / metric和验收artifact全链拒绝 /脱敏 | 不因debug、失败调查、qualification或真实provider而例外 |

### 8.3 相邻仓、运行载体与派生面责任边界

| 对方 /派生面 | Sandbox允许的接缝 | 不得反写 /拥有 | 验收观察点 |
|---|---|---|---|
| `L2-tools` | tool / launch safe ref、policy decision消费、failure / capture返回 | ToolDefinition、ToolPolicy、semantic execution、InvocationResult / AuditEntry truth | ARCH-003;body-free carrier;统一launch guard |
| `L2-runtime` | formal execution request ref、Sandbox结果 /failure /control反馈 | ExecutionInstance、CurrentStep、agent loop、checkpoint / recover、runtime result truth | no runtime state field / writer;timeout / replay不推进agent loop |
| `L2-member-service` | host binding ref、bounded launch /release /failure接缝 | member host、session / worker / health / callback lifecycle与SandboxBinding truth | backend / lifecycle outcome不能接管member truth |
| identity / work / runner | actor / context / responsibility typed refs与safe summary | identity、project / work、product UI / invocation truth | missing / wrong ref显式拒绝,不补造正文 |
| governance / capability / policy owner | body-free applicability / authorization / capability summary | policy DSL、approval、allowlist、capability与risk taxonomy truth | stale / conflict / unsupported fail-closed |
| Artifact / archive | candidate / material / capture refs与handoff marker | Artifact fact / version / baseline / evidence / retention truth | receipt不升格;handoff失败不回滚capture |
| observability / investigation | safe audit / trace / metric / diagnostic / investigation handoff refs | telemetry store、audit store、investigation case truth | telemetry不替代formal audit;receipt不解除containment |
| isolation backend / provider | typed capability、lifecycle、capture / inspect / release和material outcome | Sandbox domain truth、policy truth、产品生命周期或qualification结论 | raw outcome禁止;unclassified / partial整体拒绝 |
| Query / projection / derived / report / job | body-free view、snapshot / marker、stored report、owning status | core truth、外部truth、旧stored result或历史报告 | write UoW / repair调用为0或只写owning derived surface |

### 8.4 依赖与product-neutral架构红线

| 检查面 | 必须成立 | 失败判定 |
|---|---|---|
| 跨仓依赖类型 | 仅`core-contracts`是sibling compile dependency;bus为event;context / policy / backend / handoff / store为runtime adapter | 运行期 /事件关系进入Cargo或本地复制shared type |
| 七模块依赖方向 | `contracts <- domain <- application <- infra / entry`按正式矩阵单向依赖;entry经application facade | 逆向依赖、entry直访repository / domain、infra自造business port |
| Domain词汇 | 使用`CoherentBoundary`、typed decision / outcome、opaque refs和产品中立状态 | domain / public协议出现产品名、endpoint、topic、SDK response或部署拓扑 |
| Backend outcome | infra完成raw -> typed outcome映射,domain再做正式decision / state transition | backend success直接成为Coherent / Accepted / Released / Qualified |
| 四维coherence | resource / filesystem / network / process绑定同一context、template、generation、candidate和environment identity | 单维或跨代结果汇总成coherent,unsupported仍launch |
| Current unsupported | remote / admin / reload / LKG / hot swap / immediate callback无current public / config surface | 新surface被silent ignore、alias或fallback;应DesignReopen却继续验收 |

### 8.5 配置、敏感材料与Profile防污染

| 门禁方向 | P0通过条件 | 失败条件 | 来源 |
|---|---|---|---|
| hard guard不可配置化 | NCFG-01~24及truth owner、四维、fail-closed、audit、no-write / repair、cleanup、redline、redaction逐项reject | 任一开关 / source / profile可关闭或放宽hard guard | AHG-04;EHR-05;VETO-CFG-02~04 /07 /09~11 /13 /16 |
| complete generation | required constructor / availability任一失败发布0 handle;complete set同代原子可见 | partial / mixed generation被标Ready / Degraded并供entry使用 | AHG-05 /08;EHR-06 /09;VETO-CFG-06 |
| sensitive no-output | config / DTO / workload / log / metric / audit / report / event / handoff / error全carrier零raw | 任一secret、full ref、provider body、process output或marker泄漏 | AHG-06 /07 /16;EHR-07 /08 /17;VETO-CFG-05 |
| fail-closed runtime | context / policy / capability / boundary / cleanup / redline依赖不完备时相关operation不放行 | technical Degraded授权launch / mutation / release | AHG-13 /14;EHR-14 /15;VETO-CFG-01~03 /09 /10 |
| no truth rewrite recovery | consumer / relay / handoff / recovery只改owning marker / report | source truth、capture、stored result、receipt或旧report被回滚 /重算 | AHG-15;EHR-16;VETO-CFG-08 /11 /12 |
| Profile资格隔离 | PROFILE-01~04只证明P0-C;PROFILE-05是P0-Q唯一主体;PROFILE-06 conditional;PROFILE-07 inactive | fake / seam / staging / smoke替代P0-Q,或P1 / P2结果补偿P0缺口 | AHG-03 /19;EHR-04 /20;VETO-CFG-01 /14 /15 |

### 8.6 AC-SBX-026~035数据 /架构红线门禁

表中TC、ESLOT和suite均为已审设计。未来`EV-SBX-*`只有在真实raw / report / check完整后才可分配;当前10项实际状态全部是`NotEvaluated`,不是Pass / Fail。

| canonical AC | 验收主题 /优先级 | 通过条件 | 失败条件 | 主要TC / planned证据 | 裁决影响 |
|---|---|---|---|---|---|
| AC-SBX-026 | 正式受理与归责边界 / P0-C | context / identity在真实动作前显式建立;source / actor / responsibility使用body-free typed refs;accepted / rejected / unresolved均由owner flow留痕,相邻仓不能补造入口truth | 宿主 /调用方旁路或匿名执行被写formal;外部正文成为context / identity;日志 /缓存事后补造归责 | CTR-001~003 /006;CMD-001 /002;CNS-005 /006;STA-001~003;ESLOT-001 /002 /011 /015 | mandatory失败阻断通过 /有条件通过;VF-002 /005 /009 /010候选 |
| AC-SBX-027 | 隔离与backend边界 / P0-C + P0-Q | P0-C证明四维同代裁定、unsupported整体拒绝和product-neutral outcome;P0-Q固定candidate逐维真实限制且无host / fake / fixture替代 | 任一维silent degrade / ignored /跨代仍launch;backend / SDK response定义truth;forbidden资源 /路径 /网络 /进程动作成功 | CMD-003 /004 /007 /008;STA-004~009;CFG-008 /010 /016 /018;ARCH-003;CONF-001~006 /011 /012;ESLOT-003 /013 /016 /017 /019 | 任一轴Failed / Blocked / missing使该项不成立;VF-001~003及VETO-CFG-01 /02候选 |
| AC-SBX-028 | policy fail-closed与来源边界 / P0-C +适用P0-Q | 只消费body-free policy / authorization / capability snapshot;Sandbox只拥有本次execution decision;missing / stale / conflict / unsupported / unauthorized不launch且新summary需新evaluation | 本仓定义policy / approval / allowlist / capability truth;旧Accepted decision跨snapshot复用;technical Degraded或candidate outcome绕过fail-closed | CMD-005 /006 /008;CNS-007 /008;STA-010~012;CFG-008 /018;ARCH-003;CONF-004 /006 /012;ESLOT-004 /013 /016 /017 /019 | mandatory失败阻断;VF-004 /009和VETO-CFG-03 /04 /16候选 |
| AC-SBX-029 | capture / handoff与下游truth边界 / P0-C +适用P0-Q | output / candidate / usage / audit / observability material分层为safe refs / digest / summary;capture / handoff各自诚实;target / relay失败不回滚source;receipt不升格下游truth | raw process / artifact / telemetry body入仓;capture缺失被日志掩盖;receipt宣布Artifact / evidence / observability truth;handoff失败回滚capture | CMD-009~012;CNS-013~016;EVT-004~006;JOB-004;CFG-009 /021;CONF-008 /013;ESLOT-005 /008 /009 /015 /018 /019 | mandatory失败阻断;VF-005 /006 /010和VETO-CFG-05 /08 /13候选 |
| AC-SBX-030 | failure / control / cleanup / reaper边界 / P0-C +适用P0-Q | stable failure、control、lease / orphan、guard和redline只写Sandbox truth;non-Allowed release为0;新恢复事实保留旧因果;材料 /调查未闭合不删除 | cleanup / replay / reaper重写外部truth或旧result;force release;receipt解除containment;redline advisory-only;未交接材料被删除 | CMD-013~020;CNS-017~020;STA-016~019;JOB-005~007 /011;CFG-022 /023 /026;CONF-009 /010;ESLOT-006 /010 /018 /019 | mandatory失败阻断;VF-007~010和VETO-CFG-09~12候选 |
| AC-SBX-031 | 接口类型与依赖裁剪边界,本Step仅ARCH-SLICE / P0-C | 唯一sibling compile dependency为`core-contracts`;其他关系保持runtime / event / handoff;七模块依赖方向成立;unsupported surface absent / rejected;entry不直访truth / backend | 任一其他sibling进入package依赖;相邻仓源码 /本地复制type进入;domain / public carrier含产品 / endpoint / topic;entry绕application;unsupported被伪装成功 | ARCH-001~003;CTR-003;CFG-007 /008 /014 /017 /029;ESLOT-013 /016 | ARCH-SLICE失败即canonical AC不可通过;协议 /同步slice由Step 7继续裁决;VF-002 /005 /009和VETO-CFG-14 /16候选 |
| AC-SBX-032 | execution isolation truth归属 / P0-C | 正式truth对象与owner repository / flow完整;accepted truth、formal audit和owning marker一致;adapter / projection / report只读或写owning surface | 第二truth writer;backend / log / projection / report替代truth;accepted group缺正式owner fact;外部状态反写Sandbox | CMD-001~020适用;STA-001~019;TXN-001~006;QRY / JOB no-write适用;ESLOT-002~007 /011 /015 | mandatory失败阻断;VF-005 /009 /010及VETO-CFG-07 /08 /11候选 |
| AC-SBX-033 | safe snapshot不反向成truth / P0-C | caller / capability / policy / handoff snapshot均有source / freshness / resolution;stale / unavailable显式degraded或fail-closed;refresh只改reference / projection marker | snapshot / cache自行形成Accepted / Allowed / Coherent / Delivered;无source ref;query / refresh job补造core truth | CMD-002 /004 /006 /012;CNS-005~010 /013~016;QRY-002 /006 /022;JOB-002 /003 /008~010;STA-003 /006 /010 /020~023;ESLOT-002~005 /007 | mandatory失败阻断;VF-003~006 /009和VETO-CFG-03 /08 /11候选 |
| AC-SBX-034 | typed ref不接管外部生命周期 / P0-C +P0-Q identity补强 | public carrier ref family严格;外部对象只存ref / resolution / receipt;cursor / version / digest不混同;P0-Q candidate / profile / generation / environment / material身份连续 | 字符串 /错族ref被猜测接受;Sandbox创建 /删除 /批准外部对象;本地复制shared type;qualification identity缺失仍执行 | CTR-001~005;CMD-001 /002;CNS-001 /002 /005~020适用;ARCH-001 /003;CONF-011~013;ESLOT-001 /002 /011 /016 /019 | P0-C失败或P0-Q适用identity Blocked / Failed均阻断;VF-005 /009 /010候选 |
| AC-SBX-035 | forbidden body禁止入仓 / P0-C +适用P0-Q anti-leak | config、DTO、truth、snapshot、audit、event、receipt、report、error、log / metric、handoff、workload全carrier只含opaque ref / digest / safe summary;synthetic marker泄漏为0 | identity / work / tool / runtime / policy / artifact / observability / UI正文,raw SDK / provider / process output,secret / full sensitive ref进入任一carrier或报告 | CTR-001 /002 /006;CMD-002 /008 /010 /020;CNS-002 /006 /008 /016 /020;ERR-008 /033;CFG-009 /012 /013 /030;CONF-008 /013;ESLOT-001 /002 /005 /015 /018 /019 | mandatory失败阻断;VF-005 /006 /010和VETO-CFG-05 /13候选;不可风险接受 |

### 8.7 Canonical AC证据消费规则

1. `AC-SBX-026~035`的primary evidence item必须直接包含该canonical AC的exact `ac_refs`;若catalog只通过正式TC / CUT / PER链提供补强,必须在验收记录中标注`supporting`,不得伪改evidence item。
2. shared ESLOT / suite只按exact TC、parameter、assertion code和source role证明当前AC。`SUITE-SBX-003 Passed`不能一次性推导AC-SBX-027 /028 /031 /034 /035全部通过。
3. P0-C主证来自MAIN-CONTRACT;MAIN-SEAM和OPS只按适用接缝 /simulation补强。P0-Q只来自P0Q fixed source run的SUITE-SBX-013及qualification identity;ENV-01~04不能替代。
4. `AC-SBX-031`必须分别记录`ARCH-SLICE`和Step 7未来`PROTOCOL-SLICE`;任何一片Failed / Blocked / missing都使canonical AC不可通过。两个Step不能重复计算为两个AC。
5. AC-SBX-027~030 /034 /035含P0-Q适用断言。P0-C绿色但P0-Q Blocked时单项保持`Blocked`或`NotEvaluated`,不得写“架构已通过”。
6. future runtime alias固定为`EV-SBX-<FAMILY>-<NNN>`。本文只引用形式,不分配真实alias;缺slot、raw、report、digest或check时不得静态创建EV。
7. 每项必须能从RELEASE evidence index回到source run suite report与case JSON。`latest`、手写compare report、架构评审意见或旧正式`06`证据列不能替代固定路径。

### 8.8 P1 / P2防污染与DesignReopen规则

| 能力 /范围 | 当前合法用途 | 禁止做法 | 激活 /出现时动作 |
|---|---|---|---|
| PROFILE-06 durable / real-like | conditional P1 parity、outage / rollout / drift或量化selected run | 替代P0-C、P0-Q或把NotRunConditional写Passed | Step 3固定claim / composition / run;按自身mandatory scope裁决 |
| PROFILE-07 production-like | 当前只验证selector / surface absent | 用inactive设计表宣称production ready | 先回写`00~04`,重开`05/06`相关Step |
| remote / admin / reload / LKG / hot / callback | current unsupported negative gate | silent ignore、alias、fallback current snapshot | 立即DesignReopen,不得作为B级residual接受 |
| 多backend /多宿主 /advanced inspect /preview /trend | 外围增强未声明时不参与P0 | 改写coherent boundary、policy、capture /investigation truth | 送验声明触发AC-SBX-024 /025及相关上游重开 |
| 真实provider / bus / sink / alert | P1或P0-Q适用资格的独立证明 | live产品状态成为Sandbox truth或补P0缺slot | 固定产品中立contract和identity后独立执行 |
| 量化SLO / retention TTL | 只有正式来源、workload、介质和owner后才可裁决 | 继承旧数字、趋势样本或配置默认值 | 回写正式阈值owner,再重开测试 /验收相关Step |

---

## 9. 复杂度与分批判断

| 判断项 | 结论 |
|---|---|
| 10个canonical AC能否只用一张短表完整表达 | 否。每项需要正式设计、TC、slot、future EV / report与停审,已拆追溯 /停审分件。 |
| 是否需要继续拆新AC | 否。RL-SBX只作检查索引,canonical AC仍为026~035。 |
| 是否需要修改正式`06` | 否。正式装配只允许Step 15。 |
| 是否需要上游writeback | 否。现有正式`00~05`足以判定;AC-SBX-031用assertion slice解决Step分工,不改义。 |
| 是否需要实施产物 | 否。目标仓、implementation ledger和boundary skeleton仍禁止创建。 |

---

## 10. 正式`06` §6回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_06_data_arch_redlines.md`
> - `design-calibration/06_acceptance_step_06_data_arch_trace_register.md`
> - `design-calibration/06_acceptance_step_06_data_arch_review_register.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“数据与架构红线验收表”“数据归属四层闭集”“AC-SBX-026~035数据 /架构红线门禁”“逐项追溯登记”和“逐项停审 /跨红线审计”,了解本章如何从正式需求、设计、配置与测试证据收敛。

正式§6应收口以下结论:

1. 数据与架构红线复用canonical `AC-SBX-026~035`,不另建平行验收编号;当前所有项均为未执行设计,不得预填Pass / Fail。
2. Sandbox只拥有execution isolation truth。外部数据只允许body-free safe snapshot、typed ref或safe marker;actor / work / tool / runtime / policy / artifact / observability / UI及raw adapter / process / secret正文禁止入仓。
3. tools、runtime、member-service、artifact / archive、observability、policy owner、runner和backend均不得反写Sandbox truth。Query、projection、derived、reconciliation、relay、handoff和job只能写其owning marker / report,不得修复core truth。
4. `core-contracts`是唯一sibling compile dependency。其他仓、bus、backend、provider、store和handoff target只能按runtime / event / handoff关系协作;七模块依赖方向与entry facade边界必须成立。
5. domain和public contract保持产品中立。backend raw outcome必须在infra映射为typed outcome,不能直接定义Coherent / Accepted / Released / Qualified。
6. resource / filesystem / network / process必须绑定同一context、template、generation、candidate和environment identity形成coherent boundary。P0-C与P0-Q都是mandatory,不得互相替代。
7. 配置不得改变truth owner、四维、fail-closed、formal audit、no-write / no-repair、cleanup / redline和redaction hard guard;required generation只能0或完整同代发布。
8. sensitive material只按opaque ref、class / slot / consumer与bounded lease使用,并对config、DTO、workload、log、metric、audit、event、receipt、report、error和handoff执行零raw泄漏门禁。
9. `AC-SBX-031`在本章只裁决ARCH-SLICE;55协议、事件和Job同步slice由§7继续裁决。任一slice失败都使canonical AC不可通过。
10. 红线失败阻断通过 /有条件通过;命中VF-SBX或VETO-CFG候选时交Step 11正式编号和传播。P1 / P2、外围增强、旧报告或风险接受不能补偿P0红线失败。

正式§6门禁表使用本文件§8.6并保留追溯分件入口。Step 15装配时不得把planned ESLOT写成真实EV,不得把`PassDesign`写成runtime通过,也不得删除P0-Q Blocked传播。

---

## 11. 上游影响、blocker与待确认事项

### 11.1 对上游正式文档的影响判定

| 上游 | 复核结果 | 是否回写 | 结论 |
|---|---|---:|---|
| 正式`00` | BR-SBX-001~033、四层数据归属、AC-SBX-026~035和VF-SBX-001~010完整 | 否 | 无需求 /数据owner断链 |
| 正式`01` | responsibility、依赖类型、data ownership、coherent boundary、product-neutral和no reverse truth完整 | 否 | 无架构冲突 |
| 正式`02` | 六组成部分、对象 / flow、异常和配置影响保持相同owner边界 | 否 | 无概要断链 |
| 正式`03` | 七模块、truth / snapshot / ref对象、logical store、binding、NCFG和safe carrier足以落断言 | 否 | 无详细设计断链;exact对象细节可回校准分件 |
| 正式`04` | NCFG / AHG / EHR / VETO-CFG、sensitive与profile资格支持红线裁决 | 否 | 无配置冲突 |
| 正式`05` | AC 026~035覆盖、TC、suite、ESLOT和fixed path完整;shared slot可按assertion slice消费 | 否 | 无测试 /证据设计断链 |

当前判定:`no_upstream_writeback_required_for_acceptance_step_6`。

### 11.2 Blocker处理

| Blocker | 状态 | 阻塞什么 | 不阻塞什么 |
|---|---|---|---|
| SBX-ACC-DATA-ARCH-001 | resolved_reviewed_passed_to_step_7 | 原数据 /架构红线汇总缺口已关闭,且用户已确认 | Step 7已获放行 |
| SBX-ACC-DELIVERY-001 | open_for_delivery_baseline | 真实subject、dependency graph和fixed source run | 红线门禁设计 |
| SBX-ACC-EXECUTION-001 | open_for_07_precheck_and_execution | target manifest、suite、scanner和adapter实现 | 静态 /运行断言设计 |
| SBX-ACC-EVIDENCE-001 | open_for_runtime_evidence | runtime item、单项Pass / Fail与总体裁决 | planned evidence消费规则 |
| SBX-ACC-P0Q-001 | open_for_p0q_execution | candidate四维、lifecycle和anti-leak真实资格 | P0-Q谓词与Blocked传播设计 |
| SBX-DDD-RISK-CONTRACTS-001 | open_for_07_precheck | `core-contracts` exact shared type可用性与实际path | 当前唯一compile dependency门禁设计 |
| SBX-ACC-DESIGN-REOPEN-001 | blocker_if_triggered | 新public / config / product surface或不可判定契约 | 当前formal scope的10项收口 |

当前没有阻塞Step 6设计收口或未来Step 7设计的未解决上游blocker。开放项阻塞真实送验、执行、证据、P0-Q或最终裁决,不得把缺失改写为N/A / Passed。

### 11.3 待确认事项

| 待确认事项 | 当前处理 | 触发时动作 |
|---|---|---|
| `core-contracts` exact package / types在目标仓是否可用 | 当前只保留正式唯一依赖契约 | `07` precheck核对;缺失则登记上游blocker并回写`03/05/06`,不得本地复制 |
| 固定candidate / capability / template / lab / provider | 当前不存在;P0-Q保持Blocked | `07/09`选择并形成immutable qualification packet后执行 |
| AC-SBX-031 Step 7 protocol slice | 当前只完成ARCH-SLICE | Step 7逐55协议 /同步裁决后合并canonical disposition |
| PROFILE-06 /07或外围能力是否进入某次claim | 当前未声明,不参与P0 | Step 3未来batch固定claim;激活则升级mandatory或DesignReopen |
| 物理retention / store / backend产品 | 当前不选择,不影响truth owner设计 | `07/09`选择时必须保持本Step红线,不得以产品限制放宽guard |

---

## 12. 自检与停审门禁

| 自检项 | 当前结论 |
|---|---|
| SOP五问是否逐项回答 | 通过;5 /5 |
| 数据边界是否包含truth / snapshot / ref / forbidden body | 通过;四层闭集 |
| 架构红线是否可检查 | 通过;RL-SBX-001~016均有通过 /失败 /证据 |
| AC-SBX-026~035是否全部形成小循环 | 通过;10 /10 |
| 每项是否有正式设计、正负TC、slot、future EV / report | 通过;见追溯分件 |
| 每项是否完成设计停审 | 通过;10 /10 `PassDesign`,不等于runtime通过 |
| AC-SBX-031是否避免吞并Step 7 | 是;ARCH-SLICE与PROTOCOL-SLICE分离 |
| P0-C / P0-Q是否互相替代 | 否;适用项双轴均mandatory |
| P1 / P2 /外围是否污染P0 | 否;conditional / inactive / DesignReopen边界明确 |
| 是否拥有相邻仓truth或后端产品语义 | 否 |
| 是否提前裁决Step 8 /10 /11 | 否;状态一致性、evidence integrity和正式VETO均保留owner |
| 当前事实是否诚实 | `NotEntered`;0 target run / EV / report / review /结论 |
| 是否修改正式`06`、创建Step 7或实现产物 | 否 |

本Step已完成机械 /语义自检并停审。用户已明确回复“同意”,本Step、flow和项目台账转`passed_to_step_7`;现在只允许读取验收SOP Step 7、书写规范§5.7及协议 /事件 /同步来源并创建Step 7中间产物。

Step 7完成并经用户确认前禁止进入Step 8、修改正式`06`、创建`07` / implementation ledger / boundary skeleton,或生成真实run、EV、risk acceptance、结论与签署。

| 恢复字段 | 当前值 |
|---|---|
| current / gate | `06-验收标准.md` Step 6;`completed_reviewed_passed_to_step_7`;`passed_to_step_7` |
| user review | 用户已明确回复“同意”;只记录设计Step放行,不表示runtime验收通过 |
| next | 读取Step 7标准与输入,创建接口、事件与跨仓同步验收中间产物 |
| prohibited | 正式正文、Step 8、真实执行 / evidence、implementation ledger、boundary skeleton;`commit_required = no` |
