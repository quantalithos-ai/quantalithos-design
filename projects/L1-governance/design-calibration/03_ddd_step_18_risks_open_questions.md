# Step 18. 风险与待确认事项

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 18
> 回填章节: `03-详细设计.md` §17 风险与待确认事项

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 18 风险与待确认事项 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | Step 1~17 详细设计校准文档 |
| 输出文件 | `projects/L1-governance/design-calibration/03_ddd_step_18_risks_open_questions.md` |
| 停审方式 | 完成本 Step 后暂停,由用户审查后再进入 Step 19 |

## 2. 本步目标

本 Step 汇总详细设计阶段仍未关闭、可能影响实现移交或后续文档生成的风险与待确认事项。它只记录风险、影响、确认方和未确认前处理方式,不新增对象字段、协议字段、状态转换、配置默认值、产品选型、测试用例编号、验收 evidence 或 commit boundary。

本 Step 的核心判断:

- Step 1~17 已经闭合对象、port、protocol、flow、状态、持久化、错误、幂等、配置绑定、观测和测试切口的详细设计内部主链。
- 正式 `03-详细设计.md` 仍必须由 Step 19 从本轮中间产物装配,旧 `03` 不能作为新版实现真相源。
- `04-配置设计.md` 和 `07-实施计划.md` 当前未发现;`05-测试方案.md`、`06-验收标准.md` 已存在但需要按新版 `03` 复核或重写。
- 目标实现仓 `/home/aris/Projects/quantalithos-governance` 在 Step 3 / Step 4 检查时未发现,这不阻塞设计 SOP,但阻塞正式代码开工。

## 3. 本步输入

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| Step 1~5 | 已完成 | 确认上游、范围、约束、布局、模块主轴是否仍有风险 |
| Step 6~10 | 已完成 | 确认对象、port、protocol、flow、状态是否仍有缺口 |
| Step 11~13 | 已完成 | 确认事务、错误、幂等、并发是否仍有生产化风险 |
| Step 14~16 | 已完成 | 确认配置、外部依赖、观测和测试切口待后续文档承接的事项 |
| Step 17 | 已完成 | 承接清单、前置阅读、跨文档预复核和冲突修正表 |
| `03_ddd_calibration_flow.md` | 已更新到 Step 17 | 确认 Step 18 / Step 19 尚未完成 |
| 当前项目目录 | 已检查 | 确认 `04` / `07` 当前未发现,`05` / `06` 需按新版 `03` 复核 |

## 4. 分批写入记录

| 批次 | 内容 | 状态 |
|---|---|---|
| 18.1 | 文件骨架、目标、输入、SOP 问题回答 | [x] 已写入 |
| 18.2 | 风险分层、已关闭风险、风险表 | [x] 已写入 |
| 18.3 | 待确认事项、未确认前处理规则、回填草稿和进入下一步条件 | [x] 已写入 |

## 5. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些问题仍可能影响代码实现? | 主要是正式文档链尚未完成、目标实现仓未确认、Step 8 Command 数量文字漂移、真实产品 / adapter / integration 环境未锁定、redaction / evidence 生成规则需后续测试和实施文档承接。 |
| 哪些问题会阻塞实现,哪些只影响后续优化? | Step 19 正式 `03` 未装配、`07` 未生成并完成逐 boundary 审计、目标实现仓未确认会阻塞正式实现开工。durable DB / bus / metric backend / DLQ / external GRC / archive /真实相邻仓 adapter 未定不阻塞 P0 fake / in-memory 闭环,但阻塞生产化 adapter 和真实验收。 |
| 每个待确认事项需要谁确认? | 正式 `03` 由详细设计维护者在 Step 19 确认;`04/05/06/07` 由对应文档维护者按新版 `03` 生成 / 复核;目标实现仓、git config 和 commit boundary 由实施计划编写者和实现 agent 确认;真实 adapter、DLQ、metric backend、integration 环境由架构 / 运维 / 测试 / 相邻仓负责人确认。 |
| 未确认前实现者应该如何处理? | 不得自行补设计。正式 `03` 未装配前不按旧 `03` 开工;`07` 未生成前不自行拆 phase / commit;上游 typed contract 不匹配时暂停;运行期依赖不可用时只使用 fake / fixture / stub 并显式保留 unresolved / unavailable / failed / retry 语义。 |

## 6. 当前文档问题诊断

| 问题 | 影响 | 本 Step 处理 |
|---|---|---|
| 旧 `03-详细设计.md` 仍是旧草稿 | 不能作为新版实现真相源 | 列为 Step 19 前阻塞正式移交 |
| Step 8 Command 数量文字漂移 | `07` 阅读清单和正式 `03` protocol inventory 可能出现 22 / 23 双口径 | 列为 Step 19 必修正项 |
| `04-配置设计.md` 当前未发现 | config file、profile、env、secret、product binding 不能由实现代码补 | 列为后续配置设计任务 |
| `05-测试方案.md` / `06-验收标准.md` 已存在但需复核 | 可能继承旧对象 / 状态 / evidence 口径 | 列为后续测试 / 验收同步风险 |
| `07-实施计划.md` 当前未发现 | phase / commit boundary、经验复核、提交纪律缺正式入口 | 列为正式实现开工门禁 |
| 目标实现仓未发现 | 无法直接落代码、运行测试或提交实现仓 commit | 列为 PH-01 前置确认 |
| 生产化产品未锁定 | durable adapter、真实 broker、metric、DLQ、integration evidence 无法闭合 | 列为不阻塞 P0 fake、阻塞 production / acceptance 的风险 |

## 7. 设计取舍

| 议题 | 方案 | 取舍 |
|---|---|---|
| 是否把所有历史 open item 继续列入风险 | A. 全部保留;B. 只保留仍未关闭且影响实现 / 移交的事项 | 采用 B。Step 6 的后续闭合项已由 Step 7~16 承接,不重复列为未关闭风险 |
| 是否在 Step 18 修 Step 8 数量漂移 | A. 直接改 Step 8;B. 记录为 Step 19 装配修正项 | 采用 B。当前每个 SOP 独立产出,Step 18 只记录风险 |
| 正式 `03` 未装配前是否能交给实现 | A. 可以按 calibration 开工;B. 不正式移交 | 采用 B。正式实现入口必须是 Step 19 后的 `03` 与对应校准来源 |
| 生产化产品未定是否阻塞 P0 | A. 阻塞全部实现;B. P0 fake / in-memory 可先闭环 | 采用 B。详细设计固定 port / adapter 语义,产品绑定由 `04/07/09` 或后续 adapter design 承接 |
| 真实相邻仓不可用时是否暂停全部实现 | A. 全部暂停;B. 编译期依赖暂停,运行期依赖 fake | 采用 B。唯一编译期 sibling 依赖是 `core-contracts`;其他依赖通过 port、event、snapshot、handoff、fake 表达 |

## 8. 风险分层图

```text
L1-governance detailed design risks
  |
  +-- Formal document chain risks
  |     +-- Step 19 formal 03 not assembled
  |     +-- 04 and 07 not yet generated
  |     +-- 05 and 06 need new-03 alignment review
  |
  +-- Implementation start risks
  |     +-- target implementation repo not confirmed
  |     +-- core-contracts path dependency may mismatch
  |
  +-- Design consistency risks
  |     +-- Step 8 command count wording drift
  |     +-- old GovernanceRequest / Exception / RiskAcceptance must not re-enter
  |
  +-- Production and evidence risks
        +-- durable store / bus / external products not selected
        +-- metric backend / DLQ / diagnostic store not selected
        +-- redaction and real integration evidence not fully defined
```

## 9. 已关闭风险不再列入表

| 已关闭项 | 关闭依据 | 不再列入原因 |
|---|---|---|
| Domain 字段来源不闭合 | Step 17 §12.2 | 关键字段已能回指 DTO、event、派生规则、查表规则或系统生成规则 |
| Command / Event / Job 构造不闭合 | Step 8 / Step 9 / Step 17 §12.3 | 构造入口和缺失处理已收稳 |
| Query response / page / marker 不闭合 | Step 8 / Step 9 / Step 17 §12.4 | 14 个 Query 的 response surface、empty / not visible / degraded / stale / failed 口径已预复核 |
| 状态机闭合缺口 | Step 10 / Step 16 / Step 17 §12.5 | 状态集合、迁移和测试入口已对齐 |
| port / persistence 读取面缺口 | Step 7 / Step 11 | repository、snapshot、projection、outbox、stored result 和 UoW 读取 / 写入面已定义 |
| error / idempotency 双口径 | Step 12 / Step 13 | duplicate replay、commit unknown、dead-letter、failed marker 和 retry 语义已收敛 |
| config 绑定点缺失 | Step 14 | 代码绑定点已定义;完整配置文件格式留给正式 `04` |
| observability / audit 埋点缺口 | Step 15 | 日志、指标、审计、trace、redaction 边界已定义 |
| 最小测试入口缺失 | Step 16 | 模块、接口、状态机、一致性、错误、配置、观测和脚本契约已有 test cut |

## 10. 风险表

| 风险 | 影响 | 阻塞范围 | 缓解方式 | 负责人 / 待确认方 |
|---|---|---|---|---|
| Step 19 正式 `03-详细设计.md` 尚未装配 | 没有正式详细设计入口,旧 `03` 不能作为新版实现真相源 | 阻塞正式实现移交 | Step 19 从 Step 1~18 装配正式 `03` 并执行自检 | 详细设计维护者 |
| `04-配置设计.md` 当前未发现 | 配置文件、env、profile、secret、product binding 不能由实现代码补 | 阻塞 production config 口径;不阻塞 Step 19 | 后续按 Step 14 生成正式 `04` | 配置设计维护者 |
| `05-测试方案.md` / `06-验收标准.md` 需按新版 `03` 复核 | 测试 / 验收门禁可能引用旧对象、旧状态或旧 evidence | 阻塞正式测试 / 验收移交 | 后续按 Step 16 和正式 `03` 复核或重写 | 测试方案 / 验收标准维护者 |
| `07-实施计划.md` 当前未发现 | phase / commit boundary、经验复核、提交纪律和永久记忆种子缺正式入口 | 阻塞实现 agent 开工门禁 | 后续按实施计划 SOP 生成并做逐 boundary 审计 | 实施计划维护者 |
| `/home/aris/Projects/quantalithos-governance` 当前未发现 | 无法创建 Rust workspace、运行实现测试或提交实现仓 commit | 阻塞代码写入 | `07` PH-01 前置检查确认或创建目标仓 | 实施计划维护者 / 实现 agent |
| `core-contracts` path dependency 不可用或类型不匹配 | Actor、metadata、trace、page、event envelope 等 shared type 无法编译对齐 | 阻塞依赖 core shared type 的代码 | 开工前检查 core baseline;缺失时暂停回写上游或设计 | core 负责人 / 实现 agent |
| Step 8 Command 数量文字漂移 | 正式 `03`、`07`、测试计划可能出现 22 / 23 双口径 | 阻塞正式 `03` 装配通过 | Step 19 统一为 23 Command,以 Step 8 §6.1 和 Step 16 为准 | 详细设计维护者 |
| 旧 `GovernanceRequest / Exception / RiskAcceptance` 主线残留 | 实现者可能按旧草稿恢复旧对象模型 | 阻塞正式 `03` 装配通过 | Step 19 明确旧 `03` 只作诊断,正式对象以 Step 6 / 8 / 10 为准 | 详细设计维护者 |
| durable DB / broker / search / HTTP 产品未锁定 | durable adapter、migration、row lock、transport topic、真实 query backend 无法稳定实现 | 不阻塞 P0 fake;阻塞 production adapter | P0 使用 in-memory / fake;产品化前由 `04/07/09` 或 adapter design 固定 | 架构 / 配置 / 实施计划维护者 |
| metric backend、log sink、alert SLO 未锁定 | 观测数据能输出但无法完成运维级告警和 SLO evidence | 不阻塞埋点契约;阻塞运维集成 | 实现 Step 15 安全字段和低基数指标;backend / SLO 进运维或实施文档 | 运维 / 实施计划维护者 |
| dead-letter storage / DLQ adapter 形态未选定 | event failure 的真实存储、重放和人工处置链路未落地 | 不阻塞 disposition 语义;阻塞真实 worker adapter | P0 fake 标记 dead-letter;真实 DLQ 由 bus / worker adapter 设计确定 | bus / worker 负责人 |
| safe diagnostic ref store 未定义 | 安全诊断引用无法长期持久追溯 | 不阻塞 forbidden field 规则;阻塞 durable diagnostic evidence | 只保留 safe diagnostic ref 口径;如需 store,后续补 port / persistence | 运维 / infra 负责人 |
| redaction check 扫描规则未完整定义 | 脚本契约存在,但无法证明所有 forbidden body 都被扫描 | 阻塞最终 acceptance script evidence | Step 16 保留脚本命令契约;具体扫描规则进入 `05` 或实施脚本设计 | 测试方案维护者 / 实现 agent |
| 真实相邻仓 runtime adapter 未全部可用 | identity、method、process、work、artifact、runtime、conversation、observability、archive 集成不可验证 | 不阻塞 P0 truth center;阻塞真实 integration evidence | 使用 fake / fixture / stub,并显式标记 fake evidence;真实 adapter 后续 phase 接入 | 相邻仓负责人 / 实现 agent |
| external GRC 产品和导出格式未锁定 | external GRC export job 只能按 marker / port 语义实现,无法绑定具体产品 | 不阻塞 P0 disabled / fake;阻塞真实 GRC export | 默认 disabled / fake;真实 target 由配置和 adapter design 固定 | external GRC owner / 实施计划维护者 |

## 11. 待确认事项表

| 事项 | 当前影响 | 需要谁确认 | 未确认前的处理方式 |
|---|---|---|---|
| Step 19 正式 `03` 装配 | 不能正式移交实现 | 详细设计维护者 / 用户 | 继续 Step 19;不得按旧 `03` 开工 |
| Step 8 Command 数量统一为 23 | 影响正式 `03` protocol inventory 和后续 `07` 阅读清单 | 详细设计维护者 | Step 19 统一修正,不在实现侧自行解释 |
| `04-配置设计.md` 是否生成 | 影响 config schema、profile、adapter binding、secret / env 口径 | 配置设计维护者 | 不在代码中补完整 config 真相源 |
| `05-测试方案.md` / `06-验收标准.md` 是否按新版 `03` 复核 | 影响测试矩阵、release gate、evidence 和 veto | 测试 / 验收维护者 | 不引用旧用例作为新版实现门禁 |
| `07-实施计划.md` 是否生成并完成逐 boundary 审计 | 影响 phase / commit boundary、提交规范、经验复核和永久记忆种子 | 实施计划维护者 | 不自行拆 phase、commit 或提交计划 |
| 目标实现仓路径和创建方式 | `/home/aris/Projects/quantalithos-governance` 当前未发现 | 实施计划维护者 / 实现 agent | PH-01 前暂停代码写入 |
| core baseline 和 `core-contracts` 可用性 | shared type 是否与设计匹配未复核 | core 负责人 / 实现 agent | 开工前检查;缺失即暂停 |
| durable store / broker / HTTP / search 产品选择 | 影响 durable adapter、migration、integration test 和部署 | 架构 / 配置 / 实施计划维护者 | P0 用 fake / in-memory |
| metric backend / DLQ / diagnostic store | 影响运维证据和真实恢复链路 | 运维 / bus / worker / infra 负责人 | 只实现安全字段、marker 和 fake disposition |
| redaction checker 扫描规则 | 影响脚本验收完整性 | 测试方案维护者 / 实现 agent | 只保留脚本契约和 forbidden field 清单 |
| 首批真实相邻仓 adapter 接入范围 | 影响 integration test 和验收范围 | 相邻仓负责人 / 实施计划维护者 | 使用 fake / fixture,真实 adapter 后续 phase 接入 |
| external GRC export target | 影响 export job 的真实 adapter 和格式 | external GRC owner / 实施计划维护者 | 默认 disabled / fake,不写死产品格式 |

## 12. 未确认前实现处理规则

| 场景 | 处理规则 |
|---|---|
| 正式 `03` 未生成 | 不恢复旧 `03`;不正式移交实现;继续 Step 19 |
| `04/05/06/07` 未同步 | 不把旧测试、验收、配置或 phase 口径交给实现者 |
| 实现仓未确认 | 不写代码、不提交实现仓 commit |
| phase / commit boundary 不清楚 | 不自行拆分;等待正式 `07` |
| 字段 / DTO / 状态 / flow 缺口 | 暂停并回写对应 design Step;不得在代码中补 placeholder |
| 上游 typed contract 缺失 | 暂停对应代码;不得复制上游类型 |
| 运行期依赖不可用 | 使用 fake / fixture / stub,并保留正式 failure / marker 语义 |
| durable 产品未定 | 不把 DB / broker / search 产品选择写入 domain / application |
| 观测后端未定 | 输出 Step 15 安全字段,不得保存 forbidden body |
| redaction 规则未定 | 不声称最终 redaction gate 通过,只实现基础契约 |
| external GRC 未定 | 保持 disabled / fake target,不得把外部产品文档格式写进 core truth |

## 13. 回填草稿

> 校准来源:
> - `design-calibration/03_ddd_step_18_risks_open_questions.md`

正式 `03-详细设计.md` §17 应回填:

- 风险判断基线。
- 已关闭风险不再列入表。
- 风险表。
- 待确认事项表。
- 未确认前实现处理规则。

回填要求:

- 不得把不确定项写成对象字段、协议字段、状态转换、配置默认值、产品选择或 commit boundary。
- 必须标明旧 `03` 只作诊断,Step 19 正式 `03` 才是新版详细设计入口。
- 必须标明 Step 8 Command 数量漂移由 Step 19 统一修正为 23 Command。
- 必须标明 `04/05/06/07` 是正式实现移交前的下游门禁。
- 已由 Step 6~17 闭合的字段、DTO、状态、flow、metadata、idempotency、config binding、observability 和 test cut 风险不得重复写成待确认事项。

## 14. 进入下一步条件

| 条件 | 状态 | 说明 |
|---|---|---|
| 未关闭事项均有记录 | 通过 | 见 §10 / §11 |
| 会阻塞实现的事项已标注阻塞范围 | 通过 | 风险表包含 `阻塞范围` |
| 未确认前处理方式明确 | 通过 | 见 §12 |
| 未把不确定项写成已确认契约 | 通过 | 本 Step 不新增 schema / state / phase / config 默认值 |
| 可进入 Step 19 | 通过 | 下一步装配正式 `03-详细设计.md` |
