# L6-bridges 01 Step 1：确认需求基线

> 2026-10-02；full-restart；done / pass；正式01不写。

## 1. 状态与 Step 内计划

开工确认：已读项目台账、00 flow/Step17、正式00全文、00 Step15、通用门禁、全局规则、架构SOP及书写规范§4.1。七专项首次阅读见00 Step1/15，本轮相关合同复核待完成；输出为本文件。骨架已建立，进入条件pass只允许当前阅读与思考。

| 单元 | 问题/诊断/取舍 | 结构化 | 回填 | 自检 | gate_status / 下一动作 |
|---|---|---|---|---|---|
| 来源资格与需求基线 | done | done | done | done | pass / read_step_02 |

## 2. 输入与阅读定位

正式00§2/6~16及校准来源；七专项当前正式相关章节/必要台账；平台00 Step5附录；旧材料只在独立结论后读取。

## 3. SOP 逐项问题回答

| SOP问题 | 依据 / 当前回答 |
|---|---|
| 架构依赖哪些需求结论？ | 正式00的仓级边界、五能力、16FR、24BR、20DR、16NFR和38AC/6VETO；§6/12的SDK/owner/平台/seam依赖及§15正向挂起共同约束架构。 |
| 哪些稳定？ | 局部状态ownership、双重授权、五能力不能缺位、ACK/owner/Turn/receipt分层、禁止body与secret、unknown不盲重试、query no-write；稳定不等运行已验证。 |
| 哪些待确认？ | BR-UP-001~009的human责任、安全材料、当前外显/action、附件、条件Workspace、producer、安全配置/平台能力、结果/位置/probe合同；010仅并行输入限制。 |
| 哪些直接影响边界？ | FR001~011的绑定/映射、协议入口、owner交接与外显动作；不得扩为身份/审批/Conversation服务或四平台广播。 |
| 哪些影响数据所有权？ | DR001~016只容许局部truth、能力snapshot及owner/secret ref；DR017~020禁止正文。durable queue也不能例外。 |
| 哪些影响依赖/一致性？ | 正式00§6/12仅core/SDK为compile候选，owner/平台为runtime、bus条件event；BR017~024要求本地幂等/位置保护、跨边界结果分离与有限恢复。 |

## 4. 当前材料问题诊断

已核对SDK01§3/4/9~11、Conversation03§7.4、Identity01§4/实施台账current、Governance01§4/9/10及07 flow、Artifact01§9/实施台账current、Workspace01§9/10及项目台账相关项、Observability01§9/实施台账全文。首次七专项00~07阅读沿用00登记，不声称本轮再次全文读取。

| 当前来源位置 | 诊断 / 对基线的影响 |
|---|---|
| Conversation03§2.3与§7.4 | 前者的“Bridges/外部平台truth”不能赋本仓body所有权；后者确有AppendFact/ManifestExternalFact、Integration、BridgeMapped/digest；需要消费兼容，不另造submitTurn。 |
| Identity01§4；Governance01§4；Workspace01§9/10 | 三者分别是AI身份、治理结论和只读投影，不可合成内部human登录/全域权限owner。 |
| SDK/Conversation07 flow头部 | 仍称正式07未建，与00已核实的正式文件冲突；只保来源资格限制，不推定签署或回写头部。 |
| Identity/Artifact/Observability实施台账current | 分别commit-08-c/ready_for_design_gate、commit-01-a/ready_for_design_gate、pre_implementation_blocked/wait_design；不能统称未实现或Bridges已联调。 |
| Workspace台账；Observability Inherited Affected Register | WS开放项及十二affected原状态继续继承；covered_conditional与design_record_closed_implementation_open不改成全部closed/open。 |

## 5. 前后对比与历史扫描

独立§3/7形成后读取旧01§1~3：§1.2把external_id和GlobalMember直连、默认低敏感外部处理，§2从README引bridged Turn字段、KMS前置、平台语言，§3以Conversation canonical model统一平台。当前废弃身份/审批默认和自造字段；平台adapter主题只可后续独立重核，不继承库、语言或已达4/4口径。定位精确，旧正文未改。

## 6. 取舍与复杂度

采用正式00作为直接基线、专项owner作为语义校验与挂起来源，区分设计前提/正向兼容/运行证据。未采用旧01方案反推需求，也未采用“全部上游ready”或“全部没设计”概括。单一基线单元分批形成三表；不提前拆服务、选库或定义对象schema。复杂度可在本文件承载，后续重Step按单元小循环。

## 7. 结构化中间产物

### 7.1 章1来源主题

| 来源文档 | 上游章节/模块 | 承接内容 |
|---|---|---|
| `00-需求文档.md` | §2/4/7/9~15 | 本仓已收束的边界、双向能力及保护前提 |
| `product/产品矩阵.md` | §6.1 Bridges | 外部协作渠道触达延伸主题 |
| `architecture/仓库拆分方案.md` | §9.1 | 外部协议适配仓级主题 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | §2/4.1/5/6 | Layer5窗口与单仓依赖裁剪主题 |
| `projects/L0-sdk/01-架构设计.md` | §4/8~11 | 官方客户端与正式服务边界消费 |
| `projects/L1-conversation/03-详细设计.md` | §7.4/10/12 | bridge-origin事实交接与结果语义 |
| `projects/L1-identity/01-架构设计.md` | §4/9 | AI成员锚点与身份侧引用 |
| `projects/L1-governance/01-架构设计.md` | §4/9/10 | 治理决策、责任与Policy适用 |
| `projects/L1-artifact/01-架构设计.md` | §9/10 | 正式制品及可消费引用 |
| `projects/L1-workspace/01-架构设计.md` | §9/10 | 只读协作语境、版本/覆盖/visibility provenance |
| `projects/L4-observability/01-架构设计.md` | §9/10 | body-free观察及独立交接 |

本文在架构层细化桥接局部状态、协议适配、依赖和结果分层，不重新定义以上owner或平台truth；来源主题不代表正向运行资格。

### 7.2 架构需求基线

| 需求基线结论 | 需求来源 | 稳定资格 | 架构影响 |
|---|---|---|---|
| 只拥有桥接局部状态 | §2/11；BR001；DR001~020 | stable_boundary | 限制本地持久化与跨域写入 |
| 双重资格与typed映射 | C1；FR001~003；BR002~005 | stable_requirement；basis合同open | 显式关系、主体kind与版本隔离 |
| 入站可信验证/owner交接/差异 | C2；FR004~006；BR006~009 | stable_requirement；material/兼容open | ACK独立、变化回链，不把映射当Turn |
| committed来源、安全外显与投递 | C3；FR007~009；BR010~013 | stable_requirement；读取/外显/附件open | 展示与action分开，效果与attempt分开 |
| 交互验证与owner责任 | C4；FR010/011；BR014~016 | stable_requirement；human/action链open | 验证不能自授权限，callback不私有裁决 |
| 幂等/位置/恢复/安全审计/只读 | C5；FR012~016；BR017~024 | stable_requirement；probe/窗口/消费open | 单一effect、可比cursor、未知保留、query不维护 |
| 四adapter差异与secret/config seam | §6/9.3/12/15；DEP001/007/008 | protocol_partially_verified；not_selected | 平台版本与私有材料隔离，不宣称4/4支持 |
| 判断与否决链 | §13/14/16 | stable_design_conditions；not_run | 每单元验证切口回链，静态检查不冒称EV |

### 7.3 硬约束与未关闭风险

硬约束：owner/platform truth不迁移；external_id不建GlobalMember；外部操作不绕适用Policy/Gate；ACK/接纳/Turn/receipt/consumer结果不互证；durable及观测无禁止body/secret；unknown无证明不重试或换effect/target；query no-write；依赖类型不混；未核验seam不激活；不伪造运行/签署。

风险仍为R-BR-001~009与BR-UP-001~010。精确缺口/释放依据/十二affected原状态以`00_req_step_15_risks_open_questions.md`§7.3/7.4为已读入口；本Step不关闭任何项。可继续结构性安全设计，不能授权受影响正向分支实施或运行。

## 8. 回填草稿

章1摘录§7.1来源三列表和短收束；§7.2/7.3分别支持章3的需求前提和章16追溯，不在章1混写。风险只进入挂起register，不把body归属冲突改为本仓材料store。

## 9. 待确认事项

BR-UP-001~009 open、010 reference_only；正向资格未建立，不阻塞校准保守边界。

## 10. 自检与门禁

```text
gate_status = pass
gate_reason = stable_requirements_and_positive_branch_limits_separated
next_allowed_action = read_step_02_then_create_current_step
source_files = formal_00_and_00_step_15_and_seven_owner_contracts
formal_backfill_allowed = after_step_16_three_level_gate
commit_required = false
```

自检：六问题有独立回答，来源表一行一主题；所有16FR/五能力仍直接承接00，硬约束未改写需求。上游实际状态有定位，十BR-UP没有关闭；历史扫描后置，不创建容器/服务，不伪造签署/运行。Step1设计自检pass仅允许Step2。
