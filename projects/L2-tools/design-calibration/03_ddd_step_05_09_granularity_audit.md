# L2-tools 03 Step 5~9 粒度再校准审计

> 创建日期: 2026-08-05
> 模式: full-restart / single-agent-serial
> 状态: in_progress
> 目的: 以 `L1-governance` 详细设计 Step 5~9 的逐对象、逐接缝、逐协议、逐 flow 粒度为对标，识别并关闭 L2-tools 当前中间产物中仍需要实现者自行拼装的契约。
> 正式文档: `projects/L2-tools/03-详细设计.md` 仍保持 write-closed，只有 Step 19 允许整体装配。

## 1. 审计输入与效力

| 输入 | 用途 | 效力 |
|---|---|---|
| `standards/document/详细设计讨论中间产物规范.md` | 三层台账、先思考后写入、逐 Step / 模块停审、回填门禁 | process authority |
| `standards/document/详细设计讨论流程_SOP.md` | Step 5~9 必答问题和最小产物 | process authority |
| `standards/document/详细设计书写规范.md` | 对象、trait、协议、函数流的可落码书写要求 | result authority |
| `standards/document/设计真相源闭环与可落码性标准.md` | 字段、DTO、state、UoW、phase、side-effect、replay 闭环 | implementability authority |
| `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md` | 模块级 capability / 文件 / owner / 测试切口粒度样本 | calibration sample only |
| `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md` | 每个对象字段、factory、member、状态、非法分支和来源粒度样本 | calibration sample only |
| `projects/L1-governance/design-calibration/03_ddd_step_07_trait_port_adapter_contracts.md` | 每个 Port / Store caller、implementer、签名、版本、UoW、fake parity 粒度样本 | calibration sample only |
| `projects/L1-governance/design-calibration/03_ddd_step_08_protocol_contracts.md` | 每个 protocol 和二级 public carrier 的闭口粒度样本 | calibration sample only |
| `projects/L1-governance/design-calibration/03_ddd_step_09_function_flows.md` | 每条 callable flow 的调用图、伪代码、错误、事务、副作用和测试粒度样本 | calibration sample only |
| L2 Step 5~9 主文件与 annex | 当前设计事实和待补缺口 | current L2 design input |

## 2. 对标维度

| 维度 | `L1-governance` 的可审查粒度 | L2 当前审计要求 |
|---|---|---|
| 模块 | 一个模块独立回答职责、文件、对象、Port、错误、测试和停审 | 七个实现模块逐一闭合；六个业务组成部分分别有 owner、入口、存储和 forbidden surface |
| 对象 | 每个 struct/enum/value object 独立字段表、factory/member、状态和非法分支 | 41 个 domain 对象及稳定 application/entry carrier 逐项有唯一定义、字段来源和构造路径 |
| 接口 | 每个 trait/Port/Store 独立 caller、implementer、方法、request/result/error、version/UoW、fake parity | 七个外部 Port、基础 Port、六个 Store 和 entry facade 逐方法可回指 |
| 协议 | 每个 Command/Query/Consumer/Event/Job 独立 DTO、二级类型、版本、错误、duplicate/replay | `13/11/5/4/4` 每项均能回指 Step 6 类型、Step 7 方法和 Step 9 flow |
| Flow | 每条 flow 独立调用图、可执行伪代码、UoW、状态、副作用、错误、重入和测试 | `CF/QF/IF/OF/JF` 每条都不依赖未定义 `...` 或泛化 helper |
| 证据闭环 | 每个结果可重读、每个 cursor/version 有权威来源 | L2 只使用 typed ref、safe summary、local watermark；不伪造 run/evidence/delivery/observation |
| 停审 | 模块/协议族/flow 各自有 gate 和 reopen 条件 | Step 5~9 必须分别记录 `pass/blocked`、`next_allowed_action`、source files 和 blocker |

## 3. 当前覆盖与再校准结论

| Step | 当前覆盖 | 粒度缺口 | 再校准动作 | 目标文件 |
|---:|---|---|---|---|
| 5 | 七模块、六组成部分和依赖方向已列出 | 模块内部 callable、错误、测试切口和跨模块回指仍以摘要表表达 | 增加逐模块 implementation card、capability -> file -> callable -> test 矩阵和模块停审 | `03_ddd_step_05_module_contracts.md` |
| 6 | 41 对象和多个 annex 已有字段/函数轮廓 | 稳定 carrier 的唯一来源、部分错误/构造 helper、对象到协议的回指不集中 | 增加对象索引、carrier closure、逐对象缺口表；修正 `ToolEventId`、`LocalAbortReason` 等定义 | `03_ddd_step_06_object_contracts.md`、相关 Step 6 annex |
| 7 | Port/Store annex 已有大量 trait 签名 | entry continuation、Consumer append、fake parity 和 blocked error 的精确方法映射分散 | 增加 seam ledger 和 exact callable index；补齐 continuation/append/mapper 方法 | `03_ddd_step_07_trait_port_adapter_contracts.md`、entry/ports annex |
| 8 | 协议族 annex 已列 DTO 和版本 | 二级 carrier 到 object/store/flow 的来源矩阵仍需集中；错误和 replay surface 需逐项核对 | 增加 protocol closure matrix；统一 `CommandUseCaseResult`、`ConsumerReceipt`、event identity frame | `03_ddd_step_08_protocol_contracts.md`、shared/event annex |
| 9 | CF/QF/IF 已较细，OF 已展开 | OF-02~04 仍有泛化 helper/省略号；JF 尚未展开；跨 flow phase audit 未完成 | 先闭合 OF exact helper，再写 JF-01~04，最后做 transaction/state/side-effect audit | `03_ddd_step_09_event_flows_annex.md`、`03_ddd_step_09_job_flows_annex.md`、Step 9 主文件 |

## 4. 必须关闭的 exact callable 缺口

以下名称在现有伪代码或表格中出现，但不能继续以隐含 helper 形式存在。每一项必须在唯一文件中给出 Rust 签名、输入来源、返回/错误、调用者和测试切口。

| ID | 缺口 | 当前问题 | 关闭位置 | 关闭条件 |
|---|---|---|---|---|
| `G-01` | `ContinuationKey` / `SafeMaterialContinuationInput` | 只有字段描述，缺完整构造/validate/digest 语义 | Step 7 entry annex | `derive`, `from_committed_material`, `validate`, `canonical_digest` exact |
| `G-02` | `CommandUseCaseResult<T>` | 只在 IF-03 flow 内出现 | Step 6 non-core carrier annex + Step 8 shared annex | 唯一定义、CF-11 返回映射、transient 不可转 receipt |
| `G-03` | `ConsumerAppendOperation` | variant 到 Store 方法分散在 flow | Step 7 stores annex + Step 9 consumer annex | 每 variant 1:1 method/result ref/error |
| `G-04` | `LocalResultRef` / `LocalAbortReason` | variant/source 和 unattributable 分支未集中 | Step 6 non-core carrier annex | 所有 variant、来源转换和 abort policy 闭合 |
| `G-05` | `ProtocolError` blocked mapping | `blocked_without_subject` 在 flow 出现而非 shared contract | Step 6 shared annex | constructor/error code/subject-required behavior |
| `G-06` | authorization clue mapper | `map_authorization_clue_resolution` 的调用/结果 surface 不够显式 | Step 9 consumer annex | IF-02 必须调用且只产生 assessment/gap |
| `G-07` | `ToolEventId` | 旧三元组/新 canonical frame可能并存 | Step 6 outcome annex + Step 8 event annex | `(event_name,schema,material_id,canonical_source_truth_refs)` 唯一 |
| `G-08` | `ExternalSubmissionAttempt::prepare` | factory 入参和 state symmetry 不完整 | Step 6 outcome annex + Step 7 stores | exact signature + prepared invariant + expected version |
| `G-09` | OF helper family | `map_class`, `prepare_or_replay_attempt`, `...` 等不可直接实现 | Step 9 event annex | 四 flow 只调用已定义 helper |
| `G-10` | JF flow family | planned 但无中间产物 | Step 9 job annex | 四条 bounded flow 独立闭合 |

## 5. 粒度再校准写入批次与门禁

| 批次 | 产物 | 状态 | 门禁 |
|---:|---|---|---|
| R-0 | 本审计文件、Step 5~9 缺口矩阵 | completed | 缺口有唯一 owner/file/close condition |
| R-5 | Step 5 模块 implementation cards | completed / pass | 七模块各自有 callable、错误、测试、forbidden surface |
| R-6 | Step 6 object/carrier closure | completed / pass | 每个 public type 有字段来源、factory/member、非法分支、协议回指 |
| R-7 | Step 7 seam closure | completed / pass | 每个 trait/store/entry method 有 caller/implementer/error/UoW/fake parity；`HubSnapshotRef` alias drift 已收敛 |
| R-8 | Step 8 protocol closure | pending | 每个 DTO/secondary type 有 source/mapper/version/error/replay |
| R-9 | Step 9 flow closure | pending | 每条 flow 有 exact callable、phase、side-effect、replay、tests |
| R-X | 跨 Step 5~9 audit | pending | 无未定义 helper、重复 truth、owner drift 或 phase contradiction |

## 6. 旧材料与上游 blocker

旧 `README.md` 和旧正式 03/05/06 继续标记为 `historical_material`，不得以其 Python 同进程、MCP client、HTTP/RPC、数据库、broker、scheduler 或 registry 语义补全本轮契约。无新增上游 blocker；`L2T-UP-001~009` 继续开放，受影响的 positive branch 必须保持 `blocked/unavailable/gap`。

## 7. 恢复与正式回填门禁

```text
current_document = 03-详细设计.md
current_step = Step 5~9 granularity recalibration / R-8
gate_status = in_progress
next_allowed_action = read Step 8 main/annexes and L1 Step 8, then write R-8 protocol closure addendum
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```

正式 `03-详细设计.md` 只有 Step 19 可写；本审计文件和各 Step addendum 是唯一允许承载本轮诊断、取舍和修复过程的地方。
