
export function setupControls(camera, domElement, avatarSceneRef) {

  
  let isDragging   = false;
  let lastX        = 0;
  let rotationY    = 0;        // current Y rotation of the avatar (radians)
  let velocity     = 0;        // momentum (radians/frame)

  const SENSITIVITY = 0.005;  // radians per pixel
  const DAMPING     = 0.88;   // momentum decay per frame (0 = instant stop, 1 = no stop)

  // ── Apply rotation to avatar root ───────────────────────────────────────
  function applyRotation() {
    const avatar = avatarSceneRef();   // getter — may be null before load
    if (avatar) avatar.rotation.y = rotationY;
  }

  // ── Mouse ────────────────────────────────────────────────────────────────
  function onMouseDown(e) {
    isDragging = true;
    lastX      = e.clientX;
    velocity   = 0;
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const dx  = e.clientX - lastX;
    lastX     = e.clientX;
    rotationY -= dx * SENSITIVITY;
    velocity   = -dx * SENSITIVITY;
    applyRotation();
  }

  function onMouseUp() { isDragging = false; }

  // ── Touch ────────────────────────────────────────────────────────────────
  let lastTouchX = 0;

  function onTouchStart(e) {
    if (e.touches.length !== 1) return;
    isDragging  = true;
    lastTouchX  = e.touches[0].clientX;
    velocity    = 0;
  }

  function onTouchMove(e) {
    if (!isDragging || e.touches.length !== 1) return;
    const dx    = e.touches[0].clientX - lastTouchX;
    lastTouchX  = e.touches[0].clientX;
    rotationY  -= dx * SENSITIVITY;
    velocity    = -dx * SENSITIVITY;
    applyRotation();
    e.preventDefault();
  }

  function onTouchEnd() { isDragging = false; }

  // Block right-click menu
  function onContextMenu(e) { e.preventDefault(); }

  domElement.addEventListener("mousedown",   onMouseDown);
  domElement.addEventListener("mousemove",   onMouseMove);
  domElement.addEventListener("mouseup",     onMouseUp);
  domElement.addEventListener("mouseleave",  onMouseUp);
  domElement.addEventListener("touchstart",  onTouchStart, { passive: false });
  domElement.addEventListener("touchmove",   onTouchMove,  { passive: false });
  domElement.addEventListener("touchend",    onTouchEnd);
  domElement.addEventListener("contextmenu", onContextMenu);

  function update() {
    if (!isDragging && Math.abs(velocity) > 0.0001) {
      rotationY += velocity;
      velocity  *= DAMPING;
      applyRotation();
    }
  }

 
  function dispose() {
    domElement.removeEventListener("mousedown",   onMouseDown);
    domElement.removeEventListener("mousemove",   onMouseMove);
    domElement.removeEventListener("mouseup",     onMouseUp);
    domElement.removeEventListener("mouseleave",  onMouseUp);
    domElement.removeEventListener("touchstart",  onTouchStart);
    domElement.removeEventListener("touchmove",   onTouchMove);
    domElement.removeEventListener("touchend",    onTouchEnd);
    domElement.removeEventListener("contextmenu", onContextMenu);
  }

  return { update, dispose };
}