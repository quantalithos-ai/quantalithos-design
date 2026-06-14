# Step 11. 配置影响轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 11
> 回填章节: `02-概要设计.md` §11 配置影响轮廓
> 生成日期: 2026-06-11
> 状态: 已完成,等待审核后进入 Step 12

---

## 1. Step 状态 + Step 内计划

| 计划项 | 状态 | 产物位置 |
|---|---|---|
| 读取 Step 4~10、最新版 SOP / 书写规范和当前配置输入边界 | 已完成 | §2 |
| 回答 Step 11 SOP 问题 | 已完成 | §3 |
| 诊断旧 Step 11 与当前材料的差距 | 已完成 | §4 |
| 比较改动前后口径 | 已完成 | §5 |
| 记录采用 / 不采用的设计取舍 | 已完成 | §6 |
| 输出配置影响轮廓表、禁止配置化边界表、配置影响图和详细设计承接方向 | 已完成 | §7 |
| 判断本 Step 是否需要拆分 | 已完成 | §8 |
| 形成正式 `02` §11 回填草稿 | 已完成 | §9 |
| 列出待确认事项和进入下一步条件 | 已完成 | §10~§11 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步用途 |
|---|---|---|
| `02_hld_step_04_code_subject_framework.md` | 已完成并已获用户认可 | 提供 Inbound / Application / Domain / Ports / Jobs / Publisher / Handoff 的代码主体骨架 |
| `02_hld_step_05_components_boundary.md` | 已完成并已获用户认可 | 提供 8 个主要组成部分、职责、非职责和接缝 |
| `02_hld_step_06_key_objects.md` | 已完成并已获用户认可 | 提供关键对象、state、policy、projection、outbox、handoff 主语 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成并已获用户认可 | 提供 Command / Query / Event / Job / External seam 分类 |
| `02_hld_step_08_processing_flows.md` | 已完成并已获用户认可 | 提供处理流中已点名的 adapter、publisher、job、handoff、projection 和 report 后移项 |
| `02_hld_step_09_state_machine.md` | 已完成并已获用户认可 | 提供 lifecycle、reference、projection、outbox、handoff、reconciliation 等状态红线 |
| `02_hld_step_10_exceptions_boundaries.md` | 已完成并已获用户认可 | 提供配置越界、forbidden body、query no-write、report-only 等异常边界 |
| `projects/L1-identity/00-需求文档.md` | 当前需求输入 | 提供业务规则、VETO、安全边界和验收约束 |
| `projects/L1-identity/01-架构设计.md` | 当前架构输入 | 提供 identity truth center、依赖裁剪、外部正文排除和运行承载约束 |
| `standards/document/概要设计讨论流程_SOP.md` | 最新流程标准 | 规定 Step 11 只识别配置影响轮廓和禁止配置化边界 |
| `standards/document/概要设计书写规范.md` | 最新正式结构标准 | 规定第 11 章表格、图示和禁止下沉内容 |
| 旧 `02_hld_step_11_configuration_impact.md` | legacy draft | 只作为诊断输入,不得直接继承为新版结论 |
| `projects/L1-identity/04-配置设计.md` | 已存在但基于旧上游 | 只作为反向风险输入,不得反向约束新版 `02` |

---

## 3. SOP 问题回答

### 3.1 哪些主要组成部分、入口、adapter、job、worker 或外部接缝会受到配置影响?

会受到配置影响的是运行装配、外部接缝、派生维护、传播交接和读侧裁剪等概要层结构:

- Command intake / Query intake:受 profile、metadata trust boundary、page / redaction / visibility profile 和 request guard 影响。
- Event intake / Consumer:受 source adapter、dedupe retention、source event binding 和 forbidden body guard 影响。
- Operations jobs:受 job scope、cursor、batch、retry、timeout、report root 和 dry-run / replay profile 影响。
- External source ports:role / capability source、work participation source、governance basis、memory / archive resolver、artifact evidence resolver 等受 adapter mode、endpoint ref、timeout 和 availability profile 影响。
- Projection / trace / audit / report:受 store binding、retention、redaction profile、freshness / degraded exposure 和 report writer 影响。
- Outbox publisher / handoff runner:受 topic / target ref、publisher / handoff adapter、retry / backoff、receipt marker 和 delivery report 影响。

这些影响只改变运行装配、读写边界、失败映射和证据落点,不得改变 identity truth ownership、domain invariant 或状态机红线。

### 3.2 哪些模块只能间接受配置影响,不能直接读取配置?

只能间接受配置影响的模块包括:

- Domain Model:只能通过 application 注入的 actor、clock、id、source marker、basis ref 或 policy profile 结果感知配置,不得读取 raw config。
- Key Objects / Policies:只能执行稳定业务不变量,不得根据 profile 改变 ref reuse、lifecycle transition、append-only、body-free 或 query no-write。
- Application Services:可以接收已装配的 repository / port / publisher / job helper,但不读取 JSON、env、secret 或 config file。
- Contracts / DTO / View:只能表达协议和 marker,不得包含配置 loader、adapter mode 或 secret 解析逻辑。

Raw config 读取、解析、校验和 adapter constructor 属于 `03/04` 详细实现契约,不是概要关键对象的一部分。

### 3.3 哪些领域规则、状态机、审计链、事务一致性或安全门禁禁止配置化?

禁止配置化的边界包括:

- `GlobalMemberRef` 不复用、tombstone 不恢复成新成员。
- Query 不创建、修复、refresh 或 rebuild truth。
- `GlobalLifecycleState` 高风险迁移必须有正式 basis。
- `CareerRecord` append-only,不得原地修改或重排历史。
- RoleDefinition / CapabilityDefinition body、ProjectMember truth、memory body、artifact body、runtime body、archive package、receipt body 不进入 identity。
- projection / reconciliation / maintenance report 不反写真相,不修复相邻仓 truth。
- outbox publish / handoff delivered 不作为 accepted truth 的前置,失败不回滚 accepted truth。
- trace / audit / outbox / handoff / report 的 body-free 和 redaction 红线不可关闭。

这些边界若要改变,必须回到需求、架构、概要和详细设计重新讨论,不能通过配置开关放宽。

### 3.4 哪些配置影响需要在 `03-详细设计.md` 中继续定义实现契约?

需要交给 `03` 的实现契约包括:

- Runtime config shell 与 validated config 注入边界。
- Config loader / validator 的错误面、fail-fast / degraded / disabled 语义。
- Adapter config 到 repository / resolver / publisher / handoff / report writer 的 constructor 输入。
- Job config 到 job run metadata、cursor、batch、retry、timeout、report 的映射。
- Profile 与 fake / controlled / endpoint / disabled adapter 的合法组合。
- Redaction / visibility / forbidden body guard 的 profile 化入口与不可配置化边界。
- Config evidence 在 test / acceptance / implementation handoff 中如何留证。

### 3.5 哪些配置细节属于 `04-配置设计.md`,不能在概要设计中提前展开?

本 Step 不展开以下内容:

- 配置项全集、默认值、JSON / JSONC 示例、环境变量名、secret 名称。
- topic 字符串、endpoint URL、store DSN、bucket / path、certificate / token ref。
- adapter constructor 完整参数、trait 签名、error enum、profile file schema。
- 具体 batch size、timeout、retry / backoff 参数、retention 天数。
- 运维命令、部署挂载、secret provider 操作、config center / admin override。

这些内容应在新版 `03` 明确实现契约后,由新版 `04` 按配置 SOP 重新承接。

---

## 4. 当前材料 / 旧文档问题诊断

| 旧材料 / 倾向 | 问题 | 本轮处理 |
|---|---|---|
| 旧 Step 11 已标“已完成” | 缺少 Step 内计划、SOP 问题回答、诊断、对比、取舍、复杂度判断和自检 | 删除后按最新版模板重建 |
| 旧 Step 11 直接引用旧 `04` 配置口径 | 当前新版 `02` 尚未装配完成,旧 `04` 不能反向约束概要设计 | 只把旧 `04` 当作风险输入,不导入具体配置项 |
| 旧表把 command / query 的配置影响写得偏具体 | 容易提前进入 request size、retention、profile 字段等实现细节 | 本轮只保留影响类别和详细设计承接方向 |
| 旧稿未明确 domain / contracts / application 不读取 raw config | 后续容易把 config loader 下沉进对象或 DTO | 本轮单独回答“只能间接受配置影响” |
| 旧稿的禁止配置化表少了 Step 10 的 report-only / handoff / fake delivered 风险 | 配置可能被用来绕过 no-write、report-only、body-free 和 delivered marker | 本轮把这些作为不可配置化边界 |
| 旧稿未说明新版 `04` 需要重承接新版 `02/03` | 可能让已生成的 `04-配置设计.md` 被误当最终真相源 | 本轮明确 `04` 需要在新版 `02/03` 后复核 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 |
|---|---|---|
| Step 结构 | 简表式完成稿 | 完整包含计划、问题回答、诊断、对比、取舍、结构化产物、复杂度、回填和进入条件 |
| 上游关系 | 部分依赖旧 `04` / 旧 `02` 口径 | 只承接新版 Step 4~10 和 `00/01` |
| 配置粒度 | 有 retention、request size 等偏具体项 | 改为 profile、adapter、store、job、redaction、report 等影响类别 |
| 禁止配置化边界 | 覆盖 truth / body / query / projection | 扩展到 handoff delivered、outbox failure、report-only maintenance、fake adapter 不能伪成功 |
| 详细设计承接 | 简单列契约方向 | 明确 runtime config、loader / validator、adapter config、job config、redaction profile 和 evidence |
| 与新版 `04` 的关系 | 未说明 | 当前 `04` 后续需按新版 `02/03` 重复核或重写 |

---

## 6. 设计取舍

| 方案 | 结论 | 理由 |
|---|---|---|
| 在 Step 11 直接采用现有 `04-配置设计.md` 的 profile / config item 表 | 不采用 | 现有 `04` 基于旧上游,会反向污染新版 `02` |
| 在概要设计中提前定义 runtime config 字段和 JSON 示例 | 不采用 | 属于 `03/04` 实现契约和配置设计,不是概要层配置影响轮廓 |
| 只列受配置影响部分,不列禁止配置化边界 | 不采用 | identity 的主要风险正是配置越界绕过 truth / body / query / report 红线 |
| 按 Step 5 的 8 个主要组成部分逐项列配置影响 | 采用 | 能回指已审核结构,避免新增未讨论主语 |
| 增加 Inbound / Operations / External seam / Cross-cutting 分组 | 采用 | 配置主要影响运行装配和接缝,仅按业务组成部分会漏掉入口和 job |
| 在本 Step 画配置影响图 | 采用 | 表格较多,图能清楚表达配置只进入 runtime / adapter / job / publication,不进入 domain invariant |

---

## 7. 结构化中间产物

### 7.1 配置影响轮廓表

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| Command intake | 是 | profile、actor / metadata trust boundary、idempotency policy profile、redaction guard | command metadata validation、duplicate replay / reject surface、runtime builder 注入 |
| Query intake | 是 | visibility / redaction profile、page limit、degraded / stale marker exposure | query context、visibility decision、page contract、no-write guard |
| Event intake / consumer | 是 | source adapter mode、source event binding、dedupe retention、forbidden body guard | consumer envelope、source marker、idempotency、unrecognized / unavailable 映射 |
| Operations jobs | 是 | job scope、cursor source、batch / timeout / retry category、report root | job input schema、cursor semantics、partial / failed report、dry-run / replay profile |
| 身份锚定与成员真相 | 间接受影响 | id generator、clock、actor context、store binding | id / clock / metadata port 注入;ref 复用不受配置影响 |
| 全局生命周期 | 间接受影响 | governance basis resolver profile、high-risk basis availability | basis resolver port、pending / rejected / unavailable 口径;状态矩阵不配置化 |
| 角色能力摘要 | 是 | role source adapter、source freshness、evidence resolver、summary redaction | source snapshot、stale / unavailable marker、body-free evidence ref |
| 身份生涯记录 | 是 | work participation source adapter、event consumer profile、dedupe store | source marker、append-only idempotency、correction append boundary |
| 记忆引用关系 | 是 | memory / archive resolver adapter、archive target profile、handoff availability | memory ref state、archive handoff marker、body-free guard |
| 身份事实消费与追溯 | 是 | projection store、trace / audit retention category、visibility / redaction profile | projection repository、trace read model、redaction failure surface |
| 派生维护与对账 | 是 | rebuild / refresh / reconciliation job profile、report writer、reference resolver availability | projection rebuild job、reference refresh job、report-only finding persistence |
| 身份事实传播与外部交接 | 是 | publisher adapter、topic / target ref category、handoff target、retry / backoff category | outbox publisher port、handoff runner、receipt marker、failure state |
| External source ports | 是 | fake / controlled / endpoint / disabled adapter kind、timeout category、credential / endpoint ref | adapter config shape、secret ref resolution、disabled adapter failure mapping |
| Stores / unit of work / outbox / projection | 是 | store binding、transaction boundary profile、append-only / projection store root | repository / UoW config shell、outbox store、projection lookup / state store |
| Observability / report / artifact evidence | 是 | audit sink、safe diagnostic profile、report / evidence root | report writer port、redaction guarantee、config evidence surface |
| Domain objects / policies | 间接受影响 | injected clock / id / source marker / policy profile result only | 不读取 raw config;不允许 profile 改写不变量 |
| Contracts / DTO / view schema | 间接受影响 | marker visibility 和 safe diagnostic category | 不包含 loader、secret、adapter mode;只表达协议 surface |

### 7.2 禁止配置化边界表

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| `GlobalMemberRef` 不复用、tombstone 不恢复成新成员 | 平台身份锚定不变量 | `00/01/02/03` |
| Query 不创建、修复、refresh 或 rebuild truth | 读写分离和 query no-write 红线 | `00/01/02/03` |
| `GlobalLifecycleState` 高风险迁移必须有正式 basis | 安全 / 治理红线 | `00/02/03` 状态矩阵 |
| 外部 event / runtime signal 不直接推进 lifecycle | identity command ownership 红线 | `01/02/03` |
| `CareerRecord` append-only,不得原地修改或重排 | 历史可追溯不变量 | `00/02/03` |
| RoleDefinition / CapabilityDefinition body 不进入 identity | `L3-method-library` 数据 ownership | `00/01` 和跨仓边界 |
| ProjectMember / Project / WorkItem truth 不进入 identity | `L1-work` 数据 ownership | `00/01` 和跨仓边界 |
| memory body、embedding、archive package、receipt body 不进入 identity | 外部正文和隐私边界 | `00/01/03` |
| Artifact body、runtime body、conversation body 不进入 identity | 外部正文 ownership | `00/01/03` |
| projection / trace / audit / report 不反写真相 | 派生 / 追溯只读边界 | `01/02/03` |
| maintenance / reconciliation 不修复相邻仓 truth | report-only maintenance 红线 | `00/01/02/03` |
| outbox publish failure 不回滚 accepted truth | 事务边界和 eventual propagation | `02/03` |
| handoff delivery request 不等于 delivered | delivered 必须来自正式 receipt marker | `02/03/04` |
| fake / controlled adapter 不得伪造 delivered / published success | 测试可控不等于业务成功 | `03/04/05` |
| trace / event / report / handoff / diagnostic 不保存 forbidden body 或 raw secret | 安全和隐私红线 | `00/01/03/04` |
| 配置不得关闭 audit / trace / outbox 的关键链路 | 可追溯和验收证据红线 | `00/03/06` |

### 7.3 配置影响轮廓图

```text
+--------------------------------------------------------------+
| L1-identity configuration impact outline                     |
+--------------------------------------------------------------+
runtime profile / validated config
  |
  v
inbound / operations assembly
  - command / query / consumer / job entry behavior
  - actor / metadata / visibility / redaction boundary
  |
  v
application service wiring
  - repositories / UoW
  - external resolver ports
  - publisher / handoff / report writer
  |
  v
runtime affected seams
  - role / work / governance / memory / archive adapters
  - projection / trace / audit / outbox stores
  - rebuild / refresh / reconciliation jobs
  - publish / handoff retry and target refs
  |
  v
domain invariants and ownership boundaries
  - not configurable
  - no ref reuse / no query create / no forbidden body
  - no external truth repair / no fake delivered
```

关键说明:
- 图只表达配置从 runtime assembly 影响入口、port、store、job、publisher 和 handoff。
- 图不表达 JSON、环境变量、secret manager、deployment mount、loader 函数或 adapter constructor 参数。
- Domain invariant、状态机红线、truth ownership、forbidden body 和 report-only 边界不在配置影响链路内。
- 具体配置项、默认值、校验规则和 evidence 留给新版 `03/04/05/06/07`。

### 7.4 交给详细设计展开的配置实现契约方向

| 契约方向 | `03` 需要闭口什么 | `04` 后续继续说明什么 |
|---|---|---|
| Runtime config shell | config object 边界、validated config 到 runtime builder 的注入关系 | profile 文件、来源优先级、加载校验 |
| Profile / adapter mode | local / CI / integration / replay 等 profile 与 fake / controlled / endpoint / disabled 的合法组合 | profile matrix、环境映射、越界 fail-fast |
| Config loader / validator | 缺配置、冲突配置、disabled adapter、secret missing、profile mismatch 的错误 surface | 配置项校验、cross-field rule、诊断输出 |
| External source adapter config | role / work / governance / memory / archive / artifact resolver 的 constructor 输入边界 | endpoint ref、secret ref、timeout category |
| Store / UoW / outbox / projection config | repository、transaction、append-only、projection lookup、outbox store 的装配边界 | store root、adapter mode、retention category |
| Job config | job run metadata、scope、cursor、batch、retry、timeout、report result 的协议边界 | job profile、replay / dry-run、report root |
| Publisher / handoff config | topic / target ref、publisher / handoff adapter、receipt marker 和 failure mapping | topic / target binding、retry category、failure policy |
| Redaction / visibility / forbidden body guard | policy profile 如何注入,哪些红线不可被配置覆盖 | redaction profile、safe diagnostics、secret ref 规则 |
| Config evidence | 实现、测试、验收如何输出 config digest / profile evidence | `05/06/07` 的证据矩阵和门禁 |

### 7.5 配置影响自检表

| 检查项 | 结论 | 说明 |
|---|---|---|
| 是否回指 Step 4~10 已讨论主语 | 通过 | 表中主语均来自代码主体、主要组成部分、接口、处理流、状态和异常边界 |
| 是否新增配置项清单 / 默认值 / JSON | 通过 | 只写影响类别和后续承接方向 |
| 是否让配置改变 domain invariant | 通过 | 禁止配置化边界单独列出 |
| 是否让旧 `04` 反向约束新版 `02` | 通过 | 旧 `04` 只作为风险输入 |
| 是否明确 `03/04` 分工 | 通过 | `03` 负责实现契约,`04` 负责配置填写 / 校验 / 使用说明 |

---

## 8. 复杂度判断 / 是否拆分

本 Step 不需要拆分附录。

理由:

- 配置影响只做概要轮廓,不进入配置项全集。
- 表格可以覆盖 Step 5 的 8 个主要组成部分和横切入口 / 接缝。
- 具体 profile、adapter、JSON、secret、loader、validator 和 evidence 会在新版 `03/04/05/06/07` 继续展开。

如果后续 `03` 发现 runtime config shell 或 adapter config 规模过大,应在 `03` 或 `04` 拆分,不回到 `02` 扩写配置项。

---

## 9. 回填草稿

正式 `02-概要设计.md` §11 可回填以下内容:

- 配置影响轮廓表:说明 Command / Query / Event / Job / External ports / Stores / Projection / Outbox / Handoff / Report 等概要层结构的配置影响类别。
- 禁止配置化边界表:列出 ref 不复用、query no-write、lifecycle basis、append-only、forbidden body、report-only、eventual propagation、fake delivered 等红线。
- 配置影响轮廓图:表达配置只影响 runtime assembly、adapter、store、job、publisher 和 handoff,不改变 domain invariant。
- 详细设计承接方向:把 runtime config shell、profile / adapter mode、loader / validator、external source adapter、store / job / publisher / redaction / evidence 交给 `03/04/05/06/07`。

---

## 10. 待确认事项

| 待确认项 | 为什么需要确认 | 默认处理 |
|---|---|---|
| 是否认可现有 `04-配置设计.md` 后续必须按新版 `02/03` 复核 | 当前 `04` 早于新版 `02` 完成,不能直接作为最终配置真相源 | 先完成新版 `02`,再决定是否重写 / 修补 `04` |
| 是否认可 Step 11 不写任何具体 profile 文件名 / JSON / 默认值 | 防止概要设计下沉为配置设计 | 具体配置后移新版 `04` |
| 是否认可 fake / controlled adapter 不能配置为业务成功 | 防止测试配置绕过 delivered / published 真实 marker | 作为禁止配置化边界保留 |

---

## 11. 进入 Step 12 的条件

进入 Step 12 “详细设计承接清单”前,需要用户确认:

- Step 11 的配置影响范围只识别概要层结构和接缝,没有越界定义配置项。
- 禁止配置化边界已覆盖 truth ownership、状态机、query no-write、forbidden body、report-only、eventual propagation、fake delivered 等红线。
- `03` 与 `04` 的分工可以按本 Step 承接:先由 `03` 收口实现契约,再由 `04` 说明配置填写、校验和证据。
- Step 12 可以基于 Step 4~11 汇总详细设计承接清单。
