# Step 2. 明确架构目标与约束

## 1. Step 状态

| 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| `goals_constraints` | pass | 架构目标、不可变约束、当前阶段取舍和非目标已从 Step 1 分层推导;无实现或伪量化结论 | 进入 Step 3 职责边界 | `01_arch_step_01_requirement_baseline.md`;`../00-需求文档.md` |

### 1.1 Step 内计划

- [x] 读取 ledger、01 flow、Step 1、架构 SOP Step 2 与书写规范 §4.2~4.3。
- [x] 提炼本仓值得独立架构化的结构性驱动力。
- [x] 将 C-MI-1~5 转译为架构必须确保成立的结果,不复写功能项。
- [x] 从 HC-MI-001~010 提炼不可变红线。
- [x] 区分本仓潜在能力的阶段收缩与边界外非目标。
- [x] 排除量化、产品、schema、容器和部署方案。
- [x] 至少比较一个被拒绝的目标组织方案。
- [x] 核对 MI-UP / Q 对目标的影响只产生条件,不产生 readiness。

## 2. 本步输入

| 输入 | 本步承接 |
|---|---|
| Step 1 `RB-MI-001~012` | 稳定需求基线与五节点结构 |
| Step 1 `HC-MI-001~010` | owner、pin、no-live-state、fail-closed、history、dependency 红线 |
| 正式 00 §2~4 / §7 / §10~15 | 定位、驱动力、目标范围、能力闭环、规则、数据、质量、验收和风险 |
| accepted ADR-0005 | 构建期预装、nightly、一 Role 一镜像、pinned、禁 `latest` |
| MI-UP-001~009 / Q-MI-001~004 | exact seam 和外围能力的阶段上限 |

## 3. SOP 问题回答

1. 这个仓在架构层面要确保什么成立?

   回答:必须确保一个镜像 variant 从正式 Role mapping 来源、完整 pinned 静态装配、确定构建快照、candidate digest / provenance / eligibility 到 pinned supply entry 始终属于一条可归责但不吞并上游正文或下游运行状态的镜像域链路。

2. 哪些约束不可变?

   回答:owner 不反转、外部正文和 live state 不入仓、必要输入必须 pinned、未知结果 fail closed、变更历史不覆盖、adapter success 不等于领域成功、非 Core 消费不形成源码依赖、未闭口合同不产生 readiness,均不可变。

3. 哪些是当前阶段可以接受的取舍?

   回答:当前只确保单一受控运行架构维度下的核心 variant 供给语义;restricted variant、多架构、快速安全重建、hardened base、usage summary 和具体 backend / evidence inventory 保持 conditional / future / adapter-neutral。

4. 哪些目标可以明确判断甚至量化?

   回答:可离散判断 owner 是否唯一、必要 pin 是否完整、live body 是否为零、attempt 是否唯一回指 snapshot、candidate 是否有完整 provenance、适用 gate 是否全满足、entry 是否 pinned、状态历史是否保留。当前没有 workload / measurement baseline,不引入时延、成功率、大小、保留期等数值。

5. 哪些相关事项不是本仓当前架构问题?

   回答:Role 定义与 mapping 编辑、member 主体、runtime / tools 执行、live memory / checkpoint、container / Sandbox 生命周期、governance approval、Artifact 通用生命周期、observability backend、marketplace / product entry 和基础设施产品本体均不进入本仓架构。

## 4. 当前材料问题诊断

| 候选口径 | 混层问题 | 本步校准 |
|---|---|---|
| “支持构建 / 发布 / 回滚镜像” | 功能动词,未说明结构必须守住什么 | 改为镜像域事实链、资格和供给边界必须独立成立 |
| “高可用、高性能、安全” | 空泛质量口号且无 baseline | 改为 fail-closed、no-live-body、history-preserving 等可判断结构 |
| 九模块全部视为架构目标 | 将实现拆分当架构结果 | 目标只描述责任结构,模块在 Step 5 重新推导 |
| 多架构、restricted variant 作为必达 | 扩大当前 core | 作为可接受阶段收缩和演进条件 |
| 固定 scanner / signer / registry | 将产品选择写成目标 | 后移技术 / 配置设计;本步只保留 port-neutral 边界 |
| “发布后自动通知并启动” | 把 outbound event 和 consumer truth写成目标 | MI-UP-001/009 未闭口时只保留 supply entry 与 gap |

## 5. 改动前后对比

| 维度 | 改动前 / 候选 | 当前结论 |
|---|---|---|
| 背景 | 缺镜像构建脚本或流水线 | 缺少独立、连续、可归责的镜像域 truth 链 |
| 目标 | build / scan / push 等动作 | 承载定义、装配、候选、资格、供给五类结构性结果 |
| 约束 | 产品 / 指标与边界混排 | owner、static/live、pin、history、seam、fail-closed 红线 |
| 取舍 | future 能力与 core 混排 | conditional / future 能力显式不进当前分母 |
| 非目标 | 零散“不负责” | 按相邻 owner 和实施粒度形成架构排除项 |
| 可判断性 | 依赖真实 build 成功 | 使用结构完整性和否决条件,不伪造执行结果 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 按构建流水线阶段定义架构目标 | 易理解 | 依赖具体 CI / registry / scanner,且遗漏 truth owner | 不采用 |
| 按九个候选组件定义目标 | 可直接映射实现 | 过早锁模块数量和部署形态 | 不采用 |
| 按五节点领域结果 + 跨节点红线定义目标 | 可追溯正式 00,保持产品中立 | 需要后续再推导上下文 | 采用 |
| 把所有开放 seam 视为总阻塞 | 避免误集成 | 无法先收敛稳定架构边界 | 不采用;仅阻塞受影响 positive lane |
| 给当前目标附加旧时延 / 成功率数值 | 看似可量化 | 无 authority 和 measurement baseline | 不采用 |

## 7. 结构化中间产物

### 7.1 业务背景与驱动力

成员运行环境由多个 owner 的静态资产组合而成,却必须由下游以一个固定、可验证的镜像入口消费。若定义来源、装配 revision、构建结果、资格和供给事实散落在脚本、builder、registry 或 member-service 中,相同名称无法证明对应相同输入,下游也会被迫猜版本或重建 mapping。因此本仓需要独立架构边界,把多来源静态资产转化为唯一、可追溯的镜像域供给事实,同时让运行期 live state 和相邻 truth 留在各自 owner。

| 驱动力 | 若不处理会破坏什么 |
|---|---|
| 多 owner 静态输入需要单一装配归责 | 同一 variant 会由不同来源组合且不可解释 |
| Role mapping 需要唯一来源 | 构建仓或下游会形成第二 mapping truth |
| 构建适配器与领域结果需要分离 | 请求 / push 成功会被误报为 candidate / available |
| 供应链资格需要可验证来源 | digest、provenance 与 gate 会成为互不关联的标签 |
| 供给与消费生命周期需要分离 | registry / container / consumer 状态会反向改写镜像 truth |
| 跨仓消费必须裁剪 | 物理装配会被错误升级为源码和 owner 依赖 |

### 7.2 架构目标

| ID | 架构目标 | 说明 |
|---|---|---|
| `AG-MI-001` | 承载独立且连续的成员镜像域真相 | 否则镜像定义、候选与供给会散落为多份事实。 |
| `AG-MI-002` | 支撑 Role 来源与 image variant / persona 装配身份受控关联 | 否则本仓或下游会 hardcode Role 映射。 |
| `AG-MI-003` | 支撑完整 pinned 静态装配与显式派生历史 | 否则同名 revision 会随外部最新状态漂移。 |
| `AG-MI-004` | 支撑构建意图、不可变输入快照、执行结果与 candidate formation 分层 | 否则 adapter 结果和未知结果会冒充候选。 |
| `AG-MI-005` | 支撑 candidate digest、provenance、适用 gate 与 image eligibility 连续可解释 | 否则无法证明输出与受控输入或门禁结论一致。 |
| `AG-MI-006` | 支撑 availability 历史与 pinned instantiable entry 稳定成立 | 否则下游只能依赖 mutable selector 或自行猜版本。 |
| `AG-MI-007` | 守住镜像域 truth、外部 ref / snapshot、adapter outcome 和 consumer truth 的边界 | 否则物理装配和消费会反转相邻 owner。 |
| `AG-MI-008` | 允许开放 seam 在 fail-closed 状态下演进 | 否则未闭口合同会被迫伪装为 ready 或阻塞全部稳定设计。 |

### 7.3 不可变约束

| ID | 约束 | 说明 |
|---|---|---|
| `IC-MI-001` | 不定义或复制 RoleDefinition / Role -> variant mapping truth | 方法资产 owner 边界不可打穿。 |
| `IC-MI-002` | 不拥有 member、runtime loop、tool execution / capability registry truth | 装配 component 不转移其语义与执行 owner。 |
| `IC-MI-003` | 不保存 secret、live memory、checkpoint、workspace live content 或 observed state | 镜像只能承接静态模板 / seed / build materialization。 |
| `IC-MI-004` | 不拥有 container lifecycle、Sandbox policy / backend / execution | pinned entry 不代表容器已创建或隔离已生效。 |
| `IC-MI-005` | 不拥有 governance approval / policy truth、Artifact 通用 truth或 observability backend | 只消费正式 ref / safe conclusion,不复制正文。 |
| `IC-MI-006` | 不允许 mutable selector、猜版本或默认值补齐必要输入 | 完整 pin 是 candidate 形成前提。 |
| `IC-MI-007` | 不将 adapter / event 接受或 registry 存在视为领域成功 | candidate、eligibility、availability 分别由本仓规则成立。 |
| `IC-MI-008` | 不允许 missing / stale / conflict / failed / unknown / gap 降级为 positive | 所有不可验证路径 fail closed。 |
| `IC-MI-009` | 不允许 revision、attempt、eligibility 或 availability 历史原地覆盖 | rollback 和审计依赖显式历史。 |
| `IC-MI-010` | 不允许非 Core 消费关系自动形成 compile dependency | runtime / event / ref / adapter / fake 各守边界。 |
| `IC-MI-011` | 不在 authority 未闭口时声明 event output、Artifact ref、consumer confirmation 或 readiness | MI-UP / Q 只能产生 pending 上限。 |

### 7.4 当前阶段可接受取舍

| 取舍 | 当前口径 |
|---|---|
| 多运行架构供给 | 当前作为 Q-MI-002 conditional enhancement,核心先保持平台维度中立。 |
| Restricted / 收缩 variant | 当前作为 Q-MI-001 conditional enhancement,不改变 Role 或 governance truth。 |
| 高风险变化快速重建 | 当前作为外围路径,仍必须经过全部核心 pin 与适用 gate。 |
| Hardened base | 当前按 MI-UP-008 future-only,只保留未来 ref 边界。 |
| Supply usage summary | 当前按 F-MI-E05 / R-MI-010 future 只读投影处理,不得反写 eligibility / availability。 |
| Builder / registry / evidence backend | 当前按 Q-MI-003 保持 adapter-neutral,不锁产品、供应商或部署形态。 |
| 具体 evidence kind / priority | 当前只要求 authority-driven applicable gate;Q-MI-004 关闭前不枚举核心门禁。 |
| 数值型质量目标 | 当前只保留离散结构约束;取得正式 workload / measurement baseline 后再校准。 |

### 7.5 架构非目标

| 非目标 | 不展开原因 |
|---|---|
| 不设计 Role / method 资产管理架构 | RoleDefinition 与 mapping truth 归 `L3-method-library`。 |
| 不设计 member 主体或 persona live behavior 架构 | 主体真相归 `L2-member`,本仓只拥有镜像装配身份。 |
| 不设计 runtime loop、memory、checkpoint 或 tool execution 架构 | 属于 Runtime / Tools 运行边界。 |
| 不设计外部 MCP / A2A / API adapter 或 capability registry | 属于能力与 adapter owner。 |
| 不设计容器编排、健康、升级或 Sandbox execution 架构 | 属于 `L2-member-service` / `L4-sandbox`。 |
| 不设计 Artifact、governance 或 observability backend 架构 | 本仓只保存其正式 ref / safe conclusion / gap。 |
| 不设计 marketplace、产品 UI / CLI 或最终用户入口 | 属于分发与产品层。 |
| 不设计 CI、builder、registry、scanner、signer 或 secret store 产品本体 | 它们只能作为未来 adapter / infrastructure。 |
| 不在架构层定义 DTO、schema、状态枚举、数据库表、语言、crate、目录或测试用例 | 属于 02~07 的后续粒度。 |

### 7.6 可判断性上限

| 判断 | 当前允许的结论 |
|---|---|
| Owner 唯一性 | 可静态判断是否出现第二 truth owner |
| 输入完整性 | 可判断必要 ref 是否存在、pinned、verified、static-safe |
| Provenance 完整性 | 可判断 candidate 是否回指 intent / snapshot / revision / sources |
| Gate 完整性 | 可判断全部正式适用 gate 是否有可验证结论 |
| Supply 入口 | 可判断 entry 是否绑定 eligible availability 与 immutable ref |
| 量化性能 / 可用性 | 当前不可设硬值;没有真实 baseline 或执行证据 |

## 8. 回填草稿

正式 01 §2 回填 §7.1 背景 / 驱动力和 §7.2 架构目标。正式 §3 联合 Step 1 回填 §7.3 不可变约束、§7.4 当前阶段取舍、§7.5 非目标和无量化事实说明。正文只保留收口结论,本文件的问题回答、候选诊断和方案比较不进入正式章。

## 9. 待确认事项

- 本 Step 不新增开放编号。
- MI-UP-001~009 不改变 AG-MI-001~008 的结构目标,但持续阻塞受影响 exact / positive lane。
- Q-MI-001~004 已分别进入阶段取舍,均未升级为 current core。
- 具体产品、协议、存储与数字继续 deferred,不因列入目标而获得 authority。

## 10. 进入下一步条件

| 检查项 | 结果 |
|---|---|
| 目标是否描述结构性结果而非功能 / 技术 | pass |
| 不可变约束是否具体保护 owner 与状态边界 | pass |
| 阶段取舍是否只覆盖本仓潜在范围 | pass |
| 非目标是否归因到边界外 owner / 后续粒度 | pass |
| 是否无伪量化、产品、部署和 readiness 结论 | pass |

`gate_status = pass`;允许更新 flow / ledger 后创建 Step 3,不得跳到 Step 4 或修改正式 01。
