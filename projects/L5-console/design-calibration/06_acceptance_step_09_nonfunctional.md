# Step 9. 定义非功能验收门禁

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 9  
> 回填章节：`06-验收标准.md` §9 非功能验收门禁

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 9 非功能验收门禁 |
| 当前状态 | `done / pass / self_reviewed` |
| 输入基线 | 正式 00 `NFR-CON-001～021` / `AC-NFR-001～007`；03 §10～§15；05 §10 |
| 输出文件 | `design-calibration/06_acceptance_step_09_nonfunctional.md` |
| 数值 authority | `CON-Q-045～046` open；无当前硬数值 |
| 实际结果 | `not_evaluated` |
| 下一动作 | 只允许进入 Step 10 |

## 2. 本步计划与目标

本步把 21 项 NFR 收敛为七个稳定 `AC-NFR-*` 门禁，区分结构性 P0、零容忍安全语义、semantic a11y 与 authority-selected 数字/兼容/production facet。没有来源的旧 P95/SLA/固定数量不进入阈值列。

## 3. 本步输入

| 输入 | 用途 |
|---|---|
| `00` §13/§14.3 | 21 NFR 与七个 NFR acceptance anchors |
| `03` §10～§15 | bounded state/consistency/recovery/diagnostic/a11y contracts |
| `04` | strict startup config、failure posture、production-pending 非 readiness |
| `05` §10 | structural samples、fault injection、suite/EV 和无数值 authority |
| Step 5～8 | 功能、安全、架构、协议和一致性门禁 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些非功能是 P0？ | bounded interaction/fan-out、fail-closed/partial isolation、SDK-only/redaction、traceable phase/ref、no replay/single source、diagnostic isolation、semantic accessibility。 |
| 阈值来自哪里？ | 当前只有结构性/零容忍语义来自 00～05；精确 latency/load/availability/browser/AT/production diagnostic 门槛无 authority，不能发明。 |
| 哪些专项未覆盖？ | 实际全部未执行；设计上 production-like load、具体 browser/AT、production sink 为 selected residual。若 baseline 升级为 required，缺 evidence 会阻断。 |
| 哪些失败阻断发布？ | 任一结构性 P0、安全/redaction/no-replay/partial isolation/semantic a11y/config/dependency failure；以及 baseline-declared selected gate 失败。 |
| 证据来自哪里？ | CONSISTENCY/SEC/DIAG/A11Y/CONFIG/ARCH 等 TC，经 FLOW/INTEGRATION/SECURITY/ACCESSIBILITY/ARCH/RELEASE EV 与 fixed reports。 |

## 5. 当前文档问题诊断

| 旧问题 | 本步处理 |
|---|---|
| 固定 `<2s`、P95、99.9/99.95%、38/8 数量 | 删除；无 authority |
| 性能只写“快” | 改为 bounded fan-out/no unbounded wait/no replay/single-flight 的结构性条件 |
| 可用性掩盖 owner 局部失败 | partition-local posture 为 P0 |
| 可观测性与 audit/evidence 混同 | client diagnostics 与 owner/formal evidence 分开 |
| 可访问性只写 WCAG 式口号 | 以 C1～C6 同 action/guard/outcome/recovery ceiling 裁决 |

## 6. 改动前后对比

| 项 | 旧 | 新 |
|---|---|---|
| 性能 | 无来源数字 | bounded structure + sample；数字待 authority |
| 可用性 | 泛化在线 | fail-closed + partition isolation + stable blocked posture |
| 安全 | 泛化权限 | SDK-only、minimum disclosure、forbidden body、revocation |
| 追溯 | 泛化日志 | owner/source/version/ref + phase separation |
| 可访问 | 视觉/键盘口号 | semantic equivalence + focus/announce fallback |

## 7. 验收裁决取舍

| 议题 | 裁决 |
|---|---|
| 无硬数值是否可通过结构性 P0 | 可；只裁决正式结构性要求，不声称 latency/SLA 达标 |
| 历史数字可否作暂定阈值 | 不可 |
| sample 是否等于 threshold pass | 否；只能归档观察值，不生成 readiness |
| semantic a11y 是否 P0 | 是；具体 browser/AT compatibility 为 selected，除非 baseline 升级 |
| production diagnostic sink 是否 P0 | disabled/isolation/redaction 是；production binding positive conditional |
| selected unavailable 是否可风险接受 | 若未升为 release-required，可记录 residual；升为 required 后不能以 unavailable 通过 |

## 8. 结构化中间产物

### 8.1 非功能验收表

| 验收项 ID | 维度 | 指标 / 要求 | 当前阈值 | TC / Future 证据 | 结论口径 |
|---|---|---|---|---|---|
| `AC-NFR-001` | 性能/负载 | 本地交互不被无关 owner 无界阻塞；fan-out 由 descriptor/用户动作界定；single-flight；unknown 不重放 | 结构性零违反；duration/count 仅 sample，无数值 pass | CTX/TOPIC/INTENT/CONSISTENCY；FLOW/INTEGRATION | 结构性失败→P0 不通过；数值无 authority 不给 verdict |
| `AC-NFR-002` | 可用性 | context fail-closed；owner failure/slow/stale 局部隔离且不被掩盖；未开放稳定 blocked/read-only/partial | 零越权/零错误扩散；无 availability % | CTX/TOPIC/RECOVERY/SEC；FLOW/INTEGRATION/SECURITY | 失败→P0 不通过；VETO-002/007 候选 |
| `AC-NFR-003` | 安全 | SDK/formal boundary；客户端只收紧；无 Policy/Gate 绕过；forbidden body whole reject/no echo；撤销立即约束 | 零旁路、零 forbidden material、零本地授权提升 | VIEW/ADAPTER/DIAG/SEC/CONFIG/ARCH；SECURITY/ARCH/RELEASE | 任一失败→VETO/S，总体不通过 |
| `AC-NFR-004` | 可追溯 | owner/source/version/ref 保真；draft/receipt/pending/result 分层；diagnostic 与 audit/evidence 分离 | 每个声明可回指安全 source/ref；零 phase 冒充 | VIEW/INTENT/TOPIC/DIAG；FLOW/CONTRACT/SECURITY | 关键缺失/误表述→P0 不通过 |
| `AC-NFR-005` | 幂等/一致性 | owner truth 单一；Query no-write；formal/local 非原子保真；unknown no replay；跨 owner 不假原子 | owner write inventory 恰好一处；16 Query write=0；replay=0 | STATE/CONSISTENCY/ARCH；FLOW/INTEGRATION/ARCH | 失败→P0 不通过；VETO-001/003/005/007 候选 |
| `AC-NFR-006` | 可观测性 | 可安全区分 context/owner/query/submit/reconcile/degrade/recover；body-free 低基数；sink failure 隔离 | forbidden fields=0；business output/state delta=0；production sink positive conditional | DIAG/SEC/RECOVERY；UNIT/INTEGRATION/SECURITY | isolation/redaction 失败→不通过；production positive 按 baseline |
| `AC-NFR-007` | 可访问性 | C1～C6 视觉/键盘/AT 使用同 semantic action/guard/input/outcome/recovery ceiling；非颜色状态；fallback 无死路 | 所有适用核心 semantic paths=100%（集合完整性，不是历史性能数字）；具体兼容矩阵待 authority | NAV/INTENT/RECOVERY/A11Y；ACCESSIBILITY/INTEGRATION | semantic failure→VETO-006；selected matrix 按 baseline |

### 8.2 NFR 来源聚合

| 验收项 | 来源 NFR | 结构性 P0 | Selected / residual |
|---|---|---|---|
| `AC-NFR-001` | `NFR-CON-001～003` | bounded wait/fan-out/single-flight/no replay | latency/load/SLO (`CON-Q-045`) |
| `AC-NFR-002` | `NFR-CON-004～006` | fail-closed、partial isolation、stable blocked | production availability % |
| `AC-NFR-003` | `NFR-CON-007～009` | SDK-only/redaction/revocation/min disclosure | external security certification（未定义） |
| `AC-NFR-004` | `NFR-CON-010～012` | refs/phase/diagnostic separation | formal owner audit depth |
| `AC-NFR-005` | `NFR-CON-013～015` | single truth/no-write/no replay/non-atomic | durable/cross-session semantics (`CON-Q-044`) |
| `AC-NFR-006` | `NFR-CON-016～018` | body-free/isolation/typed posture | production envelope/sink (`CON-Q-046`) |
| `AC-NFR-007` | `NFR-CON-019～021` | semantic equivalence | browser/AT matrix (`CON-Q-046`) |

### 8.3 Selected 非功能升级规则

| 状态 | 裁决 |
|---|---|
| 未有 authority / 未列入 baseline | 保持 residual，禁止写 pass/fail 数值或兼容 verdict |
| authority 已定义但 baseline 未选择 | 记录可选范围，不贡献当前 positive |
| baseline 声明 release-required | 相应环境/场景/窗口/阈值/matrix/sink 与 evidence 必须固定；缺失/failed 阻断 |
| 执行只有 sample 无 threshold | 只归档 sample；不得转换为达标/readiness |

### 8.4 非功能失败裁决

| 失败类型 | 裁决 |
|---|---|
| access/redaction/dependency/no-replay/a11y semantic | S/VETO；不通过，不可风险接受 |
| boundedness/partition isolation/diagnostic isolation | P0 failure；通常 S/A，未修复不得通过 |
| required selected threshold/matrix 失败 | 本轮门禁失败；按缺陷分级/风险规则，但不得伪装未执行 |
| non-required selected unavailable | residual，可支撑有条件通过的前提是逐项正式接受 |
| 无 authority 的旧数字未达 | 不形成失败；旧数字不在门禁中 |

## 9. 回填草稿

正式 §9 应以七个 `AC-NFR-*` 门禁表呈现结构性 P0、零容忍语义和 selected 升级规则。阈值列明确“结构性零违反/无当前数值 authority”，不得恢复旧 `<2s`、P95、99.9/99.95%、固定控制项或指标数量。

## 10. 待确认事项

| 事项 | 当前处理 |
|---|---|
| latency/load/availability scenario/window/threshold | `CON-Q-045` open |
| browser/AT matrix 与适用路径 | `CON-Q-046` open；semantic P0 已固定 |
| production diagnostic envelope/sink | `CON-Q-046` open；disabled/isolation P0 |

## 11. 下一步门禁

| 条件 | 结果 |
|---|---|
| 21 NFR 聚合到 7 AC 无遗漏 | pass |
| 结构性 P0 与 selected 数字/兼容分离 | pass |
| 无来源阈值已排除 | pass |
| 失败裁决可判定 | pass |
| 允许进入 Step 10 | yes |
| 允许修改正式 06 | no |
