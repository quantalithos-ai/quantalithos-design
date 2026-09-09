# BND-07-entry-evidence 实施边界台账（planned）

| 字段 | 计划值 |
|---|---|
| status | planned |
| phase | PH-07 |
| design_baseline | pending; depends_on BND-03~06 |
| required_reads | 03 §4/7~8；05 §9/13/14；06 §7/10/14；07 Step7/11 |
| allowed_scope | future API/worker/jobs composition and gate/report script capability |
| forbidden_scope | real event/durable claim, static EV pass, verdict/signoff/readiness |
| required_checks | entry suites, report-integrity, redaction, dependency; fixed run required |
| commit_gate | no user commit authorization currently |
| handoff_gate | future script/report review; acceptance drafts human/Agent reviewed |
| blockers | implementation repo; prior boundaries |
| next_allowed_action | wait_until_current |
