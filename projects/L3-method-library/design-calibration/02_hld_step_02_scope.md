# Step 2. 明确本仓设计目标与当前范围

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 2
- 回填章节：`projects/L3-method-library/02-概要设计.md` §2 本次设计目标与范围

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 1 上游关系映射表 | 需求文档提供目标、非目标、P0/P1 范围、接口需求;架构设计提供边界、依赖和一致性策略 |
| Step 1 `本文不再回答` | 不再重写仓存在理由、7 类 P0 MethodContent、Definition / Use 边界、技术选型和 P1 后置原因 |
| Step 1 `本文必须回答` | 必须回答代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态流转和详细设计承接 |
| 当前 02 §3 目标与非目标 | 已有目标承接方式,但位置与最新规范不一致 |

已确认结论:

```text
本轮概要设计的核心目标是把 method-library 从“方法资产概念说明 + 架构/详细混合稿”校准为“可支撑 03 详细设计的代码主体骨架”。
```

依赖的前序 Step:

```text
Step 1 已确认上游输入边界。
```

---

## 3. SOP 问题回答

### 3.1 本次概要设计最主要要把哪些结构说清？

回答：

本次概要设计最主要要说清以下结构:

| 结构 | 必须说清什么 |
|---|---|
| 代码主体框架 | 本仓最终会落成哪些代码主体、实现层和模块组 |
| 主要组成部分 | 本仓按哪些功能主线组织,每个部分的职责、边界、输入输出和接缝是什么 |
| 关键对象轮廓 | MethodContent、7 类 P0 definition、发布/审计/同步/查询/P1 组合对象的字段骨架和函数骨架 |
| API / 接口骨架 | Command / Query / Event / Operations Job 的概要级接口族和边界 |
| 关键处理流 | draft / publish / downstream sync / ResolveViewProfile / seed-replay 等 P0 主流程 |
| 状态定义与状态流转 | MethodContent 生命周期、published 不可变、deprecated / retired / superseded 的含义和迁移 |
| 详细设计承接清单 | 03 必须继续展开的模块、对象、trait、接口、状态机、事务、错误和测试切口 |

### 3.2 这一轮概要设计应停在什么深度，才算足够支撑进入详细设计？

回答：

这一轮概要设计应停在“代码主体骨架层”。

具体深度:

```text
可以写:
- 正式对象名
- 关键字段骨架和字段类型
- 成员函数 / 工厂函数骨架,但只到函数名、参数类型和作用
- API / Command / Query / Event / Job 名称和概要用途
- 关键处理流的 ASCII 图和关键函数节点
- 状态集合和状态流转方向

不写:
- 完整 Rust struct 字段全集
- 完整 Rust 函数签名和实现
- 完整 HTTP / RPC / Event schema
- SQL / DDL / 索引 / 事务实现
- 完整错误码表和测试用例
```

达到该深度后,`03-详细设计.md` 才能继续按模块展开实现契约。

### 3.3 哪些内容属于本次概要设计范围？

回答：

本次概要设计范围如下:

| 范围 | 说明 |
|---|---|
| P0 7 类 MethodContent | Qualification / RoleDefinition / TaskDefinition / WorkProductDefinition / ProcessTemplateDef / ViewProfile / AIPolicyDef |
| P0 定义生命周期 | draft / in_review / published / deprecated / retired / superseded |
| P0 发布一致性主链 | gate_ref、version、fingerprint、audit、outbox、snapshot |
| P0 下游同步 | identity / process / capability-hub / artifact / governance / UI 的 event + snapshot / query 消费 |
| ResolveViewProfile | 作为 P0 查询解析出口,只描述概要处理流和对象边界 |
| Operations P0 | SeedInitialMethodAssets / ReplayDefinitionEvents / RecalculateFingerprint 等维护入口的概要骨架 |
| P1 位置 | MethodPlugin / MethodConfiguration / marketplace metadata 的后置边界和承接位置 |
| 下游 Use truth 边界 | 明确 QualificationProfile / QualificationBinding / ProcessInstance / WorkItem / Artifact instance 等不归本仓 |

### 3.4 哪些内容虽然相关，但当前不进入概要设计范围？

回答：

以下内容当前不进入本轮概要设计范围:

| 不进入范围 | 原因 | 留给哪一层 |
|---|---|---|
| 完整数据库 schema、索引、约束 | 属于实现契约 | `03-详细设计.md` |
| HTTP / RPC / proto / JSON 完整协议 | 属于协议实现契约 | `03-详细设计.md` |
| Rust struct / enum 完整代码 | 属于详细设计和编码实现 | `03-详细设计.md` / 代码 |
| 完整错误码和恢复策略 | 属于详细设计实现约束 | `03-详细设计.md` |
| 详细测试矩阵 | 属于测试方案 | `05-测试方案.md` |
| 完整验收场景 | 属于验收标准 | `06-验收标准.md` |
| 实施阶段拆分和开发顺序 | 属于实施计划 | `07-实施计划.md` |
| Plugin dependency DAG 算法 | P1 后置,非 P0 主链 | 后续 P1 详细设计 |
| Variability patch 规则 | P1 后置,非 P0 主链 | 后续 P1 详细设计 |
| Marketplace listing / transaction / install record | 不属于本仓真相 | `L6-marketplace` |
| work 直接消费 TaskDefinition | 当前未收稳 | `L1-work` 校准 / 后续 ADR |

### 3.5 哪些内容应留给详细设计，而不应在本章提前展开？

回答：

以下内容必须留给 `03-详细设计.md`:

```text
1. crate / module / file tree
2. 每个模块的完整对象实现契约
3. Rustdoc 注释级 struct / enum / value object 定义
4. application service / domain method / repository trait 函数签名
5. HTTP / RPC / Event / Job schema
6. 逐接口函数级处理流
7. 状态转换矩阵和非法转换错误映射
8. PostgreSQL 表、索引、事务和 outbox 实现
9. 并发、幂等、重试和恢复策略
10. log / metric / trace / audit 埋点
11. 测试切口和最小验证清单
```

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| §2 背景与问题定义 | 背景内容较长,更像需求文档摘要 | 新版 §2 应聚焦“本次设计目标与范围”,而不是重复需求背景 |
| §3 目标与非目标 | 已有目标承接方式,但未明确交付给详细设计的结果 | 不能直接作为 03 的输入门禁 |
| §3.2 目标承接方式 | “概要设计承接点”仍使用旧 A-H 部分名 | 后续若重做主要组成部分,这里会漂移 |
| §3.4 非目标承接方式 | 非目标表达有效,但应转化成范围/非范围表 | 更符合最新书写规范 |
| 全文范围 | P1 Plugin / Configuration 有较大篇幅 | 容易让 P1 看起来像 P0 前置条件 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| §2 主题 | 背景与问题定义 | 本次设计目标与范围 | 背景和问题已由 00/01 收稳,02 应承接而非复述 |
| 目标表达 | 目标来源 + 目标承接方式 | 设计目标表:目标、说明、交付给详细设计的结果 | 最新规范要求说明交付给详细设计什么 |
| 非目标表达 | 非目标来源 + 非目标承接方式 | 非范围表:非范围、留给哪一层 | 让边界可执行、可分派 |
| 深度口径 | 分散在多个章节 | 独立写“当前阶段设计深度口径” | 防止概要设计提前写成详细设计 |
| P1 表达 | 较多功能与数据流 | 只保留位置、边界和后续承接 | P1 不阻塞 P0 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 保留旧 §2 背景与问题定义 | 新人容易理解 | 重复需求文档,占用概要设计主链入口 | 不采用 |
| 把 §2 写成详细的功能范围清单 | 信息完整 | 容易重复 00 功能需求,且提前进入接口细节 | 不采用 |
| 按书写规范写设计目标、非范围、设计深度口径 | 边界清晰,能驱动 03 | 需要把旧背景压缩到上游承接或参考 | 采用 |

---

## 7. 结构化中间产物

### 7.1 设计目标表

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 收稳代码主体框架 | 明确 method-library 的实现主体、层次和模块组如何组织 | `03` 可据此展开 crate / module / file tree |
| 收稳主要组成部分 | 按功能主线定义各部分职责、边界和接缝 | `03` 可据此按模块写实现契约 |
| 收稳关键对象轮廓 | 明确 MethodContent、7 类 definition、发布同步、查询追溯、P1 组合对象的概要结构 | `03` 可继续展开 struct / enum / value object |
| 收稳接口骨架 | 明确 Command / Query / Event / Operations Job 的概要接口族 | `03` 可继续展开协议 schema 和逐接口处理流 |
| 收稳关键处理流 | 明确 P0 发布同步、下游同步、ResolveViewProfile、seed/replay 的概要流程 | `03` 可继续展开函数级调用链、事务和错误分支 |
| 收稳状态流转 | 明确 MethodContent 生命周期和 P1 组合对象状态边界 | `03` 可继续展开状态转换矩阵和非法转换处理 |
| 收稳详细设计承接清单 | 明确哪些内容进入详细设计继续展开 | `03` 的 Step 1 输入边界明确 |

### 7.2 非范围表

| 非范围 | 留给哪一层 |
|---|---|
| 需求目标、用户故事、验收指标重写 | `00-需求文档.md` |
| 系统上下文、架构选型、备选方案取舍重写 | `01-架构设计.md` / ADR |
| 完整 Rust 类型、函数签名、trait 和实现调用链 | `03-详细设计.md` |
| HTTP / RPC / Event / Job 完整 schema | `03-详细设计.md` |
| 数据库表、索引、事务和 outbox 实现细节 | `03-详细设计.md` |
| 完整错误码、恢复策略、幂等重试规则 | `03-详细设计.md` |
| 测试矩阵和测试数据 | `05-测试方案.md` |
| 验收场景和证据要求 | `06-验收标准.md` |
| 实施阶段、任务拆分、提交顺序 | `07-实施计划.md` |
| Marketplace listing / transaction / install record | `L6-marketplace` |
| QualificationProfile | `L1-identity` |
| QualificationBinding / CapabilityAccessDecision | `L3-capability-hub` / governance |
| ProcessInstance / Activity execution | `L1-process` |
| WorkItem / Backlog / Iteration | `L1-work` |
| Artifact instance / evidence instance | `L1-artifact` |

### 7.3 当前阶段设计深度口径

```text
本轮概要设计收敛到代码主体骨架层。

它必须明确:
- 代码主体框架
- 主要组成部分
- 关键对象轮廓
- API / 接口骨架
- 关键处理流
- 状态定义与状态流转
- 详细设计承接清单

它不得提前展开:
- 完整实现代码
- 完整协议 schema
- DDL / 索引
- 完整错误码
- 完整测试方案
- 实施计划
```

---

## 8. 回填草稿

以下内容可回填到新版 `02-概要设计.md` §2。

```md
## 2. 本次设计目标与范围

### 2.1 设计目标

| 目标 | 说明 | 交付给详细设计的结果 |
|---|---|---|
| 收稳代码主体框架 | 明确 method-library 的实现主体、层次和模块组如何组织 | `03` 可据此展开 crate / module / file tree |
| 收稳主要组成部分 | 按功能主线定义各部分职责、边界和接缝 | `03` 可据此按模块写实现契约 |
| 收稳关键对象轮廓 | 明确 MethodContent、7 类 definition、发布同步、查询追溯、P1 组合对象的概要结构 | `03` 可继续展开 struct / enum / value object |
| 收稳接口骨架 | 明确 Command / Query / Event / Operations Job 的概要接口族 | `03` 可继续展开协议 schema 和逐接口处理流 |
| 收稳关键处理流 | 明确 P0 发布同步、下游同步、ResolveViewProfile、seed/replay 的概要流程 | `03` 可继续展开函数级调用链、事务和错误分支 |
| 收稳状态流转 | 明确 MethodContent 生命周期和 P1 组合对象状态边界 | `03` 可继续展开状态转换矩阵和非法转换处理 |
| 收稳详细设计承接清单 | 明确哪些内容进入详细设计继续展开 | `03` 的 Step 1 输入边界明确 |

### 2.2 非范围

| 非范围 | 留给哪一层 |
|---|---|
| 需求目标、用户故事、验收指标重写 | `00-需求文档.md` |
| 系统上下文、架构选型、备选方案取舍重写 | `01-架构设计.md` / ADR |
| 完整 Rust 类型、函数签名、trait 和实现调用链 | `03-详细设计.md` |
| HTTP / RPC / Event / Job 完整 schema | `03-详细设计.md` |
| 数据库表、索引、事务和 outbox 实现细节 | `03-详细设计.md` |
| 完整错误码、恢复策略、幂等重试规则 | `03-详细设计.md` |
| 测试矩阵和测试数据 | `05-测试方案.md` |
| 验收场景和证据要求 | `06-验收标准.md` |
| 实施阶段、任务拆分、提交顺序 | `07-实施计划.md` |
| Marketplace listing / transaction / install record | `L6-marketplace` |
| 下游 Use truth | 对应下游仓 |

### 2.3 当前阶段设计深度口径

本轮概要设计收敛到代码主体骨架层。

本文必须明确代码主体框架、主要组成部分、关键对象轮廓、API / 接口骨架、关键处理流、状态定义与状态流转、详细设计承接清单。

本文不得提前展开完整实现代码、完整协议 schema、DDL / 索引、完整错误码、完整测试方案和实施计划。
```

---

## 9. 待确认事项

| 问题 | 当前建议 | 是否阻塞 Step 2 |
|---|---|---|
| 是否保留旧 §2 背景与问题定义全文 | 不保留为正式主章节;可在 §1/§2 少量吸收必要定位 | 不阻塞 |
| P1 Plugin / Configuration 是否进入设计目标表 | 只进入“P1 位置和边界”,不作为 P0 目标 | 不阻塞 |
| 下游 Use truth 非范围是否逐项列出 | 在正式文档可合并为“下游 Use truth”,详表放 §10 或数据边界 | 不阻塞 |

---

## 10. 进入下一步条件

进入 Step 3 前需要确认:

- [x] 是否同意新版 §2 改为“本次设计目标与范围”
- [x] 是否同意当前设计深度停在代码主体骨架层
- [x] 是否同意 P1 只保留位置和边界,不进入 P0 主链
- [x] 是否同意完整协议、DDL、错误码、测试和实施计划都留给下游文档
