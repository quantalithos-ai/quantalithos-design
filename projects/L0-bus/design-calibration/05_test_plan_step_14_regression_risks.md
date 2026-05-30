# L0-bus 05 测试方案 Step 14: 回归策略与残余风险

> 本文件是 `projects/L0-bus/05-测试方案.md` 的 Step 14 中间产物。
> 本步定义 L0-bus 发生不同类型变更后应触发哪些最小回归或全量回归,以及当前 P0 未覆盖风险如何记录、缓解和交给验收标准裁决。
> 本步不修改正式 `05-测试方案.md`。

---

## 1. Step 状态

| 项 | 内容 |
|---|---|
| Step | Step 14 |
| 主题 | 定义回归策略与残余风险 |
| 状态 | 已确认 |
| 正式回填位置 | `05-测试方案.md` §14 |
| 是否修改正式 `05-测试方案.md` | 否 |

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `05_test_plan_step_02_scope.md` | 已确认 | 提取 P0 / P0-min / P1 / P2 范围和残余风险归属 |
| `05_test_plan_step_06_cases.md` | 已确认 | 提取 `TC-BUS-*` 用例族和回归用例范围 |
| `05_test_plan_step_09_automation_ci_gates.md` | 已确认 | 提取 PR / main CI / nightly / release gate 触发层级 |
| `05_test_plan_step_10_special_nonfunctional.md` | 已确认 | 提取性能、安全、一致性、恢复、观测和审计专项 |
| `05_test_plan_step_11_defects_retest.md` | 已确认 | 提取缺陷分级、复验规则和 P1-risk 规则 |
| `05_test_plan_step_13_reports_evidence.md` | 已确认 | 提取风险接受、复验证据和验收交接报告位置 |

---

## 3. SOP 问题回答

### 3.1 哪些变更触发最小回归?

最小回归不是按文件名触发,而是按影响的设计能力触发。实现时可以由文件变更映射到下表的能力范围。

| 变更类型 | 最小回归集 | 触发原因 |
|---|---|---|
| publication acceptance / core contract reference 处理变化 | `TC-BUS-PUB-001`~`004`、`bus-contract` | 可能破坏契约绑定和 payload boundary |
| transport semantic / backend capability mapping 变化 | `TC-BUS-SEM-001`~`002`、`TC-BUS-BND-001`~`003` | 可能泄漏后端差异或错误映射 unsupported / unavailable |
| delivery lifecycle / state transition 变化 | `TC-BUS-DLV-001`~`004`、state machine unit tests | 可能引入非法迁移或 history 缺失 |
| feedback / idempotency 变化 | `TC-BUS-FDB-001`~`004`、idempotency suite | 可能破坏 same digest existing / different digest conflict |
| retry / DLQ / replay preparation 变化 | `TC-BUS-REC-001`~`004`、`bus-release-recovery` | 可能破坏恢复链和 audit chain |
| Query / projection / read-only output 变化 | `TC-BUS-OUT-001`~`006`、no-write Query tests | 可能导致 Query 反写 truth 或输出 stale marker 错误 |
| outbox relay consumer 变化 | `TC-BUS-OBX-001`~`002`、consumer integration | 可能重复接入或接入未提交 fact |
| RuntimeConfig / ConfigValidator / RuntimeBuilder 变化 | `TC-BUS-CFG-001`~`003`、`bus-config` | 可能破坏 profile、secret ref 或 fail-fast / fail-closed |
| report / artifact / script path 变化 | `TC-BUS-RED-002`、`check_artifact_layout.sh`、`check_report_links.sh` | 可能破坏验收证据 |
| redaction / boundary scan 变化 | `TC-BUS-RED-001`、`bus-release-redaction` | 可能漏掉 forbidden body 或 raw secret |

### 3.2 哪些变更触发全量回归?

| 变更类型 | 全量回归触发条件 |
|---|---|
| `L0-core` shared contract 版本或 path dependency 语义变化 | 影响 Event / Error / Trace / Metadata / ActorRef / outbox boundary |
| P0 Command / Query / Event / Job schema 变化 | 外部契约可能破坏,需全量 contract + release gate |
| 数据所有权或 repository / UoW 语义变化 | 可能影响 truth、audit、history、outbox evidence 的一致性 |
| 状态机新增 / 删除状态或 terminal 语义变化 | 影响 delivery、retry、DLQ、replay、projection |
| runtime graph 装配方式变化 | 影响 config、adapter、worker、job 和 evidence 链 |
| redaction policy 或安全边界变化 | S0 红线,必须全量 release redaction |
| artifact / report 目录规则变化 | 影响 `06` 验收引用,必须全量 report integrity |
| 修复 S0 / S1 缺陷 | 必须执行相关最小回归,并在 release gate 中完成防回归验证 |
| 引入首个 P1 production adapter | 当前 P0 不要求全量 production 行为,但必须全量跑 P0 fake path + P1 adapter smoke |

### 3.3 哪些风险暂不覆盖?

| 风险 | 当前不覆盖原因 | 影响 |
|---|---|---|
| 生产 MQ / durable store 全量行为 | 当前 P0 采用 fake / in-memory 默认路径 | 后续真实 adapter 可能暴露重试、可用性和语义差异 |
| gateway / auth / TLS | L0-bus 不做身份校验入口 | 入口安全缺陷需要 gateway / identity / security 覆盖 |
| 业务 payload 正文语义 | bus 不拥有业务正文真相 | 业务内容错误不会被 bus 解释 |
| governance decision truth | bus 只输出 failure material | 治理审批错误不属于 bus 当前测试失败 |
| observability dashboard / alerting | bus 只输出 trace / tap / audit material | 长期存储、报表和告警阈值后置 |
| SDK 高层开发者体验 | bus 只提供 transport view | client retry、认证封装和便利 API 后置 |
| exactly-once / effectively-once | 当前默认 at-least-once + subscriber idempotency | 业务侧误解语义会造成重复处理风险 |
| config center / hot reload / admin override | P2 非范围 | 运行期配置变更风险后置 |
| multi-backend / multi-tenant 矩阵 | P2 非范围 | 后续复杂部署场景未验证 |

### 3.4 谁接受残余风险?

残余风险按职责角色接受,不是由测试方案作者代为接受。

| 风险类型 | 接受人 / 责任角色 | 接受条件 |
|---|---|---|
| P1 production adapter 风险 | Bus maintainer + adapter owner | P0 fake path 全部通过,adapter smoke 失败不伪装为 P0 已交付 |
| gateway / auth / TLS 风险 | Gateway / identity / security owner | bus 只保存 actor / privileged ref / access audit 接缝 |
| 业务 payload 风险 | 发布方 / 订阅方 owner | bus 测试证明只传 ref / digest / metadata |
| governance decision 风险 | Governance owner | bus 只输出 failure material,不生成 decision body |
| observability 产品风险 | Observability owner | bus 输出 trace / tap / audit material 可消费 |
| SDK 体验风险 | SDK owner | bus transport view 和错误契约稳定 |
| exactly-once 误解风险 | Bus maintainer + subscriber owner | 文档和测试报告明确 at-least-once + subscriber idempotency |
| P2 config / multi-backend 风险 | Bus maintainer + platform / ops owner | P0 明确不交付 config center、hot reload、多后端矩阵 |

### 3.5 哪些风险必须转入验收标准?

| 风险 / 规则 | 转入 `06-验收标准.md` 的方式 |
|---|---|
| S0 一票否决 | 作为 VETO 条款,失败即不通过 |
| S1 P0 主链阻断 | 作为 P0 必过项,不得风险接受 |
| P0 report / artifact 缺失 | 作为验收证据缺失项,不得通过 |
| redaction / raw secret / payload body 泄漏 | 作为安全红线,不得通过 |
| replay 缺 audit chain 仍 ready | 作为恢复链红线,不得通过 |
| Query 写 truth | 作为只读边界红线,不得通过 |
| P1 production adapter 未交付 | 作为非范围说明和残余风险,不得被描述为已验收 |
| exactly-once 非目标 | 作为语义边界说明,防止验收误判 |
| S2 / P1-risk 条件接受 | 作为 risk acceptance,必须有 owner、期限、影响和复验计划 |

---

## 4. 当前文档问题诊断

| 问题 | 表现 | 风险 | 本步处理 |
|---|---|---|---|
| 旧 `05` 缺少回归触发规则 | 改动后不知道该跑哪些测试 | 修复可能引入回归 | 本步按能力变化定义最小回归和全量回归 |
| 残余风险只写“后续处理” | 没有接受人和缓解方式 | 验收时无法裁决 | 本步为每类风险指定责任角色和接受条件 |
| P1/P2 与 P0 混淆 | production adapter、hot reload 等可能被误认为当前交付 | 当前范围失控 | 本步把 P1/P2 写为残余风险或后续专项 |
| 验收承接不清 | 测试方案没有说明哪些风险要进 `06` | 验收标准可能漏掉红线 | 本步定义转入 `06` 的风险和规则 |
| 全量回归触发不清 | S0/S1 修复或 core 契约变化可能只跑局部 | 红线复发 | 本步明确全量回归触发条件 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 价值 |
|---|---|---|---|
| 回归策略 | 未定义 | 变更类型 -> 最小回归 -> 全量触发 | 可执行 |
| 残余风险 | 非范围散落 | 风险、原因、影响、缓解、接受人 | 可验收 |
| P1/P2 | 容易混入当前交付 | 作为 P1-risk / P2-risk 管理 | 范围稳定 |
| 风险接受 | 模糊 | S0/S1 禁止,S2/P1-risk 条件接受 | 可裁决 |
| 验收联动 | 不清楚 | 明确转入 `06` 的 VETO / risk acceptance | 可追溯 |

---

## 6. 测试设计取舍

### 6.1 是否每次变更都跑全量 release gate

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 每次变更都跑全量 release gate | 风险最低 | 反馈慢,不适合作为常规 PR 策略 | 不采用 |
| B. 按能力影响跑最小回归,核心契约 / 状态机 / 安全 / 证据变化触发全量 | 平衡速度和风险 | 需要变更分类 | 采用 |
| C. 只跑改动文件附近测试 | 快 | 容易漏掉跨模块回归 | 不采用 |

### 6.2 是否把 P1/P2 风险写入正式测试方案

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 不写,避免文档变长 | 简洁 | 验收可能误以为无风险 | 不采用 |
| B. 写入残余风险,明确不阻断 P0 和后续归属 | 范围清楚 | 需要维护风险表 | 采用 |
| C. 全部转成 P0 测试项 | 覆盖强 | 当前范围失控 | 不采用 |

### 6.3 是否允许没有接受人的残余风险

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 允许 | 写作简单 | 风险无人负责 | 不采用 |
| B. 每条必须有责任角色;若无实际人名,至少写明职责角色 | 可追踪 | 后续实施需映射到具体 owner | 采用 |
| C. 没有接受人就删除风险 | 文档短 | 隐藏风险 | 不采用 |

---

## 7. 结构化中间产物

### 7.1 回归触发表

| 变更类型 | 最小回归集 | 全量回归触发条件 | 责任人 |
|---|---|---|---|
| core contract reference handling | `TC-BUS-PUB-001`~`004`、`bus-contract` | `L0-core` 契约语义变化或 contract DTO 变化 | Bus maintainer |
| transport semantic mapping | `TC-BUS-SEM-001`~`002`、`TC-BUS-BND-001`~`003` | backend capability model 或 unsupported / unavailable 语义变化 | Bus maintainer |
| delivery lifecycle | `TC-BUS-DLV-001`~`004`、state machine tests | 状态、terminal、history append 规则变化 | Bus maintainer |
| feedback / idempotency | `TC-BUS-FDB-001`~`004`、idempotency suite | idempotency key / digest / conflict 规则变化 | Bus maintainer |
| recovery / replay | `TC-BUS-REC-001`~`004`、`bus-release-recovery` | DLQ、replay preparation、audit chain 条件变化 | Bus maintainer + governance interface owner |
| read-only output / Query | `TC-BUS-OUT-001`~`006`、no-write tests | Query / projection / failure material 输出契约变化 | Bus maintainer + downstream consumer owner |
| outbox relay | `TC-BUS-OBX-001`~`002`、consumer integration | source uniqueness、ack、duplicate 规则变化 | Bus maintainer + publisher interface owner |
| config control plane | `TC-BUS-CFG-001`~`003`、`bus-config` | RuntimeConfig root、validator、runtime graph 装配变化 | Bus maintainer |
| redaction / security boundary | `TC-BUS-RED-001`、`bus-release-redaction` | redaction policy、forbidden body、secret boundary 变化 | Bus maintainer + security owner |
| artifacts / reports | `TC-BUS-RED-002`、report scripts、link checks | artifact / report 路径、evidence index、acceptance handoff 变化 | Bus maintainer + release owner |
| S0 / S1 defect fix | 缺陷区域对应最小回归 + 防回归用例 | 任何 S0 / S1 修复进入 release candidate | Defect owner + Bus maintainer |

### 7.2 残余风险表

| 风险 | 未覆盖原因 | 影响 | 缓解方式 | 接受人 |
|---|---|---|---|---|
| Production MQ / durable store 全量行为 | 当前 P0 使用 fake / in-memory | 真实 adapter 可能暴露后端差异 | P1 adapter smoke + 后续 production adapter 专项 | Bus maintainer + adapter owner |
| Secret provider / KMS / Vault 产品集成 | 当前只测 secret ref / fake provider | 真实 provider 可用性和权限风险后置 | P1 security / ops 专项 | Security owner + ops owner |
| Gateway / auth / TLS | bus 不实现身份校验入口 | 入口安全缺陷由其他仓覆盖 | bus 保留 actor / access audit 接缝 | Gateway / identity owner |
| 业务 payload 正文语义 | bus 不拥有正文真相 | 业务内容错误不由 bus 发现 | payload 只传 ref / digest / metadata,业务仓自测 | Publisher / subscriber owner |
| Governance decision truth | bus 不做审批和策略裁决 | 治理决策错误后置 | failure material 只读输出,governance 仓自测 | Governance owner |
| Observability dashboard / alerting | bus 不做长期存储和报表 | 告警阈值和看板风险后置 | tap / trace / audit material 输出测试 | Observability owner |
| SDK developer experience | bus 不封装高层 client | client retry、认证封装后置 | transport view / error contract 稳定 | SDK owner |
| Exactly-once / effectively-once | 当前非目标 | 业务方误解 delivery 语义 | 文档和验收说明 at-least-once + subscriber idempotency | Bus maintainer + subscriber owner |
| Config center / hot reload / admin override | P2 非范围 | 运行期配置变更风险后置 | 当前 reload request 明确 rejected | Platform / ops owner |
| Multi-backend / multi-tenant matrix | P2 非范围 | 复杂部署差异未验证 | 后续专项测试矩阵 | Platform / ops owner |

### 7.3 风险转验收表

| 风险 / 规则 | `06-验收标准.md` 承接方式 | 阻断级别 |
|---|---|---|
| core / bus 双真相 | VETO | S0 |
| forbidden body / raw secret 泄漏 | VETO | S0 |
| replay 绕过 DLQ / history / audit chain | VETO | S0 |
| Query 写 truth | VETO | S0 |
| P0 gate 无 report / artifact | VETO | S0 |
| F-001~F-008 主链失败 | P0 必过项 | S1 |
| P1 production adapter 未交付 | 非范围 + 残余风险 | P1-risk |
| exactly-once 非目标 | 边界说明 | P1-risk |
| S2 条件接受 | risk acceptance | S2 |

---

## 8. 回填草稿

> 校准来源：
> - `design-calibration/05_test_plan_step_14_regression_risks.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“回归触发表”“残余风险表”和“风险转验收表”小节，了解 L0-bus 变更后如何选择回归范围以及未覆盖风险如何交给验收标准裁决。

本章定义 L0-bus 的回归策略与残余风险。回归策略按能力影响触发,而不是按文件名触发。publication、semantic、delivery、feedback、recovery、read-only output、outbox、config、redaction、reports 等能力变化各自绑定最小回归集;`L0-core` 契约变化、P0 schema 变化、状态机变化、UoW 语义变化、redaction policy 变化、artifact / report 规则变化以及 S0 / S1 修复触发全量或 release 级回归。

当前 P0 不覆盖 production MQ / durable store 全量行为、KMS / Vault 产品集成、gateway / auth / TLS、业务 payload 正文语义、governance decision truth、observability dashboard / alerting、SDK 高层体验、exactly-once、config center / hot reload、多后端 / 多租户矩阵。这些风险必须在残余风险表中保留责任角色和缓解方式,并在 `06-验收标准.md` 中以 VETO、P0 必过项、非范围说明或 risk acceptance 的形式承接。

---

## 9. 待确认事项

当前没有阻塞进入 Step 15 的待确认事项。

| 事项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否每次变更都跑全量 release gate | A. 是;B. 按影响触发;C. 只跑附近测试 | 采用 B | 平衡速度和风险,同时守住全量触发条件 |
| P1/P2 风险是否进入正式 `05` | A. 不写;B. 写入残余风险;C. 升级为 P0 | 采用 B | 防止验收误判,又不扩大当前 P0 |
| 残余风险是否允许无接受人 | A. 允许;B. 必须有职责角色;C. 删除无 owner 风险 | 采用 B | 风险必须可追踪,即使当前还未绑定具体人名 |

---

## 10. 进入下一步条件

| 条件 | 状态 |
|---|---|
| 最小回归触发条件已定义 | 已满足 |
| 全量回归触发条件已定义 | 已满足 |
| 暂不覆盖风险已列出 | 已满足 |
| 每条残余风险已有接受人 / 责任角色 | 已满足 |
| 必须转入验收标准的风险已定义 | 已满足 |
| 回归策略和残余风险可被实施计划 / 验收标准引用 | 已满足 |

结论: 可以进入 Step 15,整理正式测试方案文档。
