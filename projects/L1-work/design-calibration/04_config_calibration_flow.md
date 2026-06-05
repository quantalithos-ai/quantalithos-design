# L1-work 04-配置设计校准流程

> 本文件是 `projects/L1-work/04-配置设计.md` 的 SOP 校准工作台。
> 它记录每个 Step 的中间产物位置、状态、详细设计影响判定和回填章节。
> 本目录中的内容是中间产物,不替代正式 `04-配置设计.md`。
>
> 本轮状态说明:
> - 当前 `projects/L1-work/04-配置设计.md` 已在 Step 15 创建。
> - 本轮配置设计以新版 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md` 为主输入。
> - 正式 `05-测试方案.md` 与 `06-验收标准.md` 已按新版生成;早期 Step 中关于旧版草案的表述仅为历史诊断,不得作为当前实现阻塞。
> - 每个 Step 必须形成中间产物并记录“对 03-详细设计的影响判定”;正式 `04-配置设计.md` 只能在 Step 15 统一整理。

---

## 一、执行依据

| 类型 | 文档 |
|---|---|
| 配置设计书写规范 | `standards/document/配置设计书写规范.md` |
| 配置设计讨论 SOP | `standards/document/配置设计讨论流程_SOP.md` |
| 中间产物规范 | `standards/document/设计文档讨论中间产物规范.md` |
| 当前需求文档 | `projects/L1-work/00-需求文档.md` |
| 当前架构设计 | `projects/L1-work/01-架构设计.md` |
| 当前概要设计 | `projects/L1-work/02-概要设计.md` |
| 当前详细设计 | `projects/L1-work/03-详细设计.md` |
| 稳定上游 / 相邻输入 | `projects/L0-core/00~07`、`projects/L0-bus/00~07`、`projects/L0-sdk/00~07`、`projects/L3-method-library/00~07` |

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

本轮不是复制 `03-详细设计.md` §13 的配置绑定点,而是把 `L1-work` 的运行配置控制面整理成可以被开发、测试、验收、实施和运维共同引用的正式设计。

目标输出:

```text
1. 04 只承接需求、架构、概要和详细设计结论,不重新定义它们。
2. 04 按配置设计书写规范的 15 章主链组织。
3. 04 明确 WorkRuntimeConfig、runtime builder、store、boundary、idempotency、projection、jobs、external、outbox、handoff 和 features 的配置控制面。
4. 04 明确哪些行为允许配置化,哪些禁止通过配置绕过 Work truth ownership、external body exclusion、formalize / promote、metadata / idempotency、audit / outbox、query no-write、projection no-write 和 dependency discipline。
5. 04 明确配置来源、优先级、冲突处理、环境矩阵、配置项、密钥边界、加载校验、生效和失败策略。
6. 04 为 05-测试方案、06-验收标准、07-实施计划和后续部署运维手册提供配置矩阵与门禁输入。
7. 04 不写部署命令、不写完整运维手册、不重新定义 Rust struct / enum / trait / function。
8. 如果 04 发现必须改变 WorkRuntimeConfig、runtime builder、adapter constructor、trait、error 或函数流,必须先回写 03-详细设计.md。
```

---

## 四、详细设计影响判定总览

本表在 Step 14 前持续汇总。每个 Step 的中间产物都必须包含同名判定表。

| Step | 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|---|
| Step 1 | 确认 `04-配置设计.md` 以新版 `00/01/02/03` 为主输入,`05/06` 仅作下游承接参考;确认 L1-work 需要独立配置设计 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 2 | 确认 P0 配置聚焦默认可验证路径,production DB / MQ / endpoint / KMS 字段全集后移 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 3 | 建立配置来源链、装配入口和控制面总览,不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 4 | 定义配置分类、热 / 冷更新口径和禁止配置化边界,不新增配置字段 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 5 | 定义普通来源优先级和冲突处理,entry args 只作局部输入,secret material 不进入普通覆盖链 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 6 | 定义 local-dev / ci-test / integration-like / operations-replay P0 profile,staging-like / production-like 只作 P1/P2 承接方向 | 否 | 无代码契约变化 | 无 | 无回写 |
| Step 7 | 展开 `WorkRuntimeConfig` 既有 9 个 section / 28 个 P0 配置项,给出默认值、来源、生效、失败策略和 JSON demo | 否 | 配置默认值和文档示例,无代码契约变化 | 无 | 无回写 |
| Step 8 | 明确 `ref-only sensitive` 为 sensitive 子类,raw secret / raw token / raw payload 不得进入 JSON、env、args、日志、报告或 artifact | 否 | 配置安全语义,无代码契约变化 | 无 | 无回写 |
| Step 9 | 明确 defaults -> JSON file -> env -> typed validation -> cross-field validation -> runtime builder 的加载链,P0 不支持核心 reload / hot update | 否 | 配置加载和生效规则,无代码契约变化 | 无 | 无回写 |
| Step 10 | 明确 P0 配置变更只通过 defaults / JSON / env / entry local args 表达,冷重启或新 job run 生效,审计记录 source / digest / key / redacted ref / outcome | 否 | 配置变更、审计和回滚规则,无代码契约变化 | 无 | 无回写 |
| Step 11 | 明确配置缺失、错配、敏感 ref 不可读、unsupported source、漂移和支撑面失败的 fail-fast / fail-closed / marker 策略 | 否 | 配置失效策略,无代码契约变化 | 无 | 无回写 |
| Step 12 | 明确 05 / 06 / 07 / 09 对配置场景、验收门禁、实施准备和运维细节的承接边界,下游不得重复定义配置契约 | 否 | 文档承接规则,无代码契约变化 | 无 | 无回写 |
| Step 13 | 明确当前无已发布旧配置迁移项,未来新增 / 废弃 / 移除配置必须经 04 记录并按需回写 03 | 否 | 配置演进规则,无代码契约变化 | 无 | 无回写 |
| Step 14 | 汇总 P1/P2 演进、下游承接和实施阶段风险,确认 Step 1~13 无 `待回写` 或 `阻塞待确认` 的 03 影响项 | 否 | 风险收口,无代码契约变化 | 无 | 无回写 |
| Step 15 | 将 Step 1~14 已确认结论整理为正式 `04-配置设计.md`,使用配置设计 15 章主链并逐章标注校准来源 | 否 | 文档装配,无代码契约变化 | 无 | 无回写 |

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
- 允许参考已收稳的其他子项目配置设计方法、结构、图表风格和中间产物组织方式,但不能机械搬运其他子项目的配置项、环境矩阵或密钥策略。
