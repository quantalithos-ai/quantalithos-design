# Step 2. 明确实施目标、范围和非范围

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 2
> 回填目标：正式 `07-实施计划.md` §2

## Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 2 / scope_and_non_scope |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 下一步 | Step 3；前置条件和阅读矩阵必须先收稳 |

## 本步输入

| 输入 | 来源 | 状态 | 说明 |
|---|---|---|---|
| FR/BR/AC/VETO/NFR | `00-需求文档.md` | formal / stop_review | 需求和安全红线 |
| CP1～CP6 与设计目标 | `02-概要设计.md`、`03-详细设计.md` | formal / stop_review | 阶段纵切边界 |
| 29 objects、protocol、state、UoW | `03-详细设计.md` | formal / stop_review | 未来实现契约，不是当前代码授权 |
| P0/P1/P2 与证据上限 | `05-测试方案.md`、`06-验收标准.md` | formal / stop_review | 计划 gate 和 release ceiling |

## SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 本轮最小可交付结果是什么？ | 可按 phase/boundary 实现和验证的 TypeScript/ESM library+CLI 计划；先闭合 local contract、negative path、状态/UoW/幂等和证据脚本边界。 | 03 §4～§16、05 §2/§9、06 §2/§7 |
| 哪些能力必须覆盖？ | explicit selection/access、logical metadata/binding、status/clone/pull safety、conflict/recovery、review handoff/provenance、13 Query zero-write、3 Consumer/3 Job local contract、配置和 redaction。 | 00 FR/BR、03 §2/§7、06 AC-SYNC-001~020 |
| 哪些正向能力只能 blocked/waiting？ | SDK owner/source/access/review/probe、物理 `.qs-sync`、Git/filesystem positive support、CLI/package/toolchain、真实 event/scheduler/report runner。 | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |
| 哪些能力明确不做？ | 自动 merge/rebase/push/stash、dirty overwrite、Project/Artifact/Baseline/Review/Workspace/Archive/Git remote truth、LFS/浅克隆/GUI/Tauri/daemon、Workspace rebuild 和 Artifact/evidence materialization。 | 00/01/03/06 红线 |

## 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 旧材料把“同步完成”当作单一成功 | 会把 local finalize、ACK 或 Git commit 升格为外部 truth | 按 CP、层级结果和三值 gate 拆分 |
| 外部 positive integration 未闭合 | 不能把全部 P0 名称写成已可运行 | P0 local/negative 可计划；positive seam 标 blocked/waiting |
| 03 文件树很大 | 容易按对象/文件拆 phase | 只按可验证功能增量拆 phase，文件作为交付物而非主轴 |

## 改动前后对比

| 维度 | 改动前 | 改动后 | 理由 |
|---|---|---|---|
| 目标 | 泛化的“实现 Sync” | local safety/consistency contract 的可验证实施路径 | 贴合 00～06 真相 |
| P0/P1 | 混合描述 | P0 local/negative，P1 external/physical blocked，P2 deferred | 防止 scope 膨胀 |
| 非范围 | 旧 README 的 Rust/Tauri/LFS 选择 | 明确历史、未来和永久禁止三类 | full-restart 清除污染 |

## 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 一次覆盖所有 29 object 和外部 adapter | 表面完整 | 无法验证，且会猜测未闭合合同 | 拒绝 |
| 只规划 local fake | 易启动 | 不能覆盖真实 handoff、Git/fs 和 owner boundary | 拒绝 |
| 以 local contract 为主线、按依赖逐步接入外部 seam，未闭合处显式 blocked/waiting | 可验证、可回退、保留真相边界 | 需要更多 gate 和 blocker 台账 | 采用 |

## 结构化中间产物

### 实施目标表

| 目标 | 覆盖内容 | 完成判定（未来） | 当前姿态 |
|---|---|---|---|
| `IMPL-G01` | 共享 carrier、错误、ID/digest、UoW/idempotency seam | local contract、negative test 和 gate 通过 | planned / blocked |
| `IMPL-G02` | CP1/CP2 selection/access 与 logical binding/metadata | explicit selection、generation、query zero-write、provenance relation 可验证 | planned / blocked |
| `IMPL-G03` | CP3 status/clone/pull/materialization safety | known-safe apply→finalize；dirty/gap/unknown 不产生危险 effect | planned / blocked |
| `IMPL-G04` | CP4 conflict/recovery/state consistency | 17 state、checkpoint、probe、resume/cancel、unknown reload 可验证 | planned / blocked |
| `IMPL-G05` | CP5 review handoff/provenance | candidate/attempt/transport/probe/Decision 层不混淆 | planned / blocked |
| `IMPL-G06` | CLI/query/consumer/job/config/diagnostic/evidence seams | explicit entry、13 Query zero-write、3 Consumer/3 Job bounded contract | planned / waiting |

### 实施范围

| 类别 | 内容 | 来源 | 本轮计划 | 说明 |
|---|---|---|---|---|
| local domain/application | 五 feature 的 exact objects、policies、flows、state helpers | 03 §5～§12 | 是（planned） | 不补字段或状态 |
| inward ports/adapters | SDK、Git、filesystem、metadata、diagnostic typed seams | 03 §5.7/§13/§14 | 是（按 gate） | positive contract 未闭合则 blocked |
| public protocol | 10 Command、13 Query、3 Consumer、3 Job | 03 §7、05 §3/§6 | 是（contract first） | Outbound Event=0 |
| config/composition | 42 leaf、4 profiles、cold builder、capability ceiling | 04 §7/§9 | 是（planned） | 不启用 hot/LKG/admin override |
| tests/scripts/reports | unit/contract/flow/fault、G0～G7、固定 roots | 05 §4/§9/§13 | 是（future implementation） | 当前不执行 |
| acceptance handoff | AC/VETO/S/A/B/R 与 report audit | 06 §10～§14 | 是（future delivery） | 当前不生成实例 |

### 非范围

| 非范围 | 处置 |
|---|---|
| Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive、Git remote truth | 只消费 owner seam，不创建/修改/伪造 |
| 自动 merge/rebase/push/stash、dirty overwrite、blind replay、自动冲突选择 | 永久禁止；命中 VETO |
| physical `.qs-sync` schema、migration、retention、crash semantics | `SYNC-UP-006` blocker；先回写设计 |
| LFS、浅克隆、GUI/Tauri、daemon、批量预取/比较 | historical/future；无授权不建目录或 capability |
| 具体 Node 版本、package manager、package/bin、CLI parser、Git library | `SYNC-LOCAL-001~005` 未闭合前不锁定 |
| 真实 run、artifact、report、evidence、verdict、signoff、readiness | 仅定义未来路径和 gate，不创建实例 |

## 回填草稿

正式 §2 将写明：本轮实施目标是把当前 03/04/05/06 已闭合的 local contract 转成按阶段可验证的代码、测试、配置和证据路径；外部 positive integration、物理 metadata、工具链和历史选择保持 blocked/waiting；非范围与永久红线不因实施便利性放宽。

## 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| P0 local 与 P1 positive 的边界是否保持 | phase gate 和 release 解释 | Step 5 phase 审查前 |
| 是否启用任一历史工具选择 | 可能触发 00～06 回写 | 有明确 scope trigger 时 |
| 外部 source/Review/SDK 正向合同 | PH-03/05/06 | 对应 boundary 开工前 |

## 进入下一步条件

- [x] 目标、范围和非范围均可追溯到正式 00～06。
- [x] P0/P1/P2 和 blocked/waiting 分层明确。
- [x] 未新增需求、对象、字段、协议或状态。
