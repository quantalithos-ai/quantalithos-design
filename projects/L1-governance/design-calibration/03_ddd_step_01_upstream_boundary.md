# Step 1. 确认概要设计输入边界

### 1. Step 状态

- 状态:[x] 已确认
- 对应 SOP:`standards/document/详细设计讨论流程_SOP.md` Step 1
- 回填章节:`03-详细设计.md` §1 与上游文档的关系声明;§17 风险与待确认事项

### 2. 本步输入

- 上游文档:
  - `projects/L1-governance/00-需求文档.md`
  - `projects/L1-governance/01-架构设计.md`
  - `projects/L1-governance/02-概要设计.md`
  - `projects/L1-governance/design-calibration/02_hld_step_12_detailed_design_handoff.md`
  - `projects/L1-governance/03-详细设计.md` 旧草稿,仅作为问题诊断样本
- 已确认结论:
  - `L1-governance` 是治理决策与治理控制事实真相仓。
  - Governance truth 覆盖 Gate / Decision、Approval / responsibility、Policy effective fact、shared rules、Control、AIIA / SoA conclusion、Nonconformity 和 traceability。
  - Governance 不拥有 process waiting truth、conversation body、work lifecycle、runtime cache、artifact / evidence / archive body、method definition body、identity truth 或 external GRC truth。
  - 编译期依赖只允许 `L0-core`;其他 sibling 仓通过 ref、snapshot、summary、event、port、handoff 或下游消费协作。
  - 概要设计已经固定 10 个主要组成部分、实现分层、关键对象轮廓、Command / Query / Consumer / Outbound Event / Operations Job 骨架、关键处理流和状态集合。
- 依赖的前序 Step:
  - 无。本 Step 是详细设计 SOP 起点。

### 3. SOP 问题回答

1. 当前详细设计直接承接概要设计中的哪些结论?

   回答:直接承接 `02-概要设计.md` 中的代码主体框架、10 个主要组成部分、关键对象轮廓、Command / Query / Consumer / Event / Job 骨架、关键处理流、状态集合、异常落点、配置影响轮廓和详细设计承接清单。`00-需求文档.md` 和 `01-架构设计.md` 只作为需求边界、依赖方向、数据归属和通信方式的上游约束,不在详细设计中重新定义。

2. 概要设计中的代码主体框架是否已经足够稳定?

   回答:足够稳定。概要设计已经把 Governance 主体分为 Inbound / Operations、Application Services、Domain Model and Policies、Ports and External Seams、Persistence / Projection、Outbox and Handoff 等实现分层,并明确 `Governance truth core`、`Governance context and input management`、`Gate and decision management`、`Approval and responsibility management`、`Policy and shared rules management`、`Control and compliance conclusion management`、`Nonconformity corrective loop`、`Governance consumption and traceability`、`Derived maintenance and reconciliation`、`External context mirror support` 这 10 个组成部分。详细设计可以继续将这些主体落到 crate、module、file、trait、service 和 adapter。

3. 概要设计中的关键对象、接口骨架、处理流和状态机是否足够继续展开?

   回答:足够进入详细设计。概要设计已经完成以下闭环:
   - 关键对象反查到 Step 6,包括 truth / state、policy / guard、projection / read model、reference / snapshot、audit / history / outbox。
   - Command / Query / Consumer / Event / Job 已有正式名称、输入摘要、输出摘要和读写边界。
   - CreateGovernanceContext、SubmitGovernanceInput、OpenGovernanceGate、RecordGovernanceDecision、AssignApprovalResponsibility、ActivatePolicyEffectiveFact、AssessControlApplicability、RaiseNonconformity 等主流程族已经收敛。
   - 状态集合已经固定,包括 context / input readiness、gate / decision、approval responsibility、policy / shared rules、control / compliance、nonconformity corrective、derived / reference / publication 等状态族。

4. 哪些内容仍停留在概要设计轮廓,进入详细设计前必须补清?

   回答:以下内容必须由详细设计继续补清,但不阻塞进入 Step 2:
   - crate / package / module / file layout。
   - 完整 Rust struct / enum / value object 字段与 Rustdoc 注释。
   - Command / Query / Event / Job DTO schema、result / receipt / reason / ref 类型。
   - repository / port / adapter trait 签名。
   - 函数级调用链、事务边界、UoW、idempotency record、request digest 和 duplicate / conflict 行为。
   - projection rebuild truth source、reference snapshot refresh、outbox publication、trace / archive handoff、external GRC export 细节。
   - 正式状态转换矩阵和测试切口。

5. 哪些需求或架构结论会影响详细设计,但不能在详细设计中重新定义?

   回答:以下结论只能承接,不得在详细设计中改写:
   - Governance truth 归属和相邻仓正文排除。
   - `L0-core` 唯一编译期 sibling 依赖。
   - Gate / Decision 正式性,即 process waiting state、conversation card、work lifecycle、runtime cache、report row 或 external GRC record 不得替代正式裁决。
   - Approval responsibility 不接管 identity truth。
   - Policy effective fact、scope、priority、conflict 和 shared rules 归 Governance,低 scope 不得覆盖组织硬约束。
   - Control / AIIA / SoA 只保存结论、引用、摘要和批准关系,不保存 ControlDefinition、standard、artifact、evidence、AIIA / SoA 正文。
   - Nonconformity 必须保留原因、纠正、复验、关闭和责任语境,不得退化为 bug、blocker、alert、task 或备注。
   - Query、Consumer、Job、projection、report、handoff 和 external GRC export 不反写真相。
   - 配置不得重定义 truth 归属、正文排除、正式裁决、shared rules、状态机红线、依赖方向或派生不反写。

### 4. 旧版 03 问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 `03-详细设计.md` 文档元信息 | 关联旧 `02-概要设计.md v0.1.0`,日期为 2026-05-16 | 与新版 `02-概要设计.md` 的 14 章重建结果不一致,不能作为当前详细设计基线 |
| 旧版 `03-详细设计.md` §1 | 以 `GovernanceRequest / Gate / Decision / Exception / RiskAcceptance` 为主线 | 未覆盖新版概要收稳的 Governance context / input、approval responsibility、policy / shared rules、control / compliance、nonconformity、derived / reference / outbox 主体 |
| 旧版 `03-详细设计.md` §2 | 是写作采集提示,不是实现契约 | 不能直接指导 crate、module、trait、DTO、状态矩阵或事务落码 |
| 旧版 `03-详细设计.md` 内容组织 | 使用旧采集式结构和旧对象分层 | 不符合 `详细设计书写规范.md` 的 18 章结构与“模块实现契约”为主轴的要求 |
| 旧版 `03-详细设计.md` 外部契约说明 | 提到从 `L0-core` 与 draft proto / SDK 抽取或预先定义 | 未与新版 `02` 的 Command / Query / Consumer / Event / Job 骨架和正文排除边界逐项对齐 |
| 旧版 `03-详细设计.md` 五个主要部分口径 | 旧草稿仍以“五个主要部分”作为稳定前提 | 与新版概要设计的 10 个业务主要组成部分不一致 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 详细设计生成方式 | 直接在旧 `03-详细设计.md` 上修补或重写 | 先按 SOP 创建 `03_ddd_calibration_flow.md` 和逐 Step 中间产物 | 详细设计 SOP 要求中间产物先于正式文档 |
| 旧 `03` 地位 | 可能被当作可继承基线 | 只作为当前工作树中的问题诊断输入 | 旧文档存在旧主线、旧结构和旧范围残留 |
| 权威输入 | 旧 `03` + 旧概要 | 新版 `00/01/02` + `02_hld_*` 中间产物 | 保持需求、架构、概要、详细的真相源顺序 |
| 正式 `03` 写入时机 | 立即重写 | Step 19 整理正式文档 | 每章必须能追溯到具体 `03_ddd_step_*.md` |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 在旧 `03` 上局部修补 | 文件改动看起来较少 | 旧对象、旧采集提示和旧章节结构残留风险极高 | 不采用 |
| B. 直接重写正式 `03` | 可以快速形成新正文 | 跳过详细设计 SOP 中间产物,正式章节缺少校准来源 | 不采用 |
| C. 按详细设计 SOP 先生成 Step 中间产物,最后重建正式 `03` | 可追溯、可逐步审查、符合可落码性标准 | 需要更多步骤 | 采用 |

### 7. 结构化中间产物

#### 7.1 上游关系映射表

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | Governance 仓定位、数据归属、业务规则、验收红线、禁止行为 | 将需求红线落实到对象不变量、协议校验、错误分支和测试切口 |
| `01-架构设计.md` | 依赖方向、数据所有权、一致性分层、通信方式、相邻仓协作方式 | 将架构边界落实到 crate 依赖、trait / adapter、event / handoff、transaction 和 projection 规则 |
| `02-概要设计.md` §4~§12 | 代码主体框架、主要组成部分、对象轮廓、接口骨架、处理流、状态集合、配置影响、详细设计承接清单 | 展开为文件布局、模块契约、对象契约、trait 契约、DTO schema、函数级 flow、状态矩阵、事务与幂等 |
| `design-calibration/02_hld_step_*.md` | 概要设计每个结论的讨论来源 | 作为详细设计理解和追溯入口;不替代正式 `02` |
| 旧版 `03-详细设计.md` | 旧口径问题样本 | 用于识别不得继承的旧对象主线、旧采集提示、旧范围和旧章节结构 |

#### 7.2 本文不再回答

- `L1-governance` 是否是治理决策与治理控制事实真相仓。
- process waiting state、conversation card、work lifecycle、runtime cache、report row 或 external GRC record 是否可以替代正式 Governance decision。
- Governance 是否可以保存 artifact / evidence / archive body、method definition body、conversation body、runtime execution truth、work truth、process truth 或 identity truth。
- Approval responsibility 是否接管 GlobalMember、role、platform auth 或 tool permission truth。
- Policy effective fact、shared rules、scope、priority、conflict 和 override 是否归 Governance。
- Control / AIIA / SoA 是否保存外部正文。
- Nonconformity 是否可以退化为 bug、blocker、alert、task 或备注。
- Query、Consumer、Operations Job、projection、report、handoff 和 external GRC export 是否可以反写真相。
- 是否允许非 `L0-core` 仓进入编译期依赖。
- 配置是否可以改变 truth 归属、正文排除、正式裁决、shared rules、状态机红线、依赖方向或派生不反写。

#### 7.3 本文必须回答

- 目标仓的 Rust workspace、crate、package、module 和文件布局。
- 每个模块包含的 struct、enum、value object、service、trait、adapter、repository、projection 和 error。
- 每个对象字段、函数、工厂、状态 enum variant 和 Rustdoc 注释。
- 每个 Command / Query / Consumer / Outbound Event / Job 的 DTO schema、result / receipt、metadata / idempotency 规则。
- 每个处理流的函数级调用链、transaction / UoW、repository / port 调用、trace / audit / outbox / projection 副作用。
- 状态转换矩阵、非法转换、错误映射、恢复和重试口径。
- 并发、幂等、request digest、result_ref、duplicate / conflict 行为。
- projection rebuild truth source、reference snapshot refresh、outbox publication、trace / archive handoff、external GRC export 的实现契约。
- 测试切口和实施计划承接清单。

#### 7.4 输入不足风险

| 风险 | 是否阻塞 Step 2 | 处理口径 |
|---|---|---|
| 旧 `03` 与新版 `02` 大范围冲突 | 不阻塞 | 旧 `03` 只作为诊断输入,不作为真相源 |
| `04-配置设计.md` 尚未按新版 governance 主线重建 | 不阻塞 Step 2,影响 Step 14 | Step 14 只定义详细设计需要读取的配置引用和绑定点;正式配置手册后续单独写 |
| `05-测试方案.md` / `06-验收标准.md` 可能仍需跟随新版 03 同步 | 不阻塞 Step 2,影响 Step 16~17 | Step 16 先按新版详细设计生成测试切口,后续再回写 05/06 |
| 相邻仓具体 contracts 字段可能尚未全部可读 | 不阻塞 Step 2,影响 Step 6~8 | 到对象 / 协议契约 Step 时逐项对齐,不可自行发明上游 truth 字段 |
| external GRC 产品和具体导出协议尚未确定 | 不阻塞 Step 2,影响 Step 14 / Step 15 | 详细设计先定义 port、handoff target、receipt 和 degraded surface,产品参数留给配置 / ADR |

### 8. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_01_upstream_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“结构化中间产物”“回填草稿”和“待确认事项”小节,了解详细设计如何从新版需求、架构和概要设计承接,以及旧 `03` 为什么只能作为问题诊断输入。

#### 1. 与上游文档的关系声明

`03-详细设计.md` 直接承接新版 `00-需求文档.md`、`01-架构设计.md` 和 `02-概要设计.md`。本文继续把概要设计中已经收稳的代码主体框架、主要组成部分、关键对象、接口骨架、处理流、状态集合和配置影响轮廓展开为可以 1:1 实现的代码契约。

现有旧版 `03-详细设计.md` 只作为问题诊断输入,不得作为新版详细设计真相源。旧文档中仍适用的事实必须通过新版 `00/01/02` 或本轮 `03_ddd_step_*` 中间产物重新进入正式文档。

| 来源文档 | 承接内容 | 本文继续展开什么 |
|---|---|---|
| `00-需求文档.md` | 仓定位、数据归属、业务规则、验收红线、禁止行为 | 对象不变量、协议校验、错误分支和测试切口 |
| `01-架构设计.md` | 依赖方向、数据所有权、一致性分层、通信方式、相邻仓协作方式 | crate 依赖、trait / adapter、event / handoff、transaction 和 projection 规则 |
| `02-概要设计.md` | 代码主体框架、主要组成部分、对象轮廓、接口骨架、处理流、状态集合、配置影响、详细设计承接清单 | 文件布局、模块契约、对象契约、trait 契约、DTO schema、函数级 flow、状态矩阵、事务与幂等 |

本文不再回答 Governance truth 归属、相邻仓 truth / body 边界、Gate / Decision 正式性、Approval responsibility 与 identity 边界、Policy / shared rules 归属、Control / AIIA / SoA 正文排除、Nonconformity 纠正闭环、query / consumer / job 不反写真相、编译期依赖裁剪和禁止配置化边界等已经由需求、架构和概要设计收稳的问题。

本文必须回答 Rust workspace / crate / file layout、模块实现契约、对象契约、trait / adapter 契约、协议契约、函数级处理流、状态转换矩阵、持久化事务、一致性、错误恢复、幂等重入、配置绑定、审计埋点、测试切口和实施承接清单。

### 9. 待确认事项

- 无阻塞 Step 2 的待确认事项。
- 后续 Step 14 需要处理 `04-配置设计.md` 尚未按新版 governance 主线重建的问题。
- 后续 Step 16~17 需要标记 `05-测试方案.md` / `06-验收标准.md` 与新版详细设计的同步需求。
- 后续 Step 14 / Step 15 需要把 external GRC 产品和具体导出协议保持为 port / adapter / config 绑定,不得提前写成核心 domain truth。

### 10. 进入下一步条件

- 已明确详细设计直接承接新版 `00/01/02`。
- 已明确旧 `03` 只作为问题诊断输入,不得作为新版契约来源。
- 已列出本文不再回答和必须回答的内容。
- 已识别输入不足风险,且无阻塞 Step 2 的缺口。
