# L5-sync 架构 Step 13 · 演进路线

## 1. Step 状态

| 字段 | 内容 |
|---|---|
| 状态 | `completed / pass_with_upstream_blockers` |
| 对应 SOP | `架构设计讨论流程_SOP.md` Step 13 |
| 输入 | Step 10 技术机制、Step 11 取舍、Step 12 横切、`SYNC-UP-001~010` |
| 回填章节 | 正式 01 §14 |
| 下一步 | Step 14：风险与待确认事项 |

## 2. Step 内计划

- [x] 说明当前阶段做到哪里才算架构足够，不写实施排期。
- [x] 以正式合同/事实触发后续阶段，不用 Sprint、日期或主观愿望。
- [x] 区分可接受和不可接受的设计债务。
- [x] 核对外围能力不会变成默认未来主线。
- [x] 保持 00→01→02 串行门禁与 formal stop review。

## 3. 本步输入

| 输入 | 作用 |
|---|---|
| Step 10 | 当前采用机制与历史技术方向的 pending 口径 |
| Step 11 | 受控本地桥主线与取舍 |
| Step 12 | 安全/韧性/性能/配置/审计判断口径 |
| `SYNC-UP-001~010` | 当前不能被架构文档假装解决的上游缺口 |

## 4. SOP 问题回答

### 4.1 当前阶段做到哪里才足够？

架构阶段只需闭合：五个上下文、local/external truth、依赖方向、运行边界、通信方式、技术机制、横切约束、风险与追溯。具体 CLI 命令签名、metadata schema、adapter trait、状态枚举、恢复算法、配置键和测试切口留给 02~07；没有上游正式合同的内容保留 blocked，不以架构推测替代。

### 4.2 第一批必须守住哪些结构？

必须守住显式选择/权限 gate、working-copy binding、只读 status、source/working-copy 分离、dirty/path protection、local checkpoint/cursor、冲突停机、unknown probe、handoff/decision 分层、provenance/redaction 和 owner seam。

### 4.3 哪些能力后续演进？

在核心边界闭合后可演进：更丰富的 status/repair/rebind、增量和断点恢复优化、多来源批量预取、多个结果安全比较、LFS/浅克隆、大仓性能、GUI/Web IDE 壳层和受控事件提示。它们都不能改变核心安全门禁或 owner ownership。

### 4.4 哪些债务可接受？

可接受：精确 SDK surface、source comparator、metadata schema、Git adapter 技术和性能阈值未定，只要保持 blocker 并使危险路径 blocked；外围能力暂不进入主线。不可接受：用 cache/ACK/commit 替代 truth、允许隐式覆盖/自动 push、复制外部正文、删除 provenance、让未确认合同伪装成 supported。

### 4.5 哪些事实会触发调整？

上游发布正式 source/handoff/comparator/schema 合同；真实 workload 显示全量 materialization 不可接受；多个受支持 Git 工具需要稳定 adapter capability；用户对 GUI/批量/离线场景有正式需求；安全审计发现现有边界不足。触发条件必须来自正式文档、接口或验证输入，不是历史 README。

## 5. 当前文档问题诊断

| 旧演进描述 | 问题 | 当前修正 |
|---|---|---|
| 以“阶段 1/2/3 跑通”宣称实现路线 | 容易伪造实施进度与 readiness | 改为事实/合同驱动的架构阶段 |
| 以失败率/两个 Sprint 作为触发 | 无真实数据或项目授权 | 改为 workload/contract/需求触发 |
| GUI/Web IDE 写成目标架构 | 外围产品能力被自然膨胀 | 保留为可选入口壳层，需新需求 |
| repair/rebind、大仓优化默认未来必做 | 未确认优先级 | 只有 trigger 成立时进入后续阶段 |

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| A. 按日期/Sprint 排架构演进 | 不采用 | 属于实施计划且当前无事实依据。 |
| B. 按安全闭环→合同闭合→规模增强→入口增强演进 | 采用 | 能保持架构稳定并对上游事实敏感。 |
| C. 一次性设计全部 GUI/LFS/离线/批量能力 | 不采用 | 会扩大未验证表面积并稀释核心边界。 |

## 7. 结构化中间产物

### 7.1 演进路线表

| 阶段 | 必须成立 | 当前允许保留 | 后续扩展 | 进入触发 |
|---|---|---|---|---|
| E0 架构基线 | 五个上下文、owner/data/dependency/communication/redline/trace 闭合 | 精确协议和 schema pending | 进入 02 概要设计 | 用户明确授权 02；01 停审通过 |
| E1 最小安全闭环设计 | select/access、bind、status、materialize、conflict/recovery、handoff 分层可落到对象/状态/adapter | unsupported owner surface 可 blocked | repair/rebind、更多诊断 | SDK/source/handoff 最小合同闭合 |
| E2 增量与恢复强化 | cursor/comparator/mapping/gap/probe/atomic apply 合同完整 | 个别 source 不支持可显式 unsupported | 多来源、批量、安全比较 | 上游版本/增量/恢复合同发布 |
| E3 规模与工具适配 | workload、Git tool/LFS/浅克隆支持矩阵有证据 | 非主流工具保持 unsupported | 大仓优化、更多 adapter | 真实 workload 和 compatibility 证据成立 |
| E4 入口与生态增强 | 核心语义可复用且入口无旁路 | CLI/交互入口可继续主导 | GUI/Web IDE/受控事件提示 | 正式产品需求 + 无安全门禁弱化 |

### 7.2 设计债务表

| 债务 | 当前判断 | 可接受条件/红线 |
|---|---|---|
| 精确 SDK surface 未闭合 | 可接受/blocked | 不写方法/DTO，不调用私有 seam |
| source priority/comparator/gap 未闭合 | 可接受/blocked | pull 不猜测、不推进 cursor |
| metadata schema/retention 未闭合 | 可接受/blocked | 不锁单文件、不静默迁移/删除 |
| Git adapter 技术/LFS/浅克隆未闭合 | 可接受/pending | 核心 safety gate 不依赖这些功能 |
| handoff/probe contract 未闭合 | 可接受/blocked | 不盲重放，ACK 不等于 decision |
| 自动 merge/rebase/push 或 cache truth | 不可接受 | 永久违反红线，不得作为债务延后 |
| 外部正文/secret/provenance 伪造 | 不可接受 | 永久违反数据与审计边界 |

### 7.3 调整触发条件

| 触发 | 架构调整方向 | 不允许的推论 |
|---|---|---|
| owner 发布正式 source/comparator/handoff contract | 收窄 ports、状态和错误边界 | 不能推断已实现/测试通过 |
| workload 证明当前 materialization 不可接受 | 评估 incremental/LFS/shallow adapter | 不能以 README 或主观体验替代证据 |
| 多 Git 工具形成正式支持需求 | 增加 adapter capability matrix | 不能扩大为任意 shell execution |
| GUI/Web IDE 正式产品需求成立 | 新增入口 adapter，复用相同 core | 不能复制核心或放宽 gate |
| 安全/审计发现 provenance 缺口 | 强化 metadata/transition boundary | 不能删除历史或伪造补齐 |

### 7.4 串行门禁

正式 01 完成后必须 `formal_stop_review`。在用户明确确认前不得创建 02 flow；进入 02 时仍继承 `SYNC-UP-001~010`，不得把“架构完成”解释为 upstream ready、implementation ready 或 test ready。

## 8. 回填草稿

正式 §14 回填演进路线、债务和触发条件；不写日期、Sprint、实现任务、commit 边界或已经“跑通”的表述。

## 9. 待确认事项

- E1~E4 是架构演进语义，不是计划状态或承诺。
- 每个阶段的具体任务和提交只允许在正式 07 收敛；当前不得创建 implementation ledger/skeleton。
- 外围能力是否进入正式范围必须有后续需求/ADR，不因列在路线中自动授权。

## 10. 自检与进入下一步条件

- [x] 当前阶段、后续阶段、债务与触发条件明确。
- [x] 未将演进路线写成排期或实现事实。
- [x] 可接受/不可接受债务边界清楚。
- [x] 外围能力未被写成必做主线。

`gate_status = pass_with_upstream_blockers`；可进入 Step 14。
