
/**
 * Task Management System
 * Handles CRUD operations for project tasks with filtering and status tracking
 */

// ====================== SAMPLE DATA ======================

const sampleTasks = [
    {
        id: 1,
        title: "Design login page mockups",
        description: "Create wireframes and visual designs for the authentication interface",
        requirementId: "1",
        requirementTitle: "User Authentication System",
        priority: "high",
        dueDate: "2024-12-15",
        status: "pending",
        completed: false,
        createdAt: "2024-12-01T09:00:00.000Z",
        updatedAt: "2024-12-01T09:00:00.000Z"
    },
    {
        id: 2,
        title: "Set up database schema",
        description: "Design and implement user tables with proper relationships",
        requirementId: "1",
        requirementTitle: "User Authentication System",
        priority: "high",
        dueDate: "2024-12-12",
        status: "pending",
        completed: false,
        createdAt: "2024-12-01T10:00:00.000Z",
        updatedAt: "2024-12-01T10:00:00.000Z"
    },
    {
        id: 3,
        title: "Create task CRUD operations",
        description: "Implement create, read, update, delete functionality for tasks",
        requirementId: "2",
        requirementTitle: "Task Management Dashboard",
        priority: "medium",
        dueDate: "2024-12-18",
        status: "pending",
        completed: false,
        createdAt: "2024-12-01T11:00:00.000Z",
        updatedAt: "2024-12-01T11:00:00.000Z"
    },
    {
        id: 4,
        title: "Implement password hashing",
        description: "Add bcrypt for secure password storage",
        requirementId: "1",
        requirementTitle: "User Authentication System",
        priority: "high",
        dueDate: "2024-12-10",
        status: "completed",
        completed: true,
        createdAt: "2024-11-28T14:00:00.000Z",
        updatedAt: "2024-12-01T16:00:00.000Z"
    },
    {
        id: 5,
        title: "Design responsive layout",
        description: "Create CSS grid and flexbox layouts for mobile compatibility",
        requirementId: "5",
        requirementTitle: "Mobile Responsiveness",
        priority: "medium",
        dueDate: "2024-12-08",
        status: "pending",
        completed: false,
        createdAt: "2024-12-01T12:00:00.000Z",
        updatedAt: "2024-12-01T12:00:00.000Z"
    },
    {
        id: 6,
        title: "Performance testing",
        description: "Run load tests to ensure system meets performance requirements",
        requirementId: "4",
        requirementTitle: "System Performance",
        priority: "low",
        dueDate: "2024-12-25",
        status: "pending",
        completed: false,
        createdAt: "2024-12-01T13:00:00.000Z",
        updatedAt: "2024-12-01T13:00:00.000Z"
    },
    {
        id: 7,
        title: "Setup SSL certificates",
        description: "Configure HTTPS and security headers for production",
        requirementId: "6",
        requirementTitle: "Data Security",
        priority: "high",
        dueDate: "2024-12-05",
        status: "pending",
        completed: false,
        createdAt: "2024-12-01T15:00:00.000Z",
        updatedAt: "2024-12-01T15:00:00.000Z"
    }
];

// ====================== GLOBAL VARIABLES ======================

let tasks = sampleTasks;
let taskIdCounter = 8;
let currentFilter = 'all';

// ====================== INITIALIZATION ======================

document.addEventListener('DOMContentLoaded', function() {
    initializeTodos();
    loadRequirementsDropdown();
    loadTasks();
    updateTaskStatistics();
    initializeFilters();
});

function initializeTodos() {
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', handleTaskSubmit);
    }
}

function loadRequirementsDropdown() {
    const requirements = window.getRequirements ? window.getRequirements() : [];
    const dropdown = document.getElementById('task-requirement');

    if (!dropdown) return;

    dropdown.innerHTML = '<option value="">Select Requirement (Optional)</option>';

    requirements.forEach(requirement => {
        const option = document.createElement('option');
        option.value = requirement.id;
        option.textContent = requirement.title;
        dropdown.appendChild(option);
    });
}

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentFilter = this.dataset.filter;
            loadTasks();
        });
    });
}

// ====================== FORM HANDLING ======================

function handleTaskSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const requirements = window.getRequirements ? window.getRequirements() : [];
    const requirement = requirements.find(req => req.id == formData.get('requirement'));

    const task = {
        id: taskIdCounter++,
        title: formData.get('title'),
        description: formData.get('description'),
        requirementId: formData.get('requirement'),
        requirementTitle: requirement ? requirement.title : null,
        priority: formData.get('priority'),
        dueDate: formData.get('dueDate'),
        status: 'pending',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks.push(task);
    loadTasks();
    updateTaskStatistics();

    e.target.reset();
    showNotification('Task added successfully!', 'success');
}

function handleTaskUpdate(e) {
    e.preventDefault();

    const editId = parseInt(e.target.dataset.editId);
    const formData = new FormData(e.target);
    const requirements = window.getRequirements ? window.getRequirements() : [];
    const requirement = requirements.find(req => req.id == formData.get('requirement'));

    const taskIndex = tasks.findIndex(task => task.id === editId);
    if (taskIndex === -1) return;

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: formData.get('title'),
        description: formData.get('description'),
        requirementId: formData.get('requirement'),
        requirementTitle: requirement ? requirement.title : null,
        priority: formData.get('priority'),
        dueDate: formData.get('dueDate'),
        updatedAt: new Date().toISOString()
    };

    loadTasks();
    updateTaskStatistics();

    // Reset form to add mode
    e.target.reset();
    delete e.target.dataset.editId;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Add Task';

    e.target.removeEventListener('submit', handleTaskUpdate);
    e.target.addEventListener('submit', handleTaskSubmit);

    showNotification('Task updated successfully!', 'success');
}

// ====================== DISPLAY FUNCTIONS ======================

function loadTasks() {
    const tasksList = document.getElementById('tasks-list');
    if (!tasksList) return;

    let filteredTasks = filterTasks(tasks, currentFilter);

    if (filteredTasks.length === 0) {
        const filterMessage = currentFilter === 'all' ? 
            'No tasks added yet. Use the form above to add your first task.' :
            `No ${currentFilter} tasks found.`;
        tasksList.innerHTML = `<p class="empty-state">${filterMessage}</p>`;
        return;
    }

    // Sort by priority then by due date
    filteredTasks.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        if (a.priority !== b.priority) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return 0;
    });

    const tasksHTML = filteredTasks.map(task => createTaskCard(task)).join('');
    tasksList.innerHTML = tasksHTML;
}

/**
 * Filters tasks based on the selected filter criteria
 */
function filterTasks(tasks, filter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'overdue':
            return tasks.filter(task => {
                if (!task.dueDate || task.completed) return false;
                const dueDate = new Date(task.dueDate);
                return dueDate < today;
            });
        case 'high':
            return tasks.filter(task => task.priority === 'high');
        case 'all':
        default:
            return tasks;
    }
}

function createTaskCard(task) {
    const priorityClass = `priority-${task.priority}`;
    const statusClass = task.completed ? 'completed' : 'pending';
    const isOverdue = isTaskOverdue(task);
    const overdueClass = isOverdue ? 'overdue' : '';

    return `
        <div class="task-card ${priorityClass} ${statusClass} ${overdueClass}" data-id="${task.id}">
            <div class="task-header">
                <div class="task-title-section">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="toggleTaskCompletion(${task.id})">
                    <h4 class="task-title ${task.completed ? 'completed-text' : ''}">${task.title}</h4>
                </div>
                <div class="task-badges">
                    <span class="badge ${priorityClass}">${task.priority}</span>
                    ${task.requirementTitle ? `<span class="badge requirement-badge">${task.requirementTitle}</span>` : ''}
                    ${isOverdue ? '<span class="badge overdue-badge">Overdue</span>' : ''}
                </div>
            </div>

            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}

            <div class="task-meta">
                ${task.dueDate ? `<div class="due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</div>` : ''}
                <div class="task-status">Status: ${task.completed ? 'Completed' : 'Pending'}</div>
            </div>

            <div class="task-actions">
                <button class="edit-btn-small" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn-small" onclick="deleteTask(${task.id})">Delete</button>
            </div>

            <div class="task-footer">
                <small>Created: ${new Date(task.createdAt).toLocaleDateString()}</small>
                ${task.completed ? `<small>Completed: ${new Date(task.updatedAt).toLocaleDateString()}</small>` : ''}
            </div>
        </div>
    `;
}

function updateTaskStatistics() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.filter(task => !task.completed).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueTasks = tasks.filter(task => {
        if (!task.dueDate || task.completed) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < today;
    }).length;

    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('pending-tasks').textContent = pendingTasks;
    document.getElementById('overdue-tasks').textContent = overdueTasks;
}

// ====================== TASK OPERATIONS ======================

function isTaskOverdue(task) {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
}

function toggleTaskCompletion(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return;

    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    loadTasks();
    updateTaskStatistics();

    const status = tasks[taskIndex].completed ? 'completed' : 'pending';
    showNotification(`Task marked as ${status}!`, 'success');
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Populate form with existing data
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description || '';
    document.getElementById('task-requirement').value = task.requirementId || '';
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-due-date').value = task.dueDate || '';

    // Switch form to edit mode
    const form = document.getElementById('task-form');
    form.dataset.editId = id;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Task';

    form.removeEventListener('submit', handleTaskSubmit);
    form.addEventListener('submit', handleTaskUpdate);

    form.scrollIntoView({ behavior: 'smooth' });
}

function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    tasks = tasks.filter(task => task.id !== id);
    loadTasks();
    updateTaskStatistics();

    showNotification('Task deleted successfully!', 'success');
}

// ====================== UTILITY FUNCTIONS ======================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
