# 00 需求 Step 16 · 需求追溯矩阵

> 状态：`completed`
> 前置：Step 7~15
> 回填章节：正式 `00` §16
> 主轴：以功能需求为中心，不在矩阵中新增未讨论的条目。

## 1. 主追溯矩阵

| 功能需求 | 核心能力 | 用户故事 | 业务规则 | 数据归属 | 验收标准 |
|---|---|---|---|---|---|
| `FR-SYNC-001` 形成同步语境 | `CP-SYNC-01` | `US-SYNC-001` | `BR-SYNC-001~002` | session/selection local truth | `AC-SYNC-001` |
| `FR-SYNC-002` 权限/姿态/来源检查 | `CP-SYNC-01` | `US-SYNC-002` | `BR-SYNC-003~004` | owner snapshot/ref | `AC-SYNC-001`, `AC-SYNC-006` |
| `FR-SYNC-003` source 与 working-copy binding | `CP-SYNC-02` | `US-SYNC-003~004` | `BR-SYNC-005/007` | binding/provenance local truth | `AC-SYNC-002`, `AC-SYNC-013` |
| `FR-SYNC-004` metadata 初始化/迁移 | `CP-SYNC-02` | `US-SYNC-003~004` | `BR-SYNC-007/018/019` | `.qs-sync` local truth；forbidden secret/body | `AC-SYNC-002`, `AC-SYNC-014` |
| `FR-SYNC-005` status 只读观察 | `CP-SYNC-03` | `US-SYNC-005` | `BR-SYNC-008~009/021~022` | cursor/Git/fs/metadata/handoff local state | `AC-SYNC-003`, `AC-SYNC-006` |
| `FR-SYNC-006` 增量/全量 materialize | `CP-SYNC-03` | `US-SYNC-006` | `BR-SYNC-006/010` | source snapshot、cursor、mapping、coverage | `AC-SYNC-003`, `AC-SYNC-008` |
| `FR-SYNC-007` 冲突检测 | `CP-SYNC-04` | `US-SYNC-007` | `BR-SYNC-006/011/012` | conflict local truth、source/path refs | `AC-SYNC-004`, `AC-SYNC-011` |
| `FR-SYNC-008` 恢复/幂等/probe | `CP-SYNC-04` | `US-SYNC-008` | `BR-SYNC-013~014/024` | checkpoint/attempt/probe local truth | `AC-SYNC-004`, `AC-SYNC-008` |
| `FR-SYNC-009` Review handoff | `CP-SYNC-05` | `US-SYNC-009` | `BR-SYNC-015~016/024` | handoff attempt、candidate/provenance refs | `AC-SYNC-005`, `AC-SYNC-009` |
| `FR-SYNC-010` ACK/decision 分层 | `CP-SYNC-05` | `US-SYNC-010` | `BR-SYNC-008/015/022` | transport/handoff/decision refs | `AC-SYNC-005`, `AC-SYNC-006` |
| `FR-SYNC-011` 姿态失效处理 | `CP-SYNC-06` | `US-SYNC-011` | `BR-SYNC-004/017/018` | owner posture snapshot/ref、binding invalidation | `AC-SYNC-006`, `AC-SYNC-010` |
| `FR-SYNC-012` 安全诊断/provenance | `CP-SYNC-06` | `US-SYNC-012` | `BR-SYNC-018/019/022` | provenance/ref/diagnostic local association | `AC-SYNC-006`, `AC-SYNC-014`, `AC-SYNC-020` |
| `FR-SYNC-013` 批量预取 | 外围增强 | `US-SYNC-013` | `BR-SYNC-003/004/025` | source snapshot/cursor | `AC-SYNC-016`（不得削弱核心门禁） |
| `FR-SYNC-014` 安全摘要比较 | 外围增强 | `US-SYNC-014` | `BR-SYNC-008/021/022` | local status/ref snapshots | `AC-SYNC-006` |
| `FR-SYNC-015` 归档引用浏览 | 外围增强 | `US-SYNC-015` | `BR-SYNC-004/017/025` | archive posture/ref snapshot | `AC-SYNC-006`, `AC-SYNC-016` |

## 2. 跨能力审计

| 审计项 | 结果 | 说明 |
|---|---|---|
| 故事 → 功能 | pass | `US-SYNC-001~015` 均由至少一项功能承接。 |
| 功能 → 能力 | pass | `FR-SYNC-001~012` 唯一挂载 `CP-SYNC-01~06`；013~015明确外围。 |
| 功能 → 规则 | pass | 每项核心功能至少有选择、owner、dirty、恢复、handoff 或 provenance 规则。 |
| 功能 → 数据 | pass | local truth、owner snapshot、safe ref、forbidden body 均有承接。 |
| 功能 → 接口/依赖 | pass | Step 12 的能力级接口覆盖全部核心功能。 |
| 功能 → NFR | pass | 六类质量约束按节点与全局表覆盖主链。 |
| 功能 → 验收 | pass | 每项功能至少对应核心/规则/数据/NFR 验收。 |
| 边界串线 | pass_with_blockers | 所有 owner 仍外置；`SYNC-UP-001~010` 未闭合。 |
| 矩阵新增项 | pass | 未新增前文未定义的故事、规则、数据或验收。 |

## 3. 漏项检查表

| 检查项 | 结果 |
|---|---|
| 没有故事来源的功能 | 否 |
| 没有能力归属的功能 | 否 |
| 没有规则保护的核心功能 | 否 |
| 没有数据归属的功能 | 否 |
| 没有接口/依赖承接的核心功能 | 否 |
| 没有质量约束的核心能力 | 否 |
| 没有验收条件的功能或硬规则 | 否 |
| 孤儿故事/规则/数据/接口/验收 | 否 |
| 把上游 owner 或技术候选新增为需求项 | 否 |

## 4. 取舍与回填草稿

正式 §16 使用上述六列功能主轴矩阵与漏项检查表；不提前填入后续架构、实现、测试或证据编号。持续 blocker 作为跨能力审计说明保留。

## 5. 自检与门禁

- [x] 主矩阵以 `FR-SYNC-001~015` 为中心。
- [x] 能力、故事、规则、数据、接口/NFR、验收链路无孤儿。
- [x] 外围能力未误作核心前置。
- [x] 未新增或伪关闭上游 blocker。

`Step 16 gate_status = pass_with_blockers`；允许进入 Step 17 正式文档装配。
