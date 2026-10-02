# 03 Step 1：确认概要设计输入边界

## 1. Step状态

开工确认：2026-10-01；full-restart / single-agent；授权仅Step1～4。当前 completed / selfcheck_done，gate_status=pass（仅本Step设计产物）。输出：03_ddd_step_01_input_boundary.md；未来回填正式§1，当前不得修改正式03。已读通用规范、详细SOP当前Step、书写规范对应章节和前序输入。

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

直接基线：[当前00](../00-需求文档.md)§9～16、[当前01](../01-架构设计.md)§6～13/16/17、[当前02](../02-概要设计.md)§4～13；[02 flow](02_hld_calibration_flow.md)、[02最终装配](02_hld_step_14_formal_assembly.md)已读取。当前02的104需求编号、43对象、49入口flow、14状态carrier是覆盖基线，不是详细schema。
专项来源：九owner当前正式03职责/范围及当前02的受影响合同台账引用；Core正式类型与sibling实现exports核验线索。旧README/旧03不参与正向推导。前序为02 Step14：保留owner缺口、无事件/财务/归档active lane、无实现事实。

## 3. SOP问题回答

1. 当前详细设计直接承接概要设计中的哪些结论？

答：承接市场局部truth、七U语义责任、三Entry/三个运行单元、typed required ports、49处理流和14状态主语；外部资产/approval只按引用消费。03应把轮廓转换为schema/函数/存储而不是再次决定Marketplace定位。

2. 概要设计中的代码主体框架是否已经足够稳定？

答：七Service、Domain向内、application拥有port、infra实现SDK/PG、Web只展示/发意图已稳定，可以进入文件规划；七U不是七服务也不是必须七crate。API和Worker共享应用契约，布局形态仍需Step4单独判断。

3. 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开？

答：43独立对象卡、21Commands/16Queries/12内部Jobs、49独立flow和14carrier矩阵足以承接本地展开。SourceVerification候选与optional binding、Draft安全spec与Submitted固定basis、终态attempt/晚到结果已明确。对端exact输出不齐只能设计required语义和blocked分支，不能把轮廓误写成真实SDK调用。

4. 哪些内容仍停留在概要设计轮廓，进入详细设计前必须补清？

答：必须先明确源码语言/注释、Core与SDK真实导出及路径、planned runtime/存储框架、仓库/文件边界；后续获授权Step才展开标量codec、完整二级类型、factory/rehydrate、port签名、原结果、SQL/UoW、fence与scope resolver。缺外部auth/source/approved/probe资格不是本地补字段可以解决的。

5. 哪些需求或架构结论会影响详细设计，但不能在详细设计中重新定义？

答：00资产与审核owner红线、无Billing owner时无财务truth、01Rust/Vue与SDK向下接入、Query无写、immutable owner refs、不以scan/signature/ACK为approval、unknown不盲重发、withdraw仅本地序列化、locale不改业务，都不能在03重定义。若改变必须回源并另获用户授权。

## 4. 当前文档问题诊断

当前02§6只给轮廓，标量如CanonicalOwnerRef/ExpectedMarketRevision尚无codec；§7本地port名不等于SDKmethod；§8共同事务有语义但无PG隔离/失败签名；§12要求完整schema/原结果/typed snapshot，尚不是实施契约。§13仍挂起publisher owner、Gov binding和receiver probe，所以“输入足以设计”与“正向集成可以运行”必须分列。旧03未作诊断输入，避免历史交易/包正文反污染。

## 5. 改动前后对比

| 项 | 当前02输入 | 本Step校准后 | 原因 |
|---|---|---|---|
| 细化许可 | 概要稳定 | 本地契约可展开；外部positive单独blocked | 防止正式文档替对端承诺 |
| 主体 | 七U与三Entry | 作为布局输入，不先拆七微服务 | 责任轴不同于工程轴 |
| 类型 | 轮廓 | later schema任务明确但尚不造定义 | 保留Step次序 |
| 基线 | 当前00/01/02 | 旧03只historical_material | full-restart |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 本地设计与外部qualification分层 | 可明确文件/约束并fail closed | 必须逐lane维护缺口 | 采用；本轮只到Step4 |
| 等所有外部实现ready才开始任何设计 | 不会误接入 | 把可独立的本地设计也停止 | 不采用；无实现授权，本地设计可推进 |
| 用Generic JSON/旧稿补出对端schema | 看似快速闭口 | 第二真相、资格伪造 | 禁止 |

## 7. 结构化中间产物

### 上游关系映射

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| 当前00§9～16 | 16FR/21BR/17NFR/20AC/14IF/11DEP/5VETO，数据truth与开放缺口 | 不变量、输入校验、错误、安全面、最小验证切口 |
| 当前01§6～13/16/17 | 七U、三运行单元、Rust/Vue、owner/runtime/一致性与ADR | planned crate/module、port/adapter、编译方向 |
| 当前02§4～5 | Service/Entry/Domain/PG/SDK主体 | 实现单元与文件职责，后续模块契约 |
| 当前02§6～7 | 43对象与typed接口/持久化轮廓 | 完整传递类型/nullable/来源/调用面；本轮不进入其定义 |
| 当前02§8～10 | 49flows、14carrier、unknown/终态/原结果与撤回竞争 | later函数流、状态矩阵、事务、并发与错误契约 |
| 当前02§11～13 | 配置引用、完整承接清单、资格缺口 | builder读取点、测试/实施输入与受影响路径 |
| [SDK03](../../L0-sdk/03-详细设计.md)§1～2与真实client | 官方客户端层、三语言面、Core复用 | 编译client导出与required operation支持分层，不绕SDK |
| [Identity03](../../L1-identity/03-详细设计.md)§3 | AI identity、Core上下文与auth非范围 | 复用actor引用；humanpublisher/auth仍缺owner |
| [Governance03](../../L1-governance/03-详细设计.md)§1～2 | 正式裁决truth归Gov | 审核申请handoff与有效approved binding required；不自产approval |
| [Artifact03](../../L1-artifact/03-详细设计.md)§1～3 | Artifact版本/血缘/body ownership | 只保留正式材料引用；不复制正文或扫描结论 |
| [Method03](../../L3-method-library/03-详细设计.md)§1 | Definition vs Use、方法正文owner | Method/Role/ProcessTemplate display类别映射；本仓无正文 |
| [Hub03](../../L3-capability-hub/03-详细设计.md)§1～2 | Registry/Adapter/Exposure truth，Marketplace只下游消费 | Source adapter qualification；不合并listing |
| [Images03](../../L2-member-images/03-详细设计.md)§1～3 | 镜像资产供给、consumer缺口、0outbound | 固定entry/ref与receiver required；不拥有launch/安装truth |
| [Observability03](../../L4-observability/03-详细设计.md)§1 | 脱敏observation/receipt与证据边界 | local audit与qualified交接独立，不能称receipt已取得 |
| [Archive03](../../L4-archive/03-详细设计.md)§1～2 | owner-specific source/export/restore | 当前没有market source lane，不规划归档receiver |

### 本文不再回答

- 定位/用户故事/验收红线、owner归属、七U与三运行单元是否成立。
- 是否改为React/TS backend，是否把市场合并Hub/Method，是否自造支付、approval或资产正文。
- 是否把查询、scan/signature/ACK或UI开关当授权。

### 本文必须回答

- Step3/4先确定language/runtime/compile路径、planned实现单元与文件owner。
- 后续获授权才逐模块回答完整schema、DTO→factory、port/save+get、函数flow、状态、SQL/UoW与原结果读取。
- 完整03还须定义claim/fence/probe、scope/index、配置读取、audit/测试切口和下游交接；当前未完成这些契约。

### 输入不足风险

| 输入缺口 | 影响 | 当前姿态 / 重开条件 |
|---|---|---|
| MP-UP-001～005 | 来源/publisher/材料/审核/分发与读取scope | 正向资格blocked；正式owner+SDK逐operation支持后重开受影响Step |
| MP-UP-006 | 未来支付/订阅/结算 | future，不在03补财务面 |
| MP-UP-007/008 | 处置authority/notice/Obs | required边界可规划，production adapter不激活；Archive lane absent |
| SRC003/010/013 | draft口径、Gov状态冲突、类型合规/包owner | 不择边、不造批准/包；等待受控owner说明 |
| Q-MP-01 | SLO/容量/保留删除 | 无生产数值或删除授权；规划有界结构不等实测 |

复杂度判断：本Step是输入分层而非对象schema，单文件分表即可；不展开九owner全量对象卡，不生成未来Step附录。

## 8. 回填草稿

### 正式§1候选草稿（未装配）

本文承接当前00/01/02中已稳定的Marketplace局部truth、七语义责任、三运行单元及对象/接口/flow/状态轮廓，继续下沉到文件、schema、typed callable、函数流、事务、错误、并发与验证切口。本文不改变上游owner或Rust/Vue/SDK边界；所有旧正式材料仅为historical_material。当前本地设计可以继续校准，外部source/approval/publisher/material/receiver/notice/observation资格仍按02§13挂起；正式命名或package存在不代表consumer contract ready。来源映射、必须/不再回答与风险表采用本Step§7。

## 9. 待确认事项

MP-UP-001～008、MP-SRC-003/010/013、Q-MP-01继续按当前02§13保留。本地candidate编号不是外部已确认/已发送blocker；Core/SDK package存在不关闭任一consumer合同。

## 10. 进入下一步条件

| 自检项 | 结果 |
|---|---|
| 当前00/01/02与02恢复产物已承接 | pass |
| 43对象/49flow/14carrier与104编号不改义 | pass（只确认覆盖基线） |
| 九owner边界与positive资格分列 | pass；exactschema未声称核验 |
| 无旧03推导、无新scope/approval/财务truth | pass |
| §7/8无新增未推导结论 | pass |
| 本Step十段、输入/诊断/取舍/复杂度/门禁齐备 | pass |

Step1本地文档gate pass，完成内部停审。当前授权允许读取本Step§3/4/6/9及02§2/12、Step2 SOP/规范后进入Step2；外部qualification仍blocked。无正式03、实现或commit。
