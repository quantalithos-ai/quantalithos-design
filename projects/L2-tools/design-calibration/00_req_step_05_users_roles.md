# L2-tools 需求 Step 5:用户与角色

> Step 状态: completed
> 当前模式: full-restart
> 正式回填目标: `00-需求文档.md` §5
> 本步原则: 只说明谁以什么身份接触工具调用语义契约及其场景;不把具体仓际依赖、用户故事或接口动作写成角色。

---

## 1. Step 状态

### 本步目标

识别直接维护、审查、查看、消费或诊断工具调用语义契约的主要身份,区分人类角色和系统角色,并判断是否需要在需求目标阶段建立权限矩阵。

### 1.1 Step 内计划

| 计划项 | 可审查产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 恢复三层状态 | §1 状态、§2 输入与 §10 门禁 | done | Step 4 pass,只允许 Step 5。 |
| 读取角色规范 | §3 五问回答 | done | 角色 / 类型 / 场景齐全。 |
| 识别人类角色 | §4.1 | done | 只保留直接接触工具契约的身份。 |
| 识别系统角色 | §4.2 | done | 用抽象身份,不把仓名当角色。 |
| 审计管理 / 审查 / 维护场景 | §4.3 | done | 不越权生成 policy / approval truth。 |
| 判断权限矩阵 | §3.5 / §7.3 | done | 当前不固化权限矩阵。 |
| 后置审计旧材料 | §5 | done | 旧接口动作、工具库存和仓际依赖已剔除。 |
| 复杂度判断 / 是否拆模块或附录 | §7 | done | 八类角色及权限差异可在单文件完整审查,无需拆附录。 |
| 结构化并回填 | §7~8 | done | 固定三列表完整。 |
| 自检与停审 | §10 | done | 无依赖、故事、接口或实现内容。 |

---

## 2. 本步输入

- 项目台账、需求 flow 与 Step 1~4。
- 需求 SOP Step 5 与书写规范 §4.5。
- Step 4 已确认的 Runtime、Hub、governance、Sandbox、Observability、Bus、SDK 和产品库存非目标。
- 相邻正式文档中的 maintainer、reviewer、consumer、operator 和 audit 场景线索。
- 旧 L2 用户群体、角色矩阵和故事主语,仅作后置差异审计。

### 2.1 本步预期输出

- 人类角色与系统角色清单。
- 每个角色的使用场景。
- 管理 / 审查 / 审计 / 维护角色判定。
- 权限矩阵是否需要的结论。
- 正式 §5 回填草稿。

---

## 3. SOP 问题回答

### 3.1 主要角色

| 角色 | 类型 | 使用场景 |
|---|---|---|
| 工具契约维护者 | 人类管理 / 维护角色 | 在工具身份、定义、调用语义或结果语义需要建立、调整、退役或解释时维护正式契约语境。 |
| 安全 / 边界审查者 | 人类审查角色 | 审查工具固有风险声明、执行要求、外部引用边界和正文安全边界是否清晰,但不在本仓形成 effective authorization truth。 |
| 审计 / 合规查看者 | 人类只读角色 | 查看工具契约变化、调用语义结果和 tool-domain audit 线索,判断一次行动是否可解释、可追溯且未越过 owner 边界。 |
| 运行问题调查者 | 人类诊断角色 | 在调用失败、结果歧义、依赖缺失或安全交接异常时,沿关联语境区分工具语义、隔离执行、传递和观察层问题。 |
| 工具调用消费方 | 系统消费角色 | 在自身执行主线中消费稳定工具定义,提交工具调用语境并接收 normalized result / error,但不改写工具契约 truth。 |
| 执行接缝协作方 | 系统协作角色 | 按工具声明的执行要求承接或反馈实际执行材料,但其自身 execution truth 不由工具契约替代。 |
| 安全材料消费方 | 系统只读角色 | 消费 body-free、redacted、可关联的结果 / 错误 / audit 摘要或引用,但不据此反写工具结果。 |
| 工具契约维护任务 | 系统维护角色 | 执行一致性检查、引用有效性检查、派生视图重建或历史对账,但不创造新的工具业务结论。 |

### 3.2 人类 / 系统分类

- 人类角色:工具契约维护者、安全 / 边界审查者、审计 / 合规查看者、运行问题调查者。
- 系统角色:工具调用消费方、执行接缝协作方、安全材料消费方、工具契约维护任务。
- 本章不把 Runtime、Capability Hub、Sandbox、Bus、Observability 或 SDK 的仓名直接写成角色;它们与上述抽象系统角色的对应关系在 Step 6 / 12 裁剪。

### 3.3 接触场景边界

| 角色 | 可在本章表达的场景 | 本章禁止展开 |
|---|---|---|
| 工具契约维护者 | 维护 / 解释稳定工具契约语境 | 具体注册命令、字段、状态机、存储或技术栈 |
| 安全 / 边界审查者 | 审查风险、执行要求、引用和正文边界 | policy DSL、approval workflow、allow / deny 算法 |
| 审计 / 合规查看者 | 只读理解契约变化和调用审计线索 | Observability query、evidence alias、验收签署 |
| 运行问题调查者 | 区分工具、执行、传递和观察层问题 | retry / replay / kill / recover 操作或 incident 工具 |
| 工具调用消费方 | 消费契约并提交 / 接收工具语义 | Runtime action dispatch、agent loop 或接口 path |
| 执行接缝协作方 | 交接实际执行材料并保留自身 truth | Sandbox request / response schema 或 adapter mapping |
| 安全材料消费方 | 读取安全摘要 / ref | producer family、event schema、route 或 retention |
| 工具契约维护任务 | 检查、派生、重建和对账 | 通过维护任务创建 / 授权 / 调用工具 |

### 3.4 管理、审计和维护角色

存在三类明确场景:

- 管理 / 维护:工具契约维护者负责工具契约业务语境,工具契约维护任务只做派生与一致性维护。
- 审查 / 安全:安全 / 边界审查者评估声明与边界是否充分,不替代 governance / authorization owner 作最终裁决。
- 审计 / 诊断:审计 / 合规查看者只读理解正式事实,运行问题调查者跨关联语境定位问题,二者都不成为结果写源或恢复编排者。

### 3.5 权限矩阵判定

本步不形成正式权限矩阵,原因如下:

1. effective authorization owner 和 policy source matrix 仍是上游 blocker,此处不能自行闭口。
2. “建立 / 调整 / 调用 / 查看 / 重放”等操作粒度需先经过 Step 7~12 的能力、功能、规则与接口校准。
3. 旧权限矩阵已把具体工具、Sandbox policy、Hub allowlist 和接口动作混在一起,不能继承。

当前只保留能力级差异:维护者管理契约语境;审查者审查边界;查看者与调查者只读理解;系统消费方受控消费;维护任务不得创造业务 truth。后续授权规则必须由正式 owner 和业务规则共同闭口。

---

## 4. 当前文档问题诊断

### 4.1 人类角色候选诊断

| 候选 | 判定 | 理由 |
|---|---|---|
| tool maintainer / developer | 收敛为“工具契约维护者” | 需求层关注维护契约语境,不假设具体代码实现者或工具库存。 |
| Security / Admin | 拆为“安全 / 边界审查者”;不保留泛 Admin | Admin 过宽且容易被误解为 authorization owner。 |
| Auditor | 收敛为“审计 / 合规查看者” | 只读理解 tool-domain facts,不拥有 observation store 或 acceptance signoff。 |
| SRE / oncall / operator | 收敛为“运行问题调查者” | 需求层只保留诊断身份,不提前授予 kill / retry / replay / recover。 |
| image maintainer / Role owner | 排除 | member-images 与 Role extras 已是非目标。 |
| marketplace operator / provider owner | 排除 | marketplace 与 external provider control 已是非目标。 |

### 4.2 系统角色候选诊断

| 候选 | 判定 | 理由 |
|---|---|---|
| Runtime | 抽象为“工具调用消费方” | 仓名和依赖关系后移 Step 6,角色章只表达消费身份。 |
| Capability Hub | 不作为角色 | 它是相邻仓而非接触工具合同的抽象身份;相关 owner 与依赖结论承接 Step 2 并后移 Step 6 / 12,本步不自行建立。 |
| Sandbox | 抽象为“执行接缝协作方” | 保留 execution handoff 场景,不把具体仓依赖写进角色表。 |
| Bus / Observability | 抽象为“安全材料消费方” | 两者实际 owner 不同,Step 6 / 12 再拆依赖和 handoff。 |
| SDK / console | 不单列 | 属于未来下游消费边界,不是当前直接角色主线。 |
| reconciliation worker | 收敛为“工具契约维护任务” | 只允许派生 / 检查 / 对账,不产生业务结论。 |

### 4.3 角色与 owner 边界诊断

角色名不改变真相归属:

- 工具契约维护者也不能在本仓创建 capability、policy、Sandbox 或 observation truth。
- 安全 / 边界审查者的审查动作不等于 effective allow / deny。
- 运行问题调查者不能以 observation material 改写 result / error 或触发 Runtime recovery。
- 执行接缝协作方保留自己的 execution truth,L2 只能形成工具语义解释。
- 安全材料消费方只消费安全材料,不能成为 ToolAuditEntry owner。

---

## 5. 改动前后对比

以下 historical material 差异表记录旧角色口径、当前问题与处理方式,作为本步改动前后的逐项对比。

| 旧位置 | 旧角色口径 | 问题 | 当前处理 |
|---|---|---|---|
| `README.md` 关键依赖 / Role extras | runtime、member-images、具体 Role 被混为使用者和打包对象 | 仓际关系、产品库存和角色定义混写 | 不继承。 |
| 旧 `00` §4.1 | runtime、tool maintainer、security、image maintainer | 部分是仓际使用方,部分绑定旧库存 / 镜像范围 | 只保留契约维护、安全审查和系统消费身份。 |
| 旧 `00` §4.2 | 调内置工具、危险工具、增加 Tool、修改 schema | 权限矩阵提前写功能、policy 和接口动作 | 删除;当前不形成权限矩阵。 |
| 旧 `00` §5 | 以 runtime / Security / member-images 写具体故事 | 用户故事提前进入角色章且继承 extras / MCP 主线 | Step 8 从当前角色重新生成。 |
| 旧 `01~03` | handler、client、operator、admin 等实现角色 | 实现组织反推需求身份 | 不进入角色结论。 |
| 旧 `05/06` | 测试者、验收者和签署方 | 无真实测试 / 验收授权事实 | 后移正式 05/06,当前不伪造。 |

---

## 6. 设计取舍

角色候选的采用、收敛与排除结论已逐项保留在 §4.1~§4.2 的候选诊断表中。本步采用抽象人类 / 系统身份,不采用仓名、实现岗位、产品库存或泛化 Admin 作为正式角色;角色名称不改变 §4.3 的 truth owner 边界。

---

## 7. 结构化中间产物

### 7.1 角色说明表

| 角色 | 类型 | 使用场景 |
|---|---|---|
| 工具契约维护者 | 人类管理 / 维护角色 | 在工具身份、定义、调用语义或结果语义需要建立、调整、退役或解释时维护正式契约语境。 |
| 安全 / 边界审查者 | 人类审查角色 | 审查工具固有风险声明、执行要求、外部引用边界和正文安全边界,但不在本仓形成 effective authorization truth。 |
| 审计 / 合规查看者 | 人类只读角色 | 查看工具契约变化、调用语义结果和 tool-domain audit 线索,判断行动是否可解释、可追溯且未越过 owner 边界。 |
| 运行问题调查者 | 人类诊断角色 | 在调用失败、结果歧义、依赖缺失或安全交接异常时,沿关联语境区分工具语义、隔离执行、传递和观察层问题。 |
| 工具调用消费方 | 系统消费角色 | 在自身执行主线中消费稳定工具定义,提交工具调用语境并接收 normalized result / error,但不改写工具契约 truth。 |
| 执行接缝协作方 | 系统协作角色 | 按工具声明的执行要求承接或反馈实际执行材料,但其自身 execution truth 不由工具契约替代。 |
| 安全材料消费方 | 系统只读角色 | 消费 body-free、redacted、可关联的结果 / 错误 / audit 摘要或引用,但不据此反写工具结果。 |
| 工具契约维护任务 | 系统维护角色 | 执行一致性检查、引用有效性检查、派生视图重建或历史对账,但不创造新的工具业务结论。 |

### 7.2 分类结论

| 分类 | 包含角色 | 需求边界 |
|---|---|---|
| 管理 / 维护类人类角色 | 工具契约维护者 | 管理 tool-domain contract,不管理相邻 truth。 |
| 审查类人类角色 | 安全 / 边界审查者 | 审查风险和边界,不形成 effective authorization。 |
| 查看 / 诊断类人类角色 | 审计 / 合规查看者、运行问题调查者 | 只读理解和定位,不反写结果或编排恢复。 |
| 系统消费角色 | 工具调用消费方 | 受控消费工具合同和 outcome。 |
| 系统协作角色 | 执行接缝协作方、安全材料消费方 | 各自保留 execution / observation / delivery truth。 |
| 系统维护角色 | 工具契约维护任务 | 派生 / 检查 / 对账不创造业务 truth。 |

### 7.3 权限差异结论

当前不建立正式权限矩阵。角色间的能力级差异已足以支持 Step 8 用户故事;effective authorization、操作枚举与接口动作必须在 owner seam、规则和接口闭口后再定义。

---

## 8. 回填草稿

### 5.1 角色说明

| 角色 | 类型 | 使用场景 |
|---|---|---|
| 工具契约维护者 | 人类管理 / 维护角色 | 在工具身份、定义、调用语义或结果语义需要建立、调整、退役或解释时维护正式契约语境。 |
| 安全 / 边界审查者 | 人类审查角色 | 审查工具固有风险声明、执行要求、外部引用边界和正文安全边界,但不在本仓形成 effective authorization truth。 |
| 审计 / 合规查看者 | 人类只读角色 | 查看工具契约变化、调用语义结果和 tool-domain audit 线索,判断行动是否可解释、可追溯且未越过 owner 边界。 |
| 运行问题调查者 | 人类诊断角色 | 在调用失败、结果歧义、依赖缺失或安全交接异常时,沿关联语境区分工具语义、隔离执行、传递和观察层问题。 |
| 工具调用消费方 | 系统消费角色 | 在自身执行主线中消费稳定工具定义,提交工具调用语境并接收 normalized result / error,但不改写工具契约 truth。 |
| 执行接缝协作方 | 系统协作角色 | 按工具声明的执行要求承接或反馈实际执行材料,但其自身 execution truth 不由工具契约替代。 |
| 安全材料消费方 | 系统只读角色 | 消费 body-free、redacted、可关联的结果 / 错误 / audit 摘要或引用,但不据此反写工具结果。 |
| 工具契约维护任务 | 系统维护角色 | 执行一致性检查、引用有效性检查、派生视图重建或历史对账,但不创造新的工具业务结论。 |

### 5.2 角色分类与权限边界

人类角色分为管理 / 维护、审查、只读查看和问题诊断四类;系统角色分为调用消费、执行协作、安全材料消费和契约维护四类。本章不形成正式权限矩阵:effective authorization owner 与 policy source 尚未闭口,具体操作也需由后续能力、规则和接口校准;当前角色身份不得被解释为自动授权。

---

## 9. 待确认事项

本步没有新增待确认事项。Effective authorization owner 与 policy source matrix 仍保持开放,因此当前不建立正式权限矩阵;该开放项不阻塞进入 Step 6,但阻塞后续具体授权操作与裁决合同定稿。

---

## 10. 进入下一步条件

### 10.1 自检

| 检查项 | 结果 |
|---|---|
| 是否识别主要人类和系统角色? | 是,各四类。 |
| 每个角色是否有接触场景? | 是。 |
| 是否存在管理、审查、审计和维护角色? | 是,且 owner 边界明确。 |
| 是否需要正式权限矩阵? | 当前不需要,并说明原因。 |
| 是否把具体仓际依赖写成角色? | 否,均用抽象系统身份。 |
| 是否把用户故事或接口动作写入角色表? | 否。 |
| 是否让角色身份等于 authorization? | 否。 |
| 是否继承 extras / image / marketplace 角色? | 否。 |

### 10.2 模块状态

| 模块 | 问题回答 | 诊断 | 取舍 | 结构化产物 | 回填草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|---|---|
| human_roles | done | done | done | done | done | pass | `pass` | 进入 system_roles。 |
| system_roles | done | done | done | done | done | pass | `pass` | 进入 permission_decision。 |
| permission_decision | done | done | done | done | done | pass | `pass` | 更新 flow / ledger 后创建 Step 6。 |

### 10.3 停审结论

```text
step_status = completed
gate_status = pass
formal_section_write_allowed = false
next_allowed_action = 读取需求 SOP Step 6、书写规范 §4.6 与全局依赖规则,创建 00_req_step_06_consumers_dependencies.md
commit_required = false
```
