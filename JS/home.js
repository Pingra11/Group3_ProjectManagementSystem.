/**
 * Home Page Functionality and Shared Utilities
 * Handles modal editing, risk management, and shared functions across pages
 */

let currentSection = null;

// ====================== RISK MANAGEMENT ======================

/**
 * Cycles through risk levels (Low -> Medium -> High -> Low)
 * Used by risk tags throughout the application
 */
function cycleRisk(el) {
  const levels = ['Low', 'Medium', 'High'];
  const colors = ['green', 'yellow', 'red'];

  let current = levels.indexOf(el.innerText.trim());
  const next = (current + 1) % levels.length;

  el.innerText = levels[next];
  el.classList.remove('green', 'yellow', 'red');
  el.classList.add(colors[next]);
}

// Make cycleRisk globally available
window.cycleRisk = cycleRisk;

// ====================== MODAL FUNCTIONS ======================

/**
 * Opens the edit modal for a specific dashboard section
 */
function openModal(sectionId) {
  currentSection = sectionId;
  const target = document.querySelector(`#card-${currentSection} .editable-content`);
  if (!target) return;

  let plainText = '';

  // Extract content based on section type
  if (currentSection === 'overview') {
    plainText = target.innerText.trim();
  } else {
    [...target.children].forEach(child => {
      const clone = child.cloneNode(true);
      clone.querySelectorAll('.risk-tag').forEach(tag => tag.remove());

      if (child.tagName === 'UL') {
        [...clone.children].forEach(li => {
          plainText += `${li.innerText.trim()}\n`;
        });
      } else if (child.tagName === 'LI') {
        plainText += `${clone.innerText.trim()}\n`;
      } else {
        plainText += `${clone.innerText.trim()}\n`;
      }
    });
  }

  const textarea = document.getElementById('shared-textarea');
  textarea.value = plainText.trim();

  setModalInstructions(sectionId);
  document.getElementById('modal-title').innerText = `Edit ${formatTitle(sectionId)}`;
  document.getElementById('shared-modal').style.display = 'block';

  setTimeout(() => textarea.focus(), 100);
}

/**
 * Sets section-specific instructions and placeholders for modal editing
 */
function setModalInstructions(sectionId) {
  const textarea = document.getElementById('shared-textarea');
  const instructions = document.getElementById('edit-instructions');

  const config = {
    overview: {
      placeholder: 'Enter project description...',
      instruction: 'Describe your project in detail. Use clear, concise language.'
    },
    lead: {
      placeholder: 'Name: John Doe\nRole: Project Manager',
      instruction: 'Format as "Label: Value" on separate lines (e.g., Name: John Doe).'
    },
    members: {
      placeholder: 'Team Member 1\nTeam Member 2\nTeam Member 3',
      instruction: 'List each team member on a separate line.'
    },
    risks: {
      placeholder: 'Risk Title: Description of the risk',
      instruction: 'Format as "Title: Description" on separate lines. Risk levels can be changed after saving.'
    }
  };

  const settings = config[sectionId] || { placeholder: '', instruction: '' };
  textarea.placeholder = settings.placeholder;
  instructions.textContent = settings.instruction;
}

function closeModal() {
  document.getElementById('shared-modal').style.display = 'none';
  currentSection = null;
}

// ====================== MODAL EVENT HANDLERS ======================

document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('shared-modal');
  if (modal) {
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
  }
});

// Keyboard shortcuts for modal
document.addEventListener('keydown', function(e) {
  const modal = document.getElementById('shared-modal');
  if (modal && modal.style.display === 'block') {
    if (e.key === 'Escape') {
      closeModal();
    }
    if (e.ctrlKey && e.key === 'Enter') {
      const saveBtn = document.getElementById('shared-save-btn');
      if (saveBtn) saveBtn.click();
    }
  }
});

// ====================== SAVE FUNCTIONALITY ======================

/**
 * Handles saving edited content with different formatting based on section type
 */
document.addEventListener('DOMContentLoaded', function() {
  const saveBtn = document.getElementById('shared-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (!currentSection) return;

      const updatedText = document.getElementById('shared-textarea').value;
      const lines = updatedText.split('\n').map(line => line.trim()).filter(Boolean);

      let formattedHTML = '';
      let inList = false;

      // Process lines and format appropriately
      lines.forEach(line => {
        if (line.startsWith('- ')) {
          if (!inList) {
            formattedHTML += '<ul>';
            inList = true;
          }
          formattedHTML += `<li>${line.slice(2)}</li>`;
        } else {
          if (inList) {
            formattedHTML += '</ul>';
            inList = false;
          }
          const lineWithBreaks = line.replace(/\n/g, '<br>');
          formattedHTML += `<p>${lineWithBreaks}</p>`;
        }
      });

      if (inList) {
        formattedHTML += '</ul>';
      }

      const target = document.querySelector(`#card-${currentSection} .editable-content`);

      // Apply section-specific formatting
      if (currentSection === 'lead') {
        const leadItems = lines.map(line => {
          const [label, ...rest] = line.split(':');
          const value = rest.join(':').trim();
          return `<p><strong>${label.trim()}:</strong> ${value}</p>`;
        });
        target.innerHTML = leadItems.join('');
      } else if (currentSection === 'risks') {
        const existingItems = target.querySelectorAll('li');

        const newItems = lines.map((line, i) => {
          const [label, ...rest] = line.split(':');
          const description = rest.join(':').trim();

          // Preserve existing risk tags or create new ones
          const existing = existingItems[i];
          let riskTag = '';

          if (existing) {
            const span = existing.querySelector('.risk-tag');
            if (span) {
              riskTag = `<span class="risk-tag ${span.classList[1]}" onclick="cycleRisk(this)">${span.innerText}</span>`;
            }
          } else {
            riskTag = `<span class="risk-tag yellow" onclick="cycleRisk(this)">Medium</span>`;
          }

          return `<li><strong>${label.trim()}:</strong> ${description.trim()}${riskTag}</li>`;
        });

        target.innerHTML = `<ul>${newItems.join('')}</ul>`;
      } else if (currentSection === 'members') {
        const memberItems = lines.map(line => `<li>${line}</li>`);
        target.innerHTML = `<ul>${memberItems.join('')}</ul>`;
      } else {
        target.innerHTML = formattedHTML;
      }

      closeModal();
    });
  }
});

// ====================== UTILITY FUNCTIONS ======================

/**
 * Formats section IDs into readable titles
 */
function formatTitle(sectionId) {
  const words = sectionId.split('-');
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}


// ====================== INITIALIZATION ======================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page loaded, initializing...');
    initializeHomePage();
    loadDashboardData();
    console.log('Home page initialization complete');
});

/**
 * Initialize home page components and event listeners
 */
function initializeHomePage() {
    // Update last updated timestamps on cards
    updateCardTimestamps();
    
    // Add any other home page initialization logic here
    console.log('Home page components initialized');
}

/**
 * Load dashboard data and update displays
 */
function loadDashboardData() {
    // Update dashboard with current project data
    console.log('Dashboard data loaded');
    
    // This function can be expanded to pull data from other modules
    // and update the dashboard cards accordingly
}

/**
 * Update the timestamp displays on dashboard cards
 */
function updateCardTimestamps() {
    const cards = document.querySelectorAll('.card-updated');
    const now = new Date();
    const timestamp = `Last updated: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
    
    cards.forEach(card => {
        card.textContent = timestamp;
    });
}

// ====================== RISK STATUS CYCLING ======================

function cycleRisk(element) {
    const currentClass = element.className.split(' ').find(cls => 
        ['green', 'yellow', 'red'].includes(cls)
    );

    const riskLevels = {
        'green': { next: 'yellow', text: 'Medium', class: 'yellow' },
        'yellow': { next: 'red', text: 'High', class: 'red' },
        'red': { next: 'green', text: 'Low', class: 'green' }
    };

    const current = currentClass || 'yellow';
    const next = riskLevels[current];

    // Remove current risk class
    element.classList.remove('green', 'yellow', 'red');

    // Add new risk class
    element.classList.add(next.class);

    // Update text content
    element.textContent = next.text;
}