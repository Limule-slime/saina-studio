import { useEffect, useId, useRef, useState } from 'react';

type Item = { label: string; href: string };

/**
 * Mobile navigation: a disclosure button that opens a full-width panel.
 * Escape and a click on a link close it; focus goes back to the button.
 */
export default function MobileMenu({ items }: { items: Item[] }) {
	const [open, setOpen] = useState(false);
	const panelId = useId();
	const buttonRef = useRef<HTMLButtonElement>(null);
	const firstLinkRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		if (!open) return;
		firstLinkRef.current?.focus();
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setOpen(false);
				buttonRef.current?.focus();
			}
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [open]);

	return (
		<div className="mobile-menu">
			<button
				ref={buttonRef}
				type="button"
				className="btn btn--light mobile-menu__toggle"
				aria-expanded={open}
				aria-controls={panelId}
				onClick={() => setOpen((value) => !value)}
			>
				{open ? 'Fermer' : 'Menu'}
			</button>
			<nav id={panelId} className="mobile-menu__panel glass" aria-label="Principale" hidden={!open}>
				<ul>
					{items.map((item, index) => (
						<li key={item.href}>
							<a ref={index === 0 ? firstLinkRef : undefined} href={item.href} onClick={() => setOpen(false)}>
								{item.label}
							</a>
						</li>
					))}
				</ul>
				<a className="btn btn--light btn--block" href="/kits/saina-blocks/#tarifs" onClick={() => setOpen(false)}>
					Télécharger Saina Blocks
				</a>
			</nav>
		</div>
	);
}
