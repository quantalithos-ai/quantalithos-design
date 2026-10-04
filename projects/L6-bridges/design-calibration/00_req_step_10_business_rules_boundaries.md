# L6-bridges 00 Step 10：业务规则与边界约束

> 状态：done / pass；回填00 §10；full-restart。

## 1. 状态与 Step 内计划

开工确认：六标准、台账/flow、Step2/7五卡/9、需求SOP Step10和规范§4.10已读；进入条件pass。C1~5逐组校准不变量、禁止、显式变化、边界、治理/审计约束，再跨组审计；不写实现校验或正式文件。

| 顺序 | 规则保护主题 | 思考 | 写入/审查 |
|---|---|---|---|
| C1 | ownership、basis、身份、撤销、secret | done | done / pass |
| C2 | 验证来源、ACK、材料、变化 | done | done / pass |
| C3 | committed/可见、敏感/附件、intent | done | done / pass |
| C4 | callback主体、owner动作、重放 | done | done / pass |
| C5 | 幂等、cursor、retry、恢复、审计、读取/留存 | done | done / pass |

## 2. 输入

五卡§4~7、16FR；用户禁止项；专项owner正式边界。原始外部marker不能决定回环判定，须可信source和本仓intent/locator关系；是来源映射保护而非新业务truth。

## 3. SOP 逐项问题回答

Step17 preflight补审：此前回答合并成段落，现对既有§7规则逐项展开；24规则及约束对象不变，不冒称原稿已经逐项。

| 问题 | 已校准回答 |
|---|---|
| 当前哪个能力节点？ | 按C1~5保护FR001~016，规则主组及共享全局保护见§7，不换能力结构。 |
| 哪些不变量始终成立？ | 受权关系、可信来源、ACK/owner/effect/consumer阶段独立、稳定effect、分namespace去重、可比cursor及query no-write。 |
| 哪些行为禁止？ | 自动建身份、正文/secret持久化或观测泄露、默认审批、unknown盲重试、换target/effect及反写owner/platform truth。 |
| 哪些变化必须显式？ | 配置/binding/mapping版本、暂停撤销、cursor/gap覆盖和恢复均有明确basis，不能从cache/按钮/timeout隐式发生。 |
| 哪些边界不能打穿？ | owner truth、人类认证/AI锚点、平台truth、敏感存在性/正文、附件准入及本地handoff/证据归属。 |
| 哪些操作有治理/审计/引用条件？ | binding、入站、外显/附件、callback、probe/recovery及安全读取各有actor/target/action/当前basis；关键局部变化有body-free审计与真实消费结果。 |
| 规则保护哪些FR？ | C1 BR001~005保护FR001~003；C2 BR006~009保护004~006；C3 BR010~013保护007~009；C4 BR014~016保护010/011；C5 BR017~024保护012~016并贯穿相关副作用。 |
| 有无无来源规则？ | 无；每条在约束对象列关联FR或G001，所有禁止项来自用户边界和五卡，局部缺口不被规则伪装为source读取面。 |
| 足以阻止串仓/隐式变化吗？ | 是；五组及跨组复核未引入owner写入或授权provider，撤销限制新效果但不抹历史，unknown始终不等无副作用。 |

## 4. 诊断

旧00角色勾选、低敏感简化审批及留痕口径未说明当前actor/action责任和consumer真实接受；缺未知结果、撤销竞争、gap和query no-write。旧§12.2仅将敏感Gate kind留为待确认，不能由adapter本地枚举替代owner分类。

后置定位：旧00 §4权限矩阵、§8.1/8.2低敏感卡片及GlobalMember回链、§9.3长期bridged记录、§11.1/11.3审计/完成口径。修改身份等同、默认动作及永久留存/留痕充分假设；保留治理与审计主题但由本Step§7既有规则约束，不新增敏感Gate kind枚举。

## 5. 前后对比

默认低敏感审批 -> 外显与action分别有正式依据；retry优化 -> effect continuity不变量；全量留痕 -> 允许材料白名单；单external ID -> namespace/source关系。

## 6. 取舍与复杂度

采用24规则，分五组按四列模板，FR挂载放约束对象列；不采用对象字段校验、HTTP状态或数据库约束替代业务规则。当前规模单文件分组足够，后续数据表不重复创造规则。

## 7. 结构化中间产物

### 7.1 C-BR-1

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-BR-001 | 边界约束 | 本仓仅拥有桥接局部状态，不读写内部owner私表或宣称拥有平台truth | 全部FR；G-BR-001 |
| BR-BR-002 | 治理约束 | 平台安装与内部显式binding授权分别成立，主体/目标/方向/action/有效性必须可验证；未知fail-closed | FR-BR-002、003及外部操作 |
| BR-BR-003 | 禁止行为 | external_id、显示名称、mention或bot账号不得自动创建GlobalMember、推导参与/可见性或审批资格 | FR-BR-003 |
| BR-BR-004 | 显式变化 | 配置、binding、mapping与撤销均有明确版本/依据；当前撤销必须阻止旧排队操作，不能静默改目标 | FR-BR-001、002、003 |
| BR-BR-005 | 禁止行为 | 凭证只保opaque ref/版本，raw token/secret/OAuth code仅在private seam；失效不可默认回退其他身份 | FR-BR-001及全部adapter |

停审：只有局部关系变化；没有认证owner或默认管理员全权。

### 7.2 C-BR-2

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-BR-006 | 不变量 | 入站/回调先验证平台来源；来源标记与回环只信获验证来源及本仓映射，不信客户端自报marker | FR-BR-004、010 |
| BR-BR-007 | 不变量 | transport ACK、owner accepted/ref、内部Turn存在/执行结果分别解释，ACK不得证明内部提交 | FR-BR-004、005 |
| BR-BR-008 | 边界约束 | bridge target mode承接Conversation正式语义，Integration source actor不替代human责任；缺safe材料owner/ref合同不得交接正文或冒称可靠接管 | FR-BR-004、005 |
| BR-BR-009 | 不变量 | edit/delete/thread变化回指原消息及可解释source version；不支持不伪装新发言，不以外部delete抹内部truth | FR-BR-006 |

停审：来源、接管、事实接纳与变化分别保护，无“提交Turn”新合同。

### 7.3 C-BR-3

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-BR-010 | 治理约束 | outbound必须来自committed source，并在派发前核对当前binding、受众visibility与适用Policy/Gate；投影不能作为授权truth | FR-BR-007、009 |
| BR-BR-011 | 禁止行为 | 敏感Gate正文不得进入外部payload；安全提示、Gate存在性、入口与action分别获准；低敏感不默认可操作 | FR-BR-007、011 |
| BR-BR-012 | 边界约束 | 附件只经Artifact正式准入/访问/传播ref交接；必要附件不可用时阻塞，可省略须owner明确允许 | FR-BR-008 |
| BR-BR-013 | 不变量 | intent的source/target/binding/projection语义与effect identity不静默替换；内部commit不等外部结果，platform_accepted不等用户已读 | FR-BR-009、014 |

停审：展示/传播/操作授权与交付结果分开，无永久公开URL或动态换目标。

### 7.4 C-BR-4

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-BR-014 | 治理约束 | callback必须绑定installation、actor责任、source message、target/action、当前owner状态和时效；context/签名不能自授权限 | FR-BR-010 |
| BR-BR-015 | 边界约束 | 回调只交接owner正式动作；不得本地批准Gate、写Decision或直接执行Runtime/Tools | FR-BR-011 |
| BR-BR-016 | 禁止行为 | 伪造/过期/跨目标/已撤销回调不可执行，重复不产生新效果；HTTP/deferred response不证明Decision，结果回显也遵当前读取资格 | FR-BR-010、011 |

停审：owner决定与平台反馈分开，无默认外部审批。

### 7.5 C-BR-5

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-BR-017 | 不变量 | 各operation namespace独立，同键同语义复用结果、不同语义隔离；重放/重启/轮换不能重造logical effect | FR-BR-012、014 |
| BR-BR-018 | 显式变化 | cursor只在正式可比较stream/epoch内推进；协议checkpoint、owner处理和效果位置分开；gap须权威覆盖依据才关闭 | FR-BR-012、014 |
| BR-BR-019 | 禁止行为 | unknown、timeout或lease失效不证明未发生效果，不得盲重试或换幂等identity/目标；retry须无副作用依据、当前授权、lane顺序与平台限流预算 | FR-BR-009、013、014 |
| BR-BR-020 | 治理约束 | 恢复需显式basis和同effect/source；重建仅修局部状态；缺ref、probe或来源权限保持missing_source/blocked/indeterminate | FR-BR-014 |
| BR-BR-021 | 禁止行为 | 日志/trace/metrics/report/evidence/handoff不得含消息/附件body、secret/token、私有callback材料、敏感审批、raw平台error或带凭证URL；禁止可还原敏感正文的派生泄露 | FR-BR-015、016及全部FR |
| BR-BR-022 | 审计约束 | binding、owner交接、attempt、未知/恢复与handoff可追溯；本地handoff不等consumer接受，不伪造receipt/run/evidence/verdict/signoff/readiness | FR-BR-015 |
| BR-BR-023 | 不变量 | 查询no-write，不刷新source、推进cursor、修mapping或触发重放；维护必须是单独受权变更 | FR-BR-016 |
| BR-BR-024 | 边界约束 | 局部去重/审计留存遵获准范围；重放窗口不明、记录过期或安全预算耗尽时限制/停止相应操作，不无界保留或重放 | FR-BR-012、013、014、015 |

停审及跨组审计：24规则全部来自五卡与FR；类型覆盖不变量、禁止、显式变化、边界、治理、审计。共享secret/安全规则只定义一次；撤销与unknown不冲突，撤销阻止新效果但不能抹去已发生效果。所有16FR至少有保护规则。

## 8. 回填草稿

正式§10采用§7五组规则表；过程停审留calibration，正式不添加数据库/函数校验逻辑。

## 9. 待确认

BR-UP-001~009保留；规则确定失败上限，不授予当前缺失的provider/owner合同。

## 10. 进入下一步条件

自检：24规则类型、约束对象、FR挂载齐全；五节点及跨组审计完成，无孤儿/相邻owner写入/默认成功。允许Step11。

Step17补审自检：九问题逐项、历史位置明确；§7/8及下游映射语义不变，正式回填仍由Step17三层门禁放行。

```text
gate_status = pass
next_allowed_action = read_step_11_then_ownership
commit_required = false
```
