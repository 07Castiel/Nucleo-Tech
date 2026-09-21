// Núcleo Tech — splash 3D (source). Bundle de produção: intro/intro.bundle.js
// Rebuild: npx esbuild intro/src/intro-core.js --bundle --minify --format=esm --outfile=intro/intro.bundle.js
import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Group,
	Mesh,
	MeshStandardMaterial,
	ShadowMaterial,
	MeshBasicMaterial,
	PlaneGeometry,
	ExtrudeGeometry,
	ShapePath,
	DirectionalLight,
	AmbientLight,
	Color,
	CanvasTexture,
	SRGBColorSpace,
	PCFSoftShadowMap,
	MathUtils,
	DoubleSide,
} from 'three';

// Fonte única do texto da intro. O fallback estático (prefers-reduced-motion,
// em index.html) e o botão "PULAR" reproduzem este mesmo texto/cores à mão,
// já que aquele caminho não carrega este bundle.
export const INTRO_TEXT = 'NÚCLEO TECH';

const CYAN = '#00ffff';
const MAGENTA = '#ff00ff';

const [WORD_A, WORD_B] = INTRO_TEXT.split(' ');
const WORD_NUCLEO = { chars: Array.from(WORD_A), color: CYAN };
const WORD_TECH = { chars: Array.from(WORD_B), color: MAGENTA };

// Timeline (ms) — soma ~2.62s de animação, deixando margem sob o teto de 2.8s
// mesmo somando o carregamento inicial (fonte + módulo, tipicamente <300ms local).
const T = {
	BG: 200,
	STAGGER: 55,
	FALL: 500,
	SQUASH: 70,
	BOUNCE: 280,
	MICRO: 120,
	PAUSE: 300,
	EXIT: 400,
	SKIP_EXIT: 200,
};

const DROP_HEIGHT = 3.2;
const HOP_FRAC = 0.15;
const MICRO_FRAC = 0.04;

function easeInQuad(p) {
	return p * p;
}
function easeOutQuad(p) {
	return 1 - (1 - p) * (1 - p);
}
function clamp01(v) {
	return v < 0 ? 0 : v > 1 ? 1 : v;
}

// Reimplementação mínima do FontLoader/TextGeometry do three.js (examples/jsm),
// evitando vendorizar os módulos jsm extra. Formato "typeface.json" do facetype.js:
// outline tokens 'q'/'b' vêm como [end.x end.y ctrl(s).x ctrl(s).y ...].
function glyphToShapes(glyphData, size, resolution) {
	const scale = size / resolution;
	const path = new ShapePath();
	const outline = glyphData.o.split(' ');
	let i = 0;
	while (i < outline.length) {
		const action = outline[i++];
		switch (action) {
			case 'm':
				path.moveTo(+outline[i++] * scale, +outline[i++] * scale);
				break;
			case 'l':
				path.lineTo(+outline[i++] * scale, +outline[i++] * scale);
				break;
			case 'q': {
				const x = +outline[i++] * scale, y = +outline[i++] * scale;
				const cx = +outline[i++] * scale, cy = +outline[i++] * scale;
				path.quadraticCurveTo(cx, cy, x, y);
				break;
			}
			case 'b': {
				const x = +outline[i++] * scale, y = +outline[i++] * scale;
				const c1x = +outline[i++] * scale, c1y = +outline[i++] * scale;
				const c2x = +outline[i++] * scale, c2y = +outline[i++] * scale;
				path.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
				break;
			}
			case 'z':
				break;
		}
	}
	return path.toShapes();
}

function buildLetterGeometry(fontData, char, size, curveSegments) {
	const glyph = fontData.glyphs[char];
	const shapes = glyphToShapes(glyph, size, fontData.resolution);
	const capHeight = (fontData.boundingBox.yMax - fontData.boundingBox.yMin) * (size / fontData.resolution);
	const depth = capHeight * 0.22;
	const bevelThickness = capHeight * 0.02;
	const bevelSize = capHeight * 0.015;

	const geometry = new ExtrudeGeometry(shapes, {
		depth,
		bevelEnabled: true,
		bevelThickness,
		bevelSize,
		bevelSegments: 2,
		curveSegments,
	});

	const xMin = glyph.x_min * (size / fontData.resolution);
	const xMax = glyph.x_max * (size / fontData.resolution);
	const xMid = (xMin + xMax) / 2;
	geometry.translate(-xMid, 0, -depth / 2);

	return { geometry, advance: glyph.ha * (size / fontData.resolution), xMin: xMin - xMid, xMax: xMax - xMid, height: capHeight, depth };
}

function makeContactShadowTexture() {
	const c = document.createElement('canvas');
	c.width = c.height = 128;
	const ctx = c.getContext('2d');
	const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
	g.addColorStop(0, 'rgba(0,0,0,0.55)');
	g.addColorStop(1, 'rgba(0,0,0,0)');
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, 128, 128);
	const tex = new CanvasTexture(c);
	return tex;
}

function buildRow(fontData, words, geometryCache, shadowTex, curveSegments) {
	const rowGroup = new Group();
	const letters = [];
	let cursor = 0;
	const chars = [];
	words.forEach((word, wi) => {
		word.chars.forEach((ch) => chars.push({ ch, color: word.color }));
		if (wi < words.length - 1) chars.push({ ch: null, color: null });
	});

	const materials = new Map();
	function materialFor(color) {
		if (!materials.has(color)) {
			materials.set(
				color,
				new MeshStandardMaterial({ color: new Color(color), roughness: 0.6, metalness: 0.0 })
			);
		}
		return materials.get(color);
	}

	let minX = Infinity, maxX = -Infinity;
	let stepIndex = 0;

	for (const { ch, color } of chars) {
		if (ch === null) {
			cursor += 0.45; // espaço entre palavras
			stepIndex++; // o espaço também consome um passo do stagger
			continue;
		}

		let entry = geometryCache.get(ch);
		if (!entry) {
			entry = buildLetterGeometry(fontData, ch, 1, curveSegments);
			geometryCache.set(ch, entry);
		}

		const pivot = new Group();
		const mesh = new Mesh(entry.geometry, materialFor(color));
		mesh.castShadow = true;
		pivot.add(mesh);

		const blobMat = new MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0, depthWrite: false });
		const blobSize = entry.height * 1.6;
		const blob = new Mesh(new PlaneGeometry(blobSize, blobSize), blobMat);
		blob.rotation.x = -Math.PI / 2;
		blob.position.set(cursor, 0.002, 0);
		rowGroup.add(blob);

		pivot.position.set(cursor, 0, 0);
		rowGroup.add(pivot);

		const rotX = MathUtils.degToRad((Math.random() * 2 - 1) * 10);
		const rotZ = MathUtils.degToRad((Math.random() * 2 - 1) * 10);

		letters.push({
			pivot,
			mesh,
			blob,
			blobMat,
			startDelay: 0, // preenchido depois, em scheduleStagger
			localStep: stepIndex,
			rotX,
			rotZ,
			height: entry.height,
		});

		minX = Math.min(minX, cursor + entry.xMin);
		maxX = Math.max(maxX, cursor + entry.xMax);
		cursor += entry.advance;
		stepIndex++;
	}

	const mid = (minX + maxX) / 2;
	for (const l of letters) {
		l.pivot.position.x -= mid;
		l.blob.position.x -= mid;
		l.baseX = l.pivot.position.x;
	}

	return { rowGroup, letters, naturalWidth: maxX - minX, stepsUsed: stepIndex };
}

function scheduleStagger(rows) {
	// o espaço entre palavras também consome um passo do stagger (pausa
	// natural antes de "TECH"); no mobile, as duas linhas continuam a mesma
	// sequência de stagger em vez de caírem simultaneamente.
	let offset = 0;
	for (const row of rows) {
		for (const l of row.letters) {
			l.startDelay = T.BG + (offset + l.localStep) * T.STAGGER;
		}
		offset += row.stepsUsed;
	}
	return offset;
}

export function runIntro({ container, canvas, fontData, isMobile, colors, onDone, debugFps }) {
	const scene = new Scene();
	const width = window.innerWidth;
	const height = window.innerHeight;

	let fpsEl = null;
	let fpsFrames = 0;
	let fpsWindowStart = 0;
	if (debugFps) {
		fpsEl = document.createElement('div');
		fpsEl.style.cssText =
			'position:fixed;top:8px;left:8px;z-index:2147483647;font:12px/1.4 monospace;color:#0f0;background:rgba(0,0,0,0.6);padding:4px 8px;border-radius:4px;pointer-events:none;';
		fpsEl.textContent = 'FPS: --';
		container.appendChild(fpsEl);
	}

	const camera = new PerspectiveCamera(34, width / height, 0.1, 100);
	const camDist = 6.2;
	const tiltRad = MathUtils.degToRad(10);
	camera.position.set(0, Math.tan(tiltRad) * camDist, camDist);
	camera.lookAt(0, 0, 0);

	const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
	renderer.setSize(width, height);
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFSoftShadowMap;

	const key = new DirectionalLight(0xffffff, 2.0);
	key.position.set(2, 6, 5);
	key.castShadow = true;
	const shadowRes = isMobile ? 512 : 1024;
	key.shadow.mapSize.set(shadowRes, shadowRes);
	key.shadow.camera.near = 1;
	key.shadow.camera.far = 20;
	key.shadow.camera.left = -6;
	key.shadow.camera.right = 6;
	key.shadow.camera.top = 6;
	key.shadow.camera.bottom = -6;
	key.shadow.bias = -0.002;
	scene.add(key);

	const rim = new DirectionalLight(new Color(colors.rim || CYAN), 0.9);
	rim.position.set(-4, 1.5, -4);
	scene.add(rim);

	const ambient = new AmbientLight(0x1a2230, 0.6);
	scene.add(ambient);

	const curveSegments = isMobile ? 4 : 8;
	const geometryCache = new Map();
	const shadowTex = makeContactShadowTexture();

	const lineColor = colors.line || '#ffffff';
	function addFloor(rowGroup, worldWidth) {
		const floorGeo = new PlaneGeometry(worldWidth * 2.4, 6);
		const floor = new Mesh(floorGeo, new ShadowMaterial({ opacity: 0.45 }));
		floor.rotation.x = -Math.PI / 2;
		floor.receiveShadow = true;
		rowGroup.add(floor);

		const lineGeo = new PlaneGeometry(worldWidth * 1.3, 0.012);
		const lineMat = new MeshBasicMaterial({ color: new Color(lineColor), transparent: true, opacity: 0.5, side: DoubleSide });
		const line = new Mesh(lineGeo, lineMat);
		line.rotation.x = -Math.PI / 2;
		line.position.y = 0.001;
		rowGroup.add(line);
	}

	const rowGroups = [];
	let usedSteps = 0;

	if (isMobile) {
		const row1 = buildRow(fontData, [WORD_NUCLEO], geometryCache, shadowTex, curveSegments);
		const row2 = buildRow(fontData, [WORD_TECH], geometryCache, shadowTex, curveSegments);

		const visibleWidthAt = (dist) => 2 * dist * Math.tan(MathUtils.degToRad(camera.fov) / 2) * camera.aspect;
		const targetWidth = visibleWidthAt(camDist) * 0.8;
		const scaleFactor = targetWidth / row1.naturalWidth;

		row1.rowGroup.scale.setScalar(scaleFactor);
		row2.rowGroup.scale.setScalar(scaleFactor);

		const gap = row1.letters[0].height * scaleFactor * 2.6;
		row1.rowGroup.position.y = gap / 2;
		row2.rowGroup.position.y = -gap / 2;

		addFloor(row1.rowGroup, row1.naturalWidth);
		addFloor(row2.rowGroup, row2.naturalWidth);

		scene.add(row1.rowGroup, row2.rowGroup);
		rowGroups.push(row1, row2);
	} else {
		const row = buildRow(fontData, [WORD_NUCLEO, WORD_TECH], geometryCache, shadowTex, curveSegments);

		const visibleWidthAt = (dist) => 2 * dist * Math.tan(MathUtils.degToRad(camera.fov) / 2) * camera.aspect;
		const targetWidth = visibleWidthAt(camDist) * 0.75;
		const scaleFactor = targetWidth / row.naturalWidth;

		row.rowGroup.scale.setScalar(scaleFactor);
		addFloor(row.rowGroup, row.naturalWidth);

		scene.add(row.rowGroup);
		rowGroups.push(row);
	}

	usedSteps = scheduleStagger(rowGroups);

	for (const group of rowGroups) {
		for (const l of group.letters) {
			l.pivot.position.y = DROP_HEIGHT;
			l.pivot.rotation.x = l.rotX;
			l.pivot.rotation.z = l.rotZ;
		}
	}

	const lastStart = T.BG + (usedSteps - 1) * T.STAGGER;
	const allSettledAt = lastStart + T.FALL + T.SQUASH + T.BOUNCE + T.MICRO;
	const pauseEndsAt = allSettledAt + T.PAUSE;

	let rafId = null;
	let skipped = false;
	let finished = false;

	function updateLetter(l, elapsed) {
		const t0 = l.startDelay;
		let y, sx = 1, sy = 1, sz = 1, rx = 0, rz = 0;

		if (elapsed < t0) {
			y = DROP_HEIGHT;
			rx = l.rotX;
			rz = l.rotZ;
		} else if (elapsed < t0 + T.FALL) {
			const p = (elapsed - t0) / T.FALL;
			y = DROP_HEIGHT * (1 - easeInQuad(p));
			const rp = easeOutQuad(p);
			rx = l.rotX * (1 - rp);
			rz = l.rotZ * (1 - rp);
		} else if (elapsed < t0 + T.FALL + T.SQUASH) {
			const p = (elapsed - t0 - T.FALL) / T.SQUASH;
			y = 0;
			sy = 1 + (0.82 - 1) * easeOutQuad(p);
			sx = 1 + (1.12 - 1) * easeOutQuad(p);
		} else if (elapsed < t0 + T.FALL + T.SQUASH + T.BOUNCE) {
			const p = (elapsed - t0 - T.FALL - T.SQUASH) / T.BOUNCE;
			y = l.height * HOP_FRAC * Math.sin(Math.PI * p);
			sy = p < 0.5 ? 0.82 + (1.06 - 0.82) * (p / 0.5) : 1.06 + (1 - 1.06) * ((p - 0.5) / 0.5);
			sx = p < 0.5 ? 1.12 + (1 - 1.12) * (p / 0.5) : 1;
		} else if (elapsed < t0 + T.FALL + T.SQUASH + T.BOUNCE + T.MICRO) {
			const p = (elapsed - t0 - T.FALL - T.SQUASH - T.BOUNCE) / T.MICRO;
			y = l.height * MICRO_FRAC * Math.sin(Math.PI * p);
			sy = 1;
			sx = 1;
		} else {
			y = 0;
			sy = 1;
			sx = 1;
		}

		l.pivot.position.y = y;
		l.pivot.rotation.x = rx;
		l.pivot.rotation.z = rz;
		l.pivot.scale.set(sx, sy, sz);

		const heightFrac = clamp01(y / DROP_HEIGHT);
		l.blobMat.opacity = 0.55 * (1 - heightFrac);
		const s = 1 - 0.5 * heightFrac;
		l.blob.scale.set(s, s, s);
	}

	const rimBase = rim.intensity;
	const start = performance.now();

	function frame(now) {
		const elapsed = now - start;

		for (const group of rowGroups) {
			for (const l of group.letters) updateLetter(l, elapsed);
		}

		if (elapsed >= allSettledAt && elapsed < pauseEndsAt) {
			const p = (elapsed - allSettledAt) / T.PAUSE;
			rim.intensity = rimBase * (1 + 0.25 * Math.sin(Math.PI * clamp01(p)));
		} else {
			rim.intensity = rimBase;
		}

		renderer.render(scene, camera);

		if (fpsEl) {
			fpsFrames++;
			if (now - fpsWindowStart >= 500) {
				const fps = (fpsFrames * 1000) / (now - fpsWindowStart);
				fpsEl.textContent = 'FPS: ' + fps.toFixed(0);
				fpsFrames = 0;
				fpsWindowStart = now;
			}
		}

		if (!skipped && elapsed >= pauseEndsAt) {
			beginExit(false);
			return;
		}

		rafId = requestAnimationFrame(frame);
	}

	if (fpsEl) fpsWindowStart = start;

	function disposeAll() {
		rowGroups.forEach((g) => {
			g.rowGroup.traverse((obj) => {
				if (obj.geometry) obj.geometry.dispose();
				if (obj.material) {
					if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
					else obj.material.dispose();
				}
			});
		});
		geometryCache.forEach((entry) => entry.geometry.dispose());
		shadowTex.dispose();
		renderer.dispose();
		if (fpsEl && fpsEl.parentNode) fpsEl.parentNode.removeChild(fpsEl);
	}

	function beginExit(fast) {
		if (finished) return;
		if (rafId) cancelAnimationFrame(rafId);

		const dur = fast ? T.SKIP_EXIT : T.EXIT;
		container.style.setProperty('--nt-exit-duration', dur + 'ms');
		container.classList.add('nt-intro--exiting');

		if (!fast) {
			const dollyStart = performance.now();
			function dollyFrame(now) {
				const p = clamp01((now - dollyStart) / dur);
				camera.position.z = camDist - 0.6 * p;
				renderer.render(scene, camera);
				if (p < 1) requestAnimationFrame(dollyFrame);
			}
			requestAnimationFrame(dollyFrame);
		}

		setTimeout(() => {
			finished = true;
			disposeAll();
			onDone();
		}, dur + 30);
	}

	function handleSkip() {
		if (skipped || finished) return;
		skipped = true;
		beginExit(true);
	}

	rafId = requestAnimationFrame(frame);

	return { skip: handleSkip };
}
