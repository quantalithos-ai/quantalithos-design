# L4-observability 01-架构设计 Step 13 · 演进路线

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 13
> 回填章节: `01-架构设计.md` §14 演进路线
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 14

---

## 1. 本步目标

说明 `L4-observability` 当前架构主线做到哪里算成立,哪些结构债务当前可接受,哪些能力后续才进入演进主线,以及什么条件会触发下一阶段演进。

本步只讨论架构主线的结构阶段,不写项目排期、版本路线图、任务拆单、TODO 清单、未来愿望池、产品选型、数据库、时序库、对象存储、消息产品、dashboard 产品、外部审计产品、协议字段、对象字段、部署参数、worker、测试结果或实施 boundary。已经被 Step 02 / 03 / 08 / 11 / 12 排除的业务 truth、治理裁决 truth、制品 / 证据正文、身份 truth、运行 / sandbox 执行 truth、归档包正文、console UI truth、外部产品配置 truth 和真实验收结论,不得在本步重新包装成后续演进项。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | Step 12 已完成,用户已确认进入 Step 13 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~12 pass,Step 13 已获用户确认 | 确认本轮只允许推进 Step 13。 |
| `design-calibration/01_arch_step_02_arch_goals_constraints.md` | 已完成 | 承接 observation truth、redaction / correlation、body-free linkage、read-only handoff、retention / no-write 和产品中立目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | 已完成 | 承接做 / 不做、易混淆职责和禁止隐式行为。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 承接同步入口、异步观察材料消费、后台维护、观察面真相承载和派生交接承载。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 承接 `L0-core` 唯一编译期依赖、`L0-bus` 事件协作和禁止 sibling truth repo 编译期业务依赖。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 承接 truth / projection / reference / forbidden body 分离、强一致 / 最终一致和失败处理口径。 |
| `design-calibration/01_arch_step_09_interactions_communication.md` | 已完成 | 承接同步即时判断、异步材料送达 / 事实传播和后台派生维护三类路径。 |
| `design-calibration/01_arch_step_10_technology_choices.md` | 已完成 | 承接正式承接边界、redaction-first、correlation、audit projection 分离、body-free linkage、retention、no-write guard、幂等顺序和产品中立适配。 |
| `design-calibration/01_arch_step_11_alternatives_tradeoffs.md` | 已完成 | 承接独立 observation truth + 正式边界协作主线和弃用路径。 |
| `design-calibration/01_arch_step_12_cross_cutting.md` | 已完成 | 承接安全、可追溯、可观测、韧性、性能 / 容量、配置和变更控制横切约束。 |
| `projects/L4-observability/00-需求文档.md` §13 / §14 / §15 | 正式需求基线已完成 | 提供需求层 NFR、验收否决项、风险与待确认事项。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 13 | 已读取 | 控制本步输出当前阶段、演进阶段、已知债务和触发条件。 |
| `standards/document/架构设计书写规范.md` §4.14 | 已读取 | 控制演进路线表、阶段边界说明和触发条件小表粒度。 |
| `projects/L1-governance/design-calibration/01_arch_step_13_evolution_path.md` | 已读取 | 参考“当前主线成立 + 可接受债务 + 触发条件”的组织方式,不复制治理仓结论。 |
| `projects/L1-artifact/design-calibration/01_arch_step_13_evolution_path.md` | 已读取 | 参考“不作为演进项”和“触发条件小表”的粒度,不复制制品仓结论。 |
| 旧 `design-calibration/01_arch_step_13_evolution_roadmap.md` | historical material,已被本文件替换 | 仅作为旧对象清单、字段式收口和错误门禁诊断来源,不继承旧结论。 |
| 旧 `projects/L4-observability/README.md` 与旧 `01-架构设计.md` | historical material | 仅作为旧产品栈、旧指标、旧对象命名、旧留存设想和旧实现假设诊断来源。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 02 / 03 / 06 / 07 / 08 / 09 / 10 / 11 / 12、SOP Step 13 和书写规范 4.14 | done | 本文件 §2 |
| 读取正式 00 NFR / 验收 / 风险、旧 Step 13、旧 README / 旧正式 01 和 L1 参考 Step 13 | done | 本文件 §2 / §5 |
| 回答当前阶段足够性、第一批必须守住结构、后续演进项、可接受债务和触发条件 | done | 本文件 §4 |
| 输出演进路线表、阶段边界说明、债务表、触发条件表、不作为演进项清单和演进边界说明 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 13 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 当前阶段做到哪里才算足够?

当前阶段做到“独立 observation truth + 正式边界协作主线”成立即可,不要求完整观测产品栈、完整事件溯源、完整完整性链、高级 dashboard / alert、自动外部审计导出、完整容量模型、最终性能数字、最终留存窗口、最终对象 / 协议细节或 implementation boundary 同时完成。

当前阶段必须成立的结构包括:

| 当前阶段必须成立结构 | 判断口径 |
|---|---|
| 独立 observation truth | 观察材料准入、安全处置、关联语境、观察面事实、审计投影、证据线索、报告交接、留存标记和 no-write violation 能作为观察面真相主线成立。 |
| 正式承接边界 | 外部观察材料、运行信号、审计线索、证据引用、报告消费、归档交接和外部产品适配都必须通过正式入口、safe ref、summary、snapshot、signal、gap 或 handoff 承接。 |
| redaction-first / safety marker | 任何准入、查询、诊断、报告、导出和交接都必须先满足安全处置和可见性判断。 |
| correlation context / safe ref | 关联必须通过安全语境解释来源、链路、主体和缺口,不得从 opaque id、label 或外部展示维度反推业务 truth。 |
| truth / projection / reference / forbidden body 分离 | Observation truth、只读派生、外部引用、外部快照和 forbidden body 必须分离。 |
| audit projection 只读 | 审计投影可用于横切可见性和复盘,不得替代 source audit truth、Governance decision、Artifact lineage 或 Identity truth。 |
| body-free evidence linkage | 证据关联只保存安全引用、摘要、缺口、真实性提示和消费目的,不保存 evidence body 或 artifact body。 |
| 一致性分层 | 核心观察事实同步成立、拒绝、隔离或挂起;派生查询、rollup、dashboard、alert、报告材料、外部审计导出和归档交接最终一致。 |
| 三类路径分离 | 同步即时判断、异步材料送达 / 事实传播、后台派生维护 / 交接维护分别成立,不得互相伪装。 |
| retention / no-write 边界 | Retention marker、active reference protection、archive handoff 和 no-write guard 必须可审计,不得清理活动引用或反写 source truth。 |
| 依赖裁剪 | 编译期只依赖 `L0-core`;`L0-bus` 是事件协作边界,非 core sibling truth repo 不进入编译期业务依赖。 |

### 4.2 第一批必须守住哪些结构?

第一批必须守住的是会直接决定本仓定位是否成立的结构:

1. `L4-observability` 只能拥有观察面事实、审计投影、证据线索、交接、留存标记和 no-write truth,不能拥有业务 truth、治理 truth、制品 truth、身份 truth、运行执行 truth 或归档 truth。
2. 外部观察材料不得直接进入核心语义,必须先经过正式承接、redaction-first、correlation、safe ref 和可见性判断。
3. Raw body、secret、credential、payload body、raw prompt、provider response、evidence body、artifact body 和 archive package body 不得因诊断、报告、导出或留存便利进入本仓。
4. Audit projection、dashboard、alert、report、external audit export 和 read model 均为只读派生或交接消费,不得成为第二 observation truth。
5. Report handoff 只能交接观察线索、脱敏状态、缺口、真实性提示和索引输入,不得生成真实测试 run、真实 evidence alias、final verdict 或 signoff。
6. Retention marker 不等于归档包 truth;active reference protection 不得被 cleanup、rebuild、replay 或外部消费绕过。
7. No-write guard 必须覆盖查询、诊断、报告、导出、后台维护、rebuild、replay 和产品适配路径。
8. 产品、存储、消息、dashboard、APM、外部审计工具和配置不得反向定义 observation truth。
9. 除 `L0-core` 外,不得引入非 core sibling truth repo 编译期业务依赖。

### 4.3 哪些能力或约束留到后续阶段演进?

| 后续演进项 | 当前口径 |
|---|---|
| 对象与协作协议收敛 | 当前先固定 observation truth、边界、分层、一致性和交互主线;正式对象、状态机、接口、事件协作、handoff 细节由概要 / 详细设计闭口。 |
| 产品适配与配置收敛 | 当前只固定产品中立适配和配置不可越界;具体存储、查询、分析、dashboard、alert、外部审计导出和部署配置后续在配置设计 / 实施计划收敛。 |
| 容量、性能、留存和 SLO 验证 | 当前只给结构性预算,不继承旧性能数字、冷存天数、事件数量或容量设想;后续由测试方案、验收标准和真实负载模型闭口。 |
| 增强追溯 / 完整性 / 长留存 | 当前采用 traceability、body-free linkage、authenticity hint、gap 和 handoff trail;完整事件重放、不可变事件模型、完整性链、长期保留和归档回链由明确审计 / 恢复压力触发。 |
| 派生消费 / 分析增强 | 当前只要求只读 query、diagnostic、report handoff、dashboard、alert 和外部导出不反写;高级聚合、异常分析、管理报告和外部审计自动化后续触发。 |
| 边界违例与对账增强 | 当前必须记录 no-write violation、缺口和失败状态;更强对账、自动隔离、批量修复建议和跨消费者追踪由边界压力触发,但仍不得修复 source truth。 |

### 4.4 哪些设计债务当前可接受,哪些不可接受?

当前可接受债务:

| 债务 | 当前可接受原因 | 后续触发 |
|---|---|---|
| 未锁定具体存储、查询、消息、dashboard、alert、APM、外部审计导出或对象存储产品 | 当前架构只需固定 truth、承接、依赖、一致性、派生和产品中立边界,产品选择不能反向定义核心。 | 概要 / 详细 / 配置 / 实施阶段需要实际承载时。 |
| 未固定最终对象、字段、状态机、接口和协作协议 | 当前阶段先确保边界和主线成立,对象与协议需要在概要 / 详细设计中根据正式职责落码。 | 后续文档需要可实现契约和测试用例时。 |
| 未把完整事件溯源、完整性链或长留存模型作为当前必选 | 当前已有 traceability、body-free linkage、handoff trail 和 gap 语义;完整事件和完整性模型需要审计 / 恢复压力证明。 | external audit、争议复盘、恢复重放或归档回链成为硬要求时。 |
| 未量化性能、容量、留存窗口和可用性数字 | 当前缺新版负载模型和验证来源,直接继承旧数字会形成伪约束。 | 压测、验收或生产负载模型形成后。 |
| 未展开高级 dashboard、alert、管理报告、异常分析和外部审计自动化 | 当前只需保证派生只读、最终一致和可解释失败,不让消费模型定义 truth。 | 下游消费开始塑造关键工作流或合规交付时。 |
| 未展开完整 archive handoff / recovery body 协议 | 本仓只拥有 retention marker、active reference protection 和 archive eligibility 线索,不拥有归档包正文和恢复手册。 | Archive 方提出正式回链、恢复验证和长期保留证明要求时。 |

当前不可接受债务:

| 债务 | 不可接受原因 |
|---|---|
| Observation truth 边界不清 | 会让 source owner、外部产品、report、dashboard、archive 或相邻 truth repo 替代观察面事实。 |
| Raw body、evidence body、artifact body、runtime body 或 archive body 入仓 | 会打穿 redaction-first、forbidden body 和 body-free evidence linkage。 |
| Audit projection 替代 source audit truth、Governance decision 或 Artifact lineage | 会形成第二治理 / 制品 truth。 |
| Report handoff 伪造真实测试 run、真实 evidence alias、final verdict 或 signoff | 会把设计期材料伪装成真实验收材料。 |
| 派生查询、dashboard、alert、外部审计导出或报告材料反写核心 | 会破坏只读消费和最终一致边界。 |
| Retention / cleanup / replay 可以删除或改写仍被引用的材料 | 会破坏 active reference protection、审计复盘和报告交接。 |
| No-write guard 不覆盖维护和交接路径 | 会让 Observability 变成 source truth 修复通道。 |
| 产品、配置或外部工具定义 observation truth | 会让实现承载反向统治架构语义。 |
| 非 core sibling 编译期业务依赖 | 会破坏全局依赖裁剪和相邻 truth owner 平权。 |

### 4.5 未来哪些触发条件会迫使架构调整?

触发条件必须来自边界压力、复杂度压力、一致性压力、审计压力、恢复压力、容量压力、留存压力或下游消费压力,不能来自模糊的“未来可能需要”。典型触发包括:

- 观察材料来源数量、类型或安全等级增加,当前准入 / redaction / correlation 不能稳定解释接受、拒绝、隔离和缺口。
- Report handoff、external audit export、dashboard 或 alert 开始成为关键消费路径,当前只读派生无法提供足够的状态解释、重建和对账。
- Audit projection、evidence linkage 或 authenticity hint 被外部审计、争议复盘或合规交付要求提供更强回链和完整性解释。
- Retention、active reference protection、archive eligibility 或 legal hold 复杂度超过当前标记模型。
- Rebuild、replay、gap scan 或 long-term analysis 需要更强事件版本、重放窗口或不可变材料。
- 压测、验收或生产负载证明核心同步判断、派生重建、查询、导出、交接或留存扫描承载不足。
- 配置变更开始影响 redaction、visibility、handoff purpose、retention、no-write、外部导出或产品适配边界。
- No-write violation、派生反写尝试、外部产品越界或相邻仓 truth 穿透开始具备实际运营影响。

### 4.6 当前主线演进时,最先改变的结构面是什么?

当前主线演进时最先改变的通常是外围承接层和派生消费层,不是 observation truth center。优先增强 formal intake、adapter、safe ref / snapshot refresh、read projection、handoff、retention scan、no-write audit、diagnostic、external export、archive eligibility、configuration governance 和 capacity guard。只有当审计重放、完整性证明、对象语义、留存生命周期或容量隔离明确证明当前事实模型不足时,才考虑核心 observation truth 的结构演进。

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `01_arch_step_13_evolution_roadmap.md` 把对象名、字段式收口和 report / retention / no-write 等写成结构化产物 | Step 13 应写架构主线演进,不应提前固定对象模型或字段。 | 全部降级为 historical material,本步按当前阶段、债务和触发条件重写。 |
| 旧 Step 13 门禁允许自动跨步或进入正式装配 | 与用户要求一个 Step 一个 Step 停审冲突,且 Step 13 后应等待 Step 14 确认。 | 改为 `wait_user_confirmation_before_step_14`。 |
| 旧 README / 旧正式 01 将产品栈、性能数字、事件数量、冷存时间和完整性链写得像演进主线 | 产品、指标、容量和算法不能作为本步正式演进承诺。 | 仅作为 historical material 或后续触发线索。 |
| Step 10 / 11 / 12 已经明确机制、取舍和横切约束 | 本步不能重写机制理由或方案比较,必须解释它们如何分阶段成立和演进。 | 当前演进路线围绕主线成立、可接受债务和触发条件组织。 |
| 需求待确认项仍包含产品、指标、协议、算法和 implementation boundary | 这些事项尚未到闭口阶段,不能在 Step 13 伪装为已确认演进承诺。 | 后移至概要、详细、配置、测试、验收和实施计划。 |
| 旧 implementation ledger / boundaries 仍存在 | 未经新版 `07-实施计划.md` 重建,不能作为演进或实现移交门禁。 | 继续保持 historical material。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 演进主语 | 对象、字段、产品、旧指标和实现想象混杂 | 架构主线阶段、可接受债务、后续结构演进和触发条件 | 对齐架构规范 4.14。 |
| 当前阶段边界 | 容易理解为完整 observability 产品和报告能力必须一次完成 | 当前只需独立 observation truth 与正式边界协作成立 | 防止范围膨胀。 |
| 后续演进项 | 容易形成愿望池或旧 Draft 路线图 | 只保留会改变承接、派生、追溯、留存、配置或容量结构的演进 | 防止边界外职责回流。 |
| 设计债务 | 可接受债务和边界红线混在一起 | 区分可接受债务和不可接受债务 | 保护后续概要 / 详细 / 实施纪律。 |
| 触发条件 | 泛泛“后续增强” | 以边界、审计、恢复、容量、留存和消费压力触发 | 演进必须由事实驱动。 |
| 正式装配 | 旧文件暗示可自动进入下一阶段 | Step 13 完成后停审等待 Step 14 | 对齐用户逐 Step 确认要求。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 直接继承旧产品栈、旧性能数字、旧留存设想和旧完整性链路线图 | 实施想象清晰。 | 会把历史材料包装成当前承诺,并让产品 / 指标反向定义 observation truth。 | 不采用。 |
| 方案 B: 按当前主线成立、可接受债务、后续结构演进和触发条件写演进路线 | 能说明当前为什么足以成立,也能给后续演进留下判断门槛。 | 后续仍需概要 / 详细 / 配置 / 测试 / 实施继续落地。 | 采用。 |
| 方案 C: 把所有可能的 dashboard、alert、审计导出、异常分析和长留存能力写成未来愿望池 | 覆盖看似完整。 | 没有边界、债务和触发条件,会把消费增强误写成 truth 演进。 | 不采用。 |
| 方案 D: 当前阶段直接锁定完整事件溯源、完整性链、固定产品和最终性能目标 | 后续实现方向明确。 | 过早锁定持久化范式、算法、产品和指标,抬高 P0 复杂度。 | 不采用。 |
| 方案 E: 不写演进路线,全部留到后续文档 | 文档更短。 | 后续容易混淆可接受债务、边界红线和未来增强。 | 不采用。 |

### 7.1 待确认问题的处理口径

| 待确认项 | 当前处理口径 | 理由 |
|---|---|---|
| 产品组合是否当前硬选型 | 不在 Step 13 硬选型,只保留产品中立适配和触发条件。 | 产品不能定义 observation truth。 |
| 完整事件溯源 / 完整性链是否当前必选 | 不作为当前必选,后续由审计重放、恢复和完整性压力触发。 | 当前 traceability、body-free linkage 和 handoff trail 足以支撑主线成立。 |
| 高级 dashboard / alert / 外部审计自动化是否进入主线 | 当前只作为只读派生消费增强,不得反写真相。 | 消费增强不能变成第二 observation truth。 |
| 性能、容量、留存窗口是否继承旧数字 | 不继承,后续由测试、验收和负载模型重定。 | 当前缺验证来源,不能伪量化。 |
| implementation boundary skeleton 是否现在创建 | 不在 Step 13 创建,必须等 `07-实施计划.md` 完成时统一创建。 | 避免架构阶段伪造实现移交边界。 |

---

## 8. 结构化中间产物

### 8.1 演进路线表

| 阶段 | 当前目标 / 范围 | 当前可接受债务 | 后续演进项 | 触发条件 | 说明 |
|---|---|---|---|---|---|
| 当前主线成立阶段 | 让独立 observation truth、正式承接边界、redaction-first、correlation / safe ref、truth / projection / reference / forbidden body separation、audit projection 分离、body-free evidence linkage、核心强一致、外围最终一致、同步 / 异步 / 后台分离、retention、no-write、traceability 和产品中立适配成立。 | 暂不锁定产品、最终对象 / 协议、完整事件溯源、完整性链、最终性能数字、留存窗口、高级 dashboard / alert、外部审计自动化和 implementation boundary。 | 进入概要 / 详细 / 配置 / 测试 / 验收 / 实施时细化对象、状态、协作协议、配置、指标和移交边界。 | 当前主线需要落成可实现边界,但尚未出现必须改造核心结构的压力。 | 当前不是“全做完”,而是先让观察面事实和边界协作稳定成立。 |
| 对象与协作协议收敛阶段 | 在不改变 truth ownership 的前提下,把 observation truth、audit projection、evidence linkage、report handoff、retention、no-write 和派生消费落成可实现对象、状态和协作契约。 | 当前允许对象细节和协作协议未完全闭口,只要不打穿本步边界。 | 对象契约、状态机、接口、事件协作、handoff、错误状态、重试和幂等规则。 | 概要 / 详细设计需要形成可实现契约,测试方案需要稳定输入输出和状态断言。 | 收敛的是可落码契约,不是把外部正文或相邻 truth 纳入本仓。 |
| 配置 / 产品适配 / 容量验证阶段 | 在产品中立边界内选择实际承载、外部适配、导出、告警、查询和运行配置,并用负载模型验证结构性预算。 | 当前允许产品组合、部署形态、配置项、容量数字和 SLO 未硬化。 | 产品适配、配置清单、容量模型、性能目标、读写隔离、限流、降级和变更审查。 | 配置设计、验收或实施计划需要真实承载约束,或负载证明当前预算不足。 | 产品和配置只能承载主线,不得定义 observation truth。 |
| 增强追溯 / 完整性 / 长留存阶段 | 在 traceability、body-free linkage、authenticity hint、gap 和 handoff trail 基础上增强重放、完整性证明、长期保留和归档回链。 | 当前允许不采用完整事件溯源、完整性链、长期重放窗口和完整归档回链协议。 | 事件版本治理、争议复盘、完整性提示强化、gap 扫描、长期留存、archive handoff protocol 和 recovery evidence handoff。 | external audit、争议复盘、恢复、归档或监管要求当前追溯材料不足以解释事实变化。 | 该阶段强化审计解释和交接,不让 archive 或外部审计系统定义本仓 truth。 |
| 派生消费 / 报告 / 外部审计增强阶段 | 增强只读 query、diagnostic、dashboard、alert、management report、external audit export 和 report handoff 的消费体验、重建和对账能力。 | 当前允许派生延迟、stale、rebuilding、failed、unavailable 和有限报告材料。 | 高级聚合、异常分析、跨消费者视图、报告材料索引、导出恢复、消费 SLA 和对账重建。 | 下游消费开始塑造关键运营、合规或复盘工作流,当前只读派生不足以支持解释。 | 该阶段只能增强消费和交接,不得反写核心或伪造验收。 |
| 边界违例 / 对账 / 防护硬化阶段 | 强化 no-write violation、派生反写尝试、产品越界、活动引用冲突、外部引用缺口和配置越界的检测、隔离和复盘。 | 当前允许先记录违例、缺口和失败状态,高级自动隔离和批量对账后续增强。 | 越界策略、自动隔离、跨消费者对账、风险报告、配置回滚、retention conflict 扫描和安全审计视图。 | no-write violation、外部产品越界、retention conflict 或配置越界开始具备实际运营影响。 | 硬化的是防护和对账,不是赋予 Observability 修复 source truth 的权力。 |

### 8.2 阶段边界说明短文

当前阶段不是“完整观测平台、完整审计产品、高级报告和长期归档全做完才算成立”,而是先让 `L4-observability` 的独立 observation truth、正式边界协作、安全处置、关联、只读投影、证据线索、报告交接、留存和 no-write 主线稳定成立。当前可接受债务之所以可接受,是因为它们暂不改变本仓是否拥有正确的观察面事实,也不会让外部正文、产品配置、派生视图、报告材料或归档包反向定义核心。后续演进必须由明确的边界、审计、恢复、容量、留存、配置或下游消费压力触发,不能把旧 Draft 的产品设施和未来愿望写成当前架构承诺。

### 8.3 可接受债务与不可接受债务表

| 债务类型 | 当前是否可接受 | 理由 | 后续处理 |
|---|---|---|---|
| 未锁定具体存储、查询、消息、dashboard、alert、APM、外部审计导出或对象存储产品 | 可接受 | 产品承载不能反向定义 observation truth 和依赖边界。 | 概要 / 详细 / 配置 / 实施阶段收敛。 |
| 未固定最终对象、字段、状态机、接口和协作协议 | 可接受 | 当前需要先固定 truth、边界、一致性和交互主线。 | 概要 / 详细设计闭口。 |
| 未把完整事件溯源、完整性链或长留存模型作为当前必选 | 可接受 | 当前 traceability、body-free linkage、handoff trail 和 gap 语义已支撑主线。 | 进入增强追溯 / 完整性 / 长留存阶段。 |
| 未展开高级 dashboard、alert、异常分析、管理报告和外部审计自动化 | 可接受 | 当前只需派生只读、最终一致和可解释失败。 | 进入派生消费 / 报告 / 外部审计增强阶段。 |
| 未量化性能、容量、SLO、留存窗口和可用性数字 | 可接受 | 当前缺正式负载模型和验证来源。 | 测试方案、验收标准和配置设计收敛。 |
| 未创建新版 implementation boundary skeleton | 可接受 | 该动作属于 `07-实施计划.md` 完成时的实现移交资产。 | 07 正式完成时统一创建。 |
| Observation truth 边界不清 | 不可接受 | 会使本仓退化为外部产品、相邻仓或派生视图的副本。 | 必须当前修正。 |
| 外部正文或证据正文入仓 | 不可接受 | 会打穿 redaction-first、forbidden body 和 body-free evidence linkage。 | 必须当前修正。 |
| Audit projection、report、dashboard 或 external export 定义 truth | 不可接受 | 会形成第二 observation / governance / artifact truth。 | 必须当前修正。 |
| Report handoff 伪造真实测试证据或验收结论 | 不可接受 | 设计文档不能伪造真实执行、证据别名、最终结论或签署。 | 必须当前修正。 |
| Retention / cleanup / replay 破坏 active reference protection | 不可接受 | 会误清仍被审计、报告、诊断或归档交接引用的材料。 | 必须当前修正。 |
| No-write guard 缺失或仅覆盖查询路径 | 不可接受 | 维护、导出、rebuild、replay 和产品适配同样可能越权反写。 | 必须当前修正。 |
| 非 core sibling 编译期业务依赖 | 不可接受 | 会破坏全局依赖裁剪和相邻 truth owner 平权。 | 必须当前修正。 |

### 8.4 触发条件小表

| 触发条件 | 触发的演进方向 | 最先改变的结构面 | 不应改变的边界 |
|---|---|---|---|
| 对象语义、状态断言或协作契约已经阻塞概要 / 详细设计落码 | 对象与协作协议收敛 | 对象契约、状态机、接口和 handoff 契约 | 外部正文和相邻 truth 不入仓 |
| 实际承载、外部适配或配置变更需要可审查选择 | 配置 / 产品适配 / 容量验证 | 配置清单、adapter、容量模型、降级和变更审查 | 产品和配置不定义 observation truth |
| 压测、验收或生产负载证明核心判断、派生重建、查询、导出或留存扫描不足 | 配置 / 产品适配 / 容量验证 | 读写隔离、限流、批处理、派生重建和性能目标 | 不降低核心一致性和 no-write 边界 |
| external audit、争议复盘、恢复或归档要求更强回链和完整性解释 | 增强追溯 / 完整性 / 长留存 | 事件版本、完整性提示、gap 扫描、回链和重放窗口 | 事件 / 完整性材料不替代 source truth |
| Dashboard、alert、management report 或 external audit export 成为关键消费路径 | 派生消费 / 报告 / 外部审计增强 | 只读派生、报告索引、对账恢复和消费状态 | 派生消费不得反写或伪造验收 |
| No-write violation、产品越界、retention conflict 或配置越界具备实际运营影响 | 边界违例 / 对账 / 防护硬化 | 越界检测、隔离、对账、配置回滚和复盘视图 | Observability 不获得修复 source truth 的权力 |
| 外部引用缺失、safe ref 解析失败或关联缺口影响审计解释 | 对象与协作协议收敛;增强追溯 / 完整性 / 长留存 | 引用刷新、gap 语义、关联状态和 handoff trail | 不补造外部 truth 或正文 |
| Retention、legal hold、archive eligibility 或 active reference protection 出现冲突 | 增强追溯 / 完整性 / 长留存;边界违例 / 对账 / 防护硬化 | Retention marker、hold / release、archive handoff 和 conflict scan | Archive package body 不归本仓 |

### 8.5 不作为演进项的事项

| 事项 | 不作为演进项的原因 | 正确归属 |
|---|---|---|
| 业务 source truth、业务状态生命周期和业务写入结果 | Observability 只观察、引用、投影或交接,不拥有业务事实。 | 对应 source owner |
| Governance decision、Gate、Policy、Control、AIIA / SoA、Nonconformity truth | Observability 只拥有只读审计投影和观察线索。 | `L1-governance` |
| Artifact fact、version、lineage、baseline、evidence body 和 artifact body | Observability 只拥有 body-free evidence linkage、缺口和真实性提示。 | `L1-artifact` / evidence owner |
| Identity authentication、GlobalMember 生命周期、role registry | Observability 只消费 actor / subject safe ref 或快照。 | `L1-identity` / `L0-core` |
| Runtime / sandbox execution truth、provider response body、tool execution body | Observability 只拥有安全运行观察面和运行信号投影。 | `L2-runtime` / `L4-sandbox` |
| Archive package body、长期恢复手册、归档恢复执行 truth | Observability 只拥有 retention marker、active reference protection 和 archive eligibility / handoff。 | `L4-archive` |
| Console UI state、dashboard layout、workspace view 和 sync private state | 这些是展示或同步消费面,不是 observation truth。 | `L5-console` / 产品展示层 / sync 边界 |
| 外部 APM、dashboard、alert 或外部审计产品配置 truth | 产品只能承载、消费或适配,不得定义本仓核心语义。 | 配置设计 / 外部系统 |
| 真实测试 run、真实 evidence alias、passed evidence、final verdict、signoff | 真实测试与验收阶段产生,设计文档不得伪造。 | `05-测试方案` 真实执行 / `06-验收标准` 真实验收 |

### 8.6 演进边界说明

`L4-observability` 的演进必须优先保护独立 observation truth,而不是扩张职责。能在 formal intake、adapter、safe ref / snapshot refresh、derived read surface、handoff、retention scan、no-write audit、configuration governance 或 capacity guard 中解决的问题,不应直接改变核心 truth center。只有当对象语义、审计重放、完整性证明、留存生命周期、容量隔离或恢复要求明确证明当前事实模型不足时,才考虑核心结构演进。每个后续阶段都必须继续满足八条底线:外部正文不入仓,相邻 truth 不归属,audit projection 只读,body-free evidence linkage,report 不伪证,retention 保护活动引用,no-write guard 持续生效,不引入非 core 编译期业务依赖。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 14. 演进路线

> 校准来源:
> - `design-calibration/01_arch_step_13_evolution_roadmap.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“演进路线表”“阶段边界说明短文”“可接受债务与不可接受债务表”“触发条件小表”“不作为演进项的事项”和“演进边界说明”小节,了解本章如何从前序架构主线推导结构演进阶段。

### 14.1 演进路线表

摘录 `design-calibration/01_arch_step_13_evolution_roadmap.md` §8.1。

### 14.2 阶段边界说明

摘录 `design-calibration/01_arch_step_13_evolution_roadmap.md` §8.2。

### 14.3 可接受债务与不可接受债务

摘录 `design-calibration/01_arch_step_13_evolution_roadmap.md` §8.3。

### 14.4 触发条件

摘录 `design-calibration/01_arch_step_13_evolution_roadmap.md` §8.4。

### 14.5 不作为演进项的事项

摘录 `design-calibration/01_arch_step_13_evolution_roadmap.md` §8.5。

### 14.6 演进边界说明

摘录 `design-calibration/01_arch_step_13_evolution_roadmap.md` §8.6。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 14 的上游 blocker。下列事项进入后续 Step 或后续文档,不得在 Step 13 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| `Q-OBS-ARCH-013-001` | 正式对象、状态机、接口、事件协作和 handoff 契约如何落成可实现设计 | 后续概要 / 详细设计收敛。 |
| `Q-OBS-ARCH-013-002` | 实际存储、查询、消息、dashboard、alert、APM、外部审计导出和对象存储产品组合 | 后续配置设计、测试方案和实施计划收敛。 |
| `Q-OBS-ARCH-013-003` | 完整事件溯源、完整性链、gap 扫描、长期保留和归档回链是否进入主线 | 后续由审计、恢复、归档和容量压力触发。 |
| `Q-OBS-ARCH-013-004` | 性能、容量、SLO、留存窗口和可用性数字 | 后续测试方案、验收标准和真实负载模型收敛。 |
| `Q-OBS-ARCH-013-005` | Implementation ledger 与 planned boundary skeleton | 必须等 `07-实施计划.md` 完成时统一创建,当前不得伪造。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否回答当前阶段做到哪里算足够 | pass | 已在 §4.1 和 §8.1 收束当前主线成立边界。 |
| 是否明确第一批必须守住的结构 | pass | 已在 §4.2 明确 observation truth、redaction、safe ref、只读派生、report 不伪证、retention、no-write 和依赖裁剪。 |
| 是否区分可接受债务和不可接受债务 | pass | 已在 §4.4 和 §8.3 分表说明。 |
| 是否明确后续演进项和触发条件 | pass | 已在 §4.3、§4.5、§8.1 和 §8.4 收束。 |
| 是否滑入项目排期、TODO 清单或愿望池 | pass | 全文使用结构阶段和事实触发条件,未写排期、版本或任务拆单。 |
| 是否把已排除事项重新包装成演进项 | pass | 已在 §8.5 列出不作为演进项的事项。 |
| 是否误写产品、对象字段、协议细节、测试结果或 implementation boundary | pass | 产品、对象、协议、指标和 implementation boundary 均后移对应文档闭口。 |
| 是否修改正式 `01-架构设计.md` | pass | 本步只更新中间产物、flow 和项目台账,正式文档仍等待 Step 16。 |
| 是否发现上游 blocker | pass | 未发现阻塞 Step 13 完成的上游 blocker。 |
| gate_status | pass | Step 13 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_14 | 必须等待用户确认后才能进入 Step 14。 |
