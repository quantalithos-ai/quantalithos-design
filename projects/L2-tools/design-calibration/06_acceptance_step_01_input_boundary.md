# 06 验收标准校准 · Step 1 输入边界

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 1
- 回填章节：正式 `06-验收标准.md` §1

### 1.1 Step 内计划

- [x] 读取输入和前序结论：当前正式 `00~05`、项目 ledger、验收 SOP/书写规范、通用标准
- [x] SOP 问题回答：固定需求、设计、测试、交付和环境输入
- [x] 当前材料 / 旧文档诊断：识别旧 06 的历史定位、章节和事实污染
- [x] 设计取舍：确定验收标准与测试方案、实施计划、真实执行记录的边界
- [x] 结构化中间产物：输入权威映射、证据消费链、禁止回答项和 blocker 矩阵
- [x] 复杂度判断 / 是否拆模块或附录：本步使用主表；证据 schema 细节后移 Step 3/10
- [x] 回填草稿：形成 §1 可直接装配的结论
- [x] 自检与进入下一步条件：无孤儿输入、无未经授权事实、Step 2 可启动

## 2. 本步输入

### 2.1 上游文档

| 输入 | 当前效力 | 本步用途 |
|---|---|---|
| `projects/L2-tools/00-需求文档.md` | current formal | 需求、FR/BR/DR/NFR、`AC-L2T-001~039`、`VF-L2T-001~013`、风险与 blocker |
| `projects/L2-tools/01-架构设计.md` | current formal | owner、写权、依赖类型、系统边界、local-truth-first 和非目标 |
| `projects/L2-tools/02-概要设计.md` | current formal | 六业务组成部分、公共协议轮廓、核心流与对象边界 |
| `projects/L2-tools/03-详细设计.md` | current formal | exact object/field、protocol、flow、state、UoW、error、idempotency、redaction 和 test cuts |
| `projects/L2-tools/04-配置设计.md` | current formal | config root/item、profile、source、V/B gate、sensitivity、failure 与下游验收输入 |
| `projects/L2-tools/05-测试方案.md` | current formal | 234 concrete TC、dataset/profile、suite/gate/check、artifact/report/evidence 和 residual |
| `projects/L2-tools/README.md` | historical_material | 只用于旧定位污染审计，不进入验收 oracle |
| 旧 `projects/L2-tools/06-验收标准.md` | historical_material | 只用于差异审计，不继承其验收项、阈值、签署或结论 |

### 2.2 已确认的执行事实边界

| 项 | 当前事实 |
|---|---|
| 真实送验版本 | 未提供；不写 commit/build/image 实例 |
| 测试 run | 未执行；不写 run_id、artifact digest、report digest 或 evidence alias |
| 验收结论 | 未形成；不写通过、有条件通过、不通过实例 |
| 缺陷 / 风险签署 | 未提供；不写 BUG、接受人、签署日期或 readiness |
| release seal | 仅消费合同已在 05 固定；没有实际 `gate-summary.json` |

## 3. SOP 问题回答

1. **本轮验收依据哪些需求和设计？**

   回答：依据当前正式 `00~05`。需求分母是 `AC-L2T-001~039` 和 `VF-L2T-001~013`；架构负责 owner/依赖/写权；概要负责组成部分和处理流轮廓；详细设计负责可落码字段、协议、状态、事务、错误和边界；配置负责配置绑定与安全门禁；测试方案负责 concrete TC、执行层级和证据生产合同。旧 06 不具有当前效力。

2. **哪些测试证据会支撑验收裁决？**

   回答：只消费一个固定 release `run_id` 的 `gate-summary.json`、同 run `evidence-index.json`、suite/case raw artifact、`reports/runs/<run_id>/...` 以及 release 绑定的 `reports/acceptance/projection-manifest.json` 和四个固定 projection 文件。`EV-CAND-L2T-*` 只是 planned slot；pre-check index 的 derivation 不能直接成为验收资格。

3. **哪些交付版本、环境和数据会成为基线？**

   回答：由 Step 3 固定：文档 baseline、送验交付标识、`04` canonical profile、`05` canonical dataset / negative corpus、单一 release run、同 run artifact/report pairing、blocked ledger digest 和 acceptance projection manifest。当前没有实例，不能以 `latest`、项目目录嵌套路径或跨 run 拼接代替。

4. **哪些内容属于测试方案或实施计划，不应写进验收标准？**

   回答：测试用例详细步骤、fixture 生成命令、CI 脚本实现、runner 调度、实际执行结果和 raw 日志属于 `05`/实施执行；实施计划的 commit、boundary、implementation ledger 和代码状态属于 `07`。06 只规定可裁决的门禁、证据消费、缺陷/风险/签署规则，不创建实现任务或执行事实。

5. **是否存在阻塞验收标准生成的上游缺口？**

   回答：没有阻塞 06 文档合同生成的新增 blocker。`L2T-UP-001~009` 继续开放：受影响的 provider / authorization / Sandbox / Observability / Core shared schema / SDK positive qualification 必须是 blocked、conditional 或 unavailable；local、negative、redaction、no-write、unknown-fence 和边界验收仍可定义。开放状态不得被写成 ready 或已通过。

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 当前判断 | 影响 |
|---|---|---|---|
| 旧 `06-验收标准.md` §1~§3 | 只有背景、基线和进入/退出的简略描述 | historical_material | 无法承接当前 15 章主链和两阶段证据 |
| 旧 §4 | 旧功能项使用 `ToolPolicy`、`ToolScope`、host callback 等历史对象 | 废弃 | 会把 runtime / sandbox / authorization truth 吸入 L2 |
| 旧 §5~§7 | 非功能、三红线、安全门禁混排，缺 formal AC/VF/TC/EV 回链 | 重建 | 无法逐项裁决，也无法区分数据红线、接口、状态和证据门禁 |
| 旧 §8~§10 | 使用无 authority 的 100% 阈值、空结论框和旧签署语义 | 废弃 | 伪造量化依据或验收事实风险 |
| 05 §13~§14 | 已固定 candidate / final evidence 两阶段、release seal 和 residual handoff | current input | 06 必须消费 final seal，不能回读 candidate slot 当资格 |
| README / 上游旧描述 | Python 同进程、builtin/MCP/extras、旧 provider 线索 | historical_material | 不进入当前验收范围或 evidence 分母 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 输入权威 | 旧 06 自己列少量对象和阈值 | 由 `00~05` 分层提供需求、owner、契约、配置和证据生产合同 | 防止验收文档成为第二真相源 |
| 证据入口 | 模糊“测试报告 / 日志” | fixed release run + raw/report pairing + final seal + projection manifest | 可复查且禁止跨 run 拼证 |
| candidate EV | 可被理解为已存在证据 | `EV-CAND-L2T-*` 仅 planned slot，实例需由运行事实派生 | 防止静态造 evidence |
| blocker | 旧文档未定义 | `L2T-UP-001~009` 保持 open，影响路径 fail-closed / conditional | 保留上游 ownership，不伪造 readiness |
| 正式结构 | 10 章旧结构 | 15 章规范结构，Step 15 整体替换 | 与当前验收 SOP 和参考项目一致 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 直接沿用旧 06 并追加新表 | 写入快 | 历史对象、旧阈值和新证据模型混杂；无法证明章节完整 | 不采用 |
| 让 06 自行生成新的测试项和 evidence ID | 表面上闭环 | 会与 05 的 234 concrete TC 和 candidate slot 分叉 | 不采用 |
| 以 `00~05` 为分层输入，06 只定义裁决合同 | 追溯稳定，能隔离执行事实和上游 blocker | 需要后续 Step 逐项建立映射 | 采用 |

## 7. 结构化中间产物

### 7.1 输入权威映射

| 验收决策 | 唯一输入 | 06 可做 | 06 不可做 |
|---|---|---|---|
| 需求是否覆盖 | `00` AC/FR/BR/DR/NFR/VF | 将正式需求转成门禁并保留 ID | 改写需求、删除 AC/VF |
| 边界是否成立 | `01` owner/依赖/ownership；`02` composition | 定义红线和接缝裁决 | 拥有 Runtime/Hub/Sandbox/Obs/SDK truth |
| 具体契约是否成立 | `03` exact schema/flow/state/error | 引用正式字段、状态和 flow | 发明字段、状态、topic 或 port |
| 配置是否安全 | `04` schema/profile/V/B/NC | 定义配置验收门禁 | 新增 key、默认值或 threshold |
| 证据是否可消费 | `05` TC/suite/check/seal/manifest | 定义 release seal consumer 和结论映射 | 生成 run、digest、结果或签署 |
| 实施是否可放行 | future `07` | 规定进入下一阶段的结论语义 | 预写 commit、boundary、implementation ledger |

### 7.2 证据消费链

```text
formal 00~04 contracts + 05 concrete cases
  -> one release run/profile
  -> raw cases / suite reports / fixed checks
  -> evidence-index.json (derivation only)
  -> release gate-summary.json (final eligibility + seal)
  -> four acceptance staging files
  -> projection-manifest.json (written last; digest binding)
  -> 06 gate evaluation / veto / risk / final decision
```

06 对每个 P0 gate 要求能从 `gate-summary.json` 回指 case、suite、report 和 raw artifact；如果 release seal 不存在、context/profile/run 不匹配、manifest digest 不匹配、redaction 或 check integrity 失败，则该 gate 不可判定或 invalid，不得升级为通过。

### 7.3 禁止回答项

| 不在本步 / 本文回答 | 权威归属 |
|---|---|
| 测试如何编排、fixture 如何生成、脚本如何实现 | `05` / implementation execution |
| 实际 run、artifact、digest、测试结果 | test runner / CI |
| 代码 boundary、commit、实现仓 baseline | `07` |
| 外部 authorization / Sandbox / delivery / Observability readiness | 对应上游 owner |
| 真实签署、风险接受、发布批准 | 未来验收执行者 / authorized roles |

### 7.4 Blocker 影响矩阵

| Blocker | 06 允许裁决 | 06 必须保持不可裁决 / blocked |
|---|---|---|
| `L2T-UP-001~002` | 本地 requirement 分类、缺失/冲突 fail-closed、no-self-authorization | external authorization positive、taxonomy readiness |
| `L2T-UP-003~004` | Prepared/unknown fence、mapping blocked、无 host fallback、local handoff attempt | Sandbox run/receipt/capture/cleanup positive |
| `L2T-UP-005~007` | body-free safe material、local attempt、redaction/status separation | Observability route/producer/delivery/observed/readiness |
| `L2T-UP-008` | generic shared type candidate boundary、无复制 schema | tools-specific Core schema/package authority |
| `L2T-UP-009` | server-side protocol and future-consumer prohibition | SDK tools-specific client qualification |

## 8. 回填草稿

正式 §1 应声明：本验收标准以当前正式 `00~05` 为输入，分别消费需求、架构、概要、详细、配置和测试事实；旧 README/旧 06/旧执行叙事是 historical material。验收证据只能来自单一固定 release run 的 final gate seal 及其同 run raw/report/projection manifest；candidate slot、测试计划和 draft handoff 不构成验收结果。06 不重新定义需求、接口、实现或外部 owner truth，也不声明任何实际 run、结果、签署或 readiness。`L2T-UP-001~009` 继续以 blocked/conditional/unavailable 进入后续裁决。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| 真实送验 commit/build/image 和 release run | 影响 Step 3 基线与最终结论 | 保留占位字段，未提供前不可进入实际验收 |
| authorized acceptance / risk signer 名单 | 影响 Step 13/14 | 只定义角色合同，不填写姓名或签署 |
| `L2T-UP-001~009` owner closure | 影响 conditional-provider / readiness | 保持开放；不阻塞本文档结构设计 |

## 10. 进入下一步条件

- [x] 输入权威、历史材料和不回答边界已固定。
- [x] 证据消费链明确为 single release seal，无 candidate-to-verdict 直通。
- [x] 上游 blocker 无新增且有 fail-closed / conditional 承接。
- [x] 正式 §1 回填草稿不包含测试结果、签署或实现事实。
- [x] 允许进入 Step 2：定义验收目标与范围。
