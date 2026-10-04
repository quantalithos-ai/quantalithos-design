# L6-bridges 04 Step7：CFG-03-001 shutdown最小反校准

## 1. Step状态与开工确认

2026-10-04；04 Step7实际consumer检查发现本地断口，按配置SOP§2.3先记录影响再最小回写03。范围只有runtime预算/停止member/host/guard/配置消费；无新业务type/state/port/owner或产品。思考done，写入done，自检pass_design_static；不进入Step8或正式04。

## 2. 本步输入

正式03 RuntimeExecutionBudget/RuntimeExecutionState完整卡、Step6 infra、Step7 entry shutdown顺序、Step10 M18与Step14 shutdown消费；配置SOP反校准规则及04 Step7影响表。

## 3. SOP问题回答

实际stop事件之前只有启动时构造的shutdown_deadline，State私有budget且begin_shutdown只收unresolved。把文件duration解释为stop-time派生无法到达现有签名；若复用启动时deadline，长期进程会错误立即停止，或把seed当process TTL。需要接收既有RuntimeExecutionBudget的新实例，不新造DTO。

## 4. 当前文档问题诊断

03§13的“每次host实际停止deadline”与§5/member调用入口不闭合。字段存在不等于到达消费点；不能在04注入未声明setter，也不能只写operator应自行处理。

## 5. 改动前后对比

| 前 | 后（拟回写） |
|---|---|
| begin_shutdown只收unresolved；旧budget不能重基deadline | 增加shutdown_budget参数；仍原carrier，检查四资源项同值后替换停止预算 |
| loader可能把启动deadline当停止期限 | startup seed只满足构造；Active不用该deadline作TTL；停止事件actual clock+批准window checked派生 |
| M18只核phase/unknown union | 增加bounded/same-profile/current deadline前置，guard失败零修改；4合法状态对不变 |

## 6. 设计取舍与复杂度

采用consume既有完整budget参数，避免公开mutable setter、增加duration到公共struct或新enum/Clock API。停止host仍按实际同域clock与批准window核有界时长，方法只纯校验/状态迁移；unknown合并不删除。若clock/profile无法核，停止接受新IO并执行宿主安全隔离/取消，不虚构deadline/StoppedLocal或NoEffect；原actual未决保持，后续原恢复。

未采用每call顺延启动deadline（可能无限）、绝对timestamp文件、开始即可15秒TTL、unbounded drain、允许资源tuple在shutdown时偷偷提高。每受影响文件精确小patch，回读/签名与150状态边不变审查后才关闭。

## 7. 结构化中间产物

| 回写位置 | 实际变更 | 状态 |
|---|---|---|
| 正式03§5 / Step6 infra | 一个begin_shutdown成员增shutdown_budget参数；seed仅构造，stop事件重建 | 已回写 |
| 正式03§6 / Step7 entry | actual stop clock/profile→同资源tuple预算→具名调用；失败不造deadline或StoppedLocal | 已回写 |
| 正式03§9 M18 / Step10 technical | bounded/same tuple/actual deadline前置，guard通过才替换budget+unknown并集；合法迁移仍4对 | 已回写 |
| 正式03§13 / Step14 | 精确消费点指向new member，startup seed非TTL | 已回写 |

### 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| CFG-03-001 | 是 | 一个member签名、guard/host/消费说明 | 上表4具名源与正式03 | 已回写 |

## 8. 回填草稿

03已按§7精确回写，04 execution.shutdown_window_millis在停止事件被actual同域clock消费，既有carrier/new budget传递可达；启动seed不作为TTL。原state集合/4对M18迁移/unknown集合保护不变，不增加DTO/业务port/owner或产品。

## 9. 待确认事项

产品/clock/批准profile/current authority仍not_selected/not_established；本地签名闭口不释放真实准入、BR-UP或WS/Observability affected。没有用户产品选择或新外部授权被代作确认。

## 10. 自检与下一Step条件

真实只读反查：四source的修订签名/段落/guard/消费行全部逐字在正式03，旧签名/旧调用0，新增type/状态对0，errors=[]；git diff --check -- projects/L6-bridges/通过。人工核deadline来源、same四tuple、guard先验/零修改与unknown并集，scope当前host和窗口非authority，pass_design_static。

补丁过程：首次source patch hunk顺序逆行失败未落盘；重排后source成功，但正式03标题是五级而非三级，第二patch失败未落盘。回读后按实际标题继续，未误把前一成功source回退或重做；五文档已完整一致。没有编译、项目测试、平台成功、run/evidence或readiness。下一只恢复04 Step7逐域，不进入Step8前置未决。

思考/写入/草稿/自检均done，gate_status=pass，CFG-03-001=closed_design_contract；真实clock/profile/provider资格未建立，外部gate不释放。
