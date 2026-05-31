# L0-sdk 06 验收标准 Step 6: 数据边界与架构红线验收

> 本文件是 `projects/L0-sdk/06-验收标准.md` 的 Step 6 中间产物。
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
| `00-需求文档.md` §10 / §11 / §12 | 已完成 | 提取 BR-001~BR-014、SDK truth、snapshot、reference 和禁止正文 |
| `01-架构设计.md` §4 / §8 / §9 / §13 | 已完成 | 提取职责边界、依赖方向、数据所有权、一致性策略和横切红线 |
| `02-概要设计.md` §10 / §11 / §13 | 已完成 | 提取异常边界、配置影响、禁止配置化和设计风险 |
| `03-详细设计.md` §10 / §13 / §14 | 已完成 | 提取数据所有权实现、事务一致性、配置绑定和观测字段禁止表 |
| `04-配置设计.md` §8 / §9 / §11 / §12 | 已完成 | 提取 secret ref、raw secret 禁止、reload 拒绝和 runtime graph fail-fast |
| `05-测试方案.md` §10 / §11 / §13 | 已完成 | 提取 redaction、boundary、consistency、report integrity 和 S0/S1 分级 |
| `06_acceptance_step_05_function_gate.md` | 已确认 | 继承功能失败触发点,本步正式展开边界门禁 |

---

## 3. SOP 问题回答

### 3.1 哪些数据不得由本仓保存?

L0-sdk 可以拥有 official client truth、candidate truth、evidence truth 和 compatibility truth,但不得保存或解释上游、服务端、运行时、产品和凭据正文真相。

| 数据类别 | 允许 / 禁止 | 验收口径 |
|---|---|---|
| 官方客户端公共概念与语言映射口径 | 允许保存为 SDK truth | 必须由 `SdkSemanticBaseline` / `CrossLanguageConceptMap` 表达,且三语言语义一致 |
| SDK package candidate 状态 | 允许保存为 SDK truth | 必须通过 `PackageCandidateStatus` 状态机和 evidence gate 更新 |
| 默认错误 / trace / redaction 行为口径 | 允许保存为 SDK truth | 必须由 policy / error / trace 契约表达,不得泄漏正文 |
| 版本兼容与 deprecated 结论 | 允许保存为 SDK truth | `RequiresMigration` 必须有 migration ref,deprecated lifecycle 必须合法 |
| quickstart、docstring 与示例内容 | 允许保存为 SDK truth | 必须与真实 client 行为一致,并有 docs evidence |
| 跨语言验证证据结论 | 允许保存为 SDK truth | 只能保存 result、redaction status、artifact ref / digest |
| `L0-core` 契约派生类型视图 | 允许作为 snapshot | 上游 truth 仍归 core,SDK 只保存 ref / digest / view |
| `L0-bus` 事件语义客户端视图 | 允许作为 snapshot | 上游 truth 仍归 bus,SDK 不保存 bus runtime truth |
| L1/L2/L3/L4 服务边界客户端视图 | 允许作为 snapshot | 服务端 truth 仍归服务仓,SDK 只保存能力视图 |
| 上游版本、ADR、fake endpoint、reports / artifacts 引用 | 允许保存 reference | 只能保存 ref / digest / marker,不得吸收外部正文 |
| 业务对象正文、事件 payload 正文、生产请求 / 响应正文 | 禁止保存 | 任意 truth、snapshot、event、log、audit、report 中出现完整正文均失败 |
| 观测日志正文、UI 状态、runtime loop 状态 | 禁止保存 | SDK 不拥有产品或 runtime truth |
| token、secret、credential、password、private key 正文 | 禁止保存 | 配置、日志、错误、审计、artifact、report 中出现明文均失败 |

### 3.2 哪些下游不得反向改写真相?

下游可以消费 SDK package、client API、docs 和 reports,但不得通过 runtime call、query、projection、report 或生态增强能力反向修改 SDK truth。

| 下游 / 外部对象 | 允许协作 | 禁止行为 |
|---|---|---|
| L5 / L6 产品仓 | 通过 SDK package、docs 和 example 接入平台能力 | 把 UI 状态、产品工作流或页面数据写成 SDK truth |
| `L2-runtime` / automation | 通过 SDK client 调用服务边界和读取 evidence | 把 runtime loop 状态或评测运行正文写入 SDK truth |
| L1/L2/L3/L4 服务仓 | 暴露 formal API / fake boundary 供 SDK 消费 | 让 SDK 源码依赖服务仓 truth 或保存服务端业务正文 |
| `L0-core` | 提供共享契约、ErrorCode、TraceContext、Metadata | SDK 复制、重定义或覆盖 core truth |
| `L0-bus` | 提供事件语义和 boundary view | SDK 生成 delivery / retry / DLQ / replay / tap truth |
| public registry / release platform | 后续消费 package candidate artifact | registry 状态反写 candidate truth 或绕过 local candidate gate |
| Operator / maintainer | 通过正式 command / job 维护 candidate、evidence、compatibility | 直接改 store、跳过状态机、跳过 audit / evidence |

### 3.3 哪些 projection / cache 不得反写真相?

所有 projection、cache、report 和 artifact 都是读模型或证据模型,不能成为第二写入口。

| 派生对象 | 允许行为 | 禁止行为 |
|---|---|---|
| capability projection | 从 semantic baseline 和 service / event view 派生 summary | query 发现 stale 后自动写 baseline 或 view truth |
| evidence projection | 从 verification evidence 派生查询模型 | report 缺失时反向补造 evidence truth |
| compatibility projection | 从 compatibility decision 派生查询模型 | projection 覆盖 decision truth 或修改 migration ref |
| docs example projection | 从 docs validation evidence 派生示例状态 | docs runner 失败仍把示例标记为可运行 |
| local cache / query cache | 加速只读查询 | 作为权威来源覆盖 repository truth |
| reports / artifacts | 证明测试和验收结果 | 跨 run 拼接伪证据、补写缺失 truth、保存 forbidden body |
| runtime boundary result | 返回 result ref / diagnostic ref | runtime call 直接写 SDK truth 或 service truth |

### 3.4 哪些 P1 能力不得污染 P0?

P1/P2 能力可以作为后续专项或风险记录,但不得改变 P0 official SDK 闭环的语义、通过条件或默认可验证路径。

| P1/P2 能力 | 不得污染 P0 的方式 |
|---|---|
| public registry publish | 不得成为 P0 candidate 通过前置;不得让 registry 状态替代 local candidate evidence |
| production formal API endpoint 全集 | 不得要求全量生产 endpoint 才能裁决 P0;不得把 fake / formal 最小接入声明为全量覆盖 |
| real credential provider / KMS / Vault | 不得让 raw secret 进入配置、日志、错误、审计、report 或 evidence |
| remote config / hot reload / admin override | 不得绕过 ConfigValidator、RuntimeBuilder、redaction、evidence 或 compatibility gate |
| MCP / REST / GraphQL / REPL / offline cache | 不得通过实现过程自然膨胀为 P0;进入主线前必须重新裁剪需求 |
| full L1/L2/L3/L4 client coverage | 不得把缺失全量 coverage 判定为 P0 失败;也不得误声明当前已全量覆盖 |
| production-like consumer profile | 不得改变 local / CI / integration / candidate-validation 的 P0 默认可验证路径 |

### 3.5 红线失败时是否一票否决?

本步定义红线验收项和失败条件。是否作为最终一票否决由 Step 11 汇总裁决,但以下规则先固定:

| 红线失败类型 | 当前处理 |
|---|---|
| core / bus 双 truth、SDK 拥有服务端业务 truth、SDK 执行 auth / governance | 作为 S0 候选,Step 11 默认进入一票否决 |
| raw secret / credential / request / response / payload body 泄漏 | 作为 S0 候选,Step 11 默认进入一票否决 |
| fake success 支撑 production supported 或 candidate stable | 作为 S0 候选,Step 11 默认进入一票否决 |
| Query / projection / runtime boundary call 写 SDK truth | 作为 S0 候选,Step 11 默认进入一票否决 |
| P0 数据所有权证据缺失、evidence 无法追溯 | 至少 S1;若导致不可审计或隐藏写入,升级 S0 |
| P1/P2 污染 P0 范围 | 先阻断进入验收或要求修正 handoff;如果造成红线事实,按 S0 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 数据分类若只写在需求 / 架构中,验收时不可执行 | `truth / snapshot / reference / forbidden body` 没有转成门禁 | 验收人员无法判断某个证据是否越界 | 本步转成 `AC-BOUND-*` 数据边界门禁 |
| 功能门禁已提到双 truth、raw body、fake marker,但未正式定义红线 | Step 5 只把它们作为失败触发点 | 后续可能遗漏一票否决 | 本步把红线独立编号,Step 11 再汇总一票否决 |
| P1 public registry 和 P0 local candidate 容易混淆 | registry 风险可能反向改变 P0 candidate gate | 当前验收范围失控 | 本步定义 P1 不得污染 P0 的验收口径 |
| Projection / report / cache 边界容易变成隐式写入口 | query stale 自动写 truth、report 补证据、cache 覆盖 truth | 出现第二 truth | 本步明确所有派生对象不得反写真相 |
| 配置可能绕过设计红线 | 关闭 redaction、保存 raw secret、hot reload 改变 runtime graph | 运行时破坏设计 | 本步承接禁止配置化项 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 数据所有权 | 上游文档有分类,验收未成门禁 | `truth / snapshot / reference / forbidden body` 均有验收口径 | 可检查 |
| 下游反写 | 只写“不反写”原则 | 明确产品、runtime、服务仓、core、bus、registry、operator 的禁止行为 | 可审计 |
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
| A. 允许高级配置覆盖 | 灵活 | 可绕过 redaction、credential、evidence、compatibility 和 projection 红线 |
| B. 不允许配置改变红线,如需改变必须回上游重校准 | 保持架构不变量 | 运行时灵活性降低 | 采用 |
| C. 允许仅 staging-like 覆盖 | 测试方便 | 容易把 P1/P2 风险带入 P0 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 数据边界验收表

| 验收项 ID | 数据边界 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-BOUND-001 | SDK truth 只包含 client semantics、candidate、evidence、compatibility、docs / examples truth | repository / service 证据显示 truth 只由对应 command / job 写入,并有 version / audit / evidence | 服务端业务 truth、bus runtime truth、UI / runtime state 被写入 SDK truth | `TC-SDK-SEMANTIC-*`、`TC-SDK-CANDIDATE-*`、`TC-SDK-COMPAT-*` |
| AC-BOUND-002 | upstream / service / endpoint 只保存 snapshot 或 reference | core / bus / formal API / fake endpoint 均以 ref / digest / marker 保存 | SDK 保存上游正文、业务对象正文、事件 payload body 或生产请求响应正文 | `TC-SDK-CONTRACT-*`、`TC-SDK-BOUNDARY-*`、`TC-SDK-EVENT-*` |
| AC-BOUND-003 | forbidden body 不进入 truth / snapshot / event / log / audit / report | redaction check 证明 raw secret、credential value、request / response / payload body 缺席 | 任一 forbidden body 出现在持久化、输出、日志、artifact 或 report | `TC-SDK-SECURITY-004`、`EV-SDK-SECURITY-001` |
| AC-BOUND-004 | projection / query / cache 只读派生 | query 不开启写事务,projection rebuild 不写 truth,stale 返回 marker | query、projection、cache 自动补写 baseline、view、candidate 或 evidence truth | `SPECIAL-SDK-CONSISTENCY-001`、`SPECIAL-SDK-RECOVERY-001` |
| AC-BOUND-005 | runtime boundary call 不写 SDK truth | formal / fake / bus boundary result 只返回 result ref / diagnostic ref | `InvokeServiceCapability` 或 `PublishBusEvent` 直接写 SDK truth 或 service truth | `TC-SDK-BOUNDARY-*`、`TC-SDK-EVENT-*` |
| AC-BOUND-006 | report / artifact 只作证据,不补写事实 | report 能回链到固定 `<run_id>` artifact,不跨 run 拼接 | report 反向补造缺失 truth;使用 `latest` 或跨 run artifact | `TC-SDK-SMOKE-003`、`TC-SDK-SECURITY-004`、`reports/runs/<run_id>` |

### 7.2 架构红线验收表

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 |
|---|---|---|---|---|
| AC-RED-001 | 不得重新定义 `L0-core` truth | SDK 通过 dependency / snapshot ref 使用 ErrorCode、TraceContext、Metadata 等契约 | SDK 自行定义并作为权威使用同类共享契约 | `TC-SDK-CONTRACT-*`、dependency snapshot |
| AC-RED-002 | 不得重新定义 `L0-bus` event runtime truth | SDK 只保存 bus event client view 和 publish / subscription boundary ref | SDK 生成 delivery、retry、dead-letter、replay 或 tap truth | `TC-SDK-EVENT-*` |
| AC-RED-003 | 不得拥有服务端业务 truth | formal API / fake boundary 只返回 ref-only result / diagnostic ref | SDK 保存服务端领域状态、业务规则或生产请求响应正文 | `TC-SDK-BOUNDARY-*` |
| AC-RED-004 | 不得执行 auth / governance 决策 | SDK 只传播 actor / trace / credential ref,不裁决身份和权限 | SDK 接口、配置或 docs 表达 login、permission、approval truth | `SPECIAL-SDK-SEC-002` |
| AC-RED-005 | 不得保存 raw secret / credential | 配置和 runtime 只保存 secret / credential ref | raw secret、token、private key 或 credential value 进入配置、日志、report、evidence | `TC-SDK-SECURITY-001`、`TC-SDK-SECURITY-004` |
| AC-RED-006 | fake success 不得污染 production supported / stable | `FakeOnly` 不支撑 production supported 或 candidate `Stable` | fake result 被标 `Supported` 或支撑 `Stable` | `TC-SDK-BOUNDARY-003`、`TC-SDK-CANDIDATE-004` |
| AC-RED-007 | evidence / candidate gate 不得被跳过 | `Passed + Redacted` 且 compatibility 合法后才可 stable | skipped、unredacted、failed 或 missing evidence 支撑 verified / stable | `TC-SDK-SECURITY-003`、`TC-SDK-SMOKE-002`、`TC-SDK-CANDIDATE-*` |
| AC-RED-008 | 配置不得关闭关键红线 | ConfigValidator 拒绝 disable redaction、raw secret、unsupported remote config、hot reload | 配置可关闭 redaction / evidence / compatibility gate 或隐式 hot reload | `TC-SDK-SECURITY-001~002`、`SPECIAL-SDK-CONFIG-001` |
| AC-RED-009 | P1/P2 能力不得污染 P0 默认路径 | public registry、production endpoint、real credential provider 缺失不阻断 P0 | P1 未就绪导致 P0 失败,或 P1 能力改变 P0 semantic / gate | `TC-SDK-SMOKE-004`、risk acceptance |
| AC-RED-010 | reports / artifacts 不得泄漏 forbidden body | evidence index、redaction check 和 report scan 均 clean | forbidden body 出现在 artifacts、reports、acceptance handoff 或 review notes | `TC-SDK-SECURITY-004`、`redaction-check.md` |

### 7.3 边界关系图

图类型: 数据边界图

图标题: L0-sdk truth、snapshot、reference 与 forbidden body 边界

```text
external truth / bodies
  +-- core contracts -----------> [snapshot/ref] --+
  +-- bus semantics ------------> [snapshot/ref] --|
  +-- formal API boundary ------> [snapshot/ref] --|
  +-- fake / fixture endpoint --> [reference] -----|
  +-- business payload body -----X forbidden body  |
  +-- production req/res body ---X forbidden body  |
  +-- raw secret / credential ---X forbidden body  |
  +-- UI / runtime state --------X forbidden body  |
                                                   v
                                            SDK truth
                         client semantics / candidate / evidence
                         docs examples / compatibility / deprecated
                                                   |
                                                   v
                                         projections / reports
                            capability / evidence / compatibility views
                                                   |
                                                   X no write back to truth
```

关键说明:

- snapshot / reference 可以进入 SDK truth,body 不能进入 SDK truth。
- projection、report、artifact 从 SDK truth 或 test run 派生,但不能反写 SDK truth。
- 下游消费 package、client、docs 和 evidence,不能把自身状态写回 SDK truth。
- P1/P2 adapter 只能接入端口和风险记录,不能改变 P0 official SDK 闭环。

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_06_boundary_gate.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“数据边界验收表”“架构红线验收表”和“边界关系图”小节,了解本章如何把数据所有权和架构红线转换为验收门禁。

L0-sdk 只拥有 SDK truth、上游快照和外部引用三类合法数据。SDK truth 包括官方客户端公共概念与语言映射口径、package candidate 状态、默认错误 / trace / redaction 行为、版本兼容与 deprecated 结论、quickstart / docstring / 示例内容、跨语言验证证据结论。上游快照包括 `L0-core` 契约派生类型视图、`L0-bus` 事件语义客户端视图、L1/L2/L3/L4 服务边界客户端视图。外部引用包括上游版本引用、ADR / 标准 / 设计文档引用、fake / fixture endpoint 引用、reports / artifacts / 发布证据引用。

业务对象正文、事件实例 payload 正文、生产请求 / 响应正文、观测日志正文、UI / runtime 状态正文、token、secret、credential、password、private key 正文不得进入 SDK truth、snapshot、event、log、audit、artifact 或 report。任一 forbidden body 命中都不得判定通过,并在 Step 11 作为一票否决候选处理。

产品仓、runtime、服务仓、core、bus、registry 和 operator 均不得通过 query、projection、cache、report、artifact、runtime boundary call 或生态增强能力反向改写 SDK truth。Query 不得写 truth,projection missing / stale 不得自动补写 truth;rebuild 只能由受控 job 或 operator flow 处理。

Public registry、production formal API endpoint 全集、real credential provider、remote config / hot reload、MCP / REST / GraphQL / REPL、offline cache、full service client coverage 等 P1/P2 能力不得污染当前 P0 默认路径、语义、进入条件或通过条件。它们只作为接缝验收、后续专项或残余风险记录。

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
