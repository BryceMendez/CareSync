import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import "../styles/BuildingModel.css";

const F = {
    body: "'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
};

const hex = (n) => "#" + n.toString(16).padStart(6, "0");

const WINGS = [
    {
        id: "sunrise",
        name: "Sunrise Wing",
        x: 0,
        z: 0,
        w: 12,
        h: 5.5,
        d: 9,
        col: 0x5b8dd4,
        roof: 0x2a4f7f,
        activeCol: 0x2563eb,
        residents: 18,
        staff: 4,
        alerts: 2,
        status: "critical",
        floors: 2,
    },
    {
        id: "garden",
        name: "Garden Wing",
        x: 17,
        z: 0,
        w: 10,
        h: 5.0,
        d: 9,
        col: 0x4eb87a,
        roof: 0x1d6a3a,
        activeCol: 0x059669,
        residents: 14,
        staff: 3,
        alerts: 1,
        status: "warning",
        floors: 2,
    },
    {
        id: "maple",
        name: "Maple Wing",
        x: 0,
        z: 17,
        w: 10,
        h: 4.5,
        d: 9,
        col: 0xe8a44a,
        roof: 0x8a5010,
        activeCol: 0xd97706,
        residents: 10,
        staff: 3,
        alerts: 0,
        status: "normal",
        floors: 1,
    },
    {
        id: "oak",
        name: "Oak Wing",
        x: 17,
        z: 17,
        w: 10,
        h: 4.8,
        d: 9,
        col: 0x9b72cf,
        roof: 0x5a2f90,
        activeCol: 0x7c3aed,
        residents: 6,
        staff: 2,
        alerts: 0,
        status: "normal",
        floors: 1,
    },
];

const GX = -8,
    GZ = 10;

const mkStd = (color, roughness = 0.7, metalness = 0.0, opts = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness, ...opts });

const DAY_CFG = {
    ambientInt: 0.55,
    hemiInt: 1.1,
    sunInt: 2.8,
    fogColor: new THREE.Color(0xc0d8ec),
    fogDensity: 0.011,
    skyTop: new THREE.Color(0x4a90c8),
    skyBot: new THREE.Color(0xd0e8f8),
    lampInt: 0.0,
    starOpacity: 0.0,
};
const NIGHT_CFG = {
    ambientInt: 0.06,
    hemiInt: 0.15,
    sunInt: 0.2,
    fogColor: new THREE.Color(0x060c1a),
    fogDensity: 0.022,
    skyTop: new THREE.Color(0x080d20),
    skyBot: new THREE.Color(0x121830),
    lampInt: 1.6,
    starOpacity: 0.9,
};

export default function BuildingModel() {
    const mountRef = useRef(null);
    const stateRef = useRef(null);
    const frameRef = useRef(null);
    const wingMeshes = useRef({});
    const [selected, setSelected] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [panelData, setPanelData] = useState(null);
    const [isNight, setIsNight] = useState(false);
    const isNightRef = useRef(false);

    const toggleNight = useCallback(() => {
        isNightRef.current = !isNightRef.current;
        setIsNight(isNightRef.current);
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "n" || e.key === "N") toggleNight();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [toggleNight]);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;
        let cancelled = false;
        const raf = requestAnimationFrame(() => {
            if (!cancelled) buildScene(mount);
        });
        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            teardown(mount);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        WINGS.forEach((wing) => {
            const m = wingMeshes.current[wing.id];
            if (!m) return;
            if (selected === wing.id) {
                m.body.material.emissive.set(0xffffff);
                m.body.material.emissiveIntensity = 0.14;
                m.body.scale.y = 1.07;
            } else if (hovered === wing.id) {
                m.body.material.emissive.set(0xffffff);
                m.body.material.emissiveIntensity = 0.08;
                m.body.scale.y = 1.035;
            } else {
                m.body.material.emissive.set(0x000000);
                m.body.material.emissiveIntensity = 0;
                m.body.scale.y = 1.0;
            }
        });
    }, [selected, hovered]);

    function teardown(mount) {
        if (!stateRef.current) return;
        const { renderer, listeners } = stateRef.current;
        cancelAnimationFrame(frameRef.current);
        listeners.forEach(([el, ev, fn, opts]) =>
            el.removeEventListener(ev, fn, opts),
        );
        if (renderer && mount && mount.contains(renderer.domElement)) {
            mount.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
        stateRef.current = null;
        wingMeshes.current = {};
    }

    function buildScene(mount) {
        const W = mount.clientWidth || 800;
        const H = mount.clientHeight || 600;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xb8d4e8);
        scene.fog = new THREE.FogExp2(0xc0d8ec, 0.011);

        const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 500);
        const CX = 8,
            CZ = 8;
        const orbit = {
            theta: Math.PI / 4.5,
            phi: 1.05,
            r: 55,
            thetaV: 0,
            phiV: 0,
            rV: 0,
            damping: 0.86,
        };
        const applyOrbit = () => {
            const { theta, phi, r } = orbit;
            camera.position.set(
                CX + r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi),
                CZ + r * Math.sin(phi) * Math.cos(theta),
            );
            camera.lookAt(CX, 1.5, CZ);
        };
        applyOrbit();

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        mount.appendChild(renderer.domElement);

        const clock = { t: 0 };
        const drag = { active: false, x: 0, y: 0 };
        const nightTrans = { v: 0 };
        const walkData = [];
        const lampLights = [];
        const windowMats = [];
        const lobbyGlows = [];
        const starMats = [];
        const emergBoxMats = [];
        const clouds = [];
        const birds = [];
        const sprays = [];
        let fWater = null;
        let flagMesh = null;

        // ── Sky ──────────────────────────────────────────────────────────────
        const skyGeo = new THREE.SphereGeometry(380, 16, 8);
        skyGeo.scale(-1, 1, 1);
        const skyCols = new Float32Array(skyGeo.attributes.position.count * 3);
        const skyColorAttr = new THREE.Float32BufferAttribute(skyCols, 3);
        skyGeo.setAttribute("color", skyColorAttr);
        const _topDay = DAY_CFG.skyTop,
            _botDay = DAY_CFG.skyBot,
            _topNight = NIGHT_CFG.skyTop,
            _botNight = NIGHT_CFG.skyBot;
        const updateSky = (nt) => {
            const pos = skyGeo.attributes.position;
            const top = _topDay.clone().lerp(_topNight, nt);
            const bot = _botDay.clone().lerp(_botNight, nt);
            for (let i = 0; i < pos.count; i++) {
                const y = pos.getY(i);
                const t2 = Math.max(0, Math.min(1, (y + 380) / 760));
                const c = top.clone().lerp(bot, 1 - t2);
                skyCols[i * 3] = c.r;
                skyCols[i * 3 + 1] = c.g;
                skyCols[i * 3 + 2] = c.b;
            }
            skyColorAttr.needsUpdate = true;
        };
        updateSky(0);
        scene.add(
            new THREE.Mesh(
                skyGeo,
                new THREE.MeshBasicMaterial({ vertexColors: true }),
            ),
        );

        // Stars
        const starGeo = new THREE.BufferGeometry();
        const sv = [];
        for (let i = 0; i < 500; i++) {
            const th = Math.random() * Math.PI * 2,
                ph = Math.random() * Math.PI * 0.45 + 0.1;
            sv.push(
                Math.sin(ph) * Math.cos(th) * 360,
                Math.cos(ph) * 360,
                Math.sin(ph) * Math.sin(th) * 360,
            );
        }
        starGeo.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(sv, 3),
        );
        const starMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.4,
            transparent: true,
            opacity: 0,
        });
        starMats.push(starMat);
        scene.add(new THREE.Points(starGeo, starMat));

        // ── Lighting ─────────────────────────────────────────────────────────
        const ambient = new THREE.AmbientLight(0xcce4ff, 0.55);
        scene.add(ambient);
        const hemi = new THREE.HemisphereLight(0xd6eeff, 0x8aaa70, 1.1);
        scene.add(hemi);
        const sun = new THREE.DirectionalLight(0xfff5e0, 2.8);
        sun.position.set(35, 65, 30);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.camera.left = -65;
        sun.shadow.camera.right = 65;
        sun.shadow.camera.top = 65;
        sun.shadow.camera.bottom = -65;
        sun.shadow.camera.far = 200;
        sun.shadow.bias = -0.0002;
        sun.shadow.radius = 4;
        scene.add(sun);
        const rim = new THREE.DirectionalLight(0x88aaff, 0.5);
        rim.position.set(-30, 25, -20);
        scene.add(rim);
        const moon = new THREE.DirectionalLight(0x6688cc, 0.0);
        moon.position.set(-35, 50, -20);
        scene.add(moon);

        // ── Ground ────────────────────────────────────────────────────────────
        const gnd = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200),
            mkStd(0x6aa86a, 0.95),
        );
        gnd.rotation.x = -Math.PI / 2;
        gnd.receiveShadow = true;
        scene.add(gnd);
        [
            [-5, -5, 6],
            [25, -4, 5],
            [-4, 22, 7],
            [25, 22, 6],
            [8, 8, 8],
        ].forEach(([x, z, r]) => {
            const p = new THREE.Mesh(
                new THREE.CircleGeometry(r, 12),
                mkStd(0x5a9a5a, 0.95),
            );
            p.rotation.x = -Math.PI / 2;
            p.position.set(x, 0.01, z);
            scene.add(p);
        });
        const grid = new THREE.GridHelper(200, 80, 0x4e8a4e, 0x5e9a5e);
        grid.material.opacity = 0.12;
        grid.material.transparent = true;
        scene.add(grid);

        // ── Plaza & paths ─────────────────────────────────────────────────────
        const plazaM = mkStd(0xd8d0c0, 0.92);
        const plaza = new THREE.Mesh(
            new THREE.BoxGeometry(10, 0.12, 10),
            plazaM,
        );
        plaza.position.set(8, 0.06, 8);
        plaza.receiveShadow = true;
        scene.add(plaza);
        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++) {
                const tile = new THREE.Mesh(
                    new THREE.BoxGeometry(2.9, 0.13, 2.9),
                    mkStd(i === j ? 0xcfc8b8 : 0xd4cdb8, 0.9),
                );
                tile.position.set(8 + i * 3.1, 0.065, 8 + j * 3.1);
                tile.receiveShadow = true;
                scene.add(tile);
            }
        const mkPath = (x, z, w, d) => {
            const path = new THREE.Mesh(
                new THREE.BoxGeometry(w, 0.14, d),
                mkStd(0xd0c8b4, 0.9),
            );
            path.position.set(x, 0.07, z);
            path.receiveShadow = true;
            scene.add(path);
            const kerb = new THREE.Mesh(
                new THREE.BoxGeometry(w + 0.1, 0.1, d + 0.1),
                mkStd(0xb8b0a0, 0.9),
            );
            kerb.position.set(x, 0.05, z);
            scene.add(kerb);
        };
        mkPath(8, 3.2, 24, 1.4);
        mkPath(8, 12.8, 24, 1.4);
        mkPath(1.6, 8, 1.4, 13);
        mkPath(14.4, 8, 1.4, 13);
        mkPath(8, 8, 1.4, 13);

        // ── Glass mat ────────────────────────────────────────────────────────
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xb8d8ff,
            roughness: 0.04,
            transmission: 0.85,
            thickness: 0.4,
            transparent: true,
            opacity: 0.5,
            ior: 1.5,
        });
        const mkWinMat = (lit) => {
            if (lit) {
                const m = mkStd(0xfef6c0, 0.25, 0, {
                    emissive: new THREE.Color(0xfef080),
                    emissiveIntensity: 0.0,
                });
                windowMats.push({ mat: m, base: 0.4 + Math.random() * 0.6 });
                return m;
            }
            return new THREE.MeshPhysicalMaterial({
                color: 0x8ab4d8,
                roughness: 0.08,
                transparent: true,
                opacity: 0.55,
            });
        };
        const addWindow = (group, px, py, pz, lit, faceZ = true) => {
            const fw = faceZ ? 1.05 : 0.07,
                fd = faceZ ? 0.07 : 1.05;
            const frame = new THREE.Mesh(
                new THREE.BoxGeometry(fw + 0.22, 0.92, fd + 0.22),
                mkStd(0xe0e8f4, 0.35, 0.25),
            );
            frame.position.set(px, py, pz);
            frame.castShadow = true;
            group.add(frame);
            const pane = new THREE.Mesh(
                new THREE.BoxGeometry(fw, 0.7, fd),
                mkWinMat(lit),
            );
            pane.position.set(px, py, pz + (faceZ ? 0.04 : 0));
            group.add(pane);
        };

        // ── Wings ─────────────────────────────────────────────────────────────
        WINGS.forEach((wing) => {
            const group = new THREE.Group();
            group.position.set(wing.x + wing.w / 2, 0, wing.z + wing.d / 2);
            group.userData = { wingId: wing.id, wing };

            const found = new THREE.Mesh(
                new THREE.BoxGeometry(wing.w + 0.8, 0.6, wing.d + 0.8),
                mkStd(0xa09888, 0.95),
            );
            found.position.y = 0.3;
            found.castShadow = found.receiveShadow = true;
            group.add(found);

            const body = new THREE.Mesh(
                new THREE.BoxGeometry(wing.w, wing.h, wing.d),
                mkStd(wing.col, 0.58, 0.06),
            );
            body.position.y = 0.82 + wing.h / 2;
            body.castShadow = body.receiveShadow = true;
            body.userData = { wingId: wing.id, wing };
            group.add(body);

            const flH = wing.h / (wing.floors + 1);
            for (let fl = 1; fl <= wing.floors; fl++) {
                const band = new THREE.Mesh(
                    new THREE.BoxGeometry(wing.w + 0.1, 0.18, wing.d + 0.1),
                    mkStd(0xc8c0b0, 0.85),
                );
                band.position.y = 0.82 + fl * flH;
                group.add(band);
            }
            const cornice = new THREE.Mesh(
                new THREE.BoxGeometry(wing.w + 0.35, 0.28, wing.d + 0.35),
                mkStd(0xd4ccc0, 0.8),
            );
            cornice.position.y = 0.82 + wing.h + 0.14;
            group.add(cornice);
            const roofH = 2.4;
            const roof = new THREE.Mesh(
                new THREE.CylinderGeometry(0, wing.w * 0.58, roofH, 4, 1),
                mkStd(wing.roof, 0.72, 0.04),
            );
            roof.position.y = 0.82 + wing.h + 0.28 + roofH / 2;
            roof.rotation.y = Math.PI / 4;
            roof.castShadow = true;
            group.add(roof);

            // Solar panels on roof
            for (let sx = -1; sx <= 1; sx += 2)
                for (let sz = -1; sz <= 1; sz += 2) {
                    const sp = new THREE.Mesh(
                        new THREE.BoxGeometry(1.8, 0.06, 1.2),
                        mkStd(0x1a2a55, 0.3, 0.5),
                    );
                    sp.position.set(
                        sx * wing.w * 0.2,
                        0.82 + wing.h + 0.2,
                        sz * wing.d * 0.2,
                    );
                    group.add(sp);
                }

            // Chimneys
            [
                [wing.w * 0.28, wing.d * 0.18],
                [-wing.w * 0.28, wing.d * 0.18],
            ].forEach(([cx, cz]) => {
                const ch = new THREE.Mesh(
                    new THREE.BoxGeometry(0.55, 1.4, 0.55),
                    mkStd(0x8a7060, 0.88),
                );
                ch.position.set(cx, 0.82 + wing.h + 0.28 + roofH * 0.55, cz);
                group.add(ch);
                const pot = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.18, 0.22, 0.28, 8),
                    mkStd(0x6a5040, 0.85),
                );
                pot.position.set(
                    cx,
                    0.82 + wing.h + 0.28 + roofH * 0.55 + 0.84,
                    cz,
                );
                group.add(pot);
            });

            // HVAC
            [
                [wing.w * 0.3, -wing.d * 0.25],
                [-wing.w * 0.3, -wing.d * 0.25],
            ].forEach(([hx, hz]) => {
                const hvac = new THREE.Mesh(
                    new THREE.BoxGeometry(1.2, 0.55, 0.85),
                    mkStd(0xbbbbbb, 0.6, 0.2),
                );
                hvac.position.set(hx, 0.82 + wing.h + 0.55, hz);
                hvac.castShadow = true;
                group.add(hvac);
            });

            // Drainage pipes
            [-wing.w / 2 + 0.1, wing.w / 2 - 0.1].forEach((dx) => {
                const pipe = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.07, 0.07, wing.h + 0.5, 6),
                    mkStd(0x888888, 0.6, 0.2),
                );
                pipe.position.set(dx, 0.82 + wing.h / 2, wing.d / 2 + 0.12);
                group.add(pipe);
            });

            // Emergency call boxes
            [-wing.w / 2 + 1.5, wing.w / 2 - 1.5].forEach((dx) => {
                const box = new THREE.Mesh(
                    new THREE.BoxGeometry(0.22, 0.3, 0.1),
                    mkStd(0xcc1111, 0.6),
                );
                box.position.set(dx, 0.82 + 1.5, wing.d / 2 + 0.12);
                group.add(box);
                const gm = mkStd(0xff2222, 0.1, 0, {
                    emissive: new THREE.Color(0xff0000),
                    emissiveIntensity: 0.0,
                });
                const glow = new THREE.Mesh(
                    new THREE.SphereGeometry(0.09, 6, 6),
                    gm,
                );
                glow.position.set(dx, 0.82 + 1.5, wing.d / 2 + 0.18);
                group.add(glow);
                emergBoxMats.push({ mat: gm, base: 0.6 });
            });

            // Pilasters
            const nP = Math.floor(wing.w / 3);
            for (let i = 0; i <= nP; i++) {
                const px2 = -wing.w / 2 + i * (wing.w / nP);
                const pil = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2, wing.h, 0.2),
                    mkStd(0xc8c0b0, 0.8),
                );
                pil.position.set(px2, 0.82 + wing.h / 2, wing.d / 2 + 0.1);
                group.add(pil);
            }

            // Portico
            const pW = 2.8,
                pD = 1.4,
                pH = wing.h * 0.65;
            const portico = new THREE.Mesh(
                new THREE.BoxGeometry(pW, pH, pD),
                mkStd(0xd0c8b8, 0.78),
            );
            portico.position.set(0, 0.82 + pH / 2, wing.d / 2 + pD / 2);
            portico.castShadow = true;
            group.add(portico);
            [-1.0, 0, 1.0].forEach((ox) => {
                const col2 = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.13, 0.16, pH, 10),
                    mkStd(0xe8e0d0, 0.7),
                );
                col2.position.set(ox, 0.82 + pH / 2, wing.d / 2 + pD + 0.08);
                col2.castShadow = true;
                group.add(col2);
            });
            const ped = new THREE.Mesh(
                new THREE.CylinderGeometry(0, pW * 0.55, 0.9, 4),
                mkStd(0xd8d0c0, 0.75),
            );
            ped.position.set(0, 0.82 + pH + 0.5, wing.d / 2 + pD / 2);
            ped.rotation.y = Math.PI / 4;
            group.add(ped);

            // Door
            const door = new THREE.Mesh(
                new THREE.BoxGeometry(1.45, 2.2, 0.16),
                mkStd(0x2c1810, 0.82, 0.1),
            );
            door.position.set(0, 0.82 + 1.1, wing.d / 2 + pD + 0.1);
            door.castShadow = true;
            group.add(door);
            const handle = new THREE.Mesh(
                new THREE.SphereGeometry(0.09, 8, 8),
                mkStd(0xd4a017, 0.2, 0.85),
            );
            handle.position.set(0.5, 0.82 + 1.05, wing.d / 2 + pD + 0.22);
            group.add(handle);

            // Steps
            const stM = mkStd(0xd4ccc0, 0.88);
            for (let s = 0; s < 4; s++) {
                const st = new THREE.Mesh(
                    new THREE.BoxGeometry(pW + 0.4 + s * 0.5, 0.17, 0.72),
                    stM,
                );
                st.position.set(
                    0,
                    0.08 + s * 0.17,
                    wing.d / 2 + pD + 0.45 + s * 0.72,
                );
                st.receiveShadow = st.castShadow = true;
                group.add(st);
            }
            // Accessible ramp
            const ramp = new THREE.Mesh(
                new THREE.BoxGeometry(1.2, 0.02, 2.5),
                mkStd(0xc0b8a8, 0.88),
            );
            ramp.rotation.x = -0.11;
            ramp.position.set(-2.2, 0.12, wing.d / 2 + pD + 1.5);
            group.add(ramp);

            // Handrails
            [-1.3, 1.3].forEach((ox) => {
                const rail = new THREE.Mesh(
                    new THREE.BoxGeometry(0.06, 0.06, 2.4),
                    mkStd(0x888888, 0.4, 0.5),
                );
                rail.position.set(ox, 0.82, wing.d / 2 + pD + 1.1);
                rail.rotation.x = -0.22;
                group.add(rail);
            });

            // Windows – front
            const winRows = wing.floors + 1,
                winCols = Math.floor(wing.w / 2.8),
                bY = 0.82;
            for (let r = 0; r < winRows; r++)
                for (let c = 0; c < winCols; c++) {
                    addWindow(
                        group,
                        -wing.w / 2 + 1.6 + c * 2.5,
                        bY + 1.1 + r * (wing.h / winRows),
                        wing.d / 2 + 0.05,
                        Math.random() > 0.3,
                        true,
                    );
                }
            // Windows – side
            const sWC = Math.floor(wing.d / 2.8);
            for (let r = 0; r < winRows; r++)
                for (let c = 0; c < sWC; c++) {
                    addWindow(
                        group,
                        wing.w / 2 + 0.05,
                        bY + 1.1 + r * (wing.h / winRows),
                        -wing.d / 2 + 1.5 + c * 2.5,
                        Math.random() > 0.35,
                        false,
                    );
                }

            // Lobby point light (glows at night)
            const lpL = new THREE.PointLight(0xfff5cc, 0.0, 8);
            lpL.position.set(0, 2.5, 0);
            group.add(lpL);
            lobbyGlows.push({ light: lpL, base: 1.6 });

            // Alert beacon
            if (wing.alerts > 0) {
                const aC = wing.status === "critical" ? 0xef4444 : 0xf59e0b;
                const pole = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.065, 0.065, 3.2, 8),
                    mkStd(0x777777, 0.4, 0.65),
                );
                pole.position.set(wing.w * 0.4, 0.82 + wing.h + 1.7, 0);
                group.add(pole);
                const beacon = new THREE.Mesh(
                    new THREE.SphereGeometry(0.32, 14, 14),
                    mkStd(aC, 0.2, 0, {
                        emissive: new THREE.Color(aC),
                        emissiveIntensity: 1.1,
                    }),
                );
                beacon.position.set(wing.w * 0.4, 0.82 + wing.h + 3.5, 0);
                beacon.userData = { isAlert: true };
                group.add(beacon);
                const bL = new THREE.PointLight(aC, 1.5, 10);
                bL.position.set(wing.w * 0.4, 0.82 + wing.h + 3.5, 0);
                bL.userData = { isAlertLight: true };
                group.add(bL);
            }

            const gutter = new THREE.Mesh(
                new THREE.BoxGeometry(wing.w + 0.5, 0.12, 0.18),
                mkStd(0x888070, 0.7, 0.2),
            );
            gutter.position.set(0, 0.82 + wing.h + 0.3, wing.d / 2 + 0.04);
            group.add(gutter);

            scene.add(group);
            wingMeshes.current[wing.id] = { group, body };
        });

        // ── Central Lobby ────────────────────────────────────────────────────
        const lG = new THREE.Group();
        lG.position.set(CX, 0, CZ);
        const lFound = new THREE.Mesh(
            new THREE.CylinderGeometry(3.8, 4.0, 0.6, 16),
            mkStd(0xa09888, 0.92),
        );
        lFound.position.y = 0.3;
        lFound.receiveShadow = true;
        lG.add(lFound);
        const lBody = new THREE.Mesh(
            new THREE.CylinderGeometry(2.9, 3.1, 4.5, 16),
            mkStd(0xe8e0d0, 0.62, 0.05),
        );
        lBody.position.y = 0.6 + 2.25;
        lBody.castShadow = lBody.receiveShadow = true;
        lG.add(lBody);
        const lDome = new THREE.Mesh(
            new THREE.SphereGeometry(
                3.0,
                18,
                9,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2,
            ),
            mkStd(0xd0c8a8, 0.68, 0.04),
        );
        lDome.position.y = 0.6 + 4.5;
        lDome.castShadow = true;
        lG.add(lDome);
        for (let i = 0; i < 10; i++) {
            const a = (i / 10) * Math.PI * 2;
            const col3 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.16, 0.2, 4.2, 10),
                mkStd(0xece4d4, 0.65),
            );
            col3.position.set(
                Math.sin(a) * 2.95,
                0.6 + 2.1,
                Math.cos(a) * 2.95,
            );
            col3.castShadow = true;
            lG.add(col3);
            const panel = new THREE.Mesh(
                new THREE.BoxGeometry(0.07, 3.0, 1.65),
                glassMat,
            );
            const pa = (i / 10) * Math.PI * 2 + Math.PI / 10;
            panel.position.set(
                Math.sin(pa) * 2.6,
                0.6 + 2.2,
                Math.cos(pa) * 2.6,
            );
            panel.rotation.y = -pa;
            lG.add(panel);
        }
        for (let s = 0; s < 3; s++) {
            const step = new THREE.Mesh(
                new THREE.CylinderGeometry(
                    4.1 + s * 0.75,
                    4.2 + s * 0.75,
                    0.18,
                    18,
                ),
                mkStd(0xd4ccc0, 0.88),
            );
            step.position.y = 0.09 + s * 0.18;
            step.receiveShadow = step.castShadow = true;
            lG.add(step);
        }
        const lobbyGlowPt = new THREE.PointLight(0xfff5cc, 0.0, 10);
        lobbyGlowPt.position.set(0, 2.0, 0);
        lG.add(lobbyGlowPt);
        lobbyGlows.push({ light: lobbyGlowPt, base: 2.2 });
        const fpole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.07, 8, 8),
            mkStd(0xbbbbbb, 0.35, 0.7),
        );
        fpole.position.set(2.0, 4.0, 0);
        lG.add(fpole);
        flagMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 0.9, 0.04),
            mkStd(0xd32f2f, 0.6),
        );
        flagMesh.position.set(2.8, 7.6, 0);
        lG.add(flagMesh);
        scene.add(lG);

        // ── Corridors ────────────────────────────────────────────────────────
        [
            [8, 4.5, 1.7, 3.2],
            [8, 11.5, 1.7, 3.2],
            [4.5, 8, 3.2, 1.7],
            [11.5, 8, 3.2, 1.7],
        ].forEach(([x, z, w, d]) => {
            const base = new THREE.Mesh(
                new THREE.BoxGeometry(w + 0.4, 0.44, d + 0.4),
                mkStd(0xa09888, 0.92),
            );
            base.position.set(x, 0.22, z);
            base.receiveShadow = true;
            scene.add(base);
            const body2 = new THREE.Mesh(
                new THREE.BoxGeometry(w, 2.8, d),
                mkStd(0xd8d0c4, 0.72),
            );
            body2.position.set(x, 0.44 + 1.4, z);
            body2.castShadow = body2.receiveShadow = true;
            scene.add(body2);
            const gr = new THREE.Mesh(
                new THREE.BoxGeometry(w, 0.12, d * 0.6),
                glassMat,
            );
            gr.position.set(x, 0.44 + 2.8, z);
            scene.add(gr);
        });

        // ── Fountain ─────────────────────────────────────────────────────────
        const stM2 = mkStd(0xd8cdb4, 0.88);
        const basinO = new THREE.Mesh(
            new THREE.CylinderGeometry(2.6, 2.85, 0.5, 20),
            stM2,
        );
        basinO.position.set(GX, 0.25, GZ);
        basinO.receiveShadow = true;
        scene.add(basinO);
        fWater = new THREE.Mesh(
            new THREE.CylinderGeometry(1.92, 1.92, 0.1, 20),
            new THREE.MeshPhysicalMaterial({
                color: 0x4ab8e8,
                emissive: 0x0077aa,
                emissiveIntensity: 0.3,
                roughness: 0.04,
                transparent: true,
                opacity: 0.78,
            }),
        );
        fWater.position.set(GX, 0.52, GZ);
        scene.add(fWater);
        const fCol2 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.22, 2.4, 10),
            mkStd(0xc8c0b0, 0.7, 0.1),
        );
        fCol2.position.set(GX, 1.6, GZ);
        scene.add(fCol2);
        const upB = new THREE.Mesh(
            new THREE.CylinderGeometry(0.85, 0.95, 0.3, 16),
            stM2,
        );
        upB.position.set(GX, 2.9, GZ);
        scene.add(upB);
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const sp = new THREE.Mesh(
                new THREE.SphereGeometry(0.07, 5, 5),
                new THREE.MeshBasicMaterial({
                    color: 0xaae0ff,
                    transparent: true,
                    opacity: 0.65,
                }),
            );
            sp.position.set(
                GX + Math.sin(a) * 0.75,
                3.1,
                GZ + Math.cos(a) * 0.75,
            );
            sp.userData = { phase: i };
            scene.add(sp);
            sprays.push(sp);
        }
        for (let i = 0; i < 24; i++) {
            const a = (i / 24) * Math.PI * 2;
            const stone = new THREE.Mesh(
                new THREE.BoxGeometry(0.68, 0.08, 0.68),
                mkStd(0xd0c8b8, 0.9),
            );
            stone.position.set(
                GX + Math.sin(a) * 3.7,
                0.04,
                GZ + Math.cos(a) * 3.7,
            );
            stone.rotation.y = a;
            scene.add(stone);
        }

        // ── Benches ──────────────────────────────────────────────────────────
        const mkBench = (x, z, ry) => {
            const g = new THREE.Group();
            g.position.set(x, 0, z);
            g.rotation.y = ry;
            const bM = mkStd(0x8b5e3c, 0.72),
                lM = mkStd(0x444444, 0.35, 0.6);
            for (let s = 0; s < 3; s++) {
                const sl = new THREE.Mesh(
                    new THREE.BoxGeometry(1.55, 0.08, 0.1),
                    bM,
                );
                sl.position.set(0, 0.5, -0.12 + s * 0.12);
                g.add(sl);
            }
            [-0.55, 0.55].forEach((ox) => {
                const leg = new THREE.Mesh(
                    new THREE.BoxGeometry(0.08, 0.5, 0.04),
                    lM,
                );
                leg.position.set(ox, 0.25, 0);
                g.add(leg);
            });
            g.traverse((c) => {
                if (c.isMesh) c.castShadow = true;
            });
            scene.add(g);
        };
        mkBench(GX - 3.1, GZ, 0);
        mkBench(GX + 3.1, GZ, 0);
        mkBench(GX, GZ - 3.1, Math.PI / 2);
        mkBench(GX, GZ + 3.1, Math.PI / 2);
        mkBench(-2, 3, -0.3);
        mkBench(18, 3, 0.3);
        mkBench(18, 13, 0.3);
        mkBench(-2, 13, -0.3);

        // ── Lamp posts ────────────────────────────────────────────────────────
        const mkLamp = (x, z) => {
            const g = new THREE.Group();
            g.position.set(x, 0, z);
            const post = new THREE.Mesh(
                new THREE.CylinderGeometry(0.065, 0.09, 4.5, 8),
                mkStd(0x333333, 0.55, 0.5),
            );
            post.position.y = 2.25;
            post.castShadow = true;
            g.add(post);
            const arm = new THREE.Mesh(
                new THREE.BoxGeometry(0.06, 0.06, 0.75),
                mkStd(0x333333, 0.55, 0.5),
            );
            arm.position.set(0, 4.4, 0.38);
            g.add(arm);
            const head = new THREE.Mesh(
                new THREE.CylinderGeometry(0.16, 0.22, 0.28, 8),
                mkStd(0x222222, 0.4, 0.4),
            );
            head.position.set(0, 4.3, 0.7);
            g.add(head);
            const bulbM = mkStd(0xfff8d0, 0.1, 0, {
                emissive: new THREE.Color(0xffe870),
                emissiveIntensity: 0.0,
            });
            const bulb = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 8, 8),
                bulbM,
            );
            bulb.position.set(0, 4.16, 0.7);
            g.add(bulb);
            const spl = new THREE.SpotLight(
                0xfff0a0,
                0.0,
                14,
                Math.PI / 5,
                0.5,
                1.5,
            );
            spl.position.set(0, 4.1, 0.7);
            spl.target.position.set(0, 0, 0.7);
            g.add(spl);
            g.add(spl.target);
            lampLights.push({ light: spl, mat: bulbM });
            g.traverse((c) => {
                if (c.isMesh) c.castShadow = true;
            });
            scene.add(g);
        };
        [
            [-1, 3.5],
            [-1, 12.5],
            [17, 3.5],
            [17, 12.5],
            [3.5, -1],
            [12.5, -1],
            [3.5, 17],
            [12.5, 17],
            [GX - 2, GZ + 3.8],
            [GX + 2, GZ + 3.8],
            [GX - 2, GZ - 3.8],
            [GX + 2, GZ - 3.8],
        ].forEach(([x, z]) => mkLamp(x, z));

        // ── Flower beds ───────────────────────────────────────────────────────
        const mkBed = (x, z, w, d, colors) => {
            const bed = new THREE.Mesh(
                new THREE.BoxGeometry(w, 0.35, d),
                mkStd(0x6b4226, 0.96),
            );
            bed.position.set(x, 0.175, z);
            scene.add(bed);
            for (let i = 0; i < Math.floor(w * d * 1.8); i++) {
                const fx = x + (Math.random() - 0.5) * w * 0.8,
                    fz2 = z + (Math.random() - 0.5) * d * 0.8;
                const h = 0.35 + Math.random() * 0.25;
                const stem = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.03, 0.03, h, 4),
                    mkStd(0x2d7a20, 0.9),
                );
                stem.position.set(fx, 0.35 + h / 2, fz2);
                scene.add(stem);
                const fl = new THREE.Mesh(
                    new THREE.SphereGeometry(0.12 + Math.random() * 0.06, 6, 5),
                    mkStd(
                        colors[Math.floor(Math.random() * colors.length)],
                        0.7,
                    ),
                );
                fl.position.set(fx, 0.35 + h + 0.1, fz2);
                scene.add(fl);
            }
        };
        mkBed(-4, 3, 3, 2.2, [0xff6b8a, 0xff4466]);
        mkBed(-4, 8, 3, 2.2, [0xffdd44, 0xffcc22]);
        mkBed(-4, 13, 3, 2.2, [0xaa88ff, 0x9966ee]);
        mkBed(29, 3, 3, 2.2, [0xff8844, 0xff6622]);
        mkBed(29, 8, 3, 2.2, [0xff6b8a, 0xee4499]);
        mkBed(29, 13, 3, 2.2, [0x55ccff, 0x33bbff]);
        mkBed(6, -4, 4, 2.2, [0xff88bb, 0xffaabb]);
        mkBed(12, -4, 4, 2.2, [0xffdd55, 0xffcc33]);
        mkBed(6, 28, 4, 2.2, [0x88ddff, 0x66ccff]);
        mkBed(12, 28, 4, 2.2, [0xff9999, 0xff7788]);

        // ── Hedges ────────────────────────────────────────────────────────────
        const mkHedge = (x, z, w, d, h = 0.8) => {
            const hg = new THREE.Mesh(
                new THREE.BoxGeometry(w, h, d),
                mkStd(0x2a6a22, 0.88),
            );
            hg.position.set(x, h / 2, z);
            hg.castShadow = true;
            scene.add(hg);
        };
        mkHedge(-2.5, 3, 0.5, 5.5, 0.9);
        mkHedge(-2.5, 13, 0.5, 5.5, 0.9);
        mkHedge(18.5, 3, 0.5, 5.5, 0.9);
        mkHedge(18.5, 13, 0.5, 5.5, 0.9);
        mkHedge(6, -2.5, 5.5, 0.5, 0.9);
        mkHedge(12, -2.5, 5.5, 0.5, 0.9);
        mkHedge(6, 18.5, 5.5, 0.5, 0.9);
        mkHedge(12, 18.5, 5.5, 0.5, 0.9);

        // ── Trees ─────────────────────────────────────────────────────────────
        const mkTree = (x, z, h, lc, tc = 0x6b3a1f) => {
            const g = new THREE.Group();
            g.position.set(x, 0, z);
            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.14, 0.22, h * 0.45, 8),
                mkStd(tc, 0.9),
            );
            trunk.position.y = h * 0.225;
            trunk.castShadow = true;
            g.add(trunk);
            const lMat2 = mkStd(lc || 0x2d7d32, 0.85);
            [
                [0, h * 0.62, 0, 1.0],
                [0.3, h * 0.52, 0.2, 0.72],
                [-0.3, h * 0.5, -0.15, 0.68],
                [0.1, h * 0.72, -0.2, 0.55],
            ].forEach(([ox, oy, oz, s]) => {
                const lv = new THREE.Mesh(
                    new THREE.SphereGeometry(h * 0.5 * s * 0.55, 9, 7),
                    lMat2,
                );
                lv.position.set(ox, oy, oz);
                lv.castShadow = true;
                g.add(lv);
            });
            scene.add(g);
        };
        [
            [-3, -3],
            [20, -3],
            [28, -3],
            [-3, 20],
            [28, 20],
            [-3, 28],
            [20, 28],
            [28, 28],
            [8, -6.5],
            [14, -6.5],
            [8, 30],
            [14, 30],
            [-6.5, 6],
            [-6.5, 14],
            [30, 6],
            [30, 14],
            [GX - 5, GZ - 5],
            [GX + 5, GZ - 5],
            [GX - 5, GZ + 5],
            [GX + 5, GZ + 5],
            [GX - 7, GZ],
            [GX + 7, GZ],
            [GX, GZ - 7],
            [GX, GZ + 7],
        ].forEach(([x, z]) =>
            mkTree(
                x,
                z,
                3.2 + Math.random() * 1.8,
                Math.random() > 0.5 ? 0x2d7d32 : 0x388e3c,
            ),
        );
        mkTree(GX - 4.5, GZ - 5.5, 4, 0xf8bbd0, 0x8b6347);
        mkTree(GX + 4.5, GZ - 5.5, 4, 0xf9a8d4, 0x8b6347);
        mkTree(GX, GZ + 6, 4.5, 0xfce4ec, 0x8b6347);

        // ── Parking + cars ────────────────────────────────────────────────────
        const pkB = new THREE.Mesh(
            new THREE.BoxGeometry(14, 0.12, 8),
            mkStd(0x888880, 0.96),
        );
        pkB.position.set(20.5, 0.06, 3);
        pkB.receiveShadow = true;
        scene.add(pkB);
        for (let i = 0; i < 5; i++) {
            const ln = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.13, 6),
                mkStd(0xffffff, 0.85),
            );
            ln.position.set(14.8 + i * 2.5, 0.07, 3);
            scene.add(ln);
        }
        const mkCar = (x, z, color) => {
            const g = new THREE.Group();
            g.position.set(x, 0, z);
            const b = new THREE.Mesh(
                new THREE.BoxGeometry(2.2, 0.55, 1.1),
                mkStd(color, 0.45, 0.15),
            );
            b.position.y = 0.45;
            b.castShadow = true;
            g.add(b);
            const c2 = new THREE.Mesh(
                new THREE.BoxGeometry(1.3, 0.42, 1.0),
                mkStd(color, 0.4, 0.1),
            );
            c2.position.set(-0.15, 0.88, 0);
            g.add(c2);
            [
                [0.7, 0.22, 0.44],
                [-0.7, 0.22, 0.44],
                [0.7, 0.22, -0.44],
                [-0.7, 0.22, -0.44],
            ].forEach(([wx, wy, wz]) => {
                const wh = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.22, 0.22, 0.14, 10),
                    mkStd(0x222222, 0.9),
                );
                wh.rotation.z = Math.PI / 2;
                wh.position.set(wx, wy, wz);
                g.add(wh);
            });
            scene.add(g);
        };
        mkCar(15.5, 3, 0xc0392b);
        mkCar(18.0, 3, 0x2980b9);
        mkCar(20.5, 3, 0xe0e0e0);
        mkCar(23.0, 3, 0x27ae60);

        // Ambulance
        const ambG = new THREE.Group();
        const ambB2 = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 1.4, 1.6),
            mkStd(0xffffff, 0.5, 0.05),
        );
        ambB2.position.y = 0.9;
        ambG.add(ambB2);
        const rcross = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.7, 0.7),
            mkStd(0xee0000, 0.6),
        );
        rcross.position.set(1.62, 1.1, 0);
        ambG.add(rcross);
        const lightBar2 = new THREE.Mesh(
            new THREE.BoxGeometry(2.0, 0.18, 0.3),
            mkStd(0xdd2222, 0.4),
        );
        lightBar2.position.set(0, 1.65, 0);
        ambG.add(lightBar2);
        [
            [1, 0.45, 0.62],
            [-1, 0.45, 0.62],
            [1, 0.45, -0.62],
            [-1, 0.45, -0.62],
        ].forEach(([wx, wy, wz]) => {
            const wh = new THREE.Mesh(
                new THREE.CylinderGeometry(0.28, 0.28, 0.2, 10),
                mkStd(0x222222, 0.9),
            );
            wh.rotation.z = Math.PI / 2;
            wh.position.set(wx, wy, wz);
            ambG.add(wh);
        });
        ambG.position.set(-4, 0, -5);
        scene.add(ambG);

        // Fire hydrant
        const hy = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.22, 0.65, 8),
            mkStd(0xcc2222, 0.7),
        );
        hy.position.set(14, 0.325, 1);
        scene.add(hy);

        // Signage
        const mkSign = (x, z, ry) => {
            const g = new THREE.Group();
            g.position.set(x, 0, z);
            g.rotation.y = ry;
            const post = new THREE.Mesh(
                new THREE.CylinderGeometry(0.07, 0.08, 2.5, 8),
                mkStd(0x555555, 0.5, 0.5),
            );
            post.position.y = 1.25;
            g.add(post);
            const board = new THREE.Mesh(
                new THREE.BoxGeometry(3.8, 0.9, 0.15),
                mkStd(0x1a3a8a, 0.5, 0.05),
            );
            board.position.y = 2.35;
            board.castShadow = true;
            g.add(board);
            scene.add(g);
        };
        mkSign(8, -2.5, 0);
        mkSign(-2.5, 8, Math.PI / 2);

        // ── Clouds ────────────────────────────────────────────────────────────
        const mkCloud = (cx, cy, cz, sc) => {
            const cg = new THREE.Group();
            [
                [0, 0, 0, 1.0],
                [1.2, 0.1, 0, 0.7],
                [-1.1, 0.1, 0.3, 0.65],
                [0.4, 0.5, 0.4, 0.55],
            ].forEach(([ox, oy, oz, s]) => {
                const cl = new THREE.Mesh(
                    new THREE.SphereGeometry(s * sc, 7, 5),
                    new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.88,
                    }),
                );
                cl.position.set(ox * sc, oy * sc, oz * sc);
                cg.add(cl);
            });
            cg.position.set(cx, cy, cz);
            scene.add(cg);
            const csh = new THREE.Mesh(
                new THREE.CircleGeometry(sc * 1.4, 10),
                mkStd(0x3a5a3a, 0.98, 0, { transparent: true, opacity: 0.1 }),
            );
            csh.rotation.x = -Math.PI / 2;
            csh.position.set(cx, 0.05, cz);
            scene.add(csh);
            return {
                group: cg,
                shadow: csh,
                origX: cx,
                speed: 0.3 + Math.random() * 0.3,
            };
        };
        clouds.push(mkCloud(-30, 70, 0, 4.5));
        clouds.push(mkCloud(20, 80, 10, 3.8));
        clouds.push(mkCloud(-10, 65, -20, 5.2));
        clouds.push(mkCloud(40, 75, 25, 3.5));

        // ── Birds ─────────────────────────────────────────────────────────────
        for (let b = 0; b < 3; b++) {
            const bg = new THREE.Group();
            [-0.25, 0.25].forEach((ox) => {
                const w = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 0.04, 0.18),
                    mkStd(0x333333, 0.7),
                );
                w.position.set(ox, 0, 0);
                bg.add(w);
            });
            bg.userData = { phase: b * ((Math.PI * 2) / 3), r: 12 + b * 4 };
            scene.add(bg);
            birds.push(bg);
        }

        // ── People ────────────────────────────────────────────────────────────
        const mkPerson = (x, z, type) => {
            const g = new THREE.Group();
            g.position.set(x, 0, z);
            let sc2 = 0x388e3c,
                hc = 0xf5c99a,
                pc = 0x5a4030;
            if (type === "elderly") {
                sc2 = 0xd4a8d0;
            } else if (type === "caregiver") {
                sc2 = 0x2563eb;
                pc = 0x1a3a6b;
            } else if (type === "wheelchair") {
                sc2 = 0x9b72cf;
            }
            const bod = new THREE.Mesh(
                new THREE.CylinderGeometry(0.19, 0.21, 0.82, 7),
                mkStd(sc2, 0.8),
            );
            bod.position.y = 0.72;
            bod.castShadow = true;
            g.add(bod);
            const hd = new THREE.Mesh(
                new THREE.SphereGeometry(0.21, 9, 7),
                mkStd(hc, 0.7),
            );
            hd.position.y = 1.4;
            g.add(hd);
            [-0.1, 0.1].forEach((ox) => {
                const lg = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.085, 0.085, 0.58, 6),
                    mkStd(pc, 0.85),
                );
                lg.position.set(ox, 0.3, 0);
                g.add(lg);
            });
            if (type === "wheelchair") {
                [-0.3, 0.3].forEach((ox) => {
                    const wh = new THREE.Mesh(
                        new THREE.TorusGeometry(0.32, 0.04, 7, 12),
                        mkStd(0x888888, 0.45, 0.3),
                    );
                    wh.position.set(ox, 0.2, 0);
                    wh.rotation.x = Math.PI / 2;
                    g.add(wh);
                });
            }
            if (type === "elderly") {
                const cane = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.025, 0.025, 1.0, 5),
                    mkStd(0x8b6914, 0.75),
                );
                cane.position.set(0.3, 0.5, -0.08);
                cane.rotation.z = 0.14;
                g.add(cane);
            }
            g.traverse((c) => {
                if (c.isMesh) c.castShadow = true;
            });
            scene.add(g);
            return g;
        };
        [
            [1, 11, "caregiver"],
            [3, 11, "elderly"],
            [10, 11, "elderly"],
            [11, 4, "caregiver"],
            [19, 11, "elderly"],
            [22, 4, "caregiver"],
            [3, 19, "elderly"],
            [18, 20, "caregiver"],
            [GX - 1.5, GZ + 1, "elderly"],
            [GX + 1.5, GZ + 0.8, "elderly"],
            [GX + 0.5, GZ - 1.5, "caregiver"],
            [GX - 2.5, GZ - 1, "wheelchair"],
            [GX + 2.8, GZ + 0.5, "elderly"],
            [GX - 0.5, GZ + 2.8, "visitor"],
            [7, 5.5, "visitor"],
            [9, 10.5, "caregiver"],
            [8, 6, "elderly"],
            [5, 7, "visitor"],
            [11, 9, "caregiver"],
            [14, 6, "elderly"],
            [3, 5, "visitor"],
        ].forEach(([x, z, type]) => {
            walkData.push({
                mesh: mkPerson(x, z, type),
                baseX: x,
                baseZ: z,
                phase: Math.random() * Math.PI * 2,
                speed: 0.25 + Math.random() * 0.35,
                range: 0.18 + Math.random() * 0.22,
                rotV: (Math.random() - 0.5) * 0.016,
            });
        });

        // ── Interaction ───────────────────────────────────────────────────────
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const getWing = (e) => {
            const rect = mount.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / mount.clientWidth) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / mount.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const bodies = WINGS.map(
                (w) => wingMeshes.current[w.id]?.body,
            ).filter(Boolean);
            const hits = raycaster.intersectObjects(bodies);
            return hits.length > 0 ? hits[0].object.userData : null;
        };
        const onClick = (e) => {
            const hit = getWing(e);
            if (hit?.wing) {
                setSelected(hit.wing.id);
                setPanelData(hit.wing);
            } else {
                setSelected(null);
                setPanelData(null);
            }
        };
        const onMM = (e) => {
            const hit = getWing(e);
            setHovered(hit?.wing?.id || null);
            mount.style.cursor = hit ? "pointer" : "grab";
        };
        const onDown = (e) => {
            drag.active = true;
            drag.x = e.clientX;
            drag.y = e.clientY;
            mount.style.cursor = "grabbing";
        };
        const onUp = () => {
            drag.active = false;
            mount.style.cursor = "grab";
        };
        const onMove = (e) => {
            if (!drag.active) return;
            orbit.thetaV -= (e.clientX - drag.x) * 0.006;
            orbit.phiV += (e.clientY - drag.y) * 0.006;
            drag.x = e.clientX;
            drag.y = e.clientY;
        };
        const onWheel = (e) => {
            orbit.rV += e.deltaY * 0.028;
        };
        const onTS = (e) => {
            if (e.touches.length === 1) {
                drag.active = true;
                drag.x = e.touches[0].clientX;
                drag.y = e.touches[0].clientY;
            }
        };
        const onTM = (e) => {
            if (!drag.active || e.touches.length !== 1) return;
            orbit.thetaV -= (e.touches[0].clientX - drag.x) * 0.006;
            orbit.phiV += (e.touches[0].clientY - drag.y) * 0.006;
            drag.x = e.touches[0].clientX;
            drag.y = e.touches[0].clientY;
            e.preventDefault();
        };
        const onTE = () => {
            drag.active = false;
        };
        const onResize = () => {
            const W2 = mount.clientWidth,
                H2 = mount.clientHeight;
            camera.aspect = W2 / H2;
            camera.updateProjectionMatrix();
            renderer.setSize(W2, H2);
        };

        const listeners = [
            [mount, "click", onClick],
            [mount, "mousemove", onMM],
            [mount, "mousedown", onDown],
            [window, "mouseup", onUp],
            [window, "mousemove", onMove],
            [mount, "wheel", onWheel, { passive: true }],
            [mount, "touchstart", onTS, { passive: true }],
            [mount, "touchmove", onTM, { passive: false }],
            [mount, "touchend", onTE],
            [window, "resize", onResize],
        ];
        listeners.forEach(([el, ev, fn, opts]) =>
            el.addEventListener(ev, fn, opts),
        );

        // ── Animate ───────────────────────────────────────────────────────────
        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            clock.t += 0.016;
            const t = clock.t;

            // Night transition
            const tgt = isNightRef.current ? 1 : 0;
            nightTrans.v += (tgt - nightTrans.v) * 0.03;
            const nt = nightTrans.v;

            ambient.intensity = THREE.MathUtils.lerp(
                DAY_CFG.ambientInt,
                NIGHT_CFG.ambientInt,
                nt,
            );
            hemi.intensity = THREE.MathUtils.lerp(
                DAY_CFG.hemiInt,
                NIGHT_CFG.hemiInt,
                nt,
            );
            sun.intensity = THREE.MathUtils.lerp(
                DAY_CFG.sunInt,
                NIGHT_CFG.sunInt,
                nt,
            );
            moon.intensity = THREE.MathUtils.lerp(0, 0.35, nt);
            scene.fog.color.copy(DAY_CFG.fogColor).lerp(NIGHT_CFG.fogColor, nt);
            scene.fog.density = THREE.MathUtils.lerp(
                DAY_CFG.fogDensity,
                NIGHT_CFG.fogDensity,
                nt,
            );
            updateSky(nt);
            starMats.forEach((m) => {
                m.opacity = THREE.MathUtils.lerp(0, NIGHT_CFG.starOpacity, nt);
            });
            lampLights.forEach(({ light, mat }) => {
                light.intensity = THREE.MathUtils.lerp(
                    0,
                    NIGHT_CFG.lampInt,
                    nt,
                );
                mat.emissiveIntensity = THREE.MathUtils.lerp(0, 1.4, nt);
            });
            windowMats.forEach(({ mat, base }) => {
                mat.emissiveIntensity = THREE.MathUtils.lerp(0, base, nt);
            });
            lobbyGlows.forEach(({ light, base }) => {
                light.intensity = THREE.MathUtils.lerp(0, base, nt);
            });
            emergBoxMats.forEach(({ mat, base }) => {
                mat.emissiveIntensity = THREE.MathUtils.lerp(
                    0,
                    base * (0.5 + Math.sin(t * 2) * 0.5),
                    nt,
                );
            });

            // Orbit
            orbit.theta += orbit.thetaV;
            orbit.phi = Math.max(0.2, Math.min(1.45, orbit.phi + orbit.phiV));
            orbit.r = Math.max(14, Math.min(100, orbit.r + orbit.rV));
            orbit.thetaV *= orbit.damping;
            orbit.phiV *= orbit.damping;
            orbit.rV *= orbit.damping;
            applyOrbit();

            // Beacons
            WINGS.forEach((wing) => {
                const m = wingMeshes.current[wing.id];
                if (!m) return;
                m.group.children.forEach((child) => {
                    if (child.userData.isAlert) {
                        const s = 0.72 + Math.sin(t * 3.5) * 0.32;
                        child.scale.setScalar(s);
                        child.material.emissiveIntensity =
                            0.7 + Math.sin(t * 3.5) * 0.55;
                    }
                    if (child.userData.isAlertLight) {
                        child.intensity = 1.0 + Math.sin(t * 3.5) * 0.8;
                    }
                });
            });

            // People
            walkData.forEach((wd) => {
                wd.mesh.position.x =
                    wd.baseX + Math.sin(t * wd.speed + wd.phase) * wd.range;
                wd.mesh.position.z =
                    wd.baseZ +
                    Math.cos(t * wd.speed * 0.7 + wd.phase) * wd.range * 0.6;
                wd.mesh.rotation.y += wd.rotV;
            });

            // Fountain
            if (fWater)
                fWater.material.emissiveIntensity =
                    0.22 + Math.sin(t * 2.5) * 0.14;
            sprays.forEach((sp) => {
                sp.position.y =
                    3.1 + Math.sin(t * 3 + sp.userData.phase) * 0.13;
                sp.scale.setScalar(
                    0.8 + Math.sin(t * 2.8 + sp.userData.phase * 0.7) * 0.3,
                );
            });

            // Flag
            if (flagMesh)
                flagMesh.rotation.z =
                    Math.sin(t * 1.8) * 0.09 + Math.sin(t * 3.1) * 0.03;

            // Clouds
            clouds.forEach(({ group, shadow, origX, speed }) => {
                const cx = origX + ((t * speed * 3) % 100) - 50;
                group.position.x = cx;
                shadow.position.x = cx;
            });

            // Birds
            birds.forEach((bg, bi) => {
                const ph = bg.userData.phase + t * 0.4;
                bg.position.set(
                    GX + Math.cos(ph) * bg.userData.r,
                    18 + Math.sin(t * 0.7 + bi) * 1.5,
                    GZ + Math.sin(ph) * bg.userData.r,
                );
                bg.rotation.y = -ph - Math.PI / 2;
                if (bg.children[0])
                    bg.children[0].rotation.z = Math.sin(t * 8 + bi) * 0.5;
                if (bg.children[1])
                    bg.children[1].rotation.z = -Math.sin(t * 8 + bi) * 0.5;
            });

            renderer.render(scene, camera);
        };
        animate();

        stateRef.current = { renderer, listeners };
    }

    // ── UI ────────────────────────────────────────────────────────────────────
    const statusColor = (s) =>
        s === "critical" ? "#ef4444" : s === "warning" ? "#f59e0b" : "#10b981";
    const statusLabel = (s) =>
        s === "critical" ? "Critical" : s === "warning" ? "Warning" : "Normal";
    const statusBg = (s) =>
        s === "critical" ? "#fef2f2" : s === "warning" ? "#fffbeb" : "#f0fdf4";

    return (
        <div className="bm-page">
            <div className="bm-toolbar">
                {WINGS.map((w) => {
                    const active = selected === w.id;
                    const wingHex = hex(w.col);
                    const activeHex = hex(w.activeCol);
                    return (
                        <button
                            key={w.id}
                            type="button"
                            className={`bm-wing-chip ${active ? "bm-wing-chip--active" : ""}`}
                            onClick={() => {
                                setSelected((p) => (p === w.id ? null : w.id));
                                setPanelData((p) =>
                                    p?.id === w.id ? null : w,
                                );
                            }}
                            style={{
                                background: active
                                    ? wingHex + "1f"
                                    : wingHex + "12",
                                borderColor: active
                                    ? activeHex
                                    : wingHex + "40",
                                color: activeHex,
                                boxShadow: active
                                    ? `0 0 0 3px ${activeHex}22, var(--cs-shadow-sm)`
                                    : undefined,
                            }}
                        >
                            <span
                                className="bm-wing-chip__dot"
                                style={{ background: wingHex }}
                            />
                            {w.name}
                            {w.alerts > 0 && (
                                <span
                                    className="bm-wing-chip__badge"
                                    style={{
                                        background:
                                            w.status === "critical"
                                                ? "linear-gradient(135deg,#ef4444,#dc2626)"
                                                : "linear-gradient(135deg,#f59e0b,#d97706)",
                                    }}
                                >
                                    {w.alerts}
                                </span>
                            )}
                        </button>
                    );
                })}

                <button
                    type="button"
                    className={`bm-mode-btn ${isNight ? "bm-mode-btn--night" : "bm-mode-btn--day"}`}
                    onClick={toggleNight}
                >
                    {isNight ? "🌙 Night" : "☀️ Day"}
                    <span className="bm-mode-btn__key">(N)</span>
                </button>
                <span className="bm-hint">🖱 Drag · Scroll · Click wing</span>
            </div>

            <div className="bm-main">
                <div ref={mountRef} className="bm-canvas" />

                <div className="bm-sidebar">
                    {panelData ? (
                        <div className="bm-card">
                            <div
                                className="bm-card__stripe"
                                style={{ background: hex(panelData.col) }}
                            />
                            <div className="bm-card__body">
                                <div className="bm-panel__header">
                                    <div
                                        className="bm-panel__icon"
                                        style={{
                                            background: hex(panelData.col) + "20",
                                            border: `1.5px solid ${hex(panelData.col)}40`,
                                        }}
                                    >
                                        🏥
                                    </div>
                                    <div>
                                        <div className="bm-panel__title">
                                            {panelData.name}
                                        </div>
                                        <div className="bm-panel__id">
                                            ID · {panelData.id}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="bm-status-pill"
                                    style={{
                                        background: statusBg(panelData.status),
                                        border: `1px solid ${statusColor(panelData.status)}40`,
                                    }}
                                >
                                    <div
                                        className="bm-status-pill__dot"
                                        style={{
                                            background: statusColor(
                                                panelData.status,
                                            ),
                                        }}
                                    />
                                    <span
                                        className="bm-status-pill__label"
                                        style={{
                                            color: statusColor(panelData.status),
                                        }}
                                    >
                                        {statusLabel(panelData.status)}
                                    </span>
                                </div>

                                <div className="bm-stats-grid">
                                    {[
                                        {
                                            l: "Residents",
                                            v: panelData.residents,
                                            icon: "👤",
                                            c: "#2563eb",
                                        },
                                        {
                                            l: "Staff",
                                            v: panelData.staff,
                                            icon: "👩‍⚕️",
                                            c: "#059669",
                                        },
                                        {
                                            l: "Floors",
                                            v: panelData.floors,
                                            icon: "🏢",
                                            c: "#7c3aed",
                                        },
                                        {
                                            l: "Alerts",
                                            v: panelData.alerts,
                                            icon: "⚠️",
                                            c:
                                                panelData.alerts > 0
                                                    ? "#ef4444"
                                                    : "#10b981",
                                        },
                                    ].map((r) => (
                                        <div key={r.l} className="bm-stat">
                                            <div className="bm-stat__icon">
                                                {r.icon}
                                            </div>
                                            <div
                                                className="bm-stat__val"
                                                style={{ color: r.c }}
                                            >
                                                {r.v}
                                            </div>
                                            <div className="bm-stat__label">
                                                {r.l}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bm-divider" />

                                {[
                                    {
                                        l: "Wing Color",
                                        v: hex(panelData.col).toUpperCase(),
                                    },
                                    { l: "Building H", v: `${panelData.h}m` },
                                    {
                                        l: "Footprint",
                                        v: `${panelData.w}×${panelData.d}m`,
                                    },
                                ].map(({ l, v }) => (
                                    <div key={l} className="bm-detail-row">
                                        <span className="bm-detail-row__label">
                                            {l}
                                        </span>
                                        <span className="bm-detail-row__value">
                                            {v}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bm-empty">
                            <div className="bm-empty__icon">🏥</div>
                            <div className="bm-empty__title">
                                Sunrise Care Center
                            </div>
                            <div className="bm-empty__sub">
                                Click any wing on the 3D model to view details
                            </div>
                            <div
                                className={`bm-mode-hint ${isNight ? "bm-mode-hint--night" : "bm-mode-hint--day"}`}
                            >
                                {isNight
                                    ? "🌙 Night mode — press N to toggle"
                                    : "☀️ Day mode — press N to toggle"}
                            </div>
                        </div>
                    )}

                    <div className="bm-card">
                        <div className="bm-card__body">
                            <div className="bm-section-title">
                                Facility Overview
                            </div>
                            {[
                                { l: "Wings", v: 4, bar: 1.0, c: "#2563eb" },
                                {
                                    l: "Residents",
                                    v: 48,
                                    bar: 0.82,
                                    c: "#0f172a",
                                },
                                { l: "Staff", v: 12, bar: 0.55, c: "#10b981" },
                                { l: "Alerts", v: 3, bar: 0.22, c: "#ef4444" },
                            ].map((r) => (
                                <div key={r.l} className="bm-meter">
                                    <div className="bm-meter__top">
                                        <span className="bm-meter__label">
                                            {r.l}
                                        </span>
                                        <span
                                            className="bm-meter__value"
                                            style={{ color: r.c }}
                                        >
                                            {r.v}
                                        </span>
                                    </div>
                                    <div className="bm-meter__bar">
                                        <div
                                            className="bm-meter__fill"
                                            style={{
                                                width: `${r.bar * 100}%`,
                                                background: `linear-gradient(90deg, ${r.c}aa, ${r.c})`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bm-card">
                        <div className="bm-card__body">
                            <div className="bm-section-title">Legend</div>
                            {[
                                { c: "#ef4444", l: "Critical alert beacon" },
                                { c: "#f59e0b", l: "Warning beacon" },
                                { c: "#10b981", l: "Normal status" },
                                { c: "#2563eb", l: "Caregiver staff" },
                                { c: "#f5c99a", l: "Elderly resident" },
                                { c: "#9b72cf", l: "Wheelchair user" },
                                { c: "#388e3c", l: "Visitor" },
                                { c: "#ffd700", l: "Night: lamps ON" },
                                { c: "#88aaff", l: "Night: windows glow" },
                            ].map((r) => (
                                <div key={r.l} className="bm-legend__row">
                                    <div
                                        className="bm-legend__dot"
                                        style={{ background: r.c }}
                                    />
                                    {r.l}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
