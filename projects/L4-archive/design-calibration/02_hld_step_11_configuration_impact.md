# Step 11. 配置影响轮廓

## 1. Step 状态与计划

状态：`completed / pass_with_upstream_blockers / stop_review`；对应概要 SOP Step 11。

- [x] 读取项目 ledger、02 flow、Step 4~10、正式 01 §11/§13。
- [x] 回答受配置影响主体、间接影响、禁止配置化和 03/04 分工。
- [x] 输出配置影响与禁止配置化两表并完成静态审计。

## 2. 本步输入、问题回答与取舍

配置只影响运行装配、已获准 adapter 绑定、资源预算和后台工作调度；Domain 对象只接收经校验的 typed 值，不直接读取环境或文件。未闭合的 source、governance、integrity、storage、receiver 或 outbound 能力不能靠 feature flag 变为 ready。

03 应定义 `RuntimeConfig`、`ConfigLoader`、`ConfigValidator`、各 `AdapterConfig`/`JobConfig`、`ConfigError` 与 runtime builder 注入方向；04 才定义具体配置项、合法值、来源、默认/必填、生效与安全填写规则。本步不创建 04，不给默认值、环境变量名、JSON/TOML/YAML、密钥名或部署参数。

表格足以表达配置来源到既有主体的影响，无需额外画图。

## 3. 配置影响轮廓

| 主要部分 / 接缝 | 是否受配置影响 | 配置影响类型 | 交给详细设计展开 |
|---|---|---|---|
| CP1 同步 admission/query 入口 | 是 | profile、入口预算、请求/查询资源上限 | RuntimeConfig 分组、入口校验、handler 注入；不得改变 admission 规则 |
| CP1 `AdvanceArchiveJob` worker | 是 | worker 并发、批次、调度与租约预算 | JobConfig、worker fence、shutdown/recovery 注入 |
| CP2 `SourceExportPort` family | 是 | endpoint、secret ref、timeout、source capability binding | AdapterConfig、capability validator、owner-specific adapter factory；合同未闭合不得启用 |
| CP2 capture/reconcile jobs | 是 | per-source fan-out、批次、timeout/retry/probe 预算 | JobConfig、attempt/fence 与资源限制映射；不得按配置跳过 required source |
| CP3 assembly/seal | 间接受影响 | manifest 大小/批处理资源、store 能力、后台预算 | service 只接收受控 budget；closure/seal invariant 不读配置 |
| CP4 integrity/compatibility ports | 是 | capability endpoint、algorithm/key/schema capability ref、timeout/容量 | AdapterConfig + secret-reference 注入；不保存 secret，不配置生成 Supported/Verified |
| CP4 assessment jobs | 是 | 并发、批次、资源/时间预算 | JobConfig 与失败分类；超预算不得伪成功 |
| CP5 `ArchiveStoragePort` | 是 | endpoint、credential/secret ref、storage capability/tier binding、timeout/probe | AdapterConfig、capability validation、provider error translation；不固定产品 |
| CP5 governance decision seam | 是 | endpoint、decision contract/profile binding | AdapterConfig；只能绑定正式 owner，不配置 policy/期限/hold 结论 |
| CP5 placement/lifecycle workers | 是 | 并发、批次、retry/probe/compensation 预算 | JobConfig、intent-before-effect 与 commit-unknown guard 注入 |
| CP6 `RestoreReceiverPort` family | 是 | owner-specific endpoint、capability/schema binding、secret ref、timeout/probe | per-owner AdapterConfig 与 receiver registry 校验；registry 不授予写权 |
| CP6 plan/material/handoff workers | 是 | owner fan-out、批次、资源、retry/probe/compensation 预算 | JobConfig、per-item fence 与并发控制注入 |
| Inbound Event Consumers | 是 | subscription/profile、supported envelope/schema、batch/concurrency | ConsumerConfig、trusted-source binding、dedupe/failure mapping；不定义 event truth |
| Outbound event candidate seam | 是但当前 blocked | endpoint/profile、schema capability、delivery budget | 仅在正式事件合同后定义 Outbox/PublisherConfig；配置不能伪造合同或 delivery evidence |
| Archive formal state store | 是 | store endpoint/root、pool/transaction/retention capability | StoreConfig、health/capability validator、repository builder；不得改变原子边界 |
| Query composition/redaction | 间接受影响 | read budget、page/batch limits、允许的已核验 read capability | QueryConfig 与 safe limit mapping；不配置 fail-open/隐式 repair |
| Domain objects / invariants | 否（只受资源值间接约束） | 无直接 config path 或全局环境读取 | 显式 typed 参数；保持纯 domain 校验 |

## 4. 禁止配置化边界

| 禁止配置化边界 | 原因 | 若需改变应回到哪里 |
|---|---|---|
| source-authority matrix 与 canonical/auxiliary 分类 | 配置不能改变业务 truth owner 或让 projection 冒充 canonical | 00/01 与 owning project 合同 |
| Archive 不反写 identity/conversation/work/process/governance/artifact/workspace/observability | 跨域写权不是 deployment choice | 00/01 职责边界 |
| GovernanceDecisionRef、legal hold、删除授权、风险接受 | 配置不能生成正式决定、默认期限或销毁权限 | governance/明确 owner + 00/01 |
| request authority 与 actor/scope 安全门禁 | profile 不能把 Unknown/Blocked 改为 Accepted | 00/01 安全规则、02 Step 6~10 |
| manifest closure 与 immutable revision | 配置不能忽略 missing/unexpected/invalid 或原地改 manifest | 02 Step 6/8/9 |
| integrity/compatibility 保守状态 | 配置不能生成 digest/signature/key、将 Unknown/Unsupported 改为通过 | owner capability 合同 + 01/02 |
| external intent-before-effect、幂等和 commit-unknown reconcile | retry 开关不能允许先调用后记账或盲重放 | 01 一致性、02 Step 6~10 |
| Archive 本地原子提交边界 | 批次/store 选择不能允许 request/job、result/history 或相关状态部分提交 | 01/02 一致性；03 事务设计 |
| 多轴状态与禁止推导 | 不能把 sealed/verified/committed/handoff success 映射为 archived/restored | 00/01/02 状态语义 |
| per-owner restore item、最小材料与正式 receiver | registry/config 不授予跨域写权或全域成功 | owner receiver 合同 + 02 CP6 |
| Query no-write 与当前 redaction | cache/read profile 不能触发 capture/retrieve/reverify/retry 或沿用旧权限 | 02 Step 7/8/10 |
| 历史/因果记录不可覆盖 | retention 配置不能删除必要记录后仍宣称可追溯/完整 | 00 NFR、01 横切、03/04 保留闭环 |
| fake/provider readiness | fake/profile 不能生成真实 digest、commit、evidence、signoff 或 readiness | 全局真相源闭环标准、05~07 |
| `L0-sdk` compile 方向 | 配置不能绕过 AR-ARCH-001 引入服务端反向依赖 | 全局依赖标准 owner 与 L0-sdk/L4-archive 设计 |

## 5. 03 / 04 承接边界

| 后续文档 | 必须继续回答 | 当前禁止提前回答 |
|---|---|---|
| 03-详细设计 | 配置对象所有权、loader/validator、分组校验、builder 注入、错误映射、启动 fail-closed、adapter/job/consumer/store capability check | 具体值、真实 endpoint、环境变量、密钥名、供应商、部署模板 |
| 04-配置设计 | 经 03 确认的配置项、类型/合法值、默认或必填、来源/优先级、生效、敏感性和安全使用 | 修改 domain invariant、补造外部合同、宣称 provider/readiness 已存在 |

`AR-UP-001~009` 尚未关闭的能力，在 03/04 中也只能保留 disabled/blocked/required capability 语义；“可配置”不是“已支持”。

## 6. 静态审计

| 审计项 | 结论 |
|---|---|
| 主体来源 | 所有受影响项均回指 Step 4~10 的 CP、入口、worker、port 或 store；无新业务模块。 |
| Domain 隔离 | Domain 不直接读取配置，typed value 由装配层校验后注入。 |
| 禁止项覆盖 | owner、安全、closure、完整性、事务、幂等、多轴状态、restore、查询、证据均不可配置绕过。 |
| 03/04 分工 | 03 定实现契约，04 定具体配置说明；本步未创建 04。 |
| 污染审计 | 未继承 Rust/S3/MinIO/Glacier/PostgreSQL/7 年/固定性能、算法或密钥。 |

## 7. 回填草稿、待确认与进入下一步条件

正式 §11 摘录配置影响表、禁止配置化表和 03/04 承接说明。外部 endpoint/capability/secret/schema 的实际配置项等待正式 owner/provider 合同，不在本步构造。

配置影响、禁止边界和后续分工完整，未给具体配置或实现定义。`gate_status = pass_with_upstream_blockers`；允许创建并执行 Step 12。
