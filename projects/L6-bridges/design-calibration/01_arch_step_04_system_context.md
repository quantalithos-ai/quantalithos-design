# L6-bridges 01 Step 4：系统边界与上下文

> full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工：Step3 pass；已读Step1~3、00§6/12、SOP Step4与规范§4.5。单一系统上下文单元；骨架/思考先落盘，图/表后写，平台组仅压缩图面不合并truth。

| 单元 | 思考 | 写入 | 自检 | gate_status / 下一动作 |
|---|---|---|---|---|
| 正式外部关系 | done | done | done | pass / read_step_05 |

## 2. 输入

七专项owner、core/SDK入口与四平台正式依赖；条件Bus/Workspace、未选secret resolver，Chat reference_only。

## 3. SOP逐项问题回答

| 问题 | 回答 |
|---|---|
| 全局位置？ | Layer5产品/分发并行窗口中的外部协议适配面，不是内部业务服务或Chat附属。 |
| 正式上游？ | SDK/core语义、Conversation材料/目标、Identity AI锚点、Governance现行依据、Artifact附件；Workspace只读分支。 |
| 正式下游？ | Conversation受权来源、Governance已验证责任动作、四平台受权交付、Observability安全材料。 |
| 外部输入面？ | 平台验证来源/消息变化/interaction及效果观察，owner已提交引用/读取依据，获授权secret解析能力。 |
| 外部输出面？ | 受权材料/动作交接、安全表达、独立局部结果及审计材料，不形成owner真相。 |
| 正式边界对象？ | 主图SDK/Governance/Conversation/四平台/Artifact/Observability；Identity/Workspace/Bus/secret为配表中的重要条件关系。 |
| 失效如何降级？ | 缺当前授权或secret fail-closed；缺必要材料blocked；平台失效保原intent及unknown；条件Workspace仅阻该分支；审计强制准入不足限制操作。 |

## 4. 当前材料诊断

角色、文档和接口名不能入系统图；未建立human gateway/产品路由不能画为现成入口。图面关系不表达同步/异步顺序，core的编译关系留Step7。

## 5. 前后对比与历史扫描

旧01§4.1起始图画external users/bots/admins，且头部把L5-chat作关联正式输入。当前移角色到需求，Chat无输入边；完整旧图只作后置差异核对，不直接继承。

## 6. 取舍与复杂度

采用六组关键关系主图+完整配表，未采用全27仓图、角色图或协议时序图。四平台并列仍逐adapter独立资格；不新增统一auth或材料provider。复杂度一文件分批足够。

## 7. 结构化中间产物

### 7.1 系统上下文图

#### 系统上下文图: L6-bridges

```text
                      +---------------+       +----------------+
                      | L0-sdk        |       | L1-governance  |
                      +-------+-------+       +--------+-------+
                              | input                 | input/output
                              v                       v
+------------------+    +-------------------------------+    +---------------------+
| L1-conversation  |<-->| L6-bridges                    |<-->| Slack / Mattermost  |
+------------------+    | external protocol adapter BC  |    | Telegram / Discord  |
                        +----+--------------------+-----+    +---------------------+
                             ^                    |
                             | input              | output
                      +------+------+     +-------v----------+
                      | L1-artifact |     | L4-observability |
                      +-------------+     +------------------+
```

图示说明：

- 该图仅表达本仓与正式上下文对象之间的边界关系与输入/输出方向，不表达接口、事件、实现组件或运行时顺序。
- Artifact为附件分支依赖；四平台只是图面并列，不成为统一平台truth；`<-->`表示双向输入/输出。
- Identity、Workspace、Bus和secret能力见配表，缩图不删除其边界或资格限制。

### 7.2 上下游与输入/输出面

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| L0-sdk / L0-core | 来源到本仓 | 输入 | 正式客户端与共享语义 | 不承接服务端auth或业务truth。 |
| L1-conversation | owner到本仓 | 输入 | 对话目标、已提交事实及安全材料依据 | 缺兼容/材料合同blocked，不自产Turn。 |
| L1-conversation | 本仓到owner | 输出 | 受权外部协作材料与来源 | 平台ACK不表示其接纳。 |
| L1-identity | owner到本仓 | 输入 | AI身份锚点及状态引用 | 非human登录或审批授权。 |
| L1-governance | owner到本仓 | 输入 | 当前责任、Policy/Gate及外显/action依据 | 无依据不外显/执行。 |
| L1-governance | 本仓到owner | 输出 | 已验证且受权动作责任交接 | 只有owner形成Decision。 |
| L1-artifact | 本仓依赖owner | 依赖 | 附件准入与授权可消费ref | 必要附件不可用阻塞，不能公开补偿。 |
| L1-workspace | owner到本仓 | 输入 | 带owner provenance的只读语境 | 条件分支，不是权限或频道owner。 |
| L4-observability | 本仓到consumer | 输出 | body-free安全追溯材料 | consumer接受与本地handoff独立。 |
| L0-bus | 本仓与传输边界 | 输入/输出 | 条件正式事件协作载体 | 条件分支，不改变传输truth。 |
| Slack、Mattermost、Telegram、Discord | 平台到本仓 | 输入 | 分安装可信协作来源与效果观察 | 无有效安装/capability不可接管。 |
| Slack、Mattermost、Telegram、Discord | 本仓到平台 | 输出 | 获准表达与交互协议反馈 | 内部commit不证明平台接受。 |
| 获授权secret resolver | 私有边界到本仓 | 输入 | opaque ref的private解析能力 | provider未选/未建立，不把raw secret变局部truth。 |

### 7.3 失效与边界说明

| 失效面 | 当前受限姿态 |
|---|---|
| 身份/责任/visibility/Policy/Gate依据失效 | fail-closed；禁默认授权/切目标。 |
| 必要source/material/Artifact ref缺失 | blocked/missing_source；禁durable body补恢复。 |
| 平台/secret/能力版本不可用 | 对应安装暂停/blocked；已发效果未知保indeterminate。 |
| Workspace条件消费不可用 | 只限制该分支，有独立正式owner依据的路径不强制停用。 |
| 审计consumer/准入不足 | 仅获准安全有限backlog；强制准入不足限制相应操作。 |

本仓在Layer5并行窗口独立适配外部协作协议，来源与效果分别回链正式owner和平台。主图收缩的是画面，不是依赖或安全边界。L5-chat未停审材料不进入正式输入，也不成为审批入口前置。未选secret provider和未建立human/路由合同不因出现在配表而被判定可用。

## 8. 回填草稿

章5摘§7.1~7.3，不引入角色、接口/事件名、内部模块或调用顺序；失效表属于边界解释不是最终错误enum。

## 9. 待确认事项

全部BR-UP继承；secret能力仅seam非已选产品，human入口/受控URL未建立则不画成正式入口。

## 10. 门禁

Step16装配复核：关系类型列按规范统一为输入/输出/依赖，方向列与其分开；未新增对象或协作边。图按本表重组并修复Artifact孤立连线、墙线和箭头表示，与正式§5一致；表示层复检pass，不关闭上游资格缺口。

自检：系统图中心仓/外部对象明确，无角色/文档/协议名；十三关系行承接00且未引Chat或虚构入口，条件关系不强制化；三条图说明与失败边界完整。当前agent设计自检pass。

gate_status=pass；gate_reason=context_relationships_self_reviewed；next_allowed_action=read_step_05_then_create；source_files=Step1~3/00/SOP4/规范4.5；formal_backfill_allowed=after_step_16_three_level_gate；commit_required=false。
