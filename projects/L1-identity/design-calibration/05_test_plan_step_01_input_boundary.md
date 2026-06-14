# Step 1. 确认测试输入边界

> 对应 SOP: `standards/document/测试方案讨论流程_SOP.md` Step 1
> 回填章节: `05-测试方案.md` §1 与上游文档的关系声明

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认测试输入边界 |
| 当前状态 | 已写入;待用户审查 |
| 输入基线 | 新版 `00/01/02/03/04`;旧 `05/06` 仅作历史诊断和方向输入 |
| 输出文件 | `projects/L1-identity/design-calibration/05_test_plan_step_01_input_boundary.md` |
| 正式文档状态 | 本 Step 不修改正式 `05-测试方案.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 2 |

## 2. 本步目标

确认 `L1-identity` 测试方案依赖的需求、架构、概要、详细设计、配置设计和验收方向输入是否足够,并明确哪些输入可以作为正式测试设计真相源。

本 Step 只回答:

- 当前测试方案要承接哪些需求、规则和非功能目标。
- 哪些概要 / 详细设计章节直接影响测试对象。
- 哪些配置设计结论必须进入测试环境、门禁和 negative cases。
- 哪些验收方向需要测试方案提供 evidence 产面。
- 哪些内容不应在测试方案中重新定义。
- 当前上游是否存在会阻塞 Step 2 的输入缺口。

本 Step 不定义测试优先级、完整测试对象清单、测试用例编号、测试数据、环境矩阵、自动化脚本、evidence 编号、验收 veto 裁决或实施排期。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` | 新版正式输入 | 抽取 C-ID、FR-ID、BR-ID、NFR-ID、AC-ID、VETO-ID、数据边界和正文排除口径 |
| `01-架构设计.md` | 新版正式输入 | 抽取仓级边界、依赖裁剪、数据所有权、相邻仓协作和架构红线 |
| `02-概要设计.md` | 新版正式输入 | 抽取组件、关键对象、接口骨架、处理流、状态、异常和配置影响 |
| `03-详细设计.md` | 直接输入 | 抽取 module、object、DTO、port、flow、state、transaction、error、idempotency、config、observability 和 test cuts |
| `03_ddd_step_16_test_cuts.md` | 直接输入 | 作为最小测试切口和测试对象抽取的细化来源 |
| `04-配置设计.md` | 已审核通过 | 抽取 profile、source priority、strict JSON、redaction、runtime builder、adapter failure、rollback digest 和下游承接 |
| `05-测试方案.md` | 旧 / 待重建草案 | 只作为历史诊断输入,不得覆盖新版 `00`~`04` |
| `06-验收标准.md` | 旧 / 待重建草案 | 只作为验收方向输入,正式 evidence / veto 口径后续重建 |
| `测试方案讨论流程_SOP.md` | 流程标准 | 决定 Step 1~15 的讨论顺序和中间产物要求 |
| `测试方案书写规范.md` | 书写标准 | 决定正式 `05` 的 15 章主链、artifact/report 路径和章节追溯规则 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前测试方案要承接哪些需求、规则和非功能目标? | 承接 `00` 中 C-ID-1~C-ID-5、FR-ID-001~014、BR-ID-001~015、NFR-ID-001~009、AC-ID-001~015、VETO-ID-001~006,以及 identity truth、lifecycle、role/capability summary、career record、memory refs、consumption/traceability、data ownership、no external body、no query implicit write、no ref reuse、no adjacent truth repair 等目标。 |
| 哪些概要 / 详细设计章节直接影响测试对象? | `02` 的组件、关键对象、接口骨架、处理流、状态和异常会影响测试对象抽取。`03` 的 module contracts、object contracts、trait/port/adapter contracts、protocol contracts、function flows、state matrix、persistence/transaction consistency、error recovery、concurrency/idempotency、config binding、observability/audit 和 §15 test cuts 直接决定测试对象。 |
| 哪些配置设计结论必须进入测试? | `04` 固定的 `local-dev`、`ci-test`、`integration-like`、`operations-replay` profile,`fake` / `controlled` / `endpoint` / `disabled` adapter mode,strict JSON、source priority、profile isolation、entry-local/job-run-start boundary、raw secret/body 禁止、runtime builder fail-fast、adapter disabled/degraded、publication failure、rollback digest 和 redaction evidence 都必须进入 Step 8~13。 |
| 哪些验收方向需要测试方案提供 evidence? | `00` 的 AC-ID-001~015 和 VETO-ID-001~006 需要测试 evidence 支撑。尤其是稳定身份锚点、生命周期管理与追溯、角色能力摘要来源、不保存定义正文、生涯追加、memory refs 不保存正文、相邻仓消费边界、维护对账不修相邻 truth、查询不隐式创建、引用不复用、正文/secret 不落盘。旧 `06` 只能提示验收关注方向,不能继承其编号和旧对象口径。 |
| 哪些内容不应在测试方案中重新定义? | 不重新定义需求编号、业务规则、架构方案、对象字段、DTO、port、repository、adapter、flow、state、error、transaction、idempotency、config key、runtime builder、产品选型、实施 commit、部署命令或验收裁决。测试方案只定义如何验证正式设计契约,不能补设计缺口。 |
| 当前上游是否存在会阻塞 Step 2 的缺口? | 不阻塞 Step 2。新版 `00`~`04` 和 `03_ddd_step_16_test_cuts.md` 已足够启动测试目标与范围设计。旧 `05/06` 与新版设计不一致,但它们本来就是待重建文档,不是阻塞。性能 / 可用性 baseline、evidence 编号、fixture、CI 和 artifact schema 尚未定义,属于后续 Step 6~13 的正式产物。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `05-测试方案.md` | 旧草案早于新版 `03/04`,仍包含旧对象、旧流程、旧用例编号、旧环境和旧红线表述 | 标记为历史诊断输入;正式 `05` 只在 Step 15 由新版中间产物重建 |
| `06-验收标准.md` | 旧草案早于新版 `03/04`,验收基线、证据和阻断项需要按新版测试方案重建 | Step 1 只读取验收方向,不采用旧 evidence / veto 口径 |
| `03-详细设计.md` §15 | 已给出最小测试切口,但明确不分配正式 TC、fixture、CI、coverage、evidence 或执行排期 | 由 `05` Step 3~13 展开 |
| `04-配置设计.md` §12 | 已给出 `05` 必须承接的配置测试主题,但不代写测试用例和 evidence | 由 `05` Step 8~13 展开 |
| 性能 / 可用性 | `00/03` 明确不继承旧固定阈值 | Step 10/12/13 建立 baseline、sample 或评审口径 |
| 产品选型 | durable store、broker、search、metric、archive 等真实产品未锁定 | 不阻塞 P0 测试设计;按 fake / controlled / disabled / product-neutral 接缝处理 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 测试方案入口 | 旧 `05` 容易被误读为当前测试基线 | 建立 `05_test_plan_calibration_flow.md` 与 Step 1 输入边界 | 符合测试 SOP 的中间产物先行 |
| 上游权威顺序 | 旧 `05/06` 与新版 `00`~`04` 容易混读 | 明确新版 `00`~`04` 为正式输入,旧 `05/06` 仅作历史 / 方向输入 | 防止旧口径回流 |
| 测试对象来源 | 旧测试方案按历史主线组织 | 确认测试对象必须从新版 `03` 和 Step 16 test cuts 抽取 | 保证测试可回指详细设计契约 |
| 配置测试来源 | 旧环境表可能直接进入测试方案 | 确认配置测试以新版 `04` 为来源 | 避免旧 profile / adapter 术语覆盖配置设计 |
| evidence 生成 | 旧 evidence / report 口径未适配新版设计 | 确认 evidence 产面在 Step 13 定义,验收裁决在新版 `06` 消费 | 保持 `05` 与 `06` 边界 |

## 7. 测试设计取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否直接重写正式 `05` | A. 直接重写;B. 先走 `05_test_plan_*` 中间产物 | 采用 B。SOP 要求中间产物先行,正式文档 Step 15 装配 |
| 是否继承旧 `05` 用例 | A. 直接继承;B. 只作为历史诊断 | 采用 B。旧草案与新版详细设计对象、flow、state、config 和 evidence 口径不一致 |
| 是否用测试方案补设计缺口 | A. 补齐缺失字段 / port / state / fixture / evidence;B. 记录待确认并回写设计 | 采用 B。测试方案只能验证设计,不能定义实现契约 |
| 是否等待新版 `06` 完成后再写 `05` | A. 等待;B. 先以 `00` AC / VETO 和旧 `06` 方向推进 | 采用 B。测试方案先定义 evidence 产出面,验收标准后续裁决 |
| 是否要求真实外部产品 | A. P0 要求真实 durable/broker/archive/metric 产品;B. P0 使用 fake / controlled / disabled / product-neutral 接缝 | 采用 B。产品未锁定,且 `04` 已定义 P0 profile 与 adapter mode |

## 8. 结构化中间产物

### 8.1 上游输入映射表

| 来源文档 | 测试输入 | 回填章节 |
|---|---|---|
| `00-需求文档.md` | C-ID-1~C-ID-5;FR-ID-001~014;BR-ID-001~015;NFR-ID-001~009;AC-ID-001~015;VETO-ID-001~006;数据归属;正文排除;依赖裁剪方向 | `05` §1 / §2 / §5 / §10 / §12 / §13 |
| `01-架构设计.md` | identity truth 边界;GlobalMember 与相邻仓分层;依赖裁剪;运行期 / 事件协作边界;产品中立;禁止依赖循环 | `05` §1 / §2 / §3 / §4 / §10 / §14 |
| `02-概要设计.md` | 组件、关键对象、API / 接口骨架、处理流、状态流转、异常边界、配置影响和详细设计交接 | `05` §1 / §3 / §4 / §6 / §8 |
| `03-详细设计.md` | 七个 crate;对象契约;trait / port / adapter;Command / Query / Inbound / Outbound / Job 协议;state matrix;transaction;error;idempotency;config;observability | `05` §1 / §3 / §4 / §6 / §7 / §9 / §10 / §11 |
| `03_ddd_step_16_test_cuts.md` | module / command / query / consumer / outbound material / job / state / consistency / idempotency / config / observability 最小测试切口 | `05` §3 / §4 / §6 / §9 / §10 |
| `04-配置设计.md` | profile matrix;strict JSON;source priority;secret / redaction;runtime builder fail-fast;adapter availability;job/entry boundary;degraded / no-write;publication failure;rollback digest | `05` §1 / §8 / §9 / §10 / §12 / §13 |
| `05-测试方案.md` | 旧测试主线、旧用例和旧环境术语 | 历史诊断;不直接回填 |
| `06-验收标准.md` | 旧验收关注方向 | `05` §12 / §13 / §14 方向输入;不继承编号和裁决口径 |

### 8.2 不再回答的问题清单

- 不重新定义 `00` 中的需求编号、核心能力、业务规则、非功能目标、验收方向和 veto。
- 不重新选择架构方案、依赖方向、truth ownership、正文归属、产品路线或相邻仓职责。
- 不重新定义 `03` 中的对象字段、DTO、enum、state、port、repository、adapter、flow、transaction、idempotency、error 或 observability schema。
- 不用测试方案补缺失 schema、缺失读取面、缺失 version 来源、缺失 id generator、缺失 payload source、缺失 state transition 或缺失 error mapping。
- 不定义具体 DB、message bus、search、object storage、secret provider、metric backend、archive product 或 deployment product。
- 不测试相邻仓完整内部状态机,只测试与 identity 的 ref / snapshot / event / handoff / adapter 接缝。
- 不做验收裁决、veto 判定或风险接受签署;这些属于 `06-验收标准.md`。
- 不安排实施 commit、开发顺序、提交规范或回退策略;这些属于 `07-实施计划.md`。
- 不写部署命令、运维 runbook、告警阈值或生产变更操作;这些属于后续运维文档。

### 8.3 测试方案必须回答的问题清单

- 哪些正式需求、设计契约和配置红线需要测试覆盖。
- 哪些测试目标、范围和非范围进入 P0 / P1 / P2。
- 每个 crate、对象、Command、Query、Inbound Event / Callback、Outbound Material、Operations Job、状态机和一致性规则对应哪些测试切口。
- 每个测试切口应在哪个层级发现问题: contract、domain unit、application service、repository fake、adapter fake、API handler、worker、job runner、integration-like、release gate。
- AC-ID / VETO-ID、配置门禁和详细设计 test cuts 如何映射到测试覆盖矩阵。
- 如何验证 no external body、query no-write、job no truth repair、projection no truth write、outbound accepted-only、duplicate replay、consumer/callback dedupe、redaction no-output、fake adapter no default success。
- 测试数据如何构造,哪些数据覆盖正向、负向、边界、并发、恢复、配置和观测场景。
- `local-dev`、`ci-test`、`integration-like`、`operations-replay` 等 profile 如何承接测试环境和配置矩阵。
- 哪些测试进入 PR gate、nightly、operations replay、release gate,输出哪些 reports / artifacts / evidence。
- 哪些缺陷如何分级、复验和进入残余风险。

### 8.4 初始测试输入候选表

| 测试输入候选 | 来源 | 当前状态 | 后续处理 |
|---|---|---|---|
| 核心闭环 C-ID-1~C-ID-5 | `00` | 正式输入 | Step 2 定目标;Step 5 建覆盖矩阵 |
| FR-ID-001~014 / BR-ID-001~015 | `00` | 正式输入 | Step 3 / Step 5 / Step 6 展开测试切口和用例 |
| AC-ID-001~015 / VETO-ID-001~006 | `00` | 正式输入 | Step 5 / Step 12 / Step 13 映射 evidence 和阻断规则 |
| 七个 workspace crate | `03` §15 | 正式输入 | Step 3 抽测试对象;Step 4 分层 |
| 6 个 Command 测试切口 | `03` §15 / Step 16 | 正式输入 | Step 3 / Step 6 展开用例 |
| Query / Inbound / Callback / Outbound / Operations Job 切口 | `03` §15 / Step 16 | 正式输入 | Step 3 / Step 6 展开用例 |
| 状态矩阵和非法转换 | `03` Step 10 / §15 | 正式输入 | Step 6 设计状态类用例 |
| version / UoW / outbox / projection / reference / stored result | `03` Step 11 / Step 13 / §15 | 正式输入 | Step 6 / Step 9 / Step 10 展开一致性和幂等测试 |
| error / recovery / retry / terminal / commit unknown | `03` Step 12 / Step 13 / §15 | 正式输入 | Step 6 / Step 10 / Step 11 展开异常和恢复 |
| config profile / strict JSON / redaction / fake / controlled / disabled adapters | `04` | 正式输入 | Step 8 / Step 10 / Step 12 展开配置测试 |
| 旧测试用例和旧验收项 | 旧 `05/06` | 历史输入 | 仅作风险提示,不得直接继承编号或口径 |

## 9. 对上游设计的影响判定

| 测试输入结论 | 是否影响上游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 旧 `05/06` 不能作为当前测试真相源 | 否 | 下游文档权威级别 | 无需回写 `00`~`04` |
| 新版 `00`~`04` 足够启动 Step 2 | 否 | 测试 SOP 进入条件 | 无需回写 |
| 产品未锁定不阻塞 P0 测试设计 | 否 | 配置 / 测试接缝策略 | 后续按 fake / controlled / disabled / product-neutral 处理 |
| performance / availability baseline 尚未固定 | 否 | 测试与验收产物待定义 | Step 10/12/13 闭合,不回写需求阈值 |
| 后续若测试切口发现字段、DTO、port、version、id、payload source、state transition 或 error mapping 缺失 | 是 | 设计可落码性 / 可验证性缺口 | 记录待确认并回写对应正式设计文档 |
| 后续若 evidence 无法支撑 AC / VETO | 是 | 验收闭环缺口 | 记录待确认并在 `05` / `06` 闭合 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/05_test_plan_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“对上游设计的影响判定”和“待确认事项”小节,了解测试方案输入边界如何从新版 `00/01/02/03/04` 收敛。

正式 `05-测试方案.md` §1 应回填:

- 本测试方案承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 和 `04-配置设计.md`。
- `03-详细设计.md` §15 与 `design-calibration/03_ddd_step_16_test_cuts.md` 是测试对象和测试切口的直接来源。
- `04-配置设计.md` 是 profile、配置校验、敏感配置、adapter availability、失效降级、runtime builder、rollback digest 和配置门禁测试的直接来源。
- 旧 `05-测试方案.md` 和旧 `06-验收标准.md` 只作为历史诊断和方向输入,不得覆盖新版 `00`~`04`。
- 测试方案不重新定义需求、架构、对象、DTO、port、state、flow、config、artifact、evidence 或验收裁决;只定义如何验证这些正式契约。
- 当前没有阻塞进入 Step 2 的输入缺口。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 旧 `05-测试方案.md` 何时被正式替换 | 影响读者是否误读旧口径 | Step 15 统一装配正式文档,当前不改正式 `05` |
| 新版 `06-验收标准.md` 尚未重建 | evidence / veto / acceptance gate 需要消费新版 `05` | `05` 先定义 evidence 产出面,`06` 后续裁决 |
| 产品选择未锁定 | 真实 durable / broker / archive / metric 联调无法作为 P0 必过 | Step 8~10 按 fake / controlled / disabled / product-neutral 设计 |
| performance / availability baseline 未固定 | 最终 pass 裁决不能使用旧硬阈值 | Step 10/12/13 建立 baseline、sample 或评审口径 |
| 后续用例矩阵规模较大 | Step 6 可能需要多批写入 | 按测试切口小循环分批,每批写完整内容而不是压缩内容 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 输入文档清单明确 | 通过 | 见 §3 / §8.1 |
| 测试方案边界明确 | 通过 | 见 §8.2 / §8.3 |
| 上游阻塞缺口已判断 | 通过 | 无阻塞 Step 2 的输入缺口 |
| 旧 `05/06` 地位已明确 | 通过 | 历史诊断和方向输入,不作为真相源 |
| 正式 `05` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 2 | 待用户确认 | 用户审核通过后进入 Step 2: 明确测试目标、范围和非范围 |
