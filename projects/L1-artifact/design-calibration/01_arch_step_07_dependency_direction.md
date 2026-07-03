# Step 7. 依赖方向与层间约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 7
> 回填章节: `01-架构设计.md` §8 依赖方向与层间约束
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-artifact` 内部有哪些正式架构责任层 / 依赖角色,这些角色之间允许怎样依赖,哪些外部能力必须通过正式边界进入,以及跨仓关系应如何从全局依赖基线中裁剪。

本步只讨论依赖方向和层间规则,不重写限界上下文、容器部署、接口协议、数据库细节、代码目录、handler / service / repository 调用链、事件字段、部署产品或技术选型。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `design-calibration/01_arch_step_04_system_context.md` | 已完成 | 提供正式上下文对象、输入 / 输出面和降级口径。 |
| `design-calibration/01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 提供核心子域、支撑上下文和本地索引 / 投影 / 引用层。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 提供同步入口、异步输入、后台维护、真相承载、派生承载和外部正文边界运行角色。 |
| `projects/L1-artifact/00-需求文档.md` §6 / §12 | 已重建 | 提供需求层仓际依赖裁剪、能力级接口面和外部依赖边界。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 提供全局依赖类型、裁剪表和 ASCII 图格式。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 7 | 已读取 | 控制本步必须输出依赖规则、裁剪表、分类表、禁止依赖表和停审记录。 |
| `standards/document/架构设计书写规范.md` §4.8 | 已读取 | 控制依赖方向图、层间约束表和跨仓依赖裁剪写法。 |
| 旧 `projects/L1-artifact/01-架构设计.md` §7 | 旧 Draft | 作为旧依赖方向、代码层、技术承载混写问题诊断输入。 |
| `projects/L1-governance/design-calibration/01_arch_step_07_dependency_direction.md` | 已参考 | 只参考“责任层 + 跨仓裁剪 + 禁止依赖”的组织方式,不复制治理仓结论。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 5、Step 6、SOP Step 7 和书写规范 4.8 | done | 本文件 §2 |
| 读取全局依赖裁剪规则、需求层依赖章节和旧架构 §7 | done | 本文件 §2 / §5 |
| 回答内部层次、允许依赖、禁止依赖、外部接入、跨仓裁剪和倒置边界问题 | done | 本文件 §4 |
| 输出依赖方向图、层间约束表、依赖倒置结论、三张跨仓裁剪表和裁剪图 | done | 本文件 §8 |
| 完成架构单元停审和跨依赖边界审计 | done | 本文件 §8.9 / §8.10 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 7 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 本仓内部层次如何划分?

本章中的“层次”不是代码目录、crate、模块、服务进程或运行容器,而是架构责任层 / 依赖角色。`L1-artifact` 收敛为五类依赖角色:

- `Artifact 核心语义角色`:承载 Artifact fact、version、lineage、baseline、consumption backref 和 truth / derived / external body 边界判断。
- `Artifact 编排 / 承接角色`:承接同步变更、查询、异步输入、自动化产出收束、审查 / 责任语境、维护、派生和交接触发,并把外部输入转换为核心可接受的引用、摘要、正式变化或派生材料。
- `外部能力接缝角色`:承接 work、process、governance、method-library、runtime、capability、conversation、workspace、archive、observability、SDK、console、sync 和 bus 等外部能力边界。
- `派生消费辅助角色`:承接搜索、预览、projection、报告、对账、归档准备、观测解释、同步交接和消费依据说明,只能从 Artifact truth 派生。
- `技术承载角色`:承载真相存储、派生承载、外部正文来源对接、事件协作、运行支撑和交接支撑,但不拥有 Artifact 语义定义权。

### 4.2 允许哪些依赖方向?

允许的依赖方向是外层依赖内层、接缝依赖正式边界、派生依赖核心真相、技术承载服从正式承载契约。核心语义角色只允许依赖 `L0-core` 级共享契约和本仓内部 Artifact 规则,不得依赖下游消费方、外部来源仓源码、事件主题、数据库产品、内容后端、hash worker、search index、projection、archive package、observability store 或 sync 私有副本。

### 4.3 禁止哪些反向依赖?

禁止 work lifecycle、process execution、governance decision、method definition、runtime trace、capability result、conversation display、workspace view、archive package、observability audit store、SDK / console / sync 体验、外部正文来源或技术设施反向定义 Artifact truth。也禁止把 `L1-governance`、`L1-work`、`L1-process`、`L1-conversation`、`L1-workspace`、`L4-archive`、`L4-observability`、`L0-sdk`、`L5-console`、`L5-sync`、`L1-identity`、`L3-method-library`、`L2-runtime`、`L3-capability-hub`、`L0-bus` 或外部内容 / 检索 / 审计系统写成 `L1-artifact` 的编译期源码依赖。

### 4.4 外部系统通过哪些正式边界接入?

外部能力必须通过 `外部能力接缝角色` 进入,并由 `Artifact 编排 / 承接角色` 转换为核心语义可接受的 work / process / governance / method / runtime / capability 引用、safe summary、definition source、自动化来源摘要、外部正文引用、正式变化、消费回指、派生材料或交接材料。

任何外部对象都不能直接写 `Artifact 核心语义角色`,也不能绕过核心真相把数据放入搜索、预览、projection、报告、归档、观测或同步材料后再反写真相。

### 4.5 本仓在全局依赖基线中涉及哪些跨仓依赖边?

本仓直接涉及:

- `L0-core`:唯一编译期依赖。
- `L0-bus`:事件协作主干。
- `L1-governance`:治理引用、evidence boundary、AIIA / SoA / baseline 语境和治理消费协作。
- `L1-work`:工作产出、项目 / 工作项引用、基线关联和 Artifact 消费协作。
- `L1-process`:过程产出、activity 语境和 Artifact version / lineage 消费协作。
- `L3-method-library`:Artifact kind、WorkProductDefinition、方法 / 标准定义来源。
- `L2-runtime` / `L3-capability-hub`:自动化产出、工具结果、能力执行和运行来源线索。
- `L1-conversation` / `L1-workspace`:Artifact 只读消费、预览、工作台聚合和显化协作。
- `L4-observability` / `L4-archive`:血缘、完整性、审计线索、归档消费和恢复交接协作。
- `L0-sdk` / `L5-console` / `L5-sync`:正式访问、管理、同步和消费入口。

`L5` 其他产品和 `L6` 生态项目不进入当前架构主链;它们通常应通过 `L0-sdk` 或正式产品 / 生态边界间接消费 Artifact 能力。

### 4.6 哪些依赖边进入本仓架构主链,哪些被裁剪出去?

进入主链的依赖边是与 Artifact fact、version、lineage、baseline、consumption backref、自动化产出收束、定义来源、治理 / 工作 / 过程语境、下游消费、追溯和归档准备相关的跨仓关系。被裁剪出去的是 PostgreSQL、Git、S3 / MinIO、URL、对象存储、search / browse index、向量库、外部审计平台、cold storage、content adapter、hash worker、outbox、通知 / webhook 和部署产品假设;它们可以作为后续技术选型、配置、演进或实施候选,但不进入跨仓依赖裁剪主链。

### 4.7 进入主链的跨仓依赖分别是什么类型?

`L0-core` 是唯一编译期依赖。`L0-bus` 是事件协作依赖。`L1-governance`、`L1-work`、`L1-process`、`L3-method-library`、`L2-runtime`、`L3-capability-hub` 是运行期 / 事件协作输入或协作边界。`L1-conversation`、`L1-workspace`、`L4-archive`、`L4-observability`、`L0-sdk`、`L5-console`、`L5-sync` 是运行期消费、事件协作或追溯交接边界。

这些运行期、事件协作和交接关系不得写成 package dependency,也不得被实现侧解释为可以直接引用相邻仓源码。

### 4.8 哪些依赖必须倒置?

治理语境、工作语境、过程语境、定义来源、自动化来源、能力来源、外部正文来源、对话 / 工作台显化、观测 / 归档 / 同步交接、事件协作、存储、投影、搜索、报告和内容后端都必须通过正式边界倒置到 `Artifact 编排 / 承接角色`、`外部能力接缝角色` 或 `技术承载角色`,不能让这些外部或技术对象直接进入核心语义。

核心语义只声明自己需要的引用、摘要、正式变化、真相边界、消费回指和追溯规则,外部适配和技术实现服从这些规则。

### 4.9 哪些规则若不先写清,后续实现最容易失控?

最容易失控的规则是:只有 `L0-core` 可进入编译期依赖;运行期和事件协作不能被写成源码依赖;外部正文 / 内容来源不能成为本仓 truth store;派生读侧不能反写核心;事件 / outbox / bus 不能承载 Artifact truth;work / process / governance / method / runtime / capability 只能提供引用、摘要或来源线索,不能成为 Artifact fact、version、lineage 或 baseline 的上游 truth。

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 依赖图写 `api -> application -> domain -> infra(Postgres / content adapters / hash worker / bus)` | 这是代码实现层和技术承载混图,不是架构依赖角色。 | 改为核心语义、编排承接、外部接缝、派生辅助、技术承载。 |
| `domain(Artifact / Baseline / DatasetArtifact)` | 把对象清单 / 旧聚合想象写成依赖层。 | 核心语义只表达 Artifact truth 边界,不写对象字段或聚合清单。 |
| `ContentStore` / `LineageReader` / `HashVerifier` | 实现接口点提前进入架构 Step 7。 | 本步只保留依赖倒置结论,不写实现接口名。 |
| `Postgres / content adapters / hash worker / bus` 直接作为依赖节点 | 提前固化技术产品、运行任务和事件实现。 | 改为技术承载角色、外部正文边界和事件协作边界。 |
| `hash worker 只读内容,不改业务元数据(除发 tampered 事件)` | 过早定义后台任务权限和事件语义,且 `tampered` 未在本轮需求层闭口为正式事件。 | 完整性候选检查后置,只保留不得反写 Artifact truth 的红线。 |
| `AIIA / SoA 双身份同步通过 application 用例` | 把治理 / 制品双身份、application 用例和跨仓同步机制提前写入。 | 改为 governance / artifact 通过引用、摘要和正式边界协作,不写同步实现。 |
| 依赖健康度用传入 / 传出耦合、抽象度评估 | 指标化但没有依赖裁剪表,不能指导后续源码依赖控制。 | 按全局依赖裁剪规则输出三张表和裁剪图。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 层次主语 | API / application / domain / infra | 架构责任层 / 依赖角色 | 本章讨论依赖保护,不是代码组织。 |
| 核心保护 | Artifact / Baseline / DatasetArtifact 和存储 / adapter / bus 混在一起 | 核心语义只被正式承接角色依赖,派生不得反写 | 防止第二 truth 和技术反向定义。 |
| 外部来源 | governance / work / process / method / runtime 可被看作直接依赖 | 外部来源只通过引用 / 摘要 / 正式边界进入 | 防止来源 truth 漂移。 |
| 下游消费 | conversation / workspace / archive / observability / sync 可反推核心 | 下游只能经正式边界消费或协作 | 防止消费需求统治 Artifact 模型。 |
| 技术机制 | PostgreSQL、content adapters、hash worker、bus 容易成为主依赖 | 技术和外部正文来源只能作为承载 / 接缝,不能定义核心 | 保持架构边界稳定。 |
| 跨仓依赖 | 未区分依赖类型 | `L0-core` 编译期,其他按运行期 / 事件协作 / 下游消费 / 追溯交接处理 | 防止实现阶段依赖失控。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按代码分层写 api / application / domain / infra | 对开发者熟悉。 | 会提前进入概要 / 详细设计,且无法表达跨仓依赖红线。 | 不采用。 |
| 方案 B: 按核心语义、编排承接、外部接缝、派生辅助、技术承载写依赖角色 | 能保护 Artifact truth,并承接 Step 5 / Step 6 结论。 | 后续仍需在概要设计映射到代码主体。 | 采用。 |
| 方案 C: 把所有上下游仓都画成直接依赖 | 看似完整。 | 会把运行期和事件协作误写为源码依赖。 | 不采用。 |
| 方案 D: 只写 `L0-core` 和 `L0-bus`,忽略 work / process / governance / method / runtime / consumers | 图更简单。 | 会遗漏定义来源、自动化来源和下游消费反写风险。 | 不采用。 |
| 方案 E: 把 content store / search / hash / archive / observability 放入当前依赖主链 | 贴近旧实现想象。 | 会把技术机制或外围增强变成 truth 来源。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| 核心语义能否直接依赖 work / process / governance / method-library / runtime 等仓源码 | A. 可以;B. 不可以,只能接收经边界转换后的 ref / summary / snapshot / result | B | 保护唯一编译期依赖和相邻 truth 边界。 |
| 是否把 content backend、hash verifier、search backend、external audit platform 放入当前依赖主链 | A. 放入;B. 不放入,仅作为后续技术或外围增强候选 | B | 当前核心是 Artifact truth,不是 storage / integrity / search 产品。 |
| 派生 search / projection / report / preview 是否可以反写 Artifact truth | A. 可以;B. 不可以,只能从 truth 派生 | B | 防止派生面成为第二制品事实。 |
| `L0-bus` 是否作为编译期依赖进入业务核心 | A. 是;B. 否,只作为事件协作依赖 | B | 对齐全局依赖裁剪规则,避免 event infra 定义核心语义。 |
| `L4-observability` / `L4-archive` / `L5-sync` 是否拥有 Artifact 追溯或同步 truth | A. 拥有;B. 不拥有,只消费或承接交接材料 | B | Artifact 拥有制品 truth;L4 / L5 负责横切存储、归档和同步能力。 |

---

## 8. 结构化中间产物

### 8.1 依赖方向图

```text
+====================================================================+
|                      L1-artifact 依赖边界                           |
|                                                                    |
|   +---------------------------+       +--------------------------+ |
|   | 外部能力接缝角色          |       | 技术承载角色             | |
|   | external capability seams |       | storage / event / body   | |
|   +-------------+-------------+       +-------------+------------+ |
|                 | 边界接入                          | 允许依赖    |
|                 v                                   v             |
|        +--------+-----------------------------------+------+      |
|        | Artifact 编排 / 承接角色                          |      |
|        | formal intake / version / lineage / maintain      |      |
|        +----------------------+----------------------------+      |
|                               | 允许依赖                          |
|                               v                                   |
|        +----------------------+----------------------------+      |
|        | Artifact 核心语义角色                               |      |
|        | fact / version / lineage / baseline truth          |      |
|        +----------------------+----------------------------+      |
|                               ^                                   |
|                               | 允许依赖                          |
|        +----------------------+----------------------------+      |
|        | 派生消费辅助角色                                   |      |
|        | search / preview / report / handoff                |      |
|        +---------------------------------------------------+      |
|                                                                    |
+====================================================================+
```

图示说明:

- 箭头只表示允许依赖或边界接入,不表示运行调用顺序、协议时序、事件传播顺序或代码调用链。
- `Artifact 核心语义角色` 是被保护的中心,外部来源、下游消费、技术承载和派生辅助都不能反向定义它。
- `派生消费辅助角色` 可以依赖核心 truth 和授权范围,但不得形成第二 truth。
- `技术承载角色` 只服从正式承载契约,不决定 Artifact 语义、状态流转或数据归属。

### 8.2 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| `Artifact 核心语义角色` | `L0-core` 共享契约和本仓内部 Artifact 规则 | 下游消费方、来源仓正文、外部内容后端、事件主题、数据库产品、hash worker、search index、projection、archive package、observability store、sync 私有副本 | 保护 Artifact fact、version、lineage、baseline 和 consumption backref truth 不被外部反向定义。 |
| `Artifact 编排 / 承接角色` | 核心语义角色、正式外部接缝、正式承载边界、派生规则 | 绕过核心直接写存储;把外部事实原文变成本仓 truth;把下游展示状态写入核心;把 report / projection / search 当业务写源 | 承接输入和消费,但必须把外部能力转换为核心允许的引用、摘要、正式变化或维护材料。 |
| `外部能力接缝角色` | 正式边界、编排 / 承接角色、必要的运行期协作对象 | 直接依赖核心存储结构;直接改变核心语义;越过授权范围输出事实;把运行期依赖写成源码依赖 | 外部能力只能通过受控接缝进入或消费,不能打穿核心。 |
| `派生消费辅助角色` | 核心语义角色、授权范围、正式派生规则和交接边界 | 生成新 Artifact truth;覆盖核心事实;绕过可见性或追溯规则向下游输出;把 search / report / sync 反写核心 | 查询视图、搜索、预览、报告、对账和归档准备都只是消费辅助,可重建且不得反写。 |
| `技术承载角色` | 核心定义的正式状态、派生规则和承载契约 | 决定业务状态、版本语义、血缘关系、基线成员、消费回指、外部正文归属或完整性结论含义 | 存储、事件、索引、缓存、任务调度、内容来源对接等技术选择只能支撑架构,不能定义架构。 |

### 8.3 依赖倒置结论

| 需要倒置的依赖 | 倒置方式 | 保护目标 |
|---|---|---|
| `L1-governance` 治理引用 / evidence / AIIA / SoA / gate 语境 | 核心只保存治理引用、safe summary、消费回指或 evidence boundary,解析与同步经正式接缝进入 | 防止治理裁决 truth、policy、approval 和 Gate 状态进入 Artifact |
| `L1-work` 项目 / 工作 / 产出语境 | project、work item、工作产出和 baseline 关联只作为引用、摘要或候选输入进入 | 防止 work lifecycle 反向定义 Artifact fact / baseline |
| `L1-process` activity / 过程产出语境 | process、activity、过程产出只作为来源引用、摘要或候选输入进入 | 防止 process execution truth 变成 Artifact truth |
| `L3-method-library` Artifact kind / WorkProductDefinition / method 来源 | 核心只保存定义来源引用、版本或 safe summary | 防止方法、标准和 artifact 类型定义正文转移给 Artifact |
| `L2-runtime` / `L3-capability-hub` 自动化来源 | runtime execution、tool result、capability result 和 model context 只以来源摘要 / marker / ref 进入 | 防止执行 truth 或工具结果替代 Artifact fact、version 或 lineage |
| `L1-conversation` / `L1-workspace` 显化与视图 | conversation context、workspace view、preview display 只作为消费回链或派生消费边界 | 防止展示状态或局部视图定义制品事实 |
| `L4-observability` 观测与审计 | trace、audit summary、integrity signal 只作为复核线索或追溯交接引用 | 防止 audit store / metric body 变成 Artifact truth |
| `L4-archive` 归档 / 恢复交接 | archive handoff 只消费 Artifact version、baseline、发布和封存语境 | 防止 archive package body 反向定义 baseline 或 version truth |
| `L0-sdk` / `L5-console` / `L5-sync` 入口体验 | 入口、管理和同步只通过正式能力边界进入 | 防止 SDK / UI / sync 私有状态成为 truth source |
| `L0-bus` 事件协作 | 事件协作通过正式发布 / 消费边界承接 | 防止 event topic / outbox / relay 机制定义核心语义 |
| 存储 / 内容后端 / 搜索 / 投影 / 缓存 / hash | 作为技术承载、内容来源接缝或外围增强实现,服从核心定义 | 防止技术产品、派生结果或外部正文来源成为 truth source |

### 8.4 按架构单元组织的依赖规则表

| 架构单元 | 允许依赖谁 | 禁止依赖谁 | 外部接入方式 | 停审结果 |
|---|---|---|---|---|
| `Artifact 核心语义角色` | `L0-core` 共享契约;本仓内部 Artifact 规则 | 任意相邻仓源码;运行期对象;事件主题;数据库 / 内容后端 / 搜索 / hash / archive / sync 产品 | 不直接接入外部;由编排 / 承接角色提供已收束输入 | pass |
| `Artifact 编排 / 承接角色` | 核心语义角色;外部能力接缝;技术承载契约;派生规则 | 绕过核心写 truth store;从派生材料反推核心;把外部正文原文变成 truth | 同步入口、异步输入、后台维护触发均经正式边界 | pass |
| `外部能力接缝角色` | 编排 / 承接角色;正式外部协作边界 | 核心存储结构;核心状态私有规则;相邻仓私有实现 | ref / summary / snapshot / signal / handoff | pass |
| `派生消费辅助角色` | 核心 truth;授权范围;派生规则;交接边界 | 新建 / 覆盖 / 冻结 Artifact truth;反写核心;绕过追溯边界输出 | search / preview / report / projection / archive / observability / sync 消费边界 | pass |
| `技术承载角色` | 正式承载契约;核心定义的状态和派生规则 | 业务状态定义权;数据归属定义权;外部正文生命周期;版本 / 血缘 / 基线语义 | storage、content source、event、cache、index、runtime support 作为实现候选后置 | pass |

### 8.5 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L1-artifact` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享 ID、typed ref、trace、error 和基础契约语义是 Artifact truth 跨仓表达前置。 |
| `L0-bus` | `L1-artifact` 通过 `L0-bus` 发布制品事件 | 协作方 | 事件协作 | 是 | Artifact 事实变化需要跨仓变化感知,但 bus 不承载正文、版本集合、血缘图或 baseline truth。 |
| `L1-governance` | `L1-artifact` 按需消费 governance 引用;governance 消费 artifact evidence boundary | 协作方 | 运行期 / 事件协作 | 是 | 治理引用、evidence、AIIA / SoA 和 baseline 语境需要协作,治理 truth 不归 Artifact。 |
| `L1-work` | `L1-artifact` 按需消费 work 引用;work 消费 artifact | 协作方 | 运行期 / 事件协作 | 是 | 工作产出、项目 / 工作项引用和 baseline 关联语境需要协作,work truth 不归 Artifact。 |
| `L1-process` | `L1-artifact` 按需消费 process 引用;process 消费 artifact | 协作方 | 运行期 / 事件协作 | 是 | 过程产出和 activity 语境可进入 Artifact 收束,process execution truth 不归 Artifact。 |
| `L3-method-library` | 全局矩阵未列为 artifact 直接依赖;需求 / 上下文确认其为定义来源 | 依赖方 | 运行期 | 是 | Artifact kind、WorkProductDefinition、方法 / 标准来源需要定义边界,但定义正文不归 Artifact。 |
| `L2-runtime` | 全局矩阵未列为 artifact 直接依赖;需求 / 上下文确认其为自动化来源线索 | 协作方 | 运行期 / 事件协作 | 是 | 自动化产出和工具结果可作为候选输入,但 runtime execution truth 不归 Artifact。 |
| `L3-capability-hub` | 全局矩阵未列为 artifact 直接依赖;需求 / 上下文确认其为能力来源线索 | 协作方 | 运行期 / 事件协作 | 是 | capability / tool 来源可作为来源摘要,但能力注册和工具适配 truth 不归 Artifact。 |
| `L1-conversation` | conversation 按需消费 artifact 能力边界 | 被依赖方 | 运行期 / 事件协作 | 是 | 对话可显化 Artifact 引用、版本、预览和追溯语境,但 conversation truth 不归 Artifact。 |
| `L1-workspace` | workspace 只读消费 L1 真相域查询 / 投影 | 被依赖方 | 运行期 / 事件协作 | 是 | 工作台消费 Artifact facts 的只读视图和聚合语境,workspace 视图不成为 truth。 |
| `L4-observability` | observability 消费 artifact 血缘、完整性和审计线索 | 被依赖方 / 协作方 | 事件协作 / 追溯交接 | 是 | 观测消费 Artifact lineage、完整性和审计线索,但不反写本仓事实。 |
| `L4-archive` | archive 消费 L1 domain snapshot / export 能力和归档事件 | 被依赖方 | 运行期 / 事件协作 / 追溯交接 | 是 | 归档消费 Artifact version、baseline、发布和封存事实,archive package 不替代 Artifact truth。 |
| `L0-sdk` | SDK 运行期封装 L1+ API | 被依赖方 | 运行期 | 是 | SDK 是默认访问和消费边界,不能反向定义 Artifact 核心。 |
| `L5-console` | console 经 SDK / 管理 API 消费 L1+ 管理能力 | 被依赖方 | 运行期 | 是 | console 是管理和查看入口,UI 操作体验不能定义 Artifact truth。 |
| `L5-sync` | sync 经 SDK 消费 workspace / archive / artifact | 被依赖方 | 运行期 | 是 | sync 可同步 Artifact facts 的安全回指,但本地副本不成为 truth。 |
| `L1-identity` | 需求层当前列为后续重裁剪,非直接主链 | 来源线索 | 运行期 / 事件协作 | 否 | 身份 / actor 可通过 governance、work、process 或入口语境间接出现;当前不设 Artifact 直接主链依赖。 |
| `L5-chat` / 其他 L5 产品 | 产品经 SDK 消费 conversation / workspace / governance / artifact | 被依赖方 | 运行期 | 否 | 当前 Artifact 架构主链不逐个展开产品仓,应经 SDK 或正式边界消费。 |
| `L6` 生态入口 | 生态经 SDK / public APIs 消费能力 | 被依赖方 | 运行期 / 事件协作 | 否 | 当前 Artifact 架构主链不直接依赖生态仓。 |
| PostgreSQL / Git / S3 / URL / search / vector / external audit / cold storage | 旧文档实现候选或外部技术线索 | 非正式外部依赖 | 运行期 | 否 | 属于后续技术选型、配置、演进或实施选择,不进入跨仓依赖主链。 |

### 8.6 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、typed ref、trace、error 和基础契约语义。 | 详细设计 / 实施计划 |
| 事件协作依赖 | `L0-bus`;`L1-governance`;`L1-work`;`L1-process`;`L2-runtime`;`L3-capability-hub`;`L1-conversation`;`L1-workspace`;`L4-observability`;`L4-archive` | 发布 / 消费 Artifact truth 变化、候选输入、消费回指、追溯交接、归档准备和观测解释信号。 | 架构设计 / 测试方案 / 验收标准 |
| 运行期依赖 | `L1-governance`;`L1-work`;`L1-process`;`L3-method-library`;`L2-runtime`;`L3-capability-hub`;`L4-archive` | 运行时消费治理、工作、过程、定义来源、自动化来源、能力来源和归档交接边界。 | 架构设计 / 详细设计 |
| 下游消费 / 运行期提供 | `L0-sdk`;`L1-conversation`;`L1-workspace`;`L5-console`;`L5-sync`;`L4-observability`;`L4-archive` | 向 SDK、对话显化、workspace、console、sync、观测审计和归档恢复提供 Artifact truth 能力、派生摘要或交接材料。 | 架构设计 / 实施计划 |
| 后续重裁剪来源线索 | `L1-identity` | 只在 actor、责任、审查、入口操作等语境中间接出现;当前不作为直接主链依赖。 | 后续概要 / 详细设计按场景确认 |

`L4-observability` 的双角色必须显式区分:完整性 / 审计 / trace 线索可以作为复核输入,Artifact lineage / integrity / audit material 可作为输出交接;两者都不意味着 Artifact 拥有物理观测存储。`L4-archive` 的双角色也必须区分:snapshot / export 读取是下游消费 / 运行期提供,handoff / 回链是事件协作 / 追溯交接。

### 8.7 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-artifact -> L1-governance` 编译期依赖 | 会把治理裁决、policy、approval 和 Gate truth 耦合进 Artifact | 使用治理引用、evidence boundary、safe summary、运行期 / 事件协作 |
| `L1-artifact -> L1-work` 编译期依赖 | 会把 Project / WorkItem / Iteration truth 引入制品仓 | 使用 WorkRef、ProjectRef、safe summary、事件或运行期能力边界 |
| `L1-artifact -> L1-process` 编译期依赖 | 会把 process execution、Activity 和过程状态 truth 引入 Artifact | 使用 ProcessRef、ActivityRef、safe summary、事件或运行期能力边界 |
| `L1-artifact -> L3-method-library` 编译期依赖 | 会把 Artifact kind、WorkProductDefinition、方法和标准定义正文并入 Artifact | 通过定义引用、safe summary、snapshot 或运行期 resolver 消费 |
| `L1-artifact -> L2-runtime` / `L3-capability-hub` 编译期依赖 | 会让 L1 反向依赖运行 / 能力层,并把 execution / tool truth 混入 Artifact truth | runtime / capability 产出经正式 Artifact 收束边界输入 |
| `L1-artifact -> L1-conversation` / `L1-workspace` 编译期依赖 | 会让显化、预览和工作台局部状态反向定义制品事实 | conversation / workspace 运行期或事件协作消费 Artifact facts |
| `L1-artifact -> L4-observability` / `L4-archive` 编译期依赖 | 会把横切观测、审计物理存储或归档包实现引入业务真相仓 | trace / audit / archive handoff、snapshot / export 边界 |
| `L1-artifact -> L0-bus` 编译期依赖到业务核心 | Bus 是事件协作主干,但不应成为 Artifact 业务核心实现依赖 | 通过正式事件协作边界接入 |
| `L1-artifact -> L0-sdk` / `L5-console` / `L5-sync` 编译期依赖 | 会让入口体验、SDK facade 或同步私有状态反向定义核心 | 经正式 API / SDK / sync 边界消费或管理 |
| `L1-artifact -> L1-identity` 编译期依赖 | 当前直接依赖未进入主链,且会把身份生命周期和认证授权 truth 耦合进 Artifact | 通过入口语境、governance / work / process 引用或后续正式重裁剪进入 |
| `L1-artifact -> PostgreSQL / Git / S3 / URL / search / vector / external audit` 作为核心语义依赖 | 会让技术机制或外部系统定义 Artifact truth、正文归属和完整性结论 | 作为后续技术选型、外部正文来源接缝或外围增强,不得定义核心 |
| `L5/L6` 产品或生态仓绕过 `L0-sdk` 直接绑定 `L1-artifact` 源码 | 会破坏 SDK 统一接入层和依赖裁剪规则 | 经 SDK 或正式 API / public boundary 消费 |
| 派生视图 / search / report / projection / sync copy -> Artifact truth 反写 | 派生结构可延迟和重建,不能成为第二 truth | 从核心 truth 派生,必要时重建派生结果 |
| 存储 / 内容后端 / 缓存 / 投影产品 -> 核心语义 | 技术产品不能定义业务状态、版本语义、血缘关系、baseline 成员或正文 ownership | 技术承载服从核心规则和正式承载契约 |

### 8.8 依赖裁剪图

#### 依赖裁剪图: L1-artifact

```text
Global baseline
  |
  | crop only L1-artifact related edges
  v
                         +-------------------+
                         | L3-method-library |
                         +---------+---------+
                                   | [runtime]
                                   v
+-----------+ [compile]   +--------+--------+   [event] +--------+
| L0-core   +------------>| L1-artifact     |<----------+ L0-bus |
+-----------+             +--------+--------+           +--------+
                                   ^
                                   | [runtime/event]
                 +-----------------+-----------------+
                 |                                   |
                 v                                   v
      governance / work / process           runtime / capability
      conversation / workspace              archive / observability
      SDK / console / sync                  downstream consumers
```

图示说明:

- 本图只展示 `L1-artifact` 相关依赖,不展示全 27 仓。
- `[compile]` 只有 `L0-core`,可进入后续 Cargo / package dependency 讨论。
- `[runtime]`、`[event]` 和追溯交接关系不得写成 package dependency,只能进入正式边界、adapter、event、projection、report、handoff 或配置讨论。
- 箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、接口时序或事件传播顺序。

### 8.9 依赖方向停审记录

| 架构单元 | 层级是否清楚 | 禁止依赖是否明确 | 运行期 / 事件协作是否未误写为 package dependency | 停审结果 |
|---|---|---|---|---|
| `Artifact 核心语义角色` | pass | pass | pass | pass |
| `Artifact 编排 / 承接角色` | pass | pass | pass | pass |
| `外部能力接缝角色` | pass | pass | pass | pass |
| `派生消费辅助角色` | pass | pass | pass | pass |
| `技术承载角色` | pass | pass | pass | pass |
| `跨仓依赖裁剪` | pass | pass | pass | pass |

### 8.10 跨依赖边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在反向依赖 | pass | work、process、governance、method、runtime、capability、consumer、archive、observability、sync 均不得反向定义 Artifact truth。 |
| 是否存在运行期通信误写 package dependency | pass | 除 `L0-core` 外,均按运行期、事件协作、下游消费或追溯交接处理。 |
| 是否存在跨仓依赖裁剪不一致 | pass | 承接全局矩阵中 `L1-artifact` 行,并补充 Step 4 / Step 5 已确认的 method / runtime / capability 来源线索。 |
| 是否存在依赖类型误判 | pass | `L0-bus` 作为事件协作,不是业务核心编译期依赖;`L0-sdk` / console / sync 是消费入口。 |
| 是否存在 adapter / repository 名词误作架构规则 | pass | 旧 `ContentStore`、`LineageReader`、`HashVerifier` 未进入正式依赖角色。 |
| 是否存在技术产品定义核心语义 | pass | 数据库、内容后端、search、hash、archive、observability、sync 均只作为后续技术或交接边界。 |
| 是否存在后续概要设计承接风险 | pass | 本步只定义依赖保护结构,未提前写代码目录、crate、trait、DTO、event payload 或 repository。 |

### 8.11 依赖边界说明

`L1-artifact` 的依赖方向以保护 Artifact fact、version、lineage、baseline 和 consumption backref truth 为中心:外部来源可以提供引用、摘要、定义、语境、反馈或内容线索,下游可以消费授权 Artifact facts,技术承载可以支撑存储和派生,但它们都不能反向定义核心语义。`L0-core` 是唯一可进入编译期的共享契约基线,其余跨仓关系必须按运行期、事件协作、追溯交接或下游消费处理。这个边界让后续概要设计可以继续展开代码主体骨架,但不会把 governance decision、work lifecycle、process execution、method definition、runtime trace、tool result、conversation display、workspace view、observability store、archive package、sync copy、content backend 或技术产品提前写进 Artifact 核心。

---

## 9. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §8 的结构化结论,不重复扩写 SOP 问题回答、旧材料诊断和设计取舍。

```md
## 8. 依赖方向与层间约束

> 校准来源:
> - `design-calibration/01_arch_step_07_dependency_direction.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“依赖方向停审记录”和“跨依赖边界审计表”小节,了解本章如何从容器 / 部署视图和全局依赖基线收敛出依赖保护结构。

### 8.1 依赖方向图

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.1。

### 8.2 层间约束表

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.2。

### 8.3 依赖倒置结论

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.3。

### 8.4 本仓依赖裁剪表

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.5。

### 8.5 本仓依赖类型分类表

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.6。

### 8.6 本仓禁止依赖表

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.7。

### 8.7 依赖裁剪图

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.8。

### 8.8 依赖边界说明

摘录 `design-calibration/01_arch_step_07_dependency_direction.md` §8.11。
```

---

## 10. 待确认事项

本步不新增阻塞性待确认事项。下列事项进入后续 Step,不得在 Step 7 中提前闭口:

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-ART-ARCH-007-001 | `L1-identity` 是否在后续对象 / 协议中成为直接运行期依赖,还是只经 work / governance / entry context 间接出现 | 后续概要 / 详细设计按具体 actor / responsibility 场景重裁剪。 |
| Q-ART-ARCH-007-002 | `L3-method-library` definition source 的正式 resolver、snapshot、safe summary 和降级语义 | 后续 Step 8、Step 9、概要 / 详细设计收敛。 |
| Q-ART-ARCH-007-003 | runtime / capability 自动化来源如何进入 Artifact fact、version 和 lineage 收束 | 后续 Step 9、概要 / 详细设计和测试方案收敛。 |
| Q-ART-ARCH-007-004 | content backend、hash、search、projection、archive、observability、sync 的具体技术与配置边界 | 后续 Step 10、配置设计、详细设计和测试方案收敛。 |

---

## 11. 自检与门禁

| 检查项 | 结果 | 说明 |
|---|---|---|
| 是否明确本仓内部架构责任层 / 依赖角色 | pass | §8.1 / §8.2 已定义五类依赖角色。 |
| 是否明确允许依赖方向和禁止反向依赖 | pass | §8.2 / §8.7 已给出允许、禁止和正确协作方式。 |
| 是否明确必要倒置边界 | pass | §8.3 已逐项列出治理、工作、过程、定义、自动化、能力、内容、观测、归档、入口和技术倒置。 |
| 是否按全局依赖基线裁剪本仓跨仓依赖子图 | pass | §8.5 / §8.6 / §8.8 已输出裁剪表、分类表和裁剪图。 |
| 是否每个架构单元完成停审 | pass | §8.9 已逐项通过层级、禁止依赖和 package dependency 检查。 |
| 是否完成跨依赖边界审计 | pass | §8.10 未发现反向依赖、依赖类型误判或实现名词污染。 |
| 是否避免把运行时通信、代码目录、数据库、接口协议或事件 payload 写成层间约束 | pass | 未写 API、handler、repository、DTO、topic、payload、表结构或技术产品选型。 |
| 是否允许进入 Step 8 | pass | 当前依赖方向与层间约束足以支撑数据所有权与一致性策略讨论。 |

当前 Step 7 `依赖方向与层间约束` 已完成。下一步必须等待用户确认后进入 Step 8 `数据所有权与一致性策略`,并只创建 / 改写 `design-calibration/01_arch_step_08_data_ownership_consistency.md`。
