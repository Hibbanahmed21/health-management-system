/*
  HDIMS (Health Data & Information Management System) JavaScript

  This script contains the application logic extracted from the original
  single‑page implementation.  It handles navigation between screens,
  user‑role selection, form submission behaviour, tab switching and drag
  events on the upload zone.  All functions are attached to the global
  window object to make them accessible from inline HTML attributes
  (e.g. onclick="showScreen('screen-login')").

  The structure and behaviour are preserved from the original code.  If you
  need to enhance or extend the functionality, consider adding new helper
  functions here rather than embedding logic directly in the HTML.
*/

// State management
window.currentScreen = 'screen-splash';
window.screenHistory = [];
window.currentRole = 'patient';

// Initialise the application
document.addEventListener('DOMContentLoaded', () => {
  // Automatically transition from the splash to the login screen after 3s
  setTimeout(() => {
    window.showScreen('screen-login');
  }, 3000);
});

/**
 * Shows a specific screen by id.  Moves the current screen to the left and
 * brings the requested screen into view.  Screens are identified by the
 * `id` attribute on their DOM element.
 *
 * @param {string} screenId The id of the screen to display.
 */
window.showScreen = function showScreen(screenId) {
  const oldScreenEl = document.getElementById(window.currentScreen);
  const newScreenEl = document.getElementById(screenId);

  if (oldScreenEl) {
    oldScreenEl.classList.remove('active');
    oldScreenEl.classList.add('slide-left');
  }

  if (newScreenEl) {
    newScreenEl.classList.remove('slide-left');
    newScreenEl.classList.add('active');
  }

  window.screenHistory.push(window.currentScreen);
  window.currentScreen = screenId;

  const bottomNav = document.getElementById("bottomNav");

  if (screenId === "screen-doctor" || screenId === "screen-patient" || screenId === "screen-admin") {
    bottomNav.style.display = "flex";
  } else {
    bottomNav.style.display = "none";
  }
};

/**
 * Navigates back to the previous screen using the history stack.
 */
window.goBack = function goBack() {
  if (window.screenHistory.length > 0) {
    const previousScreen = window.screenHistory.pop();
    const oldScreenEl = document.getElementById(window.currentScreen);
    const newScreenEl = document.getElementById(previousScreen);

    if (oldScreenEl) {
      oldScreenEl.classList.remove('active');
    }

    if (newScreenEl) {
      newScreenEl.classList.remove('slide-left');
      newScreenEl.classList.add('active');
    }

    window.currentScreen = previousScreen;
  }
};

/**
 * Selects a user role and updates the profile screen accordingly.  Then
 * navigates to the appropriate dashboard for the chosen role.
 *
 * @param {string} role The role selected (e.g. 'patient', 'doctor', 'admin').
 */
window.selectRole = function selectRole(role) {
  window.currentRole = role;

  // Update profile details based on role
  const profileAvatar = document.getElementById('profile-avatar');
  const profileName = document.getElementById('profile-name');
  const profileRoleEl = document.getElementById('profile-role');

  const roleData = {
    patient: {
      avatar: 'SJ',
      name: 'Sarah Johnson',
      role: 'Patient'
    },
    doctor: {
      avatar: 'RC',
      name: 'Dr. Robert Chen',
      role: 'Cardiologist'
    },
    admin: {
      avatar: 'AD',
      name: 'Admin User',
      role: 'System Administrator'
    }
  };

  const data = roleData[role];
  if (profileAvatar) profileAvatar.textContent = data.avatar;
  if (profileName) profileName.textContent = data.name;
  if (profileRoleEl) profileRoleEl.textContent = data.role;

  // Navigate to the corresponding dashboard
  window.showScreen(`screen-${role}-dashboard`);
};

// Attach event listeners for login and signup forms to transition to role selection
let loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.showScreen('screen-role');
  });
}

const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.showScreen('screen-role');
  });
}

// Tab functionality: toggles the active state within each tab container
document.querySelectorAll('.tabs').forEach((tabsContainer) => {
  tabsContainer.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
});

// Upload zone drag and drop handling
const uploadZone = document.getElementById('upload-zone');
if (uploadZone) {
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    // Placeholder: handle file drop logic here if needed
    // Files can be accessed via e.dataTransfer.files
  });
}
// ================== BACKEND CONNECTION ==================

async function loadBackendData() {
  try {
    const data = await getPatients();  // ✅ THIS is important

    console.log("Backend Response:", data);

    const output = document.getElementById("output");
    if (output) {
      output.innerHTML = `<h3>${data.message}</h3>`;
    }

  } catch (error) {
    console.error("Error connecting to backend:", error);
  }
}

window.addEventListener("load", () => {
  loadBackendData();
  loadPatients();
});

// ================= ADD PATIENT FUNCTION =================

async function handleAddPatient() {
  const name = document.getElementById("pname").value;
  const age = document.getElementById("page").value;
  const disease = document.getElementById("pdisease").value;

  if (!name || !age || !disease) {
    alert("Please fill all fields");
    return;
  }

  await addPatient({ name, age, disease });

  alert("Patient Added ✅");

  // Clear inputs after adding
  document.getElementById("pname").value = "";
  document.getElementById("page").value = "";
  document.getElementById("pdisease").value = "";
}

// ================= LOAD PATIENTS =================

async function loadPatients() {
  const patients = await getPatients();

  const container = document.getElementById("patients-list");

  if (!container) return;

  container.innerHTML = "";

  patients.forEach(p => {
    container.innerHTML += `
      <div style="background: rgba(255,255,255,0.05); padding:10px; border-radius:10px; margin-bottom:8px;">
        <strong>${p.name}</strong><br/>
        Age: ${p.age} <br/>
        Disease: ${p.disease}
        <br/>
        <button onclick="handleDelete('${p.id}')" style="margin-top:5px; color:red;">Delete</button>
      </div>
    `;
  });
}

async function handleDelete(id) {
  await deletePatient(id);
  loadPatients();
}