# BND-04-projection 实施边界台账（blocked）

| 字段 | 计划值 |
|---|---|
| status | blocked |
| phase | PH-04 |
| design_baseline | pending external event baseline |
| required_reads | 03 §7~12；05 SRC/INBOX/TXN/IDEM；06 §7/8/11；07 Step8/9 |
| allowed_scope | future local classifier/projector/fault tests only after gate |
| forbidden_scope | invented event identity/order/replay proof, owner attention, bus ACK, outbound event |
| required_checks | source classification, gap nonterminal, unknown pending, duplicate, Inbox lifecycle |
| commit_gate | blocked until WS-UP-001~004/007 formal slots |
| handoff_gate | future manifest/run/report; no fake promotion |
| blockers | WS-UP-001~004、WS-UP-007 |
| next_allowed_action | wait_for_external_seams |
