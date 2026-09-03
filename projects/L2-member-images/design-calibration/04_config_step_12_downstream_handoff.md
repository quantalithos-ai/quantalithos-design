# L2-member-images 04 配置设计 Step 12：测试、验收、实施与运维承接

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 12  
> 回填章节：正式 `04-配置设计.md` §12“测试、验收、实施与运维承接”  
> 创建日期：2026-09-01  
> 完成日期：2026-09-01  
> 文档模式：`full-restart`  
> 本 Step 只定义下游输入边界；不创建或重写 `05/06/07/09`，不生成测试、验收、实施或运维事实。

## 1. Step 状态与本步目标

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 12：测试、验收、实施与运维承接 |
| 当前状态 | `completed`；下游输入、不得重复定义的配置契约和跨下游审计已收稳 |
| 直接前置 | Step 6 profile 矩阵、Step 7 P0 配置项、Step 8 敏感配置、Step 9 加载/校验/生效、Step 10 变更/审计/回退、Step 11 失效/降级 |
| 本步目标 | 明确 `04` 的配置契约如何被 `05-测试方案.md`、`06-验收标准.md`、`07-实施计划.md` 和 `09-部署与运维手册.md` 继续展开 |
| 本步边界 | 只交接测试切口、验收门禁输入、实施任务族和运维承接主题；不替下游编写正文、命令、脚本、排期、证据结果或放行结论 |
| 完成门禁 | 每个下游有输入、边界、待补内容和禁止重定义项；未闭合 owner/policy blocker 仍显式保留 |

Step 12 中的“应测试”“应验收”“应实施”“应运维”均是计划输入，不表示已经创建对应文档、实现仓、脚本、报告、证据、run、digest、signoff 或 readiness。

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `04_config_step_06_profiles_matrix.md` | `completed` | 交接 `local-dev`、`ci-test`、`integration-like`、`staging-like`、`production-like` 的适用范围和 fake 隔离 |
| `04_config_step_07_config_items.md` | `completed` | 交接五个配置域和 21 个 P0 item 的类型、默认 safe absence、来源、作用域、启动生效、敏感级别和失败策略 |
| `04_config_step_08_sensitive_secrets.md` | `completed` | 交接 opaque selector、raw secret 禁止、redaction floor、轮换和 no-output 规则 |
| `04_config_step_09_loading_validation_activation.md` | `completed` | 交接 source merge、strict JSON/schema、类型/ref-shape、交叉校验、runtime builder、`Assembled`/`Blocked` 和 startup-only 规则 |
| `04_config_step_10_change_audit_rollback.md` | `completed` | 交接高风险离线变更、外部 opaque review refs、safe audit surface、prior-validated-input restart rollback |
| `04_config_step_11_failure_degradation.md` | `completed` | 交接 fail-fast/fail-closed、optional external conservative marker、不可用/漂移/过期的下一启动处理 |
| `03-详细设计.md` §13~§16 | 当前正式基线 | 核对 config reader、runtime builder、slot、facade、错误、观测和测试 seam；不由本 Step 新增代码契约 |
| 旧 `05-测试方案.md`、旧 `06-验收标准.md` | historical input | 只识别旧环境、产品、成功事实或配置污染；不作为新版 `04` 的 schema、测试结果或验收 authority |
| `L1-governance` Step 12 | 粒度/格式参考 | 参考四类下游分层、承接表、停审记录和跨文档审计；不继承 governance publisher/outbox、产品、门禁结果或运维事实 |

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| 哪些配置场景进入测试方案？ | `05` 必须承接五个 profile、safe absence < project JSON < allowlisted env selector、strict JSON、重复 key/未知字段、类型/ref-shape、owner/kind/mutable、collection integrity、profile/mode/TestOnly、required local/static slot、敏感材料拒绝、redaction floor、runtime builder `Blocked`/local `Assembled`、optional external marker、reload/LKG/partial apply 拒绝、下一次启动重新校验回退输入等切口。 |
| 哪些配置门禁进入验收标准？ | `06` 应把无 silent fallback、高优先级非法 source 不回退、required slot fail-closed、raw secret/full ref 不输出、Production-like 不接 fake、`Assembled` 不等 build/Artifact/consumer/readiness、external blocker 不被配置关闭、startup-only 和安全回退规则作为验收输入。具体 veto、证据类型和放行流程由 `06` 定义；当前不预填 verdict。 |
| 哪些配置准备进入实施计划？ | `07` 应拆分 `infra/config.rs` 唯一 raw reader、strict parser/validator、source merge、profile/mode guard、redaction validator、`infra/runtime_builder.rs` typed slot injection、TestOnly fake wiring、safe issue surface、启动冻结、审计关联和配置测试 seam。每个实施 phase/commit 必须回读 `00~04` 并复核 blocker；本 Step 不创建 implementation ledger 或 planned boundary skeleton。 |
| 哪些部署细节留给运维手册？ | `09` 应承接配置 artifact 的受控放置、profile 选择、allowlisted selector 注入、secret/reference provider 的实际接线、启动/重启、prior validated input 回退、redacted identity 比对、告警/值班/runbook 和轮换流程。具体产品、路径、命令、真实值、阈值、账号和 provider 由运维/安全 owner 另行确认，不能在 `04` 伪造。 |
| 下游不得重复定义什么？ | 下游不得改写 P0 key、类型、默认 safe absence、来源优先级、作用域、敏感级别、启动生效、fail-fast/fail-closed、static/live、pin/no-`latest`、TestOnly 隔离、`Assembled` 语义、owner/依赖分类、禁止配置化项或 blocker 处置。发现冲突必须回 `04`；若改变 builder/port/error/flow/DTO，先回写 `03`。 |
| 是否已有可交付的测试/验收/实施/运维证据？ | 没有。本 Step 只产生 planned handoff；不产生 test run、report、evidence alias、artifact digest、release、signoff、rollback result 或 readiness。 |

## 4. 当前材料诊断

| 材料 | 改动前问题 | 本 Step 处置 |
|---|---|---|
| 旧 `05` | 可能把旧环境矩阵、固定组件或旧成功断言当成当前配置契约 | 仅提取待覆盖的配置测试主题；以新版 Step 6~11 为唯一输入，不改旧文档 |
| 旧 `06` | 可能缺少 strict source、redaction、builder fail-closed 和 blocker 保留门禁 | 提供配置验收门禁输入；具体证据、veto、signoff 留 `06` |
| `07-实施计划.md` | 尚未创建；不得提前声明实现仓、phase、commit 或 activation | 只登记未来任务族和设计回读要求；实现台账和 boundary skeleton 留给正式 07 |
| `09-部署与运维手册.md` | 尚未创建；配置设计不应代写部署命令或告警面板 | 只登记运行前准备、重启回退、secret 接线和排障主题 |
| sibling/上游 owner | Member Service、Member、Method Library、Artifact、Sandbox 等字段和正向接口仍有 pending | 下游只能测试/验收 conservative marker、blocked/gap 和无 fake fallback，不把 pending 写为外部成功 |
| evidence / digest | Step 10 只允许安全关联的 opaque/redacted identity；当前未定义统一配置 digest 算法或 evidence backend | 明确为未来下游/owner 输入，不在本 Step 生成或断言 digest、报告、证据 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 目的 |
|---|---|---|---|
| 测试承接 | 配置测试主题分散在 Step 7/9/11 | 以 profile、source、schema、sensitive、assembly、failure、rollback 七类切口交给 `05` | 防止只测试 parser happy path |
| 验收承接 | 旧验收材料未覆盖新版 no-output、no-fallback 和 blocker 语义 | 明确配置一票否决输入和证据方向；不提前给 verdict | 保证 `06` 能审查安全与边界，而非只审查启动成功 |
| 实施承接 | 配置读取和 builder 注入可能被实施侧自由拆分 | 固定 reader/builder 分层、任务族和每 commit 设计复核 | 防止 raw config 渗入 domain/application 或出现第二真相源 |
| 运维承接 | 容易把实际环境变量、secret、重启命令混入 `04` | 将实际分发、轮换、重启、回退、告警和 runbook 明确留给 `09` | 保持配置设计与运维手册边界 |
| 证据语义 | 可能把 planned report/digest 写成已存在 | 所有 evidence、digest、run、signoff 均标为 future/planned | 防止伪造交付状态 |
| blocker 传递 | sibling pending 可能被下游误当作 ready | 每个下游都携带 owner/policy blocker 和保守断言 | 保持跨仓真相源闭环 |

## 6. 配置设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否直接改写 `05/06` | 现在重写；或只交付承接输入 | 采用“只交付承接输入”。04 尚在本项目文档窗口，旧 05/06 不是当前 authority。 |
| 是否在本 Step 创建 `07`、`09` | 提前创建；或留给各自 SOP | 采用“留给各自 SOP”。避免越过正式文档顺序，也不提前产生 implementation ledger/skeleton。 |
| 测试是否只验证有效配置 | 只测 valid；或覆盖 source/profile/failure/no-output | 采用后者。P0 风险主要在错误组合、敏感泄露和 silent fallback。 |
| 验收是否把 `Assembled` 当成 ready | 是；或只视为 local composition | 采用后者。`Assembled` 只证明本地配置组合，不证明镜像构建、digest、Artifact、consumer、runtime 或发布。 |
| 是否为 pending external seam 造 positive test oracle | 造一个 fake success；或验证 marker/blocked/gap | 采用后者。TestOnly fake 只验证协议/失败映射，不能成为生产成功或 readiness oracle。 |
| 是否为配置变更定义在线回滚 | online LKG/hot；或 fresh validation + restart | 采用后者。P0 不支持 reload、LKG、partial apply 或在线回滚。 |
| 是否在 04 规定 evidence/digest 算法 | 现在固定算法；或交接安全 identity 与未来 owner 责任 | 采用后者。当前只保留 safe issue/ref 和 owner-provided redacted identity，算法与证据类型需由后续 owner/文档确认。 |

## 7. 结构化中间产物

### 7.1 下游总承接表

| 下游文档 | 必须承接 | 本 Step 提供的输入 | 下游不得做 |
|---|---|---|---|
| `05-测试方案.md` | 配置组合、错误输入、profile 隔离、加载/组装/失效/回退测试切口 | Step 6~11 的 profile、21 项 P0、校验和失败矩阵 | 不将测试通过写成外部 build/Artifact/consumer/readiness；不改 schema |
| `06-验收标准.md` | 配置安全门禁、fail-closed 门禁、无泄露和 blocker 保留条件 | Step 8~11 的 no-output、activation、change/rollback、failure 规则 | 不把 planned evidence 写成已有 verdict；不关闭 owner/policy blocker |
| `07-实施计划.md` | reader/parser/validator、builder、slot、fake、诊断、测试和审计任务族；phase/commit 复核 | Step 7~11 的实现边界和 03 影响判定 | 不在实现前新增 key/port/DTO；不跳过 implementation ledger 与 boundary skeleton 门禁 |
| `09-部署与运维手册.md` | artifact/selector 分发、profile、secret 接线、重启、回退、告警和 runbook 主题 | Step 5、8、10、11 的 source、敏感、restart、safe disposition | 不在运维手册改配置语义；不记录 raw secret、provider body 或虚构操作结果 |

### 7.2 `05-测试方案.md` 配置测试承接表

| 测试主题 | 最小场景 | 预期设计断言 | 测试层级建议 | 当前状态 |
|---|---|---|---|---|
| profile / mode isolation | 五个 profile；`ci-test + explicit TestOnly`；Production-like + fake/fixture | 仅允许的组合可进入装配；不隐式切换 profile/mode；Production-like fake 被拒绝 | contract / integration | planned；非执行结果 |
| source precedence | safe absence、项目 JSON、allowlisted env selector；同 key 冲突 | `safe absence < JSON < env`；非法高优先级 source 使整份 effective config 拒绝，不回退低优先级 | unit / contract | planned |
| strict JSON/schema | JSONC、trailing comma、duplicate key、unknown key/section、错误层级 | parse/schema fail-fast；无部分配置、无 facade、无副作用 | unit | planned |
| scalar/ref validation | 空 ref、URL/DSN/body、wrong owner/kind、mutable/`latest`、unknown selector | `InvalidRefShape`/`OwnerKindMismatch` 等安全类别；受影响 slot `Blocked`/`Unknown`/`Gap` | unit / contract | planned |
| controlled collections | role-extra ref array 空元素、重复、顺序、scope mismatch、`null` | canonical identity 可比较且无重复；不能用空集合或 `null` 关闭 required scope | unit | planned |
| cross-field guard | profile/mode/harness、local completeness、static scope、boundary mandatory | 交叉冲突拒绝；不以 `enabled=false`、fake、cache 或 LKG 绕过 | unit / integration | planned |
| sensitive / no-output | raw secret、credential、endpoint/body、manifest、provider response、full ref | 候选在 builder 前被拒绝；日志/错误/审计/trace/metric 不含原值 | security / unit | planned |
| redaction floor | absent、加强 selector、weaker/unknown/body selector | absent 使用固定 floor；只允许加强；不允许 debug/raw 旁路 | security / contract | planned |
| local composition | required local store/config/static slot 缺失或不可验证 | `Unassembled -> Blocked`；不 begin UoW、不暴露业务 facade；`Assembled` 仅 local | integration seam | planned |
| optional external seam | build/registry、qualification/Artifact、Member Service selector 缺失/unknown/pending | 可选 seam 仅保留 `Unknown`/`Unavailable`/`Gap`/`ReopenRequired`；mandatory scope 才整体 blocked；不调用 provider | contract / adapter seam | planned；owner blocker 仍开放 |
| activation boundary | reload、hot、online override、partial apply、LKG 请求 | `Unsupported`/reject；冻结输入不变；无 live mutation | contract | planned |
| change / rollback | 新 candidate 与 prior validated body-free input；candidate schema/profile 不匹配 | 每次都 fresh validation；不可验证回退输入 fail-closed；无自动回退、cache 或 fake fallback | integration / release seam | planned |
| drift / expiry | 外部替换、过期或不可再验证的 frozen input | 运行中不在线修复；下一显式启动重新校验，失败则按 P0 failure 处理 | integration seam | planned |
| marker/no-write boundary | optional marker、Query degraded、当前 B01/B02 stop | marker 不写 truth/UoW/trace/event/result；不把 degraded 写成 success | contract / integration | planned |

“planned”只表示给未来 `05` 的测试入口；本 Step 没有运行、覆盖率、报告、证据、CI gate 或 verdict。

### 7.3 `06-验收标准.md` 配置门禁承接表

| 验收门禁输入 | 通过条件（由 `06` 细化） | 一票否决方向 | 04 提供的依据 |
|---|---|---|---|
| Schema / source gate | P0 strict JSON、类型/ref-shape、交叉校验和来源优先级被实现并可验证 | unknown/duplicate/invalid high-priority source 被接受或 silent fallback | Step 5、7、9、11 |
| Fail-closed composition gate | required local/static scope 失败时不暴露业务 facade；`Blocked` 只表示未组装 | partial facade、`enabled=false` 绕过、cache/LKG/fake 伪成功 | Step 9、11 |
| Sensitive no-output gate | raw secret、full selector、endpoint、body、provider response 不进入输出面 | 任一 log/error/audit/trace/metric/report 泄露敏感材料 | Step 8、11 |
| Profile isolation gate | 只有显式 `ci-test + TestOnly` 可使用 deterministic fake；非 CI profile 拒绝 fake/fixture | fake 结果被当作生产适配器、release、Artifact 或 consumer 成功 | Step 6、8、9 |
| Static/live and pin gate | static ref/seed/base 与 live state 分离；immutable ref 不接受 `latest`/mutable | 配置写入 live memory/checkpoint/workspace、改变 history/state/UoW/recovery 或接受 mutable pin | Step 4、7、9 |
| External owner gate | owner/policy 未闭合时只显示 blocked/gap/unknown marker | 配置 selector 被解释为 candidate、image digest、gate pass、Artifact accepted、consumer confirmed 或 readiness | Step 1、6、7、11 |
| Activation / rollback gate | P0 只 startup 生效；回退输入重新校验；invalid candidate/recovery fail-closed | hot/reload/LKG/partial apply、未经验证回退、自动成功回退 | Step 9、10、11 |
| Change audit gate | 高风险非 TestOnly 变更有关联的外部 change/reason/review ref 和安全 disposition | 把 opaque ref 写成 approval/signoff，或将 audit 当治理真相 | Step 10 |
| Evidence integrity gate | 后续文档若需要 evidence，能够关联安全 issue/ref/owner redacted identity，且不伪造结果 | 当前不存在的 run/report/digest/signoff 被写成既成事实 | Step 10、11；具体 evidence policy pending |

### 7.4 `07-实施计划.md` 配置实施承接表

| 未来任务族 | 实施输入 | 设计边界 / 完成前提 | 交付记录留给 |
|---|---|---|---|
| raw reader 与 source merge | 五域 JSON schema、safe absence、source precedence、allowlisted env | 只有 `infra/config.rs` 读取 raw input；strict parse；非法高优先级不 fallback | `07` implementation ledger（待创建） |
| typed validation | enum/ref-shape/owner/kind/mutable/collection/cross-field/sensitive 规则 | 失败在 builder 前；不把 raw value 传进 domain/application；禁止新增隐式默认 | `07` phase/commit 复核（待创建） |
| profile / TestOnly guard | 五 profile 与 mode/harness 组合 | fake 仅 explicit TestOnly；生产语义不接受 fixture/replay/debug override | `07` planned boundary skeleton（待创建） |
| runtime builder injection | `ImageRuntimeConfigRef`、local/static/external slot 和 `ImageFakeMode` | `infra/runtime_builder.rs` 只消费 validated binding；`Assembled` 仅 local composition；不调用 provider | `07` implementation tasks（待创建） |
| adapter/fake seam wiring | resolver、local store、boundary marker、TestOnly deterministic fake | 不新增 sibling Cargo 依赖；不把 consumer/owner pending 写成 positive result | `07` dependency/phase audit（待创建） |
| issue/diagnostic surface | safe issue category/ref、profile/slot/disposition、fixed redaction floor | 不产生 config error public DTO、alert backend 或 raw diagnostic | `07` test/observability task（待创建） |
| change/restart/rollback hook | safe change/review/rollback opaque refs、fresh validation entry | 不实现 online reload、LKG、自动回滚或容器操作 | `07` activation boundary review（待创建） |
| configuration tests and gate hooks | 本表 §7.2、§7.3 的 planned cuts | 只能在 `05/06` 定义完成后建立脚本/报告；不在本 Step执行 | `05/06/07`（待创建） |

实施者不得由上述任务族自行补充数据库、锁、lease、TTL、retry、scheduler、transport、topic、产品、secret provider、digest 算法或 external positive contract；一旦需要，必须回 `03/04` 并重开相应 Step。

### 7.5 `09-部署与运维手册.md` 运维承接表

| 运维主题 | `09` 应承接 | 本 Step 的安全边界 | 当前状态 |
|---|---|---|---|
| 配置 artifact 分发 | 受控 JSON artifact、profile 选择、文件/selector 注入方式 | 不在 `04` 写路径、命令、环境真实值或部署平台 | future / `09` 待创建 |
| secret/reference 接线 | approved opaque selector、provider-local 读取与轮换 | raw secret、credential、endpoint、provider body 不进入 `04` 或诊断 | future / owner pending |
| 启动与重启 | startup validation、失败定位、显式重启后生效 | 无 hot/reload/online override；不声称已执行 restart | future / `09` 待创建 |
| 配置回退 | 提供 prior validated body-free input，重新走同一校验链 | 不使用 LKG/cache/未验证旧值；不声明 host/container rollback result | future / external process |
| 诊断与告警 | safe issue/ref、local disposition、有限类别的告警映射和 runbook | 当前无 alert backend、阈值、SLO、dashboard 或 notification truth | future / policy pending |
| 轮换与废弃 | 新 selector + restart、deprecated/rejected/removal 的操作提示 | 不记录 full old/new sensitive ref；不提供静默兼容 | future / Step 13 + `09` |
| 不可用与漂移 | 下一显式启动重新校验，按 blocked/unknown/gap 处置 | 不做在线 drift detector、repair、retry 或 automatic fallback | future / Step 11 input |

### 7.6 下游不得重复定义的配置契约

| 契约 | 唯一来源 | 下游处理 |
|---|---|---|
| 五域和 21 个 P0 key、类型和 `null` 语义 | Step 7 / 正式 `04` §7 | 只引用；新增/重命名先回 `04` Step 13，涉及代码契约先回 `03` |
| source precedence 与冲突 | Step 5 / 正式 `04` §5 | 只测试/验收；不得在脚本或部署文件偷偷改变优先级 |
| profile/mode/TestOnly 组合 | Step 6、9 / 正式 `04` §6、§9 | 只实现/验证既有组合；不得把 fake 结果当 production lane |
| sensitive/no-output/redaction floor | Step 8、11 / 正式 `04` §8、§11 | 只增加安全检查；不得通过 debug、报告或运维日志放宽 |
| startup-only、无 reload/LKG/partial apply | Step 9、10、11 | 只承接启动/重启流程；若要求动态替换，先重开 `03/04` |
| static/live、pin、owner 和依赖分类 | Step 4、6、7 / 正式 `04` §4、§6、§7 | 不能由配置、测试 fixture 或运维脚本覆盖 |
| `Assembled`/`Blocked` 与 external marker 语义 | Step 9、11 | 不新增 ready/success 别名；外部正向结果由 owner 合同定义 |
| change audit / rollback | Step 10 | 只能关联 safe opaque refs；不伪造审批、操作结果或审计后端 |

### 7.7 配置证据与结果语义承接

| 计划产物类别 | 可证明的内容 | 当前不应证明 |
|---|---|---|
| parser/validator test report（未来） | 某组输入被严格拒绝或形成 local validated binding | 真实镜像、provider、Artifact、consumer 或 runtime 成功 |
| profile matrix report（未来） | profile/mode/fake 组合遵守配置约束 | production readiness、发布或回滚已完成 |
| redaction scan（未来） | 测试输入/输出未泄露禁止材料 | secret provider 已接通或真实凭据有效 |
| builder smoke（未来） | required local composition 可形成 `Assembled` 或安全 `Blocked` | candidate、image digest、gate、Artifact、manifest、consumer confirmation |
| change/rollback audit（未来） | safe change/review/rollback ref 和 validation disposition 可关联 | 外部审批已通过、host/container 已执行 rollback |
| failure marker report（未来） | invalid/unavailable/optional marker 分类保持 fail-closed | 自动修复、持续漂移检测或告警已生效 |

所有表内“未来”只表示后续文档可能定义的 planned output；当前没有任何 report、evidence alias、run_id、digest、signoff 或 verdict。

### 7.8 按 profile / failure 的承接矩阵

| 场景 | `05` 测试方向 | `06` 验收方向 | `07` 实施方向 | `09` 运维方向 |
|---|---|---|---|---|
| `local-dev` safe absence / local composition | 验证缺失与 local `Assembled`/`Blocked` 语义 | 不将本地结果作为发布或消费证据 | local JSON/sample 与 builder seam | 本地启动提示，不能含真实 secret |
| `ci-test` TestOnly | 验证 deterministic fake、strict source、no-output | fake isolation 作为安全门禁 | harness 注入与 fake parity | CI selector/fixture 分发留运维/CI owner |
| `integration-like` owner gap | 验证 unknown/unavailable/gap、无 fake fallback | owner blocker 未关闭不得放行 positive lane | controlled adapter seam，不增加 sibling Cargo | 接缝配置与排障主题，具体 endpoint 留 owner |
| `staging-like` / `production-like` future | 仅在 owner/policy 闭合后定义真实依赖测试 | P1/P2 方向，不作为当前 must-pass | 真实 adapter/secret/provider 需重新设计 | 产品接线、阈值、runbook 和回退由 `09`/owner 定义 |
| required config/static/local 缺失 | 断言 fail-fast、无 facade/UoW/副作用 | 一票否决或阻止激活（具体规则由 `06`） | validator/builder 在入口阻断 | 修正 artifact 或使用已验证输入后显式重启 |
| optional external selector 不可用 | 断言 conservative marker、无 provider call | 不得当作 external success/readiness | marker adapter/slot 注入 | 排障和 owner escalation，不能自动 repair |
| 配置候选/回退输入不可验证 | 断言 reject、fresh validation、无 LKG | 不允许未经验证配置进入激活 | 同一 loader/validator 路径 | 提供可验证输入并重启，操作结果由外部记录 |

### 7.9 下游承接停审与跨下游审计

#### 下游承接停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| `05` 是否收到 profile、21 项 P0、strict validation 和 failure test cuts | 通过 | 见 §7.2；测试文档尚未重写 |
| `06` 是否收到 no-fallback、no-output、builder、profile、owner blocker 和 rollback 门禁输入 | 通过 | 见 §7.3；具体 verdict/evidence 仍留 `06` |
| `07` 是否收到 reader、validator、builder、fake、audit、测试任务族 | 通过 | 见 §7.4；implementation ledger/skeleton 尚未授权 |
| `09` 是否收到分发、secret 接线、restart、rollback、告警和 runbook 主题 | 通过 | 见 §7.5；不创建 `09` 正文 |
| 是否把下游 pending 写成已完成 | 否 | 所有下游均标记 future/planned/waiting |
| 是否由下游重定义 `04` 契约 | 不允许 | 冲突必须回 `04`，涉及代码契约则回 `03` |

#### 跨下游承接审计表

| 审计项 | 结论 | 依据 / 持续缺口 |
|---|---|---|
| 测试、验收、实施、运维是否引用同一 source/profile/schema | 通过 | 均回指 Step 5~11；旧 05/06 不作为 authority |
| 是否存在测试允许但验收禁止的未说明差异 | 无当前差异 | 具体 acceptance veto 仍由 `06` 细化，不得预填结果 |
| 是否存在实施侧绕过 `infra/config.rs` 的 raw reader | 不允许 | 任何新入口需回 `03/04`；builder 只消费 validated binding |
| 是否把运维命令、真实 secret、endpoint 或阈值写进 `04` | 未写入 | 留给 `09` 和 owner/policy；当前无操作事实 |
| optional external marker 是否被任何下游升级为 success/readiness | 不允许 | `Unknown`/`Unavailable`/`Gap`/`ReopenRequired` 原样保留 |
| fake 是否能流入 production-like | 不允许 | profile/mode guard；CI-only TestOnly |
| evidence/report/digest/run 是否被伪造 | 不允许 | 仅 planned categories，当前无实际产物 |
| 是否新增 sibling Cargo、event/outbox、runtime lifecycle 或 live-state 配置 | 不允许 | 关系仍为 ref/adapter/event/fake；本 Step 不新增代码契约 |
| blocker 是否完整传递 | 通过 | MI-UP、Q-MI、DDD、PF blocker 继续开放并按 conservative 语义处理 |

## 8. 对 03 详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| 下游只承接已定义的 21 个 P0、profile、strict validation、startup-only 和 marker 语义 | 否 | 下游文档输入映射 | 不适用 | 无回写 |
| `07` 必须保持 `infra/config.rs` -> `infra/runtime_builder.rs` -> typed slots 的读取方向 | 否 | 承接既有 config/builder boundary | 不适用；见 `03` §13 | 无回写 |
| `05/06` 不得把 local `Assembled`、TestOnly fake 或 external marker 写成 readiness | 否 | 测试/验收语义约束 | 不适用；见 `03` §13~§15 | 无回写 |
| `09` 只承接部署和运维操作，不改变 config carrier、port、error 或 flow | 否 | 文档职责边界 | 不适用 | 无回写 |
| 未来若下游要求动态 reload、online LKG、config center、secret provider health、new public DTO/port、digest/evidence contract 或 runtime lifecycle | 是（future trigger） | 可能改变 config carrier、builder、adapter、error、flow、state 或 observability | `03` §5/§6/§8/§11/§13/§14 与对应 calibration Step | 当前未触发；必须先回写再重开 |

本 Step 没有当前“待回写”或“阻塞待确认”的 03 项。持续的 `MI-UP-001/002/003/006/007/008`、`Q-MI-003/004`、`DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02` 和 `PF-UNAVAILABLE-RECOVERY` 不因下游承接而关闭。

## 9. 回填草稿

> 校准来源：`design-calibration/04_config_step_12_downstream_handoff.md`

正式 `04-配置设计.md` §12 应回填：

1. 下游总承接表，以及 `05/06/07/09` 各自的配置测试、验收门禁、实施任务族和运维主题。
2. 下游不得重定义的 P0 schema、来源优先级、profile/fake、敏感/no-output、启动生效、static/live、owner/blocker 和 `Assembled` 语义。
3. planned evidence 与实际交付事实的分界：当前不生成测试、报告、run、digest、signoff、发布或 readiness。
4. 由 `07` 在获准时创建 implementation ledger 和全部 planned boundary skeleton；本 Step 不提前创建。
5. 任何改变 `03` 代码契约的后续要求，必须先回写 `03`，再重新执行受影响的配置 Step。

正式章节不得复制下游完整用例、验收脚本、commit 排期、部署命令、真实 secret/provider/product 参数、告警阈值、运行结果或 evidence alias。

## 10. 待确认事项与持续 blocker

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 新版 `05` 何时重写并定义实际测试脚本/报告 | 影响配置测试证据 | 当前只交付 planned test cuts；不执行测试 |
| 新版 `06` 何时重写并确权 veto、evidence 与 signoff | 影响配置验收裁决 | 当前只交付门禁输入；不生成 verdict |
| `07` 实现仓、phase、commit、implementation ledger 和 planned boundary skeleton | 影响配置实现交接 | 当前保持未创建；未来必须按 07 SOP 重新核验 |
| `09` 的产品、secret provider、分发、告警、runbook 和轮换流程 | 影响实际运维 | 当前只保留主题；不写命令、真实值或 provider body |
| 配置 artifact 的保留、prior validated input 的可用性和回退执行 owner | 影响 rollback 操作 | 只有 fresh validation + restart 规则；输入不可验证即 fail-closed |
| `MI-UP-001/002/003/006/007/008`、`Q-MI-003/004` | 影响 external/static/consumer positive lane | 下游仅断言 blocked/gap/unknown/marker；不产生正向结果 |
| future config center、hot reload、online LKG、secret provider health、digest/evidence policy | 影响 `03/04` 代码/配置契约 | 记为 future design-change-required；触发前不得进入 P0 |

## 11. 自检与 Step 12 门禁

| 自检项 | 结论 | 依据 |
|---|---|---|
| 是否回答测试、验收、实施、运维四类承接问题 | 通过 | §3、§7.1~§7.5 |
| 是否按 profile、配置域、失败模式提供可定位切口 | 通过 | §7.2、§7.8 |
| 是否明确下游不得重复定义的配置契约 | 通过 | §7.6、§7.9 |
| 是否将 planned test/evidence 与执行结果区分 | 通过 | §7.7、§10 |
| 是否避免创建/重写 `05/06/07/09` | 通过 | 本 Step 仅有 calibration 文件 |
| 是否避免实现仓、commit、run、report、digest、signoff、readiness 伪事实 | 通过 | 全文仅使用 planned/future/waiting |
| 是否保留 raw secret、endpoint、provider body、命令和阈值边界 | 通过 | §4、§7.5、§10 |
| 是否保持 sibling/owner/policy blocker 开放 | 通过 | §7.3、§7.9、§10 |
| 是否存在当前需回写 03 的配置结论 | 否 | §8；future trigger 未触发 |
| 是否可进入 Step 13 | 通过 | 四类下游输入和跨下游审计均收稳 |

```text
step_12 = completed
gate_status = pass_with_explicit_blockers
current_module = downstream_handoff (closed)
next_allowed_action = create_and_complete_step_13_migration_deprecation_evolution
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false
planned_boundary_skeleton_allowed = false
commit_required = false
```

**Step 12 停审结论：** 下游承接关系已闭合；`05/06/07/09` 仍是后续文档工作，不因本 Step 被视为已完成。依据用户已授权的“完成全部 04”范围，下一动作只能严格创建 Step 13；不得提前装配正式 `04-配置设计.md`。
