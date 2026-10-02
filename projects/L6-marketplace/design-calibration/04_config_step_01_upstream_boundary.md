# 04 Step 1：确认配置输入边界

## 1. Step状态

2026-10-02；full-restart / single-agent；completed / selfcheck_done / stop_review。用户授权全部04；正式04尚未装配。已读取配置SOP Step1、配置书写规范§5.1、当前00～03与03 Step14配置绑定。

### Step内计划

| 字段 | 收口结论 |
|---|---|
| 本步目标 | 固定04承接的上游配置输入与不再回答的问题 |
| 本步输入 | 正式00～03、03§13/14、配置SOP Step1 |
| 本步输出 | 上游映射、配置问题清单、03影响初判 |
| 应问的问题 | 哪些字段/依赖/环境差异进入04；哪些不得在04重定义；是否有阻塞输入 |
| 期望产出 | 输入映射表、边界诊断、回填草稿 |
| 回填位置 | 正式04§1 |
| 执行约束 | 不新增struct/trait/port/error/flow；缺口留待确认 |
| 进入下一步条件 | 输入和边界明确，影响表无待回写 |

## 2. 本步输入

当前[00需求](../00-需求文档.md)、[01架构](../01-架构设计.md)、[02概要](../02-概要设计.md)、[03详细设计](../03-详细设计.md)；03§13七字段RuntimeConfig、八slot、runtime builder和失败清理；02 Step11配置影响；下游05/06/07尚未授权，仅承接方向。

## 3. SOP问题回答

配置输入来自需求中的环境/安全/NFR、架构的API/Worker/Web边界、概要的三运行单元和配置红线、详细设计的七字段/八slot/启动入口/错误与测试切口。配置设计不重新定义对象、trait、协议、状态或函数；具体部署命令、真实secret、profile数值和运行证据不在本轮生成。上游owner资格缺口阻塞positive装配，但不阻塞配置语义设计。

## 4. 当前文档问题诊断

旧draft只给技术栈，未形成配置来源、优先级、敏感处理、环境矩阵或失效口径。03已给字段形状但将profile数值、secret管理和加载细节留给04；若04把`profile`、`schema_version`误写进RuntimeConfig，会制造第八字段，因此必须定义为外部envelope metadata。

## 5. 改动前后对比

| 项 | 之前 | 本Step结论 |
|---|---|---|
| 输入来源 | 技术栈/运行单元方向 | 00～03逐文档映射，03为配置契约authority |
| 配置字段 | 七字段但缺来源 | 每字段均有04配置域映射，不能新增字段 |
| 外部依赖 | 八slot资格未闭合 | 配置只提供受控ref，资格仍由SDK/owner验证 |
| 下游 | 05～07未启动 | 只预留承接，不伪造测试、验收或实施结果 |

## 6. 配置设计取舍

采用严格JSON envelope + typed loader映射既有RuntimeConfig；拒绝让domain读取env、让配置产生approval或让`owner_bindings`自称Bound。profile只选择来源与能力姿态，不改变业务规则。

## 7. 结构化中间产物

| 来源文档 | 配置输入 | 回填章节 |
|---|---|---|
| 00 | 环境、安全、可观测、容量和禁止伪成功要求 | §1、§4、§11、§14 |
| 01 | API/Worker/Web运行边界、向内分层和配置红线 | §2～§6、§9 |
| 02 | 三运行单元、七U职责、配置影响方向和原型非生产边界 | §1～§6、§12 |
| 03§13/Step14 | 七RuntimeConfig字段、八adapter slot、入口参数、builder失败清理 | §3、§5、§7～§11 |
| 03§15/16 | safe telemetry、planned测试切口和证据上限 | §8、§10～§12 |

不再回答：业务ownership、Governance approval、owner正文/血缘、状态迁移、事务/幂等、API schema、测试case、验收verdict、实施排期和部署命令。配置必须回答：来源、优先级、profile、键名、类型/默认/必填、敏感性、加载校验、生效、变更、失效和下游承接。

## 8. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 七字段映射到六配置域；profile/schema_version为envelope metadata | 否 | 仅配置语义 | 不适用 | 无回写 |
| 八slot以configuration_ref输入，disposition仍由validator计算 | 否 | 仅来源/资格姿态 | 03§13已定义 | 无回写 |
| startup加载、严格JSON、无production默认 | 否 | 加载/失败策略 | 03§13已留给04 | 无回写 |

## 9. 回填草稿与待确认事项

正式§1应声明00～03输入、03七字段authority、配置与业务truth分离及MP-UP/SRC/Q不关闭。待确认：exact SDK/owner consumer、human auth、PG/secret provider和容量profile；这些进入风险，不改变本Step配置边界。

## 10. 进入下一步条件

输入文档和配置边界明确；没有待回写或代码契约新增。Step1停审通过，进入Step2。外部资格仍blocked，不能解释为运行ready。
