# L2-member-images 05 测试方案 Step 11：缺陷管理与复验规则

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 11
> 回填位置：正式 `05-测试方案.md` 第 11 章

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 定义缺陷分级、阻断/风险接受边界、修复后的最小复验集和设计回写规则。 |
| 本步输入 | Step 1~10；03 Step 18 风险；04 Step 11/14；测试方案规范 §5.11。 |
| 本步输出 | 严重级别表、复验矩阵、缺陷生命周期和 reopen 规则。 |
| gate_status | `pass_with_explicit_blockers` |

## 1. SOP 问题回答

| 问题 | 收敛回答 |
|---|---|
| 哪些是阻断缺陷？ | 违反 VETO、Query 写入、inbound accepted input、outbound 非零、raw secret/body 泄露、静默 fallback、错误 owner truth、非法 state/版本/幂等语义均为 S 级。 |
| 设计 blocker 如何记？ | 用 `DDD-*`、`MI-UP-*`、`Q-MI-*`、`PF-*` 标记为 `blocked/pending`，不当作实现 bug，也不以通过/关闭替代。 |
| 修复后如何复验？ | 先重跑失败 TC，再跑其设计契约的邻接状态、同一协议族、跨层 no-write/redaction 和受影响证据索引；若改变字段/状态/port/error，先回写 03/04。 |
| 何时关闭？ | 只有新的固定 run 产生可审计结果、报告和审查意见后才能关闭；当前不生成任何结果。 |

## 2. 缺陷严重级别

| 级别 | 定义 | 示例 | 处理要求 | 是否阻断 |
|---|---|---|---|---|
| `S` | 一票否决或安全/真相边界破坏 | raw secret/body、Query write、fake pass、staged ready、outbound unauthorized | 立即阻断；修复并全量 P0 回归；不得风险接受 | 是 |
| `A` | P0 主线契约或一致性失败但未直接越过 VETO | version/UoW/replay、状态迁移、strict config、缺失错误映射 | 修复后受影响族回归；是否接受须由 06 owner 裁决 | 通常是 |
| `B` | 非核心可用性、文档或诊断缺陷 | safe reason 文案、非关键报告格式、future P1 seam | 排期修复；不改变 P0 结论 | 否 |
| `C` | 纯编辑/格式问题 | 链接、表格排版、拼写 | 文档修订并复核 | 否 |

## 3. 复验矩阵

| 缺陷触点 | 首先复验 | 必须追加 | 设计回写条件 |
|---|---|---|---|
| contracts/DTO | 同协议 roundtrip、missing/unknown | API/worker/job entry mapping | 字段/schema/error 改动 -> 03 Step 8 |
| domain/state | 原合法/非法 transition | 相邻 terminal/replacement、history | enum/factory/guard 改动 -> 03 Step 6/10 |
| application/UoW | 原 TC、rollback/replay | concurrency、commit unknown、query no-write | flow/store/idempotency 改动 -> 03 Step 7/9/11~13 |
| infra/config | 原 profile/source case | redaction、startup freeze、failure matrix | key/source/builder/error 改动 -> 03/04 |
| worker/jobs | marker/bounded scope | no scheduler/receipt/repair、duplicate | inbound/job contract 改动 -> 03 Step 8/9 |
| evidence/report | 原 EV mapping | path、redaction、TC→AC index | evidence schema/threshold 改动 -> 05/06 重开 |

## 4. 缺陷生命周期与禁止动作

```text
planned/blocked -> observed (future run only) -> triaged -> fixed or accepted -> retested -> closed
```

关键说明：当前仅允许记录 planned blocker；不得填写 observed run、owner signoff、修复 commit、报告链接或 close 结论。缺陷修复不能通过修改测试 oracle 来消除正式设计冲突；若设计真相改变，必须先重开相应 calibration Step。

## 5. 改动前后、取舍与回填草稿

旧材料没有稳定严重级别和复验链；本轮将安全/VETO 与普通缺陷分开，并把 blocker 与 defect 分离。正式 §11 回填级别表、复验矩阵和设计回写门禁。

## 6. 待确认事项与进入下一步条件

最终缺陷工具、通知渠道、SLA 和风险接受角色留给实施/运维/06 owner；不在本方案编造。进入 Step 12 的条件是每类缺陷有判定、阻断、复验和回写动作。
