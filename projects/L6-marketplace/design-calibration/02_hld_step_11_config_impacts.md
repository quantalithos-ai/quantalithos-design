# 02 Step 11：配置影响轮廓

## 1. Step状态

开工：用户已确认01并授权全部02；Step 11 completed，formal未装配。仅当前agent。

Step内计划：P1读取输入 → P2逐题回答 → P3诊断 → P4前后比较 → P5取舍 → P6结构化 → P7回填草稿 → P8自检/停审。P1～P8已分批完成。

模块门禁：本Step独立收束后才允许下一Step。

## 2. 本步输入

当前正式00§9～16、01§6～17；本Step对应SOP与书写规范。前一Step的问题回答/诊断/取舍/待确认事项：02_hld_step_10_exceptions_boundaries.md。旧02未作为推导依据。

## 3. SOP问题回答

1. 哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受到配置影响？

答：Weblocale/显示、API/Worker承载、ownerSDKbinding、Postgres、读取索引/有界页、workerclaim/等待/probe、notice/audit通道与恢复/rebuild范围受运行配置影响。

2. 哪些模块只能间接受配置影响，不能直接读取配置？

答：Domain objects/policies只接已验证typed输入/规则需求，不能直接读环境变量或“approved开关”；UI不能通过设置影响资格。

3. 哪些领域规则、状态机、审计链、事务一致性或安全门禁禁止配置化？

答：ownership/body排除/正式Govbinding/scope/nonwithdrawal/exactversion/原intent幂等/audit-result-work原子/unknownprobe/no-write全部不可配置。

4. 哪些配置影响需要在 03-详细设计中继续定义 RuntimeConfig、ConfigLoader、ConfigValidator、AdapterConfig、JobConfig、ConfigError 或 runtime builder 注入关系？

答：03明确RuntimeConfig/ConfigLoader/ConfigValidator/adapter/job注入与configurationerror的可调用边界；这些是承接要求不是本轮新增domain对象。

5. 哪些配置细节属于 04-配置说明，不能在概要设计中提前展开？

答：04定义实际keys/defaults/override/env/secretref/port/binding/profile热变更；原型9090/0.0.0.0不是生产默认。

## 4. 当前文档问题诊断

01§13配置不能改变truth/gate；Step8job当前资格不是可调整为false的布尔开关。技术参数属于runner/adapters，不应渗透statelessdomainpolicy。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| runtime参数 | 01横切方向 | adapter/entry/job影响与Domain间接注入 | 防领域直接读配置 |
| guard | 可被误作开关 | 禁配置化矩阵与回退来源 | 不绕authority |
| 原型port | 局域网demo9090 | 不作为生产默认 | 02不偷写04 |

## 6. 设计取舍

只收配置影响轮廓；Rust/Vue/PG方向不被配置切换成另一套truth服务。拒绝在02给生产key/default/端点/secret或弱化guard的开关。

## 7. 结构化中间产物

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| Web消费展示 | 是 | locale、API绑定、分页显示、loading/empty/error映射 | 默认英文/中英切换保留ref/state/资格与幂等key；组件状态不反写业务，契约与安全错误不locale分叉 |
| Market API Entry | 是 | listener/资源限制/序列化/请求预算/当前scope能力binding | runtime builder与typed校验、入口安全；生产端口等实际值交04，原型9090非默认 |
| U1 source/publisher/material adapters | 是 | 正式owner/SDK能力绑定、访问credentialref、读取预算 | qualifiedtype/operation/consumer支持注入，不猜ref或fallback私有API |
| U2 Gov adapter | 是 | 正式intake/read/probe绑定与等待预算 | formalapproved/binding/有效性仍hardgate，缺支持ContractBlocked |
| U3目录与U7索引adapter | 是 | 有界页/读取等待/检索策略/profile/locale analyzer候选 | stablecursor/scope裁剪/中文搜索与数量一致，FTS/trigram选择和性能实测后闭合 |
| U4 receiver adapter | 是 | 正式类型receiver/物化接缝/等待/probe预算 | 每type formal支持与originalintent；不存在provider不能配出installed |
| U5 notice adapter | 是 | 通道binding/资源预算/批次/重试节奏 | currenttarget/channelauthority、knownimpact与unknown不变，生产SLO缺依据 |
| U6 observation adapter | 是 | producerbinding/redaction路径/等待/probe预算 | 只安全formal材料与receipt，local audit不依赖外部可用性 |
| U6 Worker与durable work | 是 | concurrency/claim期限/批次/等待/reconciliation调度 | 旧fence/CAS、permit-before-effect、crashunknown与原report保存，参数不能允许blind retry |
| local PostgreSQL adapter | 是 | 连接/资源预算/迁移与transaction runner binding | sameUoW原子、revision来源与typed存取、隔离/锁策略03定义；secretref交04 |
| U7 refresh/rebuild runner | 是 | formalresolverbinding、typed维护范围、批次/调度 | nonemptyqualifiedplan、固定sourcecursor与安全shadow原子replace，query不能触发 |
| Domain objects/policies | 仅间接 | Application注入已验证qualified规则/输入，不直接配置读取 | 03constructor/trait与validator，配置不产approved/verified/installed |
| Billing/Archive/canonicalevent candidate | 当前无active影响 | 不注册activeadapter/config surface | 正式owner/schema合同后回退重开02～07，不能靠endpoint非空启用 |

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| truth ownership/正文或credential排除 | 技术参数不是资产/身份/治理authority | 00/01及对应owner正式受控变更 |
| approval、source/publisherverified、material applicability | 只能来自正式决定/资质输入 | 上游contract资格与00/01，不提供bypass键 |
| scope/visibility、count/suggest裁剪、queryno-write | hidden存在性与读写红线 | 00BR301/302、01ADR007及02§7/8 |
| exact version/nonwithdrawal/newadmission gate | 防止撤回后继续获取 | 00BR303/401/501、01ADR004/006、02§9 |
| originalintent/complete result/audit+work原子/unknownprobe | 不可调整为fakeaccepted或blind retry | 01ADR005/008、02§6～10 |
| notice/receiver/observation结果成功推断 | 配置不能填送达/安装/付款/外部准入 | 正式receiver/channel/producerowner与02风险 |
| source restore自动Listed或rebuild修truth | 派生恢复不是业务处置 | 00BR505、01ADR007及02§8/9 |
| runtime logs/文档检查冒充evidence/readiness | 证据authority与实际run缺失 | 05/06/07门禁，不通过配置改变 |

复杂度：配置影响已逐组成/runner/seam覆盖，两矩阵足够，无额外配置图；不写keys、defaults、env、端口或secret名字。03形成typed runtime contract/loader/validator/注入和error surface，04才说明具体参数来源/override/合法范围/变更风险。

## 8. 回填草稿

正式§11仅摘录本文件§7及已pass部分附录，不带问题/诊断/历史审计；不新增结论。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01沿01保留，仅受影响正向lane blocked；不是owner已确认或已发送请求。

## 10. 进入下一步条件

P1～P8均完成；内部stop_review/pass。七部分与Web/API/Worker覆盖，无key/default/端点/秘密名，无guard bypass。 外部资格不关闭，允许进入Step 12。
