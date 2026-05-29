# Step 17. 收口详细设计到实施计划的承接清单

## 1. Step 状态

- 状态：[x] 已确认
- 所属文档：`projects/L0-bus/03-详细设计.md`
- 本步目标：确认 Step 1~16 已经交付给实施计划的实现契约、实施者开工前必须阅读的材料，以及不得在实施计划中脑补的内容。
- 本步不直接修改正式 `03-详细设计.md`，只形成中间产物。
- 本步不写开发排期、不写任务拆分、不定义 commit boundary。

---

## 2. 本步输入

| 输入 | 关键结论 | 本步使用方式 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 17 | 必须输出实施承接清单、实施前置阅读清单、未进入实施的待确认项 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.16 | 必须包含提交规范、git config 用户、Rust 编码规范、注释规范；不写排期和任务拆分 | 约束正式文档回填 |
| `standards/document/实施计划书写规范.md` | 实施计划负责阶段、代码批次、提交边界、门禁和 commit message | 决定本步与 `07-实施计划.md` 的边界 |
| `standards/coding/rust.md` | 真实实现仓 Rust 标识符、源码注释、rustdoc、测试名默认英文 | 决定实施前置阅读 |
| `projects/README.md` §3.3 / §8.2 | 实施前阅读、git config、design 仓与实现仓提交语言边界 | 决定 git / commit 前置项 |
| `projects/L0-bus/00-需求文档.md` | L0-bus P0 需求和边界 | 作为实施者必读上游 |
| `projects/L0-bus/01-架构设计.md` | L0-bus 在系统中的位置、依赖和通信方式 | 作为实施者必读上游 |
| `projects/L0-bus/02-概要设计.md` | 代码主体框架、主要组成部分、对象、接口、流程和状态机轮廓 | 作为详细设计承接来源 |
| `projects/L0-bus/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_16_test_slices.md` | 已收敛的实现契约中间产物 | 形成实施承接清单 |
| `projects/L0-bus/05-测试方案.md` | 当前测试方案 | 作为 Step 16 后续展开来源 |
| `projects/L0-bus/06-验收标准.md` | 当前验收标准 | 作为实施门禁和验收承接来源 |

已确认结论：

```text
目标实现仓路径: /home/aris/Projects/quantalithos-bus
Step 17 只回答“详细设计已经把什么交给实施计划”。
Step 17 不回答“按几个阶段开发、每阶段提交什么、何时 commit”。
实施计划应引用详细设计章节和 design-calibration 中间产物,不能复制重写对象、函数、协议、状态矩阵或测试表。
真实实现仓不是 quantalithos-design,因此 commit message、源码注释、rustdoc、测试名和标识符默认使用英文。
```

---

## 3. SOP 问题回答

### 3.1 哪些实现契约已经足够进入实施计划？

| 契约类别 | 已收敛内容 | 是否足够进入实施计划 |
|---|---|---|
| 输入边界 | 只承接新版 `00/01/02`，旧版 `03` 只作为诊断材料 | 是 |
| 实现范围 | P0 bus publication / delivery / feedback / recovery / read-only output / job / event / in-memory default path | 是 |
| 编码约束 | Rust、workspace 多 crate、源码英文、设计文档中文 Rustdoc、实现仓 commit 英文 | 是 |
| 文件布局 | `/home/aris/Projects/quantalithos-bus`，`crates/contracts/domain/application/infra/api/worker/jobs` | 是 |
| 模块契约 | `contracts / domain / application / infra / api / worker / jobs` 依赖方向和职责 | 是 |
| 对象契约 | publication、delivery、feedback、recovery、read output、backend、audit、idempotency、config 等对象 | 是 |
| Port / Adapter | repository、source、publisher、transport、projection、clock、id generator、observability 等 port | 是 |
| 协议契约 | Command / Query / Inbound Event / Outbound Event / Operations Job | 是 |
| 函数级处理流 | 每个接口的调用链、事务边界、错误映射和副作用 | 是 |
| 状态机 | publication、delivery、feedback、retry、DLQ、replay、projection 状态与非法转换 | 是 |
| 持久化与一致性 | UoW、repository、唯一约束、version、source ack、publisher、projection 语义 | 是 |
| 错误与恢复 | validation、not found、conflict、boundary、dependency、internal、人工介入 | 是 |
| 并发与幂等 | command / event / job / publisher 的 idempotency、duplicate、version conflict | 是 |
| 配置与依赖 | config binding、in-memory default、`core-contracts` 本地 path dependency、运行期 adapter | 是 |
| 可观测性 | structured log、metrics、audit、trace ref、redaction | 是 |
| 最小测试切口 | 模块、协议、状态机、一致性、幂等、错误、配置、观测和脚本契约 | 是 |

### 3.2 实施者需要先阅读哪些文档？

实施者开始编码前必须先读正式上游和中间产物。Step 19 之前，正式 `03-详细设计.md` 尚未重建完成，因此实施者不得只读旧版 `03`。

| 文档 | 阅读目的 | 是否阻塞编码 |
|---|---|---|
| `projects/L0-bus/00-需求文档.md` | 理解 bus 的用户故事、功能需求、非目标和验收方向 | 是 |
| `projects/L0-bus/01-架构设计.md` | 理解 bus 与 L0-core、publisher、subscriber、observability、governance 的关系 | 是 |
| `projects/L0-bus/02-概要设计.md` | 理解代码主体骨架、主要组成部分、对象、接口、流程和状态机轮廓 | 是 |
| `projects/L0-bus/design-calibration/03_ddd_calibration_flow.md` | 找到详细设计每个 Step 的状态和中间产物 | 是 |
| `projects/L0-bus/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_16_test_slices.md` | 读取正式 `03` 回填前的实现契约来源 | 是 |
| `projects/L0-bus/05-测试方案.md` | 理解 Step 16 测试切口如何继续展开 | 是 |
| `projects/L0-bus/06-验收标准.md` | 理解实现完成后如何验收 | 是 |
| `projects/L0-core/00~07` | 理解已稳定底座仓和 `core-contracts` 本地 path dependency 的来源 | 是 |
| `standards/coding/rust.md` | 理解真实 Rust 源码、注释、rustdoc、测试名、错误和测试风格 | 是 |
| `standards/document/实施计划书写规范.md` | 理解后续 `07-实施计划.md` 如何定义阶段、代码批次、提交边界和门禁 | 是 |
| `standards/document/子项目目录与代码文件组织规范.md` | 理解实现仓目录、crate、package、binary、scripts、reports、artifacts 组织 | 是 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 理解总依赖关系和 L0-bus 应裁剪出的依赖子图 | 是 |
| `projects/README.md` §3.3 / §8.2 | 理解实施前门禁、git config 和 design 仓 / 实现仓提交语言差异 | 是 |
| `/home/aris/Projects/quantalithos-bus` 目标仓历史提交 | 对齐目标仓已有 commit scope、风格和粒度 | 是，若目标仓已存在 |

### 3.3 提交规范、git config 用户、Rust 编码规范和注释规范是否已经列入前置阅读？

已列入，并且实施计划必须继续把它们作为开工门禁。

| 前置项 | 要求 | 来源 |
|---|---|---|
| git config 用户 | 在 `/home/aris/Projects/quantalithos-bus` 内确认 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com` | `projects/README.md`、`standards/document/实施计划书写规范.md` |
| commit message | 实现仓使用英文；标题格式固定为 `type(scope): subject`；body 按子功能分组；AI 参与时保留 `Co-Authored-By: Codex <noreply@openai.com>` | `standards/document/实施计划书写规范.md` |
| Rust 编码规范 | 真实源码标识符、普通注释、rustdoc、测试名默认英文 | `standards/coding/rust.md` |
| 注释规范 | 设计文档中的中文 Rustdoc 只作为语义说明；落到真实代码时应转写为英文 rustdoc / 注释 | Step 3、`standards/coding/rust.md` |
| 提交时机 | 每个实施计划 §6 commit boundary 完成且门禁通过后提交；不按函数、文件或子模块拆碎 | `standards/document/实施计划书写规范.md` |

### 3.4 哪些内容仍待确认，不能进入实施？

| 内容 | 当前状态 | 未确认前处理 |
|---|---|---|
| 正式 `03-详细设计.md` | 尚未执行 Step 19 重建 | 实施计划只能引用 Step 1~17 中间产物，不能声称旧 `03` 已可直接实施 |
| `07-实施计划.md` | 尚未创建 | 本步只提供承接清单；后续按实施计划 SOP 单独生成 |
| 完整 JSON 配置说明 | L0-bus 当前没有 `04-配置设计.md` | Step 14 只作为代码绑定点；完整配置示例和字段说明需后续配置文档落地 |
| 具体 HTTP / MQ / DB 框架选择 | P0 不在详细设计中写死 | 实施计划或配置设计只能在不破坏 port 边界的前提下选择 |
| 真实 durable store / MQ / transport adapter | P0 默认 in-memory / fake 语义 | 生产 adapter 作为 P1 或后续实现，不能阻塞 P0 |
| gateway / auth / token 校验 | 明确不属于 L0-bus | 不进入本仓实施 |
| 完整测试矩阵和 CI 阶段 | Step 16 只定义最小测试切口 | 由 `05-测试方案.md` 和后续实施计划展开 |
| 告警阈值、dashboard、on-call runbook | 不属于详细设计 | 留给 observability / 运维文档 |

### 3.5 实施计划应该如何引用本文，而不是重复本文？

| 实施计划应做 | 实施计划不应做 |
|---|---|
| 按阶段引用正式 `03` 章节和对应 `design-calibration` Step | 复制 Step 6 的 struct / enum / 字段表 |
| 写清每个阶段开工前必须阅读哪些详细设计章节 | 在 `07` 中重新定义对象和函数签名 |
| 把 Step 16 测试切口映射成阶段门禁 | 重写完整测试方案 |
| 把 Step 3 / 实施计划规范中的 git / commit / Rust 规范列为开工门禁 | 发明另一套 commit message 或注释规则 |
| 把 Step 18 风险清单作为实施前待确认输入 | 把未确认项直接写成 P0 开发任务 |

---

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 1~16 中间产物已经很多 | 实施者可能不知道哪些内容需要先读 | 本步给出承接清单和前置阅读清单 |
| 旧版 `03-详细设计.md` 尚未重建 | 若直接交给实现者，可能按旧 envelope / routing / callback schema 口径开发 | 本步明确 Step 19 前以中间产物为准 |
| 实施计划容易复制详细设计正文 | 造成对象、函数、协议和状态机出现两套真相 | 本步规定 `07` 只能引用 `03`，不重写 `03` |
| 提交规范和 git config 容易遗漏 | 实现仓可能出现不合格提交或错误提交身份 | 本步把它们列为阻塞性前置阅读 |
| 配置、测试、验收仍有后续文档职责 | 实施者可能在详细设计阶段脑补细节 | 本步列出未进入实施的事项 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 实施承接 | 只有分散的 Step 1~16 文件 | 形成统一承接清单，可直接供 `07-实施计划.md` 引用 |
| 阅读顺序 | 需要实现者自行推断 | 明确上游设计、详细设计中间产物、测试、验收、编码、提交规范 |
| 提交与注释 | 只在 Step 3 和规范中出现 | 在承接清单中再次变成实施前置门禁 |
| 未确认项 | 分散在各 Step | 先收敛不能进入实施的内容，Step 18 再集中处理风险 |
| 与实施计划关系 | 容易混写任务拆分 | 明确本步不写排期、不写任务拆分、不写 commit boundary |

---

## 6. 设计取舍

### 6.1 是否在 Step 17 直接写实施计划

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：直接写阶段、任务和 commit boundary | 会越过 `07-实施计划.md` 的 SOP | 不采用 |
| 方案 B：只写详细设计交给实施计划的承接清单 | 推荐 |
| 方案 C：只写“可进入实施”一句话 | 太弱，实施者无法判断阅读和引用顺序 | 不采用 |

推荐方案 B。Step 17 是详细设计末尾的交接页，不是实施计划本体。

### 6.2 是否允许实施计划复制详细设计内容

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：复制对象、函数、协议和状态矩阵到 `07` | 短期方便，但会产生两套实现契约 | 不采用 |
| 方案 B：`07` 只引用正式 `03` 章节和中间产物 | 推荐 |
| 方案 C：`07` 完全不引用 `03` | 无法追溯实现任务来源 | 不采用 |

推荐方案 B。实施计划负责执行顺序和门禁，详细设计负责实现契约。

### 6.3 是否在正式 `03` 未重建前启动实现

| 方案 | 说明 | 结论 |
|---|---|---|
| 方案 A：直接按旧 `03` 开发 | 旧口径已不适配新版概要设计 | 不采用 |
| 方案 B：等待 Step 19 重建正式 `03` 后再交付实现 | 推荐 |
| 方案 C：紧急情况下按 Step 1~17 中间产物实现 | 可行，但必须明确旧 `03` 不能作为依据 | 备选 |

推荐方案 B。当前目标是形成可以 1:1 指导实现的正式详细设计，Step 19 是必要收口。

---

## 7. 结构化中间产物

### 7.1 实施承接关系图

```text
00-需求文档
  |
  v
01-架构设计
  |
  v
02-概要设计
  |
  v
03-详细设计
  |
  | implementation contracts
  v
07-实施计划
  |
  | execution order + gates + commit boundaries
  v
/home/aris/Projects/quantalithos-bus
```

关键说明：

- `03-详细设计` 输出实现契约。
- `07-实施计划` 输出执行顺序、代码批次、门禁和提交边界。
- `07` 必须引用 `03` 和 `design-calibration`，不能复制重写详细设计。
- 目标实现目录是 `/home/aris/Projects/quantalithos-bus`，不是当前 design 仓。

### 7.2 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 上游输入边界 | Step 1；正式 §1 | 确认只承接新版需求、架构、概要设计，不沿用旧 `03` 口径 |
| P0 / 非范围 | Step 2；正式 §2 | 控制实现范围，不把 gateway、auth、长期 observability、生产 MQ / DB adapter 纳入 P0 |
| Rust / runtime / 仓库约束 | Step 3；正式 §3 | 确认源码英文、Rust 规范、`core-contracts` 本地 path dependency 和提交规则 |
| Workspace 与文件布局 | Step 4；正式 §4 | 创建 `/home/aris/Projects/quantalithos-bus` workspace 和 `crates/*` 结构 |
| 模块实现契约 | Step 5；正式 §5 | 按 `contracts/domain/application/infra/api/worker/jobs` 组织代码 |
| 对象实现契约 | Step 6；正式 §5 / §6 | 实现领域对象、DTO、状态 enum、值对象和 service 所需类型 |
| Trait / Port / Adapter | Step 7；正式 §5 / §6 | 定义 application ports，由 infra 提供 in-memory / fake / adapter 实现 |
| API / Command / Query / Event / Job | Step 8；正式 §7 | 实现协议 DTO、route / topic / job name、错误映射和 schema |
| 函数级处理流 | Step 9；正式 §8 | 按每个 flow 的调用链、事务边界、错误映射和副作用实现 |
| 状态机 | Step 10；正式 §9 | 实现状态 enum、合法转换、非法转换错误和跨状态机禁止规则 |
| 持久化 / 事务 / 一致性 | Step 11；正式 §10 | 实现 repository、UnitOfWork、唯一约束、version、projection、publisher 语义 |
| 错误模型 / 恢复 | Step 12；正式 §11 | 实现错误 enum、协议映射、retryable / non-retryable / manual action |
| 并发 / 幂等 / 重入 | Step 13；正式 §12 | 实现 idempotency anchor、digest、version conflict、job item 去重 |
| 配置 / 外部依赖 | Step 14；正式 §13 | 实现 `RuntimeConfig`、config loader、runtime builder、adapter binding |
| 可观测性 / 审计 | Step 15；正式 §14 | 实现 log、metric、audit、trace ref、redaction 和 forbidden body 检查 |
| 测试切口 | Step 16；正式 §15 | 将最小测试切口映射到实现阶段门禁，完整展开交给 `05-测试方案.md` |

### 7.3 实施前置阅读清单

| 文档 | 阅读目的 |
|---|---|
| `projects/L0-bus/00-需求文档.md` | 理解 L0-bus 需求、P0 闭环和非目标 |
| `projects/L0-bus/01-架构设计.md` | 理解 L0-bus 的系统位置、依赖方向和通信方式 |
| `projects/L0-bus/02-概要设计.md` | 理解代码主体骨架、主要组成部分、关键对象、接口、流程和状态机 |
| `projects/L0-bus/design-calibration/03_ddd_calibration_flow.md` | 理解详细设计校准状态和 Step 文件位置 |
| `projects/L0-bus/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_17_implementation_handoff.md` | 在正式 `03` 回填前追溯实现契约和取舍 |
| `projects/L0-bus/05-测试方案.md` | 理解测试方案如何承接 Step 16 |
| `projects/L0-bus/06-验收标准.md` | 理解实现完成后的验收门禁 |
| `projects/L0-core/00~07` | 理解稳定底座仓和 `core-contracts` 依赖来源 |
| `standards/coding/rust.md` | 遵守 Rust 源码、注释、rustdoc、测试名和错误处理规范 |
| `standards/document/实施计划书写规范.md` | 后续编写 `07` 时遵守阶段、代码批次、提交边界和 commit message 规则 |
| `standards/document/子项目目录与代码文件组织规范.md` | 遵守实现仓目录、crate、binary、scripts、reports、artifacts 组织 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 从总依赖图中裁剪 L0-bus 自己的编译期、运行期、事件协作依赖 |
| `projects/README.md` §3.3 / §8.2 | 确认实施前门禁、git config 和 design / 实现仓提交语言差异 |

### 7.4 实施前检查清单

| 检查项 | 要求 | 处理方式 |
|---|---|---|
| 目标目录 | 实现目录为 `/home/aris/Projects/quantalithos-bus` | 不在 `quantalithos-design` 内写业务代码 |
| sibling dependency | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 先确认 `/home/aris/Projects/quantalithos-core` 存在 |
| git user.name | `quantalithos-labs` | 在目标实现仓运行 `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | 在目标实现仓运行 `git config user.email` |
| commit message | 实现仓英文，`type(scope): subject` | 按 `standards/document/实施计划书写规范.md` 执行 |
| AI footer | AI 参与时保留 `Co-Authored-By: Codex <noreply@openai.com>` | footer 前必须有空行 |
| Rust 源码语言 | 标识符、rustdoc、普通注释、测试名默认英文 | 设计文档中文注释落码时转写英文 |
| 详细设计来源 | Step 19 前以中间产物为准，Step 19 后以正式 `03` 为准 | 不使用旧版 `03` 作为实现依据 |
| 测试门禁 | 最少覆盖 Step 16 切口 | 完整测试计划引用 `05-测试方案.md` |

### 7.5 未进入实施的待确认项

| 待确认项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| 正式 `03-详细设计.md` 尚未重建 | 不能直接把旧 `03` 交给实现者 | 详细设计维护者 | 完成 Step 19 后再作为正式实施输入 |
| `07-实施计划.md` 尚未创建 | 尚无阶段、代码批次、commit boundary 和门禁 | 实施计划编写者 | 后续按实施计划 SOP 单独生成 |
| L0-bus `04-配置设计.md` 尚未存在 | 完整 JSON 示例、环境变量、profile 还未落地 | 配置文档维护者 | 暂以 Step 14 的代码绑定点为准 |
| 生产 durable store / MQ / transport adapter | P0 只确认 in-memory / fake 默认语义 | 架构负责人 / 后续实现负责人 | 不进入 P0，保留 port / adapter 边界 |
| HTTP / MQ / DB 具体框架 | 详细设计只固定协议和 port，不固定框架 | 实施计划或实现负责人 | 选择时不得破坏模块依赖和协议契约 |
| gateway / auth / token 校验 | 不属于 L0-bus | gateway / identity / security 负责人 | 不进入本仓实施 |
| 告警阈值和 dashboard | 不是详细设计职责 | observability / 运维负责人 | 后续运维文档展开 |

### 7.6 实施计划引用方式

| `07-实施计划.md` 内容 | 应引用 | 不应复制 |
|---|---|---|
| 阶段阅读矩阵 | `03` 正式章节 + 对应 `design-calibration` Step | 全量粘贴 Step 文件 |
| 代码批次 | 详细设计的模块、对象、协议、处理流位置 | 重新定义 struct / enum / trait 字段 |
| 提交边界 | 实施计划自身 §6 commit boundary | 把 Step 17 当作 commit 计划 |
| 测试门禁 | Step 16 测试切口 + `05-测试方案.md` | 在 `07` 中重写完整测试方案 |
| 风险处理 | Step 18 风险与待确认事项 | 把未确认事项改写成默认实现 |

---

## 8. 回填草稿

正式 `03-详细设计.md` 的 §16 按以下方式回填：

```md
## 16. 详细设计到实施计划的承接清单

### 16.1 承接关系图

从 `design-calibration/03_ddd_step_17_implementation_handoff.md` §7.1 摘录。

### 16.2 实施承接清单

从 `design-calibration/03_ddd_step_17_implementation_handoff.md` §7.2 摘录。

### 16.3 实施前置阅读清单

从 `design-calibration/03_ddd_step_17_implementation_handoff.md` §7.3 摘录。

### 16.4 实施前检查清单

从 `design-calibration/03_ddd_step_17_implementation_handoff.md` §7.4 摘录。

### 16.5 未进入实施的待确认项

从 `design-calibration/03_ddd_step_17_implementation_handoff.md` §7.5 摘录。

### 16.6 实施计划引用方式

从 `design-calibration/03_ddd_step_17_implementation_handoff.md` §7.6 摘录。
```

说明：

- §16 只写详细设计到实施计划的交接，不写实施阶段、排期、人员分配或 commit boundary。
- `07-实施计划.md` 必须引用 §16 和相关详细设计章节，而不是重新定义实现契约。
- Step 18 会继续把风险和待确认事项正式收口。

---

## 9. 待确认事项

| 待确认事项 | 方案 | 推荐 | 原因 |
|---|---|---|---|
| 是否等 Step 19 后再交给实现 agent | A. 现在按中间产物交付；B. Step 19 重建正式 `03` 后交付；C. 直接按旧 `03` 交付 | 推荐 B | 旧 `03` 已不适配，正式详设收口后最稳 |
| `07` 是否复制详细设计对象和函数 | A. 复制；B. 只引用章节和 Step；C. 不引用 | 推荐 B | 避免两套实现契约漂移 |
| 没有 `04-配置设计.md` 时是否可实现 config loader | A. 直接脑补完整配置；B. 只按 Step 14 代码绑定点实现最小接口；C. 阻塞所有实现 | 推荐 B | P0 可先保留接口和 in-memory default，完整说明后续补齐 |
| 真实 MQ / durable store 是否进入 P0 | A. 进入；B. 不进入，只保留 port；C. 删除 port | 推荐 B | P0 目标是语义闭环，生产 adapter 后续扩展 |
| 实施前是否必须检查目标仓 git config | A. 必须；B. 可跳过；C. 只看全局配置 | 推荐 A | 目标实现仓在其他目录，不能假设 design 仓配置适用 |

---

## 10. 进入下一步条件

```text
实施计划可以直接承接本文。
实施者开始编码前需要阅读的材料、检查项和不能脑补的边界已经明确。
本步没有写开发排期、任务拆分或 commit boundary。
可以进入 Step 18，集中收口风险与待确认事项。
```
