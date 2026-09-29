# Step 14. 验收标准

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 回填位置：正式 `00-需求文档.md` §14
- gate_status：`pass_with_blockers`
- gate_reason：A1~A9 的闭环、功能、规则/边界、数据归属和非功能均有可判断条件；一票否决项覆盖越权、伪成功和不可追溯情形。
- next_allowed_action：进入 Step 15 风险与待确认事项。

### 1.1 Step 内计划

- [x] 读取 Step 7、Step 9~13 和需求规范 §4.14。
- [x] 按 A1~A9 回答闭环、功能、规则、数据和 NFR 的通过条件。
- [x] 诊断旧验收的固定六域、合规声明、分钟级恢复和业务状态越权。
- [x] 比较五类验收收口与按测试步骤/接口逐项罗列方案。
- [x] 形成验收表、一票否决项、能力映射和逐能力停审。
- [x] 完成回填草稿、待确认事项和跨能力验收自检。

## 2. 本步输入

- `design-calibration/00_req_step_07_core_capability_loop.md`
- `design-calibration/00_req_step_09_functional_requirements.md`
- `design-calibration/00_req_step_10_business_rules_boundaries.md`
- `design-calibration/00_req_step_11_data_ownership.md`
- `design-calibration/00_req_step_13_non_functional_requirements.md`
- `standards/document/需求文档书写规范.md` §4.14
- 旧 `00-需求文档.md` §11（仅作污染审计）

## 3. SOP 问题回答

1. 核心能力闭环怎样算成立？

   A1~A3 必须能说明请求、每个 source 的 authority/coverage 和 manifest closure；A4~A6 必须独立给出 integrity/compatibility、storage/lifecycle 和 read/verify 结果；A7~A9 必须生成逐 owner 计划/材料并记录每项 outcome/unknown/compensation。

2. 功能、规则和数据边界怎样算通过？

   F-AR-001~009 均有外部可判断结果；sealed/eligible/material-ready 不越权推导；Archive-owned 数据与 owner 快照/ref/禁止正文分层正确。

3. 非功能怎样算通过？

   缺 source/授权/完整性时 fail-closed；所有关键动作可追溯；重复/乱序/冲突/unknown commit 可判别；无 workload authority 时不得伪造量化通过。

4. 哪些情形是一票否决？

   直接跨域写入、业务状态/治理结论越权、projection/ref/fake 冒充 canonical/真实集成、未知结果伪成功、关键记录不可追溯或未知提交静默重放。

5. 是否存在无来源验收或核心功能未验收？

   无。每项验收均映射闭环、功能、规则、数据或 NFR；一票否决项未承载一般缺陷。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| 旧 00 §11 | 以“6+1 slice”、SoA/AIIA/ComplianceDeclaration 作为通过条件。 | 固定集合和治理结论越权。 |
| 旧 00 §11 | 以两分钟恢复项目作为完成。 | 无 baseline，且 Archive 无项目状态写权。 |
| 旧 00 §11 | 只验证 hash/signature 结果，不覆盖 authority、closure、compatibility、storage commit 和 handoff。 | 局部校验冒充全链成功。 |
| 旧材料 | 验收项混入测试动作和既定供应商。 | 需求验收与测试/实现层混写。 |

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 五类验收 + 一票否决 | 覆盖需求全链且可追溯。 | 需与 Step 16 矩阵联审。 | 采用。 |
| B. 按 API/测试用例罗列 | 执行感强。 | 越过需求层且依赖未定协议。 | 不采用。 |
| C. 只验 Bundle 存在和 Restore 成功 | 简短。 | 无法验证来源、边界和局部失败。 | 不采用。 |

## 6. 结构化中间产物

### 6.1 验收标准表

| 验收类别 | 验收项 | 验收条件 |
|---|---|---|
| 核心能力闭环验收 | A1~A3 请求、逐源采集与闭包 | 可解释请求被受理；每个声明切片有 owner/version/fence/coverage 状态；manifest 与材料/引用集合闭合，否则明确 rejected/partial/incomplete。 |
| 核心能力闭环验收 | A4~A6 验证、存储与只读查询 | 摘要/签名/兼容状态可判别；位置/层级/生命周期执行反馈可查询；只读结果带 provenance，不把 unknown 或 projection 当可信真相。 |
| 核心能力闭环验收 | A7~A9 恢复与补偿 | 恢复申请包含目标 owner、范围和依据；生成 owner-specific 材料并记录逐项 handoff/outcome；partial、commit-unknown 和 compensation-required 可见。 |
| 功能能力验收 | `F-AR-001~003` | 请求、capture、manifest/closure 能力均可从外部结果判断，且不存在固定六域或越界来源。 |
| 功能能力验收 | `F-AR-004~006` | 完整性/兼容、存储/生命周期和只读验证结果彼此独立可查询。 |
| 功能能力验收 | `F-AR-007~009` | 恢复计划、owner handoff、结果/重试/补偿能力均不直接改变 owning domain 状态。 |
| 规则 / 边界验收 | sealed/eligible/material-ready 语义 | 这些状态只表达 Archive 自有阶段或材料可交接，不推导项目生命周期、治理批准、owner committed 或恢复成功。 |
| 规则 / 边界验收 | source authority 边界 | workspace projection、observability 摘要和 Artifact ref 不冒充 canonical truth 或完整正文；Archive 不拥有上游业务真相。 |
| 规则 / 边界验收 | 治理与删除边界 | retention、legal hold、删除授权、风险接受和销毁仅能依据正式 decision 执行；缺失/冲突即 blocked。 |
| 数据归属验收 | Archive-owned 数据 | request/job、bundle/manifest、binding/coverage、verification、storage/lifecycle、restore plan/handoff/outcome 均归 Archive 真相。 |
| 数据归属验收 | 外部切片与正文边界 | 上游材料仅为快照或引用；identity、conversation、work、process、governance、artifact、workspace、observability 正文不进入本仓真相范围。 |
| 非功能验收 | 安全、审计与可追溯 | 关键动作能追溯到 source/decision/ref 或外部反馈；缺来源、缺授权或未知完整性时 fail-closed。 |
| 非功能验收 | 幂等/一致性与可观测性 | 重复、乱序、冲突、未知提交和补偿按 request/slice/item 独立暴露；A1~A9 状态和失败类别可定位。 |
| 非功能验收 | 性能与可用性口径 | 在 workload authority 关闭前不承诺分钟级 SLA；依赖失效时已知局部结果可读但不得声称全局成功。 |

### 6.2 一票否决项

- Archive 直接改写任一 owning domain 的业务状态、数据库或治理结论。
- 将 `sealed`、`verified`、`eligible`、`material-ready` 或局部成功解释为项目 archived/dissolved/restored、owner committed 或全局完整可信。
- 缺少 source authority、范围、版本/fence/coverage、摘要/签名或授权时仍宣称完整归档或恢复成功。
- 将 workspace projection、observability 摘要、Artifact ref 集合或 fake 输入冒充 canonical truth/真实集成。
- 关键请求、验证、存储、handoff 或补偿记录不可追溯，或 commit-unknown 被静默重放造成重复副作用。

### 6.3 能力级停审

| 能力 | 验收承接 | 结果 |
|---|---|---|
| A1 | 请求与 authority 可解释 | pass_with_blockers |
| A2 | 逐源 version/fence/coverage 与失败状态可判别 | pass_with_blockers |
| A3 | manifest/closure 一致；不一致不得 sealed | pass_with_blockers |
| A4 | integrity/compatibility 独立可判别 | pass_with_blockers |
| A5 | storage/lifecycle 外部反馈和治理边界可判别 | pass_with_blockers |
| A6 | 只读 provenance/status 不冒充业务查询 | pass_with_blockers |
| A7 | 目标 owner、授权、范围和兼容性可校验 | pass_with_blockers |
| A8 | owner-specific material/handoff 不直接写上游 | pass_with_blockers |
| A9 | outcome/unknown/retry/compensation 逐项可追溯 | pass_with_blockers |

跨能力验收审计未发现重复、无来源、遗漏或过宽否决项。

## 7. 回填草稿

需求验收必须同时覆盖：请求到闭包、验证到只读查询、恢复计划到 owner-specific handoff/补偿三段能力链；F-AR-001~009 的外部结果；sealed/authority/governance/restore 写权规则；Archive 真相与上游快照/ref/禁止正文边界；fail-closed、追溯、幂等和状态可观测质量。任何跨域写入、伪成功、authority 混淆、fake 冒充真实集成或不可追溯均使整体不通过。

## 8. 待确认事项

- `AR-UP-001~009` 使正向集成验收保持 blocked/pending，但失败姿态和边界验收仍可成立。
- 量化性能、容量、RTO/RPO 和外部密码学/存储验证须等待正式 authority；当前不得形成通过 verdict。

## 9. 自检与进入下一步条件

- [x] 五类验收类别均覆盖前文关键约束。
- [x] 每项验收可回指 A1~A9、F-AR、BR-AR、数据归属或 NFR。
- [x] 一票否决项只列整体不可通过的边界破坏，不承载普通缺陷。
- [x] gate_status=`pass_with_blockers`，允许进入 Step 15。
