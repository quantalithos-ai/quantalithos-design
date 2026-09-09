# Step 11. 配置影响

## 1. Step 状态与计划

- 模式：full-restart / single-agent-serial；输入门禁 pass；思考记录、结构化、回填、自检 done。
- gate_status=pass；gate_reason=本Step静态自检完成；next_allowed_action=由flow串行推进；formal_fill_allowed=step14_only。
- source_files：Step 10；01 §13；项目台账；02 flow；概要SOP对应Step与概要规范对应章节。
- 写入前检查：本项目/本文档授权有效；无正式正文污染；分批规模不限制最终完整性。

### Step 内计划

1. 已读取三层台账、前序及规范。
2. 问题回答、诊断、取舍见§3~6。
3. 先运行装配/资源影响，再不变量与03/04交接，逐组自检
4. 结构化后后置历史审计；从§7摘录回填。
5. 自检通过后更新flow，不把上游pending改为闭合。

## 2. 本步输入

Step 10；01 §13；00 FR-WS-001~010/BR-WS-001~012；01 §6/8/9/10/13/15。前步的问题回答、诊断、取舍、待确认均承接，具体依赖见flow §3。

## 3. SOP 问题回答

1. 受影响的是入口资源预算、owner/bus/store适配绑定、consumer批次与维护worker、分页与候选容量。
2. Domain对象只接受经校验的显式值，不直接读环境/文件；Inbox派生与local意图规则仅间接受预算影响。
3. ownership、no-write、visibility、原子应用、幂等、gap、generation隔离与保留用户意图均不可配置关闭。
4. 03须定义RuntimeConfig/Loader/Validator与adapter/job配置分组、ConfigError和builder注入；本步只点名方向。
5. 默认值、环境变量、JSON、密钥名、填写/生效操作属于04，本步不先造参数。

## 4. 当前文档问题诊断

若用feature开关启用未闭合owner合同，配置会代替正式设计；若以timeout/TTL定义安全允许期，则破坏当前授权边界。

## 5. 改动前后对比

| 改动前 | 改动后 |
|---|---|
| 尚无本Step正式校准；01只有架构约束 | 本Step将已核验边界转为配置影响，不补上游schema |

## 6. 设计取舍

配置只影响绑定、预算和已授权能力的运行选择，不改变业务事实或安全前提；分运行装配与禁止配置化两组，表足够表达，无需重复配置图。

## 7. 结构化中间产物

本Step只识别已存在主体的配置影响，未选择实际语言、数据库或部署产品；04仍未创建，不提前填写参数。

### CFG1 装配与资源影响

#### 问题与依据

来源：01 §13；Step4实现层、Step7入口与Step10异常。

配置从装配层进入adapter/worker和service预算，不由领域对象自行读取。

#### 诊断与取舍

不同source能力未闭合时启用配置不证明schema或authorization已成立；大批次也不允许拆坏原子边界。

采用：按CP与已有port列影响类别，03定义校验注入，04说明配置使用；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 主要部分/接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| CP1 ScopeResolverPort / Provision入口 | 是 | adapter绑定、读取预算、入口资源上限 | AdapterConfig及入口预算校验、构造注入；不可推断scope |
| CP2 OwnerSourcePort / VisibilityResolverPort | 是 | endpoint/secret ref、source选择、timeout/fanout预算 | 正式能力校验、source binding、失败分类；不以配置定义allow |
| CP3 ConsumeSourceChange / WorkspaceStorePort | 是 | 订阅绑定、schema支持范围、批次/并发、去重保留 | ConsumerConfig、store绑定及保留/允许重放兼容检查 |
| CP4 InboxProjector | 间接受影响 | 来源已启用能力及应用批次 | 只注入核验输入，不读取配置改变attention规则 |
| CP5 LocalAttentionService | 间接受影响 | 命令预算、store资源与局部结果保留 | local与source保留分别校验，禁止意图随generation清理 |
| CP6 RecoveryService / RecoverySourcePort | 是 | candidate容量、并发/批次、worker预算、已授权恢复选择 | JobConfig/AdapterConfig与状态前提校验；不自动复活终态 |
| CP7 WorkspaceQueryService | 是 | 页大小/读取预算、已授权read模式与export能力启用 | Query预算与安全失败映射；不配置静默fallback或自动刷新 |
| Inbound / Operations / Adapters装配 | 是 | profile、配置来源、store绑定、密钥引用、观测资源 | RuntimeConfig、ConfigLoader、ConfigValidator、ConfigError与builder注入关系 |
| Domain对象与不变量 | 否（资源约束间接影响） | 无直接文件/环境读取 | 显式typed参数，不隐藏全局配置依赖 |

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。七CP及实现层均有来源，未引入新adapter业务；配置类别不含实际数值/密钥名。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### CFG2 禁止配置化与交接

#### 问题与依据

来源：00 BR-WS-001~012、01 §13.1、Step9/10。

不可关闭的约束覆盖安全、数据owner、原子与状态机；保留参数不能短于可证明恢复窗口后仍声称完整。

#### 诊断与取舍

将fail-open、跳gap、清local overlay、恢复旧授权作为可选配置会改变正式业务规则。

采用：显式列禁止表；03收口实现契约，04才给填写和生效规范；未采用：把外部truth或后续实现细节并入本部分。复杂度允许在本文件独立小节展开。

写入前检查：项目/flow/本部分门禁pass；依据与取舍done；目标仅当前Step；正式正文不写。下一批先结构化本部分再自检。

#### 结构化中间产物

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| owning truth与forbidden body边界 | 配置不能复制L1正文/授权/runtime/archive/SDK状态 | 00/01 ownership重新讨论 |
| Query no-write | 不能由cache/refresh开关引入持久效果 | 00业务规则、02 Step7/8 |
| resolver-first与现时权限fail-closed | 禁止旧allow宽限、从projection猜scope | 01安全边界、02 Step6~10 |
| application/projection/cursor/coverage原子提交 | 批次或store选择不能允许部分推进 | 01一致性、02 Step8 |
| 正式source身份/版本/缺口与幂等 | 不能配置跳gap、按时间排序或放弃同键冲突 | 02 Step6/8/9 |
| candidate/current隔离与再验证 | 不允许Ready跳cutover、旧worker复活 | 02 Step8/9 |
| local intent独立所有权 | 重建、清理或分页不能重置用户意图 | 00/01、02 CP5/6 |
| 失效覆盖与结果追溯 | 不允许关失效、删除结果后仍声明完整重放 | 02 Step8~10、03保留/事务闭环 |
| fake/readiness与未闭合接缝 | profile不能使fake变成真实owner或archive证据 | 全局裁剪与闭环标准 |

03承接RuntimeConfig等配置实现主体的所有权、字段来源、解析/校验/注入及安全错误映射；04再给配置填写、合法值、生效与运维说明。本章不提供默认值、环境变量名、JSON、密钥名、constructor参数或热更新实现。

#### 回填草稿与模块自检

回填本部分结构表和边界结论，不摘录诊断过程。禁止表覆盖domain/state/安全/事务/审计链；没有以配置变更绕过正式回退。

模块状态：问题/诊断/取舍/结构化/回填/自检=done；gate_status=pass；外部正向合同仍blocked。允许下一部分依据审查。

### 7.1 后置参考审计

artifact/governance的配置章只参考“影响/禁止/03承接”的粒度；其Outbox、GRC、archive handoff配置均不引入workspace。draft/03中generic adapter候选仅经本项目Step4/7核验后保留已有接缝，不新增consumer或truth。

## 8. 回填草稿

正式§11摘录本文件§7的结论表/图；模块附录只摘录已停审结论，不复制讨论过程。详细字段不越过概要粒度。

## 9. 待确认事项

WS-UP-001~008/006-S持续开放；仅允许本地骨架与负向边界收口，受影响正向合同不能交实现。

## 10. 进入下一步条件

配置影响与禁止边界均回指既有CP/入口；无具体参数与代码。03实现契约、04配置使用分工明确。
自检仅为文档静态审查，不是测试执行或上游签署。gate_status=pass；允许进入Step 12。
