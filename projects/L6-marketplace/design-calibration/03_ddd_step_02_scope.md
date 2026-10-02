# 03 Step 2：明确本轮实现范围和非范围

## 1. Step状态

开工确认：2026-10-01；full-restart / single-agent；授权仅Step1～4。当前 completed / selfcheck_done，gate_status=pass（仅本Step设计产物）。输出：03_ddd_step_02_scope.md；未来回填正式§2，当前不得修改正式03。已读通用规范、详细SOP当前Step、书写规范对应章节和前序输入。

### Step内计划

| 单元 | 产物位置 | 状态 |
|---|---|---|
| P1读取输入 | §2 | done |
| P2问题回答 | §3 | done |
| P3诊断 | §4 | done |
| P4取舍与前后比较 | §5/6 | done |
| P5结构化 | §7 | done |
| P6复杂度判断 | §7末 | done |
| P7回填草稿 | §8 | done |
| P8自检与停审 | §10 | done |

## 2. 本步输入

前序：[Step1](03_ddd_step_01_input_boundary.md)§3/4/6/7/9。继承：本地七U稳定、对端positive分层、旧03不推导。读取当前02§2/12及详细SOP Step2、书写规范5.2；目前无实施优先级/排期授权。

## 3. SOP问题回答

1. 本轮详细设计必须覆盖哪些模块？

答：完整03将覆盖contracts/domain/application/infra/API/Worker以及Vue Web的契约与文件owner，七U跨这些技术层，不能把UI目录替代后台责任。当前授权只收稳范围/约束/布局，不写Step5模块实现契约。

2. 本轮必须定义哪些对象、接口、事件、job和状态机？

答：完整03承接43HLD对象、21C/16Q/12worker-internal J、49flow、14carrier，必要支撑类型必须随当前契约传递闭口。当前active event为零，不造consumer/producer/outbox；内部Job不是公开任意HTTP路由。所有完整定义等实际进入Step6～13后逐项校准。

3. 哪些能力属于P1/后续阶段，不应在本轮展开？

答：Billing/支付/订阅/分成/跨境、公开发布CLI、评分推荐运营、新包owner、Archive市场source/restore、未获canonicalschema的事件、跨owner安装/卸载属于future或blocker。不能用future标签绕过当前分发的原意图probe、withdraw race或原结果契约，它们是现有范围必需。

4. 哪些内容属于测试方案、实施计划、配置设计或运维手册？

答：03提供typed config引用/builder、最小测试入口和实施前置条件；04负责keys/defaults/profile/secrets；05完整cases/fixtures/执行报告；06验收门禁与证据判定；07实施boundary/计划/ledger/skeleton。部署拓扑/生产运行手册不在本轮产物。

5. 实现者拿到本文后，应能完成哪些代码范围？

答：最终03完成且04～07/实施授权满足后，可以按完整契约实现本地domain/application、DTO、API/Worker、PG、Web和受控SDKadapter；没有formalconsumer支持的production接缝仍blocked。当前Step1～4只形成设计与planned文件输入，不足以开工实现。

## 4. 当前文档问题诊断

当前02§2的范围是概要骨架，不是03全部schema已存在；§7内部Job写明wrapper与完整report须同boundary，不能后移为“后台另做”；§12要求Web展示loading/empty/rejected/unknown/stale/degraded，因此“前端仅展示”仍有typed client、状态映射与locale工程工作，不能理解为纯静态页面。§13future财务不能转为transaction表。

## 5. 改动前后对比

| 项 | 当前输入/误用风险 | 校准后 | 原因 |
|---|---|---|---|
| 完整03范围 | 与本轮授权容易混淆 | 完整契约范围与Step1～4授权分列 | 不越Step4 |
| 前后端 | 三运行单元 | Web/API/Worker分别交付，共享市场边界 | 不重复truth |
| Job | 12内部任务 | 请求/报告/结果闭口属于现有范围 | 不以future拖欠 |
| 财务/事件 | future/conditional | 无当前写面与activeevent | 未具owner合同 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 全03契约覆盖明确、本轮只做前四Step | 范围一致且授权可审计 | 后续仍需独立授权 | 采用 |
| 只规划Web，把后台留给别的项目 | 页面容易形成 | 无发布审核分发truth/一致性owner | 不采用 |
| 把配置测试实施完整内容一并写03 | 一份文档看似完整 | 跨文档真相重复、越授权 | 不采用；只给引用点与切口 |

## 7. 结构化中间产物

### 设计目标表（完整03应交付的契约）

| 目标 | 说明 | 交付给实现者的结果 |
|---|---|---|
| 实现组织 | 三运行单元、七U与向内分层 | planned目录/package/crate/binary/文件职责 |
| 本地对象闭口 | 43对象及其传递支撑类型 | 字段来源、nullable、校验、factory/rehydrate、禁止正文 |
| callable闭口 | 21C/16Q/12内部J、typedport/save+get | 完整输入/输出/错误/metadata与全结果读取 |
| 流程与状态闭口 | 49flows、14carrier | 每入口函数流、合法/非法迁移、guard/错误/terminal |
| 一致性闭口 | accepted+audit+原结果+耐久责任 | UoW写集、revision/版本序列化、fence、claim与unknownprobe |
| 读取闭口 | scopebound查询、typed snapshot、索引 | resolver/currentvisibility、typedview、本体+state、重建plan/cursor |
| 外部接缝闭口 | formalowner经SDK | adapter mapping/qualification、blocked/fake边界，无私有fallback |
| Web闭口 | 展示/意图/locale | typedclient、页面/组件、统一状态/不可用呈现，无本地approval |
| 横切承接 | 配置读取、audit/telemetry、验证 | 04引用点、05最小切口、06证据上限、07开工门禁 |

### 范围与当前授权分层

| 范围层 | 包含 | 当前状态 |
|---|---|---|
| 已确认本地责任 | U1source/publisher、U2申请/handoff、U3目录/version、U4distribution、U5撤回/notice、U6audit/recovery、U7ref/read | 完整03承接目标；Step5后逐模块展开，非本轮已完成 |
| 内部维护 | 12Job、原结果、typed snapshot/index维护 | 现有范围不可后移核心失败恢复；不公开新HTTPjob |
| 本轮授权 | Step1输入、Step2范围、Step3约束、Step4布局 | 只创建四份calibration；Step4结束停止 |
| 正式装配 | Step19、18章 | 未授权；旧正式03保持historical_material |
| 实施 | 目标repo、代码/manifest/配置/测试 | 未授权；本轮不创建 |

### 非范围表

| 非范围 | 留给哪一层 / 哪份文档 |
|---|---|
| 定位/owner/三运行单元/RustVue/七U增删 | 回源00/01/02受控变更，不由03改义 |
| Method/Role/ProcessTemplate/Capability/MemberImage/Artifact正文 | 对应唯一owner；本地仅qualified immutable引用 |
| Identity/人类认证/组织auth/gateway/secret truth | 正式安全/认证owner；MP-UP-003待定，不造登录/验证 |
| Govapproval、scan/signature/SBOMverdict | Governance/材料authority；本仓只有binding与材料ref |
| 支付/订阅/结算/分成/跨境交易 | 正式Billing owner与新范围授权；MP-UP-006 future/blocker |
| 安装执行/卸载/接收方truth | 正式receiver/运行owner；本地intent/attempt/outcomebinding不等installed |
| Archive市场source/export/restore | owner确认并重开上游后讨论；当前0lane |
| activeevent/producer/outbox/未知SDK operation | canonicalowner schema与支持资格齐备后受控重开 |
| 发布CLI、排名评分/推荐运营、跨包新能力 | 后续需求/架构授权，不列当前crate |
| 具体配置keys/defaults/profiles/productionlistener值 | 04；03只给typed引用/builder与禁改invariant |
| 完整测试cases/fixture/automation/run/reports | 05；03给最小测试切口而不造执行事实 |
| 验收verdict/signoff/readiness与证据alias | 06及实际授权验证，文档检查不替代 |
| phase/commitboundary/implementationledger/skeleton | 07；只在正式07完成时planned/blocked/waiting |
| 运维拓扑、SLO数值、删除授权 | 运维/正式owner输入；Q-MP-01挂起 |

实现者交付上限：完整03最终应可定位每个本地文件/类型/函数；外部adapter只能在逐operationconsumer合同具备后激活。当前四Step不是实施基线或可执行代码包。

复杂度判断：范围是完整03目标索引，不写schema/flows；单文件可审查，七U只作为覆盖轴，不提前生成模块附录。

## 8. 回填草稿

### 正式§2候选草稿（未装配）

本详细设计将概要的43对象、21Command、16Query、12worker-internalJob、49flow、14statecarrier以及七U和三运行单元展开为本地实现契约。目标/非范围与责任分层采用本Step§7；当前无activecanonicalevent、Billingwriter或Archive市场lane。Web只承担展示、提交意图、typedAPI客户端和双语状态映射，不拥有后台truth。配置、完整测试、验收与实施分别交给04～07。当前授权仅完成Step1～4的calibration，尚未形成完整03或实施许可。

## 9. 待确认事项

沿Step1§9保留全部缺口；无owner的entitlement/transaction不能自行变成paid/settled。明确纳入本地范围的仅分发资格/关系局部状态，不追加财务流水。

## 10. 进入下一步条件

| 自检项 | 结果 |
|---|---|
| 目标表达schema/callable/flow等实现输出而非重写用户故事 | pass |
| 覆盖七U、Web/API/Worker、12内部Job与恢复必需项 | pass |
| non-scope每项有owner/后续文档归属 | pass |
| 当前授权与完整03/正式装配/实施分离 | pass |
| 无财务truth、无新增event/CLI/安装owner | pass |
| 无图、无完整配置/测试/实施跨写 | pass |

Step2完成内部停审，文档gate pass。可按当前授权进入Step3；须先读本Step问题/诊断/取舍/开放项、编码和提交规范，并核验真实Core/SDK编译路径。外部qualification保持blocked，不提交。
