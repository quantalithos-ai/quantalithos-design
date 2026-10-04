# L6-bridges 05 Step8：环境配置

## 1. Step状态与开工确认

2026-10-04；仅05获授权；full-restart / single-agent-serial。此步先骨架，不提前创建未来Step或正式正文。

| 模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|
| environment_config | done | done | done | pass_design_static | pass | step_design_review_complete_external_gates_open | begin_step09_skeleton | 本Step§2/7；实际静态审计 |

### Step内计划

| 小阶段 | 状态 |
|---|---|
| 输入/前序阅读 | done |
| SOP问题回答 | done |
| 当前材料诊断 | done |
| 测试设计取舍 | done |
| 结构化/逐切口停审 | done |
| 复杂度与批次判断 | done |
| 回填草稿 | done |
| 实际自检/下一条件 | done |

## 2. 本步输入

已读Step7/6、04§6环境及角色表/§7/9/12、03§13/14/15，复核SOP Step8七问题/书写§5.8与全局依赖规则compile/runtime/event裁剪。当前目标实现仓未建立，不写部署运行事实。

## 3. SOP问题回答

1. local/ci/test做synthetic机制与保护性边界；test允许另批准actual测试binding；staging做qualified actualseam；prod只无副作用准入/配置拒绝，不跑破坏性测试。
2. 仅core是确定compile计划，SDK条件transitive manifest；六owner/Bus/platform/secret/route/store/executor运行或event资格分别检查。
3. 每04完整JSON/profile/required集合、sourcegroup、secret/ref/current和coldshutdown影响行为；无新增featureflag或skipGate。
4. synthetic ports/driver/source仅test-only；real-like不是actual，production/staging禁fallback。
5. unavailable/缺环境=blocked，不自动fixture替换后报realpass；safe已有材料保留。
6. core唯一path/pkg/lib沿03；SDK未确真实导出前不开条件compile。
7. runtime/event用typed fake/scripts或批准实际service/event replay；不得填ownerCargo路径或raw eventbody回放。

## 4. 当前材料问题诊断

按local/CI/integration名称而忽略04五env会误把集成模式当第六environment。采用五env+mode正交；profile不授内部auth，rawconfig/secret不归档，仅safe配置投影与baseline标记用于关联。

## 5. 改动前后对比

| 模糊项 | 本步规则 |
|---|---|
| integration是独立environment | test或staging的executionmode，04五env不增 |
| mock一律替代实际环境 | mode=synth/real-seam资格分开，blocked不得变pass |
| 本地path连六owner | compile只core确定/SDK条件，owner/Bus runtime/event |
| artifact复制原config | 只safeprojection/批准baseline，不保存opaque secretref/路由/DSN/原值 |

## 6. 测试设计取舍与复杂度

环境/依赖/配置三个表及一个标边图，约110行；仅既有config/接口消费，没有新production设置。每env/依赖分支复核资格与失败姿态，actual版本缺口保留。

## 7. 结构化中间产物

### 7.1 环境与模式矩阵

| 环境/profile | 用途 | 依赖服务/全局类型 | 协作方式 | 配置/数据策略 | 风险/失败处置 |
|---|---|---|---|---|---|
| local | S/D/A/C/R及B/L/P/I/W/J的local机制 | core[compile]；条件SDK[compile]；test-only ports[ runtime/event ] | synthetic/scripted，不外呼 | 04完整JSON，isolated testregistry尚未实现；DS每instancefresh | shape成功非activation；缺fixture实现blocked/not_run |
| ci | PR/静态、case/suite/工具门禁计划 | 同local；无生产服务/真实secret | synthetic-only；closed manifest无缺instance | 固定build/configsafeprojection/run；04 ci profile；safe输出 | 禁真实token/env；缺tool/case/artifact不能绿灯 |
| test | 单元/组件、故障/并发/codec，另批准actualstore/platform测试 | runtime services仅已选scope；core/条件SDK compile | synthetic与real-seam分别suite/artifact；禁止混证 | fixture隔离或批准sandboxpartition；secretprivate解析 | real缺资格blocked，不用synthetic证据补actual |
| staging | qualified实际owner/platform/producer/store/executor/secret/route核验 | 所有selected runtime/event seam实际准入 | real-seam，受控安全testobjects/typed events | staging独立JSON/bootstrap/current与真实pin；原op不跨env | 全selectedrequired齐才IO；当前全部未建资格，blocked |
| prod | only受权配置/准入只读、安全负向；非破坏性回归需另批准 | 完整required并集；非testdriver | 不注入fixture/canary、不跑副作用测试 | 独立批准profile/secret refs，entry validate-only零IO | 本05不授权生产测试；不能copystaging unknown/proof |

executionmode只synthetic/real-seam，环境仍04 local/ci/test/staging/prod。gate config-profile是harness批准profile标记，不能覆盖或新增runtime三参数/JSON键。生产运行/部署交07和未来运维。

### 7.2 依赖类型与协作方式

| 依赖 | 类型/计划来源 | local替身 | actual准入/阻塞 |
|---|---|---|---|
| L0-core | [compile] 根`../quantalithos-core/crates/contracts`；package `core-contracts`；lib `core_contracts` | 不能另造core metadata shadow；按真实导出编译待实现授权 | actual manifest/export pin与本实现仓真实manifest |
| L0-sdk | 条件[compile]，真实manifest可传递Application/Domain/Infra/Bus；正式SDKclient另[runtime] | only已选导出契约，不能预设thinclient裁剪 | path/features/export/pin重新核验，BR-UP-007 open |
| Conversation | [runtime/event] bridge-origin/source/accepted/unknown | qualified_ports显式formalmode/原op脚本 | BR-UP-001；safe材料owner/ref/当前责任合同齐 |
| Identity/Governance | [runtime/event] actor/binding/Policy/Gate/current | 责任kind/basis/visibility/oneuse脚本 | BR-UP-002/003；不当统一human认证/授权fallback |
| Artifact/Workspace | [runtime/event] authorizedref/传播、条件read/export/provenance | 仅selectedbranch safe ref/expiry/permission脚本 | BR-UP-004/005；Workspace未消费不强制，经选即required |
| Observability/Bus | [event/runtime] 正式producer/schema/source/admission/consumer | 安全O01/E04/非递归script，无rawbody replay | BR-UP-006；12affected/实施blocked/wait_design，Bus非业务owner/Cargo路径 |
| 四platform/SDK/OAuth/APIKey | [runtime] perinstallation/method/source capability | 四个平台typed驱动脚本，差异独立 | BR-UP-007/008/009；actualaccount/grant/scope/pin/probe/rate，publicdoc不证明 |
| KMS/secret/route | [runtime] exactprovider/key/revision/purpose/scope/window/route | private内存canaryprovider，仅test-only | 未选产品/真实解析资格，不默认env/token/APIKeyfallback |
| localstore/executor/clock | [runtime] same-driver wholeCAS/journal/fence、scoped非SendFuture与同域clock | qualified_providers标synthetic+deterministicclock/barrier | actualproducts/pin/driver隔离/proof/executorcompatibility waiting |

### 7.3 配置矩阵与baseline

| 配置面 | mandatory变异 | 关联用例 |
|---|---|---|
| 单JSON20域/82key/parse/selector | 每required缺失/duplicate/unknown/type/null，1MiB/depth32/数组1024、selectorASCII@revision | TC-CONFIG-001/002 |
| environment/profile/required/entry | 五env、每branch/callable/hostselected并集、三CLI/ENV同值/异值、validate-only | TC-CONFIG-003/004 |
| installation/source/platform | draft七字段/namespace全等/currentrevision、四source family/mode互斥与method能力 | TC-CONFIG-005/006 |
| secret/private/owner/Gate/attachment/WS | fivepurposes、exactversion/scope/current、mandatory来源缺失、选WS为required | TC-CONFIG-007/008 |
| lane/retry/cursor/retention | 原used/window/allboundsmax、sameepoch/fullcoverage、J05正式expiryproof | TC-CONFIG-009 |
| producer/schema/mandatory/非递归 | 缺一先阻mutation/IO，originalop/resultonly；无producerfallback | TC-CONFIG-010 |
| coldrevision/shutdown/rollback | actualstop-time checkednewbudget同四tuple，unknown并集，不能hot/LKG授权 | TC-CONFIG-011 |
| 全22CF/27F、Query/drift/所有safe出口 | 原04§9.3/11.1逐行finite结果，zeroQuerywrite与敏感无值输出 | TC-CONFIG-012 |

配置baseline记录仅批准的safeprojection（env/profile标记/资源整数/branch与platform有限labels）及其digest，不归档原config/selector/secretref/路由/DSN或其摘要。真实secret/安装refs通过privatequalification审查与safeharnessslot关联，不能把值写report。Step13固定schema/digest/reader规则。

#### 环境拓扑图: 依赖类型与fixture资格

```text
[core actual contracts] --[compile]--> [Bridges S/D/A/C/R/B/L/P/I/W/J]
[SDK selected exports] --[compile: conditional]--> [Bridges manifest]
[owner/platform/store/secret fake ports] --[runtime: synthetic]--> [local/test harness]
[approved owner/platform/store/secret] --[runtime: real-seam]--> [Bridges sandbox]
[formal producer/consumer, optional Bus] --[event: qualified]--> [Bridges E/O]
[each suite safe output] --[runtime: test-only]--> [fixed-run artifact/report tools]
```

关键说明：无owner/Bus pathdependency；synthetic运行只验证局部机制。actual资格未建不能以fixture接线代替，未选分支不强制拉入，上游开放项不因环境表关闭。

## 8. 回填草稿

正式§8取三表/图与说明，环境和mode正交，具体版本只由真实准入材料决定。

## 9. 待确认事项

BR-UP/WS/affected/open不关闭；03原core确定计划与SDK条件说明保留。接下来Step9选脚本必须先具名反校准03，不新实现文件/manifest。

## 10. 自检与进入下一步条件

实际自检：五env×两mode、compile/runtime/event逐边审查；无ownerCargo路径/SDK默认裁剪，12CFG及safe configbaseline完整，actual缺资格不能fixture替代。已运行当前05校准Markdown/编号章节/相对文件链接检查，errors=[]；仅设计静态，不是项目测试或运行证据。

self_review=pass_design_static_external_gates_open；gate_status=pass；gate_reason=step_design_review_complete_external_gates_open；next_allowed_action=begin_step09_skeleton；source_files=本Step§2/7及对应SOP/规范。
formal_document_write_allowed=false；implementation_write_allowed=false；test_execution_allowed=false；commit_required=false。
