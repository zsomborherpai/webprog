let token = localStorage.getItem('token') || null;
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
let allChampions = [];
let isRegisterMode = false;

const authControls = document.getElementById('auth-controls');
const guestBanner = document.getElementById('guest-banner');
const editorSection = document.getElementById('editor-section');
const mineOnlyWrapper = document.getElementById('mine-only-wrapper');
const mineOnlyCheckbox = document.getElementById('mine-only-checkbox');
const championsGrid = document.getElementById('champions-grid');

const championForm = document.getElementById('champion-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const modalTitle = document.getElementById('modal-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const switchAuthMode = document.getElementById('switch-auth-mode');
const switchText = document.getElementById('switch-text');
const authError = document.getElementById('auth-error');

updateAuthUI();
fetchChampions();

function updateAuthUI() {
  if (currentUser && token) {
    authControls.innerHTML = `
      <span>Summoner: <strong>${escapeHTML(currentUser.username)}</strong></span>
      <button class="btn btn-secondary" onclick="logout()">Logout</button>
    `;
    guestBanner.classList.add('hidden');
    editorSection.classList.remove('hidden');
    mineOnlyWrapper.classList.remove('hidden');
  } else {
    authControls.innerHTML = `
      <button class="btn btn-secondary" onclick="openAuthModal(false)">Login</button>
      <button class="btn btn-gold" onclick="openAuthModal(true)">Register</button>
    `;
    guestBanner.classList.remove('hidden');
    editorSection.classList.add('hidden');
    mineOnlyWrapper.classList.add('hidden');
    mineOnlyCheckbox.checked = false;
  }
}

async function fetchChampions() {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch('/api/champions', { headers });
  allChampions = await res.json();
  renderChampions();
}

function renderChampions() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const roleFilter = document.getElementById('role-filter').value;
  const mineOnly = mineOnlyCheckbox.checked;

  const filtered = allChampions.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm) ||
      c.title.toLowerCase().includes(searchTerm);
    const matchesRole = roleFilter === 'ALL' || c.role === roleFilter;
    const matchesOwner = !mineOnly || (currentUser && c.user_id === currentUser.id);
    return matchesSearch && matchesRole && matchesOwner;
  });

  if (filtered.length === 0) {
    championsGrid.innerHTML = `<p style="color: var(--text-muted);">No champions match your current filters.</p>`;
    return;
  }

  championsGrid.innerHTML = filtered
    .map((champ) => {
      const isOwner = currentUser && champ.user_id === currentUser.id;
      const hasImage = champ.image_url && champ.image_url.trim().length > 0;
      const mediaHTML = hasImage
        ? `<img
            src="${escapeHTML(champ.image_url)}"
            alt="${escapeHTML(champ.name)}"
            onerror="this.outerHTML='<div class=\'no-img-placeholder\'><span>❖</span>No Image</div>';"
          />`
        : `<div class="no-img-placeholder"><span>❖</span>No Image</div>`;

      return `
        <article class="champ-card">
          <div class="champ-img-wrap">
            ${mediaHTML}
            <div class="badges">
              <span class="badge">${escapeHTML(champ.role)}</span>
              <span class="badge ${champ.is_public ? 'badge-public' : 'badge-private'}">
                ${champ.is_public ? 'Public' : 'Private'}
              </span>
            </div>
          </div>
          <div class="champ-body">
            <h3 class="champ-name">${escapeHTML(champ.name)}</h3>
            <div class="champ-title">${escapeHTML(champ.title)}</div>
            <p class="champ-desc">${escapeHTML(champ.description || 'No lore recorded.')}</p>
            <div class="champ-meta">
              <span>Difficulty: <strong>${escapeHTML(champ.difficulty)}</strong></span>
              <span>By: <strong>${escapeHTML(champ.owner_name)}</strong></span>
            </div>
            ${
              isOwner
                ? `<div class="card-actions">
                    <button class="btn btn-secondary" onclick="startEdit(${champ.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteChampion(${champ.id})">Delete</button>
                  </div>`
                : ''
            }
          </div>
        </article>
      `;
    })
    .join('');
}

championForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('champ-id').value;

  const payload = {
    name: document.getElementById('name').value,
    title: document.getElementById('title').value,
    role: document.getElementById('role').value,
    difficulty: document.getElementById('difficulty').value,
    image_url: document.getElementById('image_url').value.trim(),
    description: document.getElementById('description').value,
    is_public: document.getElementById('is_public').checked
  };

  const url = id ? `/api/champions/${id}` : '/api/champions';
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    resetChampionForm();
    fetchChampions();
  } else {
    const data = await res.json();
    alert(data.error || 'Action failed.');
  }
});

function startEdit(id) {
  const champ = allChampions.find((c) => c.id === id);
  if (!champ) return;

  document.getElementById('champ-id').value = champ.id;
  document.getElementById('name').value = champ.name;
  document.getElementById('title').value = champ.title;
  document.getElementById('role').value = champ.role;
  document.getElementById('difficulty').value = champ.difficulty;
  document.getElementById('image_url').value = champ.image_url || '';
  document.getElementById('description').value = champ.description || '';
  document.getElementById('is_public').checked = Boolean(champ.is_public);

  formTitle.textContent = `Editing ${champ.name}`;
  submitBtn.textContent = 'Save Changes';
  cancelEditBtn.classList.remove('hidden');
  editorSection.scrollIntoView({ behavior: 'smooth' });
}

cancelEditBtn.addEventListener('click', resetChampionForm);

function resetChampionForm() {
  championForm.reset();
  document.getElementById('champ-id').value = '';
  document.getElementById('is_public').checked = true;
  formTitle.textContent = 'Forge New Champion';
  submitBtn.textContent = 'Add Champion';
  cancelEditBtn.classList.add('hidden');
}

async function deleteChampion(id) {
  if (!confirm('Are you sure you want to delete this champion?')) return;

  const res = await fetch(`/api/champions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.ok) {
    fetchChampions();
  } else {
    const data = await res.json();
    alert(data.error || 'Could not delete champion.');
  }
}

function openAuthModal(register = false) {
  isRegisterMode = register;
  authError.classList.add('hidden');
  authForm.reset();
  modalTitle.textContent = register ? 'Create Summoner Account' : 'Summoner Login';
  authSubmitBtn.textContent = register ? 'Register' : 'Login';
  switchText.textContent = register ? 'Already have an account?' : 'New summoner?';
  switchAuthMode.textContent = register ? 'Login here' : 'Create an account';
  authModal.classList.remove('hidden');
}

document.getElementById('close-modal').addEventListener('click', () => {
  authModal.classList.add('hidden');
});

switchAuthMode.addEventListener('click', (e) => {
  e.preventDefault();
  openAuthModal(!isRegisterMode);
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('auth-username').value;
  const password = document.getElementById('auth-password').value;
  const endpoint = isRegisterMode ? '/api/register' : '/api/login';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (!res.ok) {
    authError.textContent = data.error;
    authError.classList.remove('hidden');
    return;
  }

  token = data.token;
  currentUser = data.user;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(currentUser));

  authModal.classList.add('hidden');
  updateAuthUI();
  fetchChampions();
});

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  resetChampionForm();
  updateAuthUI();
  fetchChampions();
}

document.getElementById('search-input').addEventListener('input', renderChampions);
document.getElementById('role-filter').addEventListener('change', renderChampions);
mineOnlyCheckbox.addEventListener('change', renderChampions);

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
