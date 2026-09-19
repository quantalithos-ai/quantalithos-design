# Step 17 · 正式文档装配

## 1. Step 开工确认

| 项目 | 记录 |
|---|---|
| Step | Step 17 · 正式文档装配 |
| 输出文件 | `00-需求文档.md` 与本文件 |
| 当前模式 | `full-restart + single-agent-serial` |
| 已读取规范 | yes，需求 SOP Step 17、需求书写规范 §二/§三/§4.1~§4.16、设计文档通则与中间产物规范 |
| 已读取前序输入 | yes，Step 1~16 全部校准文件、项目台账、旧 `00-需求文档.md`（仅 historical_material） |
| 用户授权 | yes；用户已明确要求“继续完成 00 然后完成 01” |
| 装配规则 | 只重组已确认结论；旧正式 00 不直接编辑继承；每章显式列 calibration 来源 |
| 当前允许写入 | `00-需求文档.md`；完成静态审计后更新台账并进入已获授权的 `01` |

## 2. Step 内计划

| 计划项 | 状态 | 产物 / 门禁 |
|---|---|---|
| 核对 Step 1~16 均已通过并锁定编号 | done | 项目台账、需求 flow、各 Step 门禁 |
| 设计正式 16 章结构与来源标注 | done | 见 §7.1 |
| 删除并重建旧正式 00 | done | `../00-需求文档.md`，16 章从 calibration 重组完成 |
| 执行边界、truth、历史污染、pending 和追溯静态审计 | done | 见 §7.2~§7.6、§8.1 |
| 更新 00 flow/项目台账为完成及 01 授权状态 | done | 需求 flow 已进入 `formal_stop_review`；项目台账只允许启动 01 Step 1 |
| 形成停审交接记录 | done | 见 §8.2；因用户已明确授权，下一动作是先读取架构 SOP/规范再创建 01 flow |

## 3. 本步输入与装配映射

| 正式章节 | 主要 calibration 来源 |
|---|---|
| §1 与上游文档的关系声明 | `00_req_step_01_upstream_relation.md` |
| §2 本仓定位与边界 | `00_req_step_02_position_boundary.md` |
| §3 背景与问题定义 | `00_req_step_03_problem_context.md` |
| §4 目标与非目标 | `00_req_step_04_goals_non_goals.md` |
| §5 用户与角色 | `00_req_step_05_users_roles.md` |
| §6 使用方与依赖 | `00_req_step_06_consumers_dependencies.md` |
| §7 核心能力闭环 | `00_req_step_07_core_capability_loop.md` |
| §8 用户故事 | `00_req_step_08_user_stories.md` |
| §9 功能需求 | `00_req_step_09_functional_requirements.md` |
| §10 业务规则与边界约束 | `00_req_step_10_business_rules_boundaries.md` |
| §11 数据需求与数据归属 | `00_req_step_11_data_ownership.md` |
| §12 接口与依赖 | `00_req_step_12_interfaces_dependencies.md` |
| §13 非功能需求 | `00_req_step_13_non_functional_requirements.md` |
| §14 验收标准 | `00_req_step_14_acceptance_criteria.md` |
| §15 风险与待确认事项 | `00_req_step_15_risks_open_questions.md` |
| §16 需求追溯矩阵 | `00_req_step_16_traceability_matrix.md` |

## 4. 旧正式文档处理声明

旧 `00-需求文档.md` 只作为 `historical_material` 输入，存在以下不得继承的污染：组织治理“中心”真相定位、固定角色勾选、Provider Contract、固定 38 控制项、固定 8 指标、P95/首屏/SLA 阈值、具体 API/proto/技术框架、页面绿色/transport 成功语义、服务端跨域聚合、业务实体与正文复制、把审计/evidence/readiness 当 Console 结论。装配过程不在旧正文上逐段修补，而是以空文件重建。

## 5. 装配前门禁核对

| 门禁 | 结果 | 依据 |
|---|---|---|
| 项目级允许正式 00 装配 | pass | 用户已授权完整 00；Step 1~16 均 `pass` 或 `pass_with_open_contracts`，pending 已显式保留。 |
| 文档级允许 Step 17 | pass | `00_requirements_calibration_flow.md` Step 16=`done`、Step 17=`in_progress`。 |
| Step/模块级允许回填 | pass | Step 17 只重组已确认回填草稿，不新增需求。 |
| 正式 01 是否提前写入 | no（本 Step） | 先完成 00、审计并更新台账；用户授权后再启动架构校准。 |

## 6. 装配术语与状态约束

- `C-CON-*`、`US-CON-*`、`FR-CON-*`、`BR-CON-*`、`DR-CON-*`、`IF/DEP-CON-*`、`NFR-CON-*`、`AC-*` 只沿用前序已确认编号。
- `pending/blocked/read-only/partial/unknown` 表示当前能力或结果边界，不表示实现完成、集成完成或 readiness。
- 正式文档不写 baseline、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或实现 readiness 事实。
- 正式文档只写需求层外部可见行为；不写 DTO、API path、数据库、repository、handler、内部状态机、组件或技术框架。

## 7. 静态审计计划与结果记录

### 7.1 章节来源完整性

每一正式章节开头均列出对应 `design-calibration/00_req_step_*.md`，并以“延伸阅读”引导到该文件的结构化中间产物与回填草稿。不得用“见 Step 1~16”代替逐文件列举。

### 7.2 真相源与边界审计

确认 Console 只拥有客户端会话壳、导航/筛选/布局、草稿、请求呈现、错误恢复、焦点/a11y 和用户偏好等交互事实；identity/member、work/process、governance/artifact、workspace、method、capability、observability、archive、sandbox truth 仍归 owner。所有业务读取/意图经 SDK 或正式服务边界；无本地授权、数据库直连、规则复制、Policy/Gate 绕过或 UI 推导治理/合规/readiness。

### 7.3 历史污染审计

全文检查并拒绝固定 38/8、P95/首屏/99.9%/99.95%、旧 Provider Contract、proto/path、前端框架、服务端聚合、页面绿色、toast/HTTP 成功等旧结论。若需提及，只放在风险/历史说明中并标为 rejected/pending。

### 7.4 Pending 诚实审计

精确 SDK/owner surface、scope/visibility、safe-field/redaction、reconciliation、Workspace/Method/Capability/Observability/Archive/Sandbox activation、性能/SLO、兼容矩阵和诊断 envelope 均保留 pending；未闭口主题只能呈现 blocked/read-only/partial/unknown，不写 ready/integrated。

### 7.5 追溯审计

以 Step 16 主矩阵为准，检查 21 项功能及其故事、规则、数据、接口/NFR、验收均有既有 ID；正式文档不新增 ID、不改变映射、不把风险事项混入需求。

### 7.6 装配完成门禁

| 检查项 | 目标 |
|---|---|
| 章节与来源 | 16 章齐全、来源逐章列出 |
| 需求结构 | 六节点、核心/外围/边界外分层、21 项功能映射完整 |
| 边界安全 | truth owner、SDK-only、forbidden body、fail-closed、unknown 不重放 |
| 历史污染 | 固定数字/技术方案/旧合同不进入正式结论 |
| 追溯 | 无孤儿、重复、串线或新增项 |
| 状态 | 00 完成后更新为 `formal_stop_review`；因用户已授权 01，再创建 01 校准流 |

## 8. Step 17 自检与交接

### 8.1 最终静态审计

| 检查项 | 结果 | 证据 / 结论 |
|---|---|---|
| 章节与来源完整性 | `pass` | 正式 00 共 16 章；每章逐一引用唯一对应的 Step 1~16 calibration 文件并给出延伸阅读。 |
| 编号集合与追溯 | `pass` | 机器辅助集合核对：28 个 `US`、21 个 `FR`（18 核心 + 3 外围）、36 个 `BR`、30 个 `DR`、16 个 `IF`、17 个 `DEP`、21 个 `NFR`、39 个 `AC`、7 个 `VETO`、14 个 `RISK` 均进入正式 00；无新业务 ID。 |
| truth owner 边界 | `pass` | Console 自有内容仅限交互 truth；全部业务、治理、证据、Workspace、能力、观测、归档和 Sandbox truth 保持 owner 归属。 |
| 访问与治理边界 | `pass` | 所有业务读写均限定在 SDK/正式服务边界；本地 RBAC、数据库/repository/内部 bus、Policy/Gate 绕过和 UI verdict/readiness 推导均被禁止。 |
| 数据边界 | `pass` | truth/snapshot/ref/forbidden-body 四类明确；raw/hidden/credential/业务及证明正文不能通过日志、诊断、错误或导出旁路进入。 |
| 正式结果语义 | `pass` | 草稿、提交/receipt、pending、confirmed/rejected/unknown 分层；transport/toast/cache/刷新不等于业务完成；unknown 不自动重放。 |
| 历史污染 | `pass` | Provider Contract、固定 38/8、P95/首屏/99.9%/99.95%、具体协议/框架和绿色状态仅以 rejected historical material 出现，不作为正向结论。 |
| 实现泄漏 | `pass` | API path、DTO/schema、数据库、repository、handler、组件、技术框架只出现在明确的禁止/非本章粒度声明中；没有形成设计选择。 |
| pending 诚实性 | `pass` | §15 保留 exact surface、scope、visibility、safe-field、reconciliation、各专项接缝、客户端生命周期、量化/兼容/诊断及 L5/L6 协作事项；未声明 integrated/ready。 |
| 事实诚实 | `pass` | 未声称 baseline、commit、run_id、测试结果、artifact、report、evidence、verdict、signoff 或 readiness 已发生。 |

`CON-Q-001~033` 是前序 Step 的局部推演问题；其仍有外部影响的内容已被归并进正式 §15 的 `CON-Q-034~047`。`CON-Q-048~049` 是风险表组织与未来编号系统的非阻塞元问题，保留在 Step 15 calibration，不作为产品需求待确认项重复进入正式正文。

### 8.2 三层门禁与停审交接

| 层级 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|
| Step / 模块级 | `pass` | 正式 00 已仅从 Step 1~16 重组并通过全部静态审计 | 冻结 Step 17 |
| 文档级 | `formal_stop_review` | 需求的能力、规则、数据、接口、质量、验收、风险与追溯已闭合；精确上游合同按 pending 传递 | 不再修改 00，除非发现可追溯缺陷或用户要求重开 |
| 项目级 | `pass_to_authorized_01` | 用户已明确授权“完成 00 然后完成 01”；仍须先读取架构 SOP/书写规范并建立 01 calibration flow | 串行启动 `01` Step 1；不得进入 `02` |

正式 00 于 2026-09-15 完成停审。需求结论冻结；所有未关闭事项由正式 §15、Step 15 calibration 和项目台账继续传递。没有执行测试，也没有提交 commit。
