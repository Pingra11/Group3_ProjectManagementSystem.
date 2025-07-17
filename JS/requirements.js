/**
 * Requirements Management System
 * Handles CRUD operations for project requirements
 */

// ====================== SAMPLE DATA ======================

const sampleRequirements = [
    {
        id: 1,
        title: "User Authentication System",
        description: "Implement secure login and registration functionality with password hashing and session management.",
        type: "functional",
        priority: "high",
        status: "pending",
        createdAt: "2024-12-01T10:00:00.000Z",
        updatedAt: "2024-12-01T10:00:00.000Z"
    },
    {
        id: 2,
        title: "Task Management Dashboard",
        description: "Create an intuitive interface for users to create, edit, delete, and track project tasks with priority levels.",
        type: "functional",
        priority: "high",
        status: "pending",
        createdAt: "2024-12-01T11:00:00.000Z",
        updatedAt: "2024-12-01T11:00:00.000Z"
    },
    {
        id: 3,
        title: "Time Tracking Module",
        description: "Develop functionality to log work hours by project phase and generate time reports.",
        type: "functional",
        priority: "medium",
        status: "pending",
        createdAt: "2024-12-01T12:00:00.000Z",
        updatedAt: "2024-12-01T12:00:00.000Z"
    },
    {
        id: 4,
        title: "System Performance",
        description: "Ensure the application loads within 2 seconds and handles up to 100 concurrent users.",
        type: "non-functional",
        priority: "high",
        status: "pending",
        createdAt: "2024-12-01T13:00:00.000Z",
        updatedAt: "2024-12-01T13:00:00.000Z"
    },
    {
        id: 5,
        title: "Mobile Responsiveness",
        description: "Design responsive layouts that work seamlessly on desktop, tablet, and mobile devices.",
        type: "non-functional",
        priority: "medium",
        status: "pending",
        createdAt: "2024-12-01T14:00:00.000Z",
        updatedAt: "2024-12-01T14:00:00.000Z"
    },
    {
        id: 6,
        title: "Data Security",
        description: "Implement encryption for sensitive data and secure API endpoints with proper authentication.",
        type: "non-functional",
        priority: "high",
        status: "pending",
        createdAt: "2024-12-01T15:00:00.000Z",
        updatedAt: "2024-12-01T15:00:00.000Z"
    }
];

// ====================== GLOBAL VARIABLES ======================

let requirements = sampleRequirements;
let requirementIdCounter = 7;

// ====================== INITIALIZATION ======================

document.addEventListener('DOMContentLoaded', function() {
    initializeRequirements();
    loadRequirements();
    updateRequirementsSummary();
});

function initializeRequirements() {
    const requirementForm = document.getElementById('requirement-form');
    if (requirementForm) {
        requirementForm.addEventListener('submit', handleRequirementSubmit);
    }
}

// ====================== FORM HANDLING ======================

function handleRequirementSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const requirement = {
        id: requirementIdCounter++,
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('type'),
        priority: formData.get('priority'),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    requirements.push(requirement);
    loadRequirements();
    updateRequirementsSummary();

    e.target.reset();
    showNotification('Requirement added successfully!', 'success');
}

function handleRequirementUpdate(e) {
    e.preventDefault();

    const editId = parseInt(e.target.dataset.editId);
    const formData = new FormData(e.target);

    const requirementIndex = requirements.findIndex(req => req.id === editId);
    if (requirementIndex === -1) return;

    requirements[requirementIndex] = {
        ...requirements[requirementIndex],
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('type'),
        priority: formData.get('priority'),
        updatedAt: new Date().toISOString()
    };

    loadRequirements();
    updateRequirementsSummary();

    // Reset form to add mode
    e.target.reset();
    delete e.target.dataset.editId;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Add Requirement';

    e.target.removeEventListener('submit', handleRequirementUpdate);
    e.target.addEventListener('submit', handleRequirementSubmit);

    showNotification('Requirement updated successfully!', 'success');
}

// ====================== DISPLAY FUNCTIONS ======================

function loadRequirements() {
    const requirementsList = document.getElementById('requirements-list');
    if (!requirementsList) return;

    if (requirements.length === 0) {
        requirementsList.innerHTML = '<p class="empty-state">No requirements added yet. Use the form above to add your first requirement.</p>';
        return;
    }

    const requirementsHTML = requirements.map(requirement => createRequirementCard(requirement)).join('');
    requirementsList.innerHTML = requirementsHTML;
}

function createRequirementCard(requirement) {
    const priorityClass = `priority-${requirement.priority}`;
    const typeClass = `type-${requirement.type}`;

    return `
        <div class="requirement-card ${priorityClass}" data-id="${requirement.id}">
            <div class="requirement-header">
                <h4>${requirement.title}</h4>
                <div class="requirement-badges">
                    <span class="badge ${typeClass}">${requirement.type}</span>
                    <span class="badge ${priorityClass}">${requirement.priority}</span>
                </div>
            </div>
            <div class="requirement-content">
                <p>${requirement.description}</p>
            </div>
            <div class="requirement-actions">
                <button class="edit-btn-small" onclick="editRequirement(${requirement.id})">Edit</button>
                <button class="delete-btn-small" onclick="deleteRequirement(${requirement.id})">Delete</button>
            </div>
            <div class="requirement-footer">
                <small>Created: ${new Date(requirement.createdAt).toLocaleDateString()}</small>
            </div>
        </div>
    `;
}

function updateRequirementsSummary() {
    const totalReqs = requirements.length;
    const functionalReqs = requirements.filter(req => req.type === 'functional').length;
    const nonFunctionalReqs = requirements.filter(req => req.type === 'non-functional').length;

    document.getElementById('total-requirements').textContent = totalReqs;
    document.getElementById('functional-count').textContent = functionalReqs;
    document.getElementById('non-functional-count').textContent = nonFunctionalReqs;
}

// ====================== CRUD OPERATIONS ======================

function editRequirement(id) {
    const requirement = requirements.find(req => req.id === id);
    if (!requirement) return;

    // Populate form with existing data
    document.getElementById('req-title').value = requirement.title;
    document.getElementById('req-description').value = requirement.description;
    document.getElementById('req-type').value = requirement.type;
    document.getElementById('req-priority').value = requirement.priority;

    // Switch form to edit mode
    const form = document.getElementById('requirement-form');
    form.dataset.editId = id;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Update Requirement';

    form.removeEventListener('submit', handleRequirementSubmit);
    form.addEventListener('submit', handleRequirementUpdate);
}

function deleteRequirement(id) {
    if (!confirm('Are you sure you want to delete this requirement?')) return;

    requirements = requirements.filter(req => req.id !== id);
    loadRequirements();
    updateRequirementsSummary();

    showNotification('Requirement deleted successfully!', 'success');
}

// ====================== UTILITY FUNCTIONS ======================

/**
 * Exposes requirements data to other modules
 */
function getRequirements() {
    return requirements;
}

/**
 * Displays notification messages to user
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Make function globally available for other modules
window.getRequirements = getRequirements;