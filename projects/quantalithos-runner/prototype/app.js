/* Quantalithos Runner — App Logic & Mock Data */

const MOCK = {
  apps: [
    { id: 'blog', name: '个人博客', icon: '📝', version: 'v0.3', status: 'dev', tech: 'Rust + Vue 3', size: '15.5 MB', updated: '2026-04-29', developer: 'AI Team' },
    { id: 'shop', name: '电商平台', icon: '🛒', version: 'v0.1', status: 'prototype', tech: 'Node.js + React', size: '8.2 MB', updated: '2026-04-20', developer: 'AI Team' },
    { id: 'game', name: '小游戏合集', icon: '🎮', version: 'v1.0', status: 'done', tech: 'Godot WebGL', size: '22.1 MB', updated: '2026-04-15', developer: 'AI Team' },
    { id: 'todo', name: '待办清单', icon: '✅', version: 'v1.2', status: 'update', tech: 'Vue 3', size: '3.4 MB', updated: '2026-04-28', developer: 'AI Team' },
    { id: 'chat', name: '即时通讯', icon: '💬', version: 'v0.2', status: 'dev', tech: 'Flutter Web', size: '12.8 MB', updated: '2026-04-27', developer: 'AI Team' },
    { id: 'dashboard', name: '数据看板', icon: '📊', version: 'v0.5', status: 'dev', tech: 'React + D3', size: '9.7 MB', updated: '2026-04-26', developer: 'AI Team' },
  ],

  permissions: {
    blog: [
      { id: 'storage', name: '本地存储', icon: '💾', desc: '保存草稿和用户偏好', enabled: true },
      { id: 'network', name: '网络访问', icon: '🌐', desc: '访问后端 API', enabled: true },
      { id: 'notification', name: '通知', icon: '🔔', desc: '新评论通知', enabled: true },
      { id: 'camera', name: '相机', icon: '📷', desc: '上传封面图片', enabled: false },
    ],
    shop: [
      { id: 'storage', name: '本地存储', icon: '💾', desc: '购物车缓存', enabled: true },
      { id: 'network', name: '网络访问', icon: '🌐', desc: '商品和订单 API', enabled: true },
      { id: 'location', name: '位置', icon: '📍', desc: '配送地址定位', enabled: false },
    ],
    game: [
      { id: 'storage', name: '本地存储', icon: '💾', desc: '游戏存档', enabled: true },
      { id: 'audio', name: '音频', icon: '🔊', desc: '游戏音效', enabled: true },
    ],
  },

  updates: [
    { id: 'todo', name: '待办清单', icon: '✅', current: 'v1.1', latest: 'v1.2', note: '新增标签分类功能', size: '1.2 MB' },
  ],

  versions: {
    blog: [
      { tag: 'v0.3', date: '04-29', note: '标签系统 + 评论功能' },
      { tag: 'v0.2', date: '04-26', note: '文章 CRUD + Markdown 编辑器' },
      { tag: 'v0.1', date: '04-25', note: '项目脚手架 + 基础路由' },
    ],
    game: [
      { tag: 'v1.0', date: '04-15', note: '正式发布：3 个小游戏' },
      { tag: 'v0.9', date: '04-10', note: 'Beta：贪吃蛇 + 俄罗斯方块' },
    ],
  },

  devLogs: [
    { time: '10:25:01', level: 'info', msg: '[blog] App loaded successfully' },
    { time: '10:25:02', level: 'info', msg: '[blog] API connected: http://localhost:4001' },
    { time: '10:25:03', level: 'info', msg: '[blog] GET /api/articles → 200 (12ms)' },
    { time: '10:25:05', level: 'warn', msg: '[blog] localStorage quota: 4.2MB / 5MB' },
    { time: '10:25:10', level: 'info', msg: '[blog] GET /api/tags → 200 (5ms)' },
    { time: '10:25:15', level: 'error', msg: '[blog] Failed to load image: /uploads/cover.jpg (404)' },
    { time: '10:25:20', level: 'info', msg: '[blog] POST /api/articles → 201 (45ms)' },
  ],

  networkRequests: [
    { url: '/api/articles', method: 'GET', status: 200, time: '12ms', size: '4.2 KB' },
    { url: '/api/tags', method: 'GET', status: 200, time: '5ms', size: '0.8 KB' },
    { url: '/api/articles', method: 'POST', status: 201, time: '45ms', size: '1.1 KB' },
    { url: '/uploads/cover.jpg', method: 'GET', status: 404, time: '3ms', size: '0' },
    { url: '/api/articles/1/comments', method: 'GET', status: 200, time: '8ms', size: '2.3 KB' },
  ],
};

// --- Navigation ---
function getCurrentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const map = { 'index.html': 'apps', 'detail.html': 'apps', 'running.html': 'apps', 'updates.html': 'updates', 'permissions.html': 'permissions', 'devtools.html': 'devtools' };
  return map[path] || 'apps';
}

function tabbarHTML() {
  const current = getCurrentPage();
  const tabs = [
    { id: 'apps', icon: '📱', label: '应用', href: 'index.html' },
    { id: 'updates', icon: '🔄', label: '更新', href: 'updates.html', badge: MOCK.updates.length || null },
    { id: 'permissions', icon: '🔒', label: '权限', href: 'permissions.html' },
    { id: 'devtools', icon: '🛠', label: '开发', href: 'devtools.html' },
  ];
  return `<nav class="tabbar">${tabs.map(t => `
    <a class="tab-item ${t.id === current ? 'active' : ''}" href="${t.href}" style="position:relative;">
      <span class="tab-icon">${t.icon}</span>
      <span class="tab-label">${t.label}</span>
      ${t.badge ? `<span class="tab-badge">${t.badge}</span>` : ''}
    </a>
  `).join('')}</nav>`;
}

function getApp(id) {
  return MOCK.apps.find(a => a.id === id);
}

function statusLabel(status) {
  const map = { dev: '● 开发中', prototype: '○ 原型', done: '✅ 已完成', update: '🔄 可更新' };
  return map[status] || status;
}

document.addEventListener('DOMContentLoaded', () => {
  const tabbar = document.getElementById('tabbar');
  if (tabbar) tabbar.outerHTML = tabbarHTML();
});
