# L6-bridges 02 Step 1：上游输入边界

## 1. Step 状态与开工确认

full-restart / single-agent-serial；done / pass；对应概要SOP Step1、规范4.1；回填正式§1。
项目授权pass、flow当前Step1、当前骨架done；通则/中间产物/真相源和概要SOP/规范已读取，来源复核见项目台账§8。只允许当前Step，不允许正式写入。

| 计划项 | 状态 | 产物入口 |
|---|---|---|
| 输入及前序读取 | done | §2及项目台账§8 |
| 问题回答/诊断/取舍 | done | §3~6 |
| 结构化/复杂度 | done | §6~7 |
| 回填/自检 | done / pass | §8~10 |

## 2. 本步输入

正式00全文、正式01全文及01 flow/Step16/Step5；00平台附录与Step15精确合同/状态；SDK03§3.3/7.3、Conversation03§7.2/7.4/10/12、Identity01§4、Governance03§7/10/11、Artifact03§6~10、Workspace03§1~5及台账、Observability03边界及实施台账；概要SOP1/规范4.1。未读取旧02作输入。

## 3. SOP 问题回答

| SOP问题 | 回答 |
|---|---|
| 1 承接需求？ | 00五能力、16FR、24BR、20DR、16NFR及38AC/6VETO；不重写编号或验收条件。 |
| 2 承接架构？ | 单一局部BC、U1~U6、typed adapters、当前basis/generation、stage/effect/cursor分离、混合通信、body-free与no-write。 |
| 3 哪些稳定？ | owner归属、允许局部truth、必要拒绝/未知/人工出口、按安装隔离与未选产品边界；可继续转成代码主体骨架。 |
| 4 哪些不能直接展开正向能力？ | material/actor/展示/action/附件/read-export/producer/secret/平台pin与结果probe兼容尚缺；可定义本仓port需求，但不能声称上游已提供同名方法。 |
| 5 不该展开哪里？ | owner与平台truth、完整schema/DDL/函数实现、运行账号/凭证/测试证据、Chat未停审入口及产品路线。 |

## 4. 当前文档问题诊断

输入中最易误读的三处：Conversation已有bridge语义但不证明安全材料owner已闭合；Integration是来源actor而非human授权；SDK可信context透传不认证、其runtime技术幂等也不提供平台exactly-once。上游03/07某些元信息陈旧，不覆盖当前台账，也不在本仓自行补签署。当前没有足够依据完成正向兼容声明，必须先固定局部结构与拒绝边界。

## 5. 改动前后对比

| 项 | 输入线索 | 02承接口径 | 理由 |
|---|---|---|---|
| 架构语义 | 六单元/引用维度 | 可转代码主体，不能复制owner实体 | 不重分truth |
| 正向合同 | 名称/台账状态存在 | 每个未核验分支挂起 | 文件/commit不证明Bridges兼容 |
| 历史正文 | 旧02仍存在 | 尚未作为输入；独立结论后另扫描 | full-restart |

## 6. 设计取舍

采用“正式本仓基线+已存在owner语义+明确未绑定port需求”输入分层；不采用把上游文件齐全当已联调，或从旧02提炼对象。前者减少误授权且可继续安全设计，代价是实际adapter仍需后续资格核验。复杂度为单一来源表，不拆模块；本章禁止图，结构关系留Step4。

## 7. 结构化中间产物

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| 本仓00§7~14 | 五能力、FR/规则/数据/验收红线 | 局部对象与最小验证入口 |
| 本仓01§6~11/13/15 | 六单元、局部truth、typed adapter、阶段与恢复 | 六组成部分的service、port、协议、状态骨架 |
| SDK03§3.3/7.3 | actor/metadata透传、credential ref、no-write | 本仓metadata消费与资格化客户端seam |
| Conversation03§7.2/7.4 | target mode、Integration、BridgeMapped、digest、owner receipt | 入站本地记录与已有consumer兼容映射；材料/查询缺口挂起 |
| Identity01§4、Governance03§7/10/11 | AI锚点、owner裁决、responsibility/visibility、正式command/query | 主体kind、binding basis及action/展示资格port需求 |
| Artifact03§6~10 | intake/消费ref、version与no-write | 附件ref接入和有效性边界，具体外部附件合同待核 |
| Workspace03§1~5及台账 | 条件read model/provenance，现时裁剪与开放项 | 只读语境adapter，无授权或频道owner迁移 |
| Observability03及实施台账 | 安全材料、consumer分离和十二affected | 本仓body-free交接/读取，具体producer准入仍缺 |
| 全局依赖§4.1；00平台附录 | Layer5窗口、四平台差异与资料资格 | 产品中立seam与逐安装资格，不采Chat未停审内容 |

本文不再回答：仓定位、能力需求、owner/platform truth、架构BC/依赖/ADR、验收定义。

本文必须回答：主要代码主体、capability候选池、独立对象/typed mapping字段、五类接口与ports、inbound/outbound/callback关键flow、局部状态/幂等/cursor/lane、配置影响及详细设计承接。

暂不进入正向运行范围：BR-UP-001~009对应未核验owner/provider/installation合同；010无当前输入边。Identity与Artifact台账分别仍commit-08-c/commit-01-a的ready_for_design_gate；Observability仍pre_implementation_blocked/wait_design，十二affected原状态逐项入口为00 Step15§7.4；Workspace开放项不关闭。

## 8. 回填草稿

正式§1摘录§7来源映射与不再/必须回答清单，写明02只固定本仓可实现结构，未绑定的port是合同需求而非上游API。相关上游最新状态只作资格说明，不作为运行证据。

## 9. 待确认事项

BR-UP-001~009及010原姿态不变。

## 10. 进入下一步条件

来源资格/正式语义/实际实现分离，无新owner、对象或旧材料输入；五SOP问题均回答、来源表与深度边界一致。自检pass，允许Step2范围讨论；正式回填仍限Step14。gate_status=pass；gate_reason=upstream_boundary_explicit；next_allowed_action=read_step_02_then_scope；source_files=§2；formal_backfill_allowed=after_step_14_three_level_gate；commit_required=false。
