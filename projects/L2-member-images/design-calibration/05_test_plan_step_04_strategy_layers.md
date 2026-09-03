# L2-member-images 05 测试方案 Step 4：测试策略与分层

> 状态：`completed`
> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 4
> 回填位置：正式 `05-测试方案.md` 第 4 章

## 0. Step 状态与输入

| 项目 | 记录 |
|---|---|
| 本步目标 | 按风险最早可发现的位置分配测试层级，避免把状态、UoW、配置和脱敏风险推迟到 E2E。 |
| 本步输入 | Step 3；03 Step 16 测试切口、Step 17 实施交接、Step 13/15；04 Step 12 下游承接；L1-governance Step 4/15 粒度参照。 |
| 本步输出 | 测试分层图、层级职责/时机/阻断表、切口映射和 E2E 使用边界。 |
| gate_status | `pass_with_explicit_blockers` |

## 1. 测试分层图

#### 测试分层图: L2-member-images 测试金字塔

```text
[Release / evidence gate]
  - cross-entry smoke, redaction scan, dependency scan, evidence index
                    ^
[API / Worker / Job entry contract]
  - logical DTO/error/marker/action boundary; no transport assumption
                    ^
[Controlled integration]
  - repository/version/UoW/projection/config/adapter failure mapping
                    ^
[Application service]
  - command/query/job ordering, idempotency, no-write and no-truth-repair
                    ^
[Contract + domain unit]
  - typed refs, DTO, guards, states, static/live and append/supersede rules
```

关键说明:

- 越靠下越适合发现局部字段、状态和不变量错误；越靠上只验证组合和证据链。
- 当前 Command/Job 的 accepted mutation、inbound accepted path 和 external positive result 不进入 gate 通过条件，直到 blocker 关闭并重开设计。
- 图不表达已存在实现、部署进程、真实 registry/bus、container 或运行结果。

## 2. 分层表

| 层级 | 目标 | 典型内容 | 执行时机 | 失败处理 |
|---|---|---|---|---|
| Contract/Unit | DTO、typed ref、domain guard/state、redaction helper | roundtrip、缺字段、非法 transition、body rejection | PR/CI | P0 阻断 |
| Application service | 编排顺序和 no-write | command/job B01 stop、query no-write、idempotency template | PR/CI | P0 阻断 |
| Controlled integration | store/UoW/version、projection、config、fake/adapter | rollback、commit unknown、freshness marker、strict JSON、failure mapping | CI/nightly | P0 阻断；P1 缺口记录 |
| API/Worker/Job entry | logical protocol 边界 | handler mapping、marker-only inbound、bounded job scope | CI | P0 阻断 |
| E2E/release gate | 最小跨入口和证据汇总 | local composition、cross-entry smoke、redaction/dependency scan | future staging/release | 无环境则 blocked，不得伪 pass |

## 3. 切口到层级映射

| 切口 | 首要层级 | 辅助层级 | 不应由 E2E 替代的断言 |
|---|---|---|---|
| contracts/domain | Unit/Contract | Entry | 精确错误、正式 enum、字段来源 |
| Command/Job orchestration | Service | Entry/Integration | UoW 顺序、reserve/replay、zero-effect |
| Query no-write | Service | Entry | 无 save、无 gap creation、无 refresh/rebuild |
| repository/UoW/projection | Integration | Service | version、rollback、Unavailable recovery blocker |
| config/redaction | Config/Integration | Release gate | unknown key、secret/raw body 不输出 |
| inbound/outbound boundary | Entry/Contract | Release scan | `accepted_input=false`、outbound zero inventory |

## 4. 改动前后对比与取舍

旧材料倾向“先写端到端主流程”；本轮采用分层左移，E2E 只作组合和证据汇总。采用 fake/controlled adapter 只验证 failure mapping 和 no-fallback，不把 fake outcome 作为真实 build/Artifact/consumer 成功。

## 5. 回填草稿与待确认事项

正式 §4 回填上图、分层表和切口映射。性能、staging 和真实外部 adapter 的阈值/环境仍待 owner 与运维正式输入；没有这些输入时层级保持 planned/blocked。进入 Step 5 的条件是所有 P0 切口均有首要层级、执行时机和失败处理。
