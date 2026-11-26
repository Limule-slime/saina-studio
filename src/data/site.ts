/** Global settings. Change the links here, not in the pages. */
export const site = {
	name: 'Saina Studio',
	author: 'Mirary Rasolohery',
	email: 'harsmix@gmail.com',
	linkedin: 'https://www.linkedin.com/in/mirary-rasolohery/',
	wordpressProfile: 'https://profiles.wordpress.org/harsmix/',
	accessibilityStatement: '/accessibilite/',
} as const;

/** Public Freemius identifiers. The secret key never goes in this repository. */
export const freemius = {
	productId: '45858',
	planId: '80748',
	publicKey: 'pk_eb83ab793fce7bfed95273abd8515',
} as const;

export const nav = [
	{ label: 'Kits', href: '/#catalogue' },
	{ label: 'Saina Blocks', href: '/kits/saina-blocks/' },
	{ label: 'Accessibilité', href: '/kits/saina-blocks/#accessibilite' },
	{ label: 'Tarifs', href: '/kits/saina-blocks/#tarifs' },
] as const;
