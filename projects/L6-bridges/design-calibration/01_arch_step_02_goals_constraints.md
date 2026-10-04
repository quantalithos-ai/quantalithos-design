# L6-bridges 01 Step 2：架构目标与约束

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step1 pass，已读其§7、正式00§3/4/10/13/15、SOP Step2及规范§4.2/4.3，通用纪律沿用flow。单一结构目标单元，先问题/诊断/取舍，后四类表/摘录/自检；不提前选容器或库。

| 单元 | 思考 | 写入 | 自检 | gate_status / 下一动作 |
|---|---|---|---|---|
| 结构目标与收缩范围 | done | done | done | pass / read_step_03 |

## 2. 输入

Step1稳定需求与挂起，00五目标/五能力与全局Layer5裁剪；无运行量化基线。

## 3. SOP逐项问题回答

| 问题 | 回答 |
|---|---|
| 架构确保什么？ | 独立局部状态与owner引用；授权与转换/效果责任分离；四平台差异能隔离；结果不互证；有界、安全且可验证的恢复与观察。 |
| 不可变约束？ | truth不迁移、无隐式身份/权限、Policy/Gate不旁路、阶段不互证、禁止材料不落盘/出口、unknown不盲重试、query no-write。 |
| 可接受取舍？ | 不支持能力显式收缩；无权威probe保人工/未知；展示美化/批量发现是外围增强；Workspace可选但不能替授权。 |
| 可判断或量化？ | 以各AC/VETO和协议guard判断；禁止材料为零容忍要求，不承诺吞吐/SLA/4平台成功率。 |
| 不属主线？ | 身份/审批/对话truth系统、平台备份、统一auth、聊天UI、运行执行器、跨平台广播及证据裁决。 |

## 4. 当前材料诊断

00质量条件已经可判断但不是结构方案；Step1暴露safe材料/human链缺口，不能以可用性为由填默认。旧01§1.3/2.2的4/4、100%恢复、平台优先序/Python~TS不是本轮有来源的结构约束。

## 5. 前后对比

将功能愿望/性能目标改为结构成立条件；将平台优先序/默认审批改为逐能力支持与显式挂起；不把边界外auth写为“暂不做深”。历史口径仅扫描，不承接。

## 6. 取舍与复杂度

采用有限、安全、可解释的结构目标；未采用原生体验/自动恢复优先或以一套canonical message消除平台差异。四类结论分别成表，当前无需拆单元/附录，后续对象与通信在相应Step展开。

## 7. 结构化中间产物

### 7.1 背景、驱动力与目标

既有外部渠道的协作需要明确主体责任、消息差异与交付结果。需求保护不能自行决定状态归属和隔离结构；平台协议变化、授权撤销及外部不确定效果是本仓独立设计的驱动力。

| 架构目标 | 说明 |
|---|---|
| AG-BR-001 承载独立桥接局部状态 | 否则映射和处理记录会变成内部或平台第二真相。 |
| AG-BR-002 守住受权关系与业务责任边界 | 否则平台来源认证会被误用为内部参与或审批资格。 |
| AG-BR-003 支撑独立阶段及单一逻辑效果 | 否则ACK、owner接受和外部receipt会混同并导致重复效果。 |
| AG-BR-004 允许平台差异独立演进 | 否则SDK或平台能力变化会穿透共享保护和其他安装。 |
| AG-BR-005 支撑有界安全恢复与只读追溯 | 否则故障、gap和材料缺失将诱导正文缓存、盲重试或虚假完整性。 |

### 7.2 不可变约束

| 约束 | 说明 |
|---|---|
| 不拥有内部或平台truth | 局部配置/relation/mapping/cursor/dedup/attempt/ref不能替代两端实体。 |
| 不将external_id视为GlobalMember或授权 | 主体kind、内部责任与当前basis分别成立。 |
| 不绕过适用Policy/Gate | 外显、入口与action分别获准，低敏感不默认审批。 |
| 不把阶段结果互作证明 | ACK、owner接受、Turn、平台结果和consumer接受分别解释。 |
| 不保存或观测禁止body/secret | DR017~020覆盖队列、错误、callback、所有日志及证据出口。 |
| 不将unknown当无效果 | timeout、lease失效/重启不允许换identity、target或盲发。 |
| 不通过query维护或修复truth | 读取不刷新source、推进cursor、改mapping或重放。 |
| 不让配置与依赖选择改变不变量 | runtime/event非package依赖，seam选择不能放宽owner、授权或材料边界。 |
| 不用设计资产伪造运行资格 | planned/ref/静态自检不等真实账号、投递、EV或signoff。 |

### 7.3 当前可接受取舍

| 取舍 | 当前口径 |
|---|---|
| 平台原生表达非等价 | 能力逐安装声明supported/degraded/unsupported；降级需owner允许且不换target。 |
| 自动恢复受能力限制 | 无权威来源/probe/无副作用依据时保manual/indeterminate，不放宽P0。 |
| 发现、卡片美化与批量配置 | 作为外围增强，不新增正式FR或正向前置。 |
| Workspace语境消费 | 条件分支，有独立owner读取依据的路径不强制经Workspace。 |

### 7.4 架构非目标

| 非目标 | 不展开原因 |
|---|---|
| 内部领域或平台truth系统 | 各正式owner和平台负责。 |
| 统一human认证/权限中心 | 入口和owning chain负责，Bridges仅消费basis。 |
| Chat/Console产品或跨平台广播 | 并行产品不作未停审输入；广播扩大当前受众/target边界。 |
| 平台正文备份、审批正文存储 | 与禁止正文和最小引用边界冲突。 |
| Runtime/Tools执行或evidence裁决 | 执行/治理/观察结果分别归相应owner。 |

## 8. 回填草稿

章2摘§7.1背景/驱动力/目标；章3摘§7.2~7.4三表及Step1稳定基线约束。无容器/选库/协议签名或SLA。

## 9. 待确认事项

BR-UP全保留；可收缩的是体验/无证据自动恢复，不是P0保护要求。

## 10. 门禁

自检：五目标为结构结果而非FR；九约束负向且有owner/对象边界；四收缩不削弱P0，五非目标不是TODO。分别回填章2/3；无虚构量化或产品选型。当前agent设计自检pass，仅允许Step3。

gate_status=pass；gate_reason=goals_constraints_tradeoffs_non_goals_distinct；next_allowed_action=read_step_03_then_create；source_files=Step1/00/SOP Step2/规范4.2~4.3；formal_backfill_allowed=after_step_16_three_level_gate；commit_required=false。
