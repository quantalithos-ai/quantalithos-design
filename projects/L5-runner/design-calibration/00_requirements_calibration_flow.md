# L5-runner · 00 需求文档校准流程

> 模式：`full-restart / single-agent / serial Step 1→17`
> 正式文档：`projects/L5-runner/00-需求文档.md`
> 当前状态：`Step 17 completed / formal_stop_review`
> 当前授权：完成全部 00 后停审，不进入 01。

## 1. 总流程计划

| Step | 主题 | 输入 | 输出文件 | 状态 | 完成门禁 |
|---|---|---|---|---|---|
| 1 | 与上游文档关系 | 产品/架构/依赖规则/专项上游 | `00_req_step_01_upstream_relationship.md` | completed | 来源、承接主题、收束说明闭合；允许进入 Step 2 |
| 2 | 本仓定位与边界 | Step 1 + draft 01 | `00_req_step_02_scope_boundary.md` | completed | 定位、非职责、易混淆边界闭合；允许进入 Step 3 |
| 3 | 背景与问题 | Step 2 + 产品/历史差异 | `00_req_step_03_problem_context.md` | completed | 问题不含方案/伪量化；允许进入 Step 4 |
| 4 | 目标与非目标 | Step 2~3 | `00_req_step_04_goals_non_goals.md` | completed | 目标可验证、非目标具体；允许进入 Step 5 |
| 5 | 用户与角色 | Step 2/4 | `00_req_step_05_users_roles.md` | completed | 人类/系统角色与权限边界闭合；允许进入 Step 6 |
| 6 | 使用方与依赖 | Step 2/5 + 全局依赖规则 | `00_req_step_06_consumers_dependencies.md` | completed | 四项依赖裁剪输出齐全；允许进入 Step 7 |
| 7 | 核心能力闭环 | Step 2/4/6 + draft 02 | `00_req_step_07_core_capability_loop.md` | completed | 节点顺序、进退条件、停审清单闭合；允许进入 Step 8 |
| 8 | 用户故事 | Step 5/7 | `00_req_step_08_user_stories.md` | completed | 按节点故事、跨能力审计闭合；允许进入 Step 9 |
| 9 | 功能需求 | Step 7/8 | `00_req_step_09_functional_requirements.md` | completed | 按节点功能、输入/输出/失败闭合；允许进入 Step 10 |
| 10 | 规则与边界 | Step 2/7/9 | `00_req_step_10_business_rules.md` | completed | 规则有能力/功能来源，无实现泄漏；允许进入 Step 11 |
| 11 | 数据归属 | Step 2/9/10 | `00_req_step_11_data_ownership.md` | completed | truth/snapshot/ref/forbidden 四类闭合；允许进入 Step 12 |
| 12 | 接口与依赖 | Step 6/9/11 | `00_req_step_12_interfaces_dependencies.md` | completed | 能力级接口，无协议/DTO/port 泄漏；允许进入 Step 13 |
| 13 | 非功能需求 | Step 7/10/11/12 | `00_req_step_13_nonfunctional.md` | completed | 六类质量约束有判断口径和来源 |
| 14 | 验收标准 | Step 7/9/10/11/13 | `00_req_step_14_acceptance.md` | completed | 每个 P0/硬规则/数据/NFR 有承接 |
| 15 | 风险与待确认 | Step 1~14 未闭合项 | `00_req_step_15_risks_open_questions.md` | completed | 风险与待确认分表，状态不脑补 |
| 16 | 追溯矩阵 | Step 7~15 | `00_req_step_16_traceability.md` | completed | 无孤儿/重复/串仓项 |
| 17 | 正式文档装配 | Step 1~16 | `00_req_step_17_formal_assembly.md` + 正式 00 | completed / formal_stop_review | 重建、来源、静态审计、停审 |

## 2. Step 内通用计划

每个 Step 文件均须显式完成：

```text
[ ] 读取本步输入和前序 Step
[ ] 逐项回答 SOP 问题
[ ] 诊断旧材料污染和边界冲突
[ ] 记录方案取舍及未采用方案
[ ] 形成结构化中间产物
[ ] 形成正式章节回填草稿
[ ] 做模块/跨能力自检
[ ] 标记正式回填门禁
```

Step 8~14 必须按 `CP-RUN-01→05` 能力节点逐一收敛并记录能力级停审；自动连续执行不等于合并 Step 或跳过停审。

## 3. 写入与真实性门禁

- Step 1~16 未全部完成前，`formal_00_write_allowed=false`。
- 正式装配必须删除旧 `00-需求文档.md` 后新建，禁止在旧结构上修补。
- 上游未闭合能力只能标为 `pending/blocked`，fixture/fake/ACK/cache 不得关闭 blocker。
- 不生成实现、测试、run、report、evidence、verdict、signoff、readiness 或 commit 事实。
- 完成 Step 17 后必须转为 `formal_stop_review` 并停止，不读取或推进 01 SOP。

## 4. 当前恢复点

```text
 current_step = 17
 current_module = formal_assembly
 gate_status = formal_stop_review
 next_allowed_action = wait_for_user_review_and_explicit_01_authorization
 formal_00_write_allowed = completed
 formal_01_write_allowed = false
```
