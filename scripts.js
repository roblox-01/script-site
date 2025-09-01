// Fallback dataset for scripts (since ScriptBlox API may not work client-side)
const fallbackScripts = [
    { _id: '1', title: 'Auto Farm Script', description: 'Automate farming in Roblox games.', script: `-- Auto Farm Script\nlocal player = game.Players.LocalPlayer\nwhile true do\n    wait(1)\n    player.Character.Humanoid.WalkSpeed = 100\n    print("Farming...")\nend` },
    { _id: '2', title: 'ESP Script', description: 'See players through walls.', script: `-- ESP Script\nlocal esp = loadstring(game:HttpGet("https://example.com/esp.lua"))()\nesp:Toggle(true)` },
    { _id: '3', title: 'Teleport Hack', description: 'Teleport across the map.', script: `-- Teleport Script\nlocal player = game.Players.LocalPlayer\nplayer.Character.HumanoidRootPart.CFrame = CFrame.new(0, 100, 0)` }
];

let currentPage = 1;
const maxPerPage = 6;

// Initialize CodeMirror editor
const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: 'lua',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseBrackets: true,
    viewportMargin: Infinity
});

// Fetch scripts (try API, fallback to local data)
async function fetchScripts(page = 1) {
    const loading = document.getElementById('loading');
    const scriptGrid = document.getElementById('script-grid');
    loading.style.display = 'block';
    scriptGrid.innerHTML = '';

    try {
        const apiUrl = `https://scriptblox.com/api/script/fetch?page=${page}&max=${maxPerPage}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('API response not OK');
        const data = await response.json();
        const scripts = data.result.scripts || [];
        
        renderScripts(scripts, page);
    } catch (error) {
        console.error('API Error, using fallback:', error);
        const start = (page - 1) * maxPerPage;
        const paginatedScripts = fallbackScripts.slice(start, start + maxPerPage);
        renderScripts(paginatedScripts, page);
    } finally {
        loading.style.display = 'none';
    }
}

// Render scripts to grid with animations
function renderScripts(scripts, page) {
    const scriptGrid = document.getElementById('script-grid');
    scripts.forEach((script, index) => {
        const card = document.createElement('div');
        card.className = 'script-card p-6 rounded-lg';
        card.innerHTML = `
            <h3 class="text-xl font-bold mb-2">${script.title || 'Untitled Script'}</h3>
            <p class="text-gray-400 mb-4">${script.description || 'No description available.'}</p>
            <button class="bg-cyan-500 text-gray-900 py-2 px-4 rounded-lg mr-2 hover:bg-cyan-400" onclick="viewScript('${script._id}')">View</button>
            <button class="bg-green-500 text-gray-900 py-2 px-4 rounded-lg hover:bg-green-400" onclick="downloadScript('${script._id}')">Download</button>
        `;
        scriptGrid.appendChild(card);

        // Anime.js hover animation
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                scale: 1.05,
                rotateX: 5,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                scale: 1,
                rotateX: 0,
            });
        });
    });

    document.getElementById('page-info').textContent = `Page ${page}`;
    document.getElementById('prev-page').disabled = page === 1;
    document.getElementById('next-page').disabled = scripts.length < maxPerPage;
}

// View script in editor
async function viewScript(scriptId) {
    const script = fallbackScripts.find(s => s._id === scriptId) || { script: '' };
    editor.setValue(script.script || '-- Script not found');
}

// Download script
function downloadScript(scriptId) {
    const script = fallbackScripts.find(s => s._id === scriptId) || { script: '', title: 'script' };
    const blob = new Blob([script.script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title || 'script'}.lua`;
    a.click();
    URL.revokeObjectURL(url);
}

// Save custom script (placeholder)
function saveScript() {
    const scriptContent = editor.getValue();
    console.log('Saving script:', scriptContent);
    alert('Script saved! (Requires backend for storage)');
}

// Download custom script
function downloadCustomScript() {
    const scriptContent = editor.getValue();
    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-script.lua';
    a.click();
    URL.revokeObjectURL(url);
}

// Pagination handlers
document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchScripts(currentPage);
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchScripts(currentPage);
    }
});

// Load scripts on page load
window.onload = () => fetchScripts(1);
