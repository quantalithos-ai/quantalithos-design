# BND-03-local-surface 实施边界台账（planned）

| 字段 | 计划值 |
|---|---|
| status | planned |
| phase | PH-03 |
| design_baseline | pending; depends_on BND-02 |
| required_reads | 03 §7~10/12；04 §7~11；05 QRY/COMMAND/TXN/IDEM；06 §5/8 |
| allowed_scope | future local store port, Command/Query application and thin API handlers |
| forbidden_scope | owner mutation, event producer, implicit refresh, durable finality, archive |
| required_checks | seven-write spy, CAS, replay, local transaction and API surface tests |
| commit_gate | required checks future and exact boundary diff |
| handoff_gate | future hash/raw/report plus unresolved relation/durable blockers |
| blockers | scope relation, durable driver, implementation repo |
| next_allowed_action | wait_until_current |
