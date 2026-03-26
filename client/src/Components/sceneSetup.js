import * as THREE from "three";

// ── Avatar framing ───────────────────────────────────────────────────────────
//
// The camera LOOKS AT the avatar's chest/sternum area.
// The camera itself is placed LOWER (near waist height) so it tilts upward,
// naturally placing the head in the upper portion of the frame.
//
// Avatar approximate heights (Mixamo T-pose, no scale):
//   Top of head  ≈ 1.85 m
//   Chin         ≈ 1.70 m
//   Sternum      ≈ 1.45 m   ← lookAt target
//   Navel        ≈ 1.05 m   ← camera Y (slightly lower than target)
//   Feet         ≈ 0.00 m

export const LOOK_AT = new THREE.Vector3(0, 1.45, 0); // sternum / upper chest

// Camera Y — placed lower than LOOK_AT so camera tilts up and head is in frame
const CAM_Y = 1.05;

/**
 * Responsive camera distance.
 *
 * The viewport on this machine is ~1536×729 (large widescreen laptop).
 * We use camZ to control how far back the camera sits.
 * A larger camZ = more of the avatar visible (zoom out).
 */
function computeCameraParams(width, height) {
    let camZ;
    let fovDeg;

    if (width >= 1400) {
        // Large desktop / widescreen — needs most zoom-out
        camZ   = 2.8;
        fovDeg = 38;
    } else if (width >= 1024) {
        // Standard desktop
        camZ   = 2.4;
        fovDeg = 38;
    } else if (width >= 640) {
        // Tablet
        camZ   = 2.2;
        fovDeg = 40;
    } else {
        // Mobile
        camZ   = 2.6;
        fovDeg = 44;
    }

    // Extra pullback for portrait viewports (tall & narrow)
    const aspect = width / height;
    if (aspect < 0.75) {
        camZ   += 0.4;
        fovDeg += 4;
    }

    return { camZ, fovDeg };
}

export function createScene(mountEl) {
    const W = mountEl.clientWidth;
    const H = mountEl.clientHeight;

    // ── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = null;

    // ── Camera ─────────────────────────────────────────────────────────────
    const { camZ, fovDeg } = computeCameraParams(W, H);

    const camera = new THREE.PerspectiveCamera(fovDeg, W / H, 0.1, 1000);

    // Camera sits LOWER than LOOK_AT so it tilts upward — head in top of frame.
    camera.position.set(0, CAM_Y, camZ);
    camera.lookAt(LOOK_AT);

    // ── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    mountEl.innerHTML = "";
    mountEl.appendChild(renderer.domElement);

    renderer.domElement.style.width       = "100%";
    renderer.domElement.style.height      = "100%";
    renderer.domElement.style.display     = "block";
    renderer.domElement.style.touchAction = "none";

    // ── Lights ─────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));

    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(2, 4, 3);
    key.castShadow = true;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xeef2ff, 1.0);
    fill.position.set(-2, 1, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 1.5);
    rim.position.set(0, 4, -4);
    scene.add(rim);

    return { scene, camera, renderer };
}

export function handleResize(mountEl, camera, renderer) {
    if (!mountEl) return;

    const W = mountEl.clientWidth;
    const H = mountEl.clientHeight;

    const { camZ, fovDeg } = computeCameraParams(W, H);

    camera.fov    = fovDeg;
    camera.aspect = W / H;
    camera.position.set(0, CAM_Y, camZ);
    camera.lookAt(LOOK_AT);
    camera.updateProjectionMatrix();

    renderer.setSize(W, H);
}
