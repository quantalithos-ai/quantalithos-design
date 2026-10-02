# 07 Step 8：配置、环境与外部依赖准备

## Step 状态

| 字段 | 值 |
|---|---|
| status | completed / selfcheck_done / stop_review |
| gate_status | pass (design-only) |
| gate_reason | 本Step结构化/定向回修及正式传播已完成；Step13实际文档静态核验通过，见07_implementation_static_review_record.md；仅design，不表示实施或资格 |
| next_allowed_action | waiting_user_confirmation |
| source_files | Step3/5/6/7；03 §3/4/13/17、04 §6～11；05环境/自动化；九owner正式03/07 |

### Step 内计划

| 项 | 状态 | 产物 |
|---|---|---|
| 来源/9问题/诊断/取舍 | done | 以下逐项 |
| 七字段/profile/compile-runtime | done | 映射/依赖/环境表 |
| 复杂度/回填 | done | 仅typed绑定导航，不复制schema |
| 自检/停审 | done | Step13实际文档静态核验通过；外部资格/实施Gate不通过 |

## 本步目标

明确targetrepo/toolchain/PG与compile、runtime、future依赖；配置只装配，不成为业务authority。

## 本步输入

[Step7](07_implementation_plan_step_07_test_acceptance_gates.md)完整门禁成熟度；正式03配置契约与[04 Step7](04_config_step_07_item_inventory.md)的正确七字段表，04配置策略；九owner当前正式03consumer与07前置/配置/完成段及必要台账。上游设计/代码局部进度不等于本项目资格。

## SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1. 哪些外部服务或仓是实施前置依赖。 | Corecontracts/SDKclient+contracts编译path，PG17/SQLx0.8与工具链；owner runtime经SDK；targetrepo当前不存在。 |
| 2. 哪些依赖只在特定阶段需要。 | 01-a前置compileexport/工具，02-a上下文/ports/fake，02-bPG，03-a来源/review，03-bprojection，04receiver/notice，05Obs，06selectedadapter。 |
| 3. 哪些配置项必须在本地或 CI 环境准备。 | strict JSON envelope选择器与六域/七RuntimeConfig、八slot、profile/secretref；Webapi_base单独build-time，不用原型9090作为生产默认。 |
| 4. 是否允许 fake / mock，允许到什么阶段为止。 | fake仅test/controlled，用相同typedports/UoW/schema；staging/production不fallback，任何层不得以fake证明正式ownerpositive。 |
| 5. 外部依赖不可用时是暂停、降级还是替代。 | compile缺依赖阻build，PG缺阻durable；slot无exact资格Blocked，potentialcommit无probe等待，local负例不改selected状态。 |
| 6. 哪些依赖需要由其他团队或仓提供。 | exactexport/immutableasset/basis/Gov/current/pubscope/receiverprobe/notice/producer由正式owner提供；不委派agent/越权修改owner台账。 |
| 7. 已实现仓库依赖是否已经在 `/home/aris/Projects` 下存在。 | 只读ls核Corecontracts、SDKclient/contracts三路径存在，Marketplace不存在；目录存在不证明Cargo/export/currentconsumer资格。 |
| 8. 哪些依赖是编译期依赖，Cargo 本地 path dependency 写法是否已经与详细设计一致。 | rootworkspace.dependencies按03 path；membersworkspace=true，未冻结privategit/rev不改dependency策略；owner不是Cargo。 |
| 9. 哪些依赖是运行期依赖或事件协作依赖，应该使用 API / SDK / adapter / event / projection / fake，而不是 Cargo path dependency。 | runtime owner经SDKadapter/typedrefs、读投影由本地typedplan维护；0activeevent/outbox、不directBus，未来新增先回设计。 |

## 当前文档问题诊断

旧07把JSON叶子kind/configuration_ref当两个字段而漏default_locale；正式04 §7.1亦有“前七服务字段”误句，但04 Step7/03 §13正确。属于本项目truth冲突，已先更新04 flow/Step7/项目台账，再仅修04句，数量/实际schema不变。target目录缺失不能写作真实workspace。

## 改动前后对比

| 项 | 前 | 后 / 理由 |
|---|---|---|
| 七字段 | JSON七leaf，漏locale | Rust七字段及owner_bindings整体/default_locale |
| 路径 | 只“可能不存在” | 只读三compile路径存在、target不存在；不推qualification |
| 依赖 | owner混compile | compile/Core SDK与runtime/SDKadapter分开 |
| fake/profile | 测试可冒positive | controlled/test only，staging/production禁止fallback |

## 设计取舍

不用默认配置填资格、不让URI声明Bound，不新增server字段/hot/admin/业务bypass，0.0.0.0:9090仅draft原型，无正式生产默认。Billing/Archive/event不因formal07存在而启动。

## 结构化中间产物

### RuntimeConfig 与 JSON 映射

| JSON输入 | RuntimeConfig字段 | 说明 |
|---|---|---|
| api.bind | api_bind | 服务startup |
| storage.postgres_config_ref | postgres_config_ref | opaque ref，非raw DSN |
| sdk.profile_ref | sdk_profile_ref | 正式profile ref |
| owner.bindings[].kind + configuration_ref | owner_bindings | entry整体，不能计为两个Runtime字段 |
| worker.batch_limit | worker_batch_limit | checked limit，不编造默认budget |
| worker.lease_millis | lease_millis | checked-add，不声明TTL/GC |
| web.default_locale | default_locale | En/Zh，仅展示默认En |
| web.api_base | 不进入RuntimeConfig | Web build-time VITE_MARKETPLACE_API_BASE |
| schema_version / profile | 不进入RuntimeConfig | loader envelope metadata |

七字段不是前七JSONleaf。八slot固定Source/Publisher/Material/Governance/Scope/Receiver/Notice/Observation；validator按exactconsumer/provider/currentauthority计算Bound/Blocked/Disabled，文件不能自写disposition。

### 外部依赖准备表

| 依赖 / source | 类别 | 最早使用点 | 提供方 / exact前置 | 不可用姿态 |
|---|---|---|---|---|
| Core contracts | compile-time sibling | 01-a | ../quantalithos-core/crates/contracts；package/export/wire/lock真实核验 | 缺失阻build，不local复制Core |
| SDK client/contracts | compile-time sibling | 01-a / 06-c | ../quantalithos-sdk/crates/client、contracts；typed SDK export/version | genericcall不证明exact consumer；adapter blocked |
| Rust2024/MSRV1.93/Node22.12+ | toolchain | 01-a / 06-b | 目标仓真实版本/lock/fmt/lint/typecheck | 未核不能buildclaim |
| PG17/SQLx0.8 | local durable/runtime+library | 02-b | real isolated PG/schema/Row/Tx/CAS/provider ref | PG gate blocked，fake不替证明 |
| Method/Hub/Images/Artifact | runtime via SDK | 03-a/03-b/04-a/06-c | ownerimmutable ref/version/digest/visibility/eligibility，正式material种类/current | MP-UP-001/004；不复制body或血缘 |
| Identity/Publisher/Scope | runtime via SDK | 03-a及全部scope | AIactor与human/org/auth分开；current授权，不从ref猜scope | MP-UP-003；pub/auth/Verified不可造 |
| Governance | runtime via SDK | 03-a/06-c | 正式decision/basis/application/source/material/scope/current匹配 | MP-UP-002/MP-SRC-010；ACK/扫描签名不approval |
| Receiver | runtime via SDK | 04-a/06-c | originalintent/version/consumer/scope/materialization/probe | MP-UP-005；no dispatch/Unknown/waiting |
| Notice | runtime via SDK | 04-b/06-c | target/channel/formalreceipt+probe/current | MP-UP-007；localstop可存，不delivered/read |
| Observation | conditional runtime via SDK | 05-b/06-c | producer/redaction/admission/receipt防递归 | MP-UP-008；localaudit不evidence |
| Archive | future runtime | none | 无market source lane/restore authority | no writer/restore |
| Billing/支付/订阅/分成/跨境 | future runtime | none | 无正式owner/transaction truth | MP-UP-006 future；不能paid/settled |
| Bus/canonicalevent/outbox | event协作future | none | 当前0active；未来SDK/canonicalschema先闭合 | no Cargo/directBus/newpayload |

### 配置与环境矩阵

| Profile | 允许范围 | 实际前置 | 禁止声明 |
|---|---|---|---|
| local | loader/shape/局部负例、Web联调 | strict parser；无PG则durableUnavailable | 真发布/审核/分发/ready |
| test | unit/contract/fault/realisolatedPG/controlled | deterministic seeds/同portfake/actualPG | ownerpositive/生产SLO |
| staging | 指定formal-selected接缝 | exactqualified provider/SDK/current/PG及redaction | 全市场ready、验收/部署签核 |
| production | 完整正式服务（未来条件） | PG/八slot正式合同/provider/no fake | 当前可部署、安装/支付完成 |

CI复用test，不引入第五业务profile。server startup生效，Webapi_base build-time；only locale可展示默认En。任何unknown/duplicate/secret/illegalref/unsafebatchlease fail-fast/fail-closed；秘密只providerref，不DSN/token/privatekey进JSON/domain/log/argv/Web/report。

### 各最早使用点前置检查

| Boundary族 | 前置 / Required checks | 未满足 |
|---|---|---|
| 01-a/b | repo授权/immutablebaseline/export/toolchain、loader/七字段/四profile/rawtools | 禁止编码；plannedwaiting |
| 02-a/b | ports/runner/UoW/fake同面、realPG/migration/codec/锁/typedplan/as-of | durable阻断，不fake替 |
| 03-a/b | exactsource/pubscope/Gov/material或明确testnegative；fourplan/currentdisclosure | selectedblocked，不能自行qualification |
| 04-a/b | Listed/bodyfreeversion与permission/receiverprobe/notice/current | neweffect blocked，不盲重发 |
| 05-a/b | 原result/report/typedrecovery/Obsproducer防递归与safehandoff | missingwaiting，local非evidence |
| 06-a/b/c | 49flow完成/37route/12Job/Webprotocol、SDKeightmapping | exact缺失Blocked；API/Worker不直repo |
| 07-a/b | full11/98+subcase，六artifact/seal与reviewer | incomplete不handoff，草稿不signoff |

### 上游读取资格说明

本轮补读九owner正式07的前置/配置/完成适用段；其不同profile、boundary数、adapter/Archive/event契约只能解释owner，不能照搬本项目。SDK/Identity/Gov项目设计台账未找到不等于owner实施台账缺失（Identity implementation ledger存在）；Hub fixed-reason repair anchor、ImagesB01/B02/consumer、Obsaffected/open保持；Archive没有marketlane。没有任何owner正式接受本地MP-UP编号。

### Fake / unavailable 纪律

testfake实现同typed schema/get/save/version/UoW/current/selector/outcome分类，不能用private map补字段；生产不引用fake，staging不用fake替positive。PG、Core/SDK、receiver/probe、notice/Obs各按其真实不具备姿态，配置仅资源/参数，不改变正式state/AC/VETO。

## 回填草稿

正式§8列依赖分类/profile、七字段映射、fake/失败；§3保留只读路径事实及qualification上限。04最小修句不新增接口或配置。

## 待确认事项

immutablebaseline/真实工具/targetrepo/export/provider/auth/current资格/PG预算仍waiting；每项最早使用点前真实二次确认，不在设计仓执行装配或写秘密。

## 进入下一步条件

七字段与正式03/04/calibration一致，Step13已实际核验映射和链接；target及任何profile实际不可用不冒通过。

## 停审记录

本Step及其定向回修已通过Step13实际文档静态检查，正式来源与结构化产物一致。状态为completed / selfcheck_done / stop_review；本轮全部07设计已完成，现在等待用户确认07，不跨文档或实施。上游blocker、immutablebaseline与实际实现Gate仍未通过；无业务测试run或commit。
