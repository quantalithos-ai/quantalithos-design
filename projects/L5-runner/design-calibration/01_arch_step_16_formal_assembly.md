# 01 架构 Step 16 · 正式文档整理

> 状态：`completed / formal_stop_review`
> 前置：`01_arch_step_01_requirements_baseline.md`～`01_arch_step_15_adr_traceability.md` 均已完成并通过门禁
> 正式输出：`projects/L5-runner/01-架构设计.md`

## 1. Step 内计划与写入前检查

- [x] 读取项目台账、架构 flow 和 Step 15 当前文件，确认恢复点。
- [x] 确认项目级门禁仅允许完成正式 01，不允许进入 02、实现或测试。
- [x] 确认文档级 flow 已完成 Step 1～15，允许 Step 16 full-restart 装配。
- [x] 确认所有前序 Step 文件均标记 `completed` 并允许正式回填。
- [x] 删除旧 `01-架构设计.md`，按 18 章主链从零重建。
- [x] 每章列出具体 calibration 来源和延伸阅读。
- [x] 完成章节、来源、图表、术语、污染、范围和真实性静态审计。
- [x] 完成跨架构单元总审计，补齐后续可落码承接矩阵，并更新 flow/ledger 进入正式停审。

## 2. 章节装配映射

| 正式章节 | 主要校准来源 | 装配结论 |
|---|---|---|
| §1 与上游关系 | Step 1 | 需求、全局规则、专项上游和历史材料身份分离。 |
| §2 业务背景与驱动力 | Step 1～2 | 以 owner truth 隔离、多轴状态和安全恢复为架构驱动力。 |
| §3 约束条件 | Step 1～2、14 | 不可变约束、当前取舍、非目标与 blocker 保持分离。 |
| §4 职责边界 | Step 3 | 做/不做/易混淆职责与边界红线。 |
| §5 系统边界与上下文 | Step 4 | L5 位置、正式上下文、输入输出和降级边界。 |
| §6 限界上下文与子域 | Step 5 | 三个核心、三个支撑和两个本地影子单元。 |
| §7 容器/部署架构 | Step 6 | 逻辑运行承载角色；不锁进程、框架或部署参数。 |
| §8 依赖方向与层间约束 | Step 7 | 内部分层、跨仓裁剪、依赖类型和禁止关系。 |
| §9 数据所有权与一致性 | Step 8 | Local truth、snapshot/projection/ref、forbidden body 与一致性口径。 |
| §10 关键交互与通信 | Step 9 | 同步判断、异步 owner 事实和后台延后承接。 |
| §11 关键技术选型 | Step 10 | 架构机制定稿；产品、框架、协议与 backend 后置或排除。 |
| §12 备选方案与取舍 | Step 11 | 仅比较仍符合硬边界的路径级替代方案。 |
| §13 横切关注点 | Step 12 | 六类横切约束和逐单元适用性。 |
| §14 演进路线 | Step 13 | 结构阶段、可接受债务、事实触发条件与不可回退红线。 |
| §15 风险与待确认 | Step 14 | `RUN-UP-001~008` 保持原状态，风险与待确认分表。 |
| §16 需求追溯 | Step 1、15 | 五个能力节点、核心/外围需求与追溯缺口。 |
| §17 ADR 索引 | Step 15 | 九项长期架构决策；不声称独立 ADR 文件或实施。 |
| §18 参考 | Step 1、15、16 | 只列正式基线、规范、专项上游和本轮校准产物。 |

## 3. 从 Step 5 起的可落码承接审计

本表只登记架构结论应如何被后续正式文档继续收敛，不提前定义实现对象、接口字段、schema、代码目录、测试结果或 evidence。`planned` 表示架构已给出方向、后续文档尚待展开；`blocked` 表示上游正式合同缺口阻止继续闭合；`waiting` 表示需等待文档顺序或用户授权，不代表已实现。

| 能力级承接项 | 当前架构锚点 | 后续正式承接位置 | 状态 | 真实性与边界说明 |
|---|---|---|---|---|
| 模块 / 架构单元 | §6 的选择与资格、运行意图、资源恢复核心子域，以及取得、诊断、入口支撑子域；§7 的逻辑运行承载 | `02-概要设计.md` 的模块/代码主体框架与职责边界；`03-详细设计.md` 的模块内 capability 到对象映射 | planned | 只承接已停审语义单元；不得把子域名直接伪装成代码模块或实现仓。 |
| 命令、查询、事件入口 | §10 的同步判断、异步 owner 事实、后台延后承接三类交互；§8 的 SDK/API/adapter seam | `02-概要设计.md` 的入口/接口骨架；`03-详细设计.md` 的 command/query/event/job surface；`04-配置设计.md` 的 transport 绑定（如适用） | blocked | exact client、公开方法、事件面、幂等和错误合同受 `RUN-UP-001~008` 约束；当前不命名 API、DTO、topic 或重试参数。 |
| 页面 / 入口视图 | §4、§6、§10 的安全展示组合、资格/生命周期多轴和 bounded preview；入口只能消费编排 view | `02-概要设计.md` 的入口视图/页面轮廓；`03-详细设计.md` 的 view 组合与展示降级 | planned | 只定义展示语义与来源/freshness 边界；不锁 GUI/CLI/桌面框架，不把 toast 或本地日志当成功证据。 |
| 状态对象与运行状态机 | §9 的 local truth / snapshot-ref 分离、selection generation、quarantine、accepted≠running、unknown/reconcile 保护 | `02-概要设计.md` 的对象/状态轮廓；`03-详细设计.md` 的状态主语、合法迁移、非法迁移与持久化承载；`06-验收标准.md` 的状态边界 | blocked | 状态轴和保护语义已成立，但 owner-facing 状态、字段、迁移触发与结果来源未闭合；不得创建全局单一 RunnerRun 状态机。 |
| SDK / Sandbox adapter 边界 | §5、§8、§10、§11 的 SDK-first、公开 API/adapter、Sandbox/Runtime 外部 owner 边界 | `02-概要设计.md` 的外部接缝轮廓；`03-详细设计.md` 的 adapter contract 与错误/来源映射；`07-实施计划.md` 的集成边界 | blocked | 不复用或编译 Sandbox 私有实现，不读取相邻仓内部存储；`RUN-UP-008` 及 Sandbox/Runtime 合同未闭合前不得宣称可接入。 |
| 下载与完整性验证流程 | §6、§9、§11 的 selection binding、quarantine→qualified、manifest/digest/signature/compatibility 分离 | `02-概要设计.md` 的取得/材料模块与流程轮廓；`03-详细设计.md` 的下载、resume、验证、quarantine、cache protection 细节；`04-配置设计.md` 的 transport/cache/redaction 配置边界 | blocked | 只能保持 pending/incomplete/quarantine/invalid/blocked 等姿态；locator、算法、签名和淘汰参数由 Artifact/治理合同决定，当前不写具体实现。 |
| 资源、清理与恢复一致性 | §6、§9、§10、§13 的 local probe 与 owner allocation/lease 双视图、active protection、unknown 冻结、reconcile/manual-review | `02-概要设计.md` 的资源/清理/恢复轮廓；`03-详细设计.md` 的 guard、对账、保护、清理与恢复流程；`06-验收标准.md` 的冲突/未知/误删边界 | blocked | 本地 PID、端口、连接、目录删除或 ACK 不能闭合 owner 结果；`RUN-UP-003/004/007` 未闭合时不得设计自动 replay 或强删路径。 |
| 配置边界 | §3、§11、§13 的配置不得启用 `latest`、绕过 authority/integrity/lease/cleanup、改变 truth owner 或把 unknown 改 success | `04-配置设计.md` 的配置项、默认/禁用/不兼容行为与变更约束 | waiting | 当前只保留架构级禁止边界，不创建 key、文件格式、默认值或平台 profile；需等待 02/03 的承载语义和用户授权。 |
| 测试切口 | §9、§10、§13、§16 的多轴状态、来源/freshness、query no-write、redaction、unknown/reconcile 和依赖边界 | `03-详细设计.md` 的最小验证入口回指；`05-测试方案.md` 的测试分层/数据/场景；`06-验收标准.md` 的正式验收映射 | waiting | 这里只登记必须可验证的架构边界，不声称已有测试、fixture、run 或结果；具体切口须待后续正式文档闭合后建立。 |
| 证据 / 审计边界 | §4、§9、§13、§15、§17 的 local record、safe summary、handoff posture/receipt 与正式 evidence/report/verdict/signoff ownership 分离 | `03-详细设计.md` 的 redaction、来源与 handoff 记录边界；`05-测试方案.md` 的审计/安全切口；`06-验收标准.md` 的证据边界；`07-实施计划.md` 的交付审计门禁 | blocked | 本地日志、preview、telemetry、ACK 或 receipt 不升级为正式证据；Observability 合同、可见性、retention 和 handoff surface 未闭合前不得生成 evidence 或 readiness。 |

承接审计结论：架构层已经给出后续可落码所需的能力类别、owner 边界和冻结条件，但没有把未闭合合同伪装成实现输入。`planned`/`waiting`/`blocked` 状态必须随后续正式文档同步推进；在 01 停审期间不创建 `implementation_execution_ledger.md`、boundary skeleton、代码或测试产物。

## 4. 术语与交叉引用统一

| 统一项 | 正式口径 |
|---|---|
| 本仓真相 | `Runner-owned local truth` / 正式本地真相，仅涵盖选择、意图、取得/保护、恢复和展示组合。 |
| 外部事实 | `owner truth`，本地只消费 `snapshot/projection/ref/status`。 |
| 运行材料 | `qualified material` 仅表示本地资格姿态，不等于 Release approved 或 execution success。 |
| 运行状态 | request、accepted、boundary、running、terminal、control、cleanup 分轴表达。 |
| 本地资源 | `local observation/probe`，不等于 Sandbox allocation/lease/cleanup。 |
| 恢复 | `reconcile/manual-review`，不等于 retry/replay 或上游 repair。 |
| 诊断交接 | `handoff posture/receipt`，不等于 evidence/report/verdict/signoff。 |
| 未闭合事项 | 统一引用 `RUN-UP-001~008`，不使用 ready、supported 或 completed 掩盖。 |

## 5. 最终静态审计与跨架构单元总审计

正式装配完成后已验证：

| 审计项 | 检查结果 | 结论 |
|---|---|---|
| 正式章节链 | §1～§18 顺序、标题和章节职责与架构书写规范一致 | pass |
| 章节来源 | 每章均列出具体 `design-calibration/01_arch_step_*.md` 来源与延伸阅读，引用文件存在 | pass |
| 图表格式 | 5 个 ASCII 图均有图题、`text` 代码块和图后 2～5 条说明；固定表列已按规范补齐 | pass |
| 单元停审承接 | Step 5/7/8/9/12/15 的单元、依赖、数据、交互、横切和 ADR 停审均能在正式章节或本 Step 承接 | pass |
| 跨架构单元总审计 | 职责唯一；无反向依赖、双真相、通信类别冲突、横切遗漏或孤儿追溯 | pass |
| 技术污染扫描 | Tauri/Electron/Rust/Docker/gVisor/Firecracker 与旧性能数字仅处于排除、后置或历史污染语境 | pass |
| 真实性与范围 | 未写代码、实现仓、baseline、commit、run、测试结果、artifact、report、evidence、verdict、signoff 或 readiness；改动范围仅为本仓设计材料 | pass |
| 可落码承接 | 10 类能力已登记后续位置与 `planned/blocked/waiting`，未创建 implementation ledger 或 skeleton | pass_with_upstream_blockers |
| 上游合同 | `RUN-UP-001~007 = blocked`；`RUN-UP-008 = pending`，未被本轮装配关闭 | pass_with_upstream_blockers |
| 文档差异/空白 | 对 `projects/L5-runner/` 执行 `git diff --check`；未发现未收口占位或 calibration 路径缺失 | pass |

### 5.1 静态检查依据

| 检查面 | 检查依据 | 结果边界 |
|---|---|---|
| 章节与标题 | `rg -n '^## ' projects/L5-runner/01-架构设计.md` | 仅证明 §1～§18 顺序存在，不证明内容已实现。 |
| 来源路径 | `rg -o 'design-calibration/01_arch_step_*.md'` 加逐路径 `test -f` | 仅证明引用的校准文件存在。 |
| Markdown 表格 | 逐表分隔线/行列数静态核对 | 仅证明当前 Markdown 结构列数一致。 |
| ASCII 图 | 逐个 `text` fenced block 与图后说明核对 | 仅证明图形表达符合格式，不证明运行时拓扑。 |
| 范围与空白 | `git diff --check -- projects/L5-runner/` 与修改路径审阅 | 仅证明本轮文档无 whitespace 错误且未扩大写入范围。 |

跨单元总审计结论：当前正式 01 的结构结论可以停审；上游 exact contract 和后续文档授权仍是阻塞条件，不得以本 Step 的静态 `pass` 解读为实现、集成、测试或 readiness 事实。

## 6. Step 门禁状态

```text
current_document = 01-架构设计.md
current_step = 16
current_module = formal_assembly
gate_status = formal_stop_review
gate_reason = formal_01_rebuilt_and_static_audit_passed_with_upstream_blockers
next_allowed_action = wait_for_user_review_and_explicit_02_authorization
formal_01_write_allowed = completed
formal_02_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```
