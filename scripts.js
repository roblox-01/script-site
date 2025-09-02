// Background particle effect (sick starfield)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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

// Code editor (professional Lua editor)
let editor;
document.addEventListener('DOMContentLoaded', () => {
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'lua',
        lineNumbers: true,
        theme: 'default', // Change to 'monokai' if you added the theme CSS
        indentUnit: 4,
        indentWithTabs: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' }
    });

    // Load saved script if exists
    const savedScript = localStorage.getItem('customScript');
    if (savedScript) editor.setValue(savedScript);

    // Scripts section
    loadScripts();
});

// Save script function
function saveScript() {
    localStorage.setItem('customScript', editor.getValue());
    alert('Script saved to local storage!');
}

// Download script function
function downloadCustomScript() {
    const code = editor.getValue();
    if (!code) return alert('No script to download!');
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom_script.lua';
    a.click();
    URL.revokeObjectURL(url);
}

// Dummy scripts data (fallback, inspired by provided docs)
const fallbackScripts = [
    {
        title: 'Delta Executor Mobile Script',
        description: 'Keyless script for Roblox on mobile. Supports Android/iOS, anti-ban features.',
        views: 4503,
        verified: true,
        script: '-- Delta Executor Mobile Example\nprint("Delta Executor Loaded!")\n-- Add your Roblox hacks here'
    },
    {
        title: 'Xeno Fisch Script',
        description: 'Obfuscated fishing simulator script for Xeno Executor. Works in all modes.',
        views: 1582,
        verified: true,
        script: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/cayden305/Scripts/refs/heads/main/FischObfuscated.lua"))()'
    },
    {
        title: 'Basic Roblox Hack',
        description: 'Simple loadstring for general Roblox exploits.',
        views: 10000,
        verified: false,
        script: 'loadstring(game:HttpGet("https://example.com/script.lua"))()'
    },
    {
        title: 'Anti-Detection Script',
        description: 'Bypass key systems and anti-ban for executors.',
        views: 5000,
        verified: true,
        script: '-- Anti-Ban Example\nprint("Bypassing detection...")'
    },
    // Add more as needed for pagination demo
    { title: 'Script 5', description: 'Another cool script', views: 2000, verified: false, script: 'print("Hello World")' },
    { title: 'Script 6', description: 'Pro exploit', views: 3000, verified: true, script: 'print("Pro Mode")' },
    { title: 'Script 7', description: 'Mobile optimized', views: 4000, verified: true, script: 'print("Mobile")' },
    { title: 'Script 8', description: 'PC version', views: 2500, verified: false, script: 'print("PC")' }
];

let scripts = [];
const pageSize = 3; // 3 per page for demo (adjust as needed)
let currentPage = 1;

// Load scripts (try API, fallback to dummy)
async function loadScripts() {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    try {
        // Placeholder API fetch (replace with real if you find one, e.g., 'https://scriptblox.com/api/scripts?page=' + currentPage)
        // const response = await fetch('https://scriptblox.com/api/scripts?page=' + currentPage);
        // scripts = await response.json();
        // For now, use fallback
        throw new Error('API not available'); // Simulate failure for demo
    } catch (error) {
        errorMessage.style.display = 'block';
        scripts = fallbackScripts;
    } finally {
        loading.style.display = 'none';
        renderScripts(currentPage);
    }
}

// Render scripts for current page
function renderScripts(page) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageScripts = scripts.slice(start, end);
    const grid = document.getElementById('script-grid');
    grid.innerHTML = '';
    pageScripts.forEach(s => {
        const card = document.createElement('div');
        card.className = 'bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition script-card';
        card.innerHTML = `
            <h3 class="text-2xl font-bold mb-2 glitch-hover">${s.title}</h3>
            <p>${s.description}</p>
            <div class="mt-4">
                <span class="text-gray-400"><i class="fas fa-eye mr-1"></i>${s.views}</span>
                ${s.verified ? '<span class="ml-4 text-green-400"><i class="fas fa-check-circle mr-1"></i>Verified</span>' : ''}
            </div>
            <button class="mt-4 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-500 transition" onclick="copyScript('${encodeURIComponent(s.script)}')">Copy Script</button>
        `;
        grid.appendChild(card);
    });
    document.getElementById('page-info').textContent = `Page ${page}`;
    document.getElementById('prev-page').disabled = page === 1;
    document.getElementById('next-page').disabled = end >= scripts.length;
}

// Pagination events
document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage * pageSize < scripts.length) {
        currentPage++;
        renderScripts(currentPage);
    }
});
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderScripts(currentPage);
    }
});

// Copy script to clipboard
function copyScript(encodedScript) {
    const script = decodeURIComponent(encodedScript);
    navigator.clipboard.writeText(script).then(() => alert('Script copied to clipboard!'));
}
