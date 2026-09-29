# 01 架构 Step 12：横切关注点

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 12。

### Step 内计划

- [x] 读取目标、U1~U6、依赖、数据、交互和技术机制。
- [x] 回答安全、审计、可观测、韧性、性能/容量、配置/变更的适用性。
- [x] 诊断旧材料的通用日志/指标/权限/SLA 模板化写法。
- [x] 对每个横切类别先问题、诊断、取舍，再形成约束并停审。
- [x] 映射 U1~U6，完成跨横切审计。

## 2. 本步问题回答与历史诊断

安全必须保护 authority、正文、secret 和 no-write；审计必须关联 request→source→manifest→verification→storage/lifecycle→restore/handoff；可观测必须暴露多轴状态与 coverage；韧性必须处理部分失败、未知提交和外部不可用；性能/容量在无 baseline 下只能限制放大与保证进度；配置/变更不能绕过 policy、schema、algorithm、storage/receiver 边界。

旧材料列“日志/指标/trace、管理员权限、<5/<2 分钟、99.9%、配置项清单”，没有作用范围、保护目标与证据 authority。当前不写监控实现、告警阈值、secret 存放或压测脚本，只固定可审查口径。

## 3. 横切类别逐项校准与停审

### 3.1 安全边界

问题：哪些输入可能越权？owner material、governance decision、restore target、secret/key ref。诊断：旧方案默认管理员与全量正文，不足以证明 purpose/scope。取舍：authority/purpose/scope/fence 约束所有 material 和 handoff；缺失即 fail-closed。

停审：覆盖 U1/U2/U3/U4/U5/U6；不定义 auth 产品或 token。`security gate = pass_with AR-UP-001/003/004/009`。

### 3.2 审计与可追溯

问题：哪些判断必须回溯？admission、capture/coverage、closure、verification、external intent/result、plan/handoff/compensation。诊断：旧 restore log/bundle log 是技术日志，不足以证明来源与决定。取舍：每个关键 Archive 记录关联输入 ref、actor/authority 语境和外部反馈；审计 backend 仍归 observability。

停审：全链路适用；不声称 L4-observability 已接收或保存完整证据。`audit gate = pass_with AR-UP-007`。

### 3.3 可观测性

问题：必须看见什么？每个 source/item 阶段、coverage、阻断原因、unknown/compensation 和依赖反馈。诊断：只记录 bundle time/restore time 会掩盖局部失败。取舍：以可判别状态和关联关系为架构口径，不固定 metric 名、label 或 dashboard。

停审：U1~U6 均有状态切口；禁止敏感正文、locator、key ref 作为外泄 telemetry。`observability gate = pass`。

### 3.4 韧性 / 恢复能力

问题：外部不可用或结果未知如何继续？保留局部结果、挂起、核对、retry/compensation；不重放已可能提交的副作用。诊断：旧“失败重试/删除坏包重建”可能丢证据或重复副作用。取舍：immutable plan/input context、per-item outcome 与 unknown-first reconciliation；具体算法后置。

停审：U2/U4/U5/U6 强适用，U1/U3 保证本地状态不伪成功。`resilience gate = pass_with external blockers`。

### 3.5 性能 / 容量约束

问题：哪些结构会放大？大包、慢 source、多 owner fan-out、验证/取回、只读回源。诊断：旧无来源 SLA 无法审查。取舍：后台分项推进、局部进度、只读不触发无界回源、单 source 失败不隐藏其他结果；量化等待 workload authority。

停审：U2~U6 适用，U1 提供作业可见性；不承诺分钟、吞吐、RTO。`performance gate = pass_with baseline pending`。

### 3.6 配置与变更控制

问题：哪些变化会改变主线？source/receiver binding、schema compatibility、storage class、algorithm/key ref、retention/hold/delete decision。诊断：旧 local config 可定义 retention policy 和 provider，绕过 owner。取舍：配置只能选择已允许 adapter/行为边界，不能创造 authority、放宽 fail-closed 或把 unsupported 改成 verified。

停审：U1~U6 适用；详细 key、默认值、来源优先级留到 04。`configuration gate = pass_with AR-UP-003/004/005/009`。

## 4. 结构化中间产物

### 4.1 横切关注点约束表

| 横切关注点 | 作用范围 | 约束要求 | 保护目标 | 说明 |
|---|---|---|---|---|
| 安全：authority/purpose/scope 与正文边界 | request、capture、Bundle、verification、lifecycle、restore | material/ref/handoff 必须有合法来源与适用语境；secret、未授权正文和跨域写能力不得入核心 | source truth、敏感材料与 owner 写权 | 不是单接口认证规则，而是所有外部边界共同红线。 |
| 审计：因果与来源可追溯 | U1~U6 关键状态和外部 intent/result | 每个关键判断可回指请求、source/decision ref、固定输入和反馈；历史失败不被成功覆盖 | 争议复盘与状态语义 | 审计链后端仍归 Observability，本仓只拥有自身记录。 |
| 可观测：多轴状态与覆盖可见 | job、source、closure、verification、storage、restore item | partial/stale/missing/conflicting/unsupported/integrity-failed/commit-unknown 必须可定位 | 防止静默缺口和伪成功 | 不等于 metric/dashboard 实施。 |
| 韧性：挂起、核对与补偿 | 外部 material、storage、verification、receiver 交互 | 已知局部结果保留；unknown 先核对；不可安全自动恢复时明确人工/补偿姿态 | 外部副作用唯一性和可恢复性 | 不规定重试次数或队列产品。 |
| 性能/容量：避免无界放大 | 大包、慢 source、fan-out、验证/取回、read | 长工作后台分项推进；进度/局部结果可读；查询不做无界回源 | 规模增长下的可判别性 | 数值必须由 workload/测试 baseline 提供。 |
| 配置与变更：不得绕过架构红线 | binding、compatibility、storage、integrity、lifecycle、receiver | 配置不能创造 authority、改变 owner、默认放行 unknown 或使 local policy 代替正式决定 | 主线边界与 fail-closed | 具体配置模型属于 04。 |

### 4.2 U1~U6 横切适用矩阵

| 单元 | 安全 | 审计 | 可观测 | 韧性 | 性能/容量 | 配置/变更 |
|---|---|---|---|---|---|---|
| U1 Request/Job | actor/scope/authority | admission 与 stage history | job/block reason | 幂等、取消/挂起 | 入口不等待全链路 | admission 行为不可越权配置 |
| U2 Source Binding | material purpose/body | capture/coverage provenance | per-source 状态 | partial/reconcile | slow source 隔离 | source binding 受控 |
| U3 Manifest/Closure | 防越界条目 | revision/closure finding | incomplete/overfull/invalid | 固定输入可重算 | 大集合不阻断进度 | schema/version 受控演进 |
| U4 Integrity/Compatibility | key/secret 不入真相 | input→result 可追溯 | unknown/unsupported/failed | provider unavailable | 大材料验证可后台化 | algorithm/key/schema 不能私设 |
| U5 Storage/Lifecycle | decision/hold/delete guard | intent/feedback/history | tier/commit/retrieval | probe/compensation | 迁移/取回异步 | storage/policy binding 受控 |
| U6 Restore/Handoff | target/minimum material/no-write | plan/item/receiver outcome | partial/conflict/unknown | per-item retry/reconcile | owner fan-out 隔离 | receiver/compatibility 不可绕过 |

### 4.3 跨横切审计

| 审计项 | 结果 |
|---|---|
| 模板化空话 | 每项均有 Archive-specific 作用范围、要求和保护目标。 |
| 适用性遗漏 | U1~U6 六类横切均已判断；不适用的产品/实施细节未引入。 |
| 审计真相越界 | Archive local audit record 与 Observability backend/完整链分离。 |
| 数据/通信冲突 | 横切约束与 Step 8 per-source/item consistency、Step 9 交互方式一致。 |
| 配置越权 | 未用配置创造 retention、algorithm、owner 或 success。 |

## 5. 回填、待确认与门禁

正式 §13 承接横切表、U 单元矩阵和边界结论。所有类别和单元停审完成，跨项审计无内部 unresolved 冲突。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 13 演进路线`。
