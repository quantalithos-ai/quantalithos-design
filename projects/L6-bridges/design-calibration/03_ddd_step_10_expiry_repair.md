# L6-bridges 03 Step10：S10-LOCAL-001 最小修补

## 1. 开工与门禁

2026-10-03；用户“同意 并完成接下来 全部03”确认 Step10 并授权必要前序修补及剩余 Step11~19。当前仅 repair 校准写入，正式03装配须 Step19 准入；不扩至04/07/实施/测试/提交。当前 agent 独立串行，不调用代理。

已回读项目台账、03 flow、Step10 M12、Step6 retention/Dedup、Step7 Config/UoW/snapshot/callable/Infra、Step8 J05、Step9 J05及共享提交合同；通则§1、中间产物§3.4~3.5、真相源§3.5.5~6/§5.1~2、全局依赖§4.1。Step11 SOP/书写§5.10仅用于后续准入准备，不提前创建其文件。

[范围基线](03_ddd_completion_scope_baseline.json)在首次写入前捕获117个 Bridges 文件及4678个其他文件聚合摘要；排除目录与 recipe 详见 JSON。旧审计计数是历史 checkpoint，不继承为本轮结果。

| 模块 | 问题/诊断/取舍 | 合同/草稿 | 自检 | gate_status | 下一动作 |
|---|---|---|---|---|---|
| R1 retention authority / J05 consumption | done | done | pass_design_static | pass | 进入X重审 |
| X repair audit | done | done | pass_design_static | pass | 进入Step11 |

## 2. R1 可审查设计记录

问题：`DedupRecord.expire`有完整签名和三条状态边，但没有取得 `RetentionExpiryBasisRef` 的 port，J05 还明确排除 Dedup。TTL、clock、job.basis及结构工厂均不能证明到期维护授权。

诊断：正式01的本地 retention/window 责任及02§9允许 J05 维护支持本地过期；没有上游授予 Bridges 删除键、清除未知效果或定义全局 retention policy 的依据。Observability 的 retention/protection 是其自有事实，不是 Bridges expiry authority；Policy/Gate 的适用性仍需正式 owner 边界，BR-UP-003/006/009不关闭。

采用：在既有 `ConfigQualificationPort` 增一个具名核验方法；既有 `BridgeQualificationSnapshot` 增 `Dedup(BridgeVersioned<DedupRecord>)`，J05 Request/input不加字段，沿原 selector/expected/key/meaning/UoW 合同执行。Config adapter 消费 current approved 本地 retention config、原 window basis、实际维护 actor/scope 与 Policy/Gate 适用性；缺任何正式来源返回非 Qualified。结构厂只重建 opaque proof，不签发 authority。

未采用：只在 J02/J03/J04 末尾附带 expiry；它不能覆盖没有 recovery/handoff 的 Reserved 记录。未采用 timer 直接改表或新增第六 Job/第24业务 port；前者绕授权和审计，后者扩大已有维护主轴。复杂度：一组窄修补，无新 model/state/wire body；分来源、协议、flow、状态与静态重审批次。

## 3. 合同修订与回填草稿

完整来源：Step6 shared RetentionExpiryBasisRef、Domain DedupRecord、Application Plan；Step7 Config trait/十一variant snapshot/Infra adapter/callable测试承接；Step8 J05九body族；Step9 shared/J05两key/CAS/资格/expire/stage；Step10 M12三边。没有新增类型、state、业务port、Job或wire字段。

草稿：J05选择既有非Expired目标，input expected/原key/meaning优先；actual完整row/window+批准retention config/maintenance actor/scope+Policy/Gate适用性由具名port核验，Qualified proof与原到期窗口独立。目标expire只state/local修改，原key/meaning/business op/result/window与unknown责任保留；本Job独立reservation/seed/audit/op在同U提交，seal限定exact Qualification关联及完整CAS。缺资格零U，commit未知只原mutation权威读，零重execute。

跨层修正：Plan原“same op”细化为本次reservation/seed/audit同Job op，已有维护目标保原业务op，禁止通用异op写；否则source取得虽有，seal仍不可调用。原Request/input/五selector/五execute及23业务port保持，新增仅已有port的一个方法与已有enum一个variant。

## 4. 实际重审

实际Node只读设计文本检查：Step6~10共33 Markdown、1276表、611围栏块、89相对文件链接，格式/存在性errors=[]；BridgeQualificationSnapshot十一variant逐项核对，协议/flow不再拒绝Dedup，资格->expire->stage均实际存在。人工核三边、proof来源/窗口、两key/op分离、Plan限定及零删除/未知保留/Query no-write。`git diff --check -- projects/L6-bridges/`通过，cached为空。

S10-LOCAL-001=`closed_design_contract`；仅本地取得/触发断口关闭。BR-UP-001~009=open、010=reference_only，Workspace/Observability原资格、四平台/SDK/OAuth/API Key/KMS/router/driver未选未建立不变；外部current不足仍Blocked/NotEstablished，没有账号、运行、投递、测试或readiness。

过程事实：一次不匹配zsh glob、一次审计模板backtick语法错误均未落盘；改精确文件/函数式只读扫描后真实重跑。初稿误写不存在NotApplicable资格variant已改原Blocked；统计是修补后本轮检查，不借旧checkpoint。

## 5. 当前恢复点

```text
current_document = 03
current_step = 10
current_module = expiry_repair_complete
step_status = done
gate_status = pass
gate_reason = local_expiry_contract_reaudit_pass_external_gates_open
next_allowed_action = enter_step11
targeted_repair_allowed = false
calibration_write_allowed = false
formal_document_write_allowed = false
implementation_write_allowed = false
implementation_ledger_allowed = false
test_execution_allowed = false
commit_required = false
```
