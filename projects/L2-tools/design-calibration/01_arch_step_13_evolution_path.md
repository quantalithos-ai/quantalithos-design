# L2-tools 01 架构设计 Step 13: 演进路线

> 创建日期: 2026-08-04
> 状态: completed
> 当前模式: full-restart
> 执行模式: single_agent_serial
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 13
> 正式文档回填位置: `01-架构设计.md` 第 14 章

---

## 1. 本步输入与目标

### 1.1 本步目标

说明 L2 工具行动契约架构当前做到哪里即可成立、哪些结构债务当前可接受、哪些后续能力真正属于主线演进,以及哪些事实会迫使结构进入下一阶段。阶段只表达架构成立与演进的结构状态,不表达版本、日期、排期、任务拆单、实现进度或 readiness。

### 1.2 输入与读取结论

| 输入 | 读取结论 | 本步约束 |
|---|---|---|
| Step 2 | 独立工具语义 truth center、八项目标、八项当前取舍和六项非目标已明确。 | 当前阶段必须先让 owner、边界和主线成立;非目标不得包装为未来阶段。 |
| Step 5~9 | 五核心语境、三支撑语境、六影子边界、三运行角色、三状态承载、四类数据和三类通信已停审。 | 演进只能在这些结构上增强或按证据拆分,不得回退到旧 registry/executor。 |
| Step 10~11 | 十一项机制和分层主线已采用;独立部署与 live-only resolution 未采用。 | 当前允许逻辑可分、物理同部署;独立部署只能由真实证据触发。 |
| Step 12 | 六类横切约束长期有效;正确性、fail-closed、正式重入、local-truth-first 优先。 | 任何阶段都不得用性能、恢复或配置绕过横切红线。 |
| 正式 00 §9/§13/§15 | `FR-L2T-001~017` 为核心,`FR-L2T-E01~E06` 为外围;`R/Q` 和 `L2T-UP-001~009` 保持开放。 | 外围不是当前核心前置;开放 seam 可作为逻辑债务,但阻塞受影响正向合同 / readiness。 |
| 架构 SOP Step 13 / 书写规范 4.14 | 必须使用固定六列表并说明当前边界、债务、后续项和触发条件。 | 不写 TODO、愿望池或项目计划。 |
| 已完成项目 Step 13 | 采用“当前成立条件 + 债务判定 + 演进路线 + 触发条件 + 历史差异”粒度。 | 只参考组织方式,不复制其他仓演进结论。 |

### 1.3 Step 内计划

| 模块 | 状态 | 产物 | 门禁 |
|---|---|---|---|
| 恢复与标准读取 | done | §1 输入结论 | 当前只允许 Step 13。 |
| 当前阶段先思考 | done | §2 问题回答、§3.1 | 区分逻辑成立与 implementation-ready。 |
| 当前阶段再写入 | done | §4.1~4.3 | 当前成立条件和债务理由明确。 |
| 后续阶段先思考 | done | §3.2~3.4 | 只保留主线内结构演进。 |
| 后续阶段再写入 | done | §4.4~4.5 | 固定六列表和触发表完整。 |
| 边界外与历史审计 | done | §4.6、§5 | 已排除事项不回流。 |
| 回填与门禁 | done | §6~8 | 不新增 blocker 或 readiness 事实。 |

---

## 2. SOP 问题回答

### 2.1 当前阶段做到哪里才算足够

当前阶段只要求“逻辑架构主线成立”,不要求所有上游正向合同、物理部署、量化目标和外围能力同时 ready。最低成立边界是:工具行动语义由 L2 独立拥有;`A1~A5` 的写权与失败边界清楚;`S1~S3/P1~P6` 不反写;`R1/R2/R3` 和 `T1/T2/D1` 逻辑可分;Core compile、Hub/Sandbox/Runtime runtime、Bus/Observability event 方向不串线;canonical invocation/result/error、fail-closed、消费时点和 local-truth-first 成立。开放 seam 必须以 pending、gap、blocked 或 future/excluded 表达,不能靠旧材料补齐。

### 2.2 第一批必须守住哪些结构

第一批必须守住稳定 tool identity / definition、body-free binding、canonical invocation / admission、authorization 消费与 Sandbox handoff 分权、normalized outcome / Tool-domain audit / safe handoff 分层、四类数据、三类通信和正式重入。任何一个被删减,都会让 Runtime、Hub、authorization、Sandbox、Bus 或 Observability 重新拥有部分工具合同,因此不是可接受的“先简化”。

### 2.3 哪些能力或约束留到后续阶段

后续首先闭合 Core shared contract authority、authorization 正式结果消费、Sandbox invocation/source/outcome mapping 与 receipt/feedback seam、Bus/Observability 安全材料 route,使受影响的正向协议可落码。之后才依据真实负载、隔离、故障和重建证据决定 `R1/R2/R3`、`T1/T2/D1` 是否物理拆分,并基于正式测量对象量化 NFR。搜索、diff、批量维护、派生索引、诊断摘要、客户端说明和管理入口只在核心稳定且有真实消费需求时增强,始终不得成为核心前置。

### 2.4 哪些债务可接受,哪些不可接受

具体 schema / mapping / carrier / receipt / route / client / metric 未闭口,以及三类运行角色暂时同部署,都可在架构层作为显式债务接受,因为 owner、失败口径和未来闭口位置已明确。Self-authorization、Sandbox 旁路、raw body 入仓、外部状态反写 outcome、sibling compile dependency、单一大上下文吞并不变量、caller/carrier 私有合同和派生写 truth 均不可接受,因为它们直接破坏当前主线而非留下可控缺口。

### 2.5 哪些条件会迫使架构调整

正式 owner 发布可消费合同会触发相应 P 单元和 runtime/event seam 从 gap 进入正向合同闭口;真实测量证明同步、异步、后台或状态承载之间存在持续负载 / 隔离 / 故障耦合时,触发物理拆分;正式负载模型和 evidence authority 成立时,触发量化性能与可用性约束;核心稳定后出现可重复的维护 / 诊断 / 消费需求时,触发外围增强。任何触发都必须有正式来源或真实证据,不能由“未来也许需要”启动。

### 2.6 演进时最先改变什么结构面

接缝闭口阶段最先改变 `P1/P3/P4/P6` 的正式 authority / source / mapping / status 承载和相应 runtime/event 合同,而不是改变 `A1~A5` owner。规模阶段最先改变 `R1/R2/R3` 与 `T1/T2/D1` 的物理隔离和故障边界,语义边界保持不变。外围阶段最先扩展 `S2/S3/D1` 的只读 / 派生消费面,不得扩展核心写权。

---

## 3. 诊断与设计取舍

### 3.1 架构完成与集成 ready 分离

`L2T-UP-001~009` 不阻止在 01 中确认 owner、逻辑 seam、失败语义和演进方向,所以不阻塞逻辑架构完成。但它们阻塞 authorization、Sandbox、Observability、Core 或 SDK 相关的具体 schema、mapping、route、client、测试与 implementation-ready 声明。若把“存在逻辑边界”写成“集成已可执行”,演进路线就会伪造当前阶段。

### 3.2 阶段不按时间或版本组织

阶段按触发事实组织,可能并行或部分适用:某个 Core shared contract 可先闭口,而 Observability route 仍保持 gap;某类派生需求可以出现,但不因此要求拆分 R1/R2/R3。主表表达结构进入条件和不可逆红线,不表达实现顺序或交付批次。

### 3.3 当前分层的演进稳定点

`A1~A5/S1~S3/P1~P6` 是语义稳定点,`R1/R2/R3/T1/T2/D1` 是可演进承载点。未来可以改变部署组合、载体和消费效率,但不能改变 tool identity、binding、invocation、precondition、outcome 的 owner 顺序,也不能让 P/S 单元获得核心写权。这一分层让架构可以在不重写业务语义的前提下按证据扩展。

### 3.4 外围增强的取舍

外围能力属于本仓可选消费面,但不是“下一阶段必做”。只有真实维护、诊断或下游理解成本持续存在,且核心 truth 已稳定提供受控读取时,才进入相应增强;否则保持缺失也是合法架构状态。SDK client、marketplace listing、Agent UI 等外部本体仍不属于外围增强,只能由其 owner 消费 L2 正式边界。

---

## 4. 结构化中间产物

### 4.1 当前阶段成立条件

| 必须成立的结构 | 当前判断口径 |
|---|---|
| 独立工具行动语义 truth center | `A1~A5` 分别拥有 identity/definition、binding、invocation/admission、precondition/handoff、outcome/audit/safe-handoff 本地 truth。 |
| 核心、支撑与影子写权分离 | `S1` 通过 `A1` 同一不变量收口;`S2/S3/P1~P6` 不创建或修正核心 / 外部 truth。 |
| 正式依赖方向成立 | 仅 Core 为 compile authority;Hub/Sandbox/Runtime 为 runtime seam;Bus/Observability 为 event collaboration;pending/future 不升格。 |
| 数据与时点边界成立 | Truth、snapshot、ref、forbidden body 分层;外部变化和迟到材料只形成新事实 / snapshot / ref / gap。 |
| 调用与终态语义成立 | Canonical invocation/result/error 跨 caller/carrier 一致;真实执行前同步 admission / 前置收口;capture 不冒充 outcome。 |
| 本地事实与外部协作分层 | A4 execution handoff attempt 与 A5 post-outcome submission attempt 分离;delivery/observation 不回滚本地 truth。 |
| 三类通信与运行承载可分 | 同步裁定、异步送达 / 传播、后台派生逻辑分离;`R1/R2/R3` 和 `T1/T2/D1` 可同部署但不混权。 |
| 横切红线长期有效 | Owner、forbidden body、fail-closed、正式重入、正确性优先和行为性变更控制无配置或性能例外。 |

### 4.2 当前可接受债务

| 债务 | 当前可接受原因 | 当前约束 | 后续触发位置 |
|---|---|---|---|
| Core Tools-specific schema / package authority 未闭口 | Compile 方向和共享类别边界已明确,具体合同缺失不改变 L2 owner。 | 不在 L2 复制共享类型,保持 `P1` authority gap。 | Core 正式发布 Tools 适用 shared contract 时闭口。 |
| Authorization owner/source/taxonomy/result seam 未闭口 | L2 执行要求与正式 decision owner 已分权。 | `P3` 不伪 snapshot/ref;governed 路径来源不可验证即 fail closed。 | 正式 owner 和可消费结果合同成立时闭口。 |
| Sandbox mapping/receipt/feedback/cleanup 未闭口 | L2 adapter responsibility、handoff attempt 与 execution truth 已分层。 | 不声明 accepted/run/receipt;positive execution / outcome path 保持 blocked。 | Sandbox 与 L2 正式 mapping/source/receipt contract 成立时闭口。 |
| Observability producer/source/route/readiness 未闭口 | Event collaboration 与 local-truth-first 已明确。 | 只表达 safe material、本地 attempt/degradation/gap;不声明 observed。 | 正式 producer/source/route 及可引用 readiness 成立时闭口。 |
| SDK tools-specific client seam 未闭口 | 服务端工具合同可独立成立,SDK 为下游 owner。 | `DB-L2T-008` 保持 future/excluded,不进入当前依赖。 | SDK owner 提出正式消费合同需求时另行闭口。 |
| 语言、协议、存储、进程和物理部署未选择 | 它们是已定语义和依赖边界的实现载体。 | 后续选择不得改变 owner、写权、依赖类型和失败语义。 | `02~04/07` 在正式边界内细化。 |
| `R1/R2/R3` 与 `T1/T2/D1` 可同部署 / 共载 | 逻辑职责、写权和故障语义已经可分,当前无拆分证据。 | 物理共载不得形成共享 owner 或跨类别静默写入。 | 真实负载、隔离、故障或重建压力达到触发条件时拆分。 |
| NFR 仅有非量化判断口径 | 当前无正式负载模型、测量对象或 evidence authority。 | 不继承历史 SLA / 百分比;正确性与边界优先。 | 测量对象、基线和 evidence authority 成立时量化。 |
| `FR-L2T-E01~E06` 外围增强未进入主线 | 核心闭环不依赖搜索、批量、索引、诊断、客户端说明或管理入口。 | 只能只读 / 派生消费,缺失或降级不阻塞核心。 | 核心稳定且出现可重复真实消费需求时增强。 |

### 4.3 不可接受债务

| 不可接受债务 | 为什么不能后移 |
|---|---|
| Tool identity/definition、binding、invocation、precondition、outcome owner 未分清 | 会让相邻系统直接形成第二工具合同,主线本身不成立。 |
| Local registry / inventory / allowlist 或 caller/carrier 私有合同 | 会复制 Hub / authorization truth或分叉 canonical semantics。 |
| Governed unknown 默认 allow 或 sandbox-required fallback | 会在真实执行前破坏安全与隔离红线。 |
| Raw caller / capture / provider / secret / evidence body 入仓或外发 | 会直接破坏 forbidden-body 和 owner 生命周期。 |
| Capture/receipt/delivery/observation 反写 normalized outcome/audit | 会合并 execution、delivery、observation 与工具终态 owner。 |
| `S2/S3/P1~P6` 自动修正核心 truth | 会建立不可追溯的第二写源并破坏正式重入。 |
| 非 Core sibling compile dependency 或 material handoff 第四依赖类型 | 会破坏全局依赖裁剪和跨仓平权。 |
| 用旧 schema/event/error/SLA 或虚构 readiness 填补开放 seam | 会把 historical material 和未验证事实伪装为当前 authority。 |

### 4.4 演进路线表

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前逻辑主线成立阶段 | 固定独立 truth center、五核心语境、支撑 / 影子写权、三类承载 / 通信、四类数据及横切红线;开放 seam 保守可解释。 | 正向 schema/mapping/route/client、物理部署和量化目标未闭口;外围增强可缺失。 | 闭合影响正向实现的 authority、source、mapping 和 carrier contract。 | 某条正向核心路径准备进入 `02/03/05/07` 可落码 / 可验证设计,且对应正式 owner 输入可用。 | 当前阶段完成表示逻辑架构可审查,不表示集成 ready 或实现完成。 |
| 正向合同接缝闭口阶段 | 让 Core、authorization、Sandbox、Bus/Observability 的适用边界具备正式可消费合同,同时保持 owner 与失败语义。 | 未必量化容量;运行角色仍可同部署;非必需外围仍可缺失。 | 将 `P1/P3/P4/P6` 从 gap / pending 承接为有正式 authority、source、消费时点和 mapping 的边界;完善正向验证口径。 | 正式 owner 发布可引用合同,且来源、mapping、receipt/route 和失败语义可被双方设计共同追溯。 | 每条 seam 可独立闭口;部分闭口不能推定其余 seam ready。 |
| 证据驱动的运行承载演进阶段 | 在语义边界不变的前提下调整同步、异步、后台和状态承载的物理隔离、伸缩与故障域。 | 仍可不实现低价值外围;物理拆分只覆盖有证据的压力点。 | 按需要拆分 `R1/R2/R3` 或 `T1/T2/D1`,强化受控重建和故障隔离,量化适用 NFR。 | 正式负载 / 延迟 / 故障 / 重建证据显示当前共载持续破坏主链、隔离或恢复口径,或 evidence authority 要求可验证目标。 | 不因“微服务化”偏好拆分 `A1~A5`;先改变承载,不改变语义 owner。 |
| 需求驱动的外围消费增强阶段 | 在核心 truth 稳定的前提下增强搜索、diff、批量辅助、派生索引、诊断摘要、客户端说明或管理入口。 | 未被真实需求触发的增强继续缺失;SDK client / marketplace 本体仍在外部。 | 扩展 `S2/S3/D1` 的可重建只读 / 派生消费面和正式维护辅助入口。 | 出现可重复维护、调查或消费成本,有明确消费者和边界,且增强失败不阻塞 / 反写核心。 | 这不是固定终局阶段;各增强按独立事实触发,不能自然膨胀为平台职责。 |

### 4.5 触发条件小表

| 触发事实 | 最先变化的结构面 | 保持不变的红线 |
|---|---|---|
| Core Tools shared authority 正式成立 | `P1` authority ref 与 compile contract 细化 | Core 是唯一 compile authority;L2 不复制共享合同。 |
| Authorization owner/source/result contract 正式成立 | `P3` 与 `A4` 消费时点 / fail-closed 合同细化 | L2 不生成 effective decision。 |
| Sandbox mapping/source/receipt seam 正式成立 | `P4`、A4 handoff 与 A5 outcome source 适配细化 | Handoff attempt != accepted/run;capture != outcome。 |
| Bus/Observability producer/source/route 可引用 | `P6` 和 event collaboration 正向承接细化 | Local truth first;delivery != observed != outcome。 |
| 稳定负载或故障证据显示共载不可接受 | `R1/R2/R3`、`T1/T2/D1` 物理隔离 | `A1~A5` owner、三类通信和正式重入不变。 |
| 正式测量对象、基线和 evidence authority 成立 | 性能 / 可用性判断口径升级为量化候选 | 不伪造通过结果、run、evidence alias 或签署。 |
| 核心稳定且真实维护 / 诊断 / 消费需求重复出现 | `S2/S3/D1` 和受控入口增强 | 派生不反写;外围不成为核心前置。 |

### 4.6 不属于演进路线的边界外事项

| 事项 | 裁决 |
|---|---|
| Agent loop、LLM planning、action choice、Runtime retry/recovery/checkpoint | 永久保持 `L2-runtime` owner,不是 L2-tools 后续阶段。 |
| Capability/provider registry、descriptor/exposure/applicability truth | 永久保持 Hub / 外部 owner,L2 只消费正式 ref/safe summary。 |
| Effective authorization、approval、policy、taxonomy truth | 永久保持正式 authorization owner,L2 只消费结果。 |
| Sandbox environment/run/capture/cleanup/recovery truth | 永久保持 `L4-sandbox` owner。 |
| Bus delivery/retry/DLQ/replay 与 Observability store/projection/retention | 永久保持 `L0-bus` / `L4-observability` owner。 |
| SDK client、多语言 wrapper、marketplace listing、具体 builtin/MCP inventory | 永久保持下游客户端、市场、适配或产品库存 owner。 |
| 外部正文、secret、raw payload、evidence/signoff | 不因任何阶段进入 L2 truth 或审计正文。 |

---

## 5. Historical material 差异审计

| 旧演进表达 | 当前裁决 |
|---|---|
| 从本地 Python package / monorepo 演进成每类工具独立服务 | `historical_conflict`:按旧库存 / carrier 拆分,不是当前语义或证据触发演进。 |
| 扩展 builtin、MCP Client、Role extras、member-images 覆盖 | `historical_material`:产品库存和装配不属于 L2 工具合同主线。 |
| 增加本地 registry、provider discovery、allowlist 和 policy cache | `historical_conflict`:复制 Hub / authorization truth。 |
| 以固定 event、error、replay、P95/P99 或可用率定义阶段成熟度 | `historical_material`:无当前 contract、测量对象和 evidence authority。 |
| 将 Bus / Observability 反馈接入 Runtime recovery | `historical_conflict`:外部状态不能驱动 L2 编排或反写本地终态。 |
| 全面微服务拆分作为自然终局 | 不采用:只有真实隔离、负载、故障或重建证据才能触发承载拆分。 |

---

## 6. 回填草稿

正式 01 第 14 章使用 §4.4 固定六列演进路线表、§4.5 触发条件小表和以下阶段边界说明:

当前阶段不是“所有接缝和增强都完成”才成立,而是先让独立工具行动语义、写权、依赖、数据、交互和横切红线形成可审查主线。开放合同、物理共载和非量化口径之所以暂时可接受,是因为其 owner、保守失败语义和触发式闭口位置已经明确,但它们仍阻塞受影响的 implementation-ready 声明。后续变化由正式合同、真实负载 / 故障证据或可重复消费需求触发,先改变影子接缝、运行承载或派生消费面,不改变核心 owner。边界外职责不会因“未来演进”进入本仓。

---

## 7. 待确认事项

本步无新增 blocker。`L2T-UP-001~009` 被明确放入正向合同接缝闭口的触发条件,但状态仍为开放;演进路线没有给出 owner、schema、mapping、receipt、route、client、metric 或 readiness 结论。Step 14 必须继续把这些事项按正式风险与待确认问题分开承接。

---

## 8. 自检与门禁

| 检查项 | 结果 |
|---|---|
| 是否明确当前逻辑架构最低成立边界 | pass |
| 是否区分架构完成与正向集成 ready | pass |
| 每项可接受债务是否说明理由和约束 | pass |
| 是否列出不可后移的结构债务 | pass |
| 固定六列演进路线表是否完整 | pass |
| 触发条件是否为正式来源或真实证据 | pass |
| 是否说明最先变化的结构面与不变红线 | pass |
| 是否避免排期、版本、任务、愿望池和边界外扩张 | pass |
| 是否保留全部开放 blocker 且未伪造 readiness | pass |

```text
current_step = Step 13 evolution_path completed
gate_status = pass
gate_reason = current logical architecture boundary, acceptable and unacceptable debt, four structural evolution stages and evidence-based triggers are explicit without schedule, implementation or readiness claims
next_allowed_action = create_and_complete_01_arch_step_14_risks_open_questions
formal_document_write_allowed = false
commit_required = false
```
