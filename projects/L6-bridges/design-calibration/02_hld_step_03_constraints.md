# L6-bridges 02 Step 3：约束条件

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；SOP3/规范4.3；回填正式§3。开工：项目/flow当前Step3；前序输入已校准；通用纪律见flow§3。

| 计划项 | 状态 | 入口 |
|---|---|---|
| 前序读取 | done | §2 |
| 问题/诊断/取舍 | done | §3~6 |
| 结构化/复杂度 | done | §6~7 |
| 草稿/自检 | done / pass | §8~10 |

## 2. 本步输入

1/2；SOP3/规范4.3；前序Step问题回答/诊断/取舍/挂起及正式00/01有关章节；项目/flow门禁；通则/中间产物/真相源适用条款。

## 3. SOP 问题回答

1. 局部truth、安装与内部授权分离、typed scope/generation、独立阶段、no-body、unknown保守与query no-write直接限制对象/接口/状态。
2. 来源为00 BR001~024/DR017~020与01 ADR001~014，不追加没有来源的SLA/技术偏好。
3. actor到scope不得由external ID/mention解析，material ref不可由正文缓存兜底，lease不能作平台无效果证明。
4. “高内聚”“高可用”没有本仓结构判断，不列为约束；Rust语言、目录、DB并未在架构定案，不擅自补。
5. 后续每条约束须有落实点：relation guard、owner port、intent/attempt、cursor、query view或private resolver。

## 4. 当前文档问题诊断

如果把projection当授权、timestamp当cursor、签名当actor许可，typed对象也会保持错误语义。必须写出authority与失败边界，而不是只把对象字段改成typed ref。局部幂等摘要不能包含raw body hash来规避禁止材料。

## 5. 改动前后对比

| 输入的原则 | 本Step具体约束 | 结构影响 |
|---|---|---|
| 所有权 | reference/basis与relation分开 | 不出现Turn/Decision本地factory |
| 独立阶段 | protocol/owner/effect/consumer各有记录 | 不设GlobalSuccess |
| 安全恢复 | 原effect和权威结果查询 | 不设timeout->retry默认边 |

## 6. 设计取舍

采用能约束后续对象/flow的硬规则表；不采用通则全文复述或技术产品偏好。复杂度单表，不拆附录、不画约束网络图。

## 7. 结构化中间产物

| 约束 | 说明 |
|---|---|
| truth/ref分离 | 配置、关系、记录本地化；Conversation/Turn、Identity、Gate/Decision、Artifact、Workspace和平台实体不出现本地truth factory。 |
| 主体与授权分离 | 安装认证不替内部basis；human/AI/Integration分支，external_id不建GlobalMember；basis缺失fail-closed。 |
| scope resolver先行 | relation、actor、source、material及查询subject/scope由明确owner/本地repository解析，不从ref字符串猜scope。 |
| generation隔离 | 旧排队在外呼前重核当前generation；撤销/暂停阻新动作，历史结果不重写。 |
| 阶段分离 | ACK、owner接纳、Turn、platform_accepted、consumer disposition不互证；unsupported/unknown各自保留。 |
| body-free持久化 | raw消息/附件、私有callback、敏感Gate/secret及可还原派生均排除；payload required digest仅owner安全材料合同供给，不算审计材料。 |
| effect不可变 | source/target/projection版本及operation kind固定；attempt追加，unknown只同effect权威probe/manual。 |
| cursor受源限定 | namespace/stream/epoch/comparator及coverage缺失不比较/关闭gap；protocol、owner、delivery位置分开。 |
| retry有资格 | 无副作用依据、当前basis、lane/bucket下界、预算及窗口共同成立才续交；SDK不得自行重试。 |
| query严格只读 | 只解析当前读取资格和既有视图；不写idempotency/audit、refresh/repair/cursor/replay。 |
| producer真实边界 | mutation安全追溯与交接intent有唯一来源；没有canonical payload不发明outbox，consumer接受只能来自真实结果。 |
| 配置不可越权 | config/secret/路由只能装配已讨论port，不改变上述不变量；产品均未选。 |

## 8. 回填草稿

正式§3摘录§7约束表，来源由Step1/00/01声明承接；后文每条须能指向对象/接口/状态guard。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only；本Step不关闭上游。

## 10. 进入下一步条件

约束均有00/01来源和结构影响，无新增技术/SLA/owner。自检pass；gate_status=pass；gate_reason=structural_constraints_closed；next_allowed_action=step_04_framework；source_files=§2；formal_backfill_allowed=after_step14；commit_required=false。
