# L2-tools 01 架构设计 Step 16: 正式文档装配

> 创建日期: 2026-08-04
> 状态: completed_stop_review
> 当前模式: full-restart
> 当前阶段: formal_document_assembly:pre_write_pass
> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 16
> 正式文档目标: `projects/L2-tools/01-架构设计.md`
> 本 Step 口径: 只重组 Step 1~15 已停审结论,不新增架构判断;旧正式 01 仅作 historical material 和污染审计输入。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 已读取项目级台账 | yes:`design-calibration/project_execution_ledger.md` 已允许进入 Step 16 写前装配。 |
| 已读取文档级 flow | yes:`design-calibration/01_architecture_calibration_flow.md` 已确认 Step 1~15 完成。 |
| 已读取通用标准 | yes:`设计文档编写通则.md`;`设计文档讨论中间产物规范.md`;`设计真相源闭环与可落码性标准.md`;`全局项目依赖关系与裁剪规则.md`。 |
| 已读取专项标准 | yes:`架构设计讨论流程_SOP.md` Step 16;`架构设计书写规范.md` 固定 18 章、图表、来源块和评审清单。 |
| 已读取前序输入 | yes:`01_arch_step_01_requirement_baseline.md`~`01_arch_step_15_adr_traceability.md`;正式 `00-需求文档.md`。 |
| 已读取旧正式文档 | yes:旧 `projects/L2-tools/01-架构设计.md` 共 640 行,仅作 historical material。 |
| 已读取参考粒度 | yes:`L1-governance`、`L1-artifact`、`L3-method-library`、`L3-capability-hub` Step 16 与正式 01;只参考装配粒度。 |
| 执行方式 | single_agent_serial;用户明确要求不使用多 agent。 |

---

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status | next_allowed_action |
|---|---|---|---|---|
| 必读文档读取 | done | §0、§2 读取结论 | pass | 建立正式章节骨架。 |
| 正式章节骨架 | done | §6.1 章节装配映射 | pass | 统一术语。 |
| 术语统一 | done | §6.2 术语统一表 | pass | 建立交叉引用。 |
| 交叉引用 | done | §6.3 主线交叉引用表 | pass | 校验来源块和参考范围。 |
| 来源块 / 参考范围 | done | §6.4、§6.5 | pass | 执行跨架构单元总审计。 |
| 跨架构单元总审计 | done | §7 总审计表 | pass | 开放正式文档写权限。 |
| 正式文档重建 | done | `projects/L2-tools/01-架构设计.md` 固定 18 章 | pass | 执行正式文档写后审计。 |
| 正式文档写后审计 | done | §9 更新记录与最终审计 | pass | 同步 flow / ledger final stop-review。 |
| Step 完成停审 | done | flow / ledger `01_completed_stop_review` | pass | 等待用户审阅,不进入 02。 |

---

## 2. 必读文档与装配影响

| 文档 | 读取结论 | 对 Step 16 的影响 |
|---|---|---|
| 架构 SOP Step 16 | 只允许重组、术语统一、交叉引用和总审计;未停审结论不得写成正式定论。 | 本 Step 不再分析或补设计事实。 |
| 架构书写规范 | 正式文档固定 18 章;每章须有具体 calibration source;图必须有合规标题、`text` 代码块和 2~5 条说明。 | 旧 17 节结构必须整体替换。 |
| Step 1~2 | 已固定直接需求基线、八项目标、十四项硬约束、八项阶段取舍和八项非目标。 | 装配 §1~§3,开放风险不得因目标措辞被关闭。 |
| Step 3~5 | 已固定做 / 不做 / 易混淆职责、系统上下文及 `A1~A5`、`S1~S3`、`P1~P6` 语义单元。 | 装配 §4~§6,不得恢复 registry / executor / inventory 主线。 |
| Step 6~9 | 已固定 `R1~R3`、`T1/T2/D1`、三类依赖、四类数据、16 个交互场景和三类通信方式。 | 装配 §7~§10,不下沉到进程、协议、字段、表或产品。 |
| Step 10~13 | 已固定十一项机制、四条路径比较、六类横切约束和四个证据驱动结构阶段。 | 装配 §11~§14,不得补语言、框架、SLA、排期或 readiness。 |
| Step 14 | 已固定 `AR-L2T-001~009`、`Q-L2T-001~008` 与 `L2T-UP-001~009` 的开放状态。 | 装配 §15,风险、问题、blocker 严格拆表。 |
| Step 15 | 已固定九项长期 ADR 候选、需求追溯主表和漏项表。 | 装配 §16~§17;ADR 编号全部保持 `未建立`。 |
| 正式 00 | 是架构第一权威输入,覆盖仓定位、五节点、FR/BR/DR/IB/DB/NFR/AC/VF 与风险。 | 正式 01 不得反向修改需求口径。 |
| 旧 README / 旧 01 / 旧 02/03/05/06 | 含 Python monorepo、builtin/MCP/extras、registry、三态 executor、固定事件 / 错误 / SLA / ADR / 上线事实。 | 只进入 historical material 差异审计,不进入正式参考和新主线。 |

---

## 3. SOP 问题回答

### 3.1 已确认结论分别回填到哪些章节

正式文档严格使用书写规范的 1~18 章。Step 1 同时支撑来源、约束和追溯;Step 2 同时支撑背景、目标、约束、取舍和非目标;Step 3~14 分别形成对应架构结果章;Step 15 同时支撑需求追溯和 ADR 索引;Step 16 只控制装配和参考范围。完整映射见 §6.1。

### 3.2 哪些结论必须拆分吸收到多章

- 独立工具行动语义 truth center 同时影响 §2、§4、§6、§9、§12 和 §17。
- Canonical invocation / result / error 同时影响 §4、§6、§9、§10、§11 和 §16。
- Authorization / Sandbox 分权与 fail-closed 同时影响 §3~§6、§9~§11、§13、§15~§17。
- Local-truth-first、两类 local attempt 与 safe material 同时影响 §7、§9~§11、§13、§15~§17。
- Core-only compile 及 runtime/event 裁剪同时影响 §3、§5、§7~§8、§11、§15~§17。

这些关系只做跨章去歧义和引用,不把同一 Step 机械复制到多章。

### 3.3 哪些术语、编号与引用必须统一

正式文档统一使用 `A1~A5`、`S1~S3`、`P1~P6`、`R1~R3`、`T1/T2/D1`、`E/F/K/D/T` 及 Step 1~15 已定义 ID。`Tool identity`、`formal definition`、`Capability Binding`、`canonical invocation`、`normalized outcome`、`Tool-domain audit`、`safe material` 的含义不得在不同章漂移。旧 `Tool Registry`、builtin/MCP、extras、三态 executor 和旧 ADR 编号不得作为现行术语恢复。

### 3.4 哪些内容必须继续保留为开放项

`Q-L2T-001~008` 和 `L2T-UP-001~009` 全部继续开放。它们不阻塞逻辑架构装配,但阻塞 authorization 正向 authority、Sandbox mapping / receipt、Observability producer / route / readiness、Core Tools-specific contract、SDK client、量化指标、evidence 和 implementation-ready 声明。正式 01 只能写保守 seam 与影响,不能润色为现有合同。

### 3.5 参考项如何与来源、追溯和 ADR 分开

§1 只声明本文承接哪些上游主题;§16 逐项连接需求与架构结果;§17 索引长期决定。§18 只列当前需求基线、标准、全局依赖规则、架构校准产物和当前主链直接使用的相邻仓正式设计,不列旧 Draft、临时材料、旧 ADR 或文件大全。

### 3.6 架构单元和关键决定是否全部停审

Step 5/7/8/9/12/15 的停审记录均为 pass。十四个 A/S/P 单元在职责、依赖、数据、交互和横切维度均有落点;九项长期决定均有正式需求 / 约束 / 风险来源。开放 seam 保持 gap,不存在用追溯完整性替代正向合同完整性的情况。

---

## 4. 旧正式文档问题诊断

| 旧口径 | 冲突 | 装配处理 |
|---|---|---|
| 17 节旧结构、Draft 元信息和旧读码导航 | 不符合当前固定 18 章和逐章来源块要求。 | 删除旧正文后按 18 章重建。 |
| “可行动能力层”、工具库存和 member-images 装配定位 | 把语义契约 truth 与库存、实现、包装职责合并。 | 以独立工具行动语义契约层重建,不继承库存主线。 |
| Python monorepo / Runtime 同进程 | 无当前语言、进程或部署 authority。 | 不继承;只写逻辑运行角色和可同部署边界。 |
| Tool Registry、builtin/MCP/extras | 复制 Hub / provider / client / product truth。 | 不继承;以 A/S/P 分层和 controlled seam 重建。 |
| `in-process/sandbox/mcp` 三态 executor | 按 carrier / provider 分叉 canonical invocation。 | 不继承;执行要求与 Sandbox execution truth 分权。 |
| 固定 API、事件、错误码、数据表、队列和重试设施 | 越过架构层且缺正式 contract authority。 | 全部排除,留给后续正式文档按门禁收敛。 |
| 固定 P95/QPS/SLA/百分比 | 缺负载模型、测量对象和 evidence authority。 | 保留结构性 NFR,量化项进入待确认。 |
| `ADR-0005/ADR-0009` 与已审 / 已上线口径 | 无当前 ADR 文件、评审链、run 或签署。 | 不继承;九项 ADR 候选编号均为 `未建立`。 |

---

## 5. 装配取舍

| 方案 | 收益 | 风险 / 代价 | 结论 |
|---|---|---|---|
| 在旧正式 01 上局部替换 | 改动表面较小。 | 极易残留旧定位、17 节结构、技术设施、固定指标和 ADR 伪事实。 | 不采用。 |
| 按 Step 文件顺序机械拼接 | 过程来源完整。 | 正式文档会混入问题回答、诊断、停审记录并破坏结果结构。 | 不采用。 |
| 删除旧正文并按 18 章重建 | 可保证来源明确、术语一致、历史污染可控。 | 需要逐章装配和全链写后审计。 | 采用。 |

正式正文只承载收口结论。问题回答、旧材料诊断、逐单元停审和过程自检保留在 calibration 文件中;正式章通过来源块提供继续阅读入口。

---

## 6. 结构化装配产物

### 6.1 正式章节装配映射

| 正式章节 | 主要校准来源 | 正式回填内容 | 装配边界 |
|---|---|---|---|
| §1 与上游文档的关系声明 | Step 1;Step 15;Step 16 | 正式 00、全局依赖规则、相邻仓正式设计的来源主题。 | 不展开需求基线、职责或上下文。 |
| §2 业务背景与驱动力 | Step 2 | 多 owner 行动协作背景、六类驱动力、`AG-L2T-001~008`。 | 不写约束、技术或指标。 |
| §3 约束条件 | Step 1;Step 2 | `HC-L2T-001~014`、`AT-L2T-001~008`、`ANG-L2T-001~008`。 | 开放合同不写成 TODO 或 ready。 |
| §4 职责边界 | Step 3 | 做 / 不做 / 易混淆职责与边界红线。 | 不写上下文图、数据或交互。 |
| §5 系统边界与上下文 | Step 4 | 合规上下文图、输入 / 输出面、图外对象、失效口径。 | Authorization pending、SDK future 不混入当前主图。 |
| §6 限界上下文与子域划分 | Step 5 | `A1~A5`、`S1~S3`、`P1~P6` 表、统一语言和关系图。 | 语义结构不写成对象 / 代码 / 调用流程。 |
| §7 容器 / 部署架构 | Step 6 | `R1~R3`、`T1/T2/D1`、外部运行边界、运行表和部署说明。 | 不承诺进程、服务、技术栈或已部署集成。 |
| §8 依赖方向与层间约束 | Step 7 | `E/F/K/D/T`、层间约束、裁剪三表和裁剪图。 | 只使用 compile/runtime/event;不造第四依赖。 |
| §9 数据所有权与一致性策略 | Step 8 | 四类数据、归属表、一致性表和四条关键边界。 | 不写字段、表、事务、缓存或 outbox。 |
| §10 关键交互与通信方式 | Step 9 | 16 场景、同步 / 异步 / 后台判断及简化交互图。 | 条件 seam 不写成固定时序;不命名协议。 |
| §11 关键技术选型 | Step 10 | 十一项机制及当前不采用 / 后移口径。 | 不选产品、语言、框架、schema 或 SLA。 |
| §12 备选方案与取舍 | Step 11 | 当前主线、四条有效路径比较和取舍收束。 | Historical conflict 不伪装成合法候选。 |
| §13 横切关注点 | Step 12 | 六类关注点、十三项约束和单元适用性摘要。 | 不写配置 key、监控产品、阈值或恢复脚本。 |
| §14 演进路线 | Step 13 | 当前成立条件、可 / 不可接受债务、四个结构阶段和触发条件。 | 不写版本、日期、排期或 readiness。 |
| §15 风险与待确认事项 | Step 14 | 九项风险、八项待确认和九项 blocker。 | 三类对象拆表,状态不脑补关闭。 |
| §16 需求追溯矩阵 | Step 15 | 五列追溯主表、五列漏项表和范围说明。 | 不声明测试通过或集成 ready。 |
| §17 ADR 索引 | Step 15 | 九项长期决定候选和决策边界说明。 | 编号全部为 `未建立`,不恢复旧 ADR。 |
| §18 参考 | Step 16 | 克制的正式参考材料清单。 | 不重复来源、追溯或 ADR,不列 historical material。 |

### 6.2 术语统一表

| 统一术语 | 正式含义 | 禁止混淆 |
|---|---|---|
| 工具行动语义契约 truth center | 本仓拥有的 identity、definition、invocation、precondition、outcome、audit 语义中心。 | 工具库存、executor、Runtime orchestration、Hub registry。 |
| Tool identity / formal definition | A1 拥有的稳定身份、当前定义和合同锚点。 | 显示名、实现、provider、capability、SDK wrapper。 |
| Capability Binding | A2 拥有的 bound/unbound 与 body-free relation。 | Hub registry/exposure、visibility、applicability、authorization。 |
| Canonical invocation | A3 拥有的跨 caller/carrier 单一调用语义。 | Raw request、transport body、Runtime plan、carrier 私有 DTO。 |
| Execution requirement / authorization consumption judgment | A4 的工具域要求与正式结果可消费性判断。 | Effective decision、policy truth、本地 allowlist、自授权。 |
| Sandbox handoff attempt | A4 的 eligibility/context/local attempt/gap。 | Sandbox accepted、receipt、run、capture、cleanup。 |
| Normalized outcome / Tool-domain audit | A5 的工具终态与工具域追溯。 | Provider response、capture、Bus delivery、observation、checkpoint。 |
| Post-outcome submission attempt | A5 面向安全外发的本地准备 / 尝试 / gap。 | Bus delivered、Observability observed、端到端交付完成。 |
| Safe material | 同时满足 minimal necessary、body-free、redacted、correlated 的允许材料。 | Raw / secret / evidence body、只因加密而获准的正文。 |
| Truth / snapshot / ref / forbidden body | 数据归属四层。 | 将本地存在等同本地拥有,或把引用等同正文。 |
| Sync / async / background | 即时正式裁定、跨 owner 材料送达 / 传播、可延后维护 / 派生。 | 每次调用固定时序、全同步事务或全异步核心。 |
| Compile / runtime / event | 当前仅有的三类跨仓依赖。 | Material handoff 第四依赖、sibling path/package dependency。 |

### 6.3 主线交叉引用表

| 主线 | 约束来源 | 正式落点 | 写前审计 |
|---|---|---|---|
| 独立工具行动语义 truth center | Step 1/2/3/5/8/11/15 | §1~§4;§6;§9;§12;§16~§17 | 无断裂。 |
| A/S/P 分层写权 | Step 5/7/8/12/15 | §6;§8~§9;§13;§16~§17 | 无职责或写权重叠。 |
| Canonical invocation / outcome | Step 3/5/8/9/10/15 | §4;§6;§9~§11;§16~§17 | Caller/carrier 未分叉。 |
| Authorization / Sandbox 分权 | Step 3~5/7~10/12/14/15 | §3~§6;§8~§11;§13;§15~§17 | Owner/open seam 保留。 |
| Local-truth-first 与两类 attempt | Step 5/6/8~10/12/15 | §6~§7;§9~§11;§13;§16~§17 | A4/A5 attempt 未合并。 |
| Safe material / forbidden body | Step 1~3/5/8~10/12/15 | §3~§4;§6;§9~§11;§13;§15~§17 | 无正文例外。 |
| 三类依赖与 Core-only compile | Step 1/4/6/7/10/15 | §3;§5;§7~§8;§11;§15~§17 | 无第四依赖或 sibling package。 |
| 核心闭环 / 外围增强分离 | Step 1~5/9/11~15 | §2~§6;§10;§12~§17 | 外围未成为前置或写源。 |

### 6.4 逐章校准来源块映射

| 章节 | 必须列出的具体来源文件 |
|---|---|
| §1 | `01_arch_step_01_requirement_baseline.md`;`01_arch_step_15_adr_traceability.md`;本 Step。 |
| §2 | `01_arch_step_02_goals_constraints.md`。 |
| §3 | `01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`。 |
| §4~§15 | 分别引用 `01_arch_step_03_responsibility_boundary.md`~`01_arch_step_14_risks_open_questions.md`。 |
| §16~§17 | `01_arch_step_15_adr_traceability.md`。 |
| §18 | 本 Step;并保留 Step 1 / 15 对参考范围的约束入口。 |

每个来源块都必须附“延伸阅读”,明确指向对应文件的结构化中间产物、回填草稿和待确认事项;§18 则指向本 Step 的结构化装配产物与最终审计。

### 6.5 正式参考材料范围

| 参考材料 | 材料类别 | 入章理由 |
|---|---|---|
| `projects/L2-tools/00-需求文档.md` | 当前仓需求基线 | 是正式 01 的直接权威输入。 |
| `projects/L2-tools/design-calibration/01_arch_step_*.md` | 架构校准中间产物 | 是逐章收口来源和过程追溯入口。 |
| 架构 SOP / 书写规范 / 通则 / 真相源标准 / 全局依赖规则 | 标准 / 规范材料 | 长期约束本文件结构、事实、边界和依赖分类。 |
| `L3-capability-hub`、`L4-sandbox`、`L4-observability` 当前正式设计链 | 相邻 owner 正式材料 | 提供 Hub、execution、observation 的当前 workspace 边界输入。 |
| `L0-core`、`L0-bus`、`L0-sdk` 当前正式设计链 | 基础 / 协作 / future consumer 材料 | 分别约束 compile authority、event carrier 和 future client 边界。 |

旧 README、旧正式 01/02/03/05/06、旧 ADR、临时讨论和参考项目正文不进入 §18。参考项目只用于校准装配粒度,不构成 L2-tools 设计事实来源。

---

## 7. 跨架构单元总审计

| 检查项 | 结论 | 说明 |
|---|---|---|
| Step 5 架构单元停审 | pass | `A1~A5`、`S1~S3`、`P1~P6` 共十四个单元均有职责、非职责和关系。 |
| Step 7 依赖停审 | pass | 每个单元均有允许 / 禁止 / 倒置边界;只有 compile/runtime/event。 |
| Step 8 数据停审 | pass | 四类数据、十四单元 owner、消费时点和 forbidden write 均明确。 |
| Step 9 交互停审 | pass | 十六场景、三类通信和十四单元交互适用性均明确。 |
| Step 12 横切停审 | pass | 六类关注点、十三项约束和十四单元适用性无遗漏。 |
| Step 15 ADR / 追溯停审 | pass | 九项长期决定有来源,全需求范围无孤儿,ADR 编号未伪造。 |
| 职责重叠 | 无 unresolved 冲突 | Runtime、Hub、authorization、Sandbox、Bus、Observability、SDK / product owner 均未并入本仓。 |
| 依赖方向冲突 | 无 unresolved 冲突 | Core-only compile 与 runtime/event 裁剪一致;material handoff 未成为第四类依赖。 |
| 数据所有权冲突 | 无 unresolved 冲突 | Tool、Hub、authorization、Sandbox、Runtime、Bus、Observability truth 分权;A4/A5 attempt 分离。 |
| 通信方式冲突 | 无 unresolved 冲突 | 同步前置裁定、异步送达 / 传播、后台派生各有故障语义;条件 seam 非固定时序。 |
| 横切约束遗漏 | 无 | 安全、审计、可观测、韧性、性能、配置变更均有作用范围和保护目标。 |
| 追溯断裂 | 无 | 核心 / 外围 FR、IB、DB、NFR、AC、VF 全部有架构承接;开放 Q / UP 保持缺口。 |
| 历史材料回流 | 无 | 旧语言、registry、builtin/MCP、extras、executor、事件、错误、指标、ADR 和上线事实全部被排除。 |
| 实现 / 验证事实泄漏 | 无 | 未新增 DTO、API、event、table、commit、run、evidence、测试结果、签署或 readiness。 |

总审计没有 unresolved 冲突。`L2T-UP-001~009` 是已知开放接缝,不是本次装配冲突;它们必须在正式 §15/§16 继续显式可见。

---

## 8. 正式写入前门禁

| 门禁项 | 结果 |
|---|---|
| Step 1~15 是否全部完成 | pass |
| Step 5/7/8/9/12/15 是否完成单元停审 | pass |
| 是否建立固定 18 章映射 | pass |
| 是否建立逐章具体 calibration source 映射 | pass |
| 是否统一术语、编号和交叉引用 | pass |
| 是否完成跨单元总审计且无 unresolved 冲突 | pass |
| 未确认项是否仍在风险 / 待确认 / 漏项表 | pass |
| 是否明确旧正式 01 必须整体替换 | pass |
| 是否禁止新增设计、实现、验证和 readiness 事实 | pass |

```text
current_step = Step 16 formal_document_assembly pre_write completed
gate_status = pre_write_pass
gate_reason = the required 18-chapter mapping, terminology, source blocks, cross-references and cross-unit audit are complete with no unresolved conflict; open Q/UP seams remain explicit
next_allowed_action = replace_historical_01_architecture_with_18_chapter_formal_document
formal_document_write_allowed = true_after_flow_and_ledger_advance
next_formal_document_allowed = false
commit_required = false
```

---

## 9. 正式文档更新与最终审计

正式 `projects/L2-tools/01-架构设计.md` 已仅依据 Step 1~15 的停审结论按固定 18 章完成全量重建。以下记录只表示文档装配和设计一致性检查通过,不表示实现、集成、测试、验收、签署或上线已经完成。

### 9.1 正式写入结果

| 检查项 | 结果 | 说明 |
|---|---|---|
| 固定章节 | pass | 正式正文具备 §1~§18,顺序与架构书写规范一致。 |
| 逐章校准来源 | pass | 18 章均列出具体 Step 文件与延伸阅读,没有目录级模糊引用。 |
| 正式内容来源 | pass | §1~§18 均可回指 Step 1~15 已停审结论;Step 16 只装配参考、来源和审计边界。 |
| 架构粒度 | pass | 职责、上下文、十四个架构单元、运行承载、依赖、数据、十六个交互场景、机制、取舍、横切、演进、风险、追溯和 ADR 均完整。 |
| 开放项 | pass | `AR-L2T-001~009`、`Q-L2T-001~008`、`L2T-UP-001~009` 和九项 ADR 载体缺口均显式保留。 |
| 参考范围 | pass | 只列正式需求、校准产物、标准和相邻 owner 正式设计链;historical material 未列为正式参考。 |

### 9.2 写后全链审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 18 章数量、顺序与职责 | pass | 共 18 个编号一级章节;背景、约束、职责、上下文、数据、交互、风险、追溯和 ADR 未串章。 |
| 来源块与延伸阅读 | pass | 共 18 组校准来源和 18 组延伸阅读;合并来源逐项列出。 |
| ASCII 图规范 | pass | 六幅图均有章节标题、`text` 代码块和 2~5 条图后说明;不表达伪时序、协议或部署事实。 |
| 架构单元与交互数量 | pass | `A1~A5/S1~S3/P1~P6` 十四个单元、十六个交互场景、六类横切关注点与十三条约束一致。 |
| 依赖与 owner | pass | 只有 compile/runtime/event 三类依赖;Core-only compile;material handoff 未成为第四类;Runtime、Hub、authorization、Sandbox、Bus、Observability、SDK owner 未并入。 |
| 数据与失败语义 | pass | Truth/snapshot/ref/forbidden body、消费时点、A4/A5 两类 attempt、local-truth-first 和正式重入均保持一致。 |
| 需求范围 | pass | 核心 / 外围 FR、IB、DB、NFR、AC、VF 均显式列出范围并有承接;没有孤儿需求或无来源架构决定。 |
| 风险、问题与 blocker | pass | 九项风险、八项待确认、九项上游 blocker 全量可检出且状态未改变。 |
| ADR 诚实性 | pass | 九项长期决定编号均为 `未建立`;未恢复旧 ADR 编号、评审或签署。 |
| Historical material 污染 | pass | 旧 Python/Rust、registry、builtin/MCP/extras、executor、固定 API/event/error/SLA/指标/ADR/上线口径只在禁止、排除或历史审计语境出现。 |
| 实现 / 验证事实 | pass | 未新增 DTO/schema、实现 commit、run、evidence alias、测试结果、验收签署、route/receipt/client 或 readiness 成立事实。 |
| Markdown / diff 格式 | pass | 表格列数人工复核无异常;`git diff --check` 通过。 |

### 9.3 最终门禁

```text
current_step = Step 16 formal_document_assembly completed
current_module = formal_document_assembly:completed_stop_review
gate_status = pass
gate_reason = the formal 18-chapter architecture document was rebuilt only from stopped Step 1 through 15 conclusions and passed chapter, source, diagram, boundary, dependency, data, interaction, risk, traceability, ADR, historical-pollution and fact-discipline audits
next_allowed_action = wait_user_review_before_02
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```

本 Step 至此停审。`L2T-UP-001~009` 没有新增或关闭,不阻塞正式 01 的逻辑架构完成,但继续阻塞受影响的正向合同、schema、mapping、route、client、量化、验证与 implementation-ready 声明。未经用户再次明确确认,不得创建 02 flow、02 Step 中间产物或修改正式 `02-概要设计.md`。
