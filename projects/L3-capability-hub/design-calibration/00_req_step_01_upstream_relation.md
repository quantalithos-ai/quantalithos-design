# Step 1. 与上游文档的关系声明

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 1
> 回填章节: `00-需求文档.md` §1 与上游文档的关系声明
> 生成日期: 2026-07-06
> 当前状态: `completed_stop_review`
> 粒度参考: `projects/L1-governance/design-calibration/00_req_step_01_upstream_relation.md`

---

## 0. 当前 Step 状态

| 项 | 记录 |
|---|---|
| 文档 | `projects/L3-capability-hub/00-需求文档.md` |
| Step | Step 1 与上游文档的关系声明 |
| 当前入口 | `Step 1 已完成,等待是否进入 Step 2` |
| gate_status | pass |
| next_allowed_action | `wait_user_review_to_step_02` |
| 正式文档写入 | blocked: 当前只写 Step 1 中间产物,不修改正式 `00-需求文档.md` |
| 当前策略 | 从头开始;每完成一个 Step 停审;不自动跨 Step |

---

## 1. 本步目标

先校准 `L3-capability-hub` 需求文档的语义来源,明确它承接哪些上游结论,而不是重新定义方法资产正文、治理审批 truth、SDK client、runtime execution、tool execution、marketplace listing、provider secret 平台或 cost / billing 系统。

Step 1 只回答来源和承接关系,不提前写:

- 本仓定位与边界
- 核心能力闭环
- 功能需求
- 数据归属
- 接口依赖
- 实现对象或技术选型

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | 已读 | 约束 Step 1 只回答来源、承接主题、非重新定义项和当前仓细化作用。 |
| `standards/document/需求文档书写规范.md` | 已读 | 约束正式 §1 只保留来源映射表和收束说明。 |
| `standards/document/设计文档编写通则.md` | 已读 | 约束 full-restart 下旧正式文档只能作为历史材料重进。 |
| `standards/document/设计文档讨论中间产物规范.md` | 已读 | 约束本轮必须先有台账、flow 和 Step 文件,且每 Step 停审。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已读 | 约束 Step 1 不脑补对象、字段、接口和实现。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读 | 提供 `L3-capability-hub` 在 L3 方法能力层的全局来源主题和依赖裁剪基线。 |
| `projects/L3-capability-hub/README.md` | 已读 | 作为旧仓定位材料和历史线索输入。 |
| 旧 `projects/L3-capability-hub/00-需求文档.md` | 已读 | 作为旧需求诊断输入,不作为新版正式基线。 |
| 旧 `projects/L3-capability-hub/01-架构设计.md` ~ `06-验收标准.md` | 已读 | 作为旧下游文档和越界口径诊断输入。 |
| `projects/L3-method-library/00-需求文档.md` | 已读 | 作为方法资产定义真相边界来源。 |
| `projects/L1-governance/00-需求文档.md` | 已读 | 作为治理决策 / Policy truth 边界来源。 |
| `projects/L0-sdk/00-需求文档.md` | 已读 | 作为 SDK 官方客户端消费边界来源。 |
| `projects/L1-governance/design-calibration/00_req_step_01_upstream_relation.md` | 已读 | 仅作为 Step 粒度和组织方式参考,不作为领域来源。 |

---

## 3. SOP 问题回答

### 3.1 本文承接哪些上游文档？

本文直接承接六类输入:

1. 需求文档生成规范: `需求文档讨论流程_SOP.md`、`需求文档书写规范.md`。
2. 通用设计纪律: `设计文档编写通则.md`、`设计文档讨论中间产物规范.md`、`设计真相源闭环与可落码性标准.md`。
3. 全局项目来源: `全局项目依赖关系与裁剪规则.md` 中 `L3-capability-hub` 的项目定位。
4. 目标仓历史材料: README、旧 `00`、旧 `01/02/03/05/06`。
5. 稳定相邻真相源: `L3-method-library/00-需求文档.md`、`L1-governance/00-需求文档.md`、`L0-sdk/00-需求文档.md`。
6. Step 粒度参考: `L1-governance` 的 Step 1 中间产物。

### 3.2 承接的是上游哪一部分主题？

`L3-capability-hub` 承接的是 L3 方法能力层中“能力注册 / 外部 MCP / A2A / API 集成中心”的仓级主题。这个主题的核心不是执行,而是把外部能力的接入语义从 runtime、tools、method-library、governance、SDK 和 marketplace 的相邻语境中抽离出来,为后续需求讨论建立独立入口。

本步只确认三类承接关系:

| 来源 | 当前只承接什么 |
|---|---|
| `L3-method-library` | capability 与 method asset 的关系来源,不承接方法资产正文定义 |
| `L1-governance` | governance approval / policy 结果接缝来源,不承接治理 truth |
| `L0-sdk` | SDK 暴露 / 消费服务端能力边界来源,不承接 SDK client 本体 |

### 3.3 本文为什么不是重新定义该主题？

因为本仓不是以下真相源:

- 不是 `L3-method-library` 的方法资产定义真相源
- 不是 `L1-governance` 的治理审批 / Policy effective fact 真相源
- 不是 `L0-sdk` 的客户端封装真相源
- 不是 `L2-runtime` / `L2-tools` 的执行真相源
- 不是 `L6-marketplace` 的 listing / transaction 真相源
- 不是 secret / KMS / Vault 平台
- 不是 finance / billing / raw provider billing 真相源

因此 Step 1 只能说明“本仓从哪里承接能力接入主题”,不能在这里把 capability identity、registry、adapter descriptor、governance seam、method relation 或 SDK exposure 直接定成正式能力节点。

### 3.4 本文在当前仓里承担什么细化作用？

本文只承担 `L3-capability-hub` 仓级需求入口的细化作用:

- 明确当前需求从哪些正式来源进入
- 明确本仓承接的主题是“能力接入中心”,而不是执行中心或交易中心
- 明确旧材料只能作为历史线索
- 为 Step 2 之后的边界、依赖、能力、功能、规则、数据、接口和验收讨论建立来源基线

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 当前处理 |
|---|---|---|---|
| `README.md` | 把 MCP registry、A2A directory、Provider Contract、白名单、成本记账、LLM routing、Policy 下发和 marketplace 注册并列为核心职责 | 历史材料同时混入接入 truth、执行、基础设施、交易和非目标内容 | 只保留“能力接入中心”线索,其余全部降级为冲突线索 |
| 旧 `00-需求文档.md` | 直接把 `Provider Contract / QueryCapabilities / Cost Accounting` 写成功能主线 | 旧 13 节结构和旧对象名会反向锁死新版需求边界 | 整体降级为 historical material |
| 旧 `01/02/03` | 已提前写入对象、目录、service、repository、projection、KMS/Vault、cost 和 runtime 协作 | 详细设计口径倒灌需求来源声明 | 本步不承接这些实现结论 |
| restart 前 `design-calibration/00_req_step_02~09` | 已经推进到 Step 9,但不是当前“每 Step 停审”的执行节奏 | 过程上不再是当前 active baseline | 降级为 pre-restart historical material,后续原位重写 |
| 相邻仓正式文档 | `L3-method-library`、`L1-governance`、`L0-sdk` 已明确各自 truth 不被相邻仓接管 | 如果 Step 1 不先尊重这些边界,后续会再次混写 method、governance、SDK 和 execution | 作为当前来源基线强制保留 |

---

## 5. 改动前后对比

| 项 | restart 前活跃口径 | 当前 Step 1 口径 | 原因 |
|---|---|---|---|
| 恢复点 | 停在 Step 9 | 重置回 Step 1 | 用户要求从头开始,每个 Step 停审 |
| Step 粒度 | 以目标项目自生成结构为主 | 对齐 `L1-governance` Step 粒度 | 用户明确要求参考 `L1-governance` |
| README 地位 | 实际被当成强来源线索 | 只作为 historical material | README 混入大量越界职责 |
| 旧 Step 2~9 地位 | 曾经是 active 进度 | 改为 pre-restart historical material | 当前策略不承接旧进度 |
| 上游承接 | 以全局规则 + 相邻仓正式边界为主,但夹带旧 flow 状态 | 以全局规则 + `L3-method-library` / `L1-governance` / `L0-sdk` 正式边界为主 | Step 1 需要干净来源,不能混旧流程状态 |

---

## 6. 设计取舍

| 取舍项 | 采用 | 不采用 | 理由 |
|---|---|---|---|
| Step 1 组织方式 | 参考 `L1-governance` 的 Step 粒度,保留目标 / 输入 / Q&A / 诊断 / 取舍 / 结构化产物 / 回填草稿 | 继续沿用 restart 前 Step 1 的自定义结构 | 用户明确要求参考 `L1-governance` 粒度 |
| 来源表达 | 用“全局来源 + 相邻真相源边界 + 历史材料降级”表达 | 从旧 README / 旧 `00` 直接列功能来源 | Step 1 不能把旧功能名当来源 |
| capability-hub 主题表达 | 写成“能力注册 / 外部 MCP / A2A / API 集成中心” | 在 Step 1 现场钉死 capability identity / registry / descriptor 闭环 | 能力闭环应后移 Step 7 |
| 用户重点边界处理 | 在 Step 1 明确为后续必守边界,不提前定能力节点 | 把 runtime execution、marketplace、governance approval 等直接写进来源主题 | Step 1 只收口来源,不前置后续结论 |

---

## 7. 结构化中间产物

### 7.1 来源映射表

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | `Step 1. 与上游文档的关系声明` | 本文按需求 SOP 从来源声明开始逐 Step 重建。 |
| `standards/document/需求文档书写规范.md` | `4.1 与上游文档的关系声明` | 正式 §1 只写来源映射与收束说明。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `4. 总依赖矩阵 / L3-capability-hub` | `L3-capability-hub` 属于 L3 方法能力层中的外部能力注册 / 集成主题。 |
| `projects/L3-method-library/00-需求文档.md` | `1. 与上游文档的关系声明`;`2. 本仓定位与边界` | 方法资产定义正文归 `L3-method-library`,本仓后续只承接 capability relation 来源。 |
| `projects/L1-governance/00-需求文档.md` | `1. 与上游文档的关系声明`;`2. 本仓定位与边界` | governance approval / policy truth 归 `L1-governance`,本仓后续只承接治理结果接缝来源。 |
| `projects/L0-sdk/00-需求文档.md` | `1. 与上游文档的关系声明`;`2. 本仓定位与边界` | SDK 是官方客户端接入层和服务端能力消费者,本仓后续只承接 SDK exposure 来源。 |
| `projects/L3-capability-hub/README.md` | 仓使命 / 核心职责 | 只作为历史线索提供 MCP / A2A / 外部 API 接入与治理联动语义。 |
| 旧 `projects/L3-capability-hub/00-需求文档.md` | 旧关系声明 / 旧功能入口 | 只作为历史需求诊断输入,不作为当前需求基线。 |

### 7.2 收束说明

本文讨论的是上述来源在 `L3-capability-hub` 仓上的需求收束方式。当前只确认本仓承接“能力注册 / 外部 MCP / A2A / API 集成中心”的仓级主题,以及与 `L3-method-library`、`L1-governance`、`L0-sdk` 的相邻真相边界。本文不重新定义方法资产正文、治理审批 truth、SDK client、runtime execution、tool execution 或 marketplace listing。

### 7.3 历史材料 / pre-restart 冲突审计

| 冲突 ID | 位置 | 旧口径 | 当前处理 | 后续落点 |
|---|---|---|---|---|
| `CH-HIST-001` | README / 旧 `00~06` | runtime / tools 调外部能力必经 hub 执行 | 不继承为来源结论 | Step 2 / Step 7 / Step 10 |
| `CH-HIST-002` | README / 旧 `00~03` | Provider Contract + API key / KMS 是核心职责 | 不继承为来源结论 | Step 2 / Step 4 / Step 11 |
| `CH-HIST-003` | README / 旧 `00~03` | Cost Accounting / CostRecord 是主线 | 不继承为来源结论 | Step 4 / Step 13 / Step 14 |
| `CH-HIST-004` | README / 旧 `00/01` | marketplace metadata / listing 进入本仓主线 | 不继承为来源结论 | Step 2 / Step 6 / Step 12 |
| `CH-HIST-005` | README / 旧 `00~02` | governance Policy 下发直接更新白名单 | 不继承为来源结论 | Step 2 / Step 6 / Step 10 |
| `CH-RESTART-001` | restart 前 Step 2~9 | 已推进到 Step 9 但未按当前停审节奏执行 | 不继承为 active baseline | 对应 Step 到达时原位重写 |

---

## 8. 回填草稿

以下内容供 Step 17 组装正式 `00-需求文档.md` 时回填到 §1:

```md
## 1. 与上游文档的关系声明

> 校准来源：
> - `design-calibration/00_req_step_01_upstream_relation.md`
>
> 延伸阅读：
> - 建议继续阅读 `design-calibration/00_req_step_01_upstream_relation.md` 的“结构化中间产物”“当前文档问题诊断”和“设计取舍”小节,了解本章来源关系如何收敛而来。

| 来源文档 | 上游章节 / 模块 | 承接内容 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | `Step 1. 与上游文档的关系声明` | 本文按需求 SOP 从来源声明开始逐 Step 重建。 |
| `standards/document/需求文档书写规范.md` | `4.1 与上游文档的关系声明` | 本章只写来源映射与收束说明。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `4. 总依赖矩阵 / L3-capability-hub` | `L3-capability-hub` 属于 L3 方法能力层中的外部能力注册 / 集成主题。 |
| `projects/L3-method-library/00-需求文档.md` | `1. 与上游文档的关系声明`;`2. 本仓定位与边界` | 方法资产定义正文归 `L3-method-library`,本文后续只承接 capability relation 来源。 |
| `projects/L1-governance/00-需求文档.md` | `1. 与上游文档的关系声明`;`2. 本仓定位与边界` | governance approval / policy truth 归 `L1-governance`,本文后续只承接治理结果接缝来源。 |
| `projects/L0-sdk/00-需求文档.md` | `1. 与上游文档的关系声明`;`2. 本仓定位与边界` | SDK 是官方客户端接入层和服务端能力消费者,本文后续只承接 SDK exposure 来源。 |
| `projects/L3-capability-hub/README.md` | 仓使命 / 核心职责 | 只作为历史线索提供 MCP / A2A / 外部 API 接入与治理联动语义。 |
| 旧 `projects/L3-capability-hub/00-需求文档.md` | 旧关系声明 / 旧功能入口 | 只作为历史需求诊断输入,不作为当前需求基线。 |

本文讨论的是上述来源在 `L3-capability-hub` 仓上的需求收束方式。当前只确认本仓承接“能力注册 / 外部 MCP / A2A / API 集成中心”的仓级主题,以及与 `L3-method-library`、`L1-governance`、`L0-sdk` 的相邻真相边界。本文不重新定义方法资产正文、治理审批 truth、SDK client、runtime execution、tool execution 或 marketplace listing。
```

---

## 9. 待确认事项

| ID | 待确认事项 | 当前状态 | 是否阻塞 Step 1 | 后续处理 |
|---|---|---|---|---|
| `OQ-CH-001` | `Provider Contract` 是否整体改写为 `adapter descriptor` 语义,还是后续仍需保留局部旧名 | pending | 否 | Step 2 / Step 7 / Step 11 |
| `OQ-CH-002` | governance approval seam 的最小引用范围是 approval ref、policy result ref 还是 scope summary | pending | 否 | Step 6 / Step 10 / Step 11 |
| `OQ-CH-003` | SDK exposure 应在 Step 7 作为能力节点收口,还是仅在 Step 12 作为接口边界收口 | pending | 否 | Step 7 / Step 12 |
| `OQ-CH-004` | capability 与 method asset 的关系在后续是否只允许 body-free ref / relation | pending | 否 | Step 7 / Step 11 / Step 12 |

---

## 10. Blocker 判定

| Blocker 候选 | 判定 | 理由 | 当前处理 |
|---|---|---|---|
| 旧 README / 旧 `00~06` 与当前边界冲突 | `historical_conflict_not_blocker` | 旧材料冲突足以禁止直接继承,但不阻止 Step 1 确认来源和承接主题。 | 记录为 historical material,后续各 Step 分别重建。 |
| `L3-method-library` 未提前定义 capability relation 细节 | `not_blocker_for_step_01` | Step 1 只需确认方法资产正文不归本仓。 | Step 7 / Step 11 / Step 12 再闭口。 |
| `L1-governance` 与本仓 seam 字段未闭合 | `not_blocker_for_step_01` | Step 1 只需确认治理 truth 不归本仓。 | Step 6 / Step 10 / Step 11 再闭口。 |
| `L0-sdk` 未提前给出 capability-hub 专用 client 细节 | `not_blocker_for_step_01` | Step 1 只需确认 SDK 是消费边界。 | Step 12 再闭口。 |

结论: 未发现阻塞 `00-需求文档.md` Step 1 的上游 blocker。

---

## 11. 自检与停审

| 检查项 | 结果 | 说明 |
|---|---|---|
| 只写来源与承接关系 | pass | 未提前写边界、功能、数据、接口或实现。 |
| 已明确不重新定义的相邻真相源 | pass | method-library、governance、SDK、runtime / tools、marketplace 均已排除。 |
| 旧材料已降级为 historical material | pass | README、旧 `00~06` 和 restart 前 Step 2~9 均不作为当前基线。 |
| 已参考 `L1-governance` 的 Step 粒度 | pass | 当前文件结构与停审方式已对齐。 |
| 是否可进入 Step 2 | `blocked_until_user_confirm` | 必须等待用户确认后才能继续。 |
