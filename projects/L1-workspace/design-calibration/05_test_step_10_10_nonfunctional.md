# Step 10. 设计专项测试与非功能验证

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 10  
> 回填章节：`05-测试方案.md` §10  
> 执行模式：full-restart / single-agent-serial

## 1. Step 状态

| 项目 | 结论 |
|---|---|
| 状态 | completed / nonfunctional_planned_with_baseline_pending |
| 输入基线 | Step2/6/8/9；正式 00 §13~14、03 §10~15、04 §6~14 |
| 本步输出 | 专项矩阵、安全红线、故障注入、资源/测量、观测证据边界与 suite 映射 |
| 编号约束 | 复用 Step5/6 的 59 个 TC/EV 槽位，不新造专项证据编号 |
| 执行事实 | 未实现、未执行；没有 baseline、run、artifact、report 或真实 evidence |
| 下一动作 | Step11 定义缺陷分级、升级、关闭与复验 |

## 2. 本步目标与输入

本步把正式设计中的安全、一致性、恢复、资源、观测与可演进风险整理为可判定专项。它只定义验证方法和未来证据要求，不把 telemetry 当作业务提交证明，也不把无来源数字写成性能、容量、SLA、RTO/RPO 或保留期门禁。

| 输入 | 本步用途 |
|---|---|
| `00-需求文档.md` §10/§13/§14 | 固定 fail-closed、cursor 分离、幂等、gap、退化姿态、NFR 与一票否决 |
| `03-详细设计.md` §10~§12 | 固定事务原子性、commit unknown、状态终态、并发与重入 |
| `03-详细设计.md` §13~§15 | 固定 limits、cursor crypto、观测白名单、低基数与测试切口 |
| `04-配置设计.md` §6~§14 | 固定四 profile、必填配置、正数/关系约束、secret 与失效策略 |
| Step6 | 固定 59 个用例的前置、动作、精确断言和 EV 槽位 |
| Step8 | 固定 local/test/staging/production 语境，禁止新增测试 profile |
| Step9 | 固定 13 个 planned suite、9 个 planned 脚本及 artifact/report 根路径 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些性能指标必须验证？ | 当前只有结构性指标可判定：请求/页/token/snapshot/commit/recovery/fanout/in-flight 必须受 04 的配置上限约束；一次调用有界；超限明确失败且不得截断为 Complete/Committed。耗时、计数和资源峰值只做未来采样，不设无来源数值通过线。 |
| 哪些安全和边界红线必须负向测试？ | 当前 visibility 缺失/冲突/撤销必须 fail-closed；历史 token 不授权；六 Query 零写；禁止 owner truth/body、secret、credential、完整业务正文和隐藏元信息进入存储、响应、日志或报告；production 禁 fake fallback。 |
| 哪些一致性和恢复场景必须故障注入？ | 七具名本地写 carrier 的逐写点失败、commit response loss/unknown、同 key 重入、异 digest、CAS 竞争、gap、bridge 缺失、candidate basis 变化、cutover 与 invalidation 竞争、多目标 fanout 部分成功/unknown。 |
| 哪些日志、指标和审计证据必须存在？ | 未来测试 raw result 必须证明安全类别日志、低基数指标、既有 operation/source/gap/baseline/commit 局部记录和 redaction scan；但日志/指标不能替代权威局部 record，也不能单独填 EV。 |
| 阈值来自哪里？ | 语义阈值来自 00/03 的不变量与否决项；边界值 `L` 来自某次运行固定的 04 profile 配置；量化性能、容量、SLO、RTO/RPO 与保留期必须等待正式 workload/measurement baseline。 |

## 4. 当前材料问题诊断

| 旧模板问题 | 风险 | 本步修正 |
|---|---|---|
| 只有五行专项摘要 | 安全、unknown、gap、cutover 和有界执行无法落地 | 拆成安全、一致性/恢复、资源/性能、观测四组矩阵 |
| “不填写 P95”但未定义可测内容 | 性能专项可能退化为空白 | 定义配置边界 `L/L+1`、有界执行和测量准备，不设置数值 verdict |
| 观测被列为证据 | 容易用日志证明业务提交 | 区分权威业务记录、telemetry、raw test artifact 和 EV 四层 |
| 外部正向统一写 blocked | 本地可执行负向与分类切口也被遮蔽 | local/controlled 继续 planned，正式 seam 正向单独 blocked |
| 未映射已有 TC/suite | 可能新增重复专项用例或孤儿证据 | 全部专项复用 59 个 TC/EV 与 Step9 suite |

## 5. 改动前后对比

| 维度 | 之前 | 本步后 |
|---|---|---|
| 安全 | visibility/redaction 口号 | 当前决定、隐藏元信息、cursor、secret、fake 隔离可判定 |
| 一致性 | 并发/unknown 合并 | definite rollback、unknown、duplicate、gap、fanout、cutover 分开 |
| 恢复 | 只写 restart/gap | bridge、rebuild phase、basis revalidation、terminal guard、durable restart 边界明确 |
| 性能/资源 | 无数字即不测 | 测 `L/L+1`、有界性、完整性；数值基线保持 pending |
| 观测 | 要有日志/指标 | 白名单、低基数、sink failure、redaction 和“非业务证据”同时验证 |

## 6. 专项测试设计取舍

| 议题 | 采用方案 | 未采用方案及原因 |
|---|---|---|
| 性能通过线 | 只以正式配置边界和语义红线作 P0；采样不裁决 | 不继承历史或参考项目数字；本仓无 workload/baseline |
| visibility 验证 | 每次输出屏障核验当前 owner decision；缺失即 fail-closed | 不允许 projection/cache/token 中旧 allow 继续授权 |
| unknown 恢复 | 权威 `resolve_commit`，Pending 不改写 | 不把缺行、超时或副本未见结果推断为 rollback |
| recovery 进度 | 每次 Advance 单阶段/有界批；basis 变化重新验证 | 不以后台无限循环掩盖 gap 或 safety block |
| 观测证明 | telemetry 只证明埋点与脱敏；业务结果由 response+局部权威 record/raw assertion 证明 | 不把日志、metric 或 trace 视为 accepted fact |
| 正式接缝 | staging selected-run 使用真实版本化 seam manifest | 不用 local/test fake 生成 owner authorization、replay、durable 或 readiness 证明 |

## 7. 结构化中间产物

### 7.1 阈值与判定来源

| 判定层 | 来源 | 当前通过口径 | 当前状态 |
|---|---|---|---|
| 安全/一致性语义红线 | 00 BR/NFR/否决；03 状态/事务/错误 | exact variant、零非预期写、原 record/version 不变、无敏感输出 | P0 planned |
| 配置边界 `L` | 固定运行所选 04 profile 的已校验值 | `L` 按合同受理，`L+1` 明确拒绝；关系约束成立 | P0 planned；真实值未填写 |
| 时间/资源采样 | runner 的单调计时与受控资源计量 | context、workload id、sample 与原始路径齐全；不形成数值 pass | measurement planned |
| 正式产品基线 | workload owner、durable/transport/staging 基线 | 未定义前不得声称 P95、吞吐、容量、SLA、RTO/RPO 达标 | pending / blocked |
| 保留与清理 | 尚无正式 retention/GC 合同 | 不自动删除幂等/提交证明；不发明保留期 | pending |

### 7.2 专项测试矩阵

| 专项 | 指标 / 风险 | 方法 | 环境 | 阈值 / 通过条件 | EV 槽位 |
|---|---|---|---|---|---|
| 现时安全裁剪 | 旧 allow、missing/conflict/revoked visibility 泄漏 | 输出屏障切换决定并检查 safe response/write spy | test；正式 allow 为 staging blocked | 只有 current AllowedSubset 可见；其余 NotAvailable/Blocked，隐藏 ref/count/provenance 不出现 | VIS-001~003、SEC-003 |
| Query no-write | read/refresh/cursor/local state 混写 | 六 Query 对七写方法 spy + controlled store audit | local/test | 每个 Query 所有写方法调用数为 0；无隐式初始化、刷新、read cursor 推进 | QRY-001~006、BOUND-001 |
| 数据最小化/redaction | body、token、DSN、secret、proof、ID canary 泄漏 | 成功/失败/异常路径 capture，raw+report boundary scan | test；release planned | forbidden canary 零出现；扫描无法完成即非通过 | SEC-001/003、BOUND-002 |
| 一致性/原子性 | 半 projection/cursor/Inbox/record、跨分区伪原子 | 每个 carrier 写点故障注入、snapshot 前后比较 | test controlled；durable blocked | 单 partition 全有或全无；fanout 每 target 独立且不造全局 success | TXN-001~003 |
| 幂等/commit unknown | duplicate 二次效果、异 digest 覆盖、unknown 盲重做 | same/different key、response loss、resolution matrix | test controlled；durable restart blocked | same 返回原值；different Conflict；Unknown 只 Pending/权威原结果，不二次 apply | IDEM-001~003、SRC-005 |
| source gap/乱序 | 猜顺序、Gap 占 terminal key、静默跳过 | comparator/bridge fault matrix | local negative；owner proof staging blocked | 无证明不 advance；Gap 无 terminal record；late 仅正式 proof 可 LateIgnored | SRC-002~005、STATE-001 |
| rebuild/cutover | phase 越界、混 generation、过期 basis promote | 每状态一次 Advance；validate/commit 间注入变更/失效 | test controlled；baseline/durable blocked | 每次有界；同 basis 才原子切换；变化回 Validating 或 Blocked；终态不复活 | REC-001~006、STATE-002 |
| 可用性/失效姿态 | dependency failure 被伪装为空/complete/fresh | Scope/Owner/Store/Bus/Cursor slot 故障注入 | test；real seam staging blocked | 按正式 ContractBlocked/Unavailable/Blocked 映射；stale/partial/blocked/unavailable 分轴 | SCOPE-003、QRY-005、CONFIG-003、STATE-003 |
| 资源有界 | 无界 page/snapshot/commit/recovery/fanout/in-flight | 对每项配置执行 `L/L+1` 与关系变异 | local/test controlled | 超限整体拒绝；不 clamp；不截断为 Complete/Committed；continuation 显式 | RES-001~003、CONFIG-002 |
| 性能测量准备 | 无可复现 context、把 sample 当 SLO | planned runner 记录固定 profile/workload ref/单调耗时/计数 | test/staging selected-run | 元数据与 raw sample 可追溯；没有数字 verdict；缺 baseline 保持 pending | RES-001~003 对应 raw，非新增 EV |
| 可观测性 | 高基数/敏感标签、sink 改业务结果 | log/metric capture、label allowlist、sink fault | test | 仅固定 label；sink failure 不改 response/commit、不触发重放 | SEC-001~002 |
| 可演进/依赖 | 新域/版本导致 shadow schema、L1 compile、fake production | unknown schema/version、manifest/import/composition scan | local/test；正式新版本 blocked | unsupported 安全拒绝；只有获准 L0-core compile candidate；无 production fake fallback | CONTRACT-001~003、DEP-001~002 |

表中简写均指 `TC-WS-*` 与同序 `EV-WS-*`。EV 仍是未来槽位，不表示证据文件存在。

### 7.3 安全与边界红线

| 红线 | 负向注入 | 必须断言 | Suite | 状态 |
|---|---|---|---|---|
| visibility 不可验证 | missing/conflict/revoked/expired decision | fail-closed；无 item/ref/count/provenance；七写为零 | query-no-write / formal-seam | negative planned；positive blocked |
| 历史材料不授权 | page token/projection 带旧 allow，current 已撤销 | token 仅定位；重新核验并拒绝，不降级展示 | contracts-protocol / query-no-write | planned |
| scope/主体隔离 | wrong principal/scope/partition | NotAvailable/Blocked；不暴露目标是否存在 | query-no-write / api-read-surface | planned |
| cursor 安全 | tamper、错 kind/轴、未知或撤销 key | 统一 CursorInvalid；不泄露解密/key 原因；零写 | contracts-protocol / infra-adapter-contract | local planned；产品 crypto blocked |
| 禁止正文与 secret | body/token/DSN/credential/proof/ID canary | store/response/log/trace/artifact/report 均无 canary | config-redaction-check | planned |
| no owner/outbound/archive write | 14 入口注入所有 port spy | owner mutation/outbound event/outbox/archive handoff 恒为零 | read-model-boundary | planned |
| fake 隔离 | production 缺正式 slot、fake 可见 | 启动拒绝或受影响能力 blocked；不能 fallback/readiness | dependency-boundary-check / formal-seam | planned + blocked |

### 7.4 一致性、幂等与恢复故障注入

| 故障 / 竞争 | 注入位置 | 正式预期 | 权威检查面 | 状态 |
|---|---|---|---|---|
| 确定性写失败 | 七具名 commit carrier 的每个写点 | NotCommitted/正式错误；所有局部效果不可见 | coherent store snapshot + write log | controlled planned |
| commit response 丢失 | 提交可能完成后断开 | OutcomeUnknown/Pending；先 resolve，同 key 不二次写 | commit result/operation/source/gap binding | controlled planned；durable blocked |
| same key/different digest | operation/source terminal lookup | 原结果 Duplicate；异 digest Conflict，原记录不变 | immutable record/result ref | planned |
| gap 与 bridge | successor 缺失、bridge proof 缺失/合法 | 缺 proof 继续 Gap/Blocked；合法 bridge 才推进 | coverage/gap result；无 terminal success key | proof positive blocked |
| candidate event 与 Advance | validate 后 candidate revision/role/safety 改变 | CAS/Conflict 或 Ready→Validating/Blocked；不漏 attempt | attempt+candidate 同事务 | controlled planned |
| cutover 与 invalidation | validate/commit 屏障间 safety invalidation | 旧 basis 不 promote；current 保持，candidate blocked | pointer/role/safety/invalidation | controlled planned；durable blocked |
| 两个 Advance / local writers | 相同 expected 并发 | 单 winner；另一 Conflict/Duplicate；版本不跳号 | attempt/local version + stored result | controlled planned |
| 多 partition fanout | 前目标 committed，后目标 failed/unknown | 已提交目标保留；未决不推进 next；无全局原子宣称 | 每 partition child result | controlled planned |
| restart 后解析 | commit 未决后重启/只读副本延迟 | 不凭缺行回滚；正式 driver 终止证明前 Pending | durable primary resolution | blocked WS-LOCAL-001 |
| baseline/replay/cutover | 正式 gap→baseline→catch-up→validate | 缺 schema/proof/continuation 任一项即 blocked | versioned owner/bus/durable seam | blocked WS-UP-001~003/007、WS-LOCAL-001 |

### 7.5 资源、性能测量与可演进性

| 验证面 | 输入构造 | 当前断言 | 禁止推导 |
|---|---|---|---|
| request/page/token | 固定 profile 值为 `L`，构造 `L` 与 `L+1` | `L` 按合同受理；`L+1` InvalidRequest/CursorInvalid；不预分配超限对象 | 不据此声称容量或吞吐 |
| snapshot/commit | rows 与 bytes 分别等于/超过上限 | 超限整体失败；不截断集合后写 Complete/Committed | 不据 local fake 推 durable 性能 |
| recovery/fanout | budget/targets 等于/超过上限 | 单调用不超过 L；超限拒绝或返回正式 continuation，不隐式循环 | 不据批大小推 RTO/RPO |
| max_in_flight | L 个并发与第 L+1 个请求 | 不超过配置并发；额外请求按正式资源失败处理，不绕过安全 | 不写 SLA/可用率 |
| timeout | owner/store/shutdown 的已校验 Duration | 使用所选配置触发正式 Source/Storage/OutcomeUnknown 语义 | timeout 不是 owner freshness 时间 |
| 测量记录 | 固定 source revision、profile、workload ref 与 runner version | 未来 raw 中可回指 context；采样原值不被报告改写 | sample/trend 不等 pass/verdict |
| 新 source/version | unknown owner/schema/event version | ContractBlocked/Rejected/Blocked；无 shadow schema、无猜字段 | 不从 workspace 反向定义 owner 合同 |

### 7.6 可观测性、审计与证据边界

| 层 | 允许证明 | 不允许证明 | 未来检查 |
|---|---|---|---|
| 局部权威记录 | operation/source/gap/baseline/commit 的已提交局部事实 | owner authorization、bus ACK、archive acceptance | 与 response、transaction snapshot 交叉断言 |
| structured log | 入口、stage、safe outcome、slot、duration 类别被埋点 | 业务提交、授权 allow、唯一业务变更次数 | 字段白名单、forbidden canary 扫描 |
| metric | 低基数调用/失败/时长/丢弃趋势 | exact-once、单对象状态、业务版本或 lag truth | 标签集合与 cardinality 扫描 |
| trace/request correlation | 经宿主批准的安全技术关联 | principal/scope/partition/ref/proof 的替代标识 | 未批准则字段缺省；不得 hash 泄漏 |
| raw test artifact | 某 TC 在固定 run/context 的真实断言结果 | 其他 TC、其他 run 或未执行 seam 的结果 | runner 输出、raw digest/path、failure reason |
| EV/report | 从真实 raw 聚合的验收输入 | 静态表、日志片段或 planned slot 自证通过 | Step13 的真实性、redaction 与追溯检查 |

观测 sink 不可用时，业务 response/commit 语义必须保持不变；不得重放业务来补日志。Telemetry 的存在只能证明观测合同被触发，不能替代业务记录、测试 raw 或验收证据。

### 7.7 专项到 suite / gate 映射

| 专项 | 首要 suite | 辅助 suite / gate | P0 处理 |
|---|---|---|---|
| visibility/no-write | query-no-write | api-read-surface、formal-seam-conformance | local失败阻断；formal positive当前blocked |
| redaction/secret/metadata | config-redaction-check | report-integrity-check、release | 任一 forbidden 命中或无法扫描即阻断 |
| transaction/idempotency/unknown | maintenance-consistency | infra-adapter-contract、nightly | controlled失败阻断；durable proof blocked |
| gap/recovery/cutover | maintenance-consistency / jobs-recovery-boundary | worker-consumer-boundary、formal-seam | local状态/phase失败阻断；真实 replay blocked |
| resources/config | infra-adapter-contract | config-redaction-check、nightly | 语义边界阻断；数值性能不裁决 |
| observability | config-redaction-check | report-integrity-check | 白名单/低基数/sink语义失败阻断 |
| dependency/evolution | dependency-boundary-check / contracts-protocol | read-model-boundary、formal-seam | shadow schema、L1 compile、fake fallback阻断 |
| performance measurement | selected hardening（P1） | future staging run | 无 baseline 为 pending，不能填 P0 pass |

### 7.8 专项停审与跨专项审计

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 00 六类 NFR 是否均有方法 | pass；正确性、一致性、可用性、安全、可追溯、可演进均覆盖 | 无 |
| P0 一票否决是否有负向验证 | pass；VIS/QRY/SRC/REC/BOUND/DEP/SEC 族承接 | 无 |
| 是否有无来源数值 | no | P95/吞吐/容量/SLA/RTO/RPO/保留期均未发明 |
| 资源是否因此漏测 | no；按 profile 的 `L/L+1` 与完整性语义验证 | 真实 workload baseline pending |
| commit unknown/gap 是否误作终态 | no；Unknown 只 Pending/resolve，Gap 无 terminal key | durable/owner proof blocked |
| telemetry 是否充当业务证据 | no；四层边界已固定 | Step13 继续约束 raw→EV |
| 外部正向是否被 fake 替代 | no；formal-seam 保持 blocked | WS-UP/WS-LOCAL 保持开放 |
| 是否新增 TC/EV/schema/config | no；复用 59 槽位与 04 配置 | 无需回写 03/04 |

## 8. 对详细设计 / 配置的影响判定

| 结论 | 是否回写 03/04 | 处理 |
|---|---|---|
| 现有事务、错误、状态、limits 和观测合同足以形成专项 | 否 | 由 05 组织测试方法 |
| 数字性能/SLO baseline 缺失 | 否，既有 pending | 作为 Step14 残余风险；不得在 05/04 补数字 |
| durable restart / real crypto /正式 seam 不可验证 | 否，既有 blocker | WS-UP/WS-LOCAL 保持 blocked |
| 若未来 runner 无法观测原子写点或七写 spy | 条件性需回写 | 先登记可测性缺口，不在测试代码猜设计 |

## 9. 回填草稿

正式 §10 回填阈值来源、专项总表、安全红线、故障注入、资源/测量、观测证据边界与 suite 映射。正文必须显式说明：所有方法均为 planned/blocked；采样没有数值 verdict；telemetry 不是业务或验收证据。

## 10. 待确认事项与进入下一步条件

- WS-UP-001~008、WS-UP-006-S、WS-LOCAL-001~003 保持开放；无新增 owning blocker。
- workload、P95、吞吐、容量、SLA、RTO/RPO、保留期、staging/durable 产品均未确认。
- P0 非功能与红线均有验证方法，跨专项无 unresolved 设计冲突；Step10 通过，允许进入 Step11。
