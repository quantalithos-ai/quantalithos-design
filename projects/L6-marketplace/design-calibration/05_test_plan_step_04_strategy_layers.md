# Step 4：制定测试策略与分层

> 对应 SOP：测试方案讨论流程 Step 4
> 回填章节：`05-测试方案.md` §4

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 4 测试策略与分层 |
| 当前状态 | completed / stop_review |
| 输入 | Step 2 范围、Step 3 切口、03/04 contracts |
| 输出 | 层级、suite、fake/real 边界和 release smoke 策略 |

### Step内计划与门禁字段

| 计划项 | 状态 | 可审查产物/门禁 |
|---|---|---|
| 读取输入与前序结论 | done | §2；前序：05_test_plan_step_03_test_objects_cuts.md（含诊断、取舍、未确认项） |
| SOP逐问题回答 | done | §3，回答所有适用问题 |
| 当前/历史材料诊断 | done | §4，不继承historical truth |
| 设计取舍 | done | §6，采用/未采用理由 |
| 结构化产物 | done | §7；编号/字段/归属可反查 |
| 复杂度判断 | done | 主控内按表/单元组织，不需新增业务附录 |
| 回填草稿 | done | §8；只候选，正式写入等Step15 |
| 自检/下一步 | done | §9/10，外部资格不关闭 |

`gate_status=pass`；`gate_reason`=本Step设计审查完成，执行仍not-run；`next_allowed_action`=§10下一Step阅读/设计；`source_files`=§2列出的正式输入与前序文件。上述done是本Step内容事实，不是测试执行或用户/owner签核。

## 2. 本步输入与目标

输入：Step3已完成13 CUT来源审查、03§5/15、04 profile。输出：层级/时机/blocking/suite、fake与正式资格上限。每个CUT须有发现层，不能把所有高风险放到browser/E2E。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| unit发现什么？ | codec/required字段、factory/guard、canonical、finite label、config schema。 |
| service发现什么？ | 49flow编排、原结果和RO/current disclosure、权限/owner typed异常。 |
| 必须DB/worker集成什么？ | 帧顺序、CAS、真实unique/FK、as-of、withdraw竞争；A/B/fence/shutdown不能靠UI。 |
| API/contract什么？ | Core metadata、37route硬/typed错误、无Job HTTP、SDK完整operation/schema。 |
| 哪些需要E2E/release？ | 本地发布→controlled决定→目录→分发→撤回/恢复最小闭环及Web状态；不是全owner实现证明。 |

## 4. 当前文档问题诊断

初稿只有层级，缺PR/main/nightly/release时机和report-generation-audit套件。真假PG也表述混合，现明确fake不能替代postgres-atomicity退出证据。

## 5. 改动前后对比

| 项 | 前 | 后 | 理由 |
|---|---|---|---|
| 时机 | suite无流水线归属 | PR本地快测，main真实PG/entry，nightly复原竞争，release全P0 | 能安排门禁 |
| 证据工具 | 只在门禁图出现 | 独立report-generation-audit | 无静态造证据的漏项 |

## 6. 测试设计取舍

采用风险发现层分配+下层失败阻断上层；不以单E2E成功代替factory/CAS/Unknown。fake严格实现原port，真实integration另标blocked。复杂度为层级总表，本Step无需独立业务附录。

## 7. 结构化中间产物

#### 测试分层图: Marketplace风险发现层

```text
                release-main-smoke (planned)
          +-------------+-------------+
          | API / Worker / Web contract |
          +-------------+-------------+
           service flow + recovery replay
          +-------------+-------------+
          | domain/state | PG atomicity |
          +-------------+-------------+
             protocol/config/redaction unit
```

关键说明：

- 下层先验证纯契约与不变量，再验证port/事务和入口；此图不表示owner审批时序。
- release只汇总固定run的suite，UI不代替底层证据。
- PG原子性须真实隔离PG，fake只验证编排。

### 7.1 测试分层表

| 层级 | 目标 | P0 内容 | 证明上限 |
|---|---|---|---|
| Unit/codec | 严格 schema、canonical、有限枚举、redaction | CUT-01/06/10/11 | 不证明 PG/owner |
| Domain/state | factory、guard、14 carrier、非法 pair | CUT-02/08 | 不证明外部决定 |
| Service/application | 49 flow、ports 顺序、原结果、no-write | CUT-03/05/07/12 | fake 不等正式 consumer |
| PG integration | frame/CAS/unique/FK/as-of/manifest/concurrency | CUT-04/08/09 | 不等跨系统原子性/SLO |
| SDK contract | exact operation/schema/scope/qualification | controlled P0；真实 P1 | 不可凭 endpoint/label 通过 |
| API entry | metadata、HTTP/error、无 Job route、replay header | API suite | 不证明 UI/owner |
| Worker | A/B、claim/fence、probe、shutdown | worker suite | 不证明外部发送成功 |
| Web component/browser | protocol shape、状态、locale、workflow | Web suite | 不证明 approval/install/payment |
| Non-functional | redaction、recovery、search parity、candidate capacity | Step10 | 数值基线未锁定 |

### 7.2 Fake/controlled/real 规则

| 依赖 | test profile | production profile |
|---|---|---|
| PG | isolated test PG 或等价 controlled adapter；原子性关键路径必须真实 PG planned | 正式 PG qualification 未完成则 blocked |
| SDK/owner | typed fake/spy/fault adapter 只能实现公开 port | 禁止 fake fallback；exact formal contract 才可 Bound |
| Governance | controlled decision binding fixture，ACK/scan/signature 显式非 approval | 正式 decision/current binding 未闭合则 blocked |
| Receiver/Notice/Observation | controlled outcome/probe/Unknown | 无 exact receiver/producer/redaction qualification 不调用 |
| Web API | test API base | 公共 origin 由 04 build-time 配置，不能携带 secret |

### 7.3 Suite 分层与执行顺序

| Suite | 层级 | 主要 CUT/TC family | blocking |
|---|---|---|---:|
| `contract-domain-fast` | unit/domain | SOURCE/REVIEW/CATALOG/CROSS（state/canonical） | 是 |
| `service-flow-fast` | service | 49 flow、replay、no-write | 是 |
| `infra-runtime-fake` | service/contract | adapter qualification、fault windows | 是 |
| `postgres-atomicity` | PG | frame/CAS/UK/FK/as-of/race | 是 |
| `entry-worker-job` | API/Worker | entry mapping、A/B、shutdown | 是 |
| `web-protocol-workflow` | Web/browser | DTO/locale/UI states | 是 |
| `config-redline` | config/entry | strict JSON、profile、secret、no-fake | 是 |
| `redaction-boundary` | cross | log/trace/metric/report scan | 是 |
| `recovery-replay` | service/PG/Worker | Unknown/late/reconcile/recovery | 是 |
| `report-generation-audit` | tooling | TC-CROSS-010；schema/path/digest/redaction/cross-run负例 | 是 |
| `release-main-smoke` | cross | 每个 P0 family 代表用例 + checks | 是 |

执行顺序由底层到入口；任一 blocking suite 不可用时不得手写通过，必须记录 unavailable/blocked。P1/P2 suite 不能替代 P0 suite。

| 时机 | 必须执行 / 失败处理 |
|---|---|
| PR | contract-domain-fast、service-flow-fast、config-redline、依赖/脱敏快检查；失败阻合并 |
| main CI | 以上+infra-runtime-fake、postgres-atomicity、entry-worker-job、web-protocol-workflow、report-generation-audit；缺PG不skip成pass |
| nightly | 全P0+recovery-replay/race/fault全参数展开；容量candidate只采样，不硬判SLO |
| staging selected | 仅获正式非生产资格的exact接缝，P1 blocked不可静默转通过 |
| release | 全11 suite、每个formal TC全部subcase与redaction/dependency/report检查；失败阻送验，仍非06 verdict |

## 8. 回填草稿

正式§4装配层级、时机、fake/PG/owner边界和13CUT归属；执行约束是计划，不填写suite结果。

## 9. 待确认事项与详细设计影响判定

| 之前 | 之后 |
|---|---|
| 旧测试按页面/安装主线 | 以契约、状态、事务和失败分层 |
| real product 假设 | product-neutral controlled seam + PG planned |
| UI 演示当端到端 | UI 只验证 protocol/状态映射 |

待确认：具体 PG、SDK profile、provider 和真实容量基线；不影响当前分层。进入 Step5 条件是每个 P0 CUT 都有 suite 归属和证明上限。

## 10. 进入下一步条件

13 CUT均有unit/domain/service/PG/API/Worker/Web对应层；新增tooling suite不新增业务协议。`gate_status=pass`；下一读SOP Step5/规范§5.5、00需求编号与Step3来源表。无需commit。
