# Step9 U7 状态小循环

## 筛选、问题、诊断与取舍

影子维护、readsurface与业务truth分族；Qualified/Fresh不是approval、entitlement或readiness。puretypedref、QualifiedReadContext、readviews无持久生命周期。

计划：carrier筛选→状态意义→trigger来源→全矩阵/diagram→传播→回填/停审；矩阵尚未落盘。

## 结构化状态与回填

#### QualifiedReferenceSnapshot 状态定义

owner=U7；carrier=QualifiedReferenceSnapshot.state。初始=Qualified；终态=无不可逆终态，仍必须有正式trigger。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Qualified | 本次影子来源匹配，仍需当前authority资格 | 只允许下表本地动作 | 不推外部成功/授权 |
| Stale | 旧影子明确陈旧，敏感/资格不据此放行 | 只允许下表本地动作 | 不推外部成功/授权 |
| Unavailable | 无安全有效读取材料，返回缺口 | 只允许下表本地动作 | 不推外部成功/授权 |

| 从/到 | Qualified | Stale | Unavailable |
|---|---|---|---|
| Qualified | S | A | A |
| Stale | A | S | A |
| Unavailable | A | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Qualified | Stale | RefreshQualifiedReferences / mark_stale(SourceRefreshFailureInput input) | 正式刷新失败仍有旧安全合法摘要；typedfailure不可吞 | 旧切片+failuregap/report，禁positive资格 |
| Qualified | Unavailable | RefreshQualifiedReferences / mark_unavailable(SourceRefreshFailureInput input) | 当前不可见/不支持/无合法安全材料 | 保守no disclosure，不改业务truth |
| Stale | Qualified | RefreshQualifiedReferences / refresh(QualifiedSnapshotInput input) | formalresolver输出本体/type/version/validity完整且current可见 | shadowtyped替换、audit/report及必要projection责任 |
| Stale | Unavailable | RefreshQualifiedReferences / mark_unavailable(SourceRefreshFailureInput input) | 无安全oldmaterial或失去可见性 | explicitgap/no disclosure |
| Unavailable | Qualified | RefreshQualifiedReferences / refresh(QualifiedSnapshotInput input) | 本次formalqualifiedmaterial完整，exactconsumer/scope匹配 | shadow更新，不复活Restrictedversion |

#### 状态流转图

```text
Qualified --[RefreshQualifiedReferences]--> Stale
Qualified --[RefreshQualifiedReferences]--> Unavailable
Stale --[RefreshQualifiedReferences]--> Qualified
Stale --[RefreshQualifiedReferences]--> Unavailable
Unavailable --[RefreshQualifiedReferences]--> Qualified
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- Qualified同姿态刷新也必须formal输入；Unavailable无安全body，禁止仅state成功填空snapshot；typed状态与本体成对读取。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### ReadProjection 状态定义

owner=U7；carrier=ReadProjection.state。初始=Stale；终态=无不可逆终态，仍必须有正式trigger。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Fresh | 声明cursor内的派生切片，可见性仍当前校验 | 只允许下表本地动作 | 不推外部成功/授权 |
| Stale | 落后来源，不变成授权 | 只允许下表本地动作 | 不推外部成功/授权 |
| Rebuilding | 独立重建工作中，不暴露半成品 | 只允许下表本地动作 | 不推外部成功/授权 |
| Unavailable | 当前无合法派生读取，only声明安全fallback | 只允许下表本地动作 | 不推外部成功/授权 |

| 从/到 | Fresh | Stale | Rebuilding | Unavailable |
|---|---|---|---|---|
| Fresh | S | A | A | A |
| Stale | R | S | A | A |
| Rebuilding | A | A | S | A |
| Unavailable | R | R | A | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Fresh | Stale | RebuildMarketReadProjection / mark_stale(ProjectionInvalidationInput input) | 正式committedsourcecursor比projection更新，typedtarget匹配 | 只派生marker，不写business |
| Fresh | Rebuilding | RebuildMarketReadProjection / begin_rebuild(ProjectionRebuildPlanInput input) | kind/scope/typedview keys非空、committedfacts+qualifiedsnapshots完整固定cursor | 持久维护语境/不暴露shadow |
| Stale | Rebuilding | RebuildMarketReadProjection / begin_rebuild(ProjectionRebuildPlanInput input) | 正式typedplan非空且sourcebound | 安全新shadow |
| Unavailable | Rebuilding | RebuildMarketReadProjection / begin_rebuild(ProjectionRebuildPlanInput input) | 新合法plan/currentreadscope具备 | 显式重建不业务恢复 |
| Rebuilding | Fresh | RebuildMarketReadProjection / publish(ProjectionBuildOutcomeInput input) | 完整安全shadow与固定cursor，revision/CAS匹配；无partial掩盖 | 原子替换typedviews+sourcecursor+report |
| Rebuilding | Stale | RebuildMarketReadProjection / mark_stale(ProjectionInvalidationInput input) | 构建期间新committedcursor变化，typedinvalidationsource | 不发布旧shadow为Fresh；后续新scopeplan |
| Rebuilding | Unavailable | RebuildMarketReadProjection / mark_unavailable(ProjectionBuildFailureInput input) | 缺材料/失败/错scope/无safeoutput | gap+完整逐itemreport |
| Fresh | Unavailable | RebuildMarketReadProjection / mark_unavailable(ProjectionBuildFailureInput input) | currentdisclosure/sourceplan不具备合法read | 不泄漏旧缓存 |
| Stale | Unavailable | RebuildMarketReadProjection / mark_unavailable(ProjectionBuildFailureInput input) | plan缺失/空来源或safeview无法构造 | explicitgap，不能旧index修truth |

#### 状态流转图

```text
Fresh --[RebuildMarketReadProjection]--> Stale
Fresh --[RebuildMarketReadProjection]--> Rebuilding
Stale --[RebuildMarketReadProjection]--> Rebuilding
Unavailable --[RebuildMarketReadProjection]--> Rebuilding
Rebuilding --[RebuildMarketReadProjection]--> Fresh
Rebuilding --[RebuildMarketReadProjection]--> Stale
Rebuilding --[RebuildMarketReadProjection]--> Unavailable
Fresh --[RebuildMarketReadProjection]--> Unavailable
Stale --[RebuildMarketReadProjection]--> Unavailable
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- Fresh只固定cursor内派生可读，currentvisibility另核验。Query no statewrite/refresh；snapshot/source变化只造成维护责任与安全读降级，not owner撤销事件。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

## 排除与停审

本部分pure refs/basis/outcomebinding/policy/view无独立生命周期；只读ReadSurfaceKind是query结果分支，不是后台可写business machine。类别/metadata的revision变更不是新lifecycle。stateenum随carrier唯一拥有，不新增外部truth state。每A有Step7/8trigger和Step6成员/typed来源，R穷举非法pair；正式§9摘录。U7 internal stop_review/pass。
