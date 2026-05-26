# Step 1. 确认上游输入边界

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 1
- 回填章节：`projects/L3-method-library/02-概要设计.md` §1 与上游文档的关系声明

---

## 2. 本步输入

| 输入 | 路径 | 本步使用方式 |
|---|---|---|
| 需求文档 | `projects/L3-method-library/00-需求文档.md` | 承接目标、非目标、P0/P1 范围、用户故事、功能需求、接口需求和验收口径 |
| 架构设计 | `projects/L3-method-library/01-架构设计.md` | 承接系统边界、上下游交互、数据所有权、架构约束、技术选型和 P0/P1 架构口径 |
| 当前概要设计 | `projects/L3-method-library/02-概要设计.md` | 作为被校准对象,识别旧结构与最新规范之间的差距 |
| 概要设计书写规范 | `standards/document/概要设计书写规范.md` | 作为最终 `02` 的结果结构约束 |
| 概要设计讨论 SOP | `standards/document/概要设计讨论流程_SOP.md` | 作为本轮 Step 生成流程 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | 作为本文件结构和回填门禁 |

已确认结论:

```text
L3-method-library 是方法定义资产中心。
它拥有 7 类 P0 MethodContent 的 Definition truth。
它不拥有 identity / process / work / artifact / governance / UI 的 Use truth。
P0 主线是定义资产 draft -> review -> publish -> fingerprint -> audit -> outbox -> snapshot -> downstream sync。
P1 MethodPlugin / MethodConfiguration 属于方法资产组装与分发能力,不得阻塞 P0 主链。
```

依赖的前序 Step:

```text
无。Step 1 是本轮 02 概要设计校准的入口。
```

---

## 3. SOP 问题回答

### 3.1 当前概要设计要承接哪些需求结论？

回答：

当前概要设计必须承接 `00-需求文档.md` 中已经收稳的以下结论:

| 需求结论 | 内容 |
|---|---|
| 仓定位 | L3 方法能力层中的方法资产中心 |
| P0 MethodContent | Qualification / RoleDefinition / TaskDefinition / WorkProductDefinition / ProcessTemplateDef / ViewProfile / AIPolicyDef |
| P0 主链路 | Draft MethodContent -> Publish Gate Approved -> Publish MethodContent -> Generate Fingerprint -> Emit Definition Event / Snapshot -> Downstream Sync |
| P0 下游同步 | Qualification -> identity / capability-hub; RoleDefinition -> identity; TaskDefinition -> process; WorkProductDefinition -> artifact; ProcessTemplateDef -> process; ViewProfile -> UI / console; AIPolicyDef -> governance |
| TaskDefinition 下游口径 | process 是 P0 消费方; work 是否直接消费保持 P1 / 待确认 |
| 非目标 | 不管理 QualificationProfile / QualificationBinding / ProcessInstance / WorkItem / Artifact 实例 / Policy enforce result / Marketplace 交易 |
| Command 需求 | Create / Update / Submit / Publish / Deprecate / Retire / Supersede / SeedInitialMethodAssets |
| Query 需求 | Get / List / Version / ExportSnapshot / ResolveViewProfile / Trace / CompareFingerprint |
| Event 需求 | content / qualification / role / task / work product / process template / view profile / ai policy 发布与变更事件 |
| Operations Job | seed、index rebuild、event replay、fingerprint recalculate、snapshot export、drift detect |

### 3.2 当前概要设计要承接哪些架构结论？

回答：

当前概要设计必须承接 `01-架构设计.md` 中已经收稳的以下结论:

| 架构结论 | 内容 |
|---|---|
| Definition vs Use | method-library 只拥有 Definition truth,下游拥有 Use truth |
| 上下文边界 | 方法作者 / Admin / Console / Auditor 通过 Command / Query 访问; governance 提供 gate; L0-bus 承载 outbox/replay; object storage 保存 guidance/blob/package blob |
| 下游关系 | identity / process / capability-hub / artifact / governance / UI / console / marketplace 通过 Event + Snapshot / Query 消费 |
| 数据所有权 | 本仓拥有 MethodContent 定义正文、版本、fingerprint、生命周期、audit、outbox、snapshot; 只保存外部事实引用 |
| 一致性策略 | MethodContent 聚合内强一致; 下游同步最终一致; outbox + snapshot + fingerprint 支撑恢复和 drift 防护 |
| 技术方向 | PostgreSQL 存定义真相; object storage 存大 blob; outbox + L0-bus 发事件; canonical fingerprint 做漂移识别 |
| P0/P1 分界 | P0 先跑通 7 类定义资产发布闭环; P1 plugin/configuration/marketplace 后置 |
| 硬约束 | published 核心字段不可改,变更必须 supersede; publish 必经 Gate; fingerprint 变化必发事件 |

### 3.3 这些结论里，哪些已经足够稳定，可以直接作为概要设计输入？

回答：

以下结论可以直接作为概要设计输入:

```text
1. 7 类 P0 MethodContent
2. Definition truth / Use truth 边界
3. P0 发布同步主链
4. P0 下游消费方
5. P0 / P1 范围分界
6. Command / Query / Event / Operations Job 接口族
7. fingerprint / snapshot / outbox / audit 的发布一致性主线
8. QualificationProfile 和 QualificationBinding 不归 method-library
9. TaskDefinition P0 下游是 process,work 保持 P1 / 待确认
```

### 3.4 哪些结论虽然相关，但仍未收稳，因此当前不能直接往下展开？

回答：

以下结论相关但不能在本轮概要设计中当作已收稳实现结论:

| 未收稳结论 | 当前处理 |
|---|---|
| work 是否直接消费 TaskDefinition 作为 WorkItem 模板 | 保持 P1 / 待确认,不进入 P0 设计主链 |
| MethodPlugin / MethodConfiguration 的完整实现细节 | 只保留 P1 位置和边界,不阻塞 P0 |
| Variability / Plugin dependency DAG 的具体算法 | P1 后置,不在 02 P0 关键对象和流程中展开 |
| AIPolicyDef 与 governance runtime Policy DSL 的完整映射 | 02 只表达 source/ref 和同步边界,详细 DSL 留给 governance / 后续 ADR |
| Marketplace package listing / transaction / install record | 不进入本仓 P0,只保留 P1 metadata 输出边界 |
| 完整数据库表结构、索引、DDL、HTTP JSON / proto schema | 留给 `03-详细设计.md` |

### 3.5 哪些边界、非目标和约束会直接决定概要设计当前不该展开到哪里？

回答：

当前概要设计不应展开到以下范围:

```text
1. 不重新定义需求目标、用户故事、功能编号和验收标准
2. 不重新讨论架构选型和上下游系统边界
3. 不展开完整 Rust struct 字段全集、trait 签名和函数实现
4. 不展开完整 HTTP / RPC / Event schema
5. 不展开 DDL、索引和事务实现细节
6. 不把 P1 MethodPlugin / MethodConfiguration 写成 P0 前置依赖
7. 不把下游 Use truth 误写成本仓拥有的对象
```

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 文档头部 | 仍引用旧口径“14 节结构”,且前置/关联口径混入旧通则 | 与最新概要设计 13 章主链不一致 |
| §1 先用人话理解本仓 | 作为说明材料有价值,但占据正式主链入口 | 概要设计没有先给出上游关系映射和本文回答边界 |
| §1.4 需求与架构基线 | 已包含部分上游承接内容,但混入旧文档自指和后续章节说明 | 可以抽取到新 §1,但需要按规范重写 |
| §8 总体架构设计 | 大量架构风格、总体架构、技术选型内容重复 `01-架构设计.md` | 02 回滑到架构设计,削弱代码主体框架和主要组成部分 |
| §9 关键技术选型 | 技术选型属于架构设计,不应作为新版 02 主章节 | 与概要设计职责边界冲突 |
| §10 备选方案与取舍 | 方案取舍属于架构设计或 ADR,不应在 02 重新展开 | 使 02 变成缩小版架构设计 |
| §11~§13 | 接口、数据流、数据所有权内容有价值,但章节位置和粒度不符合最新规范 | 需要重排到 §7 / §8 / §11,并降低过细内容 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 文档入口 | 先用人话解释仓定位 | 先声明与上游文档的关系、本文不再回答、本文必须回答 | 最新概要设计规范要求先承接,再展开 |
| 上游承接 | 分散在 §1.4、§5、§8 等章节 | 集中到新 §1 上游关系映射表 | 避免同一边界反复解释 |
| 架构内容 | 在 02 中重复系统上下文、架构风格、技术选型、备选方案 | 只承接 01 结论,不重写架构取舍 | 02 不是缩小版架构设计 |
| 设计深度 | 同时包含概要、架构和详细设计粒度 | 停在代码主体骨架、对象轮廓、接口骨架、处理流和状态机 | 支撑 03,但不提前写 03 |
| P1 内容 | MethodPlugin / Configuration 章节较重 | 保留 P1 位置、边界和承接清单,不进入 P0 主链 | 避免 P1 污染 P0 实现路径 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 保留当前 02 结构,只做局部修补 | 改动小 | 仍不符合最新 13 章主链,架构/概要/详细边界继续混杂 | 不采用 |
| 完全重写 02,只保留少量旧内容 | 最干净 | 容易丢失已经讨论过的有效边界和接口口径 | 不采用 |
| 按最新 13 章主链重排,从旧文档抽取有效结论 | 能保留有效材料,又能修正结构问题 | 需要逐 Step 校准和回填 | 采用 |

---

## 7. 结构化中间产物

### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | 仓定位、P0/P1 范围、7 类 MethodContent、用户故事、功能需求、接口需求、非目标、验收口径 | 转译成代码主体框架、主要组成部分、关键对象、接口骨架和关键处理流 |
| `01-架构设计.md` | 系统边界、上下游交互、Definition / Use 边界、数据所有权、一致性策略、技术选型、P0/P1 架构口径 | 转译成主要组成部分边界、对象归属、接口协作、状态流转和详细设计承接清单 |
| `概要设计书写规范.md` | 13 章主链、图表输出规则、关键对象字段/函数骨架要求 | 约束新 `02-概要设计.md` 的最终章节结构和输出格式 |
| `概要设计讨论流程_SOP.md` | Step 1~13 的讨论流程 | 约束本轮校准的讨论顺序和进入下一步门禁 |
| `设计文档讨论中间产物规范.md` | Step 中间产物结构和回填门禁 | 约束 `design-calibration/` 下每个 Step 文件的格式 |

### 7.2 本文不再回答

```text
本文不再回答:
- 为什么 L3-method-library 必须独立成仓
- 为什么 7 类 P0 MethodContent 是当前 P0 范围
- 为什么 QualificationProfile 归 identity
- 为什么 QualificationBinding 归 capability-hub
- 为什么 process 是 TaskDefinition / ProcessTemplateDef 的 P0 下游
- 为什么 published 内容不可直接改写
- 为什么采用 fingerprint / snapshot / outbox 组合做发布同步和 drift 防护
- PostgreSQL / object storage / L0-bus 的架构选型理由
- MethodPlugin / MethodConfiguration 为什么后置为 P1
```

### 7.3 本文必须回答

```text
本文必须回答:
- L3-method-library 的代码主体框架如何组织
- 本仓按哪些主要组成部分展开,每部分职责和边界是什么
- 关键对象有哪些,它们分别属于哪个主要组成部分
- 关键对象的字段骨架、成员函数骨架、工厂函数骨架和状态集合是什么
- Command / Query / Event / Operations Job 的接口骨架是什么
- P0 发布同步主链如何在概要层表达为关键处理流
- MethodContent 生命周期状态如何定义和流转
- 哪些内容必须交给 03-详细设计继续展开
```

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §1。

```md
## 1. 与上游文档的关系声明

### 1.1 上游关系映射

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | 仓定位、P0/P1 范围、7 类 MethodContent、用户故事、功能需求、接口需求、非目标、验收口径 | 转译成代码主体框架、主要组成部分、关键对象、接口骨架和关键处理流 |
| `01-架构设计.md` | 系统边界、上下游交互、Definition / Use 边界、数据所有权、一致性策略、技术选型、P0/P1 架构口径 | 转译成主要组成部分边界、对象归属、接口协作、状态流转和详细设计承接清单 |
| `standards/document/概要设计书写规范.md` | 13 章主链、图表输出规则、关键对象字段 / 函数骨架要求 | 约束本文最终章节结构和输出格式 |
| `standards/document/概要设计讨论流程_SOP.md` | Step 1~13 的讨论流程 | 约束本轮校准的讨论顺序和进入下一步门禁 |

### 1.2 本文不再回答

本文不再回答：
- 为什么 L3-method-library 必须独立成仓
- 为什么 7 类 P0 MethodContent 是当前 P0 范围
- 为什么 QualificationProfile 归 identity
- 为什么 QualificationBinding 归 capability-hub
- 为什么 process 是 TaskDefinition / ProcessTemplateDef 的 P0 下游
- 为什么 published 内容不可直接改写
- 为什么采用 fingerprint / snapshot / outbox 组合做发布同步和 drift 防护
- PostgreSQL / object storage / L0-bus 的架构选型理由
- MethodPlugin / MethodConfiguration 为什么后置为 P1

### 1.3 本文必须回答

本文必须回答：
- L3-method-library 的代码主体框架如何组织
- 本仓按哪些主要组成部分展开,每部分职责和边界是什么
- 关键对象有哪些,它们分别属于哪个主要组成部分
- 关键对象的字段骨架、成员函数骨架、工厂函数骨架和状态集合是什么
- Command / Query / Event / Operations Job 的接口骨架是什么
- P0 发布同步主链如何在概要层表达为关键处理流
- MethodContent 生命周期状态如何定义和流转
- 哪些内容必须交给 03-详细设计继续展开
```

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 1 |
|---|---|---|
| 是否在新版 02 中保留“先用人话理解本仓”章节 | 不作为正式主章节保留,可将必要解释压缩到 §2 或术语说明 | 不阻塞 |
| 是否把旧 §9 技术选型完整删除 | 不完整保留;只在约束条件中引用架构结论 | 不阻塞 |
| 是否在 §1 引入 `domain/method-library/README.md` | 可作为参考,但不作为主输入;主输入是 00/01 | 不阻塞 |

---

## 10. 进入下一步条件

进入 Step 2 前需要确认:

- [ ] 上游关系映射表是否准确
- [ ] `本文不再回答` 是否覆盖了需求与架构中已经收稳的问题
- [ ] `本文必须回答` 是否准确限定了新版 02 的职责
- [ ] 是否同意后续按最新 13 章主链重排正式 `02-概要设计.md`
