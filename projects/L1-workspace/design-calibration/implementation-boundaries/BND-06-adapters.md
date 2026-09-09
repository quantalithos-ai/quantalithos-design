# BND-06-adapters 实施边界台账（blocked）

| 字段 | 计划值 |
|---|---|
| status | blocked |
| phase | PH-06 |
| design_baseline | pending driver/transport/crypto baseline |
| required_reads | 03 §10/13~15；04 §5~13；05 §8~10；06 §6/9/10 |
| allowed_scope | future strict config, controlled adapter, redaction/dependency checks |
| forbidden_scope | production fake fallback, unpinned crypto, unapproved secret, arbitrary endpoint/schema |
| required_checks | CONFIG/RES/PAGE/SEC/DEP/BOUND suites |
| commit_gate | blocked until WS-LOCAL-002/003 and exact binding |
| handoff_gate | future profile/manifest/raw/report review |
| blockers | WS-LOCAL-002/003 |
| next_allowed_action | wait_for_local_prerequisites |
