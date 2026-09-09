# Step 4. 抽取实施对象与交付物

## 1. Step 状态

`completed / planned_surface`。本步只登记未来实施边界，不创建实现仓文件。

## 2. Planned implementation surface

| 技术 role | 计划落点 | 交付职责 | 禁止 |
|---|---|---|---|
| contracts | `crates/contracts` | typed refs、DTO、error、cursor、safe view | owner schema shadow |
| domain | `crates/domain` | 16对象、状态、不变量、纯 Inbox projector | I/O、授权裁决 |
| application | `crates/application` | 7 service、ports、UoW、幂等编排 | 具体 adapter、万能 dispatcher |
| infra | `crates/infra` | local store、owner/bus adapter、config、builder | fake production fallback |
| api | `crates/api` | 2 Command + 6 Query handler | 直连 store/domain |
| worker | `crates/worker` | 2 Consumer、受控 loop | outbound publisher、recovery loop |
| jobs | `crates/jobs` | 4 bounded Operation handler/binary | 无界循环、archive handoff |

## 3. 交付物清单

| 交付物 | 类型 | 来源 | 计划落点 | 完成判定上限 |
|---|---|---|---|---|
| contracts/domain/application crate skeleton | code boundary | 03 §4~7 | `crates/*/src` | future compile/test；当前 planned |
| 16对象工厂与状态不变量 | code+unit | 03 §6/9；05 OBJECT/STATE | `crates/domain/tests` | local evidence；proof seam blocked |
| 2 Command + 6 Query | code+entry tests | 03 §7~9；05 QRY/COMMAND | `crates/api/tests` | no-write/local evidence |
| 2 Consumer + projection | code+worker tests | 03 §7~9；05 SRC/INBOX | `crates/worker/tests` | formal event blocked |
| 4 Recovery Operation | code+job tests | 03 §8~12；05 REC | `crates/jobs/tests` | baseline/durable blocked |
| store/config/cursor adapters | code+controlled tests | 03 §10/13；04 | `crates/infra/tests` | selected driver pending |
| 13 P0 suites and 9 scripts | test/tooling | 05 §9/13 | `crates/*/tests`, `scripts/*` | planned; no scripts now |
| reports/evidence handoff | planned output contract | 05 §13、06 §10 | `artifacts/test`, `reports` | future fixed run only |

## 4. Non-delivery inventory

本项目不交付 owner query/event producer、authorization engine、L1 正文、runtime/tools/sandbox、SDK/cache/UI、archive package、outbox、outbound event、共享数据库表、真实 secret、性能 baseline 或验收签署。

## 5. External delivery shape

向下游只提供稳定 read/export model、provenance、coverage、freshness、availability 和安全 refs；不提供 archive accepted state、产品 UI model 或执行主语。

## 6. 回填与进入下一步

正式 §4 使用 role、交付物和非交付物表；实现仓与脚本均保持 planned，允许 Step5。
