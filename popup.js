    /********************************************************************
     * 1. ORIGINAL RIDDLES DATA (WITH FLEXIBLE MATCHING & HINTS)
     ********************************************************************/
    const RIDDLE_BANK = [
      {
        q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        accepted: ["an echo", "echo", "echoes"],
        displayAnswer: "An echo",
        hint: "Shout into a canyon and listen closely..."
      },
      {
        q: "The more you take, the more you leave behind. What am I?",
        accepted: ["footsteps", "footstep", "steps", "tracks", "footprints"],
        displayAnswer: "Footsteps",
        hint: "Look behind you when you walk on sand."
      },
      {
        q: "What has keys but can't open locks?",
        accepted: ["a piano", "piano", "a keyboard", "keyboard"],
        displayAnswer: "A piano",
        hint: "A musical instrument with black and white notes."
      },
      {
        q: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
        accepted: ["a map", "map", "maps", "globe"],
        displayAnswer: "A map",
        hint: "Explorers unfold it to find their way."
      },
      {
        q: "I am taken from a mine, and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?",
        accepted: ["pencil lead", "lead", "graphite", "a pencil", "pencil"],
        displayAnswer: "Pencil lead",
        hint: "You use it to write and sketch on paper."
      },
      {
        q: "I have keys but no locks. I have space but no room. You can enter, but can't go outside. What am I?",
        accepted: ["a keyboard", "keyboard", "computer keyboard", "a piano", "piano"],
        displayAnswer: "A keyboard",
        hint: "You are probably typing your answer on one right now!"
      },
      {
        q: "What comes once in a minute, twice in a moment, but never in a thousand years?",
        accepted: ["the letter m", "letter m", "m"],
        displayAnswer: "The letter M",
        hint: "Look at the spelling of the words in the riddle."
      },
      {
        q: "I can fly without wings. I can cry without eyes. Wherever I go, darkness follows me. What am I?",
        accepted: ["a shadow", "shadow", "clouds", "a cloud", "cloud"],
        displayAnswer: "A shadow",
        hint: "It stays attached to your feet on a sunny day."
      },
      {
        q: "The more you have of it, the less you see. What is it?",
        accepted: ["darkness", "dark", "the dark", "fog"],
        displayAnswer: "Darkness",
        hint: "Flip off all the lights and it fills the room."
      },
      {
        q: "I am not alive, but I can grow. I don't have lungs, but I need air. I don't have a mouth, but water kills me. What am I?",
        accepted: ["fire", "a fire", "flame", "flames"],
        displayAnswer: "Fire",
        hint: "What you shoot at the Deadly Robot!"
      }
    ];

    /********************************************************************
     * 2. SYNTHESIZED WEB AUDIO ("Digital Evasion" Loop + Retro SFX)
     ********************************************************************/
    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.muted = false;
        this.musicPlaying = false;
        this.stepIndex = 0;
        this.musicInterval = null;
      }

      init() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            this.ctx = new AudioCtx();
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        if (!this.musicPlaying) {
          this.startMusicLoop();
        }
      }

      toggleMute() {
        this.init();
        this.muted = !this.muted;
        return this.muted;
      }

      startMusicLoop() {
        if (this.musicPlaying) return;
        this.musicPlaying = true;
        // Arpeggio notes inspired by "Digital Evasion" synthwave
        const bassline = [110, 110, 130.81, 146.83, 98, 98, 130.81, 164.81];
        const leadline = [440, 523.25, 659.25, 523.25, 392, 493.88, 587.33, 659.25];

        this.musicInterval = setInterval(() => {
          if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
          const now = this.ctx.currentTime;
          const idx = this.stepIndex % bassline.length;

          // Bass synth pulse
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(bassline[idx], now);
          gain.gain.setValueAtTime(0.035, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.23);

          // Subtle lead melody every other beat
          if (this.stepIndex % 2 === 0) {
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(leadline[idx], now);
            gain2.gain.setValueAtTime(0.02, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.start(now);
            osc2.stop(now + 0.36);
          }

          this.stepIndex++;
        }, 240);
      }

      playJump() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }

      playShoot(isPlayer = true) {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = isPlayer ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(isPlayer ? 620 : 340, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.16);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      }

      playExplosion() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.45);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.47);
      }

      playChime(success = true) {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = success ? [523.25, 659.25, 783.99, 1046.5] : [300, 220, 140];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = success ? 'triangle' : 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.11, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.26);
        });
      }
    }

    const sound = new SoundEngine();

    /********************************************************************
     * 3. THREE.JS 3D SCENE, ARENA PLATFORMS & ENTITIES
     ********************************************************************/
    let scene, camera, renderer, clock;
    let ambientLight, sunLight, shrineLight;
    let starField;

    // Platform colliders list: { mesh, x, y, z, w, h, d, topY }
    const platforms = [];

    // Game State (mirrors popup.js variables)
    let isRiddleActive = false;
    let gameOverBool = false;
    let playerHitsRobot = false;
    let isNightMode = false; // flipFlop() state
    let correctAnswerCount = 0;
    const totalRiddlesToWin = 9;
    let robotsDestroyedCount = 0;
    let usedRiddleIndices = [];
    let currentRiddleObj = null;

    // Entities
    let playerGroup, playerBodyMesh, playerVisorMesh, ripStoneGroup;
    let robotGroup, robotRingMesh;
    let riddleMasterGroup, riddleOrbMesh, riddleHaloMesh;

    // Physics & Movement
    const playerState = {
      pos: new THREE.Vector3(0, 2, 22),
      vel: new THREE.Vector3(0, 0, 0),
      facingAngle: Math.PI, // Facing North (-Z) toward Shrine
      isGrounded: false,
      radius: 0.9,
      height: 2.2,
      speed: 14,
      jumpForce: 17.5,
      gravity: 38
    };

    const robotState = {
      pos: new THREE.Vector3(12, 8, 5),
      targetPos: new THREE.Vector3(-12, 9, -5),
      speed: 9.5,
      radius: 1.8,
      shootTimer: 0,
      shootInterval: 3.0 // Fires every 3 seconds just like setTimeout(..., 3000)
    };

    const shrinePos = new THREE.Vector3(0, 7.6, -22);

    // Projectiles & Particles
    const playerFireballs = []; // fireBall2
    const enemyFireballs = [];  // fireBall
    const particles = [];

    // Input State
    const keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    // Camera Orbit Controls
    let camYaw = 0;
    let camPitch = 0.38;
    let isDraggingMouse = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    function initThreeScene() {
      const container = document.getElementById('canvas-container');
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x7dd3fc); // Day sky
      scene.fog = new THREE.FogExp2(0x7dd3fc, 0.011);

      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      clock = new THREE.Clock();

      // Lighting
      ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      sunLight = new THREE.DirectionalLight(0xfffbeb, 0.95);
      sunLight.position.set(30, 50, 25);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.camera.near = 5;
      sunLight.shadow.camera.far = 140;
      const d = 45;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      scene.add(sunLight);

      shrineLight = new THREE.PointLight(0xa855f7, 2.2, 22);
      shrineLight.position.set(shrinePos.x, shrinePos.y + 3, shrinePos.z);
      scene.add(shrineLight);

      buildStarField();
      buildArenaPlatforms();
      buildPlayerCharacter();
      buildRiddleMaster();
      buildDeadlyRobot();

      window.addEventListener('resize', onWindowResize);
      setupInputListeners();
    }

    function buildStarField() {
      const starGeo = new THREE.BufferGeometry();
      const count = 600;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 220;
        positions[i * 3 + 1] = Math.random() * 90 + 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 220;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xe0f2fe,
        size: 0.7,
        transparent: true,
        opacity: 0.0 // Invisible during Day, visible at Night
      });
      starField = new THREE.Points(starGeo, starMat);
      scene.add(starField);
    }

    function addPlatform(x, y, z, w, h, d, colorHex = 0x334155, trimColor = 0x38bdf8) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const geo = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.4,
        metalness: 0.2
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      // Glowing top neon rim
      const rimGeo = new THREE.BoxGeometry(w + 0.15, 0.18, d + 0.15);
      const rimMat = new THREE.MeshStandardMaterial({
        color: trimColor,
        emissive: trimColor,
        emissiveIntensity: 0.45
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.y = h / 2 - 0.08;
      group.add(rim);

      scene.add(group);

      platforms.push({
        group,
        x,
        y,
        z,
        w,
        h,
        d,
        topY: y + h / 2
      });
    }

    function buildArenaPlatforms() {
      // 1. Main Starting Plaza (South)
      addPlatform(0, -1, 20, 22, 2, 16, 0x1e293b, 0x38bdf8);

      // 2. Central Combat Arena Island
      addPlatform(0, 0.5, 2, 18, 2, 14, 0x334155, 0x818cf8);

      // 3. Stepping Stones (Left & Right Flanks)
      addPlatform(-13, 2.2, 10, 7, 1.5, 7, 0x1e293b, 0x22d3ee);
      addPlatform(13, 2.2, 10, 7, 1.5, 7, 0x1e293b, 0x22d3ee);

      addPlatform(-15, 4.0, -2, 7, 1.5, 7, 0x1e293b, 0xa855f7);
      addPlatform(15, 4.0, -2, 7, 1.5, 7, 0x1e293b, 0xa855f7);

      // 4. Mid Bridge toward Shrine
      addPlatform(0, 3.2, -10, 10, 1.6, 8, 0x334155, 0xc084fc);
      addPlatform(-9, 5.2, -14, 6, 1.4, 6, 0x1e293b, 0xf472b6);
      addPlatform(9, 5.2, -14, 6, 1.4, 6, 0x1e293b, 0xf472b6);

      // 5. Elevated Riddle Master's Shrine (North)
      addPlatform(0, 6.6, -22, 16, 2, 14, 0x311042, 0xe879f9);

      // Decorative Shrine Pillars
      const pillarGeo = new THREE.CylinderGeometry(0.6, 0.8, 7, 12);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x4c1d95,
        roughness: 0.3,
        metalness: 0.5
      });
      [[-6.5, -27], [6.5, -27], [-6.5, -17], [6.5, -17]].forEach(([px, pz]) => {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(px, 11, pz);
        pillar.castShadow = true;
        scene.add(pillar);
      });
    }

    function buildPlayerCharacter() {
      playerGroup = new THREE.Group();

      // Alive Cyber-Explorer Mesh
      const aliveModel = new THREE.Group();

      // Torso
      const torsoGeo = new THREE.CylinderGeometry(0.55, 0.7, 1.3, 16);
      const torsoMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.25,
        metalness: 0.4
      });
      const torso = new THREE.Mesh(torsoGeo, torsoMat);
      torso.position.y = 0.9;
      torso.castShadow = true;
      aliveModel.add(torso);

      // Head
      const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.2
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.85;
      head.castShadow = true;
      aliveModel.add(head);

      // Glowing Cyber Visor (shows facing direction +Z of playerGroup)
      const visorGeo = new THREE.BoxGeometry(0.65, 0.22, 0.35);
      const visorMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.9
      });
      playerVisorMesh = new THREE.Mesh(visorGeo, visorMat);
      playerVisorMesh.position.set(0, 1.88, 0.35);
      aliveModel.add(playerVisorMesh);

      // Jetpackthrusters (homage to playerflying.png)
      const packGeo = new THREE.BoxGeometry(0.7, 0.8, 0.35);
      const packMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
      const pack = new THREE.Mesh(packGeo, packMat);
      pack.position.set(0, 1.0, -0.5);
      aliveModel.add(pack);

      playerBodyMesh = aliveModel;
      playerGroup.add(playerBodyMesh);

      // Gravestone / R.I.P. Model (homage to images/rip.png on Game Over)
      ripStoneGroup = new THREE.Group();
      const baseGeo = new THREE.BoxGeometry(1.8, 0.4, 1.0);
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
      const baseMesh = new THREE.Mesh(baseGeo, stoneMat);
      baseMesh.position.y = 0.2;
      ripStoneGroup.add(baseMesh);

      const slabGeo = new THREE.BoxGeometry(1.4, 1.8, 0.45);
      const slabMesh = new THREE.Mesh(slabGeo, stoneMat);
      slabMesh.position.y = 1.1;
      slabMesh.castShadow = true;
      ripStoneGroup.add(slabMesh);

      // Cross emblem on gravestone
      const crossV = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.8, 0.52),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })
      );
      crossV.position.y = 1.25;
      const crossH = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.22, 0.52),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })
      );
      crossH.position.y = 1.4;
      ripStoneGroup.add(crossV, crossH);

      ripStoneGroup.visible = false;
      playerGroup.add(ripStoneGroup);

      playerGroup.position.copy(playerState.pos);
      scene.add(playerGroup);
    }

    function buildRiddleMaster() {
      riddleMasterGroup = new THREE.Group();
      riddleMasterGroup.position.copy(shrinePos);

      // Pedestal
      const pedGeo = new THREE.CylinderGeometry(1.4, 1.8, 0.8, 16);
      const pedMat = new THREE.MeshStandardMaterial({
        color: 0x581c87,
        metalness: 0.5,
        roughness: 0.3
      });
      const pedestal = new THREE.Mesh(pedGeo, pedMat);
      pedestal.position.y = 0.4;
      pedestal.receiveShadow = true;
      riddleMasterGroup.add(pedestal);

      // Glowing Mystical Orb
      const orbGeo = new THREE.OctahedronGeometry(1.25, 2);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0x9333ea,
        emissiveIntensity: 0.75,
        roughness: 0.15,
        metalness: 0.3
      });
      riddleOrbMesh = new THREE.Mesh(orbGeo, orbMat);
      riddleOrbMesh.position.y = 2.4;
      riddleOrbMesh.castShadow = true;
      riddleMasterGroup.add(riddleOrbMesh);

      // Orbiting Halo Rings
      const haloGeo = new THREE.TorusGeometry(1.9, 0.08, 12, 48);
      const haloMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.8
      });
      riddleHaloMesh = new THREE.Mesh(haloGeo, haloMat);
      riddleHaloMesh.position.y = 2.4;
      riddleHaloMesh.rotation.x = Math.PI / 3;
      riddleMasterGroup.add(riddleHaloMesh);

      scene.add(riddleMasterGroup);
    }

    function buildDeadlyRobot() {
      robotGroup = new THREE.Group();

      // Core metallic sphere
      const coreGeo = new THREE.SphereGeometry(1.25, 20, 20);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x1f2937,
        metalness: 0.8,
        roughness: 0.25
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.castShadow = true;
      robotGroup.add(core);

      // Glowing red eye
      const eyeGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        emissive: 0xe11d48,
        emissiveIntensity: 1.2
      });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(0, 0.15, 1.05);
      robotGroup.add(eye);

      // Spinning Saw/Blade Ring (homage to rotateRobot() in popup.js)
      robotRingMesh = new THREE.Group();
      const ringGeo = new THREE.TorusGeometry(1.75, 0.14, 12, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xfb7185,
        emissive: 0xbe123c,
        emissiveIntensity: 0.5,
        metalness: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      robotRingMesh.add(ring);

      // 4 Spikes around the robot ring
      const spikeGeo = new THREE.ConeGeometry(0.3, 0.9, 8);
      for (let i = 0; i < 4; i++) {
        const spike = new THREE.Mesh(spikeGeo, ringMat);
        const angle = (i * Math.PI) / 2;
        spike.position.set(Math.cos(angle) * 2.1, 0, Math.sin(angle) * 2.1);
        spike.rotation.z = -Math.PI / 2;
        spike.rotation.y = -angle;
        robotRingMesh.add(spike);
      }
      robotGroup.add(robotRingMesh);

      robotGroup.position.copy(robotState.pos);
      scene.add(robotGroup);
      pickNewRobotWaypoint();
    }

    /********************************************************************
     * 4. GAMEPLAY MECHANICS (TRANSLATED FROM POPUP.JS)
     ********************************************************************/

    // Equivalent to getRandomPosition() & moveRobotRandomly()
    function pickNewRobotWaypoint() {
      const randX = (Math.random() - 0.5) * 32;
      const randY = 3.5 + Math.random() * 6.5;
      const randZ = -18 + Math.random() * 36;
      robotState.targetPos.set(randX, randY, randZ);
    }

    // Equivalent to flipFlop() Day/Night Background Toggle
    function toggleDayNightTheme() {
      isNightMode = !isNightMode;
      const badge = document.getElementById('theme-badge');

      if (isNightMode) {
        // Neon Starry Night Theme
        scene.background.setHex(0x070b19);
        scene.fog.color.setHex(0x070b19);
        ambientLight.intensity = 0.35;
        sunLight.intensity = 0.35;
        sunLight.color.setHex(0x818cf8);
        starField.material.opacity = 0.95;

        badge.className = "text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1";
        badge.innerHTML = '<i class="fa-solid fa-moon"></i> Night';
      } else {
        // Bright Cyber Day Theme
        scene.background.setHex(0x7dd3fc);
        scene.fog.color.setHex(0x7dd3fc);
        ambientLight.intensity = 0.75;
        sunLight.intensity = 0.95;
        sunLight.color.setHex(0xfffbeb);
        starField.material.opacity = 0.0;

        badge.className = "text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1";
        badge.innerHTML = '<i class="fa-solid fa-sun"></i> Day';
      }
    }

    // Player shoots fireBall2 (Space in original 2D; F / E / Click in 3D)
    function shootPlayerFireball() {
      if (gameOverBool || isRiddleActive) return;
      sound.init();
      sound.playShoot(true);

      const fbGeo = new THREE.SphereGeometry(0.42, 12, 12);
      const fbMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 1.5
      });
      const mesh = new THREE.Mesh(fbGeo, fbMat);

      // Spawn slightly in front of player chest
      const dir = new THREE.Vector3(
        Math.sin(playerState.facingAngle),
        0,
        Math.cos(playerState.facingAngle)
      ).normalize();

      // If robot is alive and generally in front, gently assist aim vertically toward robot
      if (!playerHitsRobot) {
        const toRobot = new THREE.Vector3().subVectors(robotState.pos, playerState.pos);
        const horizDist = Math.hypot(toRobot.x, toRobot.z);
        const dot = (toRobot.x * dir.x + toRobot.z * dir.z) / (horizDist || 1);
        if (dot > 0.65) {
          dir.y = (robotState.pos.y - (playerState.pos.y + 1.2)) / (horizDist || 1);
          dir.normalize();
        }
      }

      mesh.position.set(
        playerState.pos.x + dir.x * 1.1,
        playerState.pos.y + 1.2,
        playerState.pos.z + dir.z * 1.1
      );
      scene.add(mesh);

      playerFireballs.push({
        mesh,
        vel: dir.multiplyScalar(32),
        life: 2.2
      });
    }

    // Deadly Robot fires fireBall at player's current position every 3 seconds
    function fireWeaponToPlayer() {
      if (gameOverBool || playerHitsRobot || isRiddleActive) return;
      sound.playShoot(false);

      const fbGeo = new THREE.SphereGeometry(0.5, 12, 12);
      const fbMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xdc2626,
        emissiveIntensity: 1.5
      });
      const mesh = new THREE.Mesh(fbGeo, fbMat);
      mesh.position.copy(robotState.pos);
      scene.add(mesh);

      const target = new THREE.Vector3(
        playerState.pos.x,
        playerState.pos.y + 1.0,
        playerState.pos.z
      );
      const dir = new THREE.Vector3().subVectors(target, robotState.pos).normalize();

      enemyFireballs.push({
        mesh,
        vel: dir.multiplyScalar(19),
        life: 4.0
      });
    }

    // Particle burst helper
    function spawnExplosion(pos, colorHex = 0xf43f5e, count = 28) {
      const geo = new THREE.BoxGeometry(0.32, 0.32, 0.32);
      for (let i = 0; i < count; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.9
        });
        const p = new THREE.Mesh(geo, mat);
        p.position.copy(pos);
        scene.add(p);
        particles.push({
          mesh: p,
          vel: new THREE.Vector3(
            (Math.random() - 0.5) * 16,
            Math.random() * 12 + 2,
            (Math.random() - 0.5) * 16
          ),
          life: 0.8 + Math.random() * 0.4
        });
      }
    }

    // Equivalent to destroyRobot() in popup.js
    function destroyRobot() {
      playerHitsRobot = true;
      robotsDestroyedCount++;
      robotGroup.visible = false;
      sound.playExplosion();
      spawnExplosion(robotState.pos, 0xf43f5e, 35);
      updateRobotHUD();
      showToast("Deadly Robot Destroyed! Head to the Riddle Shrine!", "cyan");
    }

    // Respawns robot after answering a riddle (just like popup.js)
    function respawnRobot() {
      playerHitsRobot = false;
      robotState.pos.set((Math.random() - 0.5) * 26, 7.5, 4 + Math.random() * 12);
      robotGroup.position.copy(robotState.pos);
      robotGroup.visible = true;
      robotState.shootTimer = 0;
      pickNewRobotWaypoint();
      updateRobotHUD();
    }

    function updateRobotHUD() {
      const icon = document.getElementById('robot-status-icon');
      const text = document.getElementById('robot-status-text');
      if (playerHitsRobot) {
        icon.className = "text-emerald-400 text-lg";
        icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        text.className = "font-cyber font-bold text-xs sm:text-sm text-emerald-400";
        text.textContent = "DESTROYED";
      } else {
        icon.className = "text-rose-400 text-lg animate-spin";
        icon.innerHTML = '<i class="fa-solid fa-gear"></i>';
        text.className = "font-cyber font-bold text-xs sm:text-sm text-rose-400";
        text.textContent = "PATROLLING";
      }
    }

    // Equivalent to gameOver(won) in popup.js
    function triggerGameOver(won = false, reasonText = "") {
      if (gameOverBool) return;
      gameOverBool = true;
      isRiddleActive = false;
      document.getElementById('riddle-modal').classList.add('hidden');
      document.getElementById('shrine-prompt').classList.add('hidden');

      if (!won) {
        // Turn player into 3D gravestone (rip.png equivalent)
        playerBodyMesh.visible = false;
        ripStoneGroup.visible = true;
        sound.playChime(false);
        spawnExplosion(playerState.pos, 0x94a3b8, 22);
      } else {
        sound.playChime(true);
        spawnExplosion(playerState.pos, 0x38bdf8, 45);
      }

      // Populate End Modal
      const endModal = document.getElementById('end-modal');
      const iconWrap = document.getElementById('end-icon-wrap');
      const icon = document.getElementById('end-icon');
      const title = document.getElementById('end-title');
      const reason = document.getElementById('end-reason');

      document.getElementById('end-score').textContent = `${correctAnswerCount} / ${totalRiddlesToWin}`;
      document.getElementById('end-robots').textContent = `${robotsDestroyedCount}`;

      if (won) {
        iconWrap.className = "w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center text-4xl shadow-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 text-white";
        icon.className = "fa-solid fa-trophy";
        title.textContent = "CONGRATULATIONS YOU WON!";
        title.className = "font-cyber text-2xl sm:text-3xl font-black tracking-wide mb-2 text-emerald-300";
        reason.textContent = reasonText || "You solved all 9 riddles of the Shrine and mastered the 3D Arena!";
      } else {
        iconWrap.className = "w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center text-4xl shadow-xl bg-gradient-to-tr from-rose-600 to-orange-500 text-white";
        icon.className = "fa-solid fa-skull";
        title.textContent = "GAME OVER";
        title.className = "font-cyber text-3xl sm:text-4xl font-black tracking-wide mb-2 text-rose-400";
        reason.textContent = reasonText || "You met your demise in the arena! Your explorer has turned into a gravestone (R.I.P.).";
      }

      endModal.classList.remove('hidden');
      endModal.classList.add('flex');
    }

    function resetGame() {
      gameOverBool = false;
      isRiddleActive = false;
      playerHitsRobot = false;
      correctAnswerCount = 0;
      robotsDestroyedCount = 0;
      usedRiddleIndices = [];

      document.getElementById('riddle-score').textContent = "0";
      document.getElementById('end-modal').classList.add('hidden');
      document.getElementById('end-modal').classList.remove('flex');
      document.getElementById('riddle-modal').classList.add('hidden');
      document.getElementById('riddle-modal').classList.remove('flex');

      // Restore player model
      playerBodyMesh.visible = true;
      ripStoneGroup.visible = false;
      playerState.pos.set(0, 2, 22);
      playerState.vel.set(0, 0, 0);
      playerState.facingAngle = Math.PI;
      playerGroup.position.copy(playerState.pos);

      // Clear fireballs
      playerFireballs.forEach(f => scene.remove(f.mesh));
      playerFireballs.length = 0;
      enemyFireballs.forEach(f => scene.remove(f.mesh));
      enemyFireballs.length = 0;

      // Reset Robot
      respawnRobot();

      // Ensure Day Mode at start
      if (isNightMode) toggleDayNightTheme();

      showToast("Arena Reset! Climb to the Shrine or blast the Robot!", "cyan");
    }

    /********************************************************************
     * 5. RIDDLE MASTER MODAL INTERACTION
     ********************************************************************/
    function openRiddleModal() {
      if (gameOverBool || isRiddleActive) return;
      sound.init();
      isRiddleActive = true;

      // Clear all keys so player stops moving while typing
      keys.up = keys.down = keys.left = keys.right = false;

      // Pick an unused riddle if available
      if (usedRiddleIndices.length >= RIDDLE_BANK.length) {
        usedRiddleIndices = [];
      }
      const available = RIDDLE_BANK.map((_, idx) => idx).filter(i => !usedRiddleIndices.includes(i));
      const chosenIndex = available[Math.floor(Math.random() * available.length)];
      usedRiddleIndices.push(chosenIndex);
      currentRiddleObj = RIDDLE_BANK[chosenIndex];

      document.getElementById('riddle-modal-progress').textContent = `Riddle #${correctAnswerCount + 1} of ${totalRiddlesToWin}`;
      document.getElementById('riddle-question-text').textContent = `"${currentRiddleObj.q}"`;
      document.getElementById('riddle-hint-text').textContent = currentRiddleObj.hint;
      document.getElementById('riddle-hint-text').classList.add('hidden');

      const input = document.getElementById('answerInput');
      input.value = '';

      const modal = document.getElementById('riddle-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      setTimeout(() => input.focus(), 60);
    }

    function closeRiddleModal() {
      isRiddleActive = false;
      const modal = document.getElementById('riddle-modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function handleRiddleSubmit(e) {
      e.preventDefault();
      if (!isRiddleActive || !currentRiddleObj) return;

      const rawInput = document.getElementById('answerInput').value.trim().toLowerCase();
      if (!rawInput) return;

      // Normalize punctuation
      const cleaned = rawInput.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
      const isCorrect = currentRiddleObj.accepted.some(ans => cleaned === ans || cleaned.includes(ans));

      closeRiddleModal();

      if (isCorrect) {
        correctAnswerCount++;
        document.getElementById('riddle-score').textContent = `${correctAnswerCount}`;
        sound.playChime(true);
        spawnExplosion(shrinePos, 0xc084fc, 30);

        // Toggle Day/Night background (flipFlop() mechanic)
        toggleDayNightTheme();

        if (correctAnswerCount >= totalRiddlesToWin) {
          triggerGameOver(true, "You answered all 9 riddles correctly! You are the ultimate Dodge Master!");
          return;
        }

        // Respawn Deadly Robot just like popup.js
        respawnRobot();
        showToast(`Correct! (${currentRiddleObj.displayAnswer}) — Sky shifted & Deadly Robot Respawned!`, "emerald");
      } else {
        // Original popup.js triggers Game Over on wrong riddle answer
        triggerGameOver(
          false,
          `Incorrect answer! The Riddle Master sought "${currentRiddleObj.displayAnswer}". You have been turned into a gravestone!`
        );
      }
    }

    /********************************************************************
     * 6. TOAST NOTIFICATION HELPER
     ********************************************************************/
    let toastTimeout = null;
    function showToast(message, color = "cyan") {
      const banner = document.getElementById('toast-banner');
      const text = document.getElementById('toast-text');
      text.textContent = message;
      banner.classList.remove('opacity-0', '-translate-y-2');
      banner.classList.add('opacity-100', 'translate-y-0');

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        banner.classList.remove('opacity-100', 'translate-y-0');
        banner.classList.add('opacity-0', '-translate-y-2');
      }, 3400);
    }

    /********************************************************************
     * 7. INPUT LISTENERS (KEYBOARD, MOUSE ORBIT, TOUCH)
     ********************************************************************/
    function setupInputListeners() {
      window.addEventListener('keydown', (e) => {
        sound.init();
        if (isRiddleActive) {
          if (e.key === 'Escape') closeRiddleModal();
          return;
        }
        if (gameOverBool) return;

        switch (e.code) {
          case 'KeyW':
          case 'ArrowUp':
            keys.up = true;
            break;
          case 'KeyS':
          case 'ArrowDown':
            keys.down = true;
            break;
          case 'KeyA':
          case 'ArrowLeft':
            keys.left = true;
            break;
          case 'KeyD':
          case 'ArrowRight':
            keys.right = true;
            break;
          case 'Space':
            e.preventDefault();
            doJump();
            break;
          case 'KeyF':
          case 'KeyE':
            e.preventDefault();
            shootPlayerFireball();
            break;
          case 'KeyR':
            // If near Shrine, open riddle modal
            if (playerState.pos.distanceTo(shrinePos) < 5.5) {
              openRiddleModal();
            }
            break;
        }
      });

      window.addEventListener('keyup', (e) => {
        switch (e.code) {
          case 'KeyW':
          case 'ArrowUp':
            keys.up = false;
            break;
          case 'KeyS':
          case 'ArrowDown':
            keys.down = false;
            break;
          case 'KeyA':
          case 'ArrowLeft':
            keys.left = false;
            break;
          case 'KeyD':
          case 'ArrowRight':
            keys.right = false;
            break;
        }
      });

      // Mouse camera orbit + click to shoot
      const canvasEl = renderer.domElement;
      let downTime = 0;

      canvasEl.addEventListener('mousedown', (e) => {
        sound.init();
        isDraggingMouse = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        downTime = performance.now();
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDraggingMouse) return;
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        camYaw -= dx * 0.006;
        camPitch = Math.max(0.12, Math.min(1.15, camPitch + dy * 0.005));
      });

      window.addEventListener('mouseup', (e) => {
        if (isDraggingMouse && performance.now() - downTime < 200) {
          // Quick click fires fireball
          shootPlayerFireball();
        }
        isDraggingMouse = false;
      });

      // UI Buttons
      document.getElementById('open-riddle-btn').addEventListener('click', openRiddleModal);
      document.getElementById('close-riddle-btn').addEventListener('click', closeRiddleModal);
      document.getElementById('riddle-form').addEventListener('submit', handleRiddleSubmit);
      document.getElementById('toggle-hint-btn').addEventListener('click', () => {
        document.getElementById('riddle-hint-text').classList.toggle('hidden');
      });

      document.getElementById('play-again-btn').addEventListener('click', resetGame);
      document.getElementById('reset-game-btn').addEventListener('click', resetGame);

      document.getElementById('desktop-shoot-btn').addEventListener('click', shootPlayerFireball);
      document.getElementById('desktop-jump-btn').addEventListener('click', doJump);
      document.getElementById('mobile-shoot-btn').addEventListener('touchstart', (e) => {
        e.preventDefault();
        shootPlayerFireball();
      });
      document.getElementById('mobile-jump-btn').addEventListener('touchstart', (e) => {
        e.preventDefault();
        doJump();
      });

      // Mobile D-pad buttons
      document.querySelectorAll('.touch-btn').forEach(btn => {
        const dir = btn.dataset.dir;
        const start = (e) => { e.preventDefault(); sound.init(); keys[dir] = true; };
        const end = (e) => { e.preventDefault(); keys[dir] = false; };
        btn.addEventListener('touchstart', start);
        btn.addEventListener('touchend', end);
        btn.addEventListener('mousedown', start);
        btn.addEventListener('mouseup', end);
        btn.addEventListener('mouseleave', end);
      });

      // Audio Mute Button
      document.getElementById('audio-toggle-btn').addEventListener('click', () => {
        const muted = sound.toggleMute();
        const icon = document.getElementById('audio-icon');
        icon.className = muted ? 'fa-solid fa-volume-xmark text-rose-400' : 'fa-solid fa-volume-high text-cyan-300';
        showToast(muted ? "Audio Muted" : "Playing 'Digital Evasion' Synth Loop", "cyan");
      });
    }

    function doJump() {
      if (gameOverBool || isRiddleActive) return;
      sound.init();
      if (playerState.isGrounded) {
        playerState.vel.y = playerState.jumpForce;
        playerState.isGrounded = false;
        sound.playJump();
      }
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /********************************************************************
     * 8. MAIN UPDATE LOOP (PHYSICS, COLLISIONS, AI, CAMERA)
     ********************************************************************/
    function updateGame(dt) {
      const time = clock.getElapsedTime();

      // Animate Riddle Master Orb & Halo
      if (riddleOrbMesh && riddleHaloMesh) {
        riddleOrbMesh.rotation.y = time * 1.2;
        riddleOrbMesh.position.y = 2.4 + Math.sin(time * 2.5) * 0.35;
        riddleHaloMesh.rotation.z = time * 1.8;
        riddleHaloMesh.position.y = riddleOrbMesh.position.y;
      }

      // Update explosion particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          scene.remove(p.mesh);
          particles.splice(i, 1);
        } else {
          p.vel.y -= 24 * dt;
          p.mesh.position.addScaledVector(p.vel, dt);
          p.mesh.rotation.x += 5 * dt;
          p.mesh.rotation.y += 5 * dt;
          p.mesh.scale.setScalar(Math.max(0.01, p.life));
        }
      }

      // Pause active gameplay while Riddle Modal is open or Game Over
      if (gameOverBool || isRiddleActive) {
        updateCamera(dt);
        return;
      }

      // --- 1. PLAYER MOVEMENT & PLATFORMING ---
      const moveInput = new THREE.Vector3();
      if (keys.up) moveInput.z -= 1;
      if (keys.down) moveInput.z += 1;
      if (keys.left) moveInput.x -= 1;
      if (keys.right) moveInput.x += 1;

      if (moveInput.lengthSq() > 0) {
        moveInput.normalize();
        // Rotate movement vector by camera yaw
        const sinY = Math.sin(camYaw);
        const cosY = Math.cos(camYaw);
        const worldX = moveInput.x * cosY + moveInput.z * sinY;
        const worldZ = moveInput.z * cosY - moveInput.x * sinY;

        playerState.vel.x = worldX * playerState.speed;
        playerState.vel.z = worldZ * playerState.speed;
        playerState.facingAngle = Math.atan2(worldX, worldZ);
      } else {
        playerState.vel.x *= 0.82;
        playerState.vel.z *= 0.82;
      }

      // Apply gravity
      playerState.vel.y -= playerState.gravity * dt;

      const prevY = playerState.pos.y;
      playerState.pos.x += playerState.vel.x * dt;
      playerState.pos.y += playerState.vel.y * dt;
      playerState.pos.z += playerState.vel.z * dt;

      // Platform top landing detection
      playerState.isGrounded = false;
      for (const plat of platforms) {
        const withinX = Math.abs(playerState.pos.x - plat.x) <= plat.w / 2 + playerState.radius * 0.65;
        const withinZ = Math.abs(playerState.pos.z - plat.z) <= plat.d / 2 + playerState.radius * 0.65;

        if (withinX && withinZ) {
          if (prevY >= plat.topY - 0.35 && playerState.pos.y <= plat.topY && playerState.vel.y <= 0) {
            playerState.pos.y = plat.topY;
            playerState.vel.y = 0;
            playerState.isGrounded = true;
          }
        }
      }

      // Respawn back onto starting platform if player falls into the void
      if (playerState.pos.y < -18) {
        playerState.pos.set(0, 3, 22);
        playerState.vel.set(0, 0, 0);
        showToast("Whoa! Rescued from the void — watch your step!", "amber");
      }

      // Sync player mesh & slight tilt when flying/moving
      playerGroup.position.copy(playerState.pos);
      playerGroup.rotation.y = playerState.facingAngle;

      // Check proximity to Riddle Master Shrine
      const distToShrine = playerState.pos.distanceTo(shrinePos);
      const shrinePrompt = document.getElementById('shrine-prompt');
      if (distToShrine < 4.8) {
        shrinePrompt.classList.remove('hidden');
      } else {
        shrinePrompt.classList.add('hidden');
      }

      // --- 2. DEADLY ROBOT PATROL & ATTACK ---
      if (!playerHitsRobot) {
        // Spin blade ring continuously (rotateRobot() in popup.js)
        robotRingMesh.rotation.y += 6.5 * dt;
        robotGroup.rotation.y += 1.5 * dt;

        // Fly toward random waypoint (moveRobotRandomly() in popup.js)
        const toTarget = new THREE.Vector3().subVectors(robotState.targetPos, robotState.pos);
        const dist = toTarget.length();
        if (dist < 1.5) {
          pickNewRobotWaypoint();
        } else {
          toTarget.normalize();
          robotState.pos.addScaledVector(toTarget, robotState.speed * dt);
        }
        robotGroup.position.copy(robotState.pos);

        // Shoot fireball at player every 3 seconds (fireWeaponToPlayer() in popup.js)
        robotState.shootTimer += dt;
        if (robotState.shootTimer >= robotState.shootInterval) {
          robotState.shootTimer = 0;
          fireWeaponToPlayer();
        }

        // Direct collision between Player and Deadly Robot (checkPlayerDeadlyRobotCollision)
        const playerCenter = new THREE.Vector3(playerState.pos.x, playerState.pos.y + 1.1, playerState.pos.z);
        if (playerCenter.distanceTo(robotState.pos) < playerState.radius + robotState.radius - 0.3) {
          triggerGameOver(false, "You collided directly with the spinning Deadly Robot!");
          return;
        }
      }

      // --- 3. PROJECTILES UPDATE & COLLISIONS ---
      // Player Fireballs (fireBall2) vs Deadly Robot
      for (let i = playerFireballs.length - 1; i >= 0; i--) {
        const fb = playerFireballs[i];
        fb.life -= dt;
        fb.mesh.position.addScaledVector(fb.vel, dt);

        if (!playerHitsRobot && fb.mesh.position.distanceTo(robotState.pos) < robotState.radius + 0.55) {
          // Hit the robot!
          scene.remove(fb.mesh);
          playerFireballs.splice(i, 1);
          destroyRobot();
          continue;
        }

        if (fb.life <= 0) {
          scene.remove(fb.mesh);
          playerFireballs.splice(i, 1);
        }
      }

      // Enemy Fireballs (fireBall) vs Player
      const playerHitCenter = new THREE.Vector3(playerState.pos.x, playerState.pos.y + 1.1, playerState.pos.z);
      for (let i = enemyFireballs.length - 1; i >= 0; i--) {
        const fb = enemyFireballs[i];
        fb.life -= dt;
        fb.mesh.position.addScaledVector(fb.vel, dt);

        if (fb.mesh.position.distanceTo(playerHitCenter) < playerState.radius + 0.45) {
          // Player hit by robot's fireball!
          scene.remove(fb.mesh);
          enemyFireballs.splice(i, 1);
          triggerGameOver(false, "You were struck by the Deadly Robot's plasma fireball!");
          return;
        }

        if (fb.life <= 0) {
          scene.remove(fb.mesh);
          enemyFireballs.splice(i, 1);
        }
      }

      // --- 4. THIRD-PERSON CAMERA FOLLOW ---
      updateCamera(dt);
    }

    function updateCamera(dt) {
      const dist = 13.5;
      const offsetX = Math.sin(camYaw) * Math.cos(camPitch) * dist;
      const offsetZ = Math.cos(camYaw) * Math.cos(camPitch) * dist;
      const offsetY = Math.sin(camPitch) * dist;

      const desiredCamPos = new THREE.Vector3(
        playerState.pos.x + offsetX,
        playerState.pos.y + 2.0 + offsetY,
        playerState.pos.z + offsetZ
      );

      camera.position.lerp(desiredCamPos, Math.min(1, dt * 8));
      const lookTarget = new THREE.Vector3(
        playerState.pos.x,
        playerState.pos.y + 1.8,
        playerState.pos.z
      );
      camera.lookAt(lookTarget);
    }

    function animate() {
      requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      updateGame(dt);
      renderer.render(scene, camera);
    }

    window.onload = function () {
      initThreeScene();
      sound.init();
      animate();
    };