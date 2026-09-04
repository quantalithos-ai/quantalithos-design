# Step 9. 定义非功能验收门禁 · L2-member-service

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 9
> 回填章节：`06-验收标准.md` §9 非功能验收门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 定义非功能验收门禁 |
| 当前状态 | `[x] 已确认` |
| 输入基线 | Step 8；`00` NFR-MS-001~020；`04` §4、§9~§12；`05` §9~§10、§13~§14 |
| 输出文件 | `design-calibration/06_acceptance_step_09_nonfunctional.md` |
| 当前模块 | `performance_authority`、`availability_security`、`audit_consistency_observability` |
| 思考记录 | `done` |
| 写入记录 | `done` |
| 自检状态 | `done` |
| gate_status | `pass` |
| gate_reason | 非功能维度、来源 / authority、P0 结构性门禁、P1/P2 residual 和失败影响已明确；未引入无来源硬数字 |
| next_allowed_action | 进入 Step 10，定义可观测性、审计与证据门禁 |

### 1.1 Step 内计划

- [x] 读取状态 / 一致性门禁、NFR、配置和测试专项。
- [x] 回答指标、阈值、专项覆盖和失败问题。
- [x] 诊断旧数字 SLA、泛化可用性和外部完成推导。
- [x] 选择结构性 P0 + authority-dependent quantitative 方案。
- [x] 产出非功能表、P1/P2 residual、失败裁决和停审。
- [x] 形成 §9 回填草稿并自检。

## 2. 本步目标

定义性能、可用性、恢复、安全、兼容 / 依赖、幂等一致性、审计、可观测性和证据诚实的验收门禁。当前 P0 只固定结构性和可复验条件；任何硬阈值必须有 workload、环境、依赖 profile、统计口径和 authority，不沿用旧数字。

## 3. 本步输入

| 输入 | 来源 | 用途 |
|---|---|---|
| NFR-MS-001~020 | `00` §13 | 非功能要求和候选指标 |
| 配置 / failure / redaction | `04` §4、§8~§12 | fail-fast、degradation、secret 与 profile 门禁 |
| 测试专项 | `05` §9~§10、§13 | 性能、可用性、恢复、redaction、依赖和报告证据 |
| 状态 / unknown / no-write | Step 8 | 一致性和恢复非功能断言 |

## 4. SOP 问题回答

| 问题 | 回答 | 依据 |
|---|---|---|
| 哪些非功能指标是 P0？ | 安全 / no-bypass、可用性降级、恢复与 unknown、幂等一致性、生命周期追溯、redaction、依赖分类、可观测性最小材料、证据完整性是 P0；性能目前只要求分阶段 sample，不设硬 P95 / SLA。 | `00` §13.1~§13.2；`05` §10 |
| 阈值来自哪里？ | 结构性门禁来自 `00` NFR、`03` invariant / flow、`04` failure 和 `05` 证据规则；数值阈值必须由未来 workload / environment / authority 固定，当前无数字阈值。 | `00` §13.2；`05` §10.1 |
| 哪些专项未覆盖？ | 真实 provider、production-like capacity、长期 retention、Bus / Observability backend、真实 sibling positive 仍 blocked / waiting；只在 controlled / fake / disabled seam 验负向和结构性语义。 | `05` §5.6、§14.4 |
| 哪些失败阻断发布 / 验收？ | forbidden body / secret、owner 越界、required seam fallback、second current / session、unknown 盲重放、Query / Job truth repair、dependency violation、static evidence 或 P0 config silent fallback 为阻断；性能 sample 缺失也阻断本轮 P0 验收，但数值偏差先进入风险裁决。 | `00` VF-MS-001~009；`05` §13 |
| 证据从哪里来？ | `EV-MS-NFR-*` 由 release / service / replay / redaction / dependency / report suite 的真实 artifact/report 生成；当前不产生实例。 | `05` §13.1~§13.6 |

## 5. 当前文档问题诊断

| 材料 | 问题 | 处理 |
|---|---|---|
| 旧 `06` §5 | P95、成功率、延迟等数字无 workload、环境和 authority | 改为结构性 sample + authority 条件 |
| 旧 `06` §5~§7 | “可用 / 可恢复 / 可审计”未定义失败层和证据 | 按 availability、unknown、redaction、report 和 owner 分解 |
| 旧 `06` | 把真实 staging / 外部后端可用当 P0 前置 | 真实正向列 P1/P2 residual；P0 使用 controlled seam |
| `05` NFR | 候选量化维度与 P0 结构性门禁并列 | 在本 Step 分层，避免候选数字变硬门禁 |

## 6. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 性能 | 无来源硬数字 | 分阶段 / 分依赖 sample，authority 后量化 | 防止伪目标 |
| 可用性 | “能恢复” | unavailable / stale / conflict / partial / unknown 的具体处置 | 可裁决 |
| 安全 | 泛化安全检查 | scope、no-bypass、body-free、secret、dependency 和 key fence | 对齐红线 |
| 观测 | 日志 / metrics 有即可 | 最小 safe material、低基数、correlation、handoff gap 和证据完整性 | 可复查 |

## 7. 验收裁决取舍

| 议题 | 方案 | 结论 |
|---|---|---|
| 是否沿用旧 P95 / SLA | A. 沿用；B. 等 authority | 采用 B；当前只要求 sample / 分解 |
| 真实 backend 未覆盖如何裁决 | A. P0 失败；B. controlled seam + residual | 采用 B，前提是 P0 结构性证据完整 |
| 观测 backend 不可用是否阻断本地结论 | A. 阻断所有功能；B. 保留本地 safe material，handoff 标 gap | 采用 B；backend 不得成为本地 truth owner |
| 性能数值不达标是否自动 VETO | A. 自动；B. 仅有明确 authority / 红线时升级 | 采用 B；无来源数字不进入 VETO |

## 8. 结构化中间产物

### 8.1 非功能验收表

| 验收项 ID | 维度 | 指标 / 要求 | 阈值 / 来源 | 证据来源 | 结论口径 |
|---|---|---|---|---|---|
| `AC-MS-034` | 性能边界与结构性 sample | release smoke、service flow、operations replay 产生 validation / domain / UoW / adapter / handoff 阶段 sample，且外围不无界挤占核心 | `00` NFR-MS-001~003；必须有可分解 sample，无硬数字，authority 待定 | `EV-MS-NFR-001`; `reports/runs/<run_id>/summary.md` | sample 缺失不通过；无 authority 的数值只进 residual |
| `AC-MS-035` | 可用性、降级与恢复 | 依赖 unavailable、stale、conflict、partial、unknown、restart、late、commit/rollback/cleanup unknown 均映射为 blocked / delayed / degraded / gap，已提交 local truth 不回滚 | `00` NFR-MS-004~006；P0 fault-injection / replay 全覆盖 | `EV-MS-NFR-001`; `EV-MS-JOB-001`; `EV-MS-IDEMP-001` | 语义缺失、盲重放或历史被改写不通过 |
| `AC-MS-036` | 安全、配置与 no-bypass | project scope、双锚、required seam、credential / pinned / binding 资格、strict profile 和 body-free 输出成立；依赖不可证不默认放行 | `00` NFR-MS-007~009；`04` §5、§9~§11；无 silent fallback | `EV-MS-REDACTION-001`; `EV-MS-DOMAIN-001`; `EV-MS-CONFIG-001` | 越权、fallback、泄漏或 partial facade 触发 VETO |
| `AC-MS-037` | 全生命周期追溯与证据诚实 | intent→decision→assembly→session→health→closure→handoff 可由 safe refs、reason、revision、generation、cursor 回链；planned / blocked / waiting / unavailable / not_run 与真实 passed 分离 | `00` NFR-MS-010~012、NFR-MS-020；raw/report pair、digest、EV index 和 audit 完整 | `EV-MS-CORE-001`; `EV-MS-MATERIAL-001`; `EV-MS-REPORT-001` | 来源断裂、静态造证据或 `latest` 不通过 |
| `AC-MS-038` | 幂等与一致性 | duplicate、concurrent、out-of-order、same/different digest、single-winner、原 key / generation / cursor fence 不产生 truth 分叉或不可逆动作盲重放 | `00` NFR-MS-013~016；全部 P0 idempotency cases | `EV-MS-IDEMP-001`; `EV-MS-CMD-001`; `EV-MS-CONSUMER-001` | 第二 current、第二 mutation 或旧反馈覆盖不通过 |
| `AC-MS-039` | 可观测性与结果分层 | 关键状态、失败层、dependency gap 和 handoff 层有低基数 safe log / metric / trace / audit；`submitted / delivered / observed / accepted` 不互推 | `00` NFR-MS-017~019；`03` §14；`05` §13 | `EV-MS-NFR-001`; `EV-MS-REDACTION-001`; `EV-MS-MATERIAL-001` | 泄漏、不可关联或 observed 被伪造不通过 |

### 8.2 P1 / P2 非功能残余表

| 残余 | 当前状态 | 影响 | 后续条件 |
|---|---|---|---|
| durable store / lease / broker / observability backend 行为 | P1 waiting | 不能证明具体产品性能和故障模式 | 产品、版本、环境和 evidence authority 固定后 selected-run |
| Member / Images / Runtime / Sandbox 真实正向交互 | P1 blocked / waiting | 真实 launch / register / session / bind / release 不可判定 | `MSVC-UP-001~004/006` 闭合后重开测试和验收 |
| production-like capacity / SLO | P2 candidate | 无硬容量或 P95 结论 | workload、规模、统计和 owner authority 完整 |
| 长期 evidence retention / alert policy | P2 pending | 不能证明长期合规保留 | 运维 / 合规标准固定 |

### 8.3 非功能失败裁决表

| 失败 | 裁决 | 是否可风险接受 |
|---|---|---|
| missing performance sample | 本轮不可裁决 / 不通过 | 仅补齐 sample，不以口头说明替代 |
| numeric trend below future target but no authority | 记录 residual | 可由正式接受人接受，不影响结构性 P0 |
| dependency unavailable with correct blocked / unknown | P0 结构性通过，正向能力 residual | 可，前提是不伪装 ready |
| redaction / no-bypass / owner violation | 不通过并触发 VETO | 不可 |
| duplicate / unknown / second current | 不通过并触发 VETO | 不可 |
| observability backend unavailable but local safe material / gap exists | P0 可判定，handoff residual | 可，需记录影响 |
| static evidence / missing artifact-report pair | 不可裁决 / 不通过 | 不可 |

### 8.4 非功能门禁停审记录

| 主题 | 指标来源 | P0 口径 | 结论 |
|---|---|---|---|
| 性能 | `00` NFR-MS-001~003、`05` 专项 | 只要求分阶段 sample，无硬数字 | 通过 |
| 可用性 / 恢复 | `00` NFR-MS-004~006、`03` unknown | fault / late / unknown 有非成功语义，truth 保留 | 通过 |
| 安全 / 依赖 | `00` NFR-MS-007~009、`01` / `04` | no-bypass、redaction、compile seam | 通过 |
| 审计 / 一致性 | `00` NFR-MS-010~016、Step 8 | safe refs、history、single-winner、key fence | 通过 |
| 观测 / 证据 | `00` NFR-MS-017~020、`05` §13 | safe material、低基数、raw/report pairing | 通过 |

## 9. 回填草稿

正式 §9 应列出性能结构性 sample、可用性 / 降级、安全 / no-bypass、配置 fail-fast、依赖边界、恢复 / 幂等、一致性、审计、可观测性和证据诚实门禁。当前不设置无来源 P95 / SLA；真实后端、生产容量和长期保留属于 P1/P2 residual。任一 redaction、owner、required seam、key fence、Query / Job repair 或证据完整性失败均阻断验收。

## 10. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 性能 workload / authority / hard threshold | AC-MS-034、Step 13 | 当前只保留 sample |
| 真实 provider / backend profile | AC-MS-035~036 | P1 waiting / blocked |
| retention / alert policy | AC-MS-037、039 | 交由运维 / 合规承接 |

## 11. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| P0 非功能维度完整 | 通过 | 见 §8.1 |
| 阈值来源和无 authority 限制清楚 | 通过 | 见 §8.1~§8.3 |
| P1/P2 residual 明确 | 通过 | 见 §8.2 |
| 非功能失败裁决可执行 | 通过 | 见 §8.3 |
| 可进入 Step 10 | 通过 | 定义可观测性、审计与证据门禁 |
