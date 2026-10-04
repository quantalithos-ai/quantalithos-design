# L6-bridges 00 Step 2：本仓定位与边界

> 状态：`done / pass`；回填正式00 §2；full-restart；无正式写入。

## 1. 状态与 Step 内计划

开工确认：已读六通用标准、需求SOP Step2、书写规范§4.2、项目台账/flow、Step1及专项owner边界。进入条件pass；只在本项目写入；问题/诊断/取舍先于结论；批次不是长度上限。

| 单元 | 问题/诊断/取舍 | 结构化 | 回填 | 自检 |
|---|---|---|---|---|
| 仓级定位 | done | done | done | pass |
| 相邻边界审计 | done | done | done | pass |

## 2. 输入

Step1；需求SOP Step2；书写规范§4.2；专项上游00 §2；Conversation03 §7.4；draft01。独立边界形成后扫描旧README/00。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 一句话定义？ | 外部协作平台协议适配层，职责主语是桥接局部状态而非业务事实。 |
| 单独成仓原因？ | 外部协议、权限、消息差异、效果不确定性和secret接入变化独立于内部truth owner；不能散落到各owner。 |
| 本仓不是什么？ | 不是对话、身份、治理、制品、工作区真相仓，不是外部平台数据仓、统一认证授权中心或聊天UI。 |
| 易混淆对象？ | Conversation/Identity/Governance/Artifact/Workspace/SDK/Observability、Chat、平台本体和ACK/commit/delivery。 |

本仓只拥有配置、经授权external-binding与mapping、cursor、去重/回放记录、attempt/receipt及adapter-local状态。这里只用于审查仓级定位，完整数据归属后移Step11。

## 4. 当前材料问题诊断

draft01把Workspace称为scope/visibility owner，与正式00 §2不一致；产品概览把平台用户与GlobalMember平铺，未区分human actor和AI身份；旧00假定低敏感Gate可直接审批、SDK语言和RPC可用。这些不是本章可承接的owner边界。

## 5. 前后对比

| 前 | 后 |
|---|---|
| “把Turn复制到外部平台” | 协议适配与效果跟踪，不拥有Turn |
| “Workspace授权/频道owner” | Workspace只读投影；授权回指owning chain |
| “平台ACK即操作完成” | 接收确认、owner提交、外部效果分开 |

## 6. 设计取舍与复杂度

采用独立适配层、最小局部状态；不采用跨平台统一业务truth或嵌入Conversation的协议模块。前者避免第二真相，后者隔离平台变化。正式本章只保留四字段边界表与短段，不搬入数据表、依赖或功能；复杂度可单文件处理。

## 7. 结构化中间产物

| 字段 | 结论 |
|---|---|
| 一句话定义 | `L6-bridges` 是 Slack、Mattermost、Telegram、Discord 的外部协作协议适配与桥接局部状态层。 |
| 本仓不是什么 | 它不是内部业务真相仓、外部平台真相仓、统一认证授权中心、聊天UI或跨平台广播中心。 |
| 边界对象列表 | 仓：L1-conversation、L1-identity、L1-governance、L1-artifact、L1-workspace、L0-sdk、L4-observability、L5-chat；系统：四个外部平台；概念：接收确认、内部提交、外部效果。 |
| 单独成仓原因 | 外部协议差异、授权映射与投递不确定性需要独立收束，不能反向定义内部领域事实。 |

本仓隔离平台协议变化与桥接局部状态。它最容易与Conversation的对话事实、Identity的成员身份、Governance的裁决和Workspace的只读投影混淆；这些边界必须分开，平台消息和桥接记录才不会形成内部或外部的第二真相源。

## 8. 回填草稿

正式§2逐字承接§7四字段表和短段，不增加功能、依赖或数据表；禁止先写正式00。

## 9. 待确认

来源协议、actor授权与安全读取合同仍按BR-UP-001~006处理；不影响仓级定位确定，不表示正向集成可执行。

## 10. 进入下一步条件

自检：四字段结构、类型标记、非职责及易混淆边界齐全；正式草稿无接口名、数据归属矩阵或能力展开；Workspace未被赋予授权truth。允许Step3，正向对接blocker不关闭。

```text
gate_status = pass
next_allowed_action = read_step_03_norm_then_create
formal_document_write_allowed = after_step_17_three_level_gate
commit_required = false
```
