// script.js - Portfolio Interactive System (Full Creative Aurora Version)

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initPreloader();
    initThreeJS();
    initTerminal();
    initPingWidget();
    initActivityLog();
    initNobuMascot();
    initScrollAnimations();
    initClock();

    // Integrated React Bits Components (Vanilla JS Ports)
    initScrollReveal();
    initLogoLoop();
    initElectricBorders();
    initTextPressure();
});

// ---------------------------------------------------------
// 0. LIVE CLOCK CONTROLLER
// ---------------------------------------------------------
function initClock() {
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
        const updateTime = () => {
            const now = new Date();
            clockEl.innerText = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: false 
            });
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
}

// ---------------------------------------------------------
// 1. RETRO TERMINAL BOOT PRELOADER
// ---------------------------------------------------------
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const bootConsole = document.getElementById('boot-console');
    const progressText = document.querySelector('.loader-percentage');
    const progressBar = document.querySelector('.loader-progress');
    const mascotStatus = document.getElementById('mascot-status');
    
    if (!preloader || !bootConsole) return;

    const bootMessages = [
        "INITIALIZING HACKER_DOG CORE v4.0.0...",
        "SNIFFING DATABASE NETWORKS FOR BONES... [FOUND]",
        "CONNECTING TO THE CLOUD WAN (WOOF AREA NETWORK)... [OK]",
        "BARKING AT COMPILER WARNINGS... [SHUTTING THEM UP]",
        "COMPILING CHEW TOYS & SEGFAULT SCRAPERS... [OK]",
        "CONVERTING COFFEE INTO SQL INJECTION QUERIES... [OK]",
        "INDEXING NOBUS CAT DAEMON... [MONITORING CLAW ACTION]",
        "TREAT STATUS: SECURED. ACCESS GRANTED // DEV_ONLINE."
    ];

    let msgIndex = 0;
    let progress = 0;
    
    function printNextMessage() {
        if (msgIndex < bootMessages.length) {
            const line = document.createElement('div');
            line.className = 'boot-line';
            line.innerHTML = `<span class="boot-prompt">></span> ${bootMessages[msgIndex]}`;
            bootConsole.appendChild(line);
            bootConsole.scrollTop = bootConsole.scrollHeight;
            msgIndex++;
            
            setTimeout(printNextMessage, 80 + Math.random() * 80);
        }
    }

    const duration = 1200; // Fast and snappy
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    printNextMessage();

    const loadingInterval = setInterval(() => {
        progress += increment;
        
        // Dynamically change dog activity text based on loading progress percentage
        if (mascotStatus) {
            if (progress < 25) {
                mascotStatus.innerText = "SNIFFING FOR BUGS...";
            } else if (progress < 50) {
                mascotStatus.innerText = "BARKING AT WARN_LOGS...";
            } else if (progress < 75) {
                mascotStatus.innerText = "COMPILING CHEW TOYS...";
            } else if (progress < 95) {
                mascotStatus.innerText = "SECURING TREAT STATUS...";
            } else {
                mascotStatus.innerText = "ACCESS WOOFED!";
            }
        }

        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.transform = 'scale(1.03)';
                preloader.style.pointerEvents = 'none';
                document.body.classList.remove('loading');
                document.querySelector('.hero').classList.add('active');
                
                // Force scroll to top immediately on loader exit
                if (window.lenis) {
                    window.lenis.scrollTo(0, { immediate: true });
                } else {
                    window.scrollTo(0, 0);
                }

                // Recalculate GSAP trigger positions once page scroll is enabled
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }, 300);
        }
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.innerText = `${Math.floor(progress)}%`;
    }, intervalTime);
}

// ---------------------------------------------------------
// 2. THREE.JS 3D NEBULA PARTICLE CONSTELLATION
// ---------------------------------------------------------
let scene, camera, renderer, particleSystem, linesMesh;
const maxDistance = 0.95;
let mouse = { x: 0, y: 0 };
let particleCount = window.innerWidth < 768 ? 60 : 150;

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4.0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const colorEmerald = new THREE.Color('#00ff9d'); // Cyber Emerald
    const colorCyan = new THREE.Color('#0ea5e9'); // Cyan
    const colorPurple = new THREE.Color('#8b5cf6'); // Violet

    const particlesData = [];
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        // Spherical distribution
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 2.0;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        particlesData.push({
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005
            )
        });

        const normalizedRadius = r / 2.0;
        let mixedColor;
        if (normalizedRadius < 0.5) {
            mixedColor = colorEmerald.clone().lerp(colorPurple, normalizedRadius * 2);
        } else {
            mixedColor = colorPurple.clone().lerp(colorCyan, (normalizedRadius - 0.5) * 2);
        }
        
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.065,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
    });

    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Lines mesh connection
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    const lineColors = new Float32Array(particleCount * particleCount * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.18,
        linewidth: 1
    });

    linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', onWindowResize);

    animate(particlesData);
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate(particlesData) {
    requestAnimationFrame(() => animate(particlesData));

    const positions = particleSystem.geometry.attributes.position.array;
    const colors = particleSystem.geometry.attributes.color.array;
    const linePositions = linesMesh.geometry.attributes.position.array;
    const lineColors = linesMesh.geometry.attributes.color.array;

    let vertexIdx = 0;
    let colorIdx = 0;
    let numConnections = 0;

    const mousePos3D = new THREE.Vector3(mouse.x * 2.2, mouse.y * 1.5, 0);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += particlesData[i].velocity.x;
        positions[i * 3 + 1] += particlesData[i].velocity.y;
        positions[i * 3 + 2] += particlesData[i].velocity.z;

        const radius = Math.sqrt(positions[i * 3]**2 + positions[i * 3 + 1]**2 + positions[i * 3 + 2]**2);
        if (radius > 2.3) {
            particlesData[i].velocity.multiplyScalar(-1);
        }

        const currentPos = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        const distToMouse = currentPos.distanceTo(mousePos3D);
        if (distToMouse < 0.95) {
            const forceDir = currentPos.clone().sub(mousePos3D).normalize();
            const strength = (0.95 - distToMouse) * 0.006;
            positions[i * 3] += forceDir.x * strength;
            positions[i * 3 + 1] += forceDir.y * strength;
        }

        for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDistance) {
                linePositions[vertexIdx++] = positions[i * 3];
                linePositions[vertexIdx++] = positions[i * 3 + 1];
                linePositions[vertexIdx++] = positions[i * 3 + 2];

                linePositions[vertexIdx++] = positions[j * 3];
                linePositions[vertexIdx++] = positions[j * 3 + 1];
                linePositions[vertexIdx++] = positions[j * 3 + 2];

                const lineAlpha = (1.0 - dist / maxDistance) * 0.45;
                
                // Color first vertex using color of particle i (Emerald, Purple, or Cyan)
                lineColors[colorIdx++] = lineAlpha * colors[i * 3];
                lineColors[colorIdx++] = lineAlpha * colors[i * 3 + 1];
                lineColors[colorIdx++] = lineAlpha * colors[i * 3 + 2];

                // Color second vertex using color of particle j (Emerald, Purple, or Cyan)
                lineColors[colorIdx++] = lineAlpha * colors[j * 3];
                lineColors[colorIdx++] = lineAlpha * colors[j * 3 + 1];
                lineColors[colorIdx++] = lineAlpha * colors[j * 3 + 2];

                numConnections++;
            }
        }
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.setDrawRange(0, numConnections * 2);
    linesMesh.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.attributes.color.needsUpdate = true;

    particleSystem.rotation.y += 0.001;
    linesMesh.rotation.y += 0.001;

    renderer.render(scene, camera);
}

// ---------------------------------------------------------
// 3. RETRO-FUTURISTIC CLI TERMINAL (With RUN Commands!)
// ---------------------------------------------------------
const TERMINAL_DATA = {
    help: `Available commands:<br>
  - <span class="term-cmd">about</span>    : Learn who I am.<br>
  - <span class="term-cmd">projects</span> : View my core project directory.<br>
  - <span class="term-cmd">run [project]</span>: Launch a live deployment in a new tab.<br>
            e.g. <span class="term-cmd">run coldrts</span>, <span class="term-cmd">run tuduyu</span>, <span class="term-cmd">run scholar</span>, <span class="term-cmd">run health</span>, <span class="term-cmd">run judging</span><br>
  - <span class="term-cmd">skills</span>   : Output dynamic technical matrix.<br>
  - <span class="term-cmd">contact</span>  : Display secure connection endpoints.<br>
  - <span class="term-cmd">clear</span>    : Clear terminal screen buffers.<br>
  - <span class="term-cmd">secret</span>   : Execute easter egg sub-routine.`,
    
    about: `ANUJ ARKE // B.Sc Information Technology Graduate<br>
--------------------------------------------------------<br>
Current Role: Full-Stack Developer & Database Specialist<br>
Status      : Actively seeking Full-Time Opportunities, Internships, and Freelance Work.<br>
Experience  : Junior SQL Developer Intern at R&D Info Technology (1 Month)<br>
Bio         : I construct scalable interfaces, build robust databases, and write <br>
              clear technical documentation. I adapt quickly to solve complex <br>
              end-to-end engineering challenges.`,
    
    projects: `CORE DIRECTORY PROJECTS:<br>
--------------------------------------------------------<br>
1. <span class="term-proj">TUDUYU (AI PRODUCTIVITY APP)</span><br>
   - Role: Core Backend Developer<br>
   - Technologies: React.js, TypeScript, Supabase, Groq AI Edge Functions<br>
   - Description: A full-stack task organizer. Features a real-time Kanban interface and LLM parsing routines.<br><br>
2. <span class="term-proj">COLDRTS STUDIO WEBSITE</span><br>
   - Role: Full-Stack Developer (Full Site Creator)<br>
   - Technologies: Next.js, React, Tailwind CSS, Framer Motion<br>
   - Description: Developed the official site for Coldrts Studio, detailing 3D animation pipelines, portfolios, and service funnels.<br><br>
3. <span class="term-proj">HEALTH MATE AI (DIAGNOSTIC TOOL)</span><br>
   - Role: Creator & Lead Engineer (Solo Creator)<br>
   - Technologies: Python, Scikit-learn, React.js<br>
   - Description: Developed symptom checker diagnostic platform predicting medical conditions.<br><br>
4. <span class="term-proj">URBAN SCHOLAR (NGO SQUAD)</span><br>
   - Role: Core Full-Stack Developer & Database Architect<br>
   - Technologies: PHP, MySQL, CSS Grid, AJAX APIs<br>
   - Description: Built a secure volunteer management system connecting educators with students, live at urbanscholar.site.je.<br><br>
5. <span class="term-proj">NO ONE'S JUDGING</span><br>
   - Role: Creator & Lead Developer (Solo Creator)<br>
   - Technologies: Semantic HTML, Modern CSS Grid, GitHub Pages<br>
   - Description: Minimalist anonymized text editing block designed for distraction-free creative writing.<br><br>
6. <span class="term-proj">CIE PORTAL</span><br>
   - Role: Full-Stack Developer (Team Project)<br>
   - Technologies: PHP, MySQL, CSS Grid, JavaScript<br>
   - Description: Continuous Internal Evaluation platform designed for Deogiri College. Contributed to frontend components and backend logic as part of the project team.`,
    
    skills: `DYNAMIC TECHNICAL MATRIX:<br>
--------------------------------------------------------<br>
Skills Matrix    : [==================  ] 90% (JS/TS, Python, PHP, SQL)<br>
Frontend Dev    : [=================   ] 85% (HTML, CSS Grid/Flex, React)<br>
Backend Dev     : [===============     ] 75% (Node, Express, Supabase, MySQL)<br>
3D & Creative   : [=============       ] 65% (Three.js, Technical Writing)`,
    
    contact: `CONNECTION ENDPOINTS:<br>
--------------------------------------------------------<br>
Email    : <a href="mailto:anujarke1010@gmail.com" class="term-link">anujarke1010@gmail.com</a><br>
Phone    : +91 8767366735<br>
LinkedIn : <a href="https://linkedin.com/in/anuj-arke" target="_blank" class="term-link">linkedin.com/in/anuj-arke</a><br>
GitHub   : <a href="https://github.com/Anuj747" target="_blank" class="term-link">github.com/Anuj747</a>`,
    
    secret: `<span style="color: #00ff9d;">* ACCESSING SYSTEM ENCRYPTED CORE *</span><br>
    🎨   CREATIVE NODE CONNECTED.<br>
         Glow shaders active. Color levels optimal.<br>
         "The details are not the details. They make the design." - Charles Eames`
};

const PROJECT_LINKS = {
    coldrts: "https://coldrts.vercel.app/",
    tuduyu: "https://tuduyu-nu.vercel.app/",
    scholar: "https://urbanscholar.site.je/",
    health: "https://spectacular-florentine-aff895.netlify.app/",
    judging: "https://anuj747.github.io/NoOnesJudging/"
};

function initTerminal() {
    const termBody = document.getElementById('terminal-body');
    const termInput = document.getElementById('terminal-input');
    if (!termBody || !termInput) return;

    document.querySelector('.terminal-container').addEventListener('click', () => {
        termInput.focus();
    });

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const commandRaw = termInput.value.trim();
            const tokens = commandRaw.split(' ');
            const command = tokens[0].toLowerCase();
            
            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-line';
            outputLine.innerHTML = `<span class="term-prompt">anujarke@system:~$</span> ${commandRaw}`;
            termBody.appendChild(outputLine);

            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-response';

            if (command === '') {
                // Empty
            } else if (command === 'clear') {
                termBody.innerHTML = '';
            } else if (command === 'run') {
                const targetProj = tokens[1] ? tokens[1].toLowerCase() : '';
                if (PROJECT_LINKS[targetProj]) {
                    responseLine.innerHTML = `Launching <span class="term-proj">${targetProj.toUpperCase()}</span> in a new browser tab...`;
                    window.open(PROJECT_LINKS[targetProj], '_blank');
                    termBody.appendChild(responseLine);
                } else {
                    responseLine.innerHTML = `Project <span style="color:#ef4444;">${tokens[1] || 'undefined'}</span> not found. Supported run arguments: <span class="term-cmd">coldrts</span>, <span class="term-cmd">tuduyu</span>, <span class="term-cmd">scholar</span>, <span class="term-cmd">health</span>, <span class="term-cmd">judging</span>.`;
                    termBody.appendChild(responseLine);
                }
            } else if (TERMINAL_DATA[command]) {
                responseLine.innerHTML = TERMINAL_DATA[command];
                termBody.appendChild(responseLine);
            } else {
                responseLine.innerHTML = `System command not found: <span style="color: #ef4444;">${command}</span>. Type <span class="term-cmd">help</span> for assistance.`;
                termBody.appendChild(responseLine);
            }

            termInput.value = '';
            const termScroll = document.querySelector('.terminal-body-wrapper');
            termScroll.scrollTop = termScroll.scrollHeight;
        }
    });
}

// ---------------------------------------------------------
// 4. INTERACTIVE TELEMETRY PING WIDGET
// ---------------------------------------------------------
function initPingWidget() {
    const pingBtn = document.getElementById('ping-btn');
    const pingLog = document.getElementById('ping-log');
    if (!pingBtn || !pingLog) return;

    pingBtn.addEventListener('click', () => {
        if (pingBtn.disabled) return;
        
        pingBtn.disabled = true;
        pingBtn.innerText = "PINGING...";
        pingLog.innerHTML = "";
        
        const ip = "192.168.4.1";
        const latencyA = (7 + Math.random() * 6).toFixed(2);
        const latencyB = (7 + Math.random() * 6).toFixed(2);
        const latencyC = (7 + Math.random() * 6).toFixed(2);
        
        const lines = [
            `$ ping -c 3 anujarke.com`,
            `PING anujarke.com (${ip}) 56(84) bytes of data.`,
            `64 bytes from ${ip}: icmp_seq=1 ttl=64 time=${latencyA} ms`,
            `64 bytes from ${ip}: icmp_seq=2 ttl=64 time=${latencyB} ms`,
            `64 bytes from ${ip}: icmp_seq=3 ttl=64 time=${latencyC} ms`,
            `--- anujarke.com ping statistics ---`,
            `3 packets transmitted, 3 received, 0% packet loss, time 2004ms`,
            `rtt min/avg/max = 7.02 / 9.85 / 13.01 ms`,
            `CONNECTION SECURE // SYSTEM CHANNELS SHIELDED`
        ];

        let index = 0;
        function printNextPingLine() {
            if (index < lines.length) {
                const line = document.createElement('div');
                line.style.marginBottom = '4px';
                if (index === 0) {
                    line.style.color = '#ff007f';
                } else if (index === lines.length - 1) {
                    line.style.color = '#00f2fe';
                    line.style.fontWeight = 'bold';
                } else {
                    line.style.color = '#a1a1aa';
                }
                line.innerHTML = lines[index];
                pingLog.appendChild(line);
                pingLog.scrollTop = pingLog.scrollHeight;
                index++;
                
                let delay = 100;
                if (index === 1) delay = 300;
                if (index > 1 && index <= 5) delay = 400;
                if (index > 5) delay = 150;
                
                setTimeout(printNextPingLine, delay);
            } else {
                pingBtn.disabled = false;
                pingBtn.innerText = "RE-PING CONNECTION";
            }
        }

        printNextPingLine();
    });
}

// ---------------------------------------------------------
// 5. DYNAMIC ACTIVITY LOG LOOP (NEW CREATIVE THREAD)
// ---------------------------------------------------------
function initActivityLog() {
    const logContainer = document.getElementById('activity-log-feed');
    if (!logContainer) return;

    const messages = [
        "Swapped WebGL frame buffer.",
        "Refreshed Aurora glass backdrop filter.",
        "Pinged local node (ap-south-1). Status: 200 OK",
        "Mounted creative stack depositories.",
        "Memory leak checker: 0 variables flagged.",
        "System local clock synchronized successfully.",
        "Three.js particle coordinate matrices updated.",
        "Garbage collector: cleared temporary logs.",
        "Encrypted socket link stable."
    ];

    setInterval(() => {
        const timestamp = new Date().toLocaleTimeString([], { hour12: false });
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        
        const line = document.createElement('div');
        line.className = 'activity-log-line';
        line.innerHTML = `<span class="log-time">[${timestamp}]</span> <span class="log-tag">SYS_DAEMON:</span> ${randomMsg}`;
        
        logContainer.appendChild(line);
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // Remove oldest child if limit exceeded (keep last 50 lines)
        if (logContainer.childNodes.length > 50) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }, 3500 + Math.random() * 2000);
}

// ---------------------------------------------------------
// 6. SCROLL INTERSECTION REVEALS
// ---------------------------------------------------------
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    const cards = document.querySelectorAll('.project-card, .skills-category-group, .telemetry-panel, .terminal-container, .activity-log-panel');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
    }

    // Smooth scroll for all internal anchor links (mobile friendly)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const nav = document.querySelector('nav');
                let navOffset = 0;
                if (nav) {
                    const navRect = nav.getBoundingClientRect();
                    // Only offset if navbar is fixed at the top (desktop/tablet)
                    if (navRect.top === 0) {
                        navOffset = nav.offsetHeight;
                    }
                }
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navOffset;

                if (window.lenis) {
                    window.lenis.scrollTo(targetElement, { offset: -navOffset });
                } else {
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }

                // Update hash in URL without jumping (safely handles local file:// security restrictions)
                try {
                    history.pushState(null, null, targetId);
                } catch (err) {
                    console.warn("Could not update history state due to local security policy:", err);
                }
            }
        });
    });
}

// ---------------------------------------------------------
// 7. NOBU THE CAT MASCOT INTERACTION
// ---------------------------------------------------------
function initNobuMascot() {
    const nobuMascot = document.getElementById('nobu-mascot-container');
    const nobuCat = document.getElementById('nobu-cat');
    const nobuDialog = document.getElementById('nobu-dialog');
    const nobuDialogText = document.getElementById('nobu-dialog-text');
    const pupilLeft = document.getElementById('pupil-left');
    const pupilRight = document.getElementById('pupil-right');

    if (!nobuMascot || !nobuCat || !nobuDialog || !nobuDialogText) return;

    // Pupil movement range
    const maxOffset = 3; // pixels

    // Pupil coordinate tracking
    window.addEventListener('mousemove', (e) => {
        // Left Eye
        movePupil(e, pupilLeft);
        // Right Eye
        movePupil(e, pupilRight);
    });

    function movePupil(e, pupil) {
        if (!pupil) return;
        const rect = pupil.parentElement.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        const dist = Math.min(maxOffset, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 25);

        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;

        pupil.style.transform = `translate(${x}px, ${y}px)`;
    }

    // Dialogue prompts
    const nobuQuotes = [
        "Need a dev? Meow!",
        "Anuj's CGPA is 8.0! Super clean transcript.",
        "Obsidian Emerald looks so cyber, doesn't it?",
        "Have you tried running terminal commands? Type 'help'!",
        "Did you check out Tuduyu? It's full stack and AI powered!",
        "Wait, is that a bug? Oh, just a piece of lint. Meow.",
        "Code compiled successfully! Feed me treats.",
        "Need some technical copywriting? Anuj can draft it!",
        "System latency is 12ms. Connection secure.",
        "Click me again for more dev wisdom!"
    ];

    let speechTimeout;

    // Click Mascot to wink and trigger dialogue
    nobuMascot.addEventListener('click', () => {
        // Wink animation
        nobuCat.classList.add('wink');
        setTimeout(() => {
            nobuCat.classList.remove('wink');
        }, 300);

        // Pick random quote
        const randomQuote = nobuQuotes[Math.floor(Math.random() * nobuQuotes.length)];
        nobuDialogText.textContent = randomQuote;
        
        // Show dialogue
        nobuDialog.classList.add('active');

        // Reset display timeout
        clearTimeout(speechTimeout);
        speechTimeout = setTimeout(() => {
            nobuDialog.classList.remove('active');
        }, 4000);
    });

    // Auto welcome message on page load after preloader fades
    setTimeout(() => {
        nobuDialogText.textContent = "Welcome! I'm Nobu. Meow!";
        nobuDialog.classList.add('active');
        speechTimeout = setTimeout(() => {
            nobuDialog.classList.remove('active');
        }, 3500);
    }, 2500);
}

// ========================================================
// 8. SCROLL REVEAL (React Bits Port)
// ========================================================
function initScrollReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP or ScrollTrigger is not loaded. Skipping ScrollReveal.");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => {
        const baseOpacity = parseFloat(el.getAttribute('data-base-opacity') ?? '0.1');
        const baseRotation = parseFloat(el.getAttribute('data-base-rotation') ?? '5');
        const blurStrength = parseFloat(el.getAttribute('data-blur-strength') ?? '8');
        const enableBlur = el.getAttribute('data-enable-blur') !== 'false';
        const rotationEnd = el.getAttribute('data-rotation-end') || 'bottom bottom';
        const wordAnimationEnd = el.getAttribute('data-word-animation-end') || 'bottom bottom';
        const scroller = window;

        const textElement = el.querySelector('.scroll-reveal-text') || el;
        splitTextIntoWords(textElement);

        // Rotation animation
        gsap.fromTo(
            el,
            { transformOrigin: '0% 50%', rotate: baseRotation },
            {
                ease: 'none',
                rotate: 0,
                scrollTrigger: {
                    trigger: el,
                    scroller,
                    start: 'top bottom',
                    end: rotationEnd,
                    scrub: true
                }
            }
        );

        const wordElements = el.querySelectorAll('.word');

        // Opacity animation
        gsap.fromTo(
            wordElements,
            { opacity: baseOpacity, willChange: 'opacity' },
            {
                ease: 'none',
                opacity: 1,
                stagger: 0.05,
                scrollTrigger: {
                    trigger: el,
                    scroller,
                    start: 'top bottom-=20%',
                    end: wordAnimationEnd,
                    scrub: true
                }
            }
        );

        // Blur animation
        if (enableBlur) {
            gsap.fromTo(
                wordElements,
                { filter: `blur(${blurStrength}px)` },
                {
                    ease: 'none',
                    filter: 'blur(0px)',
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom-=20%',
                        end: wordAnimationEnd,
                        scrub: true
                    }
                }
            );
        }
    });
}

function splitTextIntoWords(element) {
    const nodes = Array.from(element.childNodes);
    element.innerHTML = '';
    
    nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            const tokens = text.split(/(\s+)/);
            tokens.forEach(token => {
                if (token.match(/^\s+$/)) {
                    element.appendChild(document.createTextNode(token));
                } else if (token !== '') {
                    const span = document.createElement('span');
                    span.className = 'word';
                    span.textContent = token;
                    element.appendChild(span);
                }
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            const text = node.textContent;
            const tokens = text.split(/(\s+)/);
            
            const wrapper = document.createElement(tagName);
            // Copy all attributes (like class, style, etc.)
            Array.from(node.attributes).forEach(attr => {
                wrapper.setAttribute(attr.name, attr.value);
            });
            
            tokens.forEach(token => {
                if (token.match(/^\s+$/)) {
                    wrapper.appendChild(document.createTextNode(token));
                } else if (token !== '') {
                    const span = document.createElement('span');
                    span.className = 'word';
                    span.textContent = token;
                    wrapper.appendChild(span);
                }
            });
            element.appendChild(wrapper);
        }
    });
}

// ========================================================
// 9. LOGOLOOP (React Bits Port)
// ========================================================
function initLogoLoop() {
    const loops = document.querySelectorAll('.logoloop');
    loops.forEach(container => {
        const speed = parseFloat(container.getAttribute('data-speed') || '50');
        const direction = container.getAttribute('data-direction') || 'left';
        const gap = parseInt(container.getAttribute('data-gap') || '32', 10);
        const logoHeight = parseInt(container.getAttribute('data-logo-height') || '28', 10);
        const pauseOnHover = container.getAttribute('data-pause-on-hover') !== 'false';
        const hoverSpeedAttr = container.getAttribute('data-hover-speed');
        const hoverSpeed = hoverSpeedAttr !== null ? parseFloat(hoverSpeedAttr) : (pauseOnHover ? 0 : undefined);
        const isVertical = direction === 'up' || direction === 'down';

        // Velocity math
        const magnitude = Math.abs(speed);
        let directionMultiplier = isVertical ? (direction === 'up' ? 1 : -1) : (direction === 'left' ? 1 : -1);
        const speedMultiplier = speed < 0 ? -1 : 1;
        const targetVelocity = magnitude * directionMultiplier * speedMultiplier;

        let track = container.querySelector('.logoloop__track');
        if (!track) {
            track = document.createElement('div');
            track.className = 'logoloop__track';
            while (container.firstChild) {
                track.appendChild(container.firstChild);
            }
            container.appendChild(track);
        }

        const templateList = track.querySelector('ul.logoloop__list');
        if (!templateList) return;

        // Reset
        const existingLists = track.querySelectorAll('ul.logoloop__list');
        existingLists.forEach((list, idx) => {
            if (idx > 0) list.remove();
        });

        let seqWidth = 0;
        let seqHeight = 0;
        let copyCount = 2;
        let isHovered = false;

        const updateDimensions = () => {
            const containerWidth = container.clientWidth ?? 0;
            const sequenceRect = templateList.getBoundingClientRect();
            const sequenceWidth = sequenceRect.width ?? 0;
            const sequenceHeight = sequenceRect.height ?? 0;

            if (isVertical) {
                const parentHeight = container.parentElement ? container.parentElement.clientHeight : 0;
                if (parentHeight > 0) {
                    container.style.height = `${parentHeight}px`;
                }
                if (sequenceHeight > 0) {
                    seqHeight = Math.ceil(sequenceHeight);
                    const viewport = container.clientHeight || parentHeight || sequenceHeight;
                    const copiesNeeded = Math.ceil(viewport / sequenceHeight) + 2;
                    copyCount = Math.max(2, copiesNeeded);
                }
            } else if (sequenceWidth > 0) {
                seqWidth = Math.ceil(sequenceWidth);
                const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + 2;
                copyCount = Math.max(2, copiesNeeded);
            }

            syncClones();
        };

        const syncClones = () => {
            const currentLists = track.querySelectorAll('ul.logoloop__list');
            if (currentLists.length < copyCount) {
                for (let i = currentLists.length; i < copyCount; i++) {
                    const clone = templateList.cloneNode(true);
                    clone.setAttribute('aria-hidden', 'true');
                    track.appendChild(clone);
                }
            } else if (currentLists.length > copyCount) {
                for (let i = currentLists.length - 1; i >= copyCount; i--) {
                    currentLists[i].remove();
                }
            }
        };

        let resizeObserver = null;
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(() => updateDimensions());
            resizeObserver.observe(container);
            resizeObserver.observe(templateList);
        } else {
            window.addEventListener('resize', updateDimensions);
        }

        const images = templateList.querySelectorAll('img');
        let remainingImages = images.length;
        if (remainingImages > 0) {
            const handleImageLoad = () => {
                remainingImages -= 1;
                if (remainingImages === 0) updateDimensions();
            };
            images.forEach(img => {
                if (img.complete) handleImageLoad();
                else {
                    img.addEventListener('load', handleImageLoad, { once: true });
                    img.addEventListener('error', handleImageLoad, { once: true });
                }
            });
        } else {
            setTimeout(updateDimensions, 50);
        }

        if (hoverSpeed !== undefined) {
            track.addEventListener('mouseenter', () => { isHovered = true; });
            track.addEventListener('mouseleave', () => { isHovered = false; });
        }

        // Anim Loop
        let rafId = null;
        let lastTimestamp = null;
        let offset = 0;
        let velocity = 0;

        const animate = timestamp => {
            if (lastTimestamp === null) lastTimestamp = timestamp;
            const deltaTime = Math.max(0, timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            const target = isHovered ? hoverSpeed : targetVelocity;
            const easingFactor = 1 - Math.exp(-deltaTime / 0.25);
            velocity += (target - velocity) * easingFactor;

            const seqSize = isVertical ? seqHeight : seqWidth;
            if (seqSize > 0) {
                offset += velocity * deltaTime;
                offset = ((offset % seqSize) + seqSize) % seqSize;

                const transformValue = isVertical
                    ? `translate3d(0, ${-offset}px, 0)`
                    : `translate3d(${-offset}px, 0, 0)`;
                track.style.transform = transformValue;
            }

            rafId = requestAnimationFrame(animate);
        };
        rafId = requestAnimationFrame(animate);

        container._cleanupLogoLoop = () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (resizeObserver) resizeObserver.disconnect();
            else window.removeEventListener('resize', updateDimensions);
        };
    });
}

// ========================================================
// 10. ELECTRIC BORDER (React Bits Port)
// ========================================================
function initElectricBorders() {
    const borders = document.querySelectorAll('.electric-border');
    borders.forEach(container => {
        const canvas = container.querySelector('.eb-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const color = container.getAttribute('data-color') || '#00ff9d';
        const speed = parseFloat(container.getAttribute('data-speed') || '1');
        const chaos = parseFloat(container.getAttribute('data-chaos') || '0.12');
        const borderRadius = parseInt(container.getAttribute('data-border-radius') || '12', 10);

        let time = 0;
        let lastFrameTime = 0;
        let animationFrameId = null;

        const random = x => {
            const val = (Math.sin(x * 12.9898) * 43758.5453) % 1;
            return val - Math.floor(val);
        };

        const noise2D = (x, y) => {
            const i = Math.floor(x);
            const j = Math.floor(y);
            const fx = x - i;
            const fy = y - j;

            const a = random(i + j * 57);
            const b = random(i + 1 + j * 57);
            const c = random(i + (j + 1) * 57);
            const d = random(i + 1 + (j + 1) * 57);

            const ux = fx * fx * (3.0 - 2.0 * fx);
            const uy = fy * fy * (3.0 - 2.0 * fy);

            return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
        };

        const octavedNoise = (x, octaves, lacunarity, gain, baseAmplitude, baseFrequency, timeVal, seed, baseFlatness) => {
            let y = 0;
            let amplitude = baseAmplitude;
            let frequency = baseFrequency;

            for (let i = 0; i < octaves; i++) {
                let octaveAmplitude = amplitude;
                if (i === 0) octaveAmplitude *= baseFlatness;
                y += octaveAmplitude * noise2D(frequency * x + seed * 100, timeVal * frequency * 0.3);
                frequency *= lacunarity;
                amplitude *= gain;
            }
            return y;
        };

        const getCornerPoint = (centerX, centerY, rad, startAngle, arcLength, progress) => {
            const angle = startAngle + progress * arcLength;
            return {
                x: centerX + rad * Math.cos(angle),
                y: centerY + rad * Math.sin(angle)
            };
        };

        const getRoundedRectPoint = (t, left, top, width, height, rad) => {
            const straightWidth = width - 2 * rad;
            const straightHeight = height - 2 * rad;
            const cornerArc = (Math.PI * rad) / 2;
            const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
            const distance = t * totalPerimeter;

            let accumulated = 0;

            if (distance <= accumulated + straightWidth) {
                return { x: left + rad + ((distance - accumulated) / straightWidth) * straightWidth, y: top };
            }
            accumulated += straightWidth;

            if (distance <= accumulated + cornerArc) {
                return getCornerPoint(left + width - rad, top + rad, rad, -Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
            }
            accumulated += cornerArc;

            if (distance <= accumulated + straightHeight) {
                return { x: left + width, y: top + rad + ((distance - accumulated) / straightHeight) * straightHeight };
            }
            accumulated += straightHeight;

            if (distance <= accumulated + cornerArc) {
                return getCornerPoint(left + width - rad, top + height - rad, rad, 0, Math.PI / 2, (distance - accumulated) / cornerArc);
            }
            accumulated += cornerArc;

            if (distance <= accumulated + straightWidth) {
                return { x: left + width - rad - ((distance - accumulated) / straightWidth) * straightWidth, y: top + height };
            }
            accumulated += straightWidth;

            if (distance <= accumulated + cornerArc) {
                return getCornerPoint(left + rad, top + height - rad, rad, Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
            }
            accumulated += cornerArc;

            if (distance <= accumulated + straightHeight) {
                return { x: left, y: top + height - rad - ((distance - accumulated) / straightHeight) * straightHeight };
            }
            accumulated += straightHeight;

            return getCornerPoint(left + rad, top + rad, rad, Math.PI, Math.PI / 2, (distance - accumulated) / cornerArc);
        };

        const octaves = 3; // Reduced from 10 to 3 for massive CPU optimization
        const lacunarity = 1.6;
        const gain = 0.7;
        const amplitude = chaos;
        const frequency = 10;
        const baseFlatness = 0;
        const displacement = 60;
        const borderOffset = 60;

        const updateSize = () => {
            const rect = container.getBoundingClientRect();
            const w = rect.width + borderOffset * 2;
            const h = rect.height + borderOffset * 2;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.scale(dpr, dpr);

            return { width: w, height: h };
        };

        let { width, height } = updateSize();
        let lastDpr = Math.min(window.devicePixelRatio || 1, 2);

        const drawElectricBorder = currentTime => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            if (dpr !== lastDpr) {
                lastDpr = dpr;
                const newSize = updateSize();
                width = newSize.width;
                height = newSize.height;
            }

            if (!lastFrameTime) lastFrameTime = currentTime;
            const deltaTime = (currentTime - lastFrameTime) / 1000;
            time += deltaTime * speed;
            lastFrameTime = currentTime;

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.scale(dpr, dpr);

            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const scale = displacement;
            const left = borderOffset;
            const top = borderOffset;
            const borderWidth = width - 2 * borderOffset;
            const borderHeight = height - 2 * borderOffset;
            const maxRadius = Math.min(borderWidth, borderHeight) / 2;
            const radius = Math.min(borderRadius, maxRadius);

            const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
            const sampleCount = Math.floor(approximatePerimeter / 8); // Sample every 8px instead of 2px for 4x CPU reduction

            ctx.beginPath();

            for (let i = 0; i <= sampleCount; i++) {
                const progress = i / sampleCount;
                const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);

                const xNoise = octavedNoise(
                    progress * 8,
                    octaves,
                    lacunarity,
                    gain,
                    amplitude,
                    frequency,
                    time,
                    0,
                    baseFlatness
                );

                const yNoise = octavedNoise(
                    progress * 8,
                    octaves,
                    lacunarity,
                    gain,
                    amplitude,
                    frequency,
                    time,
                    1,
                    baseFlatness
                );

                const displacedX = point.x + xNoise * scale;
                const displacedY = point.y + yNoise * scale;

                if (i === 0) ctx.moveTo(displacedX, displacedY);
                else ctx.lineTo(displacedX, displacedY);
            }

            ctx.closePath();
            ctx.stroke();

            if (isIntersecting) {
                animationFrameId = requestAnimationFrame(drawElectricBorder);
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            const newSize = updateSize();
            width = newSize.width;
            height = newSize.height;
        });
        resizeObserver.observe(container);

        let isIntersecting = false;
        const intersectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                isIntersecting = entry.isIntersecting;
                if (isIntersecting && !animationFrameId) {
                    lastFrameTime = 0;
                    animationFrameId = requestAnimationFrame(drawElectricBorder);
                } else if (!isIntersecting && animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            });
        }, { threshold: 0.01 });
        intersectionObserver.observe(container);

        container._cleanupElectricBorder = () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
        };
    });
}

// ========================================================
// 11. TEXT PRESSURE (React Bits Port)
// ========================================================
function initTextPressure() {
    const containers = document.querySelectorAll('.text-pressure-component');
    
    const dist = (a, b) => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const getAttr = (distance, maxDist, minVal, maxVal) => {
        const val = maxVal - Math.abs((maxVal * distance) / maxDist);
        return Math.max(minVal, val + minVal);
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    };

    containers.forEach(container => {
        const text = container.getAttribute('data-text') || 'ANUJ ARKE';
        const fontFamily = container.getAttribute('data-font-family') || 'Compressa VF';
        const fontUrl = container.getAttribute('data-font-url') || 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2';
        
        const width = container.getAttribute('data-width') !== 'false';
        const weight = container.getAttribute('data-weight') !== 'false';
        const italic = container.getAttribute('data-italic') !== 'false';
        const alpha = container.getAttribute('data-alpha') === 'true';
        const flex = container.getAttribute('data-flex') !== 'false';
        const stroke = container.getAttribute('data-stroke') === 'true';
        const scale = container.getAttribute('data-scale') !== 'false';
        
        const textColor = container.getAttribute('data-text-color') || '#ffffff';
        const strokeColor = container.getAttribute('data-stroke-color') || '#00ff9d';
        const minFontSize = parseFloat(container.getAttribute('data-min-font-size') || '24');

        const styleId = `text-pressure-style-${fontFamily.replace(/\s+/g, '-')}`;
        if (!document.getElementById(styleId)) {
            const styleEl = document.createElement('style');
            styleEl.id = styleId;
            styleEl.textContent = `
                @font-face {
                    font-family: '${fontFamily}';
                    src: url('${fontUrl}');
                    font-style: normal;
                }
                .tp-flex {
                    display: flex;
                    justify-content: space-between;
                }
                .tp-stroke span {
                    position: relative;
                    color: ${textColor};
                }
                .tp-stroke span::after {
                    content: attr(data-char);
                    position: absolute;
                    left: 0;
                    top: 0;
                    color: transparent;
                    z-index: -1;
                    -webkit-text-stroke-width: 3px;
                    -webkit-text-stroke-color: ${strokeColor};
                }
            `;
            document.head.appendChild(styleEl);
        }

        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.background = 'transparent';

        const h1 = document.createElement('h1');
        h1.className = 'text-pressure-title';
        if (flex) h1.classList.add('tp-flex');
        if (stroke) h1.classList.add('tp-stroke');
        
        h1.style.fontFamily = `'${fontFamily}', sans-serif`;
        h1.style.textTransform = 'uppercase';
        h1.style.margin = '0';
        h1.style.textAlign = 'center';
        h1.style.userSelect = 'none';
        h1.style.whiteSpace = 'nowrap';
        h1.style.fontWeight = '100';
        h1.style.width = '100%';
        h1.style.transformOrigin = 'center top';

        const chars = text.split('');
        const spans = chars.map(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.setAttribute('data-char', char);
            span.style.display = 'inline-block';
            if (!stroke) span.style.color = textColor;
            h1.appendChild(span);
            return span;
        });

        container.appendChild(h1);

        const mouse = { x: 0, y: 0 };
        const cursor = { x: 0, y: 0 };
        let fontSize = minFontSize;
        let scaleY = 1;
        let lineHeight = 1;

        const handleMouseMove = e => {
            cursor.x = e.clientX;
            cursor.y = e.clientY;
        };
        const handleTouchMove = e => {
            const t = e.touches[0];
            cursor.x = t.clientX;
            cursor.y = t.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        const rect = container.getBoundingClientRect();
        mouse.x = rect.left + rect.width / 2;
        mouse.y = rect.top + rect.height / 2;
        cursor.x = mouse.x;
        cursor.y = mouse.y;

        const setSize = () => {
            const containerRect = container.getBoundingClientRect();
            if (containerRect.width === 0) return;

            const scaleFactor = window.innerWidth < 768 ? 1.15 : 2;
            let newFontSize = containerRect.width / (chars.length / scaleFactor);
            newFontSize = Math.max(newFontSize, minFontSize);

            fontSize = newFontSize;
            scaleY = 1;
            lineHeight = 1;

            h1.style.fontSize = `${fontSize}px`;
            h1.style.lineHeight = `${lineHeight}`;
            h1.style.transform = `scale(1, ${scaleY})`;

            requestAnimationFrame(() => {
                const textRect = h1.getBoundingClientRect();
                if (scale && textRect.height > 0 && containerRect.height > 0) {
                    let yRatio = containerRect.height / textRect.height;
                    // Limit vertical stretching on mobile/touch screens to avoid severe distortion
                    if (window.innerWidth < 768) {
                        yRatio = Math.min(yRatio, 1.25);
                    }
                    scaleY = yRatio;
                    lineHeight = yRatio;
                    h1.style.lineHeight = `${lineHeight}`;
                    h1.style.transform = `scale(1, ${scaleY})`;
                }
            });
        };

        const debouncedSetSize = debounce(setSize, 100);
        setSize();
        window.addEventListener('resize', debouncedSetSize);

        let rafId = null;
        const animate = () => {
            mouse.x += (cursor.x - mouse.x) / 15;
            mouse.y += (cursor.y - mouse.y) / 15;

            const titleRect = h1.getBoundingClientRect();
            const maxDist = titleRect.width / 2;

            spans.forEach(span => {
                if (!span) return;

                const spanRect = span.getBoundingClientRect();
                const charCenter = {
                    x: spanRect.x + spanRect.width / 2,
                    y: spanRect.y + spanRect.height / 2
                };

                const d = dist(mouse, charCenter);

                const isMobile = window.innerWidth < 768;
                const minWdthVal = isMobile ? 65 : 5;
                const minWghtVal = isMobile ? 300 : 100;

                const wdth = width ? Math.floor(getAttr(d, maxDist, minWdthVal, 200)) : 100;
                const wght = weight ? Math.floor(getAttr(d, maxDist, minWghtVal, 900)) : 400;
                const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
                const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;

                const newSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

                if (span.style.fontVariationSettings !== newSettings) {
                    span.style.fontVariationSettings = newSettings;
                }
                if (alpha && span.style.opacity !== alphaVal) {
                    span.style.opacity = alphaVal;
                }
            });

            rafId = requestAnimationFrame(animate);
        };
        rafId = requestAnimationFrame(animate);

        container._cleanupTextPressure = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('resize', debouncedSetSize);
            if (rafId) cancelAnimationFrame(rafId);
        };
    });
}

// ---------------------------------------------------------
// 12. LENIS SMOOTH SCROLL INITIALIZATION
// ---------------------------------------------------------
function initSmoothScroll() {
    if (typeof Lenis === 'undefined') {
        console.warn("Lenis library is not loaded. Skipping smooth scroll.");
        return;
    }

    // Force scroll to top immediately before initializing Lenis
    window.scrollTo(0, 0);

    const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5
    });

    // Reset Lenis scroll state to top immediately
    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', () => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.update();
        }
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.lenis = lenis;

    // Connect GSAP ScrollTrigger to Lenis
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
}
