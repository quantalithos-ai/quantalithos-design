# 01 Step01 · 确认需求基线

## 1. 开工确认与Step内计划

| 字段 | 记录 |
|---|---|
| 模式/输出 | full-restart；当前文件 |
| 前序输入 | 正式00、00Step15/16/17、项目台账、00flow |
| 规范输入 | 架构SOP Step1、书写规范4.1/4.3/4.16；通则、中间产物、闭环标准适用段；全局依赖规则 |
| 单元骨架 | 稳定需求基线→专项来源资格→条件前提；只在本Step到达时创建 |
| gate_status / gate_reason | pass / 可执行当前Step思考，不允许正式装配 |
| next_allowed_action | 完成九owner架构资格阅读后写问题回答、诊断、取舍 |

| 计划项 | 状态 | 对应产物/完成门禁 |
|---|---|---|
| 输入与前序恢复 | done | §1/专项阅读记录 |
| 问题回答 | done | §2逐问题稳定/条件判断 |
| 诊断 | done | §3准确定位冲突 |
| 取舍 | done | §4采用与未采用路径 |
| 结构化 | done | §5来源与基线资格表 |
| 复杂度与后置历史审计 | done | §6/7 |
| 回填草稿 | done | §8只摘录前述结论 |
| 自检/停审 | done | §9/10 |

## 2. SOP问题回答

架构直接依赖正式00五能力、16FR、21BR、数据归属、接口资格及20AC；稳定的是市场责任唯一、ref-only、正式审核、exact版本、当前获取资格、撤回停新分发、unknown对账与局部审计。未稳定的是各owner exact消费合同、人类authority、材料适用、receiver、通知/审计准入和栈变更依据。来源/市场/receiver真相分开直接约束子域；局部accepted与外部结果分开约束一致性；Core/SDK编译与owner运行/条件事件分开约束依赖方向。

## 3. 当前输入诊断

- 正式00§15 MP-UP-001～008不是上游确认ID，不能借01完成关闭。
- 全局拆分§9.2明确Rust服务端+Vue前端；§十要求L5/L6经SDK、不直连L1 gRPC。draft04纯TS领域及React方向与之冲突。
- Governance01§9拥有正式Decision，不证明03 public summary公开approved及市场binding；formal01 flow开头完成却§1残留“仍旧Draft”，与00 flow状态冲突继续作为资格问题而非修改授权。
- Hub台账当前reason repair未冻结；Observability03 current完成但60协议affected open，不能把其历史完成状态解释为准入稳定。
- Images01§10无outbound；Archive01§9 source matrix无Marketplace，市场不能凭愿望新增事件/restore lane。

## 4. 设计取舍

采用需求稳定边界与条件接缝分别成基线，正向路径逐类型/操作qualified后才开放。未采用“九仓有正式01即全部可用”：它混淆结构设计、public合同支持和真实集成。技术栈先受上位约束，不通过原型反推；是否变更要有受控确认，Step10作明确承接。

思考记录done；gate_status=pass只许可写结构化基线，正式装配仍blocked。

## 5. 结构化中间产物

| 需求来源 | 架构基线 | 资格 |
|---|---|---|
| 00§2/4/11、VETO1 | 市场局部truth与外部immutable ref唯一分工 | stable |
| 00 C1/C2、BR101～204 | 来源/publisher/material申请基线固定；有效正式批准完整匹配才上架 | 规则stable，正向contract blocked |
| 00 C3、BR301～304 | 五类label不造enum；exact选择；查询/索引不授权且scope交集 | stable，owner映射conditional |
| 00 C4、BR401～404 | 当前资格、同意图原结果、receiver/安装分离，无财务写面 | stable，receiver positive blocked |
| 00 C5、BR501～505 | 撤回先停新分发，已知影响+unknown、通知/audit独立，恢复不反写 | stable，外部positive conditional |
| 00 NFR-G01～04、AC-G01～04 | 全入口同gate、局部一致性、有界维护、英文默认双语 | stable，无虚构SLO |
| 全局§9.2/十/十一 | 独立市场、Rust/Vue约束、Core/SDK compile、owner运行经SDK | stable约束，draft变更未授权 |

### 专项架构阅读与资格

本表是当前已读取范围，不声称九仓00～07全部全文读取。00阶段调查和consumer材料详情仍见00Step01/12/15。

| owner/当前输入 | 本次读取 | 可承接事实 | 未qualified部分 |
|---|---|---|---|
| L0-sdk01 | §3/4/8/9/10/15；00flow/Step17状态线索沿用 | 三语言client、无server facade/approval、Core/Bus来源、无全量client承诺 | 市场exact owner client能力支持 |
| L1-identity01 | §3/4/9/10；§15边界，01flow定位沿用 | GlobalMember非认证主体；RoleDefinition不归Identity | 人类publisher/org/auth owner |
| L1-governance01 | §4/9/10；01flow§1～4 | 正式Decision/Approval唯一；查询与handoff不裁决 | current baseline状态冲突；public outcome/binding |
| L1-artifact01 | §4/9/10；项目ledger当前恢复/文档状态 | version/lineage/baseline/consumable truth回指，摘要不代正文 | type/digest/visibility/material消费合同 |
| L3-method-library01 | §4/9/10；ledger当前恢复/文档状态 | 方法/模板/角色定义及正式版本归owner；市场非定义正文源 | exact市场映射及delivery；交易旧指向不授权finance |
| L3-capability-hub01 | §4/9/10；ledger当前恢复/01状态 | Registry/descriptor/exposure唯一；market listing排除 | reason repair anchor及不可变来源/receiver合同 |
| L2-member-images01 | §4/9/10；ledger恢复 | immutable pin/entry、eligibility与consumer gap分开；0 outbound | MI-UP对应消费/材料路径与SDK支持 |
| L4-observability01 | §4/9/10；ledger恢复/当前03 affected | 安全准入、观察投影、body-free链接，非源审计/最终裁决 | 市场producer准入/payload/redaction/receipt |
| L4-archive01 | §4/9/10；ledger恢复/UP表 | per-owner capture/restore、commit-unknown；source matrix无market | 市场export/restore无active合同 |

全局依赖Layer5窗口允许当前项目独立设计；owner受影响接缝继续挂起，不重排上游、不修改上游台账。正式来源路径以本表owner目录下01及project ledger为准；SDK/Identity/Gov未找到project ledger，使用flow而不伪称存在。

## 6. 复杂度判断

本Step三类基线足以单文件审查；后续Step05逐单元收敛，不能把九owner缺口折为一个万能adapter。正式01不写DTO/schema/表结构；02/03需进一步从能力与状态主语展开，缺来源不由实现补。

## 7. 后置历史差异审计

| 旧材料位置 | 旧口径 | 当前判断 | 理由 / 回填影响 |
|---|---|---|---|
| 旧01§2/5/8 | 市场不是真相源、installation record、安全attestation混归属 | 修改 | 市场拥有局部truth，接收/安装与材料authority外置 |
| 旧01§4.3 | owner SLA 99.9%、Billing异常回免费 | 废弃 | 无测量依据；免费也须当前获取authority |
| 旧01§5/9.2 | Package核心、打包/解包已定 | 阻塞待确认 | 29110要求保留，但无包owner/适用不能造包truth |
| 旧01§6.2/README定位 | TS core、Python CLI、identity.Role | 废弃/后移 | 全局Rust/Vue；RoleDefinition归方法库；CLI薄客户端可后移 |
| draft04§2/3 | Next/React/Fastify/纯TS领域 | 阻塞待确认 | 已讨论推荐不等于上位架构变更依据 |
| 旧01§3.3/9.1 | 上游ref-only与市场listing独立 | 保留语义 | 由本轮00/owner重新推导，不复制旧实现结构 |

只读审计到旧01上述章节、README定位/类型/核心/目录和draft04§2；旧01全文工具输出截断，不作全文阅读声明。其余历史实现细节不作为输入。

## 8. 回填草稿

正式§1只列00、全局架构/依赖/合规及九owner来源主题；§3承接stable红线和条件前提；§16追溯五能力、16FR、21BR及质量/验收。栈变更不在此步授权；owner/public合同缺口保留§15。

## 9. 自检与停审

检查结果：需求边界稳定、来源资格非runtime-ready、无复制正文/approval/财务、依赖类型无源码穿透、历史后置、无新功能。读取范围明确，正向缺口不被“completed”关闭。问题回答/诊断/取舍/结构化/草稿/self-check done；正式装配等待Step16。

| 单元 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|
| baseline | done | done | done | pass | 稳定/条件基线清楚，Step01 stop_review | Step02目标约束 | 正式00、九owner01、全局§9.2/十/十一 |

## 10. 待确认事项

MP-UP-001～008、SRC003/010/013、Q-MP-01沿用00Step15；本步不关闭。状态complete/design-only；不生成真实资产、run/evidence或签核。
