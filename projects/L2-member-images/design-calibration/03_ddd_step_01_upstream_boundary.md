# L2-member-images 03 详细设计 Step 1：确认概要设计输入边界

> 创建日期：2026-08-25  
> 状态：`completed_pass`  
> 文档模式：`full-restart`  
> 回填位置：正式 `03-详细设计.md` 第 1 章与第 17 章（仅形成回填草稿，当前不得装配正式文档）  
> 当前授权：用户允许本轮严格串行执行至 Step 5；本 Step 完成后可进入 Step 2，仍不得读取旧正式 `03-详细设计.md`、装配正式 03、实现或提交。

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 直接输入 | 重建版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`，以及 `02_hld_step_12_detailed_design_handoff.md`、`02_hld_step_13_risks_open_questions.md`。 |
| 规范输入 | `详细设计讨论流程_SOP.md` Step 1、`详细设计书写规范.md` §5.1、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md` 与依赖裁剪规则。 |
| 本步目标 | 确定 03 可直接承接的稳定结论、必须继续展开的实现契约、不能重新定义的上游结论，以及仍限制详细设计深度的输入缺口。 |
| 本步禁止 | 不重写 00/01/02；不以目录、类型、DTO 或 adapter 选择改写概要主体；不读取旧正式 03；不把并行 sibling 的进行中内容写成已闭合合同。 |
| 历史材料纪律 | 旧 README、旧正式 00/01/02/03/05/06 继续是 `historical_material`。旧正式 03 只允许在 Step 19 的后置污染审计中打开，本 Step 未读取。 |

## 1. Step 内计划与模块级门禁

| 子阶段 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 输入盘点 | 直接基线和规范输入清单 | `done` | 已区分 authoritative baseline、owner input、sibling placeholder 与 historical material。 |
| SOP 问题回答 | §2 五项回答 | `done` | 每项都给出可承接边界或明确的回退 / 挂起条件。 |
| 诊断与取舍 | §3、§4 | `done` | 未将概要骨架误写为完整代码契约，未将 pending 升格为正向合同。 |
| 结构化收敛 | §5 关系映射、稳定性分层、风险表和清单 | `done` | 每项 03 输入都有继续展开位置或不进入本轮的理由。 |
| 回填与自检 | §6、§8 | `done` | 只形成草稿；正式 03 写入门禁仍为关闭。 |

| 模块 / 范围 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| `upstream_boundary` | done | done | done | done | done | done | `pass` | 进入 Step 2，明确本轮实现契约范围。 |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 1. 当前详细设计直接承接概要设计中的哪些结论？ | 承接五个业务主要组成部分（`DefinitionAssembly`、`BuildCandidate`、`Qualification`、`SupplyEntry`、`ReferenceDerived`）、其与 Inbound / Operations、Application、Domain、Ports、Persistence、Projection 的正交关系、关键对象骨架、Command / Query / conditional Event / Job 分类、主处理流、局部状态轴、异常口径和配置影响轮廓。承接不是复制正文，而是把这些骨架下沉为 planned crate/module/file、对象、函数、port、协议、状态、事务和错误契约。 |
| 2. 概要设计中的代码主体框架是否已经足够稳定？ | 足够支撑模块主轴和实现单元布局讨论：五个业务主体与六类实现层均已稳定，且明确“不机械映射为服务、数据库或部署单元”。它尚不等于现有实现仓或已选 crate 布局；03 必须把布局写成 `planned`，不能把目录推断成现状。 |
| 3. 关键对象、接口骨架、处理流和状态机是否足够继续展开？ | 本仓私有、产品中立、fail-closed 的对象和流程可继续展开。概要已区分 definition/baseline/revision、intent/attempt/snapshot/candidate、provenance/gate/eligibility、availability/entry、Artifact handoff、consumer handoff、projection freshness，足以约束详细设计的状态主体。外部 exact schema、产品协议、gate inventory、consumer confirmation 与 inbound event family 均不够，详细设计只能定义 neutral carrier、gap 或 blocked 语义。 |
| 4. 哪些内容仍停留在概要设计轮廓，进入详细设计前必须补清？ | 03 内必须补清 planned repository / crate / module / file 布局、私有类型的字段与构造、repository/UoW/port 边界、函数签名、协议 carrier、局部状态转换、错误、并发与幂等、配置引用、测试切口和实施交接。对外 exact contract 不能由 03 补清：它们继续受 `MI-UP-001~009`、`Q-MI-001~004` 限制。 |
| 5. 哪些需求或架构结论会影响详细设计，但不能在详细设计中重新定义？ | 00 的 owner、static/live、阶段性真相、fail-closed 与 VETO；01 的 BC/LS、向内依赖、六类 seam、数据 ownership 与 ADR；02 的五主体、对象主语、接口分类、状态主语与配置影响边界。若 03 发现这些主语必须改变，应按 02 §12.2 回退并重开相应概要 Step，而不是用新字段或目录静默改写。 |

## 3. 当前材料诊断

| 观察 | 若误用的后果 | 本 Step 处置 |
|---|---|---|
| 00~02 已收稳语义和概要骨架，但未给出 1:1 的文件、类型、函数和 schema | 实现者会从对象名称或旧材料猜字段、依赖和状态 | 将 03 定位为“从稳定骨架到实现契约”的下沉层；Step 2~17 分别收敛范围、布局、模块、对象、port、协议、流、状态及一致性。 |
| 五个业务主体与六层实现视图是正交关系 | 可能把每个主体误拆成一个服务或每层误拆成一个 crate | Step 4/5 必须先做布局和模块主轴决策，任何目录选择都不得改变 BC-MI-01~05 的 owner 边界。 |
| 02 的对象是字段 / 函数骨架而非完整 Rust 契约 | 可能把概要表格直接当作完整 struct 和 public schema | Step 6 才逐模块定义类型、字段来源、函数和状态；本 Step 不预写对象定义。 |
| sibling 项目仍在并行讨论 | 相互引用进行中文档会制造循环“已闭合”假象 | `L2-member` 与 `L2-member-service` 仅作为 owner / direction / pending placeholder；03 保留 `ComponentReleaseRef`、`InstantiableEntry`、`ConsumerHandoffGap` 等本仓私有语义，不补其 exact exchange schema。 |
| 旧正式 03 存在 | 旧固定角色、产品、接口或状态可能污染 full-restart | 本 Step 不读取旧正式 03；仅在 Step 19 且已完成新链条后进行差异 / 污染审计。 |

## 4. 设计取舍

| 方案 | 收益 | 风险 / 代价 | 结论 |
|---|---|---|---|
| A. 将 02 的全部对象与接口直接视为可实现 schema | 快速产生详细文档 | 把概要骨架、外部 pending 和产品选择误报为代码事实 | 不采用。 |
| B. 以 00~02 的稳定主语为边界，先收稳模块与私有实现契约；对外未闭合边只定义 neutral / fail-closed seam | 可继续推进本仓可控部分，同时保留 owner 边界 | 详细设计需要显式记录较多 gap 与 blocker | 采用。 |
| C. 因 external exact contract 未闭合而整体停止 03 | 不会误写外部 DTO | 会阻断本仓已有的 private type、history、guard、projection 和 fail-closed 设计 | 不采用；只阻断受影响 positive lane。 |

取舍结论：03 的合法下沉面是本仓拥有 truth 的实现契约，以及受 external uncertainty 约束的 typed ref、safe conclusion、blocked / unavailable / gap 与重开点。任何新目录、类型或函数若改变五主体、阶段分层、owner 或依赖分类，均属于概要回退，而非详细设计自由度。

## 5. 结构化中间产物

### 5.1 上游关系映射表

| 来源文档 / 输入 | 已收稳的承接内容 | 03 继续展开什么 | 不得在 03 重答 / 改写什么 |
|---|---|---|---|
| `00-需求文档.md` | C-MI-1~5、F/BR/D/IF/DEP/NFR/AC/VETO、owner 与 static/live 边界、`MI-UP` / `Q-MI` 上限 | 用实现模块、类型、函数、错误和测试切口承接可控能力；把规则落实为 invariant / guard / fail-closed 分支 | 需求目标、用户故事、验收结果、外部 owner truth、ready / release 事实。 |
| `01-架构设计.md` | `BC-MI-01~05`、`LS-MI-01~04`、向内依赖、六类 seam、数据 ownership / consistency、ADR-0005 | planned layout、模块依赖、port 方向、UoW / projection / adapter 边界 | 系统上下文、部署拓扑、子域归属、技术产品和跨仓 compile 权限。 |
| `02-概要设计.md` | 五主体、正交实现层、对象 / 接口 / 流 / 状态 / 异常 / 配置轮廓 | 文件、对象、trait、protocol、flow、state matrix、persistence / concurrency / error / config / observability / test seam | 更换主体、压并阶段状态、把 BC / LS 机械映射为服务或数据存储。 |
| `02_hld_step_12_detailed_design_handoff.md` | 对象组、流程组和下沉顺序 | 将 handoff 列表逐项映射到 Step 4~17；发现主语变化时触发 02 回退 | 用 handoff 表虚构 external schema、产品或实施结果。 |
| `02_hld_step_13_risks_open_questions.md` | `R-HLD-MI-001~008` 与所有 `MI-UP` / `Q-MI` 的推进上限 | 将风险下沉为具体 module / port / error / state 的 fail-closed 约束 | 消除外部 blocker，或把 conditional / future 写成 current capability。 |
| 正式 owner 文档与台账 | 已正式闭口的 owner、ref 与边界 | 仅消费其已确认的方向；需要时记录 ref / adapter / gap carrier | 复制外部 body、mint external ref、引用 sibling 进行中内容作为合同。 |
| Rust、目录组织与真相源规范 | 代码形态、注释、命名、模块组织、闭环和三层台账纪律 | 约束 Step 3~19 的实施契约书写方式 | 用规范替上游 owner 填补业务 / 外部 schema 缺口。 |

### 5.2 Stable / pending / blocked 输入分层

| 分层 | 输入 | 03 可做 | 03 不可做 |
|---|---|---|---|
| stable | 本仓 owner 边界、五业务主体、阶段性 truth、fail-closed、projection read-only、依赖分类与 ADR 方向 | 定义本仓 private object、guard、history、module、port、flow、状态和错误契约 | 改变 owner 或将 staged decisions 合并为 ready。 |
| stable with implementation work | 概要对象 / 接口 / 流 / 状态骨架 | 下沉为 planned file、完整类型 / 函数 / transaction / test seam | 把摘要名称机械复制为 public external schema。 |
| pending owner input | `MI-UP-001~007` | 定义 typed ref、contract status、safe conclusion、blocked / unavailable / gap、fake parity 与 reopen condition | exact DTO、route、topic、external ref mint、compatibility / confirmation / handoff success。 |
| future / absent authority | `MI-UP-008~009` | 记录 current absence、future trigger 和重开 Step | active hardened-base structure、outbound event handler、delivery state 或 current acceptance。 |
| conditional decision | `Q-MI-001~004` | product-neutral / authority-driven abstraction和明确的 feature gate 边界 | restricted / multi-arch 当前模型、具体 backend、gate inventory / priority、正向 evidence。 |
| historical material | 旧 README、旧正式 03 等 | Step 19 进行污染审计 | 作为当前详细设计 authority 或默认实现来源。 |

### 5.3 本文不再回答

- 需求目标、用户故事、验收标准、排期、实施阶段、commit、运行 / 测试 / 发布事实。
- 系统上下文、限界上下文、部署拓扑、业务主体 owner、全局依赖裁剪和 ADR 取舍。
- RoleDefinition、Role mapping body、member 主体、runtime loop、tool execution、capability registry、Artifact / governance / Sandbox / observability truth。
- live memory、checkpoint、workspace live content、secret、container lifecycle、consumer health、外部产品配置和 marketplace / 产品入口。
- 外部 exact manifest、variant、release、event、gate、evidence、Artifact handoff、consumer confirmation 的正向 schema 或成功语义。

### 5.4 本文必须回答

- planned implementation repository 的布局形态、crate / module / file 归属与命名边界。
- 每个模块的 capability、对象、trait、handler、repository、projection 与错误归属。
- 本仓 private / neutral 的字段、构造、函数、协议 carrier、状态迁移、事务、一致性、并发、幂等和恢复契约。
- 外部 ref / adapter / event / fake seam 如何 fail closed，如何持久化 gap，如何在 owner 合同关闭后重开。
- 配置引用、可观测性安全分类、测试切口与实施交接如何能回指 00~02 而不伪造运行证据。

### 5.5 输入不足风险清单

| 风险 / 缺口 | 影响的 03 区域 | 当前控制 | 若需要正向细节时的动作 |
|---|---|---|---|
| `MI-UP-001` consumer exact entry / confirmation | `MemberServiceSupplyPort`、entry protocol、consumer reconciliation | 只设计 immutable entry / unavailable / contract-gap carrier | 等双方正式校准；重开相应 port / protocol / flow / state Step。 |
| `MI-UP-002` member release shape | component ref adapter、baseline completeness | release ref 可作为 opaque typed ref；缺失即 baseline blocked | 等 member owner 闭口；不猜字段或 compatibility 结果。 |
| `MI-UP-003` mapping query / snapshot surface | definition intake、mapping validator | 只设计 owner-neutral source status 与 ref carrier | 等 Method Library 合同；不复制 mapping body。 |
| `MI-UP-004` Core image-specific shared contract | compile carrier 与 public shared type | 仅以正式已认定的 Core contract 为 compile 候选 | 未认定时保持本仓私有类型，不 shadow。 |
| `MI-UP-005` inbound build event schema | event adapter、event-to-intent handler | 夜间 / local request 主线可被设计；event lane unavailable | 等 event authority；不虚构 topic / payload。 |
| `MI-UP-006` seed owner / template / placement | baseline、placement validator | owner-neutral template ref、static placement、gap | 等 owner contract；不将 template body 或 live state写入。 |
| `MI-UP-007` Artifact handoff / consumable ref | qualification、handoff record、supply linkage | record / gap 分层，image eligibility 独立 | 等 Artifact owner 合同；不 mint Artifact truth。 |
| `MI-UP-008~009` hardened base / outbound event | future extension / notification | current absence 显式化 | 获 authority 后回到接口、流和状态 Step。 |
| `Q-MI-001~004` scope / backend / evidence | variant dimension、adapter config、gate evaluation | product-neutral、authority-driven、fail-closed | 正式决策后重开 affected modules，不提前产品绑定。 |
| 实现仓不存在 | Step 4 的实际目录、Cargo path 和 package 事实 | 所有布局标记为 planned；不得声称现有文件 | 创建 implementation repo 需后续实施授权，且不在本轮发生。 |

### 5.6 03 不变项检查表

| 不变项 | 03 的实现级含义 |
|---|---|
| Owner 不转移 | 每个 external value 只能以 ref / snapshot / safe conclusion / gap 进入，语义 body 和 live state 不成为本仓字段。 |
| staged decisions | candidate、eligibility、availability、Artifact handoff、consumer / container 状态各有类型、history 和状态语义，不共享“ready”替代名。 |
| fail-closed | missing、stale、conflict、failed、unknown、unavailable、gap 具有明确 carrier / error / state；不可通过 default、cache、latest 或 ACK 变正向。 |
| append / supersede | revision、attempt、evaluation、transition、projection rebuild 等恢复生成新语境，不覆盖历史记录。 |
| projection read-only | projection / manifest view / cache / fake 不能成为 domain write source；只从 truth 重建并带 freshness。 |
| dependency classification | 仅正式 L0-core 是条件 compile authority；runtime / event / ref / adapter / fake 不进入 Cargo path 假设。 |

## 6. 正式文档回填草稿（暂不写入）

### 6.1 第 1 章《与上游文档的关系声明》草稿

正式 03 应以 §5.1 的“上游关系映射表”为主体，并在正文列出 §5.3 与 §5.4 的精炼版：详细设计不重答需求、架构、概要主体及 external owner truth；它必须把已收稳骨架展开为 planned file / module、对象、函数、协议、状态和一致性契约。正文须明确所有 `MI-UP-001~009` 与 `Q-MI-001~004` 仍限制正向 external lane，不得把并行 sibling 材料作为已闭合合同。

### 6.2 第 17 章《风险与待确认事项》承接草稿

正式 03 后续应继承 §5.5 的缺口，但只能在 Step 18 结合详细设计中实际形成的 module / port / protocol 影响面后收口。当前不把风险表提前装配为正式结论，也不增加任何 external success claim。

## 7. 待确认事项

- `MI-UP-001~009`、`Q-MI-001~004` 保持原编号、owner 和推进上限；本 Step 不关闭任何一项。
- 是否存在已获正式认定、且适用于 image-specific contract 的 L0-core crate / package，仍由 `MI-UP-004` 限制；Step 3/4 只能写条件型检查，不可假定 path。
- implementation repository `/home/aris/Projects/quantalithos-member-images` 当前不存在；Step 4 只能给出 planned layout，不能写存在性或可编译事实。

## 8. 完成审计与下一步门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 已明确直接承接的上游结论 | `pass` | 00、01、02 和 02 handoff / risk 的角色均明确。 |
| 已区分稳定、pending、future 与历史材料 | `pass` | 进行中 sibling 和旧正式 03 均未升格为 authority。 |
| 已列出本文不再回答 / 必须回答 | `pass` | 覆盖需求、架构、owner、实现契约和下游边界。 |
| 已识别详细设计输入缺口及影响 | `pass` | `MI-UP-001~009`、`Q-MI-001~004` 与实现仓缺失均有保守动作。 |
| 未重写概要或提前定义对象 / 协议 | `pass` | 本文件只确认输入和推进上限。 |
| 未读取旧正式 03、未写正式 03、未实施或提交 | `pass` | full-restart 和用户授权边界保持。 |

```text
step_status = completed
gate_status = pass
gate_reason = upstream_boundary_and_ddd_expansion_limits_are_explicit
next_allowed_action = create_and_complete_step_02_scope
formal_03_write_allowed = false
old_formal_03_read_allowed = false
implementation_allowed = false
commit_required = false
```
