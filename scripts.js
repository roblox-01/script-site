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
    loadScripts(currentPage);
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

let currentPage = 1;
let maxPages = 1; // Will be updated from API
const pageSize = 3; // Display 3 per page (slice from API response; API may return more)

// Load scripts from API
async function loadScripts(page) {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    try {
        const response = await fetch(`https://rscripts.net/api/v2/scripts?page=${page}&orderBy=date&sort=desc`);
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        maxPages = data.info.maxPages;
        const scripts = data.scripts || [];
        renderScripts(scripts, page);
    } catch (error) {
        errorMessage.textContent = 'Failed to load scripts from API. ' + error.message;
        errorMessage.style.display = 'block';
        // Minimal fallback if needed
        renderScripts([], page);
    } finally {
        loading.style.display = 'none';
    }
}

// Render scripts for current page (slice to pageSize)
function renderScripts(scripts, page) {
    const start = 0; // Since API pages are handled, but slice if more than pageSize
    const end = pageSize;
    const pageScripts = scripts.slice(start, end);
    const grid = document.getElementById('script-grid');
    grid.innerHTML = '';
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
            <button class="mt-4 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-500 transition" onclick="copyScript('${s.rawScript}')">Copy Script</button>
        `;
        grid.appendChild(card);
    });
    document.getElementById('page-info').textContent = `Page ${page} of ${maxPages}`;
    document.getElementById('prev-page').disabled = page === 1;
    document.getElementById('next-page').disabled = page >= maxPages;
}

// Pagination events
document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < maxPages) {
        currentPage++;
        loadScripts(currentPage);
    }
});
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadScripts(currentPage);
    }
});

// Copy script from raw URL
async function copyScript(rawUrl) {
    try {
        const response = await fetch(rawUrl);
        if (!response.ok) throw new Error('Failed to fetch script');
        const text = await response.text();
        await navigator.clipboard.writeText(text);
        alert('Script copied to clipboard!');
    } catch (error) {
        alert('Error copying script: ' + error.message);
    }
}
