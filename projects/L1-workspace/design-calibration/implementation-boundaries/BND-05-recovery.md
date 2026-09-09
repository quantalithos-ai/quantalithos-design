# BND-05-recovery 实施边界台账（blocked）

| 字段 | 计划值 |
|---|---|
| status | blocked |
| phase | PH-05 |
| design_baseline | pending baseline/replay/durable decision |
| required_reads | 03 §8~12；05 REC/STATE/TXN；06 §8/11；07 Step5/6/9 |
| allowed_scope | future local phase/state/fault mechanisms after gate |
| forbidden_scope | old projection as baseline, unsafe cutover, auto loop, terminal revival, archive recovery |
| required_checks | one phase/batch, basis fence, CAS, generation role/safety, invalidation atomicity |
| commit_gate | blocked until WS-UP-001/002 and WS-LOCAL-001 |
| handoff_gate | future durable/conformance raw/report and review |
| blockers | WS-UP-001/002、WS-LOCAL-001 |
| next_allowed_action | wait_for_external_seams |
