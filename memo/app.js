const STORAGE_KEY = 'cloud-note-web-entries';
const typeLabels = {
  memo: '备忘录',
  diary: '日记',
  schedule: '日程'
};

const form = document.querySelector('#memoForm');
const clearFormButton = document.querySelector('#clearForm');
const typeInput = document.querySelector('#entryType');
const titleInput = document.querySelector('#entryTitle');
const dateInput = document.querySelector('#entryDate');
const contentInput = document.querySelector('#entryContent');
const recordsList = document.querySelector('#recordsList');
const template = document.querySelector('#recordTemplate');
const filters = document.querySelectorAll('.filter');
const memoCount = document.querySelector('#memoCount');
const diaryCount = document.querySelector('#diaryCount');
const scheduleCount = document.querySelector('#scheduleCount');
const todayText = document.querySelector('#todayText');
const storageStatus = document.querySelector('#storageStatus');

let entries = loadEntries();
let activeFilter = 'all';

dateInput.valueAsDate = new Date();
todayText.textContent = formatDate(new Date().toISOString().slice(0, 10));
render();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const entry = {
    id: crypto.randomUUID(),
    type: typeInput.value,
    title: titleInput.value.trim(),
    date: dateInput.value,
    content: contentInput.value.trim(),
    createdAt: new Date().toISOString()
  };

  entries = [entry, ...entries];
  saveEntries();
  form.reset();
  dateInput.valueAsDate = new Date();
  typeInput.focus();
  render();
});

clearFormButton.addEventListener('click', () => {
  form.reset();
  dateInput.valueAsDate = new Date();
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle('active', item === button));
    render();
  });
});

recordsList.addEventListener('click', (event) => {
  const button = event.target.closest('.delete-button');
  if (!button) return;

  entries = entries.filter((entry) => entry.id !== button.dataset.id);
  saveEntries();
  render();
});

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? getStarterEntries();
  } catch {
    storageStatus.textContent = '读取失败，已使用示例数据';
    return getStarterEntries();
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  storageStatus.textContent = `已保存 ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
}

function render() {
  updateStats();
  recordsList.innerHTML = '';

  const visibleEntries = entries
    .filter((entry) => activeFilter === 'all' || entry.type === activeFilter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (visibleEntries.length === 0) {
    recordsList.innerHTML = '<div class="empty-state">还没有记录，先写下一条备忘录、日记或日程吧。</div>';
    return;
  }

  visibleEntries.forEach((entry) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.querySelector('.record-badge').textContent = typeLabels[entry.type];
    card.querySelector('time').textContent = formatDate(entry.date);
    card.querySelector('time').dateTime = entry.date;
    card.querySelector('h3').textContent = entry.title;
    card.querySelector('p').textContent = entry.content;
    card.querySelector('.delete-button').dataset.id = entry.id;
    recordsList.append(card);
  });
}

function updateStats() {
  memoCount.textContent = entries.filter((entry) => entry.type === 'memo').length;
  diaryCount.textContent = entries.filter((entry) => entry.type === 'diary').length;
  scheduleCount.textContent = entries.filter((entry) => entry.type === 'schedule' && isUpcoming(entry.date)).length;
}

function isUpcoming(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) >= today;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  }).format(new Date(`${date}T00:00:00`));
}

function getStarterEntries() {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return [
    {
      id: 'sample-memo',
      type: 'memo',
      title: '阅读清单',
      date: today,
      content: '整理数据库课程笔记，复习 B+ 树和缓冲池管理。',
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample-diary',
      type: 'diary',
      title: '今日小结',
      date: today,
      content: '今天把待办事项拆成了更小的步骤，执行起来轻松很多。',
      createdAt: new Date().toISOString()
    },
    {
      id: 'sample-schedule',
      type: 'schedule',
      title: '项目讨论会',
      date: tomorrow,
      content: '准备演示页面，确认需求：备忘录、日记、日程安排。',
      createdAt: new Date().toISOString()
    }
  ];
}
