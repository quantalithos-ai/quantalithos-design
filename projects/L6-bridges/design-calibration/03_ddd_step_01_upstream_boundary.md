# L6-bridges 03 Step1：概要设计输入边界

## 1. Step状态、开工确认与内计划

done / pass；full-restart / single-agent-serial；拟回填正式03§1/§17，但当前不允许正式回填。

| 开工项 | 记录 |
|---|---|
| 项目/flow门禁 | pass；用户只授权03 Step1~4；当前为Step1 |
| 通用规范 | 通则§1、中间产物§3.4~3.6/§4、真相源§2.1/2.2.2~2.7/2.8.2~2.8.5、全局依赖全文已复核 |
| 当前SOP/书写 | 详细SOP原则及Step1；详细书写§3/4/5.1已读 |
| 输入/前序 | 项目台账、02 flow/Step14、正式00/01/02相关范围、02 Step1/12及owner来源复核 |
| 模块骨架 | done；来源资格单组，不拆业务模块；未来Step未创建 |
| 写入纪律 | 先问题/诊断/取舍，再结构化/复杂度/历史后置扫描/草稿/自检；只校准写入 |

| 内计划 | 状态 | 产物 |
|---|---|---|
| 输入及前序复核 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前材料诊断 | done | §4 |
| 设计取舍 | done | §6 |
| 结构化结论 | done | §7 |
| 复杂度判断 | done | §7 |
| 回填草稿/历史差异 | done | §5/8 |
| 自检及进入条件 | done / pass | §10 |

## 2. 本步输入

正式00§7~16（能力/16FR/规则/归属/质量/验收追溯）、01§6~11/15/17、02§1~4/6~9/11~14及02 Step12完整承接清单/243项type索引入口、02 Step1来源资格和Step14审计。当前复核七专项：SDK03§7.3、Conversation03§7.4、Identity01§4与实施台账头部、Governance03§7、Artifact03§1~3及实施台账头部、Workspace03§1~5及项目台账、Observability03§1~2及实施台账开工区。七专项既有完整读取资格见00/02来源登记，不声称本轮重读全00~07。

补充只读核实core/SDK真实Cargo与导出：core workspace edition2024/rust-version1.93，`core-contracts`导出actor/metadata；SDK workspace同工具链、`sdk-contracts`重导出core metadata、`sdk-client`存在泛型入口。不是Bridges专用方法/运行兼容证据。Bridges默认实现路径不存在；当前未创建。

## 3. SOP问题回答

1. 直接承接02§4~12：一个外部协议适配BC、六U业务轴、20局部对象、五类20主语、23抽象port需求、19入口流、17机/三无机及配置影响。03应展开文件、完整carrier/对象/函数、端口读取与事务闭口，不机械复制概要表。
2. 代码主体已稳定：Entry/Application/Domain/Ports/Outer Adapter与六U是两条组织轴；03可决定工程布局，但不能把六U改成六微服务或新truth owner。
3. 对象/接口/流/状态足以展开本地合同；不等于具备实际正向执行资格。现有typed Slot、原operation/effect、独立ACK/result、query no-write约束必须贯穿所有完整schema。
4. 必须在对应后续Step补清243项carrier及其真实来源、required-by-state、序列化、lookup/callable、UoW提交未知、unique effect、幂等结果读面、比较/覆盖和当前资格；缺外部owner合同只能blocked，不用String/fake凭证补成ready。Step3先核实可用shared exports与依赖类别，Step4再定本地路径。
5. 不重开00的P0/禁止材料/授权红线、01的truth/依赖/ADR、02的主语/状态/接口集合。actor授权、Gate/Decision、Artifact正文、Workspace视图与平台truth仍归各owner；L5-chat无正式输入边。

## 4. 当前材料问题诊断

02§12.2只有类型使用索引，不能当完整schema；§7 port命名是Bridges需求，不证明SDK或owner存在同名callable。Conversation已有target_mode/actor/digest规则，不证明材料重解析或原结果probe已绑定。core/SDK导出存在不等于版本固定、运行client配置或Bridges四平台兼容已核验。

02状态行曾滞留in_assembly，已暂停语义推进并仅同步状态、核对三层停审记录后恢复；不改需求/架构/概要结论。旧03/README尚未读取来推导当前结论。七owner元信息与实施资格分开，source ready_for_design_gate不是Bridges ready。

## 5. 改动前后及历史差异

| 历史位置 / 旧口径 | 当前判断 | 理由 / 回填影响 |
|---|---|---|
| 旧03§2.2/3.2/15五部分、BridgeRequest主线 | 废弃作为本轮结构输入 | 01/02为六U/20对象，03仅展开已收稳结构；不恢复五部分 |
| 旧03§7.6 DispatchBridge无需权限/审批 | 废弃 | 00/01/02要求当前binding/visibility/Policy/Gate，签名/安装凭证不能替内部授权 |
| 旧03§7.10/11 timeout -> retry/replay、重复resync | 废弃 | 原effect unknown只权威probe/manual；缺no-effect proof不发新效果 |
| 旧03§9.1 PayloadEnvelope持久化、统一证据链 | 废弃 | 禁raw/敏感/private材料durable与观测；局部audit不等evidence |
| 旧03§3.3单src布局、泛化types/ops/projection | 后移重新决定 | Step4依据当前层/规范/入口/adapter重量独立选布局，不继承旧树 |
| README技术栈/目录/核心映射/安全 | 不采预选Python+TS/SDK/KMS/OAuthfallback、Turn=Message/GlobalMember=User、Chat URL | 01/02产品中立和owner真相边界；Step3/4只核实必要工程选择 |
| 旧03§12“外部结果不替owner truth” | 语义保留，来源改为当前00/01/02 | 不是旧03恢复基线资格，详细guard须来自当前合同 |

历史扫描是在§7独立结论后执行，只读相关旧章节/README；首次整文输出被截断，不声明逐行全文已读。未改旧03/README。

## 6. 设计取舍

采用“已认可本仓00/01/02 + 已存在owner语义 + 未兼容port要求”的来源分层，继续本地实现契约设计，逐分支fail-closed。未采用把七上游正式文件齐全或SDK泛型client视为自动兼容；未采用旧03技术栈/handler名驱动重建。保留的代价是产品装配、实例能力与owner兼容不能宣告正向可运行，但不阻塞前四步的责任与文件路径设计。

三层检查：项目/flow允许当前Step1；本Step问题/诊断/取舍done，只开放结构化与复杂度判断；正式回填仍false。

## 7. 结构化中间产物与复杂度

### 上游关系映射

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| [本仓00](../00-需求文档.md) §7~16 | 五能力、16FR、24BR、20DR、16NFR、38AC/6VETO；当前重点复核§9~11 | 每项保护的schema/guard/错误/最小测试入口，不重写需求或验收 |
| [本仓01](../01-架构设计.md) §6~11/15/17 | 一个BC、六U、owner/局部truth、层/依赖、产品中立seam和ADR | 工程依赖、层间port、文件组织和运行模型，不锁未经核验产品 |
| [本仓02](../02-概要设计.md) §4~12 | 20对象/五类20主语/23port/19流/17机/配置轮廓 | 模块capability到对象、完整类型/签名/协议、状态矩阵、driver与事务 |
| [02 Step12](02_hld_step_12_detailed_design_handoff.md)及[类型索引](02_hld_step_12_support_type_handoff.md) | 243已使用类型的闭口责任，不是全部已定义schema | 每类型归属/字段/值域/optional/state guard/authority、公开传递类型反查 |
| [SDK03](../../L0-sdk/03-详细设计.md) §7.3 | 单一metadata/key/trace、可信context与credential ref、Query无写 | core重导出与client mapping，技术幂等不替effect/owner结果 |
| [Conversation03](../../L1-conversation/03-详细设计.md) §7.4 | BridgeMapped事件；显式target_mode/ActorRef；AppendFact Integration/kind/required digest | 本仓入站安全材料与结果ref映射；不复制owner类型或泛化submitTurn |
| [Identity01](../../L1-identity/01-架构设计.md) §4及[台账](../../L1-identity/design-calibration/implementation_execution_ledger.md) | AI身份锚点、不拥有human认证；commit-08-c/ready_for_design_gate源姿态 | human/AI/Integration映射责任与current scope，external_id不创建GlobalMember |
| [Governance03](../../L1-governance/03-详细设计.md) §7 | RecordGovernanceDecision/RecordApprovalVote等真实owner入口及只读查询 | 外显/action资格和正式责任映射；不能把签名或安装管理员权当审批许可 |
| [Artifact03](../../L1-artifact/03-详细设计.md)及[台账](../../L1-artifact/design-calibration/implementation_execution_ledger.md) | 附件/制品正文、准入与版本归owner；commit-01-a/ready_for_design_gate | authorized ref/传播/expiry/revoke与private material adapter；不缓存raw附件 |
| [Workspace03](../../L1-workspace/03-详细设计.md) §1~5及[项目台账](../../L1-workspace/design-calibration/project_execution_ledger.md) | 条件read/export/provenance；WS-UP-001~008/006-S和WS-LOCAL-001~003原开放状态 | 只选用已有qualified source分支；不取得频道或授权truth |
| [Observability03](../../L4-observability/03-详细设计.md) §1~2及[实施台账](../../L4-observability/design-calibration/implementation_execution_ledger.md) | body-free材料/consumer/evidence分离；pre_implementation_blocked/wait_design | safe producer/canonical/admission/result合同；mandatory缺资格先阻mutation/IO |
| [全局依赖规则](../../../standards/document/全局项目依赖关系与裁剪规则.md) §4/4.1 | Layer5窗口与compile/runtime/event裁剪 | 候选依赖逐类型核实；不消费Chat未停审内容，不链接owner源码 |

### 不再回答

- 业务目标、P0、验收编号、禁止材料、显式授权和owner/platform truth归属。
- BC/六U、通信类别、架构ADR、typed adapter/effect/cursor/query不变量。
- 02对象、接口、状态主语及已删候选的重新命名/增删。

### 必须回答

- Step3/4：语言与runtime模型、真实shared exports、可用dependency布局、实现单元/文件职责/命名。
- Step5~10：按模块capability推导所有对象与支撑schema、typed callable和完整协议、函数级调用/事务/状态/非法路径。未经授权不执行这些Step。
- Step11~18：原op提交结果与effect唯一、保存/读取/可见性、cursor/coverage、重试/lane/预算、配置/secret/private材料、安全handoff/测试与实施审计输入。缺口不交实现者猜。

### 输入不足风险及受限范围

| ID / 来源 | 缺口 | 受影响范围 / 未确认前行为 | 释放依据 |
|---|---|---|---|
| BR-UP-001 | owner material/result/change/probe兼容 | E01/U3材料/U5恢复blocked；ACK不能代accepted | 00 Step15§7.3 owning合同 |
| BR-UP-002 | human/AI/Integration责任与显式绑定链 | U1/U4/U6缺分支fail-closed，不自动身份 | 同上逐actor/source/scope/action |
| BR-UP-003 | 当前Policy/Gate/visibility外显与action依据 | 敏感正文不出站，提示/存在性/入口也须资格 | 同上逐owner安全projection/责任/结果 |
| BR-UP-004 | 外部附件准入与authorized ref传播 | E01/U3必要附件blocked；省略须owner许可 | 同上Artifact准入/访问/传播/失效 |
| BR-UP-005 | 条件Workspace safe read/export | 只选用分支blocked；不作Bridges必经强前置 | 同上及WS原开放项，不引入personal执行/seed前置 |
| BR-UP-006 | canonical producer/admission/disposition | O01/E04/J04条件挂起；mandatory缺失不得audit-only | 同上；十二affected按02§13.3逐项原状态保留 |
| BR-UP-007 | SDK/产品/secret/固定受权路由兼容 | 未选产品不默认装配；不造token/grant/KMS/URL | 同上版本/配置/secret seam资格 |
| BR-UP-008 | 四平台逐安装能力与官方版本 | 支持/降级/不支持不替代安装证据；不宣4/4 | PS-01~14只公开source，安装/pin/方向/method仍需核 |
| BR-UP-009 | 权威同op结果/no-effect/comparator/coverage/window | 保unknown/gap/manual；不换effect/key | 00 Step15§7.3/7.4正式continuity合同 |
| BR-UP-010 | Chat为并行入口 | reference_only，无正式输入边，不是等待Chat的强依赖 | 仅正式可引用合同和新增授权后重裁剪 |
| 本地实施前置 | Bridges实现路径不存在、工具链/build未核 | 计划路径非已建仓；本轮不实现，不阻本地布局设计 | 将来07授权及真实实现仓核验，不伪造创建或commit |
| 本地03待展开 | 243carrier、driver提交结果、scope读取面未完整定义 | 当前不能移交代码；后续各Step逐项闭口而非假定ready | 本SOP逐Step门禁及02§12回退规则 |

这里的BR-UP记录不表示上游设计整体未完成；不修改owner台账。十二affected不复制成新本地状态机，正式精确入口仍02§13.3/00 Step15§7.4。

复杂度：本步是资格/承接单组，关系和风险表足够，不拆模块或附录；§1禁止图，不画图。前四步只收口本地组织，不声称完整03可落码。

## 8. 回填草稿

正式§1可摘录§7来源映射和不再/必须回答；§17承接§7风险及精确释放入口。用“本地实现契约可展开、实际owner/provider分支仍blocked”表达资格，不写“SDK已有完整Bridges接口”。本草稿不新增schema/方法/产品，不装配正式03。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only。所有owner/platform事实保持原归属。

## 10. 自检及进入下一步条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| SOP五问题/正式输入 | pass | §3/7；当前02已用户认可，元信息与停审状态同步 |
| 主体/对象/接口/状态不重定义 | pass | 六U/20对象/20主语/23port/19流/17机保持；243type仍待schema |
| 来源与实际资格分离 | pass | 七专项复核及真实core/SDK导出不替兼容；未伪造API/账号/运行 |
| 待确认/历史污染/复杂度 | pass | BR-UP及原Workspace/十二affected状态保留；历史后置且未吸收 |
| 本步写入门禁 | pass | 问题/诊断/取舍先于结构化；只当前校准/台账，Step2未提前建 |

gate_status=pass；gate_reason=upstream_mapping_and_blocked_branches_explicit；next_allowed_action=read_step02_sop_and_define_scope；source_files=§2/§7；formal_backfill_allowed=false；commit_required=false。只允许授权内Step2，不授权实施或正式文档。
