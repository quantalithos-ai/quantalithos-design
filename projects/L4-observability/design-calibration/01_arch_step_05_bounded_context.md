# L4-observability 01-架构设计 Step 05 · 限界上下文与子域划分

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 5
> 回填章节: `01-架构设计.md` §6 限界上下文与子域划分
> 生成日期: 2026-07-07
> 状态: 已完成,等待用户确认后进入 Step 06

---

## 1. 本步目标

说明 `L4-observability` 内部语义结构如何划分:哪些是核心子域,哪些是支撑子域,哪些只是本地索引 / 投影 / 引用,以及它们之间的上下文映射关系。本步只讨论本仓内部语义结构,不写对象字段、数据库表、代码目录、函数接口、容器部署、技术选型、事件名、运行顺序、实现组件或外部产品选型。

本步的核心判断是: `L4-observability` 的内部语义结构必须围绕 observation truth 主线展开,而不是围绕“日志 / 指标 / trace / dashboard / APM 产品”展开。日志、指标、追踪、审计投影、证据关联、报告交接和留存防线都必须服务同一条 redaction-first、correlation-aware、body-free、read-only、no-write 的观察面边界。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/project_execution_ledger.md` | 当前台账显示 Step 04 已完成,用户已确认进入 Step 05 | 确认当前恢复点和 Step 切换门禁。 |
| `design-calibration/01_architecture_calibration_flow.md` | Step 01~04 pass,Step 05 blocked by user confirmation | 确认本轮只允许推进 Step 05。 |
| `design-calibration/01_arch_step_01_requirements_baseline.md` | Step 01 已完成 | 承接需求基线、数据归属、硬约束和历史材料降级结论。 |
| `design-calibration/01_arch_step_02_arch_goals_constraints.md` | Step 02 已完成 | 承接 observation truth、redaction / correlation、read-only handoff、retention / no-write 和产品中立目标。 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 03 已完成 | 承接做 / 不做 / 易混淆职责和边界红线。 |
| `design-calibration/01_arch_step_04_system_context.md` | Step 04 已完成 | 承接正式上下文对象、输入 / 输出面、降级口径和外部产品后置结论。 |
| `projects/L4-observability/00-需求文档.md` §7 / §9 / §10 / §11 / §12 / §14 / §15 | 正式需求基线已完成 | 校验核心能力、功能需求、规则、数据归属、接口边界、验收和风险。 |
| `projects/L1-governance/design-calibration/01_arch_step_05_bounded_context_subdomains.md` | 已读取 | 参考核心子域 + 支撑上下文 + 本地影子层 + 停审记录组织方式。 |
| `projects/L1-artifact/design-calibration/01_arch_step_05_bounded_context_subdomains.md` | 已读取 | 参考 truth owner、派生消费和本地投影边界表达方式。 |
| 旧 `design-calibration/01_arch_step_05_bounded_context.md` | historical material,已被本文件替换 | 仅作为薄产物诊断来源,不继承其中 schema / 产品 / 指标口径。 |
| 旧 `projects/L4-observability/README.md` 与旧 `01-架构设计.md` | historical material | 仅作为旧子域、旧产品栈和旧实现假设诊断来源。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、01 flow、Step 01~04、架构 SOP Step 5 和书写规范 4.6 | done | 本文件 §2 |
| 回答内部子域、核心子域、支撑子域、本地影子结构、上下文关系和不能混合原因 | done | 本文件 §4 |
| 诊断旧 README、旧正式 01 和旧 Step 05 中子域污染点 | done | 本文件 §5 |
| 选择 observation truth 主线划分,不按 schema、产品或实现模块划分 | done | 本文件 §7 |
| 输出子域 / 上下文划分表、上下文关系图、本地影子边界、统一语言、单上下文停审和跨上下文审计 | done | 本文件 §8 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 05 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 本仓内部有哪些子域或本地上下文?

`L4-observability` 的内部语义结构围绕“观察面真相如何安全进入、如何关联表达、如何审计交接、如何留存且不反写”展开,分为三层:

| 层级 | 上下文 |
|---|---|
| 核心子域 | `观测材料准入与安全处置核心`;`关联语境与安全信号核心`;`审计投影与 body-free 证据关联核心`;`报告交接与证据真实性核心`;`留存重建与 no-write 防线核心` |
| 支撑子域 | `只读查询与诊断消费上下文`;`缺口降级表达上下文`;`外围消费与导出上下文`;`产品中立适配边界上下文`;`派生维护与重放协调上下文` |
| 本地索引 / 投影 / 引用 | `source owner / bus material 引用`;`identity actor / subject 引用`;`governance / artifact / evidence 引用`;`runtime / sandbox 来源摘要`;`安全观察投影 / rollup / 诊断摘要`;`archive / report / external audit 交接引用`;`外部产品候选能力引用` |

### 4.2 哪些是核心子域?

核心子域必须直接承载 `C-OBS-1~C-OBS-5` 的 observation truth 主线,缺少任一项都会让本仓退化为本地日志、dashboard、外部 APM 配置或会反写真相的诊断工具:

| 核心子域 | 判断 |
|---|---|
| `观测材料准入与安全处置核心` | 承载材料进入观察语境前的来源、准入、安全处置、redaction / safety marker 和 accepted / rejected / quarantined / degraded 语义。 |
| `关联语境与安全信号核心` | 承载 correlation、source attribution、安全日志、指标、追踪和观察输出可解释语义,但不拥有 execution truth。 |
| `审计投影与 body-free 证据关联核心` | 承载只读审计投影、证据关联成立 / 缺失 / 不可见、digest 线索和审计消费目的语义,但不保存正文。 |
| `报告交接与证据真实性核心` | 承载 report handoff、evidence index input、脱敏状态、缺口说明和真实性提示语义,但不生成 final verdict、真实 run 或 signoff。 |
| `留存重建与 no-write 防线核心` | 承载 retention marker、active reference protection、rebuild / replay 范围和 no-write violation 语义,但不修复 source truth。 |

这些核心子域是语义边界,不是对象清单。`log`、`metric`、`trace`、`audit projection`、`evidence link`、`report handoff` 和 `retention marker` 等名称线索后续可在概要 / 详细设计中展开,但 Step 05 只固定它们所属的内部语义边界。

### 4.3 哪些是支撑子域?

支撑子域围绕核心 observation truth 存在,负责消费、降级、外围输出、外部能力适配和派生维护,但不是中心 truth 本体:

| 支撑子域 | 判断 |
|---|---|
| `只读查询与诊断消费上下文` | 支撑人类和系统消费者只读查看安全观察面、诊断摘要和缺口线索,但不得写源或下发控制命令。 |
| `缺口降级表达上下文` | 支撑 missing、degraded、blocked、not-visible、unsafe output 和 source gap 的统一表达,防止消费方补造事实。 |
| `外围消费与导出上下文` | 支撑 dashboard、alert、management report、external audit / GRC、anomaly analysis 和长期分析等外围消费,但不得成为 truth source。 |
| `产品中立适配边界上下文` | 支撑后续采集、存储、展示、导出或外部 APM 候选能力接入的语义边界,但当前不绑定具名产品。 |
| `派生维护与重放协调上下文` | 支撑 projection rebuild、replay、gap scan、rollup rebuild 和维护结果解释,但不得修复、删除、覆盖或反写 source truth。 |

### 4.4 哪些只是外部上下文的本地索引 / 投影 / 引用?

以下结构只能作为本地影子层存在:

| 本地影子结构 | 边界 |
|---|---|
| `source owner / bus material 引用` | 只保存 source owner、bus material、payload carrier 或 source event 的安全引用 / 摘要,不拥有 source truth 或 bus 主干 truth。 |
| `identity actor / subject 引用` | 只保存 actor / subject safe ref、身份审计语境和责任主体摘要,不拥有 member / role 生命周期。 |
| `governance / artifact / evidence 引用` | 只保存 governance、artifact、evidence、baseline 或完整性线索的 ref / safe summary,不拥有治理结论、制品正文或证据正文。 |
| `runtime / sandbox 来源摘要` | 只保存 runtime / sandbox 观察来源、安全摘要和缺口语境,不拥有 execution truth、sandbox control truth 或 tool result body。 |
| `安全观察投影 / rollup / 诊断摘要` | 只从 observation truth 派生,服务查询、诊断、报告和外围消费,不得成为 source truth 或 execution truth。 |
| `archive / report / external audit 交接引用` | 只保存归档、报告、验收或外部审计消费的交接引用和状态,不拥有 archive package、final verdict 或 signoff。 |
| `外部产品候选能力引用` | 只保留产品中立外部能力的候选接入语境,不拥有 OTel、Prometheus、Grafana、TimescaleDB、对象存储或 APM 配置 truth。 |

### 4.5 它们之间的上下文映射关系是什么?

`观测材料准入与安全处置核心` 是 observation truth 的入口;`关联语境与安全信号核心` 在入口成立后统一表达 source attribution、correlation 和安全信号;`审计投影与 body-free 证据关联核心` 消费已安全表达的材料形成只读审计和证据线索;`报告交接与证据真实性核心` 基于审计投影、证据线索和观察缺口形成只读交接;`留存重建与 no-write 防线核心` 横切约束前述所有核心语义的生命周期、重建和反写风险。

支撑子域围绕核心子域工作:只读查询与诊断消费安全观察面,缺口降级表达统一失败和不可见口径,外围消费与导出只读消费安全摘要,产品中立适配边界为后续技术接入留出替换空间,派生维护与重放协调只影响观察面和派生投影。本地影子层只提供外部引用、摘要、投影和交接入口,不能反向定义任何核心 observation truth。

### 4.6 为什么这些部分不能混成一个上下文?

这些部分不能混成一个上下文,因为它们的真相角色、变化生命周期和反写风险不同:

| 不能混合的部分 | 原因 |
|---|---|
| 观测材料准入与 source truth 写入 | 准入只说明材料能否进入观察语境,不说明业务事实已写入、修复或裁决。 |
| Redaction / safety marker 与 raw body | 安全标记是观察面事实,不能成为保存 raw body、secret 或 full sensitive ref 的理由。 |
| Correlation / signal 与 runtime execution truth | trace、metric、log 只表达安全观察面,不能裁决执行成功、sandbox 状态或业务结果。 |
| Audit projection 与 Governance / source audit truth | 审计投影是只读观察面,不能替代治理裁决、source audit 正文或 Artifact lineage。 |
| Evidence linkage 与 evidence / artifact body | body-free 关联只保存线索、摘要和缺口,不能拥有证据正文或制品正文。 |
| Report handoff 与真实验收证据 | 交接材料只能说明线索、脱敏状态和缺口,不能生成真实 run、evidence alias、final verdict 或 signoff。 |
| Retention marker 与 archive package | 留存标记约束观察材料生命周期,不拥有归档包、恢复正文或长期正文保存。 |
| Rebuild / replay 与 source truth repair | 重放 / 重建只影响观察面和派生投影,不能修复、删除、覆盖或反写外部 truth。 |
| Dashboard / alert / GRC export 与 observation truth | 派生展示和外部导出可滞后、重建或失败,不能成为本仓或外部业务写源。 |
| 外部产品适配与核心语义 | OTel、Prometheus、Grafana、TimescaleDB、对象存储或 APM 是后续候选能力,不是子域 truth owner。 |

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `01_arch_step_05_bounded_context.md` 以 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection` 等 schema 名称收束 | 这是概要 / 详细设计对象线索,不是限界上下文或子域划分。 | 全部降级为 historical material,本步按内部语义结构重写。 |
| 旧 README 把 OTel、Prometheus、Grafana、TimescaleDB、对象存储写得像主结构 | 具名产品和存储是技术 / 配置候选,不是核心子域。 | 放入产品中立适配边界和外部产品候选引用,后续 Step 10 / 配置再判断。 |
| 旧正式 `01-架构设计.md` 混写职责、上下文、产品、schema、数据和性能 | 子域会被旧实现方案污染,导致 Step 05 变成模块 / 产品 / schema 清单。 | Step 16 前不继承旧正式正文,只作为 historical material。 |
| 旧产物缺少本地影子层边界 | 容易把 identity、governance、artifact、evidence、runtime、sandbox、archive 或 external GRC 的引用写成核心 truth。 | 单列本地索引 / 投影 / 引用层,并写明禁止反向定义核心 truth。 |
| 旧产物缺少单上下文停审和跨上下文审计 | 后续 Step 06~09 容易把支撑上下文或本地投影误作核心子域。 | 本步补充 §8.5 和 §8.6,明确每个上下文停审与跨上下文审计结果。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 核心子域 | log / metric / trace / audit event schema 名称 | 准入安全、关联信号、审计证据、报告真实性、留存 no-write 五个核心语义 | 对齐 C-OBS-1~5 和 observation truth 主线。 |
| 支撑上下文 | 未区分,或混在功能 / 产品线索中 | 只读诊断、缺口降级、外围消费、产品中立适配、派生维护重放 | 承接查询、报告、外围增强和维护能力,但不让它们成为 source truth。 |
| 本地影子层 | 未集中区分 ref、snapshot、projection、handoff | 单列 source/bus、identity、governance/artifact/evidence、runtime/sandbox、projection、archive/report/external audit、外部产品候选 | 防止外部 truth 或派生材料反写核心。 |
| 技术产品 | 旧产品栈容易成为架构主结构 | 产品中立能力仅作为支撑 / 本地候选引用 | 保持外部产品不成为 truth source。 |
| report / evidence | 容易与真实 evidence / verdict 混层 | 单独形成 `报告交接与证据真实性核心` | 防止设计阶段伪造真实证据和验收结论。 |
| retention / replay | 旧内容偏存储 / 冷存 / hash chain | 单独形成 `留存重建与 no-write 防线核心` | 强化活动引用保护、重建边界和 no-write guard。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用 log / metric / trace / audit / evidence / retention schema 名称划分 | 看似贴近落码对象。 | 退化为对象清单,跳过数据所有权和概要设计,且旧 schema 会提前硬化。 | 不采用。 |
| 方案 B: 按 C-OBS-1~5 的 observation truth 主线划分核心子域,再补支撑上下文和本地影子层 | 可追溯、边界清楚,能支撑后续可落码设计。 | 文档更长,后续概要需继续展开对象。 | 采用。 |
| 方案 C: 单一 `Observation Truth` 核心子域 | 最简洁。 | 无法区分准入、信号、审计证据、交接真实性、留存 no-write 的不同生命周期和风险。 | 不采用为主结构。 |
| 方案 D: 把 dashboard、alert、GRC、anomaly 都列为核心子域 | 覆盖外围增强。 | 会把外围消费能力误读为核心 observation truth。 | 不采用,放入支撑子域和本地投影层。 |
| 方案 E: 把 OTel / Prometheus / Grafana / TimescaleDB 作为支撑子域名 | 接近旧实现想象。 | 会把产品选型提前固化,并让外部产品像 truth owner。 | 不采用。 |

### 7.1 待确认问题的方案选择

#### 安全日志 / 指标 / 追踪是否分别作为核心子域?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 分别列为 `日志核心`、`指标核心`、`追踪核心`。 | 会按信号类型切割语义,弱化 correlation、redaction 和 no-write 的横切一致性。 |
| 方案 B | 收入 `关联语境与安全信号核心`。 | 保持 log / metric / trace 共享同一安全关联语义,字段后续再定。 |

推荐方案 B。

#### Report handoff 是否只是支撑子域?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为只读消费支撑上下文的一部分。 | 容易弱化 evidence authenticity、handoff fact 和不伪造证据边界。 |
| 方案 B | 作为 `报告交接与证据真实性核心`。 | 明确交接事实和真实性提示是本仓观察面真相,同时禁止 final verdict。 |

推荐方案 B。

#### External APM / storage / dashboard 是否进入内部语义结构?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 作为正式支撑子域或本地上下文。 | 会把外部产品选型和配置提前固化。 |
| 方案 B | 只作为 `产品中立适配边界上下文` 和 `外部产品候选能力引用`。 | 保留后续适配空间,不让产品成为 truth source。 |

推荐方案 B。

---

## 8. 结构化中间产物

### 8.1 子域 / 上下文划分表

| 名称 | 类型 | 作用 | 与其他部分的关系 |
|---|---|---|---|
| 观测材料准入与安全处置核心 | 核心子域 | 承载材料进入观察语境前的来源、准入、安全处置和 redaction 语义。 | 是 observation truth 的入口,其他核心子域只能消费已安全收束的材料语境。 |
| 关联语境与安全信号核心 | 核心子域 | 承载 correlation、source attribution、安全日志、指标、追踪和观察输出可解释语义。 | 依附于准入安全核心,为审计投影、诊断和交接提供统一关联语境。 |
| 审计投影与 body-free 证据关联核心 | 核心子域 | 承载只读审计投影和不保存正文的证据关联语义。 | 消费准入安全和关联信号核心,不拥有 Governance、Artifact、Identity 或 source audit truth。 |
| 报告交接与证据真实性核心 | 核心子域 | 承载 report handoff、evidence index input、缺口说明和真实性提示语义。 | 消费审计证据和缺口降级语境,不得生成 final verdict、真实 run 或 signoff。 |
| 留存重建与 no-write 防线核心 | 核心子域 | 承载 retention marker、活动引用保护、重放 / 重建范围和 no-write violation 语义。 | 横切约束所有核心子域和派生维护,不得修复、删除、覆盖或反写 source truth。 |
| 只读查询与诊断消费上下文 | 支撑子域 | 承载安全观察面、诊断摘要和缺口线索被只读消费的语义。 | 消费关联信号、审计证据和报告交接核心,不得写源或下发控制命令。 |
| 缺口降级表达上下文 | 支撑子域 | 承载 missing、degraded、blocked、not-visible 和 unsafe output 的统一表达语义。 | 横切支撑所有核心子域,防止空结果或默认成功补造事实。 |
| 外围消费与导出上下文 | 支撑子域 | 承载 dashboard、alert、GRC 导出、管理报表和 anomaly analysis 的只读消费语义。 | 只消费安全摘要、引用和投影,不得成为 observation truth 或 source truth。 |
| 产品中立适配边界上下文 | 支撑子域 | 承载后续采集、存储、展示和导出候选能力的接入边界语义。 | 支撑准入安全和外围消费,但不绑定具名产品或外部产品配置 truth。 |
| 派生维护与重放协调上下文 | 支撑子域 | 承载 projection rebuild、replay、gap scan、rollup rebuild 和维护结果解释语义。 | 依附留存 no-write 核心,只影响观察面和派生投影。 |
| source owner / bus material 引用 | 本地索引 / 投影 / 引用 | 为 source owner、bus material、payload carrier 或 source event 提供安全引用。 | 服务准入安全和关联信号核心,不拥有 source truth 或 bus 主干 truth。 |
| identity actor / subject 引用 | 本地索引 / 投影 / 引用 | 为责任主体、身份审计语境和 actor / subject safe ref 提供引用。 | 服务审计投影和报告真实性核心,不拥有 identity truth。 |
| governance / artifact / evidence 引用 | 本地索引 / 投影 / 引用 | 为治理、制品、证据、baseline 和完整性线索提供 body-free 引用。 | 服务审计证据和报告交接核心,不保存治理结论、制品正文或证据正文。 |
| runtime / sandbox 来源摘要 | 本地索引 / 投影 / 引用 | 为运行和 sandbox 观察来源、环境语境和缺口提供安全摘要。 | 服务关联信号和诊断消费上下文,不拥有 execution truth 或 sandbox control truth。 |
| 安全观察投影 / rollup / 诊断摘要 | 本地索引 / 投影 / 引用 | 为查询、诊断、报告和外围消费提供可重建派生结构。 | 服务只读消费、外围导出和派生维护,不得成为 source truth。 |
| archive / report / external audit 交接引用 | 本地索引 / 投影 / 引用 | 为归档、报告、验收和外部审计消费保留交接引用和状态。 | 服务报告真实性和留存 no-write 核心,不拥有 archive package、verdict 或 signoff。 |
| 外部产品候选能力引用 | 本地索引 / 投影 / 引用 | 为外部采集、存储、展示、导出或 APM 候选能力保留产品中立引用。 | 服务产品中立适配上下文,不拥有外部产品配置 truth。 |

### 8.2 上下文关系图

```text
+---------------------------+   +---------------------------+
| 观测材料准入与安全处置核心  |-->| 关联语境与安全信号核心      |
+-------------+-------------+   +-------------+-------------+
              |                               |
              v                               v
+---------------------------+   +---------------------------+
| 审计投影与 body-free       |-->| 报告交接与证据真实性核心    |
| 证据关联核心               |   +-------------+-------------+
+-------------+-------------+                 |
              |                               |
              +---------------+---------------+
                              |
                              v
                 +---------------------------+
                 | 留存重建与 no-write 防线核心 |
                 +-------------+-------------+
                               |
                               v
+-----------------------------------------------------------+
|                         支撑子域层                         |
| 只读查询诊断 | 缺口降级表达 | 外围消费导出 | 产品中立适配 | 派生维护重放 |
+-----------------------------------------------------------+
                               |
                               v
+-----------------------------------------------------------+
|                  本地索引 / 投影 / 引用层                  |
| source/bus 引用 | identity 引用 | governance/artifact/evidence 引用 |
| runtime/sandbox 摘要 | 观察投影/rollup/诊断摘要 | archive/report 引用 |
| 外部产品候选能力引用                                         |
+-----------------------------------------------------------+
```

该图只表达 `L4-observability` 内部语义结构,不表达外部仓、接口、事件、数据库、容器、代码模块、产品栈或运行顺序。

图示说明:

- 五个核心子域共同构成 observation truth 主线,但分别承载准入安全、关联信号、审计证据、报告真实性和留存 no-write 五类不同生命周期。
- `留存重建与 no-write 防线核心` 横切约束前序核心子域,防止重放、清理、查询或交接反写外部 truth。
- 支撑子域只能消费、派生、导出或维护核心 truth,不能独立生成第二份 observation truth。
- 本地索引 / 投影 / 引用层只提供 ref、safe summary、projection 和 handoff 结构,不得反向定义核心子域。

### 8.3 本地索引 / 投影 / 引用边界结论

| 本地结构 | 允许做什么 | 禁止做什么 |
|---|---|---|
| source owner / bus material 引用 | 保存 source owner、bus material、payload carrier 和 source event 的安全 ref 或摘要。 | 不拥有 source business truth、bus publish / ack / retry / replay 主干或业务 payload 正文。 |
| identity actor / subject 引用 | 保存 actor / subject safe ref、身份审计语境和责任主体摘要。 | 不保存 member lifecycle、role lifecycle、认证授权 truth 或身份正文。 |
| governance / artifact / evidence 引用 | 保存 governance、artifact、evidence、baseline、完整性线索和 body-free 证据引用。 | 不保存 governance decision body、artifact body、evidence body 或 Artifact lineage truth。 |
| runtime / sandbox 来源摘要 | 保存运行 / sandbox 观察来源、安全摘要、环境语境和缺口说明。 | 不拥有 execution truth、sandbox control truth、tool result body、provider response body 或 raw runtime body。 |
| 安全观察投影 / rollup / 诊断摘要 | 支撑查询、诊断、报告、外围消费、对账和重建解释。 | 不作为业务 truth、execution truth、治理裁决或 source audit truth 写源。 |
| archive / report / external audit 交接引用 | 关联 retention、archive eligibility、report handoff、external audit / GRC 和验收准备语境。 | 不拥有 archive package、recovery body、真实 run_id、真实 evidence alias、final verdict 或 signoff。 |
| 外部产品候选能力引用 | 保存产品中立采集、存储、展示、导出和 APM 候选能力的接入语境。 | 不把 OTel、Prometheus、Grafana、TimescaleDB、对象存储、APM 或 GRC 配置写成 truth source。 |

### 8.4 统一语言词汇结论

| 术语 | 定义 | 所属上下文 |
|---|---|---|
| Observation material | 经来源、关联和安全语境收束后进入本仓观察面处理的材料。 | 观测材料准入与安全处置核心 |
| Safety marker | 表达材料是否安全、是否脱敏、是否拒绝或隔离的观察面标记。 | 观测材料准入与安全处置核心 |
| Correlation context | 说明 observation material 与 trace、causation、source ref、actor / subject 或业务安全引用之间关系的语境。 | 关联语境与安全信号核心 |
| Safe signal | 已安全表达的 log、metric、trace 或 observation summary,不等于 execution truth。 | 关联语境与安全信号核心 |
| Audit projection | 从安全观察材料形成的只读审计投影,不替代 source audit 或 Governance truth。 | 审计投影与 body-free 证据关联核心 |
| Body-free evidence linkage | 不保存 evidence / artifact body 的证据引用、摘要、digest 线索、缺口和消费目的。 | 审计投影与 body-free 证据关联核心 |
| Report handoff | 向报告、归档准备或验收审查交接观察材料线索、脱敏状态和缺口说明的事实。 | 报告交接与证据真实性核心 |
| Authenticity hint | 区分真实执行证据、待补齐材料和设计期占位的观察面提示。 | 报告交接与证据真实性核心 |
| Retention marker | 表达观察材料 hold、release、conflict、archive eligibility 或活动引用保护的生命周期标记。 | 留存重建与 no-write 防线核心 |
| No-write violation | 查询、诊断、维护、重建或报告交接试图写入 source truth 的违例事实。 | 留存重建与 no-write 防线核心 |
| Gap / degraded / not-visible | 材料缺失、不可见、不可安全输出、来源不完整或消费阻塞时的显式状态。 | 缺口降级表达上下文 |
| Derived observation projection | 从核心 observation truth 派生的查询、rollup、诊断、报告或外围消费结构。 | 安全观察投影 / rollup / 诊断摘要 |
| Local reference / projection | 为稳定消费、判断、追溯和降级保留的 ref、safe summary、projection 或 handoff 结构。 | 本地索引 / 投影 / 引用层 |

### 8.5 单上下文停审记录

| 上下文 | 分类是否正确 | 职责是否清楚 | 与系统上下文是否一致 | 是否误写实现结构 |
|---|---|---|---|---|
| 观测材料准入与安全处置核心 | pass | pass | pass | pass |
| 关联语境与安全信号核心 | pass | pass | pass | pass |
| 审计投影与 body-free 证据关联核心 | pass | pass | pass | pass |
| 报告交接与证据真实性核心 | pass | pass | pass | pass |
| 留存重建与 no-write 防线核心 | pass | pass | pass | pass |
| 只读查询与诊断消费上下文 | pass | pass | pass | pass |
| 缺口降级表达上下文 | pass | pass | pass | pass |
| 外围消费与导出上下文 | pass | pass | pass | pass |
| 产品中立适配边界上下文 | pass | pass | pass | pass |
| 派生维护与重放协调上下文 | pass | pass | pass | pass |
| 本地索引 / 投影 / 引用层 | pass | pass | pass | pass |

### 8.6 跨上下文语义边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在职责重叠 | pass | 查询诊断、外围消费和派生维护只消费或派生核心 truth,不拥有准入、审计、交接或留存本体。 |
| 是否存在核心子域误归类 | pass | Dashboard、alert、GRC、external APM、OTel、Prometheus、Grafana、TimescaleDB、对象存储未提升为核心子域。 |
| 是否存在本地投影误作真相 | pass | 安全观察投影、rollup、诊断摘要、report summary 和外围导出已明确不得成为 source truth。 |
| 是否存在统一语言冲突 | pass | Observation material、safe signal、audit projection、evidence linkage、report handoff、retention marker 均有唯一所属上下文。 |
| 是否存在外部上下文误入内部图 | pass | identity、governance、artifact、runtime、sandbox、archive、SDK、console 和 external consumers 只在本地引用或消费边界中出现。 |
| 是否存在实现结构混入 | pass | 未写 service、repository、worker、database、adapter、API、event、DTO、schema 字段或 storage backend。 |
| 是否存在真实性边界冲突 | pass | report handoff 和 authenticity hint 已明确不生成真实 run、evidence alias、verdict 或 signoff。 |
| 是否存在 no-write 边界冲突 | pass | rebuild、replay、query、diagnostic、report assembly 和 export 均被限制为观察面 / 派生投影范围。 |

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 6. 限界上下文与子域划分

> 校准来源:
> - `design-calibration/01_arch_step_05_bounded_context.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“跨上下文语义边界审计表”小节,了解本章如何从职责边界、系统上下文和数据归属收敛出内部语义结构。

### 6.1 子域 / 上下文划分表

摘录 `design-calibration/01_arch_step_05_bounded_context.md` §8.1。

### 6.2 上下文关系图

摘录 `design-calibration/01_arch_step_05_bounded_context.md` §8.2。

### 6.3 本地索引 / 投影 / 引用边界结论

摘录 `design-calibration/01_arch_step_05_bounded_context.md` §8.3。

### 6.4 统一语言词汇结论

摘录 `design-calibration/01_arch_step_05_bounded_context.md` §8.4。
```

---

## 10. 待确认事项

本步不新增阻塞 Step 06 的待确认事项。下列事项进入后续 Step,不得在 Step 05 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|
| `Q-OBS-ARCH-005-001` | log / metric / trace / audit projection / evidence linkage 的正式对象、字段和状态枚举 | 后续数据所有权、概要和详细设计收敛;当前只固定上下文归属。 |
| `Q-OBS-ARCH-005-002` | redaction、safety marker、accepted / rejected / quarantined 的策略和配置承载方式 | 后续横切关注点、配置、测试和验收收敛;当前只固定安全处置核心语义。 |
| `Q-OBS-ARCH-005-003` | digest、hash linkage、canonicalization、gap scan 和完整性提示算法 | 后续技术选型、详细设计和测试收敛;当前只固定 body-free 和缺口语义。 |
| `Q-OBS-ARCH-005-004` | report handoff、evidence index input、authenticity hint 的正式交接格式 | 后续关键交互、详细设计、测试、验收和实施计划收敛;当前只固定只读交接和真实性边界。 |
| `Q-OBS-ARCH-005-005` | retention days、legal hold、archive eligibility、active reference protection 的配置细则 | 后续配置、测试、验收和实施计划收敛;当前只固定留存 no-write 语义。 |
| `Q-OBS-ARCH-005-006` | OTel、Prometheus、Grafana、TimescaleDB、对象存储、外部 APM、GRC 或 alert sink 是否进入技术主线 | 后续 Step 10、配置和测试阶段收敛;当前只作为产品中立候选能力。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓内部语义结构层次 | pass | §8.1 已区分核心、支撑和本地影子层。 |
| 是否区分核心子域、支撑子域和本地索引 / 投影 / 引用 | pass | 五个核心子域、五个支撑子域和七类本地影子结构已分层。 |
| 是否通过关系图解释这些部分如何共同构成整体 | pass | §8.2 已给出上下文关系图和说明。 |
| 每个上下文是否完成停审 | pass | §8.5 已逐项通过分类、职责、系统上下文一致性和实现混入检查。 |
| 跨上下文语义边界审计是否存在 unresolved 冲突 | pass | §8.6 未发现职责重叠、误归类、投影反写真相、术语冲突、真实性冲突或 no-write 冲突。 |
| 是否把对象清单、代码模块或数据实现写成子域结构 | pass | 未写字段、表、repository、handler、adapter、API、event、DTO、数据库、存储产品或部署。 |
| 是否把外部产品写成 truth source | pass | 外部产品只作为产品中立候选能力引用,不进入核心子域。 |
| 是否伪造实现 commit、run_id、evidence alias、验收签署或测试结果 | pass | 未写入任何真实实现或验收证据。 |
| gate_status | pass | 当前 Step 05 已完成。 |
| next_allowed_action | wait_user_confirmation_before_step_06 | 必须等待用户确认后才允许进入 Step 06 `容器 / 部署架构`。 |

当前 Step 05 `限界上下文与子域划分` 已完成。下一步必须等待用户确认后进入 Step 06 `容器 / 部署架构`,并只创建 / 改写 `design-calibration/01_arch_step_06_container_deployment.md`。
