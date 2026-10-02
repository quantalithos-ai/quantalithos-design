# Step9 U1 状态小循环

## 筛选、问题、诊断与取舍

资格核验记录与外部主体资格分离；Release主动局部关联失效有typedlookup/来源，不以索引stale假造ownerrevoked。

计划：carrier筛选→状态意义→trigger来源→全矩阵/diagram→传播→回填/停审；矩阵尚未落盘。

## 结构化状态与回填

#### PublisherRelation 状态定义

owner=U1；carrier=PublisherRelation.state。初始=Bound；终态=Released。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Bound | 本地关联有效，后续当前授权仍复核 | 只允许下表本地动作 | 不推外部成功/授权 |
| Released | 本地关联解除，不反写主体truth | 仅历史/终态读取 | 不推外部成功/授权 |

| 从/到 | Bound | Released |
|---|---|---|
| Bound | S | A |
| Released | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Bound | Released | ReleasePublisherRelation / release(AuthorityDispositionInput input) | 正式解除authority，load relation revision | 保存relation、audit/result及依赖verification失效责任 |

#### 状态流转图

```text
Bound --[ReleasePublisherRelation]--> Released
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- 新的Bind建立新relation不把旧Released复活；Bound仍要求每次当前授权，不是human Verified。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

#### SourceVerification 状态定义

owner=U1；carrier=SourceVerification.state。初始=Pending；终态=Invalidated。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| Pending | 待本次核验，不供新positive | 只允许下表本地动作 | 不推外部成功/授权 |
| Qualified | 本次固定输入合格，非永久授权 | 只允许下表本地动作 | 不推外部成功/授权 |
| Blocked | 缺失/不支持/冲突/失败安全缺口 | 只允许下表本地动作 | 不推外部成功/授权 |
| Invalidated | 旧核验不再可用；新核验另建记录 | 仅历史/终态读取 | 不推外部成功/授权 |

| 从/到 | Pending | Qualified | Blocked | Invalidated |
|---|---|---|---|---|
| Pending | S | A | A | A |
| Qualified | R | S | R | A |
| Blocked | R | R | S | A |
| Invalidated | R | R | R | S |

A=下表全部guard成立才允许；S=同意图保持原状态/有据同姿态typed更新，不重发effect，不允许绕gate；R=Reject/no-change，未列pair全部禁止。

| 从 | 到 | 正式触发与domain动作 | guard / 输入来源 | 局部保存与副作用 |
|---|---|---|---|---|
| Pending | Qualified | VerifyPublicationSource / record(QualificationOutcomeInput outcome) | SourceGatePolicy全部正式binding/材料/authority匹配；outcome来自qualifiedport | 固定SourceBinding/MaterialReference+localaudit/result |
| Pending | Blocked | VerifyPublicationSource / record(QualificationOutcomeInput outcome) | 正式缺口/unsupported/missing/conflict，safeoutcome可回指 | 保存Blocked与gap，禁止positive |
| Pending | Invalidated | ReleasePublisherRelation / invalidate(SourceInvalidationInput input) | 关联relation释放的正式局部失效依据 | audit+本地资格不再使用 |
| Qualified | Invalidated | ReleasePublisherRelation / invalidate(SourceInvalidationInput input) | 关联relation已释放且依赖映射typed | audit+失效责任 |
| Blocked | Invalidated | ReleasePublisherRelation / invalidate(SourceInvalidationInput input) | 旧过程依赖releasedrelation | 保留旧gap/history |

#### 状态流转图

```text
Pending --[VerifyPublicationSource]--> Qualified
Pending --[VerifyPublicationSource]--> Blocked
Pending --[ReleasePublisherRelation]--> Invalidated
Qualified --[ReleasePublisherRelation]--> Invalidated
Blocked --[ReleasePublisherRelation]--> Invalidated
```

- 状态owner/carrier不变，复用原intent/result；图只画A，其他方向按矩阵拒绝。
- Pending可在一次Verify UoW内完成，查询不会补Qualified；新核验创建新记录，不让Blocked旧依据原地变合格。
- 每变化typed载体由repo返回revision/CAS后保存；local audit/完整原report与必要work同UoW。03继续闭合参数字段、conditionrefs、非法转换错误与fake/durable parity。

## 排除与停审

本部分pure refs/basis/outcomebinding/policy/view无独立生命周期；只读ReadSurfaceKind是query结果分支，不是后台可写business machine。类别/metadata的revision变更不是新lifecycle。stateenum随carrier唯一拥有，不新增外部truth state。每A有Step7/8trigger和Step6成员/typed来源，R穷举非法pair；正式§9摘录。U1 internal stop_review/pass。
