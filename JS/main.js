
let currentSection = null;

/* ====================== MODAL FUNCTIONS ====================== */

/**
 * Opens the edit modal for a specific section
 * @param {string} sectionId - The ID of the section to edit (overview, lead, members, risks)
 */
function openModal(sectionId) {
  currentSection = sectionId;

  // Get the editable content element for the specified section
  const target = document.querySelector(`#card-${currentSection} .editable-content`);
  if (!target) return;

  let plainText = '';

  // Handle different content types based on section
  if (currentSection === 'overview') {
    // Project overview is a simple paragraph
    plainText = target.innerText.trim();
  } else {
    // Loop through child elements and extract text content
    [...target.children].forEach(child => {
      const clone = child.cloneNode(true);
      // Remove risk tags from cloned content for clean editing
      clone.querySelectorAll('.risk-tag').forEach(tag => tag.remove());

      // Handle different element types
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

  // Set the textarea value and configure modal
  const textarea = document.getElementById('shared-textarea');
  textarea.value = plainText.trim();
  
  // Set section-specific instructions and placeholders
  setModalInstructions(sectionId);
  
  // Update modal title and show modal
  document.getElementById('modal-title').innerText = `Edit ${formatTitle(sectionId)}`;
  document.getElementById('shared-modal').style.display = 'block';
  
  // Focus on textarea after modal is displayed
  setTimeout(() => textarea.focus(), 100);
}

/**
 * Sets modal instructions and placeholders based on section type
 * @param {string} sectionId - The section being edited
 */
function setModalInstructions(sectionId) {
  const textarea = document.getElementById('shared-textarea');
  const instructions = document.getElementById('edit-instructions');
  
  let placeholder = '';
  let instructionText = '';
  
  // Configure instructions based on section type
  switch(sectionId) {
    case 'overview':
      placeholder = 'Enter project description...';
      instructionText = 'Describe your project in detail. Use clear, concise language.';
      break;
    case 'lead':
      placeholder = 'Name: John Doe\nRole: Project Manager';
      instructionText = 'Format as "Label: Value" on separate lines (e.g., Name: John Doe).';
      break;
    case 'members':
      placeholder = 'Team Member 1\nTeam Member 2\nTeam Member 3';
      instructionText = 'List each team member on a separate line.';
      break;
    case 'risks':
      placeholder = 'Risk Title: Description of the risk';
      instructionText = 'Format as "Title: Description" on separate lines. Risk levels can be changed after saving.';
      break;
  }
  
  textarea.placeholder = placeholder;
  instructions.textContent = instructionText;
}

/**
 * Closes the edit modal and resets current section
 */
function closeModal() {
  document.getElementById('shared-modal').style.display = 'none';
  currentSection = null;
}

/* ====================== MODAL EVENT LISTENERS ====================== */

// Close modal when clicking outside of it
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('shared-modal');
  if (modal) {
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
    // Escape key closes modal
    if (e.key === 'Escape') {
      closeModal();
    }
    // Ctrl+Enter saves changes
    if (e.ctrlKey && e.key === 'Enter') {
      const saveBtn = document.getElementById('shared-save-btn');
      if (saveBtn) saveBtn.click();
    }
  }
});

/* ====================== SAVE FUNCTIONALITY ====================== */

/**
 * Saves the edited content back to the appropriate card
 * Handles different content types and formatting
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

      // Process each line and format appropriately
      lines.forEach(line => {
        if (line.startsWith('- ')) {
          // Handle list items starting with dash
          if (!inList) {
            formattedHTML += '<ul>';
            inList = true;
          }
          formattedHTML += `<li>${line.slice(2)}</li>`;
        } else {
          // Handle regular paragraphs
          if (inList) {
            formattedHTML += '</ul>';
            inList = false;
          }
          // Replace newlines with <br> tags to preserve line breaks
          const lineWithBreaks = line.replace(/\n/g, '<br>');
          formattedHTML += `<p>${lineWithBreaks}</p>`;
        }
      });

      // Close any open list tags
      if (inList) {
        formattedHTML += '</ul>';
      }

      const target = document.querySelector(`#card-${currentSection} .editable-content`);

      // Handle different section types with specific formatting
      if (currentSection === 'lead') {
        // Format lead information as label-value pairs
        const leadItems = lines.map(line => {
          const [label, ...rest] = line.split(':');
          const value = rest.join(':').trim();
          return `<p><strong>${label.trim()}:</strong> ${value}</p>`;
        });
        target.innerHTML = leadItems.join('');
      } else if (currentSection === 'risks') {
        // Handle risks with existing risk tags
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
        // Handle team members as a simple list
        const memberItems = lines.map(line => `<li>${line}</li>`);
        target.innerHTML = `<ul>${memberItems.join('')}</ul>`;
      } else {
        // Default formatting for other sections
        target.innerHTML = formattedHTML;
      }

      closeModal();
    });
  }
});

/* ====================== RISK MANAGEMENT FUNCTIONS ====================== */

/**
 * Cycles through risk levels (Low -> Medium -> High -> Low)
 * @param {HTMLElement} el - The risk tag element to cycle
 */
function cycleRisk(el) {
  const levels = ['Low', 'Medium', 'High'];
  const colors = ['green', 'yellow', 'red'];

  let current = levels.indexOf(el.innerText.trim());
  const next = (current + 1) % levels.length;

  el.innerText = levels[next];

  // Update CSS classes for styling
  el.classList.remove('green', 'yellow', 'red');
  el.classList.add(colors[next]);
}

/* ====================== UTILITY FUNCTIONS ====================== */

/**
 * Formats section IDs into readable titles
 * @param {string} sectionId - The section ID to format
 * @returns {string} Formatted title
 */
function formatTitle(sectionId) {
  const words = sectionId.split('-');
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/* ====================== INITIALIZATION & EVENT LISTENERS ====================== */

/**
 * Initialize logout functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to log out?')) {
        alert('Logged out successfully!');
        // In a real application, you would redirect to login page
        // Example: window.location.href = '/login';
        // For now, we'll just refresh the page
        window.location.reload();
      }
    });
  }
});

/**
 * Initialize navigation functionality for sidebar links
 * No longer needed since we're using actual page navigation
 */
