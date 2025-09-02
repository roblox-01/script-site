// Background particle effect
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < 10000; i++) {
    vertices.push((Math.random() - 0.5) * 2000);
    vertices.push((Math.random() - 0.5) * 2000);
    vertices.push((Math.random() - 0.5) * 2000);
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const material = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.5, transparent: true, opacity: 0.5 });
const points = new THREE.Points(geometry, material);
scene.add(points);

camera.position.z = 1000;

function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.0005;
    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Fallback scripts (6 scripts)
const fallbackScripts = [
    {
        _id: "68b60913c5aae50f0bce4671",
        title: "Grow A Garden - 100+ Features",
        description: "Works On Grow A Garden. Probably the best script in 2025!",
        views: 3,
        keySystem: true,
        image: "https://tr.rbxcdn.com/180DAY-828d42adf3e2a9aa2e0bf1369c6477b2/480/270/Image/Jpeg/noFilter",
        rawScript: "https://rscripts.net/raw/grow-a-garden-100-features_1756760339494_AZ96QPhrwo.txt"
    },
    {
        _id: "68b5e39ac5aae50f0b8b785c",
        title: "Insta Kill OP Script",
        description: "Instant kill script with showcase: https://streamable.com/baa9ra",
        views: 133,
        keySystem: false,
        image: "https://rscripts.net/assets/scripts/68b5e39ac5aae50f0b8b785c_1756750746418_mwpCbNLxI8.webp",
        rawScript: "https://rscripts.net/raw/insta-kill-op-script_1756750746337_qEIbUuV0tK.txt"
    },
    {
        _id: "mock1",
        title: "Auto Farm Script",
        description: "Automates resource farming in multiple Roblox games.",
        views: 50,
        keySystem: false,
        image: "https://via.placeholder.com/480x270?text=Auto+Farm",
        rawScript: "https://rscripts.net/raw/mock-script1.txt"
    },
    {
        _id: "mock2",
        title: "Speed Hack",
        description: "Boost your character's speed in Roblox games!",
        views: 75,
        keySystem: true,
        image: "https://via.placeholder.com/480x270?text=Speed+Hack",
        rawScript: "https://rscripts.net/raw/mock-script2.txt"
    },
    {
        _id: "mock3",
        title: "ESP Script",
        description: "See players and items through walls with this ESP script.",
        views: 90,
        keySystem: false,
        image: "https://via.placeholder.com/480x270?text=ESP+Script",
        rawScript: "https://rscripts.net/raw/mock-script3.txt"
    },
    {
        _id: "mock4",
        title: "Teleport GUI",
        description: "Teleport to any location with an easy-to-use GUI.",
        views: 120,
        keySystem: true,
        image: "https://via.placeholder.com/480x270?text=Teleport+GUI",
        rawScript: "https://rscripts.net/raw/mock-script4.txt"
    }
];

let editor;
let currentPage = 1;
let maxPages = 1;
const pageSize = 6;

// Initialize Ace Editor with retry and fallback
function initializeEditor(attempts = 5, delay = 500) {
    function tryInit(triesLeft) {
        try {
            // Check if Ace is loaded
            if (typeof window.ace !== 'object' || !window.ace.edit) {
                throw new Error('Ace Editor not loaded');
            }
            const aceEditor = document.getElementById('ace-editor');
            if (!aceEditor) throw new Error('Ace editor container not found');
            // Initialize Ace Editor
            editor = window.ace.edit(aceEditor);
            editor.setOptions({
                mode: 'ace/mode/lua',
                theme: 'ace/theme/monokai',
                tabSize: 4,
                useSoftTabs: true,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                readOnly: false,
                fontSize: 14,
                wrap: true
            });
            // Load saved script
            const savedScript = localStorage.getItem('customScript');
            if (savedScript) editor.setValue(savedScript, -1);
            // Ensure editor is editable and visible
            aceEditor.style.pointerEvents = 'auto';
            aceEditor.style.zIndex = '10';
            aceEditor.style.position = 'relative';
            aceEditor.style.minHeight = '400px';
            aceEditor.style.background = '#1a1a1a';
            aceEditor.style.border = '2px solid #00d7ff';
            aceEditor.style.borderRadius = '0.5rem';
            editor.renderer.updateFull();
            editor.focus();
            console.log('Ace Editor initialized successfully');
            return true;
        } catch (error) {
            if (triesLeft <= 1) {
                console.error('Ace Editor init failed after retries:', error);
                // Fallback: Show a plain textarea
                const codeEditor = document.getElementById('code-editor');
                if (codeEditor) {
                    codeEditor.classList.remove('hidden');
                    codeEditor.style.display = 'block';
                    codeEditor.style.width = '100%';
                    codeEditor.style.minHeight = '400px';
                    codeEditor.style.background = '#1a1a1a';
                    codeEditor.style.color = '#fff';
                    codeEditor.style.border = '2px solid #00d7ff';
                    codeEditor.style.borderRadius = '0.5rem';
                    codeEditor.style.padding = '10px';
                    codeEditor.style.pointerEvents = 'auto';
                    codeEditor.style.zIndex = '10';
                    codeEditor.readOnly = false;
                    codeEditor.setAttribute('placeholder', 'Type your Lua script here...');
                    const savedScript = localStorage.getItem('customScript');
                    if (savedScript) codeEditor.value = savedScript;
                    codeEditor.focus();
                    console.log('Fallback textarea displayed');
                    // Hide Ace container
                    const aceEditor = document.getElementById('ace-editor');
                    if (aceEditor) aceEditor.style.display = 'none';
                } else {
                    console.error('Textarea element not found');
                }
                document.getElementById('error-message').textContent = 'Editor failed to load. Using basic textarea.';
                document.getElementById('error-message').style.display = 'block';
                return false;
            }
            console.log(`Retrying Ace Editor init (${triesLeft - 1} attempts left)...`);
            setTimeout(() => tryInit(triesLeft - 1), delay);
            return false;
        }
    }
    return tryInit(attempts);
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if JavaScript is enabled
    if (typeof window === 'undefined' || !document) {
        console.error('JavaScript appears to be disabled or restricted');
        document.getElementById('error-message').textContent = 'Please enable JavaScript to use this site.';
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
        return;
    }

    // Load scripts first to ensure page renders
    try {
        loadScripts(currentPage);
    } catch (error) {
        console.error('Initial script load error:', error);
        document.getElementById('error-message').textContent = 'Error loading scripts. Showing fallback scripts.';
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
        renderScripts(fallbackScripts, currentPage);
    }

    // Initialize Ace Editor and buttons
    try {
        const editorInitialized = initializeEditor();
        // Bind buttons
        const saveButton = document.getElementById('save-script-btn');
        const downloadButton = document.getElementById('download-script-btn');
        if (editorInitialized) {
            if (saveButton) {
                saveButton.addEventListener('click', saveScript);
                console.log('Save button bound (Ace Editor)');
            } else {
                console.error('Save button not found');
            }
            if (downloadButton) {
                downloadButton.addEventListener('click', downloadCustomScript);
                console.log('Download button bound (Ace Editor)');
            } else {
                console.error('Download button not found');
            }
        } else {
            // Bind buttons to work with fallback textarea
            if (saveButton) {
                saveButton.addEventListener('click', saveScriptFallback);
                console.log('Save button bound (fallback)');
            } else {
                console.error('Save button not found');
            }
            if (downloadButton) {
                downloadButton.addEventListener('click', downloadCustomScriptFallback);
                console.log('Download button bound (fallback)');
            } else {
                console.error('Download button not found');
            }
        }

        // Bind watermark
        const watermark = document.querySelector('.watermark');
        if (watermark) {
            watermark.addEventListener('click', () => console.log('Watermark clicked:', watermark.href));
        } else {
            console.error('Watermark not found');
        }
    } catch (error) {
        console.error('DOMContentLoaded error:', error);
        document.getElementById('error-message').textContent = 'Initialization error: ' + error.message;
        document.getElementById('error-message').style.display = 'block';
    }
});

// Save script (Ace Editor)
function saveScript() {
    try {
        if (!editor) throw new Error('Editor not initialized');
        const script = editor.getValue();
        localStorage.setItem('customScript', script);
        alert('Script saved to local storage!');
        console.log('Script saved:', script.substring(0, 50) + '...');
    } catch (error) {
        console.error('Save script error:', error);
        alert('Error saving script: Editor may not have loaded.');
    }
}

// Save script (Fallback textarea)
function saveScriptFallback() {
    try {
        const codeEditor = document.getElementById('code-editor');
        if (!codeEditor) throw new Error('Textarea not found');
        const script = codeEditor.value;
        localStorage.setItem('customScript', script);
        alert('Script saved to local storage!');
        console.log('Script saved (fallback):', script.substring(0, 50) + '...');
    } catch (error) {
        console.error('Save script fallback error:', error);
        alert('Error saving script: Textarea not found.');
    }
}

// Download script (Ace Editor)
function downloadCustomScript() {
    try {
        if (!editor) throw new Error('Editor not initialized');
        const code = editor.getValue();
        if (!code) {
            alert('No script to download!');
            return;
        }
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom_script.lua';
        a.click();
        URL.revokeObjectURL(url);
        console.log('Script downloaded');
    } catch (error) {
        console.error('Download script error:', error);
        alert('Error downloading script: Editor may not have loaded.');
    }
}

// Download script (Fallback textarea)
function downloadCustomScriptFallback() {
    try {
        const codeEditor = document.getElementById('code-editor');
        if (!codeEditor) throw new Error('Textarea not found');
        const code = codeEditor.value;
        if (!code) {
            alert('No script to download!');
            return;
        }
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom_script.lua';
        a.click();
        URL.revokeObjectURL(url);
        console.log('Script downloaded (fallback)');
    } catch (error) {
        console.error('Download script fallback error:', error);
        alert('Error downloading script: Textarea not found.');
    }
}

// Load scripts
async function loadScripts(page) {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    try {
        console.log('Fetching scripts for page:', page);
        const response = await fetch(`https://rscripts.net/api/v2/scripts?page=${page}&orderBy=date&sort=desc`, {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        const data = await response.json();
        maxPages = data.info.maxPages || 1;
        const scripts = data.scripts || [];
        if (scripts.length === 0 && page === 1) {
            throw new Error('No scripts returned from API');
        }
        renderScripts(scripts, page);
        console.log('Scripts loaded:', scripts.length, 'Max pages:', maxPages);
    } catch (error) {
        console.error('Load scripts error:', error);
        errorMessage.textContent = 'Failed to load scripts. Showing fallback scripts.';
        errorMessage.style.display = 'block';
        renderScripts(fallbackScripts, page);
    } finally {
        loading.style.display = 'none';
    }
}

// Render scripts
function renderScripts(scripts, page) {
    try {
        const start = 0;
        const end = pageSize;
        const pageScripts = scripts.slice(start, end);
        const grid = document.getElementById('script-grid');
        grid.innerHTML = '';
        if (pageScripts.length === 0) {
            grid.innerHTML = '<p class="text-center text-gray-400">No scripts available for this page.</p>';
        } else {
            pageScripts.forEach(s => {
                const card = document.createElement('div');
                card.className = 'bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition script-card shadow-neon';
                card.innerHTML = `
                    <img src="${s.image || 'https://via.placeholder.com/480x270'}" alt="${s.title}" class="w-full h-32 object-cover mb-4 rounded">
                    <h3 class="text-2xl font-bold mb-2 glitch-hover">${s.title}</h3>
                    <p class="text-gray-300 mb-4">${s.description ? s.description.substring(0, 100) + '...' : 'No description'}</p>
                    <div class="mt-4">
                        <span class="text-gray-400"><i class="fas fa-eye mr-1"></i>${s.views}</span>
                        ${s.keySystem ? '' : '<span class="ml-4 text-green-400"><i class="fas fa-key mr-1"></i>Keyless</span>'}
                    </div>
                    <button class="mt-4 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-500 transition copy-script-btn" data-url="${s.rawScript}">Copy Script</button>
                `;
                grid.appendChild(card);
            });

            document.querySelectorAll('.copy-script-btn').forEach(btn => {
                btn.addEventListener('click', () => copyScript(btn.getAttribute('data-url')));
            });
        }

        document.getElementById('page-info').textContent = `Page ${page} of ${maxPages}`;
        document.getElementById('prev-page').disabled = page === 1;
        document.getElementById('next-page').disabled = page >= maxPages;
        console.log('Rendered page:', page, 'Scripts:', pageScripts.length);
    } catch (error) {
        console.error('Render scripts error:', error);
        document.getElementById('error-message').textContent = 'Error rendering scripts.';
        document.getElementById('error-message').style.display = 'block';
    }
}

// Pagination
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadScripts(currentPage);
        console.log('Previous page:', currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < maxPages) {
        currentPage++;
        loadScripts(currentPage);
        console.log('Next page:', currentPage);
    }
});

// Copy script
async function copyScript(rawUrl) {
    try {
        console.log('Copying script from:', rawUrl);
        const response = await fetch(rawUrl);
        if (!response.ok) throw new Error(`Failed to fetch script: ${response.status}`);
        const text = await response.text();
        try {
            if (!navigator.clipboard) throw new Error('Clipboard API not supported');
            await navigator.clipboard.writeText(text);
            alert('Script copied to clipboard!');
            console.log('Script copied, length:', text.length);
        } catch (clipError) {
            console.error('Clipboard error:', clipError);
            // Fallback: Show prompt for manual copy
            prompt('Clipboard access failed. Copy the script below or visit the URL:', text);
            alert('If copying failed, visit: ' + rawUrl);
            console.log('Displayed prompt for manual copy');
        }
    } catch (error) {
        console.error('Copy script error:', error);
        alert('Error fetching script. Visit: ' + rawUrl);
    }
}
