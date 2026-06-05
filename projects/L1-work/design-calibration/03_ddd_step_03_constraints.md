# Step 3. 收稳编码规范、语言 / runtime、仓库约束

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 3
- 回填章节:`03-详细设计.md` §3 实现约束与编码规范承接;§16 详细设计到实施计划的承接清单

### 2. 本步输入

- 上一步中间产物:
  - `projects/L1-work/design-calibration/03_ddd_step_02_scope.md`
- 规范输入:
  - `standards/coding/rust.md`
  - `standards/document/详细设计书写规范.md`
  - `standards/document/子项目目录与代码文件组织规范.md`
  - `standards/document/实施计划书写规范.md`
  - `projects/README.md` §8.2 提交规范
- 上游边界:
  - `projects/L1-work/00-需求文档.md` §6 / §12
  - `projects/L1-work/01-架构设计.md` §8
  - `projects/L1-work/02-概要设计.md` §3 / §12 / §13
- 本地 sibling repo 检查:
  - `/home/aris/Projects/quantalithos-core`
  - `/home/aris/Projects/quantalithos-bus`
  - `/home/aris/Projects/quantalithos-conversation`
  - `/home/aris/Projects/quantalithos-identity`
  - `/home/aris/Projects/quantalithos-method-library`
  - `/home/aris/Projects/quantalithos-sdk`

### 3. SOP 问题回答

1. 本仓使用什么语言、runtime、框架和主要依赖?

   回答:目标实现仓 `quantalithos-work` 使用 Rust workspace,edition 采用 Rust 2024,并沿用 Quantalithos 已有 Rust workspace 形态。当前阶段不锁定 Web framework、数据库产品、搜索产品、消息队列产品、缓存产品或调度产品。核心编译期依赖只允许 `core-contracts`,用于 Actor / Trace / Metadata / shared ref / error / event envelope 等共享契约。`serde`、`serde_json`、`thiserror` 等基础 crate 只作为实现层候选,最终版本由实施计划和目标仓 Cargo workspace 固定。

2. Rust 编码规范中哪些内容会影响结构体、错误、trait、async、测试和注释?

   回答:详细设计必须按 `standards/coding/rust.md` 展开 Rust 契约。影响本轮设计的规则包括:
   - 类型、函数、变量、模块、测试名使用英文,不得使用拼音。
   - struct、enum、enum variant、trait、公开函数、公开字段必须有 rustdoc 风格注释。
   - enum variant 不得省略注释;带载荷 variant 必须说明载荷语义。
   - 错误类型必须表达语义边界,不得用泛化 string error 替代正式错误 enum。
   - async trait / repository / adapter 签名必须在 Step 7 明确;是否使用 `async_trait` 或 GAT 等机制留给实现技术约束,但 trait 语义不可含糊。
   - 测试名使用英文,并能回指设计中的 TC / gate / state matrix。
   - 普通注释和 rustdoc 必须用英文;中文只可出现在协议样例、业务数据、国际化资源或测试夹具中。

3. 是否必须遵守 rustdoc 风格注释?struct、字段、enum、enum variant、函数分别如何注释?

   回答:必须遵守。详细设计中的 Rust code block 应按未来实现可复制的风格书写:
   - crate / module 级说明使用 `//!`。
   - public struct / enum / trait / type alias 使用 `///` 单句摘要。
   - public 字段使用 `///` 说明来源、含义和边界。
   - enum variant 使用 `///` 说明业务语义;带载荷 variant 说明载荷。
   - public function / factory / transition method 使用 `///` 说明行为、错误和副作用。
   - 设计文档正文可中文说明,但 code block 内注释应使用英文,以免实现者复制后违反源码语言约束。

4. 实施者开始前必须阅读哪些提交规范和 git config 用户要求?

   回答:实施者必须阅读 `projects/README.md` §8.2 和后续 `07-实施计划.md` 的提交规范章节。当前 design 文档仓 commit 使用 `type: 中文主题`、中文正文和固定 `Co-Authored-By: Codex <noreply@openai.com>` footer。目标实现仓代码 commit message 默认使用英文;若目标仓实施计划定义更严格规则,以目标仓规则为准。实施者开始前还必须确认 git author / committer 与项目约束一致,并在每个 commit boundary 前确认工作树不混入无关文件。

5. 哪些安全、鉴权、网关或外部边界不应在本仓实现?

   回答:L1-work 不实现全局身份认证、GlobalMember 生命周期、平台 role truth、API gateway、workspace 聚合授权、global observability、archive 长期存储、process planning、governance 决策正文、artifact evidence 正文、runtime 执行推进或 conversation 正文。L1-work 只通过 `ActorContext`、`CommandMetadata`、`QueryMetadata`、ProjectMember / capability snapshot、external ref / snapshot、event envelope、port / adapter 和 handoff marker 消费这些边界。

6. 本仓是否依赖已经实现的 Quantalithos 仓库?

   回答:是。当前本地已经存在 `quantalithos-core`、`quantalithos-bus`、`quantalithos-conversation`、`quantalithos-identity`、`quantalithos-method-library`、`quantalithos-sdk`。但 L1-work 只有 `quantalithos-core` 是已确认编译期依赖;其他仓即使本地存在,也不能写成 Cargo dependency。

7. 这些依赖中哪些是已确认的编译期依赖?

   回答:只有 `L0-core` 的 `core-contracts`。目标实现仓默认引用方式为:

   ```toml
   core-contracts = { path = "../quantalithos-core/crates/contracts" }
   ```

   该依赖只能进入 contracts / domain / application / infra 中真正需要共享 metadata、actor、trace、event envelope、error 或 shared ref 的位置。不得引入 `core-domain`、`core-application` 或 `core-infra` 作为 L1-work 业务依赖。

8. 依赖仓库在 `/home/aris/Projects` 下是否存在?

   回答:`/home/aris/Projects/quantalithos-core` 已存在,且 `crates/contracts/Cargo.toml` 的 package 名为 `core-contracts`,lib 名为 `core_contracts`。目标实现仓 `quantalithos-work` 当前在本工作区检查中未发现;这不阻塞 design,但实施计划需要把创建目标实现仓或确认目标仓路径作为 PH-01 前置门禁。

9. 对已确认的编译期依赖,当前是否采用本地 path dependency?中期是否记录 private git tag / rev 方案?

   回答:当前采用 sibling repo 本地 path dependency。中期切换为 private git tag / rev,但必须在 `07-实施计划.md` 或目标实现仓 README 中记录切换时机、版本固定方式和回滚口径。设计文档不得要求发布到 public crates.io 作为实现前置条件。

10. 哪些关系只是运行期依赖或事件协作依赖,不能写成 Cargo path dependency?

   回答:`L0-bus`、`L1-identity`、`L1-conversation`、`L3-method-library`、`L1-process`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L1-workspace`、`L0-sdk`、`L4-observability`、`L4-archive`、`L2-member-service` 都不能成为 L1-work 当前编译期依赖。它们只能通过 event、port、adapter、snapshot、external ref、handoff、API 或 fake 测试边界表达。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 本步处理 |
|---|---|---|
| `02-概要设计.md` | 已说明唯一编译期依赖是 `L0-core`,但没有落到具体 Cargo path 和 crate 名 | 本 Step 固定为 `core-contracts = { path = "../quantalithos-core/crates/contracts" }` |
| `03-详细设计.md` 旧版 | 没有按新版 Rust 2024 workspace / multi crate / local sibling 依赖约束展开 | 后续 Step 4 重建 file layout,不得继承旧目录 |
| 源码语言 | 设计文档中文说明较多,容易被误复制到 rustdoc | 本 Step 明确 code block 内注释使用英文 |
| 本地 sibling repo | 多个相邻仓已存在,容易被误写成 path dependency | 本 Step 明确只有 `core-contracts` 可进 Cargo dependency |
| `quantalithos-work` 实现仓 | 当前未在 `/home/aris/Projects` 下发现 | 不阻塞 design;实施计划 PH-01 前置检查确认创建或路径 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 语言 / runtime | 概要只说明后续写 Rust 契约 | 明确 Rust workspace、Rust 2024、源码英文和 rustdoc 要求 | 支撑 Step 4~8 code block |
| 编译期依赖 | `L0-core` 语义级约束 | 具体到 `core-contracts` package / lib / local path | 支撑 Cargo layout |
| 相邻仓关系 | 运行期 / 事件 / 下游消费分类 | 明确不得进入 Cargo dependency | 防止依赖方向越界 |
| 提交规范 | 未在 03 校准中承接 | design 仓中文 commit;实现仓英文 commit;固定 footer | 支撑实施计划承接 |
| 安全 / 鉴权边界 | 分散在需求 / 架构 | 明确本仓不实现全局身份、gateway、observability、archive 等外部边界 | 防止模块越界 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. L1-work 直接依赖所有本地已存在 sibling repo | 使用 typed DTO 方便 | 破坏 L1 平权和依赖裁剪,形成循环风险 | 不采用 |
| B. 只编译期依赖 `core-contracts`,其他通过 port / event / snapshot / fake | 符合架构和需求红线 | 需要在 Step 7 / 8 补更多 adapter / DTO mapping | 采用 |
| C. 当前不指定任何 Cargo dependency | 可避免过早绑定 | 共享 metadata / actor / trace / event envelope 无法落码 | 不采用 |
| D. 把 public crates.io 发布作为依赖前置 | 版本治理清晰 | 当前阶段不现实且会阻塞本地多仓开发 | 不采用 |

### 7. 结构化中间产物

#### 7.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` 源码语言约束 | Rust 源码标识符、注释、rustdoc、测试名使用英文 | Step 6~8 code block 中 rustdoc 使用英文 |
| `standards/coding/rust.md` rustdoc | public struct / enum / trait / function / enum variant 必须文档注释 | Step 6 对象契约和 Step 7 trait 契约必须带注释 |
| `standards/coding/rust.md` 命名规则 | 类型 UpperCamelCase,函数 / module snake_case,package kebab-case 或 snake_case | Step 4 file layout 和 Step 6 / 7 类型命名必须统一 |
| `standards/document/子项目目录与代码文件组织规范.md` role 目录 | contracts、domain、application、infra、api、worker、jobs、cli 等角色名固定 | Step 4 不得发明 `infrastructure`、`common`、`utils` 顶层 role |
| `standards/document/设计真相源闭环与可落码性标准.md` | 类型、DTO、state、ref、result、projection 必须闭环 | Step 6~13 每个对象 / 协议 / flow 必须能 1:1 落码 |
| `projects/README.md` §8.2 | design 仓中文 commit;实现仓英文 commit;footer 固定 | Step 17 / `07-实施计划.md` 必须承接 |

#### 7.2 实现约束表

| 约束 | 说明 | 影响的模块 / 接口 |
|---|---|---|
| Rust 2024 workspace | 目标实现仓采用 Rust workspace 和 edition 2024 | Step 4 file layout / Cargo workspace |
| 源码英文 | 标识符、测试名、普通注释、rustdoc 默认英文 | 全仓 |
| code block 可复制 | 详细设计中的 Rust 示例应尽量使用未来实现可复制的名称和注释 | Step 6~8 |
| 无泛化外部正文 | 不保存 identity、conversation、method、process、governance、artifact、runtime、workspace、observability、archive 正文 | domain / infra / persistence |
| command metadata 强制 | 写路径必须携带 `CommandMetadata.request.idempotency_key` | contracts / application / idempotency |
| query metadata 强制 | 查询读取 `QueryMetadata`,不得写 truth | contracts / query service |
| no hidden gateway | 不在 L1-work 实现全局 auth gateway 或平台 identity | api / application |
| no product lock-in | 不在本 Step 锁定 PostgreSQL、NATS、Redis、Kafka、Elastic 等产品 | infra / config / implementation plan |

#### 7.3 本地多仓依赖约束表

| 依赖仓库 | 全局依赖类型 | 本地默认路径 | 当前引用方式 | 中期引用方式 | 影响的实现单元 |
|---|---|---|---|---|---|
| `quantalithos-core` / `core-contracts` | 编译期依赖 | `../quantalithos-core/crates/contracts` | Cargo path dependency | private git tag / rev | contracts、domain、application、infra 中共享 actor / metadata / trace / event envelope |
| `quantalithos-bus` | 事件协作依赖 | `../quantalithos-bus` | 不进 Cargo dependency;通过 outbox publisher / event adapter fake 表达 | event contract / bus adapter 版本 | worker、outbox、infra adapter |
| `quantalithos-identity` | 运行期依赖 | `../quantalithos-identity` | 不进 Cargo dependency;通过 `MemberReferencePort` / snapshot / event 表达 | API / event contract 版本 | member responsibility、query authorization |
| `quantalithos-conversation` | 事件协作依赖 | `../quantalithos-conversation` | 不进 Cargo dependency;通过 `SourceWorkRef` / event consumer / pending formalize 表达 | event contract 版本 | promote boundary、trace |
| `quantalithos-method-library` | 运行期依赖 | `../quantalithos-method-library` | 不进 Cargo dependency;通过 definition snapshot / reference resolver 表达 | API / snapshot contract 版本 | formal work policy、method snapshot |
| `L1-process` | 运行期依赖 | 待创建 | 不进 Cargo dependency;通过 timebox ref / process timing snapshot 表达 | API / event contract 版本 | iteration commitment |
| `L1-governance` | 运行期依赖 | 待创建 | 不进 Cargo dependency;通过 governance ref / decision snapshot 表达 | API / event contract 版本 | dependency / blocker、completion evidence |
| `L1-artifact` | 运行期依赖 | 待创建 | 不进 Cargo dependency;通过 evidence ref / artifact snapshot 表达 | API / event contract 版本 | completion evidence、promote source |
| `L2-runtime` | 运行期 / 事件协作依赖 | 待创建 | 不进 Cargo dependency;通过 promote request event / source ref 表达 | event contract 版本 | promote intake |
| `L1-workspace` | 下游消费 | 待创建 | 不进 Cargo dependency;通过 query / SDK / event 输出 | API / SDK 版本 | board / view consumption |
| `L0-sdk` | 下游消费 / client | `../quantalithos-sdk` | 不进 Cargo dependency;由 SDK 消费 Work API | SDK release tag | external consumer |
| `L4-observability` | 追溯交接依赖 | 待创建 | 不进 Cargo dependency;通过 trace handoff port 表达 | handoff contract 版本 | trace / audit |
| `L4-archive` | 追溯交接 / 下游消费 | 待创建 | 不进 Cargo dependency;通过 archive handoff marker 表达 | handoff contract 版本 | archive handoff |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_03_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解 Rust 编码、源码语言、提交规范和本地多仓依赖裁剪约束。

## 3. 实现约束与编码规范承接

本轮详细设计面向 Rust 2024 workspace。目标实现仓 `quantalithos-work` 仅允许把 `core-contracts` 作为编译期 sibling dependency,默认本地路径为 `../quantalithos-core/crates/contracts`。其他相邻仓只能通过 port、adapter、event、snapshot、handoff、query 或 fake 测试边界表达,不得进入 Cargo dependency。

### 3.1 编码规范承接表

| 规范来源 | 必须遵守的内容 | 对本文的影响 |
|---|---|---|
| `standards/coding/rust.md` | Rust 源码标识符、注释、rustdoc、测试名使用英文 | 本文 Rust code block 内注释使用英文 |
| `standards/coding/rust.md` | public struct / enum / trait / function / enum variant 必须文档注释 | 对象、trait、DTO 和错误契约必须带注释 |
| `standards/document/子项目目录与代码文件组织规范.md` | role 目录名固定为 contracts、domain、application、infra、api、worker、jobs、cli 等 | Step 4 文件布局必须使用固定 role 名称 |
| `projects/README.md` §8.2 | design 仓中文 commit;实现仓英文 commit;footer 固定 | 实施计划必须承接提交规范 |

### 3.2 编译期依赖约束

| 依赖 | 允许方式 | 禁止方式 |
|---|---|---|
| `core-contracts` | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | 引入 `core-domain`、`core-application` 或 `core-infra` |
| `L0-bus` | event adapter / fake / outbox publisher seam | Cargo path dependency |
| `L1-identity`、`L1-conversation`、`L3-method-library`、`L1-process`、`L1-governance`、`L1-artifact`、`L2-runtime` | runtime port、snapshot、event consumer、external ref | Cargo path dependency |
| `L1-workspace`、`L0-sdk`、`L4-observability`、`L4-archive` | downstream query / SDK / handoff / event consumption | Cargo path dependency |

### 9. 待确认事项

- `quantalithos-work` 实现仓当前未在 `/home/aris/Projects` 下发现;这不阻塞详细设计,但实施计划 PH-01 需要确认目标仓创建和路径。
- Step 4 需要基于本 Step 约束确定 workspace / crate / module / file layout。
- Step 7 / Step 8 遇到相邻仓 ref / event / snapshot 字段不闭合时,必须回写对应设计,不得自行把外部对象降级成裸字符串。

### 10. 进入下一步条件

- 已确认 Rust 2024 workspace 和源码英文约束。
- 已确认 public Rust 契约必须有 rustdoc 风格注释。
- 已确认唯一编译期 dependency 是 `core-contracts`。
- 已确认其他相邻仓只通过 port / event / snapshot / handoff / fake 表达。
- 可以进入 Step 4 “收稳实现单元与文件布局”。
