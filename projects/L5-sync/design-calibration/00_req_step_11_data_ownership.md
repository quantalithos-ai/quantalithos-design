# 00 需求 Step 11 · 数据需求与数据归属

> 状态：`completed`
> 前置：`00_req_step_02_scope_boundary.md`、`00_req_step_09_functional_requirements.md`、`00_req_step_10_business_rules.md`
> 回填章节：正式 `00` §11
> 数据类型：真相数据、快照数据、引用数据、禁止保存正文。

## 1. 本步目标

定义 Sync 在需求层真正拥有的局部事实、从 owner 读取的快照、只保留的安全引用，以及任何情况下不得保存的正文或秘密。

## 2. 数据归属总表

| 数据主题 | 类型 | 归属/用途 | 生命周期口径 | 支撑功能/规则 |
|---|---|---|---|---|
| sync session、操作阶段、attempt、幂等关联 | Sync-owned truth | 解释一次本地同步操作及其恢复/诊断关联 | 随本地操作建立、推进、结束或进入 unknown；不等于平台 job | `FR-SYNC-001/008/012`; `BR-SYNC-021` |
| working-copy binding、目标路径安全姿态、工具能力观察 | Sync-owned truth | 绑定本地目录与受限 Git/filesystem seam | 随重绑、失效、环境变化更新；不得隐式跨 source 复用 | `FR-SYNC-003~005`; `BR-SYNC-005/020` |
| source cursor、local applied cursor、generation、mapping、coverage | Sync-owned truth | 记录来源消费和本地 materialization 的局部进度 | 可推进、暂停、失效、重建；不等于 bus delivery 或 Artifact version authority | `FR-SYNC-005~010`; `BR-SYNC-008/010` |
| 冲突记录、影响范围、证据和人工决定关联 | Sync-owned truth | 保护 dirty worktree、来源分叉和 metadata/provenance 不一致 | 冲突解决前保留；解决后仍保留可追溯历史/摘要 | `FR-SYNC-007/008`; `BR-SYNC-011/012` |
| recovery checkpoint、probe、handoff attempt、transport outcome | Sync-owned truth | 支持安全恢复、幂等和外部结果分层 | 可重入、可探测、可标记 unknown；不证明外部最终成功 | `FR-SYNC-008~010`; `BR-SYNC-013~015` |
| `.qs-sync` 受控 provenance metadata | Sync-owned truth（具体形态 pending） | 回链 source/version/path/tool/generation/handoff | 迁移/失效/合法修复需可解释；不得静默伪造/抹除 | `FR-SYNC-003/004/012`; `BR-SYNC-007/018` |
| identity/project/permission/posture 结果 | owner snapshot | 本地操作语境和允许动作的短期可验证输入 | 标注 source/version/freshness；撤销/过期优先 | `FR-SYNC-001/002/011`; `BR-SYNC-003/004/017` |
| Artifact/Workspace source/version/cursor/manifest 摘要 | owner snapshot | 决定可 materialize 的来源、版本和增量语境 | 只能在有效期/来源绑定内使用；不可替代正文/版本 authority | `FR-SYNC-003/006`; `BR-SYNC-005/010` |
| Governance handoff/decision/Archive posture/Observability diagnostic ref | safe reference | 回链外部 owner 结果、姿态和诊断关联 | 只保存最小 ref/摘要和状态；owner 变化时失效 | `FR-SYNC-009~012`; `BR-SYNC-015/017/022` |
| Artifact/Workspace/Review/Archive/Git 正文 | 禁止保存正文 | 不属于 Sync-owned truth | 不进入本地持久化或对外诊断 | `BR-SYNC-019` |
| credential、token、私钥、完整 secret、raw stdout/stderr、evidence/report 正文 | 禁止保存正文 | 敏感内容和正式证据不归 Sync | 不进入 `.qs-sync`、日志、status 或 handoff | `BR-SYNC-019/022` |

## 3. 数据边界说明

1. **真相数据**只限 Sync-local 操作事实；任何 local cursor、session 或 conflict 都不能改写 owner truth。
2. **快照数据**必须带来源、版本/水位、freshness 和受限语境；stale/partial/restricted/unavailable 不得当 current 成功。
3. **引用数据**用于回链和查询，不转移 Project、Artifact、Baseline、Review、Workspace、Archive 或 Git remote ownership。
4. **禁止保存正文**包含外部正文、secret、credential、raw capture 和正式 evidence/report；需要展示时只消费 owner 提供的 redacted/bounded material。

## 4. 数据生命周期与保护

| 生命周期场景 | 需求口径 |
|---|---|
| 初始化/绑定 | 先校验路径、权限、source 和 metadata，再建立 local binding；失败不产生伪造完成。 |
| 增量应用 | source cursor、mapping、local applied cursor 和 materialization 结果分层提交；冲突时保留旧安全状态。 |
| 迁移/重绑 | 必须明确旧 source、目标 source、原因和 provenance 关联；不静默覆盖。 |
| 失效/撤销/归档 | owner posture 优先，相关本地操作转 restricted/invalidated/blocked；不删除来源链。 |
| 清理/保留 | 仅能清理 Sync-owned 可删除局部状态；不得删除受保护 provenance、冲突证据或外部正文引用而不留记录。 |

## 5. 数据归属审计

| 检查项 | 结果 |
|---|---|
| 所有核心功能是否有数据归属 | pass |
| 是否区分 local truth、owner snapshot、safe ref、forbidden body | pass |
| 是否把 `.qs-sync` 固定单文件 schema 写成结论 | 否；形态 pending |
| 是否把 Git commit/remote/ACK 当平台数据 | 否 |
| 是否保存 credential/raw body/evidence/report | 明确禁止 |
| 是否存在数据项没有功能或规则来源 | 否 |

## 6. 取舍与回填草稿、自检

正式 §11 回填四类数据表、生命周期与保护说明；字段、文件分片、加密、存储后端和迁移协议后置到后续设计。

- [x] 真相范围只含 Sync-local facts。
- [x] 外部输入均按 snapshot/ref 表达并要求 freshness/provenance。
- [x] forbidden body/secret 明确列出。
- [x] 数据没有滑入实现 schema。

`Step 11 gate_status = pass_with_blockers`；允许进入 Step 12。
