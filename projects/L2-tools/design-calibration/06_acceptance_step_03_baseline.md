# 06 验收标准校准 · Step 3 验收基线

## 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 3
- 回填章节：正式 `06-验收标准.md` §3

### 1.1 Step 内计划

- [x] 读取输入和前序结论：Step 1~2、正式 05 §7~§9/§13~§14、04 profile/config contract
- [x] SOP 问题回答：文档、测试、交付、环境、数据、run、artifact/report/projection 路径
- [x] 当前材料 / 旧文档诊断：消除“最新版”、静态报告和跨 run 拼接口径
- [x] 设计取舍：区分 baseline contract、baseline instance 和当前未绑定状态
- [x] 结构化中间产物：baseline tuple、seal predicate、projection snapshot、漂移/re-run 规则
- [x] 复杂度判断 / 是否拆模块或附录：不拆；evidence completeness 在 Step 10 展开
- [x] 回填草稿：形成 §3 可装配基线合同
- [x] 自检与进入下一步条件：无伪造 ID/digest/commit，路径与 05 一致

## 2. 本步输入

| 输入 | 已确认结论 |
|---|---|
| Step 1 | 06 只消费 matching passed release seal 和同 run projection；candidate/index derivation 不等 eligibility |
| Step 2 | P0 local denominator 与 P1/P2 分离；conditional positive 不能替代 P0 release qualification |
| 正式 04 §6~§9 | `ci-test` 是 release P0 profile；configuration 只能由 safe projection/digest 表达，不保存 raw secret/body |
| 正式 05 §7~§8 | 18 canonical dataset、6 negative/recovery corpus、canonical profile 和 topology 均需 manifest 化 |
| 正式 05 §9 | release 使用单一 `ci-test` run；11 P0 owning suite + same-run `release-local-smoke`；11 mandatory checks |
| 正式 05 §13 | raw/report/index/seal/manifest schema、digest、writer order和 fixed paths 已冻结 |
| 正式 05 §14 | `L2T-RR-001~016` 保持 residual；当前无实现 run 或 verdict |

## 3. SOP 问题回答

1. **按哪一版需求和设计验收？**

   回答：实际验收时必须创建不可变 `design_baseline`，逐项绑定当前正式 `00~06` 的 source ref 和 exact-byte digest，或绑定包含这些文件的 immutable committed source ref；不得写“当前/最新”。本次文档设计没有 commit baseline，不能伪造；当前只固定路径和绑定规则。

2. **按哪一版测试方案和测试结果裁决？**

   回答：测试方案固定为 current formal `05-测试方案.md` 的 exact source/digest。结果只接受一个 matching `gate_id=release`、`config_profile=ci-test`、`status=passed` 的 `gate-summary.json`；该 seal 必须绑定同 run index、suite reports、11 checks 和 acceptance manifest。

3. **送验 build / commit / image 是什么？**

   回答：当前未提供，baseline instance 字段为 `not_bound`，不是空字符串或虚构 ID。实际验收进入前必须绑定目标实现 source ref 和一个可重现交付标识；实现仓目前不存在属于 `L2T-RR-012`，不影响 06 合同完成但阻止实际验收。

4. **环境、配置、数据和依赖是什么？**

   回答：P0 release 环境固定 `ci-test`；配置通过 `meta/config-digest.json` 的 redacted safe projection 和 digest 绑定；数据通过同 run dataset manifest 绑定 18 canonical datasets、6 corpora、deterministic clock/ID registry；依赖状态通过 frozen blocked ledger、source status 和 profile topology 绑定。raw config、secret、endpoint body 不入验收基线。

5. **基线变更如何处理？**

   回答：任何正式文档、实现、config safe projection、dataset、profile、suite/check denominator、blocker snapshot、artifact/report schema、manifest 文件或 scope 变化都必须创建新的 baseline instance 和新的 release run；旧 run 不覆盖、不择优拼接。仅 reviewer 解释补充可在相同 source tuple 后 append，不改变 seal。

6. **本轮验收固定的 `run_id` 是什么？**

   回答：当前没有。实际执行时由 release gate 提供 opaque、non-empty、非 `latest` 的唯一 `run_id`，并在所有 raw/report/staging/manifest/seal 路径和字段中一致。

7. **原始机器证据是否位于 `artifacts/test/<run_id>`？**

   回答：必须是。禁止 project 子目录、另一个 run 或 reports 路径作为 raw root。

8. **人类可读报告是否位于 `reports/runs/<run_id>`？**

   回答：必须是。report 必须回指同 run raw artifact/digest；`reports/runs/<run_id>/acceptance-draft` 是 pre-seal staging，不是 verdict。

9. **验收交接文件是否位于 `reports/acceptance/`？**

   回答：四个 fixed Markdown 和 `projection-manifest.json` 必须位于该目录，并由 matching release run publisher 写入；consumer 必须按 M1 -> seal/index/four staged+published snapshots -> M2 读取，确认 manifest digest 未漂移后只使用已捕获 bytes。

10. **是否存在不可作为正式基线的路径？**

   回答：`latest`、`artifacts/test/<project>/<run_id>`、`reports/<project>`、跨 run/profile report、`single_suite` seal、conditional-provider seal、静态 candidate 映射、旧 fixed projection、没有 manifest 的 fixed files均不可作为正式 P0 基线。

## 4. 当前文档问题诊断

| 旧位置 / 材料 | 问题 | 当前修正 |
|---|---|---|
| 旧 06 §2 | 只列需求/设计/代码版本，无 digest、status 或绑定规则 | 改为完整 baseline tuple 与 `not_bound` 语义 |
| 旧 06 §2 | 测试证据写成泛化报告 | 固定 release seal/index/raw/report/manifest 路径和 predicate |
| 旧 06 | 没有 profile、dataset、blocker 或 config identity | 纳入 immutable baseline tuple |
| 旧 06 | 没有基线漂移和新 run 规则 | 任一裁决输入变化必须新 baseline + new run |
| 旧 06 | fixed acceptance Markdown 可被直接读取 | 只有 manifest + matching passed seal 共同存在且 double-read 稳定才可消费 |

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 版本标识 | 版本号/最新代码 | immutable source ref + exact digest；缺失=`not_bound` | 可复核且不伪造 commit |
| 结果基线 | 泛化测试报告 | one release run/profile/final seal | 禁止 cross-run cherry-pick |
| Evidence | 报告存在即可能通过 | final seal eligibility + full raw/report/check pairing | candidate/index 不越权 |
| Acceptance files | 手工或脚本文件 | manifest-last exact-byte projection + matching seal | 防 mixed working projection |
| 变更 | 原地更新结论 | new baseline + new run；旧事实 append-only 保留 | 防覆盖失败历史 |

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 当前直接填写一个 run/commit | 文档看似完整 | 属于伪造事实 | 不采用 |
| 只写占位符 `<version>` | 简单 | 不能判定缺失的影响和绑定方式 | 不采用 |
| 定义 typed baseline contract，并明确当前 `not_bound` | 可执行、诚实、支持未来实例化 | 文档不会产生即时 verdict | 采用 |
| 合并 release 与 conditional-provider 多 run | 可增加正向覆盖 | 违反 05 single-run eligibility，产生择优拼证 | 不采用 |

## 7. 结构化中间产物

### 7.1 Acceptance baseline tuple

未来 baseline instance 必须原子绑定以下字段组；任一 required 字段缺失时，实际验收不得进入。

| Baseline field | Required value / source | 当前状态 | 缺失或不匹配 |
|---|---|---|---|
| `acceptance_baseline_ref` | acceptance owner 分配的 opaque immutable ref，非 `latest` | `not_bound` | entry blocked |
| `scope_manifest_ref/digest` | 本轮 P0/P1/P2/excluded scope 的 safe immutable manifest | `not_bound` | entry blocked |
| `design_source_set` | 正式 `00~06` 每文件 path + exact digest / immutable source ref | 仅 paths 已知 | `L2T-RR-007`;entry blocked |
| `implementation_source_ref` | 可定位实现 source baseline | `not_available` | `L2T-RR-012`;entry blocked |
| `delivery_ref` | build/package/image 等本轮唯一交付标识 | `not_bound` | entry blocked |
| `config_profile` | 固定 `ci-test` | contract fixed | 其它值不属于 P0 release baseline |
| `config_safe_ref/digest` | `meta/config-digest.json` verified safe projection | `not_bound` | unavailable/invalid；不能 hash raw secret |
| `dataset_manifest_ref/digest` | 18 canonical + 6 corpora + deterministic primitives | `not_bound` | invalid/incomplete denominator |
| `blocked_ledger_ref/digest` | 本 run 冻结的 `L2T-UP-001~009` safe projection | design list exists; digest not bound | blocker truth check fails |
| `release_run_id` | opaque/non-empty/non-`latest` | `not_bound` | no acceptance run |
| `release_gate_summary_ref/digest` | `artifacts/test/<run_id>/gate-summary.json` | `not_bound` | no final eligibility |
| `evidence_index_ref/digest` | `artifacts/test/<run_id>/evidence-index.json` bound by seal | `not_bound` | invalid seal |
| `projection_manifest_ref/digest` | `reports/acceptance/projection-manifest.json` bound by seal | `not_bound` | whole fixed projection invalid |
| `review_version/source_tuple` | append-only review tuple keyed by run/index/seal digest | `not_bound` | risk/signoff review incomplete |

### 7.2 Release seal acceptance predicate

```text
release_seal_acceptable :=
  schema/self-digest valid
  AND gate_id = release
  AND config_profile = ci-test
  AND status = passed
  AND same run/profile/context everywhere
  AND suite_report_refs cover 11 P0 owning suites
  AND same-run release-local-smoke aggregate is present
  AND check_refs equal the exact 11-check release closed set
  AND every referenced report/check digest verifies
  AND evidence_index_ref/digest verify in the same run
  AND evidence_eligibility slot set/order equals successful index
  AND acceptance_projection_status = published
  AND projection manifest ref/digest verify
  AND redaction_status = clean
```

`status=passed` 只表示 release test gate 完整，不等于验收通过。06 仍需逐 AC/VF 解释 eligible/pending/ineligible/unavailable/invalid、缺陷和风险。

### 7.3 Fixed paths and purposes

| Entry | Fixed path | Baseline purpose | Forbidden substitute |
|---|---|---|---|
| raw root | `artifacts/test/<run_id>/` | machine truth | `artifacts/test/<project>/<run_id>` |
| final seal | `artifacts/test/<run_id>/gate-summary.json` | final eligibility source | index item / summary Markdown |
| pre-check index | `artifacts/test/<run_id>/evidence-index.json` | trace derivation | final eligibility |
| human reports | `reports/runs/<run_id>/...` | review/readability | no raw pairing |
| staging | `reports/runs/<run_id>/acceptance-draft/*.md` | exact release projection source | verdict/signoff |
| manifest | `reports/acceptance/projection-manifest.json` | publication marker and four-file binding | file mtime / directory existence |
| fixed handoff | `reports/acceptance/handoff.md` | reviewed scope handoff input | manual unbound file |
| fixed VETO | `reports/acceptance/veto-checklist.md` | VF review input | oral confirmation |
| fixed risk | `reports/acceptance/risk-acceptance.md` | risk proposal/record input | accepted risk without signer |
| fixed issues | `reports/acceptance/open-issues.md` | blocker/residual/defect input | hidden issue list |
| review | `reports/review/reviewer-notes.md`;`agent-review.md` | append-only explanation | machine eligibility rewrite |

### 7.4 Projection snapshot consumer algorithm

```text
1. Read manifest as snapshot M1 and verify schema/self-digest.
2. Read matching release seal, index, four run staging files and four fixed files.
3. Verify run/index/seal tuple, ordered roles, paths, front matter and exact-byte digests.
4. Read manifest again as M2 and require digest(M1) = digest(M2).
5. Use only captured bytes from step 2 for this decision; do not reopen mutable paths.
6. Any missing/mixed/drift => whole projection invalid; do not fall back to prior fixed files.
```

### 7.5 Baseline drift matrix

| Drift | Required action | Old evidence |
|---|---|---|
| formal 00~06 content/digest changes | new design baseline + affected full release run | retained, not promoted |
| implementation/delivery changes | new delivery ref + new release run | retained |
| config/profile/dataset changes | new config/data digest + new release run | retained |
| suite/check/EV registry/schema changes | update 05 first, then new full release run | old schema not merged |
| blocker closes/reopens | freeze new blocker ledger; run affected negative first; future positive cannot replace release | old blocked status retained |
| reviewer explanation correction | append superseding review block on same tuple | machine seal unchanged |
| defect fix | new fixed run and impact-defined regression; never overwrite failed run | original failure retained |

## 8. 回填草稿

正式 §3 应列出 baseline tuple、release seal predicate、fixed paths、projection snapshot algorithm 和 drift matrix。文档必须明确当前 `acceptance_baseline_ref`、implementation/delivery、run、digests 和 review tuple 均未绑定，本文没有实际验收资格或结论。实际验收只接受单一 `ci-test` release run；conditional-provider、integration、single-suite、nightly 或其它 run 不得与其拼接。任何 required baseline 缺失先判定“不可进入验收”，而不是填空、用 `latest` 或复用旧 fixed projection。

## 9. 待确认事项

| 事项 | 影响 | 当前处理 |
|---|---|---|
| immutable design/implementation source ref | 重现性与 `L2T-RR-007/012` | 实际验收前 required；当前不伪造 |
| delivery artifact kind | build/package/image 绑定方式 | 由 07/实现与 release owner 固定 |
| evidence retention policy | 失败 run 和复验材料保留 | `L2T-RR-013`，Step 13 继续处理 |
| conditional positive future qualification | provider readiness | 当前证据合同不允许拼入 P0 release；需先更新正式 05/06 baseline |

## 10. 进入下一步条件

- [x] 文档、实现、交付、环境、配置、数据、依赖和证据 baseline 字段齐全。
- [x] release seal predicate 与 05 的 single-run/two-stage evidence 一致。
- [x] raw/report/acceptance/review 路径固定且无 `latest`/project nesting。
- [x] 当前所有未绑定实例均显式，不包含伪造 commit/run/digest/verdict。
- [x] 允许进入 Step 4：定义进入、暂停和退出条件。
