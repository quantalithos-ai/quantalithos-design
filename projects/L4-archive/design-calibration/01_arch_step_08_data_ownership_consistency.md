# 01 架构 Step 8：数据所有权与一致性策略

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应架构 SOP Step 8。

### Step 内计划

- [x] 读取职责、U1~U6、依赖方向和正式 00 source-authority matrix。
- [x] 回答本仓 truth、snapshot/projection、ref、forbidden body/write 与一致性问题。
- [x] 诊断旧材料的 Bundle 全局真相、单一强一致和共享数据库倾向。
- [x] 按 U1~U6 逐单元校准并停审。
- [x] 输出 source-authority matrix、数据归属、一致性策略与跨边界审计。

## 2. SOP 问题回答与历史诊断

1. 本仓 truth：请求/作业、binding/capture/coverage、Bundle/manifest/closure、verification/compatibility、storage/lifecycle execution、restore plan/material/handoff/outcome。
2. 快照/投影：owner-approved snapshot/export material；workspace projection 必须显式标注 projection。它们在 Archive 本地存在不改变 canonical owner。
3. 引用：source/decision/artifact/audit/location/key/handoff/receiver ref，不包含外部正文或 secret。
4. 明确不拥有：任何 owner 当前业务 truth、未经授权正文、Artifact 通用正文/血缘 truth、完整审计链、policy/hold/delete/risk truth、密钥与设施 truth。
5. 强一致边界：同一 Archive 局部状态判断、冻结的 manifest 与成员集合、验证结果与其输入 binding 必须不可歧义。
6. 最终/外部一致边界：owner capture、event feedback、storage commit、receiver outcome 只能逐 source/item 收敛；未知不猜测。

旧材料把 Bundle metadata/blob/schedule/log 一概写“Archive 强一致”，同时用对象存储最终一致和跨域 restore 描述整体成功；这既未定义归属，也压平了阶段。当前先定 owner，再按关系定义一致性，不承诺跨 owner 全局事务。

## 3. 设计取舍

| 方案 | 收益 | 代价 | 结论 |
|---|---|---|---|
| 复制所有 owner 当前模型为 Archive truth | 查询/恢复表面直接 | 双真相、版本漂移、越权正文 | 不采用 |
| 保存 owner-approved immutable snapshot/export 与 authority binding | 可长期验证且不转移 owner | 必须处理版本、coverage 和兼容缺口 | 采用 |
| 单一全局 capture timestamp | 表面简单 | 无法证明跨源可比或一致 | 不采用 |
| per-source fence/coverage + Bundle closure | 失败和覆盖可解释 | 需要保留 partial/conflicting | 采用 |
| 跨域 ACID 恢复 | 表面原子 | Archive 无跨域事务/写权 | 不采用 |
| per-owner handoff/outcome + 核对/补偿 | 保护 owner UoW | 可能长期 partial/unknown | 采用 |

## 4. U1~U6 数据边界逐项停审

| 单元 | Archive-owned truth | snapshot / projection / ref | forbidden body / write | 一致性与失败上限 | 停审 |
|---|---|---|---|---|---|
| U1 Request/Job | request、scope declaration、authority ref binding、job/stage outcome | actor/project/decision ref | project/governance truth；外部状态写入 | 本地 admission/状态变化不可歧义；缺 authority blocked | pass |
| U2 Source Binding | source binding、capture attempt、coverage/status/finding | owner-approved snapshot/export；workspace projection；source/artifact/audit ref | 未获准正文、owner 当前 truth、共享表 | 每 source 冻结自身 version/fence/coverage；不可比即 conflicting/partial | pass_with AR-UP-001/006/007/008 |
| U3 Manifest/Closure | Bundle、manifest、inventory、closure revision/result | manifest 成员指向的获准材料或 ref | slice 业务 truth、governance claim | 对固定声明集和材料集闭包一致；不完整不得 sealed | pass |
| U4 Integrity/Compatibility | verification attempt/result、compatibility/finding history | digest/signature/key/schema refs 与外部反馈 | secret/key/algorithm/source schema truth | 结果必须绑定确定输入；缺失/不支持/失败分态 | pass_with AR-UP-004 |
| U5 Storage/Lifecycle | placement/location binding、tier/execution/retrieval/commit status | storage location ref、governance decision/hold/delete/risk ref | backend truth、policy、secret、授权裁决 | request/ack/commit 分离；未知不得 durable/executed | pass_with AR-UP-003/005 |
| U6 Restore/Handoff | restore request/plan/item、derived owner material、handoff/outcome/retry/compensation record | source/decision/receiver refs；从已验证 snapshot 派生的最小材料 | owner business truth、import state、上游数据库写 | 每 owner/item 独立收敛；commit-unknown 先核对 | pass_with AR-UP-002/009 |

## 5. Source-authority matrix

| 切片/材料类别 | canonical authority | Archive 合法本地形态 | capture / coverage 口径 | 恢复接收边界 | 禁止解释 |
|---|---|---|---|---|---|
| identity | `L1-identity` | approved snapshot/export/ref | owner version/fence/coverage 独立记录 | identity 正式 import/restore/command/handoff seam | Archive 身份 truth 或生命周期写权 |
| conversation | `L1-conversation` | 获准对话 snapshot/export/ref | owner 声明范围与版本；未授权正文不得采集 | conversation 正式 receiver | Bundle 等于当前对话 truth |
| work/project | `L1-work` | Project/ProjectMember/WorkItem approved material/ref、状态 decision ref | owner lifecycle/version/fence/coverage | work 正式 receiver/command seam | Archive 设置 archived/dissolved/restored |
| process | `L1-process` | process/activity/checkpoint approved material/ref | owner checkpoint/version/coverage | process 正式 receiver | Archive 重放或推进过程 |
| governance | `L1-governance`/明确 owner | policy/gate/decision/hold/delete/risk approved material/ref | 决定版本、适用范围、有效性由 owner 声明 | governance 正式 receiver | Archive 解释 policy 或批准处置 |
| artifact | `L1-artifact` | version/lineage/baseline approved material/ref | Artifact owner 声明版本/闭包/coverage | artifact 正式 receiver | ref 集合等于正文或血缘真相 |
| workspace | `L1-workspace` | 明确标注 `projection snapshot/ref` | view revision/generation/source coverage，不得替代 source version | workspace 自身只读/局部状态 receiver（若正式提供） | 任何 L1 canonical truth |
| observability | `L4-observability` | 获准、脱敏 audit/evidence material/ref | material boundary/redaction/coverage 由 owner 声明 | observability 正式 handoff seam | 完整审计链或 backend truth |

## 6. 数据归属总表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| Archive request/job 及阶段结果 | 正式真相数据 | 由本仓定义生命周期与失败姿态 | 不等于业务批准或项目状态。 |
| source binding/capture/coverage | 正式真相数据 | 本仓拥有“采集发生与覆盖判断”的记录 | 记录内容不转移 source truth。 |
| Bundle/manifest/inventory/closure | 正式真相数据 | 本仓拥有包边界、声明集合及闭包判断 | manifest 不定义 L1 业务 schema。 |
| verification/compatibility findings | 正式真相数据 | 本仓拥有每次评估结果及其输入关联 | verified 不等于业务真实性。 |
| storage/lifecycle execution | 正式真相数据 | 本仓拥有位置绑定与执行反馈的记录 | 不拥有 policy、授权或 backend truth。 |
| restore plan/material/handoff/outcome | 正式真相数据 | 本仓拥有恢复交接流程与本地反馈记录 | 不拥有 receiver 的 business commit。 |
| owner-approved archival material | 快照 / 投影数据 | 是在明确 authority/fence/coverage 下保存的历史材料 | 本地不可修改后冒充 source 新版本。 |
| workspace projection material | 快照 / 投影数据 | 明确标注为辅助 projection | 不可填补任一 canonical slice。 |
| source/decision/artifact/audit/location/key/receiver refs | 引用关系数据 | 只保存外部定位与来源关系 | ref 不包含正文、密钥或 owner 结论。 |
| 未获准业务正文、当前 owner truth、完整审计链、secret/backend truth | 明确不拥有的正文 / 真相 | 不进入 Archive-owned truth | 只有 owner-approved archival material 可作为有来源快照进入包。 |

## 7. 一致性策略

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| request admission 与初始 job | 正式真相 ↔ 正式真相 | 本仓局部强一致 | rejected/blocked，不留伪 accepted | 同一请求不能同时被解释为受理和拒绝。 |
| per-source material 与 binding | 快照/引用 ↔ 正式真相 | source-fenced 一致 | partial/stale/missing/conflicting | 只在 owner 自身版本语境内比较。 |
| manifest 声明集与固定材料集 | 正式真相 ↔ 快照/引用 | 闭包一致 | incomplete/overfull/invalid，不 sealed | 不能后补或忽略多余项。 |
| verification result 与被验证输入 | 正式真相 ↔ 快照/引用 | 输入绑定一致 | unknown/unsupported-version/integrity-failed | 结果不能脱离具体 manifest/material revision。 |
| placement intent 与外部 storage feedback | 正式真相 ↔ 外部 ref/feedback | 外部结果最终一致 | pending/unavailable/commit-unknown | 发出请求不等于 durable commit。 |
| lifecycle decision 与 execution | 外部 ref ↔ 正式真相 | 决定适用性一致 | held/blocked/conflicting/unknown | 缺正式决定不执行。 |
| restore plan 与来源/验证/目标 owner | 正式真相 ↔ 快照/引用 | 计划快照一致 | blocked/stale/unsupported/conflicting | 计划形成后不能静默换输入。 |
| handoff intent 与 receiver outcome | 正式真相 ↔ 外部 feedback | per-item 最终一致 | pending/partial/commit-unknown/compensation-required | receiver business commit 保持外部 truth。 |
| 跨 owner 全局归档/恢复 | 多个独立 source/item | 不承诺全局强一致 | 汇总 partial/blocked，保留每项状态 | 汇总不得压平局部差异。 |

## 8. 跨数据边界审计、回填与门禁

| 审计项 | 结果 |
|---|---|
| 双真相 | Archive 只拥有材料边界与执行记录；owner business truth 不转移。 |
| projection 反写 | workspace/owner snapshot 只读，U2/U6 均无反写能力。 |
| 引用正文入仓 | ref 与 owner-approved snapshot 分类明确；secret/未授权 body 禁止。 |
| 一致性误用 | 没有跨 owner 全局事务或全局时间戳承诺。 |
| 失败补偿 | storage/handoff commit-unknown 保留，先核对后 retry/compensation。 |

正式 §9 承接 source-authority matrix、归属表和一致性表。不画简化关系图：三张表已经完整表达 authority→归属→一致性，新增图会重复且易把流程误作数据关系。`gate_status = pass_with_upstream_blockers`；`next_allowed_action = Step 9 关键交互与通信方式`。
