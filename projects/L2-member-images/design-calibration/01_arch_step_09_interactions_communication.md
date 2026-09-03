# Step 9. 关键交互与通信方式

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `interactions_communication` | pass | 五条主交互和派生维护路径已按同步、条件型异步、后台延后承接分层;每个上下文已停审,无协议下沉或出站事件伪造 | 进入 Step 10 关键技术选型 | `01_arch_step_04_system_context.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_08_data_ownership_consistency.md` |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 4 / 6~8、架构 SOP Step 9 与书写规范 §4.10。
- [x] 从 C-MI-1~5 识别值得在架构层判断通信方式的五条主交互。
- [x] 先收敛场景和边界,再判断同步 / 异步 / 后台方式。
- [x] 按 BC-MI-01~05 定义同步、异步、后台、恢复与失败上限。
- [x] 每个架构单元交互完成后执行停审。
- [x] 保留 conditional inbound event 和 no outbound event authority。
- [x] 排除 API / event 名、DTO / schema、协议、中间件、时序和重试实现。
- [x] 执行方式冲突、边界穿透、失败缺口和详细设计承接审计。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 4 | 正式交互对象、输入 / 输出面和 dependency failure 上限 |
| Step 6 | 同步入口、后台处理、conditional async intake 和外部运行边界 |
| Step 7 | Runtime / event / ref / adapter / fake 接入纪律 |
| Step 8 | 本地决策强一致、跨域最终一致和 history-preserving recovery |
| 正式 00 IF-MI-001~014 | 能力语义线索,不继承接口 / transport 实现 |
| MI-UP-001 / 003 / 005 / 007 / 009 | Exact mapping、event、Artifact、consumer 和 no-output 上限 |

## 3. SOP 问题回答

1. 哪些交互适合同步能力边界?

   回答:Definition / source validity / assembly baseline 的受控管理与读取、availability publish / replace / rollback / retire 的本地决策、pinned entry / trace / gap 的读取需要即时得到 accepted / rejected / blocked / unavailable / gap 等明确结果,适合同步请求 / 响应类边界。

2. 哪些交互适合异步事件?

   回答:只有 authority 闭口后的 inbound build change 可适用异步事件 / 回调类交互,且事件到达只形成待验证输入。当前 MI-UP-005 未关闭,该 positive lane 不可用;MI-UP-009 明确当前无任何 build / publish outbound event。

3. 哪些交互适合后台任务或补偿路径?

   回答:Nightly intent、input snapshot、external build handoff、candidate adoption、provenance / gate evaluation、Artifact handoff、派生 trace / projection rebuild 和恢复检查均适合后台任务 / 延后承接,不能伪装为同步完成。

4. 哪些交互必须经过正式边界,不能穿透?

   回答:Mapping、component / seed、builder / registry、gate / evidence、Artifact 和 Member Service 交互都必须通过 Step 7 的 runtime / ref / adapter 边界;任何外部 DTO、job、report、tag、container 或 observed state 不得直接写核心 truth。

5. 关键依赖失效时如何降级或挂起?

   回答:同步判断明确返回失败 / gap 且不写 partial positive;后台路径保留 attempt / evaluation / handoff 状态并延后收敛;conditional event 被拒绝 / 挂起;下游消费失败只形成 consumer gap,不回滚 local availability。

6. 哪些口径最容易误入协议细节?

   回答:Manifest resolve 容易被写成 DTO、nightly 易被写成 CI workflow、build result 易被写成 callback schema、Artifact handoff 易被写成 API、availability 易被写成 event topic。当前只固定通信类别和领域失败上限。

7. 每个单元是否已停审,跨交互是否冲突?

   回答:BC-MI-01~05 的同步 / async / background / recovery 边界均与 Step 8 一致;无直接穿透、伪同步完成、event output 或协议细节。

## 4. 当前材料问题诊断

| 候选交互 | 问题 | 当前处理 |
|---|---|---|
| “POST build 后返回镜像 ready” | 长时外部执行被伪装为同步完成 | 同步只接受 intent / 明确结果;构建走后台延后承接 |
| Nightly = 某 CI cron | 调度产品和时间配置侵入架构 | 只确认后台任务语义 |
| Build event 到达即启动并发布 | Event carrier 绕过 source / pin / gate | Conditional input 先验证,当前 lane unavailable |
| Builder callback 直接更新 available | Candidate、eligibility、availability 三阶段串线 | External result 只进入 BC-MI-02,后续各自判断 |
| Artifact handoff 使用同步分布式事务 | 跨 owner 强一致假设 | 后台 handoff + independent gap / ref |
| Publish 后发送 event 给 Member Service | 无 outbound authority | 下游通过 pinned entry 消费;no event output |
| Member Service 返回失败即 rollback | Consumer truth 反写 local supply | 只记录 gap;rollback 必须是显式本地 transition |

## 5. 改动前后对比

| 维度 | 候选口径 | 当前通信结论 |
|---|---|---|
| 定义 / baseline | 文件同步或后台隐式刷新 | 受控同步判断;外部 refresh 可后台但不伪 resolved |
| 构建 | 单次同步 pipeline | Nightly / build / candidate 是后台延后承接 |
| Event | 默认收发 | Conditional inbound only,当前 unavailable;no outbound |
| Qualification | Pipeline 中内联 scan / sign | 后台 gate evaluation,产品和具体 kind 未定 |
| Artifact | 与 image publish 同事务 | 独立后台 handoff 与 gap |
| Availability | Registry push / notify | 明确同步本地 decision,外部执行是前置输入 |
| Entry consumption | 通知 + 自动启动 | 同步 resolve pinned entry / gap,不拥有启动结果 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 全链同步 request / response | 调用方简单 | 长时构建和跨 owner handoff 会产生伪完成 / timeout 语义 | 不采用 |
| 全链事件驱动 | 解耦 | 入站 schema 未闭口,无出站 authority,且事件不能承担 truth | 不采用 |
| 本地判断同步 + 长时工作后台 + 条件型单向事件输入 | 匹配一致性和 authority | 需要显式 pending / gap 状态 | 采用 |
| Artifact / consumer 与本仓共享事务 | 表面一致 | 破坏 owner 边界且不可落地 | 不采用 |
| 先返回 success 后后台补结果 | 体验快 | 制造伪同步完成和 readiness | 不采用 |

## 7. 结构化中间产物

### 7.1 关键交互场景

| ID / 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| `IX-MI-01` 定义与装配基线校准 / 读取 | 本仓与 mapping、component / seed sources 及维护入口 | 即时判断 definition / revision 是否 resolved、complete、pinned、static-safe | 只消费受控 ref / snapshot,不编辑外部 truth。 |
| `IX-MI-02` 构建意图与候选形成 | Nightly / conditional input、本仓与 external build / registry boundary | 让确定 intent / snapshot 在延后处理后形成 candidate 或明确失败 | 外部执行耗时且结果不确定,不能在原同步边界伪完成。 |
| `IX-MI-03` Provenance、资格与 Artifact handoff | 本仓与 gate / evidence / Artifact boundary | 让 candidate 获得完整 provenance、image eligibility 和独立 handoff / gap | Image eligibility 与 Artifact formalization 分域成立。 |
| `IX-MI-04` Supply availability transition | 本仓正式管理入口与 local supply truth | 即时决定 publish / replace / rollback / retire 是否成立 | Registry / consumer outcome 只能作为已验证输入,不能代替 local decision。 |
| `IX-MI-05` Pinned entry 与 handoff / consumer gap 读取 | 本仓与 Member Service consumer boundary | 返回与 local availability 一致的 immutable entry 或明确 unavailable / gap | 不表达 container create / start / health / confirmation truth。 |
| `IX-MI-06` 派生 trace、projection 与维护恢复 | Core truth、受控 refs 与派生读取边界 | 延后形成 / 重建 source trace、history view、gap 和 maintenance explanation | 派生失败不反写 core truth。 |

### 7.2 通信方式判断

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| IX-MI-01 定义与装配基线校准 / 读取 | 同步请求 / 响应类交互 | 不宜以异步事件直接写 resolved / complete | 明确 missing / stale / conflict / incomplete / blocked,不写 partial positive | 调用方需要即时知道基线能否成为 build 前提。 |
| IX-MI-02 Nightly intent / build / candidate | 后台任务 / 延后承接类交互 | 不宜以同步调用承诺 candidate 已形成 | 保留 intent / attempt 的 pending / failed / blocked / unknown,新 attempt 恢复 | 长时执行和外部 outcome 不应占用或伪装同步边界。 |
| IX-MI-02 Conditional build input | 异步事件 / 回调类交互,conditional | 不宜直接穿透到 build 或 supply | MI-UP-005 期间 rejected / unavailable;闭口后仍先验证 authority | Event 只是输入载体,不是 intent / candidate truth。 |
| IX-MI-03 Provenance / eligibility | 后台任务 / 延后承接类交互 | 不宜把 evidence adapter result 作为同步 pass | Missing / failed / unverifiable gate 形成 blocked / pending | 多来源 safe conclusions 必须在独立 evaluation context 收口。 |
| IX-MI-03 Artifact handoff | 后台任务 / 延后承接类交互 | 不宜与 image eligibility 使用共享同步事务 | 保留 handoff pending / rejected / unavailable 和 ref gap | Artifact owner 独立;MI-UP-007 未闭口。 |
| IX-MI-04 Supply availability transition | 同步请求 / 响应类交互 | 不宜仅靠 registry callback 或 event 自动改变 | 明确拒绝 / blocked,原 availability 不变;恢复走新 transition | Local supply decision 需要即时、明确、history-preserving。 |
| IX-MI-05 Entry / gap resolve | 同步请求 / 响应类交互 | 不宜以 push notification 作为唯一供给方式 | 返回 unavailable / contract-gap,不猜 ref、不声明 launch | Consumer 必须在实例化前获得明确 pinned result。 |
| IX-MI-06 Trace / projection / maintenance | 后台任务 / 延后承接类交互 | 不宜进入正式同步写路径 | 标记 stale / rebuilding / unavailable,从 truth 重建 | 派生读取可延迟但不能成为第二写源。 |

### 7.3 按架构单元的交互边界

| 架构单元 | 同步交互 | 异步交互 | 后台 / 恢复 | 失败降级 |
|---|---|---|---|---|
| BC-MI-01 | Definition / baseline 校准、读取与明确拒绝 | 无 current event write | External snapshot refresh 可延后;新 revision 恢复 | Missing / stale / conflict / incomplete -> blocked |
| BC-MI-02 | Intent 接受 / 拒绝结果可同步返回 | Conditional inbound build input only | Nightly、snapshot、execution handoff、candidate、新 attempt | Failed / blocked / unknown -> no candidate |
| BC-MI-03 | Eligibility / trace 查询返回明确状态 | 无 event output | Provenance / gate evaluation、Artifact handoff、新 evaluation | Missing gate / handoff -> blocked / gap |
| BC-MI-04 | Availability transition 与 entry / gap resolve | 无 event output | External ref reconciliation / explicit recovery support | Invalid ref / consumer gap 不改写 local truth |
| BC-MI-05 | Safe trace / gap query | 只承接获准 external input,不发 core facts | Snapshot / projection refresh、rebuild、maintenance | Stale / unavailable 显式,projection 不反写 |

### 7.4 交互方式停审

| 单元 | 方式匹配所有权 / 一致性 | 经正式边界 | 无协议下沉 | 失败上限完整 | gate_status |
|---|---|---|---|---|---|
| BC-MI-01 | pass | pass | pass | pass | pass |
| BC-MI-02 | pass | pass | pass | pass | pass |
| BC-MI-03 | pass | pass | pass | pass | pass |
| BC-MI-04 | pass | pass | pass | pass | pass |
| BC-MI-05 | pass | pass | pass | pass | pass |

### 7.5 跨交互边界审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 同步 / 异步冲突 | pass | 本地即时判断与长时后台工作分离;event 不承担 decision。 |
| 边界穿透 | pass | External sources / products 均经过 ref / adapter / runtime seam。 |
| 伪同步完成 | pass | Build、gate、Artifact handoff 都不提前返回 positive complete。 |
| 协议细节下沉 | pass | 无 route、DTO、schema、topic、callback、middleware 或时序。 |
| 失败降级 | pass | 每场景有 rejected / blocked / unknown / unavailable / gap 上限。 |
| Event authority | pass | Conditional inbound pending;无 outbound event。 |
| 详细设计承接 | pass | 后续可定义 contracts / state,但不能改变本步方式与 owner。 |

本步不画简化交互图。原因是五条主交互是并列的边界类别,将它们连成图容易被误读为全链运行时序;两张主表和单元表已更准确表达“场景 -> 通信方式 -> 失败上限”。

### 7.6 边界说明

同步边界只承诺即时领域判断,不承诺长时外部工作已经完成。Background 路径必须保留 pending / failure / unknown,不能借同步 accepted 伪装最终成功。Conditional event 只提供待验证输入,当前没有可发布的镜像域出站事件。所有具体 transport、contract、delivery、idempotency key、timeout 和 retry 实现留给后续设计。

## 8. 回填草稿

正式 01 §10 回填 §7.1 场景、§7.2 方式判断、§7.3 单元边界和 §7.6 边界说明。正式章必须显式写出 event input 未 ready、no event output、Artifact / consumer gap 不反写 local truth。

## 9. 待确认事项

- MI-UP-003 限制 IX-MI-01 exact mapping communication contract。
- MI-UP-005 限制 IX-MI-02 event input;nightly background 路径不依赖其关闭。
- MI-UP-007 限制 IX-MI-03 Artifact handoff exact communication。
- MI-UP-001 限制 IX-MI-05 exact entry / confirmation communication。
- MI-UP-009 继续排除任何 outbound event scenario。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 五条核心交互及维护路径是否有正式边界 | pass |
| 同步 / 条件型异步 / 后台方式是否有理由和不宜方式 | pass |
| BC-MI-01~05 是否逐个停审 | pass |
| 是否无直接穿透、伪同步完成、协议细节或出站事件 | pass |
| 失败上限是否与数据一致性相符 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 10,不得跳到 Step 11 或修改正式 01。
