// Expanded fallback dataset for scripts
const fallbackScripts = [
    { _id: '1', title: 'Auto Farm Script', description: 'Automate farming in Roblox games.', script: `-- Auto Farm Script\nlocal player = game.Players.LocalPlayer\nwhile true do\n    wait(1)\n    player.Character.Humanoid.WalkSpeed = 100\n    print("Farming...")\nend` },
    { _id: '2', title: 'ESP Script', description: 'See players through walls.', script: `-- ESP Script\nlocal esp = loadstring(game:HttpGet("https://example.com/esp.lua"))()\nesp:Toggle(true)` },
    { _id: '3', title: 'Teleport Hack', description: 'Teleport across the map.', script: `-- Teleport Script\nlocal player = game.Players.LocalPlayer\nplayer.Character.HumanoidRootPart.CFrame = CFrame.new(0, 100, 0)` },
    { _id: '4', title: 'Speed Boost', description: 'Increase your movement speed.', script: `-- Speed Boost\nlocal player = game.Players.LocalPlayer\nplayer.Character.Humanoid.WalkSpeed = 50` },
    { _id: '5', title: 'Infinite Jump', description: 'Jump endlessly in any game.', script: `-- Infinite Jump\nlocal player = game.Players.LocalPlayer\nUserInputService.JumpRequest:Connect(function()\n    player.Character.Humanoid:ChangeState(Enum.HumanoidStateType.Jumping)\nend)` },
    { _id: '6', title: 'Fly Hack', description: 'Fly around the map.', script: `-- Fly Hack\nlocal player = game.Players.LocalPlayer\nplayer.Character.HumanoidRootPart.Anchored = false\nplayer.Character.Humanoid:ChangeState(Enum.HumanoidStateType.Flying)` }
];

let currentPage = 1;
const maxPerPage = 6;

// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: 'lua',
    theme: 'monokai',
    lineNumbers: true,
    autoCloseBrackets: true,
    viewportMargin: Infinity
});

// Three.js particle background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 30;

const particles = new THREE.BufferGeometry();
const particleCount = 1000;
const posArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}
particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const material = new THREE.PointsMaterial({ color: 0x00f6ff, size: 0.2 });
const particleSystem = new THREE.Points(particles, material);
scene.add(particleSystem);

function animateParticles() {
    particleSystem.rotation.y += 0.002;
    renderer.render(scene, camera);
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Fetch scripts
async function fetchScripts(page = 1) {
    const loading = document.getElementById('loading');
    const scriptGrid = document.getElementById('script-grid');
    const errorMessage = document.getElementById('error-message');
    loading.style.display = 'block';
    scriptGrid.innerHTML = '';
    errorMessage.classList.add('hidden');

    try {
        console.log(`Fetching scripts for page ${page}...`);
        const apiUrl = `https://scriptblox.com/api/script/fetch?page=${page}&max=${maxPerPage}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxyUrl, { mode: 'cors' });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        const scripts = data.result?.scripts || [];
        if (scripts.length === 0) {
            throw new Error('No scripts returned from API');
        }
        renderScripts(scripts, page);
    } catch (error) {
        console.error('Error fetching scripts:', error);
        errorMessage.textContent = 'Failed to load scripts from ScriptBlox. Showing fallback scripts.';
        errorMessage.classList.remove('hidden');
        const start = (page - 1) * maxPerPage;
        const paginatedScripts = fallbackScripts.slice(start, start + maxPerPage);
        console.log('Using fallback scripts:', paginatedScripts);
        renderScripts(paginatedScripts, page);
    } finally {
        loading.style.display = 'none';
    }
}

// Render scripts with GSAP animations
function renderScripts(scripts, page) {
    const scriptGrid = document.getElementById('script-grid');
    console.log('Rendering scripts:', scripts);
    if (!scripts || scripts.length === 0) {
        scriptGrid.innerHTML = '<p class="text-center text-red-400">No scripts available for this page.</p>';
        document.getElementById('next-page').disabled = true;
        return;
    }

    scripts.forEach((script, index) => {
        const card = document.createElement('div');
        card.className = 'script-card p-8';
        card.innerHTML = `
            <h3 class="text-2xl font-bold mb-3 glitch">${script.title || 'Untitled Script'}</h3>
            <p class="text-gray-400 mb-4">${script.description || 'No description available.'}</p>
            <button class="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 rounded-lg mr-2 hover:scale-105 transition" onclick="viewScript('${script._id}')">View</button>
            <button class="bg-gradient-to-r from-green-600 to-teal-500 text-white py-2 px-6 rounded-lg hover:scale-105 transition" onclick="downloadScript('${script._id}')">Download</button>
        `;
        scriptGrid.appendChild(card);

        // GSAP hover animation
        gsap.from(card, { opacity: 0, y: 50, duration: 0.5, delay: index * 0.1 });
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.05, rotateX: 10, duration: 0.3, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { scale: 1, rotateX: 0, duration: 0.3 });
        });
    });

    document.getElementById('page-info').textContent = `Page ${page}`;
    document.getElementById('prev-page').disabled = page === 1;
    document.getElementById('next-page').disabled = scripts.length < maxPerPage;
}

// View script
async function viewScript(scriptId) {
    console.log(`Viewing script ID: ${scriptId}`);
    const script = fallbackScripts.find(s => s._id === scriptId) || { script: '' };
    editor.setValue(script.script || '-- Script not found');
    gsap.from('.CodeMirror', { opacity: 0, scale: 0.95, duration: 0.5 });
}

// Download script
function downloadScript(scriptId) {
    console.log(`Downloading script ID: ${scriptId}`);
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
    console.log('Downloading custom script');
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
    console.log(`Navigating to page ${currentPage}`);
    fetchScripts(currentPage);
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        console.log(`Navigating to page ${currentPage}`);
        fetchScripts(currentPage);
    }
});

// Load scripts on page load
window.onload = () => {
    console.log('Page loaded, fetching scripts...');
    fetchScripts(1);
};
