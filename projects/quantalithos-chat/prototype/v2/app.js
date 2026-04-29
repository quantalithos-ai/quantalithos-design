/* ============================================================
   Quantalithos Chat — App Logic & Mock Data
   ============================================================ */

// --- Mock Data ---
const MOCK = {
  project: {
    id: 'blog',
    name: '个人博客系统',
    pipeline_process_id: 'standard_pipeline',
  },

  stages: [
    { node_id: 'alignment', name: '目标校准', status: 'completed', completed_at: '04-25 09:30' },
    { node_id: 'requirement', name: '需求理解', status: 'completed', completed_at: '04-25 12:00' },
    { node_id: 'design', name: '方案拆解', status: 'completed', completed_at: '04-26 10:00' },
    { node_id: 'development', name: '迭代开发', status: 'running', progress: '3/5 tasks' },
    { node_id: 'acceptance', name: '验收确认', status: 'pending' },
    { node_id: 'release', name: '发布执行', status: 'pending' },
  ],

  agents: [
    { id: 'tech-lead', name: 'TL', role: 'tech_lead', role_name: '项目负责人', status: 'idle', css: 'tl' },
    { id: 'backend-dev-1', name: 'BE-1', role: 'backend_dev', role_name: '后端开发', status: 'executing', css: 'be', task: 'TASK-003 标签系统' },
    { id: 'frontend-dev-1', name: 'FE-1', role: 'frontend_dev', role_name: '前端开发', status: 'executing', css: 'fe', task: 'TASK-004 评论系统' },
    { id: 'tester-1', name: 'QA-1', role: 'tester', role_name: '测试工程师', status: 'idle', css: 'qa' },
  ],

  conversations: [
    { id: 'group', name: '博客系统 · 项目群聊', type: 'group', avatar: '👥', unread: 3, preview: 'BE-1: TASK-003 标签系统已完成', time: '10:15' },
    { id: 'assistant', name: 'Assistant', type: 'private', avatar: '🤖', unread: 0, preview: '项目已进入迭代开发阶段', time: '09:00' },
    { id: 'tl', name: 'TL · 项目负责人', type: 'private', avatar: 'TL', avatarCss: 'tl', unread: 0, preview: '任务拆解已完成', time: '昨天' },
    { id: 'be1', name: 'BE-1 · 后端开发', type: 'private', avatar: 'BE', avatarCss: 'be', unread: 1, preview: '标签系统实现完成，等待审查', time: '10:15' },
    { id: 'fe1', name: 'FE-1 · 前端开发', type: 'private', avatar: 'FE', avatarCss: 'fe', unread: 0, preview: '评论组件开发中...', time: '10:10' },
  ],

  messages: {
    group: [
      { id: 1, type: 'system', content: '🔔 阶段推进：方案拆解 → 迭代开发', time: '09:00' },
      { id: 2, type: 'agent', agent: 'tech-lead', name: 'TL', content: '任务拆解完成，共 5 个工单。BE-1 和 FE-1 开始并行开发。', time: '09:05' },
      { id: 3, type: 'system', content: '📋 TASK-001 已分配给 BE-1', time: '09:06' },
      { id: 4, type: 'system', content: '📋 TASK-002 已分配给 BE-1', time: '09:06' },
      { id: 5, type: 'agent', agent: 'backend-dev-1', name: 'BE-1', content: '开始实现 TASK-001 项目脚手架。', time: '09:10',
        toolCalls: [
          { name: 'file_write', args: 'path=src/main.rs', status: 'success', result: '创建项目入口文件' },
          { name: 'file_write', args: 'path=Cargo.toml', status: 'success', result: '配置依赖' },
          { name: 'code_execute', args: 'cmd=cargo build', status: 'success', result: '编译成功' },
        ]
      },
      { id: 6, type: 'system', content: '✅ TASK-001 项目脚手架已完成', time: '09:30' },
      { id: 7, type: 'agent', agent: 'backend-dev-1', name: 'BE-1', content: '开始实现 TASK-003 标签系统。按 TDD 流程执行。', time: '09:35',
        toolCalls: [
          { name: 'file_write', args: 'path=tests/tag_test.rs', status: 'success', result: '写入测试文件' },
          { name: 'code_execute', args: 'cmd=cargo test', status: 'success', result: '1 test failed (red)' },
          { name: 'file_write', args: 'path=src/models/tag.rs', status: 'success', result: '实现 Tag 模型' },
          { name: 'code_execute', args: 'cmd=cargo test', status: 'success', result: '1 test passed (green)' },
          { name: 'git_commit', args: 'msg=feat: add tag model', status: 'success', result: 'committed' },
        ]
      },
      { id: 8, type: 'system', content: '✅ TASK-003 标签系统已完成', time: '10:15' },
      { id: 9, type: 'agent', agent: 'tech-lead', name: 'TL', content: '代码审查通过。标签系统实现符合设计要求。', time: '10:20' },
      { id: 10, type: 'gate', gate: {
        id: 'gate-dev-review',
        type: 'soft',
        title: '迭代开发进度确认',
        description: '3/5 任务已完成，是否继续当前计划？',
        artifacts: ['PRD v1.0', '技术方案', '代码变更 (3 commits)'],
        status: 'pending',
      }},
      { id: 11, type: 'agent', agent: 'frontend-dev-1', name: 'FE-1', content: '评论组件开发中，预计 30 分钟完成。', time: '10:25',
        toolCalls: [
          { name: 'file_write', args: 'path=src/components/Comment.vue', status: 'running' },
        ]
      },
    ],
    assistant: [
      { id: 1, type: 'agent', agent: 'assistant', name: 'Assistant', content: '你好！我是项目助手。博客系统项目已进入迭代开发阶段。\n\n当前进度：\n- 已完成 3/5 个任务\n- BE-1 正在开发标签系统\n- FE-1 正在开发评论组件\n\n有什么我可以帮你的吗？', time: '09:00' },
      { id: 2, type: 'user', content: '目前项目进展如何？有什么阻塞吗？', time: '09:30' },
      { id: 3, type: 'agent', agent: 'assistant', name: 'Assistant', content: '项目进展顺利，没有阻塞：\n\n✅ 已完成：TASK-001 脚手架、TASK-002 文章 CRUD、TASK-003 标签系统\n🔵 进行中：TASK-004 评论系统（FE-1）\n⬜ 等待中：TASK-005 搜索功能（依赖 003+004）\n\n预计今天可以完成所有开发任务，进入验收阶段。', time: '09:31' },
    ],
  },

  workitems: [
    { id: 'TASK-001', title: '项目脚手架', type: 'task', status: 'completed', assignee: 'backend-dev-1', priority: 'high', wave: 1 },
    { id: 'TASK-002', title: '文章 CRUD', type: 'task', status: 'completed', assignee: 'backend-dev-1', priority: 'high', wave: 1 },
    { id: 'TASK-003', title: '标签系统', type: 'task', status: 'in_review', assignee: 'backend-dev-1', priority: 'medium', wave: 2, dependencies: ['TASK-002'] },
    { id: 'TASK-004', title: '评论系统', type: 'task', status: 'in_progress', assignee: 'frontend-dev-1', priority: 'medium', wave: 2, dependencies: ['TASK-002'] },
    { id: 'TASK-005', title: '搜索功能', type: 'task', status: 'pending', assignee: 'backend-dev-1', priority: 'low', wave: 3, dependencies: ['TASK-003', 'TASK-004'] },
  ],

  artifacts: [
    { id: 'art-001', name: '博客系统 PRD v1.0', type: 'prd', icon: '📄', created_by: 'TL', created_at: '04-25', version: 'v1.0' },
    { id: 'art-002', name: '技术方案', type: 'design_doc', icon: '📐', created_by: 'TL', created_at: '04-26', version: 'v1.0' },
    { id: 'art-003', name: '项目脚手架代码', type: 'code', icon: '💻', created_by: 'BE-1', created_at: '04-27', version: '3 commits' },
    { id: 'art-004', name: '标签系统代码', type: 'code', icon: '💻', created_by: 'BE-1', created_at: '04-29', version: '2 commits' },
    { id: 'art-005', name: '单元测试报告', type: 'test_report', icon: '🧪', created_by: 'BE-1', created_at: '04-29', version: '12 passed' },
  ],

  // BPMN flow for current stage (development)
  bpmnNodes: [
    { id: 'start', type: 'event', x: 40, y: 150, status: 'completed' },
    { id: 'implement', type: 'task', x: 140, y: 135, name: '编码实现', actor: 'BE/FE', status: 'running' },
    { id: 'review', type: 'task', x: 320, y: 135, name: '代码审查', actor: 'TL', status: 'completed' },
    { id: 'review_decision', type: 'gateway', x: 480, y: 150, status: 'completed' },
    { id: 'testing', type: 'task', x: 580, y: 80, name: '测试验证', actor: 'QA', status: 'pending' },
    { id: 'fix', type: 'task', x: 580, y: 200, name: '修复问题', actor: 'BE/FE', status: 'pending' },
    { id: 'end', type: 'event', x: 720, y: 150, status: 'pending' },
  ],
  bpmnEdges: [
    { from: 'start', to: 'implement' },
    { from: 'implement', to: 'review' },
    { from: 'review', to: 'review_decision' },
    { from: 'review_decision', to: 'testing', label: 'approved' },
    { from: 'review_decision', to: 'fix', label: 'changes' },
    { from: 'fix', to: 'implement' },
    { from: 'testing', to: 'end' },
  ],
};

// --- Navigation ---
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('progress')) return 'progress';
  if (path.includes('kanban')) return 'kanban';
  if (path.includes('artifacts')) return 'artifacts';
  return 'chat';
}

function initNavigation() {
  const current = getCurrentPage();
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    if (item.dataset.page === current) {
      item.classList.add('active');
    }
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      const pages = { chat: 'index.html', progress: 'progress.html', kanban: 'kanban.html', artifacts: 'artifacts.html' };
      if (pages[page] && page !== current) {
        window.location.href = pages[page];
      }
    });
  });
}

// --- Render Helpers ---
function renderAgentAvatar(agent, size) {
  const a = MOCK.agents.find(a => a.id === agent) || { name: '?', css: 'be' };
  const s = size || 32;
  const statusClass = a.status === 'executing' ? 'busy' : (a.status === 'idle' ? 'online' : 'offline');
  return `<div class="agent-avatar ${a.css}" style="width:${s}px;height:${s}px;font-size:${s*0.35}px">
    ${a.name}
    <span class="status-dot ${statusClass}"></span>
  </div>`;
}

function renderStatusBadge(status) {
  const labels = {
    completed: '✅ 已完成', running: '🔵 进行中', pending: '⬜ 待开始',
    in_progress: '🔵 进行中', in_review: '👀 审查中', in_testing: '🧪 测试中',
    blocked: '🚫 阻塞', idle: '● 空闲', executing: '● 执行中',
  };
  const cssMap = {
    completed: 'completed', running: 'running', pending: 'pending',
    in_progress: 'running', in_review: 'in-review', in_testing: 'in-testing',
    blocked: 'blocked', idle: 'completed', executing: 'running',
  };
  return `<span class="status-badge ${cssMap[status] || 'pending'}">${labels[status] || status}</span>`;
}

function renderToolCall(tc) {
  const statusIcon = tc.status === 'success' ? '✓' : (tc.status === 'running' ? '⟳' : '✗');
  return `<div class="tool-call">
    <div class="tool-header">
      <span class="tool-icon">🔧</span>
      <span class="tool-name">${tc.name}</span>
      <span class="tool-status ${tc.status}">${statusIcon} ${tc.status}</span>
    </div>
    <div class="tool-args">${tc.args}</div>
    ${tc.result ? `<div class="tool-result">${tc.result}</div>` : ''}
  </div>`;
}

function renderGateCard(gate) {
  const typeClass = gate.type === 'hard' ? 'hard' : 'soft';
  const respondedClass = gate.status !== 'pending' ? 'responded' : '';
  return `<div class="gate-card ${typeClass} ${respondedClass}">
    <div class="gate-title">📋 ${gate.title}</div>
    <div class="gate-desc">${gate.description}</div>
    <div class="gate-artifacts">
      ${gate.artifacts.map(a => `<span class="artifact-chip">📎 ${a}</span>`).join('')}
    </div>
    <div class="gate-actions">
      <button class="gate-btn approve" onclick="handleGate('${gate.id}','approve')">✅ 确认</button>
      <button class="gate-btn changes" onclick="handleGate('${gate.id}','changes')">✏️ 修改</button>
      <button class="gate-btn reject" onclick="handleGate('${gate.id}','reject')">❌ 驳回</button>
    </div>
    ${gate.status !== 'pending' ? `<div class="gate-result">已${gate.status === 'approved' ? '通过' : '驳回'}</div>` : ''}
  </div>`;
}

function handleGate(gateId, action) {
  const card = document.querySelector(`.gate-card`);
  if (card) {
    card.classList.add('responded');
    card.querySelector('.gate-actions').style.display = 'none';
    const labels = { approve: '✅ 已通过', changes: '✏️ 已要求修改', reject: '❌ 已驳回' };
    const result = document.createElement('div');
    result.className = 'gate-result';
    result.textContent = labels[action];
    card.appendChild(result);
  }
}

// --- Pipeline Bar ---
function renderPipelineBar(container) {
  let html = '<div class="pipeline-bar">';
  MOCK.stages.forEach((stage, i) => {
    if (i > 0) {
      const connDone = MOCK.stages[i-1].status === 'completed' ? 'done' : '';
      html += `<div class="pipeline-connector ${connDone}"></div>`;
    }
    const icon = stage.status === 'completed' ? '✓' : (stage.status === 'running' ? '●' : (i+1));
    html += `<div class="pipeline-stage ${stage.status}" data-stage="${stage.node_id}">
      <div class="stage-dot">${icon}</div>
      <span class="stage-name">${stage.name}</span>
    </div>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
});
