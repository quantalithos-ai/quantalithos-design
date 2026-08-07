# L2-tools 01 架构设计 Step 1: 确认需求基线

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 1
> 正式文档回填位置: `01-架构设计.md` 第 1、3、16 章

---

## 1. 本步输入与目标

### 1.1 本步目标

从已完成的正式 `00-需求文档.md` 中提炼会改变架构边界、数据所有权、依赖方向与一致性策略的稳定结论,并把未闭口事项明确保留为条件风险。本步不重写需求全文,不设计上下文、容器、协议或实现。

### 1.2 输入与读取结论

| 输入 | 当前效力 | 本步读取结论 |
|---|---|---|
| `projects/L2-tools/00-需求文档.md` | `current_baseline` | 仓定位、五节点闭环、17 项核心 FR、6 项外围 FR、truth 边界、依赖裁剪、NFR、风险和追溯已完成。 |
| `00_req_step_02/07/10/11/12/13/15/16` | `current_baseline_detail` | 提供定位、核心能力、硬规则、数据归属、接口依赖、质量边界、开放项和完整追溯。 |
| 架构 SOP / 书写规范 | `normative` | 本步只形成需求基线、硬约束和开放风险,回填正式 01 的来源、约束和追溯章节。 |
| 全局依赖规则 | `normative_current_workspace` | 当前只允许 Core compile、Hub/Sandbox/Runtime runtime、Bus/Observability event;SDK 与 authorization owner 不适用。 |
| Hub/Sandbox/Observability/Core/Bus/SDK 正式链 | `current_workspace_input` | 可确认各自 owner 与消费 seam;不可确认 Tools-specific schema、route、mapping、readiness 或 evidence。 |
| L2 README 与旧正式 01 | `historical_material` | 只能识别 Python 同进程、inventory/MCP/extras、旧 registry/executor/SLA/ADR 污染。 |

### 1.3 Step 内计划

- [x] 恢复项目台账和架构 flow,确认只允许 Step 1 写入。
- [x] 读取 Step 1 SOP、书写规范对应章节与正式 00。
- [x] 提炼会约束架构形态的稳定需求结论。
- [x] 筛选不可被后续方案绕过的架构硬约束。
- [x] 将 `L2T-UP-001~009` 转成未关闭需求风险,不自行闭口。
- [x] 后置审计旧 README / 01,隔离 historical material。
- [x] 形成回填草稿、自检和进入 Step 2 门禁。

---

## 2. SOP 问题回答

### 2.1 当前架构依赖哪些需求结论

架构直接依赖四组结论:

1. `L2-tools` 是工具调用语义契约真相仓,不是工具库存、执行器或 Runtime 编排器。
2. 五节点闭环依次覆盖身份 / 定义、Capability Binding、规范调用、执行前置 / 隔离交接、Outcome / 审计 / 安全交接;但条件分支不构成每次调用固定穿越的外仓时序。
3. 本仓数据只在 tool-domain truth、消费时点 snapshot/ref 和安全派生范围内成立;外部正文与 secret 为 forbidden body。
4. 跨仓关系必须保持 owner 和依赖类型分离,开放合同只能形成 fail-closed、deferred 或 future 边界。

### 2.2 哪些结论已经稳定

- Tool identity、formal definition、canonical invocation、normalized result/error/no-execution、Tool-domain audit 的 owner 已稳定为 L2。
- Hub registry/exposure、authorization decision、Sandbox execution、Bus delivery、Observability store 和 Runtime orchestration 的外部 owner 边界已稳定。
- Capability Binding 只拥有 body-free relation,execution handoff 只拥有本地语境和允许 source ref,安全交接只拥有本地准备 / 尝试 / 缺口。
- Core 是唯一 compile 依赖;Hub、Sandbox、Runtime 为 runtime seam;Bus、Observability 为 event seam。
- 外围搜索、diff、批量维护、派生索引、诊断和客户端说明不成为核心闭环前置。

### 2.3 哪些结论仍待确认

- Authorization owner、source matrix、taxonomy 和结果消费合同。
- Canonical invocation 与 Sandbox generic chain、capture/failure 与 normalized outcome 的正式 mapping。
- Sandbox receipt、DLQ、feedback、cleanup release seam。
- Tools-specific Observability producer/source/route/readiness 和 Bus route/schema。
- Core Tools-specific shared schema/package authority。
- Future SDK tools-specific client seam。
- 有正式测量对象与 evidence authority 后才能量化的性能 / 可用性指标。

这些开放项不推翻仓职责和逻辑 seam,但阻塞后续具体 contract、schema、route、正向测试、验收或 implementation-ready 声明。

### 2.4 哪些需求直接影响架构边界

- `G-L2T-001~005` 与 `C-L2T-1~5` 决定本仓存在理由和主架构轴。
- `BR-L2T-001~042` 决定 identity、外部 truth、authorization、Sandbox、outcome 和 handoff 的边界红线。
- `FR-L2T-E01~E06` 决定派生能力必须外围化、只读化和可重建。
- `DB-L2T-001~008` 决定当前、pending 和 future 关系不能混画。

### 2.5 哪些需求直接影响数据所有权

- `DR-L2T-001~034` 要求区分 formal truth、消费时点 snapshot、reference、derived state 和 forbidden body。
- `BR-L2T-035~041` 要求本地 outcome/audit 先成立,外部交接失败不反写。
- `NFR-L2T-007/009/010/013/016` 要求正文安全、外部 truth 隔离、safe material 合取门禁与时点锚定。

### 2.6 哪些需求影响依赖方向或一致性策略

- `DB-L2T-001~007` 与 `VF-L2T-012` 固定 compile/runtime/event 分类。
- `DB-L2T-003` owner-pending 与 `DB-L2T-008` future/excluded 均不得升格为当前依赖。
- Hub、authorization、Sandbox 输入缺失或冲突时 fail closed;Bus / Observability 失败只形成 handoff degradation。
- Truth 内部要求语义一致;外部 snapshot/ref 依消费时点锚定;truth 到派生 / handoff 最终一致且不可反写。

---

## 3. 旧材料诊断

| 旧材料口径 | 诊断 | 当前处理 |
|---|---|---|
| Python monorepo / 与 Runtime 同进程 | 旧实现和部署假设,没有当前技术 authority。 | 标记 historical material;Step 6/10 不得默认继承。 |
| builtin 工具库、MCP Client/proxy、Role extras、member-images | 把产品库存、客户端适配和装配职责并入语义契约仓。 | 排除出当前核心与外围 truth。 |
| Tool Registry、本地 allowlist、字符串猜测 | 复制 Hub registry / exposure truth,并可能把 visibility 当 authorization。 | 废弃;只允许 controlled ref / safe summary。 |
| `in-process/sandbox/mcp` 三态 executor | 让 carrier/provider 分叉 canonical invocation,并预设执行形态。 | 废弃;后续按统一合同和条件 seam 推导。 |
| 固定 API/event/error code/SLA/P95/QPS | 越过架构层且缺 measurement / contract authority。 | 不继承,后续正式设计具备 authority 后再定。 |
| 旧 ADR-0005/ADR-0009 Accepted | 无当前 L2 正式 ADR 文件与评审链。 | Step 15 仅列决策候选,ADR 编号写“未建立”。 |
| 已审、已上线、回滚/监控结果 | 缺真实 run/evidence/signoff。 | 不作为当前事实。 |

旧材料没有推翻正式 00 的内容。所有方向若与当前基线一致,也必须从正式 00 重新推导,不能以旧文档完成状态作为证明。

---

## 4. 设计取舍

### 4.1 基线筛选取舍

- 不逐条复制 17 项核心 FR、42 项业务规则和 34 项数据要求;只提炼会改变架构合法性的 owner、闭环、依赖、数据和失败语义。
- 五节点是需求闭环,不是 Step 5 的预定上下文数量;限界上下文仍须在 Step 5 独立验证。
- Authorization、Sandbox、Observability、Core、SDK 缺口全部保留为条件风险,不因“不阻塞 01”而写成 resolved。
- 不把技术栈、部署形态、API、事件、DTO、指标或 evidence 混入需求基线。

### 4.2 来源效力取舍

- 当前正式 00 和其 Step 产物是架构直接权威输入。
- 上游正式链只按 current workspace input 引用,不声称 committed、released、approved 或 ready。
- 旧 README / 01 仅用于污染检查;不能与当前正式 00 等权。

---

## 5. 结构化中间产物

### 5.1 架构需求基线

| 基线 ID | 已稳定需求结论 | 直接来源 | 对后续架构的约束 |
|---|---|---|---|
| `ARB-L2T-001` | 本仓是 runtime 行动契约层中的工具调用语义契约真相仓。 | 正式 00 §2;`G-L2T-001` | 围绕 tool identity、definition、canonical invocation、normalized outcome 和 Tool-domain audit 组织,不能退化为 inventory 或 executor。 |
| `ARB-L2T-002` | `C-L2T-1~5` 是仓级完整性基线,条件路径不是固定外仓时序。 | 正式 00 §7;`VF-L2T-001` | 后续职责、数据、交互和横切必须逐节点承接,同时保留 unbound / governed / sandbox-required / no-execution 分支。 |
| `ARB-L2T-003` | 稳定 tool identity、formal definition 及显式演进属于本仓 truth。 | `FR-L2T-001~003`;`DR-L2T-001~003` | 显示名、实现、inventory、provider、capability identity 或 SDK wrapper 不得替代 truth。 |
| `ARB-L2T-004` | Capability-bound/unbound 分类和 body-free binding relation 属于 L2;另一端 truth 属于 Hub。 | `FR-L2T-004~006`;`DR-L2T-007~012` | 必须存在 controlled Hub consumption seam,不得复制 registry 或用 allowlist 猜测。 |
| `ARB-L2T-005` | Canonical invocation、合同锚定、受理 / 执行前拒绝和跨 carrier 单一语义属于 L2。 | `FR-L2T-007~009`;`DR-L2T-013~018` | Runtime 提交合同内语境并消费 outcome;planning / orchestration / recovery 不进入 L2。 |
| `ARB-L2T-006` | L2 拥有执行要求及 authorization 结果的来源可验证 / 消费前置判断,不拥有 decision truth。 | `FR-L2T-010~011`;`BR-L2T-023~025` | 正式结果缺失、冲突、stale 或不可验证时 fail closed,不得默认 provider。 |
| `ARB-L2T-007` | L2 拥有条件化承载要求和本地 handoff 语境;Sandbox 拥有 execution truth。 | `FR-L2T-012~013`;`BR-L2T-026~031` | Sandbox-required 不可旁路;不伪造 mapping、receipt、run、capture 或 cleanup。 |
| `ARB-L2T-008` | Normalized outcome、Tool-domain audit、安全交接准备 / 尝试 / 降级 / 缺口属于 L2。 | `FR-L2T-014~017`;`DR-L2T-027~034` | Local truth first;外部 delivery / observation 失败不回滚或改写本地终态。 |
| `ARB-L2T-009` | 数据必须区分 truth、snapshot、ref 与 forbidden body。 | 正式 00 §11;`AC-L2T-030~033` | Snapshot/ref 锚定消费时点;raw request/capture/provider body、secret、外部正文不得入仓或外发。 |
| `ARB-L2T-010` | 当前依赖为 Core compile;Hub/Sandbox/Runtime runtime;Bus/Observability event。 | 正式 00 §6/§12;`VF-L2T-012` | 只有 Core 可成为 package dependency;material handoff 不是第四类依赖。 |
| `ARB-L2T-011` | Authorization 为 owner-pending,SDK 为 future/excluded,二者都不是当前项目依赖。 | `DB-L2T-003/008`;正式 00 §15 | Authorization 只作条件边界,SDK 不进入当前主上下文。 |
| `ARB-L2T-012` | 搜索、diff、批量维护、派生索引、诊断和客户端说明是只读外围增强。 | `FR-L2T-E01~E06`;`BR-L2T-E01` | 可延迟、缺失或重建,不反写真相、不成为五节点成立前置。 |

### 5.2 架构硬约束

| 约束 ID | 架构硬约束 | 来源 |
|---|---|---|
| `HC-L2T-001` | Tool identity / definition 只能有一个本地正式 owner,不能由实现、库存、provider、capability 或 client wrapper 替代。 | `BR-L2T-001~008`;`VF-L2T-002` |
| `HC-L2T-002` | Hub truth 只经 controlled ref / safe summary 消费;本地只拥有 body-free relation。 | `BR-L2T-009~015`;`VF-L2T-003` |
| `HC-L2T-003` | Canonical invocation 与 result/error 语义不得因 caller 或 carrier 分叉。 | `BR-L2T-016~021/027`;`VF-L2T-004` |
| `HC-L2T-004` | L2 不拥有 action choice、agent loop、LLM planning、Runtime orchestration、retry/recovery/checkpoint。 | `BR-L2T-022`;`VF-L2T-010` |
| `HC-L2T-005` | 风险声明 / 执行要求不产生 authorization;正式结果不可验证时 fail closed。 | `BR-L2T-023~025`;`VF-L2T-005` |
| `HC-L2T-006` | Sandbox-required 不得绕过隔离;L2 不拥有或伪造 execution truth。 | `BR-L2T-026~031`;`VF-L2T-006` |
| `HC-L2T-007` | Capture、provider response、delivery、observation、Runtime checkpoint 不得替代 normalized outcome 或 ToolAuditEntry。 | `BR-L2T-030~035`;`VF-L2T-007` |
| `HC-L2T-008` | 本地 outcome / audit 先成立;外部 handoff/consumer 失败不得反写或触发 L2 承担 Runtime recovery。 | `BR-L2T-035/040~041`;`VF-L2T-009` |
| `HC-L2T-009` | Safe material 必须同时满足 minimal necessary、body-free、redacted、correlated;forbidden body 无例外。 | `BR-L2T-038~039`;`NFR-L2T-007/010` |
| `HC-L2T-010` | Snapshot/ref/source 锚定消费时点;后到变化形成新事实或缺口,不得原地改写既有 invocation/outcome。 | `NFR-L2T-013/016`;`VF-L2T-011` |
| `HC-L2T-011` | 只有 Core 可成为编译期依赖;runtime/event seam 不得落成 sibling path/package dependency。 | `DB-L2T-001~002/004~007`;`VF-L2T-012` |
| `HC-L2T-012` | Pending/future/open contract 不得写成已存在 schema、provider、route、receipt、client、readiness 或 evidence。 | `R-L2T-001~012`;`VF-L2T-013` |
| `HC-L2T-013` | 没有负载模型、测量对象与 evidence authority 时,不固定 P95/P99/QPS/SLA/百分比。 | `Q-L2T-008`;`R-L2T-011` |
| `HC-L2T-014` | 旧 Python monorepo、registry、builtin/MCP/extras、三态 executor、SLA、事件/错误/ADR/上线事实均只作 historical material。 | `R-L2T-008`;`VF-L2T-013` |

### 5.3 未关闭需求风险

| 风险 ID | 来源 / 状态 | 当前架构处理 | 后续阻塞点 |
|---|---|---|---|
| `AR-L2T-001` | `L2T-UP-001~002` | Authorization 只表达为 owner-pending 条件边界;governed path fail closed。 | Owner/source/taxonomy/consumption contract;02~05/07。 |
| `AR-L2T-002` | `L2T-UP-003` | 只固定 L2 semantic adapter responsibility 与 execution source-ref 边界,不定义 mapping。 | Sandbox 双向 mapping 与结果转换;02/03/05/06。 |
| `AR-L2T-003` | `L2T-UP-004` | 只记录 handoff context/attempt/gap,不命名 receipt、DLQ、feedback、cleanup release。 | 正向协议与 implementation boundary;02~07。 |
| `AR-L2T-004` | `L2T-UP-005~007` | Observability 保持 event collaboration;producer/source/route/readiness 和 immutable baseline 不声称成立。 | Route/config/test/evidence/readiness;01~07。 |
| `AR-L2T-005` | `L2T-UP-008` | Core compile 关系成立;Tools-specific schema/package authority 保持开放。 | Shared contract 定稿;01~03/05/07。 |
| `AR-L2T-006` | `L2T-UP-009` | SDK 保持 future/excluded;client 不反向定义服务端合同。 | SDK 独立设计 / 联调。 |
| `AR-L2T-007` | `R-L2T-010` | Forbidden body 保持无条件架构红线。 | 02~06 schema、交互、配置与测试。 |
| `AR-L2T-008` | `Q-L2T-008`;`R-L2T-011` | 只给结构性判断口径,不伪造量化值、run、evidence 或 signoff。 | 05~07 正式测量与证据。 |

### 5.4 基线覆盖检查

| 影响面 | 对应基线 / 约束 / 风险 | 结论 |
|---|---|---|
| 架构定位与职责 | `ARB-001~008/012`;`HC-001~009` | owner、核心闭环和外围边界完整。 |
| 系统上下文与依赖 | `ARB-004~011`;`HC-002/004~006/011~012`;`AR-001~006` | 当前、条件、开放和 future 关系可区分。 |
| 数据所有权与一致性 | `ARB-003~009`;`HC-001~010`;`AR-002~004/007` | truth/snapshot/ref/body、local-truth-first 与时点语义可推导。 |
| 交互与横切 | `ARB-005~012`;`HC-003~013`;`AR-001~008` | 可收敛同步/异步/后台和安全/韧性边界,不需提前定义协议。 |
| 需求追溯 | 全部 | 所有结论均可回指正式 00 的 G/C/FR/BR/DR/DB/NFR/R/Q/AC/VF。 |

---

## 6. 回填草稿

正式 01 第 1 章应声明正式 00 是直接需求基线,上游链只按 current workspace input 使用;第 3 章应承接 `HC-L2T-001~014`;第 16 章应把每项架构决定回链到 `ARB-L2T-001~012` 和正式 00。`AR-L2T-001~008` 必须在第 15 章保持开放,不得因逻辑架构完成而升级为 resolved。

---

## 7. 待确认事项

本步没有需要用户立即裁决才能进入 Step 2 的事项。`AR-L2T-001~008` 均为后续合同或 readiness 条件风险,不影响当前 owner、职责、依赖类型与数据红线成立。

---

## 8. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确需求基线 | pass | 已形成 12 项稳定架构基线。 |
| 是否明确架构硬约束 | pass | 已形成 14 项不可绕过的约束。 |
| 是否保留未关闭风险 | pass | 8 类风险完整承接 `L2T-UP-001~009`。 |
| 是否区分当前 / pending / future | pass | Authorization 与 SDK 未升格为当前依赖。 |
| 是否后置审计旧材料 | pass | 旧技术、库存、协议、SLA、ADR 与实施事实均未继承。 |
| 是否预支后续设计 | pass | 未定义上下文划分、容器、协议、字段、技术或实现。 |

```text
current_step = Step 1 requirement_baseline completed
gate_status = pass
gate_reason = stable requirement premises, hard constraints and open risks are explicit and sufficient for architecture goal derivation
next_allowed_action = create_and_complete_01_arch_step_02_goals_constraints
formal_document_write_allowed = false
commit_required = false
```
