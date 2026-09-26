# Boundary commit-08-a · PH-08 Gates, reports and acceptance handoff

> 这是 planned/blocked/waiting skeleton。它不是代码变更授权，也不是 commit、测试或证据记录。

## Boundary Header

| 项 | 值 |
|---|---|
| boundary | `commit-08-a` |
| phase | `PH-08 Gates, reports and acceptance handoff` |
| boundary_status | `blocked` |
| formal plan | `projects/L5-sync/07-实施计划.md` |
| implementation repo | `/home/aris/Projects/quantalithos-sync`（absent / not_created） |
| design baseline | `not approved / not recorded` |
| gate | `GATE-15` |
| next allowed action | `wait_design` / user review and blocker resolution |

## Required Reads

- `projects/L5-sync/07-实施计划.md` §3、§5、§6、§7、§10～§12。
- `projects/L5-sync/00-需求文档.md`～`06-验收标准.md` 中与本 boundary 对应章节。
- 05 §9/§13；目录规范。
- 当前项目 `design-calibration/project_execution_ledger.md`、`implementation_execution_ledger.md` 和本目录前序/相邻 boundary ledger。
- 实施前必须读取目标技术栈、提交规范和目录组织规范；当前未锁定 runtime/package/parser/runner。

## Allowed Scope

fixed-run gate scripts; artifact/report index/link/redaction checks。

- 仅可在正式设计已定义的对象、字段、状态、port、配置和证据路径内工作。
- 只可创建与本 boundary 对应的实现、测试或脚本文件；不得越过下一 boundary。
- 所有 mutation 必须遵循 explicit selection、permission check、UoW/idempotency、dirty/path safety 和 provenance 保护。

## Forbidden Scope

final verdict; signoff; readiness; fabricated EV。

- 不创建或修改 Project、Artifact、Baseline、Review Gate/Decision、Workspace projection、Archive 或 Git remote truth。
- 不自动 merge/rebase/push/stash；不覆盖用户未提交修改；不删除或伪造 provenance metadata。
- 不把 local Git commit、上传 ACK、HTTP 200、remote object、cache、telemetry、job report 或 fake/mock 结果当作平台 truth、accepted、evidence、readiness 或 signoff。
- 不运行未授权测试、不安装依赖、不创建真实 artifact/report/evidence，不提交 commit。

## Gate Matrix

| Gate | 计划检查 | 当前状态 | 失败处置 |
|---|---|---|---|
| Design Gate | required reads、字段/DTO/state/ref/metadata/phase closure | `blocked` | 回写正式真相源，刷新 baseline |
| Scope Gate | allowed scope、用户工作区保护 | `waiting` | 停止并保留用户改动 |
| Build Gate | 目标 runtime/package/类型或脚本检查 | `blocked` | 保留 blocker，不猜工具链 |
| Test Gate | GATE-15 对应 TC/SUITE/negative cuts | `waiting` | 不生成结果，未来固定 run 重跑 |
| Evidence Gate | fixed `<run_id>` pairing、redaction、link audit | `planned` | 保留失败 run，不用 latest 覆盖 |
| Commit Gate | staged scope、message、whitespace、design sync | `waiting` | 当前不提交 |
| Handoff Gate | blocker、next boundary、未运行测试、用户改动 | `blocked` | 不移交下一 boundary |

## Commit Record

| 项 | 当前值 |
|---|---|
| planned commit | not created |
| actual hash | absent / must not be fabricated |
| title/body | 见正式 07 §11 的 boundary mapping |
| staged diff | absent |
| command/test result | absent / test execution forbidden |
| artifact/report/evidence | absent |
| review verdict/signoff/readiness | not applicable / not claimed |

## Blockers

### Continuous blockers

```text
SYNC-UP-001~010
SYNC-LOCAL-001~005
TARGET-REPO-001  /home/aris/Projects/quantalithos-sync absent / not_created
DESIGN-BASELINE-001  当前设计仓没有用户批准的实现移交 commit hash
```

### Boundary-specific blocker

- target runner and report schema。
- 本 boundary 的 boundary_status 只能在真实设计/工具/owner/readiness 条件满足后由授权实施者更新为 planned、blocked 或 waiting；不得写入 pass、complete、ready 或 signed_off。

## Handoff Notes

当前只能等待用户审查正式 07 和 blocker 解锁。任何后续动作必须先更新本 ledger、确认唯一 next boundary，并重新执行 required reads；未知 external effect 必须 probe/manual，不得 blind replay。
