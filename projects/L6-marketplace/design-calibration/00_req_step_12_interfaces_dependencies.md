# Step 12. 接口与依赖

## 1. 状态与计划

`pass / stop_review`；SOP Step12/规范 §4.12 已读。输入/问题/诊断/取舍 done；能力输入输出与正式消费面资格审计、草稿、自检 pending。

## 2. 输入

Step6裁剪、Step9～11、五能力附录接口及pending；正式SDK client-only、Gov query、Artifact consumption、方法库受控消费、能力正式曝光、镜像logical-only、Observability安全材料、Archive source-authority边界。

## 3. SOP 问题回答

1. C1～5已逐节点审查，本步检查跨节点surface一致。
2. 提供来源/责任申明与资格查询、申请/处置与进展、可见目录/版本、获取/关系/receipt、撤回/影响/追溯/恢复能力。
3. 消费 owner版本/visibility/材料、publisher authority、Gov正式决定、receiver结果、channel/audit接收；不消费finance来假造当前商业结果。
4. 同步能力是受控变更/查询；外部审核/分发/notice/audit可能异步，unknown有独立状态。正式事件未授权不启用，不 invent topic。
5. 输入是真实来源/依据；输出是市场过程/安全摘要及条件交接，不输出asset正文/approval/installed。
6. 所列核心输入输出必要，但“必要”不是可调用；Archive/支付/其他产品集成是future。
7. 类型承接Step6：Core/SDK package为编译，owner client runtime，事件经SDK且双方正式授权，禁止业务源码/私有L1直连。
8. 各IF/DEP挂对应FR详见附录最后列。
9. 无无功能接口；不发明统一PublishAsset、InstallAnything协议。
10. publisher auth、receiver、通知通道是Step6记录的能力缺口，不能因无正式项目名就忽略或虚构服务。

## 4. 诊断

旧00 §10接口不能证明SDK支持；查询返回ref不代表可判断approval；Artifact发行consumable ref不代表任意文件可上架；Member Images当前0 outbound/receiver pending不能假设发布事件。需要逐owner adapter资格矩阵而非“依赖SDK”一句话。

## 5. 对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| 接口定义 | API/包格式可用 | 需求能力面与支持资格分开 | 不私造protocol |
| 接入 | 任何服务可直连 | 官方SDK支持不足则路径blocked | 全局依赖规则 |

## 6. 取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 能力面主章+消费资格矩阵校准 | 精确区分需求和ready | 后续需要正式adapter闭口 | 采用 |
| 按名称直接猜DTO/调用 | 快 | owner binding不可证 | 不采用 |

## 7. 结构化中间产物

| 能力 | 对外接口集合 | 输入/输出依赖集合 | 功能完整性 |
|---|---|---|---|
| C1 | IF-MP-101/102 | DEP-MP-101/102 | FR101～103 |
| C2 | IF-MP-201/202 | DEP-MP-201/202 | FR201～203 |
| C3 | IF-MP-301～303 | DEP-MP-301/302 | FR301～303 |
| C4 | IF-MP-401～403 | DEP-MP-401/402 | FR401～403 |
| C5 | IF-MP-501～504 | DEP-MP-501～503 | FR501～504 |

共14个IF能力边界与11个DEP来源组；查询/变更/事件/后台按附录语义，正式表不重复Step6仓表。

### SDK / owner adapter 资格矩阵（不是自定义上游协议）

| 所需来源 | 当前正式读取依据 | 已确认上限 | 尚缺 / 失败姿态 |
|---|---|---|---|
| 方法/模板/角色 | 方法库00 §11、03受控消费与formal version要求 | 三类正文owner与消费边界明确 | exact type映射、不可变digest/visibility与market receiver binding未确认；不复制body |
| 能力 | Hub03 FormalExposure/ControlledConsumerView/只读生态summary | 独立registry/exposure owner | 不可变发布版及market绑定/SDK支持未确认；summary不是listing |
| 镜像 | Images03 §7 ResolveInstantiableEntry、GetProvenanceAndEligibility | pinned supply/来源与资格是owner事实；逻辑读取面 | 传输/consumer合同pending、0outbound；不猜download/发布事件 |
| 制品/材料 | Artifact03 §7及Step8发行消费ref、版本查询 | truth anchor+consumer scope与版本读取 | 完整材料kind/digest/visibility/public binding仍须owner确认；不把任意digest当asset |
| 治理 | Gov03 §7、Step8 GetGateDecision、Step6 DecisionSummaryView | 可读decision/gate/basis ref及surface | 缺public approval outcome与market基线完整binding；流状态冲突MP-SRC010；不放行 |
| AI身份 | Identity00 §2/4 | GlobalMember AI身份摘要 | 不提供人类/组织认证；publisher owner pending |
| SDK | SDK03 supported/fake/pending/unsupported模型 | 客户端语义，不是server facade或approval owner | 各来源exact capability支持/版本未qualified；不私连L1 |
| 观测审计 | Observability00边界及03安全材料/事务 | body-free观察/审计交接 | market producer admission/schema/redaction/receipt未确认；local history≠accepted |
| 归档 | Archive00 §11/03 §2 | 正式owner source与restore handoff | source matrix没市场，不启用market lane/restore |
| publisher authority / receiver /通知 | 用户范围与必要能力 | 知道必需且不能由市场own truth | 没正式owner/contract；pending，不能虚构API/schema |

以上是必要承接检查而不是声明已全文阅读全部上游实现。来源名称存在并不完成schema、版本、scope、调用、失败或SDK支持闭环。

复杂度：正式主章仅能力接口和依赖表；精确读取资格留矩阵，不新造协议。03必须逐IF落public command/query/event/job、owner adapter、支持state、resolution/ref-set/error、fake/durable parity，正式合同缺失的正向面planned/blocked；未闭口不能让实现自行补API。

## 8. 回填草稿

§12按规范固定接口类型/名称/说明/层级及依赖方向/类型/关联方/全局类型/说明/层级，摘录五附录IF/DEP；missing owner写明确未绑定，Gov internal函数名只留本校准。

## 9. 待确认

exact owner type/ref-set/visibility/digest/decision/receiver/SDK支持均pending，不能用接口名称存在性关闭。未授权事件只能保留条件型要求。

## 10. 自检停审

14IF、11DEP有16FR来源；与Step6运行/编译/条件事件一致；无正式API/DTO/port名泄漏主章，unknown有数据及验收承接。计划done；`pass / stop_review`，允许Step13。
