# L2-tools 需求 Step 4:目标与非目标

> Step 状态: completed
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §4
> 本步原则: 目标只写本轮结束后应成立的状态、边界和能力范围;不写功能名、接口名或实现路径。

---

## 1. Step 状态

### 本步目标

把 Step 2 的工具调用语义契约真相边界和 Step 3 的三个核心问题转化为可验证的需求目标,同时把 Runtime、Hub、governance、Sandbox、Observability、外部 registry、SDK 与产品库存明确挡在非目标之外。

### 1.1 Step 内计划

| 计划项 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 恢复三层状态 | §1 状态、§2 输入与 §10 门禁 | done | Step 3 pass,只允许 Step 4。 |
| 读取目标规范 | §3 问题回答 | done | 四问全部回答。 |
| 从问题推导目标候选 | §4.1 | done | 每个目标回指 Step 2 / 3,不以功能命名。 |
| 诊断目标污染 | §4 / §5 | done | 旧工具库存、API、事件、数字和技术栈全部剔除。 |
| 收束非目标 | §6 / §7.2 | done | 相邻 owner 和产品形态逐项排除。 |
| 形成结构化产物 | §7 | done | 目标、非目标、范围结论齐全。 |
| 复杂度判断 / 是否拆模块或附录 | §7 | done | 五项目标、十二项非目标和范围结论可在单文件完整审查,无需拆附录。 |
| 形成回填草稿 | §8 | done | 只含规范固定两表和范围短文。 |
| Step 17 受控回退复核 | §3 / §7~10 | done | 删除 calibration process 目标,五项目标只使用可观察的需求成立条件。 |
| 自检与停审 | §10 | done | 目标可验证,非目标具体,无功能 / 实现内容。 |

---

## 2. 本步输入

- 项目台账、需求 flow 与 Step 1~3。
- 需求 SOP Step 4 与书写规范 §4.4。
- 上游 capability / isolation execution / observation owner 边界。
- `L0-core` 当前编译期依赖及仍待闭口的 Tools-specific shared categories / schema / contract authority、`L0-bus` 当前 event collaboration 和 `L0-sdk` future / excluded downstream client 边界。
- 旧 L2 目标、功能、指标和验收材料,仅作后置污染审计。

### 2.1 本步预期输出

- 可验证目标表。
- 具体非目标表。
- 相邻仓 / 后续阶段分工。
- 范围收束结论与正式 §4 回填草稿。

---

## 3. SOP 问题回答

### 3.1 本次需求结束后应成立什么

1. 工具调用语义契约有独立、唯一且可追溯的需求真相范围。
2. 本地 tool identity / definition 与 Capability Hub capability truth 分离,受控绑定 seam 可被后续需求承接。
3. Runtime 消费的调用语义与 Runtime 自身 planning / orchestration truth 分离。
4. 工具语义执行与 Sandbox isolation execution truth 分层,需要隔离时不允许绕过或伪造结果。
5. 工具结果、错误和审计拥有统一语义与安全交接边界,不会被 Bus delivery audit 或 Observability projection 替代。

### 3.2 如何验证目标

目标通过可观察的系统边界与需求对象一致性验证,而不是在本步写测试动作:

- 核心能力、功能、规则、数据归属、接口和验收都锚定同一工具契约 truth owner,且不制造相邻仓第二真相。
- 本地 tool identity 与 capability ref、Runtime orchestration、Sandbox execution truth、Bus delivery audit 和 observation material 均可区分。
- 规范调用、条件化执行交接、normalized outcome、tool-domain audit 与安全 handoff 均有一致的 owner / consumer / failure 口径。

### 3.3 明确不纳入什么

不纳入 Runtime 决策与编排、capability / provider registry、effective governance / authorization、Sandbox isolation truth、Observability store、Bus 传递恢复、SDK client、具体工具与打包库存、external MCP / A2A / API provider control、marketplace、artifact / evidence 正文以及任何实现技术形态。

### 3.4 交给谁或后移何处

| 事项 | 正确归属 / 后移位置 |
|---|---|
| agent loop、LLM planning、step progression、retry / recovery、checkpoint | `L2-runtime` |
| capability identity / descriptor / registry / formal exposure | `L3-capability-hub` |
| policy / approval / effective authorization truth | 正式 governance / authorization owner;当前 owner seam 保持 blocker |
| isolation environment / run / capture / failure / handoff / cleanup truth | `L4-sandbox` |
| observation material / projection / retention / report handoff truth | `L4-observability` |
| publish / delivery / ack / retry / DLQ / replay-preparation truth | `L0-bus` |
| client mapping、language package、candidate 与 SDK 兼容 | `L0-sdk` |
| external provider / endpoint / route / quota / cost / secret truth | 对应 external registry / provider / security / finance owner |
| 具体字段、协议、状态、配置、测试、验收和 implementation boundary | Step 5~17 与后续正式 `01~07` |

---

## 4. 当前文档问题诊断

### 4.1 问题到目标的映射

| Step 3 问题 | 目标方向 | 不直接写成目标的内容 |
|---|---|---|
| 工具行动语义缺少可信单一边界 | 建立工具契约真相范围;分离 tool / capability / runtime truth | RegisterTool、GetTool、schema 字段、registry 技术实现 |
| 隔离执行事实与工具语义结果缺少稳定分层 | 收束统一调用与 execution seam;保护 Sandbox truth | Sandbox API、backend、capture mapper、timeout 数字 |
| 结果 / 错误 / 审计交接责任混写 | 收束 normalized outcome 与 safe handoff 范围 | 事件名、错误码、表结构、日志字段、存储选型 |

---

## 5. 改动前后对比

以下 historical material 差异表记录旧目标 / 非目标、当前诊断与处理方式,作为本步改动前后的逐项对比。

| 旧位置 | 旧目标 / 非目标 | 当前诊断 | 处理 |
|---|---|---|---|
| `README.md` | builtin + MCP Client + Role extras + Python package | 将产品库存、外部 client、镜像装配和技术栈写成使命 | 全部降为 historical material。 |
| 旧 `00` §3.1 | schema 100%、Sandbox 100%、MCP 必经 Hub、事件 100%、五角色 extras | 混入功能、规则、旧依赖、伪指标和验收 | 不继承;按五类边界目标重建。 |
| 旧 `00` §3.2 | 只排除 runtime 决策、白名单决策、隔离底座和镜像打包 | 缺少 registry、governance、observability、bus、SDK、provider、marketplace 等边界 | 当前非目标补齐。 |
| 旧 `01/02/03` | Python 包或 Rust service、RPC / HTTP、数据库 / replay | 设计和实现反向定义需求目标且互相冲突 | 不进入目标层。 |
| 旧 `05/06` | 旧事件、错误码、SLA、覆盖率和成熟度 | 无当前 evidence | 不作为验证方式。 |

---

## 6. 设计取舍

### 6.1 目标粒度取舍

| 候选目标 | 判定 | 理由 |
|---|---|---|
| “支持 file/git/test/browse 工具” | 排除 | 具体库存与产品范围,不是仓级目标。 |
| “所有工具 schema 覆盖率 100%” | 排除原写法 | 旧库存与测量基线不存在;目标层只固定工具定义边界,具体验收后移。 |
| “建立工具调用语义契约真相边界” | 采用 | 可通过后续 owner / data / interface / acceptance 结构验证。 |
| “建立 MCP Client” | 排除 | 外部 client / provider control 产品形态,非稳定 truth 目标。 |
| “危险 Tool 统一走 Sandbox” | 上收为边界目标 | 不在目标层定义风险枚举或接口,只固定需要隔离时不得绕过 Sandbox truth。 |
| “发送 ToolInvoked / Completed / Failed” | 排除原写法 | 事件名与三态过早;保留工具审计与安全交接目标。 |

### 6.2 范围取舍

- 当前需求核心是工具调用语义契约,不是某种语言包、服务或 monorepo。
- tool identity 是本地工具身份,不复制 capability identity;二者只通过受控 binding relation 关联。
- 工具调用语义可以消费 Sandbox 事实并形成 normalized outcome,但不得修改或替代 Sandbox truth。
- ToolAuditEntry 是 tool-domain audit truth;Bus 与 Observability 只在各自 owner 内承接传递或观察材料。
- 当前不把任何具体 builtin、MCP provider、Role extras、member image 或 marketplace 商品列为仓成立条件。

---

## 7. 结构化中间产物

### 7.1 目标表

| ID | 目标 | 说明 | 验证方式 |
|---|---|---|---|
| `G-L2T-001` | 建立工具调用语义契约真相边界 | 明确本仓拥有稳定 tool identity、tool definition、canonical invocation 及 normalized result / error / audit 的需求真相,而不是具体执行产品库存。 | 核心能力、功能、规则、数据归属、接口和验收均以同一 tool identity / definition owner 为锚点,且不存在第二 tool truth owner。 |
| `G-L2T-002` | 收束 Capability Hub 受控绑定边界 | 明确工具定义可以受控引用 capability identity / exposure,但不复制 registry、descriptor、applicability 或 exposure truth。 | 任一 binding 都能区分本地 tool identity 与 capability ref 及其正式来源,且 Hub applicability 不被解释为 invocation allow / deny。 |
| `G-L2T-003` | 收束 Runtime 消费与规范调用边界 | 明确 Runtime 消费稳定工具契约并提交规范调用语境,而调用时机、计划、编排、retry / recovery 与执行主线仍归 Runtime。 | Runtime 能围绕同一正式工具契约提交调用并消费 normalized outcome,而 L2-tools 不形成 agent loop、planning、orchestration、retry / recovery 或 checkpoint truth。 |
| `G-L2T-004` | 收束工具语义与执行 seam | 明确不同执行承载只能在同一工具调用语义下被消费;Sandbox-required 调用不得绕过隔离 truth,其 capture / failure 也不得直接冒充工具结果。 | Sandbox-required 调用不可旁路,execution material 与工具语义 outcome 的关系可验证,且本仓不拥有 Sandbox run / capture truth。 |
| `G-L2T-005` | 收束结果、错误与审计安全交接边界 | 明确一次工具调用的 normalized outcome、tool-domain audit 和对 Runtime / Bus / Observability 的安全交接语义,防止正文泄露和观察 / 传递真相反写。 | ToolAuditEntry、Bus delivery audit、observation material 与 result body / ref 的 owner 和交接边界可区分,外部 handoff 状态不反写本地工具终态。 |

### 7.2 非目标表

| ID | 非目标 | 不做原因 |
|---|---|---|
| `NG-L2T-001` | agent loop、LLM planning、动作选择、step progression、runtime orchestration、retry / recovery 与 checkpoint | 属于 `L2-runtime` 的运行主线,不是工具调用语义真相。 |
| `NG-L2T-002` | capability identity / descriptor / registry / formal exposure / applicability truth | 属于 `L3-capability-hub`;本仓只允许受控引用和本地 binding relation。 |
| `NG-L2T-003` | external MCP / A2A / API provider registry、endpoint / route、quota、cost、provider retry / failover 与 secret lifecycle | 属于外部能力、provider、安全或财务控制面;本仓不成为 external registry。 |
| `NG-L2T-004` | effective governance / authorization、approval workflow、allow / deny 与 policy truth | 属于正式治理 / 授权 owner;工具风险声明不得自我授权。 |
| `NG-L2T-005` | Sandbox isolation environment、run、capture、failure、control、handoff、cleanup 与 backend truth | 属于 `L4-sandbox`;本仓只消费引用 / 安全摘要并形成工具语义结果。 |
| `NG-L2T-006` | Observability 日志 / 指标 / 追踪 / audit projection、retention、query、report 与 alert store | 属于 `L4-observability`;本仓只交接 body-free 安全材料。 |
| `NG-L2T-007` | Bus publish / delivery / ack / retry / DLQ / replay-preparation / tap / transport audit truth | 属于 `L0-bus`;本仓只拥有 tool-domain fact 和 outbound handoff intent。 |
| `NG-L2T-008` | SDK client、语言 package、客户端映射 / candidate / cache 与 developer experience | 属于 `L0-sdk`;本仓只提供未来可消费的服务端契约边界。 |
| `NG-L2T-009` | 具体 builtin 工具清单、MCP Client 产品、Role extras、member-images 装配与 provider runtime | 这些是产品库存、适配或分发形态,不能定义本仓 truth。 |
| `NG-L2T-010` | artifact / evidence 正文、Sandbox raw stdout / stderr / capture body、prompt / checkpoint / conversation 正文 | 正文归各自 owner;本仓只在允许时拥有结构化工具语义结果或受控引用。 |
| `NG-L2T-011` | marketplace listing、定价、交易、购买与履约 | 属于 marketplace / product distribution 边界。 |
| `NG-L2T-012` | 当前锁定编程语言、进程形态、RPC / HTTP、数据库、队列、部署拓扑、错误码、事件名或性能数字 | 属于后续设计 / 配置 / 测试阶段;旧材料不足以成为当前 authority。 |

### 7.3 范围收束结论

本轮只把 L2-tools 收束为 runtime 行动契约层中的工具调用语义契约真相仓。它拥有本地工具合同、规范调用和工具语义 outcome / audit,并通过受控引用消费 Hub、governance 与 Sandbox 等外部真相;它不拥有 Runtime 编排、capability / provider registry、授权裁决、隔离执行、观察 / 传递存储、SDK client 或产品库存。

---

## 8. 回填草稿

### 4.1 目标

| 目标 | 说明 | 验证方式 |
|---|---|---|
| `G-L2T-001` 建立工具调用语义契约真相边界 | 明确本仓拥有稳定 tool identity、tool definition、canonical invocation 及 normalized result / error / audit 的需求真相,而不是具体执行产品库存。 | 核心能力、功能、规则、数据归属、接口和验收均以同一 tool identity / definition owner 为锚点,且不存在第二 tool truth owner。 |
| `G-L2T-002` 收束 Capability Hub 受控绑定边界 | 明确工具定义可以受控引用 capability identity / exposure,但不复制 registry、descriptor、applicability 或 exposure truth。 | 任一 binding 都能区分本地 tool identity 与 capability ref 及其正式来源,且 Hub applicability 不被解释为 invocation allow / deny。 |
| `G-L2T-003` 收束 Runtime 消费与规范调用边界 | 明确 Runtime 消费稳定工具契约并提交规范调用语境,而调用时机、计划、编排、retry / recovery 与执行主线仍归 Runtime。 | Runtime 能围绕同一正式工具契约提交调用并消费 normalized outcome,而 L2-tools 不形成 agent loop、planning、orchestration、retry / recovery 或 checkpoint truth。 |
| `G-L2T-004` 收束工具语义与执行 seam | 明确不同执行承载只能在同一工具调用语义下被消费;Sandbox-required 调用不得绕过隔离 truth,其 capture / failure 也不得直接冒充工具结果。 | Sandbox-required 调用不可旁路,execution material 与工具语义 outcome 的关系可验证,且本仓不拥有 Sandbox run / capture truth。 |
| `G-L2T-005` 收束结果、错误与审计安全交接边界 | 明确 normalized outcome、tool-domain audit 和对 Runtime / Bus / Observability 的安全交接语义,防止正文泄露和观察 / 传递真相反写。 | ToolAuditEntry、Bus delivery audit、observation material 与 result body / ref 的 owner 和交接边界可区分,外部 handoff 状态不反写本地工具终态。 |

### 4.2 非目标

| 非目标 | 不做原因 |
|---|---|
| Runtime planning / orchestration / retry / recovery / checkpoint | 属于 `L2-runtime`,不是工具调用语义真相。 |
| capability / external provider registry 与 provider control | 分属 `L3-capability-hub` 及外部 provider / security / finance owner;本仓只使用受控引用。 |
| effective governance / authorization / approval / policy truth | 属于正式治理 / 授权 owner;工具风险声明不得自我授权。 |
| Sandbox isolation execution / capture / failure / cleanup truth | 属于 `L4-sandbox`;本仓不把隔离事实冒充工具语义结果。 |
| Observability store 与 Bus delivery / recovery truth | 分属 `L4-observability` 与 `L0-bus`;不得替代 ToolAuditEntry 或结果真相。 |
| SDK client、具体 builtin / MCP Client、Role extras、member-images 与 marketplace | 属于客户端、产品库存、适配或分发边界,不定义本仓 truth。 |
| 外部正文与当前技术 / 协议 / 指标定稿 | 正文归各自 owner;语言、部署、接口、字段、事件、错误码和指标后移正式设计。 |

### 4.3 范围收束

本轮只把 L2-tools 收束为 runtime 行动契约层中的工具调用语义契约真相仓。它拥有本地工具合同、规范调用和工具语义 outcome / audit,并通过受控引用消费外部真相;它不拥有 Runtime 编排、registry、授权裁决、隔离执行、观察 / 传递存储、SDK client 或产品库存。

---

## 9. 待确认事项

本步没有新增待确认事项。Effective authorization owner、Sandbox mapping、Observability producer、Core Tools-specific shared schema / contract authority 与 SDK tools-specific client seam 等既有开放 seam 不阻塞目标 / 非目标收敛,但继续阻塞相应后续具体合同定稿。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 5 个需求目标是否均描述系统状态 / 边界并可直接验证? | 是。 |
| 是否有目标写成功能名 / 接口名? | 否。 |
| 是否有目标写成技术或部署方案? | 否。 |
| 是否存在 calibration / historical-material 流程目标? | 否。 |
| §7 / §8 的目标验证方式是否不引用 Step 编号或文档流程? | 是。 |
| 是否已清除非产品的 historical-material 流程目标并保持 `G-L2T-001~005` 编号稳定? | 是。 |
| 非目标是否具体且有 owner 边界作用? | 是。 |
| 是否回应 Step 3 三个问题? | 是。 |
| 是否保护 Step 2 精确定位? | 是。 |
| 是否继承旧功能、事件、数字或测试结论? | 否。 |
| 是否伪造上游 blocker 已解决? | 否。 |

### 10.2 模块状态

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| goals | done | done | done | done | done | pass | `pass` | 进入 non_goals。 |
| non_goals | done | done | done | done | done | pass | `pass` | 进入 scope_closure。 |
| scope_closure | done | done | done | done | done | pass | `pass` | 更新 flow / ledger 后创建 Step 5。 |

### 10.3 停审结论

```text
step_status = completed
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = 读取需求 SOP Step 5 与书写规范 §4.5,创建 00_req_step_05_users_roles.md
commit_required = false
```
