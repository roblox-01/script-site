// Background particle effect (sick starfield)
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

// Fallback scripts (minimal, based on provided API data)
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
    }
];

let editor;
let currentPage = 1;
let maxPages = 1;
const pageSize = 3;

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize CodeMirror
        editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
            mode: 'lua',
            lineNumbers: true,
            theme: 'default', // Change to 'monokai' if theme CSS is included
            indentUnit: 4,
            indentWithTabs: true,
            extraKeys: { 'Ctrl-Space': 'autocomplete' }
        });

        // Load saved script
        const savedScript = localStorage.getItem('customScript');
        if (savedScript) editor.setValue(savedScript);

        // Bind save and download buttons
        const saveButton = document.querySelector('button[onclick="saveScript()"]');
        const downloadButton = document.querySelector('button[onclick="downloadCustomScript()"]');
        if (saveButton) saveButton.addEventListener('click', saveScript);
        if (downloadButton) downloadButton.addEventListener('click', downloadCustomScript);
        console.log('Buttons bound:', { saveButton, downloadButton });

        // Load scripts
        loadScripts(currentPage);
    } catch (error) {
        console.error('DOMContentLoaded error:', error);
        document.getElementById('error-message').textContent = 'Initialization error: ' + error.message;
        document.getElementById('error-message').style.display = 'block';
    }
});

// Save script function
function saveScript() {
    try {
        const script = editor.getValue();
        localStorage.setItem('customScript', script);
        alert('Script saved to local storage!');
        console.log('Script saved:', script.substring(0, 50) + '...');
    } catch (error) {
        console.error('Save script error:', error);
        alert('Error saving script: ' + error.message);
    }
}

// Download script function
function downloadCustomScript() {
    try {
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
        alert('Error downloading script: ' + error.message);
    }
}

// Load scripts from API
async function loadScripts(page) {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    try {
        console.log('Fetching scripts for page:', page);
        const response = await fetch(`https://rscripts.net/api/v2/scripts?page=${page}&orderBy=date&sort=desc`);
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
        errorMessage.textContent = 'Failed to load scripts: ' + error.message + '. Showing fallback scripts.';
        errorMessage.style.display = 'block';
        renderScripts(fallbackScripts, page); // Use fallback
    } finally {
        loading.style.display = 'none';
    }
}

// Render scripts for current page
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

            // Bind copy buttons
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
        document.getElementById('error-message').textContent = 'Error rendering scripts: ' + error.message;
        document.getElementById('error-message').style.display = 'block';
    }
}

// Pagination events
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadScripts(currentPage);
        console.log('Previous page clicked:', currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < maxPages) {
        currentPage++;
        loadScripts(currentPage);
        console.log('Next page clicked:', currentPage);
    }
});

// Copy script from raw URL
async function copyScript(rawUrl) {
    try {
        console.log('Copying script from:', rawUrl);
        const response = await fetch(rawUrl);
        if (!response.ok) throw new Error(`Failed to fetch script: ${response.status}`);
        const text = await response.text();
        await navigator.clipboard.writeText(text);
        alert('Script copied to clipboard!');
        console.log('Script copied, length:', text.length);
    } catch (error) {
        console.error('Copy script error:', error);
        alert('Error copying script: ' + error.message);
    }
}

// Verify ShadowT3ch watermark
document.addEventListener('DOMContentLoaded', () => {
    const watermark = document.querySelector('.watermark');
    if (watermark) {
        watermark.addEventListener('click', (e) => {
            console.log('Watermark clicked, navigating to:', watermark.href);
        });
    } else {
        console.error('Watermark element not found');
    }
});