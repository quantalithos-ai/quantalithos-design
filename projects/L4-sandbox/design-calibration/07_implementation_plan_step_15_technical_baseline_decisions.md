# L4-sandbox 最终设计闭环 Step 15 技术基线决策

> 对应临时执行计划: `/tmp/L4-sandbox_final_design_closure_execution_plan.md` `DC-02`
> 上游裁决: `07_implementation_plan_step_14_final_design_closure_disposition.md`
> 状态: `completed_design_selection_pending_activation_verification`
> 当前文档: `07-实施计划.md`
> 当前 Step: `Step 15 / DC-02 技术基线决策`
> 范围: 固定实现 agent 不得自行选择的 Rust/core、RFC 8785 和 Shell/lint 设计口径；不创建目标仓、不写代码、不运行目标测试、不生成 evidence 或验收事实。

---

## 1. 决策输入与现实观察

| 输入 | 观察 | 设计使用边界 |
|---|---|---|
| `/home/aris/Projects/quantalithos-core/Cargo.toml` | workspace edition `2024`、rust-version `1.93`、resolver `2` | 作为组织当前 Rust 兼容基线 |
| `/home/aris/Projects/quantalithos-core` | 2026-08-02 读取时 HEAD=`ef0d24941fe6e00c24d423ac330347e6e1acb2da`，worktree clean | 固定本次 Sandbox core contract source revision；不冒充目标仓已编译 |
| 本机 Rust | `rustc 1.93.0`、`cargo 1.93.0` | 证明设计选择可定位；不等于 Sandbox build pass |
| crates.io metadata | `serde_json_canonicalizer 0.3.2`，MIT，RFC 8785/JCS implementation，公开 `to_vec/to_string/to_writer` | 固定 canonical writer provider；下载元数据不等于依赖已进入目标仓 |
| 本机 crate source metadata | provider依赖 `serde 1.0`、`serde_json 1.0` + `float_roundtrip`；非有限浮点返回错误 | 定义输入约束与失败面 |
| 本机 core Cargo lock | `serde_json 1.0.145` | 与 core 当前依赖分辨率对齐 |
| 本机 `sha2` metadata | `sha2 0.10.9`，MIT OR Apache-2.0 | 固定 SHA-256 provider |
| 本机 Shell | GNU Bash `5.3.15`；ShellCheck absent | 固定 minimum dialect；实际 lint 工具仍是 Activation 依赖 |

`cargo info`/crate source读取只属于设计选择输入。没有创建目标 `Cargo.toml`、`Cargo.lock`、`rust-toolchain.toml`，也没有运行 Sandbox fixture。

---

## 2. Rust 与 core-contracts 基线

### 2.1 固定值

| 项 | current design decision | 实现约束 |
|---|---|---|
| target implementation repo | `/home/aris/Projects/quantalithos-sandbox` | 路径不变；当前仍 absent |
| Rust edition | `2024` | root workspace 固定 `[workspace.package] edition = "2024"`；members继承 workspace |
| rust-version | `1.93` | root workspace 固定 `[workspace.package] rust-version = "1.93"` |
| toolchain channel | `1.93.0` | future `rust-toolchain.toml` 使用 exact channel，components至少 `rustfmt`,`clippy` |
| Cargo resolver | `2` | root workspace固定；不得由 member 覆盖 |
| unique compile-time sibling | `core-contracts` | 其他 sibling repo compile dependency 数量必须为0 |
| current local source | `core-contracts = { path = "../quantalithos-core/crates/contracts" }` | P0本地多仓基线；不得改成floating git branch、crates.io同名包或复制shared types |
| required core source revision | `ef0d24941fe6e00c24d423ac330347e6e1acb2da` | 01A开工时记录真实 core HEAD/worktree；不一致即暂停，不得自行跟随新HEAD |
| dependency lock | target root `Cargo.lock` committed | 所有第三方依赖通过lockfile复现；不得使用 `*`、floating git branch或无rev git dependency |

### 2.2 Activation 验证

`BLK-SBX-VERSION-001` 的“由设计 owner 选择版本”部分至此关闭。以下事实仍未执行并继续阻塞 `CB-SBX-01A`：

1. 目标实现仓存在且root manifest实际写入上述值。
2. `rustc --version`为`1.93.0`，`cargo --version`兼容；rustfmt/clippy可调用。
3. core source HEAD与required revision一致且worktree状态已记录。
4. `core-contracts` package/lib导出与正式 `03` 所需shared types逐项可检索。
5. Cargo metadata/graph证明只有`core-contracts`是compile-time sibling。
6. `cargo check`和required selected checks真实通过。

任一失败均是 `open_activation_validation`；若 core API 与正式设计不一致，转 `wait_design`，不得用Sandbox私有同义type绕过。

---

## 3. RFC 8785 canonical machine artifact 决策

### 3.1 Provider 与依赖锁

| role | fixed dependency | owner |
|---|---|---|
| RFC 8785 serializer | `serde_json_canonicalizer = "=0.3.2"` | `tests/support` canonical artifact module；02C唯一writer/verifier owner |
| JSON value/parser | `serde_json = "=1.0.145"` with `float_roundtrip` | strict parser与typed schema serialization |
| SHA-256 | `sha2 = "=0.10.9"` | canonical digest helper；只hash canonical bytes |

版本必须同时进入target `Cargo.lock`。只有 `CB-SBX-02C` 可以建立canonical primitive；后续schema writer、report generator和`CB-SBX-14B`复用该owner，不得各自调用不同formatter或shell hash pipeline。

### 3.2 Writer 算法

```text
validated typed machine-artifact value
  -> assert schema numeric/string/path constraints
  -> material_for_digest = remove top-level artifact_digest only
  -> serde_json_canonicalizer::to_vec(material_for_digest)
  -> sha2::Sha256(canonical material bytes)
  -> artifact_digest = "sha256:" + 64 lowercase hex
  -> construct full typed artifact with artifact_digest
  -> serde_json_canonicalizer::to_vec(full artifact)
  -> atomic write under the fixed run-scoped relative path
```

Writer不得接受raw JSON string作为authoritative输入，不得依赖map insertion order、pretty formatter、`Debug`、`jq`、`sha256sum`或shell字符串拼接。写入失败不得留下可被reader当作完整artifact的目标文件。

### 3.3 Verifier 算法

```text
read bounded bytes
  -> require valid UTF-8 and no BOM
  -> strict recursive JSON parse with duplicate-member rejection
  -> reject trailing bytes other than no bytes (canonical files have no trailing newline)
  -> validate exact schema/status/path/forbidden-carrier constraints
  -> save supplied top-level artifact_digest
  -> remove top-level artifact_digest only
  -> RFC 8785 canonicalize material and recompute SHA-256
  -> constant/equivalent exact comparison with supplied lowercase digest
  -> RFC 8785 canonicalize full value
  -> require full canonical bytes exactly equal original bytes
```

Strict parsing使用 `serde_json::Deserializer` + recursive custom map visitor；每层object用seen-key set拒绝duplicate member，再形成 `serde_json::Value`。不得先用普通`serde_json::from_slice<Value>`吞掉duplicate key后再校验。

### 3.4 JSON 输入闭集

| 输入面 | current rule | 失败处置 |
|---|---|---|
| encoding | UTF-8，无BOM | Invalid/InfraFailed；保留原bytes的安全ref，不回显正文 |
| object members | 每层key唯一 | reject；不得last-write-wins |
| numbers | machine schema只允许其字段声明的整数范围；浮点、NaN、Infinity和arbitrary-precision外形均禁止 | schema failure；不进入digest |
| strings | validated Unicode string；schema继续限制enum/ref/path | invalid JSON/schema failure |
| arrays marked as sets | typed builder在serialization前排序和去重 | noncanonical/duplicate finding；verifier不静默重写 |
| paths | 仓根相对、无空段/`.`/`..`、无absolute、无symlink escape | path violation；不分配EV |
| self digest | 只排除root `artifact_digest` | nested同名字段不获隐式排除；schema未声明则失败 |

### 3.5 Required fixture contract

02C Build/Test/Evidence Gate至少包含：RFC 8785官方number/string/object vectors、key order/whitespace/noncanonical bytes、duplicate key（root与nested）、invalid UTF-8/BOM/trailing newline/trailing JSON、unsupported number、self-digest remove/reinsert、digest大小写/长度/算法marker、set排序去重、relative path escape、writer-reader roundtrip、原失败文件不被重写、redaction marker不回显。

这些是planned fixture，不是本轮测试结果。`BLK-SBX-CANONICAL-001` 的设计选型部分至此关闭；新的执行状态为 `canonical_provider_selected_fixture_not_run`，仍阻塞02C真实commit直至fixture通过。

---

## 4. Shell 与 lint 基线

### 4.1 Runtime 与静态检查

| 项 | fixed rule |
|---|---|
| interpreter | `#!/usr/bin/env bash` |
| minimum runtime | GNU Bash `>=5.2`；脚本入口启动时检查 `BASH_VERSINFO`，不足即`InfraFailed` |
| strict mode | shebang后的首个可执行设置为 `set -Eeuo pipefail`，随后`IFS=$'\n\t'`、`umask 077`、`LC_ALL=C` |
| syntax check | `bash -n <script>`，覆盖17/17正式脚本 |
| linter | ShellCheck `0.10.0`，命令 `shellcheck --shell=bash --severity=warning <scripts>` |
| suppression | 禁止全局exclude；单行disable必须紧邻、写英文原因、绑定exact SC code并经automation/security review |
| formatter | 本轮不引入shfmt权威；可读性由review和ShellCheck保证，避免出现第二format gate |

ShellCheck当前本机 absent，因此设计规则已固定但 lint 未运行。目标实现仓 Activation 时缺 `0.10.0` 记 `dependency_wait / handoff`，不得写N/A或用`bash -n`替代lint。

### 4.2 脚本安全规则

- 所有变量展开双引号；数组承载多参数；禁止用word splitting拼命令。
- 禁止`eval`、动态`source`、`curl | sh`、从artifact/raw body生成可执行命令，以及解释未经typed validation的路径。
- 临时文件位于当前run的受控临时目录，使用`mktemp`并注册`trap`；原raw失败材料只按正式retention/cleanup规则处理。
- 脚本只负责编排和状态传播；machine JSON、RFC 8785 bytes和digest必须调用02C Rust helper，不得用heredoc/`jq`/`printf`手写权威JSON。
- stdout/stderr只输出低敏、低基数、body-free诊断；secret、raw body、process output、provider response、stack、absolute sensitive path不得回显。
- 所有required input先验证再执行副作用；缺失不得创建静态report、EV或Passed文件。
- cleanup trap不得覆盖主体退出状态；必须保留first failure和cleanup disposition。

### 4.3 Process exit contract

| exit code | semantic status | parent handling |
|---:|---|---|
| `0` | `Passed`或成功生成不带裁决的draft/report | 仍必须读取paired raw status；不得仅凭0生成验收结论 |
| `2` | invocation/input schema invalid | `InfraFailed`，保留safe finding |
| `3` | required prerequisite missing | `Blocked`，向上游gate传播，不转Skipped |
| `4` | harness/tool/environment failure | `InfraFailed` |
| `5` | assertion/check/gate failure | `Failed` |
| `6` | explicitly conditional source not activated | `NotRunConditional`；只允许正式conditional入口，不能补偿P0 |
| `>=7` | unclassified script failure | `InfraFailed`，不得猜测Passed/Failed |

父脚本必须显式映射每个child exit code并保留first non-Passed状态。`set -e`不得绕过状态artifact写入；对预期失败命令必须使用显式`if`/captured status处理，不得使用泛化`|| true`。

`BLK-SBX-SHELL-001` 的设计规则部分至此关闭；新的执行状态为 `shell_contract_selected_shellcheck_not_run`，仍阻塞02D真实commit直至runtime、syntax、lint和negative fixtures通过。

---

## 5. Blocker 拆分后的 current 状态

| 原 blocker | design disposition | remaining Activation blocker |
|---|---|---|
| `BLK-SBX-VERSION-001` | `resolved_for_design_selection` | `BLK-SBX-TOOLCHAIN-VERIFY-001`:目标manifest/toolchain/core exact revision/compatibility未真实核验 |
| `BLK-SBX-CANONICAL-001` | `resolved_for_design_selection` | `BLK-SBX-CANONICAL-VERIFY-001`:target dependency resolution与required fixtures未运行 |
| `BLK-SBX-SHELL-001` | `resolved_for_design_selection` | `BLK-SBX-SHELL-VERIFY-001`:Bash runtime、ShellCheck 0.10.0、17 scripts syntax/lint/negative fixtures未运行 |

原 blocker ID 保留历史和追溯，不得删除。新 blocker只描述运行验证，不再要求实现 agent选择设计口径。

---

## 6. DC-02 完成判定

| 检查项 | 结果 |
|---|---|
| edition/rust-version/toolchain/core revision唯一 | 通过 |
| canonical provider、版本、writer/verifier、strict parse和digest owner唯一 | 通过 |
| Shell dialect、strict mode、lint、exit/status传播唯一 | 通过 |
| 是否把未执行工具/fixture/lint写成通过 | 否 |
| 是否修改目标实现仓或生成代码 | 否 |
| 新上游L1/L2 blocker | 0 |

```text
dc_task = DC-02
dc_status = completed_design_selection_pending_activation_verification
rust_baseline = edition_2024|rust_version_1.93|toolchain_1.93.0|resolver_2
core_baseline = ef0d24941fe6e00c24d423ac330347e6e1acb2da|clean_when_observed|local_path_core_contracts
canonical_baseline = serde_json_canonicalizer_=0.3.2|serde_json_=1.0.145|sha2_=0.10.9
shell_baseline = bash_min_5.2|strict_mode|shellcheck_0.10.0|exit_0_2_3_4_5_6_ge7
implementation_started = no
real_test_execution = not_started
commit_required = no
next_allowed_action = DC-03_flow_and_assembly_reconciliation
```
