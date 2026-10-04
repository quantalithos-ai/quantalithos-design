# L6-bridges 04 Step2：目标、范围和非范围

## 1. Step状态与开工确认

2026-10-04；前序Step1已通过设计静态自检，授权仅全部04；正式04完成即停审。full-restart / single-agent-serial，无代理/并行工具。

| 模块 | 骨架 | 思考 | 写入/草稿 | 自检 | gate_status | next_allowed_action |
|---|---|---|---|---|---|---|
| S2 | done | done | done | done | pass | enter_step03 |

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

Step1§3~9、正式00§4/9/13、02§11/12、03§2/13；配置SOP Step2和书写§5.2。精确读取/使用范围随§7记录，不把旧05/06或Chat作正式输入。

## 3. SOP问题回答

| 问题 | 回答 |
|---|---|
| 1 P0主链 | 完整branch/installation/source选择、受核预算、local consistency、六owner实际消费、private/secret/route、rate/retry/retention/recovery及entry装配；未选分支不伪装可运行。 |
| 2 P1/P2 | Workspace只在明确消费时成为P0条件必填；新平台、多provider扩展、remote配置或hot reload不是本轮开关，须先设计变更。 |
| 3 运维细节 | 账号申请、grant/撤销/轮换执行、实际挂载、网络/TLS发布、冷切换窗口与事故处置留09；本轮仍明确配置约束与责任材料。 |
| 4 实施细节 | crate/pin/driver落码和compatibility/test证据及phase/boundary由07承接，不在04建实施台账或仓。 |
| 5 残余风险 | 产品未选、upstream bridge-specific合同/真实credential/source/admission尚未建立；配置文档完成不证明positive准入。 |

## 4. 当前文档问题诊断

03的“具体值/profile交04”不代表可给权限、retention或retry任意默认。若仅列secret ref与timeout，会遗漏source family排他、同driver提交探测、mandatory观察准入和callback责任。若把所有ref转成可自由URL或provider名，会把配置写成绕过资格的路由器。

## 5. 改动前后对比

| 之前 | 本步后 |
|---|---|
| 配置范围等同“接四平台” | 功能域覆盖全部P0消费，四平台不被承诺等价 |
| 后续扩展含混 | P1条件消费/后续设计与运维实施去向明确 |
| 完成文档可能被误读ready | 设计完成与实际产品/平台/producer资格分开 |

## 6. 设计取舍与复杂度

采用所有既有主链的条件化P0合同，数值只限资源不授业务authority；使用功能模块而非泛runtime/storage/common。非范围必须留责任去向和残余风险。未采用默认启用四平台、外部账号自动映射、产品自动fallback、部署命令或hot配置。

本Step只收范围，不提前建立Step7清单；下一Step拆功能域，并逐域来源/consumer/禁止面停审后跨审。

## 7. 结构化中间产物

### 7.1 目标与范围

| 目标 | 说明 / 优先级 | 交付给下游 |
|---|---|---|
| 让装配结果可判定 | P0：完整选择、required闭包、严格解析及current资格；不自动默认主链 | 03既有builder可消费的JSON映射与load拒绝 |
| 有界安全执行 | P0：并发/批次/private bytes/wait/stop窗口及批准profile | 05边界/取消测试、06有限资源验收 |
| 显式平台来源和凭据 | P0：逐安装driver/source family/route/credential exact binding | 07逐adapter资格切口，09冷切换/轮换约束 |
| 保护local consistency与original | P0：19collection同driver/UoW/CAS/probe、rate/retry/retention引用 | 05crash/unknown切口，09原op恢复边界 |
| 守住内部owner和观察交接 | P0：六owner消费与mandatory准入，Workspace条件必填 | 05/06body-free/拒绝/无权限测试；不造evidence |
| 环境差异透明 | P0：local/ci/test/staging/prod及已选branch，不借fake释放生产 | 05矩阵/07外部blocker；fixture只设计示例 |
| 保留扩展入口 | P1：明确选用Workspace；P2：新平台/多载体/remote/hot须再设计 | 演进风险，不提供自动开关 |

### 7.2 非范围与去向

| 非范围 | 留给哪一层/文档 | 残余风险 / 本轮边界 |
|---|---|---|
| 内部或平台truth/双端授权、业务协议/状态/key算法 | 00~03及正式owner | 文件引用不生成GlobalMember/Turn/Gate/Artifact/Workspace |
| 平台账户、OAuth grant/API Key申请、KMS托管、部署网络/命令 | 09与相关平台/operator | 所有真实材料缺失，token不能放本仓配置demo/日志 |
| 实际产品/pin安装、源码实现、DDL、编译或运行证明 | 07实施及受权真实执行 | 04规定注册资格和拒绝规则，不编造包或实现仓 |
| 具体测试TC/EV、真实run/report/verdict/signoff | 05/06及Observability owner | 本轮只planned切口，not_evaluated |
| 动态配置中心、admin覆盖、热更新、自动routing/fallback | 先回01~03/04重新校准 | 不定义未经承接的API/DTO或任意URL |
| tenant/channel binding自动发现、正文回放缓存、低敏审批放行 | 禁止；如需变化先回需求与owner | 不是延后实施的功能 |
| 07 implementation ledger / planned boundary skeleton | 正式07完成时才创建 | 04不能提前把设计pass写成planned实施完成 |

### 7.3 对详细设计的影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| P0完整主链、条件必填及非范围分流 | 否 | 配置范围语义 | 03§2/13原边界，无修改 | 无回写 |
| 不新增remote/hot/default-fallback | 否 | 维持原actual/current/cold条件 | 无 | 无回写 |

## 8. 回填草稿

正式§2逐字装配§7.1~7.3。本轮P0覆盖现有主链的控制面，Workspace仅选用时必填，其他P1/P2不伪装开关；账号/产品安装/运维/真实测试与证据按非范围去向处理。所有配置值只提供选择或保守限制，不能生成授权、Qualified或业务成功。

## 9. 待确认事项

BR-UP001~009=open、010=reference_only；WS十二开放项及Observability十二affected保原状态；平台/SDK/OAuth/API Key/KMS/router/DB/executor实际资格未建立。不实现、运行项目测试、stage或commit。

## 10. 自检与下一Step条件

实际只读检查：十段齐，§3~8未写占位0、03影响表存在，errors=[]。人工按本Step SOP问题与具名03消费点逐项核对，本步范围/禁止面/来源/失效语义通过设计静态自检；没有配置数值或产品被默认为已经建立资格。

self_review=pass_design_static；下一仅enter_step03。BR-UP/WS/affected及真实产品资格不释放；没有编译、项目测试或平台投递，不stage/commit。
