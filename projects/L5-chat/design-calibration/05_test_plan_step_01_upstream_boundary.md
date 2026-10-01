# L5-chat 05 · Step 1 与上游文档的关系声明

## 1. Step状态

> done / pass_with_upstream_blockers；2026-10-01。全部用例/证据/路径均planned，未执行。

## 2. 本步输入

当前00～04；05 SOP Step1与书写规范5.1；03 Step16、04 §12；真相源§2.15/§7。复杂cut逐个收口，前序gate成立才创建本文件。

## 3. SOP问题回答

测试来源、owner、证据职责分别是什么？以上表逐项给出；发生冲突回指当前00～04，测试不自行创造业务契约。

## 4. 当前文档问题诊断

旧05六UX流与旧对象名已脱离当前43协议/17主体，旧06不能替代00实际AC；BASE001存在不存在的AC引用。

## 5. 改动前后对比

| 改前 | 改后 | 原因 |
|---|---|---|
| 旧05六UX流与旧对象名已脱离当前43协议/17主体，旧06不能替代00实际AC；BASE001存在不存在的AC引用。 | 本步§7结构化结论 | 防止历史设计与当前owner合同分叉 |

## 6. 设计取舍与复杂度

采用00～04逐契约承接；拒绝旧05增补和原型截图代替行为测试。输入边界是简单分类，表足够。

## 7. 结构化中间产物

### 1.1 权威与承接

| 输入 | 定位/章节 | 本文承接 | 不替代 |
|---|---|---|---|
| [00需求](../00-需求文档.md) | §9～14，F/BR/DR/NFR与实际AC | 测试目标、追溯、七条否决负向 | 不补造AC或数值质量阈值 |
| [01架构](../01-架构设计.md) | 层次、SDK-only、Desktop-first | 依赖方向/部署层测试 | 不扩展业务owner |
| [02概要](../02-概要设计.md) | 项目五tab、三层流程、目录、模块 | 跨模块/UI切口 | 不保留顶层项目进度 |
| [03详细](../03-详细设计.md) | §4～15；Step16 | 43协议、17主体、CAS/原slot、错误、配置、native | 不改接口/DTO/owner语义 |
| [04配置](../04-配置设计.md) | §5～12/§14 | 八域14叶子、六profile、12CUT-CFG | 示例预算不作生产默认 |
| 各owner与SDK当前正式00～07 | 阅读沿用03/04台账；必要边界核对 | formal public surface/qualification正向前置 | skeleton/dist不能证明runtime绑定 |
| L1-governance05 Step6/13 | 仅结构参考 | 每cut动作/断言、EV-CAND→planned EV | 不复制数据库/UoW/outbox |
| 旧05/README | historical_material | 旧ChatThread/ChatReplyState等污染审计 | 不作正式测试输入 |
| [06历史路径](../06-验收标准.md) | 尚未本轮校准 | 仅下游占位 | 不使用旧验收号/阈值 |
| L6-bridges | parallel sibling边界 | 禁止吸收外部平台映射 | 未停审设计不输入 |

### 1.2 本轮口径

Chat只拥有导航/选择/草稿/attempt/安全展示缓存/多端体验。Conversation/Turn/Participant、Project/Member、Gate/Decision、Artifact、Workspace、Runtime分别由正式owner提供。Process三层safe topology及fork/branch/join必须来自正式Process能力。关系与target access分别资格化，公司人员目录与项目成员/会话参与者分开。

正文既有formal数据使用仅发生于被授权的安全展示路径；测试与诊断输出不得保存完整正文、secret或raw payload。默认memoryOnly=true；无durable草稿或跨端草稿同步。
SDK提交ACK、UI点击、toast、乐观显示不证明业务提交。真实unknown只probe/query/wait，not_found不证明no-effect。

### 1.3 文档成熟度

本文定义planned TC、fixture、suite、runner候选、证据schema。当前没有实现仓、测试代码、依赖安装或测试运行。步骤gate仅为文档设计检查。所有实际case result/EV、质量阈值批准、06verdict、07boundary实施保持waiting/blocked。

## 8. 回填草稿

正式05 §1回填本步§7全部表、步骤和schema。

## 9. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native/生产预算/版本兼容/质量仍open或blocked。真实正向不得由fixture解除。无当前测试结果、EV或readiness。

## 10. 自检与下一Step门禁

权威/历史/兄弟/下游四类明确；BASE001保留，05不改已停审00。 本地设计gate pass_with_upstream_blockers；进入Step2，先读本产物/台账与对应SOP。
