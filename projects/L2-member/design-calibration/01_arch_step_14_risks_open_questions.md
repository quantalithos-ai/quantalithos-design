# Step 14. 风险与待确认事项

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 14
> 对应书写规范: `standards/document/架构设计书写规范.md` §4.15
> 回填位置: 正式 `01-架构设计.md` §15
> 日期: 2026-08-22
> 状态: `pass`
> 串行门禁: Step 1~13 已通过;本文件通过前未创建 Step 15

## 1. Step 内计划

| 阶段 | 动作 | 状态 |
|---|---|---|
| 问题回答 | 识别未关闭风险、缺失确认、影响与阻塞性 | completed |
| 当前诊断 | 合并需求风险、开放 seam、Step 13 债务与最新 sibling 状态 | completed |
| 分类取舍 | 风险 / question / debt / trigger / veto 分开 | completed |
| 结构化 | 形成风险表、待确认表、blocker 影响表 | completed |
| 回填草稿 | 按正式 §15 固定结构收口 | completed |
| 门禁 | 检查无 TODO、实施动作、假挂起或脑补结论 | pass |

## 2. 本步输入与判定口径

| 输入 | 本步用途 |
|---|---|
| 正式 00 R-L2M-001~010 | 需求层已识别风险。 |
| 正式 00 Q-L2M-001~009 / L2M-UP-001~008 | 外部信息缺口与挂起上限。 |
| Step 3~12 | owner、依赖、数据、通信、机制、取舍和横切红线。 |
| Step 13 | 可接受 / 不可接受债务、阶段裁剪与触发条件。 |
| sibling formal 00 / current 01 / ledgers | 需求级 owner 已闭口;member-images 正式 01 的 supply / release 方向已 drift-check,exact detailed contracts 仍 pending。 |

判定规则:

- 已知会破坏主线但尚需持续防止的问题记为风险。
- 缺正式 owner / contract / workload / scope 答案的问题记为待确认事项。
- 可接受债务不因“未完成”自动升格为风险。
- 已关闭的阶段判断不继续假挂起;只记录关闭口径。
- “阻塞”必须写明阻塞哪个 lane,不能把正向 schema blocker 写成正式架构文档 blocker。

## 3. SOP 问题回答

### 3.1 当前尚未关闭的架构风险

| 风险 ID | 风险判断 | 主要来源 |
|---|---|---|
| RA-L2M-001 | member / Runtime / host owner 在详细合同中重新混写 | R-L2M-001 / 004;L2M-UP-001 / 003 |
| RA-L2M-002 | screening 被实现成 local policy / allowlist 或 unknown fail-open | R-L2M-002;L2M-UP-007 |
| RA-L2M-003 | outcome / decision / attempt / delivery / observed / accepted / healthy 被压成单 success | R-L2M-003;CC-L2M-008 |
| RA-L2M-004 | raw / hidden / secret / definition / evidence body 经 debug、handoff、trace、projection 或 retention 入仓 | R-L2M-007 / 010;CC-L2M-002 / 015 |
| RA-L2M-005 | Core shared authority 未闭口时私造 member DTO / event / route 或引入 sibling private schema | R-L2M-008;L2M-UP-005 |
| RA-L2M-006 | timeout / unknown side effect 被自动 replay、restart、fallback 或覆盖历史 | NFR-L2M-011 / 012;CC-L2M-010 |
| RA-L2M-007 | Mirror / Read / capability outlet 膨胀为 registry、authorization、configuration truth 或 write-back | R-L2M-006;TM-L2M-004 / 013 / 014 |
| RA-L2M-008 | Trace 膨胀为 complete log、Evidence / verdict 或 observability backend | R-L2M-007;BC-L2M-05 |
| RA-L2M-009 | 非项目型场景以 GlobalMember / Workspace view 代执行主语 | R-L2M-009;L2M-UP-008 |
| RA-L2M-010 | 旧 Rust / UDS / gRPC / supervisord / launch token / AG-UI /固定指标整包回流 | R-L2M-005;historical audit |
| RA-L2M-011 | runtime / event / ref / adapter / fake 关系被伪装成 package dependency 或 positive integration | BR-L2M-028 / 029;CC-L2M-016 |
| RA-L2M-012 | sibling 详细合同变化与当前 owner / static-supply 边界发生冲突却未回开校准 | L2M-UP-001 / 002;Step 13 refresh |

### 3.2 风险影响与阻塞判断

| 风险类型 | 影响结构 | 当前保守口径 | 阻塞判断 |
|---|---|---|---|
| owner / state flatten | BC01~05、数据 ownership、关键交互 | unique owner + local / external layering | 违反时阻塞受影响下游设计 |
| screening / subject | Presence、Inbound、授权前提 | project-scoped + source-anchored conservative handling | 违反时阻塞正向 lane |
| forbidden body / trace expansion | BC02~07、lifecycle、audit | transient inspection only + body-free + ref 回源 | 违反时阻塞全部受影响设计 |
| schema / dependency pollution | External Boundary、Technical Carrier、compile crop | Core-only compile;schema / route pending | 有条件阻塞正向 contract / integration |
| unknown replay / false readiness | continuation、恢复、测试 /验收证据 | fenced + planned / fake / attempt 分层 | 违反时阻塞实施 / 验收 |
| sibling drift | host / image supply / deployment | 只消费正式需求级结论,详细合同冲突即重开 | 当前不阻塞;冲突时有条件阻塞 |
| historical pollution | 技术选型、部署、配置、指标 | historical-only;需当前 authority 重新证明 | 当前不阻塞;未经证明不得进入定论 |

### 3.3 当前待确认事项

| 待确认 ID | 缺失答案 | 影响范围 | 当前挂起上限 |
|---|---|---|---|
| Q-L2M-001 / L2M-UP-001 / 006 | host 字段 / IPC、startup credential owner / issue / revoke / verification 合同 | BC01、Step 6 / 9、后续 02~05 | owner 分层成立;详细正向入口 fail closed。 |
| Q-L2M-002 / L2M-UP-003 | member controlled context 到 Runtime EntryAuthority 的 typed mapping、acceptance / unknown 语义 | BC03、02 / 03 / 05 | 只保留 transport-neutral entry seam;mapping blocked。 |
| Q-L2M-003 / L2M-UP-007 | screening rule source matrix 与风险 taxonomy | BC02、04 / 05 | 四态 + conservative handling;不建 local allowlist。 |
| Q-L2M-004 / 005;L2M-UP-004 / 005 | committed material / observation source family、member-specific schema / event family / route | BC04 / 05、02~05 | body-free material + local attempt / gap;不声明 delivered / observed。 |
| Q-L2M-007 | trace / observation retention、archive、reconciliation lifecycle | BC05、03 / 04 / 05 | immutable / body-free 先成立;物理策略 pending。 |
| Q-L2M-009 / L2M-UP-008 | 非项目型 / personal 第三种执行主语、身份关联与生命周期 | BC01~05 / 07 | 当前仅 project-scoped;其他 fail closed。 |
| L2M-UP-002 | member component release shape、image manifest / version / compatibility / pinned entry handoff / confirmation 详细合同 | Step 6 static supply / host collaboration | member-images 正式 01 的 owner / direction 可消费;exact contract 不进入运行语义,也不生成 readiness。 |
| AQ-L2M-001 | 本地 truth 的物理 store / transaction / durability / recovery 与 idempotency carrier | BC01~05、后续 03 / 04 / 05 | 只锁 logical local consistency / append / fence。 |
| AQ-L2M-002 | workload、stage budget、SLO、capacity、backpressure 与配置量化 | Step 9 / 12 / 13、后续 04 / 05 / 06 | 无来源数字不生效;只保留可测 stage。 |
| AQ-L2M-003 | downstream read carrier / SDK binding 与 capability outlet consumer contract | BC07、后续 02~05 | Member Summary 保留;outlet 激活可裁剪且非 authorization。 |

### 3.4 已关闭或当前范围不成立的旧问题

| 项 | 当前结论 | 是否继续 open |
|---|---|---|
| Q-L2M-006 capability outlet 首批范围 | Step 13 已定“BC07 结构保留,正向激活可裁剪” | no;激活合同进入 AQ-L2M-003 |
| Q-L2M-008 outbound governance prerequisite | 当前无正式场景,不建立主路径;正式需求出现时回开 Step 4 / 8 / 9 / 10 / 12 | no for current scope |
| sibling owner / supply 是否可引用 | 两个 sibling 正式 00 均已停审,需求级方向可引用 | no;详细合同仍分别挂 L2M-UP-001 / 002 |
| Rust / UDS / gRPC / supervisord / launch token 是否当前选择 | 无 current authority,保持 historical / deferred | no;不是待确认主线问题 |

### 3.5 是否影响前文成立

当前待确认事项不推翻前文的 owner、数据、依赖、通信和 fail-closed 结论;它们限制的是正向 carrier、schema、配置、测试、联调和 readiness。如果未来正式合同要求 host / Runtime 接管 member core decision、允许 raw body、引入非 Core compile dependency、由 projection 授权或允许 unknown 自动重放,则不是“细节闭口”,而是与当前基线冲突,必须回开相关 Step 和正式架构评审。

## 4. 当前材料诊断

| 材料 | 问题 | 本步处理 |
|---|---|---|
| 正式 00 R / Q / UP 表 | 混有风险、question、sibling 当时状态和已被架构吸收项 | 保留 ID,按当前架构影响重新分类。 |
| Step 13 债务表 | “未锁定”不等于正式风险 | 只有会影响主线判断且未关闭的项进入本步。 |
| sibling 状态已更新 | 截至 2026-08-23,member-service 正式 01 为 Step 16 allowed、尚未停审;member-images 正式 01 已 stop_review | 对 member-images 正式 01 做 supply / release / consumer drift check,确认无冲突;service 仍只消费正式 00。exact contracts 继续 pending,不篡改已批准需求语义或生成 readiness。 |
| 旧正式 01 的协议 / 产品 /指标 | 容易被误写成待确认候选 | 保持 historical;没有 current authority 不进入选择题。 |
| planned / fake / pending seam | 容易让“设计存在”变成“集成存在” | 作为 RA-L2M-011 持续约束证据表达。 |

## 5. 分类取舍

| 方案 | 结果 | 结论 |
|---|---|---|
| 汇总所有未实现项为风险 | 架构被任务 backlog 淹没,并把层级后移误判为失败 | 不采用 |
| 风险 / question / debt / trigger / veto 分层 | 可判断什么能成文、什么阻塞正向 lane、什么必须回开 | 采用 |
| 所有 pending 阻塞 Step 15 / 16 | 迫使架构层私造详细合同或无限等待并行仓 | 不采用 |
| 所有 pending 均不阻塞任何下游 | 会允许 schema、配置、测试和 readiness 脑补 | 不采用 |

## 6. 结构化中间产物与正式回填草稿

### 6.1 风险表

| 风险项 | 影响范围 | 当前处理口径 | 是否阻塞 | 说明 |
|---|---|---|---|---|
| owner 与状态分层在下游被压平 | BC01~05、数据 / 交互 /恢复主线 | unique owner、local truth first、external feedback append-only | 有条件阻塞 | 不阻塞正式 01;任何冲突设计不得进入正向 lane。 |
| screening / subject 安全前提被绕过 | Presence / Inbound、订阅与投递 | project-scoped、source-anchored、unknown conservative | 有条件阻塞 | non-project / unknown 不能降级放行。 |
| forbidden body 与 trace / retention 扩张 | BC02~07、数据生命周期、审计 | transient inspection only,其余 body-free / ref 回源 | 有条件阻塞 | 违反即否决受影响下游设计。 |
| shared schema / dependency / adapter 污染 | compile crop、External Boundary、Technical Carrier | Core-only compile;private schema 禁止;详细合同 pending | 有条件阻塞 | 阻塞具体 contract / implementation / integration,不阻塞架构边界成文。 |
| unknown replay 与 false readiness | continuation、恢复、证据与验收 | unknown fenced;planned / fake / attempt 与 external result 分层 | 有条件阻塞 | 无 owner resolution / evidence 不得正向声明。 |
| mirror / projection / outlet / trace 越权 | BC05~07、只读消费与 capability 边界 | derived only,不授权、不反写、不成为 backend / registry | 有条件阻塞 | 若越权会形成第二 truth。 |
| sibling 详细合同漂移 | host / image supply / deployment seam | 消费已停审 formal boundary,exact gap 保留;冲突时回开受影响 Step | 不阻塞 | member-images formal 01 已 drift-check;member-service 01 尚未停审。 |
| 历史实现整包回流 | 部署、选型、配置、性能 /可用性 | historical-only,逐项需 current authority | 不阻塞 | 合理 owner 边界不能给旧实现附带授权。 |

### 6.2 待确认事项表

| 待确认事项 | 影响范围 | 缺失确认 | 当前挂起口径 | 说明 |
|---|---|---|---|---|
| host / credential 详细合同 | BC01、host seam、配置 /测试 | 字段、IPC、credential owner /形态 /verification | 需求级 owner 分层有效,正向细节 fail closed | 阻塞具体 carrier / integration。 |
| Runtime entry / handoff mapping | BC03 / 04、Runtime seam | typed mapping、acceptance / unknown / backpressure | transport-neutral seam + gap / fence | 不允许 member 自定义 Runtime contract。 |
| screening source / taxonomy | BC02、rule mirror、筛选验收 | 正式 source matrix 与风险分类 | 四态 + conservative handling | Policy truth 保持外置。 |
| member event / observation schema 与 route | BC02 / 04 / 05、Bus / downstream | Core / owner 的 type / source / subject / payload / route | body-free material + attempt / gap | shared envelope authority 不等于 family 已闭口。 |
| trace lifecycle 与物理 truth carrier | BC01~05、retention / recovery / audit | store / transaction / durability / archive / reconciliation | logical local consistency + immutable history | 不能用 complete log 填补。 |
| scope / supply / read-consumer 详细边界 | non-project subject、image handoff、BC07 outlet | 第三种主语、compatibility contract、consumer contract | project-only;static supply;outlet 可裁剪 | 三条 lane 彼此独立,不得混成 readiness。 |
| workload / SLO / configuration 数值 | performance / capacity / change control | measurement、workload、owner 与验收 evidence | stage 可测但无固定数值 | 旧 P95 / SLA 不回流。 |

### 6.3 blocker 影响矩阵

| 推进对象 | 当前是否阻塞 | 说明 |
|---|---|---|
| Step 15 / Step 16 / 正式 01 成文 | 否 | owner、边界、失败与挂起上限已足够;pending 可正式记录。 |
| 02 概要设计 | 不阻塞文档启动;有条件阻塞具体正向 contract | 可先定义逻辑主体框架,不得脑补字段 / schema。 |
| 03 / 04 详细与配置 | 有条件阻塞受影响 lane | exact mapping、retention、配置来源、idempotency / recovery 需 owner 输入。 |
| 05 / 06 测试与验收 | 有条件阻塞 positive cases / readiness | 无正式合同、实现和 evidence 只能 planned / blocked / not_run。 |
| 07 实施计划 | 不阻塞 planned skeleton;阻塞 positive implementation claim | 只能列 planned / blocked / waiting,不得伪造 run / artifact / signoff。 |

正式 §15 回填 §6.1 / 6.2 两张主表和简短处理口径。详细 ID / blocker 矩阵留在本中间产物,避免正式正文变成任务台账。

## 7. Step 门禁自检

| 检查项 | 结果 |
|---|---|
| 风险 / 待确认 / 债务 / trigger / veto 是否分开 | pass |
| 每个风险是否有影响、当前口径和阻塞判断 | pass |
| 每个 question 是否写明缺失确认和挂起上限 | pass |
| Q-L2M-006 / 008 与 sibling 状态是否去除假挂起 | pass |
| 是否明确 pending 不阻塞 01 但阻塞受影响 positive lane | pass |
| 是否写最终解决方案、负责人、排期、TODO 或任务拆单 | pass:未写 |
| 是否存在会推翻前文却被隐瞒的 unresolved 冲突 | pass:none |
| Step 14 总门禁 | `pass` |

下一允许动作仅为创建 `01_arch_step_15_adr_traceability.md`;正式 `01` 仍禁止修改。
