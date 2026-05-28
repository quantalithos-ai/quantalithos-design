## Step 3. 收稳前置条件与阅读清单

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 3
- 回填章节：`07-实施计划.md` §3 实施前置条件与阅读清单

### 2. 本步输入

- 上游文档：
  - `projects/L0-core/00-需求文档.md`
  - `projects/L0-core/01-架构设计.md`
  - `projects/L0-core/02-概要设计.md`
  - `projects/L0-core/03-详细设计.md`
  - `projects/L0-core/04-配置设计.md`
  - `projects/L0-core/05-测试方案.md`
  - `projects/L0-core/06-验收标准.md`
- 规范输入：
  - `standards/coding/rust.md`
  - `standards/document/实施计划书写规范.md`
  - `standards/document/实施计划讨论流程_SOP.md`
  - `standards/document/设计文档讨论中间产物规范.md`
- 已确认结论：
  - 本轮实施目标是 L0-core P0 契约来源仓闭环。
  - F-001~F-004 全量进入 P0；F-005~F-007 只进入 P0-min 最小切口。
  - 实施计划不得重写 03 详细设计契约，只能把契约转成实施前置、阶段、批次、门禁和提交边界。
  - 当前 `projects/L0-core/README.md` 存在旧口径风险，只能作为旧上下文提示，不能作为实现基线。
- 依赖的前序 Step：
  - `07_implementation_plan_step_01_input_boundary.md`
  - `07_implementation_plan_step_02_scope.md`

### 3. SOP 问题回答

1. 实施者必须先读哪些文档，分别为了理解什么。

   回答：实施者必须先读 L0-core `00~06`，理解需求范围、架构边界、概要骨架、详细契约、配置规则、测试门禁和验收裁决。还必须读 Rust 编码规范、实施计划规范、提交规范和目标实现仓历史提交。`projects/L0-core/README.md` 只作为旧上下文风险提示阅读，不得替代 `00~06`。

2. 当前项目使用什么语言和编码规范。

   回答：当前实现目标是 Rust workspace 多 crate。实现仓必须遵循 `standards/coding/rust.md`。该规范用中文说明，但实现仓源码标识符、模块名、类型名、函数名、变量名、测试名、普通注释和 rustdoc 默认必须使用英文。

3. Rust 项目是否已明确 `standards/coding` 下的 Rust 编码规范。

   回答：已明确。实施前必须阅读 `standards/coding/rust.md`，尤其是源码语言约束、rustdoc 文档注释、命名、格式、错误处理、安全和 Clippy / rustfmt 相关规则。公开 struct、enum、enum variant、trait、函数和模块应按 rustdoc 规则写英文文档注释。

4. 是否必须阅读提交规范和历史提交。

   回答：必须。实施者应阅读 `standards/document/实施计划书写规范.md` 中提交时机、提交粒度、commit message、body 分组、footer 和实现仓英文规则，并查看目标实现仓近期合格提交。实现代码仓 commit message 必须英文，标题固定为 `type(scope): subject`，一笔提交对应 §6 的一个 commit boundary。

5. 项目级 git `user.name` 和 `user.email` 应如何配置。

   回答：目标实现仓必须使用项目级 git config，不使用 `--global`。推荐配置为 `user.name=quantalithos-labs`、`user.email=quantalithos.ai@gmail.com`，并在提交前确认读取结果。

6. 是否有必须先启动或确认的本地服务、数据库、消息系统或外部依赖。

   回答：L0-core P0 不要求先启动真实 L0-bus、L0-sdk、L1 业务服务、HTTP / gRPC server、配置中心、真实 KMS / Vault 或真实观测归档系统。实施前必须确认 Rust toolchain、目标实现仓路径、设计基线 commit、文件系统状态根、JSON 配置 profile、fake / stub adapter 和测试证据输出位置。真实外部服务未就绪不阻塞 P0，但必须通过 fake、boundary suite 或风险接受表达。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| `07-实施计划.md` | 尚未创建 §3 前置条件与阅读清单 | 实施者不知道编码前必须读什么、配置什么、确认什么 |
| `projects/L0-core/README.md` | 保留旧 proto / buf / 26 仓等旧口径 | 若被当成实现基线，可能偏离新版 `00~06` |
| 目标实现仓 | 实际路径可能不在当前 design 仓 | 实施计划必须要求实施者先确认代码仓位置和当前设计基线 |
| 编码规范 | Rust 规范在 `standards/coding/rust.md`，但未被 07 前置化 | 可能出现中文 rustdoc、中文测试名或不一致命名 |
| 提交纪律 | 提交规则在规范中，但未被 07 前置化 | 可能出现实现仓中文 commit、不合规 footer、错误提交粒度 |
| 外部依赖 | 真实 L0-bus / L0-sdk / L1+ 未作为 P0 前置 | 需要明确用 fake / boundary suite 处理，避免误设阻塞项 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 前置阅读 | 只有上游文档散落存在 | 收敛为必读、选读和禁止作为基线三类 | 防止实施者读错输入或漏读规范 |
| Rust 规范 | 未进入实施前门禁 | 明确 `standards/coding/rust.md` 是实现仓必读规范 | 保证源码、rustdoc、测试名和注释语言一致 |
| git 配置 | 未进入实施前门禁 | 明确项目级 `git config user.name/user.email` | 防止全局配置污染或提交身份不一致 |
| 提交规范 | 容易等到提交时才处理 | 前置要求阅读提交规范和历史提交 | 提交边界、body 分组和 footer 需要在编码前理解 |
| 外部依赖 | 容易误以为要启动全量系统 | 明确 P0 不依赖真实 bus/sdk/L1 服务 | 保持 L0-core 底座仓可独立实施 |
| 环境准备 | 泛泛写“准备环境” | 拆成 toolchain、仓路径、配置、状态根、fake adapter、证据路径 | 前置条件必须可检查 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 只要求实施者阅读 `03-详细设计.md` | 最贴近代码 | 容易丢失需求、架构红线、配置、测试、验收和提交纪律 | 不采用 |
| 要求实施者阅读 `00~06` + 编码 / 提交 / SOP 规范 | 输入完整，可追溯，能避免旧口径回流 | 前置阅读成本更高 | 采用 |
| 使用 `git config --global` 统一身份 | 一次配置后所有仓可用 | 会污染其他项目，且不符合本项目项目级配置约束 | 不采用 |
| 使用目标实现仓项目级 git config | 只影响当前仓，便于审查 | 每个仓都需要单独确认 | 采用 |
| 把真实 L0-bus / L0-sdk / L1+ 作为实施前置服务 | 更接近最终系统 | 会阻塞 L0-core 底座仓，且违反本轮非范围 | 不采用 |
| 用 fake / stub / boundary suite 表达外部接缝 | 支持独立闭环，符合 P0 范围 | 真实联调风险需要后续仓单独验收 | 采用 |

### 7. 结构化中间产物

#### 7.1 阅读清单

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求文档 | `projects/L0-core/00-需求文档.md` | 理解 F-001~F-007、P0 / P0-min、非目标和业务规则 | 做出非范围能力或漏掉 P0-min | 能说明本轮覆盖和不覆盖的需求编号 |
| 架构设计 | `projects/L0-core/01-架构设计.md` | 理解 L0-core 在系统中的位置、依赖方向、红线和数据所有权 | 把 bus、sdk、identity、L1 业务职责写入 L0-core | 能说明本仓只做契约来源和消费接缝 |
| 概要设计 | `projects/L0-core/02-概要设计.md` | 理解主要组成部分、模块轮廓、对象轮廓、接口和流程骨架 | 按对象清单机械实现，缺少功能纵切 | 能画出主要组成部分到实现阶段的映射 |
| 详细设计 | `projects/L0-core/03-详细设计.md` | 按 Rust workspace、对象、trait、API、状态机、事务和伪代码实现 | 字段、函数、状态、错误和事务边界漂移 | 能定位每个实现对象来自哪一节 |
| 配置设计 | `projects/L0-core/04-配置设计.md` | 理解 JSON 配置、profile、来源优先级、fail fast / fail closed | 配置项揉错模块，或 runtime fail open | 能列出 P0 配置项和 profile |
| 测试方案 | `projects/L0-core/05-测试方案.md` | 理解 TC、EV、suite、证据路径和回归要求 | 阶段完成但没有自动化和证据 | 能把阶段任务映射到测试 suite |
| 验收标准 | `projects/L0-core/06-验收标准.md` | 理解 AC、VETO、缺陷分级、风险接受和最终裁决 | 通过口径不一致，或触发一票否决仍继续 | 能说明每阶段对应验收门禁 |
| Rust 编码规范 | `standards/coding/rust.md` | 理解 Rust 命名、格式、rustdoc、源码英文和安全规则 | 代码注释语言、公开 API 注释和命名不合格 | 提交前通过 review / fmt / clippy 检查 |
| 实施计划书写规范 | `standards/document/实施计划书写规范.md` | 理解代码批次、提交边界、提交时机和 commit 规范 | 阶段、批次、commit 混写 | 能说明一笔提交对应哪个 §6 boundary |
| 实施计划 SOP | `standards/document/实施计划讨论流程_SOP.md` | 理解 07 的 Step 顺序和前置门禁 | 直接跳到任务清单 | 能按 Step 解释实施计划来源 |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` | 理解正式文档与校准产物追溯关系 | 后续文档无法追溯 | 正式 §3 能引用本 Step 文件 |
| 目标实现仓历史提交 | `<l0-core-code-root>` 的 `git log` | 对齐目标仓 commit 风格和提交粒度 | commit message 格式和粒度不合格 | 选取近期合格提交作为参考 |
| L0-core README | `projects/L0-core/README.md` | 仅识别旧口径风险 | 误把旧 README 当作实现基线 | 明确不得替代新版 `00~06` |

#### 7.2 git 配置检查清单

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

| 检查项 | 要求 | 检查方式 | 备注 |
|---|---|---|---|
| 配置作用域 | 只使用目标实现仓项目级配置 | 不使用 `--global` | 避免污染其他仓 |
| `user.name` | `quantalithos-labs` | `git config user.name` | 提交前复核 |
| `user.email` | `quantalithos.ai@gmail.com` | `git config user.email` | 提交前复核 |
| 历史提交参考 | 查看目标实现仓近期合格提交 | `git log` | 只参考实现仓，不搬用 design 仓中文提交规则 |

#### 7.3 编码与提交规范确认清单

| 类型 | 前置要求 | 检查方式 |
|---|---|---|
| Rust 格式 | 遵循 rustfmt / 项目配置 | `cargo fmt` 或目标仓等价命令 |
| Rust 静态检查 | 遵循 Clippy 和编码规范 | `cargo clippy` 或目标仓等价命令 |
| Rust 测试 | 按阶段门禁执行相关 suite | `cargo test` 或目标仓 CI 命令 |
| 源码语言 | 实现仓标识符、rustdoc、普通注释和测试名默认英文 | review / grep / lint |
| 公开 API 注释 | public struct / enum / enum variant / trait / function / module 使用英文 rustdoc | review / `cargo doc` 可选 |
| 提交语言 | 实现仓 commit message 必须英文 | review commit message |
| 提交标题 | `type(scope): subject` | 对照规范和历史提交 |
| 提交粒度 | 一笔提交对应 §6 一个 commit boundary | 对照实施计划 §6 |
| Commit body | 按子功能分组，只写文件名，标注改动量，不写字面量 `\n` | 使用 message 文件和 `git commit -F` |
| Footer | 默认 `Co-Authored-By: Codex <noreply@openai.com>` | footer 前保留空行 |

#### 7.4 工具与环境前置检查表

| 前置项 | P0 要求 | 检查方式 | 不满足时处理 |
|---|---|---|---|
| 目标实现仓路径 | 明确 `<l0-core-code-root>` | 实施者记录绝对路径 | 不开始编码，先确认仓位置 |
| 设计基线 | 记录当前 design 仓 commit / diff 基线 | `git status` / `git rev-parse HEAD` | 未记录则不能宣称按本文实现 |
| Rust toolchain | 可运行 Rust workspace | `rustc --version`、`cargo --version` | 先安装或切换 toolchain |
| 格式 / lint / test | 可运行目标仓门禁 | `cargo fmt`、`cargo clippy`、`cargo test` | 若命令不同，实施前记录替代命令 |
| JSON 配置 profile | 至少具备 local / ci-test / integration / release-like 的表达 | 对照 `04-配置设计.md` | 缺失进入 Step 8 风险 |
| 文件系统状态根 | contract source、snapshot、projection、audit、outbox、idempotency root 可配置 | temp dir / fixture dir | 路径冲突或不可写时 fail fast |
| 外部引用解析 | 使用 fake / stub resolver，禁止默认放行 | negative fixture | fail open 进入 blocker |
| Outbox publisher | P0 使用 fake / boundary publisher | fake publisher / relay boundary suite | 不要求真实 L0-bus |
| Gate / toolchain adapter | 可 fake gate pass / fail / fingerprint mismatch | fixture / adapter fake | 不要求真实审批系统 |
| 证据输出 | 可记录 run_id、commit、suite、case_id、profile、artifact path | 对照 05 / 06 EV | 物理路径未定进入 Step 8 / Step 11 |

#### 7.5 前置检查流程图

```text
Implementer
  |
  v
Read 00~06 + standards
  |
  v
Confirm <l0-core-code-root> + design baseline
  |
  v
Configure project-level git identity
  |
  v
Check Rust toolchain + fmt/lint/test commands
  |
  v
Prepare JSON profiles + state roots + fake adapters
  |
  v
Enter Step 4 deliverable extraction
```

关键说明：
- 该图只表达编码前的前置检查顺序，不表达正式实施阶段。
- 真实 L0-bus、L0-sdk、L1+ 服务不在 P0 前置启动项中。
- 如果任一前置项无法满足，应进入 Step 8 或 Step 9 的环境风险 / blocker，而不是静默开始编码。

### 8. 回填草稿

以下内容回填到正式 `07-实施计划.md` §3。

```md
## 3. 实施前置条件与阅读清单

> 校准来源：
> - `design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“阅读清单”“git 配置检查清单”“编码与提交规范确认清单”和“工具与环境前置检查表”小节，了解实施者在编码前必须完成哪些前置动作。

实施者开始编码前，必须完成阅读、git 配置、编码规范、提交规范、工具链和环境前置检查。不得在未确认目标实现仓、未阅读上游 `00~06`、未确认 Rust 规范和未配置项目级 git identity 的情况下开始实现。

| 文档 | 路径 | 阅读目的 | 未读风险 | 确认方式 |
|---|---|---|---|---|
| 需求文档 | `projects/L0-core/00-需求文档.md` | 理解 F-001~F-007、P0 / P0-min 和非目标 | 范围膨胀或漏做 P0-min | 能说明本轮覆盖与不覆盖的需求编号 |
| 架构设计 | `projects/L0-core/01-架构设计.md` | 理解系统位置、依赖方向和红线 | 相邻仓职责进入 L0-core | 能说明本仓边界 |
| 概要设计 | `projects/L0-core/02-概要设计.md` | 理解主要组成部分、对象、接口、流程和状态骨架 | 实施顺序退化成对象清单 | 能说明功能纵切来源 |
| 详细设计 | `projects/L0-core/03-详细设计.md` | 按 Rust workspace、对象、trait、API、状态机和事务实现 | 字段、函数、错误和事务边界漂移 | 能定位实现契约来源 |
| 配置设计 | `projects/L0-core/04-配置设计.md` | 理解 JSON 配置、profile、来源优先级和失效模式 | runtime fail open 或配置项揉错模块 | 能列出 P0 配置项 |
| 测试方案 | `projects/L0-core/05-测试方案.md` | 理解 TC、EV、suite 和证据要求 | 阶段无测试和证据 | 能映射阶段到 suite |
| 验收标准 | `projects/L0-core/06-验收标准.md` | 理解 AC、VETO、缺陷分级和裁决 | 触发一票否决仍继续 | 能说明阶段验收门禁 |
| Rust 编码规范 | `standards/coding/rust.md` | 理解 Rust 编码、rustdoc 和源码英文约束 | 中文 rustdoc / 测试名 / 注释进入实现仓 | review / fmt / clippy |
| 实施计划规范 | `standards/document/实施计划书写规范.md` | 理解代码批次、提交边界和 commit 规范 | commit 粒度和 message 不合格 | 对照 §6 与 §11 |

`projects/L0-core/README.md` 只允许作为旧上下文风险提示阅读，不得作为本轮实现基线。

目标实现仓必须使用项目级 git 配置：

```bash
git config user.name "quantalithos-labs"
git config user.email "quantalithos.ai@gmail.com"
git config user.name
git config user.email
```

实现仓源码、rustdoc、普通注释、测试名和 commit message 默认必须使用英文。提交标题固定为 `type(scope): subject`，一笔提交对应 §6 的一个 commit boundary；同一 boundary 内多个协作子功能仍保留为一笔提交，并在 body 中按子功能分组说明。

实施前还必须确认目标实现仓路径、当前设计基线 commit、Rust toolchain、fmt / lint / test 命令、JSON 配置 profile、文件系统状态根、fake / stub adapter 和证据输出位置。L0-core P0 不要求启动真实 L0-bus、L0-sdk、L1+ 服务、HTTP / gRPC server、配置中心、真实 KMS / Vault 或真实观测归档系统。
```

### 9. 待确认事项

- 目标实现仓真实路径 `<l0-core-code-root>` 仍需由实施者在开工前填写。
- 目标实现仓若已有更严格的 Rust toolchain、CI 命令或 commit 规范，应在不放宽本文规则的前提下叠加。
- CI artifact 物理路径和 evidence archive 真实落点仍需在 Step 8 / Step 11 固定。

建议方案：接受上述待确认项后继续。原因是这些都是实施前必须检查的环境事实，但不影响当前先收稳阅读、规范和配置门禁。

### 10. 进入下一步条件

- 阅读清单已覆盖 `00~06`、Rust 编码规范、实施计划规范、提交规范和目标实现仓历史提交。
- 项目级 git 配置命令已明确，且禁止使用 `--global`。
- 实现仓英文源码、英文 rustdoc、英文测试名和英文 commit message 已前置声明。
- 工具、环境、fake adapter、状态根和证据输出前置项已列出。
- 无法立即确认的实现仓路径、CI 命令和 artifact 物理路径已进入后续 Step 风险 / 前置项。
