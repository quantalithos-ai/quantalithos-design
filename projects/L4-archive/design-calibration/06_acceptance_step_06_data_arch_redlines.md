# Step 6. 定义数据边界与架构红线验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 6\
> 正式回填：`06-验收标准.md` §6\
> 日期：2026-09-13\
> 状态：`completed / twelve_p0_redlines_closed_with_authority_matrix / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 6：定义数据边界与架构红线验收 |
| 目标 | 将数据所有权、八类 source authority、获准材料保管、zero-write、依赖裁剪与 fake/outbound 边界转成可检查 P0 红线 |
| gate_status | `completed / twelve_p0_redlines_closed_with_authority_matrix` |
| gate_reason | 12 条红线均具备正式来源、通过/失败条件、exact TC、EV/report 与 VETO 候选；owner-approved material custody 未被误写为 owner truth ownership |
| next_allowed_action | 按连续授权创建并完成 Step 7 |
| source_files | 正式 00 §10～12/14；01 §4/8～10；02 §5.3/6/10；03 §5～7/10/13～14；04 §8/11；05 §5～6/10/13；Step 2/5 |

| 小阶段 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 6A | Archive-owned / external custody / ref / forbidden 分层 | done | 物理持有不转移 truth ownership |
| 6B | 八类 source-authority matrix | done | 每类 authority/allowed/forbidden/receiver 明确 |
| 6C | 12 条架构红线 | done | 每条可执行、可取证、可否决 |
| 6D | 逐红线停审 | done | 无模糊“边界正确” |
| 6E | 跨红线审计 | done | 无 projection、compile、fake、outbound 污染 |

## 2. 本步边界

本 Step 验收 Archive 一侧的数据与架构行为，不验 owning project 内部实现。`owner-approved archival material` 可以作为不可变 Bundle 内容被保管，但其业务含义、来源版本、授权和 canonical truth ownership 不转移给 Archive；未获准正文、当前 owner 数据库副本、密钥、provider response 和 backend truth 不得进入 Archive-owned truth。

红线实际通过要求 fixed-run evidence 和对应 formal seam；当前只完成规则设计。命中 Step 11 的 VETO 候选时总体必须不通过，不能用功能成功率、风险接受或签署覆盖。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些数据不得由本仓保存？ | 未获准或可变的 L1 业务正文/当前真相、workspace canonical truth、完整 observability backend/audit chain、governance 决定本体的替代真相、owner DB/import state、secret/key/credential/provider response 均不得作为 Archive truth 保存。 |
| 哪些下游不得反向改写真相？ | SDK/product/UI、workspace、observability、storage/KMS/provider、restore receiver feedback、report/telemetry 不能改写 Archive 既有 truth；Archive 同样不能反写任何 L1/workspace/observability truth。 |
| 哪些 projection/cache 不得反写真相？ | workspace projection、Query view、report、runtime telemetry、cache、summary、evidence index 均只读/派生，不能创建 binding、closure、assessment、commit 或恢复结果。 |
| 哪些 P1 能力不得污染 P0？ | selected provider/SDK/product、production-like 组合与 measured NFR 不得替代 P0 authority/finality/redaction/dependency/fake-isolation 证据。 |
| 红线失败是否一票否决？ | 12 条均阻断 P0；跨域写、truth elevation、fail-open、泄漏、compile 偷渡、production fake 或未授权 outbound 进入 Step 11 VETO。 |

## 4. Historical material 诊断与前后对比

| 旧口径 | 问题 | 当前处置 |
|---|---|---|
| “归档复制各域数据” | 未区分获准历史材料、当前真相和所有权 | 建立四层数据分类与逐 source authority |
| workspace snapshot 作为统一入口 | projection 会冒 canonical | 永久 Auxiliary，不能补任一 canonical gap |
| Artifact ref 即完整正文/血缘 | 引用不证明 material closure | 只接受 L1-artifact approved body/ref/lineage material 与 provenance |
| archive log 即审计链 | runtime signal 不等 owner audit material | native record、telemetry、L4-observability material 三层分离 |
| SDK/provider package 直接依赖 | 把 runtime/adapter 伪装 compile | 仅经核验 `L0-core` shared contract 可为 compile candidate |
| fake/Ready/outbound candidate 可发布 | 无 formal authority/finality | production fake 与未解锁 outbound 均为红线 |

## 5. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 获准正文能否入 Bundle | 可以作为不可变、带 provenance 的 archival material custody | 一律禁止任何正文，或把正文变成本仓业务 truth | 归档需材料，但所有权不转移 |
| source schema | 每 owner/class 独立 version/fence/coverage | 强制统一版本比较或通用 schema | authority 属 owner |
| workspace | 永久 Auxiliary | canonical 缺口时 fallback | projection 不是真相 |
| 下游/receiver | 只以 formal adapter/ref/result 协作 | 分享 DB/事务或直接写入 | 防跨域写权 |
| compile | 仅核验 shared contract | 直接依赖 sibling、SDK、provider SDK | 维持层级与可替换性 |
| VETO 编号 | 本 Step 标注候选，Step 11 正式编号 | 在红线 Step 重复正式 VETO registry | 保持 SOP 独立 |

## 6. 结构化中间产物

### 6.1 数据分类与所有权

| 分类 | Archive 允许持有 | owner / 语义 | 禁止变化或解释 |
|---|---|---|---|
| Archive-owned truth | request/job/stage、binding/capture/coverage、Bundle/manifest/closure、assessment、placement/lifecycle/external action、restore plan/item/material binding/handoff/outcome/compensation、result/receipt/report/checkpoint | Archive 定义其本地生命周期 | 不推导 owner/project/governance/global success |
| owner-approved archival material custody | 正式 export/snapshot/body/ref/lineage/audit material，带 authority、version/fence/coverage/provenance/redaction | canonical/business meaning 仍归 owner | 不修改后冒充 owner 新版本，不去除来源或扩张授权 |
| external reference | source/decision/artifact/audit/workspace/location/key/receiver/handoff refs | 外部 owner，Archive 只存关联 | ref 不等正文、授权、commit 或完整性 |
| derived/read-only | Query view、report、runtime telemetry、workspace projection | 派生或外部 owner | 不反写 Archive 或 owner truth |
| forbidden | 未获准正文、当前 owner DB 副本、secret/key/credential/provider response、完整 observability backend truth | 对应 owner | 不进入配置、日志、报告、API error 或本地 truth |

### 6.2 Source-authority matrix

| source/material class | formal authority | Archive 合法形态 | requiredness / capture proof | 恢复边界 | 明确禁止 |
|---|---|---|---|---|---|
| Identity canonical snapshot | `L1-identity` | approved material/ref + owner version/fence/coverage | Canonical/Conditional；逐 binding | identity formal receiver | 身份 truth、成员生命周期写权 |
| Conversation canonical snapshot | `L1-conversation` | approved snapshot/ref + coverage/redaction basis | Canonical/Conditional | conversation formal receiver | 未授权对话正文、当前对话 truth |
| Work/project canonical snapshot | `L1-work` | approved project/WorkItem material/ref + lifecycle decision ref | Canonical | work formal receiver/command | 设置 archived/dissolved/restored |
| Process canonical snapshot | `L1-process` | approved process/activity/checkpoint material/ref | Canonical/Conditional | process formal receiver | 重放、推进或修改 process truth |
| Governance formal material | `L1-governance` 或明确 owner | policy/gate/decision/hold/delete/risk approved material/ref | Canonical/Formal；需 current applicability | governance formal receiver | 自定 retention/hold/delete/risk/批准 |
| Artifact material/lineage | `L1-artifact` | approved body/ref/lineage/baseline material + provenance | Material/Reference；ref set 不等 closure | artifact formal receiver | 拥有通用 Artifact 正文/血缘 truth |
| Workspace projection | `L1-workspace` projection owner | read-only projection ref + revision/generation/coverage | 永远 Auxiliary | 仅其正式受限 receiver（若存在） | 补 canonical gap 或充当任一 L1 truth |
| Audit/evidence material | `L4-observability` | approved redacted material/ref + coverage/redaction basis | Material/Reference | observability formal handoff | 完整审计链/backend truth 声明 |

每个 binding、manifest entry、restore item 必须保留 class、formal authority、requiredness、owner-specific version/fence/coverage 和 provenance。不同 owner opaque version 不比较；一个 target 的 proof 不外推到其他 target。

### 6.3 架构红线验收表

统一人类入口为 `reports/runs/<run_id>/evidence-index.md`；专项报告必须回指同 run raw。

| 红线 ID | P0 红线 | 通过条件 | 失败条件 | exact 证据来源 | VETO 候选 |
|---|---|---|---|---|---|
| `RL-AR-001` | Archive-owned truth 不越界 | store/schema/call graph 仅写 §6.1 Archive-owned truth；owner material 保留 provenance 且不可变 | 保存或修改 owner canonical truth/DB/import state，或 Archive 自定 owner/governance decision | `TC-AR-AUTHORITY-005`,`TC-AR-RESTORE-004～005`; `EV-AR-AUTHORITY-001`,`EV-AR-RESTORE-001`; `dependency-boundary.md` | 跨域写/truth ownership |
| `RL-AR-002` | 八类 source authority 完整且隔离 | 8/8 class 各有 exact owner/requiredness/version/fence/coverage/provenance；不跨 owner 比较 | class/owner mismatch 被接受、通用 schema 填充或缺 basis 仍 Bound/Captured | `TC-AR-AUTHORITY-001～002`,`TC-AR-OBJECT-002`,`TC-AR-STATE-004～005`; `EV-AR-AUTHORITY-001` | 缺 authority 仍成功 |
| `RL-AR-003` | Workspace 永远 Auxiliary | projection 明示 revision/generation/coverage 且只作辅助；canonical 缺失仍 partial/blocked | projection 补任一 canonical source、closure 或恢复材料缺口 | `TC-AR-AUTHORITY-003`,`TC-AR-JOB-002`; `EV-AR-AUTHORITY-001`,`EV-AR-JOB-001` | projection 冒真相 |
| `RL-AR-004` | Artifact/material/ref 边界 | 只消费 L1-artifact approved body/ref/lineage material；ref 与 material closure 分开 | ref 集合、摘要或未经 owner 批准正文被当完整 Artifact/lineage | `TC-AR-AUTHORITY-004`,`TC-AR-RESTORE-002`,`TC-AR-JOB-014`; `EV-AR-AUTHORITY-001`,`EV-AR-RESTORE-001` | ref 冒 material/canonical |
| `RL-AR-005` | Observability 与 Archive review 分层 | runtime telemetry、Archive native records、owner-approved audit/evidence material 三层不互相替代 | 日志/trace/summary 被当 Archive truth、完整审计链或 formal evidence；Archive 建 backend truth | `TC-AR-OBSERVE-001～002`,`TC-AR-AUTHORITY-004`; `EV-AR-OBSERVE-001`,`EV-AR-AUTHORITY-001` | summary/telemetry 冒 evidence |
| `RL-AR-006` | Governance authority 不转移 | retention/hold/delete/risk/lifecycle 仅消费 exact current formal decision；缺失/冲突/hold 零 dispatch | Archive 默认期限、接受风险、批准删除/销毁，或 stale event 代替 current check | `TC-AR-COMMAND-005～006`,`TC-AR-CONSUMER-003`,`TC-AR-JOB-011`; `EV-AR-COMMAND-001`,`EV-AR-CONSUMER-001`,`EV-AR-JOB-001` | fail-open / 自行裁决 |
| `RL-AR-007` | Restore 仅 formal handoff、zero owner write | owner-specific minimum material/ref 经 exact receiver adapter；每 owner/item outcome 独立 | 直接改上游 DB/状态；Bundle 变跨域写权；一 owner outcome 广播 | `TC-AR-AUTHORITY-005`,`TC-AR-RESTORE-001～005`,`TC-AR-JOB-013～017`; `EV-AR-AUTHORITY-001`,`EV-AR-RESTORE-001` | 跨域写/假 restored |
| `RL-AR-008` | Provider/finality 不定义核心语义 | storage/integrity/KMS/compression 只经 typed port；ACK/ref/config 与 commit/Verified 分离 | provider response、ACK、ref 或配置 Ready 直接形成 Committed/Verified/Sealed | `TC-AR-EFFECT-001～004`,`TC-AR-JOB-006～012`,`TC-AR-CONFIG-003`; `EV-AR-EFFECT-001`,`EV-AR-JOB-001`,`EV-AR-CONFIG-001` | fail-open / 假 finality |
| `RL-AR-009` | 依赖类型不偷渡 | actual graph 只有经核验 `L0-core` shared contract 候选；L1/Bus/workspace/observability/SDK/provider 均按 runtime/event/ref/adapter | 任一 sibling、SDK client 或 provider SDK 进入 Archive compile graph，或共享 DB/transaction | `TC-AR-DEPENDENCY-001`; `EV-AR-DEPENDENCY-001`; `dependency-boundary.md` | compile/DB 偷渡 |
| `RL-AR-010` | Fake 与 production 隔离 | fake 仅 test support/profile；production required slot missing/degraded/disabled 不暴露 facade | production fallback fake、fake marker 消失、fake 结果支撑 formal/readiness | `TC-AR-CONFIG-003`,`TC-AR-DEPENDENCY-001`; `EV-AR-CONFIG-001`,`EV-AR-DEPENDENCY-001` | production fake |
| `RL-AR-011` | 敏感与未获准正文零泄漏 | API/error/log/metric/span/native raw/report 对 secret/body/key/digest/location/selector/provider response 扫描 clean | 任一禁止值或可逆 locator 泄漏、用 hash 绕过 denylist | `TC-AR-SECURITY-001`,`TC-AR-CONTRACT-004`,`TC-AR-REPORT-002`; `EV-AR-SECURITY-001`,`EV-AR-REPORT-001`; `redaction-check.md` | 安全泄漏 |
| `RL-AR-012` | 未解锁 outbound 必须不存在 | `AR-HLD-Q-001` 开放期间无正式 outbox/topic/publisher/delivery state/config/evidence；candidate 不进入运行面 | 声称 event ready/published/delivered，或由 response/report 自动生成 outbound | `TC-AR-DEPENDENCY-002`; `EV-AR-DEPENDENCY-001`; `dependency-boundary.md`,`blocked-lanes.md` | 未授权 outbound |

### 6.4 P1 / P2 防污染规则

| 能力 | 允许位置 | 不得替代的 P0 红线 |
|---|---|---|
| selected storage/KMS/integrity/compression | P1 target-specific conformance | RL-002/006/008/010/011 |
| selected SDK/product/UI | P1 consumer compatibility | RL-001/007/009/012 |
| staging-/production-like run | 基线固定后的 P1/P2 confidence | 任一 formal required lane 或 evidence authenticity |
| measured capacity/latency/RTO/RPO/DR | P2，authority 后执行 | structural boundedness、partial visibility、no blind retry |

### 6.5 红线逐项停审记录

| 红线 | 正式来源 | 可检查条件 | TC/EV/report | 越权/VETO 边界 | 停审 |
|---|---|---|---|---|---|
| `RL-AR-001～004` | BR-AR-001/004/009/012；01 §9；03 §7.5 | 是 | fixed | owner/material/projection 不混同 | 通过设计停审 |
| `RL-AR-005～008` | BR-AR-003/005/006/008/011；03 §10/14 | 是 | fixed | telemetry/governance/provider 不造 finality | 通过设计停审 |
| `RL-AR-009～010` | 01 §8；03 §13；04 §9 | 是 | fixed | compile 与 fake isolation | 通过设计停审 |
| `RL-AR-011～012` | 03 §14；04 §8；03 §7.6 | 是 | fixed | 泄漏/outbound 直接候选否决 | 通过设计停审 |

### 6.6 跨红线审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| Archive-owned truth 与 material custody 是否混同 | 否 | §6.1 分层；provenance/不可变/owner 保留 |
| 8 source class 是否全覆盖 | 是，8/8 | 无 universal schema/version 比较 |
| Workspace 是否可能成为 fallback | 否 | 永久 Auxiliary，缺 canonical 仍 blocked |
| Artifact/audit ref 是否冒正文/完整链 | 否 | material/ref/summary 分离 |
| Governance/restore 是否赋予 Archive 决策或写权 | 否 | current decision + formal receiver only |
| compile/runtime/event/ref/adapter/fake 是否混淆 | 否 | actual graph 与 seam 分开验 |
| provider/fake/ACK/config 是否形成假成功 | 否 | typed finality + required formal evidence |
| P1/P2 是否污染 P0 | 否 | 只进入独立组合/测量 |
| 红线与 Step 5 功能 AC 是否冲突 | 否 | 红线加严功能，不改变其功能主语 |
| 是否提前完成 VETO 正式编号 | 否 | 仅登记候选，Step 11 收口 |

## 7. 回填草稿

正式 §6 应回填四层数据分类、八类 source-authority matrix 和 `RL-AR-001～012`。必须明确 owner-approved archival material 的物理保管不转移 canonical truth；workspace 永远 Auxiliary；Archive 对 L1/workspace/observability 零反写；只有核验 shared contract 可 compile；production fake、敏感泄漏和未授权 outbound 为阻断红线。当前没有实际红线检查结果。

## 8. 对上游影响与待确认事项

| 项 | 结论 |
|---|---|
| 00～05 回写 | 无；材料保管/所有权解释与正式 00/01/03 一致 |
| 新 blocker | 无 |
| 持续 blocker | `AR-UP-001～009`,`AR-ARCH-001`,`AR-HLD-Q-001～002`,`AR-03-LOCAL-001～006` 全保留 |
| 待 Step 7/11 | 每个 C/Q/E/J 的 dependency/seam 裁决；8 类 VETO 正式编号 |

## 9. 进入 Step 7 条件

- [x] Archive-owned、owner material、ref、derived 与 forbidden 数据分层可判定。
- [x] 八类 source authority、requiredness、恢复边界与禁止解释完整。
- [x] 12 条红线均有通过/失败、TC、EV、report 和裁决影响。
- [x] 红线逐项停审与跨红线审计无 unresolved 冲突。
- [x] 未将外部缺口、fake 或 P1/P2 写成通过。

当前 `gate_status`：`completed / twelve_p0_redlines_closed_with_authority_matrix`。

`next_allowed_action`：按连续授权创建并完成 Step 7。
