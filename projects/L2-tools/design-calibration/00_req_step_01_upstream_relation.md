# L2-tools 需求 Step 1:与上游文档的关系声明

> Step 状态: completed
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §1
> 本步原则: 先建立 authority 与承接关系,不提前定义本仓能力清单、协议或实现。

---

## 1. Step 状态

### 本步目标

说明新版 L2-tools 需求从哪些当前 workspace 正式文档和全局规则细化而来,区分 authority、协作输入、historical material 与开放 blocker,防止用旧 L2 自证旧定位。

### 1.1 Step 内计划

| 计划项 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 读取项目级台账与 flow | 三层恢复点一致性记录 | done | 当前只允许 Step 1,正式 00 不可写。 |
| SOP 问题回答 | §3 SOP 问题回答 | done | SOP Step 1 和规范 §4.1 的四问均回答。 |
| 当前材料 / 旧文档诊断 | §4 当前文档问题诊断与 §5 改动前后对比 | done | owner、consumer、禁区和未闭口项分开,旧结论仅用于发现冲突。 |
| 设计取舍 | §6 设计取舍 | done | 不以旧 L2 为 authority。 |
| 形成结构化中间产物 | §7 结构化中间产物 | done | 固定来源映射表、来源状态约束与收束短文可审查。 |
| 复杂度判断 / 是否拆模块或附录 | §7 结构化中间产物 | done | 固定来源映射表与一段收束短文足以承载本步结论,无需拆附录。 |
| 形成回填草稿 | §8 | done | 使用固定三列来源映射表 + 一段两句来源收束短文。 |
| Step 17 受控回退复核 | §3~10 | done | Core 当前编译期依赖、Bus 当前事件协作依赖与 SDK future / excluded 边界分层明确;具体 schema、producer / route 与 client seam 继续开放。 |
| 自检与停审 | §10 | done | 未提前写功能、对象、API、事件或技术形态。 |

---

## 2. 本步输入

- 六份启动标准和需求 SOP / 书写规范。
- `projects/L3-capability-hub`、`projects/L4-sandbox`、`projects/L4-observability` 当前正式 `00~07`。
- `projects/L0-core`、`projects/L0-bus`、`projects/L0-sdk` 当前正式 `00~07`。
- L2-tools README 与旧 `00/01/02/03/05/06`,仅作后置差异审计。
- 已完成项目的 calibration 粒度,重点是 `L3-capability-hub`、`L1-artifact`、`L3-method-library`。

### 2.1 本步预期输出

- 上游来源分层。
- 承接主题与不重定义说明。
- 上游冲突 / blocker 登记。
- §1 回填草稿。

---

## 3. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| 本文承接哪些上游文档? | 承接全局依赖 / truth-closure 标准,以及 Capability Hub、Sandbox、Observability、Core、Bus、SDK 当前 workspace 输入中与工具消费、执行和安全交接有关的边界;Observability 输入受 `L2T-UP-006/007` 限定。 |
| 承接的是哪部分主题? | 承接 capability identity / descriptor / controlled exposure,隔离执行 / capture / failure truth,body-free observation handoff,Core 当前编译期共享契约关系、Bus 当前事件协作关系和 SDK future / excluded client 边界;Tools-specific schema、producer / route 与 client seam 继续开放。 |
| 为什么不是重新定义上游主题? | 新版 00 只定义 L2-tools 自身必须拥有的行动契约真相及其消费 / 交接要求;不复制上游 registry、sandbox 或 observation truth。 |
| 本文承担什么细化作用? | 把上游闭合边界转译为稳定 tool identity / definition、canonical invocation、normalized result / error 和 ToolAuditEntry 的需求层 owner/consumer 约束,供后续 L2-runtime 消费。 |

---

## 4. 当前文档问题诊断

当前文档问题必须先由 authority、协作输入和开放 blocker 的分层证据定位,不能从旧 L2 正文反推。以下输入分层既是诊断依据,也明确了当前材料中可以承接和不得推断的内容。

### 4.1 规范 authority

| 来源 | 权威主题 | 本步采用 | 本步不推断 |
|---|---|---|---|
| `standards/document/全局项目依赖关系与裁剪规则.md` | L2-tools 在 Layer 1 truth/control closure 之后、L2-runtime 之前 | L2 先闭工具契约,Runtime 后消费 | 不从层级顺序推导具体 crate / API / transport |
| `standards/document/设计真相源闭环与可落码性标准.md` | owner、consumer、handoff、failure、evidence 闭环 | 每类工具事实必须有唯一 owner 和 fail-closed 边界 | 不以“后续实现补齐”掩盖设计缺口 |
| 需求 SOP / 书写规范 | 17 Step、核心能力小循环、16 章正文和追溯 | 本轮逐 Step 重建正式 00 | 不把旧 13 节目录增量修补 |

### 4.2 当前 workspace 正式上游

| 上游 | authority / 已闭边界 | L2-tools 承接方式 | L2-tools 禁止重定义 |
|---|---|---|---|
| `L3-capability-hub` | capability identity、descriptor、formal exposure、controlled consumer view / ref | 只消费 typed ref 和允许的 safe summary,用于工具定义绑定 | capability registry truth、descriptor truth、exposure truth、applicability 或治理裁决 |
| `L4-sandbox` | isolation environment、run、capture、failure、handoff、cleanup truth | 提交满足执行要求的调用语境,消费 capture / failure ref 并做工具语义归一化 | sandbox isolation、run、capture、failure、cleanup truth;不得把 capture 等同 ToolInvocationResult |
| `L4-observability` | body-free、安全、可关联的观察材料与 no-write truth | 仅交接 redacted / body-free safe material 和关联引用 | observation store、retention、projection truth;不得让观察面裁决结果或驱动 retry / kill / recovery |
| `L0-core` | 平台共享基础契约来源与当前编译期依赖边界 | 后续设计仅消费正式发布且适用的共享基础类型;Tools-specific schema / contract authority 继续待闭口 | 不在需求阶段声明具体 crate/type 已可复用,不把 L0-core 变成 tool registry |
| `L0-bus` | 当前事件协作与传递 truth 边界 | 已成立工具事实需要跨仓协作时使用正式事件 carrier;Tools-specific producer / source / route 继续待闭口 | 不私造 Tools 事件名、producer family、route、receipt 或 dead-letter schema |
| `L0-sdk` | future / excluded 下游 SDK client 交付边界 | 未来 SDK 可消费服务端稳定工具契约;当前不构成 L2-tools 项目依赖 | 不在 L2 实现 SDK client,也不通过 SDK 反写工具真相 |

### 4.3 下游约束来源

| 下游 | 当前关系 | 本需求需提前稳定的 seam |
|---|---|---|
| `L2-runtime` | 正式全局顺序中的直接下游 | tool identity / definition 消费、canonical invocation、normalized result/error、correlation/audit handoff;Runtime 自己拥有 agent loop 与 orchestration。 |
| 后续 member runtime / products | 间接下游,当前不作直接前置 | 只能经 Runtime 或未来正式服务面消费,不得反向定义 L2 真相。 |

### 4.4 上游 blocker / pending

| ID | 缺口 | 当前影响 | 当前约束 |
|---|---|---|---|
| `L2T-UP-001/002` | Sandbox policy owner 循环引用、source matrix 与 high-risk taxonomy 未闭口 | 不阻塞需求定位;阻塞后续 effective policy / authorization 设计 | L2 只声明工具风险和执行要求;有效治理裁决不归 L2;未知时 fail closed。 |
| `L2T-UP-003/004` | ToolInvocation 到 generic Sandbox chain 的映射、downstream receipt / dead-letter 未闭口 | 后续 02/03/05/07 必须显式承接 | 当前只固定 adapter responsibility 和禁止伪造协议。 |
| `L2T-UP-005` | Observability 无 Tools-specific producer/source family | 影响安全观察材料交接方式 | 当前只写需求级 safe handoff;不得私造 enum / route / schema。 |
| `L2T-UP-006/007` | Observability 正式链状态冲突、当前输入未冻结提交 | 影响 readiness 与基线声明 | 只称 current workspace input,不声称 implementation-ready 或 immutable baseline。 |
| `L2T-UP-008` | Core 需求承诺共享契约类别,但当前正式概要 / 详细设计没有 tools-specific shared schema | 不阻塞需求 owner 边界;阻塞跨仓字段 / schema 定稿 | 当前只引用 actor / metadata / error / trace / envelope 等共享类别候选;不得声称 Tool schema 已存在于 Core。 |
| `L2T-UP-009` | SDK 只有 generic formal API / fake boundary,没有 tools-specific client | 不阻塞需求;影响后续 SDK 联调 | 当前只声明可被正式客户端消费,不承诺现成 tools SDK client。 |

---

### 4.5 诊断结论

#### 4.5.1 诊断

1. L2 的当前权威来源不是旧 L2 文档,而是现行标准、全局依赖顺序和当前 workspace 上游中可承接的 owner / consumer 结论。
2. 当前可承接结论足以支持需求来源声明:Hub 不拥有 invocation, Sandbox 不拥有工具语义结果, Observability 不拥有执行真相, Runtime 又需要稳定消费面;这不表示上游 implementation readiness 已成立。
3. 上游仍有 policy 与 handoff 形态缺口,但这些缺口不改变需求层 owner 边界;它们应作为后续设计 gate,不能由 L2 需求脑补关闭。
4. Core 当前编译期依赖和 Bus 当前事件协作依赖已经成立,但不得据此推定 Tools-specific crate / schema、event producer / source / route 已存在;SDK 仅是 future / excluded client seam,不是当前项目依赖。

---

## 5. 改动前后对比

以下 historical material 差异表记录旧口径、当前诊断与处理结果,作为本步改动前后的逐项对比。

| 旧材料位置 | 旧口径 | 当前诊断 | 处理结果 |
|---|---|---|---|
| `README.md` 仓使命 / 技术栈 / Tool 分类 | Python 同栈 monorepo、具体 builtin、MCP Client、Role extras | 过早锁定实现和产品库存 | historical only;不进入来源声明。 |
| 旧 `00` §1~§6 | runtime 手脚、MCP allowlist、member-images extras、具体功能 | 把相邻仓 owner 和具体产品形态写成需求前提 | historical only;Step 2~14 重新校准。 |
| 旧 `01` vs 旧 `03` | Python 同进程包 vs Rust RPC/HTTP 服务 | 同一正式链技术与部署形态互相冲突 | 两者都不作 authority。 |
| 旧 `02/03` capability 注册 | 本地 RegisterToolDefinition / registry | 与 Hub registry truth 冲突 | 明确排除。 |
| 旧 `03` history / replay / metrics / trace persistence | L2 维护调用与观测数据库 | 膨胀为 execution history 和 observability store | 明确排除。 |
| 旧 `05/06` | 固定事件名、错误码、SLA、验收成熟度 | 无当前 authority 或真实 evidence | 不继承、不伪造。 |

---

## 6. 设计取舍

| 议题 | 采用 | 不采用 | 原因 |
|---|---|---|---|
| 来源层次 | 标准 authority + current workspace 上游 + historical 差异审计 | 以旧 L2 README/00 为主线 | 避免旧方案自证。 |
| Capability Hub | controlled ref consumer | 本地 capability registry / allowlist truth | 保持单一 registry owner。 |
| Sandbox | execution-truth consumer + semantic normalizer | L2 拥有 sandbox run/capture truth | 保持隔离执行单一 owner。 |
| Observability | safe-material handoff consumer | L2 或 Observability 互相反写 truth | 保持 no-write truth。 |
| Core / Bus / SDK | Core 当前编译期依赖 + Bus 当前事件协作依赖 + SDK future / excluded 边界;只把 Tools-specific schema / route / client seam 保持开放 | 将三者笼统降级为协作候选,或直接锁定具体 crate / event / client | 区分已确认仓际关系与尚未闭口的具体契约,同时不提前设计实现。 |

---

## 7. 结构化中间产物

### 7.1 正式来源映射

| 来源文档 | 上游章节/模块 | 承接内容 |
|---|---|---|
| `standards/document/全局项目依赖关系与裁剪规则.md` | `§4 总依赖矩阵` | `L2-tools` 位于 Layer 1 truth / control closure 之后、`L2-runtime` 之前的全局依赖位置。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `§4.1 系统讨论顺序与并行窗口` | `L2-tools` 先闭工具契约与 capability / sandbox 边界、再供 Runtime 消费的讨论前置。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | `§2.1 设计真相源必须唯一` | owner、consumer、handoff、failure 与 evidence 的单一真相源约束。 |
| `projects/L3-capability-hub/00-需求文档.md` | `§2 本仓定位与边界` | capability identity、descriptor、registry、formal exposure 与 controlled consumer boundary 主题。 |
| `projects/L3-capability-hub/00-需求文档.md` | `§12 接口与依赖` | Capability Hub 受控引用与安全摘要的消费边界。 |
| `projects/L4-sandbox/00-需求文档.md` | `§2 本仓定位与边界` | isolation environment、run、capture、failure、handoff 与 cleanup truth 主题。 |
| `projects/L4-sandbox/00-需求文档.md` | `§12 接口与依赖` | 工具调用进入隔离执行及 execution material 返回的协作边界。 |
| `projects/L4-observability/00-需求文档.md` | `§2 本仓定位与边界` | 作为 current workspace input 的 observation material、audit projection、retention 与 no-write truth 主题。 |
| `projects/L4-observability/00-需求文档.md` | `§12 接口与依赖` | 作为 current workspace input 的 body-free、redacted、correlated safe material 只读交接边界。 |
| `projects/L0-core/00-需求文档.md` | `§7 核心能力闭环` | 共享 ID、引用、错误、追踪、metadata 与 envelope 等基础契约类别候选。 |
| `projects/L0-bus/00-需求文档.md` | `§7 核心能力闭环` | 已成立事实的事件协作与传递 truth 边界。 |
| `projects/L0-sdk/00-需求文档.md` | `§12 接口与依赖` | 下游客户端消费服务端正式契约的边界。 |

### 7.2 来源状态收束

上述来源共同限定当前需求的细化范围,但不改变各来源主题的 owner。`L4-observability` 只作为 current workspace input 使用;`L2T-UP-006/007` 继续开放,不得据此声明 immutable baseline 或 implementation readiness。

---

## 8. 回填草稿

| 来源文档 | 上游章节/模块 | 承接内容 |
|---|---|---|
| `standards/document/全局项目依赖关系与裁剪规则.md` | `§4 总依赖矩阵` | `L2-tools` 位于 Layer 1 truth / control closure 之后、`L2-runtime` 之前的全局依赖位置。 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | `§4.1 系统讨论顺序与并行窗口` | `L2-tools` 先闭工具契约与 capability / sandbox 边界、再供 Runtime 消费的讨论前置。 |
| `standards/document/设计真相源闭环与可落码性标准.md` | `§2.1 设计真相源必须唯一` | owner、consumer、handoff、failure 与 evidence 的单一真相源约束。 |
| `projects/L3-capability-hub/00-需求文档.md` | `§2 本仓定位与边界` | capability identity、descriptor、registry、formal exposure 与 controlled consumer boundary 主题。 |
| `projects/L3-capability-hub/00-需求文档.md` | `§12 接口与依赖` | Capability Hub 受控引用与安全摘要的消费边界。 |
| `projects/L4-sandbox/00-需求文档.md` | `§2 本仓定位与边界` | isolation environment、run、capture、failure、handoff 与 cleanup truth 主题。 |
| `projects/L4-sandbox/00-需求文档.md` | `§12 接口与依赖` | 工具调用进入隔离执行及 execution material 返回的协作边界。 |
| `projects/L4-observability/00-需求文档.md` | `§2 本仓定位与边界` | 作为 current workspace input 的 observation material、audit projection、retention 与 no-write truth 主题。 |
| `projects/L4-observability/00-需求文档.md` | `§12 接口与依赖` | 作为 current workspace input 的 body-free、redacted、correlated safe material 只读交接边界。 |
| `projects/L0-core/00-需求文档.md` | `§7 核心能力闭环` | 共享 ID、引用、错误、追踪、metadata 与 envelope 等基础契约类别候选。 |
| `projects/L0-bus/00-需求文档.md` | `§7 核心能力闭环` | 已成立事实的事件协作与传递 truth 边界。 |
| `projects/L0-sdk/00-需求文档.md` | `§12 接口与依赖` | 下游客户端消费服务端正式契约的边界。 |

本文承接上述全局规则与当前 workspace 正式输入,仅在 `L2-tools` 内细化工具协作主题,不重新定义上游主题。`L4-observability` 仅属 current workspace input;`L2T-UP-006/007` 仍开放,不构成 immutable 或 implementation-ready baseline。

---

## 9. 待确认事项

本步没有新增待确认事项。`L2T-UP-001~009` 原样保持开放;其中 `L2T-UP-006/007` 明确限制 Observability current workspace input 的 readiness 与基线口径。它们只约束后续受影响的 policy、Sandbox adapter、observation producer、shared contract 和 SDK client seam,不改变本步来源映射结论。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 是否明确本文承接哪些上游? | 是。 |
| 是否说明承接主题? | 是。 |
| 是否说明不重新定义上游? | 是。 |
| 是否说明本仓细化作用? | 是。 |
| 是否把旧 L2 当 authority? | 否。 |
| 是否提前定义功能清单 / API / event / object / technology? | 否。 |
| 是否把 blocker 脑补成已关闭? | 否。 |
| 是否错误声称冻结 commit 或 implementation readiness? | 否。 |
| 正式来源映射是否精确使用 `来源文档 \| 上游章节/模块 \| 承接内容`? | 是。 |
| 正式来源映射是否一行只承接一个真实文档章节语义单元? | 是。 |
| 回填草稿是否只有一段两句来源收束短文? | 是。 |
| Observability 是否仅标记为 current workspace input 并保留 `L2T-UP-006/007`? | 是。 |
| §1 回填草稿是否只说明来源,未提前展开本仓职责 / 非职责? | 是。 |

### 10.2 模块状态

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| upstream source layering | done | done | done | done | done | pass | `pass` | 创建 Step 2,不得写正式 00。 |

### 10.3 停审结论

```text
step_status = completed
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = 读取需求 SOP Step 2 与书写规范 §4.2,创建 00_req_step_02_position_boundary.md
commit_required = false
```
