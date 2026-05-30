# L0-bus 04-配置设计校准流程

> 本文件是 `projects/L0-bus/04-配置设计.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态、详细设计影响判定和回填章节。
> 本目录中的内容是中间产物,不替代正式 `04-配置设计.md`。
>
> 本轮状态说明:
> - 当前 `projects/L0-bus/04-配置设计.md` 尚未创建。
> - `projects/L0-bus/00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 已按当前主链完成校准。
> - `projects/L0-bus/05-测试方案.md` 与 `06-验收标准.md` 当前只作为下游承接方向参考;如与新版 `00~03` 不一致,以后续校准为准。
> - 每个 Step 必须先形成中间产物并记录“对 03-详细设计的影响判定”;正式 `04-配置设计.md` 在 Step 15 统一整理。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 配置设计书写规范 | `standards/document/配置设计书写规范.md` |
| 配置设计讨论 SOP | `standards/document/配置设计讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 当前需求文档 | `projects/L0-bus/00-需求文档.md` |
| 当前架构设计 | `projects/L0-bus/01-架构设计.md` |
| 当前概要设计 | `projects/L0-bus/02-概要设计.md` |
| 当前详细设计 | `projects/L0-bus/03-详细设计.md` |
| 下游测试方案 | `projects/L0-bus/05-测试方案.md` |
| 下游验收标准 | `projects/L0-bus/06-验收标准.md` |

---

## 二、状态总览

```text
[ ] 未开始
[~] 讨论中
[x] 已确认
```

| Step | 状态 | 主题 | 中间产物 | 回填章节 |
|---|---|---|---|---|
| Step 1 | [x] | 确认配置输入边界 | `04_config_step_01_upstream_boundary.md` | §1 与上游文档的关系声明 |
| Step 2 | [x] | 明确配置设计目标、范围和非范围 | `04_config_step_02_scope.md` | §2 本次配置设计目标与范围 |
| Step 3 | [x] | 建立配置控制面总览 | `04_config_step_03_control_plane_overview.md` | §3 配置控制面总览 |
| Step 4 | [x] | 定义配置分类与禁止配置化边界 | `04_config_step_04_classification_boundaries.md` | §4 配置分类与边界 |
| Step 5 | [x] | 定义配置来源、优先级与冲突处理 | `04_config_step_05_sources_priority_conflicts.md` | §5 配置来源、优先级与冲突处理 |
| Step 6 | [x] | 定义环境、部署 profile 与配置矩阵 | `04_config_step_06_profiles_matrix.md` | §6 环境、部署 profile 与配置矩阵 |
| Step 7 | [x] | 定义配置项清单 | `04_config_step_07_config_items.md` | §7 配置项清单 |
| Step 8 | [x] | 定义敏感配置与密钥管理 | `04_config_step_08_sensitive_secrets.md` | §8 敏感配置与密钥管理 |
| Step 9 | [x] | 定义配置加载、校验与生效机制 | `04_config_step_09_load_validate_apply.md` | §9 配置加载、校验与生效机制 |
| Step 10 | [x] | 定义配置变更、审计与回滚 | `04_config_step_10_change_audit_rollback.md` | §10 配置变更、审计与回滚 |
| Step 11 | [x] | 定义失效模式与降级 / fail-fast 策略 | `04_config_step_11_failure_modes.md` | §11 失效模式与降级 / fail-fast 策略 |
| Step 12 | [x] | 定义测试、验收、实施与运维承接 | `04_config_step_12_downstream_handoff.md` | §12 测试、验收、实施与运维承接 |
| Step 13 | [x] | 定义配置迁移、废弃与演进 | `04_config_step_13_migration_deprecation_evolution.md` | §13 配置迁移、废弃与演进 |
| Step 14 | [x] | 定义风险与待确认事项 | `04_config_step_14_risks_open_questions.md` | §14 风险与待确认事项 |
| Step 15 | [x] | 整理正式配置设计文档 | `04_config_step_15_formal_document_assembly.md` | 全文 |

---

## 三、本轮校准总目标

本轮不是复制 `03-详细设计.md` §13 的配置绑定点,而是把 L0-bus 的运行配置控制面整理成可以被开发、测试、验收、实施和运维共同引用的正式设计。

目标输出:

```text
1. 04 只承接需求、架构、概要和详细设计结论,不重新定义它们。
2. 04 按配置设计书写规范的 15 章主链组织。
3. 04 明确 bus API、worker、jobs、store、transport backend、publisher、projection、policy 和 security boundary 的配置控制面。
4. 04 明确哪些行为允许配置化,哪些禁止通过配置绕开传递语义、安全红线、审计链、状态机和只读输出边界。
5. 04 明确配置来源、优先级、冲突处理、环境矩阵、配置项、密钥边界、加载校验、生效和失败策略。
6. 04 为 05-测试方案、06-验收标准、07-实施计划和后续部署运维手册提供配置矩阵与门禁输入。
7. 04 不写部署命令、不写完整运维手册、不重新定义 Rust struct / enum / trait / function。
8. 如果 04 发现必须改变 RuntimeConfig、ConfigLoader、ConfigValidator、RuntimeBuilder、adapter constructor、trait、error 或函数流,必须先回写 03-详细设计.md。
```

---

## 四、详细设计影响判定总览

本表在 Step 14 前持续汇总。每个 Step 的中间产物都必须包含同名判定表。

| Step | 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|---|
| Step 1 | 仅确认配置设计输入边界,以新版 `00/01/02/03` 为主输入,当前 `05/06` 只作下游承接参考 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 2 | 仅定义配置设计目标、范围、非范围和 P0 / P1 / P2 口径;P0 聚焦默认可验证路径和稳定配置接缝 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 3 | 建立配置来源链、runtime 装配路径、控制面总表和模块读取边界;不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 4 | 定义配置分类、P0 冷更新口径和禁止配置化边界;不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 5 | 定义普通来源优先级、CLI 局部输入边界、secret ref 覆盖规则和冲突 fail-fast 规则;不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 6 | 定义 local-dev、ci-test、integration-test、operations-recovery、staging-like、production-like 配置矩阵;profile 只是分类,不新增字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 7 | 定义配置项总表、模块级 JSON demo、完整 JSONC 文档示例和本地配置 key 口径;不新增 `RuntimeConfig` root 子配置组 | 否 | 外部 JSON 契约细化,无代码契约变化 | 无 | 无回写 |
| Step 8 | 定义敏感配置只保存 `SecretRef` / `ConnectionRef`,P0 冷更新轮换,日志/错误/审计/reports 必须脱敏 | 否 | 敏感配置与输出规则细化,无代码契约变化 | 无 | 无回写 |
| Step 9 | 定义配置 source、parse、merge、type/range/cross-field/forbidden 校验、runtime build 与 P0 reload 拒绝规则 | 否 | 加载校验和生效机制细化,无代码契约变化 | 无 | 无回写 |
| Step 10 | 定义配置变更发起方、评审要求、脱敏审计和 P0 配置回滚 + 重启口径 | 否 | 配置治理规则细化,无代码契约变化 | 无 | 无回写 |
| Step 11 | 定义配置缺失、错配、敏感引用不可用、config center unsupported、漂移、reload 请求等失效模式及 fail-fast / fail-closed / degraded / LKG 口径 | 否 | 失效模式和失败策略细化,无代码契约变化 | 无 | 无回写 |
| Step 12 | 定义 `05/06/07/09` 与 reports / artifacts 对配置契约的承接关系,下游不得重复定义配置契约 | 否 | 下游承接规则,无代码契约变化 | 无 | 无回写 |
| Step 13 | 明确当前无已发布配置迁移项,定义未来新增、重命名、废弃、移除和兼容窗口规则 | 否 | 配置演进规则,无代码契约变化 | 无 | 无回写 |
| Step 14 | 汇总风险、非阻塞待确认事项、当前详细设计回写清单和条件性未来影响项;不存在 `待回写` 或 `阻塞待确认` | 否 | 汇总判定,无代码契约变化 | 无 | 无回写 |
| Step 15 | 组装正式 `04-配置设计.md`,按 15 章主链回填 Step 1~14 已确认结论 | 否 | 正式文档整理,无代码契约变化 | 无 | 无回写 |

---

## 五、执行纪律

- 每个 Step 必须先形成中间产物,不得直接创建或修改正式 `04-配置设计.md`。
- 每个 Step 必须逐项回答 SOP 的“应问的问题”。
- 每个 Step 必须包含当前文档问题诊断和改动前后对比。
- 每个 Step 必须包含配置设计取舍。
- 每个 Step 必须包含“对 03-详细设计的影响判定”。
- 每个 Step 必须包含至少一个结构化产物: 表格、ASCII 图、矩阵、清单或回填草稿。
- 每个 Step 如涉及图示,必须遵守配置设计 ASCII 图统一格式。
- Step 状态从 `[~]` 改为 `[x]` 后,才能进入下一 Step。
- 未确认事项不得写成正式配置设计契约。
- 如果存在 `待回写` 或 `阻塞待确认` 的详细设计影响项,不得进入 Step 15 定稿。
- 允许参考已收稳的 `L0-core`、`L1-identity`、`L3-method-library` 和 `L0-bus` 前序中间产物,但不能机械搬运其他子项目的配置项、环境矩阵或密钥策略。
