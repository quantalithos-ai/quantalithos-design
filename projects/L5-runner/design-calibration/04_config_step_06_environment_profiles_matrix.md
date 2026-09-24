# Step 6. 定义环境、部署 profile 与配置矩阵

> 对应 SOP：`standards/document/配置设计讨论流程_SOP.md` Step 6
> 回填章节：`04-配置设计.md` §6
> 粒度参考：`projects/L1-governance/design-calibration/04_config_step_06_environment_profiles_matrix.md`
> 输入：Step 5、正式 00/01/02/03、03 Step 14/16/18
> 状态：`completed / pass / self_reviewed`

## 1. Step 状态与关键判断

| 项 | 当前值 |
|---|---|
| current_document | `04-配置设计.md` |
| current_step | Step 6 |
| current_module | `profiles:environment_matrix` |
| gate_status | `pass_for_step_07` |
| gate_reason | 环境角色、四个技术中立 profile、依赖/敏感/测试差异和跨 profile 隔离已闭合；profile 不表示 readiness。 |
| formal_04_write_allowed | `false_until_step_15` |
| next_allowed_action | 创建并完成 `04_config_step_07_config_items.md` |

| SOP 问题 | 收口回答 |
|---|---|
| local / CI / test / staging / prod 是否适用？ | 作为环境角色均可描述；本轮配置 profile 为 `local-safe`、`test-deterministic`、`integration-pending`、`product-pending`。这些是技术中立字符串/ref 语义，不锁语言、shell、进程或包装。 |
| 每个环境来源？ | 每次 assembly 只消费一份严格 JSON；CI 的 fixture selector 在文档外，不能逐叶覆盖。所有 profile 都禁止隐式 profile 默认。 |
| 外部依赖？ | local/test 仅可使用 parity fake/disabled seam 验证安全语义；integration/product 只有正式合同与实现能力均闭合后才可启用真实 binding，当前关键正向能力仍 blocked。 |
| 敏感配置？ | 所有 profile 的 JSON 都只能携带 opaque sensitive ref，不能含 raw material。test profile 只能用 fake refs，不能伪装 product credential。 |
| 测试和验收差异？ | 05 必须验证 profile isolation、fake 污染拒绝、单文档一致性、blocked/unknown、不自动 replay、redaction；06 未来把 fake 当真实、pending 当 ready、secret 泄露列为否决候选。 |

## 2. 诊断、取舍与不变量

| 议题 | 候选风险 | 收口 | 理由 |
|---|---|---|---|
| 环境名与 profile | 为 dev/test/staging/prod 各建不同 schema | 四个 posture profile，共用一个 strict schema | 避免环境名称变成业务能力或 readiness |
| local 正向体验 | 用 fake 伪装完整 Runner | `local-safe` 保持真实 blocker；正向 fake 只在 `test-deterministic` | local 也不能本地批准或伪造 Sandbox/Runtime |
| integration | 部分 adapter 到达即整体 ready | 每 slot 独立 configured/enabled/ready；其余显式 blocked | 防止 partial integration 被提升为产品 readiness |
| product profile | 名为 production 即可运行 | `product-pending`；当前因上游/物理 blocker 不能 ready | 事实诚实 |
| offline | 增加 offline profile 自动信任 cache | 不设 offline profile；断线是 runtime observation | 旧 cache 不能代替 current authority |
| platform | 为 OS 固定不同配置 truth | OS 只是 platform capability/readiness 输入 | 保持跨平台语义一致，不引入路径/端口真相 |

所有 profile 共享以下不变量：显式 immutable version、authority/integrity gate、accepted≠running、confirmed≠cleaned、Query no-write、Unknown/no-replay、ProtectionGuard、mandatory redaction、SDK/public seam、local record≠evidence。

## 3. 结构化中间产物

### 3.1 环境角色与 profile 总表

| 环境角色 | 用途 | runtime profile | 配置来源 | 外部依赖 | 敏感处理 | 当前姿态/差异 |
|---|---|---|---|---|---|---|
| local design/dev | 本地装配、schema/页面/负向流程、blocked UX | `local-safe` | 一份本地 strict JSON；profile 显式 | local store/cache capability 可为未实现/blocked；owner/Sandbox/Runtime seam blocked/disabled；不允许成功 fake | 仅 opaque refs；通常不解析真实 material | 可展示/验证 fail-closed；不能声称完整主链可运行 |
| CI unit/contract | deterministic contract/domain/service/adapter parity 测试 | `test-deterministic` | 一份受控 test JSON + document 外 fixture registry | deterministic fake clock/id/digest/store/ports；fake 必须覆盖 blocked/unknown/error | fake ref；fixture 禁止 raw secret/body | 只证明语义/可重复性，不证明真实 integration |
| controlled integration/test | 正式 SDK/owner seam 到达后的逐 slot 接缝验证 | `integration-pending` | 一份受控 immutable strict JSON | 已闭合 slot 可 controlled/real-like；其他 blocked/unsupported；不直连 sibling private implementation | credential/endpoint locator 仅 opaque ref，由 resolver 提供 material | 当前 RUN-UP-001~008 使关键正向闭环 blocked |
| staging-like rehearsal | 未来产品候选的全链预演 | `product-pending` | 一份受评审/版本化 JSON artifact | 仅正式 public SDK/API、durable local capability 和平台 seam；绝不 fake fallback | 只允许 approved provider ref | 当前 blocked，不构成 staging readiness |
| production/end-user | 未来端侧正式产品运行 | `product-pending` | 一份批准且不可变的 JSON artifact | 所有 required local guarantees + 本次启用 slot 的 formal readiness | raw secret 零落盘/零输出；轮换通过 provider ref | 当前 pending/blocked，不是可发布 profile |

环境角色不是配置字段；同一 `product-pending` 可用于 staging-like/production 上下文，但两者各自的文档身份、binding refs 和外部 authority 不可混用。

### 3.2 Profile 配置与能力矩阵

| 维度 | `local-safe` | `test-deterministic` | `integration-pending` | `product-pending` |
|---|---|---|---|---|
| profile 必填 | 是 | 是 | 是 | 是 |
| single strict document | 是 | 是 | 是 | 是 |
| local store refs | required；能力未知则 builder blocked | required fake refs；须满足 parity contract | required controlled/durable-like refs；当前技术 pending | required formal durable refs；当前 blocked |
| authority/material/integrity | blocked/disabled，不得成功 fake | parity fake 仅测试；显式 synthetic marker | per-slot formal contract 到达后验证；当前 blocked | formal-only；当前 blocked |
| Sandbox/Runtime | blocked/disabled | fake typed outcomes，可模拟 Accepted/Unknown；不称真实运行 | formal seam pending；禁止 private backend | formal-only；当前 blocked |
| platform resource | safe unknown/unsupported 可展示 | deterministic observations | controlled multi-platform seam pending | formal platform support matrix pending |
| diagnostic/redaction | mandatory redaction；source 可 unavailable | fake redaction 必须 fail-closed parity | formal safe read/handoff pending | formal-only；本地 log 非 evidence |
| clock/id/digest | non-fake provider authority pending；不可用则 mutation blocked | fixed/deterministic providers | controlled provider | formal provider |
| planned Consumer | disabled/blocked | negative/parity test only | blocked until event contract | blocked until formal readiness |
| archive/peripheral | disabled/blocked | fake negative/optional | per-slot pending | 不参与 core success；正式合同后才可请求 |
| fake provider | 禁止正向成功 fallback | 允许且必须显式 | 禁止冒充 real；只可 isolated test harness | 禁止 |
| readiness 结论 | local composition 也可能 blocked | test harness only | per-slot blocked/pending | whole product blocked |

### 3.3 配置域的 profile 差异

| 配置域 | local-safe | test-deterministic | integration-pending | product-pending | 跨 profile 校验 |
|---|---|---|---|---|---|
| runtime | 显式 profile/config identity | 显式 test profile + fixture identity | controlled document identity | approved artifact identity pending | profile/ref family 必须匹配；无隐式切换 |
| stores | logical refs；无法证明 guarantee 即 blocked | parity fake refs | controlled/durable-like ref pending | formal durable refs required | product/integration 禁止 fake/in-memory fallback |
| bindings | blocked/disabled opaque refs | fake opaque refs | formal slot refs逐项到达 | formal-only refs | config ref 不直接产生 Ready |
| limits | authority-pending；仅 hard safety declaration | deterministic fixture 值，但只是测试 oracle | formal workload authority pending | formal workload authority required | test 数字不得迁移为 product default |
| observability | mandatory redaction；telemetry/handoff可 blocked | fake safe-output/redaction | controlled formal seam pending | formal provider/handoff required where enabled | raw log/secret/evidence upgrade 一律禁止 |
| determinism | non-test ref；缺失 blocked | fixed clock/id/digest | controlled real-like provider | formal provider | fake ref 只允许 test profile |
| features | 默认 disabled；不得开 blocked path | 可测 request/reject，但不改 truth | 只在 formal prerequisites 完整时请求 | formal prerequisites + review | flag 不能解除 contract/authority blocker |

### 3.4 跨平台、断线与恢复矩阵

| 场景 | 是否 profile 差异 | 配置行为 | runtime/用户可见行为 |
|---|---|---|---|
| OS/架构/文件系统不同 | 否，仍使用同 profile schema | 只选择正式 platform binding ref；不写私有命令/路径 | unsupported/unknown/conflict 显式；不伪造 allocation |
| 网络离线/断线 | 否，不新增 offline profile | 不回退旧 authority 或 cached config | stale/unknown/reconcile/manual-review；不自动 replay |
| 休眠/重启 | 否 | 重新加载/验证选定文档并建立新 assembly marker | 重验 context/generation/lease/protection；旧 marker 不恢复 readiness |
| source/lease 过期或撤销 | 否 | 配置不能 override | freeze/block；需 owner safe read |
| 配置文档变化 | 是，新 config identity | 只通过新 startup/new assembly | 旧已开始 Job 保持 frozen snapshot；不原地热改 |

### 3.5 测试/验收/实施承接矩阵

| 场景 | 05 后续测试输入 | 06 后续裁决输入 | 07/09 实施运维输入 |
|---|---|---|---|
| profile 显式与隔离 | 缺失/未知/mismatch、test fake 污染 product | implicit/fake product 为 VETO 候选 | 每环境选一份文档；不发明叶子 override |
| local-safe blocked UX | required provider/store 不可用、safe next step | 将 blocked 写成 ready 为 VETO | 保留 issue ref 和重建入口 |
| deterministic parity | fake 覆盖 Ready/Degraded/Unavailable/Blocked/Unsupported | fake 结果不得作为真实验收 | fixture 与 product material 完全隔离 |
| partial integration | 一个 slot Ready、其他 blocked；configured≠enabled≠ready | partial 必须可见，不可整体成功 | per-slot marker/合同核验 |
| product-pending | core guarantee/owner seam 缺失时 fail-closed | 未关闭 blocker 不可声明发布/运行 ready | 只登记 planned/blocked，不生成部署事实 |
| disconnect/restart | freeze、revalidate、no replay、new marker | 自动 replay/旧 authority 放行为 VETO | recovery/readiness 观测与配置变更分离 |
| cross-platform | unknown/unsupported/conflict mapping | 私有 backend/本地 PID/端口升级 truth 为 VETO | 平台 support matrix 留实施/运维事实填充 |

### 3.6 Profile 停审与跨 profile 审计

| profile | 来源清楚 | 依赖清楚 | sensitive 清楚 | readiness 诚实 | 结论 |
|---|---|---|---|---|---|
| local-safe | yes | blocked/disabled | yes | yes | pass with physical blockers |
| test-deterministic | yes | explicit parity fake | yes | test-only | pass |
| integration-pending | yes | per-slot pending | yes | blocked | pass with upstream blockers |
| product-pending | yes | formal-only | yes | blocked | pass with upstream/physical blockers |

| 跨 profile 审计项 | 结论 |
|---|---|
| fake 是否可进入 integration/product | no；cross-field reject |
| environment 名称是否成为 readiness | no |
| offline/cache 是否绕过 current authority | no |
| platform profile 是否选择 Sandbox 私有 backend | no |
| test numeric fixture 是否成为 product default | no |
| partial slot 是否掩盖 blocked capability | no |
| profile 是否改变 03 状态/owner/guard | no |

## 4. 03 影响、回填与门禁

| 结论 | 是否影响 03 | 类型 | 03 回写位置 | 状态 |
|---|---|---|---|---|
| 四个 profile 是 `RunnerRuntimeProfileRef` 的受控配置语义 | 否 | ref vocabulary / environment mapping | N/A | 无回写 |
| environment role ≠ profile ≠ readiness | 否 | availability 解释 | N/A | 无回写 |
| offline/OS 不新增业务 profile | 否 | runtime observation boundary | N/A | 无回写 |
| future 新 profile 改变 builder/adapter behavior | 是 | runtime config/builder contract | 03 Step 6/7/9/14 | 当前排除，未来重开 |

未来正式 §6 应保留环境/profile 总表、能力矩阵和断线/跨平台矩阵，并突出所有 profile 当前均不证明真实实现或 readiness。

| 待确认事项 | 当前处理 |
|---|---|
| exact product shell/process/packaging 与 OS support | `RUN-DDD-002/RUN-UP-007`；04 不选技术 |
| durable store/cache 与 migration/corruption | `RUN-DDD-003`；integration/product blocked |
| true integration endpoints/contracts | `RUN-UP-001~008`；per-slot blocked |
| workload limits | Step 7 保留 required/authority-pending |

| 进入 Step 7 条件 | 结论 |
|---|---|
| P0 环境/profile 差异可定位 | pass |
| 来源、依赖、敏感处理和下游输入明确 | pass with explicit blockers |
| fake/product、offline/authority、platform/private boundary 无冲突 | pass |
| 无当前 03 待回写 | pass |

Step 6 完成，允许进入 Step 7；正式 04 仍不可写。
