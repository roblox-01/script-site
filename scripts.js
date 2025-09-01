// Initialize CodeMirror editor
const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: 'lua',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseBrackets: true
});

// Fetch scripts from ScriptBlox API
async function fetchScripts() {
    try {
        const response = await fetch('https://scriptblox.com/api/script/fetch?page=1');
        const data = await response.json();
        const scripts = data.scripts || [];
        const scriptGrid = document.getElementById('script-grid');

        // Clear existing content
        scriptGrid.innerHTML = '';

        // Create script cards
        scripts.forEach(script => {
            const card = document.createElement('div');
            card.className = 'script-card';
            card.innerHTML = `
                <h3>${script.title || 'Untitled Script'}</h3>
                <p>${script.description || 'No description available.'}</p>
                <button onclick="viewScript('${script._id}')">View</button>
                <button onclick="downloadScript('${script._id}')">Download</button>
            `;
            scriptGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching scripts:', error);
        alert('Failed to load scripts from ScriptBlox API.');
    }
}

// View script in editor
async function viewScript(scriptId) {
    try {
        const response = await fetch(`https://scriptblox.com/api/script/fetch/${scriptId}`);
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
        const response = await fetch(`https://scriptblox.com/api/script/fetch/${scriptId}`);
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

// Save custom script (placeholder for server-side storage)
function saveScript() {
    const scriptContent = editor.getValue();
    console.log('Saving script:', scriptContent);
    alert('Script saved! (Placeholder - requires backend storage)');
}

// Download custom script from editor
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

// Load scripts on page load
window.onload = fetchScripts;
