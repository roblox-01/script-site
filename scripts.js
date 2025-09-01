// Initialize CodeMirror editor with dark theme
const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: 'lua',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseBrackets: true,
    viewportMargin: Infinity
});

let currentPage = 1;
const maxPerPage = 20;

// Fetch scripts from ScriptBlox API using a CORS proxy
async function fetchScripts(page = 1) {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('script-grid').innerHTML = '';
    try {
        const apiUrl = `https://scriptblox.com/api/script/fetch?page=${page}&max=${maxPerPage}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('API response not OK');
        const data = await response.json();
        const scripts = data.result.scripts || [];
        const scriptGrid = document.getElementById('script-grid');

        scripts.forEach(script => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card script-card">
                    <div class="card-body">
                        <h5 class="card-title">${script.title || 'Untitled Script'}</h5>
                        <p class="card-text">${script.description || 'No description available.'}</p>
                        <button class="btn btn-primary me-2" onclick="viewScript('${script._id}')">View</button>
                        <button class="btn btn-success" onclick="downloadScript('${script._id}')">Download</button>
                    </div>
                </div>
            `;
            scriptGrid.appendChild(col);
        });

        document.getElementById('page-info').textContent = `Page ${page}`;
        document.getElementById('prev-page').disabled = page === 1;
        document.getElementById('next-page').disabled = scripts.length < maxPerPage;
    } catch (error) {
        console.error('Error fetching scripts:', error);
        alert('Failed to load scripts. The API might be temporarily unavailable or check your connection.');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

// View script in editor
async function viewScript(scriptId) {
    try {
        const apiUrl = `https://scriptblox.com/api/script/fetch/${scriptId}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('API response not OK');
        const data = await response.json();
        if (data.script && data.script.script) {
            editor.setValue(data.script.script);
        } else {
            alert('Script content not found!');
        }
    } catch (error) {
        console.error('Error fetching script:', error);
        alert('Failed to load script content.');
    }
}

// Download script
async function downloadScript(scriptId) {
    try {
        const apiUrl = `https://scriptblox.com/api/script/fetch/${scriptId}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('API response not OK');
        const data = await response.json();
        if (data.script && data.script.script) {
            const blob = new Blob([data.script.script], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data.script.title || 'script'}.lua`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert('Script content not found!');
        }
    } catch (error) {
        console.error('Error downloading script:', error);
        alert('Failed to download script.');
    }
}

// Save custom script (placeholder)
function saveScript() {
    const scriptContent = editor.getValue();
    console.log('Saving script:', scriptContent);
    alert('Script saved! (Placeholder - requires backend storage)');
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
