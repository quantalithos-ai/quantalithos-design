# L2-runtime 00 需求 Step 5: 用户与角色

> 创建日期: 2026-08-07
> 状态: done
> 当前模式: full-restart
> 回填位置: `00-需求文档.md` 第 5 章

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 输入 | Step 2 边界、Step 4 目标 / 非目标 |
| 目标 | 识别接触 Runtime 的人类 / 系统角色 |
| 禁止 | 把仓际依赖、接口动作、用户故事或默认权限写成角色 |

## 1. Step 内计划

| 模块 | 状态 | 产物 | gate_status |
|---|---|---|---|
| 人类角色 | done | 维护 / 审查 / 调查角色 | pass |
| 系统角色 | done | 触发 / 输入 / 协作 / 消费角色 | pass |
| 权限差异 | done | 能力级边界 | pass |
| 历史角色审计 | done | 错误角色排除 | pass |
| 回填与自检 | done | 第 5 章候选 | pass |

## 2. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 主要角色? | Runtime 运维 / 维护者、运行问题调查者、安全 / 边界审查者、运行触发方、正式上下文提供方、模型适配协作方、工具行动协作方、运行材料消费方。 |
| 人类 / 系统如何区分? | 前三类为人类角色,后五类为系统角色;具体仓只在依赖章节映射。 |
| 使用场景? | 配置与维护运行边界、调查运行卡点、审查越权 / 正文泄漏、触发 run、提供 safe refs、承接 model/tool action、消费 safe outcome / status。 |
| 是否有权限差异? | 有能力级差异,但具体 authorization 不由 Runtime 角色表决定,必须消费 Governance。 |

## 3. 角色说明表

| 角色 | 类型 | 使用场景 |
|---|---|---|
| Runtime 运维 / 维护者 | 人类维护角色 | 维护 Runtime 的运行输入边界、诊断能力和安全停机 / 恢复入口,不修改业务 truth。 |
| 运行问题调查者 | 人类诊断角色 | 沿 run、turn、decision、action、checkpoint 和 handoff 关联定位等待、失败或未知副作用。 |
| 安全 / 边界审查者 | 人类审查角色 | 审查外部正文、secret、隐藏推理、越权 action、fail-open、重复副作用和 owner 串线。 |
| 运行触发方 | 系统角色 | 以正式主体、目标与约束触发、暂停、取消或查询一次 Runtime run,但不直接改写内部工作态。 |
| 正式上下文提供方 | 系统角色 | 以 typed ref、safe snapshot、effective decision 或 definition summary 提供可验证输入,仍拥有源 truth。 |
| 模型适配协作方 | 系统角色 | 承接 provider-neutral model turn 并返回关联结果 / 明确失败,不决定 Runtime 目标和计划。 |
| 工具行动协作方 | 系统角色 | 消费 Runtime action choice,按 Tools 正式合同承接 invocation 并返回 normalized outcome。 |
| 运行材料消费方 | 系统角色 | 消费 Runtime 已提交状态 / outcome 的 body-free safe material 或 event,不反写 Runtime truth。 |

## 4. 能力级权限差异

| 能力级动作 | 维护者 | 调查者 | 审查者 | 运行触发方 | 外部协作 / 消费方 |
|---|---|---|---|---|---|
| 建立 / 推进 Runtime run | 不直接 | 只读 | 只读 | 受正式授权触发 | 不允许 |
| 暂停 / 取消 / 恢复请求 | 受控维护入口 | 只读 | 只读 | 受正式授权请求 | 不允许 |
| 查看安全运行摘要 | 受控 | 受控 | 受控 | 受 scope 约束 | 只读最小材料 |
| 修改 Governance / Method / Tool / external truth | 不允许 | 不允许 | 不允许 | 不允许 | 各自 owner 内处理 |
| 声明 delivered / observed / accepted | 不允许 | 不允许 | 不允许 | 不允许 | 仅对应 owner 可声明 |

具体 principal、scope 与 allow / deny 必须来自 Governance / Identity 等正式 owner;上表只描述需求级职责差异,不授予权限。

## 5. 当前文档诊断与取舍

| 旧角色 / 表达 | 诊断 | 当前处置 |
|---|---|---|
| “AI 成员(runtime 自身)” | 把系统主体、仓和用户混成角色 | 拆为运行触发方与 Runtime 内部 truth,不把仓当人。 |
| member / tools 开发者 / SRE 直接对应 API 权限 | 角色与仓依赖、权限机制混写 | 使用能力级人类 / 系统角色,具体仓留 Step 6。 |
| Tech Lead 查看 reasoning trace | 预设隐藏推理正文与授权 | 只允许受控安全运行摘要和正式审计材料。 |
| Runtime 自行起 sub-agent / 调工具即“权限” | 自我授权风险 | 行动仍受正式目标、Governance 和合同约束。 |

取舍:不建立细粒度 CRUD 权限矩阵,因为协议和 Governance source 尚未进入需求层;保留能力级差异足以约束后续接口与验收。

## 6. 回填草稿

Runtime 的人类角色是维护、调查和边界审查者;系统角色是运行触发方、正式上下文提供方、模型 / 工具协作方和运行材料消费方。角色只说明接触场景,不形成 authorization truth;任何推进、恢复、读取或行动都必须在后续能力和接口边界中承接正式 principal / scope / decision。

## 7. 自检与门禁

| 检查 | 结果 |
|---|---|
| 人类 / 系统角色已分开 | pass |
| 仓依赖未写成角色 | pass |
| 权限未由角色表自我授予 | pass |
| 隐藏推理正文未作为默认查看面 | pass |

```text
gate_status = pass
next_allowed_action = create_step_06_consumers_dependencies
formal_document_write_allowed = false
```
