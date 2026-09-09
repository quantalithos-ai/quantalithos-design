# 01 架构 Step 12：横切关注点

## 1. Step 状态

状态：completed / stop_review；模式：full-restart；对应 SOP：架构 SOP Step 12。
开工确认：项目台账、flow、前序 Step 已读；三层门禁允许当前 Step。formal_01_write_allowed 仍关闭。

### Step 内计划

- [x] 读取输入和前序结论：见 §2。
- [x] SOP 问题回答：见 §3。
- [x] 当前材料诊断：见 §4。
- [x] 设计取舍：见 §6。
- [x] 结构化中间产物。
- [x] 复杂度判断与按单元停审。
- [x] 回填草稿。
- [x] 自检与进入下一步条件。

模块骨架：U1 -> U2 -> U3 -> U4 -> U5 -> U6。未来 Step 不创建。

## 2. 本步输入

Step 2/8/9/10；正式 00 §13；架构规范 §4.13；真相源标准 query visibility、projection identity、rebuild source；共同输入：正式 00、项目台账、架构 flow 的来源复核表、架构 SOP 对应 Step、书写规范对应章节、中间产物规范和真相源闭环标准。前序产物的未闭合 seam 仍保留。

## 3. SOP 问题回答

1. 安全如何处理？resolver-first；先验证 principal/scope 与 owning 决定再展示；撤销/冲突 fail-closed，count/ref/provenance 也受裁剪。
2. 观测覆盖什么？partition、source application、gap、revision、generation、local change、query 姿态与恢复结果；只留安全 backref，不记录正文。
3. 可用性底线？已验证安全的旧结果可 stale，来源不足 partial，必要条件不足 blocked；不得自动修复业务真相。
4. 性能预算？以来源 fanout、每批应用规模、并发恢复、候选世代大小为预算维度，无实际 workload 不给数值。
5. 配置管理？只调绑定、预算、重试和保留策略；不能关闭 no-write、visibility、forbidden body、幂等与 generation 隔离。
6. 审计保证？局部写、应用和切换能回链；query 技术日志不得变成业务写条件；诊断内容也受权限。
7. 不适用什么？训练/LLM token、tool sandbox、镜像 provenance、archive package 验收、产品渲染指标不属于本仓。
8. 如何适配单元？逐 U1~U6 判断安全、可观测、故障和预算的可验证切口，不能统一套模板。

## 4. 当前文档问题诊断

draft/02 的诊断能力若顺带保存 raw payload 会破坏 forbidden body；draft/03 的技术层配置不能变成 authorization override；正式 00 §13 不允许写无来源 P95/容量。

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 当前架构主题 | 正式 01 未创建，draft 只作候选 | 由本步输入独立收束后进入 §7 | 阻止历史草稿升级为真相 |
| 外部依赖 | 00 已登记 pending/blocker | 保留 owner 和解锁条件 | 不以架构补外部合同 |

## 6. 设计取舍

| 方案 | 优点 | 代价 | 结论 |
|---|---|---|---|
| 按单元绑定安全/一致性/观测与后续验证切口 | 约束可审计 | 需明确来源和失败范围 | 采用 |
| 所有单元只写安全、高可用、高性能 | 简短 | 没有可判定语义 | 不采用 |

## 7. 结构化中间产物


### U1 单元校准

问题：哪些横切约束真正适用？该单元影响 scope/principal 隔离；不从 view 猜 membership，来源是 Step 8/9 对应行。
诊断：只写通用“高可用”会忽略 正式解析缺失即 fail-closed；不得 fallback Personal。
取舍：采用本单元专属断言与预算维度；不复制运行层/归档层的验收指标。

| 安全 | 观测/审计 | 可靠性 | 配置/预算 | 后续验证切口（非已运行测试） |
|---|---|---|---|---|
| scope/principal 隔离；不从 view 猜 membership | scope/visibility 来源与拒绝姿态 | 正式解析缺失即 fail-closed；不得 fallback Personal | resolver 预算与绑定可配；授权 guard 不可关闭 | scope mismatch 与权限撤销的 no-leak 断言 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U1：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U2 单元校准

问题：哪些横切约束真正适用？该单元影响 正文和 secret 不进入 snapshot/日志，来源是 Step 8/9 对应行。
诊断：只写通用“高可用”会忽略 call timeout != owner not-found；停止受影响来源。
取舍：采用本单元专属断言与预算维度；不复制运行层/归档层的验收指标。

| 安全 | 观测/审计 | 可靠性 | 配置/预算 | 后续验证切口（非已运行测试） |
|---|---|---|---|---|
| 正文和 secret 不进入 snapshot/日志 | owner/ref/version/coverage，元信息也需裁剪 | call timeout != owner not-found；停止受影响来源 | fanout/单源预算；safe field 范围由 owner 定义 | 越界输入拒绝、超时与删除不混淆 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U2：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U3 单元校准

问题：哪些横切约束真正适用？该单元影响 事件可信来源与受影响范围校验，来源是 Step 8/9 对应行。
诊断：只写通用“高可用”会忽略 原子应用、未知提交核对；不得跳 gap。
取舍：采用本单元专属断言与预算维度；不复制运行层/归档层的验收指标。

| 安全 | 观测/审计 | 可靠性 | 配置/预算 | 后续验证切口（非已运行测试） |
|---|---|---|---|---|
| 事件可信来源与受影响范围校验 | application、duplicate、conflict、gap 与 source cursor | 原子应用、未知提交核对；不得跳 gap | 批大小、并发和去重保留需与 replay 范围一致 | 重复/乱序/崩溃边界与 no-upstream-write |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U3：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U4 单元校准

问题：哪些横切约束真正适用？该单元影响 local state 绑定 principal/scope；mute 不能授予内容，来源是 Step 8/9 对应行。
诊断：只写通用“高可用”会忽略 变更冲突明确；重建不丢用户动作。
取舍：采用本单元专属断言与预算维度；不复制运行层/归档层的验收指标。

| 安全 | 观测/审计 | 可靠性 | 配置/预算 | 后续验证切口（非已运行测试） |
|---|---|---|---|---|
| local state 绑定 principal/scope；mute 不能授予内容 | 局部 revision 与安全目标 backref | 变更冲突明确；重建不丢用户动作 | 局部状态保留不等于 source 保留；不能配置自动 receipt | 跨用户更新拒绝、query 不标已读、rebuild 保留 overlay |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U4：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。


### U5 单元校准

问题：哪些横切约束真正适用？该单元影响 维护者授权不能绕过读取权限，来源是 Step 8/9 对应行。
诊断：只写通用“高可用”会忽略 候选隔离；失效 old generation 不再展示。
取舍：采用本单元专属断言与预算维度；不复制运行层/归档层的验收指标。

| 安全 | 观测/审计 | 可靠性 | 配置/预算 | 后续验证切口（非已运行测试） |
|---|---|---|---|---|
| 维护者授权不能绕过读取权限 | attempt/candidate/current、cutover 与失败范围 | 候选隔离；失效 old generation 不再展示 | 候选容量/并发/恢复范围预算；不能配置忽略 gap | 切换并发、撤销与 replay、缺基线保持 blocked |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U5：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### U6 单元校准

问题：哪些横切约束真正适用？该单元影响 页游标/旧 revision 不作凭证；count/ref 同样裁剪，来源是 Step 8/9 对应行。
诊断：只写通用“高可用”会忽略 局部不可用不伪造完整；query 不调度恢复。
取舍：采用本单元专属断言与预算维度；不复制运行层/归档层的验收指标。

| 安全 | 观测/审计 | 可靠性 | 配置/预算 | 后续验证切口（非已运行测试） |
|---|---|---|---|---|
| 页游标/旧 revision 不作凭证；count/ref 同样裁剪 | 返回的 coverage/status 与 generation/revision 语境 | 局部不可用不伪造完整；query 不调度恢复 | 页大小/读取预算；不得配置 stale auth 宽限 | 空/缺失/hidden 区分、分页失效、读无状态写 |

回填：本单元结构化结论进入本 Step 对应正式章节。
单元自检：来源、边界、一致性与非职责已核对；未新增外部合同或提前下沉 schema。
单元门禁 U6：思考 done / 写入 done / 自检 done / pass；停审后允许下一单元。

### 7.7 横切约束总表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 正式权限消费 | U1~U6 所有输出 | resolution 与 owner 决定有效性可证明 | 阻止内容及敏感元信息泄露 | page cursor/旧 revision 不能作为授权 |
| 只读边界 | source query/read/export | 不写 projection、local state 或任务 | 读不改变事实 | 日志不变成业务状态 |
| 原子与恢复 | U3/U5 及状态承载 | cursor、应用、revision 与切换结果一致 | 防止跳过/重复/混世代 | 外部仍为最终一致 |
| 局部状态隔离 | U4 与 U3/U5/U6 | 用户动作独立于投影世代 | 防止重建丢动作或形成 receipt | Inbox 本文语义来自 owner |
| 可追溯性 | 事件、局部变更、恢复与输出 | 来源、版本、覆盖和原因可回链 | 可解释结果 | 不引入正文日志 |
| 有界资源与配置 | 三运行单元及来源适配 | 预算有界，配置不得绕过核心 guard | 防止恢复放大与配置越权 | 无实际 workload 不定数值 |

以下表给出上述约束的判断与后续承接：

| 类别 | 架构约束 | 判断口径 | 后续承接 |
|---|---|---|---|
| 安全/权限 | 正式 owner 决定与 scope 解析；失效 fail-closed | 未授权主体不能借 old revision/page cursor/diagnostics 获得内容或敏感元信息 | 03 输入来源/状态，05/06 no-leak |
| no-write | read/source query/export 不写状态、不调度任务 | 读取前后 projection/cursor/attention/任务状态不变 | 03 flow；05 副作用断言 |
| 可靠性 | 本地原子应用、幂等、缺口与候选世代隔离 | 崩溃/未知提交/重复后无跳过或重复效果 | 03 一致性；05 故障场景 |
| 可用性 | stale/partial/blocked 与安全拒绝分轴 | 返回可证明范围，不把缺 source 当 empty-success | 03 response/state；06 验收边界 |
| 可观测 | 应用、cursor、gap、revision、generation、局部变更和恢复可回链 | 能定位哪个 owner/分区影响结果，不输出正文 | 03 审计来源；04 观测配置 |
| 资源预算 | source fanout、batch、分页、并发恢复、候选容量有界 | 超预算返回明确失败/缩减覆盖，不绕过安全 | 04 配置、05 workload、06 测量条件 |
| 配置治理 | 仅绑定与资源/操作策略可配置 | 不能关闭 no-write/visibility/dedupe/forbidden body | 04 加载/校验/生效 |
| 保留与清理 | 保留期要覆盖幂等、允许重放与局部状态恢复要求 | 缺基线或去重记录时不得继续声称完整恢复 | 03/04/05；当前无无来源 TTL |
| 演进/兼容 | contract 不兼容时隔离来源与旧 cursor | 不混 schema/generation，不用旧授权放行 | 03 version；07 boundary 条件 |

### 7.8 按架构单元组织的适用表

| 单元 | 安全 | 可观测 | 可靠性 | 配置/预算 | 验证切口 |
|---|---|---|---|---|---|
| U1 | scope/principal 隔离；不从 view 猜 membership | scope/visibility 来源与拒绝姿态 | 正式解析缺失即 fail-closed；不得 fallback Personal | resolver 预算与绑定可配；授权 guard 不可关闭 | scope mismatch 与权限撤销的 no-leak 断言 |
| U2 | 正文和 secret 不进入 snapshot/日志 | owner/ref/version/coverage，元信息也需裁剪 | call timeout != owner not-found；停止受影响来源 | fanout/单源预算；safe field 范围由 owner 定义 | 越界输入拒绝、超时与删除不混淆 |
| U3 | 事件可信来源与受影响范围校验 | application、duplicate、conflict、gap 与 source cursor | 原子应用、未知提交核对；不得跳 gap | 批大小、并发和去重保留需与 replay 范围一致 | 重复/乱序/崩溃边界与 no-upstream-write |
| U4 | local state 绑定 principal/scope；mute 不能授予内容 | 局部 revision 与安全目标 backref | 变更冲突明确；重建不丢用户动作 | 局部状态保留不等于 source 保留；不能配置自动 receipt | 跨用户更新拒绝、query 不标已读、rebuild 保留 overlay |
| U5 | 维护者授权不能绕过读取权限 | attempt/candidate/current、cutover 与失败范围 | 候选隔离；失效 old generation 不再展示 | 候选容量/并发/恢复范围预算；不能配置忽略 gap | 切换并发、撤销与 replay、缺基线保持 blocked |
| U6 | 页游标/旧 revision 不作凭证；count/ref 同样裁剪 | 返回的 coverage/status 与 generation/revision 语境 | 局部不可用不伪造完整；query 不调度恢复 | 页大小/读取预算；不得配置 stale auth 宽限 | 空/缺失/hidden 区分、分页失效、读无状态写 |

### 7.9 证据与适用范围

上述切口只是后续设计要求，不是测试用例、run_id、报告、evidence alias 或已执行断言。fake 只能在正式已定义的边界内验证局部行为，不能生成上游 authorization、任意 replay、archive acceptance 或真实 readiness。

不引入 runtime LLM/tool 指标、镜像 build provenance、sandbox 隔离测试或 archive package retention。这些即使与用户工作区有关，也不由 workspace 负责。跨单元审计确认诊断和 export 受同一安全边界、维护不绕过 read visibility、资源预算不能成为边界开关。

## 8. 回填草稿

正式 §13 承接 §7 已收束的表、图和结论；图注随图一起回填。不复制 §3~6 的讨论过程。

复杂度判断：逐单元横切校准；后续测试切口与执行证据分开。

## 9. 待确认事项

WS-UP-001~008 仍保持 open；exact query/event/ref/visibility/cursor/export 和共享 schema 必须由 owner 关闭，不由本 Step 补全。

## 10. 进入下一步条件

U1~U6 全覆盖；没有模板化容量/SLO 或真实证据；配置不改变不变量；observability 无正文和权限旁路。

写入前检查：模块思考已完成，结构化结论仅整理 §3/6；正式回填草稿无新增协议。
思考记录 = done；写入记录 = done；自检状态 = done；gate_status = pass；gate_reason = 本步架构结论可引用，未闭合外部能力已隔离为 blocker；next_allowed_action = 进入 Step 13。
本 pass 只指设计静态自检，不是测试、集成、证据、用户 signoff 或 readiness。
