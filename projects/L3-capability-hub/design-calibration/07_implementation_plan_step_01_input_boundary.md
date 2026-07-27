# L3-capability-hub 07 实施计划 Step 1：确认实施输入边界

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md` Step 1
> 书写规范: `standards/document/实施计划书写规范.md` §3
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 回填章节: `projects/L3-capability-hub/07-实施计划.md` §1
> 创建日期: 2026-07-26
> 当前模式: full-restart / continuous execution

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认实施输入边界 |
| 当前状态 | completed_continuous_execution |
| 正式 `07` | 尚未创建；必须由 Step 13 装配 |
| active upstream blocker | `0` |
| implementation prerequisite blocker | `CH-PREREQ-TARGET-REPO-001`：目标实现仓设计期未发现 |
| 真实实现 / 测试 / 证据事实 | 均不存在 |
| 下一动作 | 进入 Step 2，明确实施目标、范围和非范围 |

## 2. 本步输入

| 输入 | 路径 | 读取用途 | 结论 |
|---|---|---|---|
| 需求 | `projects/L3-capability-hub/00-需求文档.md` | 需求目标、FR/BR/NFR、AC/VF、责任边界 | active；核心主语为 identity、registry、descriptor、seam、relation、exposure |
| 架构 | `projects/L3-capability-hub/01-架构设计.md` | truth ownership、依赖方向、数据分类、跨仓协作 | active；只允许本仓 owning access truth 和受控接缝 |
| 概要 | `projects/L3-capability-hub/02-概要设计.md` | 主要组成部分、对象轮廓、接口/流程/状态分组 | active；不在本步重写对象或协议 |
| 详细 | `projects/L3-capability-hub/03-详细设计.md` | exact modules、types、Ports、protocols、flows、states、TX、binding、observation | active；可供 1:1 boundary 复核 |
| 配置 | `projects/L3-capability-hub/04-配置设计.md` | strict source、profile、binding、activation、failure、redline | active；具体产品仍按受控 binding 规则处理 |
| 测试 | `projects/L3-capability-hub/05-测试方案.md` | TC/DS/EV、suite、gate、check、report/evidence root、regression | active；189 contracts，不代表真实 instance |
| 验收 | `projects/L3-capability-hub/06-验收标准.md` | AC/VF/VETO、entry/exit、risk、final decision | active；无实际 verdict/signoff |
| 实施计划标准 | `standards/document/实施计划讨论流程_SOP.md`; `实施计划书写规范.md` | Step 顺序、phase/boundary、门禁、正式章节 | active |
| 实施台账标准 | `standards/document/代码实施台账与门禁规范.md` | project/boundary ledger、Gate Matrix、Commit/Handoff Gate | active；正式 07 完成时必须创建台账骨架 |
| 可落码性标准 | `standards/document/设计真相源闭环与可落码性标准.md` | 字段/DTO/state/mapper/config/evidence 和经验复核 | active；缺口必须回写设计 |

## 3. SOP 问题回答

### 3.1 是否具备完整的实施计划输入？

具备。active formal `00`、`01`、`02`、`03`、`04`、`05`、`06` 均存在，且 06 Step 15 已完成整体装配。正式 `07` 不存在是本轮任务，不构成输入缺失。每份正式文档均有对应 calibration flow 和 Step 产物，可继续作为实施计划的追溯来源。

### 3.2 哪个版本作为实施基线？

使用当前工作区的 active formal `00~06` 及其当前 calibration artifacts 作为设计期基线。设计仓当前存在用户和其他项目的未提交改动，因此不能把某个 Git HEAD、未授权 commit 或工作区状态伪装成 implementation baseline。真正移交实现前必须固定可复现的 design baseline，并在 implementation ledger 中记录。

### 3.3 详细设计是否足以支持 1:1 实现计划？

足以进入实施计划拆分，但尚未等同于实现已获准开工。正式 `03` 已提供：7 个 workspace member、7 个 module ownership、43 个核心对象 + 7 个 helper、250 个 public type、36 个 Port、22 个 repository trait / 110 个方法、26 Command、33 Query、6 Inbound、10 Outbound、8 Job、83 flow、24 state family / 111 variant / 638 pair、22 TX、Stage 0~7 runtime assembly、配置绑定和 observation cuts。Step 6 仍必须逐 boundary 重做字段、构造、状态、Port、UoW、配置、Rustdoc 和 phase boundary 复核。

### 3.4 测试方案和验收标准是否足以定义阶段门禁？

足以。`05` 固定 `189 TC / 189 DS / 189 EV` contracts、10 suites、5 gates、9 checks、4 builders、固定 raw/report roots 和 R0~R4；`06` 固定 AC-CH-001..037、VF-CH-001..013、过程 VETO、entry/exit、risk 和三值结论。它们只定义未来执行合同，不证明测试已运行或证据已生成。Step 7 要把这些合同映射到 phase/boundary，不得重新发明 case 或静态 pass 文件。

### 3.5 是否存在上游冲突？

当前未发现阻塞实施计划编写的 active formal 冲突。README 与旧材料和 active `00~06` 存在显著责任冲突：旧材料含 MCP whitelist、Provider Contract、cost、KMS/Vault、runtime 调用、policy 下发执行；这些已在 active 00~06 中被明确排除。本 Step 将其记为 historical material，不把它们作为实施输入。

### 3.6 哪些缺口阻塞实现，哪些只阻塞设计？

| 缺口 | 分类 | 影响 | 处理 |
|---|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-capability-hub` 未发现 | implementation prerequisite | 阻塞所有代码、测试执行和实现 commit | Step 3/8 固定 preflight；未确认前不得进入代码 boundary |
| design baseline 未固定 | implementation handoff blocker | 阻塞实现移交和证据归因 | Step 3/11/12 定义并由真实交付流程记录 |
| phase / commit boundary 尚未定义 | current design work | 阻塞 boundary 级实现 | Step 5/6 完成 |
| boundary 经验复核尚未完成 | implementation handoff blocker | 阻塞实现移交 | Step 6 逐 boundary 复核 |
| concrete product/backend 未选 | controlled binding prerequisite | 只阻塞相应具体 adapter/config boundary | 保留 formal 04 controlled reopen；不阻塞 product-neutral 计划 |
| run/evidence/verdict 尚不存在 | execution fact absence | 不阻塞设计计划；阻塞真实验收裁决 | Step 7/12 保留未来门禁 |

## 4. 当前文档问题诊断

| 材料 | 问题 | 影响 | 处置 |
|---|---|---|---|
| README | 仍把仓描述为 MCP whitelist、A2A directory、Provider Contract、cost accounting 和 policy update 执行中心 | 会把 implementation scope 拉回 provider/runtime/secret/cost/governance truth | historical；T070 审计，不作为 07 authority |
| 旧 formal 07（若存在） | 可能含旧 phase、对象、产品或 commit 事实 | 会污染当前 boundary | 不沿用；Step 13 整体装配 |
| 目标仓路径 | 设计期不存在 | 实现 agent 可能私自选择替代路径 | 固定为 implementation prerequisite；不得猜测替代仓 |
| 设计仓 Git 状态 | 存在其他项目与本项目未提交设计改动 | 无法把当前 HEAD 作为可复现实现 baseline | 记录风险；移交前固定新 baseline |

## 5. 改动前后对比

| 维度 | 改动前 | 本 Step 后 |
|---|---|---|
| 实施输入 | formal 00~06 分散存在 | 统一为有序输入矩阵和 exact source chain |
| 缺失仓处理 | 容易被实现者临时决定 | 明确为 `CH-PREREQ-TARGET-REPO-001`，阻塞代码而不阻塞计划 |
| 旧 README | 可能被误当仓职责说明 | historical material，active 00~06 优先 |
| 可落码判断 | 只有总体设计闭环印象 | 固定 inventory、boundary review 和回流规则 |
| 执行事实 | 容易把文档审计写成测试通过 | 明确所有 run/evidence/commit/verdict 为空 |

## 6. 设计取舍

| 方案 | 选择 | 原因 |
|---|---|---|
| 因目标仓缺失停止全部 07 讨论 | 不采用 | 这是实现前置条件，不是上游设计冲突；可以先完成可审计的实施计划 |
| 猜测或创建替代实现仓路径 | 不采用 | 会伪造实现基线并破坏后续 ledger 归属 |
| 把 README 旧职责迁移到新计划 | 不采用 | 与 active 00~06 的 truth ownership 冲突 |
| 直接生成完整 07 | 不采用 | 跳过 phase/boundary 小循环和门禁审计 |
| 先固定输入边界，再拆范围/阶段/boundary | 采用 | 满足 SOP，便于逐 boundary 回溯和暂停 |

## 7. 结构化中间产物

### 7.1 输入与 authority 矩阵

| Source family | Exact active source | Supplies | 07 consumer | Must not infer |
|---|---|---|---|---|
| requirement | `00-需求文档.md` + `00_req_step_01..17` | core closures、FR/BR/NFR、AC/VF、non-scope | Step 2/4/7/12 | implementation result |
| architecture | `01-架构设计.md` + `01_arch_step_01..16` | ownership、dependency、consistency、security redlines | Step 2/5/6/8 | selected deployment product |
| HLD | `02-概要设计.md` + `02_hld_step_01..14` | components、object/flow/state grouping | Step 4/5 | exact code beyond formal 03 |
| DDD | `03-详细设计.md` + `03_ddd_step_01..19` | exact types、Ports、protocols、flows、states、TX、bindings、observation | Step 3/4/5/6/8 | missing implementation facts |
| configuration | `04-配置设计.md` + `04_config_step_01..15` | strict source/profile/binding/activation/failure | Step 3/6/8/9 | concrete product readiness |
| tests | `05-测试方案.md` + `05_test_plan_step_01..15` | TC/DS/EV contracts、suites/gates/checks、roots | Step 6/7/11/12 | real run/evidence |
| acceptance | `06-验收标准.md` + `06_acceptance_step_01..15` | AC/VF/VETO、release/risk/signoff contract | Step 7/9/12 | verdict/signoff |

### 7.2 Pre-audit inventory

| Inventory | Expected active count | Step 1 result | Boundary implication |
|---|---:|---|---|
| workspace members | 7 | closed in formal 03 | do not create capability-per-crate expansion |
| modules / public types | 7 / 250 | closed | contracts/domain/application/infra/entry ownership must preserve source |
| objects/helpers | 43 / 7 | closed | Step 6 must map every touched declaration and Rustdoc |
| Ports | 36 | closed | 27 local/base + 9 external; no hidden Port |
| repositories/methods | 22 / 110 | closed | single persistence authority and fake parity |
| flows | 26 C + 33 Q + 6 I + 10 O + 8 J = 83 | closed | no generic execute/query/event/job replacement |
| state | 24 / 111 / 638 | closed | exact names and full pair classification |
| config | 18 / 27 / 21; 3 profiles | closed | strict source and controlled binding |
| tests/evidence | 189 / 189 / 189 | contract only | run-scoped instance remains future |
| suites/gates/checks/builders | 10 / 5 / 9 / 4 | closed | phase/boundary gates consume exact selectors |
| AC/VF | 37 / 13 | closed | all consumers and non-waivable VETO preserved |

### 7.3 Design closure pre-audit

| Closure | Source | Result | Implementation-plan rule |
|---|---|---|---|
| field source | DDD Steps 6/8/9/11/13 | pass-designed | missing source blocks current boundary; no defaults or parsing |
| DTO construction | DDD Steps 6/8/9 | 83/83 flow contracts located | no generic carrier or implementation-only DTO |
| Query response/marker | DDD Steps 7/8/9/11/12 | 33/33 | Query writes remain zero |
| state transition | DDD Step 10 + 05/06 | 638 pairs classified | no shorthand or external status mapping |
| persistence/UoW | DDD Steps 7/11/13 | one authority, 22/110 surface | no private finder or second write authority |
| configuration | DDD Step 14 + formal 04 | Stage 0~7 and 27+9 bindings | selected product requires controlled reopen |
| observation | DDD Step 15 + formal 04/05/06 | private backend-neutral cut | no observer Port/business state/backend claim |
| evidence | formal 05/06 | contract chain closed | no static evidence or fake result |

## 8. 回填草稿

正式 `07-实施计划.md` §1 应写入：本计划承接 active formal `00~06` 及 exact calibration source。`00` 固定 capability access truth 的需求边界，`01` 固定 ownership/dependency，`02` 固定结构轮廓，`03` 固定 1:1 implementation contract，`04` 固定配置与外部绑定，`05` 固定 test/evidence contract，`06` 固定 acceptance/VETO/release contract。目标实现仓 `/home/aris/Projects/quantalithos-capability-hub` 在设计期未建立，必须在实现前 preflight 确认；本计划不声称该仓、Cargo、git、branch、commit、run 或 evidence 已存在。

## 9. 待确认事项

| 事项 | 当前状态 | 处理 |
|---|---|---|
| 目标实现仓实际创建/路径确认 | 未建立 | Step 3/8 作为 implementation prerequisite；未确认前不进入代码 |
| design baseline 的提交或不可变引用 | 未建立 | Step 3/11/12 定义移交门禁；当前不伪造 commit |
| 具体 API/database/bus/secret/observability 产品 | 未选 | 只在 formal 04 受控回开后进入相应 boundary |
| selected product/environment manifest | 未选择 | Step 8/12 只定义输入字段和门禁，不创建实例 |

## 10. 进入下一步条件

| 条件 | 结果 |
|---|---|
| active formal 00~06 已定位且 authority 顺序明确 | pass |
| 旧 README/formal material 已隔离 | pass |
| 字段/DTO/state/Port/TX/config/evidence closure 已预审 | pass-designed；仍需 boundary 级复核 |
| 目标仓缺失已登记为 implementation prerequisite | pass |
| 未伪造实现、测试、证据、验收或 commit | pass |
| 可进入 Step 2 | yes；`enter_07_step_02_scope` |
