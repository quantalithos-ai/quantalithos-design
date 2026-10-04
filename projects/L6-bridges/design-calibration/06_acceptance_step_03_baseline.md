# L6-bridges 06 Step3：验收基线

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step3 / 书写§5.3；回填正式06§3。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| baseline | pass | design_static_only_external_gates_open | enter_step_4 | Step2范围/全部未决；05§8/9/13固定run schema/路径及三计划registry；验收SOP Step3、书写§5.3/4.4/5.10和真相源§7。 |

### 1.1 Step内计划

| 小阶段 | 状态 | 产物位置 |
|---|---|---|
| 读取输入和前序结论 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前材料诊断 | done | §4/5 |
| 验收裁决取舍 | done | §6 |
| 结构化中间产物 | done | §7 |
| 复杂度判断 | done | §6 |
| 回填草稿 | done | §8 |
| 实际自检和下一条件 | done | §10 |

### 1.2 整体模块骨架

两模块：设计可定位hash基线；未来真实送验/固定run证据入口。hash不是commit或run。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§3已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

```text
formal_backfill_gate_status = blocked
formal_backfill_gate_reason = formal_06_complete_wait_for_user_confirmation
formal_backfill_next_allowed_action = wait_for_user_confirmation_of_06
formal_document_write_allowed = false
next_document_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 2. 本步输入

Step2范围/全部未决；05§8/9/13固定run schema/路径及三计划registry；验收SOP Step3、书写§5.3/4.4/5.10和真相源§7。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1. 按当前用户认可00~05设计及06规范；记录文件SHA256只是设计内容指纹。
2. 05方案与其三registry/schema为计划输入；实际case/suite/report/EV必须另由真实runner产生。
3. 没有真实Bridges源码commit/build/image，均未建立，不填伪hash。
4. 五环境与批准safe config/DS/selected seam/actual pin责任须真实提供；raw配置/secret不归档。
5. 任何source/设计/config/profile/selection/工具/expected实例变化暂停，影响矩阵复核，新run不得复制旧pass。
6. 当前没有run_id，未来固定实际run且符合05 grammar，不能造例run。
7. raw只artifacts/test/<run_id>/且是安全harness输出，不是raw外部事件。
8. 人读reports/runs/<run_id>/和EVjson/md。
9. 05已固定reports/acceptance/<run_id>/与review/<run_id>/；按规范§5.10等价固定入口，不建global alias。
10. latest/跨run/项目层/绝对临时路径/symlink均拒；不存在handoff就是准入缺口。

## 4. 当前材料问题诊断

05§13 RunContext.design_baseline恰含00~05，不可为了06新增字段破冻结schema；06标准版本由独立人工审查基线记录，实际交付全空。

## 5. 改动前后对比

| 项 | 当前输入 | 06基线 | 原因 |
|---|---|---|---|
| 设计hash | 已有正式工作区文件 | content SHA256明确design-only | 不伪commit |
| 六doc context | 05唯一schema | 保00~05，另记06标准hash于人工裁决材料 | 不漂schema |
| 路径示例 | 通用acceptance无run示例 | 已批准fixed-run细化 | 不覆盖可复查入口 |

## 6. 验收裁决取舍与复杂度

| 方案 | 判断 |
|---|---|
| 实际送验固定run/实现基线+独立06内容指纹 | 采用；与05一致 |
| 将当前designhash当实现commit/造sample run | 不采用；证据伪造 |

复杂度：设计源小表、证据入口和变化规则可同文件；runtime schema不重复定义，Step10精确承接。

## 7. 结构化中间产物

### 3.1 设计基线与送验基线

当前下表为design-only内容指纹，不是Git commit/实现baseline/运行artifact；真实送验前必须核对认可范围与固定不可变基线。

| 当前正式设计 | SHA256（完整文件bytes） |
|---|---|
| [00-需求文档.md](../00-需求文档.md) | `9c6ce1341d26e98569d388b7c76020fd51d50aefe893515dd2c25741bbc45758` |
| [01-架构设计.md](../01-架构设计.md) | `6512efba587efaada2e5c85e154826337c59c605162a5c25ae6ba507d96e515d` |
| [02-概要设计.md](../02-概要设计.md) | `32b69909ad38d93a5546025c13495cb02fc01729d6774787389e5c39742bef8d` |
| [03-详细设计.md](../03-详细设计.md) | `9c728ee3922a4b2ef1b6ecb8d76d363474824ffff33afe86c8e8573c7ee9699e` |
| [04-配置设计.md](../04-配置设计.md) | `159be410ad7681210489ac6dddf17bf194a816ee372ae000cd4b4b627f6a3fef` |
| [05-测试方案.md](../05-测试方案.md) | `d668ca10f254789302c40663d5b97c46218d0f59d226fa86f5f42819212d7301` |

| 基线类型 | 必须固定字段/正式源 | 当前事实/缺失处理 |
|---|---|---|
| 需求/设计/测试 | 00~05 doc hash；03/04当前合同；05 case/state/evidence registry与harness schema hash | 只有design计划；漂移需源审，不沿旧run |
| 06标准 | 本标准版本及完整文件SHA256，独立人工审查记录 | 待正式装配后形成；不扩05 RunContext六doc schema |
| 实现/交付 | actual source_revision/source_tree_sha256/build/tool digest；image若被实际选用须具名不可变标识 | 未建立；缺任一所选基线blocked，不填占位成功 |
| 环境/配置 | 05 ExecutionContext mode/context_id/config_safe+hash、批准harness_profile；实际04current与qualification槽 | 五env/二mode合同存在，实际profile/资格未建；只有限安全标签 |
| 数据/实例 | DS及实际已实现/批准expected instance manifest，完整参数/路由/assertion IDs | 22DS planned；缺实例blocked，不用静态计划造passed |
| selected依赖 | actual package/pin/export、四平台scope/method、六owner/probe/producer、store/executor/secret/route准入 | 当前BR-UP/WS/affected仍open；私有basis经授权渠道核验，不入证据值 |
| run/review | 实际run_id、ReportIndex/source index的同run digest、实际assignment及06审查版本 | 当前不存在；waiting/not_evaluated |

### 3.2 固定证据入口

| 入口 | 唯一计划路径 | 用途/缺失处理 |
|---|---|---|
| safe机器材料 | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr | 05 exact DTO/bytes/closure；缺case只missing，不补造 |
| 两check | `artifacts/test/<run_id>/checks/run-context.json`与`test-evidence.json` | 实际工具/身份/status/input digest；未运行不clean |
| run报告/EV | `reports/runs/<run_id>/index.json`、`summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md`与`evidence/<EV-ID>.json`/`.md` | 优先人读，反查机器原始安全输出 |
| handoff | `reports/acceptance/<run_id>/handoff.json`/`.md` | 05 draft_for_review，不是通过或signoff |
| veto/risk/issue | `reports/acceptance/<run_id>/veto-checklist.md`、`risk-acceptance.md`、`open-issues.md` | 自动只清单初稿；授权人审按06规则补，不默认接受/未触发 |
| review | `reports/review/<run_id>/review.json`、`reviewer-notes.md` | 05无验收verdict的实际review；最终裁决权另见§14 |

05已批准的acceptance/review按fixed `<run_id>`细化通用规范§4.4入口，符合§5.10允许等价固定否决清单；禁止global/latest可变别名。raw artifact仅原始**安全harness输出**，绝不是外部body/token/敏感内容或其可还原摘要。schema/路径不新造runtime实例。

### 3.3 基线变化

run_id必须真实且唯一，语法沿05 `br-YYYYMMDDTHHMMSSZ-<6..12 loweralnum>`；不写例实例。禁止latest、`artifacts/test/<project>/<run_id>`、`reports/<project>`、absolute/.. /symlink/跨run复制。变更设计、source、config/current、scope/pin、expected实例、schema/工具、authority任一轴，暂停相关裁决；回owning来源和05§14回归，新run保旧安全失败/业务原unknown责任。06不可在同run悄补P0或把旧fake升级real。

## 8. 回填草稿

正式06§3按书写规范直接摘录§7规范段；章节名为“验收基线”。只补具名校准来源及延伸阅读链接，不搬§3~6诊断/取舍或§10自检状态，不新增结论。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。六正式设计文件实际SHA256已读取并记录；未填写实现commit/run；固定路径与05 schema及规范等价入口核对。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_4。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
