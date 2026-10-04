# L6-bridges 04 Step6：环境与profile矩阵

## 1. Step状态与开工确认

2026-10-04；前序Step5已通过设计静态自检，授权仅全部04；正式04完成即停审。full-restart / single-agent-serial，无代理/并行工具。

| 模块 | 骨架 | 思考 | 写入/草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|
| S6 | done | done | done | done | pass | enter_step07 |

### Step内计划

| 小阶段 | 位置 | 状态 |
|---|---|---|
| 读取输入/前序 | §2 | done |
| SOP问题回答 | §3 | done |
| 当前材料诊断 | §4 | done |
| 设计取舍 | §6 | done |
| 结构化/逐域停审 | §7 | done |
| 复杂度与批次 | §6 | done |
| 回填草稿 | §8 | done |
| 自检/下一条件 | §10 | done |

## 2. 本步输入

Step5来源冲突与entry参数；03§15 planned测试切口、Step14 actual provider/required；七专项环境姿态；配置SOP Step6和书写§5.6。精确读取/使用范围随§7记录，不把旧05/06或Chat作正式输入。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1 五环境 | local/ci/test/staging/prod全部适用，但没有现成可启动profile或事实；environment是材料隔离标签，不是资格。 |
| 2 来源 | 全环境统一单JSON/exact entry参数；bootstrap实际绑定/profile must match environment，禁止隐藏overlay/ENV替换。 |
| 3 外部服务 | local/ci可只解析/隔离fixture；test默认隔离fixture，需真实集成另注册；staging/prod每个已选owner/platform/store/provider必须actual qualified。 |
| 4 敏感项 | 普通文件只ref，五环境均不保存真实token/正文；test-only私有marker在未来隔离测试内存使用，不作为生产token/account证据。 |
| 5 影响测试 | 必须测prod拒fixture、跨环境ref/driver/profile、同store原unknown保持、四平台source mode/权限/retention/准入缺失及只校验无IO。 |

## 4. 当前文档问题诊断

把local默认inmemory扩展到staging/prod会丢失commit unknown和原effect连续性；借Identity/Artifact的ready_for_design_gate或Workspace占位阈值生成Bridges profile不合法。ci“解析通过”也不能验platform/current资格。环境名称不能把未经批准的预算元组变成authority。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| 五环境来源/依赖姿态未细分 | 统一来源，区别fixture/真实actual准入和隔离材料 |
| local可能被当生产默认 | fixture明确不可跨environment或用于真实业务 |
| 外部blocker影响含混 | staging/prod对应资格缺失即受影响branch整体不发布 |

## 6. 设计取舍与复杂度

采用environment与execution profile/actual source的交集校验，示例使用fixture命名空间但不提供运行证据。未采用local标签自动fake、prod默认最小权限或无需Observability规则的audit-only。部署profile由枝/源/预算/绑定组合形成，不引入与JSON平行的profile覆盖文件。

## 7. 结构化中间产物

### 7.1 环境矩阵

| 环境 / profile | 用途 | 配置来源 | 外部依赖 | 敏感配置处理 | 差异 / 交05测试 |
|---|---|---|---|---|---|
| local | 开发解析/隔离fixture；需真实业务另走actual准入 | 单JSON + exact entry + isolated actual test注册 | fixture不能外呼；真实接入不能以local豁免owner/platform资格 | 普通文件仅ref；未来fixture只private nonproduction marker | 字段错型/duplicate/超限/无current注册必须拒；不得默认启动listener |
| ci | 设计schema/loader与未来静态验证 | 受控非生产snapshot，未注册时仅shape检查不是完整准入 | 禁真实secret/账号依赖；future test driver严格test-only | 不通过仓库CI注入真实token；不归档配置值/ref/raw error | 无registry的完整validate返回NotEstablished；schema通过不是readiness |
| test | 未来单元/组件/协议模拟与显式注册集成测试 | 单JSON + test-specific typed registry；每case独立 | deterministic fixture或显式授权的实际测试binding，不混用 | marker/private buffers禁durable/logger；真实集成secret仍provider私有解析 | wholeCAS/known/unknown/cancel/ACK分阶段、四平台差异，未运行 |
| staging | actual预生产资格核验，不跨生产subject | 环境专用受权JSON/批准profile/actual bootstrap | 所有已选owner/platform/secret/route/store/host必须实际合格 | exact-version staging resolver，private use重核 | installation/source family排他、429/all scopes、secret轮换、cold原op恢复；当前blocked |
| prod | 受控业务运行 | 环境专用受权JSON/批准profile/actual注册，没有默认 | 完整required并集，mandatory producer规则和准入；禁止fixture/inmemory fallback | provider/key/revision/purpose/scope/window交集，强制禁日志/证据 | 任何selected缺口阻激活；不是文档完成即prod_ready |

### 7.2 部署角色与测试profile边界

| 角色 / 模式 | required / 入口边界 | 不得发生 |
|---|---|---|
| API host | 03既有C/Q/可选qualified HTTP/safe event handler消费；选择必须与actual dispatcher/transport能力一致 | bin名自动开启Management/Inbound/Callback；body复制到durable |
| Resident worker | 03 qualified resident source与eligible jobs，scoped Future/预算、注册source family/mode一致 | HTTP mode借Gateway host、跨family双消费、spawn detached保raw |
| 五Jobs bin | 同一dispatcher/library；正式invocation provider交原JobInvocationPlan且kind匹配 | CLI/环境生成op/subject/context或恢复变重发；worker绕library |
| --validate-config | 完整静态/registered shape/required/current窗口检查，不启动任何入口或secret值解析 | exit0被当owner accepted/外部送达/readiness；当前未注册demo不宣exit0 |
| 任一未选功能 | file显式null/空集合只表示未消费；不得缺省补capability | 既已selected却以optional避mandatory seam |
| 原operation恢复 | 原environment/store/source/namespace/op/effect/key/result固定，按原subject只读probe | 把staging原unknown拷到prod或换driver/credential/target重试 |

execution profile只批准一组有限资源值与environment/build/scope；不含内部actor/Gate/action/绑定权限。对local/ci/test注册隔离fixture的设计许可不意味着该注册、实现、测试或账号已经存在。四平台准入逐method/install，不承诺同一环境4/4支持。

### 7.3 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 五环境同schema/来源与不同资格隔离 | 否 | 原actual/test-only限制具体化 | 03§13/15，不修改types/flow | 无回写 |
| validation-only无activation、fixture不生产 | 否 | loader/process-local配置语义 | 原composition evaluate不改 | 无回写 |

## 8. 回填草稿

正式§6逐字装配§7.1~7.3；五环境的配置来源相同，差异在typed注册、资格、隔离和真实材料。actual profile/平台/owner/provider不具备时是blocked/NotEstablished，不继承别项目fake默认；任何环境都不得把结构校验当内部或外部成功。

## 9. 待确认事项

BR-UP001~009=open、010=reference_only；WS十二开放项及Observability十二affected保原状态；平台/SDK/OAuth/API Key/KMS/router/DB/executor实际资格未建立。不实现、运行项目测试、stage或commit。

## 10. 自检与下一Step条件

实际只读检查：十段齐，§3~8未写占位0、03影响表存在，errors=[]。人工按本Step SOP问题与具名03消费点逐项核对，本步范围/禁止面/来源/失效语义通过设计静态自检；五环境/三角色/校验模式/跨环境恢复矩阵齐，全部真实执行材料仍缺失。

self_review=pass_design_static；下一仅enter_step07。BR-UP/WS/affected及真实产品资格不释放；没有编译、项目测试或平台投递，不stage/commit。
