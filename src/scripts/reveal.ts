import { gsap } from 'gsap';

/**
 * Reveals headings line by line and blocks with a short rise, once each,
 * when they enter the viewport. Nothing is hidden when motion is reduced:
 * the matching CSS only applies under prefers-reduced-motion: no-preference.
 */
export function initReveal(): void {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const show = (el: Element) => {
		if (el.matches('[data-reveal-lines]')) {
			gsap.to(el.querySelectorAll('.line-inner'), {
				y: 0,
				duration: 1,
				ease: 'expo.out',
				stagger: 0.08,
			});
		} else {
			gsap.to(el, {
				opacity: 1,
				y: 0,
				duration: 0.9,
				ease: 'power3.out',
				delay: Number((el as HTMLElement).dataset.reveal || 0),
			});
		}
	};

	const targets = document.querySelectorAll('[data-reveal], [data-reveal-lines]');
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				observer.unobserve(entry.target);
				show(entry.target);
			}
		},
		{ rootMargin: '0px 0px -8% 0px' },
	);
	targets.forEach((el) => observer.observe(el));

	// A jump to an anchor or a very fast scroll must never leave content hidden.
	window.addEventListener(
		'beforeprint',
		() => targets.forEach(show),
		{ once: true },
	);
}
