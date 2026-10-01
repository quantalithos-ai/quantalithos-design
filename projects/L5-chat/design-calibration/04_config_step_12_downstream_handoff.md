# L5-chat 04 · Step 12 定义下游承接

## 1. Step状态与开工确认

> done；gate_status：pass_with_upstream_blockers；2026-10-01。本Step已完成本地设计审查，外部blocked，实施not_started。

| 小阶段 | 输出 | 状态 |
|---|---|---|
| A | SOP回答、具体诊断与取舍 | done |
| B | 结构化产物 | done |
| C | 03影响判定、回填、自检 | done |

复杂度判断：本Step为单一边界/矩阵，可在一份独立产物中收口；长表分批写入。

## 2. 本步输入

当前00～03；已通过Step11及相关前序配置域结论；配置SOP Step12和书写规范§5.12；缺正式provider/SDK/host/预算能力继续登记而不补造。

## 3. SOP问题回答

1. 配置parser/14字段、极值/单位、sixprofiles、宿主独立authority、unknown、配置变更晚到进入05planned cuts。
2. 06不得把fixture/JSON校验当业务集成；绕安全/secret/half-config、ACK确认/unknown resend为否决方向，正式TC/EV后续定义。
3. 07承接批准config source、真实SDK/hostbind、package lock/compat、implemented gates；implementation ledger/boundary skeleton仅07完成创建。
4. 09安排平台批准policy、签名/安装路径与实际credential轮换/rollback操作，04不写命令。
5. 下游不能重定义字段/default/source/units/owner；风险未解不能假通过。

## 4. 当前材料问题诊断

当前05/06/07尚未校准，不能在04注册正式TC/EV或编写运行结果；scripts已有planned参数要与profilecatalog和artifactroot保持一致。

## 5. 改动前后对比

| 位置 | 改前 | 改后 | 依据 |
|---|---|---|---|
| 本Step输入 | 前序仅提供边界/引用，当前主题未闭口 | 独立收口本Step定义下游承接 | 当前03与04 SOP |
| 外部正向能力 | 未绑定 | 继续blocked，不由配置授予资格 | CHAT-UP/WS-UP/host |

## 6. 配置设计取舍

采用配置切口ID与下游阅读映射，均planned；不创建tests/scripts/config真实文件，也不安装运行。

## 7. 结构化中间产物

### 7.1 下游承接

| 下游 | 承接内容 | 本文输入 | 当前门禁 |
|---|---|---|---|
| 05测试方案 | parser/单位/极值、profile、独立binding、失败/revoke/late、nativeOS/AT与预算 | §5～11与下表CUT-CFG；03 CUT-P/S、CONC及planned tests | waiting；不伪TC/run |
| 06验收标准 | unsafeconfig/secret/owner绕过/ACK确认/unknown resend/fixture冒充real的否决方向 | 来源/不变量/失败/成熟度分域 | waiting；实际TC/EV先05闭合 |
| 07实施计划 | loader/source、config1:1map、SDKpublicdist/packagepins、native批准policy、tests/scripts/门禁 | §7/§9/§14与03具体ports/layout | waiting；正式07创建implementationledger/全部planned boundary skeleton |
| 09部署与运维或等价文档 | 实际批准资源文件位置/来源保护、OSorigin/CSP/签名、SDK凭据轮换、变更回滚记录 | §6/§8/§10/§13 | later；无部署命令或真实环境确值 |

### 7.2 配置验证切口（全部planned）

| ID | 最小入口与前置 | 必须验证的正反向边界 |
|---|---|---|
| CUT-CFG-01 | LocalConfigSource.read / 文本与注入plain对象 | nested重复键/语法/comments/prototype/getter均拒绝，无原值泄露 |
| CUT-CFG-02 | ConfigLoader.load/validate，八域14叶子 | required逐缺项；仅三safe缺叶子default，显式false/坏enum不fallback |
| CUT-CFG-03 | 八数字字段逐项min=1/max/0/max+1/noninteger/unsafeint | 单位/有界/不coerce/clamp；超文本保留稿不dispatch |
| CUT-CFG-04 | 六profileId、platform/hostref交叉 | 未知profile/preview host非null/desktopnull/outerversion错拒绝 |
| CUT-CFG-05 | profilealias→正式SDKregistry空/不匹配 | format合法≠bound；没有private API/env/fake fallback |
| CUT-CFG-06 | native trustedorigin/window/probe finite variant | ordinaryJSON不能授权native；hostavailable≠业务available |
| CUT-CFG-07 | root init及一次composition callbacks | 无half-config/root；StrictMode不重复订阅/dispatch |
| CUT-CFG-08 | profile替换/revoke/oldload/lateSDKresult | 新epoch拒旧slot；hide先stop/clear，unknown不resend/confirmed复活 |
| CUT-CFG-09 | consumed/context/cache full/source/版本CAS | 先失效后重取/清理；不能忘dedup仍fresh，pending save不复活 |
| CUT-CFG-10 | safe fork/join/loop图/list接收预算边界 | 超nodes/edges不ready残图；无hidden计数/关系/AT泄露 |
| CUT-CFG-11 | DiagnosticContext mode/sink/session | disabled零IO、六字段拒额外、显式请求、unknown不重送 |
| CUT-CFG-12 | rollback/ref漂移/native批准版本变化 | 旧文件重验、不能自动LKG或恢复旧资格；失败安全blocked |

这些CUT不是正式TC/EV，也不是已执行测试。05必须展开数据/fixture隔离、命令、断言与证据schema；native和真实SDK分别有实际独立验证门禁，不能用web截图替代。Numeric上限是guard，生产端还需要内存/可访问性/图渲染实测与批准。

### 7.3 planned脚本与证据承接

既有03 scripts/gates/run_ci_gate.sh的--config-profile只在未来test runner选择上述catalog的批准fixture/source，不成为App CLI/env覆盖入口；--run-id/--artifact-root等签名仍按03。rawconfig不能嵌入report。真实机器材料只artifacts/test/<run_id>，汇总reports/runs/<run_id>；reports/acceptance及EV必须由05/06/07门禁后真实生成。04不生成这些文件、commit、测试结果或readiness。

## 8. 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 当前Step仅细化已有配置语义/来源/失败策略 | 否 | 配置语义 | 不适用 | 无回写 |

## 9. 回填草稿

正式04 §12仅回填§7已经收口的配置契约；保留来源链接，不复制讨论问题、停审计划或旧授权记录。Step15承担全文章节来源与总审计。

## 10. 待确认事项

CHAT-UP001～009、WS-UP001～008、CHAT-BASE001、native批准权限与SDK实际profile、生产sizing/兼容测试继续open/blocked；具体影响以当前结构化表为准。未来扩展未纳入当前schema；不以未来trigger阻塞当前已闭合本地契约。

## 11. 自检与下一门禁

来源→类别→来源优先级→profile→配置项→加载/安全/变更/失败→03影响已核对本Step适用部分。无raw secret、私有业务IO、权限提升、command重试后门；下游只承接planned测试方向。当前Step local设计门禁通过；下一步读取项目台账、本flow及Step13 SOP/对应书写规范。无代码、应用测试或commit。
