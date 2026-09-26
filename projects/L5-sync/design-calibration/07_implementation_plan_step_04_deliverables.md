# Step 4. 抽取实施对象与交付物

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 4
> 回填目标：正式 `07-实施计划.md` §4

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 4 / deliverables |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 5；以功能增量组织 phase，不按对象清单直接排期 |

## 本步输入

| 输入 | 来源 | 状态 |
|---|---|---|
| 计划文件树和模块契约 | `03-详细设计.md` §4～§6 | formal / stop_review |
| 协议/flow/state/UoW 契约 | `03-详细设计.md` §7～§14 | formal / stop_review |
| 测试切口和证据计划 | `03-详细设计.md` §15、`05-测试方案.md` §3/§6/§9/§13 | formal / stop_review |
| 配置/组合交付 | `04-配置设计.md` §7～§12 | formal / stop_review |
| 验收与报告门禁 | `06-验收标准.md` §10～§14 | formal / stop_review |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮要新增哪些代码模块？ | TypeScript 单 package 的 `src/index.ts`、`src/cli`、`src/orchestration`、五 feature、`src/adapters`、`src/operations`、`src/config`、`src/composition`；精确文件来自 03 §4.3。 | 03 §4.2/§4.3 |
| 要新增哪些协议/adapter/job？ | 10 Command、13 Query、3 Inbound Consumer、3 Job；Outbound Event=0；SDK/Git/fs/metadata/diagnostics inward adapter seams。 | 03 §6/§7 |
| 要新增哪些测试？ | unit、contract、flow、fault 四类，覆盖 protocol、state、UoW、idempotency、config、redaction、dependency boundary、CLI entry。 | 03 §15、05 §3/§6 |
| 要产生哪些脚本/报告？ | `scripts/gates`、`scripts/reports`、`scripts/checks`、可选 `scripts/dev`；固定 artifacts/reports roots；实际实例仅未来实施阶段生成。 | 05 §9/§13、目录规范 §10 |
| 哪些设计对象不是独立交付？ | 29 objects、17 states、42 leaf 是跨模块契约，必须在对应功能纵切落地；不能拆成“先实现所有对象”阶段。 | 07 书写规范、03 §16 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 03 文件树使用 `{a,b}` 紧凑表示 | 实现者可能误创建合并文件 | 正式计划按职责和 boundary 引用，实施时独立文件 |
| 29 object 数量大 | 按对象拆分会失去可验证纵切 | 按 CP/行为链分配到 PH-02～PH-07 |
| script/report 目前不存在 | 不能把路径写成已生成 | 交付物标为 planned，证据实例保持 absent |
| external adapter positive surface 未闭合 | 不能把 adapter 交付写成 integration complete | 交付物分为 local contract、adapter seam、positive integration 三层 |

## 改动前后对比

| 维度 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 代码清单 | 只有 03 planned tree | 按功能/基础设施/测试/脚本/台账分类 | 便于 phase 分配和完成判定 |
| 协议 | 只列总数 | 指定入口族和禁止 outbound event | 防止遗漏 Query/Job 或新增 publisher |
| 交付判定 | 泛化“代码完成” | 每类交付绑定来源、落点、门禁和状态 | 可审计 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 将 29 objects 各列成任务/交付物 | 看似细 | 横向堆叠，无法形成行为闭环 | 拒绝 |
| 只列五个 feature 目录 | 简短 | 漏掉 protocol、config、scripts、evidence | 拒绝 |
| 以功能纵切为主、以模块/文件作为边界内交付物，并另列脚本/台账/证据载体 | 可验证且完整 | 表格较多 | 采用 |

## 结构化中间产物

### 实施对象族

| 对象族 | 包含内容 | 交付姿态 | 主来源 |
|---|---|---|---|
| Shared runtime/contract | envelope、result、typed refs、error、ID/digest、UoW/idempotency ports | planned；工具链未定 | 03 §5.1/§7.1/§10/§12 |
| CP1 selection/access | 5 objects、owner access/read repositories、eligibility flow | local planned；owner positive blocked | 03 §5.2/§8/§9 |
| CP2 binding/metadata | 7 objects、binding/manifest/cursor/mapping/observation stores | logical planned；physical blocked | 03 §5.3/§10 |
| CP3 materialization | 5 objects、source/Git/fs ports、clone/pull flow | local safety planned；source/tool positive blocked | 03 §5.4/§8/§10 |
| CP4 conflict/recovery | 5 objects、checkpoint/resolution/probe ports | planned；formal probe blocked | 03 §5.5/§9/§11/§12 |
| CP5 handoff/provenance | 7 objects、candidate/attempt/Decision/provenance ports | local layering planned；Governance positive blocked | 03 §5.6/§7/§8 |
| Query/diagnostic | 13 Query、read-only composition、safe diagnostic | planned local contract | 03 §7.3/§14 |
| Operations | 3 Consumer、3 Job、receipt/report stores | planned/blocked | 03 §7.4、05 §6 |
| Config/composition | 42 leaves、4 profiles、loader/validator/builder/capability snapshot | planned；local choices blocked | 04 §7/§9 |
| CLI | parser-neutral entry/presentation for clone/pull/status/push-review and maintenance/recovery | waiting on local tool choices | 03 §4.3/§7、`SYNC-LOCAL-003/004` |
| Tests | unit/contract/flow/fault suites、negative and forbidden-effect spies | planned；runner unknown | 03 §15、05 §3/§6 |
| Gate/report tooling | gate scripts、report generator、artifact/report checks、acceptance handoff templates | planned；no instances | 05 §9/§13、06 §10 |
| Implementation records | project ledger、13 boundary ledgers、handoff records | planned/blocked; design-side only now | 07 台账规范 |

### 交付物清单

| 交付物 | 类型 | 来源章节 | 预计落点 | 完成判定（未来） | 当前姿态 |
|---|---|---|---|---|---|
| package/runtime baseline | code/config | 03 §3/§4、04 §9 | `/home/aris/Projects/quantalithos-sync` package root | package/runtime/toolchain contract fixed and gate checked | blocked |
| shared contract and error surface | code | 03 §7.1、§11/§12 | `src/orchestration`、feature `domain/ports` | typed carrier/error tests and no raw leakage | planned |
| selection/access vertical slice | code/test | 03 §5.2、§8.2、05 TC-MOD-001 | `src/selection_access` + tests | explicit selector/access negative and local UoW cuts | planned |
| binding/metadata vertical slice | code/test | 03 §5.3、§10、05 TC-MOD-002 | `src/working_copy_metadata` + tests | generation/provenance/cursor/mapping logical contract | blocked physical |
| materialization safety slice | code/test | 03 §5.4、§8.2、05 TC-MOD-003 | `src/source_materialization` + adapters/tests | path/dirty/gap/unknown and finalize UoW cuts | blocked positive |
| conflict/recovery slice | code/test | 03 §5.5、§9/§11/§12 | `src/conflict_recovery` + tests | manual intent/checkpoint/probe/idempotency cuts | blocked probe |
| review handoff/provenance slice | code/test | 03 §5.6/§7/§8 | `src/review_handoff_provenance` + tests | layer separation and provenance protection | blocked owner |
| query/read surface | code/test | 03 §7.3/§8.3、05 §6 | `src/*/application`、composition/tests | 13 Query zero-write and degraded views | planned |
| operations surface | code/test | 03 §7.4、05 §6 | `src/operations` + tests | receipts/item results/exact replay/no repair | blocked source/scheduler |
| config/composition | code/test | 04 §7/§9、05 §8 | `src/config`、`src/composition` + config tests | strict 42-leaf validation and four profiles | blocked local choices |
| CLI surface | code/test | 03 §4/§7、05 §6/§9 | `src/cli` + entry tests | explicit selection, safe presentation, no forbidden effects | waiting parser/bin |
| gate/report/check scripts | scripts | 05 §9/§13、06 §10 | `scripts/{gates,reports,checks,dev}` | fixed run-scoped roots and redaction/link checks | planned |
| raw/report/acceptance artifacts | evidence | 05 §13、06 §10/§14 | `artifacts/test/<run_id>`、`reports/...` | future fixed run only; human review required | absent / not_created |
| implementation ledgers | ledger | 07 §3/§6/§11 | design `design-calibration/implementation*` | all planned skeletons exist; no fake execution state | planned/blocked |

### 非交付物

| 非交付物 | 原因 |
|---|---|
| Project/Artifact/Baseline/Review Gate/Workspace/Archive/Git remote truth | 外部 owner，不属 Sync |
| outbox/topic/publisher/event truth | Outbound Event=0 |
| physical `.qs-sync` schema/migration/retention/crash implementation | `SYNC-UP-006` 未闭合 |
| Git LFS、浅克隆、GUI/Tauri、daemon、remote sync | historical/future 或永久禁止 |
| 真实实现仓、package lock、安装依赖、运行结果 | 当前用户只授权设计计划 |

## 回填草稿

正式 §4 将以对象族、代码/测试/配置/脚本/证据/台账交付物表为主，明确交付物来源、未来完成判定和当前 blocked/waiting；不把 29 objects 或文件树复制成横向任务清单。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| package/bin/parser/runner 选择 | package、CLI、tests、scripts 交付 | PH-01 |
| physical metadata driver | CP2/PH-02 | PH-02 |
| external source/Git/fs/review contracts | PH-03～PH-05 | 对应 boundary |
| evidence/report generator ownership | PH-07/PH-08 | Step 7/11 |

## 进入下一步条件

- [x] 实施对象族和交付物可回指正式文档。
- [x] 交付物与非交付物清晰分离。
- [x] 未把设计对象清单误当阶段顺序。
