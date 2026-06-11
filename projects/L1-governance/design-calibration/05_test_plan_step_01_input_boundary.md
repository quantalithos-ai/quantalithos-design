# Step 1. 确认测试输入边界

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 1
> 回填章节: `05-测试方案.md` §1 与上游文档的关系声明

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认测试输入边界 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 新版 `00/01/02/03/04`;旧 `05/06` 仅作历史诊断和方向输入 |
| 输出文件 | `projects/L1-governance/design-calibration/05_test_plan_step_01_input_boundary.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 2 |

## 2. 本步目标

确认 `L1-governance` 测试方案依赖的需求、架构、概要、详细设计、配置设计和验收方向输入是否足够,并明确哪些输入可以作为正式测试设计真相源。

本 Step 只回答:

- 当前测试方案要承接哪些需求、规则和非功能目标。
- 哪些概要 / 详细设计章节直接影响测试对象。
- 哪些验收项需要测试方案提供证据。
- 哪些内容不应在测试方案中重新定义。
- 当前上游是否存在会阻塞测试设计的缺口。

本 Step 不定义测试范围优先级、完整测试对象清单、测试用例编号、测试数据、环境矩阵、自动化脚本、evidence 编号、验收 veto 或实施排期。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` | 新版正式文档 | 抽取 FR / BR、核心闭环、数据边界、非功能和验收方向 |
| `01-架构设计.md` | 新版正式文档 | 抽取依赖裁剪、数据所有权、正文排除、派生不反写、产品中立和架构红线 |
| `02-概要设计.md` | 新版正式文档 | 抽取组件、关键对象、接口骨架、处理流、状态、异常和配置影响 |
| `03-详细设计.md` | 新版正式文档 | 抽取模块、对象、DTO、port、flow、state、transaction、error、idempotency、config、observability 和 test cuts |
| `03_ddd_step_16_test_cuts.md` | 已完成详细设计中间产物 | 作为最小测试切口直接输入 |
| `04-配置设计.md` | 新版正式文档 | 抽取 profile、config validation、sensitive / redaction、adapter availability、failure / degradation 和测试承接 |
| `05-测试方案.md` | 旧 / 待重建草案 | 只作为历史诊断输入,不得覆盖新版 `00`~`04` |
| `06-验收标准.md` | 旧 / 待重建草案 | 只作为验收方向输入,正式 evidence / veto 后续重建 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前测试方案要承接哪些需求、规则和非功能目标? | 承接 `00` 中 C-GOV-1~C-GOV-5、FR-GOV-001~010、BR-GOV-001~040、AC-GOV-001~031、VF-GOV-001~010、正文排除、truth / snapshot / reference / derived separation、唯一编译期依赖、可审计、幂等、一致性、安全、观测和外围增强不影响核心闭环等目标。 |
| 哪些概要 / 详细设计章节直接影响测试对象? | `02` 的组件、关键对象、API 骨架、处理流、状态、异常和配置影响会影响测试对象抽取。`03` 的 Step 5~16 直接决定测试对象:七个模块、对象契约、trait / port / adapter、23 个 Command、14 个 Query、9 个 Inbound Consumer、13 个 Outbound Event、7 个 Operations Job、状态矩阵、持久化事务、错误恢复、并发幂等、配置外部绑定、观测审计和最小测试切口。 |
| 哪些验收项需要测试方案提供证据? | `00` 的 AC-GOV-001~031 和 VF-GOV-001~010 需要测试证据支撑。测试方案还要为正文不入仓、Policy / shared rules 不被覆盖、query no-write、projection / job 不反写真相、outbox payload snapshot、duplicate replay、external GRC 不定义 truth、fake / controlled adapter 不伪成功、config fail-fast 和 redaction no-output 等红线提供 evidence。旧 `06` 中的 request / decision / eligibility / replay 方向只作为历史提示。 |
| 哪些内容不应在测试方案中重新定义? | 不重新定义需求编号、业务规则、架构方案、对象字段、DTO、port、repository、flow、state、error、persistence、config key、runtime builder、部署命令、实施 commit 或验收裁决。测试方案只定义如何验证正式设计契约,不能补设计缺口。 |
| 当前上游是否存在会阻塞测试设计的缺口? | 不阻塞 Step 2。新版 `00`~`04` 和 `03_ddd_step_16_test_cuts.md` 已足够启动测试目标与范围设计。旧 `05/06` 与新版设计不一致,但它们本来就是待重建文档,不是阻塞。具体产品未锁定也不阻塞 P0 测试设计,按 fake / controlled / disabled / product-neutral 接缝处理。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `05-测试方案.md` | 旧草稿仍以 GovernanceRequest / Gate / Decision / RiskAcceptance 等旧叙述组织,与新版 `03` 的 23 Command、14 Query、9 Consumer、12 Event、7 Job 不一致 | 标记为历史诊断输入,后续 Step 15 重建正式 `05` |
| `06-验收标准.md` | 旧草稿将旧测试方案作为前置,验收基线和证据口径需按新版 `00`~`05` 重建 | Step 1 只读取验收方向,不采用旧 evidence / veto 口径 |
| `03-详细设计.md` | 已提供最小测试切口,但尚未形成完整测试方案、TC 编号、用例矩阵、数据、环境和证据 | 由 `05` Step 2~14 展开 |
| `04-配置设计.md` | 已定义配置测试承接,但还未进入测试用例、环境矩阵和门禁 | 由 `05` Step 8~10 / Step 12~13 展开 |
| 产品选型 | DB / bus / search / object storage / external GRC 等产品未锁定 | 不阻塞输入边界;测试方案采用 product-neutral 适配器和 fake / controlled profile |
| 验收 evidence | 当前新版 `06` 尚未重建 | `05` 先定义 evidence 产出面,后续 `06` 消费并裁决 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试方案入口 | 旧 `05` 可被误当成当前测试基线 | 建立 `05_test_plan_calibration_flow.md` 和 Step 1 输入边界 | 符合测试 SOP 中间产物先行 |
| 上游权威顺序 | 旧 `05/06` 与新版 `00`~`04` 容易混读 | 明确新版 `00`~`04` 为正式输入,旧 `05/06` 仅作历史 / 方向输入 | 防止旧口径覆盖新版设计 |
| 测试对象来源 | 旧测试方案按少量主线场景组织 | 确认测试对象必须从新版 `03` 和 Step 16 test cuts 抽取 | 保证测试可回指详细设计契约 |
| 配置测试 | 旧环境表可能直接进入测试方案 | 确认配置测试以新版 `04` 为来源 | 避免旧 test / staging 假设覆盖配置设计 |
| 上游缺口 | 产品未定、旧 `06` 未重建可能被视为阻塞 | 判定不阻塞 Step 2,后续作为待确认或 product-neutral 处理 | 测试方案可先按正式设计和 fake / controlled seam 推进 |

## 7. 测试设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否直接重写正式 `05` | A. 直接重写;B. 先走 `05_test_plan_*` 中间产物 | 采用 B。SOP 要求中间产物先行,正式文档 Step 15 装配 |
| 是否继承旧 `05` 用例 | A. 直接继承;B. 只作为历史诊断 | 采用 B。旧草稿与新版详细设计对象和协议数量不一致 |
| 是否用测试方案补设计缺口 | A. 补齐缺失字段 / port / state;B. 记录待确认并回写设计 | 采用 B。测试方案只验证设计,不能定义实现契约 |
| 是否等待新版 `06` 完成后再写 `05` | A. 等待;B. 先以 `00` AC / VF 和旧 `06` 方向推进 | 采用 B。测试方案提供证据面,验收标准后续裁决 |
| 是否要求真实外部产品 | A. P0 要求真实 DB / bus / external GRC;B. P0 使用 fake / controlled / disabled 接缝 | 采用 B。产品未锁定,且 `04` 已定义 product-neutral profile |

## 8. 结构化中间产物

### 8.1 上游输入映射表

| 来源文档 | 测试输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | C-GOV-1~C-GOV-5;FR-GOV-001~010;BR-GOV-001~040;AC-GOV-001~031;VF-GOV-001~010;数据边界;正文排除;唯一编译期依赖;非功能目标 | `05` §1 / §2 / §5 / §10 / §12 / §13 |
| `01-架构设计.md` | Governance truth 独立;Gate / Decision、Policy、Control、AIIA / SoA、Nonconformity 边界;依赖裁剪;外部正文不入仓;派生不反写;产品中立 | `05` §1 / §2 / §3 / §4 / §10 / §14 |
| `02-概要设计.md` | 主要组件、关键对象、API / 接口骨架、处理流、状态流转、异常边界、配置影响和详细设计交接 | `05` §1 / §3 / §4 / §6 / §8 |
| `03-详细设计.md` | 七个模块;对象契约;trait / port / adapter;23 Commands;14 Queries;9 Inbound Consumers;12 Outbound Events;7 Operations Jobs;state matrix;transaction;error;idempotency;config;observability | `05` §1 / §3 / §4 / §6 / §7 / §9 / §10 / §11 |
| `03_ddd_step_16_test_cuts.md` | module / command / query / consumer / outbound event / job / state / consistency / idempotency / config / observability 最小测试切口 | `05` §3 / §4 / §6 / §9 / §10 |
| `04-配置设计.md` | profile matrix;strict JSON;source priority;secret / redaction;runtime builder fail-fast;adapter availability;job config;degraded / no-write;publisher failure;rollback / digest | `05` §1 / §8 / §9 / §10 / §12 / §13 |
| `05-测试方案.md` | 旧 request / decision / eligibility / emitted result / replay 方向和旧测试层级 | 历史诊断;不直接回填 |
| `06-验收标准.md` | 旧验收关注方向: request / decision 分层、eligibility、例外裁决、emitted result、drift replay | `05` §1 / §12 / §13 / §14 方向输入 |

### 8.2 不再回答的问题清单

- 不重新定义 `00` 中的 FR / BR / AC / VF 编号和需求语义。
- 不重新选择架构方案、依赖方向、truth ownership、正文归属或产品路线。
- 不重新定义 `03` 中的对象字段、DTO、enum、state、port、repository、adapter、flow、transaction、idempotency、error 或 observability schema。
- 不用测试方案补缺失 schema、缺失读取面、缺失 version 来源、缺失 id generator 或缺失 payload source。
- 不定义具体 DB、message bus、search、object storage、secret provider、metric backend、external GRC 产品。
- 不测试相邻仓完整内部状态机,只测试与 Governance 的 ref / snapshot / event / handoff / adapter 接缝。
- 不做验收裁决、veto 判定或风险接受签署;这些属于 `06-验收标准.md`。
- 不安排实施 commit、开发顺序、提交规范或回退策略;这些属于 `07-实施计划.md`。
- 不写部署命令、运维 runbook、告警值班或生产变更操作;这些属于 `09-部署与运维手册.md`。

### 8.3 测试方案必须回答的问题清单

- 哪些正式需求、设计契约和配置红线需要测试覆盖。
- 哪些测试目标、范围和非范围进入 P0 / P1 / P2。
- 每个模块、对象、Command、Query、Inbound Consumer、Outbound Event、Operations Job、状态机和一致性规则对应哪些测试切口。
- 每个测试切口应在哪个层级发现问题: contract、domain unit、application service、fake adapter、handler、worker、job runner、integration-like、release gate。
- AC-GOV / VF-GOV、配置门禁和详细设计 test cuts 如何映射到测试覆盖矩阵。
- 如何验证 body 不入仓、query no-write、job no truth repair、projection 不反写、outbox snapshot、duplicate replay、consumer dedup、redaction no-output、fake adapter 不伪成功。
- 测试数据如何构造,哪些数据覆盖正向、负向、边界、并发、恢复、配置和观测场景。
- local-dev、ci-test、integration-like、operations-replay 等 profile 如何承接测试环境和配置矩阵。
- 哪些测试进入 PR gate、nightly、operations replay、release gate,输出哪些 reports / artifacts / evidence。
- 哪些缺陷如何分级、复验和进入残余风险。

### 8.4 初始测试输入候选表

| 测试输入候选 | 来源 | 当前状态 | 后续处理 |
|---|---|---|---|
| 核心闭环 C-GOV-1~C-GOV-5 | `00` | 正式输入 | Step 2 定目标;Step 5 建覆盖矩阵 |
| AC-GOV-001~031 / VF-GOV-001~010 | `00` | 正式输入 | Step 5 / Step 13 映射 evidence |
| 七个实现模块 | `03` Step 5 | 正式输入 | Step 3 抽测试对象;Step 4 分层 |
| 23 Command / 14 Query / 9 Consumer / 12 Event / 7 Job | `03` Step 8 / 9 / 16 | 正式输入 | Step 3 / Step 6 展开用例 |
| 状态矩阵和非法转换 | `03` Step 10 / 16 | 正式输入 | Step 6 设计状态类用例 |
| version / UoW / outbox / projection / reference / stored result | `03` Step 11 / 13 / 16 | 正式输入 | Step 6 / Step 9 / Step 10 展开一致性和幂等测试 |
| error / recovery / retry / dead-letter / commit unknown | `03` Step 12 / 13 / 16 | 正式输入 | Step 6 / Step 10 / Step 11 展开异常和恢复 |
| config profile / strict JSON / redaction / fake / controlled adapters | `04` | 正式输入 | Step 8 / Step 10 / Step 12 展开配置测试 |
| 旧 request / decision / replay 用例 | 旧 `05/06` | 历史输入 | 仅作风险提示,不得直接继承编号或口径 |

## 9. 对上游设计的影响判定

| 测试输入结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 旧 `05/06` 不能作为当前测试真相源 | 否 | 下游文档权威级别 | 无需回写 `00`~`04` |
| 新版 `00`~`04` 足够启动 Step 2 | 否 | 测试 SOP 进入条件 | 无需回写 |
| 产品未锁定不阻塞 P0 测试设计 | 否 | 配置 / 测试接缝策略 | 后续按 fake / controlled / disabled profile 处理 |
| 后续若测试切口发现字段、DTO、port、version、id 或 payload source 缺失 | 是 | 设计可落码性缺口 | 记录待确认并回写对应正式设计文档 |
| 后续若 evidence 无法支撑 AC / VF | 是 | 验收闭环缺口 | 记录待确认并在 `05` / `06` 闭合 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“对上游设计的影响判定”和“待确认事项”小节,了解测试方案输入边界如何从新版 `00/01/02/03/04` 收敛。

正式 `05-测试方案.md` §1 应回填:

- 本测试方案承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和 `04-配置设计.md`。
- `03-详细设计.md` 与 `03_ddd_step_16_test_cuts.md` 是测试对象和测试切口的直接来源。
- `04-配置设计.md` 是 profile、配置校验、敏感配置、adapter availability、失效降级和配置门禁测试的直接来源。
- 旧 `05-测试方案.md` 和旧 `06-验收标准.md` 只作为历史诊断和方向输入,不得覆盖新版 `00`~`04`。
- 测试方案不重新定义需求、架构、对象、DTO、port、state、flow、config 或验收裁决;只定义如何验证这些正式契约。
- 当前没有阻塞进入 Step 2 的输入缺口。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 旧 `05-测试方案.md` 何时被正式重建 | 影响后续测试方案读者是否误读旧口径 | Step 15 统一装配正式文档,当前不改正式 `05` |
| 新版 `06-验收标准.md` 尚未重建 | evidence / veto / acceptance gate 需要后续消费新版 `05` | `05` 先定义 evidence 产出面,`06` 后续裁决 |
| 产品选择未锁定 | 真实 DB / bus / external GRC 联调无法作为 P0 必过 | Step 8~10 按 fake / controlled / disabled / product-neutral 设计 |
| 后续用例矩阵规模较大 | Step 6 可能需要多批写入 | 按测试切口小循环分批,每批写完整内容而不是压缩内容 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 输入文档清单明确 | 通过 | 见 §3 / §8.1 |
| 测试方案边界明确 | 通过 | 见 §8.2 / §8.3 |
| 上游阻塞缺口已判断 | 通过 | 无阻塞 Step 2 的输入缺口 |
| 旧 `05/06` 地位已明确 | 通过 | 历史诊断和方向输入,不作为真相源 |
| 可进入 Step 2 | 通过 | 下一步明确测试目标、范围和非范围 |
