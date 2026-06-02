# Step 17. 收口详细设计到实施计划的承接清单

> 本文件是 `projects/L1-conversation/03-详细设计.md` 的 Step 17 中间产物。
> 本步只收稳详细设计交给实施计划的承接项、实施前置阅读清单、跨文档闭环复核和不得进入实施的未确认项。
> 本步不写开发排期、不写任务拆分、不定义 commit boundary。
> 正式 `03-详细设计.md` 仍在 Step 19 统一回填,本文件不替代正式详细设计。

## 1. Step 状态

- 状态: `[x] 已完成`
- 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 17
- 回填章节: `projects/L1-conversation/03-详细设计.md` §16 详细设计到实施计划的承接清单

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 1 ~ Step 16 中间产物 | 已收稳上游边界、范围、编码、文件布局、模块、对象、port、协议、处理流、状态、持久化、错误、幂等、配置、观测和测试切口 | 固定实施计划可直接承接的实现契约 |
| `standards/document/详细设计讨论流程_SOP.md` Step 17 | 要求输出实施承接清单、实施前置阅读清单、字段 / DTO / 状态 / phase boundary 复核表、命名一致性复核表和待确认项 | 约束本文件结构 |
| `standards/document/详细设计书写规范.md` §5.16 | 要求包含提交规范、git config 用户、Rust 编码规范、注释规范和跨文档一致性复核 | 约束正式文档回填 |
| `standards/document/设计文档讨论中间产物规范.md` §5.10 | 字段闭环、DTO 构造闭环、状态闭环、phase boundary、命名一致性格式 | 作为跨文档闭环复核输出格式 |
| `standards/document/实施计划书写规范.md` | 阶段、代码批次、提交边界、提交时机、git config、commit message、英文源码规则 | 决定本步与 `07-实施计划.md` 的边界 |
| `standards/coding/rust.md` | 真实实现仓 Rust 标识符、源码注释、rustdoc、测试名默认英文 | 决定实施前置阅读 |
| `projects/README.md` §3.3 / §8.2 | 真实实现仓路径、git user、design 仓与实现仓提交语言边界 | 决定目标目录和提交前置项 |
| `projects/L1-conversation/00-需求文档.md` ~ `02-概要设计.md` | 正式上游需求、架构、概要设计 | 作为实施者必读上游 |
| `projects/L0-core/00~07`、`projects/L0-bus/00~07`、`projects/L0-sdk/00~07`、`projects/L1-identity/00~07` | 已稳定或已讨论的上游 / 相邻仓 | 作为依赖裁剪和编译期 / 运行期边界来源 |

已确认结论:

```text
目标实现仓路径: /home/aris/Projects/quantalithos-conversation
当前本机尚未发现该实现仓;实施计划或实现 agent 负责创建。
Step 17 只回答“详细设计已经把什么交给实施计划”。
Step 17 不回答“按几个阶段开发、每阶段提交什么、何时 commit”。
实施计划应引用详细设计章节和 design-calibration 中间产物,不能复制重写对象、函数、协议、状态矩阵或测试表。
真实实现仓不是 quantalithos-design,因此 commit message、源码注释、rustdoc、测试名和标识符默认使用英文。
```

## 3. SOP 问题回答

### 3.1 哪些实现契约已经足够进入实施计划？

| 契约类别 | 已收敛内容 | 是否足够进入实施计划 |
|---|---|---|
| 输入边界 | 只承接新版 `00/01/02`,旧版 `03` 只作为诊断材料 | 是 |
| 实现范围 | P0 Conversation truth center、space / scope、fact、manifestation、authorized query、trace / review、projection、outbox、handoff、operations job | 是 |
| 编码约束 | Rust 2024、workspace 多 crate、源码英文、`core-contracts` 本地 path dependency、实现仓英文 commit | 是 |
| 文件布局 | `/home/aris/Projects/quantalithos-conversation`,7 个 crate: `contracts/domain/application/infra/api/worker/jobs` | 是 |
| 模块契约 | `contracts / domain / application / infra / api / worker / jobs` 依赖方向和职责 | 是 |
| 对象契约 | truth、space、scope、fact、receipt、manifestation、snapshot、trace、review、handoff、projection、reference、outbox、policy | 是 |
| Port / Adapter | repository、resolver、publisher、handoff、UnitOfWork、idempotency、clock、id generator | 是 |
| 协议契约 | 10 Command、11 Query、6 Inbound Consumer、9 Outbound Event、9 Operations Job | 是 |
| 函数级处理流 | 45 个 flow 的调用链、事务边界、错误映射和副作用 | 是 |
| 状态机 | 14 组正式状态 enum、合法转换、非法转换和错误 / evidence | 是 |
| 持久化与一致性 | data ownership、collection / projection、repository、transaction、outbox、handoff、recovery | 是 |
| 错误与恢复 | protocol / application / domain / repository / resolver / publish / handoff / job 错误 | 是 |
| 并发与幂等 | command / consumer / outbound event / job 幂等、重复请求、version / sequence 冲突和重入 | 是 |
| 配置与依赖 | config binding、fake / in-memory default、runtime builder、唯一 Cargo path dependency | 是 |
| 可观测性 | structured log、metrics、audit / evidence、trace ref、redaction 和 forbidden field | 是 |
| 最小测试切口 | 模块、接口、状态机、一致性 / 幂等、脚本契约 | 是 |

### 3.2 实施者需要先阅读哪些文档？

实施者开始编码前必须先读正式上游和详细设计中间产物。Step 19 之前,正式 `03-详细设计.md` 尚未重建完成,因此实施者不得只读旧版 `03`。

| 文档 | 阅读目的 | 是否阻塞编码 |
|---|---|---|
| `projects/L1-conversation/00-需求文档.md` | 理解 Conversation 的需求边界、P0 闭环和非目标 | 是 |
| `projects/L1-conversation/01-架构设计.md` | 理解系统位置、依赖方向、通信方式、数据所有权和横切关注点 | 是 |
| `projects/L1-conversation/02-概要设计.md` | 理解代码主体骨架、主要组成部分、关键对象、接口、处理流、状态机和配置影响 | 是 |
| `projects/L1-conversation/design-calibration/03_ddd_calibration_flow.md` | 找到详细设计每个 Step 的状态和中间产物 | 是 |
| `projects/L1-conversation/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_17_implementation_handoff.md` | 读取正式 `03` 回填前的实现契约来源 | 是 |
| `projects/L0-core/00~07` | 理解 `core-contracts`、ID、ActorRef、TraceContext、metadata、error、evidence 基线 | 是 |
| `projects/L0-bus/00~07` | 理解事件协作主干、outbox / publish / retry / evidence 口径 | 是 |
| `projects/L0-sdk/00~07` | 理解下游 client / SDK 消费边界,不得让本仓反向依赖 SDK | 是 |
| `projects/L1-identity/00~07` | 理解 actor / participant / AI member 引用来源和身份边界 | 是 |
| `standards/coding/rust.md` | 遵守真实实现仓 Rust 源码、注释、rustdoc、测试名和错误处理规范 | 是 |
| `standards/document/实施计划书写规范.md` | 后续编写 `07` 时遵守阶段、代码批次、提交边界和 commit message 规则 | 是 |
| `standards/document/子项目目录与代码文件组织规范.md` | 遵守实现仓目录、crate、binary、scripts、reports、artifacts 组织 | 是 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 从总依赖图中裁剪 L1-conversation 自己的依赖子图 | 是 |
| `projects/README.md` §3.3 / §8.2 | 确认实现仓路径、实施前门禁、git config 和 design / 实现仓提交语言差异 | 是 |
| `/home/aris/Projects/quantalithos-core` | 确认 `core-contracts` sibling repo path dependency 真实存在 | 是 |

### 3.3 提交规范、git config 用户、Rust 编码规范和注释规范是否已经列入前置阅读？

已列入,并且实施计划必须继续把它们作为开工门禁。

| 前置项 | 要求 | 来源 |
|---|---|---|
| git config 用户 | 在 `/home/aris/Projects/quantalithos-conversation` 内确认 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com` | `projects/README.md`、`standards/document/实施计划书写规范.md` |
| commit message | 实现仓使用英文;标题格式固定为 `type(scope): subject`;body 按子功能分组;AI 参与时保留 `Co-Authored-By: Codex <noreply@openai.com>` | `standards/document/实施计划书写规范.md` |
| Rust 编码规范 | 真实源码标识符、普通注释、rustdoc、测试名默认英文 | `standards/coding/rust.md` |
| 注释规范 | 设计文档中文 Rustdoc 只作为语义说明;落到真实代码时应转写为英文 rustdoc / 注释 | Step 3、`standards/coding/rust.md` |
| 提交时机 | 每个实施计划 §6 commit boundary 完成且门禁通过后提交;不按函数、文件或子模块拆碎 | `standards/document/实施计划书写规范.md` |

### 3.4 每个 Domain 必填字段是否能回指 DTO、event、派生规则、查表规则或系统生成规则？

结论:通过初步复核。Step 6 的必填字段已在 Step 8 的 DTO 构造闭环、Step 9 的处理流和 Step 11 的 repository / id generator / resolver 规则中找到来源。

具体字段闭环见 §7.5。

### 3.5 每个 Command / Event / Job 是否能构造目标对象,或明确缺失处理？

结论:通过初步复核。Step 8 §7.8 已给出 DTO 构造闭环总表,Step 9 为每个 flow 写明 repository 查询、resolver 派生、系统生成和缺失处理。缺失字段按 `ProtocolError`、`DomainError`、quarantine、unresolved marker 或 failed job receipt 处理。

具体 DTO 构造闭环见 §7.6。

### 3.6 状态枚举、状态图、测试切口、验收口径是否使用同一套正式状态名？

结论:详细设计线内部通过。Step 10 的状态集合与 Step 6 enum 变体一致,Step 16 的状态机测试切口沿用 Step 10 状态名。`05-测试方案.md` 和 `06-验收标准.md` 尚未针对 L1-conversation 生成,因此正式测试 / 验收口径需在后续文档中引用 Step 10 / Step 16,不得另起旧名。

具体状态闭环见 §7.7。

### 3.7 当前 phase / commit boundary 是否误用了后续 phase 才定义的对象、结果或证据？

结论:详细设计本身没有定义实施 phase / commit boundary,因此不存在“当前 commit 误用后续对象”的直接冲突。后续 `07-实施计划.md` 必须以 Step 17 的 phase boundary 复核为输入,每个 phase / commit boundary 开工前再做字段、DTO、状态、phase boundary 检查。

具体 phase boundary 复核见 §7.8。

### 3.8 哪些字段、状态、函数、用例或证据仍有旧名、口语名或别名漂移？

详细设计中已废弃旧版 `Conversation / Turn / StreamEvents / AG-UI / event-to-turn mapping` 主线。当前正式命名主线是:

```text
Conversation truth / space / scope / fact / manifestation / trace / projection / outbox / handoff
```

后续正式 `03`、测试方案、验收标准和实施计划必须继续使用这套名称。命名一致性复核见 §7.9。

### 3.9 哪些内容仍待确认,不能进入实施？

| 内容 | 当前状态 | 未确认前处理 |
|---|---|---|
| 正式 `03-详细设计.md` | 尚未执行 Step 19 重建 | 实施计划只能引用 Step 1~17 中间产物,不能声称旧 `03` 已可直接实施 |
| `04-配置设计.md` | 尚未创建 | Step 14 只作为代码绑定点;完整配置示例和字段说明需后续配置设计落地 |
| `05-测试方案.md`、`06-验收标准.md` | 尚未按新版详细设计重建 | 后续必须引用 Step 16 和 Step 17 复核表,不得另起状态名或测试口径 |
| `07-实施计划.md` | 尚未创建 | 本步只提供承接清单;后续按实施计划 SOP 单独生成 |
| 生产 DB / MQ / HTTP 框架选择 | P0 不在详细设计中写死 | 只能在不破坏 port / adapter 边界下由实施计划或配置设计选择 |
| 真实相邻仓 runtime adapter | P0 可 fake / in-memory | 生产 adapter 作为后续实现,不能阻塞 P0 truth center 闭环 |

### 3.10 实施计划应该如何引用本文,而不是重复本文？

| 实施计划应做 | 实施计划不应做 |
|---|---|
| 按阶段引用正式 `03` 章节和对应 `design-calibration` Step | 复制 Step 6 的 struct / enum / 字段表 |
| 写清每个阶段 / commit boundary 开工前必须阅读哪些详细设计章节和中间产物 | 在 `07` 中重新定义对象和函数签名 |
| 把 Step 16 测试切口映射成阶段门禁 | 重写完整测试方案 |
| 把 Step 3 / 实施计划规范中的 git / commit / Rust 规范列为开工门禁 | 发明另一套 commit message 或注释规则 |
| 把 Step 17 / Step 18 复核和风险清单作为实施前待确认输入 | 把未确认项直接写成 P0 开发任务 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 本步处理 |
|---|---|---|
| Step 1~16 中间产物已经很多 | 实施者可能不知道哪些内容需要先读 | 本步给出承接清单和前置阅读清单 |
| 旧版 `03-详细设计.md` 尚未重建 | 若直接交给实现者,可能按旧 Turn / StreamEvents / AG-UI 口径开发 | 本步明确 Step 19 前以中间产物为准 |
| 实施计划容易复制详细设计正文 | 造成对象、函数、协议和状态机出现两套真相 | 本步规定 `07` 只能引用 `03` 和中间产物,不重写 `03` |
| 新版 SOP 要求跨文档闭环复核 | 若不复核,实现 agent 会被迫自行补字段、选状态名或调整 phase scope | 本步补字段、DTO、状态、phase、命名复核表 |
| 提交规范和 git config 容易遗漏 | 实现仓可能出现不合格提交、中文源码注释或错误提交身份 | 本步把它们列为阻塞性前置阅读 |
| 配置、测试、验收仍有后续文档职责 | 实施者可能在详细设计阶段脑补细节 | 本步列出未进入实施的事项 |

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 实施承接 | 只有分散的 Step 1~16 文件 | 形成统一承接清单,可直接供 `07-实施计划.md` 引用 |
| 阅读顺序 | 需要实现者自行推断 | 明确上游设计、详细设计中间产物、相邻仓、编码、提交规范 |
| 字段 / DTO / 状态复核 | 分散在 Step 6 / 8 / 9 / 10 / 16 | 收口为跨文档闭环复核表 |
| phase boundary | 详细设计未定义实施 phase | 明确由后续实施计划按 commit boundary 继续复核 |
| 提交与注释 | 只在 Step 3 和规范中出现 | 在承接清单中再次变成实施前置门禁 |
| 与实施计划关系 | 容易混写任务拆分 | 明确本步不写排期、不写任务拆分、不写 commit boundary |

## 6. 设计取舍

| 决策点 | 方案 A | 方案 B | 推荐 | 原因 |
|---|---|---|---|---|
| 是否在 Step 17 直接写实施计划 | 写阶段、任务和 commit boundary | 只写承接清单和复核结果 | B | 阶段和提交边界属于 `07-实施计划.md` |
| 是否允许实施计划复制详细设计内容 | 复制对象、函数、协议和状态矩阵 | 只引用正式 `03` 章节和中间产物 | B | 避免两套实现契约漂移 |
| 是否在正式 `03` 未重建前启动实现 | 直接按旧 `03` 开发 | 等 Step 19 重建正式 `03`;紧急时只能按中间产物并明确旧 `03` 不可用 | B | 旧 `03` 已与新版概要设计不一致 |
| 是否把所有跨文档复核放到 Step 19 | Step 19 再复核 | Step 17 先复核,Step 19 汇总时再校对 | B | 实施承接前必须证明实现者不需要自行选边 |
| 是否把配置 / 测试 / 验收缺口写成实施任务 | 写成 P0 开发任务 | 标为后续文档待生成,不得脑补 | B | 配置、测试、验收有独立 SOP |

## 7. 结构化中间产物

### 7.1 实施承接关系图

#### 承接关系图: detailed design to implementation plan

```text
[00-需求文档]
  | scope / requirement
  v
[01-架构设计]
  | boundary / dependency
  v
[02-概要设计]
  | code subject / object / flow outline
  v
[03-详细设计 Step 1-17]
  | implementation contracts
  v
[07-实施计划]
  | phase / batch / gate / commit boundary
  v
[/home/aris/Projects/quantalithos-conversation]
```

关键说明:

- `03-详细设计` 输出实现契约。
- `07-实施计划` 输出执行顺序、代码批次、门禁和提交边界。
- `07` 必须引用 `03` 和 `design-calibration`,不能复制重写详细设计。
- 目标实现目录是 `/home/aris/Projects/quantalithos-conversation`,不是当前 design 仓。

### 7.2 实施承接清单

| 承接项 | 已定义位置 | 实施者如何使用 |
|---|---|---|
| 上游输入边界 | Step 1;正式 §1 | 确认只承接新版需求、架构、概要设计,不沿用旧 `03` 口径 |
| P0 / 非范围 | Step 2;正式 §2 | 控制实现范围,不把 Chat UI、Workspace 聚合、Runtime 推理、Bridge 协议、生产 observability 纳入 P0 |
| Rust / runtime / 仓库约束 | Step 3;正式 §3 | 确认源码英文、Rust 规范、`core-contracts` 本地 path dependency 和提交规则 |
| Workspace 与文件布局 | Step 4;正式 §4 | 创建 `/home/aris/Projects/quantalithos-conversation` workspace 和 `crates/*` 结构 |
| 模块实现契约 | Step 5;正式 §5 | 按 `contracts/domain/application/infra/api/worker/jobs` 组织代码 |
| 对象实现契约 | Step 6;正式 §5 / §6 | 实现领域对象、状态 enum、值对象、policy 和 service 所需类型 |
| Trait / Port / Adapter | Step 7;正式 §5 / §6 | 定义 application ports,由 infra 提供 in-memory / fake / adapter 实现 |
| API / Command / Query / Event / Job | Step 8;正式 §7 | 实现协议 DTO、route / topic / job name、错误映射和 schema |
| 函数级处理流 | Step 9;正式 §8 | 按每个 flow 的调用链、事务边界、错误映射和副作用实现 |
| 状态机 | Step 10;正式 §9 | 实现状态 enum、合法转换、非法转换错误和跨状态机禁止规则 |
| 持久化 / 事务 / 一致性 | Step 11;正式 §10 | 实现 repository、UnitOfWork、唯一约束、version、projection、publisher 语义 |
| 错误模型 / 恢复 | Step 12;正式 §11 | 实现错误 enum、协议映射、retryable / non-retryable / manual action |
| 并发 / 幂等 / 重入 | Step 13;正式 §12 | 实现 idempotency anchor、request digest、version conflict、job item 去重 |
| 配置 / 外部依赖 | Step 14;正式 §13 | 实现 `RuntimeConfig`、config loader、runtime builder、adapter binding |
| 可观测性 / 审计 | Step 15;正式 §14 | 实现 log、metric、audit / evidence、trace ref、redaction 和 forbidden body 检查 |
| 测试切口 | Step 16;正式 §15 | 将最小测试切口映射到实现阶段门禁,完整展开交给 `05-测试方案.md` |

### 7.3 实施前置阅读清单

| 文档 | 阅读目的 |
|---|---|
| `projects/L1-conversation/00-需求文档.md` | 理解 L1-conversation 需求、P0 闭环和非目标 |
| `projects/L1-conversation/01-架构设计.md` | 理解系统位置、依赖方向、通信方式和数据所有权 |
| `projects/L1-conversation/02-概要设计.md` | 理解代码主体骨架、主要组成部分、关键对象、接口、流程和状态机 |
| `projects/L1-conversation/design-calibration/03_ddd_calibration_flow.md` | 理解详细设计校准状态和 Step 文件位置 |
| `projects/L1-conversation/design-calibration/03_ddd_step_01_upstream_boundary.md` ~ `03_ddd_step_17_implementation_handoff.md` | 在正式 `03` 回填前追溯实现契约和取舍 |
| `projects/L0-core/00~07` | 理解稳定底座仓和 `core-contracts` 依赖来源 |
| `projects/L0-bus/00~07` | 理解事件协作、outbox、retry、dead-letter、replay 和 evidence 口径 |
| `projects/L0-sdk/00~07` | 理解下游 SDK 消费边界 |
| `projects/L1-identity/00~07` | 理解 actor、participant、AI member 和系统 actor 引用来源 |
| `standards/coding/rust.md` | 遵守 Rust 源码、注释、rustdoc、测试名和错误处理规范 |
| `standards/document/实施计划书写规范.md` | 后续编写 `07` 时遵守阶段、代码批次、提交边界和 commit message 规则 |
| `standards/document/子项目目录与代码文件组织规范.md` | 遵守实现仓目录、crate、binary、scripts、reports、artifacts 组织 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 从总依赖图中裁剪 L1-conversation 自己的编译期、运行期、事件协作依赖 |
| `projects/README.md` §3.3 / §8.2 | 确认实施前门禁、git config 和 design / 实现仓提交语言差异 |

### 7.4 实施前检查清单

| 检查项 | 要求 | 处理方式 |
|---|---|---|
| 目标目录 | 实现目录为 `/home/aris/Projects/quantalithos-conversation` | 不在 `quantalithos-design` 内写业务代码 |
| 目标仓状态 | 当前目标仓尚未存在 | 由实施计划或实现 agent 创建并初始化 |
| sibling dependency | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 先确认 `/home/aris/Projects/quantalithos-core` 存在 |
| Cargo dependency | 只有 `core-contracts` 是编译期 path dependency | 不添加 bus / identity / work / governance / artifact / runtime / bridge / sdk / chat / workspace crate 依赖 |
| git user.name | `quantalithos-labs` | 在目标实现仓运行 `git config user.name` |
| git user.email | `quantalithos.ai@gmail.com` | 在目标实现仓运行 `git config user.email` |
| commit message | 实现仓英文,`type(scope): subject` | 按 `standards/document/实施计划书写规范.md` 执行 |
| AI footer | AI 参与时保留 `Co-Authored-By: Codex <noreply@openai.com>` | footer 前必须有空行 |
| 源码语言 | 标识符、普通注释、rustdoc、测试名默认英文 | 不复制设计文档中的中文说明为源码注释 |
| 开工前设计复核 | 每个 phase / commit boundary 开工前复核字段、DTO、状态、phase boundary | 由 `07-实施计划.md` 阶段阅读矩阵继续细化 |

### 7.5 字段闭环表

| Domain 对象 | 字段 | 类型 | 字段来源 | 构造入口 | DTO / Event 字段 | 缺失处理 | 测试覆盖 | 验收证据 |
|---|---|---|---|---|---|---|---|---|
| `ConversationSpace` | `space_id` | `ConversationSpaceId` | `IdGeneratorPort` 或 request 指定策略 | `CreateConversationSpaceFlow` | `CreateConversationSpaceRequest.space_id?` | 缺失则系统生成;冲突返回 conflict | `CreateConversationSpace_contract` | 后续 `05/06` 引用 |
| `ParticipantScope` | `participants` | `Vec<ConversationParticipantRef>` | command request 或 identity resolver / repository | `CreateConversationSpaceFlow`、`UpdateParticipantScopeFlow` | `participants` / `participant_scope_patch` | 缺失或不可解析则 reject / unresolved marker | `UpdateParticipantScope_contract` | 后续 `05/06` 引用 |
| `VisibilityScope` | `visibility_rules` | `VisibilityRuleSet` | command request、policy default、repository current scope | `CreateConversationSpaceFlow`、`UpdateVisibilityScopeFlow` | `visibility_rules` / `default_visibility` | 缺失按 default;非法扩张 reject | `UpdateVisibilityScope_contract` | 后续 `05/06` 引用 |
| `ConversationFact` | `fact_source_ref` | `FactSourceRef` | command、runtime event、bridge event、manifestation | `AppendConversationFactFlow`、inbound consumers | `source_ref` / event source fields | 缺失或 forbidden body 则 reject / quarantine | `AppendConversationFact_contract` | 后续 `05/06` 引用 |
| `FactAppendReceipt` | `append_result` | `FactAppendResult` | application idempotency / domain append decision | `AppendConversationFactFlow`、`RetractConversationFactFlow` | command metadata + idempotency key | 缺 idempotency key reject | `append_receipt_outcome_immutable` | 后续 `05/06` 引用 |
| `CrossDomainManifestation` | `external_fact_ref` | `ExternalFactRef` | command request 或 inbound event | `ManifestExternalFactFlow`、source consumers | `external_fact_ref` / event source refs | 缺失 reject;不可解析 unresolved | `ManifestExternalFact_contract` | 后续 `05/06` 引用 |
| `ExternalFactSnapshot` | `source_digest` | `ExternalSourceDigest` | resolver 或 inbound event digest | `ManifestExternalFactFlow`、`RefreshExternalReferenceSnapshotsFlow` | `source_digest` / event digest | digest mismatch 写 evidence | `digest_mismatch_records_evidence` | 后续 `05/06` 引用 |
| `ConversationTraceContext` | `trace_context_id` | `ConversationTraceContextId` | `IdGeneratorPort` / trace factory | fact、manifestation、review、handoff flow | `trace_ref` / generated trace context | 缺失系统生成;过期按 retention 处理 | `GetConversationTraceContext_contract` | 后续 `05/06` 引用 |
| `ReviewAnchor` | `target_ref` | `ReviewTargetRef` | command + repository lookup | `CreateReviewAnchorFlow` | `target_ref` | target missing / hidden reject | `CreateReviewAnchor_contract` | 后续 `05/06` 引用 |
| `TraceHandoffRecord` | `handoff_payload_ref` | `TraceHandoffPayloadRef` | trace handoff material builder | `RequestTraceHandoffFlow` | `trace_context_id` + `destination_ref` | 缺 trace context reject;forbidden body reject | `DeliverTraceHandoff_contract` | 后续 `05/06` 引用 |
| `ArchiveHandoffRecord` | `retention_policy_ref` | `TraceRetentionPolicyRef` | config / retention policy lookup | `RequestArchiveHandoffFlow` | `retention_policy_ref?` | 缺失取默认或 reject | `DeliverArchiveHandoff_contract` | 后续 `05/06` 引用 |
| `ConversationOutboxRecord` | `truth_ref` / `payload_ref` | `ConversationTruthRef` / `ConversationOutboxPayloadRef` | committed truth、projection state、handoff intent | command / consumer / publish flows | generated from committed object | truth ref 缺失则不生成 event | `outbox_publish_retry_does_not_rollback_truth` | 后续 `05/06` 引用 |
| `ConversationProjectionState` | `freshness_state` | `ProjectionFreshnessState` | command / consumer / job state update | projection jobs、visibility update、source consumers | job input / source position | source gap -> stale / failed marker | `projection_rebuild_failure_exposes_failed_marker` | 后续 `05/06` 引用 |
| `ConversationChangeCursor` | `last_outbox_sequence` | `ConversationOutboxSequence` | outbox repository / cursor maintenance | query / cursor maintenance job | cursor request / job scope | sequence gap -> stale;expired not resumable | `cursor_sequence_never_regresses` | 后续 `05/06` 引用 |

### 7.6 DTO / Event / Job 到 Domain 对象构造闭环表

| DTO / Event / Job | 目标 Domain 对象 | 构造闭环结论 | 字段来源 | 缺失处理 | 测试覆盖 | 验收证据 |
|---|---|---|---|---|---|---|
| `CreateConversationSpaceRequest` | `ConversationSpace`、`ParticipantScope`、`VisibilityScope`、`ConversationOutboxRecord` | 闭合 | request、actor、id generator、policy default | missing actor / invalid participant reject | `CreateConversationSpace_contract` | 后续 `05/06` 引用 |
| `CloseConversationSpaceRequest` | `ConversationSpace` state、`ScopeChangeRecord`、outbox | 闭合 | repository current space、actor、reason | not found / already closed reject or existing result | `CloseConversationSpace_contract` | 后续 `05/06` 引用 |
| `UpdateParticipantScopeRequest` | `ParticipantScope`、`ScopeChangeRecord`、outbox | 闭合 | request patch、repository current scope、actor resolver | invalid participant reject / unresolved | `UpdateParticipantScope_contract` | 后续 `05/06` 引用 |
| `UpdateVisibilityScopeRequest` | `VisibilityScope`、`ConversationProjectionState`、outbox | 闭合 | request rules、repository current scope | sealed expansion reject | `UpdateVisibilityScope_contract` | 后续 `05/06` 引用 |
| `AppendConversationFactRequest` | `ConversationFact`、`FactAppendReceipt`、`ConversationTraceContext`、outbox | 闭合 | request、space / scope repository、id generator | forbidden body reject;duplicate receipt | `AppendConversationFact_contract` | 后续 `05/06` 引用 |
| `RetractConversationFactRequest` | fact state、receipt、trace、outbox | 闭合 | current fact repository、actor、reason | fact missing / terminal reject | `RetractConversationFact_contract` | 后续 `05/06` 引用 |
| `ManifestExternalFactRequest` | `ExternalFactSnapshot`、`CrossDomainManifestation`、optional fact、trace、outbox | 闭合 | request external ref、resolver、visibility policy | unresolved marker / reject | `ManifestExternalFact_contract` | 后续 `05/06` 引用 |
| `CreateReviewAnchorRequest` | `ReviewAnchor`、trace、outbox | 闭合 | target lookup、actor、reason ref | target missing / not visible reject | `CreateReviewAnchor_contract` | 后续 `05/06` 引用 |
| `RequestTraceHandoffRequest` | `TraceHandoffRecord`、outbox | 闭合 | trace context repository、destination config / request | missing trace reject | `RequestTraceHandoff_contract` | 后续 `05/06` 引用 |
| `RequestArchiveHandoffRequest` | `ArchiveHandoffRecord`、outbox | 闭合 | trace context / space repository、retention policy | scope invalid / policy reject | `RequestArchiveHandoff_contract` | 后续 `05/06` 引用 |
| `InboundEventEnvelope<T>` | external ref、snapshot、fact、manifestation、projection state | 闭合 | event id、source ref、event fields、resolver / routing rule | invalid envelope quarantine | consumer contract tests | 后续 `05/06` 引用 |
| `ConversationOutboxRecord` | outbound event payload | 闭合 | committed truth / outbox / projection state | missing committed truth -> do not publish | event + publisher tests | 后续 `05/06` 引用 |
| `*Job` inputs | projection / outbox / handoff / snapshot / cursor / report state | 闭合 | job scope、repository page、config, resolver / handoff port | invalid input -> failed job receipt | job runner tests | 后续 `05/06` 引用 |

### 7.7 状态闭环表

| 状态集合 | 定义位置 | 处理流位置 | 测试切口位置 | 结论 | 未关闭问题 |
|---|---|---|---|---|---|
| `ConversationTruthState` | Step 6 / Step 10 | Step 9 Command / handoff flows | Step 16 §7.4 | 通过 | 无 |
| `ConversationSpaceLifecycleState` | Step 6 / Step 10 | `CreateConversationSpaceFlow`、`CloseConversationSpaceFlow` | Step 16 §7.4 | 通过 | 无 |
| `ParticipantScopeState` / `VisibilityScopeState` / `ScopeChangeState` | Step 6 / Step 10 | scope command flows | Step 16 §7.4 | 通过 | 无 |
| `ConversationFactState` / `FactAppendResult` | Step 6 / Step 10 | append / retract / consumer flows | Step 16 §7.4 | 通过 | 无 |
| `ManifestationState` / `ReferenceResolutionState` | Step 6 / Step 10 | manifest / source consumer / refresh job | Step 16 §7.4 | 通过 | 无 |
| `ProjectionFreshnessState` / `ConversationChangeCursorState` | Step 6 / Step 10 | query / projection / cursor jobs | Step 16 §7.4 | 通过 | 后续 `05/06` 必须沿用正式状态名 |
| `ConversationOutboxPublicationState` | Step 6 / Step 10 | outbox publish flows | Step 16 §7.4 | 通过 | 无 |
| `TraceRetentionState` / `TraceHandoffState` / `ArchiveHandoffState` | Step 6 / Step 10 | trace / archive command + job flows | Step 16 §7.4 | 通过 | 无 |

### 7.8 Phase Boundary 复核表

| Phase / commit boundary | 本阶段允许对象 / API / flow | 本阶段排除内容 | 前置条件 | 后续 phase item | 测试覆盖 | 验收证据 |
|---|---|---|---|---|---|---|
| 详细设计阶段 | Step 1~17 中间产物和正式 `03` 回填 | 实施 phase、commit boundary、开发排期 | Step 1~16 已完成 | `07-实施计划.md` 阶段化 | Step 16 最小切口 | 后续 `06` 引用 |
| 实施计划阶段 | 阶段、批次、门禁、commit boundary | 新增对象字段、状态名、协议字段 | 以正式 `03` + 本 Step 复核为真相源 | 代码实现 | `05-测试方案.md` + Step 16 | `06-验收标准.md` |
| 代码实现阶段 | 按 `07` 执行当前 phase / commit boundary | 自行补设计、改 DTO、改状态名、引入未确认依赖 | 每个 boundary 开工前做字段 / DTO / 状态 / phase 复核 | 后续 phase 只能在 `07` 中定义 | 每 boundary 门禁 | reports / artifacts |

结论:

```text
当前详细设计没有定义实施 phase 或 commit boundary。
后续 `07-实施计划.md` 必须按 phase / commit boundary 重新展开本表,不能只引用一个全局通过结论。
```

### 7.9 命名一致性表

| 名称类别 | 正式名称 | 禁止旧名 / 别名 | 来源 | 结论 |
|---|---|---|---|---|
| 仓库名 | `quantalithos-conversation` | `L1-conversation` 作为实现仓名、`l1_conversation` | Step 3 / Step 4 | 通过 |
| crate 目录 | `contracts/domain/application/infra/api/worker/jobs` | `l1_core_*`、`conversation_truth_core` crate | Step 4 / Step 5 | 通过 |
| 业务主线 | `Conversation truth / scope / fact / manifestation / trace / projection / outbox / handoff` | `Turn`、`StreamEvents`、`AG-UI`、`event-to-turn mapping` 作为实现主线 | Step 1 / Step 5 / Step 9 | 通过 |
| fact 状态 | `Accepted / VisibilityRestricted / Retracted / Quarantined` | `committed` 作为 enum 变体、`deleted` | Step 6 / Step 10 | 通过 |
| projection 状态 | `Fresh / Stale / Rebuilding / Failed / Disabled` | `current`、`invalid` 作为投影正式状态名 | Step 6 / Step 10 | 通过 |
| outbox 状态 | `Pending / Published / RetryPending / Failed / Suppressed` | `sent`、`dispatched`、`timed_out` | Step 6 / Step 10 | 通过 |
| handoff 状态 | `Pending / HandedOff / RetryPending / Failed / Cancelled`、`Archived` | `delivered` 混用为 trace handoff 状态 | Step 6 / Step 10 | 通过 |
| forbidden field | `forbidden body`、`payload_ref`、`safe snapshot` | raw body、source body、reasoning body 进入 truth | Step 12 / Step 15 | 通过 |
| 实现仓提交 | 英文 commit message | design 仓中文 commit 口径 | Step 3 / standards | 通过 |

### 7.10 跨文档一致性复核表

| 复核项 | 设计位置 | 下游位置 | 结论 | 未关闭问题 |
|---|---|---|---|---|
| 字段闭环 | Step 6 / Step 8 / Step 9 / Step 11 / 本文件 §7.5 | `05` / `06` / `07` 待生成 | 通过 | 下游文档必须引用本表,不得另起字段来源 |
| DTO 构造闭环 | Step 8 §7.8 / Step 9 / 本文件 §7.6 | `05` / `06` / `07` 待生成 | 通过 | 下游文档必须以 Step 8 / 9 为真相源 |
| 状态闭环 | Step 6 / Step 10 / Step 16 / 本文件 §7.7 | `05` / `06` / `07` 待生成 | 通过 | 下游文档必须沿用 Step 10 正式状态名 |
| 处理流闭环 | Step 8 / Step 9 / Step 16 | `05` / `07` 待生成 | 通过 | `07` 不得拆出没有处理流来源的任务 |
| phase boundary | 本文件 §7.8 | `07` 待生成 | 当前详细设计通过 | `07` 必须按 phase / commit boundary 重新复核 |
| 命名一致性 | Step 1~16 / 本文件 §7.9 | `05` / `06` / `07` 待生成 | 通过 | 旧 `Turn / StreamEvents / AG-UI` 不能回流为实现主线 |
| 提交与源码语言 | Step 3 / standards / 本文件 §7.4 | `07` 待生成 | 通过 | 实现仓必须英文 commit / 英文源码注释 |

### 7.11 未进入实施的待确认项

| 待确认项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| 正式 `03-详细设计.md` 尚未重建 | 旧 `03` 不能作为实现依据 | 本文档维护者 | Step 19 前只引用中间产物 |
| `04-配置设计.md` 尚未创建 | 完整 JSON 示例、默认值、字段说明未落地 | 配置设计编写者 | 只按 Step 14 的 binding point 实现接口 |
| `05-测试方案.md` 尚未按新版详细设计重建 | 完整测试矩阵和报告策略未落地 | 测试方案编写者 | 只按 Step 16 最小切口进入 `07` 门禁 |
| `06-验收标准.md` 尚未按新版详细设计重建 | 验收证据 ID 和一票否决项未落地 | 验收标准编写者 | `07` 只能引用待生成位置,不能脑补 AC-ID |
| `07-实施计划.md` 尚未创建 | 还没有阶段任务、提交边界和门禁嵌入 | 实施计划编写者 | 后续按实施计划 SOP 单独生成 |
| 生产 DB / MQ / HTTP 产品选择 | 当前只定义 port / adapter 边界 | 架构 / 实施计划编写者 | P0 以 in-memory / fake 保持语义,不锁死产品 |
| 真实相邻仓 adapter | P0 可 fake / fixture | 对应相邻仓负责人 | 不作为 P0 truth center 开工阻塞 |

## 8. 回填草稿

> 本节不重复粘贴 §7 的完整表。正式 `03-详细设计.md` 生成 §16 时,应从本文件 §7 摘录。

正式文档 §16 建议采用以下结构:

```text
16. 详细设计到实施计划的承接清单
  16.1 设计依据与承接边界
  16.2 实施承接清单
  16.3 实施前置阅读清单
  16.4 实施前检查清单
  16.5 跨文档一致性复核表
  16.6 未进入实施的待确认项
  16.7 实施计划引用规则
```

必须引用:

| 正式章节 | 引用来源 |
|---|---|
| §16.1 | `design-calibration/03_ddd_step_17_implementation_handoff.md` §2 / §3 / §6 |
| §16.2 | `design-calibration/03_ddd_step_17_implementation_handoff.md` §7.2 |
| §16.3 | `design-calibration/03_ddd_step_17_implementation_handoff.md` §7.3 |
| §16.4 | `design-calibration/03_ddd_step_17_implementation_handoff.md` §7.4 |
| §16.5 | `design-calibration/03_ddd_step_17_implementation_handoff.md` §7.5 ~ §7.10 |
| §16.6 | `design-calibration/03_ddd_step_17_implementation_handoff.md` §7.11 |
| §16.7 | `design-calibration/03_ddd_step_17_implementation_handoff.md` §3.10 |

回填要求:

- 正式 §16 必须列出本文件作为校准来源,并提示读者继续阅读 §7 的结构化复核表。
- 不得在正式 §16 新增对象字段、状态名、协议字段或 phase boundary。
- `07-实施计划.md` 必须引用正式 §16 和本文件,不得复制重写详细设计。
- 未进入实施的待确认项必须在 Step 18 风险与待确认事项中继续收口。

## 9. 待确认事项

无字段、DTO、状态、处理流、命名或 phase boundary 冲突需要实现者自行选边。

本步列出的未进入实施事项属于后续文档工作或实施计划工作,不是当前详细设计内部冲突。Step 18 仍需把可能影响实现的风险和待确认事项集中记录。

## 10. 本步完成检查

| 检查项 | 结果 | 说明 |
|---|---|---|
| SOP 应问问题已回答 | 通过 | §3 覆盖 10 个问题 |
| 实施承接清单已输出 | 通过 | §7.2 |
| 实施前置阅读清单已输出 | 通过 | §7.3 |
| 提交规范、git config、Rust 编码规范、注释规范已列入 | 通过 | §3.3 / §7.4 |
| 字段闭环表已输出 | 通过 | §7.5 |
| DTO / Event / Job 构造闭环表已输出 | 通过 | §7.6 |
| 状态闭环表已输出 | 通过 | §7.7 |
| phase boundary 复核表已输出 | 通过 | §7.8 |
| 命名一致性表已输出 | 通过 | §7.9 |
| 跨文档一致性复核表已输出 | 通过 | §7.10 |
| 未进入实施的待确认项已输出 | 通过 | §7.11 |
| 未写开发排期、任务拆分或 commit boundary | 通过 | 本步只做详细设计到实施计划承接 |
| 可进入 Step 18 风险与待确认事项 | 通过 | 下一步集中记录仍可能影响实现的风险和待确认项 |
