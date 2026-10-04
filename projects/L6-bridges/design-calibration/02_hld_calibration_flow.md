# L6-bridges 02 概要设计全量重启校准流程

> 2026-10-02；full-restart / single-agent-serial；用户授权全部02，完成即停审。
> 正式目标：`02-概要设计.md`；恢复入口：`project_execution_ledger.md`。

## 1. 当前恢复点

| Step | 当前模块 | 骨架 | 思考 | 写入 | 自检 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|---|---|---|---|
| 14 | formal_stop_review | done | done | done | done | formal_stop_review | 14章已装配且设计审计完成，等待用户审查02 | wait_for_user_confirmation_of_02_then_03 | Step1~13；SOP14/规范主链/参考/ASCII规则；02_hld_step_14_formal_assembly.md；project_execution_ledger.md |

## 2. 总流程计划

| Step / 名称 | 输入 / 前序依赖 | 输出文件 | 当前状态 | 完成门禁 / 下一步许可 |
|---|---|---|---|---|
| 1 上游输入边界 | 正式00/01；七owner当前合同/必要台账；SOP1/规范4.1 | `02_hld_step_01_upstream_boundary.md` | done / pass | 来源与挂起边界已收束，允许Step2 |
| 2 目标与范围 | 1；SOP2/规范4.2 | `02_hld_step_02_scope.md` | done / pass | 自检完成，允许Step3 |
| 3 约束条件 | 1/2；SOP3/规范4.3 | `02_hld_step_03_constraints.md` | done / pass | 每约束能指导结构，才可Step4 |
| 4 代码主体框架 | 2/3、01§6~11；SOP4/规范4.4 | `02_hld_step_04_code_subject_framework.md` | done / pass | 两图/分层/shared边界明确，才可Step5 |
| 5 组成部分 | 4、01六单元；SOP5/规范4.5 | `02_hld_step_05_components_boundary.md` | done / pass | 六部分功能/候选池停审及跨审通过，才可Step6 |
| 6 关键对象 | 4/5；SOP6/规范4.6 | `02_hld_step_06_key_objects.md`及六部分附录 | done / pass | 独立对象卡/字段类型/函数参数/筛选反查闭合，才可Step7 |
| 7 接口骨架 | 5/6、owner合同；SOP7/规范4.7 | `02_hld_step_07_api_outline.md` | done / pass | 五类接口和typed ports逐部分停审，才可Step8 |
| 8 关键处理流 | 5/6/7；SOP8/规范4.8 | `02_hld_step_08_processing_flows.md` | done / pass | 关键入口逐图/事务外呼/测试切口与跨审通过，才可Step9 |
| 9 状态机 | 6/7/8；SOP9/规范4.9 | `02_hld_step_09_state_transitions.md` | done / pass | 状态主语/触发/非法/传播逐部分停审，才可Step10 |
| 10 异常边界 | 8/9；SOP10/规范4.10 | `02_hld_step_10_exception_boundaries.md` | done / pass | 异常有落点和受限行为，才可Step11 |
| 11 配置影响 | 4~10；SOP11/规范4.11 | `02_hld_step_11_config_impact.md` | done / pass | seam/禁止配置化/03与04承接区分，才可Step12 |
| 12 详细设计承接 | 4~11；SOP12/规范4.12 | `02_hld_step_12_detailed_design_handoff.md` | done / pass | 稳定主语/展开项/回退闭合，才可Step13 |
| 13 风险与疑问 | 4~12、00Step15、owner台账；SOP13/规范4.13 | `02_hld_step_13_risks_open_questions.md` | done / pass | 内部风险与外部合同缺口分别收纳，才可Step14 |
| 14 正式装配 | 1~13、规范主链/参考/图规则；SOP14 | `02_hld_step_14_formal_assembly.md` | done / formal_stop_review | 三层门禁、14章骨架、分批重建与全文审计完成；等用户明确确认03 |

未来Step只在到达时建文件；本表是计划，不是完成声明。Step5~9按U1~U6主轴，每部分先思考再写入自检，全部完成再跨审。六单元的业务组织轴不等于Inbound/Application/Domain/Ports实现层，也不等于六服务。

## 3. 来源与写入纪律

正式00/01是直接输入；七专项只承接已存在正式语义，缺兼容/资格明确blocked。历史02与README只在独立结论后扫描。Chat保持reference_only。平台资料资格沿00平台附录，不用可变master推安装/固定cloud事实。本轮无新网络核验，未选SDK/OAuth/API Key/KMS/路由产品必须在当前seam再次审查。

每Step先骨架，再问题/诊断/取舍、结构化、复杂度、草稿、自检；每批检查后更新当前模块和三层恢复点。Step6重对象拆附录；正式§6仍逐对象独立成节，不用总表替代对象卡。正式装配前不改旧02；Step14先删除再重建14章全部骨架。单批100~300行为宜，不限制最终长度。

## 4. 权限与blocker

BR-UP-001~009=open；010=reference_only；精确source/释放依据见00 Step15§7.3/7.4。保留Workspace开放项和Observability十二affected原状态；本仓无上游写权。限制正向交接/激活/运行，不阻止保守结构/失败边界的设计装配。

```text
current_document = 02
current_step = 14
current_module = formal_stop_review
gate_status = formal_stop_review
next_allowed_action = wait_for_user_confirmation_of_02_then_03
formal_document_write_allowed = false
formal_02_assembly_allowed = false
next_document_allowed = false
implementation_ledger_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 5. 执行记录

- 启动：恢复01停审与明确02授权；必读清单与实际复读范围已登记项目台账§8；创建flow及当前Step1骨架。旧02不作输入，未来Step未建。
- Step1：输入边界、五问题和来源分层自检pass；允许Step2，仅创建当前骨架。
- Step2~4：目标/范围、约束和代码主体框架串行完成；一个BC/六U与实现层分轴，无上游接口或产品选型假定。
- Step5~9：六U逐部分思考、写入、自检后跨审；20独立对象卡、20接口/事件主语、23本地port需求、19独立处理流、17状态机及六传播图完成。字段Slot、状态guard及同effect唯一性等一致性修正已同步来源与正式文档。
- Step10~13：异常、配置影响、03详细展开及风险收口完成；243项support type为待闭口索引，不是实现schema。BR-UP、Workspace开放项及Observability十二affected保留。
- Step14：旧02/README仅后置历史扫描；删除旧02、创建14章骨架后分批回填，完成静态与语义交叉审计。发现的尾空白、affected遗漏和引用路径问题已修正并记录，未隐藏失败。最终检查结果与16FR承接表见Step14实际审计记录。
- 停审：三层恢复点同步formal_stop_review；关闭正式写入与装配权限，未进入03、未创建实施台账/boundary、未实现/项目测试/stage/commit。用户确认03后才读详细设计SOP/规范、正式02与相关owner合同。
