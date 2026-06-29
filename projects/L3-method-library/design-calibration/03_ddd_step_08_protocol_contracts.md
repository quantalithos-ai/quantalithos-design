# Step 8. 定义 API / Command / Query / Event / Job 协议契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 8
> 回填章节: `projects/L3-method-library/03-详细设计.md` §8 API / Command / Query / Event / Job 协议契约
> 创建日期: 2026-06-22
> 当前模式: full-restart
> 当前状态: completed
> 当前模块: Step 9 `R9.1 开工与必读文档:先思考`
> 当前门禁: `R8.26` completed;等待用户确认进入 Step 9 `R9.1 开工与必读文档:先思考`

---

## 0. 文件重置记录

本文件已在 Step 8 `R8.1 开工与必读文档:先思考` 中重置为 full-restart 门禁壳。

旧 `03_ddd_step_08_protocol_contracts.md` 曾标记为 `[x] 已确认`,但其内容围绕旧 `MethodContent`、HTTP JSON P0/P1、snapshot、outbox、L0-bus、governance gate、object storage、fingerprint 等旧主线展开。该 completed 状态和旧协议结论全部失效。

当前文件不继承旧 Step 8 的 protocol inventory、DTO 字段、HTTP route、RPC 映射、event topic、job schema、错误码、P0/P1 分层或正式章节编号。旧内容只能作为后续 `R8` 历史污染审计输入,不得作为当前 Step 8 的正向真相源。

## R8.1 开工与必读文档:先思考

### 1. 当前模块目标

`R8.1` 只能思考 Step 8 开工边界、必读文档、Step 7 承接输入、协议族分组框架和旧 API 协议污染隔离方式。

| 项 | 内容 |
|---|---|
| 本模块状态 | completed |
| 当前允许 | 思考必读文档、输入边界、协议族分组框架、旧协议污染隔离和 `R8.2` 写入边界。 |
| 当前禁止 | 写 command / query / event / job DTO schema、具体 HTTP route / topic / RPC、函数签名、function flow、状态矩阵、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

### 2. Step 8 启动前必须承接

| 输入 | 必须承接的内容 | 禁止继承的内容 |
|---|---|---|
| `project_execution_ledger.md` | 当前恢复点、单模块推进规则、Step 7 completed、Step 8 wait_user_confirm_to_R8.1。 | 跳过当前门禁直接写 DTO。 |
| `03_ddd_calibration_flow.md` | Step 7 completed、Step 8 pending、后续 Step 阻塞关系。 | 将 Step 9+ flow / state / persistence 内容提前写入 Step 8。 |
| `03_ddd_step_01_input_boundary.md` | 输入权威顺序和历史材料隔离。 | 从旧 `03-详细设计.md` 直接恢复旧 API / P0 / P1 结论。 |
| `03_ddd_step_02_scope.md` | 本轮详细设计范围和非范围。 | 恢复旧 MethodContent 发布闭环作为当前协议主线。 |
| `03_ddd_step_03_runtime_constraints.md` | language/runtime、仓库约束、安全边界和缺口回设计规则。 | 根据实现习惯自行补 transport / schema。 |
| `03_ddd_step_04_module_layout.md` | 七实现单元与文件布局 owner。 | 新增未闭口 entry / adapter / route module。 |
| `03_ddd_step_05_module_contracts.md` | 模块主轴、依赖方向、八组件 owner 路由。 | 让 contracts 依赖 application / domain-only 类型,或 entry 绕过 application。 |
| `03_ddd_step_06_object_contracts.md` | 对象 owner、public shell、shared refs、marker、decision、helper、state owner。 | 写 Step 6 未闭口的 DTO 字段、marker、reason 或 state。 |
| `03_ddd_step_07_trait_port_adapter.md` | application port family、entry restriction、body-free outcome、read surface、marker / diagnostic 来源。 | DTO 绕过 Step 7 port family 或发明新 mapper / repository。 |

### 3. Step 8 开工红线

| 红线 | 说明 |
|---|---|
| 不继承旧 completed | 旧 Step 8 的 `[x] 已确认`、旧协议总表、旧 DTO / route / event / job 结论全部视为 historical_material。 |
| 不从旧 API 推协议 | 旧 `MethodContent`、snapshot、fingerprint、outbox、L0-bus、HTTP P0/P1、governance gate、object storage 不能作为当前协议主线。 |
| 不自行补 schema | 如果 Step 6 / Step 7 没有给出 public ref、marker、decision、page、result、receipt、report、event outcome 来源,Step 8 必须暂停回设计闭口。 |
| 不越过 Step 边界 | Step 8 只定义 public protocol schema 与 DTO 构造闭环;不写 function flow、state matrix、persistence、config、test。 |
| 不修改正式文档 | 正式 `03-详细设计.md` 仍等待后续装配门禁。 |

### 4. 必读文档思考结果

| 文档 | Step 8 使用方式 | 当前判断 |
|---|---|---|
| `project_execution_ledger.md` | 恢复当前模块和单模块推进规则。 | 当前只允许 `R8.1`,完成后等待 `R8.2`。 |
| `03_ddd_calibration_flow.md` | 确认 Step 7 completed、Step 8 pending 和 Step 9+ 阻塞关系。 | Step 9~19 均仍 blocked_by 前序 Step。 |
| `03_ddd_step_01_input_boundary.md` ~ `03_ddd_step_04_module_layout.md` | 承接输入权威、范围、runtime 约束和七实现单元布局。 | Step 8 不能新增 crate / module / transport owner。 |
| `03_ddd_step_05_module_contracts.md` | 承接 `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七模块主轴。 | public DTO 归属和 entry caller 必须服从该依赖方向。 |
| `03_ddd_step_06_object_contracts.md` | 承接 public refs、markers、decision、shared shell、state owner 和 helper 对象。 | DTO 字段必须能回指对象字段、shared type 或正式 mapper。 |
| `03_ddd_step_07_trait_port_adapter.md` | 承接 port family、read surface、page/cursor、stored result、publisher/handoff outcome、entry restriction。 | 协议必须能回指 Step 7 family,不能绕过 facade / port。 |
| `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` | 承接 Definition vs Use、body-free、数据归属、接口骨架和处理流轮廓。 | Step 8 只用当前 00/01/02 主线,不继承旧正式 03。 |
| `02_hld_step_07_api_interface_skeleton.md` | 提供 Command / Query / Event / Job 名称与接口骨架线索。 | 只能作为协议族候选来源,具体 schema 必须由 Step 6 / 7 闭口。 |
| `02_hld_step_08_processing_flows.md` | 提供后续 Step 9 flow 需求线索。 | 只能反推协议输入/输出需求,不得在 Step 8 写 flow。 |
| `02_hld_step_12_detailed_design_handoff.md` | 提供详细设计承接清单。 | 用于确认 Step 8 与后续 Step 的承接断点。 |
| `详细设计讨论流程_SOP.md` Step 8 | 约束输出形态、协议族分批、DTO 构造闭环和停审。 | 必须按协议族/所属模块逐批展开,不得一次性生成无归属全仓 schema。 |
| `详细设计书写规范.md` §5.7 | 约束协议总表、单协议小节、schema、错误映射、字段来源和构造闭环表。 | R8 后续写入必须给字段来源、public type 归属、缺失处理和后续 flow。 |
| `设计真相源闭环与可落码性标准.md` | 约束 public DTO 二级类型、字段来源、构造闭环、page、receipt、report、evidence 来源。 | 缺 schema / public marker / DTO mapping / page helper 时不得自行补。 |
| `L1-governance` Step 8 | 框架参考。 | 采用分批深度和停审模板,不复制 governance 领域语义。 |

### 5. Step 7 承接输入思考

| Step 7 family | Step 8 需要承接的协议能力 | 当前判断 |
|---|---|---|
| Port owner 与依赖边界 | public protocol DTO 只能位于 contracts / entry shell,entry 只调用 application facade。 | Step 8 必须写 public type 归属和 facade caller。 |
| 基础 helper / operation support | request metadata、idempotency、stored result、page info、checkpoint、operation result shell。 | Command / Job / Query page / duplicate replay surface 必须回指这些 helper。 |
| Core truth repository | definition、catalog、formalization state、formal version 的 public refs / result shell。 | Command / Query DTO 不得暴露 repository handle 或 domain-only truth body。 |
| Support / material / relation / peripheral repository | basis/external summary、material、trace、impact、audit、lineage、relation、package、assembly public view refs。 | Query response / event payload 只能复制 body-free summary / ref / marker。 |
| Resolver / mapper / builder | basis、diagnostic、availability、read、degraded、distribution、discovery public surface。 | Query empty / not visible / stale / degraded / unavailable 必须有可测试 surface。 |
| Inbound / publisher / handoff | inbound envelope、event candidate、publication outcome、handoff outcome、target summary。 | Inbound / outbound / receipt DTO 必须 body-free,不得写 topic / payload body 细节。 |
| Jobs / maintenance / runtime | job input/output/report、checkpoint、progress、issue、runtime precheck、availability summary。 | Job DTO 必须覆盖 duplicate / partial / failed / blocked / unavailable surface。 |
| Infra implementation 与 entry restriction | API / worker / jobs 入口只暴露 protocol shell 与 runtime summary。 | Step 8 必须防止 entry direct-call 或 concrete adapter 泄露。 |

### 6. 协议族分组框架思考

Step 8 应采用 L1-governance 的分批深度,但替换为 L3-method-library 当前对象和 port family。协议讨论顺序必须先 shared shell,再按 Command / Query / Inbound / Outbound / Job 展开,最后做 public surface 闭环审计。

| 候选顺序 | 协议族 | 目标 |
|---|---|---|
| R8.2 | 开工与必读文档:再写入 | 写入读取记录、输入基线、旧材料规则、Step 内模块计划和 R8.3 门禁。 |
| R8.3 / R8.4 | L1-governance 框架对齐 | 固化协议族分批、public DTO 二级类型、page/receipt/report、stop-review 模板。 |
| R8.5 / R8.6 | Step 7 承接与协议发现轴 | 从 port family、object shell、HLD interface skeleton 抽取协议 capability 池。 |
| R8.7 / R8.8 | shared protocol helper | request metadata、actor/source、idempotency、operation result、page、error/degraded/public marker shell。 |
| R8.9 / R8.10 | Command protocol family | command envelope、request/result shell、accepted/rejected/duplicate result、effect summary。 |
| R8.11 / R8.12 | Query protocol family | query request、response view、page、empty/not visible/stale/degraded/unavailable surface。 |
| R8.13 / R8.14 | Inbound consumer protocol family | inbound envelope、typed payload boundary、receipt、duplicate/quarantine/delayed/no-op surface。 |
| R8.15 / R8.16 | Outbound event protocol family | outbound envelope、event schema version、payload boundary、publication outcome、body-free snapshot/reference shell。 |
| R8.17 / R8.18 | Operations job protocol family | job input/output/report、checkpoint/progress、partial/duplicate/failed/blocked surface。 |
| R8.19 / R8.20 | Protocol-to-object / port closure | DTO -> Step 6 object / Step 7 port / Step 9 flow 映射和缺口审计。 |
| R8.21 / R8.22 | 跨协议 public surface 审计 | 二级类型、命名漂移、page helper、receipt/report/result surface、actor/source、body-free 审计。 |
| R8.23 / R8.24 | 回填草稿 | 写入正式 §8 候选草稿,仍不改正式 `03-详细设计.md`。 |
| R8.25 / R8.26 | 自检与停审 | 关闭 Step 8 并同步到 Step 9 等待确认。 |

### 7. 旧 API 协议污染隔离

| 旧材料 | 当前定位 | 隔离方式 |
|---|---|---|
| 旧 Step 8 `[x] 已确认` | invalid historical state | 不作为当前 Step 8 completed 依据。 |
| 旧 `MethodContent` command / query | historical pollution candidate | 只能在后续差异审计中判断是否被当前 `MethodAsset*` 主线重命名 / 取代。 |
| 旧 snapshot / fingerprint / outbox / L0-bus payload | historical pollution candidate | 不得作为当前 event / job / query schema 第一来源。 |
| 旧 HTTP JSON / RPC / topic / job route | historical material | 后续必须由当前 Step 6 / 7 和 HLD skeleton 重新闭口。 |
| 旧 P0 / P1 protocol scope | historical material | 当前范围以本轮 Step 2 / Step 5 / Step 6 / Step 7 为准。 |
| 旧正式 `03-详细设计.md` §7 API 协议章节 | historical material | 只用于识别旧章节污染,不得直接回填。 |

### 8. `R8.2` 写入边界

| `R8.2` 允许写入 | `R8.2` 禁止写入 |
|---|---|
| 必读文档表和读取状态。 | 具体 command / query / event / job DTO schema。 |
| Step 8 输入基线和旧材料处理规则。 | HTTP route、RPC name、event topic、job trigger 具体清单。 |
| Step 内模块计划和每次确认只推进一个模块的规则。 | Rust struct / enum、JSON schema、错误码正文。 |
| L1-governance 框架参考边界。 | function flow、完整状态矩阵、persistence schema、config key、test case schema。 |
| `R8.3` 进入门禁。 | 正式 `03-详细设计.md` 或 Step 9 正文。 |

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否确认 Step 7 completed | 是。 |
| 是否识别旧 Step 8 completed 状态为 historical_material | 是。 |
| 是否完成 Step 8 必读与开工边界思考 | 是。 |
| 是否形成 Step 7 承接输入思考 | 是。 |
| 是否形成协议族分组框架 | 是。 |
| 是否形成旧 API 协议污染隔离规则 | 是。 |
| 是否形成 `R8.2` 写入边界 | 是。 |
| 是否写具体 DTO schema / route / topic / job trigger | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.2`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.2 开工与必读文档:再写入`;只允许写入 Step 8 必读文档表、读取状态、输入基线、旧材料处理规则、Step 内模块计划、L1-governance 框架参考边界和 `R8.3` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得继承旧 Step 8 completed 状态;不得写具体 command / query / event / job DTO schema、HTTP route、RPC name、event topic、job trigger、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.3`、Step 9 或后续 Step。

---

## R8.2 开工与必读文档:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.2 开工与必读文档:再写入`。 |
| 本模块目标 | 固化 Step 8 必读文档、读取状态、输入基线、旧材料处理规则、Step 内模块计划、L1-governance 框架参考边界和 `R8.3` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | 必读文档表、输入基线、旧材料规则、Step 内模块计划、framework reference 边界和 `R8.3` 门禁。 |
| 禁止范围 | 不修改正式 `03-详细设计.md`;不写具体 command / query / event / job DTO schema、HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence schema、config key 或 test case schema。 |

### 2. 必读文档读取状态

| 文档 | 读取状态 | Step 8 使用方式 |
|---|---|---|
| `project_execution_ledger.md` | 已读 | 恢复当前模块、单模块推进、旧材料隔离和 next_allowed_action。 |
| `03_ddd_calibration_flow.md` | 已读 | 确认 Step 7 completed、Step 8 in_progress、Step 9+ blocked。 |
| `03_ddd_step_01_input_boundary.md` | 已完成 / 承接 | 输入权威顺序、旧正式 03 与旧 calibration 文件的 historical_material 定位。 |
| `03_ddd_step_02_scope.md` | 已完成 / 承接 | 当前实现范围、非范围、不得恢复旧 P0/P1 作为当前协议范围。 |
| `03_ddd_step_03_runtime_constraints.md` | 已完成 / 承接 | Rust/runtime、跨仓依赖、安全/鉴权边界、缺口回设计规则。 |
| `03_ddd_step_04_module_layout.md` | 已完成 / 承接 | 七实现单元、entry/infra/contracts/application 的文件布局 owner。 |
| `03_ddd_step_05_module_contracts.md` | 已完成 / 承接 | 模块主轴、依赖方向、八组件 owner 路由。 |
| `03_ddd_step_06_object_contracts.md` | 已完成 / 直接前序 | public refs、markers、decision、shared shell、helper、state owner、field source。 |
| `03_ddd_step_07_trait_port_adapter.md` | 已完成 / 直接前序 | application port family、entry restriction、body-free outcome、read surface、stored result、page/cursor、mapper/diagnostic 来源。 |
| `00-需求文档.md` | 正式上游 | 仓定位、能力边界、依赖裁剪、业务规则、接口与依赖、验收红线。 |
| `01-架构设计.md` | 正式上游 | 职责边界、系统上下文、依赖方向、数据所有权、一致性和通信方式。 |
| `02-概要设计.md` | 直接输入 | 接口骨架、处理流轮廓、状态、异常、配置影响和详细设计承接清单。 |
| `02_hld_step_07_api_interface_skeleton.md` | 解释性输入 | 提供 Command / Query / Consumer / Event / Job 名称和边界线索。 |
| `02_hld_step_08_processing_flows.md` | 解释性输入 | 提供 Step 9 flow 对协议输入/输出的需求线索。 |
| `02_hld_step_12_detailed_design_handoff.md` | 解释性输入 | 确认详细设计承接清单和后续 Step 断点。 |
| `详细设计讨论流程_SOP.md` | 规范 | Step 8 输出形态、协议族分批、DTO 构造闭环、二级类型闭环和停审要求。 |
| `详细设计书写规范.md` | 规范 | 协议总表、单协议小节、schema、错误映射、字段来源和构造闭环表格式。 |
| `设计真相源闭环与可落码性标准.md` | 规范 | public DTO 二级类型、字段来源、page/receipt/report、schema 和可落码性门禁。 |
| `L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md` | framework_reference | 只参考分批深度、public surface 闭环和停审模板;不得复制 governance 领域语义。 |

### 3. Step 8 输入基线

| 输入基线 | 当前裁决 |
|---|---|
| 权威上游 | 当前正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`。 |
| 直接前序 | Step 6 对象实现契约与 Step 7 Trait / Port / Adapter 契约。 |
| 协议候选来源 | HLD interface skeleton + Step 7 family + Step 6 public object shell,三者交叉确认后才能进入协议候选。 |
| public type 来源 | contracts shared refs / markers / public shell、Step 6 helper / decision、Step 7 family 输出。 |
| DTO 字段来源 | 调用方输入、metadata / envelope、Step 6 object field、Step 7 lookup / resolver / mapper / builder / stored result 输出。 |
| 缺失字段处理 | reject、derive、lookup、degraded/unavailable、duplicate replay、quarantine/delayed 或暂停回设计;不得由实现端拼接。 |
| 后续 flow 需求 | Step 8 只写 protocol-to-flow handoff,具体调用链和事务顺序留给 Step 9。 |
| 正式文档 | `03-详细设计.md` 本模块不改;后续回填草稿或 Step 19 装配。 |

### 4. 旧材料处理规则

| 旧材料 | 当前定位 | 使用规则 |
|---|---|---|
| 旧 `03_ddd_step_08_protocol_contracts.md` `[x] 已确认` | invalid historical state | 不作为当前 Step 8 completed 依据。 |
| 旧协议总表 / DTO / route / topic / job schema | historical_material | 后续只用于差异审计,不得正向复制。 |
| 旧 `MethodContent` command / query / event / job | historical_pollution_candidate | 必须通过当前 `MethodAsset*` 对象和 Step 7 family 重新命名、重新归属、重新闭口后才可进入。 |
| 旧 snapshot / fingerprint / outbox / L0-bus 主线 | historical_pollution_candidate | 不得作为当前 event payload、query view、job report 或 stored result 第一来源。 |
| 旧 HTTP JSON / RPC / P0/P1 scope | historical_material | 当前协议范围由本轮 Step 2 / 5 / 6 / 7 和当前 HLD skeleton 决定。 |
| 旧正式 `03-详细设计.md` §7 API 协议章节 | historical_material | 只用于识别旧章节污染;不得直接回填。 |
| L1-governance Step 8 | framework_reference | 只参考结构、批次、停审和闭环深度,不得复制 governance 名称 / DTO / topic / result。 |

### 5. Step 内模块计划

| 模块 | 状态 | 输出范围 | 当前门禁 |
|---|---|---|---|
| R8.1 / R8.2 开工与必读文档 | completed | 必读文档、输入基线、旧材料规则、模块计划。 | pass |
| R8.3 / R8.4 L1-governance 框架对齐 | completed | 分批深度、二级 public type、page/receipt/report、stop-review 模板。 | pass |
| R8.5 / R8.6 Step 7 承接与协议发现轴 | completed | 从 port family、object shell、HLD skeleton 抽取协议 capability 池。 | pass |
| R8.7 / R8.8 shared protocol helper | pending | metadata、actor/source、idempotency、operation result、page、error/degraded/public marker shell。 | wait_user_confirm_to_R8.7 |
| R8.9 / R8.10 Command protocol family | pending | command envelope、request/result shell、accepted/rejected/duplicate/effect summary。 | blocked_by_R8.8 |
| R8.11 / R8.12 Query protocol family | pending | query request、response view、page、empty/not visible/stale/degraded/unavailable surface。 | blocked_by_R8.10 |
| R8.13 / R8.14 Inbound consumer protocol family | pending | inbound envelope、typed payload boundary、receipt、duplicate/quarantine/delayed/no-op surface。 | blocked_by_R8.12 |
| R8.15 / R8.16 Outbound event protocol family | pending | outbound envelope、schema version、payload boundary、publication outcome、body-free event shell。 | blocked_by_R8.14 |
| R8.17 / R8.18 Operations job protocol family | pending | job input/output/report、checkpoint/progress、partial/duplicate/failed/blocked surface。 | blocked_by_R8.16 |
| R8.19 / R8.20 Protocol-to-object / port closure | pending | DTO -> Step 6 object / Step 7 port / Step 9 flow 映射和缺口审计。 | blocked_by_R8.18 |
| R8.21 / R8.22 跨协议 public surface 审计 | pending | 二级类型、命名漂移、page helper、receipt/report/result、actor/source、body-free 审计。 | blocked_by_R8.20 |
| R8.23 / R8.24 回填草稿 | pending | 新 §8 候选草稿,仍不改正式 `03-详细设计.md`。 | blocked_by_R8.22 |
| R8.25 / R8.26 自检与停审 | pending | Step 8 停审记录,同步到 Step 9 等待确认。 | blocked_by_R8.24 |

### 6. L1-governance 框架参考边界

| 可借鉴项 | 本仓采用方式 | 不可复制项 |
|---|---|---|
| 分批写入计划 | Step 8 按 shared helper、Command、Query、Inbound、Outbound、Job、closure audit 分批。 | governance 的 command/query/event/job 名称。 |
| public secondary type closure | 每个 public DTO 字段类型必须有 schema / 归属 / 来源。 | governance 的具体 `Governance*` ref、marker、topic。 |
| DTO -> object / port / flow audit | 每个协议族完成后审计目标对象、依赖 port、后续 flow。 | governance 的领域对象构造规则。 |
| page / receipt / report surface | Query page、consumer receipt、job report 必须有 public schema 和 outcome。 | governance 的 visibility / outbox snapshot 细节。 |
| unsupported / duplicate / delayed / no-op surface | inbound / job / duplicate replay 必须可测试、可重复。 | governance 的具体 worker receipt enum。 |
| stop-review 模板 | 每个协议族停审,最后做跨协议 public surface 审计。 | governance completed 状态和语义结论。 |

### 7. `R8.3` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 只思考 L1-governance Step 8 的框架深度、分批组织、public DTO 二级类型、page/receipt/report、protocol-to-flow closure、stop-review 模板。 |
| 当前禁止 | 不复制 governance 领域语义;不写 L3-method-library 具体 DTO schema、HTTP route、RPC name、event topic、job trigger、function flow、状态矩阵、persistence schema、config key 或 test case schema。 |
| 必须使用 | 本模块固定的输入基线、旧材料规则、Step 内模块计划和 framework_reference 边界。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Step 8 必读文档表 | 是。 |
| 是否写入读取状态 | 是。 |
| 是否写入 Step 8 输入基线 | 是。 |
| 是否写入旧材料处理规则 | 是。 |
| 是否写入 Step 内模块计划 | 是。 |
| 是否写入 L1-governance 框架参考边界 | 是。 |
| 是否形成 `R8.3` 进入门禁 | 是。 |
| 是否继承旧 Step 8 completed 状态 | 否。 |
| 是否写具体 DTO schema / route / topic / job trigger | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.3`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.3 L1-governance 框架对齐:先思考`;只允许思考 L1-governance Step 8 的框架深度、分批组织、public DTO 二级类型、page/receipt/report、protocol-to-flow closure、stop-review 模板;不得复制 governance 领域语义;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 command / query / event / job DTO schema、HTTP route、RPC name、event topic、job trigger、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.4`、Step 9 或后续 Step。

---

## R8.3 L1-governance 框架对齐:先思考

### 1. 本模块边界

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.3 L1-governance 框架对齐:先思考`。 |
| 本模块目标 | 只分析 L1-governance Step 8 的组织框架、深度标准、停审方式和可迁移的闭环检查。 |
| 当前状态 | completed |
| 当前产物 | 框架对齐判断、可借鉴结构、不可复制边界、L3 Step 8 后续写入框架和 `R8.4` 写入边界。 |
| 当前禁止 | 不写 L3-method-library 具体 DTO schema、HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence schema、config key、test case schema或正式 `03-详细设计.md`。 |

### 2. L1-governance Step 8 框架观察

| 观察项 | L1-governance 做法 | 对 L3-method-library 的启发 |
|---|---|---|
| 先 shared helper | 先定义协议命名、envelope、result、page、error / validation surface。 | L3 也必须先统一 protocol shell,否则后续 command / query / event / job 会各自发明 metadata、page、result 和 marker。 |
| 再协议族展开 | Command、Query、Inbound、Outbound、Operations Job 分族写入。 | L3 不能按旧对象名一次性铺 DTO,必须按协议族小循环推进。 |
| 每族拆小批 | Command / Query / Event / Job 都按能力子集拆成多个批次。 | L3 每批只处理一个协议族或一个能力切片,避免为满足行数把内容压薄。 |
| 每批 stop-review | 每个批次后检查构造闭环、二级类型、错误 / 幂等 / actor / metadata、后续 flow 承接。 | L3 后续每个 `再写入` 批次必须留下停审表,不能只写 schema。 |
| 二级类型审计 | Step 末列出新定义 public secondary types、owner module、closure source。 | L3 必须显式审计 public DTO 中出现的 ref、marker、enum、receipt、report、page helper 的归属和来源。 |
| DTO 到对象 / port / flow 审计 | 用表格把协议族映射到 Step 6 object、Step 7 port、Step 9 flow required。 | L3 必须在 Step 8 末证明每个协议能被对象 / port 承接,并给 Step 9 留明确 flow 清单。 |
| body boundary 审计 | 明确 external family 中允许 / 禁止进入 public DTO 的 body。 | L3 必须保留 body-free 约束,特别是 method artifact / upstream source / external material 只能暴露 ref、summary、marker。 |
| later Steps 延后表 | 明确 function flow、state、persistence、error recovery、idempotency、config、test 留给后续 Step。 | L3 Step 8 只能收协议 contract,不能提前写处理流、事务、状态或测试。 |

### 3. 可迁移为结构的内容

| 可迁移结构 | L3 采用方式 | 迁移原因 |
|---|---|---|
| 分批写入总计划 | `R8.4` 固化 Step 8 后续批次,仍以 shared helper -> Command -> Query -> Inbound -> Outbound -> Job -> closure audit 为主轴。 | 避免 Step 8 再退回全仓总表式生成。 |
| 协议总纪律 | 在 shared helper 批次先定义命名、envelope、result、page、rejection / unavailable / degraded public surface 的写入要求。 | 后续各协议族只能复用统一 shell。 |
| public secondary type closure | 每个出现在 public DTO 的二级类型必须写 owner、schema / variants、字段来源、缺失处理和依赖方向。 | 防止实现阶段出现 schema / marker / mapper 缺口。 |
| page / receipt / report closure | Query page、consumer receipt、job report 作为一等 public surface,不得用 bool、裸 id 或 implementation-only struct 替代。 | L3 后续 query、consumer、job 都会依赖这些 surface。 |
| duplicate / delayed / no-op surface | Command / inbound / job 的重复、延迟、拒绝、无动作必须形成可测试 public outcome。 | 避免实现端用异常或日志替代正式协议结果。 |
| protocol-to-flow handoff | 每个协议族结束时列出 Step 9 需要写的 flow 名称和入口。 | 保证 Step 9 不需要重新猜协议入口。 |
| stop-review 模板 | 每批都检查字段来源、二级类型、body-free、metadata/idempotency、port/object/flow 闭环。 | 让门禁在中途生效,不是最后才发现缺口。 |

### 4. 不可复制为语义的内容

| 不可复制项 | 禁止原因 | L3 处理方式 |
|---|---|---|
| `Governance*` command / query / event / job 名称 | 属于 L1-governance 领域语义。 | 只能由 L3 当前 HLD interface skeleton、Step 6 object 和 Step 7 port family 交叉推导。 |
| governance visibility / outbox snapshot 细节 | 来源对象、状态和 port 与 L3 不同。 | L3 只能复用“visibility / freshness / degraded surface 必须闭合”的检查思想。 |
| governance topic map / route map | 传输和 topic 绑定不一定属于 L3 当前范围。 | L3 后续若需要传输名,必须由当前 00/01/02 和 Step 7 entry restriction 决定。 |
| governance job 清单和 report 字段 | 维护任务和报告项属于 L1-governance。 | L3 Job 协议只从 L3 operations / maintenance port family 推导。 |
| governance body boundary external family | 外部家族清单与 L3 依赖面不同。 | L3 只借鉴 allowed / forbidden body audit 表,内容由本仓依赖决定。 |
| governance completed 状态 | 是参考仓完成状态,不是本仓完成证据。 | L3 仍按本轮 `R8.x` 门禁逐批确认。 |

### 5. L3 Step 8 后续框架判断

| 后续模块 | 应采用的框架深度 | 停审重点 |
|---|---|---|
| `R8.4` 框架对齐写入 | 写入 L3 Step 8 的框架规则、批次模板、stop-review 模板和禁入项。 | 不写具体协议 schema。 |
| `R8.5 / R8.6` 协议发现轴 | 从 Step 7 port family、Step 6 public object shell、HLD API skeleton 抽取 capability 池。 | 每个候选协议必须有 object / port / HLD 三方来源。 |
| `R8.7 / R8.8` shared helper | 定义公共协议 shell 的字段类别和来源规则。 | metadata、actor/source、idempotency、page、result、rejection、marker 不得分散定义。 |
| `R8.9 / R8.10` Command | 为每个 command 形成 request / response / accepted / rejected / duplicate surface。 | command result 必须能构造 Step 6 对象或回指 Step 7 service outcome。 |
| `R8.11 / R8.12` Query | 为每个 query 形成 request、view、page、empty / not visible / stale / degraded / unavailable surface。 | view 字段、page helper、marker、read identity 必须有来源。 |
| `R8.13 / R8.14` Inbound | envelope 与 typed payload 分离,receipt outcome 完整。 | unsupported、duplicate、quarantine、delayed、no-op 不得混成 error。 |
| `R8.15 / R8.16` Outbound | event envelope、payload boundary、publication outcome 和 body-free snapshot / ref shell。 | publisher 不得重读 current truth 来拼 payload。 |
| `R8.17 / R8.18` Job | job request / response / report / checkpoint / progress / partial failure / duplicate replay。 | duplicate 必须走 stored report / result surface,不得重跑 job body。 |
| `R8.19 / R8.22` Closure audit | DTO -> object / port / flow、二级类型、命名漂移、page / receipt / report 统一审计。 | 缺字段、缺 mapper、缺 public marker、缺 port 时停审。 |

### 6. Stop-review 模板思考

后续每个协议族至少需要以下停审项:

| 检查项 | 通过标准 |
|---|---|
| 协议族边界 | 当前批次只处理一个协议族或一个明确能力切片。 |
| DTO 字段来源 | 每个字段能回指 caller input、metadata/envelope、Step 6 object、Step 7 port / mapper / builder / repository output。 |
| public secondary type | 每个 ref / enum / marker / receipt / report / page helper 有 owner、schema / variants、缺失处理。 |
| body-free 边界 | DTO 不携带外部正文、raw source body、transport secret、domain-only object body 或 adapter-private state。 |
| object closure | Command / Event / Job 能说明构造或影响的 Step 6 object;Query view 能说明读取的 object / view / marker。 |
| port closure | 每个读取、保存、发布、handoff、mapper、stored result、page 来源能回指 Step 7 port family。 |
| outcome closure | accepted、rejected、duplicate、delayed、quarantined、no-op、empty、not visible、stale、degraded、unavailable 等结果不缺 public surface。 |
| Step 9 handoff | 当前协议族列出后续必须定义的 flow,但不提前写 flow。 |
| 停审动作 | 若缺 schema / public marker / DTO mapping / port / stored result / page helper,立即暂停回设计闭口。 |

### 7. `R8.4` 写入边界

| `R8.4` 允许写入 | `R8.4` 禁止写入 |
|---|---|
| L1-governance 框架对齐结论。 | L3 具体 command / query / event / job DTO schema。 |
| L3 Step 8 分批写入模板。 | HTTP route、RPC name、event topic、job trigger。 |
| public secondary type、page / receipt / report、protocol-to-flow closure 的统一停审模板。 | Rust struct / enum、JSON schema、错误码正文。 |
| 可借鉴 / 不可复制边界。 | function flow、状态矩阵、persistence schema、config key、test case schema。 |
| `R8.5` 进入门禁。 | 正式 `03-详细设计.md`、Step 9 或后续 Step。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只完成 L1-governance 框架观察 | 是。 |
| 是否形成可迁移结构和不可复制边界 | 是。 |
| 是否形成 L3 后续 Step 8 框架判断 | 是。 |
| 是否形成 stop-review 模板思考 | 是。 |
| 是否形成 `R8.4` 写入边界 | 是。 |
| 是否写 L3 具体 DTO schema / route / topic / job trigger | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.4`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.4 L1-governance 框架对齐:再写入`;只允许写入框架对齐结论、Step 8 分批写入模板、public secondary type / page / receipt / report / protocol-to-flow closure 的 stop-review 模板、可借鉴 / 不可复制边界和 `R8.5` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 command / query / event / job DTO schema、HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.5`、Step 9 或后续 Step。

---

## R8.4 L1-governance 框架对齐:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.4 L1-governance 框架对齐:再写入`。 |
| 本模块目标 | 固化 L1-governance Step 8 对 L3-method-library 可借鉴的组织框架、批次模板、闭环检查和停审规则。 |
| 当前状态 | completed |
| 当前产物 | 框架对齐结论、Step 8 分批模板、public secondary type / page / receipt / report / protocol-to-flow closure 规则、stop-review 模板和 `R8.5` 进入门禁。 |
| 禁止范围 | 不修改正式 `03-详细设计.md`;不写 L3 具体 command / query / event / job DTO schema、HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence schema、config key 或 test case schema。 |

### 2. 框架对齐结论

L3-method-library Step 8 采用 L1-governance 的框架深度,但只迁移组织方法和闭环标准,不迁移领域语义。后续协议契约必须先建立公共协议 shell,再按协议族逐批展开,最后做跨协议 public surface 审计。

| 框架项 | L3-method-library 固化规则 |
|---|---|
| 组织主轴 | 按 shared helper、Command、Query、Inbound、Outbound、Operations Job、closure audit 分组。 |
| 批次策略 | 每次用户确认只推进一个 `先思考` 或 `再写入` 模块;单批以 100~300 行为宜,不足以闭口时继续拆批,不得压缩内容。 |
| 正向输入 | 当前 `00/01/02`、Step 6 object contract、Step 7 port contract、HLD interface skeleton。 |
| 禁入输入 | 旧 Step 8 completed 状态、旧 `MethodContent`、旧 HTTP JSON P0/P1、旧 snapshot / fingerprint / outbox / L0-bus 主线。 |
| public DTO 原则 | DTO 字段只能来自 caller input、metadata/envelope、Step 6 public object、Step 7 port / mapper / builder / repository / stored result 输出。 |
| 缺口处理 | 缺 public marker、二级类型 schema、DTO mapping、page helper、receipt/report schema、stored result 或 port 时暂停回设计闭口。 |
| 后续 Step 边界 | Step 8 只写协议契约和 handoff;函数级 flow、状态矩阵、持久化、错误恢复、并发幂等、配置和测试留给 Step 9~16。 |

### 3. Step 8 分批写入模板

| 模块 | 输出范围 | 必须停审的问题 |
|---|---|---|
| `R8.5 / R8.6` Step 7 承接与协议发现轴 | 从 Step 7 family、Step 6 object shell、HLD skeleton 抽取候选协议能力池。 | 每个候选协议是否同时有 object / port / HLD 来源;是否有旧材料污染。 |
| `R8.7 / R8.8` shared protocol helper | protocol name、metadata、actor/source、idempotency、operation result、page、error / degraded / unavailable public shell 的规则。 | shared shell 是否被后续所有协议族复用;是否引入未闭口二级类型。 |
| `R8.9 / R8.10` Command protocol family | command envelope、request/result shell、accepted / rejected / duplicate result、effect summary 的规则。 | Command 是否能构造或影响 Step 6 object;duplicate replay 是否有 stored result 来源。 |
| `R8.11 / R8.12` Query protocol family | query request、response view、page、empty / not visible / stale / degraded / unavailable surface 的规则。 | Query view / page / marker 是否有字段来源、repository key、read identity 和稳定派生规则。 |
| `R8.13 / R8.14` Inbound consumer protocol family | inbound envelope、typed payload boundary、receipt、duplicate / quarantine / delayed / no-op surface 的规则。 | envelope 字段是否与 payload 分离;receipt outcome 是否覆盖所有允许分支。 |
| `R8.15 / R8.16` Outbound event protocol family | outbound envelope、schema version、payload boundary、publication outcome、body-free event shell 的规则。 | outbound payload 是否来自 stored snapshot / ref shell,是否禁止 publisher 重读 current truth。 |
| `R8.17 / R8.18` Operations job protocol family | job input/output/report、checkpoint/progress、partial / duplicate / failed / blocked surface 的规则。 | job duplicate 是否走 stored report;job 是否越界修复 core truth。 |
| `R8.19 / R8.20` Protocol-to-object / port closure | DTO -> Step 6 object / Step 7 port / Step 9 flow 映射和缺口审计。 | 是否仍存在无法落码的字段、port、mapper、stored result、page、receipt/report 缺口。 |
| `R8.21 / R8.22` 跨协议 public surface 审计 | 二级类型、命名漂移、page helper、receipt/report/result、actor/source、body-free 审计。 | public DTO 是否直接依赖 domain-only 类型;命名是否与 HLD / DDD / Rust DTO 映射一致。 |
| `R8.23 / R8.24` 回填草稿 | 新 §8 候选草稿,仍不改正式 `03-详细设计.md`。 | 草稿是否只由已确认中间产物装配。 |
| `R8.25 / R8.26` 自检与停审 | Step 8 completion checklist 和进入 Step 9 条件。 | 是否可进入 Step 9,是否仍有 open item。 |

### 4. Public secondary type 闭环规则

| 规则 | 写入要求 |
|---|---|
| owner 必须明确 | 每个 public ref、enum、marker、receipt、report、page helper 必须写归属模块,优先落在 `contracts` 或明确的 entry shell。 |
| schema / variants 必须明确 | 二级类型不能只作为字段名出现;必须给字段或 variant、语义、缺失处理和依赖方向。 |
| 来源必须可追溯 | 每个二级类型必须能回指 Step 6 object、Step 7 port output、metadata/envelope 或当前 Step 8 新增 public shell。 |
| domain-only 禁止泄漏 | public protocol DTO 不得直接依赖 domain-only enum / ref / object;需要暴露时必须上提到 shared contracts 或定义正式 mapper。 |
| 命名漂移必须登记 | HLD `*Query`、DDD `*Request`、Rust DTO 名称发生收敛时,必须写一对一映射。 |
| 缺 schema 必须停审 | 发现二级类型缺 owner、字段、variant、来源或 mapper 时,不得继续补协议字段。 |

### 5. Page / receipt / report surface 规则

| Surface | 写入要求 | 禁止写法 |
|---|---|---|
| Query page | 必须定义 public page request / page info 与 Step 7 repository page / cursor 的映射规则。 | 只写 `Page<T>` 类型名,不写 owner、字段、cursor 来源。 |
| Query read surface | empty、not visible、stale、degraded、unavailable、rebuilding、disabled、missing projection state 必须可测试。 | 用普通 error、空数组或 bool 隐式表达。 |
| Command result / receipt | accepted、rejected、duplicate replay 必须有 public outcome 和 stored result 来源。 | duplicate 重跑 command 或把 rejected 当 infrastructure error 抛出。 |
| Inbound receipt | accepted、duplicate、quarantined / rejected、delayed / retry、no-op 必须分别有 disposition。 | envelope 与 typed payload 字段重复;用裸 id 替代 receipt。 |
| Outbound publication outcome | publication outcome 必须引用 stored event / snapshot / ref shell。 | publisher 从 current truth 重新拼 payload。 |
| Job report | job output 必须包含 report / issue / progress / checkpoint / duplicate replay surface 的规则。 | duplicate 重跑 job body;用日志或 bool 替代 report。 |

### 6. Protocol-to-flow closure 模板

每个协议族写完后必须追加以下闭环表。该表只声明 Step 9 需要承接的 flow,不在 Step 8 写调用顺序、事务边界或状态迁移。

| Protocol family | Step 6 object closure | Step 7 port closure | Step 9 flow required | 缺口处理 |
|---|---|---|---|---|
| `<family>` | `<目标 object / view / marker / helper>` | `<repository / resolver / mapper / builder / publisher / stored result / page port>` | `<后续 flow 名称或 flow family>` | `<pass / stop_review_open_item>` |

### 7. 每批 stop-review 模板

| 检查项 | 通过标准 | 未通过动作 |
|---|---|---|
| 协议族边界 | 本批只处理一个协议族或明确能力切片。 | 拆分批次,不得继续扩写。 |
| 字段来源 | 每个字段能回指 caller input、metadata/envelope、Step 6 object 或 Step 7 output。 | 标为 open item,暂停具体 schema。 |
| 二级类型 | public DTO 中所有 ref / enum / marker / receipt / report / page helper 有 owner 与 schema。 | 回到 shared shell 或 Step 6 / 7 补口。 |
| body-free | DTO 不携带 raw source body、外部正文、transport secret、domain-only body 或 adapter-private state。 | 删除或改成正式 ref / summary / marker。 |
| object closure | Command / Event / Job 能说明构造或影响对象;Query 能说明读取对象或 view。 | 暂停该协议族。 |
| port closure | 读取、保存、发布、handoff、mapper、stored result、page 都有 Step 7 承接。 | 暂停并回设计闭口。 |
| outcome closure | accepted、rejected、duplicate、delayed、quarantined、no-op、empty、not visible、stale、degraded、unavailable 不缺 public surface。 | 不得用 bool / error / log 替代。 |
| Step 9 handoff | 当前协议族列出后续 flow,但未写 flow 正文。 | 补 handoff 或回退越界内容。 |

### 8. 可借鉴 / 不可复制边界

| 可借鉴 | 不可复制 |
|---|---|
| L1-governance 的分批深度、停审节奏和 closure audit 表。 | `Governance*` command / query / event / job 名称。 |
| shared helper 先行的组织方式。 | governance 的 route、topic、outbox snapshot、visibility 具体字段。 |
| public secondary type 列表化审计。 | governance 的领域对象构造规则和状态语义。 |
| page / receipt / report 作为一等 public surface。 | governance 的 job 清单、report item、external family body boundary 内容。 |
| duplicate / delayed / no-op 等 outcome 必须可测试。 | governance 的 completed 结论作为 L3 completed 证据。 |

### 9. `R8.5` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.5 Step 7 承接与协议发现轴:先思考`,从 Step 7 family、Step 6 object shell、HLD skeleton 抽取协议 capability 池。 |
| 当前禁止 | 不写具体 DTO schema、HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence schema、config key 或 test case schema。 |
| 必须使用 | 本模块固化的分批模板、二级类型闭环规则、page / receipt / report surface 规则、protocol-to-flow closure 模板和 stop-review 模板。 |

### 10. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入框架对齐结论 | 是。 |
| 是否写入 Step 8 分批写入模板 | 是。 |
| 是否写入 public secondary type 闭环规则 | 是。 |
| 是否写入 page / receipt / report surface 规则 | 是。 |
| 是否写入 protocol-to-flow closure 模板 | 是。 |
| 是否写入 stop-review 模板 | 是。 |
| 是否写入可借鉴 / 不可复制边界 | 是。 |
| 是否形成 `R8.5` 进入门禁 | 是。 |
| 是否写 L3 具体 DTO schema / route / topic / job trigger | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.5`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.5 Step 7 承接与协议发现轴:先思考`;只允许从 Step 7 port family、Step 6 public object shell、HLD interface skeleton 抽取协议 capability 池,并识别旧材料污染和候选协议来源;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 command / query / event / job DTO schema、HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.6`、Step 9 或后续 Step。

---

## R8.5 Step 7 承接与协议发现轴:先思考

### 1. 本模块边界

| 项 | 内容 |
|---|---|
| 触发 | 用户连续确认后进入 `R8.5 Step 7 承接与协议发现轴:先思考`。 |
| 本模块目标 | 从 Step 7 port family、Step 6 public object shell、HLD interface skeleton 抽取协议 capability 池和发现轴。 |
| 当前状态 | completed |
| 当前产物 | 输入来源裁决、三方来源检查、协议发现轴、候选 capability 池、旧材料污染过滤和 `R8.6` 写入边界。 |
| 当前禁止 | 不写具体 DTO schema、HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence schema、config key、test case schema或正式 `03-详细设计.md`。 |

### 2. 输入来源裁决

Step 8 的协议发现不能从旧正式 §8 或旧 Step 8 反推。当前有效来源必须是三方交叉:

| 来源 | 可用内容 | 使用限制 |
|---|---|---|
| HLD interface skeleton | `R1.24` Command 总表、`R1.26` Query 总表、`R1.28` Inbound 总表、`R1.30` Outbound 总表、`R1.32` Operations Job 总表、`R1.34` owner 映射、`R1.38` 跨接口审计。 | 只能提供协议候选名、类别、owner 和高层输入 / 输出骨架;不能直接变成 DTO schema。 |
| Step 6 object contracts | contracts shared ref / marker / public shell、domain truth / material / view / summary、application helper、entry local result state。 | 只能提供对象、public shell 和字段来源候选;不能替代 Step 8 协议 schema。 |
| Step 7 port contracts | owner / dependency boundary、repository family、resolver / mapper / builder、inbound / publisher / handoff、jobs / runtime、entry restriction。 | 只能提供协议可调用的 formal seam;不能写 handler flow 或 transport binding。 |

### 3. 三方来源检查

每个后续协议候选进入 schema 写入前必须同时满足以下检查:

| 检查项 | 通过口径 | 未通过处理 |
|---|---|---|
| HLD 候选存在 | 该协议能回指 HLD Step 7 当前 `R1.24/26/28/30/32` 五类总表或 `R1.34` owner 映射。 | 标为 `candidate_missing_hld_source`,不得写 schema。 |
| Step 6 对象承接 | 输入 / 输出至少能回指 Step 6 的 typed ref、public shell、truth object、view、summary、material、task 或 entry result state。 | 标为 `candidate_missing_object_source`,回到 Step 6 / HLD 闭口。 |
| Step 7 port 承接 | 该协议需要的 read / write / resolve / map / publish / handoff / job / stored result / page 来源能回指 Step 7 family。 | 标为 `candidate_missing_port_source`,回到 Step 7 闭口。 |
| 旧污染过滤 | 候选不依赖 `MethodContent`、publish、snapshot、fingerprint、old outbox、P0/P1 plugin / config。 | 标为 `historical_pollution`,不得作为正向协议来源。 |
| Step 边界 | 候选只描述 protocol contract,不要求提前写 flow、state、persistence、config、test。 | 拆分到后续 Step 或暂停。 |

### 4. 协议发现轴

| 发现轴 | HLD 来源 | Step 6 承接 | Step 7 承接 | 后续协议族 |
|---|---|---|---|---|
| Command 写入口 | `R1.24` 58 个 Command,按八组成部分归属。 | domain truth、application operation context、stored result、api command entry shell。 | truth repository、UnitOfWork、id/idempotency、policy/diagnostic、stored result。 | `R8.9 / R8.10` |
| Query 读取入口 | `R1.26` 57 个 Query,只读 view / material / summary / ref / progress。 | public view shell、read decision、degraded decision、availability / freshness marker。 | repository page、read resolver、availability resolver、degraded mapper、page helper。 | `R8.11 / R8.12` |
| Inbound intake | `R1.28` 4 个 body-free Inbound Consumer。 | inbound intake decision、external summary、source ref、worker entry result state。 | inbound source port、external body-free source adapter、stored result / idempotency。 | `R8.13 / R8.14` |
| Outbound fact event | `R1.30` 34 个 Outbound Event,只表达已成立 fact / material / peripheral change。 | event candidate assembly、public event shell、safe marker、worker publisher entry。 | event candidate publisher、target registry、publication safe outcome。 | `R8.15 / R8.16` |
| Operations job | `R1.32` 8 个 Operations Job,统一归后台维护与收敛。 | job assembly context、maintenance task/progress/history、job result state。 | maintenance task / progress / run history repository、checkpoint、target planner、adapter availability。 | `R8.17 / R8.18` |
| Shared protocol shell | HLD 五类接口通用输入 / 输出骨架。 | typed boundary ref、safe marker、public shell、operation context、stored result。 | page/version helper、Clock、IdGenerator、UnitOfWork、stored result、entry restriction。 | `R8.7 / R8.8` |

### 5. 候选 capability 池思考

当前 Step 8 需要先把能力池分成六类,后续 `R8.6` 再写入正式候选表。

| Capability 类别 | 进入条件 | 典型承接 |
|---|---|---|
| shared envelope / metadata | 多个协议族重复需要 actor/source/metadata/idempotency/result/page。 | contracts shell + application operation context + Step 7 helper family。 |
| command result / rejection | Command 会写 truth、边界、summary、maintenance request 或 peripheral object。 | HLD Command + Step 6 truth/helper + Step 7 repository/stored result。 |
| query view / page / read surface | Query 只读 view/material/summary/ref/progress。 | HLD Query + Step 6 public shell/read decision + Step 7 read resolver/page helper。 |
| inbound envelope / receipt | Inbound 只接收 body-free external summary/ref/violation。 | HLD Inbound + Step 6 intake decision + Step 7 inbound source/stored result。 |
| outbound event / publication outcome | Outbound 只输出已成立 fact/material/peripheral change。 | HLD Outbound + Step 6 event candidate + Step 7 publisher/target registry。 |
| job input / report / progress | Job 只刷新材料、追溯、recovery、progress 或 peripheral material。 | HLD Job + Step 6 job context/progress + Step 7 maintenance/checkpoint/runtime。 |

### 6. 旧材料污染过滤

| 污染项 | R8.5 裁决 |
|---|---|
| 旧 `MethodContent` draft / review / publish / retire / supersede command | 不进入协议候选池。 |
| 旧 `GetMethodContent`、snapshot export、fingerprint compare query | 不进入协议候选池。 |
| 旧 governance gate consumer | 不进入 inbound 候选池。当前 inbound 只承接 body-free external summary/ref/violation。 |
| 旧 `method_library.content.published` topic、old outbox event、fingerprint changed event | 不进入 outbound 候选池。若后续需要投递机制,只能重新闭口。 |
| 旧 seed/replay/recalculate/export snapshot/drift job | 不进入 job 候选池。当前 job 只按 `R1.32` 维护收敛入口。 |
| 旧 P0/P1 plugin / configuration protocol | 不作为当前分层或 scope 来源。外围只用 package / method set / marketplace context boundary。 |

### 7. `R8.6` 写入边界

| `R8.6` 允许写入 | `R8.6` 禁止写入 |
|---|---|
| 输入来源裁决和三方来源检查表。 | 具体 DTO 字段 schema。 |
| 按 Command / Query / Inbound / Outbound / Job / shared shell 的 capability 池。 | HTTP route、RPC name、event topic、job trigger。 |
| 候选协议来源矩阵和旧材料污染过滤记录。 | Rust struct / enum、JSON schema、错误码正文。 |
| `R8.7` shared protocol helper 进入门禁。 | function flow、状态矩阵、persistence schema、config key、test case schema。 |
| 仍只写中间产物。 | 正式 `03-详细设计.md` 或 Step 9 正文。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否完成输入来源裁决 | 是。 |
| 是否形成三方来源检查 | 是。 |
| 是否形成协议发现轴 | 是。 |
| 是否形成候选 capability 池思考 | 是。 |
| 是否形成旧材料污染过滤 | 是。 |
| 是否形成 `R8.6` 写入边界 | 是。 |
| 是否写具体 DTO schema / route / topic / job trigger | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.6`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.6 Step 7 承接与协议发现轴:再写入`;只允许写入输入来源裁决、三方来源检查表、按 Command / Query / Inbound / Outbound / Job / shared shell 的 capability 池、候选协议来源矩阵、旧材料污染过滤记录和 `R8.7` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.7`、Step 9 或后续 Step。

---

## R8.6 Step 7 承接与协议发现轴:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.6 Step 7 承接与协议发现轴:再写入`。 |
| 本模块目标 | 固化协议候选的输入来源裁决、三方来源检查、capability 池、来源矩阵、旧材料过滤和 `R8.7` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | 输入来源裁决、三方来源检查表、协议 capability 池、候选协议来源矩阵、旧材料污染过滤记录和 `R8.7` 进入门禁。 |
| 禁止范围 | 不修改正式 `03-详细设计.md`;不写 L3 具体 DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence schema、config key 或 test case schema。 |

### 2. 输入来源裁决

| 来源层 | 当前有效输入 | Step 8 使用方式 | 禁止用法 |
|---|---|---|---|
| HLD interface skeleton | `R1.24` Command、`R1.26` Query、`R1.28` Inbound、`R1.30` Outbound、`R1.32` Operations Job、`R1.34` owner 映射、`R1.38` 跨接口审计。 | 提供候选协议名、类别、owner、输入 / 输出骨架和边界红线。 | 直接复制为 DTO schema、route、topic、job trigger。 |
| Step 6 object contracts | contracts shared refs / markers / public shell、domain truth / material / view / summary、application helper、entry local result state。 | 提供 public 类型、字段来源候选、result / decision / marker / report shell 来源。 | 用 domain-only truth body 进入 public DTO;用 shell ref 替代正式 schema。 |
| Step 7 port contracts | application port family、repository / resolver / mapper / builder / publisher / handoff / job / runtime family、entry restriction。 | 提供读取、保存、解析、映射、发布、handoff、stored result、page、runtime availability 来源。 | 绕过 application facade;从 concrete adapter / route / topic / raw body 补口。 |
| 旧材料 | 旧 `MethodContent`、publish、snapshot、fingerprint、outbox、P0/P1。 | 只作污染审计。 | 作为正向协议来源。 |

### 3. 三方来源检查表

| 检查项 | 必须满足 | 失败标记 | 停审动作 |
|---|---|---|---|
| HLD 来源 | 候选能回指 `R1.24/26/28/30/32` 或 `R1.34` owner 映射。 | `candidate_missing_hld_source` | 不写协议 schema,回到 HLD / Step 7 接口骨架闭口。 |
| Step 6 对象来源 | 输入 / 输出能回指 typed ref、public shell、truth object、view、summary、material、task、entry result state。 | `candidate_missing_object_source` | 不写字段,回到 Step 6 对象或 public shell 闭口。 |
| Step 7 port 来源 | 所需 read / write / resolve / map / publish / handoff / job / stored result / page 来源能回指 port family。 | `candidate_missing_port_source` | 不写协议 schema,回到 Step 7 port family 闭口。 |
| 旧污染过滤 | 不依赖旧 `MethodContent`、publish、snapshot、fingerprint、old outbox、P0/P1 plugin / config。 | `historical_pollution` | 从候选池剔除或重命名到当前对象语义。 |
| Step 边界 | 只定义 protocol contract 与 handoff,不要求提前写 flow / state / persistence / config / test。 | `step_boundary_violation` | 移到后续 Step 或暂停。 |

### 4. 协议 capability 池

| Capability 池 | HLD 来源 | Step 6 对象 / shell 来源 | Step 7 port 来源 | 后续模块 |
|---|---|---|---|---|
| Shared protocol helper | 五类接口共用 actor、metadata、idempotency、result、page、safe outcome。 | `MethodLibraryTypedBoundaryRef`;`MethodLibrarySafeMarker`;`MethodLibraryPublicShell`;`MethodAssetOperationContext`;`MethodAssetStoredOperationResult`。 | UnitOfWork、Clock、IdGenerator、page / version helper、stored result / replay helper、entry restriction。 | `R8.7 / R8.8` |
| Command protocol family | `R1.24` Command 总表,58 个写入口。 | core truth、support truth、peripheral truth、operation context、idempotency guard、stored operation result、api command entry。 | truth repository、support repository、policy diagnostic、UnitOfWork、IdGenerator、stored result。 | `R8.9 / R8.10` |
| Query protocol family | `R1.26` Query 总表,57 个只读入口。 | public view shell、read decision、degraded decision、availability / freshness marker、maintenance progress view。 | repository page、read resolver、availability resolver、degraded mapper、page helper、runtime availability。 | `R8.11 / R8.12` |
| Inbound consumer protocol family | `R1.28` Inbound 总表,4 个 body-free consumer。 | inbound intake decision、external source summary、artifact / archive ref、worker entry result state。 | inbound source port、external body-free source adapter、stored result / idempotency、runtime assembly。 | `R8.13 / R8.14` |
| Outbound event protocol family | `R1.30` Outbound 总表,34 个 fact / material / peripheral changed event。 | event candidate assembly、public event shell、safe marker、worker publisher entry。 | event candidate publisher、target registry、publication safe outcome、adapter availability。 | `R8.15 / R8.16` |
| Operations job protocol family | `R1.32` Operations Job 总表,8 个维护收敛 job。 | job assembly context、maintenance task/progress/history、job progress assembly state、job result state。 | maintenance repository、progress view repository、checkpoint store、refresh target planner、adapter availability。 | `R8.17 / R8.18` |

### 5. 候选协议来源矩阵

| 协议族 | 候选规模 | 当前进入方式 | R8 后续写入粒度 |
|---|---:|---|---|
| Command | 58 | 全量进入 candidate pool,后续按八组成部分或 capability 切片展开。 | 不一次性写 58 个字段 schema;先 shared result / envelope,再分组。 |
| Query | 57 | 全量进入 candidate pool,后续按读取面分组。 | 先统一 read surface / page / view shell,再分组。 |
| Inbound Consumer | 4 | 全量进入 candidate pool。 | 数量可控,但仍先 envelope / receipt,再 typed payload。 |
| Outbound Event | 34 | 全量进入 candidate pool,按 event family 摘要展开。 | 先 outbound envelope / version / publication outcome,再 payload boundary。 |
| Operations Job | 8 | 全量进入 candidate pool。 | 先 job metadata / report / replay,再 job input/output。 |
| Shared helper | cross-family | 由五类协议共同需求推导,先于所有具体协议族。 | 下一模块 `R8.7 / R8.8` 先闭口。 |

### 6. 旧材料污染过滤记录

| 污染项 | 当前处理 |
|---|---|
| 旧 `CreateMethodContentDraft` / `PublishMethodContent` 等 lifecycle command | 剔除;不得作为 Command protocol source。 |
| 旧 `GetMethodContent` / `ExportDefinitionSnapshot` / `CompareFingerprint` | 剔除;不得作为 Query protocol source。 |
| 旧 governance gate consumer | 剔除;不得作为 Inbound source。 |
| 旧 `method_library.content.published` topic / fingerprint changed event / old outbox event | 剔除;不得作为 Outbound protocol source。 |
| 旧 seed / replay outbox / rebuild index / recalculate fingerprint / export snapshot / drift job | 剔除;不得作为 Operations Job source。 |
| 旧 P0/P1 plugin / configuration | 剔除为 scope 来源;外围能力只从 package / method set / marketplace context boundary 推导。 |

### 7. `R8.7` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.7 shared protocol helper:先思考`,思考 metadata、actor/source、idempotency、operation result、page、error/degraded/public marker shell。 |
| 当前禁止 | 不写具体 Command / Query / Event / Job DTO 字段 schema;不写 HTTP route、RPC name、event topic、job trigger;不写 function flow、状态矩阵、persistence、config、test。 |
| 必须使用 | `R8.6` capability 池和三方来源检查,以及 `R8.4` public secondary type / page / receipt / report / stop-review 模板。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入输入来源裁决 | 是。 |
| 是否写入三方来源检查表 | 是。 |
| 是否写入协议 capability 池 | 是。 |
| 是否写入候选协议来源矩阵 | 是。 |
| 是否写入旧材料污染过滤记录 | 是。 |
| 是否形成 `R8.7` 进入门禁 | 是。 |
| 是否写具体 DTO 字段 schema / route / topic / job trigger | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.7`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.7 shared protocol helper:先思考`;只允许思考 metadata、actor/source、idempotency、operation result、page、error/degraded/public marker shell 的 shared protocol helper 边界;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Command / Query / Event / Job DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.8`、Step 9 或后续 Step。

## R8.7 shared protocol helper:先思考

### 1. 思考边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.7 shared protocol helper:先思考`。 |
| 本模块目标 | 只思考五类协议共用的 metadata、actor/source、idempotency、operation result、page、error/degraded/public marker shell 的来源、归属和暂停条件。 |
| 当前状态 | completed |
| 当前产物 | shared helper 来源裁决、helper 族候选、跨协议复用规则、禁止下沉项、停审条件和 `R8.8` 写入边界。 |
| 禁止范围 | 不写具体 Command / Query / Event / Job DTO 字段 schema;不写 HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |

### 2. shared helper 输入闭环

| 来源 | 可进入 shared helper 的信息 | 当前裁决 |
|---|---|---|
| HLD 五类接口骨架 | Command 的 actor / metadata / idempotency;Query 的 actor / query metadata / scope / subject / page;Inbound 的 source envelope / source event id / schema version / dedup;Outbound 的 typed ref / marker / trace context;Job 的 maintenance run / refresh scope / task context。 | 作为协议 shared helper 的需求来源,不直接复制为字段 schema。 |
| Step 6 contracts shell | `MethodLibraryTypedBoundaryRef`;`MethodLibrarySafeMarker`;`MethodLibraryPublicShell`。 | 作为 public ref、safe marker、protocol wrapper 的唯一 contracts 来源。 |
| Step 6 application helper | `MethodAssetOperationContext`;`MethodAssetIdempotencyGuard`;`MethodAssetStoredOperationResult`;`MethodAssetReadDecision`;`MethodAssetDegradedDecision`;inbound / event / job assembly helper。 | 作为 operation、replay、read、degraded、intake、event candidate、job assembly 的 application 来源。 |
| Step 7 helper / port family | UnitOfWork、Clock、IdGenerator、page / version helper、stored result / replay helper、checkpoint / progress helper、entry restriction。 | 作为实现接缝来源;Step 8 只能引用其 public shell 语义,不能定义 port 方法或 durable schema。 |

### 3. shared helper 族候选

| helper 族 | 解决的问题 | 来源对象 / port | 进入 R8.8 的写入方式 |
|---|---|---|---|
| protocol metadata shell | 五类协议都需要安全 metadata、correlation、schema / version hint 和 request boundary。 | `MethodAssetOperationContext`;HLD Command / Query / Inbound / Job metadata;Clock / IdGenerator。 | 写成 shared metadata 类别和来源规则,不固定 transport 字段名。 |
| actor / source shell | Command / Query 需要 actor,Inbound / Job 需要 source,Outbound 需要 fact source 和 trace context。 | `ActorContextRef`;operation source kind;source summary ref;request boundary ref。 | 写 actor/source 复用规则和 entry 注入边界。 |
| idempotency shell | Command、Inbound、Job 需要 dedup / replay;Query 默认不写结果,不强制幂等写面。 | `MethodAssetIdempotencyGuard`;stored result / replay helper。 | 写适用族和禁用族;不定义具体 key 生成算法。 |
| operation result shell | accepted / rejected / ignored / conflict 需要可重放 safe summary。 | `MethodAssetStoredOperationResult`;safe reason refs;effect summary refs。 | 写 result kind、safe summary、replay marker 的壳边界。 |
| read page / cursor shell | Query、trace / relation / maintenance page、job progress 需要 opaque page 与 ordering。 | page / version helper;`MethodAssetReadDecision`;maintenance progress helper。 | 写 page request / page result 的共性规则,禁止解析 cursor。 |
| public marker shell | no-body、freshness、availability、boundary、lineage、visibility / material marker 必须可安全公开。 | `MethodLibrarySafeMarker`;read / degraded decision;resolver / mapper summary。 | 写 marker 复制规则,禁止 service 合成 marker。 |
| rejection / degraded shell | rejected、not visible、unavailable、partial、stale、invalid safe material 需要统一 safe reason。 | `MethodAssetDegradedDecision`;safe diagnostic ref;unavailable reason ref。 | 写 error / degraded 的 shared public 壳,错误码和值域留 Step 12。 |
| receipt / report shell | Inbound、Outbound、Job 需要 receipt、publication outcome、progress report 的共性 body-free 壳。 | inbound intake decision;event candidate assembly;job assembly context;checkpoint / progress helper。 | 写 receipt / report 的 shared boundary,不写 topic、payload、scheduler 或 delivery state。 |

### 4. 跨协议复用规则

| 规则 | 说明 |
|---|---|
| shared helper 先于具体协议族 | 后续 Command、Query、Inbound、Outbound、Job 只引用 shared helper,避免每类协议重复定义 metadata、page、result、marker。 |
| public shell 只能复制正式来源 | typed ref、safe marker、visibility、freshness、degraded、unavailable、effect summary 必须来自 Step 6 / Step 7 正式对象或 mapper / resolver / store summary。 |
| entry context 不进入 domain | api / worker / jobs 只能把已验证 context 转成 application operation context;不能把 raw header、broker envelope、cron、queue 或 config 传入 domain。 |
| stored result 不保存 DTO body | duplicate replay 只能复制 safe summary / marker / typed ref;不得保存完整 public DTO、raw error 或 event payload。 |
| page cursor 不替代 version | page cursor、job checkpoint、resume token 与 optimistic version 是不同 helper;不得混用。 |
| Query helper 保持 no-write | Query 可以返回 found / absent / not visible / stale / degraded / unavailable,但不得刷新 material、修 truth 或启动 job。 |

### 5. 禁止下沉项

| 禁止项 | 原因 |
|---|---|
| HTTP route、RPC method、topic、scheduler trigger | 属于 transport / runtime / product 绑定,不属于 shared protocol helper。 |
| Rust struct / enum、JSON schema、字段全集 | 当前是思考模块,`R8.8` 也只写 protocol shared shell,不落实现代码。 |
| Command / Query / Event / Job 具体 DTO 字段 | 后续协议族模块逐类展开,不得在 shared helper 中抢先写完。 |
| error code body、HTTP status 映射 | Step 12 错误模型再闭口。 |
| function flow、state matrix、persistence schema、config key、test case | 分别属于 Step 9~16。 |
| 从旧 MethodContent / publish / snapshot / fingerprint / outbox 推导 helper | 旧材料只作污染审计,不作当前来源。 |

### 6. 停审条件

| 缺口 | 停审动作 |
|---|---|
| actor/source/context 只能从 raw header、raw broker envelope、cron 或 env 推导 | 暂停,回 Step 6 / Step 7 补正式 context / runtime summary 来源。 |
| idempotency key、operation digest 或 dedup scope 缺正式 typed 来源 | 暂停,不得由实现端拼 key。 |
| accepted / rejected / ignored / conflict result 无 stored result / safe summary 来源 | 暂停,不得保存完整 DTO body 替代。 |
| page cursor、version、checkpoint、resume anchor 来源混淆 | 暂停,回 Step 7 / Step 11 闭口 helper 语义。 |
| degraded / unavailable / public marker 缺正式 mapper / resolver / material 来源 | 暂停,不得合成 marker、reason 或 diagnostic。 |
| outbound receipt / publication outcome 需要 topic / delivery / outbox state 才能说明 | 暂停,先保持 event candidate shell,后续 delivery 机制另行闭口。 |

### 7. `R8.8` 写入边界

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.8 shared protocol helper:再写入`,写入 shared metadata、actor/source、idempotency、operation result、page、public marker、rejection/degraded、receipt/report shell 的来源规则和复用边界。 |
| 当前禁止 | 不写具体 Command / Query / Inbound / Outbound / Job DTO 字段 schema;不写 route、topic、trigger、Rust struct / enum、JSON schema、function flow、状态矩阵、persistence、config、test。 |
| 必须使用 | 本模块 shared helper 族候选、R8.6 capability 池、Step 6 public shell / application helper、Step 7 helper / entry restriction。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只思考 shared helper | 是。 |
| 是否覆盖 metadata / actor/source / idempotency / result / page / public marker / degraded | 是。 |
| 是否回指 Step 6 / Step 7 / HLD 来源 | 是。 |
| 是否写具体协议 DTO 字段 schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.8`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.8 shared protocol helper:再写入`;只允许写入 shared metadata、actor/source、idempotency、operation result、page、public marker、rejection/degraded、receipt/report shell 的来源规则、复用边界、停审条件和 `R8.9` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Command / Query / Inbound / Outbound / Job DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.9`、Step 9 或后续 Step。

## R8.8 shared protocol helper:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.8 shared protocol helper:再写入`。 |
| 本模块目标 | 固化 shared metadata、actor/source、idempotency、operation result、page、public marker、rejection/degraded、receipt/report shell 的来源规则、复用边界、停审条件和 `R8.9` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | shared protocol helper 承接表、协议族适用矩阵、来源复制规则、命名边界、停审条件和 Command family 进入门禁。 |
| 禁止范围 | 不修改正式 `03-详细设计.md`;不写具体 Command / Query / Inbound / Outbound / Job DTO 字段 schema、route、RPC、topic、trigger、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |

### 2. shared helper 承接表

| shared helper | 统一责任 | 正式来源 | 后续协议族使用方式 |
|---|---|---|---|
| protocol metadata shell | 表达 body-free metadata、schema/version hint、correlation 和 request boundary。 | HLD 五类接口共性输入;Step 6 `commit-02-a` metadata foundation normalization;`MethodAssetOperationContext`;Clock / IdGenerator helper。 | Command / Query / Inbound / Job request shell 复制;Outbound event 只复制 fact source 和 trace context。 |
| actor / source shell | 区分 actor-driven、source-driven、job-driven 和 fact-driven 协议来源。 | `core-contracts::actor::ActorContext`;operation source kind;source summary ref;request boundary ref;entry restriction。 | Command / Query 使用 actor;Inbound 使用 source;Job 使用 run/task source;Outbound 使用事实来源。 |
| idempotency shell | 承载 dedup、operation digest、stored result replay 和 conflict 判断边界。 | `MethodAssetIdempotencyGuard`;stored result / replay helper。 | Command / Inbound / Job 必须判断;Query 默认 no-write 不强制;Outbound 不自行 dedup。 |
| operation result shell | 表达 accepted、rejected、ignored、conflict、duplicate replay 的安全结果壳。 | `MethodAssetStoredOperationResult`;safe reason refs;effect summary refs;replay marker。 | Command / Inbound / Job response 或 receipt 复用;Query 仅使用 read surface。 |
| page / cursor shell | 表达 opaque page request、page result、ordering、cursor 和 version 分离。 | page / version helper;`MethodAssetReadDecision`;maintenance progress helper。 | Query / trace / relation / progress / job report 使用;不得替代 optimistic version。 |
| public marker shell | 表达 no-body、freshness、availability、boundary、lineage、visibility、material marker。 | `MethodLibrarySafeMarker`;resolver / mapper / material summary;read / degraded decision。 | 所有 public surface 只能复制正式 marker,不得由 service 合成。 |
| rejection / degraded shell | 表达 rejected、not visible、unavailable、partial、stale、invalid safe material 的公共安全壳。 | Step 6 `commit-02-a` safe error foundation normalization;`MethodAssetDegradedDecision`;safe diagnostic ref;unavailable reason ref;partiality marker。 | Query degraded、Command rejection、Inbound quarantine、Job partial/blocked 均复用。 |
| receipt / report shell | 表达 inbound receipt、publication candidate outcome、job progress/report 的 body-free 壳。 | inbound intake decision;event candidate assembly;job assembly context;checkpoint / progress helper。 | Inbound / Outbound / Job 使用;不携带 topic、payload body、scheduler、queue 或 delivery state。 |

### 2A. `commit-02-a` implementation-facing shared foundation closure

`commit-02-a` 只实现 shared protocol helper 的 public contract foundation,不得越过本模块去抢写 family-specific DTO schema。当前 boundary 的 implementation-facing closure 明确如下:

| item | current concrete closure | `commit-02-a` implementation rule |
|---|---|---|
| actor foundation | `core-contracts::actor::{ActorContext, ActorRef, ActorKind, RequestOrigin}` | `crates/contracts/src/metadata.rs` 直接 re-export;不得新增本仓 local `*ActorContextRef` wrapper。 |
| request / command / query metadata foundation | `core-contracts::metadata::{RequestMetadata, CommandMetadata, QueryMetadata, PageRequest, PageToken, RequestId, TraceId, IdempotencyKey, Timestamp, QueryConsistency, ChangeReason}` | `crates/contracts/src/metadata.rs` 直接 re-export;不得新增本仓 local `*MetadataRef` / `*TraceContextRef` / `*IdempotencyContextRef`。 |
| safe error foundation | `core-contracts::errors::{ErrorCode, ErrorDetail, ErrorResponse}` | `crates/contracts/src/errors.rs` 直接 re-export;L3-specific rejection / degraded code family后移 Step 12。 |
| concrete shared shell set | `MethodLibraryCapabilityKind`;`MethodLibraryOperationsJobKind`;`MethodLibraryCommandShell`;`MethodLibraryQueryShell`;`MethodLibraryEventShell`;`MethodLibraryJobShell`;`MethodLibraryViewShell` | 这是当前 boundary 唯一允许落码的 shared protocol shell set;字段以 Step 6 `6B` 为准,不得补 request intent、selector、payload、receipt/report detail。 |
| legacy placeholder normalization | `ActorContextRef`;`MethodAssetActorContextRef`;`CommandMetadataRef`;`MethodAssetRequestMetadataRef`;`MethodAssetTraceContextRef`;`MethodAssetIdempotencyContextRef` | 在 `commit-02-a` 一律视为“contracts-provided body-free metadata/context carrier”的占位名;当前落码只能用上表 foundation 或延后到 family-specific Step 8 / Step 12 闭口。 |

### 3. 协议族适用矩阵

| 协议族 | metadata | actor/source | idempotency | result / receipt | page / report | marker / degraded |
|---|---|---|---|---|---|---|
| Command | 必须有 command metadata / correlation。 | actor-driven。 | 必须有 idempotency / duplicate / conflict 壳。 | accepted / rejected / duplicate replay result。 | 不使用 page。 | rejection 使用 safe reason / marker。 |
| Query | 必须有 query metadata / read context。 | actor 或 read context driven。 | 默认不使用写面幂等。 | read result / empty / unavailable surface。 | 必须复用 page / cursor shell。 | not visible / stale / degraded 必须复制正式 marker。 |
| Inbound consumer | 必须有 source envelope summary / schema version hint。 | source-driven。 | 必须有 source event dedup。 | accepted / ignored / rejected / quarantine receipt。 | 不使用 page。 | delayed / invalid / unavailable 使用 safe marker。 |
| Outbound event | 必须有 fact source / event schema hint。 | fact-driven。 | 不自行定义 dedup;由 publisher / handoff 后续处理。 | event candidate / publication outcome shell。 | 不使用 page。 | payload 只携带 safe marker / typed ref / summary ref。 |
| Operations job | 必须有 run / task / checkpoint metadata。 | job-driven。 | 必须有 task / checkpoint dedup。 | job accepted / duplicate / failed / blocked result。 | progress / report / checkpoint shell。 | partial / unavailable / intervention required 使用 degraded shell。 |

### 4. 来源复制规则

| 规则 | 写入口径 |
|---|---|
| typed ref 复制 | public protocol 只能复制 `MethodLibraryTypedBoundaryRef` 家族或 Step 6 已定义 typed ref,不得解析字符串或 route param。 |
| marker 复制 | no-body、freshness、availability、boundary、lineage、visibility、degraded marker 只能来自 policy、resolver、material、adapter summary 或 application decision。 |
| context 复制 | entry 只注入已验证 actor/source/job context;protocol helper 不读取 raw header、broker envelope、cron、queue、env 或 config。 |
| result 复制 | duplicate replay 只能复制 stored safe summary、safe reason、effect summary 和 replay marker;不得保存或回放完整 DTO body。 |
| page 复制 | cursor 是 opaque continuation;version 来自 versioned read;checkpoint 来自 job helper;三者不得互相替代。 |
| diagnostic 复制 | safe diagnostic 必须是 body-free ref;不得把 stack trace、provider error body、raw log、secret 或 payload 放入 public shell。 |

### 5. 命名与下沉边界

| 边界 | 当前裁决 |
|---|---|
| shared helper 命名 | 只固定 helper family 与 shell 责任,不固定最终 Rust struct / enum 或 JSON 字段名。 |
| protocol family 命名 | 具体 Command / Query / Inbound / Outbound / Job 名称从 HLD `R1.24`~`R1.32` 承接,后续模块逐族处理。 |
| transport 绑定 | HTTP route、RPC method、event topic、scheduler trigger、queue、relay、outbox 和 delivery state 均不在本模块定义。 |
| 错误模型 | rejection / degraded 只固定 safe shell 来源;错误码、HTTP status、retry 分类和恢复口径留 Step 12。 |
| flow / state / persistence | 本模块只给 Step 9~13 handoff 规则,不写处理流、状态迁移、事务、schema 或并发算法。 |

### 6. 停审条件

| 缺口 | 停审动作 |
|---|---|
| helper 字段只能从 raw transport、raw payload、topic、route、cron、env 或 private map 推导 | 暂停,不得写协议 schema。 |
| actor/source/idempotency/result/page/marker 缺 Step 6 对象或 Step 7 helper 来源 | 暂停,回对应 Step 闭口。 |
| query degraded / not visible / stale 需要 service 合成 marker | 暂停,不得进入 Query protocol family 写字段。 |
| command duplicate replay 需要重跑 mutation 或重读 truth 重建 response | 暂停,不得写 Command result schema。 |
| inbound / outbound receipt 依赖未闭口 topic、outbox、delivery state 或 retry product | 暂停,只保留 candidate shell。 |
| job report 需要 scheduler / queue / lease / raw report body 才能表达 | 暂停,回 runtime / job helper 闭口。 |

### 7. `R8.9` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.9 Command protocol family:先思考`,思考 command envelope、request/result shell、accepted/rejected/duplicate/effect summary 的来源、分组和停审条件。 |
| 当前禁止 | 不写 Command DTO 字段 schema、Rust struct / enum、JSON schema、route、RPC、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |
| 必须使用 | R8.6 Command capability 池、R8.8 shared helper、HLD `R1.24` Command 总表、Step 6 command 相关对象、Step 7 truth/support repository、UnitOfWork、IdGenerator、stored result / replay helper。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 shared helper 承接表 | 是。 |
| 是否写入协议族适用矩阵 | 是。 |
| 是否写入来源复制规则 | 是。 |
| 是否写入命名与下沉边界 | 是。 |
| 是否写入停审条件 | 是。 |
| 是否形成 `R8.9` 进入门禁 | 是。 |
| 是否写具体协议 DTO 字段 schema / route / topic / trigger | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.9`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.9 Command protocol family:先思考`;只允许思考 command envelope、request/result shell、accepted/rejected/duplicate result、effect summary 的来源、分组、shared helper 复用和停审条件;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Command DTO 字段 schema、HTTP route、RPC name、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.10`、Step 9 或后续 Step。

## R8.9 Command protocol family:先思考

### 1. 思考边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.9 Command protocol family:先思考`。 |
| 本模块目标 | 只思考 Command 协议族的 envelope、request/result shell、accepted/rejected/duplicate result、effect summary 的来源、分组、shared helper 复用和停审条件。 |
| 当前状态 | completed |
| 当前产物 | Command 输入来源裁决、八组成部分分组、command shell 族候选、result/effect 复用规则、旧污染过滤和 `R8.10` 写入边界。 |
| 禁止范围 | 不写具体 Command DTO 字段 schema;不写 HTTP route、RPC name、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |

### 2. Command 输入来源裁决

| 来源 | 可进入 Command 协议族的内容 | 当前裁决 |
|---|---|---|
| HLD `R1.24` Command 总表 | 58 个 Command 名称、八组成部分归属、输入/输出骨架、写入对象/意图和边界。 | 作为 Command 协议族唯一候选列表来源;不得新增、改名或从旧 API 恢复。 |
| `R8.8` shared helper | metadata、actor/source、idempotency、operation result、public marker、rejection/degraded、receipt/report shell。 | Command 必须复用 shared helper,不得每个 Command 私有定义 metadata/result/rejection。 |
| Step 6 object contracts | domain truth、support summary/material、policy/guard decision、operation context、idempotency guard、stored result、api command entry、response assembly state。 | 作为 Command request intent、result summary、safe reason、effect summary 的对象来源。 |
| Step 7 port contracts | UnitOfWork、IdGenerator、stored result/replay、truth/support repository、policy diagnostic builder、entry restriction、publisher/handoff family。 | 作为 command accepted/rejected/duplicate/effect 的可落码来源;不在 Step 8 写 port 方法。 |

### 3. Command 分组与规模

| 组成部分 | Command 数量 | 协议思考重点 | 禁止混入 |
|---|---:|---|---|
| 方法资产定义与目录 | 6 | definition / catalog truth 写入、退役、重分类的 accepted summary 与 history ref。 | 旧 draft content、搜索索引、UI 分类、catalog view repair。 |
| 正式化与版本 | 6 | eligibility、formalization、formal version、semantic change、supersession、retirement 的 result shell。 | 治理审批正文、snapshot/fingerprint 版本语义、cache hit 触发。 |
| 受控消费 | 5 | consumption boundary、material preparation、state marker、boundary violation 的 safe result。 | 鉴权实现、下游运行 truth、material refresh job。 |
| 追溯与一致性保护 | 7 | trace/impact/protection/audit/lineage 的 body-free accepted summary。 | raw log、trace span、event payload、report/evidence body。 |
| 关系与分发语义 | 10 | relation、integrity、distribution ref/context/availability 的 accepted/rejected surface。 | marketplace 交易、推荐/搜索图、下游授权扩大。 |
| 外部摘要与引用 | 9 | external summary/ref/archive/body boundary/basis/lineage 的 no-body shell。 | 外部正文、artifact 包体、provider payload、URL/path 拼 ref。 |
| 后台维护与收敛 | 6 | maintenance request、suspend、intervention、supersede 的 command result;执行留给 Job。 | 在 Command 中执行 refresh/recovery job 或修 core truth。 |
| 外围包与方法集组织 | 9 | package / assembly truth、composition evaluation、stale/unavailable 的 peripheral result。 | marketplace listing、安装履约、组织运行配置、SDK profile。 |

### 4. Command shell 族候选

| shell 族 | 责任 | 来源 | R8.10 写入方式 |
|---|---|---|---|
| command envelope | 承载 command family、metadata、actor、idempotency 和 body-free request boundary。 | `R8.8` metadata / actor / idempotency shell;`MethodAssetApiCommandHandlerEntry`。 | 写统一 envelope 类别,不写字段全集。 |
| command request intent shell | 表达目标对象、意图 summary、safe reason、basis/ref 集合的 body-free 输入类别。 | `R1.24` 输入骨架;Step 6 typed refs / summary refs / marker refs。 | 按八组成部分描述 intent 类别,不展开每个 DTO 字段。 |
| command accepted result shell | 表达 accepted summary、created/updated object refs、history/lineage/effect refs。 | `MethodAssetStoredOperationResult`;domain/support accepted summary。 | 写 result category 与来源表。 |
| command rejected result shell | 表达 safe reject reason、boundary marker、diagnostic 和 no-write outcome。 | `MethodAssetDegradedDecision`;policy/guard diagnostic;safe reason refs。 | 写 rejection 来源规则,错误码留 Step 12。 |
| duplicate replay shell | 表达 duplicate replay、conflict 和 ignored/conflict safe surface。 | `MethodAssetIdempotencyGuard`;stored result/replay helper。 | 写 replay 只能复制 stored safe summary。 |
| effect summary shell | 表达 history、lineage、event candidate、maintenance hint、audit safe refs。 | `MethodAssetStoredOperationResult.effect_summary_refs`;event candidate assembly;history/lineage refs。 | 写 effect 类别,不写 event payload 或 topic。 |

### 5. shared helper 复用规则

| helper | Command 使用规则 |
|---|---|
| metadata / actor | 所有 Command 必须是 actor-driven,actor 和 metadata 由 entry 注入,不得从 raw header、route 或 token 拼接。 |
| idempotency | 所有 Command 必须有 idempotency / digest / dedup scope 判断;duplicate 必须走 stored result replay。 |
| operation result | accepted / rejected / ignored / conflict 都必须进入 stored safe result shell,不得保存完整 DTO body 或 raw error。 |
| public marker | boundary、availability、no-body、degraded、safe reason marker 只能复制正式 policy / resolver / material / decision 输出。 |
| effect summary | Command effect 只能是 body-free refs / summaries;publisher topic、outbox row、delivery state 不属于 Command result。 |
| entry restriction | api handler 只转交 application command facade;不得直接调用 repository、UnitOfWork、domain transition 或 infra adapter。 |

### 6. Command protocol 停审条件

| 缺口 | 停审动作 |
|---|---|
| Command 名称、归属或边界无法回指 `R1.24` | 暂停,不得新增 Command。 |
| request intent 需要 raw body、external body、artifact body、URL/path/free-form string 才能表达 | 暂停,回对象/外部摘要边界闭口。 |
| accepted result 无 Step 6 object / summary / history / lineage ref 来源 | 暂停,不得写 result shell。 |
| rejection 需要 service 合成 reason、marker、diagnostic 或错误码 | 暂停,回 policy/mapper/error model 闭口。 |
| duplicate replay 需要重跑 mutation 或重读 truth 重建 response | 暂停,回 stored result/replay 设计闭口。 |
| effect summary 需要 topic、outbox、delivery receipt 或 raw event payload | 暂停,后移 Outbound Event / publisher family。 |
| maintenance Command 试图执行 job 或修 core truth | 暂停,转入 Operations Job family 或 Step 9 flow 审计。 |

### 7. `R8.10` 写入边界

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.10 Command protocol family:再写入`,写入 Command 输入来源裁决、八组成部分分组、shell 族候选、shared helper 复用规则、停审条件和 `R8.11` 进入门禁。 |
| 当前禁止 | 不写具体 Command DTO 字段 schema、Rust struct / enum、JSON schema、route、RPC、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |
| 必须使用 | `R1.24` Command 总表、R8.8 shared helper、Step 6 command 相关对象、Step 7 helper/repository/stored result/entry restriction family。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只思考 Command protocol family | 是。 |
| 是否以 `R1.24` 58 个 Command 为唯一候选来源 | 是。 |
| 是否形成八组成部分分组 | 是。 |
| 是否形成 shared helper 复用规则 | 是。 |
| 是否形成停审条件 | 是。 |
| 是否写具体 Command DTO 字段 schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.10`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.10 Command protocol family:再写入`;只允许写入 Command 输入来源裁决、八组成部分分组、command envelope / request intent / accepted / rejected / duplicate / effect shell 族候选、shared helper 复用规则、停审条件和 `R8.11` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Command DTO 字段 schema、HTTP route、RPC name、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.11`、Step 9 或后续 Step。

## R8.10 Command protocol family:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.10 Command protocol family:再写入`。 |
| 本模块目标 | 固化 Command 输入来源裁决、八组成部分分组、command envelope / request intent / accepted / rejected / duplicate / effect shell 族候选、shared helper 复用规则、停审条件和 `R8.11` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | Command protocol family 来源表、分组矩阵、shell family 表、result / effect 来源规则、禁入清单、停审条件和 Query family 进入门禁。 |
| 禁止范围 | 不修改正式 `03-详细设计.md`;不写具体 Command DTO 字段 schema、HTTP route、RPC name、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |

### 2. Command protocol family 来源表

| 来源层 | 正式输入 | 本模块使用方式 | 禁止用法 |
|---|---|---|---|
| HLD interface | `R1.24` Command 总表,58 个 Command,八组成部分分组。 | 固定 Command 候选集合、名称、归属、输入/输出骨架和边界。 | 新增 Command、改名、从旧 publish / draft API 恢复旧入口。 |
| shared helper | `R8.8` metadata、actor/source、idempotency、operation result、marker、rejection/degraded、receipt/report shell。 | 统一 Command envelope、result、duplicate replay 和 rejection 壳。 | 每个 Command 私有定义 metadata、result、error 或 replay 结构。 |
| Step 6 objects | domain truth、support summary、policy / guard decision、operation context、idempotency guard、stored result、api entry / response assembly。 | 提供 request intent、accepted summary、safe reason、effect refs 的对象来源。 | 暴露 domain truth body、helper 内部字段、entry local state 或 raw payload。 |
| Step 7 ports | UnitOfWork、IdGenerator、stored result/replay、truth/support repository、policy diagnostic builder、entry restriction。 | 提供 command 可落码来源、duplicate replay source 和 facade-only entry 边界。 | 在 Step 8 写 port 方法、事务顺序、repository 调用链或 durable schema。 |

### 3. Command 分组矩阵

| 组成部分 | 数量 | request intent 类别 | accepted result 类别 | 主要暂停条件 |
|---|---:|---|---|---|
| 方法资产定义与目录 | 6 | definition identity / adjustment / retirement;catalog scope / applicability。 | definition ref、catalog entry ref、history / accepted summary。 | request 需要旧 content payload、catalog view repair 或 UI/search 分类。 |
| 正式化与版本 | 6 | eligibility / formalization / formal version / semantic change / supersession / retirement。 | formalization state ref、formal version ref、history / rejection reason。 | 用 governance body、snapshot、fingerprint、cache hit 或下游状态表达版本语义。 |
| 受控消费 | 5 | consumption context / boundary / material / state marker / violation。 | boundary ref、consumption material ref、availability hint、trace subject ref。 | request 需要鉴权实现、下游运行 truth 或现场 refresh material。 |
| 追溯与一致性保护 | 7 | trace subject / impact / protection / audit scope / lineage refs。 | trace material ref、impact summary ref、protection summary、audit / lineage refs。 | 需要 raw log、trace span、event payload、evidence/report body。 |
| 关系与分发语义 | 10 | relation endpoints / integrity rule / distribution context / availability marker。 | relation ref、integrity diagnostic、distribution ref、availability summary。 | 需要 marketplace 交易、推荐图、搜索排序或下游授权扩大。 |
| 外部摘要与引用 | 9 | external source / archive / body boundary / basis / lineage refs。 | external source summary ref、artifact archive ref、body-free marker、lineage ref。 | 需要保存外部正文、artifact 包体、provider payload、URL/path 拼 ref。 |
| 后台维护与收敛 | 6 | refresh scope / target material / recovery reason / suspension / intervention / supersession。 | maintenance run ref、task ref、suspended / intervention summary。 | 在 Command 中执行刷新、恢复、worker job 或修 core truth。 |
| 外围包与方法集组织 | 9 | package / assembly / composition / unavailable / stale intent。 | package ref、assembly ref、composition evaluation summary、safe reason。 | 需要 marketplace listing、安装履约、组织 runtime config 或 SDK profile。 |

### 4. Command shell family

| shell family | 必要内容类别 | 来源规则 | 后续承接 |
|---|---|---|---|
| command envelope | command family marker、shared metadata、actor context、idempotency shell、request boundary ref。 | 只复制 shared helper 和 api command entry context;不读取 transport raw context。 | Step 9 entry flow;Step 13 idempotency。 |
| request intent shell | target typed refs、summary refs、safe reason refs、basis refs、marker refs、candidate identity refs。 | 只能来自 `R1.24` 输入骨架和 Step 6 typed refs / summary / marker。 | Step 9 command flow;Step 12 validation rejection。 |
| accepted result shell | accepted summary、created/updated object refs、history/lineage refs、availability / state hint refs。 | 只能来自 domain/support accepted output和 stored safe result。 | Step 11 result persistence;Step 13 replay。 |
| rejected result shell | safe reject reason、boundary / no-body marker、safe diagnostic、no-write outcome。 | 只能来自 policy / guard / mapper / degraded decision;错误码后移 Step 12。 | Step 12 error mapping;Step 16 contract tests。 |
| duplicate replay shell | duplicate replay marker、stored result ref、conflict safe reason、ignored / conflict outcome。 | 只能来自 idempotency guard 和 stored result / replay helper。 | Step 13 duplicate replay;Step 16 idempotency tests。 |
| effect summary shell | history refs、lineage refs、event candidate refs、maintenance hint refs、audit safe refs。 | 只能是 body-free refs / summaries;不包含 event payload、topic、outbox row 或 delivery state。 | Outbound Event family;Step 15 observability。 |

### 5. Command result / effect 来源规则

| result / effect | 允许来源 | 禁止来源 |
|---|---|---|
| accepted summary | domain factory / application command service 的 body-free accepted summary;stored result accepted branch。 | public DTO body snapshot、raw mutation output、DB row、adapter response。 |
| rejected reason | safe reason ref、policy / guard diagnostic、boundary marker、degraded decision。 | raw exception、HTTP status、provider error body、free-form string。 |
| duplicate replay | prior stored result ref、replay marker、same digest / dedup scope decision。 | 重跑 mutation、重新读取 truth 拼 response、entry-local memory map。 |
| effect summary | history / lineage / event candidate / maintenance hint / audit safe refs。 | topic、event payload、outbox delivery state、broker ack、report body。 |
| unavailable / blocked | safe diagnostic、runtime precheck summary、boundary / body-free marker。 | infra exception text、config secret、URL、queue status。 |

### 6. Command protocol 禁入清单

| 禁入项 | 说明 |
|---|---|
| 旧 `CreateMethodContentDraft` / `PublishMethodContent` / publish lifecycle | 已被当前 58 个 Command 分解替代,不得作为协议来源。 |
| snapshot / fingerprint / outbox result | 不得作为 version、effect、event 或 duplicate replay 的 Command result。 |
| HTTP route / RPC method / status code | transport 映射不在 Step 8 当前模块闭口。 |
| repository handle / UnitOfWork handle / domain transition | Command protocol 只表达 public shell,不得暴露内部调用面。 |
| raw external body / artifact body / report body / provider payload | 违反 body-free 边界。 |
| maintenance job execution | Command 只登记请求、挂起、介入或替代;执行由 Operations Job family 承接。 |

### 7. `R8.11` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.11 Query protocol family:先思考`,思考 query request、response view、page、empty/not visible/stale/degraded/unavailable surface 的来源、分组、shared helper 复用和停审条件。 |
| 当前禁止 | 不写 Query DTO 字段 schema、Rust struct / enum、JSON schema、route、RPC、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |
| 必须使用 | `R1.26` Query 总表、R8.8 shared helper、Step 6 read decision / degraded decision / public view shell、Step 7 repository page / read resolver / degraded mapper / page helper。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Command 来源表 | 是。 |
| 是否写入八组成部分分组矩阵 | 是。 |
| 是否写入 Command shell family | 是。 |
| 是否写入 result / effect 来源规则 | 是。 |
| 是否写入禁入清单 | 是。 |
| 是否形成 `R8.11` 进入门禁 | 是。 |
| 是否写具体 Command DTO 字段 schema / route / RPC | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.11`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.11 Query protocol family:先思考`;只允许思考 query request、response view、page、empty/not visible/stale/degraded/unavailable surface 的来源、分组、shared helper 复用和停审条件;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Query DTO 字段 schema、HTTP route、RPC name、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.12`、Step 9 或后续 Step。

## R8.11 Query protocol family:先思考

### 1. 思考边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.11 Query protocol family:先思考`。 |
| 本模块目标 | 只思考 Query 协议族的 request、response view、page、empty / not visible / stale / degraded / unavailable surface 的来源、分组、shared helper 复用和停审条件。 |
| 当前状态 | completed |
| 当前产物 | Query 输入来源裁决、八组成部分分组、query shell 族候选、read / degraded / page helper 复用规则、旧污染过滤和 `R8.12` 写入边界。 |
| 禁止范围 | 不写具体 Query DTO 字段 schema;不写 HTTP route、RPC name、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |

### 2. Query 输入来源裁决

| 来源 | 可进入 Query 协议族的内容 | 当前裁决 |
|---|---|---|
| HLD `R1.26` Query 总表 | 57 个 Query 名称、八组成部分归属、输入骨架、输出骨架、读取来源和边界。 | 作为 Query 协议族唯一候选列表来源;不得新增、改名或从旧 API 恢复读取入口。 |
| `R8.8` shared helper | metadata、actor/source、page、public marker、degraded / rejection shell、receipt/report shell。 | Query 必须复用 shared helper,不得每个 Query 私有定义 metadata、page、marker 或 degraded 结构。 |
| Step 6 object contracts | `MethodAssetReadDecision`、`MethodAssetDegradedDecision`、public shell、view / material / summary、typed refs、safe markers。 | 作为 response view、empty / absent、not visible、stale visible、degraded、unavailable surface 的对象来源。 |
| Step 7 port contracts | repository exact read / lookup / page、page/version helper、read resolver、availability resolver、degraded mapper、entry restriction。 | 作为 query selector、page、read source、visibility / freshness / degraded marker 的可落码来源;不在 Step 8 写 port 方法。 |

### 3. Query 分组与规模

| 组成部分 | Query 数量 | 协议思考重点 | 禁止混入 |
|---|---:|---|---|
| 方法资产定义与目录 | 4 | definition summary、definition ref resolution、catalog entry、catalog view page。 | 旧 content body、搜索实现、catalog repair、UI 分类算法。 |
| 正式化与版本 | 6 | formalization state、formal version summary、current version resolution、basis、eligibility diagnostic、history page。 | 治理执行正文、snapshot/fingerprint、状态推进、审批过程。 |
| 受控消费 | 6 | consumption material、availability view、context ref、boundary、use diagnostic、context page。 | 下游 runtime truth、授权实现、现场创建 material、cache hit 当事实。 |
| 追溯与一致性保护 | 7 | trace material、trace subject page、impact summary、pending impact、protection diagnostic、audit trail、evidence lineage。 | raw log、event payload、trace span、证据/report body。 |
| 关系与分发语义 | 9 | relation exact read、endpoint/version/context page、integrity diagnostic、change summary、distribution ref/material。 | marketplace 交易、推荐图、搜索排序、安装履约。 |
| 外部摘要与引用 | 8 | external safe summary、source ref、archive ref、body boundary diagnostic、summary view、acceptance history、lineage hint。 | 外部正文、artifact 包体、provider payload、URL/path 反推。 |
| 后台维护与收敛 | 8 | progress view、run/scope progress、refresh/recovery task summary、run history、pending scopes。 | worker/queue 状态、raw log、metric body、直接触发 repair。 |
| 外围包与方法集组织 | 9 | package / assembly truth summary、view、composition diagnostic、discovery context、history page。 | marketplace listing、价格、订单、安装、组织 runtime config。 |

### 4. Query shell 族候选

| shell 族 | 责任 | 来源 | R8.12 写入方式 |
|---|---|---|---|
| query envelope | 承载 query family、metadata、actor/read context 和 body-free selector boundary。 | `R8.8` metadata / actor shell;Step 6 `MethodAssetReadDecision`;api query entry shell。 | 写统一 envelope 类别,不写字段全集。 |
| selector / request shell | 表达 target ref、identity query、scope/filter summary、page request、optional context ref。 | `R1.26` 输入骨架;Step 6 typed refs / selector ref;Step 7 repository lookup/page key。 | 按八组成部分描述 selector 类别,不展开每个 DTO 字段。 |
| response view / material / summary shell | 表达 public safe view、read material summary、truth summary、diagnostic summary 或 history/lineage summary。 | Step 6 public shell、view/material/summary objects;Step 7 repository exact read / lookup。 | 写 response 类别与来源表,不写具体字段 schema。 |
| page / cursor shell | 表达 ordered page、opaque cursor、page item safe summary、next/empty continuation。 | `R8.8` page helper;Step 7 page / version helper和 repository page 输出。 | 写 cursor 只代表列表位置,不替代 version、checkpoint 或 truth identity。 |
| empty / safe-absent shell | 表达 typed selector 下可公开的 empty 或 safe absence。 | Step 6 `MethodAssetReadDecision.safe_absent`;Step 7 read resolver / repository safe absence summary。 | 写 absent 来源规则,不把 not found 暴露为 raw store miss。 |
| not-visible shell | 表达 boundary / visibility 限制下的不可见结果。 | `MethodAssetReadDecision.blocked_by_boundary`;policy / boundary marker。 | 写 marker 必须复制正式来源,不写鉴权实现。 |
| stale / degraded / unavailable shell | 表达 stale visible、partial、invalid safe material、adapter unavailable、runtime degraded。 | `MethodAssetDegradedDecision`;availability resolver;degraded mapper;material freshness marker。 | 写 degraded 来源规则,不合成 marker 或 raw error。 |

### 5. shared helper 复用规则

| helper | Query 使用规则 |
|---|---|
| metadata / actor / read context | 所有 Query 必须携带 actor 和 query metadata;read subject、read source、scope、visibility 只能来自 typed selector、loaded view/material 或 read resolver。 |
| page / cursor | list/query page 必须使用 shared page helper和 Step 7 repository page 输出;cursor 不代表 optimistic version、job checkpoint、truth cursor 或 private offset。 |
| read decision | found、safe_absent、not_visible、stale_visible、degraded、unavailable 必须由 `MethodAssetReadDecision` 或等价 resolver summary 表达。 |
| degraded decision | degraded marker、partiality marker、safe diagnostic、follow-up hint 必须复制 `MethodAssetDegradedDecision`、availability resolver 或 degraded mapper 输出。 |
| public marker | visibility、freshness、availability、body-free、safe absence marker 只能复制正式对象 / resolver / mapper / material 输出。 |
| no-write query | Query 不创建、刷新、修复、删除 truth / view / material,也不启动 job、publisher、handoff 或 repair。 |
| entry restriction | api handler 只转交 application query facade;不得直接调用 repository、resolver、UnitOfWork、domain transition 或 infra adapter。 |

### 6. Query protocol 停审条件

| 缺口 | 停审动作 |
|---|---|
| Query 名称、归属或边界无法回指 `R1.26` | 暂停,不得新增 Query 或恢复旧 API。 |
| selector / request 需要 raw string、route param、URL、path、provider id、marketplace id 或旧 content id 才能表达 | 暂停,回 typed ref / resolver / external summary 闭口。 |
| response view / summary / material 无 Step 6 object 或 Step 7 repository/read source 来源 | 暂停,不得写 response shell。 |
| Query 需要刷新、修复、创建、删除 truth / material / view 或启动 job 才能返回 | 暂停,转入 Command / Operations Job / Step 9 flow 审计。 |
| visibility、freshness、availability、degraded、unavailable marker 需要 service 现场合成 | 暂停,回 read resolver / availability resolver / degraded mapper 闭口。 |
| page cursor、optimistic version、job checkpoint、truth cursor 被混用 | 暂停,回 Step 7 page/version/checkpoint helper 闭口。 |
| empty / safe absent 分支只能来自 raw store miss 或 adapter error | 暂停,必须补 safe absence reason 或 unavailable/degraded summary。 |
| response 需要 raw body、external payload、artifact/archive body、raw log、event payload、report body 或 marketplace transaction | 暂停,违反 body-free / safe public shell 边界。 |

### 7. `R8.12` 写入边界

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.12 Query protocol family:再写入`,写入 Query 来源裁决、八组成部分分组、query envelope / selector / response / page / empty / not-visible / stale / degraded / unavailable shell 族候选、shared helper 复用规则、停审条件和 `R8.13` 进入门禁。 |
| 当前禁止 | 不写具体 Query DTO 字段 schema、Rust struct / enum、JSON schema、route、RPC、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |
| 必须使用 | `R1.26` Query 总表、R8.8 shared helper、Step 6 read/degraded/public shell、Step 7 repository page / read resolver / availability resolver / degraded mapper / page helper。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只思考 Query protocol family | 是。 |
| 是否以 `R1.26` 57 个 Query 为唯一候选来源 | 是。 |
| 是否形成八组成部分分组 | 是。 |
| 是否形成 query shell 族候选 | 是。 |
| 是否形成 shared helper 复用规则 | 是。 |
| 是否形成停审条件 | 是。 |
| 是否写具体 Query DTO 字段 schema | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.12`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.12 Query protocol family:再写入`;只允许写入 Query 来源裁决、八组成部分分组、query envelope / selector / response / page / empty / not-visible / stale / degraded / unavailable shell 族候选、shared helper 复用规则、停审条件和 `R8.13` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Query DTO 字段 schema、HTTP route、RPC name、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.13`、Step 9 或后续 Step。

## R8.12 Query protocol family:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.12 Query protocol family:再写入`。 |
| 本模块目标 | 固化 Query 来源裁决、八组成部分分组、query envelope / selector / response / page / empty / not-visible / stale / degraded / unavailable shell 族候选、shared helper 复用规则、停审条件和 `R8.13` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | Query protocol family 来源表、57 个 Query 分组矩阵、shell family 表、read / degraded / page 复制规则、禁入清单、停审条件和 Inbound consumer family 进入门禁。 |
| 禁止范围 | 不修改正式 `03-详细设计.md`;不写具体 Query DTO 字段 schema、HTTP route、RPC name、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |

### 2. Query protocol family 来源表

| 来源层 | 正式输入 | 本模块使用方式 | 禁止用法 |
|---|---|---|---|
| HLD interface | `R1.26` Query 总表,57 个 Query,八组成部分分组。 | 固定 Query 候选集合、名称、归属、输入/输出骨架、读取来源和边界。 | 新增 Query、改名、从旧 `MethodContent` / P0 / P1 API 恢复旧读取入口。 |
| shared helper | `R8.8` metadata、actor/source、page、public marker、rejection/degraded、receipt/report shell。 | 统一 query envelope、page/cursor、read result、degraded / unavailable surface。 | 每个 Query 私有定义 metadata、page、marker、error 或 degraded 结构。 |
| Step 6 objects | `MethodAssetReadDecision`;`MethodAssetDegradedDecision`;public shell;view / material / summary;typed refs;safe markers。 | 提供 found、safe absent、not visible、stale visible、degraded、unavailable 的对象来源。 | 暴露 truth body、external body、raw log、entry local state 或 helper 内部字段。 |
| Step 7 ports | repository exact read / lookup / page;page/version helper;read resolver;availability resolver;degraded mapper;entry restriction。 | 提供 selector、read source、page、visibility、freshness、availability、degraded marker 的可落码来源。 | 在 Step 8 写 port 方法、repository 调用链、resolver 算法、durable schema 或 fake 规则。 |

### 3. Query 分组矩阵

| 组成部分 | 数量 | Query 候选 | response 类别 | 主要暂停条件 |
|---|---:|---|---|---|
| 方法资产定义与目录 | 4 | `GetMethodAssetDefinitionSummary`;`ResolveMethodAssetDefinitionRef`;`GetMethodAssetCatalogEntry`;`ListMethodAssetCatalogView` | definition / catalog summary;resolution summary;catalog view page。 | 需要旧 content body、搜索实现、catalog repair、UI 分类算法或 route/raw id 拼 ref。 |
| 正式化与版本 | 6 | `GetFormalizationState`;`GetFormalMethodAssetVersionSummary`;`ResolveCurrentFormalMethodAssetVersion`;`GetFormalizationBasisSummary`;`GetFormalizationEligibilityDiagnostic`;`ListFormalizationHistory` | formalization state;formal version summary;basis summary;diagnostic;history page。 | 需要治理执行正文、snapshot/fingerprint、审批过程、状态推进或 raw audit log。 |
| 受控消费 | 6 | `GetMethodAssetConsumptionMaterial`;`GetMethodAssetAvailabilityView`;`ResolveConsumptionContextRef`;`GetDownstreamConsumptionBoundary`;`GetDefinitionUseBoundaryDiagnostic`;`ListConsumableContextsForFormalVersion` | consumption material;availability view;context/boundary summary;diagnostic;context page。 | 需要下游 runtime truth、授权实现、现场创建/刷新 material 或 cache hit 事实化。 |
| 追溯与一致性保护 | 7 | `GetMethodAssetTraceMaterial`;`GetTraceBySubject`;`GetConsumptionImpactSummary`;`ListPendingConsumptionImpacts`;`GetConsistencyProtectionDiagnostic`;`GetMethodAssetAuditTrail`;`GetMethodAssetEvidenceLineage` | trace material;impact summary;protection diagnostic;audit / lineage summary;page。 | 需要 raw log、event payload、trace span、证据正文、report body 或下游内部 truth。 |
| 关系与分发语义 | 9 | `GetMethodAssetRelation`;`ListMethodAssetRelationsByEndpoint`;`ListMethodAssetRelationsByFormalVersion`;`ListMethodAssetRelationsByDistributionContext`;`GetRelationIntegrityDiagnostic`;`GetRelationChangeSummary`;`ResolveMethodAssetDistributionRef`;`GetDistributionReadMaterial`;`ListDistributionReadMaterialsByContext` | relation summary/page;integrity diagnostic;change summary;distribution ref/material。 | 需要 marketplace 交易、推荐图、搜索排序、安装履约、扩大消费授权或外部 API payload。 |
| 外部摘要与引用 | 8 | `GetExternalSourceSummary`;`GetExternalSummaryBySourceRef`;`ResolveExternalSourceRef`;`GetArtifactArchiveRef`;`GetExternalBodyBoundaryDiagnostic`;`GetExternalSourceSummaryView`;`GetExternalBasisAcceptanceHistory`;`GetExternalEvidenceLineageHint` | external safe summary;source/archive ref summary;body boundary diagnostic;history / lineage page。 | 需要外部正文、artifact 包体、provider payload、URL/path 反推、外部日志或 evidence body。 |
| 后台维护与收敛 | 8 | `GetMaintenanceProgress`;`GetMaintenanceProgressByRun`;`GetMaintenanceProgressByScope`;`GetReadMaterialRefreshTaskSummary`;`GetTraceMaterialRefreshTaskSummary`;`GetConsistencyRecoveryTaskSummary`;`GetMaintenanceRunHistory`;`ListPendingMaintenanceScopes` | progress view;task summary;run history;pending/stale/unavailable scope page。 | 需要 worker / queue / scheduler 状态、lock/retry token、raw log、metric body 或触发 repair。 |
| 外围包与方法集组织 | 9 | `GetMethodPackage`;`ListMethodPackages`;`GetMethodPackageView`;`GetMethodPackageCompositionDiagnostic`;`GetMethodSetAssembly`;`ListMethodSetAssemblies`;`GetMethodSetAssemblyView`;`GetPeripheralDiscoveryContext`;`GetPackageAssemblyHistory` | package / assembly summary;view;composition diagnostic;discovery context;history page。 | 需要 listing、价格、订单、安装履约、组织 runtime config、SDK profile 或 package body。 |

### 4. Query shell family

| shell family | 必要内容类别 | 来源规则 | 后续承接 |
|---|---|---|---|
| query envelope | query family marker、shared metadata、actor/read context、body-free selector boundary。 | 只复制 shared helper、`MethodAssetReadDecision` context 和 api query entry context;不读取 raw transport。 | Step 9 query flow;Step 16 contract tests。 |
| selector / request shell | target typed refs、identity query、scope/filter summary、page request、optional context ref。 | 只能来自 `R1.26` 输入骨架、Step 6 typed refs / selector ref、Step 7 lookup/page key。 | Step 9 selector resolution;Step 12 validation rejection。 |
| response view / material / summary shell | public safe view、read material summary、truth summary、diagnostic summary、history/lineage summary。 | 只能来自 Step 6 public shell / view / material / summary 和 Step 7 exact read / lookup。 | Step 9 read assembly;Step 11 read persistence;Step 16 fixture。 |
| page / cursor shell | ordered page、opaque cursor、page item safe summary、empty/next continuation。 | 只能来自 shared page helper、Step 7 page/version helper和 repository page 输出。 | Step 9 list flow;Step 11 cursor store;Step 12 partial page。 |
| empty / safe-absent shell | typed selector 下的 empty result、safe absence reason、absence marker。 | 只能来自 `MethodAssetReadDecision.safe_absent`、read resolver 或 repository safe absence summary。 | Step 9 empty branch;Step 12 safe absence error model。 |
| not-visible shell | visibility / boundary 限制下的不可见或 context-limited result。 | 只能复制 policy / boundary marker 或 `MethodAssetReadDecision.blocked_by_boundary`。 | Step 9 visibility branch;Step 12 not-visible mapping。 |
| stale / degraded / unavailable shell | stale visible、partial page/material、invalid safe material、adapter/runtime unavailable。 | 只能复制 `MethodAssetDegradedDecision`、availability resolver、degraded mapper、material freshness marker。 | Step 9 degraded branch;Step 12 recovery;Step 15 telemetry。 |

### 5. Query read / degraded / page 复制规则

| surface | 允许来源 | 禁止来源 |
|---|---|---|
| found read result | loaded truth/view/material/summary 的 safe read source ref;read resolver summary。 | raw DB row、private map、search hit、route param、旧 content id。 |
| safe absent / empty | typed selector + safe absence reason;empty page summary。 | raw store miss、adapter exception、空字符串、HTTP 404 直接透传。 |
| not visible | boundary / visibility marker;context-limited read decision。 | 鉴权实现、token、权限矩阵、free-form forbidden message。 |
| stale visible | material/view freshness marker + safe view/material summary。 | timestamp 猜测、cache key、snapshot/fingerprint、private staleness flag。 |
| degraded / partial | degraded decision、partiality marker、safe diagnostic、follow-up hint。 | stack trace、SQL / HTTP detail、provider error body、worker log。 |
| unavailable | adapter availability summary、runtime precheck summary、safe unavailable reason。 | raw IO error、secret、URL、queue status、config dump。 |
| page / cursor | opaque page cursor、ordered page item summary、versioned read item。 | optimistic version、job checkpoint、truth cursor、offset 字符串互相代替。 |

### 6. Query protocol 禁入清单

| 禁入项 | 说明 |
|---|---|
| 旧 `MethodContent` / P0 / P1 读取入口 | 当前 Query 候选只能来自 `R1.26` 57 个名称。 |
| HTTP route / RPC method / status code | transport 映射不在 Step 8 当前模块闭口。 |
| repository handle / resolver handle / UnitOfWork handle | Query protocol 只表达 public shell,不得暴露内部调用面。 |
| raw body / external payload / artifact/archive body / report body | 违反 body-free 和 safe public shell 边界。 |
| raw audit log / event payload / trace span / metric body | 只能返回 safe summary、lineage refs、history refs 或 diagnostic refs。 |
| marketplace listing / transaction / install / fulfillment | 外围 query 不承接交易、履约或安装事实。 |
| query-triggered refresh / repair / job / publish / handoff | Query 必须 no-write;后续行为只能是 follow-up hint 或进入 Command / Job family。 |

### 7. Query protocol 停审条件

| 缺口 | 停审动作 |
|---|---|
| Query 名称、数量、组成部分或边界无法回指 `R1.26` | 暂停,不得新增或改名。 |
| selector 需要 raw string、route、URL、path、provider id、marketplace id 或旧 content id | 暂停,回 typed ref / resolver / external summary 闭口。 |
| response shell 无 Step 6 public object 或 Step 7 read source / repository 来源 | 暂停,不得写 response schema。 |
| read subject、read source、visibility、freshness 或 availability 需要 service 自行合成 | 暂停,回 read resolver / availability resolver 闭口。 |
| degraded marker、partial marker、safe diagnostic 或 follow-up hint 缺正式 mapper 来源 | 暂停,回 degraded mapper / Step 12 闭口。 |
| page cursor、optimistic version、truth cursor、job checkpoint 边界混淆 | 暂停,回 Step 7 page/version/checkpoint helper 闭口。 |
| Query 需要写 truth、刷新 material、修 view、启动 job、publisher 或 handoff | 暂停,转入 Command / Operations Job / Step 9 flow 审计。 |

### 8. `R8.13` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.13 Inbound consumer protocol family:先思考`,思考 inbound envelope、typed payload boundary、receipt、duplicate / quarantine / delayed / no-op surface 的来源、分组、shared helper 复用和停审条件。 |
| 当前禁止 | 不写 Inbound Consumer DTO 字段 schema、Rust struct / enum、JSON schema、topic、broker binding、ack/retry/dead-letter、function flow、状态矩阵、persistence、config 或 test。 |
| 必须使用 | `R1.28` Inbound Consumer 总表、R8.8 shared helper、Step 6 inbound intake decision / external summary / source refs、Step 7 inbound source port / external body-free adapter / stored result / idempotency / entry restriction。 |

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Query 来源表 | 是。 |
| 是否写入 57 个 Query 分组矩阵 | 是。 |
| 是否写入 Query shell family | 是。 |
| 是否写入 read / degraded / page 复制规则 | 是。 |
| 是否写入禁入清单 | 是。 |
| 是否形成 `R8.13` 进入门禁 | 是。 |
| 是否写具体 Query DTO 字段 schema / route / RPC | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.13`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.13 Inbound consumer protocol family:先思考`;只允许思考 inbound envelope、typed payload boundary、receipt、duplicate / quarantine / delayed / no-op surface 的来源、分组、shared helper 复用和停审条件;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Inbound Consumer DTO 字段 schema、HTTP route、RPC name、event topic、broker binding、ack/retry/dead-letter、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.14`、Step 9 或后续 Step。

## R8.13 Inbound consumer protocol family:先思考

### 1. 思考边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.13 Inbound consumer protocol family:先思考`。 |
| 本模块目标 | 只思考 Inbound Consumer 协议族的 inbound envelope、typed payload boundary、receipt、duplicate / quarantine / delayed / no-op surface 的来源、分组、shared helper 复用和停审条件。 |
| 当前状态 | completed |
| 当前产物 | Inbound 输入来源裁决、4 个 Consumer 候选边界、inbound shell 族候选、intake / receipt / duplicate 复用规则、旧污染过滤和 `R8.14` 写入边界。 |
| 禁止范围 | 不写具体 Inbound Consumer DTO 字段 schema;不写 event topic、broker binding、ack/retry/dead-letter、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |

### 2. Inbound 输入来源裁决

| 来源 | 可进入 Inbound Consumer 协议族的内容 | 当前裁决 |
|---|---|---|
| HLD `R1.28` Inbound 总表 | 4 个 body-free Inbound Consumer 名称、唯一 owner、来源事实、输入骨架、输出/处理结果和边界。 | 作为 Inbound Consumer 协议族唯一候选来源;不得新增 consumer 或恢复旧 publish/gate consumer。 |
| `R8.8` shared helper | metadata、source shell、idempotency、operation result、public marker、degraded / receipt shell。 | Inbound 必须复用 shared source envelope、dedup、receipt/result 和 safe marker 壳。 |
| Step 6 object contracts | `MethodAssetInboundIntakeDecision`;`MethodAssetInboundSourceBindingState`;`MethodAssetInboundConsumerEntry`;`MethodAssetWorkerEntryResultState`;external summary/ref/archive/body-free marker。 | 作为 envelope、body-free intake shell、accepted/ignored/rejected/handoff receipt 的对象来源。 |
| Step 7 port contracts | `MethodAssetInboundSourcePort`;`ExternalBodyFreeSourceAdapterPort`;stored result/idempotency helper;worker entry restriction;runtime source binding。 | 作为 source event resolution、schema/version、dedup、body-free validation、safe outcome 的可落码来源;不写 port 方法。 |

### 3. Inbound 候选与唯一 owner

| Consumer | owner | 来源事实 | 协议思考重点 | 禁止混入 |
|---|---|---|---|---|
| `ConsumeBodyFreeExternalSummaryAccepted` | 外部摘要与引用 | 外部系统或相邻仓已形成 body-free external summary accepted 事实。 | source envelope、safe summary ref/digest、body-free marker、accepted / ignored / rejected receipt。 | raw document、webhook payload、标准全文、ADR 正文、artifact body、证据正文。 |
| `ConsumeExternalSourceRefRegistered` | 外部摘要与引用 | 外部边界已登记 typed external source ref。 | source kind、namespace ref、version hint、digest hint、external source ref intake summary。 | URL、file path、external id、provider payload、认证信息反推 ref。 |
| `ConsumeArtifactArchiveRefRegistered` | 外部摘要与引用 | 外部边界已登记 artifact / archive body-free ref。 | artifact archive ref、artifact kind、digest hint、optional external source ref、lineage hint。 | archive 包体、文件内容、安装包、对象存储路径、retention policy。 |
| `ConsumeExternalBodyBoundaryViolation` | 外部摘要与引用 | 外部边界已发现正文禁止边界违规。 | candidate ref、violation kind、safe reason ref、rejected / handoff_required receipt。 | 被拒正文、payload 摘录、标准正文、artifact body、evidence body。 |

当前裁决:

- Inbound Consumer 只归属 `外部摘要与引用`,其他七个组成部分不直接拥有 inbound consumer。
- Inbound Consumer 只承接外部已成立的 body-free fact,不接收 raw payload,不创建 core truth。
- 下游 impact、maintenance trigger、marketplace context、relation hint 等线索若未先形成 external summary/ref/marker,不得进入本组协议。

### 4. Inbound shell 族候选

| shell 族 | 责任 | 来源 | R8.14 写入方式 |
|---|---|---|---|
| inbound envelope shell | 承载 source system、source event id、schema/version、dedup key、trace context 和 body-free boundary。 | `R8.8` source/idempotency helper;Step 6 inbound entry/source binding;Step 7 inbound source port。 | 写统一 envelope 类别,不写字段全集或 topic。 |
| typed payload boundary shell | 表达 safe summary、typed external ref、artifact/archive ref、digest hint、safe reason、body-free marker。 | `R1.28` 输入骨架;Step 6 external summary/ref/archive/body-free marker。 | 写 payload boundary 类别,不写 raw payload 或 JSON schema。 |
| intake decision shell | 表达 accepted、ignored、rejected、handoff_required 的 application intake 结果。 | `MethodAssetInboundIntakeDecision`;Step 7 inbound source safe outcome。 | 写 disposition 来源规则,不写 flow 顺序。 |
| duplicate / replay shell | 表达 duplicate ignored、stored result replay、same source event/dedup scope。 | `MethodAssetIdempotencyGuard`;stored result/replay helper。 | 写 duplicate 只能复制 stored safe result。 |
| quarantine / rejected shell | 表达 unsupported schema、malformed body-free envelope、raw payload rejected、boundary violation。 | inbound source safe reason;degraded/safe diagnostic;body boundary rule marker。 | 写 safe reason / marker 来源,不写 dead-letter 或 ack。 |
| delayed / handoff-required shell | 表达 source unavailable、external resolution pending、requires explicit Command / handoff hint。 | inbound source unavailable summary;external body-free adapter pending/unavailable;safe follow-up hint。 | 写 delayed/handoff 类别,不写 retry policy。 |
| worker entry result shell | 表达 worker local safe result,但不等同 broker ack、delivery receipt 或 outbox state。 | `MethodAssetInboundConsumerEntry`;`MethodAssetWorkerEntryResultState`;entry restriction。 | 写 entry 只转译 shell 并调用 application facade。 |

### 5. shared helper 复用规则

| helper | Inbound 使用规则 |
|---|---|
| metadata / source | 所有 Inbound Consumer 必须是 source-driven,source event metadata 只能来自 validated source envelope / binding summary。 |
| idempotency | 所有 Inbound Consumer 必须带 source event id、source system ref、schema/version、dedup key 或等价 dedup scope;duplicate 必须走 stored result replay / ignored receipt。 |
| operation result / receipt | accepted、ignored、rejected、handoff_required、duplicate、blocked、unsupported 都必须进入 safe receipt/result shell。 |
| public marker | body-free、schema/version、boundary、degraded、safe reason marker 只能复制正式 source binding、inbound source port、external adapter或 intake decision 输出。 |
| degraded / unavailable | unsupported schema、source unavailable、malformed safe envelope、external pending 只能返回 safe diagnostic / hint,不得暴露 raw adapter error。 |
| entry restriction | worker 只解析 local runner context 和 body-free shell,并调用 application consumer facade;不得直接创建 truth、读写 repository 或解释 raw payload。 |

### 6. Inbound protocol 停审条件

| 缺口 | 停审动作 |
|---|---|
| Consumer 名称、owner 或来源事实无法回指 `R1.28` | 暂停,不得新增 Inbound Consumer。 |
| inbound 输入需要 raw document、webhook payload、broker body、artifact body、provider payload、URL/path 才能表达 | 暂停,回 external summary / body-free adapter 闭口。 |
| source envelope 缺 source event id、source system ref、schema/version、dedup key 或 trace context 来源 | 暂停,不得写 envelope shell。 |
| accepted / ignored / rejected / handoff_required 无 `MethodAssetInboundIntakeDecision` 或 stored result 来源 | 暂停,不得写 receipt shell。 |
| duplicate replay 需要扫描队列、读 broker offset、重跑 intake 或依赖 worker local memory | 暂停,回 idempotency / stored result 设计闭口。 |
| rejected / quarantine 需要 ack/nack、dead-letter、retry policy、transport status 才能表达 | 暂停,transport 行为后移 Step 14 / runtime binding。 |
| Inbound Consumer 试图直接创建 definition、formal version、relation、package、material、maintenance task 或 job run | 暂停,必须转为 explicit Command / Job / follow-up hint。 |

### 7. `R8.14` 写入边界

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.14 Inbound consumer protocol family:再写入`,写入 Inbound 来源裁决、4 个 Consumer 分组、inbound envelope / typed payload boundary / intake / duplicate / quarantine / delayed / worker result shell 族候选、shared helper 复用规则、停审条件和 `R8.15` 进入门禁。 |
| 当前禁止 | 不写具体 Inbound Consumer DTO 字段 schema、Rust struct / enum、JSON schema、topic、broker binding、ack/retry/dead-letter、function flow、状态矩阵、persistence、config 或 test。 |
| 必须使用 | `R1.28` Inbound 总表、R8.8 shared helper、Step 6 inbound intake / source binding / worker entry / external summary refs、Step 7 inbound source port / external body-free adapter / stored result / idempotency / entry restriction。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只思考 Inbound consumer protocol family | 是。 |
| 是否以 `R1.28` 4 个 Consumer 为唯一候选来源 | 是。 |
| 是否确认唯一 owner 是外部摘要与引用 | 是。 |
| 是否形成 inbound shell 族候选 | 是。 |
| 是否形成 shared helper 复用规则 | 是。 |
| 是否形成停审条件 | 是。 |
| 是否写具体 Inbound DTO 字段 schema / topic / broker binding | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.14`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.14 Inbound consumer protocol family:再写入`;只允许写入 Inbound 来源裁决、4 个 Consumer 分组、inbound envelope / typed payload boundary / intake / duplicate / quarantine / delayed / worker result shell 族候选、shared helper 复用规则、停审条件和 `R8.15` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Inbound Consumer DTO 字段 schema、HTTP route、RPC name、event topic、broker binding、ack/retry/dead-letter、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.15`、Step 9 或后续 Step。

## R8.14 Inbound consumer protocol family:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.14 Inbound consumer protocol family:再写入`。 |
| 本模块目标 | 固化 Inbound 来源裁决、4 个 Consumer 分组、inbound envelope / typed payload boundary / intake / duplicate / quarantine / delayed / worker result shell 族候选、shared helper 复用规则、停审条件和 `R8.15` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | Inbound protocol family 来源表、4 个 Consumer 分组矩阵、shell family 表、intake / receipt / duplicate 来源规则、禁入清单、停审条件和 Outbound event family 进入门禁。 |
| 禁止范围 | 不修改正式 `03-详细设计.md`;不写具体 Inbound Consumer DTO 字段 schema、HTTP route、RPC name、event topic、broker binding、ack/retry/dead-letter、Rust struct / enum、JSON schema、错误码正文、function flow、状态矩阵、persistence、config 或 test。 |

### 2. Inbound protocol family 来源表

| 来源层 | 正式输入 | 本模块使用方式 | 禁止用法 |
|---|---|---|---|
| HLD interface | `R1.28` Inbound 总表,4 个 Consumer,唯一 owner 为外部摘要与引用。 | 固定 Consumer 候选集合、名称、owner、来源事实、输入/输出骨架和边界。 | 新增 consumer、改名、从旧 publish gate / outbox / webhook 同步恢复旧入口。 |
| shared helper | `R8.8` metadata、source、idempotency、operation result、public marker、degraded / receipt shell。 | 统一 source envelope、dedup、receipt/result、duplicate replay 和 safe marker 壳。 | 每个 Consumer 私有定义 envelope、dedup、receipt、error 或 retry 结构。 |
| Step 6 objects | `MethodAssetInboundIntakeDecision`;`MethodAssetInboundSourceBindingState`;`MethodAssetInboundConsumerEntry`;`MethodAssetWorkerEntryResultState`;external summary/ref/archive/body-free marker。 | 提供 envelope、payload boundary、accepted/ignored/rejected/handoff receipt 的对象来源。 | 暴露 raw payload、broker envelope、provider body、entry local state 或 binding 内部字段。 |
| Step 7 ports | `MethodAssetInboundSourcePort`;`ExternalBodyFreeSourceAdapterPort`;stored result/replay;idempotency;worker entry restriction。 | 提供 source resolution、schema/version、dedup、body-free validation、safe outcome 和 duplicate replay 来源。 | 在 Step 8 写 port 方法、adapter 方法、topic、transport ack、durable schema 或 fake 规则。 |

### 3. Inbound Consumer 分组矩阵

| Consumer | 来源事实 | 输入类别 | receipt / result 类别 | 主要暂停条件 |
|---|---|---|---|---|
| `ConsumeBodyFreeExternalSummaryAccepted` | body-free external summary accepted。 | source envelope、source event id、schema/version、dedup key、trace context、`ExternalSourceRef`、safe summary ref/digest、body-free marker。 | accepted / ignored / rejected result;external summary accepted intake summary;explicit Command handoff hint。 | 输入需要 raw document、webhook payload、标准全文、ADR 正文、artifact body 或外部 API payload。 |
| `ConsumeExternalSourceRefRegistered` | typed external source ref registered。 | source envelope、source kind、namespace ref、version hint、digest hint、`ExternalSourceRef`。 | accepted / ignored / rejected result;external source ref intake summary。 | 需要 URL、file path、route param、provider payload、credential 或 external id 拼 ref。 |
| `ConsumeArtifactArchiveRefRegistered` | artifact / archive body-free ref registered。 | source envelope、`ArtifactArchiveRef`、artifact kind、digest hint、optional `ExternalSourceRef`。 | accepted / ignored / rejected result;artifact/archive ref intake summary;lineage hint。 | 需要 archive 包体、文件内容、安装包、对象存储内容、路径或 retention policy。 |
| `ConsumeExternalBodyBoundaryViolation` | external body boundary violation discovered。 | source envelope、candidate ref、violation kind、safe reason ref、body-free boundary marker。 | accepted / ignored / rejected result;body boundary violation intake summary;rejection / audit / upstream correction hint。 | 需要被拒正文、payload 摘录、标准正文、artifact body、evidence body 或 raw provider error。 |

### 4. Inbound shell family

| shell family | 必要内容类别 | 来源规则 | 后续承接 |
|---|---|---|---|
| inbound envelope shell | source system ref、source event ref、schema/version ref、dedup key、trace context、body-free boundary marker。 | 只复制 shared source/idempotency helper、source binding和 inbound source port 输出;不包含 broker/topic/ack。 | Step 9 consumer flow;Step 13 inbound dedup;Step 14 source binding。 |
| typed payload boundary shell | safe summary ref、typed external source ref、artifact/archive ref、digest hint、candidate ref、safe reason ref。 | 只能来自 `R1.28` 输入骨架和 Step 6 external summary/ref/archive/body-free marker。 | Step 9 external intake;Step 11 external state;Step 16 fixtures。 |
| intake decision shell | accepted、ignored、rejected、handoff_required disposition 和 safe reason / handoff hint。 | 只能来自 `MethodAssetInboundIntakeDecision` 或 inbound source safe outcome。 | Step 9 consumer branch;Step 12 intake error model。 |
| duplicate / replay shell | duplicate ignored、stored result ref、same source event/dedup scope、replay marker。 | 只能来自 idempotency guard 和 stored result / replay helper。 | Step 13 duplicate replay;Step 16 idempotency tests。 |
| quarantine / rejected shell | unsupported schema、malformed safe envelope、raw payload rejected、boundary violation safe reason。 | 只能来自 source binding diagnostic、inbound source port safe reason、body boundary marker。 | Step 12 rejection mapping;Step 14 source compatibility。 |
| delayed / handoff-required shell | source unavailable、external resolution pending、follow-up hint、requires explicit Command / handoff。 | 只能来自 inbound source unavailable summary、external body-free adapter pending/unavailable、safe follow-up hint。 | Step 9 handoff branch;Step 12 recovery;Step 15 observability。 |
| worker entry result shell | worker local accepted/ignored/rejected/blocked result state。 | 只能来自 `MethodAssetInboundConsumerEntry` 和 `MethodAssetWorkerEntryResultState`;不等于 broker ack。 | Step 9 worker entry flow;Step 16 facade-only tests。 |

### 5. Inbound intake / receipt / duplicate 来源规则

| surface | 允许来源 | 禁止来源 |
|---|---|---|
| accepted intake | inbound source safe summary、body-free marker、typed external refs、`MethodAssetInboundIntakeDecision.accepted`。 | raw payload 解析结果、provider response body、broker message body。 |
| ignored intake | duplicate stored result、safe reason ref、unsupported but safe ignored branch。 | ack/nack 状态、dead-letter policy、worker local flag。 |
| rejected intake | safe reason ref、body boundary violation marker、unsupported schema diagnostic。 | raw exception、transport status、provider error body、payload 摘录。 |
| handoff_required / delayed | pending/unavailable external resolution summary、safe follow-up hint。 | retry count、queue offset、scheduler lease、transport timeout 字符串。 |
| duplicate replay | source event id + dedup key + stored safe result ref。 | 重跑 intake、扫描 broker queue、读取 worker memory 或重读外部 payload。 |
| worker result | entry local safe result state、intake decision ref、precheck blocked summary。 | broker ack、delivery receipt、topic offset、dead-letter state。 |

### 6. Inbound protocol 禁入清单

| 禁入项 | 说明 |
|---|---|
| 旧 publish gate consumer / old outbox consumer | 当前 Inbound 候选只来自 `R1.28` 4 个 body-free external consumer。 |
| event topic / broker binding / subscription / ack / retry / dead-letter | transport 和 runtime 绑定后移 Step 14,不属于当前协议 family。 |
| raw document / webhook payload / broker body / provider payload | 违反 body-free inbound 边界。 |
| artifact archive body / evidence body / report body | 本仓只承接 typed refs、digest hints、safe summary 和 marker。 |
| direct core truth mutation | Inbound intake 不直接创建或修改 definition、formal version、relation、package、method set、material、maintenance task。 |
| worker direct repository / adapter call | worker entry 只调用 application consumer facade,不得越过 application。 |

### 7. Inbound protocol 停审条件

| 缺口 | 停审动作 |
|---|---|
| Consumer 名称、owner、来源事实无法回指 `R1.28` | 暂停,不得新增或改名。 |
| envelope 缺 source event id、source system ref、schema/version、dedup key 或 trace context 来源 | 暂停,回 source binding / inbound source port 闭口。 |
| typed payload boundary 需要 raw body、URL/path、provider id、archive content 或 payload 摘录 | 暂停,回 external summary / body-free adapter 闭口。 |
| intake disposition 缺 `MethodAssetInboundIntakeDecision`、stored result 或 safe reason 来源 | 暂停,不得写 receipt shell。 |
| duplicate 处理缺 durable stored result / replay 来源 | 暂停,回 idempotency / stored result 设计闭口。 |
| rejected / quarantine 需要 ack、dead-letter、retry、transport status 或 queue offset 才能表达 | 暂停,后移 Step 14 / runtime binding。 |
| worker entry 需要直连 repository、domain transition、inbound source concrete adapter 或 external adapter | 暂停,违反 entry restriction。 |

### 8. `R8.15` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.15 Outbound event protocol family:先思考`,思考 outbound envelope、schema version、payload boundary、publication outcome、body-free event shell 的来源、分组、shared helper 复用和停审条件。 |
| 当前禁止 | 不写 Outbound Event DTO 字段 schema、Rust struct / enum、JSON schema、event topic、publisher binding、outbox/relay、delivery receipt、function flow、状态矩阵、persistence、config 或 test。 |
| 必须使用 | `R1.30` Outbound Event 总表、R8.8 shared helper、Step 6 event candidate assembly / publisher binding / worker publisher entry、Step 7 event candidate publisher / target registry / publication safe outcome / adapter availability。 |

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Inbound 来源表 | 是。 |
| 是否写入 4 个 Consumer 分组矩阵 | 是。 |
| 是否写入 Inbound shell family | 是。 |
| 是否写入 intake / receipt / duplicate 来源规则 | 是。 |
| 是否写入禁入清单 | 是。 |
| 是否形成 `R8.15` 进入门禁 | 是。 |
| 是否写具体 Inbound DTO 字段 schema / topic / broker binding | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.15`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.15 Outbound event protocol family:先思考`;只允许思考 outbound envelope、schema version、payload boundary、publication outcome、body-free event shell 的来源、分组、shared helper 复用和停审条件;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Outbound Event DTO 字段 schema、HTTP route、RPC name、event topic、publisher binding、outbox/relay、delivery receipt、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.16`、Step 9 或后续 Step。

## R8.15 Outbound event protocol family:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.15 Outbound event protocol family:先思考`。 |
| 本模块目标 | 思考 Outbound Event 协议族的来源裁决、34 个候选事件分组、outbound shell 族候选、shared helper 复用、publication outcome 边界和 `R8.16` 写入边界。 |
| 当前状态 | completed |
| 当前允许 | 只思考 outbound envelope、schema version、payload boundary、publication outcome、body-free event shell 的来源、分组、shared helper 复用和停审条件。 |
| 当前禁止 | 不写具体 Outbound Event DTO 字段 schema、Rust struct / enum、JSON schema、event topic、publisher binding、outbox / relay、delivery receipt、function flow、状态矩阵、persistence、config 或 test。 |

### 2. 输入来源裁决

| 输入 | 当前裁决 | 用法 | 禁止继承 |
|---|---|---|---|
| `R1.30` Outbound Event 骨架总表 | 直接来源 | 34 个 Outbound Event 候选和八个事件族必须从该表承接。 | 不从旧 Step 8 或旧 `OutboxEvent` 恢复事件名。 |
| `R8.8` shared protocol helper | 复用来源 | metadata、fact source、public marker、operation / effect summary、safe publication outcome、entry restriction 可复用。 | 不把 shared helper 扩成领域事件字段全集。 |
| Step 6 `MethodAssetEventCandidateAssembly` | 对象来源 | outbound protocol 必须先承接 event candidate,再进入 publisher / worker surface。 | publisher 直接重读 current truth 拼 payload。 |
| Step 6 `MethodAssetPublisherBindingState` | binding 来源 | 只提供 publication boundary marker、availability、blocked / unavailable safe summary。 | topic、subscription、credential、transport binding 或 outbox 状态。 |
| Step 6 `MethodAssetEventPublisherEntry` | worker entry 来源 | worker 入口只交付 candidate ref、boundary marker、target refs 和 safe decision。 | delivery receipt、ack、retry、dead-letter、relay cursor。 |
| Step 6 `MethodAssetWorkerEntryResultState` | result 来源 | publisher accepted / blocked / degraded / unavailable 进入 body-free worker result state。 | broker response、subscriber body、raw error、transport receipt。 |
| Step 7 publisher / target registry port | port 来源 | publication outcome、target enabled / blocked / unavailable 必须来自正式 port / registry。 | service 现场合成 marker、从 config key / topic / HTTP status 反推业务结果。 |

当前结论:

- Outbound Event 协议族不直接表达 delivery mechanism,只表达已成立事实、派生材料状态、维护状态或外围组织变化的 body-free public surface。
- Event candidate 是 publication 前的正式候选壳,不是 outbox record、topic payload、delivery receipt 或 replay cursor。
- publication / handoff failure 只影响 safe outcome、diagnostic、hint 或 worker result,不得回滚 accepted truth。

### 3. 34 个候选事件分组

| 事件族 | 候选数量 | 来源组成部分 | Step 8 协议关注点 |
|---|---:|---|---|
| Core asset / catalog facts | 2 | 方法资产定义与目录 | definition / catalog fact changed 只能以 ref、summary、marker 和 trace context 输出。 |
| Formalization / version facts | 4 | 正式化与版本 | formalization decision、formal version established / changed / retired 必须保持 body-free。 |
| Consumption / boundary facts | 4 | 受控消费 | consumption material、availability、boundary、guard violation 不得携带材料正文或下游运行状态。 |
| Trace / impact / audit facts | 5 | 追溯与一致性保护 | trace、impact、protection、audit、evidence lineage 只输出 safe refs / markers。 |
| Relation / distribution facts | 5 | 关系与分发语义 | relation、integrity、distribution、availability、read material invalidation 不表达 marketplace transaction。 |
| External summary / ref facts | 5 | 外部摘要与引用 | external summary、source ref、artifact ref、body boundary violation、external lineage 全部 body-free。 |
| Maintenance / convergence facts | 5 | 后台维护与收敛 | maintenance request、read / trace refresh、recovery、progress changed 不携带 worker log 或 report body。 |
| Peripheral organization facts | 4 | 外围包与方法集组织 | package、method set、composition、peripheral view availability 只表达外围组织变化与派生可用性。 |

本轮 Step 8 只确认分组和协议壳边界。`R8.16` 才允许把这些分组写成 Outbound 来源表、shell family 表和停审记录;仍不得写字段 schema。

### 4. Outbound shell 族候选

| shell 族 | 责任 | 来源 | 当前边界 |
|---|---|---|---|
| outbound envelope shell | 包装 event family、schema/version、source fact、trace context 和 public marker 的协议外壳。 | `R1.30`;R8.8 metadata / marker helper。 | 不绑定 HTTP、RPC、topic、queue、partition、subscriber 或 transport。 |
| event family / schema version shell | 标识 34 个 event 所属 family、协议 schema version 和兼容性边界。 | `R1.30` 八族分组;R8.8 schema/version helper。 | 不展开 Rust enum、JSON schema、field set 或 compatibility algorithm。 |
| body-free fact payload shell | 表达已成立 fact / material / maintenance / peripheral change 的 ref、summary、marker、safe reason 和 trace context。 | Step 6 event candidate assembly;HLD 输出骨架。 | 不包含 raw body、definition body、artifact body、report body、raw log 或 provider payload。 |
| event candidate shell | 承接 application 组装出的 event candidate,用于进入 publisher port。 | `MethodAssetEventCandidateAssembly`。 | 不等同 delivery truth、outbox row、topic message 或 subscriber receipt。 |
| publication outcome shell | 表达 published / blocked / unavailable / failed 等 safe outcome。 | Step 7 `MethodAssetEventCandidatePublisherPort`;worker result state。 | 不从 HTTP status、broker ack、exception text 或 retry count 推断业务结果。 |
| blocked / unavailable / degraded publication shell | 表达 publisher / target / adapter 不可用或被阻断的 safe marker。 | publisher binding state;target registry;degraded decision helper。 | 不携带 secret、URL、topic、transport error body 或 raw diagnostic。 |
| worker publisher result shell | 表达 worker 本地 publisher entry 的 accepted、ignored、blocked、degraded、unavailable 结果。 | `MethodAssetEventPublisherEntry`;`MethodAssetWorkerEntryResultState`。 | 不保存 ack、offset、subscriber response、dead letter、relay cursor 或 retry state。 |

### 5. shared helper 复用规则

| helper | 复用方式 | 停审点 |
|---|---|---|
| metadata / actor / source helper | Outbound envelope 只能复制 operation context、fact source、trace context 或 worker entry context。 | 需要从 current truth 重读生成 payload 时暂停。 |
| schema / version helper | 只用于标识协议 schema 和 event family 版本边界。 | 需要写具体 schema 字段、兼容算法或迁移策略时暂停。 |
| public marker helper | availability、freshness、boundary、degraded、safe reason marker 必须来自正式对象或 port。 | marker 需要 service 现场合成时暂停。 |
| operation / effect summary helper | command / job / inbound accepted result 可作为 event candidate 的 fact summary 来源。 | effect summary 被扩展为事件正文或下游执行结果时暂停。 |
| safe publication outcome helper | publisher / target registry 输出的 safe outcome 可进入 public event / worker result shell。 | outcome 需要 topic、ack、retry、delivery receipt、dead letter 时暂停。 |
| entry restriction helper | worker entry 只承接 candidate 和 binding surface。 | worker 直接访问 repository、domain transition、external adapter raw payload 或 current truth 时暂停。 |

### 6. `R8.16` 写入边界

| `R8.16` 允许写入 | `R8.16` 禁止写入 |
|---|---|
| Outbound 输入来源裁决、34 个候选事件的八族分组、event shell family、shared helper 复用规则、publication outcome 边界和停审条件。 | 具体 Event DTO 字段 schema、Rust struct / enum、JSON schema、event topic、publisher binding 正文、outbox / relay、delivery receipt。 |
| event candidate、publisher binding、worker publisher entry、target registry 与 safe outcome 的承接关系。 | HTTP route、RPC name、transport code、retry / dead letter、subscriber ack、function flow、state matrix、persistence schema、config key、test case schema。 |
| 旧污染过滤:旧 `OutboxEvent`、fingerprint changed、snapshot publish、content package publish、L0-bus 均不得进入。 | 从旧 Step 8 completed 状态复制旧协议表或 P0/P1 API 层级。 |

### 7. 停审条件

| 条件 | 处理 |
|---|---|
| Event 名称、来源事实或事件族无法回指 `R1.30` | 暂停,不得新增事件。 |
| Outbound event 需要 topic、payload schema、outbox table、relay、delivery receipt、ack、retry 或 dead-letter | 暂停,这些不属于当前协议壳闭口。 |
| Publisher 需要重读 current truth 来组装 payload | 暂停,违反 event candidate 来源规则。 |
| Payload 需要 raw body、definition body、external body、artifact body、report body、raw log 或 provider payload | 暂停,违反 body-free 边界。 |
| Publication outcome 需要 transport status、broker error body、subscriber response 或 retry count | 暂停,不得把 transport result 当 public protocol truth。 |
| blocked / degraded / unavailable marker 没有正式对象、port 或 mapper 来源 | 暂停,不得由 service 合成。 |
| worker publisher entry 需要直连 repository、domain transition、external adapter 或 config secret | 暂停,违反 entry restriction。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否完成 Outbound 来源裁决 | 是。 |
| 是否确认 `R1.30` 34 个候选和八族分组 | 是。 |
| 是否识别 outbound shell family | 是。 |
| 是否承接 Step 6 event candidate / publisher binding / worker publisher entry | 是。 |
| 是否承接 Step 7 publisher / target registry / safe outcome | 是。 |
| 是否形成 `R8.16` 写入边界 | 是。 |
| 是否写具体 Outbound DTO 字段 schema / topic / outbox / delivery receipt | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.16`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.16 Outbound event protocol family:再写入`;只允许写入 Outbound 来源裁决、34 个候选事件八族分组、outbound envelope / event family schema version / body-free fact payload / event candidate / publication outcome / blocked degraded unavailable / worker publisher result shell 族候选、shared helper 复用规则、停审条件和 `R8.17` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Outbound Event DTO 字段 schema、HTTP route、RPC name、event topic、publisher binding、outbox/relay、delivery receipt、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.17`、Step 9 或后续 Step。

## R8.16 Outbound event protocol family:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.16 Outbound event protocol family:再写入`。 |
| 本模块目标 | 固化 Outbound 来源裁决、34 个候选事件八族分组、outbound envelope / event family schema version / body-free fact payload / event candidate / publication outcome / blocked degraded unavailable / worker publisher result shell 族候选、shared helper 复用规则、停审条件和 `R8.17` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | Outbound 来源表、34 个候选事件分组矩阵、Outbound shell family、publication outcome 来源规则、旧污染过滤和 `R8.17` 进入门禁。 |
| 禁止范围 | 不写具体 Outbound Event DTO 字段 schema、Rust struct / enum、JSON schema、event topic、publisher binding 正文、outbox / relay、delivery receipt、function flow、state matrix、persistence、config、test 或正式 `03-详细设计.md`。 |

### 2. Outbound 来源裁决

| 来源轴 | 固化结论 | 后续承接 | 禁入项 |
|---|---|---|---|
| HLD event inventory | `R1.30` 的 34 个 Outbound Event 是唯一正向事件候选池。 | `R8.16` 只做协议壳分组;Step 9 再定义具体 flow。 | 旧 `OutboxEvent`、fingerprint changed、snapshot publish、content package publish、L0-bus。 |
| Event source fact | 事件必须来自 accepted command、accepted inbound intake、completed operations job 或已成立派生材料状态。 | 通过 event candidate / operation effect summary 承接。 | publisher 现场重读 current truth 补 payload。 |
| Body-free output | 事件输出只允许 typed refs、summary refs、marker、safe reason、lineage / trace context。 | 通过 body-free fact payload shell 承接。 | raw body、definition body、artifact body、report body、external provider payload、raw log。 |
| Publication boundary | publication 是 candidate handoff surface,不是 delivery truth。 | 通过 publisher port / target registry / worker result shell 承接。 | topic、queue、outbox table、relay、ack、retry、dead-letter、delivery receipt。 |
| Failure / degraded surface | blocked / unavailable / degraded marker 必须来自正式 binding、registry、port 或 mapper。 | 通过 safe publication outcome 和 worker result state 承接。 | 从 HTTP status、broker error、exception text、config key 或 topic 字符串推断。 |

### 3. 34 个候选事件八族分组

| 事件族 | 数量 | 候选 Event | 协议壳裁决 |
|---|---:|---|---|
| Core asset / catalog facts | 2 | `MethodAssetDefinitionChanged`;`MethodAssetCatalogEntryChanged` | 只表达 definition / catalog fact changed,不得携带定义正文、搜索索引或投递策略。 |
| Formalization / version facts | 4 | `MethodAssetFormalizationDecisionChanged`;`FormalMethodAssetVersionEstablished`;`FormalMethodAssetVersionChanged`;`FormalMethodAssetVersionRetired` | 只表达 formalization / version fact,不得携带审批过程、完整算法、topic 或 payload schema。 |
| Consumption / boundary facts | 4 | `MethodAssetConsumptionMaterialPrepared`;`MethodAssetConsumptionAvailabilityChanged`;`DownstreamConsumptionBoundaryChanged`;`DefinitionUseBoundaryViolationNoticed` | 只表达消费材料、可用性、边界或越界 fact,不得携带材料正文、下游 payload 或运行状态。 |
| Trace / impact / audit facts | 5 | `MethodAssetTraceMaterialChanged`;`ConsumptionImpactSummaryChanged`;`ConsistencyProtectionDecisionChanged`;`MethodAssetAuditTrailChanged`;`MethodAssetEvidenceLineageChanged` | 只表达 trace / impact / protection / audit / lineage safe refs,不得携带 raw audit log、evidence body 或 report body。 |
| Relation / distribution facts | 5 | `MethodAssetRelationChanged`;`MethodAssetRelationIntegrityChanged`;`MethodAssetDistributionRefChanged`;`MethodAssetDistributionAvailabilityChanged`;`MethodAssetRelationReadMaterialInvalidated` | 只表达关系、完整性、分发 ref、可用性和失效线索,不得携带 marketplace transaction 或 graph algorithm body。 |
| External summary / ref facts | 5 | `ExternalSourceSummaryChanged`;`ExternalSourceRefChanged`;`ArtifactArchiveRefChanged`;`ExternalBodyBoundaryViolationNoticed`;`ExternalEvidenceLineageChanged` | 只表达 external summary / source / artifact / boundary / lineage body-free fact,不得携带 URL secret、provider response 或 archive content。 |
| Maintenance / convergence facts | 5 | `MethodAssetMaintenanceRequested`;`MethodAssetReadMaterialRefreshChanged`;`MethodAssetTraceMaterialRefreshChanged`;`MethodAssetConsistencyRecoveryChanged`;`MethodAssetMaintenanceProgressChanged` | 只表达维护请求、刷新、恢复和进度变化,不得携带 worker log、scheduler、retry、metric body 或 report body。 |
| Peripheral organization facts | 4 | `MethodPackageChanged`;`MethodSetAssemblyChanged`;`PackageCompositionResultChanged`;`PeripheralViewAvailabilityChanged` | 只表达 package / method set / composition / peripheral view 状态变化,不得携带 listing、交易、安装、UI / SDK runtime 状态。 |

数量闭口: `2 + 4 + 4 + 5 + 5 + 5 + 5 + 4 = 34`。若后续发现新增事件诉求,必须回到 HLD / Step 8 输入来源重新闭口,不得在 function flow 或 implementation 中临时新增。

### 4. Outbound shell family 固化

| shell family | 责任 | 输入来源 | 输出边界 | 后续承接 |
|---|---|---|---|---|
| outbound envelope shell | 承载 event family、schema/version、source fact、trace context 和 public marker 的公共协议壳。 | `R1.30`;R8.8 metadata / schema / marker helper。 | 不绑定 transport、topic、queue、subscriber 或 delivery mechanism。 | Step 9 event publication flow;Step 12 publication error;Step 15 observability。 |
| event family schema version shell | 标识 34 个 event 所属 family 和协议版本边界。 | HLD 八族分组;shared schema/version helper。 | 不写 enum / JSON schema / compatibility algorithm。 | Step 14 config / adapter binding;Step 17 implementation handoff。 |
| body-free fact payload shell | 表达 fact / material / maintenance / peripheral change 的 refs、summary、marker、reason、trace。 | event candidate assembly;operation / effect summary;lineage refs。 | 不保存正文、包体、raw log、provider payload 或 report body。 | Step 9 flow;Step 11 persistence;Step 16 tests。 |
| event candidate shell | 承接 application 组装出的 publication candidate。 | `MethodAssetEventCandidateAssembly`。 | 不等同 outbox row、delivery message、topic payload 或 replay cursor。 | publisher port;worker publisher entry;safe outcome。 |
| publication outcome shell | 表达 published / blocked / unavailable / failed 的 safe outcome。 | `MethodAssetEventCandidatePublisherPort`;target registry;publisher binding state。 | 不携带 ack、retry、delivery receipt、transport body 或 subscriber response。 | Step 12 error recovery;Step 15 observability。 |
| blocked / degraded / unavailable publication shell | 表达 publisher、target、adapter 或 marker 缺失造成的 safe surface。 | publisher binding state;target registry;degraded mapper / safe diagnostic。 | 不从 exception text、HTTP status、broker error 或 config key 合成 marker。 | Step 12 degraded / unavailable mapping。 |
| worker publisher result shell | 表达 worker publisher entry 的 terminal safe result。 | `MethodAssetEventPublisherEntry`;`MethodAssetWorkerEntryResultState`。 | 不保存 offset、lease、dead letter、relay cursor、retry count 或 runner lifecycle。 | Step 13 idempotency;Step 15 worker observability。 |

### 5. publication outcome 来源规则

| outcome 类别 | 允许来源 | 协议表达 | 禁止事项 |
|---|---|---|---|
| published | publisher port 返回的 safe publication summary 或 publication ref。 | 只表达 candidate 已通过 publication boundary。 | 不声明 subscriber 已收到、ack 已提交或下游状态已改变。 |
| blocked | target registry、publisher binding 或 boundary decision 输出的 blocked marker。 | 只表达当前 candidate 不允许交付给目标接缝。 | 不从配置缺失、topic 名或异常字符串现场分类。 |
| unavailable | adapter availability / binding state / registry unavailable summary。 | 只表达 publisher / target 当前不可用。 | 不记录 raw transport error、credential、URL 或 provider body。 |
| failed | publisher port 输出的 safe failure summary。 | 只表达 publication attempt 的安全失败面。 | 不携带 broker response body、HTTP response body、retry count 或 dead letter id。 |
| degraded | degraded mapper / safe diagnostic 给出的 degraded marker。 | 只表达 surface 降级,不改写原 fact。 | 不用服务侧合成 marker 或把 degraded 当业务 rejection。 |

### 6. shared helper 复用规则

| helper | Outbound 复用规则 | 退出条件 |
|---|---|---|
| metadata / actor / source | 只能复制 operation context、fact source、worker entry context、trace / lineage context。 | 需要读取 actor profile、runtime user、transport principal 时停审。 |
| schema / version | 只表达 event family 和 public protocol version。 | 需要定义字段 schema、兼容策略、migration plan 时停审。 |
| public marker | availability、freshness、boundary、degraded、safe reason 均复制正式来源。 | marker 无正式来源或需要根据字符串推断时停审。 |
| effect / operation summary | accepted command、inbound 或 job 的 body-free summary 可以形成 candidate 来源。 | summary 被扩展成正文、payload 或下游执行结果时停审。 |
| page / receipt / report | 当前 Outbound 不复用 query page、inbound receipt 或 job report 正文。 | 事件需要携带 report body、receipt body 或 page body 时停审。 |
| entry restriction | worker publisher entry 只承接 candidate、binding、target refs 和 safe decision。 | worker 需要 repository、domain transition、external adapter raw body 或 config secret 时停审。 |

### 7. 旧污染过滤

| 旧材料 / 旧主线 | 当前裁决 | 理由 |
|---|---|---|
| `OutboxEvent` | exclude | 当前 Outbound 只定义协议壳和 candidate boundary,不恢复 outbox 实现模型。 |
| event topic / L0-bus | exclude | transport routing 后移,且不能反推协议 truth。 |
| snapshot publish / content package publish | exclude | 旧 publish 主线已失效;package / assembly 只作为 peripheral organization fact。 |
| fingerprint changed | exclude | fingerprint 旧主线不作为本轮 detail design 正向来源。 |
| P0/P1 HTTP JSON API | exclude | 当前不定义 HTTP route、RPC name、status code 或 JSON field schema。 |
| delivery receipt / subscriber ack | exclude | delivery 结果不是本仓 Outbound public fact。 |

### 8. `R8.17` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.17 Operations job protocol family:先思考`,思考 job input/output/report、checkpoint/progress、partial / duplicate / failed / blocked surface 的来源、分组、shared helper 复用和停审条件。 |
| 当前禁止 | 不写 Operations Job DTO 字段 schema、Rust struct / enum、JSON schema、job trigger、scheduler、queue、worker lifecycle、retry / lease、function flow、状态矩阵、persistence、config 或 test。 |
| 必须使用 | `R1.32` Operations Job 总表、R8.8 shared helper、Step 6 job assembly / maintenance task / progress / history / worker result objects、Step 7 maintenance repository / progress view / run history / checkpoint / planner / adapter availability ports。 |

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Outbound 来源裁决 | 是。 |
| 是否写入 34 个候选事件八族分组 | 是。 |
| 是否写入 Outbound shell family | 是。 |
| 是否写入 publication outcome 来源规则 | 是。 |
| 是否写入 shared helper 复用规则 | 是。 |
| 是否写入旧污染过滤 | 是。 |
| 是否形成 `R8.17` 进入门禁 | 是。 |
| 是否写具体 Outbound DTO 字段 schema / topic / outbox / delivery receipt | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.17`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.17 Operations job protocol family:先思考`;只允许思考 job input/output/report、checkpoint/progress、partial / duplicate / failed / blocked surface 的来源、分组、shared helper 复用和停审条件;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Operations Job DTO 字段 schema、HTTP route、RPC name、job trigger、scheduler、queue、worker lifecycle、retry/lease、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.18`、Step 9 或后续 Step。

## R8.17 Operations job protocol family:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.17 Operations job protocol family:先思考`。 |
| 本模块目标 | 思考 Operations Job 协议族的来源裁决、8 个候选 job 分组、job input/output/report shell 族候选、checkpoint / progress / partial / duplicate / failed / blocked surface、shared helper 复用和 `R8.18` 写入边界。 |
| 当前状态 | completed |
| 当前允许 | 只思考 job input/output/report、checkpoint/progress、partial / duplicate / failed / blocked surface 的来源、分组、shared helper 复用和停审条件。 |
| 当前禁止 | 不写具体 Operations Job DTO 字段 schema、Rust struct / enum、JSON schema、job trigger、scheduler、queue、worker lifecycle、retry / lease、function flow、状态矩阵、persistence、config 或 test。 |

### 2. 输入来源裁决

| 输入 | 当前裁决 | 用法 | 禁止继承 |
|---|---|---|---|
| `R1.32` Operations Job 骨架总表 | 直接来源 | 8 个 Operations Job 候选必须从该表承接,且全部归后台维护与收敛。 | 不从旧 seed / replay outbox / rebuild index / recalculate fingerprint / snapshot export 恢复 job。 |
| `R8.8` shared protocol helper | 复用来源 | metadata、actor/source、idempotency、stored result、page/cursor、safe marker、rejection/degraded、receipt/report shell 可复用。 | 不把 shared helper 扩成 job DTO 字段全集或 scheduler schema。 |
| Step 6 `MethodAssetJobAssemblyContext` | application 来源 | application job service 用它承接 maintenance run、task refs、scope、cursor/page、safe result、progress hint 和 degraded decision。 | job assembly 直接保存 scheduler / queue / retry / worker state。 |
| Step 6 jobs entry objects | entry 来源 | runner context、operation job entry、progress assembly、job entry result state 只表达本地入口和 safe result。 | jobs entry 直连 repository、domain transition、adapter、scheduler product 或 report body store。 |
| Step 7 maintenance / runtime family | port 来源 | task repository、progress view、run history、target planner、checkpoint store、recovery issue、runtime assembly、adapter availability 是正式接缝。 | service 现场生成 checkpoint、target batch、availability marker 或 degraded marker。 |
| HLD no core truth repair 规则 | 硬边界 | job 只刷新派生材料、追溯材料、外围读取材料和恢复收敛状态。 | job 创建、修改、删除或修复 definition、formal version、relation、external summary、package / method set truth。 |

当前结论:

- Operations Job 不是业务 Command,也不是 Query 读路径的附带刷新;它只基于已持久化事实执行维护、派生材料刷新、trace / audit / impact 刷新和一致性恢复收敛。
- 8 个 Job 统一归 `后台维护与收敛`,其他组成部分只提供 truth / material / refs / view 来源,不得重复定义本地 job owner。
- Job duplicate / resume 必须走 stored result、checkpoint、progress 或 run history surface,不得重跑 mutation 或依赖 queue offset / retry count。

### 3. 8 个候选 Job 分组

| job 族 | 候选 Job | 来源任务对象 | Step 8 协议关注点 |
|---|---|---|---|
| catalog / definition read material refresh | `RefreshCatalogAndDefinitionReadMaterials` | `ReadMaterialRefreshTask`;`MaintenanceRunRef`;`RefreshScopeRef` | 输入必须是 definition / catalog truth refs 和 target material refs;输出只为 refresh summary、freshness、progress。 |
| formal version read material refresh | `RefreshFormalVersionReadMaterials` | `ReadMaterialRefreshTask`;formal version refs;target view/material refs | 不重做 formalization,不改变 version truth 或 basis summary。 |
| consumption read material refresh | `RefreshConsumptionReadMaterials` | `ReadMaterialRefreshTask`;consumption material refs;availability view refs | 不重新裁决消费边界,不扩大授权,不扫描下游运行状态。 |
| relation / distribution read material refresh | `RefreshRelationDistributionMaterials` | `ReadMaterialRefreshTask`;relation refs;distribution refs | 不创建或修改 relation truth,不执行 graph traversal、recommendation、search ranking。 |
| external summary read material refresh | `RefreshExternalSummaryReadMaterials` | `ReadMaterialRefreshTask`;external summary / ref / artifact refs | 只做 body-free 复核和 freshness / validity marker,不复制外部正文或 provider payload。 |
| trace / audit / impact material refresh | `RefreshTraceAuditImpactMaterials` | `TraceMaterialRefreshTask`;trace subject refs;audit / evidence / impact refs | 不保存 raw log、证据正文、artifact 包体、archive content 或 report body。 |
| consistency recovery convergence | `RunConsistencyRecoveryConvergence` | `ConsistencyRecoveryTask`;recovery scope;related material refs | 只推进 recovery convergence summary,不自动修复 core truth 或绕过正式介入。 |
| peripheral read material refresh | `RefreshPeripheralReadMaterials` | `ReadMaterialRefreshTask`;package / method set refs;peripheral view refs | 不进入 marketplace 交易、安装、履约,不让外围不可用影响核心闭环成立。 |

本轮 Step 8 只确认 Operations Job 协议壳、输入输出边界和停审条件。`R8.18` 才允许写成 Job 来源表和 shell family 表;仍不得写字段 schema、flow 或 persistence。

### 4. Operations Job shell 族候选

| shell 族 | 责任 | 来源 | 当前边界 |
|---|---|---|---|
| job input envelope shell | 承接 job family、run、scope、task refs、target refs、operation context 和 safe execution boundary。 | `R1.32`;Step 6 `MethodAssetOperationJobEntry`;R8.8 metadata / idempotency helper。 | 不包含 scheduler、queue、cron、retry、lease、thread lifecycle 或 worker product。 |
| job dispatch / entry shell | 表达 jobs entry 把 job input shell 交给 application job facade。 | Step 6 `MethodAssetJobRunnerContext`;`MethodAssetOperationJobEntry`;Step 7 entry restriction。 | 不直连 repository、domain transition、concrete adapter 或 config secret。 |
| job result shell | 表达 completed / partial / blocked / failed / degraded / unavailable / replayed safe result。 | Step 6 `MethodAssetJobEntryResultState`;stored operation result helper。 | 不等同 process exit code、scheduler status、queue status 或 OS signal。 |
| progress / checkpoint shell | 表达 progress view、checkpoint、cursor continuation、partial continuation anchor。 | Step 6 `MethodAssetJobProgressAssemblyState`;Step 7 checkpoint store / progress view repository。 | checkpoint 不得由 retry count、queue offset、lease token、timestamp 或 private map 代替。 |
| report / handoff boundary shell | 表达 body-free report boundary、handoff hint、observability ref。 | Step 6 progress/result state;Step 7 run history / handoff port。 | 不保存 report body、markdown、metrics payload、artifact body 或 external receipt body。 |
| partial / degraded / unavailable shell | 表达 partial failure、degraded decision、adapter unavailable、runtime blocked。 | Step 7 adapter availability、degraded mapper、runtime assembly registry、safe diagnostic。 | 不从 raw IO error、stack trace、SQL/HTTP detail 或 exception text 分类。 |
| duplicate / replay shell | 表达 duplicate job request 或 resume replay 的 stored surface。 | R8.8 stored result helper;Step 7 stored result / checkpoint / run history 接缝。 | duplicate 不重跑 job body,不重算 material,不扫描 queue。 |

### 5. shared helper 复用规则

| helper | 复用方式 | 停审点 |
|---|---|---|
| metadata / actor / source helper | job envelope 复制 operation context、system actor、run context 和 source refs。 | 需要从 scheduler principal、OS user 或 queue consumer id 推导业务 actor 时暂停。 |
| idempotency / stored result helper | duplicate / replay 必须从 stored result、run history 或 checkpoint surface 承接。 | duplicate 需要重跑 job body、重建 material 或扫描队列时暂停。 |
| page / cursor helper | batch/page/cursor 只以 typed ref 和 opaque cursor 表达。 | cursor 被当 optimistic version、DB key、cache key、queue offset 或 retry token 时暂停。 |
| checkpoint / progress helper | checkpoint、progress、partial continuation 必须来自正式 progress / checkpoint 接缝。 | checkpoint 只能从 private map、timestamp、retry count 或 worker state 恢复时暂停。 |
| public marker / degraded helper | blocked / failed / degraded / unavailable marker 必须复制正式 mapper、availability 或 safe diagnostic 输出。 | service 需要根据异常文本、raw IO、SQL/HTTP detail 合成 marker 时暂停。 |
| report / receipt shell helper | job report / handoff 只输出 body-free boundary ref、hint 或 summary。 | 需要写 report body、artifact body、metrics body、external response body 时暂停。 |

### 6. `R8.18` 写入边界

| `R8.18` 允许写入 | `R8.18` 禁止写入 |
|---|---|
| Operations Job 输入来源裁决、8 个候选 job 分组、job input / dispatch / result / progress / checkpoint / report boundary / partial degraded unavailable / duplicate replay shell 族候选。 | 具体 Job DTO 字段 schema、Rust struct / enum、JSON schema、job trigger、scheduler、queue、worker lifecycle、retry、lease、lock。 |
| Step 6 job assembly / jobs entry / progress / result 对象和 Step 7 maintenance / runtime port 的承接规则。 | function flow、batch loop、page loop、checkpoint update 顺序、state matrix、persistence schema、config key、test case schema。 |
| no core truth repair、body-free report、entry restriction、checkpoint source、stored result replay 等停审条件和 `R8.19` 进入门禁。 | 旧 seed / replay outbox / rebuild index / recalculate fingerprint / snapshot export job。 |

### 7. 停审条件

| 条件 | 处理 |
|---|---|
| Job 名称或任务边界无法回指 `R1.32` | 暂停,不得新增 Job。 |
| Job 需要创建、修改、删除或修复 core truth | 暂停,违反 no core truth repair。 |
| Job input 需要 worker id、queue id、cron 名、retry token、lease token、free-form scope 或 cache key | 暂停,必须使用 typed task / run / scope / target refs。 |
| Job output 需要 raw diagnostic、report body、artifact body、external body、metrics body、raw log 或 downstream runtime state | 暂停,违反 body-free output。 |
| checkpoint / progress / cursor / partial continuation 没有正式 port 或 object 来源 | 暂停,不得由 fake runtime / service private map 补。 |
| duplicate / replay 需要重跑 job body 或重建 material | 暂停,必须走 stored result / checkpoint / run history surface。 |
| blocked / degraded / unavailable marker 需要从 exception text、HTTP / SQL detail、scheduler state 或 queue status 推导 | 暂停,不得 service 合成。 |
| jobs entry 需要直连 repository、domain transition、publisher / handoff adapter、runtime builder internals 或 config secret | 暂停,违反 entry restriction。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否完成 Operations Job 来源裁决 | 是。 |
| 是否确认 `R1.32` 8 个候选和统一归属 | 是。 |
| 是否识别 job shell family | 是。 |
| 是否承接 Step 6 job assembly / jobs entry / progress / result objects | 是。 |
| 是否承接 Step 7 maintenance / runtime / checkpoint / availability ports | 是。 |
| 是否形成 `R8.18` 写入边界 | 是。 |
| 是否写具体 Operations Job DTO 字段 schema / scheduler / queue / retry | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.18`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.18 Operations job protocol family:再写入`;只允许写入 Operations Job 来源裁决、8 个候选 job 分组、job input / dispatch / result / progress / checkpoint / report boundary / partial degraded unavailable / duplicate replay shell 族候选、shared helper 复用规则、停审条件和 `R8.19` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 Operations Job DTO 字段 schema、HTTP route、RPC name、job trigger、scheduler、queue、worker lifecycle、retry/lease、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.19`、Step 9 或后续 Step。

## R8.18 Operations job protocol family:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.18 Operations job protocol family:再写入`。 |
| 本模块目标 | 固化 Operations Job 来源裁决、8 个候选 job 分组、job input / dispatch / result / progress / checkpoint / report boundary / partial degraded unavailable / duplicate replay shell 族候选、shared helper 复用规则、停审条件和 `R8.19` 进入门禁。 |
| 当前状态 | completed |
| 当前产物 | Operations Job 来源表、8 个候选 job 分组矩阵、Job shell family、checkpoint / progress / duplicate replay 来源规则、旧污染过滤和 `R8.19` 进入门禁。 |
| 禁止范围 | 不写具体 Operations Job DTO 字段 schema、Rust struct / enum、JSON schema、job trigger、scheduler、queue、worker lifecycle、retry / lease、function flow、state matrix、persistence、config、test 或正式 `03-详细设计.md`。 |

### 2. Operations Job 来源裁决

| 来源轴 | 固化结论 | 后续承接 | 禁入项 |
|---|---|---|---|
| HLD job inventory | `R1.32` 的 8 个 Operations Job 是唯一正向 job 候选池。 | `R8.18` 只做协议壳分组;Step 9 再定义具体 job flow。 | 旧 seed、replay outbox、rebuild index、recalculate fingerprint、snapshot export。 |
| Job owner | 8 个 Job 全部归 `后台维护与收敛`。 | 业务组成部分只提供 truth refs、material refs、view refs 或刷新线索。 | 在 definition、formalization、consumption、relation、external、peripheral 组件内重复定义 job owner。 |
| Job input | 输入必须来自 maintenance run、refresh / recovery scope、task refs、target refs、operation context、checkpoint / cursor refs。 | 通过 job input envelope shell 和 job dispatch shell 承接。 | worker id、queue id、cron 名、retry token、lease token、free-form scope、cache key。 |
| Job output | 输出只允许 refresh / recovery summary、freshness marker、progress marker、partial / converged marker、safe issue refs。 | 通过 job result、progress / checkpoint、report boundary shell 承接。 | raw diagnostic、external body、artifact body、report body、metrics body、raw log、downstream runtime state。 |
| Job execution boundary | Job 只刷新派生材料、追溯材料、外围读取材料并推进一致性恢复收敛。 | Step 9 job flow 必须经 application job facade 和 Step 7 maintenance / runtime ports。 | 创建、修改、删除或修复 core truth;重做 formalization;绕过 consumption boundary。 |
| Replay / resume | duplicate / resume 必须走 stored result、checkpoint、progress 或 run history surface。 | Step 13 idempotency / replay 和 Step 11 checkpoint persistence 承接。 | 重跑 job body、重建 material、扫描 queue、读取 scheduler state。 |

### 3. 8 个候选 Job 分组矩阵

| Job | Job 族 | 主要组成部分 | 输入协议壳重点 | 输出协议壳重点 | 边界 |
|---|---|---|---|---|---|
| `RefreshCatalogAndDefinitionReadMaterials` | catalog / definition read material refresh | 后台维护与收敛 | run / scope refs、definition / catalog truth refs、target material refs。 | refresh result summary、material freshness refs、progress marker。 | 不修改 definition truth、catalog truth 或 history truth;不写 cache / index / store 实现。 |
| `RefreshFormalVersionReadMaterials` | formal version read material refresh | 后台维护与收敛 | run / scope refs、formal version refs、target view / material refs。 | refresh result summary、freshness refs、progress marker。 | 不改变 formalization result、version truth、basis summary 或状态迁移。 |
| `RefreshConsumptionReadMaterials` | consumption read material refresh | 后台维护与收敛 | run / scope refs、consumption material refs、availability view refs。 | consumption refresh summary、availability freshness markers。 | 不重新裁决消费边界,不扩大授权,不扫描下游运行状态。 |
| `RefreshRelationDistributionMaterials` | relation / distribution read material refresh | 后台维护与收敛 | run / scope refs、relation refs、distribution refs、read material refs。 | relation / distribution refresh summary、staleness cleared marker。 | 不创建或修改 relation truth,不执行图遍历、推荐或搜索排序。 |
| `RefreshExternalSummaryReadMaterials` | external summary read material refresh | 后台维护与收敛 | run / scope refs、external summary / ref / artifact refs。 | external summary refresh result、validity / freshness markers。 | 不复制外部正文,不代理外部 API,不拥有 external source lifecycle。 |
| `RefreshTraceAuditImpactMaterials` | trace / audit / impact material refresh | 后台维护与收敛 | run / scope refs、trace subject refs、audit / evidence / impact refs。 | trace refresh result、partial / converged markers。 | 不保存 raw log、证据正文、artifact 包体、archive 内容或 report body。 |
| `RunConsistencyRecoveryConvergence` | consistency recovery convergence | 后台维护与收敛 | run ref、recovery task ref、recovery scope、related material refs。 | recovery convergence summary、converged / suspended / rejected marker。 | 不自动修复 core truth,不重做正式化,不绕过消费边界,不复制外部正文。 |
| `RefreshPeripheralReadMaterials` | peripheral read material refresh | 后台维护与收敛 | run / scope refs、package / method set refs、peripheral view refs。 | peripheral refresh summary、availability markers。 | 不让外围不可用影响核心闭环成立,不进入 marketplace 交易、安装或履约。 |

数量闭口: `8` 个 Operations Job,全部来自 `R1.32`。后续若出现新 job 诉求,必须回到概要接口来源和 Step 8 当前模块重新闭口。

### 4. Job shell family 固化

| shell family | 责任 | 输入来源 | 输出边界 | 后续承接 |
|---|---|---|---|---|
| job input envelope shell | 承载 job family、run、scope、task refs、target refs、operation context 和 safe execution boundary。 | `R1.32`;Step 6 `MethodAssetOperationJobEntry`;R8.8 metadata / idempotency helper。 | 不包含 scheduler、queue、cron、retry、lease、thread lifecycle 或 worker product。 | Step 9 job flow;Step 14 job profile / runtime binding。 |
| job dispatch / entry shell | 表达 jobs entry 将 job input shell 转交 application job facade。 | Step 6 `MethodAssetJobRunnerContext`;`MethodAssetOperationJobEntry`;Step 7 entry restriction。 | 不直连 repository、domain transition、concrete adapter、runtime builder internals 或 config secret。 | Step 9 entry flow;Step 16 no shortcut tests。 |
| job result shell | 表达 completed / partial / blocked / failed / degraded / unavailable / replayed 的 safe result。 | Step 6 `MethodAssetJobEntryResultState`;R8.8 stored result helper。 | 不等同 process exit code、scheduler status、queue status、OS signal 或 transport result。 | Step 12 error recovery;Step 13 replay;Step 15 observability。 |
| progress / checkpoint shell | 表达 progress view、checkpoint、cursor continuation、partial continuation anchor。 | Step 6 `MethodAssetJobProgressAssemblyState`;Step 7 progress view repository / checkpoint store。 | checkpoint 不得由 retry count、queue offset、lease token、timestamp、DB key 或 private map 代替。 | Step 11 persistence;Step 13 checkpoint resume。 |
| report / handoff boundary shell | 表达 body-free report boundary、handoff hint、observability ref 和 run history linkage。 | Step 6 progress / result state;Step 7 run history / handoff port。 | 不保存 report body、markdown、metrics payload、artifact body、archive body 或 external receipt body。 | Step 15 observability;Step 17 handoff。 |
| partial / degraded / unavailable shell | 表达 partial failure、degraded decision、adapter unavailable、runtime blocked。 | Step 7 adapter availability、runtime assembly registry、degraded mapper、safe diagnostic。 | 不从 raw IO error、stack trace、SQL / HTTP detail、scheduler state 或 queue status 分类。 | Step 12 degraded / unavailable mapping。 |
| duplicate / replay shell | 表达 duplicate job request、stored result replay 或 resume replay。 | R8.8 stored result helper;Step 7 checkpoint store / run history / stored result seam。 | duplicate 不重跑 job body、不重算 material、不扫描 queue。 | Step 13 idempotency / replay;Step 16 replay tests。 |

### 5. checkpoint / progress / duplicate 来源规则

| 规则 | 正式来源 | 协议表达 | 停审点 |
|---|---|---|---|
| checkpoint 来源 | `MethodAssetJobCheckpointStorePort`、progress output、run history summary。 | checkpoint ref、cursor continuation、partial continuation anchor。 | 需要 retry count、queue offset、lease token、timestamp 或 private map 时暂停。 |
| progress 来源 | `MethodAssetMaintenanceProgressViewRepository`、application job orchestration output。 | progress view ref、progress marker、partial failure refs。 | 需要 metrics body、worker log、scheduler state 或 process status 时暂停。 |
| run history 来源 | `MethodAssetMaintenanceRunHistoryRepository`。 | run chronology summary、report / handoff linkage refs。 | 需要 report markdown、raw log、external receipt body 时暂停。 |
| target batch 来源 | `MethodAssetRefreshTargetPlannerPort`。 | target batch ref、committed snapshot summary、source cursor hint。 | service 现场扫描 truth / material 或 planner 保存 refreshed material 时暂停。 |
| duplicate replay 来源 | stored operation result、checkpoint、run history。 | replayed result shell 或 resume-safe shell。 | duplicate 需要重跑 job body或重建材料时暂停。 |
| blocked / unavailable 来源 | runtime assembly registry、adapter availability、safe diagnostic。 | blocked / unavailable marker、safe diagnostic refs。 | 从 raw IO、SQL/HTTP detail、scheduler queue state 分类时暂停。 |

### 6. shared helper 复用规则

| helper | Job 复用规则 | 退出条件 |
|---|---|---|
| metadata / actor / source | 只复制 operation context、system actor、run context 和 source refs。 | 需要 scheduler principal、OS user、queue consumer id 作为业务 actor 时停审。 |
| idempotency / stored result | job duplicate、replay、resume 均回指 stored result / checkpoint / run history。 | 需要重跑 job body、重建 material、扫描 queue 时停审。 |
| page / cursor | batch、page、cursor 只以 typed refs 和 opaque cursor 表达。 | cursor 替代 optimistic version、DB key、cache key、queue offset 或 retry token 时停审。 |
| public marker / degraded | blocked、failed、degraded、unavailable marker 均复制正式 mapper / availability / safe diagnostic。 | service 根据异常文本、SQL/HTTP detail、raw IO 合成 marker 时停审。 |
| report / receipt | Job 只复用 body-free report boundary / handoff hint / summary ref。 | 需要 report body、artifact body、metrics body、external response body 时停审。 |
| entry restriction | jobs entry 只调用 application job facade 和 entry-visible runtime summary。 | jobs entry 直连 repository、domain transition、adapter、scheduler、queue 或 config secret 时停审。 |

### 7. 旧污染过滤

| 旧材料 / 旧主线 | 当前裁决 | 理由 |
|---|---|---|
| `SeedInitialMethodAssets` | exclude | 本轮不通过 job seed 初始化业务 truth。 |
| `ReplayDefinitionEvents` / outbox replay | exclude | Outbound 不恢复 outbox / relay,job 不扫描队列或重放 event payload。 |
| `RebuildDefinitionIndex` | exclude_as_old_name | 当前只有 read material refresh,不以 index product / storage implementation 命名。 |
| `RecalculateFingerprint` | exclude | fingerprint 旧主线不作为本轮维护来源。 |
| `ExportAllSnapshots` | exclude | snapshot / export 不属于当前 L3-method-library job truth。 |
| `DetectDefinitionDrift` | exclude | drift 检测旧口径不作为当前 recovery convergence 来源。 |
| Generic scheduler / worker loop | exclude | scheduler、queue、lease、runner lifecycle 属实现机制,不是 Step 8 public protocol。 |
| TruthRepairJob | exclude | 维护不能成为第二业务写面。 |

### 8. `R8.19` 进入门禁

| 项 | 门禁 |
|---|---|
| 当前允许 | 下一步只进入 `R8.19 Protocol-to-object / port closure:先思考`,思考 Command / Query / Inbound / Outbound / Job protocol shell 到 Step 6 object、Step 7 port、Step 9 flow 的映射和缺口审计。 |
| 当前禁止 | 不写具体 DTO 字段 schema、Rust struct / enum、JSON schema、HTTP route、RPC name、event topic、job trigger、function flow、状态矩阵、persistence、config、test 或正式 `03-详细设计.md`。 |
| 必须使用 | `R8.8` shared helper、`R8.10` Command、`R8.12` Query、`R8.14` Inbound、`R8.16` Outbound、`R8.18` Job,以及 Step 6 objects / Step 7 ports。 |

### 9. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入 Operations Job 来源裁决 | 是。 |
| 是否写入 8 个候选 Job 分组矩阵 | 是。 |
| 是否写入 Job shell family | 是。 |
| 是否写入 checkpoint / progress / duplicate 来源规则 | 是。 |
| 是否写入 shared helper 复用规则 | 是。 |
| 是否写入旧污染过滤 | 是。 |
| 是否形成 `R8.19` 进入门禁 | 是。 |
| 是否写具体 Operations Job DTO 字段 schema / scheduler / queue / retry | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.19`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.19 Protocol-to-object / port closure:先思考`;只允许思考 Command / Query / Inbound / Outbound / Job protocol shell 到 Step 6 object、Step 7 port、Step 9 flow 的映射和缺口审计;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.20`、Step 9 或后续 Step。

## R8.19 Protocol-to-object / port closure:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.19 Protocol-to-object / port closure:先思考`。 |
| 本模块目标 | 思考 `R8.8`~`R8.18` 已完成的 shared / Command / Query / Inbound / Outbound / Job protocol shell 如何回指 Step 6 object、Step 7 port family 和后续 Step 9 flow,并识别缺口审计口径和 `R8.20` 写入边界。 |
| 当前状态 | completed |
| 当前允许 | 只思考 protocol shell 到 Step 6 object、Step 7 port、Step 9 flow 的映射和缺口审计。 |
| 当前禁止 | 不写具体 DTO 字段 schema、Rust struct / enum、JSON schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、function flow、状态矩阵、persistence、config、test 或正式 `03-详细设计.md`。 |

### 2. 输入来源裁决

| 输入 | 当前裁决 | 用法 | 禁止事项 |
|---|---|---|---|
| `R8.8` shared protocol helper | 当前闭环审计的 shared 基线 | 检查 metadata、actor/source、idempotency、stored result、page/cursor、public marker、rejection/degraded、receipt/report shell 是否被各协议族复用。 | 不新增 shared DTO 字段 schema。 |
| `R8.10` Command | Command protocol 基线 | 检查 command envelope、request intent、accepted/rejected/duplicate/effect shell 是否有 Step 6 / Step 7 来源。 | 不写具体 Command DTO 字段。 |
| `R8.12` Query | Query protocol 基线 | 检查 query envelope、selector、response/page、empty/not-visible/stale/degraded/unavailable shell 是否有 read/degraded/resolver 来源。 | 不写具体 Query DTO 字段或 query flow。 |
| `R8.14` Inbound | Inbound protocol 基线 | 检查 inbound envelope、typed payload boundary、intake、duplicate/quarantine/delayed/worker result shell 是否有 intake/source/stored result 来源。 | 不写 topic、broker、ack/retry/dead-letter。 |
| `R8.16` Outbound | Outbound protocol 基线 | 检查 event envelope、event candidate、publication outcome、blocked/degraded/unavailable、worker publisher result shell 是否有 candidate/publisher/target registry 来源。 | 不写 event topic、payload schema、outbox/relay、delivery receipt。 |
| `R8.18` Job | Operations Job protocol 基线 | 检查 job input/dispatch/result/progress/checkpoint/report/partial/replay shell 是否有 job assembly、checkpoint、progress 和 maintenance port 来源。 | 不写 scheduler、queue、retry、lease、job flow。 |
| Step 6 objects | object truth source | 为每类 shell 找到 object / helper / entry local state 主语。 | 不从旧 Step 9 或旧 formal `03` 补对象。 |
| Step 7 port family | port truth source | 为每类 shell 找到 repository / resolver / mapper / publisher / handoff / maintenance / runtime seam。 | 不让 protocol DTO 直接访问 repository handle 或 adapter concrete type。 |
| Step 9 function flows | future handoff only | 只作为后续 flow 承接点;当前旧 Step 9 是 historical material,不得反推协议。 | 不继承旧 outbox / P0 / MethodContent flow。 |

当前结论:

- `R8.19` 不再新增协议族,只建立 protocol shell -> object -> port -> future flow 的闭环审计框架。
- Step 9 当前文件仍含旧 outbox / P0 等旧材料,本模块不能用旧 Step 9 内容反推 Step 8;只能把 Step 9 标记为后续重启承接点。
- 缺 object、缺 port、缺 mapper、缺 public marker、缺 stored result、缺 page/cursor、缺 receipt/report/replay source 都必须进入 stop-review,不得在 `R8.20` 写成已闭合。

### 3. protocol family 闭环轴

| 协议族 | Step 8 protocol shell | Step 6 object 主语 | Step 7 port / seam 主语 | Step 9 后续承接 |
|---|---|---|---|---|
| shared | metadata、actor/source、idempotency、stored result、page/cursor、public marker、degraded、receipt/report shell | `MethodAssetOperationContext`;`MethodAssetIdempotencyGuard`;`MethodAssetStoredOperationResult`;`MethodAssetReadDecision`;`MethodAssetDegradedDecision` | UnitOfWork、Clock、IdGenerator、page/version helper、stored result、checkpoint/progress helper、degraded mapper | command/query/consumer/job service entry flow 的通用前置。 |
| Command | command envelope、request intent、accepted/rejected/duplicate/effect shell | `MethodAssetApiCommandHandlerEntry`;`MethodAssetApiResponseAssemblyState`;operation context;stored result;event candidate assembly | truth repositories、policy diagnostic builder、stored result seam、UoW、IdGenerator、Clock | command accepted/rejected/duplicate flow。 |
| Query | query envelope、selector、response view、page、empty/not-visible/stale/degraded/unavailable shell | `MethodAssetApiQueryHandlerEntry`;`MethodAssetReadDecision`;`MethodAssetDegradedDecision`;API response assembly | query read resolver、degraded mapper、availability resolver、distribution/discovery builder、support/material repositories、page helper | query no-write read flow。 |
| Inbound | inbound envelope、typed payload boundary、intake、duplicate/quarantine/delayed/no-op、worker result shell | `MethodAssetInboundIntakeDecision`;`MethodAssetWorkerEntryContext`;`MethodAssetInboundConsumerEntry`;`MethodAssetWorkerEntryResultState`;stored result | inbound source port、external body-free adapter、stored result seam、adapter availability、runtime assembly | inbound consumer intake flow。 |
| Outbound | outbound envelope、event family/schema version、body-free fact payload、event candidate、publication outcome、worker publisher result shell | `MethodAssetEventCandidateAssembly`;`MethodAssetPublisherBindingState`;`MethodAssetEventPublisherEntry`;`MethodAssetWorkerEntryResultState` | event candidate publisher port、target registry、adapter availability、degraded mapper、handoff port when applicable | outbound candidate publication flow。 |
| Job | job input/dispatch/result/progress/checkpoint/report boundary、partial/degraded/unavailable、duplicate/replay shell | `MethodAssetJobAssemblyContext`;`MethodAssetJobRunnerContext`;`MethodAssetOperationJobEntry`;`MethodAssetJobProgressAssemblyState`;`MethodAssetJobEntryResultState` | maintenance task/progress/run history repositories、refresh target planner、checkpoint store、recovery issue repository、runtime assembly registry、adapter availability | operations job execution / resume / report boundary flow。 |

### 4. 闭环审计维度

| 维度 | 审计问题 | 停审条件 |
|---|---|---|
| object source | 每个 protocol shell 是否能回指 Step 6 object、helper 或 entry local state? | shell 只能靠 DTO 私有字段、旧 formal 文档或实现端临时对象成立。 |
| port source | 每个 shell 中的 lookup、marker、summary、outcome、checkpoint、stored result 是否有 Step 7 port / seam? | service 需要现场合成 marker、target batch、checkpoint、publication outcome、visibility/degraded result。 |
| future flow source | 每个协议是否知道后续 Step 9 的 flow owner,且未提前写 flow? | 当前模块必须写 batch loop、transaction ordering、state transition 才能说明协议。 |
| body-free boundary | Inbound / Outbound / Job / report / external / artifact 是否持续 body-free? | 需要 raw body、report body、artifact/archive body、provider payload、raw log 或 metrics body。 |
| entry restriction | api / worker / jobs 是否只调用 application facade? | protocol shell 需要 entry 直连 repository、domain transition、adapter、runtime builder internals 或 config secret。 |
| duplicate / replay | Command / Inbound / Job duplicate 是否有 stored result / checkpoint / run history source? | duplicate 需要重跑 mutation、重读 current truth 重建 response、扫描 queue 或 fake private map。 |
| page / cursor | Query / Job page/cursor/checkpoint 是否与 optimistic version 区分? | cursor 替代 version,或 version / cursor 来源不明。 |
| public marker | degraded、unavailable、stale、not-visible、blocked marker 是否来自正式 mapper / resolver / availability? | marker 由 service 字符串拼接、错误文本推断或 raw adapter status 推导。 |

### 5. `R8.20` 写入边界

| `R8.20` 允许写入 | `R8.20` 禁止写入 |
|---|---|
| shared / Command / Query / Inbound / Outbound / Job 的 protocol-to-object / port / future-flow 映射矩阵。 | 具体 DTO 字段 schema、Rust struct / enum、JSON schema、HTTP route、RPC name、event topic、job trigger。 |
| object source、port source、future flow owner、停审条件、缺口审计结果。 | function flow、batch loop、transaction ordering、state matrix、persistence schema、config key、test case schema。 |
| 已闭合 / 待停审分类,以及 `R8.21` 跨协议 public surface 审计进入门禁。 | 继承旧 Step 9、旧 formal `03`、旧 P0/P1、outbox / snapshot / fingerprint 作为正向来源。 |

### 6. 预期停审分类

| 分类 | 含义 | 处理 |
|---|---|---|
| pass | protocol shell 能回指 Step 6 object 和 Step 7 port,且只需 Step 9 后续展开 flow。 | `R8.20` 写入闭合记录。 |
| watch | 当前 family 级来源成立,但具体字段 / marker / page / result 需要 Step 9~13 继续闭口。 | `R8.20` 写入后续承接注意事项,不得声称 schema 完全闭合。 |
| stop | 缺 object、port、mapper、marker、stored result、checkpoint、page source 或 body-free source。 | `R8.20` 必须标记暂停,不得进入正式 §8 草稿。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只做 protocol-to-object / port closure 思考 | 是。 |
| 是否覆盖 shared / Command / Query / Inbound / Outbound / Job | 是。 |
| 是否识别 Step 6 object 主语 | 是。 |
| 是否识别 Step 7 port / seam 主语 | 是。 |
| 是否把 Step 9 定位为 future handoff,未继承旧 Step 9 | 是。 |
| 是否形成 `R8.20` 写入边界 | 是。 |
| 是否写具体 DTO 字段 schema / function flow / state matrix | 否。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.20`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.20 Protocol-to-object / port closure:再写入`;只允许写入 shared / Command / Query / Inbound / Outbound / Job protocol shell 到 Step 6 object、Step 7 port、Step 9 future-flow 的映射矩阵、停审分类、缺口审计结果和 `R8.21` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.21`、Step 9 或后续 Step。

## R8.20 Protocol-to-object / port closure:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.20 Protocol-to-object / port closure:再写入`。 |
| 本模块目标 | 固化 shared / Command / Query / Inbound / Outbound / Job protocol shell 到 Step 6 object、Step 7 port / seam、后续 Step 9 flow owner 的映射矩阵,并记录 pass / watch / stop 审计结果。 |
| 当前状态 | completed |
| 当前允许 | 写入 family 级映射、闭环状态、停审条件、缺口审计和 `R8.21` 进入门禁。 |
| 当前禁止 | 不写具体 DTO 字段、Rust struct / enum、JSON schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、function flow、状态矩阵、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

本模块只关闭“协议壳是否有对象 / port / 后续 flow 承接主语”的 family 级问题。凡是需要字段名、枚举值、marker 具体来源、stored replay item、page cursor 结构、receipt / report 细节才能闭合的内容,全部进入 `watch` 或 `stop` 记录,不得被写成 schema 已完成。

### 2. 闭环映射总表

| 协议族 | protocol shell | Step 6 object source | Step 7 port / seam source | future Step 9 flow owner | closure status |
|---|---|---|---|---|---|
| shared | metadata、actor/source、idempotency、stored result、page/cursor、public marker、rejection/degraded、receipt/report shell | `MethodAssetOperationContext`;`MethodAssetIdempotencyGuard`;`MethodAssetStoredOperationResult`;`MethodAssetReadDecision`;`MethodAssetDegradedDecision` | UnitOfWork、Clock、IdGenerator、stored result seam、page/version helper、checkpoint/progress helper、degraded mapper | command/query/consumer/publisher/job entry flow 的通用前置 | `pass/watch` |
| Command | command envelope、request intent、accepted/rejected/duplicate/effect shell | `MethodAssetApiCommandHandlerEntry`;`MethodAssetApiResponseAssemblyState`;operation context;stored result;event candidate assembly | truth repositories、policy diagnostic builder、stored result seam、UnitOfWork、IdGenerator、Clock | command accepted/rejected/duplicate service flow | `pass/watch` |
| Query | query envelope、selector、response view、page、empty/not-visible/stale/degraded/unavailable shell | `MethodAssetApiQueryHandlerEntry`;`MethodAssetReadDecision`;`MethodAssetDegradedDecision`;API response assembly | query read resolver、degraded mapper、availability resolver、distribution/discovery builder、support/material repositories、page helper | no-write query service flow | `watch` |
| Inbound | inbound envelope、typed payload boundary、intake、duplicate/quarantine/delayed/no-op、worker result shell | `MethodAssetInboundIntakeDecision`;`MethodAssetWorkerEntryContext`;`MethodAssetInboundConsumerEntry`;`MethodAssetWorkerEntryResultState`;stored result | inbound source port、external body-free adapter、stored result seam、adapter availability、runtime assembly | inbound consumer intake / replay flow | `pass/watch` |
| Outbound | outbound envelope、event family/schema version、body-free fact payload、event candidate、publication outcome、worker publisher result shell | `MethodAssetEventCandidateAssembly`;`MethodAssetPublisherBindingState`;`MethodAssetEventPublisherEntry`;`MethodAssetWorkerEntryResultState` | event candidate publisher port、target registry、adapter availability、degraded mapper、handoff port where applicable | outbound candidate publication flow | `pass/watch` |
| Operations Job | job input/dispatch/result/progress/checkpoint/report boundary、partial/degraded/unavailable、duplicate/replay shell | `MethodAssetJobAssemblyContext`;`MethodAssetJobRunnerContext`;`MethodAssetOperationJobEntry`;`MethodAssetJobProgressAssemblyState`;`MethodAssetJobEntryResultState` | maintenance task/progress/run history repositories、refresh target planner、checkpoint store、recovery issue repository、runtime assembly registry、adapter availability | operations job execution / resume / report flow | `pass/watch` |

闭环解释:

- `pass/watch` 表示 family 级 object 与 port 承接成立,但仍存在二级 public surface、字段命名、marker、receipt/report/result、page helper、replay source 的后续审计。
- `watch` 表示当前 family 更依赖 Step 9~13 的 flow / state / persistence / error recovery 细化,不能在 Step 8 宣称具体 DTO schema 已闭合。
- 本轮没有发现必须立即把 Step 8 停住的 `stop` 项,但以下 stop 条件已经作为后续红线固定。

### 3. 按协议族缺口审计

| 协议族 | 已闭合内容 | watch 内容 | stop 触发条件 |
|---|---|---|---|
| shared | metadata、actor/source、idempotency、stored result、page/cursor、public marker、degraded、receipt/report shell 均能找到 Step 6 helper 和 Step 7 seam 主语。 | secondary public type 命名、stored result replay item、page cursor helper、receipt/report/result surface 需要 `R8.21` 继续审计。 | 任一 shared shell 只能靠 DTO 私有字段、字符串 marker 或旧 Step 9 反推成立。 |
| Command | command entry、response assembly、stored result、effect candidate 的 object / port 主语成立。 | accepted/rejected/duplicate/result/effect 的二级类型命名和 replay 承载位置需要 `R8.21` 审计,具体 flow 留给 Step 9。 | duplicate accepted / rejected 需要重跑 mutation、重读 current truth 重建 response 或自行合成 effect。 |
| Query | read decision、degraded decision、query resolver、availability/degraded mapper、page helper 的 family 级来源成立。 | empty/not-visible/stale/degraded/unavailable surface 的 marker 来源、page helper 命名、result envelope 与 response view 边界需后续审计。 | service 需要合成 degraded marker、visibility marker、stale marker、page cursor 或从 raw adapter status 推断 public surface。 |
| Inbound | inbound intake decision、typed payload boundary、stored result、worker result 的 object / port 主语成立。 | 4 个 consumer 的 receipt 命名、duplicate/quarantine/delayed/no-op surface、body-free evidence 引用需 `R8.21` 审计。 | inbound shell 需要 raw provider body、broker payload、dead-letter body、adapter private map 或未定义 receipt schema。 |
| Outbound | event candidate assembly、publisher binding、publication outcome、target registry 与 handoff family 主语成立。 | event family schema version、publication outcome、blocked/degraded/unavailable surface 和 worker publisher result 二级类型需 `R8.21` 审计。 | 依赖 outbox/P0 旧主线、raw event body、topic 私定、delivery receipt 私定或从 adapter error text 生成 public marker。 |
| Operations Job | job assembly、runner context、progress/checkpoint、run history、maintenance repositories、runtime availability 的 family 主语成立。 | job result/report/checkpoint/progress 的 public surface、partial degraded/unavailable、duplicate replay 与 report boundary 需 `R8.21` 审计。 | job 需要 raw report body、artifact/archive body、scheduler/queue 私定、fake checkpoint map 或未定义 run history replay source。 |

### 4. stop-review 条件清单

| 条件 | 处理 |
|---|---|
| protocol shell 找不到 Step 6 object、helper 或 entry local state 主语 | 停审,回 Step 6 补 object shell。 |
| shell 中 marker、outcome、stored result、receipt、report、checkpoint、page/cursor 找不到 Step 7 port / mapper / seam | 停审,回 Step 7 补 port 或 mapper。 |
| 需要从旧 Step 9、旧 formal `03`、旧 P0/P1、outbox、snapshot、fingerprint 反推当前协议 | 停审,按 historical material 污染处理。 |
| service / entry 需要自行合成 degraded marker、visibility result、publication outcome、checkpoint、cursor 或 replay result | 停审,必须补正式 mapper / resolver / stored surface。 |
| api / worker / jobs entry 需要直接访问 repository、adapter、domain transition、runtime builder internals 或 config secret | 停审,违反 entry restriction。 |
| Inbound / Outbound / Job / report / artifact 需要 raw body、provider payload、raw log、metrics body 或 archive body | 停审,违反 body-free boundary。 |
| duplicate / replay 需要重跑 mutation 或重读 current truth 重建 response | 停审,必须补 stored result / checkpoint / run history。 |
| page cursor 与 optimistic version 混用或来源不明 | 停审,必须拆分 page/cursor 与 version source。 |

### 5. `R8.21` 进入门禁

| 项 | 内容 |
|---|---|
| 下一模块 | `R8.21 跨协议 public surface 审计:先思考`。 |
| 进入条件 | `R8.20` 已完成 family 级 protocol-to-object / port / future-flow 映射,并未修改正式 `03-详细设计.md`。 |
| 允许思考 | secondary public type、命名漂移、page helper、receipt/report/result surface、actor/source、body-free boundary、stored replay source、marker 来源的一致性审计。 |
| 禁止思考外扩 | 不写具体 DTO 字段 schema、Rust / JSON、HTTP route、RPC name、event topic、job trigger、function flow、状态矩阵、persistence、config、test 或正式文档。 |
| 后续门禁 | `R8.21` 只思考,完成后等待用户确认进入 `R8.22 跨协议 public surface 审计:再写入`。 |

### 6. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只写 protocol-to-object / port closure | 是。 |
| 是否覆盖 shared / Command / Query / Inbound / Outbound / Job | 是。 |
| 是否形成 Step 6 object source、Step 7 port source、future Step 9 owner 映射 | 是。 |
| 是否标记 pass / watch / stop 口径 | 是。 |
| 是否避免把 schema 细节写成已闭合 | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.21`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.21 跨协议 public surface 审计:先思考`;只允许思考 secondary public type、命名漂移、page helper、receipt/report/result surface、actor/source、body-free boundary、stored replay source、marker 来源的一致性审计;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.22`、Step 9 或后续 Step。

## R8.21 跨协议 public surface 审计:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.21 跨协议 public surface 审计:先思考`。 |
| 本模块目标 | 思考 Step 8 已形成的 shared / Command / Query / Inbound / Outbound / Job protocol shell 是否存在跨协议 public surface 命名漂移、二级类型缺口、page / receipt / report / result surface 不一致、actor/source 不统一、body-free 破口或 replay / marker 来源不闭合。 |
| 当前状态 | completed |
| 当前允许 | 只思考审计轴、候选问题、停审条件和 `R8.22` 写入边界。 |
| 当前禁止 | 不写具体 DTO 字段 schema、Rust struct / enum、JSON schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、function flow、状态矩阵、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

`R8.21` 不新增协议族,也不把 `R8.20` 的 `watch` 项直接关闭。它只建立跨协议 public surface 的一致性审计方式,为 `R8.22` 写入审计表和停审分类做准备。

### 2. 输入来源裁决

| 输入 | 当前用途 | 禁止事项 |
|---|---|---|
| `R8.8` shared protocol helper | 作为 actor/source、idempotency、stored result、page/cursor、public marker、receipt/report 的共享词汇来源。 | 不新增 shared 字段 schema。 |
| `R8.10` Command protocol family | 检查 accepted / rejected / duplicate / effect surface 是否复用 shared result、actor/source 和 replay 语义。 | 不写 command DTO 字段或 accepted flow。 |
| `R8.12` Query protocol family | 检查 response view、page、empty/not-visible/stale/degraded/unavailable surface 是否与 shared page/marker 词汇一致。 | 不写 query selector 字段或 read flow。 |
| `R8.14` Inbound consumer protocol family | 检查 intake、duplicate、quarantine、delayed、no-op、worker result 是否有统一 receipt / result surface。 | 不写 topic、broker binding、ack/retry/dead-letter。 |
| `R8.16` Outbound event protocol family | 检查 event family schema version、publication outcome、blocked/degraded/unavailable、publisher result 的命名和 body-free 边界。 | 不写 event payload schema、topic、outbox 或 delivery receipt。 |
| `R8.18` Operations job protocol family | 检查 job result、progress、checkpoint、report boundary、partial/degraded/unavailable、duplicate/replay 是否与 shared result/report 语义一致。 | 不写 scheduler、queue、lease、job trigger 或 job flow。 |
| `R8.20` closure audit | 作为本模块 `watch` 项来源。 | 不把 family 级 pass/watch 误写成 schema 完全闭合。 |

### 3. public surface 审计轴

| 审计轴 | 思考问题 | 预期 `R8.22` 写入 |
|---|---|---|
| secondary public type | 是否存在同一概念在 Command / Query / Inbound / Outbound / Job 中各自命名,导致后续落码出现重复 DTO shell? | 列出需统一的二级 public surface 名称族和禁止私造的类型族。 |
| naming drift | accepted/rejected/duplicate/degraded/unavailable/blocked/partial/stale/no-op 等状态词是否跨协议保持同义同名? | 写入命名漂移审计表,标记 `pass/watch/stop`。 |
| page helper | Query page、Job target page、report page、checkpoint cursor 是否与 optimistic version 分离? | 写入 page/cursor/version 分离规则。 |
| receipt / report / result surface | Inbound receipt、Outbound publication outcome、Job report、Command result 是否复用 shared result / report boundary,还是各自私定? | 写入 receipt/report/result surface 的统一审计口径。 |
| actor/source | api actor、worker source、job source、external source 是否有一致的 public source shell,且不暴露 adapter private identity? | 写入 actor/source 复用和停审条件。 |
| body-free boundary | event / inbound / outbound / job / report / artifact 是否仍只传 typed ref、safe summary 或 marker? | 写入 body-free 破口清单和禁入材料。 |
| stored replay source | Command duplicate、Inbound duplicate、Job resume / duplicate 是否都能从 stored result、checkpoint 或 run history 还原 public surface? | 写入 replay source 审计表。 |
| marker source | degraded、unavailable、stale、not-visible、blocked marker 是否只能复制 mapper / resolver / availability 输出? | 写入 marker 来源停审规则。 |

### 4. 候选缺口思考

| 协议族 | 候选缺口 | 当前处理 |
|---|---|---|
| shared | shared helper 已覆盖多类 surface,但 secondary public type 的最终名称族尚未集中审计。 | `R8.22` 写入名称族和复用边界。 |
| Command | accepted / rejected / duplicate / effect surface 可能与 stored result / replay surface 命名发生漂移。 | `R8.22` 检查 result surface 与 stored replay source 是否一一对应。 |
| Query | empty / not-visible / stale / degraded / unavailable surface 容易在各 query 中私造 marker 或 page shell。 | `R8.22` 固定 marker copy-only 与 page/cursor/version 分离规则。 |
| Inbound | 4 个 consumer 的 intake / duplicate / quarantine / delayed / no-op surface 可能出现 receipt 名称不一致。 | `R8.22` 审计 receipt / worker result / body-free payload boundary。 |
| Outbound | event family schema version、publication outcome、blocked/degraded/unavailable 与 old outbox / topic 旧语义容易混杂。 | `R8.22` 明确 body-free event shell 与 publication outcome 禁入旧 outbox。 |
| Operations Job | job report、progress、checkpoint、partial degraded、duplicate replay 容易与 raw report body、scheduler/queue 私定耦合。 | `R8.22` 审计 report boundary、checkpoint source 和 run history replay。 |

### 5. 停审思考

| 触发 | 处理 |
|---|---|
| 同一 public 概念在多个协议族中需要不同 DTO shell 才能表达,但没有 shared helper 来源 | 停审,回到 shared protocol helper 或 Step 6/7 补闭口。 |
| public DTO 需要直接暴露 domain-only object、repository version object、adapter private status 或 raw provider identity | 停审,必须补 public shell 或 mapper。 |
| page cursor、checkpoint cursor、optimistic version 三者出现互相替代 | 停审,必须拆分语义来源。 |
| receipt、report、result surface 只能靠实现侧自行命名或拼装 | 停审,必须补正式 result/report/receipt shell。 |
| degraded/unavailable/stale/not-visible/blocked marker 需要 service 自行合成 | 停审,必须补 mapper / resolver / availability output。 |
| replay 需要重跑 mutation、扫描 queue、重读 current truth 重建 public response 或读取 fake private map | 停审,必须补 stored result / checkpoint / run history source。 |
| body-free surface 需要 raw body、payload、archive、report text、artifact body、provider log 或 metrics body | 停审,该协议不得进入正式 §8 草稿。 |

### 6. `R8.22` 写入边界

| `R8.22` 允许写入 | `R8.22` 禁止写入 |
|---|---|
| 跨协议 secondary public type / naming drift / page helper / receipt-report-result / actor-source / body-free / replay-marker 审计表。 | 具体 DTO 字段 schema、Rust struct / enum、JSON schema、HTTP route、RPC name、event topic、job trigger。 |
| 每个协议族的 `pass/watch/stop` 结果和后续 Step 9~13 承接注意事项。 | function flow、transaction ordering、state matrix、persistence schema、config key、test case schema。 |
| `R8.23` 回填草稿进入门禁。 | 直接修改正式 `03-详细设计.md` 或进入 Step 9。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只做跨协议 public surface 审计思考 | 是。 |
| 是否覆盖 secondary type、命名漂移、page、receipt/report/result、actor/source、body-free、replay、marker | 是。 |
| 是否避免新增协议族或字段 schema | 是。 |
| 是否形成 `R8.22` 写入边界 | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.22`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.22 跨协议 public surface 审计:再写入`;只允许写入跨协议 secondary public type、命名漂移、page helper、receipt/report/result surface、actor/source、body-free boundary、stored replay source、marker 来源的一致性审计表、停审分类和 `R8.23` 进入门禁;不得直接修改正式 `03-详细设计.md`;不得写 L3-method-library 具体 DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.23`、Step 9 或后续 Step。

## R8.22 跨协议 public surface 审计:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.22 跨协议 public surface 审计:再写入`。 |
| 本模块目标 | 写入跨协议 secondary public type、命名漂移、page helper、receipt/report/result surface、actor/source、body-free boundary、stored replay source、marker 来源的一致性审计表、停审分类和 `R8.23` 进入门禁。 |
| 当前状态 | completed |
| 当前允许 | 固化审计表、统一口径、`pass/watch/stop` 分类、后续承接注意事项和 `R8.23` 进入门禁。 |
| 当前禁止 | 不写具体 DTO 字段 schema、Rust struct / enum、JSON schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、function flow、状态矩阵、persistence schema、config key、test case schema 或正式 `03-详细设计.md`。 |

本模块只解决“跨协议 public surface 是否一致”的审计问题。具体字段、枚举值、状态流、持久化和测试归属仍交给 Step 9~16 后续闭口。

### 2. secondary public type 审计表

| public surface family | 覆盖协议族 | 统一口径 | 状态 | 后续承接 |
|---|---|---|---|---|
| operation metadata / correlation shell | Command、Query、Inbound、Outbound、Job | 统一由 shared helper 承接,不得在各协议族私造 correlation / request identity 字段族。 | `pass/watch` | `R8.23` 草稿可写 family 级规则;字段 schema 留给后续。 |
| actor / source shell | Command、Query、Inbound、Outbound、Job | api actor、worker source、job source、external source 只暴露 public typed ref / safe summary,不得暴露 adapter private identity。 | `watch` | Step 9 flow 必须说明 actor/source 从 entry context 或 source resolver 复制。 |
| operation result shell | Command、Inbound、Outbound、Job | accepted / rejected / duplicate / publication / worker / job result 均需回指 shared result 语义,不得各自定义无法映射的 result family。 | `watch` | `R8.23` 只写 result family;具体 result member 留给 Step 9~12。 |
| page / cursor shell | Query、Job、report boundary | page cursor、checkpoint cursor、optimistic version 三者必须拆分;cursor 不替代 version。 | `watch` | Step 9~13 继续闭口 page source、cursor source、checkpoint source。 |
| public marker shell | Query、Outbound、Job、Command rejection | degraded、unavailable、stale、not-visible、blocked marker 只能复制 mapper / resolver / availability output。 | `watch` | 若后续 flow 无 marker 来源,必须停审回 Step 7。 |
| receipt / report shell | Inbound、Outbound、Job | inbound receipt、publication outcome、job report 只承载 typed refs / safe summary / marker,不得承载 raw body。 | `watch` | Step 9~16 继续拆 receipt/report 生成和 evidence 映射。 |
| stored replay shell | Command、Inbound、Job | duplicate / resume public surface 必须来自 stored result、checkpoint 或 run history,不得重跑 mutation 或重读 truth 重建。 | `watch` | Step 9/13 必须给 replay source;缺失即停审。 |

审计结论:

- 当前 Step 8 已有足够 family 级来源进入 `R8.23` 回填草稿思考。
- 所有 `watch` 项不得在正式草稿里写成字段级闭合,只能写成 public surface family 和后续闭口要求。
- 当前没有新增 `stop` 项,但 marker、replay、report、page/cursor 一旦在 Step 9+ 找不到正式来源,必须停审回补。

### 3. naming drift 审计表

| 状态词 / surface 词 | 允许使用范围 | 统一语义 | 漂移风险 | 分类 |
|---|---|---|---|---|
| accepted | Command | mutation 被正式接收并有 stored/public result 来源。 | 与 inbound intake accepted 或 job accepted 混用。 | `watch` |
| rejected | Command、public rejection | public rejection surface,必须有 safe reason / marker 来源。 | 由错误文本直接拼 public rejection。 | `watch` |
| duplicate | Command、Inbound、Job | 幂等命中或 resume 命中,public surface 来自 stored result / checkpoint / run history。 | duplicate 分支重跑 mutation 或重建 response。 | `watch` |
| degraded | Query、Outbound、Job、worker result | 可服务但降级,marker 来自 mapper / resolver / availability。 | service 自行合成 degraded marker。 | `watch` |
| unavailable | Query、Outbound、Job、adapter availability | 不可用 surface,必须来自 availability / resolver / mapper。 | 将 adapter raw status 直接暴露。 | `watch` |
| stale | Query、projection/read surface | 读面过期但可返回,必须有 freshness / marker 来源。 | 用时间戳或字符串推断 stale。 | `watch` |
| not-visible | Query | 不可见 public surface,不得泄露 truth 是否存在。 | 与 degraded / unavailable 混用。 | `watch` |
| blocked | Outbound、Job | 由于策略、目标、依赖或安全边界阻断。 | 用 transport failure 或 queue failure 代替 blocked。 | `watch` |
| partial | Job、report / page surface | 部分完成或部分可见,必须有 report / progress / marker 来源。 | 用 raw report body 描述 partial。 | `watch` |
| no-op | Inbound、Job | 合法输入但无需状态变化,仍需 receipt / result 来源。 | 静默跳过导致缺 evidence / replay。 | `watch` |

命名规则:

- 同一状态词跨协议族必须保持同义;若语义不同,后续必须更名或回到 shared helper 重新定义。
- 状态词不能替代 marker、result、receipt 或 report source。
- 旧 `P0/P1`、outbox、snapshot、fingerprint、delivery receipt 不能作为命名来源。

### 4. page / cursor / version 分离规则

| 类型 | 当前含义 | 可出现位置 | 禁止替代 |
|---|---|---|---|
| page cursor | 翻页位置或列表继续读取位置。 | Query list、job target page、report page。 | 不得替代 optimistic version、checkpoint 或 domain version。 |
| checkpoint cursor | Job resume / progress 的恢复位置。 | Operations Job、maintenance progress。 | 不得替代 query page cursor 或 truth version。 |
| optimistic version | truth / material state 的并发保护版本。 | repository save / expected version 语义。 | 不得作为 page cursor 或 checkpoint cursor 对外暴露。 |
| report boundary ref | report / evidence / handoff 的 public 边界引用。 | Job report、handoff report、evidence shell。 | 不得承载 raw report body 或 artifact body。 |

`R8.23` 回填草稿只能写“page/cursor/version 分离原则”。如果后续 Step 9 需要具体 page shape 或 cursor 字段,必须另行闭口。

### 5. receipt / report / result surface 审计表

| surface | 覆盖协议族 | 必须来源 | 禁止来源 | 分类 |
|---|---|---|---|---|
| Command result | Command | command handler response assembly、stored operation result、effect candidate summary。 | 重读 current truth 重建 response。 | `watch` |
| Inbound receipt | Inbound | intake decision、stored result、worker entry result state。 | broker ack、raw payload、dead-letter body。 | `watch` |
| Publication outcome | Outbound | event candidate publisher port、target registry、adapter availability / safe outcome。 | outbox 旧主线、topic 私定、delivery raw receipt。 | `watch` |
| Worker result | Inbound、Outbound | worker entry result state、availability / degraded mapper。 | adapter private status 或 raw provider error。 | `watch` |
| Job result | Operations Job | job entry result state、progress/checkpoint/run history。 | scheduler / queue private result。 | `watch` |
| Job report boundary | Operations Job | report boundary ref、safe summary、typed refs、marker。 | raw report body、artifact archive body、provider log。 | `watch` |

审计结论:

- `R8.23` 可以把这些 surface 写成协议族的 public shell family。
- 具体 result / receipt / report 的字段与值域不得在 Step 8 私自闭合。
- 若 Step 9~16 发现任何 surface 只能从 raw body 或 adapter status 产生,必须停审。

### 6. body-free / replay / marker 审计表

| 审计项 | 当前规则 | stop 条件 |
|---|---|---|
| body-free inbound | inbound protocol 只承接 typed payload boundary、safe ref、intake decision。 | 需要 provider raw body、broker payload body、dead-letter body。 |
| body-free outbound | outbound event 只承接 body-free fact payload shell、event candidate ref、publication outcome。 | 需要 raw event body、topic payload、旧 outbox body。 |
| body-free job / report | job report 只承接 report boundary ref、safe summary、progress/checkpoint refs。 | 需要 report text body、artifact archive body、raw metrics/log。 |
| replay source | Command / Inbound / Job duplicate 必须从 stored result、checkpoint、run history 复制。 | 重跑 mutation、扫描 queue、重读 truth 重建 response。 |
| marker source | degraded / unavailable / stale / not-visible / blocked marker 只能复制 mapper / resolver / availability output。 | service 拼字符串、从错误文本或 adapter raw status 推断。 |
| actor/source | entry actor / worker source / job source 必须来自 entry context、source resolver 或 typed source ref。 | 暴露 adapter private identity、provider account、secret、raw request metadata。 |

### 7. `R8.23` 进入门禁

| 项 | 内容 |
|---|---|
| 下一模块 | `R8.23 回填草稿:先思考`。 |
| 进入条件 | `R8.22` 已完成跨协议 public surface 审计,并未修改正式 `03-详细设计.md`。 |
| 允许思考 | 如何将 `R8.8`~`R8.22` 已确认中间产物装配成正式 §8 候选草稿框架。 |
| 禁止思考外扩 | 不新增协议族、不写具体 DTO 字段 schema、不写 HTTP/RPC/topic/job trigger、不写 function flow / state / persistence / config / test。 |
| 后续门禁 | `R8.23` 只思考候选草稿框架,完成后等待用户确认进入 `R8.24 回填草稿:再写入`。 |

### 8. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只写跨协议 public surface 审计 | 是。 |
| 是否覆盖 secondary type、命名漂移、page/cursor/version、receipt/report/result、body-free、replay、marker、actor/source | 是。 |
| 是否只写 family / 审计级别,未写 DTO 字段 schema | 是。 |
| 是否形成 `R8.23` 进入门禁 | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.23`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.23 回填草稿:先思考`;只允许思考如何将 `R8.8`~`R8.22` 已确认中间产物装配为正式 §8 候选草稿框架;不得直接修改正式 `03-详细设计.md`;不得新增协议族;不得写 L3-method-library 具体 DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.24`、Step 9 或后续 Step。

## R8.23 回填草稿:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.23 回填草稿:先思考`。 |
| 本模块目标 | 思考如何将 `R8.8`~`R8.22` 已确认中间产物装配为正式 `03-详细设计.md` §8 的候选草稿框架,但本模块不修改正式文档。 |
| 当前状态 | completed |
| 当前允许 | 只思考正式 §8 候选草稿的章节框架、来源映射、写入边界、禁入内容和 `R8.24` 写入边界。 |
| 当前禁止 | 不新增协议族,不写具体 DTO 字段 schema、Rust struct / enum、JSON schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、function flow、状态矩阵、persistence schema、config key、test case schema,不修改正式 `03-详细设计.md`。 |

`R8.23` 的关键判断是:正式 §8 只能写“协议契约 family 与 public shell 约束”,不能在 Step 8 中提前承担 Step 9 function flow、Step 10 state、Step 11 persistence、Step 12 error recovery、Step 13 concurrency、Step 14 config 或 Step 16 test 的职责。

### 2. 已确认来源到正式 §8 的装配映射

| 来源模块 | 可进入正式 §8 候选草稿的内容 | 不可进入内容 |
|---|---|---|
| `R8.8 shared protocol helper` | shared metadata、actor/source、idempotency、operation result、page/cursor、public marker、rejection/degraded、receipt/report shell 的 family 规则。 | 具体字段 schema、JSON/Rust 定义。 |
| `R8.10 Command protocol family` | Command envelope、request intent、accepted/rejected/duplicate/effect shell family 和 shared helper 复用规则。 | 具体 command DTO 字段、HTTP/RPC 映射、mutation flow。 |
| `R8.12 Query protocol family` | Query envelope、selector、response view、page、empty/not-visible/stale/degraded/unavailable shell family。 | 具体 selector 字段、read flow、projection state 判断。 |
| `R8.14 Inbound consumer protocol family` | 4 个 inbound consumer family、typed payload boundary、intake、duplicate/quarantine/delayed/no-op、worker result shell。 | topic、broker binding、ack/retry/dead-letter、raw payload。 |
| `R8.16 Outbound event protocol family` | 34 个 outbound event candidate family、body-free event shell、event candidate、publication outcome、blocked/degraded/unavailable、publisher result。 | event topic、outbox、delivery receipt、payload body。 |
| `R8.18 Operations job protocol family` | 8 个 operations job family、job input/result/progress/checkpoint/report boundary、partial/degraded/unavailable、duplicate/replay shell。 | scheduler、queue、lease、job trigger、job flow。 |
| `R8.20 protocol-to-object / port closure` | protocol shell 到 Step 6 object、Step 7 port/seam、future Step 9 owner 的闭环说明和 stop-review 条件。 | 把 `watch` 项写成字段级闭合。 |
| `R8.22 public surface audit` | secondary type、命名漂移、page/cursor/version、receipt/report/result、body-free、replay、marker、actor/source 的跨协议一致性规则。 | 任何实现侧私造 marker / result / report / cursor 的细节。 |

### 3. 正式 §8 候选草稿框架思考

建议 `R8.24` 只写中间产物中的“正式 §8 候选草稿”,不直接回填正式文档。候选草稿应采用以下框架:

| 候选小节 | 目的 | 来源 |
|---|---|---|
| §8.1 协议契约范围与禁入边界 | 声明 Step 8 只定义协议 family / public shell,不定义 transport、flow、state、persistence、config、test。 | `R8.1`~`R8.6`;`R8.20`;`R8.22` |
| §8.2 shared protocol helper | 固化跨协议 metadata、actor/source、idempotency、result、page/cursor、marker、receipt/report shell。 | `R8.8`;`R8.22` |
| §8.3 Command protocol family | 固化 command envelope、request intent、accepted/rejected/duplicate/effect shell。 | `R8.10`;`R8.20`;`R8.22` |
| §8.4 Query protocol family | 固化 query envelope、selector、response/page、empty/not-visible/stale/degraded/unavailable shell。 | `R8.12`;`R8.20`;`R8.22` |
| §8.5 Inbound consumer protocol family | 固化 inbound consumer family、typed payload boundary、intake/duplicate/quarantine/delayed/no-op、worker result shell。 | `R8.14`;`R8.20`;`R8.22` |
| §8.6 Outbound event protocol family | 固化 outbound event family、body-free event shell、event candidate、publication outcome、publisher result shell。 | `R8.16`;`R8.20`;`R8.22` |
| §8.7 Operations job protocol family | 固化 job family、job input/result/progress/checkpoint/report boundary、partial/degraded/unavailable、duplicate/replay shell。 | `R8.18`;`R8.20`;`R8.22` |
| §8.8 protocol-to-object / port closure | 汇总 Step 6 object、Step 7 port/seam、Step 9 future flow owner 映射。 | `R8.20` |
| §8.9 cross-protocol public surface guardrails | 汇总 secondary type、命名、page/cursor/version、receipt/report/result、body-free、replay、marker、actor/source 规则。 | `R8.22` |
| §8.10 stop-review 与后续承接 | 固定 Step 9~16 继续闭口的 watch / stop 条件。 | `R8.20`;`R8.22` |

### 4. 草稿写入粒度思考

`R8.24` 不应一次写成正式章节终稿,而应写“候选草稿”。粒度控制如下:

| 内容类型 | `R8.24` 可写程度 | 说明 |
|---|---|---|
| 协议 family 数量 | 可写 | shared、Command、Query、Inbound、Outbound、Operations Job 六类和已确认的子 family。 |
| public shell 名称族 | 可写 family 名称 | 只写 shell family,不写字段列表。 |
| Step 6 / Step 7 映射 | 可写主语级映射 | 不写具体 method signature 或 repository transaction detail。 |
| stop-review 条件 | 可写 | 用于防止实现端自行补口。 |
| watch 项 | 可写 | 明确后续 Step 9~16 必须继续闭口。 |
| DTO 字段 / enum 值 | 不可写 | 需要后续 schema 闭口时再定义。 |
| route / RPC / topic / trigger | 不可写 | transport / runtime 绑定不在当前模块。 |
| function flow / state / persistence / config / test | 不可写 | 分属 Step 9~16。 |

### 5. 旧材料污染防线

| 旧材料 | `R8.24` 处理 |
|---|---|
| `MethodContent` 旧主线 | 不进入 §8 候选草稿。 |
| publish / snapshot / fingerprint | 不作为 protocol family 来源。 |
| outbox / delivery receipt | 不作为 outbound protocol 来源。 |
| HTTP JSON P0/P1 | 不作为 transport 或 schema 来源。 |
| L0-bus / broker topic | 不作为 event topic 来源。 |
| 旧 Step 9 flow | 只作为 historical material,不得反推 Step 8。 |
| 旧正式 `03-详细设计.md` §8 | 只作污染审计对象,不得复制。 |

### 6. `R8.24` 写入边界

| `R8.24` 允许写入 | `R8.24` 禁止写入 |
|---|---|
| 正式 §8 候选草稿框架,仅写入当前 Step 文件。 | 直接修改正式 `03-详细设计.md`。 |
| shared / Command / Query / Inbound / Outbound / Operations Job 的 family 级协议契约。 | 新增协议族或恢复旧 `MethodContent` / outbox / P0/P1。 |
| protocol-to-object / port closure 和 cross-protocol guardrails。 | 具体 DTO 字段 schema、Rust struct / enum、JSON schema、HTTP route、RPC name、event topic、job trigger。 |
| stop-review / watch 条件与 Step 9 后续承接。 | function flow、state matrix、persistence schema、config key、test case schema。 |

### 7. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只思考正式 §8 候选草稿装配框架 | 是。 |
| 是否把 `R8.8`~`R8.22` 映射到候选小节 | 是。 |
| 是否保持不修改正式 `03-详细设计.md` | 是。 |
| 是否避免新增协议族 / DTO 字段 / flow / state / persistence | 是。 |
| 是否形成 `R8.24` 写入边界 | 是。 |
| 是否进入 `R8.24`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.24 回填草稿:再写入`;只允许在当前 Step 文件中写入正式 §8 候选草稿,内容限于协议 family、shared helper、Command / Query / Inbound / Outbound / Operations Job protocol shell、protocol-to-object / port closure、cross-protocol guardrails、stop-review / watch 条件和 Step 9 后续承接;不得直接修改正式 `03-详细设计.md`;不得新增协议族;不得写 L3-method-library 具体 DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.25`、Step 9 或后续 Step。

## R8.24 回填草稿:再写入

### 1. 写入边界确认

| 项 | 内容 |
|---|---|
| 触发 | 用户确认进入 `R8.24 回填草稿:再写入`。 |
| 本模块目标 | 在当前 Step 文件中写入正式 §8 候选草稿,只覆盖协议 family、public shell、closure guardrails 和后续承接。 |
| 当前状态 | completed |
| 当前允许 | 写入候选草稿、来源说明、stop-review / watch 条件和 `R8.25` 进入门禁。 |
| 当前禁止 | 不直接修改正式 `03-详细设计.md`;不新增协议族;不写 DTO 字段 schema、Rust / JSON、HTTP route、RPC name、event topic、job trigger、function flow、状态矩阵、persistence、config、test。 |

### 2. 正式 §8 候选草稿

#### §8.1 协议契约范围与禁入边界

本节候选草稿只定义 L3-method-library 的协议 family、public shell、跨协议一致性和后续 Step 承接边界。它不定义 transport 绑定、函数级处理流、状态机、持久化、配置或测试方案。

| 范围 | 当前结论 |
|---|---|
| 协议 family | shared、Command、Query、Inbound Consumer、Outbound Event、Operations Job。 |
| public shell | 只描述 metadata、actor/source、result、page/cursor、marker、receipt/report、replay 等 family 级壳。 |
| 后续承接 | Step 9 负责逐接口 flow;Step 10~16 继续闭口 state、persistence、error、concurrency、config、observability、test。 |
| 禁入 | 旧 `MethodContent`、publish、snapshot、fingerprint、outbox、P0/P1、HTTP JSON、L0-bus、topic、raw payload。 |

#### §8.2 shared protocol helper

shared helper 是所有协议族的公共 public surface 约束,用于避免各协议族私造重复 DTO shell。

| shell family | 使用范围 | 规则 |
|---|---|---|
| metadata / correlation | Command、Query、Inbound、Outbound、Job | 只能作为 request / operation public context,不得暴露 transport private 字段。 |
| actor / source | api、worker、job、external source | 只承载 typed ref 或 safe summary,不得暴露 provider account、secret、adapter private identity。 |
| idempotency / replay | Command、Inbound、Job | duplicate / resume 必须复制 stored result、checkpoint 或 run history。 |
| result / rejection | Command、worker、job | 只定义 result family,具体成员留给后续 flow / error step。 |
| page / cursor | Query、Job、report | page cursor、checkpoint cursor、optimistic version 必须分离。 |
| public marker | Query、Outbound、Job、rejection | degraded / unavailable / stale / not-visible / blocked marker 只能复制正式 mapper / resolver / availability 输出。 |
| receipt / report | Inbound、Outbound、Job | 只承载 typed refs、safe summary、marker,不得承载 raw body。 |

当前 implementation boundary `commit-02-a` 对 shared helper 的 concrete contracts closure 只允许以下 foundation set:

| concrete foundation | exact carrier | closure rule |
|---|---|---|
| actor / metadata / page foundation | `ActorContext`;`RequestMetadata`;`CommandMetadata`;`QueryMetadata`;`PageRequest`;`PageToken`;`TraceId`;`IdempotencyKey` | 直接复用 `core-contracts`;不得新增本仓 local metadata/context wrapper。 |
| safe error foundation | `ErrorCode`;`ErrorDetail`;`ErrorResponse` | 只复用 `core-contracts` safe error carrier;L3-specific code family后移 Step 12。 |
| capability / job kind shell | `MethodLibraryCapabilityKind`;`MethodLibraryOperationsJobKind` | 只表达 capability / operations job family,不表达具体 command / query / job body。 |
| protocol shell set | `MethodLibraryCommandShell`;`MethodLibraryQueryShell`;`MethodLibraryEventShell`;`MethodLibraryJobShell`;`MethodLibraryViewShell` | 字段以 Step 6 `6B` 的 concrete shell set 为准;不得在 Step 8 抢写 request intent、selector、payload、receipt/report detail。 |
| placeholder normalization | `ActorContextRef`;`MethodAssetActorContextRef`;`CommandMetadataRef`;`MethodAssetRequestMetadataRef`;`MethodAssetTraceContextRef`;`MethodAssetIdempotencyContextRef` | 这些在 `commit-02-a` 只作为 legacy placeholder 理解,实现只能落到上述 foundation,不得继续扩成 local wrapper family。 |

#### §8.3 Command protocol family

Command protocol family 只定义 command 入口壳、request intent、accepted / rejected / duplicate / effect public shell。

| shell | 规则 | 后续承接 |
|---|---|---|
| command envelope | 复用 shared metadata、actor/source、idempotency。 | Step 9 定义 handler -> service flow。 |
| request intent | 只表达 command 意图 family,不写字段 schema。 | Step 9 / Step 12 继续闭口 validation 与 rejection。 |
| accepted result | 必须有 response assembly、stored operation result、effect candidate 来源。 | Step 9 / Step 13 继续闭口 replay。 |
| rejected result | 必须有 safe reason / marker 来源。 | Step 12 继续闭口 error recovery。 |
| duplicate result | 必须复制 stored result,不得重跑 mutation。 | Step 13 继续闭口 idempotency。 |
| effect summary | 只作为 public summary shell,不得写 outbox 或 transport delivery。 | Step 9 / Step 15 继续承接 observable effect。 |

#### §8.4 Query protocol family

Query protocol family 只定义 query envelope、selector family、response view、page、empty / not-visible / stale / degraded / unavailable public shell。

| shell | 规则 | 后续承接 |
|---|---|---|
| query envelope | 复用 shared metadata、actor/source。 | Step 9 定义 no-write read flow。 |
| selector | 只定义 selector family,不写字段 schema。 | Step 9 继续定义 read resolver 来源。 |
| response view | 只承载 safe view / typed refs / marker。 | Step 9~12 继续闭口 material availability。 |
| page shell | page cursor 与 optimistic version 分离。 | Step 9 / Step 13 继续闭口 cursor source。 |
| empty / not-visible | 不泄露 truth 是否存在。 | Step 12 继续闭口 safe surface。 |
| stale / degraded / unavailable | marker 只能复制 resolver / mapper / availability 输出。 | 缺 marker source 时停审。 |

#### §8.5 Inbound consumer protocol family

Inbound protocol family 固定 4 个 consumer family、typed payload boundary、intake、duplicate / quarantine / delayed / no-op、worker result shell。

| shell | 规则 | 后续承接 |
|---|---|---|
| inbound envelope | 复用 shared metadata/source,不承载 broker raw payload。 | Step 9 定义 consumer intake flow。 |
| typed payload boundary | 只承载 typed ref / safe summary。 | Step 14 继续配置外部依赖绑定。 |
| intake decision | 来自 intake decision / source port。 | Step 9 / Step 12 继续闭口分支。 |
| duplicate / quarantine / delayed / no-op | 必须有 receipt / stored result 来源。 | Step 13 继续闭口 replay / idempotency。 |
| worker result | 来自 worker entry result state。 | Step 15/16 继续观测和测试承接。 |

#### §8.6 Outbound event protocol family

Outbound protocol family 固定 34 个候选 event family、body-free event shell、event candidate、publication outcome、blocked / degraded / unavailable、publisher result shell。

| shell | 规则 | 后续承接 |
|---|---|---|
| outbound envelope | 不定义 topic、bus binding、delivery receipt。 | Step 14 继续外部依赖绑定。 |
| body-free fact payload | 只承载 typed refs / safe facts / marker,不得承载 raw event body。 | Step 9 定义 candidate assembly flow。 |
| event candidate | 来自 event candidate assembly。 | Step 9 / Step 11 继续闭口 persistence。 |
| publication outcome | 来自 publisher port / target registry / availability。 | Step 12/15 继续闭口 failure 和 observability。 |
| blocked / degraded / unavailable | marker 只复制 mapper / availability 输出。 | 缺 marker source 时停审。 |
| publisher result | 来自 worker publisher result state。 | Step 16 继续测试切口。 |

#### §8.7 Operations job protocol family

Operations Job protocol family 固定 8 个 job family、job input / result / progress / checkpoint / report boundary、partial / degraded / unavailable、duplicate / replay shell。

| shell | 规则 | 后续承接 |
|---|---|---|
| job input / dispatch | 不定义 scheduler、queue、lease、trigger。 | Step 9 定义 job service flow。 |
| progress / checkpoint | checkpoint cursor 不替代 page cursor 或 optimistic version。 | Step 13 继续闭口 resume。 |
| job result | 来自 job entry result state、progress、run history。 | Step 12/15 继续闭口 failure / observability。 |
| report boundary | 只承载 report boundary ref / safe summary / marker。 | Step 16 继续 evidence/test。 |
| partial / degraded / unavailable | 必须有 progress / marker / availability 来源。 | 缺来源时停审。 |
| duplicate / replay | 必须复制 checkpoint / run history,不得重跑 mutation。 | Step 13 继续闭口。 |

#### §8.8 protocol-to-object / port closure

| 协议族 | Step 6 object source | Step 7 port / seam source | Step 9 future owner |
|---|---|---|---|
| shared | operation context、idempotency guard、stored result、read / degraded decision | UnitOfWork、Clock、IdGenerator、stored result、page/version helper、mapper | 各 entry flow 通用前置。 |
| Command | API command entry、response assembly、stored result、event candidate assembly | truth repositories、policy diagnostic builder、stored result seam | command accepted / rejected / duplicate flow。 |
| Query | API query entry、read decision、degraded decision、response assembly | query resolver、degraded mapper、availability resolver、read repositories | no-write query flow。 |
| Inbound | intake decision、worker entry context、consumer entry、worker result | inbound source port、body-free adapter、stored result、availability | inbound intake flow。 |
| Outbound | event candidate assembly、publisher binding、publisher entry、worker result | publisher port、target registry、availability、handoff | publication flow。 |
| Job | job assembly、runner context、job entry、progress / result state | maintenance repositories、checkpoint store、run history、runtime registry | job execution / resume / report flow。 |

#### §8.9 cross-protocol public surface guardrails

| guardrail | 规则 |
|---|---|
| secondary type | 同一 public 概念不得在多个协议族私造不同 shell。 |
| naming drift | accepted、rejected、duplicate、degraded、unavailable、stale、not-visible、blocked、partial、no-op 必须保持同义。 |
| page/cursor/version | page cursor、checkpoint cursor、optimistic version 三者不得互相替代。 |
| receipt/report/result | surface 必须来自正式 object / port / mapper / stored source,不得由 service 拼装。 |
| body-free | inbound、outbound、job、report、artifact 不得承载 raw body。 |
| replay | duplicate / resume 不得重跑 mutation或重读 truth 重建 response。 |
| marker | public marker 只能复制 mapper / resolver / availability 输出。 |
| actor/source | public source 不暴露 adapter private identity 或 secret。 |

#### §8.10 stop-review 与后续承接

| 条件 | 处理 |
|---|---|
| 缺 Step 6 object / helper / entry state 主语 | 停审回 Step 6。 |
| 缺 Step 7 port / mapper / availability / stored source | 停审回 Step 7。 |
| 需要旧 `MethodContent`、outbox、P0/P1、snapshot、fingerprint 反推协议 | 停审,按 historical material 污染处理。 |
| 需要 DTO 字段、flow、state、persistence 才能说明协议 | 不在 Step 8 补口,交给后续 Step。 |
| Step 9 开工 | 必须先重置旧 Step 9 completed 状态,旧 `03_ddd_step_09_function_flows.md` 只作 historical material。 |

### 3. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否写入正式 §8 候选草稿 | 是。 |
| 是否只写在当前 Step 文件 | 是。 |
| 是否覆盖 shared / Command / Query / Inbound / Outbound / Operations Job | 是。 |
| 是否写入 protocol-to-object / port closure 与 cross-protocol guardrails | 是。 |
| 是否直接修改正式 `03-详细设计.md` | 否。 |
| 是否写具体 DTO 字段 / transport / flow / state / persistence / config / test | 否。 |
| 是否进入 `R8.25`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.25 自检与停审:先思考`;只允许思考 Step 8 completion checklist、旧材料污染、协议族覆盖、public marker / replay / report / page source 缺口、正式 §8 候选草稿可用性和 Step 9 进入门禁;不得直接修改正式 `03-详细设计.md`;不得新增协议族;不得写具体 DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得进入 `R8.26`、Step 9 或后续 Step。

## R8.25 自检与停审:先思考

### 1. 当前模块目标

| 项 | 内容 |
|---|---|
| 触发 | 计划要求完成 Step 8 后续任务,进入 `R8.25 自检与停审:先思考`。 |
| 本模块目标 | 思考 Step 8 是否满足关闭条件,并识别是否仍有必须阻断 Step 9 的缺口。 |
| 当前状态 | completed |
| 当前允许 | 只思考 completion checklist、停审条件、watch 项和 `R8.26` 写入边界。 |
| 当前禁止 | 不修改正式文档,不写字段 schema / transport / flow / state / persistence / config / test。 |

### 2. 自检轴

| 自检轴 | 思考结论 |
|---|---|
| Step 内模块完整性 | `R8.1`~`R8.24` 已形成开工、框架对齐、协议发现、六类协议 family、closure、public surface 审计和候选草稿。 |
| 协议族覆盖 | shared、Command、Query、Inbound、Outbound、Operations Job 六类已覆盖。 |
| 旧材料污染 | 旧 `MethodContent`、P0/P1、outbox、snapshot、fingerprint、HTTP JSON、topic 均被列入禁入。 |
| public shell 粒度 | 只到 family / shell / guardrail,未提前写 DTO 字段。 |
| closure 可用性 | 已有 Step 6 object source、Step 7 port / seam source 和 Step 9 future owner。 |
| watch 项 | marker、replay、report、page/cursor、receipt/result 仍需 Step 9~16 继续闭口。 |
| Step 9 进入条件 | 可以进入 Step 9 开工,但必须先重置旧 Step 9 completed 状态。 |

### 3. 停审判断

| 停审条件 | 当前判断 |
|---|---|
| 缺协议 family | 未触发。 |
| 协议只能靠旧材料成立 | 未触发,旧材料已禁入。 |
| 缺 object / port 主语导致 Step 9 无法开工 | 未触发,但后续字段级闭口仍需 Step 9 验证。 |
| 正式 `03-详细设计.md` 被提前修改 | 未触发。 |
| Step 8 写入字段 schema / flow / state / persistence | 未触发。 |
| watch 项被伪装成已闭合 | 未触发,均保留后续承接。 |

### 4. `R8.26` 写入边界

| `R8.26` 允许写入 | `R8.26` 禁止写入 |
|---|---|
| Step 8 completion checklist。 | 直接修改正式 `03-详细设计.md`。 |
| watch / stop 终态记录。 | 新增协议族或补 DTO 字段 schema。 |
| Step 9 进入门禁和旧 Step 9 historical_material 声明。 | 写 Step 9 function flow。 |
| 同步 flow / ledger 到 Step 9 等待确认。 | 修改 Step 9 文件内容。 |

### 5. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否只做 Step 8 自检思考 | 是。 |
| 是否形成停审判断 | 是。 |
| 是否形成 `R8.26` 写入边界 | 是。 |
| 是否修改正式 `03-详细设计.md` | 否。 |
| 是否进入 `R8.26`、Step 9 或后续 Step | 否。 |

next_allowed_action: 等待用户确认后进入 Step 8 `R8.26 自检与停审:再写入`;只允许写入 Step 8 completion checklist、watch / stop 终态、Step 9 进入门禁、旧 Step 9 historical_material 声明,并同步 flow / ledger 到 Step 9 等待确认;不得直接修改正式 `03-详细设计.md`;不得新增协议族;不得写具体 DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue、Rust struct / enum、JSON schema、错误码正文、function flow、完整状态矩阵、persistence schema、config key 或 test case schema;不得写 Step 9 flow。

## R8.26 自检与停审:再写入

### 1. 完成状态

| 项 | 内容 |
|---|---|
| 触发 | 计划要求完成 Step 8 后续任务,进入 `R8.26 自检与停审:再写入`。 |
| 本模块目标 | 写入 Step 8 completion checklist、watch / stop 终态、Step 9 进入门禁,并关闭 Step 8。 |
| 当前状态 | completed |
| Step 8 终态 | completed |

### 2. completion checklist

| 检查项 | 结果 |
|---|---|
| `R8.1`~`R8.26` 是否完整 | 是。 |
| 是否覆盖 shared / Command / Query / Inbound / Outbound / Operations Job | 是。 |
| 是否形成正式 §8 候选草稿 | 是,仅写入当前 Step 文件。 |
| 是否形成 protocol-to-object / port closure | 是。 |
| 是否形成 cross-protocol public surface guardrails | 是。 |
| 是否保留 marker / replay / report / page 等 watch 项 | 是。 |
| 是否直接修改正式 `03-详细设计.md` | 否。 |
| 是否写 DTO 字段 schema / transport / flow / state / persistence / config / test | 否。 |
| 是否允许进入 Step 9 开工 | 是,但必须重置旧 Step 9 completed 状态。 |

### 3. watch / stop 终态

| 类型 | 终态 |
|---|---|
| stop | 当前 Step 8 未发现阻断 Step 9 开工的 stop 项。 |
| watch | marker、replay、report、receipt/result、page/cursor、actor/source 的具体字段与流程来源必须由 Step 9~16 继续闭口。 |
| historical_material | 旧 Step 9 文件和旧正式 `03-详细设计.md` 只能用于污染审计,不得作为新 Step 9 的正向来源。 |

### 4. Step 9 进入门禁

| 项 | 内容 |
|---|---|
| 下一 Step | Step 9 `逐接口定义函数级处理流`。 |
| 下一模块 | `R9.1 开工与必读文档:先思考`。 |
| 进入条件 | 用户确认后进入 Step 9;先读取 ledger、flow、Step 8 completed 文件和当前 `00/01/02`。 |
| 必须声明 | 旧 `03_ddd_step_09_function_flows.md` 的 `[x] 已确认` 状态失效,仅作 historical material。 |
| 允许 | 思考 Step 9 开工边界、必读文档、Step 8 承接、旧 Step 9 污染隔离和模块计划。 |
| 禁止 | 直接继承旧 MethodContent / P0 / outbox / snapshot / fingerprint flow;不得直接写正式 `03-详细设计.md`。 |

### 5. 当前门禁

| 检查项 | 结果 |
|---|---|
| 是否关闭 Step 8 | 是。 |
| 是否形成 Step 9 进入门禁 | 是。 |
| 是否保持正式 `03-详细设计.md` 未修改 | 是。 |
| 是否写 Step 9 flow | 否。 |

next_allowed_action: 等待用户确认后进入 Step 9 `R9.1 开工与必读文档:先思考`;只允许思考 Step 9 开工边界、必读文档、Step 8 承接、旧 Step 9 historical_material 污染隔离和 Step 9 模块计划;不得直接修改正式 `03-详细设计.md`;不得继承旧 `03_ddd_step_09_function_flows.md` 的 `[x] 已确认` 状态;不得写 L3-method-library 具体 function flow、状态矩阵、persistence schema、config key、test case schema、DTO 字段 schema、HTTP route、RPC name、event topic、job trigger、scheduler、queue 或 Rust / JSON schema;不得进入 `R9.2`、Step 10 或后续 Step。
