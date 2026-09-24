# 00 需求 Step 7 · 核心能力闭环

> 状态：`completed`
> 前置：`00_req_step_02_scope_boundary.md`、`00_req_step_04_goals_non_goals.md`、`00_req_step_06_consumers_dependencies.md`
> 回填章节：正式 `00` §7 核心能力闭环
> 能力级执行规则：后续 Step 8~14 按 `CP-RUN-01→05` 逐节点小循环；每个节点完成后保留停审记录。

## 1. 本步目标

从 Runner 必须存在的理由出发，收敛一条由能力成立关系组成的核心闭环。闭环图不表达接口时序、事件流、实现步骤或开发优先级；它只回答缺少哪一类能力时 Runner 需求会不完整。

## 2. 仓存在的必要性

如果没有 Runner，平台可以拥有 Artifact 和 Release，却无法为运行用户提供一个把明确版本安全带到端侧、在受控边界中运行、理解运行结果并在异常后恢复的独立入口。仅有下载、仅有本地进程、仅有 Sandbox 或仅有日志都不能构成可审查的运行体验；五类能力必须共同成立，才能把“可消费产物”转为“可控的端侧运行过程”。

## 3. 核心能力闭环图

```text
运行语境与版本选择能够被可信地建立
  -> 产物 authority、完整性与本地可运行资格能够被验证
  -> 受控执行请求与运行生命周期能够被正式表达
  -> 输出、失败、资源清理与断线恢复能够被安全地解释
  -> 用户与平台能够获得可追溯的运行预览和诊断交接
```

图中箭头只表示能力成立的逻辑依赖：没有可信语境和明确版本，就不能验证材料；没有验证和资格，就不能安全请求执行；没有生命周期、清理和恢复，就不能把运行结果交给用户；没有安全预览和诊断交接，端侧运行仍不可解释、不可追溯。图不代表具体调用顺序或实现阶段。

## 4. 核心能力节点

| 节点 | 能力成立描述 | 必须共同成立的结果 | 入口条件 | 退出条件 |
|---|---|---|---|---|
| `CP-RUN-01` 可信语境与显式选择 | Runner 能在可信 actor/context 和端侧平台语境中承接用户明确选择的不可变 Release/version。 | 选择对象可回指来源、scope、选择世代和有效性姿态；`latest`/默认值不构成选择。 | actor/session/context 可验证；用户尚未完成或正在改变选择。 | 选择已确认，或明确进入 not-visible/invalidated/blocked。 |
| `CP-RUN-02` authority、取得与完整性资格 | Runner 能依据正式 Artifact/Governance 结果取得材料，并判断其完整性、平台兼容性和是否仍可消费。 | Release authority、locator/manifest、完整性和 cache 保护语义不混淆；未验证材料不可运行。 | `CP-RUN-01` 已确认；正式 locator/manifest/authority 可查询。 | 材料达到可运行资格，或明确进入 pending/invalid/quarantine/blocked。 |
| `CP-RUN-03` 受控请求与生命周期表达 | Runner 能把已获资格的材料和用户意图交给正式 Sandbox/Runtime 边界，并区分请求接收、boundary、running、terminal 与控制结果。 | `accepted ≠ running`；本地状态不替代 Runtime/Sandbox truth；启动/停止/取消意图可追踪。 | `CP-RUN-02` 达到资格；资源和正式 adapter 前置可用。 | owner 返回明确生命周期姿态，或进入 unknown/pending/reconcile。 |
| `CP-RUN-04` 资源、清理与恢复安全 | Runner 能解释端口/资源冲突，保护 active lease/capture/handoff，并在停止、断线、重启或 orphan 情况下安全恢复。 | 未确认的副作用不自动重放；cleanup guard/lease 保护不被本地状态绕过。 | `CP-RUN-03` 产生请求或运行关联；本地平台事件可观察。 | 资源释放/保护/待人工确认姿态可解释，或保持 blocked/unknown。 |
| `CP-RUN-05` 预览、诊断与追溯交接 | Runner 能向用户提供受 redaction 和范围约束的输出预览、失败解释、来源引用和允许的 Observability handoff。 | preview/diagnostic/handoff 不冒充 Artifact、Runtime、Sandbox、evidence、verdict 或 signoff truth。 | 至少有安全 source ref 或本地失败摘要；Observability 合同可选。 | 用户看到可解释的结果/限制，且交接状态明确或保持 pending/blocked。 |

## 5. 能力节点执行顺序与停审清单

| 顺序 | 能力节点 | Step 8~14 小循环必须覆盖 | 停审条件 |
|---|---|---|---|
| 1 | `CP-RUN-01` | 选择相关故事、功能、规则、数据、接口、NFR、验收 | 选择与语境无隐式来源，未越权到 approval。 |
| 2 | `CP-RUN-02` | authority/下载/cache/完整性相关故事、功能、规则、数据、接口、NFR、验收 | 未验证、过期、撤销或 digest 冲突均有阻断口径。 |
| 3 | `CP-RUN-03` | Sandbox 请求、生命周期、启停控制相关故事、功能、规则、数据、接口、NFR、验收 | accepted、running、terminal、control result 分轴，不把 ACK 当成功。 |
| 4 | `CP-RUN-04` | 资源冲突、清理、lease/orphan、断线恢复相关故事、功能、规则、数据、接口、NFR、验收 | 未知副作用冻结，保护和清理责任不越过 Sandbox/Archive。 |
| 5 | `CP-RUN-05` | 输出预览、失败诊断、redaction、handoff 相关故事、功能、规则、数据、接口、NFR、验收 | preview、local diagnostic、handoff 与正式 evidence/report/verdict 分离。 |

## 6. 能力层级划分

| 分类 | 内容 |
|---|---|
| 核心能力闭环 | `CP-RUN-01` 可信语境与显式选择；`CP-RUN-02` authority/取得/完整性资格；`CP-RUN-03` 受控请求与生命周期；`CP-RUN-04` 资源/清理/恢复安全；`CP-RUN-05` 预览/诊断/追溯交接。 |
| 外围增强能力 | 批量预取、多个运行比较、离线浏览非运行材料、高级资源可视化、跨产品 deep link、可选归档浏览和体验主题。 |
| 边界外能力 | Release 创建/修改/发布/撤销；Governance 审批；Runtime loop/outcome；Sandbox backend/isolation policy；Observability evidence/report/verdict；Archive restore truth；代码编辑、源码同步、生产部署。 |

## 7. 功能回填映射方向

| 能力节点 | 需求章节主要承接 |
|---|---|
| `CP-RUN-01` | 选择语境、版本确认、可见性和平台能力目标；对应后续 `FR-RUN-001`、`FR-RUN-002`。 |
| `CP-RUN-02` | authority 校验、下载/cache、完整性和平台资格；对应后续 `FR-RUN-003`、`FR-RUN-004`。 |
| `CP-RUN-03` | Sandbox 正式请求、运行状态、启停控制和结果分层；对应后续 `FR-RUN-005`、`FR-RUN-006`、`FR-RUN-007`。 |
| `CP-RUN-04` | 资源冲突、清理、保护、断线和恢复；对应后续 `FR-RUN-008`、`FR-RUN-009`。 |
| `CP-RUN-05` | 输出预览、失败诊断、安全 handoff 和可追溯展示；对应后续 `FR-RUN-010`、`FR-RUN-011`、`FR-RUN-012`。 |

编号是本轮需求追溯的候选锚点，后续 Step 9 将逐项确认；若上游合同变化，编号承接关系必须显式更新，不得静默保留旧含义。

## 8. 未确认与阻塞

`RUN-UP-001~008` 仍保持开放。尤其是 `CP-RUN-02` 的 Release locator/integrity/authority、`CP-RUN-03` 的 Sandbox/Runtime adapter、`CP-RUN-04` 的 lease/cleanup/reconcile 和 `CP-RUN-05` 的 Observability handoff 均只能定义能力成立条件，不能提前写成具体接口或可运行事实。

## 9. 自检与能力级停审

- [x] 闭环图包含五个能力成立描述，没有接口、事件、字段、组件或开发步骤。
- [x] 已区分核心闭环、外围增强和边界外能力。
- [x] 已给出能力节点顺序、入口/退出条件和后续小循环停审清单。
- [x] 已把功能回填映射作为候选锚点，不把它当作已完成功能清单。
- [x] 上游 blocker 未被 fake、ACK、cache 或历史文档关闭。

`Step 7 gate_status = pass`；下一步允许进入 `Step 8 用户故事`，并按 `CP-RUN-01→05` 逐节点收敛。
