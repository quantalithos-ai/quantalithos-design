# L2-member-images 04 配置设计 Step 2：明确配置设计目标、范围和非范围

> 创建日期：2026-09-01  
> 完成日期：2026-09-01  
> 当前状态：`completed`  
> 文档模式：`full-restart`  
> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 2  
> 回填位置：正式 `04-配置设计.md` 第 2 章“本次配置设计目标与范围”  
> 前置输入：`04_config_step_01_upstream_boundary.md` 已完成；本 Step 尚不定义具体 key、默认值、来源优先级、环境矩阵、secret 或加载实现。

## 1. Step 状态与目标

| 项目 | 结论 |
|---|---|
| 当前 Step | Step 2：明确配置设计目标、范围和非范围 |
| 当前状态 | `completed`；P0/P1/P2 与非范围去向已收敛 |
| 本步目标 | 将 Step 1 的配置输入边界分成 P0、P1、P2，并明确各非范围的 owner / 后续文档去向。 |
| 不做事项 | 不写具体配置项、值、产品、endpoint、secret material、部署命令、测试结果、验收 verdict 或实施 phase。 |
| 进入下一步 | 完成本步问题回答、范围表、非范围残余风险、03 影响判定和自检后，才可创建 Step 3。 |

## 2. 本步输入

| 输入 | 状态 | 本步用途 |
|---|---|---|
| `04_config_step_01_upstream_boundary.md` | completed | 提供允许/禁止配置化边界、初始配置域与 blocker。 |
| `03-详细设计.md` §13~§16 | current formal | 提供既有 config carrier、runtime builder、adapter/fake seam、错误和测试切口。 |
| `00-需求文档.md` §2~§14 | current formal | 提供职责、目标、非目标、数据边界、NFR 和验收方向。 |
| `01-架构设计.md`、`02-概要设计.md` | current formal | 提供产品中立、依赖裁剪、分层与配置影响轮廓。 |
| `L1-governance` 04 配置链 | 粒度/格式参考 | 只借鉴 P0/P1/P2、目标/非范围、下游承接的表达粒度；不继承治理对象和配置项。 |
| sibling / owner 台账 | pending input | 仅识别受影响 lane 和责任去向；不关闭合同。 |

## 3. SOP 问题回答

| SOP 问题 | 收敛回答 |
|---|---|
| P0 必须定义哪些配置才能运行主链？ | P0 只需定义安全的 composition 控制面：配置 profile / body-free ref、显式 `Production` 或 `TestOnly` mode、required slot 的 local availability 判定、已有 local store / resolver / conservative adapter 的注入方向，以及 raw config / secret / endpoint 的 fail-closed 与 redaction。P0 不承诺真实构建、发布、Artifact 或 consumer 正向链。 |
| 哪些配置属于 P1 / P2 或后续扩展？ | P1 是 owner 合同闭合后的真实 adapter / durable store / evidence / Artifact / consumer / event 输入 binding；P2 是 remote config center、admin override、hot reload/LKG、多架构或其他 scope 扩展。两者均不是当前正向配置能力。 |
| 哪些配置细节应留给部署与运维手册？ | 具体文件分发、secret 挂载/轮换操作、容器/主机拓扑、网络与权限安装、告警面板、值班步骤、真实 endpoint 和 provider 操作。04 只定义语义、来源、校验、失效与审计边界。 |
| 哪些配置细节应留给实施计划？ | 配置文件落地批次、目标仓激活、phase / commit boundary、adapter 实现顺序、实施门禁和 rollback 提交策略留给 07；本阶段不创建 implementation ledger 或 skeleton。 |
| 哪些非范围仍有残余风险？ | P1 real adapter、event、Artifact、consumer 和 gate contract 缺失会阻塞 positive lane；旧 05/06 未重建会阻塞测试/验收闭环；任何 future 能力若改变 03 carrier/port/constructor/error/flow，必须先回写 03。 |

## 4. 当前材料诊断

| 材料 | 问题 | 本步处置 |
|---|---|---|
| 03 carrier 已存在但无外部值 | 容易把 carrier 当成完整配置 schema。 | 仅把 carrier 当 binding target；具体 schema 留 Step 7。 |
| 旧 05/06 可能有环境名、阈值和产品 | 容易把历史方向升级为 P0。 | 仅保留环境差异问题，不继承值或事实。 |
| sibling 并行未停审 | 容易写出已确认 manifest/ref/compatibility。 | 标记 P1 pending；不得形成 positive contract。 |
| “无配置”误判风险 | 真实 local composition 仍需 mode/slot/config ref。 | 明确本项目是窄配置项目，不走无配置捷径。 |

## 5. P0 / P1 / P2 范围表

| 等级 | 配置目标 / 能力 | 本轮处理 | 当前成熟度与限制 |
|---|---|---|---|
| P0 | composition identity、profile mode、slot declaration / availability、local store / projection / idempotency binding、reference resolver binding、conservative external seam、TestOnly fake isolation、redaction / fail-closed。 | 进入 Step 3~14，形成可审查的 product-neutral 配置语义。 | 只代表本地装配判断；不代表 process、build、gate、Artifact、consumer 或 readiness。 |
| P1 | owner 正式关闭后的 builder/registry、qualification/evidence、Artifact handoff、member-service consumer、component/seed/mapping real source、conditional inbound event。 | 仅记录未来激活条件和受影响配置域，不写当前正向 key/value。 | 受 `MI-UP-001~009`、`Q-MI-001~004` 和上游 owner 合同阻塞。 |
| P2 | remote config center、admin override、hot reload/LKG、multi-arch、special variant、hardened base、outbound release event 等扩展。 | 只记录 evolution trigger；不纳入当前配置项分母。 | 触发范围或 03/04 重开；不因存在 feature flag 而成立。 |

## 6. 配置设计目标与下游结果

| 目标 | 说明 | 交付给下游的结果 |
|---|---|---|
| `CFG-MI-G01` | 让本地配置组合有唯一读取者和可解释的 blocked/unknown。 | Step 3 控制面、Step 9 加载校验、05 negative seam。 |
| `CFG-MI-G02` | 让 static pin/ref、seed placement 与 live state 永远分离。 | Step 4 禁止项、Step 7 清单约束、06 safety gate。 |
| `CFG-MI-G03` | 让 fake、disabled、unknown 与 Production/TestOnly 明确隔离。 | Step 6 profile 矩阵、Step 11 fail-closed、05/06 门禁。 |
| `CFG-MI-G04` | 让未闭合 owner seam 可见而不被配置伪造。 | Step 5 来源冲突、Step 12 pending handoff、07 owner-gated wiring。 |
| `CFG-MI-G05` | 让配置变更、敏感边界和失败结果可审计。 | Step 8~11 的 redaction、audit、rollback、drift 输入。 |

## 7. 范围与非范围去向

### 7.1 当前范围（P0）

| 范围 | 允许表达 | 明确不表达 |
|---|---|---|
| runtime composition identity | body-free `ImageRuntimeConfigRef`、profile/mode 语义、local assembly context | raw config body、runtime process 或 service identity |
| slot / adapter composition | 已有 slot kind、availability marker、blocked/unknown/fake-only、port 注入方向 | provider SDK、endpoint、credential、external response、业务成功 |
| static source references | mapping/component/seed/base 的 typed ref / safe conclusion 入口 | Role/mapping body、runtime live memory、workspace live content、secret |
| local technical stores | local truth/history/projection/idempotency 的 private binding 语义 | physical DB 产品、schema、recovery algorithm、UoW 政策改写 |
| diagnostics / redaction | 安全字段、禁止输出、fail-closed reason category | observability backend、report、evidence 或 raw error |

### 7.2 非范围及责任去向

| 非范围 | 留给哪一层 / 哪份文档 | 当前残余风险 |
|---|---|---|
| RoleDefinition 与 Role-to-variant mapping truth | `L3-method-library`；本仓仅 ref/runtime seam | `MI-UP-003` 未闭合，受影响 baseline blocked。 |
| member / runtime / tools / supervisor release truth 与 live state | 对应 owner；`L2-member-service` 负责宿主/生命周期 | `MI-UP-001/002` pending，不能配置成 usable。 |
| build/registry 产品、digest、provenance、gate/evidence、Artifact acceptance | builder/Artifact/security/governance owner；未来 03/04/07 | `Q-MI-003/004`、`MI-UP-007` 阻塞正向 lane。 |
| inbound event transport / topic / receipt / dedup 与 outbound publisher | Bus/Core/event owner；未来重开 | `MI-UP-005/009`；当前 marker-only / zero outbound。 |
| container / sandbox / policy / approval / observability backend | `L2-member-service`、`L4-sandbox`、`L1-governance`、observability owner | 不得由 profile 或 feature flag 打开。 |
| 具体部署、secret 挂载、runbook、告警、SLO | `09-部署与运维手册.md` 或运维治理 | 本项目当前未生成 09，不在本步补写。 |
| 实现 phase、commit、ledger、目标仓 | `07-实施计划.md` | 本阶段未获授权，不创建。 |
| 测试用例、执行报告、验收 verdict/signoff | `05/06` 及真实执行流程 | 当前不执行测试，不伪造证据。 |

## 8. 配置范围图

#### 图类型：配置范围分层图

```text
[P0 local composition control]
  config-ref / profile / slot / fake / redaction
                 |
                 v
        [infra runtime builder]
                 |
      +----------+----------+
      |                     |
[local ports / stores] [external conservative seams]
      |                     |
      +----------+----------+
                 v
       [Assembled or Blocked]
                 |
                 v
        [future P1 owner gates]
       build / Artifact / consumer
                 |
                 v
       [P2 scope extensions]
```

关键说明：

- P0 只形成 local composition 结论；`Assembled` 不等任何下游 readiness。
- P1/P2 不是当前可用配置项；必须先获得 owner contract 和必要的 03/04 重开。
- 配置不能改变 domain state、write gate、dependency 分类或 outbound inventory。

## 9. 设计取舍

| 议题 | 备选 | 采用结论 | 理由 |
|---|---|---|---|
| 是否采用无配置路径 | 直接声明无配置；保留窄 P0 composition 面 | 不采用无配置路径 | 03 已有稳定 config/slot/assembly carrier。 |
| P0 是否锁定真实产品 | 立即选择 DB/builder/registry/bus 产品；保持 product-neutral | 保持 product-neutral | `Q-MI-003/004` 与 owner contract 未闭合。 |
| P1 是否提前列 positive keys | 预写 endpoint/manifest/gate/consumer keys；只记 future trigger | 只记 future trigger | 防止 pending 被写成正向合同。 |
| 是否允许 profile 改变领域行为 | 允许开关；只装配既有 port/slot | 只装配既有 port/slot | 配置不得绕过 state/UoW/recovery/owner boundary。 |
| 是否在本步定义部署细节 | 写入 mount/命令；留给 09 | 留给 09 | 保持控制面与部署手册职责分离。 |

## 10. 对详细设计的影响判定

| 配置结论 | 是否影响 03 | 影响类型 | 03 回写位置 | 处理状态 |
|---|---|---|---|---|
| P0 仅承接已有 `ImageRuntimeConfigRef`、slot、assembly、fake carrier | 否 | 配置范围收敛 | 不适用 | 无回写 |
| P1/P2 暂不进入当前 runtime composition | 否 | future boundary | 不适用 | 无回写 |
| 配置不新增 carrier、port、constructor、DTO、error、flow 或 state | 否 | 契约保持 | 不适用 | 无回写 |
| 若 future P1/P2 要引入 real provider、hot reload、config center、secret resolution 或 event activation | 是（future trigger） | 代码/协议/生命周期契约变化 | 触发时回写 `03` §5、§13 及对应 calibration Step | 无回写（当前未触发） |

## 11. 回填草稿

> 校准来源：
> - `design-calibration/04_config_step_02_scope.md`
>
> 延伸阅读：
> - 建议阅读本文件的“P0 / P1 / P2 范围表”“范围与非范围去向”“配置范围图”“对详细设计的影响判定”和“待确认事项”。

正式 `04-配置设计.md` §2 应声明：本仓存在窄而明确的 P0 配置控制面，覆盖 private infra composition、profile/mode、slot、local binding、conservative adapter 和 redaction/fail-closed；P1 真实 owner seam 与 P2 扩展只作为 future trigger，不形成当前 positive 配置项。部署、运维、测试、验收和实施细节分别交给 `09`、`05/06`、`07`。

## 12. 待确认事项与残余风险

| 事项 | 影响范围 | 未确认前处理 | 责任方 / 重开条件 |
|---|---|---|---|
| P1 builder/registry/qualification 产品与安全证据 | Step 7~11 positive adapter/config | 保持 product-neutral、blocked/unknown/fake-only | Infrastructure/security/Artifact authority 正式闭合后重开。 |
| member-service consumer manifest/ref/confirmation | supply handoff 配置 | 只保留 `ConsumerHandoffGap` | sibling 停审并完成双方校准后重开。 |
| event family/schema/receipt/dedup | inbound 配置与 worker activation | marker-only，`accepted_input=false` | Bus/Core owner闭合后重开。 |
| multi-arch / special variant / hardened base scope | P2 profile 与 identity | 不进入 P0 分母 | scope/governance/SRE 正式决定后回退范围审计。 |
| P0 是否需要真实 secret provider | P0 adapter constructor / security | 只允许 opaque ref，不读取 raw secret | security/ops authority闭合后重开 03/04。 |

## 13. 自检与进入下一步条件

| 自检项 | 结论 | 依据 |
|---|---|---|
| P0/P1/P2 已区分 | 通过 | §5。 |
| 非范围有 owner / 文档去向 | 通过 | §7.2。 |
| 未写具体配置项、产品、endpoint、secret、部署或测试事实 | 通过 | §1、§7。 |
| 无配置路径已正确拒绝 | 通过 | §5、§9。 |
| 03 影响已判定且当前无待回写 | 通过 | §10。 |
| sibling / owner pending 未被关闭 | 通过 | §7.2、§12。 |
| 可进入 Step 3 | 通过 | Step 3 将建立配置控制面总览；本 Step 已完成停审。 |

```text
step_02 = completed
gate_status = pass_with_explicit_blockers
next_allowed_action = create_and_complete_step_03_control_plane
formal_04_write_allowed = false_until_step_15
implementation_allowed = false
test_execution_allowed = false
commit_required = false
```
