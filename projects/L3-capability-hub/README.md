# L3-capability-hub

> L3 方法能力层的能力接入真相仓：负责外部 MCP、A2A 和 API 能力的 identity、registry 与 adapter descriptor。

## 当前状态

本目录是设计仓中的 active project documentation。正式设计基线按 `00-需求文档.md` 至 `07-实施计划.md` 顺序维护；对应的 calibration flow、project ledger、implementation ledger 和 boundary skeleton 是审计与实施移交材料。

当前只声明设计产物已重建，不声明实现仓、代码、测试运行、artifact、report、evidence、验收 verdict、signoff 或 implementation commit 已存在。

## 核心职责

| 主线 | 本仓负责的设计语义 |
|---|---|
| Capability identity | 为外部能力建立稳定、可追溯且不被 URL、provider、配置或派生视图替代的身份语义。 |
| Capability registry | 维护能力登记、生命周期、历史和可见性语义；不把登记状态变成 runtime allowlist、cache 或 marketplace listing。 |
| Adapter descriptor | 描述 MCP/A2A/API 接入边界、能力类型、约束摘要和安全引用；不保存外部正文、secret、route、quota、cost 或执行结果。 |
| Governance / policy seam | 只承接 `L1-governance` 的治理结果、批准或 policy 引用关系；不生成 approval、Policy effective truth 或 shared rules。 |
| Method-library relation | 只承接与 `L3-method-library` 的 body-free asset relation、引用或安全摘要；不保存 method body/source。 |
| SDK exposure boundary | 定义服务端能力暴露和消费引用边界；不实现 SDK client、语言 package、cache 或客户端发布状态。 |

## 明确不属于本仓

以下职责不由 Hub 拥有，也不能在实现中通过本地对象、配置、Port、事件或报告重新吸收：

- runtime execution、tools execution、外部 MCP/A2A/API/provider 调用和结果正文
- governance approval truth、Policy effective fact、shared rules 和审批执行
- method body/source、方法资产发布和执行生命周期
- marketplace listing、排名、定价、交易、履约和安装记录
- provider route、quota、cost、billing、failover、retry 与 secret/KMS/Vault truth
- SDK client、generated package、cache、release/delivery state
- observability backend、审计存储和成本记账真相

这些边界通过 typed reference、safe summary、controlled adapter、事件协作或只读 exposure seam 连接，不通过复制外部正文或建立第二真相源连接。

## 文档入口

| 文档 | 用途 |
|---|---|
| [`00-需求文档.md`](00-需求文档.md) | 需求目标、使用者、核心能力、业务规则、数据归属、接口边界和验收方向。 |
| [`01-架构设计.md`](01-架构设计.md) | 系统上下文、责任归属、依赖方向、数据分层和架构选择。 |
| [`02-概要设计.md`](02-概要设计.md) | 组件、模块、协议族、主要流程和跨模块协作。 |
| [`03-详细设计.md`](03-详细设计.md) | 可落码的对象、字段、状态、Port、事务、协议、流程和 Rustdoc 约束。 |
| [`04-配置设计.md`](04-配置设计.md) | 配置来源、profile/entry、绑定、激活、失败、变更和回退契约。 |
| [`05-测试方案.md`](05-测试方案.md) | 测试对象、case/data、状态对、门禁、报告、证据和责任边界。 |
| [`06-验收标准.md`](06-验收标准.md) | 验收基线、AC/VF/VETO、证据采信、缺陷、风险和签署契约。 |
| [`07-实施计划.md`](07-实施计划.md) | 11 个 phase、26 个 boundary、批次、实施门禁、回退和交付纪律。 |

## 校准与实施移交入口

- `design-calibration/00_requirements_calibration_flow.md` 至 `07_implementation_plan_calibration_flow.md`：各正式文档的 full-restart 讨论流程和 Step 中间产物索引。
- `design-calibration/project_execution_ledger.md`：设计恢复点、文档进度、历史材料、blocker 和 commit 要求。
- `design-calibration/implementation_execution_ledger.md`：实现移交总台账；当前为 pre-implementation blocked。
- `design-calibration/implementation-boundaries/commit-01-a.md` 至 `commit-11-b.md`：26 个 planned boundary skeleton；只有项目台账当前 boundary 可以被激活，未来 skeleton 不授权实现。
- `design-calibration/T070_readme_audit_and_disposition.md`：本 README 的历史冲突审计和处置记录。
- `design-calibration/T071_full_restart_final_audit.md`：formal `00~07`、全部 calibration 产物和实施移交材料的最终静态审计。

## 真实性与提交纪律

- 当前目标实现仓 `/home/aris/Projects/quantalithos-capability-hub` 尚未建立。
- 当前没有实现 commit、测试 run、artifact、report、evidence、验收 verdict、risk acceptance 或 signoff。
- 证据路径必须是显式 run-scoped 的 `reports/runs/<run_id>/evidence-index.md` 和 `.json`；不得使用 `latest` 或 `evidence-candidates.md` alias。
- 未来 Rust public declaration、struct field、enum variant/payload、trait、method 和 callable 必须有完整英文 `///`；enum struct-variant field 不写 field-level `pub`。
- 用户已于 2026-07-27 明确授权按 `00/01`、`02/03/04`、`05/06/07` 三组提交本轮设计仓文档；该授权仅适用于设计仓收口，不授权 implementation commit，也不冻结 immutable handoff baseline。
