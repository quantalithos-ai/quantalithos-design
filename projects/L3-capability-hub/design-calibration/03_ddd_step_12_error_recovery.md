# L3-capability-hub 03 详细设计 Step 12: 错误模型、异常分支与恢复口径

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 12
> 对应书写规范: `standards/document/详细设计书写规范.md` §5.11
> 当前模式: full-restart
> 当前批次: `12.7`
> 当前状态: `03_step_12_completed_with_step_13_and_step_14_controlled_reopen_sync`
> 正式文档状态: `projects/L3-capability-hub/03-详细设计.md` 仍为 historical material,本 Step 不直接修改
> 本轮口径: batch `12.7`只完成全局异常 / rollback / recovery / consistency closure、historical与cross-step audit、正式§11 assembly source和Step 13 handoff；不得进入Step 13或修改正式`03`。
> Step 13受控同步: 2026-07-18;保留`IdempotencyConflict / IdempotencyInProgress` application/public error语义,删除persisted `Conflict`暗示；committed Command / Inbound `Reserved`归consistency defect,Job仅`Reserved + matching Planned journal`可恢复；active state baseline为111 variants / 638 pairs
> Step 14受控同步: 2026-07-19;`CapabilityUnitOfWorkManager::resolve_commit`的`Durable / NotDurable / Unknown`只作为恢复判定输入；无法形成typed resolution时继续使用`CommitOutcomeUnknown`,不把timeout、replica absence或一次`None`读解释为`NotDurable`；17个`ApplicationError`、51个issue code和83 / 83 mapping不变
> Safe-text scanner controlled repair: 2026-08-09; `EmptySafeText` precedence, exact marker-to-variant mapping, collision order, representation exclusions and no-echo are closed without changing the 10-variant `ContractValueError`
> Fixed access-review reason controlled repair: 2026-08-09; recovery and replay are bound to the exact Step 6 §7.6.1 persisted reason bytes; no error variant, issue code, protocol mapping or flow cardinality changes

---

## 0. Step 12 开工确认

| 检查项 | 当前结论 |
|---|---|
| 用户确认 | 用户已确认进入 Step 12并要求按批次写入；batch `12.0~12.6`均已逐批完成并停审，随后用户确认进入`12.7`；本轮只获准完成`12.7`并在整个Step 12完成点停审 |
| 直接前序 | Step 11 batch `11.0~11.5` 已完成；22 repository traits / 110 methods、事务边界、一致性和 crash recovery 输入可用 |
| SOP / 书写规范 | 已读取 Step 12 与 §5.11；必须输出错误类型表、错误映射表、异常分支处理表和恢复口径表 |
| 当前输入完整性 | Step 6 的错误 type name / callable、Step 7 的 `ApplicationError` Port surface、Step 8 的 typed public surface、Step 9 的 83 flows、Step 10 的非法转换、Step 11 的 rollback / consistency failure 均已存在 |
| 历史材料 | 旧正式 `03-详细设计.md` 和 README 只用于污染审计,不得恢复 provider runtime、tools execution、marketplace、governance approval 或 local outbox 主线 |
| 正式文档写入 | 禁止；正式 §11 只在 Step 19 从本文件已完成内容装配 |
| 实现产物 | 禁止创建 implementation ledger、planned boundary skeleton、代码、migration、commit、run、evidence 或测试结果 |
| 当前依赖状态 | Step 12本身已闭合；原`CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001`已由Step 13显式用户授权依赖假设解除，L0-core正式设计同步为非阻塞债务 |
| 停审方式 | 每个 `12.x` 批次独立写入、自检并停审；未经用户确认不得进入下一批 |

本 Step 的错误模型只能解释既有对象、Port、协议、flow、状态和事务失败,不能借错误设计新增业务 owner、状态机、协议 envelope 或恢复产品。若后续 exact variant 无法覆盖既有 callable,必须回到对应批次修正分类；不得由实现者追加自由字符串或 adapter-private variant。

---

## 1. Step 12 批次状态表

| 批次 | 可审查产物 | 状态 | 本批完成门禁 | 下一动作 |
|---|---|---|---|---|
| `12.0` | 开工确认、输入清单、SOP 当前回答、问题诊断、设计取舍、error owner / dependency boundary、分批计划 | completed | 三个稳定 owner、四类薄包装、runtime-local source boundary、existing public surface reuse 和后续 Rustdoc / mapping 门禁均固定；未写 exact variant | completed |
| `12.1` | `ContractValueError`、`DomainError` exact Rust enum 与 variant payload | completed | Step 6全部value / object / policy / state failure已有closed typed mapping；Rustdoc完整；3项error-reachability冲突已受控回开 | 等待用户确认 `12.2` |
| `12.2` | `ApplicationError` exact Rust enum；`InfraError`、`ApiError`、`WorkerError`、`JobError` 单向薄包装 | completed_with_12_3_reopen | 17个`ApplicationError` variant、19个本批enum、7 / 7 helper、33 / 33 fallible trait owner和四类wrapper均闭合；`12.3`仅为raw-source totality补1个safe failure variant | 已被`12.3`承接 |
| `12.3` | closed issue code、确定性 issue-ref 构造、raw failure 单向映射 | completed | 51个closed code / fixed literal、deterministic ref/set、typed outcome mapper与raw source total mapping闭合；不读取raw detail | 已被`12.4`承接 |
| `12.4` | 26 Command + 33 Query 错误映射 | completed | 59 / 59 flow 逐条映射；Query typed success surface 与 error 分离；无新 response envelope | 已被`12.5`承接 |
| `12.5` | 6 Inbound + 10 Outbound + handoff / collaboration 错误映射 | completed | 16 / 16 flow 及 post-commit seam 全覆盖；typed external outcome 不降级为 error；不创建 local delivery state | 已被`12.6`承接 |
| `12.6` | 8 Operations Job planning / target / final 错误与恢复映射 | completed | 8 / 8 Job 的 initial / target / final phase、typed report、journal reentry 与 partial outcome 全覆盖 | 等待用户确认 `12.7` |
| `12.7` | 全局异常、rollback、恢复、consistency defect、historical audit、Step 6~11 closure、正式 §11 assembly source | completed | SOP 四类必备输出完整；所有错误可回指 module / protocol / flow；正式回填源和 Step 13 handoff 闭合 | 等待用户确认 Step 13 |

批次编号是本 Step 内的审查边界,不是实现 commit boundary。`12.7` 已完成后 Step 12才可标记完成；当前停在整个Step 12用户审查点,不得自动创建Step 13文件。

---

## 2. 本 Step 目标与非目标

### 2.1 必须闭合

1. 为 `contracts`、`domain` 和 `application` 固定唯一稳定错误 owner,并给出可直接实现的 exact Rust enum。
2. 固定 `infra`、`api`、`worker`、`jobs` 的本地错误包装方向,保证它们不形成第二份业务分类真相源。
3. 把 Step 6 的 value / invariant / policy / transition failure、Step 7 的 Port failure、Step 9 的每条异常分支和 Step 11 的 persistence / consistency failure 映射到唯一内部类别。
4. 复用 Step 8 已存在的 Command rejection、Query surface、Inbound receipt、Outbound collaboration outcome 和 Job response,逐协议固定 public-safe 映射。
5. 对每类错误明确 caller action:不可原样重试、可在重新读取后重试、可重试外部依赖、只可 exact replay、需人工介入或无需恢复。
6. 固定 rollback 可见性、commit outcome unknown、missing sidecar、typed-union asymmetry、index defect、external post-commit failure 和 Job partial failure 的恢复权威。
7. 固定哪些分支允许写业务 record / trace / event capture / receipt / report,哪些只能写后续 Step 15 定义的 redacted operational telemetry。
8. 形成正式 `03-详细设计.md` §11 的完整 assembly source,但只在 batch `12.7` 产出草稿,Step 19 才装配正式文档。

### 2.2 本 Step 不定义

| 后移或禁止内容 | owner / 后续位置 | 本 Step 边界 |
|---|---|---|
| 并发 retry 次数、backoff、jitter、reserve race 算法 | Step 13 | 本 Step 只标 retryability 与必须重新读取的前置条件 |
| endpoint、HTTP status 数字、RPC code 数字、broker ack / nack 参数 | Step 14 / `04-配置设计.md` 或具体 adapter binding | 本 Step 固定 typed semantic mapping,不绑定 transport 产品 |
| log field、metric、span、alert、redaction pipeline | Step 15 | 本 Step 只声明哪些异常需要 operational visibility 及禁止 raw failure |
| executable test、fixture 实现、测试结果、coverage、evidence | Step 16 / `05` / `06` | 本 Step 提供测试切口种子,不声称执行 |
| implementation phase、commit boundary、ledger / skeleton | `07-实施计划.md` | 当前严禁提前创建 |
| runtime execution、tools execution、marketplace listing | 边界外 owner | 不得包装成 capability-hub error 或恢复任务 |
| governance approval / method-library asset truth | L1-governance / L3-method-library | 本仓只处理 body-free relation / ref 的本地错误 |
| local outbox / delivery attempt / dead-letter / external retry state | external collaboration owner | 继续使用 snapshot + local capture + external typed outcome,不得新增生命周期 |

---

## 3. 已读取输入与使用边界

| 输入 | 已读取范围 | 本 Step 用途 | 禁止误用 |
|---|---|---|---|
| `详细设计讨论流程_SOP.md` Step 12 | 目标、输入、5 个问题、4 类输出、执行约束、进入条件 | 固定错误类型 / mapping / exception / recovery 必备产物 | 不把表格模板压缩成摘要 |
| `详细设计书写规范.md` §5.11 | 正式章节目标、四类必备表与三项门禁 | 固定 batch `12.7` assembly structure | 当前不直接写正式 §11 |
| `设计文档讨论中间产物规范.md` | Step 内计划、先问题 / 诊断 / 取舍后结构化、分批停审、恢复台账 | 固定 `12.0~12.7` 顺序与每批停审 | 不提前创建 Step 13 文件 |
| `设计真相源闭环与可落码性标准.md` | public carrier、stored replay、error mapping、version / sidecar / query no-write 闭环 | 防止 raw text、adapter-private code、current-truth reconstruction | 不新增第二真相源 |
| 正式 `00 / 01 / 02` | capability identity / registry / adapter descriptor / governance seam / method relation / SDK exposure owner边界 | 判断错误是否属于本仓 | 不承接 runtime execution、tools execution、marketplace 或 approval truth |
| Step 4 / 5 | 七 crate 布局、`errors.rs` 文件、依赖方向、模块暴露面 | 固定 error owner 文件和 wrapper direction | 不用 Step 12 改 crate layout |
| Step 6 current baseline | `ContractValueError` / `DomainError` type name、factory / member signatures、policy guard、state invariant、43 objects + 7 helpers | batch `12.1` 的 variant closure | 不把描述性错误类别当成已确认 variant |
| Step 7 current baseline | 36 Ports、22 repository traits / 110 methods、统一 `ApplicationError` return surface、body-free adapter boundary | batch `12.2~12.3` 的 application / raw failure mapping | 不新增 adapter-private finder 或 parallel Port error |
| Step 8 current baseline | 83 protocol schemas；existing rejection / query / receipt / response / issue-ref carrier | batch `12.3~12.6` 的 public mapping target | 不新增 generic error envelope |
| Step 9 current baseline | 26 Command + 33 Query + 6 Inbound + 10 Outbound + 8 Job = 83 / 83 flows | 逐 flow 检测点、rollback 点、typed outcome 与 replay 分支 | 不用一张 family summary 替代逐 flow mapping |
| Step 10 current baseline | 22 local state machines + 1 external boundary；111 active variants / 638 pairs；illegal transition categories | `DomainError` 与 consistency failure 的触发边界 | 不把 reserved / no-op / typed external state当异常 |
| Step 11 §§9、12~15、17~20 | repository failure、constraint timing、rollback、crash visibility、recovery authority、historical audit | persistence / consistency / commit unknown 分类与 batch `12.7` recovery | 不从 current truth 重建 missing stored surface / snapshot / journal |
| `L1-governance` Step 12 | 文件结构、错误层级、映射 / 恢复表粒度 | 仅参考表达密度 | 不复制 governance outbox、dead-letter 或领域错误语义 |

当前旧正式 `03-详细设计.md` 中的 `ProviderContract`、`CapabilityDecision`、`CostRecord`、KMS / Vault、policy refresh、runtime / tools gateway 和 outbox relay error 继续标记为 historical material。它们不能成为 exact variant、issue code、retry class 或 recovery action 的来源。

---

## 4. SOP 五个问题的当前回答

本节只固定后续推导起点。exact enum、closed code 和逐协议 mapping 必须由 `12.1~12.7` 写入,不能把本节摘要当作最终实现表。

| SOP 问题 | 当前回答 | 后续闭口批次 |
|---|---|---|
| 1. 每个模块有哪些错误类型? | `contracts` 拥有 `ContractValueError` 与 public-safe issue carrier / mapping；`domain` 拥有 `DomainError`；`application` 拥有 `ApplicationError`。`infra/api/worker/jobs` 只可提供本地薄包装,必须单向收敛到 application 或既有 public typed surface,不得建立平行业务 taxonomy。 | `12.1~12.3` |
| 2. 哪些错误映射到 HTTP / RPC / Event 失败? | Command 映射到既有 `CapabilityProtocolRejection`；Query 正常 missing、`NotVisible` 和 persisted degradation 优先保留在 `CapabilityQuerySurface`,只有无法形成合法 typed response 的失败才映射 error；Inbound 映射既有 typed receipt；Outbound 的 typed collaboration outcome 保持 outcome；Job 映射既有 typed response / report。具体 transport 数字不在本 Step 固定。 | `12.4~12.6` |
| 3. 哪些错误可重试、不可重试、需人工介入? | validation / forbidden body / policy rejection / illegal transition 不可用同一输入原样重试；optimistic conflict 只能在重新读取 current version 后重试；temporary Port unavailable 可按 Step 13 策略重试；same key + same digest 只可 exact replay；consistency defect、missing mandatory sidecar、indeterminate commit 和 impossible persisted relation 必须人工介入。 | `12.2~12.7` |
| 4. 事务失败、并发冲突、重复请求、外部依赖失败如何处理? | local UoW pre-commit failure 整体 rollback；commit unknown 不得宣称失败或重跑 mutation,必须 exact-read 恢复；version / unique conflict 不得 last-write-wins；duplicate 使用 stored typed result / receipt / report；external post-commit failure 不回滚 local truth；只有 raw failure 阻止获得 typed external outcome 时才进入 `ApplicationError`。 | `12.2`、`12.4~12.7` |
| 5. 哪些异常需要写审计、日志或事件? | rejected / invalid / not-visible / normal missing 分支不得伪造 accepted business record、trace 或 event capture。已提交 truth 的后续 external failure不得删除既有 record / trace / capture。consistency defect、commit unknown、raw dependency failure 需要 redacted operational visibility,但 exact telemetry 留 Step 15；任何日志 / issue ref / persisted reason 都不得包含 raw body 或 raw error text。 | `12.3`、`12.5~12.7`、Step 15 |

---

## 5. 当前问题诊断、改动前后与复杂度判断

### 5.1 问题诊断

| 来源 | 当前缺口 / 冲突 | Step 12 必须如何收口 |
|---|---|---|
| Step 6 | 稳定返回类型名称已存在,但除 `DomainError::InvalidStateTransition` 外,多数 `InvalidField`、`PolicyRejected`、`BodyForbidden`、`InvalidScope` 等仍是描述性类别,不是可抄写 enum | `12.1` 从全部 callable / matrix 反推 closed variants,不能把 prose 标签直接拼成无 owner 的 variant |
| Step 7 | 所有 Port / repository / UoW 都返回 `ApplicationError`,但 raw adapter / storage failure 如何单向进入该 surface 尚未定义 | `12.2~12.3` 固定 source category、closed issue code、retryability 和 raw-detail disposal |
| Step 8 | public typed surface 已完整,若 Step 12 再造 envelope 会形成第二协议真相源 | `12.4~12.6` 只填 existing carrier,不新增 response / receipt / report |
| Step 9 | 83 flow 已有失败分支和 rollback 点,但尚无逐 flow exact variant / public mapping / caller action | 分三批逐条覆盖 59 sync、16 event、8 Job,禁止只写 family-level catch-all |
| Step 10 | 638 state pair 已分类,但 reserved / no-op / illegal 与 persistence defect 的错误 owner 仍需分开 | illegal domain transition归 `DomainError`;loaded state / owner / version 不对称归 `ApplicationError`,不得混成 not-found |
| Step 11 | conflict、missing、asymmetry、commit unknown、external failure已给 recovery authority,但 exact error / retry / operator action后移本 Step | `12.2` 和 `12.7` 形成可实现分类与 recovery matrix |
| Query surface | normal missing、not-visible、persisted stale / unavailable 容易被 handler 误转为 error | 明确它们是 typed success surface；repository failure和无法形成合法 body的内部缺陷才是 error |
| external collaboration | `Failed / HandoffUnavailable` typed outcome 容易被当成 exception,继而错误回滚 local truth或创建本地 retry state | outcome保持 external owner 的 typed result；只有未取得合法 outcome 的 raw failure进入 `ApplicationError` |
| 旧正式 `03` / README | 包含 provider runtime、secret platform、governance decision、marketplace、local outbox / dead-letter 等错误主线 | 只记录 historical conflict,不得进入 variant、recovery store 或 Step 13 retry owner |

### 5.2 改动前后

| 维度 | Step 12 前 | Step 12 完成目标 |
|---|---|---|
| stable owner | 多文件列出 error type name,exact taxonomy 未闭合 | contracts / domain / application 三个唯一 owner；其余 crate 仅薄包装 |
| code shape | callable 返回稳定 type name,variant 多为 prose 类别 | public Rust enum、variant、variant payload 可 1:1 编码且 Rustdoc 完整 |
| raw failure | adapter failure 只说明不得穿透 | 每类 raw source 单向映射到 closed issue code和 `ApplicationError`,raw detail不进入 public / persistence |
| protocol mapping | existing typed carrier + flow prose | 83 / 83 flow 各有 internal error、typed mapping、caller action、write / rollback rule |
| retryability | transaction / flow 局部描述 | stable non-retry、reread-before-retry、dependency retry、exact replay、manual intervention语义分明 |
| recovery | crash visibility和authority已定义 | error category -> durable visible state -> permitted recovery -> forbidden reconstruction完整闭环 |
| operational visibility | 只知道不能伪造 evidence | 明确需要 Step 15 telemetry 的异常及 redaction / issue-ref 输入,仍不伪造日志或证据 |

### 5.3 复杂度与分批裁决

Step 12 必须拆成 8 批。原因不是文档长度本身,而是三个 exact enum owner、59 条同步协议、16 条事件协议、8 条 Job 的错误与恢复路径分别有独立审查面。若把它们压成一张总表,会遗漏 Query typed success、post-commit external outcome、Job per-target partial failure或结构体 / variant Rustdoc。

Batch `12.0`只完成推导边界。`12.1` 已按门禁闭合contracts / domain exact enum；`12.3` 之前不写 issue code；`12.4` 之前不写逐协议 mapping；`12.7` 之前不形成正式 §11 assembly source。

---

## 6. 设计取舍

| 议题 | 备选方案 | 当前裁决 | 理由 / 代价 |
|---|---|---|---|
| 稳定错误 owner | 全仓一个 mega error；每 crate 一套完整 taxonomy；三层稳定 owner | 采用 contracts / domain / application 三层 owner | 保留值校验、领域语义、编排 / Port 失败边界,同时避免七 crate taxonomy 漂移；映射工作量集中在边界处 |
| infra / entry 错误 | adapter / api / worker / jobs 自定义业务 variants；单向薄包装 | 采用单向薄包装 | 允许保留局部 source / wiring context,但禁止改变 retryability、public code或业务含义 |
| public response | 新增通用 `ErrorEnvelope`；复用 Step 8 typed surfaces | 复用既有五类 carrier | 避免协议数量、DTO schema和 stored replay surface被 Step 12 隐式扩张 |
| issue identity | raw error text hash；随机 id；扩展 `IdGeneratorPort`；closed code纯确定性构造 | 采用 closed issue code -> opaque ref 的纯确定性映射 | 同一安全类别可重现,不泄漏 adapter / body,不增加 Port或运行时随机依赖 |
| Query failure | missing / not-visible / degraded均转 error；保持 typed success | 保持 typed success | 与 Step 8 / 9 query no-write和信息隐藏契约一致,避免用 error side channel泄漏 subject |
| external failure | `Failed / HandoffUnavailable`一律异常；typed outcome和raw call failure分开 | 分开处理 | typed outcome是 external owner 的正常可表达结果；raw failure才表示未取得合法 outcome |
| recovery state | 新建本地 outbox / retry / dead-letter；复用 capture / journal / stored result与external owner | 复用现有 owner | 防止 capability-hub 私自接管 delivery lifecycle；代价是恢复必须使用 exact persisted ref和外部 Port |
| diagnostic detail | public / persisted保存原始 message；只保存closed category与body-free issue ref | 采用后者 | 满足 forbidden-body和稳定协议边界；更丰富的内部 telemetry 仍须 Step 15 按redaction契约定义 |

---

## 7. Error Owner 与依赖边界

### 7.1 三个稳定 owner

| owner 文件 | 稳定职责 | 可承接输入 | 必须输出 / 暴露 | 禁止事项 |
|---|---|---|---|---|
| `crates/contracts/src/errors.rs` | 定义 `ContractValueError`；承载 public rejection code、body-free validation issue ref及 closed issue -> public-safe ref 映射 | primitive / shared contract value validation、closed public-safe issue code | contracts 可独立使用的 value error和现有 protocol error carrier | 依赖 domain / application / infra；保存 raw value、raw body、raw error text；解释 repository / retry |
| `crates/domain/src/errors.rs` | 定义 `DomainError`,表达 domain factory、policy、invariant和state transition refusal | `ContractValueError` 的领域上下文化结果、typed current state / policy input | application可穷尽匹配的领域错误 | repository / UoW / adapter / HTTP / event / Job 语义；raw external body；retry policy |
| `crates/application/src/errors.rs` | 定义 `ApplicationError`,统一编排、missing prerequisite、conflict、idempotency、Port、persistence、consistency与commit uncertainty | `ContractValueError`、`DomainError`、Port-safe failure category和closed issue code | api / worker / jobs可穷尽映射的唯一 service error surface | 暴露 concrete DB / SDK / broker type；保存 raw exception；重新定义 domain transition；生成 transport status |

`ContractValueError -> DomainError -> ApplicationError` 是需要上下文化时的主链,但不是强制绕行链。Application 对 request / page / event / job contract validation 可直接把 `ContractValueError` 映射为 `ApplicationError`;不得为了形式统一伪造 `DomainError`。Domain 不能依赖 application,contracts 不能依赖 domain。

### 7.2 四类局部薄包装与 runtime-local source boundary

| wrapper / source boundary | 允许包装 | 单向出口 | 不得拥有 |
|---|---|---|---|
| `crates/infra/src/errors.rs` -> `InfraError` | concrete storage / transaction driver、resolver / handoff / collaboration client、config assembly 的本地 source category | application Port boundary要求的 `ApplicationError` | business variant、public code、retry attempt state、raw body |
| `crates/api/src/errors.rs` -> `ApiError` | handler / route assembly context和已完成的 typed protocol mapping | existing Command rejection或Query response/error transport handoff | 新 public envelope、domain / repository branch、HTTP数字真相源 |
| `crates/worker/src/errors.rs` -> `WorkerError` | worker loop / envelope intake / application call边界的本地 context | existing inbound receipt、outbound continuation disposition或runtime handoff | consumer truth、delivery status、dead-letter state、parallel issue code |
| `crates/jobs/src/errors.rs` -> `JobError` | runner wiring、application Job call和typed response交付 context | existing `CapabilityJobResponse<T>` / runner failure handoff | Job business report重算、scheduler lease / attempt、parallel retry taxonomy |
| binary / runtime assembly local source | process startup和dependency construction失败 | 最近的上述 wrapper | 持久化业务状态、伪造 protocol response或跨层吞错 |

这里的“薄包装”表示可附加静态 operation / component context并保留 `source`,但最终分类、retryability、issue code和public mapping必须来自 stable owner。wrapper不得通过解析 `Display` / `Debug`、HTTP status、adapter-private code或message substring重新分类。

### 7.3 依赖与映射方向

```text
primitive / contract validation
  -> ContractValueError --------------------------+
                                                     \
domain factory / policy / invariant                  -> ApplicationError
  -> DomainError -----------------------------------/       |
                                                             |
concrete adapter raw failure -> InfraError -> Port-safe map --+
                                                             |
                         +-----------------------------------+-------------------+
                         |                                   |                   |
                         v                                   v                   v
                    ApiError                            WorkerError          JobError
                         |                                   |                   |
                         v                                   v                   v
       CapabilityProtocolRejection /             typed receipt /       CapabilityJobResponse
       CapabilityQuerySurface                    collaboration outcome
```

映射方向只向外收敛,不允许 public rejection反推domain state,不允许 handler / worker / job把 public code转回 `ApplicationError`,也不允许 infra依赖 api / worker / jobs。

### 7.4 Existing public surface reuse gate

| 场景 | 必须复用 | 本 Step 禁止新增 |
|---|---|---|
| Command拒绝 | `CapabilityProtocolRejection`及其既有 code / issue refs | generic error envelope、raw message字段 |
| Query | `CapabilityQuerySurface`及 single / page response | 用 rejection表示正常 missing、`NotVisible`或persisted degradation |
| Inbound Event | `CapabilityInboundEventReceipt`及既有 typed disposition / validation issue refs | worker-private receipt、raw payload error body |
| Outbound / handoff / collaboration | 既有 typed item / outcome / capture refs | local delivery lifecycle、attempt / dead-letter DTO |
| Operations Job | `CapabilityJobResponse<T>`、typed detail / report / run issues | generic bytes decoder、untyped error report、从current truth重建结果 |
| public-safe issue | `CapabilityProtocolValidationIssueRef` | raw error string、random ref、adapter code直出 |

---

## 8. 后续批次硬门禁

### 8.1 Rust 声明与注释门禁

后续任何 Rust-facing code block都必须满足以下条件:

1. 每个 public `struct` / `enum` 有英文 `///` Rustdoc。
2. 每个 public struct field有英文 `///` Rustdoc。
3. 每个 enum variant有英文 `///` Rustdoc。
4. 每个 tuple payload和struct-like variant payload field有英文 `///` Rustdoc；enum variant field不得写 `pub`。
5. 每个 public constructor / mapper / accessor有英文 `///` Rustdoc。
6. 注释必须说明稳定语义,不能只复述字段名；不得在注释中承诺尚未定义的 HTTP code、retry次数或adapter产品。

若一批出现任何结构体、字段、variant或variant payload注释遗漏,该批自检必须判定失败,不得更新 next action。

### 8.2 分类与安全门禁

- exact variant必须closed且可穷尽匹配；禁止 `Other(String)`、`Unknown(String)`、`Adapter(String)`或message-substring分类。
- raw storage / SDK / RPC / broker failure只可作为非public source chain存在；不得进入 protocol、persisted reason、issue ref input或business record。
- issue ref只能由closed issue code确定性形成；不得扩展 `IdGeneratorPort`,不得使用随机字符串、raw body hash或raw error text hash。
- consistency defect不得映射为normal missing、no-op、`NotVisible`、empty page、duplicate或typed external failure。
- `NotVisible`、normal missing、persisted degraded / unavailable是Query typed surface,不是 `ApplicationError`。
- external `Failed / HandoffUnavailable`是可表达 typed outcome时不是错误；无法获得合法typed outcome才进入 application failure。
- rejected / failed分支不得生成accepted truth、change record、trace、event capture、stored accepted result或伪造evidence。

### 8.3 Owner 与恢复门禁

- 不新增 Port、repository finder、business object、state machine、protocol或本地外部投递状态来容纳错误。
- 不新增 local outbox、retry table、attempt record、dead-letter owner或marketplace / runtime / governance approval恢复任务。
- rollback / retry / recovery必须使用 Step 11 已声明的 durable visible state和exact ref；不得扫描current truth重建missing stored result、snapshot、capture或Job journal。
- 43 HLD objects + 7 application helpers、36 Ports、22 repository traits / 110 methods、83 protocols / flows、22 local state machines + 1 external boundary、111 active variants / 638 pairs为Step 13同步后的基线。若 exact error closure真的暴露上游缺口,必须先记录 blocker并受控回开,不能静默改计数。
- 每批完成后只更新本文件、`03_ddd_calibration_flow.md`和`project_execution_ledger.md`,然后停审。正式 `03` 与 Step 13 文件保持不变。

---

## 9. Batch `12.0` 自检与停审记录

| 检查项 | 结果 | 说明 |
|---|---|---|
| SOP问题回答 | pass | §4逐项回答五个问题并标明后续闭口批次 |
| 问题诊断 | pass | §5覆盖type name、Port、public surface、83 flows、state、persistence、Query和external outcome缺口 |
| 设计取舍 | pass | §6记录采用与未采用方案及理由 |
| owner boundary | pass | §7固定三个稳定 owner、四类薄包装、runtime-local source boundary、单向依赖和existing public surface reuse |
| 批次计划 | pass | §1固定 `12.0~12.7` 可审查产物和顺序门禁 |
| Rustdoc门禁 | pass | §8.1明确结构体、字段、enum、variant、variant payload和public callable全部需要英文 `///` |
| 未提前写结论 | pass | 本批未定义 `ContractValueError` / `DomainError` / `ApplicationError` exact variant,未写closed issue code或逐协议 mapping |
| 正式 / 实现纪律 | pass | 正式 `03-详细设计.md` 未修改；未创建 Step 13、implementation ledger、boundary skeleton、代码、commit、run、evidence或测试结果 |
| unresolved upstream blocker | pass | `0`;旧正式 `03` / README冲突保持 historical material,不阻塞 `12.1` |

```text
gate_status = 03_step_12_batch_12_0_completed_wait_user_review
next_allowed_action = wait_user_confirmation_for_03_step_12_batch_12_1
```

该历史停审点之后只允许在用户确认后读取本文件 §§3~8、Step 6全部error callable / watchpoint、Step 10非法状态转换类别和Step 4 / 5 owner边界，然后完成`12.1`；不得从`12.0`直接跨入`12.2`、closed issue code或逐协议映射。

---

## 10. Batch `12.1` 前置可达性审计与受控回开

### 10.1 审计结论

exact enum不能为没有合法触发点的旧`Result`签名制造variant。逐项反查Step 6后确认三项局部冲突,均已登记为`CH-DDD-S12-ERROR-REACHABILITY-001`并受控关闭:

| 冲突 | 旧契约问题 | 当前修正 | 影响 |
|---|---|---|---|
| possibly-empty partial set | generic typed-set factory拒绝empty,但consumer summary以empty表示complete | 新增crate-visible duplicate-only helper；仅`ConsumerViewPartialKindSet`可调用 | `ContractValueError`保留empty与duplicate的真实可达边界 |
| body-free candidate | kind / locator / digest均已validated,却返回`Result` | `ReferenceCandidate::body_free(...) -> Self` | 不再伪造candidate-construction error；forbidden body仍在scanner / policy拒绝 |
| first-four reference register | source / secret / governance / method ref factory只组装已验证typed fields,却返回`Result` | 四个`register(...) -> Self` | resolver / digest / subject对称仍由application先验证；domain不接管Step 13 codec |

同步文件:

- Step 6 §7.2、§7.10.2、§7.10.3、§7.10.5、四类reference object card及§20.20。
- Step 9 header和24处candidate、8处reference register实际调用表达式；只移除不可达的`?`,83个flow / branch / transaction / effect cardinality不变。流程图箭头、签名注释和inventory文字不计调用点。

### 10.2 Error owner裁决

| 检测位置 | 错误owner | 原因 |
|---|---|---|
| raw string进入opaque id / safe text | `ContractValueError` | primitive / shared contract value validation |
| typed set empty / duplicate、source-version set shape、positive ordinal | `ContractValueError` | contracts carrier自身可判定 |
| request缺field、route/body/schema错误 | 后续`ApplicationError` / protocol mapping | domain没有request envelope |
| 已加载对象的state / typed relation / policy guard失败 | `DomainError` | domain可用typed inputs确定 |
| repository返回missing、wrong persisted union / owner / version | 后续`ApplicationError` | 是load / persistence consistency,不是domain输入关系 |
| candidate digest codec / collision / resolver observation asymmetry | 后续`ApplicationError` | codec在Step 13,repository / Port在application |

---

## 11. `ContractValueError` Exact Contract

### 11.1 Closed supporting enum

```rust
/// Required source-version subjects for one controlled consumer view.
pub enum ConsumerViewRequiredSourceKind {
    /// Capability registry entry source.
    RegistryEntry,
    /// Accepted adapter descriptor source.
    AdapterDescriptor,
    /// Governance seam relation source.
    GovernanceSeam,
    /// Formal exposure boundary source.
    FormalExposure,
}
```

该enum只标识`ConsumerViewSourceVersionSet`四个required source category,不携带对象id、version或字段名字符串。optional method / reference marker缺失不是contract error；出现时仍必须满足subject唯一性。

### 11.2 Exact Rust enum

```rust
/// Validation failure produced while constructing capability-hub contract values.
pub enum ContractValueError {
    /// An opaque identifier is empty after trimming.
    EmptyOpaqueId,
    /// A body-free safe-text value is empty after trimming.
    EmptySafeText,
    /// A safe-text value contains a forbidden external body category.
    ForbiddenBody {
        /// Closed external body category detected before the safe value is retained.
        body_kind: ForbiddenExternalBody,
    },
    /// A typed collection that must contain at least one value is empty.
    EmptyTypedSet,
    /// A typed collection contains the same typed value more than once.
    DuplicateTypedSetValue,
    /// A controlled-view source-version set contains a marker outside its allowed source families.
    UnsupportedConsumerViewSource {
        /// Closed source marker that is not valid for a controlled consumer view.
        source: SourceVersionMarker,
    },
    /// A controlled-view source-version set omits one required source family.
    MissingConsumerViewSource {
        /// Required controlled-view source family that is absent.
        required: ConsumerViewRequiredSourceKind,
    },
    /// One source-version set contains multiple markers for the same source subject.
    DuplicateSourceVersionSubject {
        /// Source marker whose subject duplicates an earlier marker.
        source: SourceVersionMarker,
    },
    /// Two source-version sets disagree about the version of the same source subject.
    ConflictingSourceVersion {
        /// Source marker retained from the left-hand set.
        existing: SourceVersionMarker,
        /// Source marker from the right-hand set with a different version.
        incoming: SourceVersionMarker,
    },
    /// A one-based job target ordinal is zero.
    NonPositiveJobTargetOrdinal,
}
```

### 11.3 Variant触发表

| variant | exact producer | 触发条件 | 不得携带 / 推导 |
|---|---|---|---|
| `EmptyOpaqueId` | `CapabilityOpaqueId::new`及全部typed id newtype | trim后empty | 原始字符串、字段名、route |
| `EmptySafeText` | `CapabilitySafeText::new`及safe-text newtype | trim后empty | 原始正文 |
| `ForbiddenBody { body_kind }` | contracts-owned closed marker scanner -> typed category | trimmed UTF-8 bytes命中`ForbiddenExternalBody` marker registry；多类别按registry声明顺序取最早variant | 命中片段、marker literal、secret、method / governance / runtime / audit body |
| `EmptyTypedSet` | generic non-empty set factory | values empty | type name字符串 |
| `DuplicateTypedSetValue` | generic factory、possibly-empty helper、specialized set factory | typed equality发现duplicate | duplicate value的Debug / Display |
| `UnsupportedConsumerViewSource` | `ConsumerViewSourceVersionSet::try_from_markers` | marker不是registry / descriptor / seam / optional method / exposure / reference | adapter-private marker |
| `MissingConsumerViewSource` | same | 缺registry / descriptor / seam / exposure任一required family | guessed object id |
| `DuplicateSourceVersionSubject` | consumer / derived source set construction | 同一typed subject重复出现 | cursor / timestamp猜测 |
| `ConflictingSourceVersion` | `DerivedMaterialSourceVersionSet::try_union` | 同subject不同version | repository重读或last-write-wins |
| `NonPositiveJobTargetOrdinal` | `CapabilityJobExecutionTargetOrdinal::try_from_one_based` | `value == 0` | adapter cursor / index字符串 |

### 11.4 Constructor映射与优先级

| constructor family | 检测顺序 | exact result |
|---|---|---|
| opaque id | trim -> empty check | `EmptyOpaqueId` |
| safe text | trim -> empty -> forbidden scanner | `EmptySafeText`先于`ForbiddenBody`；命中正文不得保留 |
| non-empty typed set | empty -> stable duplicate scan | `EmptyTypedSet`先于`DuplicateTypedSetValue` |
| partial-kind set | stable duplicate scan；empty合法 | 只可能`DuplicateTypedSetValue` |
| consumer source-version set | empty / duplicate subject -> allowed family -> four required families | 使用上述typed variants；不得用自由missing-field字符串 |
| derived set union | left stable scan -> right stable scan -> same-subject equality | same version去重；different version=`ConflictingSourceVersion` |
| Job ordinal | zero check | `NonPositiveJobTargetOrdinal` |

`ContractValueError`不包含`Other`、raw `String`、字段名、value片段、URL、digest、adapter code或transport status。`Display` / `thiserror` message若实现,只能为每个variant输出compile-time static category text；不得格式化payload的`Debug / Display`到public / persisted error message。

### 11.5 `CapabilitySafeText` scanner oracle

The scanner contract is closed in Step 6 §7.2.1 and is repeated here because error precedence is an error-model obligation. `CapabilitySafeText::new` performs exactly one Rust Unicode `trim()`, checks emptiness, then linearly scans the trimmed UTF-8 bytes for the eight exact, case-sensitive ASCII marker literals in the shared private registry. It does not apply Unicode normalization or case-folding, decode percent/base64/JSON-escaped/PEM-encoded representations, infer semantics from keywords, or impose a scanner-specific length cap. Marker position and token boundaries are irrelevant; the marker may occur anywhere in the bytes. A repeated marker yields the same category. A malformed or near-miss marker, Unicode confusable, changed version/slug, split marker, or encoded representation that lacks the exact marker literal is safe-text at this primitive layer unless an owning raw-input mapper rejects it under its own typed source contract. A wrapper that retains the exact marker bytes still matches; the scanner never parses wrapper semantics.

The registry order is the stable conflict precedence: `ExternalCapabilitySourceBody`, `GovernanceBody`, `MethodBody`, `SecretBody`, `ExternalDocumentBody`, `RuntimeExecutionPayload`, `SdkClientBody`, then `ObservabilityBody`. The scanner evaluates all categories and returns the first category in that order, never the first textual occurrence. The registry is private, compile-time fixed, shared by production scanning and dummy corpus generation, and cannot be changed by configuration or a caller.

The empty-before-forbidden rule is strict: whitespace-only input returns `EmptySafeText` without scanning; input containing both whitespace and a marker is trimmed once and then returns the marker category if the marker remains. On every rejection, only the closed typed `body_kind` is retained. Raw input, marker text, matched span, URL, digest, hash, byte length, encoded form, and diagnostic excerpt are forbidden in errors, logs, reports, artifacts, cleanup records, and evidence. A no-marker result is not a semantic DLP clearance. Any source/Port/decoder/mapper that owns raw external body material must fail closed before invoking `CapabilitySafeText::new`; it may not convert a raw body to safe text merely because the structural scanner found no marker.

The scanner has no public callable, no new error variant, no new object, and no canonical `TC`/`DS`/`EV` identity. Its tests are targeted parameters of the existing contracts foundation and forbidden-body cases; they do not change the `43 + 7` object/helper, `250` public type, `83` flow, `189` canonical case, or `638` state-pair denominators.

---

## 12. `DomainError` Exact Contract

### 12.1 Closed context enums

```rust
/// Domain object or append-only record family that rejected an operation.
pub enum DomainObjectKind {
    /// Capability identity truth.
    CapabilityIdentity,
    /// Capability access-review fact.
    CapabilityAccessReviewFact,
    /// Capability registry entry and its initial record.
    CapabilityRegistryEntry,
    /// Body-free external capability source reference.
    ExternalCapabilitySourceReference,
    /// Adapter descriptor truth.
    AdapterDescriptor,
    /// Descriptor risk and constraint summary.
    DescriptorRiskConstraintSummary,
    /// Secret handling safe summary.
    SecretHandlingSafeSummary,
    /// Body-free external secret reference.
    SecretReference,
    /// Governance seam relation.
    GovernanceSeamRelation,
    /// Body-free governance result reference.
    GovernanceResultReference,
    /// Body-free capability-method relation.
    CapabilityMethodRelation,
    /// Body-free method-library asset reference.
    MethodAssetReference,
    /// Formal exposure boundary.
    FormalExposureBoundary,
    /// Formal visibility and applicability fact.
    FormalVisibilityApplicability,
    /// Controlled consumer view.
    ControlledConsumerView,
    /// Capability access traceability record.
    CapabilityAccessTraceabilityRecord,
    /// Capability change-impact fact.
    CapabilityChangeImpactFact,
    /// Downstream consumption-impact summary.
    DownstreamConsumptionImpactSummary,
    /// Directory search and browse projection.
    DirectoryProjection,
    /// Audit-friendly export summary.
    AuditExport,
    /// Read-only ecosystem discovery summary.
    EcosystemDiscovery,
    /// Immutable reconciliation report.
    ReconciliationReport,
    /// Canonical reference-resolution state.
    ReferenceResolutionState,
    /// External document reference.
    ExternalDocumentReference,
    /// Runtime or tools consumer reference.
    RuntimeToolsConsumerReference,
    /// SDK exposure consumer reference.
    SdkConsumerReference,
    /// Observability or audit reference.
    ObservabilityAuditReference,
    /// Append-only capability identity change record.
    IdentityChangeRecord,
    /// Append-only registry change record.
    RegistryChangeRecord,
    /// Append-only descriptor change record.
    DescriptorChangeRecord,
    /// Append-only governance seam change record.
    GovernanceSeamChangeRecord,
    /// Append-only method relation change record.
    MethodRelationChangeRecord,
    /// Append-only exposure change record.
    ExposureChangeRecord,
}

/// Domain policy family that rejected a typed input or requested effect.
pub enum DomainPolicyKind {
    /// Capability identity ownership and correction policy.
    CapabilityIdentity,
    /// Registry lifecycle and formal visibility policy.
    RegistryVisibility,
    /// Adapter descriptor and secret boundary policy.
    DescriptorBoundary,
    /// Governance seam relation boundary policy.
    GovernanceSeam,
    /// Capability-method body-free relation policy.
    MethodRelation,
    /// Formal exposure prerequisite and visibility policy.
    FormalExposure,
    /// Controlled consumer-view freshness policy.
    ConsumerViewFreshness,
    /// Derived material no-truth-write policy.
    DerivedMaterial,
    /// External reference resolution and body-free policy.
    ReferenceResolution,
}

/// Typed domain invariant family that failed before persistence.
pub enum DomainInvariantKind {
    /// A change kind does not match its previous, next, or related-reference fields.
    ChangeRecordShape,
    /// A state-dependent optional field is missing or present in the wrong state.
    StateDependentFieldShape,
    /// A replacement points to the same object or an ineligible replacement.
    ReplacementTarget,
    /// A typed set or revision does not explain one declared domain subject.
    SubjectCoverage,
    /// A source version does not match the domain object revision it claims to describe.
    SourceVersionSymmetry,
    /// A declared scope does not contain or match the typed domain member.
    ScopeMembership,
    /// A rebuildable material contains an invalid source or final-state shape.
    DerivedMaterialShape,
    /// A reconciliation report state does not match its findings or failure fields.
    ReconciliationOutcomeShape,
}

/// Typed relation checked entirely from domain values supplied to one call.
pub enum DomainRelationKind {
    /// Capability identity and access-review fact ownership.
    IdentityReview,
    /// Capability identity and registry entry ownership.
    IdentityRegistry,
    /// Registry entry and adapter descriptor ownership.
    RegistryDescriptor,
    /// Adapter descriptor and risk-summary ownership.
    DescriptorRiskSummary,
    /// Adapter descriptor, secret reference, and safe-summary ownership.
    DescriptorSecretSummary,
    /// Capability identity and governance seam ownership.
    IdentityGovernanceSeam,
    /// Capability identity and method relation ownership.
    IdentityMethodRelation,
    /// Registry, descriptor, seam, optional method, exposure, and visibility owner chain.
    FormalExposureOwnerChain,
    /// Traceability record and source change-record subject coverage.
    TraceChangeSubject,
    /// Impact fact, traceability record, and consumer ownership.
    TraceImpactConsumer,
    /// Derived material and formal source ownership.
    DerivedMaterialSource,
    /// External document and supported descriptor ownership.
    DocumentDescriptor,
}

/// Forbidden typed input rejected at a body-free domain boundary.
pub enum DomainForbiddenBoundary {
    /// A sensitive-boundary marker reports forbidden body material without retaining it.
    SensitiveBodyMarker,
    /// An exposure-safety marker forbids the submitted summary.
    ExposureSafetyMarker,
    /// An adapter descriptor candidate contains a forbidden field category.
    DescriptorField {
        /// Closed descriptor field category rejected by the boundary policy.
        field: ForbiddenDescriptorField,
    },
    /// A capability-method candidate contains a forbidden method body category.
    MethodBody {
        /// Closed method body category rejected without retaining its body.
        body: ForbiddenMethodBody,
    },
    /// A generic external reference input contains a forbidden external body category.
    ExternalBody {
        /// Closed external body category rejected without retaining its body.
        body: ForbiddenExternalBody,
    },
}

/// Domain write boundary that a caller attempted to cross.
pub enum DomainWriteBoundary {
    /// Consumer material attempted to rewrite capability identity truth.
    ConsumerToIdentity,
    /// Marketplace or ecosystem material attempted to rewrite registry visibility.
    MarketplaceToRegistry,
    /// Access-review material attempted to act as governance approval truth.
    AccessReviewToGovernanceApproval,
    /// Controlled consumer view attempted to rewrite formal exposure truth.
    ConsumerViewToExposure,
    /// Controlled consumer view attempted to rewrite its source truth.
    ConsumerViewToTruth,
    /// Derived material attempted to mutate one core truth target.
    DerivedMaterialToTruth {
        /// Core truth owner protected from the derived write.
        target: ForbiddenDerivedWriteTarget,
    },
}
```

以上supporting enums是error payload vocabulary,不是新业务对象、状态机或protocol。它们不保存id、value、reason、raw text或adapter detail。

### 12.2 Exact Rust enum

```rust
/// Domain factory, invariant, policy, and lifecycle failure in capability-hub.
pub enum DomainError {
    /// The current domain state does not allow the requested target state.
    InvalidStateTransition {
        /// Domain object whose current state rejected the transition.
        object: DomainObjectKind,
    },
    /// A requested mutation would leave the domain object unchanged.
    NoStateChange {
        /// Domain object for which no actual state or field delta exists.
        object: DomainObjectKind,
    },
    /// A domain factory cannot form a valid object from the supplied typed values.
    InvalidFormation {
        /// Domain object or record family whose formation failed.
        object: DomainObjectKind,
    },
    /// State-dependent fields or record members violate one closed invariant family.
    InvariantViolation {
        /// Domain object or record whose invariant failed.
        object: DomainObjectKind,
        /// Closed invariant family that was violated.
        invariant: DomainInvariantKind,
    },
    /// A pure domain policy rejected the supplied typed input or requested effect.
    PolicyRejected {
        /// Domain policy family that rejected the operation.
        policy: DomainPolicyKind,
    },
    /// A typed forbidden marker, field, or body category crossed a domain boundary.
    ForbiddenBoundary {
        /// Closed forbidden boundary input rejected without retaining external material.
        boundary: DomainForbiddenBoundary,
    },
    /// Two domain values supplied to one call do not describe the same typed owner relation.
    RelationMismatch {
        /// Closed domain relation whose endpoints or owner chain do not match.
        relation: DomainRelationKind,
    },
    /// A required reference state is explicit but cannot satisfy the requested domain effect.
    ReferenceStateRejected {
        /// External reference family whose canonical state was rejected.
        reference_kind: ReferenceKind,
        /// Explicit canonical state that cannot satisfy the effect.
        state: ReferenceResolutionValue,
    },
    /// A caller attempted to mutate truth across a forbidden ownership boundary.
    WriteBoundaryViolation {
        /// Closed write boundary that the caller attempted to cross.
        boundary: DomainWriteBoundary,
    },
    /// A terminal object or reference candidate cannot be reopened in place.
    TerminalStateReopenRejected {
        /// Terminal domain object that cannot be reopened in place.
        object: DomainObjectKind,
    },
}
```

### 12.3 Detection precedence

同一call可能同时观察到多个非法条件时必须使用以下顺序,防止实现者自由选variant:

1. typed forbidden marker / field / body category -> `ForbiddenBoundary`；命中正文不得继续检查或保留。
2. explicit no-write guard -> `WriteBoundaryViolation`。
3. current terminal state被要求恢复 / 再变更 -> `TerminalStateReopenRejected`。
4. current / target state pair非法 -> `InvalidStateTransition`。
5. exact same-state且没有Step 10声明的actual field delta -> `NoStateChange`。
6. supplied typed owner / ref / subject chain不对称 -> `RelationMismatch`。
7. canonical reference state显式不能满足effect -> `ReferenceStateRejected`。
8. state-dependent optional field / record / report shape错误 -> `InvariantViolation`。
9. factory无法形成合法初始对象 -> `InvalidFormation`。
10. pure policy的allow / prerequisite / scope规则拒绝 -> `PolicyRejected`。

repository missing、persisted wrong union、version conflict、index defect或commit uncertainty不走本顺序,它们由`12.2 ApplicationError`处理。Application不得把load-time persistence defect伪装成`DomainError::RelationMismatch`。

### 12.4 Domain object / policy coverage matrix

| Step 6章节 | fallible surface | exact variant families | 关键边界 |
|---|---|---|---|
| §8.2 `CapabilityIdentity` | create、activate、correction、review attach、retire | formation / transition / no-change / relation / terminal | related refs与change kind对称；retired不恢复 |
| §8.3 `CapabilityAccessReviewFact` | draft、record、supersede、invalidate、summary | formation / transition / invariant / terminal | separation marker与state对称；replacement distinct |
| §8.4 identity policy | intake、correction、consumer rewrite guard | policy / relation / reference-state / write-boundary | invalid / forbidden / expired source不形成identity |
| §8.5 source ref | replace locator | no-change / invariant | register已收紧为infallible；digest codec不归domain |
| §8.6 identity record | append | formation / invariant / relation | kind、previous/next、related refs对称 |
| §8.7 registry | register、bind、transition、basis、retire | formation / transition / no-change / relation / terminal | descriptor accepted且same entry；retired terminal |
| §8.9 registry policy | basis、transition、marketplace guard | policy / transition / write-boundary | marketplace不得定义formal visibility |
| §8.10 registry record | append | formation / invariant | kind与state delta对称 |
| §9.2 descriptor | draft、accept、unresolved、attach、replace、retire | formation / transition / forbidden / relation / no-change / terminal | forbidden marker优先；replacement distinct |
| §9.3 risk summary | derive、degrade、supersede | formation / transition / forbidden / relation / terminal | Unknown只形成Partial；Superseded terminal |
| §9.4 secret ref | replace provider | no-change / invariant | register已收紧为infallible；不重算digest |
| §9.5 secret safe summary | create、stale、unavailable、forbid | formation / transition / forbidden / relation / reference-state / terminal | Invalid / Forbidden ref不形成summary |
| §9.6 descriptor policy | validate descriptor / secret、provider-shape guard | policy / forbidden / write-boundary | forbidden descriptor field映射typed body category或provider boundary |
| §9.7 descriptor record | append | formation / invariant / relation | change kind / marker / state对称 |
| §9.8 governance seam | create、activate、degrade、forbid、replace | formation / transition / forbidden / relation / reference-state / terminal | Replaced / Forbidden terminal |
| §9.9 governance ref | replace scope | no-change / invariant | register已收紧为infallible |
| §9.10 governance policy | relation validation、review-as-approval guard | policy / forbidden / write-boundary / relation | access review永不成为approval |
| §9.11 method relation | create、activate、stale、unresolved、remove、forbid | formation / transition / forbidden / relation / reference-state / terminal | Removed / Forbidden terminal |
| §9.12 method ref | replace locator | no-change / invariant | register已收紧为infallible |
| §9.13 method policy | validate relation、body guard | policy / forbidden / relation | method body只以typed category拒绝 |
| §§9.14~9.15 relation records | append | formation / invariant / relation | kind与relation state对称 |
| §10.2 exposure | draft、pending、accept、activate、suspend、unavailable、retire | formation / transition / relation / reference-state / terminal | complete / incomplete先normalize；Retired terminal |
| §10.3 visibility | derive、reevaluate、pending、unavailable、retire | formation / transition / no-change / relation / invariant / terminal | source exposure version exact对称 |
| §10.4 exposure policy | prerequisite、validate、derive、consumer-view guard | policy / relation / invariant / write-boundary | policy不读runtime / SDK / marketplace |
| §10.5 controlled view | build、refresh、stale、rebuilding、unavailable | formation / transition / no-change / relation / policy | typed partial set决定Ready / Partial |
| §10.6 view policy | rebuild source、truth rewrite guard | policy / write-boundary / relation | required exposure不能降级成optional partial |
| §10.7 exposure record | append | formation / invariant / relation | same-state record只允许declared actual delta |
| §10.8 traceability | record、request / attach handoff、partial、recorded、supersede | formation / transition / no-change / relation / invariant / terminal | gap / superseded fields互斥；source refs解释同一subject |
| §10.9 impact fact | derive、degrade、ignore、resolve、handoff summary | formation / transition / relation / invariant | consumer必须在typed affected set |
| §10.10 downstream summary | factory、partial、delayed、unavailable、ignored | formation / transition / relation / invariant / terminal | state与observation / gap / reason exact对称 |
| §11.2 directory | build、refresh、stale、rebuilding、unavailable | formation / transition / no-change / relation / policy | derived material不反写真相 |
| §11.3 audit export | build / refresh、ref attach、redact、state changes | formation / transition / no-change / relation / invariant / policy | audit refs resolved且deduplicated；不形成evidence |
| §11.4 ecosystem discovery | build / refresh、partial、stale、unavailable | formation / transition / no-change / relation / policy | 不形成marketplace truth |
| §11.5 reconciliation report | completed-family / failed factory | formation / invariant | immutable outcome一次形成；state与failure fields对称 |
| §11.6 derived policy | validate four materials、truth mutation guard | policy / invariant / write-boundary | target使用typed `ForbiddenDerivedWriteTarget` |
| §11.7 reference state | initial、resolved / unresolved、transition、forbidden | formation / transition / no-change / forbidden / reference-state / terminal | same value+same reason=`NoStateChange`;Invalid / Forbidden candidate terminal |
| §11.8 reference policy | candidate、subject-kind、transition、explicit failure、body guard | policy / relation / transition / forbidden / reference-state | body categorytyped且不保留正文 |
| §11.9 external document ref | register、bind / rebind、replace locator | formation / no-change / relation / reference-state / invariant | descriptor binding same chain；candidate typed校验 |
| §11.10 runtime/tools ref | register、replace boundary | formation / no-change / policy / relation | 不表示execution authorization |
| §11.11 SDK ref | register、replace boundary | formation / no-change / policy / relation | 不表示SDK package publication |
| §11.12 observability/audit ref | register、replace locator | formation / no-change / policy / relation | 不形成evidence alias或raw audit owner |

42 / 42个含`DomainError`的Step 6对象 / policy / record章节均已进入本表。Step 6当前剩余fallible declarations可由上述10个variant及6个closed context enum穷尽承接；不允许实现者新增`InvalidField(String)`、`Invariant(String)`、`Policy(String)`或per-object private error enum。

### 12.5 Zero-mutation and retry baseline

| DomainError family | 对象字段 / version / time | record / trace / capture | 当前retry初判 |
|---|---|---|---|
| forbidden / write boundary | 全部不变 | 0 | 同输入不可重试 |
| invalid transition / terminal reopen | 全部不变 | 0 | 必须改变正式state / operation |
| no state change | 全部不变 | 0 | 作为stable no-op rejection；不得写same-state假revision |
| relation mismatch / invariant | 全部不变 | 0 | pre-save caller input可修正；若来自persisted load则必须升级为Application consistency defect |
| reference state rejected | 全部不变 | 0 | stale / unavailable等可等待正式reference变化；Invalid / Forbidden不可原样重试 |
| invalid formation / policy rejected | 未形成对象 | 0 | 输入或正式prerequisite改变后才可新尝试 |

本表只给Step 12当前分类基线。exact recovery class、public mapping和operator action将在`12.2~12.7`逐层闭合；本批不提前定义issue code。

### 12.6 Rustdoc与安全审计

- `ConsumerViewRequiredSourceKind`、`DomainObjectKind`、`DomainPolicyKind`、`DomainInvariantKind`、`DomainRelationKind`、`DomainForbiddenBoundary`、`DomainWriteBoundary`、`ContractValueError`和`DomainError`均有英文enum Rustdoc。
- 9个supporting / error enum的每个variant均有英文`///`。
- 所有struct-like variant payload field均有英文`///`,且variant field未写`pub`。
- payload只使用closed enum / typed state / typed source marker；没有raw `String`、body、URL、digest、adapter code、HTTP status或error text。
- enum不包含`Other` / `Unknown` / `Internal(String)`逃生口。
- `DomainError::InvalidStateTransition`名称保留并补closed object payload,与Step 6 / 10唯一既有exact variant名称一致。

---

## 13. Batch `12.1` 自检与停审记录

| 检查项 | 结果 | 说明 |
|---|---|---|
| 前置可达性审计 | pass | §10关闭3类不可达`Result`冲突并在Step 6 §20.20留痕 |
| `ContractValueError` closure | pass | 10个variant覆盖opaque id、safe text、typed set、source-version set / union和Job ordinal |
| `DomainError` closure | pass | 10个variant + 6个closed context enum覆盖42 / 42个Step 6 fallible domain章节；通用state / invariant错误携带closed object owner |
| detection precedence | pass | §12.3固定forbidden / boundary / terminal / transition / no-op / relation / reference / invariant / formation / policy顺序 |
| application boundary | pass | repository missing / persisted asymmetry / conflict / commit unknown未塞入DomainError,留`12.2` |
| Rustdoc | pass | 所有public enum、variant、variant payload field均有英文`///`;无field-level `pub` |
| raw data safety | pass | 无raw string / body / digest / adapter code / transport status payload |
| baseline count | pass | 43 HLD objects + 7 helpers、36 Ports、22 repository traits / 110 methods、83 protocols / flows；当时Step 10基线为112 / 642,现active基线由Step 13同步为111 / 638 |
| 正式 / 实现纪律 | pass | 正式`03`未修改；未创建Step 13、implementation ledger、boundary skeleton、代码、commit、run、evidence或测试结果 |
| unresolved upstream blocker | historical batch result | `0` at the time of this earlier batch;current project blocker is recorded in Step 13 as `CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001` |

```text
gate_status = 03_step_12_batch_12_1_completed_wait_user_review
next_allowed_action = wait_user_confirmation_for_03_step_12_batch_12_2
```

本批完成后必须停审。用户确认后,下一批只允许读取本文件 §§7~13、Step 7全部application Port / repository / UoW / helper错误面、Step 9 shared guards及83 flow failure分类、Step 11 §§9 / 12~15 / 17的persistence / consistency / crash recovery输入,然后定义exact `ApplicationError`与`InfraError / ApiError / WorkerError / JobError`薄包装并停审；不得提前写closed issue code或逐协议mapping。

---

## 14. Batch `12.2` 前置失败面与可达性审计

### 14.1 输入范围与计数口径

本批按门禁读取本文件 §§7~13、Step 7全部application-local helper / Port / repository / UoW surface、Step 9 shared guards与83条flow中的失败分类、Step 11 §§9、12~15、17。该段记录的是本批当时结果；Step 13后续受控回开发现的L0-core accessor blocker见本文件开篇与§53.2,不被历史批次结论覆盖。

Step 7共有36个application-owned traits。并非每个trait都能直接产生`ApplicationError`:

| trait group | 数量 | fallible surface | 本批处理 |
|---|---:|---|---|
| `CapabilityUnitOfWork` marker | 1 | 无；只提供transaction ref与checked downcast surface | 不制造不可达Port error；wrong concrete handle由repository / UoW manager报告 |
| `ClockPort` / `IdGeneratorPort` | 2 | 当前方法均infallible | runtime construction / injection失败只属于`InfraError`;不得伪造clock/id call variant |
| UoW manager | 1 | `begin / commit / rollback`返回`Result<_, ApplicationError>` | 由transaction variants承接,不混入generic Port failure |
| read gate、22 repositories、9 external Ports | 32 | 方法返回`Result<_, ApplicationError>` | 由closed `ApplicationPortKind`穷尽承接 |

因此本批覆盖33个真实fallible trait owner:1个UoW manager + 32个`ApplicationPortKind`。trait名称的documentation提及、service facade、pure domain mapper和entry handler不计Port variant；不得为了匹配36总数把infallible trait改成fallible。

### 14.2 Typed outcome与application failure分界

| 场景 | 当前分类 | 不得误分类为 |
|---|---|---|
| repository exact/current/page合法missing / empty | `Option::None`或empty page，由flow形成missing / degraded typed surface | `ApplicationError::PortFailure` |
| Query `NotVisible`、persisted degraded / unavailable | `CapabilityQuerySurface`正常typed response | application error |
| reference resolver返回`Resolved / Unresolved / Stale / Unavailable / Invalid / Forbidden / Expired` observation | 可持久化body-free typed outcome | raw dependency failure |
| handoff / collaboration返回typed failed / unavailable disposition | external owner的合法typed outcome；post-commit不回滚truth | application error |
| Port没有形成合法typed return，例如store不可用、call timeout、invalid adapter response | `ApplicationError::PortFailure` | reference state、Query degraded或external typed outcome |
| loaded row / sidecar / union / owner / source / version不对称 | `ApplicationError::ConsistencyDefect` | normal missing、not-visible、no-op或domain relation mismatch |
| stale CAS / unique / dependency fence loser | `ApplicationError::OptimisticConflict`或`ApplicationError::UniquenessConflict` | consistency defect或domain rejection |
| commit结果可能已durable但caller无法确认 | `ApplicationError::CommitOutcomeUnknown` | ordinary Port failure、rollback或blind retry |

### 14.3 Application error owner裁决

| 检测位置 | exact owner | 原因 |
|---|---|---|
| public/application value构造失败 | `ContractRejected` | 直接保留typed `ContractValueError`;不伪造domain context |
| domain callable拒绝 | `DomainRejected` | 直接保留typed `DomainError`;application可穷尽匹配 |
| operation context / page / scope / typed envelope / technical helper输入不合法 | `InvalidInput`或technical formation / invariant | application对象自身可判定且不是protocol mapping |
| required application prerequisite明确缺失 | `MissingPrerequisite` | flow无法继续,但不把所有repository `None`都升级为error |
| same key不同request、same key仍Reserved | idempotency classification | 与repository unavailable、CAS conflict和duplicate replay分开；Reserved不是第三种持久化state |
| repository / resolver / handoff / collaboration / UoW call未形成合法typed return | `PortFailure` | 只保留Port owner与safe failure class,不保留raw exception |
| loaded / stored relation不可能成立 | `ConsistencyDefect` | 需要人工/设计修复,不得降格typed missing |
| serialization / deserialization / digest verification失败 | `CodecFailure` | 是application-owned immutable surface / snapshot完整性失败,不是adapter text |

---

## 15. Application Supporting Closed Enums

### 15.1 Application technical object与invariant

```rust
/// Application-owned technical object whose formation, state, or invariant failed.
pub enum ApplicationTechnicalObjectKind {
    /// Validated metadata and channel context for one application operation.
    OperationContext,
    /// Versioned idempotency reservation and completion record.
    IdempotencyRecord,
    /// Immutable shell for one replayable public result surface.
    StoredOperationResult,
    /// Ephemeral visible, not-visible, or degraded query decision.
    ReadVisibilityDecision,
    /// Immutable serialized outbound event payload snapshot.
    EventPayloadSnapshot,
    /// Versioned local outbound event capture and stable-intent binding record.
    EventCaptureRecord,
    /// Versioned multi-target operations-job execution journal.
    JobExecutionRecord,
}

/// Application input or transient carrier whose typed shape was rejected.
pub enum ApplicationInputKind {
    /// One typed protocol request after entry envelope normalization.
    ProtocolRequest {
        /// Closed application entry channel of the request.
        channel: CapabilityOperationChannel,
    },
    /// One of the seven Step 6 application-owned technical objects.
    TechnicalObject {
        /// Closed technical object receiving the input.
        object: ApplicationTechnicalObjectKind,
    },
    /// Application-local repository page request or cursor.
    RepositoryPage,
    /// Application-local repository, scan, search, or handoff scope.
    RepositoryScope,
    /// Resolver-first read visibility result and decision mapping carrier.
    ReadVisibilityResolution,
    /// Typed command, consumer, or operations-job stored replay envelope.
    StoredReplayEnvelope,
    /// Stored-capture candidate, collaboration outcome, or collaboration item carrier.
    EventCollaborationSurface,
}

/// Closed application invariant family checked without reading raw adapter detail.
pub enum ApplicationInvariantKind {
    /// Required request fields, closed variant selection, and channel-specific body shape are invalid.
    ProtocolInputShape,
    /// Channel-specific metadata is missing, duplicated, or present on the wrong channel.
    OperationContextShape,
    /// A write-only idempotency key was requested from a query context or is absent for a write context.
    IdempotencyKeyAvailability,
    /// Reservation state and result-reference nullability are asymmetric.
    IdempotencyStateShape,
    /// Stored result kind, disposition, operation, result ref, surface ref, or digest is asymmetric.
    StoredResultShape,
    /// A read decision marker, degraded reason, subject, actor, or source-version basis is asymmetric.
    ReadVisibilityShape,
    /// Event source, schema, digest, bytes, trace, snapshot, capture, or captured time is asymmetric.
    EventCaptureShape,
    /// External collaboration outcome source or stable intent does not match the stored capture candidate.
    CollaborationOutcomeShape,
    /// External reference observation subject, kind, digest, or typed detail does not match the request.
    ReferenceObservationShape,
    /// Audit handoff outcome, requested source, and returned body-free reference are asymmetric.
    HandoffOutcomeShape,
    /// Job identity, schema, run, request digest, target plan, ordinal, outcome, issue, or final result is asymmetric.
    JobExecutionShape,
    /// A repository page, cursor, scope, filter, item owner, or stable ordering contract is invalid.
    RepositoryAccessShape,
    /// Persisted refs or owner ids do not describe the same formal object relation.
    PersistedOwnerRelation,
    /// A stored typed union variant does not match its ref, kind, or requested family.
    PersistedVariantShape,
    /// A stored ref, current row, source marker, or expected version is asymmetric.
    PersistedVersionSymmetry,
    /// A current-owner, current-state, or current-highest index has an impossible cardinality.
    CurrentIndexShape,
    /// Append-only history contains a duplicate, gap, overwrite, or noncontiguous revision.
    AppendOnlyHistoryShape,
    /// A mandatory stored result, snapshot, capture, journal, change, trace, or report sidecar is absent.
    RequiredSidecar,
    /// A dependency index hit is missing its owner or does not match the scanned source marker.
    DependencyIndexShape,
    /// A repository received a foreign, stale, nested, or otherwise invalid concrete unit-of-work handle.
    UnitOfWorkIdentity,
}

/// Typed subject whose persisted or returned relation is internally inconsistent.
pub enum ApplicationConsistencySubjectKind {
    /// One domain truth, relation, fact, record, material, or reference object.
    DomainObject {
        /// Closed domain object family whose persisted relation is inconsistent.
        object: DomainObjectKind,
    },
    /// One application-owned technical object or journal.
    TechnicalObject {
        /// Closed application technical object family whose relation is inconsistent.
        object: ApplicationTechnicalObjectKind,
    },
    /// One application Port returned an internally asymmetric typed value.
    PortReturn {
        /// Port whose successful-looking return violates its contract.
        port: ApplicationPortKind,
    },
    /// One declared cross-store relation cannot be satisfied by the loaded durable rows.
    CrossStoreRelation,
}
```

`ApplicationTechnicalObjectKind`只覆盖Step 6的7个application technical helper,不新增第8个helper。`ApplicationInputKind`补足Step 7 transient page / scope / replay / collaboration carrier,不把它们误算为HLD helper。上述context enum都只服务error payload,不是持久化对象、validation issue code或protocol enum。

### 15.2 Required prerequisite、uniqueness与codec context

```rust
/// Required typed prerequisite that an application flow could not load or prove.
pub enum ApplicationPrerequisiteKind {
    /// Capability-hub domain truth, relation, fact, or material required by the flow.
    DomainObject {
        /// Closed domain object family that was required.
        object: DomainObjectKind,
    },
    /// One application-owned technical reservation, result, snapshot, capture, or journal.
    TechnicalObject {
        /// Closed application technical object required by the flow.
        object: ApplicationTechnicalObjectKind,
    },
    /// Immutable stored replay surface or typed receipt/report envelope.
    StoredReplaySurface,
    /// Stable external collaboration intent required by an IntentBound capture.
    CollaborationIntent,
}

/// Application-level uniqueness or ownership key that rejected one write winner.
pub enum ApplicationUniqueKeyKind {
    /// Stable capability identity key.
    CapabilityIdentityKey,
    /// Current owner row for one identity, registry, descriptor, relation, exposure, view, or material family.
    CurrentOwner,
    /// Immutable append-only record or report identity.
    AppendOnlyRecord,
    /// Current canonical reference state for one typed subject.
    ReferenceSubject,
    /// Stored application result or serialized surface identity.
    StoredResult,
    /// Outbound capture uniqueness over exact source and schema.
    EventCaptureSourceSchema,
    /// Operations-job execution journal normalized-key owner.
    JobExecutionKey,
}

/// Application-owned encoding or integrity operation that failed safely.
pub enum ApplicationCodecKind {
    /// Canonical stable request digest calculation or verification.
    RequestDigest,
    /// Serialized public command result, rejection, consumer receipt, or job response surface.
    StoredResultSurface,
    /// Complete schema-versioned outbound event envelope.
    OutboundEventEnvelope,
    /// Candidate digest calculated from one immutable outbound event envelope.
    EventCandidateDigest,
}
```

`MissingPrerequisite`只用于flow已声明必须存在才能继续的typed prerequisite。普通Query missing、history page empty、optional current relation缺失或resolver业务性Unresolved不使用该variant。

### 15.3 Fallible Port owner与safe failure class

```rust
/// Application-owned Port whose call failed before producing a valid typed return.
pub enum ApplicationPortKind {
    /// Resolver-first read visibility and scope decision boundary.
    ReadVisibilityResolver,
    /// Capability identity repository.
    CapabilityIdentityRepository,
    /// Capability access-review repository.
    CapabilityAccessReviewRepository,
    /// Capability registry repository.
    CapabilityRegistryRepository,
    /// Adapter descriptor repository.
    AdapterDescriptorRepository,
    /// Descriptor risk and secret safe-summary repository.
    DescriptorSafeSummaryRepository,
    /// Governance seam relation repository.
    GovernanceSeamRepository,
    /// Capability-method body-free relation repository.
    CapabilityMethodRelationRepository,
    /// Formal exposure boundary repository.
    FormalExposureRepository,
    /// Formal visibility and applicability repository.
    FormalVisibilityRepository,
    /// Immutable capability change-record repository.
    CapabilityChangeRecordRepository,
    /// Capability access traceability repository.
    CapabilityTraceabilityRepository,
    /// Capability impact and downstream-summary repository.
    CapabilityImpactRepository,
    /// Controlled consumer-view repository.
    ControlledConsumerViewRepository,
    /// Directory, export, and ecosystem derived-material repository.
    CapabilityDerivedMaterialRepository,
    /// Immutable capability reconciliation-report repository.
    CapabilityReconciliationReportRepository,
    /// Committed capability access truth-snapshot repository.
    CapabilityTruthSnapshotRepository,
    /// Body-free external reference repository.
    CapabilityExternalReferenceRepository,
    /// Canonical reference-resolution state repository.
    ReferenceResolutionStateRepository,
    /// Application idempotency repository.
    CapabilityIdempotencyRepository,
    /// Immutable command, consumer, and job stored-result repository.
    StoredCapabilityResultRepository,
    /// Immutable payload snapshot and versioned event-capture repository.
    CapabilityEventCaptureRepository,
    /// Multi-target operations-job execution journal repository.
    CapabilityJobExecutionRepository,
    /// MCP, A2A, or API capability-source reference resolver.
    ExternalCapabilitySourceReference,
    /// Governance-result reference resolver.
    GovernanceResultReference,
    /// Method-library asset reference resolver.
    MethodAssetReference,
    /// External secret reference resolver.
    SecretReference,
    /// External document reference resolver.
    ExternalDocumentReference,
    /// Runtime, tools, and SDK consumer-reference resolver.
    CapabilityConsumerReference,
    /// Observability or audit reference resolver.
    ObservabilityAuditReference,
    /// Observability or audit body-free handoff boundary.
    ObservabilityAuditHandoff,
    /// External capability access event collaboration boundary.
    CapabilityAccessEventCollaboration,
}

/// Safe failure class supplied by an infra adapter without raw source detail.
pub enum ApplicationPortFailureKind {
    /// The dependency is temporarily unable to serve the call.
    TemporarilyUnavailable,
    /// The call timed out before a valid typed return was obtained.
    Timeout,
    /// The concrete adapter or runtime dependency is not assembled for the requested Port.
    NotConfigured,
    /// The dependency rejected the validated call for a stable non-retryable boundary reason.
    PermanentlyRejected,
    /// The dependency returned a value that violates the declared typed Port contract.
    InvalidTypedResponse,
    /// A concrete source failed but cannot be classified further without inspecting prohibited raw detail.
    UnexpectedSourceFailure,
}
```

`ApplicationPortFailureKind`共有6个variants。它不得从raw exception message、HTTP status、SQL state、SDK code、broker code或adapter-private string动态推断。Infra adapter必须用compile-time explicit match形成前5类；若selected dependency暴露的typed source不足以安全分类某个失败,只能使用`UnexpectedSourceFailure`,固定为不可自动重试、需要Step 15 redacted operational visibility与人工检查。不得为了获得更具体分类而解析禁止信息。Raw source只保留在nonpublic error source chain。

---

## 16. `ApplicationError` Exact Contract

### 16.1 Exact Rust enum

```rust
/// Application orchestration, Port, persistence, and consistency failure in capability-hub.
pub enum ApplicationError {
    /// A contracts-owned value constructor rejected one application input.
    ContractRejected(
        /// Exact closed contract validation failure.
        ContractValueError,
    ),
    /// A domain factory, policy, invariant, or lifecycle callable rejected the operation.
    DomainRejected(
        /// Exact closed domain failure.
        DomainError,
    ),
    /// One application-owned technical object cannot be formed from the supplied typed input.
    InvalidInput {
        /// Closed application input or transient carrier whose shape is invalid.
        input: ApplicationInputKind,
        /// Closed invariant that the supplied typed input violates.
        invariant: ApplicationInvariantKind,
    },
    /// One application-owned technical state transition is not allowed.
    InvalidTechnicalStateTransition {
        /// Application technical object whose current state rejected the transition.
        object: ApplicationTechnicalObjectKind,
    },
    /// One application-owned technical invariant failed before persistence or response mapping.
    TechnicalInvariantViolation {
        /// Application technical object whose invariant failed.
        object: ApplicationTechnicalObjectKind,
        /// Closed application invariant family that failed.
        invariant: ApplicationInvariantKind,
    },
    /// A flow-declared typed prerequisite is absent and no legal typed fallback exists.
    MissingPrerequisite {
        /// Closed prerequisite family required by the flow.
        prerequisite: ApplicationPrerequisiteKind,
    },
    /// A stale expected version, dependency fence, or concurrent successor rejected the write.
    OptimisticConflict {
        /// Application Port that detected the optimistic conflict.
        port: ApplicationPortKind,
    },
    /// One formal unique or current-owner key already has a different winner.
    UniquenessConflict {
        /// Application repository or store Port that detected the conflicting winner.
        port: ApplicationPortKind,
        /// Closed unique-key family that rejected the write.
        key: ApplicationUniqueKeyKind,
    },
    /// The same normalized idempotency key identifies a different channel, operation, or digest.
    IdempotencyConflict,
    /// The same normalized idempotency key is still Reserved and has no replayable terminal result.
    IdempotencyInProgress,
    /// A Port call did not produce a valid typed return.
    PortFailure {
        /// Application-owned Port whose call failed.
        port: ApplicationPortKind,
        /// Safe failure class mapped without raw adapter detail.
        failure: ApplicationPortFailureKind,
    },
    /// A local write transaction could not be opened before any staged write existed.
    TransactionBeginFailed {
        /// Safe failure class returned by the unit-of-work manager.
        failure: ApplicationPortFailureKind,
    },
    /// Commit is confirmed not durable, so the current local attempt did not become visible.
    TransactionCommitFailed {
        /// Safe failure class returned by the unit-of-work manager.
        failure: ApplicationPortFailureKind,
    },
    /// A rollback attempt failed after a pre-commit application failure.
    TransactionRollbackFailed {
        /// Safe failure class returned by the unit-of-work manager.
        failure: ApplicationPortFailureKind,
    },
    /// Commit may have become durable, but the caller cannot prove success or failure.
    CommitOutcomeUnknown,
    /// Persisted or loaded typed data violates one required cross-object or cross-store relation.
    ConsistencyDefect {
        /// Typed persisted or returned subject that contains the impossible relation.
        subject: ApplicationConsistencySubjectKind,
        /// Closed application invariant family violated by the persisted relation.
        invariant: ApplicationInvariantKind,
    },
    /// Application-owned serialization, deserialization, canonicalization, or digest verification failed.
    CodecFailure {
        /// Closed application codec or integrity operation that failed.
        codec: ApplicationCodecKind,
    },
}
```

`ApplicationError`共有17个closed variants。它不包含`NotFound`、`NotVisible`、`ExternalReferenceUnresolved`、`Other`、raw `String`、transport status、adapter code或raw source payload:

- normal missing / empty page继续由`Option` / typed surface表达。
- `NotVisible`与persisted degraded / unavailable继续由Query typed surface表达。
- external resolver的closed resolution value与handoff / collaboration typed outcome不是error。
- `MissingPrerequisite`只表示当前flow必须存在且无合法typed fallback的typed owner,不得把任意`None`机械转换为该variant。

### 16.2 Detection precedence

一个失败点只允许形成一个top-level `ApplicationError`,按以下顺序分类:

```text
ContractRejected
  -> DomainRejected
  -> InvalidInput
  -> InvalidTechnicalStateTransition
  -> TechnicalInvariantViolation
  -> MissingPrerequisite
  -> IdempotencyConflict / IdempotencyInProgress
  -> OptimisticConflict / UniquenessConflict
  -> CodecFailure
  -> PortFailure
  -> TransactionBeginFailed / TransactionCommitFailed
  -> TransactionRollbackFailed
  -> CommitOutcomeUnknown
  -> ConsistencyDefect
```

补充规则:

1. Persisted row已成功返回但typed relation不对称时必须是`ConsistencyDefect`,不能回退`PortFailure::InvalidTypedResponse`。后者只用于adapter尚未形成合法application return value。
2. CAS、unique和dependency fence有正式winner/loser语义时优先使用conflict variants；只有store call无法分类且未形成typed conflict时才是`PortFailure`。
3. Commit返回明确not-committed且rollback成功时保留transaction failure；只有durable status不可证明时使用`CommitOutcomeUnknown`。
4. Rollback failure不得覆盖原错误供public mapping使用,但top-level recovery error必须是`TransactionRollbackFailed`;原错误只可留在nonpublic source chain。
5. Completed / IntentBound / Finalized等persisted技术状态缺mandatory sidecar时使用`ConsistencyDefect`,不得用`MissingPrerequisite`暗示可补造。

### 16.3 Retry与副作用基线

| ApplicationError family | 同输入直接重试 | 前置动作 | accepted local side effect |
|---|---|---|---|
| contract / domain / invalid input / technical invariant | 否 | 修正输入、正式prerequisite或实现缺陷 | 0；若在UoW内发现则整体rollback |
| invalid technical transition | 否 | reload正式technical state或修正调用顺序 | 0 |
| missing prerequisite | 通常否 | 由owner创建/恢复exact prerequisite；不得application补造 | 0 |
| idempotency conflict | 否 | 使用原请求或新key；不得泄漏/覆盖原result | 原记录不变 |
| idempotency in progress | 可稍后exact-read | 只读取同key reservation / journal | 不运行body |
| optimistic conflict | 可在reload exact owner后新尝试 | 重新读取current persisted token / frozen journal | loser UoW为0 |
| uniqueness conflict | 取决于flow | 读取正式winner并走duplicate / rejection规则 | loser UoW为0 |
| temporary Port failure / timeout | 可由Step 13 / 14策略决定 | 使用同一typed input；不得解析raw error | local pre-commit为0；post-commit truth不回滚 |
| permanent / invalid typed / unexpected source Port response | 否,需配置/adapter修复或人工检查 | 人工或部署修复；unexpected不得靠文本重新分类 | 不形成猜测的business outcome |
| transaction begin / confirmed commit failure | 可在确认未commit后按Step 13规则 | begin失败无UoW；repository write失败保留原分类并先rollback；commit failure必须明确not-durable | 当前UoW为0 |
| rollback failed | 否 | 人工检查transaction状态 | 不宣称rollback成功 |
| commit outcome unknown | 禁止blind retry | exact idempotency / stored result / journal读取 | unknown；不得宣称0或成功 |
| consistency defect / codec failure | 否 | 人工/设计/数据修复 | 当前flow停止；不得重建missing durable sidecar |

---

## 17. Infra / Entry Thin Wrappers

### 17.1 Runtime-local source enums

```rust
/// Infra-local raw source family retained only behind one safe mapping boundary.
pub enum InfraSourceKind {
    /// Durable or fake persistence driver and query layer.
    Persistence,
    /// Local transaction manager or concrete unit-of-work handle.
    Transaction,
    /// External body-free reference resolver client.
    ReferenceResolver,
    /// Observability or audit handoff client.
    AuditHandoff,
    /// External event collaboration client.
    EventCollaboration,
    /// Serialization, deserialization, or digest implementation.
    Codec,
    /// Runtime builder, dependency injection, or configuration assembly.
    RuntimeAssembly,
}

/// Infra-local closed classification that maps one raw source into ApplicationError without text parsing.
pub enum InfraApplicationFailureKind {
    /// One non-transaction Port call failed before a valid typed return was produced.
    PortFailure {
        /// Exact application Port being implemented by the adapter.
        port: ApplicationPortKind,
        /// Safe failure class selected by an explicit concrete-source match.
        failure: ApplicationPortFailureKind,
    },
    /// A stale expected version, dependency fence, or concurrent successor lost the write race.
    OptimisticConflict {
        /// Exact repository or store Port that detected the conflict.
        port: ApplicationPortKind,
    },
    /// A formal unique or current-owner key already has a different winner.
    UniquenessConflict {
        /// Exact repository or store Port that detected the conflicting winner.
        port: ApplicationPortKind,
        /// Closed unique-key family rejected by the store.
        key: ApplicationUniqueKeyKind,
    },
    /// Unit-of-work begin failed before staged writes existed.
    TransactionBeginFailed {
        /// Safe transaction dependency failure class.
        failure: ApplicationPortFailureKind,
    },
    /// Commit is explicitly confirmed not durable.
    TransactionCommitFailed {
        /// Safe transaction dependency failure class.
        failure: ApplicationPortFailureKind,
    },
    /// Rollback failed after a pre-commit error.
    TransactionRollbackFailed {
        /// Safe transaction dependency failure class.
        failure: ApplicationPortFailureKind,
    },
    /// Commit may be durable but the adapter cannot prove its outcome.
    CommitOutcomeUnknown,
    /// A typed persisted, returned, or cross-store relation is impossible.
    ConsistencyDefect {
        /// Typed subject containing the impossible relation.
        subject: ApplicationConsistencySubjectKind,
        /// Closed invariant violated by the relation.
        invariant: ApplicationInvariantKind,
    },
    /// One application-owned codec or integrity operation failed.
    CodecFailure {
        /// Closed codec operation that failed.
        codec: ApplicationCodecKind,
    },
}

/// API-local source family before an application error or typed result is mapped outward.
pub enum ApiSourceKind {
    /// Route, RPC method, and concrete protocol operation do not match.
    RouteAssembly,
    /// Trusted request envelope metadata cannot be normalized.
    EnvelopeNormalization,
    /// The route-selected synchronous protocol schema version is unsupported.
    UnsupportedSchema,
    /// Public DTO cannot be mapped to or from the declared application surface.
    ProtocolMapping,
}

/// Worker-local source family before a receipt or continuation result is mapped to runtime handoff.
pub enum WorkerSourceKind {
    /// Inbound event header, schema, source actor, or payload dispatch boundary.
    InboundEnvelope,
    /// The inbound logical event schema version is unsupported before typed decode.
    UnsupportedSchema,
    /// The declared schema cannot be decoded into its closed typed payload.
    PayloadDecoding,
    /// Exact capture-reference collaboration continuation boundary.
    CollaborationContinuation,
    /// Projection or maintenance trigger dispatch boundary.
    MaintenanceTrigger,
}

/// Jobs-local source family before a typed job response is delivered to the runner boundary.
pub enum JobSourceKind {
    /// Job trigger, metadata, schema, or typed input normalization boundary.
    JobInput,
    /// The requested operations-job schema version is unsupported.
    UnsupportedSchema,
    /// Application job service dispatch boundary.
    ApplicationDispatch,
    /// Typed job response, report, or process-exit mapping boundary.
    JobResultMapping,
}
```

### 17.2 Exact wrapper enums

```rust
/// Infrastructure adapter or runtime assembly failure before application mapping.
pub enum InfraError {
    /// A raw adapter source has an explicit stable application-boundary classification.
    ApplicationBoundary {
        /// Closed infra source family.
        kind: InfraSourceKind,
        /// Closed mapping target chosen without parsing raw source text.
        failure: InfraApplicationFailureKind,
        /// Optional raw concrete source retained only in the nonpublic error chain.
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    },
    /// Process startup or dependency assembly failed before an application call existed.
    RuntimeAssembly {
        /// Optional raw runtime construction source retained only in the process-local error chain.
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    },
}

/// API handler or route assembly wrapper around typed protocol and application boundaries.
pub enum ApiError {
    /// API-local route, envelope, or protocol mapping failed before application dispatch.
    Source {
        /// Closed API source family.
        kind: ApiSourceKind,
        /// Optional raw local source retained only in the nonpublic error chain.
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    },
    /// Application service returned a stable error for protocol mapping.
    Application {
        /// Stable application error;transport mapping is defined in later batches.
        source: ApplicationError,
    },
}

/// Worker loop wrapper around inbound, collaboration, and maintenance application calls.
pub enum WorkerError {
    /// Worker-local intake or continuation mapping failed before application dispatch.
    Source {
        /// Closed worker source family.
        kind: WorkerSourceKind,
        /// Optional raw local source retained only in the nonpublic error chain.
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    },
    /// Application service or facade returned a stable error.
    Application {
        /// Stable application error;ack and receipt mapping is defined later.
        source: ApplicationError,
    },
}

/// Jobs runner wrapper around typed job input, application dispatch, and result delivery.
pub enum JobError {
    /// Jobs-local trigger, input, or typed result mapping failed.
    Source {
        /// Closed jobs source family.
        kind: JobSourceKind,
        /// Optional raw local source retained only in the nonpublic error chain.
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    },
    /// Application job service returned a stable error.
    Application {
        /// Stable application error;job disposition mapping is defined later.
        source: ApplicationError,
    },
}
```

四个wrapper各有2个variants。`source=Some(...)`时实现可把该值暴露为nonpublic `Error::source()` chain；`source=None`表示closed route / schema / CAS classification本身没有底层exception,不得为满足error chain伪造source。Wrapper `Display`只能输出compile-time static category text；不得把raw source `Display / Debug`复制到public response、receipt、report、persisted issue或business record。

### 17.3 Wrapper mapping与依赖纪律

| wrapper | `Source`何时使用 | `Application`何时使用 | 禁止事项 |
|---|---|---|---|
| `InfraError` | concrete adapter使用`ApplicationBoundary { failure, source }`;bootstrap使用`RuntimeAssembly` | `InfraApplicationFailureKind`由exhaustive match 1:1转换为exact `ApplicationError`;`RuntimeAssembly`不得伪造application call | infra自建business variant、把`ApplicationError`反向包回infra、根据message决定retry |
| `ApiError` | route/envelope/DTO映射失败且尚未调用service | service返回`ApplicationError` | 固定HTTP数字、创建第二error envelope |
| `WorkerError` | ingress header/dispatch或loop continuation本地失败 | consumer / collaboration / maintenance facade返回`ApplicationError` | 私建dead-letter / delivery state、重算receipt |
| `JobError` | trigger/input/result/exit映射本地失败 | application Job service返回`ApplicationError` | 重建report、创建scheduler retry taxonomy |

`ApiError / WorkerError / JobError`不得直接包装`InfraError`。Entry通过runtime assembly获得application service / facade；若startup wiring失败,process-local bootstrap可以保留`InfraError`,但不能伪造一次protocol / consumer / Job response。

`InfraApplicationFailureKind -> ApplicationError`映射必须是纯穷尽match:同名Port / conflict / transaction / consistency / codec payload直接复制。`InfraError::RuntimeAssembly`没有对应`ApplicationError`,因为此时不存在合法service invocation、protocol result、receipt或Job response。

### 17.4 Exact constructor与mapper signatures

```rust
impl ApplicationError {
    /// Preserves one exact contracts-owned validation failure at the application boundary.
    pub fn from_contract(source: ContractValueError) -> Self;

    /// Preserves one exact domain-owned failure at the application boundary.
    pub fn from_domain(source: DomainError) -> Self;
}

impl InfraApplicationFailureKind {
    /// Converts one closed infra classification into its exact stable application error.
    pub fn into_application_error(self) -> ApplicationError;
}

impl InfraError {
    /// Retains one raw adapter source with an explicit application-boundary classification.
    pub fn application_boundary(
        kind: InfraSourceKind,
        failure: InfraApplicationFailureKind,
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    ) -> Self;

    /// Retains one process startup or dependency-assembly source without fabricating an application call.
    pub fn runtime_assembly(
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    ) -> Self;

    /// Consumes one adapter error and returns its preclassified stable application error when available.
    pub fn into_application_error(self) -> Option<ApplicationError>;
}

impl ApiError {
    /// Retains one API-local source classification and optional nonpublic source chain.
    pub fn local_source(
        kind: ApiSourceKind,
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    ) -> Self;

    /// Wraps one stable application error without changing its classification.
    pub fn from_application(source: ApplicationError) -> Self;
}

impl WorkerError {
    /// Retains one worker-local source classification and optional nonpublic source chain.
    pub fn local_source(
        kind: WorkerSourceKind,
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    ) -> Self;

    /// Wraps one stable application error without changing its classification.
    pub fn from_application(source: ApplicationError) -> Self;
}

impl JobError {
    /// Retains one jobs-local source classification and optional nonpublic source chain.
    pub fn local_source(
        kind: JobSourceKind,
        source: Option<Box<dyn std::error::Error + Send + Sync + 'static>>,
    ) -> Self;

    /// Wraps one stable application error without changing its classification.
    pub fn from_application(source: ApplicationError) -> Self;
}
```

`ApplicationError::from_contract / from_domain`分别只能构造`ContractRejected / DomainRejected`。`InfraError::into_application_error`对`ApplicationBoundary`返回`Some(failure.into_application_error())`,对`RuntimeAssembly`返回`None`；不得丢弃raw source后把startup failure伪装成Port call。三个entry `local_source`只构造对应`Source`,`from_application`只构造对应`Application { source }`;均不得downcast或重写variant。

---

## 18. Application Callable与Port Coverage

### 18.1 Seven application technical helpers

| Step 6 helper | fallible surface | exact ApplicationError variants | 关键边界 |
|---|---|---|---|
| `CapabilityOperationContext` | four factories、query/write metadata guards、idempotency key accessor | `InvalidInput { ProtocolRequest / TechnicalObject(OperationContext), ProtocolInputShape / OperationContextShape / IdempotencyKeyAvailability }` | query不得获得write key；Inbound四个source metadata必须完整且对称 |
| `CapabilityIdempotencyRecord` | reserve、completed result accessor、complete | `InvalidInput`、`InvalidTechnicalStateTransition`、`TechnicalInvariantViolation(IdempotencyStateShape)`、`IdempotencyConflict` | same key不同request由service zero-write分类；committed orphan Reserved从persisted load出现时升级consistency |
| `StoredCapabilityOperationResult` | `from_surface`与typed replay envelope validation | `InvalidInput(StoredReplayEnvelope)`、`TechnicalInvariantViolation(StoredResultShape)`、`CodecFailure(StoredResultSurface)` | wrong kind/disposition/result/surface/digest不得fallback generic decoder |
| `CapabilityReadVisibilityDecision` | resolution `assert_matches / into_decision`、factory、query no-write guard | `InvalidInput(ReadVisibilityResolution)`、`TechnicalInvariantViolation(ReadVisibilityShape)` | `NotVisible`与valid degraded marker仍是typed result,不是error |
| `CapabilityEventPayloadSnapshot` | schema / digest carrier、`freeze` | `InvalidInput(TechnicalObject(EventPayloadSnapshot))`、`TechnicalInvariantViolation(EventCaptureShape)`、`CodecFailure(OutboundEventEnvelope / EventCandidateDigest)` | empty / incomplete bytes、source/schema/digest/trace/time不对称均不保存 |
| `CapabilityEventCaptureRecord` | capture、bound intent accessor、bind intent | `InvalidTechnicalStateTransition`、`TechnicalInvariantViolation(EventCaptureShape / CollaborationOutcomeShape)`、`UniquenessConflict(EventCaptureSourceSchema)` | Captured / IntentBound与intent nullability exact；typed failed outcome仍可绑定stable intent |
| `CapabilityJobExecutionRecord` | target / failure / plan factories、target/run issue mutation、finalize | `InvalidInput(TechnicalObject(JobExecutionRecord))`、`InvalidTechnicalStateTransition`、`TechnicalInvariantViolation(JobExecutionShape)` | plan/ordinal/target/outcome/final result exact；terminal outcome不可覆盖 |

所有helper在request-local、尚未持久化的typed input上失败时使用`InvalidInput / InvalidTechnicalStateTransition / TechnicalInvariantViolation`。同一shape从repository成功加载后仍不成立时,application必须改为`ConsistencyDefect { subject: TechnicalObject(...), invariant }`。

### 18.2 UoW manager coverage

| callable | exact classification | recovery boundary |
|---|---|---|
| `begin` | `TransactionBeginFailed { failure }` | no UoW / staged write；可按Step 13 / 14策略重新开始 |
| `commit`明确not-durable | `TransactionCommitFailed { failure }` | current UoW accepted visibility为0；不得调用post-commit external effect |
| `commit`durability unknown | `CommitOutcomeUnknown` | 只允许exact idempotency / stored result / journal读取；禁止blind replay |
| `rollback` failure | `TransactionRollbackFailed { failure }` | 不宣称rollback成功；进入人工/operational recovery |
| repository收到wrong concrete UoW / nested UoW | `ConsistencyDefect { subject: CrossStoreRelation, invariant: UnitOfWorkIdentity }` | wiring defect；不得adapter自行开新transaction |

#### 18.2.1 Commit-resolution 三态映射

Step 14 将既有 UoW manager 的 `resolve_commit` 绑定为恢复阶段的 authority result，而不是新的业务错误 owner。应用在调用 `commit` 前复制 `CapabilityTransactionRef`；`commit` 返回未知后只按原 transaction ref 调用一次受策略限制的 resolution wrapper。该 wrapper 必须保留三态，不得把 transport timeout、adapter exception、replica absence 或单次 `None` 读折叠成 `NotDurable`。

| resolution 输入 | application 判定 | 后续读取 / 动作 | 禁止映射 |
|---|---|---|---|
| `Ok(CapabilityCommitResolution::Durable)` | 原 UoW 已 durable | 在同一 persistence authority 上执行 Step 11 声明的完整 owner / sidecar exact read；通过 read barrier 后才 replay / continue | `TransactionCommitFailed`、zero-effect、重新执行 mutation |
| `Ok(CapabilityCommitResolution::NotDurable)` | 原 UoW 已被 authority 证明不会 durable | 读取同一 authority 的唯一键 / current owner / journal / capture，识别并发 winner；只有未发现 winner 且其它前置条件满足时，才允许新的 operation attempt | 覆盖 winner、复用旧 generated id、把“当前无行”当成证明 |
| `Ok(CapabilityCommitResolution::Unknown)` | durability 仍未知 | 在 observation budget 内按 Step 14 policy 重复 resolution；预算耗尽仍返回 `CommitOutcomeUnknown` | `TransactionCommitFailed`、rollback success、success、NotDurable |
| `Err(_)` 或无法构造 typed resolution | authority resolution 本身失败，原 commit outcome 仍未知 | 保留 redacted technical source 供 Step 15；caller-facing result 继续为 `CommitOutcomeUnknown`，除非已有独立、先于 commit 的确定性错误 | 用 timeout / `NotConfigured` / `UnexpectedSourceFailure` 推断 zero effect |

该同步只复用既有 `ApplicationError::CommitOutcomeUnknown`。`resolve_commit` 的错误 source 可以在非公开链路中保留，但不得新增 `ApplicationError` variant、issue code、持久化状态或协议字段。`Durable` 的 barrier 和 `NotDurable` 的不可再 durable 保证由同一 persistence adapter / fake 提供；普通 repository method 的签名不因此扩散 transaction session 参数。

### 18.3 Thirty-two fallible Port coverage

| ApplicationPortKind | family count | typed return / normal non-error | conflict / failure / consistency mapping |
|---|---:|---|---|
| `ReadVisibilityResolver` | 1 | `CapabilityReadVisibilityResolution`,含NotVisible / Degraded | raw call=`PortFailure`;subject/actor/source mismatch=`ConsistencyDefect(PortReturn, ReadVisibilityShape)` |
| `CapabilityIdentityRepository` | 1 | exact/current/search missing / empty合法 | CAS=`OptimisticConflict`;identity key=`UniquenessConflict(port, CapabilityIdentityKey)`;owner/version/index=`ConsistencyDefect` |
| `CapabilityAccessReviewRepository` | 1 | no current review可按flow missing / prerequisite处理 | CAS/current winner conflict；identity/state/owner mismatch=`ConsistencyDefect` |
| `CapabilityRegistryRepository` | 1 | retired excluded from current；empty page合法 | CAS/current owner conflict；identity/entry/current index mismatch=`ConsistencyDefect` |
| `AdapterDescriptorRepository` | 1 | no current Accepted/Unresolved descriptor合法 | CAS/current owner conflict；registry owner/terminal/current index mismatch=`ConsistencyDefect` |
| `DescriptorSafeSummaryRepository` | 1 | no current summary为explicit missing/degraded input | CAS/current owner conflict；descriptor/secret/summary relation mismatch=`ConsistencyDefect` |
| `GovernanceSeamRepository` | 1 | no current seam合法；Unresolved仍是current typed value | CAS/current owner conflict；identity/ref/state mismatch=`ConsistencyDefect` |
| `CapabilityMethodRelationRepository` | 1 | no current relation / empty reverse page合法 | CAS/current owner conflict；identity/asset/ref/state mismatch=`ConsistencyDefect` |
| `FormalExposureRepository` | 1 | no current exposure合法 | CAS/current owner conflict；registry owner/source version mismatch=`ConsistencyDefect` |
| `FormalVisibilityRepository` | 1 | no current visibility仅在declared flow形成prerequisite failure | CAS/current owner conflict；source exposure version mismatch=`ConsistencyDefect` |
| `CapabilityChangeRecordRepository` | 1 | exact miss / empty history可由flow处理 | duplicate append=`UniquenessConflict(port, AppendOnlyRecord)`；wrong union / subject / overwrite=`ConsistencyDefect` |
| `CapabilityTraceabilityRepository` | 1 | exact historical miss / no current trace按flow处理 | concurrent successor=`OptimisticConflict`;gap / multiple highest / wrong coverage=`ConsistencyDefect` |
| `CapabilityImpactRepository` | 1 | no impact / summary / empty page可按flow处理 | CAS/current owner conflict；trace/consumer/source mismatch=`ConsistencyDefect` |
| `ControlledConsumerViewRepository` | 1 | no view / empty consumer page可返回typed missing / empty | CAS/current owner conflict；consumer/exposure/source-version mismatch=`ConsistencyDefect` |
| `CapabilityDerivedMaterialRepository` | 1 | no material / empty search / scan合法 | CAS/current owner conflict；material owner/source/filter/page mismatch=`ConsistencyDefect` |
| `CapabilityReconciliationReportRepository` | 1 | no report / empty page合法 | duplicate append=`UniquenessConflict(port, AppendOnlyRecord)`；immutable shape mismatch=`ConsistencyDefect` |
| `CapabilityTruthSnapshotRepository` | 1 | empty stable page是合法complete scan | raw call=`PortFailure`;scope/item owner/version/page mismatch=`ConsistencyDefect` |
| `CapabilityExternalReferenceRepository` | 1 | no exact/digest ref / empty scan合法 | subject/digest uniqueness=`UniquenessConflict(port, ReferenceSubject)`；wrong union/owner=`ConsistencyDefect` |
| `ReferenceResolutionStateRepository` | 1 | no state按flow为prerequisite或typed missing | CAS/subject winner conflict；subject/kind/state-id/current index mismatch=`ConsistencyDefect` |
| `CapabilityIdempotencyRepository` | 1 | `Reserved` / `Existing`是typed reserve result | different request=`IdempotencyConflict`;transaction-visible active owner才可=`IdempotencyInProgress`;committed Command/Inbound orphan或Job journal asymmetry=`ConsistencyDefect`;save CAS=`OptimisticConflict` |
| `StoredCapabilityResultRepository` | 1 | generic/typed get absent仅在非completed optional path合法 | duplicate insert=`UniquenessConflict(port, StoredResult)`；Completed missing/asymmetric sidecar=`ConsistencyDefect`;surface codec=`CodecFailure` |
| `CapabilityEventCaptureRepository` | 1 | no capture / empty awaiting-intent scan按flow处理 | source+schema collision=`UniquenessConflict(port, EventCaptureSourceSchema)`;bind CAS=`OptimisticConflict`;snapshot/capture asymmetry=`ConsistencyDefect` |
| `CapabilityJobExecutionRepository` | 1 | no journal仅在no-reservation path合法 | key collision=`UniquenessConflict(port, JobExecutionKey)`;save CAS=`OptimisticConflict`;Reserved missing/asymmetric journal=`ConsistencyDefect` |
| `ExternalCapabilitySourceReference` | 1 | all seven `ReferenceResolutionValue` outcomes typed | raw call=`PortFailure`;subject/kind/digest mismatch=`ConsistencyDefect(PortReturn, ReferenceObservationShape)` |
| `GovernanceResultReference` | 1 | typed observation + allowed safe summary | raw call=`PortFailure`;subject/kind/digest/summary mismatch=`ConsistencyDefect` |
| `MethodAssetReference` | 1 | all closed resolution outcomes typed | raw call=`PortFailure`;subject/kind/digest mismatch=`ConsistencyDefect` |
| `SecretReference` | 1 | typed observation + safe handling summary | raw call=`PortFailure`;subject/kind/digest/summary mismatch=`ConsistencyDefect` |
| `ExternalDocumentReference` | 1 | all closed resolution outcomes typed | raw call=`PortFailure`;subject/kind/digest mismatch=`ConsistencyDefect` |
| `CapabilityConsumerReference` | 1 | runtime/tools/SDK resolution outcomes typed | raw call=`PortFailure`;selected union/kind/digest mismatch=`ConsistencyDefect` |
| `ObservabilityAuditReference` | 1 | all closed resolution outcomes typed | raw call=`PortFailure`;subject/kind/digest mismatch=`ConsistencyDefect` |
| `ObservabilityAuditHandoff` | 1 | accepted/failed/unavailable typed outcome | raw call=`PortFailure`;requested/returned ref mismatch=`ConsistencyDefect(PortReturn, HandoffOutcomeShape)` |
| `CapabilityAccessEventCollaboration` | 1 | pending/delivered/failed/unavailable typed outcome / item | raw call=`PortFailure`;source/intent/outcome mismatch=`ConsistencyDefect(PortReturn, CollaborationOutcomeShape)` |

Coverage arithmetic:

```text
read gate                1
repositories / stores   22
external Ports           9
ApplicationPortKind     32

UoW manager              1
fallible trait owners   33
infallible traits        3 = CapabilityUnitOfWork + ClockPort + IdGeneratorPort
Step 7 total traits     36
```

### 18.4 Step 9 failure-family mapping

| Step 9 placeholder family | exact ApplicationError family | 不得采取的替代 |
|---|---|---|
| request / context / selector / scope / page invariant | `InvalidInput` | raw field-name string、generic invalid request message |
| domain factory / policy / state / relation failure | `DomainRejected` | application重写domain taxonomy |
| exact required owner / state / journal / capture missing before effect | `MissingPrerequisite` | current-truth scan、生成placeholder owner |
| completed result / receipt / report missing或wrong kind | `ConsistencyDefect(TechnicalObject(StoredOperationResult), RequiredSidecar / StoredResultShape)` | rerunmutation / consumer / Job |
| reserved without matching Job journal | `ConsistencyDefect(TechnicalObject(JobExecutionRecord), RequiredSidecar / JobExecutionShape)` | rescan scope / new journal |
| source/capture/snapshot/ref/state/owner/version/union mismatch | `ConsistencyDefect` | normal missing、degraded、domain relation mismatch |
| idempotency same key different operation/digest | `IdempotencyConflict` | overwrite original、返回original body |
| idempotency same request still Reserved | `IdempotencyInProgress` only when the concrete transaction/unique mechanism proves an active matching owner | committed orphan is `ConsistencyDefect`; never rerun business body |
| stale expected version / dependency fence / concurrent successor | `OptimisticConflict` | last-write-wins、generic unavailable |
| formal unique/current owner collision | `UniquenessConflict` | overwrite winner、consistency defect catch-all |
| repository / resolver / handoff / collaboration unavailable / timeout / not configured | `PortFailure` | error text parse、typed external Unavailable伪装raw failure |
| serialization / surface / envelope / digest failure | `CodecFailure` | payload-only fallback、generic decoder guessing |
| local transaction begin / confirmed commit / rollback failure | matching transaction variant | claim external rollback、partial commit |
| local commit status unknown | `CommitOutcomeUnknown` | blind retry、宣称失败或成功 |
| external typed Failed / HandoffUnavailable | no `ApplicationError`;retain typed outcome | rollback committed truth、create local delivery lifecycle |

### 18.5 Infra与entry conversion gate

| source layer | exact conversion | hard gate |
|---|---|---|
| concrete DB/search/fake/SDK/client error | exhaustive concrete match -> `InfraApplicationFailureKind` + `InfraError::ApplicationBoundary`;Port method consumes it intosame `ApplicationError` payload | no message / status / private-code parsing |
| runtime builder/config assembly before service exists | `InfraError::RuntimeAssembly` | no fake protocol response / receipt / Job report |
| API route/envelope/schema / DTO mapping before service | `ApiError::Source { ApiSourceKind, source }` | no `ApplicationError` fabrication;public mapping later |
| Worker envelope/schema/decode/continuation mapping before service | `WorkerError::Source { WorkerSourceKind, source }` | no local dead-letter owner;receipt/ack mapping later |
| Job trigger/schema/input/result mapping before service | `JobError::Source { JobSourceKind, source }` | no runner-local report reconstruction/retry taxonomy |
| application service return at entry | `ApiError / WorkerError / JobError::Application { source }` | preserve exact `ApplicationError`;do not downcast / reclassify |

---

## 19. Batch `12.2` Cross-cutting Audit

### 19.1 Rustdoc与structure audit

- 本批所有public enum均有英文`///`。
- 每个variant、tuple payload和struct-like variant payload field均有英文`///`；variant field未写`pub`。
- `Box<dyn Error + Send + Sync>`只出现在四类local wrapper的`Source / ApplicationBoundary / RuntimeAssembly` payload,不出现在`ApplicationError`、protocol、persistence或issue-ref输入。
- `ApplicationError` payload只使用closed enum、`ContractValueError`或`DomainError`;没有raw `String`、URL、body、digest value、adapter code、HTTP status或error text。
- enum不包含`Other`、`Unknown`、`Internal(String)`、`Repository(String)`或message-substring escape hatch。

### 19.2 Boundary与baseline audit

| 检查项 | 结果 | 说明 |
|---|---|---|
| normal missing / Query surface | pass | 无`NotFound / NotVisible` application variant；typed missing / degraded / unavailable保持Step 8 surface |
| external typed outcome | pass | resolver observation与handoff / collaboration typed failed outcome不降级error |
| Port closure | pass | 32 / 32 `ApplicationPortKind` + UoW manager = 33 fallible trait owners；3个infallible trait不造variant |
| technical helper closure | pass | 7 / 7 application helpers有input/state/invariant/consistency mapping |
| transaction closure | pass | begin、confirmed commit failure、rollback failure、commit unknown分离；repository failure保留原分类 |
| consistency closure | pass | domain object、technical object、Port return、cross-store relation均有closed subject与invariant |
| wrapper direction | pass | infra只向application map；api / worker / jobs只包装source或application；无reverse dependency |
| public mapping gate | historical pass as of `12.2` | 当时未写closed issue code、issue-ref constructor、HTTP/RPC数字或59/16/8逐协议mapping；现由`12.3`在后续章节闭合code/ref,逐协议mapping仍未写 |
| baseline count | pass | 43 HLD objects + 7 helpers、36 Ports、22 repository traits / 110 methods、83 protocols / flows；Step 13同步后active为111 variants / 638 pairs |
| unresolved upstream blocker | historical batch result | `0` at that batch;current Step 13 blocker is recorded at §53.2 |

### 19.3 Historical material与禁入项

旧正式`03`和README中的provider runtime error、tool execution error、marketplace listing failure、governance approval failure、method body failure、secret platform failure、local outbox / retry / dead-letter state继续作为historical material。它们没有进入`ApplicationError`、wrapper source、Port kind、prerequisite、recovery state或retry taxonomy。

本批不创建runtime execution、tools execution、marketplace、governance approval、method-library asset truth、SDK client、local delivery lifecycle、scheduler lease / attempt或新的recovery Job。

---

## 20. Batch `12.2` 自检与停审记录

| 检查项 | 结果 | 说明 |
|---|---|---|
| input / failure audit | pass | §§14~15分离typed outcome、normal missing、application failure和33个fallible trait owner |
| `ApplicationError` closure | pass | 17个closed variants覆盖contract/domain、application input/state/invariant、prerequisite、idempotency、conflict、Port、transaction、consistency与codec |
| wrapper closure | pass | `InfraError / ApiError / WorkerError / JobError`均有exact Rust enum；entry wrapper只Source/Application,infra通过closed mapping target单向进入application |
| helper coverage | pass | 7 / 7 application technical helper全部映射 |
| Port coverage | pass | 32 / 32 `ApplicationPortKind`;加UoW manager后33 / 33 fallible traits；3个infallible traits无不可达variant |
| Step 9 failure coverage | pass | shared failure family均有exact top-level variant；typed external outcome不误算error |
| Step 11 recovery baseline | pass | rollback、conflict、commit unknown、missing sidecar、journal/capture recovery authority保持不变 |
| Rustdoc | pass | 所有新增public enum、variant、tuple payload与struct-like payload field均有英文`///`;无field-level `pub` |
| raw data safety | pass | raw source只存在local wrapper error chain；不进入application/public/persisted payload |
| 正式 / 实现纪律 | pass | 正式`03`未修改；未创建Step 13、implementation ledger、boundary skeleton、代码、commit、run、evidence或测试结果 |
| unresolved upstream blocker | historical batch result | `0` at that batch;current Step 13 blocker is recorded at §53.2 |

```text
gate_status = 03_step_12_batch_12_2_completed_wait_user_review
next_allowed_action = wait_user_confirmation_for_03_step_12_batch_12_3
```

本批完成后必须停审。用户确认后,下一批只允许读取本文件 §§7~20、Step 8 existing validation issue / rejection / receipt / report carrier、Step 9 safe issue-ref形成占位、`设计真相源闭环与可落码性标准.md`的raw-error / redaction门禁，以及Step 7 / 9 / 11已写明的Step 15 handoff边界,然后定义closed issue code、确定性issue-ref构造和raw failure单向映射并停审；不得提前写59条同步协议、16条事件协议或8条Job逐协议mapping。

---

## 21. Batch `12.3` 输入反查、缺口与受控回开

### 21.1 已读取输入与本批使用边界

| 输入 | 读取结论 | 本批使用 | 不得提前进入 |
|---|---|---|---|
| 本文件 §§7~20 | 三层error owner、17个`ApplicationError`、四类wrapper与typed outcome边界已闭合 | 反推application / entry issue code与raw mapping | 不改59 / 16 / 8逐flow mapping |
| Step 8 §§6.1 / 6.3 / 6.5 / 6.6 / 6.8 | issue-ref只有opaque tuple carrier；Query有8 degraded kinds；Command rejection、Inbound receipt与Job report均已有typed carrier | 保留existing response shape并补唯一code/ref constructor | 不新增generic error envelope或DTO field |
| Step 9 safe issue-ref placeholders | Query reference/material分支、Inbound rejection/quarantine、Job run / target issue和collaboration status均等待exact safe ref | 固定family-level mapper输入/输出和normal-no-issue边界 | 不替换83条flow中的占位或写逐protocol表 |
| 真相源闭环标准 | status marker必须来自formal typed decision；adapter outcome必须typed；stored replay复制原surface；raw string不得驱动分类 | 固定closed code、exact literal、raw disposal与replay规则 | 不把opaque ref当truth或current-state reconstruction key |
| Step 7 audit handoff / collaboration outcome | handoff `Accepted / Unavailable / Rejected / Retryable`和collaboration五态是typed result；只有无法取得合法result才是`ApplicationError` | 分离typed outcome code与raw call failure | 不创建local delivery state、attempt或dead letter |
| Step 11 / Step 15 handoff | consistency/commit/raw dependency需operational visibility,但log/metric/span/audit field留Step 15 | 只标visibility requirement和redaction输入 | 不声称日志、告警、run或evidence已存在 |

### 21.2 发现的构造缺口

`CapabilityProtocolValidationIssueRef`旧定义公开包裹任意`CapabilityOpaqueId`,却没有code-based constructor。已有`CapabilityOpaqueId::new(runtime String)`虽可校验non-empty,仍会迫使每个mapper手工拼literal并处理理论上不可达的`ContractValueError`,也无法阻止random id、raw-error hash或adapter-private字符串进入ref。

该缺口登记为`CH-DDD-S12-ISSUE-REF-CONSTRUCTION-001`,已按最小面受控回开:

| 回开位置 | 修改 | 为什么是最小面 | baseline影响 |
|---|---|---|---|
| Step 6 `CapabilityOpaqueId` | 新增crate-visible `from_audited_static(&'static str) -> Self` | 只关闭compile-time已证明non-empty literal；runtime输入仍走fallible `new` | 无新type / object / field / Port |
| Step 8 shared carrier | 新增51-variant `CapabilityIssueCode`;issue ref/set inner field收private；补literal/parser/ref/set callable | contracts是public issue唯一owner；application/entry只依赖它 | public type 249 -> 250；83 protocols与DTO fields不变 |
| 本Step | 固定51个literal和所有mapper | error taxonomy owner在Step 12 | 无新response envelope / flow |

### 21.3 Raw-source totality缺口

`ApplicationPortFailureKind`原5类要求adapter以concrete exhaustive match分类,但“concrete dependency只返回不透明typed error,且进一步分类必须解析message / status / private code”的分支没有合法结果。强行选temporary / permanent会伪造retryability,丢弃分支则不穷尽。

该缺口登记为`CH-DDD-S12-RAW-FAILURE-TOTALITY-001`。本批对`12.2`做同文件最小回开,新增`UnexpectedSourceFailure`。它只表示“调用失败但禁止进一步读取raw detail”,固定不可自动重试且需要人工检查；不携带source、不形成第二taxonomy、不改变17个`ApplicationError`或33个fallible trait owner。该段的`0`是当时Step 12局部检查结果；当前Step 13 blocker见§53.2。

---

## 22. Closed `CapabilityIssueCode` 与 Fixed Literal

### 22.1 Exact owner与Rust surface

`CapabilityIssueCode`及`CapabilityProtocolValidationIssueRef`全部归`crates/contracts/src/errors.rs`。Exact enum、51个variant Rustdoc、private tuple fields与11个public callable已同步写入Step 8 §§6.1 / 6.3 / 6.5；本节固定每个variant的唯一wire literal和semantic source。Application不得定义`ApplicationIssueCode`,entry不得定义channel-local code。

### 22.2 Protocol validation与safe-surface literals

| CapabilityIssueCode | exact fixed literal | typed source /使用边界 |
|---|---|---|
| `InvalidEnvelope` | `capability-hub.issue/invalid-envelope.v1` | envelope metadata缺失/不对称 |
| `MissingRequiredField` | `capability-hub.issue/missing-required-field.v1` | required typed field absent；ref不携带field name |
| `OperationMismatch` | `capability-hub.issue/operation-mismatch.v1` | route/name/body selected operation不对称 |
| `InvalidField` | `capability-hub.issue/invalid-field.v1` | typed field / enum combination invalid |
| `InvalidScope` | `capability-hub.issue/invalid-scope.v1` | actor/target/filter/page/job scope invalid |
| `DuplicateConflict` | `capability-hub.issue/duplicate-conflict.v1` | public same-key different-request rejection |
| `PolicyRejected` | `capability-hub.issue/policy-rejected.v1` | stable domain/boundary policy rejection |
| `BodyForbidden` | `capability-hub.issue/body-forbidden.v1` | typed forbidden marker/body category；不保存命中内容 |
| `UnsupportedSchema` | `capability-hub.issue/unsupported-schema.v1` | closed protocol schema version unsupported |
| `SubjectMissing` | `capability-hub.issue/subject-missing.v1` | visible declared subject absent；normal visible missing only在协议要求issue时使用 |
| `ReferenceUnresolved` | `capability-hub.issue/reference-unresolved.v1` | typed canonical reference value `Unresolved` |
| `ReferenceUnavailable` | `capability-hub.issue/reference-unavailable.v1` | typed canonical reference value `Unavailable` |
| `StaleSource` | `capability-hub.issue/stale-source.v1` | stale/expired source或persisted stale material |
| `MaterialRebuilding` | `capability-hub.issue/material-rebuilding.v1` | persisted rebuilding material |
| `MaterialUnavailable` | `capability-hub.issue/material-unavailable.v1` | persisted unavailable material/report |
| `PartialSurface` | `capability-hub.issue/partial-surface.v1` | formally allowed partial body/report |
| `RedactedBoundary` | `capability-hub.issue/redacted-boundary.v1` | Invalid/Forbidden reference或visibility redaction |
| `RetryRequired` | `capability-hub.issue/retry-required.v1` | typed delayed inbound prerequisite；不含backoff参数 |
| `BoundaryQuarantined` | `capability-hub.issue/boundary-quarantined.v1` | typed inbound quarantine boundary |
| `TerminalTargetSkipped` | `capability-hub.issue/terminal-target-skipped.v1` | Job exact terminal target stable skip |
| `HandoffRejected` | `capability-hub.issue/handoff-rejected.v1` | typed audit handoff `Rejected` |
| `HandoffUnavailable` | `capability-hub.issue/handoff-unavailable.v1` | typed audit handoff `Unavailable` |
| `HandoffRetryable` | `capability-hub.issue/handoff-retryable.v1` | typed audit handoff `Retryable` |
| `CollaborationFailed` | `capability-hub.issue/collaboration-failed.v1` | typed collaboration status `Failed` |
| `CollaborationUnavailable` | `capability-hub.issue/collaboration-unavailable.v1` | typed collaboration `HandoffUnavailable` |

`SubjectMissing`不是把所有`Option::None`错误化。Query visible normal missing、empty page、NotVisible和complete zero-target Job默认不产生issue ref；只有具体协议在`12.4 / 12.6`明确要求可见missing marker时才使用该code。

### 22.3 Application与entry technical literals

| CapabilityIssueCode | exact fixed literal | unique source |
|---|---|---|
| `InvalidApplicationInput` | `capability-hub.issue/invalid-application-input.v1` | `ApplicationError::InvalidInput` |
| `InvalidTechnicalStateTransition` | `capability-hub.issue/invalid-technical-state-transition.v1` | matching application variant |
| `TechnicalInvariantViolation` | `capability-hub.issue/technical-invariant-violation.v1` | matching application variant |
| `MissingPrerequisite` | `capability-hub.issue/missing-prerequisite.v1` | matching application variant |
| `OptimisticConflict` | `capability-hub.issue/optimistic-conflict.v1` | matching application variant |
| `UniquenessConflict` | `capability-hub.issue/uniqueness-conflict.v1` | matching application variant |
| `IdempotencyConflict` | `capability-hub.issue/idempotency-conflict.v1` | matching application variant |
| `IdempotencyInProgress` | `capability-hub.issue/idempotency-in-progress.v1` | matching application variant |
| `DependencyFailure` | `capability-hub.issue/dependency-failure.v1` | any `ApplicationError::PortFailure`;Port/failure payload不进入ref |
| `TransactionBeginFailed` | `capability-hub.issue/transaction-begin-failed.v1` | matching application variant |
| `TransactionCommitFailed` | `capability-hub.issue/transaction-commit-failed.v1` | matching application variant |
| `TransactionRollbackFailed` | `capability-hub.issue/transaction-rollback-failed.v1` | matching application variant |
| `CommitOutcomeUnknown` | `capability-hub.issue/commit-outcome-unknown.v1` | matching application variant |
| `ConsistencyDefect` | `capability-hub.issue/consistency-defect.v1` | matching application variant |
| `CodecFailure` | `capability-hub.issue/codec-failure.v1` | matching application variant |
| `RuntimeAssemblyFailed` | `capability-hub.issue/runtime-assembly-failed.v1` | `InfraError::RuntimeAssembly`;process-local only,无protocol invocation |
| `ApiRouteAssemblyFailed` | `capability-hub.issue/api-route-assembly-failed.v1` | `ApiSourceKind::RouteAssembly` |
| `ApiEnvelopeNormalizationFailed` | `capability-hub.issue/api-envelope-normalization-failed.v1` | `ApiSourceKind::EnvelopeNormalization` |
| `ApiProtocolMappingFailed` | `capability-hub.issue/api-protocol-mapping-failed.v1` | `ApiSourceKind::ProtocolMapping` |
| `WorkerInboundEnvelopeFailed` | `capability-hub.issue/worker-inbound-envelope-failed.v1` | `WorkerSourceKind::InboundEnvelope` |
| `WorkerPayloadDecodingFailed` | `capability-hub.issue/worker-payload-decoding-failed.v1` | `WorkerSourceKind::PayloadDecoding` |
| `WorkerCollaborationContinuationFailed` | `capability-hub.issue/worker-collaboration-continuation-failed.v1` | matching worker source |
| `WorkerMaintenanceTriggerFailed` | `capability-hub.issue/worker-maintenance-trigger-failed.v1` | matching worker source |
| `JobInputFailed` | `capability-hub.issue/job-input-failed.v1` | `JobSourceKind::JobInput` |
| `JobApplicationDispatchFailed` | `capability-hub.issue/job-application-dispatch-failed.v1` | matching jobs source |
| `JobResultMappingFailed` | `capability-hub.issue/job-result-mapping-failed.v1` | matching jobs source |

`ApiSourceKind::UnsupportedSchema`、`WorkerSourceKind::UnsupportedSchema`与`JobSourceKind::UnsupportedSchema`全部复用`UnsupportedSchema`;它是同一public semantic category,不是channel-private code。Application payload context、Port kind、constraint key、object kind和raw source都只留内部分类,不改变code。

### 22.4 Literal compatibility与反解析门禁

1. 51个literal均为固定compile-time ASCII值,namespace `capability-hub.issue/`,version suffix `.v1`;同一variant在所有channel使用同一值。
2. `CapabilityIssueCode::literal()`必须穷尽所有51个variant；不得用`Debug`、case conversion、serde rename inference或macro默认命名生成wire value。
3. `from_literal`只用于反序列化/compatibility validation,必须exact-match已知51值；unknown返回`None`,不得映射`Other / Unknown`。
4. Application与entry不允许根据opaque literal反推retry、Port、object、subject或transport。所有内部决策必须先持有typed source/code；ref是单向public-safe输出。
5. 现有literal不得改名或复用。未来新增semantic code只能追加新variant + 新literal + mapping / test / compatibility更新；删除需显式schema migration,不能静默alias。
6. Code必须`Clone + Copy + Eq + PartialEq`,ref/set必须`Clone + Eq + PartialEq`;serialization按transparent value输出。Stable dedup使用顺序比较,不依赖hash-map iteration。

---

## 23. Deterministic Issue-ref 与 Set Construction

### 23.1 Exact pure construction

```text
typed closed source
  -> exhaustive mapper returns CapabilityIssueCode
  -> CapabilityIssueCode::literal() returns &'static str
  -> CapabilityOpaqueId::from_audited_static(literal)
  -> CapabilityProtocolValidationIssueRef
```

该路径是pure、infallible、无I/O、无clock、无random、无hash。它不扩展`IdGeneratorPort`,不使用Step 13 request digest/candidate digest算法,也不把raw source丢进hash后伪装安全。

### 23.2 Set规则

| constructor | input | exact behavior | failure / forbidden |
|---|---|---|---|
| `empty()` | none | empty vector | normal no-issue唯一便捷入口 |
| `from_codes(Vec<Code>)` | typed closed codes | stable first-occurrence wins；later duplicate删除；empty合法 | 不排序、不随机化、不按literal hash |
| `try_from_refs(Vec<Ref>)` | trusted stored / decoded refs | stable order保留；duplicate=`DuplicateTypedSetValue`;empty合法 | unknown arbitrary opaque ref必须在decode前拒绝 |
| `iter()` | set | stored stable order borrow | 不暴露mutable vector |
| `is_empty()` | set | pure bool | 不把empty解释为success；outer disposition决定语义 |

Stored replay必须复制原`CapabilityProtocolValidationIssueRefSet`及顺序,不得重新运行current mapper。Fresh construction若同一原因在多个target出现,每个`CapabilityJobTargetIssue`可持有相同ref；response-level set去重不删除target rows。

### 23.3 Normal branches that produce no issue

| typed branch | issue set | 原因 |
|---|---|---|
| visible normal missing / empty page | empty,除非后续protocol明确可见missing marker | missing不是technical failure |
| Query `NotVisible` | empty且body absent | 不通过issue side channel泄漏existence/reason |
| accepted no-op / `NoLocalEffect` | empty | no-op marker已表达语义,不是错误 |
| duplicate stored replay | original stored set | 不新增`StoredReplay` issue code；marker/disposition已表达replay |
| complete zero-target Job | empty | 合法complete scan不是planning failure |
| reference `Resolved` | empty | healthy typed value |
| collaboration `Candidate / PendingDelivery / Delivered` | empty | typed status已表达；pending不自动等于failure |
| audit handoff `Accepted` | empty | receipt ref承担accepted result |

---

## 24. Typed Source to Closed Code Mapping

### 24.1 ApplicationError pure mapper

```rust
impl ApplicationError {
    /// Returns the stable public-safe issue classification for this application error.
    pub fn issue_code(&self) -> CapabilityIssueCode;

    /// Returns the deterministic body-free issue reference for this application error.
    pub fn issue_ref(&self) -> CapabilityProtocolValidationIssueRef;
}

/// Maps one canonical reference value to an optional read-surface issue classification.
pub fn issue_code_for_reference_read_surface(
    value: &ReferenceResolutionValue,
) -> Option<CapabilityIssueCode>;

/// Maps one typed audit-handoff disposition to an optional body-free issue classification.
pub fn issue_code_for_handoff(
    disposition: &CapabilityHandoffDisposition,
) -> Option<CapabilityIssueCode>;

/// Maps one typed event-collaboration status to an optional body-free issue classification.
pub fn issue_code_for_collaboration(
    status: &EventCollaborationStatus,
) -> Option<CapabilityIssueCode>;

impl InfraApplicationFailureKind {
    /// Maps one closed infrastructure classification without inspecting its raw source.
    pub fn issue_code(&self) -> CapabilityIssueCode;
}

impl InfraError {
    /// Maps this infrastructure wrapper without reading or formatting its source chain.
    pub fn issue_code(&self) -> CapabilityIssueCode;
}

impl ApiError {
    /// Maps this API-local or application error to its stable body-free issue code.
    pub fn issue_code(&self) -> CapabilityIssueCode;
}

impl WorkerError {
    /// Maps this worker-local or application error to its stable body-free issue code.
    pub fn issue_code(&self) -> CapabilityIssueCode;
}

impl JobError {
    /// Maps this jobs-local or application error to its stable body-free issue code.
    pub fn issue_code(&self) -> CapabilityIssueCode;
}
```

| ApplicationError variant | CapabilityIssueCode | payload handling |
|---|---|---|
| `ContractRejected(EmptyOpaqueId / EmptySafeText / EmptyTypedSet / DuplicateTypedSetValue / UnsupportedConsumerViewSource / MissingConsumerViewSource / DuplicateSourceVersionSubject / ConflictingSourceVersion / NonPositiveJobTargetOrdinal)` | `InvalidField` | 9个exact non-body variants穷尽match；typed payload不格式化 |
| `ContractRejected(ForbiddenBody { .. })` | `BodyForbidden` | typed body category不进入ref |
| `DomainRejected(ForbiddenBoundary { .. })` | `BodyForbidden` | typed forbidden payload不进入ref |
| `DomainRejected(WriteBoundaryViolation { .. })` | `PolicyRejected` | ownership boundary不等于检测到body |
| `DomainRejected(PolicyRejected { .. })` | `PolicyRejected` | policy kind不进入ref |
| `DomainRejected(ReferenceStateRejected { state: Unresolved, .. })` | `ReferenceUnresolved` | reference kind不进入ref |
| `DomainRejected(ReferenceStateRejected { state: Unavailable, .. })` | `ReferenceUnavailable` | reference kind不进入ref |
| `DomainRejected(ReferenceStateRejected { state: Stale / Expired, .. })` | `StaleSource` | reference kind不进入ref |
| `DomainRejected(ReferenceStateRejected { state: Invalid / Forbidden, .. })` | `RedactedBoundary` | body/state detail不进入ref |
| `DomainRejected(ReferenceStateRejected { state: Resolved, .. })` | `PolicyRejected` | defensive total mapping；domain constructor仍必须拒绝形成该error |
| `DomainRejected(InvalidFormation / InvariantViolation / RelationMismatch)` | `InvalidField` | typed formation/relation不成立；object/context payload不进入ref |
| `DomainRejected(InvalidStateTransition / NoStateChange / TerminalStateReopenRejected)` | `PolicyRejected` | lifecycle/no-op/terminal refusal；object payload不进入ref |
| `InvalidInput { .. }` | `InvalidApplicationInput` | input/invariant保留内部typed context |
| `InvalidTechnicalStateTransition { .. }` | same-named code | object不进入ref |
| `TechnicalInvariantViolation { .. }` | same-named code | object/invariant不进入ref |
| `MissingPrerequisite { .. }` | same-named code | prerequisite不进入ref |
| `OptimisticConflict { .. }` | same-named code | Port不进入ref |
| `UniquenessConflict { .. }` | same-named code | Port/key不进入ref |
| `IdempotencyConflict` | same-named code | no payload |
| `IdempotencyInProgress` | same-named code | no payload |
| `PortFailure { .. }` | `DependencyFailure` | Port/failure class不进入public ref |
| three transaction failures | corresponding code | safe failure class不进入ref |
| `CommitOutcomeUnknown` | same-named code | no payload |
| `ConsistencyDefect { .. }` | same-named code | subject/invariant不进入ref |
| `CodecFailure { .. }` | same-named code | codec kind不进入ref |

上述函数全部归`application::errors`或对应wrapper `errors.rs`,不新增helper object。`ApplicationError` match必须覆盖17 / 17 variants；three optional typed-outcome functions必须穷尽各自7 / 4 / 5 variants。`issue_ref()`只能调用`from_code(self.issue_code())`;wrapper `issue_code()`对`Application { source }`只委托`source.issue_code()`,对local source做closed match,不得读取`Display / Debug / Error::source()`。

### 24.2 Protocol rejection mapper

| CapabilityProtocolRejectionCode | CapabilityIssueCode |
|---|---|
| `InvalidEnvelope` | `InvalidEnvelope` |
| `MissingRequiredField` | `MissingRequiredField` |
| `OperationMismatch` | `OperationMismatch` |
| `InvalidField` | `InvalidField` |
| `InvalidScope` | `InvalidScope` |
| `DuplicateConflict` | `DuplicateConflict` |
| `PolicyRejected` | `PolicyRejected` |
| `BodyForbidden` | `BodyForbidden` |
| `UnsupportedSchema` | `UnsupportedSchema` |

`CapabilityProtocolRejectionCode::issue_code()`必须是9-arm显式match,不得使用variant name formatting。具体Command / Job何时选择哪个rejection code仍由`12.4 / 12.6`逐协议闭合。

### 24.3 Query degraded mapper

| typed source | CapabilityIssueCode | gate |
|---|---|---|
| `CapabilityQueryDegradedKind::Missing` | `SubjectMissing` | 仅protocol允许可见missing marker时 |
| `ReferenceUnresolved` | `ReferenceUnresolved` | canonical typed state/decision |
| `ReferenceUnavailable` | `ReferenceUnavailable` | canonical typed state/decision |
| `StaleSource` | `StaleSource` | persisted state / source marker |
| `Rebuilding` | `MaterialRebuilding` | persisted material state |
| `MaterialUnavailable` | `MaterialUnavailable` | persisted material/report state |
| `Partial` | `PartialSurface` | typed partial-kind / report state |
| `Redacted` | `RedactedBoundary` | typed forbidden/visibility decision |

Mapper输入是`CapabilityQueryDegradedKind`,不是`ApplicationError`、repository error、timestamp age、route或private cache state。Marker `kind`与`issue_ref`必须来自同一match arm；api不得组合不对称pair。

### 24.4 Reference与external typed outcome mapper

| typed source | code / issue behavior |
|---|---|
| `ReferenceResolutionValue::Resolved` | no issue |
| `Unresolved` | `ReferenceUnresolved` |
| `Stale / Expired` | `StaleSource` |
| `Unavailable` | `ReferenceUnavailable` |
| `Invalid / Forbidden` | `RedactedBoundary` for read surface；write rejection可在后续逐flow映射为`PolicyRejected / BodyForbidden` |
| `CapabilityHandoffDisposition::Accepted` | no issue |
| `Unavailable` | `HandoffUnavailable` |
| `Rejected` | `HandoffRejected` |
| `Retryable` | `HandoffRetryable` |
| `EventCollaborationStatus::Failed` | `CollaborationFailed` |
| `HandoffUnavailable` | `CollaborationUnavailable` |
| `Candidate / PendingDelivery / Delivered` | no issue |

Typed `Failed / HandoffUnavailable`仍是合法outcome,code只形成其body-free report/status issue,不创建`ApplicationError`。只有Port没有产生合法typed outcome时才是`ApplicationError::PortFailure -> DependencyFailure`。

`issue_code_for_reference_read_surface(...)`只能用于Query/read marker。Command、Inbound和Job write/rejection路径必须按各自typed boundary在`12.4~12.6`选择`PolicyRejected / BodyForbidden / TerminalTargetSkipped`等code,不得复用read redaction mapper。

### 24.5 Inbound与Job supporting classification

| typed carrier | exact relationship |
|---|---|
| Inbound `Delayed + RetryRequired` | issue `RetryRequired`;具体dependency raw failure不得复制 |
| Inbound `Quarantined + BoundaryQuarantined` | issue `BoundaryQuarantined`;若typed forbidden marker成立可同时按稳定顺序追加`BodyForbidden` |
| Inbound `Rejected / UnsupportedSchema` | exact validation code / `UnsupportedSchema`;逐consumer选择留`12.5` |
| Job target terminal skip | `TerminalTargetSkipped`;outer target ref定位target |
| Job planning/target stable failure | 使用实际typed reason code,不得用`StableFailure`当reason |
| Job temporary prerequisite | 使用实际typed reason code；impact另为`RetryablePrerequisite` |
| Job advisory | 使用实际typed reason code；impact另为`Advisory` |

`CapabilityJobExecutionIssueImpact`只影响final disposition,不是issue原因taxonomy。`run_issue.issue_ref + impact`必须分别由closed reason与closed impact提供；不得建立`StableFailure / Advisory / RetryablePrerequisite`同名issue code。

---

## 25. Raw Failure 单向映射与 Disposal

### 25.1 Concrete adapter mapping pipeline

```text
concrete typed source error
  -> exhaustive compile-time match
  -> InfraApplicationFailureKind
  -> ApplicationError
  -> CapabilityIssueCode
  -> deterministic CapabilityProtocolValidationIssueRef

raw source object
  -> InfraError nonpublic Error::source() chain only
  -> Step 15 redacted telemetry boundary
  -X-> protocol / persistence / business record / issue-ref input
```

每个infra adapter必须定义private exhaustive conversion over its concrete dependency error type。它可以读取typed variant identity和已经由binding显式批准的typed semantic category；不得读取`Display / Debug`,message substring,raw response/body,SQL text/statement,URL,secret,stack,HTTP/RPC numeric status,SQLSTATE string,SDK/private code,bus topic或payload。

### 25.2 Safe adapter classification matrix

| concrete typed condition | InfraApplicationFailureKind | ApplicationError / issue code |
|---|---|---|
| typed timeout variant | `PortFailure { failure: Timeout }` | `PortFailure / DependencyFailure` |
| typed temporary unavailable variant | `PortFailure { TemporarilyUnavailable }` | same |
| selected adapter absent/disabled before call | `PortFailure { NotConfigured }` | same |
| typed stable dependency rejection | `PortFailure { PermanentlyRejected }` | same |
| response decoded but violates declared typed Port contract | `PortFailure { InvalidTypedResponse }` or loaded `ConsistencyDefect` per§16.2 | dependency or consistency code |
| source exists but no safe typed discriminant is usable | `PortFailure { UnexpectedSourceFailure }` | `DependencyFailure`;不可自动重试 |
| typed CAS/dependency-fence loser | `OptimisticConflict` | `OptimisticConflict` |
| typed unique/current-owner loser | `UniquenessConflict` | `UniquenessConflict` |
| UoW begin typed failure | `TransactionBeginFailed` | corresponding code |
| commit explicitly not durable | `TransactionCommitFailed` | corresponding code |
| rollback typed failure | `TransactionRollbackFailed` | corresponding code |
| durability cannot be proved | `CommitOutcomeUnknown` | corresponding code |
| typed stored relation impossible | `ConsistencyDefect` | corresponding code |
| serializer/canonicalizer/digest typed failure | `CodecFailure` | corresponding code |

`UnexpectedSourceFailure`是totality fallback,不是`Other(String)`。它没有payload,不允许automatic retry,也不能被entry重新解释为temporary。Binding在Step 14若确认某产品有可依赖的typed error API,可以把其具体variants映射到前5类；不能根据运行时文本升级分类。

### 25.3 Entry-local source mapping

| wrapper source | CapabilityIssueCode | raw detail rule |
|---|---|---|
| `InfraError::RuntimeAssembly` | `RuntimeAssemblyFailed` | process-local failure；无protocol response可伪造 |
| `ApiSourceKind::RouteAssembly` | `ApiRouteAssemblyFailed` | route name/path raw fragment不进入ref |
| `ApiSourceKind::EnvelopeNormalization` | `ApiEnvelopeNormalizationFailed` | metadata raw value不进入ref |
| `ApiSourceKind::UnsupportedSchema` | `UnsupportedSchema` | body不得先decode |
| `ApiSourceKind::ProtocolMapping` | `ApiProtocolMappingFailed` | serializer/body不进入ref |
| `WorkerSourceKind::InboundEnvelope` | `WorkerInboundEnvelopeFailed` | header/payload不进入ref |
| `WorkerSourceKind::UnsupportedSchema` | `UnsupportedSchema` | payload不得先decode |
| `WorkerSourceKind::PayloadDecoding` | `WorkerPayloadDecodingFailed` | decode error/body不进入ref |
| `WorkerSourceKind::CollaborationContinuation` | `WorkerCollaborationContinuationFailed` | capture/body/status text不进入ref |
| `WorkerSourceKind::MaintenanceTrigger` | `WorkerMaintenanceTriggerFailed` | trigger config不进入ref |
| `JobSourceKind::JobInput` | `JobInputFailed` | typed input raw value不进入ref |
| `JobSourceKind::UnsupportedSchema` | `UnsupportedSchema` | body不得先decode |
| `JobSourceKind::ApplicationDispatch` | `JobApplicationDispatchFailed` | service/type name不进入ref |
| `JobSourceKind::JobResultMapping` | `JobResultMappingFailed` | report serialization/body不进入ref |
| entry `Application { source }` | `source.issue_code()` | wrapper不得reclassify |

Source-kind to code可由wrapper `issue_code()` pure callable提供,但本批不定义transport response shape、HTTP/RPC数字、worker ack/nack或process exit number；这些留`12.4~12.6`与Step 14 binding。

### 25.4 Raw source lifecycle与Step 15 handoff

| boundary | permitted | forbidden |
|---|---|---|
| nonpublic in-memory chain | concrete error object via `Error::source()`；process lifetime only | serialize/persist/clone into result |
| public / stored surface | closed code-derived issue ref only | raw message、stack、status、adapter code、body/hash |
| business truth/history/trace/capture | existing typed business refs/effects only | technical raw failure or issue text as accepted fact |
| Step 15 telemetry input | closed source kind、closed application/code category、safe correlation refs、phase | raw body/secret/credential/SQL/request/event/report body；exact fields仍由Step 15定义 |
| operator recovery | closed category + exact durable refs fromStep 11 | reconstruct truth from logs/error text/current scan |

本批没有创建日志、metric、span、audit event、alert、diagnostic store、evidence alias或run report。Raw chain retention不等于允许logger自动格式化source chain；Step 15必须显式定义redaction和sink boundary。

---

## 26. Coverage、安全、Rustdoc与Historical Audit

### 26.1 Coverage arithmetic

```text
CapabilityIssueCode variants                         51
fixed unique v1 literals                            51 / 51
ApplicationError variants mapped                    17 / 17
Protocol rejection codes mapped                      9 / 9
Query degraded kinds mapped                          8 / 8
ReferenceResolutionValue variants mapped             7 / 7
CapabilityHandoffDisposition variants mapped         4 / 4
EventCollaborationStatus variants mapped             5 / 5
ApiSourceKind variants mapped                        4 / 4
WorkerSourceKind variants mapped                     5 / 5
JobSourceKind variants mapped                        4 / 4
InfraApplicationFailureKind variants mapped          9 / 9
ApplicationPortFailureKind variants after reopen     6 / 6
```

Typed outcome mapping中的healthy/no-issue arms也计入穷尽覆盖。`CapabilityIssueCode`不是上述枚举的笛卡尔积；多个内部typed payload可在redaction后收敛到同一public-safe code。

### 26.2 Rustdoc与结构审计

- Step 8新增1个public enum、51个variants；每个enum/variant都有英文`///`。
- Issue ref与set的2个tuple inner fields均有英文`///`,并由`pub`收为private；没有绕过constructor的公开字段。
- `CapabilityIssueCode` 2个、issue ref 2个、set 5个、rejection/degraded 2个public callables共11个,均有英文`///`。
- Step 6新增1个crate-visible callable,有英文`///`；Step 12 application / wrapper新增10个public callable声明,均有英文`///`。
- `ApplicationPortFailureKind::UnexpectedSourceFailure`有英文variant Rustdoc；无payload field。
- 本批没有新增struct。既有public structs与所有fields注释未删除；结构体注释门禁保持满足。

### 26.3 安全与stored replay审计

| gate | result | 说明 |
|---|---|---|
| raw message/body/hash进入ref | pass | 0 path；只接受closed code -> audited static literal |
| random / IdGenerator / Clock | pass | issue-ref构造不依赖三者 |
| arbitrary opaque wrapping | pass | tuple inner private；decode exact canonicalize |
| code/literal唯一性 | pass | 51 / 51 fixed table；不得derive name |
| normal state错误化 | pass | visible missing/NotVisible/no-op/replay/zero-target/healthy typed outcomes有明确no-issue规则 |
| typed outcome vs error | pass | resolver/handoff/collaboration合法typed outcome不降级`ApplicationError` |
| stored replay | pass | original surface/ref/order原样复制；不current-remap |
| raw totality | pass after local reopen | unexpected source有保守closed class；不解析prohibited detail |
| Step 15 ownership | pass | 只交closed category/correlation要求,未定义telemetry schema或声称执行 |

### 26.4 Historical material与禁入项

旧正式`03` / README中的provider runtime error、tools execution、marketplace listing、governance approval、method body、secret platform、local outbox / relay / dead-letter code均未进入51个issue codes。它们不能借`DependencyFailure`成为本仓owner；只有本仓已声明Port调用失败可映射该code。

本批未定义HTTP/RPC数字、broker ack/nack、topic/consumer group、retry次数/backoff/jitter、scheduler exit code、local attempt state、implementation code、commit、run_id、test result、evidence alias或验收签署。

---

## 27. Batch `12.3` 自检与停审记录

| 检查项 | 结果 | 说明 |
|---|---|---|
| input / gap audit | pass | §21读取existing carrier/placeholder/security inputs并关闭2项最小构造/totality缺口 |
| closed code | pass | 51个variants + 51个unique fixed `.v1` literals；protocol/safe outcome/application/entry均有owner |
| deterministic ref | pass | pure closed code -> audited static opaque ref；no random/hash/I/O/panic branch |
| set semantics | pass | stable first occurrence、duplicate guard、empty合法、private inner、stored order replay |
| typed mapper | pass | 17/17 application、9/9 rejection、8/8 Query degraded、7/7 reference、4/4 handoff、5/5 collaboration覆盖 |
| raw mapping | pass | 9/9 infra failure、4/4 API、5/5 worker、4/4 jobs source覆盖；unexpected source保守闭合 |
| normal branch separation | pass | NotVisible、normal missing/no-op、StoredReplay、zero-target与healthy typed outcome不制造issue |
| Rustdoc / structure | pass | 新enum/51 variants/2 private fields/22 callables/1 failure variant均有英文`///`;无struct/field注释遗漏 |
| historical / owner boundary | pass | runtime execution/tools/marketplace/approval/method body/secret body/local delivery lifecycle未进入taxonomy |
| formal / implementation discipline | pass | 正式`03`未修改；未创建Step 13、implementation ledger、boundary skeleton、代码、commit、run、evidence或测试结果 |
| unresolved upstream blocker | pass | `0`;两项受控回开均在当前设计产物中关闭 |

```text
gate_status = 03_step_12_batch_12_3_completed_wait_user_review
next_allowed_action = wait_user_confirmation_for_03_step_12_batch_12_4
```

本批完成后必须停审。用户确认后,下一批只允许补读本文件 §§21~27、Step 8 26 Command + 33 Query cards、Step 9 batches `9.1~9.7`的59条独立flow和existing rejection / Query surface,然后完成`12.4`逐协议错误映射并再次停审。不得进入6 Inbound、10 Outbound、8 Job、Step 13、正式`03`或任何implementation artifact。

---

## 28. Batch `12.4` 输入反查、受控回开与同步边界

### 28.1 已读取输入与覆盖口径

| 输入 | 本批读取范围 | 本批使用方式 | 禁止误用 |
|---|---|---|---|
| 本文件 §§21~27 | 51-code identity、typed mapper、raw-source disposal、normal no-issue branches | 逐协议只能复用existing code / deterministic ref | 不追加channel-private code或random ref |
| Step 8 §§6.2~§6.5、§7.12~§7.14、§8.13~§8.16 | shared Command / Query surface、26 Command cards、33 Query cards | 固定每条协议的existing response/rejection/surface | 不新增generic error envelope或Query rejection body |
| Step 9 batches `9.1~9.7` | 59条independent flow的failure / replay / no-write / transaction分支 | 逐flow映射exact internal error、caller action和side effect | 不用family catch-all替代独立协议行 |
| Step 11 §§9、12~15 | exact repository missing、owner/version/union、required sidecar和recovery authority | 区分normal absence、typed degraded与consistency defect | 不把已加载不对称降格为missing/degraded |
| 全局真相源标准 Query degraded门禁 | dedicated typed source、fake/durable parity、禁止text/private-map推导 | 审计resolver-level degraded source | 不从safe text、error text或first item拼marker |

本批逐协议计数为`26 Command + 33 Query = 59`。API handler与application service共享同一协议行:entry-local route/envelope/schema failure先形成`ApiError::Source`;service返回的`ApplicationError`只由`ApiError::Application`薄包装。HTTP / RPC数字、header和framework response shape仍留Step 14具体binding,本批只固定semantic surface与caller action。

### 28.2 `CH-DDD-S12-QUERY-DEGRADED-SOURCE-001` 受控回开

Step 9 Query flow要求把resolver-level `Degraded`映射为`CapabilityQueryDegradedKind + issue_ref`,但existing `CapabilityReadDegradedReason`原为opaque safe text。若沿用,实现只能解析文本、hard-code `Partial`或让fake使用private enum,违反全局真相源标准。该缺口已按最小范围关闭:

| 回开文件 | exact修正 | 数量 / owner影响 |
|---|---|---|
| Step 6 | existing `CapabilityReadDegradedReason` private inner由safe text改为`CapabilityQueryDegradedKind`;补`from_kind / as_kind / into_public_marker` | type / field count不变；3个callable均有英文`///` |
| Step 7 | resolver / durable / fake只能从formal typed authority选择closed kind并经`from_kind`形成reason | 36 Ports、trait method与return schema不变 |
| Step 8 | existing kind补8-arm `freshness`,existing marker补kind/ref同源`from_kind` | 250 public types、83 protocols、DTO field不变；2个callable有英文`///` |
| Step 9 | resolver degraded占位改为closed reason mapper；SDK双decision保持SDK后exposure顺序 | 83 flow、transaction / effect cardinality不变 |

### 28.3 `CH-DDD-S12-QUERY-CONSISTENCY-SEPARATION-001` 受控同步

早期Step 8 / 9 Query prose把部分loaded owner/version/union/mandatory-sidecar不对称描述为`Degraded(Missing / ReferenceUnavailable)`。这与本文件§§8.2、14.2、16.2及Step 11 persistence contract冲突。Batch `12.4`固定以下规范性三分法,matching protocol card / flow同步到该口径:

| source condition | exact result | issue behavior | caller action |
|---|---|---|---|
| resolver closed `Degraded` decision | existing Query typed degraded surface | reason kind -> matching deterministic marker | later read may observe changed authority;no write / repair |
| complete canonical reference value或complete persisted material / trace degraded state | protocol-declared typed degraded surface,body retention按card | value/state -> matching closed marker | caller按surface决定later read；不得推断runtime outcome |
| visible exact/current target legitimately absent；visible page empty | `Visible + body=None`或visible empty page | no issue unless该card显式要求marker；本批无card把normal absence标issue | no retry requirement；owner可在未来创建truth |
| loaded row owner/version/union/index不对称；registered ref缺mandatory current state；committed object缺required sidecar | exact `ApplicationError::ConsistencyDefect` | `ConsistencyDefect` deterministic issue ref只用于technical failure handoff | 不自动重试；Step 15 redacted visibility + 人工/数据修复 |

该同步不新增material degradation mapper,因为consistency defect不能伪装typed success。Normal missing也不升级`MissingPrerequisite`;只有write flow声明的required effect prerequisite才使用该variant。

## 29. Synchronous Shared Error Mapping Contract

### 29.1 Command branch precedence

每条Command按以下顺序检测和映射,具体允许code由§30逐协议行裁剪:

1. route / schema / envelope不对称在service前形成`InvalidEnvelope / OperationMismatch / UnsupportedSchema`,不reserve、不写result。
2. body-local required / typed field / scope / forbidden marker形成`MissingRequiredField / InvalidField / InvalidScope / BodyForbidden`,在可无repository判定时pre-reserve拒绝。
3. idempotency existing same digest + Completed只读取stored result/rejection,accepted result映射`DuplicateReplayed`;不得运行business body。
4. same key不同operation/digest形成`DuplicateConflict`;内部owner是`ApplicationError::IdempotencyConflict`,但public Command surface固定existing rejection code,不得泄漏原result。
5. post-reserve deterministic domain/prerequisite rejection形成`PolicyRejected`或`BodyForbidden`,保存`StoredCapabilityResultKind::CommandRejection`并完成reservation；accepted effect必须为空。
6. `ApplicationError` persistence / Port / transaction / consistency / codec分支走technical `Result::Err`,不伪装`CapabilityCommandOutcome::Rejected`;fresh UoW按§16.3 rollback / unknown规则处理。

每个`CapabilityProtocolRejection`的`issue_refs`必须包含exact rejection code对应的唯一deterministic ref；若同一branch还有typed forbidden / policy原因,stable顺序为primary rejection code先、补充closed code后,并经`CapabilityProtocolValidationIssueRefSet::from_codes`去重。不得把field name、subject id、Port或raw error放入ref。

### 29.2 Query branch precedence

| detection point | exact public / error result | write / recovery rule |
|---|---|---|
| route / envelope / schema / typed input normalization | `ApiError::Source`或`ApplicationError::InvalidInput / ContractRejected`;无Query rejection envelope | service不调用或zero write；caller修正request / schema |
| resolver `NotVisible` | successful `CapabilityQuerySurface { NotVisible, body/items empty }` | no issue、no body repository read、no retry signal |
| resolver closed `Degraded` | successful body-free degraded surface | `from_kind`形成kind/ref；no body read unlesscard明示partial |
| visible normal single missing / page empty | successful `Visible` missing / empty | no issue、no fallback、no repair |
| complete persisted reference/material/trace degraded state | successful card-declared degraded surface | exact state mapper；body retention按card,strict no-write |
| Port/raw dependency failure | `ApplicationError::PortFailure` -> technical error | temporary class可由Step 13/14策略稍后重试；不转missing/degraded |
| owner/version/union/sidecar/index defect | `ApplicationError::ConsistencyDefect` -> technical error | 不自动重试；人工/数据修复；不返回half body |

`NotVisible`、normal missing和visible empty page不形成issue ref。Query input error的public transport representation由API binding承接,但不得借Command-only `CapabilityProtocolRejection`制造第二Query response schema。

### 29.3 Synchronous technical error caller-action table

| internal family | stable issue code | Command / Query caller action | local state |
|---|---|---|---|
| contract/domain/input/technical invariant | matching §24.1 code | 修正输入、owner state或实现；同输入不直接重试 | pre-commit zero / rollback |
| `IdempotencyInProgress` | same-named | 仅在具体transaction/unique机制证明matching owner仍active时稍后exact-read同key；不得新运行业务body | existing reservation不变；committed orphan改走`ConsistencyDefect` |
| `OptimisticConflict` | same-named | reload exact owner/token后发起新尝试 | loser UoW rollback |
| `UniquenessConflict` | same-named | 读取正式winner并走协议的duplicate/rejection规则 | loser UoW rollback |
| temporary `PortFailure` | `DependencyFailure` | Step 13 / 14策略允许时重试same typed call | pre-commit rollback；post-commit truth不回滚 |
| permanent / invalid / unexpected Port failure | `DependencyFailure` | 配置/adapter修复或人工检查,不解析raw text重分类 | no guessed outcome |
| transaction begin / confirmed commit failure | matching transaction code | only after confirmed not-durable可按后续策略重试 | no durable current UoW |
| rollback failure | `TransactionRollbackFailed` | 人工确认transaction状态 | 不宣称rollback成功 |
| commit outcome unknown | same-named | exact-read idempotency/result;禁止blind retry | durability unknown |
| consistency / codec | matching code | 人工/设计/数据修复 | 不重建missing sidecar / response |

## 30. Command Protocol Error Mapping: 26 / 26

### 30.1 Identity / Review + Registry Command: 8 / 8

| Protocol / Step 9 flow | protocol-specific stable rejection | exact technical error families | public mapping / caller action | UoW / replay rule |
|---|---|---|---|---|
| `EstablishCapabilityAccessContext` / `command_establish_capability_access_context_flow` | required source/intake/review fields -> `MissingRequiredField`;route/body -> `OperationMismatch`;forbidden source body -> `BodyForbidden`;existing candidate/key、wrong existing source state或initial policy拒绝 -> `PolicyRejected` | resolver/repository unavailable=`PortFailure`;source/ref/state/owner/digest不对称=`ConsistencyDefect`;identity key race=`UniquenessConflict`;all expected-version/capture/store conflicts=`OptimisticConflict`;surface codec/UoW按exact variants | rejection返回matching deterministic issue;caller修正body/选择正式existing source或identity；temporary dependency可稍后重试；conflict需读取winner | pre-reserve rejection无result；post-reserve policy rejection保存replayable rejection；technical fresh path rollback；completed duplicate只stored replay |
| `CorrectCapabilityIdentity` / `command_correct_capability_identity_flow` | malformed related set/self ref -> `InvalidField`;body rewrite -> `BodyForbidden`;missing/stale/retired target、key winner、illegal lifecycle -> `PolicyRejected` | missing required current owner=`MissingPrerequisite`;loaded terminal/history asymmetry=`ConsistencyDefect`;repository/capture/store failure=`PortFailure`;target/material race=`OptimisticConflict`;key collision=`UniquenessConflict` | caller修正related set或使用current exact refs；terminal target不可原样重试；optimistic conflict重读全部exact owners | deterministic post-reserve rejection only writes stored rejection/completion；accepted UoW全回滚 on technical error；duplicate不开启correction |
| `RetireCapabilityIdentity` / `command_retire_capability_identity_flow` | missing ref/reason -> `MissingRequiredField / InvalidField`;target missing/stale/already retired/illegal state、current registry仍存在 -> `PolicyRejected`;cascade/delete request -> `InvalidField` | target/current-index不对称=`ConsistencyDefect`;repository/capture/store unavailable=`PortFailure`;identity/material conflict=`OptimisticConflict` | caller必须先显式retire registry再以current identity ref重试；不得请求cascade；already retired保持terminal | rejection-only UoW不改identity；technical failure整UoW rollback；duplicate不读target/registry/material |
| `RecordCapabilityAccessReviewFact` / `command_record_capability_access_review_fact_flow` | missing identity/context/risk -> `MissingRequiredField`;approval/vote/Policy/shared-rules body -> `BodyForbidden`;non-current/retired identity或invalid review state -> `PolicyRejected` | current-review link、owner/version不对称、persisted attachment reason不是Step 6 §7.6.1 exact 59-byte v1 value=`ConsistencyDefect`;repository failure=`PortFailure`;review/identity/material race=`OptimisticConflict` | caller提交body-free review fact并使用current identity；不得把review当approval或提供system reason；conflict重读current review link | stable rejection可replay但无review truth；accepted UoW失败全回滚；fresh path factory调用一次；duplicate不生成review id、不调用factory且不从current constant重建reason |

The fixed access-review attachment reason is persisted protocol data, not diagnostic prose. Fresh accepted execution must obtain it only from `ChangeReason::access_review_fact_recorded()` and preserve the exact ASCII/UTF-8 value `capability-hub.change-reason/access-review-fact-recorded.v1` (`59` bytes) through the change, trace and affected-material bridges. It must not enter a rejection issue, raw error, log, report or artifact as reconstructed free text. Completed replay reads the stored result and persisted record value; missing, corrupt or non-v1 reason symmetry is a `ConsistencyDefect`, never a trigger to call the factory, normalize bytes or silently migrate current truth. Changing the literal, namespace, version or bytes requires the controlled compatibility reopen defined by Step 6 §7.6.1.
| `RegisterCapabilityInRegistry` / `command_register_capability_in_registry_flow` | required fields -> `MissingRequiredField`;invalid actor/target scope -> `InvalidScope`;runtime/marketplace basis -> `BodyForbidden`;identity missing/non-Active、existing current entry、invalid basis -> `PolicyRejected` | identity/registry owner或factory-state不对称=`ConsistencyDefect`;repository unavailable=`PortFailure`;current-owner/key race=`UniquenessConflict`;material/capture race=`OptimisticConflict` | caller先建立Active identity并使用formal basis；不得传runtime/marketplace authority；winner存在时读取正式entry | loser/rejection不创建registry；technical accepted UoW全回滚；duplicate只回放original entry/effect |
| `UpdateRegistryLifecycleState` / `command_update_registry_lifecycle_state_flow` | route不拥有Draft/Registered/FormalVisible/Retired target -> `PolicyRejected`;same current、illegal transition、missing/stale entry -> `PolicyRejected` | loaded lifecycle/record不对称=`ConsistencyDefect`;repository/capture failure=`PortFailure`;entry/material conflict=`OptimisticConflict` | caller只能选择本route正式target并使用current entry；FormalVisible/Retired改走专属flow；no-op不原样重试 | rejection只存surface；technical branch整UoW rollback；duplicate不重评current state |
| `UpdateRegistryVisibilityBasis` / `command_update_registry_visibility_basis_flow` | missing/context scope -> `MissingRequiredField / InvalidScope`;runtime/search/marketplace authority -> `BodyForbidden`;entry missing/retired、same basis、policy拒绝 -> `PolicyRejected` | member output/change kind/owner不对称=`ConsistencyDefect`;repository unavailable=`PortFailure`;entry/material/capture race=`OptimisticConflict` | caller修正formal body-free basis或等待owner state变化；same basis为stable no-op rejection | no accepted registry/material/capture on rejection；technical UoW rollback；duplicate不比较current basis |
| `RetireCapabilityRegistryEntry` / `command_retire_capability_registry_entry_flow` | missing ref/reason -> `MissingRequiredField / InvalidField`;cascade/delete shape -> `InvalidField`;missing/stale/already retired/illegal state -> `PolicyRejected` | retired output/record/entry不对称=`ConsistencyDefect`;repository/capture unavailable=`PortFailure`;entry/material conflict=`OptimisticConflict` | caller使用current exact entry且不得cascade；already retired terminal | rejection-only replay可用；technical failure整UoW rollback；duplicate不重读entry/material |

### 30.2 Descriptor / Safe Summary + Governance / Method Relation Command: 9 / 9

| Protocol / Step 9 flow | protocol-specific stable rejection | exact technical error families | public mapping / caller action | UoW / replay rule |
|---|---|---|---|---|
| `EstablishAdapterDescriptor` / `command_establish_adapter_descriptor_flow` | missing/invalid descriptor field -> `MissingRequiredField / InvalidField`;forbidden body -> `BodyForbidden`;inactive identity、owner mismatch、current descriptor、retired registry、invalid document binding -> `PolicyRejected` | ref/state/union/digest/material index不对称=`ConsistencyDefect`;resolver/repository unavailable=`PortFailure`;current-owner collision=`UniquenessConflict`;version/capture race=`OptimisticConflict` | caller修正body-free descriptor/prerequisite；recoverable unresolved可作为accepted explicit state；temporary resolver失败稍后重试 | rejection无truth；accepted unresolved仍完整commit；technical whole UoW rollback；duplicate零fresh call |
| `ReplaceAdapterDescriptor` / `command_replace_adapter_descriptor_flow` | old非current/terminal、registry mismatch、same endpoint -> `PolicyRejected`;replacement unresolved/unavailable/invalid -> `PolicyRejected`;forbidden -> `BodyForbidden` | old/new/ref/state/document binding不对称=`ConsistencyDefect`;resolver/repository failure=`PortFailure`;current replacement collision=`UniquenessConflict`;all expected-version/capture/material race=`OptimisticConflict` | caller重读current descriptor并提供distinct eligible replacement；不可原地恢复terminal old | old/new/registry同UoW；任何technical failure全回滚；duplicate不生成id/调用resolver |
| `RecordDescriptorRiskConstraintSummary` / `command_record_descriptor_risk_constraint_summary_flow` | descriptor/review missing/stale、review未record/separated、registry chain mismatch -> `PolicyRejected`;forbidden constraint body -> `BodyForbidden`;invalid risk representation -> `InvalidField / PolicyRejected` | summary-current index/owner/link不对称=`ConsistencyDefect`;repository failure=`PortFailure`;summary/descriptor/material conflict=`OptimisticConflict` | caller提供body-free typed risk并使用current review/descriptor；Unknown可形成formal Partial,不得默认low risk | rejection不保存summary；technical whole UoW rollback；duplicate exact replay |
| `AttachDescriptorSecretReference` / `command_attach_descriptor_secret_reference_flow` | secret material -> `BodyForbidden`;terminal descriptor/existing relation -> `PolicyRejected`;invalid scope -> `InvalidScope`;typed Forbidden observation -> `BodyForbidden` | observation/ref/state/summary link不对称=`ConsistencyDefect`;resolver/repository unavailable=`PortFailure`;candidate/current collision=`UniquenessConflict`;descriptor/material/capture race=`OptimisticConflict` | caller只提交external secret ref与safe scope；temporary resolver失败稍后重试；forbidden不可原样重试 | no ref/state/summary on rejection；accepted pair同UoW；technical whole rollback；duplicate不调用resolver |
| `AttachGovernanceSeamRelation` / `command_attach_governance_seam_relation_flow` | owner/separation/current-seam mismatch、duplicate Register candidate -> `PolicyRejected`;approval/Policy/workflow body -> `BodyForbidden` | observation/ref/state/owner不对称=`ConsistencyDefect`;resolver/repository unavailable=`PortFailure`;current seam/candidate collision=`UniquenessConflict`;version/capture/material conflict=`OptimisticConflict` | caller提交body-free governance result ref,不得提交approval body；recoverable non-resolved可accepted | rejection不形成seam；accepted unresolved relation是truth；technical whole UoW rollback；duplicate exact replay |
| `ReplaceGovernanceSeamRelation` / `command_replace_governance_seam_relation_flow` | old stale/non-current/not replaceable、owner inactive、same endpoint、replacement non-resolved/expired -> `PolicyRejected`;body-bearing/forbidden replacement -> `BodyForbidden` | old/new/ref/state parity=`ConsistencyDefect`;resolver/repository unavailable=`PortFailure`;current winner=`UniquenessConflict`;all version/material/capture conflicts=`OptimisticConflict` | caller使用current replaceable seam与distinct resolved replacement；terminal old不可重开 | old/new/history同UoW；technical whole rollback；duplicate不重跑resolver |
| `ExpireGovernanceSeamRelation` / `command_expire_governance_seam_relation_flow` | missing/stale/not-current/non-Active/already expired -> `PolicyRejected`;隐式expire external governance result -> `InvalidField / PolicyRejected` | current index/record parity=`ConsistencyDefect`;repository unavailable=`PortFailure`;version/capture/material conflict=`OptimisticConflict` | caller只expire local seam并使用current Active ref；不得改external result | rejection no relation write；technical whole rollback；duplicate exact replay |
| `AttachCapabilityMethodRelation` / `command_attach_capability_method_relation_flow` | inactive identity/current relation、duplicate Register -> `PolicyRejected`;invalid scope -> `InvalidScope`;method body/definition/version/source -> `BodyForbidden`;Invalid/Forbidden observation -> `PolicyRejected / BodyForbidden` | observation/ref/state/owner不对称=`ConsistencyDefect`;resolver/repository unavailable=`PortFailure`;current/candidate collision=`UniquenessConflict`;relation/material/capture conflict=`OptimisticConflict` | caller只提交method asset ref与safe locator；recoverable non-resolved可accepted；不得提交asset body | rejection no relation/ref truth；technical whole UoW rollback；duplicate no resolver |
| `RemoveCapabilityMethodRelation` / `command_remove_capability_method_relation_flow` | missing/stale/not-current、Pending/Stale/Removed/Forbidden -> `PolicyRejected`;请求删除method asset/ref/body -> `InvalidField / PolicyRejected` | current index/record parity=`ConsistencyDefect`;repository unavailable=`PortFailure`;relation/material/capture conflict=`OptimisticConflict` | caller只remove current local relation；terminal Removed不可重开,external asset不变 | rejection无relation write；technical whole rollback；duplicate exact replay |

### 30.3 Exposure + Trace / Impact + Reference Command: 9 / 9

| Protocol / Step 9 flow | protocol-specific stable rejection | exact technical error families | public mapping / caller action | UoW / replay rule |
|---|---|---|---|---|
| `EstablishFormalExposureBoundary` / `command_establish_formal_exposure_boundary_flow` | missing/stale owner chain、non-Active identity、retired registry、duplicate exposure、terminal/illegal prerequisite -> `PolicyRejected`;forbidden basis / approval / method-body substitution -> `BodyForbidden` | owner/source-version/visibility symmetry=`ConsistencyDefect`;repository unavailable=`PortFailure`;current exposure collision=`UniquenessConflict`;version/capture/material conflict=`OptimisticConflict` | caller补齐formal local prerequisites并使用policy-produced target；recoverable unresolved may form explicit pending/non-visible accepted state | exposure/visibility/actual registry delta同UoW；technical whole rollback；duplicate zero prerequisite calls |
| `UpdateFormalVisibilityApplicability` / `command_update_formal_visibility_applicability_flow` | missing/Retired/asymmetric visibility、Draft/retired/stale exposure、cross-owner identity、illegal intent -> `PolicyRejected`;forbidden authority body -> `BodyForbidden` | source-version/owner/member output不对称=`ConsistencyDefect`;repository unavailable=`PortFailure`;visibility/current conflict=`OptimisticConflict` | caller使用current exposure与typed applicability scope；same-owner non-Active identity只按formal policy形成degradation,不作runtime deny | final exposure/visibility symmetry同UoW；technical whole rollback；duplicate exact replay |
| `SuspendFormalExposureBoundary` / `command_suspend_formal_exposure_boundary_flow` | non-Active/retired/stale exposure、missing/non-Visible/asymmetric visibility、owner mismatch、retired registry -> `PolicyRejected`;consumer/runtime authority -> `PolicyRejected`;body-bearing reason -> `BodyForbidden` | visibility/exposure/source index不对称=`ConsistencyDefect`;repository unavailable=`PortFailure`;version/capture/material conflict=`OptimisticConflict` | caller使用current Active exposure；不得让consumer/runtime发出formal authority | exposure/visibility/actual registry delta同UoW；technical whole rollback；duplicate no reevaluation |
| `RetireFormalExposureBoundary` / `command_retire_formal_exposure_boundary_flow` | Draft/already retired/stale exposure、missing/Retired/asymmetric visibility、owner mismatch -> `PolicyRejected`;delete registry/identity或resurrection/replacement intent -> `InvalidField / PolicyRejected` | source-version/index symmetry=`ConsistencyDefect`;repository unavailable=`PortFailure`;version/capture/material conflict=`OptimisticConflict` | caller使用current non-Draft exposure且只retire local boundary；registry仅actual delta | exposure/visibility/actual registry delta同UoW；technical whole rollback；duplicate exact replay |
| `RecordCapabilityChangeImpactFact` / `command_record_capability_change_impact_fact_flow` | missing/stale/superseded trace、trace metadata mismatch、duplicate impact -> `PolicyRejected`;empty/duplicate consumers或bad ref -> `InvalidField`;invalid scope -> `InvalidScope`;execution/audit/provider body -> `BodyForbidden` | change/trace/consumer ref-state parity=`ConsistencyDefect`;repository unavailable=`PortFailure`;impact uniqueness=`UniquenessConflict`;save/capture conflict=`OptimisticConflict` | caller使用exact current trace和canonical consumer set；duplicate impact读取正式winner,不覆盖 | impact/result/capture同UoW；no fabricated change/trace；technical whole rollback；duplicate no reload |
| `RecordTraceabilityHandoffSummary` / `command_record_traceability_handoff_summary_flow` | stale/superseded/illegal trace -> `PolicyRejected`;optional audit missing/non-resolved -> `PolicyRejected`;invalid scope -> `InvalidScope`;body-bearing audit material -> `BodyForbidden` | audit ref/state/handoff outcome parity=`ConsistencyDefect`;pre-commit repository failure=`PortFailure`;trace append conflict=`OptimisticConflict`;post-commit raw handoff failure=`PortFailure`但不改accepted response | caller先取得current trace和resolved audit ref；post-commit failure不能盲重跑same key,显式retry用new key + current trace | local pending revision/result/completion先commit；post-commit handoff不回滚；duplicate Port call=0 |
| `RecordReferenceResolutionState` / `command_record_reference_resolution_state_flow` | unknown subject/kind mismatch -> `InvalidField / PolicyRejected`;illegal terminal transition、same value+same reason、current Invalid/Forbidden -> `PolicyRejected`;body-bearing reason -> `BodyForbidden` | ref/state/index/material owner/version不对称=`ConsistencyDefect`;repository unavailable=`PortFailure`;state/material conflict=`OptimisticConflict` | caller修正typed subject/kind或提供actual non-terminal value/reason delta；terminal不可原地恢复 | exact no-op rejection无state/capture/material；actual revision同UoW；technical whole rollback；duplicate no read |
| `RegisterExternalDocumentReference` / `command_register_external_document_reference_flow` | unsupported kind/target -> `InvalidField`;invalid scope/duplicate candidate/Invalid observation -> `PolicyRejected`;body-like locator/document/schema/protocol或Forbidden observation -> `BodyForbidden` | resolver observation/ref/state/factory parity=`ConsistencyDefect`;resolver/repository unavailable=`PortFailure`;candidate/subject collision=`UniquenessConflict`;save/capture conflict=`OptimisticConflict` | caller只提交body-free locator；recoverable non-resolved可accepted；invalid/forbidden先修正source | ref+state+result/capture同UoW；technical whole rollback；duplicate no resolver/id generation |
| `RegisterCapabilityConsumerReference` / `command_register_capability_consumer_reference_flow` | unknown/cross-variant fields -> `InvalidField`;invalid kind/scope -> `InvalidScope`;duplicate candidate/Invalid observation -> `PolicyRejected`;execution/tool/credential/SDK client/package body或Forbidden observation -> `BodyForbidden` | selected resolver/ref/state parity=`ConsistencyDefect`;resolver/repository unavailable=`PortFailure`;candidate/subject collision=`UniquenessConflict`;save/capture conflict=`OptimisticConflict` | caller选择exact RuntimeTools或Sdk variant并提交body-free server boundary；recoverable non-resolved可accepted | matching ref+state同UoW；不授予execution/publication；technical whole rollback；duplicate both resolvers=0 |

### 30.4 Command cross-protocol closure

| 审计项 | expected | actual | 结论 |
|---|---:|---:|---|
| independent Command rows | 26 | 26 | pass |
| each row names Step 9 flow | 26 | 26 | pass |
| pre/post reserve distinction | 26 | 26 | pass via §29.1 + row-specific rejection |
| stored duplicate rule | 26 | 26 | pass;all no-rerun |
| technical error / rollback rule | 26 | 26 | pass;no technical failure伪装business rejection |
| runtime/tools/marketplace/approval/body boundary | 26 | 26 | pass |

Command accepted response本身不新增issue field；只有rejection surface持有issue refs。Technical `ApplicationError` issue ref用于API technical handoff和Step 15 redacted visibility,不得写进accepted `CapabilityCommandResponse.effect`。`RecordTraceabilityHandoffSummary`是本批唯一声明post-commit external call的Command；其raw failure不替换已经durable的accepted-local stored response。

## 31. Query Protocol Error Mapping: 33 / 33

### 31.1 Identity / Review + Registry + Descriptor Query: 10 / 10

| Protocol / Step 9 flow | input error与normal absence | 允许的typed success degradation | exact technical error | caller action / no-write recovery |
|---|---|---|---|---|
| `GetCapabilityIdentity` / `query_get_capability_identity_flow` | missing / malformed exact identity ref -> `MissingRequiredField / InvalidField`;visible identity miss -> `Visible/NotApplicable + body=None`;identity link与review current index同时无值 -> `review_summary=None` | resolver closed degradation；完整source canonical `Unresolved / Stale / Expired / Unavailable / Invalid / Forbidden`按state mapper形成`ReferenceUnresolved / StaleSource / ReferenceUnavailable / Redacted` | loaded identity id/version=`ConsistencyDefect(DomainObject(CapabilityIdentity), PersistedVersionSymmetry)`；source ref/state缺失=`ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`；wrong union=`PersistedVariantShape`；source owner/version=`PersistedOwnerRelation / PersistedVersionSymmetry`；one-sided review link=`CurrentIndexShape`；repository call failure=`PortFailure` | caller修正ref；normal miss无需补造；完整non-resolved state可稍后重读；technical consistency不自动重试,转Step 15 redacted visibility和owner数据修复；所有分支write count=`0` |
| `SearchCapabilityIdentities` / `query_search_capability_identities_flow` | invalid key/state/source filters -> `InvalidField`;bad cursor/limit -> `InvalidPage`;visible no rows -> normal visible empty/no cursor | resolver closed degradation只返回empty/no cursor,search call=`0`;item本身不从source/review fan-out形成degraded | search failure=`PortFailure(CapabilityIdentityRepository, ..)`；loaded item version/filter或`returned_count` shape=`ConsistencyDefect(PortReturn(CapabilityIdentityRepository), RepositoryAccessShape)` | caller修正filter/page；empty无需重试；resolver degraded可later read；repository consistency需adapter/data修复；不得drop row、返回partial prefix或refresh index |
| `GetCapabilityAccessReviewFact` / `query_get_capability_access_review_fact_flow` | invalid selector / exact ref -> `MissingRequiredField / InvalidField`;visible exact review、identity或current review miss -> `Visible/NotApplicable + body=None`;superseded / invalidated exact fact仍是可读direct truth | resolver closed degradation；review persisted lifecycle本身不被转换成technical error或governance approval | loaded identity/review version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；missing loaded review owner=`ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`；owner mismatch=`PersistedOwnerRelation`；current link不对称=`CurrentIndexShape`;repository failure=`PortFailure` | caller修正selector；normal miss不触发approval fallback；technical consistency人工修复；不得猜identity ref、重建review或调用governance resolver |
| `GetCapabilityRegistryEntry` / `query_get_capability_registry_entry_flow` | missing / malformed entry ref -> `MissingRequiredField / InvalidField`;visible entry miss -> `Visible/NotApplicable + body=None`;`descriptor_ref=None`是合法truth | resolver closed degradation；Retired exact entry保持direct readable truth | loaded entry version=`ConsistencyDefect(DomainObject(CapabilityRegistryEntry), PersistedVersionSymmetry)`；loaded entry缺identity owner=`ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`；owner mismatch=`PersistedOwnerRelation`;repository failure=`PortFailure` | caller修正ref；normal miss不创建entry；technical branch人工修复owner chain；no descriptor / exposure / directory / runtime fallback,no write |
| `ListCapabilityRegistryEntries` / `query_list_capability_registry_entries_flow` | invalid optional identity/state/basis -> `InvalidField / BodyForbidden`;bad page -> `InvalidPage`;visible no rows -> normal visible empty | resolver closed degradation只返回empty/no cursor；list item没有per-item exposure/runtime degradation | list failure=`PortFailure(CapabilityRegistryRepository, ..)`；item filter/version或count shape=`ConsistencyDefect(PortReturn(CapabilityRegistryRepository), RepositoryAccessShape)` | caller修正scope/page；normal empty不重建registry；technical consistency修复adapter/data；不得silent filter、projection rebuild或runtime lookup |
| `GetRegistryVisibilitySemantics` / `query_get_registry_visibility_semantics_flow` | invalid selector/ref -> `MissingRequiredField / InvalidField`;visible selected/current entry miss -> `body=None`;Step 10 matrix允许的no exposure / no visibility保留显式`None` | resolver closed degradation；本卡不把合法optional absence制造成`Missing` marker | loaded identity/entry version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；owner mismatch=`CrossStoreRelation + PersistedOwnerRelation`；matrix要求的exposure/visibility缺失=`RequiredSidecar`；present exposure/visibility source-version mismatch=`PersistedVersionSymmetry`;repository failure=`PortFailure` | caller修正selector；合法absence无需repair；matrix contradiction不自动derive/reevaluate,由owner数据修复；runtime authorization与approval fallback=`0` |
| `GetAdapterDescriptor` / `query_get_adapter_descriptor_flow` | invalid selector/ref -> `MissingRequiredField / InvalidField`;visible exact descriptor、identity、current registry或current descriptor miss -> `body=None` | resolver closed degradation；persisted descriptor state按direct truth复制,不从provider runtime推导 | loaded identity/descriptor version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；registry/descriptor owner mismatch=`ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation)`;repository failure=`PortFailure` | caller修正selector；normal current-chain absence不创建descriptor；technical consistency人工修复；no alternate descriptor、provider lookup或summary fan-out |
| `GetDescriptorRiskConstraintSummary` / `query_get_descriptor_risk_constraint_summary_flow` | invalid selector/id/ref -> `MissingRequiredField / InvalidField`;visible exact/current summary或descriptor miss -> `body=None`,不得默认low risk | resolver closed degradation；完整persisted `Forbidden` / unavailable-safe summary按card形成`Redacted`或其direct safe state | loaded descriptor/summary version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；descriptor-summary owner/link mismatch=`ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation)`；invalid state-dependent safe marker=`DomainRejected(InvariantViolation(...))`;repository failure=`PortFailure` | caller修正selector；normal miss维持unknown；forbidden surface不得泄漏constraint text；technical consistency转owner修复,no recalculation / approval / telemetry fallback |
| `GetDescriptorSecretSafeSummary` / `query_get_descriptor_secret_safe_summary_flow` | invalid selector/ref family -> `MissingRequiredField / InvalidField`;visible descriptor或current safe-summary miss -> `body=None` | resolver closed degradation；完整secret canonical state与safe-summary state联合映射`ReferenceUnresolved / StaleSource / ReferenceUnavailable / Redacted`;只保留safe fields | loaded descriptor/summary version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；summary-link / ref-state owner mismatch=`CrossStoreRelation + PersistedOwnerRelation`；missing registered secret ref/current state=`RequiredSidecar`；wrong secret union=`ConsistencyDefect(DomainObject(SecretReference), PersistedVariantShape)`;repository failure=`PortFailure` | caller修正selector；normal summary miss不调用secret manager；complete non-resolved可later read；technical pair defect人工修复；KMS/Vault/secret value/network/write=`0` |
| `ListDescriptorsByCapability` / `query_list_descriptors_by_capability_flow` | invalid identity ref/page -> `InvalidField / InvalidPage`;visible identity miss或no current registry -> normal visible empty/no cursor | resolver closed degradation返回empty/no cursor；descriptor persisted state在完整item内保持direct truth | loaded identity version=`ConsistencyDefect(DomainObject(CapabilityIdentity), PersistedVersionSymmetry)`；registry owner mismatch=`ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation)`；descriptor item owner/version/count=`ConsistencyDefect(PortReturn(AdapterDescriptorRepository), RepositoryAccessShape)`；repository failure=`PortFailure` | caller修正ref/page；normal empty不注册registry；technical consistency不返回partial history；no per-item summary/ref/provider read,no write |

### 31.2 Governance / Method Relation + Exposure / Consumer Query: 9 / 9

| Protocol / Step 9 flow | input error与normal absence | 允许的typed success degradation | exact technical error | caller action / no-write recovery |
|---|---|---|---|---|
| `GetGovernanceSeamRelation` / `query_get_governance_seam_relation_flow` | invalid selector/ref -> `MissingRequiredField / InvalidField`;visible identity或exact/current seam miss -> `body=None` | resolver closed degradation；完整governance canonical non-Resolved state按`ReferenceUnresolved / StaleSource / ReferenceUnavailable / Redacted`映射,body retention按card | identity/seam version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；seam owner=`CrossStoreRelation + PersistedOwnerRelation`；missing ref/state=`RequiredSidecar`；wrong governance union=`ConsistencyDefect(DomainObject(GovernanceResultReference), PersistedVariantShape)`；state pair mismatch=`PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | normal miss不形成approval；complete non-resolved可later read；technical defect人工修复；governance vote/Policy/workflow/external resolver/write=`0` |
| `GetAccessGovernanceSeparation` / `query_get_access_governance_separation_flow` | invalid selector/ref -> `MissingRequiredField / InvalidField`;visible identity/review miss -> `body=None`;no current seam -> complete visible body withoptional seam fields `None` | resolver closed degradation；review/separation direct truth不等于approval state | loaded identity/review version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；missing review owner=`RequiredSidecar`；review owner/current link=`PersistedOwnerRelation / CurrentIndexShape`；present optional seam owner/version=`PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | caller修正selector；no seam不补造；technical inconsistency人工修复；不得读取governance ref/body或推断approval |
| `GetCapabilityMethodRelation` / `query_get_capability_method_relation_flow` | invalid selector/ref -> `MissingRequiredField / InvalidField`;visible identity或relation miss、explicit identity-method endpoint no-match -> `body=None` | resolver closed degradation；完整method canonical non-Resolved state按card映射；完整Invalid/Forbidden只走redacted surface | identity/relation version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；relation owner=`CrossStoreRelation + PersistedOwnerRelation`；missing method ref/state=`RequiredSidecar`；wrong union=`ConsistencyDefect(DomainObject(MethodAssetReference), PersistedVariantShape)`；state pair mismatch=`PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | endpoint no-match无需repair；complete non-resolved可later read；technical pair defect人工修复；method body/library execution/fallback lookup/write=`0` |
| `ListCapabilityRelations` / `query_list_capability_relations_flow` | invalid identity/kind/page -> `InvalidField / InvalidPage`;visible identity miss或empty history -> visible empty/no cursor | resolver closed degradation empty/no cursor；complete safe non-Resolved item保留并aggregate degraded；complete Invalid/Forbidden state可redacted empty | identity version=`ConsistencyDefect(DomainObject(CapabilityIdentity), PersistedVersionSymmetry)`；item owner/family/version/count=`ConsistencyDefect(PortReturn(selected relation repository), RepositoryAccessShape)`；missing ref/state=`RequiredSidecar`；wrong union/state pair=`PersistedVariantShape / PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | caller修正kind/page；normal empty不改relation；technical defect禁止partial prefix / row drop / mixed family；外部resolver与write=`0` |
| `GetFormalExposureBoundary` / `query_get_formal_exposure_boundary_flow` | invalid selector/ref -> `MissingRequiredField / InvalidField`;visible identity/registry/exposure miss -> `body=None`;Draft无visibility -> complete body + optional fields `None` | resolver closed degradation；exposure persisted state是direct truth,不从runtime/SDK/listing推导 | loaded identity/registry/exposure version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；owner chain=`CrossStoreRelation + PersistedOwnerRelation`；non-Draft缺visibility=`RequiredSidecar`；visibility owner/source-version=`PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | normal miss/Draft absence不derive fact；technical contradiction人工修复；不得reevaluate visibility、refresh view或调用runtime/SDK/listing |
| `GetFormalVisibilityApplicability` / `query_get_formal_visibility_applicability_flow` | invalid exposure/consumer ref -> `MissingRequiredField / InvalidField`;visible exposure miss或Draft无fact -> `body=None`;consumer outside scope -> complete`NotApplicable` | resolver closed degradation；unregistered RuntimeTools/SDK ref或完整non-Resolved state -> typed reference degradation；`NotApplicable`不是runtime deny | loaded exposure version=`ConsistencyDefect(DomainObject(FormalExposureBoundary), PersistedVersionSymmetry)`；wrong consumer union=`PersistedVariantShape`；registered consumer缺state=`RequiredSidecar`；state pair=`PersistedOwnerRelation / PersistedVersionSymmetry`；non-Draft缺visibility=`RequiredSidecar`；fact owner/source version=`PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | caller修正ref；unregistered/non-resolved可later read；technical pair/fact defect人工修复；不调用external resolver、runtime policy或reevaluation/write |
| `GetControlledConsumerView` / `query_get_controlled_consumer_view_flow` | invalid selector/ref -> `MissingRequiredField / InvalidField`;visible exact view、exposure或pair miss -> `body=None`;unregistered external consumer按card typed unavailable | resolver closed degradation；complete consumer non-Resolved state；persisted view `Stale / Rebuilding / Unavailable / Partial`按exact freshness mapper | loaded view/exposure version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；wrong consumer union=`PersistedVariantShape`；registered consumer缺state=`RequiredSidecar`；state pair=`PersistedOwnerRelation / PersistedVersionSymmetry`；present view exposure/audience=`ConsistencyDefect(DomainObject(ControlledConsumerView), PersistedOwnerRelation)`;repository failure=`PortFailure` | normal miss不refresh view；complete degraded state可later read；technical defect不返回other audience；freshness policy/Job/runtime/SDK generation/write=`0` |
| `ListConsumableCapabilitiesForRuntimeTools` / `query_list_consumable_capabilities_for_runtime_tools_flow` | invalid exposure set/freshness/page -> `InvalidField / InvalidPage`;unregistered consumer -> typed unavailable empty；missing explicit exposure或visible no views -> normal visible empty/no cursor | resolver closed degradation empty/no cursor；complete consumer non-Resolved -> typed degraded empty；complete view `Stale / Partial / Rebuilding / Unavailable`按fixed priority aggregate | wrong consumer union=`ConsistencyDefect(DomainObject(RuntimeToolsConsumerReference), PersistedVariantShape)`；registered consumer缺/mismatch state=`RequiredSidecar / PersistedOwnerRelation / PersistedVersionSymmetry`；loaded explicit exposure version=`ConsistencyDefect(DomainObject(FormalExposureBoundary), PersistedVersionSymmetry)`；item scope/version/count=`ConsistencyDefect(PortReturn(ControlledConsumerViewRepository), RepositoryAccessShape)`;repository failure=`PortFailure` | caller修正scope/page；normal empty不widen/narrow scope；technical defect禁止row drop/partial prefix；runtime allowlist/provider/execution/view refresh/write=`0` |
| `GetSdkExposureBoundary` / `query_get_sdk_exposure_boundary_flow` | invalid SDK id/exposure ref -> `MissingRequiredField / InvalidField`;either resolver NotVisible优先；visible unregistered SDK或missing exposure -> `body=None`;missing optional SDK view -> complete outer body + `consumer_view=None`;Draft无visibility合法 | SDK后exposure resolver markers稳定合并；complete SDK non-Resolved state；persisted view `Stale / Partial / Rebuilding / Unavailable`;SDK scope unsupported按typed boundary degradation,不是execution deny | decision source-version union conflict=`ConsistencyDefect(TechnicalObject(ReadVisibilityDecision), ReadVisibilityShape)`；wrong SDK union=`ConsistencyDefect(DomainObject(SdkConsumerReference), PersistedVariantShape)`；registered SDK缺/mismatch state=`RequiredSidecar / PersistedOwnerRelation / PersistedVersionSymmetry`；loaded exposure version=`PersistedVersionSymmetry`；required visibility缺失=`RequiredSidecar`；visibility/view parity=`PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | caller修正refs；normal optional miss不生成SDK material；complete degraded可later read；technical defect人工修复；SDK package/client/binding/cache/release、runtime execution、view refresh/write=`0` |

### 31.3 Trace / Impact + Derived / Reconciliation Query: 9 / 9

| Protocol / Step 9 flow | input error与normal absence | 允许的typed success degradation | exact technical error | caller action / no-write recovery |
|---|---|---|---|---|
| `GetCapabilityAccessTrace` / `query_get_capability_access_trace_flow` | invalid trace subject/page -> `InvalidField / InvalidPage`;visible history empty -> normal visible empty/no cursor | resolver closed degradation empty/no cursor；complete persisted `Partial / HandoffPending` records保留并aggregate `StaleReadable`;Superseded仍是历史truth | list failure=`PortFailure(CapabilityTraceabilityRepository, ..)`；wrong returned subject或count shape=`ConsistencyDefect(PortReturn(CapabilityTraceabilityRepository), RepositoryAccessShape)` | caller修正subject/page；empty无需append；persisted partial可later read；technical row defect修复adapter/data；no trace repair/handoff/audit fetch/write |
| `GetCapabilityChangeImpact` / `query_get_capability_change_impact_flow` | invalid selector/exact version -> `MissingRequiredField / InvalidField`;visible change、trace或impact任一合法absence -> `body=None` | resolver closed degradation；impact persisted `Delayed / Partial / Ignored`是direct body state,不变成runtime deny或query failure | change wrong union/id=`ConsistencyDefect(PortReturn(CapabilityChangeRecordRepository), PersistedVariantShape)`；loaded trace/impact owner relation=`ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation)`；impact version=`ConsistencyDefect(DomainObject(CapabilityChangeImpactFact), PersistedVersionSymmetry)`;repository failure=`PortFailure` | caller修正selector；normal absent link不补造trace/impact；technical defect人工修复；no downstream hidden list、consumer notification、execution或write |
| `GetDownstreamConsumptionImpactSummary` / `query_get_downstream_consumption_impact_summary_flow` | no selector -> `InvalidScope`;invalid ref/range/page -> `InvalidField / InvalidPage`;visible no match -> normal visible empty | resolver closed degradation empty/no cursor；persisted `Received / Partial / Delayed / Unavailable / Ignored`全部是direct truth,outer surface保持card定义 | list failure=`PortFailure(CapabilityImpactRepository, ..)`；item impact/consumer/time/version/change-index/count mismatch=`ConsistencyDefect(PortReturn(CapabilityImpactRepository), RepositoryAccessShape)` | caller修正scope/page；normal empty不重放feedback；technical defect不drop row；no source event body、runtime/SDK call、impact mutation或write |
| `GetAuditHandoffTraceSummary` / `query_get_audit_handoff_trace_summary_flow` | invalid exact trace ref/scope -> `InvalidField / InvalidScope / BodyForbidden`;visible exact trace miss -> `body=None`;no attached refs -> complete empty vector | resolver closed degradation；complete audit pair canonical `Stale / Expired / Unresolved / Unavailable / Invalid / Forbidden`与trace `Partial / HandoffPending`按stable aggregate mapping | loaded trace version=`ConsistencyDefect(DomainObject(CapabilityAccessTraceabilityRecord), PersistedVersionSymmetry)`；attached ref/state缺失=`ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`；wrong audit union=`ConsistencyDefect(DomainObject(ObservabilityAuditReference), PersistedVariantShape)`；state pair=`PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | caller修正scope/ref；complete non-resolved可later read；technical pair defect不返回partial vector；no handoff Port/audit store/evidence generation/signing/trace append/write |
| `SearchCapabilityDirectory` / `query_search_capability_directory_flow` | invalid text/facets/page -> `InvalidField / BodyForbidden / InvalidPage`;visible no projection -> normal visible empty | resolver closed degradation empty/no cursor；complete persisted projection `Stale / Rebuilding / Unavailable`按fixed priority aggregate | search failure=`PortFailure(CapabilityDerivedMaterialRepository, ..)`；item version/source refs/facets/read-only/count mismatch=`ConsistencyDefect(PortReturn(CapabilityDerivedMaterialRepository), RepositoryAccessShape)` | caller修正search/page；normal empty不rebuild；persisted degraded可later read；technical defect不rerank/drop/fallback registry/runtime/marketplace；no write |
| `BrowseCapabilityDirectory` / `query_browse_capability_directory_flow` | invalid facets/page -> `InvalidField / InvalidPage`;visible empty normal | resolver closed degradation empty/no cursor；complete persisted states按Search相同priority aggregate | internal non-None query text=`InvalidInput(RepositoryScope, RepositoryAccessShape)`；repository/item/count mismatch=`ConsistencyDefect(PortReturn(CapabilityDerivedMaterialRepository), RepositoryAccessShape)`；repository failure=`PortFailure` | caller修正page；internal scope defect需实现修复；不得切换Search、drop row、rerank、rebuild或读marketplace/runtime truth |
| `GetAuditFriendlyExportSummary` / `query_get_audit_friendly_export_summary_flow` | invalid selector/exact refs/scope -> `MissingRequiredField / InvalidField / InvalidScope / BodyForbidden`;visible trace/export miss -> `body=None` | resolver closed degradation；complete persisted `Partial / Stale / Unavailable`保留safe export body并映射`Partial / StaleSource / MaterialUnavailable` | loaded trace/export version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；trace/scope owner relation=`ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation)`；state/reason shape=`DomainRejected(InvariantViolation(AuditExport, StateDependentFieldShape))`;repository failure=`PortFailure` | caller修正selector/scope；normal miss不prepare export；persisted degraded可later read；technical/domain defect人工修复；no raw audit store/handoff/evidence generation/write |
| `GetReadOnlyEcosystemDiscoverySummary` / `query_get_read_only_ecosystem_discovery_summary_flow` | invalid exact exposure/context -> `MissingRequiredField / InvalidField / BodyForbidden`;visible exposure/material miss -> `body=None` | resolver closed degradation；complete persisted `Partial / Stale / Unavailable`保留read-only body并映射typed surface | exposure/material version=`ConsistencyDefect(DomainObject(...), PersistedVersionSymmetry)`；source/context relation=`ConsistencyDefect(CrossStoreRelation, PersistedOwnerRelation)`；`is_listing_truth()==true`=`ConsistencyDefect(DomainObject(EcosystemDiscovery), PersistedVariantShape)`；state/reason=`DomainRejected(InvariantViolation(EcosystemDiscovery, StateDependentFieldShape))`;repository failure=`PortFailure` | caller修正input；normal miss不build/publish；persisted degraded可later read；technical defect人工修复；marketplace listing/ranking/pricing/publication/runtime/write=`0` |
| `GetCapabilityReconciliationReport` / `query_get_capability_reconciliation_report_flow` | invalid exact ref/scope/page -> `MissingRequiredField / InvalidField / InvalidScope / InvalidPage`;visible exact miss -> `body=None`;visible scope no reports -> `Some(ScopePage(empty))` | resolver closed degradation；complete persisted `Partial / Inconsistent / RebuildRequired / Failed`保留safe report body并按fixed priority aggregate | exact version=`ConsistencyDefect(DomainObject(ReconciliationReport), PersistedVersionSymmetry)`；Scope缺page carrier=`InvalidInput(RepositoryPage, RepositoryAccessShape)`；scope row/count=`ConsistencyDefect(PortReturn(CapabilityReconciliationReportRepository), RepositoryAccessShape)`；no-truth-write/state-failure shape=`DomainRejected(InvariantViolation(ReconciliationReport, ReconciliationOutcomeShape))`;repository failure=`PortFailure` | caller修正selector/page；normal empty不启动Job；persisted Failed不等于repository/test failure；technical/domain defect人工修复；no append/repair/rebuild/handoff/write,不伪造run_id/test/evidence/签署 |

### 31.4 Reference-support Query: 5 / 5

| Protocol / Step 9 flow | input error与normal absence | 允许的typed success degradation | exact technical error | caller action / no-write recovery |
|---|---|---|---|---|
| `GetReferenceResolutionState` / `query_get_reference_resolution_state_flow` | missing / malformed subject-kind -> `MissingRequiredField / InvalidField`;visible unregistered subject -> `Visible/NotApplicable + body=None` | resolver closed degradation；complete canonical `Unresolved / Stale / Expired / Unavailable / Invalid / Forbidden`均保留10-field body并映射`ReferenceUnresolved / StaleSource / ReferenceUnavailable / Redacted` | registered subject/kind union mismatch=`ConsistencyDefect(CrossStoreRelation, PersistedVariantShape)`；ref version=`PersistedVersionSymmetry`；registered ref缺current state=`RequiredSidecar`；state link/subject/kind=`PersistedOwnerRelation`；state version=`PersistedVersionSymmetry`;repository failure=`PortFailure` | caller修正subject-kind；unregistered无需补造；complete non-resolved可later read；technical defect人工修复；不得换family lookup、调用external resolver、refresh state或write |
| `GetExternalDocumentReference` / `query_get_external_document_reference_flow` | missing/malformed id/schema -> `MissingRequiredField / InvalidField / UnsupportedSchema`;visible unregistered document -> `body=None` | resolver closed degradation；complete seven-state pair保留body-free document + nested state view,Invalid/Forbidden使用Redacted | loaded document id/subject/version=`ConsistencyDefect(DomainObject(ExternalDocumentReference), PersistedVersionSymmetry)`；wrong union=`PersistedVariantShape`；missing current state=`ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`；state link/version=`PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | caller修正id/schema；normal miss不fetch document；complete non-resolved可later read；technical defect人工修复；document/schema network、descriptor mutation、refresh/write=`0` |
| `GetRuntimeToolsConsumerReference` / `query_get_runtime_tools_consumer_reference_flow` | missing/malformed id/schema -> `MissingRequiredField / InvalidField / UnsupportedSchema`;visible unregistered RuntimeTools ref -> `body=None` | resolver closed degradation；complete seven-state pair保留body-free consumer + state view,Invalid/Forbidden Redacted | loaded ref id/subject/version=`ConsistencyDefect(DomainObject(RuntimeToolsConsumerReference), PersistedVersionSymmetry)`；wrong union=`PersistedVariantShape`；missing current state=`ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`；state link/version=`PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | caller修正id；normal miss不注册；complete non-resolved可later read；technical defect人工修复；runtime/tools invocation、allowlist、provider/result/cache、refresh/write=`0` |
| `GetSdkExposureConsumerReference` / `query_get_sdk_exposure_consumer_reference_flow` | missing/malformed id/schema -> `MissingRequiredField / InvalidField / UnsupportedSchema`;visible unregistered SDK ref -> `body=None` | resolver closed degradation；complete seven-state pair保留SDK server-boundary summary + state view,Invalid/Forbidden Redacted | loaded ref id/subject/version=`ConsistencyDefect(DomainObject(SdkConsumerReference), PersistedVersionSymmetry)`；wrong union=`PersistedVariantShape`；missing current state=`ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`；state link/version=`PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | caller修正id；normal miss不生成SDK artifact；complete non-resolved可later read；technical defect人工修复；package/client/binding/cache/publication/formal-exposure write/refresh=`0` |
| `GetObservabilityAuditReference` / `query_get_observability_audit_reference_flow` | missing/malformed id/schema -> `MissingRequiredField / InvalidField / UnsupportedSchema`;visible unregistered audit ref -> `body=None` | resolver closed degradation；complete seven-state pair保留audit kind/safe locator + state view,Invalid/Forbidden Redacted | loaded ref id/subject/version=`ConsistencyDefect(DomainObject(ObservabilityAuditReference), PersistedVersionSymmetry)`；wrong union=`PersistedVariantShape`；missing current state=`ConsistencyDefect(CrossStoreRelation, RequiredSidecar)`；state link/version=`PersistedOwnerRelation / PersistedVersionSymmetry`;repository failure=`PortFailure` | caller修正id；normal miss不访问raw store；complete non-resolved可later read；technical defect人工修复；raw log/metric/span/audit、handoff/evidence/signing、refresh/write=`0` |

### 31.5 Query cross-protocol closure

| 审计项 | expected | actual | 结论 |
|---|---:|---:|---|
| independent Query rows | 33 | 33 | pass: `10 + 9 + 9 + 5` |
| each row names Step 9 flow | 33 | 33 | pass |
| input / normal absence explicit | 33 | 33 | pass;normal missing不形成issue |
| resolver / persisted typed degradation explicit | 33 | 33 | pass;只来自closed reason、canonical value或persisted state |
| loaded consistency exact error explicit | 33 | 33 | pass;不再使用`Degraded(Missing / ReferenceUnavailable)`掩盖破损 |
| Port / repository failure remains technical | 33 | 33 | pass;无empty / persisted-unavailable伪装 |
| no-write / no-repair recovery | 33 | 33 | pass;UoW/idempotency/stored result/save/append/refresh/handoff均为0 |
| runtime/tools/marketplace/approval/body boundary | 33 | 33 | pass |

Query不复用`CapabilityCommandOutcome::Rejected`或`CapabilityProtocolRejection`。输入错误与technical error通过handler/service现有`Result`路径交给entry thin wrapper；typed Query success只使用existing `CapabilityQueryResponse<T>` / `CapabilityPageResponse<T>`。`ConsistencyDefect`对应的deterministic issue ref只用于technical handoff和后续Step 15 redacted operational visibility,不得塞入一个成功`Degraded` surface。

## 32. Batch `12.4` Cross-protocol Closure Audit

### 32.1 Coverage arithmetic与surface closure

| 审计项 | expected | actual | 结论 |
|---|---:|---:|---|
| synchronous protocols | 59 | 59 | pass: `26 Command + 33 Query` |
| independent Step 9 flow references | 59 | 59 | pass;无family-level shortcut替代单flow |
| Command mappings | 26 | 26 | pass: `8 + 9 + 9` |
| Query mappings | 33 | 33 | pass: `10 + 9 + 9 + 5` |
| Command business rejection surface | 26 | 26 | pass;existing `CapabilityCommandOutcome::Rejected` + deterministic issue refs |
| Query typed success surface | 33 | 33 | pass;existing single/page response only,无Command rejection复用 |
| technical `Result::Err` path | 59 | 59 | pass;Port/persistence/transaction/codec/consistency不伪装business success |
| transport number / framework binding | 0 | 0 | pass;留Step 14,本批无HTTP/RPC数字 |

### 32.2 Query three-way separation audit

| condition family | exact result | Step 8 / 9同步 | 结论 |
|---|---|---|---|
| visible first target legitimately absent / page empty | `Visible + body=None`或visible empty,no issue | 33 cards + 33 flows | pass |
| resolver closed degradation | typed body-free surface from`CapabilityReadDegradedReason` | Step 6 / 7 / 8 / 9受控回开闭合 | pass;no text parse |
| complete canonical non-resolved state | protocol-declared typed degraded surface | identity/relation/consumer/reference cards + flows | pass;pair完整 |
| complete persisted material / trace degraded state | protocol-declared typed degraded surface,body retention按card | trace/directory/view/export/ecosystem/report cards + flows | pass;state enum authority |
| loaded owner/version/union/index defect | exact `ConsistencyDefect` | all matching cards / pseudocode / error tables / tests | pass;no degraded downgrade |
| registered ref missing current state / committed object missing sidecar | `ConsistencyDefect(CrossStoreRelation, RequiredSidecar)` | all mandatory pair reads | pass;no normal missing downgrade |
| repository / raw failure | `PortFailure` | all 33 rows | pass;no empty/unavailable fabrication |

`IdentityAndMethodAsset` selector与正式current relation endpoint不相等是request-declared no-match,所以保留`Visible + body=None`;它不表示loaded relation内部owner破损。RuntimeTools list的unregistered consumer按卡片返回typed `ReferenceUnavailable` empty,而missing explicit exposure只是no-match visible empty；两者都与registered consumer缺state或loaded exposure version mismatch的technical error分离。

### 32.3 Side-effect、replay与recovery audit

| channel / branch | durable side effect | retry / recovery |
|---|---|---|
| Command pre-reserve input rejection | none | caller修正request；same invalid input不重试 |
| Command post-reserve stable rejection | only replayable rejection/result + completed reservation as declared byflow | duplicate只load stored rejection,不重跑body |
| Command accepted technical failure before confirmed commit | fresh UoW rollback；rollback/unknown按§16 exact error | temporary dependency或reload conflict后按Step 13/14策略新尝试 |
| Command post-commit handoff failure | accepted local truth保持durable | 不blind retry same key；按flow new key + current trace |
| Query NotVisible / missing / degraded / technical error | none | no UoW、idempotency、stored result、save、append、capture、handoff、refresh、repair或Job start |
| consistency defect | none from current attempt | no automatic repair/rebuild;Step 15 redacted visibility + owner data/manual repair |

所有33条Query的handler/service最多执行declared local reads与pure mapping。Resolver degraded不得先读body；collection resolver degraded返回empty/no cursor；loaded bad row不得silent drop或partial prefix。Command duplicate继续遵守stored replay；本批没有改变Step 11 transaction participant、commit order或recovery authority。

### 32.4 Rustdoc与structure audit

- Batch `12.4`本体未新增public/private struct、enum、field、variant或payload field。
- Step 6受控回开的`CapabilityReadDegradedReason` private inner field及`from_kind / as_kind / into_public_marker`均有英文`///`。
- Step 8受控回开的`CapabilityQueryDegradedKind::freshness`与`CapabilityQueryDegradedMarker::from_kind`均有英文`///`。
- Step 9只改existing pseudocode、error table、test cut与audit prose,没有声明新structure。
- Step 12 §§28~32只复用already-defined closed enums / variants；没有`Other`、raw `String`、field-level enum payload `pub`、漏注释结构体或漏注释字段。
- 结构体注释门禁继续通过；本批没有因错误映射新增未注释结构体。

### 32.5 Historical material与boundary audit

| historical / forbidden material | 本批结果 |
|---|---|
| old provider route / quota / cost / failover errors | 未进入59条mapping |
| runtime / tools execution outcome或authorization | 未并入formal applicability / controlled view / consumer ref error |
| marketplace listing / ranking / pricing / publication | 未并入directory / ecosystem material error |
| governance approval / vote / Policy / workflow body | 未并入review / seam relation error |
| method-library asset body / execution | 未并入method relation error |
| secret value / KMS / Vault / credential / provider receipt | 未并入secret safe-summary error |
| SDK package / client / binding / release / cache | 未并入SDK boundary error |
| raw audit / evidence alias / acceptance signature / test result | 未并入trace/export/reconciliation/reference error |
| local delivery retry / dead-letter lifecycle | 未引入；留external collaboration owner与后续事件批次 |

旧README、旧正式`03`及pre-restart `05/06`继续只作historical material / pollution audit。当前上游正式`00/01/02`与Step 6~11不存在阻断`12.4`的冲突；两项本批发现的问题均已在active design source中受控关闭,unresolved upstream blocker=`0`。

## 33. Batch `12.4` 自检与停审记录

| 检查项 | 结果 | 说明 |
|---|---|---|
| input / flow coverage | pass | 26 Command + 33 Query cards / flows逐条读取与mapping,59 / 59 |
| Command closure | pass | rejection、technical error、caller action、UoW / replay均逐协议明确 |
| Query closure | pass | input、normal absence、typed degradation、technical error、caller action/no-write逐协议明确 |
| consistency separation | pass | loaded owner/version/union/index/sidecar defect均为exact technical error,无`Degraded(Missing / ReferenceUnavailable)`降格 |
| typed degraded source | pass | closed reason / canonical value / persisted state三类正式来源；no text/raw/private inference |
| surface reuse | pass | Command复用existing rejection；Query复用existing response/page；无新envelope |
| side effect / recovery | pass | Command遵守existing rollback/replay；Query 33 / 33 zero write / no repair |
| Rustdoc / structure | pass | 无新structure；受控回开1个private field + 5个callable均有英文`///`;结构体/字段/enum/variant注释无遗漏 |
| historical / owner boundary | pass | runtime/tools/marketplace/approval/method body/secret body/SDK implementation/raw audit/local delivery lifecycle未进入taxonomy |
| formal / implementation discipline | pass | 正式`03`未修改；未创建Step 13、implementation ledger、boundary skeleton、代码、commit、run、evidence或测试结果 |
| unresolved upstream blocker | pass | `0`;`CH-DDD-S12-QUERY-DEGRADED-SOURCE-001`与`CH-DDD-S12-QUERY-CONSISTENCY-SEPARATION-001`已关闭 |

```text
gate_status = 03_step_12_batch_12_4_completed_wait_user_review
next_allowed_action = wait_user_confirmation_for_03_step_12_batch_12_5
```

本批完成后必须停审。用户确认后,下一批只允许读取本文件 §§24~33、Step 8六条Inbound + 十条Outbound协议卡、Step 9 batches `9.8~9.10`的16条独立flow、typed receipt / candidate / collaboration outcome与post-commit seam,然后完成`12.5`并再次停审。不得进入8个Operations Job、Step 13、正式`03-详细设计.md`或任何implementation artifact。

## 34. Batch `12.5` 输入反查、问题诊断与事件通道共享规则

### 34.1 本批读取边界与coverage inventory

| 输入 | 本批读取范围 | 用途 | 不得扩张为 |
|---|---|---|---|
| Step 8 Inbound | §§9.1~9.9；6个payload、header-first gate、typed receipt、stored replay和6张独立协议卡 | 固定每个consumer的validation、disposition、marker、issue和effect surface | broker ack/nack、topic、consumer group、retry counter或dead-letter配置 |
| Step 8 Outbound | §§10.1~10.8；10个payload、pure mapper、same-UoW snapshot/capture、shared collaboration facade和10张独立协议卡 | 固定source/capture transaction与post-commit outcome/error分离 | local outbox、publisher delivery state、attempt log或第二payload copy |
| Step 9 Inbound | batch `9.8` §§29~30的6条独立flow | 逐flow定位header、reserve、resolver、UoW、receipt、duplicate和rollback分支 | generic consumer template或worker直连repository |
| Step 9 Outbound | batches `9.9~9.10` §§31~34的10条独立flow | 逐source定位eligibility、mapper、snapshot/capture、commit、collaborate/get/bind和reentry | current-truth rebuild、mapper rerun或external status本地化 |
| Step 10 | canonical reference matrices；local `Captured -> IntentBound`与external five-state boundary | 固定new/existing Forbidden、terminal candidate、local/external state ownership | Inbound自行恢复terminal ref或本地复制delivery lifecycle |
| Step 11 | Consumer atomic receipt UoW；Outbound A/B/C phase；crash/recovery authority | 固定rollback visibility和post-commit source durability | 把external call纳入local rollback或从current truth恢复event |
| batch `12.3~12.4` | closed issue mapper、raw failure disposal、technical error caller action | 复用existing 51-code、17-variant `ApplicationError`和four wrappers | 新issue taxonomy、Event-specific error envelope或transport数字 |

本批protocol arithmetic固定为:

```text
6 Inbound Event Consumer
+ 10 Outbound Event
= 16 event-channel protocols / 16 Step 9 flows
```

`RecordTraceabilityHandoffSummary`的post-commit audit handoff已在batch `12.4` Command逐协议行闭合；本批只把同一“local truth先commit,external outcome/error后发生”的共享恢复原则与event collaboration对齐,不新增第17条event flow或重复Command mapping。

### 34.2 发现的冲突与受控同步

逐flow反查发现`CH-DDD-S12-INBOUND-PORT-RETURN-SEPARATION-001`:Step 9早期占位把matching resolver返回的subject/kind/digest不对称写成`Quarantined` receipt,并把所有typed `Forbidden` observation都提前隔离。该口径同时与Step 7 Port contract、batch `12.2` `ConsistencyDefect`和Step 10 canonical reference矩阵冲突:

1. Caller提交的actor/family/target/candidate/body矛盾属于input boundary,可形成`Rejected / Quarantined` typed receipt。
2. Port返回一个成功外观、但其subject/kind/digest不等于request/selected candidate,属于`PortReturn + ReferenceObservationShape` consistency defect,不能伪装成consumer业务结果。
3. `Forbidden`不允许形成new subject initial state,但existing/digest-reused registered subject可从non-terminal进入body-free `Forbidden` terminal；不能把合法canonical transition全部隔离。
4. Terminal `Invalid / Forbidden`只允许exact same value+reason no-op；任何恢复或reason改写都必须stable reject并要求different candidate/new subject。

受控同步已写入Step 8 §9.7.4和5张reference consumer卡,并同步Step 9五条reference flow的伪代码、错误表与测试切口。Downstream feedback flow不调用reference resolver,只承接shared precedence。修正不新增type、field、enum、variant、callable、trait、Port、protocol或flow；`43 + 7 + 36 + 83`基线保持不变,无需新增Rustdoc声明。

### 34.3 Inbound shared detection precedence

每条Inbound按以下顺序检测；后续逐协议行只能裁剪,不得换序:

1. Worker只读header并校验consumer name、source family、configured actor binding、source event ref、source key、trace和schema。Unsupported schema在typed decode前返回header-only receipt。
2. Supported schema decode后校验target union、required typed fields、actor/family与payload kind对称、forbidden-body marker。可在repository前确定的稳定input rejection不得调用resolver。
3. Application以normalized key读取idempotency owner。Completed same request只读取typed stored receipt；same key不同operation/digest形成duplicate quarantine；Reserved/in-progress形成processing delayed,不运行业务body。
4. Fresh path reserve后执行exact owner/digest/current-state reads。Persisted union/version/state-id/current-index不对称直接`ConsistencyDefect`,不得转`Rejected / Quarantined`。
5. Matching external resolver raw failure若safe class允许temporary retry,rollback并返回processing `Delayed`;其他raw failure走`ApplicationError::PortFailure`。成功typed return必须先做Port-return parity。
6. Deterministic input/policy拒绝可在same UoW保存redacted replayable receipt；actual ref/state/summary effect与typed receipt/result/completion同UoW；任何technical failure whole rollback。

### 34.4 Inbound disposition、issue与replay contract

| branch | exact receipt / error | marker stable order | issue stable order | result / recovery |
|---|---|---|---|---|
| unsupported schema header | `UnsupportedSchema` | `NoLocalEffect` | `UnsupportedSchema` | `result_ref=None`;no decode/reserve/UoW;source需发送supported schema |
| wrong configured actor或source isolation breach | `Quarantined` | `NoLocalEffect`,`BoundaryQuarantined` | `BoundaryQuarantined` | offending identity/body不存储；配置/producer修复,不自动重试 |
| missing/invalid typed field或wrong target union | `Rejected` | `NoLocalEffect` | exact `MissingRequiredField / InvalidField / InvalidScope / PolicyRejected` | safely reserved后保存replayable receipt；source修正event identity/payload后发new event |
| forbidden body marker | `Quarantined` | `NoLocalEffect`,`BoundaryQuarantined` | `BoundaryQuarantined`,`BodyForbidden` | no offending body/resolver/effect；不可原样重试 |
| same normalized key different operation/digest | `Quarantined` | `NoLocalEffect`,`BoundaryQuarantined` | `DuplicateConflict`,`BoundaryQuarantined` | `result_ref=None`;original reservation/result不泄漏、不覆盖 |
| same key still Reserved/in progress | `Delayed` | `RetryRequired`,`NoLocalEffect` | `RetryRequired` | no completed receipt；later exact same event retry,具体窗口留Step 13 |
| completed same request | response-only `DuplicateReplayed` | `StoredReplay`先于original markers并按declaration order dedup | exact original stored issue set | no Clock/id/resolver/UoW/current read；不得重算issue/effect |
| temporary processing prerequisite/resolver unavailable | `Delayed` | `RetryRequired`,`NoLocalEffect` | `RetryRequired` | rollback/no completion/result ref；same exact event可按Step 13/14重试 |
| stable accepted effect | `Accepted` | empty | empty | business effect + typed receipt/surface/shell/completion同UoW |
| stable no-op | `Ignored` | `NoLocalEffect` | empty | no business effect,但保存typed replay authority |
| replayable stable quarantine/rejection | matching typed disposition | as above | primary semantic code后supplemental boundary/body code | no business effect；redacted receipt/surface/shell/completion同UoW |
| Port return/persisted/stored-result asymmetry | exact `ApplicationError::ConsistencyDefect` | none | technical handoff uses`ConsistencyDefect` | whole local rollback；人工/数据/adapter修复,不得形成receipt |
| raw dependency / transaction / codec / optimistic failure | exact `ApplicationError` | none | matching technical issue只用于worker/Step 15 handoff | confirmed pre-commit rollback；unknown按§16恢复,不得伪装Delayed |

Worker对typed receipt如何绑定具体ack/retry/quarantine动作属于Step 14 transport binding；语义上必须保持`Accepted / DuplicateReplayed / Ignored / Rejected / UnsupportedSchema`不要求processing retry,`Delayed`要求retry boundary,`Quarantined`要求隔离。不得在本Step绑定broker numeric code、ack/nack API或backoff。

## 35. Inbound Event Consumer Protocol Error Mapping: 6 / 6

### 35.1 Reference-change Inbound: 5 / 5

| Protocol / Step 9 flow | input / typed disposition mapping | exact technical error families | issue / caller action | UoW / replay / owner boundary |
|---|---|---|---|---|
| `ConsumeGovernanceResultReferenceChanged` / `inbound_consume_governance_result_reference_changed_flow` | missing target/kind/source/scope/declared summary -> `Rejected(MissingRequiredField / InvalidField)`；wrong actor/family/target union、cross-subject digest、immutable kind/source、declared-vs-allowed safe summary -> `Quarantined`；approval/Policy/shared-rules/workflow body或new-subject Forbidden -> `Quarantined + BodyForbidden`；temporary resolver -> `Delayed`；actual ref/state delta -> `Accepted`；strict no-op -> `Ignored`；existing terminal delta -> `Rejected(PolicyRejected)` | resolver return subject/kind/digest=`ConsistencyDefect(PortReturn(GovernanceResultReference), ReferenceObservationShape)`；loaded ref/state union/version/state-id/current link=`ConsistencyDefect(CrossStoreRelation, PersistedVariantShape / PersistedVersionSymmetry / RequiredSidecar)`；raw resolver/repository=`PortFailure`；candidate owner=`UniquenessConflict`；ref/state/capture/result CAS=`OptimisticConflict`；stored replay/surface/UoW按exact variants | quarantine primary=`BoundaryQuarantined`;forbidden补`BodyForbidden`;processing delayed=`RetryRequired`;accepted complete non-terminal/Invalid或existing Forbidden state不追加read-surface issue。Producer修正body-free declaration/target；temporary dependency可same-event later retry；terminal必须different candidate/new subject | ref/state actual revision、state capture、typed receipt/result/completion同UoW；Delayed whole rollback/no completion；duplicate只typed replay。绝不写seam、approval、Policy、exposure或derived truth |
| `ConsumeMethodAssetReferenceChanged` / `inbound_consume_method_asset_reference_changed_flow` | missing/empty asset kind/locator/summary、wrong target -> `Rejected`；wrong actor/family、cross-subject digest、immutable kind、method content/definition/version/source code或new-subject Forbidden -> `Quarantined`；temporary resolver -> `Delayed`；actual delta -> `Accepted`；strict no-op -> `Ignored`；terminal delta -> `Rejected(PolicyRejected)` | resolver return mismatch=`ConsistencyDefect(PortReturn(MethodAssetReference), ReferenceObservationShape)`；ref/state persisted parity=`ConsistencyDefect`；resolver/repository raw=`PortFailure`；digest/current owner collision=`UniquenessConflict`；save/capture/result conflict=`OptimisticConflict`；codec/UoW exact | body hit issues=`BoundaryQuarantined, BodyForbidden`;input rejection选择exact field/policy code；Delayed=`RetryRequired`。Producer只发送body-free asset pointer；terminal/new asset必须new candidate；不得把Cargo/source path当locator fallback | same reference atomic set / replay规则；no method relation/lifecycle/exposure write,no method-library compile/runtime dependency |
| `ConsumeExternalCapabilitySourceReferenceChanged` / `inbound_consume_external_capability_source_reference_changed_flow` | missing/invalid MCP/A2A/API kind或locator、wrong target -> `Rejected`；actor-kind mismatch、cross-subject digest、immutable kind、invocation/request/response/tool schema/A2A/API body/credential或new-subject Forbidden -> `Quarantined`；temporary resolver -> `Delayed`；actual delta -> `Accepted`；strict no-op -> `Ignored`；terminal delta -> `Rejected` | resolver return mismatch=`ConsistencyDefect(PortReturn(ExternalCapabilitySourceReference), ReferenceObservationShape)`；ref/state parity=`ConsistencyDefect`；resolver/repository raw=`PortFailure`；candidate collision=`UniquenessConflict`；save/capture/result CAS=`OptimisticConflict` | input kind/locator问题使用`InvalidField / PolicyRejected`;body quarantine issue顺序固定；producer修正source binding或body-free locator；temporary source resolver可later retry；terminal必须new subject | accepted只写source ref/canonical state/capture/receipt；follow-up仅`CapabilityIdentityIntakeReview`,不创建identity/descriptor,不调用MCP/A2A/API execution/provider route/quota/cost |
| `ConsumeAuditMaterialReferenceChanged` / `inbound_consume_audit_material_reference_changed_flow` | missing/invalid kind/locator/summary或wrong target -> `Rejected`；wrong actor/family、cross-subject digest、immutable kind、raw log/span/metric/alert/audit/GRC/evidence/credential或new-subject Forbidden -> `Quarantined`；temporary resolver -> `Delayed`；actual delta -> `Accepted`；strict no-op -> `Ignored`；terminal delta -> `Rejected` | resolver return mismatch=`ConsistencyDefect(PortReturn(ObservabilityAuditReference), ReferenceObservationShape)`；ref/state parity=`ConsistencyDefect`；resolver/repository raw=`PortFailure`；candidate collision=`UniquenessConflict`；save/capture/result conflict=`OptimisticConflict` | body/evidence quarantine=`BoundaryQuarantined, BodyForbidden`;temporary=`RetryRequired`;producer只发送body-free pointer。No issue/effect可充当evidence alias、acceptance fact或audit handoff receipt | exact ref/state atomic set；`AuditHandoffReview`仅hint；`ObservabilityAuditHandoffPort`、trace/export/evidence/signing调用均为0；duplicate不调用resolver/handoff |
| `ConsumeExternalDocumentReferenceChanged` / `inbound_consume_external_document_reference_changed_flow` | missing/invalid document kind/locator/summary或wrong target -> `Rejected`；wrong actor/family、cross-subject digest、immutable kind、protocol/schema/guide/OpenAPI/provider-contract body/credential或new-subject Forbidden -> `Quarantined`；temporary resolver -> `Delayed`；actual delta -> `Accepted`；strict no-op -> `Ignored`；terminal delta -> `Rejected` | resolver return mismatch=`ConsistencyDefect(PortReturn(ExternalDocumentReference), ReferenceObservationShape)`；ref/state/optional descriptor binding parity=`ConsistencyDefect`；resolver/repository raw=`PortFailure`；candidate collision=`UniquenessConflict`；save/capture/result conflict=`OptimisticConflict` | body quarantine fixed issue order；producer修正typed document pointer；temporary resolver later retry；terminal different candidate/new subject。New ref始终binding None,existing binding bit-for-bit preserve | ref/state/capture/receipt atomic；follow-up仅`DescriptorSupportReview`;不得bind/rebind descriptor、修改registry/exposure/derived truth或读取document body/provider runtime |

### 35.2 Downstream feedback Inbound: 1 / 1

| Protocol / Step 9 flow | input / typed disposition mapping | exact technical error families | issue / caller action | UoW / replay / owner boundary |
|---|---|---|---|---|
| `ConsumeDownstreamConsumptionImpactReported` / `inbound_consume_downstream_consumption_impact_reported_flow` | missing/stale exact impact、impact不包含consumer、invalid feedback field combination或wrong consumer family -> stable`Rejected(InvalidField / PolicyRejected)`；wrong actor-family、execution/tool result/runtime authorization/cache/allowlist/SDK client/package/provider route/quota/cost/raw error body ->`Quarantined`；required registered consumer暂不可读 -> processing`Delayed`；五个valid payload feedback values `Received / Partial / Delayed / Unavailable / Ignored`全部在summary保存成功后返回processing`Accepted` | loaded impact/consumer union/id/version/owner asymmetry、source-feedback summary已存在但无completed replay=`ConsistencyDefect`；repository raw=`PortFailure`；source-feedback uniqueness=`UniquenessConflict(CapabilityImpactRepository, AppendOnlyRecord)`；summary/result/completion conflict=`OptimisticConflict`；stored replay/UoW/codec exact | rejection primary按field/policy；body quarantine=`BoundaryQuarantined, BodyForbidden`;processing delayed=`RetryRequired`。Payload里的Delayed/Unavailable不产生processing RetryRequired issue,因为它们是已成功保存的domain feedback truth | one append-only summary + typed receipt/result/completion同UoW；impact/consumer只读；duplicate只replay original summary ref。No impact mutation、execution call、formal exposure/view write或Outbound event capture |

### 35.3 Inbound cross-protocol closure

| 审计项 | expected | actual | 结论 |
|---|---:|---:|---|
| independent Inbound rows | 6 | 6 | pass: `5 reference + 1 feedback` |
| each row names Step 9 flow | 6 | 6 | pass |
| header-only unsupported schema | 6 | 6 | pass;zero decode/reserve/UoW |
| typed duplicate replay | 6 | 6 | pass;original issue/effect refs,zero body execution |
| delayed / rejected / quarantined split | 6 | 6 | pass;processing retry、stable input refusal、unsafe boundary分离 |
| Port-return vs input contradiction | 5 reference flows | 5 | pass after controlled sync;resolver asymmetry不再伪装receipt |
| terminal reference new/existing split | 5 reference flows | 5 | pass;new Forbidden quarantine,existing non-terminal可transition,terminal不可reopen |
| atomic typed receipt completion | 6 | 6 | pass;Delayed/unsupported excluded |
| runtime/tools/SDK/governance/method/audit/document body owner boundary | 6 | 6 | pass |

Inbound accepted/ignored receipt不把canonical non-Resolved state重复投影为Query degraded issue。Reference状态本身由changed subject/state ref承接,未来读取时才由Query协议按read surface映射。这样worker不需要解析state或issue来决定业务效果,也不会把consumer ingestion与read degradation合并成同一taxonomy。

## 36. Outbound Shared Error、Typed Outcome与Post-commit Recovery Contract

### 36.1 Phase A/B/C error ownership

| phase | authoritative input | exact success | exact failure / outcome | rollback / recovery authority |
|---|---|---|---|---|
| A source mapping + capture,pre-commit | in-memory exact accepted source revision、append-only record/context、caller-owned local UoW | source write + complete immutable snapshot + initial`Captured`record atomic | mapper `DomainError`;application input/invariant/codec/capture repository/UoW errors | any failure before confirmed commit rolls backwhole source UoW；confirmed commit unknown只exact-read source result/capture authority,不得collaborate blindly |
| B post-commit capture load + external call | exact returned/selected`CapabilityEventCaptureRef`;official`get_with_snapshot`;stored immutable bytes | valid typed`CapabilityEventCollaborationOutcome` | missing/asymmetric stored capture=`ConsistencyDefect`;raw Port call=`PortFailure`;typed`Candidate / PendingDelivery / Delivered / Failed / HandoffUnavailable`全部是success return | committed source/result不回滚；pre-intent recovery只使用same capture/snapshot,不得reload source或rerun mapper |
| C stable intent bind | loaded`Captured`record expected version + typed outcome stable intent | local`IntentBound`link committed inshort UoW | bind state/input invariant、CAS、UoW begin/commit/rollback/unknown | source/snapshot不变；confirmed bind failure/rollback后capture保持`Captured`;commit unknown先exact reload capture,禁止blind rebind |
| IntentBound reentry | bound external intent ref + exact capture source | external`get` returns symmetric item/outcome | missing item / intent/source mismatch=`ConsistencyDefect`;raw get=`PortFailure` | no second`collaborate`、bind、capture或source read；external repair只由declared repair Job/Port执行 |

### 36.2 Phase A exact error mapping

| detection point | exact `ApplicationError` family | issue / caller action | local visibility |
|---|---|---|---|
| pure mapper receives two valid domain values that do not describe required relation/source | `DomainRejected(RelationMismatch / InvariantViolation / PolicyRejected)` according to exact mapper guard | matching `InvalidField / PolicyRejected`;source-owning flow must fix its in-memory source assembly,not retry external delivery | whole source UoW rollback |
| source object/record loaded or already persisted with impossible owner/version/union relation | `ConsistencyDefect(DomainObject or CrossStoreRelation, PersistedOwnerRelation / PersistedVersionSymmetry / PersistedVariantShape)` | manual/design/data repair；不得 replace with current object | whole source UoW rollback |
| event-ineligible source shape,例如identity intermediate record、reconciliation-as-registry、view-as-generic-derived、non-Identified impact、reference no-op | matching domain policy/formation error;若从persisted impossible source装配则`ConsistencyDefect` | source-owning flow must omit capture for legal non-event branch；不伪造event | no snapshot/capture commit |
| complete envelope serialization / deserialization | `CodecFailure(OutboundEventEnvelope)` | implementation/binding repair；同source UoW未commit时可重新执行whole owner operation only under its own idempotency rules | rollback |
| candidate digest canonicalization / verification | `CodecFailure(EventCandidateDigest)` | codec repair；不得hash raw error/body或切换adapter-private digest | rollback |
| new snapshot/capture typed formation | `InvalidInput(TechnicalObject(EventPayloadSnapshot/EventCaptureRecord), EventCaptureShape)`或`TechnicalInvariantViolation(EventCaptureShape)` | implementation/source assembly repair；不提交payload-only fallback | rollback |
| `(source_ref,schema_ref)`不同canonical capture winner | `UniquenessConflict(CapabilityEventCaptureRepository, EventCaptureSourceSchema)` | reload formal capture winner only underStep 13 collision algorithm；不得创建alias event/source | loser UoW rollback |
| capture repository raw/CAS/UoW failure | `PortFailure / OptimisticConflict / transaction variants` | temporary class可按source owner Step 13策略重试whole uncommitted attempt；conflict先reload exact owners | rollback/unknown按exact transaction rule |

Phase A没有public Outbound rejection envelope。Error沿source-owning Command/Inbound/Job现有`Result::Err`传播；若source owner已定义stored replay,duplicate只回放stored result且不重跑mapper/capture。Worker或infra不得单独调用capture service补偿一个未带snapshot/capture提交的source。

### 36.3 Phase B typed outcome与raw failure separation

| external result | `issue_code_for_collaboration` | local bind | source/result | caller / recovery |
|---|---|---|---|---|
| `Candidate` | none | bind stable intent | unchanged/accepted | external owner may advance later；本仓不创建pending state |
| `PendingDelivery` | none | bind stable intent | unchanged/accepted | no automatic local retry；status belongs external owner |
| `Delivered` | none | bind stable intent | unchanged/accepted | terminal external observation；no local business effect |
| `Failed` + required safe reason | `CollaborationFailed` | bind stable intent | unchanged/accepted | exact intent可由later repair Job调用external repair；不得rollback source或复制reason到capture |
| `HandoffUnavailable` + required safe reason | `CollaborationUnavailable` | bind stable intent | unchanged/accepted | same exact intent later repair；不得生成second intent/local unavailable state |
| no valid typed outcome because raw call failed | `ApplicationError::PortFailure(CapabilityAccessEventCollaboration, ..)` -> `DependencyFailure` | no bind | source/capture remaincommitted/`Captured` | temporary class可用same stored candidate重试；permanent/unexpected需binding/manual repair；no text/status inference |
| typed outcome source/intent/reason shape invalid | `ConsistencyDefect(PortReturn(CapabilityAccessEventCollaboration), CollaborationOutcomeShape)` | no bind | source committed,capture`Captured` | adapter/owner repair；不得把invalid return降格`Failed`或fabricate intent |

`CollaborationFailed / CollaborationUnavailable`只用于later Job report或Step 15 body-free operational mapping。Ten outbound envelopes没有issue field,source-owning accepted result也不保存collaboration outcome,所以immediate continuation不得把这两个code写回source result、capture、trace、change record或event payload。

### 36.4 Phase B/C recovery matrix

| failure / interruption | durable visible state | permitted recovery | forbidden recovery |
|---|---|---|---|
| process stops aftersource commit,beforeexternal call | source + snapshot +`Captured` | exact capture ref if retained,orapplication repair Job `list(AwaitingIntent)`;load stored bytes | source/current truth scan byworker、mapper rerun、new snapshot/capture |
| `get_with_snapshot` returns missing required capture/snapshot or bad five-tuple/bytes/digest | source committed；local capture relation defective | `ConsistencyDefect`;Step 15 redacted visibility + data/manual repair | recreate snapshot fromsource,serialize current truth,callcollaborate |
| external raw failure beforestable intent | source + valid`Captured` | same exact stored candidate only when safe failure/retry policy permits | new candidate id、new capture、local attempt/dead-letter state |
| external typed Failed/Unavailable | source +`Captured`,external stable intent exists | validate source thenbind same intent；later repair exact intent | treat typed outcome asexception、rollback source、copyexternal status locally |
| process stops afterexternal intent,beforelocal bind | source +`Captured`;external stable intent exists | idempotent same candidate must return same stable intent,thenbind;algorithm Step 13 | create second intent、guess intent fromlogs/topic |
| bind CAS/confirmed commit failure | source + snapshot unchanged;capture remains`Captured` | exact reload capture,thenStep 13 reentry using same outcome/candidate | rerun source、overwrite winner、bind different intent |
| bind commit unknown | capture durability unknown | exact `get_with_snapshot`;ifIntentBound verify bound exact intent,ifCaptured followStep 13 same-candidate path | blind bind/collaborate |
| IntentBound external get missing/asymmetric | local exact intent link remains | consistency/manual external-owner repair | recollaborate、replace link、mark local Failed |

### 36.5 Worker / handoff / owner boundary

- `worker::event_publisher`若收到application已选择的exact capture ref,只能调用`CapabilityEventCollaborationService::collaborate_captured_event`;worker-local wiring/decode failure可包装`WorkerError::Source(CollaborationContinuation)`,但不得改变application error分类或直接持有repository/publisher adapter。
- Audit handoff与event collaboration共享“post-commit external failure不回滚local truth”,但authority不同:audit handoff使用exact trace/export + audit ref；event collaboration使用exact capture/snapshot + external intent。两者不得共享local delivery record或generic retry queue。
- Step 14绑定physical broker/client/timeout/ack；Step 13闭合same-candidate stable intent、bind race与retry window；Step 15定义redacted phase telemetry。本批不提前声明参数或执行结果。

## 37. Outbound Event Protocol Error Mapping: 10 / 10

### 37.1 Truth / Relation Change Outbound: 6 / 6

| Protocol / Step 9 flow | Phase A source / capture errors | Phase B/C post-commit mapping | recovery / forbidden effect |
|---|---|---|---|
| `CapabilityIdentityChanged` / `outbound_capability_identity_changed_capture_and_collaborate_flow` | record/context trace、record/identity id/state/version、`explains_identity`不成立 -> exact domain relation/invariant；若loaded persisted pair不可能则`ConsistencyDefect`；`CorrectionRequested -> CorrectionPending`against final Active是ineligible policy branch,不得capture；envelope/digest=`CodecFailure`;snapshot/capture shape=`InvalidInput / TechnicalInvariantViolation`;capture collision/repository/CAS/UoW按§36.2 | official snapshot defect=`ConsistencyDefect(EventCaptureRecord/EventPayloadSnapshot, EventCaptureShape)`；external raw=`PortFailure`;typed outcome五态保持；outcome source/intent=`ConsistencyDefect(PortReturn(CapabilityAccessEventCollaboration), CollaborationOutcomeShape)`；bind conflict/UoW exact | source UoW任一Phase A failure rollback identity/change/trace/material/result/capture；post-commit identity/result不变。不得从current identity/review重建event、调用runtime/governance/marketplace或为intermediate record补capture |
| `CapabilityRegistryChanged` / `outbound_capability_registry_changed_capture_and_collaborate_flow` | wrong source union、record/entry identity/lifecycle/version/trace不对称 -> domain relation/invariant或persisted`ConsistencyDefect`；reconciliation report/finding/projection input -> policy rejection,zero registry capture；codec/capture/store/UoW exact | shared Phase B/C；typed Failed/Unavailable可bind,不改registry lifecycle | Phase A rollbackregistry/change/material/result；post-commit source staysaccepted。不得从report合成registry record、修registry、创建marketplace/runtime routing state |
| `AdapterDescriptorChanged` / `outbound_adapter_descriptor_changed_capture_and_collaborate_flow` | record/descriptor id/state/marker/trace不对称 -> domain/persisted consistency；forbidden provider/secret/document body不得形成envelope；dual`SecretReferenceChanged / SafeSummaryChanged`each eligible record必须各自capture,第二capture失败whole source rollback；codec/capture exact | each exact capture independently uses shared collaboration;one post-commit failure does not erase either capture/source；typed outcome not descriptor state | no record merge、partial source commit、provider lookup、secret value或document resolver。Delivery failure不得retire/mark descriptor unresolved |
| `GovernanceSeamRelationChanged` / `outbound_governance_seam_relation_changed_capture_and_collaborate_flow` | wrong source union、record/relation identity/state/version/trace或owner relation -> domain relation/invariant或persisted consistency；approval/Policy/shared-rules/workflow body ->`DomainRejected(ForbiddenBoundary / WriteBoundaryViolation)`；codec/capture exact | shared typed outcome/raw/source/bind mapping | source UoW rollbackseam/change/trace/material/result；post-commit seam remainsaccepted state。不得 activate/expire/forbid seam、resolve governance body或claim approval |
| `CapabilityMethodRelationChanged` / `outbound_capability_method_relation_changed_capture_and_collaborate_flow` | record/relation identity/method endpoint/state/version/trace mismatch -> exact domain relation/invariant or consistency；method content/definition/version/source code -> forbidden boundary；codec/capture exact | shared post-commit mapping | source UoW rollbackrelation/change/sidecars；post-commit relation unchanged。不得 callmethod resolver/library body、mark relation stale/removed或execute method |
| `FormalExposureBoundaryChanged` / `outbound_formal_exposure_boundary_changed_capture_and_collaborate_flow` | record/exposure/registry owner/state/version/trace mismatch、refresh hint与`requires_consumer_view_refresh()`不等 -> domain relation/invariant or persisted consistency；`ConsumerViewMarkedStale`source -> policy rejection；runtime/SDK/listing authority -> write-boundary rejection；codec/capture exact | shared post-commit mapping | source UoW rollbackexposure/visibility/registry/change/trace/material/result；post-commit failure不得suspend/retire/reactivate exposure、改visibility或启动view refresh。Hint不是Job execution |

### 37.2 View / Impact / Derived / Reference Outbound: 4 / 4

| Protocol / Step 9 flow | Phase A source / capture errors | Phase B/C post-commit mapping | recovery / forbidden effect |
|---|---|---|---|
| `ControlledConsumerViewAvailabilityChanged` / `outbound_controlled_consumer_view_availability_changed_capture_and_collaborate_flow` | exact view id/version、exposure/audience pair、freshness/reason/source versions或context trace不成立 -> domain invariant/policy；persisted impossible view ->`ConsistencyDefect(DomainObject(ControlledConsumerView), PersistedOwnerRelation / PersistedVersionSymmetry)`；use asgeneric DerivedMaterial event -> policy rejection；codec/capture exact | shared typed outcome/raw/source/bind mapping | view save + snapshot/capture + Job journal/source result atomic；post-commit view/exposure unchanged。不得reload current view/exposure/consumer,authorize runtime/tools,mutate SDK client/cache/package或emit second event family |
| `CapabilityChangeImpactIdentified` / `outbound_capability_change_impact_identified_capture_and_collaborate_flow` | impact not`Identified`,has state reason,empty consumers,impact/trace/context/change-subject/version mismatch -> domain invariant/relation or persisted consistency；execution feedback body -> forbidden/write-boundary；codec/capture exact | shared post-commit mapping | impact save/result/capture atomic；post-commit impact remainsIdentified。不得 appenddownstream feedback、trigger execution、change impact state或bill/cost |
| `DerivedMaterialRefreshed` / `outbound_derived_material_refreshed_capture_and_collaborate_flow` | unsupported/controlled-view source union、material kind/id/version与availability cross-kind、empty/invalid source versions、report trace/no-truth-write mismatch -> domain `DerivedMaterial` policy/invariant；persisted impossible object/report -> consistency；codec/capture exact | shared post-commit mapping per exact material/report capture | each target/material/report save-or-append + capture + journal/result atomic；post-commit cannot rebuild/repair material/core truth。No RegistryChanged、raw index/audit/listing/row diff/evidence/test/acceptance fact |
| `ReferenceResolutionChanged` / `outbound_reference_resolution_changed_capture_and_collaborate_flow` | subject-kind、state id/version、trace/context或payload resolution value mismatch -> domain reference policy/invariant or persisted consistency；same value+same reason no-op is ineligible,zero capture；locator/resolver response/external owner body as event authority -> forbidden boundary；codec/capture exact | shared post-commit mapping；stored snapshot only,zero resolver/ref/state reload；typed outcome cannot advancecanonical state | state/affected material/result/capture atomic；post-commit canonical state remainsaccepted。不得 rerunresolver、rewriteexternal ref、repair relation/exposure/truth或emit second state revision |

### 37.3 Outbound cross-protocol closure

| audit | expected | actual | 结论 |
|---|---:|---:|---|
| independent Outbound rows | 10 | 10 | pass: `6 + 4` |
| each row names Step 9 flow | 10 | 10 | pass |
| exact source/schema/payload gate | 10 | 10 | pass;no current-truth source |
| source + snapshot + Captured atomicity | 10 | 10 | pass;Phase A failure whole rollback |
| post-commit official snapshot authority | 10 | 10 | pass;mapper/source reload count=0 |
| five typed collaboration statuses | 10 | 10 | pass;healthy/failed/unavailable all typed outcome,not exception |
| raw Port vs typed outcome split | 10 | 10 | pass;raw only when no valid outcome |
| source-validated stable intent bind | 10 | 10 | pass;short UoW,external status not copied |
| IntentBound no-repeat | 10 | 10 | pass;external get only |
| local outbox / retry / dead-letter lifecycle | 0 | 0 | pass |

All ten protocols share one application collaboration facade but retain ten independent source/error rows。A family-level helper cannot decidesource eligibility、record/object symmetry、event-family exclusivity orforbidden owner material；those remain the matching pure mapper / source flow contract。

## 38. Batch `12.5` Cross-protocol Closure Audit

### 38.1 Coverage arithmetic与independent mapping audit

| coverage item | expected | actual | 结论 |
|---|---:|---:|---|
| Inbound protocol cards / Step 9 flows / error rows | 6 / 6 / 6 | 6 / 6 / 6 | pass；5 reference + 1 downstream feedback均独立映射 |
| Outbound protocol cards / Step 9 flows / error rows | 10 / 10 / 10 | 10 / 10 / 10 | pass；6 truth/relation + 4 view/impact/derived/reference均独立映射 |
| cumulative Step 12 protocol mapping | 83 | 75 | pass for current gate；59 synchronous + 6 Inbound + 10 Outbound,remaining 8 Operations Job |
| generic event row used instead of protocol row | 0 | 0 | pass |
| new Event error envelope / public field | 0 | 0 | pass |

当前`75 / 83`只表示设计映射coverage,不是实现完成率、测试coverage或验收进度。Remaining 8必须在batch `12.6`逐Job闭合,不得由本批的Inbound/Outbound共享表代替。

### 38.2 Inbound separation与terminal-state audit

| audit axis | exact gate | result |
|---|---|---|
| caller contradiction | actor/family/target/candidate/body矛盾只能形成redacted typed `Rejected / Quarantined` receipt | pass；不得暴露offending body或原result |
| matching resolver success asymmetry | subject/kind/digest mismatch必须是`ConsistencyDefect(PortReturn(matching resolver), ReferenceObservationShape)` | pass；5 / 5 reference flow whole rollback且不fabricate receipt |
| new terminal candidate | new subject typed `Forbidden`不得形成initial state | pass；quarantine、zero ref/state/capture |
| existing non-terminal candidate | validated `Forbidden` observation可走existing `transition`形成body-free terminal | pass；与Step 10 canonical matrix一致 |
| existing terminal replay | exact same value + reason=`Ignored`;任何delta=`Rejected`并要求different candidate/new subject | pass |
| successful non-resolved save | `Unresolved / Stale / Expired / Unavailable / Invalid / Forbidden`不额外写Query read-surface issue | pass；canonical state refs承接truth |
| downstream processing disposition | payload `Delayed / Unavailable / Ignored`成功保存后仍为processing `Accepted` | pass；payload truth不等于consumer retry |

`CH-DDD-S12-INBOUND-PORT-RETURN-SEPARATION-001`已在Step 8 §9.7.4 / 五张reference卡、Step 9五条reference flow与本文件§34~§35受控同步关闭。该修正没有新增type、field、enum、variant、callable、trait、Port、protocol或flow。

### 38.3 Outbound transaction、typed outcome与recovery audit

| audit axis | exact gate | result |
|---|---|---|
| Phase A | accepted source revision + complete snapshot + initial `Captured`同caller-owned UoW | pass 10 / 10；任一failure whole rollback |
| Phase B valid return | `Candidate / PendingDelivery / Delivered / Failed / HandoffUnavailable`均为typed success outcome | pass 10 / 10；不得包装为raw Port error |
| Phase B raw failure | 只有无法取得合法typed outcome时进入`ApplicationError::PortFailure` | pass；source/capture保持committed/`Captured` |
| Phase C | stable intent source parity通过后short UoW bind | pass；bind failure不回滚source或snapshot |
| IntentBound reentry | exact external intent `get` only | pass；second collaborate/bind count=0 |
| failed/unavailable visibility | `CollaborationFailed / CollaborationUnavailable`只供later Job report或Step 15 | pass；不写event、accepted source result、trace或capture |
| local delivery lifecycle | outbox / attempt / retry / dead-letter / delivery state count=0 | pass |

Audit handoff与event collaboration都遵守post-commit external failure不回滚local truth,但仍是两个不同authority seam。本批没有把Command handoff算成第17条event protocol,也没有合并audit owner与event-collaboration owner。

### 38.4 Cross-step、historical与fabrication audit

| check | result |
|---|---|
| Step 8 Inbound cards与Step 9五条reference flow旧口径残留 | pass after controlled sync；resolver mismatch与caller contradiction已分离,blanket `Forbidden -> Quarantined`已移除 |
| Step 8 / Step 9 count | unchanged；250 public types、83 protocols / flows、36 Ports |
| Rust declaration comment gate | pass；本批未新增struct、field、enum、variant或callable,无新增英文`///`义务且既有注释未删除 |
| runtime/tools execution、marketplace listing、governance approval、method body混入 | none |
| local outbox / delivery product、transport code或配置提前绑定 | none |
| formal `03-详细设计.md`修改 | no |
| Step 13文件、implementation ledger、planned boundary skeleton创建 | no |
| implementation commit、real run_id、test result、evidence alias或acceptance signature声称 | none |
| unresolved upstream blocker | `0` |

## 39. Batch `12.5` 自检与停审记录

| 自检项 | 结果 |
|---|---|
| 6个Inbound逐协议mapping | pass；6 / 6 |
| 10个Outbound逐协议mapping | pass；10 / 10 |
| cumulative mapping | pass for current gate；75 / 83,remaining 8 Job |
| receipt / error source separation | pass；input boundary与Port-return consistency不混写 |
| reference initial / transition / terminal / replay | pass |
| Outbound Phase A/B/C与post-commit recovery | pass |
| typed collaboration outcome不降格error | pass |
| formal文档与实现产物禁入 | pass |
| upstream blocker | none；`CH-DDD-S12-INBOUND-PORT-RETURN-SEPARATION-001`已关闭 |
| commit requirement | none；未经用户明确要求不得提交 |

```text
gate_status = 03_step_12_batch_12_5_completed_wait_user_review
next_allowed_action = wait_user_confirmation_for_03_step_12_batch_12_6
```

本批现在停审,不得自动进入`12.6`。用户确认后,下一批只允许读取:

1. 本文件§§15~20、§§24~27及§§34~39,复用exact `ApplicationError`、issue mapper与event-channel recovery边界；
2. Step 8 §11 shared Job envelope / typed replay / journal assembler和§11.8.1~§11.8.8全部8张Operations Job卡；
3. Step 9 batches `9.11~9.12`,即§§35~39的8条Job flow,特别是planning / initial UoW、per-target UoW、final-report UoW与reserved reentry；
4. Step 6 typed Job execution journal / target plan / target outcome / final linkage、Step 7 idempotency / stored typed Job report / execution journal / matching repository与UoW contract；
5. Step 10 application technical state矩阵与Step 11 Job initial-target-final transaction / consistency / crash recovery contract。

下一批只完成8个Operations Job逐协议错误与恢复映射,不得进入`12.7`全局收口、Step 13、正式`03-详细设计.md`或任何implementation artifact。

## 40. Batch `12.6` 输入反查、问题诊断与受控同步

### 40.1 本批读取边界与 coverage inventory

本批在写入mapping前重新读取Step 8 §11.1~§11.9、Step 9 §§35~39、Step 6 `CapabilityJobExecutionRecord`及support types、Step 7 idempotency / stored Job report / execution-journal repositories和Step 11 Job initial / target / final UoW及crash recovery。8个protocol / flow的exact inventory如下:

| # | Operations Job | Step 9 flow | target family / durable success | unique external or state boundary |
|---:|---|---|---|---|
| 1 | `RunCapabilityRegistryReconciliation` | `job_run_capability_registry_reconciliation_flow` | zero or one `RegistryReconciliation` -> `Succeeded(Reconciliation)` | five-state immutable report;no registry repair |
| 2 | `RefreshControlledConsumerView` | `job_refresh_controlled_consumer_view_flow` | ordered `ControlledView` -> `Succeeded(ControlledView)` | exact exposure / visibility applicability;final Ready / Partial only |
| 3 | `RebuildDirectorySearchBrowseProjection` | `job_rebuild_directory_search_browse_projection_flow` | ordered `DirectoryProjection` -> `Succeeded(DirectoryProjection)` | exact registry / descriptor / exposure chain;final Ready only |
| 4 | `PrepareAuditFriendlyExportSummary` | `job_prepare_audit_friendly_export_summary_flow` | ordered `AuditExport` -> `Succeeded(AuditExport)` | exact historical trace + ref/state pairs;four-way canonical-value outcome |
| 5 | `RebuildReadOnlyEcosystemDiscoverySummary` | `job_rebuild_read_only_ecosystem_discovery_summary_flow` | ordered `EcosystemDiscovery` -> `Succeeded(EcosystemDiscovery)` | exact visibility / exposure applicability;final Ready / Partial / Unavailable |
| 6 | `RunDerivedMaterialReconciliation` | `job_run_derived_material_reconciliation_flow` | zero or one `DerivedReconciliation` -> `Succeeded(Reconciliation)` | five-state immutable report;no automatic rebuild |
| 7 | `RefreshExternalReferenceResolution` | `job_refresh_external_reference_resolution_flow` | ordered `ReferenceResolution` -> `Succeeded(ReferenceResolution)` or stable `Skipped` | seven matching resolvers;terminal canonical state;no initial-state repair |
| 8 | `RepairCapabilityAccessEventCollaboration` | `job_repair_capability_access_event_collaboration_flow` | ordered `EventCapture / CollaborationIntent` -> `Succeeded(EventCollaboration)` | official snapshot and external typed outcome;external status remains Port-owned |

Coverage denominator remains the Step 8 / 9 protocol baseline,not repository methods ortarget ordinals:

```text
26 Command + 33 Query + 6 Inbound + 10 Outbound + 8 Job = 83 protocols / flows
batch 12.4 = 59 synchronous
batch 12.5 = 16 event-channel
batch 12.6 = 8 Operations Job
```

`CapabilityJobExecutionIssueImpact`仍只包含`Advisory / StableFailure / RetryablePrerequisite`,是final disposition input,不是issue reason taxonomy。每个target row继续由`CapabilityJobTargetRef + CapabilityProtocolValidationIssueRef`定位和分类；run-level issue继续只有issue ref + typed impact。不得新增`StableFailure`、`RetryablePrerequisite`同名issue code,也不得从opaque ref反解析impact。

### 40.2 `CH-DDD-S12-JOB-SAFE-TERMINALIZATION-001` 受控同步

逐Job反查发现旧卡片和早期flow表把“正常缺失 / 不适用”和“loaded owner / version / union / sidecar defect”都概括为target failure,并在若干技术失败分支宽泛允许`PreclassifiedFailure / Failed`。该表述会让实现者在无法证明零业务效果、rollback或exact target identity时仍把`Planned`改为terminal,随后final assembler把控制面缺陷固化为可重放report。

本批登记并关闭`CH-DDD-S12-JOB-SAFE-TERMINALIZATION-001`,裁决如下:

1. 只有同时持有exact target + run identity、existing closed body-free issue、typed impact及确定零业务效果或confirmed rollback时,才允许形成`PreclassifiedFailure`或把`Planned`写为`Failed / Skipped`。
2. Loaded owner / version / union / state-id / source-chain、mandatory sidecar、capture / snapshot、intent / outcome、journal / reservation / stored-report不对称一律为exact `ConsistencyDefect`,不得target terminalization或final report。
3. `CodecFailure`、rollback failure、commit outcome unknown、invalid / unclassified Port return、journal save / reload或final-store control-plane failure不得固化为target issue；当前target保持`Planned`或execution保持未finalized。
4. External target Port只在已有safe `ApplicationPortFailureKind`且能证明target zero local effect时terminalize:`TemporarilyUnavailable / Timeout -> DependencyFailure + RetryablePrerequisite`;`NotConfigured / PermanentlyRejected -> DependencyFailure + StableFailure`;`InvalidTypedResponse / UnexpectedSourceFailure`保留exact `ApplicationError`并要求adapter /人工修复。
5. Target-local optimistic conflict只有在target UoW confirmed rollback、exact journal reload仍显示同ordinal `Planned`且failure target-ref对称后,才写`OptimisticConflict + RetryablePrerequisite`。Commit unknown、rollback failure或journal CAS loser均不得借此终态化。

受控同步已写入Step 6 §12.8 / §20.23、Step 8 §11.6~§11.8和Step 9 §35及8条Job flow的failure matrix。同步不改变target plan/success enum、journal字段、assembler、DTO、protocol、flow、trait或Port数量；没有新增Rust declaration,因此没有新增struct / field / enum / variant / callable Rustdoc义务,既有结构体和字段注释保持完整。

### 40.3 Normal target、control-plane defect与typed outcome分界

| observed condition | internal result | journal mutation | public / recovery result |
|---|---|---|---|
| invalid trigger/schema/request body/scope before accepted plan | existing validation / domain rejection | no reservation orjournal | `Rejected`;caller修正request或new key |
| complete safe scan finds zero target | no error andnoissue | empty plan + no blocking run issue | `Completed`;detail empty/`None`;duplicate exact replay |
| planning cannot finish buthasclosed safe run issue | typed planning failure | empty plan + `StableFailure / RetryablePrerequisite` run issue ininitial UoW | `Failed / Retryable`;reserved reentry doesnotrescan |
| planning fails without safe issue,or codec / consistency / rollback / commit status isunknown | exact `ApplicationError` | no new journal,or existing journal unchanged | no typed Job report;repair control plane / exact-read durable state |
| exact target normally absent / inapplicable beforeeffect | target-specific closed reason + typed impact | `PreclassifiedFailure` remains Planned untilzero-effect UoW records Failed | final failed-target row;valid siblings continue |
| exact terminal reference target | `TerminalTargetSkipped` | zero-effect `Skipped` target UoW | skipped-target row;no resolver/effect |
| loaded target relation or mandatory sidecar asymmetric | `ConsistencyDefect` | keep target `Planned` | no final report;data/adapter/design repair |
| typed no-op or typed external failed/unavailable outcome | typed `Succeeded(...)` item | effect-free ordeclared effect + success journal atomic | success item;typed outcome isnotfailed target |
| safely classified target dependency failure | closed issue + impact afterzero-effect proof | `Failed` target UoW | failed-target row;retryability comesfromimpact |
| target write conflict afterconfirmed rollback | `OptimisticConflict + RetryablePrerequisite` | exact reload thenzero-effect `Failed` save | final `Retryable`;retry usesnew run/key afterfinalization |
| target commit may be durable | `CommitOutcomeUnknown` | do notwriteterminal outcome | exact journal/effect recovery;no blind retry |
| all targets terminal andassembler symmetry valid | no error | final-report UoW stores typed report + Finalized + Completed | fresh typed response;later duplicate stored replay only |
| assembler / serialization / final store / final commit failure | exact technical error | execution staysunfinalized unlessunknown requiresexact read | reentry assembles fromjournal only;no target/source rescan |

Normal missing与consistency defect必须按检测事实分开。Repository返回`None`只在协议已声明该exact target可正常不存在且identity仍可安全保留时形成`SubjectMissing`;repository已经返回loaded value但owner / ref / expected version / current index不对称时不允许先降格成missing。Similarly,typed collaboration`Failed / HandoffUnavailable`与canonical value `Invalid / Forbidden`是closed outcome/state,不能因名称含failure就机械转成`ApplicationError`。

## 41. Shared Operations Job Entry、Planning、Target、Final与Replay Error Contract

### 41.1 Entry与idempotency mapping

| branch | exact internal mapping | public mapping | read / write / recovery |
|---|---|---|---|
| header / job name / schema / run / actor / trace / idempotency metadata invalid | `ContractRejected`、`InvalidInput`或`DomainRejected`按§16 precedence | `Rejected` + exact existing validation issue;`report=None` | before Clock/id/scope/repository/UoW；caller修正输入 |
| jobs entry decode / dispatch / result mapping fails before/afterapplication call | `JobError` thin wrapper overexact source / `ApplicationError` | onlyexisting `JobInputFailed / JobApplicationDispatchFailed / JobResultMappingFailed / UnsupportedSchema` atentry boundary | never manufacture target/report;raw source staysnonpublic |
| same normalized key + same operation/digest isCompleted | no fresh error | `DuplicateReplayed`,stored response/report/issues byte-for-byte semantic copy | onlyidempotency + matching stored report/surface validation;no Clock/id/source/target/Port call |
| same key + same request isReserved | exact journal required | no `IdempotencyInProgress` shortcut when valid journal exists;resume first Planned orfinal phase | journal identity must match key/operation/job/schema/run/digest;no scope rescan |
| same key identifies different channel/operation/digest | `IdempotencyConflict` | `Rejected`/entry error according existing Job handler surface;never leak winner report | no body,plan orwinner mutation;caller usesoriginal request ornew key |
| Completed without stored report/surface,Reserved without journal,orwrong stored variant/digest/result ref | `ConsistencyDefect(TechnicalObject(...), RequiredSidecar / StoredResultShape / JobExecutionShape)` | no replay/report | operator/data repair;never regenerate fromcurrent truth |

Job public response没有generic error envelope。Accepted execution只在journal可安全terminalize和finalize后形成`Completed / PartiallyCompleted / Failed / Retryable`;entry/application technical error继续由existing `Result<..., ApplicationError>`与薄包装返回。不得把所有`ApplicationError`转换成一个empty failed report。

### 41.2 Planning / initial UoW mapping

Planning必须先形成完整contiguous plan或closed empty-plan failure,再开启initial UoW。任何prefix candidate都不是durable recovery source。

| planning / initial branch | allowed classification | journal / reservation effect | forbidden shortcut |
|---|---|---|---|
| complete valid scope,includingzero targets | no issue or`Advisory` only | atomic `Reserved + complete Planned journal` | scan by target loop orreentry rescan |
| stable target identity + normal missing/inapplicable/terminal boundary | exact target reason + impact | target plan is`PreclassifiedFailure` orclosed skip-capable plan;initial outcome remains`Planned` | fake source/material/summary/id;initial direct terminal outcome |
| scope/page fails beforecomplete target set withsafe closed category | actual issue code + `StableFailure / RetryablePrerequisite` | discard prefix;atomic `Reserved + empty plan + run issue` | partial plan,raw text issue,empty-success disguise |
| loaded owner/version/union/index/source pair defect | `ConsistencyDefect` | no initial commit | missing/partial/skip conversion orcurrent fallback |
| request digest / plan / issue construction orserialization fails | `CodecFailure / InvalidInput / TechnicalInvariantViolation` | no initial commit | generic `JobInputFailed` persisted asrun issue |
| repository/resolver Port failure beforecomplete plan | exact `PortFailure`;onlysafe class + closed run reason may useempty planning-failure journal | eitheratomic typed empty plan orno effect | inferretry fromstatus/message;persistraw detail |
| reserve/create save fails androllback succeeds | original error / `Transaction*` according§16 | no visible owner | start targets withoutboth records |
| reserve/create rollback fails orinitial commit unknown | `TransactionRollbackFailed / CommitOutcomeUnknown` | visibility unknown | retry planning orcreate second journal |
| concurrent reserve returnsExisting | rollback local initial UoW,exact re-enter winner | loser effect zero | overwrite/upsert winner orkeeprequest-local plan |

`PreclassifiedFailure` is not itself a terminal outcome. Target loop must exact-load it,prove the embedded issue target equals outer target ref,then save`record_failed`alone in a zero-business-effect UoW。If that journal save / commit fails,the row remains`Planned`;the original planning fact can be retried fromthe same frozen plan withoutre-expanding scope。

### 41.3 Per-target error / recovery precedence

Every Job applies the following target precedence before its protocol-specific rows:

```text
exact journal identity + first Planned ordinal
  -> plan variant / outer target-ref symmetry
  -> exact planned source / mandatory sidecar load
  -> loaded owner / union / version / source symmetry
  -> typed Port-return parity,when an external Port is called
  -> pure no-op / terminal / typed outcome decision
  -> declared target effect + snapshot/capture + Succeeded in one UoW
  -> only after confirmed rollback,optional safe Failed / Skipped UoW
  -> exact journal reload before the next ordinal
```

| failure family | exact error / issue + impact | target outcome rule | recovery authority |
|---|---|---|---|
| wrong Job plan/success variant、ordinal gap、target ref mismatch | `ConsistencyDefect(TechnicalObject(JobExecutionRecord), JobExecutionShape)` | stay`Planned` | journal/data/design repair |
| exact prerequisite normally absent afterplanning | actual `SubjectMissing / StaleSource / PolicyRejected` + `StableFailure` | afterzero-effect proof mayrecord`Failed` | same frozen target;no current replacement |
| current terminal reference candidate | `TerminalTargetSkipped` | `Skipped`,zero effect | new candidate / separate replacement flow only |
| loaded source / effect owner,ref,version,state-id,sidecar asymmetry | `ConsistencyDefect` withmatching subject/invariant | stay`Planned` | repair exact stored relation;no fallback |
| pure factory/policy rejects frozen valid-looking plan | `DomainRejected` or`TechnicalInvariantViolation` | stay`Planned` unless an existing protocol-specific closed target reason was already defined beforeeffect | design/data repair;do notinventissue fromenum text |
| external temporary/timeout withno typed outcome | `PortFailure` internally;`DependencyFailure + RetryablePrerequisite` onlyafterzero-effect proof | mayrecord`Failed` | final report Retryable;new run/key onlyafterfinalization |
| external not-configured/permanent reject withno typed outcome | `PortFailure`;`DependencyFailure + StableFailure` onlyafterzero-effect proof | mayrecord`Failed` | configuration/owner repair;current report stable failure |
| external invalid typed/unexpected source orsuccess-shaped parity mismatch | exact `PortFailure` or`ConsistencyDefect(PortReturn(...), ...)` | stay`Planned` | adapter/operator repair;no guessed item |
| material/reference/capture CAS loser | `OptimisticConflict + RetryablePrerequisite` onlyafterconfirmed rollback + exact journal reload | mayrecord`Failed` | final Retryable;no winner-as-success inference |
| target repository/capture/journal save fails beforecommit androllback succeeds | original exact technical error | stay`Planned`;do notclaim failed target unlessall target effects provedzero andsafe mapping exists | exact journal;earlier terminals retained |
| rollback fails | `TransactionRollbackFailed` | stay`Planned` | operator transaction-state inspection |
| commit unknown | `CommitOutcomeUnknown` | no new outcome | exact journal anddeclared effect reads;neverblind retry |
| post-commit collaboration ofnew local capture fails | target success remainscommitted | no failure rewrite | official capture remainsrepairable byseparate Job |

### 41.4 Final assembly、store与duplicate replay

Final phase may start only afterexactly one journal reload proves all target outcomes terminal、execution still`Planned`、matching idempotency state`Reserved`,and allidentity fields symmetric。The matching module-private assembler ispure andmust reject rather thanrepair any mismatch。

| final branch | exact mapping | durable result / reentry |
|---|---|---|
| all terminal andmatching success/failure/skip payloads | deterministic assembler;impact precedence fromStep 8 §11.3.1 | construct exact typed response inordinal order |
| any target stillPlanned | `TechnicalInvariantViolation` or`ConsistencyDefect(JobExecutionShape)` accordingwhether caller orstored row iswrong | resume target loop;neverfinalize partial journal |
| wrong success variant/ref/source/state/change,PreclassifiedFailure notFailed,or reconciliation Failed missingStableFailure run issue | `ConsistencyDefect(JobExecutionShape)` | no report;repair journal/design,neverdrop bad row |
| application/public result refs、stored variant/surface/digest/shell/envelope notsymmetric | `CodecFailure` before persistence or`ConsistencyDefect(StoredResultShape)` when loaded | no successful response/replay;do notregenerate fromtargets |
| final save / confirmed-not-durable commit failure + rollback success | exact store / transaction failure | journal remainsunfinalized,targets terminal;reentry repeats pure assembly witha fresh uncommitted result identity |
| final rollback failure / commit unknown | `TransactionRollbackFailed / CommitOutcomeUnknown` | exact-read stored report + journal + idempotency beforeany retry |
| final commit succeeds | typed report + execution`Finalized` + idempotency`Completed` shareone application result ref | return fresh response；duplicate later loadsstored response only |
| completed replay shape mismatch | `ConsistencyDefect` | no current journal/source scan andno synthesized report |

Disposition order remains exact: any`RetryablePrerequisite` -> `Retryable`;single reconciliation success with`report_state=Failed` + required`StableFailure` run issue -> `Failed`;success mixed withfailed/skipped/stable run issue -> `PartiallyCompleted`;no success plusfailure -> `Failed`;all success orvalid empty plan withonlyAdvisory/no issue -> `Completed`。`Unchanged`is success,notskip；typed external`Failed / HandoffUnavailable` item is success unless the Port failed toproduce that typed outcome。

## 42. Operations Job Protocol Error Mapping: 8 / 8

### 42.1 Reconciliation Jobs: 2 / 2

| Protocol / Step 9 flow | planning / normal target mapping | target technical mapping andsafe terminalization | typed result / final recovery | owner boundary |
|---|---|---|---|---|
| `RunCapabilityRegistryReconciliation` / `job_run_capability_registry_reconciliation_flow` | invalid non-registry-centered scope -> `Rejected(InvalidScope)`；complete empty basis -> empty `Completed`；safe incomplete broad scan -> empty-plan actual issue + `StableFailure / RetryablePrerequisite`；valid basis freezes one report target。Normal source absence that still leavesa typed comparison basis isrepresented inreport findings,notdropped；no valid basis meansno fabricated report | loaded truth/material owner/version/index/source-set defect=`ConsistencyDefect`;Port raw failure follows§41；report append/capture/journal CAS conflict may become`OptimisticConflict + RetryablePrerequisite` onlyafterconfirmed rollback；codec/rollback/commit unknown staysPlanned。A persisted report target is`Succeeded(Reconciliation)`evenwhenstate isFailed | `Completed` empty orreport success；report-state mapping:`Completed` -> no run issue,`Partial` -> `PartialSurface + StableFailure`,`Inconsistent / RebuildRequired` -> `StaleSource + Advisory`,`Failed` -> `MaterialUnavailable + StableFailure` andouter disposition must beFailed。Final failure recoversfromterminal journal,never`find_by_job_run`orrescan | registry/change/truth/material read-only；writes onlyimmutable report + derived capture + journal；zero registry repair/Command/governance approval |
| `RunDerivedMaterialReconciliation` / `job_run_derived_material_reconciliation_flow` | invalid/widened scope -> `Rejected`;complete empty basis -> empty `Completed`;safe incomplete scan -> issue-bearing empty plan;valid complete comparison freezes one report target | truth/material pair asymmetry=`ConsistencyDefect`;target append/capture conflict onlysafe retryable afterrollback；`RebuildRequired` istyped finding,noterror orautomatic next Job；Failed report remainscommitted success detail | same five-state mapping andfinal assembler rules asregistry reconciliation；detail `reconciliation=None` onlyforvalid empty/typed planning-failure shape,neverhidesa lost report | no material rebuild/save,core truth repair,scheduler chaining,runtime/tools ormarketplace call |

The reconciliation mapping is intentionally based onthe persisted five-state report enum rather than prose labels orfinding text。`Completed` forms no issue；`Partial` signals a usable butstable partial report；`Inconsistent / RebuildRequired` remains advisory because the immutable report itself was successfully formed andthe required remediation isseparate；`Failed` requires stable failed disposition while preserving the exact report view。

### 42.2 Derived material refresh / rebuild Jobs: 4 / 4

| Protocol / Step 9 flow | normal missing / degraded mapping | consistency / dependency / conflict mapping | success / recovery andforbidden shortcut |
|---|---|---|---|
| `RefreshControlledConsumerView` / `job_refresh_controlled_consumer_view_flow` | explicit registered consumer normally absent/inapplicable ormissing required accepted source beforematerial id -> `PreclassifiedFailure(SubjectMissing / PolicyRejected, StableFailure)`；existing valid view absence under`ExplicitConsumers`may create；policy-allowed optional gaps freezePartial andremain success | loaded exposure/visibility/descriptor/relation/reference/view owner/version/union/source-set mismatch=`ConsistencyDefect`;repository failure follows§41；view save/capture/journal optimistic conflict may terminalize`OptimisticConflict + RetryablePrerequisite` onlyafterconfirmed rollback | exact same Ready/Partial summary -> `Unchanged` success；create/update savesfinal Ready/Partial + availability capture + journal atomically。No Rebuilding/Unavailable intermediate,exposure/visibility write,runtime cache orcurrent-source replan |
| `RebuildDirectorySearchBrowseProjection` / `job_rebuild_directory_search_browse_projection_flow` | normal missing registry/accepted descriptor/formal exposure orretired/unresolved chain withsafe target identity -> `PreclassifiedFailure(SubjectMissing / StaleSource / PolicyRejected, StableFailure)`；valid chain maycreate missing projection | any loaded registry/descriptor/exposure/projection owner/id/version/source-chain asymmetry=`ConsistencyDefect`;no current descriptor/exposure fallback；save/capture conflict onlysafe retryable afterrollback | complete Ready + exact source/display/facets match -> `Unchanged`;otherwise final Ready save + `DerivedMaterialRefreshed` + success atomic。No Rebuilding/Unavailable failure revision,provider lookup,listing/index/ranking orregistry creation |
| `PrepareAuditFriendlyExportSummary` / `job_prepare_audit_friendly_export_summary_flow` | exact trace normally absent -> `PreclassifiedFailure(SubjectMissing, StableFailure)`；complete canonical pair values:allResolved -> Ready,anyUnavailable -> Unavailable,elseanyUnresolved/Stale/Expired -> Partial；anyInvalid/Forbidden -> failed target`PolicyRejected + StableFailure` withzero material effect | loaded trace/change/ref/state owner/union/state-id/version pair orplanned existing export mismatch=`ConsistencyDefect`;normal non-resolved value isnotdefect；repository failure/conflict follows§41 | exact frozen state/reason/resolved-ref set -> `Unchanged`;else same-trace/scope refresh clearsold refs,attaches frozen resolved subset,saves one final state + capture + success。No raw audit handoff,evidence alias/signature,current trace fallback orpartial item fabrication |
| `RebuildReadOnlyEcosystemDiscoverySummary` / `job_rebuild_read_only_ecosystem_discovery_summary_flow` | exact exposure/context pair absent,formal visibility notapplicable,orrequired accepted source absent -> `PreclassifiedFailure(SubjectMissing / PolicyRejected, StableFailure)`；policy-allowed optional basis freezesPartial/Unavailable andremains success | loaded exposure/visibility/descriptor/relation/reference/material owner/version/source-marker asymmetry=`ConsistencyDefect`;repository failure/conflict follows§41；no marketplace fallback | exact frozen Ready/Partial/Unavailable state/reason/summary/version match -> `Unchanged`;else final summary + capture + success atomic。NeveremitStale asrebuild success,write listing/pricing/transaction truth,orchange exposure/visibility |

The four material Jobs only report actual`Created / Updated / Unchanged`typed items。A target failure never writes a fabricated degraded material revision。Optional closed degradation that the domain object explicitly supports is a successful material state,while a missing mandatory pair orloaded asymmetry is respectively a normal target failure orcontrol-plane consistency defect。

### 42.3 Reference refresh Job: 1 / 1

| Protocol / Step 9 flow | exact mapping |
|---|---|
| `RefreshExternalReferenceResolution` / `job_refresh_external_reference_resolution_flow` | Invalid schema/scope/empty kind filter -> `Rejected` before scan。Complete empty scan -> empty `Completed`。Explicit subject notregistered -> `PreclassifiedFailure(SubjectMissing, StableFailure)`；registered subject withoutmandatory current state,orloaded ref/state subject/kind/state-id/version pair mismatch -> `ConsistencyDefect`,notfailed target。Current`Invalid / Forbidden`candidate -> `Skipped(TerminalTargetSkipped)` withzero resolver/effect。Matching resolver raw `TemporarilyUnavailable / Timeout` -> afterzero-effect proof`DependencyFailure + RetryablePrerequisite`;`NotConfigured / PermanentlyRejected` -> `DependencyFailure + StableFailure`;`InvalidTypedResponse / UnexpectedSourceFailure` stays exact `PortFailure` andtarget`Planned`。Resolver success subject/kind/digest mismatch -> `ConsistencyDefect(PortReturn(matching resolver), ReferenceObservationShape)`。Same value+same reason -> `Unchanged`;same value+changed reason ornew validated value,includingInvalid/Forbidden -> one`Updated`state + `ReferenceResolutionChanged`capture + journal success same UoW。State/capture/journal conflict onlyafterconfirmed rollback mayrecord`OptimisticConflict + RetryablePrerequisite`;codec/rollback/commit unknown staysPlanned。Final response copiesterminal journal only；`Created`isconsistency error,missing state isneverrepaired byinitial factory,anddependent material/core truth isnotchanged。 |

The eight resolver families remain selected bythe frozen typed `ReferenceKind`;no generic string dispatch、HTTP status mapping orbody lookup isallowed。A target finalized asRetryable isnotresumed inside the finalized journal；retry is a newrun/key whose planning reads the then-current exact reference state underStep 13 policy。

### 42.4 Event collaboration repair Job: 1 / 1

| Protocol / Step 9 flow | independent mapping scope |
|---|---|
| `RepairCapabilityAccessEventCollaboration` / `job_repair_capability_access_event_collaboration_flow` | Complete mapping covers planning of explicit capture / intent targets、official capture-snapshot consistency、Captured collaboration + local bind、IntentBound get-only、intent inspection / repair、five-state typed outcome、raw Port failure、optimistic bind conflict、journal-only final assembly andstored duplicate replay；the branch table below isthis protocol row's exact expansion。 |

| target / branch | exact internal / public mapping | journal / recovery rule |
|---|---|---|
| explicit capture orintent normally absent duringcomplete planning | `PreclassifiedFailure(SubjectMissing, StableFailure)` | zero-effect Failed row;valid siblings continue |
| loaded capture/snapshot source、snapshot id、schema、digest、captured time orsnapshot bytes/digest asymmetric | `ConsistencyDefect(CrossStoreRelation, EventCaptureShape / RequiredSidecar)` | target remainsPlanned;no candidate,bind,item orreport |
| loaded intent/item/outcome intent/source asymmetric orbound intent missing | `ConsistencyDefect(PortReturn(CapabilityAccessEventCollaboration), CollaborationOutcomeShape)` | no failed-target downgrade orfabricated intent/status |
| Captured + nointent returnsvalid typed Candidate/Pending/Delivered/Failed/HandoffUnavailable | typed outcome issuccess；Failed -> `CollaborationFailed`,HandoffUnavailable -> `CollaborationUnavailable`,othersnoissue | bind exact stable intent + `Succeeded(EventCollaboration)` inone target UoW；local status notcopied |
| Captured external call succeeds butlocal bind/journal commit fails | local target remainsPlanned unlesscommit exact success isproven；external intent mayexist | reentry uses same official snapshot candidate andrequires stable same intent/source semantics；no current truth/mapper rerun |
| IntentBound capture | exact external`get`;any valid typed status remains success | journal-only success；zero collaborate/repair/bind |
| intent Candidate/Delivered | inspect only;typed success | journal-only；zero repair |
| intent PendingDelivery/Failed/HandoffUnavailable | exact same-intent `repair`;valid typed outcome remains success | journal-only；no local delivery state |
| external raw temporary/timeout beforetyped outcome | `PortFailure` internally;afterzero-effect proof `DependencyFailure + RetryablePrerequisite` target failure | final Retryable;newrun/key retry only |
| external raw notconfigured/permanent reject beforetyped outcome | `DependencyFailure + StableFailure` onlyafterzero-effect proof | final Failed/Partial;configuration orowner repair |
| external invalid/unexpected source failure orinvalid typed return | exact `PortFailure`;source/intent mismatch is`ConsistencyDefect` | target remainsPlanned;adapter/operator repair,noterror-text item |
| local bind optimistic conflict | onlyconfirmed rollback + exact journal reload permits`OptimisticConflict + RetryablePrerequisite` | neverinferanother capture revision/intent as this target success |
| terminal journal/final report | item/status/issue copiedexactly inordinal order | no capture/intent Port reread;duplicate onlystored typed report |

This Job never rolls backthe original truth、change、trace orsource operation result。It creates no newOutbound Event、snapshot orcapture,uses no source mapper,andowns no Candidate/Pending/Delivered/Failed/HandoffUnavailable local state。External typed failure status is a reportable success item;only failure to obtain a valid typed outcome may become a target failure underthe safe-terminalization gate。

## 43. Batch `12.6` Cross-protocol Closure Audit

### 43.1 Coverage arithmetic与independent mapping audit

| family | Step 8 cards | Step 9 flows | Step 12 mappings | result |
|---|---:|---:|---:|---|
| Command | 26 | 26 | 26 | pass in`12.4` |
| Query | 33 | 33 | 33 | pass in`12.4` |
| Inbound Event Consumer | 6 | 6 | 6 | pass in`12.5` |
| Outbound Event | 10 | 10 | 10 | pass in`12.5` |
| Operations Job | 8 | 8 | 8 | pass in`12.6` |
| total | 83 | 83 | 83 | pass；unmapped=0,duplicate family row=0 |

The 8 Job rows are independently named andmapped in§42；shared §41 onlydefines common phase precedence anddoesnotreplacea concrete mapping。Both reconciliation Jobs areseparate rows,all four derived-material Jobs areseparate rows,andreference / collaboration Jobs retain theirunique resolver/external-owner semantics。

### 43.2 Initial / target / final / replay cross-phase audit

| audit | result |
|---|---|
| fresh reservation与complete plan atomicity | pass；initial UoW eithercommits bothorzero；no prefix / private checkpoint |
| stable failed target identity retention | pass；exact target uses`PreclassifiedFailure`,neverrun issue orfake success plan |
| safe terminalization proof | pass；exact identity + closed issue + typed impact + zero effect / confirmed rollback allrequired |
| control-plane failure preservation | pass；codec/consistency/rollback/commit-unknown/journal/final-store defect neverbecomesfailed target |
| per-target effect atomicity | pass；material/report/reference/capture binding + event capture whenchanged + success journal sharetarget UoW |
| optimistic conflict | pass；confirmed rollback + exact Planned reload required；winner isnotinferredsuccess |
| external typed outcome separation | pass；reference observation andcollaboration status remaintyped outcomes；invalid parity isexact error |
| final assembly source | pass；alltarget vectors/detail/refs/issues/disposition deriveonlyfromterminal journal |
| completed duplicate | pass；stored variant-bound report only；zero Clock/id/scope/source/target/external calls |
| crash recovery | pass；normalized key journal/stored report areonlyauthorities；no current scan、report-by-run orrequest-local accumulator |

### 43.3 Issue、impact、disposition与state audit

1. Target reason uses one ofthe existing 51 closed issue codes；impact remainsseparate andtyped。No raw source、subject id、run id、timestamp、Port name orerror text isembedded inthe issue ref。
2. `SubjectMissing / PolicyRejected / StaleSource / PartialSurface / MaterialUnavailable / TerminalTargetSkipped / DependencyFailure / OptimisticConflict` each has anexplicit use boundary；none is a wildcard forconsistency defects。`RedactedBoundary` remainsQuery/read-only andisnotused byaJob write/rejection path。
3. Reconciliation five-state mapping isexhaustive:`Completed -> no run issue`;`Partial -> PartialSurface + StableFailure`;`Inconsistent / RebuildRequired -> StaleSource + Advisory`;`Failed -> MaterialUnavailable + StableFailure`andouterFailed。
4. Controlled view supportsfinal Ready / Partial；directory supportsfinal Ready；audit export supportsReady / Partial / Unavailable orfailed target；ecosystem supportsReady / Partial / Unavailable；reference refresh supportsUpdated / Unchanged / terminal skip；collaboration supportsallfive external typed statuses withoutlocal status copy。
5. `CapabilityJobProtocolDisposition::DuplicateReplayed / Rejected` remainentry/replay dispositions andarenotassembled fromfresh journal impacts。Fresh accepted execution onlyassembles`Completed / PartiallyCompleted / Failed / Retryable`。

### 43.4 Rustdoc、historical boundary与fabrication audit

| check | result |
|---|---|
| new Rust struct / enum / field / variant / callable | none；本批只收紧mapping与recovery prose |
| existing struct / field comments | pass；Step 6 journal/support types与Step 8 Job DTO / target / report fields仍逐项有English `///`；未删除或遗漏结构体注释 |
| public type / protocol / flow / Port baseline | unchanged；250 public types、83 protocols / flows、36 Ports、43 HLD objects + 7 application helpers |
| runtime/tools execution、provider invocation、marketplace listing | absent；Job只维护declared hub material/reference/collaboration surface |
| governance approval / method-library body truth | absent；只读body-free ref/relation/seam inputs,不代批、不复制asset body |
| local outbox / delivery attempt / scheduler / lease / retry counter | absent；external collaboration owner和Step 13/14后移边界不变 |
| raw audit / evidence alias / acceptance sign-off | absent；audit export只保存allowed body-free summary/ref set |
| formal `03-详细设计.md` | not modified；正式§11 assembly source仍留`12.7` |
| Step 13 / implementation ledger / boundary skeleton | not created |
| implementation commit、real run_id、test result、evidence或acceptance signature | not fabricated |
| unresolved upstream blocker | `0`;`CH-DDD-S12-JOB-SAFE-TERMINALIZATION-001`已受控关闭 |

## 44. Batch `12.6` 自检与停审记录

| 自检项 | 结果 |
|---|---|
| 8个Operations Job逐协议mapping | pass；8 / 8 |
| cumulative protocol / flow mapping | pass；`26 + 33 + 6 + 10 + 8 = 83 / 83` |
| planning / initial UoW | pass；complete plan或typed empty failure与reservation原子提交 |
| target safe terminalization | pass；normal target failure与control-plane defect严格分开 |
| final assembler / stored replay | pass；journal-only assembly、variant-bound stored replay |
| reconciliation five-state mapping | pass；issue/impact/disposition闭合 |
| material/reference/collaboration owner boundary | pass |
| structure comment gate | pass；无新增声明,既有struct / field / enum / variant / callable注释未遗漏 |
| formal文档与实现产物禁入 | pass |
| upstream blocker | none；`CH-DDD-S12-JOB-SAFE-TERMINALIZATION-001`已关闭 |
| commit requirement | none；未经用户明确要求不得提交 |

```text
gate_status = 03_step_12_batch_12_6_completed_wait_user_review
next_allowed_action = wait_user_confirmation_for_03_step_12_batch_12_7
```

本批现在停审,不得自动进入`12.7`。用户确认后,下一批只允许读取:

1. 本文件§§7~44,特别是exact error owner、51-code mapper、83 / 83逐协议mapping及各批受控同步；
2. Step 6~11 current completion gate、Step 10 illegal transition和Step 11 rollback / commit-unknown / recovery authority；
3. 详细设计SOP Step 12与书写规范§5.11的四类必备输出；
4. 正式`00 / 01 / 02` owner边界、旧正式`03`和README historical-material清单；
5. Step 13 handoff所需error / retryability / recovery输入,但不得提前创建Step 13文件。

下一批只完成全局异常 / rollback / consistency / recovery收口、historical audit、Step 6~11 closure、正式§11 assembly source和Step 13 handoff。不得修改正式`03-详细设计.md`、进入Step 13或创建任何implementation artifact。

---

## 45. Batch `12.7` 输入复核、收口裁决与全局处理顺序

### 45.1 输入复核与无回开结论

| 输入 | 本批复核结果 | 本批使用方式 | 是否回开 |
|---|---|---|---|
| Step 6 objects / helpers | 43个HLD objects + 7个application technical helpers；fallible callable、closed reason、event capture和Job journal均有明确owner | 复用`ContractValueError` / `DomainError` producer与7类technical-object context | 否 |
| Step 7 Port / repository / UoW | 36个application-owned Ports；22 repository traits / 110 methods；所有fallible Port统一返回`ApplicationError` | 复用32个`ApplicationPortKind`与UoW manager failure boundary；不增加finder / Port | 否 |
| Step 8 protocols | 250 public types、83 protocols；51个closed issue codes与existing rejection / Query / receipt / outcome / Job surface可用 | 只装配existing public surface；不新增error envelope / DTO field | 否 |
| Step 9 flows | `26 + 33 + 6 + 10 + 8 = 83 / 83` independent flows；transaction、effect和reentry位置完整 | 每个异常分支可回指`12.4~12.6`逐协议mapping | 否 |
| Step 10 states | 22 local mutable state machines + 1 external Port-owned boundary；Step 13同步后111 active variants / 638 pairs全部分类 | illegal / no-op / terminal拒绝保持domain error；loaded state asymmetry保持consistency defect | 已同步幂等两态 |
| Step 11 persistence | 22 traits / 110 methods、UoW ordering、crash visibility、rollback scope和durable recovery authority闭合 | 作为rollback / commit-unknown / replay / recovery唯一输入 | 否 |
| 正式`00 / 01 / 02` | identity、registry、descriptor、governance seam、method relation和formal exposure / SDK server boundary明确 | 作为错误owner和恢复权限边界 | 否 |
| 旧正式`03` / README | provider contract、decision、cost、KMS / Vault、runtime / tools execution、marketplace和local outbox主线冲突 | 只进入§52 historical audit | 否 |

Batch `12.7`当时未发现需要受控回开Step 6~11的缺口。Step 13后续发现并完成本仓两态幂等同步；`CH-DDD-S13-CORE-IDEMPOTENCY-CANONICAL-001`保留历史诊断并已由显式用户授权依赖假设解除，L0-core正式设计同步为非阻塞债务，不改变本Step的17个application errors、51个issue codes或83条protocol mapping。既有struct / field / enum / variant / callable Rustdoc基线保持完整。

### 45.2 全局失败分类处理顺序

一个入口只能沿以下顺序形成一个主结果。先命中的分支停止后续分类；不得把technical failure降格为typed business outcome，也不得把typed non-error surface升级为exception：

```text
entry envelope / schema / route validation
  -> normal typed no-error surface?
     - Query NotVisible / normal missing / persisted declared degradation
     - resolver / handoff / collaboration valid typed outcome
     - Job normal target failure satisfying safe-terminalization proof
  -> ContractValueError
  -> DomainError
  -> ApplicationError input / technical state / prerequisite
  -> idempotency / optimistic / uniqueness conflict
  -> codec / Port / transaction failure
  -> commit outcome unknown
  -> loaded / returned consistency defect
  -> channel-local thin wrapper
  -> existing protocol surface or technical Result::Err
```

Global precedence rules:

1. `NotVisible`、normal missing / empty page、persisted declared degradation、explicit reference value、handoff disposition和collaboration status都是typed surface；它们不是`ApplicationError`。
2. Loaded row已形成但owner / version / union / index / required sidecar不对称时直接使用`ConsistencyDefect`；不得回退`MissingPrerequisite`、normal missing、degraded、`PortFailure`或Job failed target。
3. CAS / unique / dependency fence有typed winner / loser语义时使用exact conflict variant；只有Port未形成合法typed classification时才使用`PortFailure`。
4. Pre-commit业务错误先rollback；rollback成功后保留原错误，rollback失败时top-level recovery error为`TransactionRollbackFailed`，原错误只留nonpublic source chain。
5. Commit明确not durable时为`TransactionCommitFailed`；无法证明durability时为`CommitOutcomeUnknown`，禁止猜测success / zero effect或blind retry。
6. External call产生合法typed outcome后，该outcome保持external-owner result；local truth已经commit时不得因后续external failure回滚。只有无法获得合法typed outcome才进入technical error。
7. Job target只有exact identity、closed issue、typed impact、zero effect / confirmed rollback四项同时成立才可terminalize；否则journal target保持`Planned`并返回exact application / wrapper error。

### 45.3 Recovery action vocabulary

以下标签只用于本Step和正式§11恢复表，不是新Rust enum或protocol field：

| recovery class | precise meaning | 必须前置 | 禁止动作 |
|---|---|---|---|
| `CorrectAndResubmit` | 修正request、schema、scope、forbidden input或正式prerequisite后使用新attempt | 原attempt没有accepted effect，或已有stored rejection可exact replay | 同输入循环重试、修改原stored rejection |
| `ExactReplayOnly` | 从normalized key关联的immutable stored surface读取原结果 | Completed reservation与matching result / receipt / report对称 | 重新运行body、从current truth重建 |
| `ExactReadThenDecide` | 读取同key reservation、winner、journal、capture或current owner后再按typed state决定 | exact durable key / ref已知 | scope scan、run scan、时间窗口猜测 |
| `ReloadAndRetry` | 确认loser UoW为zero effect后，重读exact version / owner并形成新attempt | rollback成功且durability明确 | 复用stale `Loaded.expected_version` |
| `RetryDependency` | 对same typed Port input发起由Step 13 / 14约束的新attempt | failure为`TemporarilyUnavailable / Timeout`且local effect边界已知 | 解析raw text、在本Step定义次数/backoff |
| `ResumeDurableState` | 从Captured / IntentBound / Reserved journal等已有durable state继续 | matching snapshot / capture / intent / journal完整对称 | reload current truth重新mapping / planning |
| `OwnerOrOperatorRepair` | 由正式owner、adapter、数据修复或人工检查消除stable failure / consistency defect | redacted typed category与exact durable refs可定位 | application自动补造sidecar或越权修改上游truth |
| `NoRecoveryRequired` | typed outcome本身是合法最终读面、receipt、external status或Job report item | existing protocol明确允许该surface | 将其转换为technical failure或自动写truth |

## 46. 全局错误类型表

本节是SOP要求的错误类型表。Exact Rust declaration、variant payload与Rustdoc仍以§§11~18为准；本表固定owner、retryability、外部surface和回指位置。

### 46.1 Stable owner errors

| 错误类型 / family | 所属模块 | exact触发条件 | recovery / retryability | 对外映射 | 主要回指 |
|---|---|---|---|---|---|
| `ContractValueError` 10 variants | `contracts::errors` | typed id / safe text / set / source-version / Job ordinal constructor拒绝输入 | `CorrectAndResubmit`;同输入不可原样重试 | Command / Job可映射existing validation rejection；Query / entry input为technical mapping | §§11、24.1、29~33、41~44 |
| `DomainError` 10 variants | `domain::errors` | factory、policy、invariant、relation、reference-state、write boundary、state transition或terminal reopen拒绝 | input / official state改变后新attempt；no automatic retry | Command / Job按逐协议closed code映射；technical channels保持typed error | §§12、24.1、30、35、42 |
| `InvalidInput / InvalidTechnicalStateTransition / TechnicalInvariantViolation` | `application::errors` | application technical carrier、operation context、read decision、capture或journal shape错误 | caller / implementation修复；zero effect | matching closed issue code；不得伪装domain or public success | §§15~16、24.1、29、34、41 |
| `MissingPrerequisite` | `application::errors` | flow声明mandatory typed prerequisite不存在且无合法typed fallback | `OwnerOrOperatorRepair`后新attempt；通常不可直接重试 | `MissingPrerequisite`;normal Query absence不得使用 | §§15.2、16、29~32、35、42 |
| `OptimisticConflict` | `application::errors` | exact expected version、dependency fence或concurrent successor拒绝write | rollback成功后`ReloadAndRetry` | `OptimisticConflict`;Job只在safe terminalization后形成retryable target | §§16、29、30、35~37、41~43 |
| `UniquenessConflict` | `application::errors` | formal unique/current-owner key已有different winner | `ExactReadThenDecide`;按protocol走duplicate / rejection / new key | `UniquenessConflict`或existing protocol-specific rejection | §§15.2、16、29~30、34~35 |
| `IdempotencyConflict` | `application::errors` | same normalized key的channel / operation / digest不同 | 不可重试同key；使用original request或new key | Command / Job existing duplicate-conflict rejection；Inbound typed rejection/quarantine规则 | §§16、29、34、41 |
| `IdempotencyInProgress` | `application::errors` | same key仍Reserved且具体事务机制证明matching owner仍active、尚无replayable terminal result | `ExactReadThenDecide`;不得运行body | technical in-progress / channel-declared delayed surface；committed orphan改`ConsistencyDefect` | §§16、29、34、41 |
| `PortFailure` + 6 safe classes | `application::errors` | application-owned Port未产生合法typed return | temporary/timeout=`RetryDependency`;其余`OwnerOrOperatorRepair` | `DependencyFailure` technical mapping；typed Port outcome不进入本错误 | §§15.3、16~18、25、29、34~37、41~42 |
| `TransactionBeginFailed` | `application::errors` | UoW manager在任何staged write前失败 | confirmed zero effect后由Step 13决定new attempt | matching technical code | §§16~18、25、48~49 |
| `TransactionCommitFailed` | `application::errors` | commit明确返回not durable | confirmed zero effect后由Step 13决定new attempt | matching technical code | §§16~18、25、48~49 |
| `TransactionRollbackFailed` | `application::errors` | pre-commit failure后的rollback本身失败 | `OwnerOrOperatorRepair`;禁止宣称rollback成功 | matching technical code；不持久化business result | §§16~18、25、48~49 |
| `CommitOutcomeUnknown` | `application::errors` | caller无法证明commit成功或失败 | `ExactReadThenDecide`;禁止blind retry | matching technical code | §§16、29、34~37、41、48~49 |
| `ConsistencyDefect` | `application::errors` | loaded / returned persisted relation违反closed invariant | `OwnerOrOperatorRepair`;不自动重试 | technical error + deterministic body-free issue ref | §§15.1、16、24.1、47.3、48~50 |
| `CodecFailure` | `application::errors` | request digest、stored surface、outbound envelope或candidate digest codec/integrity失败 | implementation / data repair后new attempt | `CodecFailure`;不得输出partial bytes | §§15.2、16、24.1、48~49 |

### 46.2 Thin wrapper and non-error surfaces

| surface | owner | role | retry / recovery authority | mapping boundary |
|---|---|---|---|---|
| `InfraError` | `infra::errors` | 保留concrete source chain并经closed classification单向进入`ApplicationError` | 完全继承stable application class；runtime assembly failure由operator处理 | §§17~18、25.1~25.2 |
| `ApiError` | `api::errors` | route / envelope / schema / DTO mapping或application error的local wrapper | input修复或继承application action | §§17~18、25.3、29 |
| `WorkerError` | `worker::errors` | inbound / continuation / maintenance entry local wrapper | typed receipt优先；technical action继承application class | §§17~18、25.3、34~38 |
| `JobError` | `jobs::errors` | trigger / input / result mapping或application Job error wrapper | typed response优先；technical action继承application class | §§17~18、25.3、41~43 |
| `CapabilityQuerySurface` typed missing / not-visible / degraded | `contracts` protocol surface | 合法read result，不是error | `NoRecoveryRequired`或later read；strict no-write | §§24.3、29.2、31~32 |
| reference / handoff / collaboration typed outcome | matching external Port + contracts surface | 合法body-free external result，不是error | `NoRecoveryRequired`或owner-declaredlater operation | §§24.4、35~38、42.3~42.4 |
| Inbound receipt / Job target / report failure surface | contracts protocol surface | 经逐协议证明可安全持久化的replayable outcome | exact receipt / journal / report replay；new attempt由Step 13定义 | §§34~35、41~43 |

## 47. 全局内部错误到协议 / Entry 映射表

### 47.1 Channel mapping matrix

| internal / source family | Command API | Query API | Inbound Event | Outbound continuation | Operations Job | caller action |
|---|---|---|---|---|---|---|
| route / operation / schema / typed envelope invalid | existing rejection before reserve | `ApiError::Source`;无Command envelope复用 | `Rejected / UnsupportedSchema`或typed quarantine，按card | worker technical source；不制造capture outcome | existing Job rejection before initial UoW | 修正route/schema/envelope；zero business write |
| contract / domain deterministic rejection | pre-reserve或stored post-reserve `CapabilityProtocolRejection` | technical input error；normal missing不得使用 | typed receipt disposition，按6张card选择 | Phase A前rollback；不形成candidate | entry rejection或safe failed target，按8张card | 修正input / official owner state后new attempt |
| Query `NotVisible` / normal missing / declared degradation | n/a | successful `CapabilityQuerySurface` | n/a | n/a | planning只在Job card声明时转normal target outcome | 无automatic recovery；strict no-write |
| idempotency completed same digest | stored command result / rejection exact replay | n/a | stored typed receipt exact replay | capture continuation按exact state | stored variant-bound Job report exact replay | `ExactReplayOnly` |
| idempotency conflict / in-progress | existing rejection或technical in-progress | n/a | receipt/card-declared conflict / delayed branch | n/a | rejection或reserved journal reentry | same key exact read；不得运行body |
| optimistic / uniqueness conflict | rollback；读取winner或reload exact version | technical error；no write | rollback receipt UoW；按card决定new attempt | local bind conflict不回滚committed source / external intent | only safe rollback proof后可terminalize target；否则Planned | `ExactReadThenDecide`或`ReloadAndRetry` |
| Port temporary / timeout beforetyped return | technical dependency error | technical dependency error | typed delayed only ifcard branch proves zero accepted effect；否则technical error | source already committed时保持capture；later exact continuation | safe zero-effect target may be`RetryablePrerequisite`;否则Planned | Step 13/14约束下`RetryDependency` |
| Port permanent / not-configured / invalid / unexpected | technical error；configuration / adapter repair | technical error | stable typed receipt only wherecard explicitly declares；invalid return始终technical | typed handoff/collaboration status若合法则不是error；raw invalid remains technical | stable failed target only undersafe terminalization；invalid/unexpected remainsPlanned | `OwnerOrOperatorRepair` |
| transaction begin / confirmed commit failure | current UoW zero visible | n/a | current UoW zero visible | Phase A/C local UoW zero；prior source/intent不回滚 | only current initial/target/final UoW zero；prior targets保留 | confirmed not durable后new attempt |
| rollback failure / commit unknown | technical error；不存rejection / accepted result | n/a | technical error；不猜receipt | preserve exact prior durable source/capture/intent state | target staysPlanned；final remainsunfinalized | exact durable read + operator path |
| loaded / returned consistency defect | technical error；whole current UoW rollback | technical error；不返回half body | technical error；不quarantine Port defect | stop current phase；不伪造typed outcome | target staysPlanned；不固化report item | `OwnerOrOperatorRepair`;no reconstruction |
| codec failure | technical error；no partial stored surface | technical error；no partial body | technical error；no decoded partial receipt | no candidate / bind from partial bytes | target/final staysnonterminal | implementation / data repair |

Transport binding may later choose concrete HTTP / RPC / process-exit representation, but it must preserve this semantic matrix. Batch `12.7` does not define HTTP status numbers、RPC numeric codes、broker ack parameters orJob runner retry counters。

### 47.2 Public-safe issue and payload rule

1. Public / persisted issue identity only uses the51 closed `CapabilityIssueCode` variants andtheir unique `capability-hub.issue/<name>.v1` literals。
2. `ApplicationError::issue_code()`、protocol rejection mapper、Query degraded mapper、reference / handoff / collaboration mapper must remain exhaustive andbody-free。
3. issue refs may not containfield name、subject id、Port、cursor、version、run id、timestamp、raw body、raw error text、adapter code orhash of any prohibited material。
4. Query normal absence / `NotVisible` forms noissue。Typed external success forms noissue unless its declaredtyped outcome itself carries oneclosed status issue。
5. A stored rejection / receipt / Job report may persist its existing public-safe issue refs；that doesnot authorize acceptedtruth、success change、trace or event capture。

### 47.3 Consistency defect catalog

| subject + invariant | detection point | required response | forbidden downgrade / reconstruction |
|---|---|---|---|
| `DomainObject + PersistedOwnerRelation / PersistedVersionSymmetry` | repository exact read / application join | `ConsistencyDefect`;stop current flow | normal missing、stale surface、fallback owner |
| `DomainObject + PersistedVariantShape` | typed union decode / requested-family match | `ConsistencyDefect`;no partial item | debug-string dispatch、row drop |
| `CrossStoreRelation + CurrentIndexShape` | current owner / current state / highest revision index read | `ConsistencyDefect`;operator repair | choose arbitrary winner、full scan as success |
| `CrossStoreRelation + AppendOnlyHistoryShape` | append/history contiguous validation | `ConsistencyDefect`;do not append successor | patch gap、overwrite immutable history |
| `CrossStoreRelation + RequiredSidecar` | source/change/trace/result/snapshot/capture/report pair load | `ConsistencyDefect`;do not rerun original effect | synthesize sidecar fromcurrent truth |
| `CrossStoreRelation + DependencyIndexShape` | affected-material / reference dependency scan | rollback current UoW andsurface defect | silent skip、material full-body scan |
| `TechnicalObject + IdempotencyStateShape / StoredResultShape` | normalized-key replay load | `ConsistencyDefect`;no replay body | rerun mutation、generic bytes decoder |
| `TechnicalObject + EventCaptureShape` | snapshot / capture load、candidate continuation | `ConsistencyDefect`;no candidate / second capture | remap current source、create replacement snapshot |
| `TechnicalObject + JobExecutionShape` | normalized-key journal load / final assembly | `ConsistencyDefect`;target remainsPlanned orrun unfinalized | scope replan、report-by-run、infer terminal outcome |
| `PortReturn + ReadVisibilityShape / ReferenceObservationShape / HandoffOutcomeShape / CollaborationOutcomeShape` | successful-looking typed Port return validation | `ConsistencyDefect`;do not map todegraded / quarantine / typed status | treat asnormal external failure、parse raw detail |
| any owner + `RepositoryAccessShape` | page / cursor / scope / stable ordering validation | `ConsistencyDefect` or `InvalidInput` according tosource ownership | acceptprefix page、cross-scope cursor |
| any flow + `UnitOfWorkIdentity` | repository save/UoW adapter boundary | `ConsistencyDefect` / technical invariant；rollback | acceptforeign/nested handle |

The catalog is closed bythe existing four `ApplicationConsistencySubjectKind` variants and20 `ApplicationInvariantKind` variants。It introduces nonew enum variant。A defect thatdoesnot fit oneofthese typed pairs isadesign gap andmust reopenStep 6~11；the implementation may not add`Other(String)`。

## 48. 全局异常分支处理表

| 场景 | 检测位置 | exact处理方式 | local durable write | audit / event rule |
|---|---|---|---|---|
| forbidden body / secret / approval / method body / runtime payload enters contract | safe-text / DTO constructor before persistence | discard prohibited material；map closed body category；reject | pre-reserve none；post-reserve onlystored body-free rejection whereflow declares | noaccepted change/trace/capture/event；Step 15 may recordredacted category only |
| invalid domain transition、no-op or terminal reopen | domain method before mutation | exact `DomainError`;zero mutation | onlyexisting stored rejection surface whenpost-reserve | nofake same-state record / success audit/event |
| required flow prerequisite normally absent | application load gate | `MissingPrerequisite` orprotocol-specific normal target failure；neverfabricate owner | current UoW zero；Job safe failure maywritejournal-only terminal row | noaccepted event；Step 15 typed category only |
| Query subject hidden / missing / degraded | resolver-first + exact repository read | returnexisting typed surface | zero write | no business audit/event/capture；read observability deferredStep 15 |
| duplicate Completed request / event / Job | normalized-key reservation read | exact stored result / receipt / report replay | zero new write | no second change/trace/capture/event；replay telemetry deferredStep 15 |
| same key conflicting request | idempotency reserve/read | `IdempotencyConflict`;do not exposewinner body | original record unchanged；optional stored rejection only ifprotocol declares | noaccepted effect/event |
| same key Reserved | normalized-key reservation / Job journal read | active transaction-visible matching owner -> `IdempotencyInProgress`; exact Job identity + symmetric Planned journal -> resume durable state; committed Command/Inbound orphan or missing/asymmetric Job journal -> `ConsistencyDefect` | onlyphase-declared continuation writes | noduplicate accepted event |
| optimistic orunique conflict | repository save / commit gate | rollback loser；reload exact owner/winner beforenew attempt | loser zero；winner unchanged | no loser success event；redacted conflict visibility deferredStep 15 |
| Port temporary/timeout beforetyped result | concrete adapter explicit match | `PortFailure`;retry only underStep 13/14 | pre-commit rollback；post-commit source/capture remains | nofake external outcome；Step 15 redacted dependency telemetry |
| Port returns valid resolver / handoff / collaboration failure outcome | application typed mapper | preservetyped outcome；not exception | flow-declared ref/state/receipt/item only | issue derivedfromclosed status；no raw detail |
| Port return shape asymmetric | application boundary validation | `ConsistencyDefect(PortReturn, exact invariant)` | current UoW rollback / no bind | noquarantine、degraded、failed item or fabricated event |
| repository / codec failure pre-commit | repository / codec boundary | exact application error；rollback entire declared UoW | zero current UoW ifrollback succeeds | noaccepted result / change / trace / event |
| rollback fails | UoW manager | top-level `TransactionRollbackFailed`;preserve original only inprivate source chain | durability notclaimed | Step 15 redacted critical visibility；no business record |
| commit explicitly not durable | UoW manager | `TransactionCommitFailed` | zero current UoW | no success event/result；retry afterlater policy |
| commit outcome unknown | UoW manager | `CommitOutcomeUnknown`;exact-read reservation/result/journal/capture | unknown untilauthority read | Step 15 redacted critical visibility；neveremit claimed success/failure audit |
| persisted owner/version/union/index/sidecar defect | repository read / cross-store join | exact `ConsistencyDefect`;stop andoperator repair | norepair write in affected flow | Step 15 redacted critical visibility；nobusiness event |
| Outbound source commit succeeds, external phase fails | Phase B/C continuation | preservecommitted source + snapshot/capture；resume fromcapture/intent | no source rollback；onlylegal bind later | typed status/issue only；no local delivery lifecycle |
| Job target normal failure | per-target gate | terminalize onlyif4-part safe proof passes | journal-only Failed / Skipped target | report carriesclosed issue + typed impact；no fabricated effect |
| Job control-plane failure | journal/capture/result/codec/UoW/final assembler | exacttechnical error；target remainsPlanned / run unfinalized | nofailure report write fromdefect | Step 15 redacted visibility；no persisted fake issue/outcome |

## 49. Rollback、Commit与副作用裁决表

| failure point | rollback scope | visible state after handling | next permitted action | forbidden claim |
|---|---|---|---|---|
| beforeUoW begin | none | noreservation / write | corrected orpolicy-governed newattempt | result exists |
| staged write beforecommit | entirecurrent local UoW | prior committed rows only | aftersuccessful rollback,followerror-specific action | partial local atomic set committed |
| Command / Consumer accepted-set member fails | source + required record/trace/material/capture/result/completion allrollback | pre-attempt committed state | reload exact owner/token orrepair dependency | commit source thenlater patch sidecar |
| Outbound Phase A fails | source + snapshot + capture rollback together | none ofcurrent Phase A | newattempt aftercause handled | collaborate withoutofficial capture |
| Outbound Phase B raw failure | no local rollback ofalreadycommitted Phase A | source + Captured visible | retry exact stored candidate oroperator repair | delete source/capture orremap current truth |
| Outbound Phase C bind fails | current bind UoW rollback only | Captured mayremain；external intent mayexist | same stable candidate / intent semantics thenexact bind | create secondcapture/intent orcopyexternal status |
| Job initial UoW fails | reservation + complete plan rollback together | neither visible | exact key read thennew initial attempt ifabsent | execute target withoutcommitted journal |
| Job target UoW fails | currenttarget effect + capture + journal terminal update rollback together | earlier targets unchanged；current target Planned | exact journal reload；safe journal-only failure orretry/newrun perpolicy | roll back earlier targets orinfercurrent success |
| Job final UoW fails | final report/result/completion/current journal finalization rollback together | allterminal targets remain；run unfinalized | pure journal assembly retry | rebuild report fromcurrent truth |
| rollback failure | unknown local transaction state | no zero-effect assertion | operator / adapter recovery + exactreads | save rejection/failure asifrollback succeeded |
| confirmed commit failure | current UoW notdurable | pre-attempt committed state | policy-governed newattempt | accepted result / event wascommitted |
| commit outcome unknown | unknown untildurable read | readbyexact authority only | classifyCompleted / Reserved / absent / defect thenact | blind retry、overwrite winner、declarezero effect |

Rollback neverreverses external resolver reads、handoff calls、collaboration intent formation orprior committed Job targets。It also neverchanges governance / method / secret / runtime / SDK / marketplace owner truth。

## 50. 恢复口径与Durable Authority表

| interrupted / failed workflow | only recovery authority | recovery class | allowed operation | forbidden reconstruction |
|---|---|---|---|---|
| Command / Consumer Completed duplicate | Completed idempotency record + matching immutable stored surface / typed receipt | `ExactReplayOnly` | exact typed get andreturn | rerunbody、read current truth |
| Command / Consumer Reserved / unknown completion | normalized idempotency record + exact stored result refs + current committed owners | `ExactReadThenDecide` | distinguishCompleted / Reserved / absent / defect | time-based guess、overwrite reservation |
| optimistic loser | matching current owner / winner + fresh`Loaded.expected_version` | `ReloadAndRetry` | create newattempt afterconfirmed rollback | stale token reuse、last-write-wins |
| unique-key loser | formal current-owner / key winner | `ExactReadThenDecide` | protocol duplicate / rejection / distinct newobject path | arbitrary winner、delete existing |
| temporary external dependency failure | same typed Port input + exact local pre/post-commit state | `RetryDependency` | Step 13/14-defined newcall | raw message classification、local retry table |
| Captured outbound pre-intent | exact `CapabilityEventCaptureRecord::Captured` + immutable payload snapshot | `ResumeDurableState` | form same stored candidate andcollaborate | reload source / run mapper / secondcapture |
| external intent formed but bind absent | same stored candidate + external stable-intent semantics | `ResumeDurableState` | obtain same intent andbind viaexact local UoW | create secondintent orclaimexternal rollback |
| IntentBound outbound | exact capture intent + external Port `get(intent)` | `ResumeDurableState` | inspecttyped status | callcollaborate again、persistlocal delivery state |
| post-commit audit handoff failure | exact current trace revision + explicit newoperation / key | `ExactReadThenDecide` | later body-free handoff | rewriteold Accepted result、claim evidence |
| Job Reserved execution | normalized-key `CapabilityJobExecutionRecord` | `ResumeDurableState` | process onlyPlanned ordinals；assemble onlyall-terminal journal | scope rescan、target replan、run lookup |
| Job Completed duplicate | Completed reservation + variant-bound stored Job report | `ExactReplayOnly` | exact typed report get | generic decoder、current-truth report rebuild |
| Job external target withuncertain local commit | frozen target candidate/ref + exact journal ordinal | `ResumeDurableState` | use same stable intent/ref semantics andtarget UoW | mark success fromrequest-local value |
| consistency defect / missing sidecar | exact inconsistent rows / refs plusoperator-approved repair procedure outsideaffected flow | `OwnerOrOperatorRepair` | stop currentflow；repair throughdeclared owner andthennewattempt | application inline backfill、row drop、current-truth synthesis |
| permanent / notconfigured / unexpected dependency failure | deployment/config/adapter owner + redacted typed category | `OwnerOrOperatorRepair` | repairbinding / implementation thennewattempt | text parsing、change public code |
| valid Query / reference / handoff / collaboration typed outcome | existingtyped response/receipt/item/report | `NoRecoveryRequired` | caller consumes exactsurface orstartsseparate declared operation | promote totechnical failure、writecore truth |

### 50.1 Retryability summary

| class | same input immediate retry | exact precondition | Step 13 / 14 responsibility |
|---|---|---|---|
| deterministic validation / policy / illegal transition | no | input、operation orofficial state changes | duplicate/new-key guards only；no automatic loop |
| idempotency in progress / commit unknown | no fresh body | exact normalized-key read | polling / contention timing andbounded strategy |
| optimistic conflict | no stale-token retry | rollback success + exact owner reload | contention policy / attempt boundary |
| temporary / timeout Port failure | possible,not guaranteed | same typed input + known local effect boundary | retry count/backoff/jitter andconfig binding |
| permanent / invalid / unexpected Port failure | no | deployment/adapter/operator repair | binding validation；no retry loop |
| consistency / codec / rollback failure | no | explicitrepair + exact revalidation | concurrency protection mustnot hide defect |
| stored duplicate / terminal journal | no execution | exact immutable replay / skip terminal ordinal | reentry guard andduplicate result selection |

This table deliberately doesnot defineattempt count、backoff、jitter、lease、scheduler policy、timeout value orconfiguration key。Those belong toStep 13 / 14 andmay not change theerror semantics above。

## 51. Business Record、Issue、Operational Visibility与Event写入规则

Step 12只固定“能否写、写哪类既有business surface、哪些异常必须交给Step 15做redacted operational visibility”。它不定义log level、metric name、span field、alert threshold、audit backend或evidence alias。

| branch | allowed durable business write | forbidden business write | Step 15 visibility handoff |
|---|---|---|---|
| pre-reserve route / schema / envelope / forbidden-body rejection | none | reservation、stored result、truth、change、trace、capture、event、receipt、report | closed entry category；raw request/body禁止 |
| post-reserve deterministic Command rejection | matching body-free stored rejection + idempotency completion only | accepted truth、success change/trace、event snapshot/capture、accepted result | protocol、closed issue code、replay/newattempt distinction；no ids beyondStep 15 approved refs |
| accepted Command | exact Step 9 / 11 declared truth + required record/trace/material/capture/result/completion atomic set | undeclared audit/cost/runtime/marketplace/governance record | success telemetry由Step 15定义；Step 12不声称已记录 |
| Query normal / hidden / degraded / technical failure | none；Query strictly no-write | repair、refresh、reservation、read audit truth、capture、event | visibility/degradation/technical category only ifStep 15 selects；no body/subject leakage |
| Inbound accepted / ignored / delayed / rejected / quarantined | onlycard-declared typed receipt、reference state、impact/material marker、idempotency completion andeffect refs | direct identity/registry/descriptor/seam/relation/exposure truth outside declared flow；worker dead-letter state | disposition + closed issue + redacted entry category；payload body禁止 |
| Outbound Phase A success | source operation atomic set + immutable event snapshot + versioned capture | local delivery attempt/status/dead-letter/outbox lifecycle | capture/continuation point；payload bytes/raw external error禁止 |
| valid handoff / collaboration typed outcome | exact existing body-free ref/item andstable-intent bind whereflow declares | copied external delivery status、evidence、external owner history | typed outcome code only；no raw provider/broker response |
| raw external failure afterlocal commit | preserveexisting source/snapshot/capture；later exact continuation maywritelegal bind | rollback/delete committed truth、fabricate typed status | dependency class + phase + redacted capture ref subject toStep 15 |
| Job safe target failure / skip | journal-only terminal outcome；final report / stored result afterall targets terminal | fabricated material/report/reference/capture effect、raw error item | closed target issue + impact；no raw error/subject/run text inissue ref |
| Job technical/control-plane failure | no terminal failure item；target remainsPlanned orrun unfinalized | stored report claiming failure/success、journal terminalization withoutproof | exact error class + phase + redacted refs subject toStep 15 |
| consistency defect / rollback failure / commit unknown | no business recovery record inaffected flow | synthetic sidecar、fake success/failure audit、acceptance evidence | mandatory redacted operational visibility seed；operator action required |

Additional gates:

1. A `CapabilityProtocolValidationIssueRef` ispublic-safe issue identity,not an audit record、log id、trace id、run id orevidence alias。
2. A stored rejection、receipt orJob report proves only thatthe declared protocol surface waspersisted；it doesnot prove external delivery、governance approval、method asset validity、runtime execution oracceptance sign-off。
3. Redacted operational telemetry may retain aclosed category andStep 15-approved opaque correlation refs。It may not retainraw external body、secret、method / governance body、adapter exception text、serialized event bytes、external response body orprohibited hash input。
4. Error paths nevercreate`CostRecord`、runtime/tool invocation audit、marketplace listing event、governance decision record ormethod-library body audit because thoseowners areoutside this repository。
5. No real log、metric、span、audit entry、run id、test result orevidence isclaimed toexist inthis design artifact。

## 52. Historical Material与Owner Boundary审计

### 52.1 旧正式`03-详细设计.md`与README冲突

| historical material | conflict withcurrent baseline | Step 12 disposition | forbidden error / recovery artifact |
|---|---|---|---|
| `ProviderContract`、quota、route、failover、provider client | mergesadapter descriptor withprovider runtime | `historical_material`;do notmap orrecover | provider contract error、route failover retry、invocation recovery state |
| `CapabilityDecision`、allow/deny、policy refresh、shared_rules cache | mergesgovernance approval andruntime enforcement intohub | `historical_material`;only body-free seam / exposure remain | local policy decision error、approval retry、decision cache repair |
| `CostRecord`、billing、finance/audit append | importsruntime usage andprovider billing truth | `historical_material` | cost write failure、billing replay、finance evidence alias |
| KMS / Vault envelope andprovider API key | importssecret platform andsecret body | `historical_material`;only`SecretRef` + safe summary remain | secret-body error payload、KMS-specific retry code、envelope recovery store |
| `QueryCapabilities` runtime/tools gateway | conflatesformal exposure/read view withactual execution authorization | `historical_material` | runtime deny/error、tool execution retry、provider invocation fallback |
| marketplace metadata/listing/ranking/transaction | conflatesread-only discovery withmarketplace truth | `historical_material` | listing error、publication retry、transaction compensation |
| old outbox / publisher / relay / attempt / dead-letter | presumeslocal delivery lifecycle absent fromcurrentobjects/Ports/flows | `historical_material`;current owner is snapshot + capture + external stable intent only | local retry table、attempt counter、dead-letter state/error taxonomy |
| current-truth result/event/report reconstruction | violatesimmutable stored replay andcapture/journal authority | rejected | scan-and-rebuild recovery、generic decoder、report-by-run lookup |

These conflicts are notupstream blockers because current formal`00 / 01 / 02` andStep 4~11 provide acomplete replacement baseline。README andthe oldformal`03` remainunchanged inthis Step；their later cleanup isaseparate controlled documentation action。

### 52.2 专项边界闭合

|重点边界|本仓error / recovery owner|external owner preserved|禁止合并|
|---|---|---|---|
| capability identity | identity/domain errors、identity repository conflict / consistency andstored Command result | external source semantics | provider runtime identity、execution principal |
| capability registry | registry lifecycle/domain errors、repository current/unique/CAS andderived-impact atomicity | marketplace/runtime consume only | allowlist/listing/routing state |
| adapter descriptor | descriptor/risk/safe-summary domain errors + body-free resolver failure | secret/provider runtime owner | provider contract、secret body、invocation adapter state |
| governance approval seam | local seam relation / ref / exposure prerequisite errors | L1-governance approval / Policy truth | approval error、vote/workflow retry、local Policy cache |
| method-library asset relation | local body-free relation / ref errors | L3-method-library asset body / lifecycle truth | asset parser/body error、publication retry |
| SDK exposure boundary | formal server exposure / visibility / controlled-view errors | L0-sdk package/client/binding truth | SDK build/publish/cache error |
| MCP / A2A / API integration | typed source/reference/descriptor registration andresolution boundary | actual protocol execution/provider operation | runtime invocation、tools execution、provider failover |
| external collaboration | immutable snapshot/capture + stable intent binding errors | external delivery status / retry lifecycle | local outbox、attempt、dead-letter、delivery result owner |

### 52.3 Anti-patterns

The following implementations violateStep 12 even ifthey return anerror:

1. `Other(String)`、`Internal(String)`、adapter-private code ormessage substring classification；
2. derivingpublic issue literal from`Debug` / variant name / raw error hash；
3. mappingnormal Query absence、`NotVisible` orpersisted declared degradation totechnical error；
4. mappingloaded asymmetry to`None`、row drop、degraded surface、quarantine orJob failed target；
5. treatingvalidtyped external `Failed / HandoffUnavailable` asan exception androlling backlocal truth；
6. retrying`CommitOutcomeUnknown` beforeexact durable read；
7. reportingrollback success withoutconfirmed rollback；
8. reconstructingmissing result/snapshot/capture/journal/report fromcurrent truth；
9. persistingraw body、secret、adapter error text ortransport detail inissue、receipt、report、record ortelemetry；
10. introducinglocal delivery / scheduler / retry lifecycle tostore anerror；
11. allowingapi / worker / jobs wrapper toownbusiness classification orchange retryability；
12. writingaccepted audit/event/effect forrejected orrolled-back operation；
13. usingQuery/read-only `RedactedBoundary` mapper onCommand / Inbound / Job write-rejection paths；
14. terminalizingaJob target whenexact identity、closed issue、typed impact andzero-effect proof arenot allavailable；
15. creating fake-only success/error semantics weaker than durable adapter behavior。

## 53. Step 6~11 Cross-step Closure Audit

### 53.1 Main closure matrix

| upstream Step | closure question | Step 12 evidence | result |
|---|---|---|---|
| Step 6 objects | all fallible constructors / methods map toclosed owner andall load-time defects avoiddomain misclassification? | §§11~13 cover42 / 42 fallible domain sections；§§15~16 cover7 technical helpers；§47.3 separatesloaded defects | pass |
| Step 7 traits / Ports | everyfallible Port / UoW owner hasone exactapplication surface andraw disposal? | §§15.3、18、25 cover32 `ApplicationPortKind` + UoW manager =33 / 33；36 total Ports unchanged | pass |
| Step 8 protocols | everyprotocol reusesexisting public carrier andclosed issue identity? | §§22~24 + §§30~31、35、37、42 cover250 public types and83 protocols withoutnew envelope | pass |
| Step 9 flows | everyflow has internal error、public/technical mapping、rollback andcaller action? | `26 + 33 + 6 + 10 + 8 = 83 / 83`;§§29~43 and§47.1 | pass |
| Step 10 state matrix | illegal、no-op、terminal andexternal-owner states map consistently? | domain precedence in§12.3；application technical/consistency precedence in§16.2；638 pairs after Step 13 two-state sync | pass |
| Step 11 persistence | transaction failure、crash window、missing sidecar anddurable recovery have exact error/action? | §§48~50 consumeStep 11 §§13~15 authority withoutnewstore | pass |
| formal`00 / 01 / 02` | error / recovery staysinsideidentity/registry/descriptor/seam/relation/exposure boundary? | §52.2专项boundary table | pass |

### 53.2 Cardinality and declaration closure

| baseline | final Step 12 result |
|---|---|
| HLD objects / application helpers | 43 + 7,unchanged |
| application-owned Ports | 36,unchanged |
| repository traits / methods | 22 / 110,unchanged |
| public types | 250；onlyStep 12 batch`12.3` controlled reopen addedone51-variant issue-code enum；no`12.7` delta |
| protocols / independent flows | 83 / 83；allmapped |
| local/external state boundaries | 22 local + 1 external；111 active variants / 638 pairs |
| stable error owners | `ContractValueError`10 + `DomainError`10 + `ApplicationError`17 |
| local wrappers | `InfraError`、`ApiError`、`WorkerError`、`JobError`,each2 variants |
| issue taxonomy | 51 closed variants + 51 unique fixed`.v1` literals |
| unresolved upstream blockers | none；`CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001`为非阻塞跨仓设计债务 |

No Rust declaration isadded inbatch`12.7`。Existing public struct / enum、struct field、enum variant、variant payload field andpublic callable comments remainrequired andwere notremoved。The user-requested “结构体需要注释” gate remainsfully active forlaterSteps；there isno structure comment omission introduced bythis batch。

### 53.3 SOP five-question final answer

| SOP question | final answer source | closure |
|---|---|---|
| 每个模块有哪些错误类型? | §§7、11~18、46 | three stable owners + four thin wrappers closed |
| 哪些错误映射到HTTP / RPC / Event失败? | §§24、29~43、47 | semantic mapping fixed；concrete transport numbers deferred |
| 哪些可重试 / 不可重试 / 人工介入? | §§16.3、45.3、50.1 | seven action classes andexact preconditions fixed |
| transaction / conflict / duplicate / external failure如何处理? | §§29、34~37、41、48~50 | rollback、replay、resume andexternal typed outcome separated |
| 哪些异常写审计、日志或事件? | §51 | business write allowlist andStep 15 redacted handoff fixed |

## 54. 正式`03-详细设计.md` §11 Assembly Source

Step 19 must assemble formal§11 fromthis section and§§7~53。It must notcopyoldformal`03` §12 error table orrestoreprovider/decision/cost/KMS/outbox semantics。The following structure ismandatory；the assembly mayimprove Chinese layout butmay notcompress awaythe exacttables。

### 54.1 Formal chapter structure

| formal section | mandatory content | exact source | may notomit |
|---|---|---|---|
| §11.1 Error ownership anddependency direction | three stable owners、fourthin wrappers、runtime-local source boundary、single outward mapping graph | §§7、17 | contracts/domain/application owner split；wrapper maynotreclassify |
| §11.2 Exact error types | `ContractValueError`、`DomainError`、application supporting enums、`ApplicationError`、four wrappers | §§11~18 | exact Rust declaration、all variant payloads andEnglish Rustdoc；no`Other(String)` |
| §11.3 Closed issue identity andraw-source disposal | 51 code/literal、deterministic ref/set、typed mappers、raw infra/entry mapping | §§22~26 | 51 / 51 literal table、private fields、no raw/hash/random input |
| §11.4 Error type table | stable owners、application families、wrappers、typed non-error surfaces | §46 | owner、trigger、retryability、public mapping andsource refs |
| §11.5 Protocol error mapping | shared precedence + all26 Command、33 Query、6 Inbound、10 Outbound、8 Job independent rows | §§29~43、47.1 | all83 namedrows；no “same as above” replacement ofprotocol-specific rules |
| §11.6 Exception branch handling | global order、consistency catalog、exception handling andbusiness/visibility write rules | §§45.2、47.3、48、51 | detection point、handling、durable write、audit/event boundary |
| §11.7 Rollback andcommit outcome | UoW rollback table、external side-effect boundary、commit failed/unknown separation | §49 | rollback failure preservesoriginal onlyprivate；unknown forbidsblind retry |
| §11.8 Recovery authority | action vocabulary、durable authority、retryability summary | §§45.3、50 | exact key/ref authority；no current-truth reconstruction |
| §11.9 Consistency andanti-pattern gate | defect catalog、historical boundary、15 anti-patterns | §§47.3、52 | no downgrade、inline repair、local lifecycle orraw leakage |

### 54.2 Formal chapter opening source

Step 19 mayadjust punctuation butmust preserve this meaning:

```text
Capability Hub uses three stable error owners: contracts owns value-construction failures, domain owns pure factory/policy/invariant/lifecycle refusals, and application owns orchestration, Port, persistence, conflict, transaction and consistency failures. Infra, API, worker and jobs expose only one-way local wrappers and may not establish parallel business taxonomies.

Public error identity is body-free and deterministic. Existing Command rejection, Query surface, Inbound receipt, Outbound handoff/collaboration outcome and Operations Job response/report are the only protocol surfaces. Query normal absence, NotVisible and declared degradation, together with valid external typed outcomes, are not application errors.

Recovery always starts from exact durable authority: normalized idempotency record and immutable stored result, event capture plus immutable snapshot and stable intent, or normalized-key Job journal and variant-bound stored report. Commit outcome unknown, rollback failure, consistency defect and missing mandatory sidecar never authorize blind retry or reconstruction from current truth.
```

### 54.3 Formal hard statements

The following statements must appearwith equivalent explicit wording:

1. `ContractValueError -> DomainError -> ApplicationError` isacontextual mapping direction,not amandatory detour；application maymap contract input directly anddomain neverdepends onapplication。
2. `ApplicationError` has17 closed variants andexcludes`NotFound`、`NotVisible`、raw`String`、transport status andadapter-private code。
3. Raw source classification usesexhaustive typed matching only；`Display / Debug / Error::source()` mustnot affectpublic code、retryability、persisted reason orissue identity。
4. All public / persisted issue refs derivefromoneof51 closed codes；literal generation、random id、raw hash andfree-form issue areforbidden。
5. Query normal absence / empty page / `NotVisible` / declared degradation aretyped success andstrict no-write；loaded inconsistency istechnical error andreturnsnohalf body。
6. Valid resolver、handoff andcollaboration outcomes remainexternal typed outcomes；raw failure beforetyped return isapplication error anddoesnot inventanoutcome。
7. Pre-commit failure rolls backtheentire declared local atomic set；external calls andprior committed Job targets arenotrolled back。
8. Rollback failure、commit outcome unknown、codec failure、consistency defect andmissing journal/result/capture sidecar maynot become storedbusiness rejection、receipt item orJob failed target。
9. Duplicate replay readsimmutable stored result / receipt / variant-bound report only；no business body、Clock、id generation、resolver、scope scan orexternal call runsagain。
10. Job failed/skipped terminalization requires exact target identity、closed issue、typed impact andzero effect / confirmed rollback；otherwise thetarget remains`Planned`。
11. Recovery usesexact durable key/ref only；current-truth reconstruction、report-by-run、generic bytes decoder、full scan andtime-window guessing areforbidden。
12. Step 13 / 14 maydefineattempt/backoff/config binding butmaynot alterstable retryability、owner boundary orpublic mapping fixedhere。

### 54.4 Assembly checks

| assembly check | required result |
|---|---|
| exact error declarations | all10 + 10 + 17 variants andsupporting enums searchable；everyenum/variant/payload/callable Rustdoc retained |
| issue identity | 51 variants + 51 unique literals + deterministic ref/set andalltyped mapper tables present |
| protocol coverage | 26 + 33 + 6 + 10 + 8 =83 named mapping rows；unmapped=0 |
| exception table | validation、domain、query surface、duplicate、conflict、Port、transaction、commit unknown、consistency、Outbound andJob branches present |
| recovery table | stored result/receipt/report、capture/snapshot/intent、journal、winner/version andoperator repair authorities present |
| owner boundary | no runtime/tools execution、marketplace listing、governance approval、method body、secret body、SDK client orlocal delivery owner |
| process-text exclusion | batch status、user confirmation、blocker history andcalibration process do notenterformal body |
| truthfulness | no implementation commit、run id、test result、evidence alias oracceptance signature claimed |
| source annotation | formal§11 identifies thisfile ascalibration source andpoints toexact sections whenfull matrix remainsin calibration artifact |

Formal§11 mayuse concise prose aroundtables, butit mustnot reduce exact Rust types or83 protocol rows toafamily-only summary。If document size requires keepingfull protocol matrices inthis calibration artifact, formal§11 mustincludecomplete named coverage/index andanormative source pointer thatleaves noimplementation choice；it maynot say“others similar”。

## 55. Step 13 / 14 / 15 / 16 / 19 Handoff

### 55.1 Step 13 exact input

| Step 13 topic | fixed Step 12 input | Step 13 mustdefine | maynotchange |
|---|---|---|---|
| normalized idempotency key / digest | same-digest Completed exact replay、different digest conflict、Reserved in-progress | key calculation table、collision/concurrent reserve handling、reentry guard | result reconstruction prohibition、public mapping |
| optimistic conflict | rollback-success + exact owner reload beforenewattempt | concurrent attempt boundary、bounded retry ownership | stale token reuse prohibition、error class |
| unique winner | exact formal winner read andprotocol-specific duplicate/rejection | simultaneous create/update guard | arbitrary overwrite / delete winner |
| commit unknown | exact reservation/result/journal/capture read first | state decision algorithm forCompleted / Reserved / absent / defect | blind retry andsuccess/failure guessing |
| Command / Consumer replay | immutable stored surface / typed receipt | repeated request/event handling andrace tests | rerunbody / current-truth rebuild |
| Outbound reentry | Captured snapshotcandidate、stable intent、IntentBound exact get | duplicate continuation andconcurrent binder protection | local delivery lifecycle、secondcapture/intent |
| Job reentry | normalized-key complete plan、Planned-only processing、terminal skip、journal-only final assembly | concurrent target/final runner guard、newrun/key rules | scope replan、report-by-run、terminal overwrite |
| temporary Port failure | retryable onlyfor`TemporarilyUnavailable / Timeout` andknown effect boundary | attempt/backoff/jitter ownership ifapplicable | raw-text classification、retrying permanent/unknown classes |
| partial Job outcome | safe terminalization andimpact->final disposition alreadyfixed | concurrent partial completion / finalization protection | control-plane defect asreport item |

Step 13 maydiscover thatone existingkey/fence/reentry callable isinsufficient。If so,it mustrecordablocker andreopenStep 6~12 throughcontrolled path；it maynotaddprivate checkpoint、lease、attempt store orhiddenfinder insideits prose。

### 55.2 Later Step handoff

| later Step | required input fromStep 12 | required closure |
|---|---|---|
| Step 14 configuration / external binding | six safe Port failure classes、runtime assembly boundary、no transport-number commitment | concrete dependency binding、typed source classifier、timeouts/config refs；no semantic remap |
| Step 15 observability / audit | §51 branch allowlist andmandatory redacted categories | exact log/metric/span/audit cut、approved fields/redaction；no raw body/evidence claim |
| Step 16 tests | all error precedence、83 mappings、rollback/unknown/replay/consistency andwrapper parity | executable test cuts andfixture rules；no test result claim inStep 12 |
| Step 19 formal assembly | §54 structure / opening / hard statements / checks | assemble formal§11 fromactive baseline；do notcopyoldformal content |

## 56. Batch `12.7`与Step 12 Completion Gate

### 56.1 SOP completion checklist

| gate | result | evidence |
|---|---|---|
| error type table complete | pass | §46 coversstable owners、application families、wrappers andtyped non-error surfaces |
| error mapping table complete | pass | §§24、29~43、47 coverall83 protocol / flow mappings andentry wrappers |
| exception branch table complete | pass | §§45.2、47.3、48、51 coverdetection、handling、durable write andaudit/event boundary |
| recovery table complete | pass | §§45.3、49~50 coverrollback、commit、retryability andonly durable authority |
| retry / nonretry / manual distinction | pass | §50.1 hasexact preconditions anddeferred policy boundary |
| module / protocol / flow traceability | pass | §53.1 andallmapping rows point toStep 6~11 owners |
| consistency defect closure | pass | §47.3 usesexisting four subject +20 invariant variants；no downgrade orinline repair |
| business / operational visibility boundary | pass | §51 separates existingbusiness surfaces fromStep 15 redacted telemetry |
| historical material isolation | pass | §52 excludesoldformal`03` andREADME provider/decision/cost/KMS/runtime/marketplace/outbox semantics |
| cross-step cardinality | pass | §53.2；43+7 objects/helpers、36 Ports、22/110 repositories/methods、250 protocol types、83 protocols/flows、111 active state variants / 638 pairs |
| formal§11 assembly source | pass | §54 definesmandatory structure、hard statements andassembly checks |
| Step 13 handoff | pass | §55.1 fixesconcurrency/idempotency/reentry inputs withoutcreatingStep 13 artifact |
| structure comments | pass | batch`12.7` addsnoRust declaration；existingstruct / field / enum / variant / payload / callable Rustdoc remainscomplete |
| dependency status | pass by Step 13/14.2 controlled sync | historical accessor diagnosis resolved project-locally；three-state commit resolution reuses the existing error surface；Step 12 remains complete |
| truthfulness / artifact discipline | pass | formal`03` notmodified；noStep 13、implementation ledger、boundary skeleton、code、commit、run、test result、evidence orsign-off created |

### 56.2 Completion state

```text
current_document = 03-详细设计.md
current_step = 12
current_batch = 12.7
gate_status = 03_step_12_completed_with_step_13_and_step_14_controlled_reopen_sync
next_allowed_action = follow_current_03_step_14_batch_gate
formal_03_modified = false
step_13_artifact_created = true
implementation_artifact_created = false
commit_required = false
unresolved_upstream_blocker = none
non_blocking_cross_repo_debt = CH-DEBT-L0-CORE-IDEMPOTENCY-DESIGN-SYNC-001,CH-DEBT-L0-CORE-SERDE-WIRE-SYNC-001
```

Step 12 error types、external mappings、exception branches andrecovery strategies remaincomplete aftertheStep 13 controlled sync。The current action follows the Step 14 batch gate；formal`03-详细设计.md` andimplementation artifacts remainunchanged。
