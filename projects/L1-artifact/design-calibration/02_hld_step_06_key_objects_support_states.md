# Step 6 附录 A3. Support State 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件收只读派生状态和外部引用解析状态对象。

---

## A15. `ArtifactDerivedViewState`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and handoff preparation` |
| 对象类型 | state object |
| 结构责任 | 统一表达 preview / report / reconciliation / handoff 材料的派生新鲜度、重建状态和失败解释 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `artifact_derived_view_state_id` | `ArtifactDerivedViewStateId` | 派生状态身份 |
| `derived_view_kind` | `ArtifactDerivedViewKind` | 对应 preview、report 或 reconciliation 哪类派生 |
| `source_cursor` | `ArtifactTruthCursor` | 派生所覆盖的 truth 位置 |
| `freshness_state` | `ArtifactDerivedFreshnessState` | 是否新鲜、过期或重建中 |
| `last_job_outcome` | `ArtifactDerivedJobOutcome` | 最近一次维护结果 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Stale` / `Rebuilding` / `Unavailable` / `Failed` | 已新鲜、已过期、重建中、暂不可用和重建失败 |

| 成员函数 | 作用 |
|---|---|
| `mark_stale(ArtifactStaleReason reason)` | 标记派生结果已过期 |
| `start_rebuild()` | 标记进入重建流程 |
| `mark_rebuilt(ArtifactTruthCursor source_cursor)` | 记录重建后已对齐的 truth 位置 |
| `mark_failed(ArtifactDerivedFailureReason reason)` | 标记最近一次维护失败 |

| 工厂函数 | 作用 |
|---|---|
| `for_view(ArtifactDerivedViewKind derived_view_kind, ArtifactTruthCursor source_cursor)` | 为某类派生视图建立状态对象 |

| 禁止事项 | 说明 |
|---|---|
| 不作为 truth source | 派生状态不能生成或改写 Artifact truth |
| 不以成功交接替代核心成功 | handoff / report 成功与核心同步成立必须分开判断 |

---

## A16. `ExternalReferenceResolutionState`

| 项 | 内容 |
|---|---|
| 所属部分 | `External reference and local mirror support` |
| 对象类型 | state object |
| 结构责任 | 统一表达外部引用、snapshot、safe summary 和 local mirror 的解析、过期和降级状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `external_reference_resolution_state_id` | `ExternalReferenceResolutionStateId` | 外部引用解析状态身份 |
| `reference_kind` | `ArtifactExternalReferenceKind` | 引用的是 definition、work、process、governance、content 还是 automation source |
| `external_ref` | `ExternalSourceRef` | 对应外部稳定引用 |
| `resolution_state` | `ArtifactExternalResolutionState` | 当前解析状态 |
| `captured_snapshot_ref` | `Option<LocalMirrorSnapshotRef>` | 最近一次本地 mirror 快照 |

| 状态 | 作用 |
|---|---|
| `Pending` / `Resolved` / `Stale` / `Unresolved` / `Waiting` / `Failed` | 等待解析、已解析、已过期、无法解析、等待来源恢复和刷新失败 |

| 成员函数 | 作用 |
|---|---|
| `mark_resolved(LocalMirrorSnapshotRef captured_snapshot_ref)` | 标记外部引用已经成功解析 |
| `mark_stale(ReferenceStaleReason reason)` | 标记 mirror 需要刷新 |
| `mark_unresolved(ReferenceUnresolvedReason reason)` | 标记当前无法形成可用镜像 |
| `mark_failed(ReferenceRefreshFailureReason reason)` | 标记最近一次刷新失败 |

| 工厂函数 | 作用 |
|---|---|
| `from_reference(ArtifactExternalReferenceKind reference_kind, ExternalSourceRef external_ref)` | 从外部引用建立解析状态对象 |

| 禁止事项 | 说明 |
|---|---|
| 不补造外部 truth | unresolved / stale 只能降级或等待,不能伪造来源正文 |
| 不替代正式 Artifact truth | local mirror 只服务 intake、review、consumption 和 derived 支撑 |
