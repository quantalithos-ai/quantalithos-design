# Step 6. 逐模块对象实现契约

## 1. Step状态

状态：[x] completed；gate_status=pass_with_external_slots；current_batch=closed；formal_fill_allowed=false。Step5已通过，最新授权到Step10。仅设计契约，无实现/测试/commit事实。

### 批次与模块执行计划

| 批次 | 模块/产物 | 完整性 / 门禁 |
|---|---|---|
| 6A | contracts全局局部词汇、Core核验与外部缺口登记 | completed / local pass |
| 6B | domain七CP对象组，16对象逐卡片 | completed / local pass |
| 6C | application服务/操作上下文/读写能力对象 | completed / local pass |
| 6D | infra、api、worker、jobs非core对象 | completed / local pass |
| 6E | 字段/状态/后续承接与历史审计、回填 | completed / local pass |

每组先capability/输入输出/诊断/取舍，再类型/字段/函数/工厂/不变量，最后组内停审。必要拆同Step附录，不提前创建Step7。

## 2. 输入

[Step5](03_ddd_step_05_module_contracts.md)、[Step4](03_ddd_step_04_file_layout.md)、[02](../02-概要设计.md) §6~12、SOP Step6全条、书写规范§5.5/5.6、闭环标准字段/可选值/DTO构造/authority/sidecar/read-model identity条款、Rust英文源码规则。governance 03 Step6批次、shared、domain、service/infra/entry卡片及字段审计作粒度参考。

## 3. SOP问题回答

0. 先建本骨架/批次表，按批次推进，不把空骨架当完成。
1. 需要全局词汇：局部ID/version/state、结果/页/操作键；跨入口复用但不拥有跨域业务。
2. capability来自Step5七模块和02七CP。
3. 每capability以字段/构造/副作用/来源闭合；Query无write，维护只能局部原子。
4. 16领域对象之外补稳定carrier、service和入口对象，不增加新业务truth。
5. 稳定scope identity与临时resolution证据分开；query DTO与domain read value分开。
6. application操作上下文、stored result、只读能力和入口必须本步闭口；infra具体DB连接/HTTP客户端细节按Step7/11/14后置，不可将已知结果/可用性也后置。
7. 最终对象按各模块小节索引；不用一个全局对象表替代卡片。
8. 局部对象只保护本仓不变量，不造来源证明。
9. 每字段写类型、产生入口、optional/empty语义与不可猜来源。
10. 每成员签名具名输入/输出/副作用；异步service/ports完整callable由Step7承接。
11. 工厂的ID由获准本地生成器；版本由提交协议，不能把未提交版本当事实。
12. 状态沿02原名；新状态条件用sum type防可选组合缺字段，不添业务状态。
13. 每variant有英文rustdoc、payload语义及来源/去向表。
14. 每组自检capability/字段/状态/owner；外部缺口明确阻塞构造。
15. 最终字段审计覆盖shared、16对象、service、entry、infra carrier。
16. 最终状态审计覆盖投影/覆盖/局部意图/维护/响应，不给无状态对象加状态机。
17. Step7需完整resolver/source/read/atomic store、context构造与service/entry调用；Step8完整14入口字段，Step9流程、Step10穷举矩阵。

## 4. 诊断

02只有语义外部槽位：若把OwnerSafeReadResult等包装成String/JSON/Opaque或泛型成功体会伪闭合；必须在每个受影响字段标外部schema阻塞。Core部分共享定义实际存在，但不能将设计中的helper方法当已实现。分区key若包含resolution_ref会导致同一scope重复建立；同样cursor不能靠数值+1猜gap。

## 5. 前后对比

| 前 | 后 | 原因 |
|---|---|---|
| 02字段骨架/方法名 | 局部exact Rust片段、字段来源、工厂/成员与不变量 | 减少实现猜测 |
| shared语义名 | 已核验Core子集/本地定义/外部未闭合三类 | 不发明上游schema |
| 可选failure/baseline | 条件字段与状态组合校验 | 非法组合不能被保存 |
| service只名称 | 当前稳定字段/构造职责，完整ports由Step7命名承接（已完成回填） | 防止非core空心 |

## 6. 取舍

本地类型用private字段+验证工厂，外部未闭合符号保留具名blocked slot，不给可构造假schema/泛型成功逃生口。Rust片段是设计合同，不承诺独立编译；含blocked slot的对象/协议正向实现必须停在接缝，不允许实现agent补类型。表中pass仅表示本步本地设计与缺口登记已完成。

## 7. 结构化产物

| 附录 | 覆盖 | 批次审查 |
|---|---|---|
| [6A](03_ddd_step_06a_shared_contracts.md) | Core实际符号、局部typed值/enum/carrier、external slot | 局部完整；WS-UP不关闭 |
| [6B](03_ddd_step_06b_domain_objects.md) | 七CP、16对象及纯InboxProjector | 已修卡片排序；状态/字段/工厂逐组可查 |
| [6C](03_ddd_step_06c_support_services_entries.md) | domain support、context、七service、infra availability、六entry | 非core闭口/defer明确 |

| 跨模块字段组 | 来源审计 | 状态审计 | Step7承接 |
|---|---|---|---|
| ID/四版本/key/digest | IdPort/commit/稳定scope/canonical input | 四轴不比较 | IdPort、atomic outcome、lookup |
| source/scope/visibility | owner正式slot；不是public serde可信值 | 无workspace authorization状态 | ScopeResolver/OwnerRead/Visibility/SourceEvent ports |
| read/projection/Inbox/local | store快照和明确owner attention | Coverage、Attention、read分类分开 | read_snapshot/apply/attention resolver |
| recovery/generation/invalidation | owner baseline/current proofs/已有目标 | attempt与role/safety分轴 | RecoverySource/affected targets/atomic cutover |
| application/infra/entry | 显式DI、Core元数据、binding观测 | 无附加持久truth | 具名service/entry callable、adapter对应表 |

后置审计：参考governance的卡片和非core审查，不继承其truth repository/Outbox/publisher/handoff；旧候选对象只作污染输入。6B重排是文档结构修复，未更改owner。6C文件位置逐项对照Step4。

## 8. 回填草稿

正式§5按模块摘录附录对象卡、字段/函数/工厂/状态与不变量；§6只建索引。blocked slot、非core后续承接与Query无写能力必须保留，不装配正式03。

## 9. 待确认

WS-UP-001~008/006-S；shared Core helper差异逐项核验，不写owner文件。未闭合source字段/枚举不宣称完整可落码。

## 10. 下一步门禁

批次/跨模块字段/状态/历史审计完成；允许进入Step7。本地设计gate通过不代表外部slot可编译或正向实施就绪。Step7必须闭合完整callable；Step8 DTO；Step11/14持久化与技术装配。
