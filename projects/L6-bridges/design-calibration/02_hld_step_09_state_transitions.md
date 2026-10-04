# L6-bridges 02 Step 9：状态定义与流转

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；回填正式§9。开工：三层门禁已核；通用规范与当前SOP/书写规范已读取；Step6/7/8；SOP9/规范4.9已核对；前序思考/结构/自检pass。未来Step未创建。

| 计划项 | 状态 |
|---|---|
| 前序读取 | done |
| 问题/诊断/取舍 | done / 六部分串行 |
| 结构化/复杂度 | done / 17机及六传播图 |
| 草稿/自检 | done / pass |

## 2. 本步输入

Step6/7/8；SOP9/规范4.9；前序校准文件的回答/诊断/取舍/待确认；项目/flow；通则/中间产物/真相源适用纪律。历史02/README后置扫描。

## 3. SOP 问题回答

问题1~9：逐对象筛17局部stateful主语，3个immutable/readonly对象无独立生命周期；按六U定义状态、允许/禁止、触发到§7/8。相同blocked/indeterminate在不同对象只表示各自阶段，不合GlobalSuccess。每部分状态图/传播图后停审再下一部分。前序反查已补typed Slot以表达未获得资格，执行阶段required guard不变。

### U1 思考

U1按BridgeInstallation独立机、ExternalBinding独立机、ExternalIdentityMapping独立机、ExternalLocationMapping独立机、ExternalMessageMapping独立机筛选；状态字段已存在Step6，触发沿Step7/8当前入口，不由query触发。配置资格、关系授权、三mapping定位必须分离；message mapping的建立依据只能是受权管理或已知owner/平台结果，不允许任意external ID认领内部事实。 同名blocked/accepted仅当前对象阶段；局部允许/禁止与下游传播分开，one-use/unknown/generation不复活。思考done，允许当前U状态写入。

### U2 思考

U2按InboundHandoffRecord独立机筛选；状态字段已存在Step6，触发沿Step7/8当前入口，不由query触发。必须先分平台来源、当前内部资格和owner交接三段。安全material无资格时拒绝/blocked，不能为可恢复性写正文。缺原mapping变化隔离，不冒充create。 同名blocked/accepted仅当前对象阶段；局部允许/禁止与下游传播分开，one-use/unknown/generation不复活。思考done，允许当前U状态写入。

### U3 思考

U3按SafePresentationPlan独立机、DeliveryIntent独立机、DeliveryAttempt独立机、PlatformReceipt无独立机筛选；状态字段已存在Step6，触发沿Step7/8当前入口，不由query触发。plan、effect、attempt和receipt是不同主语；Gate降级是获准的存在性/安全提示/入口能力选择，不是把审批正文截短。投递payload只私有瞬时重建，原plan失效不能在同effect换材料。 同名blocked/accepted仅当前对象阶段；局部允许/禁止与下游传播分开，one-use/unknown/generation不复活。思考done，允许当前U状态写入。

### U4 思考

U4按ExternalActionBinding独立机、CallbackHandoffRecord独立机筛选；状态字段已存在Step6，触发沿Step7/8当前入口，不由query触发。签名只能验证来源；action binding必须把actor责任和target/owner revision绑牢。one-use在局部原子claim后不可复活；owner未知只按原operation查结果，不重新approve。 同名blocked/accepted仅当前对象阶段；局部允许/禁止与下游传播分开，one-use/unknown/generation不复活。思考done，允许当前U状态写入。

### U5 思考

U5按DedupRecord独立机、StreamCursor独立机、GapRecord独立机、DispatchLane独立机、RecoveryRecord独立机筛选；状态字段已存在Step6，触发沿Step7/8当前入口，不由query触发。dedup、stream位置、gap、lane和recovery不能合一个offset表：authority与状态触发不同。恢复job只编排原记录的qualified probe/finalize，缺ref/window/coverage则保持人工出口。 同名blocked/accepted仅当前对象阶段；局部允许/禁止与下游传播分开，one-use/unknown/generation不复活。思考done，允许当前U状态写入。

### U6 思考

U6按SafeAuditRecord无独立机、SafeHandoffRecord独立机、BridgeLocalView无独立机筛选；状态字段已存在Step6，触发沿Step7/8当前入口，不由query触发。局部mutation审计、实际handoff与safe read是不同对象；view没有生命周期，不重写producer事实。只在真实canonical事件存在时交接，平台错误raw string也必须转有限reason。 同名blocked/accepted仅当前对象阶段；局部允许/禁止与下游传播分开，one-use/unknown/generation不复活。思考done，允许当前U状态写入。

## 4. 当前文档问题诊断

不可用一个全局状态连接ACK、owner accepted、platform receipt与consumer accepted，也不能将unknown连retry_wait而省掉权威no-effect proof。one-use claimed不能复活；cursor ready不代表gap全闭合。状态表必须同时给trigger、guard和拒绝路径，图只是表的摘要。

## 5. 改动前后对比

| Step6/8线索 | 本Step收束 | 修正 / 留03 |
|---|---|---|
| 分阶段局部状态 | 17主语允许/禁止及接口触发 | 完整enum/状态guard实现到03 |
| 未受权/未消费阶段 | typed Slot、不伪造已得ref | 已修Step6对应字段；owner输入required不变 |
| mutation传播 | 本地audit/safe view与条件handoff | consumer/evidence仍外部truth |

## 6. 设计取舍

每stateful对象独立机，receipt/audit/view明确无机。各U一传播图说明对既有safe view与条件canonical交接的影响，不画新全局状态。已有“qualified”指current资格snapshot而非未来请求可永久获准；每IO仍重核。17机及六传播图分U/对象写，完整guard/恢复窗口/错误码到03。

## 7. 结构化中间产物

### 状态主语筛选

| 状态主语 | 所属部分 | 是否独立机 | 依据 / 边界 |
|---|---|---|---|
| BridgeInstallation | U1 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| ExternalBinding | U1 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| ExternalIdentityMapping | U1 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| ExternalLocationMapping | U1 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| ExternalMessageMapping | U1 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| InboundHandoffRecord | U2 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| SafePresentationPlan | U3 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| DeliveryIntent | U3 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| DeliveryAttempt | U3 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| PlatformReceipt | U3 | 否 | 不可变known结果分类，unknown不用假receipt |
| ExternalActionBinding | U4 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| CallbackHandoffRecord | U4 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| DedupRecord | U5 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| StreamCursor | U5 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| GapRecord | U5 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| DispatchLane | U5 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| RecoveryRecord | U5 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| SafeAuditRecord | U6 | 否 | 不可变真实mutation安全历史；新记录而非状态机 |
| SafeHandoffRecord | U6 | 是 | 局部可执行阶段/资格或连续性；trigger必须回§7/8 |
| BridgeLocalView | U6 | 否 | 纯只读既有snapshot projection；无refresh/lifecycle |

17机不是全局事务；跨对象传播先由本仓局部UoW维持各自必要关联，跨owner/platform/consumer仍独立。每表“无记录”是该入口的合法构造动作，不是持久化状态；正式enum exact与Slot required-by-state到03。


### U1 状态

#### 状态传播关系图: U1局部变更与安全感知

```text
U1 local qualified mutation (not owner/platform truth)
                      |
                      v
         local UoW subject/result + SafeAuditRecord
                      |
            +---------+---------+
            v                   v
    existing safe state     canonical schema + admission?
    read slice                   |
            |                   yes
            v                    v
    U6 query qualified      SafeHandoffRecord / O01
    visibility projection        |
    (no write/refresh)           v
                          real consumer disposition
                          (not evidence/verdict)
```

关键说明：

- 局部subject/result/audit只按实际mutation写；没有canonical/admission则audit-only，不造every-mutation outbox。
- U6从既有snapshot只读过滤，state变化不让Query主动修复或写审计。
- 跨owner/platform/consumer结果只有其真实来源可以推进；传播本身不证明Turn、delivery或验收。

#### U1状态停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 主语/状态/trigger | pass | BridgeInstallation、ExternalBinding、ExternalIdentityMapping、ExternalLocationMapping、ExternalMessageMapping各回Step6；所有触发在Step7/8，无query mutation |
| 合法/非法与传播 | pass | guard逐边、未列禁止、terminal/one-use不复活；audit/view/条件handoff边界不混 |
| 缺口 | preserved | upstream未释放不得自动正向动作；enum/code/DDL未写，BR-UP不关闭 |


#### ExternalMessageMapping状态定义

归属U1；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| linked | 定位与已知结果回链成立 | 受限（必须满足下列当前guard） | 仅ExternalMessageMapping局部阶段；required refs与下列guard缺失不执行 |
| stale | 当前消费依据失效，历史locator不抹除 | 否（仅受限读取/明确维护） | 仅ExternalMessageMapping局部阶段；required refs与下列guard缺失不执行 |
| tombstoned | 已知受权delete disposition，保原关联；非内部实体删除 | 受限（必须满足下列当前guard） | 仅ExternalMessageMapping局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| 无记录 | linked | C03 / E01 / J01 | 明确管理basis或实际known owner/platform结果；非ACK推断 |
| linked | stale | J05 / C03 | 当前消费依据失效，locator历史保留 |
| linked / stale | tombstoned | E01 / J01 / C03 | 原locator的实际受权delete disposition；迟到known结果仅局部finalize |

##### 禁止迁移

- `tombstoned -> linked（原source复活）`。
- `缺原mapping -> 编辑其他消息或内部实体物理删除`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: ExternalMessageMapping

```text
[new] --known result/basis--> linked
                               | J05/C03(invalidation)
                               v
                             stale
                               | E01/J01/C03(known delete)
                               v
                            tombstoned
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属ExternalMessageMapping，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### ExternalLocationMapping状态定义

归属U1；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| valid | 当前关系可消费 | 受限（必须满足下列当前guard） | 仅ExternalLocationMapping局部阶段；required refs与下列guard缺失不执行 |
| stale | 定位/basis/代际失效 | 否（仅受限读取/明确维护） | 仅ExternalLocationMapping局部阶段；required refs与下列guard缺失不执行 |
| revoked | 局部关系撤销终态 | 否（仅受限读取/明确维护） | 仅ExternalLocationMapping局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| valid | stale | J05 / C03 | parent/thread/target/basis/generation变化或失效 |
| valid / stale | revoked | C03 | 显式受权解除当前关系 |
| 无记录 | valid | C03 | 明确kind/父子位置与owner target资格；新mapping identity |

##### 禁止迁移

- `stale / revoked -> valid（原mapping复活）`。
- `缺thread -> 默换默认channel/Conversation`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: ExternalLocationMapping

```text
[new] --C03(location/target basis)--> valid
                                      | J05/C03(invalidation)
                                      v
                                    stale
                                      | C03(revoke)
                                      v
                                    revoked
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属ExternalLocationMapping，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### ExternalIdentityMapping状态定义

归属U1；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| valid | 当前版本可消费，仍需当前责任/visibility | 受限（必须满足下列当前guard） | 仅ExternalIdentityMapping局部阶段；required refs与下列guard缺失不执行 |
| stale | 依据或代际已不适用 | 否（仅受限读取/明确维护） | 仅ExternalIdentityMapping局部阶段；required refs与下列guard缺失不执行 |
| revoked | 局部关系撤销终态 | 否（仅受限读取/明确维护） | 仅ExternalIdentityMapping局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| valid | stale | J05 / C03 | 依据/generation/kind资格不再适用 |
| valid / stale | revoked | C03 | 显式受权解除；保历史 |
| 无记录 | valid | C03 | account namespace/kind与正式ActorRef两端basis完整；新mapping identity |

##### 禁止迁移

- `stale / revoked -> valid（原mapping复活）`。
- `external account -> 自动GlobalMember`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: ExternalIdentityMapping

```text
[new] --C03(both-end basis)--> valid
                                  | J05/C03(invalidation)
                                  v
                                stale
                                  | C03(revoke)
                                  v
                                revoked
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属ExternalIdentityMapping，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### ExternalBinding状态定义

归属U1；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| pending | 必要依据未齐，不许可动作 | 受限（必须满足下列当前guard） | 仅ExternalBinding局部阶段；required refs与下列guard缺失不执行 |
| active | 当前relation可消费，仍需每次owner gate | 受限（必须满足下列当前guard） | 仅ExternalBinding局部阶段；required refs与下列guard缺失不执行 |
| suspended | 暂停阻新动作与旧排队 | 受限（必须满足下列当前guard） | 仅ExternalBinding局部阶段；required refs与下列guard缺失不执行 |
| revoked | 终态撤销，不能复活原relation | 否（仅受限读取/明确维护） | 仅ExternalBinding局部阶段；required refs与下列guard缺失不执行 |
| expired | 到期不可执行；历史关联保留 | 否（仅受限读取/明确维护） | 仅ExternalBinding局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| pending | active | C02 | 正式当前actor/target/scope/direction/action/basis全部成立 |
| active | suspended | C02 | 受权暂停；generation递增 |
| suspended | active | C02 | 重新显式授权，同target/action含义且新generation |
| pending / active / suspended | revoked | C02 | 正式撤销basis；generation递增；终态 |
| pending / active / suspended | expired | C02 / J05 | 正式期限已到；当前guard即时阻动作，不依赖后台及时性 |

##### 禁止迁移

- `revoked / expired -> active`。
- `active -> owner/平台truth mutation无需另行gate`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: ExternalBinding

```text
pending
  | C02(current explicit basis)
  v
active --C02(suspend)--> suspended
  ^                          |
  +----C02(re-authorize)------+
  | C02(revoke) / J05(expiry)
  v
revoked / expired
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属ExternalBinding，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### BridgeInstallation状态定义

归属U1；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| configured | 配置已接纳但未证明可运行 | 受限（必须满足下列当前guard） | 仅BridgeInstallation局部阶段；required refs与下列guard缺失不执行 |
| qualified | 当前seam资格可用，不证明任何业务提交 | 受限（必须满足下列当前guard） | 仅BridgeInstallation局部阶段；required refs与下列guard缺失不执行 |
| blocked | 能力/secret/route依据缺失 | 否（仅受限读取/明确维护） | 仅BridgeInstallation局部阶段；required refs与下列guard缺失不执行 |
| suspended | 管理停用阻新派发 | 受限（必须满足下列当前guard） | 仅BridgeInstallation局部阶段；required refs与下列guard缺失不执行 |
| retired | 本地配置停用终态，保历史引用 | 否（仅受限读取/明确维护） | 仅BridgeInstallation局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| configured | qualified | J05 | 当前config/capability/route/secret资格完整 |
| configured / qualified | blocked | J05 | 必要seam缺失/撤销/失效；不写raw失败 |
| qualified / configured / blocked | suspended | C01 | 受权配置停用并CAS revision |
| suspended | configured | C01 | 显式重启配置；仍需J05重新资格，非自动激活 |
| blocked | qualified | J05 | 同受权config当前seam资格重新成立 |
| configured / qualified / blocked / suspended | retired | C01 | 受权本地退役；历史ref保留 |

##### 禁止迁移

- `retired -> *`。
- `配置qualified -> 内部binding active或平台已安装`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: BridgeInstallation

```text
configured --J05(current seam)--> qualified
    | J05(missing)                    | J05(revoked)
    v                                 v
  blocked <---J05(missing)-------------+
    | J05(current seam)
    v
qualified --C01(stop)--> suspended
                           | C01(reconfigure)
                           v
                        configured
configured/qualified/blocked/suspended --C01(retire)--> retired
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属BridgeInstallation，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



### U2 状态

#### 状态传播关系图: U2局部变更与安全感知

```text
U2 local qualified mutation (not owner/platform truth)
                      |
                      v
         local UoW subject/result + SafeAuditRecord
                      |
            +---------+---------+
            v                   v
    existing safe state     canonical schema + admission?
    read slice                   |
            |                   yes
            v                    v
    U6 query qualified      SafeHandoffRecord / O01
    visibility projection        |
    (no write/refresh)           v
                          real consumer disposition
                          (not evidence/verdict)
```

关键说明：

- 局部subject/result/audit只按实际mutation写；没有canonical/admission则audit-only，不造every-mutation outbox。
- U6从既有snapshot只读过滤，state变化不让Query主动修复或写审计。
- 跨owner/platform/consumer结果只有其真实来源可以推进；传播本身不证明Turn、delivery或验收。

#### U2状态停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 主语/状态/trigger | pass | InboundHandoffRecord各回Step6；所有触发在Step7/8，无query mutation |
| 合法/非法与传播 | pass | guard逐边、未列禁止、terminal/one-use不复活；audit/view/条件handoff边界不混 |
| 缺口 | preserved | upstream未释放不得自动正向动作；enum/code/DDL未写，BR-UP不关闭 |


#### InboundHandoffRecord状态定义

归属U2；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| verified | 来源验证已成立，未证明内部可交接 | 受限（必须满足下列当前guard） | 仅InboundHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| blocked | 材料/责任/资格缺口 | 否（仅受限读取/明确维护） | 仅InboundHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| quarantined | 伪来源/回环/冲突/缺原关系被隔离 | 否（仅受限读取/明确维护） | 仅InboundHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| handoff_pending | 原operation已局部接管并尝试交owner | 受限（必须满足下列当前guard） | 仅InboundHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| owner_accepted | owner正式accepted fact/manifestation，不等Turn | 是（仅收口/安全读取） | 仅InboundHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| owner_rejected | owner明确拒绝 | 是（仅收口/安全读取） | 仅InboundHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| indeterminate | owner effect未知，仅同operation对账 | 受限（必须满足下列当前guard） | 仅InboundHandoffRecord局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| verified | blocked | E01 | current actor/target/material/digest/basis缺口 |
| verified | quarantined | E01 | 伪造/回环/同key变义/缺原变化mapping |
| verified | handoff_pending | E01 | 全部owner required guard齐，原operation安全durable接管 |
| blocked | handoff_pending | E01经C06/J02 | 明确未交owner/权威no-effect，原safe source窗口+当前完整资格，原operation重放 |
| handoff_pending | owner_accepted / owner_rejected | E01 | 真实owner正式结果，非平台ACK |
| handoff_pending | indeterminate | E01 | 可能已有owner效果但无可核结果 |
| indeterminate | owner_accepted / owner_rejected | J02 | 同原operation权威结果，只finalize |
| indeterminate | handoff_pending | J02 -> E01 | 权威no-effect+当前所有资格+原source窗口才同op续交 |

##### 禁止迁移

- `quarantined -> owner_accepted（无新来源核验）`。
- `ACK -> owner_accepted / Turn`。
- `indeterminate -> 重造新owner operation`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: InboundHandoffRecord

```text
verified --E01(missing)--> blocked
   | E01(conflict/loop)      | qualified safe replay
   +--> quarantined         | E01(original op)
   | E01(all guards)        v
   +----------------> handoff_pending
                         | owner known    | ambiguous
                         v                v
               owner_accepted / owner_rejected     indeterminate
                         ^                | J02(known result)
                         +----------------+
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属InboundHandoffRecord，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



### U3 状态

#### 状态传播关系图: U3局部变更与安全感知

```text
U3 local qualified mutation (not owner/platform truth)
                      |
                      v
         local UoW subject/result + SafeAuditRecord
                      |
            +---------+---------+
            v                   v
    existing safe state     canonical schema + admission?
    read slice                   |
            |                   yes
            v                    v
    U6 query qualified      SafeHandoffRecord / O01
    visibility projection        |
    (no write/refresh)           v
                          real consumer disposition
                          (not evidence/verdict)
```

关键说明：

- 局部subject/result/audit只按实际mutation写；没有canonical/admission则audit-only，不造every-mutation outbox。
- U6从既有snapshot只读过滤，state变化不让Query主动修复或写审计。
- 跨owner/platform/consumer结果只有其真实来源可以推进；传播本身不证明Turn、delivery或验收。

#### U3状态停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 主语/状态/trigger | pass | SafePresentationPlan、DeliveryIntent、DeliveryAttempt、PlatformReceipt各回Step6；所有触发在Step7/8，无query mutation |
| 合法/非法与传播 | pass | guard逐边、未列禁止、terminal/one-use不复活；audit/view/条件handoff边界不混 |
| 缺口 | preserved | upstream未释放不得自动正向动作；enum/code/DDL未写，BR-UP不关闭 |


#### PlatformReceipt无独立状态机

不可变局部安全结果记录；记录已知平台业务响应的来源和locator，不复制平台truth。状态分类只为既有结果/snapshot，不增加transition。来源/写入沿§7/8，反查Step6独立卡；"PlatformReceipt"不被global success合并。


#### DeliveryAttempt状态定义

归属U3；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| claimed | 局部准备，尚未证明外呼 | 受限（必须满足下列当前guard） | 仅DeliveryAttempt局部阶段；required refs与下列guard缺失不执行 |
| in_flight | 可能已有请求离开private adapter | 受限（必须满足下列当前guard） | 仅DeliveryAttempt局部阶段；required refs与下列guard缺失不执行 |
| known_accepted | 存在权威业务结果 | 是（仅收口/安全读取） | 仅DeliveryAttempt局部阶段；required refs与下列guard缺失不执行 |
| known_rejected | 确定业务拒绝，retry仍需无效果basis | 是（仅收口/安全读取） | 仅DeliveryAttempt局部阶段；required refs与下列guard缺失不执行 |
| indeterminate | 请求可能生效，无已知结果 | 受限（必须满足下列当前guard） | 仅DeliveryAttempt局部阶段；required refs与下列guard缺失不执行 |
| not_dispatched | 可证明请求未发出；不由lease过期推定 | 受限（必须满足下列当前guard） | 仅DeliveryAttempt局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| claimed | in_flight | J01 | 当前fence与最终资格已核且请求可能离开private seam |
| claimed | not_dispatched | J01 | 可证明从未IO，非lease失效推断 |
| in_flight | known_accepted / known_rejected | J01 | 已核业务结果来源 |
| in_flight | indeterminate | J01 | timeout/crash/模糊业务结果 |
| claimed | indeterminate | J02 | crash恢复无法证明IO是否已离开 |
| indeterminate | known_accepted / known_rejected / not_dispatched | J02 | 权威同attempt/effect结果或明确no-IO proof，仅finalize |

##### 禁止迁移

- `known_accepted / known_rejected / not_dispatched -> in_flight（复用旧attempt）`。
- `lease expiry -> not_dispatched`。
- `retry -> 换effect`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: DeliveryAttempt

```text
claimed --J01(final check/IO)--> in_flight
   | proven no IO                    | known business result
   v                                 v
not_dispatched                 known_accepted / known_rejected
in_flight --ambiguous/crash--> indeterminate
claimed --J02(unresolved crash)--> indeterminate
indeterminate --J02(known result)--> known_accepted / known_rejected
indeterminate --J02(proven no IO)--> not_dispatched
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属DeliveryAttempt，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### DeliveryIntent状态定义

归属U3；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| planned | effect已局部固化未外呼 | 受限（必须满足下列当前guard） | 仅DeliveryIntent局部阶段；required refs与下列guard缺失不执行 |
| dispatching | 有当前claim并可能外呼 | 受限（必须满足下列当前guard） | 仅DeliveryIntent局部阶段；required refs与下列guard缺失不执行 |
| retry_wait | 原effect已具受限重试资格与等待下界 | 受限（必须满足下列当前guard） | 仅DeliveryIntent局部阶段；required refs与下列guard缺失不执行 |
| platform_accepted | 真实平台业务接受，不等送达/已读 | 是（仅收口/安全读取） | 仅DeliveryIntent局部阶段；required refs与下列guard缺失不执行 |
| known_rejected | 确定终态业务拒绝 | 是（仅收口/安全读取） | 仅DeliveryIntent局部阶段；required refs与下列guard缺失不执行 |
| indeterminate | 可能已有效果，无自动重发 | 受限（必须满足下列当前guard） | 仅DeliveryIntent局部阶段；required refs与下列guard缺失不执行 |
| blocked | 当前资格或材料失效 | 否（仅受限读取/明确维护） | 仅DeliveryIntent局部阶段；required refs与下列guard缺失不执行 |
| unsupported | 无明确能力或合法降级 | 否（仅受限读取/明确维护） | 仅DeliveryIntent局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| planned / retry_wait | dispatching | J01 | 同effect、current basis/secret/capability/原plan/lane/window/预算，等待下界满足 |
| planned / retry_wait | blocked / unsupported | J01 / J05 | 缺资格/必要材料或无能力；未IO不造receipt |
| dispatching | platform_accepted | J01 | 权威business accepted结果 |
| dispatching | known_rejected | J01 | 确定终态拒绝或不具retry资格 |
| dispatching | retry_wait | J01 | 确定无副作用retryable结果+current资格/所有下界/预算/窗口 |
| dispatching | indeterminate | J01 | effect可能已发而结果未知 |
| indeterminate | platform_accepted / known_rejected | J02 | 权威同effect结果，仅finalize |
| indeterminate | retry_wait | J02 | 真实权威no-effect proof，不以NotFound/lease推断；当前全部retry guard |
| blocked | planned | J02 / J05 | 已证从未dispatch/权威no-effect，原plan/source/target/effect仍完整有效且只是临时seam恢复；不得换plan含义 |

##### 禁止迁移

- `platform_accepted / known_rejected / unsupported -> dispatching`。
- `unknown -> 新effect/换target`。
- `binding撤销或stale plan -> 强行retry`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: DeliveryIntent

```text
planned / retry_wait --J01(all guards)--> dispatching
    | J01(missing)
    v
blocked --qualified no-IO proof + original valid plan--> planned
dispatching --known accepted--> platform_accepted
dispatching --terminal rejection--> known_rejected
dispatching --qualified no-effect retryable--> retry_wait
dispatching --ambiguous--> indeterminate
indeterminate --J02(known result)--> platform_accepted / known_rejected
indeterminate --J02(authoritative no-effect + all retry guards)--> retry_wait
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属DeliveryIntent，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### SafePresentationPlan状态定义

归属U3；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| qualified | 当前完整外显资格 | 受限（必须满足下列当前guard） | 仅SafePresentationPlan局部阶段；required refs与下列guard缺失不执行 |
| degraded | owner明确获准无敏感/无动作的安全降级 | 受限（必须满足下列当前guard） | 仅SafePresentationPlan局部阶段；required refs与下列guard缺失不执行 |
| blocked | 任一必要依据缺失 | 否（仅受限读取/明确维护） | 仅SafePresentationPlan局部阶段；required refs与下列guard缺失不执行 |
| stale | 原材料/当前关系不再适用 | 否（仅受限读取/明确维护） | 仅SafePresentationPlan局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| qualified / degraded | stale | J05 / J01 | source/projection/target/basis版本或期限不再适用 |
| qualified / degraded | blocked | J01 / J05 | 当前外显资格失效/不可证明；阻派发 |
| 无记录 | qualified / degraded / blocked | C04 / E02 | 新plan按完整资格/明确获准降级/安全失败结果构造；blocked不许可intent执行 |

##### 禁止迁移

- `blocked / stale -> qualified（原plan自动复活）`。
- `degraded -> 敏感审批body或无basis按钮`。
- `原plan替换source/projection掩盖unknown`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: SafePresentationPlan

```text
[new] --C04/E02(current basis)--> qualified / degraded
                                          | J05/J01(invalidate)
                                          v
                                     stale / blocked
[new authorized plan required; not revival of the old plan]
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属SafePresentationPlan，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



### U4 状态

#### 状态传播关系图: U4局部变更与安全感知

```text
U4 local qualified mutation (not owner/platform truth)
                      |
                      v
         local UoW subject/result + SafeAuditRecord
                      |
            +---------+---------+
            v                   v
    existing safe state     canonical schema + admission?
    read slice                   |
            |                   yes
            v                    v
    U6 query qualified      SafeHandoffRecord / O01
    visibility projection        |
    (no write/refresh)           v
                          real consumer disposition
                          (not evidence/verdict)
```

关键说明：

- 局部subject/result/audit只按实际mutation写；没有canonical/admission则audit-only，不造every-mutation outbox。
- U6从既有snapshot只读过滤，state变化不让Query主动修复或写审计。
- 跨owner/platform/consumer结果只有其真实来源可以推进；传播本身不证明Turn、delivery或验收。

#### U4状态停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 主语/状态/trigger | pass | ExternalActionBinding、CallbackHandoffRecord各回Step6；所有触发在Step7/8，无query mutation |
| 合法/非法与传播 | pass | guard逐边、未列禁止、terminal/one-use不复活；audit/view/条件handoff边界不混 |
| 缺口 | preserved | upstream未释放不得自动正向动作；enum/code/DDL未写，BR-UP不关闭 |


#### CallbackHandoffRecord状态定义

归属U4；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| verified | 完整来源/责任/当前state验证成立 | 受限（必须满足下列当前guard） | 仅CallbackHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| blocked | 缺正式basis或入口合同 | 否（仅受限读取/明确维护） | 仅CallbackHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| rejected | tampered/expired/replayed/cross-target拒绝 | 受限（必须满足下列当前guard） | 仅CallbackHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| owner_pending | one-use已绑定原operation并交接 | 受限（必须满足下列当前guard） | 仅CallbackHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| owner_accepted | owner正式action result，不在本仓制造Decision | 是（仅收口/安全读取） | 仅CallbackHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| owner_rejected | owner明确拒绝 | 是（仅收口/安全读取） | 仅CallbackHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| indeterminate | owner动作未知，只同operation对账 | 受限（必须满足下列当前guard） | 仅CallbackHandoffRecord局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| verified | owner_pending | E03 | 当前全部资格，one-use与原owner operation已原子durable |
| verified | blocked / rejected | E03 | 合同缺口或tampered/expired/replayed/cross-target等 |
| owner_pending | owner_accepted / owner_rejected | E03 | owner二次核验的正式结果 |
| owner_pending | indeterminate | E03 | owner动作效果可能发生而结果未知 |
| indeterminate | owner_accepted / owner_rejected | J02 | 同原owner op权威结果，只finalize |

##### 禁止迁移

- `rejected -> owner_accepted`。
- `indeterminate -> 新approve/新operation`。
- `ACK/defer/按钮变化 -> owner_accepted`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: CallbackHandoffRecord

```text
verified --E03(all guards + one-use)--> owner_pending
   | E03(missing/invalid)                   | real owner result
   v                                       v
blocked / rejected                owner_accepted / owner_rejected
owner_pending --ambiguous--> indeterminate
indeterminate --J02(same-op known result)--> owner_accepted / owner_rejected
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属CallbackHandoffRecord，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### ExternalActionBinding状态定义

归属U4；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| active | 当前可验证action，仍需owner二次核验 | 受限（必须满足下列当前guard） | 仅ExternalActionBinding局部阶段；required refs与下列guard缺失不执行 |
| claimed | 原operation已原子消费one-use，不可复活 | 受限（必须满足下列当前guard） | 仅ExternalActionBinding局部阶段；required refs与下列guard缺失不执行 |
| expired | 到期终态 | 否（仅受限读取/明确维护） | 仅ExternalActionBinding局部阶段；required refs与下列guard缺失不执行 |
| revoked | 撤销终态 | 否（仅受限读取/明确维护） | 仅ExternalActionBinding局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| active | claimed | E03 | all current source/actor/target/action/owner revision/expiry guard，与原operation/record/dedup原子one-use |
| active | expired | E03 / J05 | 真实expiry当前资格判定/维护 |
| active | revoked | C02 / J05 | 当前relation/action正式撤销；不得后续交接 |

##### 禁止迁移

- `claimed / expired / revoked -> active`。
- `callback签名/管理员 -> claimed（无内部basis）`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: ExternalActionBinding

```text
active --E03(all guards + atomic one-use)--> claimed
  | expiry                    | no revival
  v                           v
expired                  [terminal for new actions]
active --C02/J05(revoke)--> revoked
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属ExternalActionBinding，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



### U5 状态

#### 状态传播关系图: U5局部变更与安全感知

```text
U5 local qualified mutation (not owner/platform truth)
                      |
                      v
         local UoW subject/result + SafeAuditRecord
                      |
            +---------+---------+
            v                   v
    existing safe state     canonical schema + admission?
    read slice                   |
            |                   yes
            v                    v
    U6 query qualified      SafeHandoffRecord / O01
    visibility projection        |
    (no write/refresh)           v
                          real consumer disposition
                          (not evidence/verdict)
```

关键说明：

- 局部subject/result/audit只按实际mutation写；没有canonical/admission则audit-only，不造every-mutation outbox。
- U6从既有snapshot只读过滤，state变化不让Query主动修复或写审计。
- 跨owner/platform/consumer结果只有其真实来源可以推进；传播本身不证明Turn、delivery或验收。

#### U5状态停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 主语/状态/trigger | pass | DedupRecord、StreamCursor、GapRecord、DispatchLane、RecoveryRecord各回Step6；所有触发在Step7/8，无query mutation |
| 合法/非法与传播 | pass | guard逐边、未列禁止、terminal/one-use不复活；audit/view/条件handoff边界不混 |
| 缺口 | preserved | upstream未释放不得自动正向动作；enum/code/DDL未写，BR-UP不关闭 |


#### RecoveryRecord状态定义

归属U5；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| requested | 显式受权恢复请求 | 受限（必须满足下列当前guard） | 仅RecoveryRecord局部阶段；required refs与下列guard缺失不执行 |
| probing | 同subject权威查询，网络外局部UoW | 受限（必须满足下列当前guard） | 仅RecoveryRecord局部阶段；required refs与下列guard缺失不执行 |
| resolved | 局部对账结果已记录，不等新的平台送达 | 是（仅收口/安全读取） | 仅RecoveryRecord局部阶段；required refs与下列guard缺失不执行 |
| blocked | 当前资格不满足 | 否（仅受限读取/明确维护） | 仅RecoveryRecord局部阶段；required refs与下列guard缺失不执行 |
| manual | 缺源/不可判，停止自动操作 | 否（仅受限读取/明确维护） | 仅RecoveryRecord局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| requested | probing | J02 / J03 | 原subject/op/effect、current授权/窗口、权威probe/coverage齐 |
| requested / probing | blocked | J02 / J03 | scope/basis失效；不发新effect |
| probing | resolved | J02 / J03 | 已知同op结果finalize、合资格same-effect retry资格或完整gap coverage局部落库 |
| requested / probing | manual | J02 / J03 | 来源/窗口缺失，结果仍未知或不可比 |
| manual / blocked | probing | C06 -> J02 / J03 | 显式维护授权及原subject全资格；不新造原effect |

##### 禁止迁移

- `resolved -> 自动发送新业务effect`。
- `manual -> 伪造known success`。
- `probe -> send/create/approve`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: RecoveryRecord

```text
requested --J02/J03(all authority)--> probing
    | missing authority                  | known resolution
    v                                    v
blocked / manual                       resolved
    | explicit C06 + qualified same subject
    +------------------------------> probing
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属RecoveryRecord，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### DispatchLane状态定义

归属U5；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| ready | 当前lane可候选派发 | 受限（必须满足下列当前guard） | 仅DispatchLane局部阶段；required refs与下列guard缺失不执行 |
| held | 已有本地claim，不保证平台未生效 | 受限（必须满足下列当前guard） | 仅DispatchLane局部阶段；required refs与下列guard缺失不执行 |
| cooldown | 至少等待全部有效下界 | 受限（必须满足下列当前guard） | 仅DispatchLane局部阶段；required refs与下列guard缺失不执行 |
| blocked | 依据/窗口/dependency不成立 | 否（仅受限读取/明确维护） | 仅DispatchLane局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| ready | held | J01 | 局部顺序、依赖已知create、current basis/预算与CAS claim |
| held | ready | J01 / J02 | 仅本地claim有已知释放依据；原unknown依赖不能越过 |
| held / ready | cooldown | J01 | 逐adapter所有有效rate bounds，不缩短平台下界 |
| ready / held / cooldown | blocked | J01 / J05 | 资格/dependency/window失效；已有IO仍原attempt对账 |
| cooldown | ready | J01 | 所有有效bucket/method/global下界已到且预算/资格仍有效 |
| blocked | ready | J02 / J05 | 原scope/dependency/current资格恢复；不消除原unknown effect |

##### 禁止迁移

- `lease expiry -> 外部no-effect或自动重发`。
- `global bucket只限制一个lane`。
- `cooldown缩短下界`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: DispatchLane

```text
ready --J01(current claim)--> held
  ^                            | valid local release
  +----------------------------+
held/ready --rate bounds--> cooldown
                                | all bounds elapsed + current basis
                                v
                              ready
any active state --qualification loss--> blocked
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属DispatchLane，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### GapRecord状态定义

归属U5；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| open | 缺口可见，阻无依据推进 | 受限（必须满足下列当前guard） | 仅GapRecord局部阶段；required refs与下列guard缺失不执行 |
| probing | 受权获取同流coverage | 受限（必须满足下列当前guard） | 仅GapRecord局部阶段；required refs与下列guard缺失不执行 |
| closed | 权威coverage完整覆盖原缺口 | 是（仅收口/安全读取） | 仅GapRecord局部阶段；required refs与下列guard缺失不执行 |
| manual | 来源/窗口缺失，不自动闭合 | 否（仅受限读取/明确维护） | 仅GapRecord局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| open | probing | J03 | current scope/comparator/window及明确原range |
| probing | closed | J03 | authoritative coverage完整覆盖同kind/stream/epoch/range |
| open / probing | manual | J03 | 缺source/window/comparator或coverage不可获得 |
| probing | open | J03 | 权威结果仍有未覆盖子范围，保gap |
| manual | probing | C06 -> J03 | 显式恢复授权与完整来源重新建立，原range不变 |

##### 禁止迁移

- `queue/page/count complete -> closed`。
- `跨epoch/部分coverage -> closed`。
- `closed -> 伪造新回放`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: GapRecord

```text
open --J03(qualified probe)--> probing
  | missing source               | full coverage
  v                              v
manual                         closed
  | explicit qualified C06/J03
  +---------------------> probing
probing --uncovered subrange--> open
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属GapRecord，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### StreamCursor状态定义

归属U5；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| ready | 相同stream/epoch且比较资格有效 | 受限（必须满足下列当前guard） | 仅StreamCursor局部阶段；required refs与下列guard缺失不执行 |
| incomparable | 无法按权威规则比较，保原位置和gap | 受限（必须满足下列当前guard） | 仅StreamCursor局部阶段；required refs与下列guard缺失不执行 |
| blocked | scope/来源/窗口无资格 | 否（仅受限读取/明确维护） | 仅StreamCursor局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| ready | ready | E01 / J01 / J03 | same stream/epoch comparator、相应阶段coverage与expected revision，CAS可比推进 |
| ready | incomparable | E01 / J03 / J05 | epoch变化、comparator缺失或不可比；保旧position/gap |
| ready / incomparable | blocked | J05 / J03 | scope/source/window无资格 |
| incomparable / blocked | ready | J03 | 完整权威epoch/comparator/coverage资格；不可拼旧epoch，新epoch需受权初始化而非跨比较 |

##### 禁止迁移

- `protocol ACK -> owner/delivery position advance`。
- `timestamp/external ID -> comparator`。
- `未覆盖gap -> complete`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: StreamCursor

```text
ready --same epoch + covered CAS--> ready
  | epoch/comparator invalid
  v
incomparable --scope/source missing--> blocked
  | qualified same-stream coverage      | qualified epoch/comparator
  +-------------------+-----------------+
                      v
                     ready
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属StreamCursor，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### DedupRecord状态定义

归属U5；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| reserved | 原operation在本地接管 | 受限（必须满足下列当前guard） | 仅DedupRecord局部阶段；required refs与下列guard缺失不执行 |
| result_recorded | 有原已知局部/owner结果ref | 是（仅收口/安全读取） | 仅DedupRecord局部阶段；required refs与下列guard缺失不执行 |
| indeterminate | 原effect未知 | 受限（必须满足下列当前guard） | 仅DedupRecord局部阶段；required refs与下列guard缺失不执行 |
| expired | 窗口不再允许自动复用/重放；不是新执行许可 | 否（仅受限读取/明确维护） | 仅DedupRecord局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| reserved | result_recorded | C01~06 / E01~04 / J01~05 | 真实原local/owner/平台/consumer结果与关联写入 |
| reserved | indeterminate | E01 / E03 / J01 / J04 | 跨边界效果未知，原op/effect保留 |
| indeterminate | result_recorded | J02 / E04 | 同op权威结果，不改semantic identity |
| reserved / result_recorded / indeterminate | expired | J02 / J03 / J04 / J05 | 相关显式维护入口按正式保留资格判定；未解决effect/gap保安全tombstone/人工限制 |

##### 禁止迁移

- `same key changed meaning -> overwrite`。
- `expired -> reserved（自动重执行）`。
- `任何状态用body hash或空结果证明exactly-once`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: DedupRecord

```text
reserved --real original result--> result_recorded
   | external effect unknown             | qualified retention expiry
   v                                     v
indeterminate                          expired
   | same-op authoritative result
   +-----------------------------> result_recorded
   | qualified retention expiry (keep unknown restrictions)
   v
expired
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属DedupRecord，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



### U6 状态

#### 状态传播关系图: U6局部变更与安全感知

```text
U6 local qualified mutation (not owner/platform truth)
                      |
                      v
         local UoW subject/result + SafeAuditRecord
                      |
            +---------+---------+
            v                   v
    existing safe state     canonical schema + admission?
    read slice                   |
            |                   yes
            v                    v
    U6 query qualified      SafeHandoffRecord / O01
    visibility projection        |
    (no write/refresh)           v
                          real consumer disposition
                          (not evidence/verdict)
```

关键说明：

- 局部subject/result/audit只按实际mutation写；没有canonical/admission则audit-only，不造every-mutation outbox。
- U6从既有snapshot只读过滤，state变化不让Query主动修复或写审计。
- 跨owner/platform/consumer结果只有其真实来源可以推进；传播本身不证明Turn、delivery或验收。

#### U6状态停审

| 审查项 | 结论 | 依据 |
|---|---|---|
| 主语/状态/trigger | pass | SafeAuditRecord、SafeHandoffRecord、BridgeLocalView各回Step6；所有触发在Step7/8，无query mutation |
| 合法/非法与传播 | pass | guard逐边、未列禁止、terminal/one-use不复活；audit/view/条件handoff边界不混 |
| 缺口 | preserved | upstream未释放不得自动正向动作；enum/code/DDL未写，BR-UP不关闭 |


#### BridgeLocalView无独立状态机

只读局部projection；基于既有状态和当前可读资格提供有限视图。状态分类只为既有结果/snapshot，不增加transition。来源/写入沿§7/8，反查Step6独立卡；"BridgeLocalView"不被global success合并。


#### SafeHandoffRecord状态定义

归属U6；状态全集与§6同卡一致，不声明owner/platform实体状态。

| 状态 | 含义 | 是否可进入正常主线 | 说明 |
|---|---|---|---|
| pending | canonical材料及准入具备，尚未交接 | 受限（必须满足下列当前guard） | 仅SafeHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| dispatching | 可能已交给consumer | 受限（必须满足下列当前guard） | 仅SafeHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| consumer_accepted | consumer正式结果，不等evidence/验收 | 是（仅收口/安全读取） | 仅SafeHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| consumer_rejected | consumer明确拒绝 | 是（仅收口/安全读取） | 仅SafeHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| indeterminate | 交接结果未知 | 受限（必须满足下列当前guard） | 仅SafeHandoffRecord局部阶段；required refs与下列guard缺失不执行 |
| blocked | 缺准入/schema/权限或材料失效 | 否（仅受限读取/明确维护） | 仅SafeHandoffRecord局部阶段；required refs与下列guard缺失不执行 |

##### 允许迁移

| 原状态 | 目标状态 | §7/8触发入口 | 必要guard |
|---|---|---|---|
| pending | dispatching | J04 | same canonical材料/op、current admission/window/claim |
| pending / dispatching | blocked | J04 | 准入/schema/材料当前失效，不能造accepted |
| dispatching | consumer_accepted / consumer_rejected | J04 / E04 | 真实正式consumer disposition |
| dispatching | indeterminate | J04 | 交接可能发生而结果未知 |
| indeterminate | consumer_accepted / consumer_rejected | J02 / E04 | 权威同handoff op结果，只finalize |
| indeterminate | pending | J02 / J04 | 权威明确未接纳/no-effect + current重交资格，不从超时/日志推定 |
| blocked | pending | J04 | 原canonical材料/op仍合法，当前准入恢复且无未解决交接unknown |

##### 禁止迁移

- `local audit / HTTP ACK -> consumer_accepted`。
- `consumer_accepted -> retry/new material`。
- `unknown -> blind handoff / fake evidence`。
- 其他未列出的边禁止；缺required safe ref/basis/known结果不以空值推进。

#### 状态流转图: SafeHandoffRecord

```text
pending --J04(current admission)--> dispatching
   | qualification loss                 | real consumer result
   v                                    v
blocked                      consumer_accepted / consumer_rejected
dispatching --ambiguous--> indeterminate
indeterminate --same-op known result--> consumer_accepted / consumer_rejected
indeterminate --authoritative no-effect + current qualification--> pending
```

关键说明：

- 图为上述允许表的核心边摘要；所有同名状态只属SafeHandoffRecord，不形成全局状态。
- trigger均来自§7/8；无query写边，无正文/secret/UI规则或补偿脚本。
- 03须把每条guard、Slot required-by-state、合法/非法边与crash/late-result切口闭口，当前图不是执行证据。



#### SafeAuditRecord无独立状态机

不可变局部安全历史记录；唯一mutation producer阶段记录；不是evidence。状态分类只为既有结果/snapshot，不增加transition。来源/写入沿§7/8，反查Step6独立卡；"SafeAuditRecord"不被global success合并。


### 跨状态闭环审计

| 审查项 | 结论 | 依据 |
|---|---|---|
| 全集/归属 | pass | 17机均回20卡，3不可变/只读无机；同名状态不同主语，不共用GlobalSuccess |
| trigger/flow | pass | C01~06/E01~04/J01~05均在Step7/8；J05关联失效明确由对象owner处理，无new business API |
| Slot/required | pass | 未获得qualification/material/one-use显式Slot；交接/IO/accepted required必须实际来源，不补空/假ref |
| 合法/非法 | pass | 未列边禁止；terminal/one-use不复活；unknown只有原op权威结果/no-effect guard；scope/epoch不串 |
| 传播 | pass | 六局部传播图；audit/view/条件handoff分离；query严格无写 |
| 深度与待确认 | preserved | 无enum实现/DDL/UI规则；guard具体参数/窗口/encoded carriers由03闭口；BR-UP保持原状态 |

已修正Step6阶段slot与无来源cancelled，Step7/8 J05失效传播责任明确；这些是同架构不变量的概要一致性修正，不扩owner职责或解除上游门禁。


本Step反查修正记录：删除DeliveryIntent候选cancelled（Step7/8未建立显式取消入口与resolution载体，不伪造无来源触发）；本地暂停/撤销只阻新派发并保历史/unknown，取消能力不得由实现补。Step6同步删除状态；状态机主语数仍17。安装/attempt/dedup/callback/handoff图修正摘要边，不能从known终态转unknown；允许表是唯一边资格来源。

## 8. 回填草稿

正式§9状态主语筛选、按U排列20主语的17机/3无机、六传播图；采用定义/允许/禁止/图和关键说明，不携入修正过程或停审表。Slot修正已回写Step6，正式§6只读最新卡。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only；不关闭上游。

## 10. 进入下一步条件

六U状态逐一停审与跨审pass；17机/六传播图、全集/触发/guard/禁止/只读边界闭合，前序矛盾已修。gate_status=pass；gate_reason=state_subjects_and_transitions_closed；next_allowed_action=step10_exceptions；formal_backfill_allowed=after_step14；commit_required=false。
