// TaskFlow Pro - Robust Task & Workflow Management Logic
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const addTaskForm = document.getElementById('add-task-form');
  const taskInput = document.getElementById('task-input');
  const taskPriority = document.getElementById('task-priority');
  const taskCategory = document.getElementById('task-category');
  const taskDue = document.getElementById('task-due');
  const searchInput = document.getElementById('search-input');
  const filterTabs = document.querySelectorAll('.filter-tab');

  const pendingListEl = document.getElementById('pending-tasks-list');
  const completedListEl = document.getElementById('completed-tasks-list');
  const pendingCounter = document.getElementById('pending-counter');
  const completedCounter = document.getElementById('completed-counter');
  const countTotal = document.getElementById('count-total');
  const countPendingStat = document.getElementById('count-pending-stat');
  const countCompletedStat = document.getElementById('count-completed-stat');
  const progressPercent = document.getElementById('progress-percent');
  const progressFill = document.getElementById('progress-fill');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const toastEl = document.getElementById('toast-notify');
  const dateDisplay = document.getElementById('date-display');

  // Format today's date
  const now = new Date();
  dateDisplay.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // State
  let tasks = loadTasksFromStorage();
  let currentFilter = 'all';
  let searchQuery = '';

  // Default starter sample tasks if brand new
  if (tasks.length === 0) {
    tasks = [
      {
        id: '1',
        text: 'Review Oasis Infobyte SIP guidelines and task deliverables',
        completed: true,
        priority: 'high',
        category: 'work',
        createdAt: '10:15 AM',
        completedAt: '11:00 AM'
      },
      {
        id: '2',
        text: 'Implement responsive glassmorphic UI layout with CSS Grid',
        completed: false,
        priority: 'high',
        category: 'work',
        createdAt: '11:30 AM',
        completedAt: null
      },
      {
        id: '3',
        text: 'Test Absolute Zero physical constraints in temperature engine',
        completed: false,
        priority: 'medium',
        category: 'study',
        createdAt: '01:45 PM',
        completedAt: null
      }
    ];
    saveTasksToStorage();
  }

  function loadTasksFromStorage() {
    try {
      const saved = localStorage.getItem('taskflow_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
      return [];
    }
  }

  function saveTasksToStorage() {
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3000);
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Render Tasks
  function render() {
    const filteredTasks = tasks.filter(task => {
      // Keyword search
      const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Filter tabs
      if (currentFilter === 'all') return true;
      if (currentFilter === 'high') return task.priority === 'high';
      if (currentFilter === 'work') return task.category === 'work';
      if (currentFilter === 'personal') return task.category === 'personal';
      return true;
    });

    const pending = filteredTasks.filter(t => !t.completed);
    const completed = filteredTasks.filter(t => t.completed);

    const totalAll = tasks.length;
    const pendingAll = tasks.filter(t => !t.completed).length;
    const completedAll = tasks.filter(t => t.completed).length;

    // Counters update
    pendingCounter.textContent = `${pendingAll} pending`;
    completedCounter.textContent = `${completedAll} completed`;
    countTotal.textContent = totalAll;
    countPendingStat.textContent = pendingAll;
    countCompletedStat.textContent = completedAll;

    // Progress Bar
    const pct = totalAll > 0 ? Math.round((completedAll / totalAll) * 100) : 0;
    progressPercent.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;

    // Render Pending Column
    if (pending.length === 0) {
      pendingListEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎉</div>
          <p>No pending tasks found! You're all caught up.</p>
        </div>
      `;
    } else {
      pendingListEl.innerHTML = pending.map(task => createTaskHTML(task)).join('');
    }

    // Render Completed Column
    if (completed.length === 0) {
      completedListEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <p>No completed tasks yet. Finish your pending items!</p>
        </div>
      `;
    } else {
      completedListEl.innerHTML = completed.map(task => createTaskHTML(task)).join('');
    }

    attachItemListeners();
  }

  function createTaskHTML(task) {
    const priorityClass = `priority-${task.priority}`;
    const priorityLabel = task.priority.toUpperCase();
    const categoryLabel = task.category.toUpperCase();

    return `
      <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <div class="task-item-top">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task complete">
          <div class="task-text">${escapeHTML(task.text)}</div>
        </div>
        <div class="task-meta">
          <div class="badge-group">
            <span class="priority-tag ${priorityClass}">${priorityLabel}</span>
            <span class="category-tag">${categoryLabel}</span>
          </div>
          <div class="task-timestamps">
            <span>📅 ${task.createdAt}</span>
            ${task.completedAt ? `<span> • Done at ${task.completedAt}</span>` : ''}
          </div>
          <div class="task-controls">
            ${!task.completed ? '<button class="btn-ctrl btn-edit" title="Edit task">Edit</button>' : ''}
            <button class="btn-ctrl btn-del" title="Delete task permanently">Delete</button>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function attachItemListeners() {
    // Checkbox toggle
    document.querySelectorAll('.task-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const itemEl = e.target.closest('.task-item');
        const taskId = itemEl.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          task.completed = e.target.checked;
          task.completedAt = task.completed ? formatTime(new Date()) : null;
          saveTasksToStorage();
          render();
          showToast(task.completed ? '✓ Task marked as completed!' : '↺ Task moved back to pending.');
        }
      });
    });

    // Delete task
    document.querySelectorAll('.btn-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemEl = e.target.closest('.task-item');
        const taskId = itemEl.dataset.id;
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasksToStorage();
        render();
        showToast('🗑️ Task removed.');
      });
    });

    // Inline Edit
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemEl = e.target.closest('.task-item');
        const taskId = itemEl.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const textEl = itemEl.querySelector('.task-text');
        const originalText = task.text;

        textEl.innerHTML = `
          <div class="edit-pane">
            <input type="text" class="edit-input" value="${escapeHTML(originalText)}">
            <button class="btn-save">Save</button>
            <button class="btn-cancel">Cancel</button>
          </div>
        `;

        const editInput = textEl.querySelector('.edit-input');
        editInput.focus();

        textEl.querySelector('.btn-save').addEventListener('click', () => {
          const newText = editInput.value.trim();
          if (newText) {
            task.text = newText;
            saveTasksToStorage();
            render();
            showToast('✓ Task updated.');
          }
        });

        textEl.querySelector('.btn-cancel').addEventListener('click', () => {
          render();
        });

        editInput.addEventListener('keydown', (ke) => {
          if (ke.key === 'Enter') {
            textEl.querySelector('.btn-save').click();
          } else if (ke.key === 'Escape') {
            textEl.querySelector('.btn-cancel').click();
          }
        });
      });
    });
  }

  // Add Task Handler
  addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
      id: Date.now().toString(),
      text: text,
      completed: false,
      priority: taskPriority.value,
      category: taskCategory.value,
      createdAt: formatTime(new Date()),
      completedAt: null
    };

    tasks.unshift(newTask);
    saveTasksToStorage();
    taskInput.value = '';
    render();
    showToast('✓ New task created!');
  });

  // Clear Completed
  clearCompletedBtn.addEventListener('click', () => {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) return;
    tasks = tasks.filter(t => !t.completed);
    saveTasksToStorage();
    render();
    showToast(`🗑️ Cleared ${completedCount} completed tasks.`);
  });

  // Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      render();
    });
  });

  // Search Input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    render();
  });

  // Initial Render
  render();
});
