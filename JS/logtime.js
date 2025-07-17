/**
 * Time Tracking System
 * Handles logging work hours and generating time reports with visualizations
 */

// ====================== SAMPLE DATA ======================

const sampleTimeLogs = [
    {
        id: 1,
        date: "2024-12-01",
        requirementId: "1",
        requirementTitle: "User Authentication System",
        activity: "requirements-analysis",
        hours: 3.5,
        description: "Analyzed user authentication requirements and security considerations",
        createdAt: "2024-12-01T09:00:00.000Z"
    },
    {
        id: 2,
        date: "2024-12-01",
        requirementId: "1",
        requirementTitle: "User Authentication System",
        activity: "designing",
        hours: 2.0,
        description: "Created database schema and API endpoint designs",
        createdAt: "2024-12-01T13:00:00.000Z"
    },
    {
        id: 3,
        date: "2024-12-02",
        requirementId: "1",
        requirementTitle: "User Authentication System",
        activity: "coding",
        hours: 4.0,
        description: "Implemented user registration and login endpoints",
        createdAt: "2024-12-02T10:00:00.000Z"
    },
    {
        id: 4,
        date: "2024-12-02",
        requirementId: "2",
        requirementTitle: "Task Management Dashboard",
        activity: "requirements-analysis",
        hours: 2.5,
        description: "Defined task management functional requirements",
        createdAt: "2024-12-02T14:00:00.000Z"
    },
    {
        id: 5,
        date: "2024-12-03",
        requirementId: "2",
        requirementTitle: "Task Management Dashboard",
        activity: "designing",
        hours: 3.0,
        description: "Designed task dashboard UI and user flow",
        createdAt: "2024-12-03T09:00:00.000Z"
    },
    {
        id: 6,
        date: "2024-12-03",
        requirementId: "2",
        requirementTitle: "Task Management Dashboard",
        activity: "coding",
        hours: 5.0,
        description: "Implemented task CRUD operations and frontend components",
        createdAt: "2024-12-03T13:00:00.000Z"
    },
    {
        id: 7,
        date: "2024-12-04",
        requirementId: "1",
        requirementTitle: "User Authentication System",
        activity: "testing",
        hours: 2.5,
        description: "Wrote unit tests for authentication functions",
        createdAt: "2024-12-04T10:00:00.000Z"
    },
    {
        id: 8,
        date: "2024-12-04",
        requirementId: "3",
        requirementTitle: "Time Tracking Module",
        activity: "requirements-analysis",
        hours: 1.5,
        description: "Analyzed time tracking requirements and data models",
        createdAt: "2024-12-04T14:00:00.000Z"
    },
    {
        id: 9,
        date: "2024-12-05",
        requirementId: "3",
        requirementTitle: "Time Tracking Module",
        activity: "designing",
        hours: 2.0,
        description: "Designed time logging interface and reporting features",
        createdAt: "2024-12-05T09:00:00.000Z"
    },
    {
        id: 10,
        date: "2024-12-05",
        requirementId: "4",
        requirementTitle: "System Performance",
        activity: "testing",
        hours: 3.0,
        description: "Conducted performance testing and optimization",
        createdAt: "2024-12-05T13:00:00.000Z"
    },
    {
        id: 11,
        date: "2024-12-06",
        requirementId: "5",
        requirementTitle: "Mobile Responsiveness",
        activity: "designing",
        hours: 4.0,
        description: "Created responsive design layouts for mobile devices",
        createdAt: "2024-12-06T09:00:00.000Z"
    },
    {
        id: 12,
        date: "2024-12-06",
        requirementId: "6",
        requirementTitle: "Data Security",
        activity: "requirements-analysis",
        hours: 2.0,
        description: "Analyzed security requirements and compliance needs",
        createdAt: "2024-12-06T14:00:00.000Z"
    },
    {
        id: 13,
        date: "2024-12-07",
        requirementId: "",
        requirementTitle: "N/A",
        activity: "project-management",
        hours: 1.5,
        description: "Project planning and team coordination meeting",
        createdAt: "2024-12-07T09:00:00.000Z"
    },
    {
        id: 14,
        date: "2024-12-07",
        requirementId: "2",
        requirementTitle: "Task Management Dashboard",
        activity: "testing",
        hours: 3.5,
        description: "Tested task management features and fixed bugs",
        createdAt: "2024-12-07T11:00:00.000Z"
    },
    {
        id: 15,
        date: "2024-12-08",
        requirementId: "5",
        requirementTitle: "Mobile Responsiveness",
        activity: "coding",
        hours: 3.0,
        description: "Implemented responsive CSS and mobile optimizations",
        createdAt: "2024-12-08T10:00:00.000Z"
    }
];

// ====================== GLOBAL VARIABLES ======================

// Time logs storage - check if already declared
if (typeof timeLogs === 'undefined') {
    var timeLogs = [];
}
let timeLogIdCounter = 16;

// ====================== STORAGE FUNCTIONS ======================

function loadTimeLogsFromStorage() {
    try {
        const stored = localStorage.getItem('projectTimeLogs');
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Error loading time logs from storage:', error);
        return null;
    }
}

function saveTimeLogsToStorage() {
    try {
        localStorage.setItem('projectTimeLogs', JSON.stringify(timeLogs));
    } catch (error) {
        console.error('Error saving time logs to storage:', error);
    }
}

// ====================== STORAGE FUNCTIONS ======================

/**
 * Load time logs from localStorage
 */
function loadTimeLogsFromStorage() {
    try {
        const stored = localStorage.getItem('timeLogs');
        if (stored) {
            timeLogs = JSON.parse(stored);
        } else {
            // Initialize with sample data if no stored data exists
            initializeSampleTimeData();
        }
    } catch (error) {
        console.error('Error loading time logs from storage:', error);
        initializeSampleTimeData();
    }
}

/**
 * Save time logs to localStorage
 */
function saveTimeLogsToStorage() {
    try {
        localStorage.setItem('timeLogs', JSON.stringify(timeLogs));
    } catch (error) {
        console.error('Error saving time logs to storage:', error);
    }
}

// ====================== INITIALIZATION ======================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize timeLogs with sample data if nothing in storage
    const storedTimeLogs = loadTimeLogsFromStorage();
    timeLogs = storedTimeLogs || sampleTimeLogs;
    
    // If we used sample data, save it to storage
    if (!storedTimeLogs) {
        saveTimeLogsToStorage();
    }
    
    initializeTimeTracking();
    loadRequirementsDropdown();
    loadTimeLogs();
    updateTimeSummary();
    updateRequirementHours();

    // Set today as default date
    const today = new Date().toISOString().split('T')[0];
    const logDateElement = document.getElementById('log-date');
    if (logDateElement) {
        logDateElement.value = today;
    }
});

function initializeTimeTracking() {
    const timeLogForm = document.getElementById('time-log-form');
    if (timeLogForm) {
        timeLogForm.addEventListener('submit', handleTimeLogSubmit);
    }
}

function loadRequirementsDropdown() {
    // Get requirements from global function or use fallback data
    const requirements = window.getRequirements ? window.getRequirements() : [
        {id: 1, title: "User Authentication System"},
        {id: 2, title: "Task Management Dashboard"},
        {id: 3, title: "Time Tracking Module"},
        {id: 4, title: "System Performance"},
        {id: 5, title: "Mobile Responsiveness"},
        {id: 6, title: "Data Security"}
    ];
    const dropdown = document.getElementById('log-requirement');

    if (!dropdown) return;

    dropdown.innerHTML = '<option value="">Select Requirement</option>';

    requirements.forEach(requirement => {
        const option = document.createElement('option');
        option.value = requirement.id;
        option.textContent = requirement.title;
        dropdown.appendChild(option);
    });
}

// ====================== FORM HANDLING ======================

function handleTimeLogSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const requirements = window.getRequirements ? window.getRequirements() : [];
    const requirement = requirements.find(req => req.id == formData.get('requirement'));

    const timeLog = {
        id: timeLogIdCounter++,
        date: formData.get('date'),
        requirementId: formData.get('requirement'),
        requirementTitle: requirement ? requirement.title : 'N/A',
        activity: formData.get('activity'),
        hours: parseFloat(formData.get('hours')),
        description: formData.get('description'),
        createdAt: new Date().toISOString()
    };

    timeLogs.push(timeLog);
    saveTimeLogsToStorage();
    loadTimeLogs();
    updateTimeSummary();
    updateRequirementHours();

    // Reset form and set today's date
    e.target.reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('log-date').value = today;

    showNotification('Time logged successfully!', 'success');
}

// ====================== DISPLAY FUNCTIONS ======================

function loadTimeLogs() {
    const timeLogsBody = document.getElementById('time-logs-body');
    if (!timeLogsBody) return;

    if (timeLogs.length === 0) {
        timeLogsBody.innerHTML = '<tr class="empty-state"><td colspan="6">No time logs recorded yet.</td></tr>';
        return;
    }

    const sortedLogs = timeLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    const logsHTML = sortedLogs.map(log => createTimeLogRow(log)).join('');
    timeLogsBody.innerHTML = logsHTML;
}

function createTimeLogRow(log) {
    const activityLabel = formatActivityLabel(log.activity);
    const formattedDate = new Date(log.date).toLocaleDateString();

    return `
        <tr>
            <td>${formattedDate}</td>
            <td>${log.requirementTitle}</td>
            <td>${activityLabel}</td>
            <td>${log.hours.toFixed(1)}h</td>
            <td>${log.description || '-'}</td>
            <td>
                <button class="delete-btn-small" onclick="deleteTimeLog(${log.id})">Delete</button>
            </td>
        </tr>
    `;
}

function updateTimeSummary() {
    const activities = {
        'requirements-analysis': 0,
        'designing': 0,
        'coding': 0,
        'testing': 0,
        'project-management': 0
    };

    timeLogs.forEach(log => {
        if (activities.hasOwnProperty(log.activity)) {
            activities[log.activity] += log.hours;
        }
    });

    document.getElementById('req-analysis-hours').textContent = activities['requirements-analysis'].toFixed(1);
    document.getElementById('designing-hours').textContent = activities['designing'].toFixed(1);
    document.getElementById('coding-hours').textContent = activities['coding'].toFixed(1);
    document.getElementById('testing-hours').textContent = activities['testing'].toFixed(1);
    document.getElementById('project-mgmt-hours').textContent = activities['project-management'].toFixed(1);

    updateTimeChart(activities);
}

/**
 * Creates and updates the time distribution pie chart
 */
function updateTimeChart(activities) {
    const canvas = document.getElementById('timeChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = (canvas.height / 2) - 20;
    const radius = Math.min(centerX, centerY) - 40;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const totalHours = Object.values(activities).reduce((sum, hours) => sum + hours, 0);

    if (totalHours === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No time logged yet', centerX, centerY);
        return;
    }

    const colors = {
        'requirements-analysis': '#3b82f6',
        'designing': '#10b981',
        'coding': '#f59e0b',
        'testing': '#ef4444',
        'project-management': '#8b5cf6'
    };

    let startAngle = 0;

    Object.entries(activities).forEach(([activity, hours]) => {
        if (hours > 0) {
            const sliceAngle = (hours / totalHours) * 2 * Math.PI;

            // Draw pie slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[activity];
            ctx.fill();

            // Draw hour labels on slices
            const labelAngle = startAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(hours.toFixed(1) + 'h', labelX, labelY);

            startAngle += sliceAngle;
        }
    });

    drawChartLegend(ctx, colors, activities, canvas.width, canvas.height);
}

/**
 * Draws the legend below the pie chart with proper positioning
 */
function drawChartLegend(ctx, colors, activities, canvasWidth, canvasHeight) {
    const legendStartY = canvasHeight - 60;
    const legendItemWidth = 120;
    const legendItemHeight = 18;

    ctx.font = '12px Arial';
    ctx.textAlign = 'left';

    const activityLabels = {
        'requirements-analysis': 'Requirements',
        'designing': 'Designing',
        'coding': 'Coding',
        'testing': 'Testing',
        'project-management': 'Project Mgmt'
    };

    let activeActivities = Object.entries(activities).filter(([activity, hours]) => hours > 0);
    const itemsPerRow = 2;

    activeActivities.forEach(([activity, hours], index) => {
        const row = Math.floor(index / itemsPerRow);
        const col = index % itemsPerRow;
        const itemsInThisRow = Math.min(itemsPerRow, activeActivities.length - row * itemsPerRow);

        // Center each row
        const rowStartX = (canvasWidth - (itemsInThisRow * legendItemWidth)) / 2;
        const x = rowStartX + col * legendItemWidth;
        const y = legendStartY + row * legendItemHeight;

        // Draw color indicator
        ctx.fillStyle = colors[activity];
        ctx.fillRect(x, y, 12, 12);

        // Draw activity label
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(activityLabels[activity], x + 18, y + 9);
    });
}

function updateRequirementHours() {
    const requirementHoursContainer = document.getElementById('requirement-hours');
    if (!requirementHoursContainer) return;

    const requirementHours = {};

    // Calculate hours per requirement
    timeLogs.forEach(log => {
        if (log.requirementId) {
            if (!requirementHours[log.requirementId]) {
                requirementHours[log.requirementId] = {
                    title: log.requirementTitle,
                    activities: {
                        'requirements-analysis': 0,
                        'designing': 0,
                        'coding': 0,
                        'testing': 0,
                        'project-management': 0
                    },
                    total: 0
                };
            }

            requirementHours[log.requirementId].activities[log.activity] += log.hours;
            requirementHours[log.requirementId].total += log.hours;
        }
    });

    if (Object.keys(requirementHours).length === 0) {
        requirementHoursContainer.innerHTML = '<p class="empty-state">No time logs recorded yet.</p>';
        return;
    }

    let html = '';
    Object.values(requirementHours).forEach(req => {
        html += `
            <div class="requirement-hours-card">
                <h4>${req.title}</h4>
                <div class="hours-breakdown">
                    <div class="hours-item">
                        <span>Requirements Analysis:</span>
                        <span>${req.activities['requirements-analysis'].toFixed(1)}h</span>
                    </div>
                    <div class="hours-item">
                        <span>Designing:</span>
                        <span>${req.activities['designing'].toFixed(1)}h</span>
                    </div>
                    <div class="hours-item">
                        <span>Coding:</span>
                        <span>${req.activities['coding'].toFixed(1)}h</span>
                    </div>
                    <div class="hours-item">
                        <span>Testing:</span>
                        <span>${req.activities['testing'].toFixed(1)}h</span>
                    </div>
                    <div class="hours-item">
                        <span>Project Management:</span>
                        <span>${req.activities['project-management'].toFixed(1)}h</span>
                    </div>
                    <div class="hours-item total">
                        <span><strong>Total:</strong></span>
                        <span><strong>${req.total.toFixed(1)}h</strong></span>
                    </div>
                </div>
            </div>
        `;
    });

    requirementHoursContainer.innerHTML = html;
}

// ====================== CRUD OPERATIONS ======================

function deleteTimeLog(id) {
    if (!confirm('Are you sure you want to delete this time log?')) return;

    timeLogs = timeLogs.filter(log => log.id !== id);
    saveTimeLogsToStorage();
    loadTimeLogs();
    updateTimeSummary();
    updateRequirementHours();

    showNotification('Time log deleted successfully!', 'success');
}

// ====================== UTILITY FUNCTIONS ======================

function formatActivityLabel(activity) {
    const labels = {
        'requirements-analysis': 'Requirements Analysis',
        'designing': 'Designing',
        'coding': 'Coding',
        'testing': 'Testing',
        'project-management': 'Project Management'
    };

    return labels[activity] || activity;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}