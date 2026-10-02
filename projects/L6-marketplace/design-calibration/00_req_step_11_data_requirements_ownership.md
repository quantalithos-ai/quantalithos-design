# Step 11. 数据需求与数据归属

## 1. 状态与计划

`pass / stop_review`；SOP Step11/规范 §4.11 已读。输入/九问/诊断/取舍 done；分类去重、草稿、自检 pending。回填 §11。

## 2. 输入

Step2/9/10、五能力附录数据与生命周期、owner 正式边界；全部 pending 承接，不新增本地外部 truth。

## 3. SOP 问题回答

1. C1～5 已逐节点停审，本步复核共同数据主语。
2. 本地真相：publisher relation/核验过程、申请/交接、listing/market version/分类、获取/分发、撤回/影响/通知、安全历史/恢复意图。
3. 快照：正式资格/来源、目录搜索、窄 entitlement、外部结果与影响读取摘要。
4. 引用：owner 不可变来源、subject/组织 verification/authority、材料、Gov、receiver、channel/audit 条件 archive。
5. 禁止正文：Method/Role/ProcessTemplate、Registry/Adapter、Image、Artifact/血缘、Identity、Gov/approval、secret/raw材料、财务/安装/归档 truth。
6. 生命周期：局部事实显式变更与历史保留；快照随来源失效/更新；引用不负责外部内容；正文不进入市场生命周期。
7. 支撑关系：各D编号最后列可回功能及BR，不新造 billing/order。
8. 数据缺口：source visibility/digest 和Gov binding属 owner contract，不能由“需要保存”推导具体字段。
9. 孤儿数据：持久收藏、评分、支付、外部 asset package 不纳入，scope/trace 仅后续正式 metadata 消费，不重复 shared carrier。

## 4. 诊断

C2 D203 和 C4/C5 摘要含引用/快照必须装配分行，不能给同对象两个 truth owner。draft listing“公开摘要”必须区分市场自有描述与 owner 内容摘要，digest 为 owner authority，不由复制内容后重算成为源 truth。

## 5. 对比

| 项 | 改前 | 改后 | 原因 |
|---|---|---|---|
| 外部摘要 | 引用/快照混列 | 引用和摘要分行 | ownership 唯一 |
| 商业状态 | entitlement/transaction 广义候选 | 只正式获取授权窄视图，transaction future | 防财务 truth |

## 6. 取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| truth/快照/引用/禁止正文四类 | 可核验来源与生命周期 | 后续 schema 需 typed 分离 | 采用 |
| 为搜索方便复制 source body | 检索易 | 第二资产真相/隐私泄漏 | 不采用 |

## 7. 结构化中间产物

| 能力 | 数据来源集合 | 归属审计 |
|---|---|---|
| C1 | D-MP-101～104 | publisher relation 是局部truth，验证结果只引用/快照，正文禁止 |
| C2 | D-MP-201～204 | 申请/listing/version 局部truth；D203 正式引用与安全快照分行 |
| C3 | D-MP-301～304 | 市场分类/metadata 局部truth，owner 摘要与索引非truth |
| C4 | D-MP-401～404 | 分发过程局部truth，资格/receiver outcome only source-backed view |
| C5 | D-MP-501～505 | 撤回/notice/audit/recovery过程局部truth，external body excluded |

### 正式回填唯一类别判定

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| publisher relation、核验与责任过程 | 真相数据 | 本仓拥有市场责任关联/核验过程，不拥有主体资质 | 显式建立、失效、追加纠错 |
| 发布申请/基线/review handoff | 真相数据 | 本仓拥有申请与交接过程 | 提交后固定，修订新依据，终止可追溯 |
| listing/市场版本上架状态/分类与市场自有metadata | 真相数据 | 市场拥有自己的目录与版本处置表达 | 显式变更/限制/撤回，不改变 owner version |
| 获取意图/分发关系/attempt/局部结果 | 真相数据 | 本仓拥有分发交接过程 | 请求到局部结果/未知/取消，保留历史 |
| 撤回/影响/通知计划与attempt | 真相数据 | 本仓拥有已知关系影响与尝试事实 | 撤回、计划、尝试和结果分别显式记录 |
| 安全审计历史/失败恢复意图与结果 | 真相数据 | 本仓拥有自己的变化与恢复过程 | 追加/纠错，不篡改旧历史 |
| owner类型/不可变ref/version/digest/visibility与资格引用 | 引用数据 | 正式来源归资产owner，市场仅关联 | 随引用建立/失效变化，不负责源正文 |
| 主体/组织验证/正式授权与材料引用 | 引用数据 | 验证/授权/材料由正式owner提供 | 失效重核验，不生成凭证 |
| Governance决定及依据引用 | 引用数据 | 正式批准归Governance | 过期/替代/撤销失去适用性 |
| receiver/channel/audit/条件archive结果引用 | 引用数据 | 外部结果归对应authority | 引用可变更/未知，不改外部状态 |
| 来源/资格/材料/Gov安全摘要 | 快照数据 | 正式真相不归本仓，只保留可见摘要 | 随来源更新/失效，不自证有效 |
| 可见目录搜索与选择摘要 | 快照数据 | 来源是局部市场事实与正式可见owner摘要 | 可失效/重建，不反写上架/资格 |
| 窄entitlement/receiver安全摘要 | 快照数据 | 正式获取资格和接收事实不归市场 | 来源变化或未知，非支付/授权truth |
| 影响/审计查询与freshness摘要 | 快照数据 | 来源是已提交局部事实和qualified外部摘要 | 可重建/失效，不自证外部完成 |
| 资产、Registry/Adapter、Artifact/血缘、Identity、Governance/approval正文 | 禁止保存正文 | 正式内容属于专项owner | 不进入市场生命周期 |
| secret、凭证、原始扫描/签名材料、raw log、财务/安装truth、archive包正文 | 禁止保存正文 | 不属于本仓真相范围 | 不进入当前生命周期 |

各行由五附录D集合摘录；拆分D203不新增数据。资产集合只关联已有版本引用，不能建立无owner可执行包正文。正文排除适用于写入/索引/事件/报告/日志/测试非fixture实材，不只是主数据。

复杂度：正式16行按类收束，细分21个D来源组保留附录，exact对象与schema后续03逐功能推导；不得因收束丢 owner或生命周期。

## 8. 回填草稿

摘录唯一类别表，保留五附录具体来源；不放 DB、typed字段、索引实现或 outbox 代码。

## 9. 待确认

保留owner契约缺口；retention/delete/归档授权无正式来源不能本地默认。00不定义表、索引列、secret位置或TTL。

## 10. 自检停审

所有16功能所需数据均有类别和生命周期；来源无双owner，引用和快照不混；禁止正文齐全，后续投影rebuild source约束已承接C3/C5。计划 done；`pass / stop_review`，允许 Step12。
