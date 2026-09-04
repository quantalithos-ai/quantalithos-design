# Step 6. 定义数据边界与架构红线验收 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 6
> 回填章节：`06-验收标准.md` §6 数据边界与架构红线验收

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 6 定义数据边界与架构红线验收 |
| 当前状态 | `[x] 已确认` |
| 输入基线 | Step 5；`00` BR-MS-001~050、D-MS-001~037；`01` owner / dependency；`03` §5、§9~§14；`04` §4、§7；`05` §3、§13 |
| 输出文件 | `design-calibration/06_acceptance_step_06_data_arch_redlines.md` |
| 当前模块 | `truth_ownership`、`forbidden_data`、`redline_gates` |
| 思考记录 | `done` |
| 写入记录 | `done` |
| 自检状态 | `done` |
| gate_status | `pass` |
| gate_reason | 数据归属、禁止保存项、第二写源、P1/P2 污染和 required seam 红线均有可检查条件及证据入口；carrier 仅按 availability marker 处理 |
| next_allowed_action | 进入 Step 7，定义接口、事件与跨仓同步验收 |

### 1.1 Step 内计划

- [x] 读取功能门禁、需求规则 / 数据归属、架构 owner 和详细设计边界。
- [x] 回答数据边界与红线问题。
- [x] 诊断旧 06 的外部正文、执行结果和 projection 混层。
- [x] 选择按 owner / ref / snapshot / marker / derived 五类形态验收。
- [x] 产出红线表、AC-MS-022~033 矩阵、不得保存清单、P1/P2 防污染和跨红线审计。
- [x] 形成 §6 回填草稿并自检。

## 2. 本步目标

验证本仓只拥有成员执行宿主控制面所需的本地 truth，外部领域只以 typed ref、safe summary、snapshot、marker、attempt 或 handoff material 进入。任何第二写源、正文泄漏、P1 能力污染、fallback ready 或依赖类型越界都必须可被验收识别。

## 3. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| BR-MS-001~050、D-MS-001~037 | `00` §10~§11 | 红线和数据归属编号 |
| Host Truth Center / dependency boundary | `01` §2、§8~§12 | 唯一 owner 和 seam 类型 |
| 29 对象与 logical store | `03` §6、§10 | 本地可保存对象和写者 |
| forbidden-body / config guard | `03` §13~§14、`04` §4、§8 | redaction / no-bypass |
| 测试对象、redaction、dependency 证据 | `05` §3、§6、§9、§13 | 负向测试和证据入口 |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些数据不得由本仓保存？ | L1 Identity / Work、Member 主体、Runtime run / turn / checkpoint / result、Images manifest / digest / build / provenance、Sandbox backend / policy / execute、Governance approval、Observability backend、外部报告 / evidence / artifact / secret / endpoint 正文均不得保存。 | `00` NG-MS-001~011、D-MS-007/016~017/023~024/030/037；`03` §14.4 |
| 哪些下游不得反向改写真相？ | Identity、Work、Member、Images、Runtime、Sandbox、Governance、Bus、Observability、容器 / registry 及任何 projection / query / job 都不得反写本仓 Host Truth；本仓也不得反写其 truth。 | `01` owner 表；`03` §5、§9.3、§10.5 |
| 哪些 projection / cache 不得反写真相？ | `SafeHostView`、`HostProjectionState`、history/material read model、容量建议、forensic relation 和任何 query cache 都是派生或安全材料，只能读或重建，不能成为 Host / readiness / session / health 的写源。 | `03` §6.1、§8.3、§10.4；`05` TC-QUERY / JOB |
| 哪些 P1 能力不得污染 P0？ | 容量 / 放置建议、资产预热、forensic 增强、聚合视图、真实 provider、staging / production、长期保留和硬性能目标不得改变 P0 owner、状态、UoW、redaction 或 VETO。 | Step 5；`00` FR-MS-E01~E04；`05` §2.3 |
| 红线失败是否一票否决？ | 造成外部 truth 反写、forbidden body / secret 泄漏、required seam 缺失仍 ready、第二 current / session、Query / Job truth repair、依赖类型伪装或证据伪造的失败进入 VF-MS-002~009，不得风险接受。 | `00` §14.6；后续 Step 11 |

## 5. 当前文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧 `06` §4 | “bind / execute”把 Sandbox、Tools、Runtime 内容写进本仓验收对象 | 只验宿主级 binding ref / attempt / gap，不验逐动作 execute |
| 旧 `06` §5~§7 | 以 DB record、metrics、callback 作为可自由保存的事实，未限制外部正文和 secret | 改为 owner / ref / snapshot / marker / body-free 验收 |
| `00` 旧候选 | P1 capacity / forensic / view 容易被误列为核心完成条件 | 明确 P1/P2 仅后置，反写则升级红线失败 |
| `04` 配置项 | `carrier_binding` 曾可能被误解为 ref-bearing binding | 明确本版只允许 `carrier_binding.availability`，不得定义 `binding_ref` |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据边界 | “保存绑定 / callback / metrics”泛化 | 每类数据显式标 owner、形态和禁止反写 | 防止第二 truth |
| 外部输入 | 可保存外部执行详情 | 只保留 safe ref / snapshot / marker | 遵守正文排除 |
| projection / job | 可被视为修复手段 | 只读 / 派生 / 推进已提交 marker | 保持 no-truth-repair |
| carrier | 可能出现聚合 ref key | 仅 `carrier_binding.availability` marker | 修复配置与架构越界 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否建立通用 `ExternalResource` 存储对象 | A. 建立；B. 按具体 owner / ref / marker 分型 | 采用 B，避免万能容器吞并外部 truth |
| 是否允许保存外部 raw body 便于排障 | A. 允许；B. body-free / safe ref only | 采用 B，raw body / secret 泄漏为硬失败 |
| projection 不可用时是否回源修复 | A. Query 内修复；B. 返回 degraded / unavailable，由 Job 重建 | 采用 B，Query no-write 和 source authority 不变 |
| carrier 是否有 binding ref | A. 有；B. 仅 availability marker | 采用 B；未有正式 carrier ref contract |
| P1 视图是否成为 P0 写源 | A. 可以；B. 只能派生和读取 | 采用 B，任何反写触发红线 |

## 8. 结构化中间产物

### 8.1 架构红线验收表

| 红线 ID | 红线 | 通过条件 | 失败条件 | 证据来源 | 裁决影响 |
|---|---|---|---|---|---|
| `AC-MS-022` | 执行主语与决定 owner | 仅 `ProjectMemberRef` + `GlobalMemberRef` 双锚受理；L1 truth 只作 ref / summary | 非项目、默认 actor、查询 / 信号创建宿主或本地复制 L1 truth | `EV-MS-DOMAIN-001`;`EV-MS-CMD-001`;`EV-MS-ARCH-001` | 失败可能触发 VF-MS-002/003 |
| `AC-MS-023` | 装配 owner 与 readiness 红线 | required owner/ref/freshness/item set 同代共同成立；`carrier_binding` 只验 availability | Role→image 本地解析、required binding 缺失仍 ready、partial/fake fallback | `EV-MS-DOMAIN-001`;`EV-MS-CONFIG-001` | 失败可能触发 VF-MS-004/008 |
| `AC-MS-024` | Member / session / Runtime 边界 | Member 输入、本仓 registration / endpoint / HostSession、Runtime ref 各自归属清楚 | 保存 Member body、创建 Runtime run/turn/checkpoint、旧 session 覆盖 current | `EV-MS-CONSUMER-001`;`EV-MS-REDACTION-001`;`EV-MS-DOMAIN-001` | 失败可能触发 VF-MS-003/006 |
| `AC-MS-025` | 健康 / 恢复 / generation 边界 | host、session、backend、unknown 与 recovery decision 分层；旧世代只 late/gap | heartbeat 等同 healthy、host recovery 改 Runtime truth、旧反馈覆盖 current | `EV-MS-DOMAIN-001`;`EV-MS-IDEMP-001` | 失败可能触发 VF-MS-006 |
| `AC-MS-026` | cleanup / external completion / handoff 边界 | local closure、attempt、gap、residual、submitted / delivered / observed / accepted 独立 | local success / receipt / timeout 被写成 external completion 或 handoff accepted | `EV-MS-JOB-001`;`EV-MS-MATERIAL-001` | 失败可能触发 VF-MS-007 |
| `AC-MS-027` | seam / owner / dependency 总边界 | pending 依赖 fail-closed；runtime/event/ref/adapter 不转 compile；外围不成写源 | sibling 源码依赖、默认放行、外部 truth 或外围结果反写 | `EV-MS-ARCH-001`;`EV-MS-CONFIG-001`;`EV-MS-JOB-001` | 失败可能触发 VF-MS-008/009 |
| `AC-MS-028` | 意图 / 决定数据归属 | 本仓只保存受理、决定、冲突、history/material safe refs；L1 正文不入仓 | 保存 ProjectMember / GlobalMember / authorization 正文或复制第二实例 | `EV-MS-DOMAIN-001`;`EV-MS-REDACTION-001` | 失败则不通过 |
| `AC-MS-029` | 装配 / readiness 数据归属 | host 实例、分项结果、readiness 归本仓；image / credential / carrier / binding 仅 ref / marker | 保存 manifest、credential body、backend body，或用 carrier marker 伪装 ref | `EV-MS-DOMAIN-001`;`EV-MS-CONFIG-001` | 失败则不通过 |
| `AC-MS-030` | registration / session 数据归属 | registration、endpoint、HostSession 归本仓；Member / Runtime 只作 safe input / ref | 保存 Member / Runtime 原始正文或把 session 当 Runtime run | `EV-MS-CONSUMER-001`;`EV-MS-REDACTION-001` | 失败则不通过 |
| `AC-MS-031` | health / recovery 数据归属 | signal snapshot、assessment、failure class、recovery decision 归本仓；外部结果只作 snapshot/ref | 保存 backend / isolation / business result，或无 basis 写 recovery | `EV-MS-DOMAIN-001`;`EV-MS-CMD-001` | 失败则不通过 |
| `AC-MS-032` | cleanup / reconciliation / handoff 数据归属 | local closure、attempt、finding/case、safe material 归本仓；外部完成只作 feedback marker | 保存报告 / receipt / evidence 正文、删除历史、反写 sibling | `EV-MS-JOB-001`;`EV-MS-MATERIAL-001`;`EV-MS-REDACTION-001` | 失败则不通过 |
| `AC-MS-033` | 外围 / 跨节点复用边界 | projection、capacity、preheat、forensic、view 只派生 / 读取；复用同一 truth | 外围能力成为核心写源、建立第二 registry / session / health | `EV-MS-QUERY-001`;`EV-MS-JOB-001`;`EV-MS-ARCH-001` | 失败可能触发 VF-MS-007/009 |

### 8.2 AC-MS-022~033 红线闭环矩阵

| AC | 设计契约 | 测试用例 | EV / report | 失败后果 |
|---|---|---|---|---|
| `AC-MS-022~027` | `01` §8~§12；`03` §5、§9、§13~§14；`04` §4、§7 | `TC-DOMAIN-*`、`TC-BOUNDARY-*`、`TC-CONFIG-*`、`TC-ARCH-001` | `EV-MS-DOMAIN-001`、`EV-MS-CONFIG-001`、`EV-MS-ARCH-001` / `reports/runs/<run_id>/suites/contract-domain-fast.md`、`config-redline.md`、`dependency-boundary.md` | 破坏 owner、required seam、依赖或 no-bypass，按对应 VF 处理 |
| `AC-MS-028~033` | `03` §6.1、§10.1、§14.4；`04` §8；`05` §3、§9 | `TC-DOMAIN-002`、`TC-REDACTION-*`、`TC-QUERY-*`、`TC-JOB-NEG-001` | `EV-MS-REDACTION-001`、`EV-MS-QUERY-001`、`EV-MS-JOB-001` / `reports/runs/<run_id>/redaction-check.md`、suite reports | 外部正文、第二写源或派生反写不得通过 |

### 8.3 不得由本仓保存的数据清单

| 数据类别 | 允许最小形态 | 禁止形态 |
|---|---|---|
| Identity / Work | typed ref、safe summary、freshness、source marker | 身份卡、项目正文、授权正文 |
| Member | registration ref、fingerprint、safe status、receipt | launch body、credential、进程日志 |
| Images | opaque pinned ref、availability / verification marker | manifest、digest 内容、BOM、构建日志 |
| Runtime | host-session ref、handoff marker、correlation | run、turn、goal、plan、checkpoint、result |
| Sandbox / carrier | host binding ref（仅正式 ref contract 闭合后）、availability、attempt、gap | backend、policy body、tool execution、`carrier_binding.binding_ref` |
| Governance / policy | safe applicability / pending marker（如正式 owner 允许） | approval truth、policy body、决策正文 |
| Observability / evidence | safe correlation、trace ref、report ref | log body、metric raw、trace body、artifact / report 正文 |
| Secrets / endpoint | opaque ref、redacted reason | token、credential、URL、endpoint body |

### 8.4 P1 / P2 防污染规则

- P1/P2 结果不得改变 P0 object、state、revision、generation、UoW、idempotency、redaction 或 handoff layer。
- real-like / production-like unavailable 只能形成 residual / blocked / waiting，不得标 P0 passed。
- capacity / preheat / forensic / aggregate view 只能读安全摘要或派生 material；任何写源行为按红线失败。
- `carrier_binding` 在当前配置基线中只有 availability marker；新增 ref / release / outcome 字段必须先回写 `03`、`04` 并重开受影响验收 Step。

### 8.5 红线停审记录

| 范围 | 检查 | 结论 | 修正 |
|---|---|---|---|
| owner / 双锚 | 是否存在第二 truth 或隐式主语 | 通过 | 采用 ProjectMemberRef + GlobalMemberRef |
| forbidden body | 是否定义 body-free 和 raw secret 禁止 | 通过 | 由 `EV-MS-REDACTION-*` 与 VF-MS-005 承接 |
| projection / job | 是否禁止 query/job/source repair | 通过 | 由 Step 8 进一步验证 no-write / no-truth-repair |
| carrier binding | 是否误写 `binding_ref` | 通过 | 仅保留 `carrier_binding.availability` |
| P1/P2 | 是否污染 P0 | 通过 | 后置 / residual；反写则 VETO |

### 8.6 跨红线审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个禁止 owner 是否有负向检查 | 已覆盖 | `TC-REDACTION-*`、`TC-ARCH-001`、boundary cases |
| 是否存在第二写源 | 未发现设计层第二写源 | 实现 / 运行时由 dependency、write spy 和 report audit 复核 |
| 是否存在 P1/P2 反写 | 未发现 | 需在未来 selected-run 保留 no-write 证据 |
| 是否有 carrier 聚合伪 key | 已修正 | `carrier_binding` 仅 availability |
| 红线到 VETO 是否断裂 | 未发现 | Step 11 逐项引用 VF-MS-002~009 |

## 9. 回填草稿

正式 §6 应列出 `AC-MS-022~027` 规则 / 架构红线和 `AC-MS-028~033` 数据归属验收。每条红线必须有通过条件、失败条件、`EV-MS-*` / report 入口和 VETO 影响；本仓只保存 Host Truth 与最小安全关联，外部领域只允许 ref / summary / snapshot / marker / handoff。Query、projection、reconciliation、Job 和外围能力不得反写本地或外部核心 truth。`carrier_binding` 只能以 `availability` 表达。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| Sandbox 正式 binding ref / caller | AC-MS-023/026/029/032 | exact contract pending；当前只验 no-fallback 与 marker 分层 |
| policy / credential 是否有本仓可消费的 safe ref | AC-MS-008/023/029/031 | owner pending；不新增正向 truth |
| 外部 report / evidence 的最小 ref 形态 | AC-MS-020/032 | 只保留 body-free opaque ref，等待 owner contract |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 每条红线有通过 / 失败 / 证据 | 通过 | 见 §8.1~§8.2 |
| 禁止保存清单完整 | 通过 | 见 §8.3 |
| P1/P2 防污染规则清楚 | 通过 | 见 §8.4 |
| 红线逐项停审完成 | 通过 | 见 §8.5 |
| 跨红线审计无 unresolved 冲突 | 通过 | 见 §8.6 |
| 可进入 Step 7 | 通过 | 定义接口、事件与跨仓同步验收 |
