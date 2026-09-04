# 03-详细设计 Step 18：风险与待确认事项

> 项目：`L2-member-service`
> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 18
> 书写规范：`standards/document/详细设计书写规范.md` §5.17
> 参考粒度：`projects/L1-governance/design-calibration/03_ddd_step_18_risks_open_questions.md`
> 目标正式文档：`projects/L2-member-service/03-详细设计.md`
> 校准日期：2026-09-02

## 1. Step 状态、目标与边界

| 项目 | 记录 |
|---|---|
| 当前 Step | Step 18：风险与待确认事项 |
| 当前状态 | completed / pass_with_upstream_blockers |
| 输入 | Step 1~17 的全部未闭合项、正式 `00/01/02`、兄弟项目当前文档和全局依赖规则 |
| 输出 | 风险表、待确认事项表、未确认前处理规则和 Step 19 装配门禁 |
| 正式正文 | Step 19 才装配；本步不新增对象、字段、协议、状态或产品事实 |
| 处理原则 | 不确定项显式标记 `pending / blocked / waiting / placeholder / fail-closed`；不得以 fake、timeout、receipt、缓存或 sibling WIP 伪造 ready |

本步只记录会影响实现、集成、测试、验收或后续文档的开放问题。已经在 Step 1~17 闭合的字段、对象、状态、流程、幂等和安全边界不重复列为风险；若后续发现其断裂，必须回写对应 Step，而不是在实现侧临时补充。

## 2. 风险等级与处理语义

| 等级 | 含义 | 允许的当前动作 |
|---|---|---|
| `blocker` | 缺口会使对应代码、协议、真实联调或交付审计无法安全落地 | 只能保留 placeholder / fail-closed / fake seam；完成确认前暂停相应边界 |
| `high` | 不一定阻塞本地纯逻辑，但会阻塞跨仓、持久化、运行或验收闭环 | 可实现无依赖的纯 domain / contract cut；不得扩大 positive ceiling |
| `medium` | 影响可运维性、性能或后续优化，但不改变 Host Truth 语义 | 保留 typed seam 和 TODO；由 `04/05/06/07` 承接 |
| `low` | 文档或工具细节未收口，不影响当前设计边界 | 记录并在下游文档补齐，不改变协议或状态 |

`blocked` 表示当前边界不能正向推进，`waiting` 表示等待 owner 输入，`pending` 表示尚未得到正式合同或决策，`placeholder` 表示只允许安全占位，`fail-closed` 表示缺失时拒绝或延迟，不表示系统失败已被修复。

## 3. 风险表

| ID | 风险 / 未闭合问题 | 等级 | 影响范围 | 当前缓解与允许上限 | 待确认方 |
|---|---|---:|---|---|---|
| `MSVC-UP-001` | Runtime entry、Host Session association、execution handoff 的 exact mapper、route、outcome 和 feedback 未闭合 | blocker | `MaintainHostSessionCommandPlaceholder`、handoff、recover / restart、action feedback、真实 integration | 只保留 host-side association、typed witness、blocked / unknown、handoff layer；不得定义 Runtime run / turn / loop / outcome | `L2-runtime` owner、member-service 设计维护者 |
| `MSVC-UP-002` | `L2-member` launch / register / heartbeat / status request、signal、report、IPC 与凭据形态未闭合 | blocker | registration、endpoint、session、health、generation matching | 只消费 safe ref、fingerprint、signal summary 和 placeholder envelope；缺 exact mapper 时返回 blocked / waiting / delayed | `L2-member` owner |
| `MSVC-UP-003` | `L2-member-images` pinned supply、manifest、variant、digest、verification、provenance consumption contract 未闭合 | blocker | qualification、assembly、readiness、launch gating | 只保存 qualification ref / safe summary；required item 缺失或不可验证即 non-ready / blocked；不解析 Role -> image mapping | `L2-member-images` owner |
| `MSVC-UP-004` | `L4-sandbox` host-level bind / release / failure / cleanup、caller 和 safe outcome schema 未闭合 | blocker | assembly、association、cleanup、residual reconciliation | 只定义 binding / release / cleanup port、attempt、residual 和 unknown；不保存 backend/policy/capture body | `L4-sandbox` owner |
| `MSVC-UP-005` | policy 从上游传递到 host application 的 owner 和 typed path 未闭合 | high | qualification、readiness、recovery、config binding | 使用 policy-neutral typed ref；没有 formal mapped context 就 blocked；不在本仓复制 Governance approval truth | `L1-work` / governance owner / architecture owner |
| `MSVC-UP-006` | launch credential 的签发、撤销、绑定、轮换和 audit owner 未闭合 | blocker | registration、launch、restart、redaction、security review | 只允许 opaque、instance-bound、revocable、不可复用 safe ref；secret 不入 DTO、日志、material、history 或 config 示例 | Identity / Member owner |
| `MSVC-UP-007` | member-service event family、Core/Bus schema、envelope、route、receipt、delivery / observed / accepted feedback 未闭合 | blocker | Consumer、material event、outbox、handoff、projection、真实 broker | 只保留 body-free candidate、outbox snapshot、local receipt 和四层 handoff；unsupported version 不解析 body | `L0-core` / `L0-bus` / event owner |
| `MSVC-UP-008` | `L0-sdk` compile target、Server self-test、受限 dependency 形态未闭合 | high | contracts compile、adapter integration、CI gate | 只记录 compile seam / fake seam；不声明 SDK target、server test 或 compile evidence ready | `L0-sdk` owner、implementation owner |
| `MSVC-UP-009` | 非 `ProjectMemberRef` 执行主语的未来需求是否纳入未闭合 | medium | scope、authorization、future multi-tenant host | 当前版本仅 ProjectMember-scoped；非项目主语 fail-closed；如要纳入必须重开正式需求 / ADR | 需求 owner、架构 owner |
| `MSVC-CURSOR-001` | `HostChangeCursor` 与 `CommittedChangeCursor` 的 exact type、owner、序列化和跨仓兼容存在命名差异 | blocker | UoW、projection、material、outbox、history、rebuild、protocol | 不创建 alias、conversion 或第三种 cursor；正文使用“待上游闭合的 committed cursor”并保持 type hole | Core/Bus/SDK 与本仓 persistence owner |
| `MSVC-STORE-001` | durable store、transaction、expected-version、unique index、page / history cursor 产品未选 | blocker | infra persistence、rollback、replay、projection、integration | domain / application 只依赖 repository / UoW；使用 in-memory / fake 验证逻辑；不写 DDL、SQL 或部署产品 | 架构 / 配置 / 实施计划 owner |
| `MSVC-BROKER-001` | broker、DLQ、retry、consumer delivery、ack / receipt 产品和数字未选 | blocker | worker、outbox publisher、Consumer recovery、operations | 只定义 local disposition、unknown、gap、delayed、manual marker；不编造 retry 次数、offset 或 delivery result | Bus / worker / 运维 owner |
| `MSVC-DIAG-001` | safe diagnostic ref 的 durable store、访问权限和保留策略未选 | high | errors、rollback failure、unknown、reconciliation、验收追溯 | 只允许 body-free diagnostic ref / category；不持久化 stack、raw adapter error、external body | 运维 / infra / security owner |
| `MSVC-OBS-001` | observability backend、SLO、采样、保留、指标导出路径未选 | high | Step 15 logs / metrics / traces、运维验收 | 固定安全字段、低基数和 refs-only contract；不写 backend API 或 SLO 数字 | Observability owner |
| `MSVC-RED-001` | redaction checker 的完整扫描规则、fixture 和 veto 行为未闭合 | high | security gate、05/06/07 scripts | 保留 `check_redaction.sh` planned contract 与 forbidden class 清单；发现 raw body / secret 时 fail-closed | 测试 / security owner |
| `MSVC-MAPPER-001` | Identity / Work / Member / Runtime / Images / Sandbox 的 exact mapper 尚未提供 | blocker | 双锚、scope、qualification、registration、session、feedback、recovery | 仅以 typed ref / safe summary / mapped-or-blocked placeholder 进入 domain；禁止复制 sibling DTO | 各 sibling owner |
| `MSVC-POLICY-001` | policy、approval、authorization 的传递与审计责任边界未闭合 | high | intent、decision、recovery、job no-authorization | 本仓只消费 formal mapped context；不存 Governance approval truth，不让 Job 产生授权 | Governance / Work / architecture owner |
| `MSVC-IMPL-001` | 目标实现仓 `/home/aris/Projects/quantalithos-member-service` 当前未确认 | blocker | 所有源码、Cargo、CI、implementation ledger 和真实测试 | design 仓只写 planned layout；实现前确认仓路径、workspace 和项目级 git config | 实施计划维护者 / 用户 |
| `MSVC-DOWN-001` | `04-配置设计.md` 尚未生成 | blocker_for_downstream | key、默认值、secret、endpoint、profile、builder validation | Step 14 只保留 typed binding；不在 03 或代码中补完整 config truth | 配置设计维护者 |
| `MSVC-DOWN-002` | `05-测试方案.md`、`06-验收标准.md` 尚未按新版 03 复核 | blocker_for_delivery | test matrix、evidence、veto、release gate | Step 16 只提供最小 test cut；不引用旧 05/06 作为新门禁 | 测试 / 验收维护者 |
| `MSVC-DOWN-003` | `07-实施计划.md` 尚未生成，phase / commit boundary 未正式定义 | blocker_for_delivery | 实施顺序、台账、提交、交付前审计 | Step 17 只提供 handoff；不在 03 中预写 phase、commit 或排期 | 实施计划维护者 |
| `MSVC-HIST-001` | 旧正式 03、README、旧 05/06 含 worker、runtime session、direct execute、callback body、固定产品等污染 | high | 实现者阅读和下游复制风险 | Step 19 全量重建；旧材料只作 grep / diff 审计，禁止作为设计真相源 | 详细设计维护者 |
| `MSVC-COUNT-001` | 兄弟 / 历史材料存在 Command、Query、Event 数量漂移 | high | protocol inventory、test cut、后续 07 阅读清单 | 本仓唯一分母固定为 10 / 6 / 5 / 1 / 7；Step 19 统一并审计 | 详细设计维护者 |
| `MSVC-LEASE-001` | lease、lock、single-winner、cancellation 和 scheduler concurrency 产品未选 | high | dual dispatcher、publisher、projection、Job re-entry | 只保留 revision / key / fence / selector 语义；无产品时使用 fake parity，不写 TTL / worker count | 架构 / infra / jobs owner |
| `MSVC-HANDOFF-001` | `submitted`、`delivered`、`observed`、`accepted` 的 target feedback owner 未闭合 | blocker | handoff feedback、outbox、acceptance | 四层独立；只由 formal owner feedback 推进，缺反馈保持 unknown / gap / waiting | Bus / consumer / observability owner |
| `MSVC-HEALTH-001` | workload、capacity、health window、liveness / readiness authority 未闭合 | high | health evaluation、recovery、performance tests、config | 只使用结构性 guard、source order、freshness 和 safe assessment；不写阈值或 readiness 数字 | Member / Runtime / ops owner |
| `MSVC-REAL-001` | 真实相邻仓 adapter、fake parity、integration fixture 尚未验证 | high | integration tests、真实 launch / cleanup / feedback | 允许 fake / fixture / stub 只证明本地契约；真实结果必须标 pending，不能转 ready | 各 sibling owner / 实施者 |

## 4. 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| Runtime formal entry / association / handoff schema | 阻塞 session active、recover / restart 和 execution feedback positive path | `L2-runtime` owner | 仅保留 placeholder、blocked / unknown；不建 Runtime 对象或结果 |
| Member launch / register / heartbeat / status exact contract | 阻塞 registration accepted、endpoint active 和 health current | `L2-member` owner | 只使用 safe ref / fingerprint / summary；缺 mapper 返回 waiting / blocked |
| Images pinned supply consumption contract | 阻塞 readiness positive 和 launch gating | `L2-member-images` owner | required source/item 缺失即 fail-closed；不解析 manifest / digest body |
| Sandbox binding / cleanup contract | 阻塞 cleanup succeeded、residual resolution 与 external release 判断 | `L4-sandbox` owner | local attempt + unknown / residual；不声明 backend cleanup |
| policy / approval transfer owner | 阻塞 recovery / control positive context | Governance / Work / architecture owner | 只接受 formal mapped context；Job 不创建 authorization |
| credential owner and safe reference | 阻塞 launch / restart secret handling | Identity / Member owner | opaque、revocable、instance-bound ref；secret 不入仓 |
| Core / Bus event family、envelope、route、receipt | 阻塞 Consumer / outbox / handoff integration | Core / Bus owner | candidate + local receipt；unsupported version body-free |
| cursor exact type | 阻塞 persistence / projection compile contract | Core / Bus / SDK / persistence owner | 保留 type hole；不造 alias / conversion |
| durable store / broker / DLQ / diagnostic product | 阻塞真实 rollback、replay、delivery 和 recovery evidence | 架构 / infra / 运维 owner | repository / UoW / publisher / diagnostic port；fake-only local validation |
| observability backend / SLO / retention | 阻塞真实运维证据 | Observability owner | 安全字段和 low-cardinality contract；不写产品或数字 |
| redaction checker rules | 阻塞最终 security acceptance | 测试 / security owner | planned script + forbidden class；未闭合不得声称 gate pass |
| target implementation repo | 阻塞源码与 Cargo 写入 | 实施计划维护者 / 用户 | 只维护 design planned layout；确认前不创建实现文件 |
| `04-配置设计.md` | 阻塞具体 key / default / secret / endpoint | 配置设计维护者 | Step 14 typed binding；不得代码自定义完整 config |
| `05-测试方案.md` / `06-验收标准.md` | 阻塞完整测试、evidence 和 veto | 测试 / 验收维护者 | 仅使用 Step 16 test cut；不继承旧 05/06 |
| `07-实施计划.md` | 阻塞 phase / commit / implementation ledger | 实施计划维护者 | 不自行拆 phase、commit 或交付时间 |
| 非 ProjectMember 主语是否纳入 | 影响 scope / authorization 设计 | 需求 / 架构 owner | 当前版本 fail-closed；新增主语必须重开上游设计 |

## 5. 未确认前实现处理规则

| 场景 | 必须执行 | 禁止执行 |
|---|---|---|
| sibling exact contract 缺失 | 使用 typed ref、safe summary、placeholder、blocked / waiting / unknown；记录 owner 和回写入口 | 复制 sibling DTO、猜字段、写 raw body 或声明 positive ready |
| cursor exact type 缺失 | 保持 `HostChangeCursor` / `CommittedChangeCursor` 分离的语义和 type hole | 创建 alias、第三种 cursor、隐式转换或用 revision / offset 替代 |
| durable 产品未选 | 实现 repository / UoW / publisher / diagnostic port 和 fake parity | 在 domain / application 写 DB、broker、SQL、DDL、topic 或部署事实 |
| external call 返回 timeout / receipt / adapter `Ok` | 写 attempt / unknown / local submitted / gap，并保留原 key | 推导 succeeded、delivered、observed、accepted、ready 或 healthy |
| Query 发现 stale projection | 返回 stale / degraded / unavailable safe view | Query refresh、repair、rebuild、append history 或反写 source |
| Job 发现待处理 work | 只推进已经 committed 的 attempt / outbox / projection / reconciliation / handoff marker | 创建 intent、decision、authorization、generation 或新 effect key |
| stored result 缺失或类型错误 | 返回 consistency error / manual recovery marker | 从 current truth 重算、覆盖 reservation 或重新执行外部动作 |
| 目标实现仓未确认 | 继续设计仓校准和文档审计 | 在 design 仓创建源码、Cargo、测试结果或实现 commit |
| 下游 `04/05/06/07` 未同步 | 保持本 Step blocker，完成 Step 19 后停审 | 将旧配置、测试、验收、phase 或 commit 口径交给实现者 |

## 6. 已关闭、无需重复列入的风险

以下事项已由前序 Step 关闭，不再作为开放风险；若后续文档改变其语义，必须回写相应真相源：

| 已关闭主题 | 真相源 | 当前收口 |
|---|---|---|
| 执行主语 | 正式 `00/01/02`、Step 1~2 | 仅 `ProjectMemberRef`；`GlobalMemberRef` 为身份锚 |
| 七模块 owner | Step 4~5 | `contracts -> domain -> application -> infra -> api -> worker -> jobs` |
| 29 对象分母 | Step 6 | CMP-MS-01~07 固定；support value 不计入对象数 |
| Query no-write | Step 8~10、16 | 不 reserve、refresh、repair、rebuild、append 或反写 |
| Job no-authorization | Step 8~10、16 | 只推进已提交 work，不创建 intent / decision / generation |
| 状态正交性 | Step 10 | 不新增万能 Host status；四层 publication 不互推 |
| UoW / rollback / duplicate | Step 11~13 | truth、sidecar、result、idempotency completion 按规定写集提交；失败不留 accepted 半状态 |
| body-free / low-cardinality | Step 15~16 | raw body、secret、URL、stack、external payload 禁止进入 public / log / metric / audit |

## 7. Step 19 装配前门禁

| 门禁 | 状态 | 进入 Step 19 的要求 |
|---|---|---|
| 每个开放事项有 owner、影响和处理方式 | pass | 本文 §3~§5 |
| blocker 不被写成 positive contract | pass_with_upstream_blockers | Step 19 只能装配 pending / blocked / fail-closed 结论 |
| 没有新增业务对象、字段、协议或状态 | pass | 本步只登记风险 |
| 历史污染已列出 | pass | Step 19 必须重建正式 03 并做污染 grep |
| 10/6/5/1/7 分母已固定 | pass | Step 8 / 16 / Step 19 统一 |
| 下游 04/05/06/07 的未完成状态已显式记录 | pass | 不提前移交实现 |
| 可进入正式装配 | 通过（有条件） | 先执行 Step 19，保持所有开放项原状态 |

```text
step_18_status = completed
step_18_gate = pass_with_upstream_blockers
next_allowed_step = Step 19 formal_document_assembly
formal_03_write_allowed = false_until_step_19_assembly
```
