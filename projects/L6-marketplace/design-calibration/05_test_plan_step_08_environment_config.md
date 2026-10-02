# Step 8：设计测试环境与配置矩阵

## 1. Step 状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review；`gate_status=pass`（环境规划）。输入Step4/6/7、01依赖裁剪、03 runtime/SDK与04全部配置；输出环境、依赖类型、配置测试及不可用处理。计划定位不等环境已提供。

Step内计划：依赖分类→profile/suite姿态→七字段/八slot→不可用与上限审计；完成。本轮不启动server/PG/browser、解析secret或安装依赖。

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_07_test_data.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7，来源/失败/证明上限闭合 |
| 复杂度判断 | done | 主控内分单元/表，无需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，实际资格与运行结果不伪填 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done不表示实际环境、测试、evidence或owner签核通过。

## 2. 本步输入

[Step7](05_test_plan_step_07_test_data.md)、[01§8](../01-架构设计.md)、[03§13](../03-详细设计.md)、[04§5～11](../04-配置设计.md)、全局依赖规则§1/4.1/5；SOP Step8与书写规范§5.8。Core/SDK实际exports与planned成员路径沿03 Step3/14，不写owner Cargo path。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 各环境测什么？ | local仅schema/display/负例；本地自动测试及CI使用test；staging选获资格接缝；production当前blocked。 |
| 依赖服务？ | Core/SDK compile；隔离PG、provider、owner经SDK runtime；Web testAPI/browser；当前0active event。 |
| config/flag？ | §7.2精确承04七字段、八slot、四profile；无业务feature flag/approval bypass。 |
| 哪些fake？ | test typed ports/SDK分支；PG原子性必须actual，owner正式positive另列blocked。 |
| 不可用？ | suite记录unavailable/blocked并阻门，不自动fake fallback或skip成pass。 |
| compile可path？ | 只Core/SDK已导出package，以及本仓六member；owner内部源码禁止。 |
| runtime/event如何协作？ | runtime typed fake/spy或正式非生产real-like；event条件未激活，不造event replay positive。 |

## 4. 当前文档问题诊断

初稿拓扑无compile/runtime标签，未列跨仓依赖判定；local/test与真实PG资格容易混为ready。测试环境须明确不可用状态，不能因参数齐全就宣称Bound。

## 5. 改动前后对比

| 前 | 后 | 原因 |
|---|---|---|
| profile文字描述 | suite环境定位、三类依赖、typed替身 | 防runtime误写Cargo |
| endpoint=可用候选 | exact qualification+Blocked姿态 | 不造正式consumer |
| 缺工具可跳过 | unavailable阻P0 gate | 保留证据缺口 |

## 6. 测试设计取舍

沿04复用四profile、CI=test，不新增integration/CI业务profile；未采用独立测试auth/配置bypass。integration是test中真实PG层，staging是获正式非生产资格的运行环境；schema/display负例不能支持完整suite退出。纯fixture unit不需要owner服务，失败分支typed fake也不替代外部ready。

## 7. 结构化中间产物

### 7.1 环境矩阵与依赖类型

| 环境/profile | 用途/suite | 依赖服务/类型 | 协作方式 | 关键配置 | 数据策略 | 风险/结论上限 |
|---|---|---|---|---|---|---|
| local/local | loader schema、display、负例 | Core/SDK compile；运行缺口允许披露 | path只正式exports；未资格Blocked | 单strict snapshot/locale | in-memory DS/无真实secret | 不证明发布/分发；原型9090仅historical展示 |
| local test/test | D/S/I/C/X/R快测 | Core/SDK compile；ports runtime | 同trait typed fake/stub/spy；explicit test composition | 七字段/八slot test资源 | 每case DS/seed；no生产写 | 本地语义，不是formal owner |
| CI test/test | 全11P0，真实PG/entry/Web | 同上+PG/browser/testAPI runtime资源 | 实际PG与browser；外部owner typed fake | test ref/profile/budget | run隔离DB/schema/browser context | 未提供PG/browser即unavailable，不可跳过 |
| staging/staging | P1 selected formal seam | Core/SDK compile；owner/provider/PG runtime | 仅qualified非生产exact SDK/owner，不使用假正式结果 | staging资源ref/current contract | 获准namespace及owner数据规则 | 真实positive当前blocked；不宣称生产能力 |
| production/production | 正式门禁后的部署前验证 | 正式PG/provider/八slot runtime | formal exact mapping，无fake | startup validated snapshot | 正式数据authority/保留规则待核验 | 当前blocked，本轮不触达 |

| 依赖 | 全局类型 | 当前测试协作方式 | 禁止/待确认 |
|---|---|---|---|
| L0-core | compile | 已导出core-contracts类型及可信meta fixture | 不shadow actor/key/trace，不当human认证 |
| L0-sdk | compile + runtime | sdk-client/sdk-contracts正式exports；operation级typed测试adapter | generic endpoint不是支持证明 |
| Method/Hub/Images | runtime via SDK | Source typed slice fake；staging exact正式mapping | 不复制Method/Role/ProcessTemplate/registry/adapter/Image body，不合并listing |
| Governance/Artifact | runtime via SDK | decision/binding/material typed fake与negative；formal positive blocked | 不自产approval、scan/signature，不读正文/血缘/内部DB |
| Identity | 条件runtime via SDK | AI member引用schema负例 | 非human publisher/org/auth owner |
| Observability | runtime via SDK | qualify/dispatch/probe同port；producer/redaction未闭合Blocked | local audit/receipt非evidence、no ledgerbody |
| publisher/scope/receiver/notice owner | runtime候选 | test controlled完整binding+gap/probe | 正式owner/support待定，不自建truth |
| Bus/owner events | event conditional（未激活） | 仅dependency negative检查，无active消费/回放suite | 0active Event/outbox，Images 0outbound不猜 |
| Archive/Billing/product consumers | future/不适用 | 仅禁止依赖/范围检查 | 无market source/payment lane，不创造协作合同 |
| PostgreSQL/test provider/browser | 本仓运行资源，非跨仓compile | actual isolated PG/provider stub/browser | 未提供资格/资源不得标pass |

#### 测试环境拓扑图: Marketplace依赖姿态

```text
Marketplace test target --[compile]--> L0-core exports
          |             --[compile]--> L0-sdk exports
          |
          +--[runtime]--> isolated PostgreSQL / test provider
          +--[runtime via SDK]--> typed owner fake (test)
          |                          or qualified owner (staging)
          +--[runtime]--> test API <---[runtime]--- Web browser
          |
          +--[event, inactive]--> no active Bus / owner lane
```

关键说明：compile才能进入package；runtime替身仍用同正式port。图不是业务审批顺序；inactive event仅说明裁剪，不提供可运行event路径。API与Worker分别装配，不能把Web端点当owner endpoint。

### 7.2 配置与TC矩阵

| 外部项→RuntimeConfig | 生效/约束 | 用例 |
|---|---|---|
| schema_version/profile→loader metadata | 支持值、四profile；不进RuntimeConfig | CONFIG-001/002/006 |
| api.bind→api_bind | SocketAddr/startup；无正式默认，无新TLS/auth字段 | CONFIG-001/002/012、CROSS-022 |
| storage.postgres_config_ref→postgres_config_ref | nonempty opaque ref/provider/startup；关键失败拒装配 | CONFIG-007/008 |
| sdk.profile_ref→sdk_profile_ref | typed ref/exact operation资格；缺支持Blocked | CONFIG-004/008/009 |
| owner.bindings→owner_bindings | Source/Publisher/Material/Governance/Scope/Receiver/Notice/Observation；unique kind；缺slot Blocked | CONFIG-004/006、CROSS-009 |
| worker.batch_limit→worker_batch_limit | u32>0/profile上限；无编造容量默认 | CONFIG-005、CROSS-022 |
| worker.lease_millis→lease_millis | u64>0且checked-add安全；lease不证notcommit | CONFIG-005、CROSS-019 |
| web.default_locale→default_locale | En唯一安全默认、Zh/display；不改ref/key/state | CONFIG-011、CROSS-008 |
| VITE_MARKETPLACE_API_BASE / web.api_base | Web public origin/build-time；不进server七字段 | CONFIG-009、CROSS-021/022 |
| --config / MARKETPLACE_CONFIG_PATH | 只选择同规范路径；无自动HOME搜索 | CONFIG-003 |
| unknown/bypass/ref rawsecret/hot reload | strict拒绝、redacted、不半切换 | CONFIG-002/007/010/012 |

配置姿态不是Bound truth。production fake禁止，staging不能冒非生产资格；本地自动测试使用test composition/profile，不以local服务宣称positive Bound。所有来源、类型、default与敏感级别沿04，不新增测试专属业务flag。

### 7.3 不可用与环境审计

| 缺口 | 本地处理/报告 | 门禁 |
|---|---|---|
| actual PG/extension不可用 | PG suite unavailable，pure/fake可另跑但不抵消 | 阻P0退出/送验 |
| formal SDK/owner不提供 | controlled P0仍验证本地分支；正式P1 blocked单列 | 不得宣称真实positive ready |
| test provider/ref/budget unavailable | 关键fail-fast或slot Blocked；报告安全code | unexpected unavailable阻suite |
| browser/实际Web build不可用 | component不替代browser子集；suite unavailable | 阻所要求P0 |
| capacity/retention/auth/TLS资格缺 | candidate或blocked external，不硬判阈值 | 不以配置测试关闭 |

静态审计：四profile/CI复用test、六域/七字段/八slot均与04一致；当前0active event，owner runtime不进入compile；每suite有test/staging姿态，所有不可用明确阻断或外部资格上限。环境未实际提供，计划门禁pass不等environment ready。

## 8. 回填草稿

正式§8采用环境/依赖表、ASCII标注图、配置矩阵与unavailable规则。具体gate输入参数在Step9，报告schema在Step13，不填真实endpoint/DSN/secret/生产预算。

## 9. 待确认事项

MP-UP/SRC/Q和实际Core/SDK/owner/provider/PG/TLS/auth consumer资格继续pending/blocked/affected/future。04对MP-SRC-003标签差异沿Step1记录，本步使用03“技术栈差异”语义，human publisher资格为MP-UP-003，不私改04。详细设计影响判定：没有新配置/类型/依赖；正式资格若改变再受控重开03/04。

## 10. 进入下一步条件

P0环境与配置姿态可定位，不可用不伪pass，跨仓类型/协作方式一致；设计门禁pass。下一读SOP Step9/规范§5.9、Step4的11suite及Step6主TC/EV，补完整脚本参数与raw/report闭环；不提交commit。
