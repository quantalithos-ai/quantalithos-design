# Step 1. 确认实施输入边界

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 1
> 回填章节：`07-实施计划.md` §1 与上游文档的关系声明

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 1 · 确认实施输入边界 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | 正式 `00`～`06`、各自 calibration flow/实施承接、07 SOP/书写规范、中间产物规范、真相源标准、代码实施台账规范 |
| 正式 07 写入 | `false`；仅 Step 13 允许 full-restart |
| 下一动作 | 进入 Step 2 · 实施目标、范围和非范围 |

## 2. 本步输入

| 上游文档 | 当前状态 | 本计划用途 | 输入结论 |
|---|---|---|---|
| `00-需求文档.md` | `formal_stop_review` | 需求能力、FR/BR/DR/NFR、AC 与 VETO 追溯 | 可作为范围入口；不在 07 重写 |
| `01-架构设计.md` | `formal_stop_review` | 浏览器客户端边界、SDK-only、owner truth、依赖方向 | 可作为阶段依赖与红线输入 |
| `02-概要设计.md` | `formal_stop_review` | 五个组成部分、对象/接口/flow/state 骨架 | 可作为纵切组织轴，不新增对象 |
| `03-详细设计.md` | `formal_stop_review` | 十模块、计划文件树、5 Command、16 Query、1 consumer、状态/错误/一致性/测试切口 | 直接实现契约；exact owner surface 缺口阻塞正向实现 |
| `04-配置设计.md` | `formal_stop_review` | 四项配置、三 profile、startup-only、strict/fail-closed | 配置阶段门禁输入；不推导 readiness |
| `05-测试方案.md` | `formal_stop_review` | 96 TC、suite/gate、八 EV family、路径与回归 | 阶段测试/证据入口；尚未执行 |
| `06-验收标准.md` | `formal_stop_review` | P0、VETO、缺陷/风险/签署/完成判定 | 阶段验收门禁；当前实际验收仍未进入 |

## 3. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 00～06 是否完整存在？ | 是；七份正式文档均存在且已停审。 | 项目目录与各 calibration flow |
| 哪些是本轮 design baseline？ | 以当前工作区正式 00～06 内容作为文档 baseline；设计仓 commit hash 未固定，故不能把其写成实现 baseline。 | `06-验收标准.md` §3、07 SOP Step 1 |
| 详细设计是否足以 1:1 实现？ | 安全骨架和客户端边界足够安排 planned phases；exact owner/SDK contract、目标仓/package/toolchain、部分 carrier/diagnostic/browser authority 未闭口，不能移交 positive implementation。 | `03` §16～§17、`06` §13 |
| 测试与验收能否定义阶段门禁？ | 能定义结构性 P0、安全负向、语义和证据完整性门禁；具体 positive integration 仅在 baseline enabled 且合同固定后适用。 | `05`、`06` §2/§4/§5/§10 |
| 是否发现文档冲突？ | 未发现会阻断“实施计划设计”的直接冲突；发现多项上游 pending，均传递为 implementation blocker/residual。 | 00～06 cross-document audit |
| 哪些缺口阻塞实施移交？ | 实现仓不存在；design baseline 未固定；exact owner/SDK surface 未闭口；四配置和测试脚本均 planned；因此只能规划，不得开工。 | `03` §17、`06` §3/§4、目标路径检查 |

## 4. 当前文档问题诊断

| 问题 | 影响 | 处理 |
|---|---|---|
| 目标实现仓 `/home/aris/Projects/quantalithos-console` 不存在 | 无法执行目录、package、toolchain、git 或代码门禁 | 记为 `BLK-CON-07-001`，Step 8/12 继续传递；不创建实现仓 |
| 设计仓当前改动未形成不可变 baseline | 不能为 boundary 填真实 design commit hash | 使用 `design_baseline=not_fixed`；移交前必须固定并回写台账 |
| exact owner/SDK contract pending | 正向 adapter/command/topic 实现可能需要猜字段或权限 | 所有受影响 boundary 标 `blocked / wait_design`；只规划 safe/disabled posture |
| 旧 README/draft/旧 07 可能污染实施路径 | 可能把旧 provider、技术框架或固定指标带入 | 只作为 historical_material；Step 13 做污染审计 |

## 5. 改动前后对比

| 项 | 进入 Step 1 前 | 收口后 |
|---|---|---|
| 输入主线 | 只有 06 停审结论，尚无 07 工作台 | 固定 00～06 为正式输入，建立 07 flow 与 Step 1 产物 |
| 实施事实 | 容易误把 planned 文件树当实现 | 明确实现仓、代码、run、evidence 均不存在 |
| blocker 处理 | 可能留给实现者临场判断 | 以 blocker ID 和 `wait_design` 传递，不允许补 schema |
| 正式写入 | 未定义 | Step 13 前明确关闭 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接按 03 文件树写编码任务 | 快，但会把 planned path 当现实 | 越过仓、工具链和 contract 门禁 | 不采用 |
| 先建立 phase/boundary 计划，再由实现仓确认事实 | 保护 truth boundary，可审查、可暂停 | 需要保留更多 planned/blocked 状态 | 采用 |
| 因 blocker 取消 07 | 避免不实实现，但无法交付实施路径 | 06 已明确可规划的安全骨架被浪费 | 不采用；允许完成 planned 07，但不移交实现 |

## 7. 结构化中间产物

### 7.1 输入闭环矩阵

| 闭环项 | 来源 | 状态 | 阻塞范围 | 处理 |
|---|---|---|---|---|
| 字段/DTO 来源 | `03` §5～§8、§16 | `pass_for_planning / blocked_for_positive` | 所有需要 exact owner material 的 boundary | 不新增字段；合同到达后回写 |
| 状态闭环 | `03` §9～§12；`05` §6；`06` §8 | `pass_for_planning` | 正向实现前需 baseline | 使用正式状态名，不在 07 改名 |
| phase boundary | `03` §16；`05` §14；`06` §12 | `planned` | 所有 implementation boundary | Step 5/6 明确依赖，后续 phase 不前置 |
| 测试/证据闭环 | `05` §9/§13；`06` §10 | `planned / not_created` | gate/release boundary | 只定义路径和生成责任，不伪造结果 |
| 配置闭环 | `04` §3～§12 | `pass_for_planning / not_bound` | config/bootstrap boundary | strict/startup-only；无默认 authority 扩展 |

### 7.2 初始 blocker / residual

| ID | 类型 | 说明 | 影响 | 下一处理 |
|---|---|---|---|---|
| `BLK-CON-07-001` | blocker | 实现仓不存在，无法做 worktree/build/toolchain 检查 | 实现移交、所有 boundary activation | 等实现仓 authority；不创建仓 |
| `BLK-CON-07-002` | blocker | exact owner/SDK contract 未闭口 | positive adapters、commands、topic activation | 回写 03/05/06 后再开工 |
| `BLK-CON-07-003` | blocker | design baseline 未固定 | Commit/Handoff Gate 无法绑定真实 hash | Step 12 前固定 baseline |
| `RES-CON-07-001` | residual | browser/AT matrix、diagnostic sink、carrier medium pending | selected gate 与可选绑定 | 保持 disabled/semantic-only/session-volatile |

## 8. 回填草稿

> 校准来源：本文件“结构化中间产物”与“输入闭环矩阵”。

正式 §1 应声明：实施计划承接正式 00～06；03 是直接实现契约，05/06 分别提供测试和验收门禁；当前目标实现仓不存在、design baseline 未固定、exact owner contract pending，故本文件只提供 planned implementation path，不构成实现授权。

## 9. 待确认事项

| 事项 | 影响 | 截止点 |
|---|---|---|
| 目标实现仓何时创建、由谁提供 | 所有 implementation boundary | Step 8 前；否则保持 blocked |
| design baseline 采用哪个不可变 ref | Commit/Handoff Gate | Step 12 移交前 |
| exact owner/SDK positive surface | PH-03/04/05/06 | 对应 boundary 开工前 |
| 用户是否允许后续实现 agent 接手 | 07 完成判定 | 正式 07 末；本轮不自行实现 |

## 10. 进入下一步条件

- [x] 00～06 正式文档存在并明确状态。
- [x] 实施规划与实现事实边界已分离。
- [x] blocker/residual 已编号并有处理口径。
- [x] 正式 07 写入仍关闭。
- [x] Step 1 结论允许进入 Step 2；不代表允许进入实现仓。
