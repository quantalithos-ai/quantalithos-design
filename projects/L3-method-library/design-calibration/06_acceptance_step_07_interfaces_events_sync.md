# Step 7. 定义接口、事件与跨仓同步验收

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 7
> 回填章节: `06-验收标准.md` §7 接口、事件与跨仓同步验收
> 创建日期: 2026-06-28
> 当前模式: full-restart / step7-interfaces-events-sync
> 当前状态: completed_wait_user_confirm_to_R8.1
> 当前模块: `R7.2 interfaces events sync:再写入`
> 当前门禁: `R7.2` completed_wait_user_confirm_to_R8.1;等待确认进入 Step 8 `R8.1 state tx consistency:先思考`

---

## R7.1 interfaces events sync:先思考

### 1. 当前模块目标

`R7.1` 只思考新版 `06-验收标准.md` 的接口、事件、Operations Job 与跨仓同步验收如何从正式 `00`~`05` 收敛。当前模块承接 Step 5 的功能门禁和 Step 6 的数据 / 架构红线,但不写最终验收表,不修改正式 `06-验收标准.md`,不写真实 topic / route / scheduler / queue / CI,不补 DTO 字段 schema、artifact schema、port 或 implementation boundary。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R7.2 |
| 用户确认 | 已确认从 Step 6 completed 推进到 Step 7 `R7.1 interfaces events sync:先思考`。 |
| 当前允许 | 思考 Command / Query / Inbound / Outbound / Operations Job 验收候选、跨仓依赖类型、下游未就绪裁决、证据映射、P1/P2 防污染和 R7.2 写入边界。 |
| 当前禁止 | 修改正式 `06`;写 Step 8 状态机 / 事务 / 一致性门禁;写真实测试结论;定义 transport topic、HTTP/RPC path、worker、scheduler、queue 或 CI required check。 |

### 2. 本模块输入承接

| 输入 | R7.1 关注点 | 禁止外推 |
|---|---|---|
| Step 5 功能门禁 | `ML-FG-*` 已给出功能族、通过条件、失败条件和证据方向。 | 把功能门禁原样复制成接口门禁,或新增需求编号。 |
| Step 6 架构红线 | `ML-RL-*` 已固定 truth owner、body-free、query/job no-write、dependency boundary 和 P1/P2 防污染。 | 用接口同步验收绕过红线,或把下游完整实现写成 P0 前置。 |
| `00-需求文档.md` §12 / §14 | 接口与依赖验收方向、验收标准表和一票否决方向。 | 把旧实现绑定或未确认外围能力写入 P0。 |
| `01-架构设计.md` §8 | `L0-core` 编译期依赖、`L0-bus` 事件协作、process / identity / runtime / member-images 运行期消费、governance / artifact / marketplace / console / observability 外围或候选关系。 | 误要求 sibling 仓源码级依赖,或把事件协作写成编译期拥有。 |
| `02-概要设计.md` §7 / §8 | Command / Query / Inbound / Outbound / Job 骨架、八个组成部分流族和 58/57/4/34/8 覆盖数量。 | 把概要骨架扩成字段全集、真实 topic、outbox 表、worker 或 DDL。 |
| `03-详细设计.md` §7 / §8 | shared protocol helper、Command、Query、Inbound Consumer、Outbound Event、Operations Job public surface 和 161 flows。 | 新增 protocol、补 mapper / port、改变状态名或把 flow 中缺口私自闭合。 |
| `04-配置设计.md` | config、transport binding、adapter availability、handoff、profile 和 secret/redaction 边界。 | 在 `06` 写真实 secret、topic value、endpoint、scheduler 参数或部署细节。 |
| `05-测试方案.md` §5 / §6 / §13 | `TC-ML-*` 用例族、`EV-ML-*` 证据族、suite / report path 方向。 | 使用旧 EV / TC,或把 `latest` / 静态说明 / P1 selected-run 当 P0 正式证据。 |
| L1-governance Step 7 | framework_reference | 参考“依赖类型表 + 接口/事件/同步验收表 + 协议闭环矩阵 + 下游未就绪裁决 + 停审 + 审计”的粒度。 | 复制 governance 领域对象、AC-GOV、TC-GOV、EV-GOV 或协议数量。 |

### 3. SOP Step 7 问题思考

| SOP 问题 | R7.1 初判 | R7.2 写入提醒 |
|---|---|---|
| 每个 P0 Command / Query 如何验收? | Command 按八个组成部分覆盖 58 个正式命令流,验 accepted/rejected/duplicate/stored surface、truth side effect、body-free 和 evidence link。Query 覆盖 57 个读取流,验 visible/empty/not-visible/degraded/stale/failed、page 和 no-write。 | 写成 `ML-SYNC-001` / `ML-SYNC-002`,按协议族分组并回指正式 §7 / §8,不逐字段展开 DTO。 |
| 每个 P0 Event 如何证明可消费 / 可重放? | Inbound 4 个 consumer 只承接 body-free fact,验 envelope/version/dedup/receipt/unsupported no-parse/no-write。Outbound 34 个 event 只表达已成立 fact 或材料变化,验 candidate source、topic-neutral family、publisher failure 不回滚 truth。 | Inbound 与 Outbound 分开写,避免恢复旧 outbox / relay / raw topic 口径。 |
| 每个 P0 Job 如何证明幂等和恢复? | 8 个 Operations Job 只刷新派生材料、progress、checkpoint、report 或 recovery summary;duplicate / resume 只能从 stored report / checkpoint / issue source 恢复。 | 写 `ML-SYNC-005`,失败条件必须包含 job 修 core truth、重做正式化和 queue offset / lease 当 checkpoint。 |
| 跨仓同步成功标准是什么? | P0 不验下游仓完整实现。成功标准是本仓能按正式 ref、summary、marker、adapter、event candidate、handoff / report seam 处理输入输出并保留 body-free evidence。 | 写成 dependency seam 验收,与 Step 6 `ML-RL-006` 对齐。 |
| 下游未就绪时如何验接缝? | 使用 fake / controlled / disabled seam 验本仓行为。真实下游 unavailable 进入 delayed / degraded / failed / residual,不得伪造 P0 pass 或要求真实仓通过。 | 写下游未就绪裁决表。 |
| 跨仓验收项分别属于哪类依赖? | `L0-core` 是编译期;`L0-bus` 是事件协作;process / identity / runtime / member-images 是运行期消费或事件协作;governance / artifact / marketplace / console / observability 多为候选 / 外围 / handoff / downstream。 | R7.2 写依赖类型与验收方式映射表,不写源码依赖要求。 |
| 每类依赖应使用什么证据? | 编译期用 contract / dependency-boundary;运行期用 fake / controlled adapter 和 service/entry suite;事件协作用 consumer/outbound/publisher/replay evidence;handoff/report 用 entry-worker-job、operations-replay-core 和 report audit。 | 证据只引用 `EV-ML-*` 和正式 report path 候选。 |
| 每个验收项能否回指正式协议字段、状态名和测试证据? | 可以回指正式协议族、flow、状态面和测试族,但当前不补字段 schema。状态面应只使用正式 public surface 的 accepted/rejected/visible/degraded/stale/failed/receipt/report 等语义。 | R7.2 在协议闭环矩阵中写 formal protocol / topic-neutral family / job surface、TC、EV、report path 和裁决影响。 |
| 每个接口 / event / job 是否有固定 surface、测试用例、证据 ID 和 report path? | 有候选方向: command/query/consumer/outbound/job 主要接 `service-flow-fast`、`entry-worker-job`、`operations-replay-core`、`dependency-boundary`、`config-redline`。 | 不写真实 route/topic;只写 protocol name、topic-neutral family、job name 和 report path 模板。 |
| 下游未就绪时如何裁决通过 / 失败 / 有条件通过? | seam 本身通过则 P0 可通过;seam 缺失或违反 body-free/no-write 则失败;真实下游不可用只进 residual / risk,由 Step 13/14 收口。 | R7.2 写裁决表,禁止把 P1 real-like selected-run 当 P0。 |
| 每个接口 / 事件验收项完成后是否通过停审? | R7.1 只能形成停审维度:协议名正式、依赖类型正确、下游未就绪裁决清楚、证据固定、无旧口径污染。 | R7.2 写停审记录。 |
| 是否存在依赖类型误判、下游完整实现误要求、证据缺失或协议名漂移? | 需要 R7.2 全表后审计。R7.1 已识别高风险:旧 outbox/topic/HTTP 口径、旧 MethodContent 主线、P1/P2 selected-run 和 governance 强制依赖误判。 | R7.2 写跨接口同步门禁审计表。 |

### 4. 接口 / 事件 / Job 范围盘点

| 范围 | 正式覆盖 | R7.1 判断 | R7.2 处理 |
|---|---|---|---|
| Command API | 58 个 Command,按八个组成部分分组。 | P0 要验写入本仓 truth / boundary / summary / maintenance request / peripheral object 时的 accepted、rejected、duplicate 和 stored surface。 | 按组成部分分组列入 `ML-SYNC-001`,不逐字段展开。 |
| Query API | 57 个 Query,按八个读取面分组。 | P0 要验 no-write、body-free、visible / empty / not-visible / degraded / stale / failed / page surface。 | 写 `ML-SYNC-002`,并把 query repair / hidden write 写入失败条件。 |
| Inbound Event Consumer | 4 个 consumer,均属外部摘要与引用。 | 只承接 body-free external summary / source ref / artifact archive ref / body boundary violation。 | 写 `ML-SYNC-003`,必须包含 unsupported version no-parse/no-write。 |
| Outbound Event | 34 个 event,按八个 event family 摘要。 | 只表达已成立 fact、material state、maintenance progress 或 peripheral availability。 | 写 `ML-SYNC-004`,使用 topic-neutral family,不写 transport topic。 |
| Operations Job | 8 个 job。 | 只刷新 read material / trace material / progress / recovery summary,不得修 core truth。 | 写 `ML-SYNC-005`,并连接 replay / checkpoint / report evidence。 |
| Cross-repo dependency seam | `L0-core`、`L0-bus`、process、identity、runtime、member-images、governance、artifact、marketplace、console/SDK、observability、capability-hub。 | 需要区分 compile/runtime/event/handoff/downstream/peripheral。 | 写 `ML-SYNC-006` / `ML-SYNC-007`。 |
| Config / topic binding | transport binding 和 profile 属 `04`/`05` 证据。 | `06` 只能验 topic-neutral family 与 config binding 完整性方向。 | 可写 `ML-SYNC-008`,不写真实 topic 或 secret。 |

### 5. 验收项候选思考

| 候选 ID | 验收主题 | 通过方向 | 失败方向 | 证据候选 |
|---|---|---|---|---|
| ML-SYNC-001 | Command public protocol | 58 个 Command 按正式分组覆盖,metadata / actor / idempotency / accepted side effect / stored result / reject surface 成立。 | 缺任一 P0 Command;accepted 漏 truth/trace/event/report;duplicate 重跑 mutation;外部正文入仓。 | `TC-ML-TRUTH-*`;`TC-ML-FORMALIZATION-*`;`TC-ML-CONSUMPTION-*`;`TC-ML-IDEMP-*`;`EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` |
| ML-SYNC-002 | Query public protocol | 57 个 Query 只读正式 truth / material / summary / report / resolver output,返回 body-free public surface。 | query 写 truth、刷新 material、启动 job、泄露 body、用 stale material 私修。 | `TC-ML-QUERY-*`;`TC-ML-SHELL-*`;`TC-ML-MARKER-*`;`EV-ML-SERVICE-001` |
| ML-SYNC-003 | Inbound body-free consumer | 4 个 consumer 支持正式 envelope/version/dedup/receipt,unsupported no-parse/no-write,duplicate replay stored receipt。 | consumer 保存 raw payload、创建 core truth、从 broker offset 当 truth、unsupported 后仍解析正文。 | `TC-ML-CONSUMPTION-*`;`TC-ML-REDACTION-*`;`TC-ML-REPLAY-*`;`EV-ML-SERVICE-001`;`EV-ML-ENTRY-001` |
| ML-SYNC-004 | Outbound event / publisher | 34 个 event family 有正式 candidate source、topic-neutral family、publisher outcome 和 failure marker;publish 不从 current truth 重算。 | 恢复旧 outbox 主线;事件携带正文;publisher failure 回滚 accepted truth;topic family 缺失。 | `TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*`;`TC-ML-REPLAY-*`;`EV-ML-SERVICE-001`;`EV-ML-REPLAY-001` |
| ML-SYNC-005 | Operations Job | 8 个 job input/report/checkpoint/progress/partial failure/duplicate replay 成立,且只写派生材料和 safe report。 | job 修 core truth、重做 formalization、绕过消费边界、从 queue / lease / raw log 恢复。 | `TC-ML-JOB-*`;`TC-ML-UOW-*`;`TC-ML-RECOVERY-*`;`EV-ML-ENTRY-001`;`EV-ML-REPLAY-001` |
| ML-SYNC-006 | Cross-repo dependency type | 编译期、运行期、事件协作、handoff、downstream、peripheral 类型清楚;non-core sibling 不源码依赖。 | process / identity / governance / artifact / marketplace 等被写成源码级 truth owner。 | `TC-ML-DEPENDENCY-*`;`TC-ML-BOUNDARY-*`;`EV-ML-DEPENDENCY-001` |
| ML-SYNC-007 | Downstream-not-ready seam | fake / controlled / disabled seam 可证明本仓 P0 行为;真实下游 unavailable 进入 delayed/degraded/failed/residual。 | 下游未就绪被伪造为 P0 pass,或误要求真实下游完整实现。 | `TC-ML-AVAILABILITY-*`;`TC-ML-HANDOFF-*`;`EV-ML-INFRA-001`;`EV-ML-RISK-001` residual only |
| ML-SYNC-008 | Topic/config binding boundary | enabled topic-neutral family / publisher / consumer / job profile 有 config binding 证据方向,且 config 不改变协议语义。 | 在验收正文写真实 topic/secret/endpoint,或 config 改变 schema/truth/body-free/依赖类型。 | `TC-ML-CONFIG-*`;`TC-ML-PUBLISHER-*`;`EV-ML-CONFIG-001`;`EV-ML-DEPENDENCY-001` |

### 6. 跨仓依赖类型与证据映射候选

| 关联对象 | 依赖类型初判 | P0 验收方式候选 | 禁止误判 |
|---|---|---|---|
| `L0-core` | 编译期依赖 | shared typed ref / metadata / error / trace context contract;`contract-domain-fast`;`dependency-boundary`。 | 不得复制 core 类型或私造共享引用。 |
| `L0-bus` | 事件协作 | consumer / publisher fake seam、topic-neutral family、candidate / receipt / outcome evidence。 | 不得要求 bus 业务实现作为 compile dependency。 |
| `L1-process` | 运行期消费 / event candidate | process 只消费 template / method definition refs;本仓验 safe consumption material 和 boundary seam。 | 不保存 ProcessInstance、Activity、TaskUse 或运行状态。 |
| `L1-identity` | 运行期消费 / event candidate | identity 只消费 role / method semantic refs;本仓验 safe identity summary / method role definition boundary。 | 不保存成员生命周期、资格或实际角色状态。 |
| `L2-runtime` / `L2-member-images` | 运行期消费 / event candidate | runtime signal / member-image consumption summary 只作 safe marker 或 impact input。 | 不保存 runtime execution truth、tool result 或画像正文。 |
| `L1-governance` | 条件型运行期 / 事件协作 | 正式治理结论或依据引用可作为 formalization basis;disabled / unavailable 进 residual 或 blocked surface。 | 不执行治理裁决,不把 governance 作为全部 formalization 强制主链。 |
| `L1-artifact` | 候选 handoff / ref source | artifact / archive / evidence 只以 ref、digest、safe summary 和 lineage ref 承接。 | 不保存 artifact body、archive 包或 evidence file content。 |
| `L6-marketplace` | peripheral / downstream | package / distribution availability 只暴露 safe distribution ref 或 peripheral context。 | 不进入 listing、交易、安装、履约或订单 truth。 |
| `L5-console` / `L0-sdk` | downstream / entry consumer | UI/SDK 只消费 query/view/public shell。 | 不让 UI state 或 SDK helper 定义 truth。 |
| `L4-observability` | event / handoff / downstream | low-cardinality metric、body-free trace/audit/report handoff。 | 不把 logs/metrics/traces 作为 recovery source 或 truth。 |
| `L3-capability-hub` | adjacent / no direct dependency | 仅保留外围能力引用候选。 | 不把 capability registry / provider binding 写入核心闭环。 |

### 7. 下游未就绪裁决思考

| 场景 | R7.1 初判 | R7.2 写入提醒 |
|---|---|---|
| 运行期消费方不可用 | 使用 fake / controlled adapter 验本仓输出和 unavailable/degraded/failed surface。 | 不把真实 process / identity / runtime 未就绪判为 P0 failed,除非 seam 本身缺失。 |
| inbound source disabled / unsupported version | unsupported version 必须 no-parse/no-write;disabled source 应 rejected/skipped with safe reason。 | 不能解析 payload 后再拒绝。 |
| outbound publisher unavailable | accepted truth 不回滚;publication outcome / retry / failed marker 独立记录。 | 不能发布时从 current truth 重算 payload。 |
| handoff target unavailable | 写 safe handoff/report outcome 或 residual,不阻断已成立核心 truth。 | 不能让 handoff 状态反写真相。 |
| P1 real-like selected-run 未运行 | P0 不受影响;进入 Step 13 risk / residual。 | 不得标成 P0 passed 或 P0 failed。 |

### 8. P1 / P2 防污染思考

| 能力 / 材料 | R7.1 判断 | R7.2 写入提醒 |
|---|---|---|
| durable / real-like adapter | P1 selected-run。 | P0 用 fake / controlled seam 证明协议和边界,real-like 只补 residual。 |
| staging-like / production-like environment | P1/P2。 | 不写成 P0 接口同步前置。 |
| real bus / real publisher | P1 或部署层。 | P0 只验 topic-neutral family、candidate/outcome 和 config binding。 |
| MethodPlugin / MethodConfiguration | 外围增强。 | 不要求插件或配置生态完整实现。 |
| marketplace / console / SDK | downstream / peripheral。 | 不让交易、UI 或 SDK helper 决定验收通过。 |
| standard mapping / artifact deep integration | 候选扩展。 | 只能引用 ref / digest / safe summary,不写正文或 body。 |

### 9. 旧正式 06 污染思考

| 旧口径 | R7.1 判断 | R7.2 处理 |
|---|---|---|
| 旧 `MethodContent` CRUD / publish API | 与当前 MethodAssetDefinition / FormalMethodAssetVersion 主线不一致。 | 不进入 `ML-SYNC-*`。 |
| snapshot / fingerprint / export / compare | 当前正式版本不以 fingerprint / snapshot 成立。 | 不作为接口或 job 验收对象。 |
| outbox / relay / PostgreSQL / gateway | 属旧实现绑定或部署细节。 | Outbound 只写 event candidate / topic-neutral family / publisher outcome。 |
| 旧 HTTP route / DB evidence | 不属于当前 `EV-ML-*` 体系。 | 禁止作为证据来源。 |
| 旧 P95 / SLO | 非功能口径,且无当前硬阈值。 | Step 9 再处理。 |

### 10. R7.2 写入策略思考

R7.2 应写入 Step 7 的结构化中间产物,但仍不修改正式 `06-验收标准.md`。

| 写入范围 | 目的 |
|---|---|
| 跨仓依赖类型与验收方式映射表 | 固定 compile/runtime/event/handoff/downstream/peripheral 分类与证据方式。 |
| 接口 / 事件 / 同步验收表 | 固定 `ML-SYNC-*` 的接口族、协作方式、通过条件、失败条件和证据来源。 |
| 协议闭环矩阵 | 将 protocol / topic-neutral family / job surface、TC、EV、report path 和裁决影响连接起来。 |
| 下游未就绪裁决表 | 防止 fake/controlled/disabled seam 被误判,防止真实下游完整实现污染 P0。 |
| 接口 / 事件验收项停审记录 | 逐项审查协议名、依赖类型、证据路径、下游裁决和旧口径污染。 |
| 跨接口同步门禁审计表 | 审计依赖类型误判、源码依赖误要求、协议名漂移、证据缺失和范围越界。 |
| 回填草稿 | 提供未来 `06` §7 草稿,不写正式文档。 |

### 11. R7.2 写入边界思考

`R7.2 interfaces events sync:再写入` 可以写入:

1. `06_acceptance_step_07_interfaces_events_sync.md` 的 SOP 问题回答、跨仓依赖映射、`ML-SYNC-*` 验收表、协议闭环矩阵、下游未就绪裁决、停审记录、跨接口审计、回填草稿、待确认事项和进入 Step 8 条件。
2. `06_acceptance_calibration_flow.md` 推进到 Step 7 completed_wait_user_confirm_to_R8.1。
3. `project_execution_ledger.md` 推进到 `06` Step 7 completed_wait_user_confirm_to_R8.1。

`R7.2` 禁止写入:

1. 正式 `06-验收标准.md` 正文。
2. Step 8 状态机、事务、幂等和一致性正式门禁。
3. Step 9 非功能阈值、Step 10 证据真实性、Step 11 一票否决最终裁决。
4. 真实 topic、endpoint、secret、scheduler、queue、CI YAML、artifact schema、report schema、implementation boundary 或实现代码。

### 12. R7.1 stop-review

| 检查项 | 结果 |
|---|---|
| 是否按项目台账和 06 flow 恢复 | pass |
| 是否只推进 Step 7 R7.1 | pass |
| 是否承接 Step 5 功能门禁与 Step 6 架构红线 | pass |
| 是否读取 Step 7 SOP 和 L1-governance 框架 | pass |
| 是否承接 `00` 接口依赖验收、`01` 依赖裁剪、`02/03` protocol/flow、`05` TC/EV | pass |
| 是否识别 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 范围 | pass |
| 是否区分 compile/runtime/event/handoff/downstream/peripheral 依赖 | pass |
| 是否明确下游未就绪和 P1/P2 不污染 P0 | pass |
| 是否未填写真实测试 / 缺陷 / verdict 结论 | pass |
| 是否未修改正式 `06-验收标准.md` | pass |
| 是否形成 R7.2 写入边界 | pass |

next_allowed_action: 等待用户确认后进入 Step 7 `R7.2 interfaces events sync:再写入`;只允许写入 Step 7 的 SOP 问题回答、跨仓依赖类型与验收方式映射表、接口 / 事件 / 同步验收表、协议闭环矩阵、下游未就绪裁决表、接口 / 事件验收项停审记录、跨接口同步门禁审计表、回填草稿、待确认事项和进入 Step 8 条件,并推进 flow / project ledger;不得修改正式 `06-验收标准.md`、`07-实施计划.md`、CI YAML、脚本实现、真实执行结论、验收 verdict 或 implementation code。

---

## R7.2 interfaces events sync:再写入

### 13. R7.2 模块状态

| 项 | 内容 |
|---|---|
| 本模块状态 | completed_wait_user_confirm_to_R8.1 |
| 用户确认 | 已确认从 Step 7 `R7.1 interfaces events sync:先思考` 推进到 `R7.2 interfaces events sync:再写入`。 |
| 当前写入 | SOP 问题回答、跨仓依赖类型与验收方式映射表、接口 / 事件 / 同步验收表、协议闭环矩阵、下游未就绪裁决表、停审记录、跨接口同步门禁审计、回填草稿和进入 Step 8 条件。 |
| 当前禁止 | 修改正式 `06`;写状态机 / 事务一致性门禁;写真实 topic / endpoint / scheduler / queue / CI;补 DTO / artifact / report schema。 |

### 14. SOP 问题回答

| SOP 问题 | R7.2 回答 |
|---|---|
| 每个 P0 Command / Query 如何验收? | Command 按八个组成部分覆盖 58 个正式命令流,必须证明 actor / metadata / idempotency、accepted side effect、stored result、reject surface 和 body-free。Query 按八个读取面覆盖 57 个正式读取流,必须证明 no-write、body-free、visible / empty / not-visible / degraded / stale / failed / page surface。 |
| 每个 P0 Event 如何证明可消费 / 可重放? | 4 个 Inbound Consumer 必须用 body-free envelope、source event id、schema/version、dedup key 和 stored receipt 证明 accepted / ignored / rejected / duplicate replay;unsupported version 必须 no-parse/no-write。34 个 Outbound Event 只验 topic-neutral family、candidate source、publisher outcome 和 failure 不回滚 truth。 |
| 每个 P0 Job 如何证明幂等和恢复? | 8 个 Operations Job 必须证明 input scope、stored report、checkpoint/progress、partial failure、duplicate replay 和 no truth repair;resume 只能来自正式 checkpoint / report / issue source。 |
| 跨仓同步成功标准是什么? | P0 成功标准是本仓接缝行为成立:正式 ref / summary / marker / adapter / event candidate / handoff/report surface 可裁决,不要求下游仓完整实现。 |
| 下游未就绪时如何验接缝? | 使用 fake / controlled / disabled seam 验本仓行为;真实下游不可用进入 delayed / degraded / failed / residual,不得伪造通过或误判失败。 |
| 跨仓验收项属于哪类依赖? | `L0-core` 为编译期依赖;`L0-bus` 为事件协作;process / identity / runtime / member-images 为运行期消费或事件协作;governance / artifact / marketplace / console / observability 为条件型、handoff、downstream 或 peripheral。 |
| 每类依赖使用什么证据? | 编译期用 contract / dependency-boundary;运行期用 fake / controlled adapter 与 service / entry suite;事件协作用 consumer / outbound / replay evidence;handoff/report 用 entry-worker-job、operations-replay-core 和 report audit。 |
| 每个验收项能否回指正式协议字段、状态名和测试证据? | 可以回指正式 protocol family、flow family、public surface、`TC-ML-*`、`EV-ML-*` 和 report path;本 Step 不新增字段 schema 或状态名。 |
| 每个接口 / event / job 是否有固定 surface、测试用例、证据 ID 和 report path? | 有。见 §17 协议闭环矩阵;surface 使用 protocol family、topic-neutral event family 和 job surface,不写真实 route/topic。 |
| 下游未就绪如何裁决? | seam 通过则 P0 可通过;seam 缺失或违反 body-free/no-write/no-truth-repair 则失败;真实 selected-run 未执行只进 Step 13 residual。 |
| 每个接口 / 事件验收项是否通过停审? | 已按协议名、依赖类型、证据路径、下游裁决、P1/P2 防污染和旧口径污染停审。 |
| 是否存在依赖类型误判、下游完整实现误要求、证据缺失或协议名漂移? | 未发现 unresolved 冲突;仍保留“正式 `06` 是否展开全部 58/57/34 名称”作为正文长度取舍事项。 |

### 15. 跨仓依赖类型与验收方式映射表

| 关联对象 | 全局依赖类型 | 协作方式 | P0 验收方式 | 禁止误判 |
|---|---|---|---|---|
| `L0-core` | 编译期依赖 | shared ref / metadata / trace / error contract | `contract-domain-fast`;`dependency-boundary`;`EV-ML-CONTRACT-001`;`EV-ML-DEPENDENCY-001` | 不复制 core 类型,不私造 shared ref。 |
| `L0-bus` | 事件协作 | inbound / outbound delivery seam | fake bus、topic-neutral family、receipt/candidate/outcome evidence | 不把 bus 业务实现写成 compile dependency。 |
| `L1-process` | 运行期消费 / event | template / method definition consumption | consumption material、boundary guard、service-flow evidence | 不保存流程执行实例或过程运行状态。 |
| `L1-identity` | 运行期消费 / event | role / identity-related method semantic consumption | safe identity summary、role-definition ref seam | 不保存成员身份、生命周期或实际角色状态。 |
| `L2-runtime` / `L2-member-images` | 运行期消费 / event | runtime / member-image summary feedback | controlled adapter、availability marker、impact summary evidence | 不保存 runtime execution truth、tool result 或画像正文。 |
| `L1-governance` | 条件型运行期 / event | formal conclusion / basis ref | fake/disabled governance conclusion seam、formalization basis evidence | 不执行治理裁决,不写成所有 formalization 的强制前置。 |
| `L1-artifact` | handoff / ref source | artifact / archive / evidence refs | ref/digest/lineage evidence、redaction-boundary、report audit | 不保存 artifact body、archive 包或 evidence file content。 |
| `L6-marketplace` | peripheral / downstream | distribution / package context candidate | peripheral safe context、availability marker、residual when real-like | 不进入 listing、交易、安装或履约 truth。 |
| `L5-console` / `L0-sdk` | downstream consumer | public query/view consumption | query surface、entry shell、body-free response evidence | 不让 UI state 或 SDK helper 定义 truth。 |
| `L4-observability` | event / handoff / downstream | metric / trace / audit / report handoff | observability-boundary、report-generation-audit | 不让 logs/metrics/traces 成为 recovery source。 |
| `L3-capability-hub` | adjacent / no direct dependency | peripheral capability reference candidate | dependency-boundary residual / no direct compile dependency | 不把 capability registry 或 provider binding 写入核心闭环。 |

### 16. 接口 / 事件 / 同步验收表

| 验收项 ID | 接口 / 事件 / 下游 | 全局依赖类型 | 协作方式 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|---|---|
| ML-SYNC-001 | 58 Command public protocol | 本仓 public command API | command request / response / stored result | 八个组成部分命令族均覆盖 actor、metadata、idempotency、accepted side effect、stored result、reject 和 body-free。 | 缺正式命令族;accepted 漏 truth/trace/event/report;duplicate 重跑 mutation;保存外部正文。 | `TC-ML-TRUTH-*`;`TC-ML-FORMALIZATION-*`;`TC-ML-CONSUMPTION-*`;`TC-ML-IDEMP-*`;`EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` |
| ML-SYNC-002 | 57 Query public protocol | 本仓 read API | query request / view / page / diagnostic surface | 八个读取面均只读正式 truth/material/summary/report/resolver output,返回 body-free visible/empty/degraded/stale/failed surface。 | query 写 truth、刷新 material、启动 job、泄露正文、用 stale material 私修。 | `TC-ML-QUERY-*`;`TC-ML-SHELL-*`;`TC-ML-MARKER-*`;`EV-ML-SERVICE-001` |
| ML-SYNC-003 | 4 Inbound Event Consumer | event/runtime seam | body-free envelope + stored receipt | 四个 consumer 支持 schema/version、source event id、dedup、accepted/ignored/rejected、duplicate replay 和 unsupported no-parse/no-write。 | 接收 raw payload;consumer 创建 core truth;broker offset 成为 truth;unsupported 仍解析正文。 | `TC-ML-CONSUMPTION-*`;`TC-ML-REDACTION-*`;`TC-ML-REPLAY-*`;`EV-ML-SERVICE-001`;`EV-ML-ENTRY-001` |
| ML-SYNC-004 | 34 Outbound Event / publisher | event collaboration | event candidate + publisher outcome | 八个 event family 均有正式 candidate source、topic-neutral family、publisher outcome 和 failure marker;publish 不从 current truth 重算。 | 恢复旧 outbox 主线;事件携带正文;publisher failure 回滚 accepted truth;topic-neutral family 缺失。 | `TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*`;`TC-ML-REPLAY-*`;`EV-ML-SERVICE-001`;`EV-ML-REPLAY-001` |
| ML-SYNC-005 | 8 Operations Job | job / recovery seam | job request / report / checkpoint / progress | 八个 job 均证明 input scope、stored report、checkpoint/progress、partial failure、duplicate replay 和 no truth repair。 | job 修 core truth、重做 formalization、绕过消费边界、从 queue/lease/raw log 恢复。 | `TC-ML-JOB-*`;`TC-ML-UOW-*`;`TC-ML-RECOVERY-*`;`EV-ML-ENTRY-001`;`EV-ML-REPLAY-001` |
| ML-SYNC-006 | cross-repo dependency type | compile/runtime/event/handoff/downstream | ref / summary / adapter / event / report seam | 依赖类型清楚;除 `L0-core` 外无 sibling compile dependency;runtime/event 用 seam 证明。 | 下游业务仓被写成源码级 truth owner,或 runtime/event 协作被误判为 compile dependency。 | `TC-ML-DEPENDENCY-*`;`TC-ML-BOUNDARY-*`;`EV-ML-DEPENDENCY-001` |
| ML-SYNC-007 | downstream-not-ready seam | runtime/event/handoff | fake / controlled / disabled adapter | 下游未就绪时仍能给出 body-free delayed/degraded/failed/residual surface,且不改 core truth。 | 下游不可用被伪造为 P0 pass,或真实下游完整实现被误设为 P0 前置。 | `TC-ML-AVAILABILITY-*`;`TC-ML-HANDOFF-*`;`EV-ML-INFRA-001`;`EV-ML-RISK-001` residual only |
| ML-SYNC-008 | topic / config binding boundary | config + event seam | topic-neutral family -> config binding | enabled consumer/outbound/publisher/job profile 有 config binding 证据方向;config 不改变协议语义。 | 在验收正文写真实 topic/secret/endpoint,或 config 改变 schema、truth、body-free、依赖类型。 | `TC-ML-CONFIG-*`;`TC-ML-PUBLISHER-*`;`EV-ML-CONFIG-001`;`EV-ML-DEPENDENCY-001` |

### 17. 协议闭环矩阵

| 验收项 ID | 正式协议 / topic-neutral family / job surface | 测试用例 | 证据 ID | report path | 裁决影响 |
|---|---|---|---|---|---|
| ML-SYNC-001 | 八个 Command 组: definition/catalog、formalization/version、consumption、trace/protection、relation/distribution、external summary/ref、maintenance request、package/method-set。 | `TC-ML-TRUTH-*`;`TC-ML-FORMALIZATION-*`;`TC-ML-CONSUMPTION-*`;`TC-ML-IDEMP-*` | `EV-ML-CONTRACT-001`;`EV-ML-SERVICE-001` | `reports/runs/<run_id>/suites/contract-domain-fast.md`;`reports/runs/<run_id>/suites/service-flow-fast.md` | 任一 P0 command family 缺失或 replay 失效则不通过。 |
| ML-SYNC-002 | 八个 Query 组: definition/catalog、formalization/version、consumption、trace/audit、relation/distribution、external、maintenance、peripheral。 | `TC-ML-QUERY-*`;`TC-ML-SHELL-*`;`TC-ML-MARKER-*` | `EV-ML-SERVICE-001` | `reports/runs/<run_id>/suites/service-flow-fast.md` | query no-write 或 body-free 失败则不通过。 |
| ML-SYNC-003 | `ConsumeBodyFreeExternalSummaryAccepted`;`ConsumeExternalSourceRefRegistered`;`ConsumeArtifactArchiveRefRegistered`;`ConsumeExternalBodyBoundaryViolation`。 | `TC-ML-CONSUMPTION-*`;`TC-ML-REDACTION-*`;`TC-ML-REPLAY-*` | `EV-ML-SERVICE-001`;`EV-ML-ENTRY-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/entry-worker-job.md` | consumer 保存正文或 unsupported 解析正文则不通过。 |
| ML-SYNC-004 | 八个 Outbound family: definition/catalog、formalization/version、consumption/boundary、trace/impact/audit、relation/distribution、external/ref、maintenance/recovery、peripheral/package。 | `TC-ML-PUBLISHER-*`;`TC-ML-HANDOFF-*`;`TC-ML-REPLAY-*` | `EV-ML-SERVICE-001`;`EV-ML-REPLAY-001` | `reports/runs/<run_id>/suites/service-flow-fast.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | stored candidate / publisher outcome 缺失则不通过。 |
| ML-SYNC-005 | `RefreshCatalogAndDefinitionReadMaterials`;`RefreshFormalVersionReadMaterials`;`RefreshConsumptionReadMaterials`;`RefreshRelationDistributionMaterials`;`RefreshExternalSummaryReadMaterials`;`RefreshTraceAuditImpactMaterials`;`RunConsistencyRecoveryConvergence`;`RefreshPeripheralReadMaterials`。 | `TC-ML-JOB-*`;`TC-ML-UOW-*`;`TC-ML-RECOVERY-*` | `EV-ML-ENTRY-001`;`EV-ML-REPLAY-001` | `reports/runs/<run_id>/suites/entry-worker-job.md`;`reports/runs/<run_id>/suites/operations-replay-core.md` | job 反写真相或 duplicate 失效则不通过。 |
| ML-SYNC-006 | compile/runtime/event/handoff/downstream dependency seam。 | `TC-ML-DEPENDENCY-*`;`TC-ML-BOUNDARY-*` | `EV-ML-DEPENDENCY-001` | `reports/runs/<run_id>/suites/dependency-boundary.md` | non-core sibling compile dependency 则不通过。 |
| ML-SYNC-007 | fake / controlled / disabled seam and downstream unavailable surface。 | `TC-ML-AVAILABILITY-*`;`TC-ML-HANDOFF-*` | `EV-ML-INFRA-001`;`EV-ML-RISK-001` residual only | `reports/runs/<run_id>/suites/infra-runtime-fake.md`;`reports/runs/<run_id>/acceptance/risk-acceptance.md` | seam 缺失或伪造下游 truth 则不通过。 |
| ML-SYNC-008 | topic-neutral binding and profile boundary。 | `TC-ML-CONFIG-*`;`TC-ML-PUBLISHER-*` | `EV-ML-CONFIG-001`;`EV-ML-DEPENDENCY-001` | `reports/runs/<run_id>/suites/config-redline.md`;`reports/runs/<run_id>/suites/dependency-boundary.md` | enabled binding 缺失或 config 改协议语义则不通过。 |

### 18. 下游未就绪裁决表

| 场景 | P0 裁决 | 证据要求 | 不允许 |
|---|---|---|---|
| runtime / consumer 仓不可用 | 使用 fake / controlled adapter 证明本仓 delayed/degraded/failed surface;真实不可用进 residual。 | `infra-runtime-fake`;`service-flow-fast`;safe marker。 | 伪造下游 truth 或要求下游完整实现。 |
| inbound source disabled / unsupported | rejected / skipped / ignored with safe reason;unsupported no-parse/no-write。 | consumer receipt、replay evidence、redaction check。 | 解析 payload 后再拒绝。 |
| outbound publisher unavailable | accepted truth 不回滚;publication failed/retry marker 独立记录。 | stored candidate、publisher outcome、operations replay report。 | publisher failure 回滚 truth 或重算 payload。 |
| handoff / artifact target unavailable | handoff/report outcome 或 residual,核心 truth 不受影响。 | entry-worker-job、report-generation-audit、redaction-boundary。 | handoff 状态反写真相或保存 body。 |
| real-like selected-run 未执行 | P0 不受影响;Step 13 记录 residual / risk。 | `EV-ML-RISK-001` when selected-run is explicitly requested。 | 标成 P0 passed 或 P0 failed。 |

### 19. 接口 / 事件验收项停审记录

| 验收项 ID | 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|---|
| ML-SYNC-001 | Command 数量、分组、accepted/rejected/duplicate/stored surface 是否正式 | 通过 | 正式 `06` 可摘要分组,不必展开 58 个名称。 |
| ML-SYNC-002 | Query no-write、visibility/degraded/page surface 是否固定 | 通过 | Step 8 继续加严事务 / 一致性无写审计。 |
| ML-SYNC-003 | Inbound body-free、unsupported no-parse、receipt replay 是否固定 | 通过 | Step 10 继续审计 evidence / report 中无 raw body。 |
| ML-SYNC-004 | Outbound candidate、topic-neutral family、publisher outcome 是否固定 | 通过 | 真实 transport topic 留给配置证据,不进入本 Step。 |
| ML-SYNC-005 | Job input/report/checkpoint/duplicate/no truth repair 是否固定 | 通过 | Step 8 继续加严 checkpoint / UoW / replay。 |
| ML-SYNC-006 | 跨仓依赖类型是否正确 | 通过 | 除 `L0-core` 外不要求 sibling compile dependency。 |
| ML-SYNC-007 | 下游未就绪裁决是否清楚 | 通过 | P1 selected-run 留 Step 13 residual。 |
| ML-SYNC-008 | config/topic binding 边界是否避免泄露部署细节 | 通过 | 不写真实 topic、endpoint、secret 或 scheduler 参数。 |

### 20. 跨接口同步门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 是否存在 P0 public protocol 缺门禁 | 未发现 | 58 Command、57 Query、4 Inbound、34 Outbound、8 Job 均覆盖。 |
| 是否存在依赖类型误判 | 未发现 | compile/runtime/event/handoff/downstream/peripheral 已区分。 |
| 是否误要求下游完整实现 | 未发现 | P0 只验 ref / summary / adapter / event / handoff / report seam。 |
| 是否存在 topic / route / scheduler 误写 | 未发现 | 只写 topic-neutral family 和 job surface。 |
| 是否存在 P1/P2 污染 P0 | 未发现 | real-like、staging-like、real bus、marketplace、console 均不作 P0 前置。 |
| 是否存在证据路径断裂 | 未发现设计层断裂 | 正式验收仍需后续 Step 固定 run-scoped evidence 和 final signoff。 |
| 是否存在旧 `06` 口径污染 | 未发现写入污染 | 旧 MethodContent、publish、snapshot、outbox、PostgreSQL、gateway、P95 均未进入验收项。 |

### 21. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_07_interfaces_events_sync.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“跨仓依赖类型与验收方式映射表”“接口 / 事件 / 同步验收表”“协议闭环矩阵”“下游未就绪裁决表”“接口 / 事件验收项停审记录”和“跨接口同步门禁审计表”小节,了解接口、事件与跨仓同步验收如何从正式协议、处理流、配置边界、测试证据和依赖裁剪收敛。

正式 `06-验收标准.md` §7 应回填:

- P0 接口验收覆盖 58 个 Command、57 个 Query、4 个 Inbound Event Consumer、34 个 Outbound Event 和 8 个 Operations Job。
- Command 必须证明 actor / metadata / idempotency、accepted transaction side effects、stored result、reject surface 和 body-free。
- Query 必须证明 no-write 和 body-free visible / empty / not-visible / degraded / stale / failed / page surface。
- Inbound Consumer 必须证明 body-free envelope、schema/version、dedup、stored receipt replay 和 unsupported no-parse/no-write。
- Outbound Event 必须证明 topic-neutral family、candidate source、publisher outcome 和 publisher failure 不回滚 truth。
- Operations Job 必须证明 input scope、stored report、checkpoint/progress、partial failure、duplicate replay 和 no truth repair。
- 跨仓验收必须区分 compile/runtime/event/handoff/downstream/peripheral 依赖类型;除 `L0-core` 外不得要求 sibling compile dependency。
- 下游未就绪时 P0 只验 fake / controlled / disabled seam;真实 selected-run 不作为 P0 通过前置。

### 22. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 正式 `06` 是否展开全部 58 Command / 57 Query / 34 Event 名称 | 影响正文长度 | 中间产物按分组和数量闭环;正式 `06` 可摘要并引用本文件。 |
| P1 real-like bus / publisher / downstream selected-run 是否在某 release 升级为强制项 | 影响 Step 13 / Step 14 风险接受 | 当前不作为 P0 前置。 |
| topic-neutral family 到真实 transport topic 的绑定是否需要在 `04` 补更细 report 样例 | 影响 config evidence 可读性 | 当前只要求 `EV-ML-CONFIG-001`,不补 config schema。 |

### 23. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 接口、事件和同步都有裁决口径 | 通过 | 见 §16 / §17。 |
| 跨仓依赖类型已区分 | 通过 | 见 §15。 |
| 下游未就绪裁决清楚 | 通过 | 见 §18。 |
| 接口 / 事件验收项已停审 | 通过 | 见 §19。 |
| 跨接口同步门禁审计无 unresolved 冲突 | 通过 | 见 §20。 |
| 可进入 Step 8 | 通过 | 下一步定义状态机、事务与一致性验收;进入前等待用户确认。 |

### 24. R7.2 stop-review

| 检查项 | 结果 |
|---|---|
| 是否只推进 Step 7 R7.2 | pass |
| 是否完成 SOP Step 7 期望产出 | pass |
| 是否覆盖 58 Command、57 Query、4 Inbound、34 Outbound、8 Job | pass |
| 是否使用 L3-local `ML-SYNC-*` 而非 governance ID | pass |
| 是否区分编译期 / 运行期 / 事件 / handoff / downstream / peripheral 依赖 | pass |
| 是否未要求下游仓完整实现 | pass |
| 是否未写真实 topic / route / endpoint / scheduler / queue / CI | pass |
| 是否未补 DTO / artifact / report schema 或 port | pass |
| 是否未修改正式 `06-验收标准.md` | pass |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.1 state tx consistency:先思考`;只允许思考状态机、事务、幂等、重入、一致性和恢复验收门禁;不得修改正式 `06-验收标准.md`、不得进入 Step 9 或实施计划。
