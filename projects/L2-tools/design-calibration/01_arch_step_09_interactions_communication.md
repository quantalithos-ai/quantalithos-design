# L2-tools 01 架构设计 Step 9: 关键交互与通信方式

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 9
> 正式文档回填位置: `01-架构设计.md` 第 10 章

---

## 1. 本步输入与目标

### 1.1 本步目标

在系统上下文、逻辑运行承载、依赖方向和数据 owner 已经闭合的前提下,判断哪些交互必须在正式边界同步给出结果,哪些只用于异步传播已成立事实或送达外部结果,哪些可由后台延后承接。通信方式只服务边界语义;本步不定义 API、event、topic、DTO、schema、callback、队列、重试或固定时序。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| Step 4 | 当前上下文为 Core、Hub、Sandbox、Runtime、Bus、Observability;authorization pending、SDK future/excluded。 | 只在已确认或明确 pending 的正式边界讨论交互,不新增 provider / registry 直连。 |
| Step 5 | `A1~A5`、`S1~S3`、`P1~P6` 已固定 owner 和统一语言。 | 交互不能合并 admission/authorization、handoff/receipt、capture/outcome、attempt/delivery。 |
| Step 6 | `R1` 同步正式承接、`R2` 异步协作承接、`R3` 后台维护派生逻辑可分。 | 运行角色不等于协议或物理进程;交互判断不得反向改写 owner。 |
| Step 7 | 只有 Core 为 compile;Hub/Sandbox/Runtime 为 runtime;Bus/Observability 为 event。 | Material handoff 附着既有 carrier,不发明第四类依赖。 |
| Step 8 | 本地核心关系强一致;外部 snapshot/ref 按消费时点;派生与外部状态最终一致。 | 同步失败不留部分 truth;异步/后台失败不回滚既有 truth。 |
| 需求 Step 12、正式 00 §12 | `IB-L2T-019` 是同步 authorization 结果承接,`IB-L2T-012` 只是异步变化输入候选;`IB-L2T-014` 要求正式承接 execution material。 | 不能用变化通知替代执行前同步结果,也不能因 material 承接能力存在而声称外部 callback/carrier 已 ready。 |
| 架构 SOP Step 9 / 书写规范 4.10 | 先识别交互场景,再判断通信方式、不宜方式和失败口径。 | 使用三类正式通信方式;逐单元停审并完成跨交互审计。 |

### 1.3 Step 内计划

- [x] 恢复 flow / ledger,确认只允许 Step 9。
- [x] 读取 SOP Step 9、书写规范 4.10、Step 4/5/6/7/8 和需求接口边界。
- [x] 区分同步即时裁定、异步事实传播 / 结果送达、后台派生维护。
- [x] 区分 execution material 的外部送达方式与进入 L2 后的正式受理 / 裁定。
- [x] 逐场景形成边界、方式、不宜方式和失败口径。
- [x] 逐 `A1~A5`、`S1~S3`、`P1~P6` 完成交互停审。
- [x] 审计条件路径、owner、直接穿透、协议下沉和 blocker 伪闭口。

---

## 2. SOP 问题回答

### 2.1 哪些交互适合同步请求 / 响应

- 工具身份 / 正式定义建立、更正、退役及稳定读取,必须即时给出成立、拒绝、冲突或不可用判断。
- Binding 建立、替换、失效、读取和当前可消费判断,必须在当前 Hub snapshot/ref 的消费时点同步收口。
- Canonical invocation 接入、合同锚定、admission、执行前拒绝和 no-execution,必须在真实执行前同步裁定。
- Governed invocation 必须通过正式边界同步消费 authorization 结果;来源不可验证即 fail closed。异步变化输入不能替代本次同步消费。
- 条件化 Sandbox handoff 必须同步形成 L2 自身的 eligibility/context/attempt/gap;它不证明 Sandbox accepted、receipt 或 run。
- Execution material 一旦被呈交到 L2 正式承接边界,必须同步判断是否可接受、可回链或形成 gap;是否据此产生 outcome 只能由 `A5` 正式规则裁定。
- Normalized outcome、Tool-domain audit、合同 / binding / handoff gap 和受控读取必须同步返回当前 L2 truth 或明确不可用。

### 2.2 哪些交互适合异步事件 / 回调

- 已成立的合同、演进、binding、outcome、audit 或 handoff gap 的安全变化传播。
- Hub capability/exposure 变化线索、authorization 结果变化线索和 Sandbox execution source/failure material 的正式送达。它们只是外部事实 / 结果送达,进入后仍需 L2 正式判断。
- 已成立本地 truth 的 safe material 向 Bus event boundary 传播;Observability 只是经正式 event carrier 的逻辑消费目标。
- Bus delivery 或 Observability observation 状态若未来有正式反馈来源,可作为异步结果送达形成新 snapshot/ref/gap。

上述异步边界只声明通信类别。Authorization owner/source、Sandbox material carrier/mapping/receipt、Observability producer/source/route/readiness 未闭口,因此不得命名 event、callback、route 或声称已有正向通道。

### 2.3 哪些交互适合后台任务 / 延后承接

- Binding/reference validity 检测、对账和 gap 报告。
- Search、browse、diff、index、diagnostic、受控读取投影和派生材料重建。
- Safe material 的只读组装与外围派生;eligibility、最小化 / 脱敏判断和 local attempt 仍由 `A5` 正式边界形成。
- 外部 snapshot/ref 状态刷新和 handoff 状态摘要刷新,但只有正式 source 存在时才可进行。

后台发现问题不能直接修正 `A1~A5/S1` 或外部 truth。需要正式变化时必须重新进入同步正式边界,并形成新判断、新事实或显式 gap。

### 2.4 哪些交互必须经过正式边界

Caller/Runtime 输入、Hub controlled view、authorization result、Sandbox handoff/source、Bus safe material 与 Observability logical consumption 全部必须经过相应正式 seam。Core shared contract 只通过 compile authority 进入,不形成运行期调用假设。任何 sibling source model、外部正文、provider registry、SDK wrapper 或观察存储都不能直接穿透 `A1~A5/S1`。

### 2.5 关键依赖失效时如何降级或挂起

- 同步边界失效:明确拒绝、冲突、不可验证、no-execution、gap 或 unavailable,不形成部分 truth,不先返回完成。
- 异步送达 / 传播失效:保持未送达、待承接、unknown 或 gap;已成立本地 truth 不回滚,未成立 truth 不补造。
- 后台承接失效:保持 stale、rebuilding、unavailable 或 reconciliation gap;不阻塞不相关核心路径,不反写核心。
- 外部 owner / source / carrier 未闭口:保持 blocker 和 fail-closed,不能用轮询、fallback、last-known-good 或本地 allowlist 在架构层伪闭口。

### 2.6 本步最容易误入的协议细节

最容易失控的是把同步能力面直接命名为 HTTP/RPC/in-process,把异步变化写成具体 event/topic/callback,把 execution material 逻辑送达写成现成 receipt/carrier,把后台承接写成 worker/retry/DLQ/replay,以及把状态词写成固定 enum。以上全部后移到后续正式文档。

---

## 3. 旧材料诊断

| 旧交互口径 | 冲突 | 当前处理 |
|---|---|---|
| Runtime 同进程调用 Python package | 将部署和源码调用当正式通信方式。 | 只保留 Runtime 与 L2 的同步运行期消费边界。 |
| Builtin / MCP / Sandbox 三类 executor 流程 | 按 carrier 分叉 invocation/result/error,并吸收 provider / Sandbox truth。 | 统一 canonical semantics;carrier 只形成条件 seam。 |
| 本地 registry / allowlist 同步兜底 | Hub 或 authorization 不可用时自造判断。 | 必要 source 不可验证即 fail closed。 |
| Capture callback 直接写 ToolResult | 外部 material 跳过正式受理和 outcome 裁定。 | 先区分异步送达与同步受理,再由 `A5` 形成新 outcome 或 gap。 |
| Event emitter 同步等待 Bus / Observability | 将 delivery / observation 变成本地提交条件。 | Local truth first;安全事实异步传播,外部失败不回滚。 |
| Retry worker / replay / DLQ 作为架构补偿 | 伪造具体机制和外部 owner 状态。 | 只保留待承接、重入正式边界、新事实 / gap 的架构口径。 |
| 固定 API、事件名、错误码和三态状态 | 把旧实现词汇升级为当前合同。 | 全部 historical material,本步只用三类正式通信方式。 |

---

## 4. 设计取舍

### 4.1 同步核心裁定

采用同步请求 / 响应承接会建立或即时判断 L2 truth 的交互,因为 caller 必须在真实执行或正式变化前获得明确结果。同步成功只表示当前 L2 边界内的合同、受理、前置、handoff 或 outcome 判断成立;不表示 Sandbox execution 完成、Bus delivered 或 Observability observed。

### 4.2 异步传播与外部结果送达

已成立事实传播和外部 owner 结果送达采用异步类别,避免把所有 owner 压入一个伪同步事务。外部材料到达不自动成为本地 truth;它必须先通过正式来源 / 时点验证和同步受理。Positive carrier 未闭口时只保留逻辑 seam,不将通信类别写成集成 readiness。

### 4.3 后台派生与正式重入

检测、对账、索引、诊断、刷新和重建不要求占用同步主边界,因此由后台延后承接。后台可形成自身报告或派生状态,但任何影响核心 truth 的变化都必须重入同步正式边界。所谓补偿只表示形成新判断、重新承接或显式 gap,不预设 retry、queue、DLQ、replay 或 recovery 实现。

### 4.4 条件路径不是固定时序

Capability-unbound 场景不需要 Hub binding 判断,非 governed 场景不需要 authorization 结果,非 sandbox-required 场景不经过 Sandbox seam,no-execution 不需要等待 execution source,不需要外部传播的事实不进入 Bus。交互分类图和两张主表表达边界选择,不表示每次调用都顺序经过所有节点。

---

## 5. 结构化中间产物

### 5.1 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| 工具合同建立、正式变化与稳定读取 | 正式维护 / 消费入口 ↔ `A1/S1` | 建立或读取唯一 tool identity、current definition 和演进影响。 | 需要即时判定当前合同是否成立;派生搜索不能触发写入。 |
| Binding 建立、变化与当前可消费判断 | 正式维护入口 / Hub controlled seam ↔ `A2/P2` | 建立 body-free relation 并判断当前 source 是否足以支持调用。 | Hub truth 保持外部 owner;stale/conflict 必须在本地判断中显式。 |
| Canonical invocation 与 admission | Runtime / caller 正式入口 ↔ `A3/P5` | 形成合同锚定的 invocation 并在真实执行前受理或收束 no-execution。 | Caller/carrier 不得分叉调用语义,也不把 Runtime orchestration 带入。 |
| Execution requirement 与同步 authorization 消费 | Invocation 正式前置边界 ↔ `A4/P3` | 判断工具执行要求,并在 governed 场景消费本次正式 authorization 结果。 | `IB-L2T-019` 是同步消费;`P3` owner-pending 时只能 fail closed。 |
| 条件化 Sandbox execution handoff | `A4/P4` ↔ Sandbox runtime seam | 在适用前置成立后交接 canonical invocation,形成 L2 eligibility/context/attempt/gap。 | L2 attempt 不等于 Sandbox accepted、receipt、run 或 execution complete。 |
| Execution source / failure material 外部送达 | Sandbox logical source seam ↔ `R2/P4` | 将正式 external execution source 线索送达 L2。 | Carrier/mapping/receipt 未闭口;送达本身不生成 normalized outcome。 |
| Execution material 正式受理与 outcome 裁定 | `R2/P4` ↔ `A5/T2` 正式语义边界 | 验证 source、消费时点和可解释性,形成新 outcome/audit 或 gap。 | 外部送达方式不改变进入 L2 后必须正式受理的要求。 |
| Outcome、audit 与 gap 稳定读取 | `A1~A5/T1/T2` ↔ Runtime /正式消费者 | 一致读取合同、受理、终态、审计和本地 degradation/gap。 | 只返回 L2 truth 和允许 refs;不得拉取外部状态后原地改写。 |
| Hub capability/exposure 变化线索送达 | Hub runtime seam ↔ `R2/P2` | 让 L2 感知外部 capability source 变化并触发新判断或 gap。 | 不修改 Hub truth,也不穿越改写既有 invocation。 |
| Authorization 结果变化线索送达 | Pending authorization seam ↔ `R2/P3` | 在正式 owner/source 成立后感知结果变化。 | `IB-L2T-012` 只是候选异步输入;不替代本次执行前同步消费。 |
| 已成立本地事实的安全变化传播 | `A1/A2/A5` ↔ `R2` ↔ Bus event boundary | 传播通过安全门禁的合同、binding、outcome、audit 或 gap 变化。 | 事实先成立再传播;Bus 只拥有 delivery truth。 |
| Observability 安全材料逻辑消费 | Bus event boundary ↔ Observability logical consumer | 让观察边界消费最小、body-free、脱敏且可关联材料。 | 无 L2 direct route;producer/source/route/readiness 继续 blocked。 |
| 外部 delivery / observation 状态反馈 | Bus / Observability formal feedback source ↔ `P6` | 在正式来源存在时形成与本地 attempt 关联的新状态摘要 / ref。 | 当前仅为条件逻辑边界;unknown 不能写成 delivered/observed。 |
| Binding / reference 检测与对账 | `S2/R3` ↔ 核心 truth /允许 `P` refs | 识别 stale、conflict、missing、unverifiable 和 owner attribution gap。 | 报告不修正 binding、outcome 或外部 truth。 |
| Search / diff / index / diagnostic 重建 | `S3/R3/D1` ↔ 核心 truth | 提供可重建的只读消费视图和诊断材料。 | 派生可 stale/rebuilding/unavailable,不能成为核心前置。 |
| Safe material 只读组装与状态摘要刷新 | `S3/R3/D1` ↔ `A5/P6` | 延后组装已经通过资格判断的材料,并在正式来源存在时刷新摘要。 | `A5` 独占 eligibility/local attempt;后台不得声称外部成功。 |

### 5.2 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| 工具合同建立、正式变化与稳定读取 | 同步请求 / 响应类交互 | 不宜由异步传播或后台派生先返回成立 | 明确拒绝、冲突或不可用;不形成部分合同 | 当前 identity/definition 和正式变化需要即时收口。 |
| Binding 建立、变化与当前可消费判断 | 同步请求 / 响应类交互 | 不宜只靠后台对账或异步线索自动写关系 | Stale/conflict/missing 时失败或 fail closed | Relation truth 由 `A2` 在当前消费边界裁定。 |
| Canonical invocation 与 admission | 同步请求 / 响应类交互 | 不宜全异步后再推断是否受理 | Reject、no-execution、gap 或 unavailable,不得发起真实执行 | 真实执行前必须得到合同内即时判断。 |
| Execution requirement 与同步 authorization 消费 | 同步请求 / 响应类交互 | 不宜用异步变化通知或 last-known-good 替代 | Source/result 不可验证即 fail closed | 本次 governed invocation 不能等待或猜测未来变化线索。 |
| 条件化 Sandbox execution handoff | 同步请求 / 响应类交互 | 不宜写成 fire-and-forget 成功或后台宿主直跑 | 形成 L2 reject/no-execution/attempt/gap;不声称 external accepted | 本步只判断 L2 交接边界,positive receipt 仍 open。 |
| Execution source / failure material 外部送达 | 异步事件 / 回调类交互 | 不宜要求原始 invocation 同步等待全部 execution lifecycle | 保持待送达、未解析或 source gap;不补造 material | 场景本质是外部 owner 已形成材料后的结果送达。 |
| Execution material 正式受理与 outcome 裁定 | 同步请求 / 响应类交互 | 不宜由异步消费者直接写终态或后台静默修正 | 明确接受、拒绝、unverifiable 或 gap;不形成半 outcome | 材料一旦呈交,当前边界必须即时判断能否进入 L2 语义。 |
| Outcome、audit 与 gap 稳定读取 | 同步请求 / 响应类交互 | 不宜以异步推送作为唯一读取方式 | 返回当前 truth、not-found、stale-ref 或 unavailable | 消费者需要稳定判断本地终态,不等于外部状态实时闭环。 |
| Hub capability/exposure 变化线索送达 | 异步事件 / 回调类交互 | 不宜让 Hub 同步穿透 `A2` 或自动更新 relation | 保持待承接或 gap;新判断经正式边界形成 | 外部变化只触发重评,不迁移 owner。 |
| Authorization 结果变化线索送达 | 异步事件 / 回调类交互 | 不宜替代同步 authorization 结果承接 | 无正式 owner/carrier 时保持 unavailable/gap | 当前只确认候选逻辑输入,不声明 route。 |
| 已成立本地事实的安全变化传播 | 异步事件 / 回调类交互 | 不宜把下游确认放入本地 truth 同步提交条件 | 保持 local attempt/degradation/gap;不回滚 truth | 传播对象必须先通过四项安全门禁。 |
| Observability 安全材料逻辑消费 | 异步事件 / 回调类交互 | 不宜 L2 direct sync write observation store | Route 未成立时保持 blocked/gap,不声称 observed | Observability 经正式 event carrier 逻辑消费。 |
| 外部 delivery / observation 状态反馈 | 异步事件 / 回调类交互 | 不宜同步轮询成为本地终态成立条件 | 保持 unknown、unavailable 或新 gap/snapshot | 只有正式反馈来源成立后才可形成摘要。 |
| Binding / reference 检测与对账 | 后台任务 / 延后承接类交互 | 不宜占用 invocation 同步主路径或直接修正 truth | 形成 stale/conflict/gap report;正式变化重入同步边界 | 检测是维护能力,不是写 owner。 |
| Search / diff / index / diagnostic 重建 | 后台任务 / 延后承接类交互 | 不宜阻塞合同、invocation 或 outcome 成立 | 标记 stale/rebuilding/unavailable,不反写核心 | 派生视图允许延迟收敛和重建。 |
| Safe material 只读组装与状态摘要刷新 | 后台任务 / 延后承接类交互 | 不宜由后台裁决 eligibility 或制造 external status | 形成派生失败或刷新 gap;不改 outcome/audit | 资格和尝试由 `A5` 正式边界形成。 |

### 5.3 按架构单元的交互方式表

| 架构单元 | 同步请求 / 响应 | 异步事件 / 回调 | 后台 / 延后承接 | 失败降级口径 | 停审 |
|---|---|---|---|---|---|
| `A1` | Identity/definition 建立、变化和稳定读取。 | 已成立合同安全变化传播。 | 只读索引可延后,不能写 A1。 | 同步失败不形成部分合同;传播失败不回滚。 | pass |
| `A2` | Binding 建立/替换/失效和消费判断。 | Hub 变化线索输入、binding 安全变化输出。 | Validity scan / reconciliation。 | Hub 缺失 fail closed;检测不修正 relation。 | pass |
| `A3` | Canonical invocation、anchor、admission/reject/no-execution。 | 无异步核心受理主路径。 | 不允许后台受理 invocation。 | 未即时闭合不得真实执行。 | pass |
| `A4` | Execution requirement、同步 auth 结果消费、Sandbox handoff 判断/尝试。 | Auth 变化线索和执行前外部 source 变化只作触发。 | 允许前置 ref 检测,不能代替本次判断。 | 不可验证 fail closed;不声称 Sandbox accepted/run。 | pass |
| `A5` | Execution material 受理、outcome/audit 裁定和稳定读取。 | Sandbox source 送达、post-truth safe change 传播和条件反馈。 | Safe material 只读组装可延后。 | Source 不可信形成 gap;外部失败不回滚 outcome/audit。 | pass |
| `S1` | 正式演进 / 兼容影响经 `A1` 同步收口。 | 已成立演进影响安全传播。 | Diff / impact view 可派生。 | 不能静默写历史或旁路 current definition。 | pass |
| `S2` | 只读报告查询;正式修正重入相应核心同步边界。 | 接收外部变化线索作为检测触发。 | 检测、对账、追溯主承接。 | 输出 report/gap,不自动修正。 | pass |
| `S3` | 受控只读消费。 | 不拥有核心 safe output;仅消费允许传播材料。 | Search/diff/index/diagnostic/assembly/rebuild。 | Stale/rebuilding/unavailable,不阻塞核心。 | pass |
| `P1` | 无运行期同步调用假设;compile authority 在构建边界验证。 | 无当前异步关系。 | Authority/ref 检测可延后。 | Authority 未闭口时阻塞具体 shared type 声明。 | pass |
| `P2` | 当前判断按需同步消费 Hub controlled snapshot/ref。 | Hub 变化线索逻辑送达。 | Snapshot/ref validity refresh。 | Missing/stale/conflict 显式,不回退 registry。 | pass |
| `P3` | Governed invocation 同步消费正式 result ref/summary。 | 正式 owner 成立后的变化输入候选。 | 仅可检测 source,不能生成 decision。 | Owner/source 不存在即 gap/fail closed。 | pass |
| `P4` | Sandbox readiness/handoff 与 material 呈交受理。 | Execution source/failure material 逻辑送达。 | Source/ref 摘要刷新可延后。 | Mapping/carrier/receipt open;不得直跑或伪 outcome。 | pass |
| `P5` | Caller context 与 actor/work/trace refs 随 invocation 同步承接。 | 无统一外部 owner 的异步主路径。 | Ref validity 检测可延后。 | Ref 缺失显式 gap,不复制 caller/Runtime 正文。 | pass |
| `P6` | 本地 attempt/gap 和允许状态摘要受控读取。 | Safe material 输出与正式反馈结果逻辑送达。 | 正式 source 存在时刷新分离摘要。 | Delivery/observation 保持 unknown/gap,不反写。 | pass |

### 5.4 交互类别位置示意

#### 图类型

简化交互边界示意图。

#### 图标题

L2-tools 同步裁定、异步协作与后台派生的位置。

```text
+----------------------+       +-----------------------------+
| Caller / formal      |------>| Sync formal judgment        |
| maintenance intent   |       | only truth decision boundary|
+----------------------+       +--------------+--------------+
                                               ^ |
                             formal re-entry   | | established truth
                                               | v
+----------------------+       +---------------+-------------+
| External fact/result |------>| Async intake / propagation  |
| delivery clues       |       | no direct truth write       |
+----------------------+       +-----------------------------+

+----------------------+       +-----------------------------+
| Established truth +  |------>| Background derive / check   |
| allowed snapshot/ref | read  | stale/rebuild allowed       |
+----------------------+ only  +-----------------------------+
```

- 图只表达三类通信方式在边界上的位置,不表达 A1→A5 固定时序、协议或运行单元部署。
- 异步输入不能直接写 truth;图中的 `formal re-entry` 表示它进入同步正式语义判断后才可能形成新事实或 gap。
- 后台承接只能只读派生、检测和刷新;正式变化必须重入同步边界。
- Authorization、Sandbox 和 Observability 的 positive carrier 未闭口,图不声明已有 route/callback。

### 5.5 交互方式停审记录

| 交互范围 | 匹配数据 owner / 一致性 | 经过正式边界 | 未下沉协议 | 失败口径清楚 | 结论 |
|---|---|---|---|---|---|
| 合同 / Binding 正式变化与读取 | 是 | 是 | 是 | 是 | pass |
| Invocation / admission / authorization 消费 | 是 | 是 | 是 | 是 | pass |
| Sandbox handoff 与 execution material | 是 | 是 | 是 | 是 | pass |
| Outcome / audit / gap 消费 | 是 | 是 | 是 | 是 | pass |
| Hub/Auth/Sandbox 外部变化 / 结果送达 | 是 | 是 | 是 | 是 | pass |
| Bus/Observability 安全传播 / 条件反馈 | 是 | 是 | 是 | 是 | pass |
| 检测 / 对账 / 派生 / 重建 | 是 | 是 | 是 | 是 | pass |
| `A1~A5/S1~S3/P1~P6` 逐单元 | 是 | 是 | 是 | 是 | pass |

### 5.6 跨交互边界审计

| 检查项 | 结果 | 说明 |
|---|---|---|
| 同步 / 异步选择冲突 | 已消解 | External material 异步送达与 L2 同步受理分层;不要求原 invocation 同步等待。 |
| Authorization 两能力面混写 | 无 | `IB-L2T-019` 同步消费本次结果;`IB-L2T-012` 仅为异步变化输入候选。 |
| 条件 seam 串成固定时序 | 无 | Unbound/non-governed/non-sandbox/no-output 路径按适用性裁剪。 |
| 外部输入直接穿透核心 | 禁止 | 所有线索/材料必须经过正式来源、时点和语义判断。 |
| 异步输入直接写 truth | 禁止 | 只有 `A1~A5/S1` 正式边界可决定新事实。 |
| 后台反写核心 / 外部 truth | 禁止 | 后台只形成 report/projection/gap,正式变化需重入。 |
| Sandbox accepted/receipt/run 伪造 | 无 | L2 handoff attempt 与 external truth 分离;carrier/receipt open。 |
| Observability direct route 伪造 | 无 | 只保留经 event carrier 的逻辑消费,positive route blocked。 |
| Handoff 第四依赖类型 | 无 | Sandbox material 附着 runtime;Bus/Obs material 附着 event。 |
| 失败降级缺口 | 无 | 同步、异步、后台分别有明确失败 / 挂起口径。 |
| 协议 / 实现细节下沉 | 无 | 未写 API、event、topic、DTO、schema、callback、queue、worker、retry 或 DLQ。 |
| 后续详细设计承接风险 | 已暴露 | Mapping、carrier、receipt、route、状态和错误细化继续受 blocker 约束。 |

---

## 6. 回填草稿

正式 01 第 10 章使用 §5.1 关键交互场景表、§5.2 通信方式判断表和 §5.4 简化示意图。必须保留四项去歧义:同步成功只说明当前 L2 判断成立;execution material 异步送达与同步受理分层;后台发现问题必须正式重入;所有条件 seam 不构成每次调用的固定时序。

---

## 7. 待确认事项

本步无新增 blocker。`L2T-UP-001~009` 不阻塞通信类别与失败语义闭合,但继续阻塞 authorization owner/carrier、Sandbox mapping/material carrier/receipt/feedback、Observability producer/source/route/readiness、Core Tools-specific contract 和 SDK client 被声明为现成正向交互。后续文档不得把“异步事件 / 回调类”表述误读为已有 callback 或 route。

---

## 8. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 是否先识别场景再判断通信方式 | pass |
| 是否只使用三类正式通信方式 | pass |
| 是否逐场景写明不宜方式和失败口径 | pass |
| 是否覆盖 14 个架构单元并停审 | pass |
| 是否区分外部结果送达与本地正式裁定 | pass |
| 是否完成跨交互边界审计 | pass |
| 是否保留 pending/open/future blocker | pass |
| 是否避免接口目录、时序、协议和失败实现 | pass |

```text
current_step = Step 9 interactions_communication completed
gate_status = pass
gate_reason = synchronous L2 judgment, asynchronous fact/result delivery and background derivation passed scenario, per-unit and cross-interaction audits without claiming open carriers
next_allowed_action = create_and_complete_01_arch_step_10_technology_choices
formal_document_write_allowed = false
commit_required = false
```
