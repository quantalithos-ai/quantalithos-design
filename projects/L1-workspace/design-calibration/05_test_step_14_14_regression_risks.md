# Step 14. 定义回归策略与残余风险

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 14  
> 回填章节：`05-测试方案.md` §14  
> 执行模式：full-restart / single-agent-serial

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / regression_defined_with_open_blockers |
| 输入基线 | Step3/6/9~13；WS-UP/WS-LOCAL 台账；测试规范 §5.14 |
| 本步输出 | 变更触发、最小/全量回归、残余风险、不可接受项、06承接与归档规则 |
| 事实边界 | 没有执行回归、风险接受、签署或 blocker关闭 |
| 下一动作 | Step15 装配正式05并做跨文档一致性/编号/事实边界审计 |

## 2. 本步目标与输入

本步把设计、实现、配置、接缝、测试工具和报告变化映射到最小回归集，固定何时必须运行完整 P0 回归，并把尚不能验证的 owner/bus/durable/downstream/baseline 风险逐项保留。风险表中的“接受角色”是未来责任角色，不是当前接受事实。

| 输入 | 本步用途 |
|---|---|
| Step3/6 | 15 CUT、59 TC、14入口和正式状态/phase |
| Step9 | 13 suite、四gate与planned scripts |
| Step10/11 | 非功能红线、S/A/B、复验扩大和不可接受项 |
| Step12 | local/formal进入与完整退出门禁 |
| Step13 | fixed-run raw/report/EV及复验归档 |
| project ledger | WS-UP-001~008/006-S、WS-LOCAL-001~003 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些变更触发最小回归？ | 每个变更至少跑直接TC族、主要suite、所有读取/写入该合同的入口suite及相关redaction/dependency/integrity check。 |
| 哪些触发全量回归？ | owner/data ownership、public contract、状态/phase、事务/幂等/unknown、visibility/no-write、generation/cursor、安全/redaction、依赖/fake、配置profile、EV聚合或release gate语义变化，以及任一S缺陷修复。 |
| 哪些风险暂不覆盖？ | 所有未闭合WS-UP/LOCAL正向接缝、正式staging/durable restart/crypto/downstream兼容、workload数值baseline、retention和06 AC/VETO。它们不是已接受，也不是passed。 |
| 谁接受残余风险？ | owning domain/架构/实现/安全/测试/验收/下游负责人按风险类型承担审查；最终是否接受由未来06明确的角色裁决。当前一律waiting_for_owner或waiting_for_06，无实际signoff。 |
| 哪些必须转入06？ | 一票否决、59 EV消费映射、formal seam阻断、S/A=0、风险接受、量化baseline姿态、固定run证据完整性以及不得以blocked形成ready。 |

## 4. 当前材料问题诊断

| 旧模板问题 | 风险 | 本步修正 |
|---|---|---|
| 只有协议/状态/配置/owner四类变更 | 测试工具、证据、visibility、cursor等无回归触发 | 覆盖设计到报告全链 |
| “残余WS-UP/LOCAL保持open”无逐项表 | 影响、缓解和责任角色不可审 | 逐 blocker 映射测试缺口与接受姿态 |
| 未定义全量P0集合 | “全量”无法执行 | 列出13 suite与formal-seam条件 |
| 未区分可接受与不得接受 | P0红线可能被风险签字绕过 | S/否决明确禁止风险接受 |
| 未说明回归证据 | 重跑可覆盖旧结果 | 每次新run，按Step13完整归档 |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| 触发 | 4个宽泛类型 | 13类变更→TC/CUT/suite/check |
| 全量 | 无枚举 | 12个local suite + formal-seam；report integrity同run |
| 风险 | 只提编号 | 12个既有blocker + baseline/06逐项 |
| 接受 | “保持open” | 未来角色、当前waiting、不可接受项分离 |
| 归档 | 未定义 | 回归/复验均新fixed run且保留原失败 |

## 6. 回归策略设计取舍

| 议题 | 采用方案 | 未采用方案及原因 |
|---|---|---|
| 是否所有变更都全量 | 风险分层最小集，红线/共享合同强制全量 | 全量虽简单但低效；仅局部又可能漏共享语义 |
| formal seam blocked时如何“全量” | 结果只能是blocked，不称全量通过 | 不从全量集合移除，也不用fake替代 |
| 文档变更是否回归 | 影响正式contract/TC/gate即回归并重审05 | 文案无语义变化只做文档/追溯审计 |
| 风险角色是否等于接受 | 只表示未来审查责任；当前waiting | 不伪造姓名、签署或acceptance |
| archive风险如何处理 | 只测下游read compatibility，保持串行waiting | 不让L4-archive反向定义workspace export truth |

## 7. 结构化中间产物

### 7.1 回归触发表

| 变更类型 | 最小回归集 | 全量触发条件 | 责任角色 |
|---|---|---|---|
| 00/01 owner/范围/依赖 | BOUND、DEP、受影响FR/BR追溯；read-model-boundary | owner/data ownership/no-write/dependency方向变化 | 设计+架构负责人 |
| public DTO/key/digest/error | CONTRACT/PAGE + 所有受影响入口；contracts-protocol | schema/version/metadata/digest/public错误变化 | contracts负责人 |
| 16对象/projector/状态 | STATE + 使用对象的入口族；domain-invariants | 不变量、正式variant、终态或phase变化 | domain负责人 |
| scope/visibility | SCOPE/VIS/QRY/SEC；query-no-write | current decision、publicability、fail-closed变化 | application+安全负责人 |
| 六Query/read/export | 对应QRY/PAGE/BOUND；query-no-write+api | write capability、freshness/coverage/availability、export边界变化 | application/API负责人 |
| 两Command/local | LOCAL/SCOPE/IDEM/TXN；maintenance+api | operation key、local version、事务写集变化 | application负责人 |
| 两Consumer/Inbox | SRC/INBOX/IDEM/TXN；maintenance+worker | event identity/order/gap/receipt/attention变化 | worker负责人 |
| 四Operation/recovery | REC/STATE/TXN/IDEM；maintenance+jobs | generation、attempt、basis、cutover、invalidation变化 | jobs/application负责人 |
| store/UoW/driver/cursor | TXN/IDEM/PAGE/RES；infra-adapter | atomicity/CAS/unknown/restart/crypto绑定变化 | infra负责人 |
| 配置/profile/secret/limits | CONFIG/RES/PAGE/SEC；infra+config check | required键、优先级、production fake、fail-fast变化 | config/infra负责人 |
| observability/redaction | SEC/BOUND及受影响入口；config-redaction | forbidden字段、label白名单、sink语义、扫描范围变化 | observability+安全负责人 |
| manifest/composition/fake | DEP/BOUND；dependency+read-model-boundary | compile边界或production装配变化 | 架构/infra负责人 |
| runner/report/EV/gate | 受影响sample suite + report-integrity | 状态聚合、digest/path、EV source、release阻断逻辑变化 | test tooling负责人 |
| S/A缺陷修复 | Step11规定的原TC→同族→CUT→suite/check | 任一S；共享A影响多个CUT | defect owner+测试负责人 |

### 7.2 最小回归选择算法

1. 用变更文件/合同定位一个或多个正式设计项与 CUT。
2. 选择该 CUT 的全部直接 TC，不允许只选曾失败的 happy path。
3. 加入消费该合同的14入口主例；公共DTO/error/config变化必须扩到所有消费入口。
4. 加入Step9主要suite和相邻层suite：contract/domain→service，service→entry/infra，entry/infra→boundary。
5. 若触及敏感输出、依赖、配置或报告，强制加入对应check。
6. 命中§7.3任一条件时升级为全量；无法判断影响范围也升级全量。
7. 以新run_id执行并按Step13保留全部状态；不得复用旧run或选择性丢弃失败。

### 7.3 全量 P0 回归集与触发

全量 P0 回归包含 Step9 的全部13个suite：

- contracts-protocol、domain-invariants、query-no-write、maintenance-consistency；
- infra-adapter-contract、read-model-boundary、api-read-surface；
- worker-consumer-boundary、jobs-recovery-boundary；
- config-redaction-check、dependency-boundary-check、report-integrity-check；
- formal-seam-conformance。

formal-seam-conformance 是全量集合的一部分；其当前blocked意味着目前不能产生“全量 P0 passed”结论。selected hardening是P1补充，不替代上述集合。

| 强制全量触发 | 原因 |
|---|---|
| owner/data ownership、compile/runtime/event/ref/adapter/fake方向变化 | 可能改变全仓边界 |
| public contract、key/digest/error、状态/phase变化 | 多入口共享 |
| visibility/no-write/publicability变化 | 安全红线 |
| transaction/idempotency/unknown/gap/cutover变化 | 一致性终局红线 |
| generation/cursor/secret/redaction变化 | 隔离与泄漏红线 |
| profile/source priority/production composition变化 | 环境姿态可能改变 |
| EV状态聚合、raw/report path/digest、release gate变化 | 证据真实性红线 |
| 任一S缺陷修复或影响范围未知 | 必须证明无系统性回归 |

### 7.4 残余风险与 blocker 表

| 风险 / ID | 未覆盖原因 | 影响 | 当前缓解 | 未来接受/关闭角色 | 当前姿态 |
|---|---|---|---|---|---|
| WS-UP-001 owner safe query/summary/version | 跨owner合同未统一 | fresh barrier、正向聚合不可证明 | no-write与缺失失败负例；formal suite保留 | 各owner+架构+验收 | waiting_for_owner；P0 positive blocked |
| WS-UP-002 event/cursor/replay/rebuild | 正式family/order/continuation未闭合 | realtime、gap bridge/rebuild不可证明 | 本地分类/phase负例，不承诺任意重放 | event owner+L0-bus+验收 | waiting_for_owner；blocked |
| WS-UP-003 visibility/authorization chain | 决定时效/撤销/owning chain未统一 | 正向可见性与撤权闭环不可证明 | 缺失/冲突/撤销fail-closed | owning domains+安全+验收 | waiting_for_owner；blocked |
| WS-UP-004 attention input | identity/dedup/lifecycle未对齐 | Inbox正向derive/reopen不可证明 | 禁止文本推测；无明示则不生成 | attention owners+验收 | waiting_for_owner；blocked |
| WS-UP-005 Personal/Project safe refs | scope key/query/error未闭口 | Provision与scope正向不可证明 | typed slot与mismatch负例 | identity/work owners+架构 | waiting_for_owner；blocked |
| WS-UP-006 downstream read/export | SDK/product/sync/archive合同未闭合 | 消费兼容不可证明 | 只读边界、无accepted/archive truth | 下游owners+验收 | waiting_for_downstream；blocked |
| WS-UP-006-S static seed/template | owner仍待确认 | 可能误把live view当seed | seed与read model分离 | member-images/下游owner | waiting_for_owner；blocked |
| WS-UP-007 L0-core专用合同 | shared type/event未确认 | compile/schema conformance不可证明 | 不本地shadow schema | L0-core+架构 | waiting_for_owner；blocked |
| WS-UP-008 personal execution subject | 执行主语未定义 | 下游执行接入不可证明 | workspace不代替runtime subject | runtime/product owner | waiting_for_owner；blocked |
| WS-LOCAL-001 durable driver | 产品/隔离/终局未选 | restart、atomicity、unknown终局不可证明 | controlled fault tests；不称durable | 本仓infra+架构+验收 | waiting_for_implementation；blocked |
| WS-LOCAL-002 config/transport/schema binding | endpoint/transport/exact schema未闭合 | staging装配不可运行 | strict missing→blocked/unavailable | 本仓infra+各owner | waiting_for_implementation；blocked |
| WS-LOCAL-003 crypto/UUID/CSPRNG pin | 产品与MSRV验证未完成 | cursor product/rotation不可证明 | synthetic local codec负例 | 本仓infra+安全 | waiting_for_implementation；blocked |
| workload / measurement baseline | 无正式workload/环境 | P95/吞吐/容量/SLA/RTO/RPO无裁决 | L/L+1语义测试，sample不判pass | 产品+架构+验收 | pending_baseline |
| retention / evidence schema exact | 归档policy/07实现未闭合 | 长期审计与digest实现未证明 | fixed run/path/可重算目标 | test tooling+运维+验收 | pending_07_06 |
| 06 AC/VETO/风险裁决 | 06尚未创建 | EV无法正式被验收消费 | 59 EV映射保持pending_06 | 验收负责人 | waiting_for_06 |

没有一项在本轮被接受或关闭。尤其L4-archive只能在L1-workspace停审后作为下游消费者继续设计，不能用其未完成合同反向改变workspace truth。

### 7.5 不可风险接受项

| 项 | 必须处置 |
|---|---|
| workspace拥有/反写任一上游、runtime、archive truth | 修复并全量回归 |
| visibility不可验证仍展示或泄露hidden metadata | 修复并全量回归 |
| Query写、隐式refresh或read cursor更新 | 修复并全量回归 |
| Gap终局化/跳过、Unknown盲重做、duplicate二次效果 | 修复并全量回归 |
| stale/partial/blocked冒充fresh/Complete/ready | 修复并全量回归 |
| generation/cursor轴混同或unsafe cutover | 修复并全量回归 |
| owner/outbound event/outbox/archive handoff出现 | 修复并全量回归 |
| secret/body/credential/敏感标识泄漏 | 修复、复扫所有输出并全量回归 |
| 非core sibling compile或production fake fallback | 修复并全量回归 |
| 静态EV、跨run拼接、latest、状态改写或缺raw报告 | 修复证据链；不得送验 |

### 7.6 必须转入 06 的事项

| 事项 | 06必须回答 |
|---|---|
| FR/BR/NFR/否决裁决 | 哪些AC/VETO消费哪些EV，如何判pass/fail/blocked |
| 59 EV实例完整性 | required sources、fixed run、redaction/integrity是否足以裁决 |
| formal seam blocker | 未解除时是否明确NotReady/Blocked，禁止删项豁免 |
| 缺陷门禁 | S=0、A=0及B风险接受条件 |
| 风险角色 | 谁有权接受哪些B/P2风险；不得接受S |
| 数值baseline | 未闭合时只保留pending；若硬化需定义workload/环境/阈值 |
| 报告边界 | acceptance草案不能自动生成verdict/signoff/readiness |
| archive串行边界 | L4仅为后续消费者，不作为当前证据或truth来源 |

### 7.7 回归证据归档

| 回归类型 | 要求 |
|---|---|
| 最小回归 | 新fixed run；context记录regression scope/触发合同；所选TC/suite完整raw/report/EV |
| 全量P0 | 13 suite均有状态；formal blocked则整体不得passed；完整redaction/dependency/integrity |
| 缺陷复验 | 原failed run保持；新run引用defect/原TC/扩大集/防回归变化 |
| blocker解除 | 新run使用正式seam manifest；不得升级旧fake EV |
| baseline补测 | 新run记录正式workload/baseline refs；旧sample不改写 |
| 风险审查 | acceptance/review材料引用固定run，不修改raw状态 |

### 7.8 停审与跨回归风险审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 设计/实现/config/test/report变更是否有触发 | pass | §7.1 |
| 最小集是否可算法化选择 | pass | §7.2 |
| 全量是否包含formal seam | yes | 当前因此blocked，不伪pass |
| 所有既有blocker是否保留 | pass；WS-UP-001~008/006-S、LOCAL-001~003 | 无关闭 |
| residual是否有角色 | yes，均为未来角色 | 0个实际接受/signoff |
| S/否决能否风险接受 | no | §7.5 |
| 06承接是否明确 | pass | §7.6 |
| 回归会否覆盖旧失败 | no；每次新run | §7.7 |
| archive是否反向定义 | no | 只读下游且串行 |

## 8. 对详细设计 / 配置的影响判定

未发现新增03/04缺口；本步只是测试回归/风险编排。任何owner合同闭合都必须先由owning project形成正式来源，再更新本项目相关Step和回归基线；当前写权限不跨项目，未执行回写。

## 9. 回填草稿

正式 §14 回填触发表、选择算法、全量集合、blocker风险、不可接受项、06承接和回归归档。正文必须写清所有接受角色均未实际签署，完整P0因formal seam仍blocked。

## 10. 待确认事项与进入下一步条件

- WS-UP-001~008/006-S、WS-LOCAL-001~003全部保持开放；另有baseline、retention/schema与06映射pending。
- 没有新增owning blocker，无跨项目回写权限。
- 回归策略可被07引用、风险可被06引用、无可接受P0红线；Step14通过，允许进入Step15正式装配。
