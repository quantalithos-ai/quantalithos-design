# BND-02-contract-domain 实施边界台账（planned）

| 字段 | 计划值 |
|---|---|
| status | planned |
| phase | PH-02 |
| design_baseline | pending; depends_on BND-01 |
| required_reads | 03 §5~10；05 CONTRACT/OBJECT/STATE；06 §5/8；07 Step6 |
| allowed_scope | future contracts/domain crates and local tests |
| forbidden_scope | owner/event schema, adapters, persistence driver, API transport, durable claims |
| required_checks | contract roundtrip, wrong-kind, object/state invariant tests |
| commit_gate | BND-02 tests and static checks future; user authorization required |
| handoff_gate | future hash, test raw/report, blockers, next boundary |
| blockers | BND-01; WS-UP-007 contract slot |
| next_allowed_action | wait_until_current |
