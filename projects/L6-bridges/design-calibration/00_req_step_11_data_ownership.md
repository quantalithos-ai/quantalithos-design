# L6-bridges 00 Step 11：数据需求与归属

> 状态：done / pass；回填00 §11；full-restart。

## 1. 状态与 Step 内计划

开工确认：六标准、台账/flow、Step2/9/10与五卡、需求SOP Step11及书写规范§4.11已读；进入条件pass。C1~5逐组先分类真相/快照/引用/禁止正文，再检查FR挂载与生命周期；不写DDL、存储或最终schema。

| 单元 | 思考 | 写入/自检 |
|---|---|---|
| C1 配置/绑定/关系/能力与授权ref | done | done / pass |
| C2 接管与owner结果ref | done | done / pass |
| C3 intent/receipt/材料及附件ref | done | done / pass |
| C4 验证/重放与owner动作ref | done | done / pass |
| C5 cursor/dedup/recovery/handoff与全局禁止项 | done | done / pass |

## 2. 输入

Step5附录§3语义维度；五卡局部数据；24规则。正式owner分别是Conversation、Identity、Governance、Artifact、Workspace与平台本体；secret正文属于受权provider，不以opaque ref证明可访问。

## 3. SOP 逐项问题回答

Step17 preflight补审：此前本节合并成段落，现逐项核对已校准归属；20DR/四类型/生命周期及下游不变，不冒称初稿已逐项。

| 问题 | 已校准回答 |
|---|---|
| 当前讨论哪个节点？ | 按C1~5逐组归属，C1配置/绑定、C2入站、C3效果、C4回调、C5位置/恢复及全局禁止，主组见§7。 |
| 哪些本仓拥有truth？ | DR001~003配置/relation/mapping，DR007局部验证交接，DR009intent/attempt/receipt，DR012回调验证，DR014~016cursor/dedup/recovery/handoff局部记录。 |
| 哪些只是snapshot？ | DR004带来源与版本的最小平台能力摘要，不代表平台truth或当前授权裁决。 |
| 哪些只是ref？ | DR005/006责任/权限及opaque secret，DR008 owner accepted结果，DR010/011source/材料/附件，DR013owner action/Decision结果。 |
| 哪些禁止保存正文？ | DR017内部truth正文、018平台body/完整附件、019secret/token/OAuth/私有callback/URL、020敏感审批与未获准存在性。 |
| 生命周期怎样表达？ | 局部变化显式版本/basis；ref按owner有效性、scope/读取资格、expiry/撤销受限；去重/审计受获准窗口与预算，不永久保存或隐式refresh。 |
| 数据支撑哪些FR/规则？ | C1 DR001~006支撑FR001~003；C2 DR007/008及共享003/005/010/014/015支撑004~006；C3 DR009~011支撑007~009；C4 DR012/013支撑010/011；C5 DR014~016支撑012~016；四禁止项和BR021贯穿全仓。 |
| 有无功能所需数据缺归属？ | 既有FR所消费的局部状态、safe材料/ref、basis、cursor/effect均有归属；材料owner/准入合同缺失是BR-UP受限，不用“ref字符串”或raw缓存补truth。 |
| 有无无来源数据项？ | 无；每项来自FR/BR或G001/002/005的边界；结果ref和本地receipt不混归，shared ref不重定义owner。 |

## 4. 诊断

旧00 §9.1/9.2把owner实体和本地桥接对象放在同一核心实体/关系图，虽标注归属域，却未完成真相/快照/引用/禁止正文四分；§9.3长期metadata及平台投影归档未明确正文与局部记录的隔离。不能从这些旧项推导raw body或审批正文准入；安全snapshot不是授权裁决缓存，raw error不属于safe receipt。

后置定位：旧00 §9.1/9.2列Conversation/Turn/GlobalMember实体及双向关系，§9.3有长期metadata/平台投影归档，§9.4列KMS/OAuth和external account。当前废弃本仓完整实体/正文归属与永久留存推论，保最小关系、局部记录、正式refs与禁止正文；KMS/OAuth仍seam非已选产品。

## 5. 前后对比

正文副本/永久URL/凭证 -> 正式材料引用与不可用状态；平台/owner结果truth -> 独立ref与局部观察记录；无限回放 -> 获准窗口与缺口。

## 6. 取舍与复杂度

采用20数据项、固定四列与五组挂载审计；详细mapping语义继承Step5附录，不在正式数据表展开字段。不采用“为了重试保存raw payload”或“ref失效就自己补正文”。单文件分批够用；最终03必须按此owner/ref规则闭合schema，不交实现者猜测。

## 7. 结构化中间产物

### 7.1 C-BR-1

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| DR-BR-001 桥接配置版本 | 真相数据 | 本仓拥有平台接入、能力选择、路由约束和secret引用配置的局部真相 | 显式建立、校验、激活、暂停或替换，不证明平台安装成功 |
| DR-BR-002 经授权external-binding relation | 真相数据 | 本仓拥有绑定关系，不拥有其授权依据truth | 从正式建立到暂停、撤销或失效，均保可追溯变化 |
| DR-BR-003 identity/channel/message/thread mapping关系 | 真相数据 | 本仓拥有经授权的引用映射，不拥有映射两端实体truth | 随binding及明确映射操作变化，失效不得自动换目标 |
| DR-BR-004 平台能力安全快照 | 快照数据 | 平台事实不归本仓，仅保来源/版本明确的最小能力摘要 | 随已核验平台合同变化，stale不能默认证明当前支持 |
| DR-BR-005 actor/visibility/Policy/Gate依据引用 | 引用数据 | 本仓只保存正式责任与权限依据ref，不形成认证或裁决truth | 随owner版本、资格、撤销或有效期变化，未知限制消费 |
| DR-BR-006 opaque secret/provider引用 | 引用数据 | 本仓只保provider管理的secret ref/版本，不保secret正文 | 随正式解析资格、轮换、过期或撤销变化 |

停审：FR001~003数据成立；human账号未归Identity认证；Workspace不是授权truth。

### 7.2 C-BR-2

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| DR-BR-007 入站验证、来源、ACK与交接disposition | 真相数据 | 本仓拥有adapter-local处理记录，不拥有内部提交truth | 从安全接管/拒绝到明确结果或待对账；ACK与处理位置独立 |
| DR-BR-008 内部accepted fact/manifestation及result ref | 引用数据 | 本仓只引用Conversation正式结果，不把本地metadata称作Turn | 随owner结果引用可用性变化，不本地重建或删除owner事实 |

停审：FR004~006复用DR003/005及C5幂等/cursor；safe payload/projection来源统一复用DR010，缺owner合同不保存正文。

### 7.3 C-BR-3

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| DR-BR-009 delivery intent/attempt/receipt | 真相数据 | 本仓拥有外部投递尝试与已知结果的局部记录，不拥有平台消息truth或读达 | 从受权准备到已知结果、阻塞或未知对账，历史不被重试抹去 |
| DR-BR-010 committed source与allowed material/projection ref | 引用数据 | 本仓仅引用正式source/材料owner管理的安全消费材料，不保正文 | 随引用建立、source版本、权限、过期或删除变化；失效限制交付/恢复 |
| DR-BR-011 Artifact/attachment可消费引用 | 引用数据 | Artifact正文/版本归Artifact，平台附件truth归平台，本仓只保获准安全ref | 随访问、传播资格与有效期变化，不形成永久公开正文 |

停审：FR007~009不持payload/附件；mapping回指DR003，授权回指DR005，secret回指DR006。

### 7.4 C-BR-4

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| DR-BR-012 callback验证与重放记录 | 真相数据 | 本仓拥有adapter-local验证/one-use结果，不拥有审批truth | 从验证到拒绝、过期、交接或重复结果，不保存私有token/context |
| DR-BR-013 owner action/Gate/Decision结果引用 | 引用数据 | 本仓只引用owner正式动作结果，不自行产生Decision | 随正式结果可用性与当前读取资格变化，unknown保持待对账 |

停审：FR010/011的source message关系复用DR003/009，actor/action依据复用DR005。

### 7.5 C-BR-5及全局禁止

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| DR-BR-014 source/processing/delivery cursor与gap | 真相数据 | 本仓拥有自身处理位置与缺口，不拥有平台或Bus完整性truth | 仅在可比较namespace/epoch内受控推进或证明覆盖，不越gap complete |
| DR-BR-015 去重结果与稳定effect关系 | 真相数据 | 本仓拥有获准operation的去重与局部effect关联 | 同语义复用、冲突隔离，超过获准重放覆盖范围不得自动重放 |
| DR-BR-016 recovery、audit handoff与safe diagnostic局部记录 | 真相数据 | 本仓拥有adapter-local恢复/交接记录，不拥有Observability接受或证据裁决 | 显式建立与处置，消费结果须真实回指；遵安全留存与预算 |
| DR-BR-017 内部Conversation/Turn、Identity、Governance、Artifact、Workspace正文truth | 禁止保存正文 | 内部正文不属于本仓truth，本仓不得持久化为私有副本 | 不进入本仓正文生命周期 |
| DR-BR-018 外部原始消息、事件body与完整附件 | 禁止保存正文 | 外部平台正文不属于本仓truth，只可在获准瞬时adapter转换/交接中处理 | 不进入本仓durable或观测正文生命周期 |
| DR-BR-019 raw secret/token/OAuth code、私有callback context与tokenized URL | 禁止保存正文 | 私有凭证材料不归本仓，不能成为配置、mapping、receipt或证据正文 | 仅private seam瞬时使用，不进入本仓durable/日志/证据生命周期 |
| DR-BR-020 敏感Gate/审批内容与未获准的存在性信息 | 禁止保存正文 | 敏感治理材料不得成为外部payload或本仓观测/证据正文 | 不进入本仓外显及观测生命周期 |

停审及跨组审计：16允许项中只有桥接配置/relation/cursor/dedup/effect/adapter-local记录属于本仓；快照/引用不变owner；四禁止项覆盖内部、平台、凭证、审批。所有FR使用数据有归属，shared ref不跨节点重复造truth。

### 7.6 引用失效与安全读取

ref必须有可解释owner、scope、版本与读取资格；“有字符串”不等可解析。missing/revoked/expired/stale/incomparable分别表达，不能用空body、默认摘要、缓存或猜测target掩盖。允许更新局部失效标记的维护是显式操作；普通query只读既有状态，不向owner写入或暗中恢复。附件下载/回调token URL只能在private seam使用，durable mapping保存非secret locator/ref。

## 8. 回填草稿

正式§11采用§7.1~7.6归属结论；Step5附录§3作为mapping语义下限延伸阅读，不把具体DTO/表结构加入正式本章。

## 9. 待确认

BR-UP-001/002/003/004/005/006/007/009：source material owner、版本/权限/重解析面和留存basis未闭合，相关消费blocked。

## 10. 进入下一步条件

自检：20项四类型齐全，五组数据与FR可回指，生命周期与失效口径明确；未保存正文、凭证或第二授权truth。允许Step12。

Step17补审自检：九问题逐项及具体旧章节齐全，20DR定义/归属/下游映射未变；只补审查记录，不在本Step新增schema/表或材料owner。

```text
gate_status = pass
next_allowed_action = read_step_12_then_capability_interfaces
commit_required = false
```
