# Step 9. 关键交互与通信方式

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 9
> 回填章节: `01-架构设计.md` §10 关键交互与通信方式
> 生成日期: 2026-07-03
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-artifact` 在正式边界上的关键交互场景分别适合同步请求 / 响应、异步事件 / 回调,还是后台任务 / 延后承接,并说明失败时的架构层处理口径。

本步只回答通信方式类别和边界理由,不写接口路径、接口名、事件名、回调名、topic 名、DTO、schema、协议选型、时序图、队列产品、重试实现、transaction、outbox、publisher / consumer、handler 或内部处理步骤。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `design-calibration/01_arch_step_04_system_context.md` | 已完成 | 提供正式上下文对象、输入 / 输出面和外部降级口径。 |
| `design-calibration/01_arch_step_06_container_deployment.md` | 已完成 | 提供同步入口、异步输入、后台维护、真相承载、派生承载、外部正文来源和事件交接运行边界。 |
| `design-calibration/01_arch_step_07_dependency_direction.md` | 已完成 | 提供核心语义、编排承接、外部接缝、派生辅助、技术承载和跨仓依赖裁剪口径。 |
| `design-calibration/01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供 truth / snapshot / ref / forbidden body、一致性策略和失败处理口径。 |
| `projects/L1-artifact/00-需求文档.md` §12 / §13 | 已重建 | 提供需求层能力级接口类型、外部依赖边界、事件输入 / 输出和 NFR 降级要求。 |
| `standards/document/架构设计讨论流程_SOP.md` Step 9 | 已读取 | 控制本步必须输出关键交互、通信方式、失败降级、边界约束、停审和跨交互边界审计。 |
| `standards/document/架构设计书写规范.md` §4.10 | 已读取 | 控制关键交互场景表、通信方式判断表和简化交互示意图写法。 |
| 旧 `projects/L1-artifact/01-架构设计.md` §6.3 | 旧 Draft | 作为旧 `process -> artifact`、`artifact.approved`、content adapter 等实现线索混写问题诊断输入。 |
| `projects/L1-governance/design-calibration/01_arch_step_09_interactions_communication.md` | 已参考 | 只参考“场景先行 + 方式判断 + 停审审计”的组织方式,不复制治理仓结论。 |

---

## 3. Step 内计划

| 计划项 | 状态 | 可审查产物 |
|---|---|---|
| 读取项目台账、架构 flow、Step 4 / 6 / 7 / 8、SOP Step 9 和书写规范 4.10 | done | 本文件 §2 |
| 读取需求接口依赖 / NFR、旧架构通信段和 L1-governance Step 9 框架 | done | 本文件 §2 / §5 |
| 回答同步、异步、后台、正式边界、失败降级和协议细节风险问题 | done | 本文件 §4 |
| 输出关键交互场景表、通信方式判断表、按架构单元组织的交互方式表和简化交互示意图 | done | 本文件 §8 |
| 完成交互方式停审和跨交互边界审计 | done | 本文件 §8.5 / §8.6 |
| 写出 Step 16 可回填草稿 | done | 本文件 §9 |
| 完成 Step 9 自检并更新 flow / 项目台账 | done | 本文件 §11 |

---

## 4. SOP 问题回答

### 4.1 哪些交互适合同步能力边界?

需要即时判断 Artifact 正式真相是否成立、是否可读、是否可变更或是否必须拒绝的交互适合同步请求 / 响应类交互。包括 Artifact fact 正式纳管、正文 / 内容事实语境收束、版本形成或替代、血缘关系建立或审查、baseline 冻结或成员调整、consumable truth 回指读取、审查责任锚点调整、外部正文边界判断和正式维护触发。

这些场景的共同点是调用方必须得到明确结果:已成立、已拒绝、引用不可解析、依据不足、无权读取、外部正文越界、候选仍待收束或当前不可处理。不能先返回成功,再由后台补齐 Artifact fact、version、lineage、baseline 或 consumption backref truth。

### 4.2 哪些交互适合异步事件?

已经成立的 Artifact truth 向相邻仓传播、相邻真相域已经形成的语境或自动化产出线索进入 Artifact 边界、下游消费方需要感知 Artifact 变化、observability / archive / sync 需要承接交接材料的场景,适合异步事件 / 回调类交互。

这些场景的重点是变化感知、外部结果送达、消费回链或交接通知,不要求在原始同步请求边界内完成所有下游消费,也不允许下游消费失败反向取消已经成立的 Artifact truth。

### 4.3 哪些交互适合后台任务或补偿路径?

Artifact 搜索、预览、projection、报告、对账、引用可解析性刷新、外部快照刷新、完整性候选检查、派生视图重建、归档准备、观测解释、同步交接材料形成和维护报告适合后台任务 / 延后承接类交互。

这些交互可以延迟、挂起、重建或重试,但只能维护派生结果、解释状态、消费摘要、对账报告或交接材料,不得创建、覆盖、冻结、替代或回滚 Artifact fact、version、lineage、baseline 或 consumption backref truth。

### 4.4 哪些交互必须经过总线或正式边界,不能直接穿透?

work / process / governance / method-library / runtime / capability 的外部语境输入、conversation / workspace / SDK / console / sync 的读取或显化、archive / observability 的交接、外部正文 / 内容来源引用和跨仓变化协作,都必须经过正式同步入口、异步输入边界、外部能力接缝或事件协作 / 追溯交接边界。

相邻仓源码、运行材料、工具结果、method definition 正文、workspace view、conversation display、archive package、observability store、sync 私有副本、search / report / projection 或外部内容后端都不能直接穿透写 Artifact 核心真相。

### 4.5 关键依赖失效时,本仓如何降级或挂起?

| 依赖 / 场景失效 | 降级 / 挂起口径 |
|---|---|
| 同步主真相判断失败 | 明确失败、拒绝或保持原状态,不得写成部分完成。 |
| 外部 work / process / governance / method / runtime / capability 引用不可解析 | 标记 unresolved / pending / waiting,或退回待补语境;不得补造外部 truth。 |
| 外部正文来源不可用或越界 | 保留引用缺口、拒绝越界输入或降级预览解释,不得复制正文补齐。 |
| 自动化产出依据不足 | 保守挂起、升级审查或拒绝自动形成 truth,不得用 runtime trace 直接生成 Artifact lineage。 |
| 异步输入重复、乱序或过期 | 幂等识别、拒绝回退或挂起对账,不得生成重复 fact / version / lineage / baseline。 |
| Artifact truth 变化传播失败 | 保留待传播、failed、retryable 或 handoff-pending 语义,不得回滚已经成立的 Artifact truth。 |
| 派生视图 / 搜索 / 报告 / 对账滞后 | 返回 stale / rebuilding / unavailable 或旧视图,不得反写真相。 |
| observability / archive / sync 交接失败 | 保留待交接、failed、retryable 或待导出状态,不接管物理日志、归档包正文或同步私有副本。 |

### 4.6 哪些通信口径若不先写清,后续最容易误入协议细节?

最容易误入协议细节的口径是:

1. 把 Artifact fact 纳管写成 API / command 目录,而不是同步 truth 收束边界。
2. 把版本替代和 baseline 冻结写成事件补偿,而不是同步成立 / 拒绝边界。
3. 把 lineage 输入写成 runtime trace、tool result 或 event stream 直接落 truth。
4. 把外部正文访问写成 content adapter / hash / storage protocol,而不是正文 ownership 边界判断。
5. 把 search / preview / projection / report / reconciliation 写成同步成功条件。
6. 把 archive / observability / sync handoff 写成 Artifact truth 成立前置或第二 truth。
7. 把 bus / outbox / topic / webhook 当作通信方式结论,而不是已成立事实传播或外部结果送达。

---

## 5. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| `process -> artifact` 写成事件 + ref | 只有通信标签,没有说明 process 产出何时只是候选输入、何时需要 Artifact 同步收束。 | 改为外部语境 / 自动化输入送达与 Artifact fact / lineage 正式收束分离。 |
| `work <- artifact` 写 `artifact.approved` 事件 | 提前固化事件语义,且把 approval 与 Artifact truth 混在一起。 | 改为 Artifact truth 变化传播和下游消费回指,不写事件名。 |
| `content backend 访问` 写 adapter 模式 | 这是实现接缝和技术选型,不是通信方式判断。 | 改为外部正文 / 内容来源边界的同步判断、异步线索和后台派生解释。 |
| 容器图中 `hash checker / subscriptions / bus(outbox)` | 把后台维护、订阅和 outbox 实现提前写死。 | 改为后台任务 / 延后承接和事件协作 / 追溯交接边界。 |
| 旧文档未区分同步 truth 收束与派生更新 | 容易让 search、preview、report 或 archive 失败影响核心 truth。 | 改为同步收口核心 truth,异步传播已成立事实,后台维护派生材料。 |

---

## 6. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 通信主语 | API、事件、content adapter、hash checker、outbox | 正式交互场景与通信方式类别 | 架构层先判断边界语义。 |
| 同步边界 | 只有入口 / adapter 线索 | 即时判断 fact、version、lineage、baseline、consumption backref 是否成立 | 防止伪同步成功和后台补造 truth。 |
| 异步边界 | 事件名和订阅机制 | 已成立 Artifact truth 传播或外部结果送达 | 防止事件名替代架构判断。 |
| 后台承接 | hash scan、lineage query、subscriptions 分散 | 搜索、预览、projection、报告、对账、完整性候选、归档准备和同步交接 | 防止维护任务反写真相。 |
| 失败口径 | 技术重试、SLA 或后端不可用 | 明确失败、挂起、stale、unresolved、failed、retryable 和不得伪造正文 | 对齐 Step 8 数据所有权和一致性策略。 |

---

## 7. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 所有 Artifact 变化都同步完成 | 调用方心智简单。 | 会强迫下游显化、派生视图、归档、观测和同步交接阻塞核心 truth。 | 不采用。 |
| 方案 B: 所有 Artifact 变化都异步化 | 解耦程度高。 | fact、version、lineage、baseline 和 consumption backref 缺少即时成立 / 拒绝口径。 | 不采用。 |
| 方案 C: 同步收口核心 truth,异步传播已成立事实和外部结果,后台承接派生 / 对账 / 交接 | 符合数据归属、依赖方向和一致性策略。 | 后续概要 / 详细设计必须清楚标注状态和边界。 | 采用。 |
| 方案 D: 先锁定 API、event、queue、content adapter、hash worker,再反推交互方式 | 实施看似直接。 | 会让技术选型和实现机制反向决定 Artifact truth。 | 不采用。 |
| 方案 E: 让 search / archive / observability / sync 参与 Artifact truth 写入 | 贴近消费体验。 | 会形成第二 truth,破坏 Artifact 作为制品事实仓的定位。 | 不采用。 |

### 7.1 待确认问题的方案选择

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 |
|---|---|---|---|
| Artifact fact 纳管是否可以先异步接受、后台再判断成立 | A. 可以;B. 不可以,同步边界必须返回成立、拒绝或待收束 | B | Artifact fact 是正式真相入口,不能伪装成已成立。 |
| Lineage 是否可以由 runtime trace / event stream 自动直接写入 | A. 可以;B. 不可以,只能作为线索,正式血缘由 Artifact 收束 | B | Step 8 已确认 lineage 必须锚定正式 fact / version。 |
| Search / preview / report 是否阻塞核心写入 | A. 阻塞;B. 不阻塞,后台最终一致 | B | 派生消费可延迟和重建,不得成为 truth 成立前置。 |
| Archive / observability / sync 交接失败是否回滚 Artifact truth | A. 回滚;B. 不回滚,保留待交接 / failed / retryable | B | 横切消费和同步私有状态不能改变已经成立的制品真相。 |

---

## 8. 结构化中间产物

### 8.1 关键交互场景表

| 交互场景 | 交互边界 | 交互目的 | 边界说明 |
|---|---|---|---|
| Artifact fact 正式纳管 | 下游消费 / 管理入口边界或外部语境输入边界 ↔ Artifact 同步入口 | 判断候选材料、来源语境、责任锚点和正文边界是否可正式成为 Artifact fact。 | 这是制品事实入口,必须即时收口成立、拒绝或待收束。 |
| Artifact 正文 / 内容事实语境收束 | 外部正文 / 内容来源边界 ↔ Artifact 同步入口 | 判断外部正文引用、内容事实语境和禁止正文边界是否可被 Artifact 接受。 | 本仓拥有内容事实语境,不拥有外部正文生命周期。 |
| Artifact version 形成与替代 | 管理入口 / 自动化输入 / 消费边界 ↔ Artifact 同步入口 | 判断稳定版本、候选修订、替代和历史版本语境是否成立。 | Version truth 不能由 current latest、自动化再生成或消费方状态覆盖。 |
| Artifact lineage 建立与审查 | work / process / governance / runtime / capability / 管理入口边界 ↔ Artifact 同步入口 | 判断来源、替代、依赖、影响和审查维护锚点是否可形成正式 lineage。 | 外部 trace、tool result 和事件只能作为线索,不能直接写血缘 truth。 |
| Artifact baseline 冻结与成员调整 | work / governance / archive / 管理入口边界 ↔ Artifact 同步入口 | 判断受控 Artifact version 集合、候选基线、冻结和历史 baseline 是否成立。 | Baseline 必须锁定正式 Artifact versions,不能由发布说明或归档包替代。 |
| Consumable Artifact truth 读取与回指 | SDK / console / sync / conversation / workspace / work / process / governance 边界 ↔ Artifact 同步入口 | 授权读取 fact、version、lineage、baseline 和可消费回指。 | 读取必须即时判断可见性、stale / unavailable 和 truth 回指,但不得改变 truth。 |
| 外部语境 / 定义 / 自动化结果送达 | 事件协作 / 外部能力接缝 ↔ Artifact 异步输入消费 | 承接 work、process、governance、method、runtime、capability 等已成立外部事实、摘要或候选线索。 | 该场景是外部结果送达,不是来源仓源码穿透或正文复制。 |
| Artifact truth 变化传播 | Artifact truth 边界 ↔ bus / work / process / governance / conversation / workspace / archive / observability / sync 消费边界 | 将已经成立的 Artifact fact、version、lineage、baseline 或消费回指变化传播给相邻仓或消费方。 | 传播失败不能反向取消已经成立的 Artifact truth。 |
| 派生视图 / 搜索 / 预览 / 报告维护 | Artifact truth 边界 ↔ 派生消费承载 / 后台维护边界 | 维护搜索、浏览、预览、projection、report 和消费依据说明。 | 派生结果可延迟和重建,不得成为第二 truth。 |
| Reconciliation / 引用刷新 / 完整性候选检查 | 后台维护边界 ↔ Artifact truth / 外部引用 / 派生状态 / 外部正文边界 | 检查引用可解析性、派生一致性、外部正文可用性和完整性线索是否可解释。 | 对账和检查只能输出异常、报告、marker 或维护状态,不得改写主真相。 |
| Observability / archive / sync handoff | Artifact truth / 派生材料边界 ↔ 追溯交接 / 归档 / 同步消费边界 | 交接可追溯 Artifact 回指、归档准备、观测解释和同步友好材料。 | 交接可延迟,接收方不得反向定义 Artifact truth。 |
| 受控维护与重建 | 运维 / 审计入口边界 ↔ 后台维护与派生边界 | 触发派生重建、引用刷新、对账报告、完整性候选复核或交接重试。 | 维护只能修复辅助结构或暴露异常,不得隐式覆盖业务事实。 |

### 8.2 通信方式判断表

| 交互场景 | 推荐通信方式 | 不宜采用的方式 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| Artifact fact 正式纳管 | 同步请求 / 响应类交互 | 不宜以后置事件或后台补偿作为主路径 | 返回成立、拒绝、pending、unresolved 或依据不足 | Fact 是 Artifact truth 入口,必须即时判断。 |
| Artifact 正文 / 内容事实语境收束 | 同步请求 / 响应类交互 + 后台派生解释 | 不宜由外部 content backend 成功决定 truth | 外部正文不可用或越界时拒绝、挂起或降级预览 | 正文事实语境和外部正文生命周期必须分离。 |
| Artifact version 形成与替代 | 同步请求 / 响应类交互 | 不宜先返回成功再后台补版本 / 替代语义 | 版本锚点不闭合时拒绝或保持原状态 | Version 是核心 truth,不能被自动化再生成覆盖。 |
| Artifact lineage 建立与审查 | 同步请求 / 响应类交互 + 异步线索输入 | 不宜让 runtime trace / event stream 直接生成 lineage truth | 关系目标或依据不可解释时 pending / unresolved / rejected | 外部线索可送达,正式血缘由 Artifact 收口。 |
| Artifact baseline 冻结与成员调整 | 同步请求 / 响应类交互 | 不宜由 release note、governance decision 或 archive package 替代 | 成员版本不正式或不可解析时拒绝冻结 | Baseline 是受控版本集合 truth。 |
| Consumable Artifact truth 读取与回指 | 同步请求 / 响应类交互 | 不宜用异步推送替代正式读取判断 | 返回可见结果、不可见、stale、unavailable 或明确失败 | 读取边界要即时执行授权、可见性和一致性口径。 |
| 外部语境 / 定义 / 自动化结果送达 | 异步事件 / 回调类交互 | 不宜要求来源仓同步穿透 Artifact 核心 | 保持未送达、待解析、unresolved 或不可接受状态 | 外部事实已在来源仓成立,进入 Artifact 应经正式边界。 |
| Artifact truth 变化传播 | 异步事件 / 回调类交互 | 不宜要求所有下游同步确认后才成立主真相 | 保留待消费、failed、retryable 或 handoff-pending | 事实已成立,传播失败不回滚核心真相。 |
| 派生视图 / 搜索 / 预览 / 报告维护 | 后台任务 / 延后承接类交互 | 不宜阻塞核心同步变更 | 保留旧视图、stale、rebuilding、failed 或 unavailable | 派生消费最终一致。 |
| Reconciliation / 引用刷新 / 完整性候选检查 | 后台任务 / 延后承接类交互 | 不宜作为业务写路径 | 输出异常、报告、marker、pending 或 failed 状态,不得改写主真相 | 对账用于解释和维护。 |
| Observability / archive / sync handoff | 异步事件 / 回调类交互 + 后台任务 / 延后承接 | 不宜作为 Artifact truth 成立前置 | 保留 pending、failed、retryable 或待导出状态 | 交接和导出可延迟,接收方不反写真相。 |
| 受控维护与重建 | 后台任务 / 延后承接类交互 | 不宜伪装成同步业务变更成功 | 挂起、失败或输出维护异常,不得覆盖业务事实 | 维护任务只修复派生或暴露问题。 |

### 8.3 按架构单元组织的交互方式表

| 架构单元 | 同步交互 | 异步交互 | 后台 / 延后承接 | 失败降级口径 | 停审结果 |
|---|---|---|---|---|---|
| `Artifact 核心语义角色` | 只接受已由编排收束后的 fact / version / lineage / baseline / consumption backref 判断。 | 不直接订阅外部事件。 | 不直接运行后台维护。 | 输入不闭合时拒绝或保持原状态。 | pass |
| `Artifact 编排 / 承接角色` | 承接正式纳管、版本、血缘、基线、读取和维护触发。 | 承接外部语境、定义、自动化结果和消费反馈送达。 | 发起对账、引用刷新、派生重建和交接准备。 | pending / unresolved / rejected / unavailable,不得补造 truth。 | pass |
| `外部能力接缝角色` | 暴露正式入口和读取边界,不让外部直接写核心。 | 接收或输出正式变化感知和结果送达。 | 提供延后交接和恢复边界。 | 外部不可用只影响语境、消费或交接,不改 Artifact truth。 | pass |
| `派生消费辅助角色` | 可支持只读消费判断,不得作为写入主路径。 | 可消费已成立 truth 变化。 | 维护搜索、预览、projection、报告、对账和消费材料。 | stale / rebuilding / failed / unavailable,不得反写真相。 | pass |
| `技术承载角色` | 支撑同步边界的正式承载,不决定业务语义。 | 支撑事件协作和交接边界,不承载 truth 正文。 | 支撑派生、完整性候选、维护和重建。 | 技术失败只能暴露失败或挂起,不得改写语义。 | pass |

### 8.4 简化交互示意图

```text
+-------------------------------+       +-------------------------------+
| 下游消费 / 管理入口边界        |       | 外部语境 / 定义 / 自动化边界  |
| sdk / console / sync / peers   |       | work / process / method       |
| workspace / conversation       |       | runtime / capability / gov    |
+---------------+---------------+       +---------------+---------------+
                | [sync request / response]              |
                v                                        | [async event / callback]
+---------------+---------------+       +---------------+---------------+
| Artifact 同步入口              |       | Artifact 异步输入消费          |
+---------------+---------------+       +---------------+---------------+
                |                                       |
                +-------------------+-------------------+
                                    |
                                    v
                        +-----------+-----------+
                        | Artifact truth        |
                        | fact / version /      |
                        | lineage / baseline /  |
                        | consumption backref   |
                        +-----+-------------+---+
                              |             |
                [async event] |             | [background]
                              v             v
              +---------------+----+   +----+----------------+
              | 消费 / 追溯 / 归档 |   | 派生 / 对账 /      |
              | / 观测 / 同步边界  |   | 预览 / 报告承接    |
              +--------------------+   +---------------------+
```

图示说明:

- 同步请求 / 响应用于即时判断 Artifact 核心 truth 是否成立,不是表达具体协议。
- 异步事件 / 回调用于已成立 truth 传播或外部结果送达,不是事件目录。
- 后台任务 / 延后承接用于派生、报告、对账、引用刷新、完整性候选和交接材料形成,不得反写真相。
- 图不表达接口路径、事件名、处理顺序、技术产品、队列、topic 或运行部署拓扑。

### 8.5 交互方式停审记录

| 交互场景 | 是否匹配数据所有权 | 是否经过正式边界 | 是否未下沉协议 schema | 停审结果 |
|---|---|---|---|---|
| Artifact fact 正式纳管 | pass | pass | pass | pass |
| Artifact 正文 / 内容事实语境收束 | pass | pass | pass | pass |
| Artifact version 形成与替代 | pass | pass | pass | pass |
| Artifact lineage 建立与审查 | pass | pass | pass | pass |
| Artifact baseline 冻结与成员调整 | pass | pass | pass | pass |
| Consumable Artifact truth 读取与回指 | pass | pass | pass | pass |
| 外部语境 / 定义 / 自动化结果送达 | pass | pass | pass | pass |
| Artifact truth 变化传播 | pass | pass | pass | pass |
| 派生视图 / 搜索 / 预览 / 报告维护 | pass | pass | pass | pass |
| Reconciliation / 引用刷新 / 完整性候选检查 | pass | pass | pass | pass |
| Observability / archive / sync handoff | pass | pass | pass | pass |
| 受控维护与重建 | pass | pass | pass | pass |

### 8.6 跨交互边界审计表

| 审计项 | 结果 | 说明 |
|---|---|---|
| 是否存在同步 / 异步选择冲突 | pass | 核心 truth 成立走同步收口,已成立事实传播和外部结果送达走异步。 |
| 是否存在直接穿透边界 | pass | 外部来源、下游消费、横切系统和技术设施均必须经过正式边界。 |
| 是否存在协议细节下沉 | pass | 未写 API、event name、topic、DTO、schema、handler、outbox 或队列产品。 |
| 是否存在失败降级缺口 | pass | 已给出 rejected、pending、unresolved、stale、failed、retryable、handoff-pending 等架构层口径。 |
| 是否存在派生反写真相 | pass | search、preview、projection、report、reconciliation、archive、observability 和 sync 均只消费或交接。 |
| 是否存在外部正文迁入本仓 | pass | 外部正文 / 内容来源只作为引用、摘要或线索,不得成为 Artifact truth store。 |
| 是否存在后续详细设计承接风险 | pass | 本步保留通信类别和边界理由,具体协议、schema、port、adapter 和事件目录后续收敛。 |

### 8.7 边界说明

`L1-artifact` 的通信方式按 Artifact truth 是否需要即时成立来选择:fact、version、lineage、baseline 和 consumption backref 的正式判断必须同步收口;已经成立的 truth 传播和外部结果送达适合异步承接;派生、预览、报告、对账、引用刷新、完整性候选和交接材料适合后台延后承接。同步返回成功只能表示该同步边界内的 Artifact 判断已经成立,不能代替下游 workspace view、conversation display、report、archive package、observability record 或 sync copy 消费完成。异步和后台失败只能表现为未送达、待交接、旧视图、未解析、对账异常、failed 或 retryable,不能回滚已经成立的 Artifact truth。

---

## 9. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §10 “关键交互与通信方式”直接摘录并整理本文件 §8.1、§8.2、§8.3、§8.4 和 §8.7。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

---

## 10. 待确认事项

### 10.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Artifact fact 纳管是否可以后台补写后再视为成功 | A. 可以;B. 不可以,同步边界必须明确成立、拒绝或挂起 | B | 制品事实入口是核心 truth,不能伪同步完成。 | 已确认采用 B |
| Lineage 是否可以由 runtime trace / event stream 直接生成 | A. 可以;B. 不可以,只能作为线索或依据输入 | B | 防止运行材料或事件流拥有 Artifact lineage truth。 | 已确认采用 B |
| 派生视图 / report / preview 是否阻塞核心写入 | A. 阻塞;B. 不阻塞,后台最终一致;C. 由实现决定 | B | 派生辅助可延迟和重建,不得阻塞核心 truth。 | 已确认采用 B |
| observability / archive / sync 交接失败是否回滚 Artifact truth | A. 回滚;B. 不回滚,保留待交接 / failed / retryable | B | 横切消费、归档和同步私有状态不能改变已经成立的制品事实。 | 已确认采用 B |

### 10.2 本 Step 未确认事项

本步不新增阻塞 Step 10 的待确认事项。具体 API / Command / Query、event 名称、callback 形态、DTO、schema、topic、队列产品、重试策略、调度机制、transaction、outbox、publisher / consumer、handler、port、adapter 和处理流程留到后续概要 / 详细设计与技术选型继续收敛。

---

## 11. 进入下一步条件

- 已明确关键交互场景及其正式边界位置。
- 已明确同步请求 / 响应、异步事件 / 回调、后台任务 / 延后承接的适用场景。
- 已明确每类场景不宜采用的方式和失败处理口径。
- 已明确 fact、content fact context、version、lineage、baseline、consumption backref、事实传播、派生报告、对账和交接的通信类别。
- 已按架构单元完成交互方式停审。
- 已完成跨交互边界审计,没有 unresolved 冲突。
- 未写接口目录、事件目录、时序图、协议选型、技术产品、DTO schema、topic、transaction、outbox 或失败机制实现。
- 可以进入 Step 10 `关键技术选型`。
