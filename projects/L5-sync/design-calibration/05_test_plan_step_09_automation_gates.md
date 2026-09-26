# Step 9. 设计自动化与 CI/CD 门禁

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 9。
> 回填章节：未来正式 `05-测试方案.md` §9。
> 本步只定义 semantic suite、门禁顺序和阻断语义；不创建脚本、runner、CI 配置或执行结果。

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | 9 / automation_gates |
| Step 状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 直接下一步 | Step 10：设计专项测试与非功能验证 |
| 持续 blocker | `SYNC-UP-001~010`、`SYNC-LOCAL-001~005` |

## 1A. 本步输入

- Step 5 的 coverage matrix、Step 6 的 case registry、Step 7 的 dataset classes、Step 8 的 profile/config matrix。
- `03-详细设计.md` §15 的 evidence ceiling 和 `04-配置设计.md` §12 的 planned downstream handoff。

## 1B. 旧材料诊断与改动前后对比

| 维度 | 旧材料 | 当前门禁方案 |
|---|---|---|
| 自动化入口 | 直接写具体 runner/CI 命令 | semantic suite；runner/package/CI 保持 pending |
| gate 结果 | blocked/skipped 容易被看成 pass | `blocked/waiting` 原样保留，失败原因和 blocker 可追踪 |
| CI 权限 | 可能隐含 push/merge | 只读测试/报告，不改变 Git/Review truth |

## 1C. 测试设计取舍

1. G0～G4 先验证可在 local composition 发现的风险；G5 只在 owner/tool/store contract 闭合后开放。
2. suite ID、路径和最小字段先于工具选择，防止 `SYNC-LOCAL-*` 未闭合时生成假命令。
3. 证据 packaging 是独立 G7，不以报告生成成功代替业务 suite 通过。

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 自动化 suite 如何分组？ | 按风险和证据边界分为 static、unit/property、contract、flow/fault、adapter seam、entry/operations、redaction/config、release summary。 |
| CI 先后顺序？ | static/dependency → schema/config/redaction → unit/state → application flow/idempotency → controlled adapter → entry smoke → evidence packaging；上游 blocker 不被伪造为 pass。 |
| 哪些 gate 是 P0 必须？ | 静态边界、protocol、对象/state、Command/Query/consumer/job local flow、UoW/幂等/恢复、config/redaction、evidence path/schema validation。 |
| blocked suite 如何处理？ | suite 结果状态为 `blocked/waiting`，保留 blocker ID、缺失 contract 和所能证明的最小边界；不得转成 skipped-as-pass。 |
| CI/CD 能否自动 push/merge/accept？ | 不能。门禁只报告测试计划和结果分层，不执行 Git push/merge/rebase，不改变 Review Gate/Decision，不生成 readiness。 |

## 3. Semantic suite registry

| Suite ID | 责任 | 输入/层级 | 失败阻断 | 证据上限 |
|---|---|---|---|---|
| `SUITE-SYNC-STATIC` | dependency direction、forbidden remote/outbound event、shell/API surface | L1 | P0 blocking | planned static report |
| `SUITE-SYNC-PROTOCOL` | envelope/ref/result/page/body-free contract | L2/L5 | P0 blocking | contract report |
| `SUITE-SYNC-DOMAIN` | 29 object invariants、17 state transitions、policy/property | L2 | P0 blocking | unit report |
| `SUITE-SYNC-FLOW` | 10 Command、13 Query、flow order、write-set/zero-write | L3 | P0 blocking | flow report |
| `SUITE-SYNC-FAULT` | duplicate/version race/partial/unknown/commit ambiguity/recovery | L3 | P0 blocking | fault report |
| `SUITE-SYNC-CONFIG` | 42 leaf、4 profiles、strict source/activation/failure | L2/L3 | P0 blocking | config report |
| `SUITE-SYNC-REDACTION` | secret/body/path/stdout/provider response canary | L2/L6 | P0 blocking/VETO | redaction report |
| `SUITE-SYNC-ADAPTER` | SDK/source/access/review/probe/Git/fs/metadata contract | L4 | blocked/waiting unless contracts closed | adapter report ceiling |
| `SUITE-SYNC-OPS` | 3 Consumer、3 Job、receipt/report replay/no truth repair | L3/L5 | P0 local; external blocked | operations report |
| `SUITE-SYNC-ENTRY` | four CLI intents、explicit selection、safe presentation、exit disposition semantics | L5 | P0 planned/LOCAL pending | entry report |
| `SUITE-SYNC-SUMMARY` | cross-suite mapping、coverage/evidence path/schema audit | L6 | P0 packaging gate | summary only, no verdict |

## 4. Gate order与阻断规则

```text
G0 source/schema hygiene
  -> G1 architecture/static boundary
  -> G2 protocol/config/redaction
  -> G3 domain/state/property
  -> G4 application flow/UoW/idempotency/recovery
  -> G5 controlled adapter seam
  -> G6 entry/consumer/job smoke
  -> G7 evidence path + cross-suite traceability
```

| Gate | 必须满足 | blocked 规则 |
|---|---|---|
| G0 | 计划输入不含真实 secret/body/path，ID/path 格式合法 | violation 直接 P0 block |
| G1 | 无越界 import/remote/publisher/shell；domain→adapter 单向 | 任一 forbidden surface 直接 block |
| G2 | strict config、typed refs、body-free result、redaction | 高风险非法 fallback 或泄露直接 VETO block |
| G3 | 29 object、17 state、policy/property 全覆盖 | missing state/transition 或 terminal reopen 直接 block |
| G4 | prepare→effect→probe/finalize、write-set、Query zero-write、exact replay | order/write-set/unknown 错误直接 block |
| G5 | exact owner/tool/store contract 与隔离 fixture | contract 未闭合标 blocked/waiting，不转 pass |
| G6 | explicit CLI/consumer/job input/output、safe disposition | parser/bin 未确认可用 semantic contract；不伪造命令执行 |
| G7 | 追溯双向、计划路径/报告 schema、blocker/证据上限完整 | 缺映射/路径泄露/虚假 evidence 直接 block |

## 5. P0/P1/P2 自动化矩阵

| 优先级 | 自动化范围 | 进入条件 | 退出条件（设计级） |
|---|---|---|---|
| P0 | G0～G4、配置/redaction、local operations、dependency/static | local deterministic composition | 所有核心切口有 suite/case/data/证据计划；不填实际 pass |
| P1 | G5 controlled/real-like adapter、selected entry integration | owner/tool/store contract、fixture、环境隔离、权限已确认 | 未满足则 blocked/waiting |
| P2 | staging/production-like、容量/性能、LFS/浅克隆/GUI、批量增强 | 权威 workload、support matrix、06/07 gate | 当前 deferred，不纳入 P0 |

## 6. CI/CD artifact/report 计划

| 载体 | 规划路径 | 最小内容 | 不能包含 |
|---|---|---|---|
| suite artifact | `artifacts/test/<run_id>/` | suite manifest、case/disposition、redaction-safe metadata、failure summary | raw body/secret/full path/真实 provider response |
| run report | `reports/runs/<run_id>/` | run metadata、suite status、blocker IDs、stdout/stderr（若脱敏规则允许） | `latest`、project 子目录、伪造 test result |
| acceptance summary | `reports/acceptance/` | 供 06 消费的 planned mapping/evidence index | verdict/signoff/readiness 在 05 不填 |

路径不得使用 `artifacts/test/<project>/<run_id>` 或 `reports/<project>`；不得正式引用 `latest`。

## 7. 失败、重跑与并发门禁

- suite 失败保留原始（脱敏）failure reason、case IDs 和 blocker；不得覆盖历史 run。
- exact same run/case/digest 的重跑只能复用 stored local result，不能重发外部 effect；different digest 进入 conflict。
- unknown effect 只能进入 probe/manual suite，不能由 CI retry 自动重提。
- parallel suite 不能共享 mutable metadata namespace、idempotency store、clock 或 capability snapshot。
- sink/report packaging 失败不得改变业务 result，但必须使 evidence packaging gate 为 blocked/unknown。

## 8. 回填草稿（未来正式 §9）

05 自动化以 G0～G7 顺序组织 semantic suites。P0 先锁静态边界、协议/配置/redaction、对象/状态和 application flow；P1 external adapter 只有在合同、fixture 和环境闭合后才可运行；P2 未来能力不阻断核心设计。所有 suite/report 路径和状态只作为计划，不代表 runner、CI、run、结果或 readiness 已存在。

## 9. 待确认事项

| 事项 | 处理 |
|---|---|
| CI provider / workflow syntax | 由 07/实现仓决定；05 不创建 pipeline 文件。 |
| runner / coverage tool / report formatter | `SYNC-LOCAL-004` pending；只锁 semantic suite 与最小 schema。 |
| stdout/stderr 保留策略 | 需 09/安全确认 redaction；默认不存 raw provider/tool output。 |
| blocked suite 的组织规则 | 需 06/07 确认；本轮使用显式 `blocked/waiting`。 |

## 10. Step 自检与进入下一步门禁

| 检查项 | 结果 |
|---|---|
| suite registry、gate order、P0/P1/P2 划分明确 | pass |
| CI 不执行 push/merge/accept/readiness | pass |
| blocker/unknown/重跑规则保留真实性 | pass_with_upstream_blockers |
| 未创建脚本、workflow、run 或报告实例 | pass |
| 允许进入 Step 10 | pass |

## 11. 下一步门禁

Step 10 必须在不新增业务 truth 的前提下，定义安全、可靠性、幂等、恢复、性能、容量、可观测性和兼容性专项测试；任何性能数字需要权威 workload，否则只能写相对/待定指标。
