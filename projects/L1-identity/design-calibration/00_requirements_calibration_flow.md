# L1-identity 需求文档校准工作台

> 对应文档: `projects/L1-identity/00-需求文档.md`
> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 创建日期: 2026-06-10
> 当前目标: 按新版需求 SOP 从 `design-calibration/00` 重建 `L1-identity` 需求真相源,再由新版 `00` 牵引后续 `01`~`07`。

---

## 1. 本轮校准原则

- 本轮从需求层重建,不从旧 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md` 或 `03-详细设计.md` 直接继承正文。
- 旧文档只作为历史事实、术语线索和问题诊断输入;旧文档中的技术栈、目录结构、RPC 名称、结构体字段、数据库表、事件名和性能数字不得直接进入新版需求基线。
- `product/最终目的.md`、`product/六域模型.md`、`architecture/仓库拆分方案.md` 和 `standards/document/全局项目依赖关系与裁剪规则.md` 是本轮需求校准的稳定上游。
- `domain/identity/README.md`、ADR-0003、ADR-0004 和 ADR-0006 是重要历史输入,但其中的详细设计和实现倾向必须在需求层重新裁剪。
- `L1-identity` 是平台级 AI 员工身份真相仓,不是认证系统、授权裁决系统、ProjectMember 管理仓、runtime 容器编排仓、method-library 定义正文仓或 memory/archive 正文仓。
- 从 Step 7 起按核心能力节点逐个收敛故事、功能、规则、数据、接口和验收,不得一次性铺开全仓细节后再事后归类。
- 每个 Step 文件必须保留 Step 内计划、SOP 问题回答、诊断、取舍、结构化中间产物、复杂度判断、回填草稿、待确认事项和进入下一步条件。
- 正式 `00-需求文档.md` 在 Step 17 只从 Step 1~16 的中间产物装配,每章必须保留具体校准来源。

---

## 2. 稳定上游与历史输入

| 对象 | 当前状态 | 本轮使用方式 |
|---|---|---|
| `product/最终目的.md` | 产品叙事权威 | 承接“AI 员工是有身份的个体”的产品承诺 |
| `product/六域模型.md` | 六域领域模型权威 | 承接 Identity 域回答“员工是谁”的领域定位 |
| `architecture/仓库拆分方案.md` | 27 仓分层与 L1 定位权威 | 承接 `quantalithos-identity` 的仓级职责和相邻仓边界 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖裁剪基线 | Step 6 / Step 12 裁剪 identity 相关依赖 |
| `domain/identity/README.md` | 历史领域详细设计 | 只作为术语、边界、不变量和旧问题诊断输入 |
| ADR-0003 | 历史技术栈线索 | 不在需求层确认,后移架构和实施计划重新评估 |
| ADR-0004 | GlobalMember / ProjectMember 分层历史决策 | 作为边界线索输入,需求层重新表述 |
| ADR-0006 | memory 持久化历史决策 | 作为 ref-only 边界线索输入,不继承实现细节 |
| 旧 `L1-identity` 00~07 | 未按最新 SOP 校准 | 作为旧口径诊断输入;后续文档需要基于新版 00 逐份重建或复核 |
| `projects/L1-identity/design-calibration/04_config_*` | 已有配置设计中间产物 | 暂保留;后续需要在新版 00~03 稳定后复核配置设计 |

---

## 3. 总流程计划

| Step | 主题 | 输入文件 | 输出文件 | 前序依赖 | 当前状态 | 完成门禁 | 下一步许可 |
|---|---|---|---|---|---|---|---|
| Step 1 | 与上游文档的关系声明 | 产品叙事、六域模型、仓库拆分、依赖裁剪、历史 README | `00_req_step_01_upstream_relation.md` | 无 | 已完成 | 来源权威、历史输入降级和承接主题已明确 | 可进入 Step 2 |
| Step 2 | 本仓定位与边界 | Step 1、六域身份域、仓库拆分 §4.1、旧边界材料 | `00_req_step_02_position_boundary.md` | Step 1 | 已完成 | 一句话定位、非目标、相邻仓边界和判定问题已闭合 | 可进入 Step 3 |
| Step 3 | 背景与问题定义 | Step 2、产品身份叙事、旧文档混层问题 | `00_req_step_03_problem_context.md` | Step 2 | 已完成 | 背景、痛点、业务问题和技术问题已分层 | 可进入 Step 4 |
| Step 4 | 目标与非目标 | Step 2、Step 3、上游产品/架构 | `00_req_step_04_goals_non_goals.md` | Step 3 | 已完成 | `G-ID-001`~`G-ID-005` 与非目标边界已形成 | 可进入 Step 5 |
| Step 5 | 用户与角色 | Step 2、Step 4、产品角色线索 | `00_req_step_05_users_roles.md` | Step 4 | 已完成 | 人类角色、系统角色和能力级权限差异已分离 | 可进入 Step 6 |
| Step 6 | 使用方与依赖 | Step 2、Step 5、依赖裁剪规则 | `00_req_step_06_consumers_dependencies.md` | Step 5 | 已完成 | 编译期、运行期、事件协作和禁止依赖已裁剪 | 可进入 Step 7 |
| Step 7 | 核心能力闭环 | Step 2、Step 4、Step 6 | `00_req_step_07_core_capability_loop.md` | Step 6 | 已完成 | `C-ID-1`~`C-ID-5` 已命名、排序并给出成立条件 | 可进入 Step 8 |
| Step 8 | 用户故事 | Step 5、Step 7 | `00_req_step_08_user_stories.md` | Step 7 | 已完成 | `US-ID-001`~`US-ID-015` 均映射能力节点 | 可进入 Step 9 |
| Step 9 | 功能需求 | Step 7、Step 8 | `00_req_step_09_functional_requirements.md` | Step 8 | 已完成 | `FR-ID-001`~`FR-ID-014` 均有故事和能力来源 | 可进入 Step 10 |
| Step 10 | 业务规则与边界约束 | Step 2、Step 7、Step 9 | `00_req_step_10_business_rules_boundaries.md` | Step 9 | 已完成 | `BR-ID-001`~`BR-ID-015` 保护功能不串仓 | 可进入 Step 11 |
| Step 11 | 数据需求与数据归属 | Step 2、Step 9、Step 10 | `00_req_step_11_data_ownership.md` | Step 10 | 已完成 | 真相、快照、引用和禁止正文四类已区分 | 可进入 Step 12 |
| Step 12 | 接口与依赖 | Step 6、Step 9、Step 11 | `00_req_step_12_interfaces_dependencies.md` | Step 11 | 已完成 | 能力级接口和依赖边界均可回指功能需求 | 可进入 Step 13 |
| Step 13 | 非功能需求 | Step 7、Step 10、Step 11、Step 12 | `00_req_step_13_non_functional_requirements.md` | Step 12 | 已完成 | 安全、审计、幂等、一致性、可用性和性能判断口径已形成 | 可进入 Step 14 |
| Step 14 | 验收标准 | Step 7、Step 9、Step 10、Step 11、Step 13 | `00_req_step_14_acceptance_criteria.md` | Step 13 | 已完成 | AC 与 VETO 均有来源,未写测试步骤 | 可进入 Step 15 |
| Step 15 | 风险与待确认事项 | Step 1~14 | `00_req_step_15_risks_open_questions.md` | Step 14 | 已完成 | 风险、后移事项和不阻塞 00 的条件已说明 | 可进入 Step 16 |
| Step 16 | 需求追溯矩阵 | Step 7~14 | `00_req_step_16_traceability_matrix.md` | Step 15 | 已完成 | 无孤儿故事、功能、规则、数据、接口或验收 | 可进入 Step 17 |
| Step 17 | 正式整理为 `00-需求文档.md` | Step 1~16 | `../00-需求文档.md` | Step 16 | 已完成 | 正式文档每章有具体校准来源且未新增未确认结论 | 可进入后续 01~07 复核 |

---

## 4. Step 内统一执行模板

每个 `00_req_step_*` 文件必须按以下十段结构落盘:

1. Step 状态 + Step 内计划
2. 本步输入
3. SOP 问题回答
4. 当前文档问题诊断
5. 改动前后对比
6. 设计取舍
7. 结构化中间产物
8. 回填草稿
9. 待确认事项
10. 进入下一步条件

Step 内计划必须包含:

- 读取输入。
- 回答 SOP 问题。
- 诊断旧文档问题。
- 比较改动前后。
- 记录采用和不采用的取舍。
- 输出结构化中间产物。
- 判断复杂度,必要时拆模块或附录。
- 提供正式文档回填草稿。
- 列出待确认事项。
- 明确进入下一步门禁。

---

## 5. 当前已收敛的关键决策

| 编号 | 问题 | 本轮结论 |
|---|---|---|
| ID-REQ-D-001 | 是否局部修补旧 `00-需求文档.md` | 否。本轮按 SOP 从 Step 1~17 重建需求校准链。 |
| ID-REQ-D-002 | 旧 `01/02/03` 是否可反向约束新版 `00` | 否。旧设计只作为历史输入,新版 `00` 是后续 `01`~`07` 的新基线。 |
| ID-REQ-D-003 | Identity 是否负责认证、登录、token、session | 否。Identity 管平台级 AI 员工身份真相,不管入口认证。 |
| ID-REQ-D-004 | Identity 是否负责 ProjectMember | 否。ProjectMember 是 `L1-work` 的项目内承担事实。 |
| ID-REQ-D-005 | Identity 是否保存 RoleDefinition / CapabilityDefinition 正文 | 否。定义正文归 `L3-method-library`;identity 只保存身份侧引用、摘要和证据引用。 |
| ID-REQ-D-006 | Identity 是否保存 memory 原文、向量、archive package | 否。Identity 只保存记忆引用和身份侧归属关系。 |
| ID-REQ-D-007 | 核心能力节点 | `C-ID-1` 身份锚定,`C-ID-2` 生命周期可用性,`C-ID-3` 角色能力摘要,`C-ID-4` 生涯与记忆引用,`C-ID-5` 消费与追溯。 |
| ID-REQ-D-008 | 编译期依赖 | 当前需求层只允许 `L0-core` 进入编译期依赖候选;其他关系按运行期或事件协作裁剪。 |
| ID-REQ-D-009 | 高风险生命周期处理 | 需求层确认需要治理结论或授权约束,但不在 `00` 定义具体 Gate protocol、状态机或策略实现。 |
| ID-REQ-D-010 | 正式文档装配 | 正式 `00` 不新增中间产物之外的新结论;未闭口事项进入风险或后续文档。 |

---

## 6. 正式文档装配规则

- §1 从 Step 1 装配,只声明来源关系和承接边界。
- §2 从 Step 2 装配,只声明本仓定位、非目标和边界判定问题。
- §3 从 Step 3 装配,只声明背景、问题和影响,不写解决方案。
- §4 从 Step 4 装配,保留 `G-ID-*` 目标和非目标。
- §5 从 Step 5 装配,保留角色和能力级使用差异,不写认证协议。
- §6 从 Step 6 装配,保留依赖裁剪图和禁止依赖,不复制总依赖矩阵。
- §7 从 Step 7 装配,保留 `C-ID-*` 核心能力节点。
- §8~§14 从 Step 8~14 装配,必须以能力节点为主轴。
- §15 从 Step 15 装配,未闭口事项只记录为风险或后移项。
- §16 从 Step 16 装配,作为后续 `01`~`07` 的需求回指入口。

---

## 7. 后续影响

- `01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`05-测试方案.md`、`06-验收标准.md` 和 `07-实施计划.md` 需要基于新版 `00-需求文档.md` 重新校准或逐项复核。
- 已有 `04-配置设计.md` 和 `04_config_*` 需要在新版 `03` 稳定后复核是否仍符合正式对象、port、job 和 profile 口径。
- 实现仓不得再以旧 `v0.1.x / v0.2.x / v0.3.x` identity 文档作为直接实现基线。
