# Step 1. 确认验收输入边界

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md` Step 1
> 回填章节: `06-验收标准.md` §1 与上游文档的关系声明

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 确认验收输入边界 |
| 当前状态 | 已审核通过 |
| 输入基线 | 新版 `00/01/02/03/04/05`;旧 `06` 仅作历史诊断输入 |
| 输出文件 | `projects/L1-identity/design-calibration/06_acceptance_step_01_input_boundary.md` |
| 正式文档状态 | 本 Step 不修改正式 `06-验收标准.md` |
| 停审方式 | 用户已确认,允许进入 Step 2 |

## 2. 本步目标

确认新版 `L1-identity` 验收标准要承接哪些需求、设计、配置、测试和送验输入,并明确哪些材料只能作为历史诊断而不能进入新版验收基线。

本 Step 只回答:

- 本轮验收依据哪些需求、架构、概要、详细设计、配置设计和测试方案。
- 哪些测试证据会支撑验收裁决。
- 哪些交付版本、环境和数据需要在后续 Step 固定为基线。
- 哪些内容属于测试方案、实施计划、测试报告或运维文档,不应写进验收标准。
- 当前是否存在阻塞验收标准生成的上游缺口。

本 Step 不定义验收范围、验收项编号、通过 / 失败条件、VETO 裁决、风险接受人、具体 `<run_id>`、送验 commit、测试执行结果或最终签署结论。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `00-需求文档.md` | 新版正式输入 | 抽取 C-ID、FR-ID、BR-ID、NFR-ID、AC-ID、VETO-ID、数据归属和禁止事项 |
| `01-架构设计.md` | 新版正式输入 | 抽取 truth boundary、dependency boundary、data ownership、cross-repo collaboration 和架构红线 |
| `02-概要设计.md` | 新版正式输入 | 抽取组件、关键对象、接口骨架、处理流、状态流转、异常边界和详细设计交接 |
| `03-详细设计.md` | 新版正式输入 | 抽取 module、object、protocol、function flow、state matrix、transaction、error、idempotency、config、observability 和 test cuts |
| `04-配置设计.md` | 新版正式输入 | 抽取 profile、source priority、strict JSON、redaction、runtime builder、adapter mode、failure/degraded 和 rollback digest |
| `05-测试方案.md` | Step 15 已审核通过 | 抽取 TC、EV、suite、artifact/report、evidence index、redaction、dependency、defect/retest、risk residual 和测试退出口径 |
| `06-验收标准.md` | 旧 / 待重建草案 | 只作为历史诊断输入,识别旧口径残留风险 |
| `验收标准讨论流程_SOP.md` | 流程标准 | 决定 Step 1~15 的讨论顺序和中间产物要求 |
| `验收标准书写规范.md` | 书写标准 | 决定正式 `06` 的 15 章主链、证据引用、三值结论和章节追溯规则 |
| `设计文档讨论中间产物规范.md` | 中间产物标准 | 决定 Step 文件结构、停审、追溯和大文件分批写作纪律 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 本轮验收依据哪些需求和设计? | 依据新版 `00` 中 C-ID-1~C-ID-5、FR-ID-001~014、BR-ID-001~015、NFR-ID-001~009、AC-ID-001~015、VETO-ID-001~006;新版 `01` 的 truth boundary、dependency boundary 和 data ownership;新版 `02` 的组件、关键对象、接口和状态边界;新版 `03` 的 object/protocol/flow/state/transaction/error/idempotency/config/observability/test cuts;新版 `04` 的配置 profile、adapter mode、redaction 和 runtime builder;新版 `05` 的 TC/EV/suite/report/evidence 结构。 |
| 哪些测试证据会支撑验收裁决? | 新版 `05` 定义的 `TC-ID-*`、`EV-ID-*`、blocking suite、`artifacts/test/<run_id>`、`reports/runs/<run_id>`、`reports/acceptance/handoff.md`、`reports/acceptance/veto-checklist.md`、`reports/acceptance/risk-acceptance.md` 会支撑验收裁决。Step 1 只确认证据入口,不写具体执行结果。 |
| 哪些交付版本、环境和数据会成为基线? | 送验 commit / build / image、固定 `<run_id>`、运行 profile、artifact root、report root、acceptance handoff、测试数据 seed / fixture、依赖协作方式和配置 digest 都需要成为基线,但具体值必须在 Step 3 固定。本 Step 不使用“最新版本”或 `latest`。 |
| 哪些内容属于测试方案或实施计划,不应写进验收标准? | 测试用例设计、测试数据构造、suite 编排、脚本实现、CI 执行步骤、artifact raw schema 细节、开发 commit boundary、代码落地顺序、部署命令、运维 runbook 和测试执行流水账不属于 `06`。`06` 只消费它们形成可裁决门禁。 |
| 是否存在阻塞验收标准生成的上游缺口? | 不阻塞 Step 2。新版 `00`~`05` 已足够启动验收目标与范围设计。正式送验版本、固定 `<run_id>`、环境和 evidence instance 尚未固定,属于 Step 3 的基线任务。旧 `06` 与新版设计不一致,但其地位已降级为历史诊断,不是上游缺口。 |

## 5. 当前文档问题诊断

| 位置 | 当前问题 | 本 Step 处理 |
|---|---|---|
| `06-验收标准.md` | 旧草案章节不是新版 15 章主链,且含旧对象、旧入口族、旧证据路径和旧验收项 | 标记为历史诊断输入;正式 `06` 只在 Step 15 由新版中间产物重建 |
| `06-验收标准.md` | 旧草案将测试执行证据、实现主线和验收门禁混在一起 | 新版 `06` 必须改为裁决文档,每个门禁写通过条件、失败条件、证据来源和裁决影响 |
| `05-测试方案.md` | 已定义 TC / EV / suite / artifact / report 结构,但不做最终验收裁决 | 新版 `06` Step 5~11 消费这些证据,不得另造 evidence schema |
| `05-测试方案.md` §14 | P1 selected-run、真实产品、production-like capacity 和硬性能阈值仍是 residual / future 口径 | Step 2 / Step 9 / Step 13 明确 P0、条件通过和 residual 的裁决边界 |
| `00-需求文档.md` §14 | 已定义 AC-ID-001~015 和 VETO-ID-001~006 | Step 5~11 逐项转成可裁决验收门禁 |
| 送验材料 | 当前没有在 Step 1 固定 `<run_id>`、送验 commit、环境和 evidence instance | 不阻塞 Step 2;Step 3 必须闭合 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 验收标准生成方式 | 旧 `06` 直接作为草案阅读,容易继承旧口径 | 建立 `06_acceptance_calibration_flow.md` 与 Step 1 输入边界 | 符合验收 SOP 的中间产物先行 |
| 上游权威顺序 | 旧 `06` 与新版 `00`~`05` 可能混读 | 明确新版 `00`~`05` 为正式输入,旧 `06` 仅作历史诊断 | 防止旧验收主语和旧证据结构回流 |
| 证据来源 | 旧草案使用泛化证据描述 | 明确从新版 `05` 的 TC / EV / suite / report / acceptance 路径消费 | 确保证据可复验、可追溯 |
| 验收基线 | 旧草案未绑定新版 run-scoped artifact / report 规则 | 明确 `<run_id>`、送验版本、环境和数据在 Step 3 固定 | 避免使用“最新版本”或口头基线 |
| 文档职责 | 旧草案混入测试方案和执行记录 | 明确 `06` 只定义裁决门禁和结论口径 | 保持 `05` 和 `06` 边界 |

## 7. 验收裁决取舍

| 议题 | 可选方案 | 取舍 |
|---|---|---|
| 是否直接重写正式 `06` | A. 直接替换正式文档;B. 先走 `06_acceptance_*` 中间产物 | 采用 B。SOP 要求中间产物先行,正式文档 Step 15 装配 |
| 是否继承旧 `06` 验收项 | A. 直接继承;B. 只作历史诊断 | 采用 B。旧草案与新版 `03/04/05` 的对象、flow、state、evidence 和路径规则不一致 |
| 是否在 Step 1 固定具体 run | A. 立即假定 run;B. Step 3 再固定 | 采用 B。Step 1 只确认输入类型,具体送验版本和 evidence instance 属于验收基线 |
| 是否把测试报告写入验收标准 | A. 写入执行结果;B. 只引用 evidence ID 和 report path | 采用 B。验收标准定义判定规则,执行结果由 reports 和 acceptance handoff 承载 |
| 是否允许 VETO 风险接受 | A. 可由负责人接受;B. 不可接受 | 采用 B。`VETO-ID-001~006` 命中即不通过 |

## 8. 结构化中间产物

### 8.1 验收输入映射表

| 来源文档 | 验收输入 | 本文如何裁决 |
|---|---|---|
| `00-需求文档.md` | C-ID-1~C-ID-5、FR-ID-001~014、BR-ID-001~015、NFR-ID-001~009、AC-ID-001~015、VETO-ID-001~006、数据归属和 forbidden material | Step 2 定范围;Step 5~11 转为功能、红线、接口、状态、非功能、证据和 VETO 门禁 |
| `01-架构设计.md` | identity truth boundary、dependency direction、sibling repo collaboration、data ownership、runtime/event collaboration | Step 6 / Step 7 验证架构红线、依赖类型和跨仓协作接缝 |
| `02-概要设计.md` | 组件、关键对象、API / 接口骨架、处理流、状态传播、异常边界 | Step 5 / Step 7 / Step 8 验证功能、接口、状态和异常裁决口径 |
| `03-详细设计.md` | object/protocol/flow/state/transaction/error/idempotency/config/observability/test cuts | Step 5~10 的正式设计契约来源,每个 P0 门禁必须回指具体契约族 |
| `04-配置设计.md` | profile、strict JSON、source priority、adapter mode、runtime builder、redaction、rollback digest | Step 3 / Step 9 / Step 10 定义环境、配置、可用性、脱敏和证据门禁 |
| `05-测试方案.md` | `TC-ID-*`、`EV-ID-*`、suite、artifact/report、entry/exit、defect/retest、residual risk | Step 5~13 消费测试证据、报告路径、缺陷规则和风险接受输入 |
| `06-验收标准.md` | 旧验收方向、旧基线、旧门禁写法 | 历史诊断;不直接回填 |
| 验收 SOP / 书写规范 | 15 Step、15 章主链、三值结论、证据引用、校准来源写法 | 约束本轮 `06` 的生成流程和正式结构 |

### 8.2 验收标准不再回答的问题

- 不重新定义需求目标、FR、BR、NFR、AC、VETO 或数据归属。
- 不重新选择架构方案、依赖方向、产品选型、相邻仓职责或 truth ownership。
- 不重新定义对象字段、DTO、port、state、error、flow、transaction、idempotency、config key、artifact schema 或 evidence object。
- 不设计测试用例、fixture、suite、脚本、CI pipeline 或 raw artifact JSON 结构。
- 不记录测试执行流水账、日志正文、截图正文或临时调试输出。
- 不安排开发 commit、实施顺序、发布步骤、部署命令或运维 runbook。
- 不验收相邻仓完整内部业务状态机,只裁决 identity 正式边界和接缝。
- 不用风险接受覆盖一票否决项。

### 8.3 验收标准必须回答的问题

- 本轮验收依据哪些正式需求、设计、测试方案和送验基线。
- 本轮验收裁决哪些范围项,哪些属于非范围或 residual。
- 哪些进入条件满足后才允许开始验收,哪些退出条件满足后才允许签署。
- 每个 P0 功能、接口、事件、job、状态、事务、一致性、非功能和证据门禁的通过条件和失败条件是什么。
- 每个 P0 验收项对应的设计契约、测试用例、证据 ID、report path 和裁决影响是什么。
- `VETO-ID-001~006` 如何检查、由哪些 evidence 支撑、触发后如何裁决。
- 缺陷如何分级、如何复验、如何影响通过 / 有条件通过 / 不通过。
- 哪些 residual risk 可以支撑有条件通过,由谁接受,后续动作和截止时间是什么。
- 最终结论和签署如何表达,签署是否同时代表风险接受。

### 8.4 初始验收输入候选表

| 验收输入候选 | 来源 | 当前状态 | 后续处理 |
|---|---|---|---|
| `C-ID-1~C-ID-5` 核心能力闭环 | `00` | 正式输入 | Step 2 定目标;Step 5 建功能门禁 |
| `FR-ID-001~014` / `BR-ID-001~015` | `00` | 正式输入 | Step 5 / Step 6 / Step 8 转为验收项 |
| `NFR-ID-001~009` | `00` | 正式输入 | Step 9 定非功能门禁;Step 10 消费 evidence |
| `AC-ID-001~015` | `00` | 正式输入 | Step 5~10 映射验收项和证据 |
| `VETO-ID-001~006` | `00` | 正式输入 | Step 11 定义一票否决项;Step 13 禁止风险接受覆盖 |
| dependency boundary / data ownership / truth boundary | `01` / `03` | 正式输入 | Step 6 / Step 7 验收 |
| command / query / inbound / outbound / job protocols | `03` | 正式输入 | Step 5 / Step 7 验收 |
| state matrix / transaction / idempotency / recovery | `03` | 正式输入 | Step 8 / Step 12 验收 |
| profile / config / adapter mode / redaction | `04` | 正式输入 | Step 3 / Step 9 / Step 10 验收 |
| `TC-ID-*` / `EV-ID-*` / suite / reports | `05` | 正式输入 | Step 5~11 逐项挂接 |
| residual risk /不可风险接受项 | `05` §14 | 正式输入 | Step 13 形成有条件通过或不通过口径 |
| 送验 commit / build / image / `<run_id>` | 送验材料 | 待固定 | Step 3 固定 |
| 旧验收门禁 | 旧 `06` | 历史输入 | Step 15 清理旧残留 |

## 9. 对上游 / 下游文档的影响判定

| 结论 | 是否影响上游 / 下游 | 影响类型 | 处理状态 |
|---|---|---|---|
| 新版 `00`~`05` 足够启动 Step 2 | 否 | 验收 SOP 进入条件 | 无需回写 |
| 旧 `06` 不能作为当前验收真相源 | 否 | 下游文档权威级别 | Step 15 重建正式 `06` |
| `<run_id>` 和送验版本尚未固定 | 否 | 验收基线待定义 | Step 3 闭合 |
| P1 selected-run 和真实产品不作为 P0 输入 | 否 | 验收范围 / residual | Step 2 / Step 13 继续裁决 |
| 若后续 P0 验收项找不到正式 TC / EV / report path | 是 | 测试证据闭环缺口 | 回写 `05` 或暂停对应验收项 |
| 若后续 P0 验收项找不到正式设计契约 | 是 | 设计真相源缺口 | 回写 `03` 或暂停对应验收项 |
| 若 VETO 缺检查方式或证据路径 | 是 | 验收红线不可裁决 | Step 11 阻塞,不得进入 Step 15 |

## 10. 回填草稿

> 校准来源:
> - `design-calibration/06_acceptance_step_01_input_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”“对上游 / 下游文档的影响判定”和“待确认事项”小节,了解验收标准输入边界如何从新版 `00/01/02/03/04/05` 收敛。

正式 `06-验收标准.md` §1 应回填:

- 本验收标准承接新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md` 和 `05-测试方案.md`。
- `00` 的 AC-ID 与 VETO-ID 是验收裁决的需求来源;`03` 的正式契约是验收项的设计来源;`05` 的 TC / EV / suite / report 是验收证据来源。
- 旧版 `06-验收标准.md` 只作为历史诊断输入,不得覆盖新版上游真相源。
- 验收标准不重新定义需求、设计、测试用例、artifact schema、实施计划或测试执行结果,只定义可裁决门禁、证据要求、风险接受和最终结论。
- 正式验收不得使用 `latest` 或口头证据;送验版本、`<run_id>`、环境、数据和报告入口必须在验收基线中固定。

## 11. 待确认事项

| 待确认事项 | 影响 | 当前处理 |
|---|---|---|
| 送验 commit / build / image 尚未固定 | 影响 Step 3 验收基线 | Step 3 必须补齐 |
| `<run_id>` 尚未固定 | 影响 evidence / report path 是否可裁决 | Step 3 必须补齐 |
| `reports/acceptance/*` 是否已有正式送验材料尚未确认 | 影响 Step 10 / Step 14 | Step 10 检查,Step 14 决定结论 |
| 风险接受角色和签署角色尚未固定 | 影响有条件通过与最终签署 | Step 13 / Step 14 定义 |
| 正式 `06` 仍是旧草案 | 读者可能误用旧基线 | Step 15 统一重建;当前通过校准工作台标识状态 |

## 12. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 验收输入文档清单明确 | 通过 | 见 §3 / §8.1 |
| 旧 `06` 地位已明确 | 通过 | 仅历史诊断,不作为真相源 |
| 验收标准必须回答 / 不再回答的问题明确 | 通过 | 见 §8.2 / §8.3 |
| 上游阻塞缺口已判断 | 通过 | 无阻塞 Step 2 的输入缺口 |
| 正式 `06` 未提前改写 | 通过 | 本 Step 只写 `design-calibration` 中间产物 |
| 可进入 Step 2 | 通过 | 用户已确认,进入 Step 2: 明确验收目标与范围 |
