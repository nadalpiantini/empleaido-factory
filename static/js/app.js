// State
let empleaidos = [];
let authToken = null;

// Load empleaidos on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Get auth token from meta tag or create session
    const metaToken = document.querySelector('meta[name="auth-token"]');
    authToken = metaToken ? metaToken.content : null;

    if (!authToken) {
        await createSession();
    }

    await loadEmpleaidos();
    updateStats();
});

// Create session
async function createSession() {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
        }
    } catch (error) {
        console.error('Error creating session:', error);
    }
}

// Load empleaidos from API
async function loadEmpleaidos() {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) {
            headers['X-Auth-Token'] = authToken;
        }

        const response = await fetch('/api/empleaidos', { headers });
        empleaidos = await response.json();
        renderEmpleaidos();
    } catch (error) {
        console.error('Error loading empleaidos:', error);
        showError('Error loading empleaidos');
    }
}

// Render empleaidos
function renderEmpleaidos() {
    const grid = document.getElementById('empleaidos-grid');
    grid.innerHTML = empleaidos.map(empleaido => `
        <div class="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-purple-500/30 card-hover transition-all duration-300">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-2xl font-bold text-white">${escapeHtml(empleaido.name)}</h3>
                    <p class="text-purple-300">${escapeHtml(empleaido.role)}</p>
                </div>
                <div class="flex gap-2">
                    ${empleaido.deployed
                        ? '<span class="bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-xs border border-green-500/50"><i class="fas fa-check mr-1"></i>Deployed</span>'
                        : `<button onclick="deployEmpleaido('${escapeHtml(empleaido.id)}')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-xs transition-all"><i class="fas fa-rocket mr-1"></i>Deploy</button>`
                    }
                    <button onclick="deleteEmpleaido('${escapeHtml(empleaido.id)}')" class="text-red-400 hover:text-red-300 transition-colors">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <div class="space-y-3">
                <div>
                    <p class="text-gray-400 text-sm">Especialidad</p>
                    <p class="text-white">${escapeHtml(empleaido.specialty)}</p>
                </div>

                <div>
                    <p class="text-gray-400 text-sm">Activación Sefirotic</p>
                    <div class="flex flex-wrap gap-2 mt-1">
                        ${empleaido.sefirot_activation.map(sefira =>
                            `<span class="bg-purple-600/30 text-purple-200 px-2 py-1 rounded text-xs">${escapeHtml(sefira)}</span>`
                        ).join('')}
                    </div>
                </div>

                <div>
                    <p class="text-gray-400 text-sm">Skills</p>
                    <div class="flex flex-wrap gap-2 mt-1">
                        ${empleaido.skills.map(skill =>
                            `<span class="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs">${escapeHtml(skill)}</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="flex items-center gap-2 pt-2 border-t border-purple-500/20">
                    <span class="w-2 h-2 rounded-full ${empleaido.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}"></span>
                    <span class="text-sm text-gray-400">${escapeHtml(empleaido.status)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update stats
function updateStats() {
    document.getElementById('total-count').textContent = empleaidos.length;
    document.getElementById('active-count').textContent = empleaidos.filter(e => e.status === 'active').length;

    const totalSefirot = empleaidos.reduce((sum, e) => sum + e.sefirot_activation.length, 0);
    document.getElementById('sefirot-count').textContent = totalSefirot;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

// Modal functions
function openModal() {
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('flex');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('modal').classList.remove('flex');
    document.getElementById('empleaido-form').reset();
}

// Form submit
document.getElementById('empleaido-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const role = document.getElementById('role').value.trim();
    const specialty = document.getElementById('specialty').value.trim();
    const sefirot = document.getElementById('sefirot').value.split(',').map(s => s.trim()).filter(s => s);
    const skills = document.getElementById('skills').value.split(',').map(s => s.trim()).filter(s => s);

    // Client-side validation
    if (name.length < 2 || name.length > 50) {
        showError('Nombre debe tener entre 2 y 50 caracteres');
        return;
    }
    if (sefirot.length === 0) {
        showError('Al menos una Sefirot es requerida');
        return;
    }
    if (skills.length === 0) {
        showError('Al menos un skill es requerido');
        return;
    }

    const empleaido = {
        name,
        role,
        specialty,
        sefirot_activation: sefirot,
        skills
    };

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) {
            headers['X-Auth-Token'] = authToken;
        }

        const response = await fetch('/api/empleaidos', {
            method: 'POST',
            headers,
            body: JSON.stringify(empleaido)
        });

        const data = await response.json();

        if (response.ok) {
            closeModal();
            await loadEmpleaidos();
            updateStats();
            showSuccess(`${empleaido.name} creado exitosamente`);
        } else {
            showError(data.detail || 'Error creating empleaido');
        }
    } catch (error) {
        console.error('Error creating empleaido:', error);
        showError('Error de conexión');
    }
});

// Deploy empleaido
async function deployEmpleaido(id) {
    const empleaido = empleaidos.find(e => e.id === id);
    if (!empleaido) return;

    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Deploying...';
    btn.disabled = true;

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) {
            headers['X-Auth-Token'] = authToken;
        }

        const response = await fetch(`/api/empleaidos/${id}/deploy`, {
            method: 'POST',
            headers
        });

        if (response.ok) {
            const result = await response.json();
            showSuccess(`${empleaido.name} deployed successfully!`);
            await loadEmpleaidos();
        } else {
            const error = await response.json();
            showError(error.detail || 'Deployment failed');
        }
    } catch (error) {
        console.error('Error deploying empleaido:', error);
        showError('Error de conexión');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Delete empleaido
async function deleteEmpleaido(id) {
    if (!confirm('¿Estás seguro de eliminar este empleaido?')) return;

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) {
            headers['X-Auth-Token'] = authToken;
        }

        const response = await fetch(`/api/empleaidos/${id}`, {
            method: 'DELETE',
            headers
        });

        if (response.ok) {
            await loadEmpleaidos();
            updateStats();
            showSuccess('Empleaido eliminado');
        } else {
            showError('Error deleting empleaido');
        }
    } catch (error) {
        console.error('Error deleting empleaido:', error);
        showError('Error de conexión');
    }
}
