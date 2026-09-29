# Step 4. 制定测试策略与分层

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 4
> 正式回填：`05-测试方案.md` §4
> 日期：2026-09-13
> 状态：`completed / pass_with_real_seam_layer_blocked / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 为 Step 3 的 18 个 CUT 指定最早发现层、补强层、执行时机与失败姿态 |
| 输入 | Step 3、正式 03 模块/flow/UoW、正式 04 profile/assembly |
| gate_status | `completed / pass_with_real_seam_layer_blocked` |
| gate_reason | 所有 CUT 均有首要层；real-seam 不被 fake/controlled integration 替代 |
| next_allowed_action | 创建并完成 Step 5 |
| source_files | Step 3；正式 03 §4～15；正式 04 §6/9/11/12 |

| 计划项 | 产物 | 状态 | 门禁 |
|---|---|---|---|
| 分层取舍 | §3～5 | done | 风险最早层明确 |
| 分层图/表 | §6.1～6.2 | done | 图格式与失败姿态完整 |
| CUT 映射 | §6.3 | done | 18/18 CUT 有首要层与补强层 |
| real-seam 边界 | §6.4 | done | required-but-blocked 闭环明确 |
| 复杂度/回填/影响 | §7～10 | done | 不提前定义 gate 执行事实 |

## 2. 本步输入

| 输入 | 使用 |
|---|---|
| 18 个 Step 3 CUT | 分层的完整分母 |
| 6 crate planned tests | 测试发现位置与依赖方向 |
| 30 flows / 18 states / UoW | service、entry、integration 的职责切分 |
| 04 profiles与 fake 隔离 | controlled / real-seam 环境边界 |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| Unit 必须发现什么？ | typed/ref/DTO/enum、26 对象 factory/invariant、18 状态边、source classification、canonical set、redaction allowlist 的纯逻辑错误。 |
| Service 必须发现什么？ | 8 services 的 port 顺序、UoW/read-set、完整 replay、Query no-write、intent-before-effect、partial/reconcile、current disclosure。 |
| Integration 依赖什么？ | store/UoW/CAS/probe/fence、cursor codec/mapping、runtime builder、adapter outcome 和 fake/durable parity；controlled fake 不能证明真实 finality。 |
| API/Worker 测什么？ | envelope/metadata、handler safe mapping、5 consumer receipt/ACK、17 job claim/checkpoint/phase、transport-neutral disposition。 |
| 何时才需要 E2E/release？ | 仅正式 owner/source/governance/integrity/storage/receiver/Bus/durable/downstream 合同与环境齐备后验证最小 real seam；目前相应层 blocked。 |

## 4. 当前材料问题诊断与前后对比

| 问题 | 影响 | 处置 |
|---|---|---|
| 旧 05 从单元直接跳到“集成/E2E主线” | 无法定位 UoW、no-write、unknown 在何层失败 | 增加 service、controlled integration、entry、real-seam、evidence review 分层 |
| old staging 使用 fake storage/governance | fake 结果易被包装为 E2E | controlled 与 real-seam 永久分栏 |
| report/evidence 仅为尾部说明 | static EV 风险发现过晚 | 独立 evidence/release review 层 |

| 改动前 | 改动后 | 理由 |
|---|---|---|
| 技术测试类型平铺 | 风险最早发现层 + 补强层 | 快速且可定位 |
| fake integration≈真实联调 | controlled proof 与 formal conformance 分离 | 保持 authority/finality |
| E2E 承担所有红线 | owner/state/UoW/config/security 在低层先阻断 | 减少晚期发现 |

## 5. 测试设计取舍

| 议题 | 结论 |
|---|---|
| 是否要求每项都过 E2E | 否；E2E 只验证最小真实接缝，不能替代 unit/service |
| scripted fake 的定位 | service/controlled integration，可证明调用顺序与映射，不能证明 authority/durability |
| durable adapter 的定位 | 独立 conformance layer，必须与 fake 运行同一 contract vector |
| static checks | 纳入 controlled/release gate，验证依赖、schema、redaction、artifact pairing |
| 当前 real-seam 失败姿态 | 前置不满足即 `blocked`，不是 skipped/passed/风险接受 |

## 6. 结构化中间产物

### 6.1 测试分层图：L4-archive 风险发现与证明层级

```text
          [Evidence / release review]
        raw -> report -> EV -> future 06
                       ^
       [Real-seam conformance / E2E]  <--- currently blocked
   owners + governance + crypto + storage + receiver + durable
                       ^
             [API / Worker entries]
       3C + 5Q + 5E + 17J boundaries
                       ^
            [Controlled integration]
       store/adapter/config/cursor/fault/static
                       ^
            [Application service tests]
      8 services / UoW / no-write / replay
                       ^
           [Contract / Domain unit]
       DTO/ref + 26 objects + 18 states
```

关键说明：

- 下层通过是上层前置，不替代上层正式接缝证明。
- real-seam 当前因既有 blocker 保持 blocked；synthetic fake 不得关闭。
- Evidence/release 层验证证据真实性，不生成验收 verdict 或 readiness。

### 6.2 测试分层表

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Contract/Domain unit | 结构、不变量、状态边最早失败 | DTO/ref/enum、26 objects、18 states、source class | PR | P0 阻断 |
| Application service | 编排与副作用边界 | 8 services、30 flows、UoW、replay、no-write、partial | PR/main | P0 阻断 |
| Controlled integration | 技术合同与故障注入 | fake store/adapter、cursor/config/builder、CAS/fence/static scans | main/nightly | P0 阻断；不升级真实证明 |
| API/Worker entry | 边界映射与 runner 行为 | metadata、safe response、consumer ACK、job claim/checkpoint | main/nightly | P0 阻断 |
| Real-seam conformance | 真实 authority/finality/compatibility | owner/export、governance、crypto/storage、receiver、durable restart | staging/release | 缺前置=`blocked`；失败阻断 |
| Evidence/release review | raw/report/EV 可追溯和零泄漏 | fixed run、schema/digest、pairing、redaction、future AC refs | nightly/release | 缺 raw/跨 run/static pass=P0 阻断 |

### 6.3 18 CUT 到首要/补强层映射

| CUT | 首要发现层 | 补强层 | 不得只靠 |
|---|---|---|---|
| CONTRACT | Contract | API/Worker | handler happy path |
| OBJECT | Domain | Service | E2E 输出存在 |
| STATE | Domain table | Service/Worker | 最终状态截图 |
| COMMAND | Service | API/real seam | transport 2xx |
| QUERY | Service spies | API/real seam | response body 快照 |
| CONSUMER | Worker/service | real Bus seam | ACK 计数 |
| JOB | Service/worker | restart/real seam | job report `Completed` |
| UOW | Service fake | durable contract | fake 单次成功 |
| IDEMPOTENCY | Service/property | durable restart | unique index 存在 |
| EFFECT | Service fault | adapter/real seam | timeout 或日志 |
| AUTHORITY | Contract/service | owner conformance | synthetic approved fixture |
| RESTORE | Domain/service | per-owner receiver | Bundle 生成成功 |
| CONFIG | Config/builder | production-like assembly | 配置文件可解析 |
| SECURITY | Contract/capture | release redaction scan | 手工扫日志 |
| OBSERVE | Service/capture | sink integration | dashboard 存在 |
| DEPENDENCY | Static architecture | release scan | README 声明 |
| RESOURCE | Unit/service L/L+1 | workload benchmark | 无来源数字 |
| REPORT | Report audit | evidence review | 手写 evidence index |

### 6.4 Real-seam 最小闭环与阻断

| 闭环 | 必需接缝 | 当前状态 |
|---|---|---|
| request→source→manifest | authority + per-source export/fence/coverage + durable UoW | blocked `AR-UP-001/006~008`,`AR-03-LOCAL-003` |
| assessment→placement→seal | integrity/compatibility + storage commit/probe | blocked `AR-UP-004/005` |
| lifecycle execution | governance decision/hold/delete + storage effect | blocked `AR-UP-003/005` |
| restore plan→material→handoff | source material + per-owner receiver/probe/compensation | blocked `AR-UP-006/009` |
| event/consumer | trusted producer schema + Bus ACK/redelivery | blocked by owner/event/config contracts |
| query continuation | public codec + repository mapping + durable snapshot | blocked `AR-03-LOCAL-002/003` |
| audit material handoff | approved redaction/coverage/export contract | blocked `AR-UP-007`,`AR-03-LOCAL-005` |
| SDK/downstream conformance | corrected dependency direction + stable public contract | blocked `AR-ARCH-001` |

## 7. 复杂度判断

分层本身无需拆附录；18 CUT 以一张映射表完整覆盖。Step 9 再将层级实例化为 suite/gate/script，当前不预设 CI vendor、命令、运行时长或并行度。

## 8. 回填草稿

正式 §4 应保留六层图、分层表、18 CUT 映射和 real-seam 阻断表。核心口径是：风险在最低可判定层先失败；controlled fake 与真实接缝证明分离；evidence review 只校验真实性，不做验收裁决。

## 9. 对上游影响与待确认

| 项 | 结论 |
|---|---|
| 03/04 回写 | 无 |
| 新 blocker | 无 |
| 待确认 | CI/runner/provider/durable/workload 均保持既有 pending；Step 9 再定义 planned gate surface |

## 10. 进入下一步条件

- [x] 18/18 CUT 有首要发现层和补强层。
- [x] unit/service/integration/entry/real-seam/evidence 职责不混用。
- [x] real-seam required-but-blocked，没有被 fake 或 skip 替代。
- [x] 失败是否阻断可判定。
- [x] 允许进入 Step 5。
