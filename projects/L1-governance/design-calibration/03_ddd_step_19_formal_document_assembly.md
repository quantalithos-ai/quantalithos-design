# Step 19. 整理正式详细设计文档

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 19
> 书写规范: `standards/document/详细设计书写规范.md`
> 回填章节: `projects/L1-governance/03-详细设计.md`

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 19 整理正式详细设计文档 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1~18 详细设计校准文档 |
| 输出文件 | `projects/L1-governance/design-calibration/03_ddd_step_19_formal_document_assembly.md`;`projects/L1-governance/03-详细设计.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入后续文档 |

## 2. 本步目标

本 Step 将 Step 1~18 已确认的详细设计校准结论装配为正式 `03-详细设计.md`。正式文档按 `详细设计书写规范.md` 的 18 章主链组织,作为实现者阅读入口、跨 Step 索引和正式边界声明。

正式 `03` 不复制 Step 6~9 的全部字段级对象契约、trait 签名、DTO schema 和逐接口 flow。字段级真相仍保留在对应 `design-calibration/03_ddd_step_*.md` 中。正式 `03` 的职责是:

- 固定正式章节主链。
- 明确每章的校准来源和延伸阅读入口。
- 汇总实现仓布局、模块主轴、协议数量、事务顺序、状态矩阵、持久化、错误、幂等、配置、观测、测试和实施承接。
- 明确当正式 `03` 摘要不足以落码时,必须读取对应 Step 文件;读取后仍不闭合时暂停回设计修正,不得交给实现者自行补 schema。

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `03_ddd_step_01_upstream_boundary.md` | 已完成 | 上游关系、旧草稿诊断和正式输入边界 |
| `03_ddd_step_02_scope.md` | 已完成 | 目标、范围、非范围和实现者可完成范围 |
| `03_ddd_step_03_constraints.md` | 已完成 | Rust、源码语言、依赖、提交和仓库约束 |
| `03_ddd_step_04_file_layout.md` | 已完成 | workspace、crate、package、binary 和文件布局 |
| `03_ddd_step_05_module_contracts.md` | 已完成 | 七模块主轴、职责和依赖方向 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 对象、字段、状态、policy、view、report、entry object |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | repository、port、adapter、UoW、Clock、IdGenerator、result store |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | Command、Query、Inbound / Outbound Event、Job 协议 |
| `03_ddd_step_09_function_flows.md` | 已完成 | 逐接口函数级处理流和副作用顺序 |
| `03_ddd_step_10_state_matrix.md` | 已完成 | 状态机、合法迁移、非法迁移和状态测试入口 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已完成 | 持久化、transaction、optimistic version、outbox snapshot |
| `03_ddd_step_12_error_recovery.md` | 已完成 | 错误模型、异常分支、retry、dead-letter、quarantine |
| `03_ddd_step_13_concurrency_idempotency.md` | 已完成 | 并发、幂等、重复回放、commit unknown |
| `03_ddd_step_14_config_external_binding.md` | 已完成 | 配置引用、外部依赖绑定和 runtime builder |
| `03_ddd_step_15_observability_audit.md` | 已完成 | 日志、指标、审计、trace、redaction |
| `03_ddd_step_16_test_cuts.md` | 已完成 | 最小测试切口、脚本契约和前序闭环审计 |
| `03_ddd_step_17_implementation_handoff.md` | 已完成 | 实施承接清单、前置阅读、跨文档预复核 |
| `03_ddd_step_18_risks_open_questions.md` | 已完成 | 风险、待确认事项和未确认前处理规则 |

## 4. 装配策略

| 正式章节 | 校准来源 | 装配策略 |
|---|---|---|
| 1. 与上游文档的关系声明 | Step 1 | 声明新版 `00/01/02` 为输入,旧 `03` 只作诊断 |
| 2. 本次详细设计目标与范围 | Step 2 | 汇总 P0 范围、非范围和实现者可完成代码范围 |
| 3. 实现约束与编码规范承接 | Step 3 | 汇总 Rust、源码英文、依赖和提交约束 |
| 4. 实现单元与文件布局 | Step 4 | 摘录 workspace / crate / file layout |
| 5. 模块实现契约 | Step 5~7 | 以七模块为主轴,合并对象 / port / adapter 边界 |
| 6. 全局对象 / Trait / API 索引 | Step 6~8 | 写索引和数量,不替代字段级 Step |
| 7. API / Command / Query / Event / Job 协议契约 | Step 8 | 使用 23 Command、14 Query、9 Consumer、12 Outbound Event、7 Job |
| 8. 逐接口函数级处理流 | Step 9 | 摘录共享模板和 flow inventory,指向逐接口详表 |
| 9. 状态机与转换矩阵 | Step 10 | 汇总状态族和禁止迁移规则 |
| 10. 数据持久化、事务与一致性契约 | Step 11 | 汇总 store、repository、UoW、version、outbox snapshot |
| 11. 错误模型、异常分支与恢复口径 | Step 12 | 汇总错误层级和恢复表 |
| 12. 并发、幂等与重入保护 | Step 13 | 汇总 key、digest、duplicate replay、commit unknown |
| 13. 配置引用与外部依赖绑定 | Step 14 | 汇总配置 section、adapter binding 和禁止配置化边界 |
| 14. 可观测性与审计埋点契约 | Step 15 | 汇总安全日志、指标、审计、trace、redaction |
| 15. 测试切口与最小验证清单 | Step 16 | 汇总模块、接口、状态、一致性、错误、脚本切口 |
| 16. 详细设计到实施计划的承接清单 | Step 17 | 汇总实施前置阅读和交付实现前审计输入 |
| 17. 风险与待确认事项 | Step 18 | 汇总未关闭风险和未确认前处理规则 |
| 18. 参考 | Step 1~19 + standards | 固定正式引用索引 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 正式文档是否按书写规范章节主链组织? | 是。正式 `03` 使用 18 章主链,每章均列出校准来源和延伸阅读。 |
| 第 5 章是否以模块为主轴? | 是。第 5 章以 `contracts/domain/application/infra/api/worker/jobs` 七模块组织职责、文件、对象、port 和测试切口。 |
| 对象、trait、协议、处理流、状态机是否互相可回指? | 是。正式 `03` 第 6~10 章分别提供对象索引、port 索引、协议索引、flow 索引和状态族索引,字段级细节回指 Step 6~11。 |
| 字段闭环、DTO 构造闭环、状态闭环和 phase boundary 是否通过复核? | 已按 Step 17 预复核通过。正式实现前仍要求 `07` 按每个 phase / commit boundary 重复核。 |
| 其他 agent 是否可以按本文 1:1 实现代码? | 可以以正式 `03` 作为入口,并按每章来源读取对应 Step 文件。若字段级 Step 仍不闭合,必须暂停回设计,不得自行补。 |
| 是否有内容误放到测试方案、实施计划、配置设计或运维手册? | 正式 `03` 只保留代码实现契约和最小测试切口;完整配置、测试、验收、phase、commit、部署和运维留给后续正式文档。 |
| 本文是否明确提供给 `07` 交付实现前整体审计所需输入? | 是。第 16 章要求 `07` 按 phase / commit boundary 对字段、DTO、状态、port、outbox、projection、job、phase boundary 重做可落码审计。 |

## 6. 正式装配修正

| 项 | 修正口径 |
|---|---|
| 旧 `03` 主线 | 不继承旧对象主线和采集式结构;正式 `03` 只承接新版 Step 1~18 |
| Command 数量漂移 | 正式 `03` 统一为 23 个 Command,以 Step 8 §6.1 inventory 和 Step 16 为准 |
| 字段级契约落点 | 正式 `03` 不重复 Step 6~9 全量字段;实现者必须读取校准来源 |
| 目标实现仓 | 继续记录 `/home/aris/Projects/quantalithos-governance` 在 Step 3 / Step 4 检查时未发现,作为实现开工前置门禁 |
| 下游文档 | `04/05/06/07` 需按新版 `03` 生成或复核;不得继续沿用旧口径 |

## 7. 自检清单

| 检查项 | 结果 |
|---|---|
| 承接概要设计 | [x] |
| 按模块展开 | [x] |
| 文件路径明确 | [x] |
| 对象字段有类型和注释 | [x] 字段级契约位于 Step 6 |
| 函数签名有参数类型和返回类型 | [x] port 位于 Step 7,flow 入口位于 Step 9 |
| 每个关键协议有处理流 | [x] Step 8 / Step 9 覆盖 |
| 状态机和事务边界明确 | [x] Step 10 / Step 11 覆盖 |
| 字段闭环和 DTO 构造闭环通过 | [x] Step 17 预复核通过 |
| 状态、测试、验收和实施 phase 使用同一套正式名称 | [x] 正式 `03` 使用 Step 10 / Step 16 名称,后续 `05/06/07` 必须继续复核 |
| phase boundary 没有引用后续 phase 才定义的对象或证据 | [x] 本文不定义 phase;后续 `07` 必须逐 boundary 复核 |
| 已为 `07` 按 phase / commit boundary 执行交付实现前闭环审计提供足够输入 | [x] |
| 测试切口明确 | [x] Step 16 覆盖 |

## 8. 进入后续文档条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 正式 `03` 已按 18 章主链装配 | 通过 | 见 `projects/L1-governance/03-详细设计.md` |
| 每章校准来源明确 | 通过 | 每章开头均列出具体 Step 文件 |
| 旧 `03` 旧主线已移除 | 通过 | 正式 `03` 已重建 |
| Command 数量漂移已修正 | 通过 | 正式 `03` 使用 23 Command |
| 可进入后续 `04/05/06/07` | 有条件通过 | 需用户审查 Step 19 后再继续 |
