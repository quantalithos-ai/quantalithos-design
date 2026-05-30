# L0-bus 06 验收标准 Step 6: 数据边界与架构红线验收

> 本文件是 `projects/L0-bus/06-验收标准.md` 的 Step 6 中间产物。
> 本步把数据所有权、职责边界、禁止事项和 P1/P2 非范围约束转换成可检查的架构红线验收门禁。
> 本步不修改正式 `06-验收标准.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 6 |
| 主题 | 定义数据边界与架构红线验收 |
| 状态 | 已确认 |
| 正式回填位置 | `06-验收标准.md` §6 |
| 是否修改正式 `06-验收标准.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `00-需求文档.md` §10 / §11 | 已完成 | 提取 BR-001~BR-012、bus truth、snapshot、reference、forbidden body |
| `01-架构设计.md` §4 / §9 / §13 | 已完成 | 提取职责边界、数据所有权、一致性策略和横切红线 |
| `02-概要设计.md` §10 / §11 / §13 | 已完成 | 提取 projection / Query / backend capability / config 越界风险 |
| `03-详细设计.md` §8 / §9 / §11 / §14 | 已完成 | 提取处理流禁止迁移、Query 无写事务、adapter normalization 和观测边界 |
| `04-配置设计.md` §4 | 已完成 | 提取禁止配置化项和配置绕过红线 |
| `05-测试方案.md` §10 / §11 / §13 | 已完成 | 提取 redaction、authorization seam、UoW、report integrity 和 S0/S1 分级 |
| `06_acceptance_step_05_function_gate.md` | 已确认 | 继承功能失败触发点,本步正式展开边界门禁 |

---

## 3. SOP 问题回答

### 3.1 哪些数据不得由本仓保存?

L0-bus 可以拥有平台传递事实、恢复材料、总线审计和只读派生视图,但不得保存或解释外部正文真相。

| 数据类别 | 允许 / 禁止 | 验收口径 |
|---|---|---|
| Publication acceptance fact | 允许保存为 bus truth | 必须能证明接入事实和 audit 在 bus 内一致 |
| Delivery record / delivery history | 允许保存为 bus truth | 状态变化必须有 history,不得只存在瞬时状态 |
| Ack / fail / timeout result | 允许保存为 bus truth | 必须关联 delivery、history 和幂等锚点 |
| Idempotency anchor | 允许保存为 bus truth | 只用于 bus delivery / feedback 幂等,不接管业务副作用 |
| Retry / dead-letter / replay material | 允许保存为 bus truth | replay preparation 必须依赖 DLQ、history 和 audit chain |
| Bus audit trail | 允许保存为 bus truth | append-only 或保留可追溯演进链 |
| Transport view / tap / failure summary | 允许作为 snapshot / projection | 只读派生,不得反写 bus truth |
| Core contract / payload / outbox / backend capability reference | 允许保存引用 | 只能保存 ref / digest / metadata,不得吸收外部正文 |
| Business payload body | 禁止保存 / 解释 | 任意 truth、snapshot、event、log、audit、report 中出现完整正文均失败 |
| Raw secret / credential / connection string | 禁止保存 | 配置、日志、审计、artifact、report 中出现明文均失败 |
| Backend private body / raw backend response | 禁止保存为 truth 或输出正文 | backend 信号必须 normalization,不得直接写入上层语义 |
| Governance decision body | 禁止由 bus 生成或保存 | bus 只输出 failure material,治理决策归 governance |
| Observability long-term log body | 禁止由 bus 拥有 | bus 只输出 tap / audit material,观测产品归 observability |
| Uncommitted outbox business state | 禁止推进为 bus truth | Outbox relay 只能承接已提交 fact |

### 3.2 哪些下游不得反向改写真相?

下游可以消费 bus 输出或反馈总线级结果,但不得通过只读视图、观测材料、治理材料或 SDK 封装反向修改 bus truth。

| 下游 / 外部对象 | 允许协作 | 禁止行为 |
|---|---|---|
| `L0-sdk` | 消费 transport view、error contract、read-only output | 通过 SDK view 反写 bus truth 或重新定义 bus semantic |
| `L4-observability` | 消费 tap、audit、trace、metrics material | 用观测 projection 改写 delivery、feedback、recovery truth |
| `L1-governance` | 消费 failure material、DLQ summary | 把 governance decision body 写回 bus truth 或由 bus 代生成决策 |
| Operator / SRE | 通过受控 recovery command 操作 retry / DLQ / replay preparation | 直接修改 store、跳过 command / audit chain |
| 订阅方业务仓 | 通过 feedback 面提交 ack / fail / timeout | 直接修改 delivery record 或把业务副作用幂等交给 bus |
| 发布方业务仓 | 提交已提交 outbox fact 或合法发布材料 | 把未提交业务状态推进为 bus truth |
| MQ / backend adapter | 返回 normalized delivery signal / capability | 让 backend raw status 或 private body 成为上层语义 |

### 3.3 哪些 projection / cache 不得反写真相?

所有 projection、cache、report 和 artifact 都是读模型或证据模型,不能成为第二写入口。

| 派生对象 | 允许行为 | 禁止行为 |
|---|---|---|
| Transport view projection | 从 bus truth 派生 transport view | Query 发现 missing / stale 后自动 rebuild 并写 truth |
| Failure summary projection | 从失败事实派生 summary | 生成 governance decision 或改写 recovery truth |
| Backend health view | 展示 capability / health | 直接改变 delivery 状态或重调度 delivery |
| Audit / tap material | 输出可追溯材料 | 吸收 payload body、raw secret 或 backend private body |
| Report / artifact index | 证明测试和验收结果 | 反向补写缺失 truth 或跨 run 拼接伪证据 |
| Local cache / query cache | 加速只读查询 | 作为权威来源覆盖 repository truth |

### 3.4 哪些 P1 能力不得污染 P0?

P1/P2 能力可以作为后续专项或风险记录,但不得改变 P0 主闭环的语义、通过条件或默认可验证路径。

| P1/P2 能力 | 不得污染 P0 的方式 |
|---|---|
| production MQ / durable store adapter | 不得让真实后端差异改变 platform transport semantic;不得要求真实后端成为当前 P0 进入条件 |
| KMS / Vault / secret provider | 不得把 raw secret 写入配置、日志、状态、审计或报告;当前只验 secret ref / fail-closed |
| config center / hot reload | 不得通过热更新绕过 ConfigValidator、RuntimeBuilder 或禁止配置化边界 |
| multi-backend / multi-tenant | 不得改变单一默认可验证 path 的 P0 裁决口径 |
| observability dashboard / alerting | 不得把 dashboard 缺失误判为 bus P0 不通过;但 bus 输出材料缺失仍阻断 |
| governance workflow | 不得把治理审批能力缺失误判为 bus P0 不通过;但 bus 生成 decision body 触发红线 |
| SDK high-level client | 不得让 SDK 封装体验定义 bus truth 或 transport semantic |
| exactly-once / effectively-once | 不得把当前 at-least-once + idempotency anchor 误声明为 exactly-once |

### 3.5 红线失败时是否一票否决?

本步定义红线验收项和失败条件。是否作为最终一票否决由 Step 11 汇总裁决,但以下规则先固定:

| 红线失败类型 | 当前处理 |
|---|---|
| forbidden body 泄漏、raw secret 泄漏、Query 写 truth、replay 绕过审计链 | 作为 S0 候选,Step 11 默认进入一票否决 |
| core / bus 双真相、governance decision 越界、只读输出反写 truth | 作为 S0 候选,Step 11 默认进入一票否决 |
| P0 数据所有权证据缺失、history / audit 缺失 | 至少 S1;若导致不可审计或隐藏写入,升级 S0 |
| P1/P2 污染 P0 范围 | 先阻断进入验收或要求修正送验说明;如果造成红线事实,按 S0 |
| 可观测输出缺少非关键字段 | 可能为 S2,但不得影响核心审计链 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 数据分类若只写在需求 / 架构中,验收时不可执行 | `truth / snapshot / reference / forbidden body` 没有转成门禁 | 验收人员无法判断某个证据是否越界 | 本步转成 AC-BOUND 数据边界门禁 |
| 功能门禁已提到 payload、Query、replay,但未正式定义红线 | Step 5 只把它们作为失败触发点 | 后续可能遗漏一票否决 | 本步把红线独立编号,Step 11 再汇总一票否决 |
| P1 production adapter 和 P0 default path 容易混淆 | 真实 MQ / durable store 风险可能反向改变 P0 | 当前验收范围失控 | 本步定义 P1 不得污染 P0 的验收口径 |
| Projection / report / cache 边界容易变成隐式写入口 | Query stale 自动 rebuild、report 补证据、cache 覆盖 truth | 出现第二 truth | 本步明确所有派生对象不得反写真相 |
| 配置可能绕过设计红线 | 关闭 audit、保存 payload、热更新改变 runtime graph | 运行时破坏设计 | 本步承接禁止配置化项 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 数据所有权 | 上游文档有分类,验收未成门禁 | `truth / snapshot / reference / forbidden body` 均有验收口径 | 可检查 |
| 下游反写 | 只写“不反写”原则 | 明确 SDK、observability、governance、operator、publisher、subscriber、backend 的禁止行为 | 可审计 |
| Projection 边界 | Query / projection 风险分散 | 统一定义 projection、cache、report、artifact 不得反写真相 | 防止第二 truth |
| P1/P2 | 作为残余风险 | 明确不得污染 P0 语义、进入条件和默认 path | 防止范围漂移 |
| 红线严重度 | 未区分 S0/S1/S2 | 本步先标 S0 候选,Step 11 最终收口 | 避免重复又保留裁决链 |

---

## 6. 验收设计取舍

### 6.1 是否把所有边界失败都直接写成一票否决

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. Step 6 全部直接定为一票否决 | 简单直接 | 会与 Step 11 重复,且无法区分 S1 / S2 |
| B. Step 6 定义红线和 S0 候选,Step 11 汇总一票否决 | 层次清楚,可追溯 | 需要后续 Step 承接 | 采用 |
| C. Step 6 只写原则,不写严重度 | 避免重复 | 验收人员不知道失败影响 | 不采用 |

### 6.2 是否把 report / artifact 也纳入边界红线

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 纳入 | 可防止证据反向造 truth 或泄漏 forbidden body | 与 Step 10 证据门禁有交叉 |
| B. 不纳入,只在 Step 10 写 | 职责更窄 | Step 6 无法覆盖“证据也是边界”的风险 |
| C. Step 6 写边界,Step 10 写证据完整性 | 分工清楚 | 需要交叉引用 | 采用 |

### 6.3 是否允许配置改变边界红线

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许高级配置覆盖 | 灵活 | 可绕过 payload、secret、audit、replay 和 projection 红线 |
| B. 不允许配置改变红线,如需改变必须回上游重校准 | 保持架构不变量 | 运行时灵活性降低 | 采用 |
| C. 允许仅 staging-like 覆盖 | 测试方便 | 容易把 P1/P2 风险带入 P0 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 数据边界验收表

| 验收项 ID | 数据边界 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-BOUND-001 | bus truth 只包含 publication、delivery、feedback、idempotency、recovery、audit / history | repository / service 证据显示这些 truth 与对应 audit / history 一致 | truth 缺 audit / history;业务副作用被纳入 bus truth | `EV-BUS-PUB-*`、`EV-BUS-DLV-*`、`EV-BUS-FDB-*`、`EV-BUS-REC-*`、`EV-BUS-OUT-*` |
| AC-BOUND-002 | external reference 只保存 ref / digest / metadata | core contract、payload、outbox、backend capability 均以引用保存 | 保存 payload body、outbox body、backend private body 或完整外部正文 | `TC-BUS-PUB-003`、`TC-BUS-OBX-*`、`TC-BUS-BND-*`、`RP-BUS-RED-*` |
| AC-BOUND-003 | forbidden body 不进入 truth / snapshot / event / log / audit / report | redaction check 证明 payload body、raw secret、backend private body、governance decision body 缺席 | 任一 forbidden body 出现在持久化、输出、日志、artifact 或 report | `TC-BUS-RED-001`、`RP-BUS-RED-*` |
| AC-BOUND-004 | snapshot / projection 只读派生 | transport view、failure summary、tap material 可从 truth 派生且不写 truth | Query 或 projection 自动 rebuild 并写 truth;cache 覆盖 repository truth | `TC-BUS-OUT-001`~`006`、`EV-BUS-OUT-*` |
| AC-BOUND-005 | report / artifact 只作证据,不补写事实 | report 能回链到固定 `<run_id>` artifact,不跨 run 拼接 | report 反向补造缺失 truth;使用 `latest` 或跨 run artifact | `TC-BUS-RED-002`、`RP-BUS-SUM-*` |

### 7.2 架构红线验收表

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-RED-001 | 不得重新定义 `L0-core` 共享契约 | bus 通过 core contract ref / dependency 使用 Event、Error、TraceContext、Metadata、ActorRef | bus 自行定义并作为权威使用同类共享契约 | contract compile、`TC-BUS-PUB-*`、dependency snapshot |
| AC-RED-002 | 不得保存或解释业务 payload body | 仅保存 payload ref / digest / metadata,redaction clean | payload body 进入 truth、projection、event、audit、log 或 report | `TC-BUS-PUB-003`、`TC-BUS-RED-001` |
| AC-RED-003 | 不得保存 raw secret / credential | 配置和 runtime 只保存 secret ref / connection ref | raw secret 或完整连接串进入配置摘要、日志、审计、artifact、report | `TC-BUS-CFG-002`、`TC-BUS-RED-001` |
| AC-RED-004 | backend 差异不得泄漏为上层传递语义 | backend raw status / private response 被 normalization | raw backend param 或 private body 成为 transport semantic / DeliveryStatus | `TC-BUS-SEM-002`、`TC-BUS-BND-*` |
| AC-RED-005 | Query / read-only output 不得写 bus truth | Query 无写 UoW,stale / missing 返回 marker | Query 触发 rebuild、写 truth 或修复 projection truth | `TC-BUS-OUT-001`~`002` |
| AC-RED-006 | failure material 不得生成 governance decision | 输出只表达 bus 失败事实 | bus 生成或保存 governance decision body | `TC-BUS-OUT-004`、`EV-BUS-OUT-*` |
| AC-RED-007 | replay 不得绕过 dead-letter / history / audit chain | 缺 approval、DLQ、history 或 audit chain 时 replay rejected | 缺少材料仍进入 replay ready 或改写 delivery truth | `TC-BUS-REC-003`~`004` |
| AC-RED-008 | Outbox relay 不得承接未提交业务状态 | 只消费 committed outbox fact,重复 fact 幂等处理 | 未提交 fact 推进为 bus truth 或重复 acceptance | `TC-BUS-OBX-001`~`002` |
| AC-RED-009 | 配置不得关闭关键红线 | ConfigValidator 拒绝保存 payload、关闭 audit、关闭 redaction、热更新绕过 runtime graph | 配置项可禁用 audit/history/redaction 或启用 forbidden body 保存 | `TC-BUS-CFG-001`~`003` |
| AC-RED-010 | P1/P2 能力不得污染 P0 默认路径 | production adapter、config center、SDK、observability、governance 只作为接缝或风险记录 | P1 未就绪导致 P0 失败,或 P1 能力改变 P0 semantic / gate | scope statement、`EV-BUS-BND-*`、risk acceptance |

### 7.3 边界关系图

图类型: 数据边界图

图标题: L0-bus truth、snapshot、reference 与 forbidden body 边界

```text
external truth / bodies
  +-- core contract ------------> [reference] ----+
  +-- publisher payload --------> [reference] ----|
  +-- committed outbox fact ----> [reference] ----|
  +-- backend capability -------> [reference] ----|
  +-- payload body --------------X forbidden body |
  +-- raw secret ----------------X forbidden body |
  +-- governance decision -------X forbidden body |
                                                  v
                                           bus truth
                                   publication / delivery
                                   feedback / recovery / audit
                                                  |
                                                  v
                                      read-only snapshots
                              transport view / tap / failure material
                                                  |
                                                  X no write back to truth
```

关键说明:

- reference 可以进入 bus truth,body 不能进入 bus truth。
- snapshot 从 bus truth 派生,但不能反写 bus truth。
- 下游消费 snapshot 或 failure material,不能把自身决策正文写回 bus。
- P1/P2 adapter 只能接入端口和风险记录,不能改变 P0 semantic。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_06_boundary_gate.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“数据边界验收表”“架构红线验收表”和“边界关系图”小节,了解本章如何把数据所有权和架构红线转换为验收门禁。

L0-bus 只拥有 bus truth、只读快照和外部引用三类合法数据。bus truth 包括 publication acceptance fact、delivery record、ack / fail / timeout result、idempotency anchor、retry / dead-letter / replay material、bus audit trail / delivery history。只读快照包括 transport view、tap / trace / metrics material、failure summary material。外部引用包括 core contract reference、payload reference、outbox fact reference、backend capability reference。

Business payload body、raw secret / credential、backend private body、governance decision body、observability long-term log body 和未提交 outbox business state 不得进入 bus truth、snapshot、event、log、audit、artifact 或 report。任一 forbidden body 命中都不得判定通过,并在 Step 11 作为一票否决候选处理。

SDK、observability、governance、operator、publisher、subscriber 和 backend adapter 均不得通过只读输出、projection、cache、report、artifact 或后端私有状态反向改写 bus truth。Query 不得写 truth,projection missing / stale 不得自动 rebuild 并写 truth;rebuild 只能由受控 job 或 operator flow 处理。

Production MQ / durable store adapter、KMS / Vault、config center / hot reload、multi-backend、observability dashboard、governance workflow、SDK high-level client、exactly-once 等 P1/P2 能力不得污染当前 P0 默认路径、传递语义、进入条件或通过条件。它们只作为接缝验收、后续专项或残余风险记录。

---

## 9. 待确认事项

当前没有阻塞进入 Step 7 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 红线失败是否在 Step 6 直接定为一票否决 | A. 全部直接定;B. Step 6 定 S0 候选,Step 11 汇总;C. 不写严重度 | 采用 B | Step 6 负责边界门禁,Step 11 负责最终一票否决清单 |
| report / artifact 是否纳入数据边界 | A. 纳入;B. 只在 Step 10 写;C. 不验 | 采用 A | 证据也可能泄漏 forbidden body 或形成伪 truth |
| 配置是否允许覆盖红线 | A. 允许;B. 不允许,必须回上游重校准;C. staging-like 可覆盖 | 采用 B | 红线是设计不变量,不是普通运行参数 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 禁止保存的数据已列明 | 已满足 |
| 下游不得反向改写真相的对象和行为已列明 | 已满足 |
| projection / cache / report / artifact 不得反写真相已列明 | 已满足 |
| P1/P2 不得污染 P0 的规则已列明 | 已满足 |
| 红线失败与 Step 11 一票否决的承接关系已定义 | 已满足 |
| 正式 `06-验收标准.md` 未被修改 | 已满足 |

结论: 可以进入 Step 7,定义接口、事件与跨仓同步验收。
