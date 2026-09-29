# Step 3. 背景与问题定义

## 1. Step 状态

- 状态：`[x] 已完成并通过自检`
- 对应 SOP：`需求文档讨论流程_SOP.md` Step 3
- 回填章节：正式 `00-需求文档.md` §3
- gate_status：`pass`
- gate_reason：业务背景、现状问题及业务/技术问题已分离；未把方案、目标或实现细节写入问题定义。
- next_allowed_action：进入 Step 4 目标与非目标。

### 1.1 Step 内计划

- [x] 读取 Step 2、L1-workspace 正式 00~07、各 owner 正式边界和 L4 历史材料。
- [x] 回答背景、痛点、量化可用性和问题分类问题。
- [x] 诊断旧 L4 文档将方案、合规结论和性能承诺混入背景的问题。
- [x] 选择以“可验证材料保存与恢复交接”描述业务问题。
- [x] 形成问题分类表和问题影响图。
- [x] 判断复杂度：按业务问题/技术问题两层表达，无需拆附录。
- [x] 形成回填草稿并完成自检。

## 2. 本步输入

- `design-calibration/00_req_step_02_position_boundary.md`
- `projects/L1-workspace/00-需求文档.md` 至 `07-实施计划.md`
- `projects/L1-workspace/design-calibration/project_execution_ledger.md`
- `projects/L1-identity/00-需求文档.md`、`L1-conversation/00-需求文档.md`、`L1-work/00-需求文档.md`、`L1-process/00-需求文档.md`、`L1-governance/00-需求文档.md`、`L1-artifact/00-需求文档.md`、`L4-observability/00-需求文档.md`
- L4 旧 README、旧正式 00/01/02/03/05/06、`draft/01~03`（仅污染审计）

## 3. SOP 问题回答

1. 当前业务背景是什么？

   平台中的项目、身份、对话、过程、治理、制品和审计材料由不同 owning domain 持有。项目在生命周期变化、合规审查、争议复盘或灾难恢复时，需要把一组已获准的历史材料保存为可验证包，并在需要时向各 owner 提供受控恢复材料。

2. 当前主要痛点或机会点是什么？

   目前缺少统一的归档请求、跨域来源绑定、内容闭包、完整性验证、存储位置状态、恢复计划和 owner handoff 记录。若由各域或产品各自保存，会造成来源版本不可解释、缺片被静默忽略、workspace projection 冒充真相、恢复结果无法区分局部失败和提交未知。

3. 这些问题能否量化？

   现有材料没有经批准的 workload、容量、保留期、RTO/RPO 或测量 baseline；README 的“500 WorkItem/10 Baseline、5 分钟、2 分钟、99.9%”没有当前 authority。因此本 Step 只量化问题维度（来源覆盖、版本可解释性、完整性、结果可判别性），不把旧数字写成目标。

4. 哪些是业务问题，哪些是技术问题？

   业务问题是：组织无法证明一份历史材料包涵盖了哪些来源、是否完整可信、谁批准了保存或删除、以及恢复后哪些 owner 实际接受了哪些材料。技术问题是：多来源 snapshot/export/ref 的 fence、coverage、schema/version、digest/signature、storage commit 和 restore feedback 尚未形成统一可判别的消费合同。

## 4. 当前文档问题诊断

| 历史位置 | 问题 | 影响 |
|---|---|---|
| README §25~§39 | 把跨六域打包、合规声明、冷存和恢复直接写成既定方案 | 背景与方案混层，掩盖 owner 未闭合事实 |
| 旧 00 §53~§62 | 先假设 archived/dissolved 语义和 `project.restored` 结果 | 把业务状态结论伪装成问题背景 |
| 旧 00 §73~§82 | 用未经核验的时间和规模数字证明必要性 | 形成无来源量化承诺 |
| 旧 05/06 | 以对象/测试清单替代问题定义 | 无法说明为什么需要 Archive-owned handoff 边界 |
| draft/02 | 已有能力方向，但仍把候选状态当作问题答案 | 需在后续 Step 分阶段收口 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 背景主语 | “项目归档到冷存并恢复运行时” | “跨 owner 历史材料需要可验证保存与受控交接” | 避免 Archive 决定业务生命周期 |
| 问题证据 | 旧 README 数字和标准口号 | 来源覆盖、版本/fence、完整性、交接结果不可判别 | 只保留当前可证明的问题 |
| 业务/技术关系 | 混合功能和实现 | 明确业务后果与技术断裂 | 为目标和能力提供干净输入 |
| 失败描述 | 统一“归档失败” | 缺失、冲突、未知、局部失败需可区分 | 支撑后续 fail-closed 要求 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 以“可验证历史材料与恢复交接”定义问题 | 可跨 owner、跨存储保持稳定；不预设方案 | 需要后续逐项闭合外部合同 | 采用 |
| B. 以“项目状态迁移失败”定义问题 | 叙事直观 | 项目状态不归 Archive；会诱导跨域写权 | 不采用 |
| C. 以“冷存成本和性能”定义问题 | 易给出数字 | 当前没有 workload/成本 authority，且偏离核心闭环 | 不采用 |

## 7. 结构化中间产物

### 7.1 业务问题表

| 问题 ID | 业务问题 | 可观察后果 | 受影响方 |
|---|---|---|---|
| `BP-AR-001` | 历史材料缺少统一来源证明 | 无法判断包覆盖哪些 owner 和时间/版本范围 | 审计者、项目 owner |
| `BP-AR-002` | 归档副本与活跃 truth 的关系不清 | 可能把副本当作业务主数据或反向修改来源 | 所有 truth owner |
| `BP-AR-003` | 保存/删除/hold 决定不可追溯 | 误删、无限保留或越权处置无法解释 | governance、legal、运维 |
| `BP-AR-004` | 恢复结果不能按 owner 判别 | 局部接受、冲突和提交未知被压成“恢复成功” | 恢复操作者、各 owner |

### 7.2 技术问题表

| 问题 ID | 技术断裂 | 需要的需求层答案 |
|---|---|---|
| `TP-AR-001` | source snapshot/export/ref 的版本、watermark、fence、coverage 不统一 | 每个切片独立 source-authority matrix 和失败姿态 |
| `TP-AR-002` | manifest 与材料/引用集合缺少闭包判定 | 缺失、越界、重复、冲突的显式结果 |
| `TP-AR-003` | digest/signature、storage commit 和 retrieve 反馈不确定 | integrity/storage 状态不可伪造，commit-unknown 可见 |
| `TP-AR-004` | owner restore receiver 的接受/提交反馈不统一 | item-level handoff、partial、compensation 和 retry 记录 |
| `TP-AR-005` | workspace/artifact/observability 材料容易被误当 canonical | source authority 与 material kind 必须显式区分 |

### 7.3 问题影响关系图

#### 问题影响图: L4-archive

```text
多 owner truth + 分散保存方式
          |
          v
来源/版本/fence/coverage 不可解释
          |
          v
manifest 闭包与完整性无法证明
          |
          +--> 存储位置/迁移结果不可判别
          |
          +--> 恢复材料无法按 owner 交接
          v
审计、保留处置和恢复结果不可证明
```

关键说明：图只表达问题因果，不预设对象、协议或实现；各 L1 truth、治理决定和外部设施仍由原 owner 负责。

## 8. 回填草稿

平台的业务事实由多个 owning domain 持有，而归档、合规审查、争议复盘和灾难恢复需要一份能够说明来源、覆盖、完整性和交接结果的历史材料包。当前缺少统一的归档请求、source binding、内容闭包、完整性/存储状态、恢复计划和 owner handoff 记录，导致副本可能被误当真相，缺片和冲突可能被静默忽略，恢复局部失败或提交未知也无法被准确表达。

业务问题是无法证明历史材料包“包含了什么、由谁提供、是否完整可信、谁批准了保存/处置、恢复时哪些 owner 接受了什么”。技术问题是 snapshot/export/ref 的版本、水位、fence、coverage、schema、digest/signature、storage commit 和 restore feedback 尚未形成统一可判别合同。当前没有经过批准的 workload、容量、保留期或时间 baseline，旧 README 数字不作为需求依据。

## 9. 待确认事项

- `AR-UP-001~009` 继续影响具体来源合同、治理决策、存储产品、密码学和恢复反馈。
- 需要新的 workload/measurement authority 才能量化吞吐、RTO/RPO、容量、SLA 或成本目标。

## 10. 进入下一步条件

- [x] 已区分业务背景、现状痛点和问题分类。
- [x] 未把目标、方案、对象或实现细节写入问题定义。
- [x] 历史数字已标为无来源，不作为需求依据。
- [x] gate_status=`pass`，允许进入 Step 4。
