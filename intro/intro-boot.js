// Bootstrap leve da intro — decide se ela roda e carrega o resto via dynamic import.
// Mantido fora do bundle pesado para não atrasar o parse inicial da página.
(function () {
	const OVERLAY_ID = 'nt-intro';
	// FONT_URL resolve relativo ao documento (como style.css em index.html);
	// BUNDLE_URL resolve relativo a este módulo (import() usa a URL do módulo referenciador).
	const FONT_URL = 'assets/fonts/nucleo-intro-inter-black.typeface.json';
	const BUNDLE_URL = './intro.bundle.js';
	const LOAD_BUDGET_MS = 1000;

	const overlay = document.getElementById(OVERLAY_ID);
	// O script inline síncrono em index.html já decidiu, antes do primeiro
	// paint, se esta sessão já viu a intro (evita flash do hero). Se já viu,
	// ele mesmo escondeu o overlay e destravou o hero — nada a fazer aqui.
	if (!overlay || window.__ntIntroSeen) return;

	function unlockScroll() {
		document.documentElement.classList.remove('nt-intro-lock');
	}

	function finishHero() {
		document.documentElement.classList.add('nt-intro-done');
	}

	function removeOverlay() {
		if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
	}

	function bail() {
		unlockScroll();
		finishHero();
		removeOverlay();
	}

	const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReduced) {
		runReducedMotionFallback();
		return;
	}

	runFullIntro();

	function runReducedMotionFallback() {
		overlay.classList.add('nt-intro--static');
		requestAnimationFrame(() => overlay.classList.add('nt-intro--visible'));
		setTimeout(() => {
			overlay.classList.add('nt-intro--fade-out');
			setTimeout(bail, 420);
		}, 500);
	}

	function runFullIntro() {
		let timedOut = false;
		const timeoutId = setTimeout(() => {
			timedOut = true;
			bail();
		}, LOAD_BUDGET_MS);

		const canvas = overlay.querySelector('.nt-intro__canvas');
		const stage = overlay.querySelector('.nt-intro__stage');
		const isMobile = window.matchMedia('(max-width: 639px)').matches;

		Promise.all([
			import(BUNDLE_URL),
			fetch(FONT_URL).then((r) => {
				if (!r.ok) throw new Error('font fetch failed');
				return r.json();
			}),
		])
			.then(([mod, fontData]) => {
				if (timedOut) return;
				clearTimeout(timeoutId);

				stage.classList.add('nt-intro__stage--live');

				const controller = mod.runIntro({
					container: overlay,
					canvas,
					fontData,
					isMobile,
					colors: { rim: '#00ffff', line: '#ffffff' },
					onDone: bail,
				});

				setupSkip(controller);
			})
			.catch(() => {
				clearTimeout(timeoutId);
				if (!timedOut) bail();
			});

		function setupSkip(controller) {
			let skippedAlready = false;

			function doSkip() {
				if (skippedAlready) return;
				skippedAlready = true;
				if (controller && controller.skip) controller.skip();
				cleanupListeners();
			}

			function onKey(e) {
				doSkip();
			}
			function onClick() {
				doSkip();
			}

			function cleanupListeners() {
				window.removeEventListener('keydown', onKey);
				overlay.removeEventListener('click', onClick);
			}

			window.addEventListener('keydown', onKey);
			overlay.addEventListener('click', onClick);
		}
	}
})();
