# 04 Step 12：定义测试、验收、实施与运维承接

## 1. Step状态

2026-10-02；`completed / selfcheck_done / stop_review`。本步只定义04向05/06/07及运维资料的输入，不提前创建测试case、实施台账或boundary skeleton。

## 2. 本步目标

**目标**：把配置设计交给后续文档时需要的矩阵、门禁和证据边界说清楚，同时保持“设计结论≠已执行结果”。

### 本步输入

Step6 profile矩阵、Step7清单、Step9校验、Step10变更、Step11失败策略、03§15～§17状态与实施承接。

### 本步输出

后续文档承接表、配置测试切口、验收门禁输入、实施/运维边界和真实性限制，回填正式04§12。

## 3. 应问的问题与SOP回答

1. **05应验证什么？** 来源优先级、严格JSON和unknown key拒绝、七字段映射、八slot集合、正值/关系边界、secret redaction、四profile姿态、startup/build-time、故障和回滚负例。
2. **06应裁决什么？** 必填配置是否存在、禁止键是否拒绝、生产fake是否一票否决、受影响owner资格是否保持Blocked，以及配置通过不等于业务ready。
3. **07应承接什么？** 按六域、profile、loader/builder、secret/provider和资格gate创建planned实现边界和实施ledger；正式07之前不得创建这些实现台账。
4. **运维资料应补什么？** 环境文件生成、secret注入/轮换、重启、保留/审计和告警处置；04不写命令、面板或值班排期。
5. **证据上限是什么？** 本轮只有文档静态设计；不伪造测试run、配置包、digest、扫描/签名、支付、evidence、verdict、signoff或readiness。

### 当前材料问题诊断与取舍

旧材料容易把配置设计直接当成测试、实施或部署结果。采用“04给矩阵和门禁输入，05/06/07分别验证/裁决/实施”的承接方式；本轮不创建case、run、implementation ledger或boundary skeleton。

### 改动前后对比

| 之前 | 本步后 |
|---|---|
| 下游承接靠口头说明 | 以05/06/07/运维矩阵逐项交付 |
| 设计占位符可能被读成证据 | 明确planned/not-run/blocked上限 |
| 配置和业务验收混合 | 04提供条件，06做pass/fail裁决 |

## 4. 下游承接矩阵

| 下游 | 04提供 | 下游继续回答 | 当前状态 |
|---|---|---|---|
| `05-测试方案.md` | 七字段/八slot清单、四profile、正负配置场景、失败姿态 | fixture、case、执行、报告和覆盖矩阵 | 尚未启动 |
| `06-验收标准.md` | 必填/禁止键/生产fake/secret redaction/能力阻断门禁 | pass/fail、一票否决和可接受风险 | 尚未启动 |
| `07-实施计划.md` | 配置域、loader/builder、provider、profile和外部blocker阅读入口 | phase、task、commit boundary、implementation ledger/skeleton | 尚未启动 |
| 部署/运维资料 | startup/build-time、快照、轮换、回滚、审计字段 | 具体平台注入、命令、拓扑、告警和值班 | 不在本项目本轮创建 |
| 上游owner/SDK | slot/ref/资格失败边界 | exact consumer、schema、probe、provider合同 | pending/blocked |

## 5. 配置测试切口（仅计划输入）

| 切口 | 期望验证 | 证据上限 |
|---|---|---|
| 来源冲突 | path双入口不同、重复键、未知域/键拒绝 | 未来05测试结果；本轮无run |
| 七字段映射 | envelope metadata不进入RuntimeConfig，locale仅En/Zh | 未来05结构断言 |
| owner set | 八kind唯一、缺slotBlocked、disposition不由文件提供 | 未来05/06门禁 |
| 资源关系 | batch/lease正值、profile上限和溢出拒绝 | Q-MP-01确认后才有数值边界 |
| secrets | raw值不进入JSON/日志/Web，ref provider失败 | 未来安全测试；provider未选定 |
| profile | local/test/staging/production姿态差异，production不fake | 未来矩阵执行 |
| failure/recovery | last-known-good、startup清理、Unknown probe-first | 复用03状态/错误契约 |

## 6. 实施与运维边界

04不创建实现仓、Cargo/npm lock、部署文件、secret包、实施ledger、boundary skeleton或运行报告。正式07完成时，实施者必须先阅读04对应Step7/9/11/14/15和03§13；在外部资格未闭合前，边界只能标`planned/blocked/waiting`。

运维只可将经过审查的JSON快照和ref注入受控环境；不得通过临时env绕过schema或把`auto_approve`等未知键加入文件。secret轮换、重启和回滚须保留旧快照/审计摘要，不能改变业务状态或重放外部effect。

## 7. 详细设计影响判定

| 配置结论 | 是否影响03 | 影响类型 | 03回写位置 | 处理状态 |
|---|---|---|---|---|
| 05/06/07承接清单和证据上限 | 否 | 文档交接 | 03§15～§17已有边界 | 无回写 |
| 不提前创建实现ledger/skeleton | 否 | 实施门禁 | 03§16已有planned状态 | 无回写 |
| 配置测试只验证loader/姿态，不生成业务真相 | 否 | 测试边界 | 03§15已有定义 | 无回写 |

## 8. 回填草稿、待确认与进入下一步条件

正式§12回填承接矩阵、测试切口和真实性限制；不写case编号、run、验收结论或实施commit。待确认：05/06/07正式授权、Q-MP-01预算、provider和owner qualification，进入Step14。

进入Step13条件：每个配置结论都有后续消费者和证据上限；后续文档不会把设计占位符误读为已运行事实。
