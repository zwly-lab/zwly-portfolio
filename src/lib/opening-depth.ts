import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

export async function createOpeningDepth() {
  const root = document.documentElement;
  const surface = document.querySelector<HTMLElement>(".site-opening")!;
  const previews = [...document.querySelectorAll<HTMLElement>("[data-opening-preview]")];
  const width = surface.clientWidth, height = surface.clientHeight, distance = 1600;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  const resources: { dispose(): void }[] = [renderer];
  let frame = 0, stopped = false;
  let start = () => {};
  const canvas = renderer.domElement;
  canvas.className = "site-depth-canvas";
  canvas.setAttribute("aria-hidden", "true");
  const lost = (event: Event) => {
    event.preventDefault();
    root.dataset.openingDepth = "fallback";
    dispose();
  };
  const dispose = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    canvas.removeEventListener("webglcontextlost", lost);
    document.removeEventListener("opening-play", start);
    canvas.remove();
    resources.reverse().forEach(resource => resource.dispose());
    renderer.forceContextLoss();
  };
  try {
    renderer.setPixelRatio(Math.min(devicePixelRatio, width <= 760 ? 1.25 : 1.5));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(2 * Math.atan(height / (2 * distance))), width / height, 1, 5000);
    camera.position.z = distance;
    const stage = new THREE.Group();
    stage.matrixAutoUpdate = false;
    scene.add(stage);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xaab4a5, .8));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-450, 700, 2200);
    key.castShadow = true;
    key.shadow.mapSize.set(width <= 760 ? 512 : 1024, width <= 760 ? 512 : 1024);
    Object.assign(key.shadow.camera, { left: -width, right: width, top: height, bottom: -height, near: 100, far: 3500 });
    key.shadow.bias = -.0002;
    key.shadow.normalBias = 1.5;
    key.shadow.radius = 5;
    scene.add(key);
    resources.push(key.shadow);
    RectAreaLightUniformsLib.init();
    const softbox = new THREE.RectAreaLight(0xffffff, 2, 650, 160);
    softbox.position.set(-300, 650, 900);
    softbox.lookAt(0, 0, 0);
    scene.add(softbox);
    const floorGeometry = new THREE.PlaneGeometry(width * 2, height * 2);
    const floorMaterial = new THREE.ShadowMaterial({ color: 0x26392d, opacity: .15 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.z = -6;
    floor.receiveShadow = true;
    stage.add(floor);
    resources.push(floorGeometry, floorMaterial);
    const cards = previews.map(preview => {
      const image = preview.querySelector("img")!;
      if (!image.complete || !image.naturalWidth || !preview.offsetWidth || !preview.offsetHeight) throw new Error("Opening artwork is not ready");
      const raster = document.createElement("canvas");
      const ratio = Math.min(2, 1024 / preview.offsetWidth);
      raster.width = Math.round(preview.offsetWidth * ratio);
      raster.height = Math.round(preview.offsetHeight * ratio);
      const context = raster.getContext("2d")!;
      context.scale(ratio, ratio);
      context.fillStyle = "#f3f4ef";
      context.fillRect(0, 0, preview.offsetWidth, preview.offsetHeight);
      const fit = getComputedStyle(image).objectFit === "cover" ? Math.max : Math.min;
      const scale = fit(image.offsetWidth / image.naturalWidth, image.offsetHeight / image.naturalHeight);
      const imageWidth = image.naturalWidth * scale, imageHeight = image.naturalHeight * scale;
      context.drawImage(image, image.offsetLeft + (image.offsetWidth - imageWidth) / 2, image.offsetTop + (image.offsetHeight - imageHeight) / 2, imageWidth, imageHeight);
      const texture = new THREE.CanvasTexture(raster);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      renderer.initTexture(texture);
      const front = new THREE.MeshPhysicalMaterial({ map: texture, roughness: .5, clearcoat: .24, clearcoatRoughness: .4, emissiveMap: texture, emissive: 0xffffff, emissiveIntensity: 0, transparent: true });
      const edge = new THREE.MeshStandardMaterial({ color: 0xcbd3cb, roughness: .4, metalness: .15, transparent: true });
      const halfWidth = preview.offsetWidth / 2 - .8, halfHeight = preview.offsetHeight / 2 - .8, radius = 11.2;
      const outline = new THREE.Shape();
      outline.moveTo(-halfWidth + radius, -halfHeight);
      outline.lineTo(halfWidth - radius, -halfHeight);
      outline.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + radius);
      outline.lineTo(halfWidth, halfHeight - radius);
      outline.quadraticCurveTo(halfWidth, halfHeight, halfWidth - radius, halfHeight);
      outline.lineTo(-halfWidth + radius, halfHeight);
      outline.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - radius);
      outline.lineTo(-halfWidth, -halfHeight + radius);
      outline.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + radius, -halfHeight);
      const geometry = new THREE.ExtrudeGeometry(outline, { depth: 8.4, steps: 1, bevelEnabled: true, bevelSize: .8, bevelThickness: .8, bevelSegments: 2, curveSegments: 6 });
      geometry.translate(0, 0, -4.2);
      const positions = geometry.getAttribute("position"), uv = geometry.getAttribute("uv");
      for (let vertex = 0; vertex < positions.count; vertex++) uv.setXY(vertex, positions.getX(vertex) / preview.offsetWidth + .5, positions.getY(vertex) / preview.offsetHeight + .5);
      const mesh = new THREE.Mesh(geometry, [front, edge]);
      mesh.matrixAutoUpdate = false;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      stage.add(mesh);
      resources.push(texture, front, edge, geometry);
      return { preview, mesh, front, edge, animation: null as Animation | null, x: preview.offsetLeft + preview.offsetWidth / 2 - width / 2, y: height / 2 - preview.offsetTop - preview.offsetHeight / 2 };
    });
    const flipY = new THREE.Matrix4().makeScale(1, -1, 1);
    const cssMatrix = new THREE.Matrix4(), offset = new THREE.Matrix4(), extrusion = new THREE.Matrix4();
    const css = (element: HTMLElement) => cssMatrix.fromArray(new DOMMatrix(getComputedStyle(element).transform).toFloat32Array());
    const render = () => {
      if (stopped) return;
      if (!root.hasAttribute("data-site-opening")) { dispose(); return; }
      let landing = 0;
      cards.forEach(card => {
        const { preview, mesh, front, edge, x, y } = card;
        card.animation ??= preview.getAnimations().find(animation => !(animation instanceof CSSAnimation)) ?? null;
        const time = Number(card.animation?.currentTime ?? 0);
        const blend = THREE.MathUtils.smoothstep(time, 1750, 2220);
        const strength = THREE.MathUtils.smoothstep(time, 0, 350) * (1 - blend);
        landing = Math.max(landing, blend);
        const thickness = Math.max(.03, strength);
        mesh.matrix.makeTranslation(x, y, 0).multiply(flipY).multiply(css(preview)).multiply(flipY).multiply(offset.makeTranslation(0, 0, -5 * thickness)).multiply(extrusion.makeScale(1, 1, thickness));
        const opacity = Number(getComputedStyle(preview).opacity);
        mesh.visible = opacity > .001;
        mesh.castShadow = opacity > .5 && strength > .01;
        front.opacity = opacity;
        edge.opacity = opacity * strength;
        front.color.setScalar(.12 * strength);
        front.emissiveIntensity = 1 - .12 * strength;
        // Keep one shader variant throughout landing; zero would compile a new program mid-flight.
        front.clearcoat = Math.max(.0001, .24 * strength);
      });
      const elapsed = Number(cards[0].animation?.currentTime ?? 0);
      floorMaterial.opacity = .11 * THREE.MathUtils.smoothstep(elapsed, 0, 350) * (1 - landing);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    start = () => { cancelAnimationFrame(frame); render(); };
    await renderer.compileAsync(scene, camera);
    if (root.hasAttribute("data-site-opening")) {
      renderer.render(scene, camera);
      await new Promise(requestAnimationFrame);
    }
    if (root.hasAttribute("data-site-opening")) {
      document.body.appendChild(canvas);
      canvas.addEventListener("webglcontextlost", lost);
      document.addEventListener("opening-play", start);
      render();
    }
    return dispose;
  } catch (error) { dispose(); throw error; }
}
